import type { LocaleText } from '@/types/panchang';
import { getPlanetaryPositions, toSidereal, dateToJD } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { analyzeGochara } from './gochara-engine';

export interface PersonalTransit {
  planetId: number;
  planetName: LocaleText;
  planetColor: string;
  currentSign: number;    // 1-based rashi
  signName: LocaleText;
  house: number;          // 1-based house from ascendant
  savBindu: number;       // SAV score for this sign
  quality: 'strong' | 'neutral' | 'weak';
  interpretation: LocaleText;
  // Gochara fields (populated when natalMoonSign is provided)
  houseFromMoon?: number;
  isGoodHouse?: boolean;
  vedhaActive?: boolean;
  vedhaPlanetName?: string;
  bavScore?: number;
  gocharaQuality?: 'strong' | 'moderate' | 'weak' | 'adverse';
}

export interface UpcomingTransition {
  planetId: number;
  planetName: LocaleText;
  fromSign: LocaleText;
  toSign: LocaleText;
  fromSignId: number;       // 1-based rashi id
  toSignId: number;         // 1-based rashi id
  approximateDate: string;  // "Mon YYYY" format
  daysUntil: number;        // approximate days from now
}

// Slow planets for transit analysis
const SLOW_PLANETS = [
  { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' } },
  { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' } },
  { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' } },
  { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' } },
];

// One-line interpretations based on house + quality
const HOUSE_MEANINGS: Record<number, LocaleText> = {
  1:  { en: 'self, identity, health', hi: 'स्व, पहचान, स्वास्थ्य', sa: 'आत्मन्, स्वरूपम्, आरोग्यम्' },
  2:  { en: 'wealth, family, speech', hi: 'धन, परिवार, वाणी', sa: 'धनम्, कुटुम्बम्, वाक्' },
  3:  { en: 'courage, siblings, communication', hi: 'साहस, भाई-बहन, संवाद', sa: 'शौर्यम्, भ्रातरः, सम्भाषणम्' },
  4:  { en: 'home, mother, comfort', hi: 'घर, माता, सुख', sa: 'गृहम्, मातृ, सुखम्' },
  5:  { en: 'children, education, creativity', hi: 'संतान, शिक्षा, रचनात्मकता', sa: 'सन्तानम्, विद्या, सृजनम्' },
  6:  { en: 'enemies, health, service', hi: 'शत्रु, रोग, सेवा', sa: 'शत्रवः, रोगः, सेवा' },
  7:  { en: 'marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार', sa: 'विवाहः, भागीदारी, वाणिज्यम्' },
  8:  { en: 'transformation, longevity, occult', hi: 'परिवर्तन, आयु, गुप्त', sa: 'परिवर्तनम्, आयुः, गुह्यम्' },
  9:  { en: 'fortune, dharma, long journeys', hi: 'भाग्य, धर्म, लम्बी यात्राएं', sa: 'भाग्यम्, धर्मः, दीर्घयात्रा' },
  10: { en: 'career, reputation, authority', hi: 'कैरियर, प्रतिष्ठा, अधिकार', sa: 'कर्म, यशः, अधिकारः' },
  11: { en: 'gains, wishes, social circle', hi: 'लाभ, इच्छाएं, मित्र मंडल', sa: 'लाभः, इच्छा, मित्रमण्डलम्' },
  12: { en: 'expenses, moksha, foreign lands', hi: 'व्यय, मोक्ष, विदेश', sa: 'व्ययः, मोक्षः, विदेशः' },
};

const QUALITY_LABELS = {
  strong:  { en: 'favorable', hi: 'शुभ', sa: 'शुभम्' },
  neutral: { en: 'moderate', hi: 'मध्यम', sa: 'मध्यमम्' },
  weak:    { en: 'challenging', hi: 'चुनौतीपूर्ण', sa: 'कठिनम्' },
} as const;

/** Planet ID to English name for vedha display */
const PLANET_NAMES: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

export function computePersonalTransits(
  ascendantSign: number,
  savTable: number[],
  natalMoonSign?: number,
  reducedBav?: number[][],
  reducedSavTable?: number[]
): PersonalTransit[] {
  const now = new Date();
  const jd = dateToJD(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), 12);
  const positions = getPlanetaryPositions(jd);

  // Prefer reducedSavTable (post-Shodhana) for quality scoring — more accurate for transit prediction.
  // Reduced SAV averages ~8 per sign vs raw ~28, so thresholds are adjusted accordingly.
  const scoringTable = reducedSavTable ?? savTable;
  const isReduced = !!reducedSavTable;

  const transits: PersonalTransit[] = SLOW_PLANETS.map(sp => {
    const pos = positions.find(p => p.id === sp.id);
    if (!pos) return null;

    const sidLon = toSidereal(pos.longitude, jd);
    const sign = Math.floor(sidLon / 30) + 1;
    const house = ((sign - ascendantSign + 12) % 12) + 1;
    const savBindu = scoringTable[sign - 1] || 0;
    // Thresholds: reduced SAV (post-Shodhana) uses >=14 strong / <8 weak.
    // Raw SAV uses >=28 strong / <22 weak (classical values).
    const quality: PersonalTransit['quality'] = isReduced
      ? (savBindu >= 14 ? 'strong' : savBindu < 8 ? 'weak' : 'neutral')
      : (savBindu >= 28 ? 'strong' : savBindu < 22 ? 'weak' : 'neutral');

    const graha = GRAHAS[sp.id];
    const rashi = RASHIS[sign - 1];
    const hm = HOUSE_MEANINGS[house] || HOUSE_MEANINGS[1];
    const qualityLabel = QUALITY_LABELS[quality];

    return {
      planetId: sp.id,
      planetName: graha?.name || sp.name,
      planetColor: graha?.color || '#888',
      currentSign: sign,
      signName: rashi?.name || { en: 'Unknown', hi: 'अज्ञात', sa: 'अज्ञातम्' },
      house,
      savBindu,
      quality,
      interpretation: {
        en: `${sp.name.en} in house ${house} (${hm.en}) — ${qualityLabel.en} (${savBindu} bindus)`,
        hi: `${sp.name.hi} ${house}वें भाव में (${hm.hi}) — ${qualityLabel.hi} (${savBindu} बिन्दु)`,
        sa: `${sp.name.sa} ${house}-भावे (${hm.sa}) — ${qualityLabel.sa} (${savBindu} बिन्दवः)`,
      },
    };
  }).filter(Boolean) as PersonalTransit[];

  // Merge Gochara analysis when natal Moon sign is available
  if (natalMoonSign !== undefined && natalMoonSign >= 1 && natalMoonSign <= 12) {
    // Build transit inputs for slow planets already computed
    const transitInputs = transits.map(t => ({
      id: t.planetId,
      sign: t.currentSign,
    }));
    // Add fast planets (Sun, Mars, Mercury, Venus) for vedha checking
    // Gochara engine uses planet IDs 0-6 only
    for (const pid of [0, 2, 3, 5]) {
      const pos = positions.find(p => p.id === pid);
      if (pos) {
        const sidLon = toSidereal(pos.longitude, jd);
        transitInputs.push({ id: pid, sign: Math.floor(sidLon / 30) + 1 });
      }
    }
    const gocharaResults = analyzeGochara(transitInputs, natalMoonSign, reducedBav);
    for (const t of transits) {
      const g = gocharaResults.find(gr => gr.planet === t.planetId);
      if (g) {
        t.houseFromMoon = g.houseFromMoon;
        t.isGoodHouse = g.isGoodHouse;
        t.vedhaActive = g.vedhaActive;
        if (g.vedhaActive && g.vedhaPlanet !== undefined) {
          t.vedhaPlanetName = PLANET_NAMES[g.vedhaPlanet] || '';
        }
        t.bavScore = g.bavScore;
        t.gocharaQuality = g.quality;
      }
    }
  }

  return transits;
}

export function computeUpcomingTransitions(): UpcomingTransition[] {
  const now = new Date();
  const startJd = dateToJD(now.getUTCFullYear(), now.getUTCMonth() + 1, 15, 12);
  const results: UpcomingTransition[] = [];

  for (const sp of SLOW_PLANETS) {
    let lastSign = 0;
    for (let m = 0; m <= 6; m++) { // scan 6 months ahead
      const jd = startJd + m * 30.44;
      const positions = getPlanetaryPositions(jd);
      const pos = positions.find(p => p.id === sp.id);
      if (!pos) continue;

      const sidLon = toSidereal(pos.longitude, jd);
      const sign = Math.floor(sidLon / 30) + 1;

      if (m === 0) { lastSign = sign; continue; }

      if (sign !== lastSign) {
        const daysUntil = Math.round(m * 30.44);
        const d = new Date(now.getTime() + daysUntil * 24 * 3600000);
        const fromRashi = RASHIS[lastSign - 1];
        const toRashi = RASHIS[sign - 1];
        results.push({
          planetId: sp.id,
          planetName: sp.name,
          fromSign: fromRashi?.name || { en: '?', hi: '?', sa: '?' },
          toSign: toRashi?.name || { en: '?', hi: '?', sa: '?' },
          fromSignId: lastSign,
          toSignId: sign,
          approximateDate: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          daysUntil,
        });
        lastSign = sign;
      } else {
        lastSign = sign;
      }
    }
  }

  return results;
}
