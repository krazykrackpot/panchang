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

describe('Brihaspati i18n — namespace parity across all locales', () => {
  // sa (Sanskrit) retired May 2026 — bundle removed. mr (Marathi) restored.
  const LOCALES = ['en', 'hi', 'ta', 'bn', 'te', 'kn', 'mr', 'gu', 'mai'] as const;

  function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
    const out: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        out.push(...flatten(v as Record<string, unknown>, key));
      } else {
        out.push(key);
      }
    }
    return out;
  }

  function loadBri(locale: string): Record<string, unknown> {
    const raw = JSON.parse(
      readFileSync(join(process.cwd(), 'src/messages', `${locale}.json`), 'utf8'),
    );
    return raw.brihaspati as Record<string, unknown>;
  }

  it('EN namespace is present and well-formed', () => {
    const en = loadBri('en');
    expect(en).toBeDefined();
    // Use toContain rather than full equality so adding a new sub-namespace
    // (e.g. PR #98 added `homeBanner` for the locale-homepage Brihaspati
    // ribbon, PR #116 added `landing` for the marketing page) doesn't break
    // the parity test before locale rollout catches up. Parity itself is
    // enforced by the next test.
    const enKeys = Object.keys(en);
    for (const required of ['banner', 'button', 'history', 'panel', 'tab']) {
      expect(enKeys, `EN namespace missing '${required}'`).toContain(required);
    }
  });

  it('every locale carries every EN key (parity)', () => {
    const enKeys = new Set(flatten(loadBri('en')));
    for (const locale of LOCALES) {
      const got = new Set(flatten(loadBri(locale)));
      const missing = [...enKeys].filter((k) => !got.has(k));
      expect(missing, `${locale} missing keys: ${missing.join(', ')}`).toEqual([]);
    }
  });

  it('EN disclaimer cites NASA JPL DE441 (per spec — no competitor refs)', () => {
    const en = loadBri('en') as { panel: { disclaimer: string } };
    expect(en.panel.disclaimer).toMatch(/NASA JPL/);
    expect(en.panel.disclaimer.toLowerCase()).not.toContain('prokerala');
    expect(en.panel.disclaimer.toLowerCase()).not.toContain('drik');
    expect(en.panel.disclaimer.toLowerCase()).not.toContain('shubh');
  });

  it('EN banner has copy for every page family used in the component', () => {
    const en = loadBri('en') as { banner: Record<string, string> };
    for (const fam of ['panchang', 'horoscope', 'kundali', 'kundaliEmpty', 'calendar', 'choghadiya', 'dashboard', 'generic']) {
      expect(en.banner[fam], `banner.${fam} missing`).toBeTruthy();
    }
  });
});

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

  it('renders the locale-aware disclaimer + refund link', () => {
    // The disclaimer copy lives in src/messages/<locale>.json under
    // brihaspati.panel.disclaimer; the component just references the key.
    expect(src).toMatch(/panel\.disclaimer/);
    expect(src).toMatch(/panel\.disclaimerRefundLink/);
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

  it('uses the freeWithPlan message when a balance exists', () => {
    // Copy lives in src/messages/<locale>.json under brihaspati.banner.freeWithPlan.
    expect(src).toMatch(/banner\.freeWithPlan/);
  });

  it('never references competitors', () => {
    expect(src.toLowerCase()).not.toContain('prokerala');
    expect(src.toLowerCase()).not.toContain('drik');
    expect(src.toLowerCase()).not.toContain('shubh');
  });
});

describe('BrihaspatiShell currency selection (geo)', () => {
  const src = read('BrihaspatiShell.tsx');

  it('accepts a `country` prop and routes only India to INR', () => {
    // The May 25 2026 incident: hardcoded `initialCurrency = 'INR'`
    // sent every non-Indian user to a Stripe checkout that converted
    // the INR base price via Adaptive Pricing, displaying ~$1.20-2 USD
    // even though the panel said ₹99. Regression guard: India → INR,
    // everyone else → USD.
    expect(src).toMatch(/country\?:\s*string/);
    expect(src).toMatch(/country\s*===\s*['"]IN['"]\s*\?\s*['"]INR['"]\s*:\s*['"]USD['"]/);
  });

  it('does not hardcode the previous always-INR default', () => {
    // Regression guard against the literal that caused the incident.
    expect(src).not.toMatch(/const\s+initialCurrency\s*=\s*['"]INR['"]\s*;/);
  });
});
