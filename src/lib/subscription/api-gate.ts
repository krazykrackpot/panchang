// API route middleware  –  checks tier + usage before processing
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

/**
 * Resolves the request's user id from Bearer token (preferred) or auth cookie.
 *
 * Return shape distinguishes "no credential presented" (anonymous, → null)
 * from "credential presented but verification failed" (→ 'auth_error'). The
 * latter must NOT fall through to the free-tier branch — that silently
 * downgraded paying users on transient auth blips (P0-11). Callers should
 * treat 'auth_error' as a 401.
 */
async function extractUserId(req: Request): Promise<string | null | 'auth_error'> {
  const supabase = getServerSupabase();
  if (!supabase) return null; // Supabase not configured  –  skip auth

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error('[api-gate] bearer getUser failed:', error.message);
      return 'auth_error';
    }
    return data.user?.id ?? null;
  }
  // Try cookie-based auth for same-origin requests
  const cookie = req.headers.get('cookie');
  if (cookie) {
    const match = cookie.match(/sb-[^=]+-auth-token=([^;]+)/);
    if (match) {
      try {
        const tokenData = JSON.parse(decodeURIComponent(match[1]));
        const accessToken = Array.isArray(tokenData) ? tokenData[0] : tokenData?.access_token;
        if (accessToken) {
          const { data, error } = await supabase.auth.getUser(accessToken);
          if (error) {
            console.error('[api-gate] cookie getUser failed:', error.message);
            return 'auth_error';
          }
          return data.user?.id ?? null;
        }
      } catch (err) {
        console.error('[api-gate] cookie parse failed:', err);
        return 'auth_error';
      }
    }
  }
  return null;
}

export async function withFeatureGate(req: Request, feature: Feature): Promise<GateResult> {
  const userIdOrError = await extractUserId(req);

  // A presented-but-invalid credential is a 401, NOT a silent demotion to
  // anonymous-free. Previously this branch fell through to the free-tier
  // path and could burn quotas / leak features. (P0-11.)
  if (userIdOrError === 'auth_error') {
    return {
      allowed: false, userId: '', tier: 'free',
      error: NextResponse.json({
        error: 'unauthorized',
        message: 'Authentication failed. Please sign in again.',
      }, { status: 401 }),
    };
  }
  const userId = userIdOrError;

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
