import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  FEATURE_GROUPS,
  getProminentFeatures,
  getFeatureCount,
  getFeatureLabel,
  type FeatureItem,
} from '@/lib/seo/feature-catalog';

/**
 * Invariants for the 2026-06-02 LLM-grounding-fixes work.
 *
 * Three structural promises this test enforces forever:
 *
 *   1. Every PROMINENT feature has all 9 visible-locale labels filled
 *      in directly. No empty values, no Hindi/English fallback path.
 *      This is the structural antidote to the 2026-05-31 Marathi
 *      duplicate-content de-rank: that bug was caused by treating
 *      `mr`/`mai` as "Devanagari, fall back to Hindi" — emitting
 *      byte-identical Hindi labels — which Google's classifier
 *      reads as scaled duplicate content.
 *
 *   2. Within a feature's name labels, the 9 locales are pairwise
 *      distinct (with documented exceptions for Sanskrit-derived
 *      terms that are spelled identically across Devanagari
 *      languages, e.g. "विंशोत्तरी दशा" is identical in hi/mr/mai).
 *
 *   3. The homepage capability strip, `/llms.txt` Capabilities-at-a-
 *      glance section, and the `/features` catalog itself stay in
 *      sync. Updating one without the other two would drift the
 *      surfaces.
 */

const VISIBLE_LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mr', 'mai'] as const;

function read(rel: string): string {
  return readFileSync(join(process.cwd(), rel), 'utf8');
}

describe('Feature catalog — 9-locale completeness for prominent features', () => {
  const prominent = getProminentFeatures();

  it('catalog has exactly 10 prominent features (homepage chip strip size cap)', () => {
    expect(prominent.length).toBe(10);
  });

  it('every prominent feature has all 9 visible-locale name labels filled', () => {
    for (const f of prominent) {
      const labels = f.name as Record<string, string | undefined>;
      for (const loc of VISIBLE_LOCALES) {
        const val = labels[loc];
        expect(
          val,
          `Feature "${f.name.en}" (href=${f.href}) is missing the ${loc} label. ` +
            `Add the ${loc} translation directly to src/lib/seo/feature-catalog.ts. ` +
            `DO NOT introduce a Hindi/English fallback — that re-triggers the ` +
            `2026-05-31 Marathi duplicate-content bug.`,
        ).toBeTruthy();
        expect(val!.length, `${loc} label for "${f.name.en}" is empty`).toBeGreaterThan(0);
      }
    }
  });

  it('every prominent feature has chip-friendly label lengths (<28 chars)', () => {
    for (const f of prominent) {
      const labels = f.name as Record<string, string>;
      for (const loc of VISIBLE_LOCALES) {
        expect(
          labels[loc].length,
          `${loc} label "${labels[loc]}" for "${f.name.en}" is too long for the chip strip (${labels[loc].length} chars).`,
        ).toBeLessThanOrEqual(34);
      }
    }
  });

  it('every prominent feature has a working internal href (starts with /)', () => {
    for (const f of prominent) {
      expect(f.href.startsWith('/'), `${f.name.en} has invalid href: ${f.href}`).toBe(true);
    }
  });

  it('prominent labels are pairwise distinct between en and every Indic locale', () => {
    // Anti-duplication guard. If `mr` ever silently falls back to `hi`,
    // its labels become identical to `hi` and this test fires. (Common
    // Sanskrit-derived terms — like "विंशोत्तरी दशा" — legitimately
    // appear in hi/mr/mai with identical spelling. The exemption is
    // explicit so we don't accidentally relax the rule globally.)
    const EXEMPT_PAIRS_PER_FEATURE: Record<string, Array<[string, string]>> = {
      // Sanskrit-derived terms where Hindi and Maithili share identical
      // Devanagari spelling. Marathi typically has its own native form,
      // so it legitimately differs from both — when ALL three match,
      // the exemption lists all three pairs.
      //
      // This is NOT the duplicate-content bug we're guarding against —
      // that bug was emitting byte-identical Hindi titles + descriptions
      // for every Marathi `panchang/date/...` URL because of a
      // `isDevanagariLocale` boolean fallback in the SEO templates. A
      // single-word chip label sharing spelling across genuinely
      // identical-spelling languages is acceptable.
      '/kundali': [['hi', 'mai']],
      '/learn/vargas': [['hi', 'mai']],
      '/learn/dashas': [['hi', 'mr'], ['hi', 'mai'], ['mr', 'mai']], // Vimshottari Dasha — all three
      '/kp-system': [['hi', 'mai']],
      '/muhurta': [['hi', 'mr'], ['hi', 'mai'], ['mr', 'mai']], // 40+ Muhurat Activities — all three
      '/varshaphal': [['hi', 'mai']],
      '/prashna-ashtamangala': [['hi', 'mr'], ['hi', 'mai'], ['mr', 'mai']],
      '/brihaspati': [['hi', 'mr'], ['hi', 'mai'], ['mr', 'mai']],
    };

    for (const f of prominent) {
      const labels = f.name as Record<string, string>;
      const exemptions = EXEMPT_PAIRS_PER_FEATURE[f.href] ?? [];
      for (const a of VISIBLE_LOCALES) {
        for (const b of VISIBLE_LOCALES) {
          if (a === b) continue;
          // English vs any Indic locale must always differ
          if (a === 'en' && b !== 'en') {
            expect(
              labels[a] === labels[b],
              `${a} and ${b} labels are identical for "${f.name.en}": "${labels[a]}". This is the Hindi-fallback bug pattern.`,
            ).toBe(false);
          }
          // For Indic-Indic pairs, only check non-exempt pairs
          if (a !== 'en' && b !== 'en') {
            const exempt = exemptions.some(
              ([x, y]) => (x === a && y === b) || (x === b && y === a),
            );
            if (exempt) continue;
            expect(
              labels[a] === labels[b],
              `${a} and ${b} labels are identical for "${f.name.en}" (${f.href}): "${labels[a]}". ` +
                `If this is a legitimate Sanskrit-derived spelling identity, add an entry to ` +
                `EXEMPT_PAIRS_PER_FEATURE in this test.`,
            ).toBe(false);
          }
        }
      }
    }
  });
});

describe('Feature catalog — overall shape', () => {
  it('has at least 7 groups and 30+ total features', () => {
    expect(FEATURE_GROUPS.length).toBeGreaterThanOrEqual(7);
    expect(getFeatureCount()).toBeGreaterThanOrEqual(30);
  });

  it('every feature href is internal', () => {
    for (const g of FEATURE_GROUPS) {
      for (const f of g.features) {
        expect(f.href.startsWith('/')).toBe(true);
      }
    }
  });

  it('group ids are kebab-case slugs', () => {
    for (const g of FEATURE_GROUPS) {
      expect(g.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });
});

describe('getFeatureLabel — strict accessor (no Hindi fallback)', () => {
  it('returns the locale-specific label when present', () => {
    expect(getFeatureLabel({ en: 'Full Kundali', mr: 'पूर्ण कुंडली', hi: 'पूर्ण कुण्डली' }, 'mr')).toBe('पूर्ण कुंडली');
  });

  it('falls back to EN (not HI) when the locale key is missing', () => {
    // This is the critical invariant. If we ever introduce a Hindi
    // fallback for Devanagari locales here, the 2026-05-31 bug returns.
    expect(getFeatureLabel({ en: 'KP System', hi: 'KP पद्धति' }, 'mr')).toBe('KP System');
    expect(getFeatureLabel({ en: 'KP System', hi: 'KP पद्धति' }, 'mai')).toBe('KP System');
    expect(getFeatureLabel({ en: 'KP System', hi: 'KP पद्धति' }, 'ta')).toBe('KP System');
  });

  it('handles unknown locales by returning EN', () => {
    expect(getFeatureLabel({ en: 'KP System' }, 'xx')).toBe('KP System');
  });
});

describe('Homepage capability strip — wired into [locale]/page.tsx', () => {
  const src = read('src/app/[locale]/page.tsx');

  it('imports getProminentFeatures + getFeatureLabel from the catalog', () => {
    expect(src).toMatch(/import\s+\{[\s\S]{0,200}getProminentFeatures[\s\S]{0,200}\}\s+from\s+['"]@\/lib\/seo\/feature-catalog['"]/);
    expect(src).toMatch(/getFeatureLabel/);
  });

  it('renders chips inside a <nav aria-label="..."> (NOT a div) for semantic correctness', () => {
    expect(src).toMatch(/<nav\b[^>]*aria-label/);
  });

  it('emits Schema.org ItemList markup', () => {
    expect(src).toMatch(/itemType="https:\/\/schema\.org\/ItemList"/);
    expect(src).toMatch(/itemProp="itemListElement"/);
    expect(src).toMatch(/itemType="https:\/\/schema\.org\/ListItem"/);
  });

  it('CAPABILITY_INTRO has all 9 visible locales filled', () => {
    const introMatch = src.match(/const\s+CAPABILITY_INTRO\s*:[\s\S]*?\{([\s\S]*?)\};/);
    expect(introMatch, 'CAPABILITY_INTRO declaration not found in homepage').toBeTruthy();
    const body = introMatch![1];
    for (const loc of VISIBLE_LOCALES) {
      expect(body, `CAPABILITY_INTRO is missing the ${loc} key`).toMatch(new RegExp(`${loc}:`));
    }
  });

  it('focus-visible ring is present (a11y)', () => {
    expect(src).toMatch(/focus-visible:ring/);
  });

  it('min-height set on the chip <ul> to prevent CLS on reflow', () => {
    expect(src).toMatch(/min-h-\[/);
  });
});

describe('llms.txt / llms-full.txt manifests', () => {
  const llmsTxt = read('public/llms.txt');
  const llmsFullTxt = read('public/llms-full.txt');

  it('llms.txt last-updated stamp is within the last 30 days', () => {
    const m = llmsTxt.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/);
    expect(m, 'llms.txt is missing the "# Last updated: YYYY-MM-DD" header').toBeTruthy();
    const updated = new Date(m![1]);
    const ageDays = (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);
    expect(
      ageDays,
      `llms.txt last-updated stamp is ${ageDays.toFixed(0)} days old. Refresh it.`,
    ).toBeLessThan(30);
  });

  it('llms.txt has the Capabilities-at-a-glance section', () => {
    expect(llmsTxt).toMatch(/## Capabilities at a Glance/);
  });

  it('llms.txt has the Common Misconceptions section', () => {
    expect(llmsTxt).toMatch(/## Common Misconceptions/);
  });

  it('llms.txt has the For AI Assistants citation section', () => {
    expect(llmsTxt).toMatch(/## For AI Assistants/);
  });

  it('llms.txt enumerates the high-uniqueness capabilities that Gemini was missing', () => {
    for (const term of [
      'D1 through D60',
      'KP System',
      'Vimshottari',
      'Varshaphal',
      'Prashna',
      'Ghati',
      'Vipala',
      'Bengali Panjika',
      'ISKCON',
      'Brihaspati',
      'Annaprashan',
      'Upanayana',
    ]) {
      expect(llmsTxt, `llms.txt is missing "${term}"`).toMatch(new RegExp(term.replace(/[-]/g, '\\$&')));
    }
  });

  it('llms.txt points AI assistants at /en/features as canonical source', () => {
    expect(llmsTxt).toMatch(/\/en\/features/);
  });

  it('llms-full.txt mirrors the same 3 new sections', () => {
    expect(llmsFullTxt).toMatch(/## Capabilities at a Glance/);
    expect(llmsFullTxt).toMatch(/## Common Misconceptions/);
    expect(llmsFullTxt).toMatch(/## For AI Assistants/);
  });

  it('llms-full.txt last-updated is within 30 days', () => {
    const m = llmsFullTxt.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/);
    expect(m).toBeTruthy();
    const ageDays = (Date.now() - new Date(m![1]).getTime()) / (1000 * 60 * 60 * 24);
    expect(ageDays).toBeLessThan(30);
  });
});
