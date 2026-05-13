/**
 * Tajika Yoga Rules
 *
 * Tajika yogas originate from the Tajika Neelakanthi system, primarily
 * used in Varshaphal (annual/solar return charts). Many are also
 * applicable to natal charts as they describe general planetary
 * relationships — dignity, aspects, combustion, and retrograde motion.
 *
 * Source: Tajika Neelakanthi, Tajika Yogasudharnava
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';
import { KENDRA_HOUSES, DUSTHANA_HOUSES, NATURAL_BENEFIC_IDS } from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
// Tajika-specific constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mean daily motion (deg/day) used to determine faster vs slower planet.
 * Tajika system: Moon > Mercury > Venus > Sun > Mars > Jupiter > Saturn.
 * Rahu/Ketu move ~0.053°/day retrograde.
 */
const MEAN_SPEED: Record<number, number> = {
  0: 0.9856,  // Sun
  1: 13.176,  // Moon
  2: 0.5240,  // Mars
  3: 1.383,   // Mercury (mean, varies 0.5–2.2)
  4: 0.0831,  // Jupiter
  5: 1.200,   // Venus (mean, varies 0.6–1.3)
  6: 0.0335,  // Saturn
  7: 0.053,   // Rahu
  8: 0.053,   // Ketu
};

/** Ithasala / Ishrafa default orb in degrees (Tajika tradition uses ~12°). */
const TAJIKA_ORB = 12;

/**
 * House offsets that constitute 6/8/12 from a reference house.
 * These are the dusthana positions in Tajika — signifying denial and obstruction.
 */
function isInDusthanaFrom(ctx: YogaContext, planetHouse: number, refHouse: number): boolean {
  const offset = ctx.houseOffset(refHouse, planetHouse);
  return offset === 6 || offset === 8 || offset === 12;
}

// ─────────────────────────────────────────────────────────────────────────────
// Strength assessors
// ─────────────────────────────────────────────────────────────────────────────

function tajikaStrengthByDignity(
  ctx: YogaContext,
  result: YogaDetectionResult,
): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strong = 0;
  let weak = 0;
  for (const pid of planets) {
    const d = ctx.dignity(pid);
    if (d === 'exalted' || d === 'moolatrikona') strong += 2;
    if (d === 'own') strong++;
    if (d === 'debilitated') weak += 2;
    if (ctx.isCombust(pid)) weak++;
    // Tajika tradition: retrograde planets are NOT weak — they have cheshtabala.
    // Unlike Parashari where retrograde can indicate weakness, Tajika considers
    // retrograde planets as determined and focused. No penalty applied.
  }
  if (strong >= 3 && weak === 0) return 'Strong';
  if (weak >= 2) return 'Weak';
  return 'Moderate';
}

function simpleStrength(
  ctx: YogaContext,
  result: YogaDetectionResult,
): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let good = 0;
  let bad = 0;
  for (const pid of planets) {
    const d = ctx.dignity(pid);
    if (d === 'exalted' || d === 'own' || d === 'moolatrikona') good++;
    if (d === 'debilitated' || d === 'enemy') bad++;
    if (ctx.isCombust(pid)) bad++;
  }
  if (good > bad && bad === 0) return 'Strong';
  if (bad > good) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Tajika Yoga Rules
// ─────────────────────────────────────────────────────────────────────────────

export const TAJIKA_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Ikkabal Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Ikkabal Yoga
   *
   * Any planet in its own sign, exalted sign, or moolatrikona sign.
   * The strongest Tajika yoga — indicates self-sufficiency and innate power.
   * In natal context: planets in strong dignity carry Ikkabal promise.
   *
   * Source: Tajika Neelakanthi Ch.3
   */
  {
    id: 'ikkabal',
    name: { en: 'Ikkabal Yoga', hi: 'इक्कबाल योग', sa: 'इक्कबालयोगः' },
    group: 'tajika',
    isAuspicious: true,
    classicalRef: 'Tajika Neelakanthi Ch.3',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involved: number[] = [];
        // Check Sun(0) through Saturn(6) — classical 7 planets
        for (let pid = 0; pid <= 6; pid++) {
          const d = ctx.dignity(pid);
          if (d === 'exalted' || d === 'own' || d === 'moolatrikona') {
            involved.push(pid);
          }
        }
        return { present: involved.length > 0, involvedPlanets: involved };
      },
    },

    assessStrength: (ctx, result) => {
      // Stronger when more planets have Ikkabal, or when exalted
      const exaltedCount = result.involvedPlanets.filter(p => ctx.dignity(p) === 'exalted').length;
      if (exaltedCount >= 2 || result.involvedPlanets.length >= 3) return 'Strong';
      if (result.involvedPlanets.length >= 2) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'One or more planets in own, exalted, or moolatrikona sign',
      hi: 'एक या अधिक ग्रह स्वराशि, उच्च, या मूलत्रिकोण राशि में',
    },
    description: {
      en: 'Ikkabal Yoga is the strongest Tajika combination — it forms when planets occupy their own, exalted, or moolatrikona sign. Such planets are self-sufficient and deliver their significations powerfully. The more planets with Ikkabal dignity, the greater the native\'s inherent strength and self-reliance across all life domains.',
      hi: 'इक्कबाल योग सबसे शक्तिशाली ताजिक योग है — यह तब बनता है जब ग्रह अपनी स्वराशि, उच्च, या मूलत्रिकोण राशि में हों। ऐसे ग्रह आत्मनिर्भर होते हैं और अपने फल शक्तिशाली ढंग से देते हैं। जितने अधिक ग्रहों में इक्कबाल गरिमा हो, जातक की स्वाभाविक शक्ति उतनी ही अधिक होती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Induvara Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Induvara Yoga
   *
   * Planet in a kendra (1/4/7/10) in its own or exalted sign AND aspected by
   * at least one natural benefic. Indicates success through both inherent
   * strength and divine grace.
   *
   * Source: Tajika Neelakanthi Ch.3
   */
  {
    id: 'induvara',
    name: { en: 'Induvara Yoga', hi: 'इन्दुवार योग', sa: 'इन्दुवारयोगः' },
    group: 'tajika',
    isAuspicious: true,
    classicalRef: 'Tajika Neelakanthi Ch.3',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involved: number[] = [];
        for (let pid = 0; pid <= 6; pid++) {
          const house = ctx.planetHouse(pid);
          if (!KENDRA_HOUSES.includes(house)) continue;

          const d = ctx.dignity(pid);
          if (d !== 'exalted' && d !== 'own') continue;

          // Check if aspected by at least one natural benefic (not self)
          const aspectedByBenefic = NATURAL_BENEFIC_IDS.some(
            bid => bid !== pid && ctx.doesAspect(bid, house),
          );
          if (aspectedByBenefic) {
            involved.push(pid);
          }
        }
        return { present: involved.length > 0, involvedPlanets: involved };
      },
    },

    assessStrength: tajikaStrengthByDignity,

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Planet in kendra in own/exalted sign, aspected by a natural benefic',
      hi: 'ग्रह केन्द्र में स्वराशि/उच्च में, शुभ ग्रह की दृष्टि सहित',
    },
    description: {
      en: 'Induvara Yoga forms when a planet in a kendra house occupies its own or exalted sign and receives the aspect of a natural benefic. This rare combination merges inherent planetary strength with benefic support — the native achieves success through both personal capability and fortunate circumstances. Particularly powerful for career and wealth.',
      hi: 'इन्दुवार योग तब बनता है जब कोई ग्रह केन्द्र भाव में स्वराशि या उच्च राशि में हो और शुभ ग्रह की दृष्टि प्राप्त करे। यह दुर्लभ योग स्वाभाविक ग्रह शक्ति और शुभ सहयोग का मेल है — जातक व्यक्तिगत योग्यता और अनुकूल परिस्थितियों दोनों से सफलता प्राप्त करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Ithasala Yoga (Applying aspect — custom detect)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Ithasala Yoga
   *
   * The most important Tajika yoga. A faster planet applies to conjunction
   * or aspect with a slower planet (within orb). Signifies completion and
   * fulfilment of matters — the cosmic handshake that delivers results.
   *
   * In natal charts, we check for applying aspects based on mean speeds:
   * faster planet has lower longitude than slower planet in the same sign,
   * or is approaching within the Tajika orb (12°).
   *
   * Source: Tajika Neelakanthi Ch.4
   */
  {
    id: 'ithasala',
    name: { en: 'Ithasala Yoga', hi: 'इत्थशाल योग', sa: 'इत्थशालयोगः' },
    group: 'tajika',
    isAuspicious: true,
    classicalRef: 'Tajika Neelakanthi Ch.4',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involved: number[] = [];
        const pairs: { fast: number; slow: number }[] = [];

        // Check all classical planet pairs (Sun=0 through Saturn=6)
        for (let i = 0; i <= 6; i++) {
          for (let j = i + 1; j <= 6; j++) {
            const speedI = MEAN_SPEED[i] ?? 0;
            const speedJ = MEAN_SPEED[j] ?? 0;
            const fast = speedI > speedJ ? i : j;
            const slow = speedI > speedJ ? j : i;

            const fastLong = ctx.planetLongitude(fast);
            const slowLong = ctx.planetLongitude(slow);

            // Raw forward distance from faster to slower (going forward in zodiac)
            const rawForward = ((slowLong - fastLong) + 360) % 360;
            // If rawForward < 180, faster planet is BEHIND slower (applying = Ithasala)
            // If rawForward > 180, faster planet is AHEAD of slower (separating = Ishrafa)
            const isApplying = rawForward < 180;
            const separation = rawForward < 180 ? rawForward : 360 - rawForward;

            // Within Tajika orb AND faster planet is applying (behind the slower)
            if (isApplying && separation <= TAJIKA_ORB && separation > 0) {
              // Check if in same sign OR in aspect (conjunction/opposition/trine/square)
              const fastSign = ctx.planetSign(fast);
              const slowSign = ctx.planetSign(slow);
              const signDiff = ((slowSign - fastSign + 12) % 12);

              // Tajika aspects: conjunction(0), opposition(6), trine(4,8), square(3,9)
              const isAspect = [0, 3, 4, 6, 8, 9].includes(signDiff);

              if (isAspect) {
                if (!involved.includes(fast)) involved.push(fast);
                if (!involved.includes(slow)) involved.push(slow);
                pairs.push({ fast, slow });
              }
            }
          }
        }

        return {
          present: pairs.length > 0,
          involvedPlanets: involved,
          customData: { pairs, pairCount: pairs.length },
        };
      },
    },

    assessStrength: (ctx, result) => {
      const pairCount = (result.customData?.pairCount as number) ?? 0;
      if (pairCount >= 3) return 'Strong';
      if (pairCount >= 2) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'Faster planet applying to conjunction/aspect with slower planet within 12° orb',
      hi: 'तीव्र गति ग्रह 12° कक्षा में मन्द ग्रह से युति/दृष्टि की ओर अग्रसर',
    },
    description: {
      en: 'Ithasala is the most significant Tajika yoga — it signifies completion and fulfilment of endeavours. When a faster-moving planet approaches a slower one within the Tajika orb, matters related to both planets are brought to fruition. Multiple Ithasala pairs in a chart indicate a life of accomplishments where efforts lead to tangible results.',
      hi: 'इत्थशाल सबसे महत्वपूर्ण ताजिक योग है — यह कार्यों की पूर्णता और सिद्धि का सूचक है। जब तीव्र गति ग्रह ताजिक कक्षा में मन्द ग्रह के निकट आता है, तो दोनों ग्रहों से सम्बन्धित कार्य फलीभूत होते हैं। अनेक इत्थशाल जोड़े उपलब्धियों से भरे जीवन का संकेत देते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Ishrafa Yoga (Separating aspect)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Ishrafa Yoga
   *
   * Faster planet separating from aspect with slower planet.
   * The opposite of Ithasala — matters have already peaked or are past their
   * prime. Not necessarily negative, but indicates diminishing returns.
   *
   * Source: Tajika Neelakanthi Ch.4
   */
  {
    id: 'ishrafa',
    name: { en: 'Ishrafa Yoga', hi: 'इशराफ योग', sa: 'इशराफयोगः' },
    group: 'tajika',
    isAuspicious: false,
    classicalRef: 'Tajika Neelakanthi Ch.4',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involved: number[] = [];
        const pairs: { fast: number; slow: number }[] = [];

        for (let i = 0; i <= 6; i++) {
          for (let j = i + 1; j <= 6; j++) {
            const speedI = MEAN_SPEED[i] ?? 0;
            const speedJ = MEAN_SPEED[j] ?? 0;
            const fast = speedI > speedJ ? i : j;
            const slow = speedI > speedJ ? j : i;

            const fastLong = ctx.planetLongitude(fast);
            const slowLong = ctx.planetLongitude(slow);

            // Raw forward distance from faster to slower (going forward in zodiac)
            const rawForward = ((slowLong - fastLong) + 360) % 360;
            // Ishrafa: faster planet is AHEAD of slower (separating) = rawForward > 180
            const isSeparating = rawForward >= 180;
            const separation = rawForward < 180 ? rawForward : 360 - rawForward;

            if (isSeparating && separation <= TAJIKA_ORB && separation > 0) {
              const fastSign = ctx.planetSign(fast);
              const slowSign = ctx.planetSign(slow);
              const signDiff = ((fastSign - slowSign + 12) % 12);
              const isAspect = [0, 3, 4, 6, 8, 9].includes(signDiff);

              if (isAspect) {
                if (!involved.includes(fast)) involved.push(fast);
                if (!involved.includes(slow)) involved.push(slow);
                pairs.push({ fast, slow });
              }
            }
          }
        }

        return {
          present: pairs.length > 0,
          involvedPlanets: involved,
          customData: { pairs, pairCount: pairs.length },
        };
      },
    },

    assessStrength: simpleStrength,

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'Faster planet separating from conjunction/aspect with slower planet within 12° orb',
      hi: 'तीव्र गति ग्रह 12° कक्षा में मन्द ग्रह से युति/दृष्टि से पृथक हो रहा है',
    },
    description: {
      en: 'Ishrafa Yoga is the counterpart of Ithasala — it indicates that a matter has already peaked or is past its prime. The faster planet has moved beyond the slower one, signifying that opportunities related to those planets have been utilised or missed. It suggests reviewing past actions rather than expecting new results from the same combination.',
      hi: 'इशराफ योग इत्थशाल का विपरीत है — यह दर्शाता है कि विषय अपनी चरम सीमा पार कर चुका है। तीव्र ग्रह मन्द ग्रह से आगे निकल चुका है, जो बताता है कि उन ग्रहों से सम्बन्धित अवसर उपयोग किये जा चुके हैं या छूट गये हैं। यह नये परिणामों की अपेक्षा के बजाय पूर्व कार्यों की समीक्षा का सुझाव देता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Nakta Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Nakta Yoga
   *
   * A slower planet applies to aspect with a faster planet. Transfer of results.
   * This is unusual because normally the faster planet initiates — here the
   * slower planet "reaches out", indicating that results come through delay
   * and persistence.
   *
   * Source: Tajika Neelakanthi Ch.4
   */
  {
    id: 'nakta',
    name: { en: 'Nakta Yoga', hi: 'नक्त योग', sa: 'नक्तयोगः' },
    group: 'tajika',
    isAuspicious: true,
    classicalRef: 'Tajika Neelakanthi Ch.4',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Nakta: a slower planet applies to a faster one.
        // We detect this when the slower planet has a retrograde motion
        // (making it "apply" towards the faster planet) within orb.
        const involved: number[] = [];

        for (let slow = 0; slow <= 6; slow++) {
          if (!ctx.isRetrograde(slow)) continue; // Slower must be retrograde to "apply"

          for (let fast = 0; fast <= 6; fast++) {
            if (fast === slow) continue;
            if ((MEAN_SPEED[fast] ?? 0) <= (MEAN_SPEED[slow] ?? 0)) continue;

            const slowLong = ctx.planetLongitude(slow);
            const fastLong = ctx.planetLongitude(fast);

            // Retrograde slow planet applies to faster planet:
            // since it's moving backward, it approaches a planet that is behind it
            // Raw forward distance from slow to fast
            const rawForward = ((fastLong - slowLong) + 360) % 360;
            // Retrograde planet applies when the fast planet is behind it (rawForward > 180)
            // i.e. the slow planet is ahead and moving backward toward the fast planet
            const isRetroApplying = rawForward >= 180;
            const separation = rawForward < 180 ? rawForward : 360 - rawForward;

            if (isRetroApplying && separation <= TAJIKA_ORB) {
              const slowSign = ctx.planetSign(slow);
              const fastSign = ctx.planetSign(fast);
              const signDiff = ((slowSign - fastSign + 12) % 12);
              const isAspect = [0, 3, 4, 6, 8, 9].includes(signDiff);

              if (isAspect) {
                if (!involved.includes(slow)) involved.push(slow);
                if (!involved.includes(fast)) involved.push(fast);
              }
            }
          }
        }

        return { present: involved.length > 0, involvedPlanets: involved };
      },
    },

    assessStrength: simpleStrength,

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'Retrograde slower planet applies to aspect with faster planet within 12° orb',
      hi: 'वक्री मन्द ग्रह 12° कक्षा में तीव्र ग्रह से दृष्टि बना रहा है',
    },
    description: {
      en: 'Nakta Yoga forms when a slower retrograde planet applies to a faster one — an inversion of the normal Ithasala dynamic. Results come through delay, revision, and persistence rather than forward momentum. Matters require patience but eventually reach completion through an unconventional path.',
      hi: 'नक्त योग तब बनता है जब कोई मन्द वक्री ग्रह तीव्र ग्रह की ओर अग्रसर हो — सामान्य इत्थशाल गतिशीलता का उलटा। फल विलम्ब, पुनरावलोकन और दृढ़ता से प्राप्त होते हैं। विषयों में धैर्य आवश्यक है परन्तु अन्ततः असामान्य मार्ग से पूर्णता मिलती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Yamaya Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Yamaya Yoga
   *
   * Two planets both applying to a third planet — mediation/transfer of light.
   * The third planet acts as a cosmic intermediary connecting two significators
   * that cannot directly interact.
   *
   * Source: Tajika Neelakanthi Ch.5
   */
  {
    id: 'yamaya',
    name: { en: 'Yamaya Yoga', hi: 'यमया योग', sa: 'यमयायोगः' },
    group: 'tajika',
    isAuspicious: true,
    classicalRef: 'Tajika Neelakanthi Ch.5',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involved: number[] = [];
        // Check if two planets both apply to a third (mediator) planet
        // "Apply" = within Tajika orb and in an aspect relationship

        for (let mediator = 0; mediator <= 6; mediator++) {
          const mediatorLong = ctx.planetLongitude(mediator);
          const mediatorSign = ctx.planetSign(mediator);
          const applicants: number[] = [];

          for (let pid = 0; pid <= 6; pid++) {
            if (pid === mediator) continue;

            const pLong = ctx.planetLongitude(pid);
            const pSign = ctx.planetSign(pid);

            // Determine if pid is applying to mediator using directional logic
            // pid must be the faster planet approaching the mediator
            const pidSpeed = MEAN_SPEED[pid] ?? 0;
            const medSpeed = MEAN_SPEED[mediator] ?? 0;
            const fast = pidSpeed > medSpeed ? pid : mediator;
            const slow = pidSpeed > medSpeed ? mediator : pid;
            const fastLong = fast === pid ? pLong : mediatorLong;
            const slowLong = fast === pid ? mediatorLong : pLong;

            // Raw forward distance from faster to slower
            const rawForward = ((slowLong - fastLong) + 360) % 360;
            const isApplying = rawForward < 180;
            const separation = rawForward < 180 ? rawForward : 360 - rawForward;

            if (!isApplying || separation > TAJIKA_ORB || separation <= 0) continue;

            const signDiff = ((mediatorSign - pSign + 12) % 12);
            if ([0, 3, 4, 6, 8, 9].includes(signDiff)) {
              applicants.push(pid);
            }
          }

          // Issue 3: The two applicants must NOT be in mutual aspect — that would be two Ithasalas
          if (applicants.length >= 2) {
            // Check all pairs; keep only sets where at least one pair lacks mutual aspect
            let hasValidTriple = false;
            for (let a = 0; a < applicants.length && !hasValidTriple; a++) {
              for (let b = a + 1; b < applicants.length && !hasValidTriple; b++) {
                const p1Long = ctx.planetLongitude(applicants[a]);
                const p2Long = ctx.planetLongitude(applicants[b]);
                const mutualSep = Math.min(
                  ((p1Long - p2Long) + 360) % 360,
                  ((p2Long - p1Long) + 360) % 360,
                );
                // If mutual separation > orb, they're NOT directly connected — valid Yamaya
                if (mutualSep > TAJIKA_ORB) {
                  hasValidTriple = true;
                }
              }
            }
            if (!hasValidTriple) {
              // All applicant pairs are in mutual aspect — skip this mediator
              continue;
            }
          }

          if (applicants.length >= 2) {
            if (!involved.includes(mediator)) involved.push(mediator);
            for (const a of applicants) {
              if (!involved.includes(a)) involved.push(a);
            }
          }
        }

        return { present: involved.length >= 3, involvedPlanets: involved };
      },
    },

    assessStrength: simpleStrength,

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'Two planets both applying to a third planet within 12° orb (transfer of light)',
      hi: 'दो ग्रह दोनों 12° कक्षा में तीसरे ग्रह से दृष्टि बना रहे हैं (ज्योति हस्तांतरण)',
    },
    description: {
      en: 'Yamaya Yoga occurs when two planets both apply to a third "mediator" planet. The mediator transfers the influence between two significators that cannot directly connect. This yoga indicates that life matters are resolved through intermediaries — mentors, brokers, or circumstances that bridge gaps between different areas of life.',
      hi: 'यमया योग तब बनता है जब दो ग्रह दोनों एक तीसरे "मध्यस्थ" ग्रह से दृष्टि बनाते हैं। मध्यस्थ दो कारकों के बीच प्रभाव स्थानान्तरित करता है। यह योग दर्शाता है कि जीवन के विषय मध्यस्थों — गुरुओं, दलालों, या परिस्थितियों — के माध्यम से हल होते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Manau Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Manau Yoga
   *
   * Planet combust (within Sun's orb) or placed in 6/8/12 from another planet.
   * Signifies denial and obstruction of results.
   *
   * In natal context: we check for combust planets AND planets in mutual
   * 6/8/12 with their sign lords.
   *
   * Source: Tajika Neelakanthi Ch.5
   */
  {
    id: 'manau',
    name: { en: 'Manau Yoga', hi: 'मनौ योग', sa: 'मनौयोगः' },
    group: 'tajika',
    isAuspicious: false,
    classicalRef: 'Tajika Neelakanthi Ch.5',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involved: number[] = [];

        for (let pid = 1; pid <= 6; pid++) {
          // Check combustion
          if (ctx.isCombust(pid)) {
            if (!involved.includes(pid)) involved.push(pid);
            continue;
          }

          // Check 6/8/12 from dispositor (sign lord)
          // Find lord of the sign the planet occupies
          for (let h = 1; h <= 12; h++) {
            if (ctx.houseSign(h) === ctx.planetSign(pid)) {
              const lord = ctx.houseLord(h);
              if (lord !== pid) {
                const lordHouse = ctx.planetHouse(lord);
                const pHouse = ctx.planetHouse(pid);
                if (isInDusthanaFrom(ctx, lordHouse, pHouse)) {
                  if (!involved.includes(pid)) involved.push(pid);
                }
              }
              break;
            }
          }
        }

        return { present: involved.length > 0, involvedPlanets: involved };
      },
    },

    assessStrength: (ctx, result) => {
      // More afflicted planets = stronger Manau (worse)
      if (result.involvedPlanets.length >= 3) return 'Strong';
      if (result.involvedPlanets.length >= 2) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'Planet combust or in 6/8/12 from its dispositor',
      hi: 'ग्रह अस्त या अपने स्वामी से 6/8/12 में',
    },
    description: {
      en: 'Manau Yoga indicates denial or obstruction of planetary results. It forms when a planet is combust (too close to the Sun) or placed in a dusthana (6th, 8th, or 12th) from its dispositor. The affected planet struggles to deliver its promised results — its significations face delays, blockages, or unfavourable outcomes requiring conscious remedial effort.',
      hi: 'मनौ योग ग्रह फलों के निषेध या अवरोध का सूचक है। यह तब बनता है जब ग्रह अस्त हो (सूर्य के अत्यन्त निकट) या अपने स्वामी से दुःस्थान (6/8/12) में हो। प्रभावित ग्रह अपने वादे किये फल देने में कठिनाई अनुभव करता है — विलम्ब, अवरोध, या प्रतिकूल परिणाम आते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Khalasara Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Khalasara Yoga
   *
   * Planet in 6th or 8th from the Moon. Inauspicious — indicates emotional
   * dissonance and obstacles related to the affected planet's significations.
   *
   * Source: Tajika Neelakanthi Ch.6
   */
  {
    id: 'khalasara',
    name: { en: 'Khalasara Yoga', hi: 'खलसार योग', sa: 'खलसारयोगः' },
    group: 'tajika',
    isAuspicious: false,
    classicalRef: 'Tajika Neelakanthi Ch.6',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const moonHouse = ctx.planetHouse(1); // Moon = planet ID 1
        const involved: number[] = [];

        for (let pid = 0; pid <= 6; pid++) {
          if (pid === 1) continue; // Skip Moon itself
          const pHouse = ctx.planetHouse(pid);
          const offset = ctx.houseOffset(moonHouse, pHouse);
          if (offset === 6 || offset === 8) {
            involved.push(pid);
          }
        }

        return { present: involved.length > 0, involvedPlanets: [1, ...involved] };
      },
    },

    assessStrength: (ctx, result) => {
      // Exclude Moon from the count (always involved as reference)
      const afflictedCount = result.involvedPlanets.length - 1;
      if (afflictedCount >= 3) return 'Strong';
      if (afflictedCount >= 2) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['health', 'marriage'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'One or more planets in 6th or 8th house from the Moon',
      hi: 'एक या अधिक ग्रह चन्द्रमा से छठे या आठवें भाव में',
    },
    description: {
      en: 'Khalasara Yoga forms when planets occupy the 6th or 8th house from the Moon. These are positions of emotional tension — the 6th brings conflict and the 8th brings hidden troubles. The affected planets\' significations create inner dissonance and obstacles in the native\'s emotional and physical well-being.',
      hi: 'खलसार योग तब बनता है जब ग्रह चन्द्रमा से छठे या आठवें भाव में हों। ये भावनात्मक तनाव की स्थितियाँ हैं — छठा भाव संघर्ष और आठवाँ छिपी समस्याएँ लाता है। प्रभावित ग्रहों के कारकत्व जातक के भावनात्मक और शारीरिक कल्याण में बाधा और अन्तर्द्वन्द्व उत्पन्न करते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Radda Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Radda Yoga
   *
   * Planet retrograde in the chart. In Tajika, retrograde signifies delay,
   * revision, and re-evaluation — not purely negative, but matters require
   * patience and reworking.
   *
   * Source: Tajika Neelakanthi Ch.6
   */
  {
    id: 'radda',
    name: { en: 'Radda Yoga', hi: 'रद्द योग', sa: 'रद्दयोगः' },
    group: 'tajika',
    isAuspicious: false,
    classicalRef: 'Tajika Neelakanthi Ch.6',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involved: number[] = [];
        // Only Mars(2), Mercury(3), Jupiter(4), Venus(5), Saturn(6) can be retrograde
        for (const pid of [2, 3, 4, 5, 6]) {
          if (ctx.isRetrograde(pid)) {
            involved.push(pid);
          }
        }
        return { present: involved.length > 0, involvedPlanets: involved };
      },
    },

    assessStrength: (ctx, result) => {
      if (result.involvedPlanets.length >= 3) return 'Strong';
      if (result.involvedPlanets.length >= 2) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'One or more planets in retrograde motion',
      hi: 'एक या अधिक ग्रह वक्री गति में',
    },
    description: {
      en: 'Radda Yoga forms when planets are retrograde. In the Tajika system, retrograde motion signifies delay, revision, and reassessment rather than forward progress. Matters ruled by retrograde planets require patience — initial attempts may falter, but persistence and willingness to revise lead to eventual success. The native often achieves goals through unconventional or indirect routes.',
      hi: 'रद्द योग तब बनता है जब ग्रह वक्री हों। ताजिक पद्धति में वक्री गति विलम्ब, पुनरावलोकन और पुनर्मूल्यांकन का सूचक है। वक्री ग्रहों से शासित विषयों में धैर्य आवश्यक है — प्रारम्भिक प्रयास लड़खड़ा सकते हैं, किन्तु दृढ़ता और संशोधन की तत्परता अन्ततः सफलता दिलाती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Duhphali Kuttha Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Duhphali Kuttha Yoga
   *
   * Malefic planet in the 12th house from any house lord (significator).
   * Indicates expenses, losses, and drain of energy related to that domain.
   * In natal chart: check if any natural malefic sits 12th from the
   * ascendant lord.
   *
   * Source: Tajika Neelakanthi Ch.7
   */
  {
    id: 'duhphali-kuttha',
    name: { en: 'Duhphali Kuttha Yoga', hi: 'दुःफली कुत्थ योग', sa: 'दुःफलीकुत्थयोगः' },
    group: 'tajika',
    isAuspicious: false,
    classicalRef: 'Tajika Neelakanthi Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involved: number[] = [];
        const lagnaLord = ctx.houseLord(1);
        const lagnaLordHouse = ctx.planetHouse(lagnaLord);

        // Natural malefics: Sun(0), Mars(2), Saturn(6), Rahu(7), Ketu(8)
        const malefics = [0, 2, 6, 7, 8];

        for (const mid of malefics) {
          const mHouse = ctx.planetHouse(mid);
          const offset = ctx.houseOffset(lagnaLordHouse, mHouse);
          if (offset === 12) {
            involved.push(mid);
          }
        }

        if (involved.length > 0) {
          involved.push(lagnaLord); // Include the afflicted lord
        }

        return { present: involved.length > 0, involvedPlanets: involved };
      },
    },

    assessStrength: simpleStrength,

    affectedDomains: ['wealth', 'health'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Natural malefic in 12th from the ascendant lord',
      hi: 'लग्नेश से 12वें भाव में पापग्रह',
    },
    description: {
      en: 'Duhphali Kuttha Yoga forms when a natural malefic occupies the 12th house from the ascendant lord — a position of expenditure, loss, and hidden enemies. It indicates draining of vitality and resources through the malefic\'s significations. The native faces unexpected expenses or energy loss that requires conscious management.',
      hi: 'दुःफली कुत्थ योग तब बनता है जब कोई पापग्रह लग्नेश से 12वें भाव में हो — व्यय, हानि और छिपे शत्रुओं की स्थिति। यह पापग्रह के कारकत्व द्वारा जीवन शक्ति और संसाधनों की हानि का सूचक है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 11. Dutthotthadavira Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Dutthotthadavira Yoga
   *
   * All planets in 6/8/12 from a house lord — complete denial.
   * In natal chart: check if all 7 classical planets (except the ascendant lord
   * itself) occupy dusthana positions from the ascendant lord.
   *
   * Source: Tajika Neelakanthi Ch.7
   */
  {
    id: 'dutthotthadavira',
    name: { en: 'Dutthotthadavira Yoga', hi: 'दुत्थोत्थदवीर योग', sa: 'दुत्थोत्थदवीरयोगः' },
    group: 'tajika',
    isAuspicious: false,
    classicalRef: 'Tajika Neelakanthi Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lagnaLord = ctx.houseLord(1);
        const lagnaLordHouse = ctx.planetHouse(lagnaLord);
        const involved: number[] = [lagnaLord];

        let allInDusthana = true;
        for (let pid = 0; pid <= 6; pid++) {
          if (pid === lagnaLord) continue;
          const pHouse = ctx.planetHouse(pid);
          if (!isInDusthanaFrom(ctx, pHouse, lagnaLordHouse)) {
            allInDusthana = false;
            break;
          }
          involved.push(pid);
        }

        return { present: allInDusthana, involvedPlanets: allInDusthana ? involved : [] };
      },
    },

    assessStrength: () => 'Strong', // If present, always strong (complete denial)

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'All classical planets in 6th, 8th, or 12th from the ascendant lord',
      hi: 'सभी शास्त्रीय ग्रह लग्नेश से 6/8/12 में',
    },
    description: {
      en: 'Dutthotthadavira Yoga is the most severe Tajika affliction — it forms when every classical planet occupies a dusthana (6th, 8th, or 12th) from the ascendant lord. This indicates complete isolation of the self from planetary support, resulting in persistent obstacles across all life areas. Extremely rare in practice.',
      hi: 'दुत्थोत्थदवीर योग सबसे गम्भीर ताजिक पीड़ा है — यह तब बनता है जब प्रत्येक शास्त्रीय ग्रह लग्नेश से दुःस्थान (6/8/12) में हो। यह ग्रहीय सहयोग से आत्म का पूर्ण अलगाव दर्शाता है, जिससे जीवन के सभी क्षेत्रों में निरन्तर बाधाएँ आती हैं। व्यवहार में अत्यन्त दुर्लभ।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 12. Tambira Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Tambira Yoga
   *
   * Only benefic aspects on the ascendant without any malefic aspect.
   * Pure benefic blessing — uncontaminated auspiciousness for the self.
   *
   * Source: Tajika Neelakanthi Ch.7
   */
  {
    id: 'tambira',
    name: { en: 'Tambira Yoga', hi: 'ताम्बीर योग', sa: 'ताम्बीरयोगः' },
    group: 'tajika',
    isAuspicious: true,
    classicalRef: 'Tajika Neelakanthi Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const ascHouse = 1;
        const beneficAspecters: number[] = [];
        let anyMaleficAspect = false;

        for (let pid = 0; pid <= 8; pid++) {
          if (ctx.doesAspect(pid, ascHouse)) {
            if (ctx.isNaturalBenefic(pid)) {
              beneficAspecters.push(pid);
            } else {
              anyMaleficAspect = true;
            }
          }
        }

        // Also check if a malefic planet occupies the ascendant
        const planetsInAsc = ctx.planetsInHouse(ascHouse);
        for (const pid of planetsInAsc) {
          if (!ctx.isNaturalBenefic(pid)) {
            anyMaleficAspect = true;
          }
        }

        const present = beneficAspecters.length > 0 && !anyMaleficAspect;
        return { present, involvedPlanets: present ? beneficAspecters : [] };
      },
    },

    assessStrength: (ctx, result) => {
      if (result.involvedPlanets.length >= 3) return 'Strong';
      if (result.involvedPlanets.length >= 2) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['health', 'spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Only natural benefics aspect the ascendant, with no malefic aspect or occupancy',
      hi: 'केवल शुभ ग्रहों की लग्न पर दृष्टि, बिना किसी पापग्रह दृष्टि या स्थिति',
    },
    description: {
      en: 'Tambira Yoga blesses the ascendant with pure benefic influence — Jupiter, Venus, Mercury, or the Moon aspect the first house without any malefic contamination. The native enjoys natural grace, good health, and a positive outlook on life. Others perceive them as fortunate and pleasant to be around.',
      hi: 'ताम्बीर योग लग्न को शुद्ध शुभ प्रभाव से आशीर्वाद देता है — बृहस्पति, शुक्र, बुध, या चन्द्रमा बिना किसी पापग्रह दूषण के प्रथम भाव को देखते हैं। जातक स्वाभाविक कृपा, अच्छे स्वास्थ्य और जीवन के प्रति सकारात्मक दृष्टिकोण का आनन्द लेता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 13. Kuttha Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Kuttha Yoga
   *
   * Malefic in 3/6/10/11 from the ascendant lord. These are upachaya houses
   * where malefics traditionally do well — hidden support from enemies,
   * competitive advantage, and strength through adversity.
   *
   * Source: Tajika Neelakanthi Ch.7
   */
  {
    id: 'kuttha',
    name: { en: 'Kuttha Yoga', hi: 'कुत्थ योग', sa: 'कुत्थयोगः' },
    group: 'tajika',
    isAuspicious: true, // Mixed but traditionally favourable — malefics in upachaya are good
    classicalRef: 'Tajika Neelakanthi Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lagnaLord = ctx.houseLord(1);
        const lagnaLordHouse = ctx.planetHouse(lagnaLord);
        const involved: number[] = [];

        const malefics = [0, 2, 6, 7, 8]; // Sun, Mars, Saturn, Rahu, Ketu
        const upachayaOffsets = [3, 6, 10, 11];

        for (const mid of malefics) {
          const mHouse = ctx.planetHouse(mid);
          const offset = ctx.houseOffset(lagnaLordHouse, mHouse);
          if (upachayaOffsets.includes(offset)) {
            involved.push(mid);
          }
        }

        return { present: involved.length > 0, involvedPlanets: involved };
      },
    },

    assessStrength: simpleStrength,

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Natural malefic in 3rd, 6th, 10th, or 11th from the ascendant lord',
      hi: 'पापग्रह लग्नेश से 3/6/10/11 में',
    },
    description: {
      en: 'Kuttha Yoga places natural malefics in upachaya houses (3rd, 6th, 10th, 11th) from the ascendant lord — positions where malefics paradoxically become beneficial. Mars here gives competitive drive, Saturn gives endurance, and even Rahu can grant unconventional gains. The native finds hidden support from adversity and transforms challenges into stepping stones.',
      hi: 'कुत्थ योग पापग्रहों को लग्नेश से उपचय भावों (3/6/10/11) में रखता है — जहाँ पापग्रह विरोधाभासी रूप से लाभदायक होते हैं। यहाँ मंगल प्रतिस्पर्धात्मक ऊर्जा देता है, शनि सहनशक्ति देता है, और राहु भी अपरम्परागत लाभ दे सकता है। जातक प्रतिकूलता से छिपा सहयोग पाता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 14. Mahaphala Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Mahaphala Yoga
   *
   * Two significator planets in mutual kendra with benefic influence.
   * Great fruition — the most productive configuration in Tajika.
   *
   * In natal chart: ascendant lord and Moon lord in mutual kendra, with
   * at least one benefic aspecting them.
   *
   * Source: Tajika Neelakanthi Ch.8
   */
  {
    id: 'mahaphala',
    name: { en: 'Mahaphala Yoga', hi: 'महाफल योग', sa: 'महाफलयोगः' },
    group: 'tajika',
    isAuspicious: true,
    classicalRef: 'Tajika Neelakanthi Ch.8',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lagnaLord = ctx.houseLord(1);
        const moonHouse = ctx.planetHouse(1); // Moon's house
        const moonSignLord = ctx.houseLord(moonHouse); // Moon's dispositor

        // Already the same planet?
        if (lagnaLord === moonSignLord) {
          // Check if aspected by a benefic
          const llHouse = ctx.planetHouse(lagnaLord);
          const hasBeneficAspect = NATURAL_BENEFIC_IDS.some(
            bid => bid !== lagnaLord && ctx.doesAspect(bid, llHouse),
          );
          return {
            present: hasBeneficAspect,
            involvedPlanets: hasBeneficAspect ? [lagnaLord] : [],
          };
        }

        const llHouse = ctx.planetHouse(lagnaLord);
        const mlHouse = ctx.planetHouse(moonSignLord);

        // Check mutual kendra (1/4/7/10 from each other)
        const offset = ctx.houseOffset(llHouse, mlHouse);
        const isKendraApart = [1, 4, 7, 10].includes(offset);

        if (!isKendraApart) {
          return { present: false, involvedPlanets: [] };
        }

        // Check benefic aspect on either
        const hasBeneficAspect = NATURAL_BENEFIC_IDS.some(
          bid =>
            bid !== lagnaLord &&
            bid !== moonSignLord &&
            (ctx.doesAspect(bid, llHouse) || ctx.doesAspect(bid, mlHouse)),
        );

        const present = hasBeneficAspect;
        const involved = present ? [lagnaLord, moonSignLord] : [];
        // Add the benefic(s) aspecting
        if (present) {
          for (const bid of NATURAL_BENEFIC_IDS) {
            if (bid !== lagnaLord && bid !== moonSignLord &&
                (ctx.doesAspect(bid, llHouse) || ctx.doesAspect(bid, mlHouse))) {
              if (!involved.includes(bid)) involved.push(bid);
            }
          }
        }

        return { present, involvedPlanets: involved };
      },
    },

    assessStrength: tajikaStrengthByDignity,

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'Ascendant lord and Moon\'s dispositor in mutual kendra with benefic aspect',
      hi: 'लग्नेश और चन्द्र राशीश परस्पर केन्द्र में शुभ दृष्टि सहित',
    },
    description: {
      en: 'Mahaphala Yoga is the great fruition yoga of the Tajika system. When the ascendant lord and Moon\'s dispositor occupy mutual kendra positions under benefic influence, the chart promises abundant results across all life domains. Mind (Moon) and self (lagna) are harmonised and supported — the native\'s intentions manifest readily into reality.',
      hi: 'महाफल योग ताजिक पद्धति का महान फलदायी योग है। जब लग्नेश और चन्द्र राशीश परस्पर केन्द्र में शुभ प्रभाव में हों, तो कुण्डली सभी जीवन क्षेत्रों में प्रचुर फल का वादा करती है। मन (चन्द्र) और आत्म (लग्न) में सामंजस्य और सहयोग होता है — जातक की मंशाएँ सहजता से वास्तविकता में प्रकट होती हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 15. Duhphali Tambira Yoga (malefic-free 7th house)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Duhphali Tambira Yoga (adapted for natal)
   *
   * Only benefic aspects on the 7th house (partnership/marriage) without
   * any malefic contamination. A specialised Tambira for relationships.
   *
   * Source: Tajika Neelakanthi Ch.7 (adapted)
   */
  {
    id: 'duhphali-tambira',
    name: { en: 'Duhphali Tambira Yoga', hi: 'दुःफली ताम्बीर योग', sa: 'दुःफलीताम्बीरयोगः' },
    group: 'tajika',
    isAuspicious: true,
    classicalRef: 'Tajika Neelakanthi Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const house7 = 7;
        const beneficAspecters: number[] = [];
        let anyMaleficAspect = false;

        for (let pid = 0; pid <= 8; pid++) {
          if (ctx.doesAspect(pid, house7)) {
            if (ctx.isNaturalBenefic(pid)) {
              beneficAspecters.push(pid);
            } else {
              anyMaleficAspect = true;
            }
          }
        }

        // Check occupants of 7th house
        const occupants = ctx.planetsInHouse(house7);
        for (const pid of occupants) {
          if (!ctx.isNaturalBenefic(pid)) {
            anyMaleficAspect = true;
          } else {
            if (!beneficAspecters.includes(pid)) beneficAspecters.push(pid);
          }
        }

        const present = beneficAspecters.length > 0 && !anyMaleficAspect;
        return { present, involvedPlanets: present ? beneficAspecters : [] };
      },
    },

    assessStrength: simpleStrength,

    affectedDomains: ['marriage'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Only natural benefics aspect or occupy the 7th house, with no malefic influence',
      hi: 'केवल शुभ ग्रह सप्तम भाव पर दृष्टि डालें या उसमें हों, बिना पापग्रह प्रभाव',
    },
    description: {
      en: 'Duhphali Tambira Yoga blesses the 7th house of partnerships with pure benefic influence. When only Jupiter, Venus, Mercury, or the Moon aspect or occupy this house with no malefic contamination, relationships and partnerships flourish naturally. The native attracts harmonious connections and finds genuine companionship.',
      hi: 'दुःफली ताम्बीर योग साझेदारी के सप्तम भाव को शुद्ध शुभ प्रभाव से आशीर्वाद देता है। जब केवल बृहस्पति, शुक्र, बुध या चन्द्रमा इस भाव को देखें या उसमें हों, तो सम्बन्ध स्वाभाविक रूप से फलते-फूलते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 16. Musaripha Yoga (variation of Ishrafa for Moon)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Musaripha Yoga
   *
   * The Moon separating from a planet and applying to another — transfer of light.
   * The Moon acts as a cosmic messenger, carrying influence from one planet
   * to another. Particularly important in Tajika as the Moon moves fastest.
   *
   * Source: Tajika Neelakanthi Ch.5
   */
  {
    id: 'musaripha',
    name: { en: 'Musaripha Yoga', hi: 'मुसरिफ़ा योग', sa: 'मुसरिफायोगः' },
    group: 'tajika',
    isAuspicious: true,
    classicalRef: 'Tajika Neelakanthi Ch.5',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const moonLong = ctx.planetLongitude(1);
        const moonSign = ctx.planetSign(1);
        let separatingFrom: number | null = null;
        let applyingTo: number | null = null;

        // Find the planet Moon most recently separated from (closest behind Moon)
        let minSepBehind = Infinity;
        // Find the planet Moon is next applying to (closest ahead of Moon)
        let minSepAhead = Infinity;

        for (let pid = 0; pid <= 6; pid++) {
          if (pid === 1) continue; // skip Moon
          const pLong = ctx.planetLongitude(pid);
          const pSign = ctx.planetSign(pid);

          // Check aspect relationship
          const signDiff = ((moonSign - pSign + 12) % 12);
          const isAspect = [0, 3, 4, 6, 8, 9].includes(signDiff);
          if (!isAspect) continue;

          // Planet behind Moon (Moon has passed it) — Moon is separating from it
          const behindMoon = ((moonLong - pLong) + 360) % 360;
          if (behindMoon > 0 && behindMoon < 180 && behindMoon <= TAJIKA_ORB && behindMoon < minSepBehind) {
            minSepBehind = behindMoon;
            separatingFrom = pid;
          }

          // Planet ahead of Moon (Moon approaching it) — Moon is applying to it
          const aheadOfMoon = ((pLong - moonLong) + 360) % 360;
          if (aheadOfMoon > 0 && aheadOfMoon < 180 && aheadOfMoon <= TAJIKA_ORB && aheadOfMoon < minSepAhead) {
            minSepAhead = aheadOfMoon;
            applyingTo = pid;
          }
        }

        const present = separatingFrom !== null && applyingTo !== null;
        const involved: number[] = [];
        if (present) {
          involved.push(1); // Moon
          if (separatingFrom !== null) involved.push(separatingFrom);
          if (applyingTo !== null && !involved.includes(applyingTo)) involved.push(applyingTo);
        }

        return {
          present,
          involvedPlanets: involved,
          customData: present ? { separatingFrom, applyingTo } : undefined,
        };
      },
    },

    assessStrength: simpleStrength,

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'Moon separating from one planet and applying to another within 12° orb (transfer of light)',
      hi: 'चन्द्रमा एक ग्रह से पृथक और 12° कक्षा में दूसरे ग्रह की ओर अग्रसर (ज्योति हस्तांतरण)',
    },
    description: {
      en: 'Musaripha Yoga makes the Moon a cosmic messenger — separating from one planet while applying to another, it transfers influence between the two. This "transfer of light" yoga connects matters that would otherwise remain unrelated. The native benefits from timing and circumstantial connections that bridge disparate areas of life.',
      hi: 'मुसरिफ़ा योग चन्द्रमा को ब्रह्माण्डीय दूत बनाता है — एक ग्रह से पृथक होते हुए दूसरे की ओर अग्रसर, यह दोनों के बीच प्रभाव स्थानान्तरित करता है। यह "ज्योति हस्तांतरण" योग उन विषयों को जोड़ता है जो अन्यथा असम्बन्धित रहते। जातक समय और परिस्थितिजन्य सम्पर्कों से लाभान्वित होता है।',
    },
  },
];
