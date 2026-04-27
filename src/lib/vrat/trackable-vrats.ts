/**
 * Trackable Vrat Definitions
 *
 * Master list of vrats users can follow for reminders. Includes tithi-based
 * recurring vrats (from MONTHLY_VRATS) and weekly day-based vrats.
 *
 * Each entry defines:
 *  - slug: unique identifier, used as key in the vrat-tracking store
 *  - name: trilingual display name (LocaleText)
 *  - frequency: human-readable recurrence label
 *  - category: 'ekadashi' | 'monthly' | 'weekly' grouping for UI display
 *  - calendarSlug: the slug used in FestivalEntry from the calendar generator,
 *    used to match upcoming dates from the API response
 */

import type { LocaleText } from '@/types/panchang';

export interface TrackableVrat {
  slug: string;
  name: LocaleText;
  frequency: LocaleText;
  category: 'ekadashi' | 'monthly' | 'weekly';
  calendarSlug: string; // matches FestivalEntry.slug from festival-generator
  description: LocaleText;
  deity: LocaleText;
}

export const TRACKABLE_VRATS: TrackableVrat[] = [
  // ─── Ekadashi ───
  {
    slug: 'ekadashi',
    name: { en: 'Ekadashi', hi: 'एकादशी', sa: 'एकादशी' },
    frequency: { en: 'Twice a month', hi: 'माह में दो बार', sa: 'मासे द्विवारम्' },
    category: 'ekadashi',
    calendarSlug: 'ekadashi',
    description: { en: 'Fasting on the 11th tithi for Lord Vishnu', hi: 'भगवान विष्णु के लिए एकादशी व्रत', sa: 'विष्णुव्रतम् एकादश्यां' },
    deity: { en: 'Lord Vishnu', hi: 'भगवान विष्णु', sa: 'श्रीविष्णुः' },
  },

  // ─── Monthly Recurring ───
  {
    slug: 'pradosham',
    name: { en: 'Pradosham', hi: 'प्रदोष', sa: 'प्रदोषः' },
    frequency: { en: 'Twice a month', hi: 'माह में दो बार', sa: 'मासे द्विवारम्' },
    category: 'monthly',
    calendarSlug: 'pradosham',
    description: { en: 'Evening worship of Lord Shiva on Trayodashi', hi: 'त्रयोदशी को शिव पूजा', sa: 'त्रयोदश्यां शिवपूजनम्' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'श्रीशिवः' },
  },
  {
    slug: 'sankashti-chaturthi',
    name: { en: 'Sankashti Chaturthi', hi: 'संकष्टी चतुर्थी', sa: 'सङ्कष्टचतुर्थी' },
    frequency: { en: 'Monthly', hi: 'मासिक', sa: 'मासिकम्' },
    category: 'monthly',
    calendarSlug: 'chaturthi',
    description: { en: 'Fasting for Lord Ganesha on Krishna Chaturthi', hi: 'कृष्ण चतुर्थी को गणेश व्रत', sa: 'कृष्णचतुर्थ्यां गणेशव्रतम्' },
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश', sa: 'श्रीगणेशः' },
  },
  {
    slug: 'vinayaka-chaturthi',
    name: { en: 'Vinayaka Chaturthi', hi: 'विनायक चतुर्थी', sa: 'विनायकचतुर्थी' },
    frequency: { en: 'Monthly', hi: 'मासिक', sa: 'मासिकम्' },
    category: 'monthly',
    calendarSlug: 'vinayaka-chaturthi',
    description: { en: 'Monthly Shukla Chaturthi vrat for Lord Ganesha', hi: 'शुक्ल चतुर्थी को गणेश व्रत', sa: 'शुक्लचतुर्थ्यां गणेशव्रतम्' },
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश', sa: 'श्रीगणेशः' },
  },
  {
    slug: 'masik-shivaratri',
    name: { en: 'Masik Shivaratri', hi: 'मासिक शिवरात्रि', sa: 'मासिकशिवरात्रिः' },
    frequency: { en: 'Monthly', hi: 'मासिक', sa: 'मासिकम्' },
    category: 'monthly',
    calendarSlug: 'masik-shivaratri',
    description: { en: 'Monthly Shivaratri on Krishna Chaturdashi', hi: 'कृष्ण चतुर्दशी को शिवरात्रि', sa: 'कृष्णचतुर्दश्यां शिवरात्रिः' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'श्रीशिवः' },
  },
  {
    slug: 'purnima',
    name: { en: 'Purnima Vrat', hi: 'पूर्णिमा व्रत', sa: 'पूर्णिमाव्रतम्' },
    frequency: { en: 'Monthly', hi: 'मासिक', sa: 'मासिकम्' },
    category: 'monthly',
    calendarSlug: 'purnima',
    description: { en: 'Full moon day fasting and Satyanarayan Puja', hi: 'पूर्णिमा व्रत और सत्यनारायण पूजा', sa: 'पूर्णिमायां व्रतं सत्यनारायणपूजनं च' },
    deity: { en: 'Lord Vishnu (Satyanarayan)', hi: 'भगवान सत्यनारायण', sa: 'श्रीसत्यनारायणः' },
  },
  {
    slug: 'amavasya',
    name: { en: 'Amavasya Tarpan', hi: 'अमावस्या तर्पण', sa: 'अमावस्यातर्पणम्' },
    frequency: { en: 'Monthly', hi: 'मासिक', sa: 'मासिकम्' },
    category: 'monthly',
    calendarSlug: 'amavasya',
    description: { en: 'New moon day for ancestral offerings (Pitru Tarpan)', hi: 'अमावस्या को पितृ तर्पण', sa: 'अमावस्यायां पितृतर्पणम्' },
    deity: { en: 'Pitru Devatas', hi: 'पितृ देवता', sa: 'पितृदेवताः' },
  },
  {
    slug: 'skanda-shashthi',
    name: { en: 'Skanda Shashthi', hi: 'स्कन्द षष्ठी', sa: 'स्कन्दषष्ठी' },
    frequency: { en: 'Monthly', hi: 'मासिक', sa: 'मासिकम्' },
    category: 'monthly',
    calendarSlug: 'skanda-shashthi',
    description: { en: 'Monthly Shukla Shashthi for Lord Murugan/Kartikeya', hi: 'शुक्ल षष्ठी को कार्तिकेय व्रत', sa: 'शुक्लषष्ठ्यां कार्तिकेयव्रतम्' },
    deity: { en: 'Lord Murugan', hi: 'भगवान कार्तिकेय', sa: 'श्रीकार्तिकेयः' },
  },

  // ─── Weekly Vrats ───
  {
    slug: 'somvar-vrat',
    name: { en: 'Somvar Vrat (Monday)', hi: 'सोमवार व्रत', sa: 'सोमवारव्रतम्' },
    frequency: { en: 'Weekly', hi: 'साप्ताहिक', sa: 'साप्ताहिकम्' },
    category: 'weekly',
    calendarSlug: 'somvar-vrat',
    description: { en: 'Weekly Monday fast for Lord Shiva', hi: 'हर सोमवार शिव व्रत', sa: 'प्रतिसोमवारे शिवव्रतम्' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'श्रीशिवः' },
  },
  {
    slug: 'mangalvar-vrat',
    name: { en: 'Mangalvar Vrat (Tuesday)', hi: 'मंगलवार व्रत', sa: 'मङ्गलवारव्रतम्' },
    frequency: { en: 'Weekly', hi: 'साप्ताहिक', sa: 'साप्ताहिकम्' },
    category: 'weekly',
    calendarSlug: 'mangalvar-vrat',
    description: { en: 'Weekly Tuesday fast for Lord Hanuman', hi: 'हर मंगलवार हनुमान व्रत', sa: 'प्रतिमङ्गलवारे हनुमद्व्रतम्' },
    deity: { en: 'Lord Hanuman', hi: 'भगवान हनुमान', sa: 'श्रीहनुमान्' },
  },
  {
    slug: 'guruvar-vrat',
    name: { en: 'Guruvar Vrat (Thursday)', hi: 'गुरुवार व्रत', sa: 'गुरुवारव्रतम्' },
    frequency: { en: 'Weekly', hi: 'साप्ताहिक', sa: 'साप्ताहिकम्' },
    category: 'weekly',
    calendarSlug: 'guruvar-vrat',
    description: { en: 'Weekly Thursday fast for Brihaspati/Vishnu', hi: 'हर गुरुवार बृहस्पति व्रत', sa: 'प्रतिगुरुवारे बृहस्पतिव्रतम्' },
    deity: { en: 'Lord Vishnu / Brihaspati', hi: 'भगवान विष्णु / बृहस्पति', sa: 'श्रीविष्णुः / बृहस्पतिः' },
  },
  {
    slug: 'shanivar-vrat',
    name: { en: 'Shanivar Vrat (Saturday)', hi: 'शनिवार व्रत', sa: 'शनिवारव्रतम्' },
    frequency: { en: 'Weekly', hi: 'साप्ताहिक', sa: 'साप्ताहिकम्' },
    category: 'weekly',
    calendarSlug: 'shanivar-vrat',
    description: { en: 'Weekly Saturday fast for Shani Dev', hi: 'हर शनिवार शनि व्रत', sa: 'प्रतिशनिवारे शनिव्रतम्' },
    deity: { en: 'Shani Dev', hi: 'शनि देव', sa: 'शनिदेवः' },
  },
];

/**
 * Get the next occurrences of weekly vrats.
 * Returns dates for the next `count` occurrences of the given day of week.
 * dayOfWeek: 0=Sunday, 1=Monday, 2=Tuesday, etc.
 */
export function getNextWeeklyDates(dayOfWeek: number, count: number = 4): string[] {
  const dates: string[] = [];
  const today = new Date();
  const current = new Date(today);

  // Move to the next occurrence of dayOfWeek
  const diff = (dayOfWeek - current.getDay() + 7) % 7;
  current.setDate(current.getDate() + (diff === 0 ? 0 : diff));

  for (let i = 0; i < count; i++) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 7);
  }
  return dates;
}

/** Map vrat slug to day of week (0=Sun..6=Sat). Returns null if not a weekly vrat. */
export function getWeeklyVratDay(slug: string): number | null {
  switch (slug) {
    case 'somvar-vrat': return 1;
    case 'mangalvar-vrat': return 2;
    case 'guruvar-vrat': return 4;
    case 'shanivar-vrat': return 6;
    default: return null;
  }
}
