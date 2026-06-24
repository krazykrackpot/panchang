/**
 * Static regression guard for the festival year layout.
 *
 * Context (2026-06-24):
 *   generateMetadata used to call generateFestivalCalendarV2 live on every
 *   render. With 1.7K ISR refreshes/day that was ~2-3h CPU/day on this
 *   single route (Vercel observability, top cost driver after the muhurta
 *   and festival/city 308 sweeps). Replaced with getFestivalForCity, which
 *   reads from the Vercel Blob precompute the page body already uses.
 *
 *   This test pins the fix: the layout must NOT import the live festival
 *   generator OR clearTithiTableCache. Either symbol reappearing means
 *   somebody has reintroduced the hot path inside metadata.
 *
 *   If the live import legitimately has to come back (e.g. the precompute
 *   pipeline is retired), delete this test in the same commit and explain
 *   the rationale in the commit message.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

const LAYOUT_PATH = join(
  __dirname,
  '..',
  'layout.tsx',
);

describe('festivals/[slug]/[year] layout — no live festival generator in metadata', () => {
  const source = readFileSync(LAYOUT_PATH, 'utf-8');

  // We only check IMPORT statements — the PERF doc comment in the layout
  // intentionally references these symbols by name to explain WHY they're
  // gone, so a call-site/textual check would false-positive on the comment.
  // A re-introduced live call is impossible without first re-importing.
  it('does NOT import generateFestivalCalendarV2', () => {
    expect(source).not.toMatch(/^import\b.*\bgenerateFestivalCalendarV2\b/m);
  });

  it('does NOT import clearTithiTableCache (no longer needed without the live call)', () => {
    expect(source).not.toMatch(/^import\b.*\bclearTithiTableCache\b/m);
  });

  it('DOES import getFestivalForCity from the precompute reader', () => {
    expect(source).toMatch(/getFestivalForCity/);
    expect(source).toMatch(/@\/lib\/precompute\/festivals-year-page-model/);
  });
});
