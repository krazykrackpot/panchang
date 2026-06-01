import { NextResponse } from 'next/server';

/**
 * GET /api/geo — returns geo context for the requester using Vercel's
 * edge headers (x-vercel-ip-*). Replaces direct client calls to
 * ipapi.co/json/, which started CORS-failing in May 2026.
 *
 * Shape:
 *   {
 *     country:   string | null,   // ISO 3166-1 alpha-2, e.g. 'IN'
 *     region:    string | null,
 *     city:      string | null,
 *     latitude:  number | null,
 *     longitude: number | null,
 *     timezone:  string | null,   // IANA, e.g. 'Asia/Kolkata'
 *   }
 *
 * Why an endpoint instead of reading `headers()` in the layout?
 * Reading `headers()` in `[locale]/layout.tsx` opts EVERY route under
 * that layout into dynamic rendering, breaking the ISR static
 * pre-rendering this project relies on for cost control (see
 * `vercel-ignore-build.sh` and CLAUDE.md "Static Page Budget"). This
 * route is dynamic by design — every other page stays static.
 *
 * Locally (no Vercel edge), every field is null. Callers must degrade
 * gracefully (use the user's stored location, ask for location, etc.).
 *
 * No auth required: the geo data is already public (same headers are
 * observable from any HTTP probe of the deployment).
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function decodeCity(raw: string | null): string | null {
  if (!raw) return null;
  // Vercel URL-encodes the city ("San%20Francisco"). Tolerate malformed
  // values without crashing the whole response.
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function parseCoord(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function GET(request: Request): Promise<Response> {
  const h = request.headers;
  const country = h.get('x-vercel-ip-country');
  const region = h.get('x-vercel-ip-country-region');
  const city = decodeCity(h.get('x-vercel-ip-city'));
  const latitude = parseCoord(h.get('x-vercel-ip-latitude'));
  const longitude = parseCoord(h.get('x-vercel-ip-longitude'));
  const timezone = h.get('x-vercel-ip-timezone');

  return NextResponse.json(
    {
      country: country ?? null,
      region: region ?? null,
      city,
      latitude,
      longitude,
      timezone: timezone ?? null,
    },
    {
      headers: {
        // Geo can change per-request (VPN, travel). Don't cache shared.
        // Client may cache for the session.
        'Cache-Control': 'private, max-age=300',
      },
    },
  );
}
