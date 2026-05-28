import { describe, it, expect } from 'vitest';
import { GRAHAS, PLANET_IDS, PLANET_ID_LABEL } from '../grahas';

describe('PLANET_IDS invariants (Lesson Z guardrail)', () => {
  it('every GRAHA id matches its expected name via PLANET_IDS', () => {
    const expected: Array<[number, string]> = [
      [PLANET_IDS.SUN, 'Sun'],
      [PLANET_IDS.MOON, 'Moon'],
      [PLANET_IDS.MARS, 'Mars'],
      [PLANET_IDS.MERCURY, 'Mercury'],
      [PLANET_IDS.JUPITER, 'Jupiter'],
      [PLANET_IDS.VENUS, 'Venus'],
      [PLANET_IDS.SATURN, 'Saturn'],
      [PLANET_IDS.RAHU, 'Rahu'],
      [PLANET_IDS.KETU, 'Ketu'],
    ];
    for (const [id, name] of expected) {
      const g = GRAHAS.find(x => x.id === id);
      expect(g, `PLANET_IDS.${name.toUpperCase()} = ${id} must point to "${name}" in GRAHAS`).toBeDefined();
      expect(g!.name.en).toBe(name);
    }
  });

  it('PLANET_IDS values are contiguous 0..8', () => {
    const values = Object.values(PLANET_IDS).sort((a, b) => a - b);
    expect(values).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('PLANET_ID_LABEL keys cover all PLANET_IDS values', () => {
    for (const v of Object.values(PLANET_IDS)) {
      expect(PLANET_ID_LABEL[v]).toBeDefined();
    }
  });
});
