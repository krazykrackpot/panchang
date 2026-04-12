/**
 * Horoscope Prompt Builder Tests
 */

import { describe, it, expect } from 'vitest';
import { buildTransitDataForSign, buildHoroscopePrompt, buildAllHoroscopePrompts, buildFallbackHoroscope } from '../horoscope-prompt';
import { computePanchang } from '../../ephem/panchang-calc';

const panchang = computePanchang({
  year: 2025, month: 6, day: 15, lat: 28.6139, lng: 77.209, tzOffset: 5.5, locationName: 'Delhi',
});

describe('buildTransitDataForSign', () => {
  const ariesData = buildTransitDataForSign(panchang, 1);

  it('returns sign = 1 for Aries', () => {
    expect(ariesData.sign).toBe(1);
  });

  it('returns signName = Aries', () => {
    expect(ariesData.signName).toBe('Aries');
  });

  it('has 9 transit entries', () => {
    expect(ariesData.transits).toHaveLength(9);
  });

  it('each transit has planet name', () => {
    for (const t of ariesData.transits) {
      expect(t.planet).toBeTruthy();
      expect(typeof t.planet).toBe('string');
    }
  });

  it('each transit has house 1-12', () => {
    for (const t of ariesData.transits) {
      expect(t.houseFromSign).toBeGreaterThanOrEqual(1);
      expect(t.houseFromSign).toBeLessThanOrEqual(12);
    }
  });

  it('has tithi', () => {
    expect(ariesData.tithi.length).toBeGreaterThan(0);
  });

  it('has nakshatra', () => {
    expect(ariesData.nakshatra.length).toBeGreaterThan(0);
  });

  it('has yoga', () => {
    expect(ariesData.yoga.length).toBeGreaterThan(0);
  });
});

describe('buildAllHoroscopePrompts', () => {
  const allPrompts = buildAllHoroscopePrompts(panchang);

  it('generates 12 prompts', () => {
    expect(allPrompts).toHaveLength(12);
  });

  it('sign 1 = Aries', () => {
    expect(allPrompts[0].signName).toBe('Aries');
  });

  it('sign 12 = Pisces', () => {
    expect(allPrompts[11].signName).toBe('Pisces');
  });

  it('all signs unique', () => {
    const uniqueSigns = new Set(allPrompts.map(p => p.sign));
    expect(uniqueSigns.size).toBe(12);
  });

  it('Moon has valid houses for all signs', () => {
    const moonHouses = allPrompts.map(p => p.transits.find(t => t.planet === 'Moon')?.houseFromSign || 0);
    for (const h of moonHouses) {
      expect(h).toBeGreaterThanOrEqual(1);
      expect(h).toBeLessThanOrEqual(12);
    }
  });
});

describe('buildHoroscopePrompt', () => {
  const ariesData = buildTransitDataForSign(panchang, 1);
  const promptText = buildHoroscopePrompt(ariesData);

  it('mentions Aries', () => {
    expect(promptText).toContain('Aries');
  });

  it('mentions transit data (house)', () => {
    expect(promptText).toContain('house');
  });

  it('mentions tithi', () => {
    expect(promptText).toContain('Tithi');
  });

  it('has instructions', () => {
    expect(promptText).toContain('Generate a');
  });

  it('asks for 120-150 words', () => {
    expect(promptText).toContain('120-150 word');
  });
});

describe('buildFallbackHoroscope', () => {
  const ariesData = buildTransitDataForSign(panchang, 1);

  it('English fallback is non-empty and mentions Moon', () => {
    const fallbackEn = buildFallbackHoroscope(ariesData, 'en');
    expect(fallbackEn.length).toBeGreaterThan(20);
    expect(fallbackEn).toContain('Moon');
  });

  it('Hindi fallback has Devanagari', () => {
    const fallbackHi = buildFallbackHoroscope(ariesData, 'hi');
    expect(fallbackHi).toMatch(/[\u0900-\u097F]/);
  });
});

describe('Pisces edge case', () => {
  it('Pisces (sign 12) house calculations are valid', () => {
    const piscesData = buildTransitDataForSign(panchang, 12);
    for (const t of piscesData.transits) {
      expect(t.houseFromSign).toBeGreaterThanOrEqual(1);
      expect(t.houseFromSign).toBeLessThanOrEqual(12);
    }
  });
});
