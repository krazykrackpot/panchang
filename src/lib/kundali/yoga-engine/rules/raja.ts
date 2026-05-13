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
import { EXALTATION_SIGNS, DEBILITATION_SIGNS, SIGN_LORDS } from '@/lib/constants/dignities';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const KENDRA_HOUSES = [1, 4, 7, 10];
const TRIKONA_HOUSES = [1, 5, 9];
const DUSTHANA_HOUSES = [6, 8, 12];

/** Natural benefic planet IDs: Moon(1), Mercury(3), Jupiter(4), Venus(5) */
const NATURAL_BENEFICS = [1, 3, 4, 5];

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

        // Harsha: 6th lord in 6/8/12
        const lord6 = ctx.houseLord(6);
        const lord6House = ctx.planetHouse(lord6);
        if (DUSTHANA_HOUSES.includes(lord6House)) {
          variants.push('Harsha');
          involvedPlanets.push(lord6);
        }

        // Sarala: 8th lord in 6/8/12
        const lord8 = ctx.houseLord(8);
        const lord8House = ctx.planetHouse(lord8);
        if (DUSTHANA_HOUSES.includes(lord8House)) {
          variants.push('Sarala');
          involvedPlanets.push(lord8);
        }

        // Vimala: 12th lord in 6/8/12
        const lord12 = ctx.houseLord(12);
        const lord12House = ctx.planetHouse(lord12);
        if (DUSTHANA_HOUSES.includes(lord12House)) {
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

        // Determine day/night birth from Sun's house
        // Sun in houses 7-12 = above horizon (day birth)
        // Sun in houses 1-6 = below horizon (night birth)
        // Lesson T: check lagna SIGN, not lagna LORD's sign
        const sunHouse = ctx.planetHouse(0);
        const isDayBirth = sunHouse >= 7 && sunHouse <= 12;

        const isOdd = (sign: number) => sign % 2 === 1;
        const isEven = (sign: number) => sign % 2 === 0;

        let present = false;
        let variant = '';

        if (isDayBirth) {
          // Male rule: all three in odd signs
          if (isOdd(sunSign) && isOdd(moonSign) && isOdd(lagnaSign)) {
            present = true;
            variant = 'male';
          }
        } else {
          // Female rule: all three in even signs
          if (isEven(sunSign) && isEven(moonSign) && isEven(lagnaSign)) {
            present = true;
            variant = 'female';
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
      en: 'Male: day birth + Sun, Moon, Lagna in odd signs. Female: night birth + Sun, Moon, Lagna in even signs',
      hi: 'पुरुष: दिन का जन्म + सूर्य, चंद्र, लग्न विषम राशियों में। स्त्री: रात का जन्म + सूर्य, चंद्र, लग्न सम राशियों में',
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
];
