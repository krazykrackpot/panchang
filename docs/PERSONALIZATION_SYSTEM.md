# Personalization System — Design Document

## 1. Overview

The Personalization System transforms Jyotish Panchang from a general-purpose reference tool into a personal Vedic astrology companion. When a user signs up with their birth data (date, time, place), every page becomes contextualized to their unique chart. The daily panchang, transits, festivals, and muhurta recommendations all shift from generic information to personalized guidance.

**Stack additions:**
- **Authentication:** Clerk (via Vercel Marketplace)
- **Database:** Neon Postgres (via Vercel Marketplace)
- **Auth middleware:** `proxy.ts` with `clerkMiddleware()`

---

## 2. User Data Model

### 2.1 What the User Provides

| Field | Source | Required |
|-------|--------|----------|
| Email / OAuth | Clerk sign-in | Yes |
| Full name | Sign-up form | Yes |
| Date of birth | Sign-up form | Yes |
| Time of birth | Sign-up form | Yes (or "unknown" → noon default) |
| Place of birth | Sign-up form (geocoded) | Yes |
| Current location | Browser geolocation API | Auto-detected per visit |
| Preferred locale | `next-intl` / user setting | Auto-detected, overridable |
| Ayanamsha preference | Settings (default: Lahiri) | Optional |
| Chart style | Settings (default: North Indian) | Optional |

### 2.2 What We Derive and Store (computed once at signup, recomputed on profile edit)

```
UserProfile (Clerk-managed)
├── clerkUserId          — primary key, links to Clerk identity
├── email, name          — from Clerk
├── locale               — en | hi | sa

UserBirthData (Neon — profiles table)
├── userId (FK → Clerk)
├── dateOfBirth          — DATE (ISO)
├── timeOfBirth          — TIME (HH:mm)
├── birthTimeKnown       — BOOLEAN (false → noon assumed, flagged in UI)
├── birthPlace            — TEXT (display name)
├── birthLat              — DECIMAL(10,7)
├── birthLng              — DECIMAL(10,7)
├── birthTimezone         — TEXT (IANA, e.g. "Asia/Kolkata")
├── ayanamsha             — TEXT (lahiri | raman | kp), default lahiri
├── chartStyle            — TEXT (north | south), default north

UserKundaliSnapshot (Neon — kundali_snapshots table)
├── userId (FK)
├── computedAt            — TIMESTAMP
├── ascendantDegree       — DECIMAL
├── ascendantSign         — INTEGER (1-12)
├── moonSign              — INTEGER (1-12, Janma Rashi)
├── moonNakshatra         — INTEGER (1-27, Janma Nakshatra)
├── moonNakshatraPada     — INTEGER (1-4)
├── sunSign               — INTEGER (1-12)
├── planetPositions       — JSONB (array of PlanetPosition objects)
├── houseCusps            — JSONB (array of HouseCusp objects)
├── chartData             — JSONB (ChartData for Rasi)
├── navamshaChart         — JSONB (ChartData for D9)
├── dashaTimeline         — JSONB (full Vimshottari dasha tree to pratyantardasha level)
├── yogas                 — JSONB (detected yoga list)
├── shadbala              — JSONB (planet strengths)
├── sadeSatiPeriods       — JSONB (all Sade Sati windows for the user)
```

### 2.3 Why Store a Snapshot?

The kundali computation involves Swiss Ephemeris calculations, house systems, dasha generation, yoga detection, and shadbala — roughly 50-100ms of server-side compute. Storing the snapshot means:
- Dashboard loads fetch from Postgres, not recompute
- Dasha timeline queries are instant (no re-derivation)
- Transit overlay only needs today's planet positions (cheap) compared against stored natal positions
- Snapshot is recomputed only when the user edits their birth data

---

## 3. Database Schema (Neon Postgres)

```sql
-- User profiles (extends Clerk identity)
CREATE TABLE user_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id     TEXT UNIQUE NOT NULL,
  date_of_birth     DATE NOT NULL,
  time_of_birth     TIME NOT NULL,
  birth_time_known  BOOLEAN DEFAULT TRUE,
  birth_place       TEXT NOT NULL,
  birth_lat         DECIMAL(10,7) NOT NULL,
  birth_lng         DECIMAL(10,7) NOT NULL,
  birth_timezone    TEXT NOT NULL,
  ayanamsha         TEXT DEFAULT 'lahiri' CHECK (ayanamsha IN ('lahiri', 'raman', 'kp')),
  chart_style       TEXT DEFAULT 'north' CHECK (chart_style IN ('north', 'south')),
  locale            TEXT DEFAULT 'en' CHECK (locale IN ('en', 'hi', 'sa')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-computed kundali data (recomputed on profile change)
CREATE TABLE kundali_snapshots (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  ascendant_degree  DECIMAL(10,6) NOT NULL,
  ascendant_sign    INTEGER NOT NULL CHECK (ascendant_sign BETWEEN 1 AND 12),
  moon_sign         INTEGER NOT NULL CHECK (moon_sign BETWEEN 1 AND 12),
  moon_nakshatra    INTEGER NOT NULL CHECK (moon_nakshatra BETWEEN 1 AND 27),
  moon_nakshatra_pada INTEGER NOT NULL CHECK (moon_nakshatra_pada BETWEEN 1 AND 4),
  sun_sign          INTEGER NOT NULL CHECK (sun_sign BETWEEN 1 AND 12),
  planet_positions  JSONB NOT NULL,       -- PlanetPosition[]
  house_cusps       JSONB NOT NULL,       -- HouseCusp[]
  chart_data        JSONB NOT NULL,       -- ChartData (rasi)
  navamsha_chart    JSONB NOT NULL,       -- ChartData (D9)
  dasha_timeline    JSONB NOT NULL,       -- DashaEntry[] (full tree)
  yogas             JSONB DEFAULT '[]',   -- YogaComplete[]
  shadbala          JSONB DEFAULT '[]',   -- ShadBala[]
  sade_sati_periods JSONB DEFAULT '[]',   -- { start: date, end: date, phase: string }[]
  computed_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Saved kundalis (family members, clients)
CREATE TABLE saved_kundalis (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  label             TEXT NOT NULL,         -- "My mother", "Client: Rahul"
  birth_data        JSONB NOT NULL,        -- BirthData object
  kundali_snapshot  JSONB NOT NULL,        -- Full KundaliData
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- User's current location cache (updated per session)
CREATE TABLE user_locations (
  user_id           UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  lat               DECIMAL(10,7) NOT NULL,
  lng               DECIMAL(10,7) NOT NULL,
  place_name        TEXT,
  timezone          TEXT NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id)
);

-- Indexes
CREATE INDEX idx_profiles_clerk ON user_profiles(clerk_user_id);
CREATE INDEX idx_snapshots_user ON kundali_snapshots(user_id);
CREATE INDEX idx_saved_kundalis_user ON saved_kundalis(user_id);
```

---

## 4. Authentication Flow

### 4.1 Clerk Integration

```
Browser                    Clerk                     App Server
  │                          │                          │
  ├── Sign up ──────────────►│                          │
  │   (Google/Email)         │                          │
  │                          │── webhook ──────────────►│
  │                          │   user.created           │
  │                          │                          ├── Insert user_profiles row
  │                          │                          │   (birth data from onboarding)
  │                          │                          │
  ├── Every request ────────►│── JWT in cookie ────────►│
  │                          │                          ├── proxy.ts: clerkMiddleware()
  │                          │                          ├── auth() → { userId, orgId }
  │                          │                          ├── Fetch user profile from Neon
  │                          │                          └── Render personalized content
```

### 4.2 proxy.ts (Next.js 16)

```typescript
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/user(.*)',
  '/api/personalized(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### 4.3 Onboarding Flow

```
Sign Up (Clerk)
    │
    ▼
Onboarding Page (/onboarding)
    │
    ├── Step 1: Birth date + time picker
    │   └── "I don't know my birth time" checkbox → birth_time_known = false
    │
    ├── Step 2: Birth place (geocoded search)
    │   └── Auto-resolves lat, lng, IANA timezone
    │
    ├── Step 3: Current location
    │   └── Browser geolocation API (permission prompt)
    │   └── Fallback: manual city search
    │
    └── Submit
        │
        ├── POST /api/user/profile → insert user_profiles
        ├── Server computes full kundali via existing engine
        ├── POST /api/user/snapshot → insert kundali_snapshots
        └── Redirect → /dashboard
```

### 4.4 Public vs. Protected Routes

| Route Pattern | Auth Required | Personalized |
|---------------|---------------|--------------|
| `/` (home) | No | No (generic hero, CTA to sign up) |
| `/panchang` | No | Yes if logged in (Tara Bala, Chandrabala overlay) |
| `/calendar`, `/transits`, etc. | No | Yes if logged in (highlight relevant events) |
| `/learn/*` | No | No |
| `/dashboard` | **Yes** | **Full personalization** |
| `/dashboard/chart` | **Yes** | Birth chart, divisional charts |
| `/dashboard/dashas` | **Yes** | Current dasha, timeline |
| `/dashboard/transits` | **Yes** | Gochar overlay on natal |
| `/dashboard/muhurta` | **Yes** | Personal muhurta recommendations |
| `/dashboard/remedies` | **Yes** | Planet-specific remedies |
| `/kundali/[id]` | No | No (standalone chart viewer) |
| `/api/personalized/*` | **Yes** | Server endpoints for dashboard data |

---

## 5. Personalization Engine

### 5.1 Architecture

```
src/lib/personalization/
├── gochar.ts              — Transit overlay on natal chart
├── tara-bala.ts           — Daily nakshatra compatibility
├── chandra-bala.ts        — Daily Moon-sign compatibility
├── dasha-status.ts        — Current dasha period lookup
├── dasha-alerts.ts        — Upcoming dasha transitions
├── transit-alerts.ts      — Significant transit events
├── personal-panchang.ts   — Orchestrator: combines all above into daily snapshot
├── festival-relevance.ts  — Which festivals/vrats matter for this chart
└── types.ts               — PersonalizedDay, TransitAlert, DashaStatus types
```

### 5.2 Core Computations

#### 5.2.1 Daily Personal Panchang (`personal-panchang.ts`)

The orchestrator function called on each dashboard visit:

```typescript
interface PersonalizedDay {
  // Standard panchang (already exists)
  panchang: PanchangData;

  // Personal overlays
  taraBala: {
    taraNumber: number;        // 1-9
    taraName: Trilingual;
    isFavorable: boolean;
  };
  chandraBala: {
    houseFromMoon: number;     // 1-12
    isFavorable: boolean;
  };
  dayQuality: 'excellent' | 'good' | 'neutral' | 'caution' | 'challenging';

  // Current dasha
  currentDasha: {
    maha: { planet: string; planetName: Trilingual; start: string; end: string };
    antar: { planet: string; planetName: Trilingual; start: string; end: string };
    pratyantar: { planet: string; planetName: Trilingual; start: string; end: string };
    interpretation: Trilingual;
  };

  // Transit alerts (only significant ones)
  transitAlerts: TransitAlert[];

  // Personalized muhurta windows
  muhurtaWindows: PersonalMuhurta[];

  // Upcoming events
  upcomingEvents: PersonalEvent[];
}
```

#### 5.2.2 Gochar — Transit Overlay (`gochar.ts`)

```typescript
interface GocharResult {
  planet: string;
  planetName: Trilingual;
  transitSign: number;           // Current sidereal sign (1-12)
  natalHouse: number;            // Which natal house this transit falls in
  isRetrograde: boolean;
  aspects: {                     // Vedic aspects from transit planet to natal planets
    natalPlanet: string;
    aspectType: string;          // conjunction, opposition, trine, etc.
    orb: number;
    isExact: boolean;            // within 1 degree
    effect: Trilingual;
  }[];
  transitEffect: Trilingual;    // General effect of this planet transiting this house
}

// Computation flow:
// 1. Get today's planet positions (live compute, ~10ms via SwEph)
// 2. Convert to sidereal using lahiriAyanamsha(todayJD)
// 3. Map each transit planet to the user's natal house system
// 4. Check aspects between transit planets and natal planet positions (from snapshot)
// 5. Look up interpretations from transit effect tables
```

#### 5.2.3 Tara Bala (`tara-bala.ts`)

Already implemented in `src/lib/muhurta/personal-compatibility.ts`. The personalization engine wraps this:

```
Today's Moon Nakshatra (1-27)
     │
     ├── Count from Birth Nakshatra → Tara number (1-9, cyclic)
     │
     ├── 1: Janma (birth star) — mixed
     ├── 2: Sampat (wealth) — favorable
     ├── 3: Vipat (danger) — unfavorable
     ├── 4: Kshema (prosperity) — favorable
     ├── 5: Pratyari (obstacles) — unfavorable
     ├── 6: Sadhaka (achievement) — favorable
     ├── 7: Vadha (death) — unfavorable
     ├── 8: Mitra (friend) — favorable
     └── 9: Atimitra (great friend) — favorable
```

#### 5.2.4 Dasha Status (`dasha-status.ts`)

```typescript
// Lookup in stored dasha timeline (no recomputation needed)
function getCurrentDasha(dashaTimeline: DashaEntry[], date: Date): {
  maha: DashaEntry;
  antar: DashaEntry;
  pratyantar: DashaEntry;
} {
  // Binary search through sorted dasha tree
  // Returns the active period at each level
}

function getUpcomingTransitions(dashaTimeline: DashaEntry[], date: Date, lookAheadDays: number): {
  level: 'maha' | 'antar' | 'pratyantar';
  from: { planet: string; planetName: Trilingual };
  to: { planet: string; planetName: Trilingual };
  date: string;
  daysAway: number;
}[]
```

#### 5.2.5 Transit Alerts (`transit-alerts.ts`)

Only fires for significant events — not every transit:

```typescript
type TransitAlertType =
  | 'sade_sati_start'          // Saturn enters sign before natal Moon
  | 'sade_sati_end'            // Saturn leaves sign after natal Moon
  | 'jupiter_transit'          // Jupiter changes sign (annual event)
  | 'rahu_ketu_transit'        // Rahu/Ketu change sign (18-month cycle)
  | 'retrograde_natal'         // A retrograde planet crosses a natal planet position
  | 'planet_return'            // Transit planet conjuncts its natal position
  | 'eclipse_on_natal'         // Eclipse within 5° of a natal planet

interface TransitAlert {
  type: TransitAlertType;
  severity: 'info' | 'notable' | 'significant';
  planet: string;
  description: Trilingual;
  startDate: string;
  endDate?: string;
  affectedHouse: number;       // Natal house impacted
}
```

#### 5.2.6 Festival Relevance (`festival-relevance.ts`)

```typescript
// Tags each festival/vrat with personal relevance
interface PersonalFestival {
  festival: FestivalEntry;     // From existing festival-defs.ts
  relevanceScore: number;      // 0-100
  relevanceReason: Trilingual; // "Saturn is your 7th lord — Shani Pradosha strengthens marriage"
  isRecommended: boolean;      // score > 60
}

// Scoring factors:
// 1. Festival deity matches weak planet's deity (e.g., Hanuman Jayanti for weak Mars)
// 2. Festival tithi matches user's birth tithi
// 3. Festival nakshatra matches user's janma nakshatra
// 4. Current dasha lord's remedy aligns with the festival
// 5. Sade Sati active → boost all Saturn-related observances
```

---

## 6. API Routes

### 6.1 New Endpoints

```
POST   /api/user/profile              — Create/update user profile + trigger kundali computation
GET    /api/user/profile              — Fetch current user's profile + snapshot summary
DELETE /api/user/profile              — Delete account and all data

GET    /api/personalized/today        — Full PersonalizedDay for dashboard
GET    /api/personalized/transits     — Detailed gochar for current week
GET    /api/personalized/dashas       — Current dasha + upcoming transitions
GET    /api/personalized/muhurta      — Personalized muhurta windows for today
GET    /api/personalized/festivals    — Upcoming festivals with relevance scores
GET    /api/personalized/alerts       — Active transit alerts

POST   /api/user/saved-charts        — Save a family member's chart
GET    /api/user/saved-charts        — List saved charts
DELETE /api/user/saved-charts/[id]   — Delete a saved chart
```

### 6.2 API Pattern

All personalized endpoints follow the same pattern:

```typescript
// src/app/api/personalized/today/route.ts
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const sql = neon(process.env.DATABASE_URL!);

  // 1. Fetch stored profile + snapshot
  const [profile] = await sql`
    SELECT p.*, k.moon_sign, k.moon_nakshatra, k.planet_positions,
           k.dasha_timeline, k.sade_sati_periods
    FROM user_profiles p
    JOIN kundali_snapshots k ON k.user_id = p.id
    WHERE p.clerk_user_id = ${userId}
  `;

  if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 });

  // 2. Compute today's personalized data
  const personalizedDay = computePersonalizedDay(profile, new Date());

  return Response.json(personalizedDay);
}
```

---

## 7. Dashboard UI

### 7.1 Page Structure

```
/dashboard
├── Layout (sidebar + header with user avatar)
│
├── /dashboard (default — "Your Day")
│   ├── Day Quality Banner ("Excellent day — Mitra Tara + Moon in 7th from natal")
│   ├── Current Dasha Card (Maha → Antar → Pratyantar with progress bars)
│   ├── Today's Panchang Card (same as /panchang but with personal overlays)
│   ├── Transit Alerts (if any significant ones active)
│   ├── Recommended Festivals/Vrats (next 30 days)
│   └── Personalized Muhurta Windows (best times today for key activities)
│
├── /dashboard/chart
│   ├── Birth Chart (Rasi) — existing component
│   ├── Navamsha Chart — existing component
│   ├── Chart Style Toggle (North/South)
│   └── Planet Details Table
│
├── /dashboard/transits
│   ├── Gochar Chart (transit planets overlaid on natal)
│   ├── Transit Timeline (7-day view)
│   ├── Aspect Table (transit-to-natal aspects)
│   └── Sade Sati Status Card (if applicable)
│
├── /dashboard/dashas
│   ├── Dasha Timeline (visual, scrollable)
│   ├── Current Period Details + Interpretation
│   ├── Upcoming Transitions (next 3)
│   └── Dasha Predictions (from existing tippanni engine)
│
├── /dashboard/muhurta
│   ├── Activity Selector (marriage, travel, business, etc.)
│   ├── Today's Personal Windows (Tara + Chandra + Panchang combined)
│   └── Calendar View (next 7 days)
│
├── /dashboard/remedies
│   ├── Weak Planets (shadbala < threshold)
│   ├── Active Doshas (Mangal, Kaal Sarp, etc.)
│   ├── Recommended Mantras, Gemstones, Donations
│   └── Current Dasha Lord Remedies
│
├── /dashboard/saved-charts
│   ├── List of saved family/client charts
│   ├── Add New Chart form
│   └── Matching (compatibility) between saved charts
│
└── /dashboard/settings
    ├── Edit Birth Data (triggers kundali recomputation)
    ├── Ayanamsha preference
    ├── Chart style preference
    ├── Locale preference
    └── Delete Account
```

### 7.2 Conditional Personalization on Public Pages

Existing public pages gain subtle personalization when a logged-in user visits:

| Page | Personalization Added |
|------|---------------------|
| `/panchang` | Tara Bala + Chandra Bala badge, "Your Day Quality" indicator |
| `/calendar` | "Recommended for you" tags on festivals |
| `/transits` | Natal planet markers on transit charts |
| `/muhurat` | Personal compatibility score per muhurta window |
| `/` (home) | "Welcome back, [name]. [Dasha planet] period continues." |

Implementation: Server Components check `auth()` — if authenticated, fetch the snapshot and pass it as a prop to the personalization overlay components. If not authenticated, render the standard view. No separate page needed.

```typescript
// In any public page's Server Component:
import { auth } from '@clerk/nextjs/server';

export default async function PanchangPage() {
  const { userId } = await auth();
  let userSnapshot = null;

  if (userId) {
    userSnapshot = await fetchUserSnapshot(userId);
  }

  return (
    <>
      <PanchangDisplay data={panchangData} />
      {userSnapshot && <PersonalOverlay snapshot={userSnapshot} />}
    </>
  );
}
```

---

## 8. Data Flows

### 8.1 Sign-up & Onboarding

```
┌─────────┐     ┌─────────┐     ┌──────────────┐     ┌────────────┐
│  Browser │────►│  Clerk  │────►│  Webhook      │────►│   Neon DB   │
│  Sign-up │     │  OAuth  │     │  user.created │     │            │
└─────────┘     └─────────┘     └──────────────┘     └────────────┘
     │                                                       │
     │  Redirect to /onboarding                              │
     ▼                                                       │
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Onboarding  │────►│ POST /api/user/ │────►│  SwEph calc  │
│  Form        │     │ profile         │     │  (50-100ms)  │
└──────────────┘     └─────────────────┘     └──────┬───────┘
                                                     │
                                              ┌──────▼───────┐
                                              │ INSERT into  │
                                              │ user_profiles │
                                              │ + kundali_   │
                                              │   snapshots  │
                                              └──────────────┘
```

### 8.2 Daily Dashboard Load

```
┌─────────┐     ┌──────────┐     ┌──────────────────────────────────┐
│ Browser │────►│ proxy.ts │────►│ Dashboard Server Component       │
│ /dashboard    │ auth()   │     │                                  │
└─────────┘     └──────────┘     │  1. auth() → userId              │
                                 │  2. SQL: fetch profile + snapshot │
                                 │  3. SwEph: today's planet pos    │
                                 │     (live, ~10ms)                │
                                 │  4. Overlay transits on natal    │
                                 │  5. Compute Tara/Chandra Bala    │
                                 │  6. Lookup current dasha         │
                                 │  7. Check transit alerts         │
                                 │  8. Render PersonalizedDay       │
                                 └──────────────────────────────────┘

Latency budget:
  - Clerk auth check:     ~5ms  (JWT validation, no network)
  - Neon query:           ~20ms (single join, indexed)
  - SwEph today's planets: ~10ms
  - Personalization logic:  ~5ms (pure math on snapshot data)
  - Total server time:    ~40ms
```

### 8.3 Profile Edit → Recomputation

```
┌─────────┐     ┌───────────────────┐     ┌──────────────┐
│ Settings│────►│ PUT /api/user/    │────►│  SwEph full  │
│ Form    │     │ profile           │     │  recompute   │
└─────────┘     └───────────────────┘     │  (~100ms)    │
                                          └──────┬───────┘
                                                 │
                                          ┌──────▼───────┐
                                          │ UPDATE       │
                                          │ user_profiles │
                                          │ UPSERT       │
                                          │ kundali_     │
                                          │   snapshots  │
                                          └──────────────┘
```

---

## 9. Computation Strategy

### 9.1 What's Computed When

| Computation | When | Cost | Cached Where |
|-------------|------|------|-------------|
| Full birth kundali | Signup + profile edit | ~100ms | Neon (kundali_snapshots) |
| Today's planet positions | Every dashboard load | ~10ms | None (cheap enough to compute live) |
| Tara Bala | Every dashboard load | ~1ms | None (trivial) |
| Chandra Bala | Every dashboard load | ~1ms | None (trivial) |
| Gochar overlay | Dashboard transits tab | ~5ms | None |
| Current dasha lookup | Every dashboard load | ~0.1ms | None (binary search on stored JSON) |
| Transit alerts | Every dashboard load | ~3ms | None (compare stored vs live positions) |
| Muhurta windows | Muhurta tab | ~50ms | Consider caching per-day |
| Festival relevance | Festivals tab | ~10ms | Consider caching per-month |

### 9.2 No Client-Side Computation

All personalization runs in Server Components or API route handlers. The client receives pre-rendered HTML with all personalized data embedded. This is consistent with the existing architecture (all SwEph computation is server-side due to the native C++ addon).

---

## 10. Deployment Architecture

### 10.1 Vercel Configuration

```
Vercel Project
├── Framework: Next.js 16
├── Build: next build
├── Functions: Node.js 24 (Fluid Compute)
│   └── sweph native addon bundled
│
├── Environment Variables (auto-provisioned via Marketplace)
│   ├── NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  — Clerk
│   ├── CLERK_SECRET_KEY                    — Clerk
│   ├── CLERK_WEBHOOK_SECRET               — Clerk webhook verification
│   ├── DATABASE_URL                        — Neon Postgres connection string
│   ├── NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
│   ├── NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
│   └── (existing: STRIPE_*, RAZORPAY_*, etc.)
│
├── Integrations
│   ├── Clerk (via vercel integration add clerk)
│   ├── Neon (via vercel integration add neon)
│   └── (existing: Vercel Analytics, Speed Insights)
│
└── Domains
    └── jyotish.app (existing)
```

### 10.2 Infrastructure Costs (Estimated)

| Service | Free Tier | Paid Threshold | Cost at 10K MAU |
|---------|-----------|----------------|-----------------|
| Clerk | 10,000 MAU | 10,001+ users | ~$25/mo |
| Neon Postgres | 0.5GB, 190 compute-hours | Heavy write load | ~$0 (well within free) |
| Vercel | 100GB bandwidth, 100 hrs compute | Heavy traffic | Pro plan ($20/mo) |
| SwEph compute | N/A (runs on Vercel Functions) | CPU-bound | Included in Vercel |

**Projected cost at launch (< 1,000 users): $0/mo** (all free tiers)
**Projected cost at 10K MAU: ~$45/mo**
**Projected cost at 50K MAU: ~$200/mo** (Clerk dominates)

### 10.3 Database Sizing

Per-user storage:
- `user_profiles` row: ~500 bytes
- `kundali_snapshots` row: ~15KB (JSONB planet positions, dashas, yogas)
- `saved_kundalis` (avg 2 per user): ~30KB
- `user_locations` row: ~200 bytes
- **Total per user: ~46KB**

At 10,000 users: **~460MB** — well within Neon's free 0.5GB.
At 50,000 users: **~2.3GB** — Neon's paid tier ($19/mo for 10GB).

---

## 11. Existing Engine Reuse

The personalization system is built on top of existing engines with minimal new computation code:

| Existing Engine | File | Reused For |
|----------------|------|-----------|
| Kundali computation | `src/lib/ephem/kundali-calc.ts` | One-time birth chart generation at signup |
| Swiss Ephemeris | `src/lib/ephem/swiss-ephemeris.ts` | Live transit positions |
| Dasha calculation | `src/lib/kundali/dasha.ts` | Pre-computed dasha timeline |
| Yoga detection | `src/lib/kundali/yogas-complete.ts` | Stored in snapshot |
| Shadbala | `src/lib/kundali/shadbala.ts` | Stored in snapshot, used for weak planet detection |
| Tara/Chandra Bala | `src/lib/muhurta/personal-compatibility.ts` | Daily compatibility (already implemented) |
| Muhurta AI | `src/lib/muhurta/ai-recommender.ts` | Personal muhurta with birth data integration |
| Tippanni | `src/lib/kundali/tippanni-engine.ts` | Dasha interpretations, life area predictions |
| Sade Sati | `src/lib/kundali/sade-sati-analysis.ts` | Pre-computed windows stored in snapshot |
| Transit engine | `src/lib/calendar/transits.ts` | Transit alerts and gochar |
| Festival defs | `src/lib/calendar/festival-defs.ts` | Festival relevance scoring |
| Year predictions | `src/lib/tippanni/year-predictions.ts` | Dashboard predictions |

**New code to write** (estimated):
- `src/lib/personalization/` — ~6 files, ~800 lines total (orchestration + types)
- `src/app/dashboard/` — ~8 pages, ~2000 lines (UI)
- `src/app/api/personalized/` — ~6 route handlers, ~400 lines
- `src/app/api/user/` — ~3 route handlers, ~300 lines
- `src/app/(auth)/` — sign-in, sign-up, onboarding pages, ~400 lines
- DB setup — schema migration, ~1 file
- **Total new code: ~4000 lines**

---

## 12. Privacy & Data Handling

### 12.1 Data Classification

| Data | Sensitivity | Handling |
|------|------------|---------|
| Birth date/time/place | PII | Encrypted at rest (Neon default), never exposed in URLs |
| Email | PII | Managed by Clerk, not stored in Neon |
| Kundali snapshot | Derived PII | Same protection as birth data |
| Current location | PII | Session-scoped, overwritten each visit, auto-deleted after 30 days |
| Saved family charts | Third-party PII | User-consented, deletable via UI |

### 12.2 GDPR Compliance

- **Right to access:** `/api/user/profile` returns all stored data
- **Right to deletion:** `DELETE /api/user/profile` cascades to all tables
- **Right to portability:** Export endpoint returns JSON of all user data
- **Data minimization:** Only birth data + computed snapshot stored; no tracking, no analytics on personal data
- **Consent:** Explicit opt-in at onboarding; birth data is not required to use public features

### 12.3 Security

- All database queries use parameterized SQL (Neon's tagged template literals)
- Clerk handles authentication, session management, and CSRF
- API routes validate `auth()` before any data access
- No birth data in client-side JavaScript or localStorage
- Rate limiting on profile creation (prevent enumeration)

---

## 13. Implementation Phases

### Phase 1: Foundation (Auth + DB + Onboarding)
- Install Clerk + Neon via Vercel Marketplace
- Set up `proxy.ts` with clerkMiddleware
- Create database schema (migration file)
- Build onboarding flow (3-step form)
- Create `/api/user/profile` CRUD endpoints
- Kundali snapshot computation + storage on signup

### Phase 2: Dashboard Core
- Dashboard layout (sidebar navigation)
- "Your Day" page (Tara Bala, Chandra Bala, day quality)
- Current Dasha card
- Birth chart display (reuse existing components)
- Settings page (edit profile, preferences)

### Phase 3: Personalized Overlays
- Gochar engine (transit overlay on natal)
- Transit alerts engine
- Dashboard transits page
- Dashboard dashas page (timeline + interpretations)
- Personalization overlays on public pages (`/panchang`, `/calendar`)

### Phase 4: Advanced Features
- Personal muhurta windows
- Festival relevance scoring
- Remedies page
- Saved charts (family members)
- Data export / account deletion

### Phase 5: Engagement
- Dasha transition email notifications (future)
- Weekly personalized digest (future)
- Push notifications for significant transits (future)

---

## 14. Open Questions

1. **Birth time unknown:** How much do we degrade? Without accurate birth time, lagna and house positions are unreliable. Options:
   - Moon-sign-only mode (Tara Bala, Chandra Bala, dashas still work)
   - Flag all house-dependent features as "approximate"
   - Offer birth time rectification tool (advanced, Phase 5+)

2. **Multiple profiles:** Should a user be able to switch between "viewing as" different saved charts? Useful for astrologers managing clients.

3. **Notification channel:** Email (Resend) vs. push vs. in-app? Start with in-app alerts on dashboard, add email in Phase 5.

4. **Caching strategy for personalized pages:** Server Components with `revalidate` don't work for per-user data. Options:
   - No caching (40ms is fast enough)
   - Redis/Upstash cache keyed by userId + date (adds complexity)
   - Recommendation: **No caching** — the 40ms latency budget is acceptable.

5. **Rate of kundali recomputation:** If a user edits birth data, recompute immediately? Or queue? Given ~100ms compute time, immediate is fine up to very high scale.
