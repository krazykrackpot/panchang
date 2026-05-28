/**
 * Lock for the puja-vidhi HowTo JSON-LD helper.
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4D
 */

import { describe, expect, it } from 'vitest';
import { generateHowToLD } from '../howto-ld';
import { getPujaVidhiBySlug } from '@/lib/constants/puja-vidhi';

const TEST_BASE_URL = 'https://dekhopanchang.com';

describe('generateHowToLD — produces valid HowTo for festivals with puja-vidhi data', () => {
  it('returns a HowTo object for Diwali', () => {
    const out = generateHowToLD({ festivalSlug: 'diwali', locale: 'en', baseUrl: TEST_BASE_URL });
    expect(out).not.toBeNull();
    expect(out!['@context']).toBe('https://schema.org');
    expect(out!['@type']).toBe('HowTo');
    expect(out!.name).toContain('Puja');
  });

  it('returns a HowTo for Ganesh Chaturthi', () => {
    const out = generateHowToLD({ festivalSlug: 'ganesh-chaturthi', locale: 'en', baseUrl: TEST_BASE_URL });
    expect(out).not.toBeNull();
    expect(out!['@type']).toBe('HowTo');
  });

  it('step list mirrors the underlying vidhiSteps in count + order', () => {
    const out = generateHowToLD({ festivalSlug: 'diwali', locale: 'en', baseUrl: TEST_BASE_URL });
    const vidhi = getPujaVidhiBySlug('diwali')!;
    const steps = out!.step as Array<Record<string, unknown>>;
    expect(steps.length).toBe(vidhi.vidhiSteps.length);
    for (let i = 0; i < steps.length; i++) {
      expect(steps[i]['@type']).toBe('HowToStep');
      expect(steps[i].position).toBe(vidhi.vidhiSteps[i].step);
    }
  });

  it('supplies include essential samagri items only', () => {
    const out = generateHowToLD({ festivalSlug: 'diwali', locale: 'en', baseUrl: TEST_BASE_URL });
    const vidhi = getPujaVidhiBySlug('diwali')!;
    const expectedCount = vidhi.samagri.filter((s) => s.essential).length;
    const supplies = out!.supply as Array<Record<string, unknown>> | undefined;
    if (expectedCount > 0) {
      expect(supplies).toBeDefined();
      expect(supplies!.length).toBe(expectedCount);
      for (const s of supplies!) {
        expect(s['@type']).toBe('HowToSupply');
      }
    }
  });

  it('Hindi locale renders Hindi step text', () => {
    const out = generateHowToLD({ festivalSlug: 'diwali', locale: 'hi', baseUrl: TEST_BASE_URL });
    const steps = out!.step as Array<Record<string, unknown>>;
    // Step 1 of Diwali puja in Hindi starts with the "Preparation" rendering
    // — assert at least one step's name contains Devanagari characters.
    const hasDevanagari = steps.some((s) => /[ऀ-ॿ]/.test(String(s.name)));
    expect(hasDevanagari).toBe(true);
  });

  it('step URL anchors to step-N for deep linking', () => {
    const out = generateHowToLD({ festivalSlug: 'diwali', locale: 'en', baseUrl: TEST_BASE_URL });
    const steps = out!.step as Array<Record<string, unknown>>;
    for (const s of steps) {
      expect(String(s.url)).toContain('#step-');
      expect(String(s.url)).toContain('/learn/puja-vidhi/diwali');
    }
  });
});

describe('generateHowToLD — null behavior', () => {
  it('returns null for an unknown festival slug', () => {
    const out = generateHowToLD({ festivalSlug: 'not-a-real-festival', locale: 'en', baseUrl: TEST_BASE_URL });
    expect(out).toBeNull();
  });
});
