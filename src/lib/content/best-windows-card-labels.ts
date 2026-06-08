/**
 * Shared label set for components/panchang/BestWindowsCard (renders
 * across multiple panchang surfaces — home, /panchang root,
 * /choghadiya, etc.).
 *
 * Authored locales: en, hi.
 * Gemini-translated overlay (mai/mr/ta/te/kn/gu/bn) lives in
 * `src/lib/constants/best-windows-card-labels-overlay.json`, generated
 * by `scripts/translate-best-windows-card-via-gemini.py`.
 *
 * Resolution: AUTHORED[locale] → OVERLAY[locale] → AUTHORED.hi → AUTHORED.en
 */
import overlay from '@/lib/constants/best-windows-card-labels-overlay.json';

const AUTHORED: Record<string, Record<string, string>> = {
  en: {
    // Header
    bestWindowsToday: 'Best Windows Today',
    bestWindowsForDateTemplate: 'Best Windows for {DATE}',
    noVerdictData: 'No verdict data available.',
    // Tara badge / personal chart chip
    myChart: 'My Chart',
    addBirthDataToPersonalise: 'Sign in with birth data to personalise',
    taraLabel: 'Tara',
    birthStarDay: 'birth star day',
    birthStarDayMixed: 'birth star day — mixed',
    // Strength descriptors (used by Tara verdict)
    fullStrength: 'Full strength',
    moderateStrength: 'Moderate strength',
    reducedStrength: 'Reduced strength',
    // Compact strength chips
    moderate: 'moderate',
    reduced: 'reduced',
    favourable: 'favourable',
    exerciseCaution: 'exercise caution',
    considerPostponing: 'consider postponing',
    // Verdict-tier chips
    excellent: 'Excellent',
    good: 'Good',
    caution: 'Caution',
    avoid: 'Avoid',
    // Filter / nav chrome
    all: 'All',
    personal: 'Personal',
    personalPlus: 'Personal +',
    personalMinus: 'Personal −',
    more: 'More',
    netResult: 'Net Result',
    // Next-window status
    nextFavourable: 'Next favourable:',
    nextShort: 'next:',
  },
  hi: {
    bestWindowsToday: 'आज की सर्वश्रेष्ठ अवधियाँ',
    bestWindowsForDateTemplate: '{DATE} की सर्वश्रेष्ठ अवधियाँ',
    noVerdictData: 'कोई डेटा उपलब्ध नहीं।',
    myChart: 'मेरा लग्न',
    addBirthDataToPersonalise: 'व्यक्तिगत करने के लिए जन्म विवरण जोड़ें',
    taraLabel: 'तारा',
    birthStarDay: 'जन्म नक्षत्र दिवस',
    birthStarDayMixed: 'जन्म नक्षत्र दिवस — मिश्र',
    fullStrength: 'पूर्ण बल',
    moderateStrength: 'मध्यम बल',
    reducedStrength: 'न्यून बल',
    moderate: 'मध्यम',
    reduced: 'न्यून',
    favourable: 'शुभ',
    exerciseCaution: 'सावधानी बरतें',
    considerPostponing: 'स्थगित करने पर विचार करें',
    excellent: 'उत्तम',
    good: 'शुभ',
    caution: 'सावधान',
    avoid: 'वर्जित',
    all: 'सभी',
    personal: 'व्यक्तिगत',
    personalPlus: 'व्यक्तिगत शुभ',
    personalMinus: 'व्यक्तिगत सावधान',
    more: 'और',
    netResult: 'परिणाम',
    nextFavourable: 'अगला शुभ:',
    nextShort: 'अगला:',
  },
};

const OVERLAY = overlay as Record<string, Record<string, string>>;

export function pickBestWindowsLabel(key: string, locale: string): string {
  return (
    AUTHORED[locale]?.[key]
    ?? OVERLAY[locale]?.[key]
    ?? AUTHORED.hi[key]
    ?? AUTHORED.en[key]
    ?? ''
  );
}

export function formatBestWindowsLabel(
  key: string,
  locale: string,
  vars: Record<string, string>,
): string {
  let out = pickBestWindowsLabel(key, locale);
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(v);
  }
  return out;
}
