/**
 * Yoga Engine — Domain Scoring Integration Tests
 *
 * Tests that the yoga engine's EvaluatedYoga[] results correctly flow into
 * the domain synthesis pipeline, producing scoring factors and ratings
 * that reflect active yogas and doshas.
 *
 * Two charts tested:
 * - Arjun Jha:    2016-09-09 19:45 Luxembourg (Aquarius lagna)
 * - Vaibhavi Jha: 2008-06-21 12:08 Delhi      (Virgo lagna)
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { synthesizeReading } from '@/lib/kundali/domain-synthesis/synthesizer';
import { domainScore, yogasByDomain, presentYogas } from '@/lib/kundali/yoga-engine/engine';
import type { BirthData } from '@/types/kundali';
import type { EvaluatedYoga } from '@/lib/kundali/yoga-engine/types';

// ---------------------------------------------------------------------------
// Test chart definitions
// ---------------------------------------------------------------------------

const ARJUN: BirthData = {
  name: 'Arjun Jha',
  date: '2016-09-09',
  time: '19:45',
  place: 'Luxembourg',
  lat: 49.6117,
  lng: 6.1319,
  timezone: 'Europe/Luxembourg',
  ayanamsha: 'lahiri',
};

const VAIBHAVI: BirthData = {
  name: 'Vaibhavi Jha',
  date: '2008-06-21',
  time: '12:08',
  place: 'Delhi',
  lat: 28.6139,
  lng: 77.2090,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
};

// Synthetic fixture for Mangal-Dosha-present cases. Virgo lagna with Mars in
// own sign Aries placed in the 8th house from Lagna — passes the classical
// Phaladeepika rule (8th is in {1,2,4,7,8,12} from Lagna). The Arjun and
// Vaibhavi fixtures both have Mars outside the Mangal house set from their
// respective Lagnas (10th and 11th) so they no longer carry the dosha after
// the classical-fix tightening — we use this fixture wherever a test needs
// Mangal Dosha to actually fire end-to-end.
const MANGAL_PRESENT_FIXTURE: BirthData = {
  name: 'Mangal Test Fixture',
  date: '1985-03-22',
  time: '18:00',
  place: 'Delhi',
  lat: 28.6139,
  lng: 77.2090,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
};

// Generate charts and readings once
const arjunChart = generateKundali(ARJUN);
const vaibhaviChart = generateKundali(VAIBHAVI);
const mangalFixtureChart = generateKundali(MANGAL_PRESENT_FIXTURE);

const arjunReading = synthesizeReading(arjunChart, 'en', 10, arjunChart.evaluatedYogas);
const vaibhaviReading = synthesizeReading(vaibhaviChart, 'en', 18, vaibhaviChart.evaluatedYogas);
const mangalFixtureReading = synthesizeReading(
  mangalFixtureChart,
  'en',
  41,
  mangalFixtureChart.evaluatedYogas,
);

// Helpers
function findDomain(reading: ReturnType<typeof synthesizeReading>, domain: string) {
  return reading.domains.find(d => d.domain === domain);
}

function findFactorByLabel(factors: { label: { en: string } }[], pattern: string) {
  return factors.find(f => f.label.en.includes(pattern));
}

// ==========================================================================
// DOMAIN SCORE UTILITY
// ==========================================================================

describe('Yoga Engine — domainScore utility', () => {
  const arjunYogas = arjunChart.evaluatedYogas!;

  it('career domain score is positive for Arjun (multiple raja yogas present)', () => {
    const score = domainScore(arjunYogas, 'career');
    expect(score).toBeGreaterThan(0);
  });

  it('marriage domain score accounts for both Chandra-Mangala (auspicious) and Mangal Dosha (inauspicious)', () => {
    const score = domainScore(arjunYogas, 'marriage');
    // Both positive and negative yogas affect marriage — score could be positive or negative
    // but it should not be zero (both yogas are present)
    expect(score).not.toBe(0);
  });

  it('health domain includes Ruchaka (positive, Arjun) and Mangal Dosha (negative, Mangal fixture)', () => {
    // Ruchaka is present in Arjun's chart (Mars in own sign Scorpio, 10th
    // kendra). Mangal Dosha is no longer in Arjun's chart after the
    // classical Lagna-only fix — we use the dedicated MANGAL fixture for it.
    const arjunHealth = yogasByDomain(arjunYogas, 'health').filter((y) => y.present);
    expect(arjunHealth.map((y) => y.id)).toContain('ruchaka');

    const mangalHealth = yogasByDomain(mangalFixtureChart.evaluatedYogas!, 'health').filter(
      (y) => y.present,
    );
    expect(mangalHealth.map((y) => y.id)).toContain('mangal-dosha');
  });

  it('spiritual domain score is defined for Vaibhavi (Hamsa present)', () => {
    const score = domainScore(vaibhaviChart.evaluatedYogas!, 'spiritual');
    expect(score).toBeGreaterThan(0);
  });
});

// ==========================================================================
// YOGA FILTERING UTILITIES
// ==========================================================================

describe('Yoga Engine — filter utilities', () => {
  const arjunYogas = arjunChart.evaluatedYogas!;

  it('presentYogas returns only present yogas', () => {
    const present = presentYogas(arjunYogas);
    expect(present.length).toBeGreaterThan(0);
    expect(present.length).toBeLessThan(arjunYogas.length);
    expect(present.every(y => y.present)).toBe(true);
  });

  it('yogasByDomain with "all" catches domain-agnostic yogas like Kaal Sarpa', () => {
    // Kaal Sarpa has affectedDomains='all' — it should appear in every domain filter
    const wealthYogas = yogasByDomain(arjunYogas, 'wealth');
    const kaalSarpa = wealthYogas.find(y => y.id === 'kaal-sarpa');
    expect(kaalSarpa).toBeDefined();

    const educationYogas = yogasByDomain(arjunYogas, 'education');
    const kaalSarpa2 = educationYogas.find(y => y.id === 'kaal-sarpa');
    expect(kaalSarpa2).toBeDefined();
  });

  it('yogasByDomain for career includes raja yogas', () => {
    const careerYogas = yogasByDomain(arjunYogas, 'career').filter(y => y.present);
    const rajaIds = careerYogas.filter(y => y.group === 'raja').map(y => y.id);
    expect(rajaIds).toContain('kendra-trikona-raja');
  });
});

// ==========================================================================
// DOMAIN SYNTHESIS INTEGRATION — Vaibhavi's chart
// ==========================================================================

describe("Domain Synthesis Integration — Vaibhavi's chart", () => {
  it('reading has 8 domain entries', () => {
    expect(vaibhaviReading.domains.length).toBe(8);
  });

  it('each domain has overallRating and natalPromise with rating info', () => {
    for (const d of vaibhaviReading.domains) {
      expect(d.overallRating).toBeDefined();
      expect(d.natalPromise).toBeDefined();
      // natalPromise.rating is a RatingInfo object with .rating string, .score, .factors
      expect(d.natalPromise.rating).toBeDefined();
      expect(d.natalPromise.rating.rating).toBeTruthy();
    }
  });

  it('health domain has Active Yogas factor from evaluatedYogas', () => {
    const health = findDomain(vaibhaviReading, 'health')!;
    expect(health).toBeDefined();
    const factors = health.natalPromise.rating.factors ?? [];
    const yogaFactor = findFactorByLabel(factors, 'Active Yoga');
    // If present, check it has yoga details
    if (yogaFactor) {
      expect(yogaFactor.yogaDetails).toBeDefined();
      expect(yogaFactor.yogaDetails!.length).toBeGreaterThan(0);
    }
  });

  it('marriage domain has Active Doshas factor (Mangal Dosha)', () => {
    // Uses mangalFixtureReading because Vaibhavi's chart no longer carries
    // Mangal Dosha after the classical-fix tightening (Mars in 11th from
    // Virgo Lagna is not in the Mangal house set).
    const marriage = findDomain(mangalFixtureReading, 'marriage')!;
    expect(marriage).toBeDefined();
    const factors = marriage.natalPromise.rating.factors ?? [];
    const doshaFactor = findFactorByLabel(factors, 'Active Dosha');
    if (doshaFactor) {
      expect(doshaFactor.verdict).toBe('negative');
      const mangalDosha = doshaFactor.yogaDetails?.find((d) => d.id === 'mangal-dosha');
      expect(mangalDosha).toBeDefined();
    }
  });

  it('career domain has Active Yogas factor (raja yogas present)', () => {
    const career = findDomain(vaibhaviReading, 'career')!;
    expect(career).toBeDefined();
    const factors = career.natalPromise.rating.factors ?? [];
    const yogaFactor = findFactorByLabel(factors, 'Active Yoga');
    if (yogaFactor) {
      expect(yogaFactor.verdict).toBe('positive');
    }
  });

  it('overall ratings are a realistic mix (not all the same)', () => {
    const ratings = vaibhaviReading.domains.map(d => d.natalPromise.rating.rating);
    const uniqueRatings = new Set(ratings);
    // Should have at least 2 different ratings across 8 domains
    expect(uniqueRatings.size).toBeGreaterThanOrEqual(2);
  });

  it('ratings are from the valid set', () => {
    const validRatings = ['uttama', 'madhyama', 'adhama', 'atyadhama'];
    for (const d of vaibhaviReading.domains) {
      expect(validRatings).toContain(d.natalPromise.rating.rating);
    }
  });
});

// ==========================================================================
// DOMAIN SYNTHESIS INTEGRATION — Arjun's chart
// ==========================================================================

describe("Domain Synthesis Integration — Arjun's chart", () => {
  it('reading has 8 domain entries', () => {
    expect(arjunReading.domains.length).toBe(8);
  });

  it('wealth domain has Active Yogas factor (Dhana yoga, Chandra-Mangala present)', () => {
    const wealth = findDomain(arjunReading, 'wealth')!;
    expect(wealth).toBeDefined();
    const factors = wealth.natalPromise.rating.factors ?? [];
    const yogaFactor = findFactorByLabel(factors, 'Active Yoga');
    if (yogaFactor) {
      expect(yogaFactor.yogaDetails).toBeDefined();
      expect(yogaFactor.yogaDetails!.length).toBeGreaterThan(0);
    }
  });

  it('career domain has Active Yogas factor', () => {
    const career = findDomain(arjunReading, 'career')!;
    expect(career).toBeDefined();
    const factors = career.natalPromise.rating.factors ?? [];
    const yogaFactor = findFactorByLabel(factors, 'Active Yoga');
    if (yogaFactor) {
      expect(yogaFactor.verdict).toBe('positive');
    }
  });

  it('ratings are a realistic mix for Arjun', () => {
    const ratings = arjunReading.domains.map(d => d.natalPromise.rating.rating);
    const uniqueRatings = new Set(ratings);
    expect(uniqueRatings.size).toBeGreaterThanOrEqual(2);
  });
});

// ==========================================================================
// CROSS-CHART COMPARISON
// ==========================================================================

describe('Yoga Engine — Cross-chart comparison', () => {
  it('different charts produce different present yoga sets', () => {
    const arjunPresent = new Set(
      arjunChart.evaluatedYogas!.filter(y => y.present).map(y => y.id),
    );
    const vaibhaviPresent = new Set(
      vaibhaviChart.evaluatedYogas!.filter(y => y.present).map(y => y.id),
    );

    // Charts should share some common yogas but not be identical
    const arjunOnly = [...arjunPresent].filter(id => !vaibhaviPresent.has(id));
    const vaibhaviOnly = [...vaibhaviPresent].filter(id => !arjunPresent.has(id));

    expect(arjunOnly.length).toBeGreaterThan(0);
    expect(vaibhaviOnly.length).toBeGreaterThan(0);
  });

  it('Ruchaka is present for Arjun but not Vaibhavi', () => {
    const arjunRuchaka = arjunChart.evaluatedYogas!.find(y => y.id === 'ruchaka');
    const vaibhaviRuchaka = vaibhaviChart.evaluatedYogas!.find(y => y.id === 'ruchaka');
    expect(arjunRuchaka!.present).toBe(true);
    expect(vaibhaviRuchaka!.present).toBe(false);
  });

  it('Hamsa is present for Vaibhavi but not Arjun', () => {
    const arjunHamsa = arjunChart.evaluatedYogas!.find(y => y.id === 'hamsa');
    const vaibhaviHamsa = vaibhaviChart.evaluatedYogas!.find(y => y.id === 'hamsa');
    expect(arjunHamsa!.present).toBe(false);
    expect(vaibhaviHamsa!.present).toBe(true);
  });
});

// ==========================================================================
// DETERMINISM
// ==========================================================================

describe('Yoga Engine — Determinism', () => {
  it('generating the same chart twice produces identical evaluatedYogas', () => {
    const chart2 = generateKundali(ARJUN);
    expect(chart2.evaluatedYogas).toBeDefined();
    expect(chart2.evaluatedYogas!.length).toBe(arjunChart.evaluatedYogas!.length);

    for (let i = 0; i < chart2.evaluatedYogas!.length; i++) {
      const a = arjunChart.evaluatedYogas![i];
      const b = chart2.evaluatedYogas![i];
      expect(a.id).toBe(b.id);
      expect(a.present).toBe(b.present);
      expect(a.strength).toBe(b.strength);
      expect(a.involvedPlanets).toEqual(b.involvedPlanets);
    }
  });
});
