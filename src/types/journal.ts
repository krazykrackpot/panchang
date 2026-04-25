/**
 * Astro Journal — TypeScript types
 *
 * PlanetarySnapshot is stored as JSONB in `planetary_state`.
 * The flat scalar columns (tithi_number, nakshatra_number, …) are denormalised
 * copies of the same values for indexed filtering without JSONB operators.
 */

/** Full astronomical snapshot for a given date + location. */
export interface PlanetarySnapshot {
  tithi: { name: string; number: number; paksha: string };
  nakshatra: { name: string; number: number; pada: number };
  yoga: { name: string; number: number };
  karana: { name: string; number: number };
  /** 0 = Sunday, per JD/Date.getUTCDay() convention. */
  weekday: number;
  /** 1-12 (Aries = 1). */
  moonSign: number;
  planets: Array<{
    id: number;
    name: string;
    sign: number;       // 1-12
    signName: string;
    nakshatra: string;
    degree: number;
    isRetrograde: boolean;
  }>;
  /** Current Vimshottari maha + antar dasha, or null when no dasha timeline is available. */
  dasha: { mahaDasha: string; antarDasha: string } | null;
  /** 'rising' | 'peak' | 'setting' or null when not in Sade Sati. */
  sadeSatiPhase: string | null;
}

/** Full journal row as returned from Supabase. */
export interface JournalEntry {
  id: string;
  user_id: string;
  /** ISO date string "YYYY-MM-DD". */
  entry_date: string;
  mood: number | null;
  energy: number | null;
  note: string | null;
  tags: string[];
  planetary_state: PlanetarySnapshot;
  /** Denormalised scalars — kept in sync with planetary_state at write time. */
  tithi_number: number | null;
  nakshatra_number: number | null;
  yoga_number: number | null;
  karana_number: number | null;
  weekday: number | null;
  maha_dasha: string | null;
  antar_dasha: string | null;
  moon_sign: number | null;
  sade_sati_phase: string | null;
  created_at: string;
  updated_at: string;
}

/** Input accepted when creating a new journal entry. */
export interface JournalCreateInput {
  mood: number;
  energy: number;
  note?: string;
  tags?: string[];
}

/** Query filters for listing journal entries. */
export interface JournalFilters {
  dateFrom?: string;
  dateTo?: string;
  mahaDasha?: string;
  antarDasha?: string;
  nakshatraNumber?: number;
  tithiNumber?: number;
  moodMin?: number;
  limit?: number;
  offset?: number;
}

/** Full prediction_tracking row as returned from Supabase. */
export interface PredictionEntry {
  id: string;
  user_id: string;
  prediction_text: string;
  domain: string | null;
  source: string | null;
  /** ISO daterange string, e.g. "[2026-04-01,2026-04-30)". */
  predicted_for: string | null;
  planetary_state: PlanetarySnapshot;
  outcome: 'correct' | 'partially_correct' | 'incorrect' | 'pending' | null;
  outcome_note: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Full life_events row as returned from Supabase. */
export interface LifeEvent {
  id: string;
  user_id: string;
  /** ISO date string "YYYY-MM-DD". */
  event_date: string;
  event_type: string;
  title: string;
  description: string | null;
  significance: number | null;
  planetary_state: PlanetarySnapshot;
  maha_dasha: string | null;
  antar_dasha: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}
