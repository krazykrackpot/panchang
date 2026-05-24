/**
 * Sprint 30 — Round 3 perf/DX close-out.
 *
 * R3-DX-1 — transit-alerts batched dedup SELECT
 * R3-DX-2 — weekly-digest batched profile + listUsers
 * R3-DX-3 — weekly-digest hoists festival calendar out of per-user loop
 * R3-DX-6 — @anthropic-ai/sdk in dependencies (not devDependencies)
 * R3-DX-7 — duplicate migration 032 documented (left intentionally)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('R3-DX-1 — transit-alerts batched + chunked dedup', () => {
  const src = read('src/app/api/cron/transit-alerts/route.ts');

  it('chunks the .in() SELECT to respect PostgREST URL limit (Gemini #168)', () => {
    expect(src).toMatch(/import \{ chunk \} from '@\/lib\/cron\/email-sent-anchor'/);
    expect(src).toMatch(/for \(const idChunk of chunk\(allUserIds, 100\)\)/);
    expect(src).toMatch(/\.in\('user_id', idChunk\)/);
    expect(src).toMatch(/existingPlanetsByUser = new Map<string, Set<number>>/);
  });

  it('per-user lookup uses the batched Map', () => {
    expect(src).toMatch(/existingPlanetsByUser\.get\(snap\.user_id\)/);
  });
});

describe('R3-DX-2 — weekly-digest batched + chunked profile + listUsers', () => {
  const src = read('src/app/api/cron/weekly-digest/route.ts');

  it('chunks the profiles .in() SELECT (Gemini #168)', () => {
    expect(src).toMatch(/for \(const idChunk of chunk\(userIds, 100\)\)/);
    expect(src).toMatch(/\.in\('id', idChunk\)/);
    expect(src).toMatch(/profileById = new Map<string, ProfileRow>/);
  });

  it('listUsers fails LOUD on authErr (Gemini #168 fix)', () => {
    expect(src).toMatch(/return NextResponse\.json\(\{ error: 'Auth service error' \}, \{ status: 500 \}\)/);
  });

  it('listUsers only stores requested user emails + early-exit (Gemini #168 fix)', () => {
    expect(src).toMatch(/const userIdsSet = new Set\(userIds\)/);
    expect(src).toMatch(/if \(u\.email && userIdsSet\.has\(u\.id\)\)/);
    expect(src).toMatch(/if \(emailById\.size >= userIdsSet\.size\) break/);
  });

  it('per-user lookup uses the batched Maps', () => {
    expect(src).toMatch(/profileById\.get\(snap\.user_id\)/);
    expect(src).toMatch(/emailById\.get\(snap\.user_id\)/);
  });
});

describe('R3-DX-3 — weekly-digest hoists festival calendar', () => {
  const src = read('src/app/api/cron/weekly-digest/route.ts');

  it('sharedFestEntries is computed once before the loop', () => {
    expect(src).toMatch(/let sharedFestEntries = generateFestivalCalendarV2/);
    expect(src).toMatch(/const sharedUpcomingFestivals = sharedFestEntries/);
  });

  it('handles Dec→Jan year boundary by fetching cutoffYear too (Gemini #168)', () => {
    expect(src).toMatch(/if \(cutoffYear !== cronYear\)/);
    expect(src).toMatch(/generateFestivalCalendarV2\(cutoffYear/);
  });
});

describe('R3-DX-6 — @anthropic-ai/sdk in dependencies', () => {
  const pkg = JSON.parse(read('package.json')) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  it('is listed in dependencies', () => {
    expect(pkg.dependencies['@anthropic-ai/sdk']).toBeDefined();
  });

  it('is NOT in devDependencies', () => {
    expect(pkg.devDependencies['@anthropic-ai/sdk']).toBeUndefined();
  });
});

describe('R3-DX-7 — duplicate migration 032 documented', () => {
  const src = read('supabase/migrations/032_self_chart_drop_onboarding_gate.sql');

  it('has explicit R3-DX-7 note explaining the deliberate non-rename', () => {
    expect(src).toMatch(/R3-DX-7/);
    expect(src).toMatch(/deliberately not renamed/);
  });
});
