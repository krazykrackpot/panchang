# Audit Round 4 — 2026-05-11 (Deep Exhaustive Scan)

**Context:** Rounds 1-3 found 53 issues total, 42 fixed. This round goes deeper — systematic scan of every `as any`, every catch block, every `setLoading`, every `process.env`, every `new Date(`, every API route, every link, every module href.

**Result: 29 distinct issues found**

---

## CRITICAL (3)

### C1: PersonalEclipseInsight — loading stuck on error
- **File:** `src/components/eclipses/PersonalEclipseInsight.tsx:284,303`
- **Issue:** `setLoading(true)` then `.catch()` that only logs — never calls `setLoading(false)`. Infinite spinner on fetch error.

### C2: TransitForecastWidget — loading stuck on error
- **File:** `src/components/panchang/TransitForecastWidget.tsx:25,41`
- **Issue:** Same pattern. `setLoading(true)` then `.catch(console.error)` with no `setLoading(false)`.

### C3: TodayPanchangWidget — loading stuck on error
- **File:** `src/components/panchang/TodayPanchangWidget.tsx:65,72`
- **Issue:** Same pattern.

---

## HIGH (8)

### H1: 12 CPU-heavy public APIs with no rate limiting
- **Routes:** `/api/combustion`, `/api/retrograde`, `/api/eclipses`, `/api/transits`, `/api/sky/positions`, `/api/financial`, `/api/nadi`, `/api/medical`, `/api/varshaphal`, `/api/muhurta-scan`, `/api/calendar/export`, `/api/checkout`
- **Impact:** DoS vector — an attacker can exhaust CPU with rapid requests.

### H2: In-memory rate limit maps grow unbounded (4 routes)
- **Files:** `api/ai-reading/route.ts:35`, `api/domain-pandit/route.ts:13`, `api/horoscope/personalized/route.ts:11`, `api/tippanni-llm/route.ts:20`
- **Issue:** `new Map()` with no eviction. On Vercel, cold starts reset them (making limits useless), while long-lived instances accumulate entries without bound.

### H3: `readingCache` in tippanni-llm never evicts
- **File:** `api/tippanni-llm/route.ts:20`
- **Issue:** Unbounded Map of cached Claude responses.

### H4: Horoscope cache in `/api/horoscope/route.ts:10` never evicts
- **Issue:** Same unbounded Map pattern. Has `createdAt` but no eviction loop.

### H5-H10: `as any` hiding real type mismatches in API routes
- `api/predictions/route.ts:111,113,143` — Supabase JSON columns cast to any
- `api/journal/route.ts:84,86,118` — Same pattern
- `api/life-events/route.ts:114,116,146` — Same pattern
- `api/chart-chat/route.ts:205,250,257` — KundaliData cast to any
- `api/family-synthesis/route.ts:91` — full_kundali cast to any
- `components/kundali/TippanniTab.tsx:345,349` — `.ratio` property doesn't exist, always undefined

---

## MEDIUM (10)

### M1: 60+ hardcoded "2026" in SEO metadata
- **File:** `src/lib/seo/metadata.ts`
- **Issue:** Festival calendars, eclipse pages, muhurat pages all hardcode "2026". Will all go stale in 2027. No dynamic year generation for most entries (only horoscope uses `new Date().getFullYear()`).

### M2-M3: Silent catches in cron job per-user loops
- `api/cron/transit-alerts/route.ts:108` — empty catch, no logging
- `api/cron/domain-activations/route.ts:128` — same

### M4-M6: Silent catches in computation engines
- `lib/calendar/eclipse-compute.ts:116,129` — eclipse computation fails silently
- `lib/kundali/tippanni-engine.ts:1409` — core computation failure swallowed
- `lib/tippanni/dasha-synthesis.ts:363` — partial/wrong results returned

### M7: Dual URLs for contributions content
- `/learn/contributions/zero` and `/learn/modules/25-1` serve same topic
- 14 contribution pages duplicate 13 module pages
- Neither redirects to the other — SEO dilution

### M8: Ashtamangala uses numeric timezone, ignores DST
- **File:** `src/lib/prashna/ashtamangala.ts:120-123`
- **Issue:** `now.getTimezoneOffset()` arithmetic ignores DST transitions when string timezone is passed.

### M9: UTC-based daily quota reset (4 API routes)
- **Files:** `api/ai-reading`, `api/domain-pandit`, `api/horoscope/personalized`, `api/tippanni-llm`
- **Issue:** `getToday()` uses `new Date().toISOString().slice(0, 10)` which is UTC date. User in IST at 11:30 PM has their quota reset at 5:30 AM IST instead of midnight.

### M10: OnboardingModal — 4 silent catches
- **File:** `src/components/auth/OnboardingModal.tsx:190,201,204,321`
- **Issue:** If kundali snapshot save (line 190) fails silently, user thinks onboarding completed but has no saved chart.

---

## LOW (8)

### L1: `as any` in display components
- `KeyDatesTimeline.tsx:102,108` — event.title/description cast to any
- `mundane/page.tsx:178` — untyped label access
- `dashboard/page.tsx:983` — synthetic kundali object cast to any
- `InstallPrompt.tsx:48,50` — BeforeInstallPromptEvent (acceptable, type not in lib.dom)

### L2: InstallPrompt localStorage without try/catch
- **File:** `src/components/layout/InstallPrompt.tsx:26-27`
- **Issue:** Private browsing throws on localStorage access, preventing beforeinstallprompt registration.

### L3: RSS feed English-only, no rate limiting
- **File:** `src/app/api/feed/route.ts`
- **Issue:** Hardcodes `/en/` locale. No rate limiting (static content, low risk).

### L4: LiveSkyMap event listener churn on pan
- **File:** `src/components/sky/LiveSkyMap.tsx:822`
- **Issue:** useEffect depends on `[zoomLevel, panOffset]` — every drag re-registers 4 event listeners.

### L5: TippanniTab `.ratio` property always undefined
- **File:** `src/components/kundali/TippanniTab.tsx:345`
- **Issue:** `(s as any).ratio` never exists. Fallback logic always used. Dead code path.

### L6: subscription-store silent catches
- **File:** `src/stores/subscription-store.ts:79,110`
- **Issue:** Empty `catch {}` — user silently stays on wrong subscription tier.

### L7: location-store silent catches
- **File:** `src/stores/location-store.ts:88,107`
- **Issue:** Geolocation failure leaves coordinates at 0,0.

### L8: Checkout route no rate limiting
- **File:** `src/app/api/checkout/route.ts`
- **Issue:** Unlimited Stripe/Razorpay session creation.

---

## Previously Fixed (verified clean)

| Issue | Status |
|---|---|
| H1 (round 3): sign-shift wrong TZ | FIXED — uses `resolveBirthTimezone` |
| H2 (round 3): timezone fallback tests | FIXED — 27/27 pass |
| M1 (round 3): caesarean browser TZ | FIXED — uses `resolveCurrentLocationTimezone` |
| M4 (round 3): kundali `require()` | FIXED — top-level imports |
| M7 (round 3): legacy horoscope auth | FIXED — rate limited |
| M9 (round 3): LocationSearch loading | FIXED — `finally` block |
| M10 (round 3): EMBEDDING_PROVIDER trim | FIXED — `.trim()` |
| M13 (round 3): ServiceWorker cleanup | FIXED — clearInterval + removeEventListener |

---

## Verified Clean Areas

- `resolveTimezoneFromCoords` — ZERO production callers (fully deprecated)
- `dangerouslySetInnerHTML` — all use `safeJsonLd()` or static constants, no XSS
- Supabase service_role key — server-side only, no client exposure
- Module sequence hrefs — all point to existing pages
- Navbar/footer links — all resolve to real routes
- `Intl.DateTimeFormat` — all usage is display/resolution, not computation
- Memory leaks (setInterval/addEventListener) — all checked components have cleanup
