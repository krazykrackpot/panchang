import type { VerdictRating } from './verdict-types';
import { ABHIJIT_DURING_HARD_BLOCK } from './verdict-config';

interface ConflictRule {
  verdict: VerdictRating;
  explanation: string;
  explanationHi: string;
  rule: string;
}

export function resolveConflict(positiveId: string, negativeId: string): ConflictRule | null {
  // Abhijit vs hard blocks N1-N3 (Vishti, Vyatipata, Vaidhriti)
  if (positiveId === 'abhijit' && ['vishti', 'vyatipata', 'vaidhriti'].includes(negativeId)) {
    const names: Record<string, [string, string]> = {
      vishti: ['Vishti Karana', 'विष्टि करण'],
      vyatipata: ['Vyatipata Yoga', 'व्यतीपात योग'],
      vaidhriti: ['Vaidhriti Yoga', 'वैधृति योग'],
    };
    const [nameEn, nameHi] = names[negativeId] ?? [negativeId, negativeId];
    return {
      verdict: ABHIJIT_DURING_HARD_BLOCK,
      explanation: `Abhijit Muhurta is described as "sarva doshagnam" (destroyer of all doshas) in Muhurta Chintamani. However, Rajmartanda says ${nameEn} "destroys even Amrita Yoga." Most scholars consider this a genuine standoff. If another window exists today, prefer it.`,
      explanationHi: `अभिजित मुहूर्त को मुहूर्त चिंतामणि में "सर्व दोषघ्नम्" कहा गया है। परन्तु राजमार्तण्ड के अनुसार ${nameHi} "अमृत योग को भी नष्ट करता है।" यदि आज कोई अन्य शुभ समय उपलब्ध है, तो उसे प्राथमिकता दें।`,
      rule: `${negativeId.toUpperCase()} vs P6 — ${ABHIJIT_DURING_HARD_BLOCK.toUpperCase()} (debated)`,
    };
  }

  // Abhijit vs hard blocks N4-N6 (Rahu Kaal, Yamaganda, Gulika)
  if (positiveId === 'abhijit' && ['rahu_kaal', 'yamaganda', 'gulika_kaal'].includes(negativeId)) {
    const names: Record<string, [string, string]> = {
      rahu_kaal: ['Rahu Kaal', 'राहु काल'],
      yamaganda: ['Yamaganda', 'यमगण्ड'],
      gulika_kaal: ['Gulika Kaal', 'गुलिक काल'],
    };
    const [nameEn, nameHi] = names[negativeId] ?? [negativeId, negativeId];
    return {
      verdict: ABHIJIT_DURING_HARD_BLOCK,
      explanation: `Abhijit Muhurta claims "sarva doshagnam" (destroyer of all doshas). However, ${nameEn} is universally observed as a hard block by modern practitioners. If possible, choose a different window.`,
      explanationHi: `अभिजित मुहूर्त "सर्व दोषघ्नम्" का दावा करता है। परन्तु ${nameHi} को आधुनिक ज्योतिषी कठोर वर्जना मानते हैं। यदि संभव हो, अन्य समय चुनें।`,
      rule: `${negativeId.toUpperCase()} vs P6 — ${ABHIJIT_DURING_HARD_BLOCK.toUpperCase()} (debated)`,
    };
  }

  // Default: no special rule — negative wins
  return null;
}
