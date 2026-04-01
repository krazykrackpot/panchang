# Yearly Tithi Table — Design Specification

**Date:** April 1, 2026
**Goal:** Replace per-day tithi scanning with a pre-computed yearly tithi table that serves as the single source of truth for festivals, Ekadashi dates, parana times, and daily panchang.

---

## 1. Core Data Structure

### TithiEntry

```typescript
interface TithiEntry {
  number: number;          // 1-30 (1=Shukla Pratipada ... 15=Purnima, 16=Krishna Pratipada ... 30=Amavasya)
  name: Trilingual;
  paksha: 'shukla' | 'krishna';
  startJd: number;         // Julian Day at tithi start (exact, from binary search)
  endJd: number;           // Julian Day at tithi end
  startLocal: string;      // HH:MM in user's local timezone
  endLocal: string;        // HH:MM in user's local timezone
  startDate: string;       // YYYY-MM-DD local date of start
  endDate: string;         // YYYY-MM-DD local date of end
  isKshaya: boolean;       // true if tithi never prevails at any sunrise
  sunriseDate: string;     // Gregorian date where this tithi prevails at sunrise (or startDate if kshaya)
  lunarMonth: {            // Amanta month this tithi belongs to
    name: string;          // e.g., 'chaitra', 'vaishakha'
    isAdhika: boolean;
  };
  durationHours: number;   // endJd - startJd in hours
}
```

### YearlyTithiTable

```typescript
interface YearlyTithiTable {
  year: number;
  lat: number;
  lon: number;
  timezone: string;        // IANA timezone
  entries: TithiEntry[];   // ~360 entries, chronologically ordered
  lunarMonths: LunarMonth[]; // from buildLunarCalendar
}
```

## 2. Build Algorithm

### `buildYearlyTithiTable(year, lat, lon, timezone)`

1. Compute sunrise JD for Jan 1 of the year
2. Get current tithi at that sunrise
3. Scan forward to find the end of that tithi:
   - Use 2-hour coarse steps to find the transition zone
   - Binary search (20 iterations) to find exact JD (~1 second precision)
4. Record TithiEntry with start/end JDs
5. The end of one tithi = start of the next
6. Continue until we pass Dec 31 sunrise
7. Assign lunar months using `buildLunarCalendar()`
8. Mark kshaya tithis: where startJd and endJd both fall between the same two consecutive sunrises, and the tithi doesn't prevail at either sunrise
9. Compute `sunriseDate` for each entry: the date whose sunrise falls within [startJd, endJd]

### Lunar Month Assignment

For each TithiEntry, find which LunarMonth contains its startJd:
- The tithi's Amanta month = the LunarMonth where `startDate > lunarMonth.startDate && startDate <= lunarMonth.endDate`
- Krishna tithis (16-30): Purnimant name = getNextHinduMonth(amantaName)

### Performance

- ~360 tithis per year
- ~180 binary searches (each tithi boundary)
- Each binary search = ~20 `calculateTithi()` calls
- Total: ~3600 tithi calculations = ~50ms on modern hardware
- Cached: only recomputed when year/location changes

## 3. Declarative Festival Mapping

### FestivalDef

```typescript
interface FestivalDef {
  masa?: string;           // Hindu month name (omit for recurring)
  paksha?: 'shukla' | 'krishna'; // omit if tithi is unambiguous (15=Purnima, 30=Amavasya)
  tithi: number;           // 1-15 within paksha (NOT 1-30 — simpler for authors)
  slug: string;            // key for FESTIVAL_DETAILS / EKADASHI_NAMES lookup
  recurring?: boolean;     // true for monthly vrats (applies to all months)
  type: 'major' | 'vrat';
  category: string;        // 'festival' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham'
}
```

### FESTIVAL_CALENDAR constant

All festivals defined as masa + paksha + tithi. Adding a festival = adding one line.

### Lookup Algorithm

```
for each FestivalDef:
  tithiNum = paksha === 'krishna' ? tithi + 15 : tithi
  matches = tithiTable.filter(entry =>
    entry.number === tithiNum &&
    (def.recurring || entry.lunarMonth.name === def.masa) &&
    (!def.recurring || !entry.lunarMonth.isAdhika)  // skip Adhika for recurring
  )
  for each match:
    // Adhika month Ekadashis get special names
    if entry.lunarMonth.isAdhika && tithiNum in [11, 26]:
      name = ADHIKA_MASA_EKADASHI[paksha]
    else:
      name = lookupName(def, entry.lunarMonth)
    festivals.push(buildFestivalEntry(match, name, def))
```

## 4. Daily Panchang Integration

### Changes to `computePanchang`

- Accept optional `tithiTable?: YearlyTithiTable` parameter
- If provided, look up tithi from table instead of computing:
  ```
  const sunriseJd = dateToJD(year, month, day, sunriseUT);
  const entry = tithiTable.entries.find(e => e.startJd <= sunriseJd && sunriseJd < e.endJd);
  ```
- `tithiTransition` fields come directly from the entry (startLocal, endLocal, next tithi)
- All other panchang elements (nakshatra, yoga, karana, muhurta, etc.) remain computed on-the-fly

### Caching

- In-memory Map: `${year}:${lat2}:${lon2}:${timezone}` → YearlyTithiTable
- Max 5 entries (~180KB)
- Calendar API: build table once, use for all festivals + parana calculations
- Panchang API: build table on first request for a year/location, reuse for subsequent days

## 5. Parana Integration

Ekadashi parana computation currently scans for Dwadashi start/end. With the tithi table:
- Dwadashi entry = tithiTable entry immediately after the Ekadashi entry
- Dwadashi startJd, endJd, and Hari Vasara (first 1/4 of duration) are direct reads
- No more binary search scanning for Dwadashi boundaries

## 6. Testing Strategy

### Unit Tests
- Build table for 2026 Delhi, verify 360 entries, no gaps, no overlaps
- Verify entry.number cycles 1→30 repeatedly
- Verify isKshaya flags exist for known kshaya tithis (Delhi Jul 9 #26, Nov 20 #11)

### Cross-Timezone Verification
- Build tables for Bern, Delhi, Seattle
- All must produce same number of entries (same tithis globally)
- Start/end JDs must be identical (geocentric events)
- Local times must differ by timezone offset only

### Drik Comparison
- Compare all 24 Ekadashi tithi begin/end times against Drik for each city
- Acceptance: +0 to +1 minute variance (already proven achievable)
- Compare all 24 Ekadashi fasting dates
- Compare 5 major festival dates (Ram Navami, Janmashtami, Dussehra, Diwali, Holi)

### Regression Tests
- Before/after comparison: generate festival calendar with old code and new code
- All dates that matched before must still match
- New kshaya Ekadashis must appear (Delhi Yogini Jul 9, Devutthana Nov 20)

## 7. Files Changed

| File | Change |
|------|--------|
| `src/lib/calendar/tithi-table.ts` | **NEW** — buildYearlyTithiTable, TithiEntry, cache |
| `src/lib/calendar/festival-defs.ts` | **NEW** — FESTIVAL_CALENDAR declarative definitions |
| `src/lib/calendar/festivals.ts` | **REWRITE** — generateFestivalCalendar uses table lookup |
| `src/lib/ephem/panchang-calc.ts` | **MODIFY** — computePanchang accepts optional table |
| `src/app/api/calendar/route.ts` | **MODIFY** — build table, pass to generator |
| `src/app/api/panchang/route.ts` | **MODIFY** — build/cache table, pass to computePanchang |

## 8. Migration Strategy

1. Build `tithi-table.ts` and `festival-defs.ts` as new files
2. Add new `generateFestivalCalendarV2` using the table
3. Compare V1 and V2 output for all 3 cities — must be identical or better
4. Once verified, replace V1 with V2
5. Integrate into panchang API
6. Remove old scanning functions (findTithiDate, findEkadashiDate, etc.)
