/**
 * Complete reference table of all 150 Nadi divisions.
 *
 * Each zodiac sign (30°) is divided into 150 equal parts of 0.2° (12 arc-minutes).
 * The 150 Nadis cycle through the 12 signs 12.5 times:
 *   - For ODD signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius): forward Aries→Pisces
 *   - For EVEN signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces): reverse Pisces→Aries
 */

export interface NadiInfo {
  number: number;           // 1-150
  signForward: number;      // D-150 sign for odd signs (1-12, cycling Aries→Pisces)
  signReverse: number;      // D-150 sign for even signs (12-1, cycling Pisces→Aries)
  group: number;            // which 12-Nadi cycle (1-13; group 13 is partial with 6 entries)
  positionInGroup: number;  // 1-12 within the group (group 13 only has 1-6)
  degreeStart: number;      // starting degree within the sign (0.00-29.80)
  degreeEnd: number;        // ending degree within the sign (0.20-30.00)
  element: 'fire' | 'earth' | 'air' | 'water'; // element of the forward-mapped sign
  quality: string;          // brief karmic quality based on position within the 12-Nadi group
}

// ─── Position-in-group karmic qualities ────────────────────────────────────
const POSITION_QUALITIES: Record<number, { element: 'fire' | 'earth' | 'air' | 'water'; quality: string }> = {
  1:  { element: 'fire',  quality: 'Initiatory — new karmic beginnings, pioneering energy' },
  2:  { element: 'earth', quality: 'Stabilizing — grounding past-life patterns into material form' },
  3:  { element: 'air',   quality: 'Communicative — karmic lessons through intellect and duality' },
  4:  { element: 'water', quality: 'Nurturing — emotional karma, maternal bonds, home' },
  5:  { element: 'fire',  quality: 'Expressive — creative karma, leadership from past lives' },
  6:  { element: 'earth', quality: 'Analytical — karma of service, healing, discrimination' },
  7:  { element: 'air',   quality: 'Relational — partnership karma, balance, justice' },
  8:  { element: 'water', quality: 'Transformative — deep karmic debts, occult, regeneration' },
  9:  { element: 'fire',  quality: 'Philosophical — dharmic karma, teaching, long journeys' },
  10: { element: 'earth', quality: 'Structural — authority karma, discipline, public duty' },
  11: { element: 'air',   quality: 'Humanitarian — collective karma, innovation, liberation' },
  12: { element: 'water', quality: 'Dissolving — release karma, spirituality, moksha' },
};

// ─── Group-level descriptions ──────────────────────────────────────────────
export const NADI_GROUP_DESCRIPTIONS: { group: number; range: string; description: string }[] = [
  { group: 1,  range: '1-12',    description: 'First breath — the soul\'s initial impulse in this sign' },
  { group: 2,  range: '13-24',   description: 'Building — establishing karmic foundations' },
  { group: 3,  range: '25-36',   description: 'Testing — karmic challenges and growth' },
  { group: 4,  range: '37-48',   description: 'Deepening — integrating lessons from early cycles' },
  { group: 5,  range: '49-60',   description: 'Expression — manifesting karmic patterns outwardly' },
  { group: 6,  range: '61-72',   description: 'Reflection — midpoint review of soul progress' },
  { group: 7,  range: '73-84',   description: 'Transformation — shedding outdated karmic skin' },
  { group: 8,  range: '85-96',   description: 'Mastery — developing expertise from past-life seeds' },
  { group: 9,  range: '97-108',  description: 'Service — applying accumulated wisdom to help others' },
  { group: 10, range: '109-120', description: 'Authority — wielding karmic power responsibly' },
  { group: 11, range: '121-132', description: 'Liberation — releasing attachment to results' },
  { group: 12, range: '133-144', description: 'Culmination — completing the major karmic arc' },
  { group: 13, range: '145-150', description: 'Transition — bridging to the next sign\'s karma' },
];

// ─── Generate all 150 Nadi entries ─────────────────────────────────────────
function generateNadiTable(): NadiInfo[] {
  const table: NadiInfo[] = [];
  for (let n = 1; n <= 150; n++) {
    const signForward = ((n - 1) % 12) + 1;         // 1-12, cycling Aries→Pisces
    const signReverse = 12 - ((n - 1) % 12);         // 12-1, cycling Pisces→Aries
    const group = Math.floor((n - 1) / 12) + 1;      // 1-13
    const positionInGroup = ((n - 1) % 12) + 1;      // 1-12
    const degreeStart = ((n - 1) * 0.2);              // 0.00-29.80
    const degreeEnd = (n * 0.2);                      // 0.20-30.00
    const posData = POSITION_QUALITIES[positionInGroup];

    table.push({
      number: n,
      signForward,
      signReverse,
      group,
      positionInGroup,
      degreeStart: Math.round(degreeStart * 100) / 100, // avoid float drift
      degreeEnd: Math.round(degreeEnd * 100) / 100,
      element: posData.element,
      quality: posData.quality,
    });
  }
  return table;
}

/** Complete table of all 150 Nadi divisions. */
export const NADI_TABLE: NadiInfo[] = generateNadiTable();

/** Look up a single Nadi by number (1-150). */
export function getNadiInfo(nadiNumber: number): NadiInfo | undefined {
  if (nadiNumber < 1 || nadiNumber > 150) return undefined;
  return NADI_TABLE[nadiNumber - 1];
}
