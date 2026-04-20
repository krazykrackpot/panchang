import { describe, it, expect } from 'vitest';
import {
  calculateHoras,
  parseHHMM,
  formatMinutes,
  findBestHorasForActivities,
  type HoraData,
} from '@/lib/hora/hora-calculator';

describe('hora-calculator', () => {
  // ── parseHHMM ──
  it('parseHHMM converts HH:MM to minutes', () => {
    expect(parseHHMM('06:30')).toBe(390);
    expect(parseHHMM('00:00')).toBe(0);
    expect(parseHHMM('23:59')).toBe(1439);
    expect(parseHHMM('12:00')).toBe(720);
  });

  // ── formatMinutes ──
  it('formatMinutes converts minutes to HH:MM', () => {
    expect(formatMinutes(390)).toBe('06:30');
    expect(formatMinutes(0)).toBe('00:00');
    expect(formatMinutes(1439)).toBe('23:59');
    // Handles overflow (next day)
    expect(formatMinutes(1500)).toBe('01:00');
  });

  // ── Sunday: first hora = Sun ──
  it('Sunday first hora ruler is Sun (id=0)', () => {
    const data = calculateHoras(
      new Date(2026, 3, 19), // Sunday Apr 19 2026
      '06:00',
      '18:00',
      '06:00', // next sunrise same
      0, // Sunday
    );
    expect(data.horas[0].planet).toBe(0); // Sun
    expect(data.dayLord).toBe(0);
  });

  // ── Monday: first hora = Moon ──
  it('Monday first hora ruler is Moon (id=1)', () => {
    const data = calculateHoras(
      new Date(2026, 3, 20), // Monday
      '06:00',
      '18:00',
      '06:00',
      1, // Monday
    );
    expect(data.horas[0].planet).toBe(1); // Moon
    expect(data.dayLord).toBe(1);
  });

  // ── Tuesday: first hora = Mars ──
  it('Tuesday first hora ruler is Mars (id=2)', () => {
    const data = calculateHoras(new Date(2026, 3, 21), '06:00', '18:00', '06:00', 2);
    expect(data.horas[0].planet).toBe(2); // Mars
  });

  // ── Wednesday: first hora = Mercury ──
  it('Wednesday first hora ruler is Mercury (id=3)', () => {
    const data = calculateHoras(new Date(2026, 3, 22), '06:00', '18:00', '06:00', 3);
    expect(data.horas[0].planet).toBe(3); // Mercury
  });

  // ── Thursday: first hora = Jupiter ──
  it('Thursday first hora ruler is Jupiter (id=4)', () => {
    const data = calculateHoras(new Date(2026, 3, 23), '06:00', '18:00', '06:00', 4);
    expect(data.horas[0].planet).toBe(4); // Jupiter
  });

  // ── Friday: first hora = Venus ──
  it('Friday first hora ruler is Venus (id=5)', () => {
    const data = calculateHoras(new Date(2026, 3, 24), '06:00', '18:00', '06:00', 5);
    expect(data.horas[0].planet).toBe(5); // Venus
  });

  // ── Saturday: first hora = Saturn ──
  it('Saturday first hora ruler is Saturn (id=6)', () => {
    const data = calculateHoras(new Date(2026, 3, 25), '06:00', '18:00', '06:00', 6);
    expect(data.horas[0].planet).toBe(6); // Saturn
  });

  // ── Always 24 horas (12 day + 12 night) ──
  it('generates exactly 24 horas (12 day + 12 night)', () => {
    const data = calculateHoras(new Date(2026, 3, 19), '06:00', '18:00', '06:00', 0);
    expect(data.horas).toHaveLength(24);

    const dayHoras = data.horas.filter(h => h.isDayHora);
    const nightHoras = data.horas.filter(h => !h.isDayHora);
    expect(dayHoras).toHaveLength(12);
    expect(nightHoras).toHaveLength(12);
  });

  // ── Chaldean sequence cycles correctly ──
  it('cycles through Chaldean order correctly from Sun (Sunday)', () => {
    const data = calculateHoras(new Date(2026, 3, 19), '06:00', '18:00', '06:00', 0);
    // Sun start index in Chaldean [6,4,2,0,5,3,1] is index 3
    // Sequence from Sun: 0, 5, 3, 1, 6, 4, 2, 0, 5, 3, 1, 6, 4, 2, 0, ...
    const expected = [0, 5, 3, 1, 6, 4, 2, 0, 5, 3, 1, 6, 4, 2, 0, 5, 3, 1, 6, 4, 2, 0, 5, 3];
    const actual = data.horas.map(h => h.planet);
    expect(actual).toEqual(expected);
  });

  it('cycles through Chaldean order correctly from Saturn (Saturday)', () => {
    const data = calculateHoras(new Date(2026, 3, 25), '06:00', '18:00', '06:00', 6);
    // Saturn is at index 0 in Chaldean [6,4,2,0,5,3,1]
    // Sequence: 6, 4, 2, 0, 5, 3, 1, 6, 4, 2, 0, 5, 3, 1, 6, 4, 2, 0, 5, 3, 1, 6, 4, 2
    const expected = [6, 4, 2, 0, 5, 3, 1, 6, 4, 2, 0, 5, 3, 1, 6, 4, 2, 0, 5, 3, 1, 6, 4, 2];
    const actual = data.horas.map(h => h.planet);
    expect(actual).toEqual(expected);
  });

  // ── Unequal hours: winter day shorter, summer day longer ──
  it('day horas shorter when day is shorter (winter-like)', () => {
    // Short day: 8h (sunrise 08:00, sunset 16:00), long night: 16h
    const data = calculateHoras(new Date(2026, 11, 21), '08:00', '16:00', '08:00', 0);
    expect(data.dayDuration).toBe(480); // 8h = 480 min
    expect(data.nightDuration).toBe(960); // 16h = 960 min

    // Day hora = 480/12 = 40 min each
    const dayStart = parseHHMM(data.horas[0].startTime);
    const dayEnd = parseHHMM(data.horas[0].endTime);
    expect(dayEnd - dayStart).toBe(40);

    // Night hora = 960/12 = 80 min each
    const nightStart = parseHHMM(data.horas[12].startTime);
    const nightEnd = parseHHMM(data.horas[12].endTime);
    expect(nightEnd - nightStart).toBe(80);
  });

  it('day horas longer when day is longer (summer-like)', () => {
    // Long day: 16h (sunrise 04:00, sunset 20:00), short night: 8h
    const data = calculateHoras(new Date(2026, 5, 21), '04:00', '20:00', '04:00', 0);
    expect(data.dayDuration).toBe(960); // 16h
    expect(data.nightDuration).toBe(480); // 8h

    const dayStart = parseHHMM(data.horas[0].startTime);
    const dayEnd = parseHHMM(data.horas[0].endTime);
    expect(dayEnd - dayStart).toBe(80); // 960/12

    const nightStart = parseHHMM(data.horas[12].startTime);
    const nightEnd = parseHHMM(data.horas[12].endTime);
    // Night end might cross midnight; handle the wrap
    const nightLen = nightEnd >= nightStart ? nightEnd - nightStart : nightEnd + 1440 - nightStart;
    expect(nightLen).toBe(40); // 480/12
  });

  // ── Current hora detection ──
  it('detects current hora when nowMinutes is within a day hora', () => {
    // Equal hours: sunrise 06:00, sunset 18:00 → each hora 60min
    // Hour 1: 06:00-07:00, Hour 2: 07:00-08:00, etc.
    const data = calculateHoras(
      new Date(2026, 3, 19),
      '06:00', '18:00', '06:00',
      0, // Sunday
      390, // 06:30 — within first hora (06:00-07:00)
    );
    expect(data.currentHora).not.toBeNull();
    expect(data.currentHora!.horaNumber).toBe(1);
    expect(data.currentHora!.planet).toBe(0); // Sun on Sunday
  });

  it('detects current hora in night period', () => {
    // Night starts 18:00, each night hora = 60min
    // Hour 13: 18:00-19:00, Hour 14: 19:00-20:00, etc.
    const data = calculateHoras(
      new Date(2026, 3, 19),
      '06:00', '18:00', '06:00',
      0, // Sunday
      1110, // 18:30 — first night hora
    );
    expect(data.currentHora).not.toBeNull();
    expect(data.currentHora!.horaNumber).toBe(13);
    expect(data.currentHora!.isDayHora).toBe(false);
  });

  it('returns null currentHora when nowMinutes is -1 (no detection)', () => {
    const data = calculateHoras(new Date(2026, 3, 19), '06:00', '18:00', '06:00', 0, -1);
    expect(data.currentHora).toBeNull();
    // All isCurrent should be false
    expect(data.horas.every(h => !h.isCurrent)).toBe(true);
  });

  // ── Edge case: midnight crossing ──
  it('handles night horas crossing midnight correctly', () => {
    // Sunset at 18:00, next sunrise at 06:00 (next day)
    // Night = 12h, each night hora = 60 min
    // Hora 18 (night #6): starts 18:00 + 5*60 = 23:00, ends 00:00
    // Hora 19 (night #7): starts 00:00, ends 01:00
    const data = calculateHoras(new Date(2026, 3, 19), '06:00', '18:00', '06:00', 0);
    const hora18 = data.horas[17]; // index 17 = hora 18
    expect(hora18.startTime).toBe('23:00');
    expect(hora18.endTime).toBe('00:00');

    const hora19 = data.horas[18]; // index 18 = hora 19
    expect(hora19.startTime).toBe('00:00');
    expect(hora19.endTime).toBe('01:00');
  });

  // ── Every hora has valid fields ──
  it('all horas have non-empty signification and planetName', () => {
    const data = calculateHoras(new Date(2026, 3, 19), '06:00', '18:00', '06:00', 0);
    for (const h of data.horas) {
      expect(h.signification.length).toBeGreaterThan(0);
      expect(h.planetName.en).toBeTruthy();
    }
  });

  // ── Date string format ──
  it('formats date string as YYYY-MM-DD', () => {
    const data = calculateHoras(new Date(2026, 3, 19), '06:00', '18:00', '06:00', 0);
    expect(data.date).toBe('2026-04-19');
  });

  // ── findBestHorasForActivities ──
  it('finds next upcoming hora for each activity', () => {
    const data = calculateHoras(new Date(2026, 3, 19), '06:00', '18:00', '06:00', 0, 360);
    const results = findBestHorasForActivities(data.horas, 360); // 06:00
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.activity).toBeTruthy();
      expect(typeof r.planet).toBe('number');
    }
  });
});
