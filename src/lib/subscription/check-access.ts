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
    // Round 2 IDEM-5 — atomic check-and-increment via claim_usage RPC.
    // The previous read-then-increment had a TOCTOU race where two
    // concurrent callers both saw the same pre-increment count, both
    // passed the gate, and both incremented — landing N over the limit.
    // claim_usage (migration 038) is a single UPDATE … WHERE … < limit
    // RETURNING … and either updates the row (granted) or doesn't
    // (at-limit). No intermediate state.
    const { data, error } = await supabase.rpc('claim_usage', {
      p_user_id: userId,
      p_field: feature,
      p_limit: limit,
    });
    if (error) {
      console.error('[check-access] claim_usage (daily) failed:', error.message);
      // Fail closed — don't grant access without an accounted increment.
      return { allowed: false, remaining: 0, limit };
    }
    // Supabase rpc() returns the table-valued result as an array; pull
    // the first row.
    const row = Array.isArray(data) ? data[0] : data;
    const claimed = Boolean(row?.claimed);
    const newCount = Number(row?.new_count ?? limit);
    if (!claimed) {
      return { allowed: false, remaining: 0, limit };
    }
    return { allowed: true, remaining: Math.max(0, limit - newCount), limit };
  }

  // Monthly — atomic check-and-increment via claim_monthly_usage RPC.
  //
  // Pre-migration-059 history: this path used a JS-side SELECT to sum
  // daily counts since `${currentUTC}-01`, then a `claim_usage` RPC with
  // `p_limit=-1` to unconditionally increment. That pattern double-served
  // (the SELECT WAS the monthly cap check; the RPC was the daily-row
  // upsert), and it broke when migration 059 rebodied claim_usage to key
  // on user-TZ today: a user in IST/CET near UTC midnight could end up
  // with the JS SELECT (UTC month-start) counting rows that the server
  // had written under the user's local-tz month — over-counting and
  // wrongly blocking them at the limit.
  //
  // Switch to `claim_monthly_usage` (migration 038, re-bodied in 059)
  // which atomically: takes the FOR-UPDATE lock on the user's
  // current-month rows, sums the feature column, denies if >= limit, or
  // increments today's row otherwise. Same TZ resolution as claim_usage
  // — no JS-side TZ logic needed. Same atomicity guarantee as the daily
  // path.
  const { data: claimData, error: claimErr } = await supabase.rpc('claim_monthly_usage', {
    p_user_id: userId,
    p_field: feature,
    p_limit: limit,
  });
  if (claimErr) {
    console.error('[check-access] claim_monthly_usage failed:', claimErr.message);
    return { allowed: false, remaining: 0, limit };
  }
  const row = Array.isArray(claimData) ? claimData[0] : claimData;
  const claimed = Boolean(row?.claimed);
  const newCount = Number(row?.new_count ?? limit);
  if (!claimed) {
    return { allowed: false, remaining: 0, limit };
  }
  return { allowed: true, remaining: Math.max(0, limit - newCount), limit };
}

export function invalidateTierCache(userId: string): void {
  tierCache.delete(userId);
}
