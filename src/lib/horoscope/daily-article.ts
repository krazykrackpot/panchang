/**
 * Daily Horoscope Article Generator
 * Produces SEO-optimized, Google Discover-friendly content from panchang data.
 * No AI/LLM — pure deterministic content from astronomical calculations.
 */

import { computePanchang } from '@/lib/ephem/panchang-calc';
import { RASHIS } from '@/lib/constants/rashis';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

const RASHI_THEMES: Record<number, { en: string; hi: string }> = {
  1:  { en: 'energy and initiative', hi: 'ऊर्जा और पहल' },
  2:  { en: 'stability and finances', hi: 'स्थिरता और वित्त' },
  3:  { en: 'communication and learning', hi: 'संचार और शिक्षा' },
  4:  { en: 'home and emotions', hi: 'घर और भावनाएं' },
  5:  { en: 'creativity and romance', hi: 'रचनात्मकता और प्रेम' },
  6:  { en: 'health and service', hi: 'स्वास्थ्य और सेवा' },
  7:  { en: 'partnerships and balance', hi: 'साझेदारी और संतुलन' },
  8:  { en: 'transformation and depth', hi: 'परिवर्तन और गहराई' },
  9:  { en: 'wisdom and travel', hi: 'ज्ञान और यात्रा' },
  10: { en: 'career and ambition', hi: 'करियर और महत्वाकांक्षा' },
  11: { en: 'community and gains', hi: 'समुदाय और लाभ' },
  12: { en: 'spirituality and rest', hi: 'आध्यात्मिकता और विश्राम' },
};

const TITHI_ENERGY: Record<string, { en: string; hi: string }> = {
  shukla: { en: 'waxing energy favors new beginnings and growth', hi: 'शुक्ल पक्ष की बढ़ती ऊर्जा नई शुरुआत के लिए अनुकूल' },
  krishna: { en: 'waning energy supports reflection and completion', hi: 'कृष्ण पक्ष की घटती ऊर्जा चिंतन और पूर्णता के लिए अनुकूल' },
};

interface DailyArticle {
  slug: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  body: { en: string; hi: string };
  date: string;
  publishedAt: string;
}

export function generateDailyArticle(date: Date): DailyArticle {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Compute for Delhi (most relevant for Indian audience)
  const panchang = computePanchang({
    year, month, day,
    lat: 28.6139, lng: 77.2090, tzOffset: 5.5,
    timezone: 'Asia/Kolkata', locationName: 'India',
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

  const slug = `daily-panchang-${dateStr}`;

  const title = {
    en: `${varName} Panchang ${dateFormatted} — ${tithiName}, ${nakName}`,
    hi: `${panchang.vara.name.hi} पंचांग ${dateFormattedHi} — ${panchang.tithi.name.hi}, ${panchang.nakshatra.name.hi}`,
  };

  const description = {
    en: `Today's Vedic Panchang: ${tithiName} tithi, ${nakName} nakshatra, ${yogaName} yoga. Sunrise ${panchang.sunrise}, Rahu Kaal ${panchang.rahuKaal.start}–${panchang.rahuKaal.end}. Complete daily guidance.`,
    hi: `आज का वैदिक पंचांग: ${panchang.tithi.name.hi} तिथि, ${panchang.nakshatra.name.hi} नक्षत्र, ${panchang.yoga.name.hi} योग। सूर्योदय ${panchang.sunrise}, राहु काल ${panchang.rahuKaal.start}–${panchang.rahuKaal.end}।`,
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

  const body = {
    en: `## ${varName}, ${dateFormatted}

### Five Elements of the Day

Today's panchang is defined by **${tithiName}** tithi under **${nakName}** nakshatra, with **${yogaName}** yoga active. The ${tithiEnergy.en}.

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

    hi: `## ${panchang.vara.name.hi}, ${dateFormattedHi}

### आज के पाँच अंग

आज का पंचांग **${panchang.tithi.name.hi}** तिथि, **${panchang.nakshatra.name.hi}** नक्षत्र और **${panchang.yoga.name.hi}** योग से परिभाषित है। ${tithiEnergy.hi}।

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
  };
}
