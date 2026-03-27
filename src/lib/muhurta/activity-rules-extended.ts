/**
 * Extended Activity Rules for Muhurta AI
 * 20 activities with Tithi, Nakshatra, Weekday, Hora rules
 */

import type { ExtendedActivity, ExtendedActivityId } from '@/types/muhurta-ai';

export const EXTENDED_ACTIVITIES: Record<ExtendedActivityId, ExtendedActivity> = {
  marriage: {
    id: 'marriage',
    label: { en: 'Marriage (Vivah)', hi: 'विवाह', sa: 'विवाहः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [3, 4, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [5, 4, 1], // Venus, Jupiter, Moon
    relevantHouses: [2, 7, 11],
  },
  griha_pravesh: {
    id: 'griha_pravesh',
    label: { en: 'Griha Pravesh', hi: 'गृह प्रवेश', sa: 'गृहप्रवेशः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [4, 5, 1], // Jupiter, Venus, Moon
    relevantHouses: [4, 7, 10],
  },
  mundan: {
    id: 'mundan',
    label: { en: 'Mundan (First Haircut)', hi: 'मुण्डन', sa: 'मुण्डनम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 11, 12, 13, 20, 21, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [4, 5, 0], // Jupiter, Venus, Sun
    relevantHouses: [1, 5, 11],
  },
  vehicle: {
    id: 'vehicle',
    label: { en: 'Vehicle Purchase', hi: 'वाहन खरीद', sa: 'वाहनक्रयः' },
    goodTithis: [2, 3, 5, 6, 7, 10, 11, 12, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [5, 4, 3], // Venus, Jupiter, Mercury
    relevantHouses: [4, 9, 11],
  },
  travel: {
    id: 'travel',
    label: { en: 'Travel', hi: 'यात्रा', sa: 'यात्रा' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [3, 5, 1], // Mercury, Venus, Moon
    relevantHouses: [3, 9, 12],
  },
  property: {
    id: 'property',
    label: { en: 'Property Purchase', hi: 'भूमि/सम्पत्ति', sa: 'भूमिक्रयः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 23, 24, 26],
    goodHoras: [4, 5, 6], // Jupiter, Venus, Saturn
    relevantHouses: [4, 10, 11],
  },
  business: {
    id: 'business',
    label: { en: 'New Business', hi: 'नया व्यापार', sa: 'नवव्यापारः' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [3, 4, 5], // Mercury, Jupiter, Venus
    relevantHouses: [2, 7, 10, 11],
  },
  education: {
    id: 'education',
    label: { en: 'Education Start', hi: 'विद्यारम्भ', sa: 'विद्यारम्भः' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 23, 24, 26],
    goodHoras: [3, 4, 0], // Mercury, Jupiter, Sun
    relevantHouses: [4, 5, 9],
  },
  namakarana: {
    id: 'namakarana',
    label: { en: 'Namakarana (Naming)', hi: 'नामकरण', sa: 'नामकरणम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    goodNakshatras: [2, 3, 6, 7, 11, 12, 13, 20, 21, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [4, 5, 1], // Jupiter, Venus, Moon
    relevantHouses: [1, 5, 11],
  },
  upanayana: {
    id: 'upanayana',
    label: { en: 'Upanayana (Thread)', hi: 'उपनयन', sa: 'उपनयनम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [4, 0, 3], // Jupiter, Sun, Mercury
    relevantHouses: [1, 5, 9],
  },
  engagement: {
    id: 'engagement',
    label: { en: 'Engagement', hi: 'सगाई', sa: 'वाग्दानम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [3, 4, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [5, 4, 1], // Venus, Jupiter, Moon
    relevantHouses: [2, 7, 11],
  },
  gold_purchase: {
    id: 'gold_purchase',
    label: { en: 'Gold Purchase', hi: 'स्वर्ण खरीद', sa: 'स्वर्णक्रयः' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [4, 5, 0], // Jupiter, Venus, Sun
    relevantHouses: [2, 5, 11],
  },
  medical_treatment: {
    id: 'medical_treatment',
    label: { en: 'Medical Treatment', hi: 'चिकित्सा', sa: 'चिकित्सा' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 20, 21, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [4, 0, 1], // Jupiter, Sun, Moon
    relevantHouses: [1, 6, 11],
  },
  court_case: {
    id: 'court_case',
    label: { en: 'Court Case', hi: 'न्यायालय', sa: 'न्यायालयः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22],
    goodWeekdays: [1, 2, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [0, 4, 2], // Sun, Jupiter, Mars
    relevantHouses: [6, 7, 11],
  },
  exam: {
    id: 'exam',
    label: { en: 'Examination', hi: 'परीक्षा', sa: 'परीक्षा' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 23, 24, 26],
    goodHoras: [3, 4, 0], // Mercury, Jupiter, Sun
    relevantHouses: [4, 5, 9],
  },
  spiritual_practice: {
    id: 'spiritual_practice',
    label: { en: 'Spiritual Practice', hi: 'साधना', sa: 'साधना' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13, 15],
    goodNakshatras: [1, 2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [0, 1, 4],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [4, 0, 1], // Jupiter, Sun, Moon
    relevantHouses: [5, 9, 12],
  },
  agriculture: {
    id: 'agriculture',
    label: { en: 'Agriculture', hi: 'कृषि', sa: 'कृषिः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [1, 5, 4], // Moon, Venus, Jupiter
    relevantHouses: [4, 6, 11],
  },
  financial_signing: {
    id: 'financial_signing',
    label: { en: 'Financial Signing', hi: 'वित्तीय हस्ताक्षर', sa: 'वित्तहस्ताक्षरम्' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [3, 4, 5], // Mercury, Jupiter, Venus
    relevantHouses: [2, 6, 10, 11],
  },
  surgery: {
    id: 'surgery',
    label: { en: 'Surgery', hi: 'शल्य चिकित्सा', sa: 'शल्यचिकित्सा' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 20, 21, 25, 27],
    goodWeekdays: [1, 2, 4],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [2, 0, 4], // Mars, Sun, Jupiter
    relevantHouses: [1, 6, 8, 11],
  },
  relocation: {
    id: 'relocation',
    label: { en: 'Relocation', hi: 'स्थानान्तरण', sa: 'स्थानान्तरणम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
    goodHoras: [4, 5, 1], // Jupiter, Venus, Moon
    relevantHouses: [3, 4, 9, 12],
  },
};

export function getExtendedActivity(id: ExtendedActivityId): ExtendedActivity {
  return EXTENDED_ACTIVITIES[id];
}

export function getAllExtendedActivities(): ExtendedActivity[] {
  return Object.values(EXTENDED_ACTIVITIES);
}
