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

/**
 * Extract the client IP for rate-limit keying.
 *
 * **On Vercel**, the platform sets `x-real-ip` to the actual client IP (the
 * one that hit the Vercel edge). It also appends to `x-forwarded-for` —
 * BUT the leftmost entry in that chain is whatever the client sent us,
 * which is attacker-controlled. Previous implementation used the leftmost
 * hop and could be rotated per-request to bypass rate-limits on
 * /api/checkout, /api/client-error, /api/kundali, etc. (Audit P1-3.)
 *
 * Preference order:
 *   1. `x-real-ip` — Vercel-set, single value, trusted.
 *   2. RIGHTMOST entry of `x-forwarded-for` — the closest-to-Vercel hop
 *      (Vercel's edge appends last); still beats the leftmost which is
 *      attacker-controlled.
 *   3. `127.0.0.1` fallback for local dev.
 */
export function getClientIP(request: Request): string {
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const hops = forwarded.split(',').map(h => h.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return '127.0.0.1';
}
