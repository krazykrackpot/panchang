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
 * **On Vercel**, the platform sets multiple headers we can trust because
 * they're edge-stamped after any client-supplied values are stripped or
 * replaced. The legacy `x-forwarded-for` header is also present, but its
 * LEFTMOST entry is whatever the client sent us — attacker-controlled and
 * trivially rotatable per-request. Previous implementations used the
 * leftmost hop and could be bypassed on /api/checkout, /api/client-error,
 * /api/kundali, etc. (Audit P1-3.)
 *
 * Preference order (strongest trust signal first):
 *
 *   1. `x-vercel-forwarded-for` — Vercel's own edge-stamped header. Highest
 *      trust because the platform sets it AFTER stripping any client-
 *      supplied value. Comma-separated when multiple hops exist; we take
 *      the rightmost (closest-to-Vercel).
 *   2. `x-real-ip` — also Vercel-set, single value. Slightly older API
 *      surface; kept as fallback for edge cases where (1) is absent.
 *   3. RIGHTMOST `x-forwarded-for` hop — the closest-to-our-infrastructure
 *      address. Still beats the leftmost which is attacker-controlled.
 *   4. `unknown:<pathname>` per-route bucket — when none of the above are
 *      present (local dev / tests / non-Vercel envs). The previous
 *      `127.0.0.1` fallback pooled EVERY unidentified request from EVERY
 *      route into one shared rate-limit bucket: a single misbehaving
 *      client could exhaust the budget for all routes simultaneously
 *      (memory `project_audit_deferred_rate_limit_ip`). Segregating by
 *      pathname caps blast radius at one route.
 */
export function getClientIP(request: Request): string {
  const vercelForwarded = request.headers.get('x-vercel-forwarded-for');
  if (vercelForwarded) {
    const hops = vercelForwarded.split(',').map((h) => h.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const hops = forwarded.split(',').map((h) => h.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  try {
    // The base URL is only consulted when `request.url` is a relative
    // path — which Next.js prod never produces (request.url is always
    // absolute), but vitest mocks and some server harnesses do. Without
    // a base the URL ctor throws on relative input and the unknown bucket
    // collapses to `_` for every such request, defeating route
    // segregation. localhost is a safe sentinel — it's only used to
    // parse the path, never to read host/origin.
    return `unknown:${new URL(request.url, 'http://localhost').pathname}`;
  } catch {
    return 'unknown:_';
  }
}
