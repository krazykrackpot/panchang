#!/usr/bin/env tsx
/**
 * AST-safe strip of `sa:` properties from object literals in
 * src/lib/seo/metadata.ts. Uses ts-morph so we don't risk a regex-based
 * Lesson-H violation.
 *
 * Scope:
 *   - Removes `sa: <value>` property assignments from every object
 *     literal it visits inside metadata.ts.
 *   - Idempotent.
 *
 * Usage:
 *   npx tsx scripts/strip-sa-from-metadata.ts            # dry-run (counts only)
 *   npx tsx scripts/strip-sa-from-metadata.ts --apply
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);

let removed = 0;
src.forEachDescendant((node) => {
  if (node.getKind() !== SyntaxKind.PropertyAssignment) return;
  const name = node.asKindOrThrow(SyntaxKind.PropertyAssignment).getName();
  if (name !== 'sa') return;
  if (APPLY) {
    node.asKindOrThrow(SyntaxKind.PropertyAssignment).remove();
  }
  removed++;
});

if (APPLY) {
  src.saveSync();
  console.log(`Applied: removed ${removed} sa: properties from ${TARGET}`);
} else {
  console.log(`Dry-run: would remove ${removed} sa: properties from ${TARGET}`);
}
