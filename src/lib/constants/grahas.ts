import { Graha } from '@/types/panchang';

export const GRAHAS: Graha[] = [
  { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ' }, symbol: '☉', color: '#e67e22' },
  { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ' }, symbol: '☽', color: '#ecf0f1' },
  { id: 2, name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ' }, symbol: '♂', color: '#e74c3c' },
  { id: 3, name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ' }, symbol: '☿', color: '#2ecc71' },
  { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', ta: 'குரு', te: 'గురు', bn: 'বৃহস্পতি', kn: 'ಗುರು' }, symbol: '♃', color: '#f39c12' },
  { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ' }, symbol: '♀', color: '#e8e6e3' },
  { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ' }, symbol: '♄', color: '#3498db' },
  { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः', ta: 'ராகு', te: 'రాహు', bn: 'রাহু', kn: 'ರಾಹು' }, symbol: '☊', color: '#8e44ad' },
  { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः', ta: 'கேது', te: 'కేతు', bn: 'কেতু', kn: 'ಕೇತು' }, symbol: '☋', color: '#95a5a6' },
];

export const GRAHA_ABBREVIATIONS: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

export const VARA_DATA = [
  { day: 0, name: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः', ta: 'ஞாயிறு', te: 'ఆదివారం', bn: 'রবিবার', kn: 'ಭಾನುವಾರ' }, ruler: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ' } },
  { day: 1, name: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः', ta: 'திங்கள்', te: 'సోమవారం', bn: 'সোমবার', kn: 'ಸೋಮವಾರ' }, ruler: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ' } },
  { day: 2, name: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः', ta: 'செவ்வாய்', te: 'మంగళవారం', bn: 'মঙ্গলবার', kn: 'ಮಂಗಳವಾರ' }, ruler: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ' } },
  { day: 3, name: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', ta: 'புதன்', te: 'బుధవారం', bn: 'বুধবার', kn: 'ಬುಧವಾರ' }, ruler: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ' } },
  { day: 4, name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः', ta: 'வியாழன்', te: 'గురువారం', bn: 'বৃহস্পতিবার', kn: 'ಗುರುವಾರ' }, ruler: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', ta: 'குரு', te: 'గురు', bn: 'বৃহস্পতি', kn: 'ಗುರು' } },
  { day: 5, name: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः', ta: 'வெள்ளி', te: 'శుక్రవారం', bn: 'শুক্রবার', kn: 'ಶುಕ್ರವಾರ' }, ruler: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ' } },
  { day: 6, name: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः', ta: 'சனி', te: 'శనివారం', bn: 'শনিবার', kn: 'ಶನಿವಾರ' }, ruler: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ' } },
];
