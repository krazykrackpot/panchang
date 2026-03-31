// API route middleware — checks tier + usage before processing
import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { getUserTier, checkAndIncrementUsage } from './check-access';
import { type Feature, type UsageFeature, checkFeatureAccess, minTierForFeature, FEATURE_INFO } from './tiers';

interface GateResult {
  allowed: boolean;
  userId: string;
  tier: 'free' | 'pro' | 'jyotishi';
  error?: NextResponse;
}

async function extractUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const supabase = getServerSupabase()!;
    const { data } = await supabase.auth.getUser(token);
    return data.user?.id ?? null;
  }
  // Try cookie-based auth for same-origin requests
  const cookie = req.headers.get('cookie');
  if (cookie) {
    const supabase = getServerSupabase()!;
    // Try to extract user from the sb-access-token cookie
    const match = cookie.match(/sb-[^=]+-auth-token=([^;]+)/);
    if (match) {
      try {
        const tokenData = JSON.parse(decodeURIComponent(match[1]));
        const accessToken = Array.isArray(tokenData) ? tokenData[0] : tokenData?.access_token;
        if (accessToken) {
          const { data } = await supabase.auth.getUser(accessToken);
          return data.user?.id ?? null;
        }
      } catch { /* invalid cookie */ }
    }
  }
  return null;
}

export async function withFeatureGate(req: Request, feature: Feature): Promise<GateResult> {
  const userId = await extractUserId(req);

  if (!userId) {
    const hasAccess = checkFeatureAccess(feature, 'free');
    if (!hasAccess) {
      return {
        allowed: false, userId: '', tier: 'free',
        error: NextResponse.json({
          error: 'upgrade_required', feature,
          featureName: FEATURE_INFO[feature]?.en || feature,
          requiredTier: minTierForFeature(feature),
          message: `This feature requires a ${minTierForFeature(feature)} subscription.`,
        }, { status: 403 }),
      };
    }
    return { allowed: true, userId: '', tier: 'free' };
  }

  const { tier } = await getUserTier(userId);
  if (!checkFeatureAccess(feature, tier)) {
    const minTier = minTierForFeature(feature);
    return {
      allowed: false, userId, tier,
      error: NextResponse.json({
        error: 'upgrade_required', feature,
        featureName: FEATURE_INFO[feature]?.en || feature,
        requiredTier: minTier,
        message: `This feature requires a ${minTier} subscription. You are on the ${tier} plan.`,
      }, { status: 403 }),
    };
  }

  return { allowed: true, userId, tier };
}

export async function withUsageGate(
  req: Request, feature: Feature, usageField: UsageFeature
): Promise<GateResult & { remaining?: number; limit?: number }> {
  const gate = await withFeatureGate(req, feature);
  if (!gate.allowed) return gate;

  if (!gate.userId) return { ...gate, remaining: 0, limit: 2 };

  const usage = await checkAndIncrementUsage(gate.userId, usageField, gate.tier);
  if (!usage.allowed) {
    return {
      allowed: false, userId: gate.userId, tier: gate.tier,
      remaining: 0, limit: usage.limit,
      error: NextResponse.json({
        error: 'usage_limit_reached', feature,
        featureName: FEATURE_INFO[feature]?.en || feature,
        limit: usage.limit,
        message: `You have reached your daily limit of ${usage.limit} for this feature. Upgrade for more.`,
      }, { status: 429 }),
    };
  }

  return { ...gate, remaining: usage.remaining, limit: usage.limit };
}
