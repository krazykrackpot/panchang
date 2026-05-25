#!/usr/bin/env tsx
/**
 * Add <ToolStructuredData> to /[locale]/<tool>/layout.tsx for the 12
 * remaining individual tool routes that lack ToolLD + BreadcrumbLD.
 * Audit 2026-05-25 §C1.
 *
 * Two layout shapes:
 *   Shape A — minimal `return children;` (no JSON-LD wrapper).
 *   Shape B — `return <>{faqLD && ...}{children}</>;` (FAQ wrapper present).
 *
 * In Shape A we replace the bare `return children;` with a fragment that
 * holds the structured-data block + children. In Shape B we insert the
 * block above {children}.
 *
 * Idempotent.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');

interface ToolEntry {
  slug: string;
  name: string;
  description: string;
}

// 12 routes (choghadiya was done by hand above). Names + descriptions are
// short and direct so the WebApplication LD payload is concise.
const TOOLS: ToolEntry[] = [
  { slug: 'hora', name: 'Planetary Hora Calculator', description: 'Today\'s planetary hora chart — 24-hour cycle of graha-ruled hours for any city.' },
  { slug: 'sade-sati', name: 'Sade Sati Checker', description: 'Saturn\'s 7.5-year transit over the Moon — phase, status, and remedies based on your birth chart.' },
  { slug: 'prashna', name: 'Prashna Kundali', description: 'Vedic horary chart — ask a question and read the answer from the rising-degree at that moment.' },
  { slug: 'baby-names', name: 'Nakshatra Baby Names', description: 'Auspicious baby names by birth nakshatra pada — Sanskrit, Hindi, and modern variants.' },
  { slug: 'upagraha', name: 'Upagraha Calculator', description: 'Shadow-planet sphutas — Mandi, Gulika, Dhuma, Vyatipata and the rest of the 11 upagrahas.' },
  { slug: 'chandra-darshan', name: 'Chandra Darshan Sighting', description: 'New crescent visibility for any date and city — moon sighting tool for Eid + Hindu month boundaries.' },
  { slug: 'kaal-nirnaya', name: 'Kaal Nirnaya', description: 'Right time for every action — Hora, Choghadiya, Rahu Kaal, and muhurta windows in one view.' },
  { slug: 'sky', name: 'Live Sky View', description: 'Real-time planetary positions, signs, nakshatras, and visibility for any location.' },
  { slug: 'vedic-time', name: 'Vedic Time Converter', description: 'Convert clock time to Ghati, Pala, Vipala, Muhurta and Prahara — Surya Siddhanta time units.' },
  { slug: 'tithi-pravesha', name: 'Tithi Pravesha Birthday Chart', description: 'Vedic birthday chart cast for the moment the Sun-Moon angle returns to its birth value.' },
  { slug: 'tropical-compare', name: 'Vedic vs Tropical Compare', description: 'Side-by-side comparison of your sidereal (Vedic) chart with the tropical (Western) chart.' },
  { slug: 'sign-shift', name: 'Sign Shift Visualiser', description: 'Watch your Sun, Moon, and rising signs shift between tropical and sidereal zodiacs.' },
  { slug: 'cosmic-blueprint', name: 'Cosmic Blueprint', description: 'Your celestial signature — Sun, Moon, lagna, dasha lord, and life-domain scores in a single card.' },
];

let touched = 0;
for (const t of TOOLS) {
  const path = `src/app/[locale]/${t.slug}/layout.tsx`;
  let src: string;
  try {
    src = readFileSync(path, 'utf8');
  } catch {
    console.error(`[skip] ${path} — not found`);
    continue;
  }
  if (src.includes('ToolStructuredData')) {
    console.log(`[skip] ${t.slug} — already has ToolStructuredData`);
    continue;
  }

  // Add import after the last existing top-level import.
  const lastImportIdx = src.lastIndexOf("import ");
  const lastImportEol = src.indexOf('\n', lastImportIdx);
  const importLine = `import { ToolStructuredData } from '@/components/seo/ToolStructuredData';\n`;
  const withImport = src.slice(0, lastImportEol + 1) + importLine + src.slice(lastImportEol + 1);

  // Replace the Layout body.
  // Shape B: `return ( <> ... {children} </> );`
  // Shape A: `return children;` or `return <>{children}</>;`
  const block = `      <ToolStructuredData
        name=${JSON.stringify(t.name)}
        description=${JSON.stringify(t.description)}
        path=${JSON.stringify(`/${t.slug}`)}
        locale={locale}
      />`;

  let next: string | undefined;
  // Try Shape B (insert before children inside existing fragment).
  if (withImport.includes('{children}')) {
    next = withImport.replace('{children}', `${block.trimStart()}\n      {children}`);
  }
  if (!next || next === withImport) {
    // Shape A: `return children;` becomes a fragment.
    const before = next ?? withImport;
    next = before.replace(/return\s+children\s*;/, `return (\n    <>\n${block}\n      {children}\n    </>\n  );`);
  }
  if (next === withImport) {
    console.error(`[skip] ${t.slug} — pattern didn't match`);
    continue;
  }

  // For Shape A, the Layout function needs to be async if it uses locale.
  // Inspect: does the original Layout already destructure params?
  // If `function Layout({ children }: { children` is the signature with no
  // params, we need to upgrade to async with params.
  if (/export default function Layout\({\s*children\s*}: \{\s*children: React\.ReactNode\s*}\)/.test(next)) {
    next = next.replace(
      /export default function Layout\({\s*children\s*}: \{\s*children: React\.ReactNode\s*}\)/,
      'export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> })',
    );
    // Insert `const { locale } = await params;` after the `{` of the body.
    next = next.replace(
      /(export default async function Layout\([^)]+\)\s*{)/,
      '$1\n  const { locale } = await params;',
    );
  }

  if (APPLY) {
    writeFileSync(path, next, 'utf8');
    console.log(`[apply] ${t.slug}`);
  } else {
    console.log(`[dry-run] ${t.slug}`);
  }
  touched++;
}

console.log(`\n${APPLY ? 'Applied' : 'Dry-run'}: ${touched} layouts touched.`);
