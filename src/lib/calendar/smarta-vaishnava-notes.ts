/**
 * Smarta vs Vaishnava divergence annotations for festival pages.
 *
 * When Smarta and Vaishnava traditions may observe a festival on different days,
 * this lookup provides a short explanation. The festival generator uses the
 * Dharmasindhu (Smarta) system by default.
 *
 * Key: festival slug (matching FESTIVAL_DETAILS / MAJOR_FESTIVALS)
 * Value: bilingual note explaining the divergence
 */

export interface SmartaVaishnavNote {
  /** Which tradition may differ */
  tradition: 'vaishnava' | 'smarta';
  /** Short note explaining the divergence (shown as tooltip/badge) */
  note: { en: string; hi: string };
  /** Longer explanation (shown in expanded view) */
  detail: { en: string; hi: string };
}

/**
 * Festivals where Smarta and Vaishnava dates may diverge.
 *
 * The most common cause is the Viddha rejection rule: Vaishnavas reject a
 * tithi that is "touched" (viddha) by the previous tithi at the required
 * observation time, and postpone to the next day. Smartas generally accept
 * the Udaya Tithi (tithi at sunrise) regardless of Viddha.
 *
 * Ekadashi is the most frequent divergence — happens 4-6 times per year.
 */
export const SMARTA_VAISHNAVA_NOTES: Record<string, SmartaVaishnavNote> = {
  // ── Ekadashi (all 24 instances) ──
  // Only some Ekadashis actually diverge in a given year, but ALL have
  // the potential because of the Viddha rejection rule.
  'ekadashi': {
    tradition: 'vaishnava',
    note: {
      en: 'Vaishnava Ekadashi may differ by 1 day due to Viddha rejection',
      hi: 'वैष्णव एकादशी विद्धा नियम के कारण 1 दिन भिन्न हो सकती है',
    },
    detail: {
      en: 'Vaishnavas reject an Ekadashi that is "touched" (viddha) by Dashami at the Arunodaya window (96 min before sunrise). If Dashami is still active at Arunodaya, Vaishnavas postpone fasting to the next day (Dwadashi) — this is called "Mahadvadashi". Smartas accept the regular Udaya Tithi and fast on the standard Ekadashi day. This divergence occurs 4-6 times per year.',
      hi: 'वैष्णव उस एकादशी को अस्वीकार करते हैं जो अरुणोदय काल (सूर्योदय से 96 मिनट पहले) में दशमी से "विद्ध" (स्पर्शित) होती है। ऐसे में वे अगले दिन (द्वादशी) व्रत रखते हैं — इसे "महाद्वादशी" कहते हैं। स्मार्त उदय तिथि के अनुसार सामान्य एकादशी पर व्रत रखते हैं। यह भेद वर्ष में 4-6 बार होता है।',
    },
  },

  // ── Janmashtami ──
  'janmashtami': {
    tradition: 'vaishnava',
    note: {
      en: 'Smartas & Vaishnavas may observe on different days',
      hi: 'स्मार्त और वैष्णव अलग-अलग दिन मना सकते हैं',
    },
    detail: {
      en: 'Smartas observe Janmashtami when Krishna Ashtami is active at Nishita (midnight) — this is the "Smarta Janmashtami". Vaishnavas additionally require that Rohini Nakshatra coincide, and may defer to the next day if Ashtami is Viddha by Saptami at Arunodaya. In many years both dates align, but when they diverge, Vaishnavas celebrate one day later.',
      hi: 'स्मार्त जन्माष्टमी तब मनाते हैं जब कृष्ण अष्टमी निशीथ (मध्यरात्रि) में सक्रिय हो। वैष्णव अतिरिक्त रूप से रोहिणी नक्षत्र का संयोग चाहते हैं, और यदि अष्टमी अरुणोदय में सप्तमी से विद्ध हो तो अगले दिन मनाते हैं।',
    },
  },

  // ── Ram Navami ──
  'ram-navami': {
    tradition: 'vaishnava',
    note: {
      en: 'Vaishnavas may observe a day later if Navami is Viddha',
      hi: 'विद्ध होने पर वैष्णव एक दिन बाद मना सकते हैं',
    },
    detail: {
      en: 'Ram Navami follows the Madhyahna rule (Rama was born at noon). Vaishnavas additionally check that Navami is not Viddha by Ashtami at Arunodaya. If it is, they postpone. Smartas accept the Madhyahna-prevalent Navami regardless of Viddha status.',
      hi: 'रामनवमी मध्याह्न नियम का पालन करती है (राम का जन्म दोपहर में हुआ)। वैष्णव अतिरिक्त रूप से जाँचते हैं कि नवमी अरुणोदय में अष्टमी से विद्ध तो नहीं। विद्ध होने पर वे अगले दिन मनाते हैं। स्मार्त मध्याह्न-प्रबल नवमी स्वीकार करते हैं।',
    },
  },

  // ── Gauri Tritiya / Gangaur ──
  'gangaur': {
    tradition: 'vaishnava',
    note: {
      en: 'Minor divergence possible on Tritiya timing',
      hi: 'तृतीया समय पर मामूली भेद संभव',
    },
    detail: {
      en: 'Gangaur follows Chaitra Shukla Tritiya. Viddha rejection is rare but possible when Tritiya starts very late on the previous day.',
      hi: 'गणगौर चैत्र शुक्ल तृतीया पर आती है। विद्धा अस्वीकृति दुर्लभ लेकिन संभव है जब तृतीया पिछले दिन बहुत देर से शुरू होती है।',
    },
  },
};

/**
 * Get the Smarta/Vaishnava divergence note for a festival, if any.
 * Checks both the exact slug and the 'ekadashi' category match.
 */
export function getSmartaVaishnavNote(slug: string): SmartaVaishnavNote | null {
  // Direct slug match
  if (SMARTA_VAISHNAVA_NOTES[slug]) return SMARTA_VAISHNAVA_NOTES[slug];

  // Ekadashi category match (all ekadashi slugs contain 'ekadashi')
  if (slug.includes('ekadashi')) return SMARTA_VAISHNAVA_NOTES['ekadashi'];

  return null;
}
