/**
 * Builds horoscope prompts from real planetary data.
 * Each Moon sign gets a prompt with actual transit positions.
 */

import type { PanchangData, Locale } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';

function signName(sign: number): string {
  return RASHIS[(sign - 1) % 12]?.name.en || `Sign ${sign}`;
}

export interface HoroscopePromptData {
  sign: number;
  signName: string;
  transits: { planet: string; transitSign: string; houseFromSign: number }[];
  tithi: string;
  nakshatra: string;
  yoga: string;
}

/**
 * Build transit data for a specific Moon sign
 */
export function buildTransitDataForSign(panchang: PanchangData, moonSign: number): HoroscopePromptData {
  const transits = panchang.planets.map(p => {
    const planetSign = p.rashi || 1;
    // House from Moon sign: (planetSign - moonSign + 12) % 12 + 1
    const houseFromSign = ((planetSign - moonSign + 12) % 12) + 1;
    return {
      planet: p.name.en,
      transitSign: signName(planetSign),
      houseFromSign,
    };
  });

  return {
    sign: moonSign,
    signName: signName(moonSign),
    transits,
    tithi: panchang.tithi.name.en,
    nakshatra: panchang.nakshatra.name.en,
    yoga: panchang.yoga.name.en,
  };
}

/**
 * Build the LLM prompt for a single sign's horoscope
 */
export function buildHoroscopePrompt(data: HoroscopePromptData): string {
  const lines: string[] = [];

  lines.push(`Today's planetary transits for ${data.signName} Moon sign:`);
  lines.push('');
  for (const t of data.transits) {
    const houseDesc = getHouseKeyword(t.houseFromSign);
    lines.push(`- ${t.planet} in ${t.transitSign} (${ordinal(t.houseFromSign)} house: ${houseDesc})`);
  }
  lines.push('');
  lines.push(`Tithi: ${data.tithi}`);
  lines.push(`Nakshatra: ${data.nakshatra}`);
  lines.push(`Yoga: ${data.yoga}`);
  lines.push('');
  lines.push(`Generate a 120-150 word daily horoscope for ${data.signName} Moon sign.`);
  lines.push('Include 2-3 specific, actionable insights based on the transit positions above.');
  lines.push('Tone: practical, grounded, warm. Reference specific planet positions naturally.');
  lines.push('Do NOT use generic filler. Every sentence should connect to a real transit.');

  return lines.join('\n');
}

/**
 * Build all 12 sign prompts at once
 */
export function buildAllHoroscopePrompts(panchang: PanchangData): HoroscopePromptData[] {
  return Array.from({ length: 12 }, (_, i) => buildTransitDataForSign(panchang, i + 1));
}

/**
 * Generate fallback horoscope (no LLM) from transit data
 */
export function buildFallbackHoroscope(data: HoroscopePromptData, locale: string): string {
  const moon = data.transits.find(t => t.planet === 'Moon');
  const jupiter = data.transits.find(t => t.planet === 'Jupiter');
  const saturn = data.transits.find(t => t.planet === 'Saturn');

  if (locale === 'hi') {
    const parts: string[] = [];
    if (moon) parts.push(`चन्द्रमा आपके ${moon.houseFromSign}वें भाव में — ${getHouseKeywordHi(moon.houseFromSign)}`);
    if (jupiter) parts.push(`गुरु ${jupiter.houseFromSign}वें भाव में — ${getHouseKeywordHi(jupiter.houseFromSign)}`);
    if (saturn) parts.push(`शनि ${saturn.houseFromSign}वें भाव में — ${getHouseKeywordHi(saturn.houseFromSign)}`);
    return parts.join('। ') + '।';
  }

  const parts: string[] = [];
  if (moon) parts.push(`Moon transits your ${ordinal(moon.houseFromSign)} house — ${getHouseKeyword(moon.houseFromSign)}`);
  if (jupiter) parts.push(`Jupiter in ${ordinal(jupiter.houseFromSign)} house — ${getHouseKeyword(jupiter.houseFromSign)}`);
  if (saturn) parts.push(`Saturn in ${ordinal(saturn.houseFromSign)} house — ${getHouseKeyword(saturn.houseFromSign)}`);
  return parts.join('. ') + '.';
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  return n + (s[(n - 20) % 10] || s[n] || s[0]);
}

function getHouseKeyword(h: number): string {
  const keywords: Record<number, string> = {
    1: 'self, personality, new beginnings',
    2: 'finances, family, speech',
    3: 'communication, siblings, courage',
    4: 'home, mother, emotional peace',
    5: 'creativity, children, romance',
    6: 'health, enemies, daily work',
    7: 'partnerships, marriage, contracts',
    8: 'transformation, sudden changes',
    9: 'fortune, spirituality, travel',
    10: 'career, public image, authority',
    11: 'gains, social network, aspirations',
    12: 'losses, spirituality, foreign lands',
  };
  return keywords[h] || '';
}

function getHouseKeywordHi(h: number): string {
  const keywords: Record<number, string> = {
    1: 'व्यक्तित्व, नई शुरुआत', 2: 'वित्त, परिवार', 3: 'संचार, साहस',
    4: 'गृह, मातृ सुख', 5: 'रचनात्मकता, संतान', 6: 'स्वास्थ्य, शत्रु',
    7: 'साझेदारी, विवाह', 8: 'परिवर्तन, आकस्मिक', 9: 'भाग्य, यात्रा',
    10: 'करियर, प्रतिष्ठा', 11: 'लाभ, सामाजिक', 12: 'व्यय, आध्यात्मिकता',
  };
  return keywords[h] || '';
}
