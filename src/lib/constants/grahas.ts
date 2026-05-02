import { Graha } from '@/types/panchang';

export const GRAHAS: Graha[] = [
  { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', mr: 'सूर्य', gu: 'સૂર્ય', mai: 'सूर्य' }, symbol: '☉', color: '#e67e22' },
  { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', mr: 'चन्द्र', gu: 'ચંદ્ર', mai: 'चन्द्र' }, symbol: '☽', color: '#ecf0f1' },
  { id: 2, name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', mr: 'मंगळ', gu: 'મંગળ', mai: 'मंगल' }, symbol: '♂', color: '#e74c3c' },
  { id: 3, name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', mr: 'बुध', gu: 'બુધ', mai: 'बुध' }, symbol: '☿', color: '#2ecc71' },
  { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', ta: 'குரு', te: 'గురు', bn: 'বৃহস্পতি', kn: 'ಗುರು', mr: 'बृहस्पति', gu: 'બૃહસ્પતિ', mai: 'बृहस्पति' }, symbol: '♃', color: '#f39c12' },
  { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', mr: 'शुक्र', gu: 'શુક્ર', mai: 'शुक्र' }, symbol: '♀', color: '#e8e6e3' },
  { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', mr: 'शनि', gu: 'શનિ', mai: 'शनि' }, symbol: '♄', color: '#3498db' },
  { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः', ta: 'ராகு', te: 'రాహు', bn: 'রাহু', kn: 'ರಾಹು', mr: 'राहु', gu: 'રાહુ', mai: 'राहु' }, symbol: '☊', color: '#8e44ad' },
  { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः', ta: 'கேது', te: 'కేతు', bn: 'কেতু', kn: 'ಕೇತು', mr: 'केतु', gu: 'કેતુ', mai: 'केतु' }, symbol: '☋', color: '#95a5a6' },
];

export const GRAHA_ABBREVIATIONS: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

/**
 * Vara (weekday) data with quality classification per Muhurta Chintamani + Dharmasindhu.
 *
 * quality: universal auspiciousness for general new ventures
 * bestFor/avoidFor: activity-specific guidance
 * score: 0-100 universal vara quality for scoring
 * rulerPlanetId: planet ID (0=Sun..6=Saturn) for birth chart integration
 */
export const VARA_QUALITY: Record<number, {
  quality: { en: string; hi: string };
  score: number;
  rulerPlanetId: number;
  bestFor: { en: string; hi: string };
  avoidFor: { en: string; hi: string };
}> = {
  0: { quality: { en: 'Mixed', hi: 'मिश्र' }, score: 50, rulerPlanetId: 0, bestFor: { en: 'Government work, authority, medicine, fire rituals', hi: 'सरकारी कार्य, अधिकार, औषधि, अग्नि कर्म' }, avoidFor: { en: 'Travel, marriage, new partnerships', hi: 'यात्रा, विवाह, नई साझेदारी' } },
  1: { quality: { en: 'Auspicious', hi: 'शुभ' }, score: 70, rulerPlanetId: 1, bestFor: { en: 'Travel, new clothes, agriculture, water-related, devotion', hi: 'यात्रा, नए वस्त्र, कृषि, जल सम्बन्धी, भक्ति' }, avoidFor: { en: 'Surgery, conflict', hi: 'शल्य चिकित्सा, विवाद' } },
  2: { quality: { en: 'Caution', hi: 'सावधानी' }, score: 30, rulerPlanetId: 2, bestFor: { en: 'Land purchase, surgery, courage, competition, Hanuman puja', hi: 'भूमि क्रय, शल्य, साहस, प्रतियोगिता, हनुमान पूजा' }, avoidFor: { en: 'Marriage, new ventures, travel', hi: 'विवाह, नया उद्यम, यात्रा' } },
  3: { quality: { en: 'Auspicious', hi: 'शुभ' }, score: 70, rulerPlanetId: 3, bestFor: { en: 'Education, business, communication, writing, contracts', hi: 'शिक्षा, व्यापार, संवाद, लेखन, अनुबन्ध' }, avoidFor: { en: 'Agriculture, long-term commitments', hi: 'कृषि, दीर्घकालिक प्रतिबद्धताएँ' } },
  4: { quality: { en: 'Most Auspicious', hi: 'सर्वश्रेष्ठ शुभ' }, score: 80, rulerPlanetId: 4, bestFor: { en: 'Marriage, learning, rituals, investments, new ventures, teaching', hi: 'विवाह, शिक्षा, अनुष्ठान, निवेश, नया उद्यम, शिक्षण' }, avoidFor: { en: 'Surgery, harsh actions', hi: 'शल्य, कठोर कार्य' } },
  5: { quality: { en: 'Auspicious', hi: 'शुभ' }, score: 70, rulerPlanetId: 5, bestFor: { en: 'Marriage, art, music, luxury, romance, beauty', hi: 'विवाह, कला, संगीत, विलास, प्रणय, सौन्दर्य' }, avoidFor: { en: 'Surgery, conflict, fire-related', hi: 'शल्य, विवाद, अग्नि कार्य' } },
  6: { quality: { en: 'Caution', hi: 'सावधानी' }, score: 30, rulerPlanetId: 6, bestFor: { en: 'Iron/oil work, service to elderly, Saturn remedies, chronic treatment', hi: 'लोहा/तेल कार्य, वृद्ध सेवा, शनि उपाय, दीर्घ चिकित्सा' }, avoidFor: { en: 'Marriage, new ventures, travel, ceremonies', hi: 'विवाह, नया उद्यम, यात्रा, शुभ संस्कार' } },
};

export const VARA_DATA = [
  { day: 0, name: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः', ta: 'ஞாயிறு', te: 'ఆదివారం', bn: 'রবিবার', kn: 'ಭಾನುವಾರ', mr: 'रविवार', gu: 'રવિવાર', mai: 'रविवार' }, ruler: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', mr: 'सूर्य', gu: 'સૂર્ય', mai: 'सूर्य' } },
  { day: 1, name: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः', ta: 'திங்கள்', te: 'సోమవారం', bn: 'সোমবার', kn: 'ಸೋಮವಾರ', mr: 'सोमवार', gu: 'સોમવાર', mai: 'सोमवार' }, ruler: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', mr: 'चन्द्र', gu: 'ચંદ્ર', mai: 'चन्द्र' } },
  { day: 2, name: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः', ta: 'செவ்வாய்', te: 'మంగళవారం', bn: 'মঙ্গলবার', kn: 'ಮಂಗಳವಾರ', mr: 'मंगळवार', gu: 'મંગળવાર', mai: 'मंगलवार' }, ruler: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', mr: 'मंगळ', gu: 'મંગળ', mai: 'मंगल' } },
  { day: 3, name: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', ta: 'புதன்', te: 'బుధవారం', bn: 'বুধবার', kn: 'ಬುಧವಾರ', mr: 'बुधवार', gu: 'બુધવાર', mai: 'बुधवार' }, ruler: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', mr: 'बुध', gu: 'બુધ', mai: 'बुध' } },
  { day: 4, name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः', ta: 'வியாழன்', te: 'గురువారం', bn: 'বৃহস্পতিবার', kn: 'ಗುರುವಾರ', mr: 'गुरुवार', gu: 'ગુરુવાર', mai: 'गुरुवार' }, ruler: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', ta: 'குரு', te: 'గురు', bn: 'বৃহস্পতি', kn: 'ಗುರು', mr: 'बृहस्पति', gu: 'બૃહસ્પતિ', mai: 'बृहस्पति' } },
  { day: 5, name: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः', ta: 'வெள்ளி', te: 'శుక్రవారం', bn: 'শুক্রবার', kn: 'ಶುಕ್ರವಾರ', mr: 'शुक्रवार', gu: 'શુક્રવાર', mai: 'शुक्रवार' }, ruler: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', mr: 'शुक्र', gu: 'શુક્ર', mai: 'शुक्र' } },
  { day: 6, name: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः', ta: 'சனி', te: 'శనివారం', bn: 'শনিবার', kn: 'ಶನಿವಾರ', mr: 'शनिवार', gu: 'શનિવાર', mai: 'शनिवार' }, ruler: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', mr: 'शनि', gu: 'શનિ', mai: 'शनि' } },
];
