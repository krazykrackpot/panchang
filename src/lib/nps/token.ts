/**
 * HMAC-signed token for the in-email NPS click-capture flow.
 *
 * Each NPS email is a per-user message: the same recipient sees 11 score
 * buttons (0..10) and clicks one. We need every button URL to identify
 * the user without exposing their auth credentials or session, and
 * without being trivially forgeable by anyone who can guess a uuid.
 *
 * Token format (v2 — rotation-safe, current): `${kid}.${payload}.${sig}`
 *   - `kid` = first 6 chars of base64url(sha256(secret)) — 6 chars is
 *     enough to distinguish multiple secret rotations within a single
 *     deployment lifetime, and short enough that the URL stays compact.
 *   - `payload` = base64url(user_id)
 *   - `sig`     = base64url(HMAC-SHA256(user_id, secret))
 *
 * Legacy format (v1, pre-rotation-safety): `${payload}.${sig}`
 *   - Still verified, against current secret OR `NPS_TOKEN_SECRET_PREV`
 *     when set. The 2026-06-06 incident (87 in-flight emails silently
 *     invalidated by a secret rotation) is the reason this support
 *     exists — see migration 063 + the runbook in
 *     scripts/recover-nps-feedback-sends.ts.
 *
 * Rotation procedure (next time the secret changes):
 *   1. Before rotating: copy the CURRENT secret to NPS_TOKEN_SECRET_PREV
 *      on Vercel.
 *   2. Rotate NPS_TOKEN_SECRET.
 *   3. Both old (v1 + v2-with-old-kid) AND new tokens verify correctly
 *      until NPS_TOKEN_SECRET_PREV is dropped.
 *   4. Drop NPS_TOKEN_SECRET_PREV after one cron cycle past the longest
 *      live email's expected click window (~14 days is generous).
 *
 *   - `timingSafeEqual` to dodge constant-time side-channels.
 *   - HMAC uses `NPS_TOKEN_SECRET`; missing/empty secret is a hard
 *     failure in sign + null return in verify so the route surfaces a
 *     500/400 rather than minting an unverifiable token.
 *   - Env-var trim per CLAUDE.md.
 */

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

function getCurrentSecret(): string {
  const raw = process.env.NPS_TOKEN_SECRET?.trim();
  if (!raw) {
    throw new Error(
      '[nps/token] NPS_TOKEN_SECRET missing or empty — cannot sign/verify NPS click tokens',
    );
  }
  return raw;
}

/** Optional previous secret for rotation-safety. Returns null when unset. */
function getPreviousSecret(): string | null {
  const raw = process.env.NPS_TOKEN_SECRET_PREV?.trim();
  return raw && raw.length > 0 ? raw : null;
}

/** Stable 6-char id for a secret value (used to route verify to the right secret). */
function secretKid(secret: string): string {
  return createHash('sha256').update(secret).digest('base64url').slice(0, 6);
}

// Node ≥16 ships native 'base64url' encoding that handles the
// `+`/`/` → `-`/`_` substitution and `=` padding.
function base64urlEncode(buf: Buffer): string {
  return buf.toString('base64url');
}
function base64urlDecode(s: string): Buffer {
  return Buffer.from(s, 'base64url');
}

/**
 * Sign a user_id into a v2 click-capture token. Throws if the secret
 * env var is missing — callers (the cron + the test harness) should
 * set it before invoking.
 */
export function signNpsToken(userId: string): string {
  if (!userId) throw new Error('[nps/token] userId required');
  const secret = getCurrentSecret();
  const payload = Buffer.from(userId, 'utf8');
  const sig = createHmac('sha256', secret).update(payload).digest();
  return `${secretKid(secret)}.${base64urlEncode(payload)}.${base64urlEncode(sig)}`;
}

/**
 * Try to verify a payload+sig pair against a specific secret. Returns
 * the embedded user_id on success, null on any HMAC mismatch.
 */
function verifyWithSecret(payload: Buffer, sig: Buffer, secret: string): string | null {
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

/**
 * Verify a token. Returns the embedded user_id on success, null on any
 * tamper / shape error / missing secret. Never throws — the route uses
 * the null return as a 400 signal.
 *
 * Resolution order:
 *   v2 token (3 parts):
 *     1. Match `kid` against current secret → verify
 *     2. Match `kid` against previous secret (when set) → verify
 *     3. Otherwise reject (do not try mismatched-kid secrets — that
 *        would defeat the rotation routing the kid is there to provide)
 *   v1 token (2 parts, no kid):
 *     1. Try current secret → verify
 *     2. Try previous secret (when set) → verify
 *     3. Reject
 */
export function verifyNpsToken(token: string | null | undefined): string | null {
  if (!token || typeof token !== 'string') return null;

  // Resolve secrets up front — both can be missing, that's a hard null.
  let currentSecret: string;
  try {
    currentSecret = getCurrentSecret();
  } catch {
    return null;
  }
  const previousSecret = getPreviousSecret();

  const parts = token.split('.');

  if (parts.length === 3) {
    const [kid, payloadB64, sigB64] = parts;
    if (!kid || !payloadB64 || !sigB64) return null;
    let payload: Buffer;
    let sig: Buffer;
    try {
      payload = base64urlDecode(payloadB64);
      sig = base64urlDecode(sigB64);
    } catch {
      return null;
    }
    if (kid === secretKid(currentSecret)) {
      return verifyWithSecret(payload, sig, currentSecret);
    }
    if (previousSecret && kid === secretKid(previousSecret)) {
      return verifyWithSecret(payload, sig, previousSecret);
    }
    return null;
  }

  if (parts.length === 2) {
    // Legacy v1 — try current secret then previous, in order.
    const [payloadB64, sigB64] = parts;
    if (!payloadB64 || !sigB64) return null;
    let payload: Buffer;
    let sig: Buffer;
    try {
      payload = base64urlDecode(payloadB64);
      sig = base64urlDecode(sigB64);
    } catch {
      return null;
    }
    const fromCurrent = verifyWithSecret(payload, sig, currentSecret);
    if (fromCurrent) return fromCurrent;
    if (previousSecret) {
      const fromPrev = verifyWithSecret(payload, sig, previousSecret);
      if (fromPrev) return fromPrev;
    }
    return null;
  }

  return null;
}
