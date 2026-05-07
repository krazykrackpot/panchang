import { describe, it, expect } from 'vitest';
import { computeSankrantis, resolveSolarFestivals } from '@/lib/calendar/solar-festivals';

describe('computeSankrantis', () => {
  const IST = 'Asia/Kolkata';
  const sankrantis2026 = computeSankrantis(2026, IST);

  it('returns 12 entries (one per sign)', () => {
    expect(sankrantis2026).toHaveLength(12);
  });

  it('Makar Sankranti (signId=10) falls in January', () => {
    const makar = sankrantis2026.find(s => s.signId === 10);
    expect(makar).toBeDefined();
    expect(makar!.date).toMatch(/^2026-01/);
    // Typically Jan 14 or 15
    const day = parseInt(makar!.date.split('-')[2], 10);
    expect(day).toBeGreaterThanOrEqual(13);
    expect(day).toBeLessThanOrEqual(16);
    expect(makar!.isUttarayana).toBe(true);
  });

  it('Mesh Sankranti (signId=1) falls in April', () => {
    const mesh = sankrantis2026.find(s => s.signId === 1);
    expect(mesh).toBeDefined();
    expect(mesh!.date).toMatch(/^2026-04/);
    // Typically Apr 13-15
    const day = parseInt(mesh!.date.split('-')[2], 10);
    expect(day).toBeGreaterThanOrEqual(12);
    expect(day).toBeLessThanOrEqual(16);
  });

  it('Karka Sankranti (signId=4) falls in July and has isDakshinayana', () => {
    const karka = sankrantis2026.find(s => s.signId === 4);
    expect(karka).toBeDefined();
    expect(karka!.date).toMatch(/^2026-07/);
    expect(karka!.isDakshinayana).toBe(true);
  });

  it('all 12 dates are in chronological order', () => {
    for (let i = 1; i < sankrantis2026.length; i++) {
      expect(sankrantis2026[i].jd).toBeGreaterThan(sankrantis2026[i - 1].jd);
    }
  });

  it('each entry has valid date and time formats', () => {
    for (const s of sankrantis2026) {
      expect(s.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.time).toMatch(/^\d{2}:\d{2}$/);
      expect(s.signId).toBeGreaterThanOrEqual(1);
      expect(s.signId).toBeLessThanOrEqual(12);
      expect(s.signName.en).toBeTruthy();
    }
  });

  it('works for Europe/Zurich timezone', () => {
    const zurich = computeSankrantis(2026, 'Europe/Zurich');
    expect(zurich).toHaveLength(12);
    const makar = zurich.find(s => s.signId === 10);
    expect(makar).toBeDefined();
    expect(makar!.date).toMatch(/^2026-01/);
  });

  it('covers all 12 sign IDs', () => {
    const signIds = new Set(sankrantis2026.map(s => s.signId));
    expect(signIds.size).toBe(12);
    for (let i = 1; i <= 12; i++) {
      expect(signIds.has(i)).toBe(true);
    }
  });
});

describe('resolveSolarFestivals', () => {
  const resolved = resolveSolarFestivals(2026, 'Asia/Kolkata');

  it('returns festivals for all defined solar festival entries', () => {
    // SOLAR_FESTIVALS has 22 entries
    expect(resolved.length).toBeGreaterThanOrEqual(20);
  });

  it('Makar Sankranti is resolved', () => {
    const makar = resolved.find(f => f.slug === 'makar-sankranti');
    expect(makar).toBeDefined();
    expect(makar!.date).toMatch(/^2026-01/);
    expect(makar!.signId).toBe(10);
    expect(makar!.isUttarayana).toBe(true);
  });

  it('Lohri is one day before Makar Sankranti', () => {
    const lohri = resolved.find(f => f.slug === 'lohri');
    const makar = resolved.find(f => f.slug === 'makar-sankranti');
    expect(lohri).toBeDefined();
    expect(makar).toBeDefined();
    expect(lohri!.dayOffset).toBe(-1);
    // Lohri date should be the day before Makar Sankranti
    const lohriDay = parseInt(lohri!.date.split('-')[2], 10);
    const makarDay = parseInt(makar!.date.split('-')[2], 10);
    expect(lohriDay).toBe(makarDay - 1);
  });

  it('Karka Sankranti has isDakshinayana', () => {
    const karka = resolved.find(f => f.slug === 'karka-sankranti');
    expect(karka).toBeDefined();
    expect(karka!.isDakshinayana).toBe(true);
  });
});
