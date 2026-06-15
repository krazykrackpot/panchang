import { describe, it, expect } from 'vitest';
import { estimateCostMicros, verifyWebhookSignature } from '../client';

describe('estimateCostMicros', () => {
  it('uses India utility rate for +91 numbers on daily template', () => {
    expect(estimateCostMicros('+919876543210', 'daily_panchang_v1')).toBe(14_000);
  });

  it('uses India authentication rate for +91 numbers on OTP template', () => {
    expect(estimateCostMicros('+919876543210', 'whatsapp_otp_v1')).toBe(9_500);
  });

  it('uses US utility rate for +1 numbers', () => {
    expect(estimateCostMicros('+15551234567', 'daily_panchang_v1')).toBe(25_000);
  });

  it('falls back to DEFAULT rate for unknown country prefixes', () => {
    expect(estimateCostMicros('+999999999', 'daily_panchang_v1')).toBe(40_000);
  });

  it('detects auth template even when name does not include "otp"', () => {
    expect(estimateCostMicros('+919876543210', 'auth_login_v1')).toBe(9_500);
  });
});

describe('verifyWebhookSignature', () => {
  const SECRET = 'test_app_secret_abc123';
  const BODY = '{"object":"whatsapp_business_account","entry":[]}';

  // Compute the canonical signature for this body+secret via the same Web
  // Crypto API the implementation uses — avoids drift between a hardcoded
  // hex string and the verifier's reference implementation.
  async function signHmacSha256(body: string, secret: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
    return Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  it('accepts a correctly-signed payload', async () => {
    const validSig = `sha256=${await signHmacSha256(BODY, SECRET)}`;
    expect(await verifyWebhookSignature(BODY, validSig, SECRET)).toBe(true);
  });

  it('rejects a tampered body', async () => {
    const validSig = `sha256=${await signHmacSha256(BODY, SECRET)}`;
    expect(await verifyWebhookSignature(BODY + '_tampered', validSig, SECRET)).toBe(false);
  });

  it('rejects when signature header is missing', async () => {
    expect(await verifyWebhookSignature(BODY, null, SECRET)).toBe(false);
  });

  it('rejects when signature header lacks the sha256= prefix', async () => {
    const sigNoPrefix = await signHmacSha256(BODY, SECRET);
    expect(await verifyWebhookSignature(BODY, sigNoPrefix, SECRET)).toBe(false);
  });

  it('rejects when secret is wrong', async () => {
    const validSig = `sha256=${await signHmacSha256(BODY, SECRET)}`;
    expect(await verifyWebhookSignature(BODY, validSig, 'wrong_secret')).toBe(false);
  });

  it('rejects signatures of different lengths early', async () => {
    expect(await verifyWebhookSignature(BODY, 'sha256=deadbeef', SECRET)).toBe(false);
  });
});
