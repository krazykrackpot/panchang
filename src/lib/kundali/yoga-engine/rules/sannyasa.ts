/**
 * Sannyasa (Renunciation & Spiritual) Yoga Rules
 *
 * Yogas indicating spiritual inclination, renunciation tendencies, detachment,
 * and the path towards moksha (liberation). These are not inherently negative —
 * they indicate a soul drawn towards inner growth over worldly accumulation.
 *
 * Sources: BPHS Ch.35-36, Phaladeepika Ch.7, Jataka Parijata, Saravali
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';
import { NATURAL_BENEFIC_IDS } from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Sun through Saturn — the 7 classical visible planets */
const SUN_TO_SATURN = [0, 1, 2, 3, 4, 5, 6];

/** @deprecated Alias — use NATURAL_BENEFIC_IDS from utils.ts */
const NATURAL_BENEFICS = NATURAL_BENEFIC_IDS;

// ─────────────────────────────────────────────────────────────────────────────
// Shared strength assessors
// ─────────────────────────────────────────────────────────────────────────────

function spiritualStrength(ctx: YogaContext, result: YogaDetectionResult): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strongFactors = 0;
  let weakFactors = 0;

  for (const pid of planets) {
    const dignity = ctx.dignity(pid);
    if (dignity === 'exalted' || dignity === 'moolatrikona') strongFactors += 2;
    if (dignity === 'own') strongFactors++;
    // Spiritual yogas benefit from 9th/12th placement
    const house = ctx.planetHouse(pid);
    if (house === 9 || house === 12) strongFactors++;
    if (dignity === 'debilitated') weakFactors++;
    if (ctx.isCombust(pid)) weakFactors++;
  }

  if (strongFactors >= 3 && weakFactors === 0) return 'Strong';
  if (weakFactors >= 2) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Sannyasa Yoga Rules
// ─────────────────────────────────────────────────────────────────────────────

export const SANNYASA_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Pravrajya Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Pravrajya Yoga — Renunciation / Stellium Yoga
   *
   * 4 or more planets in a single house (stellium). Such intense concentration
   * of planetary energy in one area of life creates an overwhelming pull
   * that can lead to detachment from worldly pursuits.
   *
   * The nature of the stellium house determines whether the renunciation is
   * spiritual (9th/12th), material (2nd/11th), or relational (7th/5th).
   *
   * Source: BPHS Ch.36; Phaladeepika Ch.7 v.34-37
   */
  {
    id: 'pravrajya',
    name: { en: 'Pravrajya Yoga', hi: 'प्रव्रज्या योग', sa: 'प्रव्रज्यायोगः' },
    group: 'sannyasa',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.36; Phaladeepika Ch.7 v.34-37',

    conditions: {
      type: 'stellium',
      minPlanets: 4,
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      // Find the stellium house and count
      let maxCount = 0;
      let stelliumHouse = 0;

      for (let h = 1; h <= 12; h++) {
        const count = ctx.planetsInHouse(h).length;
        if (count > maxCount) {
          maxCount = count;
          stelliumHouse = h;
        }
      }

      // 5+ planets = very strong, spiritual houses amplify
      if (maxCount >= 5) return 'Strong';
      if (stelliumHouse === 9 || stelliumHouse === 12) return 'Strong';
      if (maxCount === 4) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['spiritual'],
    domainImpactWeight: 2,

    formationRule: {
      en: '4 or more planets concentrated in a single house (stellium), creating an overwhelming pull towards renunciation',
      hi: '4 या अधिक ग्रह एक ही भाव में केंद्रित (स्टेलियम), संन्यास की ओर भारी खिंचाव उत्पन्न करते हैं',
    },
    description: {
      en: 'Pravrajya Yoga forms when 4 or more planets concentrate in a single house, creating an intense energy vortex. The native is drawn irresistibly towards the themes of that house, often to the exclusion of other life areas. In spiritual houses (9th/12th), this manifests as genuine renunciation or monastic tendencies. In other houses, it creates such single-minded focus that worldly balance is sacrificed for mastery in one domain.',
      hi: 'प्रव्रज्या योग तब बनता है जब 4 या अधिक ग्रह एक ही भाव में केंद्रित होते हैं, एक तीव्र ऊर्जा भँवर बनाते हैं। जातक अनिवार्य रूप से उस भाव के विषयों की ओर खिंचता है। आध्यात्मिक भावों (9/12) में यह वास्तविक संन्यास प्रवृत्ति के रूप में प्रकट होता है। अन्य भावों में यह ऐसा एकाग्र ध्यान बनाता है कि सांसारिक संतुलन एक क्षेत्र में निपुणता के लिए त्याग दिया जाता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Moksha Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Moksha Yoga — Liberation Yoga
   *
   * 12th lord strong (own/exalted), Ketu in 12th house, and at least one
   * natural benefic aspects the 12th house. The house of final liberation
   * is activated and protected.
   *
   * Source: BPHS Ch.36; Jataka Parijata
   */
  {
    id: 'moksha-yoga',
    name: { en: 'Moksha Yoga', hi: 'मोक्ष योग', sa: 'मोक्षयोगः' },
    group: 'sannyasa',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.36; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // 12th lord must be strong (own/exalted/moolatrikona)
        const lord12 = ctx.houseLord(12);
        const dignity12 = ctx.dignity(lord12);
        const isStrong = dignity12 === 'exalted' || dignity12 === 'own' || dignity12 === 'moolatrikona';
        if (!isStrong) return { present: false, involvedPlanets: [] };

        // Ketu (8) must be in the 12th house
        const ketuHouse = ctx.planetHouse(8);
        if (ketuHouse !== 12) return { present: false, involvedPlanets: [] };

        // At least one natural benefic must aspect the 12th house
        let beneficAspects = false;
        const aspectingBenefics: number[] = [];
        for (const bid of NATURAL_BENEFICS) {
          if (ctx.doesAspect(bid, 12)) {
            beneficAspects = true;
            aspectingBenefics.push(bid);
          }
        }
        if (!beneficAspects) return { present: false, involvedPlanets: [] };

        return {
          present: true,
          involvedPlanets: [lord12, 8, ...aspectingBenefics],
          customData: { lord12, dignity12, aspectingBenefics },
        };
      },
    },

    assessStrength: spiritualStrength,

    affectedDomains: ['spiritual'],
    domainImpactWeight: 2,

    formationRule: {
      en: '12th lord strong (own/exalted), Ketu in 12th house, and a natural benefic aspects the 12th house',
      hi: '12वें का स्वामी बलवान (स्वराशि/उच्च), केतु 12वें भाव में, और शुभ ग्रह की 12वें भाव पर दृष्टि',
    },
    description: {
      en: 'Moksha Yoga is the yoga of final liberation — the rarest and most spiritually significant combination. The 12th house of dissolution is activated by its strong lord, Ketu (the planet of detachment and spiritual insight) resides there, and benefic aspects ensure the journey towards liberation is guided by grace rather than suffering. The native is naturally drawn to meditation, contemplation, and transcendence of material attachments.',
      hi: 'मोक्ष योग अंतिम मुक्ति का योग है — सबसे दुर्लभ और आध्यात्मिक रूप से महत्वपूर्ण संयोजन। 12वें भाव को उसके बलवान स्वामी द्वारा सक्रिय किया जाता है, केतु (वैराग्य और आध्यात्मिक अंतर्दृष्टि का ग्रह) वहाँ निवास करता है, और शुभ दृष्टि सुनिश्चित करती है कि मुक्ति की यात्रा कृपा से निर्देशित हो, न कि पीड़ा से।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Tapasvi Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Tapasvi Yoga — Ascetic Tendencies
   *
   * Moon in Capricorn (10) or Aquarius (11) — Saturn's signs — and aspected
   * by Saturn. The Moon's emotional nature is disciplined and hardened by
   * Saturn's influence, creating an ascetic disposition.
   *
   * Source: Saravali; Jataka Parijata
   */
  {
    id: 'tapasvi',
    name: { en: 'Tapasvi Yoga', hi: 'तपस्वी योग', sa: 'तपस्वियोगः' },
    group: 'sannyasa',
    isAuspicious: true,
    classicalRef: 'Saravali; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Moon in Capricorn (10) or Aquarius (11)
        const moonSign = ctx.planetSign(1);
        if (moonSign !== 10 && moonSign !== 11) {
          return { present: false, involvedPlanets: [] };
        }

        // Saturn must aspect Moon's house
        const moonHouse = ctx.planetHouse(1);
        const saturnAspects = ctx.doesAspect(6, moonHouse);
        if (!saturnAspects) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [1, 6], // Moon, Saturn
          customData: { moonSign, moonHouse },
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      // Saturn in own/exalted amplifies the ascetic quality
      const saturnDignity = ctx.dignity(6);
      if (saturnDignity === 'exalted' || saturnDignity === 'own') return 'Strong';

      // Moon debilitated in Scorpio would not apply (checked above: Cap/Aqua only)
      // Check if 9th/12th house involvement
      const moonHouse = ctx.planetHouse(1);
      if (moonHouse === 9 || moonHouse === 12) return 'Strong';

      return 'Moderate';
    },

    affectedDomains: ['spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Moon in Capricorn or Aquarius (Saturn\'s signs), aspected by Saturn — the emotional mind is disciplined towards austerity',
      hi: 'चंद्रमा मकर या कुम्भ (शनि की राशियों) में, शनि की दृष्टि — भावनात्मक मन तप की ओर अनुशासित',
    },
    description: {
      en: 'Tapasvi Yoga creates an ascetic temperament — the Moon in Saturn\'s signs under Saturn\'s gaze produces a mind that finds comfort in simplicity, discipline, and spiritual practice rather than sensory indulgence. The native may naturally gravitate towards meditation, fasting, or austere lifestyles. This is not a yoga of suffering but of voluntary simplicity — the person genuinely finds joy in restraint and inner exploration.',
      hi: 'तपस्वी योग तपस्वी स्वभाव बनाता है — शनि की राशियों में शनि की दृष्टि में चंद्रमा एक ऐसा मन उत्पन्न करता है जो इन्द्रिय भोग के बजाय सादगी, अनुशासन और आध्यात्मिक साधना में सुख पाता है। जातक स्वाभाविक रूप से ध्यान, उपवास या तपस्वी जीवनशैली की ओर आकर्षित हो सकता है। यह पीड़ा का नहीं बल्कि स्वैच्छिक सादगी का योग है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Vairagyakarak Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Vairagyakarak Yoga — Detachment Yoga
   *
   * Multiple planets (3+) in the 12th house, OR 12th lord in the 1st or 9th.
   * The house of losses, moksha, and foreign lands dominates the chart,
   * producing natural detachment from worldly accumulation.
   *
   * Source: Phaladeepika Ch.7; Saravali
   */
  {
    id: 'vairagyakarak',
    name: { en: 'Vairagyakarak Yoga', hi: 'वैराग्यकारक योग', sa: 'वैराग्यकारकयोगः' },
    group: 'sannyasa',
    isAuspicious: true,
    classicalRef: 'Phaladeepika Ch.7; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involvedPlanets: number[] = [];
        let variant = '';

        // Condition A: 3+ planets in 12th house
        const planetsIn12 = ctx.planetsInHouse(12);
        const sunToSatIn12 = planetsIn12.filter((pid) => SUN_TO_SATURN.includes(pid));
        if (sunToSatIn12.length >= 3) {
          variant = 'stellium_12th';
          involvedPlanets.push(...sunToSatIn12);
        }

        // Condition B: 12th lord in 1st or 9th
        if (!variant) {
          const lord12 = ctx.houseLord(12);
          const lord12House = ctx.planetHouse(lord12);
          if (lord12House === 1 || lord12House === 9) {
            variant = 'lord_12_in_' + lord12House;
            involvedPlanets.push(lord12);
          }
        }

        const present = variant !== '';

        return {
          present,
          involvedPlanets: present ? [...new Set(involvedPlanets)] : [],
          customData: present ? { variant, planetCount12th: sunToSatIn12.length } : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { variant?: string; planetCount12th?: number } | undefined;

      // 4+ planets in 12th = very strong detachment
      if ((data?.planetCount12th ?? 0) >= 4) return 'Strong';

      // 12th lord in 9th (dharma) = conscious spiritual choice = strong
      if (data?.variant === 'lord_12_in_9') return 'Strong';

      return spiritualStrength(ctx, result);
    },

    affectedDomains: ['spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: '3+ planets in the 12th house, OR 12th lord in the 1st or 9th house — detachment from worldly pursuits',
      hi: '3+ ग्रह 12वें भाव में, या 12वें का स्वामी 1ले या 9वें भाव में — सांसारिक विषयों से वैराग्य',
    },
    description: {
      en: 'Vairagyakarak Yoga cultivates natural detachment from material accumulation. When the 12th house — representing losses, dissolution, and spiritual surrender — is heavily activated, the native finds worldly achievements hollow. This is not depression but a genuine philosophical orientation towards non-attachment. The native may be generous to the point of self-sacrifice, drawn to foreign lands, or find that material success comes and goes without creating lasting happiness.',
      hi: 'वैराग्यकारक योग भौतिक संचय से स्वाभाविक वैराग्य उत्पन्न करता है। जब 12वाँ भाव — हानि, विलय और आध्यात्मिक समर्पण का भाव — अत्यधिक सक्रिय होता है, तो जातक को सांसारिक उपलब्धियाँ खोखली लगती हैं। यह निराशा नहीं बल्कि अनासक्ति की एक वास्तविक दार्शनिक अभिमुखता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Sada Sannyasa Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Sada Sannyasa Yoga — Lifelong Spiritual Service
   *
   * 10th lord in the 10th house (own kendra), aspected by Saturn.
   * The career house is self-reinforcing AND disciplined by Saturn,
   * producing a person whose life's work IS their spiritual practice.
   *
   * Source: Jataka Parijata; Saravali
   */
  {
    id: 'sada-sannyasa',
    name: { en: 'Sada Sannyasa Yoga', hi: 'सदा संन्यास योग', sa: 'सदासंन्यासयोगः' },
    group: 'sannyasa',
    isAuspicious: true,
    classicalRef: 'Jataka Parijata; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // 10th lord must be in the 10th house
        const lord10 = ctx.houseLord(10);
        const lord10House = ctx.planetHouse(lord10);
        if (lord10House !== 10) {
          return { present: false, involvedPlanets: [] };
        }

        // Saturn (6) must aspect the 10th house
        const saturnAspects10 = ctx.doesAspect(6, 10);
        // Also count if Saturn IS the 10th lord (already in 10th)
        const saturnIs10thLord = lord10 === 6;

        if (!saturnAspects10 && !saturnIs10thLord) {
          return { present: false, involvedPlanets: [] };
        }

        const involved = [lord10];
        if (!saturnIs10thLord) involved.push(6);

        return {
          present: true,
          involvedPlanets: [...new Set(involved)],
          customData: { lord10, saturnAspects10, saturnIs10thLord },
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { lord10?: number; saturnIs10thLord?: boolean } | undefined;
      const lord10 = data?.lord10 ?? 0;
      const dignity = ctx.dignity(lord10);

      // 10th lord strong in own house + Saturn's discipline = strong
      if (dignity === 'own' || dignity === 'exalted' || dignity === 'moolatrikona') return 'Strong';
      if (data?.saturnIs10thLord) return 'Strong'; // Saturn in own 10th = very strong

      return 'Moderate';
    },

    affectedDomains: ['spiritual', 'career'],
    domainImpactWeight: 1,

    formationRule: {
      en: '10th lord in the 10th house, aspected by Saturn — career becomes a vehicle for spiritual service',
      hi: '10वें का स्वामी 10वें भाव में, शनि की दृष्टि — करियर आध्यात्मिक सेवा का माध्यम बनता है',
    },
    description: {
      en: 'Sada Sannyasa Yoga indicates a person whose career and spiritual path are one and the same. The 10th lord occupying its own house creates a powerful professional identity, while Saturn\'s disciplining aspect channels that energy towards service and renunciation rather than personal glory. These natives often become teachers, healers, monks, social workers, or spiritual leaders — people for whom work is worship. The yoga persists throughout life, hence "sada" (always/eternal).',
      hi: 'सदा संन्यास योग उस व्यक्ति को दर्शाता है जिसका करियर और आध्यात्मिक मार्ग एक ही हैं। 10वें भाव में 10वें का स्वामी एक शक्तिशाली पेशेवर पहचान बनाता है, जबकि शनि की अनुशासनात्मक दृष्टि उस ऊर्जा को व्यक्तिगत महिमा के बजाय सेवा और त्याग की ओर मोड़ती है। ये जातक अक्सर शिक्षक, चिकित्सक, सन्यासी या आध्यात्मिक नेता बनते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Parivraja Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Parivraja Yoga — Austere Renunciation
   *
   * 4 or more planets concentrated in one house AND Saturn among them
   * in a strong position (own/exalted/moolatrikona). The Saturn-led
   * stellium creates a severe, austere form of renunciation — wandering
   * asceticism rather than comfortable monasticism.
   *
   * Source: Jataka Parijata; BPHS Ch.36
   */
  {
    id: 'parivraja',
    name: { en: 'Parivraja Yoga', hi: 'परिव्राज योग', sa: 'परिव्राजयोगः' },
    group: 'sannyasa',
    isAuspicious: true,
    classicalRef: 'Jataka Parijata; BPHS Ch.36',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Find houses with 4+ planets (Sun through Saturn only)
        for (let h = 1; h <= 12; h++) {
          const planetsInH = ctx.planetsInHouse(h).filter((pid) => SUN_TO_SATURN.includes(pid));
          if (planetsInH.length < 4) continue;

          // Saturn (6) must be among them
          if (!planetsInH.includes(6)) continue;

          // Saturn must be strong (own/exalted/moolatrikona)
          const saturnDignity = ctx.dignity(6);
          const saturnStrong =
            saturnDignity === 'own' ||
            saturnDignity === 'exalted' ||
            saturnDignity === 'moolatrikona';
          if (!saturnStrong) continue;

          return {
            present: true,
            involvedPlanets: planetsInH,
            customData: { stelliumHouse: h, planetCount: planetsInH.length, saturnDignity },
          };
        }

        return { present: false, involvedPlanets: [] };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { planetCount?: number; stelliumHouse?: number } | undefined;
      const count = data?.planetCount ?? 0;

      // 5+ planets with strong Saturn = very strong
      if (count >= 5) return 'Strong';
      // Stellium in 9th/12th = amplified spiritual focus
      const house = data?.stelliumHouse ?? 0;
      if (house === 9 || house === 12) return 'Strong';

      return 'Moderate';
    },

    affectedDomains: ['spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: '4 or more planets in one house including a strong Saturn (own/exalted/moolatrikona) — austere wandering renunciation',
      hi: '4 या अधिक ग्रह एक भाव में, बलवान शनि (स्वराशि/उच्च/मूलत्रिकोण) सहित — कठोर परिव्राजक संन्यास',
    },
    description: {
      en: 'Parivraja Yoga forms when 4 or more planets concentrate in a single house with a strong Saturn leading the congregation. This produces austere, wandering renunciation — the native may become a mendicant, ascetic traveller, or practitioner of severe spiritual disciplines. Unlike the broader Pravrajya (stellium without Saturn requirement), Parivraja specifically indicates Saturn\'s brand of detachment: cold, disciplined, and uncompromising in its pursuit of liberation through austerity.',
      hi: 'परिव्राज योग तब बनता है जब 4 या अधिक ग्रह एक भाव में बलवान शनि के साथ केंद्रित होते हैं। यह कठोर, भ्रमणशील संन्यास उत्पन्न करता है — जातक भिक्षु, तपस्वी यात्री या गंभीर आध्यात्मिक अनुशासन का अभ्यासी हो सकता है। शनि का वैराग्य शीतल, अनुशासित और तपस्या के माध्यम से मुक्ति की अटल खोज है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Pravrajya Extended Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Pravrajya Extended — Deep Spiritual Path
   *
   * Lord of 10th house in 9th house aspected by Saturn AND lord of 9th
   * house in 12th house. The career lord dissolves into dharma, and the
   * dharma lord dissolves into moksha — a chain of renunciation from
   * worldly action through faith into liberation.
   *
   * Source: Jataka Parijata; Saravali
   */
  {
    id: 'pravrajya-extended',
    name: { en: 'Pravrajya Extended', hi: 'प्रव्रज्या विस्तारित योग', sa: 'प्रव्रज्याविस्तारितयोगः' },
    group: 'sannyasa',
    isAuspicious: true,
    classicalRef: 'Jataka Parijata; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Lord of 10th must be in 9th
        const lord10 = ctx.houseLord(10);
        if (ctx.planetHouse(lord10) !== 9) {
          return { present: false, involvedPlanets: [] };
        }

        // Lord of 10th in 9th must be aspected by Saturn (6)
        if (!ctx.doesAspect(6, 9) && lord10 !== 6) {
          return { present: false, involvedPlanets: [] };
        }

        // Lord of 9th must be in 12th
        const lord9 = ctx.houseLord(9);
        if (ctx.planetHouse(lord9) !== 12) {
          return { present: false, involvedPlanets: [] };
        }

        const involved = [...new Set([lord10, lord9, 6])];
        return {
          present: true,
          involvedPlanets: involved,
          customData: { lord10, lord9 },
        };
      },
    },

    assessStrength: spiritualStrength,

    affectedDomains: ['spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Lord of 10th in 9th aspected by Saturn, AND lord of 9th in 12th — a chain of renunciation from career through dharma to liberation',
      hi: '10वें का स्वामी 9वें में शनि की दृष्टि सहित, और 9वें का स्वामी 12वें में — करियर से धर्म से मुक्ति तक संन्यास की श्रृंखला',
    },
    description: {
      en: 'Pravrajya Extended forms a spiritual chain: the career lord (10th) dissolves into the house of dharma (9th) under Saturn\'s disciplining gaze, and the dharma lord (9th) dissolves into the house of final liberation (12th). This cascading renunciation indicates a native whose worldly achievements naturally transform into spiritual practice, and whose spiritual practice leads to genuine transcendence. They may transition from a successful professional career to full-time spiritual seeking later in life.',
      hi: 'प्रव्रज्या विस्तारित एक आध्यात्मिक श्रृंखला बनाता है: करियर स्वामी (10वां) शनि की अनुशासनात्मक दृष्टि में धर्म भाव (9वें) में विलीन होता है, और धर्म स्वामी (9वां) अंतिम मुक्ति भाव (12वें) में विलीन होता है। जातक की सांसारिक उपलब्धियां स्वाभाविक रूप से आध्यात्मिक साधना में परिवर्तित होती हैं।',
    },
  },
];
