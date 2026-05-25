#!/usr/bin/env tsx
/**
 * Add <ModuleArticleLD /> to every /[locale]/learn/modules/<id>/layout.tsx
 * that doesn't already render it. Audit 2026-05-25 §C2.
 *
 * Source layouts all share an identical shape (output of the
 * migrate-module-hreflang codemod):
 *
 *   export default function Layout({ children }: { children: React.ReactNode }) {
 *     return <>{children}</>;
 *   }
 *
 * After this codemod:
 *
 *   export default async function Layout({ children, params }: { ... }) {
 *     const { locale } = await params;
 *     return <><ModuleArticleLD modId={MOD_ID} locale={locale} />{children}</>;
 *   }
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const MOD_ROOT = 'src/app/[locale]/learn/modules';

let touched = 0;
let skipped = 0;

for (const dirent of readdirSync(MOD_ROOT, { withFileTypes: true })) {
  if (!dirent.isDirectory()) continue;
  const path = join(MOD_ROOT, dirent.name, 'layout.tsx');
  let src: string;
  try {
    src = readFileSync(path, 'utf8');
  } catch {
    continue;
  }
  if (src.includes('ModuleArticleLD')) {
    skipped++;
    continue;
  }

  // Add import after the last existing top-level import.
  const lastImportIdx = src.lastIndexOf('import ');
  const lastImportEol = src.indexOf('\n', lastImportIdx);
  let next =
    src.slice(0, lastImportEol + 1) +
    `import { ModuleArticleLD } from '@/components/seo/ModuleArticleLD';\n` +
    src.slice(lastImportEol + 1);

  // Upgrade Layout signature to async + params, destructure locale, inject LD.
  next = next.replace(
    /export default function Layout\(\{\s*children\s*\}: \{\s*children: React\.ReactNode\s*\}\) \{\s*return <>\{children\}<\/>;\s*\}/,
    `export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <ModuleArticleLD modId={MOD_ID} locale={locale} />
      {children}
    </>
  );
}`,
  );

  if (next === src) {
    console.error(`[skip] ${path} — pattern didn't match (expected shape changed?)`);
    skipped++;
    continue;
  }

  if (APPLY) {
    writeFileSync(path, next, 'utf8');
    console.log(`[apply] ${dirent.name}`);
  } else {
    console.log(`[dry-run] ${dirent.name}`);
  }
  touched++;
}

console.log(`\n${APPLY ? 'Applied' : 'Dry-run'}: ${touched} layouts touched, ${skipped} skipped.`);
