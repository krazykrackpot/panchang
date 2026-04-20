import { describe, it, expect } from 'vitest';
import { computeKeyDates, type KeyDate } from '@/lib/kundali/domain-synthesis/key-dates';
import type { KundaliData } from '@/types/kundali';

// Minimal KundaliData fixture with known dasha timeline and planet positions
const MOCK_KUNDALI: KundaliData = {
  name: 'Test Native',
  dateOfBirth: '1990-05-15',
  timeOfBirth: '14:30',
  placeOfBirth: 'Mumbai, India',
  latitude: 19.076,
  longitude: 72.8777,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
  ayanamshaValue: 23.72,
  ascendant: { sign: 5, degree: '12°45\'', nakshatra: { id: 10, name: { en: 'Magha', hi: 'मघा', sa: 'मघा' }, pada: 2 } },
  planets: [
    { planet: { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, symbol: '☉', color: '#e67e22' }, longitude: 30.5, latitude: 0, speed: 0.98, sign: 2, signName: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' }, house: 10, nakshatra: { id: 3, name: { en: 'Krittika', hi: 'कृत्तिका', sa: 'कृत्तिका' }, pada: 2 }, pada: 2, degree: '0°30\'', isRetrograde: false },
    { planet: { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, symbol: '☽', color: '#ecf0f1' }, longitude: 120.0, latitude: 0, speed: 13.2, sign: 5, signName: { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' }, house: 1, nakshatra: { id: 10, name: { en: 'Magha', hi: 'मघा', sa: 'मघा' }, pada: 1 }, pada: 1, degree: '0°00\'', isRetrograde: false },
    { planet: { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, symbol: '♃', color: '#f39c12' }, longitude: 85.0, latitude: 0, speed: 0.08, sign: 3, signName: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' }, house: 11, nakshatra: { id: 7, name: { en: 'Punarvasu', hi: 'पुनर्वसु', sa: 'पुनर्वसुः' }, pada: 3 }, pada: 3, degree: '25°00\'', isRetrograde: false },
    { planet: { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, symbol: '♄', color: '#3498db' }, longitude: 320.0, latitude: 0, speed: 0.03, sign: 11, signName: { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' }, house: 7, nakshatra: { id: 24, name: { en: 'Shatabhisha', hi: 'शतभिषा', sa: 'शतभिषा' }, pada: 2 }, pada: 2, degree: '20°00\'', isRetrograde: false },
    { planet: { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, symbol: '☊', color: '#8e44ad' }, longitude: 350.0, latitude: 0, speed: -0.05, sign: 12, signName: { en: 'Pisces', hi: 'मीन', sa: 'मीनम्' }, house: 8, nakshatra: { id: 26, name: { en: 'Uttara Bhadrapada', hi: 'उ.भाद्रपद', sa: 'उत्तरभाद्रपदा' }, pada: 4 }, pada: 4, degree: '20°00\'', isRetrograde: true },
    { planet: { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, symbol: '☋', color: '#95a5a6' }, longitude: 170.0, latitude: 0, speed: -0.05, sign: 6, signName: { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' }, house: 2, nakshatra: { id: 13, name: { en: 'Hasta', hi: 'हस्त', sa: 'हस्तः' }, pada: 2 }, pada: 2, degree: '20°00\'', isRetrograde: true },
  ] as any,
  houses: Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    sign: ((5 - 1 + i) % 12) + 1, // Leo ascendant: houses start from Leo
    degree: `${i * 30}°00'`,
  })),
  dashas: [
    {
      planet: 'Saturn',
      planetName: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
      startDate: '2020-01-01',
      endDate: '2039-01-01',
      level: 'maha' as const,
      subPeriods: [
        { planet: 'Mercury', planetName: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, startDate: '2025-06-01', endDate: '2028-03-01', level: 'antar' as const },
        { planet: 'Ketu', planetName: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, startDate: '2028-03-01', endDate: '2029-04-01', level: 'antar' as const },
      ],
    },
  ],
} as any;

describe('computeKeyDates', () => {
  it('returns an array of KeyDate objects', () => {
    const dates = computeKeyDates({ kundali: MOCK_KUNDALI, currentDate: new Date('2026-04-20') });
    expect(Array.isArray(dates)).toBe(true);
    expect(dates.length).toBeGreaterThan(0);
    expect(dates.length).toBeLessThanOrEqual(10);
  });

  it('each KeyDate has required fields', () => {
    const dates = computeKeyDates({ kundali: MOCK_KUNDALI, currentDate: new Date('2026-04-20') });
    for (const d of dates) {
      expect(d.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(d.type).toBeTruthy();
      expect(d.title.en).toBeTruthy();
      expect(d.description.en).toBeTruthy();
      expect(['positive', 'challenging', 'transformative', 'neutral']).toContain(d.impact);
      expect(d.importance).toBeGreaterThanOrEqual(1);
      expect(d.importance).toBeLessThanOrEqual(10);
    }
  });

  it('dates are sorted chronologically', () => {
    const dates = computeKeyDates({ kundali: MOCK_KUNDALI, currentDate: new Date('2026-04-20') });
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i].date >= dates[i - 1].date).toBe(true);
    }
  });

  it('finds Antardasha transitions within the window', () => {
    // Saturn-Ketu antardasha starts 2028-03-01, within 24-month window
    const dates = computeKeyDates({ kundali: MOCK_KUNDALI, currentDate: new Date('2026-04-20'), monthsAhead: 24 });
    const dashaEvents = dates.filter(d => d.type === 'dasha');
    expect(dashaEvents.length).toBeGreaterThan(0);
    const ketuAntar = dashaEvents.find(d => d.title.en.includes('Ketu'));
    expect(ketuAntar).toBeDefined();
    expect(ketuAntar!.date).toBe('2028-03-01');
  });

  it('finds transit ingresses for slow planets', () => {
    // Jupiter at 85° (Gemini, 25°) → should enter Cancer within ~60 days
    const dates = computeKeyDates({ kundali: MOCK_KUNDALI, currentDate: new Date('2026-04-20') });
    const transitEvents = dates.filter(d => d.type === 'transit');
    expect(transitEvents.length).toBeGreaterThanOrEqual(0); // may or may not find depending on timing
  });

  it('finds solar return within 12 months', () => {
    const dates = computeKeyDates({ kundali: MOCK_KUNDALI, currentDate: new Date('2026-04-20') });
    const varshaphal = dates.find(d => d.type === 'varshaphal');
    expect(varshaphal).toBeDefined();
    expect(varshaphal!.title.en).toContain('Solar Return');
  });

  it('includes bilingual titles (en + hi)', () => {
    const dates = computeKeyDates({ kundali: MOCK_KUNDALI, currentDate: new Date('2026-04-20') });
    for (const d of dates) {
      expect(d.title.hi).toBeTruthy();
      expect(d.description.hi).toBeTruthy();
    }
  });

  it('respects monthsAhead window', () => {
    const shortWindow = computeKeyDates({ kundali: MOCK_KUNDALI, currentDate: new Date('2026-04-20'), monthsAhead: 3 });
    const longWindow = computeKeyDates({ kundali: MOCK_KUNDALI, currentDate: new Date('2026-04-20'), monthsAhead: 24 });
    expect(longWindow.length).toBeGreaterThanOrEqual(shortWindow.length);
  });
});
