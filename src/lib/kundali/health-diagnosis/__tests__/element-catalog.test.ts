// src/lib/kundali/health-diagnosis/__tests__/element-catalog.test.ts
import { describe, it, expect } from 'vitest';
import { ELEMENT_CATALOG, ELEMENT_IDS, DEFAULT_VISIBLE_IDS, EXTENDED_IDS } from '../element-catalog';
import type { ElementId } from '../types';

describe('element-catalog', () => {
  it('has exactly 22 elements', () => {
    expect(ELEMENT_IDS).toHaveLength(22);
  });

  it('default-visible set has 19 elements', () => {
    expect(DEFAULT_VISIBLE_IDS).toHaveLength(19);
  });

  it('extended (opt-in) set has 3 elements: allergies, cancer, longevity', () => {
    expect(EXTENDED_IDS.sort()).toEqual(['allergies', 'cancer', 'longevity']);
  });

  it('every element has metadata: name, category, badge, primarySignificators', () => {
    for (const id of ELEMENT_IDS) {
      const meta = ELEMENT_CATALOG[id];
      expect(meta.name.en).toBeTruthy();
      expect(['physical', 'mental', 'systemic', 'longevity']).toContain(meta.category);
      expect(['classical', 'inferential', 'mixed']).toContain(meta.badge);
      expect(meta.primarySignificators.planets.length).toBeGreaterThan(0);
      expect(meta.primarySignificators.houses.length).toBeGreaterThan(0);
    }
  });

  it('default+extended is a partition of all ids', () => {
    const union = new Set<ElementId>([...DEFAULT_VISIBLE_IDS, ...EXTENDED_IDS]);
    expect(union.size).toBe(22);
  });

  it('disclaimer-gated elements are exactly psychiatric, cancer, longevity', () => {
    const gated = ELEMENT_IDS.filter(id => ELEMENT_CATALOG[id].requiresDisclaimer);
    expect(gated.sort()).toEqual(['cancer', 'longevity', 'psychiatric']);
  });
});
