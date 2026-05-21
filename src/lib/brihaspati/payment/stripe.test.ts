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
      userId: 'u', questionId: 'q', tier: 'single',
      returnUrlBase: 'https://example.com', client: fakeStripe(),
    });
    expect(r.sessionId).toMatch(/cs_test_payment/);
    expect(r.url).toMatch(/checkout\.stripe\.com/);
  });

  it('creates a subscription session for monthly', async () => {
    const r = await createCheckoutSession({
      userId: 'u', questionId: 'q', tier: 'monthly',
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
      userId: 'user-abc', questionId: 'q-def', tier: 'single',
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
      userId: 'u', questionId: 'a/b c', tier: 'single',
      returnUrlBase: 'https://example.com', client,
    });
    expect(captured!.success_url).toContain('q=a%2Fb%20c');
    expect(captured!.cancel_url).toContain('q=a%2Fb%20c');
  });

  it('throws when the price env var is missing', async () => {
    delete process.env.STRIPE_PRICE_BRIHASPATI_SINGLE;
    await expect(
      createCheckoutSession({
        userId: 'u', questionId: 'q', tier: 'single',
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
        userId: 'u', questionId: 'q', tier: 'single',
        returnUrlBase: 'https://example.com', client,
      }),
    ).rejects.toThrow(/session\.url missing/);
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
    ['single', 99],
    ['pack_5', 299],
    ['monthly', 399],
    ['annual', 2499],
  ] as const)('%s → %d cents', (tier, cents) => {
    expect(displayCents(tier)).toBe(cents);
  });
});
