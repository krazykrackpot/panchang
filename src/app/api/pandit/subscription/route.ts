/**
 * /api/pandit/subscription
 *
 * GET — return the Pandit's current tier, subscription status, and
 *       cap usage (linked vs unlinked roster counts). The dashboard
 *       Settings tab + the Add-Client flow both read this to drive
 *       the paywall modal and the "X of 5 free clients used" nudge.
 *
 * Auth: Bearer JWT of an account_type='pandit' user.
 *
 * Pandit CRM P10.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import { getPanditCapUsage, getPanditSubscription } from '@/lib/pandit/subscription';

export async function GET(req: Request) {
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase, userId } = auth;

  try {
    const [subscription, usage] = await Promise.all([
      getPanditSubscription(supabase, userId),
      getPanditCapUsage(supabase, userId),
    ]);

    return NextResponse.json({
      subscription,
      usage,
    });
  } catch (err) {
    console.error('[pandit/subscription GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
