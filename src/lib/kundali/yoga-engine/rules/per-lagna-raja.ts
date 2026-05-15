/**
 * Per-Lagna Raja Yoga Rules
 *
 * Lagna-specific Raja Yogas formed by the strongest yogakaraka pairs for each
 * ascendant. Per BPHS Ch.34, when lords of kendras and trikonas are connected
 * (conjunction, mutual aspect, or sign exchange), Raja Yoga forms. The specific
 * pairs that produce the STRONGEST yogas differ by lagna.
 *
 * Each rule fires only when the chart's ascendant matches the specified sign.
 * Connection is defined as: conjunction (same house), mutual aspect, or
 * parivartana (sign exchange) between the two lords.
 *
 * Sources: BPHS Ch.34-35, Phaladeepika Ch.6, Saravali
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';
import { SIGN_LORDS } from '@/lib/constants/dignities';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if two planets are "connected" per Raja Yoga criteria:
 * 1. Conjunction (same house)
 * 2. Mutual aspect (each aspects the other's house)
 * 3. Sign exchange / Parivartana (each in the other's sign)
 */
function arePlanetsConnected(ctx: YogaContext, p1: number, p2: number): boolean {
  // 1. Conjunction — same house
  if (ctx.areConjunct(p1, p2)) return true;

  // 2. Mutual aspect — p1 aspects p2's house AND p2 aspects p1's house
  const h1 = ctx.planetHouse(p1);
  const h2 = ctx.planetHouse(p2);
  if (ctx.doesAspect(p1, h2) && ctx.doesAspect(p2, h1)) return true;

  // 3. Sign exchange — p1 in p2's sign AND p2 in p1's sign
  const s1 = ctx.planetSign(p1);
  const s2 = ctx.planetSign(p2);
  if (SIGN_LORDS[s1] === p2 && SIGN_LORDS[s2] === p1) return true;

  return false;
}

/**
 * Assess strength of a per-lagna Raja Yoga based on dignity and house placement.
 */
function perLagnaRajaStrength(
  ctx: YogaContext,
  result: YogaDetectionResult,
): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strongFactors = 0;
  let weakFactors = 0;

  for (const pid of planets) {
    const dignity = ctx.dignity(pid);
    const house = ctx.planetHouse(pid);

    if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') strongFactors += 2;
    else if (dignity === 'friend') strongFactors++;
    if (ctx.isKendra(house) || ctx.isTrikona(house)) strongFactors++;

    if (dignity === 'debilitated') weakFactors += 2;
    if (ctx.isDusthana(house)) weakFactors++;
    if (ctx.isCombust(pid)) weakFactors++;
  }

  if (strongFactors >= 4 && weakFactors === 0) return 'Strong';
  if (weakFactors >= 3) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-lagna Raja Yoga configuration
// ─────────────────────────────────────────────────────────────────────────────

interface LagnaRajaConfig {
  /** Ascendant sign number (1=Aries through 12=Pisces) */
  sign: number;
  /** English lagna name */
  lagnaEn: string;
  /** Hindi lagna name */
  lagnaHi: string;
  /** Sanskrit lagna name */
  lagnaSa: string;
  /** Strongest yogakaraka pair: [planetId1, planetId2] */
  pair: [number, number];
  /** English pair description (e.g. "Mars and Jupiter") */
  pairDescEn: string;
  /** Hindi pair description */
  pairDescHi: string;
  /** House lordship explanation */
  lordsEn: string;
  /** Hindi lordship explanation */
  lordsHi: string;
}

const LAGNA_CONFIGS: LagnaRajaConfig[] = [
  {
    sign: 1,
    lagnaEn: 'Aries', lagnaHi: 'मेष', lagnaSa: 'मेषम्',
    pair: [2, 4], // Mars + Jupiter
    pairDescEn: 'Mars (1st/8th lord) and Jupiter (9th/12th lord)',
    pairDescHi: 'मंगल (1/8 भावेश) और गुरु (9/12 भावेश)',
    lordsEn: 'Mars as lagna lord connecting with Jupiter as 9th lord (greatest trikona) forms a powerful dharma-karma axis',
    lordsHi: 'मंगल लग्नेश का गुरु 9वें भावेश (सबसे बड़ा त्रिकोण) से संबंध शक्तिशाली धर्म-कर्म अक्ष बनाता है',
  },
  {
    sign: 2,
    lagnaEn: 'Taurus', lagnaHi: 'वृषभ', lagnaSa: 'वृषभम्',
    pair: [6, 3], // Saturn + Mercury
    pairDescEn: 'Saturn (9th/10th lord) and Mercury (2nd/5th lord)',
    pairDescHi: 'शनि (9/10 भावेश) और बुध (2/5 भावेश)',
    lordsEn: 'Saturn as yogakaraka (9th+10th lord) connecting with Mercury (5th lord trikona) forms the strongest Raja Yoga',
    lordsHi: 'शनि योगकारक (9+10 भावेश) का बुध (5वें भावेश त्रिकोण) से संबंध सबसे शक्तिशाली राजयोग बनाता है',
  },
  {
    sign: 3,
    lagnaEn: 'Gemini', lagnaHi: 'मिथुन', lagnaSa: 'मिथुनम्',
    pair: [5, 6], // Venus + Saturn
    pairDescEn: 'Venus (5th/12th lord) and Saturn (8th/9th lord)',
    pairDescHi: 'शुक्र (5/12 भावेश) और शनि (8/9 भावेश)',
    lordsEn: 'Venus as 5th lord (trikona) connecting with Saturn as 9th lord (greatest trikona) forms a trikona-trikona Raja Yoga',
    lordsHi: 'शुक्र 5वें भावेश (त्रिकोण) का शनि 9वें भावेश (सबसे बड़ा त्रिकोण) से संबंध त्रिकोण-त्रिकोण राजयोग बनाता है',
  },
  {
    sign: 4,
    lagnaEn: 'Cancer', lagnaHi: 'कर्क', lagnaSa: 'कर्कम्',
    pair: [2, 4], // Mars + Jupiter
    pairDescEn: 'Mars (5th/10th lord — yogakaraka) and Jupiter (9th/6th lord)',
    pairDescHi: 'मंगल (5/10 भावेश — योगकारक) और गुरु (9/6 भावेश)',
    lordsEn: 'Mars as yogakaraka (5th+10th lord) connecting with Jupiter as 9th lord forms the most powerful Raja Yoga for Cancer',
    lordsHi: 'मंगल योगकारक (5+10 भावेश) का गुरु 9वें भावेश से संबंध कर्क के लिए सबसे शक्तिशाली राजयोग बनाता है',
  },
  {
    sign: 5,
    lagnaEn: 'Leo', lagnaHi: 'सिंह', lagnaSa: 'सिंहम्',
    pair: [2, 4], // Mars + Jupiter
    pairDescEn: 'Mars (4th/9th lord) and Jupiter (5th/8th lord)',
    pairDescHi: 'मंगल (4/9 भावेश) और गुरु (5/8 भावेश)',
    lordsEn: 'Mars as 9th lord (trikona) + 4th lord (kendra) connecting with Jupiter as 5th lord (trikona) — double trikona involvement',
    lordsHi: 'मंगल 9वें भावेश (त्रिकोण) + 4वें भावेश (केन्द्र) का गुरु 5वें भावेश (त्रिकोण) से संबंध — दोहरा त्रिकोण',
  },
  {
    sign: 6,
    lagnaEn: 'Virgo', lagnaHi: 'कन्या', lagnaSa: 'कन्या',
    pair: [5, 3], // Venus + Mercury
    pairDescEn: 'Venus (2nd/9th lord) and Mercury (1st/10th lord)',
    pairDescHi: 'शुक्र (2/9 भावेश) और बुध (1/10 भावेश)',
    lordsEn: 'Venus as 9th lord (trikona) connecting with Mercury as lagna+10th lord (kendra) forms the dharma-karma axis',
    lordsHi: 'शुक्र 9वें भावेश (त्रिकोण) का बुध लग्नेश+10वें भावेश (केन्द्र) से संबंध धर्म-कर्म अक्ष बनाता है',
  },
  {
    sign: 7,
    lagnaEn: 'Libra', lagnaHi: 'तुला', lagnaSa: 'तुला',
    pair: [6, 3], // Saturn + Mercury
    pairDescEn: 'Saturn (4th/5th lord) and Mercury (9th/12th lord)',
    pairDescHi: 'शनि (4/5 भावेश) और बुध (9/12 भावेश)',
    lordsEn: 'Saturn as 4th (kendra) + 5th (trikona) lord connecting with Mercury as 9th lord (trikona) — kendra-trikona axis',
    lordsHi: 'शनि 4वें (केन्द्र) + 5वें (त्रिकोण) भावेश का बुध 9वें भावेश (त्रिकोण) से संबंध — केन्द्र-त्रिकोण अक्ष',
  },
  {
    sign: 8,
    lagnaEn: 'Scorpio', lagnaHi: 'वृश्चिक', lagnaSa: 'वृश्चिकम्',
    pair: [4, 1], // Jupiter + Moon
    pairDescEn: 'Jupiter (2nd/5th lord) and Moon (9th lord)',
    pairDescHi: 'गुरु (2/5 भावेश) और चंद्र (9वें भावेश)',
    lordsEn: 'Jupiter as 5th lord (trikona) connecting with Moon as 9th lord (trikona) — the two great trines unite',
    lordsHi: 'गुरु 5वें भावेश (त्रिकोण) का चंद्र 9वें भावेश (त्रिकोण) से संबंध — दो महान त्रिकोणों का मिलन',
  },
  {
    sign: 9,
    lagnaEn: 'Sagittarius', lagnaHi: 'धनु', lagnaSa: 'धनुः',
    pair: [2, 0], // Mars + Sun
    pairDescEn: 'Mars (5th/12th lord) and Sun (9th lord)',
    pairDescHi: 'मंगल (5/12 भावेश) और सूर्य (9वें भावेश)',
    lordsEn: 'Mars as 5th lord (trikona) connecting with Sun as 9th lord (trikona) — pure trikona Raja Yoga',
    lordsHi: 'मंगल 5वें भावेश (त्रिकोण) का सूर्य 9वें भावेश (त्रिकोण) से संबंध — शुद्ध त्रिकोण राजयोग',
  },
  {
    sign: 10,
    lagnaEn: 'Capricorn', lagnaHi: 'मकर', lagnaSa: 'मकरम्',
    pair: [5, 3], // Venus + Mercury
    pairDescEn: 'Venus (5th/10th lord — yogakaraka) and Mercury (6th/9th lord)',
    pairDescHi: 'शुक्र (5/10 भावेश — योगकारक) और बुध (6/9 भावेश)',
    lordsEn: 'Venus as yogakaraka (5th+10th lord) connecting with Mercury as 9th lord forms the most powerful Raja Yoga for Capricorn',
    lordsHi: 'शुक्र योगकारक (5+10 भावेश) का बुध 9वें भावेश से संबंध मकर के लिए सबसे शक्तिशाली राजयोग बनाता है',
  },
  {
    sign: 11,
    lagnaEn: 'Aquarius', lagnaHi: 'कुम्भ', lagnaSa: 'कुम्भम्',
    pair: [5, 2], // Venus + Mars
    pairDescEn: 'Venus (4th/9th lord) and Mars (3rd/10th lord)',
    pairDescHi: 'शुक्र (4/9 भावेश) और मंगल (3/10 भावेश)',
    lordsEn: 'Venus as 9th lord (trikona) + 4th lord (kendra) connecting with Mars as 10th lord (kendra) — kendra-trikona axis',
    lordsHi: 'शुक्र 9वें भावेश (त्रिकोण) + 4वें भावेश (केन्द्र) का मंगल 10वें भावेश (केन्द्र) से संबंध — केन्द्र-त्रिकोण अक्ष',
  },
  {
    sign: 12,
    lagnaEn: 'Pisces', lagnaHi: 'मीन', lagnaSa: 'मीनम्',
    pair: [2, 1], // Mars + Moon
    pairDescEn: 'Mars (2nd/9th lord) and Moon (5th lord)',
    pairDescHi: 'मंगल (2/9 भावेश) और चंद्र (5वें भावेश)',
    lordsEn: 'Mars as 9th lord (trikona) connecting with Moon as 5th lord (trikona) — the two great trines unite for Pisces',
    lordsHi: 'मंगल 9वें भावेश (त्रिकोण) का चंद्र 5वें भावेश (त्रिकोण) से संबंध — मीन के लिए दो महान त्रिकोणों का मिलन',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Generate rules from config
// ─────────────────────────────────────────────────────────────────────────────

function buildRule(cfg: LagnaRajaConfig): YogaRule {
  const signName = cfg.lagnaEn.toLowerCase();
  const [p1, p2] = cfg.pair;

  return {
    id: `per-lagna-raja-${signName}`,
    name: {
      en: `Raja Yoga for ${cfg.lagnaEn} Lagna`,
      hi: `${cfg.lagnaHi} लग्न राजयोग`,
      sa: `${cfg.lagnaSa}लग्नराजयोगः`,
    },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.34-35',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Only applicable for this specific ascendant
        if (ctx.ascendantSign !== cfg.sign) {
          return { present: false, involvedPlanets: [] };
        }

        // Check if the yogakaraka pair is connected
        if (!arePlanetsConnected(ctx, p1, p2)) {
          return { present: false, involvedPlanets: [] };
        }

        // Determine connection type for customData
        let connectionType = 'unknown';
        if (ctx.areConjunct(p1, p2)) {
          connectionType = 'conjunction';
        } else {
          const h1 = ctx.planetHouse(p1);
          const h2 = ctx.planetHouse(p2);
          if (ctx.doesAspect(p1, h2) && ctx.doesAspect(p2, h1)) {
            connectionType = 'mutual_aspect';
          }
          const s1 = ctx.planetSign(p1);
          const s2 = ctx.planetSign(p2);
          if (SIGN_LORDS[s1] === p2 && SIGN_LORDS[s2] === p1) {
            connectionType = 'exchange';
          }
        }

        return {
          present: true,
          involvedPlanets: [p1, p2],
          customData: { lagna: cfg.lagnaEn, connectionType },
        };
      },
    },

    assessStrength: perLagnaRajaStrength,

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 3,

    formationRule: {
      en: `${cfg.pairDescEn} connected by conjunction, mutual aspect, or sign exchange — ${cfg.lordsEn}`,
      hi: `${cfg.pairDescHi} का युति, परस्पर दृष्टि या राशि परिवर्तन से संबंध — ${cfg.lordsHi}`,
    },
    description: {
      en: `Per-lagna Raja Yoga for ${cfg.lagnaEn} ascendant: ${cfg.lordsEn}. This is the most potent Raja Yoga combination specific to ${cfg.lagnaEn} lagna per BPHS Ch.34. When these lords connect, the native rises to positions of power, authority, and material prosperity. The strength depends on both planets' dignity and house placement — exalted or own-sign planets in kendras/trikonas produce the strongest manifestation.`,
      hi: `${cfg.lagnaHi} लग्न के लिए विशिष्ट राजयोग: ${cfg.lordsHi}। BPHS अध्याय 34 के अनुसार ${cfg.lagnaHi} लग्न के लिए सबसे शक्तिशाली राजयोग संयोजन है। जब ये स्वामी जुड़ते हैं, जातक सत्ता, अधिकार और भौतिक समृद्धि के पदों पर पहुँचता है। बल दोनों ग्रहों की गरिमा और भाव स्थिति पर निर्भर करता है।`,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Secondary kendra-trikona pairs per lagna (BPHS Ch.34-35)
//
// Each lagna has 2-4 additional valid kendra-trikona lord combinations beyond
// the primary yogakaraka pair. These are less potent but still classical Raja
// Yogas. All use the same detection logic (conjunction/mutual aspect/exchange).
//
// Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
// ─────────────────────────────────────────────────────────────────────────────

interface SecondaryPairConfig {
  sign: number;
  lagnaEn: string;
  lagnaHi: string;
  pair: [number, number];
  pairDescEn: string;
  pairDescHi: string;
  lordsEn: string;
  lordsHi: string;
}

const SECONDARY_PAIRS: SecondaryPairConfig[] = [
  // Aries — Sun (5th lord) + Mars (1st lord kendra-trikona)
  { sign: 1, lagnaEn: 'Aries', lagnaHi: 'मेष', pair: [0, 2],
    pairDescEn: 'Sun (5th lord) and Mars (1st lord)',
    pairDescHi: 'सूर्य (5वें भावेश) और मंगल (लग्नेश)',
    lordsEn: 'Sun as 5th lord (trikona) connecting with Mars as lagna lord (kendra)',
    lordsHi: 'सूर्य 5वें भावेश (त्रिकोण) का मंगल लग्नेश (केन्द्र) से संबंध' },
  // Aries — Sun (5th lord) + Jupiter (9th lord) — trikona-trikona
  { sign: 1, lagnaEn: 'Aries', lagnaHi: 'मेष', pair: [0, 4],
    pairDescEn: 'Sun (5th lord) and Jupiter (9th lord)',
    pairDescHi: 'सूर्य (5वें भावेश) और गुरु (9वें भावेश)',
    lordsEn: 'Sun as 5th lord + Jupiter as 9th lord — two trikona lords uniting',
    lordsHi: 'सूर्य 5वें भावेश + गुरु 9वें भावेश — दो त्रिकोण स्वामियों का मिलन' },

  // Taurus — Sun (4th lord kendra) + Saturn (9th/10th yogakaraka)
  { sign: 2, lagnaEn: 'Taurus', lagnaHi: 'वृषभ', pair: [0, 6],
    pairDescEn: 'Sun (4th lord) and Saturn (9th/10th lord)',
    pairDescHi: 'सूर्य (4वें भावेश) और शनि (9/10 भावेश)',
    lordsEn: 'Sun as 4th lord (kendra) connecting with Saturn yogakaraka',
    lordsHi: 'सूर्य 4वें भावेश (केन्द्र) का शनि योगकारक से संबंध' },
  // Taurus — Mercury (5th lord) + Venus (1st lord) — lagna-trikona
  { sign: 2, lagnaEn: 'Taurus', lagnaHi: 'वृषभ', pair: [3, 5],
    pairDescEn: 'Mercury (2nd/5th lord) and Venus (1st/6th lord)',
    pairDescHi: 'बुध (2/5 भावेश) और शुक्र (1/6 भावेश)',
    lordsEn: 'Mercury as 5th lord (trikona) with Venus as lagna lord (kendra)',
    lordsHi: 'बुध 5वें भावेश (त्रिकोण) का शुक्र लग्नेश (केन्द्र) से संबंध' },

  // Gemini — Mercury (1st/10th) + Venus (5th lord)
  { sign: 3, lagnaEn: 'Gemini', lagnaHi: 'मिथुन', pair: [3, 5],
    pairDescEn: 'Mercury (1st/10th lord) and Venus (5th/12th lord)',
    pairDescHi: 'बुध (1/10 भावेश) और शुक्र (5/12 भावेश)',
    lordsEn: 'Mercury as lagna+10th lord (kendra) with Venus as 5th lord (trikona)',
    lordsHi: 'बुध लग्नेश+10वें भावेश (केन्द्र) का शुक्र 5वें भावेश (त्रिकोण) से संबंध' },
  // Gemini — Mercury (1st/10th) + Saturn (9th lord)
  { sign: 3, lagnaEn: 'Gemini', lagnaHi: 'मिथुन', pair: [3, 6],
    pairDescEn: 'Mercury (1st/10th lord) and Saturn (8th/9th lord)',
    pairDescHi: 'बुध (1/10 भावेश) और शनि (8/9 भावेश)',
    lordsEn: 'Mercury as lagna+10th lord (kendra) with Saturn as 9th lord (trikona)',
    lordsHi: 'बुध लग्नेश+10वें भावेश (केन्द्र) का शनि 9वें भावेश (त्रिकोण) से संबंध' },

  // Cancer — Moon (1st lord) + Mars (5th/10th yogakaraka)
  { sign: 4, lagnaEn: 'Cancer', lagnaHi: 'कर्क', pair: [1, 2],
    pairDescEn: 'Moon (1st lord) and Mars (5th/10th lord)',
    pairDescHi: 'चंद्र (लग्नेश) और मंगल (5/10 भावेश योगकारक)',
    lordsEn: 'Moon as lagna lord with Mars yogakaraka — the ruler meets the minister',
    lordsHi: 'चंद्र लग्नेश का मंगल योगकारक से संबंध — राजा और मंत्री का मिलन' },
  // Cancer — Moon (1st lord) + Jupiter (9th lord)
  { sign: 4, lagnaEn: 'Cancer', lagnaHi: 'कर्क', pair: [1, 4],
    pairDescEn: 'Moon (1st lord) and Jupiter (6th/9th lord)',
    pairDescHi: 'चंद्र (लग्नेश) और गुरु (6/9 भावेश)',
    lordsEn: 'Moon as lagna lord with Jupiter as 9th lord — lagna-trikona connection',
    lordsHi: 'चंद्र लग्नेश का गुरु 9वें भावेश से संबंध — लग्न-त्रिकोण योग' },

  // Leo — Sun (1st lord) + Mars (4th/9th lord)
  { sign: 5, lagnaEn: 'Leo', lagnaHi: 'सिंह', pair: [0, 2],
    pairDescEn: 'Sun (1st lord) and Mars (4th/9th lord)',
    pairDescHi: 'सूर्य (लग्नेश) और मंगल (4/9 भावेश)',
    lordsEn: 'Sun as lagna lord with Mars as 9th lord — king meets commander',
    lordsHi: 'सूर्य लग्नेश का मंगल 9वें भावेश से संबंध — राजा और सेनापति' },
  // Leo — Sun (1st lord) + Jupiter (5th lord)
  { sign: 5, lagnaEn: 'Leo', lagnaHi: 'सिंह', pair: [0, 4],
    pairDescEn: 'Sun (1st lord) and Jupiter (5th/8th lord)',
    pairDescHi: 'सूर्य (लग्नेश) और गुरु (5/8 भावेश)',
    lordsEn: 'Sun as lagna lord with Jupiter as 5th lord — authority meets wisdom',
    lordsHi: 'सूर्य लग्नेश का गुरु 5वें भावेश से संबंध — सत्ता और ज्ञान का मिलन' },

  // Virgo — Mercury (1st/10th) + Venus (2nd/9th)  — primary already exists
  // Secondary: Mars (3rd/8th) excluded (dusthana); Saturn 5th/6th — 5th trikona ok
  { sign: 6, lagnaEn: 'Virgo', lagnaHi: 'कन्या', pair: [3, 6],
    pairDescEn: 'Mercury (1st/10th lord) and Saturn (5th/6th lord)',
    pairDescHi: 'बुध (1/10 भावेश) और शनि (5/6 भावेश)',
    lordsEn: 'Mercury as lagna+10th lord with Saturn as 5th lord (trikona)',
    lordsHi: 'बुध लग्नेश+10वें भावेश का शनि 5वें भावेश (त्रिकोण) से संबंध' },

  // Libra — Venus (1st lord) + Saturn (4th/5th yogakaraka)
  { sign: 7, lagnaEn: 'Libra', lagnaHi: 'तुला', pair: [5, 6],
    pairDescEn: 'Venus (1st/8th lord) and Saturn (4th/5th lord)',
    pairDescHi: 'शुक्र (1/8 भावेश) और शनि (4/5 भावेश योगकारक)',
    lordsEn: 'Venus as lagna lord with Saturn yogakaraka — the ruler empowers the minister',
    lordsHi: 'शुक्र लग्नेश का शनि योगकारक से संबंध — शासक और मंत्री' },
  // Libra — Venus (1st) + Mercury (9th lord)
  { sign: 7, lagnaEn: 'Libra', lagnaHi: 'तुला', pair: [5, 3],
    pairDescEn: 'Venus (1st/8th lord) and Mercury (9th/12th lord)',
    pairDescHi: 'शुक्र (1/8 भावेश) और बुध (9/12 भावेश)',
    lordsEn: 'Venus as lagna lord with Mercury as 9th lord — lagna-trikona connection',
    lordsHi: 'शुक्र लग्नेश का बुध 9वें भावेश से संबंध — लग्न-त्रिकोण योग' },

  // Scorpio — Sun (10th lord kendra) + Jupiter (5th lord trikona)
  { sign: 8, lagnaEn: 'Scorpio', lagnaHi: 'वृश्चिक', pair: [0, 4],
    pairDescEn: 'Sun (10th lord) and Jupiter (2nd/5th lord)',
    pairDescHi: 'सूर्य (10वें भावेश) और गुरु (2/5 भावेश)',
    lordsEn: 'Sun as 10th lord (kendra) with Jupiter as 5th lord (trikona)',
    lordsHi: 'सूर्य 10वें भावेश (केन्द्र) का गुरु 5वें भावेश (त्रिकोण) से संबंध' },
  // Scorpio — Sun (10th lord) + Moon (9th lord)
  { sign: 8, lagnaEn: 'Scorpio', lagnaHi: 'वृश्चिक', pair: [0, 1],
    pairDescEn: 'Sun (10th lord) and Moon (9th lord)',
    pairDescHi: 'सूर्य (10वें भावेश) और चंद्र (9वें भावेश)',
    lordsEn: 'Sun as 10th lord (kendra) with Moon as 9th lord — dharma-karma axis via luminaries',
    lordsHi: 'सूर्य 10वें भावेश (केन्द्र) का चंद्र 9वें भावेश से संबंध — ज्योतियों द्वारा धर्म-कर्म अक्ष' },

  // Sagittarius — Jupiter (1st/4th) + Sun (9th lord)
  { sign: 9, lagnaEn: 'Sagittarius', lagnaHi: 'धनु', pair: [4, 0],
    pairDescEn: 'Jupiter (1st/4th lord) and Sun (9th lord)',
    pairDescHi: 'गुरु (1/4 भावेश) और सूर्य (9वें भावेश)',
    lordsEn: 'Jupiter as lagna+4th lord (kendra) with Sun as 9th lord (trikona)',
    lordsHi: 'गुरु लग्नेश+4वें भावेश (केन्द्र) का सूर्य 9वें भावेश (त्रिकोण) से संबंध' },
  // Sagittarius — Jupiter (1st/4th) + Mars (5th lord)
  { sign: 9, lagnaEn: 'Sagittarius', lagnaHi: 'धनु', pair: [4, 2],
    pairDescEn: 'Jupiter (1st/4th lord) and Mars (5th/12th lord)',
    pairDescHi: 'गुरु (1/4 भावेश) और मंगल (5/12 भावेश)',
    lordsEn: 'Jupiter as lagna lord with Mars as 5th lord (trikona)',
    lordsHi: 'गुरु लग्नेश का मंगल 5वें भावेश (त्रिकोण) से संबंध' },

  // Capricorn — Saturn (1st/2nd) + Venus (5th/10th yogakaraka)
  { sign: 10, lagnaEn: 'Capricorn', lagnaHi: 'मकर', pair: [6, 5],
    pairDescEn: 'Saturn (1st/2nd lord) and Venus (5th/10th lord)',
    pairDescHi: 'शनि (1/2 भावेश) और शुक्र (5/10 भावेश योगकारक)',
    lordsEn: 'Saturn as lagna lord with Venus yogakaraka — the ruler meets the minister',
    lordsHi: 'शनि लग्नेश का शुक्र योगकारक से संबंध — शासक और मंत्री' },
  // Capricorn — Saturn (1st) + Mercury (9th lord)  — primary is Venus+Mercury
  { sign: 10, lagnaEn: 'Capricorn', lagnaHi: 'मकर', pair: [6, 3],
    pairDescEn: 'Saturn (1st/2nd lord) and Mercury (6th/9th lord)',
    pairDescHi: 'शनि (1/2 भावेश) और बुध (6/9 भावेश)',
    lordsEn: 'Saturn as lagna lord with Mercury as 9th lord (trikona)',
    lordsHi: 'शनि लग्नेश का बुध 9वें भावेश (त्रिकोण) से संबंध' },

  // Aquarius — Saturn (1st/12th) + Venus (4th/9th yogakaraka)  — primary is Venus+Mars
  { sign: 11, lagnaEn: 'Aquarius', lagnaHi: 'कुम्भ', pair: [6, 5],
    pairDescEn: 'Saturn (1st/12th lord) and Venus (4th/9th lord)',
    pairDescHi: 'शनि (1/12 भावेश) और शुक्र (4/9 भावेश योगकारक)',
    lordsEn: 'Saturn as lagna lord with Venus yogakaraka — strong kendra-trikona link',
    lordsHi: 'शनि लग्नेश का शुक्र योगकारक से संबंध — शक्तिशाली केन्द्र-त्रिकोण योग' },
  // Aquarius — Saturn (1st) + Mars (3rd/10th)  — Mars is 10th kendra
  { sign: 11, lagnaEn: 'Aquarius', lagnaHi: 'कुम्भ', pair: [6, 2],
    pairDescEn: 'Saturn (1st/12th lord) and Mars (3rd/10th lord)',
    pairDescHi: 'शनि (1/12 भावेश) और मंगल (3/10 भावेश)',
    lordsEn: 'Saturn as lagna lord with Mars as 10th lord — lagna-kendra connection',
    lordsHi: 'शनि लग्नेश का मंगल 10वें भावेश से संबंध — लग्न-केन्द्र योग' },

  // Pisces — Jupiter (1st/10th) + Moon (5th lord)
  { sign: 12, lagnaEn: 'Pisces', lagnaHi: 'मीन', pair: [4, 1],
    pairDescEn: 'Jupiter (1st/10th lord) and Moon (5th lord)',
    pairDescHi: 'गुरु (1/10 भावेश) और चंद्र (5वें भावेश)',
    lordsEn: 'Jupiter as lagna+10th lord (kendra) with Moon as 5th lord (trikona)',
    lordsHi: 'गुरु लग्नेश+10वें भावेश (केन्द्र) का चंद्र 5वें भावेश (त्रिकोण) से संबंध' },
  // Pisces — Jupiter (1st/10th) + Mars (2nd/9th)  — primary is Mars+Moon
  { sign: 12, lagnaEn: 'Pisces', lagnaHi: 'मीन', pair: [4, 2],
    pairDescEn: 'Jupiter (1st/10th lord) and Mars (2nd/9th lord)',
    pairDescHi: 'गुरु (1/10 भावेश) और मंगल (2/9 भावेश)',
    lordsEn: 'Jupiter as lagna+10th lord with Mars as 9th lord — dharma-karma axis',
    lordsHi: 'गुरु लग्नेश+10वें भावेश का मंगल 9वें भावेश से संबंध — धर्म-कर्म अक्ष' },
];

function buildSecondaryRule(cfg: SecondaryPairConfig, index: number): YogaRule {
  const signName = cfg.lagnaEn.toLowerCase();
  const [p1, p2] = cfg.pair;

  return {
    id: `per-lagna-raja-${signName}-${index + 2}`,
    name: {
      en: `Raja Yoga for ${cfg.lagnaEn} Lagna (secondary)`,
      hi: `${cfg.lagnaHi} लग्न राजयोग (द्वितीय)`,
      sa: `${cfg.lagnaEn}लग्नराजयोगः`,
    },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.34-35',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        if (ctx.ascendantSign !== cfg.sign) {
          return { present: false, involvedPlanets: [] };
        }
        if (!arePlanetsConnected(ctx, p1, p2)) {
          return { present: false, involvedPlanets: [] };
        }
        let connectionType = 'unknown';
        if (ctx.areConjunct(p1, p2)) connectionType = 'conjunction';
        else {
          const h1 = ctx.planetHouse(p1);
          const h2 = ctx.planetHouse(p2);
          if (ctx.doesAspect(p1, h2) && ctx.doesAspect(p2, h1)) connectionType = 'mutual_aspect';
          const s1 = ctx.planetSign(p1);
          const s2 = ctx.planetSign(p2);
          if (SIGN_LORDS[s1] === p2 && SIGN_LORDS[s2] === p1) connectionType = 'exchange';
        }
        return { present: true, involvedPlanets: [p1, p2], customData: { lagna: cfg.lagnaEn, connectionType, secondary: true } };
      },
    },

    assessStrength: perLagnaRajaStrength,
    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 2, // secondary pairs have slightly lower impact than primary
    formationRule: {
      en: `${cfg.pairDescEn} connected by conjunction, mutual aspect, or sign exchange — ${cfg.lordsEn}`,
      hi: `${cfg.pairDescHi} का युति, परस्पर दृष्टि या राशि परिवर्तन से संबंध — ${cfg.lordsHi}`,
    },
    description: {
      en: `Secondary Raja Yoga for ${cfg.lagnaEn} lagna: ${cfg.lordsEn}. A valid kendra-trikona combination per BPHS, though less potent than the primary yogakaraka pair. Still confers authority and professional success when both planets are well-placed.`,
      hi: `${cfg.lagnaHi} लग्न का द्वितीय राजयोग: ${cfg.lordsHi}। BPHS के अनुसार एक मान्य केन्द्र-त्रिकोण संयोजन। प्राथमिक योगकारक जोड़ी से कम शक्तिशाली पर फिर भी अधिकार और व्यावसायिक सफलता प्रदान करता है।`,
    },
  };
}

/**
 * 12 primary per-lagna Raja Yoga rules (strongest yogakaraka pair per lagna)
 * + ~26 secondary kendra-trikona pair rules.
 * BPHS Ch.34-35.
 */
export const PER_LAGNA_RAJA_RULES: YogaRule[] = [
  ...LAGNA_CONFIGS.map(buildRule),
  ...SECONDARY_PAIRS.map((cfg, i) => buildSecondaryRule(cfg, i)),
];
