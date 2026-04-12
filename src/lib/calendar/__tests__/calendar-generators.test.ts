/**
 * Calendar Generator Tests
 *
 * Tests for: tithi table, festival calendar, eclipse calendar,
 * retrograde calendar, and combustion calendar engines.
 */

import { describe, it, expect } from 'vitest';
import { buildYearlyTithiTable } from '../tithi-table';
import { generateFestivalCalendarV2 } from '../festival-generator';
import { generateEclipseCalendar } from '../eclipses';
import { generateRetrogradeCalendar, generateCombustionCalendar } from '../retro-combust';

// Delhi coordinates for tithi/festival tests
const DELHI_LAT = 28.6139;
const DELHI_LON = 77.209;
const DELHI_TZ = 'Asia/Kolkata';

// ─── buildYearlyTithiTable ───

describe('buildYearlyTithiTable', () => {
  const table = buildYearlyTithiTable(2026, DELHI_LAT, DELHI_LON, DELHI_TZ);

  it('returns 350-400 entries for 2026 Delhi', () => {
    expect(table.entries.length).toBeGreaterThanOrEqual(350);
    expect(table.entries.length).toBeLessThanOrEqual(400);
  }, 60000);

  it('each entry has valid tithi number (1-30)', () => {
    for (const e of table.entries) {
      expect(e.number).toBeGreaterThanOrEqual(1);
      expect(e.number).toBeLessThanOrEqual(30);
    }
  }, 60000);

  it('each entry has valid paksha', () => {
    for (const e of table.entries) {
      expect(['shukla', 'krishna']).toContain(e.paksha);
    }
  }, 60000);

  it('each entry has YYYY-MM-DD startDate and endDate', () => {
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    for (const e of table.entries) {
      expect(e.startDate).toMatch(dateRe);
      expect(e.endDate).toMatch(dateRe);
    }
  }, 60000);

  it('each entry has a trilingual name with .en', () => {
    for (const e of table.entries) {
      expect(e.name).toBeDefined();
      expect(typeof e.name.en).toBe('string');
      expect(e.name.en.length).toBeGreaterThan(0);
    }
  }, 60000);

  it('has 12-14 lunar months', () => {
    expect(table.lunarMonths.length).toBeGreaterThanOrEqual(12);
    expect(table.lunarMonths.length).toBeLessThanOrEqual(14);
  }, 60000);

  it('entries are chronologically ordered (startJd ascending)', () => {
    for (let i = 1; i < table.entries.length; i++) {
      expect(table.entries[i].startJd).toBeGreaterThanOrEqual(table.entries[i - 1].startJd);
    }
  }, 60000);

  it('kshaya tithis are a minority of entries', () => {
    const kshayaCount = table.entries.filter(e => e.isKshaya).length;
    // Kshaya tithis should be less than ~10% of total entries
    expect(kshayaCount).toBeLessThan(table.entries.length * 0.15);
  }, 60000);

  it('table metadata matches input params', () => {
    expect(table.year).toBe(2026);
    expect(table.lat).toBe(DELHI_LAT);
    expect(table.lon).toBe(DELHI_LON);
    expect(table.timezone).toBe(DELHI_TZ);
  }, 60000);

  it('each entry has positive durationHours', () => {
    for (const e of table.entries) {
      expect(e.durationHours).toBeGreaterThan(0);
    }
  }, 60000);

  it('each entry has masa with amanta and purnimanta', () => {
    for (const e of table.entries) {
      expect(e.masa).toBeDefined();
      expect(typeof e.masa.amanta).toBe('string');
      expect(typeof e.masa.purnimanta).toBe('string');
      expect(typeof e.masa.isAdhika).toBe('boolean');
    }
  }, 60000);
});

// ─── generateFestivalCalendarV2 ───

describe('generateFestivalCalendarV2', () => {
  const festivals = generateFestivalCalendarV2(2026, DELHI_LAT, DELHI_LON, DELHI_TZ);

  it('returns 20+ festivals for 2026', () => {
    expect(festivals.length).toBeGreaterThanOrEqual(20);
  }, 60000);

  it('each festival has a trilingual name', () => {
    for (const f of festivals) {
      expect(f.name).toBeDefined();
      expect(typeof f.name.en).toBe('string');
      expect(f.name.en.length).toBeGreaterThan(0);
    }
  }, 60000);

  it('each festival has a valid YYYY-MM-DD date', () => {
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    for (const f of festivals) {
      expect(f.date).toMatch(dateRe);
    }
  }, 60000);

  it('each festival has a valid type', () => {
    const validTypes = ['major', 'vrat', 'regional', 'eclipse'];
    for (const f of festivals) {
      expect(validTypes).toContain(f.type);
    }
  }, 60000);

  it('all dates are in 2026', () => {
    for (const f of festivals) {
      expect(f.date.startsWith('2026-')).toBe(true);
    }
  }, 60000);

  it('each festival has a trilingual description', () => {
    for (const f of festivals) {
      expect(f.description).toBeDefined();
      expect(typeof f.description.en).toBe('string');
    }
  }, 60000);
});

// ─── generateEclipseCalendar ───

describe('generateEclipseCalendar', () => {
  it('returns 2+ eclipses for 2025', () => {
    const eclipses = generateEclipseCalendar(2025);
    expect(eclipses.length).toBeGreaterThanOrEqual(2);
  });

  it('returns 2+ eclipses for 2026', () => {
    const eclipses = generateEclipseCalendar(2026);
    expect(eclipses.length).toBeGreaterThanOrEqual(2);
  });

  it('each eclipse has type solar or lunar', () => {
    const eclipses = generateEclipseCalendar(2026);
    for (const e of eclipses) {
      expect(['solar', 'lunar']).toContain(e.type);
    }
  });

  it('each eclipse has a valid date', () => {
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    const eclipses = generateEclipseCalendar(2026);
    for (const e of eclipses) {
      expect(e.date).toMatch(dateRe);
    }
  });

  it('each eclipse has a valid magnitude', () => {
    const validMag = ['total', 'partial', 'annular', 'penumbral'];
    const eclipses = generateEclipseCalendar(2026);
    for (const e of eclipses) {
      expect(validMag).toContain(e.magnitude);
    }
  });

  it('each eclipse has trilingual typeName and magnitudeName', () => {
    const eclipses = generateEclipseCalendar(2026);
    for (const e of eclipses) {
      expect(typeof e.typeName.en).toBe('string');
      expect(typeof e.magnitudeName.en).toBe('string');
    }
  });
});

// ─── generateRetrogradeCalendar ───

describe('generateRetrogradeCalendar', () => {
  const retros = generateRetrogradeCalendar(2026);

  it('returns retrograde periods for 2026', () => {
    expect(retros.length).toBeGreaterThan(0);
  });

  it('Mercury has 3-4 retrogrades per year', () => {
    // Mercury planetId = 3
    const mercuryRetros = retros.filter(r => r.planetId === 3);
    expect(mercuryRetros.length).toBeGreaterThanOrEqual(3);
    expect(mercuryRetros.length).toBeLessThanOrEqual(4);
  });

  it('each period has valid YYYY-MM-DD start and end dates', () => {
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    for (const r of retros) {
      expect(r.startDate).toMatch(dateRe);
      expect(r.endDate).toMatch(dateRe);
    }
  });

  it('each period has durationDays > 0', () => {
    for (const r of retros) {
      expect(r.durationDays).toBeGreaterThan(0);
    }
  });

  it('each period has trilingual planetName', () => {
    for (const r of retros) {
      expect(typeof r.planetName.en).toBe('string');
      expect(r.planetName.en.length).toBeGreaterThan(0);
    }
  });

  it('each period has start and end sign info', () => {
    for (const r of retros) {
      expect(r.startSign).toBeGreaterThanOrEqual(1);
      expect(r.startSign).toBeLessThanOrEqual(12);
      expect(r.endSign).toBeGreaterThanOrEqual(1);
      expect(r.endSign).toBeLessThanOrEqual(12);
      expect(typeof r.startSignName.en).toBe('string');
      expect(typeof r.endSignName.en).toBe('string');
    }
  });
});

// ─── generateCombustionCalendar ───

describe('generateCombustionCalendar', () => {
  const combustions = generateCombustionCalendar(2026);

  it('returns combustion events for 2026', () => {
    expect(combustions.length).toBeGreaterThan(0);
  });

  it('each event has a valid planetId (not Sun=0, not nodes 7/8)', () => {
    for (const c of combustions) {
      expect(c.planetId).toBeGreaterThanOrEqual(1);
      expect(c.planetId).toBeLessThanOrEqual(6);
    }
  });

  it('each event has valid YYYY-MM-DD startDate', () => {
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    for (const c of combustions) {
      expect(c.startDate).toMatch(dateRe);
    }
  });

  it('each event has durationDays > 0', () => {
    for (const c of combustions) {
      expect(c.durationDays).toBeGreaterThan(0);
    }
  });

  it('each event has trilingual planetName', () => {
    for (const c of combustions) {
      expect(typeof c.planetName.en).toBe('string');
      expect(c.planetName.en.length).toBeGreaterThan(0);
    }
  });
});
