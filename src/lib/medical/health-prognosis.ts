/**
 * Health Prognosis — current health outlook based on running dasha/antardasha,
 * transits through health houses (6, 8, 12), active doshas, and yogas.
 *
 * This is TIME-DEPENDENT: the same person gets different prognosis on different dates.
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

// Sign lordship: sign (1-12) → planet id (0=Sun..6=Saturn)
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// Planet health significations
const PLANET_HEALTH: Record<number, { en: string; hi: string }> = {
  0: { en: 'vitality, bones, heart, eyes', hi: 'जीवन शक्ति, हड्डियाँ, हृदय, नेत्र' },
  1: { en: 'mind, blood, stomach, fluids', hi: 'मन, रक्त, उदर, शरीर के तरल' },
  2: { en: 'muscles, blood pressure, inflammation, accidents', hi: 'मांसपेशियाँ, रक्तचाप, सूजन, दुर्घटनाएँ' },
  3: { en: 'nervous system, skin, speech, intellect', hi: 'तंत्रिका तंत्र, त्वचा, वाणी, बुद्धि' },
  4: { en: 'liver, fat tissue, growth, immunity', hi: 'यकृत, वसा ऊतक, विकास, प्रतिरक्षा' },
  5: { en: 'reproductive system, kidneys, hormones, beauty', hi: 'प्रजनन तंत्र, गुर्दे, हार्मोन, सौंदर्य' },
  6: { en: 'chronic conditions, joints, teeth, aging', hi: 'पुरानी बीमारियाँ, जोड़, दाँत, वृद्धावस्था' },
};

// Planet names
const PLANET_NAMES: Record<string, { en: string; hi: string }> = {
  Sun: { en: 'Sun', hi: 'सूर्य' }, Moon: { en: 'Moon', hi: 'चन्द्र' },
  Mars: { en: 'Mars', hi: 'मंगल' }, Mercury: { en: 'Mercury', hi: 'बुध' },
  Jupiter: { en: 'Jupiter', hi: 'गुरु' }, Venus: { en: 'Venus', hi: 'शुक्र' },
  Saturn: { en: 'Saturn', hi: 'शनि' }, Rahu: { en: 'Rahu', hi: 'राहु' },
  Ketu: { en: 'Ketu', hi: 'केतु' },
};

const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

// Health houses
const HEALTH_HOUSES = [6, 8, 12]; // disease, chronic/sudden, loss/hospitalization

export interface HealthPrognosis {
  overallTone: 'good' | 'moderate' | 'caution' | 'challenging';
  currentDasha: {
    mahadasha: string;
    antardasha: string | null;
    healthImplication: LocaleText;
  };
  transitAlerts: Array<{
    planet: string;
    house: number;
    effect: LocaleText;
    severity: 'mild' | 'moderate' | 'high';
  }>;
  sadeSatiActive: boolean;
  sadeSatiNote: LocaleText | null;
  activeDoshas: Array<{ name: string; note: LocaleText }>;
  recommendations: Array<{ type: 'do' | 'avoid' | 'watch'; text: LocaleText }>;
  summary: LocaleText;
}

/** Find current Mahadasha (level 0) and Antardasha (level 1). */
function getCurrentDashas(dashas: DashaEntry[]): { maha: DashaEntry | null; antar: DashaEntry | null } {
  const now = Date.now();
  const mahas = dashas.filter(d => d.level === 'maha');
  const maha = mahas.find(d => {
    const s = new Date(d.startDate).getTime();
    const e = new Date(d.endDate).getTime();
    return now >= s && now <= e;
  }) ?? null;

  const antars = dashas.filter(d => d.level === 'antar');
  const antar = antars.find(d => {
    const s = new Date(d.startDate).getTime();
    const e = new Date(d.endDate).getTime();
    return now >= s && now <= e;
  }) ?? null;

  return { maha, antar };
}

/** Check which health houses a planet lords or occupies. */
function healthHouseInvolvement(kundali: KundaliData, planetName: string): number[] {
  const pid = PLANET_NAME_TO_ID[planetName];
  if (pid === undefined) return [];
  const ascSign = kundali.ascendant.sign;
  const houses: number[] = [];

  // House occupied — PlanetPosition.planet is a Graha with .id
  const planet = kundali.planets.find(p => p.planet.id === pid);
  if (planet) {
    // PlanetPosition.sign is the sign number (1-12) directly
    const sign = planet.sign;
    const occupiedHouse = ((sign - ascSign + 12) % 12) + 1;
    if (HEALTH_HOUSES.includes(occupiedHouse)) houses.push(occupiedHouse);
  }

  // Houses lorded
  for (const h of HEALTH_HOUSES) {
    const houseSign = ((ascSign - 1 + h - 1) % 12) + 1;
    if (SIGN_LORD[houseSign] === pid) houses.push(h);
  }

  return [...new Set(houses)];
}

/** Get current transit planets and check if any are in health houses. */
function getTransitHealthAlerts(kundali: KundaliData): HealthPrognosis['transitAlerts'] {
  const alerts: HealthPrognosis['transitAlerts'] = [];
  const now = new Date();
  const tz = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), 'UTC');

  try {
    const panchang = computePanchang({
      year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(),
      lat: 28.61, lng: 77.21, tzOffset: tz, timezone: 'UTC',
    });

    const ascSign = kundali.ascendant.sign;
    const slowPlanets = (panchang.planets || []).filter(g => [4, 5, 6, 7, 8].includes(g.id));

    for (const g of slowPlanets) {
      const transitSign = g.rashi ?? Math.floor((g.longitude ?? 0) / 30) + 1;
      const transitHouse = ((transitSign - ascSign + 12) % 12) + 1;

      if (HEALTH_HOUSES.includes(transitHouse)) {
        const pName = PLANET_NAMES[['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'][g.id]] || { en: 'Planet', hi: 'ग्रह' };
        const isMalefic = [2, 6, 7, 8].includes(g.id); // Mars, Saturn, Rahu, Ketu
        const severity = isMalefic ? (transitHouse === 8 ? 'high' : 'moderate') : 'mild';

        const houseLabel = transitHouse === 6 ? 'disease' : transitHouse === 8 ? 'chronic/sudden ailments' : 'hospitalization/loss';
        const houseLabelHi = transitHouse === 6 ? 'रोग' : transitHouse === 8 ? 'पुरानी/अचानक बीमारियाँ' : 'अस्पताल/हानि';

        alerts.push({
          planet: pName.en,
          house: transitHouse,
          effect: {
            en: `${pName.en} transiting ${transitHouse}th house (${houseLabel}). ${isMalefic ? 'Extra care recommended.' : 'Mild influence — stay aware.'}`,
            hi: `${pName.hi} ${transitHouse}वें भाव (${houseLabelHi}) में गोचर। ${isMalefic ? 'विशेष सावधानी आवश्यक।' : 'हल्का प्रभाव — सचेत रहें।'}`,
          },
          severity,
        });
      }
    }
  } catch (err) {
    console.warn('[health-prognosis] transit computation failed:', err);
  }

  return alerts;
}

/**
 * Compute the current health prognosis for a person.
 */
export function computeHealthPrognosis(kundali: KundaliData): HealthPrognosis {
  const { maha, antar } = getCurrentDashas(kundali.dashas);
  const mahaName = maha?.planet || 'Unknown';
  const antarName = antar?.planet || null;

  // Dasha health implication
  const mahaHealthHouses = healthHouseInvolvement(kundali, mahaName);
  const antarHealthHouses = antarName ? healthHouseInvolvement(kundali, antarName) : [];
  const dashaAffectsHealth = mahaHealthHouses.length > 0 || antarHealthHouses.length > 0;

  const mahaPN = PLANET_NAMES[mahaName] || { en: mahaName, hi: mahaName };
  const antarPN = antarName ? (PLANET_NAMES[antarName] || { en: antarName, hi: antarName }) : null;
  const mahaHealth = PLANET_HEALTH[PLANET_NAME_TO_ID[mahaName]] || { en: 'general health', hi: 'सामान्य स्वास्थ्य' };

  let dashaImplEn = `${mahaPN.en} Mahadasha governs: ${mahaHealth.en}.`;
  let dashaImplHi = `${mahaPN.hi} महादशा: ${mahaHealth.hi}।`;

  if (dashaAffectsHealth) {
    const houses = [...new Set([...mahaHealthHouses, ...antarHealthHouses])].join(', ');
    dashaImplEn += ` Active dasha lords connect to health houses (${houses}) — heightened health sensitivity this period.`;
    dashaImplHi += ` सक्रिय दशा नाथ स्वास्थ्य भावों (${houses}) से जुड़े हैं — इस अवधि में स्वास्थ्य संवेदनशीलता बढ़ी हुई है।`;
  }

  if (antarPN) {
    const antarHealth = PLANET_HEALTH[PLANET_NAME_TO_ID[antarName!]] || { en: 'general', hi: 'सामान्य' };
    dashaImplEn += ` ${antarPN.en} Antardasha adds focus on: ${antarHealth.en}.`;
    dashaImplHi += ` ${antarPN.hi} अंतर्दशा: ${antarHealth.hi} पर ध्यान।`;
  }

  // Transit alerts
  const transitAlerts = getTransitHealthAlerts(kundali);

  // Sade Sati
  const sadeSatiActive = !!kundali.sadeSati?.isActive;
  const sadeSatiNote = sadeSatiActive ? {
    en: 'Sade Sati is active — Saturn\'s 7.5-year transit affects mental health, stress levels, and overall vitality. Prioritise rest, meditation, and stress management.',
    hi: 'साढ़े साती सक्रिय है — शनि का 7.5 वर्ष का गोचर मानसिक स्वास्थ्य, तनाव और समग्र जीवन शक्ति को प्रभावित करता है। आराम, ध्यान और तनाव प्रबंधन को प्राथमिकता दें।',
  } : null;

  // Active doshas from kundali yogas
  const activeDoshas: HealthPrognosis['activeDoshas'] = [];
  if (kundali.yogasComplete) {
    for (const y of kundali.yogasComplete) {
      const name = typeof y.name === 'string' ? y.name : y.name?.en || '';
      if (name.toLowerCase().includes('kemdrum') || name.toLowerCase().includes('kemadruma')) {
        activeDoshas.push({ name: 'Kemadruma', note: { en: 'Moon isolation — emotional health needs attention.', hi: 'चंद्र एकाकीपन — भावनात्मक स्वास्थ्य पर ध्यान दें।' } });
      }
      if (name.toLowerCase().includes('grahan') || name.toLowerCase().includes('eclipse')) {
        activeDoshas.push({ name: 'Grahan Dosha', note: { en: 'Eclipsed luminary — periodic low energy or confusion.', hi: 'ग्रहण दोष — समय-समय पर कम ऊर्जा या भ्रम।' } });
      }
    }
  }
  if (sadeSatiActive) {
    activeDoshas.push({ name: 'Sade Sati', note: { en: 'Saturn transit over Moon — stress and fatigue.', hi: 'चंद्र पर शनि गोचर — तनाव और थकान।' } });
  }

  // Recommendations
  const recommendations: HealthPrognosis['recommendations'] = [];

  // Dasha-based
  const mahaId = PLANET_NAME_TO_ID[mahaName];
  if (mahaId === 6 || (antarName && PLANET_NAME_TO_ID[antarName] === 6)) { // Saturn
    recommendations.push({ type: 'watch', text: { en: 'Saturn period active — watch joints, bones, and chronic conditions. Regular check-ups recommended.', hi: 'शनि दशा सक्रिय — जोड़ों, हड्डियों और पुरानी बीमारियों पर ध्यान दें। नियमित जाँच कराएँ।' } });
  }
  if (mahaId === 2 || (antarName && PLANET_NAME_TO_ID[antarName] === 2)) { // Mars
    recommendations.push({ type: 'avoid', text: { en: 'Mars period active — higher accident/injury risk. Avoid reckless physical activity. Watch blood pressure.', hi: 'मंगल दशा सक्रिय — दुर्घटना/चोट का जोखिम बढ़ा। लापरवाह शारीरिक गतिविधि से बचें। रक्तचाप पर ध्यान दें।' } });
  }
  if (mahaId === 7 || (antarName && PLANET_NAME_TO_ID[antarName] === 7)) { // Rahu
    recommendations.push({ type: 'watch', text: { en: 'Rahu period active — watch for mysterious or hard-to-diagnose symptoms. Avoid substance overuse. Mental health awareness.', hi: 'राहु दशा सक्रिय — रहस्यमय या कठिन लक्षणों पर ध्यान दें। नशे से बचें। मानसिक स्वास्थ्य सचेतना।' } });
  }
  if (mahaId === 8 || (antarName && PLANET_NAME_TO_ID[antarName] === 8)) { // Ketu
    recommendations.push({ type: 'watch', text: { en: 'Ketu period active — watch digestive system and unexplained ailments. Spiritual practices and yoga are beneficial.', hi: 'केतु दशा सक्रिय — पाचन तंत्र और अस्पष्ट बीमारियों पर ध्यान दें। आध्यात्मिक अभ्यास और योग लाभकारी हैं।' } });
  }

  // Transit-based
  if (transitAlerts.some(a => a.severity === 'high')) {
    recommendations.push({ type: 'avoid', text: { en: 'Malefic transit through 8th house — avoid risky activities, get regular health screenings.', hi: 'आठवें भाव में पाप ग्रह गोचर — जोखिम भरी गतिविधियों से बचें, नियमित स्वास्थ्य जाँच कराएँ।' } });
  }

  // General positive
  if (mahaId === 4) { // Jupiter
    recommendations.push({ type: 'do', text: { en: 'Jupiter Mahadasha supports recovery and growth. Good period for health improvements and new wellness routines.', hi: 'गुरु महादशा स्वास्थ्य सुधार का समर्थन करती है। नई स्वास्थ्य दिनचर्या शुरू करने का अच्छा समय।' } });
  }
  if (mahaId === 5) { // Venus
    recommendations.push({ type: 'do', text: { en: 'Venus Mahadasha favours hormonal balance and reproductive health. Enjoy moderate pleasures.', hi: 'शुक्र महादशा हार्मोनल संतुलन और प्रजनन स्वास्थ्य के अनुकूल। मध्यम सुखों का आनंद लें।' } });
  }

  // Determine overall tone
  const highAlerts = transitAlerts.filter(a => a.severity === 'high').length;
  const modAlerts = transitAlerts.filter(a => a.severity === 'moderate').length;
  let overallTone: HealthPrognosis['overallTone'] = 'good';
  if (highAlerts > 0 || (dashaAffectsHealth && sadeSatiActive)) overallTone = 'challenging';
  else if (modAlerts > 1 || dashaAffectsHealth || sadeSatiActive) overallTone = 'caution';
  else if (modAlerts > 0) overallTone = 'moderate';

  // Summary
  const toneEn = overallTone === 'good' ? 'favourable' : overallTone === 'moderate' ? 'mostly stable with minor sensitivities' : overallTone === 'caution' ? 'requiring attention' : 'demanding extra care';
  const toneHi = overallTone === 'good' ? 'अनुकूल' : overallTone === 'moderate' ? 'अधिकतर स्थिर, मामूली संवेदनशीलता' : overallTone === 'caution' ? 'ध्यान देने योग्य' : 'विशेष देखभाल आवश्यक';

  const summary: LocaleText = {
    en: `Current health outlook: ${toneEn}. ${mahaPN.en} Mahadasha${antarPN ? ` / ${antarPN.en} Antardasha` : ''} is running. ${transitAlerts.length > 0 ? `${transitAlerts.length} transit alert(s) in health houses.` : 'No major transit pressure on health houses.'} ${sadeSatiActive ? 'Sade Sati adds stress — prioritise mental wellness.' : ''}`.trim(),
    hi: `वर्तमान स्वास्थ्य दृष्टिकोण: ${toneHi}। ${mahaPN.hi} महादशा${antarPN ? ` / ${antarPN.hi} अंतर्दशा` : ''} चल रही है। ${transitAlerts.length > 0 ? `स्वास्थ्य भावों में ${transitAlerts.length} गोचर चेतावनी।` : 'स्वास्थ्य भावों पर कोई प्रमुख गोचर दबाव नहीं।'} ${sadeSatiActive ? 'साढ़े साती तनाव बढ़ाती है — मानसिक स्वास्थ्य को प्राथमिकता दें।' : ''}`.trim(),
  };

  return {
    overallTone,
    currentDasha: {
      mahadasha: mahaName,
      antardasha: antarName,
      healthImplication: { en: dashaImplEn, hi: dashaImplHi },
    },
    transitAlerts,
    sadeSatiActive,
    sadeSatiNote,
    activeDoshas,
    recommendations,
    summary,
  };
}
