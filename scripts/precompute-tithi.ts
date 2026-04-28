#!/usr/bin/env npx tsx
/**
 * Pre-compute tithi tables for known cities to eliminate CPU-intensive
 * computation at runtime.
 *
 * Usage:
 *   npx tsx scripts/precompute-tithi.ts                  # all 55 cities × 3 years + 3 UTC
 *   npx tsx scripts/precompute-tithi.ts --year 2026      # all cities, one year
 *   npx tsx scripts/precompute-tithi.ts --city delhi      # one city, all years
 *   npx tsx scripts/precompute-tithi.ts --city delhi --year 2026  # one file
 */

import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { CITIES } from '../src/lib/constants/cities';
import { buildYearlyTithiTable, type YearlyTithiTable } from '../src/lib/calendar/tithi-table';

// ─── Parse CLI flags ───

const args = process.argv.slice(2);
function getFlag(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

const filterYear = getFlag('year') ? Number(getFlag('year')) : undefined;
const filterCity = getFlag('city');

const YEARS = filterYear ? [filterYear] : [2025, 2026, 2027];

// ─── Build job list ───

interface Job {
  slug: string;
  lat: number;
  lng: number;
  timezone: string;
  year: number;
}

const jobs: Job[] = [];

// City jobs
const cities = filterCity
  ? CITIES.filter(c => c.slug === filterCity)
  : CITIES;

if (filterCity && cities.length === 0) {
  console.error(`[ERROR] City slug "${filterCity}" not found in CITIES`);
  process.exit(1);
}

for (const city of cities) {
  for (const year of YEARS) {
    jobs.push({
      slug: city.slug,
      lat: city.lat,
      lng: city.lng,
      timezone: city.timezone,
      year,
    });
  }
}

// UTC jobs (used by eclipses.ts)
if (!filterCity) {
  for (const year of YEARS) {
    jobs.push({
      slug: 'utc',
      lat: 0,
      lng: 0,
      timezone: 'UTC',
      year,
    });
  }
}

const totalJobs = jobs.length;
console.log(`\nGenerating ${totalJobs} tithi table files...\n`);

// ─── Generate ───

const ROOT = join(process.cwd(), 'public', 'data', 'tithi-tables');

interface GeneratedFile {
  path: string;
  slug: string;
  year: number;
  entryCount: number;
}

const generated: GeneratedFile[] = [];
let failures = 0;

for (let i = 0; i < jobs.length; i++) {
  const job = jobs[i];
  const dir = join(ROOT, String(job.year));
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, `${job.slug}.json`);

  try {
    const table = buildYearlyTithiTable(job.year, job.lat, job.lng, job.timezone);
    writeFileSync(filePath, JSON.stringify(table), 'utf-8');
    console.log(`[${i + 1}/${totalJobs}] ${job.slug} ${job.year} — ${table.entries.length} entries`);
    generated.push({ path: filePath, slug: job.slug, year: job.year, entryCount: table.entries.length });
  } catch (err) {
    console.error(`[${i + 1}/${totalJobs}] FAILED ${job.slug} ${job.year}:`, err);
    failures++;
  }
}

// ─── Validation ───

console.log(`\n── Validation ──\n`);

let validationErrors = 0;

for (const file of generated) {
  const errors: string[] = [];

  // Check entry count 350-400
  if (file.entryCount < 350 || file.entryCount > 400) {
    errors.push(`Entry count ${file.entryCount} outside range 350-400`);
  }

  // Load and validate contents
  try {
    const data: YearlyTithiTable = JSON.parse(readFileSync(file.path, 'utf-8'));

    // Ekadashi count (tithi number 11 = Shukla Ekadashi, 26 = Krishna Ekadashi)
    const ekadashiCount = data.entries.filter(e => e.number === 11 || e.number === 26).length;
    if (ekadashiCount < 22 || ekadashiCount > 28) {
      errors.push(`Ekadashi count ${ekadashiCount} outside range 22-28`);
    }

    // Duration sanity
    const badDuration = data.entries.filter(e => e.durationHours <= 0 || e.durationHours > 60);
    if (badDuration.length > 0) {
      errors.push(`${badDuration.length} entries with invalid durationHours`);
    }
  } catch (err) {
    errors.push(`Failed to read/parse: ${err}`);
  }

  if (errors.length > 0) {
    console.error(`FAIL ${file.slug} ${file.year}: ${errors.join('; ')}`);
    validationErrors += errors.length;
  }
}

// ─── Summary ───

console.log(`\n── Summary ──`);
console.log(`Generated: ${generated.length}/${totalJobs}`);
console.log(`Failures:  ${failures}`);
console.log(`Validation errors: ${validationErrors}`);

if (failures > 0 || validationErrors > 0) {
  console.error('\nPre-computation finished with errors.');
  process.exit(1);
} else {
  console.log('\nAll files generated and validated successfully.');
}
