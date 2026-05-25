#!/usr/bin/env tsx
/**
 * AST-safe addition of `mr:` keys to PAGE_META entries listed in
 * src/lib/__tests__/seo-metadata.test.ts PRIORITY_ROUTES.
 *
 * Initial mr value is copied from hi (Hindi and Marathi share Devanagari +
 * substantial vocabulary — readable to a Marathi speaker, far better than
 * English fallback). The bilingual-format rewrite (Marathi | English) for
 * top-10 routes happens as a separate manual edit pass after this script.
 *
 * Idempotent.
 *
 * Usage:
 *   npx tsx scripts/add-mr-to-priority-routes.ts            # dry-run
 *   npx tsx scripts/add-mr-to-priority-routes.ts --apply
 */
import { Project, SyntaxKind } from 'ts-morph';
// Import from the single source of truth — drifting these lists apart
// caused the SEO parity test and the codemod to disagree silently. Gemini #171.
import { PRIORITY_ROUTES } from '../src/lib/seo/priority-routes';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);

let added = 0;
let skipped = 0;
const missingRoutes: string[] = [];

// PAGE_META is exported as a const object literal. Find it.
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

for (const routeKey of PRIORITY_ROUTES) {
  const routeProp = pageMetaObj.getProperty(`'${routeKey}'`) ?? pageMetaObj.getProperty(`"${routeKey}"`);
  if (!routeProp || routeProp.getKind() !== SyntaxKind.PropertyAssignment) {
    missingRoutes.push(routeKey);
    continue;
  }
  const meta = routeProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  for (const field of ['title', 'description'] as const) {
    const fieldProp = meta.getProperty(field);
    if (!fieldProp || fieldProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const fieldObj = fieldProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

    // Already has mr? Skip.
    if (fieldObj.getProperty('mr')) {
      skipped++;
      continue;
    }

    // Use hi as initial mr value; fall back to en if hi missing.
    const hiProp = fieldObj.getProperty('hi') ?? fieldObj.getProperty('en');
    if (!hiProp || hiProp.getKind() !== SyntaxKind.PropertyAssignment) {
      skipped++;
      continue;
    }
    const hiInit = hiProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerOrThrow();
    const hiText = hiInit.getText();

    if (APPLY) {
      fieldObj.addPropertyAssignment({ name: 'mr', initializer: hiText });
    }
    added++;
  }
}

if (missingRoutes.length > 0) {
  console.error('Routes in PRIORITY_ROUTES but missing from PAGE_META:');
  for (const r of missingRoutes) console.error('  ' + r);
}

if (APPLY) {
  src.saveSync();
  console.log(`Applied: added ${added} mr keys, skipped ${skipped} already-present, missing routes: ${missingRoutes.length}`);
} else {
  console.log(`Dry-run: would add ${added} mr keys, skip ${skipped}, missing routes: ${missingRoutes.length}`);
}
