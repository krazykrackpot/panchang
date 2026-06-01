/**
 * Shared URL-build logic for the IndexNow cron family.
 *
 * Why this exists
 * ----------------
 *
 * The 2026-05-31 GSC drop showed that limiting IndexNow pings to en+hi
 * left mai (our #1 traffic driver) and mr (heavily hit during the dup
 * incident) crawled less aggressively by Bing/Yandex. C-track fix:
 * widen to all 9 active locales.
 *
 * One naive cron pinging all 9 locales at once would submit ~2,340
 * URLs in a single batch — well under IndexNow's 10k/request cap but
 * we hit a 429 rate-limit at 472 URLs during the recovery dispatch
 * earlier today. The rate limiter is per-key/per-window, not per-
 * request. So we split the locales into three groups and stagger the
 * cron schedules (00:05, 08:05, 16:05 UTC). Each group fires once
 * per day; 8h between groups is enough headroom for the rate limit
 * to reset.
 *
 * The three groups are exported below; route files import the
 * group they're responsible for. The URL-list builder doesn't know
 * about scheduling — it just takes a locale list and emits the same
 * three buckets the original cron emitted (daily-changing + curated
 * stable + festival per current/next year).
 */

import { TOP_FESTIVAL_SLUGS, FESTIVAL_VALID_YEARS } from '@/lib/calendar/festival-defs';

// Group 1 — existing slot, highest-traffic English + Hindi.
// Schedule: 00:05 UTC daily.
export const INDEXNOW_GROUP_PRIMARY = ['en', 'hi'] as const;

// Group 2 — Devanagari + Bengali. Maithili is per memory the #1
// traffic driver and was a key locale in the 2026-05-31 drop.
// Schedule: 08:05 UTC daily.
export const INDEXNOW_GROUP_DEVANAGARI_BN = ['mai', 'mr', 'bn'] as const;

// Group 3 — Dravidian + Gujarati. Lower per-locale traffic than the
// other two groups but all four locales saw indexation pressure in
// the GSC Coverage Validation flagged-URLs list.
// Schedule: 16:05 UTC daily.
export const INDEXNOW_GROUP_DRAVIDIAN_GU = ['ta', 'te', 'gu', 'kn'] as const;

// Curriculum: ancient-Indian-contributions slugs. Each is a static SEO page.
const CONTRIBUTION_SLUGS = [
  'al-khwarizmi', 'binary', 'calculus', 'cosmic-time', 'earth-rotation',
  'fibonacci', 'gravity', 'kerala-school', 'negative-numbers', 'pi',
  'pythagoras', 'sine', 'speed-of-light', 'timeline', 'zero',
] as const;

// Regional calendar landing pages — long-tail SEO for non-Hindi audiences.
const REGIONAL_CALENDARS = [
  'bengali', 'gujarati', 'iskcon', 'kannada', 'malayalam',
  'mithila', 'odia', 'tamil', 'telugu',
] as const;

// Stable tool landing pages — these don't change content daily but are
// high-intent landing pages worth keeping fresh in Bing's index.
const STABLE_TOOLS = [
  'sankalpa', 'sign-shift', 'sade-sati', 'varshaphal', 'kp-system',
  'prashna', 'baby-names', 'shraddha', 'dinacharya', 'kaal-sarp',
  'kaal-nirnaya', 'holashtak', 'chandra-darshan', 'chandrabalam',
  'financial-astrology', 'caesarean-muhurta', 'career-muhurta', 'muhurta-ai',
  'vedic-time', 'devotional', 'eclipses', 'retrograde', 'sarvatobhadra',
  'tropical-compare', 'choghadiya', 'gauri-panchang', 'hora',
  'sign-calculator', 'matching', 'kundali', 'pricing', 'about',
  'glossary', 'medical-astrology', 'learn',
] as const;

const RASHIS = [
  'mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya',
  'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen',
] as const;

/**
 * Build the full IndexNow path list for a given set of locales.
 * Same three buckets the original cron emitted:
 *   1. Daily-changing URLs (panchang, rahu-kaal, horoscope hub +
 *      per-rashi + dated rashi)
 *   2. Curated stable URLs (learn modules, tools, regional calendars,
 *      curriculum hubs)
 *   3. Festival per current + next year (filtered against
 *      FESTIVAL_VALID_YEARS to avoid pinging 404s)
 *
 * `today` is passed in so callers can lock it for the lifetime of the
 * cron run — derives `currentYear` from `today` slice, which keeps the
 * year window stable even if the cron straddles UTC midnight.
 */
export function buildIndexNowPaths(
  locales: readonly string[],
  today: string,
): string[] {
  const paths: string[] = [];
  const validYears = new Set<number>(FESTIVAL_VALID_YEARS);
  const currentYear = parseInt(today.slice(0, 4), 10);
  const nextYear = currentYear + 1;

  for (const locale of locales) {
    // Bucket 1: daily-changing URLs.
    paths.push(`/${locale}/panchang`);
    paths.push(`/${locale}/rahu-kaal`);
    paths.push(`/${locale}/horoscope`);
    paths.push(`/${locale}`);
    for (const r of RASHIS) {
      paths.push(`/${locale}/horoscope/${r}`);
      paths.push(`/${locale}/horoscope/${r}/${today}`);
    }

    // Bucket 2: curated stable URLs.
    for (const slug of CONTRIBUTION_SLUGS) {
      paths.push(`/${locale}/learn/contributions/${slug}`);
    }
    for (const r of REGIONAL_CALENDARS) {
      paths.push(`/${locale}/calendar/regional/${r}`);
    }
    for (const tool of STABLE_TOOLS) {
      paths.push(`/${locale}/${tool}`);
    }
    paths.push(`/${locale}/calendar`);
    paths.push(`/${locale}/festivals`);
    paths.push(`/${locale}/learn/contributions`);

    // Bucket 3: festival × current+next year.
    for (const fSlug of TOP_FESTIVAL_SLUGS) {
      for (const y of [currentYear, nextYear]) {
        if (validYears.has(y)) {
          paths.push(`/${locale}/festivals/${fSlug}/${y}`);
        }
      }
    }
  }

  return paths;
}
