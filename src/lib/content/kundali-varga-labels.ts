/**
 * Shared label set for components/kundali/VargaAnalysisTab.
 *
 * Authored locales: en, hi.
 * Gemini-translated overlay (mai/mr/ta/te/kn/gu/bn) lives in
 * `src/lib/constants/kundali-varga-labels-overlay.json`, generated
 * by `scripts/translate-kundali-varga-via-gemini.py`.
 *
 * SCOPE: chrome only. The dynamic narrative paragraphs that compose
 * with VARGA_DOMAIN/REMEDIES_BY_PLANET data structures stay
 * hi/en-only — those data structures ship en/hi only, so routing
 * the narrative through tl() would downgrade Maithili/Marathi from
 * Devanagari to English. Data-layer extension is a separate concern.
 *
 * Resolution: AUTHORED[locale] → OVERLAY[locale] → AUTHORED.hi → AUTHORED.en
 */
import overlay from '@/lib/constants/kundali-varga-labels-overlay.json';

const AUTHORED: Record<string, Record<string, string>> = {
  en: {
    promiseVsDelivery: 'Promise vs Delivery',
    d1Promise: 'D1 Promise',
    deliverySuffix: 'Delivery',
    dignityShiftsTemplate: 'D1 → {CHART} Dignity Shifts',
    yogasInChartTemplate: 'Yogas in {CHART}',
    dispositorChain: 'Dispositor Chain',
    lifeAreaVerdicts: 'Life Area Verdicts',
    overallSynthesis: 'Overall Synthesis',
    vargaRemedialGuidance: 'Varga-Based Remedial Guidance',
    weakPlacementsSubtitle: 'Specific remedies for weak varga placements',
    debilitatedIn: 'debilitated in',
    recommendedRemedies: 'Recommended Remedies',
    selfAssessmentQuestions: 'Self-Assessment Questions',
  },
  hi: {
    promiseVsDelivery: 'वादा बनाम वितरण',
    d1Promise: 'D1 वादा',
    deliverySuffix: 'वितरण',
    dignityShiftsTemplate: 'D1 → {CHART} बल परिवर्तन',
    yogasInChartTemplate: '{CHART} चार्ट में योग',
    dispositorChain: 'अधिपति शृंखला',
    lifeAreaVerdicts: 'जीवन क्षेत्र निदान',
    overallSynthesis: 'समग्र संश्लेषण',
    vargaRemedialGuidance: 'वर्ग-आधारित उपाय',
    weakPlacementsSubtitle: 'दुर्बल वर्ग स्थितियों के लिए विशिष्ट उपाय',
    debilitatedIn: 'नीच, में',
    recommendedRemedies: 'अनुशंसित उपाय',
    selfAssessmentQuestions: 'आत्म-परीक्षण प्रश्न',
  },
};

const OVERLAY = overlay as Record<string, Record<string, string>>;

export function pickVargaLabel(key: string, locale: string): string {
  return (
    AUTHORED[locale]?.[key]
    ?? OVERLAY[locale]?.[key]
    ?? AUTHORED.hi[key]
    ?? AUTHORED.en[key]
    ?? ''
  );
}

export function formatVargaLabel(
  key: string,
  locale: string,
  vars: Record<string, string>,
): string {
  let out = pickVargaLabel(key, locale);
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(v);
  }
  return out;
}
