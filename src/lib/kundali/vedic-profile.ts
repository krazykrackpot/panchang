/**
 * Vedic Profile Engine
 * Generates a narrative astrology profile from KundaliData.
 * Pure function — no API calls, no async, instant.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';
import { LAGNA_DEEP } from './tippanni-lagna';
import { PLANET_HOUSE_DEPTH, DASHA_EFFECTS } from './tippanni-planets';
import {
  HOOK_TEMPLATES, MOON_SIGN_NARRATIVES, HOUSE_THEME_LABELS,
  ELEMENT_NAMES, LAGNA_LORDS, CONNECTORS, DIGNITY_LABELS,
  bt,
} from './vedic-profile-templates';

// ─── Types ───────────────────────────────────────────────────────

export interface ChartPattern {
  type: 'stellium' | 'kaalSarpa' | 'rajaYoga' | 'mahapurusha' | 'dignifiedLagnaLord'
      | 'debilitatedKey' | 'sameLagnaMoon' | 'contrastingElements' | 'sadeSati'
      | 'lunarYoga' | 'retrogradeKendra';
  score: number;
  planets: number[];
  houses?: number[];
  yogaName?: string;
  description?: string;
  // Template interpolation data
  templateData?: Record<string, string>;
}

export interface StrengthRow {
  planet: string;
  dignity: string;
  house: number;
  impact: string;
}

export interface VedicProfile {
  hook: string;
  coreIdentity: { lagna: string; moon: string };
  standout: string;
  planetaryObservations: string[];
  nakshatraInsight: string;
  dashaContext: string;
  doshaSection: string | null;
  strengthTable: StrengthRow[];
  personName: string;
}

// ─── Locale helpers ──────────────────────────────────────────────

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  const l = locale as keyof LocaleText;
  return (obj[l] as string) || obj.en || '';
}

/** Simple hash of a string → number for deterministic variant selection */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function interpolate(template: string, data: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || `{${key}}`);
}

// ─── Pattern Detection ──────────────────────────────────────────

export function detectChartPatterns(kundali: KundaliData): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const planets = kundali.planets;
  const ascSign = kundali.ascendant.sign;
  const moon = planets.find(p => p.planet.id === 1);
  const moonSign = moon?.sign || 1;

  // 1. Stellium (3+ planets in one house)
  const houseCounts: Record<number, number[]> = {};
  for (const p of planets) {
    if (!houseCounts[p.house]) houseCounts[p.house] = [];
    houseCounts[p.house].push(p.planet.id);
  }
  for (const [house, pIds] of Object.entries(houseCounts)) {
    if (pIds.length >= 3) {
      patterns.push({
        type: 'stellium',
        score: 90,
        planets: pIds,
        houses: [Number(house)],
        templateData: {
          house: String(house),
          houseTheme: '', // resolved at render time
          count: String(pIds.length),
        },
      });
    }
  }

  // 2. Kaal Sarpa — all planets between Rahu and Ketu
  const rahu = planets.find(p => p.planet.id === 7);
  const ketu = planets.find(p => p.planet.id === 8);
  if (rahu && ketu) {
    const rahuH = rahu.house;
    const ketuH = ketu.house;
    const others = planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
    // Check if all planets are on one side of the Rahu-Ketu axis
    const allOnOneSide = others.every(p => {
      const dist = ((p.house - rahuH + 12) % 12);
      const ketuDist = ((ketuH - rahuH + 12) % 12);
      return dist > 0 && dist < ketuDist;
    }) || others.every(p => {
      const dist = ((p.house - ketuH + 12) % 12);
      const rahuDist = ((rahuH - ketuH + 12) % 12);
      return dist > 0 && dist < rahuDist;
    });
    if (allOnOneSide) {
      patterns.push({
        type: 'kaalSarpa',
        score: 85,
        planets: [7, 8],
        houses: [rahuH, ketuH],
        templateData: { house: String(rahuH), house2: String(ketuH) },
      });
    }
  }

  // 3. Raja Yogas (from yogasComplete if available)
  if (kundali.yogasComplete) {
    const rajaYogas = kundali.yogasComplete.filter(y => y.category === 'raja' && y.present);
    if (rajaYogas.length >= 2) {
      patterns.push({
        type: 'rajaYoga',
        score: 80,
        planets: [],
        templateData: { count: String(rajaYogas.length) },
      });
    }

    // 4. Mahapurusha Yoga
    const mahapurusha = kundali.yogasComplete.filter(y => y.category === 'mahapurusha' && y.present);
    for (const mp of mahapurusha) {
      patterns.push({
        type: 'mahapurusha',
        score: 75,
        planets: [],
        yogaName: mp.name.en,
        templateData: { yoga: mp.name.en },
      });
    }
  }

  // 5. Dignified Lagna Lord (exalted or own sign)
  const lagnaLordId = LAGNA_LORDS[ascSign];
  const lagnaLord = planets.find(p => p.planet.id === lagnaLordId);
  if (lagnaLord && (lagnaLord.isExalted || lagnaLord.isOwnSign)) {
    patterns.push({
      type: 'dignifiedLagnaLord',
      score: 70,
      planets: [lagnaLordId],
      templateData: {
        planetId: String(lagnaLordId),
        signId: String(lagnaLord.sign),
      },
    });
  }

  // 6. Debilitated key planet (lagna lord, Moon, or Sun)
  const keyPlanets = [lagnaLord, moon, planets.find(p => p.planet.id === 0)].filter(Boolean) as PlanetPosition[];
  for (const kp of keyPlanets) {
    if (kp.isDebilitated) {
      patterns.push({
        type: 'debilitatedKey',
        score: 65,
        planets: [kp.planet.id],
        templateData: { planetId: String(kp.planet.id), signId: String(kp.sign) },
      });
      break; // Only one
    }
  }

  // 7. Retrograde in kendra
  const kendras = [1, 4, 7, 10];
  for (const p of planets) {
    if (p.isRetrograde && kendras.includes(p.house) && p.planet.id <= 6) {
      patterns.push({
        type: 'retrogradeKendra',
        score: 60,
        planets: [p.planet.id],
        houses: [p.house],
        templateData: {
          planetId: String(p.planet.id),
          house: String(p.house),
          houseTheme: '',
        },
      });
      break; // Only top one
    }
  }

  // 8. Sade Sati
  if (kundali.sadeSati?.isActive) {
    patterns.push({
      type: 'sadeSati',
      score: 55,
      planets: [6], // Saturn
    });
  }

  // 9. Lunar yogas — Gajakesari, Chandra-Mangala
  if (moon) {
    const jupiter = planets.find(p => p.planet.id === 4);
    const mars = planets.find(p => p.planet.id === 2);
    if (jupiter) {
      const dist = ((jupiter.house - moon.house + 12) % 12);
      if ([0, 3, 6, 9].includes(dist)) { // kendra from Moon
        patterns.push({
          type: 'lunarYoga',
          score: 50,
          planets: [1, 4],
          yogaName: 'Gajakesari Yoga',
          templateData: { yoga: 'Gajakesari Yoga', planet: 'Jupiter', quality: 'wisdom, fame, and prosperity' },
        });
      }
    }
    if (mars && mars.house === moon.house) {
      patterns.push({
        type: 'lunarYoga',
        score: 50,
        planets: [1, 2],
        yogaName: 'Chandra-Mangala Yoga',
        templateData: { yoga: 'Chandra-Mangala Yoga', planet: 'Mars', quality: 'high energy, passionate drive, and financial acumen' },
      });
    }
  }

  // 10. Same lagna and moon sign
  if (moonSign === ascSign) {
    const rashi = RASHIS.find(r => r.id === ascSign);
    patterns.push({
      type: 'sameLagnaMoon',
      score: 45,
      planets: [1],
      templateData: {
        signId: String(ascSign),
        elementKey: rashi?.element.en || '',
      },
    });
  }

  // 11. Contrasting elements (fallback-level)
  if (moonSign !== ascSign) {
    const lagnaRashi = RASHIS.find(r => r.id === ascSign);
    const moonRashi = RASHIS.find(r => r.id === moonSign);
    if (lagnaRashi && moonRashi && lagnaRashi.element.en !== moonRashi.element.en) {
      patterns.push({
        type: 'contrastingElements',
        score: 40,
        planets: [1],
        templateData: {
          signId1: String(ascSign),
          signId2: String(moonSign),
          elementKey1: lagnaRashi.element.en,
          elementKey2: moonRashi.element.en,
        },
      });
    }
  }

  // Sort by score descending
  patterns.sort((a, b) => b.score - a.score);
  return patterns;
}

// ─── Build Sections ─────────────────────────────────────────────

function buildHook(patterns: ChartPattern[], kundali: KundaliData, locale: string): string {
  const topPattern = patterns[0];
  if (!topPattern) {
    // Ultimate fallback
    const rashi = RASHIS.find(r => r.id === kundali.ascendant.sign);
    return locale === 'hi'
      ? `${tl(rashi?.name, 'hi')} लग्न आपकी कुण्डली को एक विशिष्ट चरित्र प्रदान करता है।`
      : `Your ${tl(rashi?.name, 'en')} ascendant gives your chart a distinctive character.`;
  }

  const key = topPattern.type === 'contrastingElements' ? 'contrastingElements'
    : topPattern.type === 'sameLagnaMoon' ? 'sameLagnaMoon'
    : topPattern.type;
  const templates = HOOK_TEMPLATES[key] || HOOK_TEMPLATES.fallback;

  // Deterministic variant selection via birth data hash
  const seed = hashStr(kundali.birthData.date + kundali.birthData.time + kundali.birthData.lat);
  const variant = templates[seed % templates.length];
  const template = locale === 'hi' ? variant.hi : variant.en;

  // Resolve locale-specific names from IDs stored at detection time
  const data = { ...topPattern.templateData };
  if (data) {
    if (data.signId) data.sign = tl(RASHIS.find(r => r.id === Number(data.signId))?.name, locale);
    if (data.signId1) data.sign1 = tl(RASHIS.find(r => r.id === Number(data.signId1))?.name, locale);
    if (data.signId2) data.sign2 = tl(RASHIS.find(r => r.id === Number(data.signId2))?.name, locale);
    if (data.planetId) data.planet = tl(GRAHAS.find(g => g.id === Number(data.planetId))?.name, locale);
    if (data.elementKey1) data.element1 = bt(ELEMENT_NAMES[data.elementKey1], locale);
    if (data.elementKey2) data.element2 = bt(ELEMENT_NAMES[data.elementKey2], locale);
    if (data.elementKey) data.element1 = bt(ELEMENT_NAMES[data.elementKey], locale);
    // Resolve houseTheme if needed
    if (data.house && !data.houseTheme) {
      const houseNum = Number(data.house);
      data.houseTheme = bt(HOUSE_THEME_LABELS[houseNum], locale);
    }
  }

  return interpolate(template, data || {});
}

function buildCoreIdentity(kundali: KundaliData, locale: string): { lagna: string; moon: string } {
  const ascSign = kundali.ascendant.sign;
  const lagnaDeep = LAGNA_DEEP[ascSign];

  // Lagna paragraph: sign name + ruler + first 2-3 sentences of personality
  const lagnaLordId = LAGNA_LORDS[ascSign];
  const lagnaLordName = GRAHAS.find(g => g.id === lagnaLordId);
  const personalityText = lagnaDeep?.personality
    ? tl(lagnaDeep.personality, locale)
    : '';
  // Take first 2-3 sentences
  const sentences = personalityText.split(/(?<=[।\.\?!])\s+/).filter(s => s.trim());
  const trimmed = sentences.slice(0, 3).join(' ');

  const rashi = RASHIS.find(r => r.id === ascSign);
  const lagnaLabel = locale === 'hi'
    ? `**${tl(rashi?.name, 'hi')} लग्न (${tl(lagnaLordName?.name, 'hi')}-शासित)।** ${trimmed}`
    : `**${tl(rashi?.name, 'en')} Ascendant (${tl(lagnaLordName?.name, 'en')}-ruled).** ${trimmed}`;

  // Moon paragraph
  const moon = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moon?.sign || 1;
  const moonNak = moon?.nakshatra;
  const moonNarrative = MOON_SIGN_NARRATIVES[moonSign];
  const moonBase = moonNarrative ? bt(moonNarrative, locale) : '';

  // Append nakshatra flavor (1 sentence from characteristics)
  let nakFlavor = '';
  if (moonNak) {
    const nakDetail = NAKSHATRA_DETAILS.find(n => n.id === moonNak.id);
    if (nakDetail) {
      const chars = tl(nakDetail.characteristics, locale);
      const firstSentence = chars.split(/(?<=[।\.\?!])\s+/)[0] || '';
      const nakName = tl(moonNak.name, locale);
      nakFlavor = locale === 'hi'
        ? ` ${nakName} नक्षत्र में — ${firstSentence}`
        : ` In ${nakName} nakshatra — ${firstSentence.toLowerCase()}`;
    }
  }

  const moonRashi = RASHIS.find(r => r.id === moonSign);
  const moonLabel = locale === 'hi'
    ? `**चन्द्र ${tl(moonRashi?.name, 'hi')} में${moonNak ? ` · ${tl(moonNak.name, 'hi')} नक्षत्र` : ''}।** ${moonBase}${nakFlavor}`
    : `**Moon in ${tl(moonRashi?.name, 'en')}${moonNak ? ` · ${tl(moonNak.name, 'en')} Nakshatra` : ''}.** ${moonBase}${nakFlavor}`;

  return { lagna: lagnaLabel, moon: moonLabel };
}

function buildStandout(patterns: ChartPattern[], kundali: KundaliData, locale: string): string {
  const topPattern = patterns[0];
  if (!topPattern) return '';

  // Build a 3-4 sentence expansion of the top pattern
  const planets = kundali.planets;
  switch (topPattern.type) {
    case 'stellium': {
      const house = topPattern.houses?.[0] || 1;
      const pIds = topPattern.planets;
      const names = pIds.map(id => {
        const p = planets.find(pp => pp.planet.id === id);
        return p ? tl(p.planet.name, locale) : '';
      }).filter(Boolean).join(', ');
      const theme = bt(HOUSE_THEME_LABELS[house], locale);
      const impl = PLANET_HOUSE_DEPTH[pIds[0]]?.[house]?.implications || '';
      return locale === 'hi'
        ? `${names} आपके ${house}वें भाव में एकत्रित हैं — ${theme} से सम्बन्धित विषय। यह संकेन्द्रण जीवन के इस क्षेत्र में असाधारण तीव्रता लाता है। ${impl}`
        : `${names} gather in your ${house}th house — the domain of ${theme}. This concentration brings extraordinary intensity to this area of life. ${impl}`;
    }
    case 'dignifiedLagnaLord': {
      const ll = planets.find(p => p.planet.id === topPattern.planets[0]);
      if (!ll) return '';
      const dignity = ll.isExalted ? 'exalted' : 'own sign';
      const dignityHi = ll.isExalted ? 'उच्च' : 'स्वराशि';
      const impl = PLANET_HOUSE_DEPTH[ll.planet.id]?.[ll.house]?.implications || '';
      return locale === 'hi'
        ? `${tl(ll.planet.name, 'hi')} — आपके लग्नेश — ${tl(ll.signName, 'hi')} में ${dignityHi} हैं, ${ll.house}वें भाव में। लग्नेश की यह शक्ति पूरी कुण्डली को स्थिरता और दिशा प्रदान करती है। ${impl}`
        : `${tl(ll.planet.name, 'en')} — your lagna lord — is ${dignity} in ${tl(ll.signName, 'en')}, placed in the ${ll.house}th house. This strength in the chart's captain gives the entire horoscope stability and direction. ${impl}`;
    }
    case 'kaalSarpa': {
      const rahuH = topPattern.houses?.[0] || 1;
      const ketuH = topPattern.houses?.[1] || 7;
      return locale === 'hi'
        ? `सभी ग्रह राहु (${rahuH}वाँ भाव) और केतु (${ketuH}वाँ भाव) के बीच सीमित हैं। यह काल सर्प योग जीवन में तीव्र कार्मिक अनुभव लाता है — अचानक उत्थान और पतन दोनों सम्भव। अक्ष जिन भावों से गुजरता है, वे जीवन के प्रमुख क्षेत्र बन जाते हैं।`
        : `All planets are hemmed between Rahu (${rahuH}th house) and Ketu (${ketuH}th house). This Kaal Sarpa Yoga brings intense karmic experiences — sudden rises and falls are both possible. The axis passing through these houses makes them the dominant life themes.`;
    }
    case 'rajaYoga': {
      const count = topPattern.templateData?.count || '2';
      return locale === 'hi'
        ? `${count} राजयोगों का संयोग अधिकार, मान्यता और नेतृत्व के अवसर प्रदान करता है। ये योग तब फलित होते हैं जब सम्बन्धित ग्रहों की दशा सक्रिय होती है — सही समय पर सही प्रयास आवश्यक।`
        : `The convergence of ${count} raja yogas provides opportunities for authority, recognition, and leadership. These yogas activate when the relevant planetary dashas run — the right effort at the right time is essential.`;
    }
    case 'sameLagnaMoon': {
      const signId = topPattern.templateData?.signId;
      const sign = signId ? tl(RASHIS.find(r => r.id === Number(signId))?.name, locale) : '';
      return locale === 'hi'
        ? `लग्न और चन्द्र दोनों ${sign} में — आपका बाह्य व्यवहार और आन्तरिक भावनाएँ एक ही ऊर्जा से संचालित हैं। लोग जो देखते हैं वही आप भीतर अनुभव करते हैं। यह एकता आपको प्रामाणिक बनाती है, परन्तु इसका अर्थ यह भी है कि आपके पास छिपने का कोई स्थान नहीं।`
        : `Both your ascendant and Moon fall in ${sign} — your outward behavior and inner emotions run on the same energy. What people see is what you feel inside. This unity makes you authentic, but it also means you have no place to hide.`;
    }
    case 'mahapurusha': {
      const yogaName = topPattern.yogaName || 'Mahapurusha Yoga';
      const yogaInfo = kundali.yogasComplete?.find(y => y.name.en === yogaName && y.present);
      const desc = yogaInfo ? tl(yogaInfo.description, locale) : '';
      return locale === 'hi'
        ? `${yogaName} — पंच महापुरुष योगों में से एक — आपकी कुण्डली में बनता है। यह योग विशिष्ट व्यक्तित्व गुण और जीवन में उत्कृष्टता प्रदान करता है। ${desc}`
        : `${yogaName} — one of the five Pancha Mahapurusha Yogas — forms in your chart. This yoga confers distinctive personality traits and excellence in life. ${desc}`;
    }
    case 'contrastingElements': {
      const lagnaR = RASHIS.find(r => r.id === kundali.ascendant.sign);
      const moonP = planets.find(p => p.planet.id === 1);
      const moonR = moonP ? RASHIS.find(r => r.id === moonP.sign) : null;
      const lagnaEl = lagnaR ? bt(ELEMENT_NAMES[lagnaR.element.en], locale) : '';
      const moonEl = moonR ? bt(ELEMENT_NAMES[moonR.element.en], locale) : '';
      return locale === 'hi'
        ? `${tl(lagnaR?.name, 'hi')} लग्न ${lagnaEl} तत्व लाता है — बौद्धिक, विश्लेषणात्मक, बाह्य-उन्मुख। परन्तु ${tl(moonR?.name, 'hi')} में चन्द्र ${moonEl} स्वभाव से चलता है। यह विपरीत तत्वों का संयोग आपको बहुआयामी बनाता है — दोनों ऊर्जाओं का उपयोग करना सीखना आपकी यात्रा का अंग है।`
        : `Your ${tl(lagnaR?.name, 'en')} ascendant brings ${lagnaEl} energy — analytical, outward-facing. But your Moon in ${tl(moonR?.name, 'en')} runs on ${moonEl} instinct. This combination of contrasting elements makes you multidimensional — learning to harness both energies is part of your journey.`;
    }
    case 'sadeSati': {
      const phase = kundali.sadeSati?.currentPhase || '';
      return locale === 'hi'
        ? `साढ़े साती${phase ? ` (${phase} चरण)` : ''} — शनि आपके चन्द्र पर गोचर कर रहा है। यह 7.5 वर्ष की अवधि भावनात्मक परिपक्वता, धैर्य और कठिन परिश्रम की माँग करती है। जो इसे सचेत रूप से स्वीकार करते हैं, उन्हें स्थायी उपलब्धियाँ प्राप्त होती हैं।`
        : `Sade Sati${phase ? ` (${phase} phase)` : ''} — Saturn is transiting over your Moon. This 7.5-year period demands emotional maturity, patience, and sustained hard work. Those who embrace it consciously earn lasting achievements.`;
    }
    default: {
      // Generic expansion using planet-in-house data for the first planet in the pattern
      const pid = topPattern.planets[0];
      const p = planets.find(pp => pp.planet.id === pid);
      if (!p) return '';
      const impl = PLANET_HOUSE_DEPTH[pid]?.[p.house]?.implications || '';
      const prog = PLANET_HOUSE_DEPTH[pid]?.[p.house]?.prognosis || '';
      return `${impl} ${prog}`;
    }
  }
}

function buildPlanetaryObservations(patterns: ChartPattern[], kundali: KundaliData, locale: string): string[] {
  // Take patterns 1-3 (after the standout), generate a paragraph each
  const obs: string[] = [];
  const usedPatterns = patterns.slice(1, 4);

  for (let i = 0; i < usedPatterns.length; i++) {
    const pat = usedPatterns[i];
    const connector = bt(CONNECTORS[i % CONNECTORS.length], locale);
    let text = '';

    switch (pat.type) {
      case 'dignifiedLagnaLord':
      case 'debilitatedKey':
      case 'retrogradeKendra': {
        const p = kundali.planets.find(pp => pp.planet.id === pat.planets[0]);
        if (!p) continue;
        const impl = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house]?.implications || '';
        const dignity = p.isExalted ? bt(DIGNITY_LABELS.exalted, locale)
          : p.isDebilitated ? bt(DIGNITY_LABELS.debilitated, locale)
          : p.isOwnSign ? bt(DIGNITY_LABELS.ownSign, locale)
          : p.isRetrograde ? bt(DIGNITY_LABELS.retrograde, locale)
          : '';
        text = locale === 'hi'
          ? `${connector} ${tl(p.planet.name, 'hi')} ${tl(p.signName, 'hi')} में (${dignity}) ${p.house}वें भाव में। ${impl}`
          : `${connector} ${tl(p.planet.name, 'en')} in ${tl(p.signName, 'en')} (${dignity}) in the ${p.house}th house. ${impl}`;
        break;
      }
      case 'lunarYoga': {
        const yogaName = pat.yogaName || '';
        const quality = pat.templateData?.quality || '';
        text = locale === 'hi'
          ? `${connector} ${yogaName} — ${quality}। यह योग ज्योतिष में सर्वाधिक मान्यता प्राप्त संयोगों में से एक है।`
          : `${connector} ${yogaName} forms in your chart, bringing ${quality}. This is one of the more widely recognized combinations in Jyotish.`;
        break;
      }
      case 'sadeSati': {
        text = locale === 'hi'
          ? `${connector} साढ़े साती सक्रिय — शनि आपके चन्द्र पर गोचर कर रहा है। यह अवधि भावनात्मक परिपक्वता और कठिन परिश्रम की माँग करती है, परन्तु स्थायी उपलब्धियाँ भी प्रदान करती है।`
          : `${connector} Sade Sati is active — Saturn is transiting over your Moon. This period demands emotional maturity and hard work, but delivers lasting achievements.`;
        break;
      }
      default: {
        // Use stellium, rajaYoga, etc. with generic text
        if (pat.type === 'stellium') {
          const house = pat.houses?.[0] || 1;
          const theme = bt(HOUSE_THEME_LABELS[house], locale);
          text = locale === 'hi'
            ? `${connector} ${pat.planets.length} ग्रह ${house}वें भाव में — ${theme} के विषय प्रबल।`
            : `${connector} ${pat.planets.length} planets in the ${house}th house intensify themes of ${theme}.`;
        }
        break;
      }
    }

    if (text) obs.push(text);
  }

  return obs;
}

function buildNakshatraInsight(kundali: KundaliData, locale: string): string {
  const moon = kundali.planets.find(p => p.planet.id === 1);
  if (!moon) return '';

  const nak = moon.nakshatra;
  const detail = NAKSHATRA_DETAILS.find(n => n.id === nak.id);
  if (!detail) return '';

  const name = tl(nak.name, locale);
  const meaning = tl(detail.meaning, locale);
  const mythology = tl(detail.mythology, locale);
  const characteristics = tl(detail.characteristics, locale);
  const gana = tl(detail.gana, locale);
  const symbol = nak.symbol || '';

  if (locale === 'hi') {
    return `आपका चन्द्र ${name} नक्षत्र में पड़ता है — "${meaning}"। ${symbol} ${mythology} ${characteristics} गण: ${gana}।`;
  }
  return `Your Moon falls in ${name} — "${meaning}." ${symbol} ${mythology} ${characteristics} Gana: ${gana}.`;
}

function buildDashaContext(kundali: KundaliData, locale: string): string {
  const dashas = kundali.dashas;
  if (!dashas || dashas.length === 0) return '';

  // Find current Mahadasha (the one whose date range includes now)
  const now = new Date().toISOString().slice(0, 10);
  const currentMaha = dashas.find(d => d.level === 'maha' && d.startDate <= now && d.endDate >= now)
    || dashas[0];

  const mahaName = tl(currentMaha.planetName, locale);
  const endYear = currentMaha.endDate.slice(0, 4);
  const startYear = currentMaha.startDate.slice(0, 4);
  const totalYears = Number(endYear) - Number(startYear);

  // Current antardasha
  let antarText = '';
  if (currentMaha.subPeriods) {
    const currentAntar = currentMaha.subPeriods.find(
      d => d.startDate <= now && d.endDate >= now
    );
    if (currentAntar) {
      const antarName = tl(currentAntar.planetName, locale);
      // DASHA_EFFECTS is keyed by planet name string (e.g. 'Saturn', 'Mercury')
      const dashaEffect = DASHA_EFFECTS[currentAntar.planet];
      const effectText = dashaEffect ? (locale === 'hi' ? (dashaEffect.hi || dashaEffect.en) : dashaEffect.en) : '';
      antarText = locale === 'hi'
        ? ` ${antarName} की वर्तमान अन्तर्दशा ${effectText ? `— ${effectText}` : ''}`
        : ` The current Antardasha of ${antarName}${effectText ? ` — ${effectText}` : ''}`;
    }
  }

  // Mahadasha lord's house placement for context
  const mahaLord = kundali.planets.find(p => tl(p.planet.name, 'en') === currentMaha.planet);
  let placementText = '';
  if (mahaLord) {
    const dignity = mahaLord.isExalted ? (locale === 'hi' ? 'उच्च' : 'exalted')
      : mahaLord.isOwnSign ? (locale === 'hi' ? 'स्वराशि' : 'own sign')
      : mahaLord.isDebilitated ? (locale === 'hi' ? 'नीच' : 'debilitated')
      : '';
    const houseTheme = bt(HOUSE_THEME_LABELS[mahaLord.house], locale);
    placementText = locale === 'hi'
      ? `${mahaName} आपके ${mahaLord.house}वें भाव (${houseTheme}) में ${dignity ? `${dignity} में ` : ''}विराजमान — `
      : `${mahaName} sits in your ${mahaLord.house}th house (${houseTheme})${dignity ? ` in ${dignity}` : ''} — `;
  }

  if (locale === 'hi') {
    return `आप वर्तमान में ${mahaName} महादशा में हैं — ${totalYears} वर्ष की अवधि। ${placementText}इस काल का स्वरूप निर्धारित करता है।${antarText}`;
  }
  return `You are currently in ${mahaName} Mahadasha — a ${totalYears}-year period. ${placementText}shaping the character of these years.${antarText}`;
}

function buildDoshaSection(kundali: KundaliData, locale: string): string | null {
  const planets = kundali.planets;
  const doshas: string[] = [];

  // Check Manglik
  const mars = planets.find(p => p.planet.id === 2);
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  if (mars && manglikHouses.includes(mars.house)) {
    const severity = [1, 7, 8].includes(mars.house) ? (locale === 'hi' ? 'गम्भीर' : 'significant')
      : (locale === 'hi' ? 'मध्यम' : 'moderate');
    // Check cancellations
    const cancellations: string[] = [];
    if (mars.isOwnSign || mars.isExalted) cancellations.push(locale === 'hi' ? 'मंगल स्वगरिमा में' : 'Mars is in its own dignity');
    const jupiter = planets.find(p => p.planet.id === 4);
    if (jupiter && [1, 4, 7, 10].includes(jupiter.house)) cancellations.push(locale === 'hi' ? 'गुरु केन्द्र में' : 'Jupiter in kendra');

    const cancelText = cancellations.length > 0
      ? (locale === 'hi' ? ` परन्तु यह ${cancellations.join(' और ')} से कम होता है।` : ` However, this is mitigated by ${cancellations.join(' and ')}.`)
      : '';

    doshas.push(locale === 'hi'
      ? `मांगलिक दोष (${severity}): मंगल ${mars.house}वें भाव में विवाह और साझेदारी को प्रभावित करता है।${cancelText}`
      : `Manglik Dosha (${severity}): Mars in the ${mars.house}th house influences marriage and partnerships.${cancelText}`);
  }

  // Check Kaal Sarpa (reuse pattern detection logic)
  const rahu = planets.find(p => p.planet.id === 7);
  const ketu = planets.find(p => p.planet.id === 8);
  if (rahu && ketu) {
    const others = planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
    const rahuH = rahu.house;
    const ketuH = ketu.house;
    const allOnOneSide = others.every(p => {
      const dist = ((p.house - rahuH + 12) % 12);
      const ketuDist = ((ketuH - rahuH + 12) % 12);
      return dist > 0 && dist < ketuDist;
    }) || others.every(p => {
      const dist = ((p.house - ketuH + 12) % 12);
      const rahuDist = ((rahuH - ketuH + 12) % 12);
      return dist > 0 && dist < rahuDist;
    });
    if (allOnOneSide) {
      doshas.push(locale === 'hi'
        ? `काल सर्प दोष: सभी ग्रह राहु-केतु अक्ष के एक ओर। कार्मिक अनुभव तीव्र होते हैं, परन्तु अक्ष-सम्बन्धित क्षेत्रों में विशेष सफलता भी सम्भव।`
        : `Kaal Sarpa Dosha: all planets on one side of the Rahu-Ketu axis. Karmic experiences run intense, but exceptional success in axis-related areas is also possible.`);
    }
  }

  // Check Sade Sati
  if (kundali.sadeSati?.isActive) {
    const phase = kundali.sadeSati.currentPhase || '';
    doshas.push(locale === 'hi'
      ? `साढ़े साती सक्रिय${phase ? ` (${phase} चरण)` : ''}: शनि चन्द्र पर गोचर। धैर्य और अनुशासन इस काल की कुंजी।`
      : `Sade Sati active${phase ? ` (${phase} phase)` : ''}: Saturn transits over Moon. Patience and discipline are key during this period.`);
  }

  if (doshas.length === 0) return null;
  return doshas.join('\n\n');
}

function buildStrengthTable(kundali: KundaliData, locale: string): StrengthRow[] {
  const rows: StrengthRow[] = [];

  for (const p of kundali.planets) {
    // Only include planets with notable dignity
    if (!p.isExalted && !p.isDebilitated && !p.isOwnSign && !p.isRetrograde) continue;

    const dignity = p.isExalted ? bt(DIGNITY_LABELS.exalted, locale)
      : p.isDebilitated ? bt(DIGNITY_LABELS.debilitated, locale)
      : p.isOwnSign ? bt(DIGNITY_LABELS.ownSign, locale)
      : p.isRetrograde ? bt(DIGNITY_LABELS.retrograde, locale)
      : bt(DIGNITY_LABELS.neutral, locale);

    const impl = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house]?.implications || '';
    // Trim to first sentence
    const firstSentence = impl.split(/[.।]/)[0]?.trim() || '';

    rows.push({
      planet: tl(p.planet.name, locale),
      dignity,
      house: p.house,
      impact: firstSentence || bt(HOUSE_THEME_LABELS[p.house], locale),
    });
  }

  return rows;
}

// ─── Main Entry Point ───────────────────────────────────────────

export function generateVedicProfile(kundali: KundaliData, locale: string): VedicProfile {
  const patterns = detectChartPatterns(kundali);
  return {
    hook: buildHook(patterns, kundali, locale),
    coreIdentity: buildCoreIdentity(kundali, locale),
    standout: buildStandout(patterns, kundali, locale),
    planetaryObservations: buildPlanetaryObservations(patterns, kundali, locale),
    nakshatraInsight: buildNakshatraInsight(kundali, locale),
    dashaContext: buildDashaContext(kundali, locale),
    doshaSection: buildDoshaSection(kundali, locale),
    strengthTable: buildStrengthTable(kundali, locale),
    personName: kundali.birthData.name,
  };
}
