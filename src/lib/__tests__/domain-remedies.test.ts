/**
 * Tests for domain remedy selection logic.
 */

import { describe, it, expect } from 'vitest';
import { selectDomainRemedies } from '@/lib/kundali/domain-synthesis/remedies';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function healthConfig() {
  const cfg = getDomainConfig('health');
  if (!cfg) throw new Error('health config not found');
  return cfg;
}

function wealthConfig() {
  const cfg = getDomainConfig('wealth');
  if (!cfg) throw new Error('wealth config not found');
  return cfg;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('selectDomainRemedies', () => {
  it('returns empty array when weakPlanets is empty', () => {
    const result = selectDomainRemedies({
      domainConfig: healthConfig(),
      weakPlanets: [],
    });
    expect(result).toEqual([]);
  });

  it('returns empty array when no weak planet is relevant to the domain', () => {
    // Mercury (3) is not a primary planet for health (Sun=0, Mars=2, Saturn=6)
    // and isLordOfDomainHouse is false
    const result = selectDomainRemedies({
      domainConfig: healthConfig(),
      weakPlanets: [
        { planetId: 3, isDebilitated: true, isLordOfDomainHouse: false, shadbalaRupa: 0.5 },
      ],
    });
    expect(result).toEqual([]);
  });

  it('returns remedies for a weak planet that is a primary domain planet', () => {
    // Sun (0) is a primary planet for health
    const result = selectDomainRemedies({
      domainConfig: healthConfig(),
      weakPlanets: [
        { planetId: 0, isDebilitated: false, isLordOfDomainHouse: false, shadbalaRupa: 0.8 },
      ],
    });
    expect(result.length).toBeGreaterThan(0);
  });

  it('assigns priority 5 to a debilitated house lord and returns gemstone + mantra', () => {
    // Saturn (6) is a primary planet for health AND is a house lord here
    const result = selectDomainRemedies({
      domainConfig: healthConfig(),
      weakPlanets: [
        { planetId: 6, isDebilitated: true, isLordOfDomainHouse: true, shadbalaRupa: 0.5 },
      ],
    });

    // Should get gemstone + mantra for priority 5
    const types = result.map((r) => r.type);
    expect(types).toContain('gemstone');
    expect(types).toContain('mantra');

    // Gemstone for Saturn should be Blue Sapphire
    const gemstone = result.find((r) => r.type === 'gemstone');
    expect(gemstone?.name.en).toContain('Blue Sapphire');

    // All remedies should target Saturn (planetId 6)
    result.forEach((r) => {
      expect(r.targetPlanetId).toBe(6);
    });
  });

  it('returns at most 6 remedies even with many weak planets', () => {
    // Provide 5 weak planets all relevant to wealth (Jupiter=4, Venus=5, Mercury=3)
    // Plus two more as house lords
    const result = selectDomainRemedies({
      domainConfig: wealthConfig(),
      weakPlanets: [
        { planetId: 4, isDebilitated: true, isLordOfDomainHouse: true, shadbalaRupa: 0.4 },
        { planetId: 5, isDebilitated: true, isLordOfDomainHouse: true, shadbalaRupa: 0.3 },
        { planetId: 3, isDebilitated: false, isLordOfDomainHouse: true, shadbalaRupa: 0.6 },
        { planetId: 0, isDebilitated: true, isLordOfDomainHouse: true, shadbalaRupa: 0.5 },
        { planetId: 1, isDebilitated: false, isLordOfDomainHouse: true, shadbalaRupa: 0.9 },
      ],
    });

    expect(result.length).toBeLessThanOrEqual(6);
  });

  it('every remedy has non-empty en and hi name', () => {
    const result = selectDomainRemedies({
      domainConfig: healthConfig(),
      weakPlanets: [
        { planetId: 0, isDebilitated: true, isLordOfDomainHouse: true, shadbalaRupa: 0.5 },
        { planetId: 2, isDebilitated: false, isLordOfDomainHouse: false, shadbalaRupa: 0.7 },
        { planetId: 6, isDebilitated: true, isLordOfDomainHouse: false, shadbalaRupa: 0.4 },
      ],
    });

    expect(result.length).toBeGreaterThan(0);

    result.forEach((remedy) => {
      expect(remedy.name.en).toBeTruthy();
      expect(remedy.name.hi).toBeTruthy();
      expect(remedy.instructions.en).toBeTruthy();
      expect(remedy.instructions.hi).toBeTruthy();
    });
  });

  it('every remedy has non-empty en and hi instructions', () => {
    // Cover all 9 planets
    const allPlanetIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const result = selectDomainRemedies({
      domainConfig: healthConfig(),
      weakPlanets: allPlanetIds.map((planetId) => ({
        planetId,
        isDebilitated: true,
        isLordOfDomainHouse: true,
        shadbalaRupa: 0.3,
      })),
    });

    result.forEach((remedy) => {
      expect(typeof remedy.instructions.en).toBe('string');
      expect(remedy.instructions.en.length).toBeGreaterThan(0);
      expect(typeof remedy.instructions.hi).toBe('string');
      expect(remedy.instructions.hi.length).toBeGreaterThan(0);
    });
  });

  it('non-house-lord debilitated planet gets mantra and charity (priority 3)', () => {
    // Sun (0) is primary for health but NOT isLordOfDomainHouse, and is debilitated
    const result = selectDomainRemedies({
      domainConfig: healthConfig(),
      weakPlanets: [
        { planetId: 0, isDebilitated: true, isLordOfDomainHouse: false, shadbalaRupa: 1.5 },
      ],
    });

    const types = result.map((r) => r.type);
    expect(types).toContain('mantra');
    expect(types).toContain('charity');
    expect(types).not.toContain('gemstone');
  });

  it('weak shadbala house lord (not debilitated) gets gemstone + mantra (priority 4)', () => {
    // Mars (2) is primary for health, shadbala weak, is house lord, not debilitated
    const result = selectDomainRemedies({
      domainConfig: healthConfig(),
      weakPlanets: [
        { planetId: 2, isDebilitated: false, isLordOfDomainHouse: true, shadbalaRupa: 0.7 },
      ],
    });

    const types = result.map((r) => r.type);
    expect(types).toContain('gemstone');
    expect(types).toContain('mantra');
  });

  it('remedy targetPlanetId matches the planet that was weak', () => {
    const result = selectDomainRemedies({
      domainConfig: healthConfig(),
      weakPlanets: [
        { planetId: 2, isDebilitated: true, isLordOfDomainHouse: true, shadbalaRupa: 0.3 },
      ],
    });

    result.forEach((remedy) => {
      expect(remedy.targetPlanetId).toBe(2);
    });
  });
});
