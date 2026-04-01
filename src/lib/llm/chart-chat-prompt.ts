/**
 * Builds the system prompt for Chart Chat from KundaliData.
 * Structured chart data is passed as context so the LLM
 * can reference exact positions without hallucinating.
 */

import type { KundaliData } from '@/types/kundali';
import { RASHIS } from '@/lib/constants/rashis';

function signName(sign: number): string {
  return RASHIS[(sign - 1) % 12]?.name.en || `Sign ${sign}`;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  return n + (s[(n - 20) % 10] || s[n] || s[0]);
}

export function buildChartChatSystemPrompt(kundali: KundaliData, locale: string): string {
  const lines: string[] = [];

  lines.push('You are a Vedic astrology scholar analyzing a specific birth chart.');
  lines.push('IMPORTANT RULES:');
  lines.push('1. ONLY reference the chart data provided below. Do NOT invent or guess planet positions.');
  lines.push('2. Always cite specific house numbers, signs, and planets from the data.');
  lines.push('3. If you are unsure about something, say so honestly.');
  lines.push('4. Keep answers focused and practical — 2-4 paragraphs max.');
  lines.push('5. Reference classical texts (BPHS, Phaladeepika) when relevant.');
  if (locale === 'hi') {
    lines.push('6. Respond in Hindi (Devanagari script). Use Sanskrit terms with Hindi explanation.');
  } else if (locale === 'sa') {
    lines.push('6. Respond in Sanskrit where possible, with transliteration.');
  }
  lines.push('');

  // Ascendant
  lines.push(`## Birth Chart Data`);
  lines.push(`Ascendant (Lagna): ${signName(kundali.ascendant.sign)} at ${kundali.ascendant.degree.toFixed(2)}°`);
  lines.push('');

  // Planet positions
  lines.push('## Planet Positions');
  for (const p of kundali.planets) {
    const dignity = p.isExalted ? ' [EXALTED]' : p.isDebilitated ? ' [DEBILITATED]' : p.isOwnSign ? ' [OWN SIGN]' : '';
    const retro = p.isRetrograde ? ' [RETROGRADE]' : '';
    lines.push(`- ${p.planet.name.en}: ${signName(p.sign)} (${ordinal(p.house)} house), ${p.degree}${dignity}${retro}`);
  }
  lines.push('');

  // Houses
  lines.push('## House Occupancies');
  for (let h = 0; h < 12; h++) {
    const planets = kundali.chart.houses[h];
    if (planets.length > 0) {
      const names = planets.map(pid => kundali.planets.find(p => p.planet.id === pid)?.planet.name.en || `P${pid}`).join(', ');
      lines.push(`- House ${h + 1} (${signName(((kundali.ascendant.sign - 1 + h) % 12) + 1)}): ${names}`);
    }
  }
  lines.push('');

  // Dashas
  lines.push('## Dasha Periods');
  const now = new Date();
  for (const d of kundali.dashas) {
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    const isCurrent = now >= start && now <= end;
    if (isCurrent) {
      lines.push(`CURRENT Mahadasha: ${d.planetName.en} (${d.startDate} to ${d.endDate})`);
      if (d.subPeriods) {
        for (const sub of d.subPeriods) {
          const subStart = new Date(sub.startDate);
          const subEnd = new Date(sub.endDate);
          if (now >= subStart && now <= subEnd) {
            lines.push(`CURRENT Antardasha: ${sub.planetName.en} (${sub.startDate} to ${sub.endDate})`);
          }
        }
      }
    }
  }
  lines.push('');

  // Navamsha key positions
  lines.push('## D9 Navamsha (Marriage/Dharma)');
  lines.push(`D9 Ascendant: ${signName(kundali.navamshaChart.ascendantSign)}`);
  for (let h = 0; h < 12; h++) {
    const planets = kundali.navamshaChart.houses[h];
    if (planets.length > 0) {
      const names = planets.map(pid => kundali.planets.find(p => p.planet.id === pid)?.planet.name.en || `P${pid}`).join(', ');
      lines.push(`- D9 House ${h + 1}: ${names}`);
    }
  }
  lines.push('');

  // Avasthas (how planets express)
  if (kundali.avasthas && kundali.avasthas.length > 0) {
    lines.push('## Planetary Avasthas (States)');
    for (const av of kundali.avasthas) {
      const pName = kundali.planets.find(p => p.planet.id === av.planetId)?.planet.name.en || `P${av.planetId}`;
      lines.push(`- ${pName}: ${av.baladi.name.en}, ${av.jagradadi.name.en}, ${av.deeptadi.name.en}`);
    }
    lines.push('');
  }

  // Sphutas (sensitive points)
  if (kundali.sphutas) {
    lines.push('## Sensitive Points (Sphutas)');
    lines.push(`- Yogi Point: ${kundali.sphutas.yogiPoint.degree.toFixed(1)}° in sign ${kundali.sphutas.yogiPoint.sign} — MOST BENEFIC degree`);
    lines.push(`- Yogi Planet: Planet ${kundali.sphutas.yogiPoint.yogiPlanet} (brings maximum good fortune)`);
    lines.push(`- Avayogi Point: ${kundali.sphutas.avayogiPoint.degree.toFixed(1)}° — most challenging degree`);
    lines.push(`- Prana Sphuta (vitality): ${kundali.sphutas.pranaSphuta.degree.toFixed(1)}°`);
    lines.push(`- Mrityu Sphuta (longevity): ${kundali.sphutas.mrityuSphuta.degree.toFixed(1)}°`);
    lines.push('');
  }

  // Argala (house support/obstruction)
  if (kundali.argala) {
    const supported = kundali.argala.filter(a => a.netEffect === 'supported').map(a => a.house);
    const obstructed = kundali.argala.filter(a => a.netEffect === 'obstructed').map(a => a.house);
    if (supported.length > 0 || obstructed.length > 0) {
      lines.push('## Argala (Planetary Intervention)');
      if (supported.length > 0) lines.push(`- Supported houses: ${supported.join(', ')} (benefic intervention active)`);
      if (obstructed.length > 0) lines.push(`- Obstructed houses: ${obstructed.join(', ')} (malefic intervention active)`);
      lines.push('');
    }
  }

  // Jaimini
  if (kundali.jaimini) {
    lines.push('## Jaimini Karakas');
    for (const ck of kundali.jaimini.charaKarakas) {
      lines.push(`- ${ck.karaka}: ${ck.planetName.en} (${ck.degree.toFixed(1)}° in sign)`);
    }
    lines.push(`Karakamsha: ${signName(kundali.jaimini.karakamsha.sign)}`);
  }

  return lines.join('\n');
}

/**
 * Validates and sanitizes user message for chat
 */
export function sanitizeChatMessage(message: string): string {
  return message.trim().substring(0, 500);
}

/**
 * Extracts the chart summary for the fallback (no-LLM) response
 */
export function buildFallbackResponse(kundali: KundaliData, locale: string): string {
  const asc = signName(kundali.ascendant.sign);
  const moon = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moon ? signName(moon.sign) : 'unknown';

  if (locale === 'hi') {
    return `आपकी कुण्डली में ${asc} लग्न है और चन्द्र ${moonSign} राशि में हैं। विस्तृत विश्लेषण के लिए Tippanni और Varga Analysis टैब देखें। चैट सुविधा के लिए API कॉन्फ़िगरेशन आवश्यक है।`;
  }
  return `Your chart has ${asc} ascendant with Moon in ${moonSign}. For detailed analysis, check the Tippanni and Varga Analysis tabs. Chat feature requires API configuration.`;
}
