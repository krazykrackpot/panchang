/**
 * Transit Alerts Engine
 * Generates significant transit alerts for the user based on their natal snapshot.
 */

import type { TransitAlert, UserSnapshot } from './types';
import { dateToJD, getPlanetaryPositions, toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCurrentPlanetPositions() {
  const now = new Date();
  const jd = dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours() + now.getMinutes() / 60);
  const planets = getPlanetaryPositions(jd);
  return { planets, jd };
}

function houseFrom(transitSign: number, baseSign: number): number {
  return ((transitSign - baseSign + 12) % 12) + 1;
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

export function computeTransitAlerts(snapshot: UserSnapshot): TransitAlert[] {
  const alerts: TransitAlert[] = [];
  const { planets, jd } = getCurrentPlanetPositions();

  // 1. Sade Sati check
  if (snapshot.sadeSati && typeof snapshot.sadeSati === 'object') {
    const ss = snapshot.sadeSati as { isActive?: boolean; phase?: string };
    if (ss.isActive) {
      alerts.push({
        type: 'sade_sati',
        severity: 'significant',
        planet: 'Saturn',
        description: {
          en: `Sade Sati is active${ss.phase ? ` (${ss.phase} phase)` : ''} — period of karmic lessons and transformation. Practice patience and discipline.`,
          hi: `साढ़े साती सक्रिय है${ss.phase ? ` (${ss.phase} चरण)` : ''} — कर्म सबक और परिवर्तन का काल। धैर्य और अनुशासन का अभ्यास करें।`,
          sa: `साढ़ेसाती सक्रिया${ss.phase ? ` (${ss.phase})` : ''} — कर्मपाठानां परिवर्तनस्य च कालः। धैर्यम् अनुशासनं च अभ्यसतु।`,
        },
      });
    }
  }

  // 2. Jupiter transit — check kendra (1,4,7,10) or dusthana (6,8,12) from Moon
  const jupiter = planets.find(p => p.id === 4);
  if (jupiter) {
    const jupSidLong = toSidereal(jupiter.longitude, jd);
    const jupSign = getRashiNumber(jupSidLong);
    const jupHouseFromMoon = houseFrom(jupSign, snapshot.moonSign);
    const kendras = [1, 4, 7, 10];
    const dusthanas = [6, 8, 12];

    if (kendras.includes(jupHouseFromMoon)) {
      alerts.push({
        type: 'jupiter_transit',
        severity: 'info',
        planet: 'Jupiter',
        description: {
          en: `Jupiter is in the ${jupHouseFromMoon}${jupHouseFromMoon === 1 ? 'st' : jupHouseFromMoon === 3 ? 'rd' : 'th'} house from Moon (Kendra) — auspicious period for growth and opportunities.`,
          hi: `बृहस्पति चन्द्र से ${jupHouseFromMoon}वें भाव (केन्द्र) में — वृद्धि और अवसरों के लिए शुभ काल।`,
          sa: `बृहस्पतिः चन्द्रात् ${jupHouseFromMoon}भावे (केन्द्रे) — वृद्ध्यवसराणां कृते शुभकालः।`,
        },
      });
    } else if (dusthanas.includes(jupHouseFromMoon)) {
      alerts.push({
        type: 'jupiter_transit',
        severity: 'notable',
        planet: 'Jupiter',
        description: {
          en: `Jupiter is in the ${jupHouseFromMoon}th house from Moon (Dusthana) — exercise caution in decisions. Jupiter's grace may be reduced.`,
          hi: `बृहस्पति चन्द्र से ${jupHouseFromMoon}वें भाव (दुःस्थान) में — निर्णयों में सावधानी बरतें। बृहस्पति की कृपा कम हो सकती है।`,
          sa: `बृहस्पतिः चन्द्रात् ${jupHouseFromMoon}भावे (दुःस्थाने) — निर्णयेषु सावधानता। बृहस्पतेः कृपा न्यूना भवेत्।`,
        },
      });
    }
  }

  // 3. Rahu-Ketu axis — Rahu transits 1st or 7th from natal Moon
  const rahu = planets.find(p => p.id === 7);
  if (rahu) {
    const rahuSidLong = toSidereal(rahu.longitude, jd);
    const rahuSign = getRashiNumber(rahuSidLong);
    const rahuHouseFromMoon = houseFrom(rahuSign, snapshot.moonSign);

    if (rahuHouseFromMoon === 1 || rahuHouseFromMoon === 7) {
      alerts.push({
        type: 'rahu_ketu_transit',
        severity: 'notable',
        planet: 'Rahu',
        description: {
          en: `Rahu is transiting the ${rahuHouseFromMoon === 1 ? '1st' : '7th'} house from Moon — mental restlessness possible. Avoid impulsive decisions.`,
          hi: `राहु चन्द्र से ${rahuHouseFromMoon === 1 ? 'पहले' : 'सातवें'} भाव में गोचर — मानसिक अशान्ति सम्भव। आवेगपूर्ण निर्णयों से बचें।`,
          sa: `राहुः चन्द्रात् ${rahuHouseFromMoon === 1 ? 'प्रथम' : 'सप्तम'}भावे गोचरति — मानसिकी अशान्तिः सम्भवा। आवेगपूर्णनिर्णयान् वर्जयेत्।`,
        },
      });
    }
  }

  // 4. Saturn retrograde during Sade Sati
  const saturn = planets.find(p => p.id === 6);
  if (saturn && saturn.isRetrograde) {
    const isSadeSatiActive = snapshot.sadeSati && typeof snapshot.sadeSati === 'object' &&
      (snapshot.sadeSati as { isActive?: boolean }).isActive;
    if (isSadeSatiActive) {
      alerts.push({
        type: 'retrograde',
        severity: 'significant',
        planet: 'Saturn',
        description: {
          en: 'Saturn is retrograde during your Sade Sati — intensified karmic period. Past lessons may resurface. Stay grounded.',
          hi: 'साढ़े साती के दौरान शनि वक्री — तीव्र कर्म काल। पुराने सबक पुनः आ सकते हैं। स्थिर रहें।',
          sa: 'साढ़ेसात्यां शनिः वक्री — तीव्रकर्मकालः। पूर्वपाठाः पुनरागच्छेयुः। स्थिरः तिष्ठतु।',
        },
      });
    }
  }

  return alerts;
}
