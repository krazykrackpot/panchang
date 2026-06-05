/**
 * Audit 2026-06-05 Phase 5h — Festival category colour canonical (#26).
 *
 * Closes the genuine drift portion of #26 — the only piece of the
 * audit's "FestivalCard drift across 5+ surfaces" complaint that
 * involved actual data drift (not visual idiom differences).
 *
 * Before this PR:
 *   - `calendar/Client.tsx:330` map: ekadashi=blue, purnima=amber,
 *     amavasya=purple, sankranti=red. Flat string. /10 opacity.
 *   - `dashboard/FestivalCountdown.tsx:114` function: ekadashi=
 *     emerald, purnima=sky, amavasya=slate, sankranti=amber.
 *     Object shape. /15 opacity.
 *
 * 5 of 8 categories disagreed → users saw ekadashi as blue on the
 * calendar but emerald on the dashboard. Silent visual drift.
 *
 * New canonical: `src/lib/constants/festival-category-colors.ts`
 * exports `FESTIVAL_CATEGORY_COLORS` (Record<FestivalCategory,
 * { bg, text, border, className }>) and `getFestivalCategoryColor`
 * (string-input lookup with fallback for unknown categories like
 * 'eclipse').
 *
 * Both consumers route through the canonical.
 *
 * The refutation portion (no FestivalCard extraction across the
 * other 7 surfaces) is documented in
 * `docs/tech-debt/festival-surfaces-manifest.md`.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  FESTIVAL_CATEGORIES,
  FESTIVAL_CATEGORY_COLORS,
  FESTIVAL_CATEGORY_FALLBACK,
  getFestivalCategoryColor,
} from '@/lib/constants/festival-category-colors';

const repoFile = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

// ───────────────────────────────────────────────────────────────────────────
// 1 — canonical shape + values
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5h.1 (#26): canonical FESTIVAL_CATEGORY_COLORS shape', () => {
  it('covers every category in the FestivalCategory union', () => {
    for (const cat of FESTIVAL_CATEGORIES) {
      expect(FESTIVAL_CATEGORY_COLORS[cat]).toBeDefined();
      expect(FESTIVAL_CATEGORY_COLORS[cat].className).toMatch(/^bg-\S+ text-\S+ border-\S+$/);
    }
  });

  it('emits canonical thematic colours per category', () => {
    // Spot-check the 5 that disagreed before — these are the
    // colours the canonical resolved to, and a future change to
    // them must be deliberate (tests fail loud).
    expect(FESTIVAL_CATEGORY_COLORS.festival.bg).toBe('bg-gold-primary/15');
    expect(FESTIVAL_CATEGORY_COLORS.ekadashi.bg).toBe('bg-emerald-500/15');
    expect(FESTIVAL_CATEGORY_COLORS.purnima.bg).toBe('bg-sky-500/15');
    expect(FESTIVAL_CATEGORY_COLORS.amavasya.bg).toBe('bg-slate-500/15');
    expect(FESTIVAL_CATEGORY_COLORS.sankranti.bg).toBe('bg-amber-500/15');
    // …and the 3 that agreed before — colours preserved.
    expect(FESTIVAL_CATEGORY_COLORS.chaturthi.bg).toBe('bg-orange-500/15');
    expect(FESTIVAL_CATEGORY_COLORS.pradosham.bg).toBe('bg-indigo-500/15');
  });

  it('opacity is normalised to /15 (bg) and /25 (border)', () => {
    for (const cat of FESTIVAL_CATEGORIES) {
      const c = FESTIVAL_CATEGORY_COLORS[cat];
      expect(c.bg).toMatch(/\/15$/);
      expect(c.border).toMatch(/\/25$/);
    }
  });
});

describe('Audit P5h.2 (#26): getFestivalCategoryColor lookup helper', () => {
  it('returns canonical colour for known categories', () => {
    for (const cat of FESTIVAL_CATEGORIES) {
      expect(getFestivalCategoryColor(cat)).toBe(FESTIVAL_CATEGORY_COLORS[cat]);
    }
  });

  it('returns red-themed fallback for unknown categories (e.g., "eclipse")', () => {
    const eclipse = getFestivalCategoryColor('eclipse');
    expect(eclipse).toBe(FESTIVAL_CATEGORY_FALLBACK);
    expect(eclipse.bg).toBe('bg-red-500/15');
  });

  it('fallback exists for any string input', () => {
    expect(getFestivalCategoryColor('nonexistent-category-foo')).toBe(FESTIVAL_CATEGORY_FALLBACK);
    expect(getFestivalCategoryColor('')).toBe(FESTIVAL_CATEGORY_FALLBACK);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — consumer drift guards
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5h.3 (#26): calendar Client.tsx uses canonical', () => {
  const src = repoFile('src/app/[locale]/calendar/Client.tsx');

  it('imports getFestivalCategoryColor', () => {
    expect(src).toMatch(/getFestivalCategoryColor[\s\S]*from\s+['"]@\/lib\/constants\/festival-category-colors['"]/);
  });

  it('no inline categoryColors map remains', () => {
    expect(src).not.toMatch(/const categoryColors:\s*Record<string,\s*string>/);
    // The legacy inline values must not reappear.
    expect(src).not.toMatch(/ekadashi:\s*['"]text-blue-400 bg-blue-500\/10/);
    expect(src).not.toMatch(/purnima:\s*['"]text-amber-300 bg-amber-500\/10/);
  });
});

describe('Audit P5h.4 (#26): dashboard FestivalCountdown.tsx uses canonical', () => {
  const src = repoFile('src/components/dashboard/FestivalCountdown.tsx');

  it('imports getFestivalCategoryColor', () => {
    expect(src).toMatch(/getFestivalCategoryColor[\s\S]*from\s+['"]@\/lib\/constants\/festival-category-colors['"]/);
  });

  it('no inline getCategoryColor function remains', () => {
    expect(src).not.toMatch(/function getCategoryColor\(/);
    // The legacy hard-coded purple-for-major shortcut is also gone.
    expect(src).not.toMatch(/category === ['"]festival['"]\) return \{ bg:\s*['"]bg-purple/);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — Refutation manifest (the audit's "5+ surfaces" claim)
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5h.5 (#26): refutation — the 7 festival surfaces are intentionally different', () => {
  // The audit recommended extracting a single `FestivalCard`
  // component to "consolidate" 5+ surfaces. After surveying the
  // actual code, each surface implements a fundamentally different
  // UX shape per the design spec (docs/superpowers/specs/
  // 2026-05-28-festival-deep-dive-pages-design.md §4A-§4G):
  //
  //   - FestivalClusterTimeline.tsx     — horizontal scrolling day-
  //     cards for multi-day festivals (§4F)
  //   - FestivalHistoricalArchive.tsx   — 2020-2030 dates table (§4G)
  //   - FestivalObservanceCards.tsx     — green/amber do's/don'ts (§4C)
  //   - FestivalPersonalizedAccordion.tsx — 12-rashi reading
  //     accordion (§4A)
  //   - FestivalWishesCarousel.tsx      — copyable greetings (§4B)
  //   - calendar/Client.tsx             — calendar browse row view
  //   - dashboard/FestivalCountdown.tsx — countdown widget with
  //     red ring when ≤1 day
  //   - embed/festivals/page.tsx        — embeddable iframe widget
  //
  // Each has unique props, interactions, hover states, and design
  // tokens. Forcing them through a single `FestivalCard` component
  // would couple unrelated UI concerns — exactly the Phase 3 #7
  // refutation precedent (which the user explicitly endorsed).
  //
  // Refutation is locked in by the existence of this test (so a
  // future audit doesn't re-raise #26 without seeing the analysis)
  // and the manifest doc at
  // `docs/tech-debt/festival-surfaces-manifest.md`.

  const expectedSurfaces = [
    'src/components/festivals/FestivalClusterTimeline.tsx',
    'src/components/festivals/FestivalHistoricalArchive.tsx',
    'src/components/festivals/FestivalObservanceCards.tsx',
    'src/components/festivals/FestivalPersonalizedAccordion.tsx',
    'src/components/festivals/FestivalWishesCarousel.tsx',
    'src/app/[locale]/calendar/Client.tsx',
    'src/components/dashboard/FestivalCountdown.tsx',
    'src/app/embed/festivals/page.tsx',
  ];

  for (const path of expectedSurfaces) {
    it(`surface still exists: ${path}`, () => {
      // If a surface is consolidated into a generic FestivalCard
      // later, this test fails — making the refutation manifest a
      // self-updating audit trail.
      expect(() => repoFile(path)).not.toThrow();
    });
  }

  it('manifest doc exists', () => {
    expect(() => repoFile('docs/tech-debt/festival-surfaces-manifest.md')).not.toThrow();
  });
});
