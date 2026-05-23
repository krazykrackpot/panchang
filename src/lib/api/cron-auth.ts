/**
 * Cron Auth — shared authentication for all cron routes.
 *
 * SECURITY FIX (C3): When CRON_SECRET is unset, `Bearer undefined` would
 * bypass auth. This helper rejects ALL requests when the secret is missing.
 *
 * Usage in cron routes:
 *   const authError = verifyCronAuth(request);
 *   if (authError) return authError;
 */

import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';

export function verifyCronAuth(request: Request): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET?.trim();

  // CRITICAL: if CRON_SECRET is not configured, reject ALL requests.
  // Without this, "Bearer undefined" matches and bypasses auth entirely.
  if (!cronSecret) {
    console.error('[cron-auth] CRON_SECRET env var is not set — rejecting request');
    return NextResponse.json(
      { error: 'Cron authentication not configured' },
      { status: 503 },
    );
  }

  // Constant-time compare on the secret. We hash both sides with SHA-256
  // first so the comparison is ALWAYS over equal-length 32-byte buffers —
  // a bare length check before timingSafeEqual would leak the secret's
  // length through early return timing. Audit M16 + Gemini #114 review.
  const authHeader = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${cronSecret}`;
  const authHash = createHash('sha256').update(authHeader).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  if (!timingSafeEqual(authHash, expectedHash)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null; // Auth passed
}
