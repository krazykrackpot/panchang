import { describe, it, expect } from 'vitest';
import { RASHI_SLUGS, getAllPairSlugs, canonicalPairSlug, getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { RASHI_DETAILS } from '@/lib/constants/rashi-details';
import { RASHI_PAIR_CONTENT } from '@/lib/constants/rashi-compatibility';
import { FAQ_DATA, generateFAQLD } from '@/lib/seo/faq-data';
import { PAGE_META } from '@/lib/seo/metadata';
import { RASHIS } from '@/lib/constants/rashis';

describe('SEO Content Expansion Integration', () => {
  it('all rashi slugs have PAGE_META entries', () => {
    RASHIS.forEach(r => {
      expect(PAGE_META[`/panchang/rashi/${r.slug}`], `Missing PAGE_META for /panchang/rashi/${r.slug}`).toBeDefined();
    });
  });

  it('rahu-kaal and choghadiya have PAGE_META entries', () => {
    expect(PAGE_META['/rahu-kaal']).toBeDefined();
    expect(PAGE_META['/choghadiya']).toBeDefined();
  });

  it('date categories have PAGE_META entries', () => {
    ['ekadashi', 'purnima', 'amavasya', 'pradosham', 'chaturthi'].forEach(cat => {
      expect(PAGE_META[`/dates/${cat}`], `Missing PAGE_META for /dates/${cat}`).toBeDefined();
    });
  });

  it('compatibility heatmap has PAGE_META entry', () => {
    expect(PAGE_META['/matching/compatibility']).toBeDefined();
  });

  it('all 78 pairs exist in content', () => {
    expect(getAllPairSlugs()).toHaveLength(78);
    expect(RASHI_PAIR_CONTENT).toHaveLength(78);
  });

  it('canonical pair slug normalizes order', () => {
    expect(canonicalPairSlug('vrishabh', 'mesh')).toBe('mesh-and-vrishabh');
    expect(canonicalPairSlug('mesh', 'vrishabh')).toBe('mesh-and-vrishabh');
  });

  it('RASHI_DETAILS count matches RASHIS count', () => {
    expect(RASHI_DETAILS).toHaveLength(RASHIS.length);
  });

  it('FAQ routes all produce valid JSON-LD', () => {
    Object.keys(FAQ_DATA).forEach(route => {
      const ld = generateFAQLD(route, 'en');
      expect(ld, `FAQ for ${route} should produce JSON-LD`).toBeDefined();
      expect(ld!['@type']).toBe('FAQPage');
    });
  });

  it('locale city defaults cover all supported locales', () => {
    ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn'].forEach(locale => {
      expect(getDefaultCityForLocale(locale), `Missing default city for locale ${locale}`).toBeDefined();
    });
  });

  it('all PAGE_META entries have en title and description', () => {
    const newRoutes = ['/rahu-kaal', '/choghadiya', '/matching/compatibility',
      ...['ekadashi', 'purnima', 'amavasya', 'pradosham', 'chaturthi'].map(c => `/dates/${c}`),
      ...RASHIS.map(r => `/panchang/rashi/${r.slug}`)];
    newRoutes.forEach(route => {
      const meta = PAGE_META[route];
      expect(meta, `Missing PAGE_META for ${route}`).toBeDefined();
      expect(meta.title.en, `Missing en title for ${route}`).toBeTruthy();
      expect(meta.description.en, `Missing en description for ${route}`).toBeTruthy();
    });
  });
});
