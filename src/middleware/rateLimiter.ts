import rateLimit from 'express-rate-limit';
import { config } from '../config';

// Standard rate limiter for general API endpoints
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again later.'
    }
  },
});

// Rate limiter for file upload endpoints
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    success: false,
    error: {
      message: 'Upload limit exceeded, please try again later.'
    }
  },
});

// Rate limiter for write operations
export const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    error: {
      message: 'Too many write requests, please slow down.'
    }
  },
});
