/**
 * Raja Yoga Rules
 *
 * Raja Yogas — the most prized combinations in Vedic astrology indicating
 * power, authority, status, and material success. These yogas are formed
 * primarily by connections between lords of kendras and trikonas.
 *
 * Sources: BPHS Ch.34-35, Phaladeepika Ch.6, Saravali, Jataka Parijata
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';
import { KENDRA_HOUSES, TRIKONA_HOUSES, DUSTHANA_HOUSES, NATURAL_BENEFIC_IDS } from '../utils';
import { EXALTATION_SIGNS, DEBILITATION_SIGNS, SIGN_LORDS } from '@/lib/constants/dignities';

/** @deprecated Alias — use NATURAL_BENEFIC_IDS from utils.ts */
const NATURAL_BENEFICS = NATURAL_BENEFIC_IDS;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if two house lords are connected via conjunction, exchange, or mutual aspect.
 * Returns the connection types found.
 */
function checkLordConnection(
  ctx: YogaContext,
  house1: number,
  house2: number,
): { connected: boolean; types: string[]; lord1: number; lord2: number } {
  const lord1 = ctx.houseLord(house1);
  const lord2 = ctx.houseLord(house2);
  const types: string[] = [];

  // Same lord rules both houses — inherently connected
  if (lord1 === lord2) {
    return { connected: true, types: ['same_lord'], lord1, lord2 };
  }

  const lord1House = ctx.planetHouse(lord1);
  const lord2House = ctx.planetHouse(lord2);

  // Conjunction
  if (lord1House === lord2House) types.push('conjunction');

  // Exchange (Parivartana): lord1 in house2 AND lord2 in house1
  if (lord1House === house2 && lord2House === house1) types.push('exchange');

  // Mutual aspect
  if (ctx.doesAspect(lord1, lord2House) && ctx.doesAspect(lord2, lord1House)) {
    types.push('mutual_aspect');
  }

  return { connected: types.length > 0, types, lord1, lord2 };
}

/**
 * Assess strength based on dignity of involved planets and their house placement.
 * Stronger: exalted/own planets in kendras. Weaker: debilitated/combust planets.
 */
function rajaYogaStrength(
  ctx: YogaContext,
  result: YogaDetectionResult,
): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strongFactors = 0;
  let weakFactors = 0;

  for (const pid of planets) {
    const house = ctx.planetHouse(pid);
    const dignity = ctx.dignity(pid);

    if (dignity === 'exalted' || dignity === 'moolatrikona') strongFactors += 2;
    if (dignity === 'own') strongFactors++;
    if (ctx.isKendra(house)) strongFactors++;
    if (ctx.isTrikona(house)) strongFactors++;

    if (dignity === 'debilitated') weakFactors += 2;
    if (ctx.isCombust(pid)) weakFactors++;
    if (ctx.isDusthana(house)) weakFactors++;
  }

  if (strongFactors >= 3 && weakFactors === 0) return 'Strong';
  if (weakFactors >= 2) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Raja Yoga Rules
// ─────────────────────────────────────────────────────────────────────────────

export const RAJA_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Dharma-Karmadhipati Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Dharma-Karmadhipati Yoga
   *
   * 9th lord (Dharma) and 10th lord (Karma) in conjunction, exchange, or mutual aspect.
   * The king of Raja Yogas — the union of righteousness and action produces
   * the highest form of success and authority.
   *
   * Source: BPHS Ch.34 v.15
   */
  {
    id: 'dharma-karmadhipati',
    name: { en: 'Dharma-Karmadhipati Yoga', hi: 'धर्म-कर्माधिपति योग', sa: 'धर्मकर्माधिपतियोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.34 v.15',

    conditions: {
      type: 'lord_connection',
      house1: 9,
      house2: 10,
      connectionType: 'any',
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 3,

    formationRule: {
      en: '9th lord and 10th lord in conjunction, exchange, or mutual aspect',
      hi: 'नवम भाव और दशम भाव के स्वामी की युति, परिवर्तन, या परस्पर दृष्टि',
    },
    description: {
      en: 'Dharma-Karmadhipati Yoga is the premier Raja Yoga — the union of the lord of dharma (9th house) with the lord of karma (10th house). It bestows authority, fame, and worldly success built on a foundation of righteous conduct. The native rises to positions of power through both merit and fortune, often achieving recognition in their chosen field.',
      hi: 'धर्म-कर्माधिपति योग प्रमुख राजयोग है — धर्म के स्वामी (नवम भाव) और कर्म के स्वामी (दशम भाव) का मिलन। यह धार्मिक आचरण की नींव पर अधिकार, यश और सांसारिक सफलता प्रदान करता है। जातक योग्यता और भाग्य दोनों से सत्ता के पदों पर पहुंचता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Kendra-Trikona Raja Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Kendra-Trikona Raja Yoga
   *
   * Lord of a kendra (1/4/7/10) connected with lord of a trikona (1/5/9).
   * The general Raja Yoga formula from BPHS. Multiple instances are possible
   * (e.g. 4th lord + 5th lord AND 10th lord + 9th lord in the same chart).
   *
   * House 1 is both a kendra and a trikona, so it connects with both groups.
   *
   * Source: BPHS Ch.34 v.2-5
   */
  {
    id: 'kendra-trikona-raja',
    name: { en: 'Kendra-Trikona Raja Yoga', hi: 'केन्द्र-त्रिकोण राजयोग', sa: 'केन्द्रत्रिकोणराजयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.34 v.2-5',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const allPlanets: number[] = [];
        const pairs: Array<{ kendra: number; trikona: number; types: string[] }> = [];

        // Iterate all kendra-trikona lord pairs (excluding 1-1 self-pair)
        for (const kh of KENDRA_HOUSES) {
          for (const th of TRIKONA_HOUSES) {
            // Skip same house (house 1 is both kendra and trikona)
            if (kh === th) continue;

            const result = checkLordConnection(ctx, kh, th);
            if (result.connected) {
              pairs.push({ kendra: kh, trikona: th, types: result.types });
              allPlanets.push(result.lord1, result.lord2);
            }
          }
        }

        const uniquePlanets = [...new Set(allPlanets)];
        const present = pairs.length > 0;

        return {
          present,
          involvedPlanets: present ? uniquePlanets : [],
          customData: present ? { pairs, instanceCount: pairs.length } : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { instanceCount?: number } | undefined;
      const instances = data?.instanceCount ?? 0;

      // Multiple instances strengthen the yoga
      if (instances >= 3) return 'Strong';

      // Check dignity of involved planets
      const base = rajaYogaStrength(ctx, result);
      if (instances >= 2 && base !== 'Weak') return 'Strong';

      return base;
    },

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Lord of a kendra (1/4/7/10) connected with lord of a trikona (1/5/9) via conjunction, exchange, or mutual aspect',
      hi: 'केन्द्र (1/4/7/10) और त्रिकोण (1/5/9) के स्वामी की युति, परिवर्तन, या परस्पर दृष्टि',
    },
    description: {
      en: 'Kendra-Trikona Raja Yoga is the foundational formula for royal combinations in Vedic astrology. When lords of angular houses (power, action) unite with lords of trinal houses (fortune, dharma), the native gains authority and success. Multiple instances in one chart amplify the effect, creating a powerful destiny for leadership and achievement.',
      hi: 'केन्द्र-त्रिकोण राजयोग वैदिक ज्योतिष में राज योग का मूल सूत्र है। जब केन्द्र भाव (शक्ति, कर्म) के स्वामी त्रिकोण भाव (भाग्य, धर्म) के स्वामी से मिलते हैं, तो जातक को अधिकार और सफलता प्राप्त होती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Viparita Raja Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Viparita Raja Yoga
   *
   * Lords of dusthanas (6th, 8th, 12th) placed in other dusthanas.
   * Adversity transformed into advantage — the evil lords confine their
   * negativity to the houses of suffering, neutralising each other.
   *
   * Three classical variants:
   * - Harsha Yoga: 6th lord in 6th, 8th, or 12th
   * - Sarala Yoga: 8th lord in 6th, 8th, or 12th
   * - Vimala Yoga: 12th lord in 6th, 8th, or 12th
   *
   * Source: BPHS Ch.35 v.7
   */
  {
    id: 'viparita-raja',
    name: { en: 'Viparita Raja Yoga', hi: 'विपरीत राजयोग', sa: 'विपरीतराजयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35 v.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const variants: string[] = [];
        const involvedPlanets: number[] = [];

        // Harsha: 6th lord in OTHER dusthanas (8th or 12th), not in 6th itself
        const lord6 = ctx.houseLord(6);
        const lord6House = ctx.planetHouse(lord6);
        if (DUSTHANA_HOUSES.filter(h => h !== 6).includes(lord6House)) {
          variants.push('Harsha');
          involvedPlanets.push(lord6);
        }

        // Sarala: 8th lord in OTHER dusthanas (6th or 12th), not in 8th itself
        const lord8 = ctx.houseLord(8);
        const lord8House = ctx.planetHouse(lord8);
        if (DUSTHANA_HOUSES.filter(h => h !== 8).includes(lord8House)) {
          variants.push('Sarala');
          involvedPlanets.push(lord8);
        }

        // Vimala: 12th lord in OTHER dusthanas (6th or 8th), not in 12th itself
        const lord12 = ctx.houseLord(12);
        const lord12House = ctx.planetHouse(lord12);
        if (DUSTHANA_HOUSES.filter(h => h !== 12).includes(lord12House)) {
          variants.push('Vimala');
          involvedPlanets.push(lord12);
        }

        const uniquePlanets = [...new Set(involvedPlanets)];
        const present = variants.length > 0;

        return {
          present,
          involvedPlanets: present ? uniquePlanets : [],
          customData: present ? { variants, variantCount: variants.length } : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { variantCount?: number } | undefined;
      const count = data?.variantCount ?? 0;

      // All three variants = very strong
      if (count === 3) return 'Strong';

      // Check dignity of involved lords
      const base = rajaYogaStrength(ctx, result);
      if (count >= 2 && base !== 'Weak') return 'Strong';

      return base;
    },

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Lords of dusthanas (6th, 8th, 12th) placed in other dusthanas — Harsha, Sarala, or Vimala variants',
      hi: 'दुष्ट भावों (6, 8, 12) के स्वामी अन्य दुष्ट भावों में — हर्ष, सरल, या विमल प्रकार',
    },
    description: {
      en: 'Viparita Raja Yoga transforms adversity into triumph. When dusthana lords confine themselves to other dusthanas, their negative energies cancel each other out, paradoxically creating opportunities from obstacles. The native may experience sudden reversals of fortune — rising unexpectedly from difficult circumstances. Harsha brings victory over enemies, Sarala grants longevity and resilience, and Vimala bestows spiritual liberation and freedom from losses.',
      hi: 'विपरीत राजयोग विपत्ति को विजय में बदलता है। जब दुष्ट भाव के स्वामी अन्य दुष्ट भावों में होते हैं, तो उनकी नकारात्मक ऊर्जा एक-दूसरे को निष्क्रिय कर देती है। जातक को अप्रत्याशित रूप से कठिन परिस्थितियों से उभरने का अवसर मिलता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Neechabhanga Raja Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Neechabhanga Raja Yoga
   *
   * Debilitation of a planet cancelled by specific conditions, converting
   * weakness into extraordinary strength. BPHS Ch.34 v.22.
   *
   * Cancellation conditions (any one is sufficient):
   * (a) Lord of the debilitation sign is in kendra from Lagna or Moon
   * (b) Lord of the planet's exaltation sign is in kendra from Lagna or Moon
   * (c) Debilitated planet is conjunct or aspected by the debilitation sign's lord
   * (d) Debilitated planet is in its exaltation sign in Navamsha
   *     (Note: Navamsha check requires D9 data — omitted here if not available)
   *
   * Source: BPHS Ch.34 v.22; Phaladeepika Ch.7
   */
  {
    id: 'neechabhanga-raja',
    name: { en: 'Neechabhanga Raja Yoga', hi: 'नीचभंग राजयोग', sa: 'नीचभङ्गराजयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.34 v.22; Phaladeepika Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const results: Array<{
          planetId: number;
          debilitationSign: number;
          cancellationReasons: string[];
        }> = [];

        // Check each planet (Sun=0 through Saturn=6) for debilitation + cancellation
        for (let pid = 0; pid <= 6; pid++) {
          const sign = ctx.planetSign(pid);
          const debSign = DEBILITATION_SIGNS[pid];
          if (sign !== debSign) continue; // Not debilitated

          const cancellationReasons: string[] = [];

          // Lord of the debilitation sign
          const debSignLord = SIGN_LORDS[debSign];

          // Lord of the exaltation sign
          const exaltSign = EXALTATION_SIGNS[pid];
          const exaltSignLord = exaltSign !== undefined ? SIGN_LORDS[exaltSign] : undefined;

          // (a) Lord of debilitation sign in kendra from Lagna or Moon
          if (debSignLord !== undefined) {
            const debLordHouse = ctx.planetHouse(debSignLord);
            if (ctx.isKendra(debLordHouse)) {
              cancellationReasons.push('debilitation_sign_lord_in_kendra_from_lagna');
            }
            // From Moon
            const moonHouse = ctx.planetHouse(1);
            const offsetFromMoon = ctx.houseOffset(moonHouse, debLordHouse);
            if ([1, 4, 7, 10].includes(offsetFromMoon)) {
              cancellationReasons.push('debilitation_sign_lord_in_kendra_from_moon');
            }
          }

          // (b) Lord of exaltation sign in kendra from Lagna or Moon
          if (exaltSignLord !== undefined) {
            const exaltLordHouse = ctx.planetHouse(exaltSignLord);
            if (ctx.isKendra(exaltLordHouse)) {
              cancellationReasons.push('exaltation_sign_lord_in_kendra_from_lagna');
            }
            const moonHouse = ctx.planetHouse(1);
            const offsetFromMoon = ctx.houseOffset(moonHouse, exaltLordHouse);
            if ([1, 4, 7, 10].includes(offsetFromMoon)) {
              cancellationReasons.push('exaltation_sign_lord_in_kendra_from_moon');
            }
          }

          // (c) Debilitated planet conjunct or aspected by debilitation sign lord
          if (debSignLord !== undefined && debSignLord !== pid) {
            const pidHouse = ctx.planetHouse(pid);
            if (ctx.areConjunct(pid, debSignLord)) {
              cancellationReasons.push('conjunct_debilitation_sign_lord');
            } else if (ctx.doesAspect(debSignLord, pidHouse)) {
              cancellationReasons.push('aspected_by_debilitation_sign_lord');
            }
          }

          // (d) Navamsha exaltation check omitted — requires D9 data not in YogaContext

          if (cancellationReasons.length > 0) {
            results.push({ planetId: pid, debilitationSign: debSign, cancellationReasons });
          }
        }

        const present = results.length > 0;
        const involvedPlanets = results.map((r) => r.planetId);

        // Also include the cancelling lords
        for (const r of results) {
          const debLord = SIGN_LORDS[r.debilitationSign];
          if (debLord !== undefined && !involvedPlanets.includes(debLord)) {
            involvedPlanets.push(debLord);
          }
        }

        return {
          present,
          involvedPlanets: present ? [...new Set(involvedPlanets)] : [],
          customData: present
            ? { debilitatedPlanets: results, count: results.length }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as {
        debilitatedPlanets?: Array<{ cancellationReasons: string[] }>;
        count?: number;
      } | undefined;

      if (!data?.debilitatedPlanets) return 'Moderate';

      // Multiple cancellation reasons for same planet = stronger
      const maxReasons = Math.max(...data.debilitatedPlanets.map((p) => p.cancellationReasons.length));

      if (maxReasons >= 3) return 'Strong';
      if (maxReasons >= 2) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 3,

    formationRule: {
      en: 'A debilitated planet\'s weakness is cancelled by specific conditions: sign lord in kendra, exaltation sign lord in kendra, or conjunction/aspect from the sign lord',
      hi: 'नीच ग्रह की दुर्बलता विशिष्ट शर्तों से निरस्त: राशि स्वामी केन्द्र में, उच्च राशि स्वामी केन्द्र में, या राशि स्वामी की युति/दृष्टि',
    },
    description: {
      en: 'Neechabhanga Raja Yoga is among the most powerful Raja Yogas — it converts a planet\'s greatest weakness (debilitation) into extraordinary strength. Like a person who overcomes great hardship to achieve remarkable success, the cancelled debilitation creates a drive and resilience that surpasses even naturally strong placements. The native often rises from humble or challenging beginnings to positions of great authority.',
      hi: 'नीचभंग राजयोग सबसे शक्तिशाली राजयोगों में से एक है — यह ग्रह की सबसे बड़ी कमज़ोरी (नीच) को असाधारण शक्ति में बदल देता है। जैसे कोई व्यक्ति कठिनाइयों पर विजय पाकर उल्लेखनीय सफलता प्राप्त करता है, वैसे ही नीचभंग ग्रह एक ऐसी प्रेरणा और दृढ़ता पैदा करता है जो स्वाभाविक रूप से बलवान ग्रहों से भी बढ़कर होती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Adhi Yoga (from Lagna)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Adhi Yoga (Raja variant — from Lagna)
   *
   * Natural benefics (Jupiter, Venus, Mercury) in the 6th, 7th, and 8th houses
   * from the ascendant. Bestows great authority, leadership, and command over others.
   *
   * Note: The Moon-based variant (benefics in 6/7/8 from Moon) is in chandra yogas.
   * This is the Lagna-based Raja Yoga variant per Phaladeepika.
   *
   * Source: Phaladeepika Ch.6 v.3; BPHS Ch.35
   */
  {
    id: 'adhi-yoga-raja',
    name: { en: 'Adhi Yoga', hi: 'अधि योग', sa: 'अधियोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Phaladeepika Ch.6 v.3; BPHS Ch.35',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Check for benefics in houses 6, 7, 8 from Lagna
        // Classical texts require at least benefics in all three houses,
        // but some authorities accept 2 of 3 for a partial formation.
        const beneficsIn6 = ctx.planetsInHouse(6).filter((pid) => ctx.isNaturalBenefic(pid));
        const beneficsIn7 = ctx.planetsInHouse(7).filter((pid) => ctx.isNaturalBenefic(pid));
        const beneficsIn8 = ctx.planetsInHouse(8).filter((pid) => ctx.isNaturalBenefic(pid));

        const occupiedCount = [beneficsIn6.length > 0, beneficsIn7.length > 0, beneficsIn8.length > 0]
          .filter(Boolean).length;

        // Full Adhi Yoga requires benefics in all three houses
        const present = occupiedCount === 3;
        const allBenefics = [...beneficsIn6, ...beneficsIn7, ...beneficsIn8];

        return {
          present,
          involvedPlanets: present ? allBenefics : [],
          customData: present
            ? { beneficsIn6, beneficsIn7, beneficsIn8 }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      // Stronger when the benefics are in good dignity
      let strongCount = 0;
      for (const pid of result.involvedPlanets) {
        const dignity = ctx.dignity(pid);
        if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') strongCount++;
        if (ctx.isCombust(pid)) strongCount--;
      }

      if (strongCount >= 2) return 'Strong';
      if (strongCount < 0) return 'Weak';
      return 'Moderate';
    },

    affectedDomains: ['career'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Natural benefics (Jupiter, Venus, Mercury, Moon) in the 6th, 7th, and 8th houses from Lagna',
      hi: 'प्राकृतिक शुभ ग्रह (गुरु, शुक्र, बुध, चंद्र) लग्न से छठे, सातवें और आठवें भाव में',
    },
    description: {
      en: 'Adhi Yoga bestows exceptional leadership qualities and authority. The benefics flanking the descendant create a protective aura that commands respect and obedience from others. The native is destined for positions of command — whether in government, military, business, or spiritual organisations. This is a yoga of natural authority rather than acquired power.',
      hi: 'अधि योग असाधारण नेतृत्व गुण और अधिकार प्रदान करता है। सप्तम भाव के आसपास शुभ ग्रह एक सुरक्षात्मक आभा बनाते हैं जो दूसरों से सम्मान और आज्ञापालन प्राप्त करती है। जातक कमान के पदों के लिए नियत होता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Amala Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Amala Yoga — Spotless Reputation
   *
   * A natural benefic (Jupiter, Venus, Mercury, or Moon) in the 10th house
   * from Lagna or Moon. Grants an untarnished reputation, ethical conduct,
   * and lasting fame through righteous deeds.
   *
   * Source: BPHS Ch.35; Saravali
   */
  {
    id: 'amala-yoga',
    name: { en: 'Amala Yoga', hi: 'अमल योग', sa: 'अमलयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involvedPlanets: number[] = [];
        let fromLagna = false;
        let fromMoon = false;

        // Check 10th house from Lagna
        const planetsIn10 = ctx.planetsInHouse(10);
        const beneficsIn10 = planetsIn10.filter((pid) => ctx.isNaturalBenefic(pid));
        if (beneficsIn10.length > 0) {
          fromLagna = true;
          involvedPlanets.push(...beneficsIn10);
        }

        // Check 10th from Moon
        const moonHouse = ctx.planetHouse(1);
        const tenthFromMoon = ((moonHouse - 1 + 9) % 12) + 1; // 10th from Moon
        const planetsIn10FromMoon = ctx.planetsInHouse(tenthFromMoon);
        const beneficsIn10FromMoon = planetsIn10FromMoon.filter((pid) => ctx.isNaturalBenefic(pid));
        if (beneficsIn10FromMoon.length > 0) {
          fromMoon = true;
          involvedPlanets.push(...beneficsIn10FromMoon);
        }

        const present = fromLagna || fromMoon;

        return {
          present,
          involvedPlanets: present ? [...new Set(involvedPlanets)] : [],
          customData: present ? { fromLagna, fromMoon } : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { fromLagna?: boolean; fromMoon?: boolean } | undefined;

      // From both Lagna and Moon = strong
      if (data?.fromLagna && data?.fromMoon) return 'Strong';

      // Check dignity of the benefic
      for (const pid of result.involvedPlanets) {
        const dignity = ctx.dignity(pid);
        if (dignity === 'exalted' || dignity === 'own') return 'Strong';
        if (dignity === 'debilitated') return 'Weak';
      }

      return 'Moderate';
    },

    affectedDomains: ['career', 'spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'A natural benefic in the 10th house from Lagna or Moon',
      hi: 'लग्न या चंद्र से दशम भाव में प्राकृतिक शुभ ग्रह',
    },
    description: {
      en: 'Amala Yoga grants a spotless reputation and enduring fame. The benefic in the 10th house ensures the native\'s public image remains untarnished — they are known for ethical conduct, charitable works, and integrity. This yoga is particularly significant for careers in public service, law, education, and spiritual leadership.',
      hi: 'अमल योग निष्कलंक प्रतिष्ठा और स्थायी यश प्रदान करता है। दशम भाव में शुभ ग्रह सुनिश्चित करता है कि जातक की सार्वजनिक छवि निर्दोष रहे — वे नैतिक आचरण, दान कार्य और ईमानदारी के लिए जाने जाते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Mahabhagya Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Mahabhagya Yoga — Great Fortune
   *
   * Male chart: day birth (Sun above horizon) + Sun, Moon, and Lagna all in odd signs.
   * Female chart: night birth (Sun below horizon) + Sun, Moon, and Lagna all in even signs.
   *
   * Odd signs: Aries(1), Gemini(3), Leo(5), Libra(7), Sagittarius(9), Aquarius(11)
   * Even signs: Taurus(2), Cancer(4), Virgo(6), Scorpio(8), Capricorn(10), Pisces(12)
   *
   * Day birth approximation: Sun in houses 7-12 (above horizon in whole-sign)
   *
   * Source: Phaladeepika Ch.6 v.1; BPHS Ch.35
   */
  {
    id: 'mahabhagya',
    name: { en: 'Mahabhagya Yoga', hi: 'महाभाग्य योग', sa: 'महाभाग्ययोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Phaladeepika Ch.6 v.1; BPHS Ch.35',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const sunSign = ctx.planetSign(0);
        const moonSign = ctx.planetSign(1);
        const lagnaSign = ctx.ascendantSign;

        // Determine day/night birth from Sun's longitude relative to ascendant.
        // Day birth = Sun above horizon = Sun's longitude is in the 180° arc
        // behind (clockwise from) the ascendant. We compute the angular distance
        // from ascendant to Sun going forward; if > 180°, Sun is above horizon.
        const sunLong = ctx.planetLongitude(0);
        const ascLong = ctx.ascendantLongitude;
        const isDayBirth = ((sunLong - ascLong + 360) % 360) > 180;

        const isOdd = (sign: number) => sign % 2 === 1;
        const isEven = (sign: number) => sign % 2 === 0;

        let present = false;
        let variant = '';

        if (isDayBirth) {
          // Day-birth rule: all three in odd signs
          if (isOdd(sunSign) && isOdd(moonSign) && isOdd(lagnaSign)) {
            present = true;
            variant = 'day-birth';
          }
        } else {
          // Night-birth rule: all three in even signs
          if (isEven(sunSign) && isEven(moonSign) && isEven(lagnaSign)) {
            present = true;
            variant = 'night-birth';
          }
        }

        return {
          present,
          involvedPlanets: present ? [0, 1] : [], // Sun and Moon
          customData: present
            ? { variant, isDayBirth, sunSign, moonSign, lagnaSign }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      // Stronger when Sun and Moon are also well-placed (dignified, in kendras)
      const sunDignity = ctx.dignity(0);
      const moonDignity = ctx.dignity(1);

      let strongCount = 0;
      if (sunDignity === 'exalted' || sunDignity === 'own') strongCount++;
      if (moonDignity === 'exalted' || moonDignity === 'own') strongCount++;
      if (ctx.isKendra(ctx.planetHouse(0))) strongCount++;
      if (ctx.isKendra(ctx.planetHouse(1))) strongCount++;

      if (strongCount >= 3) return 'Strong';
      if (strongCount >= 1) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'Day birth: Sun, Moon, Lagna all in odd signs. Night birth: Sun, Moon, Lagna all in even signs',
      hi: 'दिन का जन्म: सूर्य, चंद्र, लग्न विषम राशियों में। रात का जन्म: सूर्य, चंद्र, लग्न सम राशियों में',
    },
    description: {
      en: 'Mahabhagya Yoga is a yoga of great fortune and blessed destiny. The alignment of both luminaries and the ascendant in signs matching the birth timing (day/night) creates a harmonious resonance that attracts good fortune throughout life. The native enjoys respect, comfortable circumstances, and a general sense that life supports their endeavours.',
      hi: 'महाभाग्य योग महान भाग्य और धन्य नियति का योग है। जन्म के समय (दिन/रात) के अनुसार दोनों प्रकाशमान ग्रहों और लग्न का संरेखण एक सामंजस्यपूर्ण अनुनाद पैदा करता है जो जीवन भर सौभाग्य आकर्षित करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Vasumati Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Vasumati Yoga — Immense Wealth
   *
   * ALL natural benefics (Jupiter, Venus, Mercury, Moon) in upachaya houses
   * (3, 6, 10, 11) from Moon. Every single benefic must be in an upachaya
   * from Moon for this yoga to form.
   *
   * Lesson T: Use .every(), NOT .some(). This yoga requires ALL benefics,
   * not just any one. Expected frequency: <5% of charts.
   *
   * Source: BPHS Ch.36; Saravali
   */
  {
    id: 'vasumati',
    name: { en: 'Vasumati Yoga', hi: 'वसुमती योग', sa: 'वसुमतीयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.36; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const moonHouse = ctx.planetHouse(1);
        const upachayaOffsets = [3, 6, 10, 11]; // Upachaya houses from Moon

        // ALL natural benefics must be in upachaya from Moon
        // Lesson T: .every() not .some() — this is a rare yoga requiring ALL benefics
        const allInUpachaya = NATURAL_BENEFICS.every((pid) => {
          const pHouse = ctx.planetHouse(pid);
          const offset = ctx.houseOffset(moonHouse, pHouse);
          return upachayaOffsets.includes(offset);
        });

        return {
          present: allInUpachaya,
          involvedPlanets: allInUpachaya ? [...NATURAL_BENEFICS] : [],
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      // Check dignity of each benefic
      let strongCount = 0;
      for (const pid of NATURAL_BENEFICS) {
        const dignity = ctx.dignity(pid);
        if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') strongCount++;
        if (ctx.isCombust(pid)) strongCount--;
      }

      if (strongCount >= 3) return 'Strong';
      if (strongCount <= 0) return 'Weak';
      return 'Moderate';
    },

    affectedDomains: ['wealth'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'All natural benefics (Jupiter, Venus, Mercury, Moon) in upachaya houses (3rd, 6th, 10th, 11th) from Moon',
      hi: 'सभी प्राकृतिक शुभ ग्रह (गुरु, शुक्र, बुध, चंद्र) चंद्र से उपचय भावों (3, 6, 10, 11) में',
    },
    description: {
      en: 'Vasumati Yoga is one of the premier wealth yogas in Vedic astrology. When all natural benefics occupy growth houses (upachaya) from the Moon, wealth accumulates steadily and substantially throughout life. The native has an innate ability to grow their resources, attract financial opportunities, and build lasting prosperity. This is a rare yoga — all four benefics must cooperate for it to form.',
      hi: 'वसुमती योग वैदिक ज्योतिष में प्रमुख धन योगों में से एक है। जब सभी प्राकृतिक शुभ ग्रह चंद्र से उपचय भावों में होते हैं, तो जीवन भर धन लगातार और पर्याप्त मात्रा में एकत्रित होता है। जातक में संसाधन बढ़ाने, वित्तीय अवसर आकर्षित करने और स्थायी समृद्धि बनाने की जन्मजात क्षमता होती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Chatussagara Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Chatussagara Yoga — Four Oceans
   *
   * All 4 kendras (1, 4, 7, 10) occupied by at least one planet each.
   * The four pillars of the chart are all activated, granting authority
   * and prominence from multiple directions.
   *
   * Source: Phaladeepika Ch.6; Saravali
   */
  {
    id: 'chatussagara',
    name: { en: 'Chatussagara Yoga', hi: 'चतुस्सागर योग', sa: 'चतुस्सागरयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Phaladeepika Ch.6; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const allPlanets: number[] = [];
        const allKendrasOccupied = KENDRA_HOUSES.every((h) => {
          const planets = ctx.planetsInHouse(h);
          if (planets.length > 0) allPlanets.push(...planets);
          return planets.length > 0;
        });

        return {
          present: allKendrasOccupied,
          involvedPlanets: allKendrasOccupied ? [...new Set(allPlanets)] : [],
        };
      },
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'All 4 kendra houses (1st, 4th, 7th, 10th) are occupied by at least one planet each',
      hi: 'सभी 4 केन्द्र भाव (1, 4, 7, 10) में कम से कम एक ग्रह स्थित है',
    },
    description: {
      en: 'Chatussagara Yoga — the "Four Oceans" yoga — forms when all four angular houses are occupied. The native commands respect from all directions and achieves prominence in career, home life, partnerships, and public standing simultaneously. This is a rare combination indicating a well-rounded authority figure.',
      hi: 'चतुस्सागर योग — "चार सागर" योग — तब बनता है जब सभी चार केन्द्र भाव ग्रहों से युक्त होते हैं। जातक को सभी दिशाओं से सम्मान प्राप्त होता है और करियर, गृह जीवन, साझेदारी और सार्वजनिक प्रतिष्ठा में एक साथ प्रमुखता प्राप्त करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Chatussagara Full Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Chatussagara Full Yoga — Benefics in all 4 kendras
   *
   * Natural benefics occupy all 4 kendras (1, 4, 7, 10). Even rarer than
   * the basic Chatussagara — the benefic influence on all angular houses
   * produces extraordinary fortune across all life domains.
   *
   * Source: Saravali; Jataka Parijata
   */
  {
    id: 'chatussagara-full',
    name: { en: 'Chatussagara Full Yoga', hi: 'पूर्ण चतुस्सागर योग', sa: 'पूर्णचतुस्सागरयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Saravali; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const beneficPlanets: number[] = [];
        const allKendrasHaveBenefic = KENDRA_HOUSES.every((h) => {
          const benefics = ctx.planetsInHouse(h).filter((pid) => ctx.isNaturalBenefic(pid));
          if (benefics.length > 0) beneficPlanets.push(...benefics);
          return benefics.length > 0;
        });

        return {
          present: allKendrasHaveBenefic,
          involvedPlanets: allKendrasHaveBenefic ? [...new Set(beneficPlanets)] : [],
        };
      },
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: 'all',
    domainImpactWeight: 3,

    formationRule: {
      en: 'Natural benefics (Jupiter, Venus, Mercury, Moon) occupy all 4 kendra houses (1st, 4th, 7th, 10th)',
      hi: 'प्राकृतिक शुभ ग्रह (गुरु, शुक्र, बुध, चंद्र) सभी 4 केन्द्र भावों (1, 4, 7, 10) में स्थित हैं',
    },
    description: {
      en: 'The Full Chatussagara Yoga is an exceptionally rare formation where benefic planets grace all four angular houses. This produces a life of extraordinary good fortune — the native is blessed in every major domain: health, career, relationships, and home. They are natural leaders with a magnetic personality that attracts opportunities effortlessly.',
      hi: 'पूर्ण चतुस्सागर योग एक अत्यंत दुर्लभ रचना है जहाँ शुभ ग्रह सभी चार केन्द्र भावों को सुशोभित करते हैं। यह असाधारण सौभाग्य का जीवन प्रदान करता है — जातक हर प्रमुख क्षेत्र में आशीर्वादित होता है: स्वास्थ्य, करियर, संबंध और गृह जीवन।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 11. Rajalakshana Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Rajalakshana Yoga — Royal Characteristics
   *
   * Strong 9th and 10th lords in kendras along with the lagna lord.
   * All three key lords — self (1st), fortune (9th), action (10th) —
   * converge in positions of power.
   *
   * Source: BPHS Ch.35; Jataka Parijata
   */
  {
    id: 'rajalakshana',
    name: { en: 'Rajalakshana Yoga', hi: 'राजलक्षण योग', sa: 'राजलक्षणयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord1 = ctx.houseLord(1);
        const lord9 = ctx.houseLord(9);
        const lord10 = ctx.houseLord(10);

        const lord1House = ctx.planetHouse(lord1);
        const lord9House = ctx.planetHouse(lord9);
        const lord10House = ctx.planetHouse(lord10);

        // All three must be in kendras
        const allInKendra = ctx.isKendra(lord1House) && ctx.isKendra(lord9House) && ctx.isKendra(lord10House);
        if (!allInKendra) return { present: false, involvedPlanets: [] };

        // 9th and 10th lords must be strong (not debilitated)
        const d9 = ctx.dignity(lord9);
        const d10 = ctx.dignity(lord10);
        if (d9 === 'debilitated' || d10 === 'debilitated') {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [...new Set([lord1, lord9, lord10])],
        };
      },
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: ['career'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Strong 9th lord and 10th lord both in kendras, along with lagna lord also in a kendra',
      hi: 'बलवान नवम और दशम भाव के स्वामी केन्द्र में, लग्न स्वामी भी केन्द्र में',
    },
    description: {
      en: 'Rajalakshana Yoga bestows royal characteristics — the native possesses the bearing, authority, and fortune of a leader. With the lords of self, dharma, and karma all positioned in angular houses, every pillar of success is activated. The native rises to prominence through a combination of personal strength, righteous conduct, and decisive action.',
      hi: 'राजलक्षण योग राजसी गुण प्रदान करता है — जातक में नेता की गरिमा, अधिकार और भाग्य होता है। स्वयं, धर्म और कर्म के स्वामी सभी केन्द्र भावों में होने से, सफलता का हर स्तंभ सक्रिय होता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 12. Parvata Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Parvata Yoga — Mountain of Fortune
   *
   * Variant A: Benefics in kendras AND no malefics in kendras.
   * Variant B: 6th and 8th lords in 6th and 8th (mutual dusthana).
   *
   * Source: BPHS Ch.35; Phaladeepika Ch.6
   */
  {
    id: 'parvata',
    name: { en: 'Parvata Yoga', hi: 'पर्वत योग', sa: 'पर्वतयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35; Phaladeepika Ch.6',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involvedPlanets: number[] = [];
        let variant = '';

        // Variant A: Benefics in kendras, no malefics in kendras
        const beneficsInKendras: number[] = [];
        let maleficInKendra = false;
        for (const h of KENDRA_HOUSES) {
          for (const pid of ctx.planetsInHouse(h)) {
            if (ctx.isNaturalBenefic(pid)) {
              beneficsInKendras.push(pid);
            } else {
              maleficInKendra = true;
            }
          }
        }

        if (beneficsInKendras.length > 0 && !maleficInKendra) {
          variant = 'benefics_only_in_kendras';
          involvedPlanets.push(...beneficsInKendras);
        }

        // Variant B: 6th and 8th lords in 6th and 8th (either arrangement)
        if (!variant) {
          const lord6 = ctx.houseLord(6);
          const lord8 = ctx.houseLord(8);
          const lord6House = ctx.planetHouse(lord6);
          const lord8House = ctx.planetHouse(lord8);

          const mutualDusthana =
            (lord6House === 8 && lord8House === 6) ||
            (lord6House === 6 && lord8House === 8);

          if (mutualDusthana) {
            variant = 'dusthana_mutual';
            involvedPlanets.push(lord6, lord8);
          }
        }

        const present = variant !== '';
        return {
          present,
          involvedPlanets: present ? [...new Set(involvedPlanets)] : [],
          customData: present ? { variant } : undefined,
        };
      },
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Benefics in kendras with no malefics in kendras, OR 6th and 8th lords in 6th and 8th houses',
      hi: 'केन्द्र में शुभ ग्रह और कोई पाप ग्रह नहीं, या छठे और आठवें स्वामी छठे और आठवें भावों में',
    },
    description: {
      en: 'Parvata Yoga — the "Mountain" yoga — grants a solid, unshakeable foundation for success. In the benefic variant, kendras free of malefic influence allow the native\'s positive qualities to flourish without obstruction. In the dusthana variant, the lords of suffering confine themselves, neutralising adversity. Either way, the native enjoys career stability, wealth, and good reputation.',
      hi: 'पर्वत योग — "पहाड़" योग — सफलता के लिए ठोस, अटल नींव प्रदान करता है। शुभ प्रकार में, पाप ग्रहों से मुक्त केन्द्र जातक के सकारात्मक गुणों को बिना बाधा के पनपने देते हैं। दुस्थान प्रकार में, कष्ट के स्वामी स्वयं को सीमित कर लेते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 13. Kahala Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Kahala Yoga
   *
   * 4th lord and 9th lord in mutual kendras, lagna lord strong
   * (in kendra/trikona, not debilitated).
   *
   * Source: BPHS Ch.35; Phaladeepika Ch.6
   */
  {
    id: 'kahala',
    name: { en: 'Kahala Yoga', hi: 'कहल योग', sa: 'कहलयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35; Phaladeepika Ch.6',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord4 = ctx.houseLord(4);
        const lord9 = ctx.houseLord(9);
        const lord4House = ctx.planetHouse(lord4);
        const lord9House = ctx.planetHouse(lord9);

        // Both must be in kendras
        if (!ctx.isKendra(lord4House) || !ctx.isKendra(lord9House)) {
          return { present: false, involvedPlanets: [] };
        }

        // Lagna lord must be strong: in kendra or trikona, not debilitated
        const lord1 = ctx.houseLord(1);
        const lord1House = ctx.planetHouse(lord1);
        const lord1Dignity = ctx.dignity(lord1);
        const lagnaStrong = (ctx.isKendra(lord1House) || ctx.isTrikona(lord1House))
          && lord1Dignity !== 'debilitated';

        if (!lagnaStrong) return { present: false, involvedPlanets: [] };

        return {
          present: true,
          involvedPlanets: [...new Set([lord4, lord9, lord1])],
        };
      },
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: ['career', 'family'],
    domainImpactWeight: 1,

    formationRule: {
      en: '4th lord and 9th lord in mutual kendras, lagna lord strong (in kendra/trikona, not debilitated)',
      hi: 'चतुर्थ और नवम स्वामी परस्पर केन्द्र में, लग्न स्वामी बलवान',
    },
    description: {
      en: 'Kahala Yoga connects domestic happiness (4th house) with fortune (9th house) through angular strength, backed by a strong lagna lord. The native enjoys a happy family life alongside career success. They inherit or build substantial property and are respected in their community.',
      hi: 'कहल योग घरेलू सुख (चतुर्थ भाव) को भाग्य (नवम भाव) से केन्द्र की शक्ति के माध्यम से जोड़ता है। जातक करियर सफलता के साथ सुखी पारिवारिक जीवन का आनंद लेता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 14. Gauri Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Gauri Yoga
   *
   * Moon in own sign (Cancer) or exalted sign (Taurus), aspected by Jupiter
   * who is in a kendra from lagna.
   *
   * Lesson T: Aspect direction is FROM Jupiter TO Moon's house.
   *
   * Source: Phaladeepika Ch.6; Saravali
   */
  {
    id: 'gauri',
    name: { en: 'Gauri Yoga', hi: 'गौरी योग', sa: 'गौरीयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Phaladeepika Ch.6; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Moon must be in own sign (Cancer=4) or exalted sign (Taurus=2)
        const moonSign = ctx.planetSign(1);
        if (moonSign !== 4 && moonSign !== 2) {
          return { present: false, involvedPlanets: [] };
        }

        // Jupiter must be in a kendra from lagna
        const jupHouse = ctx.planetHouse(4);
        if (!ctx.isKendra(jupHouse)) {
          return { present: false, involvedPlanets: [] };
        }

        // Jupiter must aspect Moon's house (FROM Jupiter TO Moon's house — Lesson T)
        const moonHouse = ctx.planetHouse(1);
        if (!ctx.doesAspect(4, moonHouse)) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [1, 4], // Moon, Jupiter
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const moonDignity = ctx.dignity(1);
      const jupDignity = ctx.dignity(4);

      let score = 0;
      if (moonDignity === 'exalted') score += 2;
      if (moonDignity === 'own') score += 1;
      if (jupDignity === 'exalted' || jupDignity === 'own') score += 2;
      if (ctx.isCombust(4)) score -= 2;

      if (score >= 3) return 'Strong';
      if (score >= 1) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['family', 'spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Moon in own sign (Cancer) or exalted (Taurus), aspected by Jupiter in a kendra from lagna',
      hi: 'चंद्र स्वराशि (कर्क) या उच्च (वृषभ) में, लग्न से केन्द्र में स्थित गुरु की दृष्टि से',
    },
    description: {
      en: 'Gauri Yoga — named after the divine mother — bestows domestic bliss, spiritual inclination, and material comfort. A strong Moon receiving Jupiter\'s benevolent gaze creates a nurturing, wise, and prosperous individual who excels in both worldly and spiritual pursuits.',
      hi: 'गौरी योग — दिव्य माता के नाम पर — घरेलू आनंद, आध्यात्मिक प्रवृत्ति और भौतिक सुख प्रदान करता है। शक्तिशाली चंद्रमा पर गुरु की कृपादृष्टि एक पालनकर्ता, बुद्धिमान और समृद्ध व्यक्ति बनाती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 15. Bharati Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Bharati Yoga — Saraswati's Blessing
   *
   * 2nd lord conjunct 5th lord, with Jupiter in a kendra or trikona.
   * Wealth combined with learning and eloquence.
   *
   * Source: Jataka Parijata; Saravali
   */
  {
    id: 'bharati',
    name: { en: 'Bharati Yoga', hi: 'भारती योग', sa: 'भारतीयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Jataka Parijata; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord2 = ctx.houseLord(2);
        const lord5 = ctx.houseLord(5);

        // 2nd lord and 5th lord must be conjunct
        if (!ctx.areConjunct(lord2, lord5)) {
          return { present: false, involvedPlanets: [] };
        }

        // Jupiter must be in a kendra or trikona
        const jupHouse = ctx.planetHouse(4);
        if (!ctx.isKendra(jupHouse) && !ctx.isTrikona(jupHouse)) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [...new Set([lord2, lord5, 4])],
        };
      },
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: ['education', 'wealth'],
    domainImpactWeight: 1,

    formationRule: {
      en: '2nd lord conjunct 5th lord, with Jupiter in a kendra or trikona',
      hi: 'द्वितीय स्वामी पंचम स्वामी से युक्त, गुरु केन्द्र या त्रिकोण में',
    },
    description: {
      en: 'Bharati Yoga grants eloquence, learning, and wealth through knowledge. The conjunction of the lords of speech/wealth (2nd) and intelligence/merit (5th), blessed by Jupiter\'s angular presence, creates a brilliant communicator who prospers through education, writing, or scholarship.',
      hi: 'भारती योग वाक्पटुता, विद्या और ज्ञान से धन प्रदान करता है। वाणी/धन (द्वितीय) और बुद्धि/पुण्य (पंचम) के स्वामियों की युति, गुरु की केन्द्रीय उपस्थिति से आशीर्वादित, एक प्रतिभाशाली वक्ता बनाती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 16. Shrinatha Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Shrinatha Yoga
   *
   * 7th lord in 10th, 10th lord in 9th, 9th lord strong (in kendra/trikona,
   * not debilitated).
   *
   * Source: Jataka Parijata; BPHS Ch.35
   */
  {
    id: 'shrinatha',
    name: { en: 'Shrinatha Yoga', hi: 'श्रीनाथ योग', sa: 'श्रीनाथयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Jataka Parijata; BPHS Ch.35',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord7 = ctx.houseLord(7);
        const lord10 = ctx.houseLord(10);
        const lord9 = ctx.houseLord(9);

        // 7th lord in 10th
        if (ctx.planetHouse(lord7) !== 10) return { present: false, involvedPlanets: [] };

        // 10th lord in 9th
        if (ctx.planetHouse(lord10) !== 9) return { present: false, involvedPlanets: [] };

        // 9th lord strong: in kendra/trikona, not debilitated
        const lord9House = ctx.planetHouse(lord9);
        const lord9Dignity = ctx.dignity(lord9);
        const lord9Strong = (ctx.isKendra(lord9House) || ctx.isTrikona(lord9House))
          && lord9Dignity !== 'debilitated';

        if (!lord9Strong) return { present: false, involvedPlanets: [] };

        return {
          present: true,
          involvedPlanets: [...new Set([lord7, lord10, lord9])],
        };
      },
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: ['career', 'spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: '7th lord in 10th house, 10th lord in 9th house, 9th lord strong (in kendra/trikona)',
      hi: 'सप्तम स्वामी दशम में, दशम स्वामी नवम में, नवम स्वामी बलवान',
    },
    description: {
      en: 'Shrinatha Yoga creates a chain of auspicious lord placements linking partnerships (7th), career (10th), and fortune (9th). The native achieves professional success through partnerships and righteous conduct. They are often recognised as a spiritual or moral authority in their field.',
      hi: 'श्रीनाथ योग साझेदारी (सप्तम), करियर (दशम) और भाग्य (नवम) को जोड़ने वाली शुभ स्वामी स्थिति की श्रृंखला बनाता है। जातक साझेदारी और धार्मिक आचरण से व्यावसायिक सफलता प्राप्त करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 17. Pushkala Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Pushkala Yoga — Abundance
   *
   * Lagna lord in a friend's sign, Moon in lagna, aspected by a friendly planet.
   * "Friendly planet" = a natural benefic that is also a friend of the lagna lord.
   * Simplified here: Moon in lagna, lagna lord in friend's sign, aspected by any benefic.
   *
   * Source: Phaladeepika Ch.6
   */
  {
    id: 'pushkala',
    name: { en: 'Pushkala Yoga', hi: 'पुष्कल योग', sa: 'पुष्कलयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Phaladeepika Ch.6',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Moon must be in lagna (house 1)
        if (ctx.planetHouse(1) !== 1) return { present: false, involvedPlanets: [] };

        // Lagna lord must be in a friend's sign
        const lord1 = ctx.houseLord(1);
        const lord1Dignity = ctx.dignity(lord1);
        if (lord1Dignity !== 'friend' && lord1Dignity !== 'own' && lord1Dignity !== 'exalted' && lord1Dignity !== 'moolatrikona') {
          return { present: false, involvedPlanets: [] };
        }

        // Moon must be aspected by a natural benefic
        const moonHouse = 1; // Already confirmed Moon in house 1
        const aspectingBenefics = NATURAL_BENEFIC_IDS.filter(
          (pid) => pid !== 1 && ctx.doesAspect(pid, moonHouse),
        );

        if (aspectingBenefics.length === 0) return { present: false, involvedPlanets: [] };

        return {
          present: true,
          involvedPlanets: [...new Set([1, lord1, ...aspectingBenefics])],
        };
      },
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: ['wealth'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Lagna lord in a friendly sign, Moon in lagna, aspected by a natural benefic',
      hi: 'लग्न स्वामी मित्र राशि में, चंद्र लग्न में, प्राकृतिक शुभ ग्रह की दृष्टि',
    },
    description: {
      en: 'Pushkala Yoga — "Abundance" — grants prosperity, fame, and a magnetic personality. The Moon in the ascendant gives emotional intelligence and public appeal, while the well-placed lagna lord and benefic aspects ensure that the native\'s efforts are rewarded with wealth and recognition.',
      hi: 'पुष्कल योग — "प्रचुरता" — समृद्धि, यश और आकर्षक व्यक्तित्व प्रदान करता है। लग्न में चंद्र भावनात्मक बुद्धि और जनाकर्षण देता है, जबकि सुस्थित लग्न स्वामी और शुभ दृष्टि सुनिश्चित करती है कि जातक के प्रयासों को धन और मान्यता से पुरस्कृत किया जाए।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 18. Akhanda Samrajya Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Akhanda Samrajya Yoga — Undivided Empire
   *
   * Jupiter rules the 2nd, 5th, or 11th house AND is in a kendra from Moon.
   * Very specific per lagna — Jupiter must lord one of these three houses.
   *
   * Jupiter rules Sagittarius (9) and Pisces (12).
   * Lagna where Jupiter lords 2nd: Scorpio (2nd=Sag) → Jup lords 2nd
   * Lagna where Jupiter lords 5th: Leo (5th=Sag), Scorpio (5th=Pisces)
   * Lagna where Jupiter lords 11th: Aquarius (11th=Sag), — not possible for Pisces
   *
   * Source: BPHS Ch.35 v.11
   */
  {
    id: 'akhanda-samrajya',
    name: { en: 'Akhanda Samrajya Yoga', hi: 'अखण्ड साम्राज्य योग', sa: 'अखण्डसाम्राज्ययोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35 v.11',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Check if Jupiter (4) lords the 2nd, 5th, or 11th house
        const lord2 = ctx.houseLord(2);
        const lord5 = ctx.houseLord(5);
        const lord11 = ctx.houseLord(11);

        const jupiterLordsRelevantHouse = lord2 === 4 || lord5 === 4 || lord11 === 4;
        if (!jupiterLordsRelevantHouse) return { present: false, involvedPlanets: [] };

        // Jupiter must be in a kendra from Moon
        const moonHouse = ctx.planetHouse(1);
        const jupHouse = ctx.planetHouse(4);
        const offset = ctx.houseOffset(moonHouse, jupHouse);
        const inKendraFromMoon = [1, 4, 7, 10].includes(offset);

        if (!inKendraFromMoon) return { present: false, involvedPlanets: [] };

        return {
          present: true,
          involvedPlanets: [4, 1], // Jupiter, Moon
          customData: {
            jupiterLords: [
              lord2 === 4 ? 2 : null,
              lord5 === 4 ? 5 : null,
              lord11 === 4 ? 11 : null,
            ].filter(Boolean),
          },
        };
      },
    },

    assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
      const jupDignity = ctx.dignity(4);
      if (jupDignity === 'exalted' || jupDignity === 'own' || jupDignity === 'moolatrikona') return 'Strong';
      if (ctx.isCombust(4)) return 'Weak';
      return 'Moderate';
    },

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 3,

    formationRule: {
      en: 'Jupiter lords the 2nd, 5th, or 11th house AND is in a kendra from Moon',
      hi: 'गुरु 2, 5 या 11वें भाव का स्वामी है और चंद्र से केन्द्र में है',
    },
    description: {
      en: 'Akhanda Samrajya Yoga — "Undivided Empire" — is one of the rarest and most powerful Raja Yogas. Jupiter ruling a wealth/gains house and positioned in a kendra from Moon creates an unassailable foundation of power and prosperity. The native commands vast resources and influence, maintaining authority that remains unchallenged.',
      hi: 'अखण्ड साम्राज्य योग — "अविभाजित साम्राज्य" — सबसे दुर्लभ और शक्तिशाली राजयोगों में से एक है। धन/लाभ भाव का स्वामी गुरु चंद्र से केन्द्र में शक्ति और समृद्धि की अजेय नींव बनाता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 19. Chamara Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Chamara Yoga
   *
   * Lagna lord exalted in a kendra.
   *
   * Source: Phaladeepika Ch.6; Saravali
   */
  {
    id: 'chamara',
    name: { en: 'Chamara Yoga', hi: 'चामर योग', sa: 'चामरयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Phaladeepika Ch.6; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord1 = ctx.houseLord(1);
        const lord1House = ctx.planetHouse(lord1);
        const lord1Dignity = ctx.dignity(lord1);

        const present = lord1Dignity === 'exalted' && ctx.isKendra(lord1House);

        return {
          present,
          involvedPlanets: present ? [lord1] : [],
        };
      },
    },

    assessStrength: (_ctx: YogaContext, result: YogaDetectionResult) => {
      // Lagna lord exalted in kendra is inherently strong
      return result.involvedPlanets.length > 0 ? 'Strong' : 'Moderate';
    },

    affectedDomains: ['career'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Lagna lord exalted in a kendra (1st, 4th, 7th, or 10th house)',
      hi: 'लग्न स्वामी केन्द्र (1, 4, 7, 10) में उच्च राशि में',
    },
    description: {
      en: 'Chamara Yoga forms when the ascendant lord achieves its highest dignity (exaltation) in an angular house. This is one of the purest Raja Yogas — the native radiates personal authority, earns respect effortlessly, and rises to prominent positions. The exalted lagna lord in a kendra is both strong and well-positioned to deliver its best results.',
      hi: 'चामर योग तब बनता है जब लग्न स्वामी केन्द्र भाव में अपनी उच्चतम गरिमा (उच्च) प्राप्त करता है। यह शुद्धतम राजयोगों में से एक है — जातक व्यक्तिगत अधिकार विकीर्ण करता है और सहज ही प्रमुख पदों पर पहुँचता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 20. Saraswati Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Saraswati Yoga — Education and Knowledge
   *
   * Mercury, Jupiter, and Venus all in kendras, trikonas, or the 2nd house.
   * The three natural significators of learning and wisdom converge in
   * auspicious houses.
   *
   * Source: BPHS Ch.36; Saravali
   */
  {
    id: 'saraswati',
    name: { en: 'Saraswati Yoga', hi: 'सरस्वती योग', sa: 'सरस्वतीयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.36; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const targetHouses = [1, 2, 4, 5, 7, 9, 10]; // kendras + trikonas + 2nd

        // Mercury (3), Jupiter (4), Venus (5) all in target houses
        const mercHouse = ctx.planetHouse(3);
        const jupHouse = ctx.planetHouse(4);
        const venHouse = ctx.planetHouse(5);

        const present = targetHouses.includes(mercHouse)
          && targetHouses.includes(jupHouse)
          && targetHouses.includes(venHouse);

        return {
          present,
          involvedPlanets: present ? [3, 4, 5] : [],
        };
      },
    },

    assessStrength: rajaYogaStrength,

    affectedDomains: ['education', 'spiritual'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Mercury, Jupiter, and Venus all in kendras (1/4/7/10), trikonas (1/5/9), or the 2nd house',
      hi: 'बुध, गुरु और शुक्र सभी केन्द्र (1/4/7/10), त्रिकोण (1/5/9) या द्वितीय भाव में',
    },
    description: {
      en: 'Saraswati Yoga — named after the goddess of learning — blesses the native with exceptional intellect, eloquence, and mastery of multiple subjects. Mercury provides analytical skill, Jupiter gives wisdom and teaching ability, Venus adds artistic refinement. Together in strong houses, they create a polymath who excels in education, the arts, and scholarly pursuits.',
      hi: 'सरस्वती योग — विद्या की देवी के नाम पर — जातक को असाधारण बुद्धि, वाक्पटुता और बहुविषयक निपुणता प्रदान करता है। बुध विश्लेषणात्मक कौशल, गुरु ज्ञान और शिक्षण क्षमता, शुक्र कलात्मक परिष्कार देता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 21. Surya Dasham Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Surya Dasham Yoga — Sun in the 10th House
   *
   * Sun placed in the 10th house where it achieves maximum directional
   * strength (dig bala). Grants authority, fame, and leadership.
   *
   * Source: BPHS Ch.34; Saravali
   */
  {
    id: 'surya-dasham',
    name: { en: 'Surya Dasham Yoga', hi: 'सूर्य दशम योग', sa: 'सूर्यदशमयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.34; Saravali',

    conditions: {
      type: 'planet_in_house',
      planetId: 0,
      houses: [10],
    },

    assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
      const sunDignity = ctx.dignity(0);
      if (sunDignity === 'exalted' || sunDignity === 'own' || sunDignity === 'moolatrikona') return 'Strong';
      if (sunDignity === 'debilitated') return 'Weak';
      return 'Moderate';
    },

    affectedDomains: ['career'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Sun placed in the 10th house (maximum directional strength — dig bala)',
      hi: 'सूर्य दशम भाव में (अधिकतम दिग् बल)',
    },
    description: {
      en: 'Sun in the 10th house achieves maximum directional strength (dig bala), powerfully activating the house of career, authority, and public standing. The native is drawn to leadership roles and earns recognition through their own effort and integrity. They command respect in professional settings and often hold positions of visible authority.',
      hi: 'सूर्य दशम भाव में अधिकतम दिग् बल प्राप्त करता है, करियर, अधिकार और सार्वजनिक प्रतिष्ठा के भाव को शक्तिशाली रूप से सक्रिय करता है। जातक नेतृत्व भूमिकाओं की ओर आकर्षित होता है और अपने प्रयास और ईमानदारी से मान्यता अर्जित करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 22. Nipuna Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Nipuna Yoga — Intelligence
   *
   * Sun, Moon, and Mercury in the same house (triple conjunction).
   * The combination of the two luminaries with the planet of intellect
   * produces sharp intelligence and communicative ability.
   *
   * Note: Mercury is always within ~28° of Sun, so Sun-Mercury conjunctions
   * are common; requiring Moon as well makes this moderately rare.
   *
   * Source: Phaladeepika Ch.6; Saravali
   */
  {
    id: 'nipuna',
    name: { en: 'Nipuna Yoga', hi: 'निपुण योग', sa: 'निपुणयोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Phaladeepika Ch.6; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const sunHouse = ctx.planetHouse(0);
        const moonHouse = ctx.planetHouse(1);
        const mercHouse = ctx.planetHouse(3);

        const present = sunHouse === moonHouse && moonHouse === mercHouse;

        return {
          present,
          involvedPlanets: present ? [0, 1, 3] : [],
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const house = ctx.planetHouse(0);

      // Stronger in kendras/trikonas
      if (ctx.isKendra(house) || ctx.isTrikona(house)) return 'Strong';
      if (ctx.isDusthana(house)) return 'Weak';
      return 'Moderate';
    },

    affectedDomains: ['education'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Sun, Moon, and Mercury all in the same house',
      hi: 'सूर्य, चंद्र और बुध एक ही भाव में',
    },
    description: {
      en: 'Nipuna Yoga — "Skilled" — produces sharp intelligence and versatile communication skills. The luminaries illuminating Mercury\'s intellectual faculty creates a quick, adaptive mind. The native excels at analysis, writing, public speaking, and any pursuit requiring mental agility. They grasp complex subjects rapidly and express ideas with clarity.',
      hi: 'निपुण योग — "कुशल" — तीव्र बुद्धि और बहुमुखी संवाद कौशल प्रदान करता है। प्रकाशमान ग्रह बुध की बौद्धिक क्षमता को प्रकाशित करते हुए एक तेज, अनुकूल मस्तिष्क बनाते हैं। जातक विश्लेषण, लेखन और वक्तृत्व में उत्कृष्ट होता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 23. Sunapha from Lagna
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Sunapha from Lagna
   *
   * Any planet (Sun through Saturn, excluding Rahu/Ketu) in the 2nd house
   * from the ascendant (not from Moon — that is the classical Sunapha).
   * Provides wealth and self-acquired resources.
   *
   * Source: Saravali; Jataka Parijata
   */
  {
    id: 'sunapha-from-lagna',
    name: { en: 'Sunapha from Lagna', hi: 'लग्न सुनफा योग', sa: 'लग्नसुनफायोगः' },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'Saravali; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Planets in 2nd house from lagna (house 2), excluding Rahu(7)/Ketu(8)
        const planetsIn2 = ctx.planetsInHouse(2).filter((pid) => pid <= 6);

        return {
          present: planetsIn2.length > 0,
          involvedPlanets: planetsIn2,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      let score = 0;
      for (const pid of result.involvedPlanets) {
        if (ctx.isNaturalBenefic(pid)) score += 2;
        const d = ctx.dignity(pid);
        if (d === 'exalted' || d === 'own') score += 1;
        if (d === 'debilitated') score -= 1;
      }

      if (score >= 3) return 'Strong';
      if (score >= 1) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['wealth'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'A planet (Sun through Saturn) occupies the 2nd house from the ascendant',
      hi: 'सूर्य से शनि तक कोई ग्रह लग्न से द्वितीय भाव में',
    },
    description: {
      en: 'Sunapha from Lagna activates the house of accumulated wealth and family resources. Any planet occupying the 2nd from the ascendant provides the native with the ability to build financial reserves. Benefics here bring wealth through ethical means; malefics through persistent effort and struggle.',
      hi: 'लग्न सुनफा संचित धन और पारिवारिक संसाधनों के भाव को सक्रिय करता है। लग्न से द्वितीय भाव में कोई भी ग्रह जातक को वित्तीय भंडार बनाने की क्षमता प्रदान करता है।',
    },
  },
];
