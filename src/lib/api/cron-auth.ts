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
import { timingSafeEqual } from 'node:crypto';

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

  // Constant-time compare on the secret. Plain `===` over-the-wire can leak
  // byte-position information through response timing under adversarial
  // conditions. Vercel's request jitter mostly mitigates this in practice
  // but constant-time is cheap and unambiguous. Audit M16.
  const authHeader = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${cronSecret}`;
  const authBuf = Buffer.from(authHeader);
  const expectedBuf = Buffer.from(expected);
  if (authBuf.length !== expectedBuf.length || !timingSafeEqual(authBuf, expectedBuf)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null; // Auth passed
}
