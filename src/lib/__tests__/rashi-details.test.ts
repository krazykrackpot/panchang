import { describe, it, expect } from 'vitest';
import { RASHI_SLUGS, getRashiBySlug, getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { RASHIS } from '@/lib/constants/rashis';

describe('Rashi Slugs', () => {
  it('has 12 slug entries matching RASHIS', () => {
    expect(RASHI_SLUGS).toHaveLength(12);
    RASHI_SLUGS.forEach((entry, i) => {
      expect(entry.id).toBe(i + 1);
      expect(entry.slug).toMatch(/^[a-z]+$/);
    });
  });

  it('getRashiBySlug returns correct rashi', () => {
    const mesh = getRashiBySlug('mesh');
    expect(mesh).toBeDefined();
    expect(mesh!.id).toBe(1);
    expect(getRashiBySlug('nonexistent')).toBeUndefined();
  });

  it('getDefaultCityForLocale returns valid cities', () => {
    expect(getDefaultCityForLocale('hi')).toEqual(expect.objectContaining({ slug: 'delhi' }));
    expect(getDefaultCityForLocale('ta')).toEqual(expect.objectContaining({ slug: 'chennai' }));
    expect(getDefaultCityForLocale('en')).toEqual(expect.objectContaining({ slug: 'delhi' }));
  });
});

describe('RASHIS has slug field', () => {
  it('every rashi has a non-empty slug', () => {
    RASHIS.forEach(r => {
      expect(r.slug).toBeDefined();
      expect(r.slug.length).toBeGreaterThan(0);
    });
  });
});
