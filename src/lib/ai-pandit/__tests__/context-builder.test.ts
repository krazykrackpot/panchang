/**
 * Context Builder Tests
 *
 * Verifies that KundaliData is correctly translated to SAC.
 * Every field mapping from the design doc (Issues 1-8) is tested here.
 */

import { describe, it, expect } from 'vitest';
import { buildContext } from '../context/context-builder';
import { SAMPLE_KUNDALI } from './fixtures/sample-kundali';

describe('buildContext', () => {
  // Use a fixed date so dasha resolution is deterministic
  const TODAY = '2026-05-13';
  const sac = buildContext(SAMPLE_KUNDALI, 'career', TODAY);

  // ── Birth data ──
  describe('birth', () => {
    it('copies birth data from KundaliData', () => {
      expect(sac.birth.date).toBe('1990-06-15');
      expect(sac.birth.time).toBe('10:30');
      expect(sac.birth.place).toBe('Bern, Switzerland');
      expect(sac.birth.coordinates).toEqual([46.9481, 7.4474]);
      expect(sac.birth.timezone).toBe('Europe/Zurich');
    });
  });

  // ── Ascendant ──
  describe('ascendant', () => {
    it('maps ascendant sign and name', () => {
      expect(sac.ascendant.sign).toBe(1); // Aries
      expect(sac.ascendant.signName).toBe('Aries');
    });

    it('computes nakshatra from degree', () => {
      // 25.5° Aries → sidereal longitude = 25.5°
      // Nakshatra: Bharani (13.33° - 26.67°)
      expect(sac.ascendant.nakshatra).toBe('Bharani');
    });

    it('computes pada from degree', () => {
      // 25.5° - 13.33° = 12.17° into Bharani
      // 12.17 / 3.333 = 3.65 → pada 4
      expect(sac.ascendant.pada).toBe(4);
    });

    it('formats degree as DD°MM\'SS"', () => {
      // 25.5° → 25°30'00"
      expect(sac.ascendant.degree).toBe('25°30\'00"');
    });
  });

  // ── Planets ──
  describe('planets', () => {
    it('maps all 9 planets', () => {
      expect(sac.planets).toHaveLength(9);
    });

    it('maps planet ID and English name', () => {
      const saturn = sac.planets.find(p => p.id === 6);
      expect(saturn?.name).toBe('Saturn');
      expect(saturn?.sign).toBe(7); // Libra
      expect(saturn?.house).toBe(7);
    });

    it('maps sign name from RASHIS constant', () => {
      const jupiter = sac.planets.find(p => p.id === 4);
      expect(jupiter?.signName).toBe('Cancer');
    });

    it('maps nakshatra name from PlanetPosition', () => {
      const moon = sac.planets.find(p => p.id === 1);
      expect(moon?.nakshatra).toBe('Rohini');
    });

    it('computes dignity correctly — exalted', () => {
      // Saturn in Libra (7) → exalted
      const saturn = sac.planets.find(p => p.id === 6);
      expect(saturn?.dignity).toBe('exalted');

      // Jupiter in Cancer (4) → exalted
      const jupiter = sac.planets.find(p => p.id === 4);
      expect(jupiter?.dignity).toBe('exalted');

      // Moon in Taurus (2) → exalted
      const moon = sac.planets.find(p => p.id === 1);
      expect(moon?.dignity).toBe('exalted');
    });

    it('computes dignity correctly — own/moolatrikona sign', () => {
      // Mars in Aries (1) at 10.5° → moolatrikona (Aries 0-12° per BPHS Ch.4)
      const mars = sac.planets.find(p => p.id === 2);
      expect(mars?.dignity).toBe('moolatrikona');

      // Mercury in Gemini (3) → own (moolatrikona is Virgo, not Gemini)
      const mercury = sac.planets.find(p => p.id === 3);
      expect(mercury?.dignity).toBe('own');
    });

    it('maps retrograde status', () => {
      const saturn = sac.planets.find(p => p.id === 6);
      expect(saturn?.isRetrograde).toBe(true);

      const jupiter = sac.planets.find(p => p.id === 4);
      expect(jupiter?.isRetrograde).toBe(false);
    });

    it('maps combust status', () => {
      // No planets combust in fixture
      expect(sac.planets.every(p => p.isCombust === false)).toBe(true);
    });

    it('maps speed', () => {
      const moon = sac.planets.find(p => p.id === 1);
      expect(moon?.speed).toBe(13.2);
    });
  });

  // ── Dasha (Issue 8: DashaEntry.planet is string) ──
  describe('dasha', () => {
    it('identifies active mahadasha', () => {
      expect(sac.dasha.mahadasha.lordName).toBe('Saturn');
      expect(sac.dasha.mahadasha.lordId).toBe(6);
      expect(sac.dasha.mahadasha.start).toBe('2023-04-15');
    });

    it('identifies active antardasha based on date', () => {
      // On 2026-05-13, Mercury antardasha should be active (2026-04-18 to 2029-01-01)
      expect(sac.dasha.antardasha.lordName).toBe('Mercury');
      expect(sac.dasha.antardasha.lordId).toBe(3);
    });

    it('handles missing pratyantardasha gracefully', () => {
      // Fixture has no pratyantar subperiods
      expect(sac.dasha.pratyantardasha).toBeUndefined();
    });
  });

  // ── Yogas (Issue 3: .present not .detected, strength capitalised) ──
  describe('yogas', () => {
    it('includes only present yogas (not doshas)', () => {
      // Gajakesari (present, moon_based) and Budhaditya (present, sun_based)
      // Mangal Dosha (present, dosha) should NOT be in yogas
      // Raja Yoga (not present) should NOT be in yogas
      expect(sac.yogas).toHaveLength(2);
      expect(sac.yogas.map(y => y.name)).toContain('Gajakesari Yoga');
      expect(sac.yogas.map(y => y.name)).toContain('Budhaditya Yoga');
    });

    it('normalises strength to lowercase', () => {
      const gk = sac.yogas.find(y => y.name === 'Gajakesari Yoga');
      expect(gk?.strength).toBe('strong'); // Was 'Strong' in YogaComplete
    });

    it('excludes non-present yogas', () => {
      expect(sac.yogas.map(y => y.name)).not.toContain('Raja Yoga');
    });
  });

  // ── Doshas ──
  describe('doshas', () => {
    it('includes only present doshas', () => {
      expect(sac.doshas).toHaveLength(1);
      expect(sac.doshas[0].name).toBe('Mangal Dosha');
    });

    it('defaults severity to moderate', () => {
      expect(sac.doshas[0].severity).toBe('moderate');
    });
  });

  // ── Transits (Issue 1: correct signature, Issue 2: .currentSign) ──
  describe('transits', () => {
    it('returns transit entries for slow planets', () => {
      // computeCurrentTransits returns Jupiter, Saturn, Rahu, Ketu
      expect(sac.transits.length).toBeGreaterThanOrEqual(1);
      expect(sac.transits.length).toBeLessThanOrEqual(4);
    });

    it('each transit has required fields', () => {
      for (const t of sac.transits) {
        expect(t.planetId).toBeGreaterThanOrEqual(0);
        expect(t.planetName).toBeTruthy();
        expect(t.sign).toBeGreaterThanOrEqual(1);
        expect(t.sign).toBeLessThanOrEqual(12);
        expect(t.houseFromMoon).toBeGreaterThanOrEqual(1);
        expect(t.houseFromMoon).toBeLessThanOrEqual(12);
        expect(t.houseFromLagna).toBeGreaterThanOrEqual(1);
        expect(t.houseFromLagna).toBeLessThanOrEqual(12);
        expect(typeof t.isRetrograde).toBe('boolean');
        expect(typeof t.savBindus).toBe('number');
      }
    });
  });

  // ── Sade Sati (Issue 4: .currentPhase not .phase) ──
  describe('sadeSati', () => {
    it('maps isActive to active', () => {
      expect(sac.sadeSati.active).toBe(true);
    });

    it('maps currentPhase to phase', () => {
      expect(sac.sadeSati.phase).toBe('peak');
    });
  });

  // ── Kaal Sarpa ──
  describe('kaalSarpa', () => {
    it('detects kaal sarpa absence', () => {
      // No kaal sarpa in fixture
      expect(sac.kaalSarpa.active).toBe(false);
      expect(sac.kaalSarpa.type).toBeNull();
    });
  });

  // ── Shadbala (Issue 5: SHADBALA_REQUIRED) ──
  describe('shadbala', () => {
    it('maps all 7 planets with total, required, and ratio', () => {
      expect(Object.keys(sac.shadbala)).toHaveLength(7);

      const sun = sac.shadbala[0];
      expect(sun.total).toBe(420);
      expect(sun.required).toBe(390);
      expect(sun.ratio).toBeCloseTo(420 / 390, 2);
    });

    it('uses correct BPHS required values', () => {
      expect(sac.shadbala[0].required).toBe(390);  // Sun
      expect(sac.shadbala[1].required).toBe(360);  // Moon
      expect(sac.shadbala[3].required).toBe(420);  // Mercury
    });
  });

  // ── Ashtakavarga ──
  describe('ashtakavarga', () => {
    it('maps savTable to houseScores', () => {
      expect(sac.ashtakavarga?.houseScores).toEqual([28, 32, 25, 30, 35, 22, 29, 26, 33, 31, 27, 24]);
    });
  });

  // ── Domain verdicts ──
  describe('domainVerdicts', () => {
    it('has a verdict for the queried category', () => {
      const career = sac.domainVerdicts.career;
      expect(career).toBeDefined();
      expect(['FAVOURABLE', 'MIXED', 'CAUTION', 'CHALLENGING']).toContain(career!.verdict);
    });

    it('has at least one factor', () => {
      const career = sac.domainVerdicts.career;
      expect(career!.factors.length).toBeGreaterThan(0);
    });

    it('sets primaryVerdict from the queried category', () => {
      expect(sac.primaryVerdict).toBe(sac.domainVerdicts.career!.verdict);
    });
  });

  // ── Overall shape ──
  describe('SAC shape', () => {
    it('has all required top-level fields', () => {
      expect(sac.birth).toBeDefined();
      expect(sac.ascendant).toBeDefined();
      expect(sac.planets).toBeDefined();
      expect(sac.dasha).toBeDefined();
      expect(sac.yogas).toBeDefined();
      expect(sac.doshas).toBeDefined();
      expect(sac.transits).toBeDefined();
      expect(sac.sadeSati).toBeDefined();
      expect(sac.kaalSarpa).toBeDefined();
      expect(sac.shadbala).toBeDefined();
      expect(sac.domainVerdicts).toBeDefined();
      expect(sac.primaryVerdict).toBeDefined();
      expect(sac.primaryFactors).toBeDefined();
    });
  });
});
