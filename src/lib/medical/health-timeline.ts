/**
 * Health Timeline — identifies health vulnerability windows from dashas.
 * Looks 10 years forward from today.
 *
 * Classical basis: BPHS Ch.46-47 (Dasha phala), 6th/8th lord dashas
 * indicate health stress periods.
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import { SIGN_LORD } from './constants';

export interface HealthWindow {
  startDate: string; // ISO date
  endDate: string;   // ISO date
  severity: 'low' | 'medium' | 'high';
  type: string;
  description: string;
}

/** Planet names by index */
const PLANET_NAMES: Record<string, string> = {
  Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
  Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu',
  Su: 'Sun', Mo: 'Moon', Ma: 'Mars', Me: 'Mercury',
  Ju: 'Jupiter', Ve: 'Venus', Sa: 'Saturn', Ra: 'Rahu', Ke: 'Ketu',
};

function getPlanetName(entry: DashaEntry): string {
  return (
    (entry.planetName as { en?: string })?.en ??
    entry.planet ??
    ''
  );
}

/** Resolve planet ID from name string */
const PLANET_ID_BY_NAME: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

export function computeHealthTimeline(
  kundali: KundaliData,
  todayISO: string,
): HealthWindow[] {
  const today = new Date(todayISO);
  const tenYearsLater = new Date(today);
  tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);

  const lagnaSign = kundali.ascendant.sign; // 1-12

  // 6th house sign and lord
  const sixthHouseSign = ((lagnaSign - 1 + 5) % 12) + 1;
  const sixthLordId = SIGN_LORD[sixthHouseSign];
  const sixthLordName = getNameById(sixthLordId);

  // 8th house sign and lord
  const eighthHouseSign = ((lagnaSign - 1 + 7) % 12) + 1;
  const eighthLordId = SIGN_LORD[eighthHouseSign];
  const eighthLordName = getNameById(eighthLordId);

  // Saturn planet name (always relevant)
  const saturnName = 'Saturn';

  const windows: HealthWindow[] = [];

  // Collect all maha dashas that overlap the next 10 years
  for (const maha of kundali.dashas ?? []) {
    if (maha.level !== 'maha') continue;

    const mahaStart = new Date(maha.startDate);
    const mahaEnd = new Date(maha.endDate);

    // Skip if entirely outside our window
    if (mahaEnd < today || mahaStart > tenYearsLater) continue;

    const mahaName = getPlanetName(maha);

    // Check antardasha periods
    const antardashas = maha.subPeriods ?? [];

    if (antardashas.length === 0) {
      // No antardasha data — treat the whole maha dasha as a block
      const severity = getMahaSeverity(mahaName, sixthLordName, eighthLordName, saturnName);
      if (severity) {
        const start = mahaStart < today ? today : mahaStart;
        const end = mahaEnd > tenYearsLater ? tenYearsLater : mahaEnd;
        windows.push({
          startDate: toISODate(start),
          endDate: toISODate(end),
          severity: severity.severity,
          type: severity.type,
          description: severity.description.replace('{planet}', mahaName),
        });
      }
      continue;
    }

    for (const antar of antardashas) {
      if (antar.level !== 'antar') continue;

      const antarStart = new Date(antar.startDate);
      const antarEnd = new Date(antar.endDate);

      if (antarEnd < today || antarStart > tenYearsLater) continue;

      const antarName = getPlanetName(antar);

      // 6th lord as maha OR antar → general health risk
      if (mahaName === sixthLordName || antarName === sixthLordName) {
        const severity: 'medium' | 'high' =
          mahaName === sixthLordName && antarName === sixthLordName ? 'high' : 'medium';
        windows.push(makeWindow(antarStart, antarEnd, today, tenYearsLater, severity, {
          type: 'General Health Risk',
          description: `${sixthLordName} (6th lord) dasha period — digestive, immunity, and general vitality may be tested`,
        }));
        continue;
      }

      // 8th lord as maha OR antar → chronic condition risk
      if (mahaName === eighthLordName || antarName === eighthLordName) {
        const severity: 'medium' | 'high' =
          mahaName === eighthLordName && antarName === eighthLordName ? 'high' : 'medium';
        windows.push(makeWindow(antarStart, antarEnd, today, tenYearsLater, severity, {
          type: 'Chronic Condition Risk',
          description: `${eighthLordName} (8th lord) dasha period — watch for chronic issues, hidden ailments, or need for surgery`,
        }));
        continue;
      }

      // Saturn antar in any maha → general caution
      if (antarName === saturnName) {
        windows.push(makeWindow(antarStart, antarEnd, today, tenYearsLater, 'low', {
          type: 'Structural Stress Period',
          description: `Saturn antardasha — joint health, fatigue, and chronic Vata conditions may surface`,
        }));
      }

      // Rahu antar → mental/immune stress
      if (antarName === 'Rahu') {
        windows.push(makeWindow(antarStart, antarEnd, today, tenYearsLater, 'low', {
          type: 'Mental / Immune Stress',
          description: `Rahu antardasha — stress, unclear diagnoses, and immune system irregularities possible`,
        }));
      }
    }
  }

  // Deduplicate overlapping identical-type windows and sort by start date
  const sorted = windows
    .filter((w) => w.startDate < w.endDate) // remove zero-length
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return sorted;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNameById(id: number | undefined): string {
  if (id === undefined) return '';
  const names: Record<number, string> = {
    0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
    4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
  };
  return names[id] ?? '';
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function makeWindow(
  start: Date,
  end: Date,
  today: Date,
  cap: Date,
  severity: HealthWindow['severity'],
  meta: { type: string; description: string },
): HealthWindow {
  const clampedStart = start < today ? today : start;
  const clampedEnd = end > cap ? cap : end;
  return {
    startDate: toISODate(clampedStart),
    endDate: toISODate(clampedEnd),
    severity,
    type: meta.type,
    description: meta.description,
  };
}

function getMahaSeverity(
  name: string,
  sixth: string,
  eighth: string,
  saturn: string,
): { severity: HealthWindow['severity']; type: string; description: string } | null {
  if (name === sixth) {
    return {
      severity: 'medium',
      type: 'General Health Risk',
      description: '{planet} (6th lord) Mahadasha — digestive, immunity, and general vitality may be tested',
    };
  }
  if (name === eighth) {
    return {
      severity: 'medium',
      type: 'Chronic Condition Risk',
      description: '{planet} (8th lord) Mahadasha — watch for chronic issues or hidden ailments',
    };
  }
  if (name === saturn) {
    return {
      severity: 'low',
      type: 'Structural Stress Period',
      description: 'Saturn Mahadasha — joints, chronic fatigue, Vata aggravation possible over long term',
    };
  }
  return null;
}
