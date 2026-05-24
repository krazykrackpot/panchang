# Bug Hunt Round 2 — Time / Timezone / DST

**Date:** 2026-05-24
**Scope:** All surviving time, timezone, date-math, IANA, DST, midnight-wrap issues
**Base:** HEAD `500fd998` (post-sprint-17)
**Prior audit:** `docs/audits/2026-05-23-bug-hunt.md`

Round-1 closures (do not re-report): `getSunTimes` tz-safe minutes contract added, Gulika wrap normalised, ashtamangala double-tz fixed, JD↔Date UTC anchoring in core 22-file pipeline.

The bad `getSunTimes` Date return values are still *exposed* (the SunTimes interface keeps the `sunrise/sunset/dawn/dusk` Date fields as `@deprecated`), and several consumers still call `.getHours()` / `.getTime()` on them. Cascade is incomplete.

---

### TZ-1 — `shadbala.ts` reads `sunTimes.sunrise.getHours()/getMinutes()` (cascade of P0-15)

- **File:** `src/lib/kundali/shadbala.ts:629-630`
- **Severity:** P0
- **Evidence:**
  ```ts
  const sunriseHour = sunTimes.sunrise.getHours() + sunTimes.sunrise.getMinutes() / 60;
  const sunsetHour = sunTimes.sunset.getHours() + sunTimes.sunset.getMinutes() / 60;
  const isDayBirth = birthHour >= sunriseHour && birthHour < sunsetHour;
  ```
- **Why it's a bug:** `sunTimes.sunrise` is built with `new Date(year, month-1, day, h, m, s)` — its `.getHours()/.getMinutes()` return server-local h/m, not the observer's wall-clock. On Vercel UTC this happens to work because UTC≡birth-location accessor coincidence is one of many possible offsets; on a non-UTC dev machine (incl. user's MacOS in Switzerland) the dignity computation flips birth from day to night → wrong natonnata-bala/tribhaga-bala/hora-bala → cascading Shadbala error → wrong dignity ranks across the whole tippanni. The Round-1 audit added `sunriseMinutes` and `sunsetMinutes` to `SunTimes` precisely so consumers could swap, but this consumer didn't.
- **Proposed fix:** Replace `getHours()+getMinutes()/60` with `sunTimes.sunriseMinutes/60` and `sunTimes.sunsetMinutes/60`.

### TZ-2 — `puja/muhurta-compute.ts` `nishita` window arithmetic on bad Dates

- **File:** `src/lib/puja/muhurta-compute.ts:101-117`
- **Severity:** P0
- **Evidence:**
  ```ts
  const nextDay = new Date(year, month - 1, day + 1);          // local-tz Date
  const tomorrowSun = getSunTimes(
    nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate(), …);
  const solarMidnightMs =
    (sunset.getTime() + tomorrowSun.sunrise.getTime()) / 2;    // .getTime() on local-tz Date
  const solarMidnight = new Date(solarMidnightMs);
  return { start: addMinutes(solarMidnight, -24), end: addMinutes(solarMidnight, 24), type };
  ```
- **Why it's a bug:** `sunset.getTime()` and `tomorrowSun.sunrise.getTime()` differ by both real ms AND server-tz shift; averaging them gives `solarMidnightMs = trueMidpointMs + tzShiftMs`. The window is offset by the server-tz offset (hours, not minutes) — Nishita Puja muhurta window is presented at the wrong wall-clock to a global user. Then `formatMuhurtaTime` (line 128-129) calls `.getHours()/getMinutes()` on top of that, double-leaking.
- **Proposed fix:** Compute midnight from `sunsetMinutes` + `(24*60 - sunsetMinutes + tomorrowSunriseMinutes)/2` purely in minutes; only render via the tz-aware formatter at the end.

### TZ-3 — `parana-compute.ts` does Date arithmetic on bad sunrise/sunset Dates

- **File:** `src/lib/puja/parana-compute.ts:52-115`
- **Severity:** P0
- **Evidence:**
  ```ts
  const nextDay = new Date(vratDate);
  nextDay.setDate(nextDay.getDate() + 1);                 // local-tz Date
  const nextDaySun = getSunTimes(nextDay.getFullYear(), nextDay.getMonth() + 1, …);
  const { sunrise, dayDurationMinutes } = nextDaySun;     // sunrise is bad-Date
  …
  if (tithiEndDate && tithiEndDate.getTime() < quarterEnd.getTime()) end = tithiEndDate;
  if (end.getTime() <= sunrise.getTime()) end = quarterEnd;
  ```
- **Why it's a bug:** Same cascade as TZ-1/TZ-2. Ekadashi parana — the highest-stakes user-facing window (vrat-breaking time) — is computed by comparing `tithiEndDate.getTime()` (a UT instant) with `sunrise.getTime()` (server-tz-shifted local-clock packed into a Date). On UTC the gap matches by coincidence; off-UTC it's off by server-tz hours. Users break their fast 2-3h early or late depending on the dev environment.
- **Proposed fix:** Use `sunriseMinutes` from the tz-safe contract and store parana endpoints as `(date, minutesSinceMidnight)` pairs, not Dates. Only convert to Date at the render boundary.

### TZ-4 — `learn/labs/dasha/page.tsx` builds birth Date in browser TZ, not birth-location TZ

- **File:** `src/app/[locale]/learn/labs/dasha/page.tsx:290`
- **Severity:** P0
- **Evidence:**
  ```ts
  const birthDateObj = new Date(year, month - 1, day, hour, minute); // browser-local
  // …
  const firstEnd = addYearsDecimal(cursor, balanceYears);            // ms math from that base
  ```
- **Why it's a bug:** Lesson L violation. The lab demo's dasha timeline is built from a `new Date()` interpreted in the *browser's* timezone, but the user's birth time `hour:minute` is meant to be local-to-birthplace. A learner in Switzerland entering Delhi birth (10:30 IST) actually creates 10:30 CEST → all dasha boundaries shifted ~3.5h, multi-day error compounded over decades. The exact bug Round-1 fixed in `kundali-calc.ts:908` (now `Date.UTC` with `utHour`) — but the *learning lab* still demonstrates it. Worse: a user copying this code as a worked example will reproduce it.
- **Proposed fix:** Compute `utHour = hour - tzOffset` from birth-location tzOffset (already in `location.timezone`), then `new Date(Date.UTC(year, month-1, day, utHourInt, utMinFromFrac))`. Mirror the fix already in `kundali-calc.ts:902-908`.

### TZ-5 — `gochar.ts` and `transit-alerts.ts` build JD from server-local "now"

- **File:** `src/lib/personalization/gochar.ts:114-115`, `src/lib/personalization/transit-alerts.ts:14-15`
- **Severity:** P0
- **Evidence:**
  ```ts
  const now = new Date();
  const jd = dateToJD(
    now.getFullYear(), now.getMonth() + 1, now.getDate(),
    now.getHours() + now.getMinutes() / 60,
  );
  ```
- **Why it's a bug:** `dateToJD` expects UT components. Passing server-local `getHours()` builds a JD that is shifted by the server's timezone offset — every transiting planet position is wrong by `(serverTz × planetSpeed)`. For Moon at ~0.5°/h × 5.5h IST shift ≈ 2.75° → wrong transit nakshatra/house with probability ~30%. Vercel UTC accidentally works; dev / region-migration breaks it. Same shape as Round-1 P1-27 — not actually closed.
- **Proposed fix:** Use `now.getUTCFullYear/getUTCMonth/getUTCDate/getUTCHours+getUTCMinutes/60`. Even better: skip Date entirely — `jd = 2440587.5 + Date.now()/86_400_000`.

### TZ-6 — `journal/snapshot.ts` reads local accessors on incoming Date

- **File:** `src/lib/journal/snapshot.ts:94-96`, called from `predictions/route.ts:148` (`new Date()`) and `journal/route.ts:122-126` (`new Date()`)
- **Severity:** P0
- **Evidence:**
  ```ts
  // route.ts:
  const today = new Date();
  const result = buildPlanetarySnapshot(lat, lng, timezone, today, …);
  // snapshot.ts:
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // …
  const tzOffset = getUTCOffsetForDate(year, month, day, timezone);
  ```
- **Why it's a bug:** The function takes an explicit `timezone` parameter (the user's panchang/birth tz) but then reads y/m/d from the Date using *server-local* accessors. A user in Asia at 23:00 IST whose server is UTC will get `getDate() = today-1 UTC`. The panchang then computes for the wrong civil day. Symmetric error on the other side of UTC. The `today: new Date()` call site never passes a UTC-aligned date.
- **Proposed fix:** Either have callers pass a `{ year, month, day }` triplet, or use `Intl.DateTimeFormat({ timeZone }, …).formatToParts(date)` to extract user-tz components inside `snapshot.ts`.

### TZ-7 — Six "Today's-X" pages send browser-local y/m/d to API for non-browser timezone

- **Files:**
  - `src/app/[locale]/rahu-kaal/Client.tsx:134-137`
  - `src/app/[locale]/choghadiya/Client.tsx:159-162`
  - `src/app/[locale]/panchak/page.tsx:129-132`
  - `src/app/[locale]/holashtak/page.tsx:155-…` (`year, month, day` from `now`)
  - `src/app/[locale]/chandra-darshan/page.tsx:150-153`
  - `src/app/[locale]/dinacharya/page.tsx:141-152` (sent to `/api/panchang`)
  - `src/app/[locale]/embed/panchang/page.tsx:36-37`
- **Severity:** P1
- **Evidence (representative):**
  ```ts
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  // …
  computePanchang({ year, month, day, …, timezone: selectedCity.timezone });
  ```
- **Why it's a bug:** Today's y/m/d is read in the browser's tz, then handed to `computePanchang` which is supposed to produce the panchang for `selectedCity.timezone`. When the two differ across midnight, the user sees yesterday's or tomorrow's panchang. E.g. user in Geneva at 23:30 viewing Delhi (already next-day in Delhi) sees Geneva's "today" panchang for Delhi — wrong tithi, wrong choghadiya, wrong rahu-kaal. The fix utility `todayInTimezone(timezone)` from `lib/utils/now-in-timezone.ts` exists for exactly this; these pages just don't call it.
- **Proposed fix:** Replace each `now.getFullYear/Month/Date` with `todayInTimezone(selectedCity.timezone).split('-')` then parse to ints.

### TZ-8 — Dashboard transition "passed?" predicate compares browser-local clock with location-local strings

- **File:** `src/app/[locale]/dashboard/page.tsx:1378-1388, 1407-1417`
- **Severity:** P1
- **Evidence:**
  ```ts
  const passed = (time: string, date?: string): boolean => {
    const now = new Date();
    const [h, m] = time.split(':').map(Number);
    if (date) {
      const [y, mo, d] = date.split('-').map(Number);
      const target = new Date(y, mo - 1, d, h, m);  // browser-local
      return now >= target;
    }
    const target = new Date(); target.setHours(h, m, 0, 0); // browser-local
    return now >= target;
  };
  ```
- **Why it's a bug:** `time` and `date` come from `panchang.tithiTransition` / `nakshatraTransition` which are in the *panchang location*'s wall-clock. The comparison is in the *browser*'s wall-clock. Cross-tz user sees `activeTithi` flip hours early/late — visible regression of Round-1 lesson ZA (same data must come from same source).
- **Proposed fix:** Use `hasMomentPassed(time, date, panchangTimezone)` from `lib/utils/now-in-timezone.ts` — already exists for exactly this case.

### TZ-9 — `hora/Client.tsx` initial `selectedDate` and `isToday` use browser-local

- **File:** `src/app/[locale]/hora/Client.tsx:138-141, 154-158`
- **Severity:** P1
- **Evidence:**
  ```ts
  // initial state default:
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  // isToday:
  const todayStr = `${now.getFullYear()}-${…}-${…}`;
  return selectedDate === todayStr;
  ```
- **Why it's a bug:** Page already imports and uses `nowMinutesInTimezone(timezone)` for current-minute tracking — but the date itself is browser-local. Result: across a midnight boundary between user and panchang location, the page opens to the wrong day, and the NOW highlight runs against a hora list that doesn't apply.
- **Proposed fix:** `todayInTimezone(timezone)` for both default state and `isToday`.

### TZ-10 — `vedic-time/Client.tsx` tzOffset and "today" use brittle `new Date(toLocaleString)` round-trip + browser-local y/m/d

- **File:** `src/app/[locale]/vedic-time/Client.tsx:266-298`
- **Severity:** P1
- **Evidence:**
  ```ts
  const tzOffset = useMemo(() => {
    try {
      const now = new Date();
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const localDate = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
      return (localDate.getTime() - utcDate.getTime()) / 3600000;
    } catch {
      return new Date().getTimezoneOffset() / -60;
    }
  }, [userTimezone]);
  // …
  const y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
  const today = getSunTimes(y, m, d, lat, lng, tzOffset);
  ```
- **Why it's a bug:** Two issues compound. (1) The `toLocaleString` round-trip is brittle across Node/browser versions and locale-format changes — duplicates the canonical `getUTCOffsetForDate` in `lib/utils/timezone.ts`. (2) Even if tzOffset is correct, `y/m/d` are from browser-local — so the panchang context flips one civil day off when browser and location straddle midnight.
- **Proposed fix:** `import { getUTCOffsetForDate } from '@/lib/utils/timezone'`; `todayInTimezone(userTimezone)` for y/m/d.

### TZ-11 — `puja/[slug]/page.tsx` `tzOffset` uses brittle round-trip + browser-local today

- **File:** `src/app/[locale]/puja/[slug]/page.tsx:362-371, 412-444`
- **Severity:** P1
- **Evidence:**
  ```ts
  const timezoneOffset = useMemo(() => {
    try {
      const now = new Date();
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const localDate = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
      return (localDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    } catch {
      return new Date().getTimezoneOffset() / -60;
    }
  }, [userTimezone]);
  …
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  …
  } catch {  /* swallow */ }
  ```
- **Why it's a bug:** Same brittle pattern as TZ-10. Plus the catch on line 444 silently swallows festival-lookup errors (Lesson A). "Next vrat date" can show wrong year or nothing without any console signal.
- **Proposed fix:** Switch to `getUTCOffsetForDate` and `todayInTimezone`. Replace bare `catch {}` with `console.error('[puja-page] festival lookup failed:', e)`.

### TZ-12 — `varshaphal/solar-return.ts` `jdToDateObj` builds Date.UTC with local-wall-clock components

- **File:** `src/lib/varshaphal/solar-return.ts:89-112` (still flagged P0-19 in Round 1; partial fix applied but contract leak remains)
- **Severity:** P1
- **Evidence:**
  ```ts
  const hourFrac = (dayFrac - day) * 24 + tzOffset;          // local-wall-clock hour
  const hour = Math.floor(hourFrac);
  const min  = Math.floor((hourFrac - hour) * 60);
  // hour can be ≥ 24 or < 0 — relies on Date.UTC's auto-normalisation
  return new Date(Date.UTC(year, month - 1, day, hour, min));
  ```
  Consumer:
  ```ts
  // index.ts:52
  const srWeekday = srDate.getUTCDay();
  ```
- **Why it's a bug:** The returned Date has UTC components equal to the local wall-clock at birth location (sentinel value). Calling `.getUTCDay()` on it yields the birth-location *calendar weekday* — which is what's wanted for Varsheshvara. BUT: (a) the contract is non-obvious and footgun-prone; any other consumer calling `.getTime()` will get a value `tzOffset` hours off from real UTC; (b) on extreme tzOffsets near year boundary, hour-overflow normalisation lands the date on the wrong year. Document the contract or change the return shape.
- **Proposed fix:** Return `{ jd, weekday, year, month, day, hour, min }` from `jdToDateObj` so callers don't have to know the Date's semantics.

### TZ-13 — `festivals.ts` tithi-date scanners use local-tz `setDate` over 15-50 days (DST drift)

- **File:** `src/lib/calendar/festivals.ts:54-78, 84-105, 134-198, 340-345`
- **Severity:** P1
- **Evidence:**
  ```ts
  const startDate = new Date(year, month - 1, 1);
  startDate.setDate(startDate.getDate() - 15);
  for (let offset = 0; offset <= 50; offset++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + offset);
    const gy = d.getFullYear();
    const gm = d.getMonth() + 1;
    const gd = d.getDate();
    …
  }
  ```
- **Why it's a bug:** Across DST transition (March/November in EU/US), `setDate(getDate() + offset)` can give a Date that's actually one second before midnight of the intended day (or one second after), and `getFullYear/Month/Date` then reports the WRONG date for *that specific iteration*. Result: a festival like Krishna Janmashtami can shift one Gregorian day when the scan window straddles DST. Existing Lesson L for the rest of the engine.
- **Proposed fix:** Iterate JD directly: `for (let offset = 0; offset <= 50; offset++) { const { y, m, d } = jdToGregorian(startJD + offset); … }` — already used elsewhere in the same file via `dateToJD`. Or use `Date.UTC` + `setUTCDate`.

### TZ-14 — `monthly-calendar.ts` "today" computed in server-local TZ, ignoring user `timezone` param

- **File:** `src/lib/personalization/monthly-calendar.ts:89-91`
- **Severity:** P1
- **Evidence:**
  ```ts
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  ```
- **Why it's a bug:** Function accepts `timezone` as a parameter (used elsewhere for tzOffset resolution), but "today" is computed in server-local. On Vercel UTC, a user in Asia/Tokyo whose local time is 06:00 will see the previous day still marked as "today" on the calendar (because UTC is 21:00 the prior day). The day-quality stats are highlighted on the wrong cell.
- **Proposed fix:** `const todayStr = todayInTimezone(timezone);` (helper already exists).

### TZ-15 — Daily-panchang cron schedule fixed at 00:30 UTC, not per-user-tz cohorts

- **File:** `.github/workflows/cron-all.yml:12` + `src/app/api/cron/daily-panchang/route.ts`
- **Severity:** P2
- **Evidence:**
  ```yaml
  - cron: '30 0 * * *'   # 00:30 UTC = 06:00 IST — daily panchang email + social post
  ```
- **Why it's a bug:** Daily panchang email is intended to arrive at "morning" for each user. The cron fires once globally; for IST it lands at 06:00 (perfect), but for PT it arrives at 16:30 the *previous* day (technically still "today UTC"), and the email body shows today's UTC panchang — which for PT users is tomorrow's local day. The route does `Intl.DateTimeFormat({ timeZone: tz })` to extract local y/m/d at send time, so the y/m/d will read as "today PT" not "today UTC" — but the cron timing still means the email arrives at dinner time PT for the *next* day, not morning.
- **Proposed fix:** Per-tz-cohort cron (e.g. five cron schedules at 00:30 UTC, 04:30 UTC, 08:30 UTC, 14:30 UTC, 20:30 UTC, each filtering users whose tz falls in the matching 6-hour band so the email always lands 06:00–08:00 local). Alternatively, run hourly and skip users whose local hour ≠ 06.

### TZ-16 — Email-alerts cron dedup row keyed on server-local "today"

- **File:** `src/app/api/cron/email-alerts/route.ts:84`
- **Severity:** P2
- **Evidence:**
  ```ts
  .gte('created_at', new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString())
  ```
- **Why it's a bug:** `new Date(now.getFullYear(), now.getMonth(), now.getDate())` builds server-local midnight on a Vercel UTC instance — fine until the cron schedule shifts or the function migrates regions. The dedup window then no longer aligns with the per-user "today" decided elsewhere in the loop. Same shape as the May-20 bombardment vector.
- **Proposed fix:** `const utcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();`

### TZ-17 — `learning-progress-store.ts` streak uses browser-local Date

- **File:** `src/stores/learning-progress-store.ts:243-265`
- **Severity:** P1
- **Evidence:**
  ```ts
  function getTodayStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function isTodayMonday(): boolean {
    return new Date().getDay() === 1;
  }
  ```
- **Why it's a bug:** Memory project flagged this. User traveling crosses tz → streak resets early or doesn't reset when expected. Across DST or year-end, weekly freeze reset (Monday-only) fires on the wrong day for users east/west of server. Cross-store helper `todayForUser(timezone)` was promised but not landed.
- **Proposed fix:** Resolve the user's panchang/birth tz (from `useLocationStore` or `useAuthStore.profile.timezone`) and use `todayInTimezone(tz)`. Same fix powers `subscription-store.fetchUsage`.

### TZ-18 — `subscription-store.fetchUsage` queries `usage_date` in UTC, but server-side increment may use local

- **File:** `src/stores/subscription-store.ts:146`
- **Severity:** P2
- **Evidence:**
  ```ts
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('daily_usage')
    .select('kundali_count, pdf_export_count')
    .eq('user_id', user.id)
    .eq('usage_date', today)
    .maybeSingle();
  ```
- **Why it's a bug:** `.toISOString()` on browser-local Date converts to UTC — so a user at 23:00 PT (07:00 UTC next day) queries tomorrow's UTC row but the server's `increment_usage` RPC may use IST-cohorted day. Net effect: user sees "0 used" but is actually quota-blocked, or vice versa. Mismatch only surfaces when DB record day-key convention diverges from client read.
- **Proposed fix:** Pick one canonical convention (recommendation: user's panchang tz from store) and use it both client and RPC side.

### TZ-19 — `chakra-systems.ts` + `mangal-dosha-engine.ts` compute age via server-local `getFullYear()`

- **File:** `src/lib/kundali/chakra-systems.ts:35`, `src/lib/kundali/mangal-dosha-engine.ts:228`
- **Severity:** P2
- **Evidence:**
  ```ts
  const currentAge = new Date().getFullYear() - birthYear;
  // …
  const currentYear = new Date().getFullYear();
  ```
- **Why it's a bug:** For a Dec 31 22:00 PT moment, server UTC is Jan 1 06:00 → `getFullYear()` returns Y+1, age inflated by 1, "matured Mars" (Mangal-dosha cancellation at age 28) kicks in 24h early. Mangal-dosha cancellation flag (visible in tippanni/matching) flips between client and server renders at year-end.
- **Proposed fix:** Pass `currentDate` (UTC-aligned) as a parameter; same pattern as `key-dates.ts` / `health-timeline.ts`. The kundali snapshot already carries the user's tz — use it.

### TZ-20 — `social-post/route.ts` `dayOfYear` uses local-tz Jan-0 origin

- **File:** `src/app/api/cron/social-post/route.ts:564`, `src/lib/youtube/generate-short.ts:38-39`, `src/app/api/social/youtube/route.tsx:65`
- **Severity:** P3
- **Evidence:**
  ```ts
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  ```
- **Why it's a bug:** `new Date(yyyy, 0, 0)` is local-tz Dec 31 prev year. On Vercel UTC, dayOfYear is computed against UTC Dec 31 — which differs from any user's local dayOfYear near year boundaries. Temple-hashtag rotation flips a day off for half the planet at Jan 1. Cosmetic but inconsistent.
- **Proposed fix:** Use UTC accessors explicitly: `new Date(Date.UTC(new Date().getUTCFullYear(), 0, 0))`.

### TZ-21 — `jaimini-calc.ts` Chara Dasha `setFullYear` over 144-year cycle (DST drift)

- **File:** `src/lib/jaimini/jaimini-calc.ts:238-249`
- **Severity:** P2
- **Evidence:**
  ```ts
  const endDate = new Date(currentDate);
  endDate.setFullYear(endDate.getFullYear() + years);
  ```
- **Why it's a bug:** Cumulatively across 12 signs × 12-year average = 144 years, DST transitions in the host TZ shift `setFullYear` results by ±1 hour each. By year 144 the cumulative drift can be 24h+, flipping a sign-change date by one calendar day. Lesson P, still unfixed in Jaimini engine.
- **Proposed fix:** `new Date(currentDate.getTime() + years * 365.25 * 24 * 60 * 60 * 1000)`.

### TZ-22 — `dhana-activation.ts` + `health-timeline.ts` + `annual-financial.ts` setFullYear on UTC midnight Date

- **File:** `src/lib/financial/dhana-activation.ts:63-64`, `src/lib/medical/health-timeline.ts:46-48`, `src/lib/financial/annual-financial.ts:183-184`
- **Severity:** P2
- **Evidence:**
  ```ts
  const today = new Date(todayISO);
  const tenYearsLater = new Date(today);
  tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);
  ```
- **Why it's a bug:** `new Date('YYYY-MM-DD')` is UTC midnight; `setFullYear/getFullYear` use *local* fields, so on a non-UTC host (or after DST shift), the year-add operation can drift by ±1 hour each call → ±10h over 10 years for Dhana, accumulating across all uses. The 12-window financial scan in `financial-windows.ts:132` mixes the same approach: `new Date(Date.UTC(today.getFullYear(), today.getMonth() + i, 15))` — reads local-tz year/month from a UTC-midnight Date, can shift the start month by one for UTC- servers.
- **Proposed fix:** `new Date(today.getTime() + 10 * 365.25 * 86_400_000)`. For financial-windows, use `getUTCFullYear/getUTCMonth`.

### TZ-23 — `key-dates.ts` + `timeline.ts` mix `setDate/setMonth/setFullYear` with UTC-midnight Dates

- **File:** `src/lib/kundali/domain-synthesis/key-dates.ts:111, 175, 251, 320, 397`, `src/lib/kundali/domain-synthesis/timeline.ts:37, 280, 309, 318, 384, 390, 395, 397`
- **Severity:** P2
- **Evidence:**
  ```ts
  const windowEnd = new Date(currentDate);
  windowEnd.setMonth(windowEnd.getMonth() + monthsAhead);          // local-tz set on possibly UTC Date
  …
  const sandhiStart = new Date(mahaStart);
  sandhiStart.setDate(sandhiStart.getDate() - 45);                 // DST-sensitive
  …
  const ingressDate = new Date(start);
  ingressDate.setDate(ingressDate.getDate() + daysToIngress);
  ```
- **Why it's a bug:** Each `.setDate()` on a UTC-midnight Date can drift the wall-clock by ±1h across DST. Over the 45-day sandhi and 12-month windows, the result is a date that's 1–2 days off the intended midnight when the scan crosses March/November. User sees "Mahadasha begins May 14" when classical computation says May 15.
- **Proposed fix:** Convert to ms-based: `new Date(start.getTime() + days * 86_400_000)` and accept the (negligible) leap-second drift; or use `Date.UTC` + `setUTCDate`.

### TZ-24 — `chandra-darshan/page.tsx` builds reference date entirely in browser-local

- **File:** `src/app/[locale]/chandra-darshan/page.tsx:150-168`
- **Severity:** P1
- **Evidence:** Same shape as TZ-7 — `now.getFullYear/Month/Date` plus `tzOffset = getUTCOffsetForDate(year, month, day, timezone)` (year/month/day are wrong TZ → tzOffset can be wrong on DST boundary)
- **Why it's a bug:** `getUTCOffsetForDate(year, month, day, timezone)` resolves tzOffset *at that date in that timezone*. If `year, month, day` were extracted from the browser's TZ but the user's panchang timezone is on DST and the browser is not (or vice versa), the resolved tzOffset can be off by 1h on the DST transition day. Cumulatively wrong moonrise/sunset → wrong assessment.
- **Proposed fix:** `const todayISO = todayInTimezone(timezone); const [y,m,d] = todayISO.split('-').map(Number);` then everything chains correctly.

### TZ-25 — `pancha-pakshi.ts` weekday from server-local `now.getDay()`

- **File:** `src/lib/prashna/pancha-pakshi.ts:166`
- **Severity:** P2
- **Evidence:**
  ```ts
  const weekday = now.getDay(); // 0=Sun
  ```
- **Why it's a bug:** `now` is whatever the caller passed — in `prashna-ashtamangala/page.tsx:201` it's a server-local `new Date()`. The pancha-pakshi day-ruler bird depends on weekday; near UT midnight crossing, this can flip to the wrong bird for users east/west of UTC.
- **Proposed fix:** Have the caller resolve weekday via `Intl.DateTimeFormat({ timeZone, weekday: 'short' })` or via JD `Math.floor(jd + 1.5) % 7`.

---

## Cross-cutting themes

1. **The Round-1 `getSunTimes` contract change shipped, but consumers didn't migrate.** `shadbala.ts`, `puja/muhurta-compute.ts`, `parana-compute.ts`, and a handful of `__tests__` still read `.getHours()/.getMinutes()/.getTime()` from the deprecated `sunrise/sunset/dawn/dusk` Date fields. Until those Dates are removed from `SunTimes`, the contract leak is structural. **Recommendation:** delete the four Date fields from the `SunTimes` interface and let the TypeScript compiler force every consumer to migrate to `*Minutes`.

2. **Browser-local "today" is the new server-local "today".** The Round-1 audit caught server-side `new Date()` consumed via `getFullYear/getMonth/getDate`. Round 2 finds eight client-side pages (`rahu-kaal`, `choghadiya`, `panchak`, `holashtak`, `chandra-darshan`, `dinacharya`, `puja`, `vedic-time`) doing the same thing for *display* and *API calls* that target a panchang location's timezone, not the browser's. The `nowMinutesInTimezone` / `todayInTimezone` helpers exist; pages just need a sweep to adopt them.

3. **Two duplicate `tzOffset` patterns survive.** `vedic-time/Client.tsx` and `puja/[slug]/page.tsx` reinvent tz-offset via `new Date(toLocaleString)` round-trip — brittle and a Lesson Q (duplicate logic) hazard. `getUTCOffsetForDate` in `lib/utils/timezone.ts` is the canonical resolver; both files should call it.

4. **Email-cron timing is one-size-fits-all.** Cron fires at 00:30 UTC = 06:00 IST. India users get a perfect morning send; everyone else gets it at random times of day. The fix is cohort-by-tz crons (5 schedules covering the planet) or an hourly cron that filters by `local_hour === 6`.

5. **Dasha period arithmetic drifts via `setFullYear` over multi-decade horizons.** Lesson P fix was applied to the main Vimshottari engine but missed Jaimini Chara Dasha (`jaimini-calc.ts:239`), Dhana 10-year horizon (`dhana-activation.ts:64`), Health 10-year horizon (`health-timeline.ts:48`). The pattern is identical; the fix is identical (`+ years * 365.25 * 86_400_000`).

6. **`setDate(getDate() + N)` over multi-week iteration is DST-fragile.** `festivals.ts` tithi-date scanners use it over 15-50 day windows; `domain-synthesis/key-dates.ts` + `timeline.ts` use it over 45-day sandhi periods and ingress projections. Each crossing of a DST transition shifts by 1 hour; cumulative shifts cross day boundaries near year boundaries.

7. **Streak / quota day-keys still use browser-local in stores.** `learning-progress-store` and `subscription-store` both build "today" from browser-local `getFullYear/getMonth/getDate` (or `.toISOString().slice(0,10)` which is UTC, mismatching server-side IST-cohorted day-keys elsewhere). Pick one convention and enforce it across stores + RPCs.

8. **The `varshaphal/solar-return.ts` Date contract is undocumented and ambiguous.** The returned Date's UTC components equal local wall-clock — works for `getUTCDay()`, breaks for `getTime()`. Any future consumer will footgun. Return a struct, not a Date.

Total findings: **25** (TZ-1 .. TZ-25).
Severity breakdown: **P0 ×6, P1 ×11, P2 ×7, P3 ×1**.
