/**
 * Kundali Comparison Engine
 * Synastry aspects, dasha alignment, house-lord analysis, sign relationships
 */

import type { KundaliData, PlanetPosition, DashaEntry, ChartData } from '@/types/kundali';
import type { LocaleText} from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';

// ─── Planet Natural Friendship per BPHS Ch.3 (Naisargika Maitri) ────────────
// 0=enemy, 1=neutral, 2=friend
const GRAHA_MAITRI: Record<number, Record<number, number>> = {
  0: { 0: 2, 1: 2, 2: 2, 3: 1, 4: 2, 5: 0, 6: 0 }, // Sun: friends=Moon,Mars,Jup; neutral=Merc; enemies=Ven,Sat
  1: { 0: 2, 1: 2, 2: 1, 3: 2, 4: 1, 5: 1, 6: 1 }, // Moon: friends=Sun,Merc; neutral=Mars,Jup,Ven,Sat; enemies=none
  2: { 0: 2, 1: 2, 2: 2, 3: 0, 4: 2, 5: 1, 6: 1 }, // Mars: friends=Sun,Moon,Jup; neutral=Ven,Sat; enemies=Merc
  3: { 0: 2, 1: 0, 2: 1, 3: 2, 4: 1, 5: 2, 6: 1 }, // Mercury: friends=Sun,Ven; neutral=Mars,Jup,Sat; enemies=Moon
  4: { 0: 2, 1: 2, 2: 2, 3: 0, 4: 2, 5: 0, 6: 1 }, // Jupiter: friends=Sun,Moon,Mars; neutral=Sat; enemies=Merc,Ven
  5: { 0: 0, 1: 0, 2: 1, 3: 2, 4: 1, 5: 2, 6: 2 }, // Venus: friends=Merc,Sat; neutral=Mars,Jup; enemies=Sun,Moon
  6: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 1, 5: 2, 6: 2 }, // Saturn: friends=Merc,Ven; neutral=Jup; enemies=Sun,Moon,Mars
};

// Rashi lords: 1=Ari(Mars), 2=Tau(Venus), ... 12=Pis(Jupiter)
const RASHI_LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];

export function getFriendshipLabel(planetA: number, planetB: number): { level: number; label: LocaleText } {
  if (planetA === planetB) return { level: 2, label: { en: 'Same', hi: 'समान', sa: 'समानः' } };
  // Rahu(7)/Ketu(8) — use Saturn for friendship
  const a = planetA >= 7 ? 6 : planetA;
  const b = planetB >= 7 ? 6 : planetB;
  // Average BOTH directions per BPHS Panchadha Maitri (same logic as Ashta Kuta)
  const scoreAB = GRAHA_MAITRI[a]?.[b] ?? 1;
  const scoreBA = GRAHA_MAITRI[b]?.[a] ?? 1;
  const combined = scoreAB + scoreBA; // 4=both friends, 3=friend+neutral, 2=both neutral, 1=neutral+enemy, 0=both enemy
  if (combined >= 3) return { level: 2, label: { en: 'Friend', hi: 'मित्र', sa: 'मित्रम्' } };
  if (combined === 2) return { level: 1, label: { en: 'Neutral', hi: 'सम', sa: 'समम्' } };
  return { level: 0, label: { en: 'Enemy', hi: 'शत्रु', sa: 'शत्रुः' } };
}

// ─── Sign Relationship ──────────────────────────────────────────────────────
// Returns relationship between two signs based on distance

export type SignRelation = 'same' | 'trine' | 'neutral' | 'difficult';

export function getSignRelation(signA: number, signB: number): { relation: SignRelation; label: LocaleText; color: string } {
  if (signA === signB) return { relation: 'same', label: { en: 'Same Sign', hi: 'एक राशि', sa: 'एकराशिः' }, color: 'emerald' };
  const diff = ((signB - signA + 12) % 12);
  // Trine: 5th or 9th from each other (diff = 4 or 8)
  if (diff === 4 || diff === 8) return { relation: 'trine', label: { en: 'Trine', hi: 'त्रिकोण', sa: 'त्रिकोणम्' }, color: 'blue' };
  // Difficult: 6th, 8th, 12th from each other
  if (diff === 5 || diff === 7 || diff === 11) return { relation: 'difficult', label: { en: '6-8-12', hi: '6-8-12', sa: '6-8-12' }, color: 'red' };
  return { relation: 'neutral', label: { en: 'Neutral', hi: 'सम', sa: 'समम्' }, color: 'amber' };
}

// ─── Enhanced Synastry Aspects ──────────────────────────────────────────────

export interface SynastryAspect {
  planetA: number;
  planetB: number;
  type: 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile';
  symbol: string;
  orb: number;
  isHarmonious: boolean;
  interpretation: LocaleText;
}

// Western-style degree-based aspects with wide orbs.
// Vedic (Jyotish) uses sign-based aspects — full aspect on 7th sign,
// special aspects per planet (Mars: 4/8, Jupiter: 5/9, Saturn: 3/10).
const ASPECT_TYPES = [
  { name: 'Conjunction' as const, symbol: '☌', angle: 0, orb: 10, harmonious: true },
  { name: 'Opposition' as const, symbol: '☍', angle: 180, orb: 10, harmonious: false },
  { name: 'Trine' as const, symbol: '△', angle: 120, orb: 8, harmonious: true },
  { name: 'Square' as const, symbol: '□', angle: 90, orb: 8, harmonious: false },
  { name: 'Sextile' as const, symbol: '⚹', angle: 60, orb: 6, harmonious: true },
];

// Malefics: Sun(0), Mars(2), Saturn(6), Rahu(7), Ketu(8)
const MALEFIC_IDS = new Set([0, 2, 6, 7, 8]);

function getAspectInterpretation(planetA: number, planetB: number, type: string, isHarmonious: boolean): LocaleText {
  const nameA = GRAHAS[planetA]?.name?.en || 'Planet';
  const nameB = GRAHAS[planetB]?.name?.en || 'Planet';
  const nameAHi = GRAHAS[planetA]?.name?.hi || 'ग्रह';
  const nameBHi = GRAHAS[planetB]?.name?.hi || 'ग्रह';

  if (isHarmonious) {
    return {
      en: `${nameA}-${nameB} ${type.toLowerCase()}: harmonious energy exchange, mutual support in their respective domains`,
      hi: `${nameAHi}-${nameBHi} ${type}: सामंजस्यपूर्ण ऊर्जा विनिमय, परस्पर सहयोग`,
      sa: `${nameA}-${nameB} ${type}: सामञ्जस्यम्`,
    };
  }
  return {
    en: `${nameA}-${nameB} ${type.toLowerCase()}: tension and growth area, requires conscious effort to balance competing energies`,
    hi: `${nameAHi}-${nameBHi} ${type}: तनाव और विकास का क्षेत्र, संतुलन के लिए सचेत प्रयास आवश्यक`,
    sa: `${nameA}-${nameB} ${type}: तनावः विकासश्च`,
  };
}

export function computeEnhancedSynastry(a: KundaliData, b: KundaliData): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];

  for (const pA of a.planets) {
    for (const pB of b.planets) {
      const diff = Math.abs(pA.longitude - pB.longitude);
      const angle = diff > 180 ? 360 - diff : diff;

      for (const asp of ASPECT_TYPES) {
        const orb = Math.abs(angle - asp.angle);
        if (orb <= asp.orb) {
          // Conjunction with malefics is tense, not harmonious
          const isHarmonious = asp.name === 'Conjunction'
            ? !(MALEFIC_IDS.has(pA.planet.id) && MALEFIC_IDS.has(pB.planet.id))
            : asp.harmonious;

          aspects.push({
            planetA: pA.planet.id,
            planetB: pB.planet.id,
            type: asp.name,
            symbol: asp.symbol,
            orb: Math.round(orb * 10) / 10,
            isHarmonious,
            interpretation: getAspectInterpretation(pA.planet.id, pB.planet.id, asp.name, isHarmonious),
          });
        }
      }
    }
  }

  return aspects.sort((x, y) => x.orb - y.orb).slice(0, 30);
}

// ─── Synastry Summary ───────────────────────────────────────────────────────

export interface SynastrySummary {
  total: number;
  harmonious: number;
  tense: number;
  dominantPattern: LocaleText;
}

export function computeSynastrySummary(aspects: SynastryAspect[]): SynastrySummary {
  const harmonious = aspects.filter(a => a.isHarmonious).length;
  const tense = aspects.length - harmonious;
  const ratio = aspects.length > 0 ? harmonious / aspects.length : 0.5;

  let dominantPattern: LocaleText;
  if (ratio >= 0.7) {
    dominantPattern = { en: 'Strongly harmonious — natural ease and support', hi: 'अत्यधिक सामंजस्यपूर्ण — स्वाभाविक सहजता', sa: 'अत्यन्तं सामञ्जस्यम्' };
  } else if (ratio >= 0.5) {
    dominantPattern = { en: 'Balanced — mix of ease and growth areas', hi: 'संतुलित — सहजता और विकास का मिश्रण', sa: 'सन्तुलितम्' };
  } else if (ratio >= 0.3) {
    dominantPattern = { en: 'Growth-oriented — challenges that strengthen bonds', hi: 'विकास-केंद्रित — बंधन मजबूत करने वाली चुनौतियां', sa: 'विकासप्रधानम्' };
  } else {
    dominantPattern = { en: 'Intense — requires significant conscious effort', hi: 'तीव्र — महत्वपूर्ण सचेत प्रयास आवश्यक', sa: 'तीव्रम्' };
  }

  return { total: aspects.length, harmonious, tense, dominantPattern };
}

// ─── Dasha Alignment ────────────────────────────────────────────────────────

export interface DashaAlignmentEntry {
  chartAMaha: { planet: string; planetName: LocaleText; start: string; end: string };
  chartAAntar: { planet: string; planetName: LocaleText; start: string; end: string } | null;
  chartBMaha: { planet: string; planetName: LocaleText; start: string; end: string };
  chartBAntar: { planet: string; planetName: LocaleText; start: string; end: string } | null;
  sameMahaPlanet: boolean;
  friendship: { level: number; label: LocaleText };
}

function findCurrentDasha(dashas: DashaEntry[], date: Date): { maha: DashaEntry | null; antar: DashaEntry | null } {
  const iso = date.toISOString();
  let maha: DashaEntry | null = null;
  let antar: DashaEntry | null = null;

  for (const d of dashas) {
    if (d.level === 'maha' && d.startDate <= iso && d.endDate >= iso) {
      maha = d;
      if (d.subPeriods) {
        for (const sub of d.subPeriods) {
          if (sub.startDate <= iso && sub.endDate >= iso) {
            antar = sub;
            break;
          }
        }
      }
      break;
    }
  }
  return { maha, antar };
}

// Map planet name string to ID for friendship lookup
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
  'सूर्य': 0, 'चन्द्र': 1, 'मंगल': 2, 'बुध': 3, 'बृहस्पति': 4, 'शुक्र': 5, 'शनि': 6, 'राहु': 7, 'केतु': 8,
};

function dashaEntryToCompact(d: DashaEntry | null): { planet: string; planetName: LocaleText; start: string; end: string } | null {
  if (!d) return null;
  return { planet: d.planet, planetName: d.planetName, start: d.startDate, end: d.endDate };
}

export function computeDashaAlignment(a: KundaliData, b: KundaliData): DashaAlignmentEntry[] {
  const result: DashaAlignmentEntry[] = [];
  const now = new Date();

  // Show current + next 3 maha dasha periods for alignment
  for (let yearOffset = 0; yearOffset < 40; yearOffset += 10) {
    const date = new Date(now.getTime() + yearOffset * 365.25 * 24 * 3600 * 1000);
    const dA = findCurrentDasha(a.dashas, date);
    const dB = findCurrentDasha(b.dashas, date);

    if (!dA.maha || !dB.maha) continue;

    const idA = PLANET_NAME_TO_ID[dA.maha.planet] ?? -1;
    const idB = PLANET_NAME_TO_ID[dB.maha.planet] ?? -1;

    result.push({
      chartAMaha: dashaEntryToCompact(dA.maha)!,
      chartAAntar: dashaEntryToCompact(dA.antar),
      chartBMaha: dashaEntryToCompact(dB.maha)!,
      chartBAntar: dashaEntryToCompact(dB.antar),
      sameMahaPlanet: dA.maha.planet === dB.maha.planet,
      friendship: idA >= 0 && idB >= 0 ? getFriendshipLabel(idA, idB) : { level: 1, label: { en: 'Unknown', hi: 'अज्ञात', sa: 'अज्ञातम्' } },
    });
  }

  // Deduplicate by maha planet pair
  const seen = new Set<string>();
  return result.filter(r => {
    const key = `${r.chartAMaha.planet}-${r.chartBMaha.planet}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── House Lord Comparison ──────────────────────────────────────────────────

export interface HouseLordComparison {
  house: number;
  houseName: LocaleText;
  chartALord: { planetId: number; sign: number; house: number; dignity: string };
  chartBLord: { planetId: number; sign: number; house: number; dignity: string };
  relationship: SignRelation;
}

function getPlanetDignity(p: PlanetPosition): string {
  if (p.isExalted) return 'exalted';
  if (p.isDebilitated) return 'debilitated';
  if (p.isOwnSign) return 'own';
  return 'neutral';
}

export function compareHouseLords(a: KundaliData, b: KundaliData, houses: number[] = [1, 5, 7, 9, 10]): HouseLordComparison[] {
  const HOUSE_NAMES: Record<number, LocaleText> = {
    1: { en: '1st (Self)', hi: '1 (लग्न)', sa: 'लग्नम्' },
    2: { en: '2nd (Wealth)', hi: '2 (धन)', sa: 'धनम्' },
    5: { en: '5th (Children)', hi: '5 (संतान)', sa: 'सन्तानम्' },
    7: { en: '7th (Marriage)', hi: '7 (विवाह)', sa: 'विवाहः' },
    9: { en: '9th (Fortune)', hi: '9 (भाग्य)', sa: 'भाग्यम्' },
    10: { en: '10th (Career)', hi: '10 (कर्म)', sa: 'कर्म' },
  };

  return houses.map(h => {
    // House lord = lord of the sign on that house cusp
    const cuspA = a.houses[h - 1];
    const cuspB = b.houses[h - 1];
    if (!cuspA || !cuspB) return null;

    const lordIdA = RASHI_LORD[cuspA.sign - 1];
    const lordIdB = RASHI_LORD[cuspB.sign - 1];

    const lordPlanetA = a.planets.find(p => p.planet.id === lordIdA);
    const lordPlanetB = b.planets.find(p => p.planet.id === lordIdB);

    if (!lordPlanetA || !lordPlanetB) return null;

    return {
      house: h,
      houseName: HOUSE_NAMES[h] || { en: `House ${h}`, hi: `${h} भाव`, sa: `${h}-भावः` },
      chartALord: { planetId: lordIdA, sign: lordPlanetA.sign, house: lordPlanetA.house, dignity: getPlanetDignity(lordPlanetA) },
      chartBLord: { planetId: lordIdB, sign: lordPlanetB.sign, house: lordPlanetB.house, dignity: getPlanetDignity(lordPlanetB) },
      relationship: getSignRelation(lordPlanetA.sign, lordPlanetB.sign).relation,
    };
  }).filter(Boolean) as HouseLordComparison[];
}

// ─── Venus & 7th Lord Special Analysis ──────────────────────────────────────

export interface RelationshipKarakaAnalysis {
  chartAVenus: { sign: number; house: number; dignity: string; isRetrograde: boolean };
  chartBVenus: { sign: number; house: number; dignity: string; isRetrograde: boolean };
  venusRelation: SignRelation;
  chartA7thLord: { planetId: number; sign: number; house: number; dignity: string };
  chartB7thLord: { planetId: number; sign: number; house: number; dignity: string };
  seventhLordRelation: SignRelation;
  navamshaLagnaMatch: boolean;
}

export function analyzeRelationshipKarakas(a: KundaliData, b: KundaliData): RelationshipKarakaAnalysis {
  const venusA = a.planets.find(p => p.planet.id === 5)!;
  const venusB = b.planets.find(p => p.planet.id === 5)!;

  const cusp7A = a.houses[6]; // 0-indexed
  const cusp7B = b.houses[6];
  const lord7IdA = RASHI_LORD[cusp7A.sign - 1];
  const lord7IdB = RASHI_LORD[cusp7B.sign - 1];
  const lord7A = a.planets.find(p => p.planet.id === lord7IdA)!;
  const lord7B = b.planets.find(p => p.planet.id === lord7IdB)!;

  // Navamsha lagna comparison
  const navLagnaA = a.navamshaChart?.ascendantSign || 0;
  const navLagnaB = b.navamshaChart?.ascendantSign || 0;

  return {
    chartAVenus: { sign: venusA.sign, house: venusA.house, dignity: getPlanetDignity(venusA), isRetrograde: venusA.isRetrograde },
    chartBVenus: { sign: venusB.sign, house: venusB.house, dignity: getPlanetDignity(venusB), isRetrograde: venusB.isRetrograde },
    venusRelation: getSignRelation(venusA.sign, venusB.sign).relation,
    chartA7thLord: { planetId: lord7IdA, sign: lord7A.sign, house: lord7A.house, dignity: getPlanetDignity(lord7A) },
    chartB7thLord: { planetId: lord7IdB, sign: lord7B.sign, house: lord7B.house, dignity: getPlanetDignity(lord7B) },
    seventhLordRelation: getSignRelation(lord7A.sign, lord7B.sign).relation,
    navamshaLagnaMatch: navLagnaA > 0 && navLagnaB > 0 && navLagnaA === navLagnaB,
  };
}
