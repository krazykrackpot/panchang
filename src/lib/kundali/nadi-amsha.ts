/**
 * Nadi Amsha (D-150) Division Calculator
 *
 * Each sign (30°) is divided into 150 parts → each Nadi Amsha spans 0.2° (12 arc-minutes).
 * D-150 requires very accurate birth time — a ±2 minute error changes positions.
 *
 * Sign assignment follows Parashara's varga rule:
 *   ODD signs (0-indexed: 0,2,4,6,8,10): cycle Aries→Pisces (forward)
 *   EVEN signs (0-indexed: 1,3,5,7,9,11): cycle Pisces→Aries (reverse)
 */

import type { LocaleText } from '@/types/panchang';
import type { KundaliData } from '@/types/kundali';
import { RASHIS } from '@/lib/constants/rashis';

export interface NadiAmshaPosition {
  planetId: number;
  planetName: LocaleText;
  longitude: number;
  d1Sign: number;            // sign in D1 (1-12)
  nadiAmshaNumber: number;   // 1-150
  nadiSign: number;          // sign in D-150 (1-12)
  nadiSignName: LocaleText;
  karmicTheme: string;       // brief interpretation
}

export interface NadiAmshaChart {
  positions: NadiAmshaPosition[];
  ascendantNadi: NadiAmshaPosition;
}

/** Compute the D-150 sign for a given sidereal longitude. */
export function computeNadiAmsha(longitude: number): { signIndex: number; degreeInSign: number; nadiAmshaNumber: number; nadiSign: number } {
  // Normalize longitude to 0-360
  const lng = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(lng / 30); // 0-11
  const degreeInSign = lng - (signIndex * 30); // 0-30
  // Multiply by 5 first to avoid floating-point issues with 0.2 division
  // degreeInSign * 5 gives the number of 0.2° spans as a near-integer
  const nadiAmshaNumber = Math.min(Math.floor(degreeInSign * 5 + 1e-9) + 1, 150); // 1-150, clamped

  let nadiSign: number;
  if (signIndex % 2 === 0) {
    // ODD signs (Aries=0, Gemini=2, ...): forward cycle Aries→Pisces
    nadiSign = ((nadiAmshaNumber - 1) % 12) + 1;
  } else {
    // EVEN signs (Taurus=1, Cancer=3, ...): reverse cycle Pisces→Aries
    nadiSign = 12 - ((nadiAmshaNumber - 1) % 12);
  }

  return { signIndex, degreeInSign, nadiAmshaNumber, nadiSign };
}

/** Calculate Nadi Amsha chart for all planets + ascendant. */
export function calculateNadiAmsha(chart: KundaliData): NadiAmshaChart {
  const positions: NadiAmshaPosition[] = chart.planets.map((p) => {
    const { nadiAmshaNumber, nadiSign } = computeNadiAmsha(p.longitude);
    const rashiData = RASHIS.find(r => r.id === nadiSign);
    return {
      planetId: p.planet.id,
      planetName: p.planet.name,
      longitude: p.longitude,
      d1Sign: p.sign,
      nadiAmshaNumber,
      nadiSign,
      nadiSignName: rashiData?.name ?? { en: '?' },
      karmicTheme: getKarmicTheme(p.planet.id, nadiSign),
    };
  });

  // Ascendant
  const ascLng = chart.ascendant.degree;
  const { nadiAmshaNumber: ascAmsha, nadiSign: ascNadiSign } = computeNadiAmsha(ascLng);
  const ascRashi = RASHIS.find(r => r.id === ascNadiSign);
  const ascendantNadi: NadiAmshaPosition = {
    planetId: -1,
    planetName: { en: 'Ascendant', hi: 'लग्न', sa: 'लग्नम्', ta: 'லக்னம்', te: 'లగ్నం', bn: 'লগ্ন', kn: 'ಲಗ್ನ', mr: 'लग्न', gu: 'લગ્ન', mai: 'लग्न' },
    longitude: ascLng,
    d1Sign: chart.ascendant.sign,
    nadiAmshaNumber: ascAmsha,
    nadiSign: ascNadiSign,
    nadiSignName: ascRashi?.name ?? { en: '?' },
    karmicTheme: getKarmicTheme(-1, ascNadiSign),
  };

  return { positions, ascendantNadi };
}

// ---------------------------------------------------------------------------
// Karmic theme interpretations: 9 planets (0-8) + ascendant (-1) × 12 signs
// ---------------------------------------------------------------------------

const KARMIC_THEMES: Record<number, Record<number, string>> = {
  // Sun (0)
  0: {
    1: 'Leadership karma — past-life authority reborn. Career in governance, military, or medicine.',
    2: 'Accumulated wealth through effort. Past-life mastery of resources. Voice carries authority.',
    3: 'Courageous communicator. Past-life warrior or scribe. Siblings play a karmic role.',
    4: 'Deep roots in homeland. Past-life connection to mother and ancestral property.',
    5: 'Creative brilliance from past merit. Children bring karmic lessons. Born to inspire.',
    6: 'Healer of past debts. Service-oriented soul. Health challenges become strengths.',
    7: 'Partnership karma — relationships mirror past-life bonds. Diplomatic authority.',
    8: 'Transformative soul. Past-life encounters with death or occult. Deep research ability.',
    9: 'Dharmic leader. Past-life connection to teachers and pilgrimages. Natural philosopher.',
    10: 'Born for public life. Past-life reputation carries forward. Ambition is destiny.',
    11: 'Gains through networks. Past-life friendships reward this life. Humanitarian instincts.',
    12: 'Spiritual seeker. Past-life renunciation. Liberation through selfless service.',
  },
  // Moon (1)
  1: {
    1: 'Emotionally self-aware soul. Past-life independence shapes current intuition.',
    2: 'Nurturing provider. Past-life family bonds create emotional wealth. Sweet speech.',
    3: 'Restless communicator. Past-life traveler with creative emotional expression.',
    4: 'Deeply empathic soul. Past-life connection to nurturing and healing. Emotional intelligence is your superpower.',
    5: 'Emotionally creative. Past-life merit brings joy through children and art.',
    6: 'Emotional healer. Past-life service creates present sensitivity to suffering.',
    7: 'Relationship-oriented soul. Past-life partnerships define emotional patterns.',
    8: 'Psychically gifted. Past-life encounters with mystery. Emotional transformation.',
    9: 'Philosophical heart. Past-life devotion and travel shape emotional wisdom.',
    10: 'Public emotional presence. Past-life prominence. Mother figure in community.',
    11: 'Emotional bonds with friends. Past-life community service. Gains through caring.',
    12: 'Deeply intuitive dreamer. Past-life meditation practice. Needs solitude to recharge.',
  },
  // Mars (2)
  2: {
    1: 'Warrior soul reborn. Past-life battles create present courage and drive.',
    2: 'Fierce protector of family wealth. Past-life financial warrior. Forceful speech.',
    3: 'Adventurous communicator. Past-life explorer. Siblings are karmic allies or rivals.',
    4: 'Protector of home. Past-life land disputes or property karma. Strong foundations.',
    5: 'Dynamic creativity. Past-life competitive merit. Children bring active karma.',
    6: 'Natural competitor. Past-life victories over enemies. Health through discipline.',
    7: 'Passionate partnerships. Past-life marital karma demands patience and compromise.',
    8: 'Occult warrior. Past-life transformation through crisis. Surgical precision.',
    9: 'Dharma defender. Past-life crusader or religious warrior. Physically strong faith.',
    10: 'Career commander. Past-life military or engineering karma. Relentless ambition.',
    11: 'Gains through bold action. Past-life revolutionary. Network of warriors.',
    12: 'Hidden strength. Past-life confinement teaches inner power. Spiritual warrior.',
  },
  // Mercury (3)
  3: {
    1: 'Brilliant communicator. Past-life intellectual gifts shape sharp wit and adaptability.',
    2: 'Financial analyst soul. Past-life trade and commerce. Wealth through intelligence.',
    3: 'Master communicator. Past-life writer or messenger. Extraordinary verbal skills.',
    4: 'Learned homemaker. Past-life education in domestic arts. Intellectual comfort.',
    5: 'Creative genius. Past-life scholarly merit. Children benefit from your intellect.',
    6: 'Analytical healer. Past-life diagnostic skills. Solves problems through logic.',
    7: 'Diplomatic negotiator. Past-life mediation karma. Partnerships through communication.',
    8: 'Research investigator. Past-life secret knowledge. Penetrating analytical mind.',
    9: 'Philosophical scholar. Past-life teaching karma. Wisdom through learning.',
    10: 'Career communicator. Past-life administrative skill. Success through intellect.',
    11: 'Network strategist. Past-life social engineering. Gains through information.',
    12: 'Intuitive thinker. Past-life contemplation. Subconscious intelligence.',
  },
  // Jupiter (4)
  4: {
    1: 'Wise soul. Past-life spiritual merit creates natural authority and optimism.',
    2: 'Abundantly blessed. Past-life generosity returns as family wealth and wisdom.',
    3: 'Teaching communicator. Past-life preacher or writer. Siblings are students.',
    4: 'Blessed home. Past-life devotion creates comfortable, learned household.',
    5: 'Exceptional children karma. Past-life merit in education. Creative brilliance.',
    6: 'Overcomes obstacles through wisdom. Past-life service to the suffering.',
    7: 'Blessed partnerships. Past-life spiritual companionship. Wise spouse.',
    8: 'Occult wisdom. Past-life initiation into mysteries. Longevity through faith.',
    9: 'Supreme dharma. Past-life guru or sage. Natural teacher and philosopher.',
    10: 'Honored career. Past-life public service. Success through righteousness.',
    11: 'Abundant gains. Past-life philanthropy. Wealthy and generous network.',
    12: 'Liberation seeker. Past-life monastery or ashram. Moksha is the goal.',
  },
  // Venus (5)
  5: {
    1: 'Beautiful soul. Past-life artistic refinement creates charm and grace.',
    2: 'Luxurious wealth. Past-life aesthetic mastery. Beautiful speech and possessions.',
    3: 'Artistic communicator. Past-life musician or poet. Creative expression.',
    4: 'Comfortable home. Past-life luxury creates present domestic beauty.',
    5: 'Romantic creativity. Past-life love affairs shape artistic gifts.',
    6: 'Healing through beauty. Past-life service through art. Health through balance.',
    7: 'Love karma personified. Past-life romantic bonds define present partnerships.',
    8: 'Tantric knowledge. Past-life sensual transformation. Hidden wealth.',
    9: 'Devotional artist. Past-life temple service. Beauty in philosophy.',
    10: 'Career in arts or luxury. Past-life creative prominence. Public charm.',
    11: 'Gains through pleasure. Past-life social grace. Beautiful friendships.',
    12: 'Spiritual love. Past-life divine romance. Bed pleasures and foreign luxury.',
  },
  // Saturn (6)
  6: {
    1: 'Disciplined soul. Past-life austerity creates present endurance and responsibility.',
    2: 'Frugal provider. Past-life poverty teaches wealth management. Measured speech.',
    3: 'Patient communicator. Past-life hardship with siblings. Persistent effort.',
    4: 'Ancestral burdens. Past-life property karma demands patience. Late-life comfort.',
    5: 'Delayed creativity. Past-life restriction on children. Wisdom comes with age.',
    6: 'Master of adversity. Past-life service and suffering. Overcomes all enemies.',
    7: 'Partnership lessons. Past-life marital karma demands commitment and patience.',
    8: 'Longevity through discipline. Past-life encounter with chronic challenges.',
    9: 'Dharma through hardship. Past-life pilgrimage under difficult conditions.',
    10: 'Career through perseverance. Past-life labor karma. Slow but certain rise.',
    11: 'Gains through patience. Past-life community service. Late-life prosperity.',
    12: 'Karmic debts. Past-life confinement or exile. Liberation through surrender.',
  },
  // Rahu (7)
  7: {
    1: 'Unconventional identity. Past-life foreign influence. Driven by worldly ambition.',
    2: 'Unusual wealth paths. Past-life foreign trade. Eccentric family dynamics.',
    3: 'Bold communicator. Past-life risk-taking. Technology and media affinity.',
    4: 'Displaced roots. Past-life migration. Home in unconventional places.',
    5: 'Innovative creativity. Past-life unorthodox merit. Unusual children karma.',
    6: 'Conquers hidden enemies. Past-life occult battles. Thrives in chaos.',
    7: 'Karmic partnerships with foreigners. Past-life cross-cultural bonds.',
    8: 'Deep occult karma. Past-life transformation through taboo. Research obsession.',
    9: 'Unorthodox beliefs. Past-life religious rebellion. Pilgrimages to foreign lands.',
    10: 'Worldly ambition. Past-life power-seeking. Success in technology or politics.',
    11: 'Massive gains through networks. Past-life social manipulation. Fulfills desires.',
    12: 'Foreign spiritual path. Past-life exile becomes liberation. Psychic sensitivity.',
  },
  // Ketu (8)
  8: {
    1: 'Detached soul. Past-life spiritual mastery. Naturally renounced personality.',
    2: 'Indifferent to wealth. Past-life abundance creates present detachment.',
    3: 'Silent communicator. Past-life mastery of expression. Intuitive knowing.',
    4: 'Detached from home. Past-life wandering ascetic. Inner peace over property.',
    5: 'Spiritual creativity. Past-life meditation merit. Children bring liberation.',
    6: 'Immune to enemies. Past-life victory through renunciation. Mystical healing.',
    7: 'Detached from partnerships. Past-life completed relationship karma.',
    8: 'Natural mystic. Past-life occult mastery. Effortless transformation.',
    9: 'Enlightened soul. Past-life guru. Dharma is already internalized.',
    10: 'Indifferent to fame. Past-life career mastery. Works without ego.',
    11: 'Detached from gains. Past-life fulfillment. Gives more than receives.',
    12: 'Moksha-bound. Past-life liberation practice nearly complete. Final journey.',
  },
  // Ascendant (-1) — themes based on nadi sign of the rising degree
  [-1]: {
    1: 'Karmic self-initiative. The soul chose to begin anew with fire and courage.',
    2: 'Karmic stability. The soul chose to build lasting value through patience.',
    3: 'Karmic curiosity. The soul chose to learn and communicate as its life path.',
    4: 'Karmic nurturing. The soul chose to create emotional security.',
    5: 'Karmic creativity. The soul chose self-expression and joy as its purpose.',
    6: 'Karmic service. The soul chose to heal and improve through effort.',
    7: 'Karmic partnership. The soul chose to learn through relationship.',
    8: 'Karmic transformation. The soul chose depth, mystery, and rebirth.',
    9: 'Karmic wisdom. The soul chose dharma, teaching, and exploration.',
    10: 'Karmic ambition. The soul chose public achievement and responsibility.',
    11: 'Karmic community. The soul chose to serve the collective and innovate.',
    12: 'Karmic liberation. The soul chose surrender and spiritual completion.',
  },
};

/** Get karmic theme for a planet in a nadi sign. */
export function getKarmicTheme(planetId: number, nadiSign: number): string {
  return KARMIC_THEMES[planetId]?.[nadiSign] ?? 'Subtle karmic imprint — the soul carries a nuanced past-life pattern in this area.';
}
