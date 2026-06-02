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
