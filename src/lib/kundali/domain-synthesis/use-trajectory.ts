/**
 * useTrajectory — hook for fetching reading history and computing trajectory.
 *
 * After `synthesizeReading()` succeeds for a logged-in user:
 *  1. POSTs current scores to /api/user/readings
 *  2. GETs full history from /api/user/readings
 *  3. Calls computeTrajectory() with history + current reading
 *  4. Returns the FullTrajectory (or null while loading / if not logged in)
 */

import { useState, useCallback, useRef } from 'react';
import { authedFetch } from '@/lib/api/authed-fetch';
import { computeTrajectory, type FullTrajectory, type TrajectoryPoint } from './trajectory';
import type { PersonalReading, DomainType } from './types';

// The 8 scoreable domains (excludes 'currentPeriod')
const SCORED_DOMAINS: DomainType[] = [
  'health', 'wealth', 'career', 'marriage',
  'children', 'family', 'spiritual', 'education',
];

/** Shape of a reading row returned by the GET /api/user/readings endpoint. */
interface ReadingRow {
  id?: string;
  user_id?: string;
  computed_at: string;
  health: number;
  wealth: number;
  career: number;
  marriage: number;
  children: number;
  family: number;
  spiritual: number;
  education: number;
  maha_dasha?: string;
  antar_dasha?: string;
  sade_sati_active?: boolean;
  overall_activation?: number;
  trigger_event?: string;
}

/** Convert a DB row into a TrajectoryPoint. */
function rowToPoint(row: ReadingRow): TrajectoryPoint {
  const d = new Date(row.computed_at);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  return {
    date,
    scores: {
      currentPeriod: 0, // not scored
      health: row.health ?? 5,
      wealth: row.wealth ?? 5,
      career: row.career ?? 5,
      marriage: row.marriage ?? 5,
      children: row.children ?? 5,
      family: row.family ?? 5,
      spiritual: row.spiritual ?? 5,
      education: row.education ?? 5,
    },
    mahaDasha: row.maha_dasha ?? '',
    antarDasha: row.antar_dasha ?? '',
    sadeSatiActive: row.sade_sati_active ?? false,
    triggerEvent: row.trigger_event,
  };
}

/** Extract the 8 domain scores from a PersonalReading. */
function extractScores(reading: PersonalReading): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const dr of reading.domains) {
    if (SCORED_DOMAINS.includes(dr.domain)) {
      scores[dr.domain] = dr.overallRating.score;
    }
  }
  return scores;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseTrajectoryResult {
  /** The computed trajectory, null until loaded or if user is not authed. */
  trajectory: FullTrajectory | null;
  /** True while the POST + GET + compute cycle is running. */
  loading: boolean;
  /** Error message, if the last sync failed. */
  error: string | null;
  /**
   * Call this after synthesizeReading() succeeds for a logged-in user.
   * It will save current scores, fetch history, and compute trajectory.
   */
  syncTrajectory: (reading: PersonalReading, locale: string) => Promise<void>;
}

export function useTrajectory(): UseTrajectoryResult {
  const [trajectory, setTrajectory] = useState<FullTrajectory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guard against concurrent calls
  const inflightRef = useRef(false);

  const syncTrajectory = useCallback(async (reading: PersonalReading, locale: string) => {
    if (inflightRef.current) return;
    inflightRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // 1. POST current scores
      const scores = extractScores(reading);
      const dashaSummary = reading.currentPeriod?.dashaSummary?.en ?? '';
      const mahaParts = dashaSummary.split(' ');

      try {
        await authedFetch('/api/user/readings', {
          method: 'POST',
          body: JSON.stringify({
            scores,
            mahaDasha: mahaParts[0] || undefined,
            antarDasha: mahaParts[1] || undefined,
            overallActivation: reading.currentPeriod?.periodScore ?? undefined,
          }),
        });
      } catch (postErr) {
        // POST failure is non-fatal — we can still fetch existing history
        console.warn('[trajectory] POST scores failed, continuing with existing history:', postErr);
      }

      // 2. GET history
      let history: TrajectoryPoint[] = [];
      try {
        const histRes = await authedFetch('/api/user/readings');
        if (histRes.ok) {
          const json = await histRes.json();
          const rows: ReadingRow[] = json.readings ?? [];
          history = rows.map(rowToPoint);
        }
      } catch (getErr) {
        console.warn('[trajectory] GET history failed:', getErr);
      }

      // 3. Compute trajectory
      const result = computeTrajectory(history, reading, locale);
      setTrajectory(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Trajectory computation failed';
      console.error('[trajectory] sync error:', msg);
      setError(msg);
    } finally {
      setLoading(false);
      inflightRef.current = false;
    }
  }, []);

  return { trajectory, loading, error, syncTrajectory };
}
