/**
 * Shared helpers for tippanni modules
 * Utility functions for Vedic astrology calculations
 */

import type { Locale,  LocaleText } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';

export type Tri = LocaleText;

/** Create a trilingual object */
export function tri(en: string, hi: string, sa: string): Tri {
  return { en, hi, sa };
}

/** Resolve a Tri/LocaleText to a locale string */
export function triLocale(t: LocaleText, locale: Locale): string {
  return tl(t, locale);
}

// Sign lords: 1-based sign index -> planet ID (0-based)
// 1=Aries(Mars), 2=Taurus(Venus), 3=Gemini(Mercury), 4=Cancer(Moon),
// 5=Leo(Sun), 6=Virgo(Mercury), 7=Libra(Venus), 8=Scorpio(Mars),
// 9=Sagittarius(Jupiter), 10=Capricorn(Saturn), 11=Aquarius(Saturn), 12=Pisces(Jupiter)
const SIGN_LORDS: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

/** Get the ruling planet ID for a sign (1-based sign index) */
export function getSignLord(signNumber: number): number {
  return SIGN_LORDS[signNumber] ?? 0;
}

/** Get the lord of a house based on ascendant sign */
export function getHouseLord(houseNumber: number, ascSign: number): number {
  // House 1 = ascendant sign, house 2 = next sign, etc.
  const signOfHouse = ((ascSign - 1 + houseNumber - 1) % 12) + 1;
  return getSignLord(signOfHouse);
}

/** Get the sign number for a house (1-based) given ascendant sign (1-based) */
export function getHouseSign(houseNumber: number, ascSign: number): number {
  return ((ascSign - 1 + houseNumber - 1) % 12) + 1;
}

/** Kendra houses: 1, 4, 7, 10 */
export function isKendra(house: number): boolean {
  return [1, 4, 7, 10].includes(house);
}

/** Trikona houses: 1, 5, 9 */
export function isTrikona(house: number): boolean {
  return [1, 5, 9].includes(house);
}

/** Dusthana houses: 6, 8, 12 */
export function isDusthana(house: number): boolean {
  return [6, 8, 12].includes(house);
}

/** Upachaya houses: 3, 6, 10, 11 */
export function isUpachaya(house: number): boolean {
  return [3, 6, 10, 11].includes(house);
}

/** Natural benefics: Jupiter(4), Venus(5), Mercury(3), Moon(1 when waxing) */
export function isBenefic(planetId: number): boolean {
  return [1, 3, 4, 5].includes(planetId);
}

/** Natural malefics: Sun(0), Mars(2), Saturn(6), Rahu(7), Ketu(8) */
export function isMalefic(planetId: number): boolean {
  return [0, 2, 6, 7, 8].includes(planetId);
}

/** Calculate the house distance from one house to another (1-based, forward count) */
export function houseDistance(fromHouse: number, toHouse: number): number {
  return ((toHouse - fromHouse + 12) % 12) + 1;
}

/** Planet names in trilingual format */
export const PLANET_NAMES: Record<number, Tri> = {
  0: tri('Sun', 'सूर्य', 'सूर्यः'),
  1: tri('Moon', 'चन्द्रमा', 'चन्द्रः'),
  2: tri('Mars', 'मंगल', 'मङ्गलः'),
  3: tri('Mercury', 'बुध', 'बुधः'),
  4: tri('Jupiter', 'बृहस्पति', 'बृहस्पतिः'),
  5: tri('Venus', 'शुक्र', 'शुक्रः'),
  6: tri('Saturn', 'शनि', 'शनिः'),
  7: tri('Rahu', 'राहु', 'राहुः'),
  8: tri('Ketu', 'केतु', 'केतुः'),
};
