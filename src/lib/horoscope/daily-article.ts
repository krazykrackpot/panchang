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
  1:  { en: 'energy and initiative', hi: 'ऊर्जा और पहल', sa: 'ऊर्जा और पहल', mai: 'ऊर्जा और पहल', mr: 'ऊर्जा और पहल', ta: 'energy and initiative', te: 'energy and initiative', bn: 'energy and initiative', kn: 'energy and initiative', gu: 'energy and initiative' },
  2:  { en: 'stability and finances', hi: 'स्थिरता और वित्त', sa: 'स्थिरता और वित्त', mai: 'स्थिरता और वित्त', mr: 'स्थिरता और वित्त', ta: 'stability and finances', te: 'stability and finances', bn: 'stability and finances', kn: 'stability and finances', gu: 'stability and finances' },
  3:  { en: 'communication and learning', hi: 'संचार और शिक्षा', sa: 'संचार और शिक्षा', mai: 'संचार और शिक्षा', mr: 'संचार और शिक्षा', ta: 'communication and learning', te: 'communication and learning', bn: 'communication and learning', kn: 'communication and learning', gu: 'communication and learning' },
  4:  { en: 'home and emotions', hi: 'घर और भावनाएं', sa: 'घर और भावनाएं', mai: 'घर और भावनाएं', mr: 'घर और भावनाएं', ta: 'home and emotions', te: 'home and emotions', bn: 'home and emotions', kn: 'home and emotions', gu: 'home and emotions' },
  5:  { en: 'creativity and romance', hi: 'रचनात्मकता और प्रेम', sa: 'रचनात्मकता और प्रेम', mai: 'रचनात्मकता और प्रेम', mr: 'रचनात्मकता और प्रेम', ta: 'creativity and romance', te: 'creativity and romance', bn: 'creativity and romance', kn: 'creativity and romance', gu: 'creativity and romance' },
  6:  { en: 'health and service', hi: 'स्वास्थ्य और सेवा', sa: 'स्वास्थ्य और सेवा', mai: 'स्वास्थ्य और सेवा', mr: 'स्वास्थ्य और सेवा', ta: 'health and service', te: 'health and service', bn: 'health and service', kn: 'health and service', gu: 'health and service' },
  7:  { en: 'partnerships and balance', hi: 'साझेदारी और संतुलन', sa: 'साझेदारी और संतुलन', mai: 'साझेदारी और संतुलन', mr: 'साझेदारी और संतुलन', ta: 'partnerships and balance', te: 'partnerships and balance', bn: 'partnerships and balance', kn: 'partnerships and balance', gu: 'partnerships and balance' },
  8:  { en: 'transformation and depth', hi: 'परिवर्तन और गहराई', sa: 'परिवर्तन और गहराई', mai: 'परिवर्तन और गहराई', mr: 'परिवर्तन और गहराई', ta: 'transformation and depth', te: 'transformation and depth', bn: 'transformation and depth', kn: 'transformation and depth', gu: 'transformation and depth' },
  9:  { en: 'wisdom and travel', hi: 'ज्ञान और यात्रा', sa: 'ज्ञान और यात्रा', mai: 'ज्ञान और यात्रा', mr: 'ज्ञान और यात्रा', ta: 'wisdom and travel', te: 'wisdom and travel', bn: 'wisdom and travel', kn: 'wisdom and travel', gu: 'wisdom and travel' },
  10: { en: 'career and ambition', hi: 'करियर और महत्वाकांक्षा', sa: 'करियर और महत्वाकांक्षा', mai: 'करियर और महत्वाकांक्षा', mr: 'करियर और महत्वाकांक्षा', ta: 'career and ambition', te: 'career and ambition', bn: 'career and ambition', kn: 'career and ambition', gu: 'career and ambition' },
  11: { en: 'community and gains', hi: 'समुदाय और लाभ', sa: 'समुदाय और लाभ', mai: 'समुदाय और लाभ', mr: 'समुदाय और लाभ', ta: 'community and gains', te: 'community and gains', bn: 'community and gains', kn: 'community and gains', gu: 'community and gains' },
  12: { en: 'spirituality and rest', hi: 'आध्यात्मिकता और विश्राम', sa: 'आध्यात्मिकता और विश्राम', mai: 'आध्यात्मिकता और विश्राम', mr: 'आध्यात्मिकता और विश्राम', ta: 'spirituality and rest', te: 'spirituality and rest', bn: 'spirituality and rest', kn: 'spirituality and rest', gu: 'spirituality and rest' },
};

const TITHI_ENERGY: Record<string, LocaleText> = {
  shukla: { en: 'waxing energy favors new beginnings and growth', hi: 'शुक्ल पक्ष की बढ़ती ऊर्जा नई शुरुआत के लिए अनुकूल', sa: 'शुक्ल पक्ष की बढ़ती ऊर्जा नई शुरुआत के लिए अनुकूल', mai: 'शुक्ल पक्ष की बढ़ती ऊर्जा नई शुरुआत के लिए अनुकूल', mr: 'शुक्ल पक्ष की बढ़ती ऊर्जा नई शुरुआत के लिए अनुकूल', ta: 'waxing energy favors new beginnings and growth', te: 'waxing energy favors new beginnings and growth', bn: 'waxing energy favors new beginnings and growth', kn: 'waxing energy favors new beginnings and growth', gu: 'waxing energy favors new beginnings and growth' },
  krishna: { en: 'waning energy supports reflection and completion', hi: 'कृष्ण पक्ष की घटती ऊर्जा चिंतन और पूर्णता के लिए अनुकूल', sa: 'कृष्ण पक्ष की घटती ऊर्जा चिंतन और पूर्णता के लिए अनुकूल', mai: 'कृष्ण पक्ष की घटती ऊर्जा चिंतन और पूर्णता के लिए अनुकूल', mr: 'कृष्ण पक्ष की घटती ऊर्जा चिंतन और पूर्णता के लिए अनुकूल', ta: 'waning energy supports reflection and completion', te: 'waning energy supports reflection and completion', bn: 'waning energy supports reflection and completion', kn: 'waning energy supports reflection and completion', gu: 'waning energy supports reflection and completion' },
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
