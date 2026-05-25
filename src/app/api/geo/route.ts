import { NextResponse } from 'next/server';

/**
 * GET /api/geo — returns the requester's country code from Vercel's
 * `x-vercel-ip-country` header.
 *
 * Why an endpoint instead of reading `headers()` in the layout?
 * Reading `headers()` in `[locale]/layout.tsx` opts EVERY route under
 * that layout into dynamic rendering, breaking the ISR static
 * pre-rendering this project relies on for cost control (see
 * `vercel-ignore-build.sh` and CLAUDE.md "Static Page Budget"). This
 * route is dynamic by design — every other page stays static.
 *
 * Used by `BrihaspatiShell` to pick the initial pricing currency.
 * Falls back to `null` when the header isn't present (local dev,
 * unauthenticated edge case) — callers should default to USD.
 *
 * No auth required: the country code is already public (the same
 * header is observable from any HTTP probe of the deployment).
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request): Promise<Response> {
  const country = request.headers.get('x-vercel-ip-country') ?? null;
  return NextResponse.json(
    { country },
    {
      headers: {
        // Country can change per-request (VPN, travel), so don't cache
        // shared. Client may cache for the session.
        'Cache-Control': 'private, max-age=300',
      },
    },
  );
}
