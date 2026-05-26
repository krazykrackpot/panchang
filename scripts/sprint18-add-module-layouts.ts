#!/usr/bin/env tsx
/**
 * Sprint 18 — generate the missing layout.tsx for the 16 learn module
 * dirs that have page.tsx but no layout (so no Article + LearningResource
 * JSON-LD, no per-module canonical / hreflang / OG metadata).
 *
 * Each generated layout mirrors the canonical pattern in module 1-1:
 *   - generateMetadata with title/description/canonical/hreflang/OG.
 *   - <ModuleArticleLD modId locale /> + children.
 *
 * Idempotent — skips dirs that already have a layout.tsx.
 *
 * Usage:
 *   npx tsx scripts/sprint18-add-module-layouts.ts            # dry-run
 *   npx tsx scripts/sprint18-add-module-layouts.ts --apply
 */
import { readdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const MODULES_DIR = 'src/app/[locale]/learn/modules';

const LAYOUT_TEMPLATE = (modId: string) => `import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { MODULE_SEQUENCE } from '@/lib/learn/module-sequence';
import { buildHreflangMap } from '@/lib/seo/hreflang';
import { ModuleArticleLD } from '@/components/seo/ModuleArticleLD';
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();
const MOD_ID = '${modId}';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const mod = MODULE_SEQUENCE.find(m => m.id === MOD_ID);
  const title = mod ? \`\${((mod.title as Record<string, string>)[locale] || mod.title.en)}  –  Learn Jyotish\` : \`Module \${MOD_ID}  –  Learn Jyotish\`;
  const description = mod ? \`\${mod.topic} · Module \${MOD_ID}  –  Interactive Vedic astrology lesson\` : undefined;
  return {
    title,
    description,
    alternates: {
      canonical: \`\${BASE_URL}/\${locale}/learn/modules/\${MOD_ID}\`,
      languages: buildHreflangMap(\`/learn/modules/\${MOD_ID}\`),
    },
    openGraph: { title, description },
  };
}
export default async function Layout({
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
}
`;

let created = 0;
let skipped = 0;
const report: string[] = [];

for (const entry of readdirSync(MODULES_DIR)) {
  const dir = join(MODULES_DIR, entry);
  if (!statSync(dir).isDirectory()) continue;
  const layoutPath = join(dir, 'layout.tsx');
  const pagePath = join(dir, 'page.tsx');
  if (!existsSync(pagePath)) continue; // not an active module
  if (existsSync(layoutPath)) { skipped++; continue; }
  // Generate
  if (APPLY) writeFileSync(layoutPath, LAYOUT_TEMPLATE(entry), 'utf8');
  created++;
  report.push(`[${APPLY ? 'created' : 'would-create'}] ${layoutPath}`);
}

if (APPLY) {
  console.log(`\nCreated ${created} layout.tsx files (${skipped} already existed).`);
} else {
  console.log(`\nDRY-RUN — pass --apply to write. Would create ${created} layout.tsx files (${skipped} already existed).`);
}
console.log();
for (const line of report) console.log(line);
