# Dekho Panchang — Project Learnings

Compiled from 63+ bugs found across 6 audit rounds, 21 feedback memories, and 2 months of production development (Apr-May 2026). These are battle-tested lessons — every one came from a real incident that shipped to production.

---

## Part 1: Universal Engineering Lessons (Apply to ANY Project)

### 1. Never silently swallow errors
**Incident:** 6 API routes had `catch {}` blocks that returned error JSON but never logged with `console.error`. Production debugging was impossible.
**Rule:** Every `catch` block must log AND surface to the user. `catch {}` and `catch { /* silently fail */ }` are banned patterns. No empty catches, no ignored `error` fields from destructured responses.

### 2. Same data must come from the same source — or it will drift
**Incident:** The daily panchang page showed masa from a solar approximation while the festival engine used lunar month boundaries. Users saw different months on different pages for the same date.
**Incident 2:** Pushkar Bhaga degree tables existed in two files with completely different values.
**Incident 3:** Moon-Jupiter friendship was "friend" in 1 file but "neutral" in 11 others.
**Rule:** When two features display "the same thing," they MUST call the same function. Constants that appear in multiple files must live in one shared file. Before creating any constant, grep for it first. If it exists, import it.

### 3. Trace the FULL data flow before fixing a bug
**Incident:** BirthForm "Edit" bug took 2 attempts. First fix addressed a missing field (surface guess). Second fix discovered a `useEffect` that unconditionally overwrote form data.
**Rule:** Before editing any file to fix a bug, trace the complete path: trigger → state change → effects → re-renders. Check for useEffects that stomp on the state you're looking at. Never guess at surface causes.

### 4. Loading state must ALWAYS terminate
**Incident:** Multiple pages showed infinite loading spinners when a data fetch failed silently or when auth state was partially initialised.
**Rule:** Every branch of a data fetch — success, error, null-user early return, timeout — must flip `loading` to `false`. If a fetch depends on async-initialised state (auth), wait for `initialized === true` before deciding.

### 5. Never bulk find/replace with regex or sed
**Incident:** A `tl(` → `t(` regex broke 3,343 non-translation call sites. A bracket double-escape broke 128 files with Tailwind arbitrary value classes like `bg-[#0a0e27]`.
**Rule:** Use AST tools (ts-morph, jscodeshift) or have Claude do a dry run on 2-3 files and gate on `npx next build` before going wide. Print match count + 5 samples and get confirmation first.

### 6. Test at the real boundary
**Incident:** Print styling assumptions failed on actual paper output. Non-Latin rendering bugs only appeared with actual target scripts.
**Rule:** Print → test on actual paper. Non-English → test with actual scripts. Mobile → throttled device, not DevTools. One E2E smoke test per feature beats ten unit tests in isolated pieces. The bugs live in the seams.

### 7. Features must be wired end-to-end
**Incident:** Library page and saved kundalis page were built but not linked from the main nav. Users couldn't find them.
**Rule:** An unlinked page is a dead page. Every new feature must be reachable from its natural entry points the moment it ships. Checklist: navbar, dashboard, sitemap, cross-links.

### 8. User-initiated writes must be idempotent
**Incident:** Double-clicks and locale switches triggered duplicate saves.
**Rule:** Dedupe by natural key before insert, OR enforce uniqueness at DB level, OR both. Normalise keys before comparing (trim + lowercase). Treat every incoming write as potentially retried.

### 9. Don't batch-apply a mechanical fix without checking each call site's context
**Incident:** Replaced stale `24.18` ayanamsha fallback with `24.21` across 4 files. But one file was a test fixture using JD for year 2000 — where the correct Lahiri value is `23.85`, not `24.21`. Another agent had to clean up.
**Rule:** Same pattern across files does NOT mean same fix. Check each site's epoch, type optionality, and actual semantics. A test fixture for J2000 needs a different value than production code for 2026.

---

## Part 2: Domain-Specific Lessons (Astronomical / Jyotish)

### 10. Every astronomical value must be verified against a reference source
**Incident:** Purnimant months were computed by subtracting a fixed 15 days from New Moon dates. Months started on Ashtami instead of Purnima. Would have been caught instantly by comparing one date with Prokerala.
**Rule:** Before shipping ANY astronomical computation (moon phases, tithis, nakshatras, planetary positions, month boundaries, dasha dates), spot-check at least 3 dates against Prokerala or Drik Panchang. "It type-checks" is not verification.

### 11. Never use `new Date()` without explicit UTC
**Incident:** `new Date(year, month-1, day, hour, minute)` interprets arguments in the server's local timezone (UTC on Vercel, variable in dev). Birth time 10:30 IST became 10:30 UTC.
**Rule:** Always use `new Date(Date.UTC(y, m-1, d, h, m))` or millisecond arithmetic. Never the local-time constructor in computation code. Grep for `new Date(` before shipping.

### 12. Never use fixed-interval approximations for lunar phenomena
**Incident:** Purnimant months used a fixed 15-day offset from New Moon. The Moon's orbit is elliptical — Full Moon to New Moon varies 13.9-15.6 days.
**Rule:** All lunar intervals must be computed from actual positions, not assumed constant.

### 13. Weekday conventions: `Math.floor(jd + 1.5) % 7` gives 0=Sunday
**Incident:** KP ruling planets had weekday lord shifted by one day because code assumed 0=Monday.
**Rule:** Add a comment at every weekday computation: `// 0=Sun, 1=Mon, ..., 6=Sat`.

### 14. Fractional years must use millisecond arithmetic
**Incident:** `addYears()` used `Math.floor((years % 1) * 12)` months — truncating sub-month fractions. Over 12+ dasha periods, dates drifted by months.
**Rule:** `new Date(date.getTime() + years * 365.25 * 24 * 60 * 60 * 1000)` — this is the ONLY correct pattern.

### 15. Festival definitions use Amant month names
**Incident:** Festival generator matched against `.purnimanta` but definitions used Amant convention. Diwali was 30 days early.
**Rule:** All festival/vrat definitions use Amant month names. Always compare against `e.masa.amanta`, never `.purnimanta`.

### 16. Midnight-crossing time ranges need wrap-aware comparison
**Incident:** "NOW" badges never appeared for choghadiya/hora/muhurta slots crossing midnight (23:30→01:15). Three separate instances of the same bug.
**Rule:** `if (end < start) return now >= start || now < end;`. When fixing a pattern bug, grep the entire codebase for the same pattern — fix ALL in one commit.

### 17. Yoga detection conditions are the #1 source of false positives
**Incident:** Vasumati yoga used `.some()` instead of `.every()` — triggered in ~79% of charts. Gauri yoga had aspect direction reversed.
**Rule:** After writing any yoga detection, compute the expected frequency mentally. If a "rare" yoga triggers in >20% of random charts, the condition is too loose.

### 18. Muhurta scoring must use Lahiri regardless of user ayanamsha
**Incident (avoided):** Gemini suggested plumbing user ayanamsha through the muhurta scorer. This would have been WRONG — classical muhurta rules (MC, Dharma Sindhu, Prashna Marga) were all composed under Lahiri boundaries.
**Rule:** Observational tools (panchang display, kundali) → user's chosen ayanamsha. Prescriptive tools (muhurta rules, festival dates) → always Lahiri. The rule tables are Lahiri-native.

### 19. Cross-validate against the right source
**Incident:** Prokerala defaulted to Africa/Accra (GMT+0) when we passed `loc=delhi`, making ALL yoga comparisons invalid. We thought we had a 57% yoga mismatch — it was 0% when compared against Drik Panchang with confirmed New Delhi location.
**Rule:** Always verify the reference source's location resolution. Check for timezone, city name, and coordinates in the response. Use Drik Panchang with explicit `geoname-id` for reliable Indian city data.

### 20. "Sunrise yoga" vs "dominant yoga" is a convention difference, not a bug
**Finding:** 29% of days show a different yoga than Prokerala because the yoga transitions within a few hours of sunrise. We show the sunrise yoga (Dharma Sindhu convention), they show the dominant yoga.
**Rule:** Document the convention. Show both yogas with transition times on the panchang page. The muhurta engine correctly evaluates at window midpoint, catching the transition.

---

## Part 3: Architecture Lessons

### 21. Don't let the same computation exist in 3 places
**Incident:** Three muhurta scanners (V1, V2, SmartSearch) with complementary but incomplete feature sets. V2 had inauspicious period checks but no hora scoring. SmartSearch had hora but no vetoes. V1 was a strict subset of V2.
**Resolution:** Built a unified engine with a rule registry. Each classical check is a self-contained rule object. Adding a new rule = adding one object. All 3 scanners now delegate to the same engine via adapters.

### 22. Classical knowledge systems have LAYERS OF AUTHORITY, not additive arithmetic
**Incident:** The muhurta scorer treated everything as additive: score += bonus, score -= penalty. But MC Ch.7 explicitly says "a properly chosen lagna removes all defects" — that's categorical cancellation, not "+8 offset -5".
**Resolution:** 5-tier authority system where higher-tier factors can cancel lower-tier defects entirely. Godhuli Lagna (Tier 1) overrides everything except hard vetoes (Tier 0). Strong lagna (Tier 2) cancels weak karana (Tier 4).

### 23. Separate the engine from the scanner from the adapter
**Architecture:** Layer 1 (Rules) → Layer 2 (Evaluator with cancellation) → Layer 3 (Reasoning with citations) → Scanner (window iteration) → Adapters (legacy format conversion). Each layer is independently testable.

### 24. Cache the expensive part, compute the cheap part on demand
**Incident:** Sade Sati cache stored final sidereal signs. When we added ayanamsha support, the cache was useless for non-Lahiri users.
**Resolution:** Cache stores tropical longitudes (the expensive ephemeris computation). Ayanamsha conversion (a subtraction) happens at lookup time. One cache serves all 11 ayanamsha systems.

### 25. Files that change together should live together
**Incident:** Dur Muhurtam lookup tables were defined inline inside `computePanchang()`. The muhurta scorer needed the same tables. We had to extract them to a shared constant file.
**Rule:** Constants, computation functions, and their consumers should be organised by domain (muhurta, kundali, calendar), not by technical layer (constants, utils, helpers).

---

## Part 4: Process Lessons

### 26. Subagents can miss staging files
**Incident:** `engine/index.ts` and `engine/scanner.ts` were created by subagents but never committed to git. The Vercel build failed with "Cannot find module." 
**Rule:** After every subagent task, verify files are tracked: `git status`. The subagent's local filesystem is shared, but it may not stage everything.

### 27. Always verify the complete build before pushing
**Incident:** Local tests passed but the Vercel build failed because committed code referenced files that existed locally but weren't in the git tree.
**Rule:** The pre-push hook runs `tsc` on a clean checkout — trust it. If it blocks, don't `--no-verify`. Fix the issue.

### 28. Cross-check AI reviewer claims independently
**Incident:** Gemini flagged "location-store.ts hydration race condition" — fabricated. The store defaults to `null`, not Delhi. There's no flash.
**Incident 2:** Gemini said muhurta Phase 2 was "NOT STARTED" — stale snapshot, it was fully complete.
**Rule:** AI reviewers (including Gemini, ChatGPT, other Claudes) can be wrong. Check the actual code before acting on their findings. The majority reading of the code is almost always correct.

### 29. The competitor's approach is not always right
**Incident:** Drik Panchang uses binary pass/fail for muhurta. We initially designed toward matching them. But the classical texts explicitly describe cancellation and compensation — MC Ch.7 says strong lagna removes defects. Binary pass/fail is the modern simplification.
**Rule:** When the classical text and the competitor disagree, follow the text. Cite the specific chapter and verse. This becomes a differentiator.

### 30. "Expensive" is often a wrong assumption
**Incident:** "Planets-in-ascendant cancellation" and "8th house vacancy" were deferred as "expensive — needs per-window house computation." In reality, we already had `ctx.lagnaSign` and `ctx.planets` on every window context. The check was a simple array filter — 10 lines of code.
**Rule:** Before deferring a feature as "expensive," check what data is already available in the context. Often the "expensive" part was already computed for another feature.

---

## Part 5: SEO & Growth Lessons

### 31. Update SEO every time you ship a feature
**Incident:** Multiple features were built but not reflected in metadata, FAQ, sitemap, or llms.txt. The features existed but were invisible to search engines and AI crawlers.
**Rule:** Feature shipping checklist: sitemap, metadata.ts, faq-data.ts, llms.txt, vs page, learn pages, cross-links.

### 32. llms.txt is the new robots.txt for AI
**Finding:** ChatGPT, Perplexity, Claude, and Gemini all read `llms.txt` when available. It's the primary document for AI discoverability.
**Rule:** Keep `llms.txt` updated with every major feature. Be specific — mention rule counts, text citations, differentiators. AI systems summarise at a high level, so lead with the sharpest differentiator.

### 33. Don't praise the competitor on your own comparison page
**Incident:** The vs/drik-panchang page's bottom line started with "Drik Panchang is a trusted reference library with 15 years of history" before talking about us.
**Rule:** Lead with YOUR strengths. Acknowledge the competitor exists, but don't give them free credibility on your own page.

### 34. Prokerala's location resolution is unreliable for automation
**Finding:** `loc=delhi` parameter defaults to Africa/Accra. All our automated cross-validations were against the wrong timezone.
**Rule:** Use Drik Panchang with explicit `geoname-id` for reliable validation. For Prokerala, only trust results where the timezone is explicitly confirmed in the response.

---

## Part 6: What Went Right

### 35. Swiss Ephemeris as the computation backbone
Using NASA JPL DE441 via Swiss Ephemeris gave us sub-arcsecond accuracy from day one. We never had to explain away computation errors — only convention differences (sunrise yoga vs dominant yoga).

### 36. Classical text citations on every rule
Every muhurta rule, every scoring factor, every hard veto traces to a specific text, chapter, and verse. This is the single biggest differentiator — no other platform does this. When users question a recommendation, we can show them the exact shloka.

### 37. Building the engine before the UI
The muhurta engine (rules, evaluator, reasoning, scanner) was built and tested before being wired to any API route or page. This meant the engine was correct by construction — the wiring was a mechanical adapter layer.

### 38. 3,000+ tests as a safety net
With 3,048 tests, we could refactor freely — rename modules, consolidate ayanamsha, extract constants, wire adapters — without fear of breaking existing features. Every major change was verified against the full suite before push.

### 39. The "Digital Pandit" positioning
Not "a better calculator" — a system that reasons like a classically trained Jyotishi. The reasoning engine (strengths, concerns, mitigations with citations) transforms raw scores into actionable advice. This is what users actually want — not numbers, but answers.

---

## Quick Reference: The Rules

1. Never silently swallow errors
2. Same data, same source
3. Trace before fix
4. Loading state always terminates
5. No bulk regex/sed
6. Test at the real boundary
7. Wire features end-to-end
8. Writes must be idempotent
9. Check each call site's context
10. Verify astronomical values against references
11. Always use UTC for dates
12. No fixed-interval lunar approximations
13. Document weekday conventions
14. Millisecond arithmetic for fractional years
15. Amant month names for festivals
16. Midnight-crossing time ranges
17. Yoga detection frequency validation
18. Muhurta uses Lahiri always
19. Verify reference source's location
20. Convention difference ≠ bug
21. Don't duplicate computation
22. Classical systems have authority layers
23. Separate engine/scanner/adapter
24. Cache expensive, compute cheap on demand
25. Files that change together live together
26. Verify subagent file staging
27. Complete build before push
28. Cross-check AI reviewer claims
29. Follow the text, not the competitor
30. "Expensive" is often wrong
31. Update SEO with every feature
32. llms.txt is the new robots.txt
33. Don't praise competitors on your page
34. Verify reference source location resolution
