/**
 * Almanac Engine — generates a "Year in the Stars" retrospective report.
 *
 * Queries:
 *   - astro_journal (mood, energy, nakshatra, dasha) filtered by year
 *   - life_events filtered by year
 *   - prediction_tracking outcomes filtered by year
 *
 * All Supabase calls surface errors; none are swallowed silently.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface MoodTrend {
  month: number; // 1-12
  avgMood: number;
  avgEnergy: number;
  entryCount: number;
}

export interface NakshatraAffinity {
  nakshatra: string;
  count: number;
  avgMood: number;
  avgEnergy: number;
}

export interface LifeEventSummary {
  category: string;
  count: number;
  avgSignificance: number;
}

export interface PredictionAccuracy {
  total: number;
  correct: number;
  partial: number;
  incorrect: number;
  pending: number;
  accuracy: number; // 0-100
}

export interface MonthlyHighlight {
  month: number; // 1-12
  entries: number;
  avgMood: number;
  avgEnergy: number;
  topEvent?: string;
  dominantDasha: string;
  keyNakshatra: string;
}

export interface AlmanacReport {
  year: number;
  totalJournalEntries: number;
  totalLifeEvents: number;
  totalPredictions: number;
  predictionsRated: number;

  moodTrend: MoodTrend[];
  topNakshatras: NakshatraAffinity[];
  topDashaInsight: string;

  lifeEventSummary: LifeEventSummary[];
  predictionAccuracy: PredictionAccuracy;

  monthlyHighlights: MonthlyHighlight[];

  /** Pattern-based insights generated from the data. */
  personalDiscoveries: string[];
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export async function generateAlmanac(
  userId: string,
  year: number,
  supabase: SupabaseClient,
): Promise<AlmanacReport> {
  const dateFrom = `${year}-01-01`;
  const dateTo   = `${year}-12-31`;

  // -----------------------------------------------------------------------
  // 1. Fetch journal entries for the year
  // -----------------------------------------------------------------------
  const { data: journalRows, error: journalErr } = await supabase
    .from('astro_journal')
    .select(
      'entry_date, mood, energy, nakshatra_number, maha_dasha, antar_dasha, planetary_state',
    )
    .eq('user_id', userId)
    .gte('entry_date', dateFrom)
    .lte('entry_date', dateTo)
    .order('entry_date', { ascending: true });

  if (journalErr) {
    console.error('[almanac] journal fetch failed:', journalErr);
    throw new Error('Failed to load journal entries');
  }

  const journal: JournalRow[] = journalRows ?? [];

  // -----------------------------------------------------------------------
  // 2. Fetch life events for the year
  // -----------------------------------------------------------------------
  const { data: lifeRows, error: lifeErr } = await supabase
    .from('life_events')
    .select('event_date, event_type, title, significance, maha_dasha')
    .eq('user_id', userId)
    .gte('event_date', dateFrom)
    .lte('event_date', dateTo)
    .order('event_date', { ascending: true });

  if (lifeErr) {
    console.error('[almanac] life events fetch failed:', lifeErr);
    throw new Error('Failed to load life events');
  }

  const lifeEvents: LifeEventRow[] = lifeRows ?? [];

  // -----------------------------------------------------------------------
  // 3. Fetch predictions for the year
  // -----------------------------------------------------------------------
  const { data: predRows, error: predErr } = await supabase
    .from('prediction_tracking')
    .select('outcome, created_at')
    .eq('user_id', userId)
    .gte('created_at', `${dateFrom}T00:00:00Z`)
    .lte('created_at', `${dateTo}T23:59:59Z`);

  if (predErr) {
    console.error('[almanac] predictions fetch failed:', predErr);
    throw new Error('Failed to load predictions');
  }

  const predictions: PredictionRow[] = predRows ?? [];

  // -----------------------------------------------------------------------
  // 4. Aggregate
  // -----------------------------------------------------------------------
  const moodTrend        = buildMoodTrend(journal);
  const topNakshatras    = buildNakshatraAffinity(journal);
  const topDashaInsight  = buildDashaInsight(journal);
  const lifeEventSummary = buildLifeEventSummary(lifeEvents);
  const predictionAccuracy = buildPredictionAccuracy(predictions);
  const monthlyHighlights  = buildMonthlyHighlights(journal, lifeEvents, year);
  const personalDiscoveries = buildPersonalDiscoveries(journal, topNakshatras, predictionAccuracy);

  return {
    year,
    totalJournalEntries: journal.length,
    totalLifeEvents: lifeEvents.length,
    totalPredictions: predictions.length,
    predictionsRated: predictions.filter((p) => p.outcome && p.outcome !== 'pending').length,

    moodTrend,
    topNakshatras: topNakshatras.slice(0, 5),
    topDashaInsight,

    lifeEventSummary,
    predictionAccuracy,

    monthlyHighlights,
    personalDiscoveries,
  };
}

// ---------------------------------------------------------------------------
// Internal row shapes (minimal — only what we SELECT)
// ---------------------------------------------------------------------------

interface JournalRow {
  entry_date: string;
  mood: number | null;
  energy: number | null;
  nakshatra_number: number | null;
  maha_dasha: string | null;
  antar_dasha: string | null;
  planetary_state?: {
    nakshatra?: { name?: string; number?: number };
    dasha?: { mahaDasha?: string; antarDasha?: string };
  };
}

interface LifeEventRow {
  event_date: string;
  event_type: string;
  title: string;
  significance: number | null;
  maha_dasha: string | null;
}

interface PredictionRow {
  outcome: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Aggregation helpers
// ---------------------------------------------------------------------------

function monthOf(dateStr: string): number {
  // dateStr is YYYY-MM-DD
  return parseInt(dateStr.slice(5, 7), 10);
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function buildMoodTrend(journal: JournalRow[]): MoodTrend[] {
  const byMonth: Record<number, { moods: number[]; energies: number[] }> = {};
  for (let m = 1; m <= 12; m++) byMonth[m] = { moods: [], energies: [] };

  for (const row of journal) {
    const m = monthOf(row.entry_date);
    if (row.mood   != null) byMonth[m].moods.push(row.mood);
    if (row.energy != null) byMonth[m].energies.push(row.energy);
  }

  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return {
      month: m,
      avgMood:   round1(avg(byMonth[m].moods)),
      avgEnergy: round1(avg(byMonth[m].energies)),
      entryCount: byMonth[m].moods.length,
    };
  });
}

function buildNakshatraAffinity(journal: JournalRow[]): NakshatraAffinity[] {
  // Accumulate by nakshatra name (fall back to nakshatra number as string)
  const map: Record<string, { moods: number[]; energies: number[]; count: number }> = {};

  for (const row of journal) {
    // Try to get nakshatra name from planetary_state, fall back to number
    const name =
      row.planetary_state?.nakshatra?.name ??
      (row.nakshatra_number != null ? `Nakshatra ${row.nakshatra_number}` : null);
    if (!name) continue;

    if (!map[name]) map[name] = { moods: [], energies: [], count: 0 };
    map[name].count++;
    if (row.mood   != null) map[name].moods.push(row.mood);
    if (row.energy != null) map[name].energies.push(row.energy);
  }

  return Object.entries(map)
    .map(([nakshatra, { moods, energies, count }]) => ({
      nakshatra,
      count,
      avgMood:   round1(avg(moods)),
      avgEnergy: round1(avg(energies)),
    }))
    .sort((a, b) => b.count - a.count);
}

function buildDashaInsight(journal: JournalRow[]): string {
  if (journal.length === 0) return '';

  // Count months spent in each maha+antar dasha combination
  const dashaMonths: Record<string, Set<string>> = {};

  for (const row of journal) {
    const maha  = row.maha_dasha  ?? row.planetary_state?.dasha?.mahaDasha  ?? null;
    const antar = row.antar_dasha ?? row.planetary_state?.dasha?.antarDasha ?? null;
    if (!maha) continue;

    const key = antar ? `${maha}/${antar}` : maha;
    if (!dashaMonths[key]) dashaMonths[key] = new Set();
    dashaMonths[key].add(row.entry_date.slice(0, 7)); // YYYY-MM
  }

  // Find the dominant combination
  let topKey = '';
  let topCount = 0;
  for (const [key, months] of Object.entries(dashaMonths)) {
    if (months.size > topCount) {
      topCount = months.size;
      topKey = key;
    }
  }

  if (!topKey) return '';

  const monthWord = topCount === 1 ? 'month' : 'months';
  const [maha, antar] = topKey.split('/');
  const dashaDesc = antar ? `${maha}/${antar}` : maha;

  // Dasha theme keywords (basic)
  const themes: Record<string, string> = {
    Sun:     'self-expression, authority, health',
    Moon:    'emotions, intuition, nurturing',
    Mars:    'energy, ambition, courage',
    Rahu:    'growth, illusion, worldly desires',
    Jupiter: 'expansion, wisdom, prosperity',
    Saturn:  'discipline, karma, patience',
    Mercury: 'communication, intellect, trade',
    Ketu:    'spirituality, detachment, liberation',
    Venus:   'love, beauty, creativity',
  };

  const mahaTheme = themes[maha] ?? 'transformation';
  return `You spent ${topCount} ${monthWord} in ${dashaDesc} — themes: ${mahaTheme}`;
}

function buildLifeEventSummary(lifeEvents: LifeEventRow[]): LifeEventSummary[] {
  const map: Record<string, { count: number; sigList: number[] }> = {};

  for (const ev of lifeEvents) {
    const cat = ev.event_type ?? 'other';
    if (!map[cat]) map[cat] = { count: 0, sigList: [] };
    map[cat].count++;
    if (ev.significance != null) map[cat].sigList.push(ev.significance);
  }

  return Object.entries(map)
    .map(([category, { count, sigList }]) => ({
      category,
      count,
      avgSignificance: round1(avg(sigList)),
    }))
    .sort((a, b) => b.count - a.count);
}

function buildPredictionAccuracy(predictions: PredictionRow[]): PredictionAccuracy {
  let correct   = 0;
  let partial   = 0;
  let incorrect = 0;
  let pending   = 0;

  for (const p of predictions) {
    switch (p.outcome) {
      case 'correct':            correct++;   break;
      case 'partially_correct':  partial++;   break;
      case 'incorrect':          incorrect++; break;
      default:                   pending++;   break;
    }
  }

  const rated = correct + partial + incorrect;
  const accuracy = rated > 0 ? Math.round(((correct + partial * 0.5) / rated) * 100) : 0;

  return { total: predictions.length, correct, partial, incorrect, pending, accuracy };
}

function buildMonthlyHighlights(
  journal: JournalRow[],
  lifeEvents: LifeEventRow[],
  year: number,
): MonthlyHighlight[] {
  void year; // used to scope dates

  const byMonth: Record<
    number,
    {
      moods: number[];
      energies: number[];
      dashas: Record<string, number>;
      nakshatras: Record<string, number>;
    }
  > = {};
  for (let m = 1; m <= 12; m++) {
    byMonth[m] = { moods: [], energies: [], dashas: {}, nakshatras: {} };
  }

  for (const row of journal) {
    const m = monthOf(row.entry_date);
    if (row.mood   != null) byMonth[m].moods.push(row.mood);
    if (row.energy != null) byMonth[m].energies.push(row.energy);

    const maha = row.maha_dasha ?? row.planetary_state?.dasha?.mahaDasha ?? null;
    if (maha) byMonth[m].dashas[maha] = (byMonth[m].dashas[maha] ?? 0) + 1;

    const nk =
      row.planetary_state?.nakshatra?.name ??
      (row.nakshatra_number != null ? `Nakshatra ${row.nakshatra_number}` : null);
    if (nk) byMonth[m].nakshatras[nk] = (byMonth[m].nakshatras[nk] ?? 0) + 1;
  }

  // Top event per month: highest significance, then first title
  const topEventByMonth: Record<number, string> = {};
  for (const ev of lifeEvents) {
    const m = monthOf(ev.event_date);
    const existing = topEventByMonth[m];
    if (!existing) {
      topEventByMonth[m] = ev.title;
    }
    // Replace if higher significance
    const existingEv = lifeEvents.find(
      (e) => monthOf(e.event_date) === m && e.title === existing,
    );
    if (
      existingEv &&
      ev.significance != null &&
      (existingEv.significance ?? 0) < ev.significance
    ) {
      topEventByMonth[m] = ev.title;
    }
  }

  function topKey(rec: Record<string, number>): string {
    let best = '';
    let bestCount = 0;
    for (const [k, v] of Object.entries(rec)) {
      if (v > bestCount) { bestCount = v; best = k; }
    }
    return best;
  }

  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const d = byMonth[m];
    return {
      month: m,
      entries:    d.moods.length,
      avgMood:    round1(avg(d.moods)),
      avgEnergy:  round1(avg(d.energies)),
      topEvent:   topEventByMonth[m],
      dominantDasha:  topKey(d.dashas),
      keyNakshatra:   topKey(d.nakshatras),
    };
  });
}

function buildPersonalDiscoveries(
  journal: JournalRow[],
  nakshatraAffinity: NakshatraAffinity[],
  accuracy: PredictionAccuracy,
): string[] {
  const discoveries: string[] = [];

  // 1. High-energy nakshatra (3+ entries, avg energy ≥ 4)
  const highEnergyNk = nakshatraAffinity.find((n) => n.count >= 3 && n.avgEnergy >= 4);
  if (highEnergyNk) {
    discoveries.push(
      `Your energy peaks during ${highEnergyNk.nakshatra} nakshatra (avg ${highEnergyNk.avgEnergy}/5 across ${highEnergyNk.count} entries).`,
    );
  }

  // 2. Low-mood nakshatra (3+ entries, avg mood ≤ 2.5)
  const lowMoodNk = nakshatraAffinity.find((n) => n.count >= 3 && n.avgMood <= 2.5);
  if (lowMoodNk) {
    discoveries.push(
      `${lowMoodNk.nakshatra} nakshatra tends to bring lower moods for you (avg ${lowMoodNk.avgMood}/5).`,
    );
  }

  // 3. Best journaling month
  const monthCounts: Record<number, number> = {};
  for (const row of journal) {
    const m = monthOf(row.entry_date);
    monthCounts[m] = (monthCounts[m] ?? 0) + 1;
  }
  const entries = Object.entries(monthCounts);
  if (entries.length > 0) {
    const [bestMonth, bestCount] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    discoveries.push(
      `You journaled most in ${monthNames[parseInt(bestMonth, 10) - 1]} (${bestCount} entries) — a month of deep self-reflection.`,
    );
  }

  // 4. Overall mood tone
  const moods = journal.filter((r) => r.mood != null).map((r) => r.mood as number);
  if (moods.length >= 5) {
    const overallMood = avg(moods);
    if (overallMood >= 3.8) {
      discoveries.push(`Overall, ${journal[0]?.entry_date.slice(0, 4)} was a high-energy year for you with an average mood of ${round1(overallMood)}/5.`);
    } else if (overallMood <= 2.5) {
      discoveries.push(`This was a challenging year emotionally (avg mood ${round1(overallMood)}/5) — growth often comes through difficulty.`);
    }
  }

  // 5. Prediction accuracy note
  if (accuracy.total >= 5 && accuracy.accuracy > 0) {
    if (accuracy.accuracy >= 70) {
      discoveries.push(
        `Your predictions were ${accuracy.accuracy}% accurate — your astrological intuition is well-calibrated.`,
      );
    } else if (accuracy.accuracy < 40) {
      discoveries.push(
        `Your predictions were ${accuracy.accuracy}% accurate this year — a reminder that free will plays a large role.`,
      );
    }
  }

  return discoveries;
}
