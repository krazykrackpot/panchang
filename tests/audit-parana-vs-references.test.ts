/**
 * Integration test for the parana cross-reference audit script.
 *
 * Runs the actual script as a subprocess against a synthetic fixture
 * that pins a known engine-vs-reference mismatch we care about
 * (currently: date-suffix drift — the HIGH finding from Gemini PR #636
 * review). If the script's HH:MM-only comparison ever regresses,
 * this test fails.
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const REPO_ROOT = path.resolve(__dirname, '..');
const FIXTURE_PATH = path.join(REPO_ROOT, 'src/lib/calendar/__fixtures__/parana-drik-references.json');

function runAuditAgainstFixture(fixtureContent: object): { exitCode: number; stdout: string } {
  // Back up real fixture, write synthetic one, run, restore.
  const backup = fs.readFileSync(FIXTURE_PATH, 'utf8');
  try {
    fs.writeFileSync(FIXTURE_PATH, JSON.stringify(fixtureContent, null, 2));
    const proc = spawnSync('npx', ['tsx', 'scripts/audit-parana-vs-references.ts'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: { ...process.env, FORCE_COLOR: '0' },
    });
    return { exitCode: proc.status ?? -1, stdout: proc.stdout + proc.stderr };
  } finally {
    fs.writeFileSync(FIXTURE_PATH, backup);
  }
}

describe('audit-parana-vs-references (HIGH regression: date-suffix drift)', () => {
  it('FAILS when the actual paranaDwadashiEnd has a date suffix the expected lacks', () => {
    // Construct a case where the engine would naturally emit a cross-day
    // suffix (e.g. "07:06, Jun 13") but the reference expects same-day
    // "07:06". The naive HH:MM-only comparison would return 0m drift
    // and silently pass — this test pins the fix.
    //
    // We don't need a city that ACTUALLY produces a cross-day suffix;
    // we set `expected.paranaDwadashiEnd` to a time the engine cannot
    // emit with the wrong day. The test asserts the comparator catches
    // a date-suffix mismatch when it occurs.
    //
    // Mechanism: pick Seattle Parama (engine emits "07:07" no suffix).
    // Set expected to "07:07, Jun 13" (suffix). Naive HH:MM-only logic
    // would parse both to 427 → 0m drift → pass. The fix returns 24h
    // → exit 1.
    const fixture = {
      tolerance_minutes: 2,
      cases: [
        {
          label: 'Synthetic date-suffix drift case',
          festival_pattern: 'parama',
          year: 2026,
          month: 6,
          city: 'Seattle',
          lat: 47.6062,
          lon: -122.3321,
          timezone: 'America/Los_Angeles',
          expected: {
            paranaDate: '2026-06-12',
            paranaDwadashiEnd: '07:07, Jun 13', // ← suffix the engine does NOT emit
          },
          source: 'SYNTHETIC TEST FIXTURE — exercises the date-suffix drift regression check',
        },
      ],
    };
    const { exitCode, stdout } = runAuditAgainstFixture(fixture);
    expect(exitCode).toBe(1);
    expect(stdout).toMatch(/FAIL.*paranaDwadashiEnd/);
    // Should also report 24h drift (1440m), not 0m
    expect(stdout).toMatch(/1440m drift/);
  }, 120000);

  it('PASSES the curated Seattle case (sanity / smoke)', () => {
    const real = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
    const { exitCode, stdout } = runAuditAgainstFixture(real);
    expect(exitCode).toBe(0);
    expect(stdout).toMatch(/all \d+ checks within/);
  }, 120000);
});
