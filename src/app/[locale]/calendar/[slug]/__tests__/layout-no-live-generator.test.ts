/**
 * Static regression guard for the /calendar/[slug] layout.
 *
 * Context (2026-06-24, sibling of PR #724):
 *   getNextFestivalDate (called inside generateMetadata) used to loop
 *   generateFestivalCalendarV2 up to 4 times per render — once per
 *   candidate year — running the full ~90ms/833MB live festival pass each
 *   time. Inside metadata, on every ISR refresh, that dominated the
 *   /calendar/[slug] route's CPU cost (~108 invocations/day, 1m CPU/day
 *   per Vercel observability). Replaced with getFestivalForCity (Ujjain
 *   blob), same precompute reader as the /festivals/[slug]/[year] page.
 *
 *   This test pins the fix: the layout must NOT import the live festival
 *   generator. If it reappears in the import list, somebody has
 *   reintroduced the hot path inside metadata.
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

describe('calendar/[slug] layout — no live festival generator in metadata', () => {
  const source = readFileSync(LAYOUT_PATH, 'utf-8');

  // We only check IMPORT statements — the PERF doc comment in the layout
  // intentionally references the dropped symbol by name to explain WHY it's
  // gone, so a call-site/textual check would false-positive on the comment.
  // A re-introduced live call is impossible without first re-importing.
  //
  // Regex design (mirrors the /festivals/[slug]/[year] guard pinned by
  // Gemini PR #724 rounds 1 + 2):
  //   - `^[ \t]*import\s+` — anchored to the start of a line (allowing
  //     leading whitespace, so indented imports inside conditional blocks
  //     would still match). Prevents a hypothetical comment like
  //     "// import generateFestivalCalendarV2 was removed" from
  //     false-positiving the guard.
  //   - `[^;]*\bSYMBOL\b` — matches across newlines up to the terminating
  //     semicolon, so multiline imports like
  //       import {
  //         generateFestivalCalendarV2,
  //       } from '...';
  //     are also caught. A character class `[^;]` matches newlines, unlike
  //     `.` which doesn't without /s.
  //   - `/m` — makes `^` match each line start, not just file start.
  it('does NOT import generateFestivalCalendarV2', () => {
    expect(source).not.toMatch(/^[ \t]*import\s+[^;]*\bgenerateFestivalCalendarV2\b/m);
  });

  it('DOES import getFestivalForCity from the precompute reader', () => {
    expect(source).toMatch(/getFestivalForCity/);
    expect(source).toMatch(/@\/lib\/precompute\/festivals-year-page-model/);
  });
});
