/**
 * Avasthas — 5 Planetary State Systems
 * Determines HOW a planet expresses its energy based on its position.
 * Reference: BPHS Ch.44-45, Saravali Ch.5
 */

import type { PlanetPosition } from '@/types/kundali';

type Tri = { en: string; hi: string; sa: string };

export interface PlanetAvasthas {
  planetId: number;
  baladi: { state: string; name: Tri; strength: number }; // Age-based (0-100)
  jagradadi: { state: string; name: Tri; quality: 'full' | 'half' | 'quarter' }; // Wakefulness
  deeptadi: { state: string; name: Tri; luminosity: number }; // Luminosity (0-100)
  lajjitadi: { state: string; name: Tri; effect: 'benefic' | 'malefic' | 'neutral' }; // Emotional
  shayanadi: { state: string; name: Tri; activity: string }; // Activity
}

// ─── Sign lordship ──────────────────────────────────────────────────────────
const SIGN_LORD: Record<number, number> = { 1:2,2:5,3:3,4:1,5:0,6:3,7:5,8:2,9:4,10:6,11:6,12:4 };
const FRIENDS: Record<number, Set<number>> = {
  0: new Set([1,2,4]), 1: new Set([0,3]), 2: new Set([0,1,4]),
  3: new Set([0,5]), 4: new Set([0,1,2]), 5: new Set([3,6]), 6: new Set([3,5]),
};
const ENEMIES: Record<number, Set<number>> = {
  0: new Set([5,6]), 1: new Set([]), 2: new Set([3]),
  3: new Set([1]), 4: new Set([3,5]), 5: new Set([0,1]), 6: new Set([0,1,2]),
};
const EXALTATION: Record<number, number> = { 0:1,1:2,2:10,3:6,4:4,5:12,6:7 };
const DEBILITATION: Record<number, number> = { 0:7,1:8,2:4,3:12,4:10,5:6,6:1 };
const OWN: Record<number, number[]> = { 0:[5],1:[4],2:[1,8],3:[3,6],4:[9,12],5:[2,7],6:[10,11] };

// ─── 1. BALADI AVASTHA (Age-Based) ──────────────────────────────────────────
// Based on degree within sign. Odd signs: Bala→Kumara→Yuva→Vriddha→Mrita
// Even signs: Mrita→Vriddha→Yuva→Kumara→Bala (reversed)

const BALADI_NAMES: { state: string; name: Tri; strength: number }[] = [
  { state: 'bala', name: { en: 'Bala (Infant)', hi: 'बाल (शिशु)', sa: 'बालः' }, strength: 20 },
  { state: 'kumara', name: { en: 'Kumara (Youth)', hi: 'कुमार (युवक)', sa: 'कुमारः' }, strength: 40 },
  { state: 'yuva', name: { en: 'Yuva (Adult)', hi: 'युवा (वयस्क)', sa: 'युवा' }, strength: 100 },
  { state: 'vriddha', name: { en: 'Vriddha (Old)', hi: 'वृद्ध (बुजुर्ग)', sa: 'वृद्धः' }, strength: 50 },
  { state: 'mrita', name: { en: 'Mrita (Dead)', hi: 'मृत (मृतक)', sa: 'मृतः' }, strength: 5 },
];

function getBaladi(degInSign: number, sign: number): typeof BALADI_NAMES[0] {
  const sector = Math.floor(degInSign / 6); // 5 sectors of 6° each
  const idx = Math.min(sector, 4);
  const isOdd = sign % 2 === 1;
  return BALADI_NAMES[isOdd ? idx : 4 - idx];
}

// ─── 2. JAGRADADI AVASTHA (Wakefulness) ─────────────────────────────────────
// Own/exalted sign = Jagrat (awake, full power)
// Friend's sign = Swapna (dreaming, half power)
// Enemy/neutral/debilitated = Sushupta (deep sleep, quarter power)

const JAGRADADI: Record<string, { name: Tri; quality: 'full' | 'half' | 'quarter' }> = {
  jagrat: { name: { en: 'Jagrat (Awake)', hi: 'जागृत (जागा)', sa: 'जाग्रत्' }, quality: 'full' },
  swapna: { name: { en: 'Swapna (Dreaming)', hi: 'स्वप्न (सपना)', sa: 'स्वप्नः' }, quality: 'half' },
  sushupta: { name: { en: 'Sushupta (Deep Sleep)', hi: 'सुषुप्त (गहरी नींद)', sa: 'सुषुप्तः' }, quality: 'quarter' },
};

function getJagradadi(pid: number, sign: number): { state: string } & typeof JAGRADADI['jagrat'] {
  if (pid >= 7) return { state: 'sushupta', ...JAGRADADI.sushupta };
  const lord = SIGN_LORD[sign];
  if ((OWN[pid] || []).includes(sign) || EXALTATION[pid] === sign) return { state: 'jagrat', ...JAGRADADI.jagrat };
  if (FRIENDS[pid]?.has(lord)) return { state: 'swapna', ...JAGRADADI.swapna };
  return { state: 'sushupta', ...JAGRADADI.sushupta };
}

// ─── 3. DEEPTADI AVASTHA (Luminosity) ───────────────────────────────────────
// Based on dignity + motion + conjunction + aspects

const DEEPTADI_NAMES: Record<string, { name: Tri; luminosity: number }> = {
  deepta: { name: { en: 'Deepta (Blazing)', hi: 'दीप्त (प्रज्वलित)', sa: 'दीप्तः' }, luminosity: 100 },
  swastha: { name: { en: 'Swastha (Healthy)', hi: 'स्वस्थ', sa: 'स्वस्थः' }, luminosity: 85 },
  mudita: { name: { en: 'Mudita (Joyful)', hi: 'मुदित (प्रसन्न)', sa: 'मुदितः' }, luminosity: 70 },
  shanta: { name: { en: 'Shanta (Peaceful)', hi: 'शान्त', sa: 'शान्तः' }, luminosity: 55 },
  shakta: { name: { en: 'Shakta (Powerful)', hi: 'शक्त (बलवान)', sa: 'शक्तः' }, luminosity: 60 },
  dina: { name: { en: 'Dina (Weak)', hi: 'दीन (दुर्बल)', sa: 'दीनः' }, luminosity: 30 },
  vikala: { name: { en: 'Vikala (Afflicted)', hi: 'विकल (पीड़ित)', sa: 'विकलः' }, luminosity: 20 },
  khala: { name: { en: 'Khala (Wicked)', hi: 'खल (नीच)', sa: 'खलः' }, luminosity: 10 },
  bhita: { name: { en: 'Bhita (Frightened)', hi: 'भीत (भयभीत)', sa: 'भीतः' }, luminosity: 15 },
};

function getDeeptadi(p: PlanetPosition, allPlanets: PlanetPosition[]): { state: string } & typeof DEEPTADI_NAMES['deepta'] {
  const pid = p.planet.id;
  if (pid >= 7) return { state: 'dina', ...DEEPTADI_NAMES.dina };

  if (p.isExalted) return { state: 'deepta', ...DEEPTADI_NAMES.deepta };
  if (p.isOwnSign) return { state: 'swastha', ...DEEPTADI_NAMES.swastha };
  if (p.isDebilitated) return { state: 'khala', ...DEEPTADI_NAMES.khala };
  if (p.isRetrograde) return { state: 'shakta', ...DEEPTADI_NAMES.shakta };
  if (p.isCombust) return { state: 'dina', ...DEEPTADI_NAMES.dina };

  // Check if in friend's sign
  const lord = SIGN_LORD[p.sign];
  if (FRIENDS[pid]?.has(lord)) return { state: 'mudita', ...DEEPTADI_NAMES.mudita };
  if (ENEMIES[pid]?.has(lord)) return { state: 'vikala', ...DEEPTADI_NAMES.vikala };

  // Check planetary war (within 1° of another planet)
  const inWar = allPlanets.some(other =>
    other.planet.id !== pid && other.planet.id < 7 &&
    Math.abs(p.longitude - other.longitude) < 1
  );
  if (inWar) return { state: 'bhita', ...DEEPTADI_NAMES.bhita };

  return { state: 'shanta', ...DEEPTADI_NAMES.shanta };
}

// ─── 4. LAJJITADI AVASTHA (Emotional States — BPHS Ch.45) ──────────────────
// Based on house position + specific conjunctions

const LAJJITADI_NAMES: Record<string, { name: Tri; effect: 'benefic' | 'malefic' | 'neutral' }> = {
  lajjita: { name: { en: 'Lajjita (Ashamed)', hi: 'लज्जित (शर्मिन्दा)', sa: 'लज्जितः' }, effect: 'malefic' },
  garvita: { name: { en: 'Garvita (Proud)', hi: 'गर्वित (गौरवान्वित)', sa: 'गर्वितः' }, effect: 'benefic' },
  kshudita: { name: { en: 'Kshudita (Hungry)', hi: 'क्षुधित (भूखा)', sa: 'क्षुधितः' }, effect: 'malefic' },
  trushita: { name: { en: 'Trushita (Thirsty)', hi: 'तृषित (प्यासा)', sa: 'तृषितः' }, effect: 'malefic' },
  mudita: { name: { en: 'Mudita (Delighted)', hi: 'मुदित (आनन्दित)', sa: 'मुदितः' }, effect: 'benefic' },
};

function getLajjitadi(p: PlanetPosition, allPlanets: PlanetPosition[]): { state: string } & typeof LAJJITADI_NAMES['mudita'] {
  const pid = p.planet.id;
  if (pid >= 7) return { state: 'mudita', ...LAJJITADI_NAMES.mudita };

  const house = p.house;

  // Lajjita: in 5th house conjunct Rahu/Ketu/Saturn
  if (house === 5) {
    const conjunct = allPlanets.filter(o => o.house === 5 && (o.planet.id === 6 || o.planet.id === 7 || o.planet.id === 8));
    if (conjunct.length > 0) return { state: 'lajjita', ...LAJJITADI_NAMES.lajjita };
  }

  // Garvita: in exaltation or moolatrikona
  if (p.isExalted || p.isOwnSign) return { state: 'garvita', ...LAJJITADI_NAMES.garvita };

  // Kshudita: in enemy sign conjunct enemy
  const lord = SIGN_LORD[p.sign];
  if (ENEMIES[pid]?.has(lord)) {
    const enemyConjunct = allPlanets.some(o => o.house === house && ENEMIES[pid]?.has(o.planet.id));
    if (enemyConjunct) return { state: 'kshudita', ...LAJJITADI_NAMES.kshudita };
  }

  // Trushita: in water sign aspected by no benefic
  const waterSigns = new Set([4, 8, 12]);
  if (waterSigns.has(p.sign)) return { state: 'trushita', ...LAJJITADI_NAMES.trushita };

  // Default: Mudita (delighted)
  return { state: 'mudita', ...LAJJITADI_NAMES.mudita };
}

// ─── 5. SHAYANADI AVASTHA (Activity States — BPHS Ch.45) ────────────────────
// 12 states based on planet + sign + degree combinations

const SHAYANADI_NAMES: Tri[] = [
  { en: 'Shayana (Resting)', hi: 'शयन (विश्राम)', sa: 'शयनम्' },
  { en: 'Upavesha (Sitting)', hi: 'उपवेश (बैठना)', sa: 'उपवेशः' },
  { en: 'Netrapani (Gazing)', hi: 'नेत्रपाणि (देखना)', sa: 'नेत्रपाणिः' },
  { en: 'Prakash (Shining)', hi: 'प्रकाश (चमकना)', sa: 'प्रकाशः' },
  { en: 'Gamana (Moving)', hi: 'गमन (चलना)', sa: 'गमनम्' },
  { en: 'Agamana (Arriving)', hi: 'आगमन (आना)', sa: 'आगमनम्' },
  { en: 'Sabha (In Assembly)', hi: 'सभा (सभा में)', sa: 'सभा' },
  { en: 'Agama (Approaching)', hi: 'आगम (पहुँचना)', sa: 'आगमः' },
  { en: 'Bhojana (Eating)', hi: 'भोजन (खाना)', sa: 'भोजनम्' },
  { en: 'Nritya Lipsa (Dancing)', hi: 'नृत्य लिप्सा (नाचना)', sa: 'नृत्यलिप्सा' },
  { en: 'Kautuka (Curious)', hi: 'कौतुक (जिज्ञासु)', sa: 'कौतुकम्' },
  { en: 'Nidraa (Sleeping)', hi: 'निद्रा (सोना)', sa: 'निद्रा' },
];

function getShayanadi(p: PlanetPosition): { state: string; name: Tri; activity: string } {
  // Simplified: based on degree within sign mod 12
  const degInSign = p.longitude % 30;
  const idx = Math.floor(degInSign / 2.5) % 12;
  const sn = SHAYANADI_NAMES[idx];
  return { state: sn.en.split(' ')[0].toLowerCase(), name: sn, activity: sn.en };
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────

export function calculateAvasthas(planets: PlanetPosition[]): PlanetAvasthas[] {
  return planets.filter(p => p.planet.id < 9).map(p => {
    const degInSign = p.longitude % 30;
    const baladi = getBaladi(degInSign, p.sign);
    const jagradadi = getJagradadi(p.planet.id, p.sign);
    const deeptadi = getDeeptadi(p, planets);
    const lajjitadi = getLajjitadi(p, planets);
    const shayanadi = getShayanadi(p);

    return {
      planetId: p.planet.id,
      baladi: { state: baladi.state, name: baladi.name, strength: baladi.strength },
      jagradadi: { state: jagradadi.state, name: jagradadi.name, quality: jagradadi.quality },
      deeptadi: { state: deeptadi.state, name: deeptadi.name, luminosity: deeptadi.luminosity },
      lajjitadi: { state: lajjitadi.state, name: lajjitadi.name, effect: lajjitadi.effect },
      shayanadi: { state: shayanadi.state, name: shayanadi.name, activity: shayanadi.activity },
    };
  });
}
