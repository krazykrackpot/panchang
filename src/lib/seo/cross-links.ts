/**
 * Cross-link map: Learn ↔ Tool relationships for internal linking.
 *
 * Every tool page should link to its related learn pages ("Deepen Your Knowledge")
 * and every learn page should link to its related tool pages ("Try the Tool").
 *
 * This is the SINGLE source of truth — consumed by the <RelatedLinks> component.
 */

export interface CrossLinkEntry {
  /** Display label (English — will be looked up by locale at render time) */
  label: string;
  /** Route path (without locale prefix, e.g. "/sade-sati" or "/learn/rashis") */
  href: string;
  /** Short description for the link pill */
  description?: string;
}

/**
 * For each TOOL page, which LEARN pages are related.
 * Key = tool route (without locale prefix).
 */
export const TOOL_TO_LEARN: Record<string, CrossLinkEntry[]> = {
  '/panchang': [
    { label: 'Learn Tithis', href: '/learn/tithis', description: 'Lunar day theory' },
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
    { label: 'Learn Muhurtas', href: '/learn/muhurtas', description: 'Auspicious timing theory' },
    { label: 'Learn Yogas', href: '/learn/yogas', description: 'Luni-solar combinations' },
    { label: 'Learn Karanas', href: '/learn/karanas', description: 'Half-tithi divisions' },
  ],
  '/kundali': [
    { label: 'Learn Kundali', href: '/learn/kundali', description: 'Birth chart fundamentals' },
    { label: 'Learn Dashas', href: '/learn/dashas', description: 'Planetary period systems' },
    { label: 'Learn Yogas', href: '/learn/yogas', description: 'Planetary combinations' },
    { label: 'Learn Doshas', href: '/learn/doshas', description: 'Afflictions in a chart' },
    { label: 'Learn Shadbala', href: '/learn/shadbala', description: 'Six-fold strength' },
  ],
  '/rahu-kaal': [
    { label: 'Learn Muhurtas', href: '/learn/muhurtas', description: 'Auspicious timing theory' },
    { label: 'Learn Hora', href: '/learn/hora', description: 'Planetary hour system' },
    { label: 'Learn Vara', href: '/learn/vara', description: 'Weekday lords' },
  ],
  '/choghadiya': [
    { label: 'Learn Muhurtas', href: '/learn/muhurtas', description: 'Auspicious timing theory' },
    { label: 'Learn Hora', href: '/learn/hora', description: 'Planetary hour system' },
    { label: 'Learn Vara', href: '/learn/vara', description: 'Weekday lords' },
  ],
  '/hora': [
    { label: 'Learn Hora', href: '/learn/hora', description: 'Planetary hour system' },
    { label: 'Learn Muhurtas', href: '/learn/muhurtas', description: 'Auspicious timing theory' },
  ],
  '/sign-calculator': [
    { label: 'Learn Rashis', href: '/learn/rashis', description: '12 zodiac signs' },
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
    { label: 'Learn Ayanamsha', href: '/learn/ayanamsha', description: 'Sidereal vs tropical' },
  ],
  '/sade-sati': [
    { label: 'Learn Sade Sati', href: '/learn/sade-sati', description: "Saturn's 7.5-year transit" },
    { label: 'Learn Grahas', href: '/learn/grahas', description: 'Nine celestial bodies' },
    { label: 'Learn Transits', href: '/learn/transit-guide', description: 'Planetary transit theory' },
  ],
  '/kaal-sarp': [
    { label: 'Learn Doshas', href: '/learn/doshas', description: 'Afflictions in a chart' },
    { label: 'Learn Doshas (Detailed)', href: '/learn/doshas-detailed', description: 'Deep dosha analysis' },
    { label: 'Learn Remedies', href: '/learn/remedies', description: 'Vedic remedial measures' },
  ],
  '/mangal-dosha': [
    { label: 'Learn Doshas (Detailed)', href: '/learn/doshas-detailed', description: 'Deep dosha analysis' },
    { label: 'Learn Matching', href: '/learn/matching', description: 'Compatibility basics' },
    { label: 'Learn Marriage', href: '/learn/marriage', description: 'Marriage astrology' },
    { label: 'Learn Remedies', href: '/learn/remedies', description: 'Vedic remedial measures' },
  ],
  '/pitra-dosha': [
    { label: 'Learn Doshas', href: '/learn/doshas', description: 'Afflictions in a chart' },
    { label: 'Learn Remedies', href: '/learn/remedies', description: 'Vedic remedial measures' },
  ],
  '/matching': [
    { label: 'Learn Matching', href: '/learn/matching', description: 'Ashta Kuta basics' },
    { label: 'Learn Compatibility', href: '/learn/compatibility', description: 'Compatibility science' },
    { label: 'Learn Compatibility (Advanced)', href: '/learn/compatibility-advanced', description: 'Beyond Ashta Kuta' },
    { label: 'Learn Marriage', href: '/learn/marriage', description: 'Marriage astrology' },
  ],
  '/prashna': [
    { label: 'Learn Kundali', href: '/learn/kundali', description: 'Birth chart fundamentals' },
    { label: 'Learn Lagna', href: '/learn/lagna', description: 'Ascendant significance' },
  ],
  '/prashna-ashtamangala': [
    { label: 'Learn Kundali', href: '/learn/kundali', description: 'Birth chart fundamentals' },
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
  ],
  '/baby-names': [
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
    { label: 'Learn Nakshatra Pada', href: '/learn/nakshatra-pada', description: 'Quarter divisions' },
  ],
  '/varshaphal': [
    { label: 'Learn Planets', href: '/learn/planets', description: 'Planetary significations' },
    { label: 'Learn Dashas', href: '/learn/dashas', description: 'Planetary period systems' },
    { label: 'Learn Kundali', href: '/learn/kundali', description: 'Birth chart fundamentals' },
  ],
  '/tithi-pravesha': [
    { label: 'Learn Tithis', href: '/learn/tithis', description: 'Lunar day theory' },
    { label: 'Learn Masa', href: '/learn/masa', description: 'Hindu months' },
  ],
  '/kp-system': [
    { label: 'Learn Kundali', href: '/learn/kundali', description: 'Birth chart fundamentals' },
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
    { label: 'Learn Dashas', href: '/learn/dashas', description: 'Planetary period systems' },
  ],
  '/nadi-jyotish': [
    { label: 'Learn Nadi Amsha', href: '/learn/nadi-amsha', description: 'Nadi division system' },
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
  ],
  '/medical-astrology': [
    { label: 'Learn Ayurveda-Jyotish', href: '/learn/ayurveda-jyotish', description: 'Health & planets' },
    { label: 'Learn Remedies', href: '/learn/remedies', description: 'Vedic remedial measures' },
    { label: 'Learn Health', href: '/learn/health', description: 'Health in the chart' },
  ],
  '/financial-astrology': [
    { label: 'Learn Wealth', href: '/learn/wealth', description: 'Wealth indicators' },
    { label: 'Learn Career', href: '/learn/career', description: 'Career in the chart' },
    { label: 'Learn Transits', href: '/learn/transit-guide', description: 'Planetary transit theory' },
  ],
  '/cosmic-blueprint': [
    { label: 'Learn Birth Chart', href: '/learn/birth-chart', description: 'Chart fundamentals' },
    { label: 'Learn Lagna', href: '/learn/lagna', description: 'Ascendant significance' },
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
  ],
  '/retrograde': [
    { label: 'Learn Retrograde Effects', href: '/learn/retrograde-effects', description: 'Retrograde planets' },
    { label: 'Learn Retrograde Visualizer', href: '/learn/retrograde-visualizer', description: 'See retrograde motion' },
    { label: 'Learn Grahas', href: '/learn/grahas', description: 'Nine celestial bodies' },
  ],
  '/transit-playground': [
    { label: 'Learn Transits', href: '/learn/transit-guide', description: 'Planetary transit theory' },
    { label: 'Learn Gochar', href: '/learn/gochar', description: 'Transit predictions' },
    { label: 'Learn Sade Sati', href: '/learn/sade-sati', description: "Saturn's 7.5-year transit" },
  ],
  '/tropical-compare': [
    { label: 'Learn Ayanamsha', href: '/learn/ayanamsha', description: 'Sidereal vs tropical' },
    { label: 'Learn Rashis', href: '/learn/rashis', description: '12 zodiac signs' },
  ],
  '/sign-shift': [
    { label: 'Learn Ayanamsha', href: '/learn/ayanamsha', description: 'Sidereal vs tropical' },
    { label: 'Learn Rashis', href: '/learn/rashis', description: '12 zodiac signs' },
  ],
  '/sky': [
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
    { label: 'Learn Grahas', href: '/learn/grahas', description: 'Nine celestial bodies' },
    { label: 'Learn Cosmology', href: '/learn/cosmology', description: 'Vedic cosmology' },
  ],
  '/sky-map': [
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
    { label: 'Learn Grahas', href: '/learn/grahas', description: 'Nine celestial bodies' },
  ],
  '/sarvatobhadra': [
    { label: 'Learn Nakshatras', href: '/learn/nakshatras', description: '27 lunar mansions' },
    { label: 'Learn Transits', href: '/learn/transit-guide', description: 'Planetary transit theory' },
  ],
  '/upagraha': [
    { label: 'Learn Grahas', href: '/learn/grahas', description: 'Nine celestial bodies' },
    { label: 'Learn Sphutas', href: '/learn/sphutas', description: 'Sensitive points' },
  ],
  '/horoscope': [
    { label: 'Learn Rashis', href: '/learn/rashis', description: '12 zodiac signs' },
    { label: 'Learn Planets', href: '/learn/planets', description: 'Planetary significations' },
    { label: 'Learn Transits', href: '/learn/transit-guide', description: 'Planetary transit theory' },
  ],
  '/muhurta-ai': [
    { label: 'Learn Muhurtas', href: '/learn/muhurtas', description: 'Auspicious timing theory' },
    { label: 'Learn Hora', href: '/learn/hora', description: 'Planetary hour system' },
    { label: 'Learn Tithis', href: '/learn/tithis', description: 'Lunar day theory' },
  ],
  '/muhurta': [
    { label: 'Learn Muhurtas', href: '/learn/muhurtas', description: 'Auspicious timing theory' },
    { label: 'Learn Hora', href: '/learn/hora', description: 'Planetary hour system' },
  ],
  '/muhurat': [
    { label: 'Learn Muhurtas', href: '/learn/muhurtas', description: 'Auspicious timing theory' },
    { label: 'Learn Hora', href: '/learn/hora', description: 'Planetary hour system' },
  ],
  '/mundane': [
    { label: 'Learn Cosmology', href: '/learn/cosmology', description: 'Vedic cosmology' },
    { label: 'Learn Eclipses', href: '/learn/eclipses', description: 'Eclipse astrology' },
  ],
  '/dinacharya': [
    { label: 'Learn Ayurveda-Jyotish', href: '/learn/ayurveda-jyotish', description: 'Health & planets' },
    { label: 'Learn Hora', href: '/learn/hora', description: 'Planetary hour system' },
  ],
  '/vedic-time': [
    { label: 'Learn Vara', href: '/learn/vara', description: 'Weekday lords' },
    { label: 'Learn Muhurtas', href: '/learn/muhurtas', description: 'Auspicious timing theory' },
  ],
  '/kaal-nirnaya': [
    { label: 'Learn Muhurtas', href: '/learn/muhurtas', description: 'Auspicious timing theory' },
    { label: 'Learn Tithis', href: '/learn/tithis', description: 'Lunar day theory' },
  ],
  '/lunar-calendar': [
    { label: 'Learn Tithis', href: '/learn/tithis', description: 'Lunar day theory' },
    { label: 'Learn Masa', href: '/learn/masa', description: 'Hindu months' },
    { label: 'Learn Adhika Masa', href: '/learn/adhika-masa', description: 'Intercalary months' },
  ],
};

/**
 * For each LEARN page, which TOOL pages are related.
 * Key = learn route (without locale prefix).
 */
export const LEARN_TO_TOOL: Record<string, CrossLinkEntry[]> = {
  '/learn/rashis': [
    { label: 'Rashi Calculator', href: '/sign-calculator', description: 'Find your Vedic sign' },
    { label: 'Horoscope', href: '/horoscope', description: 'Daily/weekly/monthly' },
    { label: 'Tropical Compare', href: '/tropical-compare', description: 'Sidereal vs tropical' },
  ],
  '/learn/nakshatras': [
    { label: 'Baby Names', href: '/baby-names', description: 'Names by birth nakshatra' },
    { label: 'Live Sky', href: '/sky', description: 'See nakshatras in the sky' },
    { label: 'Sarvatobhadra', href: '/sarvatobhadra', description: '28-nakshatra chakra' },
  ],
  '/learn/nakshatra-pada': [
    { label: 'Baby Names', href: '/baby-names', description: 'Names by birth nakshatra' },
    { label: 'Kundali', href: '/kundali', description: 'Full birth chart' },
  ],
  '/learn/tithis': [
    { label: 'Tithi Pravesha', href: '/tithi-pravesha', description: 'Vedic birthday chart' },
    { label: 'Panchang', href: '/panchang', description: "Today's panchang" },
    { label: 'Lunar Calendar', href: '/lunar-calendar', description: 'Moon phase panchang' },
  ],
  '/learn/muhurtas': [
    { label: 'Muhurta AI', href: '/muhurta-ai', description: 'AI-powered timing' },
    { label: 'Choghadiya', href: '/choghadiya', description: '8-fold auspicious periods' },
    { label: 'Rahu Kaal', href: '/rahu-kaal', description: 'Inauspicious window' },
  ],
  '/learn/hora': [
    { label: 'Hora Tool', href: '/hora', description: 'Planetary hours today' },
    { label: 'Muhurta AI', href: '/muhurta-ai', description: 'AI-powered timing' },
  ],
  '/learn/vara': [
    { label: 'Rahu Kaal', href: '/rahu-kaal', description: 'Inauspicious window' },
    { label: 'Choghadiya', href: '/choghadiya', description: '8-fold auspicious periods' },
    { label: 'Vedic Time', href: '/vedic-time', description: 'Ancient time units' },
  ],
  '/learn/doshas': [
    { label: 'Mangal Dosha', href: '/mangal-dosha', description: 'Mars affliction check' },
    { label: 'Kaal Sarpa', href: '/kaal-sarp', description: 'Rahu-Ketu axis dosha' },
    { label: 'Pitra Dosha', href: '/pitra-dosha', description: 'Ancestral affliction' },
  ],
  '/learn/doshas-detailed': [
    { label: 'Mangal Dosha', href: '/mangal-dosha', description: 'Mars affliction check' },
    { label: 'Kaal Sarpa', href: '/kaal-sarp', description: 'Rahu-Ketu axis dosha' },
    { label: 'Kundali', href: '/kundali', description: 'Full birth chart' },
  ],
  '/learn/sade-sati': [
    { label: 'Sade Sati Check', href: '/sade-sati', description: 'Check your Sade Sati' },
    { label: 'Transit Playground', href: '/transit-playground', description: 'Live transit explorer' },
  ],
  '/learn/matching': [
    { label: 'Kundali Matching', href: '/matching', description: '36-point compatibility' },
    { label: 'Kundali', href: '/kundali', description: 'Full birth chart' },
  ],
  '/learn/compatibility': [
    { label: 'Kundali Matching', href: '/matching', description: '36-point compatibility' },
  ],
  '/learn/compatibility-advanced': [
    { label: 'Kundali Matching', href: '/matching', description: '36-point compatibility' },
  ],
  '/learn/marriage': [
    { label: 'Kundali Matching', href: '/matching', description: '36-point compatibility' },
    { label: 'Mangal Dosha', href: '/mangal-dosha', description: 'Mars affliction check' },
  ],
  '/learn/ayanamsha': [
    { label: 'Tropical Compare', href: '/tropical-compare', description: 'Sidereal vs tropical' },
    { label: 'Sign Shift', href: '/sign-shift', description: 'Why your sign may differ' },
    { label: 'Rashi Calculator', href: '/sign-calculator', description: 'Find your Vedic sign' },
  ],
  '/learn/grahas': [
    { label: 'Live Sky', href: '/sky', description: 'See planets in the sky' },
    { label: 'Upagraha', href: '/upagraha', description: 'Sub-planetary points' },
    { label: 'Retrograde', href: '/retrograde', description: 'Retrograde calendar' },
  ],
  '/learn/retrograde-effects': [
    { label: 'Retrograde Calendar', href: '/retrograde', description: 'Current retrogrades' },
    { label: 'Transit Playground', href: '/transit-playground', description: 'Live transit explorer' },
  ],
  '/learn/retrograde-visualizer': [
    { label: 'Retrograde Calendar', href: '/retrograde', description: 'Current retrogrades' },
  ],
  '/learn/transit-guide': [
    { label: 'Transit Playground', href: '/transit-playground', description: 'Live transit explorer' },
    { label: 'Sade Sati', href: '/sade-sati', description: "Saturn's 7.5-year transit" },
    { label: 'Sarvatobhadra', href: '/sarvatobhadra', description: '28-nakshatra chakra' },
  ],
  '/learn/gochar': [
    { label: 'Transit Playground', href: '/transit-playground', description: 'Live transit explorer' },
    { label: 'Sade Sati', href: '/sade-sati', description: "Saturn's 7.5-year transit" },
  ],
  '/learn/eclipses': [
    { label: 'Live Sky', href: '/sky', description: 'Real-time positions' },
    { label: 'Eclipse Calendar', href: '/eclipses', description: 'Upcoming eclipses' },
  ],
  '/learn/cosmology': [
    { label: 'Live Sky', href: '/sky', description: 'Real-time positions' },
    { label: 'Sky Map', href: '/sky-map', description: 'Celestial map' },
  ],
  '/learn/nadi-amsha': [
    { label: 'Nadi Jyotish', href: '/nadi-jyotish', description: 'Palm-leaf traditions' },
    { label: 'Kundali', href: '/kundali', description: 'Full birth chart' },
  ],
  '/learn/ayurveda-jyotish': [
    { label: 'Medical Jyotish', href: '/medical-astrology', description: 'Health & planet analysis' },
    { label: 'Dinacharya', href: '/dinacharya', description: 'Ayurvedic routine' },
  ],
  '/learn/career': [
    { label: 'Financial Jyotish', href: '/financial-astrology', description: 'Markets & cycles' },
    { label: 'Kundali', href: '/kundali', description: 'Full birth chart' },
  ],
  '/learn/wealth': [
    { label: 'Financial Jyotish', href: '/financial-astrology', description: 'Markets & cycles' },
    { label: 'Kundali', href: '/kundali', description: 'Full birth chart' },
  ],
  '/learn/health': [
    { label: 'Medical Jyotish', href: '/medical-astrology', description: 'Health & planet analysis' },
    { label: 'Kundali', href: '/kundali', description: 'Full birth chart' },
  ],
  '/learn/masa': [
    { label: 'Lunar Calendar', href: '/lunar-calendar', description: 'Moon phase panchang' },
    { label: 'Panchang', href: '/panchang', description: "Today's panchang" },
  ],
  '/learn/adhika-masa': [
    { label: 'Lunar Calendar', href: '/lunar-calendar', description: 'Moon phase panchang' },
  ],
  '/learn/remedies': [
    { label: 'Kundali', href: '/kundali', description: 'Full birth chart' },
    { label: 'Mangal Dosha', href: '/mangal-dosha', description: 'Mars affliction check' },
    { label: 'Sade Sati', href: '/sade-sati', description: "Saturn's 7.5-year transit" },
  ],
  '/learn/dashas': [
    { label: 'Kundali', href: '/kundali', description: 'Full birth chart with dashas' },
    { label: 'Varshaphal', href: '/varshaphal', description: 'Annual predictions' },
  ],
  '/learn/planets': [
    { label: 'Live Sky', href: '/sky', description: 'See planets in the sky' },
    { label: 'Horoscope', href: '/horoscope', description: 'Daily planetary effects' },
  ],
};

/**
 * Also-see links for TOOL → TOOL cross-referencing (timing tools, dosha tools, etc.)
 */
export const TOOL_ALSO_SEE: Record<string, CrossLinkEntry[]> = {
  '/rahu-kaal': [
    { label: 'Choghadiya', href: '/choghadiya' },
    { label: 'Hora', href: '/hora' },
    { label: 'Panchang', href: '/panchang' },
  ],
  '/choghadiya': [
    { label: 'Rahu Kaal', href: '/rahu-kaal' },
    { label: 'Hora', href: '/hora' },
    { label: 'Panchang', href: '/panchang' },
  ],
  '/hora': [
    { label: 'Rahu Kaal', href: '/rahu-kaal' },
    { label: 'Choghadiya', href: '/choghadiya' },
    { label: 'Muhurta AI', href: '/muhurta-ai' },
  ],
  '/mangal-dosha': [
    { label: 'Kaal Sarpa', href: '/kaal-sarp' },
    { label: 'Pitra Dosha', href: '/pitra-dosha' },
    { label: 'Matching', href: '/matching' },
  ],
  '/kaal-sarp': [
    { label: 'Mangal Dosha', href: '/mangal-dosha' },
    { label: 'Pitra Dosha', href: '/pitra-dosha' },
    { label: 'Kundali', href: '/kundali' },
  ],
  '/pitra-dosha': [
    { label: 'Mangal Dosha', href: '/mangal-dosha' },
    { label: 'Kaal Sarpa', href: '/kaal-sarp' },
    { label: 'Kundali', href: '/kundali' },
  ],
  '/sade-sati': [
    { label: 'Transit Playground', href: '/transit-playground' },
    { label: 'Retrograde', href: '/retrograde' },
    { label: 'Kundali', href: '/kundali' },
  ],
  '/sign-calculator': [
    { label: 'Tropical Compare', href: '/tropical-compare' },
    { label: 'Sign Shift', href: '/sign-shift' },
    { label: 'Horoscope', href: '/horoscope' },
  ],
};

/**
 * Look up related learn pages for a given tool route.
 */
export function getLearnLinksForTool(toolRoute: string): CrossLinkEntry[] {
  return TOOL_TO_LEARN[toolRoute] ?? [];
}

/**
 * Look up related tool pages for a given learn route.
 */
export function getToolLinksForLearn(learnRoute: string): CrossLinkEntry[] {
  return LEARN_TO_TOOL[learnRoute] ?? [];
}

/**
 * Look up "also see" tool links for a given tool route.
 */
export function getAlsoSeeForTool(toolRoute: string): CrossLinkEntry[] {
  return TOOL_ALSO_SEE[toolRoute] ?? [];
}
