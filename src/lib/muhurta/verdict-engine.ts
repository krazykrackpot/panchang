/**
 * Verdict Engine — synthesises PanchangData time windows into rated 30-minute slots.
 *
 * Uses a precedence hierarchy:
 *   Hard blocks (N1-N6) → AVOID (unless Abhijit present → conflict matrix)
 *   Conditional blocks (N7-N9) → CAUTION
 *   Positives (P1-P10) → GOOD / VERY_GOOD / EXCELLENT / EXCEPTIONAL
 */

import type { PanchangData, ChoghadiyaSlot } from '@/types/panchang';
import type {
  TimeSlot,
  DayVerdict,
  ActiveFactor,
  ConflictExplanation,
  VerdictRating,
} from './verdict-types';
import {
  HARD_BLOCKS,
  CONDITIONAL_BLOCKS,
  POSITIVES,
  ABHIJIT_WEDNESDAY_VERDICT,
  type PositiveFactor,
} from './verdict-config';
import { resolveConflict } from './conflict-matrix';
import { EXTENDED_ACTIVITIES } from './activity-rules-extended';
import type { ExtendedActivityId } from '@/types/muhurta-ai';
import { formatActivityBlockName } from './block-name-labels';

// ─── Time helpers ───────────────────────────────────────────────────────────

/** Parse "HH:MM" → minutes since midnight */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Minutes since midnight → "HH:MM" */
function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Check if two ranges overlap (both in minutes). Standard interval overlap check. */
function rangeOverlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

// ─── Factor collection helpers ──────────────────────────────────────────────

function findHardBlock(id: string): ActiveFactor {
  return HARD_BLOCKS.find(b => b.id === id)!;
}

function findConditionalBlock(id: string): ActiveFactor {
  return CONDITIONAL_BLOCKS.find(b => b.id === id)!;
}

function findPositive(id: string): PositiveFactor {
  return POSITIVES.find(p => p.id === id)!;
}

interface TimeWindow {
  start: number; // minutes
  end: number;   // minutes
}

function parseWindow(w: { start: string; end: string }): TimeWindow {
  return { start: toMinutes(w.start), end: toMinutes(w.end) };
}

// ─── Day-level yoga detection ───────────────────────────────────────────────

/** Match specialYogas array entries by name substring (case-insensitive) */
function matchSpecialYoga(
  specialYogas: PanchangData['specialYogas'],
  pattern: string
): boolean {
  if (!specialYogas) return false;
  const lower = pattern.toLowerCase();
  return specialYogas.some(
    y => y.isActive && y.name.en.toLowerCase().includes(lower)
  );
}

// ─── Choghadiya lookup ──────────────────────────────────────────────────────

function findChoghadiya(
  choghadiya: ChoghadiyaSlot[] | undefined,
  slotStart: number,
  slotEnd: number
): TimeSlot['choghadiya'] | undefined {
  if (!choghadiya || choghadiya.length === 0) return undefined;

  // Find the choghadiya whose time range overlaps with the slot midpoint
  const mid = (slotStart + slotEnd) / 2;
  for (const c of choghadiya) {
    const cStart = toMinutes(c.startTime);
    const cEnd = toMinutes(c.endTime);
    // Handle midnight-crossing choghadiya
    if (c.crossesMidnight) {
      if (mid >= cStart || mid < cEnd) {
        return {
          name: c.name.en,
          nameHi: c.name.hi ?? c.name.en,
          type: c.type,
          nature: c.nature,
        };
      }
    } else if (mid >= cStart && mid < cEnd) {
      return {
        name: c.name.en,
        nameHi: c.name.hi ?? c.name.en,
        type: c.type,
        nature: c.nature,
      };
    }
  }
  return undefined;
}

// ─── Verdict rating helpers ─────────────────────────────────────────────────

const RATING_ORDER: Record<VerdictRating, number> = {
  avoid: 0,
  caution: 1,
  good: 2,
  very_good: 3,
  excellent: 4,
  exceptional: 5,
};

const RATING_LABELS: Record<VerdictRating, { en: string; hi: string }> = {
  avoid: { en: 'Avoid', hi: 'वर्जित' },
  caution: { en: 'Caution', hi: 'सावधान' },
  good: { en: 'Good', hi: 'शुभ' },
  very_good: { en: 'Very Good', hi: 'अति शुभ' },
  excellent: { en: 'Excellent', hi: 'उत्तम' },
  exceptional: { en: 'Exceptional', hi: 'सर्वश्रेष्ठ' },
};

function rateByPositives(positives: PositiveFactor[], isWednesday: boolean): VerdictRating {
  if (positives.length === 0) return 'good';

  // Filter out Wednesday-weakened Abhijit from "real" positives for rating
  const effective = positives.filter(p => {
    if (p.id === 'abhijit' && isWednesday) return false;
    return true;
  });

  const maxStrength = effective.length > 0
    ? Math.max(...effective.map(p => p.strength))
    : 0;
  const count = effective.length;

  // Supreme combo: P1 or P2 (Guru/Ravi Pushya) + P6 (Amrit Kalam) present
  const hasSupremeYoga = effective.some(p => p.id === 'guru_pushya' || p.id === 'ravi_pushya');
  const hasAmritKalam = effective.some(p => p.id === 'amrit_kalam');
  const hasAbhijit = positives.some(p => p.id === 'abhijit') && !isWednesday;

  if (hasSupremeYoga && hasAmritKalam && hasAbhijit) return 'exceptional';
  if (hasSupremeYoga && (hasAmritKalam || hasAbhijit)) return 'exceptional';

  // 3+ positives or strength ≥ 90 with count ≥ 2
  if (count >= 3 || (maxStrength >= 90 && count >= 2)) return 'excellent';

  // 2+ positives or any with strength ≥ 90
  if (count >= 2 || maxStrength >= 90) return 'very_good';

  // 1 positive
  if (count >= 1) return 'good';

  // Wednesday Abhijit only (filtered out above)
  return 'good';
}

// ─── Main engine ────────────────────────────────────────────────────────────

export function computeDayVerdict(panchang: PanchangData, activityId?: string): DayVerdict {
  const sunriseMin = toMinutes(panchang.sunrise);
  const sunsetMin = toMinutes(panchang.sunset);
  const isWednesday = panchang.vara.day === 3; // 0=Sun, 1=Mon, ..., 3=Wed, 6=Sat

  // ─── 0. Activity-specific day-level checks ─────────────────────────────
  // When an activity is selected, check nakshatra/tithi/weekday against
  // that activity's classical rules. These produce day-level blocks that
  // apply to ALL slots (nakshatra and tithi span most of the day).

  const activityDayBlocks: ActiveFactor[] = [];
  const activityDayConditionals: ActiveFactor[] = [];
  let activityWeekdayPenalty = false;

  if (activityId && activityId in EXTENDED_ACTIVITIES) {
    const activity = EXTENDED_ACTIVITIES[activityId as ExtendedActivityId];
    const nakshatraId = panchang.nakshatra.id;
    const tithiNum = panchang.tithi.number;
    const weekday = panchang.vara.day; // 0=Sun, 1=Mon, ..., 6=Sat

    // Hard-avoid nakshatra → day-level hard block on all slots
    if (activity.hardAvoidNakshatras?.includes(nakshatraId)) {
      const baseBlock = CONDITIONAL_BLOCKS.find(b => b.id === 'activity_nakshatra_hard')
        ?? HARD_BLOCKS.find(b => b.id === 'activity_nakshatra_hard');
      if (baseBlock) {
        const nameLT = formatActivityBlockName('activity_nakshatra_hard_template', activity.label, 'en');
        activityDayBlocks.push({
          ...baseBlock,
          name: nameLT.en,
          nameHi: nameLT.hi ?? `${activity.label.hi} हेतु नक्षत्र वर्जित`,
          nameLT,
        });
      }
    }
    // Soft-avoid nakshatra → day-level conditional block
    else if (activity.avoidNakshatras?.includes(nakshatraId)) {
      const baseBlock = CONDITIONAL_BLOCKS.find(b => b.id === 'activity_nakshatra');
      if (baseBlock) {
        const nameLT = formatActivityBlockName('activity_nakshatra_template', activity.label, 'en');
        activityDayConditionals.push({
          ...baseBlock,
          name: nameLT.en,
          nameHi: nameLT.hi ?? `${activity.label.hi} हेतु नक्षत्र अनुपयुक्त`,
          nameLT,
        });
      }
    }

    // Avoid tithi → day-level conditional block
    if (activity.avoidTithis?.includes(tithiNum)) {
      const baseBlock = CONDITIONAL_BLOCKS.find(b => b.id === 'activity_tithi');
      if (baseBlock) {
        const nameLT = formatActivityBlockName('activity_tithi_template', activity.label, 'en');
        activityDayConditionals.push({
          ...baseBlock,
          name: nameLT.en,
          nameHi: nameLT.hi ?? `${activity.label.hi} हेतु तिथि अनुपयुक्त`,
          nameLT,
        });
      }
    }

    // Weekday not in goodWeekdays → flag (reduces rating, not a block)
    if (!activity.goodWeekdays.includes(weekday)) {
      activityWeekdayPenalty = true;
    }
  }

  // ─── 1. Collect day-level factors ───────────────────────────────────────

  const dayLevelYogas: ActiveFactor[] = [];
  let hasDayLevelDosha = false;

  // Vyatipata (yoga #17) and Vaidhriti (yoga #27) — day-level hard blocks
  const dayLevelHardBlockWindows: TimeWindow[] = [];
  if (panchang.yoga.number === 17) {
    dayLevelHardBlockWindows.push({ start: sunriseMin, end: sunsetMin });
    dayLevelYogas.push(findHardBlock('vyatipata'));
    hasDayLevelDosha = true;
  }
  if (panchang.yoga.number === 27) {
    dayLevelHardBlockWindows.push({ start: sunriseMin, end: sunsetMin });
    dayLevelYogas.push(findHardBlock('vaidhriti'));
    hasDayLevelDosha = true;
  }

  // Day-level positive yogas (active in every slot)
  const dayLevelPositives: PositiveFactor[] = [];

  // Guru Pushya from specialYogas
  if (matchSpecialYoga(panchang.specialYogas, 'guru pushya')) {
    const factor = findPositive('guru_pushya');
    dayLevelPositives.push(factor);
    dayLevelYogas.push(factor);
  }

  // Ravi Pushya from specialYogas
  if (matchSpecialYoga(panchang.specialYogas, 'ravi pushya')) {
    const factor = findPositive('ravi_pushya');
    dayLevelPositives.push(factor);
    dayLevelYogas.push(factor);
  }

  // Amrit Siddhi: from boolean field OR specialYogas
  if (
    panchang.amritSiddhiYoga ||
    matchSpecialYoga(panchang.specialYogas, 'amrit siddhi')
  ) {
    const factor = findPositive('amrit_siddhi');
    dayLevelPositives.push(factor);
    dayLevelYogas.push(factor);
  }

  // Sarvartha Siddhi: from boolean field OR specialYogas
  if (
    panchang.sarvarthaSiddhi ||
    matchSpecialYoga(panchang.specialYogas, 'sarvartha siddhi')
  ) {
    const factor = findPositive('sarvartha_siddhi');
    dayLevelPositives.push(factor);
    dayLevelYogas.push(factor);
  }

  // Siddha Yoga from specialYogas
  if (matchSpecialYoga(panchang.specialYogas, 'siddha yoga')) {
    const factor = findPositive('siddha_yoga');
    dayLevelPositives.push(factor);
    dayLevelYogas.push(factor);
  }

  // ─── 2. Collect time-windowed factors ───────────────────────────────────

  // Hard blocks with time windows
  const hardBlockWindows: { id: string; window: TimeWindow }[] = [];

  // Rahu Kaal
  if (panchang.rahuKaal) {
    hardBlockWindows.push({ id: 'rahu_kaal', window: parseWindow(panchang.rahuKaal) });
  }
  // Yamaganda
  if (panchang.yamaganda) {
    hardBlockWindows.push({ id: 'yamaganda', window: parseWindow(panchang.yamaganda) });
  }
  // Gulika Kaal
  if (panchang.gulikaKaal) {
    hardBlockWindows.push({ id: 'gulika_kaal', window: parseWindow(panchang.gulikaKaal) });
  }
  // Vishti/Bhadra windows
  const bhadraWindows = panchang.bhadraAll ?? (panchang.bhadra ? [panchang.bhadra] : []);
  for (const b of bhadraWindows) {
    hardBlockWindows.push({ id: 'vishti', window: parseWindow(b) });
  }

  // Conditional blocks with time windows
  const conditionalWindows: { id: string; window: TimeWindow }[] = [];

  // Varjyam
  const varjyamWindows = panchang.varjyamAll ?? (panchang.varjyam ? [panchang.varjyam] : []);
  for (const v of varjyamWindows) {
    conditionalWindows.push({ id: 'varjyam', window: parseWindow(v) });
  }

  // DurMuhurtam
  if (panchang.durMuhurtam) {
    for (const d of panchang.durMuhurtam) {
      conditionalWindows.push({ id: 'durmuhurta', window: parseWindow(d) });
    }
  }

  // Visha Ghatika
  if (panchang.vishaGhatika) {
    conditionalWindows.push({ id: 'visha_ghatika', window: parseWindow(panchang.vishaGhatika) });
  }

  // Positive time windows
  const positiveWindows: { id: string; window: TimeWindow }[] = [];

  // Abhijit Muhurta
  if (panchang.abhijitMuhurta?.available !== false) {
    positiveWindows.push({ id: 'abhijit', window: parseWindow(panchang.abhijitMuhurta) });
  }

  // Amrit Kalam
  const amritWindows = panchang.amritKalamAll ?? (panchang.amritKalam ? [panchang.amritKalam] : []);
  for (const a of amritWindows) {
    positiveWindows.push({ id: 'amrit_kalam', window: parseWindow(a) });
  }

  // Brahma Muhurta
  if (panchang.brahmaMuhurta) {
    positiveWindows.push({ id: 'brahma_muhurta', window: parseWindow(panchang.brahmaMuhurta) });
  }

  // Vijaya Muhurta
  if (panchang.vijayaMuhurta) {
    positiveWindows.push({ id: 'vijaya_muhurta', window: parseWindow(panchang.vijayaMuhurta) });
  }

  // Godhuli
  if (panchang.godhuli) {
    positiveWindows.push({ id: 'godhuli', window: parseWindow(panchang.godhuli) });
  }

  // ─── 3. Generate 30-minute slots ───────────────────────────────────────

  const slots: TimeSlot[] = [];

  for (let min = sunriseMin; min < sunsetMin; min += 30) {
    const slotStart = min;
    const slotEnd = Math.min(min + 30, sunsetMin);
    const startStr = toHHMM(slotStart);
    const endStr = toHHMM(slotEnd);

    // Collect active hard blocks for this slot
    const activeHardBlocks: ActiveFactor[] = [];

    // Day-level hard blocks (Vyatipata/Vaidhriti)
    for (const dlw of dayLevelHardBlockWindows) {
      if (rangeOverlaps(slotStart, slotEnd, dlw.start, dlw.end)) {
        if (panchang.yoga.number === 17) {
          activeHardBlocks.push(findHardBlock('vyatipata'));
        }
        if (panchang.yoga.number === 27) {
          activeHardBlocks.push(findHardBlock('vaidhriti'));
        }
      }
    }

    // Time-windowed hard blocks
    for (const hb of hardBlockWindows) {
      if (rangeOverlaps(slotStart, slotEnd, hb.window.start, hb.window.end)) {
        activeHardBlocks.push(findHardBlock(hb.id));
      }
    }

    // Collect active conditional blocks
    const activeConditionalBlocks: ActiveFactor[] = [];
    for (const cb of conditionalWindows) {
      if (rangeOverlaps(slotStart, slotEnd, cb.window.start, cb.window.end)) {
        activeConditionalBlocks.push(findConditionalBlock(cb.id));
      }
    }

    // Activity-specific day-level blocks (apply to ALL slots)
    // Hard-avoid nakshatras → treated as hard blocks
    activeHardBlocks.push(...activityDayBlocks);
    // Soft-avoid nakshatras + avoid tithis → conditional blocks
    activeConditionalBlocks.push(...activityDayConditionals);

    // Collect active positives
    const activePositives: PositiveFactor[] = [];

    // Day-level positives (active in every slot)
    activePositives.push(...dayLevelPositives);

    // Time-windowed positives
    for (const pw of positiveWindows) {
      if (rangeOverlaps(slotStart, slotEnd, pw.window.start, pw.window.end)) {
        const factor = findPositive(pw.id);
        // On Wednesday, Abhijit is weakened — still add it but rating logic handles it
        activePositives.push(factor);
      }
    }

    // Choghadiya (display only)
    const choghadiya = findChoghadiya(panchang.choghadiya, slotStart, slotEnd);

    // ─── 4. Determine verdict ─────────────────────────────────────────

    let verdict: VerdictRating;
    const conflicts: ConflictExplanation[] = [];
    let explanation = '';
    let explanationHi = '';

    const hasAbhijit = activePositives.some(p => p.id === 'abhijit');
    const abhijitIsWednesday = hasAbhijit && isWednesday;

    if (activeHardBlocks.length > 0) {
      if (hasAbhijit && !abhijitIsWednesday) {
        // Abhijit vs hard blocks → check conflict matrix
        verdict = 'caution'; // default from conflict matrix
        for (const hb of activeHardBlocks) {
          const resolution = resolveConflict('abhijit', hb.id);
          if (resolution) {
            conflicts.push({
              positive: 'abhijit',
              negative: hb.id,
              verdict: resolution.verdict,
              explanation: resolution.explanation,
              explanationHi: resolution.explanationHi,
              rule: resolution.rule,
            });
            // Use the worst verdict from all conflict resolutions
            if (RATING_ORDER[resolution.verdict] < RATING_ORDER[verdict]) {
              verdict = resolution.verdict;
            }
          } else {
            // No special rule — hard block wins
            verdict = 'avoid';
          }
        }
        explanation = 'Abhijit Muhurta conflicts with active hard block(s). Exercise caution.';
        explanationHi = 'अभिजित मुहूर्त सक्रिय कठोर दोष से संघर्ष में है। सावधानी बरतें।';
      } else {
        // Hard blocks with no (effective) Abhijit → AVOID
        verdict = 'avoid';
        const blockNames = activeHardBlocks.map(b => b.name).join(', ');
        explanation = `Active hard block(s): ${blockNames}. Avoid important activities.`;
        explanationHi = `सक्रिय कठोर दोष: ${activeHardBlocks.map(b => b.nameHi).join(', ')}। महत्वपूर्ण कार्यों से बचें।`;
      }
    } else if (activeConditionalBlocks.length > 0) {
      verdict = 'caution';
      const blockNames = activeConditionalBlocks.map(b => b.name).join(', ');
      explanation = `Conditional block(s) active: ${blockNames}. Proceed with awareness.`;
      explanationHi = `सशर्त दोष सक्रिय: ${activeConditionalBlocks.map(b => b.nameHi).join(', ')}। सावधानी से आगे बढ़ें।`;
    } else {
      // No blocks — rate by positives
      verdict = rateByPositives(activePositives, isWednesday);

      // On Wednesday with Abhijit only and no other effective positives → apply Wednesday verdict
      if (abhijitIsWednesday && activePositives.length === 1) {
        verdict = ABHIJIT_WEDNESDAY_VERDICT;
        explanation = 'Abhijit Muhurta is weakened on Wednesdays per Muhurta Chintamani.';
        explanationHi = 'मुहूर्त चिंतामणि के अनुसार बुधवार को अभिजित मुहूर्त कमज़ोर होता है।';
      } else if (activePositives.length > 0) {
        const posNames = activePositives.map(p => p.name).join(', ');
        explanation = `Positive factor(s): ${posNames}.`;
        explanationHi = `शुभ कारक: ${activePositives.map(p => p.nameHi).join(', ')}।`;
      } else {
        explanation = 'No significant positive or negative factors.';
        explanationHi = 'कोई महत्वपूर्ण शुभ या अशुभ कारक नहीं।';
      }
    }

    // Activity weekday penalty: if weekday is not in goodWeekdays, downgrade
    // one level (but never below 'good' for this factor alone)
    if (activityWeekdayPenalty && verdict !== 'avoid' && verdict !== 'caution') {
      const downgrade: Record<string, VerdictRating> = {
        exceptional: 'excellent',
        excellent: 'very_good',
        very_good: 'good',
        good: 'good', // floor — weekday alone doesn't make it caution
      };
      verdict = downgrade[verdict] ?? verdict;
    }

    const labels = RATING_LABELS[verdict];

    slots.push({
      start: startStr,
      end: endStr,
      verdict,
      label: labels.en,
      labelHi: labels.hi,
      explanation,
      explanationHi,
      hardBlocks: activeHardBlocks,
      conditionalBlocks: activeConditionalBlocks,
      positives: activePositives,
      conflicts,
      choghadiya,
    });
  }

  // ─── 5. Find best/secondBest/avoidWindows ─────────────────────────────

  const avoidWindows = slots.filter(s => s.verdict === 'avoid');

  // Sort by rating (highest first), then by start time
  const ranked = [...slots]
    .filter(s => s.verdict !== 'avoid' && s.verdict !== 'caution')
    .sort((a, b) => {
      const diff = RATING_ORDER[b.verdict] - RATING_ORDER[a.verdict];
      if (diff !== 0) return diff;
      return toMinutes(a.start) - toMinutes(b.start);
    });

  const bestWindow = ranked[0] ?? null;
  const secondBest = ranked[1] ?? null;

  return {
    slots,
    bestWindow,
    secondBest,
    avoidWindows,
    dayLevelYogas,
    hasDayLevelDosha,
  };
}
