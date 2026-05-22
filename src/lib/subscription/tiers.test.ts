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
        'kundali', 'pdf_export',
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
        'kundali', 'pdf_export',
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
  //
  // The ai_chat_count and muhurta_scan_count usage features were removed
  // when the underlying AI surfaces were retired in favour of Brihaspati
  // (spec §Existing Feature Handling). Only kundali_count and
  // pdf_export_count remain.

  describe('getUsageLimit', () => {
    it('free tier kundali_count = unlimited', () => {
      const r = getUsageLimit('kundali_count', 'free');
      expect(r.limit).toBe(-1);
      expect(r.period).toBe('daily');
    });

    it('free tier pdf_export = unlimited', () => {
      const r = getUsageLimit('pdf_export_count', 'free');
      expect(r.limit).toBe(-1);
      expect(r.period).toBe('daily');
    });

    it('jyotishi tier kundali/pdf unlimited (-1)', () => {
      expect(getUsageLimit('kundali_count', 'jyotishi').limit).toBe(-1);
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

  // ── Free tier  –  all features unlocked except batch/api ──────────────

  describe('Free tier  –  all features unlocked', () => {
    it('free tier has 11 features (everything except batch + api_access)', () => {
      expect(TIER_CONFIG.free.features.size).toBe(11);
    });

    it('free tier saved_charts = unlimited', () => {
      expect(TIER_CONFIG.free.total['saved_charts']).toBe(-1);
    });
  });

  // ── Pro tier scope ──────────────────────────────────────────────────

  describe('Pro tier scope', () => {
    it('pro tier has the same 11 features as free (Brihaspati is the paid surface now)', () => {
      expect(TIER_CONFIG.pro.features.size).toBe(11);
    });
  });

  // ── Jyotishi tier scope ─────────────────────────────────────────────

  describe('Jyotishi tier scope', () => {
    it('jyotishi tier has 13 features (all)', () => {
      expect(TIER_CONFIG.jyotishi.features.size).toBe(13);
    });

    it('jyotishi tier saved_charts = unlimited', () => {
      expect(TIER_CONFIG.jyotishi.total['saved_charts']).toBe(-1);
    });
  });
});
