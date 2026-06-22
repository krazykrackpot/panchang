import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  KUNDALI_PRODUCTS,
  isValidKundaliSku,
  isValidCurrency,
  resolveStripePriceId,
} from '../paywall-products';

describe('KUNDALI_PRODUCTS catalogue', () => {
  it('has exactly the SKUs the spec defines', () => {
    expect(Object.keys(KUNDALI_PRODUCTS).sort()).toEqual(['family', 'single']);
  });

  it('single grants 1 credit at the canonical price', () => {
    const s = KUNDALI_PRODUCTS.single;
    expect(s.creditsGranted).toBe(1);
    expect(s.priceMinor.INR).toBe(29900); // ₹299
    expect(s.priceMinor.USD).toBe(499);   // $4.99
  });

  it('family grants 4 credits at the canonical price', () => {
    const f = KUNDALI_PRODUCTS.family;
    expect(f.creditsGranted).toBe(4);
    expect(f.priceMinor.INR).toBe(99900); // ₹999
    expect(f.priceMinor.USD).toBe(1499);  // $14.99
  });

  it('family is a real discount vs 4× single (anti-anchor-corruption)', () => {
    expect(KUNDALI_PRODUCTS.family.priceMinor.INR)
      .toBeLessThan(KUNDALI_PRODUCTS.single.priceMinor.INR * 4);
    expect(KUNDALI_PRODUCTS.family.priceMinor.USD)
      .toBeLessThan(KUNDALI_PRODUCTS.single.priceMinor.USD * 4);
  });
});

describe('SKU + currency validators', () => {
  it('isValidKundaliSku narrows the type for known values', () => {
    expect(isValidKundaliSku('single')).toBe(true);
    expect(isValidKundaliSku('family')).toBe(true);
  });

  it('isValidKundaliSku rejects junk', () => {
    expect(isValidKundaliSku('unlimited')).toBe(false);
    expect(isValidKundaliSku('')).toBe(false);
    expect(isValidKundaliSku('SINGLE')).toBe(false); // case-sensitive
  });

  it('isValidCurrency narrows the type for known values', () => {
    expect(isValidCurrency('INR')).toBe(true);
    expect(isValidCurrency('USD')).toBe(true);
  });

  it('isValidCurrency rejects junk', () => {
    expect(isValidCurrency('EUR')).toBe(false);
    expect(isValidCurrency('inr')).toBe(false); // case-sensitive
  });
});

describe('resolveStripePriceId', () => {
  const ORIG_ENV = { ...process.env };
  beforeEach(() => {
    // Clear so we can test the missing-env path.
    delete process.env.STRIPE_PRICE_KUNDALI_SINGLE_INR;
    delete process.env.STRIPE_PRICE_KUNDALI_SINGLE_USD;
    delete process.env.STRIPE_PRICE_KUNDALI_FAMILY_INR;
    delete process.env.STRIPE_PRICE_KUNDALI_FAMILY_USD;
  });
  afterEach(() => {
    process.env = { ...ORIG_ENV };
  });

  it('returns the env value when set', () => {
    process.env.STRIPE_PRICE_KUNDALI_SINGLE_INR = 'price_test_single_inr_123';
    expect(resolveStripePriceId('single', 'INR')).toBe('price_test_single_inr_123');
  });

  it('throws a setup-script hint when env is missing', () => {
    expect(() => resolveStripePriceId('family', 'USD'))
      .toThrow(/scripts\/stripe-setup-kundali-products\.ts/);
  });

  it('trims whitespace in env values (Vercel-style trailing newlines)', () => {
    process.env.STRIPE_PRICE_KUNDALI_FAMILY_INR = '  price_test_family_inr_456  ';
    expect(resolveStripePriceId('family', 'INR')).toBe('price_test_family_inr_456');
  });
});
