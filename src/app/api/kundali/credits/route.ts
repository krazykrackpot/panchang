/**
 * GET /api/kundali/credits
 *
 * Returns the authenticated user's credit balance + recent purchase
 * history + list of entitled kundalis.
 *
 * Used by:
 *   - The TippanniPaywall to show "You have N credits" + an "Unlock this chart" CTA
 *   - The /account/credits page to render the dashboard
 *
 * Optionally accepts ?fingerprint=<hex> to also return whether this
 * specific chart is already unlocked (saves a second round-trip from
 * the paywall component).
 */
import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const queryFingerprint = url.searchParams.get('fingerprint');

  // Balance. Per CLAUDE.md lesson AA: log DB errors with a tagged prefix
  // so ops can chase silent read failures without surfacing 500s to the
  // user for what is fundamentally a read-only credits panel.
  const { data: credits, error: creditsErr } = await supabase
    .from('chart_credits')
    .select('credits_remaining, total_purchased, total_spent')
    .eq('user_id', user.id)
    .maybeSingle();
  if (creditsErr) console.error('[kundali/credits] chart_credits read failed:', creditsErr.message);

  // Purchase history (last 20).
  const { data: purchases, error: purchasesErr } = await supabase
    .from('chart_credit_purchases')
    .select('id, sku, credits_granted, amount_paid_minor, currency, provider, purchased_at')
    .eq('user_id', user.id)
    .order('purchased_at', { ascending: false })
    .limit(20);
  if (purchasesErr) console.error('[kundali/credits] chart_credit_purchases read failed:', purchasesErr.message);

  // Entitled charts (last 50).
  const { data: entitlements, error: entitlementsErr } = await supabase
    .from('chart_entitlements')
    .select('id, kundali_fingerprint, display_name, unlocked_at, source')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false })
    .limit(50);
  if (entitlementsErr) console.error('[kundali/credits] chart_entitlements read failed:', entitlementsErr.message);

  // Optional per-fingerprint check. Query the DB directly (rather than
  // filtering the top-50 list above) so a user who unlocked >50 charts
  // still gets the correct answer for an older chart — otherwise the
  // paywall would re-appear for entitlements that fell off the list.
  let entitled = false;
  if (queryFingerprint && /^[0-9a-f]{64}$/.test(queryFingerprint)) {
    const { data: entRow, error: entRowErr } = await supabase
      .from('chart_entitlements')
      .select('id')
      .eq('user_id', user.id)
      .eq('kundali_fingerprint', queryFingerprint)
      .maybeSingle();
    if (entRowErr) console.error('[kundali/credits] fingerprint lookup failed:', entRowErr.message);
    entitled = !!entRow;
  }

  return NextResponse.json({
    creditsRemaining: credits?.credits_remaining ?? 0,
    totalPurchased: credits?.total_purchased ?? 0,
    totalSpent: credits?.total_spent ?? 0,
    purchases: purchases ?? [],
    entitlements: entitlements ?? [],
    entitled,
  });
}
