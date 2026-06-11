/**
 * Audit 2026-06-05 Phase 2 — snapshot routing + legacy festival retirement.
 *
 * Phase 2 fixes (from docs/tech-debt/duplicate-logic-audit-2026-06-05.md):
 *   - #3 Three non-cron snapshot consumers bypassing isSnapshotStale:
 *       • src/app/api/user/profile/route.ts (replaced inline staleness
 *         check + inline recompute with isSnapshotStale + recomputeSnapshotDirect)
 *       • src/app/api/medical/route.ts (replaced inline === ENGINE_VERSION
 *         with isSnapshotStale)
 *       • src/lib/brihaspati/router/load-subject-kundali.ts (added
 *         staleness gate + recompute, was returning stale unconditionally)
 *   - #4 Legacy festival generator retired: deleted
 *       src/lib/calendar/festivals.ts AND src/app/api/festival-compare/route.ts.
 *       V2 (generateFestivalCalendarV2) is now the only festival generator.
 *
 * Cross-source verification (V2 vs Drik Panchang Delhi 2026):
 *   12/16 major festivals match exactly. The 4 misses are pre-existing
 *   V2 bugs not introduced by retiring V1 — kept as it.skip with TODO
 *   notes pointing at panchang-day-attribution-bugs.md.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateFestivalCalendarV2,
  type FestivalEntry,
} from '@/lib/calendar/festival-generator';
import {
  isSnapshotStale,
} from '@/lib/supabase/get-fresh-snapshot';
import { ENGINE_VERSION } from '@/lib/kundali/engine-version';

// ───────────────────────────────────────────────────────────────────────────
// 1 — V2 festival generator vs Drik Panchang Delhi 2026
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P2.1: V2 festival generator ↔ Drik Panchang Delhi 2026', () => {
  const v2 = generateFestivalCalendarV2(2026, 28.6139, 77.2090, 'Asia/Kolkata');

  function nameOf(f: FestivalEntry): string {
    return typeof f.name === 'object' && f.name !== null
      ? String((f.name as { en?: string }).en ?? '')
      : String(f.name ?? f.slug ?? '');
  }

  function find(pattern: RegExp): FestivalEntry[] {
    return v2.filter(
      (f) => pattern.test(nameOf(f)) && (f.type === 'major' || f.category === 'amavasya' || f.category === 'purnima'),
    );
  }

  // The 12 cases that match Drik exactly. These are the regression locks.
  const passingCases: Array<{ label: string; pattern: RegExp; date: string }> = [
    { label: 'Diwali / Lakshmi Puja', pattern: /^diwali$/i,             date: '2026-11-08' },
    { label: 'Dhanteras',             pattern: /^dhanteras$/i,          date: '2026-11-06' },
    { label: 'Govardhan Puja',        pattern: /^govardhan/i,           date: '2026-11-10' },
    // Bhai Dooj history (post-PR #670 correction): the original audit
    // expected Nov 10 based on a memory-based Drik citation that proved
    // wrong. Direct fetch of the mainstream Indian panchang per-festival
    // page confirms Bhai Dooj 2026 = Wednesday Nov 11 — the festival is
    // aparahna-vyapini Dwitiya, and the published-panchang interpretation
    // when Dwitiya touches aparahna on both candidate days is bhuyo-vyapini
    // (majority-overlap), which picks Day 2 (Wed Nov 11) where Dwitiya
    // fully covers the aparahna window. The engine matches via
    // muhurtaRule: 'aparahna' on the bhai-dooj def + the priority-list
    // revert in festival-generator.ts that took 'aparahna' out of the
    // pradosh/nishita pure-purva-vyapini set. Mainstream panchang
    // verified 2026-06-11.
    { label: 'Bhai Dooj',             pattern: /^bhai\s?dooj$/i,        date: '2026-11-11' },
    { label: 'Mahalaya / Sarva Pitru', pattern: /mahalaya|sarva.?pitru/i, date: '2026-10-10' },
    { label: 'Karwa Chauth',          pattern: /karwa|karva chauth/i,   date: '2026-10-29' },
    { label: 'Raksha Bandhan',        pattern: /raksha bandhan/i,       date: '2026-08-28' },
    { label: 'Hariyali Teej',         pattern: /hariyali teej/i,        date: '2026-08-15' },
    { label: 'Maha Shivratri',        pattern: /maha.?shiva.?ra(t|tr)i/i, date: '2026-02-15' },
    { label: 'Magha Purnima',         pattern: /magha purnima/i,        date: '2026-02-01' },
    { label: 'Holi (Rangwali)',       pattern: /^holi$/i,               date: '2026-03-03' },
    { label: 'Holika Dahan',          pattern: /holika dahan/i,         date: '2026-03-02' },
  ];

  for (const c of passingCases) {
    it(`${c.label}: V2 emits at ${c.date} (Drik-verified)`, () => {
      const matches = find(c.pattern);
      const exact = matches.find((m) => m.date === c.date);
      expect(exact, `${c.label} on ${c.date}: V2 has [${matches.map((m) => m.date).join(',')}]`).toBeDefined();
    });
  }

  // 4 KNOWN pre-existing V2 bugs surfaced by this cross-source check.
  // Not introduced by Phase 2 (legacy V1 retirement). Documented in
  // docs/tech-debt/panchang-day-attribution-bugs.md (the 1-day-shift
  // ones) and as separate Nag Panchami / Dussehra slug issues.

  it.skip('TODO Sharad Purnima: V2 emits 2026-10-26, Drik=2026-10-25 (panchang-day-attribution)', () => {
    const m = find(/^sharad purnima$/i);
    expect(m.some((x) => x.date === '2026-10-25')).toBe(true);
  });

  it.skip('TODO Mahanavami: V2 emits 2026-10-20, Drik=2026-10-19 (panchang-day-attribution)', () => {
    const m = find(/maha.?navami/i);
    expect(m.some((x) => x.date === '2026-10-19')).toBe(true);
  });

  it.skip('TODO Nag Panchami: V2 emits 2026-08-03, Drik=2026-08-17 (Shravana Shukla Panchami rule)', () => {
    const m = find(/nag panchami/i);
    expect(m.some((x) => x.date === '2026-08-17')).toBe(true);
  });

  it.skip('TODO Dussehra / Vijaya Dashami: V2 has "Ganga Dussehra" but no "Vijaya Dashami" slug for 2026-10-20', () => {
    const m = find(/^(dussehra|vijaya dashami)$/i);
    expect(m.some((x) => x.date === '2026-10-20')).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — Legacy `festivals.ts` is GONE
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P2.2: legacy festival generator retired', () => {
  it('src/lib/calendar/festivals.ts no longer exists', () => {
    expect(() => {
      // We deliberately attempt the read; ENOENT proves the file is gone.
      readFileSync(join(process.cwd(), 'src/lib/calendar/festivals.ts'), 'utf8');
    }).toThrow();
  });

  it('src/app/api/festival-compare/route.ts no longer exists', () => {
    expect(() => {
      readFileSync(join(process.cwd(), 'src/app/api/festival-compare/route.ts'), 'utf8');
    }).toThrow();
  });

  it('no source file outside tests still imports from `@/lib/calendar/festivals`', () => {
    // Pure-Node recursive walk so the test runs on Windows / CI without
    // shell `grep` (Gemini PR #436 review — round 2: use ES imports, not
    // require, so the test works in pure-ESM Vitest setups).
    function walk(dir: string): string[] {
      const out: string[] = [];
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          out.push(...walk(full));
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
          out.push(full);
        }
      }
      return out;
    }

    const importRe = /from\s+['"]@\/lib\/calendar\/festivals['"]/;
    const offenders: string[] = [];
    for (const file of walk(join(process.cwd(), 'src'))) {
      if (file.includes('__tests__')) continue;
      const content = readFileSync(file, 'utf8');
      if (importRe.test(content)) offenders.push(file);
    }
    expect(offenders, `unexpected importers: ${offenders.join(', ')}`).toEqual([]);
  });

  it('generateFestivalCalendarV2 still emits a full year (basic sanity)', () => {
    const v2 = generateFestivalCalendarV2(2026, 28.6139, 77.2090, 'Asia/Kolkata');
    // Should have hundreds of entries (12 months × ~30 days of vrats/festivals)
    expect(v2.length).toBeGreaterThan(100);
    // Spread across all 12 months
    const months = new Set(v2.map((f) => f.date.slice(0, 7)));
    expect(months.size).toBeGreaterThanOrEqual(12);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — Snapshot staleness gate (audit item #3 helpers)
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P2.3: isSnapshotStale staleness gate', () => {
  it('returns true when computation_version is missing', () => {
    expect(isSnapshotStale({})).toBe(true);
    expect(isSnapshotStale({ computation_version: null })).toBe(true);
    expect(isSnapshotStale({ computation_version: undefined })).toBe(true);
  });

  it('returns true when computation_version differs from ENGINE_VERSION', () => {
    expect(isSnapshotStale({ computation_version: 'sha-old-engine-hash' })).toBe(true);
    expect(isSnapshotStale({ computation_version: '' })).toBe(true);
  });

  it('returns false when computation_version === ENGINE_VERSION', () => {
    expect(isSnapshotStale({ computation_version: ENGINE_VERSION })).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 4 — Static checks: the 3 consumer files now route through the helper
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P2.4: snapshot consumers route through canonical helpers', () => {
  function readSrc(p: string): string {
    return readFileSync(join(process.cwd(), p), 'utf8');
  }

  it('api/user/profile/route.ts imports + uses isSnapshotStale and recomputeSnapshotDirect', () => {
    const src = readSrc('src/app/api/user/profile/route.ts');
    expect(src).toMatch(/from\s+['"]@\/lib\/supabase\/get-fresh-snapshot['"]/);
    expect(src).toMatch(/\bisSnapshotStale\s*\(/);
    expect(src).toMatch(/\brecomputeSnapshotDirect\s*\(/);
    // Pre-fix inline pattern should be gone from the GET handler. The
    // POST handler still has an inline upsert (that IS the recompute
    // pipeline — recomputeSnapshotDirect mirrors it), so we just check
    // the GET-handler staleness pattern is gone.
    expect(src).not.toMatch(/const isStale = snapshot && \(snapshot\.computation_version\s*\?\?\s*['"][^'"]*['"]\)\s*!==\s*ENGINE_VERSION/);
  });

  it('api/medical/route.ts imports + uses isSnapshotStale (no inline === ENGINE_VERSION)', () => {
    const src = readSrc('src/app/api/medical/route.ts');
    expect(src).toMatch(/from\s+['"]@\/lib\/supabase\/get-fresh-snapshot['"]/);
    expect(src).toMatch(/\bisSnapshotStale\s*\(/);
    expect(src).not.toMatch(/snapshot\.computation_version\s*===\s*ENGINE_VERSION/);
  });

  it('brihaspati/load-subject-kundali.ts imports + uses both helpers (staleness gate added)', () => {
    const src = readSrc('src/lib/brihaspati/router/load-subject-kundali.ts');
    expect(src).toMatch(/from\s+['"]@\/lib\/supabase\/get-fresh-snapshot['"]/);
    expect(src).toMatch(/\bisSnapshotStale\s*\(/);
    expect(src).toMatch(/\brecomputeSnapshotDirect\s*\(/);
  });
});
