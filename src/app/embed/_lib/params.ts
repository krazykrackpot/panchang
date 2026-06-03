/**
 * Shared query-parameter parsing + validation for the /embed/* widgets.
 *
 * Strictly normalises untrusted user input to a known-safe value. All
 * accessors return a discriminated string (no `any`, no `unknown`).
 *
 * `ref` deserves special attention — it's free-form and ends up in the
 * attribution-footer URL as `utm_campaign`. Validation: 1-64 chars,
 * `[a-z0-9-]`. Anything else falls back to undefined (no UTM tagging).
 * This blocks URL injection via `ref=` from a malicious embedder.
 */

import type { EmbedTheme, EmbedSize } from './embed-theme';

export const VISIBLE_LOCALES = [
  'en',
  'hi',
  'ta',
  'te',
  'bn',
  'gu',
  'kn',
  'mr',
  'mai',
] as const;
export type VisibleLocale = (typeof VISIBLE_LOCALES)[number];

export function parseEmbedTheme(raw: string | undefined): EmbedTheme {
  if (raw === 'dark' || raw === 'auto') return raw;
  return 'light'; // default + fallback for anything unknown
}

export function parseEmbedSize(raw: string | undefined): EmbedSize {
  if (raw === 'narrow' || raw === 'wide') return raw;
  return 'default';
}

export function parseEmbedLocale(raw: string | undefined): VisibleLocale {
  if (raw && (VISIBLE_LOCALES as readonly string[]).includes(raw)) {
    return raw as VisibleLocale;
  }
  return 'en';
}

/**
 * Attribution-tracking identifier. Lets us tell which embedded site
 * generated which referral via UTM tagging on the attribution link.
 *
 * Allowed: `[a-z0-9-]{1,64}`. Lowercase only. No underscores, no dots,
 * no slashes — keeps the value safe to interpolate into a URL without
 * encoding gotchas and prevents an embedder from injecting query-string
 * fragments via the `ref` param.
 */
export function parseEmbedRef(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (raw.length > 64) return undefined;
  if (!/^[a-z0-9-]+$/.test(raw)) return undefined;
  return raw;
}

/**
 * Days-ahead horizon for the `/embed/festivals` widget. 1-30 days,
 * defaults to 7. Out-of-range values clamp.
 */
export function parseEmbedDays(raw: string | undefined): number {
  if (!raw) return 7;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return 7;
  if (n < 1) return 1;
  if (n > 30) return 30;
  return n;
}

/**
 * Layout mode for the `/embed/horoscope` widget.
 *
 *   strip   — default. All 12 rashis as compact gateway tiles in a row.
 *             Each tile links to the rashi's full daily forecast page.
 *   single  — one featured rashi with the full daily insight; the other
 *             11 sit beneath as a thin nav strip. Use with `highlight=…`.
 */
export type EmbedHoroscopeMode = 'strip' | 'single';

export function parseEmbedMode(raw: string | undefined): EmbedHoroscopeMode {
  if (raw === 'single') return 'single';
  return 'strip';
}

/**
 * The 12 canonical Vedic rashi slugs (1-based ID order). Mirrors
 * `RASHIS[].slug` from `@/lib/constants/rashis`. Duplicated here so
 * this module stays the single source of truth for embed param
 * validation — importing the full rashis table would pull in the
 * 12-language name dictionaries we don't need at validation time.
 */
export const RASHI_SLUGS = [
  'mesh',
  'vrishabh',
  'mithun',
  'kark',
  'simha',
  'kanya',
  'tula',
  'vrishchik',
  'dhanu',
  'makar',
  'kumbh',
  'meen',
] as const;
export type RashiSlug = (typeof RASHI_SLUGS)[number];

/**
 * Validate the `?highlight=…` param against the canonical rashi-slug
 * list. Returns the slug unchanged if it's one of the 12 Vedic slugs,
 * otherwise undefined. The page treats undefined as "fall back to
 * mesh / first rashi" so the widget never errors out on a bad value.
 */
export function parseEmbedHighlight(raw: string | undefined): RashiSlug | undefined {
  if (!raw) return undefined;
  if ((RASHI_SLUGS as readonly string[]).includes(raw)) {
    return raw as RashiSlug;
  }
  return undefined;
}
