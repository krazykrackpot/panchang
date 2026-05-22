import { describe, it, expect } from 'vitest';
import { BADGES, BADGE_BY_SLUG } from '@/lib/constants/badges';

describe('BADGES constant', () => {
  it('contains exactly 18 badges', () => {
    expect(BADGES.length).toBe(18);
  });
  it('has 6 distinct categories', () => {
    const cats = new Set(BADGES.map(b => b.category));
    expect(cats.size).toBe(6);
  });
  it('every badge has a unique slug', () => {
    const slugs = new Set(BADGES.map(b => b.slug));
    expect(slugs.size).toBe(BADGES.length);
  });
  it('every badge has 10 locales in name + description', () => {
    const required = ['en','hi','sa','ta','te','bn','kn','gu','mr','mai'] as const;
    for (const b of BADGES) {
      for (const k of required) {
        expect(b.name[k], `badge ${b.slug} missing name[${k}]`).toBeTruthy();
        expect(b.description[k], `badge ${b.slug} missing description[${k}]`).toBeTruthy();
      }
    }
  });
  it('BADGE_BY_SLUG returns the right badge', () => {
    expect(BADGE_BY_SLUG['lit-the-lamp']?.category).toBe('profile');
    expect(BADGE_BY_SLUG['full-moon']?.category).toBe('streak');
  });
});
