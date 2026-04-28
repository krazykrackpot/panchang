# Pre-computed Tithi Tables — Design Spec

**Date:** 2026-04-28
**Status:** Approved

## Overview

Pre-compute tithi tables for all 55 cities × 3 years (2025-2027) = 165 JSON files. API routes check for pre-computed data first, falling back to live computation for unknown locations. Eliminates ~100% of tithi table CPU cost for known cities.

## Script: `scripts/precompute-tithi.ts`

Run with: `npx tsx scripts/precompute-tithi.ts`

### Behavior

1. Import `buildYearlyTithiTable` from `src/lib/calendar/tithi-table.ts`
2. Import city list from `src/lib/constants/cities.ts`
3. For each city × each year (2025, 2026, 2027):
   - Call `buildYearlyTithiTable(year, city.lat, city.lon, city.timezone)`
   - Write result as JSON to `public/data/tithi-tables/{year}/{city-slug}.json`
   - Log: `[12/165] Delhi 2026 — 372 entries, 1 adhika masa`
4. Also generate `public/data/tithi-tables/{year}/utc.json` for eclipses.ts (lat=0, lon=0, timezone='UTC') — 3 additional files
5. Run validation pass (see Validation section)

### Output format

Each JSON file contains the full `YearlyTithiTable`:
```json
{
  "year": 2026,
  "lat": 28.6139,
  "lon": 77.209,
  "timezone": "Asia/Kolkata",
  "entries": [ ... ],
  "lunarMonths": [ ... ],
  "purnimantMonths": [ ... ]
}
```

File size: ~180KB per file. Total: ~30MB for 168 files (165 cities + 3 UTC).

### Script flags

- `--year 2028` — generate a single year (for adding future years)
- `--city delhi` — generate a single city (for debugging)
- `--validate-only` — run validation without regenerating

## Data location

```
public/data/tithi-tables/
├── 2025/
│   ├── delhi.json
│   ├── mumbai.json
│   ├── ...
│   ├── auckland.json
│   └── utc.json
├── 2026/
│   └── (same 56 files)
└── 2027/
    └── (same 56 files)
```

City slug = kebab-case of city name (e.g., "new-york", "kuala-lumpur", "port-of-spain"). Must match the slug used in `src/lib/constants/cities.ts` or `panchang/[city]` routes.

## API changes

### New helper: `loadPrecomputedTable`

Add to `src/lib/calendar/tithi-table.ts`:

```ts
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

function loadPrecomputedTable(
  year: number,
  lat: number,
  lon: number,
  timezone: string,
): YearlyTithiTable | null {
  // 1. Try to match lat/lon to a known city
  const slug = findCitySlugByCoords(lat, lon);
  if (!slug) return null;
  
  // 2. Check if pre-computed file exists
  const filePath = join(process.cwd(), 'public', 'data', 'tithi-tables', String(year), `${slug}.json`);
  if (!existsSync(filePath)) return null;
  
  // 3. Parse and return
  const data = JSON.parse(readFileSync(filePath, 'utf-8')) as YearlyTithiTable;
  return data;
}
```

### `findCitySlugByCoords` helper

```ts
function findCitySlugByCoords(lat: number, lon: number): string | null {
  // Import CITIES from constants
  // Match within 0.1° tolerance (≈11km)
  for (const city of CITIES) {
    if (Math.abs(city.lat - lat) < 0.1 && Math.abs(city.lon - lon) < 0.1) {
      return city.slug;
    }
  }
  // Special case: eclipses use (0, 0, UTC)
  if (Math.abs(lat) < 0.1 && Math.abs(lon) < 0.1) return 'utc';
  return null;
}
```

### Modify `buildYearlyTithiTable`

Add pre-computed check at the top, before the in-memory cache check:

```ts
export function buildYearlyTithiTable(year, lat, lon, timezone): YearlyTithiTable {
  // 1. Check pre-computed JSON (filesystem)
  const precomputed = loadPrecomputedTable(year, lat, lon, timezone);
  if (precomputed) return precomputed;
  
  // 2. Check in-memory cache (existing logic)
  const key = `${year}:${lat.toFixed(2)}:${lon.toFixed(2)}:${timezone}`;
  if (tableCache.has(key)) return tableCache.get(key)!;
  
  // 3. Compute from scratch (existing logic)
  // ...
}
```

### Consumers — no changes

These all call `buildYearlyTithiTable` and get pre-computed data transparently:
- `/api/panchang` route (line 71)
- `/api/tithi-table` route (line 17)
- `generateFestivalCalendarV2` in festival-generator.ts (line 449)
- `eclipses.ts` (line 86, uses lat=0/lon=0/UTC)

## Validation

The script runs validation after generation:

### Spot-check validation

For 3 randomly selected cities × each year:
1. Call `buildYearlyTithiTable` with live computation (bypass pre-computed check)
2. Compare with loaded JSON — all entries must match exactly (startJd, endJd, number, paksha, masa)
3. Fail loudly if any mismatch

### Sanity checks per file

- Entry count: 360-380 (typical year has 360 tithis, adhika masa adds ~30)
- Ekadashi count: 24-26 (2 per lunar month × 12-13 months)
- Shukla/Krishna balance: within 5% of each other
- Adhika masa: verify years that should have it (2026 has Adhika Ashadha, 2025 has Adhika Shravana)
- No entries with `durationHours <= 0` or `durationHours > 60`
- All dates within the year ±1 month (Dec prev year to Jan next year is normal)

### Cross-timezone validation

For 3 cities in different timezones (e.g., Delhi IST, London GMT, New York EST):
- Verify the same astronomical event (e.g., Amavasya) has different local times but similar JD values
- Verify sunrise-based tithi assignment differs appropriately for east vs west locations

## Performance impact

| Scenario | Before | After |
|----------|--------|-------|
| Known city panchang request | ~500ms CPU (compute table) | ~5ms (read JSON) |
| Festival calendar generation | ~500ms CPU | ~5ms |
| Unknown city request | ~500ms CPU | ~500ms CPU (unchanged) |
| Cold start, first request | ~500ms | ~5ms |

The in-memory cache (`tableCache`) still works as a second layer — after the first JSON read, subsequent requests for the same year+city hit the in-memory cache and skip even the file read.

## Files to create/modify

- **Create:** `scripts/precompute-tithi.ts`
- **Create:** `public/data/tithi-tables/{year}/{slug}.json` (168 files)
- **Modify:** `src/lib/calendar/tithi-table.ts` — add `loadPrecomputedTable`, `findCitySlugByCoords`, modify `buildYearlyTithiTable` entry point
- **No changes:** API routes, festival generator, eclipses — they all consume `buildYearlyTithiTable` transparently

## Edge cases

- **User's custom location** (not a known city): Falls back to live computation + edge cache. No regression.
- **Year 2028+**: Falls back to live computation. Run `npx tsx scripts/precompute-tithi.ts --year 2028` to add it.
- **City added to constants**: Run script again. Old files are overwritten.
- **Adhika masa years**: 2025 and 2026 both have adhika masa. Validation checks for this explicitly.
- **DST transitions**: IANA timezone handles this. Pre-computed files use the same timezone string as live computation.
