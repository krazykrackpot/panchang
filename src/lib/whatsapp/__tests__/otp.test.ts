import { describe, it, expect, beforeAll } from 'vitest';
import {
  generateOtp,
  hashOtp,
  verifyOtp,
  safeEqualHex,
  otpExpiresAt,
  OTP_VALIDITY_MINUTES,
} from '../otp';

const TEST_SECRET = 'test-otp-hmac-secret-deadbeef';

beforeAll(() => {
  process.env.OTP_HMAC_SECRET = TEST_SECRET;
});

describe('generateOtp', () => {
  it('returns a 6-digit numeric string', () => {
    for (let i = 0; i < 100; i++) {
      const code = generateOtp();
      expect(code).toMatch(/^\d{6}$/);
      expect(code.length).toBe(6);
    }
  });

  it('is not trivially repeatable (50 codes have at least 30 unique)', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 50; i++) codes.add(generateOtp());
    // 6-digit space is 1e6; 50 samples should produce ~50 unique with
    // overwhelming probability. Anything below 30 means RNG is broken.
    expect(codes.size).toBeGreaterThanOrEqual(30);
  });
});

describe('hashOtp + verifyOtp', () => {
  it('verifies a correct code', async () => {
    const code = '123456';
    const hash = await hashOtp(code);
    expect(await verifyOtp(code, hash)).toBe(true);
  });

  it('rejects a wrong code', async () => {
    const hash = await hashOtp('123456');
    expect(await verifyOtp('654321', hash)).toBe(false);
  });

  it('rejects a non-6-digit string up front', async () => {
    const hash = await hashOtp('123456');
    expect(await verifyOtp('12345', hash)).toBe(false);
    expect(await verifyOtp('abcdef', hash)).toBe(false);
    expect(await verifyOtp('', hash)).toBe(false);
  });

  it('produces stable hashes for the same code+secret', async () => {
    const a = await hashOtp('111111');
    const b = await hashOtp('111111');
    expect(a).toBe(b);
  });

  it('produces different hashes for the same code with different secrets', async () => {
    const a = await hashOtp('111111', 'secret-A');
    const b = await hashOtp('111111', 'secret-B');
    expect(a).not.toBe(b);
  });

  it('throws when OTP_HMAC_SECRET is missing', async () => {
    await expect(hashOtp('123456', '')).rejects.toThrow(/OTP_HMAC_SECRET/);
  });
});

describe('safeEqualHex', () => {
  it('matches identical strings', () => {
    expect(safeEqualHex('deadbeef', 'deadbeef')).toBe(true);
  });
  it('rejects different lengths', () => {
    expect(safeEqualHex('dead', 'deadbeef')).toBe(false);
  });
  it('rejects different content same length', () => {
    expect(safeEqualHex('deadbeef', 'deadbee0')).toBe(false);
  });
});

describe('otpExpiresAt', () => {
  it('expires 10 minutes after now by default', () => {
    const now = new Date('2026-06-16T08:00:00Z');
    const expires = otpExpiresAt(now);
    expect(expires.getTime() - now.getTime()).toBe(OTP_VALIDITY_MINUTES * 60 * 1000);
  });
});
