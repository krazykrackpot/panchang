/**
 * Dasha Narrative Generator
 * Produces interpretive text for dasha periods relevant to the forecast year.
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import type { LocaleText} from '@/types/panchang';
import { GRAHAS } from '@/lib/constants/grahas';

export interface DashaNarrativeEntry {
  level: 'maha' | 'antar';
  planet: string;
  planetName: LocaleText;
  planetId: number;
  startDate: string;
  endDate: string;
  sign: number;
  house: number;
  dignity: string;
  isRetrograde: boolean;
  themes: LocaleText;
  crossReference: LocaleText | null; // how dasha lord relates to active transits
}

export interface DashaNarrative {
  currentMaha: DashaNarrativeEntry;
  currentAntar: DashaNarrativeEntry | null;
  upcomingTransitions: DashaNarrativeEntry[];
  mahaChangesThisYear: boolean;
}

const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

const HOUSE_THEMES: Record<number, LocaleText> = {
  1:  { en: 'self, identity, new beginnings', hi: 'आत्म, पहचान, नई शुरुआत', sa: 'आत्मन्, स्वरूपम्' },
  2:  { en: 'wealth, family bonds, speech', hi: 'धन, पारिवारिक बंधन, वाणी', sa: 'धनम्, कुटुम्बम्' },
  3:  { en: 'courage, communication, short travel', hi: 'साहस, संवाद, लघु यात्रा', sa: 'शौर्यम्, सम्भाषणम्' },
  4:  { en: 'home, emotional security, property', hi: 'घर, भावनात्मक सुरक्षा, सम्पत्ति', sa: 'गृहम्, सुखम्' },
  5:  { en: 'creativity, children, education', hi: 'रचनात्मकता, संतान, शिक्षा', sa: 'सृजनम्, सन्तानम्' },
  6:  { en: 'health challenges, service, competition', hi: 'स्वास्थ्य चुनौतियां, सेवा, प्रतिस्पर्धा', sa: 'रोगः, सेवा' },
  7:  { en: 'partnerships, marriage, business', hi: 'साझेदारी, विवाह, व्यापार', sa: 'विवाहः, भागीदारी' },
  8:  { en: 'transformation, hidden matters, inheritance', hi: 'परिवर्तन, गुप्त मामले, विरासत', sa: 'परिवर्तनम्, गुह्यम्' },
  9:  { en: 'fortune, wisdom, long journeys', hi: 'भाग्य, ज्ञान, लम्बी यात्राएं', sa: 'भाग्यम्, ज्ञानम्' },
  10: { en: 'career peak, authority, public image', hi: 'कैरियर शिखर, अधिकार, सार्वजनिक छवि', sa: 'कर्म, यशः' },
  11: { en: 'gains, fulfilled wishes, networks', hi: 'लाभ, पूर्ण इच्छाएं, नेटवर्क', sa: 'लाभः, इच्छापूर्तिः' },
  12: { en: 'spiritual growth, expenses, foreign lands', hi: 'आध्यात्मिक विकास, व्यय, विदेश', sa: 'मोक्षः, व्ययः' },
};

function buildDashaNarrativeEntry(
  dasha: DashaEntry,
  natal: KundaliData,
  level: 'maha' | 'antar',
): DashaNarrativeEntry {
  const planetId = PLANET_NAME_TO_ID[dasha.planet] ?? -1;
  const pos = natal.planets.find(p => p.planet.id === planetId);

  const sign = pos?.sign || 1;
  const house = pos?.house || 1;
  const isRetrograde = pos?.isRetrograde || false;
  const dignity = pos?.isExalted ? 'exalted' : pos?.isDebilitated ? 'debilitated' : pos?.isOwnSign ? 'own' : 'neutral';

  const houseTheme = HOUSE_THEMES[house] || HOUSE_THEMES[1];
  const dignityNote = dignity === 'exalted' ? 'strongly empowered' : dignity === 'debilitated' ? 'challenged but transformative' : dignity === 'own' ? 'comfortable and productive' : 'moderate influence';

  return {
    level,
    planet: dasha.planet,
    planetName: dasha.planetName,
    planetId,
    startDate: dasha.startDate,
    endDate: dasha.endDate,
    sign,
    house,
    dignity,
    isRetrograde,
    themes: {
      en: `${dasha.planet} (${dignityNote}) activates house ${house}: ${houseTheme.en}${isRetrograde ? '. Retrograde brings inward focus and revisiting past themes.' : '.'}`,
      hi: `${dasha.planetName.hi} (${dignity === 'exalted' ? 'उच्च' : dignity === 'debilitated' ? 'नीच' : dignity === 'own' ? 'स्वगृह' : 'सामान्य'}) ${house}वें भाव को सक्रिय करता है: ${houseTheme.hi}${isRetrograde ? '। वक्री होने से अंतर्मुखी दृष्टि।' : '।'}`,
      sa: `${dasha.planetName.sa || dasha.planet} ${house}-भावे: ${houseTheme.sa}`,
    },
    crossReference: null,
  };
}

export function generateDashaNarrative(natal: KundaliData, year: number): DashaNarrative {
  const yearStart = `${year}-01-01T00:00:00.000Z`;
  const yearEnd = `${year}-12-31T23:59:59.999Z`;

  let currentMahaEntry: DashaEntry | null = null;
  let currentAntarEntry: DashaEntry | null = null;
  const upcomingTransitions: DashaNarrativeEntry[] = [];
  let mahaChangesThisYear = false;

  const now = new Date().toISOString();

  for (const maha of natal.dashas) {
    if (maha.level !== 'maha') continue;

    // Find current maha dasha
    if (maha.startDate <= now && maha.endDate >= now) {
      currentMahaEntry = maha;

      // Check if maha changes this year
      if (maha.endDate >= yearStart && maha.endDate <= yearEnd) {
        mahaChangesThisYear = true;
      }

      // Find current antar
      if (maha.subPeriods) {
        for (const antar of maha.subPeriods) {
          if (antar.startDate <= now && antar.endDate >= now) {
            currentAntarEntry = antar;
          }
          // Collect antar transitions this year
          if (antar.startDate >= yearStart && antar.startDate <= yearEnd && antar.startDate > now) {
            upcomingTransitions.push(buildDashaNarrativeEntry(antar, natal, 'antar'));
          }
        }
      }
    }

    // If maha starts this year (new maha dasha)
    if (maha.startDate >= yearStart && maha.startDate <= yearEnd && maha.startDate > now) {
      upcomingTransitions.push(buildDashaNarrativeEntry(maha, natal, 'maha'));
    }
  }

  // Fallback if no current dasha found
  if (!currentMahaEntry) {
    currentMahaEntry = natal.dashas.find(d => d.level === 'maha') || natal.dashas[0];
  }

  return {
    currentMaha: buildDashaNarrativeEntry(currentMahaEntry!, natal, 'maha'),
    currentAntar: currentAntarEntry ? buildDashaNarrativeEntry(currentAntarEntry, natal, 'antar') : null,
    upcomingTransitions: upcomingTransitions.slice(0, 6), // max 6 transitions
    mahaChangesThisYear,
  };
}
