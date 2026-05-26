#!/usr/bin/env tsx
/**
 * Sprint 18 follow-up — apply the two Gemini #216 improvements to the
 * 102 pre-existing learn/modules/<id>/layout.tsx files:
 *
 *   1. Strip trailing slash on BASE_URL.replace(/\/$/, '').
 *   2. Use getModuleRef(MOD_ID) instead of MODULE_SEQUENCE.find(...).
 *
 * Idempotent — skips layouts that already have both fixes.
 *
 * Usage:
 *   npx tsx scripts/sprint18-fix-existing-layouts.ts            # dry-run
 *   npx tsx scripts/sprint18-fix-existing-layouts.ts --apply
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const MODULES_DIR = 'src/app/[locale]/learn/modules';

let updated = 0;
let skipped = 0;
const report: string[] = [];

for (const entry of readdirSync(MODULES_DIR)) {
  const dir = join(MODULES_DIR, entry);
  if (!statSync(dir).isDirectory()) continue;
  const layoutPath = join(dir, 'layout.tsx');
  if (!existsSync(layoutPath)) continue;

  const text = readFileSync(layoutPath, 'utf8');
  let modified = text;

  // Fix 1: Strip trailing slash on BASE_URL.
  modified = modified.replace(
    /const BASE_URL = \(process\.env\.NEXT_PUBLIC_SITE_URL \|\| 'https:\/\/dekhopanchang\.com'\)\.trim\(\);/,
    "const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim().replace(/\\/$/, '');",
  );

  // Fix 2: Swap MODULE_SEQUENCE import → getModuleRef import.
  modified = modified.replace(
    /import \{ MODULE_SEQUENCE \} from '@\/lib\/learn\/module-sequence';/,
    "import { getModuleRef } from '@/lib/learn/module-sequence';",
  );

  // Fix 3: Replace .find call with getModuleRef call.
  modified = modified.replace(
    /const mod = MODULE_SEQUENCE\.find\(m => m\.id === MOD_ID\);/,
    'const mod = getModuleRef(MOD_ID);',
  );

  if (modified === text) {
    report.push(`[skip] ${layoutPath} — already up to date`);
    skipped++;
    continue;
  }
  if (APPLY) writeFileSync(layoutPath, modified, 'utf8');
  updated++;
  report.push(`[${APPLY ? 'fixed' : 'would-fix'}] ${layoutPath}`);
}

if (APPLY) {
  console.log(`\nFixed ${updated} layout.tsx files (${skipped} already up to date).`);
} else {
  console.log(`\nDRY-RUN — pass --apply. Would fix ${updated} layouts (${skipped} already up to date).`);
}
console.log();
for (const line of report.slice(0, 20)) console.log(line);
if (report.length > 20) console.log(`... (${report.length - 20} more)`);
