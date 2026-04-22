/**
 * Kshaya / Vriddhi Tithi Validation Against Drik Panchang
 *
 * Cross-verified dates from drikpanchang.com for Delhi (28.6139, 77.2090, IST +5.5)
 * Fetched 2026-04-22.
 *
 * Kshaya tithi: a tithi that starts and ends entirely between two sunrises
 *   (no sunrise falls within it — it is "skipped").
 * Vriddhi tithi: a tithi active at two consecutive sunrises (spans 2 days).
 */

import { describe, it, expect } from 'vitest';
import { computePanchang } from '@/lib/ephem/panchang-calc';

const DELHI = { lat: 28.6139, lng: 77.2090, tz: 5.5, name: 'Delhi' };

function panchang(year: number, month: number, day: number) {
  return computePanchang({
    year, month, day,
    lat: DELHI.lat, lng: DELHI.lng, tzOffset: DELHI.tz,
    timezone: 'Asia/Kolkata', locationName: DELHI.name,
  });
}

describe('Kshaya/Vriddhi Tithi — Drik Panchang cross-validation (Delhi 2026)', () => {
  describe('Kshaya tithis', () => {
    it('Jan 6: K. Chaturthi is kshaya (08:01-06:52 next day, ends before sunrise)', () => {
      // Drik: Tritiya until 08:01 → Chaturthi 08:01 to 06:52 Jan 7 → sunrise ~07:15
      const p = panchang(2026, 1, 6);
      expect(p.kshayaTithi).toBeDefined();
      expect(p.kshayaTithi!.tithi.name.en).toContain('Chaturthi');
    });

    it('Jan 31: S. Chaturdashi is kshaya (08:25-05:52 next day, ends before sunrise)', () => {
      // Drik: Trayodashi until 08:25 → Chaturdashi 08:25 to 05:52 Feb 1 → sunrise ~07:06
      const p = panchang(2026, 1, 31);
      expect(p.kshayaTithi).toBeDefined();
      expect(p.kshayaTithi!.tithi.name.en).toContain('Chaturdashi');
    });

    it('Feb 24: S. Ashtami is kshaya (07:01-04:51 next day, ends before sunrise)', () => {
      // Drik: Saptami until 07:01 → Ashtami 07:01 to 04:51 Feb 25 → sunrise ~06:50
      const p = panchang(2026, 2, 24);
      expect(p.kshayaTithi).toBeDefined();
      expect(p.kshayaTithi!.tithi.name.en).toContain('Ashtami');
    });
  });

  describe('Vriddhi tithis', () => {
    it('Jan 9: K. Saptami is vriddhi (active at both Jan 9 and Jan 10 sunrises)', () => {
      // Drik: Saptami starts 07:05 Jan 9, ends 08:23 Jan 10 — spans 2 sunrises
      const p = panchang(2026, 1, 9);
      expect(p.vriddhiTithi).toBe(true);
      expect(p.tithi.name.en).toContain('Saptami');
    });
  });

  describe('Normal tithis (no kshaya, no vriddhi)', () => {
    it('Jan 1: normal tithi (no kshaya or vriddhi)', () => {
      const p = panchang(2026, 1, 1);
      expect(p.kshayaTithi).toBeUndefined();
      // vriddhiTithi can be undefined or false
      expect(p.vriddhiTithi).toBeFalsy();
    });

    it('Jan 15: normal tithi', () => {
      const p = panchang(2026, 1, 15);
      expect(p.kshayaTithi).toBeUndefined();
      expect(p.vriddhiTithi).toBeFalsy();
    });
  });
});
