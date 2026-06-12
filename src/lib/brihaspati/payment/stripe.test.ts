import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createCheckoutSession,
  verifyWebhookEvent,
  displayCents,
  type StripeLike,
} from './stripe';

function fakeStripe(overrides: Partial<StripeLike> = {}): StripeLike {
  return {
    checkout: {
      sessions: {
        create: async (opts) => ({
          id: `cs_test_${opts.mode}_${opts.line_items[0].price}`,
          url: `https://checkout.stripe.com/c/test/${opts.metadata?.tier ?? 'x'}`,
        }),
      },
    },
    webhooks: {
      constructEvent: (body, sig, secret) => {
        if (secret !== 'right') throw new Error('Invalid signature');
        return { id: 'evt_test', type: 'checkout.session.completed', data: { object: { body } } };
      },
    },
    ...overrides,
  };
}

describe('Stripe — createCheckoutSession', () => {
  beforeEach(() => {
    process.env.STRIPE_PRICE_BRIHASPATI_SINGLE = 'price_single_xxx';
    process.env.STRIPE_PRICE_BRIHASPATI_PACK_5 = 'price_pack_xxx';
    process.env.STRIPE_PRICE_BRIHASPATI_MONTHLY = 'price_monthly_xxx';
    process.env.STRIPE_PRICE_BRIHASPATI_ANNUAL = 'price_annual_xxx';
  });
  afterEach(() => {
    delete process.env.STRIPE_PRICE_BRIHASPATI_SINGLE;
    delete process.env.STRIPE_PRICE_BRIHASPATI_PACK_5;
    delete process.env.STRIPE_PRICE_BRIHASPATI_MONTHLY;
    delete process.env.STRIPE_PRICE_BRIHASPATI_ANNUAL;
  });

  it('creates a one-off payment session for single', async () => {
    const r = await createCheckoutSession({
      userId: 'u', questionId: 'q', tier: 'single', currency: 'USD',
      returnUrlBase: 'https://example.com', client: fakeStripe(),
    });
    expect(r.sessionId).toMatch(/cs_test_payment/);
    expect(r.url).toMatch(/checkout\.stripe\.com/);
  });

  it('creates a subscription session for monthly', async () => {
    const r = await createCheckoutSession({
      userId: 'u', questionId: 'q', tier: 'monthly', currency: 'USD',
      returnUrlBase: 'https://example.com', client: fakeStripe(),
    });
    expect(r.sessionId).toMatch(/cs_test_subscription/);
  });

  it('includes user_id and question_id metadata + brihaspati marker', async () => {
    let captured: Parameters<StripeLike['checkout']['sessions']['create']>[0] | null = null;
    const client = fakeStripe({
      checkout: {
        sessions: {
          create: async (opts) => {
            captured = opts;
            return { id: 'cs', url: 'https://x' };
          },
        },
      },
    });
    await createCheckoutSession({
      userId: 'user-abc', questionId: 'q-def', tier: 'single', currency: 'USD',
      returnUrlBase: 'https://example.com', client,
    });
    expect(captured!.metadata).toEqual({
      user_id: 'user-abc',
      question_id: 'q-def',
      tier: 'single',
      brihaspati: 'true',
    });
  });

  it('encodes the question_id in return URLs to survive special chars', async () => {
    let captured: Parameters<StripeLike['checkout']['sessions']['create']>[0] | null = null;
    const client = fakeStripe({
      checkout: {
        sessions: {
          create: async (opts) => {
            captured = opts;
            return { id: 'cs', url: 'https://x' };
          },
        },
      },
    });
    await createCheckoutSession({
      userId: 'u', questionId: 'a/b c', tier: 'single', currency: 'USD',
      returnUrlBase: 'https://example.com', client,
    });
    expect(captured!.success_url).toContain('q=a%2Fb%20c');
    expect(captured!.cancel_url).toContain('q=a%2Fb%20c');
  });

  it('throws when the price env var is missing', async () => {
    delete process.env.STRIPE_PRICE_BRIHASPATI_SINGLE;
    await expect(
      createCheckoutSession({
        userId: 'u', questionId: 'q', tier: 'single', currency: 'USD',
        returnUrlBase: 'https://example.com', client: fakeStripe(),
      }),
    ).rejects.toThrow(/STRIPE_PRICE_BRIHASPATI_SINGLE/);
  });

  it('throws when session.url is null', async () => {
    const client = fakeStripe({
      checkout: { sessions: { create: async () => ({ id: 'cs', url: null }) } },
    });
    await expect(
      createCheckoutSession({
        userId: 'u', questionId: 'q', tier: 'single', currency: 'USD',
        returnUrlBase: 'https://example.com', client,
      }),
    ).rejects.toThrow(/session\.url missing/);
  });
});

// ── INR routing through Stripe (option A — Razorpay deferred) ───────────

describe('Stripe — INR currency routes through *_INR Price IDs', () => {
  beforeEach(() => {
    process.env.STRIPE_PRICE_BRIHASPATI_SINGLE = 'price_usd_single';
    process.env.STRIPE_PRICE_BRIHASPATI_PACK_5 = 'price_usd_pack';
    process.env.STRIPE_PRICE_BRIHASPATI_MONTHLY = 'price_usd_monthly';
    process.env.STRIPE_PRICE_BRIHASPATI_ANNUAL = 'price_usd_annual';
    process.env.STRIPE_PRICE_BRIHASPATI_SINGLE_INR = 'price_inr_single';
    process.env.STRIPE_PRICE_BRIHASPATI_PACK_5_INR = 'price_inr_pack';
    process.env.STRIPE_PRICE_BRIHASPATI_MONTHLY_INR = 'price_inr_monthly';
    process.env.STRIPE_PRICE_BRIHASPATI_ANNUAL_INR = 'price_inr_annual';
  });
  afterEach(() => {
    for (const k of [
      'STRIPE_PRICE_BRIHASPATI_SINGLE', 'STRIPE_PRICE_BRIHASPATI_PACK_5',
      'STRIPE_PRICE_BRIHASPATI_MONTHLY', 'STRIPE_PRICE_BRIHASPATI_ANNUAL',
      'STRIPE_PRICE_BRIHASPATI_SINGLE_INR', 'STRIPE_PRICE_BRIHASPATI_PACK_5_INR',
      'STRIPE_PRICE_BRIHASPATI_MONTHLY_INR', 'STRIPE_PRICE_BRIHASPATI_ANNUAL_INR',
    ]) {
      delete process.env[k];
    }
  });

  it.each([
    ['single', 'price_inr_single'],
    ['pack_5', 'price_inr_pack'],
    ['monthly', 'price_inr_monthly'],
    ['annual', 'price_inr_annual'],
  ] as const)('INR + %s uses INR Price ID (%s)', async (tier, expectedPriceId) => {
    let captured: Parameters<StripeLike['checkout']['sessions']['create']>[0] | null = null;
    const client = fakeStripe({
      checkout: {
        sessions: {
          create: async (opts) => {
            captured = opts;
            return { id: 'cs', url: 'https://x' };
          },
        },
      },
    });
    await createCheckoutSession({
      userId: 'u', questionId: 'q', tier, currency: 'INR',
      returnUrlBase: 'https://example.com', client,
    });
    expect(captured!.line_items[0].price).toBe(expectedPriceId);
  });

  it('USD path still uses USD Price IDs (no regression)', async () => {
    let captured: Parameters<StripeLike['checkout']['sessions']['create']>[0] | null = null;
    const client = fakeStripe({
      checkout: {
        sessions: {
          create: async (opts) => {
            captured = opts;
            return { id: 'cs', url: 'https://x' };
          },
        },
      },
    });
    await createCheckoutSession({
      userId: 'u', questionId: 'q', tier: 'monthly', currency: 'USD',
      returnUrlBase: 'https://example.com', client,
    });
    expect(captured!.line_items[0].price).toBe('price_usd_monthly');
  });

  it('throws when *_INR env var is missing', async () => {
    delete process.env.STRIPE_PRICE_BRIHASPATI_SINGLE_INR;
    await expect(
      createCheckoutSession({
        userId: 'u', questionId: 'q', tier: 'single', currency: 'INR',
        returnUrlBase: 'https://example.com', client: fakeStripe(),
      }),
    ).rejects.toThrow(/STRIPE_PRICE_BRIHASPATI_SINGLE_INR/);
  });
});

describe('Stripe — verifyWebhookEvent', () => {
  it('parses event when signature is valid', async () => {
    const evt = await verifyWebhookEvent('{}', 'sig', 'right', fakeStripe());
    expect(evt).not.toBeNull();
    expect(evt!.type).toBe('checkout.session.completed');
  });

  it('returns null on invalid signature', async () => {
    const evt = await verifyWebhookEvent('{}', 'sig', 'wrong', fakeStripe());
    expect(evt).toBeNull();
  });

  it('returns null when webhook secret env is empty', async () => {
    const evt = await verifyWebhookEvent('{}', 'sig', '', fakeStripe());
    expect(evt).toBeNull();
  });
});

describe('Stripe — displayCents', () => {
  it.each([
    ['single', 130],
    ['pack_5', 299],
    ['monthly', 1299],
    ['annual', 12999],
  ] as const)('%s → %d cents', (tier, cents) => {
    expect(displayCents(tier)).toBe(cents);
  });
});
