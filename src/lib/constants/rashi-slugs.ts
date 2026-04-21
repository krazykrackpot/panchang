import { RASHIS } from './rashis';
import { CITIES, type CityData } from './cities';

export const RASHI_SLUGS = RASHIS.map(r => ({ id: r.id, slug: r.slug }));

/**
 * Western zodiac name → Vedic slug mapping.
 * Used for URL aliases so English search queries like "Aries horoscope" resolve.
 */
export const WESTERN_TO_VEDIC: Record<string, string> = {
  aries: 'mesh',
  taurus: 'vrishabh',
  gemini: 'mithun',
  cancer: 'kark',
  leo: 'simha',
  virgo: 'kanya',
  libra: 'tula',
  scorpio: 'vrishchik',
  sagittarius: 'dhanu',
  capricorn: 'makar',
  aquarius: 'kumbh',
  pisces: 'meen',
};

/** Vedic slug → Western name (reverse lookup). */
export const VEDIC_TO_WESTERN: Record<string, string> = Object.fromEntries(
  Object.entries(WESTERN_TO_VEDIC).map(([w, v]) => [v, w])
);

/** All Western zodiac slugs (lowercase). */
export const WESTERN_SLUGS = Object.keys(WESTERN_TO_VEDIC);

/**
 * Resolve a slug that may be either Vedic or Western to the canonical Vedic slug.
 * Returns the Vedic slug if found, otherwise undefined.
 */
export function resolveToVedicSlug(slug: string): string | undefined {
  // Direct Vedic slug match
  const direct = RASHIS.find(r => r.slug === slug);
  if (direct) return direct.slug;
  // Western slug lookup
  return WESTERN_TO_VEDIC[slug.toLowerCase()];
}

/**
 * Get the Western name for a Vedic slug (e.g., 'mesh' → 'aries').
 */
export function getWesternName(vedicSlug: string): string | undefined {
  return VEDIC_TO_WESTERN[vedicSlug];
}

/**
 * Generate all 78 unique pair slugs using Western names (e.g., 'aries-and-leo').
 */
export function getWesternPairSlugs(): string[] {
  const westernSlugs = RASHIS.map(r => VEDIC_TO_WESTERN[r.slug]);
  const pairs: string[] = [];
  for (let i = 0; i < 12; i++) {
    for (let j = i; j < 12; j++) {
      pairs.push(`${westernSlugs[i]}-and-${westernSlugs[j]}`);
    }
  }
  return pairs;
}

/**
 * Map a Western pair slug to its Vedic equivalent.
 * e.g., 'aries-and-leo' → 'mesh-and-simha'
 */
export function westernPairToVedic(westernPair: string): string | undefined {
  const parts = westernPair.split('-and-');
  if (parts.length !== 2) return undefined;
  const v1 = WESTERN_TO_VEDIC[parts[0].toLowerCase()];
  const v2 = WESTERN_TO_VEDIC[parts[1].toLowerCase()];
  if (!v1 || !v2) return undefined;
  return canonicalPairSlug(v1, v2);
}

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
