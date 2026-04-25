/**
 * Hora-Based Financial Activity Guide
 *
 * Maps each planetary hour to financial activity recommendations using
 * the classical planet→sector mapping and hora favorability tables.
 *
 * This module works with HoraEntry data produced by the existing
 * hora-calculator.ts — it does NOT re-implement hora computation.
 */

import type { HoraEntry } from '@/lib/hora/hora-calculator';
import {
  PLANET_SECTORS,
  HORA_FINANCIAL_FAVORABILITY,
  PLANET_NAMES_EN,
  type HoraFavorability,
} from './constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FinancialHora {
  startTime: string;              // HH:MM
  endTime: string;                // HH:MM
  planet: number;                 // planet ID 0-8
  planetName: string;             // English
  activities: string[];
  sectors: string[];
  commodities: string[];
  favorability: HoraFavorability;
  favorabilityLabel: string;
  isCurrent: boolean;
}

// ─── Favorability labels (English) ───────────────────────────────────────────
const FAVORABILITY_LABELS: Record<HoraFavorability, string> = {
  excellent: 'Excellent for finance',
  good: 'Good for finance',
  neutral: 'Neutral — proceed with caution',
  avoid: 'Avoid financial decisions',
};

// ─── Planet-specific financial activity descriptions ─────────────────────────
const PLANET_FINANCIAL_ACTIVITIES: Record<number, string[]> = {
  0: [  // Sun
    'Approach government offices for approvals or licences',
    'Deal in gold or precious metals',
    'Make energy sector or pharma investments',
    'Seek authority for loans or grants',
  ],
  1: [  // Moon
    'Open or review liquid savings accounts',
    'Negotiate FMCG or dairy trade deals',
    'Begin a new customer relationship',
    'Travel for business or client meetings',
  ],
  2: [  // Mars
    'Defer signing new contracts — Mars hora favours action, not paperwork',
    'Physical inspections of real estate are fine',
    'Resolve disputes with courage; avoid new debt',
  ],
  3: [  // Mercury
    'Sign contracts and legal agreements',
    'Pitch ideas to investors',
    'Execute stock or commodity trades',
    'Communicate financial plans to stakeholders',
  ],
  4: [  // Jupiter
    'Apply for bank loans or credit facilities',
    'Expand investment portfolio',
    'Seek financial advice or consulting',
    'Make education or training investments',
  ],
  5: [  // Venus
    'Purchase luxury goods or vehicles',
    'Negotiate entertainment or creative contracts',
    'Review partnership financial arrangements',
    'Beauty or wellness business dealings',
  ],
  6: [  // Saturn
    'Review long-term fixed deposits or bonds',
    'Agricultural or infrastructure project planning',
    'Audit existing financial records',
    'Disciplined, methodical financial review only',
  ],
};

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Enrich an array of HoraEntry objects with financial recommendations.
 *
 * @param horas - The 24 planetary hours for the day (from hora-calculator.ts)
 */
export function computeFinancialHoras(horas: HoraEntry[]): FinancialHora[] {
  return horas.map(hora => {
    const pid = hora.planet; // 0-6 in hora (no Rahu/Ketu)
    const sectors = PLANET_SECTORS[pid];
    const favorability = HORA_FINANCIAL_FAVORABILITY[pid] ?? 'neutral';

    return {
      startTime: hora.startTime,
      endTime: hora.endTime,
      planet: pid,
      planetName: PLANET_NAMES_EN[pid] ?? String(pid),
      activities: PLANET_FINANCIAL_ACTIVITIES[pid] ?? [],
      sectors: sectors?.sectors ?? [],
      commodities: sectors?.commodities ?? [],
      favorability,
      favorabilityLabel: FAVORABILITY_LABELS[favorability],
      isCurrent: hora.isCurrent,
    };
  });
}

/**
 * Find the current financial hora, or the next upcoming one.
 */
export function getCurrentFinancialHora(
  financialHoras: FinancialHora[],
): FinancialHora | null {
  return financialHoras.find(h => h.isCurrent) ?? financialHoras[0] ?? null;
}
