/**
 * Sprint 11 — P1-45 tl() bypass migration regression guard.
 *
 * The five priority files named in the 2026-05-23 audit must NOT contain
 * any direct trilingual-object access via `obj.X[locale]`. All such reads
 * must go through `tl(obj.X, locale)` so that locales missing from the
 * underlying constant fall back to English instead of rendering `undefined`.
 *
 * Allowed exceptions (locked in by name):
 *   - `LABELS[locale]` (whole dict keyed by locale; `LABELS.en` fallback inline)
 *   - identifier `locale` is allowed anywhere outside of `[locale]` subscript
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PRIORITY_FILES = [
  'src/app/[locale]/calendar/Client.tsx',
  'src/app/[locale]/dashboard/page.tsx',
  'src/app/[locale]/prashna/page.tsx',
  'src/app/[locale]/learn/tithis/page.tsx',
  'src/app/[locale]/transits/graphic/page.tsx',
];

// The only `[locale]` subscript we allow is the LABELS-dict pattern:
//   const X = LABELS[locale] || LABELS.en;     // bootstrap a per-locale subdict
//   const X = MESSAGES[locale] || MESSAGES.en; // same shape
// Anything else (e.g. `foo.bar[locale]`, `foo.bar?.[locale]`, `arr[i][locale]`)
// must use tl(...).
// Allowed: `const X = LABELS[locale] || LABELS.en;` (dict-by-locale bootstrap).
// `\1` references the captured dict name so we don't accept mismatched pairs.
const ALLOWED_LINE = /\b(LABELS|MESSAGES|MSG)\[locale\]\s*\|\|\s*\1\.en/;

describe('Sprint 11 — P1-45 priority files use tl() for trilingual access', () => {
  for (const rel of PRIORITY_FILES) {
    it(`${rel} has no direct \`X[locale]\` trilingual bypass`, () => {
      const src = readFileSync(join(process.cwd(), rel), 'utf8');
      const offenders: { line: number; text: string }[] = [];
      src.split('\n').forEach((line, i) => {
        if (!line.includes('[locale]')) return;
        // Allow the LABELS dict bootstrap.
        if (ALLOWED_LINE.test(line)) return;
        // Allow lines that don't actually do a property access into a locale
        // key — e.g. type annotations like `Record<Locale, string>[locale]`
        // don't appear in these files; flag everything that DOES `[locale]`.
        offenders.push({ line: i + 1, text: line.trim().slice(0, 120) });
      });
      expect(
        offenders,
        `Found ${offenders.length} trilingual-bypass site(s) in ${rel}:\n` +
          offenders.map((o) => `  L${o.line}: ${o.text}`).join('\n'),
      ).toEqual([]);
    });
  }

  it('the five priority files each import tl from @/lib/utils/trilingual', () => {
    for (const rel of PRIORITY_FILES) {
      const src = readFileSync(join(process.cwd(), rel), 'utf8');
      expect(src, `${rel} missing tl import`).toMatch(
        /from\s+['"]@\/lib\/utils\/trilingual['"]/,
      );
    }
  });
});
