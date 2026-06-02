import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  parseEmbedTheme,
  parseEmbedSize,
  parseEmbedLocale,
  parseEmbedRef,
  parseEmbedDays,
  VISIBLE_LOCALES,
} from '../_lib/params';
import { buildWidgetCss } from '../_lib/build-widget-css';
import { LIGHT, DARK, resolveTokens, resolveSize } from '../_lib/embed-theme';
import { getEmbedLabels } from '../_lib/embed-labels';

function read(rel: string): string {
  return readFileSync(join(process.cwd(), rel), 'utf8');
}

describe('parseEmbedTheme', () => {
  it.each([
    [undefined, 'light'],
    ['light', 'light'],
    ['dark', 'dark'],
    ['auto', 'auto'],
    ['rainbow', 'light'], // unknown → safe default
    ['', 'light'],
  ])('"%s" → %s', (raw, expected) => {
    expect(parseEmbedTheme(raw)).toBe(expected);
  });
});

describe('parseEmbedSize', () => {
  it.each([
    [undefined, 'default'],
    ['narrow', 'narrow'],
    ['default', 'default'],
    ['wide', 'wide'],
    ['huge', 'default'],
  ])('"%s" → %s', (raw, expected) => {
    expect(parseEmbedSize(raw)).toBe(expected);
  });
});

describe('parseEmbedLocale', () => {
  it('returns the locale when it is one of the 9 visible locales', () => {
    for (const loc of VISIBLE_LOCALES) {
      expect(parseEmbedLocale(loc)).toBe(loc);
    }
  });
  it('returns en for unknown locales (NOT a Hindi fallback)', () => {
    expect(parseEmbedLocale(undefined)).toBe('en');
    expect(parseEmbedLocale('sa')).toBe('en'); // retired locale
    expect(parseEmbedLocale('rainbow')).toBe('en');
    expect(parseEmbedLocale('')).toBe('en');
  });
});

describe('parseEmbedRef — URL-safety guard', () => {
  it('accepts lowercase + digits + hyphen identifiers', () => {
    expect(parseEmbedRef('iskcondelhi')).toBe('iskcondelhi');
    expect(parseEmbedRef('iskcon-delhi')).toBe('iskcon-delhi');
    expect(parseEmbedRef('a1b2c3')).toBe('a1b2c3');
    expect(parseEmbedRef('x')).toBe('x');
    expect(parseEmbedRef('a'.repeat(64))).toBe('a'.repeat(64));
  });

  it('rejects oversized identifiers (>64 chars)', () => {
    expect(parseEmbedRef('a'.repeat(65))).toBeUndefined();
  });

  it('rejects uppercase + special chars (URL-injection guard)', () => {
    expect(parseEmbedRef('ISKCONDELHI')).toBeUndefined();
    expect(parseEmbedRef('iskcon_delhi')).toBeUndefined();
    expect(parseEmbedRef('iskcon.delhi')).toBeUndefined();
    expect(parseEmbedRef('iskcon/delhi')).toBeUndefined();
    expect(parseEmbedRef('?injection=true')).toBeUndefined();
    expect(parseEmbedRef('<script>')).toBeUndefined();
    expect(parseEmbedRef(' iskcon')).toBeUndefined();
    expect(parseEmbedRef('iskcon ')).toBeUndefined();
  });

  it('returns undefined for empty / missing input', () => {
    expect(parseEmbedRef(undefined)).toBeUndefined();
    expect(parseEmbedRef('')).toBeUndefined();
  });
});

describe('parseEmbedDays', () => {
  it.each([
    [undefined, 7],
    ['1', 1],
    ['7', 7],
    ['30', 30],
    ['0', 1], // clamps to 1
    ['100', 30], // clamps to 30
    ['rainbow', 7], // fallback default
    ['-5', 1], // clamps to 1
  ])('"%s" → %d', (raw, expected) => {
    expect(parseEmbedDays(raw)).toBe(expected);
  });
});

describe('Theme tokens', () => {
  it('LIGHT and DARK share the same keys', () => {
    expect(Object.keys(LIGHT).sort()).toEqual(Object.keys(DARK).sort());
  });

  it('LIGHT vs DARK background colors differ (no accidental copy-paste)', () => {
    expect(LIGHT.background).not.toBe(DARK.background);
    expect(LIGHT.text).not.toBe(DARK.text);
  });

  it('resolveTokens returns the correct palette', () => {
    expect(resolveTokens('light')).toBe(LIGHT);
    expect(resolveTokens('dark')).toBe(DARK);
  });

  it('resolveSize narrow < default < wide for maxWidth', () => {
    const n = resolveSize('narrow');
    const d = resolveSize('default');
    const w = resolveSize('wide');
    expect(n.maxWidth).toBeLessThan(d.maxWidth);
    expect(d.maxWidth).toBeLessThan(w.maxWidth);
  });
});

describe('buildWidgetCss', () => {
  it('returns non-empty CSS for every theme × size combination', () => {
    for (const theme of ['light', 'dark', 'auto'] as const) {
      for (const size of ['narrow', 'default', 'wide'] as const) {
        const css = buildWidgetCss({ theme, size });
        expect(css.length, `${theme}/${size}`).toBeGreaterThan(500);
      }
    }
  });

  it('light theme contains the LIGHT background color', () => {
    expect(buildWidgetCss({ theme: 'light', size: 'default' })).toContain(LIGHT.background);
  });

  it('dark theme contains the DARK background color', () => {
    expect(buildWidgetCss({ theme: 'dark', size: 'default' })).toContain(DARK.background);
  });

  it('auto theme emits both palettes + prefers-color-scheme media query', () => {
    const css = buildWidgetCss({ theme: 'auto', size: 'default' });
    expect(css).toContain(LIGHT.background);
    expect(css).toContain(DARK.background);
    expect(css).toContain('@media (prefers-color-scheme: dark)');
  });

  it('size narrow embeds the narrow max-width', () => {
    const css = buildWidgetCss({ theme: 'light', size: 'narrow' });
    expect(css).toMatch(/max-width:\s*280px/);
  });
});

describe('Embed labels — all 9 locales filled in directly', () => {
  // The 2026-05-31 Marathi de-rank was caused by mr/mai falling back
  // to Hindi text via isDevanagariLocale. The catalog here repeats
  // the discipline established for the homepage chip strip: every
  // locale has its own copy directly. This test fires if anyone
  // strips or empties a locale.
  it.each(VISIBLE_LOCALES)('locale=%s has non-empty labels for every UI key', (loc) => {
    const labels = getEmbedLabels(loc);
    const required: (keyof typeof labels)[] = [
      'tithi',
      'nakshatra',
      'yoga',
      'karana',
      'vara',
      'sunrise',
      'sunset',
      'until',
      'configError',
      'upcomingFestivals',
      'noFestivals',
      'poweredBy',
    ];
    for (const key of required) {
      expect(labels[key], `${loc}.${key} is empty`).toBeTruthy();
      expect(labels[key].length).toBeGreaterThan(0);
    }
  });

  it('mr labels are NOT identical to hi labels (anti-fallback guard)', () => {
    const hi = getEmbedLabels('hi');
    const mr = getEmbedLabels('mr');
    // At least one key must differ — they should not be the same object.
    const allMatch =
      hi.tithi === mr.tithi &&
      hi.nakshatra === mr.nakshatra &&
      hi.until === mr.until &&
      hi.configError === mr.configError;
    expect(allMatch, 'mr labels look identical to hi — Hindi-fallback regression').toBe(false);
  });
});

describe('AttributionFooter source-level invariants', () => {
  const src = read('src/app/embed/_components/AttributionFooter.tsx');

  it('uses target="_top" so the link navigates the parent window not the iframe', () => {
    expect(src).toMatch(/target="_top"/);
  });

  it('uses rel="noopener" to prevent reverse-tabnabbing from the parent window', () => {
    expect(src).toMatch(/rel="noopener"/);
  });

  it('appends utm_source=embed + utm_medium=iframe + utm_campaign (when ref present)', () => {
    expect(src).toMatch(/utm_source.*embed/);
    expect(src).toMatch(/utm_medium.*iframe/);
    expect(src).toMatch(/utm_campaign/);
  });
});

describe('/embed/panchang/page.tsx source-level invariants', () => {
  const src = read('src/app/embed/panchang/page.tsx');

  it('wires all 4 query params (theme, size, locale, ref)', () => {
    expect(src).toMatch(/parseEmbedTheme/);
    expect(src).toMatch(/parseEmbedSize/);
    expect(src).toMatch(/parseEmbedLocale/);
    expect(src).toMatch(/parseEmbedRef/);
  });

  it('renders the AttributionFooter component (one per page path: data + error)', () => {
    const matches = src.match(/<AttributionFooter/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it('emits color-scheme meta for theme=auto support in the browser', () => {
    expect(src).toMatch(/color-scheme/);
  });

  it('still has robots: index=false so embeds do not compete with main pages', () => {
    expect(src).toMatch(/robots:\s*\{\s*index:\s*false/);
  });
});
