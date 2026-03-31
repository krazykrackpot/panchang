// Server-side only — uses Supabase service role
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

  const supabase = getServerSupabase()!;
  const { data } = await supabase
    .from('subscriptions')
    .select('tier, status, current_period_end, trial_end')
    .eq('user_id', userId)
    .single();

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

  const activeTiers = ['active', 'trialing'];
  const tier: Tier = activeTiers.includes(data.status) ? (data.tier as Tier) : 'free';
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

  const supabase = getServerSupabase()!;

  if (period === 'daily') {
    const { data } = await supabase
      .from('daily_usage')
      .select(feature)
      .eq('user_id', userId)
      .eq('usage_date', new Date().toISOString().split('T')[0])
      .single();

    const currentCount = (data as Record<string, number> | null)?.[feature] ?? 0;
    if (currentCount >= limit) {
      return { allowed: false, remaining: 0, limit };
    }

    await supabase.rpc('increment_usage', { p_user_id: userId, p_field: feature });
    return { allowed: true, remaining: limit - currentCount - 1, limit };
  }

  // Monthly
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: rows } = await supabase
    .from('daily_usage')
    .select(feature)
    .eq('user_id', userId)
    .gte('usage_date', monthStart.toISOString().split('T')[0]);

  const totalUsed = (rows || []).reduce((sum, r) => sum + ((r as Record<string, number>)[feature] ?? 0), 0);
  if (totalUsed >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  await supabase.rpc('increment_usage', { p_user_id: userId, p_field: feature });
  return { allowed: true, remaining: limit - totalUsed - 1, limit };
}

export function invalidateTierCache(userId: string): void {
  tierCache.delete(userId);
}
