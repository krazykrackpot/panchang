/**
 * Plain-language labels for the 12 bhavas (houses) of a Vedic chart.
 *
 * Three forms per house, each localised to all 9 active locales:
 *   - `shortLabel`: one-word watermark for chart overlays
 *     ("Self", "Money", "Siblings"). Designed to fit inside a small
 *     diamond/grid cell at 10-12px.
 *   - `longName`: 1-3 word full name ("Self & Identity",
 *     "Wealth & Speech", "Career & Status"). For sidebars and
 *     legend popovers.
 *   - `sanskritName`: the canonical Bhava name in Devanagari
 *     ("तनु भाव", "धन भाव") — kept identical across all locales since
 *     it's a proper noun.
 *
 * Locale fallback: locales without explicit values fall back to English
 * for `shortLabel`/`longName`. Sanskrit name is a constant.
 */

export interface HouseMeaning {
  num: number;
  shortLabel: Record<string, string>;
  longName: Record<string, string>;
  sanskritName: string;
}

export const HOUSE_MEANINGS: HouseMeaning[] = [
  {
    num: 1,
    sanskritName: 'तनु भाव',
    shortLabel: {
      en: 'Self', hi: 'स्व', sa: 'तनु', mr: 'स्व', mai: 'स्व',
      ta: 'சுயம்', te: 'స్వీయ', bn: 'স্বয়ং', kn: 'ಸ್ವಯಂ', gu: 'સ્વ',
    },
    longName: {
      en: 'Self & Identity', hi: 'स्व व पहचान', sa: 'तनु भाव', mr: 'स्व व ओळख', mai: 'स्व आ पहिचान',
      ta: 'சுயம் & அடையாளம்', te: 'స్వీయ & గుర్తింపు', bn: 'স্বয়ং ও পরিচয়', kn: 'ಸ್ವಯಂ ಮತ್ತು ಗುರುತು', gu: 'સ્વ અને ઓળખ',
    },
  },
  {
    num: 2,
    sanskritName: 'धन भाव',
    shortLabel: {
      en: 'Money', hi: 'धन', sa: 'धन', mr: 'धन', mai: 'धन',
      ta: 'செல்வம்', te: 'ధనం', bn: 'ধন', kn: 'ಧನ', gu: 'ધન',
    },
    longName: {
      en: 'Wealth & Speech', hi: 'धन व वाणी', sa: 'धन भाव', mr: 'धन व वाणी', mai: 'धन आ वाणी',
      ta: 'செல்வம் & பேச்சு', te: 'ధనం & వాక్కు', bn: 'ধন ও বাক্য', kn: 'ಧನ ಮತ್ತು ವಾಕ್', gu: 'ધન અને વાણી',
    },
  },
  {
    num: 3,
    sanskritName: 'सहज भाव',
    shortLabel: {
      en: 'Siblings', hi: 'भाई', sa: 'सहज', mr: 'भाऊ', mai: 'भाइ',
      ta: 'உடன்பிறப்பு', te: 'తోబుట్టువులు', bn: 'ভাইবোন', kn: 'ಸಹೋದರ', gu: 'ભાઈ',
    },
    longName: {
      en: 'Siblings & Courage', hi: 'भाई व साहस', sa: 'सहज भाव', mr: 'भाऊ व धैर्य', mai: 'भाइ आ साहस',
      ta: 'உடன்பிறந்தோர் & தைரியம்', te: 'తోబుట్టువులు & ధైర్యం', bn: 'ভাইবোন ও সাহস', kn: 'ಸಹೋದರ ಮತ್ತು ಧೈರ್ಯ', gu: 'ભાઈ અને હિંમત',
    },
  },
  {
    num: 4,
    sanskritName: 'सुख भाव',
    shortLabel: {
      en: 'Home', hi: 'घर', sa: 'सुख', mr: 'घर', mai: 'घर',
      ta: 'வீடு', te: 'ఇల్లు', bn: 'বাড়ি', kn: 'ಮನೆ', gu: 'ઘર',
    },
    longName: {
      en: 'Home & Mother', hi: 'घर व माता', sa: 'सुख भाव', mr: 'घर व माता', mai: 'घर आ माता',
      ta: 'வீடு & தாய்', te: 'ఇల్లు & తల్లి', bn: 'বাড়ি ও মাতা', kn: 'ಮನೆ ಮತ್ತು ತಾಯಿ', gu: 'ઘર અને માતા',
    },
  },
  {
    num: 5,
    sanskritName: 'पुत्र भाव',
    shortLabel: {
      en: 'Creativity', hi: 'सृजन', sa: 'पुत्र', mr: 'सृजन', mai: 'सृजन',
      ta: 'படைப்பு', te: 'సృజన', bn: 'সৃজন', kn: 'ಸೃಜನ', gu: 'સર્જન',
    },
    longName: {
      en: 'Children & Creativity', hi: 'सन्तान व सृजन', sa: 'पुत्र भाव', mr: 'सन्तान व सृजन', mai: 'सन्तान आ सृजन',
      ta: 'குழந்தைகள் & படைப்பு', te: 'సంతానం & సృజన', bn: 'সন্তান ও সৃজন', kn: 'ಮಕ್ಕಳು ಮತ್ತು ಸೃಜನ', gu: 'સંતાન અને સર્જન',
    },
  },
  {
    num: 6,
    sanskritName: 'अरि भाव',
    shortLabel: {
      en: 'Health', hi: 'स्वास्थ्य', sa: 'अरि', mr: 'आरोग्य', mai: 'स्वास्थ्य',
      ta: 'ஆரோக்கியம்', te: 'ఆరోగ్యం', bn: 'স্বাস্থ্য', kn: 'ಆರೋಗ್ಯ', gu: 'સ્વાસ્થ્ય',
    },
    longName: {
      en: 'Health & Service', hi: 'स्वास्थ्य व सेवा', sa: 'अरि भाव', mr: 'आरोग्य व सेवा', mai: 'स्वास्थ्य आ सेवा',
      ta: 'ஆரோக்கியம் & சேவை', te: 'ఆరోగ్యం & సేవ', bn: 'স্বাস্থ্য ও সেবা', kn: 'ಆರೋಗ್ಯ ಮತ್ತು ಸೇವೆ', gu: 'સ્વાસ્થ્ય અને સેવા',
    },
  },
  {
    num: 7,
    sanskritName: 'युवति भाव',
    shortLabel: {
      en: 'Partners', hi: 'साथी', sa: 'युवति', mr: 'जोडीदार', mai: 'साथी',
      ta: 'துணை', te: 'భాగస్వామి', bn: 'সঙ্গী', kn: 'ಸಂಗಾತಿ', gu: 'સાથી',
    },
    longName: {
      en: 'Marriage & Partners', hi: 'विवाह व साथी', sa: 'युवति भाव', mr: 'विवाह व जोडीदार', mai: 'विवाह आ साथी',
      ta: 'திருமணம் & துணை', te: 'వివాహం & భాగస్వామి', bn: 'বিবাহ ও সঙ্গী', kn: 'ವಿವಾಹ ಮತ್ತು ಸಂಗಾತಿ', gu: 'લગ્ન અને સાથી',
    },
  },
  {
    num: 8,
    sanskritName: 'रन्ध्र भाव',
    shortLabel: {
      en: 'Change', hi: 'परिवर्तन', sa: 'रन्ध्र', mr: 'परिवर्तन', mai: 'परिवर्तन',
      ta: 'மாற்றம்', te: 'మార్పు', bn: 'পরিবর্তন', kn: 'ಬದಲಾವಣೆ', gu: 'પરિવર્તન',
    },
    longName: {
      en: 'Transformation', hi: 'रूपान्तर', sa: 'रन्ध्र भाव', mr: 'रूपांतर', mai: 'रूपान्तर',
      ta: 'பரிணாமம்', te: 'రూపాంతరం', bn: 'রূপান্তর', kn: 'ರೂಪಾಂತರ', gu: 'રૂપાંતર',
    },
  },
  {
    num: 9,
    sanskritName: 'धर्म भाव',
    shortLabel: {
      en: 'Wisdom', hi: 'धर्म', sa: 'धर्म', mr: 'धर्म', mai: 'धर्म',
      ta: 'தர்மம்', te: 'ధర్మం', bn: 'ধর্ম', kn: 'ಧರ್ಮ', gu: 'ધર્મ',
    },
    longName: {
      en: 'Wisdom & Dharma', hi: 'ज्ञान व धर्म', sa: 'धर्म भाव', mr: 'ज्ञान व धर्म', mai: 'ज्ञान आ धर्म',
      ta: 'ஞானம் & தர்மம்', te: 'జ్ఞానం & ధర్మం', bn: 'জ্ঞান ও ধর্ম', kn: 'ಜ್ಞಾನ ಮತ್ತು ಧರ್ಮ', gu: 'જ્ઞાન અને ધર્મ',
    },
  },
  {
    num: 10,
    sanskritName: 'कर्म भाव',
    shortLabel: {
      en: 'Career', hi: 'कर्म', sa: 'कर्म', mr: 'कर्म', mai: 'कर्म',
      ta: 'தொழில்', te: 'వృత్తి', bn: 'কর্ম', kn: 'ವೃತ್ತಿ', gu: 'કારકિર્દી',
    },
    longName: {
      en: 'Career & Status', hi: 'करियर व पद', sa: 'कर्म भाव', mr: 'करियर व पद', mai: 'करियर आ पद',
      ta: 'தொழில் & அந்தஸ்து', te: 'వృత్తి & హోదా', bn: 'কর্ম ও মর্যাদা', kn: 'ವೃತ್ತಿ ಮತ್ತು ಸ್ಥಾನ', gu: 'કારકિર્દી અને દરજ્જો',
    },
  },
  {
    num: 11,
    sanskritName: 'लाभ भाव',
    shortLabel: {
      en: 'Gains', hi: 'लाभ', sa: 'लाभ', mr: 'लाभ', mai: 'लाभ',
      ta: 'ஆதாயம்', te: 'లాభం', bn: 'লাভ', kn: 'ಲಾಭ', gu: 'લાભ',
    },
    longName: {
      en: 'Gains & Network', hi: 'लाभ व मित्र-वर्ग', sa: 'लाभ भाव', mr: 'लाभ व मित्रवर्ग', mai: 'लाभ आ मित्रवर्ग',
      ta: 'ஆதாயம் & நட்பு', te: 'లాభం & స్నేహవర్గం', bn: 'লাভ ও বন্ধুবর্গ', kn: 'ಲಾಭ ಮತ್ತು ಸ್ನೇಹಿತರು', gu: 'લાભ અને મિત્રવર્ગ',
    },
  },
  {
    num: 12,
    sanskritName: 'व्यय भाव',
    shortLabel: {
      en: 'Release', hi: 'व्यय', sa: 'व्यय', mr: 'व्यय', mai: 'व्यय',
      ta: 'விடுதலை', te: 'మోక్షం', bn: 'মোক্ষ', kn: 'ಮುಕ್ತಿ', gu: 'મુક્તિ',
    },
    longName: {
      en: 'Liberation & Loss', hi: 'मोक्ष व व्यय', sa: 'व्यय भाव', mr: 'मोक्ष व व्यय', mai: 'मोक्ष आ व्यय',
      ta: 'மோட்சம் & இழப்பு', te: 'మోక్షం & వ్యయం', bn: 'মোক্ষ ও ব্যয়', kn: 'ಮೋಕ್ಷ ಮತ್ತು ವ್ಯಯ', gu: 'મોક્ષ અને વ્યય',
    },
  },
];

/** Pick the localised shortLabel for a house. Falls back to English. */
export function houseShortLabel(houseNum: number, locale: string): string {
  const h = HOUSE_MEANINGS[houseNum - 1];
  if (!h) return '';
  return h.shortLabel[locale] ?? h.shortLabel.en;
}

/** Pick the localised longName for a house. Falls back to English. */
export function houseLongName(houseNum: number, locale: string): string {
  const h = HOUSE_MEANINGS[houseNum - 1];
  if (!h) return '';
  return h.longName[locale] ?? h.longName.en;
}
