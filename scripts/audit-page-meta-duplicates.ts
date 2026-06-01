#!/usr/bin/env npx tsx
/**
 * scripts/audit-page-meta-duplicates.ts
 *
 * Triage tool for the sitewide duplicate-content debt surfaced by GSC
 * Coverage Validation (2026-06-01). Walks every PAGE_META entry in
 * src/lib/seo/metadata.ts and flags entries where two or more locales
 * emit BYTE-IDENTICAL title or description strings — the structural
 * signal that triggers Google's duplicate-content de-rank.
 *
 * Usage: npx tsx scripts/audit-page-meta-duplicates.ts
 *
 * Output: per-route lines like
 *   /calendar/regional/odia: title has 5 dup cluster(s) — ta=te=bn=gu=kn
 *   /stories: description has 5 dup cluster(s) — ta=te=bn=gu=kn
 *
 * Exit code: 0 always (informational). Wire to CI as a watchlist once
 * the baseline is shrunk.
 */

import { PAGE_META } from '../src/lib/seo/metadata';
import { locales } from '../src/lib/i18n/config';

type DupCluster = string[]; // locales that all share the same string

function findDuplicates(strs: Record<string, string | undefined>): DupCluster[] {
  // Group locales by the string they emit. Any group with size >= 2
  // is a duplicate cluster.
  const groups = new Map<string, string[]>();
  for (const loc of locales) {
    const v = strs[loc];
    if (v == null || v === '') continue;
    const arr = groups.get(v) ?? [];
    arr.push(loc);
    groups.set(v, arr);
  }
  return [...groups.values()].filter((arr) => arr.length >= 2);
}

function main() {
  const entries = Object.entries(PAGE_META);
  let totalRoutes = 0;
  let routesWithTitleDups = 0;
  let routesWithDescDups = 0;
  const findings: Array<{ route: string; dimension: 'title' | 'description'; clusters: DupCluster[] }> = [];

  for (const [route, meta] of entries) {
    totalRoutes++;
    if (meta.title) {
      const dups = findDuplicates(meta.title as Record<string, string | undefined>);
      if (dups.length > 0) {
        routesWithTitleDups++;
        findings.push({ route, dimension: 'title', clusters: dups });
      }
    }
    if (meta.description) {
      const dups = findDuplicates(meta.description as Record<string, string | undefined>);
      if (dups.length > 0) {
        routesWithDescDups++;
        findings.push({ route, dimension: 'description', clusters: dups });
      }
    }
  }

  console.log(`[audit-page-meta-duplicates]`);
  console.log(`  total routes scanned:    ${totalRoutes}`);
  console.log(`  routes with title dups:  ${routesWithTitleDups}`);
  console.log(`  routes with desc dups:   ${routesWithDescDups}`);
  console.log(`  total findings:          ${findings.length}`);
  console.log('');
  console.log('Findings (truncated to first 50):');
  for (const f of findings.slice(0, 50)) {
    const clusterDesc = f.clusters
      .map((c) => c.join('='))
      .join('  |  ');
    console.log(`  ${f.route}: ${f.dimension} dup → ${clusterDesc}`);
  }
  if (findings.length > 50) {
    console.log(`  ... ${findings.length - 50} more not shown`);
  }
}

main();
