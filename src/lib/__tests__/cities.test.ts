import { describe, it, expect } from 'vitest';
import { CITIES, getCityBySlug, getAllCitySlugs, getPopularCities } from '@/lib/constants/cities';

describe('cities', () => {
  it('has at least 40 Indian cities', () => {
    const indian = CITIES.filter(c => c.timezone === 'Asia/Kolkata');
    expect(indian.length).toBeGreaterThanOrEqual(40);
  });

  it('has international diaspora cities', () => {
    const intl = CITIES.filter(c => c.timezone !== 'Asia/Kolkata');
    expect(intl.length).toBeGreaterThanOrEqual(5);
  });

  it('all slugs are unique', () => {
    const slugs = CITIES.map(c => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('all slugs are URL-safe', () => {
    for (const city of CITIES) {
      expect(city.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('all cities have valid coordinates', () => {
    for (const city of CITIES) {
      expect(city.lat).toBeGreaterThanOrEqual(-90);
      expect(city.lat).toBeLessThanOrEqual(90);
      expect(city.lng).toBeGreaterThanOrEqual(-180);
      expect(city.lng).toBeLessThanOrEqual(180);
    }
  });

  it('all cities have bilingual names', () => {
    for (const city of CITIES) {
      expect(city.name.en).toBeTruthy();
      expect(city.name.hi).toBeTruthy();
    }
  });

  it('getCityBySlug returns correct city', () => {
    const delhi = getCityBySlug('delhi');
    expect(delhi).toBeDefined();
    expect(delhi!.name.en).toBe('Delhi');
    expect(delhi!.lat).toBeCloseTo(28.61, 1);
  });

  it('getCityBySlug returns undefined for invalid slug', () => {
    expect(getCityBySlug('atlantis')).toBeUndefined();
  });

  it('getAllCitySlugs returns all slugs', () => {
    const slugs = getAllCitySlugs();
    expect(slugs.length).toBe(CITIES.length);
    expect(slugs).toContain('delhi');
    expect(slugs).toContain('new-york');
  });

  it('varanasi and ujjain are included (pilgrimage cities)', () => {
    expect(getCityBySlug('varanasi')).toBeDefined();
    expect(getCityBySlug('ujjain')).toBeDefined();
  });

  it('getPopularCities returns sorted by population descending', () => {
    const popular = getPopularCities(5);
    expect(popular.length).toBe(5);
    for (let i = 1; i < popular.length; i++) {
      expect(popular[i - 1].population! >= popular[i].population!).toBe(true);
    }
  });

  it('getPopularCities defaults to 12', () => {
    const popular = getPopularCities();
    expect(popular.length).toBe(12);
  });

  it('all cities have valid IANA timezone strings', () => {
    for (const city of CITIES) {
      expect(city.timezone).toMatch(/^[A-Z][a-zA-Z_]+\/[A-Za-z_]+/);
    }
  });

  it('mumbai has correct timezone', () => {
    const mumbai = getCityBySlug('mumbai');
    expect(mumbai!.timezone).toBe('Asia/Kolkata');
  });

  it('new-york has correct timezone', () => {
    const ny = getCityBySlug('new-york');
    expect(ny!.timezone).toBe('America/New_York');
  });
});
