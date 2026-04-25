/**
 * Dasha Diary prompt generator.
 *
 * Generates a personalised reflection prompt based on the current dasha lord's
 * natal placement.  The text is kept intentionally conversational — the goal is
 * to help the user connect classical Jyotish significations with their lived
 * experience, not to deliver a prediction.
 */

// ---------------------------------------------------------------------------
// House significations (English only — translated inline in callers via tl())
// ---------------------------------------------------------------------------
const HOUSE_KEYWORDS: Record<number, string> = {
  1:  'self, identity, body',
  2:  'wealth, speech, family',
  3:  'courage, communication, siblings',
  4:  'home, mother, inner peace',
  5:  'creativity, children, intelligence',
  6:  'health, service, daily routine',
  7:  'partnerships, marriage, contracts',
  8:  'transformation, hidden matters, longevity',
  9:  'dharma, higher learning, fortune',
  10: 'career, public status, authority',
  11: 'gains, friendships, aspirations',
  12: 'liberation, foreign travels, solitude',
};

// ---------------------------------------------------------------------------
// Planetary significations per locale
// ---------------------------------------------------------------------------
type SupportedLocale = 'en' | 'hi' | 'ta' | 'bn';

const PLANET_THEMES: Record<string, Record<SupportedLocale, string>> = {
  Sun: {
    en: 'authority, soul purpose, vitality, and father',
    hi: 'अधिकार, आत्मा, जीवनशक्ति और पिता',
    ta: 'அதிகாரம், ஆன்மா, உயிரியம் மற்றும் தந்தை',
    bn: 'কর্তৃত্ব, আত্মা, জীবনীশক্তি ও পিতা',
  },
  Moon: {
    en: 'emotions, mind, nurturing, and mother',
    hi: 'भावनाएँ, मन, पोषण और माता',
    ta: 'உணர்ச்சிகள், மனம், பரிபாலனம் மற்றும் தாய்',
    bn: 'আবেগ, মন, পরিপোষণ ও মাতা',
  },
  Mars: {
    en: 'energy, courage, property, and action',
    hi: 'ऊर्जा, साहस, संपत्ति और कर्म',
    ta: 'ஆற்றல், தைரியம், சொத்து மற்றும் செயல்',
    bn: 'শক্তি, সাহস, সম্পত্তি ও কর্ম',
  },
  Mercury: {
    en: 'intellect, communication, business, and analysis',
    hi: 'बुद्धि, संवाद, व्यापार और विश्लेषण',
    ta: 'அறிவு, தொடர்பாடல், வணிகம் மற்றும் ஆய்வு',
    bn: 'বুদ্ধি, যোগাযোগ, ব্যবসা ও বিশ্লেষণ',
  },
  Jupiter: {
    en: 'wisdom, expansion, children, and spiritual growth',
    hi: 'ज्ञान, विस्तार, संतान और आध्यात्मिक विकास',
    ta: 'ஞானம், விரிவாக்கம், குழந்தைகள் மற்றும் ஆன்மிக வளர்ச்சி',
    bn: 'জ্ঞান, প্রসার, সন্তান ও আধ্যাত্মিক বিকাশ',
  },
  Venus: {
    en: 'love, beauty, relationships, and creativity',
    hi: 'प्रेम, सौंदर्य, संबंध और सृजनात्मकता',
    ta: 'அன்பு, அழகு, உறவுகள் மற்றும் படைப்பாற்றல்',
    bn: 'প্রেম, সৌন্দর্য, সম্পর্ক ও সৃজনশীলতা',
  },
  Saturn: {
    en: 'discipline, karma, perseverance, and structure',
    hi: 'अनुशासन, कर्म, दृढ़ता और संरचना',
    ta: 'ஒழுக்கம், கர்மா, மன உறுதி மற்றும் அமைப்பு',
    bn: 'শৃঙ্খলা, কর্ম, অধ্যবসায় ও কাঠামো',
  },
  Rahu: {
    en: 'ambition, worldly desires, technology, and unconventional paths',
    hi: 'महत्वाकांक्षा, भौतिक इच्छाएँ, प्रौद्योगिकी और अपरंपरागत मार्ग',
    ta: 'லட்சியம், உலகியல் ஆசைகள், தொழில்நுட்பம் மற்றும் வழக்கத்திற்கு மாறான பாதைகள்',
    bn: 'উচ্চাকাঙ্ক্ষা, জাগতিক ইচ্ছা, প্রযুক্তি ও অপ্রচলিত পথ',
  },
  Ketu: {
    en: 'detachment, past karma, spirituality, and liberation',
    hi: 'वैराग्य, पूर्व कर्म, आध्यात्मिकता और मोक्ष',
    ta: 'பற்றின்மை, முன்வினை, ஆன்மிகம் மற்றும் விடுதலை',
    bn: 'বৈরাগ্য, পূর্বকর্ম, আধ্যাত্মিকতা ও মোক্ষ',
  },
};

// ---------------------------------------------------------------------------
// Closing reflection questions per locale
// ---------------------------------------------------------------------------
const REFLECTION_QUESTIONS: Record<SupportedLocale, string> = {
  en: 'What themes are emerging for you in this period? What are you being called to examine or release?',
  hi: 'इस अवधि में आपके जीवन में कौन से विषय उभर रहे हैं? आप किसे जाँचने या छोड़ने के लिए प्रेरित हो रहे हैं?',
  ta: 'இந்த காலகட்டத்தில் உங்கள் வாழ்வில் என்ன கருப்பொருள்கள் தோன்றுகின்றன? நீங்கள் எதை ஆராய அல்லது விட்டுவிட அழைக்கப்படுகிறீர்கள்?',
  bn: 'এই সময়কালে আপনার জীবনে কোন বিষয়গুলো উঠে আসছে? আপনাকে কী পরীক্ষা করতে বা ছেড়ে দিতে আহ্বান করা হচ্ছে?',
};

// ---------------------------------------------------------------------------
// Ordinal suffix (English only)
// ---------------------------------------------------------------------------
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a personalised dasha-boundary reflection prompt.
 *
 * @param planet        Planet name e.g. "Mars"
 * @param houseRuled    Houses ruled by the planet in the natal chart e.g. [3, 10]
 * @param signPlacement Human-readable sign placement e.g. "Capricorn (exalted)"
 * @param housePlacement Natal house the planet occupies (1-12)
 * @param locale        Active locale ("en" | "hi" | "ta" | "bn")
 * @param periodLabel   e.g. "Mahadasha" | "Antardasha" — defaults to "Dasha"
 * @returns A paragraph-length reflection prompt string
 */
export function generateDashaPrompt(
  planet: string,
  houseRuled: number[],
  signPlacement: string,
  housePlacement: number,
  locale: string,
  periodLabel = 'Dasha',
): string {
  const loc = (['en', 'hi', 'ta', 'bn'].includes(locale) ? locale : 'en') as SupportedLocale;
  const themes = PLANET_THEMES[planet]?.[loc] ?? PLANET_THEMES[planet]?.en ?? planet;
  const question = REFLECTION_QUESTIONS[loc];

  if (loc === 'en') {
    const ruledDesc = houseRuled.length > 0
      ? `rules your ${houseRuled.map(h => `${ordinal(h)} house (${HOUSE_KEYWORDS[h] ?? 'life area'})`).join(' and ')}`
      : 'influences your life broadly';
    return (
      `${planet} ${periodLabel} begins. ${planet} ${ruledDesc}, and sits in ${signPlacement} in your ${ordinal(housePlacement)} house. ` +
      `This is a period coloured by themes of ${themes}. ` +
      `Planets in the ${ordinal(housePlacement)} house tend to shape how these energies express outwardly in your experience. ` +
      question
    );
  }

  if (loc === 'hi') {
    const ruledDesc = houseRuled.length > 0
      ? houseRuled.map(h => `${h}वें भाव (${HOUSE_KEYWORDS[h] ?? 'जीवन क्षेत्र'}) का स्वामी`).join(' और ')
      : 'आपके जीवन को व्यापक रूप से प्रभावित करता है';
    return (
      `${planet} की ${periodLabel} आरंभ हो रही है। ${planet} आपकी जन्म कुण्डली में ${ruledDesc} है, ` +
      `और ${signPlacement} में ${housePlacement}वें भाव में स्थित है। ` +
      `यह काल ${themes} के विषयों से रंगा हुआ है। ` +
      question
    );
  }

  if (loc === 'ta') {
    const ruledDesc = houseRuled.length > 0
      ? houseRuled.map(h => `${h}வது இடத்தை (${HOUSE_KEYWORDS[h] ?? 'வாழ்க்கை துறை'}) ஆளுகிறது`).join(' மற்றும் ')
      : 'உங்கள் வாழ்க்கையில் பரவலான தாக்கம் செலுத்துகிறது';
    return (
      `${planet} தசை தொடங்குகிறது. ${planet} உங்கள் ஜாதகத்தில் ${ruledDesc}, ` +
      `${signPlacement} இல் ${housePlacement}வது இடத்தில் அமர்ந்துள்ளது. ` +
      `இது ${themes} ஆகிய கருப்பொருள்களால் நிறைந்த காலம். ` +
      question
    );
  }

  // bn
  const ruledDesc = houseRuled.length > 0
    ? houseRuled.map(h => `${h}ম ভাবের (${HOUSE_KEYWORDS[h] ?? 'জীবনক্ষেত্র'}) অধিপতি`).join(' এবং ')
    : 'আপনার জীবনে ব্যাপক প্রভাব রাখে';
  return (
    `${planet} দশা শুরু হচ্ছে। ${planet} আপনার জন্মকুণ্ডলীতে ${ruledDesc}, ` +
    `এবং ${signPlacement}-এ ${housePlacement}তম ভাবে অবস্থিত। ` +
    `এটি ${themes}-এর বিষয়ে রঙিন একটি কাল। ` +
    question
  );
}
