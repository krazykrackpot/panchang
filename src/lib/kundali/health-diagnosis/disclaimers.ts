// src/lib/kundali/health-diagnosis/disclaimers.ts
//
// Task C4 — Disclaimer builder for high-stakes health elements.
//
// Per spec §10 Q7: A single Vedic-framing disclaimer is attached to the
// three disclaimer-gated elements (psychiatric, cancer, longevity).
// The disclaimer is surfaced when ANY of these elements appears in the
// rendered natalElements array.
//
// Disclaimer text (from spec §10 Q7, translated to all 9 visible locales):
//   "Classical Jyotish describes karmic tendencies, not certainties.
//    These patterns indicate areas to nurture with awareness, not destiny.
//    Modern medical care remains essential."
//
// Locales: en, hi, ta, te, bn, gu, kn, mai, mr (9 visible locales per CLAUDE.md).
// Other locales fall back to 'en' (locale fallback is non-negotiable).

import type { NatalElement, DisclaimerEntry, ElementId } from './types';

// ─── Disclaimer text ──────────────────────────────────────────────────────────

/**
 * The single Vedic-framing disclaimer text, translated to all 9 visible locales.
 * Locale keys must be a superset of src/lib/i18n/config.ts visibleLocales.
 */
const VEDIC_FRAMING_DISCLAIMER = {
  en:  'Classical Jyotish describes karmic tendencies, not certainties. These patterns indicate areas to nurture with awareness, not destiny. Modern medical care remains essential.',
  hi:  'शास्त्रीय ज्योतिष कर्मिक प्रवृत्तियों का वर्णन करता है, निश्चितताओं का नहीं। ये संकेत सजगता से पोषित करने योग्य क्षेत्र दर्शाते हैं, न कि नियति। आधुनिक चिकित्सा सेवाएँ अनिवार्य हैं।',
  ta:  'செவ்வாய் ஜோதிடம் கர்ம பிரவணங்களை விவரிக்கிறது, உறுதிகளை அல்ல. இந்த வடிவங்கள் விழிப்புணர்வுடன் வளர்க்க வேண்டிய பகுதிகளை குறிக்கின்றன, விதியை அல்ல. நவீன மருத்துவ பராமரிப்பு இன்னியமானது.',
  te:  'సాంప్రదాయ జ్యోతిష్యం కార్మిక ప్రవృత్తులను వివరిస్తుంది, నిశ్చయాలను కాదు. ఈ నమూనాలు జాగ్రత్తగా పోషించవలసిన ప్రాంతాలను సూచిస్తాయి, విధిని కాదు. ఆధునిక వైద్య సేవ అవసరం.',
  bn:  'ক্লাসিকাল জ্যোতিষ কর্মীয় প্রবণতা বর্ণনা করে, নিশ্চিততা নয়। এই নিদর্শনগুলি সচেতনতার সাথে লালন করার ক্ষেত্র নির্দেশ করে, ভাগ্য নয়। আধুনিক চিকিৎসা সেবা অপরিহার্য।',
  gu:  'ક્લાસિકલ જ્યોતિષ કાર્મિક વલણો વર્ણવે છે, નિશ્ચિતતાઓ નહીં. આ નમૂના સજાગતા સાથે પોષવાના ક્ષેત્રો સૂચવે છે, ભાગ્ય નહીં. આધુનિક તબીબી સંભાળ આવશ્યક છે.',
  kn:  'ಶಾಸ್ತ್ರೀಯ ಜ್ಯೋತಿಷ್ಯವು ಕಾರ್ಮಿಕ ಪ್ರವೃತ್ತಿಗಳನ್ನು ವಿವರಿಸುತ್ತದೆ, ನಿಶ್ಚಿತತೆಗಳನ್ನಲ್ಲ. ಈ ಮಾದರಿಗಳು ಜಾಗ್ರತೆಯಿಂದ ಪೋಷಿಸಬೇಕಾದ ಪ್ರದೇಶಗಳನ್ನು ಸೂಚಿಸುತ್ತವೆ, ವಿಧಿಯನ್ನಲ್ಲ. ಆಧುನಿಕ ವೈದ್ಯಕೀಯ ಆರೈಕೆ ಅಗತ್ಯ.',
  mai: 'शास्त्रीय ज्योतिष कार्मिक प्रवृत्तिक वर्णन करैत अछि, निश्चितता के नहि। ई प्रतिरूप जागरूकता सँ पोषण योग्य क्षेत्र सूचित करैत अछि, भाग्य नहि। आधुनिक चिकित्सा सेवा आवश्यक अछि।',
  mr:  'शास्त्रीय ज्योतिष कर्मिक प्रवृत्तींचे वर्णन करते, निश्चितांचे नाही. हे नमुने जागरूकतेने जोपासण्याचे क्षेत्र दर्शवतात, नियती नाही. आधुनिक वैद्यकीय काळजी आवश्यक आहे.',
} as const;

// ─── Disclaimer-gated element IDs ────────────────────────────────────────────

/** Elements that require the Vedic-framing disclaimer (per spec §4.17, §4.21, §4.22). */
const DISCLAIMER_GATED_IDS: ElementId[] = ['psychiatric', 'cancer', 'longevity'];

// ─── Main builder ─────────────────────────────────────────────────────────────

/**
 * Build the disclaimers array for a HealthDiagnosis.
 *
 * Returns one DisclaimerEntry whose scope is the intersection of
 * DISCLAIMER_GATED_IDS and the provided natalElements ids — i.e. only the
 * disclaimer-gated elements that are actually present in the rendered list.
 *
 * Returns [] when no disclaimer-gated element is present (the standard 19-element
 * default mode, where psychiatric is the only default-visible gated element).
 *
 * NOTE: The spec says `requiresDisclaimer` on the element drives the inclusion.
 * We use the element's `requiresDisclaimer` flag directly from the NatalElement
 * object rather than relying on the DISCLAIMER_GATED_IDS list so that future
 * elements with requiresDisclaimer: true are automatically included without
 * needing to update this file.
 *
 * @param natalElements  The NatalElement[] from Layer 1 (already filtered to visible)
 * @returns              Array of DisclaimerEntry (0 or 1 entries)
 */
export function buildDisclaimers(natalElements: NatalElement[]): DisclaimerEntry[] {
  const scopeIds: ElementId[] = natalElements
    .filter(el => el.requiresDisclaimer)
    .map(el => el.id);

  if (scopeIds.length === 0) return [];

  return [
    {
      scope: scopeIds,
      text:  VEDIC_FRAMING_DISCLAIMER,
    },
  ];
}

// Re-export for consumers that need to check individual disclaimer scope.
export { DISCLAIMER_GATED_IDS };
