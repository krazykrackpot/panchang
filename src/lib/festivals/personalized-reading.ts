/**
 * Personalized Festival Reading — deterministic, rule-based engine.
 *
 * Given (festival slug, year, user's Moon rashi 1-12), produces a
 * 1-line transit summary + 1-line ritual recommendation that the
 * festival year page renders in the 12-rashi accordion (spec §4A).
 *
 * Pure function. No LLM. No I/O. Inputs uniquely determine output —
 * lets the page bake all 12 reads into the rendered HTML at ISR time
 * and stay SEO-visible.
 *
 * Method:
 *   1. Resolve the festival date for (slug, year) via the existing
 *      festival generator.
 *   2. Compute planetary positions at festival noon.
 *   3. For each slow planet (Jupiter, Saturn, Rahu) — and the festival's
 *      `primaryPlanet` from FESTIVAL_ASTRO_FOCUS — derive the *house
 *      from the user's rashi* (1 = user's rashi sign, 7 = opposite, etc.).
 *   4. Match the transit pattern to a template (6 templates today; spec
 *      §4A targets 12, but 6 cover the meaningful variation — adding
 *      more is additive).
 *   5. Render summary + ritual with slot-filling.
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4A
 */

import { dateToJD, getPlanetaryPositions, toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';
import { FESTIVAL_ASTRO_FOCUS } from './festival-astro-focus';
import type { PersonalizedFestivalReading, FestivalAstroFocus } from './types';
import type { LocaleText } from '@/types/panchang';

// ─── Planet ID convention (matches the rest of the codebase) ────────────────

const JUPITER_ID = 4;
const SATURN_ID = 6;
const RAHU_ID = 7;

// English names for slot-filling. Hindi counterparts live in the
// hi-side template strings (we don't translate planet names mid-sentence).
const PLANET_NAME_EN: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};
const PLANET_NAME_HI: Record<number, string> = {
  0: 'सूर्य', 1: 'चन्द्र', 2: 'मंगल', 3: 'बुध',
  4: 'गुरु', 5: 'शुक्र', 6: 'शनि', 7: 'राहु', 8: 'केतु',
};

// ─── House classification (Parashari conventional buckets) ──────────────────

const FAVORABLE_HOUSES = new Set([1, 5, 9, 11]);   // Kendra/Trikona success houses
const SUPPORTIVE_HOUSES = new Set([2, 4, 10]);      // Resources / home / career
const TESTING_HOUSES = new Set([6, 8, 12]);         // Dusthana — work, transformation, release
// 3 and 7 are "neutral/transition" — bucketed as supportive below.

function houseBucket(house: number): 'favorable' | 'supportive' | 'testing' {
  if (FAVORABLE_HOUSES.has(house)) return 'favorable';
  if (TESTING_HOUSES.has(house)) return 'testing';
  return 'supportive'; // 2,3,4,7,10
}

// ─── Distance from sign A to sign B counted as houses (1-12) ────────────────

function houseFromRashi(natalRashi: number, transitRashi: number): number {
  // 1-based: if natal === transit, house = 1.
  return ((transitRashi - natalRashi + 12) % 12) + 1;
}

// ─── Transit templates ──────────────────────────────────────────────────────
//
// Each template returns the literal LocaleText for summary + ritual.
// The slot variables are festival, planet name, house number, karaka.
// Hindi numerals stay Devanagari per project convention.

type TemplateContext = {
  /** Festival year being viewed — drives copy like "Diwali 2027 falls during...". */
  year: number;
  festivalNameEn: string;
  festivalNameHi: string;
  primaryPlanetId: number;
  primaryPlanetHouse: number;    // house from user's rashi
  primaryPlanetBucket: 'favorable' | 'supportive' | 'testing';
  jupiterHouse: number;
  jupiterBucket: 'favorable' | 'supportive' | 'testing';
  saturnHouse: number;
  saturnBucket: 'favorable' | 'supportive' | 'testing';
  karakaEn: string;
  karakaHi: string;
};

const NUM_HI: Record<number, string> = {
  1: 'प्रथम', 2: 'द्वितीय', 3: 'तृतीय', 4: 'चतुर्थ', 5: 'पञ्चम',
  6: 'षष्ठ', 7: 'सप्तम', 8: 'अष्टम', 9: 'नवम', 10: 'दशम', 11: 'एकादश', 12: 'द्वादश',
};

interface Template {
  id: string;
  /** True if this template fits the given context */
  match: (ctx: TemplateContext) => boolean;
  build: (ctx: TemplateContext) => { summary: LocaleText; ritual: LocaleText; relevantHouse: number };
}

// Templates are evaluated in order — the first match wins. So MORE
// SPECIFIC matches (double-alignment, specific houses) come BEFORE more
// general buckets. The 'default' template at the end always matches.
const TEMPLATES: Template[] = [
  // 1. Saturn + karaka both in testing houses — heaviest configuration (specific)
  //    Guard against karaka === Saturn so we don't render "Saturn and Saturn..."
  {
    id: 'saturn-and-karaka-testing',
    match: (c) => c.saturnBucket === 'testing' && c.primaryPlanetBucket === 'testing' && c.primaryPlanetId !== SATURN_ID,
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} ${c.year} arrives with both ${PLANET_NAME_EN[c.primaryPlanetId]} and Saturn passing through your testing houses (${ordinal(c.primaryPlanetHouse)} and ${ordinal(c.saturnHouse)}). The day's themes of ${c.karakaEn} ask for honesty, not enthusiasm.`,
        hi: `${c.festivalNameHi} ${c.year} के समय ${PLANET_NAME_HI[c.primaryPlanetId]} एवं शनि दोनों आपके परीक्षणकारी भावों (${NUM_HI[c.primaryPlanetHouse]} एवं ${NUM_HI[c.saturnHouse]}) में संक्रमित हैं। पर्व के ${c.karakaHi} विषय आज उत्साह नहीं, सच्चाई माँगते हैं।`,
      },
      ritual: {
        en: `Skip the elaborate puja. One honest sentence said aloud, one small act of dana to someone who actually needs it. That's the entire observance today.`,
        hi: `विस्तृत पूजा न करें। एक सच्चा वाक्य जो आप ऊँचे स्वर में कहें, एक छोटा सा दान वास्तव में जरूरतमंद को। आज का सम्पूर्ण व्रत यही है।`,
      },
      relevantHouse: c.saturnHouse,
    }),
  },

  // 2. Both Jupiter and karaka in favorable houses — best alignment (specific)
  //    Guard against karaka === Jupiter so we don't render "Jupiter and Jupiter..."
  {
    id: 'jupiter-and-karaka-favorable',
    match: (c) => c.jupiterBucket === 'favorable' && c.primaryPlanetBucket === 'favorable' && c.primaryPlanetId !== JUPITER_ID,
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} ${c.year} lands during a rare double alignment for you — Jupiter in your ${ordinal(c.jupiterHouse)} house and ${PLANET_NAME_EN[c.primaryPlanetId]} in your ${ordinal(c.primaryPlanetHouse)}. Both pushing in the festival's direction.`,
        hi: `${c.festivalNameHi} ${c.year} आपके लिए एक दुर्लभ द्वैध संरेखण के साथ आता है — गुरु आपके ${NUM_HI[c.jupiterHouse]} भाव में, एवं ${PLANET_NAME_HI[c.primaryPlanetId]} आपके ${NUM_HI[c.primaryPlanetHouse]} में। दोनों पर्व की दिशा में।`,
      },
      ritual: {
        en: `Take a full sankalpa this year — a one-year commitment around ${c.karakaEn} written down and witnessed by someone. This alignment supports follow-through.`,
        hi: `इस वर्ष पूर्ण संकल्प लें — ${c.karakaHi} के विषय में एक वर्ष का संकल्प लिखकर किसी एक के सामने रखें। यह संरेखण उसके पालन को बल देता है।`,
      },
      relevantHouse: c.primaryPlanetHouse,
    }),
  },

  // 3. Festival karaka planet in a favorable house (1/5/9/11) — strong support
  {
    id: 'karaka-favorable',
    match: (c) => c.primaryPlanetBucket === 'favorable',
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} falls while ${PLANET_NAME_EN[c.primaryPlanetId]} — the festival's main karaka — transits your ${ordinal(c.primaryPlanetHouse)} house. This is an unusually direct alignment with your ${c.karakaEn}.`,
        hi: `${c.festivalNameHi} के समय इस पर्व का मुख्य कारक ${PLANET_NAME_HI[c.primaryPlanetId]} आपके ${NUM_HI[c.primaryPlanetHouse]} भाव में गोचर कर रहा है। यह आपकी ${c.karakaHi} के साथ असाधारण रूप से सीधा मेल है।`,
      },
      ritual: {
        en: `Lean into the festival's intent fully — the ritual will land. Donate something meaningful to your ${c.karakaEn} (food, books, time) as a thank-you for the alignment.`,
        hi: `इस पर्व के संकल्प में पूर्ण भाव से उतरें — अनुष्ठान का प्रभाव दृढ़ होगा। आपकी ${c.karakaHi} से सम्बन्धित कोई सार्थक दान करें (अन्न, पुस्तक, समय) — संरेखण के प्रति आभार।`,
      },
      relevantHouse: c.primaryPlanetHouse,
    }),
  },

  // 2. Festival karaka planet in a testing house (6/8/12) — work-through
  {
    id: 'karaka-testing',
    match: (c) => c.primaryPlanetBucket === 'testing',
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} arrives while ${PLANET_NAME_EN[c.primaryPlanetId]} transits your ${ordinal(c.primaryPlanetHouse)} house — a quieter, more reflective placement for ${c.karakaEn}. The festival's energy is real but routed through inner work.`,
        hi: `${c.festivalNameHi} के समय ${PLANET_NAME_HI[c.primaryPlanetId]} आपके ${NUM_HI[c.primaryPlanetHouse]} भाव में गोचर कर रहा है — ${c.karakaHi} के लिए शान्त एवं आत्मनिरीक्षणात्मक स्थिति। पर्व की ऊर्जा वास्तविक है किन्तु आन्तरिक कार्य के माध्यम से प्रकट होगी।`,
      },
      ritual: {
        en: `Observe with intent but skip the showmanship. A small private puja or quiet act of dana around the theme of ${c.karakaEn} will outweigh public display this year.`,
        hi: `संकल्प के साथ अनुष्ठान करें किन्तु प्रदर्शन से बचें। ${c.karakaHi} के विषय पर एक छोटी निजी पूजा या मौन दान इस वर्ष सार्वजनिक प्रदर्शन से अधिक प्रभावी होगा।`,
      },
      relevantHouse: c.primaryPlanetHouse,
    }),
  },

  // 3. Jupiter transiting a favorable house (and karaka isn't already favorable)
  {
    id: 'jupiter-favorable',
    match: (c) => c.jupiterBucket === 'favorable' && c.primaryPlanetBucket !== 'favorable',
    build: (c) => ({
      summary: {
        en: `Jupiter — the great benefic — is transiting your ${ordinal(c.jupiterHouse)} house during ${c.festivalNameEn} ${c.year}, lending its protective umbrella to whatever you commit on this day.`,
        hi: `${c.festivalNameHi} के दौरान महाशुभ ग्रह गुरु आपके ${NUM_HI[c.jupiterHouse]} भाव में गोचर कर रहा है — इस दिन आप जो भी संकल्प लेंगे, उस पर गुरु की रक्षात्मक छाया रहेगी।`,
      },
      ritual: {
        en: `Set a one-line resolution before the puja — Jupiter's benefic transit gives intent extra durability this festival.`,
        hi: `पूजा से पहले एक पंक्ति का संकल्प लें — गुरु का शुभ गोचर इस पर्व पर संकल्प को अतिरिक्त स्थायित्व देगा।`,
      },
      relevantHouse: c.jupiterHouse,
    }),
  },

  // 4. Saturn transiting a testing house (with no Jupiter cushion)
  {
    id: 'saturn-testing',
    match: (c) => c.saturnBucket === 'testing' && c.jupiterBucket !== 'favorable',
    build: (c) => ({
      summary: {
        en: `Saturn is transiting your ${ordinal(c.saturnHouse)} house during ${c.festivalNameEn} — a slower, more deliberate context for the festival's themes of ${c.karakaEn}.`,
        hi: `${c.festivalNameHi} के समय शनि आपके ${NUM_HI[c.saturnHouse]} भाव में गोचर कर रहा है — पर्व के ${c.karakaHi} विषय के लिए धीमी एवं विचारशील पृष्ठभूमि।`,
      },
      ritual: {
        en: `Keep the puja simple and structured. Saturn rewards consistency over flourish — finish what you start, even if it's a smaller observance than usual.`,
        hi: `पूजा सरल एवं संरचित रखें। शनि निरन्तरता को पुरस्कृत करता है, न कि आडम्बर को — जो प्रारम्भ करें उसे पूर्ण करें, भले ही अनुष्ठान सामान्य से छोटा हो।`,
      },
      relevantHouse: c.saturnHouse,
    }),
  },

  // 5-8. House-specific templates — MUST come before karaka-supportive
  //      since houses 2, 4, 7, 10 all fall in the 'supportive' bucket
  //      (per houseBucket) and karaka-supportive would otherwise match
  //      first and short-circuit these (caught by Gemini PR #275 review).

  // 5. Karaka in your 2nd house — wealth, family, voice
  {
    id: 'karaka-second-house',
    match: (c) => c.primaryPlanetHouse === 2,
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} finds ${PLANET_NAME_EN[c.primaryPlanetId]} crossing your 2nd house — accumulated wealth, immediate family, the voice you speak with. The festival's ${c.karakaEn} theme touches these specifically this year.`,
        hi: `${c.festivalNameHi} के समय ${PLANET_NAME_HI[c.primaryPlanetId]} आपके द्वितीय भाव से गुज़र रहा है — सञ्चित धन, निकटतम परिवार, आपकी वाणी। पर्व का ${c.karakaHi} विषय इस वर्ष इन्हीं को विशेष रूप से छूता है।`,
      },
      ritual: {
        en: `Offer the puja at the family altar (gher-altar) if you have one, and include something said aloud — a stotra, a one-line declaration, or a thank-you to a family member.`,
        hi: `यदि घर में पूजा-स्थान है तो वहीं अर्पण करें, एवं कुछ ऊँचे स्वर से कहें — एक स्तोत्र, एक पंक्ति का घोषण, अथवा परिवार के किसी सदस्य को धन्यवाद।`,
      },
      relevantHouse: 2,
    }),
  },

  // 8. Karaka in your 4th — strong home/foundation focus
  {
    id: 'karaka-fourth-house',
    match: (c) => c.primaryPlanetHouse === 4,
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} finds ${PLANET_NAME_EN[c.primaryPlanetId]} transiting your 4th house — home, hearth, foundation. The festival's themes of ${c.karakaEn} are best routed through your domestic life this year.`,
        hi: `${c.festivalNameHi} के समय ${PLANET_NAME_HI[c.primaryPlanetId]} आपके चतुर्थ भाव में संक्रमित है — गृह, मूल आधार। पर्व के ${c.karakaHi} विषय इस वर्ष आपके घरेलू जीवन के माध्यम से सर्वोत्तम प्रकट होंगे।`,
      },
      ritual: {
        en: `Perform the puja at home with at least one family member present, even briefly. The 4th-house transit asks for shared space, not solo observance.`,
        hi: `पूजा घर पर परिवार के कम से कम एक सदस्य की उपस्थिति में करें, चाहे संक्षेप में। चतुर्थ भाव गोचर एकल अनुष्ठान नहीं, साझा स्थान माँगता है।`,
      },
      relevantHouse: 4,
    }),
  },

  // 9. Karaka in your 7th — partnerships in focus
  {
    id: 'karaka-seventh-house',
    match: (c) => c.primaryPlanetHouse === 7,
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} arrives with ${PLANET_NAME_EN[c.primaryPlanetId]} in your 7th house — partnerships, spouse, public-facing relationships. The festival's blessing flows through these channels this year.`,
        hi: `${c.festivalNameHi} के समय ${PLANET_NAME_HI[c.primaryPlanetId]} आपके सप्तम भाव में है — साझेदारी, जीवनसाथी, सार्वजनिक सम्बन्ध। इस वर्ष पर्व का आशीर्वाद इन्हीं माध्यमों से प्रवाहित होगा।`,
      },
      ritual: {
        en: `Perform the puja jointly with your spouse or business partner if available; otherwise call one person and acknowledge the partnership before the puja begins.`,
        hi: `यदि उपलब्ध हों तो जीवनसाथी या व्यापारिक साथी के साथ संयुक्त पूजा करें; अन्यथा पूजा से पूर्व एक व्यक्ति को फोन कर साझेदारी का स्मरण करें।`,
      },
      relevantHouse: 7,
    }),
  },

  // 8. Karaka in your 10th — career/public-life focus
  {
    id: 'karaka-tenth-house',
    match: (c) => c.primaryPlanetHouse === 10,
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} finds ${PLANET_NAME_EN[c.primaryPlanetId]} crossing your 10th house — career, public reputation, your work in the world. The festival's themes of ${c.karakaEn} align with what you do for a living this year.`,
        hi: `${c.festivalNameHi} के समय ${PLANET_NAME_HI[c.primaryPlanetId]} आपके दशम भाव से गुज़र रहा है — कैरियर, यश, संसार में आपका कार्य। पर्व के ${c.karakaHi} विषय इस वर्ष आपकी आजीविका से जुड़ते हैं।`,
      },
      ritual: {
        en: `Include your workplace in the day's observance — a small lamp at your desk, or one work-related dana (anonymous payment of a junior colleague's chai, a recommendation written without being asked).`,
        hi: `कार्यस्थल को आज के व्रत में सम्मिलित करें — मेज़ पर एक छोटा दीप, अथवा कार्य-सम्बद्ध एक दान (किसी कनिष्ठ सहकर्मी की चाय बिना नाम बताए, या बिना माँगे लिखी अनुशंसा)।`,
      },
      relevantHouse: 10,
    }),
  },

  // 9. Karaka planet in any other supportive house (3 — siblings/effort) —
  //    catches the supportive bucket after 2/4/7/10 above have fired.
  {
    id: 'karaka-supportive',
    match: (c) => c.primaryPlanetBucket === 'supportive',
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} arrives with ${PLANET_NAME_EN[c.primaryPlanetId]} transiting your ${ordinal(c.primaryPlanetHouse)} house — a workable, day-to-day placement for ${c.karakaEn}.`,
        hi: `${c.festivalNameHi} के समय ${PLANET_NAME_HI[c.primaryPlanetId]} आपके ${NUM_HI[c.primaryPlanetHouse]} भाव में है — ${c.karakaHi} के लिए सामान्य एवं प्रयोज्य स्थिति।`,
      },
      ritual: {
        en: `A traditional observance is appropriate — nothing extra needed. Read aloud one line of the festival's classical text during the puja.`,
        hi: `परम्परागत अनुष्ठान ही पर्याप्त है — अतिरिक्त की आवश्यकता नहीं। पूजा के समय पर्व से सम्बन्धित शास्त्रीय ग्रन्थ की एक पंक्ति का उच्चारण करें।`,
      },
      relevantHouse: c.primaryPlanetHouse,
    }),
  },

  // 10. Default — no strong signal; honor the festival's general meaning
  {
    id: 'default',
    match: () => true,
    build: (c) => ({
      summary: {
        en: `${c.festivalNameEn} celebrates ${c.karakaEn}. With no major slow-planet transit pulling on your chart today, the festival's general meaning is accessible — meet it on its own terms.`,
        hi: `${c.festivalNameHi} ${c.karakaHi} का उत्सव है। आज आपकी कुण्डली पर कोई बड़ा मन्दगति गोचर सक्रिय नहीं है — पर्व का सामान्य अर्थ सुलभ है, इसे अपने रूप में स्वीकार करें।`,
      },
      ritual: {
        en: `A simple lamp + intentional minute of silence at the start of the puja. Let the tradition do its own work today.`,
        hi: `पूजा के आरम्भ में एक दीप एवं एक मिनट का सङ्कल्पपूर्वक मौन। आज परम्परा को अपना कार्य करने दें।`,
      },
      relevantHouse: 1,
    }),
  },
];

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Compute the personalized reading for a (festival, year, rashi) triple.
 *
 * The caller (festival year page) already resolves the festival date via
 * the existing tithi-table + Kala-Vyapti pipeline; this engine takes that
 * resolved date as an input rather than re-running the festival generator
 * (which would need location + tz arguments). Keeps the engine pure.
 *
 * Returns null if the festival isn't in FESTIVAL_ASTRO_FOCUS — the caller
 * should skip rendering the widget in that case.
 */
export function computePersonalizedReading(
  festivalSlug: string,
  year: number,
  rashi: number,
  /** Festival calendar date in YYYY-MM-DD form — resolved by the caller */
  festivalDate: string,
): PersonalizedFestivalReading | null {
  const focus = FESTIVAL_ASTRO_FOCUS[festivalSlug];
  if (!focus) return null;
  if (rashi < 1 || rashi > 12) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(festivalDate)) return null;

  // Compute planetary positions at festival noon UT. The tithi-window
  // observance time is location-dependent, but for the user's rashi
  // (which is a 30° sidereal span) the planets' rashi at noon UT vs
  // their local sunrise is identical except for the Moon at the very
  // edge of a sign change — and we don't use the Moon's transit in
  // any of the templates.
  const [yyyy, mm, dd] = festivalDate.split('-').map(Number);
  const jd = dateToJD(yyyy, mm, dd, 12);
  const planets = getPlanetaryPositions(jd);

  // 3. Sidereal rashis for the relevant planets.
  const rashiOf = (planetId: number): number => {
    const p = planets.find((pp) => pp.id === planetId);
    if (!p) return 1;
    const sidLong = toSidereal(p.longitude, jd);
    return getRashiNumber(sidLong);
  };

  const primaryRashi = rashiOf(focus.primaryPlanet);
  const jupiterRashi = rashiOf(JUPITER_ID);
  const saturnRashi = rashiOf(SATURN_ID);
  // Rahu rashi computed but unused for now — kept ready for the template-12 expansion.
  rashiOf(RAHU_ID);

  const primaryHouse = houseFromRashi(rashi, primaryRashi);
  const jupiterHouse = houseFromRashi(rashi, jupiterRashi);
  const saturnHouse = houseFromRashi(rashi, saturnRashi);

  // 4. Build context + pick the first matching template.
  const ctx: TemplateContext = {
    year,
    festivalNameEn: prettyName(festivalSlug, 'en'),
    festivalNameHi: prettyName(festivalSlug, 'hi'),
    primaryPlanetId: focus.primaryPlanet,
    primaryPlanetHouse: primaryHouse,
    primaryPlanetBucket: houseBucket(primaryHouse),
    jupiterHouse,
    jupiterBucket: houseBucket(jupiterHouse),
    saturnHouse,
    saturnBucket: houseBucket(saturnHouse),
    karakaEn: focus.karakaLabel.en ?? focus.karaka,
    karakaHi: focus.karakaLabel.hi ?? focus.karakaLabel.en ?? focus.karaka,
  };

  const template = TEMPLATES.find((t) => t.match(ctx))!; // 'default' always matches
  const built = template.build(ctx);

  return {
    festival: festivalSlug,
    year,
    rashi,
    summary: built.summary,
    ritual: built.ritual,
    relevantHouse: built.relevantHouse,
    templateId: template.id,
  };
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

/**
 * Slug → human display name. For now derives directly from the slug
 * (capitalize-hyphens). Future: read from FESTIVAL_DETAILS for canonical
 * names — but FESTIVAL_DETAILS isn't always populated for every slug,
 * so the slug-derivation is the safe fallback.
 */
function prettyName(slug: string, locale: 'en' | 'hi'): string {
  // Curated list — fall back to slug-titlecase if missing.
  const EN_NAMES: Record<string, string> = {
    'diwali': 'Diwali',
    'dhanteras': 'Dhanteras',
    'holi': 'Holi',
    'maha-shivaratri': 'Maha Shivaratri',
    'ram-navami': 'Ram Navami',
    'janmashtami': 'Janmashtami',
    'ganesh-chaturthi': 'Ganesh Chaturthi',
    'dussehra': 'Dussehra',
    'raksha-bandhan': 'Raksha Bandhan',
    'narak-chaturdashi': 'Narak Chaturdashi',
    'govardhan-puja': 'Govardhan Puja',
    'bhai-dooj': 'Bhai Dooj',
    'hanuman-jayanti': 'Hanuman Jayanti',
    'akshaya-tritiya': 'Akshaya Tritiya',
    'guru-purnima': 'Guru Purnima',
    'vasant-panchami': 'Vasant Panchami',
    'holika-dahan': 'Holika Dahan',
    'hartalika-teej': 'Hartalika Teej',
    'chhath-puja': 'Chhath Puja',
    'makar-sankranti': 'Makar Sankranti',
  };
  const HI_NAMES: Record<string, string> = {
    'diwali': 'दीपावली',
    'dhanteras': 'धनतेरस',
    'holi': 'होली',
    'maha-shivaratri': 'महा शिवरात्रि',
    'ram-navami': 'राम नवमी',
    'janmashtami': 'जन्माष्टमी',
    'ganesh-chaturthi': 'गणेश चतुर्थी',
    'dussehra': 'दशहरा',
    'raksha-bandhan': 'रक्षा बन्धन',
    'narak-chaturdashi': 'नरक चतुर्दशी',
    'govardhan-puja': 'गोवर्धन पूजा',
    'bhai-dooj': 'भाई दूज',
    'hanuman-jayanti': 'हनुमान जयन्ती',
    'akshaya-tritiya': 'अक्षय तृतीया',
    'guru-purnima': 'गुरु पूर्णिमा',
    'vasant-panchami': 'वसन्त पञ्चमी',
    'holika-dahan': 'होलिका दहन',
    'hartalika-teej': 'हरतालिका तीज',
    'chhath-puja': 'छठ पूजा',
    'makar-sankranti': 'मकर सङ्क्रान्ति',
  };
  if (locale === 'hi') return HI_NAMES[slug] ?? slug;
  return EN_NAMES[slug] ?? slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

// FestivalAstroFocus is re-exported for tests that want to round-trip.
export type { FestivalAstroFocus };
