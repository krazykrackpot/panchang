/**
 * Locale-default city map for /panchang and /[locale] homepage.
 *
 * Purpose: fix the "Iowa-Googlebot" SEO regression where Googlebot,
 * crawling from US datacentres, resolves x-vercel-ip-city to Iowa /
 * Virginia / Washington. Without this map, /en/panchang gets indexed
 * with US-city panchang values — hours off from what Indian users
 * searching "aaj ka panchang" expect. Rank drops accordingly.
 *
 * When a request has no usable geo header (bot, missing header, or the
 * proxy classification below), we render with the locale-canonical
 * city instead. Real users retain per-request geo via the proxy
 * redirect (see /panchang/[city] fan-out).
 *
 * Slug must be a member of CANONICAL_CITY_SLUGS in
 * `@/lib/seo/proxy-allowlists` — the /panchang/[city] fan-out ISR
 * only renders those. Every value here has been verified against that
 * set.
 */
export interface LocaleDefaultCity {
  slug: string;
  displayName: string; // For SSR title/description without a re-slug lookup.
  lat: number;
  lng: number;
  timezone: string;
}

export const LOCALE_DEFAULT_CITY: Record<string, LocaleDefaultCity> = {
  en: { slug: 'delhi', displayName: 'New Delhi', lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata' },
  hi: { slug: 'delhi', displayName: 'नई दिल्ली', lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata' },
  ta: { slug: 'chennai', displayName: 'சென்னை', lat: 13.0827, lng: 80.2707, timezone: 'Asia/Kolkata' },
  te: { slug: 'hyderabad', displayName: 'హైదరాబాద్', lat: 17.3850, lng: 78.4867, timezone: 'Asia/Kolkata' },
  bn: { slug: 'kolkata', displayName: 'কলকাতা', lat: 22.5726, lng: 88.3639, timezone: 'Asia/Kolkata' },
  gu: { slug: 'ahmedabad', displayName: 'અમદાવાદ', lat: 23.0225, lng: 72.5714, timezone: 'Asia/Kolkata' },
  kn: { slug: 'bangalore', displayName: 'ಬೆಂಗಳೂರು', lat: 12.9716, lng: 77.5946, timezone: 'Asia/Kolkata' },
  mai: { slug: 'patna', displayName: 'पटना', lat: 25.6093, lng: 85.1376, timezone: 'Asia/Kolkata' },
  mr: { slug: 'mumbai', displayName: 'मुंबई', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata' },
};

/**
 * Resolves the default city for a given locale. Unknown locales fall
 * back to the English default (Delhi) — matches the /[locale]/layout
 * COPY[locale] ?? COPY.en pattern used elsewhere.
 */
export function getLocaleDefaultCity(locale: string): LocaleDefaultCity {
  return LOCALE_DEFAULT_CITY[locale] ?? LOCALE_DEFAULT_CITY.en;
}

/**
 * Normalise a Vercel geo city name to the /panchang/[city] slug
 * convention: lowercase, spaces + underscores → hyphens, strip
 * anything that isn't [a-z0-9-]. This matches the slug format in
 * CANONICAL_CITY_SLUGS.
 *
 * Examples:
 *   "New Delhi"    → "new-delhi"
 *   "Bangalore"    → "bangalore"
 *   "Bengaluru"    → "bengaluru"  (aliased to 'bangalore' at lookup)
 *   "São Paulo"    → "sao-paulo"  (URI-decoded upstream)
 *
 * Returns null when the input is empty or degenerates to an empty
 * slug after normalisation.
 */
export function slugifyGeoCity(rawCity: string | null | undefined): string | null {
  if (!rawCity) return null;
  const trimmed = rawCity.trim();
  if (!trimmed) return null;
  const slug = trimmed
    .toLowerCase()
    // Strip diacritics before dropping non-ASCII so "São" → "sao".
    .normalize('NFD')
    // eslint-disable-next-line no-misleading-character-class
    .replace(/[̀-ͯ]/g, '')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug.length > 0 ? slug : null;
}

/**
 * Common aliases Vercel geo returns that don't match CANONICAL_CITY_SLUGS
 * one-to-one. Keep in one place so proxy + page use the same mapping.
 */
export const GEO_CITY_ALIASES: Record<string, string> = {
  bengaluru: 'bangalore',
  bengalooru: 'bangalore',
  'new-delhi': 'delhi',
  'greater-noida': 'noida',
  bombay: 'mumbai',
  madras: 'chennai',
  calcutta: 'kolkata',
};

/**
 * Full resolution: geo header → alias → canonical slug. Returns null
 * when the resolved slug isn't in the canonical set (unknown or
 * misspelled city), which is the caller's cue to fall through to the
 * locale-default city.
 */
export function resolveGeoCitySlug(
  rawGeoCity: string | null | undefined,
  canonicalSlugs: ReadonlySet<string>,
): string | null {
  const slug = slugifyGeoCity(rawGeoCity);
  if (!slug) return null;
  const aliased = GEO_CITY_ALIASES[slug] ?? slug;
  return canonicalSlugs.has(aliased) ? aliased : null;
}

/**
 * Bot / crawler / social-card fetcher UA classifier. Same regex the
 * proxy uses (`src/proxy.ts` BOT_UA_PATTERN) — re-declared here so
 * both edge (proxy) and node (page.tsx) call sites classify identically.
 *
 * Intentionally broad substring matching: false positives (a real
 * browser flagged as bot) lose only geo-personalisation and see the
 * locale-canonical city, which is a reasonable default.
 */
const BOT_UA_PATTERN_SHARED = /bot|crawl|spider|slurp|ia_archiver|facebookexternalhit/i;
export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return false;
  return BOT_UA_PATTERN_SHARED.test(ua);
}
