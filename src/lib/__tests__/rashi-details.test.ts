import { describe, it, expect } from 'vitest';
import {
  RASHI_SLUGS,
  getRashiBySlug,
  getDefaultCityForLocale,
  getRashiSlugById,
  canonicalPairSlug,
  getAllPairSlugs,
} from '@/lib/constants/rashi-slugs';
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

describe('getRashiSlugById', () => {
  it('returns the correct slug for valid IDs', () => {
    expect(getRashiSlugById(1)).toBe('mesh');
    expect(getRashiSlugById(12)).toBe(RASHIS[11].slug);
    // spot-check a middle value
    expect(getRashiSlugById(7)).toBe(RASHIS[6].slug);
  });

  it('returns undefined for out-of-range IDs', () => {
    expect(getRashiSlugById(0)).toBeUndefined();
    expect(getRashiSlugById(13)).toBeUndefined();
    expect(getRashiSlugById(-1)).toBeUndefined();
  });
});

describe('canonicalPairSlug', () => {
  it('returns lower-ID rashi first regardless of argument order', () => {
    const forward = canonicalPairSlug('mesh', 'vrishabh');
    const reversed = canonicalPairSlug('vrishabh', 'mesh');
    expect(forward).toBe('mesh-and-vrishabh');
    expect(reversed).toBe('mesh-and-vrishabh');
    expect(forward).toBe(reversed);
  });

  it('handles same-sign pairs', () => {
    expect(canonicalPairSlug('mesh', 'mesh')).toBe('mesh-and-mesh');
  });

  it('falls back gracefully for unknown slugs', () => {
    const result = canonicalPairSlug('unknown', 'mesh');
    expect(result).toBe('unknown-and-mesh');
  });
});

describe('getAllPairSlugs', () => {
  it('returns exactly 78 entries (C(12,2) + 12 same-sign)', () => {
    expect(getAllPairSlugs()).toHaveLength(78);
  });

  it('every entry matches the {slug}-and-{slug} pattern', () => {
    const validSlugPart = /^[a-z]+-and-[a-z]+$/;
    getAllPairSlugs().forEach(pair => {
      expect(pair).toMatch(validSlugPart);
    });
  });

  it('all slugs used in pairs are valid rashi slugs', () => {
    const validSlugs = new Set(RASHIS.map(r => r.slug));
    getAllPairSlugs().forEach(pair => {
      const [a, b] = pair.split('-and-');
      expect(validSlugs.has(a)).toBe(true);
      expect(validSlugs.has(b)).toBe(true);
    });
  });

  it('no duplicate pairs', () => {
    const pairs = getAllPairSlugs();
    const unique = new Set(pairs);
    expect(unique.size).toBe(78);
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
