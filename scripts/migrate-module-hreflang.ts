#!/usr/bin/env tsx
/**
 * Codemod: migrate /[locale]/learn/modules/<id>/layout.tsx files to use
 * `buildHreflangMap` from `@/lib/seo/hreflang` instead of hardcoded
 * `{ en, hi, sa, x-default }` blocks.
 *
 * Also drops the `'en' | 'hi' | 'sa'` cast (uses just the locale string
 * for module-title lookup).
 *
 * Safe to re-run — idempotent on already-migrated files.
 *
 * Usage:
 *   npx tsx scripts/migrate-module-hreflang.ts             # dry-run, prints diff
 *   npx tsx scripts/migrate-module-hreflang.ts --apply     # writes changes
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const MODULES_DIR = 'src/app/[locale]/learn/modules';

const modules = readdirSync(MODULES_DIR);
let migrated = 0;
let skipped = 0;
let errored = 0;

for (const modId of modules) {
  const filePath = join(MODULES_DIR, modId, 'layout.tsx');
  let src: string;
  try {
    src = readFileSync(filePath, 'utf8');
  } catch {
    continue;
  }

  if (src.includes("from '@/lib/seo/hreflang'")) {
    skipped++;
    continue;
  }

  // Pattern match the languages block — fail loud if shape doesn't match.
  const langBlockRe = /languages:\s*\{\s*en:\s*`\$\{BASE_URL\}\/en\/learn\/modules\/\$\{MOD_ID\}`,\s*hi:\s*`\$\{BASE_URL\}\/hi\/learn\/modules\/\$\{MOD_ID\}`,\s*sa:\s*`\$\{BASE_URL\}\/sa\/learn\/modules\/\$\{MOD_ID\}`,\s*'x-default':\s*`\$\{BASE_URL\}\/en\/learn\/modules\/\$\{MOD_ID\}`,?\s*\}/;

  if (!langBlockRe.test(src)) {
    console.error(`[skip] ${filePath} — languages block shape doesn't match expected pattern`);
    errored++;
    continue;
  }

  let next = src;
  // Add import after the MODULE_SEQUENCE import line.
  next = next.replace(
    /(import \{ MODULE_SEQUENCE \} from '@\/lib\/learn\/module-sequence';)/,
    "$1\nimport { buildHreflangMap } from '@/lib/seo/hreflang';",
  );

  // Replace the inline languages block with the helper call.
  next = next.replace(
    langBlockRe,
    'languages: buildHreflangMap(`/learn/modules/${MOD_ID}`)',
  );

  // Drop the `as 'en' | 'hi' | 'sa'` cast — let the module title lookup
  // handle the string locale directly. This was a stale 3-locale hack
  // that masked missing translations.
  next = next.replace(
    /const loc = locale as 'en' \| 'hi' \| 'sa';\n\s*/,
    '',
  );
  next = next.replace(
    /\(\(mod\.title as Record<string, string>\)\[loc\] \|\| mod\.title\.en\)/,
    '((mod.title as Record<string, string>)[locale] || mod.title.en)',
  );

  if (next === src) {
    console.error(`[skip] ${filePath} — no-op after rewrite (already migrated?)`);
    skipped++;
    continue;
  }

  if (APPLY) {
    writeFileSync(filePath, next, 'utf8');
    console.log(`[apply] ${filePath}`);
  } else {
    console.log(`[dry-run] would migrate ${filePath}`);
  }
  migrated++;
}

console.log(`\n${APPLY ? 'Applied' : 'Dry-run'}: ${migrated} migrated, ${skipped} skipped, ${errored} errored.`);
if (errored > 0) process.exit(1);
