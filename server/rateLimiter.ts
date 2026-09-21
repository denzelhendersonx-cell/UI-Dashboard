import { Request, Response, NextFunction } from "express";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
  endpointName: string;
}

/**
 * Enterprise Sliding Window Rate Limiter
 * Guards expensive endpoints (Gemini AI, SMS, Voice, Webhooks, Bulk mutations)
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { limit, windowMs, endpointName } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Key by client IP + endpoint or user ID if authenticated
    const ip = req.ip || req.socket.remoteAddress || "global";
    const userKey = (req as any).tenant?.userId ? `usr_${(req as any).tenant.userId}` : `ip_${ip}`;
    const key = `${endpointName}:${userKey}`;

    const now = Date.now();
    const record = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    rateLimitStore.set(key, record);

    // Set standard rate limit headers
    const remaining = Math.max(0, limit - record.count);
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));

    if (record.count > limit) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit exceeded for ${endpointName}. Maximum allowed is ${limit} requests per ${Math.round(windowMs / 1000)}s.`,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
}
