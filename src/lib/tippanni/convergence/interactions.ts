// src/lib/tippanni/convergence/interactions.ts
// 12 meta-interaction rules that fire AFTER pattern matching for cross-pattern synthesis

import type { MetaRule, MatchedPattern, ConvergenceInput, MetaInsight } from './types';

// ─── Helper: Pattern sets by theme ───────────────────────────────────────────

const POSITIVE_PATTERNS: Record<string, string[]> = {
  career: ['career-peak', 'public-recognition'],
  relationship: ['marriage-window', 'partnership-blessing'],
  wealth: ['sudden-wealth', 'steady-accumulation', 'speculative-gains', 'property-acquisition'],
  health: ['recovery', 'vitality-peak'],
  spiritual: ['awakening', 'guru-connection', 'moksha-activation'],
  family: ['childbirth', 'family-harmony'],
};

const NEGATIVE_PATTERNS: Record<string, string[]> = {
  career: ['authority-conflict', 'career-change', 'professional-stagnation'],
  relationship: ['relationship-storm', 'divorce-separation'],
  wealth: ['financial-crisis', 'speculative-losses', 'debt-trap'],
  health: ['chronic-illness', 'mental-health', 'accident-prone'],
  spiritual: ['detachment'],
  family: ['child-health', 'mother-health', 'father-health', 'property-dispute'],
};

// ─── Helper: Theme display names ─────────────────────────────────────────────

const THEME_NAMES: Record<string, { en: string; hi: string }> = {
  career: { en: 'career', hi: 'करियर' },
  relationship: { en: 'relationship', hi: 'संबंध' },
  wealth: { en: 'wealth', hi: 'धन' },
  health: { en: 'health', hi: 'स्वास्थ्य' },
  spiritual: { en: 'spirituality', hi: 'आध्यात्म' },
  family: { en: 'family', hi: 'परिवार' },
};

// ─── Helper predicates ───────────────────────────────────────────────────────

function hasPatternId(patterns: MatchedPattern[], id: string): boolean {
  return patterns.some((p) => p.patternId === id);
}

function hasTheme(patterns: MatchedPattern[], theme: string): boolean {
  return patterns.some((p) => p.theme === theme);
}

// Return all matched pattern IDs belonging to a set
function matchedInSet(patterns: MatchedPattern[], set: string[]): MatchedPattern[] {
  return patterns.filter((p) => set.includes(p.patternId));
}

// Get planets involved in transit conditions (approximated by checking transits array)
function getTransitPlanetIds(input: ConvergenceInput): Set<number> {
  return new Set(input.transits.map((t) => t.planetId));
}

// Find the SAV bindu for a planet in its current transit sign
function getSAVForPlanetTransit(input: ConvergenceInput, planetId: number): number | null {
  const transit = input.transits.find((t) => t.planetId === planetId);
  if (!transit) return null;
  // ashtakavargaSAV is indexed by sign (0-based, sign - 1)
  const signIndex = transit.sign - 1;
  if (signIndex < 0 || signIndex >= input.ashtakavargaSAV.length) return null;
  return input.ashtakavargaSAV[signIndex];
}

// ─── The 12 Meta Rules ────────────────────────────────────────────────────────

export const META_RULES: MetaRule[] = [
  // ── 1. career-health-clash ──────────────────────────────────────────────────
  {
    id: 'career-health-clash',
    trigger(patterns) {
      const careerPositiveIds = POSITIVE_PATTERNS.career;
      const healthNegativeIds = NEGATIVE_PATTERNS.health;
      const hasCareerPositive = patterns.some((p) => careerPositiveIds.includes(p.patternId));
      const hasHealthNegative = patterns.some((p) => healthNegativeIds.includes(p.patternId));
      return hasCareerPositive && hasHealthNegative;
    },
    generate(_patterns, _input, _locale): MetaInsight {
      return {
        ruleId: 'career-health-clash',
        text: {
          en: 'Your career is accelerating but your body is sounding alarms — pace yourself or risk burnout. The chart asks you to honor both ambition and wellness.',
          hi: 'करियर तेज हो रहा है लेकिन शरीर चेतावनी दे रहा है — स्वयं को गति दें या बर्नआउट का जोखिम उठाएँ।',
        },
        severity: 2,
      };
    },
  },

  // ── 2. wealth-relationship-tension ─────────────────────────────────────────
  {
    id: 'wealth-relationship-tension',
    trigger(patterns) {
      const wealthPositiveIds = POSITIVE_PATTERNS.wealth;
      const relationshipNegativeIds = NEGATIVE_PATTERNS.relationship;
      const hasWealthPositive = patterns.some((p) => wealthPositiveIds.includes(p.patternId));
      const hasRelationshipNegative = patterns.some((p) =>
        relationshipNegativeIds.includes(p.patternId),
      );
      return hasWealthPositive && hasRelationshipNegative;
    },
    generate(_patterns, _input, _locale): MetaInsight {
      return {
        ruleId: 'wealth-relationship-tension',
        text: {
          en: "Financial growth comes at the cost of partnership harmony — the chart asks you to balance money and love. Don't let career success become an excuse to neglect your closest relationship.",
          hi: 'वित्तीय वृद्धि साझेदारी सद्भाव की कीमत पर — कुंडली धन और प्रेम को संतुलित करने कहती है।',
        },
        severity: 2,
      };
    },
  },

  // ── 3. spiritual-career-conflict ────────────────────────────────────────────
  {
    id: 'spiritual-career-conflict',
    trigger(patterns) {
      const spiritualIds = ['awakening', 'moksha-activation', 'detachment'];
      const careerPressureIds = ['authority-conflict', 'professional-stagnation'];
      const hasSpiritualActive = patterns.some((p) => spiritualIds.includes(p.patternId));
      const hasCareerPressure = patterns.some((p) => careerPressureIds.includes(p.patternId));
      return hasSpiritualActive && hasCareerPressure;
    },
    generate(_patterns, _input, _locale): MetaInsight {
      return {
        ruleId: 'spiritual-career-conflict',
        text: {
          en: "You're being pulled between worldly ambition and inner calling — this tension is the lesson itself. Don't force a choice; let the path reveal itself through patience.",
          hi: 'सांसारिक महत्वाकांक्षा और आंतरिक पुकार के बीच खिंचाव — यह तनाव ही पाठ है।',
        },
        severity: 1,
      };
    },
  },

  // ── 4. multiple-high-activation ─────────────────────────────────────────────
  {
    id: 'multiple-high-activation',
    trigger(patterns) {
      const highActivationCount = patterns.filter((p) => p.finalScore > 4).length;
      return highActivationCount >= 3;
    },
    generate(_patterns, _input, _locale): MetaInsight {
      return {
        ruleId: 'multiple-high-activation',
        text: {
          en: 'This is an exceptionally intense period — multiple life areas are demanding transformation simultaneously. Prioritize ruthlessly: not everything can be addressed at once. Focus on the highest-significance pattern first.',
          hi: 'यह असाधारण रूप से तीव्र अवधि — कई जीवन क्षेत्र एक साथ परिवर्तन की माँग कर रहे हैं। सर्वोच्च महत्व के पैटर्न पर पहले ध्यान दें।',
        },
        severity: 3,
      };
    },
  },

  // ── 5. all-quiet ─────────────────────────────────────────────────────────────
  {
    id: 'all-quiet',
    trigger(patterns) {
      return patterns.length === 0;
    },
    generate(_patterns, _input, _locale): MetaInsight {
      return {
        ruleId: 'all-quiet',
        text: {
          en: 'No major convergence patterns are currently active. This is a consolidation period — use this quiet window to prepare, save, build skills, and strengthen foundations for the next wave of activation.',
          hi: 'कोई बड़ा संयोग पैटर्न सक्रिय नहीं। यह स्थिरीकरण काल — अगली सक्रियता लहर की तैयारी, बचत, कौशल निर्माण और नींव मजबूत करने का समय।',
        },
        severity: 1,
      };
    },
  },

  // ── 6. dasha-transition-amplifier ──────────────────────────────────────────
  {
    id: 'dasha-transition-amplifier',
    trigger(patterns, input) {
      return input.dashaTransitionWithin6Months === true && patterns.length > 0;
    },
    generate(_patterns, _input, _locale): MetaInsight {
      return {
        ruleId: 'dasha-transition-amplifier',
        text: {
          en: 'A major dasha transition is approaching within 6 months. Decisions made now carry amplified significance — they will define the tone of the next cycle. The current patterns will shift dramatically. Act with deliberation.',
          hi: '6 महीने के भीतर बड़ा दशा संक्रमण। अभी लिए गए निर्णय अगले चक्र की दिशा तय करेंगे। वर्तमान पैटर्न नाटकीय रूप से बदलेंगे।',
        },
        severity: 3,
      };
    },
  },

  // ── 7. double-benefic ────────────────────────────────────────────────────────
  {
    id: 'double-benefic',
    trigger(patterns) {
      for (const theme of Object.keys(POSITIVE_PATTERNS)) {
        const positiveSet = POSITIVE_PATTERNS[theme];
        const matched = matchedInSet(patterns, positiveSet);
        if (matched.length >= 2) return true;
      }
      return false;
    },
    generate(patterns, _input, _locale): MetaInsight | null {
      for (const theme of Object.keys(POSITIVE_PATTERNS)) {
        const positiveSet = POSITIVE_PATTERNS[theme];
        const matched = matchedInSet(patterns, positiveSet);
        if (matched.length >= 2) {
          const themeNameEn = THEME_NAMES[theme]?.en ?? theme;
          const themeNameHi = THEME_NAMES[theme]?.hi ?? theme;
          return {
            ruleId: 'double-benefic',
            text: {
              en: `Rare double blessing in ${themeNameEn} — multiple protective forces align. This is your green light. When two independent positive patterns reinforce each other, the effect is multiplicative, not additive.`,
              hi: `${themeNameHi} में दुर्लभ दोहरा आशीर्वाद — कई सुरक्षात्मक बल संरेखित। यह आपकी हरी बत्ती है।`,
            },
            severity: 1,
          };
        }
      }
      return null;
    },
  },

  // ── 8. double-malefic ────────────────────────────────────────────────────────
  {
    id: 'double-malefic',
    trigger(patterns) {
      for (const theme of Object.keys(NEGATIVE_PATTERNS)) {
        const negativeSet = NEGATIVE_PATTERNS[theme];
        const matched = matchedInSet(patterns, negativeSet);
        if (matched.length >= 2) return true;
      }
      return false;
    },
    generate(patterns, _input, _locale): MetaInsight | null {
      for (const theme of Object.keys(NEGATIVE_PATTERNS)) {
        const negativeSet = NEGATIVE_PATTERNS[theme];
        const matched = matchedInSet(patterns, negativeSet);
        if (matched.length >= 2) {
          const themeNameEn = THEME_NAMES[theme]?.en ?? theme;
          const themeNameHi = THEME_NAMES[theme]?.hi ?? theme;
          return {
            ruleId: 'double-malefic',
            text: {
              en: `Compounding pressure in ${themeNameEn} — this requires conscious navigation, not passive endurance. Multiple challenges in the same area create a crisis that demands active response. Seek professional guidance.`,
              hi: `${themeNameHi} में संयुक्त दबाव — यह सचेत नेविगेशन की माँग करता है, निष्क्रिय सहन की नहीं।`,
            },
            severity: 3,
          };
        }
      }
      return null;
    },
  },

  // ── 9. retrograde-amplifier ──────────────────────────────────────────────────
  {
    id: 'retrograde-amplifier',
    trigger(patterns, input) {
      if (patterns.length === 0) return false;
      // Check if any transit planet involved in patterns is currently retrograde
      const retroPlanetIds = new Set(
        input.transits.filter((t) => t.isRetrograde).map((t) => t.planetId),
      );
      if (retroPlanetIds.size === 0) return false;
      // Also check natal retrograde planets
      const natalRetroPlanetIds = new Set(
        input.planets.filter((p) => p.isRetrograde).map((p) => p.id),
      );
      // Fire if any planet (natal or transit) is retrograde while patterns are active
      return retroPlanetIds.size > 0 || natalRetroPlanetIds.size > 0;
    },
    generate(_patterns, _input, _locale): MetaInsight {
      return {
        ruleId: 'retrograde-amplifier',
        text: {
          en: 'A key planet in your convergence pattern is retrograde, intensifying the effects inward — you may feel the impacts more psychologically than externally. Inner work, reflection, and journaling are especially productive.',
          hi: 'आपके संयोग पैटर्न का एक प्रमुख ग्रह वक्री है — प्रभाव बाहरी से अधिक मनोवैज्ञानिक। आंतरिक कार्य और चिंतन विशेष रूप से उत्पादक।',
        },
        severity: 1,
      };
    },
  },

  // ── 10. ashtakavarga-boost ───────────────────────────────────────────────────
  {
    id: 'ashtakavarga-boost',
    trigger(patterns, input) {
      if (patterns.length === 0) return false;
      const transitPlanetIds = getTransitPlanetIds(input);
      for (const planetId of transitPlanetIds) {
        const sav = getSAVForPlanetTransit(input, planetId);
        if (sav !== null && sav >= 30) return true;
      }
      return false;
    },
    generate(_patterns, input, _locale): MetaInsight | null {
      const transitPlanetIds = getTransitPlanetIds(input);
      for (const planetId of transitPlanetIds) {
        const sav = getSAVForPlanetTransit(input, planetId);
        if (sav !== null && sav >= 30) {
          // Convert SAV (0–56 range) to a /8 scale for display
          const bindus = Math.round((sav / 56) * 8);
          return {
            ruleId: 'ashtakavarga-boost',
            text: {
              en: `A transit in your convergence pattern has exceptional Ashtakavarga strength (${bindus}/8 points) — its effects will be pronounced and unmistakable. Pay close attention to events related to this transit house.`,
              hi: `संयोग पैटर्न में एक गोचर की असाधारण अष्टकवर्ग शक्ति (${bindus}/8 अंक) — प्रभाव स्पष्ट और अचूक।`,
            },
            severity: 1,
          };
        }
      }
      return null;
    },
  },

  // ── 11. ashtakavarga-weakness ────────────────────────────────────────────────
  {
    id: 'ashtakavarga-weakness',
    trigger(patterns, input) {
      if (patterns.length === 0) return false;
      const transitPlanetIds = getTransitPlanetIds(input);
      for (const planetId of transitPlanetIds) {
        const sav = getSAVForPlanetTransit(input, planetId);
        if (sav !== null && sav <= 22) return true;
      }
      return false;
    },
    generate(_patterns, input, _locale): MetaInsight | null {
      const transitPlanetIds = getTransitPlanetIds(input);
      for (const planetId of transitPlanetIds) {
        const sav = getSAVForPlanetTransit(input, planetId);
        if (sav !== null && sav <= 22) {
          const bindus = Math.round((sav / 56) * 8);
          return {
            ruleId: 'ashtakavarga-weakness',
            text: {
              en: `Despite the transit pattern, its Ashtakavarga support is weak (${bindus}/8 points) — the effects may be muted or delayed. Don't overreact to this transit; it lacks the strength to deliver full impact.`,
              hi: `गोचर पैटर्न के बावजूद अष्टकवर्ग समर्थन कमजोर (${bindus}/8 अंक) — प्रभाव मंद या विलंबित। अतिप्रतिक्रिया न करें।`,
            },
            severity: 1,
          };
        }
      }
      return null;
    },
  },

  // ── 12. navamsha-confirmation ────────────────────────────────────────────────
  {
    id: 'navamsha-confirmation',
    trigger(patterns, input) {
      return patterns.some(
        (p) => input.navamshaConfirmations[p.theme] === true,
      );
    },
    generate(_patterns, _input, _locale): MetaInsight {
      return {
        ruleId: 'navamsha-confirmation',
        text: {
          en: 'This convergence pattern is confirmed in your Navamsha (D9) chart — indicating deeper karmic significance, not just a surface-level transit effect. The pattern carries weight across multiple dimensions of your chart.',
          hi: 'यह संयोग पैटर्न नवांश (D9) कुंडली में पुष्ट — गहरा कार्मिक महत्व, केवल सतही गोचर प्रभाव नहीं।',
        },
        severity: 2,
      };
    },
  },
];
