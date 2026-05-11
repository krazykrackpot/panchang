# Audit Round 3 — 2026-05-11

**Context:** Post-critical-timezone-fix audit. The browser timezone bug (`resolveTimezoneFromCoords` returning `Intl.DateTimeFormat().resolvedOptions().timeZone` for birth charts) shipped to production and gave users wrong nakshatras, tithis, and rashis. Three audit tracks ran in parallel to find any remaining issues.

**Result: 30 issues found (2 High, 13 Medium, 12 Low, 3 Info)**

---

## HIGH SEVERITY (2)

### H1: `sign-shift/page.tsx:181` — Wrong timezone function for birth chart
- **File:** `src/app/[locale]/sign-shift/page.tsx`, line 181
- **Code:** `const tz = await resolveCurrentLocationTimezone(lat, lng);`
- **Issue:** The sign-shift page collects birth date, birth time, and birth location, then computes tropical vs sidereal positions. It uses `resolveCurrentLocationTimezone` which can return the browser timezone. A user in the US entering birth coordinates in India gets `America/New_York` instead of `Asia/Kolkata`.
- **Fix:** Replace with `resolveBirthTimezone(lat, lng)`.
- **Impact:** Wrong sign positions for anyone whose browser TZ differs from birth location.

### H2: `timezone-fallback.test.ts` — All 27 tests FAILING
- **File:** `src/lib/__tests__/timezone-fallback.test.ts`, line 125
- **Error:** `TypeError: resolve is not a function`
- **Issue:** The `getResolver()` helper does a dynamic import but the module API changed (function was renamed from `resolveTimezoneFromCoords` to `resolveBirthTimezone`). All 27 offline timezone fallback tests are broken — the offline resolver is completely untested.
- **Fix:** Update the test to import `resolveBirthTimezone` instead of `resolveTimezoneFromCoords`.
- **Impact:** If `timeapi.io` goes down, the `tz-lookup` fallback is unverified.

---

## MEDIUM SEVERITY (13)

### M1: `caesarean-muhurta/ScanForm.tsx:66` — Browser TZ fallback
- **Code:** `timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone`
- **Issue:** If location store has no timezone, falls back to browser TZ for caesarean muhurta scanning.
- **Fix:** Use `resolveCurrentLocationTimezone(lat, lng)` instead of raw `Intl.DateTimeFormat`.

### M2: `notifications/panchang-alerts.ts:91` — `new Date()` without timezone
- **Code:** `new Date(\`${dateStr}T${hh}:${mm}:00\`)`
- **Issue:** Parses time without timezone suffix — interpreted in browser-local time. If user is traveling, alerts fire at wrong time.

### M3: `notifications/vrat-alerts.ts:63,96` — Same issue
- **Code:** `new Date(entry.date + 'T05:00:00')`
- **Issue:** Same as M2.

### M4: `kundali/page.tsx:924-936` — `require()` inside render + re-computation
- **Issue:** Uses `require('@/lib/ephem/astronomical')` inside a render IIFE to re-compute tithi, yoga, and masa. The engine doesn't return these in KundaliData, so re-computation is necessary — but `require()` in render is an anti-pattern. Should be top-level imports.

### M5: 16 `learn/contributions/` pages — Duplicate content
- **Issue:** `/learn/contributions/zero` and `/learn/modules/25-1` cover the same topic ("Zero — The Most Dangerous Idea") with different formats. 16 contribution pages duplicate 13 curriculum modules. SEO duplicate content risk.

### M6: `learn/page.tsx:95` — Broken `/learn/contributions` link
- **Issue:** Learn index links to `/learn/contributions` but no `page.tsx` exists at that path. Returns 404.

### M7: `api/horoscope/route.ts` — Claude API with no auth
- **Issue:** Calls `getClaudeClient()` (paid Anthropic API) with zero authentication and zero rate limiting. Any anonymous user can run up the bill.
- **Note:** This is the OLD horoscope route (legacy). The new one at `/api/horoscope/daily` doesn't use Claude. But this route still exists and is callable.

### M8: `lib/subscription/api-gate.ts:36` — Silent catch
- **Code:** `} catch { /* invalid cookie */ }`
- **Issue:** Swallows cookie parse errors without logging. Per CLAUDE.md Lesson A.

### M9: `components/ui/LocationSearch.tsx:76` — Loading never terminates
- **Issue:** If `searchLocations(val)` throws inside a `setTimeout` callback, `setLoading(false)` is never reached. Loading spinner spins forever.

### M10: `api/tippanni/route.ts:116` — `.trim()` missing on env var comparison
- **Code:** `process.env.EMBEDDING_PROVIDER === 'local'`
- **Issue:** Without `.trim()`, trailing whitespace from Vercel env vars causes the comparison to fail silently.

### M11: `panchang/auspicious/page.tsx` — 8 `as any` casts
- **Issue:** Panchang type definition is missing `varjyamAll`, `amritKalamAll`, `bhadraAll`, `gandaMoola` fields. Code uses `as any` to access them instead of extending the type.

### M12: `panchang/inauspicious/page.tsx` — 4 `as any` casts
- **Issue:** Same pattern — `panchang.gandaMoola as any` to access `.nakshatra`, `.start`, `.end`.

### M13: `layout/ServiceWorkerRegistrar.tsx` — Memory leak
- **Issue:** `setInterval` and 3 `addEventListener` calls in useEffect are never cleaned up. If component remounts, intervals stack.

---

## LOW SEVERITY (12)

### L1: `panchang/calculator.ts:326` — `new Date()` for weekday
- Benign — same calendar date = same weekday regardless of timezone. Documented.

### L2: `tippanni-engine.ts:1367` — Local-time Date for age
- Benign — few hours of timezone ambiguity irrelevant for age calculation.

### L3: Database — Pre-fix charts have wrong stored timezone
- Charts saved before the timezone fix may have `Europe/Zurich` stored instead of `Asia/Kolkata`. Mitigated: loading code re-resolves timezone from coordinates, so charts compute correctly on reload. The wrong value just sits unused in the DB.

### L4: `learn-index.json:171-182` — Hardcoded "238" in JSON share text
- The learn page uses dynamic `TOTAL_MODULES` in the TSX, but the JSON file still says "238". This is a dead path (TSX overrides it) but fragile if anyone references the JSON directly.

### L5: `seo/metadata.ts:417` — "Daily Horoscope 2026"
- Will become stale in 2027. Needs annual update. Same for "Feature Comparison 2026" at line 781.

### L6: `api/kundali/route.ts` — No rate limiting
- Heavy computation endpoint, no external API, but no rate limiting either. CPU DoS vector.

### L7: `api/matching/route.ts` — No rate limiting
- Same pattern as L6.

### L8-L14: 7 files with silent catches
- `panchang-alerts.ts:48`, `kp-chart.ts:97`, `PersonalEclipseInsight.tsx:300`, `OnboardingModal.tsx:190,201`, `AuthModal.tsx:63`, `sign-shift.ts:269`, `dasha-synthesis.ts:363`
- All catch errors without logging. Most are best-effort operations where the fallback is acceptable, but per CLAUDE.md Lesson A, should at minimum `console.error`.

### L15: `api/kundali/route.ts`, `api/matching/route.ts` — No rate limiting
- Pure computation, no external API. Low priority.

### L16: 6 files with `setTimeout` in event handlers without cleanup
- `NakshatraShareButton.tsx:75`, `MantraCard.tsx:78`, `SamagriList.tsx:123`, `SankalpaDisplay.tsx:125`, `sign-shift/page.tsx:236,243`, `ShareCardButton.tsx:50,61,119`
- Short timeouts (1.8-3s). Harmless in React 18+ (suppresses unmounted state update warning).

---

## INFO (3)

### I1: `sign-shift/page.tsx:186`, `tropical-compare/page.tsx:162` — Fragile offset calculation
- `new Date("YYYY-MM-DDThh:mm:00")` parsed as local time, then compared via `toLocaleString({ timeZone })`. Browser TZ cancels out in the subtraction, so the result is correct — but only by accident. Confusing and fragile.

### I2: Pre-fix charts — wrong stored TZ (mitigated)
- Mitigated by re-resolution on load. No action needed unless a future code path reads `birth_data.timezone` from DB without re-resolving.

### I3: `references: 68, labs: 6` hardcoded in learn page STATS
- Rarely changes. Low risk. Would need manual update if reference pages or labs are added.

---

## Priority Fix Order

1. **H1** — `sign-shift/page.tsx` wrong timezone function (same class of bug that just shipped)
2. **H2** — Fix the broken timezone fallback tests (27 tests failing)
3. **M7** — Auth-gate the legacy `/api/horoscope` Claude route
4. **M6** — Fix the 404 `/learn/contributions` link
5. **M9** — LocationSearch loading stuck on exception
6. **M10** — `.trim()` on EMBEDDING_PROVIDER env var
7. Everything else in severity order
