import { Graha } from '@/types/panchang';

export const GRAHAS: Graha[] = [
  { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, symbol: '☉', color: '#e67e22' },
  { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, symbol: '☽', color: '#ecf0f1' },
  { id: 2, name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, symbol: '♂', color: '#e74c3c' },
  { id: 3, name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, symbol: '☿', color: '#2ecc71' },
  { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' }, symbol: '♃', color: '#f39c12' },
  { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, symbol: '♀', color: '#e8e6e3' },
  { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, symbol: '♄', color: '#3498db' },
  { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, symbol: '☊', color: '#8e44ad' },
  { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, symbol: '☋', color: '#95a5a6' },
];

export const GRAHA_ABBREVIATIONS: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

export const VARA_DATA = [
  { day: 0, name: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' }, ruler: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' } },
  { day: 1, name: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' }, ruler: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' } },
  { day: 2, name: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' }, ruler: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' } },
  { day: 3, name: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' }, ruler: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' } },
  { day: 4, name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' }, ruler: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' } },
  { day: 5, name: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' }, ruler: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' } },
  { day: 6, name: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' }, ruler: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' } },
];
