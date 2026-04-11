/**
 * Personalized Daily Horoscope Engine
 * Generates a daily reading using the user's full chart data:
 * - Natal ascendant + Moon sign
 * - Current dasha period (Maha + Antar)
 * - Slow planet transit houses + SAV scores
 * - Key natal yogas/doshas
 * - Today's tithi/nakshatra/yoga
 */

import type { PanchangData, Trilingual, Locale } from '@/types/panchang';
import { getPlanetaryPositions, toSidereal, dateToJD } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';

export interface PersonalChartSnapshot {
  name: string;
  ascendantSign: number;      // 1-12
  moonSign: number;           // 1-12
  currentMahaDasha: string;   // planet name
  currentAntarDasha: string;  // planet name
  savTable: number[];         // 12 sign SAV scores
  keyYogas: string[];         // e.g., ["Gajakesari", "Budhaditya"]
  keyDoshas: string[];        // e.g., ["Mangal Dosha (mild)"]
}

export interface PersonalizedHoroscopeData {
  chart: PersonalChartSnapshot;
  moonTransitHouse: number;
  moonTransitSign: number;
  slowTransits: { planet: string; sign: number; house: number; savBindu: number; isRetrograde: boolean }[];
  tithi: string;
  nakshatra: string;
  yoga: string;
  dayOfWeek: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function rashiName(sign: number): string {
  return RASHIS[(sign - 1) % 12]?.name.en || `Sign ${sign}`;
}

function rashiNameHi(sign: number): string {
  return RASHIS[(sign - 1) % 12]?.name.hi || `राशि ${sign}`;
}

const SLOW_IDS = [6, 4, 7, 8]; // Saturn, Jupiter, Rahu, Ketu

export function buildPersonalizedData(
  chart: PersonalChartSnapshot,
  panchang: PanchangData,
): PersonalizedHoroscopeData {
  const now = new Date();
  const jd = dateToJD(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), 12);
  const positions = getPlanetaryPositions(jd);

  // Moon transit
  const moonPos = positions.find(p => p.id === 1);
  const moonSidLon = moonPos ? toSidereal(moonPos.longitude, jd) : 0;
  const moonTransitSign = Math.floor(moonSidLon / 30) + 1;
  const moonTransitHouse = ((moonTransitSign - chart.ascendantSign + 12) % 12) + 1;

  // Slow planet transits
  const slowTransits = SLOW_IDS.map(pid => {
    const pos = positions.find(p => p.id === pid);
    if (!pos) return null;
    const sidLon = toSidereal(pos.longitude, jd);
    const sign = Math.floor(sidLon / 30) + 1;
    const house = ((sign - chart.ascendantSign + 12) % 12) + 1;
    return {
      planet: GRAHAS[pid]?.name.en || 'Planet',
      sign,
      house,
      savBindu: chart.savTable[sign - 1] || 25,
      isRetrograde: pos.speed < 0,
    };
  }).filter(Boolean) as PersonalizedHoroscopeData['slowTransits'];

  return {
    chart,
    moonTransitHouse,
    moonTransitSign,
    slowTransits,
    tithi: panchang.tithi.name.en,
    nakshatra: panchang.nakshatra.name.en,
    yoga: panchang.yoga.name.en,
    dayOfWeek: DAYS[now.getDay()],
  };
}

export function buildPersonalizedPrompt(data: PersonalizedHoroscopeData, locale: string): string {
  const lines: string[] = [];
  const c = data.chart;

  lines.push(`PERSONALIZED DAILY READING for ${c.name || 'the native'}`);
  lines.push(`Ascendant: ${rashiName(c.ascendantSign)}, Moon Sign: ${rashiName(c.moonSign)}`);
  lines.push(`Current Dasha: ${c.currentMahaDasha} Maha / ${c.currentAntarDasha} Antar`);
  lines.push('');

  lines.push(`TODAY'S TRANSITS (from ascendant):`);
  lines.push(`Moon in ${rashiName(data.moonTransitSign)} — ${ordinal(data.moonTransitHouse)} house from lagna`);
  for (const t of data.slowTransits) {
    const quality = t.savBindu >= 28 ? 'STRONG' : t.savBindu < 22 ? 'WEAK' : 'moderate';
    lines.push(`${t.planet} in ${rashiName(t.sign)} — ${ordinal(t.house)} house (SAV: ${t.savBindu} bindus = ${quality})${t.isRetrograde ? ' [RETROGRADE]' : ''}`);
  }
  lines.push('');

  lines.push(`Tithi: ${data.tithi} | Nakshatra: ${data.nakshatra} | Yoga: ${data.yoga} | Day: ${data.dayOfWeek}`);
  lines.push('');

  if (c.keyYogas.length > 0) lines.push(`Natal Yogas: ${c.keyYogas.join(', ')}`);
  if (c.keyDoshas.length > 0) lines.push(`Active Doshas: ${c.keyDoshas.join(', ')}`);
  lines.push('');

  if (locale === 'hi') {
    lines.push('कृपया 150-200 शब्दों में व्यक्तिगत दैनिक राशिफल लिखें।');
    lines.push('दशा स्वामी और गोचर ग्रहों के SAV बल के आधार पर विशिष्ट सलाह दें।');
    lines.push('3-4 क्रियाशील अंतर्दृष्टि शामिल करें। व्यावहारिक और सटीक रहें।');
  } else {
    lines.push('Generate a 150-200 word personalized daily horoscope.');
    lines.push('Reference the dasha lord and SAV-weighted transit strengths specifically.');
    lines.push('Include 3-4 actionable insights. Be practical, specific, and grounded.');
    lines.push('Mention the dasha period context (what themes the native is experiencing).');
    lines.push('Note any retrograde effects. Tone: warm, wise, direct.');
  }

  return lines.join('\n');
}

export function buildPersonalizedFallback(data: PersonalizedHoroscopeData, locale: string): string {
  const c = data.chart;
  const moonHouse = data.moonTransitHouse;
  const strongTransits = data.slowTransits.filter(t => t.savBindu >= 28);
  const weakTransits = data.slowTransits.filter(t => t.savBindu < 22);

  if (locale === 'hi') {
    const parts: string[] = [];
    parts.push(`${c.currentMahaDasha}/${c.currentAntarDasha} दशा चल रही है।`);
    parts.push(`चन्द्रमा आपके ${moonHouse}वें भाव में — ${getHouseKeywordHi(moonHouse)}।`);
    if (strongTransits.length > 0) parts.push(`${strongTransits.map(t => t.planet).join(', ')} गोचर बलवान (SAV ${strongTransits[0].savBindu}+) — अनुकूल प्रभाव।`);
    if (weakTransits.length > 0) parts.push(`${weakTransits.map(t => t.planet).join(', ')} गोचर दुर्बल — सावधानी बरतें।`);
    return parts.join(' ');
  }

  const parts: string[] = [];
  parts.push(`Running ${c.currentMahaDasha}/${c.currentAntarDasha} dasha.`);
  parts.push(`Moon transits your ${ordinal(moonHouse)} house — ${getHouseKeyword(moonHouse)}.`);
  if (strongTransits.length > 0) parts.push(`${strongTransits.map(t => t.planet).join(', ')} transit${strongTransits.length > 1 ? 's are' : ' is'} strong (SAV ${strongTransits[0].savBindu}+) — favorable influence.`);
  if (weakTransits.length > 0) parts.push(`${weakTransits.map(t => t.planet).join(', ')} transit${weakTransits.length > 1 ? 's are' : ' is'} weak — exercise caution.`);
  return parts.join(' ');
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  return n + (s[(n - 20) % 10] || s[n] || s[0]);
}

function getHouseKeyword(h: number): string {
  const k: Record<number, string> = { 1: 'self, vitality', 2: 'finances, family', 3: 'courage, communication', 4: 'home, peace', 5: 'creativity, romance', 6: 'health, competition', 7: 'partnerships', 8: 'transformation', 9: 'fortune, wisdom', 10: 'career, authority', 11: 'gains, networks', 12: 'expenses, spiritual growth' };
  return k[h] || '';
}

function getHouseKeywordHi(h: number): string {
  const k: Record<number, string> = { 1: 'आत्म, ऊर्जा', 2: 'वित्त, परिवार', 3: 'साहस, संवाद', 4: 'गृह, शांति', 5: 'रचनात्मकता', 6: 'स्वास्थ्य', 7: 'साझेदारी', 8: 'परिवर्तन', 9: 'भाग्य', 10: 'करियर', 11: 'लाभ', 12: 'व्यय, आध्यात्मिकता' };
  return k[h] || '';
}
