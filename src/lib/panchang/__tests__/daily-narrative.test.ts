/**
 * Tests for the Daily Cosmic Briefing engine — both Enthusiast (default)
 * and Acharya (PR-3) registers.
 *
 * The engine is a pure function. We feed it a hand-built PanchangData
 * fixture covering the fields it reads and assert the rendered
 * narrative contains the expected tokens. Snapshots intentionally
 * avoided — the wording will change as we tune copy.
 */

import { describe, expect, it } from 'vitest';
import { generateDailyNarrative } from '../daily-narrative';
import type { PanchangData } from '@/types/panchang';

/**
 * Minimal PanchangData fixture. Most fields aren't read by the
 * narrative engine; we only populate what it touches.
 */
function makeFixture(overrides: Partial<PanchangData> = {}): PanchangData {
  // Use `as PanchangData` because we deliberately omit fields the
  // engine doesn't read. The engine never accesses `planets`, `masa`,
  // etc., so leaving them undefined is safe for these tests.
  return {
    date: '2026-06-03',
    location: { lat: 23.18, lng: 75.79, name: 'Ujjain' },
    tithi: {
      id: 3,
      name: { en: 'Tritiya', hi: 'तृतीया', sa: 'तृतीया' },
      number: 3,
      paksha: 'shukla',
      deity: { en: 'Gauri', hi: 'गौरी', sa: 'गौरी' },
      auspicious: true,
    },
    nakshatra: {
      id: 20,
      name: { en: 'Purvashadha', hi: 'पूर्वाषाढ़ा', sa: 'पूर्वाषाढा' },
      lord: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
      symbol: 'Fan',
      deity: { en: 'Apas', hi: 'आप', sa: 'आपः' },
      pada: 1,
      gana: 'manushya',
    },
    yoga: {
      id: 11,
      name: { en: 'Shukla', hi: 'शुक्ल', sa: 'शुक्ल' },
      meaning: { en: 'Bright', hi: 'उज्ज्वल', sa: 'शुक्लः' },
      nature: 'auspicious',
    },
    karana: {
      id: 4,
      name: { en: 'Taitila', hi: 'तैतिल', sa: 'तैतिलम्' },
      auspicious: true,
    },
    vara: {
      day: 3,
      name: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' },
      ruler: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
    },
    sunrise: '05:34',
    sunset: '19:08',
    moonrise: '08:12',
    moonset: '22:18',
    rahuKaal: { start: '13:31', end: '15:29' },
    yamaganda: { start: '09:33', end: '11:31' },
    gulikaKaal: { start: '11:32', end: '13:30' },
    muhurtas: [],
    abhijitMuhurta: { start: '13:00', end: '14:03', available: false }, // Wed → unavailable
    planets: [],
    masa: { en: 'Jyeshtha', hi: 'ज्येष्ठ', sa: 'ज्येष्ठः' },
    samvatsara: { en: 'Krodhi', hi: 'क्रोधी', sa: 'क्रोधी' },
    ritu: { en: 'Grishma', hi: 'ग्रीष्म', sa: 'ग्रीष्मः' },
    ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायणम्' },
    varjyam: { start: '05:21', end: '07:09' },
    ...overrides,
  } as unknown as PanchangData;
}

describe('generateDailyNarrative — Enthusiast (default) register', () => {
  it('produces a multi-sentence narrative', () => {
    const out = generateDailyNarrative(makeFixture(), 'en');
    expect(out.narrative.length).toBeGreaterThan(50);
    // Narrative-style framing.
    expect(out.narrative).toContain('Moon transits');
  });

  it("warns about Wednesday Abhijit exclusion in s3", () => {
    const out = generateDailyNarrative(makeFixture(), 'en');
    expect(out.narrative).toMatch(/does not apply today.*Wednesday/i);
  });

  it('skips the Abhijit recommendation in doList on Wednesday', () => {
    const out = generateDailyNarrative(makeFixture(), 'en');
    expect(out.doList.join(' ')).not.toContain('Abhijit');
  });

  it('renders Hindi version when locale is hi', () => {
    const out = generateDailyNarrative(makeFixture(), 'hi');
    expect(out.narrative).toContain('चन्द्रमा');
    expect(out.narrative).toContain('तृतीया');
  });
});

describe('generateDailyNarrative — Acharya register (PR-3)', () => {
  it('uses terse classical structure (Tithi: / Nakshatra: / Yoga:)', () => {
    const out = generateDailyNarrative(makeFixture(), 'en', 'acharya');
    expect(out.narrative).toContain('Tithi:');
    expect(out.narrative).toContain('Nakshatra:');
    expect(out.narrative).toContain('Yoga:');
    expect(out.narrative).toContain('Karana:');
  });

  it('drops narrative-framing tokens from the Enthusiast version', () => {
    const out = generateDailyNarrative(makeFixture(), 'en', 'acharya');
    // Friendly framing words that Acharya MUST NOT use.
    expect(out.narrative).not.toMatch(/transits through.*today/);
    expect(out.narrative).not.toMatch(/amplifies positive energy/);
    expect(out.narrative).not.toMatch(/favourable day/);
    expect(out.narrative).not.toMatch(/'s influence/);
  });

  it('cites Wednesday Abhijit exclusion terselsy', () => {
    const out = generateDailyNarrative(makeFixture(), 'en', 'acharya');
    expect(out.narrative).toMatch(/Wednesday exclusion/);
  });

  it('lists classical exclusions in dontList (Rahu Kaal, Wed exclusion, Varjyam)', () => {
    const out = generateDailyNarrative(makeFixture(), 'en', 'acharya');
    const dontJoined = out.dontList.join(' | ');
    expect(dontJoined).toContain('Rahu Kaal');
    expect(dontJoined).toMatch(/Wednesday exclusion|Muhurta Chintamani/);
  });

  it('renders Hindi Acharya register with classical vocabulary', () => {
    const out = generateDailyNarrative(makeFixture(), 'hi', 'acharya');
    expect(out.narrative).toContain('तिथि:');
    expect(out.narrative).toContain('नक्षत्र:');
    expect(out.narrative).toContain('योग:');
    expect(out.narrative).toContain('अपवर्जित');
  });

  it('handles Vishti karana exclusion', () => {
    const out = generateDailyNarrative(
      makeFixture({
        karana: {
          id: 8,
          name: { en: 'Vishti', hi: 'विष्टि', sa: 'विष्टि' },
          auspicious: false,
        },
      } as Partial<PanchangData>),
      'en',
      'acharya',
    );
    expect(out.narrative).toContain('Vishti karana');
    expect(out.dontList.join(' | ')).toContain('Vishti');
  });

  it('handles Abhijit being available (non-Wednesday)', () => {
    const out = generateDailyNarrative(
      makeFixture({
        vara: {
          day: 5,
          name: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' },
          ruler: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
        },
        abhijitMuhurta: { start: '12:00', end: '13:00', available: true },
      } as Partial<PanchangData>),
      'en',
      'acharya',
    );
    expect(out.narrative).toContain('Abhijit 12:00–13:00');
    expect(out.narrative).not.toContain('Wednesday exclusion');
    // Acharya should list Abhijit as a do
    expect(out.doList.join(' | ')).toContain('Abhijit Muhurta 12:00');
  });
});

describe('Enthusiast vs Acharya — actually different', () => {
  it('produces materially different narratives for the same panchang', () => {
    const ent = generateDailyNarrative(makeFixture(), 'en', 'enthusiast');
    const ach = generateDailyNarrative(makeFixture(), 'en', 'acharya');
    expect(ach.narrative).not.toBe(ent.narrative);
    // Acharya should be shorter (terse register)
    expect(ach.narrative.length).toBeLessThan(ent.narrative.length);
  });

  it('beginner mode currently equals enthusiast (per v1 truth table)', () => {
    const ent = generateDailyNarrative(makeFixture(), 'en', 'enthusiast');
    const beg = generateDailyNarrative(makeFixture(), 'en', 'beginner');
    expect(beg.narrative).toBe(ent.narrative);
    expect(beg.doList).toEqual(ent.doList);
    expect(beg.dontList).toEqual(ent.dontList);
  });
});
