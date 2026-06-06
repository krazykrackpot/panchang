/**
 * HMAC-signed token for the in-email NPS click-capture flow.
 *
 * Each NPS email is a per-user message: the same recipient sees 11 score
 * buttons (0..10) and clicks one. We need every button URL to identify
 * the user without exposing their auth credentials or session, and
 * without being trivially forgeable by anyone who can guess a uuid.
 *
 * Pattern: token = `${base64url(userId)}.${base64url(HMAC-SHA256(userId))}`.
 *
 *   - Only the user_id is in the token (not the score). The score is a
 *     separate URL param; the same token signs all 11 buttons. This lets
 *     the recipient legitimately change their mind and click a different
 *     score from the same email — handled by the upsert constraint on
 *     (user_id, source).
 *   - HMAC uses `NPS_TOKEN_SECRET`; missing/empty secret in prod is a
 *     hard failure (we throw in sign + return null in verify so the
 *     route surfaces a 500/400 rather than minting an unverifiable
 *     token). Env-var trim per CLAUDE.md.
 *   - `timingSafeEqual` to dodge constant-time side-channels.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

function getSecret(): string {
  const raw = process.env.NPS_TOKEN_SECRET?.trim();
  if (!raw) {
    throw new Error(
      '[nps/token] NPS_TOKEN_SECRET missing or empty — cannot sign/verify NPS click tokens',
    );
  }
  return raw;
}

function base64urlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(s: string): Buffer {
  // Pad to a multiple of 4 before decoding.
  const padded = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, 'base64');
}

/**
 * Sign a user_id into a click-capture token. Throws if the secret env
 * var is missing — callers (the cron + the test harness) should set it
 * before invoking.
 */
export function signNpsToken(userId: string): string {
  if (!userId) throw new Error('[nps/token] userId required');
  const secret = getSecret();
  const payload = Buffer.from(userId, 'utf8');
  const sig = createHmac('sha256', secret).update(payload).digest();
  return `${base64urlEncode(payload)}.${base64urlEncode(sig)}`;
}

/**
 * Verify a token. Returns the embedded user_id on success, null on any
 * tamper / shape error / missing secret. Never throws — the route uses
 * the null return as a 400 signal.
 */
export function verifyNpsToken(token: string | null | undefined): string | null {
  if (!token || typeof token !== 'string') return null;
  const dotAt = token.indexOf('.');
  if (dotAt <= 0 || dotAt >= token.length - 1) return null;

  let payload: Buffer;
  let sig: Buffer;
  try {
    payload = base64urlDecode(token.slice(0, dotAt));
    sig = base64urlDecode(token.slice(dotAt + 1));
  } catch {
    return null;
  }

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return null;
  }

  const expected = createHmac('sha256', secret).update(payload).digest();
  if (expected.length !== sig.length) return null;
  if (!timingSafeEqual(expected, sig)) return null;

  const userId = payload.toString('utf8');
  // Lightweight shape guard — uuid v4 length is 36. Anything else is a
  // tampered or empty payload; rejecting cheaply here saves a Supabase
  // round-trip on the route side.
  if (userId.length < 8 || userId.length > 64) return null;

  return userId;
}
