/**
 * Panchang calculation tests (migrated to Vitest)
 */

import { describe, it, expect } from 'vitest';
import { computePanchang } from '../panchang-calc';

// Test Delhi, Jan 15, 2025 (known date, Wednesday)
const p = computePanchang({
  year: 2025,
  month: 1,
  day: 15,
  lat: 28.6139,
  lng: 77.209,
  tzOffset: 5.5,
  locationName: 'Delhi',
});

describe('computePanchang (Delhi Jan 15 2025)', () => {
  describe('basic fields', () => {
    it('date correct', () => {
      expect(p.date).toBe('2025-01-15');
    });

    it('tithi exists', () => {
      expect(p.tithi?.name?.en).toBeTruthy();
    });

    it('tithi number valid (1-30)', () => {
      expect(p.tithi.number).toBeGreaterThanOrEqual(1);
      expect(p.tithi.number).toBeLessThanOrEqual(30);
    });

    it('tithi paksha valid', () => {
      expect(['shukla', 'krishna']).toContain(p.tithi.paksha);
    });

    it('nakshatra exists', () => {
      expect(p.nakshatra?.name?.en).toBeTruthy();
    });

    it('nakshatra has name', () => {
      expect(p.nakshatra.name.en).toBeTruthy();
    });

    it('yoga exists', () => {
      expect(p.yoga?.name?.en).toBeTruthy();
    });

    it('karana exists', () => {
      expect(p.karana?.name?.en).toBeTruthy();
    });

    it('vara exists', () => {
      expect(p.vara?.name?.en).toBeTruthy();
    });

    it('vara day 0-6', () => {
      expect(p.vara.day).toBeGreaterThanOrEqual(0);
      expect(p.vara.day).toBeLessThanOrEqual(6);
    });
  });

  describe('time fields', () => {
    it('sunrise HH:MM', () => {
      expect(p.sunrise).toMatch(/^\d{2}:\d{2}$/);
    });

    it('sunset HH:MM', () => {
      expect(p.sunset).toMatch(/^\d{2}:\d{2}$/);
    });

    it('moonrise HH:MM', () => {
      expect(p.moonrise).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('rahu kaal', () => {
    it('rahu kaal start HH:MM', () => {
      expect(p.rahuKaal.start).toMatch(/^\d{2}:\d{2}$/);
    });

    it('rahu kaal end HH:MM', () => {
      expect(p.rahuKaal.end).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('transition times', () => {
    it('tithi transition exists', () => {
      expect(p.tithiTransition?.endTime).toBeTruthy();
    });

    it('nakshatra transition exists', () => {
      expect(p.nakshatraTransition?.endTime).toBeTruthy();
    });

    it('yoga transition exists', () => {
      expect(p.yogaTransition?.endTime).toBeTruthy();
    });
  });

  describe('muhurtas', () => {
    it('muhurtas count = 30', () => {
      expect(p.muhurtas).toHaveLength(30);
    });
  });

  describe('choghadiya', () => {
    it('choghadiya count = 16', () => {
      expect(p.choghadiya).toHaveLength(16);
    });
  });

  describe('hora', () => {
    it('hora count = 24', () => {
      expect(p.hora).toHaveLength(24);
    });
  });

  describe('planets', () => {
    it('planets count = 9', () => {
      expect(p.planets).toHaveLength(9);
    });
  });

  describe('enhanced fields', () => {
    it('disha shool exists', () => {
      expect(p.dishaShool?.direction?.en).toBeTruthy();
    });

    it('shiva vaas exists', () => {
      expect(p.shivaVaas?.name?.en).toBeTruthy();
    });

    it('agni vaas exists', () => {
      expect(p.agniVaas?.name?.en).toBeTruthy();
    });

    it('chandra vaas exists', () => {
      expect(p.chandraVaas?.name?.en).toBeTruthy();
    });

    it('rahu vaas exists', () => {
      expect(p.rahuVaas?.direction?.en).toBeTruthy();
    });

    it('kali ahargana > 1800000', () => {
      expect(p.kaliAhargana).toBeGreaterThan(1800000);
    });

    it('julian day > 2460000', () => {
      expect(p.julianDay).toBeGreaterThan(2460000);
    });

    it('ayanamsha ~24 degrees', () => {
      expect(p.ayanamsha).toBeGreaterThan(23);
      expect(p.ayanamsha).toBeLessThan(25);
    });
  });

  describe('new fields', () => {
    it('tamil yoga exists', () => {
      expect(p.tamilYoga?.name?.en).toBeTruthy();
    });

    it('mantri mandala exists', () => {
      expect(p.mantriMandala?.king?.planet).not.toBeUndefined();
    });

    it('homahuti exists', () => {
      expect(p.homahuti?.direction?.en).toBeTruthy();
    });

    it('udaya lagna array', () => {
      expect(Array.isArray(p.udayaLagna)).toBe(true);
      expect(p.udayaLagna.length).toBeGreaterThan(0);
    });
  });

  describe('udaya lagna sanity', () => {
    it('udaya lagna has rashi 1-12', () => {
      expect(p.udayaLagna.every((l: { rashi: number }) => l.rashi >= 1 && l.rashi <= 12)).toBe(true);
    });

    it('udaya lagna has time strings', () => {
      expect(p.udayaLagna.every((l: { start: string }) => /^\d{2}:\d{2}$/.test(l.start))).toBe(true);
    });
  });

  describe('trilingual support', () => {
    it('tithi has Hindi', () => {
      expect(p.tithi.name.hi).toBeTruthy();
    });

    it('tithi has Sanskrit', () => {
      expect(p.tithi.name.sa).toBeTruthy();
    });

    it('nakshatra has Hindi', () => {
      expect(p.nakshatra.name.hi).toBeTruthy();
    });
  });
});
