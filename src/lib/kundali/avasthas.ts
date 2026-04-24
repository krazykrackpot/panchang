import type { LocaleText } from '@/types/panchang';
/**
 * Avasthas — 5 Planetary State Systems
 * Determines HOW a planet expresses its energy based on its position.
 * Reference: BPHS Ch.44-45, Phala Deepika Ch.15, Saravali Ch.5
 */

import type { PlanetPosition } from '@/types/kundali';

type Tri = LocaleText;

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
const OWN: Record<number, number[]> = { 0:[5],1:[4],2:[1,8],3:[3,6],4:[9,12],5:[2,7],6:[10,11] };

// ─── 1. BALADI AVASTHA (Age-Based) — BPHS Ch.44 ─────────────────────────────
// Each sign divided into 5 sectors of 6° each.
// Odd signs: Bala→Kumara→Yuva→Vriddha→Mrita
// Even signs: Mrita→Vriddha→Yuva→Kumara→Bala (reversed)

const BALADI_NAMES: { state: string; name: Tri; strength: number }[] = [
  { state: 'bala',    name: { en: 'Bala (Infant)',  hi: 'बाल (शिशु)',    sa: 'बालः'    }, strength: 20  },
  { state: 'kumara',  name: { en: 'Kumara (Youth)', hi: 'कुमार (युवक)',  sa: 'कुमारः'  }, strength: 40  },
  { state: 'yuva',    name: { en: 'Yuva (Adult)',   hi: 'युवा (वयस्क)',  sa: 'युवा'    }, strength: 100 },
  { state: 'vriddha', name: { en: 'Vriddha (Old)',  hi: 'वृद्ध (बुजुर्ग)', sa: 'वृद्धः' }, strength: 50  },
  { state: 'mrita',   name: { en: 'Mrita (Dead)',   hi: 'मृत (मृतक)',    sa: 'मृतः'    }, strength: 5   },
];

function getBaladi(degInSign: number, sign: number): typeof BALADI_NAMES[0] {
  const sector = Math.min(Math.floor(degInSign / 6), 4);
  const isOdd = sign % 2 === 1;
  return BALADI_NAMES[isOdd ? sector : 4 - sector];
}

// ─── 2. JAGRADADI AVASTHA (Wakefulness) — BPHS Ch.44 ────────────────────────
// Exalted or own sign = Jagrat (Awake, full power)
// Friend's sign = Swapna (Dreaming, half power)
// Neutral / enemy / combust = Sushupta (Deep sleep, quarter power)

const JAGRADADI: Record<string, { name: Tri; quality: 'full' | 'half' | 'quarter' }> = {
  jagrat:   { name: { en: 'Jagrat (Awake)',       hi: 'जागृत (जागा)',      sa: 'जाग्रत्'  }, quality: 'full'    },
  swapna:   { name: { en: 'Swapna (Dreaming)',    hi: 'स्वप्न (सपना)',      sa: 'स्वप्नः'  }, quality: 'half'    },
  sushupta: { name: { en: 'Sushupta (Deep Sleep)', hi: 'सुषुप्त (गहरी नींद)', sa: 'सुषुप्तः' }, quality: 'quarter' },
};

function getJagradadi(pid: number, sign: number): { state: string } & typeof JAGRADADI['jagrat'] {
  // Rahu/Ketu — always Sushupta (they have no own signs in Parashara system)
  if (pid >= 7) return { state: 'sushupta', ...JAGRADADI.sushupta };
  // Own sign or exaltation → Jagrat
  if ((OWN[pid] || []).includes(sign) || EXALTATION[pid] === sign) return { state: 'jagrat', ...JAGRADADI.jagrat };
  // Friend's sign → Swapna
  const lord = SIGN_LORD[sign];
  if (FRIENDS[pid]?.has(lord)) return { state: 'swapna', ...JAGRADADI.swapna };
  // Neutral / enemy → Sushupta
  return { state: 'sushupta', ...JAGRADADI.sushupta };
}

// ─── 3. DEEPTADI AVASTHA (Luminosity) — BPHS Ch.44 ─────────────────────────
// 9 states in descending strength order:
// Deepta > Swastha > Mudita > Shanta > Dina > Dukhita > Vikala > Khala
//
// Key rules (per BPHS):
// - Sun and Moon do NOT participate in graha yuddha (planetary war)
// - Only tara planets (Mars/Mercury/Jupiter/Venus/Saturn, ids 2-6) can have Khala from war
// - Combust = Vikala (not Dina)
// - Enemy sign = Dina (not Vikala)
// - Debilitated = Dukhita
// - War loser = Khala

const DEEPTADI_NAMES: Record<string, { name: Tri; luminosity: number }> = {
  deepta:   { name: { en: 'Deepta (Blazing)',    hi: 'दीप्त (प्रज्वलित)', sa: 'दीप्तः'  }, luminosity: 100 },
  swastha:  { name: { en: 'Swastha (Healthy)',   hi: 'स्वस्थ',             sa: 'स्वस्थः' }, luminosity: 85  },
  mudita:   { name: { en: 'Mudita (Joyful)',     hi: 'मुदित (प्रसन्न)',    sa: 'मुदितः'  }, luminosity: 70  },
  shanta:   { name: { en: 'Shanta (Peaceful)',   hi: 'शान्त',               sa: 'शान्तः'  }, luminosity: 55  },
  dina:     { name: { en: 'Dina (Weak)',         hi: 'दीन (दुर्बल)',       sa: 'दीनः'    }, luminosity: 30  },
  dukhita:  { name: { en: 'Dukhita (Suffering)', hi: 'दुखित (पीड़ित)',      sa: 'दुखितः'  }, luminosity: 20  },
  vikala:   { name: { en: 'Vikala (Afflicted)',  hi: 'विकल (दग्ध)',        sa: 'विकलः'   }, luminosity: 15  },
  khala:    { name: { en: 'Khala (Wicked)',      hi: 'खल (पराजित)',        sa: 'खलः'     }, luminosity: 10  },
};

function getDeeptadi(p: PlanetPosition, allPlanets: PlanetPosition[]): { state: string } & typeof DEEPTADI_NAMES['deepta'] {
  const pid = p.planet.id;

  // Rahu/Ketu — always Dina
  if (pid >= 7) return { state: 'dina', ...DEEPTADI_NAMES.dina };

  // Exaltation → Deepta
  if (p.isExalted) return { state: 'deepta', ...DEEPTADI_NAMES.deepta };

  // Own sign → Swastha
  if (p.isOwnSign) return { state: 'swastha', ...DEEPTADI_NAMES.swastha };

  // Debilitation → Dukhita
  if (p.isDebilitated) return { state: 'dukhita', ...DEEPTADI_NAMES.dukhita };

  // Combust (within Sun's rays) → Vikala
  // Note: checked BEFORE planetary war since combustion is stronger affliction
  if (p.isCombust) return { state: 'vikala', ...DEEPTADI_NAMES.vikala };

  // Graha yuddha (planetary war, within 1°) → Khala for the loser
  // ONLY tara planets (Mars=2, Mercury=3, Jupiter=4, Venus=5, Saturn=6) participate.
  // Sun (0) and Moon (1) do NOT participate in graha yuddha per BPHS.
  //
  // NOTE: Winner is determined by absolute ecliptic latitude (lower wins).
  // When Swiss Ephemeris is unavailable, latitudes come from Meeus simplified
  // perturbation (~0.5° error possible). A warning is surfaced via KundaliData.warnings.
  if (pid >= 2 && pid <= 6) {
    const warRival = allPlanets.find(other =>
      other.planet.id !== pid &&
      other.planet.id >= 2 && other.planet.id <= 6 &&
      Math.abs(p.longitude - other.longitude) < 1
    );
    if (warRival) {
      // The loser in war = the planet farther from the ecliptic (higher absolute latitude)
      // per BPHS Ch.28. If equal, the planet with less longitude loses.
      const isLoser =
        Math.abs(p.latitude) > Math.abs(warRival.latitude) ||
        (Math.abs(p.latitude) === Math.abs(warRival.latitude) && p.longitude < warRival.longitude);
      if (isLoser) return { state: 'khala', ...DEEPTADI_NAMES.khala };
      // The winner stays at its dignity-based state — fall through to sign check
    }
  }

  // Friend's/enemy's sign
  const lord = SIGN_LORD[p.sign];
  if (FRIENDS[pid]?.has(lord)) return { state: 'mudita', ...DEEPTADI_NAMES.mudita };
  if (ENEMIES[pid]?.has(lord)) return { state: 'dina',   ...DEEPTADI_NAMES.dina   };

  // Neutral sign → Shanta
  return { state: 'shanta', ...DEEPTADI_NAMES.shanta };
}

// ─── 4. LAJJITADI AVASTHA (Emotional States) — BPHS Ch.45 ──────────────────
// 6 states based on house position + conjunctions + aspects

const LAJJITADI_NAMES: Record<string, { name: Tri; effect: 'benefic' | 'malefic' | 'neutral' }> = {
  lajjita:   { name: { en: 'Lajjita (Ashamed)',    hi: 'लज्जित (शर्मिन्दा)',   sa: 'लज्जितः'   }, effect: 'malefic' },
  garvita:   { name: { en: 'Garvita (Proud)',       hi: 'गर्वित (गौरवान्वित)', sa: 'गर्वितः'   }, effect: 'benefic' },
  kshudita:  { name: { en: 'Kshudita (Hungry)',     hi: 'क्षुधित (भूखा)',       sa: 'क्षुधितः'  }, effect: 'malefic' },
  trushita:  { name: { en: 'Trushita (Thirsty)',    hi: 'तृषित (प्यासा)',       sa: 'तृषितः'    }, effect: 'malefic' },
  mudita:    { name: { en: 'Mudita (Delighted)',     hi: 'मुदित (आनन्दित)',      sa: 'मुदितः'    }, effect: 'benefic' },
  kshobhita: { name: { en: 'Kshobhita (Agitated)', hi: 'क्षोभित (अशान्त)',      sa: 'क्षोभितः'  }, effect: 'malefic' },
};

const BENEFIC_IDS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
const MALEFIC_IDS = new Set([0, 2, 6, 7, 8]); // Sun, Mars, Saturn, Rahu, Ketu

function hasAspectFromBenefic(p: PlanetPosition, allPlanets: PlanetPosition[]): boolean {
  // Simplified aspect check: planets in trine (5th/9th), opposition (7th), or conjunction (same house)
  for (const other of allPlanets) {
    if (other.planet.id === p.planet.id) continue;
    if (!BENEFIC_IDS.has(other.planet.id)) continue;
    const diff = ((other.house - p.house + 12) % 12) + 1; // 1-12
    if (diff === 1 || diff === 5 || diff === 7 || diff === 9) return true;
  }
  return false;
}

function hasAspectFromMalefic(p: PlanetPosition, allPlanets: PlanetPosition[]): boolean {
  for (const other of allPlanets) {
    if (other.planet.id === p.planet.id) continue;
    if (!MALEFIC_IDS.has(other.planet.id)) continue;
    const diff = ((other.house - p.house + 12) % 12) + 1;
    if (diff === 1 || diff === 4 || diff === 7 || diff === 8 || diff === 10) return true;
  }
  return false;
}

function getLajjitadi(p: PlanetPosition, allPlanets: PlanetPosition[]): { state: string } & typeof LAJJITADI_NAMES['mudita'] {
  const pid = p.planet.id;
  const house = p.house;

  // Rahu/Ketu — always Mudita (they don't have emotional states in BPHS)
  if (pid >= 7) return { state: 'mudita', ...LAJJITADI_NAMES.mudita };

  // 1. Lajjita (Ashamed): In 5th house conjunct Saturn, Rahu, or Ketu
  if (house === 5) {
    const maleficIn5th = allPlanets.some(o =>
      o.house === 5 && o.planet.id !== pid &&
      (o.planet.id === 6 || o.planet.id === 7 || o.planet.id === 8)
    );
    if (maleficIn5th) return { state: 'lajjita', ...LAJJITADI_NAMES.lajjita };
  }

  // 2. Garvita (Proud): Exaltation or own sign
  if (p.isExalted || p.isOwnSign) return { state: 'garvita', ...LAJJITADI_NAMES.garvita };

  // 3. Kshobhita (Agitated): Combust (within Sun's orb) or conjunct malefic + aspected by enemy
  if (p.isCombust && pid !== 0) return { state: 'kshobhita', ...LAJJITADI_NAMES.kshobhita };
  if (allPlanets.some(o => o.house === house && o.planet.id !== pid && MALEFIC_IDS.has(o.planet.id))
      && hasAspectFromMalefic(p, allPlanets)) {
    return { state: 'kshobhita', ...LAJJITADI_NAMES.kshobhita };
  }

  // 4. Kshudita (Hungry): In enemy's sign, OR conjunct enemy, OR aspected by enemy (no benefic aspect)
  const lord = SIGN_LORD[p.sign];
  const inEnemySign = ENEMIES[pid]?.has(lord);
  const conjunctEnemy = allPlanets.some(o => o.house === house && o.planet.id !== pid && ENEMIES[pid]?.has(o.planet.id));
  if ((inEnemySign || conjunctEnemy) && !hasAspectFromBenefic(p, allPlanets)) {
    return { state: 'kshudita', ...LAJJITADI_NAMES.kshudita };
  }

  // 5. Trushita (Thirsty): In water sign (Cancer=4, Scorpio=8, Pisces=12),
  //    aspected by malefic, and NOT aspected by any benefic
  const waterSigns = new Set([4, 8, 12]);
  if (waterSigns.has(p.sign) && hasAspectFromMalefic(p, allPlanets) && !hasAspectFromBenefic(p, allPlanets)) {
    return { state: 'trushita', ...LAJJITADI_NAMES.trushita };
  }

  // 6. Mudita (Delighted): In friend's sign, or aspected by benefic Jupiter/Venus
  // Default — most planets that don't meet above conditions are content
  return { state: 'mudita', ...LAJJITADI_NAMES.mudita };
}

// ─── 5. SHAYANADI AVASTHA (Activity States) — BPHS Ch.45 / Phala Deepika ───
// 12 states determined by the planet's navamsha position (1-9) within its natal sign
// and whether the sign is Movable (Chara), Fixed (Sthira), or Dual (Dwiswabhava).
//
// Navamsha number = floor(degInSign * 9 / 30) + 1 (giving 1-9)
// Sign types: Movable=Aries(1),Cancer(4),Libra(7),Capricorn(10)
//             Fixed=Taurus(2),Leo(5),Scorpio(8),Aquarius(11)
//             Dual=Gemini(3),Virgo(6),Sagittarius(9),Pisces(12)

const SHAYANADI_NAMES: Tri[] = [
  /* 0 */  { en: 'Shayana (Resting)',     hi: 'शयन (विश्राम)',     sa: 'शयनम्'       },
  /* 1 */  { en: 'Upavesha (Sitting)',    hi: 'उपवेश (बैठना)',      sa: 'उपवेशः'      },
  /* 2 */  { en: 'Netrapani (Gazing)',    hi: 'नेत्रपाणि (देखना)',  sa: 'नेत्रपाणिः'  },
  /* 3 */  { en: 'Agama (Approaching)',   hi: 'आगम (पहुँचना)',      sa: 'आगमः'        },
  /* 4 */  { en: 'Sabha (In Assembly)',   hi: 'सभा (सभा में)',      sa: 'सभा'         },
  /* 5 */  { en: 'Agamana (Arriving)',    hi: 'आगमन (आना)',         sa: 'आगमनम्'      },
  /* 6 */  { en: 'Gamana (Moving)',       hi: 'गमन (चलना)',         sa: 'गमनम्'       },
  /* 7 */  { en: 'Bhojana (Eating)',      hi: 'भोजन (खाना)',        sa: 'भोजनम्'      },
  /* 8 */  { en: 'Nritya Lipsa (Dancing)',hi: 'नृत्य लिप्सा (नाचना)', sa: 'नृत्यलिप्सा' },
  /* 9 */  { en: 'Kautuka (Curious)',     hi: 'कौतुक (जिज्ञासु)',   sa: 'कौतुकम्'     },
  /* 10 */ { en: 'Nidraa (Sleeping)',     hi: 'निद्रा (सोना)',       sa: 'निद्रा'       },
  /* 11 */ { en: 'Prakash (Shining)',     hi: 'प्रकाश (चमकना)',     sa: 'प्रकाशः'     },
];

// Index into SHAYANADI_NAMES for each navamsha 0-8 (navamsha - 1) by sign type
// Based on BPHS Ch.45 and Phala Deepika Ch.15 classical references
const SHAYANADI_TABLE: Record<'chara' | 'sthira' | 'dual', number[]> = {
  //               nav: 1   2   3   4   5   6   7   8   9
  chara:               [0,  1,  2,  3,  4,  5,  6,  7,  8],  // Shayana→…→Nritya Lipsa
  sthira:              [10, 7,  9,  8,  5,  6,  3,  4,  2],  // Nidraa→Bhojana→Kautuka→…
  dual:                [8,  9,  10, 7,  4,  5,  6,  2,  1],  // Nritya Lipsa→Kautuka→Nidraa→…
};

const MOVABLE_SIGNS = new Set([1, 4, 7, 10]);
const FIXED_SIGNS   = new Set([2, 5, 8, 11]);

function getShayanadi(p: PlanetPosition): { state: string; name: Tri; activity: string } {
  const degInSign = p.longitude % 30;
  const navamshaIdx = Math.min(Math.floor(degInSign * 9 / 30), 8); // 0-8

  const signType: 'chara' | 'sthira' | 'dual' = MOVABLE_SIGNS.has(p.sign)
    ? 'chara'
    : FIXED_SIGNS.has(p.sign)
      ? 'sthira'
      : 'dual';

  const nameIdx = SHAYANADI_TABLE[signType][navamshaIdx];
  const sn = SHAYANADI_NAMES[nameIdx];
  return { state: sn.en.split(' ')[0].toLowerCase(), name: sn, activity: sn.en };
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────

export function calculateAvasthas(planets: PlanetPosition[]): PlanetAvasthas[] {
  return planets.filter(p => p.planet.id < 9).map(p => {
    const degInSign = p.longitude % 30;
    const baladi    = getBaladi(degInSign, p.sign);
    const jagradadi = getJagradadi(p.planet.id, p.sign);
    const deeptadi  = getDeeptadi(p, planets);
    const lajjitadi = getLajjitadi(p, planets);
    const shayanadi = getShayanadi(p);

    return {
      planetId:  p.planet.id,
      baladi:    { state: baladi.state,    name: baladi.name,    strength:   baladi.strength    },
      jagradadi: { state: jagradadi.state, name: jagradadi.name, quality:    jagradadi.quality  },
      deeptadi:  { state: deeptadi.state,  name: deeptadi.name,  luminosity: deeptadi.luminosity },
      lajjitadi: { state: lajjitadi.state, name: lajjitadi.name, effect:     lajjitadi.effect   },
      shayanadi: { state: shayanadi.state, name: shayanadi.name, activity:   shayanadi.activity },
    };
  });
}
