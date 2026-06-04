/**
 * Shared metadata generator for `/learn/modules/<id>` layout files.
 *
 * Each module's layout collapses to a 3-line stub that calls
 * `generateModuleMetadata(MOD_ID, locale)`. Centralising the three
 * concerns the per-folder layouts had to get right
 *   - `robots` gated on the indexability policy (was missing entirely)
 *   - hreflang restricted to indexable locales (was fanning to all 9)
 *   - canonical resolving to en for non-indexable locales (was using
 *     `${locale}` for every locale)
 * here, since 117 hand-rolled per-folder copies meant 117 chances to
 * miss any of them.
 *
 * Spec: docs/specs/2026-06-04-noindex-thin-translation-locales.md §2.3
 *
 * Follow-up: task #95 — collapse the 117 per-folder routes to a single
 * `[moduleId]` dynamic route (R3a). This helper becomes a temporary
 * shim until that lands.
 */

import type { Metadata } from 'next';
import { isLocaleIndexable } from './indexable-locales';
import { buildIndexableHreflang, buildCanonicalUrl } from './hreflang';
import { getModuleRef } from '@/lib/learn/module-sequence';

export async function generateModuleMetadata(
  modId: string,
  locale: string,
): Promise<Metadata> {
  const route = `/learn/modules/${modId}`;
  const isIndexable = isLocaleIndexable(route, locale);

  const mod = getModuleRef(modId);
  const title = mod
    ? `${((mod.title as Record<string, string>)[locale] || mod.title.en)}  –  Learn Jyotish`
    : `Module ${modId}  –  Learn Jyotish`;
  const description = mod
    ? `${mod.topic} · Module ${modId}  –  Interactive Vedic astrology lesson`
    : undefined;

  return {
    title,
    description,
    robots: isIndexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical: buildCanonicalUrl(route, locale),
      languages: buildIndexableHreflang(route),
    },
    openGraph: { title, description },
  };
}
