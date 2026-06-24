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
  //
  // Regex design:
  //   - `^[ \t]*import\s+` — anchored to the start of a line (allowing
  //     leading whitespace, so indented imports inside conditional blocks
  //     would still match). Prevents a hypothetical comment like
  //     "// import generateFestivalCalendarV2 was removed" from
  //     false-positiving the guard (Gemini PR #724 round 2 MED).
  //   - `[^;]*\bSYMBOL\b` — matches across newlines up to the terminating
  //     semicolon, so multiline imports like
  //       import {
  //         generateFestivalCalendarV2,
  //       } from '...';
  //     are also caught (Gemini PR #724 round 1 MED). A character class
  //     `[^;]` matches newlines, unlike `.` which doesn't without /s.
  //   - `/m` — makes `^` match each line start, not just file start.
  it('does NOT import generateFestivalCalendarV2', () => {
    expect(source).not.toMatch(/^[ \t]*import\s+[^;]*\bgenerateFestivalCalendarV2\b/m);
  });

  it('does NOT import clearTithiTableCache (no longer needed without the live call)', () => {
    expect(source).not.toMatch(/^[ \t]*import\s+[^;]*\bclearTithiTableCache\b/m);
  });

  it('DOES import getFestivalForCity from the precompute reader', () => {
    expect(source).toMatch(/getFestivalForCity/);
    expect(source).toMatch(/@\/lib\/precompute\/festivals-year-page-model/);
  });
});
