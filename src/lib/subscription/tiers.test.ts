import { describe, it, expect } from 'vitest';
import {
  checkFeatureAccess,
  getUsageLimit,
  minTierForFeature,
  TIER_CONFIG,
  type Feature,
} from './tiers';

describe('Subscription Tiers', () => {
  // ── checkFeatureAccess ──────────────────────────────────────────────

  describe('checkFeatureAccess', () => {
    it('free tier has access to all non-batch features', () => {
      const freeFeatures: Feature[] = [
        'kundali', 'ai_chat', 'pdf_export', 'muhurta_ai',
        'matching_full', 'shadbala_full', 'yogas_full',
        'varshaphal', 'kp_system', 'prashna',
        'tippanni_full', 'varga_full', 'ad_free',
      ];
      for (const f of freeFeatures) {
        expect(checkFeatureAccess(f, 'free'), `free should have ${f}`).toBe(true);
      }
    });

    it('free tier does NOT have batch or api_access', () => {
      expect(checkFeatureAccess('batch', 'free')).toBe(false);
      expect(checkFeatureAccess('api_access', 'free')).toBe(false);
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
    it('free tier kundali_count = unlimited', () => {
      const r = getUsageLimit('kundali_count', 'free');
      expect(r.limit).toBe(-1);
      expect(r.period).toBe('daily');
    });

    it('free tier ai_chat_count = 2 daily (AI calls restricted)', () => {
      const r = getUsageLimit('ai_chat_count', 'free');
      expect(r.limit).toBe(2);
      expect(r.period).toBe('daily');
    });

    it('free tier muhurta_scan_count = 2 monthly (AI calls restricted)', () => {
      const r = getUsageLimit('muhurta_scan_count', 'free');
      expect(r.limit).toBe(2);
      expect(r.period).toBe('monthly');
    });

    it('free tier pdf_export = unlimited', () => {
      const r = getUsageLimit('pdf_export_count', 'free');
      expect(r.limit).toBe(-1);
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
    it('all computation features require free tier', () => {
      const freeFeatures: Feature[] = [
        'kundali', 'varshaphal', 'kp_system', 'prashna',
        'matching_full', 'shadbala_full', 'varga_full',
      ];
      for (const f of freeFeatures) {
        expect(minTierForFeature(f), f).toBe('free');
      }
    });

    it('batch requires jyotishi tier', () => {
      expect(minTierForFeature('batch')).toBe('jyotishi');
    });

    it('api_access requires jyotishi tier', () => {
      expect(minTierForFeature('api_access')).toBe('jyotishi');
    });
  });

  // ── Free tier — all features unlocked except batch/api ──────────────

  describe('Free tier — all features unlocked', () => {
    it('free tier has 13 features (everything except batch + api_access)', () => {
      expect(TIER_CONFIG.free.features.size).toBe(13);
    });

    it('free tier saved_charts = unlimited', () => {
      expect(TIER_CONFIG.free.total['saved_charts']).toBe(-1);
    });
  });

  // ── Pro tier scope ──────────────────────────────────────────────────

  describe('Pro tier scope', () => {
    it('pro tier has 13 features', () => {
      expect(TIER_CONFIG.pro.features.size).toBe(13);
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
