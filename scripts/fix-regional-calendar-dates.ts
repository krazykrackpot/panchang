#!/usr/bin/env npx tsx
/**
 * Auto-fix hand-coded festival dates in
 * /[locale]/calendar/regional/<region>/page.tsx against
 * festival-generator.ts (the engine).
 *
 * For each hand-coded festival entry:
 *   - If the engine has a clear match (loose token match + ≤30-day
 *     proximity), rewrite the `date: '...'` field to the engine's
 *     date.
 *   - If the engine has no match within the proximity window, the
 *     entry is REMOVED from the source (the line is commented out
 *     with a `// FIXME: festival not in engine; verify and re-add`
 *     marker so the data isn't lost but the page doesn't render the
 *     unverified date).
 *
 * Background: 2026-06-10 audit of /en/calendar/regional/bengali surfaced
 * an internally-inconsistent FAQ schema (Mahalaya Oct 3 + Shashti
 * Oct 13 — impossible since Mahalaya → Shashti is ~6 tithis). The
 * audit found 115/146 hand-coded date entries had drifted from the
 * engine across all 9 regional pages.
 *
 * Run:
 *   npx tsx scripts/fix-regional-calendar-dates.ts          # dry-run report
 *   npx tsx scripts/fix-regional-calendar-dates.ts --apply  # rewrite files
 */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { generateFestivalCalendarV2 } from '../src/lib/calendar/festival-generator';

const ROOT = join(__dirname, '..');
const REGIONS_DIR = join(ROOT, 'src/app/[locale]/calendar/regional');
const KOLKATA_LAT = 22.5726;
const KOLKATA_LNG = 88.3639;
const IST = 'Asia/Kolkata';

const APPLY = process.argv.includes('--apply');

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function isoToPageDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return `${DAYS_SHORT[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
function pageDateToIso(pd: string): string | null {
  // "Tue, 13 Oct 2026" → "2026-10-13"
  const m = pd.match(/^[A-Z][a-z]{2}, (\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = MONTHS_SHORT.indexOf(m[2]) + 1;
  if (month <= 0) return null;
  return `${m[3]}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}
function dayDelta(isoA: string, isoB: string): number {
  const a = Date.UTC(Number(isoA.slice(0,4)), Number(isoA.slice(5,7))-1, Number(isoA.slice(8,10)));
  const b = Date.UTC(Number(isoB.slice(0,4)), Number(isoB.slice(5,7))-1, Number(isoB.slice(8,10)));
  return Math.round((a - b) / 86_400_000);
}

function normaliseTokens(s: string): Set<string> {
  // Strip paren brackets but KEEP their content — "Deepavali (Kerala)"
  // tokens to {deepavali, kerala}, not just {deepavali}, so engine's
  // "Deepavali (Kerala)" won't strict-match a page entry that just says
  // "Deepavali" (Tamil tradition vs Kerala tradition).
  return new Set(
    s.toLowerCase()
      .replace(/[()]/g, ' ')
      .replace(/[^\p{L}\p{N}\s/-]/gu, ' ')
      .replace(/[/-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2),
  );
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

interface EngineEntry { date: string; name: string; displayDate: string; }
function engineForYear(year: number): EngineEntry[] {
  const cal = generateFestivalCalendarV2(year, KOLKATA_LAT, KOLKATA_LNG, IST);
  return cal
    .filter((f) => f.name?.en)
    .map((f) => ({ date: f.date, name: f.name!.en, displayDate: isoToPageDate(f.date) }));
}

function sameTokenSet(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

/**
 * STRICT match — only REWRITE when:
 *   1. Normalised page tokens EQUAL normalised engine tokens (set
 *      equality, parens stripped). Catches "Durga Puja (Shashti)" /
 *      "Durga Puja Shashti", "Vijaya Dashami (Bisarjan)" /
 *      "Vijaya Dashami". Skips conflations like "Deepavali" (page)
 *      vs "Deepavali (Kerala)" (engine) where engine adds a
 *      tradition qualifier the page didn't ask for.
 *   2. Date diff ≤ 14 days. Filters same-name-different-festival
 *      conflations (e.g. Tamil Saraswati Puja in Oct vs canonical
 *      Magha Saraswati Puja in Jan).
 *
 * Everything else gets commented out — better to drop a row than
 * ship a confidently-wrong date.
 */
function findEngineMatch(
  pageName: string,
  pageIsoDate: string,
  engine: EngineEntry[],
): EngineEntry | null {
  const pageTokens = normaliseTokens(pageName);
  let best: { e: EngineEntry; days: number } | null = null;
  for (const e of engine) {
    if (!sameTokenSet(pageTokens, normaliseTokens(e.name))) continue;
    const days = Math.abs(dayDelta(e.date, pageIsoDate));
    if (days > 14) continue;
    if (!best || days < best.days) best = { e, days };
  }
  return best?.e ?? null;
}

interface FixReport {
  region: string;
  year: number;
  name: string;
  pageDate: string;
  action: 'KEEP' | 'REWRITE' | 'COMMENT_OUT';
  engineDate?: string;
  engineName?: string;
}

async function processRegion(region: string): Promise<{ src: string; reports: FixReport[]; changed: boolean }> {
  const filePath = join(REGIONS_DIR, region, 'page.tsx');
  let src: string;
  try {
    src = await fs.readFile(filePath, 'utf-8');
  } catch {
    return { src: '', reports: [], changed: false };
  }

  const reports: FixReport[] = [];
  const enginePerYear = new Map<number, EngineEntry[]>();

  // Match each festival entry line. The page convention is a single-line
  // object literal `{ en: 'Foo', hi: '…', bn: '…', date: 'Tue, 13 Oct 2026', … },`
  // The entry is the whole line including any leading whitespace.
  const lineRe = /^(\s*)(\{\s*en:\s*'([^']+)'[^}]*?date:\s*'([A-Z][a-z]{2}, \d{1,2} [A-Z][a-z]{2} (\d{4}))'[^}]*\},?)\s*$/gm;

  const replacements: Array<{ start: number; end: number; replacement: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(src)) !== null) {
    const fullLine = m[0];
    const indent = m[1];
    const entryBody = m[2];
    const enName = m[3];
    const pageDate = m[4];
    const year = Number(m[5]);

    const pageIsoDate = pageDateToIso(pageDate);
    if (!pageIsoDate) continue;

    let engine = enginePerYear.get(year);
    if (!engine) {
      engine = engineForYear(year);
      enginePerYear.set(year, engine);
    }
    const match = findEngineMatch(enName, pageIsoDate, engine);

    if (!match) {
      reports.push({ region, year, name: enName, pageDate, action: 'COMMENT_OUT' });
      // Comment the entry out with a FIXME marker. Keep the data for future
      // repair but don't render an unverified date.
      const commentedLine = `${indent}// FIXME (2026-06-10): festival not found in engine — verify and either restore with engine-confirmed date or remove\n${indent}// ${entryBody}`;
      replacements.push({ start: m.index, end: m.index + fullLine.length, replacement: commentedLine });
      continue;
    }
    if (match.displayDate === pageDate) {
      reports.push({ region, year, name: enName, pageDate, action: 'KEEP', engineDate: match.displayDate, engineName: match.name });
      continue;
    }
    // DRIFT → rewrite the date field in place
    reports.push({ region, year, name: enName, pageDate, action: 'REWRITE', engineDate: match.displayDate, engineName: match.name });
    const newEntry = entryBody.replace(
      `date: '${pageDate}'`,
      `date: '${match.displayDate}'`,
    );
    replacements.push({ start: m.index, end: m.index + fullLine.length, replacement: `${indent}${newEntry}` });
  }

  // Apply replacements in reverse order so indexes don't shift.
  replacements.sort((a, b) => b.start - a.start);
  for (const r of replacements) {
    src = src.slice(0, r.start) + r.replacement + src.slice(r.end);
  }
  return { src, reports, changed: replacements.length > 0 };
}

async function main() {
  const regions = await fs.readdir(REGIONS_DIR);
  const counts: Record<string, number> = { KEEP: 0, REWRITE: 0, COMMENT_OUT: 0 };

  for (const region of regions.sort()) {
    const filePath = join(REGIONS_DIR, region, 'page.tsx');
    try { await fs.access(filePath); } catch { continue; }
    const { src, reports, changed } = await processRegion(region);
    if (reports.length === 0) continue;

    const local = { KEEP: 0, REWRITE: 0, COMMENT_OUT: 0 };
    for (const r of reports) {
      local[r.action]++;
      counts[r.action]++;
    }
    console.log(`\n=== ${region} ===  KEEP=${local.KEEP} REWRITE=${local.REWRITE} COMMENT_OUT=${local.COMMENT_OUT}`);
    for (const r of reports) {
      if (r.action === 'KEEP') continue;
      if (r.action === 'REWRITE') {
        console.log(`  ${r.year} REWRITE  ${r.name}`);
        console.log(`           ${r.pageDate}  →  ${r.engineDate} (${r.engineName})`);
      } else {
        console.log(`  ${r.year} COMMENT  ${r.name} (${r.pageDate}) — no engine match`);
      }
    }
    if (APPLY && changed) {
      await fs.writeFile(filePath, src, 'utf-8');
      console.log(`  wrote ${filePath}`);
    }
  }

  console.log('');
  console.log(`Totals: KEEP=${counts.KEEP} REWRITE=${counts.REWRITE} COMMENT_OUT=${counts.COMMENT_OUT}`);
  if (!APPLY) {
    console.log('\n(dry-run — pass --apply to rewrite files)');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
