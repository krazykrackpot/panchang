/**
 * Muntha calculation for Varshaphal
 * Muntha progresses one sign per year from birth lagna
 */

import { RASHIS } from '@/lib/constants/rashis';
import type { MunthaInfo } from '@/types/varshaphal';
import type { Trilingual } from '@/types/panchang';

const MUNTHA_HOUSE_INTERPRETATIONS: Record<number, Trilingual> = {
  1: {
    en: 'Muntha in 1st house: A year of personal growth, new beginnings, and strong vitality. Favorable for self-improvement.',
    hi: 'मुन्था प्रथम भाव में: व्यक्तिगत विकास, नई शुरुआत और मजबूत स्वास्थ्य का वर्ष।',
    sa: 'मुन्था प्रथमभावे: आत्मविकासस्य नवारम्भस्य च वर्षम्।',
  },
  2: {
    en: 'Muntha in 2nd house: Financial gains likely. Family matters come to focus. Good for accumulating wealth.',
    hi: 'मुन्था द्वितीय भाव में: आर्थिक लाभ की संभावना। पारिवारिक मामले महत्वपूर्ण।',
    sa: 'मुन्था द्वितीयभावे: धनलाभस्य सम्भावना। कुटुम्बविषयाः प्रमुखाः।',
  },
  3: {
    en: 'Muntha in 3rd house: Courage and initiative rewarded. Short travels and communication highlighted.',
    hi: 'मुन्था तृतीय भाव में: साहस और पहल को पुरस्कार। लघु यात्रा और संवाद प्रमुख।',
    sa: 'मुन्था तृतीयभावे: शौर्यं पुरस्क्रियते। लघुयात्रा संवादश्च प्रमुखौ।',
  },
  4: {
    en: 'Muntha in 4th house: Domestic happiness, property gains possible. Mother\'s influence strong.',
    hi: 'मुन्था चतुर्थ भाव में: घरेलू सुख, संपत्ति लाभ संभव। माता का प्रभाव।',
    sa: 'मुन्था चतुर्थभावे: गृहसुखं सम्पत्तिलाभश्च। मातुः प्रभावः बलवान्।',
  },
  5: {
    en: 'Muntha in 5th house: Creative expression, romance, and children matters favored. Speculative gains possible.',
    hi: 'मुन्था पंचम भाव में: रचनात्मकता, प्रेम और संतान विषय अनुकूल।',
    sa: 'मुन्था पञ्चमभावे: सृजनशीलता प्रेम सन्तानविषयाश्च अनुकूलाः।',
  },
  6: {
    en: 'Muntha in 6th house: Challenges from enemies and health issues. Victory through perseverance.',
    hi: 'मुन्था षष्ठ भाव में: शत्रुओं से चुनौती और स्वास्थ्य समस्याएं। धैर्य से विजय।',
    sa: 'मुन्था षष्ठभावे: शत्रुभ्यः आव्हानम्। धैर्येण विजयः।',
  },
  7: {
    en: 'Muntha in 7th house: Partnership and relationship matters prominent. Good for marriage and business alliances.',
    hi: 'मुन्था सप्तम भाव में: साझेदारी और संबंध प्रमुख। विवाह और व्यापार गठबंधन के लिए शुभ।',
    sa: 'मुन्था सप्तमभावे: भागीदारी सम्बन्धाश्च प्रमुखाः।',
  },
  8: {
    en: 'Muntha in 8th house: Transformative year. Hidden matters surface. Caution in health and finances advised.',
    hi: 'मुन्था अष्टम भाव में: परिवर्तनकारी वर्ष। छिपी बातें सामने आएं। स्वास्थ्य में सावधानी।',
    sa: 'मुन्था अष्टमभावे: परिवर्तनस्य वर्षम्। गूढविषयाः प्रकटन्ते।',
  },
  9: {
    en: 'Muntha in 9th house: Fortune smiles. Spiritual growth, long travels, and higher learning favored.',
    hi: 'मुन्था नवम भाव में: भाग्योदय। आध्यात्मिक विकास, दीर्घ यात्रा और उच्च शिक्षा अनुकूल।',
    sa: 'मुन्था नवमभावे: भाग्योदयः। आध्यात्मिकविकासः दीर्घयात्रा च अनुकूलौ।',
  },
  10: {
    en: 'Muntha in 10th house: Career advancement and professional recognition. Authority figures are supportive.',
    hi: 'मुन्था दशम भाव में: करियर में उन्नति और व्यावसायिक मान्यता। अधिकारियों का सहयोग।',
    sa: 'मुन्था दशमभावे: व्यवसायोन्नतिः व्यावसायिकमान्यता च।',
  },
  11: {
    en: 'Muntha in 11th house: Wishes fulfilled. Social network expands. Income gains from multiple sources.',
    hi: 'मुन्था एकादश भाव में: इच्छाएं पूरी होंगी। सामाजिक नेटवर्क बढ़ेगा। बहुमुखी आय।',
    sa: 'मुन्था एकादशभावे: इच्छापूर्तिः। सामाजिकसम्पर्कवृद्धिः।',
  },
  12: {
    en: 'Muntha in 12th house: Expenses increase. Spiritual retreat beneficial. Foreign connections possible.',
    hi: 'मुन्था द्वादश भाव में: खर्चों में वृद्धि। आध्यात्मिक एकांत लाभदायक। विदेशी संपर्क।',
    sa: 'मुन्था द्वादशभावे: व्ययवृद्धिः। आध्यात्मिकैकान्तं लाभदायकम्।',
  },
};

export function calculateMuntha(
  birthLagnaSign: number,
  age: number,
  varshaphalLagnaSign: number,
): MunthaInfo {
  const sign = ((birthLagnaSign - 1 + age) % 12) + 1;
  const rashi = RASHIS[sign - 1];
  const house = ((sign - varshaphalLagnaSign + 12) % 12) + 1;

  return {
    sign,
    signName: rashi.name,
    house,
    interpretation: MUNTHA_HOUSE_INTERPRETATIONS[house] || MUNTHA_HOUSE_INTERPRETATIONS[1],
  };
}
