#!/usr/bin/env tsx
/**
 * Cross-reference parana audit.
 *
 * Runs `generateFestivalCalendarV2()` against the curated Drik Panchang
 * golden fixture at src/lib/calendar/__fixtures__/parana-drik-references.json
 * and fails (exit 1) if any computed value drifts beyond the
 * `tolerance_minutes` window.
 *
 * Rationale (2026-06-09 incident): Seattle Parama Ekadashi rendered
 * parana 15:21–21:06 instead of Drik's 05:11–07:06 — a 12-hour off
 * from a UT day-wrap heuristic that worked for Delhi but mis-routed
 * Western-hemisphere cities. CLAUDE.md Definition of Done point 5
 * already required Prokerala/Drik spot-checks; this script makes that
 * check executable. Pre-commit hook invokes it when files under
 * src/lib/calendar/ or src/lib/ephem/ are touched.
 *
 * Adding a new case:
 *   1. Look up Drik values for a city+festival+year.
 *   2. Add a row to parana-drik-references.json with the verbatim
 *      times and a `source` line citing the Drik URL / screenshot.
 *   3. Run `npx tsx scripts/audit-parana-vs-references.ts` to
 *      confirm the engine matches before committing.
 *
 * Usage:
 *   npx tsx scripts/audit-parana-vs-references.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { generateFestivalCalendarV2 } from '../src/lib/calendar/festival-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const FIXTURE_PATH = path.join(REPO_ROOT, 'src/lib/calendar/__fixtures__/parana-drik-references.json');

interface ParanaCase {
  label: string;
  festival_pattern: string;
  year: number;
  month?: number;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
  expected: {
    paranaDate?: string;
    paranaStart?: string;
    paranaEnd?: string;
    paranaSunrise?: string;
    paranaDwadashiEnd?: string;
    paranaHariVasaraEnd?: string;
  };
  source: string;
}

interface Fixture {
  tolerance_minutes: number;
  cases: ParanaCase[];
}

function parseTimeToMin(s: string | undefined): number | null {
  if (!s) return null;
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function diffMin(actual: string | undefined, expected: string | undefined): number | null {
  const a = parseTimeToMin(actual);
  const e = parseTimeToMin(expected);
  if (a === null || e === null) return null;
  // Wrap-aware: a difference > 12 h means we crossed midnight; choose the smaller arc.
  let diff = Math.abs(a - e);
  if (diff > 12 * 60) diff = 24 * 60 - diff;
  return diff;
}

const RED = process.stdout.isTTY ? '\x1b[31m' : '';
const GREEN = process.stdout.isTTY ? '\x1b[32m' : '';
const YELLOW = process.stdout.isTTY ? '\x1b[33m' : '';
const RESET = process.stdout.isTTY ? '\x1b[0m' : '';

const fixture: Fixture = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
const tol = fixture.tolerance_minutes;

let totalChecks = 0;
let failures = 0;
const failedLabels: string[] = [];

for (const c of fixture.cases) {
  console.log(`\n• ${c.label}  (${c.city}, ${c.timezone})`);
  const all = generateFestivalCalendarV2(c.year, c.lat, c.lon, c.timezone);
  const monthFilter = c.month ? new RegExp(`^${c.year}-${c.month.toString().padStart(2, '0')}`) : new RegExp(`^${c.year}-`);
  const match = all.find(f => {
    const n = (f.name?.en ?? '').toLowerCase();
    return n.includes(c.festival_pattern.toLowerCase()) && monthFilter.test(f.date ?? '');
  }) as unknown as Record<string, string | undefined> | undefined;

  if (!match) {
    console.log(`  ${RED}MISS${RESET} — no festival matching "${c.festival_pattern}" in ${c.year}${c.month ? `-${c.month}` : ''}`);
    failures++;
    failedLabels.push(c.label);
    continue;
  }

  for (const [key, expected] of Object.entries(c.expected)) {
    if (!expected) continue;
    totalChecks++;
    const actual = match[key];
    if (key === 'paranaDate') {
      // exact match for dates
      const pass = actual === expected;
      console.log(`  ${pass ? GREEN + 'OK  ' + RESET : RED + 'FAIL' + RESET} ${key}: actual=${actual}  expected=${expected}`);
      if (!pass) { failures++; failedLabels.push(`${c.label} → ${key}`); }
    } else {
      const drift = diffMin(actual, expected);
      const pass = drift !== null && drift <= tol;
      const driftStr = drift === null ? '(unparseable)' : `${drift}m drift`;
      console.log(`  ${pass ? GREEN + 'OK  ' + RESET : RED + 'FAIL' + RESET} ${key}: actual=${actual ?? '∅'}  expected=${expected}  (${driftStr})`);
      if (!pass) { failures++; failedLabels.push(`${c.label} → ${key}`); }
    }
  }
  console.log(`  ${YELLOW}source${RESET}: ${c.source}`);
}

console.log('\n══════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log(`${GREEN}✓ all ${totalChecks} checks within ±${tol}m of Drik reference${RESET}`);
  process.exit(0);
} else {
  console.log(`${RED}✗ ${failures} drift / miss out of ${totalChecks} checks (tolerance ±${tol}m)${RESET}`);
  for (const l of failedLabels) console.log(`  - ${l}`);
  console.log();
  console.log(`If the drift is real and a regression — fix the engine and re-run.`);
  console.log(`If the Drik reference itself changed (rare — different ayanamsha epoch) — update`);
  console.log(`  src/lib/calendar/__fixtures__/parana-drik-references.json with a new ${YELLOW}source${RESET} citation.`);
  console.log(`Bypass (last resort, document why): git commit --no-verify`);
  process.exit(1);
}
