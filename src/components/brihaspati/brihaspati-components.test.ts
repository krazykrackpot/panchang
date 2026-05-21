/**
 * Structural tests for Brihaspati frontend components.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const COMPONENT_DIR = 'src/components/brihaspati';

function read(file: string): string {
  const p = join(process.cwd(), COMPONENT_DIR, file);
  expect(existsSync(p), `${file} should exist`).toBe(true);
  return readFileSync(p, 'utf8');
}

describe('Brihaspati components — files exist', () => {
  it.each(['BrihaspatiProvider.tsx', 'BrihaspatiButton.tsx', 'BrihaspatiPanel.tsx', 'BrihaspatiBanner.tsx'])(
    '%s is present',
    (f) => {
      expect(existsSync(join(process.cwd(), COMPONENT_DIR, f))).toBe(true);
    },
  );
});

describe('BrihaspatiProvider', () => {
  const src = read('BrihaspatiProvider.tsx');

  it('is a client component', () => {
    expect(src.startsWith("'use client'")).toBe(true);
  });

  it('exposes useBrihaspati hook + Provider', () => {
    expect(src).toMatch(/export function BrihaspatiProvider/);
    expect(src).toMatch(/export function useBrihaspati/);
  });

  it('takes a getAccessToken prop for auth', () => {
    expect(src).toMatch(/getAccessToken/);
  });

  it('preserves the question across the OAuth round-trip via sessionStorage', () => {
    expect(src).toMatch(/dp-brihaspati-pending/);
    expect(src).toMatch(/sessionStorage/);
  });

  it('calls /api/brihaspati/balance + /api/brihaspati/order + /api/brihaspati + /api/brihaspati/rating', () => {
    expect(src).toContain('/api/brihaspati/balance');
    expect(src).toContain('/api/brihaspati/order');
    expect(src).toContain('/api/brihaspati');
    expect(src).toContain('/api/brihaspati/rating');
  });

  it('parses SSE events of type token / done / error', () => {
    expect(src).toMatch(/'token'/);
    expect(src).toMatch(/'done'/);
    expect(src).toMatch(/'error'/);
  });

  it('logs every catch with [brihaspati] tag — no silent failures', () => {
    expect(src).toMatch(/console\.error\(['"`]\[brihaspati\]/);
    expect(src).not.toMatch(/catch\s*\([^)]*\)\s*\{\s*\}/);
  });
});

describe('BrihaspatiButton', () => {
  const src = read('BrihaspatiButton.tsx');

  it('is a client component', () => {
    expect(src.startsWith("'use client'")).toBe(true);
  });

  it('hides when panel is open (returns null on non-closed state)', () => {
    expect(src).toMatch(/state\.kind\s*!==\s*['"]closed['"]/);
  });

  it('uses fixed bottom-right positioning', () => {
    expect(src).toMatch(/fixed bottom-\d+ right-\d+/);
  });

  it('has accessible label', () => {
    expect(src).toMatch(/aria-label/);
  });
});

describe('BrihaspatiPanel', () => {
  const src = read('BrihaspatiPanel.tsx');

  it('is a client component with dialog role + close affordance', () => {
    expect(src.startsWith("'use client'")).toBe(true);
    expect(src).toMatch(/role="dialog"/);
    expect(src).toMatch(/aria-label/);
  });

  it('shows currency toggle when user has no balance', () => {
    expect(src).toMatch(/setCurrency\(['"]INR['"]\)/);
    expect(src).toMatch(/setCurrency\(['"]USD['"]\)/);
  });

  it('renders the 4 pricing tiers from BRIHASPATI_PRICING_TIERS', () => {
    expect(src).toMatch(/BRIHASPATI_PRICING_TIERS/);
  });

  it('includes the locale-aware disclaimer with NASA JPL + refund link', () => {
    expect(src).toMatch(/NASA JPL/);
    expect(src).toMatch(/\/refunds/);
  });

  it('exposes rating UI (thumbs-up / thumbs-down with optional reason)', () => {
    expect(src).toMatch(/rateAnswer\(1\)/);
    expect(src).toMatch(/rateAnswer\(-1/);
  });

  it('locks body scroll when open (mobile sheet UX)', () => {
    expect(src).toMatch(/document\.body\.style\.overflow/);
  });

  it('never references Prokerala / Drik / Shubh (no_competitor_references)', () => {
    expect(src.toLowerCase()).not.toContain('prokerala');
    expect(src.toLowerCase()).not.toContain('drik');
    expect(src.toLowerCase()).not.toContain('shubh');
  });
});

describe('BrihaspatiBanner', () => {
  const src = read('BrihaspatiBanner.tsx');

  it('is a client component', () => {
    expect(src.startsWith("'use client'")).toBe(true);
  });

  it('hides itself when the panel is open', () => {
    expect(src).toMatch(/state\.kind\s*!==\s*['"]closed['"]/);
  });

  it('dismisses for the session + caps at 3 views', () => {
    expect(src).toMatch(/SESSION_DISMISSED/);
    expect(src).toMatch(/VIEW_CAP/);
  });

  it('has a copy table covering every page family (panchang, horoscope, kundali, calendar, choghadiya, dashboard, generic)', () => {
    for (const fam of ['panchang', 'horoscope', 'kundali', 'calendar', 'choghadiya', 'dashboard', 'generic']) {
      expect(src, `family ${fam} missing`).toContain(fam);
    }
  });

  it('shows "free with your plan" when balance exists', () => {
    expect(src).toMatch(/free with your plan/);
  });

  it('never references competitors', () => {
    expect(src.toLowerCase()).not.toContain('prokerala');
    expect(src.toLowerCase()).not.toContain('drik');
    expect(src.toLowerCase()).not.toContain('shubh');
  });
});
