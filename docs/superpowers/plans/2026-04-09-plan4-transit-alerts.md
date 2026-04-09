# Plan 4: Transit Alerts — Email + In-App Radar + Homepage Widget

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep users engaged with personalized transit alerts — weekly email for major transits, in-app radar on the kundali page, and a compact homepage widget.

**Architecture:** Transit computation uses existing `getPlanetaryPositions` + user's stored ashtakavarga SAV table. Email via existing Resend pipeline. In-app components are client-side, computed from the kundali object.

**Tech Stack:** Next.js cron routes, Resend email, Supabase (user_profiles, chart_data), existing astronomical library, React components.

---

### Task 1: Transit Computation Utility

**Files:**
- Create: `src/lib/transit/personal-transits.ts`

- [ ] **Step 1:** Create the utility module with a single function:

```typescript
import { getPlanetaryPositions, toSidereal, dateToJD } from '@/lib/ephem/astronomical';

interface PersonalTransit {
  planetId: number;
  planetName: string;
  currentSign: number;
  signName: string;
  house: number; // relative to user's ascendant
  savBindu: number;
  quality: 'strong' | 'neutral' | 'weak';
  interpretation: string;
}

export function computePersonalTransits(
  ascendantSign: number,
  savTable: number[],  // 12 SAV scores indexed by sign (0-based)
): PersonalTransit[]
```

Implementation: get current JD, compute positions for Saturn (6), Jupiter (4), Rahu (7), Ketu (8). For each: compute sidereal longitude, derive sign, compute house from ascendant, look up SAV score, classify as strong (≥28) / weak (<22) / neutral, generate one-line interpretation based on planet + house + quality.

- [ ] **Step 2:** Add an `upcomingTransitions` function that scans 3 months ahead for sign changes of slow planets.

- [ ] **Step 3:** Commit: `feat: personal transit computation utility`

---

### Task 2: In-App Transit Radar (Kundali Page)

**Files:**
- Create: `src/components/kundali/TransitRadar.tsx`
- Modify: `src/app/[locale]/kundali/page.tsx` (add the section)

- [ ] **Step 1:** Create `TransitRadar.tsx`:

```typescript
interface TransitRadarProps {
  ascendantSign: number;
  savTable: number[];
  locale: string;
}
```

Component renders:
- Section heading: "Transit Radar — What's Activating Your Chart"
- For each slow planet (Saturn, Jupiter, Rahu, Ketu): a row with planet icon (GrahaIconById), current sign + house number, SAV bindu score, color badge (green/amber/red), one-line interpretation.
- "Upcoming" subsection: next 3 months of sign transitions.
- Dark theme, matches tippanni card style.

- [ ] **Step 2:** Add `<TransitRadar>` to the kundali page in the tippanni section, between the dasha insight and planetary strength sections. Pass `kundali.ascendant.sign` and `kundali.ashtakavarga.savTable`.

- [ ] **Step 3:** Test with a generated kundali — verify 4 planet rows render, SAV scores match the ashtakavarga tab.

- [ ] **Step 4:** Commit: `feat: in-app transit radar on kundali page`

---

### Task 3: Homepage Transit Widget

**Files:**
- Create: `src/components/panchang/TransitForecastWidget.tsx`
- Modify: `src/app/[locale]/page.tsx` (homepage — add widget)

- [ ] **Step 1:** Create `TransitForecastWidget.tsx`:
- Only renders for logged-in users with a saved kundali snapshot.
- Fetches user profile via `/api/user/profile` (already returns chart_data with ashtakavarga).
- Shows top 2 transits with highest absolute SAV deviation from mean (~25).
- Each row: planet icon, one-liner, green/red indicator.
- "View full analysis →" link to kundali page.
- Fallback for non-logged-in or no-snapshot: "Generate your birth chart for personalized transit forecasts" CTA.

- [ ] **Step 2:** Add `<TransitForecastWidget>` to homepage below the `TodayPanchangWidget`.

- [ ] **Step 3:** Test: logged in with chart → shows personalized transits. Incognito → shows CTA.

- [ ] **Step 4:** Commit: `feat: homepage transit forecast widget for logged-in users`

---

### Task 4: Weekly Transit Email Alert (Cron Job)

**Files:**
- Create: `src/app/api/cron/transit-alerts/route.ts`
- Modify: `src/lib/email/templates/alert.ts` (extend for transit content)

- [ ] **Step 1:** Create the cron route:
- Verify `CRON_SECRET` header (with `.trim()`).
- Query all users with `birth_lat IS NOT NULL AND birth_lng IS NOT NULL` from `user_profiles`.
- For each user: load their `chart_data` (from `kundali_snapshots`), extract `ashtakavarga.savTable` and `ascendant.sign`.
- Compute personal transits using the utility from Task 1.
- If any slow planet entered or is within 7 days of entering a strong/weak sign (compared to last week's check): send email.
- Create in-app notification (existing `user_notifications` table).
- Respect `notification_prefs` — skip users who opted out.

- [ ] **Step 2:** Extend the `alert.ts` email template to accept transit-specific content: planet name, sign, bindu score, favorable/challenging label, CTA link.

- [ ] **Step 3:** Add the cron schedule to `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/transit-alerts", "schedule": "0 6 * * 0" }
  ]
}
```

- [ ] **Step 4:** Add `email_transit_alerts: true` as a default in notification_prefs schema.

- [ ] **Step 5:** Test locally: `curl -H "Authorization: Bearer test-secret" http://localhost:3000/api/cron/transit-alerts` — verify it processes users and would send emails (use Resend test mode or log output).

- [ ] **Step 6:** Commit: `feat: weekly transit email alerts via cron job`

---

### Task 5: Build & Verify

- [ ] **Step 1:** `npx next build` — 0 errors.
- [ ] **Step 2:** Generate a kundali → scroll to Transit Radar → verify it shows current Saturn/Jupiter/Rahu/Ketu positions with SAV scores.
- [ ] **Step 3:** Visit homepage logged in → verify transit widget shows.
- [ ] **Step 4:** Visit homepage incognito → verify CTA shows instead.
- [ ] **Step 5:** Push all changes.
