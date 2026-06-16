import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isWhatsAppBetaUser, _resetBetaGateCache } from '../beta-gate';

const U1 = '11111111-1111-1111-1111-111111111111';
const U2 = '22222222-2222-2222-2222-222222222222';
const U3 = '33333333-3333-3333-3333-333333333333';

const ORIG = process.env.WHATSAPP_BETA_USER_IDS;
beforeEach(() => {
  delete process.env.WHATSAPP_BETA_USER_IDS;
  _resetBetaGateCache();
});
afterEach(() => {
  if (ORIG === undefined) delete process.env.WHATSAPP_BETA_USER_IDS;
  else process.env.WHATSAPP_BETA_USER_IDS = ORIG;
  _resetBetaGateCache();
});

describe('isWhatsAppBetaUser', () => {
  it('returns false when env var is unset (fail-closed)', () => {
    expect(isWhatsAppBetaUser(U1)).toBe(false);
  });

  it('returns false when env var is empty string', () => {
    process.env.WHATSAPP_BETA_USER_IDS = '';
    expect(isWhatsAppBetaUser(U1)).toBe(false);
  });

  it('returns false for null / undefined / empty userId', () => {
    process.env.WHATSAPP_BETA_USER_IDS = U1;
    _resetBetaGateCache();
    expect(isWhatsAppBetaUser(null)).toBe(false);
    expect(isWhatsAppBetaUser(undefined)).toBe(false);
    expect(isWhatsAppBetaUser('')).toBe(false);
  });

  it('matches a single allowed user', () => {
    process.env.WHATSAPP_BETA_USER_IDS = U1;
    _resetBetaGateCache();
    expect(isWhatsAppBetaUser(U1)).toBe(true);
    expect(isWhatsAppBetaUser(U2)).toBe(false);
  });

  it('matches any of a comma-separated list', () => {
    process.env.WHATSAPP_BETA_USER_IDS = `${U1},${U2}`;
    _resetBetaGateCache();
    expect(isWhatsAppBetaUser(U1)).toBe(true);
    expect(isWhatsAppBetaUser(U2)).toBe(true);
    expect(isWhatsAppBetaUser(U3)).toBe(false);
  });

  it('tolerates whitespace around ids', () => {
    process.env.WHATSAPP_BETA_USER_IDS = `  ${U1}  ,  ${U2}  `;
    _resetBetaGateCache();
    expect(isWhatsAppBetaUser(U1)).toBe(true);
    expect(isWhatsAppBetaUser(U2)).toBe(true);
  });

  it('drops non-UUID entries silently (defensive parse)', () => {
    process.env.WHATSAPP_BETA_USER_IDS = `${U1},not-a-uuid,${U2}`;
    _resetBetaGateCache();
    expect(isWhatsAppBetaUser(U1)).toBe(true);
    expect(isWhatsAppBetaUser(U2)).toBe(true);
    expect(isWhatsAppBetaUser('not-a-uuid')).toBe(false);
  });

  it('"*" opens the gate to all users (GA flip)', () => {
    process.env.WHATSAPP_BETA_USER_IDS = '*';
    _resetBetaGateCache();
    expect(isWhatsAppBetaUser(U1)).toBe(true);
    expect(isWhatsAppBetaUser(U2)).toBe(true);
    expect(isWhatsAppBetaUser(U3)).toBe(true);
  });

  it('cache invalidates when env value changes', () => {
    process.env.WHATSAPP_BETA_USER_IDS = U1;
    _resetBetaGateCache();
    expect(isWhatsAppBetaUser(U1)).toBe(true);
    expect(isWhatsAppBetaUser(U2)).toBe(false);
    process.env.WHATSAPP_BETA_USER_IDS = U2;
    // Don't reset cache here — the load fn detects the raw string changed
    expect(isWhatsAppBetaUser(U1)).toBe(false);
    expect(isWhatsAppBetaUser(U2)).toBe(true);
  });
});
