/**
 * Prashna (Horary) Analysis Engine
 *
 * Implements Prashna Shastra — the branch of Vedic astrology (Jyotish) concerned
 * with answering specific questions by casting a chart for the exact moment the
 * question is asked. Unlike natal (Janma) astrology which reads a birth chart,
 * Prashna reads the "birth chart of the question itself."
 *
 * Classical references:
 * - **Prashna Marga** (Kerala tradition, ~16th century): The most comprehensive
 *   treatise on horary astrology in Jyotish. Emphasises the Moon's condition,
 *   Arudha Lagna, and planetary strengths at the query moment.
 * - **Tajika Neelakanthi** (Neelakantha, 16th century): Introduces Tajika (Arabic-
 *   influenced) aspects and Sahams to Prashna analysis, used heavily for annual
 *   and horary charts.
 * - **BPHS Ch.11-12** (Brihat Parashara Hora Shastra): Defines house significations
 *   used here to map question categories to relevant bhavas.
 *
 * Core algorithmic approach:
 * 1. Map the question category to its primary house (BPHS house significations)
 * 2. Evaluate three key significators: Lagna Lord (querent), Moon (mind/intention),
 *    and the relevant house lord (the matter asked about)
 * 3. Score each significator based on dignity (exalted/own/debilitated/combust),
 *    positional strength (kendra/trikona/dusthana), and retrograde status
 * 4. Apply weighted aggregation (Moon weighted highest per Prashna Marga)
 * 5. Check additional classical factors: benefics in kendras, exalted/debilitated
 *    counts, retrograde concentration, karaka strength, 7th house condition
 * 6. Generate a composite score (-100 to +100) mapped to a five-tier verdict
 * 7. Produce timing estimates (Moon speed), guidance, and remedies
 *
 * Key principles (Prashna Marga Ch.1-3):
 * - Lagna lord represents the querent (the person asking)
 * - Moon is the most important planet in Prashna — it reflects the querent's
 *   mind, intention, and the emotional reality behind the question
 * - The relevant bhava (house) depends on the question category
 * - Benefics in Kendras (1,4,7,10) indicate positive outcomes
 * - Planetary dignities and retrogrades affect both outcome and timing
 * - Moon's speed indicates how quickly results will manifest
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { LocaleText,} from '@/types/panchang';

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

/** The eight supported question categories, each mapped to specific BPHS houses. */
export type PrashnaCategory = 'general' | 'career' | 'marriage' | 'health' | 'finance' | 'travel' | 'education' | 'legal';

/**
 * A single interpretive finding from the Prashna analysis.
 * Each insight represents one classical factor (e.g. "Lagna Lord is exalted")
 * with a trilingual human-readable explanation, a polarity, and a numeric score.
 */
export interface PrashnaInsight {
  label: LocaleText;
  finding: LocaleText;
  /** Whether this factor supports a positive, negative, or neutral outcome. */
  nature: 'positive' | 'negative' | 'neutral';
  /** Raw score contribution — positive values favour the querent, negative oppose. */
  score: number;
}

/**
 * Condensed view of a single planet's condition in the Prashna chart.
 * Used by the UI to render the "Planet Digest" card grid — one card per graha
 * showing its sign, house, dignity, retrograde status, and role in the query.
 */
export interface PlanetDigest {
  planetId: number;
  planetName: LocaleText;
  planetColor: string;
  sign: number;       // 1-based Rashi ID (1=Aries..12=Pisces)
  signName: LocaleText;
  house: number;      // 1-based Bhava number
  dignity: string | null; // 'Exalted' | 'Own Sign' | 'Debilitated' | 'Combust' | null
  retrograde: boolean;
  strength: 'strong' | 'moderate' | 'weak'; // Derived from composite planetScore()
  /** Contextual role in THIS query: Lagna Lord, House Lord, Karaka, or just house placement. */
  role: LocaleText;
}

/**
 * Complete output of the Prashna analysis engine.
 *
 * The UI renders this as a multi-section report:
 * - Verdict banner (outcome + score + summary)
 * - Three primary insight cards (Lagna Lord, Moon, Relevant House)
 * - Key Factors list (variable length — only factors that crossed threshold)
 * - Timing estimate (based on Moon speed + dasha context)
 * - Guidance paragraph (action recommendation)
 * - Remedies (planetary + category-specific + general if outcome is poor)
 * - Planet Digest grid (all 9 grahas with their Prashna-context roles)
 */
export interface PrashnaAnalysis {
  category: PrashnaCategory;
  categoryLabel: LocaleText;
  verdict: {
    /** Five-tier verdict derived from the composite score. */
    outcome: 'very_favorable' | 'favorable' | 'mixed' | 'challenging' | 'difficult';
    /** Composite score clamped to [-100, +100]. Positive = favourable for the querent. */
    score: number;
    summary: LocaleText;
  };
  /** Assessment of the Lagna Lord — represents the querent themselves. */
  lagnaInsight: PrashnaInsight;
  /** Assessment of the Moon — the primary Prashna significator (querent's mind). */
  moonInsight: PrashnaInsight;
  /** Assessment of the house lord relevant to the question category. */
  relevantHouseInsight: PrashnaInsight;
  /** Additional classical factors that crossed scoring thresholds. */
  keyFactors: PrashnaInsight[];
  /** Timing estimate based on Moon speed (Prashna Marga) and Vimshottari Dasha. */
  timing: LocaleText;
  /** Actionable guidance paragraph tailored to outcome and category. */
  guidance: LocaleText;
  /** Ordered remedies: weakest planet remedy, category-specific, and general (if poor outcome). */
  remedies: LocaleText[];
  /** All 9 grahas (Sun through Ketu) with their Prashna-context roles and conditions. */
  planetDigest: PlanetDigest[];
}

// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────

/**
 * Category-to-house mapping based on BPHS house significations (Ch.11-12):
 *
 * - **general**: 1st (self/body) + 7th (the matter/other party)
 * - **career**: 10th (karma/profession, BPHS Ch.11 v.47-48) + 6th (service/competition)
 * - **marriage**: 7th (spouse/partnership, BPHS Ch.11 v.35-36) + 2nd (family)
 * - **health**: 1st (body/constitution) + 6th (disease/enemies, BPHS Ch.11 v.29-30)
 * - **finance**: 2nd (wealth/stored assets, BPHS Ch.11 v.13) + 11th (gains/income)
 * - **travel**: 3rd (short journeys) + 9th (long journeys/pilgrimage, BPHS Ch.11 v.41)
 * - **education**: 4th (formal education) + 5th (intellect/learning, BPHS Ch.11 v.25)
 * - **legal**: 6th (litigation/enemies) + 7th (the opposing party)
 *
 * `karaka` lists natural significator planet IDs (naisargika karaka) for the category.
 * These are planets that inherently signify the subject matter regardless of house lordship.
 * E.g. Venus (id=5) is the natural karaka for marriage; Sun (id=0) for career/authority.
 */
const CATEGORY_CONFIG: Record<PrashnaCategory, {
  label: LocaleText;
  houses: number[];       // primary + secondary relevant houses
  karaka: number[];       // natural significator planet IDs (0=Sun..8=Ketu)
  houseLabel: LocaleText; // label for the relevant house card in the UI
}> = {
  general: {
    label: { en: 'General', hi: 'सामान्य', sa: 'सामान्यम्' },
    houses: [1, 7],       // 1st = querent, 7th = the matter (Prashna Marga convention)
    karaka: [1],          // Moon — general significator of the querent's mind
    houseLabel: { en: '1st House (Self)', hi: 'प्रथम भाव (आत्मा)', sa: 'प्रथमभावः (आत्मा)' },
  },
  career: {
    label: { en: 'Career & Profession', hi: 'करियर एवं व्यवसाय', sa: 'वृत्तिः' },
    houses: [10, 6],      // 10th = profession/status, 6th = service/daily work
    karaka: [0, 6],       // Sun (authority/status) + Saturn (labour/perseverance)
    houseLabel: { en: '10th House (Career)', hi: 'दशम भाव (कर्म)', sa: 'दशमभावः (कर्म)' },
  },
  marriage: {
    label: { en: 'Marriage & Relationships', hi: 'विवाह एवं सम्बन्ध', sa: 'विवाहः' },
    houses: [7, 2],       // 7th = spouse/partner, 2nd = family/married life
    karaka: [5],          // Venus — natural karaka for marriage and relationships
    houseLabel: { en: '7th House (Partnership)', hi: 'सप्तम भाव (साझेदारी)', sa: 'सप्तमभावः (भार्या)' },
  },
  health: {
    label: { en: 'Health & Wellbeing', hi: 'स्वास्थ्य', sa: 'स्वास्थ्यम्' },
    houses: [1, 6],       // 1st = body/vitality, 6th = disease/affliction
    karaka: [0, 1],       // Sun (vitality/soul) + Moon (mind/constitution)
    houseLabel: { en: '1st & 6th House (Body/Disease)', hi: 'लग्न एवं षष्ठ भाव', sa: 'लग्नं षष्ठभावश्च' },
  },
  finance: {
    label: { en: 'Finance & Wealth', hi: 'धन एवं सम्पत्ति', sa: 'धनम्' },
    houses: [2, 11],      // 2nd = stored wealth, 11th = gains/income
    karaka: [4, 5],       // Jupiter (prosperity/expansion) + Venus (luxury/assets)
    houseLabel: { en: '2nd House (Wealth)', hi: 'द्वितीय भाव (धन)', sa: 'द्वितीयभावः (धनम्)' },
  },
  travel: {
    label: { en: 'Travel & Relocation', hi: 'यात्रा', sa: 'यात्रा' },
    houses: [3, 9],       // 3rd = short journeys, 9th = long/foreign travel
    karaka: [1, 3],       // Moon (movement/change) + Mercury (communication/transit)
    houseLabel: { en: '9th House (Long Journey)', hi: 'नवम भाव (दीर्घ यात्रा)', sa: 'नवमभावः (दीर्घयात्रा)' },
  },
  education: {
    label: { en: 'Education & Learning', hi: 'शिक्षा', sa: 'शिक्षा' },
    houses: [4, 5],       // 4th = formal education, 5th = intellect/learning
    karaka: [3, 4],       // Mercury (intellect/speech) + Jupiter (wisdom/guru)
    houseLabel: { en: '5th House (Learning)', hi: 'पंचम भाव (विद्या)', sa: 'पञ्चमभावः (विद्या)' },
  },
  legal: {
    label: { en: 'Legal & Disputes', hi: 'कानूनी विवाद', sa: 'विधिविवादः' },
    houses: [6, 7],       // 6th = litigation/enemies, 7th = opponent/other party
    karaka: [4, 6],       // Jupiter (justice/dharma) + Saturn (law/karma)
    houseLabel: { en: '6th House (Litigation)', hi: 'षष्ठ भाव (विवाद)', sa: 'षष्ठभावः (विवादः)' },
  },
};

/** Re-exported for use by UI components that need category labels/houses. */
export const PRASHNA_CATEGORIES = CATEGORY_CONFIG;

/**
 * Sign → Lord planet ID mapping (BPHS Ch.3).
 * Key = Rashi ID (1=Aries..12=Pisces), Value = Planet ID (0=Sun..6=Saturn).
 * Rahu (7) and Ketu (8) are shadow planets and do not lord any sign in classical Parashari.
 *
 * 1 Aries=Mars(2), 2 Taurus=Venus(5), 3 Gemini=Mercury(3), 4 Cancer=Moon(1),
 * 5 Leo=Sun(0), 6 Virgo=Mercury(3), 7 Libra=Venus(5), 8 Scorpio=Mars(2),
 * 9 Sagittarius=Jupiter(4), 10 Capricorn=Saturn(6), 11 Aquarius=Saturn(6),
 * 12 Pisces=Jupiter(4).
 */
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

/** Natural benefics per BPHS — Moon, Mercury, Jupiter, Venus. */
const BENEFIC_IDS = new Set([1, 3, 4, 5]);
/** Natural malefics per BPHS — Sun, Mars, Saturn, Rahu, Ketu. */
const MALEFIC_IDS = new Set([0, 2, 6, 7, 8]);
/** Kendra (angular) houses: strongest positional strength (BPHS Ch.12). */
const KENDRA = new Set([1, 4, 7, 10]);
/** Trikona (trinal) houses: auspicious placements (Dharma, Purva Punya, Bhagya). */
const TRIKONA = new Set([1, 5, 9]);
/** Dusthana (malefic) houses: 6th (enemies/disease), 8th (longevity/obstacles), 12th (loss/expenditure). */
const DUSTHANA = new Set([6, 8, 12]);

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

/**
 * Returns a short English dignity label for a planet, or null if no special dignity.
 * Used in the PlanetDigest cards. Priority order matches classical importance:
 * exaltation > own sign > debilitation > combustion.
 */
function dignityLabel(p: PlanetPosition): string | null {
  if (p.isExalted) return 'Exalted';
  if (p.isOwnSign) return 'Own Sign';
  if (p.isDebilitated) return 'Debilitated';
  if (p.isCombust) return 'Combust';
  return null;
}

/**
 * Returns a trilingual dignity/state descriptor for use in narrative finding text.
 * Falls through to retrograde if no dignity applies, then to neutral.
 * Used to build the human-readable insight strings (e.g. "Jupiter is exalted in Cancer").
 */
function dignityTri(p: PlanetPosition): LocaleText {
  if (p.isExalted) return { en: 'exalted', hi: 'उच्च', sa: 'उच्चम्' };
  if (p.isOwnSign) return { en: 'in own sign', hi: 'स्वराशि में', sa: 'स्वराशौ' };
  if (p.isDebilitated) return { en: 'debilitated', hi: 'नीच', sa: 'नीचम्' };
  if (p.isCombust) return { en: 'combust', hi: 'अस्त', sa: 'अस्तम्' };
  if (p.isRetrograde) return { en: 'retrograde', hi: 'वक्री', sa: 'वक्री' };
  return { en: 'in neutral position', hi: 'सामान्य स्थिति में', sa: 'सामान्यस्थितौ' };
}

/**
 * Computes a composite strength score for a single planet in the Prashna context.
 *
 * Scoring heuristic (not a formal Shadbala — simplified for Prashna):
 * - **Dignity** (BPHS Ch.3-4):
 *     +20 exalted (peak strength, planet delivers its best significations)
 *     +12 own sign (comfortable, strong but not peak)
 *     -18 debilitated (weakened, significations suffer)
 * - **Combustion** (within Sun's orb): -8 (planet's agency is overpowered by Sun)
 * - **Retrograde** (planets 2-6 only, not Sun/Moon/Rahu/Ketu): -5
 *     In Prashna, retrograde signals delays and reconsideration (Prashna Marga Ch.8).
 *     Rahu/Ketu are always retrograde so no penalty is applied.
 * - **Positional strength** (house placement):
 *     +8 kendra (1,4,7,10) — angular houses give directional strength (Digbala-adjacent)
 *     +6 trikona (1,5,9) — trinal houses are inherently auspicious
 *     -8 dusthana (6,8,12) — malefic houses weaken the planet's ability to deliver
 *
 * Returns a raw integer score (typically -26 to +28 range).
 */
function planetScore(p: PlanetPosition): number {
  let s = 0;
  if (p.isExalted) s += 20;
  else if (p.isOwnSign) s += 12;
  else if (p.isDebilitated) s -= 18;
  if (p.isCombust) s -= 8;
  if (p.isRetrograde && p.planet.id <= 6) s -= 5; // Only true planets, not nodes
  // Positional strength — kendra > trikona > neutral > dusthana
  if (KENDRA.has(p.house)) s += 8;
  else if (TRIKONA.has(p.house)) s += 6;
  else if (DUSTHANA.has(p.house)) s -= 8;
  return s;
}

/**
 * Maps a raw planetScore() value to a three-tier label for the UI.
 * Thresholds: >= 10 = strong, >= -5 = moderate, < -5 = weak.
 */
function strengthLabel(score: number): 'strong' | 'moderate' | 'weak' {
  if (score >= 10) return 'strong';
  if (score >= -5) return 'moderate';
  return 'weak';
}

/** Finds a planet by its 0-based ID (0=Sun..8=Ketu). Asserts presence via `!`. */
function findPlanet(planets: PlanetPosition[], id: number): PlanetPosition {
  return planets.find(p => p.planet.id === id)!;
}

// ──────────────────────────────────────────────────────────────
// Main Analysis
// ──────────────────────────────────────────────────────────────

/**
 * Main entry point — analyses a Prashna (horary) chart for a given question category.
 *
 * Algorithm overview (8 scoring stages):
 *   1. **Lagna Lord** (querent): scored via planetScore(), weighted x1.2
 *   2. **Moon** (mind of query): scored + dispositor check, weighted x1.8 (highest —
 *      per Prashna Marga, Moon is the single most important factor in Prashna)
 *   3. **Relevant House Lord**: scored + benefic/malefic occupancy, weighted x1.3
 *   4. **Benefic/Malefic distribution in Kendras**: bonus/penalty for classical pattern
 *   5. **Exalted/Debilitated planet counts**: additional adjustment
 *   6. **Retrograde concentration**: penalty if >= 3 true planets retrograde
 *   7. **Karaka (natural significator) strength**: bonus/penalty per category karaka
 *   8. **7th House Lord** (the matter/other party): checked for non-marriage/legal categories
 *
 * The weighted sum is clamped to [-100, +100] and mapped to a five-tier verdict.
 *
 * @param kundali - Chart data cast for the moment of the question
 * @param category - The type of question being asked (maps to BPHS houses)
 * @returns Full PrashnaAnalysis with verdict, insights, timing, guidance, remedies
 */
export function analyzePrashna(kundali: KundaliData, category: PrashnaCategory): PrashnaAnalysis {
  const cfg = CATEGORY_CONFIG[category];
  const planets = kundali.planets;
  const primaryHouse = cfg.houses[0];

  // ── Identify the three key significators ──
  // Moon: the querent's mind and intention (Prashna Marga Ch.3)
  const moon = findPlanet(planets, 1);
  // Lagna Lord: the querent themselves — the person asking the question
  const ascSign = kundali.ascendant.sign;
  const ascLordId = SIGN_LORD[ascSign];
  const ascLord = findPlanet(planets, ascLordId);

  // Relevant House Lord: represents "the matter asked about"
  // e.g. for a career question, this is the lord of the 10th house
  const relHouseData = kundali.houses.find(h => h.house === primaryHouse)!;
  const relLordId = SIGN_LORD[relHouseData.sign];
  const relLord = findPlanet(planets, relLordId);

  // Which planets are sitting in the relevant house (occupants affect the matter)
  const planetsInRelHouse = planets.filter(p => p.house === primaryHouse);

  let total = 0;        // Running composite score
  const factors: PrashnaInsight[] = [];  // Additional factors beyond the 3 primary insights

  // ── 1. Lagna Lord (the querent) ──
  // Weight: 1.2x — important but secondary to Moon in Prashna (unlike natal charts
  // where Lagna Lord is paramount). A strong Lagna Lord means the querent is in a
  // good position to act; a weak one means personal challenges regardless of the matter.
  const lagnaScore = planetScore(ascLord);
  total += lagnaScore * 1.2;
  const lagnaInsight: PrashnaInsight = {
    label: { en: 'Ascendant Lord', hi: 'लग्नेश', sa: 'लग्नेशः' },
    finding: {
      en: `${ascLord.planet.name.en} (lord of ${kundali.ascendant.signName.en} Lagna) is ${dignityTri(ascLord).en} in ${ascLord.signName.en}, placed in House ${ascLord.house}. ${lagnaScore > 5 ? 'This indicates the querent is in a strong position to achieve their goal.' : lagnaScore < -5 ? 'The querent faces significant personal challenges regarding this matter.' : 'The querent\'s situation is moderate — neither strongly advantaged nor disadvantaged.'}`,
      hi: `${ascLord.planet.name.hi} (${kundali.ascendant.signName.hi} लग्न के स्वामी) ${ascLord.signName.hi} में ${dignityTri(ascLord).hi}, भाव ${ascLord.house} में स्थित। ${lagnaScore > 5 ? 'प्रश्नकर्ता अपने लक्ष्य को प्राप्त करने की सशक्त स्थिति में है।' : lagnaScore < -5 ? 'प्रश्नकर्ता को इस विषय में महत्त्वपूर्ण चुनौतियों का सामना करना पड़ सकता है।' : 'प्रश्नकर्ता की स्थिति सामान्य है — न अत्यन्त अनुकूल, न प्रतिकूल।'}`,
      sa: `${ascLord.planet.name.sa} (${kundali.ascendant.signName.sa} लग्नस्य ईशः) ${ascLord.signName.sa} राशौ ${dignityTri(ascLord).sa}, भावे ${ascLord.house} स्थितः। ${lagnaScore > 5 ? 'प्रश्नकर्ता स्वलक्ष्यप्राप्तौ सबले स्थितौ अस्ति।' : lagnaScore < -5 ? 'प्रश्नकर्ता अस्मिन् विषये महत्त्वपूर्णैः आव्हानैः सम्मुखीभवति।' : 'प्रश्नकर्तुः स्थितिः सामान्या — नातिशुभा नातिप्रतिकूला।'}`,
    },
    nature: lagnaScore > 5 ? 'positive' : lagnaScore < -5 ? 'negative' : 'neutral',
    score: lagnaScore,
  };

  // ── 2. Moon — the primary significator of the querent in Prashna ──
  // Per Prashna Marga Ch.3: "The Moon is the life of all horary astrology."
  // The Moon represents the querent's mind, the emotional reality behind the question,
  // and gives the strongest single signal about the outcome.
  //
  // Weight: 1.8x (highest of all factors) — Moon's condition dominates the verdict.
  //
  // Moon's dispositor (lord of the sign Moon occupies) is checked as a proxy for
  // "applying aspects" — if Moon's dispositor is a natural benefic, the emotional
  // undercurrent supports a positive outcome. This is a simplification of the full
  // Prashna Marga aspect analysis (Ithasala/Ishrafa yogas from Tajika).
  const moonScore = planetScore(moon);
  const moonSignLord = SIGN_LORD[moon.sign];
  const moonDispositorBenefic = BENEFIC_IDS.has(moonSignLord);
  const moonBonus = moonDispositorBenefic ? 8 : -5;
  const totalMoonScore = moonScore + moonBonus;
  total += totalMoonScore * 1.8;

  const moonInsight: PrashnaInsight = {
    label: { en: 'Moon (Mind of the Query)', hi: 'चन्द्र (प्रश्न का मन)', sa: 'चन्द्रः (प्रश्नमनः)' },
    finding: {
      en: `Moon is in ${moon.signName.en} (House ${moon.house}), Nakshatra ${moon.nakshatra.name.en} Pada ${moon.pada}. ${moon.isExalted ? 'Exalted Moon gives exceptional clarity and a strong positive indication.' : moon.isDebilitated ? 'Debilitated Moon suggests mental anxiety and an unfavorable inclination.' : ''} ${moonDispositorBenefic ? 'Moon\'s dispositor is benefic — the emotional undercurrent supports a positive outcome.' : 'Moon\'s dispositor is malefic — there may be hidden anxieties or obstacles.'} ${moon.isRetrograde ? 'Moon is retrograde (rare) — deep introspection needed.' : ''} ${totalMoonScore > 8 ? 'Overall, the Moon strongly favors the querent.' : totalMoonScore < -8 ? 'The Moon indicates difficulties ahead.' : 'The Moon gives a mixed signal.'}`,
      hi: `चन्द्र ${moon.signName.hi} (भाव ${moon.house}) में, नक्षत्र ${moon.nakshatra.name.hi} पद ${moon.pada}। ${moon.isExalted ? 'उच्च चन्द्र असाधारण स्पष्टता और सशक्त शुभ संकेत देता है।' : moon.isDebilitated ? 'नीच चन्द्र मानसिक चिन्ता और प्रतिकूल झुकाव दर्शाता है।' : ''} ${moonDispositorBenefic ? 'चन्द्र का राशि स्वामी शुभ है — भावनात्मक प्रवाह अनुकूल है।' : 'चन्द्र का राशि स्वामी अशुभ है — छिपी चिन्ता या बाधाएं हो सकती हैं।'} ${totalMoonScore > 8 ? 'कुल मिलाकर, चन्द्र प्रश्नकर्ता के पक्ष में है।' : totalMoonScore < -8 ? 'चन्द्र आगे कठिनाइयों का संकेत देता है।' : 'चन्द्र मिश्रित संकेत दे रहा है।'}`,
      sa: `चन्द्रः ${moon.signName.sa} राशौ (भावे ${moon.house}), नक्षत्रम् ${moon.nakshatra.name.sa} पदम् ${moon.pada}। ${totalMoonScore > 8 ? 'चन्द्रः प्रश्नकर्तुः पक्षे बलवान् अस्ति।' : totalMoonScore < -8 ? 'चन्द्रः कठिनतां सूचयति।' : 'चन्द्रः मिश्रसङ्केतं ददाति।'}`,
    },
    nature: totalMoonScore > 5 ? 'positive' : totalMoonScore < -5 ? 'negative' : 'neutral',
    score: totalMoonScore,
  };

  // ── 3. Relevant House Lord + occupancy ──
  // The house corresponding to the question category (e.g. 10th for career).
  // Two sub-factors:
  //   a) The lord's own strength (dignity + position via planetScore)
  //   b) Occupancy: each benefic in the house adds +6, each malefic subtracts -6.
  //      Per Prashna Marga, benefics in the relevant house "nourish" the matter,
  //      while malefics "damage" or "delay" it.
  // Weight: 1.3x — the matter's condition is important but the querent (Moon/Lagna)
  // must also be strong for it to manifest.
  const relScore = planetScore(relLord);
  const beneficsInRelHouse = planetsInRelHouse.filter(p => BENEFIC_IDS.has(p.planet.id)).length;
  const maleficsInRelHouse = planetsInRelHouse.filter(p => MALEFIC_IDS.has(p.planet.id)).length;
  const houseBonus = (beneficsInRelHouse * 6) - (maleficsInRelHouse * 6);
  const totalRelScore = relScore + houseBonus;
  total += totalRelScore * 1.3;

  const occupantText = planetsInRelHouse.length > 0
    ? { en: `Occupied by ${planetsInRelHouse.map(p => p.planet.name.en).join(', ')}.`, hi: `${planetsInRelHouse.map(p => p.planet.name.hi).join(', ')} विराजमान।`, sa: `${planetsInRelHouse.map(p => p.planet.name.sa).join(', ')} स्थिताः।` }
    : { en: 'No planets occupy this house.', hi: 'इस भाव में कोई ग्रह नहीं।', sa: 'अस्मिन् भावे ग्रहो नास्ति।' };

  const relevantHouseInsight: PrashnaInsight = {
    label: cfg.houseLabel,
    finding: {
      en: `House ${primaryHouse} is in ${relHouseData.signName.en}, ruled by ${relLord.planet.name.en} (${dignityTri(relLord).en} in House ${relLord.house}). ${occupantText.en} ${totalRelScore > 5 ? 'This house is well-disposed — the matter asked about has favorable conditions.' : totalRelScore < -5 ? 'This house is afflicted — the matter faces obstacles.' : 'Conditions are moderate for this matter.'}`,
      hi: `भाव ${primaryHouse} ${relHouseData.signName.hi} में है, स्वामी ${relLord.planet.name.hi} (भाव ${relLord.house} में ${dignityTri(relLord).hi})। ${occupantText.hi} ${totalRelScore > 5 ? 'यह भाव अनुकूल है — पूछा गया विषय शुभ परिस्थितियों में है।' : totalRelScore < -5 ? 'यह भाव पीड़ित है — विषय में बाधाएं हैं।' : 'इस विषय के लिए स्थितियां सामान्य हैं।'}`,
      sa: `भावः ${primaryHouse} ${relHouseData.signName.sa} राशौ, ईशः ${relLord.planet.name.sa} (भावे ${relLord.house}, ${dignityTri(relLord).sa})। ${occupantText.sa} ${totalRelScore > 5 ? 'अयं भावः अनुकूलः — विषयः शुभपरिस्थितौ अस्ति।' : totalRelScore < -5 ? 'अयं भावः पीडितः — विषये विघ्नाः सन्ति।' : 'अस्मिन् विषये स्थितिः सामान्या।'}`,
    },
    nature: totalRelScore > 5 ? 'positive' : totalRelScore < -5 ? 'negative' : 'neutral',
    score: totalRelScore,
  };

  // ── 4. Benefic/Malefic distribution in Kendras (angular houses) ──
  // Classical principle (Prashna Marga Ch.5): "Benefics in kendras are the surest
  // sign of a favourable outcome." Two or more benefics in houses 1/4/7/10 = strong
  // positive signal (+15). Three or more malefics in kendras = significant obstacle (-12).
  const bInK = planets.filter(p => BENEFIC_IDS.has(p.planet.id) && KENDRA.has(p.house)).length;
  const mInK = planets.filter(p => MALEFIC_IDS.has(p.planet.id) && KENDRA.has(p.house)).length;

  if (bInK >= 2) {
    total += 15;
    factors.push({
      label: { en: 'Benefics in Angular Houses', hi: 'केन्द्रों में शुभ ग्रह', sa: 'केन्द्रेषु शुभग्रहाः' },
      finding: {
        en: `${bInK} benefic planet(s) in angular houses (1,4,7,10) — strong support for a positive outcome. Classical texts consider this the most auspicious configuration.`,
        hi: `${bInK} शुभ ग्रह केन्द्र भावों (1,4,7,10) में — सकारात्मक परिणाम का बलवान समर्थन। शास्त्रों में यह सर्वाधिक शुभ योग माना जाता है।`,
        sa: `${bInK} शुभग्रहाः केन्द्रभावेषु — शुभफलस्य बलवत् समर्थनम्।`,
      },
      nature: 'positive', score: 15,
    });
  }
  if (mInK >= 3) {
    total -= 12;
    factors.push({
      label: { en: 'Malefics in Angular Houses', hi: 'केन्द्रों में पाप ग्रह', sa: 'केन्द्रेषु पापग्रहाः' },
      finding: {
        en: `${mInK} malefic planet(s) dominate angular houses — obstacles, delays, and resistance are likely. Careful planning is advised.`,
        hi: `${mInK} पाप ग्रह केन्द्र भावों में प्रबल — बाधाएं, विलम्ब और प्रतिरोध सम्भव। सावधानीपूर्वक योजना बनाएं।`,
        sa: `${mInK} पापग्रहाः केन्द्रभावेषु — विघ्नाः विलम्बः प्रतिरोधश्च सम्भवतः।`,
      },
      nature: 'negative', score: -12,
    });
  }

  // ── 5. Exalted / Debilitated planet counts ──
  // Exalted planets anywhere in the chart bring peak energy to their significations.
  // Debilitated planets indicate weakness in their domains. Each contributes ±5 to the total.
  const exalted = planets.filter(p => p.isExalted);
  const debilitated = planets.filter(p => p.isDebilitated);
  if (exalted.length > 0) {
    const n = exalted.map(p => p.planet.name.en).join(', ');
    const nHi = exalted.map(p => p.planet.name.hi).join(', ');
    total += exalted.length * 5;
    factors.push({
      label: { en: 'Exalted Planets', hi: 'उच्च ग्रह', sa: 'उच्चग्रहाः' },
      finding: {
        en: `${n} ${exalted.length === 1 ? 'is' : 'are'} exalted — bringing peak strength and positive energy. Exalted planets give exceptional results in their significations.`,
        hi: `${nHi} उच्च ${exalted.length === 1 ? 'है' : 'हैं'} — चरम बल और शुभ ऊर्जा। उच्च ग्रह अपने कारकत्व में असाधारण फल देते हैं।`,
        sa: `${nHi} उच्चस्थानगताः — विशेषबलं शुभशक्तिं च प्रददति।`,
      },
      nature: 'positive', score: exalted.length * 5,
    });
  }
  if (debilitated.length > 0) {
    const n = debilitated.map(p => p.planet.name.en).join(', ');
    const nHi = debilitated.map(p => p.planet.name.hi).join(', ');
    total -= debilitated.length * 5;
    factors.push({
      label: { en: 'Debilitated Planets', hi: 'नीच ग्रह', sa: 'नीचग्रहाः' },
      finding: {
        en: `${n} ${debilitated.length === 1 ? 'is' : 'are'} debilitated — weakened capacity in ${debilitated.length === 1 ? 'its' : 'their'} domain. This area needs extra effort.`,
        hi: `${nHi} नीच ${debilitated.length === 1 ? 'है' : 'हैं'} — अपने क्षेत्र में क्षमता कमज़ोर। इस क्षेत्र में अतिरिक्त प्रयास आवश्यक।`,
        sa: `${nHi} नीचस्थानगताः — स्वक्षेत्रे दुर्बलता। अतिरिक्तप्रयत्नः आवश्यकः।`,
      },
      nature: 'negative', score: -debilitated.length * 5,
    });
  }

  // ── 6. Retrograde concentration ──
  // Only counts true planets that can go retrograde: Mars(2) through Saturn(6).
  // Sun and Moon never retrograde; Rahu/Ketu are always retrograde (excluded).
  // >= 3 retrogrades = -8 penalty. Per Prashna Marga Ch.8, multiple retrogrades
  // indicate the matter "turns back on itself" — delays, reversals, need to revisit.
  const retros = planets.filter(p => p.isRetrograde && p.planet.id >= 2 && p.planet.id <= 6);
  if (retros.length >= 3) {
    total -= 8;
    factors.push({
      label: { en: 'Multiple Retrogrades', hi: 'अनेक वक्री ग्रह', sa: 'बहवः वक्रिग्रहाः' },
      finding: {
        en: `${retros.length} planets are retrograde — delays, reversals, and need for reconsideration are indicated. The matter may not proceed in a straightforward manner.`,
        hi: `${retros.length} ग्रह वक्री — विलम्ब, उलटफेर और पुनर्विचार की आवश्यकता। कार्य सीधे-सीधे नहीं बढ़ सकता।`,
        sa: `${retros.length} ग्रहाः वक्रिणः — विलम्बः विपर्ययः पुनर्विचारश्च सूचिताः।`,
      },
      nature: 'negative', score: -8,
    });
  }

  // ── 7. Karaka (natural significator) strength ──
  // Each category has one or more naisargika karakas — planets that naturally
  // signify the subject matter (e.g. Venus for marriage, Jupiter for wealth).
  // If the karaka is strong (score > 10): +8 bonus — the natural energy supports the query.
  // If weak (score < -10): -6 penalty — the domain's natural ruler is compromised.
  for (const kId of cfg.karaka) {
    const k = findPlanet(planets, kId);
    const kS = planetScore(k);
    if (kS > 10) {
      total += 8;
      factors.push({
        label: { en: `${k.planet.name.en} (Significator)`, hi: `${k.planet.name.hi} (कारक)`, sa: `${k.planet.name.sa} (कारकः)` },
        finding: {
          en: `${k.planet.name.en}, the natural significator for ${cfg.label.en.toLowerCase()}, is ${dignityTri(k).en} in ${k.signName.en} (House ${k.house}) — a strong positive indicator for your question.`,
          hi: `${k.planet.name.hi}, ${cfg.label.hi} का नैसर्गिक कारक, ${k.signName.hi} में ${dignityTri(k).hi} (भाव ${k.house}) — आपके प्रश्न के लिए शुभ संकेत।`,
          sa: `${k.planet.name.sa}, ${cfg.label.sa} कारकः, ${k.signName.sa} राशौ ${dignityTri(k).sa} (भावे ${k.house}) — शुभसूचकम्।`,
        },
        nature: 'positive', score: 8,
      });
    } else if (kS < -10) {
      total -= 6;
      factors.push({
        label: { en: `${k.planet.name.en} (Significator)`, hi: `${k.planet.name.hi} (कारक)`, sa: `${k.planet.name.sa} (कारकः)` },
        finding: {
          en: `${k.planet.name.en}, the natural significator, is ${dignityTri(k).en} in ${k.signName.en} (House ${k.house}) — challenges in this domain.`,
          hi: `${k.planet.name.hi}, नैसर्गिक कारक, ${k.signName.hi} में ${dignityTri(k).hi} (भाव ${k.house}) — इस क्षेत्र में चुनौतियां।`,
          sa: `${k.planet.name.sa}, नैसर्गिककारकः, ${k.signName.sa} राशौ ${dignityTri(k).sa} (भावे ${k.house}) — आव्हानानि।`,
        },
        nature: 'negative', score: -6,
      });
    }
  }

  // ── 8. 7th House Lord — "the matter" or "the other party" ──
  // In Prashna, the 7th house generically represents "the matter being asked about"
  // or "the other party involved" (Prashna Marga Ch.4). Skipped for marriage/legal
  // categories because the 7th house is already their primary house (checked above).
  if (category !== 'marriage' && category !== 'legal') {
    const h7 = kundali.houses.find(h => h.house === 7)!;
    const h7LordId = SIGN_LORD[h7.sign];
    const h7Lord = findPlanet(planets, h7LordId);
    const h7S = planetScore(h7Lord);
    if (h7S > 8) {
      total += 5;
      factors.push({
        label: { en: '7th House (The Matter)', hi: 'सप्तम भाव (विषय)', sa: 'सप्तमभावः (विषयः)' },
        finding: {
          en: `The 7th house lord ${h7Lord.planet.name.en} is strong (${dignityTri(h7Lord).en}) — the matter itself has favorable conditions.`,
          hi: `सप्तम भाव स्वामी ${h7Lord.planet.name.hi} बलवान (${dignityTri(h7Lord).hi}) — विषय अनुकूल परिस्थितियों में है।`,
          sa: `सप्तमभावेशः ${h7Lord.planet.name.sa} बलवान् (${dignityTri(h7Lord).sa}) — विषयः अनुकूलपरिस्थितौ।`,
        },
        nature: 'positive', score: 5,
      });
    }
  }

  // Clamp the composite score to [-100, +100]
  total = Math.max(-100, Math.min(100, Math.round(total)));

  // ── Verdict mapping ──
  // Five tiers with asymmetric thresholds (slightly easier to be "favorable"
  // than "challenging" — reflects the traditional Prashna Marga optimism where
  // the act of asking the question at the right moment is itself auspicious).
  //   >= +35: very_favorable  |  +12 to +34: favorable  |  -12 to +11: mixed
  //   -35 to -13: challenging  |  <= -36: difficult
  let outcome: PrashnaAnalysis['verdict']['outcome'];
  if (total >= 35) outcome = 'very_favorable';
  else if (total >= 12) outcome = 'favorable';
  else if (total >= -12) outcome = 'mixed';
  else if (total >= -35) outcome = 'challenging';
  else outcome = 'difficult';

  const verdictSummary = buildVerdictSummary(outcome, total, category, ascLord, moon, relLord, cfg);

  // ── Timing ──
  const timing = buildTiming(moon, kundali.dashas, total);

  // ── Guidance ──
  const guidance = buildGuidance(outcome, category, ascLord, moon, relLord, cfg);

  // ── Remedies ──
  const remedies = buildRemedies(outcome, category, relLord, moon, ascLord, cfg);

  // ── Planet Digest — summary of all 9 grahas with their Prashna roles ──
  // Each planet is tagged with its contextual role: Lagna Lord (querent),
  // Relevant House Lord (the matter), Natural Significator (karaka), or
  // simply its house placement. This drives the UI's planet card grid.
  const planetDigest = planets.filter(p => p.planet.id <= 8).map(p => {
    const ps = planetScore(p);
    const isKaraka = cfg.karaka.includes(p.planet.id);
    const isLagnaLord = p.planet.id === ascLordId;
    const isRelLord = p.planet.id === relLordId;
    let role: LocaleText;
    if (isLagnaLord) role = { en: 'Ascendant Lord (You)', hi: 'लग्नेश (आप)', sa: 'लग्नेशः (त्वम्)' };
    else if (isRelLord) role = { en: `House ${primaryHouse} Lord (Matter)`, hi: `भाव ${primaryHouse} स्वामी (विषय)`, sa: `भाव ${primaryHouse} ईशः (विषयः)` };
    else if (isKaraka) role = { en: 'Natural Significator', hi: 'नैसर्गिक कारक', sa: 'नैसर्गिककारकः' };
    else role = { en: `In House ${p.house}`, hi: `भाव ${p.house} में`, sa: `भावे ${p.house}` };

    return {
      planetId: p.planet.id,
      planetName: p.planet.name,
      planetColor: p.planet.color,
      sign: p.sign,
      signName: p.signName,
      house: p.house,
      dignity: dignityLabel(p),
      retrograde: p.isRetrograde,
      strength: strengthLabel(ps),
      role,
    };
  });

  return {
    category,
    categoryLabel: cfg.label,
    verdict: { outcome, score: total, summary: verdictSummary },
    lagnaInsight,
    moonInsight,
    relevantHouseInsight,
    keyFactors: factors,
    timing,
    guidance,
    remedies,
    planetDigest,
  };
}

// ──────────────────────────────────────────────────────────────
// Verdict, Timing, Guidance, Remedies
//
// These builder functions generate the trilingual narrative text
// for each section of the Prashna report. They are pure functions
// that take scored data and produce LocaleText output — no
// additional computation happens here.
// ──────────────────────────────────────────────────────────────

/**
 * Generates the verdict summary paragraph — the main "bottom line" of the reading.
 * Maps each of the five outcome tiers to a narrative that references the querent's
 * key planets (Lagna Lord, Moon, Relevant House Lord) by name, giving the user
 * a personalised summary rather than a generic statement.
 */
function buildVerdictSummary(
  outcome: PrashnaAnalysis['verdict']['outcome'],
  score: number,
  category: PrashnaCategory,
  ascLord: PlanetPosition,
  moon: PlanetPosition,
  relLord: PlanetPosition,
  cfg: typeof CATEGORY_CONFIG[PrashnaCategory],
): LocaleText {
  const catEn = cfg.label.en.toLowerCase();
  const catHi = cfg.label.hi;

  switch (outcome) {
    case 'very_favorable':
      return {
        en: `The Prashna chart is highly auspicious for your ${catEn} question. ${ascLord.planet.name.en} as Lagna lord and Moon in ${moon.signName.en} both support a strongly positive outcome. Conditions are aligned in your favor — proceed with confidence.`,
        hi: `आपके ${catHi} प्रश्न के लिए प्रश्न कुण्डली अत्यन्त शुभ है। लग्नेश ${ascLord.planet.name.hi} और ${moon.signName.hi} में चन्द्र दोनों सशक्त शुभ परिणाम का समर्थन करते हैं। परिस्थितियां आपके अनुकूल हैं — विश्वासपूर्वक आगे बढ़ें।`,
        sa: `भवतः ${cfg.label.sa} प्रश्नार्थं कुण्डली अतिशुभा। लग्नेशः ${ascLord.planet.name.sa} चन्द्रश्च ${moon.signName.sa} राशौ शुभफलं समर्थयतः। विश्वासपूर्वकं प्रवर्तताम्।`,
      };
    case 'favorable':
      return {
        en: `The chart leans favorable for your ${catEn} question. ${ascLord.planet.name.en} and ${relLord.planet.name.en} indicate generally positive conditions, though some minor obstacles may arise. With focused effort, success is likely.`,
        hi: `${catHi} प्रश्न के लिए कुण्डली अनुकूल है। ${ascLord.planet.name.hi} और ${relLord.planet.name.hi} सामान्यतः शुभ परिस्थितियां दर्शाते हैं, हालांकि कुछ छोटी बाधाएं आ सकती हैं। केन्द्रित प्रयास से सफलता सम्भव है।`,
        sa: `${cfg.label.sa} प्रश्नार्थं कुण्डली अनुकूला। ${ascLord.planet.name.sa} ${relLord.planet.name.sa} च शुभपरिस्थितिं सूचयतः। प्रयत्नेन सिद्धिः सम्भवा।`,
      };
    case 'mixed':
      return {
        en: `The chart shows a mixed picture for your ${catEn} question. Both favorable and challenging factors are present. ${moon.signName.en} Moon suggests the outcome depends significantly on your actions and timing. Patience and adaptability will be key.`,
        hi: `${catHi} प्रश्न के लिए कुण्डली मिश्रित चित्र प्रस्तुत करती है। अनुकूल और प्रतिकूल दोनों कारक उपस्थित हैं। ${moon.signName.hi} में चन्द्र बताता है कि परिणाम आपके कर्मों और समय पर निर्भर करता है। धैर्य और अनुकूलन क्षमता महत्त्वपूर्ण होगी।`,
        sa: `${cfg.label.sa} प्रश्नार्थं कुण्डली मिश्रचित्रं प्रदर्शयति। अनुकूलप्रतिकूलौ कारकौ विद्यते। धैर्यं अनुकूलनक्षमता च मुख्यौ भविष्यतः।`,
      };
    case 'challenging':
      return {
        en: `The chart indicates challenges for your ${catEn} question. ${relLord.planet.name.en} (ruler of the relevant house) and Moon's condition suggest obstacles that require careful navigation. Success is possible but demands significant effort, patience, and perhaps a change of approach.`,
        hi: `${catHi} प्रश्न के लिए कुण्डली चुनौतियों का संकेत देती है। ${relLord.planet.name.hi} और चन्द्र की स्थिति बाधाओं की ओर इशारा करती है जिनमें सावधानी आवश्यक है। सफलता सम्भव है परन्तु महत्त्वपूर्ण प्रयास और धैर्य चाहिए।`,
        sa: `${cfg.label.sa} प्रश्नार्थं कुण्डली आव्हानानि सूचयति। ${relLord.planet.name.sa} चन्द्रस्थितिश्च विघ्नान् प्रदर्शयति। महत्प्रयत्नेन सिद्धिः सम्भवा।`,
      };
    case 'difficult':
      return {
        en: `The chart is unfavorable for your ${catEn} question at this time. Key indicators — ${ascLord.planet.name.en}, Moon, and ${relLord.planet.name.en} — are all challenged. This may not be the right time to pursue this matter. Consider waiting, seeking alternative approaches, or performing suggested remedies before proceeding.`,
        hi: `इस समय ${catHi} प्रश्न के लिए कुण्डली प्रतिकूल है। प्रमुख संकेतक — ${ascLord.planet.name.hi}, चन्द्र और ${relLord.planet.name.hi} — सभी पीड़ित हैं। यह इस विषय को आगे बढ़ाने का सही समय नहीं हो सकता। प्रतीक्षा करें या सुझाए गए उपाय करें।`,
        sa: `अस्मिन् समये ${cfg.label.sa} प्रश्नार्थं कुण्डली प्रतिकूला। प्रमुखसूचकाः सर्वे पीडिताः। प्रतीक्षा उपायाः वा कर्तव्याः।`,
      };
  }
}

/**
 * Generates the timing estimate for when the querent can expect results.
 *
 * Based on two classical indicators:
 * 1. **Moon's speed** (Prashna Marga Ch.7): The Moon's daily motion varies from
 *    ~11.8°/day (slow) to ~15.2°/day (fast). Fast Moon = quick manifestation;
 *    slow Moon = the matter takes time. Thresholds:
 *    - > 13.5°/day: days to 2 weeks
 *    - > 12.0°/day: weeks to 1 month
 *    - <= 12.0°/day: 1 to several months
 *    If the overall score is very negative (< -25), timing is declared uncertain
 *    regardless of Moon speed — a severely afflicted chart may not deliver at all.
 *
 * 2. **Vimshottari Dasha context**: Appends the current Mahadasha-Antardasha for
 *    additional temporal context (which planetary period is active).
 */
function buildTiming(moon: PlanetPosition, dashas: KundaliData['dashas'], score: number): LocaleText {
  const moonSpeed = Math.abs(moon.speed);
  let timingEn: string, timingHi: string;

  if (score < -25) {
    timingEn = 'Timing is uncertain. The chart suggests significant delays or the matter may not materialize as expected.';
    timingHi = 'समय अनिश्चित है। कुण्डली महत्त्वपूर्ण विलम्ब या विषय के अपेक्षित रूप से न होने का संकेत देती है।';
  } else if (moonSpeed > 13.5) {
    timingEn = 'The Moon is moving swiftly — results are likely within days to a couple of weeks. Act promptly to capitalize on the favorable momentum.';
    timingHi = 'चन्द्र तीव्र गति से चल रहा है — परिणाम कुछ दिनों से दो सप्ताह में सम्भव। अनुकूल गति का लाभ उठाने के लिए शीघ्र कार्य करें।';
  } else if (moonSpeed > 12) {
    timingEn = 'The Moon\'s moderate pace suggests results within weeks to a month. Steady, consistent effort will bring the outcome.';
    timingHi = 'चन्द्र की सामान्य गति सप्ताहों से एक मास में परिणाम का संकेत देती है। स्थिर, निरन्तर प्रयास परिणाम लाएगा।';
  } else {
    timingEn = 'The Moon is moving slowly — the matter may take one to several months to resolve. Patience is essential; do not rush.';
    timingHi = 'चन्द्र धीमी गति से चल रहा है — विषय को हल होने में एक से कई मास लग सकते हैं। धैर्य आवश्यक है।';
  }

  // Add dasha context
  const maha = dashas[0];
  if (maha) {
    const antar = maha.subPeriods?.[0];
    const dashaNote = antar
      ? `Currently running ${maha.planetName.en}-${antar.planetName.en} dasha period.`
      : `Currently in ${maha.planetName.en} Mahadasha.`;
    const dashaNoteHi = antar
      ? `वर्तमान में ${maha.planetName.hi}-${antar.planetName.hi} दशा काल चल रहा है।`
      : `वर्तमान में ${maha.planetName.hi} महादशा है।`;
    timingEn += ' ' + dashaNote;
    timingHi += ' ' + dashaNoteHi;
  }

  // Sanskrit text reuses Hindi for brevity — the timing narrative is long-form prose
  // that doesn't benefit from a distinct Sanskrit rendering.
  return { en: timingEn, hi: timingHi, sa: timingHi };
}

/**
 * Generates the actionable guidance paragraph.
 *
 * Three tiers of advice mapped to outcome severity:
 * - **Favourable** (very_favorable / favorable): "Proceed with confidence"
 * - **Mixed**: "Proceed with cautious optimism, gather more information"
 * - **Challenging/Difficult**: "Exercise patience, perform remedies, consider waiting"
 *
 * Each tier references the querent's specific planets to make the advice feel
 * personalised rather than boilerplate.
 */
function buildGuidance(
  outcome: PrashnaAnalysis['verdict']['outcome'],
  category: PrashnaCategory,
  ascLord: PlanetPosition,
  moon: PlanetPosition,
  relLord: PlanetPosition,
  cfg: typeof CATEGORY_CONFIG[PrashnaCategory],
): LocaleText {
  const catEn = cfg.label.en.toLowerCase();

  const base = outcome === 'very_favorable' || outcome === 'favorable'
    ? {
      en: `The chart supports moving forward with your ${catEn} matter. The strength of ${ascLord.planet.name.en} (your significator) and favorable Moon position indicate that your efforts are likely to bear fruit. Focus your energy now — the cosmic alignment is working in your favor.`,
      hi: `कुण्डली आपके ${cfg.label.hi} विषय में आगे बढ़ने का समर्थन करती है। ${ascLord.planet.name.hi} (आपका कारक) का बल और अनुकूल चन्द्र स्थिति बताती है कि आपके प्रयास फलदायी होंगे। अभी अपनी ऊर्जा केन्द्रित करें।`,
      sa: `कुण्डली भवतः ${cfg.label.sa} विषये प्रवर्तनं समर्थयति। ${ascLord.planet.name.sa} बलं शुभचन्द्रस्थितिश्च शुभफलं सूचयति।`,
    }
    : outcome === 'mixed'
    ? {
      en: `Proceed with cautious optimism regarding your ${catEn} question. The chart has both supportive and challenging elements. Pay special attention to ${moon.signName.en} Moon's areas — emotions, intuition, and timing matter greatly. Avoid hasty decisions; gather more information before committing.`,
      hi: `${cfg.label.hi} प्रश्न के विषय में सतर्क आशावाद के साथ आगे बढ़ें। कुण्डली में समर्थक और चुनौतीपूर्ण दोनों तत्व हैं। जल्दबाजी से बचें; प्रतिबद्ध होने से पहले अधिक जानकारी एकत्र करें।`,
      sa: `सावधानेन आशावादेन प्रवर्तताम्। कुण्डल्यां समर्थकप्रतिकूलतत्त्वानि विद्यन्ते।`,
    }
    : {
      en: `The chart advises patience and caution with your ${catEn} question. This may not be the optimal time to push forward aggressively. Consider strengthening your position, performing the suggested remedies, and waiting for more favorable conditions. The matter is not permanently blocked — timing adjustments can change the outcome.`,
      hi: `कुण्डली ${cfg.label.hi} प्रश्न में धैर्य और सावधानी की सलाह देती है। आक्रामक रूप से आगे बढ़ने का यह उचित समय नहीं है। सुझाए गए उपाय करें और अनुकूल परिस्थितियों की प्रतीक्षा करें। विषय स्थायी रूप से अवरुद्ध नहीं है।`,
      sa: `कुण्डली धैर्यं सावधानीं च उपदिशति। उपायान् कुर्यात् अनुकूलकालं प्रतीक्षेत च।`,
    };

  return base;
}

/**
 * Generates an ordered list of remedies (upayas) tailored to the Prashna result.
 *
 * Remedy structure (up to 3 remedies):
 * 1. **Weakest planet remedy**: Identifies the weakest among {Lagna Lord, Relevant
 *    House Lord, Moon}, then suggests the classical planetary remedy for that graha.
 *    Only applies to true planets (Sun through Saturn, ids 0-6) — Rahu/Ketu have
 *    separate traditions not covered here.
 * 2. **Category-specific remedy**: A fixed remedy tied to the question domain
 *    (e.g. Saraswati worship for education, Lakshmi-Kuber for finance).
 * 3. **General retry suggestion** (only for challenging/difficult outcomes):
 *    Advises re-casting the Prashna at a more auspicious muhurta (Brahma Muhurta
 *    or Abhijit Muhurta) after performing remedies.
 *
 * Planetary remedies follow standard Jyotish upaya traditions:
 * each planet is associated with a weekday, deity, mantra, and charitable action.
 */
function buildRemedies(
  outcome: PrashnaAnalysis['verdict']['outcome'],
  category: PrashnaCategory,
  relLord: PlanetPosition,
  moon: PlanetPosition,
  ascLord: PlanetPosition,
  cfg: typeof CATEGORY_CONFIG[PrashnaCategory],
): LocaleText[] {
  const remedies: LocaleText[] = [];

  // Planetary remedy lookup: planet ID → recommended worship, mantra, and charity.
  // Each maps the graha to its weekday lord tradition (e.g. Sun → Sunday → Surya Arghya).
  const lordRemedies: Record<number, LocaleText> = {
    0: { en: 'Offer water to the Sun at sunrise (Surya Arghya) and chant Aditya Hridayam.', hi: 'सूर्योदय पर सूर्य को अर्घ्य दें और आदित्य हृदयम् का पाठ करें।', sa: 'सूर्योदये सूर्याय अर्घ्यं दत्त्वा आदित्यहृदयं पठेत्।' },
    1: { en: 'Worship on Monday. Offer milk to Shiva Linga. Chant Om Chandraya Namah 108 times.', hi: 'सोमवार को पूजा करें। शिवलिंग पर दूध चढ़ाएं। ॐ चन्द्राय नमः 108 बार जपें।', sa: 'सोमवासरे पूजनं कुर्यात्। शिवलिङ्गे दुग्धं समर्पयेत्। ॐ चन्द्राय नमः 108 वारं जपेत्।' },
    2: { en: 'Worship Hanuman on Tuesdays. Chant Hanuman Chalisa. Donate red items.', hi: 'मंगलवार को हनुमान पूजा करें। हनुमान चालीसा पढ़ें। लाल वस्तुएं दान करें।', sa: 'मङ्गलवासरे हनुमत्पूजनम्। हनुमच्चालीसा पठनम्। रक्तवस्तूनि दानम्।' },
    3: { en: 'Worship Vishnu on Wednesdays. Chant Vishnu Sahasranama. Donate green items.', hi: 'बुधवार को विष्णु पूजा करें। विष्णु सहस्रनाम पढ़ें। हरी वस्तुएं दान करें।', sa: 'बुधवासरे विष्णुपूजनम्। विष्णुसहस्रनाम पठनम्।' },
    4: { en: 'Worship Guru (Brihaspati) on Thursdays. Visit a temple. Donate yellow items and turmeric.', hi: 'गुरुवार को बृहस्पति पूजा करें। मन्दिर जाएं। पीली वस्तुएं और हल्दी दान करें।', sa: 'गुरुवासरे बृहस्पतिपूजनम्। मन्दिरं गच्छेत्। पीतवस्तूनि हरिद्रां च दद्यात्।' },
    5: { en: 'Worship Lakshmi on Fridays. Chant Shri Suktam. Donate white items and sweets.', hi: 'शुक्रवार को लक्ष्मी पूजा करें। श्री सूक्तम् पढ़ें। सफ़ेद वस्तुएं और मिठाई दान करें।', sa: 'शुक्रवासरे लक्ष्मीपूजनम्। श्रीसूक्तं पठेत्। श्वेतवस्तूनि मिष्टान्नं च दद्यात्।' },
    6: { en: 'Worship Shani on Saturdays. Light sesame oil lamp. Donate black items and mustard oil.', hi: 'शनिवार को शनि पूजा करें। तिल तेल का दीपक जलाएं। काली वस्तुएं और सरसों का तेल दान करें।', sa: 'शनिवासरे शनिपूजनम्। तिलतैलदीपं प्रज्वालयेत्। कृष्णवस्तूनि सर्षपतैलं च दद्यात्।' },
  };

  // Find the weakest of the three key significators and suggest its remedy.
  // Sorted ascending by planetScore — index 0 is the most afflicted.
  const weakest = [ascLord, relLord, moon].sort((a, b) => planetScore(a) - planetScore(b))[0];
  if (weakest.planet.id <= 6 && lordRemedies[weakest.planet.id]) {
    remedies.push({
      en: `Strengthen ${weakest.planet.name.en} (currently ${dignityTri(weakest).en}): ${lordRemedies[weakest.planet.id].en}`,
      hi: `${weakest.planet.name.hi} को बलवान बनाएं (वर्तमान में ${dignityTri(weakest).hi}): ${lordRemedies[weakest.planet.id].hi}`,
      sa: `${weakest.planet.name.sa} बलं वर्धयेत् (${dignityTri(weakest).sa}): ${lordRemedies[weakest.planet.id].sa}`,
    });
  }

  // Category-specific remedies — fixed per question domain, independent of planetary state.
  // These draw from popular Hindu devotional traditions associated with each life domain.
  const catRemedies: Record<PrashnaCategory, LocaleText> = {
    general: { en: 'Perform Ganesha Puja to remove obstacles. Chant Om Gam Ganapataye Namah 108 times before starting any new endeavor.', hi: 'बाधा दूर करने के लिए गणेश पूजा करें। किसी नए कार्य से पहले ॐ गं गणपतये नमः 108 बार जपें।', sa: 'विघ्ननिवारणार्थं गणेशपूजनं कुर्यात्। ॐ गं गणपतये नमः 108 वारं जपेत्।' },
    career: { en: 'Light a lamp before Surya Yantra or Sun image every morning. Wear Ruby or Manik if Sun is your Lagna lord.', hi: 'प्रतिदिन सूर्य यन्त्र या सूर्य प्रतिमा के सामने दीपक जलाएं। यदि सूर्य लग्नेश है तो माणिक्य धारण करें।', sa: 'प्रतिदिनं सूर्ययन्त्रसमक्षं दीपं प्रज्वालयेत्।' },
    marriage: { en: 'Worship Gauri-Shankar together. Keep a pair of SwayamVar Parvati images. Chant Swayamvara Parvathi Mantra.', hi: 'गौरी-शंकर की जोड़ी पूजा करें। स्वयंवर पार्वती मन्त्र का जप करें।', sa: 'गौरीशङ्करपूजनं कुर्यात्। स्वयंवरपार्वतीमन्त्रं जपेत्।' },
    health: { en: 'Chant Mahamrityunjaya Mantra 108 times daily. Offer water on Shiva Linga. Maintain a sattvic diet.', hi: 'प्रतिदिन महामृत्युञ्जय मन्त्र 108 बार जपें। शिवलिंग पर जल चढ़ाएं। सात्विक आहार रखें।', sa: 'महामृत्युञ्जयमन्त्रं 108 वारं जपेत्। शिवलिङ्गे जलं समर्पयेत्।' },
    finance: { en: 'Worship Lakshmi-Kuber on Fridays and Dhanteras. Keep your workspace clean and organized. Chant Kubera Mantra.', hi: 'शुक्रवार और धनतेरस को लक्ष्मी-कुबेर पूजा करें। कार्यस्थल साफ़ और व्यवस्थित रखें।', sa: 'शुक्रवासरे धनतेरस्यां च लक्ष्मीकुबेरपूजनम्।' },
    travel: { en: 'Worship Lord Ganesha before starting the journey. Carry a small Hanuman idol for protection.', hi: 'यात्रा शुरू करने से पहले गणेश पूजा करें। सुरक्षा के लिए छोटी हनुमान मूर्ति रखें।', sa: 'यात्रारम्भात् पूर्वं गणेशपूजनं कुर्यात्।' },
    education: { en: 'Worship Saraswati on Wednesdays. Keep books and study area clean. Chant Saraswati Vandana before studying.', hi: 'बुधवार को सरस्वती पूजा करें। पुस्तकें और अध्ययन क्षेत्र साफ़ रखें।', sa: 'बुधवासरे सरस्वतीपूजनं कुर्यात्।' },
    legal: { en: 'Worship Hanuman for strength in legal battles. Visit Bhairav temple on Saturdays. Chant Baglamukhi Mantra for victory.', hi: 'कानूनी लड़ाई में बल के लिए हनुमान पूजा करें। शनिवार को भैरव मन्दिर जाएं।', sa: 'विधिविवादे बलार्थं हनुमत्पूजनम्। शनिवासरे भैरवमन्दिरं गच्छेत्।' },
  };

  remedies.push(catRemedies[category]);

  // For poor outcomes, suggest re-casting the Prashna at a more auspicious time.
  // Brahma Muhurta (96 min before sunrise) and Abhijit Muhurta (local noon ± 24 min)
  // are classically considered the most powerful times to ask questions.
  if (outcome === 'challenging' || outcome === 'difficult') {
    remedies.push({
      en: 'Consider casting another Prashna chart after performing remedies, at a more auspicious time (during Brahma Muhurta or Abhijit Muhurta).',
      hi: 'उपाय करने के बाद अधिक शुभ समय (ब्रह्म मुहूर्त या अभिजित मुहूर्त) में पुनः प्रश्न कुण्डली बनाने पर विचार करें।',
      sa: 'उपायान् कृत्वा शुभतरसमये (ब्रह्ममुहूर्ते अभिजिन्मुहूर्ते वा) पुनः प्रश्नकुण्डलीं रचयेत्।',
    });
  }

  return remedies;
}
