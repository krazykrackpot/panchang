import { Graha } from '@/types/panchang';

export const GRAHAS: Graha[] = [
  { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்' }, symbol: '☉', color: '#e67e22' },
  { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்' }, symbol: '☽', color: '#ecf0f1' },
  { id: 2, name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்' }, symbol: '♂', color: '#e74c3c' },
  { id: 3, name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', ta: 'புதன்' }, symbol: '☿', color: '#2ecc71' },
  { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', ta: 'குரு' }, symbol: '♃', color: '#f39c12' },
  { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்' }, symbol: '♀', color: '#e8e6e3' },
  { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', ta: 'சனி' }, symbol: '♄', color: '#3498db' },
  { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः', ta: 'ராகு' }, symbol: '☊', color: '#8e44ad' },
  { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः', ta: 'கேது' }, symbol: '☋', color: '#95a5a6' },
];

export const GRAHA_ABBREVIATIONS: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

export const VARA_DATA = [
  { day: 0, name: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः', ta: 'ஞாயிறு' }, ruler: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்' } },
  { day: 1, name: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः', ta: 'திங்கள்' }, ruler: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்' } },
  { day: 2, name: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः', ta: 'செவ்வாய்' }, ruler: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்' } },
  { day: 3, name: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', ta: 'புதன்' }, ruler: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', ta: 'புதன்' } },
  { day: 4, name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः', ta: 'வியாழன்' }, ruler: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', ta: 'குரு' } },
  { day: 5, name: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः', ta: 'வெள்ளி' }, ruler: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்' } },
  { day: 6, name: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः', ta: 'சனி' }, ruler: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', ta: 'சனி' } },
];
