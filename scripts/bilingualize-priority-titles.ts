#!/usr/bin/env tsx
/**
 * Convert non-EN priority-route titles in `src/lib/seo/metadata.ts` to
 * the codified bilingual format `<Script> | <English>`. Per
 * `feedback_bilingual_titles.md`:
 *
 *   "Non-EN locale titles MUST include regional script + English together.
 *    'Bangla Calendar 2026 | বাংলা ক্যালেন্ডার ২০২৬' — never script-only
 *    or English-only."
 *
 * Algorithm (ts-morph, AST-safe):
 *   1. For each route in PRIORITY_ROUTES.
 *   2. Read meta.title.en (the English title).
 *   3. For each non-EN locale present in meta.title:
 *      - If the value already contains `|` or the English title's first
 *        12 chars, skip (already bilingual or near-enough).
 *      - Otherwise: rewrite to `<existing value> | <English title>` via
 *        `JSON.stringify(merged)` for robust escape handling (Gemini #176).
 *   4. Title-length sanity: skip rewrites > 110 chars (would push past
 *      SERP truncation; needs hand-tuned shorter EN suffix instead).
 *
 * Idempotent.
 *
 * Usage:
 *   npx tsx scripts/bilingualize-priority-titles.ts          # dry-run
 *   npx tsx scripts/bilingualize-priority-titles.ts --apply
 */
import { Project, SyntaxKind } from 'ts-morph';
// Single source of truth — same list the parity test uses.
import { PRIORITY_ROUTES } from '../src/lib/seo/priority-routes';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';
const MAX_LEN = 110;

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

let converted = 0;
let skipped = 0;
let tooLong = 0;
const overlong: string[] = [];

for (const routeKey of PRIORITY_ROUTES) {
  const routeProp = pageMetaObj.getProperty(`'${routeKey}'`) ?? pageMetaObj.getProperty(`"${routeKey}"`);
  if (!routeProp || routeProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const meta = routeProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  const titleProp = meta.getProperty('title');
  if (!titleProp || titleProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const titleObj = titleProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  // Read the English title — strip quotes only if non-template literal.
  const enProp = titleObj.getProperty('en');
  if (!enProp || enProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const enInit = enProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerOrThrow();
  const enRaw = enInit.getText();
  if (!enRaw.startsWith("'") && !enRaw.startsWith('"') && !enRaw.startsWith('`')) continue;
  // Skip template literals — those interpolate at runtime; can't append safely.
  if (enRaw.startsWith('`') && enRaw.includes('${')) continue;
  const enText = enRaw.slice(1, -1);
  const enKey = enText.slice(0, 12).toLowerCase();

  for (const prop of titleObj.getProperties()) {
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const p = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
    const name = p.getName();
    if (name === 'en') continue;

    const init = p.getInitializerOrThrow();
    const raw = init.getText();
    if (!raw.startsWith("'") && !raw.startsWith('"') && !raw.startsWith('`')) { skipped++; continue; }
    if (raw.startsWith('`') && raw.includes('${')) { skipped++; continue; }
    const value = raw.slice(1, -1);

    if (value.includes('|') || value.toLowerCase().includes(enKey)) { skipped++; continue; }

    const merged = `${value} | ${enText}`;
    if (merged.length > MAX_LEN) {
      tooLong++;
      overlong.push(`${routeKey} [${name}]: ${merged.length} chars`);
      continue;
    }

    if (APPLY) {
      // JSON.stringify gives us robust escape handling for any character
      // (backslashes, quotes, control chars) — Gemini #176 HIGH fix.
      p.setInitializer(JSON.stringify(merged));
    }
    converted++;
  }
}

if (APPLY) {
  src.saveSync();
  console.log(`Applied: ${converted} converted, ${skipped} already bilingual / skipped, ${tooLong} over ${MAX_LEN} chars.`);
} else {
  console.log(`Dry-run: ${converted} would convert, ${skipped} skipped, ${tooLong} over ${MAX_LEN} chars.`);
}

if (overlong.length > 0) {
  console.log('\nOverlong (skipped — hand-tune the EN title shorter):');
  for (const o of overlong) console.log('  ' + o);
}
