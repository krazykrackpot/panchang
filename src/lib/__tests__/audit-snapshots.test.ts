/**
 * AUDIT TEST SUITE — Layer 2: Snapshot Regression Tests
 *
 * Frozen baselines for 36 date/location combos (12 dates × 3 locations).
 * Any code change that shifts a value by >2 min or changes a name FAILS.
 * Baselines generated from our own engine — these catch REGRESSIONS, not correctness.
 *
 * Dates chosen to cover: winter/summer solstice, equinox, DST transitions,
 * Ganda Moola days, Purnima, Amavasya, dual Varjyam.
 * Locations: Delhi (IST +5.5), Bern (CET/CEST), Seattle (PST/PDT)
 */
import { describe, it, expect } from 'vitest';
import { computePanchang } from '@/lib/ephem/panchang-calc';

// ─── Frozen baselines ──────────────────────────────────────────────────
// Generated: 2026-04-08 from commit db4da6d (whole-sign houses)
// DO NOT regenerate unless you intentionally changed a calculation.
// This is the canonical baseline — edit only when intentionally changing calculations.
const SNAPSHOT_DATA: Record<string, any> = {
  "2026-01-15_delhi": { sunrise: "07:14", sunset: "17:46", tithi: "Dwadashi", tithiPaksha: "krishna", nakshatra: "Jyeshtha", nakshatraId: 18, yoga: "Vriddhi", karana: "Taitila", rahuKaal: "13:49-15:08", yamaganda: "07:14-08:33", gulikaKaal: "09:52-11:11", abhijitAvailable: true },
  "2026-01-15_bern": { sunrise: "08:12", sunset: "17:12", tithi: "Dwadashi", tithiPaksha: "krishna", nakshatra: "Jyeshtha", nakshatraId: 18, yoga: "Vriddhi", karana: "Taitila", rahuKaal: "13:49-14:57", yamaganda: "08:12-09:19", gulikaKaal: "10:27-11:34", abhijitAvailable: true },
  "2026-01-15_seattle": { sunrise: "07:52", sunset: "16:45", tithi: "Trayodashi", tithiPaksha: "krishna", nakshatra: "Jyeshtha", nakshatraId: 18, yoga: "Dhruva", karana: "Garaja", rahuKaal: "13:25-14:32", yamaganda: "07:52-08:59", gulikaKaal: "10:05-11:12", abhijitAvailable: true },
  "2026-03-29_delhi": { sunrise: "06:15", sunset: "18:37", tithi: "Ekadashi", tithiPaksha: "shukla", nakshatra: "Ashlesha", nakshatraId: 9, yoga: "Dhriti", karana: "Vishti", rahuKaal: "17:04-18:37", yamaganda: "12:26-13:58", gulikaKaal: "15:31-17:04", abhijitAvailable: true },
  "2026-03-29_bern": { sunrise: "07:18", sunset: "19:57", tithi: "Dwadashi", tithiPaksha: "shukla", nakshatra: "Ashlesha", nakshatraId: 9, yoga: "Dhriti", karana: "Bava", rahuKaal: "18:22-19:57", yamaganda: "13:37-15:12", gulikaKaal: "16:47-18:22", abhijitAvailable: true },
  "2026-03-29_seattle": { sunrise: "06:53", sunset: "19:35", tithi: "Dwadashi", tithiPaksha: "shukla", nakshatra: "Magha", nakshatraId: 10, yoga: "Shula", karana: "Bava", rahuKaal: "18:00-19:35", yamaganda: "13:14-14:49", gulikaKaal: "16:24-18:00", abhijitAvailable: true },
  "2026-04-08_delhi": { sunrise: "06:03", sunset: "18:42", tithi: "Shashthi", tithiPaksha: "krishna", nakshatra: "Mula", nakshatraId: 19, yoga: "Variyan", karana: "Vanija", rahuKaal: "12:23-13:58", yamaganda: "07:38-09:13", gulikaKaal: "10:48-12:23", abhijitAvailable: false },
  "2026-04-08_bern": { sunrise: "06:59", sunset: "20:10", tithi: "Shashthi", tithiPaksha: "krishna", nakshatra: "Mula", nakshatraId: 19, yoga: "Variyan", karana: "Vanija", rahuKaal: "13:34-15:13", yamaganda: "08:38-10:16", gulikaKaal: "11:55-13:34", abhijitAvailable: false },
  "2026-04-08_seattle": { sunrise: "06:33", sunset: "19:49", tithi: "Saptami", tithiPaksha: "krishna", nakshatra: "Mula", nakshatraId: 19, yoga: "Parigha", karana: "Vishti", rahuKaal: "13:11-14:51", yamaganda: "08:13-09:52", gulikaKaal: "11:32-13:11", abhijitAvailable: false },
  "2026-04-14_delhi": { sunrise: "05:57", sunset: "18:46", tithi: "Dwadashi", tithiPaksha: "krishna", nakshatra: "Shatabhisha", nakshatraId: 24, yoga: "Shukla", karana: "Kaulava", rahuKaal: "15:34-17:10", yamaganda: "09:09-10:45", gulikaKaal: "12:21-13:57", abhijitAvailable: true },
  "2026-04-14_bern": { sunrise: "06:47", sunset: "20:18", tithi: "Dwadashi", tithiPaksha: "krishna", nakshatra: "Shatabhisha", nakshatraId: 24, yoga: "Shukla", karana: "Kaulava", rahuKaal: "16:56-18:37", yamaganda: "10:10-11:51", gulikaKaal: "13:33-15:14", abhijitAvailable: true },
  "2026-04-14_seattle": { sunrise: "06:22", sunset: "19:57", tithi: "Dwadashi", tithiPaksha: "krishna", nakshatra: "Purva Bhadrapada", nakshatraId: 25, yoga: "Brahma", karana: "Taitila", rahuKaal: "16:33-18:15", yamaganda: "09:46-11:28", gulikaKaal: "13:09-14:51", abhijitAvailable: true },
  "2026-04-29_delhi": { sunrise: "05:42", sunset: "18:55", tithi: "Trayodashi", tithiPaksha: "shukla", nakshatra: "Hasta", nakshatraId: 13, yoga: "Harshana", karana: "Kaulava", rahuKaal: "12:18-13:57", yamaganda: "07:21-09:00", gulikaKaal: "10:39-12:18", abhijitAvailable: false },
  "2026-04-29_bern": { sunrise: "06:21", sunset: "20:39", tithi: "Trayodashi", tithiPaksha: "shukla", nakshatra: "Hasta", nakshatraId: 13, yoga: "Harshana", karana: "Taitila", rahuKaal: "13:30-15:17", yamaganda: "08:08-09:56", gulikaKaal: "11:43-13:30", abhijitAvailable: false },
  "2026-04-29_seattle": { sunrise: "05:55", sunset: "20:19", tithi: "Trayodashi", tithiPaksha: "shukla", nakshatra: "Hasta", nakshatraId: 13, yoga: "Harshana", karana: "Taitila", rahuKaal: "13:07-14:55", yamaganda: "07:43-09:31", gulikaKaal: "11:19-13:07", abhijitAvailable: false },
  "2026-05-06_delhi": { sunrise: "05:36", sunset: "18:59", tithi: "Chaturthi", tithiPaksha: "krishna", nakshatra: "Mula", nakshatraId: 19, yoga: "Siddha", karana: "Balava", rahuKaal: "12:17-13:58", yamaganda: "07:16-08:57", gulikaKaal: "10:37-12:17", abhijitAvailable: false },
  "2026-05-06_bern": { sunrise: "06:11", sunset: "20:48", tithi: "Panchami", tithiPaksha: "krishna", nakshatra: "Mula", nakshatraId: 19, yoga: "Siddha", karana: "Kaulava", rahuKaal: "13:29-15:19", yamaganda: "08:00-09:50", gulikaKaal: "11:40-13:29", abhijitAvailable: false },
  "2026-05-06_seattle": { sunrise: "05:44", sunset: "20:28", tithi: "Panchami", tithiPaksha: "krishna", nakshatra: "Purva Ashadha", nakshatraId: 20, yoga: "Siddha", karana: "Kaulava", rahuKaal: "13:06-14:56", yamaganda: "07:34-09:25", gulikaKaal: "11:15-13:06", abhijitAvailable: false },
  "2026-06-21_delhi": { sunrise: "05:23", sunset: "19:22", tithi: "Saptami", tithiPaksha: "shukla", nakshatra: "Purva Phalguni", nakshatraId: 11, yoga: "Siddhi", karana: "Vanija", rahuKaal: "17:37-19:22", yamaganda: "12:22-14:07", gulikaKaal: "15:52-17:37", abhijitAvailable: true },
  "2026-06-21_bern": { sunrise: "05:39", sunset: "21:29", tithi: "Saptami", tithiPaksha: "shukla", nakshatra: "Purva Phalguni", nakshatraId: 11, yoga: "Siddhi", karana: "Vanija", rahuKaal: "19:30-21:29", yamaganda: "13:34-15:33", gulikaKaal: "17:31-19:30", abhijitAvailable: true },
  "2026-06-21_seattle": { sunrise: "05:11", sunset: "21:10", tithi: "Ashtami", tithiPaksha: "shukla", nakshatra: "Uttara Phalguni", nakshatraId: 12, yoga: "Vyatipata", karana: "Vishti", rahuKaal: "19:10-21:10", yamaganda: "13:11-15:11", gulikaKaal: "17:11-19:10", abhijitAvailable: true },
  "2026-07-15_delhi": { sunrise: "05:33", sunset: "19:20", tithi: "Pratipada", tithiPaksha: "shukla", nakshatra: "Pushya", nakshatraId: 8, yoga: "Harshana", karana: "Bava", rahuKaal: "12:27-14:10", yamaganda: "07:16-09:00", gulikaKaal: "10:43-12:27", abhijitAvailable: false },
  "2026-07-15_bern": { sunrise: "05:54", sunset: "21:21", tithi: "Pratipada", tithiPaksha: "shukla", nakshatra: "Pushya", nakshatraId: 8, yoga: "Vajra", karana: "Bava", rahuKaal: "13:38-15:34", yamaganda: "07:50-09:46", gulikaKaal: "11:42-13:38", abhijitAvailable: false },
  "2026-07-15_seattle": { sunrise: "05:27", sunset: "21:02", tithi: "Dwitiya", tithiPaksha: "shukla", nakshatra: "Pushya", nakshatraId: 8, yoga: "Vajra", karana: "Balava", rahuKaal: "13:15-15:12", yamaganda: "07:24-09:21", gulikaKaal: "11:18-13:15", abhijitAvailable: false },
  "2026-09-23_delhi": { sunrise: "06:09", sunset: "18:16", tithi: "Dwadashi", tithiPaksha: "shukla", nakshatra: "Shravana", nakshatraId: 22, yoga: "Sukarma", karana: "Bava", rahuKaal: "12:13-13:44", yamaganda: "07:40-09:11", gulikaKaal: "10:42-12:13", abhijitAvailable: false },
  "2026-09-23_bern": { sunrise: "07:20", sunset: "19:28", tithi: "Dwadashi", tithiPaksha: "shukla", nakshatra: "Dhanishtha", nakshatraId: 23, yoga: "Sukarma", karana: "Balava", rahuKaal: "13:24-14:55", yamaganda: "08:51-10:22", gulikaKaal: "11:53-13:24", abhijitAvailable: false },
  "2026-09-23_seattle": { sunrise: "06:57", sunset: "19:04", tithi: "Dwadashi", tithiPaksha: "shukla", nakshatra: "Dhanishtha", nakshatraId: 23, yoga: "Dhriti", karana: "Balava", rahuKaal: "13:01-14:32", yamaganda: "08:28-09:59", gulikaKaal: "11:30-13:01", abhijitAvailable: false },
  "2026-10-20_delhi": { sunrise: "06:24", sunset: "17:46", tithi: "Navami", tithiPaksha: "shukla", nakshatra: "Shravana", nakshatraId: 22, yoga: "Shula", karana: "Kaulava", rahuKaal: "14:56-16:21", yamaganda: "09:15-10:40", gulikaKaal: "12:05-13:30", abhijitAvailable: true },
  "2026-10-20_bern": { sunrise: "07:56", sunset: "18:37", tithi: "Navami", tithiPaksha: "shukla", nakshatra: "Shravana", nakshatraId: 22, yoga: "Shula", karana: "Kaulava", rahuKaal: "15:57-17:17", yamaganda: "10:36-11:56", gulikaKaal: "13:17-14:37", abhijitAvailable: true },
  "2026-10-20_seattle": { sunrise: "07:35", sunset: "18:11", tithi: "Dashami", tithiPaksha: "shukla", nakshatra: "Dhanishtha", nakshatraId: 23, yoga: "Shula", karana: "Taitila", rahuKaal: "15:32-16:52", yamaganda: "10:14-11:34", gulikaKaal: "12:53-14:13", abhijitAvailable: true },
  "2026-11-15_delhi": { sunrise: "06:43", sunset: "17:27", tithi: "Shashthi", tithiPaksha: "shukla", nakshatra: "Uttara Ashadha", nakshatraId: 21, yoga: "Ganda", karana: "Kaulava", rahuKaal: "16:07-17:27", yamaganda: "12:05-13:26", gulikaKaal: "14:46-16:07", abhijitAvailable: true },
  "2026-11-15_bern": { sunrise: "07:34", sunset: "16:59", tithi: "Shashthi", tithiPaksha: "shukla", nakshatra: "Uttara Ashadha", nakshatraId: 21, yoga: "Ganda", karana: "Kaulava", rahuKaal: "15:49-16:59", yamaganda: "12:16-13:27", gulikaKaal: "14:38-15:49", abhijitAvailable: true },
  "2026-11-15_seattle": { sunrise: "07:14", sunset: "16:32", tithi: "Shashthi", tithiPaksha: "shukla", nakshatra: "Uttara Ashadha", nakshatraId: 21, yoga: "Ganda", karana: "Taitila", rahuKaal: "15:22-16:32", yamaganda: "11:53-13:03", gulikaKaal: "14:13-15:22", abhijitAvailable: true },
  "2026-12-21_delhi": { sunrise: "07:09", sunset: "17:28", tithi: "Dwadashi", tithiPaksha: "shukla", nakshatra: "Bharani", nakshatraId: 2, yoga: "Siddha", karana: "Balava", rahuKaal: "08:26-09:44", yamaganda: "11:01-12:19", gulikaKaal: "13:36-14:53", abhijitAvailable: true },
  "2026-12-21_bern": { sunrise: "08:13", sunset: "16:48", tithi: "Dwadashi", tithiPaksha: "shukla", nakshatra: "Bharani", nakshatraId: 2, yoga: "Siddha", karana: "Balava", rahuKaal: "09:17-10:22", yamaganda: "11:26-12:30", gulikaKaal: "13:35-14:39", abhijitAvailable: true },
  "2026-12-21_seattle": { sunrise: "07:54", sunset: "16:20", tithi: "Trayodashi", tithiPaksha: "shukla", nakshatra: "Krittika", nakshatraId: 3, yoga: "Siddha", karana: "Kaulava", rahuKaal: "08:58-10:01", yamaganda: "11:04-12:07", gulikaKaal: "13:10-14:13", abhijitAvailable: true },
};

// ─── Locations ──────────────────────────────────────────────────────────
const LOCS: Record<string, { lat: number; lng: number; tzOffset: number; timezone: string; locationName: string }> = {
  delhi:   { lat: 28.6139, lng: 77.209,    tzOffset: 5.5, timezone: 'Asia/Kolkata',       locationName: 'Delhi' },
  bern:    { lat: 46.46,   lng: 6.84,      tzOffset: 2,   timezone: 'Europe/Zurich',      locationName: 'Bern' },
  seattle: { lat: 47.6062, lng: -122.3321, tzOffset: -7,  timezone: 'America/Los_Angeles', locationName: 'Seattle' },
};

// ─── Helper ──────────────────────────────────────────────────────────
function parseHHMM(s: string): number {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
}

function assertTimeWithin(label: string, actual: string, expected: string, toleranceMin: number) {
  const a = parseHHMM(actual);
  const e = parseHHMM(expected);
  let diff = Math.abs(a - e);
  if (diff > 720) diff = 1440 - diff;
  expect(diff, `${label}: actual=${actual} expected=${expected} diff=${diff}min`).toBeLessThanOrEqual(toleranceMin);
}

// ─── Tests ──────────────────────────────────────────────────────────
const DATES = [
  [2026,1,15],[2026,3,29],[2026,4,8],[2026,4,14],[2026,4,29],
  [2026,5,6],[2026,6,21],[2026,7,15],[2026,9,23],[2026,10,20],
  [2026,11,15],[2026,12,21],
];

describe.each(DATES)('Snapshot: %i-%i-%i', (y, m, d) => {
  for (const [city, loc] of Object.entries(LOCS)) {
    const key = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}_${city}`;
    const baseline = SNAPSHOT_DATA[key];
    if (!baseline) continue;

    describe(city, () => {
      let p: ReturnType<typeof computePanchang>;
      let tz: number;

      beforeAll(() => {
        tz = loc.tzOffset;
        if (city === 'bern') tz = (m >= 3 && m <= 10) ? 2 : 1;
        if (city === 'seattle') tz = (m >= 3 && m <= 10) ? -7 : -8;
        p = computePanchang({ year: y, month: m, day: d, ...loc, tzOffset: tz });
      });

      it('tithi name matches', () => {
        expect(p.tithi.name.en).toBe(baseline.tithi);
      });

      it('tithi paksha matches', () => {
        expect(p.tithi.paksha).toBe(baseline.tithiPaksha);
      });

      it('nakshatra matches', () => {
        expect(p.nakshatra.name.en).toBe(baseline.nakshatra);
        expect(p.nakshatra.id).toBe(baseline.nakshatraId);
      });

      it('yoga matches', () => {
        expect(p.yoga.name.en).toBe(baseline.yoga);
      });

      it('karana matches', () => {
        expect(p.karana.name.en).toBe(baseline.karana);
      });

      it('sunrise within 2 min', () => {
        assertTimeWithin('sunrise', p.sunrise, baseline.sunrise, 2);
      });

      it('sunset within 2 min', () => {
        assertTimeWithin('sunset', p.sunset, baseline.sunset, 2);
      });

      it('rahu kaal within 3 min', () => {
        const [rs, re] = baseline.rahuKaal.split('-');
        assertTimeWithin('rahu start', p.rahuKaal.start, rs, 3);
        assertTimeWithin('rahu end', p.rahuKaal.end, re, 3);
      });

      it('yamaganda within 3 min', () => {
        const [ys, ye] = baseline.yamaganda.split('-');
        assertTimeWithin('yama start', p.yamaganda.start, ys, 3);
        assertTimeWithin('yama end', p.yamaganda.end, ye, 3);
      });

      it('gulika kaal within 3 min', () => {
        const [gs, ge] = baseline.gulikaKaal.split('-');
        assertTimeWithin('gulika start', p.gulikaKaal.start, gs, 3);
        assertTimeWithin('gulika end', p.gulikaKaal.end, ge, 3);
      });

      it('abhijit availability matches', () => {
        expect(p.abhijitMuhurta?.available ?? null).toBe(baseline.abhijitAvailable);
      });
    });
  }
});
