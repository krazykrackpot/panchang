import { describe, it, expect } from 'vitest';
import { generateUpcomingOccurrences } from '@/lib/vrat/generator';

// Reference location for tests — Delhi, since the festival calendar is
// computed against published Indian panchangs.
const DELHI = { lat: 28.61, lng: 77.20, tz: 'Asia/Kolkata' };
// Fixed reference date so test output is stable.
const FROM_2026_JAN_01 = new Date(Date.UTC(2026, 0, 1));

describe('generateUpcomingOccurrences', () => {
  it('returns [] for an unknown vrat slug', () => {
    expect(
      generateUpcomingOccurrences({
        vratSlug: 'does-not-exist',
        fromDate: FROM_2026_JAN_01,
        location: DELHI,
        tradition: 'smarta',
      }),
    ).toEqual([]);
  });

  it('Ekadashi: 90-day window yields 5-7 occurrences (twice monthly)', () => {
    const out = generateUpcomingOccurrences({
      vratSlug: 'ekadashi',
      fromDate: FROM_2026_JAN_01,
      windowDays: 90,
      location: DELHI,
      tradition: 'smarta',
    });
    // 90 days × ~2 ekadashis/month = ~6 occurrences
    expect(out.length).toBeGreaterThanOrEqual(5);
    expect(out.length).toBeLessThanOrEqual(7);
  });

  it('Ekadashi wildcard: matches all named ekadashi slugs', () => {
    const out = generateUpcomingOccurrences({
      vratSlug: 'ekadashi',
      fromDate: FROM_2026_JAN_01,
      windowDays: 365,
      location: DELHI,
      tradition: 'smarta',
    });
    expect(out.length).toBeGreaterThanOrEqual(20); // 24-26 per year
    // Every occurrence carries the catalogue entry for ekadashi, not the
    // named festival entry — the catalogue is the user-facing identity.
    for (const o of out) {
      expect(o.vrat.slug).toBe('ekadashi');
    }
  });

  it('Vaishnava tradition switches Ekadashi parana rule', () => {
    const smarta = generateUpcomingOccurrences({
      vratSlug: 'ekadashi',
      fromDate: FROM_2026_JAN_01,
      windowDays: 60,
      location: DELHI,
      tradition: 'smarta',
    });
    const vaishnava = generateUpcomingOccurrences({
      vratSlug: 'ekadashi',
      fromDate: FROM_2026_JAN_01,
      windowDays: 60,
      location: DELHI,
      tradition: 'vaishnava',
    });
    // Same dates (festival generator picks one date per Ekadashi tithi).
    expect(smarta.length).toBe(vaishnava.length);
    // Different parana rule labels.
    for (const o of smarta) expect(o.paranaRule).toBe('sunrise_to_tithi_end');
    for (const o of vaishnava) expect(o.paranaRule).toBe('vaishnava_quarter_dwadashi');
  });

  it('Mangalvar (weekday): 90-day window yields ~12-14 Tuesdays', () => {
    const out = generateUpcomingOccurrences({
      vratSlug: 'mangalvar-vrat',
      fromDate: FROM_2026_JAN_01,
      windowDays: 90,
      location: DELHI,
      tradition: 'smarta',
    });
    expect(out.length).toBeGreaterThanOrEqual(12);
    expect(out.length).toBeLessThanOrEqual(14);
    // Every occurrence is a Tuesday in UTC.
    for (const o of out) {
      const [y, m, d] = o.fastDate.split('-').map(Number);
      const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
      expect(dow).toBe(2); // Tuesday
    }
  });

  it('Sankashti Chaturthi carries the moonrise parana rule', () => {
    const out = generateUpcomingOccurrences({
      vratSlug: 'sankashti-chaturthi',
      fromDate: FROM_2026_JAN_01,
      windowDays: 90,
      location: DELHI,
      tradition: 'smarta',
    });
    expect(out.length).toBeGreaterThanOrEqual(2);
    for (const o of out) {
      expect(o.paranaRule).toBe('moonrise');
    }
  });

  it('parana date defaults to fast date + 1 day for sunrise-next-day rules', () => {
    const out = generateUpcomingOccurrences({
      vratSlug: 'mangalvar-vrat',
      fromDate: FROM_2026_JAN_01,
      windowDays: 30,
      location: DELHI,
      tradition: 'smarta',
    });
    for (const o of out) {
      expect(o.paranaDate).toBeDefined();
      const [fy, fm, fd] = o.fastDate.split('-').map(Number);
      const [py, pm, pd] = o.paranaDate!.split('-').map(Number);
      const fastMs = Date.UTC(fy, fm - 1, fd);
      const paranaMs = Date.UTC(py, pm - 1, pd);
      expect(paranaMs - fastMs).toBe(86_400_000); // exactly one day apart
    }
  });

  it('window boundary: returns nothing if windowDays = 0', () => {
    const out = generateUpcomingOccurrences({
      vratSlug: 'mangalvar-vrat',
      fromDate: FROM_2026_JAN_01,
      windowDays: 0,
      location: DELHI,
      tradition: 'smarta',
    });
    expect(out).toEqual([]);
  });

  it('Maha Shivaratri (festival vrat): emits exactly one date per year', () => {
    const out = generateUpcomingOccurrences({
      vratSlug: 'maha-shivaratri',
      fromDate: FROM_2026_JAN_01,
      windowDays: 365,
      location: DELHI,
      tradition: 'smarta',
    });
    expect(out.length).toBe(1);
  });
});
