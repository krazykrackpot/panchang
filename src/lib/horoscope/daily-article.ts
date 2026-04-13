import type { LocaleText } from '@/types/panchang';
/**
 * Daily Horoscope Article Generator
 * Produces SEO-optimized, Google Discover-friendly content from panchang data.
 * No AI/LLM — pure deterministic content from astronomical calculations.
 */

import { computePanchang } from '@/lib/ephem/panchang-calc';
import { RASHIS } from '@/lib/constants/rashis';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

const RASHI_THEMES: Record<number, LocaleText> = {
  1:  { en: 'energy and initiative', hi: 'ऊर्जा और पहल', sa: 'ऊर्जा और पहल', mai: 'ऊर्जा और पहल', mr: 'ऊर्जा और पहल', ta: 'ஆற்றல் மற்றும் முன்முயற்சி', te: 'శక్తి మరియు చొరవ', bn: 'শক্তি এবং উদ্যোগ', kn: 'ಶಕ್ತಿ ಮತ್ತು ಉಪಕ್ರಮ', gu: 'ઊર્જા અને પહેલ' },
  2:  { en: 'stability and finances', hi: 'स्थिरता और वित्त', sa: 'स्थिरता और वित्त', mai: 'स्थिरता और वित्त', mr: 'स्थिरता और वित्त', ta: 'நிலைத்தன்மை மற்றும் நிதி', te: 'స్థిరత్వం మరియు ఆర్థికం', bn: 'স্থিতিশীলতা এবং অর্থ', kn: 'ಸ್ಥಿರತೆ ಮತ್ತು ಹಣಕಾಸು', gu: 'સ્થિરતા અને નાણાં' },
  3:  { en: 'communication and learning', hi: 'संचार और शिक्षा', sa: 'संचार और शिक्षा', mai: 'संचार और शिक्षा', mr: 'संचार और शिक्षा', ta: 'தகவல் தொடர்பு மற்றும் கற்றல்', te: 'సంభాషణ మరియు అభ్యాసం', bn: 'যোগাযোগ এবং শিক্ষা', kn: 'ಸಂವಹನ ಮತ್ತು ಕಲಿಕೆ', gu: 'સંવાદ અને શીખવું' },
  4:  { en: 'home and emotions', hi: 'घर और भावनाएं', sa: 'घर और भावनाएं', mai: 'घर और भावनाएं', mr: 'घर और भावनाएं', ta: 'வீடு மற்றும் உணர்வுகள்', te: 'ఇల్లు మరియు భావోద్వేగాలు', bn: 'গৃহ এবং আবেগ', kn: 'ಮನೆ ಮತ್ತು ಭಾವನೆಗಳು', gu: 'ઘર અને લાગણીઓ' },
  5:  { en: 'creativity and romance', hi: 'रचनात्मकता और प्रेम', sa: 'रचनात्मकता और प्रेम', mai: 'रचनात्मकता और प्रेम', mr: 'रचनात्मकता और प्रेम', ta: 'படைப்பாற்றல் மற்றும் காதல்', te: 'సృజనాత్మకత మరియు ప్రేమ', bn: 'সৃজনশীলতা এবং প্রেম', kn: 'ಸೃಜನಶೀಲತೆ ಮತ್ತು ಪ್ರೇಮ', gu: 'સર્જનાત્મકતા અને પ્રેમ' },
  6:  { en: 'health and service', hi: 'स्वास्थ्य और सेवा', sa: 'स्वास्थ्य और सेवा', mai: 'स्वास्थ्य और सेवा', mr: 'स्वास्थ्य और सेवा', ta: 'ஆரோக்கியம் மற்றும் சேவை', te: 'ఆరోగ్యం మరియు సేవ', bn: 'স্বাস্থ্য এবং সেবা', kn: 'ಆರೋಗ್ಯ ಮತ್ತು ಸೇವೆ', gu: 'આરોગ્ય અને સેવા' },
  7:  { en: 'partnerships and balance', hi: 'साझेदारी और संतुलन', sa: 'साझेदारी और संतुलन', mai: 'साझेदारी और संतुलन', mr: 'साझेदारी और संतुलन', ta: 'கூட்டாண்மை மற்றும் சமநிலை', te: 'భాగస్వామ్యం మరియు సమతుల్యం', bn: 'অংশীদারিত্ব এবং ভারসাম্য', kn: 'ಪಾಲುದಾರಿಕೆ ಮತ್ತು ಸಮತೋಲನ', gu: 'ભાગીદારી અને સંતુલન' },
  8:  { en: 'transformation and depth', hi: 'परिवर्तन और गहराई', sa: 'परिवर्तन और गहराई', mai: 'परिवर्तन और गहराई', mr: 'परिवर्तन और गहराई', ta: 'உருமாற்றம் மற்றும் ஆழம்', te: 'పరివర్తన మరియు లోతు', bn: 'রূপান্তর এবং গভীরতা', kn: 'ಪರಿವರ್ತನೆ ಮತ್ತು ಆಳ', gu: 'પરિવર્તન અને ઊંડાણ' },
  9:  { en: 'wisdom and travel', hi: 'ज्ञान और यात्रा', sa: 'ज्ञान और यात्रा', mai: 'ज्ञान और यात्रा', mr: 'ज्ञान और यात्रा', ta: 'ஞானம் மற்றும் பயணம்', te: 'జ్ఞానం మరియు ప్రయాణం', bn: 'জ্ঞান এবং ভ্রমণ', kn: 'ಜ್ಞಾನ ಮತ್ತು ಪ್ರಯಾಣ', gu: 'જ્ઞાન અને મુસાફરી' },
  10: { en: 'career and ambition', hi: 'करियर और महत्वाकांक्षा', sa: 'करियर और महत्वाकांक्षा', mai: 'करियर और महत्वाकांक्षा', mr: 'करियर और महत्वाकांक्षा', ta: 'தொழில் மற்றும் லட்சியம்', te: 'వృత్తి మరియు ఆశయం', bn: 'কর্মজীবন এবং উচ্চাকাঙ্ক্ষা', kn: 'ವೃತ್ತಿ ಮತ್ತು ಮಹತ್ವಾಕಾಂಕ್ಷೆ', gu: 'કારકિર્દી અને મહત્ત્વાકાંક્ષા' },
  11: { en: 'community and gains', hi: 'समुदाय और लाभ', sa: 'समुदाय और लाभ', mai: 'समुदाय और लाभ', mr: 'समुदाय और लाभ', ta: 'சமூகம் மற்றும் லாபம்', te: 'సమాజం మరియు లాభాలు', bn: 'সম্প্রদায় এবং লাভ', kn: 'ಸಮುದಾಯ ಮತ್ತು ಲಾಭ', gu: 'સમુદાય અને લાભ' },
  12: { en: 'spirituality and rest', hi: 'आध्यात्मिकता और विश्राम', sa: 'आध्यात्मिकता और विश्राम', mai: 'आध्यात्मिकता और विश्राम', mr: 'आध्यात्मिकता और विश्राम', ta: 'ஆன்மிகம் மற்றும் ஓய்வு', te: 'ఆధ్యాత్మికత మరియు విశ్రాంతి', bn: 'আধ্যাত্মিকতা এবং বিশ্রাম', kn: 'ಆಧ್ಯಾತ್ಮಿಕತೆ ಮತ್ತು ವಿಶ್ರಾಂತಿ', gu: 'આધ્યાત્મિકતા અને આરામ' },
};

const TITHI_ENERGY: Record<string, LocaleText> = {
  shukla: { en: 'waxing energy favors new beginnings and growth', hi: 'शुक्ल पक्ष की बढ़ती ऊर्जा नई शुरुआत के लिए अनुकूल', sa: 'शुक्ल पक्ष की बढ़ती ऊर्जा नई शुरुआत के लिए अनुकूल', mai: 'शुक्ल पक्ष की बढ़ती ऊर्जा नई शुरुआत के लिए अनुकूल', mr: 'शुक्ल पक्ष की बढ़ती ऊर्जा नई शुरुआत के लिए अनुकूल', ta: 'வளர்பிறை ஆற்றல் புதிய தொடக்கங்களுக்கும் வளர்ச்சிக்கும் உகந்தது', te: 'వృద్ధి చెందుతున్న శక్తి కొత్త ప్రారంభాలకు మరియు అభివృద్ధికి అనుకూలం', bn: 'শুক্লপক্ষের বর্ধমান শক্তি নতুন সূচনা ও বৃদ্ধির জন্য অনুকূল', kn: 'ಬೆಳೆಯುತ್ತಿರುವ ಶಕ್ತಿ ಹೊಸ ಆರಂಭಗಳಿಗೆ ಮತ್ತು ಬೆಳವಣಿಗೆಗೆ ಅನುಕೂಲ', gu: 'વધતી ઊર્જા નવી શરૂઆત અને વૃદ્ધિ માટે અનુકૂળ છે' },
  krishna: { en: 'waning energy supports reflection and completion', hi: 'कृष्ण पक्ष की घटती ऊर्जा चिंतन और पूर्णता के लिए अनुकूल', sa: 'कृष्ण पक्ष की घटती ऊर्जा चिंतन और पूर्णता के लिए अनुकूल', mai: 'कृष्ण पक्ष की घटती ऊर्जा चिंतन और पूर्णता के लिए अनुकूल', mr: 'कृष्ण पक्ष की घटती ऊर्जा चिंतन और पूर्णता के लिए अनुकूल', ta: 'தேய்பிறை ஆற்றல் சிந்தனை மற்றும் நிறைவுக்கு உதவுகிறது', te: 'క్షీణిస్తున్న శక్తి ఆత్మపరిశీలన మరియు పూర్తికి తోడ్పడుతుంది', bn: 'কৃষ্ণপক্ষের ক্ষীয়মাণ শক্তি চিন্তন ও সমাপ্তির জন্য সহায়ক', kn: 'ಕ್ಷೀಣಿಸುತ್ತಿರುವ ಶಕ್ತಿ ಚಿಂತನೆ ಮತ್ತು ಪೂರ್ಣಗೊಳಿಸುವಿಕೆಗೆ ಬೆಂಬಲ', gu: 'ઘટતી ઊર્જા ચિંતન અને પૂર્ણતા માટે અનુકૂળ છે' },
};

export interface ArticleCityConfig {
  name: string;
  nameHi: string;
  lat: number;
  lng: number;
  timezone: string;
}

const DELHI_DEFAULT: ArticleCityConfig = {
  name: 'Delhi', nameHi: 'दिल्ली',
  lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata',
};

interface DailyArticle {
  slug: string;
  title: LocaleText;
  description: LocaleText;
  body: LocaleText;
  date: string;
  publishedAt: string;
  cityName?: string;
}

export function generateDailyArticle(date: Date, city?: ArticleCityConfig): DailyArticle {
  const c = city || DELHI_DEFAULT;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const tzOffset = getUTCOffsetForDate(year, month, day, c.timezone);

  const panchang = computePanchang({
    year, month, day,
    lat: c.lat, lng: c.lng, tzOffset,
    timezone: c.timezone, locationName: c.name,
  });

  const tithiName = panchang.tithi.name.en;
  const nakName = panchang.nakshatra.name.en;
  const yogaName = panchang.yoga.name.en;
  const varName = panchang.vara.name.en;
  const paksha = panchang.tithi.paksha;
  const moonSignNum = panchang.moonSign?.rashi || 1;
  const moonTheme = RASHI_THEMES[moonSignNum];
  const tithiEnergy = TITHI_ENERGY[paksha];

  const dateFormatted = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dateFormattedHi = date.toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const slug = city ? `daily-panchang-${dateStr}-${c.name.toLowerCase().replace(/\s+/g, '-')}` : `daily-panchang-${dateStr}`;
  const cityLabel = city ? ` — ${c.name}` : '';
  const cityLabelHi = city ? ` — ${c.nameHi}` : '';

  const title = {
    en: `${varName} Panchang ${dateFormatted}${cityLabel} — ${tithiName}, ${nakName}`,
    hi: `${panchang.vara.name.hi} पंचांग ${dateFormattedHi}${cityLabelHi} — ${panchang.tithi.name.hi}, ${panchang.nakshatra.name.hi}`,
  };

  const description = {
    en: `${city ? `${c.name} ` : ''}Vedic Panchang for ${dateFormatted}: ${tithiName} tithi, ${nakName} nakshatra, ${yogaName} yoga. Sunrise ${panchang.sunrise}, Rahu Kaal ${panchang.rahuKaal.start}–${panchang.rahuKaal.end}. Complete daily guidance.`,
    hi: `${city ? `${c.nameHi} ` : ''}वैदिक पंचांग ${dateFormattedHi}: ${panchang.tithi.name.hi} तिथि, ${panchang.nakshatra.name.hi} नक्षत्र, ${panchang.yoga.name.hi} योग। सूर्योदय ${panchang.sunrise}, राहु काल ${panchang.rahuKaal.start}–${panchang.rahuKaal.end}।`,
  };

  // Build article body
  const rahuWarning = `Rahu Kaal is from ${panchang.rahuKaal.start} to ${panchang.rahuKaal.end} — avoid starting important new work during this period.`;
  const rahuWarningHi = `राहु काल ${panchang.rahuKaal.start} से ${panchang.rahuKaal.end} तक है — इस अवधि में महत्वपूर्ण नए कार्य न करें।`;

  const varjyamNote = panchang.varjyam
    ? `Varjyam (inauspicious window) is active from ${panchang.varjyam.start} to ${panchang.varjyam.end}. Avoid initiating ventures during this time.`
    : 'No Varjyam today — the day is largely free of inauspicious windows.';
  const varjyamNoteHi = panchang.varjyam
    ? `वर्ज्यम् काल ${panchang.varjyam.start} से ${panchang.varjyam.end} तक सक्रिय है। इस समय नए कार्य न करें।`
    : 'आज कोई वर्ज्यम् नहीं — दिन अशुभ काल से मुक्त है।';

  const amritNote = panchang.amritKalam
    ? `Amrit Kalam (most auspicious window) runs from ${panchang.amritKalam.start} to ${panchang.amritKalam.end}. This is the best time for important decisions, ceremonies, and new ventures.`
    : '';
  const amritNoteHi = panchang.amritKalam
    ? `अमृत काल ${panchang.amritKalam.start} से ${panchang.amritKalam.end} तक है — महत्वपूर्ण निर्णयों, अनुष्ठानों और नए कार्यों के लिए सर्वोत्तम समय।`
    : '';

  const cityNarrative = city
    ? `\n\nIn ${c.name}, sunrise is at ${panchang.sunrise} and sunset at ${panchang.sunset}. The timings below are specific to ${c.name}'s coordinates (${c.lat.toFixed(2)}°N, ${Math.abs(c.lng).toFixed(2)}°${c.lng >= 0 ? 'E' : 'W'}).`
    : '';
  const cityNarrativeHi = city
    ? `\n\n${c.nameHi} में सूर्योदय ${panchang.sunrise} और सूर्यास्त ${panchang.sunset} पर है। नीचे दिए गए समय ${c.nameHi} के निर्देशांकों के अनुसार हैं।`
    : '';

  const body = {
    en: `## ${varName}, ${dateFormatted}${cityLabel}

### Five Elements of the Day

Today's panchang${city ? ` for ${c.name}` : ''} is defined by **${tithiName}** tithi under **${nakName}** nakshatra, with **${yogaName}** yoga active. The ${tithiEnergy.en}.${cityNarrative}

**Tithi:** ${tithiName} (${paksha === 'shukla' ? 'Shukla Paksha — Waxing Moon' : 'Krishna Paksha — Waning Moon'})
**Nakshatra:** ${nakName} — the Moon's position today influences ${moonTheme.en}.
**Yoga:** ${yogaName}
**Vara:** ${varName}

### Timings

- **Sunrise:** ${panchang.sunrise}
- **Sunset:** ${panchang.sunset}
${panchang.moonrise ? `- **Moonrise:** ${panchang.moonrise}` : ''}

### Auspicious & Inauspicious Windows

${rahuWarning}

${varjyamNote}

${amritNote}

**Yamaganda:** ${panchang.yamaganda.start}–${panchang.yamaganda.end}

### Guidance

The combination of ${tithiName} and ${nakName} makes today ${paksha === 'shukla' ? 'favorable for starting new projects, making purchases, and celebrations' : 'better suited for completing ongoing work, clearing debts, and spiritual practices'}. The ${yogaName} yoga adds ${yogaName === 'Siddhi' || yogaName === 'Amrit' || yogaName === 'Shubha' ? 'positive momentum' : yogaName === 'Vyatipata' || yogaName === 'Vaidhriti' ? 'caution — be mindful in decisions' : 'neutral energy'} to the day.

*For personalized panchang based on your location, visit [Dekho Panchang](https://dekhopanchang.com/en/panchang).*`,

    hi: `## ${panchang.vara.name.hi}, ${dateFormattedHi}${cityLabelHi}

### आज के पाँच अंग

आज का${city ? ` ${c.nameHi} का` : ''} पंचांग **${panchang.tithi.name.hi}** तिथि, **${panchang.nakshatra.name.hi}** नक्षत्र और **${panchang.yoga.name.hi}** योग से परिभाषित है। ${tithiEnergy.hi}।${cityNarrativeHi}

**तिथि:** ${panchang.tithi.name.hi} (${paksha === 'shukla' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष'})
**नक्षत्र:** ${panchang.nakshatra.name.hi} — आज चन्द्रमा की स्थिति ${moonTheme.hi} को प्रभावित करती है।
**योग:** ${panchang.yoga.name.hi}
**वार:** ${panchang.vara.name.hi}

### समय

- **सूर्योदय:** ${panchang.sunrise}
- **सूर्यास्त:** ${panchang.sunset}
${panchang.moonrise ? `- **चन्द्रोदय:** ${panchang.moonrise}` : ''}

### शुभ और अशुभ काल

${rahuWarningHi}

${varjyamNoteHi}

${amritNoteHi}

**यमगण्ड:** ${panchang.yamaganda.start}–${panchang.yamaganda.end}

### मार्गदर्शन

${panchang.tithi.name.hi} और ${panchang.nakshatra.name.hi} का संयोग आज ${paksha === 'shukla' ? 'नई परियोजनाओं, खरीदारी और उत्सवों के लिए अनुकूल' : 'चल रहे कार्यों को पूरा करने, ऋण चुकाने और आध्यात्मिक अभ्यास के लिए उपयुक्त'} बनाता है।

*अपने स्थान के अनुसार व्यक्तिगत पंचांग के लिए [देखो पंचांग](https://dekhopanchang.com/hi/panchang) पर जाएं।*`,
  };

  return {
    slug,
    title,
    description,
    body,
    date: dateStr,
    publishedAt: new Date(year, month - 1, day, 0, 30).toISOString(),
    cityName: city ? c.name : undefined,
  };
}
