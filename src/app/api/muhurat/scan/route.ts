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
import { checkVivahCombustion, isAdhikaMasa, checkChaturmas, isProhibitedSolarMonth, checkShishutva, isDakshinayana } from '@/lib/muhurta/classical-checks';
import { checkHolashtak } from '@/lib/panchang/holashtak';
import { getLunarMasaForDate } from '@/lib/calendar/hindu-months';
import { dateToJD, calculateTithi } from '@/lib/ephem/astronomical';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

// All supported activities
const ACTIVITIES: ExtendedActivityId[] = [
  'marriage', 'griha_pravesh', 'mundan', 'vehicle', 'travel',
  'property', 'business', 'education', 'namakarana', 'upanayana',
  'engagement', 'gold_purchase', 'medical_treatment', 'court_case',
  'exam', 'spiritual_practice', 'agriculture', 'financial_signing',
  'surgery', 'relocation',
];

interface FactorVerdict {
  factor: string;       // e.g. "Tithi", "Nakshatra"
  value: string;        // e.g. "Panchami (Shukla)"
  verdict: 'good' | 'neutral' | 'bad';
  reason: string;       // e.g. "Auspicious per Muhurta Chintamani Ch. 6"
}

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
  /** Per-factor verdicts explaining WHY this day is auspicious or not */
  factors?: FactorVerdict[];
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

  // Activity rules for factor verdicts
  const rules = getExtendedActivity(activity);

  // Inauspicious yogas (MC Ch. 6)
  const INAUSPICIOUS_YOGAS = new Set([1, 6, 9, 10, 13, 15, 17, 19, 27]);
  // Vara names for display
  const VARA_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /** Build per-factor verdicts explaining why this day scored as it did */
  function buildFactorVerdicts(w: typeof windows[0]): FactorVerdict[] {
    const ctx = w.panchangContext;
    if (!ctx || !rules) return [];

    const factors: FactorVerdict[] = [];
    const paksha = ctx.paksha === 'shukla' ? 'Shukla' : 'Krishna';

    // 1. Tithi
    // Map tithi name back to number for rule checking
    const TITHI_NUMS: Record<string, number> = {
      'Pratipada': 1, 'Dwitiya': 2, 'Tritiya': 3, 'Chaturthi': 4, 'Panchami': 5,
      'Shashthi': 6, 'Saptami': 7, 'Ashtami': 8, 'Navami': 9, 'Dashami': 10,
      'Ekadashi': 11, 'Dwadashi': 12, 'Trayodashi': 13, 'Chaturdashi': 14, 'Purnima/Amavasya': 15,
    };
    const tithiNum = TITHI_NUMS[ctx.tithiName] ?? 0;
    const tithiInGood = rules.goodTithis.includes(tithiNum);
    const tithiInAvoid = rules.avoidTithis.includes(tithiNum);
    factors.push({
      factor: 'Tithi',
      value: `${ctx.tithiName} (${paksha})`,
      verdict: tithiInAvoid ? 'bad' : tithiInGood ? 'good' : 'neutral',
      reason: tithiInAvoid ? 'Rikta tithi — avoided per MC Ch. 6'
        : tithiInGood && ctx.paksha === 'shukla' ? 'Auspicious tithi in Shukla Paksha'
        : tithiInGood ? 'Auspicious tithi, but Krishna Paksha reduces strength'
        : 'Neutral tithi',
    });

    // 2. Nakshatra
    // Map name to number (approximate — using the scanner's internal data)
    const nakInGood = w.breakdown.nakshatra > 10;
    const nakInAvoid = rules.hardAvoidNakshatras?.includes(0); // We don't have the number here, use breakdown
    factors.push({
      factor: 'Nakshatra',
      value: ctx.nakshatraName,
      verdict: nakInGood ? 'good' : 'neutral',
      reason: nakInGood
        ? `Favourable for ${activity} per MC Ch. 6`
        : 'Neutral nakshatra — not among the most auspicious',
    });

    // 3. Yoga
    const yogaScore = w.breakdown.yoga;
    factors.push({
      factor: 'Yoga',
      value: ctx.yogaName,
      verdict: yogaScore > 14 ? 'good' : yogaScore < 6 ? 'bad' : 'neutral',
      reason: yogaScore < 6
        ? 'Inauspicious yoga per MC Ch. 6 (one of 9 Ashubh Yogas)'
        : yogaScore > 14 ? 'Favourable yoga' : 'Neutral yoga',
    });

    // 4. Karana
    factors.push({
      factor: 'Karana',
      value: ctx.karanaName,
      verdict: w.breakdown.karana > 6 ? 'good' : w.breakdown.karana < 3 ? 'bad' : 'neutral',
      reason: ctx.karanaName === 'Vishti' ? 'Vishti (Bhadra) — most inauspicious karana'
        : w.breakdown.karana > 6 ? 'Favourable chara karana' : 'Neutral',
    });

    // 5. Lagna
    if (w.breakdown.lagna > 0) {
      factors.push({
        factor: 'Lagna',
        value: `Score ${w.breakdown.lagna}/8`,
        verdict: w.breakdown.lagna >= 6 ? 'good' : w.breakdown.lagna <= 1 ? 'bad' : 'neutral',
        reason: w.breakdown.lagna >= 6
          ? 'Excellent lagna per MC — "removes all other defects"'
          : w.breakdown.lagna <= 1 ? 'Unfavourable lagna (Mars/Saturn-ruled)'
          : 'Acceptable lagna',
      });
    }

    return factors;
  }

  // Group windows by date → day summaries
  const dayMap = new Map<string, DaySummary>();

  for (const w of windows) {
    const existing = dayMap.get(w.date);
    if (!existing || w.score > existing.bestScore) {
      // Derive Panchanga Shuddhi (0-5) from V2 breakdown sub-scores
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
        factors: buildFactorVerdicts(w),
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

  // ── Restriction notices — tiered by activity type ────────────
  // Classical texts differentiate prohibition levels by samskara.
  const FULL_CHECK_ACTIVITIES = new Set(['marriage', 'engagement', 'griha_pravesh']);
  const PARTIAL_CHECK_ACTIVITIES = new Set(['upanayana']);
  const LIGHT_CHECK_ACTIVITIES = new Set(['mundan']);
  const anySamskara = FULL_CHECK_ACTIVITIES.has(activity) || PARTIAL_CHECK_ACTIVITIES.has(activity) || LIGHT_CHECK_ACTIVITIES.has(activity);

  const restrictions: { type: string; label: { en: string; hi: string } }[] = [];
  if (anySamskara) {
    const jdMid = dateToJD(year, month, 15, 12 - tz);

    // Venus/Jupiter combustion — all samskaras except namakarana
    const combust = checkVivahCombustion(jdMid);
    if (combust.vetoed) {
      const planets = combust.planets.join(' & ');
      restrictions.push({
        type: 'combustion',
        label: {
          en: `${planets} combust this month — samskaras restricted (MC + Dharmasindhu)`,
          hi: `${planets === 'Venus' ? 'शुक्र' : planets === 'Jupiter' ? 'गुरु' : 'शुक्र/गुरु'} अस्त — संस्कार वर्जित (मुहूर्त चिन्तामणि + धर्मसिन्धु)`,
        },
      });
    }

    // Adhika Masa — all samskaras except namakarana
    if (isAdhikaMasa(year, month, 15)) {
      restrictions.push({
        type: 'adhika_masa',
        label: {
          en: 'Adhika Masa (intercalary month) — samskaras restricted (Dharmasindhu)',
          hi: 'अधिक मास — संस्कार वर्जित (धर्मसिन्धु)',
        },
      });
    }

    // Chaturmas — marriage/engagement/griha_pravesh/upanayana (NOT mundan)
    if (FULL_CHECK_ACTIVITIES.has(activity) || PARTIAL_CHECK_ACTIVITIES.has(activity)) {
      const chaturmas = checkChaturmas(year, month, 15);
      if (chaturmas === 'full') {
        restrictions.push({
          type: 'chaturmas',
          label: {
            en: 'Chaturmas (Harishayana period) — samskaras prohibited (Dharmasindhu)',
            hi: 'चातुर्मास (हरिशयन काल) — संस्कार वर्जित (धर्मसिन्धु)',
          },
        });
      } else if (chaturmas === 'partial') {
        restrictions.push({
          type: 'chaturmas_partial',
          label: {
            en: 'Chaturmas edge month — fewer auspicious days available',
            hi: 'चातुर्मास सीमा मास — शुभ दिन सीमित',
          },
        });
      }
    }

    // Kharmas — full-check activities only (marriage/engagement/griha_pravesh)
    if (FULL_CHECK_ACTIVITIES.has(activity) && isProhibitedSolarMonth(jdMid)) {
      restrictions.push({
        type: 'kharmas',
        label: {
          en: 'Kharmas (Sun in Dhanu/Mina) — marriage restricted (Dharmasindhu)',
          hi: 'खरमास (सूर्य धनु/मीन में) — विवाह वर्जित (धर्मसिन्धु)',
        },
      });
    }

    // Shishutva — full-check activities only
    if (FULL_CHECK_ACTIVITIES.has(activity) && checkShishutva(jdMid)) {
      restrictions.push({
        type: 'shishutva',
        label: {
          en: 'Venus/Jupiter recently emerged from combustion (Shishutva) — influence still weak',
          hi: 'शुक्र/गुरु अस्त से हाल ही में उदित (शिशुत्व) — प्रभाव अभी दुर्बल',
        },
      });
    }

    // Holashtak — full + partial check activities (not mundan, not namakarana)
    if (FULL_CHECK_ACTIVITIES.has(activity) || PARTIAL_CHECK_ACTIVITIES.has(activity)) {
      const midMasa = getLunarMasaForDate(year, month, 15);
      if (midMasa) {
        const midTithi = calculateTithi(jdMid);
        const midPaksha: 'shukla' | 'krishna' = midTithi.number <= 15 ? 'shukla' : 'krishna';
        const holashtak = checkHolashtak(midTithi.number, midMasa.name, midPaksha);
        if (holashtak.isActive) {
          restrictions.push({
            type: 'holashtak',
            label: {
              en: 'Holashtak active (8 days before Holi) — samskaras traditionally avoided in North India',
              hi: 'होलाष्टक सक्रिय (होली से पूर्व 8 दिन) — उत्तर भारत में संस्कार वर्जित',
            },
          });
        }
      }
    }
  }

  // Dakshinayana — mundan only
  if (activity === 'mundan') {
    const jdMidD = dateToJD(year, month, 15, 12 - tz);
    if (isDakshinayana(jdMidD)) {
      restrictions.push({
        type: 'dakshinayana',
        label: {
          en: 'Dakshinayana (Sun\'s southern course) — Mundan requires Uttarayana (MC Chudakarana Prakarana)',
          hi: 'दक्षिणायन — मुण्डन हेतु उत्तरायण आवश्यक (मुहूर्त चिन्तामणि)',
        },
      });
    }
  }

  return NextResponse.json({
    year,
    month,
    activity,
    days,
    windows: windows.slice(0, 10), // Top 10 detailed windows
    activities: activityLabels,
    activityLabel: activityData?.label,
    restrictions,
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=1800' },
  });
  } catch (err: unknown) {
    console.error('[muhurat/scan] Scan failed:', err);
    const message = err instanceof Error ? err.message : 'Muhurta scan failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
