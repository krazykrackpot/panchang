# Feature Spec 01: Vedic Calendar Sync (iCal / Google Calendar Export)

**Tier:** 1 — High-value, unique, buildable in 1 day
**Priority:** 1 (build first)
**Status:** Spec Complete

---

## What It Does

Exports tithi dates, personal muhurtas, festival reminders, dasha-transition dates, and eclipse alerts as an `.ics` (iCalendar RFC 5545) file — or as a subscribable Google Calendar URL. Once subscribed, events appear in the user's phone/desktop calendar and auto-refresh.

## Why It Matters

- **Retention rocket:** once in their calendar, users see Vedic events daily without opening the app.
- **Zero competition:** no Vedic astrology app exports personalized iCal. Generic Hindu calendar apps exist but don't cross-reference with the user's chart.
- **Viral:** users share their calendar link → recipients see "Powered by Dekho Panchang" in event descriptions.

---

## User Stories

1. **Anonymous user** on `/calendar` clicks "Export to Calendar" → downloads an `.ics` file with the current year's festivals + eclipses for their detected location.
2. **Logged-in user** on `/dashboard` clicks "Sync My Calendar" → gets a subscribable URL that includes:
   - Festivals & vrats for the year (from festival engine)
   - Personal dasha transitions (from their saved chart)
   - Eclipse alerts with house impact (if chart exists)
   - Amrit Kalam / Rahu Kaal daily markers (optional toggle)
3. **User re-subscribes** next year → same URL serves updated data (rolling 12-month window).

---

## Architecture

### API Route: `POST /api/calendar/export`

**Request body:**
```typescript
{
  type: 'ics-download' | 'subscribe-url';
  lat: number;
  lng: number;
  timezone: string;         // IANA
  year: number;             // default: current year
  include: {
    festivals: boolean;     // default: true
    eclipses: boolean;      // default: true
    dashas: boolean;        // default: false (requires chartId)
    dailyTimings: boolean;  // default: false (Rahu Kaal, Amrit Kalam)
  };
  chartId?: string;         // for personalized events
}
```

**Response:**
- `ics-download`: returns `text/calendar` body with `Content-Disposition: attachment`
- `subscribe-url`: generates a unique token, stores preferences in DB, returns `webcal://` URL

### API Route: `GET /api/calendar/feed/[token]`

- Serves the live `.ics` feed for subscription URLs
- Token → user preferences lookup in `calendar_subscriptions` table
- Cache for 6 hours (festivals don't change intraday)
- Returns `text/calendar` with `Cache-Control: max-age=21600`

### Data Sources (all existing)

| Event Type | Source | Module |
|------------|--------|--------|
| Festivals & Vrats | `festival-generator.ts` → `generateFestivalsForYear()` | `src/lib/calendar/` |
| Eclipses | `eclipse-data.ts` + `eclipse-compute.ts` | `src/lib/calendar/` |
| Dasha transitions | `dasha.ts` → `calculateDashas()` | `src/lib/kundali/` |
| Rahu Kaal / Amrit Kalam | `panchang-calc.ts` → `computePanchang()` | `src/lib/ephem/` |

### iCal Event Format (RFC 5545)

```ics
BEGIN:VEVENT
DTSTART;VALUE=DATE:20260415
SUMMARY:Chaitra Navratri Day 1 (Pratipada)
DESCRIPTION:Chaitra Shukla Pratipada — first day of Navratri.\n\nPowered by Dekho Panchang\nhttps://dekhopanchang.com/calendar
CATEGORIES:FESTIVAL,VEDIC
URL:https://dekhopanchang.com/en/calendar
X-VEDIC-TITHI:Shukla Pratipada
X-VEDIC-MASA:Chaitra
END:VEVENT
```

For personalized dasha events:
```ics
BEGIN:VEVENT
DTSTART;VALUE=DATE:20260823
SUMMARY:Dasha Transition: Jupiter → Saturn Antardasha begins
DESCRIPTION:Your Vimshottari Mahadasha of Jupiter continues, but Saturn Antardasha begins today.\n\nSaturn sub-period brings focus on discipline, career structure, and karmic lessons.\n\nView your full dasha timeline: https://dekhopanchang.com/kundali/{id}
CATEGORIES:DASHA,PERSONAL
VALARM:
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Tomorrow: Saturn Antardasha begins in your Jupiter Mahadasha
END:VALARM
END:VEVENT
```

---

## Database Schema

```sql
CREATE TABLE calendar_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  timezone TEXT NOT NULL,
  include_festivals BOOLEAN DEFAULT true,
  include_eclipses BOOLEAN DEFAULT true,
  include_dashas BOOLEAN DEFAULT false,
  include_daily_timings BOOLEAN DEFAULT false,
  chart_id UUID REFERENCES saved_charts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_accessed_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: users read/manage own subscriptions, service_role full access
ALTER TABLE calendar_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subscriptions" ON calendar_subscriptions
  FOR ALL USING (auth.uid() = user_id);
```

---

## UI Integration

### 1. `/calendar` page — "Export" button (anonymous + logged-in)

```
┌─────────────────────────────────────────────┐
│  [📅 Download .ics]  [🔗 Subscribe URL]     │
│                                              │
│  ☑ Festivals & Vrats                        │
│  ☑ Eclipses                                 │
│  ☐ Daily Rahu Kaal / Amrit Kalam            │
└─────────────────────────────────────────────┘
```

- "Download .ics" always available
- "Subscribe URL" requires login (needs persistent token)
- Checkboxes control `include` flags

### 2. `/dashboard` — "Sync Calendar" card

```
┌─────────────────────────────────────────────┐
│  ✦ Vedic Calendar Sync                      │
│                                              │
│  Get tithi dates, dasha transitions, and     │
│  eclipse alerts right in your calendar.      │
│                                              │
│  ☑ Festivals    ☑ Eclipses                  │
│  ☑ My Dashas    ☐ Daily Timings             │
│                                              │
│  [Copy Subscribe Link]  [Download .ics]      │
│                                              │
│  📋 webcal://dekhopanchang.com/api/...       │
└─────────────────────────────────────────────┘
```

### 3. Navbar — no change (accessed via calendar + dashboard)

---

## Implementation Files

| File | Action | Description |
|------|--------|-------------|
| `src/lib/calendar/ical-generator.ts` | **NEW** | Core iCal string builder (RFC 5545 compliant) |
| `src/app/api/calendar/export/route.ts` | **NEW** | POST handler for .ics download |
| `src/app/api/calendar/feed/[token]/route.ts` | **NEW** | GET handler for subscription feeds |
| `src/components/calendar/CalendarSyncCard.tsx` | **NEW** | Reusable sync UI (used on /calendar + /dashboard) |
| `src/app/[locale]/calendar/page.tsx` | **EDIT** | Add export button section |
| `src/app/[locale]/dashboard/page.tsx` | **EDIT** | Add CalendarSyncCard |
| `supabase/migrations/0XX_calendar_subscriptions.sql` | **NEW** | DB migration |
| `e2e/calendar-sync.spec.ts` | **NEW** | E2E tests |
| `src/lib/__tests__/ical-generator.test.ts` | **NEW** | Unit tests for iCal output |

---

## Learning Page: `/learn/calendar-sync`

**Title:** Understanding Vedic Calendar Integration

### Content Sections

1. **What is a Vedic Calendar?**
   - The Panchanga as a timekeeping system (tithi, nakshatra, yoga, karana, vara)
   - How it differs from the Gregorian calendar
   - Lunar vs. solar months (Amanta and Purnimanta systems)

2. **Why Sync Your Calendar?**
   - Ancient practice of consulting the panchanga before daily activities
   - Modern equivalent: getting reminders for auspicious/inauspicious windows
   - Dasha transitions as life-planning milestones

3. **What Gets Synced (Explanation of each event type)**
   - **Festivals & Vrats:** significance of major tithis (Ekadashi, Purnima, Amavasya, Chaturthi)
   - **Eclipses:** Sutak periods and their traditional significance
   - **Dasha Transitions:** what it means when your planetary period changes
   - **Daily Timings:** Rahu Kaal (inauspicious), Amrit Kalam (most auspicious)

4. **Personalization**
   - How your birth chart customizes the calendar
   - Location-specific sunrise/sunset times affect Rahu Kaal and muhurtas
   - Why dasha transitions are unique to your birth moment

5. **Classical References**
   - Surya Siddhanta's calendar system
   - Panchanga as one of the six Vedangas (limbs of the Vedas)

---

## Edge Cases & Guards

- **No chart saved:** disable dasha toggle, show tooltip "Save a birth chart first"
- **Token expiry:** tokens don't expire but are cleaned up if `last_accessed_at > 1 year`
- **Timezone handling:** all events use the user's IANA timezone from coordinates, never browser TZ
- **iCal spec compliance:** test import into Google Calendar, Apple Calendar, Outlook
- **Large feeds:** daily timings for a full year = ~730 events; cap at 365 days rolling window
- **Idempotent:** re-subscribing with same params returns existing token (dedup by user_id + params hash)

---

## Effort Estimate

- iCal generator + API routes: 4 hours
- UI components (CalendarSyncCard, integration into /calendar and /dashboard): 3 hours
- DB migration + subscription management: 1 hour
- Tests (unit + E2E): 2 hours
- Learning page: 2 hours
- **Total: ~1.5 days**
