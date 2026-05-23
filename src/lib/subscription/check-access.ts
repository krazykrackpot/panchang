// Server-side only  –  uses Supabase service role
import { getServerSupabase } from '@/lib/supabase/server';
import { type Tier, type UsageFeature, getUsageLimit } from './tiers';

interface TierResult {
  tier: Tier;
  status: string;
}

const tierCache = new Map<string, { data: TierResult; expiry: number }>();

export async function getUserTier(userId: string): Promise<TierResult> {
  const cached = tierCache.get(userId);
  if (cached && cached.expiry > Date.now()) return cached.data;

  const supabase = getServerSupabase();
  if (!supabase) return { tier: 'free', status: 'active' }; // Fail safe, not crash
  const { data, error } = await supabase
    .from('subscriptions')
    .select('tier, status, current_period_end, trial_end')
    .eq('user_id', userId)
    .single();

  // PGRST116 = no row (the genuine "user has no subscription" case → free tier).
  // Any other error is a real DB problem. Per the audit (P0-9), the previous
  // code dropped the error and cached `free` for 60s on any transient blip —
  // demoting paying users mid-session with zero diagnostic.
  if (error && error.code !== 'PGRST116') {
    console.error('[check-access] getUserTier supabase error:', error.message);
    // Fail open WITHOUT caching so the next call retries cleanly.
    // Returning the previously-cached tier if available avoids flashing a
    // user to "free" on a one-shot blip.
    if (cached) return cached.data;
    // No prior cache — best-effort: assume free, but DO NOT cache. The next
    // call will hit the DB again and self-heal.
    return { tier: 'free', status: 'active' };
  }

  if (!data) {
    const result: TierResult = { tier: 'free', status: 'active' };
    tierCache.set(userId, { data: result, expiry: Date.now() + 60000 });
    return result;
  }

  if (data.status === 'trialing' && data.trial_end && new Date(data.trial_end) < new Date()) {
    await supabase
      .from('subscriptions')
      .update({ tier: 'free', status: 'expired' })
      .eq('user_id', userId);
    const result: TierResult = { tier: 'free', status: 'expired' };
    tierCache.set(userId, { data: result, expiry: Date.now() + 60000 });
    return result;
  }

  if (data.status === 'cancelled' && data.current_period_end && new Date(data.current_period_end) < new Date()) {
    await supabase
      .from('subscriptions')
      .update({ tier: 'free', status: 'expired' })
      .eq('user_id', userId);
    const result: TierResult = { tier: 'free', status: 'expired' };
    tierCache.set(userId, { data: result, expiry: Date.now() + 60000 });
    return result;
  }

  // Cancelled users keep their tier until current_period_end passes
  const isActive = data.status === 'active' || data.status === 'trialing';
  const isCancelledButStillPaid = data.status === 'cancelled'
    && data.current_period_end
    && new Date(data.current_period_end) > new Date();
  const tier: Tier = (isActive || isCancelledButStillPaid) ? (data.tier as Tier) : 'free';
  const result: TierResult = { tier, status: data.status };
  tierCache.set(userId, { data: result, expiry: Date.now() + 60000 });
  return result;
}

export async function checkAndIncrementUsage(
  userId: string,
  feature: UsageFeature,
  tier: Tier,
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const { limit, period } = getUsageLimit(feature, tier);
  if (limit === -1) return { allowed: true, remaining: -1, limit: -1 };

  const supabase = getServerSupabase();
  if (!supabase) return { allowed: false, remaining: 0, limit };

  if (period === 'daily') {
    const { data, error } = await supabase
      .from('daily_usage')
      .select(feature)
      .eq('user_id', userId)
      .eq('usage_date', new Date().toISOString().split('T')[0])
      .single();

    // PGRST116 = no row yet (first call of the day → 0 used). Any other
    // error is a real DB failure. Per the audit (P0-10), the previous
    // code dropped the error and `currentCount` defaulted to 0, letting
    // requests through and burning quota on a transient blip. Fail closed.
    if (error && error.code !== 'PGRST116') {
      console.error('[check-access] checkAndIncrementUsage daily select error:', error.message);
      return { allowed: false, remaining: 0, limit };
    }

    const currentCount = (data as Record<string, number> | null)?.[feature] ?? 0;
    if (currentCount >= limit) {
      return { allowed: false, remaining: 0, limit };
    }

    const { error: incErr } = await supabase.rpc('increment_usage', { p_user_id: userId, p_field: feature });
    if (incErr) {
      console.error('[check-access] increment_usage (daily) failed:', incErr.message);
      // Counter not incremented — fail closed so we don't grant access we
      // can't account for. User can retry; correctness > UX here.
      return { allowed: false, remaining: 0, limit };
    }
    return { allowed: true, remaining: limit - currentCount - 1, limit };
  }

  // Monthly — use UTC explicitly (Vercel runs UTC, but be safe)
  const now = new Date();
  const monthStartStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`;

  const { data: rows, error: monthErr } = await supabase
    .from('daily_usage')
    .select(feature)
    .eq('user_id', userId)
    .gte('usage_date', monthStartStr);

  if (monthErr) {
    console.error('[check-access] checkAndIncrementUsage monthly select error:', monthErr.message);
    return { allowed: false, remaining: 0, limit };
  }

  const totalUsed = (rows || []).reduce((sum, r) => sum + ((r as Record<string, number>)[feature] ?? 0), 0);
  if (totalUsed >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  const { error: incErr } = await supabase.rpc('increment_usage', { p_user_id: userId, p_field: feature });
  if (incErr) {
    console.error('[check-access] increment_usage (monthly) failed:', incErr.message);
    return { allowed: false, remaining: 0, limit };
  }
  return { allowed: true, remaining: limit - totalUsed - 1, limit };
}

export function invalidateTierCache(userId: string): void {
  tierCache.delete(userId);
}
