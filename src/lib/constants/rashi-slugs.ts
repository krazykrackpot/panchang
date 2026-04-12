import { RASHIS } from './rashis';
import { CITIES, type CityData } from './cities';

export const RASHI_SLUGS = RASHIS.map(r => ({ id: r.id, slug: r.slug }));

export function getRashiBySlug(slug: string) {
  return RASHIS.find(r => r.slug === slug);
}

export function getRashiSlugById(id: number): string | undefined {
  return RASHIS.find(r => r.id === id)?.slug;
}

/** Returns a canonical pair slug with lower ID first. */
export function canonicalPairSlug(slug1: string, slug2: string): string {
  const r1 = getRashiBySlug(slug1);
  const r2 = getRashiBySlug(slug2);
  if (!r1 || !r2) return `${slug1}-and-${slug2}`;
  return r1.id <= r2.id
    ? `${r1.slug}-and-${r2.slug}`
    : `${r2.slug}-and-${r1.slug}`;
}

/** All 78 unique pair slugs (including same-sign). */
export function getAllPairSlugs(): string[] {
  const pairs: string[] = [];
  for (let i = 0; i < 12; i++) {
    for (let j = i; j < 12; j++) {
      pairs.push(`${RASHIS[i].slug}-and-${RASHIS[j].slug}`);
    }
  }
  return pairs;
}

const LOCALE_CITY_MAP: Record<string, string> = {
  hi: 'delhi',
  ta: 'chennai',
  te: 'hyderabad',
  bn: 'kolkata',
  kn: 'bangalore',
  sa: 'delhi',
  en: 'delhi',
};

export function getDefaultCityForLocale(locale: string): CityData | undefined {
  const slug = LOCALE_CITY_MAP[locale] || 'delhi';
  return CITIES.find(c => c.slug === slug);
}
