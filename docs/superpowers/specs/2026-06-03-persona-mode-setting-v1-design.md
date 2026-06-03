# Persona Mode Setting — v1 Design

**Date**: 2026-06-03
**Owner**: product strategy
**Status**: design
**Companion doc**: `docs/PERSONAS_AND_JOURNEYS.md`
**Effort estimate**: ~1 week for v1 (5-6 PRs)

---

## Goal

Treat Dekho Panchang's three reader personas — Beginner, Enthusiast, and Acharya — as **first-class product modes** that persist across visits and tailor every surface where their needs diverge.

The two existing modes on `/kundali` (Simple / Expert) collapse three distinct users into two views. The middle persona (Enthusiast, ~25-30% of traffic) gets the Beginner-friendly Simple view and never discovers the depth they want, because the Expert toggle is small and easily missed.

**v1 ships a 3-mode sitewide preference**:
- **Beginner** → friendly tone, glossary-on-tap, verdicts above scores, Patrika-only `/kundali`
- **Enthusiast** → default — depth and narrative balanced, all `/kundali` tabs visible, transit emphasis
- **Acharya** → classical tone, Expert default on `/kundali`, beginner copy suppressed, citation mode on `/muhurta-ai`

Every other recommendation in the personas doc depends on or benefits from this setting existing.

---

## Current state

Far more infrastructure exists than the personas doc estimated. v1 is mostly wiring, not building.

### What already exists

1. **Database column**: `user_profiles.experience_level` (migration `021_experience_level.sql`)
   - Values: `beginner` | `intermediate` | `advanced`
   - Default: `beginner`
   - Check constraint enforces the 3 values
   - Comment: *"Controls which kundali view mode the user prefers"*

2. **Capture at onboarding**: `src/components/auth/OnboardingModal.tsx` writes `experience_level` to `user_profiles` (lines 182, 425).

3. **Read on `/kundali`**: `src/app/[locale]/kundali/Client.tsx:397-414`
   - Reads `kundali-view-mode` from `localStorage`
   - Falls back to fetching `user_profiles.experience_level`
   - Maps `advanced` → `expert`, **everything else** → `simple`
   - `sessionStorage.kundali-view-mode-manual` flag respects user override

4. **UI toggle**: `src/components/kundali/simple/ViewModeToggle.tsx` — 2-state toggle (`simple` | `expert`).

5. **Settings page**: `src/app/[locale]/settings/page.tsx` — exists but does not currently surface `experience_level`.

6. **Preference store**: `src/stores/preference-store.ts` — Zustand store available for client-side prefs.

### What is broken about the current state

- **The `intermediate` value is wasted**. Users who self-report `intermediate` (the Enthusiast persona) get mapped to `simple`, i.e., the Beginner view. They never see Expert tabs unless they manually toggle.
- **The setting is `/kundali`-only**. The same user gets identical panchang briefing tone, identical matching verdict, identical sade-sati framing whether they are an Acharya or a Beginner.
- **No surface to change it after onboarding**. The Settings page does not expose `experience_level`. A user who picks the wrong mode at signup has to live with it.
- **No anonymous persistence beyond `/kundali`**. Anonymous users who set `kundali-view-mode` in localStorage do not have that preference respected elsewhere.

---

## 3-mode definition (the truth table)

This is the contract for what each mode actually changes. v1 implements the **bold** rows; the others are deferred to v2.

### Backend names (DB) vs frontend names (persona-friendly)

| DB value (`user_profiles.experience_level`) | Frontend persona mode | UI label |
|---|---|---|
| `beginner` | `beginner` | "Beginner — friendly tone, simple views" |
| `intermediate` | `enthusiast` | "Enthusiast — depth and narrative" |
| `advanced` | `acharya` | "Acharya — classical mode, expert defaults" |

The DB column name stays `experience_level` for backward compatibility. The frontend type uses persona-friendly names that map to the DB values.

### What each mode controls in v1

| Surface | Beginner | Enthusiast | Acharya |
|---|---|---|---|
| `/kundali` default tab | **Patrika** (Expert tabs hidden) | **Patrika** (Expert tabs visible) | **Expert** (Shadbala / Vargas / Dashas open by default) |
| `/kundali` ViewModeToggle | **Hidden** (Patrika-only) | **3-state** (Patrika / Expert / Acharya) | **Hidden** (Expert-only, Acharya copy register) |
| `/panchang` Daily Cosmic Briefing tone | **Friendly** (current default) | **Friendly** (current default) | **Classical** (terse, no metaphors, classical vocab) |
| `/matching` score display | **Verdict word above score** (e.g., "Compatible 27/36") | Score with kuta breakdown | Score with classical citations per kuta |
| `/sade-sati` intro | **Reassuring** ("you are in second phase, 7.5-year transit, most people experience this twice") | Neutral/educational | Classical (Shani drishti, Phaladeepika citations) |

### What each mode controls in v2 (NOT v1)

| Surface | Beginner | Enthusiast | Acharya |
|---|---|---|---|
| `/muhurta-ai` results | Verdict + traffic light | Score + reason | Score + **rule citation badges** (Pushya nakshatra, no Vishti, etc.) |
| `/learn/[module]` examples | Generic examples | Use user's saved chart | Use user's saved chart + classical citations |
| Glossary-on-tap (panchang) | **Default on** | Default on | Default off (assumed knowledge) |
| Locale-register (Hindi `hi`) | Hinglish vocab | Standard Sanskritic vocab | Classical Sanskrit-loan vocab |
| Brihaspati AI response register | Friendly explanations | Standard | Classical citations preferred |

v1 ships 5 surfaces; v2 adds the remaining 5. Splitting this is deliberate — v1 unlocks the persona awareness in code; v2 grows the rendering coverage.

---

## UX flows

### Flow A — First-time anonymous visitor (no account yet)

```
Visitor lands on /panchang or /kundali → reads content as Enthusiast default
  ↓
At first attempt to save a chart / generate a kundali, AuthModal triggers
  ↓
User completes signup → OnboardingModal appears
  ↓
OnboardingModal v2 adds a step: "How would you describe your Jyotish knowledge?"
  - "I'm new to this" → beginner
  - "I've been reading for a while" → intermediate
  - "I practice or teach Jyotish" → advanced
  ↓
Saved to user_profiles.experience_level on completion
  ↓
PersonaModeContext re-hydrates with new mode
  ↓
All persona-aware surfaces re-render with the new tone/defaults
```

### Flow B — Returning logged-in user

```
User loads any page → SSR reads cookie `dp-persona-mode` if present
  ↓
Client hydrates → reads user_profiles.experience_level from auth store
  ↓
If mismatch (cookie says beginner, profile says advanced): profile wins,
  cookie updated
  ↓
PersonaModeContext provides mode to all subscribers
```

### Flow C — User changes mode in Settings

```
User → /settings → "Display mode" section
  ↓
Selects a different mode from 3-option group
  ↓
Save button → Supabase update + cookie update + context update
  ↓
Confirmation toast: "Display mode set to Enthusiast"
  ↓
Next page load reflects the change
```

### Flow D — In-context mode upgrade prompt

When a Beginner clicks an Expert-only feature (e.g., tries to open the Shadbala tab via a hover link in `/learn/shadbala`), instead of silently failing or showing the Expert tab, prompt them:

> *"Shadbala is a more technical view. Switch to Enthusiast mode to see it? You can change back anytime in Settings."*

This is a soft promotion that turns curious Beginners into Enthusiasts. Out of scope for v1; design here for v2.

### Flow E — Anonymous-to-logged-in migration

```
Anonymous user has dp-persona-mode=enthusiast in localStorage (set via the
  Beginner→Enthusiast soft promotion above, or a /settings page that works
  while anonymous)
  ↓
User signs up
  ↓
OnboardingModal pre-fills "How would you describe your knowledge" with the
  anonymous mode, but lets the user change it
  ↓
On completion, user_profiles.experience_level is written, localStorage cleared
```

---

## Storage & sync architecture

### Storage layers

1. **HTTP cookie** `dp-persona-mode` (1-year expiry, SameSite=Lax, HTTPS-only)
   - Set on every mode change (server-side via API route or client-side via `document.cookie`)
   - Read in `src/app/[locale]/layout.tsx` server component for SSR
   - Available before React hydrates → no flicker

2. **`localStorage.dp-persona-mode`** (anonymous + as offline backup)
   - Mirrors the cookie value
   - Read on first client mount as fallback

3. **`user_profiles.experience_level`** (logged-in, authoritative)
   - Source of truth for logged-in users
   - Synced to cookie + localStorage on every change

4. **Legacy keys** (one-cycle migration)
   - `kundali-view-mode` (existing) → maps to `dp-persona-mode` on first read; old key cleared after v1 ships
   - `kundali-view-mode-manual` (existing sessionStorage flag) → renamed to `dp-persona-mode-manual` to indicate user-set vs auto-detected

### Sync rules

| Event | Cookie | localStorage | user_profiles |
|---|---|---|---|
| Anonymous user sets mode in Settings | ✏️ write | ✏️ write | n/a |
| User logs in (cookie present, profile empty) | unchanged | unchanged | ✏️ write from cookie |
| User logs in (cookie absent, profile populated) | ✏️ write from profile | ✏️ write from profile | unchanged |
| Logged-in user changes mode in Settings | ✏️ write | ✏️ write | ✏️ write |
| User logs out | unchanged (preserves preference) | unchanged | n/a |
| Profile updated externally (e.g., admin) | re-read on next page load | re-read on next page load | source of truth |

### SSR safety

The cookie is the **only** value read server-side. The pattern is:

```ts
// src/app/[locale]/layout.tsx
import { cookies } from 'next/headers';

export default async function LocaleLayout({ children, params }) {
  const cookieStore = await cookies();
  const personaMode = parsePersonaMode(cookieStore.get('dp-persona-mode')?.value);

  return (
    <PersonaModeProvider initialMode={personaMode}>
      {children}
    </PersonaModeProvider>
  );
}
```

This eliminates the SSR-vs-client mismatch that today causes a brief Simple-view flash before Expert mode hydrates on `/kundali`.

---

## Migration plan

### Migrating existing data

1. **For logged-in users with `experience_level` set**: no migration needed. The value is already authoritative.
   - `beginner` → frontend mode `beginner`
   - `intermediate` → frontend mode `enthusiast` (currently wasted; now activated)
   - `advanced` → frontend mode `acharya`

2. **For anonymous users with `kundali-view-mode` localStorage**: one-time migration on first page load after v1 deploys.
   - `kundali-view-mode=simple` → `dp-persona-mode=beginner`
   - `kundali-view-mode=expert` → `dp-persona-mode=acharya` (because users who manually picked Expert are likely Acharya; if they are actually Enthusiast, they can switch in Settings)
   - Old key deleted after migration

3. **For users with neither set**: default to `enthusiast` (per "middle persona, least surprising default" principle).

### Backward compatibility window

- **PR-3 ships** the new `dp-persona-mode` cookie + context, but the legacy `kundali-view-mode` localStorage key is **read-only-fallback** in `/kundali` for one release cycle (~2 weeks).
- **PR-7 (after release cycle)** removes the legacy fallback and the migration code. Final cleanup.

---

## Implementation tasks (PR-sized)

v1 ships in **6 PRs over ~1 week**, broken so each can ship and merge independently.

### PR-1 — Persona mode types + context provider (1 day)

**Files**:
- new: `src/lib/persona/types.ts` — `PersonaMode = 'beginner' | 'enthusiast' | 'acharya'`, DB-to-frontend mapping helpers
- new: `src/lib/persona/cookie.ts` — `parsePersonaMode`, `setPersonaModeCookie`
- new: `src/lib/persona/context.tsx` — `PersonaModeProvider`, `usePersonaMode` hook
- modify: `src/app/[locale]/layout.tsx` — mount `PersonaModeProvider` with SSR-read cookie

**Tests**:
- `parsePersonaMode` accepts the 3 valid values, returns `'enthusiast'` for any other input
- DB-to-frontend mapping is bijective
- `usePersonaMode` returns the SSR value on first render, no flicker

**Acceptance**: a component anywhere in the tree can `const { mode } = usePersonaMode()` and render differently for each mode.

### PR-2 — Settings page mode picker (1 day)

**Files**:
- modify: `src/app/[locale]/settings/page.tsx` — add "Display mode" section with a 3-option `RadioGroup`
- modify: `src/components/auth/UserMenu.tsx` — add a "Switch mode" shortcut for quick access (optional, defer if time-constrained)
- new: `src/app/api/user/persona-mode/route.ts` — `POST` endpoint that updates `user_profiles.experience_level` + sets the cookie

**Tests**:
- Picker shows the current mode pre-selected.
- Save updates DB + cookie + localStorage + in-memory context.
- Anonymous user cannot save to DB but can save to cookie + localStorage.

**Acceptance**: a user can change their mode in Settings; on next page load, the change is reflected sitewide.

### PR-3 — `/kundali` 3-mode generalisation + legacy migration (1 day)

**Files**:
- modify: `src/app/[locale]/kundali/Client.tsx` — replace `viewMode: 'simple' | 'expert'` with `usePersonaMode()`; render Patrika-only for `beginner`, Patrika+Expert for `enthusiast`, Expert-default for `acharya`
- modify: `src/components/kundali/simple/ViewModeToggle.tsx` — generalise to 3-state, hide for Beginner+Acharya, show for Enthusiast
- new: `src/lib/persona/legacy-migration.ts` — one-time migration of `kundali-view-mode` localStorage → `dp-persona-mode`

**Tests**:
- Beginner: Expert tabs not visible.
- Enthusiast: toggle shows 3 options; user can switch within session via `dp-persona-mode-manual` sessionStorage flag.
- Acharya: Expert tabs default-open; Patrika tab still accessible but second-class.
- Migration: pre-v1 user with `kundali-view-mode=simple` becomes Beginner; with `=expert` becomes Acharya.

**Acceptance**: the existing Simple/Expert UX is preserved for Beginner and Acharya users; Enthusiast users get a new, distinct experience.

### PR-4 — Daily Cosmic Briefing classical register for Acharya (1 day)

**Files**:
- modify: `src/lib/panchang/daily-narrative.ts` — accept `mode` parameter; emit shorter, citation-led sentences for Acharya
- modify: `src/components/dashboard/MorningBriefing.tsx` (or wherever the briefing renders) — read `usePersonaMode()`, pass through

**Acharya register example**:
- *Beginner / Enthusiast*: "The Moon transits through Purva Ashadha today — The former invincible one. Persuasive, philosophical, truth-declaring."
- *Acharya*: "Purvashadha 0°-13°20'. Padas 3-4 in Capricorn navamsha. Apas devata."

**Tests**:
- Snapshot test of narrative output per mode for a fixed panchang fixture.
- The 3 outputs differ.
- Wednesday Abhijit warning still fires across all modes.

**Acceptance**: Acharya users get terse, classical briefings; other personas unchanged.

### PR-5 — `/matching` verdict word + `/sade-sati` tone (1 day)

**Files**:
- modify: `src/app/[locale]/matching/...` — for Beginner mode, render a verdict word ("Compatible", "Marginal", "Caution") above the score; thresholds: ≥28 Compatible, 22-27 Marginal, <22 Caution
- modify: `src/app/[locale]/sade-sati/...` — for Beginner mode, render a reassuring intro paragraph; phase-aware
- modify: `src/lib/persona/copy.ts` (new) — central registry of mode-aware copy strings

**Tests**:
- Verdict logic: 27/36 → "Marginal"; 28/36 → "Compatible".
- Tone audit (manual): screenshot per mode for `/matching` and `/sade-sati`.

**Acceptance**: Beginners get traffic-light verdicts and reassuring tone; other personas see the technical breakdown without the verdict overlay.

### PR-6 — Telemetry events (1 day)

**Files**:
- modify: `src/lib/persona/context.tsx` — emit a `persona_mode_change` event on every mode change, with `from_mode`, `to_mode`, `source` (`onboarding` / `settings` / `legacy_migration` / `default`)
- modify: `src/components/auth/OnboardingModal.tsx` — emit `persona_mode_first_set` with the chosen mode

**Tests**:
- Event emitter fires exactly once per change.
- The `default` source is recorded for new visitors with no explicit setting (for analytics).

**Acceptance**: we can answer *"how many users pick Enthusiast at onboarding vs Beginner"* and *"how many Beginners switch to Enthusiast in the first session"* from analytics.

### PR-7 (deferred, ~2 weeks after PR-3) — Legacy cleanup

**Files**:
- modify: `src/app/[locale]/kundali/Client.tsx` — remove legacy `kundali-view-mode` fallback
- delete: `src/lib/persona/legacy-migration.ts` (or mark as no-op stub)

**Acceptance**: code paths that read `kundali-view-mode` no longer exist; only `dp-persona-mode` remains.

---

## Telemetry

### Events to capture

1. **`persona_mode_first_set`** — first time a user has a mode (either at onboarding or first localStorage set)
   - `mode`: `beginner | enthusiast | acharya`
   - `source`: `onboarding | settings | default | legacy_migration`
   - `is_logged_in`: boolean

2. **`persona_mode_change`** — any subsequent change
   - `from_mode`, `to_mode`
   - `source`: `settings | in_context_prompt | legacy_migration`
   - `is_logged_in`: boolean

3. **`persona_mode_default_kept`** — user reaches an Enthusiast-default page and does not change mode for 30 days
   - Captured as a passive event via dashboard query, not emitted in real-time.

### Questions these events let us answer

- What % of new users at onboarding pick each mode? (Validates the personas doc's 65%/30%/2% rough estimates.)
- What % of Beginners convert to Enthusiast in the first 30 days?
- Does Acharya retention exceed Beginner? (Validates the trust-amplifier hypothesis.)
- How many users hit the in-context prompt (Flow D) and accept the upgrade?

### What we explicitly do not track

- The mode value as a sticky user property (per privacy — it remains in `user_profiles` only).
- Per-page render counts split by mode (out of scope; future cohort analysis if needed).

---

## Edge cases

### E1 — Anonymous user has cookie but logs in with different profile mode

**Decision**: the logged-in profile wins. The cookie is overwritten on login. Telemetry event `persona_mode_change` is fired with `source=login_sync`.

Rationale: the profile is the user's considered self-assessment; the anonymous cookie is what they happened to click that session.

### E2 — User switches locales

**Decision**: mode is locale-independent. A Beginner user remains Beginner whether on `/en/` or `/mai/`.

Rationale: a beginner in Maithili is still a beginner; the persona is about Jyotish knowledge, not language proficiency.

### E3 — Server-component reads cookie that does not exist

**Decision**: default to `enthusiast`. The Beginner default would be over-protective; the Acharya default would overwhelm new visitors.

Rationale: middle option is the safest blanket default for the bulk of organic discovery traffic.

### E4 — User has `experience_level=intermediate` from existing data (pre-v1)

**Decision**: maps to Enthusiast persona. This is the segment that was previously wasted (mapped to Simple).

Telemetry: a one-time event `persona_mode_activated_from_intermediate` to count how many pre-existing users get the upgraded experience.

### E5 — Mode mismatch between SSR cookie and client localStorage

**Decision**: cookie wins on initial render; on mount, client reads localStorage; if they disagree, **cookie value is written to localStorage** (server-confirmed is more trustworthy than potentially-stale local).

Rationale: avoids hydration mismatch + ensures localStorage tracks the server state.

### E6 — User clears localStorage but cookie persists (or vice versa)

**Decision**: the surviving value is authoritative for the next page load. Re-sync to the surviving value.

Rationale: pragmatic — neither layer is more trustworthy in isolation; pick whichever is present.

### E7 — Mode change request fails mid-flight (Supabase error)

**Decision**: cookie + localStorage are written optimistically; the Supabase write is retried up to 3 times on failure. If all 3 fail, fire a `persona_mode_sync_failed` telemetry event but do not revert the local change.

Rationale: client-perceived UX prevails; eventual consistency on the backend is acceptable for a UI preference.

### E8 — User on a shared computer / kiosk

This is a known limitation. Anonymous mode persists per browser, so a household computer keeps the first user's setting. Out of scope; documented in `docs/security-audit-*.md` as accepted risk.

---

## Out of scope for v1

These belong in v2 or later, listed here so they are not re-discovered:

- **Acharya-classical Hindi register** (separate `hi` translation key bank). 4-6 weeks of content work.
- **Glossary-on-tap** for panchang/kundali Sanskrit terms. 1-2 weeks; pulls from `/learn/glossary`.
- **Persona-aware Brihaspati response register**. Requires LLM prompt-engineering changes.
- **Persona-aware /muhurta-ai citation badges**. 1 week; depends on rule engine surfacing rule IDs.
- **Module → user's chart deep-link with persona context**. 2-3 weeks; bigger feature.
- **In-context upgrade prompt** (Flow D). Design ready; ships in v2 once we have telemetry to set the prompt threshold.
- **PDF consultation report styling per persona**. 3-4 weeks; biggest scope on its own track.
- **Per-page mode override** (e.g., Enthusiast wants a Beginner view of `/matching` for one session). UX complexity; ship only if user research surfaces a need.

---

## Open questions

These deserve a decision before PR-1 starts, or a clear deferral:

1. **Onboarding step copy**. How do we phrase the question on `OnboardingModal`? "How would you describe your Jyotish knowledge?" assumes the user has thought about Jyotish before. For pure beginners landing via `/sign-calculator`, this question may not make sense — they have not formed a self-assessment yet. Possible variants:
   - *"How would you describe your astrology background?"* (cross-tradition friendly)
   - *"Pick a starting view — you can change it anytime."* (avoids self-assessment)
   - **Recommendation**: the latter; offer Beginner / Enthusiast / Acharya as choices with 1-line descriptions, default Enthusiast.

2. **In-context prompt threshold**. When does a Beginner see *"Want to try Enthusiast mode?"* — after 5 visits? After they click 2+ Expert links? Defer until telemetry from v1 is available.

3. **Should Acharya users see ads?** AdSense placement may degrade the Acharya experience. v1 leaves this unchanged; v2 may suppress ads for Acharya as a small trust signal.

4. **Should the OnboardingModal experience-level step be skippable?** Currently the modal is non-trivial — adding another step may hurt completion rates. Possible: skip → default Enthusiast, surface in `/settings` later.
   - **Recommendation**: skippable with Enthusiast default. Lowest-friction path.

5. **Mode change confirmation**. When a user switches from Beginner to Acharya, should we warn them about the complexity jump? *"Acharya mode shows technical material assuming Jyotish knowledge. Continue?"* — or just switch silently?
   - **Recommendation**: silent. The Settings page already provides the context; nagging users on a setting they explicitly chose feels patronising.

6. **Locale-mode coupling**. Should Acharya mode in `/sa/` (Sanskrit) be even terser than in `/en/`? Probably yes long-term, but v1 ships locale-independent mode and only varies tone within the same locale.

---

## Success metrics

v1 is successful if:

1. **Adoption**: ≥80% of new users at onboarding complete the experience-level step (skip-rate <20%).
2. **Distribution**: the mode distribution roughly matches the personas doc estimates (rough sanity check):
   - Beginner: 50-70%
   - Enthusiast: 20-35%
   - Acharya: 1-5%
3. **Activation of `intermediate` segment**: previously-wasted intermediate users (currently mapped to Simple) now see the Enthusiast view. Measured by `persona_mode_activated_from_intermediate` event count.
4. **No regression**: existing Simple/Expert users on `/kundali` see no visible degradation. Tracked by error rate + bounce rate on `/kundali` for 7 days post-deploy.
5. **Settings-page churn rate <10%**: users who change mode in Settings then change it back within the same session indicate confusion; below 10% is healthy.

v1 ships v2 prioritisation data: which Enthusiasts switch to Acharya within 90 days? Which Beginners stay Beginner forever? Both inform whether mode is a "set once" preference or a "graduates as you learn" preference.

---

## Risks

- **Cookie/localStorage drift**: thoroughly tested in PR-1, but real-world cookies-disabled users or third-party-cookie blocking may surface edge cases. Telemetry on `persona_mode_sync_failed` is our canary.
- **Onboarding completion rate drop**: adding a step to OnboardingModal may hurt the funnel. Mitigation: skippable + default Enthusiast.
- **Acharya copy quality**: the classical register copy needs review from a working pandit. Without that, PR-4 ships a v0 register that we iterate. Mark as a known limitation in the merge note.
- **Telemetry pipeline**: events fire client-side; if the analytics endpoint is slow/down, events drop. Acceptable for v1; we are not making real-time decisions on persona events.

---

## Decision: ship v1 in 6 PRs, this week?

If yes:
- PR-1: types + context + provider — Monday
- PR-2: Settings picker + API — Tuesday
- PR-3: `/kundali` 3-mode wiring + legacy migration — Wednesday
- PR-4: Acharya register on daily briefing — Thursday morning
- PR-5: `/matching` verdict + `/sade-sati` tone — Thursday afternoon
- PR-6: telemetry events — Friday morning
- Buffer for review + integration testing — Friday afternoon
- Deploy via Monday's daily 06:00 UTC cron

If no:
- Park here; the spec stays valid for 2-3 months; revisit when other roadmap items resolve.

---

## How this doc evolves

- PR-1 lands → mark "✅ PR-1 merged" in the implementation tasks section
- v1 ships → add a "Lessons learned" section under "Decision"
- v2 specs (Acharya register Hindi, Glossary-on-tap, etc.) reference this doc for context but are written separately
- Retire this doc once the work fully lands and the patterns are codified in `docs/PATTERNS.md` (proposed future doc)

---

*Document v1 — 2026-06-03. Companion to `docs/PERSONAS_AND_JOURNEYS.md`.*
