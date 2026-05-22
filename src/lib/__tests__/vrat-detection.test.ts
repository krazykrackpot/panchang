/**
 * isVratDay / isVratSlug regression tests.
 *
 * Two component surfaces previously had inline regexes that drifted at PR
 * time — the canonical signal lives in one place now per CLAUDE.md
 * Lesson ZA + "NEVER Duplicate Logic" hard rule.
 */
import { describe, it, expect } from 'vitest';
import { isVratDay, isVratSlug } from '@/lib/calendar/vrat-detection';

describe('isVratSlug', () => {
  it('matches Ekadashi-suffix slugs', () => {
    expect(isVratSlug('nirjala-ekadashi')).toBe(true);
    expect(isVratSlug('devshayani-ekadashi')).toBe(true);
    expect(isVratSlug('kamada-ekadashi')).toBe(true);
  });
  it('matches Teej / Chauth / Savitri / Vrat / Vratam', () => {
    expect(isVratSlug('hartalika-teej')).toBe(true);
    expect(isVratSlug('hariyali-teej')).toBe(true);
    expect(isVratSlug('karwa-chauth')).toBe(true);
    expect(isVratSlug('vat-savitri-vrat')).toBe(true);
    expect(isVratSlug('vat-savitri')).toBe(true);
    expect(isVratSlug('varalakshmi-vratam')).toBe(true);
  });
  it('does NOT match unrelated slugs that contain the substring out of context', () => {
    // "ekadashi" inside a word but not as a suffix should NOT match.
    expect(isVratSlug('great-ekadashi-festival')).toBe(false);
    // "vrat" only at word boundary
    expect(isVratSlug('vratutsav')).toBe(false);
  });
  it('handles null / undefined / empty', () => {
    expect(isVratSlug(undefined)).toBe(false);
    expect(isVratSlug(null)).toBe(false);
    expect(isVratSlug('')).toBe(false);
  });
});

describe('isVratDay', () => {
  it('flags by category', () => {
    expect(isVratDay([{ category: 'vrat' }])).toBe(true);
    expect(isVratDay([{ category: 'ekadashi' }])).toBe(true);
  });
  it('flags by slug when category absent', () => {
    expect(isVratDay([{ slug: 'kamada-ekadashi' }])).toBe(true);
    expect(isVratDay([{ slug: 'karwa-chauth' }])).toBe(true);
  });
  it('returns false for non-vrat festivals', () => {
    expect(isVratDay([{ category: 'festival', slug: 'diwali' }])).toBe(false);
    expect(isVratDay([{ category: 'jayanti', slug: 'ram-navami' }])).toBe(false);
  });
  it('handles empty / undefined', () => {
    expect(isVratDay(undefined)).toBe(false);
    expect(isVratDay([])).toBe(false);
  });
});
