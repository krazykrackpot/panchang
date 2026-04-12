/**
 * Parses API gate error responses (403 upgrade_required, 429 usage_limit_reached)
 * and returns structured data for the UsageLimitBanner component.
 *
 * Returns null if the response is not a gate error.
 */
export interface GateError {
  type: 'upgrade_required' | 'usage_limit_reached';
  feature: string;
  featureName: string;
  requiredTier?: string;
  limit?: number;
  message: string;
}

export async function parseGateError(res: Response): Promise<GateError | null> {
  if (res.status !== 403 && res.status !== 429) return null;

  try {
    const data = await res.json();
    if (data.error === 'upgrade_required') {
      return {
        type: 'upgrade_required',
        feature: data.feature || 'unknown',
        featureName: data.featureName || 'This feature',
        requiredTier: data.requiredTier || 'pro',
        message: data.message || 'This feature requires a paid subscription.',
      };
    }
    if (data.error === 'usage_limit_reached') {
      return {
        type: 'usage_limit_reached',
        feature: data.feature || 'unknown',
        featureName: data.featureName || 'This feature',
        limit: data.limit || 0,
        message: data.message || 'You have reached your usage limit for this feature.',
      };
    }
  } catch {
    // JSON parse failed — not a gate error
  }
  return null;
}
