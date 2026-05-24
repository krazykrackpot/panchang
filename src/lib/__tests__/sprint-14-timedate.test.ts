/**
 * Sprint 14 — P2 time/date cluster (Lesson L) invariants.
 *
 * Lock in the audit findings that moved server-local time/date reads
 * onto either UTC or shared canonical helpers. P2-5 (hora-engine zero-
 * length-slot edge) and P2-10 (kp-chart empty catch) were already
 * correct before this sprint; their tests lock the shape in.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), 'utf8');

describe('Sprint 14 — P2-1 personalized-horoscope weekday uses UTC', () => {
  const src = read('src/lib/llm/personalized-horoscope.ts');

  it('dayOfWeek is derived from getUTCDay(), not getDay()', () => {
    expect(src).toMatch(/dayOfWeek:\s*DAYS\[now\.getUTCDay\(\)\]/);
    // The old shape (server-local) must be gone.
    expect(src).not.toMatch(/dayOfWeek:\s*DAYS\[now\.getDay\(\)\]/);
  });
});

describe('Sprint 14 — P2-2 youtube/generate-short weekday uses UTC', () => {
  const src = read('src/lib/youtube/generate-short.ts');

  it('dayName is derived from today.getUTCDay()', () => {
    expect(src).toMatch(/dayName\s*=\s*dayNames\[today\.getUTCDay\(\)\]/);
    expect(src).not.toMatch(/dayName\s*=\s*dayNames\[today\.getDay\(\)\]/);
  });
});

describe('Sprint 14 — P2-3 monthly-calendar.ts logs on per-day failure', () => {
  const src = read('src/lib/personalization/monthly-calendar.ts');

  it('the panchang catch logs with [monthly-calendar] tag (no longer empty)', () => {
    // Old: `catch { continue }` — banned per Lesson A.
    // New: `catch (err) { console.error('[monthly-calendar] ...', err); continue }`.
    const codeOnly = src.replace(/\/\/[^\n]*/g, '');
    expect(codeOnly).not.toMatch(/catch\s*\{\s*\/\/[^\n]*\n\s*continue;\s*\}/);
    expect(codeOnly).not.toMatch(/catch\s*\{\s*continue;\s*\}/);
    expect(src).toMatch(
      /catch \(err\)[\s\S]*?console\.error\(\s*['"]\[monthly-calendar\][^]*?continue/,
    );
  });
});

describe('Sprint 14 — P2-4 sade-sati-analysis uses UTC anchors throughout', () => {
  const src = read('src/lib/kundali/sade-sati-analysis.ts');

  it('every currentYear assignment uses getUTCFullYear()', () => {
    // ALL `currentYear = ...getFullYear()` sites in this file were
    // server-local. Audit only named line 287 but the same pattern
    // appears in analyzeSadeSati, getAshtamaShani, and the
    // next-cycle finder. After the fix, NO `getFullYear()` should
    // remain on a `now`-shaped Date variable.
    expect(src).not.toMatch(/\bnow\.getFullYear\(\)/);
    expect(src).not.toMatch(/new Date\(\)\.getFullYear\(\)/);
    // At least one canonical UTC use exists
    expect(src).toMatch(/getUTCFullYear\(\)/);
  });

  it('JD construction uses UTC components, not server-local', () => {
    // dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), ...)
    // is a Lesson-L red flag — server-local components passed to a UTC
    // astronomical engine. Must be `getUTC*` everywhere.
    expect(src).not.toMatch(/dateToJD\([^)]*\bnow\.getMonth\(\)\s*\+\s*1/);
    expect(src).not.toMatch(/dateToJD\([^)]*\bnow\.getDate\(\)/);
  });
});

describe('Sprint 14 — P2-6 kundali-calc dasha .find() hoists `now` outside the predicate', () => {
  const src = read('src/lib/ephem/kundali-calc.ts');

  it('the dasha lookup uses a single hoisted dashaCheckNow anchor', () => {
    expect(src).toMatch(/const dashaCheckNow = new Date\(\);/);
    // Neither find() callback may construct its own Date anymore.
    const findBlock = src.match(
      /dashas\.find\([\s\S]*?currentAntarDasha = currentMahaDasha\?\.subPeriods\?\.find\([\s\S]*?\);/,
    )?.[0] ?? '';
    expect(findBlock, 'no per-iteration new Date()').not.toMatch(
      /find\([^)]*=>\s*\{[\s\S]*?const now = new Date\(\);/,
    );
  });
});

describe('Sprint 14 — P2-7 eclipse-compute getTzOffset delegates to shared helper', () => {
  const src = read('src/lib/calendar/eclipse-compute.ts');

  it('imports getUTCOffsetForDate from the canonical helper', () => {
    expect(src).toMatch(
      /import\s*\{\s*getUTCOffsetForDate\s*\}\s*from\s*['"]@\/lib\/utils\/timezone['"]/,
    );
  });

  it('the local getTzOffset() body calls getUTCOffsetForDate (not the toLocaleString round-trip)', () => {
    const fn = src.match(/function getTzOffset\([\s\S]*?\n\}/)?.[0] ?? '';
    expect(fn).toMatch(/getUTCOffsetForDate\(/);
    // The old fragile shape used d.toLocaleString in two places; both
    // should now be gone from the function body.
    expect(fn).not.toMatch(/toLocaleString\([^)]*timeZone/);
  });

  it('both eclipse callers still hit the helper (no inline duplication snuck back)', () => {
    expect(src.match(/getTzOffset\(/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
    // Three matches: 1 declaration, 2 callers (lunar + solar)
  });
});

describe('Sprint 14 — P2-8 vrat-alerts intentional-local-tz is documented', () => {
  const src = read('src/lib/notifications/vrat-alerts.ts');

  it('the local-tz parse is documented as intentional with the travel caveat', () => {
    // Don't change the runtime behaviour — assert the documenting comment
    // is present so a reader can tell this is by design (browser-side
    // notification scheduling) and knows the known limit (cross-tz
    // travel between subscribe + fire).
    expect(src).toMatch(/INTENTIONAL[\s\S]*browser-side push notification[\s\S]*tz/);
  });
});

describe('Sprint 14 — P2-9 year-predictions quarter math uses UTC month', () => {
  const src = read('src/lib/tippanni/year-predictions.ts');

  it('the quarter filter uses d.getUTCMonth() and guards against bad parse', () => {
    expect(src).toMatch(/d\.getUTCMonth\(\)/);
    expect(src).toMatch(/Number\.isNaN\(d\.getTime\(\)\)/);
    // Old shape (server-local) must be gone.
    expect(src).not.toMatch(/const m = d\.getMonth\(\);\s*\n\s*return Math\.floor\(m \/ 3\)/);
  });
});

describe('Sprint 14 — P2-5 hora-engine zero-length-slot membership convention', () => {
  const src = read('src/lib/panchang/hora-engine.ts');

  it('the slot membership check uses half-open intervals (`< end`, not `<= end`)', () => {
    // Half-open intervals (`[start, end)`) are the only safe choice for
    // contiguous time slots — closed-closed would double-count the
    // boundary minute. Verify the predicate shape.
    expect(src).toMatch(/now\s*>=\s*start\s*&&\s*now\s*<\s*end/);
    // The midnight-wrap predicate must use `<` for the wrapped end too.
    expect(src).toMatch(/now\s*>=\s*start\s*\|\|\s*now\s*<\s*end/);
  });
});

describe('Sprint 14 — P2-10 kp-chart Intl catch is tagged (already fixed)', () => {
  const src = read('src/lib/kp/kp-chart.ts');

  it('the Intl-failure catch logs with [kp-chart] tag (not empty)', () => {
    expect(src).toMatch(
      /catch \(err\)[\s\S]*?console\.error\(\s*['"]\[kp-chart\] Intl\.DateTimeFormat failed/,
    );
    // Bare empty catch is banned.
    expect(src).not.toMatch(/catch\s*\(?[^)]*\)?\s*\{\s*\}/);
  });
});
