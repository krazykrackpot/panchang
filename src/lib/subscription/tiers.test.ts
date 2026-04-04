import { describe, it, expect } from 'vitest';
import {
  checkFeatureAccess,
  getUsageLimit,
  minTierForFeature,
  TIER_CONFIG,
  type Tier,
  type Feature,
} from './tiers';

describe('Subscription Tiers', () => {
  // ── checkFeatureAccess ──────────────────────────────────────────────

  describe('checkFeatureAccess', () => {
    it('free tier has access to kundali', () => {
      expect(checkFeatureAccess('kundali', 'free')).toBe(true);
    });

    it('free tier has access to ai_chat', () => {
      expect(checkFeatureAccess('ai_chat', 'free')).toBe(true);
    });

    it('free tier has access to pdf_export', () => {
      expect(checkFeatureAccess('pdf_export', 'free')).toBe(true);
    });

    it('free tier has access to muhurta_ai', () => {
      expect(checkFeatureAccess('muhurta_ai', 'free')).toBe(true);
    });

    it('free tier does NOT have matching_full', () => {
      expect(checkFeatureAccess('matching_full', 'free')).toBe(false);
    });

    it('free tier has varshaphal', () => {
      expect(checkFeatureAccess('varshaphal', 'free')).toBe(true);
    });

    it('free tier does NOT have batch', () => {
      expect(checkFeatureAccess('batch', 'free')).toBe(false);
    });

    it('free tier does NOT have api_access', () => {
      expect(checkFeatureAccess('api_access', 'free')).toBe(false);
    });

    it('free tier does NOT have ad_free', () => {
      expect(checkFeatureAccess('ad_free', 'free')).toBe(false);
    });

    it('pro tier unlocks matching_full', () => {
      expect(checkFeatureAccess('matching_full', 'pro')).toBe(true);
    });

    it('pro tier unlocks varshaphal', () => {
      expect(checkFeatureAccess('varshaphal', 'pro')).toBe(true);
    });

    it('pro tier unlocks kp_system', () => {
      expect(checkFeatureAccess('kp_system', 'pro')).toBe(true);
    });

    it('pro tier unlocks ad_free', () => {
      expect(checkFeatureAccess('ad_free', 'pro')).toBe(true);
    });

    it('pro tier does NOT have batch', () => {
      expect(checkFeatureAccess('batch', 'pro')).toBe(false);
    });

    it('pro tier does NOT have api_access', () => {
      expect(checkFeatureAccess('api_access', 'pro')).toBe(false);
    });

    it('jyotishi tier has batch', () => {
      expect(checkFeatureAccess('batch', 'jyotishi')).toBe(true);
    });

    it('jyotishi tier has api_access', () => {
      expect(checkFeatureAccess('api_access', 'jyotishi')).toBe(true);
    });

    it('jyotishi tier has all features', () => {
      const allFeatures: Feature[] = [
        'kundali', 'ai_chat', 'pdf_export', 'muhurta_ai',
        'matching_full', 'shadbala_full', 'yogas_full',
        'varshaphal', 'kp_system', 'prashna',
        'tippanni_full', 'varga_full', 'ad_free',
        'batch', 'api_access',
      ];
      for (const f of allFeatures) {
        expect(checkFeatureAccess(f, 'jyotishi')).toBe(true);
      }
    });
  });

  // ── getUsageLimit ───────────────────────────────────────────────────

  describe('getUsageLimit', () => {
    it('free tier kundali_count = 2 daily', () => {
      const r = getUsageLimit('kundali_count', 'free');
      expect(r.limit).toBe(2);
      expect(r.period).toBe('daily');
    });

    it('free tier ai_chat_count = 2 daily', () => {
      const r = getUsageLimit('ai_chat_count', 'free');
      expect(r.limit).toBe(2);
      expect(r.period).toBe('daily');
    });

    it('free tier muhurta_scan_count = 2 monthly', () => {
      const r = getUsageLimit('muhurta_scan_count', 'free');
      expect(r.limit).toBe(2);
      expect(r.period).toBe('monthly');
    });

    it('pro tier kundali_count = -1 (unlimited) daily', () => {
      const r = getUsageLimit('kundali_count', 'pro');
      expect(r.limit).toBe(-1);
      expect(r.period).toBe('daily');
    });

    it('pro tier ai_chat_count = 20 daily', () => {
      const r = getUsageLimit('ai_chat_count', 'pro');
      expect(r.limit).toBe(20);
      expect(r.period).toBe('daily');
    });

    it('jyotishi tier everything unlimited (-1)', () => {
      expect(getUsageLimit('kundali_count', 'jyotishi').limit).toBe(-1);
      expect(getUsageLimit('ai_chat_count', 'jyotishi').limit).toBe(-1);
      expect(getUsageLimit('muhurta_scan_count', 'jyotishi').limit).toBe(-1);
      expect(getUsageLimit('pdf_export_count', 'jyotishi').limit).toBe(-1);
    });
  });

  // ── minTierForFeature ───────────────────────────────────────────────

  describe('minTierForFeature', () => {
    it('kundali requires free tier', () => {
      expect(minTierForFeature('kundali')).toBe('free');
    });

    it('ai_chat requires free tier', () => {
      expect(minTierForFeature('ai_chat')).toBe('free');
    });

    it('matching_full requires pro tier', () => {
      expect(minTierForFeature('matching_full')).toBe('pro');
    });

    it('varshaphal requires free tier', () => {
      expect(minTierForFeature('varshaphal')).toBe('free');
    });

    it('batch requires jyotishi tier', () => {
      expect(minTierForFeature('batch')).toBe('jyotishi');
    });

    it('api_access requires jyotishi tier', () => {
      expect(minTierForFeature('api_access')).toBe('jyotishi');
    });
  });

  // ── Free tier limited features ──────────────────────────────────────

  describe('Free tier limitations', () => {
    it('free tier has exactly 5 features', () => {
      expect(TIER_CONFIG.free.features.size).toBe(5);
    });

    it('free tier saved_charts total limit = 4', () => {
      expect(TIER_CONFIG.free.total['saved_charts']).toBe(4);
    });
  });

  // ── Pro tier scope ──────────────────────────────────────────────────

  describe('Pro tier scope', () => {
    it('pro tier has 13 features', () => {
      expect(TIER_CONFIG.pro.features.size).toBe(13);
    });

    it('pro tier saved_charts total limit = 25', () => {
      expect(TIER_CONFIG.pro.total['saved_charts']).toBe(25);
    });
  });

  // ── Jyotishi tier scope ─────────────────────────────────────────────

  describe('Jyotishi tier scope', () => {
    it('jyotishi tier has 15 features (all)', () => {
      expect(TIER_CONFIG.jyotishi.features.size).toBe(15);
    });

    it('jyotishi tier saved_charts = unlimited', () => {
      expect(TIER_CONFIG.jyotishi.total['saved_charts']).toBe(-1);
    });
  });
});
