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

describe('R3-DX-1 — transit-alerts batched dedup', () => {
  const src = read('src/app/api/cron/transit-alerts/route.ts');

  it('builds a single .in(allUserIds) SELECT before the loop', () => {
    expect(src).toMatch(/\.in\('user_id', allUserIds\)/);
    expect(src).toMatch(/existingPlanetsByUser = new Map<string, Set<number>>/);
  });

  it('per-user lookup uses the batched Map (no per-user SELECT)', () => {
    expect(src).toMatch(/existingPlanetsByUser\.get\(snap\.user_id\)/);
    // The previous per-user `.eq('user_id', snap.user_id).eq('type', 'transit_alert')` block is gone.
    expect(src).not.toMatch(/\.eq\('user_id', snap\.user_id\)\s*\n\s*\.eq\('type', 'transit_alert'\)/);
  });
});

describe('R3-DX-2 — weekly-digest batched profile + listUsers', () => {
  const src = read('src/app/api/cron/weekly-digest/route.ts');

  it('builds a single .in(userIds) profiles SELECT before the loop', () => {
    expect(src).toMatch(/\.in\('id', userIds\)/);
    expect(src).toMatch(/profileById = new Map<string, ProfileRow>/);
  });

  it('uses paginated admin.listUsers (not per-user getUserById)', () => {
    expect(src).toMatch(/supabase\.auth\.admin\.listUsers\(\{ page, perPage \}\)/);
    expect(src).toMatch(/emailById = new Map<string, string>/);
  });

  it('per-user lookup uses the batched Maps', () => {
    expect(src).toMatch(/profileById\.get\(snap\.user_id\)/);
    expect(src).toMatch(/emailById\.get\(snap\.user_id\)/);
  });
});

describe('R3-DX-3 — weekly-digest hoists festival calendar', () => {
  const src = read('src/app/api/cron/weekly-digest/route.ts');

  it('sharedFestEntries is computed once before the loop', () => {
    expect(src).toMatch(/const sharedFestEntries = generateFestivalCalendarV2/);
    expect(src).toMatch(/const sharedUpcomingFestivals = sharedFestEntries/);
  });

  it('the previous per-user generateFestivalCalendarV2 call inside the loop is gone', () => {
    // Strip comments so the audit text reference doesn't fire a false positive.
    const codeOnly = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const occurrences = codeOnly.match(/generateFestivalCalendarV2\(/g) ?? [];
    expect(occurrences.length).toBe(1);
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
