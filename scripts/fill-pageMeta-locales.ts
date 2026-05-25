#!/usr/bin/env tsx
/**
 * Fill missing non-EN locale entries in PAGE_META so every active locale
 * has at least a placeholder title + description (better than rendering
 * English fallback for /hi/foo, /ta/foo, etc.).
 *
 * Strategy (per Audit B1):
 *   - For each PAGE_META entry, every active locale (hi, ta, te, bn, gu,
 *     kn, mai, mr) MUST have title + description.
 *   - If missing, seed from `hi` (most accessible cognate seed for the 4
 *     Devanagari locales — hi/mai/mr/sa already retired). For non-Devanagari
 *     locales (ta/te/bn/gu/kn), seed from EN — Google still ranks the EN
 *     copy at less weight than native, but it's a known-correct hint.
 *   - Idempotent — skips existing keys.
 *
 * This is NOT a substitute for real translation. It eliminates the
 * "English fallback in <title>" footgun for 233 routes and unblocks the
 * proper translation sprint to land incrementally per route.
 *
 * Usage:
 *   npx tsx scripts/fill-pageMeta-locales.ts             # dry-run counts
 *   npx tsx scripts/fill-pageMeta-locales.ts --apply
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';
const ACTIVE_NON_EN = ['hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'] as const;
const DEVANAGARI_LOCALES = new Set(['hi', 'mai', 'mr']);

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

let added = 0;
let skipped = 0;
let routesTouched = 0;

for (const routeProp of pageMetaObj.getProperties()) {
  if (routeProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const r = routeProp.asKindOrThrow(SyntaxKind.PropertyAssignment);
  const meta = r.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!meta) continue;

  let routeHadAdd = false;

  for (const field of ['title', 'description'] as const) {
    const fieldProp = meta.getProperty(field);
    if (!fieldProp || fieldProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const fObj = fieldProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (!fObj) continue;

    const enProp = fObj.getProperty('en');
    const hiProp = fObj.getProperty('hi');
    if (!enProp || enProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const enInit = enProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerOrThrow().getText();

    // hi can be missing; we use it when present.
    const hiInit = hiProp && hiProp.getKind() === SyntaxKind.PropertyAssignment
      ? hiProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerOrThrow().getText()
      : undefined;

    for (const loc of ACTIVE_NON_EN) {
      if (fObj.getProperty(loc)) { skipped++; continue; }
      // Seed: hi-cognate locales reuse hi if hi is present; otherwise en.
      const seed = DEVANAGARI_LOCALES.has(loc) && hiInit ? hiInit : enInit;
      if (APPLY) {
        fObj.addPropertyAssignment({ name: loc, initializer: seed });
      }
      added++;
      routeHadAdd = true;
    }
  }
  if (routeHadAdd) routesTouched++;
}

if (APPLY) {
  src.saveSync();
  console.log(`Applied: ${added} keys added, ${skipped} existed, ${routesTouched} routes touched.`);
} else {
  console.log(`Dry-run: ${added} keys would be added, ${skipped} existing, ${routesTouched} routes affected.`);
}
