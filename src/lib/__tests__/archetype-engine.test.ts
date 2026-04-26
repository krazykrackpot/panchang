import { describe, it, expect } from 'vitest';
import { generateCosmicBlueprint, type CosmicBlueprint } from '../kundali/archetype-engine';
import type { ShadBalaComplete } from '../kundali/shadbala';

// Mock minimal ShadBala data — Mercury strongest, Venus weakest
const mockShadbala: ShadBalaComplete[] = [
  { planetId: 0, planet: 'Sun', strengthRatio: 1.2, rupas: 390, totalPinda: 390, minRequired: 390, rank: 3, sthanaBala: 100, digBala: 60, kalaBala: 100, cheshtaBala: 60, naisargikaBala: 60, drikBala: 10, ishtaPhala: 30, kashtaPhala: 20, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 1, planet: 'Moon', strengthRatio: 1.0, rupas: 360, totalPinda: 360, minRequired: 360, rank: 5, sthanaBala: 90, digBala: 50, kalaBala: 90, cheshtaBala: 60, naisargikaBala: 50, drikBala: 20, ishtaPhala: 25, kashtaPhala: 25, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 2, planet: 'Mars', strengthRatio: 1.1, rupas: 300, totalPinda: 300, minRequired: 300, rank: 4, sthanaBala: 80, digBala: 40, kalaBala: 80, cheshtaBala: 50, naisargikaBala: 40, drikBala: 10, ishtaPhala: 20, kashtaPhala: 20, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 3, planet: 'Mercury', strengthRatio: 1.8, rupas: 540, totalPinda: 540, minRequired: 300, rank: 1, sthanaBala: 130, digBala: 70, kalaBala: 130, cheshtaBala: 80, naisargikaBala: 70, drikBala: 60, ishtaPhala: 40, kashtaPhala: 10, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 4, planet: 'Jupiter', strengthRatio: 1.3, rupas: 520, totalPinda: 520, minRequired: 390, rank: 2, sthanaBala: 120, digBala: 65, kalaBala: 120, cheshtaBala: 80, naisargikaBala: 75, drikBala: 60, ishtaPhala: 35, kashtaPhala: 15, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 5, planet: 'Venus', strengthRatio: 0.6, rupas: 210, totalPinda: 210, minRequired: 330, rank: 7, sthanaBala: 50, digBala: 30, kalaBala: 50, cheshtaBala: 30, naisargikaBala: 40, drikBala: 10, ishtaPhala: 10, kashtaPhala: 30, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 6, planet: 'Saturn', strengthRatio: 0.9, rupas: 270, totalPinda: 270, minRequired: 300, rank: 6, sthanaBala: 70, digBala: 30, kalaBala: 70, cheshtaBala: 50, naisargikaBala: 30, drikBala: 20, ishtaPhala: 15, kashtaPhala: 25, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
];

// Mock dashas — Jupiter current, Saturn next
const mockDashas = [
  { planet: 'Jupiter', startDate: new Date('2019-06-15'), endDate: new Date('2035-06-15'), years: 16, subPeriods: [] },
  { planet: 'Saturn', startDate: new Date('2035-06-15'), endDate: new Date('2054-06-15'), years: 19, subPeriods: [] },
];

// Mock yogas
const mockYogas = [
  { id: 'gajakesari', name: { en: 'Gajakesari' }, present: true, strength: 'Strong' as const, isAuspicious: true, category: 'moon_based' as const, formationRule: { en: '' }, description: { en: '' } },
  { id: 'budhaditya', name: { en: 'Budhaditya' }, present: true, strength: 'Moderate' as const, isAuspicious: true, category: 'sun_based' as const, formationRule: { en: '' }, description: { en: '' } },
];

describe('generateCosmicBlueprint', () => {
  const blueprint = generateCosmicBlueprint({
    shadbala: mockShadbala,
    dashas: mockDashas,
    yogas: mockYogas,
    ascendantSign: 4, // Cancer
    planets: [],
  });

  it('selects Mercury (highest strengthRatio) as primary archetype', () => {
    expect(blueprint.primary.planet).toBe(3);
    expect(blueprint.primary.archetype).toBe('analyst');
  });

  it('selects Venus (lowest strengthRatio) as shadow archetype', () => {
    expect(blueprint.shadow.planet).toBe(5);
    expect(blueprint.shadow.archetype).toBe('harmonizer');
  });

  it('maps current dasha (Jupiter) to Visionary chapter', () => {
    expect(blueprint.currentChapter.dashaLord).toBe(4);
    expect(blueprint.currentChapter.archetype).toBe('visionary');
  });

  it('maps next dasha (Saturn) to Architect chapter', () => {
    expect(blueprint.nextChapter.dashaLord).toBe(6);
    expect(blueprint.nextChapter.archetype).toBe('architect');
  });

  it('generates a non-empty headline', () => {
    expect(blueprint.headline.length).toBeGreaterThan(20);
    expect(blueprint.headline).toContain('Analyst');
  });

  it('includes persona modifier for Cancer lagna', () => {
    expect(blueprint.persona.lagnaSign).toBe(4);
    expect(blueprint.persona.expression.length).toBeGreaterThan(10);
  });

  it('includes active yoga influences', () => {
    expect(blueprint.activeYogas.length).toBeGreaterThan(0);
    const gk = blueprint.activeYogas.find(y => y.name.en === 'Gajakesari');
    expect(gk).toBeTruthy();
    expect(gk!.influence.length).toBeGreaterThan(10);
  });

  it('limits active yogas to 3', () => {
    expect(blueprint.activeYogas.length).toBeLessThanOrEqual(3);
  });

  it('headline mentions the next chapter shift year', () => {
    expect(blueprint.headline).toContain('2035');
  });

  it('primary has traits array with 4 items', () => {
    expect(blueprint.primary.traits).toHaveLength(4);
  });

  it('shadow has growth area text', () => {
    expect(blueprint.shadow.growthArea.length).toBeGreaterThan(10);
  });

  it('current chapter has themes array', () => {
    expect(blueprint.currentChapter.themes.length).toBeGreaterThan(0);
  });

  it('next chapter has transition note', () => {
    expect(blueprint.nextChapter.transitionNote.length).toBeGreaterThan(10);
  });
});

describe('Rahu/Ketu override', () => {
  it('overrides primary when Rahu is conjunct Moon', () => {
    const bp = generateCosmicBlueprint({
      shadbala: mockShadbala,
      dashas: mockDashas,
      yogas: [],
      ascendantSign: 1,
      planets: [{ id: 1, longitude: 100 }],
      rahuLongitude: 105, // within 10 degrees of Moon
      ketuLongitude: 285,
      moonLongitude: 100,
    });
    expect(bp.primary.archetype).toBe('maverick');
    expect(bp.primary.planet).toBe(7);
  });

  it('does not override when nodes are far from Moon and lagna lord', () => {
    const bp = generateCosmicBlueprint({
      shadbala: mockShadbala,
      dashas: mockDashas,
      yogas: [],
      ascendantSign: 1,
      planets: [{ id: 2, longitude: 50 }],
      rahuLongitude: 200,
      ketuLongitude: 20,
      lagnaLordId: 2,
      moonLongitude: 100,
    });
    // Should fall back to Mercury (highest shadbala)
    expect(bp.primary.archetype).toBe('analyst');
  });
});
