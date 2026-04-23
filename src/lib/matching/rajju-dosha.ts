/**
 * Rajju Dosha Analysis — South Indian (Tamil/Kerala) Matching System
 *
 * Rajju (cord/rope) classifies 27 nakshatras into 5 body-part groups.
 * If both partners' Moon nakshatras fall in the SAME Rajju group,
 * it indicates Rajju Dosha — severity depends on the group.
 *
 * Tradition: Tamil / South Indian Jyotish (not part of North Indian Ashta Kuta)
 * Reference: Muhurta Chintamani, Prasna Marga (South Indian tradition)
 */

import type { LocaleText } from '@/types/panchang';

export type RajjuGroup = 'pada' | 'kati' | 'nabhi' | 'kantha' | 'shiro';
export type RajjuSeverity = 'none' | 'mild' | 'moderate' | 'severe';

export interface RajjuDoshaResult {
  boyRajju: RajjuGroup;
  girlRajju: RajjuGroup;
  doshaPresent: boolean;
  severity: RajjuSeverity;
  /** Name of the matching group (en/hi/ta/sa) — or "Different Rajju" when no dosha */
  groupName: LocaleText;
  /** Interpretation of what the dosha (or its absence) means */
  description: LocaleText;
}

// ── Nakshatra → Rajju mapping (1-indexed nakshatras 1-27) ──────────────────

export const NAKSHATRA_RAJJU: Record<number, RajjuGroup> = {
  // Pada Rajju (Feet) — wandering / restlessness
  1: 'pada',  // Ashwini
  9: 'pada',  // Ashlesha
  10: 'pada', // Magha
  18: 'pada', // Jyeshtha
  19: 'pada', // Mula
  27: 'pada', // Revati

  // Kati Rajju (Waist) — poverty / financial hardship
  2: 'kati',  // Bharani
  8: 'kati',  // Pushya
  11: 'kati', // P.Phalguni
  17: 'kati', // Anuradha
  20: 'kati', // P.Ashadha
  26: 'kati', // U.Bhadrapada

  // Nabhi Rajju (Navel) — loss of children
  3: 'nabhi', // Krittika
  7: 'nabhi', // Punarvasu
  12: 'nabhi', // U.Phalguni
  16: 'nabhi', // Vishakha
  21: 'nabhi', // U.Ashadha
  25: 'nabhi', // P.Bhadrapada

  // Kantha Rajju (Neck) — death of wife (severe)
  4: 'kantha',  // Rohini
  6: 'kantha',  // Ardra
  13: 'kantha', // Hasta
  15: 'kantha', // Swati
  22: 'kantha', // Shravana
  24: 'kantha', // Shatabhisha

  // Shiro Rajju (Head) — death of husband (severe)
  5: 'shiro',  // Mrigashira
  14: 'shiro', // Chitra
  23: 'shiro', // Dhanishtha
};

// ── Rajju group metadata ─────────────────────────────────────────────────────

const RAJJU_NAMES: Record<RajjuGroup, LocaleText> = {
  pada: {
    en: 'Pada Rajju (Feet)',
    hi: 'पाद राजु (चरण)',
    ta: 'பாத ராஜ்ஜு (கால்)',
    sa: 'पादराज्जु',
    bn: 'পাদ রাজ্জু (পা)',
  },
  kati: {
    en: 'Kati Rajju (Waist)',
    hi: 'कटि राजु (कमर)',
    ta: 'கடி ராஜ்ஜு (இடுப்பு)',
    sa: 'कटिराज्जु',
    bn: 'কটি রাজ্জু (কোমর)',
  },
  nabhi: {
    en: 'Nabhi Rajju (Navel)',
    hi: 'नाभि राजु (नाभि)',
    ta: 'நாபி ராஜ்ஜு (நாபி)',
    sa: 'नाभिराज्जु',
    bn: 'নাভি রাজ্জু (নাভি)',
  },
  kantha: {
    en: 'Kantha Rajju (Neck)',
    hi: 'कण्ठ राजु (गर्दन)',
    ta: 'கண்ட ராஜ்ஜு (கழுத்து)',
    sa: 'कण्ठराज्जु',
    bn: 'কণ্ঠ রাজ্জু (গলা)',
  },
  shiro: {
    en: 'Shiro Rajju (Head)',
    hi: 'शिर राजु (सिर)',
    ta: 'சிர ராஜ்ஜு (தலை)',
    sa: 'शिरोराज्जु',
    bn: 'শিরো রাজ্জু (মাথা)',
  },
};

// ── Dosha descriptions per group ─────────────────────────────────────────────

const DOSHA_DESCRIPTIONS: Record<RajjuGroup, LocaleText> = {
  pada: {
    en: 'Same Pada Rajju (Feet): indicates wandering, restlessness, and instability. The couple may frequently relocate or face lack of settled life. Severity is mild — remedies and devotion can overcome this.',
    hi: 'एक ही पाद राजु (चरण): भटकाव, अस्थिरता और अशांति की संभावना। दंपत्ति बार-बार स्थान बदल सकते हैं। गंभीरता सौम्य है — उपाय और भक्ति से इसे दूर किया जा सकता है।',
    ta: 'ஒரே பாத ராஜ்ஜு (கால்): அலைச்சல், நிலையற்ற தன்மை மற்றும் ஓய்வின்மை குறிக்கிறது. தம்பதியர் அடிக்கடி இடம் மாறலாம். தீவிரம் மிதமானது — பரிகாரங்களால் கடக்கலாம்.',
    sa: 'एकपादराज्जुदोषः — भ्रमणम्, अस्थिरता च सूचयति। परिहारैः समाधानं संभवम्।',
    bn: 'একই পাদ রাজ্জু (পা): ভ্রমণশীলতা, অস্থিরতা এবং চঞ্চলতা নির্দেশ করে। দম্পতি ঘন ঘন স্থান পরিবর্তন করতে পারেন। তীব্রতা মৃদু — প্রতিকার ও ভক্তি দ্বারা এটি কাটিয়ে ওঠা যায়।',
  },
  kati: {
    en: 'Same Kati Rajju (Waist): indicates poverty, financial hardship, and material struggles throughout married life. The couple may face persistent economic challenges. Severity is mild — diligence and planetary remedies help.',
    hi: 'एक ही कटि राजु (कमर): दरिद्रता, आर्थिक कठिनाई और भौतिक संघर्ष की संभावना। दंपत्ति को आर्थिक चुनौतियों का सामना करना पड़ सकता है। गंभीरता सौम्य है।',
    ta: 'ஒரே கடி ராஜ்ஜு (இடுப்பு): வறுமை, பொருளாதார சிரமம் மற்றும் பொருளாதார போராட்டங்களை குறிக்கிறது. தீவிரம் மிதமானது.',
    sa: 'एककटिराज्जुदोषः — दारिद्र्यम्, आर्थिककष्टं च सूचयति।',
    bn: 'একই কটি রাজ্জু (কোমর): দারিদ্র্য, আর্থিক কষ্ট এবং বৈবাহিক জীবনে বৈষয়িক সংগ্রামের সম্ভাবনা। দম্পতি দীর্ঘস্থায়ী আর্থিক চ্যালেঞ্জের সম্মুখীন হতে পারেন। তীব্রতা মৃদু।',
  },
  nabhi: {
    en: 'Same Nabhi Rajju (Navel): indicates loss of children or difficulties in progeny. This is a moderate dosha affecting fertility and the welfare of children. Traditional remedies such as Santana Gopala puja are recommended.',
    hi: 'एक ही नाभि राजु (नाभि): संतान-हानि या संतान सम্बन्धी कठिनाइयों की संभावना। यह एक मध्यम दोष है। संतान गोपाल पूजा आदि उपाय उचित हैं।',
    ta: 'ஒரே நாபி ராஜ்ஜு (நாபி): பிள்ளைகளை இழக்கும் ஆபத்தை குறிக்கிறது. இது மிதமான தோஷம். சந்தான கோபால பூஜை பரிந்துரைக்கப்படுகிறது.',
    sa: 'एकनाभिराज्जुदोषः — अपत्यनाशं, सन्तानकष्टं च सूचयति। मध्यमदोषः।',
    bn: 'একই নাভি রাজ্জু (নাভি): সন্তান হারানো বা সন্তান সম্পর্কিত সমস্যার সম্ভাবনা। এটি একটি মধ্যম দোষ। সন্তান গোপাল পূজার মতো প্রতিকার সুপারিশ করা হয়।',
  },
  kantha: {
    en: 'Same Kantha Rajju (Neck): the most severe form — traditional texts indicate risk to the wife\'s life or health. An experienced jyotishi should be consulted for serious remedial measures before marriage.',
    hi: 'एक ही कण्ठ राजु (गर्दन): अत्यंत गंभीर दोष — पारंपरिक ग्रंथों के अनुसार पत्नी के जीवन या स्वास्थ्य पर खतरा। विवाह से पूर्व अनुभवी ज्योतिषी से परामर्श और उपाय आवश्यक हैं।',
    ta: 'ஒரே கண்ட ராஜ்ஜு (கழுத்து): மிக கடுமையான தோஷம் — மனைவியின் உயிருக்கு அல்லது உடல் நலத்திற்கு ஆபத்து என்று பாரம்பரிய நூல்கள் கூறுகின்றன. திருமணத்திற்கு முன் அனுபவமிக்க ஜோதிஷரை ஆலோசிக்கவும்.',
    sa: 'एककण्ठराज्जुदोषः — तीव्रदोषः, पत्नीजीवनं संकटे। अनुभवी ज्योतिषे परामर्शः आवश्यकः।',
    bn: 'একই কণ্ঠ রাজ্জু (গলা): সবচেয়ে গুরুতর দোষ — প্রাচীন গ্রন্থ অনুসারে স্ত্রীর জীবন বা স্বাস্থ্যের প্রতি ঝুঁকি। বিবাহের পূর্বে অভিজ্ঞ জ্যোতিষীর পরামর্শ ও প্রতিকার আবশ্যক।',
  },
  shiro: {
    en: 'Same Shiro Rajju (Head): the most severe form — traditional texts indicate risk to the husband\'s life or health. An experienced jyotishi should be consulted for serious remedial measures before marriage.',
    hi: 'एक ही शिर राजु (सिर): अत्यंत गंभीर दोष — पारंपरिक ग्रंथों के अनुसार पति के जीवन या स्वास्थ्य पर खतरा। विवाह से पूर्व अनुभवी ज्योतिषी से परामर्श और उपाय आवश्यक हैं।',
    ta: 'ஒரே சிர ராஜ்ஜு (தலை): மிக கடுமையான தோஷம் — கணவரின் உயிருக்கு அல்லது உடல் நலத்திற்கு ஆபத்து என்று பாரம்பரிய நூல்கள் கூறுகின்றன. திருமணத்திற்கு முன் அனுபவமிக்க ஜோதிஷரை ஆலோசிக்கவும்.',
    sa: 'एकशिरोराज्जुदोषः — तीव्रतमदोषः, पतिजीवनं संकटे। अनुभवी ज्योतिषे परामर्शः आवश्यकः।',
    bn: 'একই শিরো রাজ্জু (মাথা): সবচেয়ে গুরুতর দোষ — প্রাচীন গ্রন্থ অনুসারে স্বামীর জীবন বা স্বাস্থ্যের প্রতি ঝুঁকি। বিবাহের পূর্বে অভিজ্ঞ জ্যোতিষীর পরামর্শ ও প্রতিকার আবশ্যক।',
  },
};

const NO_DOSHA_DESCRIPTION: LocaleText = {
  en: 'Different Rajju groups — no Rajju Dosha. This is a favorable indicator for the longevity and wellbeing of both partners in marriage.',
  hi: 'भिन्न राजु समूह — कोई राजु दोष नहीं। यह विवाह में दोनों साथियों की दीर्घायु और कल्याण के लिए शुभ संकेत है।',
  ta: 'வேறுபட்ட ராஜ்ஜு குழுக்கள் — ராஜ்ஜு தோஷம் இல்லை. இது திருமணத்தில் இருவரின் நீண்ட ஆயுள் மற்றும் நலனுக்கான சாதகமான அறிகுறி.',
  sa: 'भिन्नराज्जुसमूहौ — राज्जुदोषो नास्ति। विवाहे उभयोः दीर्घायुः शुभम्।',
  bn: 'ভিন্ন রাজ্জু গোষ্ঠী — কোনো রাজ্জু দোষ নেই। এটি বিবাহে উভয় সঙ্গীর দীর্ঘায়ু ও কল্যাণের শুভ সংকেত।',
};

const NO_DOSHA_GROUP_NAME: LocaleText = {
  en: 'Different Rajju (Compatible)',
  hi: 'भिन्न राजु (अनुकूल)',
  ta: 'வேறு ராஜ்ஜு (ஒத்திசைவு)',
  sa: 'भिन्नराज्जु (अनुकूलम्)',
  bn: 'ভিন্ন রাজ্জু (সামঞ্জস্যপূর্ণ)',
};

// ── Severity mapping ──────────────────────────────────────────────────────────

const RAJJU_SEVERITY: Record<RajjuGroup, RajjuSeverity> = {
  pada: 'mild',
  kati: 'mild',
  nabhi: 'moderate',
  kantha: 'severe',
  shiro: 'severe',
};

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Analyze Rajju Dosha between two partners based on their Moon nakshatras.
 *
 * @param boyNakshatra  1-indexed Moon nakshatra (1=Ashwini … 27=Revati) of the boy/groom
 * @param girlNakshatra 1-indexed Moon nakshatra (1=Ashwini … 27=Revati) of the girl/bride
 * @returns RajjuDoshaResult with severity and trilingual descriptions
 */
export function analyzeRajjuDosha(boyNakshatra: number, girlNakshatra: number): RajjuDoshaResult {
  const boyRajju = NAKSHATRA_RAJJU[boyNakshatra];
  const girlRajju = NAKSHATRA_RAJJU[girlNakshatra];

  if (!boyRajju || !girlRajju) {
    // Guard: nakshatra id out of range — should never happen in practice
    console.error('[rajju-dosha] Invalid nakshatra id:', boyNakshatra, girlNakshatra);
    // Return safe default: no dosha
    return {
      boyRajju: boyRajju ?? 'pada',
      girlRajju: girlRajju ?? 'pada',
      doshaPresent: false,
      severity: 'none',
      groupName: NO_DOSHA_GROUP_NAME,
      description: NO_DOSHA_DESCRIPTION,
    };
  }

  if (boyRajju !== girlRajju) {
    return {
      boyRajju,
      girlRajju,
      doshaPresent: false,
      severity: 'none',
      groupName: NO_DOSHA_GROUP_NAME,
      description: NO_DOSHA_DESCRIPTION,
    };
  }

  // Same Rajju → dosha present
  return {
    boyRajju,
    girlRajju,
    doshaPresent: true,
    severity: RAJJU_SEVERITY[boyRajju],
    groupName: RAJJU_NAMES[boyRajju],
    description: DOSHA_DESCRIPTIONS[boyRajju],
  };
}
