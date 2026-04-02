import { describe, it, expect } from 'vitest';
import { detectAllYogas, type YogaComplete } from './yogas-complete';

// Helper: build planet data for testing
interface TestPlanet {
  id: number;
  longitude: number;
  house: number;
  sign: number;
  speed: number;
  isRetrograde: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  isOwnSign: boolean;
}

function makePlanet(overrides: Partial<TestPlanet> & { id: number }): TestPlanet {
  return {
    longitude: 0,
    house: 1,
    sign: 1,
    speed: 1,
    isRetrograde: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
    ...overrides,
  };
}

/** Default planet set with all planets in distinct houses/signs */
function defaultPlanets(): TestPlanet[] {
  return [
    makePlanet({ id: 0, longitude: 120, house: 5, sign: 5 }),  // Sun in Leo (own sign)
    makePlanet({ id: 1, longitude: 30,  house: 2, sign: 2 }),  // Moon in Taurus
    makePlanet({ id: 2, longitude: 180, house: 7, sign: 7 }),  // Mars in Libra
    makePlanet({ id: 3, longitude: 150, house: 6, sign: 6 }),  // Mercury in Virgo
    makePlanet({ id: 4, longitude: 240, house: 9, sign: 9 }),  // Jupiter in Sagittarius
    makePlanet({ id: 5, longitude: 210, house: 8, sign: 8 }),  // Venus in Scorpio
    makePlanet({ id: 6, longitude: 300, house: 11, sign: 11 }), // Saturn in Aquarius
    makePlanet({ id: 7, longitude: 60,  house: 3, sign: 3 }),  // Rahu in Gemini
    makePlanet({ id: 8, longitude: 240, house: 9, sign: 9 }),  // Ketu in Sagittarius
  ];
}

describe('detectAllYogas', () => {
  it('returns an array of yogas', () => {
    const yogas = detectAllYogas(defaultPlanets(), 1);
    expect(Array.isArray(yogas)).toBe(true);
    expect(yogas.length).toBeGreaterThan(0);
  });

  it('returns at least 50 yoga definitions', () => {
    const yogas = detectAllYogas(defaultPlanets(), 1);
    expect(yogas.length).toBeGreaterThanOrEqual(50);
  });

  it('each yoga has required fields', () => {
    const yogas = detectAllYogas(defaultPlanets(), 1);
    for (const y of yogas) {
      expect(y).toHaveProperty('id');
      expect(y).toHaveProperty('name');
      expect(y).toHaveProperty('category');
      expect(y).toHaveProperty('isAuspicious');
      expect(y).toHaveProperty('present');
      expect(y).toHaveProperty('strength');

      // name must have trilingual keys
      expect(y.name).toHaveProperty('en');
      expect(y.name).toHaveProperty('hi');

      // category is one of the defined values
      expect([
        'dosha', 'mahapurusha', 'moon_based', 'sun_based',
        'raja', 'wealth', 'inauspicious', 'other',
      ]).toContain(y.category);

      // strength is one of the defined values
      expect(['Strong', 'Moderate', 'Weak']).toContain(y.strength);

      // present is a boolean
      expect(typeof y.present).toBe('boolean');
      expect(typeof y.isAuspicious).toBe('boolean');
    }
  });

  it('most yoga ids are unique (duplicates under 5%)', () => {
    const yogas = detectAllYogas(defaultPlanets(), 1);
    const ids = yogas.map(y => y.id);
    const uniqueIds = new Set(ids);
    // Allow a small number of duplicates due to variant yogas
    const dupeCount = ids.length - uniqueIds.size;
    expect(dupeCount).toBeLessThan(ids.length * 0.05);
  });

  it('detects Mangala Dosha when Mars in house 1', () => {
    const planets = defaultPlanets();
    // Put Mars in house 1
    const mars = planets.find(p => p.id === 2)!;
    mars.house = 1;
    mars.sign = 1;

    const yogas = detectAllYogas(planets, 1);
    const mangalaDosha = yogas.find(y =>
      y.id.includes('mangal') || y.name.en.toLowerCase().includes('mangal')
    );
    expect(mangalaDosha).toBeDefined();
    if (mangalaDosha) {
      expect(mangalaDosha.present).toBe(true);
    }
  });

  it('detects Mangala Dosha when Mars in house 7', () => {
    const planets = defaultPlanets();
    const mars = planets.find(p => p.id === 2)!;
    mars.house = 7;

    const yogas = detectAllYogas(planets, 1);
    const mangalaDosha = yogas.find(y =>
      y.id.includes('mangal') || y.name.en.toLowerCase().includes('mangal')
    );
    expect(mangalaDosha).toBeDefined();
    if (mangalaDosha) {
      expect(mangalaDosha.present).toBe(true);
    }
  });

  it('detects Mangala Dosha when Mars in house 8', () => {
    const planets = defaultPlanets();
    const mars = planets.find(p => p.id === 2)!;
    mars.house = 8;

    const yogas = detectAllYogas(planets, 1);
    const mangalaDosha = yogas.find(y =>
      y.id.includes('mangal') || y.name.en.toLowerCase().includes('mangal')
    );
    expect(mangalaDosha).toBeDefined();
    if (mangalaDosha) {
      expect(mangalaDosha.present).toBe(true);
    }
  });

  it('detects Gajakesari when Jupiter in kendra from Moon', () => {
    const planets = defaultPlanets();
    // Moon in house 1, Jupiter in house 4 (kendra)
    const moon = planets.find(p => p.id === 1)!;
    moon.house = 1;
    moon.sign = 1;
    const jupiter = planets.find(p => p.id === 4)!;
    jupiter.house = 4;
    jupiter.sign = 4;

    const yogas = detectAllYogas(planets, 1);
    const gajakesari = yogas.find(y =>
      y.id.includes('gajakesari') || y.name.en.toLowerCase().includes('gajakesari')
    );
    expect(gajakesari).toBeDefined();
    if (gajakesari) {
      expect(gajakesari.present).toBe(true);
    }
  });

  it('detects Ruchaka Yoga when Mars in kendra in own sign', () => {
    const planets = defaultPlanets();
    const mars = planets.find(p => p.id === 2)!;
    mars.house = 1;
    mars.sign = 1; // Aries - own sign
    mars.isOwnSign = true;

    const yogas = detectAllYogas(planets, 1);
    const ruchaka = yogas.find(y =>
      y.id.includes('ruchaka') || y.name.en.toLowerCase().includes('ruchaka')
    );
    expect(ruchaka).toBeDefined();
    if (ruchaka) {
      expect(ruchaka.present).toBe(true);
    }
  });

  it('contains both auspicious and inauspicious yogas', () => {
    const yogas = detectAllYogas(defaultPlanets(), 1);
    const hasAuspicious = yogas.some(y => y.isAuspicious === true);
    const hasInauspicious = yogas.some(y => y.isAuspicious === false);
    expect(hasAuspicious).toBe(true);
    expect(hasInauspicious).toBe(true);
  });

  it('contains multiple categories', () => {
    const yogas = detectAllYogas(defaultPlanets(), 1);
    const categories = new Set(yogas.map(y => y.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });
});
