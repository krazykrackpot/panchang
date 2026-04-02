import type { PersonalizedDay, UserSnapshot, TransitAlert } from './types';
import type { Trilingual } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Tara Bala — 9 tara names with favorability
// ---------------------------------------------------------------------------
interface TaraInfo {
  name: Trilingual;
  favorable: boolean;
  description: Trilingual;
}

const TARA_MAP: TaraInfo[] = [
  // index 0 unused — taras are 1-based
  { name: { en: '', hi: '', sa: '' }, favorable: false, description: { en: '', hi: '', sa: '' } },
  // 1 — Janma (mixed — treated as neutral/caution)
  {
    name: { en: 'Janma', hi: 'जन्म', sa: 'जन्म' },
    favorable: false,
    description: {
      en: 'Birth star — exercise caution, avoid risky ventures',
      hi: 'जन्म तारा — सावधानी बरतें, जोखिम भरे कार्य टालें',
      sa: 'जन्मतारा — सावधानता आवश्यका, साहसिककार्याणि वर्जयेत्',
    },
  },
  // 2 — Sampat (good)
  {
    name: { en: 'Sampat', hi: 'सम्पत्', sa: 'सम्पत्' },
    favorable: true,
    description: {
      en: 'Wealth star — favorable for financial matters and gains',
      hi: 'सम्पत् तारा — धन और लाभ के लिए शुभ',
      sa: 'सम्पत्तारा — धनलाभाय शुभम्',
    },
  },
  // 3 — Vipat (bad)
  {
    name: { en: 'Vipat', hi: 'विपत्', sa: 'विपत्' },
    favorable: false,
    description: {
      en: 'Danger star — avoid important decisions and new beginnings',
      hi: 'विपत् तारा — महत्वपूर्ण निर्णय और नई शुरुआत से बचें',
      sa: 'विपत्तारा — महत्त्वपूर्णनिर्णयान् नवारम्भांश्च वर्जयेत्',
    },
  },
  // 4 — Kshema (good)
  {
    name: { en: 'Kshema', hi: 'क्षेम', sa: 'क्षेम' },
    favorable: true,
    description: {
      en: 'Wellbeing star — good for health, peace and prosperity',
      hi: 'क्षेम तारा — स्वास्थ्य, शांति और समृद्धि के लिए शुभ',
      sa: 'क्षेमतारा — आरोग्यशान्तिसमृद्ध्यर्थं शुभम्',
    },
  },
  // 5 — Pratyari (bad)
  {
    name: { en: 'Pratyari', hi: 'प्रत्यरि', sa: 'प्रत्यरि' },
    favorable: false,
    description: {
      en: 'Obstacle star — obstacles likely, stay patient',
      hi: 'प्रत्यरि तारा — बाधाएँ संभव, धैर्य रखें',
      sa: 'प्रत्यरितारा — विघ्नाः सम्भवन्ति, धैर्यं धारयेत्',
    },
  },
  // 6 — Sadhaka (good)
  {
    name: { en: 'Sadhaka', hi: 'साधक', sa: 'साधक' },
    favorable: true,
    description: {
      en: 'Achievement star — excellent for accomplishing goals',
      hi: 'साधक तारा — लक्ष्य प्राप्ति के लिए उत्तम',
      sa: 'साधकतारा — लक्ष्यसिद्ध्यर्थम् उत्तमम्',
    },
  },
  // 7 — Vadha (bad)
  {
    name: { en: 'Vadha', hi: 'वध', sa: 'वध' },
    favorable: false,
    description: {
      en: 'Destruction star — avoid conflicts and confrontations',
      hi: 'वध तारा — संघर्ष और टकराव से बचें',
      sa: 'वधतारा — कलहं विवादं च वर्जयेत्',
    },
  },
  // 8 — Mitra (good)
  {
    name: { en: 'Mitra', hi: 'मित्र', sa: 'मित्र' },
    favorable: true,
    description: {
      en: 'Friendship star — good for relationships and partnerships',
      hi: 'मित्र तारा — सम्बन्ध और साझेदारी के लिए शुभ',
      sa: 'मित्रतारा — सम्बन्धसाझेदार्यर्थं शुभम्',
    },
  },
  // 9 — Atimitra (good)
  {
    name: { en: 'Atimitra', hi: 'अतिमित्र', sa: 'अतिमित्र' },
    favorable: true,
    description: {
      en: 'Great friend star — highly auspicious for all activities',
      hi: 'अतिमित्र तारा — सभी कार्यों के लिए अत्यन्त शुभ',
      sa: 'अतिमित्रतारा — सर्वकार्येषु अत्यन्तं शुभम्',
    },
  },
];

// ---------------------------------------------------------------------------
// Chandra Bala descriptions
// ---------------------------------------------------------------------------
const CHANDRA_FAVORABLE: Trilingual = {
  en: 'Moon is well-placed today — emotional balance and mental clarity',
  hi: 'आज चन्द्र शुभ स्थान पर — मानसिक सन्तुलन और स्पष्टता',
  sa: 'अद्य चन्द्रः शुभस्थाने — मानसिकसन्तुलनं स्पष्टता च',
};
const CHANDRA_UNFAVORABLE: Trilingual = {
  en: 'Moon is in a challenging position — mind may feel restless',
  hi: 'चन्द्र कठिन स्थान पर — मन अशान्त हो सकता है',
  sa: 'चन्द्रः कठिनस्थाने — मनः अशान्तं भवेत्',
};

// ---------------------------------------------------------------------------
// Day quality descriptions
// ---------------------------------------------------------------------------
const DAY_QUALITY_DESC: Record<PersonalizedDay['dayQuality'], Trilingual> = {
  excellent: {
    en: 'Excellent day for important activities and new beginnings',
    hi: 'महत्वपूर्ण कार्यों और नई शुरुआत के लिए उत्कृष्ट दिन',
    sa: 'महत्त्वपूर्णकार्याणां नवारम्भानां च कृते उत्कृष्टः दिवसः',
  },
  good: {
    en: 'Favorable day overall — proceed with confidence',
    hi: 'कुल मिलाकर शुभ दिन — आत्मविश्वास से आगे बढ़ें',
    sa: 'समग्रतया शुभदिवसः — आत्मविश्वासेन अग्रे गच्छतु',
  },
  neutral: {
    en: 'Average day — proceed normally with routine activities',
    hi: 'सामान्य दिन — नियमित कार्य सामान्य रूप से करें',
    sa: 'सामान्यदिवसः — नित्यकर्माणि यथावत् कुर्यात्',
  },
  caution: {
    en: 'Exercise caution in new ventures and major decisions',
    hi: 'नये उपक्रमों और बड़े निर्णयों में सावधानी बरतें',
    sa: 'नवोपक्रमेषु महानिर्णयेषु च सावधानता आवश्यका',
  },
  challenging: {
    en: 'Challenging day — avoid major decisions, focus on routine',
    hi: 'चुनौतीपूर्ण दिन — बड़े निर्णय टालें, नित्यकर्म पर ध्यान दें',
    sa: 'आह्वानपूर्णः दिवसः — महानिर्णयान् वर्जयेत्, नित्यकर्मसु ध्यानं दद्यात्',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeTaraBala(birthNakshatra: number, todayNakshatra: number) {
  // Both are 1-based (1-27)
  let diff = todayNakshatra - birthNakshatra;
  if (diff < 0) diff += 27;
  const taraNumber = (diff % 9) + 1; // 1-9
  const info = TARA_MAP[taraNumber];
  return {
    taraNumber,
    taraName: info.name,
    isFavorable: info.favorable,
    description: info.description,
  };
}

function computeChandraBala(birthMoonSign: number, todayMoonSign: number) {
  // Both are 1-based (1-12)
  let house = todayMoonSign - birthMoonSign + 1;
  if (house <= 0) house += 12;
  const favorableHouses = [1, 3, 6, 7, 10, 11];
  const isFavorable = favorableHouses.includes(house);
  return {
    houseFromMoon: house,
    isFavorable,
    description: isFavorable ? CHANDRA_FAVORABLE : CHANDRA_UNFAVORABLE,
  };
}

function computeDayQuality(taraFavorable: boolean, chandraFavorable: boolean): PersonalizedDay['dayQuality'] {
  if (taraFavorable && chandraFavorable) return 'excellent';
  if (taraFavorable || chandraFavorable) return 'good';
  // Both unfavorable — but check if tara is janma (neutral-ish)
  return 'caution';
}

interface DashaLike {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  level: string;
  subPeriods?: DashaLike[];
}

function findCurrentDasha(dashaTimeline: unknown[]): PersonalizedDay['currentDasha'] {
  if (!dashaTimeline || dashaTimeline.length === 0) return null;

  const now = new Date();
  const entries = dashaTimeline as DashaLike[];

  // Find current mahadasha
  const maha = entries.find((d) => {
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    return now >= start && now <= end;
  });

  if (!maha) return null;

  const result: NonNullable<PersonalizedDay['currentDasha']> = {
    maha: {
      planet: maha.planet,
      planetName: maha.planetName,
      startDate: maha.startDate,
      endDate: maha.endDate,
    },
  };

  // Find current antardasha within the mahadasha
  if (maha.subPeriods && maha.subPeriods.length > 0) {
    const antar = maha.subPeriods.find((d) => {
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      return now >= start && now <= end;
    });
    if (antar) {
      result.antar = {
        planet: antar.planet,
        planetName: antar.planetName,
        startDate: antar.startDate,
        endDate: antar.endDate,
      };
    }
  }

  return result;
}

function buildTransitAlerts(snapshot: UserSnapshot): TransitAlert[] {
  const alerts: TransitAlert[] = [];

  // Check Sade Sati
  if (snapshot.sadeSati && typeof snapshot.sadeSati === 'object') {
    const ss = snapshot.sadeSati as { isActive?: boolean; phase?: string };
    if (ss.isActive) {
      alerts.push({
        type: 'sade_sati',
        severity: 'significant',
        planet: 'Saturn',
        description: {
          en: `Sade Sati is active${ss.phase ? ` (${ss.phase} phase)` : ''} — period of karmic lessons and transformation`,
          hi: `साढ़े साती सक्रिय है${ss.phase ? ` (${ss.phase} चरण)` : ''} — कर्म सबक और परिवर्तन का काल`,
          sa: `साढ़ेसाती सक्रिया${ss.phase ? ` (${ss.phase})` : ''} — कर्मपाठानां परिवर्तनस्य च कालः`,
        },
      });
    }
  }

  return alerts;
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

export function computePersonalizedDay(
  snapshot: UserSnapshot,
  todayNakshatra: number,
  todayMoonSign: number,
): PersonalizedDay {
  const taraBala = computeTaraBala(snapshot.moonNakshatra, todayNakshatra);
  const chandraBala = computeChandraBala(snapshot.moonSign, todayMoonSign);
  const dayQuality = computeDayQuality(taraBala.isFavorable, chandraBala.isFavorable);
  const currentDasha = findCurrentDasha(snapshot.dashaTimeline);
  const transitAlerts = buildTransitAlerts(snapshot);

  return {
    taraBala,
    chandraBala,
    dayQuality,
    dayQualityDescription: DAY_QUALITY_DESC[dayQuality],
    currentDasha,
    transitAlerts,
  };
}
