/**
 * SEO metadata coverage gates.
 *
 * Closes the silent-empty class of bugs the May 2026 audit surfaced:
 * - Every `getPageMetadata('/foo', locale)` call site must have a
 *   matching '/foo' key in PAGE_META.
 * - Every route in the curated PRIORITY_ROUTES list must carry copy for
 *   every active locale (no English fallback on top-traffic SERPs).
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { PAGE_META } from '@/lib/seo/metadata';
import { locales } from '@/lib/i18n/config';

const APP_ROOT = join(process.cwd(), 'src/app/[locale]');

/** Top-traffic / flagship routes that MUST carry copy for every active locale. */
const PRIORITY_ROUTES: ReadonlyArray<string> = [
  '/panchang',
  '/kundali',
  '/horoscope',
  '/calendar',
  '/matching',
  '/brihaspati',
  '/sadhaka-path',
  '/muhurta-ai',
  '/choghadiya',
  '/festivals',
  '/devotional',
  '/learn',
  '/tools',
  '/calendars',
  '/calendars/masa',
  '/calendars/tithi',
  '/hora',
  '/rahu-kaal',
  '/sade-sati',
  '/baby-names',
  '/sign-calculator',
  '/charts',
  '/about',
  '/vrat-calendar',
  '/eclipses',
  '/transits',
  '/hindu-calendar/2026',
  '/vivah-muhurat/2026',
  '/dates/ekadashi',
  '/dates/purnima',
];

/** Walk every TSX file under [locale] and pull out getPageMetadata(...) route args. */
function collectGetPageMetadataCallsites(): string[] {
  const routes = new Set<string>();
  const stack: string[] = [APP_ROOT];
  while (stack.length) {
    const dir = stack.pop()!;
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of entries) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) {
        stack.push(p);
      } else if (name.endsWith('.tsx') || name.endsWith('.ts')) {
        const src = readFileSync(p, 'utf8');
        for (const m of src.matchAll(/getPageMetadata\(\s*['"]([^'"]+)['"]/g)) {
          routes.add(m[1]);
        }
      }
    }
  }
  return [...routes].sort();
}

describe('PAGE_META coverage', () => {
  it('every getPageMetadata call site has a matching PAGE_META entry', () => {
    const called = collectGetPageMetadataCallsites();
    const missing = called.filter((r) => !(r in PAGE_META));
    expect(missing, `Routes called via getPageMetadata but missing from PAGE_META — add an entry in src/lib/seo/metadata.ts:\n  ${missing.join('\n  ')}`).toEqual([]);
  });

  it('PAGE_META is never empty', () => {
    expect(Object.keys(PAGE_META).length).toBeGreaterThan(0);
  });

  it('every PAGE_META entry has an English title and description', () => {
    const broken: string[] = [];
    for (const [route, meta] of Object.entries(PAGE_META)) {
      if (!meta.title?.en) broken.push(`${route}.title.en`);
      if (!meta.description?.en) broken.push(`${route}.description.en`);
    }
    expect(broken, `Entries missing required en strings:\n  ${broken.join('\n  ')}`).toEqual([]);
  });
});

describe('PAGE_META priority-route multilingual parity', () => {
  // Skip `en` — it's the required fallback. Test the other active locales.
  const TARGET_LOCALES = locales.filter((l) => l !== 'en');

  it.each(PRIORITY_ROUTES)('%s carries every active locale title + description', (route) => {
    const meta = PAGE_META[route];
    expect(meta, `${route} is in PRIORITY_ROUTES but has no PAGE_META entry`).toBeDefined();
    if (!meta) return;

    const missingTitle = TARGET_LOCALES.filter((l) => !meta.title[l]);
    const missingDesc = TARGET_LOCALES.filter((l) => !meta.description[l]);

    expect(
      missingTitle,
      `${route}.title missing for: ${missingTitle.join(', ')}`,
    ).toEqual([]);
    expect(
      missingDesc,
      `${route}.description missing for: ${missingDesc.join(', ')}`,
    ).toEqual([]);
  });
});
