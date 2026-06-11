#!/usr/bin/env npx tsx
/**
 * Audit hand-coded festival dates in /[locale]/calendar/regional/<region>/page.tsx
 * against what festival-generator.ts actually computes for those (festival,
 * year, location) tuples.
 *
 * Background (2026-06-10):
 *   GSC URL Inspection on /en/calendar/regional/bengali surfaced FAQ
 *   schema with internally-inconsistent dates ("Mahalaya falls on Sat 3
 *   Oct, Shashti on Tue 13 Oct" — but Mahalaya → Shashti is only ~6
 *   tithis, not 10 days). Investigation showed every hand-coded
 *   FESTIVAL_DATES_2026 / FESTIVAL_DATES_2027 entry in bengali/page.tsx
 *   was off by 3-7 days versus the engine. Other regional calendars
 *   likely have the same drift.
 *
 *   This auditor extracts every hand-coded `date: 'Wed, 14 Apr 2026'`
 *   line from the regional page templates and looks each one up in
 *   the engine, reporting the diff.
 *
 *   It does NOT auto-fix — output is a TSV the maintainer can use to
 *   drive a precise edit (or transcribe into a generator-driven
 *   build step in a follow-up).
 *
 * Usage:
 *   npx tsx scripts/audit-regional-calendar-dates.ts
 *
 * Output columns:
 *   region\tyear\tname\tpage_date\tengine_date\tstatus
 *
 * status:
 *   OK             — page date matches engine for at least one festival
 *                    name match
 *   DRIFT          — page date != engine date (engine has a different
 *                    date for this name)
 *   NO_ENGINE_HIT  — engine produced no festival with this name in
 *                    the given year — page entry may reference a
 *                    festival the generator doesn't know
 *   AMBIG          — multiple engine matches, none equal page date
 */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { generateFestivalCalendarV2 } from '../src/lib/calendar/festival-generator';

const ROOT = join(__dirname, '..');
const REGIONS_DIR = join(ROOT, 'src/app/[locale]/calendar/regional');

// Kolkata coordinates (Bengali calendar reference).
const KOLKATA_LAT = 22.5726;
const KOLKATA_LNG = 88.3639;
const IST = 'Asia/Kolkata';

interface PageEntry {
  region: string;
  rawLine: string;
  enName: string;
  date: string; // raw page string e.g. "Tue, 13 Oct 2026"
  year: number;
}

interface EngineEntry {
  date: string;     // ISO YYYY-MM-DD
  name: string;     // engine canonical en name
  displayDate: string; // e.g. "Tue, 13 Oct 2026"
}

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function isoToPageDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  const dow = DAYS_SHORT[d.getUTCDay()];
  const month = MONTHS_SHORT[d.getUTCMonth()];
  return `${dow}, ${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
}

/**
 * Loose normalization for matching page-side `en` names to engine
 * `name.en`. Lowercases, strips parens content, collapses whitespace,
 * removes diacritics & punctuation. Two names match if their tokens
 * overlap by ≥60% and the shorter is ≥3 chars after normalization.
 */
function normaliseName(s: string): string {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(s: string): Set<string> {
  return new Set(normaliseName(s).split(/\s+/).filter((t) => t.length > 2));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return inter / union;
}

async function extractPageEntries(region: string, filePath: string): Promise<PageEntry[]> {
  const src = await fs.readFile(filePath, 'utf-8');
  const entries: PageEntry[] = [];
  // Match lines like:
  //   { en: 'Foo Festival (variant)', hi: '…', bn: '…', date: 'Wed, 14 Apr 2026', tithi: '…', nakshatra: '…' },
  // Each entry is on one line in the source.
  const re = /\{\s*en:\s*'([^']+)',[^}]*?date:\s*'([A-Z][a-z]{2}, \d{1,2} [A-Z][a-z]{2} (\d{4}))'/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    entries.push({
      region,
      rawLine: m[0],
      enName: m[1],
      date: m[2],
      year: Number(m[3]),
    });
  }
  return entries;
}

function engineEntriesForYear(year: number): EngineEntry[] {
  const cal = generateFestivalCalendarV2(year, KOLKATA_LAT, KOLKATA_LNG, IST);
  const out: EngineEntry[] = [];
  for (const f of cal) {
    const en = f.name?.en ?? '';
    if (!en) continue;
    out.push({
      date: f.date,
      name: en,
      displayDate: isoToPageDate(f.date),
    });
  }
  return out;
}

function findBestEngineMatch(
  pageEntry: PageEntry,
  engineEntries: EngineEntry[],
): { match: EngineEntry | null; score: number; allMatches: EngineEntry[] } {
  const pageTokens = tokens(pageEntry.enName);
  let best: { entry: EngineEntry; score: number } | null = null;
  const allMatches: EngineEntry[] = [];

  for (const e of engineEntries) {
    const score = jaccard(pageTokens, tokens(e.name));
    if (score >= 0.6) allMatches.push(e);
    if (!best || score > best.score) best = { entry: e, score };
  }
  return {
    match: best && best.score >= 0.6 ? best.entry : null,
    score: best?.score ?? 0,
    allMatches,
  };
}

async function main() {
  const regions = await fs.readdir(REGIONS_DIR);
  const results: Array<{
    region: string;
    year: number;
    name: string;
    pageDate: string;
    engineDate: string;
    status: 'OK' | 'DRIFT' | 'NO_ENGINE_HIT' | 'AMBIG';
  }> = [];

  const enginePerYear = new Map<number, EngineEntry[]>();

  for (const region of regions) {
    const filePath = join(REGIONS_DIR, region, 'page.tsx');
    try {
      await fs.access(filePath);
    } catch {
      continue;
    }
    const pageEntries = await extractPageEntries(region, filePath);
    if (pageEntries.length === 0) continue;

    for (const pe of pageEntries) {
      let engine = enginePerYear.get(pe.year);
      if (!engine) {
        engine = engineEntriesForYear(pe.year);
        enginePerYear.set(pe.year, engine);
      }
      const { match, allMatches } = findBestEngineMatch(pe, engine);

      let status: 'OK' | 'DRIFT' | 'NO_ENGINE_HIT' | 'AMBIG';
      let engineDate = '';
      if (!match) {
        status = 'NO_ENGINE_HIT';
      } else if (allMatches.some((m) => m.displayDate === pe.date)) {
        status = 'OK';
        engineDate = pe.date;
      } else if (allMatches.length > 1) {
        status = 'AMBIG';
        engineDate = allMatches.map((m) => `${m.displayDate} (${m.name})`).join(' | ');
      } else {
        status = 'DRIFT';
        engineDate = `${match.displayDate} (${match.name})`;
      }

      results.push({
        region,
        year: pe.year,
        name: pe.enName,
        pageDate: pe.date,
        engineDate,
        status,
      });
    }
  }

  // TSV output
  console.log(['region','year','name','page_date','engine_date','status'].join('\t'));
  for (const r of results) {
    console.log([r.region, r.year, r.name, r.pageDate, r.engineDate, r.status].join('\t'));
  }

  // Summary
  const byStatus = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  console.error('');
  console.error(`Total entries audited: ${results.length}`);
  for (const k of Object.keys(byStatus).sort()) {
    console.error(`  ${k}: ${byStatus[k]}`);
  }
  const broken = results.filter((r) => r.status === 'DRIFT' || r.status === 'NO_ENGINE_HIT');
  if (broken.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
