# Timezone Bug Audit — April 30, 2026

## Audit Methodology
Searched entire `src/lib/` and `src/app/` for:
- `new Date(year, month` without `Date.UTC`
- `getTimezoneOffset()` in computation paths
- `new Date()` local components feeding `dateToJD`
- `.getHours()` / `.getMinutes()` on Date.UTC-constructed dates
- Hardcoded timezone offsets

## Verified Results

### CRITICAL — Wrong Results for Real Users

| # | File:Line | Pattern | Bug | Confirmed? | Impact |
|---|-----------|---------|-----|------------|--------|
| C1 | `src/app/[locale]/shraddha/page.tsx:59` | `-(new Date().getTimezoneOffset() / 60)` | Browser TZ used for tithi JD computation. User in London looking up family shraddha in India gets London offset applied. | **YES — verified** | Wrong shraddha dates (religious observance) |
| C2 | `src/app/[locale]/upagraha/page.tsx:328` | `-(new Date().getTimezoneOffset() / 60)` | Browser TZ for upagraha position JD. | **YES — verified** | Wrong sub-planet positions |
| C3 | `src/app/[locale]/embed/panchang/page.tsx:34` | `-(new Date().getTimezoneOffset() / 60)` | Browser TZ for embedded panchang widget. | **YES — verified** | Wrong panchang in embeds for VPN/travel users |
| C4 | `src/app/[locale]/panchang/inauspicious/page.tsx:83,85` | `-(new Date().getTimezoneOffset() / 60)` on geolocation path | Browser TZ when geolocation succeeds (IP path has better handling). | **YES — verified (geolocation path only)** | Wrong Rahu Kaal/Yamagandam for travelers/VPN |
| C5 | `src/app/[locale]/panchang/auspicious/page.tsx:85,87` | Same as C4 | Browser TZ on geolocation path. | **YES — verified (geolocation path only)** | Wrong Abhijit Muhurta etc. |

### MEDIUM — Works on Vercel (UTC) by Coincidence

| # | File:Line | Pattern | Bug | Impact |
|---|-----------|---------|-----|--------|
| M1 | `src/lib/varshaphal/index.ts:34-35` | `.getHours()` on Date.UTC-constructed solar return date | Date.UTC stores LOCAL hours in UTC slots. `.getHours()` returns UTC slot value (= local hours on UTC server, shifted on non-UTC server). | Varshaphal chart wrong ascendant on dev machines. **Correct on Vercel.** |
| M2 | `src/lib/astronomy/sunrise.ts:87` | `new Date(y,m-1,d,h,m,s)` where h/m/s are local times | Consumers use `.getHours()` which returns server-local values. On UTC server = stored value. | Sunrise/sunset times wrong on non-UTC dev servers. |
| M3 | `src/lib/ephem/panchang-calc.ts:875-876` | `.getHours()` on getSunTimes() result | Depends on M2 — inherits the getSunTimes() design. | Panchang sunrise wrong on non-UTC dev. |
| M4 | `src/lib/kundali/shadbala.ts:552-553` | `.getHours()` on getSunTimes() result | Shadbala natonnata/paksha/tribhaga bala calculations. | Wrong strength values on non-UTC dev. |
| M5 | `src/lib/calendar/eclipse-compute.ts:126-127` | `.getHours()` on getSunTimes() result | Eclipse visibility computation. | Wrong eclipse times on non-UTC dev. |
| M6 | `src/lib/tippanni/year-predictions.ts:39-40` | `new Date()` local components for JD | Transit sign for year predictions. | Wrong transit sign on non-UTC dev. |
| M7 | `src/lib/personalization/transit-alerts.ts:14-15` | Same as M6 | Transit alert computation. | Wrong alerts on non-UTC dev. |
| M8 | `src/lib/personalization/gochar.ts:114-115` | Same as M6 | Gochar (transit) computation. | Wrong gochar on non-UTC dev. |

### LOW — Edge Cases or Documented Approximations

| # | File:Line | Pattern | Note |
|---|-----------|---------|------|
| L1 | `src/app/api/sankalpa/route.ts:44,48` | Server `getTimezoneOffset()` as fallback | Only when no `timezone` param sent |
| L2 | `src/app/api/muhurat/scan/route.ts:52` | Defaults to IST (5.5) | Non-Indian users get wrong muhurta silently |
| L3 | `src/lib/kp/kp-chart.ts:104` | Static TZ fallback map (incomplete) | Last-resort fallback only |
| L4 | `src/lib/utils/timezone.ts:54` | Pre-1906 India = 5.5 | Historical approximation, documented |

### NOT A BUG (False Positives from Audit)

| File | Pattern | Why it's safe |
|------|---------|---------------|
| `panchang-calc.ts:905` | `new Date(year, month-1, day)` | Weekday only — documented exception (Lesson L) |
| `daily-engine.ts:243` | `new Date(year, month-1, day)` | Weekday only — documented |
| `kundali-calc.ts:953-958` | `new Date(d.startDate) <= now` | Date comparison is TZ-agnostic (UTC ms internally) |
| `sky/positions.ts:67` | `new Date()` → `dateToJDSafe(d)` | `dateToJDSafe` uses `.getUTCFullYear()` etc. — correct |
| `prashna/ashtamangala.ts:121` | `getTime() + getTimezoneOffset() * 60000` | Correct UTC conversion arithmetic |
| All `festivals.ts` Date iteration | `new Date(y,m-1,d)` | Only for y/m/d extraction → fed to `dateToJD` separately |

## Fix Priority

1. **C1-C5** should be fixed: replace `-(new Date().getTimezoneOffset() / 60)` with `getUTCOffsetForDate(y, m, d, timezone)` using location store timezone or IP-resolved IANA timezone.
2. **M1** should fix `.getHours()` → `.getUTCHours()` in varshaphal/index.ts (and `.getMonth()` → `.getUTCMonth()` etc.)
3. **M2-M8** are Vercel-safe but represent technical debt. The `getSunTimes()` design of storing local hours in a Date object is fragile. A proper fix would return a plain `{ hour, minute, second }` object instead of a Date.
