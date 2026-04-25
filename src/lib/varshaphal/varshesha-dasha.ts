/**
 * Varshesha Dasha — Year Lord-based annual planetary periods
 *
 * Divides 365.25 days proportionally based on the Year Lord's natural
 * planetary relationships. The Year Lord's own period is largest; friend
 * periods are next; neutral and enemy periods are reduced.
 *
 * Classical basis: Tajika Shastra (Neelakantha / Somanatha), where the
 * Varsheshvara governs the year and allocates sub-periods by friendship.
 *
 * Date arithmetic: all date computation uses milliseconds (Lesson P).
 */

import type { LocaleText } from '@/types/panchang';

// ─── Planetary friendship table (BPHS Ch.3, canonical from Lesson S) ──────────
// 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
//
// Moon's friends: Sun, Mercury — NOT Jupiter. Moon has NO natural enemies. (Lesson S)
// Jupiter's enemies: Mercury, Venus — NOT Saturn. Saturn is neutral.
// Mercury's friends: Sun, Venus — NOT Moon/Jupiter/Saturn.
const FRIENDS: Record<number, number[]> = {
  0: [1, 4, 2],          // Sun: Moon, Jupiter, Mars
  1: [0, 3],             // Moon: Sun, Mercury (no natural enemies)
  2: [0, 4, 1],          // Mars: Sun, Jupiter, Moon
  3: [0, 5],             // Mercury: Sun, Venus
  4: [0, 1, 2],          // Jupiter: Sun, Moon, Mars
  5: [3, 6],             // Venus: Mercury, Saturn
  6: [5, 3],             // Saturn: Venus, Mercury
  7: [5, 6],             // Rahu: Venus, Saturn (by convention)
  8: [2, 4],             // Ketu: Mars, Jupiter (by convention)
};

const ENEMIES: Record<number, number[]> = {
  0: [5, 6],             // Sun: Venus, Saturn
  1: [],                 // Moon: no natural enemies
  2: [3, 5, 6],          // Mars: Mercury, Venus, Saturn
  3: [1, 4],             // Mercury: Moon, Jupiter (debatable, but canonical)
  4: [3, 5],             // Jupiter: Mercury, Venus
  5: [0, 1],             // Venus: Sun, Moon
  6: [0, 1, 2],          // Saturn: Sun, Moon, Mars
  7: [0, 1, 2],          // Rahu: Sun, Moon, Mars
  8: [0, 1, 5],          // Ketu: Sun, Moon, Venus
};

type Relationship = 'self' | 'friend' | 'neutral' | 'enemy';

function getRelationship(lord: number, other: number): Relationship {
  if (lord === other) return 'self';
  if (FRIENDS[lord]?.includes(other)) return 'friend';
  if (ENEMIES[lord]?.includes(other)) return 'enemy';
  return 'neutral';
}

// ─── Period weights per relationship ──────────────────────────────────────────
// Total weight = 9 planets, distributed so self > friend > neutral > enemy.
// These weights are proportional, not absolute.
const RELATIONSHIP_WEIGHT: Record<Relationship, number> = {
  self:    4.0,
  friend:  2.0,
  neutral: 1.0,
  enemy:   0.5,
};

const ALL_PLANETS = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Sun → Ketu

const PLANET_NAMES: Record<number, LocaleText> = {
  0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', bn: 'সূর্য' },
  1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', bn: 'চন্দ্র' },
  2: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்', bn: 'মঙ্গল' },
  3: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', ta: 'புதன்', bn: 'বুধ' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', ta: 'குரு', bn: 'বৃহস্পতি' },
  5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்', bn: 'শুক্র' },
  6: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', ta: 'சனி', bn: 'শনি' },
  7: { en: 'Rahu', hi: 'राहु', sa: 'राहुः', ta: 'ராகு', bn: 'রাহু' },
  8: { en: 'Ketu', hi: 'केतु', sa: 'केतुः', ta: 'கேது', bn: 'কেতু' },
};

export interface VarsheshaDashaPeriod {
  planetId: number;
  planet: string;
  planetName: LocaleText;
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  days: number;
  relationship: Relationship;
}

/**
 * Compute Varshesha Dasha periods for the Varshaphal year.
 *
 * @param yearLordId       Planet ID (0-8) of the Varsheshvara
 * @param solarReturnDate  ISO date-string or Date of the annual solar return
 */
export function computeVarsheshaDasha(
  yearLordId: number,
  solarReturnDate: string | Date,
): VarsheshaDashaPeriod[] {
  const YEAR_DAYS = 365.25;

  // Compute total weight across all 9 planets
  const weights = ALL_PLANETS.map(pid => ({
    pid,
    rel: getRelationship(yearLordId, pid),
    w: RELATIONSHIP_WEIGHT[getRelationship(yearLordId, pid)],
  }));

  const totalWeight = weights.reduce((sum, x) => sum + x.w, 0);

  // Sort: self first, then friends, then neutral, then enemies.
  // Within same relationship, keep canonical planet order.
  const ORDER: Relationship[] = ['self', 'friend', 'neutral', 'enemy'];
  const sorted = [...weights].sort((a, b) => {
    const oa = ORDER.indexOf(a.rel);
    const ob = ORDER.indexOf(b.rel);
    if (oa !== ob) return oa - ob;
    return a.pid - b.pid;
  });

  // Build periods using ms arithmetic (Lesson P)
  const srTime = typeof solarReturnDate === 'string'
    ? new Date(solarReturnDate).getTime()
    : solarReturnDate.getTime();

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const periods: VarsheshaDashaPeriod[] = [];
  let cursor = srTime;

  for (const { pid, rel, w } of sorted) {
    const days = (w / totalWeight) * YEAR_DAYS;
    const endTime = cursor + days * MS_PER_DAY;

    periods.push({
      planetId: pid,
      planet: PLANET_NAMES[pid].en,
      planetName: PLANET_NAMES[pid],
      startDate: msToIsoDate(cursor),
      endDate: msToIsoDate(endTime),
      days: Math.round(days),
      relationship: rel,
    });

    cursor = endTime;
  }

  return periods;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function msToIsoDate(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
