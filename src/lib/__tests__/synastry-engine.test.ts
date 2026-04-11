import { describe, it, expect } from 'vitest';
import { getFriendshipLabel, getSignRelation, computeSynastrySummary } from '@/lib/comparison/synastry-engine';
import type { SynastryAspect } from '@/lib/comparison/synastry-engine';

describe('synastry-engine', () => {
  describe('getFriendshipLabel', () => {
    it('returns Friend for Sun-Moon', () => {
      expect(getFriendshipLabel(0, 1).level).toBe(2);
    });
    it('returns Enemy for Sun-Venus', () => {
      expect(getFriendshipLabel(0, 5).level).toBe(0);
    });
    it('returns Same for identical planets', () => {
      expect(getFriendshipLabel(3, 3).level).toBe(2);
    });
    it('handles Rahu/Ketu by mapping to Saturn', () => {
      const result = getFriendshipLabel(7, 0); // Rahu-Sun → Saturn-Sun
      expect(result.level).toBe(0); // Saturn is enemy of Sun
    });
  });

  describe('getSignRelation', () => {
    it('returns same for identical signs', () => {
      expect(getSignRelation(1, 1).relation).toBe('same');
    });
    it('returns trine for 5th apart', () => {
      expect(getSignRelation(1, 5).relation).toBe('trine'); // Aries-Leo
    });
    it('returns trine for 9th apart', () => {
      expect(getSignRelation(1, 9).relation).toBe('trine'); // Aries-Sagittarius
    });
    it('returns difficult for 6th apart', () => {
      expect(getSignRelation(1, 6).relation).toBe('difficult'); // Aries-Virgo
    });
    it('returns difficult for 8th apart', () => {
      expect(getSignRelation(1, 8).relation).toBe('difficult'); // Aries-Scorpio
    });
    it('returns neutral for 2nd apart', () => {
      expect(getSignRelation(1, 2).relation).toBe('neutral'); // Aries-Taurus
    });
  });

  describe('computeSynastrySummary', () => {
    it('computes harmonious/tense counts', () => {
      const aspects: SynastryAspect[] = [
        { planetA: 0, planetB: 1, type: 'Trine', symbol: '△', orb: 2, isHarmonious: true, interpretation: { en: '', hi: '', sa: '' } },
        { planetA: 2, planetB: 6, type: 'Square', symbol: '□', orb: 3, isHarmonious: false, interpretation: { en: '', hi: '', sa: '' } },
        { planetA: 4, planetB: 5, type: 'Sextile', symbol: '⚹', orb: 1, isHarmonious: true, interpretation: { en: '', hi: '', sa: '' } },
      ];
      const summary = computeSynastrySummary(aspects);
      expect(summary.total).toBe(3);
      expect(summary.harmonious).toBe(2);
      expect(summary.tense).toBe(1);
    });

    it('handles empty aspects', () => {
      const summary = computeSynastrySummary([]);
      expect(summary.total).toBe(0);
    });
  });
});
