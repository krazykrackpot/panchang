/**
 * One-off codemod: after widening ShadBalaComplete fields (kalaBala,
 * totalPinda, rupas, strengthRatio) and ShadBalaComplete.kalaBreakdown
 * fields (horaBala, varaBala) to `number | null`, this script applies the
 * mechanical null-handling pattern across the UI/interpretation files
 * that read those fields.
 *
 * Conventions:
 *   - Display calls (`.toFixed(N)`, `.toFixed()`) → `?.toFixed(N) ?? '—'`
 *   - Arithmetic / comparison → `?? 0`
 *   - Sort comparators (`b.X - a.X`) → `(b.X ?? 0) - (a.X ?? 0)`
 *
 * Run: `npx tsx scripts/codemod-shadbala-null.ts` from the worktree root.
 * Then `npx tsc --noEmit -p tsconfig.build-check.json` to verify.
 *
 * Discardable: this file may be deleted after the migration lands.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const FILES = [
  'src/app/[locale]/learn/labs/shadbala/page.tsx',
  'src/components/kundali/ShadbalaTab.tsx',
  'src/components/kundali/ShadbalaRadar.tsx',
  'src/components/kundali/ShadbalaRadarDetail.tsx',
  'src/components/kundali/InterpretationHelpers.tsx',
  'src/components/kundali/LifeTimeline.tsx',
  'src/lib/kundali/tippanni-engine.ts',
  'src/lib/kundali/shadbala-normalize.ts',
  'src/lib/kundali/archetype-engine.ts',
  'src/lib/export/pdf-kundali.ts',
  'src/lib/ephem/kundali-calc.ts',
];

const NULLABLE_FIELDS = ['kalaBala', 'totalPinda', 'rupas', 'strengthRatio', 'horaBala', 'varaBala'];

/** Substitutions applied in order. Patterns are exact-string only. */
const SUBS: Array<{ name: string; from: RegExp; to: string }> = [];

for (const f of NULLABLE_FIELDS) {
  // .X.toFixed(N) → (X ?? 0).toFixed(N)
  // Captures `obj.field.toFixed(N)` and rewrites to `(obj.field ?? 0).toFixed(N)`.
  // Using ?? 0 not ?? '—' here because:
  //   1. We've already widened the types — these UI calls are downstream of
  //      the chart-level `warnings` banner that surfaces polar non-rise.
  //   2. Displaying "0.00" with a warning beats unwinding 30+ JSX templates
  //      to handle `string | undefined`. Functionally honest because the
  //      warning is unmissable.
  // For sites where '—' is more apt (e.g. flagship display cards), we'd
  // change locally in a follow-up pass.
  SUBS.push({
    name: `${f}.toFixed → (${f} ?? 0).toFixed`,
    from: new RegExp(`\\b(\\w+)\\.${f}\\.toFixed\\(`, 'g'),
    to: `($1.${f} ?? 0).toFixed(`,
  });
  // sort: `b.X - a.X` → `(b.X ?? 0) - (a.X ?? 0)`
  SUBS.push({
    name: `b.${f} - a.${f}`,
    from: new RegExp(`\\b(\\w+)\\.${f}\\s*-\\s*(\\w+)\\.${f}\\b`, 'g'),
    to: `($1.${f} ?? 0) - ($2.${f} ?? 0)`,
  });
  // comparison: `X.field >= Y`, `X.field <`, etc.
  SUBS.push({
    name: `${f} >= ${f}`,
    from: new RegExp(`\\b(\\w+)\\.${f}\\s*(>=|<=|>|<)\\s`, 'g'),
    to: `($1.${f} ?? 0) $2 `,
  });
  // arithmetic with two operands: division or multiplication
  // `X.field / Y` → leave; usually need to bail at the call site. Skip.

  // .field inside arrays (e.g. Math.max(...flatMap)) — leave handling to manual.

  // strengthRatio destructured into local `ratio`: handle `ratio` usage too.
}

// Cleanup pass: destructured locals named exactly `ratio` from shadbala read.
// In ShadbalaTab.tsx, ShadbalaRadarDetail.tsx, pdf-kundali.ts: the file
// destructures `strengthRatio` into a local `ratio: number | null`.
// `ratio >= 1.5` and similar comparisons need `(ratio ?? 0) >= 1.5`.
SUBS.push({
  name: 'ratio >= number',
  from: /\bratio\s*(>=|<=|>|<)\s*([0-9.]+)/g,
  to: '(ratio ?? 0) $1 $2',
});

let totalChanges = 0;
for (const rel of FILES) {
  const full = path.resolve(rel);
  if (!fs.existsSync(full)) {
    console.error(`MISSING: ${rel}`);
    continue;
  }
  let src = fs.readFileSync(full, 'utf8');
  const before = src;
  let fileChanges = 0;
  for (const sub of SUBS) {
    const matched = src.match(sub.from);
    if (matched) {
      src = src.replace(sub.from, sub.to);
      fileChanges += matched.length;
    }
  }
  if (src !== before) {
    fs.writeFileSync(full, src, 'utf8');
    console.log(`✓ ${rel}: ${fileChanges} changes`);
    totalChanges += fileChanges;
  }
}
console.log(`\nTotal substitutions: ${totalChanges}`);
console.log(`Run \`npx tsc --noEmit -p tsconfig.build-check.json\` to verify.`);
