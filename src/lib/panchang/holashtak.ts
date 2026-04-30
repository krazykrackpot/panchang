/**
 * Holashtak (होलाष्टक) — the 8 inauspicious days before Holi.
 *
 * Holashtak runs from Shukla Ashtami to Shukla Purnima of Phalguna month
 * (Amanta reckoning). During these 8 days, all auspicious activities
 * (marriage, griha pravesh, mundan, new purchases) are avoided.
 *
 * The name comes from "Holi" + "Ashtak" (eight), referring to the 8-day
 * inauspicious period immediately preceding the festival of Holi.
 *
 * Reference: Dharma Sindhu, regional North Indian traditions.
 */

import type { LocaleText } from '@/types/panchang';

export interface HolashtakInfo {
  isActive: boolean;
  dayNumber: number | null;  // 1-8 (which day of Holashtak)
  description: { en: string; hi: string };
}

/** Activities to avoid during Holashtak. */
export const HOLASHTAK_AVOID_ACTIVITIES: { en: string; hi: string }[] = [
  { en: 'Marriage ceremonies', hi: 'विवाह संस्कार' },
  { en: 'Griha Pravesh (housewarming)', hi: 'गृह प्रवेश' },
  { en: 'Mundan (head shaving ceremony)', hi: 'मुंडन संस्कार' },
  { en: 'New purchases (vehicles, property)', hi: 'नई खरीदारी (वाहन, संपत्ति)' },
  { en: 'Starting new ventures', hi: 'नया व्यापार आरम्भ' },
  { en: 'Engagement or betrothal', hi: 'सगाई या वाग्दान' },
];

/**
 * Check if Holashtak is active based on tithi, masa, and paksha.
 *
 * Holashtak is active when:
 * - Month is Phalguna (amanta reckoning — per Lesson ZC, festival definitions use Amant months)
 * - Paksha is Shukla
 * - Tithi is 8 (Ashtami) through 15 (Purnima)
 * - Day number = tithiNumber - 7 (Ashtami=day 1, Navami=day 2, ... Purnima=day 8)
 *
 * @param tithiNumber — current tithi (1-30, where 1-15 = Shukla, 16-30 = Krishna)
 * @param masaAmanta — amanta month name (LocaleText). We match against .en for reliability.
 * @param paksha — 'shukla' or 'krishna'
 */
export function checkHolashtak(
  tithiNumber: number,
  masaAmanta: LocaleText | undefined,
  paksha: 'shukla' | 'krishna',
): HolashtakInfo {
  // Must be Phalguna month (amanta reckoning — per Lesson ZC)
  const masaEn = masaAmanta?.en?.toLowerCase() || '';
  const isPhalguna = masaEn === 'phalguna' || masaEn.startsWith('adhika phalguna');

  if (!isPhalguna || paksha !== 'shukla') {
    return {
      isActive: false,
      dayNumber: null,
      description: { en: '', hi: '' },
    };
  }

  // Shukla Ashtami (tithi 8) through Shukla Purnima (tithi 15)
  if (tithiNumber < 8 || tithiNumber > 15) {
    return {
      isActive: false,
      dayNumber: null,
      description: { en: '', hi: '' },
    };
  }

  const dayNumber = tithiNumber - 7; // Ashtami=1, Navami=2, ..., Purnima=8

  return {
    isActive: true,
    dayNumber,
    description: {
      en: `Holashtak Day ${dayNumber}/8 — All auspicious activities (marriage, griha pravesh, mundan, new purchases) are avoided during these 8 days before Holi.`,
      hi: `होलाष्टक दिवस ${dayNumber}/8 — होली से पूर्व इन 8 दिनों में सभी शुभ कार्य (विवाह, गृह प्रवेश, मुंडन, नई खरीदारी) वर्जित हैं।`,
    },
  };
}
