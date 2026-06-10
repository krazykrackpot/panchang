/**
 * Tests for the NPS click-capture token.
 *
 * The token's contract is small but security-sensitive — it gates a row
 * insert into a privacy-relevant table from a public unauthenticated
 * HTTPS endpoint. Pin: roundtrip works, tampering doesn't, missing/empty
 * secret never mints or verifies a token, score-changes-only-by-clicking-
 * a-different-button works because the token signs only the user_id
 * (not the score). Plus the v2-format rotation paths (kid, PREV, legacy
 * 2-part backward verify) introduced after the 2026-06-06 silent
 * invalidation incident.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash, createHmac } from 'node:crypto';

const TEST_USER_ID = '00000000-0000-0000-0000-0000000000ab';
const OTHER_USER_ID = '11111111-1111-1111-1111-1111111111cd';

async function loadModule() {
  vi.resetModules();
  return await import('../token');
}

/** base64url encoder matching the implementation. */
function enc(b: Buffer): string {
  return b.toString('base64url');
}

/** Build a v1-format (legacy 2-part) token for a given user + secret. */
function mintLegacyToken(userId: string, secret: string): string {
  const payload = Buffer.from(userId, 'utf8');
  const sig = createHmac('sha256', secret).update(payload).digest();
  return `${enc(payload)}.${enc(sig)}`;
}

/** Compute the kid the implementation would produce for a given secret. */
function kidFor(secret: string): string {
  return createHash('sha256').update(secret).digest('base64url').slice(0, 6);
}

describe('NPS token', () => {
  beforeEach(() => {
    process.env.NPS_TOKEN_SECRET = 'test-secret-please-change-in-prod';
  });
  afterEach(() => {
    delete process.env.NPS_TOKEN_SECRET;
    delete process.env.NPS_TOKEN_SECRET_PREV;
  });

  it('signs and verifies the same user_id', async () => {
    const { signNpsToken, verifyNpsToken } = await loadModule();
    const t = signNpsToken(TEST_USER_ID);
    expect(typeof t).toBe('string');
    expect(t).toContain('.');
    expect(verifyNpsToken(t)).toBe(TEST_USER_ID);
  });

  it('produces a v2 (3-part) token with a stable kid prefix', async () => {
    const { signNpsToken } = await loadModule();
    const t = signNpsToken(TEST_USER_ID);
    const parts = t.split('.');
    expect(parts).toHaveLength(3);
    // kid is deterministic for a given secret.
    expect(parts[0]).toBe(kidFor(process.env.NPS_TOKEN_SECRET!));
    expect(parts[0]).toHaveLength(6);
  });

  it('rejects a tampered payload (different user_id, same kid + sig)', async () => {
    const { signNpsToken, verifyNpsToken } = await loadModule();
    const t = signNpsToken(TEST_USER_ID);
    const [kid, _payload, sig] = t.split('.');
    const tampered = `${kid}.${enc(Buffer.from(OTHER_USER_ID, 'utf8'))}.${sig}`;
    expect(verifyNpsToken(tampered)).toBeNull();
  });

  it('rejects a tampered signature', async () => {
    const { signNpsToken, verifyNpsToken } = await loadModule();
    const t = signNpsToken(TEST_USER_ID);
    const [kid, payload, sig] = t.split('.');
    const flipped = sig.startsWith('A') ? `B${sig.slice(1)}` : `A${sig.slice(1)}`;
    expect(verifyNpsToken(`${kid}.${payload}.${flipped}`)).toBeNull();
  });

  it('rejects a v2 token signed with a different secret', async () => {
    const { signNpsToken } = await loadModule();
    const tokenWithSecretA = signNpsToken(TEST_USER_ID);

    process.env.NPS_TOKEN_SECRET = 'a-different-secret';
    const { verifyNpsToken } = await loadModule();
    expect(verifyNpsToken(tokenWithSecretA)).toBeNull();
  });

  it('returns null on malformed input (no dot, empty, junk)', async () => {
    const { verifyNpsToken } = await loadModule();
    expect(verifyNpsToken('')).toBeNull();
    expect(verifyNpsToken('no-dot-here')).toBeNull();
    expect(verifyNpsToken('only-leading-dot.')).toBeNull();
    expect(verifyNpsToken('.only-trailing-dot')).toBeNull();
    expect(verifyNpsToken(null)).toBeNull();
    expect(verifyNpsToken(undefined)).toBeNull();
  });

  it('rejects a v2 token with a forged kid (does not fall back to mismatched secret)', async () => {
    const { signNpsToken, verifyNpsToken } = await loadModule();
    const t = signNpsToken(TEST_USER_ID);
    const [_kid, payload, sig] = t.split('.');
    const forgedKid = 'abcdef';
    expect(verifyNpsToken(`${forgedKid}.${payload}.${sig}`)).toBeNull();
  });

  it('throws on sign when the secret env var is missing', async () => {
    delete process.env.NPS_TOKEN_SECRET;
    const { signNpsToken } = await loadModule();
    expect(() => signNpsToken(TEST_USER_ID)).toThrow(/NPS_TOKEN_SECRET/);
  });

  it('returns null on verify when the secret env var is missing', async () => {
    const { signNpsToken } = await loadModule();
    const t = signNpsToken(TEST_USER_ID);

    delete process.env.NPS_TOKEN_SECRET;
    const { verifyNpsToken } = await loadModule();
    expect(verifyNpsToken(t)).toBeNull();
  });

  it('throws when signing an empty user_id', async () => {
    const { signNpsToken } = await loadModule();
    expect(() => signNpsToken('')).toThrow(/userId required/);
  });

  it('rejects a payload of implausible length (cheap shape guard)', async () => {
    const { verifyNpsToken } = await loadModule();
    const secret = process.env.NPS_TOKEN_SECRET!;
    const payloadBuf = Buffer.from('abc', 'utf8'); // 3 chars, below the 8-char min
    const sigBuf = createHmac('sha256', secret).update(payloadBuf).digest();
    const shortToken = `${kidFor(secret)}.${enc(payloadBuf)}.${enc(sigBuf)}`;
    expect(verifyNpsToken(shortToken)).toBeNull();
  });

  // ─── v2 rotation-safety tests (Gemini-flagged silent-failure incident) ──

  it('verifies a token from the previous secret when NPS_TOKEN_SECRET_PREV is set', async () => {
    // Pretend we already had `old-secret` in production yesterday.
    process.env.NPS_TOKEN_SECRET = 'old-secret';
    const { signNpsToken: signOld } = await loadModule();
    const oldToken = signOld(TEST_USER_ID);

    // Today we rotate: PREV gets the old value, current becomes new.
    process.env.NPS_TOKEN_SECRET = 'new-secret';
    process.env.NPS_TOKEN_SECRET_PREV = 'old-secret';
    const { verifyNpsToken } = await loadModule();
    expect(verifyNpsToken(oldToken)).toBe(TEST_USER_ID);
  });

  it('rejects a token from the previous secret when PREV is not set (rotation without grace)', async () => {
    process.env.NPS_TOKEN_SECRET = 'old-secret';
    const { signNpsToken: signOld } = await loadModule();
    const oldToken = signOld(TEST_USER_ID);

    process.env.NPS_TOKEN_SECRET = 'new-secret';
    // NPS_TOKEN_SECRET_PREV intentionally unset
    const { verifyNpsToken } = await loadModule();
    expect(verifyNpsToken(oldToken)).toBeNull();
  });

  it('verifies a legacy v1 (2-part) token against the current secret', async () => {
    const secret = process.env.NPS_TOKEN_SECRET!;
    const legacy = mintLegacyToken(TEST_USER_ID, secret);
    const { verifyNpsToken } = await loadModule();
    expect(verifyNpsToken(legacy)).toBe(TEST_USER_ID);
  });

  it('verifies a legacy v1 token against PREV after rotation', async () => {
    // Legacy token minted under old-secret.
    const legacy = mintLegacyToken(TEST_USER_ID, 'old-secret');

    process.env.NPS_TOKEN_SECRET = 'new-secret';
    process.env.NPS_TOKEN_SECRET_PREV = 'old-secret';
    const { verifyNpsToken } = await loadModule();
    expect(verifyNpsToken(legacy)).toBe(TEST_USER_ID);
  });

  it('rejects a legacy v1 token when neither current nor PREV match its secret', async () => {
    const legacy = mintLegacyToken(TEST_USER_ID, 'long-lost-secret');

    process.env.NPS_TOKEN_SECRET = 'current';
    process.env.NPS_TOKEN_SECRET_PREV = 'previous';
    const { verifyNpsToken } = await loadModule();
    expect(verifyNpsToken(legacy)).toBeNull();
  });

  it('different secrets produce different kids', async () => {
    expect(kidFor('a')).not.toBe(kidFor('b'));
    expect(kidFor('test-secret-please-change-in-prod')).toHaveLength(6);
  });
});
