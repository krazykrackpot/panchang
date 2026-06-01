/**
 * Client-side wrapper around GET /api/geo.
 *
 * Replaces direct calls to https://ipapi.co/json/ that started CORS-failing
 * in May 2026 (upstream stopped sending Access-Control-Allow-Origin).
 *
 * /api/geo reads Vercel edge headers server-side, so there's no CORS issue
 * and no third-party rate limit. Returns null fields when not on Vercel
 * (local dev, CI) — callers must degrade gracefully.
 */
export interface ApiGeo {
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
}

/**
 * Fetch the current request's geo context from the same-origin /api/geo
 * endpoint. Returns null on network failure so callers can branch on the
 * "couldn't determine" case without try/catch.
 */
export async function fetchApiGeo(): Promise<ApiGeo | null> {
  try {
    const res = await fetch('/api/geo', { cache: 'no-store' });
    if (!res.ok) {
      console.error('[geo-from-api] /api/geo returned', res.status);
      return null;
    }
    return (await res.json()) as ApiGeo;
  } catch (err) {
    console.error('[geo-from-api] /api/geo fetch failed:', err);
    return null;
  }
}
