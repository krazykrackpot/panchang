#!/usr/bin/env tsx
/**
 * Sprint 7 — shorten overlong bilingual titles by trimming the EN suffix
 * (which is concatenated into every locale's `<Script> | <EN>` title).
 *
 * For each target route in `SHORTENINGS`:
 *  1. Update title.en to the new short form.
 *  2. For every other locale, find the old EN suffix and swap it for the
 *     new one. If the locale value doesn't contain the old EN as a
 *     substring, leave it (separate sprint will handle locale-side
 *     trimming).
 *
 * Idempotent (re-running with the same SHORTENINGS dict is a no-op).
 *
 * Usage:
 *   npx tsx scripts/sprint7-shorten-titles.ts              # dry-run
 *   npx tsx scripts/sprint7-shorten-titles.ts --apply
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

interface Shortening {
  /** Existing PAGE_META[route].title.en value (exact match). */
  oldEn: string;
  /** New EN suffix. ~40-50 chars for SERP comfort. */
  newEn: string;
}

const SHORTENINGS: Record<string, Shortening> = {
  '/calendars/tithi': {
    oldEn: 'Tithi Calendar 2026 — Full Year of Lunar Days with Festivals & Vrats',
    newEn: 'Tithi Calendar 2026 — Lunar Days, Festivals, Vrats',
  },
  '/charts': {
    oldEn: 'Vedic Charts & Tools  –  Kundali, Divisional, KP & More',
    newEn: 'Vedic Charts — Kundali, Vargas, KP',
  },
  '/about': {
    oldEn: 'About Dekho Panchang  –  Vedic Astronomy Made Accessible',
    newEn: 'About Dekho Panchang — Vedic Astronomy',
  },
  '/hindu-calendar/2026': {
    oldEn: 'Hindu Calendar 2026  –  Complete Festival, Vrat & Eclipse Dates',
    newEn: 'Hindu Calendar 2026 — Festivals, Vrat, Eclipses',
  },
  '/vivah-muhurat/2026': {
    oldEn: 'Shubh Vivah Muhurat 2026  –  Auspicious Hindu Marriage Dates',
    newEn: 'Vivah Muhurat 2026 — Auspicious Marriage Dates',
  },
  '/sign-calculator': {
    oldEn: 'Sun & Moon Sign Calculator  –  Find Your Rashi',
    newEn: 'Sun & Moon Sign Calculator — Find Your Rashi',
  },
  '/baby-names': {
    oldEn: 'Baby Names by Nakshatra  –  Vedic Name Finder',
    newEn: 'Baby Names by Nakshatra — Vedic Name Finder',
  },
};

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

let updates = 0;
let skipped = 0;
const report: string[] = [];

for (const [route, { oldEn, newEn }] of Object.entries(SHORTENINGS)) {
  const routeProp = pageMetaObj.getProperty(`'${route}'`) ?? pageMetaObj.getProperty(`"${route}"`);
  if (!routeProp || routeProp.getKind() !== SyntaxKind.PropertyAssignment) {
    report.push(`[skip] route ${route} not found in PAGE_META`);
    skipped++;
    continue;
  }
  const meta = routeProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const titleProp = meta.getProperty('title');
  if (!titleProp || titleProp.getKind() !== SyntaxKind.PropertyAssignment) {
    report.push(`[skip] route ${route} has no title block`);
    skipped++;
    continue;
  }
  const titleObj = titleProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  let routeUpdates = 0;
  for (const titleEntry of titleObj.getProperties()) {
    if (titleEntry.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const e = titleEntry.asKindOrThrow(SyntaxKind.PropertyAssignment);
    const locale = e.getName();
    const lit = e.getInitializerIfKind(SyntaxKind.StringLiteral)
      ?? e.getInitializerIfKind(SyntaxKind.NoSubstitutionTemplateLiteral);
    if (!lit) continue;
    const v = lit.getLiteralValue();
    let newV: string | null = null;
    if (locale === 'en') {
      if (v === oldEn) newV = newEn;
      else if (v === newEn) { /* idempotent */ }
      else report.push(`[warn] ${route}.en doesn't match expected — actual: "${v.slice(0, 60)}…"`);
    } else if (v.includes(oldEn)) {
      newV = v.replace(oldEn, newEn);
    }
    if (newV && newV !== v) {
      lit.replaceWithText(JSON.stringify(newV));
      routeUpdates++;
      updates++;
    }
  }
  report.push(`[ok]   ${route} — ${routeUpdates} locale${routeUpdates === 1 ? '' : 's'} updated`);
}

if (APPLY) {
  src.saveSync();
  console.log(`\n${updates} title entries updated across ${Object.keys(SHORTENINGS).length} routes (${skipped} skipped).`);
} else {
  console.log('\nDRY-RUN — pass --apply to write.');
  console.log(`${updates} title entries WOULD be updated (${skipped} skipped).`);
}
console.log();
for (const line of report) console.log(line);
