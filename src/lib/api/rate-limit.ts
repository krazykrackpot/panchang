/**
 * Simple in-memory rate limiter for API routes.
 *
 * LIMITATION: On Vercel serverless, each container has its own Map.
 * Cold starts get a fresh Map, so the rate limit is per-container, not global.
 * This provides partial protection (hot containers do enforce limits) but is
 * NOT a hard security boundary. For strict rate limiting, use Upstash Redis
 * or Vercel Edge Middleware with KV.
 *
 * The in-memory approach still helps because:
 * 1. Hot containers (Fluid Compute reuses instances) DO accumulate counts
 * 2. It prevents accidental infinite loops from a single client
 * 3. It's zero-cost (no external service needed)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Lazy cleanup: evict stale entries on each check, not via setInterval.
// setInterval leaks on serverless (prevents container recycling).
function evictStale(now: number) {
  if (store.size > 500) {
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  maxRequests: number;   // Max requests per window
  windowMs: number;      // Window duration in milliseconds
}

export function checkRateLimit(
  ip: string,
  config: RateLimitConfig = { maxRequests: 60, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  evictStale(now);

  const key = ip;
  let entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + config.windowMs };
    store.set(key, entry);
  }

  entry.count++;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const allowed = entry.count <= config.maxRequests;

  return { allowed, remaining, resetAt: entry.resetAt };
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1';
}
