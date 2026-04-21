# Reading Trajectory — Domain Score History & Sparkline Trends

> **Goal:** Store domain scores over time so users can see how their life domains are evolving. Show sparkline trends on the dashboard and kundali page.

---

## Why This Matters

Currently Personal Pandit shows a single snapshot — "Career: 7.2/10 today." Without history, users can't see:
- Is their career getting better or worse?
- Did that Saturn transit actually impact their wealth domain?
- Are remedies working?

Trajectory turns a static tool into a **personal journal** that rewards return visits.

---

## Architecture

### Database: `domain_readings` table

```sql
-- Migration: 012_domain_readings.sql
CREATE TABLE IF NOT EXISTS public.domain_readings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  computed_at timestamptz NOT NULL DEFAULT now(),
  
  -- Per-domain scores (0.0 – 10.0)
  health numeric(3,1) NOT NULL,
  wealth numeric(3,1) NOT NULL,
  career numeric(3,1) NOT NULL,
  marriage numeric(3,1) NOT NULL,
  children numeric(3,1) NOT NULL,
  family numeric(3,1) NOT NULL,
  spiritual numeric(3,1) NOT NULL,
  education numeric(3,1) NOT NULL,
  
  -- Current period context (for annotation)
  maha_dasha text,        -- e.g. "Saturn"
  antar_dasha text,       -- e.g. "Mercury"
  sade_sati_active boolean DEFAULT false,
  
  -- Overall activation score
  overall_activation numeric(3,1),
  
  -- Key event that triggered this snapshot (optional)
  trigger_event text,     -- e.g. "Jupiter entered 10th house"
  
  CONSTRAINT one_per_month UNIQUE (user_id, date_trunc('month', computed_at))
);

-- RLS: users read own data
ALTER TABLE public.domain_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own readings" ON public.domain_readings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages readings" ON public.domain_readings
  FOR ALL USING (true) WITH CHECK (true);

-- Index for fast user timeline queries
CREATE INDEX idx_domain_readings_user_time 
  ON public.domain_readings(user_id, computed_at DESC);
```

**One row per user per month** — the UNIQUE constraint prevents spam. Monthly granularity is enough for astrological trends (dasha periods last months/years, transits move slowly).

### API: `/api/user/readings` route

**GET** — Fetch user's reading history (last 12 months)
```typescript
// Response: { readings: DomainReadingRow[] }
interface DomainReadingRow {
  computed_at: string;
  health: number; wealth: number; career: number; marriage: number;
  children: number; family: number; spiritual: number; education: number;
  maha_dasha: string; antar_dasha: string; sade_sati_active: boolean;
  overall_activation: number; trigger_event: string | null;
}
```

**POST** — Store a new reading snapshot (called after `synthesizeReading()`)
```typescript
// Body: { scores: Record<DomainType, number>, mahaDasha, antarDasha, sadeSatiActive, overallActivation, triggerEvent? }
// Returns: { id: string, computed_at: string }
// Enforces: one per month per user (upserts on conflict)
```

### Engine: `src/lib/kundali/domain-synthesis/trajectory.ts`

```typescript
interface TrajectoryPoint {
  date: string;           // ISO month YYYY-MM
  scores: Record<DomainType, number>;
  mahaDasha: string;
  antarDasha: string;
  sadeSatiActive: boolean;
  triggerEvent?: string;
}

interface DomainTrajectory {
  domain: DomainType;
  current: number;
  previous: number;        // last month
  trend: 'rising' | 'falling' | 'stable';
  delta: number;           // current - previous
  sparkline: number[];     // last 6-12 months of scores
  insight: LocaleText;     // "Career improved by 2.1 points since Jupiter entered your 10th house"
}

interface FullTrajectory {
  domains: DomainTrajectory[];
  overallTrend: 'improving' | 'declining' | 'mixed' | 'stable';
  biggestGain: { domain: DomainType; delta: number };
  biggestDrop: { domain: DomainType; delta: number };
  summary: LocaleText;
}

/** Compute trajectory from historical readings. */
function computeTrajectory(
  history: TrajectoryPoint[],
  currentReading: PersonalReading,
  locale: string,
): FullTrajectory;
```

**Trend detection:**
- `rising`: current > average of last 3 months by ≥ 0.5
- `falling`: current < average of last 3 months by ≥ 0.5
- `stable`: within ±0.5

**Insight generation:**
- Correlate score changes with dasha transitions and transit events from Key Dates
- Example: "Wealth rose from 4.2 → 6.8 when Jupiter entered your 2nd house in March"
- Example: "Health dipped during Sade Sati peak (Jul-Sep), now recovering"

### UI: SparklineChart component

```typescript
// src/components/kundali/SparklineChart.tsx
interface Props {
  data: number[];      // 6-12 monthly scores
  trend: 'rising' | 'falling' | 'stable';
  width?: number;      // default 120
  height?: number;     // default 32
}
```

**Visual:** Tiny SVG line chart with:
- Gold line for the score trend
- Green/red gradient fill below the line based on trend
- Current value dot (larger, pulsing)
- No axes, no labels — just the shape

### UI: TrajectoryCard component

```typescript
// src/components/kundali/TrajectoryCard.tsx
interface Props {
  trajectory: FullTrajectory;
  locale: string;
}
```

**Visual:** Full-width card showing:
- "Your Trends" heading
- 8 mini rows, one per domain: domain name + sparkline + delta badge (+2.1 ↑ or -0.8 ↓)
- Overall summary text at bottom
- "Biggest gain: Career (+3.1)" / "Watch: Health (-1.2)" callouts

### Integration Points

**1. Kundali page** — After `synthesizeReading()` succeeds for a logged-in user:
- POST to `/api/user/readings` to store the snapshot
- GET history and compute trajectory
- Show TrajectoryCard below Key Dates, above domain cards

**2. Dashboard** — On load for logged-in users:
- GET reading history
- Show compact sparklines next to each domain mention
- "Your Trends" section below Key Dates

**3. DomainDeepDive** — Per-domain view:
- Show that domain's sparkline (larger, with month labels)
- Annotate significant events on the timeline (dasha changes, transits)
- Narrate the trajectory: "This domain has been steadily improving..."

---

## Saving Strategy

**When to save a reading:**
1. **On kundali generation** — When a logged-in user generates/views their chart
2. **Monthly cron** — `/api/cron/monthly-readings` recomputes for all users with birth data (uses stored snapshot, no user interaction needed)
3. **On significant event** — When a Key Date occurs (dasha transition, major transit), auto-recompute and store with `trigger_event` annotation

**Rate limiting:** One per month per user (DB constraint). Upsert semantics — later computation in the same month overwrites.

---

## Trajectory Narrative Examples

**Rising career:**
> "Your career domain has strengthened from 5.4 to 7.8 over the past 4 months. This coincides with Jupiter's transit through your 10th house — making this an excellent period for professional advancement."

**Falling health during Sade Sati:**
> "Health has gradually declined from 6.2 to 4.1 since Sade Sati entered its peak phase in June. Focus on stress management and regular routines — Saturn rewards discipline."

**Stable with upcoming change:**
> "Wealth has been steady around 5.5 for 6 months. However, your upcoming Saturn-Venus Antardasha (starting March) is likely to activate this domain — watch for new financial opportunities."

---

## Implementation Plan

| Task | File | Lines | Priority |
|------|------|-------|----------|
| 1. DB migration | `supabase/migrations/012_domain_readings.sql` | ~30 | P0 |
| 2. API route (GET + POST) | `src/app/api/user/readings/route.ts` | ~120 | P0 |
| 3. Trajectory engine | `src/lib/kundali/domain-synthesis/trajectory.ts` | ~200 | P0 |
| 4. SparklineChart SVG | `src/components/kundali/SparklineChart.tsx` | ~60 | P1 |
| 5. TrajectoryCard | `src/components/kundali/TrajectoryCard.tsx` | ~150 | P1 |
| 6. Kundali page integration (save + display) | `src/app/[locale]/kundali/page.tsx` | ~40 | P1 |
| 7. Dashboard integration | `src/app/[locale]/dashboard/page.tsx` | ~30 | P2 |
| 8. DomainDeepDive annotation | `src/components/kundali/DomainDeepDive.tsx` | ~40 | P2 |
| 9. Monthly cron job | `src/app/api/cron/monthly-readings/route.ts` | ~80 | P3 |
| 10. Tests | `src/lib/__tests__/trajectory.test.ts` | ~100 | P0 |

**Total: ~850 new lines across 10 files.**

---

## Critical Review: What Could Go Wrong

1. **Cold start for new users** — No history = no sparklines. Show "generating your first reading..." message and hide trajectory until 2+ months of data.

2. **Score volatility** — If transit computation changes (e.g., we improve accuracy), ALL users' scores shift, creating fake trends. **Mitigation:** Store the engine version alongside each reading; only compare readings from the same version.

3. **Monthly cron CPU cost** — Recomputing readings for all users monthly could hit Vercel CPU limits. **Mitigation:** Batch in groups of 50, use `waitUntil()` for background processing, skip users inactive >90 days.

4. **Storage growth** — 12 rows per user per year, ~500 bytes each = negligible. Even 100K users = 60MB/year.

5. **Privacy** — Domain scores are personal data. Ensure RLS is tight, add to data export and deletion flows.
