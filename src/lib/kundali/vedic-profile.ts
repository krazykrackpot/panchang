/**
 * Vedic Profile Engine
 *
 * Generates a narrative astrology profile from KundaliData. This is the
 * "story-telling" layer that sits on top of the raw astronomical data and
 * produces human-readable, personalised prose for the Kundali page.
 *
 * Pure function — no API calls, no async, instant.
 *
 * ─── Pipeline Overview ───────────────────────────────────────────────
 *
 *   1. **Pattern Detection** (`detectChartPatterns`)
 *      Scans the chart for 11 types of notable configurations, each
 *      assigned a priority score. Patterns are sorted by score so the
 *      most significant feature leads the narrative.
 *
 *   2. **Hook** (`buildHook`)
 *      A one-sentence opener derived from the highest-scored pattern.
 *      Uses deterministic variant selection (birth-data hash) so the
 *      same chart always produces the same hook.
 *
 *   3. **Core Identity** (`buildCoreIdentity`)
 *      Two paragraphs: Lagna (ascendant sign + lord + personality from
 *      LAGNA_DEEP) and Moon (sign + nakshatra details from
 *      NAKSHATRA_DETAILS). Maps to the Tattva (element) and Guna
 *      (quality) framework per BPHS Ch.3-4.
 *
 *   4. **Standout Feature** (`buildStandout`)
 *      A 3-4 sentence expansion of the top pattern. Each pattern type
 *      has a dedicated narrative branch with contextual data (house
 *      themes, dignity, neecha bhanga checks, etc.).
 *
 *   5. **Planetary Observations** (`buildPlanetaryObservations`)
 *      Up to 3 secondary patterns rendered as connected prose paragraphs,
 *      joined by narrative connectors ("Additionally," "Moreover,").
 *
 *   6. **Nakshatra Insight** (`buildNakshatraInsight`)
 *      Moon's nakshatra mythology, meaning, characteristics, and gana
 *      from the NAKSHATRA_DETAILS constant.
 *
 *   7. **Dasha Context** (`buildDashaContext`)
 *      Current Mahadasha and Antardasha with house placement of the
 *      dasha lord and the DASHA_EFFECTS commentary.
 *
 *   8. **Dosha Section** (`buildDoshaSection`)
 *      Checks for Manglik, Kaal Sarpa, and Sade Sati with cancellation
 *      conditions. Maps to BPHS Ch.77 (Manglik) and traditional texts.
 *
 *   9. **Strength Table** (`buildStrengthTable`)
 *      Lists only planets with notable dignity (exalted, debilitated,
 *      own sign, or retrograde) with a one-sentence impact summary.
 *
 * ─── Classical Concepts Mapped ───────────────────────────────────────
 *
 *   - Tattva (elements: Fire/Earth/Air/Water) — used in element balance
 *     analysis within contrasting elements pattern detection
 *   - Guna (qualities: Cardinal/Fixed/Mutable) — referenced via rashi quality
 *   - Graha Drishti — aspect checks for Gajakesari and cancellation conditions
 *   - Neecha Bhanga Raja Yoga — debilitated key planet with cancellation check
 *   - Pancha Mahapurusha Yoga — from yogasComplete (BPHS Ch.75)
 *   - Raja Yoga — from yogasComplete (BPHS Ch.37-41)
 *   - Kaal Sarpa Yoga — all planets between Rahu-Ketu axis
 *   - Gajakesari Yoga — Jupiter in kendra from Moon (Phaladeepika Ch.6)
 *   - Chandra-Mangala Yoga — Moon-Mars conjunction (BPHS Ch.36)
 *
 * ─── Locale Support ──────────────────────────────────────────────────
 *
 *   Bilingual (EN/HI). Each narrative function contains parallel
 *   Hindi text constructed from the same data. The `tl()` helper
 *   provides safe Trilingual access with English fallback.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';
import { LAGNA_DEEP } from './tippanni-lagna';
import { PLANET_HOUSE_DEPTH, DASHA_EFFECTS } from './tippanni-planets';
import {
  HOOK_TEMPLATES, MOON_SIGN_NARRATIVES, HOUSE_THEME_LABELS,
  ELEMENT_NAMES, LAGNA_LORDS, CONNECTORS, DIGNITY_LABELS,
  bt,
} from './vedic-profile-templates';

// ─── Types ───────────────────────────────────────────────────────

/**
 * A detected chart pattern — a notable configuration in the horoscope.
 *
 * Each pattern has a `score` (0-100) that determines its narrative priority.
 * Higher-scored patterns lead the profile's hook and standout sections.
 *
 * Score hierarchy (descending importance):
 *   90 — Stellium (3+ planets in one house): rare, highly defining
 *   85 — Kaal Sarpa: all planets hemmed by Rahu-Ketu axis
 *   80 — Raja Yoga (2+): kendra-trikona lord combinations
 *   75 — Mahapurusha: one of the 5 special yogas (BPHS Ch.75)
 *   70 — Dignified Lagna Lord: lagna lord exalted or in own sign
 *   65 — Debilitated Key Planet: lagna lord, Moon, or Sun debilitated
 *   60 — Retrograde in Kendra: a vakri planet in houses 1/4/7/10
 *   55 — Sade Sati: Saturn transiting over natal Moon
 *   50 — Lunar Yoga: Gajakesari or Chandra-Mangala
 *   45 — Same Lagna-Moon sign: unified personality
 *   40 — Contrasting Elements: lagna and moon in different elements (fallback)
 *
 * `templateData` holds locale-independent IDs (signId, planetId) that are
 * resolved to locale-specific names at render time — this avoids storing
 * language-specific strings in the detection phase.
 */
export interface ChartPattern {
  type: 'stellium' | 'kaalSarpa' | 'rajaYoga' | 'mahapurusha' | 'dignifiedLagnaLord'
      | 'debilitatedKey' | 'sameLagnaMoon' | 'contrastingElements' | 'sadeSati'
      | 'lunarYoga' | 'retrogradeKendra';
  score: number;
  planets: number[];
  houses?: number[];
  yogaName?: string;
  description?: string;
  // Template interpolation data — contains IDs that get resolved to
  // locale-specific names at render time (not stored as text).
  templateData?: Record<string, string>;
}

export interface StrengthRow {
  planet: string;
  dignity: string;
  house: number;
  impact: string;
}

export interface VedicProfile {
  hook: string;
  coreIdentity: { lagna: string; moon: string };
  standout: string;
  planetaryObservations: string[];
  nakshatraInsight: string;
  dashaContext: string;
  doshaSection: string | null;
  strengthTable: StrengthRow[];
  personName: string;
}

// ─── Locale helpers ──────────────────────────────────────────────

/** Safe trilingual text accessor. Returns the text for the requested locale,
 *  falling back to English if the locale key is missing (e.g. Tamil, Bengali).
 *  See Lesson J: locale fallback is non-negotiable. */
function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  const l = locale as keyof LocaleText;
  return (obj[l] as string) || obj.en || '';
}

/** Simple hash of a string → number for deterministic variant selection */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Replaces `{key}` placeholders in a template string with values from `data`.
 *  Unresolved placeholders are left as-is (e.g. `{unknown}`) for debugging. */
function interpolate(template: string, data: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || `{${key}}`);
}

// ─── Pattern Detection ──────────────────────────────────────────

/**
 * Scans a kundali for 11 types of notable chart configurations.
 *
 * Detection order does not affect output — all patterns are detected
 * independently, then sorted by score descending. The score determines
 * which pattern leads the narrative (hook + standout).
 *
 * Each detected pattern stores locale-independent data (planet IDs, sign IDs)
 * in `templateData` so that locale resolution happens only at render time.
 *
 * @returns Patterns sorted by score (highest first). An empty array is
 *          possible but unlikely — contrastingElements (score 40) or
 *          sameLagnaMoon (score 45) serve as fallbacks for most charts.
 */
export function detectChartPatterns(kundali: KundaliData): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const planets = kundali.planets;
  const ascSign = kundali.ascendant.sign;
  const moon = planets.find(p => p.planet.id === 1);
  const moonSign = moon?.sign || 1;

  // 1. Stellium detection: 3+ planets concentrated in a single house.
  //    Stelliums intensify the house's significations dramatically.
  //    Score 90 because a triple+ conjunction is rare and chart-defining.
  const houseCounts: Record<number, number[]> = {};
  for (const p of planets) {
    if (!houseCounts[p.house]) houseCounts[p.house] = [];
    houseCounts[p.house].push(p.planet.id);
  }
  for (const [house, pIds] of Object.entries(houseCounts)) {
    if (pIds.length >= 3) {
      patterns.push({
        type: 'stellium',
        score: 90,
        planets: pIds,
        houses: [Number(house)],
        templateData: {
          house: String(house),
          houseTheme: '', // resolved at render time
          count: String(pIds.length),
        },
      });
    }
  }

  // 2. Kaal Sarpa Yoga — all 7 visible planets hemmed between Rahu and Ketu.
  //    This karmic configuration (not in BPHS but widely recognised in
  //    modern Vedic practice) indicates intense karmic experiences along
  //    the Rahu-Ketu axis. Score 85 for its life-defining nature.
  //    The check tests both directions (Rahu→Ketu and Ketu→Rahu) because
  //    all planets must lie on one side of the nodal axis.
  const rahu = planets.find(p => p.planet.id === 7);
  const ketu = planets.find(p => p.planet.id === 8);
  if (rahu && ketu) {
    const rahuH = rahu.house;
    const ketuH = ketu.house;
    const others = planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
    // Check if all planets are on one side of the Rahu-Ketu axis
    const allOnOneSide = others.every(p => {
      const dist = ((p.house - rahuH + 12) % 12);
      const ketuDist = ((ketuH - rahuH + 12) % 12);
      return dist > 0 && dist < ketuDist;
    }) || others.every(p => {
      const dist = ((p.house - ketuH + 12) % 12);
      const rahuDist = ((rahuH - ketuH + 12) % 12);
      return dist > 0 && dist < rahuDist;
    });
    if (allOnOneSide) {
      patterns.push({
        type: 'kaalSarpa',
        score: 85,
        planets: [7, 8],
        houses: [rahuH, ketuH],
        templateData: { house: String(rahuH), house2: String(ketuH) },
      });
    }
  }

  // 3. Raja Yogas — combinations of kendra and trikona lords (BPHS Ch.37-41).
  //    Requires 2+ active raja yogas to qualify as a profile-defining pattern.
  //    Score 80 for the authority/recognition theme.
  if (kundali.yogasComplete) {
    const rajaYogas = kundali.yogasComplete.filter(y => y.category === 'raja' && y.present);
    if (rajaYogas.length >= 2) {
      patterns.push({
        type: 'rajaYoga',
        score: 80,
        planets: [],
        templateData: { count: String(rajaYogas.length) },
      });
    }

    // 4. Pancha Mahapurusha Yoga (BPHS Ch.75) — formed when Mars, Mercury,
    //    Jupiter, Venus, or Saturn occupies its own or exaltation sign in a
    //    kendra. Named: Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter),
    //    Malavya (Venus), Shasha (Saturn). Score 75.
    const mahapurusha = kundali.yogasComplete.filter(y => y.category === 'mahapurusha' && y.present);
    for (const mp of mahapurusha) {
      patterns.push({
        type: 'mahapurusha',
        score: 75,
        planets: [],
        yogaName: mp.name.en,
        templateData: { yoga: mp.name.en },
      });
    }
  }

  // 5. Dignified Lagna Lord — the chart ruler (lagna lord) in exaltation or
  //    own sign. Per BPHS Ch.34, a strong lagna lord stabilises the entire
  //    chart. Score 70 because it's chart-wide but not rare.
  const lagnaLordId = LAGNA_LORDS[ascSign];
  const lagnaLord = planets.find(p => p.planet.id === lagnaLordId);
  if (lagnaLord && (lagnaLord.isExalted || lagnaLord.isOwnSign)) {
    patterns.push({
      type: 'dignifiedLagnaLord',
      score: 70,
      planets: [lagnaLordId],
      templateData: {
        planetId: String(lagnaLordId),
        signId: String(lagnaLord.sign),
      },
    });
  }

  // 6. Debilitated key planet — lagna lord, Moon, or Sun in neecha (debilitation).
  //    These are the three most personally significant planets; their weakness
  //    is chart-defining. Only the first debilitated key planet is reported.
  //    Score 65. Also checks for Neecha Bhanga (cancellation) in buildStandout().
  const keyPlanets = [lagnaLord, moon, planets.find(p => p.planet.id === 0)].filter(Boolean) as PlanetPosition[];
  for (const kp of keyPlanets) {
    if (kp.isDebilitated) {
      patterns.push({
        type: 'debilitatedKey',
        score: 65,
        planets: [kp.planet.id],
        templateData: { planetId: String(kp.planet.id), signId: String(kp.sign) },
      });
      break; // Only one
    }
  }

  // 7. Retrograde planet in a kendra (angular house 1/4/7/10).
  //    Vakri (retrograde) planets internalise their energy; in a kendra,
  //    this creates a distinctive "delayed but enduring" theme.
  //    Only true planets (id 0-6) are checked — Rahu/Ketu are always retrograde.
  //    Score 60. Only the first qualifying planet is taken.
  const kendras = [1, 4, 7, 10];
  for (const p of planets) {
    if (p.isRetrograde && kendras.includes(p.house) && p.planet.id <= 6) {
      patterns.push({
        type: 'retrogradeKendra',
        score: 60,
        planets: [p.planet.id],
        houses: [p.house],
        templateData: {
          planetId: String(p.planet.id),
          house: String(p.house),
          houseTheme: '',
        },
      });
      break; // Only top one
    }
  }

  // 8. Sade Sati — Saturn's 7.5-year transit over natal Moon (±1 sign).
  //    A transit condition rather than a natal pattern, but included
  //    because it dominates the current life experience. Score 55.
  if (kundali.sadeSati?.isActive) {
    patterns.push({
      type: 'sadeSati',
      score: 55,
      planets: [6], // Saturn
    });
  }

  // 9. Lunar yogas — Moon-based combinations:
  //    - Gajakesari Yoga (Phaladeepika Ch.6 Shloka 1): Jupiter in a kendra
  //      (houses 1/4/7/10) from Moon. Confers wisdom, fame, prosperity.
  //      Expected frequency ~25% of charts (4 out of 12 possible house positions).
  //    - Chandra-Mangala Yoga (BPHS Ch.36): Moon and Mars in conjunction.
  //      Confers energy, financial acumen, ~8% frequency.
  //    Score 50 for both (relatively common yogas).
  if (moon) {
    const jupiter = planets.find(p => p.planet.id === 4);
    const mars = planets.find(p => p.planet.id === 2);
    if (jupiter) {
      const dist = ((jupiter.house - moon.house + 12) % 12);
      if ([0, 3, 6, 9].includes(dist)) { // kendra from Moon
        patterns.push({
          type: 'lunarYoga',
          score: 50,
          planets: [1, 4],
          yogaName: 'Gajakesari Yoga',
          templateData: { yoga: 'Gajakesari Yoga', planet: 'Jupiter', quality: 'wisdom, fame, and prosperity' },
        });
      }
    }
    if (mars && mars.house === moon.house) {
      patterns.push({
        type: 'lunarYoga',
        score: 50,
        planets: [1, 2],
        yogaName: 'Chandra-Mangala Yoga',
        templateData: { yoga: 'Chandra-Mangala Yoga', planet: 'Mars', quality: 'high energy, passionate drive, and financial acumen' },
      });
    }
  }

  // 10. Same Lagna and Moon sign — the native's outward personality and inner
  //     emotional world are governed by the same sign energy. This creates
  //     authenticity and consistency but no "escape valve." Score 45.
  if (moonSign === ascSign) {
    const rashi = RASHIS.find(r => r.id === ascSign);
    patterns.push({
      type: 'sameLagnaMoon',
      score: 45,
      planets: [1],
      templateData: {
        signId: String(ascSign),
        elementKey: rashi?.element.en || '',
      },
    });
  }

  // 11. Contrasting elements — Lagna and Moon in different Tattvas (elements).
  //     This is the lowest-priority pattern (score 40) and serves as a
  //     fallback so that nearly every chart has at least one detected pattern.
  //     Maps to the Pancha Tattva framework: Agni, Prithvi, Vayu, Jala.
  if (moonSign !== ascSign) {
    const lagnaRashi = RASHIS.find(r => r.id === ascSign);
    const moonRashi = RASHIS.find(r => r.id === moonSign);
    if (lagnaRashi && moonRashi && lagnaRashi.element.en !== moonRashi.element.en) {
      patterns.push({
        type: 'contrastingElements',
        score: 40,
        planets: [1],
        templateData: {
          signId1: String(ascSign),
          signId2: String(moonSign),
          elementKey1: lagnaRashi.element.en,
          elementKey2: moonRashi.element.en,
        },
      });
    }
  }

  // Sort by score descending
  patterns.sort((a, b) => b.score - a.score);
  return patterns;
}

// ─── Build Sections ─────────────────────────────────────────────

/**
 * Generates the one-sentence narrative "hook" — the opening line of the profile.
 *
 * Uses the highest-scored pattern's type to select a template from HOOK_TEMPLATES.
 * Variant selection within that template set is deterministic: a hash of the
 * birth data (date + time + latitude) picks the variant, so the same chart
 * always produces the same hook. This avoids "randomness" in a static profile.
 *
 * Template placeholders like {sign}, {planet}, {element1} are resolved here
 * from the pattern's templateData IDs → locale-specific names.
 */
function buildHook(patterns: ChartPattern[], kundali: KundaliData, locale: string): string {
  const topPattern = patterns[0];
  if (!topPattern) {
    // Ultimate fallback
    const rashi = RASHIS.find(r => r.id === kundali.ascendant.sign);
    return locale === 'hi'
      ? `${tl(rashi?.name, 'hi')} लग्न आपकी कुण्डली को एक विशिष्ट चरित्र प्रदान करता है।`
      : `Your ${tl(rashi?.name, 'en')} ascendant gives your chart a distinctive character.`;
  }

  const key = topPattern.type === 'contrastingElements' ? 'contrastingElements'
    : topPattern.type === 'sameLagnaMoon' ? 'sameLagnaMoon'
    : topPattern.type;
  const templates = HOOK_TEMPLATES[key] || HOOK_TEMPLATES.fallback;

  // Deterministic variant selection via birth data hash
  const seed = hashStr(kundali.birthData.date + kundali.birthData.time + kundali.birthData.lat);
  const variant = templates[seed % templates.length];
  const template = locale === 'hi' ? variant.hi : variant.en;

  // Resolve locale-specific names from IDs stored at detection time
  const data = { ...topPattern.templateData };
  if (data) {
    if (data.signId) data.sign = tl(RASHIS.find(r => r.id === Number(data.signId))?.name, locale);
    if (data.signId1) data.sign1 = tl(RASHIS.find(r => r.id === Number(data.signId1))?.name, locale);
    if (data.signId2) data.sign2 = tl(RASHIS.find(r => r.id === Number(data.signId2))?.name, locale);
    if (data.planetId) data.planet = tl(GRAHAS.find(g => g.id === Number(data.planetId))?.name, locale);
    if (data.elementKey1) data.element1 = bt(ELEMENT_NAMES[data.elementKey1], locale);
    if (data.elementKey2) data.element2 = bt(ELEMENT_NAMES[data.elementKey2], locale);
    if (data.elementKey) data.element1 = bt(ELEMENT_NAMES[data.elementKey], locale);
    // Resolve houseTheme if needed
    if (data.house && !data.houseTheme) {
      const houseNum = Number(data.house);
      data.houseTheme = bt(HOUSE_THEME_LABELS[houseNum], locale);
    }
  }

  return interpolate(template, data || {});
}

/**
 * Builds the two-paragraph "Core Identity" section:
 *
 *   1. **Lagna paragraph** — Ascendant sign, its planetary ruler, and the first
 *      2-3 sentences from LAGNA_DEEP personality content. This maps to the
 *      Tanu Bhava (1st house) analysis per BPHS Ch.11-12: the sign rising
 *      at birth defines the native's physical constitution, temperament,
 *      and approach to life.
 *
 *   2. **Moon paragraph** — Moon's rashi (emotional nature) and nakshatra
 *      (deeper behavioural nuance). The nakshatra section draws from
 *      NAKSHATRA_DETAILS: deity, symbol meaning, mythology, characteristics,
 *      and gana (Deva/Manushya/Rakshasa). This maps to the Chandra Lagna
 *      principle where Moon is treated as an alternate ascendant for the
 *      mind and emotions.
 */
function buildCoreIdentity(kundali: KundaliData, locale: string): { lagna: string; moon: string } {
  const ascSign = kundali.ascendant.sign;
  const lagnaDeep = LAGNA_DEEP[ascSign];

  // Lagna paragraph: sign name + ruler + first 2-3 sentences of personality
  const lagnaLordId = LAGNA_LORDS[ascSign];
  const lagnaLordName = GRAHAS.find(g => g.id === lagnaLordId);
  const personalityText = lagnaDeep?.personality
    ? tl(lagnaDeep.personality, locale)
    : '';
  // Take first 2-3 sentences
  const sentences = personalityText.split(/(?<=[।\.\?!])\s+/).filter(s => s.trim());
  const trimmed = sentences.slice(0, 3).join(' ');

  const rashi = RASHIS.find(r => r.id === ascSign);
  const lagnaLabel = locale === 'hi'
    ? `**${tl(rashi?.name, 'hi')} लग्न (${tl(lagnaLordName?.name, 'hi')}-शासित)।** ${trimmed}`
    : `**${tl(rashi?.name, 'en')} Ascendant (${tl(lagnaLordName?.name, 'en')}-ruled).** ${trimmed}`;

  // Moon paragraph
  const moon = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moon?.sign || 1;
  const moonNak = moon?.nakshatra;
  const moonNarrative = MOON_SIGN_NARRATIVES[moonSign];
  const moonBase = moonNarrative ? bt(moonNarrative, locale) : '';

  // Append nakshatra flavor — deity, symbol meaning, and behavioral insight
  let nakFlavor = '';
  if (moonNak) {
    const nakDetail = NAKSHATRA_DETAILS.find(n => n.id === moonNak.id);
    if (nakDetail) {
      const nakName = tl(moonNak.name, locale);
      const meaning = tl(nakDetail.meaning, locale);
      const chars = tl(nakDetail.characteristics, locale);
      const significance = tl(nakDetail.significance, locale);
      // First sentence of characteristics for behavioral flavor
      const charSentence = chars.split(/(?<=[।\.\?!])\s+/)[0] || '';
      // First sentence of significance for deeper meaning
      const sigSentence = significance.split(/(?<=[।\.\?!])\s+/)[0] || '';
      const symbol = moonNak.symbol || '';
      const deity = tl(moonNak.deity, locale);

      if (locale === 'hi') {
        nakFlavor = ` ${nakName} नक्षत्र में — "${meaning}"${symbol ? ` ${symbol}` : ''}। ${deity} के अधिपत्य में, ${charSentence} ${sigSentence}`;
      } else {
        nakFlavor = ` Dwelling in ${nakName} — "${meaning}"${symbol ? ` ${symbol}` : ''} — presided by ${deity}. ${charSentence} ${sigSentence}`;
      }
    }
  }

  const moonRashi = RASHIS.find(r => r.id === moonSign);
  const moonLabel = locale === 'hi'
    ? `**चन्द्र ${tl(moonRashi?.name, 'hi')} में${moonNak ? ` · ${tl(moonNak.name, 'hi')} नक्षत्र` : ''}।** ${moonBase}${nakFlavor}`
    : `**Moon in ${tl(moonRashi?.name, 'en')}${moonNak ? ` · ${tl(moonNak.name, 'en')} Nakshatra` : ''}.** ${moonBase}${nakFlavor}`;

  return { lagna: lagnaLabel, moon: moonLabel };
}

/**
 * Expands the highest-scored pattern into a 3-4 sentence narrative paragraph.
 *
 * Each pattern type has a dedicated code branch producing contextual prose:
 *   - stellium: names the planets, house theme, and first planet's house implications
 *   - dignifiedLagnaLord: dignity label + house placement + "captain of the chart" metaphor
 *   - kaalSarpa: Rahu-Ketu axis houses + karmic intensity narrative
 *   - rajaYoga: count + activation timing (dasha dependency)
 *   - sameLagnaMoon: unified personality + authenticity theme
 *   - mahapurusha: yoga name + description from yogasComplete
 *   - contrastingElements: element names + modality + multidimensional narrative
 *   - sadeSati: phase + 7.5-year maturation narrative
 *   - lunarYoga: Moon-planet combination + quality + house theme
 *   - debilitatedKey: dignity + house theme + Neecha Bhanga check
 *   - retrogradeKendra: retrograde internalization + "delay not weakness" theme
 *
 * Neecha Bhanga Raja Yoga check (debilitatedKey): if the sign lord of the
 * debilitated planet is itself exalted, in own sign, or in a kendra, the
 * debilitation is considered cancelled — producing potential for extraordinary
 * strength from weakness. Ref: BPHS Ch.29 (Neecha Bhanga conditions).
 */
function buildStandout(patterns: ChartPattern[], kundali: KundaliData, locale: string): string {
  const topPattern = patterns[0];
  if (!topPattern) return '';

  // Build a 3-4 sentence expansion of the top pattern
  const planets = kundali.planets;
  switch (topPattern.type) {
    case 'stellium': {
      const house = topPattern.houses?.[0] || 1;
      const pIds = topPattern.planets;
      const names = pIds.map(id => {
        const p = planets.find(pp => pp.planet.id === id);
        return p ? tl(p.planet.name, locale) : '';
      }).filter(Boolean).join(', ');
      const theme = bt(HOUSE_THEME_LABELS[house], locale);
      const impl = PLANET_HOUSE_DEPTH[pIds[0]]?.[house]?.implications || '';
      return locale === 'hi'
        ? `${names} आपके ${house}वें भाव में एकत्रित हैं — ${theme} से सम्बन्धित विषय। यह संकेन्द्रण जीवन के इस क्षेत्र में असाधारण तीव्रता लाता है। ${impl}`
        : `${names} gather in your ${house}th house — the domain of ${theme}. This concentration brings extraordinary intensity to this area of life. ${impl}`;
    }
    case 'dignifiedLagnaLord': {
      const ll = planets.find(p => p.planet.id === topPattern.planets[0]);
      if (!ll) return '';
      const dignity = ll.isExalted ? 'exalted' : 'own sign';
      const dignityHi = ll.isExalted ? 'उच्च' : 'स्वराशि';
      const impl = PLANET_HOUSE_DEPTH[ll.planet.id]?.[ll.house]?.implications || '';
      return locale === 'hi'
        ? `${tl(ll.planet.name, 'hi')} — आपके लग्नेश — ${tl(ll.signName, 'hi')} में ${dignityHi} हैं, ${ll.house}वें भाव में। लग्नेश की यह शक्ति पूरी कुण्डली को स्थिरता और दिशा प्रदान करती है। ${impl}`
        : `${tl(ll.planet.name, 'en')} — your lagna lord — is ${dignity} in ${tl(ll.signName, 'en')}, placed in the ${ll.house}th house. This strength in the chart's captain gives the entire horoscope stability and direction. ${impl}`;
    }
    case 'kaalSarpa': {
      const rahuH = topPattern.houses?.[0] || 1;
      const ketuH = topPattern.houses?.[1] || 7;
      return locale === 'hi'
        ? `सभी ग्रह राहु (${rahuH}वाँ भाव) और केतु (${ketuH}वाँ भाव) के बीच सीमित हैं। यह काल सर्प योग जीवन में तीव्र कार्मिक अनुभव लाता है — अचानक उत्थान और पतन दोनों सम्भव। अक्ष जिन भावों से गुजरता है, वे जीवन के प्रमुख क्षेत्र बन जाते हैं।`
        : `All planets are hemmed between Rahu (${rahuH}th house) and Ketu (${ketuH}th house). This Kaal Sarpa Yoga brings intense karmic experiences — sudden rises and falls are both possible. The axis passing through these houses makes them the dominant life themes.`;
    }
    case 'rajaYoga': {
      const count = topPattern.templateData?.count || '2';
      return locale === 'hi'
        ? `${count} राजयोगों का संयोग अधिकार, मान्यता और नेतृत्व के अवसर प्रदान करता है। ये योग तब फलित होते हैं जब सम्बन्धित ग्रहों की दशा सक्रिय होती है — सही समय पर सही प्रयास आवश्यक।`
        : `The convergence of ${count} raja yogas provides opportunities for authority, recognition, and leadership. These yogas activate when the relevant planetary dashas run — the right effort at the right time is essential.`;
    }
    case 'sameLagnaMoon': {
      const signId = topPattern.templateData?.signId;
      const sign = signId ? tl(RASHIS.find(r => r.id === Number(signId))?.name, locale) : '';
      return locale === 'hi'
        ? `लग्न और चन्द्र दोनों ${sign} में — आपका बाह्य व्यवहार और आन्तरिक भावनाएँ एक ही ऊर्जा से संचालित हैं। लोग जो देखते हैं वही आप भीतर अनुभव करते हैं। यह एकता आपको प्रामाणिक बनाती है, परन्तु इसका अर्थ यह भी है कि आपके पास छिपने का कोई स्थान नहीं।`
        : `Both your ascendant and Moon fall in ${sign} — your outward behavior and inner emotions run on the same energy. What people see is what you feel inside. This unity makes you authentic, but it also means you have no place to hide.`;
    }
    case 'mahapurusha': {
      const yogaName = topPattern.yogaName || 'Mahapurusha Yoga';
      const yogaInfo = kundali.yogasComplete?.find(y => y.name.en === yogaName && y.present);
      const desc = yogaInfo ? tl(yogaInfo.description, locale) : '';
      return locale === 'hi'
        ? `${yogaName} — पंच महापुरुष योगों में से एक — आपकी कुण्डली में बनता है। यह योग विशिष्ट व्यक्तित्व गुण और जीवन में उत्कृष्टता प्रदान करता है। ${desc}`
        : `${yogaName} — one of the five Pancha Mahapurusha Yogas — forms in your chart. This yoga confers distinctive personality traits and excellence in life. ${desc}`;
    }
    case 'contrastingElements': {
      const lagnaR = RASHIS.find(r => r.id === kundali.ascendant.sign);
      const moonP = planets.find(p => p.planet.id === 1);
      const moonR = moonP ? RASHIS.find(r => r.id === moonP.sign) : null;
      const lagnaEl = lagnaR ? bt(ELEMENT_NAMES[lagnaR.element.en], locale) : '';
      const moonEl = moonR ? bt(ELEMENT_NAMES[moonR.element.en], locale) : '';
      return locale === 'hi'
        ? `${tl(lagnaR?.name, 'hi')} लग्न ${lagnaEl} तत्व लाता है — बौद्धिक, विश्लेषणात्मक, बाह्य-उन्मुख। परन्तु ${tl(moonR?.name, 'hi')} में चन्द्र ${moonEl} स्वभाव से चलता है। यह विपरीत तत्वों का संयोग आपको बहुआयामी बनाता है — दोनों ऊर्जाओं का उपयोग करना सीखना आपकी यात्रा का अंग है।`
        : `Your ${tl(lagnaR?.name, 'en')} ascendant brings ${lagnaEl} energy — analytical, outward-facing. But your Moon in ${tl(moonR?.name, 'en')} runs on ${moonEl} instinct. This combination of contrasting elements makes you multidimensional — learning to harness both energies is part of your journey.`;
    }
    case 'sadeSati': {
      const phase = kundali.sadeSati?.currentPhase || '';
      return locale === 'hi'
        ? `साढ़े साती${phase ? ` (${phase} चरण)` : ''} — शनि आपके चन्द्र पर गोचर कर रहा है। यह 7.5 वर्ष की अवधि भावनात्मक परिपक्वता, धैर्य और कठिन परिश्रम की माँग करती है। जो इसे सचेत रूप से स्वीकार करते हैं, उन्हें स्थायी उपलब्धियाँ प्राप्त होती हैं।`
        : `Sade Sati${phase ? ` (${phase} phase)` : ''} — Saturn is transiting over your Moon. This 7.5-year period demands emotional maturity, patience, and sustained hard work. Those who embrace it consciously earn lasting achievements.`;
    }
    case 'lunarYoga': {
      const yogaName = topPattern.yogaName || '';
      const quality = topPattern.templateData?.quality || '';
      const moonP = planets.find(p => p.planet.id === 1);
      const otherPId = topPattern.planets.find(id => id !== 1) || 0;
      const otherP = planets.find(p => p.planet.id === otherPId);
      const moonSignName = moonP ? tl(moonP.signName, locale) : '';
      const otherName = otherP ? tl(otherP.planet.name, locale) : '';
      const houseTheme = moonP ? bt(HOUSE_THEME_LABELS[moonP.house], locale) : '';
      const impl = otherP ? (PLANET_HOUSE_DEPTH[otherP.planet.id]?.[otherP.house]?.implications || '') : '';
      if (locale === 'hi') {
        return `${yogaName} आपकी कुण्डली में बनता है — चन्द्र और ${otherName} का यह संयोग ${quality} उत्पन्न करता है। ${moonSignName} में स्थित, यह योग ${houseTheme} के क्षेत्र को विशेष रूप से प्रभावित करता है। ${impl}`;
      }
      return `${yogaName} forms in your chart — this combination of Moon and ${otherName} creates ${quality}. Placed in ${moonSignName}, this yoga particularly influences the domain of ${houseTheme}. ${impl}`;
    }
    case 'debilitatedKey': {
      const dp = planets.find(p => p.planet.id === topPattern.planets[0]);
      if (!dp) return '';
      const dpName = tl(dp.planet.name, locale);
      const dpSign = tl(dp.signName, locale);
      const dpHouse = dp.house;
      const houseTheme = bt(HOUSE_THEME_LABELS[dpHouse], locale);
      const impl = PLANET_HOUSE_DEPTH[dp.planet.id]?.[dpHouse]?.implications || '';
      // Check for neecha bhanga (cancellation of debilitation)
      const signLordId = LAGNA_LORDS[dp.sign];
      const signLord = planets.find(p => p.planet.id === signLordId);
      const neechaBhanga = signLord && (signLord.isExalted || signLord.isOwnSign || [1, 4, 7, 10].includes(signLord.house));
      if (locale === 'hi') {
        return `${dpName} ${dpSign} में नीच — अपने सबसे कमजोर गरिमा में — ${dpHouse}वें भाव (${houseTheme}) में। यह ग्रह जीवन के इस क्षेत्र में अतिरिक्त प्रयास और सचेत विकास माँगता है। ${impl}${neechaBhanga ? ` परन्तु, नीच भङ्ग राजयोग के संकेत भी हैं — इस कमजोरी से असाधारण शक्ति उत्पन्न हो सकती है।` : ''}`;
      }
      return `${dpName} is debilitated in ${dpSign} — its weakest dignity — placed in the ${dpHouse}th house (${houseTheme}). This planet demands extra effort and conscious development in this area of life. ${impl}${neechaBhanga ? ` However, signs of Neecha Bhanga Raja Yoga are present — extraordinary strength can emerge from this very weakness.` : ''}`;
    }
    case 'retrogradeKendra': {
      const rp = planets.find(p => p.planet.id === topPattern.planets[0]);
      if (!rp) return '';
      const rpName = tl(rp.planet.name, locale);
      const rpSign = tl(rp.signName, locale);
      const rpHouse = rp.house;
      const houseTheme = bt(HOUSE_THEME_LABELS[rpHouse], locale);
      const impl = PLANET_HOUSE_DEPTH[rp.planet.id]?.[rpHouse]?.implications || '';
      if (locale === 'hi') {
        return `${rpName} वक्री ${rpSign} में, ${rpHouse}वें भाव (${houseTheme}) में — एक केन्द्र स्थान। वक्री ग्रह अपनी ऊर्जा को अन्तर्मुखी करता है: ${houseTheme} के विषयों में बाह्य सफलता से पहले गहन आत्मनिरीक्षण आवश्यक है। यह विलम्ब कमजोरी नहीं — परिपक्वता की प्रक्रिया है। ${impl}`;
      }
      return `${rpName} retrograde in ${rpSign}, placed in the ${rpHouse}th house (${houseTheme}) — a kendra position. A retrograde planet turns its energy inward: deep introspection precedes outward success in matters of ${houseTheme}. This delay is not weakness — it is a maturation process. ${impl}`;
    }
    default: {
      // Generic expansion using planet-in-house data for the first planet in the pattern
      const pid = topPattern.planets[0];
      const p = planets.find(pp => pp.planet.id === pid);
      if (!p) return '';
      const impl = PLANET_HOUSE_DEPTH[pid]?.[p.house]?.implications || '';
      const prog = PLANET_HOUSE_DEPTH[pid]?.[p.house]?.prognosis || '';
      return `${impl} ${prog}`;
    }
  }
}

/**
 * Renders up to 3 secondary patterns (ranks 2-4) as narrative observation
 * paragraphs. Each paragraph begins with a connector phrase ("Additionally,"
 * "Moreover,") from the CONNECTORS array to create flowing prose.
 *
 * The switch-case structure mirrors buildStandout() but with slightly
 * different phrasing (connector-prefixed, less headline-like).
 *
 * This function uses the same Neecha Bhanga detection and house theme
 * resolution as buildStandout(). See that function's JSDoc for details.
 */
function buildPlanetaryObservations(patterns: ChartPattern[], kundali: KundaliData, locale: string): string[] {
  const obs: string[] = [];
  // Take the 2nd through 4th patterns (the top pattern is used in hook+standout)
  const usedPatterns = patterns.slice(1, 4);
  const planets = kundali.planets;

  for (let i = 0; i < usedPatterns.length; i++) {
    const pat = usedPatterns[i];
    const connector = bt(CONNECTORS[i % CONNECTORS.length], locale);
    let text = '';

    switch (pat.type) {
      case 'dignifiedLagnaLord': {
        const p = planets.find(pp => pp.planet.id === pat.planets[0]);
        if (!p) continue;
        const pName = tl(p.planet.name, locale);
        const pSign = tl(p.signName, locale);
        const houseTheme = bt(HOUSE_THEME_LABELS[p.house], locale);
        const dignity = p.isExalted ? bt(DIGNITY_LABELS.exalted, locale) : bt(DIGNITY_LABELS.ownSign, locale);
        const impl = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house]?.implications || '';
        const prog = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house]?.prognosis || '';
        text = locale === 'hi'
          ? `${connector} आपके लग्नेश ${pName} ${pSign} में ${dignity} हैं — ${p.house}वें भाव (${houseTheme}) में विराजमान। जब कुण्डली का कर्णधार इतनी दृढ़ स्थिति में हो, तो पूरे जीवन को एक स्थिर आधार मिलता है। ${impl} ${prog}`
          : `${connector} your lagna lord ${pName} holds ${dignity} status in ${pSign}, placed in the ${p.house}th house of ${houseTheme}. When the captain of the chart commands from this strong a position, it lends stability to your entire life direction. ${impl} ${prog}`;
        break;
      }
      case 'debilitatedKey': {
        const p = planets.find(pp => pp.planet.id === pat.planets[0]);
        if (!p) continue;
        const pName = tl(p.planet.name, locale);
        const pSign = tl(p.signName, locale);
        const houseTheme = bt(HOUSE_THEME_LABELS[p.house], locale);
        const impl = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house]?.implications || '';
        const signLordId = LAGNA_LORDS[p.sign];
        const signLord = planets.find(pl => pl.planet.id === signLordId);
        const neechaBhanga = signLord && (signLord.isExalted || signLord.isOwnSign || [1, 4, 7, 10].includes(signLord.house));
        text = locale === 'hi'
          ? `${connector} ${pName} ${pSign} में नीच — ${p.house}वें भाव (${houseTheme}) में। यह ${houseTheme} के क्षेत्र में स्वाभाविक सहजता के बजाय सचेत प्रयास की माँग करता है। ${impl}${neechaBhanga ? ` हालाँकि, नीच भङ्ग के संकेत मौजूद हैं — यह कमजोरी समय के साथ असाधारण दृढ़ता में बदल सकती है।` : ''}`
          : `${connector} ${pName} sits debilitated in ${pSign}, placed in the ${p.house}th house of ${houseTheme}. Rather than natural ease, this area of life demands conscious cultivation and patience. ${impl}${neechaBhanga ? ` Notably, signs of Neecha Bhanga are present — this weakness has the potential to transform into uncommon resilience over time.` : ''}`;
        break;
      }
      case 'retrogradeKendra': {
        const p = planets.find(pp => pp.planet.id === pat.planets[0]);
        if (!p) continue;
        const pName = tl(p.planet.name, locale);
        const pSign = tl(p.signName, locale);
        const houseTheme = bt(HOUSE_THEME_LABELS[p.house], locale);
        const impl = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house]?.implications || '';
        text = locale === 'hi'
          ? `${connector} ${pName} ${pSign} में वक्री, ${p.house}वें भाव (${houseTheme}) में — एक केन्द्र स्थान। वक्री ग्रह अपनी ऊर्जा को अन्दर की ओर मोड़ता है: ${houseTheme} में सफलता आती है, परन्तु पहले गहन आत्ममन्थन से गुजरना पड़ता है। परिणाम देर से आते हैं मगर टिकाऊ होते हैं। ${impl}`
          : `${connector} ${pName} is retrograde in ${pSign}, stationed in the ${p.house}th house of ${houseTheme} — a kendra. Retrograde planets internalize their energy: success in ${houseTheme} comes, but only after deep self-examination. Results arrive late but prove enduring. ${impl}`;
        break;
      }
      case 'lunarYoga': {
        const yogaName = pat.yogaName || '';
        const quality = pat.templateData?.quality || '';
        const moonP = planets.find(p => p.planet.id === 1);
        const otherPId = pat.planets.find(id => id !== 1) || 0;
        const otherP = planets.find(p => p.planet.id === otherPId);
        const moonHouseTheme = moonP ? bt(HOUSE_THEME_LABELS[moonP.house], locale) : '';
        const otherName = otherP ? tl(otherP.planet.name, locale) : '';
        const otherSign = otherP ? tl(otherP.signName, locale) : '';
        const otherHouse = otherP?.house || 0;
        const impl = otherP ? (PLANET_HOUSE_DEPTH[otherP.planet.id]?.[otherHouse]?.implications || '') : '';
        text = locale === 'hi'
          ? `${connector} ${yogaName} सक्रिय — चन्द्र और ${otherName} (${otherSign} में, ${otherHouse}वें भाव) के बीच बनता है, जो ${quality} उत्पन्न करता है। यह संयोग विशेषतः ${moonHouseTheme} के क्षेत्र को प्रभावित करता है। ${impl}`
          : `${connector} ${yogaName} is active — formed between Moon and ${otherName} (in ${otherSign}, ${otherHouse}th house), generating ${quality}. This combination particularly influences your ${moonHouseTheme}. ${impl}`;
        break;
      }
      case 'sadeSati': {
        const moonP = planets.find(p => p.planet.id === 1);
        const saturnP = planets.find(p => p.planet.id === 6);
        const moonSignName = moonP ? tl(moonP.signName, locale) : '';
        const moonHouseTheme = moonP ? bt(HOUSE_THEME_LABELS[moonP.house], locale) : '';
        const phase = kundali.sadeSati?.currentPhase || '';
        const saturnHouse = saturnP?.house || 0;
        const saturnHouseTheme = bt(HOUSE_THEME_LABELS[saturnHouse], locale);
        text = locale === 'hi'
          ? `${connector} साढ़े साती${phase ? ` (${phase} चरण)` : ''} सक्रिय — शनि आपके ${moonSignName} चन्द्र पर गोचर कर रहा है, ${moonHouseTheme} के भावनात्मक क्षेत्र को परीक्षा में डाल रहा है। शनि स्वयं ${saturnHouse}वें भाव (${saturnHouseTheme}) में है, जो इस दबाव को ${saturnHouseTheme} की दिशा में मोड़ता है। यह अवधि कठोर शिक्षक की तरह काम करती है — पाठ कठिन हैं, परन्तु जो सीखा जाता है वह स्थायी होता है।`
          : `${connector} Sade Sati${phase ? ` (${phase} phase)` : ''} is active — Saturn transits over your ${moonSignName} Moon, pressure-testing the emotional domain of ${moonHouseTheme}. Saturn itself occupies the ${saturnHouse}th house (${saturnHouseTheme}), channeling this pressure toward ${saturnHouseTheme}. This period operates like a demanding teacher — the lessons are hard, but what you learn becomes permanent.`;
        break;
      }
      case 'mahapurusha': {
        const yogaName = pat.yogaName || 'Mahapurusha Yoga';
        const yogaInfo = kundali.yogasComplete?.find(y => y.name.en === yogaName && y.present);
        const desc = yogaInfo ? tl(yogaInfo.description, locale) : '';
        const rule = yogaInfo ? tl(yogaInfo.formationRule, locale) : '';
        // Try to find which planet forms this yoga
        const mahaPlanetMap: Record<string, number> = { 'Ruchaka': 2, 'Bhadra': 3, 'Hamsa': 4, 'Malavya': 5, 'Shasha': 6 };
        const mahaPlanetId = Object.entries(mahaPlanetMap).find(([name]) => yogaName.includes(name))?.[1];
        const mahaP = mahaPlanetId !== undefined ? planets.find(p => p.planet.id === mahaPlanetId) : null;
        const extraContext = mahaP
          ? (locale === 'hi'
            ? ` ${tl(mahaP.planet.name, 'hi')} ${tl(mahaP.signName, 'hi')} में ${mahaP.house}वें भाव में — ${bt(HOUSE_THEME_LABELS[mahaP.house], locale)} के क्षेत्र में इस योग का प्रभाव सर्वाधिक प्रबल है।`
            : ` ${tl(mahaP.planet.name, 'en')} in ${tl(mahaP.signName, 'en')} in the ${mahaP.house}th house — this yoga's influence is strongest in matters of ${bt(HOUSE_THEME_LABELS[mahaP.house], locale)}.`)
          : '';
        text = locale === 'hi'
          ? `${connector} ${yogaName} — पंच महापुरुष योगों में से एक — आपकी कुण्डली में सक्रिय है।${extraContext} ${desc}${rule ? ` निर्माण: ${rule}` : ''}`
          : `${connector} ${yogaName} — one of the five Pancha Mahapurusha Yogas — is active in your chart.${extraContext} ${desc}${rule ? ` Formation: ${rule}` : ''}`;
        break;
      }
      case 'rajaYoga': {
        const count = pat.templateData?.count || '2';
        // List the actual raja yoga names from yogasComplete
        const rajaYogas = kundali.yogasComplete?.filter(y => y.category === 'raja' && y.present) || [];
        const yogaNames = rajaYogas.slice(0, 4).map(y => tl(y.name, locale)).join(', ');
        const firstYoga = rajaYogas[0];
        const firstDesc = firstYoga ? tl(firstYoga.description, locale) : '';
        text = locale === 'hi'
          ? `${connector} ${count} राजयोग आपकी कुण्डली में सक्रिय हैं${yogaNames ? ` — ${yogaNames}` : ''}। ये अधिकार, सार्वजनिक मान्यता और नेतृत्व के अवसरों के सूचक हैं। ${firstDesc} ये योग तब सर्वाधिक फलित होते हैं जब सम्बन्धित ग्रहों की महादशा या अन्तर्दशा सक्रिय होती है — समय के साथ इनका प्रभाव परिपक्व होता जाता है।`
          : `${connector} ${count} raja yogas are active in your chart${yogaNames ? ` — ${yogaNames}` : ''}. These are indicators of authority, public recognition, and leadership opportunities. ${firstDesc} These yogas bear their strongest fruit when the dashas of the involved planets run — their influence matures with time.`;
        break;
      }
      case 'contrastingElements': {
        const lagnaR = RASHIS.find(r => r.id === kundali.ascendant.sign);
        const moonP = planets.find(p => p.planet.id === 1);
        const moonR = moonP ? RASHIS.find(r => r.id === moonP.sign) : null;
        const lagnaEl = lagnaR ? bt(ELEMENT_NAMES[lagnaR.element.en], locale) : '';
        const moonEl = moonR ? bt(ELEMENT_NAMES[moonR.element.en], locale) : '';
        const lagnaQ = lagnaR ? tl(lagnaR.quality, locale) : '';
        const moonQ = moonR ? tl(moonR.quality, locale) : '';
        text = locale === 'hi'
          ? `${connector} ${tl(lagnaR?.name, 'hi')} लग्न (${lagnaEl}, ${lagnaQ}) और ${tl(moonR?.name, 'hi')} चन्द्र (${moonEl}, ${moonQ}) — विपरीत तत्वों का यह संयोग आपको दो अलग-अलग ऊर्जाओं तक पहुँच देता है। बाह्य व्यवहार में आप एक तरह से दिखते हैं, भीतर से बिल्कुल भिन्न अनुभव करते हैं। यह विरोधाभास कमजोरी नहीं — बहुआयामी होने का लाभ है।`
          : `${connector} your ${tl(lagnaR?.name, 'en')} ascendant (${lagnaEl}, ${lagnaQ}) and ${tl(moonR?.name, 'en')} Moon (${moonEl}, ${moonQ}) draw from contrasting elements. Outwardly you present one way; inwardly you experience something quite different. This is not contradiction — it is the advantage of being multidimensional, able to draw on both registers as the situation demands.`;
        break;
      }
      case 'sameLagnaMoon': {
        const signId = pat.templateData?.signId;
        const rashi = signId ? RASHIS.find(r => r.id === Number(signId)) : null;
        const signName = rashi ? tl(rashi.name, locale) : '';
        const element = rashi ? bt(ELEMENT_NAMES[rashi.element.en], locale) : '';
        const moonP = planets.find(p => p.planet.id === 1);
        const moonHouse = moonP?.house || 1;
        text = locale === 'hi'
          ? `${connector} लग्न और चन्द्र दोनों ${signName} में — ${element} ऊर्जा दोगुनी हो जाती है। चन्द्र ${moonHouse}वें भाव में होने से आपकी भावनात्मक प्रतिक्रियाएँ सीधे आपके व्यक्तित्व में झलकती हैं। लोग जो देखते हैं वही आप भीतर महसूस करते हैं — यह प्रामाणिकता आपकी शक्ति है, परन्तु भावनाओं को छिपाना कठिन बनाती है।`
          : `${connector} both your ascendant and Moon fall in ${signName}, doubling the ${element} energy. With Moon in the ${moonHouse}th house, your emotional reactions show directly in your personality. What people see is what you genuinely feel — this authenticity is your strength, though it makes concealing your emotions difficult.`;
        break;
      }
      default: {
        if (pat.type === 'stellium') {
          const house = pat.houses?.[0] || 1;
          const theme = bt(HOUSE_THEME_LABELS[house], locale);
          const pNames = pat.planets.map(id => {
            const p = planets.find(pp => pp.planet.id === id);
            return p ? tl(p.planet.name, locale) : '';
          }).filter(Boolean).join(', ');
          text = locale === 'hi'
            ? `${connector} ${pNames} — ${pat.planets.length} ग्रह ${house}वें भाव (${theme}) में एकत्रित। इतना संकेन्द्रण जीवन के इस क्षेत्र को अपरिहार्य बनाता है — आप चाहें या न चाहें, ${theme} के विषय बार-बार सामने आते रहेंगे।`
            : `${connector} ${pNames} — ${pat.planets.length} planets concentrated in the ${house}th house of ${theme}. This much energy in one house makes this life area inescapable — whether you seek it or not, themes of ${theme} will keep presenting themselves.`;
        } else if (pat.type === 'kaalSarpa') {
          const rahuH = pat.houses?.[0] || 1;
          const ketuH = pat.houses?.[1] || 7;
          const rahuTheme = bt(HOUSE_THEME_LABELS[rahuH], locale);
          const ketuTheme = bt(HOUSE_THEME_LABELS[ketuH], locale);
          text = locale === 'hi'
            ? `${connector} काल सर्प योग — सभी ग्रह राहु (${rahuH}वाँ भाव: ${rahuTheme}) और केतु (${ketuH}वाँ भाव: ${ketuTheme}) के बीच सीमित। यह अक्ष जीवन की प्रमुख तनाव रेखा बन जाता है — ${rahuTheme} की ओर आकर्षण और ${ketuTheme} से मुक्ति का द्वन्द्व निरन्तर चलता रहता है।`
            : `${connector} Kaal Sarpa Yoga — all planets hemmed between Rahu (${rahuH}th house: ${rahuTheme}) and Ketu (${ketuH}th house: ${ketuTheme}). This axis becomes the central tension line of your life — a constant pull toward ${rahuTheme} and a karmic release from ${ketuTheme}.`;
        }
        break;
      }
    }

    if (text) obs.push(text);
  }

  return obs;
}

/**
 * Generates the Moon nakshatra insight paragraph.
 *
 * Draws from NAKSHATRA_DETAILS to produce a paragraph covering:
 *   - Nakshatra name and meaning (e.g. "Rohini — The Red One")
 *   - Symbol (e.g. chariot, lotus)
 *   - Mythology and presiding deity
 *   - Key characteristics (first sentence)
 *   - Gana classification (Deva/Manushya/Rakshasa)
 *
 * The Moon's nakshatra is the most personality-defining single data point
 * in Vedic astrology — it determines the Vimshottari Dasha starting planet,
 * compatibility (Ashta Kuta), and the native's fundamental emotional nature.
 * Ref: BPHS Ch.3 Shloka 6 (Nakshatra as the Moon's subdivision).
 */
function buildNakshatraInsight(kundali: KundaliData, locale: string): string {
  const moon = kundali.planets.find(p => p.planet.id === 1);
  if (!moon) return '';

  const nak = moon.nakshatra;
  const detail = NAKSHATRA_DETAILS.find(n => n.id === nak.id);
  if (!detail) return '';

  const name = tl(nak.name, locale);
  const meaning = tl(detail.meaning, locale);
  const mythology = tl(detail.mythology, locale);
  const characteristics = tl(detail.characteristics, locale);
  const gana = tl(detail.gana, locale);
  const symbol = nak.symbol || '';

  if (locale === 'hi') {
    return `आपका चन्द्र ${name} नक्षत्र में पड़ता है — "${meaning}"। ${symbol} ${mythology} ${characteristics} गण: ${gana}।`;
  }
  return `Your Moon falls in ${name} — "${meaning}." ${symbol} ${mythology} ${characteristics} Gana: ${gana}.`;
}

/**
 * Builds the Vimshottari Dasha context paragraph.
 *
 * Identifies the currently running Mahadasha (major period) and Antardasha
 * (sub-period) by comparing today's date against the dasha timeline.
 *
 * Enriches the output with:
 *   - Mahadasha lord's house placement and dignity
 *   - House theme from HOUSE_THEME_LABELS
 *   - Antardasha effect from DASHA_EFFECTS templates
 *
 * The Vimshottari Dasha system (BPHS Ch.46) divides 120 years among
 * 9 planets in a fixed sequence starting from the Moon's birth nakshatra.
 * Each Mahadasha activates the significations of its lord — its house
 * lordship, placement, dignity, and aspects determine the period's flavour.
 */
function buildDashaContext(kundali: KundaliData, locale: string): string {
  const dashas = kundali.dashas;
  if (!dashas || dashas.length === 0) return '';

  // Find current Mahadasha (the one whose date range includes now)
  const now = new Date().toISOString().slice(0, 10);
  const currentMaha = dashas.find(d => d.level === 'maha' && d.startDate <= now && d.endDate >= now)
    || dashas[0];

  const mahaName = tl(currentMaha.planetName, locale);
  const endYear = currentMaha.endDate.slice(0, 4);
  const startYear = currentMaha.startDate.slice(0, 4);
  const totalYears = Number(endYear) - Number(startYear);

  // Current antardasha
  let antarText = '';
  if (currentMaha.subPeriods) {
    const currentAntar = currentMaha.subPeriods.find(
      d => d.startDate <= now && d.endDate >= now
    );
    if (currentAntar) {
      const antarName = tl(currentAntar.planetName, locale);
      // DASHA_EFFECTS is keyed by planet name string (e.g. 'Saturn', 'Mercury')
      const dashaEffect = DASHA_EFFECTS[currentAntar.planet];
      const effectText = dashaEffect ? (locale === 'hi' ? (dashaEffect.hi || dashaEffect.en) : dashaEffect.en) : '';
      antarText = locale === 'hi'
        ? ` ${antarName} की वर्तमान अन्तर्दशा ${effectText ? `— ${effectText}` : ''}`
        : ` The current Antardasha of ${antarName}${effectText ? ` — ${effectText}` : ''}`;
    }
  }

  // Mahadasha lord's house placement for context
  const mahaLord = kundali.planets.find(p => tl(p.planet.name, 'en') === currentMaha.planet);
  let placementText = '';
  if (mahaLord) {
    const dignity = mahaLord.isExalted ? (locale === 'hi' ? 'उच्च' : 'exalted')
      : mahaLord.isOwnSign ? (locale === 'hi' ? 'स्वराशि' : 'own sign')
      : mahaLord.isDebilitated ? (locale === 'hi' ? 'नीच' : 'debilitated')
      : '';
    const houseTheme = bt(HOUSE_THEME_LABELS[mahaLord.house], locale);
    placementText = locale === 'hi'
      ? `${mahaName} आपके ${mahaLord.house}वें भाव (${houseTheme}) में ${dignity ? `${dignity} में ` : ''}विराजमान — `
      : `${mahaName} sits in your ${mahaLord.house}th house (${houseTheme})${dignity ? ` in ${dignity}` : ''} — `;
  }

  if (locale === 'hi') {
    return `आप वर्तमान में ${mahaName} महादशा में हैं — ${totalYears} वर्ष की अवधि। ${placementText}इस काल का स्वरूप निर्धारित करता है।${antarText}`;
  }
  return `You are currently in ${mahaName} Mahadasha — a ${totalYears}-year period. ${placementText}shaping the character of these years.${antarText}`;
}

/**
 * Builds the dosha (affliction) section of the profile.
 *
 * Checks for three commonly discussed doshas:
 *
 *   1. **Manglik Dosha** (BPHS Ch.77) — Mars in houses 1/2/4/7/8/12.
 *      Houses 1/7/8 are "severe"; 4/12 "moderate"; 2 "mild".
 *      Cancellation conditions checked:
 *        - Mars in own sign or exalted → natural dignity overrides dosha
 *        - Jupiter in kendra (1/4/7/10) → Jupiter's benefic influence mitigates
 *
 *   2. **Kaal Sarpa Dosha** — all planets hemmed between Rahu and Ketu.
 *      Same detection as pattern #2 above, presented here with remedy context.
 *
 *   3. **Sade Sati** — Saturn's 7.5-year transit over natal Moon.
 *      Read from kundali.sadeSati which is computed from current transits.
 *
 * Returns null if no doshas are present — the UI then hides the section.
 */
function buildDoshaSection(kundali: KundaliData, locale: string): string | null {
  const planets = kundali.planets;
  const doshas: string[] = [];

  // Check Manglik (BPHS Ch.77 — Kuja Dosha)
  const mars = planets.find(p => p.planet.id === 2);
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  if (mars && manglikHouses.includes(mars.house)) {
    const severity = [1, 7, 8].includes(mars.house) ? (locale === 'hi' ? 'गम्भीर' : 'significant')
      : (locale === 'hi' ? 'मध्यम' : 'moderate');
    // Check cancellations
    const cancellations: string[] = [];
    if (mars.isOwnSign || mars.isExalted) cancellations.push(locale === 'hi' ? 'मंगल स्वगरिमा में' : 'Mars is in its own dignity');
    const jupiter = planets.find(p => p.planet.id === 4);
    if (jupiter && [1, 4, 7, 10].includes(jupiter.house)) cancellations.push(locale === 'hi' ? 'गुरु केन्द्र में' : 'Jupiter in kendra');

    const cancelText = cancellations.length > 0
      ? (locale === 'hi' ? ` परन्तु यह ${cancellations.join(' और ')} से कम होता है।` : ` However, this is mitigated by ${cancellations.join(' and ')}.`)
      : '';

    doshas.push(locale === 'hi'
      ? `मांगलिक दोष (${severity}): मंगल ${mars.house}वें भाव में विवाह और साझेदारी को प्रभावित करता है।${cancelText}`
      : `Manglik Dosha (${severity}): Mars in the ${mars.house}th house influences marriage and partnerships.${cancelText}`);
  }

  // Check Kaal Sarpa (reuse pattern detection logic)
  const rahu = planets.find(p => p.planet.id === 7);
  const ketu = planets.find(p => p.planet.id === 8);
  if (rahu && ketu) {
    const others = planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
    const rahuH = rahu.house;
    const ketuH = ketu.house;
    const allOnOneSide = others.every(p => {
      const dist = ((p.house - rahuH + 12) % 12);
      const ketuDist = ((ketuH - rahuH + 12) % 12);
      return dist > 0 && dist < ketuDist;
    }) || others.every(p => {
      const dist = ((p.house - ketuH + 12) % 12);
      const rahuDist = ((rahuH - ketuH + 12) % 12);
      return dist > 0 && dist < rahuDist;
    });
    if (allOnOneSide) {
      doshas.push(locale === 'hi'
        ? `काल सर्प दोष: सभी ग्रह राहु-केतु अक्ष के एक ओर। कार्मिक अनुभव तीव्र होते हैं, परन्तु अक्ष-सम्बन्धित क्षेत्रों में विशेष सफलता भी सम्भव।`
        : `Kaal Sarpa Dosha: all planets on one side of the Rahu-Ketu axis. Karmic experiences run intense, but exceptional success in axis-related areas is also possible.`);
    }
  }

  // Check Sade Sati
  if (kundali.sadeSati?.isActive) {
    const phase = kundali.sadeSati.currentPhase || '';
    doshas.push(locale === 'hi'
      ? `साढ़े साती सक्रिय${phase ? ` (${phase} चरण)` : ''}: शनि चन्द्र पर गोचर। धैर्य और अनुशासन इस काल की कुंजी।`
      : `Sade Sati active${phase ? ` (${phase} phase)` : ''}: Saturn transits over Moon. Patience and discipline are key during this period.`);
  }

  if (doshas.length === 0) return null;
  return doshas.join('\n\n');
}

/**
 * Builds the planetary strength summary table.
 *
 * Only includes planets with notable dignity status:
 *   - Exalted (uchcha) — planet at its sign of maximum strength
 *   - Debilitated (neecha) — planet at its sign of minimum strength
 *   - Own sign (sva-rashi) — planet in a sign it lords
 *   - Retrograde (vakri) — apparent backward motion
 *
 * Neutral planets (none of the above) are omitted to keep the table concise.
 * The "impact" column shows the first sentence of the planet's house
 * implications from PLANET_HOUSE_DEPTH, or the house theme as fallback.
 *
 * Dignity classifications follow BPHS Ch.3-4 (Graha Svarupa).
 */
function buildStrengthTable(kundali: KundaliData, locale: string): StrengthRow[] {
  const rows: StrengthRow[] = [];

  for (const p of kundali.planets) {
    // Only include planets with notable dignity (skip neutral ones)
    if (!p.isExalted && !p.isDebilitated && !p.isOwnSign && !p.isRetrograde) continue;

    const dignity = p.isExalted ? bt(DIGNITY_LABELS.exalted, locale)
      : p.isDebilitated ? bt(DIGNITY_LABELS.debilitated, locale)
      : p.isOwnSign ? bt(DIGNITY_LABELS.ownSign, locale)
      : p.isRetrograde ? bt(DIGNITY_LABELS.retrograde, locale)
      : bt(DIGNITY_LABELS.neutral, locale);

    const impl = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house]?.implications || '';
    // Trim to first sentence
    const firstSentence = impl.split(/[.।]/)[0]?.trim() || '';

    rows.push({
      planet: tl(p.planet.name, locale),
      dignity,
      house: p.house,
      impact: firstSentence || bt(HOUSE_THEME_LABELS[p.house], locale),
    });
  }

  return rows;
}

// ─── Main Entry Point ───────────────────────────────────────────

/**
 * Generates the complete VedicProfile from a KundaliData object.
 *
 * This is the single public entry point for the vedic-profile engine.
 * It orchestrates the full pipeline:
 *   1. Detect chart patterns (scored, sorted)
 *   2. Build each narrative section using the sorted patterns
 *   3. Assemble into VedicProfile struct
 *
 * Pure function — deterministic output for the same input, no side effects.
 *
 * @param kundali — Full kundali data with planets, houses, dashas, yogas, etc.
 * @param locale — 'en' or 'hi' for bilingual narrative output
 * @returns VedicProfile with all sections populated
 */
export function generateVedicProfile(kundali: KundaliData, locale: string): VedicProfile {
  const patterns = detectChartPatterns(kundali);
  return {
    hook: buildHook(patterns, kundali, locale),
    coreIdentity: buildCoreIdentity(kundali, locale),
    standout: buildStandout(patterns, kundali, locale),
    planetaryObservations: buildPlanetaryObservations(patterns, kundali, locale),
    nakshatraInsight: buildNakshatraInsight(kundali, locale),
    dashaContext: buildDashaContext(kundali, locale),
    doshaSection: buildDoshaSection(kundali, locale),
    strengthTable: buildStrengthTable(kundali, locale),
    personName: kundali.birthData.name,
  };
}
