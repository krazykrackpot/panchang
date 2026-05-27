// src/lib/kundali/health-diagnosis/layer-2-mode.ts
//
// Task C2 — Layer 2 constitutional / mode composer.
//
// Wraps computePrakriti and derives a single modeNote LocaleText that
// communicates the Ayurvedic constitutional bias to the user in plain language.
//
// Per spec §6: Layer 2 does NOT change any element score — it colours HOW
// symptoms appear.  The modeNote is purely interpretive.
//
// The modeNote mentions primaryDosha by name and gives a brief symptom bias
// description.  It falls back gracefully when prakriti data is missing.
//
// Supported locales for modeNote: en, hi.
// Other locales fall back to 'en' (next-intl rule: locale fallback is
// non-negotiable — never return undefined or a key path).

import type { KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import { computePrakriti } from '@/lib/medical/prakriti';
import type { PrakritiResult } from '@/lib/medical/prakriti';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface Layer2Result {
  prakriti: PrakritiResult;
  modeNote: LocaleText;
}

// ─── Dosha mode descriptions ──────────────────────────────────────────────────

/**
 * Short mode descriptions per primary dosha, in English and Hindi.
 * These are added at the call site (modeNote) so that the UI can render
 * the constitutional bias without needing to re-derive dosha from prakriti.
 *
 * Each string is deliberately concise — one sentence — so it fits in a card
 * sub-header or tooltip without overflow.
 */
const MODE_EN: Record<string, string> = {
  Vata:  'Vata-dominant constitution — health issues tend to manifest as dryness, anxiety, irregular digestion, and variable energy.',
  Pitta: 'Pitta-dominant constitution — health issues tend to manifest as heat, acidity, inflammation, and intensity.',
  Kapha: 'Kapha-dominant constitution — health issues tend to manifest as heaviness, congestion, sluggish digestion, and retention.',
};

const MODE_HI: Record<string, string> = {
  Vata:  'वात-प्रधान प्रकृति — स्वास्थ्य समस्याएँ सूखापन, चिन्ता, अनियमित पाचन और ऊर्जा की उतार-चढ़ाव के रूप में प्रकट होती हैं।',
  Pitta: 'पित्त-प्रधान प्रकृति — स्वास्थ्य समस्याएँ गर्मी, अम्लता, सूजन और तीव्रता के रूप में प्रकट होती हैं।',
  Kapha: 'कफ-प्रधान प्रकृति — स्वास्थ्य समस्याएँ भारीपन, बलगम, मन्द पाचन और संचय के रूप में प्रकट होती हैं।',
};

const FALLBACK_EN = 'Constitutional balance (Tridosha) — health issues may manifest across all three dosha channels equally.';
const FALLBACK_HI = 'त्रिदोष संतुलन — स्वास्थ्य समस्याएँ तीनों दोष माध्यमों से समान रूप से प्रकट हो सकती हैं।';

// ─── Main composer ────────────────────────────────────────────────────────────

/**
 * Compose Layer 2 — constitutional overlay (Prakriti + modeNote).
 *
 * @param kundali  KundaliData from generateKundali()
 * @returns        Layer2Result with prakriti data and interpretive modeNote.
 */
export function composeLayer2(kundali: KundaliData): Layer2Result {
  try {
    const prakriti = computePrakriti(kundali);

    const primaryDosha = prakriti.primaryDosha; // e.g. 'Pitta', 'Vata', 'Kapha'
    const en = MODE_EN[primaryDosha] ?? FALLBACK_EN;
    const hi = MODE_HI[primaryDosha] ?? FALLBACK_HI;

    const modeNote: LocaleText = { en, hi };

    return { prakriti, modeNote };
  } catch (err) {
    console.error('[health-diagnosis/layer-2-mode] composeLayer2 failed:', err);
    // Graceful fallback — return a neutral modeNote so the caller can still
    // render the diagnosis without throwing.
    const fallbackPrakriti: PrakritiResult = {
      vata: 33,
      pitta: 33,
      kapha: 34,
      primaryDosha: 'Kapha',
      secondaryDosha: 'Pitta',
      prakritiType: 'Kapha-Pitta',
      percentages: { vata: 33, pitta: 33, kapha: 34 },
    };
    return {
      prakriti: fallbackPrakriti,
      modeNote: { en: FALLBACK_EN, hi: FALLBACK_HI },
    };
  }
}
