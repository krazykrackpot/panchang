import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSupabase } from '@/lib/supabase/server';
import { invalidateTierCache } from '@/lib/subscription/check-access';

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    subscription: {
      entity: {
        id: string;
        plan_id: string;
        status: string;
        current_start: number | null;
        current_end: number | null;
        notes: {
          user_id?: string;
          tier?: string;
        };
      };
    };
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('x-razorpay-signature') || '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    const expected = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
    if (sig !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data: RazorpayWebhookPayload = JSON.parse(body);
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const entity = data.payload.subscription.entity;
    const userId = entity.notes?.user_id;
    const tier = entity.notes?.tier;

    if (!userId) {
      return NextResponse.json({ received: true });
    }

    switch (data.event) {
      case 'subscription.activated': {
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          provider: 'razorpay',
          status: 'active',
          tier: tier || 'pro',
          provider_subscription_id: entity.id,
          current_period_start: entity.current_start
            ? new Date(entity.current_start * 1000).toISOString()
            : null,
          current_period_end: entity.current_end
            ? new Date(entity.current_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        invalidateTierCache(userId);
        break;
      }

      case 'subscription.charged': {
        await supabase.from('subscriptions').update({
          status: 'active',
          current_period_start: entity.current_start
            ? new Date(entity.current_start * 1000).toISOString()
            : null,
          current_period_end: entity.current_end
            ? new Date(entity.current_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId);

        invalidateTierCache(userId);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.paused': {
        await supabase.from('subscriptions').update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId);

        invalidateTierCache(userId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Razorpay webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
