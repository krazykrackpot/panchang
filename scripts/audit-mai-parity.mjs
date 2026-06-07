#!/usr/bin/env node
/**
 * /mai/ key-parity audit — finds every translation surface where Maithili
 * is a literal copy of Hindi (or missing entirely, falling through to
 * English / Hindi via i18n config).
 *
 * Run:  node scripts/audit-mai-parity.mjs
 *
 * Three surfaces are scanned:
 *   1) src/messages/{pages,components,learn}/*.json — per-page namespace files
 *      shaped as { keyPath: { en, hi, mai, mr, ta, te, bn, gu, kn }, ... }
 *   2) src/messages/mai.json + src/messages/hi.json — top-level monolithic
 *      bundles consumed by next-intl request.ts
 *   3) src/app/[locale]/...tsx — files with `const LABELS: Record<string,
 *      Record<string, string>>` inline tables, counted by whether the table
 *      has a `mai:` block at all
 *
 * Surfaces 1 + 2 + 3 are independent vectors. A /mai/ page can render with:
 *   - Hindi text (mai === hi in surfaces 1 or 2)
 *   - English text (no mai block in surface 3 → LABELS.en fall-through)
 *   - Or a mix of both, which is the May 31 / June 1 demotion trigger.
 *
 * Designed to be re-run as a CI gate eventually: assert each surface stays
 * below a maturity threshold. Today it's a one-off baseline.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/messages';
const NAMESPACES = ['pages', 'components', 'learn'];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.json')) out.push(full);
  }
  return out;
}

function isLocaleLeaf(node) {
  return node && typeof node === 'object' && !Array.isArray(node) && typeof node.en === 'string';
}

function walkLeaves(obj, cb, path = []) {
  if (isLocaleLeaf(obj)) { cb(path.join('.'), obj); return; }
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) walkLeaves(v, cb, [...path, k]);
  }
}

function classifyLeaf(leaf) {
  const { en, hi, mai } = leaf;
  if (mai === undefined) return 'missing';
  if (mai === hi && hi !== undefined) return 'dup_hi';
  if (mai === en && en !== undefined) return 'dup_en';
  return 'unique';
}

// =============================================================
// Surface 1: namespace files
// =============================================================
const nsFiles = [];
for (const ns of NAMESPACES) nsFiles.push(...walk(join(ROOT, ns)));

let ns_total = 0, ns_missing = 0, ns_dup_hi = 0, ns_dup_en = 0, ns_unique = 0;
const ns_perFile = [];
for (const file of nsFiles) {
  const json = JSON.parse(readFileSync(file, 'utf-8'));
  const c = { total: 0, missing: 0, dup_hi: 0, dup_en: 0, unique: 0 };
  walkLeaves(json, (_path, leaf) => {
    c.total++;
    c[classifyLeaf(leaf)]++;
  });
  ns_total += c.total;
  ns_missing += c.missing;
  ns_dup_hi += c.dup_hi;
  ns_dup_en += c.dup_en;
  ns_unique += c.unique;
  ns_perFile.push({ file: file.replace('src/messages/', ''), ...c });
}

// =============================================================
// Surface 2: top-level mai.json vs hi.json
// =============================================================
function walkFlat(obj, path = []) {
  const out = [];
  if (typeof obj === 'string') return [[path.join('.'), obj]];
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) out.push(...walkFlat(v, [...path, k]));
  }
  return out;
}

const hi = JSON.parse(readFileSync('src/messages/hi.json', 'utf-8'));
const mai = JSON.parse(readFileSync('src/messages/mai.json', 'utf-8'));
const en = JSON.parse(readFileSync('src/messages/en.json', 'utf-8'));

const hiLeaves = new Map(walkFlat(hi));
const maiLeaves = new Map(walkFlat(mai));
const enLeaves = new Map(walkFlat(en));

let tl_total = 0, tl_missing = 0, tl_dup_hi = 0, tl_dup_en = 0, tl_unique = 0;
for (const key of new Set([...hiLeaves.keys(), ...maiLeaves.keys()])) {
  tl_total++;
  const hiVal = hiLeaves.get(key);
  const maiVal = maiLeaves.get(key);
  const enVal = enLeaves.get(key);
  if (maiVal === undefined) tl_missing++;
  else if (maiVal === hiVal && hiVal !== undefined) tl_dup_hi++;
  else if (maiVal === enVal && enVal !== undefined) tl_dup_en++;
  else tl_unique++;
}

// =============================================================
// Surface 3: inline LABELS records in TSX
// =============================================================
function collectTsx(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...collectTsx(full));
    else if (entry.endsWith('.tsx')) out.push(full);
  }
  return out;
}
const tsxFiles = collectTsx('src/app/[locale]');
const PATTERN = /Record<string,\s*Record<string,\s*string>>/;
let inline_files = 0, inline_with_mai = 0;
for (const file of tsxFiles) {
  const src = readFileSync(file, 'utf-8');
  if (!PATTERN.test(src)) continue;
  inline_files++;
  if (/\bmai:\s*\{/.test(src)) inline_with_mai++;
}

// =============================================================
// Print report
// =============================================================
function pct(n, d) { return d ? `${(n / d * 100).toFixed(1)}%` : '0%'; }

console.log('============================================================');
console.log(' /mai/ KEY-PARITY AUDIT — Hindi pass-through surfaces');
console.log('============================================================');
console.log('');
console.log('SURFACE 1 — namespace JSON files (pages/, components/, learn/)');
console.log(`  Files scanned: ${nsFiles.length}`);
console.log(`  Total leaves: ${ns_total}`);
console.log(`    missing mai:  ${ns_missing} (${pct(ns_missing, ns_total)})`);
console.log(`    mai === hi:   ${ns_dup_hi} (${pct(ns_dup_hi, ns_total)})  ← Hindi pass-through`);
console.log(`    mai === en:   ${ns_dup_en} (${pct(ns_dup_en, ns_total)})`);
console.log(`    unique mai:   ${ns_unique} (${pct(ns_unique, ns_total)})`);
console.log('');
console.log('SURFACE 2 — top-level mai.json vs hi.json (next-intl monolith)');
console.log(`  Total keys: ${tl_total}`);
console.log(`    missing mai:  ${tl_missing} (${pct(tl_missing, tl_total)})`);
console.log(`    mai === hi:   ${tl_dup_hi} (${pct(tl_dup_hi, tl_total)})  ← Hindi pass-through`);
console.log(`    mai === en:   ${tl_dup_en} (${pct(tl_dup_en, tl_total)})`);
console.log(`    unique mai:   ${tl_unique} (${pct(tl_unique, tl_total)})`);
console.log('');
console.log('SURFACE 3 — inline LABELS records in TSX files');
console.log(`  Total files using the pattern: ${inline_files}`);
console.log(`    have mai: block:    ${inline_with_mai} (${pct(inline_with_mai, inline_files)})`);
console.log(`    no mai (EN fall-through): ${inline_files - inline_with_mai} (${pct(inline_files - inline_with_mai, inline_files)})`);
console.log('');
console.log('============================================================');
console.log(' Top 20 namespace files by Hindi pass-through (dup_hi count)');
console.log('============================================================');
const sorted = [...ns_perFile].sort((a, b) => b.dup_hi - a.dup_hi || b.total - a.total);
console.log('file'.padEnd(56), 'total'.padStart(7), 'dup_hi'.padStart(8), 'dup_hi%'.padStart(9));
for (const f of sorted.slice(0, 20)) {
  console.log(f.file.padEnd(56), String(f.total).padStart(7), String(f.dup_hi).padStart(8), pct(f.dup_hi, f.total).padStart(9));
}
