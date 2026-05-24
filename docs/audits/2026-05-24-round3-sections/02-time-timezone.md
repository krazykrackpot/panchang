# Bug Hunt Round 3 — Time / Timezone / DST / Midnight Wrap

**Date:** 2026-05-24
**Scope:** surviving issues at HEAD `b4cd2720` (post-sprints 18..25)
**Prior audits:** `docs/audits/2026-05-23-bug-hunt.md` (Round 1), `docs/audits/2026-05-24-bug-hunt.md` + `2026-05-24-sections/02-time-timezone.md` (Round 2)

Round 2 closed (do not re-report): TZ-1..6 (`shadbala`, `puja/muhurta-compute`, `parana-compute`, `learn/labs/dasha`, `gochar`, `transit-alerts`, `journal/snapshot` — sprint 20 migrated to `*Minutes` and `Date.UTC`), TZ-7 (rahu-kaal, choghadiya, panchak, holashtak, chandra-darshan, dinacharya, embed/panchang — sprint 24 wired `todayInTimezone`), TZ-8 (dashboard `passed?` via `hasMomentPassed`), TZ-9 (hora initial date + `isToday`), TZ-14 (`monthly-calendar.ts` today). I verified each at HEAD before writing this report.

The Round 2 plan deferred ten items to "future cleanup." All ten are still present at HEAD `b4cd2720`. They appear below as `R3-TZ-1..R3-TZ-10`, severity-ranked. New findings start at `R3-TZ-11`.

---

## Surviving Round-2 deferrals (severity-ranked)

### R3-TZ-1 — `varshaphal/solar-return.ts` `jdToDateObj` returns Date whose UTC components are local-wall-clock (undocumented contract, year-overflow hazard)

- **File:** `src/lib/varshaphal/solar-return.ts:89-112`; consumer at `src/lib/varshaphal/index.ts:52` does `srDate.getUTCDay()`
- **Severity:** P1 (was P1 in Round 2, unchanged)
- **Evidence at HEAD:**
  ```ts
  const hourFrac = (dayFrac - day) * 24 + tzOffset;          // local wall-clock hour
  const hour = Math.floor(hourFrac);                         // can be ≥24 or <0
  const min  = Math.floor((hourFrac - hour) * 60);
  return new Date(Date.UTC(year, month - 1, day, hour, min));
  ```
- **Why still a bug:** The Date is a sentinel whose `.getUTCDay()` matches Varshaphal weekday-on-birth-location-civil-day — works for that consumer, but `.getTime()` on the same Date is off by `tzOffset` hours from real UTC. Any new consumer that needs an ms-instant will silently corrupt downstream math. Worse: near Dec 31/Jan 1 with large tzOffsets (`+14` Pacific/Kiritimati, `-12` Etc/GMT+12), `Date.UTC` auto-normalises hour ≥24 into next day → can land Varshaphal weekday on a calendar day in the *wrong year* relative to intent. Lesson Q (single source of truth for date semantics).
- **Proposed fix:** Return `{ jd, year, month, day, hour, min, weekday: ((Math.floor(jd + 1.5) + Math.floor(tzOffset / 24)) % 7 + 7) % 7 }` from `jdToDateObj` so callers don't have to know the Date is a sentinel.

### R3-TZ-2 — `festivals.ts` tithi-date scanners use local-tz `setDate` over 15-50 day windows (DST drift across spring/fall)

- **File:** `src/lib/calendar/festivals.ts:54-77, 84-105, 134-198, 340-355`
- **Severity:** P1
- **Evidence at HEAD:**
  ```ts
  const startDate = new Date(year, month - 1, 1);
  startDate.setDate(startDate.getDate() - 15);
  for (let offset = 0; offset <= 50; offset++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + offset);
    const gy = d.getFullYear(); …
  }
  ```
  Also `findEkadashiDate` loop at line 134 and the `dd.setDate(dd.getDate() + 1)` at line 165 (nextDay calc inside an iterator).
- **Why still a bug:** On a non-UTC dev/eval host (or after a Vercel region change), each `setDate(getDate() + offset)` across a DST transition shifts the resulting timestamp by ±1 hour. `getFullYear/getMonth/getDate` then report off-by-one for that day → a festival date can shift one Gregorian day when the scan crosses March/November DST. On UTC (current Vercel), this hides — but any developer running the test suite on local TZ in March/November sees flaky tithi dates. The Round 2 file referenced the JD-iteration fix; not landed.
- **Proposed fix:** Iterate JD directly: `for (let offset = 0; offset <= 50; offset++) { const { y, m, d } = jdToGregorian(startJD + offset); … }`. The conversion utility already exists in this file at line 138.

### R3-TZ-3 — `vedic-time/Client.tsx` reinvents tzOffset via brittle `toLocaleString` round-trip + reads browser-local y/m/d (Lesson Q duplicate)

- **File:** `src/app/[locale]/vedic-time/Client.tsx:266-298`
- **Severity:** P1
- **Evidence at HEAD:** Identical to Round 2 audit:
  ```ts
  const tzOffset = useMemo(() => {
    try {
      const now = new Date();
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const localDate = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
      return (localDate.getTime() - utcDate.getTime()) / 3600000;
    } catch { return new Date().getTimezoneOffset() / -60; }
  }, [userTimezone]);
  const y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();   // browser-local
  const today = getSunTimes(y, m, d, lat, lng, tzOffset);
  ```
- **Why still a bug:** Two compounding flaws — (1) `toLocaleString` round-trip is implementation-defined (Node vs browser locale-format differs), and the canonical `getUTCOffsetForDate` already exists in `lib/utils/timezone.ts`; (2) y/m/d are browser-local but tzOffset is location-derived, so when browser and location straddle midnight, the page renders Vedic time for the wrong civil day. The `panchangCtx` block on line 308 uses these as JD inputs — every tithi/yoga/nakshatra in the wheel is then drawn for the wrong day.
- **Proposed fix:** `import { getUTCOffsetForDate } from '@/lib/utils/timezone'; import { todayInTimezone } from '@/lib/utils/now-in-timezone';` then replace the round-trip and the browser-local y/m/d.

### R3-TZ-4 — `puja/[slug]/page.tsx` same `toLocaleString` round-trip + browser-local today + silent-catch on festival lookup

- **File:** `src/app/[locale]/puja/[slug]/page.tsx:362-371, 412-444`
- **Severity:** P1
- **Evidence at HEAD:**
  ```ts
  const timezoneOffset = useMemo(() => {
    try { /* same toLocaleString round-trip */ }
    catch { return new Date().getTimezoneOffset() / -60; }
  }, [userTimezone]);
  …
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  …
  } catch {  /* Fail silently – date is optional */ }   // line 444
  ```
- **Why still a bug:** Same shape as R3-TZ-3 for the offset, and additionally the `catch {}` on line 444 fully swallows festival-generator failures (Lesson A). Result: "Next vrat date" can render empty or with the *current year* fallback even when the underlying issue is a generator bug or a passed-by-the-server invalid date — no console signal, no UI signal.
- **Proposed fix:** Same as R3-TZ-3 plus `catch (e) { console.error('[puja-page] festival lookup failed:', e); }`.

### R3-TZ-5 — Daily-panchang cron schedule fixed at 00:30 UTC, not per-user-tz cohorts

- **File:** `.github/workflows/cron-all.yml:12` + `src/app/api/cron/daily-panchang/route.ts`
- **Severity:** P2
- **Evidence at HEAD:**
  ```yaml
  - cron: '30 0 * * *'   # 00:30 UTC = 06:00 IST — daily panchang email + social post
  ```
- **Why still a bug:** Cron is global — IST users get 06:00 (perfect), but PT users get the email at 16:30 the previous day (still UTC "today"). For a US PT user the daily-panchang body shows "today's UTC panchang" — which is the user's *yesterday* if they read it in the morning. Even with the route's `Intl.DateTimeFormat({timeZone:tz})` extraction at send time, the *timing of arrival* is wrong for most of the planet. This is the same shape as the May-20 incident (timing fragility, not content). Worth flagging because user base is global (Switzerland, US, Europe per memory).
- **Proposed fix:** Five cohort crons (00:30, 04:30, 08:30, 14:30, 20:30 UTC) each filtering users by `tz_offset_bucket`. Or run hourly and filter by `local_hour === 6`.

### R3-TZ-6 — Email-alerts cron dedup row keyed on server-local "today" (May-20 bombardment shape)

- **File:** `src/app/api/cron/email-alerts/route.ts:84`
- **Severity:** P2
- **Evidence at HEAD:**
  ```ts
  .gte('created_at', new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString())
  ```
- **Why still a bug:** Constructor reads server-local Y/M/D and rebuilds a Date; on Vercel UTC this is currently "today UTC" but if Vercel region migrates or someone runs the cron locally, the dedup window misaligns from the per-user "today" the route loop uses elsewhere. Same shape that produced the May-20 welcome-email bombardment.
- **Proposed fix:** `const utcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();`

### R3-TZ-7 — `learning-progress-store.ts` streak uses browser-local Date (cross-tz travel resets early/late)

- **File:** `src/stores/learning-progress-store.ts:243-265`
- **Severity:** P1
- **Evidence at HEAD:**
  ```ts
  function getTodayStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function isTodayMonday(): boolean { return new Date().getDay() === 1; }
  ```
- **Why still a bug:** Browser-local. User travels east→west crossing midnight — streak resets at wrong moment. Across DST or year-end, weekly-freeze Monday reset fires on wrong day. Memory project flagged this as deferred-audit-low-TZ; not landed. Promised cross-store helper `todayForUser(timezone)` has not landed.
- **Proposed fix:** Read panchang/birth tz from `useLocationStore` or `useAuthStore.profile.timezone` and use `todayInTimezone(tz)`. Symmetric fix needed in `subscription-store.fetchUsage` (R3-TZ-9).

### R3-TZ-8 — `chakra-systems.ts` + `mangal-dosha-engine.ts` compute age via server-local `getFullYear()`

- **File:** `src/lib/kundali/chakra-systems.ts:35`, `src/lib/kundali/mangal-dosha-engine.ts:228`
- **Severity:** P2
- **Evidence at HEAD:** Unchanged:
  ```ts
  const currentAge = new Date().getFullYear() - birthYear;
  const currentYear = new Date().getFullYear();
  ```
- **Why still a bug:** At Dec 31 22:00 PT, server UTC reads Jan 1 → year inflated, "matured Mars" (age 28 cancellation) kicks in 24h early. Mangal-dosha cancellation flag can flip between client and server renders at year-end. The Sade Sati engine fixed this with `getUTCFullYear()` (sprint 14, P2-4); this twin still uses local.
- **Proposed fix:** Pass UTC-aligned `currentDate` parameter (matches the pattern in `key-dates.ts`).

### R3-TZ-9 — `subscription-store.fetchUsage` queries `usage_date` via UTC slice; convention diverges from RPC

- **File:** `src/stores/subscription-store.ts:146`
- **Severity:** P2
- **Evidence at HEAD:**
  ```ts
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase.from('daily_usage')
    .select('kundali_count, pdf_export_count')
    .eq('user_id', user.id).eq('usage_date', today).maybeSingle();
  ```
- **Why still a bug:** `.toISOString()` is UTC, but `increment_usage` RPC may bucket on user/IST day. Net: user at 23:00 PT (07:00 UTC next day) queries tomorrow-UTC and sees "0 used" but is actually quota-blocked; or the RPC writes today-IST and the client never sees the row.
- **Proposed fix:** Pick one convention. Recommendation: user's panchang tz from store; pass it to RPC and use same key on read.

### R3-TZ-10 — `jaimini-calc.ts` Chara Dasha `setFullYear` across 144-year cycle (DST drift compounds to >24h)

- **File:** `src/lib/jaimini/jaimini-calc.ts:238-249`
- **Severity:** P2
- **Evidence at HEAD:**
  ```ts
  const endDate = new Date(currentDate);
  endDate.setFullYear(endDate.getFullYear() + years);
  ```
- **Why still a bug:** Lesson P. Cumulative `setFullYear` over the 144-year Chara Dasha cycle (12 signs × ~12y average) drifts by ~24h on a non-UTC host. Final sign-change date flips one Gregorian day. The Vimshottari engine fixed this in sprint 14; Jaimini was missed.
- **Proposed fix:** `new Date(currentDate.getTime() + years * 365.25 * 24 * 60 * 60 * 1000)`.

---

## New findings (post-Round-2)

### R3-TZ-11 — `dhana-activation.ts` + `health-timeline.ts` + `annual-financial.ts` `setFullYear` on UTC-midnight Date (drifts on non-UTC host)

- **File:** `src/lib/financial/dhana-activation.ts:63-64`, `src/lib/medical/health-timeline.ts:46-48`, `src/lib/financial/annual-financial.ts:183-184`
- **Severity:** P2
- **Evidence at HEAD:**
  ```ts
  const today = new Date(todayISO);                      // UTC midnight
  const tenYearsLater = new Date(today);
  tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);   // local accessor on UTC Date
  ```
- **Why a bug:** `new Date('YYYY-MM-DD')` is UTC midnight; `setFullYear`/`getFullYear` use *local* fields. On a non-UTC host the 10-year add drifts by `local-tz × 10 / 24` hours. For Asia/Tokyo dev (UTC+9), that's ~3.75 days over 10 years — visibly different window endpoint. Symmetrical for negative offsets. This was called out as P2 in Round 2 cross-cutting theme #5 but not landed.
- **Proposed fix:** `new Date(today.getTime() + 10 * 365.25 * 86_400_000)`.

### R3-TZ-12 — `domain-synthesis/key-dates.ts` + `timeline.ts` mix `setDate/setMonth/setFullYear` with UTC-midnight Dates (DST drift, 45-day windows)

- **File:** `src/lib/kundali/domain-synthesis/key-dates.ts:111, 175, 251, 320, 397`, `src/lib/kundali/domain-synthesis/timeline.ts:37, 280, 309, 318, 384, 390, 395, 397`
- **Severity:** P2
- **Evidence at HEAD:** Eleven occurrences confirmed present. Representative:
  ```ts
  const windowEnd = new Date(currentDate);
  windowEnd.setMonth(windowEnd.getMonth() + monthsAhead);   // line key-dates:111
  const sandhiStart = new Date(mahaStart);
  sandhiStart.setDate(sandhiStart.getDate() - 45);          // line key-dates:175
  endD.setDate(endD.getDate() + Math.round(daysToNextSign)); // line timeline:280
  ```
- **Why a bug:** UTC-midnight Date + local-tz `setDate` ⇒ each operation drifts by ±1h across DST. For 45-day sandhi windows that span March/November DST, the endpoint can be 1-2 days off intended midnight. The `domain-synthesis` output is what the synthesizer feeds to the LLM — wrong "Mahadasha begins" dates cascade into user-facing narrative.
- **Proposed fix:** Convert to ms-arithmetic: `new Date(start.getTime() + days * 86_400_000)`, or use `setUTCDate/setUTCMonth`.

### R3-TZ-13 — `pancha-pakshi.ts` `nextSunriseMs = sunriseMs + 24*60*60*1000` (DST crosses give 23h/25h)

- **File:** `src/lib/prashna/pancha-pakshi.ts:173`
- **Severity:** P2
- **Evidence at HEAD:**
  ```ts
  const nextSunriseMs = sunriseMs + 24 * 60 * 60 * 1000;
  const periodDuration = isDay ? (sunsetMs - sunriseMs) / 5 : (nextSunriseMs - sunsetMs) / 5;
  ```
- **Why a bug:** "Next sunrise = sunrise + 24h" is wrong across DST (true delta is 23h or 25h) and is fundamentally wrong even without DST because sunrise time drifts ~2-4 min/day with the Sun's declination. The pancha-pakshi night-period duration is then off by a few percent — the activity-bird boundary lands at wrong moment. Compounded by line 166 `now.getDay()` which uses local-tz weekday — for users east/west of UTC the bird-of-day flips at wrong moment.
- **Proposed fix:** Call `approximateSunriseSafe(jd + 1, lat, lng)` for the actual next sunrise JD. Resolve weekday via `Math.floor(jd + 1.5) % 7`.

### R3-TZ-14 — `domain-activations` cron last-month window uses local-tz `new Date(year, month-1, …)`

- **File:** `src/app/api/cron/domain-activations/route.ts:75-76`
- **Severity:** P2
- **Evidence at HEAD:**
  ```ts
  const now = new Date();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  ```
- **Why a bug:** Local-tz Y/M from server, but cron runs at 06:20 UTC on the 1st. On Vercel UTC this happens to align, but the constructor `new Date(y, m, 1)` builds a *server-local* midnight which is then coerced to ISO (UTC). For a non-UTC host this skews the `.gte('computed_at', lastMonthStart)` boundary by `tz` hours. Any reading written within `tz` hours of month-start is misclassified as "this month" vs "last month."
- **Proposed fix:** `Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)` and `Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)`.

### R3-TZ-15 — `email-alerts` cron `cycleStart = new Date(yyyy + '-01-01')` treats string as UTC; daysSinceStart drifts

- **File:** `src/app/api/cron/email-alerts/route.ts:152-153`
- **Severity:** P3
- **Evidence at HEAD:**
  ```ts
  const cycleStart = new Date(sadeSati.cycleStart + '-01-01');
  const daysSinceStart = Math.floor((now.getTime() - cycleStart.getTime()) / (24 * 60 * 60 * 1000));
  ```
- **Why a bug:** `new Date('2026-01-01')` is parsed as UTC midnight, but the cron runs at 07:00 UTC, so for 30 days the math is fine. Across DST transitions in countries that observe (EU, US), JS `Math.floor` near year-end can yield off-by-one for users approaching the 60-day cutoff. Cosmetic for now but Lesson L.
- **Proposed fix:** `Date.UTC(parseInt(sadeSati.cycleStart, 10), 0, 1)`.

### R3-TZ-16 — `tippanni/year-predictions.ts` builds yearStart/yearEnd from local-tz `new Date().getFullYear()` (mostly fixed, but other sites use it as the *literal Q-label* and as scan boundary)

- **File:** `src/lib/tippanni/year-predictions.ts:249, 327, 500`
- **Severity:** P2
- **Evidence at HEAD:**
  ```ts
  const year = new Date().getFullYear();                     // line 249 - dasha scan
  const yearStart = new Date(Date.UTC(year, 0, 1));         // good
  // line 327 - quarter labels:
  const year = new Date().getFullYear();                     // displayed in "Q1 (Jan–Mar ${year})"
  // line 500 - main entry:
  const year = new Date().getFullYear();                     // used everywhere
  ```
- **Why a bug:** At Dec 31 23:30 PT (Jan 1 07:30 UTC), `new Date().getFullYear()` on a Vercel UTC server returns Y+1, while a US user expects Y. Their year predictions silently switch to next year's dasha scan a day early. Symmetric for users east of UTC at Jan 1 00:30 local (Dec 31 UTC). Three call sites, all need `getUTCFullYear()`.
- **Proposed fix:** `const year = new Date().getUTCFullYear();` for all three. (The yearStart/yearEnd construction on 251-252 is already correctly using `Date.UTC` — that part is fine.)

### R3-TZ-17 — Multiple client pages default `dateStr` to UTC-derived `new Date().toISOString().split('T')[0]` instead of location tz

- **File:** `src/app/[locale]/upagraha/Client.tsx:322`, `src/app/[locale]/prashna/page.tsx:132`, `src/app/[locale]/prashna-ashtamangala/page.tsx:200-201`, `src/app/[locale]/dashboard/muhurta/page.tsx:66`, `src/app/[locale]/transits/page.tsx:235`
- **Severity:** P2
- **Evidence at HEAD (representative):**
  ```ts
  // upagraha/Client.tsx
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  // dashboard/muhurta:
  fetch(`/api/panchang?year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}&day=${new Date().getDate()}&…&timezone=…`)
  // prashna/page.tsx (line 132):
  date: now.toISOString().split('T')[0],
  // but
  time: <derived from new Intl.DateTimeFormat({timeZone: ianaTimezone}) on `now`>
  ```
- **Why a bug:** All five pages compute a date that is either UTC-derived (`toISOString().slice(0,10)`) or browser-tz-derived (`getFullYear/getMonth/getDate`), but pass it through to APIs/computations that expect the *panchang location's* civil date. For a Tokyo user at 06:00 local (21:00 UTC prev day), `upagraha` opens to *yesterday*. For prashna, the date is UTC but the time is location-tz — a Tokyo user at 02:00 local (17:00 UTC prev day) submits date=prev-day, time=02:00 → kundali engine builds JD for the wrong civil day, returns a chart that doesn't match the moment the user pressed the button. This is the prashna-accuracy class of bug.
- **Proposed fix:** All five → `todayInTimezone(ianaTimezone)` for date; for prashna the date *and* the time must come from the same Intl formatter pass on `now` to avoid the split.

### R3-TZ-18 — `gamification/ist-day.ts` hardcodes IST for ALL users (Swiss/US users have streaks resetting at 18:30/20:30 local)

- **File:** `src/lib/gamification/ist-day.ts:2-47`; used at `src/lib/gamification/award.ts:155` via `todayIst()`
- **Severity:** P2
- **Evidence at HEAD:**
  ```ts
  const IST_OFFSET_MIN = 330; // +05:30
  export function todayIst(): string { return istDate(new Date()); }
  ```
  Used in:
  ```ts
  // award.ts:151-155
  const r = computeStreakAfterVisit({
    streakDays: next.streak_days, lastVisit: next.streak_last_visit,
    freezeUsedAt: next.streak_freeze_used_at, today: todayIst(),
  });
  ```
- **Why a bug:** Streak day-key is IST regardless of user location. For a Swiss user (Europe/Zurich +01/+02), the streak rolls over at 19:30 CEST in summer (00:00 IST is 19:30 prev day CEST). Concretely: a user who logs in at 21:00 CEST every day will have their streak counted *twice* for one calendar day (21:00 CEST Tue = "Wed" IST; 21:00 CEST Wed = "Thu" IST — but their local Wed midnight passed without IST rolling over, so 22:00 CEST Wed = same "Thu" IST as next morning 06:00 CEST Thu, depending on when within the band). User base is global per memory; this WILL produce confused users + support requests. CLAUDE.md explicitly bans defaulting to IST/India for global users.
- **Proposed fix:** Replace `IST_OFFSET_MIN` with a per-user resolution from `profile.timezone` (or `useLocationStore.timezone` client-side). Helper signature `todayForUser(tz: string)`. The shape was already promised in `feedback_loading_and_writes` rule.

### R3-TZ-19 — `vrat/trackable-vrats.ts` weekly-vrat scan uses local-tz `setDate` over 4-week horizon

- **File:** `src/lib/vrat/trackable-vrats.ts:149-165`
- **Severity:** P3
- **Evidence at HEAD:**
  ```ts
  const today = new Date();
  const current = new Date(today);
  const diff = (dayOfWeek - current.getDay() + 7) % 7;
  current.setDate(current.getDate() + (diff === 0 ? 0 : diff));
  for (let i = 0; i < count; i++) {
    const y = current.getFullYear(); …
    current.setDate(current.getDate() + 7);
  }
  ```
- **Why a bug:** `today` is browser-local (or server-local on SSR). For users east of server-tz at near-midnight, `getDay()` returns wrong day-of-week → next 4 occurrences computed from wrong base. Each `setDate(+7)` crosses spring/fall DST in EU/US → the resulting Y/M/D could shift by 1 day on the iteration straddling DST.
- **Proposed fix:** Resolve user's tz, use `todayInTimezone(tz)`, iterate in JD or `+ 7 * 86_400_000` ms-arithmetic.

### R3-TZ-20 — `hora/Client.tsx` still constructs local-tz Date for weekday + passes Date to `calculateHoras`

- **File:** `src/app/[locale]/hora/Client.tsx:179-189`
- **Severity:** P3
- **Evidence at HEAD:**
  ```ts
  const [y, m, d] = selectedDate.split('-').map(Number);       // tz-correct y/m/d (good)
  …
  const dateObj = new Date(y, m - 1, d);                       // ← local-tz Date
  const weekday = dateObj.getDay();
  return calculateHoras(dateObj, sunriseLocal, sunsetLocal, nextSunriseLocal, weekday, …);
  ```
- **Why a bug:** Round 2 TZ-9 fixed `selectedDate` and `isToday` (sprint 24) but missed line 179 — the resulting `dateObj` is *server-local* midnight, which is then handed to `calculateHoras`. If `calculateHoras` does any `.getTime()` or `.getHours()` arithmetic on it (cross-check before declaring fixed), the same server-tz leak that Round 2 closed elsewhere resurfaces here. Even if `calculateHoras` only reads `dateObj` cosmetically, `weekday = dateObj.getDay()` *can* be wrong on a DST-spring-forward day (when local-tz midnight skips to 01:00, the Date's weekday is still correct by accident — but it's a footgun).
- **Proposed fix:** `const weekday = (Math.floor(dateToJD(y, m, d, 12) + 1.5)) % 7;` (Lesson O convention 0=Sun) and pass `{ y, m, d }` to `calculateHoras`, not a Date.

### R3-TZ-21 — `calendar/[slug]/page.tsx` Ekadashi lookup uses local-tz year + silently swallows server-action errors

- **File:** `src/app/[locale]/calendar/[slug]/page.tsx:154-169`
- **Severity:** P3
- **Evidence at HEAD:**
  ```ts
  useEffect(() => {
    …
    import('@/app/actions/festival-lookup').then(({ lookupEkadashiAction }) =>
      lookupEkadashiAction({ slug, dateParam: dateParam || undefined, lat: userLat, lng: userLng,
        timezone: userTimezone, year: new Date().getFullYear() })   // ← browser-local year
      .then(result => { if (!cancelled) setEkadashiParana(result); })
    ).catch(() => {});                                              // ← Lesson A swallow
    return () => { cancelled = true; };
  }, …);
  ```
- **Why a bug:** Two flaws compound. (1) `new Date().getFullYear()` is browser-local; on Dec 31 23:30 PT (Jan 1 07:30 UTC) a US user passes year=2026 while the page is rendered for year=2027 elsewhere. (2) `.catch(() => {})` discards every server-action failure — there's no console signal when the action fails, the spinner never clears, and `ekadashiParana` stays null with no UI clue. Lesson A.
- **Proposed fix:** `year: new Date().getUTCFullYear()`. Replace empty catch with `.catch(err => { console.error('[calendar-slug] ekadashi lookup failed:', err); })` and surface to user (banner / toast).

### R3-TZ-22 — `social/youtube` + `social-post` + `EclipseWatchCard` dayOfYear via local-tz Jan-0 origin

- **File:** `src/app/api/social/youtube/route.tsx:65`, `src/app/api/cron/social-post/route.ts:564`, `src/lib/youtube/generate-short.ts:38-39`, `src/components/dashboard/EclipseWatchCard.tsx:57`
- **Severity:** P3
- **Evidence at HEAD:**
  ```ts
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  ```
- **Why a bug:** `new Date(yyyy, 0, 0)` is local-tz Dec 31 of previous year. On Vercel UTC, this happens to match UTC Dec 31; but the dayOfYear is then computed against UTC `Date.now()` — for users east/west of UTC near year boundary, the dayOfYear flips a day off from the user's actual local day-of-year. Temple-hashtag rotation/eclipse-day banner content shows wrong content for half the planet at Jan 1.
- **Proposed fix:** `Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 86_400_000)`. Or extract from `Intl.DateTimeFormat` if location-tz needed.

### R3-TZ-23 — `dashboard/page.tsx` `passed?` predicate uses `new Date(y, mo-1, d, h, m)` (local-tz) twice

- **File:** `src/app/[locale]/dashboard/page.tsx:1383, 1412`
- **Severity:** P3
- **Evidence at HEAD:**
  ```ts
  const target = new Date(y, mo - 1, d, h, m);  // local-tz constructor
  return now >= target;
  ```
- **Why a bug:** Round 2 TZ-8 was reported fixed via `hasMomentPassed(time, date, panchangTimezone)` — verifying at HEAD shows the original local-tz constructor still present at lines 1383 and 1412. Sprint 24 may have migrated *some* call sites but not these two. The `passed` predicate is used for "now/past/upcoming" labelling of tithi/nakshatra transitions on the dashboard. A user in Tokyo viewing Delhi panchang sees transitions flipping at the wrong wall-clock moment.
- **Proposed fix:** Verify which `passed` helpers were migrated; either delete these two duplicates and call the migrated helper, or apply the same `hasMomentPassed(panchangTimezone)` fix here.

### R3-TZ-24 — `family-synthesis/narrative-gen.ts` builds window endpoints from `new Date(now.getFullYear(), now.getMonth() + N, 1)`

- **File:** `src/lib/kundali/family-synthesis/narrative-gen.ts:341-342, 380`
- **Severity:** P3
- **Evidence at HEAD:**
  ```ts
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const twoMonths = new Date(now.getFullYear(), now.getMonth() + 2, 1);
  …
  const endDate = new Date(now.getFullYear(), now.getMonth() + 3, 1);
  ```
- **Why a bug:** Server-local Y/M, then constructor builds server-local midnight, which `.toISOString().split('T')[0]` (used downstream) converts to UTC. For users east of UTC near midnight, the "next month" boundary is off by one day. For Vercel UTC this is fine; for non-UTC hosts (and any future migration), it skews.
- **Proposed fix:** `Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)`.

### R3-TZ-25 — `Asia/Kolkata` hardcoded as fallback in cron `generate-notifications` + `weekly-digest` + `embed/panchang` + `medical-astrology` — global users get IST-festival dates

- **File:** `src/app/api/cron/generate-notifications/route.ts:191`, `src/app/api/cron/weekly-digest/route.ts:124`, `src/app/embed/panchang/page.tsx:55`, `src/app/[locale]/medical-astrology/page.tsx:504`
- **Severity:** P3
- **Evidence at HEAD:**
  ```ts
  // generate-notifications:
  const entries = generateFestivalCalendarV2(year, 28.6, 77.2, 'Asia/Kolkata');
  // weekly-digest:
  const festTz = profile?.panchang_timezone ?? 'Asia/Kolkata';
  // embed/panchang:
  timezone = 'Asia/Kolkata'; // Default; users should prefer city slugs
  // medical-astrology:
  timezone: c.birth_data.timezone || 'Asia/Kolkata',
  ```
- **Why a bug:** Project CLAUDE.md is explicit: "Do not default to Delhi/IST/India for any default — the user is in Corseaux/Vevey, Switzerland, and the app serves a global audience." Each of these fallbacks silently routes festival dates / panchang / medical inputs through Asia/Kolkata when the user's tz isn't set — giving wrong festival dates for diaspora and global users. The weekly-digest fall-back is especially user-visible: a global user with no `panchang_timezone` profile field gets festivals computed for Delhi.
- **Proposed fix:** Resolve from `user_profiles.panchang_lat/lng` via `resolveBirthTimezone(lat, lng)` server-side. If lat/lng also missing, *don't* default — set `festTz = null` and skip the festival block (better than wrong content). For `embed/panchang`, infer from query params; reject if unavailable.

### R3-TZ-26 — `getCurrentTransits()` cache key not present — possible duplicate JD computation per request via `new Date()`

- **File:** `src/lib/tippanni/year-predictions.ts:508` (`getCurrentTransits()` call) and any other call site
- **Severity:** P3
- **Evidence at HEAD:** Not a tz bug per se, but `getCurrentTransits` reads `new Date()` (implementation detail), and is called from a context whose `year` was already resolved via `new Date().getFullYear()` on local-tz. The two `new Date()` calls happen in different microtasks. On year-boundary, year=2026 (browser local) but transits=2027 (server UTC). Cosmetic now; potential drift.
- **Proposed fix:** Thread an explicit `currentInstant: Date` param through `generateYearPredictions` so the two anchors share the same instant.

### R3-TZ-27 — `Intl.DateTimeFormat().resolvedOptions().timeZone` as fallback in ~25 files — browser tz used as panchang tz when location-store missing

- **File:** 25+ files, including `panchak/page.tsx:123`, `rahu-kaal/Client.tsx:119`, `dinacharya/page.tsx:147`, `panchang/activity-guide/page.tsx:27,46`, `learn/labs/moon/page.tsx:243`, `learn/labs/panchang/page.tsx:417`, etc.
- **Severity:** P2
- **Evidence at HEAD:**
  ```ts
  const timezone = locationStore.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  ```
- **Why a bug:** When `locationStore.timezone` is null (first visit before geolocation completes, geolocation denied, SSR), the browser's tz is used as the *panchang location's* tz. This is the exact pattern Round 1 spent significant effort fixing across kundali (Lesson L: "timezone from coordinates ONLY"). The pattern survives in ~25 client pages — every one of them silently corrupts the panchang/muhurta/upagraha output for any user whose browser tz ≠ panchang location tz when the store is empty.
- **Proposed fix:** Either (a) gate all rendering on `locationStore.confirmed && locationStore.timezone` (skeleton until set), or (b) treat a missing timezone as an error state with a "Set your location" prompt — never silently use browser tz as panchang tz.

---

## Cross-cutting themes

1. **The Round 2 deferred items (R3-TZ-1..10) are not cosmetic — they are P1/P2 user-visible drift bugs that survived three sprints.** Vercel UTC hides them in production today, but: (a) any non-UTC dev/test host surfaces them immediately, and (b) a region change or a maintenance run on a non-UTC machine will produce wrong output. The deferral was scheduled in Sprint 24 plan but only the client-page subset (R2-TZ-7..9, 14) actually landed.

2. **The `toLocaleString` round-trip tzOffset pattern is the single largest Lesson Q (duplicate logic) hazard in the time domain.** Two client pages reinvent it; both should call `getUTCOffsetForDate` from `lib/utils/timezone.ts`. Add a Vitest invariant: `expect(brittleRoundTrip).toBe(canonical)` so any future reinvention fails CI.

3. **Browser-tz Intl fallback is the new server-local "today".** Round 1 and Round 2 eliminated server-local "today" from computation files and from the high-traffic client pages. Round 3 finds 25+ pages where `Intl.DateTimeFormat().resolvedOptions().timeZone` is the *first* fallback — meaning any user whose location-store is empty gets their browser tz silently used as the panchang location's tz. Pattern is identical in shape; fix is identical (require store-confirmed location or render a placeholder).

4. **`setDate/setMonth/setFullYear` over multi-month windows is still the dominant DST-fragility class.** Findings R3-TZ-2, R3-TZ-10, R3-TZ-11, R3-TZ-12, R3-TZ-19 are all the same shape (operate on UTC-midnight Date, then mutate with local accessor). Each crossing of a DST transition shifts by ±1h; for 30-50 day windows this rarely visibly shifts a calendar day, but for 10-year / 144-year horizons it crosses days. Lesson P fix (ms-arithmetic) is universally applicable.

5. **Default fallbacks to `Asia/Kolkata` are project-policy violations.** Memory and CLAUDE.md are explicit: this is a global app, the user is in Switzerland, never default to India. Four files (R3-TZ-25) still do. The correct fallback for unknown user tz is "render a setup prompt, refuse to silently guess."

6. **Streak / quota day-keys are STILL inconsistent.** R3-TZ-7 (`learning-progress`) uses browser-local; R3-TZ-9 (`subscription`) uses UTC slice; R3-TZ-18 (`gamification`) hardcodes IST. Three subsystems, three different "today" conventions, all writing to or reading from the same supabase rows for the same user. Across regions and across time of day, the user sees streaks resetting at three different moments.

7. **`varshaphal/solar-return.ts` `jdToDateObj` is undocumented as a sentinel-Date.** R3-TZ-1 is structurally identical to the Round 1 "get rid of the deprecated SunTimes Dates" lesson — the contract leak invites future consumers to misuse the value. The fix shape is the same: return an explicit struct, not a Date with weird semantics.

8. **Client pages that compute "today" should use one helper.** `nowMinutesInTimezone` and `todayInTimezone` exist. ~25 client surfaces don't use them and instead reimplement the pattern. A Vitest rule `no-naked-new-date-getfullyear-in-client-components` would prevent future drift.

---

## Diminishing-returns note

Round 3 found **27 surviving items** vs Round 2's 25. Severity distribution is gentler (no P0s remaining in this domain — Round 2's P0s were closed by Sprint 20), but the median item is still P2 and the long tail is real.

The marginal next round of audit would surface another 5-10 items in the same shape (mostly DST-on-`setFullYear` and browser-tz-fallback patterns), with severity P3 or below. **The compile-time gate is the only fix that scales:** delete the deprecated `Date` fields from `SunTimes` (Sprint 20 deferred this — see Round 2 cross-cutting #1), and add a lint rule banning `new Date(year, month-1, day, h, m)` outside `lib/utils/parse-local-date.ts`.

Severity breakdown:
- **P0 ×0**
- **P1 ×5** (R3-TZ-1, R3-TZ-2, R3-TZ-3, R3-TZ-4, R3-TZ-7)
- **P2 ×13** (R3-TZ-5, 6, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 27)
- **P3 ×9** (R3-TZ-15, 19, 20, 21, 22, 23, 24, 25, 26)

Total: **27 findings** (R3-TZ-1 .. R3-TZ-27).
