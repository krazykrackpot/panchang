/**
 * POST /api/precompute/revalidate — invalidates Next.js cache entries
 * after the nightly precompute writes fresh Blobs.
 *
 * Called by the GH Action cron AFTER the upload-all phase completes.
 * Per plan issue E: never interleave revalidate calls with uploads —
 * the cron MUST finish all writes first, then post a single batched
 * revalidate so edges never serve partial state.
 *
 * Security
 * --------
 * Bearer token using PRECOMPUTE_REVALIDATE_SECRET. Constant-time
 * comparison (timingSafeEqual) to defeat string-comparison timing
 * attacks. The shared secret is a dedicated env var — must NOT reuse
 * any auth token (per memory rule feedback_google_oauth_separation).
 *
 * Rate limiting
 * -------------
 * Reuses the existing checkRateLimit helper. The cron should only call
 * this once per day per route — anything more is a misconfigured
 * client or attack.
 *
 * Body shape
 * ----------
 *   { tags?: string[], paths?: string[] }
 *
 * Either field can be present; each entry is passed to revalidateTag
 * or revalidatePath respectively. Empty arrays are no-ops (intentional
 * — supports "warm the lockfile but don't flip anything" smoke tests).
 *
 * Failure modes
 * -------------
 * - Missing/wrong secret           → 401
 * - PRECOMPUTE_REVALIDATE_SECRET unset → 500 (refuse to default)
 * - Malformed JSON                  → 400
 * - Rate limit exceeded             → 429
 * - revalidate*() throws            → 500 with sanitised message
 *
 * Errors are logged with the [api/precompute/revalidate] tag per
 * CLAUDE.md Lesson AA.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath, updateTag } from 'next/cache';
import { timingSafeEqual } from 'node:crypto';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RevalidateBody {
  tags?: string[];
  paths?: string[];
}

function constantTimeStringEqual(a: string, b: string): boolean {
  // Constant-time only when buffers are the same length. We mask the
  // length disparity by always XOR-ing against a fixed-length buffer.
  if (a.length !== b.length) {
    // Still consume some entropy so we don't leak length difference
    // via early-return timing.
    timingSafeEqual(Buffer.from(a.padEnd(64, '\0')), Buffer.from(b.padEnd(64, '\0')));
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limit BEFORE auth: deny DoS attempts cheaply.
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 30, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  // 2. Auth.
  const expected = process.env.PRECOMPUTE_REVALIDATE_SECRET?.trim();
  if (!expected) {
    console.error('[api/precompute/revalidate] PRECOMPUTE_REVALIDATE_SECRET not set');
    return NextResponse.json({ error: 'Service misconfigured.' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization') ?? '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : '';
  if (!bearer || !constantTimeStringEqual(bearer, expected)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  // 3. Parse + validate body.
  let body: RevalidateBody;
  try {
    body = (await request.json()) as RevalidateBody;
  } catch (err) {
    console.error('[api/precompute/revalidate] body parse failed:', err);
    return NextResponse.json({ error: 'Malformed JSON body.' }, { status: 400 });
  }

  const tags = Array.isArray(body.tags) ? body.tags.filter((t) => typeof t === 'string') : [];
  const paths = Array.isArray(body.paths) ? body.paths.filter((p) => typeof p === 'string') : [];

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json({ revalidated: { tags: 0, paths: 0 } });
  }

  // 4. Execute revalidations. Run sequentially so a failure on entry N
  // doesn't leave the cron unsure how many succeeded. Each revalidate
  // call is fast and synchronous-ish in Next 16 (in-memory cache flag).
  const failedTags: string[] = [];
  const failedPaths: string[] = [];

  for (const tag of tags) {
    try {
      // Next 16 Cache Components: updateTag is the on-demand
      // invalidator (no cacheLife profile needed — the cache entry
      // gets flipped immediately on the next read). Replaces the
      // older revalidateTag which now requires a profile argument.
      updateTag(tag);
    } catch (err) {
      console.error(`[api/precompute/revalidate] updateTag(${tag}) failed:`, err);
      failedTags.push(tag);
    }
  }

  for (const path of paths) {
    try {
      // Next 16 requires the type parameter — 'page' flips just the
      // page's segment cache, 'layout' invalidates all children too.
      // Choghadiya pages are leaf routes; 'page' is the tight target.
      revalidatePath(path, 'page');
    } catch (err) {
      console.error(`[api/precompute/revalidate] revalidatePath(${path}) failed:`, err);
      failedPaths.push(path);
    }
  }

  const ok = failedTags.length === 0 && failedPaths.length === 0;
  return NextResponse.json(
    {
      revalidated: {
        tags: tags.length - failedTags.length,
        paths: paths.length - failedPaths.length,
      },
      ...(failedTags.length || failedPaths.length
        ? { failed: { tags: failedTags, paths: failedPaths } }
        : {}),
    },
    { status: ok ? 200 : 207 }, // 207 Multi-Status when partial
  );
}
