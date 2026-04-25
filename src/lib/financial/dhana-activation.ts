/**
 * Dhana Yoga Activation Timeline
 *
 * Scans the kundali for Dhana (wealth) yogas and identifies when they
 * "activate" — i.e. when the dasha/antardasha of a yoga-forming planet
 * is running. Windows are projected up to 10 years from today.
 *
 * Classical basis: BPHS Ch.41-43 (Yoga Dasha Phala).
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import { PLANET_NAMES_EN, SIGN_LORD_FINANCIAL, WEALTH_HOUSES } from './constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActivationWindow {
  startDate: string;  // ISO date
  endDate: string;    // ISO date
  strength: 'strong' | 'moderate';
  /** Which dasha / antardasha planet is active */
  dashaDescription: string;
}

export interface DhanaActivation {
  yogaName: string;
  planets: string[];   // English planet names involved
  activationWindows: ActivationWindow[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function clamp(d: Date, lo: Date, hi: Date): Date {
  if (d < lo) return new Date(lo);
  if (d > hi) return new Date(hi);
  return d;
}

/** Extract English name from a DashaEntry */
function getDashaName(entry: DashaEntry): string {
  return (entry.planetName as { en?: string })?.en ?? entry.planet ?? '';
}

/** Planet ID from English name */
const PLANET_ID_BY_NAME: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Identify Dhana yoga activations for the next 10 years from `todayISO`.
 */
export function computeDhanaActivations(
  kundali: KundaliData,
  todayISO: string,
): DhanaActivation[] {
  const today = new Date(todayISO);
  const tenYearsLater = new Date(today);
  tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);

  // ── 1. Collect dhana yogas from the kundali ────────────────────────────────
  // Try yogasComplete first (richer data), fall back to yogas from kundali.
  interface SimpleYoga { name: string; type?: string; category?: string; present?: boolean }

  const allYogas: SimpleYoga[] = [
    ...(kundali.yogasComplete?.map(y => ({
      name: (y.name as { en?: string })?.en ?? '',
      category: y.category,
      present: y.present,
    })) ?? []),
    ...(Array.isArray((kundali as unknown as { yogas?: SimpleYoga[] }).yogas)
      ? (kundali as unknown as { yogas: SimpleYoga[] }).yogas
      : []),
  ];

  const dhanaYogas = allYogas.filter(y => {
    if (y.present === false) return false; // yogasComplete marks absent yogas
    const name = y.name.toLowerCase();
    const cat = (y.category ?? '').toLowerCase();
    const typ = (y.type ?? '').toLowerCase();
    return (
      name.includes('dhana') ||
      cat === 'wealth' ||
      typ === 'dhana' ||
      name.includes('wealth') ||
      name.includes('lakshmi') ||
      name.includes('kubera') ||
      name.includes('maha dhana')
    );
  });

  if (dhanaYogas.length === 0) return [];

  // ── 2. Identify wealth-house lords and planets in wealth houses ────────────
  const lagnaSign = kundali.ascendant.sign; // 1-12

  const wealthLordIds = new Set<number>();
  for (const h of WEALTH_HOUSES) {
    const houseSign = ((lagnaSign - 1 + (h - 1)) % 12) + 1;
    const lordId = SIGN_LORD_FINANCIAL[houseSign];
    if (lordId !== undefined) wealthLordIds.add(lordId);
  }

  // Also add planets actually placed in wealth houses
  for (const planet of kundali.planets) {
    if (WEALTH_HOUSES.includes(planet.house as typeof WEALTH_HOUSES[number])) {
      const pid = planet.planet?.id;
      if (pid !== undefined && pid <= 8) wealthLordIds.add(pid);
    }
  }

  const wealthPlanetNames = Array.from(wealthLordIds)
    .map(id => PLANET_NAMES_EN[id])
    .filter(Boolean);

  // ── 3. Scan dashas for activation windows ─────────────────────────────────
  const activationMap: Map<string, DhanaActivation> = new Map();

  // Build one combined activation collector for all dhana yogas.
  // For now, group all activations under a single "Dhana Yogas" entry
  // unless we can precisely identify which planets formed each yoga.
  // We use wealth lords as the proxy.

  for (const maha of kundali.dashas ?? []) {
    if (maha.level !== 'maha') continue;

    const mahaStart = new Date(maha.startDate);
    const mahaEnd = new Date(maha.endDate);
    if (mahaEnd < today || mahaStart > tenYearsLater) continue;

    const mahaName = getDashaName(maha);
    const mahaIsWealth = wealthLordIds.has(PLANET_ID_BY_NAME[mahaName] ?? -1);

    const antardashas = maha.subPeriods ?? [];

    if (antardashas.length === 0) {
      // Treat whole maha dasha as one block
      if (mahaIsWealth) {
        const win: ActivationWindow = {
          startDate: toISODate(clamp(mahaStart, today, tenYearsLater)),
          endDate: toISODate(clamp(mahaEnd, today, tenYearsLater)),
          strength: 'moderate',
          dashaDescription: `${mahaName} Mahadasha`,
        };
        addActivation(activationMap, dhanaYogas[0].name, wealthPlanetNames, win);
      }
      continue;
    }

    for (const antar of antardashas) {
      if (antar.level !== 'antar') continue;

      const antarStart = new Date(antar.startDate);
      const antarEnd = new Date(antar.endDate);
      if (antarEnd < today || antarStart > tenYearsLater) continue;

      const antarName = getDashaName(antar);
      const antarIsWealth = wealthLordIds.has(PLANET_ID_BY_NAME[antarName] ?? -1);

      if (!mahaIsWealth && !antarIsWealth) continue;

      const strength: ActivationWindow['strength'] =
        mahaIsWealth && antarIsWealth ? 'strong' : 'moderate';

      const descParts = [mahaName, 'Mahadasha'];
      if (antarIsWealth) descParts.push(`/ ${antarName} Antardasha`);

      const win: ActivationWindow = {
        startDate: toISODate(clamp(antarStart, today, tenYearsLater)),
        endDate: toISODate(clamp(antarEnd, today, tenYearsLater)),
        strength,
        dashaDescription: descParts.join(' '),
      };

      // Associate with most relevant yoga name
      const yogaName = dhanaYogas.find(y =>
        wealthPlanetNames.some(p =>
          y.name.toLowerCase().includes(p.toLowerCase())
        )
      )?.name ?? dhanaYogas[0].name;

      addActivation(activationMap, yogaName, wealthPlanetNames, win);
    }
  }

  return Array.from(activationMap.values())
    .filter(d => d.activationWindows.length > 0)
    .sort((a, b) => {
      const aFirst = a.activationWindows[0]?.startDate ?? '';
      const bFirst = b.activationWindows[0]?.startDate ?? '';
      return aFirst.localeCompare(bFirst);
    });
}

function addActivation(
  map: Map<string, DhanaActivation>,
  yogaName: string,
  planets: string[],
  win: ActivationWindow,
) {
  if (win.startDate >= win.endDate) return; // zero-length — skip

  if (!map.has(yogaName)) {
    map.set(yogaName, {
      yogaName,
      planets,
      activationWindows: [],
    });
  }
  map.get(yogaName)!.activationWindows.push(win);
}
