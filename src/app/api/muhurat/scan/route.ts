/**
 * /api/muhurat/scan — Advanced muhurta scanner
 *
 * Uses the multi-factor scoring engine (panchang + transit + timing + personal)
 * to find and score auspicious windows within a month.
 * Returns day-level summaries for a calendar grid view.
 */

import { NextRequest, NextResponse } from 'next/server';
import { scanDateRange, scanDateRangeV2 } from '@/lib/muhurta/time-window-scanner';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

// All supported activities
const ACTIVITIES: ExtendedActivityId[] = [
  'marriage', 'griha_pravesh', 'mundan', 'vehicle', 'travel',
  'property', 'business', 'education', 'namakarana', 'upanayana',
  'engagement', 'gold_purchase', 'medical_treatment', 'court_case',
  'exam', 'spiritual_practice', 'agriculture', 'financial_signing',
  'surgery', 'relocation',
];

interface DaySummary {
  date: string;
  bestScore: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  windowCount: number;
  bestWindow?: {
    startTime: string;
    endTime: string;
    score: number;
    shuddhi: number;
  };
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
  /** Tithi name at sunrise (for display in calendar cells) */
  tithi?: string;
  /** Nakshatra name at sunrise (for display in calendar cells) */
  nakshatra?: string;
  /** Weekday name */
  vara?: string;
}

function qualityFromScore(score: number): DaySummary['quality'] {
  if (score >= 72) return 'excellent';
  if (score >= 58) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
  const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
  const activity = (searchParams.get('activity') || 'marriage') as ExtendedActivityId;
  const lat = parseFloat(searchParams.get('lat') || '28.6139');
  const lng = parseFloat(searchParams.get('lng') || '77.209');
  const tz = parseFloat(searchParams.get('tz') || '5.5');
  const birthNak = parseInt(searchParams.get('birthNak') || '0') || undefined;
  const birthRashi = parseInt(searchParams.get('birthRashi') || '0') || undefined;

  // Validate activity
  if (!ACTIVITIES.includes(activity)) {
    return NextResponse.json({ error: `Unknown activity: ${activity}` }, { status: 400 });
  }

  try {
  // Scan the full month
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

  // Use V2 scanner — includes panchangContext with tithi/nakshatra names
  // Larger windows (180min) + no pre-sunrise/post-sunset = faster + more relevant
  const allWindows = scanDateRangeV2({
    startDate,
    endDate,
    activity,
    lat,
    lng,
    tz,
    windowMinutes: 180,    // 3-hour windows — fewer evaluations, faster
    preSunriseHours: 0,    // muhurtas are daytime — no pre-sunrise scan
    postSunsetHours: 0,    // no post-sunset scan
    birthNakshatra: birthNak,
    birthRashi: birthRashi,
  });

  // Filter: only keep windows above minimum score
  // V2 returns ALL windows including poor ones — must filter to match classical muhurta standards
  // Reference: Prokerala/AstroYogi show ~8 marriage days in May 2026. Score >= 50 gives ~10-12.
  const windows = allWindows.filter(w => w.score >= 50);

  // Group windows by date → day summaries
  const dayMap = new Map<string, DaySummary>();

  for (const w of windows) {
    const existing = dayMap.get(w.date);
    if (!existing || w.score > existing.bestScore) {
      // Derive Panchanga Shuddhi (0-5) from V2 breakdown sub-scores
      // Each sub-score > 10 (out of 20) = favorable → counts as 1 shuddhi point
      const bd = w.breakdown;
      const shuddhi = bd
        ? [bd.tithi > 10, bd.nakshatra > 10, bd.yoga > 10, bd.karana > 5, bd.taraBala > 5].filter(Boolean).length
        : 0;

      dayMap.set(w.date, {
        date: w.date,
        bestScore: w.score,
        quality: qualityFromScore(w.score),
        windowCount: (existing?.windowCount ?? 0) + 1,
        bestWindow: {
          startTime: w.startTime,
          endTime: w.endTime,
          score: w.score,
          shuddhi,
        },
        taraBala: w.taraBala,
        chandraBala: w.chandraBala,
        tithi: w.panchangContext?.tithiName,
        nakshatra: w.panchangContext?.nakshatraName,
      });
    } else {
      existing.windowCount++;
    }
  }

  const days = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  // Get activity labels
  const activityData = getExtendedActivity(activity);
  const activityLabels = ACTIVITIES.map(id => {
    const data = getExtendedActivity(id);
    return { id, label: data?.label ?? { en: id } };
  });

  return NextResponse.json({
    year,
    month,
    activity,
    days,
    windows: windows.slice(0, 10), // Top 10 detailed windows
    activities: activityLabels,
    activityLabel: activityData?.label,
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=1800' },
  });
  } catch (err: unknown) {
    console.error('[muhurat/scan] Scan failed:', err);
    const message = err instanceof Error ? err.message : 'Muhurta scan failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
