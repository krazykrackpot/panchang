#!/usr/bin/env tsx
/**
 * Strip the "sa" key from every nested object in every JSON file under
 * src/messages/. Safe because sa was retired May 2026 — the proxy 301s
 * /sa/* to /en/* so the rendered values never reach a request.
 *
 * Does NOT add "mr" — the existing mr.json + component message files
 * already contain the keys we need; this script only does the deletion.
 *
 * Idempotent. Re-running on a clean tree produces zero changes.
 *
 * Usage:
 *   npx tsx scripts/strip-sa-from-messages.ts           # dry-run
 *   npx tsx scripts/strip-sa-from-messages.ts --apply
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const ROOT = 'src/messages';

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (s.isFile() && p.endsWith('.json')) out.push(p);
  }
  return out;
}

function stripSa(node: unknown): { node: unknown; stripped: number } {
  if (node === null || typeof node !== 'object') return { node, stripped: 0 };
  if (Array.isArray(node)) {
    let stripped = 0;
    const next = node.map((v) => {
      const { node: nv, stripped: ns } = stripSa(v);
      stripped += ns;
      return nv;
    });
    return { node: next, stripped };
  }
  const obj = node as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  let stripped = 0;
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'sa') {
      stripped++;
      continue;
    }
    const { node: nv, stripped: ns } = stripSa(v);
    out[k] = nv;
    stripped += ns;
  }
  return { node: out, stripped };
}

let totalFiles = 0;
let totalStripped = 0;
const files = walk(ROOT);
for (const f of files) {
  // Skip the per-locale top-level files — sa.json is the bundle for the
  // retired locale itself (handled by separate delete in P5).
  if (/^src\/messages\/sa\.json$/.test(f)) continue;

  const raw = readFileSync(f, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`[skip] ${f} — JSON parse error: ${(err as Error).message}`);
    continue;
  }
  const { node, stripped } = stripSa(parsed);
  if (stripped === 0) continue;
  totalFiles++;
  totalStripped += stripped;
  if (APPLY) {
    writeFileSync(f, JSON.stringify(node, null, 2) + '\n', 'utf8');
    console.log(`[apply] ${f} (stripped ${stripped} sa keys)`);
  } else {
    console.log(`[dry-run] ${f} would strip ${stripped} sa keys`);
  }
}

console.log(`\n${APPLY ? 'Applied' : 'Dry-run'}: touched ${totalFiles} files, stripped ${totalStripped} sa keys total.`);
