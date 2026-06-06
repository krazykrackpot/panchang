/**
 * Tests for the NPS click-capture token.
 *
 * The token's contract is small but security-sensitive — it gates a row
 * insert into a privacy-relevant table from a public unauthenticated
 * HTTPS endpoint. Pin: roundtrip works, tampering doesn't, missing/empty
 * secret never mints or verifies a token, score-changes-only-by-clicking-
 * a-different-button works because the token signs only the user_id
 * (not the score).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_USER_ID = '00000000-0000-0000-0000-0000000000ab';
const OTHER_USER_ID = '11111111-1111-1111-1111-1111111111cd';

async function loadModule() {
  vi.resetModules();
  return await import('../token');
}

describe('NPS token', () => {
  beforeEach(() => {
    process.env.NPS_TOKEN_SECRET = 'test-secret-please-change-in-prod';
  });
  afterEach(() => {
    delete process.env.NPS_TOKEN_SECRET;
  });

  it('signs and verifies the same user_id', async () => {
    const { signNpsToken, verifyNpsToken } = await loadModule();
    const t = signNpsToken(TEST_USER_ID);
    expect(typeof t).toBe('string');
    expect(t).toContain('.');
    expect(verifyNpsToken(t)).toBe(TEST_USER_ID);
  });

  it('rejects a tampered payload (different user_id, same signature)', async () => {
    const { signNpsToken, verifyNpsToken } = await loadModule();
    const t = signNpsToken(TEST_USER_ID);
    const sig = t.split('.')[1];
    // Substitute OTHER_USER_ID as the payload but keep TEST_USER_ID's signature.
    const tampered = `${Buffer.from(OTHER_USER_ID, 'utf8').toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')}.${sig}`;
    expect(verifyNpsToken(tampered)).toBeNull();
  });

  it('rejects a tampered signature', async () => {
    const { signNpsToken, verifyNpsToken } = await loadModule();
    const t = signNpsToken(TEST_USER_ID);
    const [payload, sig] = t.split('.');
    // Flip one character in the signature.
    const flipped = sig.startsWith('A') ? `B${sig.slice(1)}` : `A${sig.slice(1)}`;
    expect(verifyNpsToken(`${payload}.${flipped}`)).toBeNull();
  });

  it('rejects a token signed with a different secret', async () => {
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

  it('throws on sign when the secret env var is missing', async () => {
    delete process.env.NPS_TOKEN_SECRET;
    const { signNpsToken } = await loadModule();
    expect(() => signNpsToken(TEST_USER_ID)).toThrow(/NPS_TOKEN_SECRET/);
  });

  it('returns null on verify when the secret env var is missing', async () => {
    // Sign with a valid secret first.
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
    // A 4-character payload base64-encodes to under the min length guard.
    const { verifyNpsToken } = await loadModule();
    // Manually mint a token for "abc" (3 chars) with the test secret so the
    // signature matches — then verify rejects on the shape guard before
    // touching the DB.
    const { createHmac } = await import('node:crypto');
    const secret = process.env.NPS_TOKEN_SECRET!;
    const payloadBuf = Buffer.from('abc', 'utf8');
    const sigBuf = createHmac('sha256', secret).update(payloadBuf).digest();
    const enc = (b: Buffer) =>
      b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const shortToken = `${enc(payloadBuf)}.${enc(sigBuf)}`;
    expect(verifyNpsToken(shortToken)).toBeNull();
  });
});
