import httpStatus from "http-status";
import { env } from "./utils/env.js";

export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.code = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  res.status(err.code || 500);
  res.json({
    code: err.code || 500,
    message: err.message || httpStatus["500_MESSAGE"],
  });

  next();
}

const allowedDomains = env.data.ALLOWLIST.split(",");

export const checkDomain = (req, res, next) => {
  const { origin } = req.headers;
  if (!allowedDomains.includes(origin)) {
    res.setHeader("x-amv-trueIP", req.ip || "0.0.0.0");
    res.setHeader("x-amv-trueHost", req.headers.referer || "");
    res.setHeader("x-amv-trueUA", req.headers["user-agent"] || "");
    res.setHeader("x-amv-info", "logged");

    return next();
  }
  next();
};

export const empty = (req, res, next) => {
  next();
};

// Middleware to set CORS headers allowing all origins
export const setCorsHeaders = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow common methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials if needed
  next();
};

export default {
  notFound,
  errorHandler,
  checkDomain,
  empty,
  setCorsHeaders, // Export the new middleware
};
