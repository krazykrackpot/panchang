/**
 * Shared label set for components/kundali/SummaryView (the default
 * Kundali landing view, rendered on every /kundali surface).
 *
 * Authored locales: en, hi.
 * Gemini-translated overlay (mai/mr/ta/te/kn/gu/bn) lives in
 * `src/lib/constants/kundali-summary-labels-overlay.json`, generated
 * by `scripts/translate-kundali-summary-via-gemini.py`.
 *
 * SCOPE: chrome only (section headings, button labels, status words).
 * The narrative content from `tip.chartNarrative.*` ships en/hi only
 * at the data-layer (tippanni-lagna.ts); extending that to 9 locales
 * is a separate, larger work item.
 *
 * Resolution: AUTHORED[locale] → OVERLAY[locale] → AUTHORED.hi → AUTHORED.en
 */
import overlay from '@/lib/constants/kundali-summary-labels-overlay.json';

const AUTHORED: Record<string, Record<string, string>> = {
  en: {
    // Vitality badge
    vitalityStrong: 'Strong',
    vitalityBalanced: 'Balanced',
    vitalityChallenging: 'Challenging',
    vitalityLabel: 'Chart Vitality',
    // Chart toggle / title
    houseMeanings: 'House Meanings',
    toggleOn: 'ON',
    toggleOff: 'OFF',
    chartTitle: 'Birth Chart',
    // Tech-analysis CTA
    viewTechAnalysis: 'View Technical Analysis  –  Charts, Planets, Houses, Ashtakavarga',
    techAnalysisHeading: 'Advanced Technical Chart Analysis',
    // Snapshot row labels
    lagnaLabel: 'Lagna',
    moonLabel: 'Moon',
    dashaLabel: 'Dasha',
    ageLabel: 'Age',
    strongestLabel: 'Strongest',
    // Life-stage label
    phaseSuffix: 'Phase',
    ageTemplate: 'Age {AGE}',
    // Section headings
    whoYouAre: 'Who You Are',
    whatMeansNow: 'What This Means for You Now',
    yourPlanetaryStrengths: 'Your Planetary Strengths',
    seePlanetByPlanet: 'See detailed planet-by-planet analysis',
    whatChartCarries: 'What Your Chart Carries',
    yogasHeadingTemplate: 'Yogas ({COUNT} active)',
    doshasHeading: 'Doshas',
    showLess: 'Show less',
    seeAllYogasTemplate: 'See all {COUNT} yogas',
    seeAllDoshas: 'See all doshas',
    yourLifeDomains: 'Your Life Domains',
    domainsConnect: 'How Your Domains Connect',
    personalMonth: 'Your Personal Month',
    whereYouAreNow: 'Where You Are Now',
    whatYouCanDo: 'What You Can Do',
    yourKeyTakeaways: 'Your 3 Key Takeaways',
    // Yoga / dosha card chips
    relevantNow: 'Relevant now',
    cancellationConditions: 'Cancellation conditions:',
    // Action buttons
    printBtn: 'Print',
    copyLink: 'Share Link',
    copied: 'Copied!',
  },
  hi: {
    vitalityStrong: 'सशक्त',
    vitalityBalanced: 'संतुलित',
    vitalityChallenging: 'चुनौतीपूर्ण',
    vitalityLabel: 'कुण्डली जीवनशक्ति',
    houseMeanings: 'भाव अर्थ',
    toggleOn: 'चालू',
    toggleOff: 'बंद',
    chartTitle: 'जन्म कुण्डली',
    viewTechAnalysis: 'तकनीकी विश्लेषण देखें  –  चार्ट, ग्रह, भाव, अष्टकवर्ग',
    techAnalysisHeading: 'तकनीकी चार्ट विश्लेषण',
    lagnaLabel: 'लग्न',
    moonLabel: 'चन्द्र',
    dashaLabel: 'दशा',
    ageLabel: 'आयु',
    strongestLabel: 'सबसे बलवान',
    phaseSuffix: 'अवस्था',
    ageTemplate: 'आयु {AGE}',
    whoYouAre: 'आप कौन हैं',
    whatMeansNow: 'आपके लिए अभी',
    yourPlanetaryStrengths: 'आपकी ग्रहीय शक्ति',
    seePlanetByPlanet: 'विस्तृत ग्रह विश्लेषण देखें',
    whatChartCarries: 'आपकी कुण्डली क्या वहन करती है',
    yogasHeadingTemplate: 'योग ({COUNT} सक्रिय)',
    doshasHeading: 'दोष',
    showLess: 'कम दिखाएँ',
    seeAllYogasTemplate: 'सभी {COUNT} योग देखें',
    seeAllDoshas: 'सभी दोष देखें',
    yourLifeDomains: 'आपके जीवन क्षेत्र',
    domainsConnect: 'आपके क्षेत्र कैसे जुड़ते हैं',
    personalMonth: 'आपका व्यक्तिगत मास',
    whereYouAreNow: 'आप अभी कहाँ हैं',
    whatYouCanDo: 'आप क्या कर सकते हैं',
    yourKeyTakeaways: 'आपकी 3 मुख्य बातें',
    relevantNow: 'अभी प्रासंगिक',
    cancellationConditions: 'रद्दीकरण शर्तें:',
    printBtn: 'प्रिंट करें',
    copyLink: 'लिंक साझा करें',
    copied: 'कॉपी हुआ!',
  },
};

const OVERLAY = overlay as Record<string, Record<string, string>>;

export function pickKundaliSummaryLabel(key: string, locale: string): string {
  return (
    AUTHORED[locale]?.[key]
    ?? OVERLAY[locale]?.[key]
    ?? AUTHORED.hi[key]
    ?? AUTHORED.en[key]
    ?? ''
  );
}

export function formatKundaliSummaryLabel(
  key: string,
  locale: string,
  vars: Record<string, string>,
): string {
  let out = pickKundaliSummaryLabel(key, locale);
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(v);
  }
  return out;
}
