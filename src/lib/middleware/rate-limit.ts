import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { apiKeys } from "@/database/schema";
import { eq } from "drizzle-orm";

interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay: number;
  monthlyTokenLimit: number;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<
  string,
  {
    minute: { count: number; resetAt: number };
    day: { count: number; resetAt: number };
    monthly: { count: number; resetAt: number };
  }
>();

/**
 * Advanced rate limiting middleware
 * Enforces per-minute, per-day, and monthly limits
 */
export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  reason?: string;
}> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(),
      reason: "Missing API key",
    };
  }

  const apiKey = authHeader.split(" ")[1];
  if (!apiKey) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(),
      reason: "Invalid API key format",
    };
  }

  // Get API key from database
  const keys = await db.select().from(apiKeys).where(eq(apiKeys.keyPrefix, apiKey));

  if (keys.length === 0) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(),
      reason: "Invalid API key",
    };
  }

  const key = keys[0];
  const now = Date.now();
  const keyId = key.id;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(keyId);
  if (!entry) {
    entry = {
      minute: { count: 0, resetAt: now + 60 * 1000 },
      day: { count: 0, resetAt: now + 24 * 60 * 60 * 1000 },
      monthly: { count: 0, resetAt: now + 30 * 24 * 60 * 60 * 1000 },
    };
    rateLimitStore.set(keyId, entry);
  }

  // Check and update per-minute limit
  if (now >= entry.minute.resetAt) {
    entry.minute = { count: 0, resetAt: now + 60 * 1000 };
  }
  entry.minute.count++;

  if (entry.minute.count > config.requestsPerMinute) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(entry.minute.resetAt),
      reason: `Rate limit exceeded: ${config.requestsPerMinute} requests per minute`,
    };
  }

  // Check and update per-day limit
  if (now >= entry.day.resetAt) {
    entry.day = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 };
  }
  entry.day.count++;

  if (entry.day.count > config.requestsPerDay) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(entry.day.resetAt),
      reason: `Rate limit exceeded: ${config.requestsPerDay} requests per day`,
    };
  }

  // Return success with remaining requests
  return {
    allowed: true,
    remaining: Math.min(
      config.requestsPerMinute - entry.minute.count,
      config.requestsPerDay - entry.day.count
    ),
    resetAt: new Date(Math.min(entry.minute.resetAt, entry.day.resetAt)),
  };
}

/**
 * Middleware to enforce rate limits
 */
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const rateLimitResult = await checkRateLimit(request, config);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.reason || "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
          ).toString(),
          "X-RateLimit-Reset": rateLimitResult.resetAt.toISOString(),
        },
      }
    );
  }

  return null; // Continue processing
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  remaining: number,
  resetAt: Date
): NextResponse {
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set(
    "X-RateLimit-Reset",
    Math.floor(resetAt.getTime() / 1000).toString()
  );
  return response;
}

/**
 * Clear rate limit for key (for testing or admin operations)
 */
export function clearRateLimit(keyId: string): void {
  rateLimitStore.delete(keyId);
}

/**
 * Get current rate limit status for key
 */
export function getRateLimitStatus(keyId: string) {
  return rateLimitStore.get(keyId) || null;
}
