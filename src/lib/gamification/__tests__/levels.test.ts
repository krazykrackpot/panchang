import { describe, it, expect } from 'vitest';
import { LEVELS, LEVEL_BY_ORDINAL, LEVEL_BY_SLUG } from '@/lib/constants/levels';

describe('LEVELS constant', () => {
  it('contains exactly 7 levels in order', () => {
    expect(LEVELS.length).toBe(7);
    expect(LEVELS.map(l => l.ordinal)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
  it('every level has all 10 locales in name', () => {
    const required: (keyof typeof LEVELS[0]['name'])[] = ['en','hi','sa','ta','te','bn','kn','gu','mr','mai'];
    for (const lvl of LEVELS) {
      for (const k of required) expect(lvl.name[k]).toBeTruthy();
    }
  });
  it('LEVEL_BY_ORDINAL and LEVEL_BY_SLUG are consistent', () => {
    expect(LEVEL_BY_ORDINAL[1].slug).toBe('shishya');
    expect(LEVEL_BY_SLUG['rishi'].ordinal).toBe(7);
  });
});
