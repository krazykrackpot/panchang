import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createHmac } from 'node:crypto';
import {
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  displayPaise,
  type RazorpayLike,
} from './razorpay';

function fakeClient(): RazorpayLike {
  return {
    orders: {
      create: async (opts) => ({
        id: `order_fake_${opts.receipt ?? 'r'}`,
        amount: opts.amount,
        currency: opts.currency,
        receipt: opts.receipt,
      }),
    },
    subscriptions: {
      create: async (opts) => ({
        id: `sub_fake_${opts.plan_id}`,
        short_url: `https://rzp.io/i/fake-${opts.plan_id}`,
      }),
    },
  };
}

describe('Razorpay — createOrder (one-off tiers)', () => {
  beforeEach(() => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_xxx';
    process.env.RAZORPAY_KEY_SECRET = 'secret_xxx';
  });

  it('creates an order for single at 9900 paise', async () => {
    const r = await createOrder({
      userId: 'u1', questionId: 'q-abcdef12345', tier: 'single', client: fakeClient(),
    });
    expect(r.kind).toBe('order');
    expect(r.amountPaise).toBe(9900);
    expect(r.id).toMatch(/^order_fake_/);
  });

  it('creates an order for pack_5 at 19900 paise', async () => {
    const r = await createOrder({
      userId: 'u1', questionId: 'q-x', tier: 'pack_5', client: fakeClient(),
    });
    expect(r.amountPaise).toBe(19900);
  });

  it('truncates the receipt to a safe length', async () => {
    const r = await createOrder({
      userId: 'u1',
      questionId: '0123456789abcdef0123456789abcdef0123', // long uuid-ish
      tier: 'single',
      client: fakeClient(),
    });
    expect(r.id.length).toBeLessThanOrEqual(64);
  });
});

describe('Razorpay — createOrder (subscription tiers)', () => {
  beforeEach(() => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_xxx';
    process.env.RAZORPAY_KEY_SECRET = 'secret_xxx';
    process.env.RAZORPAY_PLAN_BRIHASPATI_MONTHLY = 'plan_monthly_xxx';
    process.env.RAZORPAY_PLAN_BRIHASPATI_ANNUAL = 'plan_annual_xxx';
  });
  afterEach(() => {
    delete process.env.RAZORPAY_PLAN_BRIHASPATI_MONTHLY;
    delete process.env.RAZORPAY_PLAN_BRIHASPATI_ANNUAL;
  });

  it('creates a monthly subscription with total_count=12', async () => {
    const client: RazorpayLike = {
      ...fakeClient(),
      subscriptions: {
        create: async (opts) => {
          expect(opts.total_count).toBe(12);
          expect(opts.plan_id).toBe('plan_monthly_xxx');
          return { id: 'sub_xxx', short_url: 'https://rzp.io/i/x' };
        },
      },
    };
    const r = await createOrder({
      userId: 'u', questionId: 'q', tier: 'monthly', client,
    });
    expect(r.kind).toBe('subscription');
    expect(r.shortUrl).toMatch(/^https/);
  });

  it('creates an annual subscription with total_count=1', async () => {
    const client: RazorpayLike = {
      ...fakeClient(),
      subscriptions: {
        create: async (opts) => {
          expect(opts.total_count).toBe(1);
          return { id: 'sub_yyy' };
        },
      },
    };
    const r = await createOrder({
      userId: 'u', questionId: 'q', tier: 'annual', client,
    });
    expect(r.id).toBe('sub_yyy');
  });

  it('throws when subscription plan env is missing', async () => {
    delete process.env.RAZORPAY_PLAN_BRIHASPATI_MONTHLY;
    await expect(
      createOrder({ userId: 'u', questionId: 'q', tier: 'monthly', client: fakeClient() }),
    ).rejects.toThrow(/RAZORPAY_PLAN_BRIHASPATI_MONTHLY/);
  });
});

describe('Razorpay — verifyPaymentSignature', () => {
  it('accepts the expected HMAC-SHA256(order_id|payment_id) signature', () => {
    const secret = 'webhook_secret_xxx';
    const orderId = 'order_abc';
    const paymentId = 'pay_xyz';
    const sig = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
    expect(verifyPaymentSignature(orderId, paymentId, sig, secret)).toBe(true);
  });

  it('rejects a tampered signature', () => {
    const secret = 'webhook_secret_xxx';
    const orderId = 'order_abc';
    const paymentId = 'pay_xyz';
    const sig = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
    expect(verifyPaymentSignature(orderId, paymentId, sig + 'ff', secret)).toBe(false);
  });

  it('rejects when secret is empty', () => {
    expect(verifyPaymentSignature('o', 'p', 'sig', '')).toBe(false);
  });

  it('rejects when any of order_id / payment_id / signature is empty', () => {
    expect(verifyPaymentSignature('', 'p', 's', 'secret')).toBe(false);
    expect(verifyPaymentSignature('o', '', 's', 'secret')).toBe(false);
    expect(verifyPaymentSignature('o', 'p', '', 'secret')).toBe(false);
  });
});

describe('Razorpay — verifyWebhookSignature', () => {
  it('accepts the HMAC of the raw body using the webhook secret', () => {
    const body = JSON.stringify({ event: 'payment.captured' });
    const sig = createHmac('sha256', 'wh_secret').update(body).digest('hex');
    expect(verifyWebhookSignature(body, sig, 'wh_secret')).toBe(true);
  });

  it('rejects a wrong-secret signature', () => {
    const body = '{}';
    const sig = createHmac('sha256', 'wrong').update(body).digest('hex');
    expect(verifyWebhookSignature(body, sig, 'right')).toBe(false);
  });
});

describe('Razorpay — displayPaise', () => {
  it.each([
    ['single', 9900],
    ['pack_5', 19900],
    ['monthly', 29900],
    ['annual', 199900],
  ] as const)('%s → %d paise', (tier, expected) => {
    expect(displayPaise(tier)).toBe(expected);
  });
});
