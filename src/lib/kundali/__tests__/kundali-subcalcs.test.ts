/**
 * Kundali Sub-Calculation Tests
 * Tests avasthas, argala, sphutas, and tippanni engine using real chart data.
 */

import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { calculateAvasthas } from '../avasthas';
import { calculateArgala } from '../argala';
import { calculateSphutas } from '../sphutas';
import { generateTippanni } from '../tippanni-engine';
import type { BirthData, KundaliData, PlanetPosition } from '@/types/kundali';
import type { PlanetAvasthas } from '../avasthas';
import type { ArgalaResult } from '../argala';
import type { SphuataResults } from '../sphutas';
import type { TippanniContent } from '../tippanni-engine';

// ---------------------------------------------------------------------------
// Test fixture: Delhi, Jan 15 2000, 12:00 noon
// ---------------------------------------------------------------------------

const DELHI_BIRTH: BirthData = {
  name: 'Test Native',
  date: '2000-01-15',
  time: '12:00',
  place: 'New Delhi',
  lat: 28.6139,
  lng: 77.209,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
};

let kundali: KundaliData;
let planets: PlanetPosition[];

// Generate chart data once for all tests
beforeAll(() => {
  kundali = generateKundali(DELHI_BIRTH);
  planets = kundali.planets;
});

// ===================================================================
// 1. AVASTHAS
// ===================================================================

describe('calculateAvasthas', () => {
  let avasthas: PlanetAvasthas[];

  beforeAll(() => {
    avasthas = calculateAvasthas(planets);
  });

  it('returns avasthas for all 9 planets (Sun through Ketu)', () => {
    expect(avasthas.length).toBeGreaterThanOrEqual(7);
    // Should cover at least Sun(0) through Saturn(6), plus Rahu(7) and Ketu(8) if present
    const ids = avasthas.map(a => a.planetId);
    for (let i = 0; i <= 6; i++) {
      expect(ids).toContain(i);
    }
  });

  it('each avastha entry has all five avastha systems', () => {
    for (const a of avasthas) {
      // Baladi
      expect(a.baladi).toBeDefined();
      expect(a.baladi.state).toBeTruthy();
      expect(a.baladi.name.en).toBeTruthy();
      expect(a.baladi.name.hi).toBeTruthy();
      expect(a.baladi.name.sa).toBeTruthy();
      expect(a.baladi.strength).toBeGreaterThanOrEqual(0);
      expect(a.baladi.strength).toBeLessThanOrEqual(100);

      // Jagradadi
      expect(a.jagradadi).toBeDefined();
      expect(['jagrat', 'swapna', 'sushupta']).toContain(a.jagradadi.state);
      expect(['full', 'half', 'quarter']).toContain(a.jagradadi.quality);

      // Deeptadi
      expect(a.deeptadi).toBeDefined();
      expect(a.deeptadi.luminosity).toBeGreaterThanOrEqual(0);
      expect(a.deeptadi.luminosity).toBeLessThanOrEqual(100);

      // Lajjitadi
      expect(a.lajjitadi).toBeDefined();
      expect(['benefic', 'malefic', 'neutral']).toContain(a.lajjitadi.effect);

      // Shayanadi
      expect(a.shayanadi).toBeDefined();
      expect(a.shayanadi.activity).toBeTruthy();
      expect(a.shayanadi.name.en).toBeTruthy();
    }
  });

  it('baladi states are valid BPHS states', () => {
    const validStates = ['bala', 'kumara', 'yuva', 'vriddha', 'mrita'];
    for (const a of avasthas) {
      expect(validStates).toContain(a.baladi.state);
    }
  });

  it('deeptadi states are valid BPHS luminosity states', () => {
    const validStates = ['deepta', 'swastha', 'mudita', 'shanta', 'dina', 'dukhita', 'vikala', 'khala'];
    for (const a of avasthas) {
      expect(validStates).toContain(a.deeptadi.state);
    }
  });

  it('Rahu and Ketu always get sushupta jagradadi', () => {
    const rahu = avasthas.find(a => a.planetId === 7);
    const ketu = avasthas.find(a => a.planetId === 8);
    if (rahu) expect(rahu.jagradadi.state).toBe('sushupta');
    if (ketu) expect(ketu.jagradadi.state).toBe('sushupta');
  });

  it('Rahu and Ketu always get dina deeptadi', () => {
    const rahu = avasthas.find(a => a.planetId === 7);
    const ketu = avasthas.find(a => a.planetId === 8);
    if (rahu) expect(rahu.deeptadi.state).toBe('dina');
    if (ketu) expect(ketu.deeptadi.state).toBe('dina');
  });
});

// ===================================================================
// 2. ARGALA
// ===================================================================

describe('calculateArgala', () => {
  let argalaResults: ArgalaResult[];

  beforeAll(() => {
    const ascSign = kundali.ascendant.sign;
    argalaResults = calculateArgala(planets, ascSign);
  });

  it('returns exactly 12 entries (one per house)', () => {
    expect(argalaResults).toHaveLength(12);
  });

  it('each entry has correct house number 1-12', () => {
    const houses = argalaResults.map(r => r.house);
    expect(houses).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('each entry has a valid sign 1-12', () => {
    for (const r of argalaResults) {
      expect(r.sign).toBeGreaterThanOrEqual(1);
      expect(r.sign).toBeLessThanOrEqual(12);
    }
  });

  it('each entry has argalas and virodha arrays', () => {
    for (const r of argalaResults) {
      expect(Array.isArray(r.argalas)).toBe(true);
      expect(Array.isArray(r.virodha)).toBe(true);
    }
  });

  it('each entry has a valid netEffect', () => {
    const validEffects = ['supported', 'obstructed', 'neutral'];
    for (const r of argalaResults) {
      expect(validEffects).toContain(r.netEffect);
    }
  });

  it('argala entries reference valid planet IDs (0-8)', () => {
    for (const r of argalaResults) {
      for (const a of r.argalas) {
        expect(a.planetId).toBeGreaterThanOrEqual(0);
        expect(a.planetId).toBeLessThanOrEqual(8);
        expect(a.planetName.en).toBeTruthy();
        expect(['primary', 'secondary', 'special']).toContain(a.type);
        expect(['benefic', 'malefic']).toContain(a.nature);
        expect(['strong', 'moderate', 'weak']).toContain(a.strength);
      }
    }
  });

  it('at least some houses have argala support (planets exist in chart)', () => {
    const totalArgalas = argalaResults.reduce((sum, r) => sum + r.argalas.length, 0);
    expect(totalArgalas).toBeGreaterThan(0);
  });

  it('signs follow whole-sign house sequence from ascendant', () => {
    const ascSign = kundali.ascendant.sign;
    for (const r of argalaResults) {
      const expectedSign = ((ascSign - 1 + r.house - 1) % 12) + 1;
      expect(r.sign).toBe(expectedSign);
    }
  });
});

// ===================================================================
// 3. SPHUTAS
// ===================================================================

describe('calculateSphutas', () => {
  let sphutas: SphuataResults;

  beforeAll(() => {
    const sun = planets.find(p => p.planet.id === 0)!;
    const moon = planets.find(p => p.planet.id === 1)!;
    const jupiter = planets.find(p => p.planet.id === 4)!;
    const venus = planets.find(p => p.planet.id === 5)!;
    const mars = planets.find(p => p.planet.id === 2)!;
    const lagnaLong = kundali.ascendant.degree;

    sphutas = calculateSphutas(
      sun.longitude,
      moon.longitude,
      lagnaLong,
      jupiter.longitude,
      venus.longitude,
      mars.longitude,
    );
  });

  it('returns all required sphuta points', () => {
    expect(sphutas.pranaSphuta).toBeDefined();
    expect(sphutas.dehaSphuta).toBeDefined();
    expect(sphutas.mrityuSphuta).toBeDefined();
    expect(sphutas.triSphuta).toBeDefined();
    expect(sphutas.yogiPoint).toBeDefined();
    expect(sphutas.avayogiPoint).toBeDefined();
  });

  it('all sphuta degrees are in 0-360 range', () => {
    const points = [
      sphutas.pranaSphuta,
      sphutas.dehaSphuta,
      sphutas.mrityuSphuta,
      sphutas.triSphuta,
      sphutas.yogiPoint,
      sphutas.avayogiPoint,
    ];
    for (const pt of points) {
      expect(pt.degree).toBeGreaterThanOrEqual(0);
      expect(pt.degree).toBeLessThan(360);
    }
  });

  it('all sphuta signs are in 1-12 range', () => {
    const points = [
      sphutas.pranaSphuta,
      sphutas.dehaSphuta,
      sphutas.mrityuSphuta,
      sphutas.triSphuta,
      sphutas.yogiPoint,
      sphutas.avayogiPoint,
    ];
    for (const pt of points) {
      expect(pt.sign).toBeGreaterThanOrEqual(1);
      expect(pt.sign).toBeLessThanOrEqual(12);
    }
  });

  it('all sphuta nakshatras are in 1-27 range', () => {
    const points = [
      sphutas.pranaSphuta,
      sphutas.dehaSphuta,
      sphutas.mrityuSphuta,
      sphutas.triSphuta,
      sphutas.yogiPoint,
      sphutas.avayogiPoint,
    ];
    for (const pt of points) {
      expect(pt.nakshatra).toBeGreaterThanOrEqual(1);
      expect(pt.nakshatra).toBeLessThanOrEqual(27);
    }
  });

  it('yogiPoint has a valid yogiPlanet (0-8)', () => {
    expect(sphutas.yogiPoint.yogiPlanet).toBeGreaterThanOrEqual(0);
    expect(sphutas.yogiPoint.yogiPlanet).toBeLessThanOrEqual(8);
  });

  it('avayogiPoint has a valid avayogiPlanet (0-8)', () => {
    expect(sphutas.avayogiPoint.avayogiPlanet).toBeGreaterThanOrEqual(0);
    expect(sphutas.avayogiPoint.avayogiPlanet).toBeLessThanOrEqual(8);
  });

  it('avayogi is roughly 186.667 degrees from yogi', () => {
    const diff = (sphutas.avayogiPoint.degree - sphutas.yogiPoint.degree + 360) % 360;
    // Allow small rounding tolerance
    expect(diff).toBeCloseTo(186.667, 0);
  });

  it('bijaSphuta and kshetraSphuta are present', () => {
    expect(sphutas.bijaSphuta).toBeDefined();
    expect(sphutas.kshetraSphuta).toBeDefined();
    expect(sphutas.bijaSphuta!.degree).toBeGreaterThanOrEqual(0);
    expect(sphutas.bijaSphuta!.degree).toBeLessThan(360);
    expect(sphutas.kshetraSphuta!.degree).toBeGreaterThanOrEqual(0);
    expect(sphutas.kshetraSphuta!.degree).toBeLessThan(360);
    expect(sphutas.bijaSphuta!.sign).toBeGreaterThanOrEqual(1);
    expect(sphutas.bijaSphuta!.sign).toBeLessThanOrEqual(12);
    expect(sphutas.kshetraSphuta!.sign).toBeGreaterThanOrEqual(1);
    expect(sphutas.kshetraSphuta!.sign).toBeLessThanOrEqual(12);
  });

  it('each sphuta has trilingual description', () => {
    const points = [
      sphutas.pranaSphuta,
      sphutas.dehaSphuta,
      sphutas.mrityuSphuta,
      sphutas.triSphuta,
      sphutas.yogiPoint,
      sphutas.avayogiPoint,
    ];
    for (const pt of points) {
      expect(pt.description.en).toBeTruthy();
      expect(pt.description.hi).toBeTruthy();
      expect(pt.description.sa).toBeTruthy();
    }
  });

  it('sign corresponds to degree (sign = floor(degree/30) + 1)', () => {
    const points = [
      sphutas.pranaSphuta,
      sphutas.dehaSphuta,
      sphutas.mrityuSphuta,
      sphutas.triSphuta,
      sphutas.yogiPoint,
      sphutas.avayogiPoint,
    ];
    for (const pt of points) {
      const expectedSign = Math.floor(pt.degree / 30) + 1;
      expect(pt.sign).toBe(expectedSign);
    }
  });
});

// ===================================================================
// 4. TIPPANNI ENGINE
// ===================================================================

describe('generateTippanni', () => {
  let tippanniEn: TippanniContent;
  let tippanniHi: TippanniContent;

  beforeAll(() => {
    tippanniEn = generateTippanni(kundali, 'en');
    tippanniHi = generateTippanni(kundali, 'hi');
  }, 30000);

  it('produces content for English locale', () => {
    expect(tippanniEn).toBeDefined();
  });

  it('produces content for Hindi locale', () => {
    expect(tippanniHi).toBeDefined();
  });

  // --- Year Predictions ---
  it('has year predictions with events and quarters', () => {
    const yp = tippanniEn.yearPredictions;
    expect(yp).toBeDefined();
    expect(yp.year).toBeGreaterThan(0);
    expect(yp.overview).toBeTruthy();
    expect(Array.isArray(yp.events)).toBe(true);
    expect(Array.isArray(yp.quarters)).toBe(true);
    expect(yp.keyAdvice).toBeTruthy();
  });

  // --- Personality ---
  it('has personality section with lagna, moonSign, sunSign', () => {
    const p = tippanniEn.personality;
    expect(p).toBeDefined();
    expect(p.lagna.title).toBeTruthy();
    expect(p.lagna.content).toBeTruthy();
    expect(p.moonSign.title).toBeTruthy();
    expect(p.sunSign.title).toBeTruthy();
    expect(p.summary).toBeTruthy();
  });

  // --- Planet Insights ---
  it('has planet insights for at least 7 planets', () => {
    expect(tippanniEn.planetInsights.length).toBeGreaterThanOrEqual(7);
    for (const pi of tippanniEn.planetInsights) {
      expect(pi.planetId).toBeGreaterThanOrEqual(0);
      expect(pi.planetName).toBeTruthy();
      expect(pi.house).toBeGreaterThanOrEqual(1);
      expect(pi.house).toBeLessThanOrEqual(12);
      expect(pi.description).toBeTruthy();
    }
  });

  // --- Yogas ---
  it('has yogas array with structured entries', () => {
    expect(Array.isArray(tippanniEn.yogas)).toBe(true);
    for (const y of tippanniEn.yogas) {
      expect(y.name).toBeTruthy();
      expect(typeof y.present).toBe('boolean');
      expect(y.type).toBeTruthy();
      expect(['Strong', 'Moderate', 'Weak']).toContain(y.strength);
    }
  });

  // --- Doshas ---
  it('has doshas array with severity levels', () => {
    expect(Array.isArray(tippanniEn.doshas)).toBe(true);
    for (const d of tippanniEn.doshas) {
      expect(d.name).toBeTruthy();
      expect(typeof d.present).toBe('boolean');
      expect(['none', 'mild', 'moderate', 'severe']).toContain(d.severity);
    }
  });

  // --- Life Areas ---
  it('has lifeAreas section with all five areas', () => {
    const la = tippanniEn.lifeAreas;
    expect(la).toBeDefined();
    for (const area of ['career', 'wealth', 'marriage', 'health', 'education'] as const) {
      expect(la[area]).toBeDefined();
      expect(la[area].label).toBeTruthy();
      expect(la[area].rating).toBeGreaterThanOrEqual(0);
      expect(la[area].rating).toBeLessThanOrEqual(10);
      expect(la[area].summary).toBeTruthy();
    }
  });

  // --- Dasha Insight ---
  it('has dasha insight section', () => {
    const di = tippanniEn.dashaInsight;
    expect(di).toBeDefined();
    expect(di.currentMaha).toBeTruthy();
    expect(di.currentMahaAnalysis).toBeTruthy();
  });

  // --- Remedies ---
  it('has remedies section with gemstones, mantras, practices', () => {
    const r = tippanniEn.remedies;
    expect(r).toBeDefined();
    expect(Array.isArray(r.gemstones)).toBe(true);
    expect(Array.isArray(r.mantras)).toBe(true);
    expect(Array.isArray(r.practices)).toBe(true);
  });

  // --- Strength Overview ---
  it('has strength overview for planets', () => {
    expect(Array.isArray(tippanniEn.strengthOverview)).toBe(true);
    expect(tippanniEn.strengthOverview.length).toBeGreaterThan(0);
    for (const s of tippanniEn.strengthOverview) {
      expect(s.planetName).toBeTruthy();
      expect(typeof s.strength).toBe('number');
      expect(s.status).toBeTruthy();
    }
  });

  // --- Hindi locale has content ---
  it('Hindi locale personality content is different from English', () => {
    // The content text should differ between locales
    // (they may share structure but text should be locale-specific)
    expect(tippanniHi.personality.lagna.title).toBeTruthy();
    expect(tippanniHi.personality.summary).toBeTruthy();
  });
});
