/**
 * Shared label set for components/kundali/VargasTab.
 *
 * Authored locales: en, hi.
 * Gemini-translated overlay (mai/mr/ta/te/kn/gu/bn) lives in
 * `src/lib/constants/kundali-vargas-tab-labels-overlay.json`, generated
 * by `scripts/translate-kundali-vargas-tab-via-gemini.py`.
 *
 * SCOPE: chrome (short status labels, table headers, section titles,
 * select-divisional-chart picker labels). Dynamic narrative paragraphs
 * that compose with data structures shipped en/hi only stay as-is.
 *
 * Resolution: AUTHORED[locale] → OVERLAY[locale] → AUTHORED.hi → AUTHORED.en
 */
import overlay from '@/lib/constants/kundali-vargas-tab-labels-overlay.json';

const AUTHORED: Record<string, Record<string, string>> = {
  en: {
    // Picker / chrome
    selectDivisionalChart: 'Select Divisional Chart',
    noChartData: 'Divisional chart data not available for this chart.',
    noPlanetsInHouse: 'No planets in this house',
    // Header chips / section titles
    drekkanaFaces: 'Drekkana Faces  –  Classical Image Interpretations',
    shashtiamshaDeities: 'Shashtiamsha Deities  –  Classical Segment Interpretation',
    vimshopakaBala: 'Vimshopaka Bala (All Vargas)',
    parivartana: 'Parivartana (Sign Exchanges)',
    keyHouseLordshipTrace: 'Key House Lordship Trace',
    argalaOnKeyHouses: 'Argala on Key Houses',
    aspectsOnKeyHouses: 'Aspects on Key Houses',
    dispositorChain: 'Dispositor Chain',
    jaiminiKarakas: 'Jaimini Karakas',
    planetPlacements: 'Planet Placements',
    deepAnalysis: 'Deep Analysis',
    synthesizedPrognosis: 'Synthesized Prognosis',
    savOverlay: 'SAV Overlay',
    promise: 'Promise',
    delivery: 'Delivery',
    d1Promise: 'D1 Promise',
    // Dignity short labels (table chips)
    exalted: 'Exalted',
    debilitatedShort: 'Debil.',
    own: 'Own',
    friend: 'Friend',
    enemy: 'Enemy',
    neutral: 'Neutral',
    vargottama: 'Vargottama',
    stable: 'Stable',
    saumya: 'Saumya',
    krura: 'Krura',
    // Column headers
    domain: 'Domain',
    planet: 'Planet',
    sign: 'Sign',
    dignity: 'Dignity',
    badges: 'Badges',
    // Argala / Aspect labels
    finalDispositor: 'Final Dispositor: ',
    supporting: 'Supporting: ',
    obstructing: 'Obstructing: ',
    noArgala: 'No argala',
    // Misc inline labels
    risingPrefix: 'Rising: ',
    ascendantPrefix: 'Ascendant: ',
    signPrefix: 'Sign: ',
    lordPrefix: 'Lord: ',
    planetsPrefix: 'Planets: ',
    unifiedExpression: 'Unified expression',
    strengthDeclined: 'Strength declined',
    strengthImproved: 'Strength improved',
    brief: 'Brief',
    showLess: 'Show Less',
    // Dynamic template for "Dasha Lord in {chart}"
    dashaLordInTemplate: 'Dasha Lord in {CHART}',
  },
  hi: {
    selectDivisionalChart: 'वर्ग चार्ट चुनें',
    noChartData: 'इस वर्ग के लिए चार्ट डेटा उपलब्ध नहीं है।',
    noPlanetsInHouse: 'इस भाव में कोई ग्रह नहीं',
    drekkanaFaces: 'द्रेक्काण मुख  –  शास्त्रीय प्रतिमा व्याख्या',
    shashtiamshaDeities: 'षष्ट्यंश देवता  –  शास्त्रीय खण्ड व्याख्या',
    vimshopakaBala: 'विंशोपक बल (सभी वर्ग)',
    parivartana: 'परिवर्तन (राशि विनिमय)',
    keyHouseLordshipTrace: 'मुख्य भाव स्वामित्व',
    argalaOnKeyHouses: 'मुख्य भावों पर अर्गला',
    aspectsOnKeyHouses: 'मुख्य भावों पर दृष्टि',
    dispositorChain: 'अधिपति श्रृंखला',
    jaiminiKarakas: 'जैमिनी कारक',
    planetPlacements: 'ग्रह स्थितियां',
    deepAnalysis: 'गहन विश्लेषण',
    synthesizedPrognosis: 'संश्लेषित मूल्यांकन',
    savOverlay: 'सर्वाष्टकवर्ग (SAV)',
    promise: 'वचन',
    delivery: 'फलन',
    d1Promise: 'D1 वचन',
    exalted: 'उच्च',
    debilitatedShort: 'नीच',
    own: 'स्वगृह',
    friend: 'मित्र',
    enemy: 'शत्रु',
    neutral: 'सम',
    vargottama: 'वर्गोत्तम',
    stable: 'स्थिर',
    saumya: 'सौम्य',
    krura: 'क्रूर',
    domain: 'क्षेत्र',
    planet: 'ग्रह',
    sign: 'राशि',
    dignity: 'बल',
    badges: 'चिह्न',
    finalDispositor: 'अंतिम अधिपति: ',
    supporting: 'सहायक: ',
    obstructing: 'अवरोधक: ',
    noArgala: 'कोई अर्गला नहीं',
    risingPrefix: 'उदय राशि: ',
    ascendantPrefix: 'लग्न: ',
    signPrefix: 'राशि: ',
    lordPrefix: 'स्वामी: ',
    planetsPrefix: 'ग्रह: ',
    unifiedExpression: 'एकीकृत अभिव्यक्ति',
    strengthDeclined: 'बल में गिरावट',
    strengthImproved: 'बल में सुधार',
    brief: 'संक्षेप',
    showLess: 'कम दिखाएं',
    dashaLordInTemplate: '{CHART} में दशा स्वामी',
  },
};

const OVERLAY = overlay as Record<string, Record<string, string>>;

export function pickVargasTabLabel(key: string, locale: string): string {
  return (
    AUTHORED[locale]?.[key]
    ?? OVERLAY[locale]?.[key]
    ?? AUTHORED.hi[key]
    ?? AUTHORED.en[key]
    ?? ''
  );
}

export function formatVargasTabLabel(
  key: string,
  locale: string,
  vars: Record<string, string>,
): string {
  let out = pickVargasTabLabel(key, locale);
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(v);
  }
  return out;
}
