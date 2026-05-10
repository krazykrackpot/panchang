/**
 * POST /api/muhurta-scan  –  Unified muhurta scanner endpoint
 *
 * Supports two resolution modes:
 * - "overview": 2-hour windows across a date range (for month heatmap)
 * - "detail": 15-minute windows for a single day (for sparkline drill-down)
 */

import { NextResponse } from 'next/server';
import { scanDateRangeV2 } from '@/lib/muhurta/time-window-scanner';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { checkVivahCombustion, isAdhikaMasa, checkChaturmas, isProhibitedSolarMonth, checkShishutva, isDakshinayana } from '@/lib/muhurta/classical-checks';
import { checkHolashtak } from '@/lib/panchang/holashtak';
import { getLunarMasaForDate } from '@/lib/calendar/hindu-months';
import { dateToJD, calculateTithi } from '@/lib/ephem/astronomical';
import type { ExtendedActivityId, MuhurtaScanResponse, DaySummary, DetailBreakdown, FactorVerdict, RestrictionNotice } from '@/types/muhurta-ai';

// ── Activity tiers for restriction checks (classical texts differentiate by samskara) ──
const FULL_CHECK_ACTIVITIES = new Set<ExtendedActivityId>(['marriage', 'engagement', 'griha_pravesh']);
const PARTIAL_CHECK_ACTIVITIES = new Set<ExtendedActivityId>(['upanayana']);
const LIGHT_CHECK_ACTIVITIES = new Set<ExtendedActivityId>(['mundan']);

// Inauspicious yogas (MC Ch. 6)
const INAUSPICIOUS_YOGAS = new Set([1, 6, 9, 10, 13, 15, 17, 19, 27]);

// Vara names for display
const VARA_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Tithi name → number mapping for rule checking
const TITHI_NUMS: Record<string, number> = {
  'Pratipada': 1, 'Dwitiya': 2, 'Tritiya': 3, 'Chaturthi': 4, 'Panchami': 5,
  'Shashthi': 6, 'Saptami': 7, 'Ashtami': 8, 'Navami': 9, 'Dashami': 10,
  'Ekadashi': 11, 'Dwadashi': 12, 'Trayodashi': 13, 'Chaturdashi': 14, 'Purnima/Amavasya': 15,
};

function qualityFromScore(score: number): DaySummary['quality'] {
  if (score >= 72) return 'excellent';
  if (score >= 58) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

/**
 * Build per-factor verdicts explaining why a window scored as it did.
 * Checks each panchanga element against the activity's good/avoid lists
 * and returns verdicts with classical citations.
 */
function buildFactorVerdicts(
  w: { breakdown: DetailBreakdown; panchangContext?: { tithiName: string; nakshatraName: string; yogaName: string; karanaName: string; paksha: 'shukla' | 'krishna' } },
  rules: ReturnType<typeof getExtendedActivity>,
): FactorVerdict[] {
  const ctx = w.panchangContext;
  if (!ctx || !rules) return [];

  const factors: FactorVerdict[] = [];
  const paksha = ctx.paksha === 'shukla' ? 'Shukla' : 'Krishna';

  // 1. Tithi
  const tithiNum = TITHI_NUMS[ctx.tithiName] ?? 0;
  const tithiInGood = rules.goodTithis.includes(tithiNum);
  const tithiInAvoid = rules.avoidTithis.includes(tithiNum);
  factors.push({
    factor: 'Tithi',
    value: `${ctx.tithiName} (${paksha})`,
    verdict: tithiInAvoid ? 'bad' : tithiInGood ? 'good' : 'neutral',
    reason: tithiInAvoid ? 'Rikta tithi  –  avoided per MC Ch. 6'
      : tithiInGood && ctx.paksha === 'shukla' ? 'Auspicious tithi in Shukla Paksha'
      : tithiInGood ? 'Auspicious tithi, but Krishna Paksha reduces strength'
      : 'Neutral tithi',
  });

  // 2. Nakshatra
  const nakInGood = w.breakdown.nakshatra > 10;
  factors.push({
    factor: 'Nakshatra',
    value: ctx.nakshatraName,
    verdict: nakInGood ? 'good' : 'neutral',
    reason: nakInGood
      ? `Favourable for ${rules.id} per MC Ch. 6`
      : 'Neutral nakshatra  –  not among the most auspicious',
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
    reason: ctx.karanaName === 'Vishti' ? 'Vishti (Bhadra)  –  most inauspicious karana'
      : w.breakdown.karana > 6 ? 'Favourable chara karana' : 'Neutral',
  });

  // 5. Lagna
  if (w.breakdown.lagna > 0) {
    factors.push({
      factor: 'Lagna',
      value: `Score ${w.breakdown.lagna}/8`,
      verdict: w.breakdown.lagna >= 6 ? 'good' : w.breakdown.lagna <= 1 ? 'bad' : 'neutral',
      reason: w.breakdown.lagna >= 6
        ? 'Excellent lagna per MC  –  "removes all other defects"'
        : w.breakdown.lagna <= 1 ? 'Unfavourable lagna (Mars/Saturn-ruled)'
        : 'Acceptable lagna',
    });
  }

  return factors;
}

/**
 * Compute classical restriction notices for the scanned period.
 * Tiered by activity type: marriage/griha-pravesh get all 7 checks,
 * upanayana gets fewer, mundan gets specific checks.
 */
function computeRestrictions(
  activity: ExtendedActivityId,
  year: number,
  month: number,
  tz: number,
): RestrictionNotice[] {
  const anySamskara = FULL_CHECK_ACTIVITIES.has(activity)
    || PARTIAL_CHECK_ACTIVITIES.has(activity)
    || LIGHT_CHECK_ACTIVITIES.has(activity);

  const restrictions: RestrictionNotice[] = [];

  if (anySamskara) {
    const jdMid = dateToJD(year, month, 15, 12 - tz);

    // Venus/Jupiter combustion  –  all samskaras except namakarana
    const combust = checkVivahCombustion(jdMid);
    if (combust.vetoed) {
      for (const d of combust.details) {
        const severityEn = d.severity === 'full'
          ? `full combustion at ${d.distance}°`
          : `${d.distance}° from Sun (BPHS orb: ${d.orb}°)`;
        const severityHi = d.severity === 'full'
          ? `पूर्ण दग्ध ${d.distance}°`
          : `सूर्य से ${d.distance}° (BPHS मानक: ${d.orb}°)`;
        restrictions.push({
          type: 'combustion',
          label: {
            en: `${d.planet} combust  –  ${severityEn}. Samskaras restricted (MC + Dharmasindhu).`,
            hi: `${d.planet === 'Venus' ? 'शुक्र' : 'गुरु'} अस्त  –  ${severityHi}। संस्कार वर्जित (मुहूर्त चिन्तामणि + धर्मसिन्धु)।`,
          },
        });
      }
    }

    // Adhika Masa  –  all samskaras except namakarana
    if (isAdhikaMasa(year, month, 15)) {
      restrictions.push({
        type: 'adhika_masa',
        label: {
          en: 'Adhika Masa (intercalary month)  –  samskaras restricted (Dharmasindhu)',
          hi: 'अधिक मास  –  संस्कार वर्जित (धर्मसिन्धु)',
        },
      });
    }

    // Chaturmas  –  marriage/engagement/griha_pravesh/upanayana (NOT mundan)
    if (FULL_CHECK_ACTIVITIES.has(activity) || PARTIAL_CHECK_ACTIVITIES.has(activity)) {
      const chaturmas = checkChaturmas(year, month, 15);
      if (chaturmas === 'full') {
        restrictions.push({
          type: 'chaturmas',
          label: {
            en: 'Chaturmas (Harishayana period)  –  samskaras prohibited (Dharmasindhu)',
            hi: 'चातुर्मास (हरिशयन काल)  –  संस्कार वर्जित (धर्मसिन्धु)',
          },
        });
      } else if (chaturmas === 'partial') {
        restrictions.push({
          type: 'chaturmas_partial',
          label: {
            en: 'Chaturmas edge month  –  fewer auspicious days available',
            hi: 'चातुर्मास सीमा मास  –  शुभ दिन सीमित',
          },
        });
      }
    }

    // Kharmas  –  full-check activities only (marriage/engagement/griha_pravesh)
    if (FULL_CHECK_ACTIVITIES.has(activity) && isProhibitedSolarMonth(jdMid)) {
      restrictions.push({
        type: 'kharmas',
        label: {
          en: 'Kharmas (Sun in Dhanu/Mina)  –  marriage restricted (Dharmasindhu)',
          hi: 'खरमास (सूर्य धनु/मीन में)  –  विवाह वर्जित (धर्मसिन्धु)',
        },
      });
    }

    // Shishutva  –  full-check activities only
    if (FULL_CHECK_ACTIVITIES.has(activity) && checkShishutva(jdMid)) {
      restrictions.push({
        type: 'shishutva',
        label: {
          en: 'Venus/Jupiter recently emerged from combustion (Shishutva)  –  influence still weak',
          hi: 'शुक्र/गुरु अस्त से हाल ही में उदित (शिशुत्व)  –  प्रभाव अभी दुर्बल',
        },
      });
    }

    // Holashtak  –  full + partial check activities (not mundan, not namakarana)
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
              en: 'Holashtak active (8 days before Holi)  –  samskaras traditionally avoided in North India',
              hi: 'होलाष्टक सक्रिय (होली से पूर्व 8 दिन)  –  उत्तर भारत में संस्कार वर्जित',
            },
          });
        }
      }
    }
  }

  // Dakshinayana  –  mundan only
  if (activity === 'mundan') {
    const jdMidD = dateToJD(year, month, 15, 12 - tz);
    if (isDakshinayana(jdMidD)) {
      restrictions.push({
        type: 'dakshinayana',
        label: {
          en: 'Dakshinayana (Sun\'s southern course)  –  Mundan requires Uttarayana (MC Chudakarana Prakarana)',
          hi: 'दक्षिणायन  –  मुण्डन हेतु उत्तरायण आवश्यक (मुहूर्त चिन्तामणि)',
        },
      });
    }
  }

  return restrictions;
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const {
      activity,
      startDate,
      endDate,
      lat,
      lng,
      timezone,
      tz: tzFallback = 0,
      resolution = 'overview',
      birthNakshatra,
      birthRashi,
      dashaLords,
      detailDate,
    } = body as {
      activity: ExtendedActivityId;
      startDate: string;
      endDate: string;
      lat: number;
      lng: number;
      timezone?: string;
      tz?: number;
      resolution?: 'overview' | 'detail';
      birthNakshatra?: number;
      birthRashi?: number;
      dashaLords?: { maha: number; antar: number; pratyantar: number };
      detailDate?: string;
    };

    // Validate required fields
    if (!activity || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: activity, startDate, endDate' },
        { status: 400 },
      );
    }

    if (resolution === 'detail' && !detailDate) {
      return NextResponse.json(
        { error: 'detailDate is required for detail resolution' },
        { status: 400 },
      );
    }

    // Validate activity
    const rules = getExtendedActivity(activity);
    if (!rules) {
      return NextResponse.json(
        { error: `Unknown activity: ${activity}` },
        { status: 400 },
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'Dates must be YYYY-MM-DD format' },
        { status: 400 },
      );
    }

    // Validate lat/lng
    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return NextResponse.json(
        { error: 'Invalid lat/lng values' },
        { status: 400 },
      );
    }

    // Resolve timezone offset  –  IANA name takes priority over numeric fallback.
    // getUTCOffsetForDate handles DST transitions correctly per-date.
    let tz = tzFallback;
    if (timezone) {
      const [y, m, d] = (detailDate || startDate).split('-').map(Number);
      if (y && m && d) tz = getUTCOffsetForDate(y, m, d, timezone);
    }

    // Determine scan parameters based on resolution
    const isDetail = resolution === 'detail';
    const scanStart = isDetail && detailDate ? detailDate : startDate;
    const scanEnd = isDetail && detailDate ? detailDate : endDate;

    // ScanV2Window is a superset of HeatmapCell and DetailWindow  –  all fields
    // are present for both resolutions. The cast below is safe for serialization.
    const windows = scanDateRangeV2({
      startDate: scanStart,
      endDate: scanEnd,
      activity,
      lat,
      lng,
      tz,
      windowMinutes: isDetail ? 15 : 120,
      preSunriseHours: isDetail ? 2 : 0,
      postSunsetHours: isDetail ? 3 : 1,
      birthNakshatra,
      birthRashi,
      dashaLords,
    });

    // Track which personal factors were applied
    const personalFactorsUsed: MuhurtaScanResponse['meta']['personalFactorsUsed'] = [];
    if (birthNakshatra && birthNakshatra > 0) personalFactorsUsed.push('taraBala', 'chandraBala');
    if (dashaLords) personalFactorsUsed.push('dashaHarmony');

    // ── Overview: add day summaries + restriction notices ──
    let days: DaySummary[] | undefined;
    let restrictions: RestrictionNotice[] | undefined;

    if (!isDetail) {
      // Parse year/month from the startDate for restriction checks
      const [scanYear, scanMonth] = scanStart.split('-').map(Number);

      // Compute classical restrictions for this month/activity
      restrictions = computeRestrictions(activity, scanYear, scanMonth, tz);

      // Group windows by date → build DaySummary[] with best window per day
      const dayMap = new Map<string, DaySummary>();

      // Filter to auspicious windows (score >= 50 aligns with classical muhurta standards)
      const auspiciousWindows = windows.filter(w => w.score >= 50);

      for (const w of auspiciousWindows) {
        const existing = dayMap.get(w.date);
        if (!existing || w.score > existing.bestScore) {
          // Derive Panchanga Shuddhi (0-5) from breakdown sub-scores
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
            },
            taraBala: w.taraBala,
            chandraBala: w.chandraBala,
            tithi: w.panchangContext?.tithiName,
            nakshatra: w.panchangContext?.nakshatraName,
            factors: buildFactorVerdicts(w, rules),
          });
        } else {
          existing.windowCount++;
        }
      }

      days = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }

    const response: MuhurtaScanResponse = {
      // ScanV2Window is structurally compatible with HeatmapCell | DetailWindow
      windows: windows as unknown as MuhurtaScanResponse['windows'],
      days,
      restrictions,
      meta: {
        activity,
        dateRange: [scanStart, scanEnd],
        resolution,
        personalFactorsUsed,
        computeTimeMs: Date.now() - startTime,
      },
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': isDetail
          ? 'private, max-age=300'
          : 'private, max-age=1800',
      },
    });
  } catch (err: unknown) {
    console.error('[muhurta-scan] Scan failed:', err);
    const message = err instanceof Error ? err.message : 'Muhurta scan failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
