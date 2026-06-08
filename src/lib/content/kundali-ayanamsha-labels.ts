/**
 * Shared label set for components/kundali/AyanamshaComparison.
 *
 * Authored locales: en, hi.
 * Gemini-translated overlay (mai/mr/ta/te/kn/gu/bn) lives in
 * `src/lib/constants/kundali-ayanamsha-labels-overlay.json`, generated
 * by `scripts/translate-kundali-ayanamsha-via-gemini.py`.
 *
 * SCOPE: chrome + 12 cusp-life labels.
 *
 * Resolution: AUTHORED[locale] → OVERLAY[locale] → AUTHORED.hi → AUTHORED.en
 */
import overlay from '@/lib/constants/kundali-ayanamsha-labels-overlay.json';

const AUTHORED: Record<string, Record<string, string>> = {
  en: {
    allPlanetsSame: '✓ All planets remain in the same sign across all three ayanamsha systems',
    chartStable: 'Your chart is ayanamsha-stable  –  any system will produce the same sign-level interpretation.',
    planetBoundariesTemplate: '⚡ {COUNT} Planets at Sign Boundaries  –  Detailed Analysis',
    planetBoundariesTemplateSingular: '⚡ {COUNT} Planet at Sign Boundaries  –  Detailed Analysis',
    lagnaShiftsTemplate: 'Lagna Shifts: {S1} → {S2}',
    whichAyanamshaRight: 'Which Ayanamsha Is Right For You?',
    whatConcretely: 'What This Concretely Means For Your Life',
    lagnaRowLabel: 'Lagna',
    yourChartAcross: 'Your Chart Across Three Ayanamsha Systems',
    planetColHeader: 'Planet',
    signChangesTooltip: 'Sign changes across ayanamshas',
    kpCuspalSubLords: 'KP Cuspal Sub-Lords (Placidus)',
    cuspHeader: 'Cusp',
    degreeHeader: 'Degree',
    signLordHeader: 'Sign Lord',
    starLordHeader: 'Star Lord',
    subLordHeader: 'Sub Lord',
    kpFootnote: 'Computed using Krishnamurti ayanamsha and the Placidus house system',
    amberLegend: 'Amber = sign differs from Lahiri in this ayanamsha',
    boundaryFootnote: "Planets near sign boundaries may shift signs depending on the ayanamsha. Most Vedic astrologers use Lahiri (Chitrapaksha). KP practitioners use Krishnamurti. B.V. Raman's system is popular in South India.",
    // 12 cusp-life labels (1-based house index)
    cusp1: 'Self',
    cusp2: 'Wealth',
    cusp3: 'Courage',
    cusp4: 'Home',
    cusp5: 'Children',
    cusp6: 'Health',
    cusp7: 'Marriage',
    cusp8: 'Transform',
    cusp9: 'Fortune',
    cusp10: 'Career',
    cusp11: 'Gains',
    cusp12: 'Liberation',
  },
  hi: {
    allPlanetsSame: '✓ सभी ग्रह तीनों अयनांश पद्धतियों में एक ही राशि में हैं',
    chartStable: 'आपकी कुण्डली अयनांश-स्वतन्त्र है  –  कोई भी पद्धति समान व्याख्या देगी।',
    planetBoundariesTemplate: '⚡ {COUNT} ग्रह राशि सन्धि पर  –  विस्तृत विश्लेषण',
    planetBoundariesTemplateSingular: '⚡ {COUNT} ग्रह राशि सन्धि पर  –  विस्तृत विश्लेषण',
    lagnaShiftsTemplate: 'लग्न परिवर्तन: {S1} → {S2}',
    whichAyanamshaRight: 'कौन-सा अयनांश आपके लिए सही है?',
    whatConcretely: 'आपके जीवन पर वास्तविक प्रभाव',
    lagnaRowLabel: 'लग्न',
    yourChartAcross: 'आपकी कुण्डली: तीन अयनांश पद्धतियों में तुलना',
    planetColHeader: 'ग्रह',
    signChangesTooltip: 'भिन्न अयनांश में राशि परिवर्तन',
    kpCuspalSubLords: 'केपी भाव-कुशल उप-स्वामी (प्लासिडस)',
    cuspHeader: 'भाव',
    degreeHeader: 'अंश',
    signLordHeader: 'राशि स्वामी',
    starLordHeader: 'नक्षत्र स्वामी',
    subLordHeader: 'उप स्वामी',
    kpFootnote: 'केपी कृष्णमूर्ति अयनांश एवं प्लासिडस भाव पद्धति पर आधारित',
    amberLegend: 'एम्बर = इस अयनांश में राशि भिन्न है',
    boundaryFootnote: 'राशि सन्धि पर स्थित ग्रह अयनांश के अनुसार राशि बदल सकते हैं। अधिकांश ज्योतिषी लाहिरी का प्रयोग करते हैं।',
    cusp1: 'स्वयं',
    cusp2: 'धन',
    cusp3: 'साहस',
    cusp4: 'गृह',
    cusp5: 'सन्तान',
    cusp6: 'रोग',
    cusp7: 'विवाह',
    cusp8: 'रूपान्तर',
    cusp9: 'भाग्य',
    cusp10: 'कैरियर',
    cusp11: 'लाभ',
    cusp12: 'मोक्ष',
  },
};

const OVERLAY = overlay as Record<string, Record<string, string>>;

export function pickAyanamshaLabel(key: string, locale: string): string {
  return (
    AUTHORED[locale]?.[key]
    ?? OVERLAY[locale]?.[key]
    ?? AUTHORED.hi[key]
    ?? AUTHORED.en[key]
    ?? ''
  );
}

export function formatAyanamshaLabel(
  key: string,
  locale: string,
  vars: Record<string, string>,
): string {
  let out = pickAyanamshaLabel(key, locale);
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(v);
  }
  return out;
}

export function cuspLifeLabel(house: number, locale: string): string {
  return pickAyanamshaLabel(`cusp${house}`, locale);
}
