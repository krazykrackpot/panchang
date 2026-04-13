'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Locale , LocaleText} from '@/types/panchang';
import type { PlanetPosition, DashaEntry } from '@/types/kundali';
import { useAuthStore } from '@/stores/auth-store';
import { useChartsStore } from '@/stores/charts-store';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

interface EclipseInfo {
  date: string;
  type: 'solar' | 'lunar';
  node: 'rahu' | 'ketu';
  eclipseLongitude: number; // sidereal longitude of the eclipse (Sun for solar, Moon for lunar)
}

interface KundaliData {
  ascendant: { sign: number };
  planets: PlanetPosition[];
  dashas: DashaEntry[];
}

interface PersonalInsight {
  dashAlert: string | null;       // Current dasha relevance
  natalContacts: string[];        // Planets within 3° of eclipse
  houseAffected: { house: number; meaning: string };
  nakshatraLink: string | null;   // Nakshatra lord = dasha lord match
  transitAspects: string[];       // Saturn/Jupiter/Mars aspecting eclipse degree
  overallIntensity: 'high' | 'moderate' | 'low';
}

const HOUSE_MEANINGS: Record<number, LocaleText> = {
  1:  { en: 'Self, health, personality, physical body', hi: 'स्व, स्वास्थ्य, व्यक्तित्व, शरीर', sa: 'स्व, स्वास्थ्य, व्यक्तित्व, शरीर', mai: 'स्व, स्वास्थ्य, व्यक्तित्व, शरीर', mr: 'स्व, स्वास्थ्य, व्यक्तित्व, शरीर', ta: 'Self, health, personality, physical body', te: 'Self, health, personality, physical body', bn: 'Self, health, personality, physical body', kn: 'Self, health, personality, physical body', gu: 'Self, health, personality, physical body' },
  2:  { en: 'Wealth, family, speech, food habits', hi: 'धन, परिवार, वाणी, भोजन', sa: 'धन, परिवार, वाणी, भोजन', mai: 'धन, परिवार, वाणी, भोजन', mr: 'धन, परिवार, वाणी, भोजन', ta: 'Wealth, family, speech, food habits', te: 'Wealth, family, speech, food habits', bn: 'Wealth, family, speech, food habits', kn: 'Wealth, family, speech, food habits', gu: 'Wealth, family, speech, food habits' },
  3:  { en: 'Courage, siblings, communication, short travels', hi: 'साहस, भाई-बहन, संवाद, लघु यात्रा', sa: 'साहस, भाई-बहन, संवाद, लघु यात्रा', mai: 'साहस, भाई-बहन, संवाद, लघु यात्रा', mr: 'साहस, भाई-बहन, संवाद, लघु यात्रा', ta: 'Courage, siblings, communication, short travels', te: 'Courage, siblings, communication, short travels', bn: 'Courage, siblings, communication, short travels', kn: 'Courage, siblings, communication, short travels', gu: 'Courage, siblings, communication, short travels' },
  4:  { en: 'Home, mother, emotional peace, property', hi: 'घर, माता, मानसिक शान्ति, सम्पत्ति', sa: 'घर, माता, मानसिक शान्ति, सम्पत्ति', mai: 'घर, माता, मानसिक शान्ति, सम्पत्ति', mr: 'घर, माता, मानसिक शान्ति, सम्पत्ति', ta: 'Home, mother, emotional peace, property', te: 'Home, mother, emotional peace, property', bn: 'Home, mother, emotional peace, property', kn: 'Home, mother, emotional peace, property', gu: 'Home, mother, emotional peace, property' },
  5:  { en: 'Children, education, creativity, past-life merit', hi: 'सन्तान, शिक्षा, रचनात्मकता, पूर्व पुण्य', sa: 'सन्तान, शिक्षा, रचनात्मकता, पूर्व पुण्य', mai: 'सन्तान, शिक्षा, रचनात्मकता, पूर्व पुण्य', mr: 'सन्तान, शिक्षा, रचनात्मकता, पूर्व पुण्य', ta: 'Children, education, creativity, past-life merit', te: 'Children, education, creativity, past-life merit', bn: 'Children, education, creativity, past-life merit', kn: 'Children, education, creativity, past-life merit', gu: 'Children, education, creativity, past-life merit' },
  6:  { en: 'Enemies, disease, debts, daily work', hi: 'शत्रु, रोग, ऋण, दैनिक कार्य', sa: 'शत्रु, रोग, ऋण, दैनिक कार्य', mai: 'शत्रु, रोग, ऋण, दैनिक कार्य', mr: 'शत्रु, रोग, ऋण, दैनिक कार्य', ta: 'Enemies, disease, debts, daily work', te: 'Enemies, disease, debts, daily work', bn: 'Enemies, disease, debts, daily work', kn: 'Enemies, disease, debts, daily work', gu: 'Enemies, disease, debts, daily work' },
  7:  { en: 'Marriage, partnerships, business, public image', hi: 'विवाह, साझेदारी, व्यापार, सार्वजनिक छवि', sa: 'विवाह, साझेदारी, व्यापार, सार्वजनिक छवि', mai: 'विवाह, साझेदारी, व्यापार, सार्वजनिक छवि', mr: 'विवाह, साझेदारी, व्यापार, सार्वजनिक छवि', ta: 'Marriage, partnerships, business, public image', te: 'Marriage, partnerships, business, public image', bn: 'Marriage, partnerships, business, public image', kn: 'Marriage, partnerships, business, public image', gu: 'Marriage, partnerships, business, public image' },
  8:  { en: 'Transformation, longevity, occult, sudden events', hi: 'परिवर्तन, आयु, गुप्त, अचानक घटनाएं', sa: 'परिवर्तन, आयु, गुप्त, अचानक घटनाएं', mai: 'परिवर्तन, आयु, गुप्त, अचानक घटनाएं', mr: 'परिवर्तन, आयु, गुप्त, अचानक घटनाएं', ta: 'Transformation, longevity, occult, sudden events', te: 'Transformation, longevity, occult, sudden events', bn: 'Transformation, longevity, occult, sudden events', kn: 'Transformation, longevity, occult, sudden events', gu: 'Transformation, longevity, occult, sudden events' },
  9:  { en: 'Fortune, dharma, guru, father, long journeys', hi: 'भाग्य, धर्म, गुरु, पिता, लम्बी यात्रा', sa: 'भाग्य, धर्म, गुरु, पिता, लम्बी यात्रा', mai: 'भाग्य, धर्म, गुरु, पिता, लम्बी यात्रा', mr: 'भाग्य, धर्म, गुरु, पिता, लम्बी यात्रा', ta: 'Fortune, dharma, guru, father, long journeys', te: 'Fortune, dharma, guru, father, long journeys', bn: 'Fortune, dharma, guru, father, long journeys', kn: 'Fortune, dharma, guru, father, long journeys', gu: 'Fortune, dharma, guru, father, long journeys' },
  10: { en: 'Career, reputation, authority, public status', hi: 'कैरियर, प्रतिष्ठा, अधिकार, सार्वजनिक स्थिति', sa: 'कैरियर, प्रतिष्ठा, अधिकार, सार्वजनिक स्थिति', mai: 'कैरियर, प्रतिष्ठा, अधिकार, सार्वजनिक स्थिति', mr: 'कैरियर, प्रतिष्ठा, अधिकार, सार्वजनिक स्थिति', ta: 'Career, reputation, authority, public status', te: 'Career, reputation, authority, public status', bn: 'Career, reputation, authority, public status', kn: 'Career, reputation, authority, public status', gu: 'Career, reputation, authority, public status' },
  11: { en: 'Gains, income, friendships, wish fulfillment', hi: 'लाभ, आय, मित्रता, इच्छापूर्ति', sa: 'लाभ, आय, मित्रता, इच्छापूर्ति', mai: 'लाभ, आय, मित्रता, इच्छापूर्ति', mr: 'लाभ, आय, मित्रता, इच्छापूर्ति', ta: 'Gains, income, friendships, wish fulfillment', te: 'Gains, income, friendships, wish fulfillment', bn: 'Gains, income, friendships, wish fulfillment', kn: 'Gains, income, friendships, wish fulfillment', gu: 'Gains, income, friendships, wish fulfillment' },
  12: { en: 'Expenses, moksha, foreign lands, isolation', hi: 'व्यय, मोक्ष, विदेश, एकान्त', sa: 'व्यय, मोक्ष, विदेश, एकान्त', mai: 'व्यय, मोक्ष, विदेश, एकान्त', mr: 'व्यय, मोक्ष, विदेश, एकान्त', ta: 'Expenses, moksha, foreign lands, isolation', te: 'Expenses, moksha, foreign lands, isolation', bn: 'Expenses, moksha, foreign lands, isolation', kn: 'Expenses, moksha, foreign lands, isolation', gu: 'Expenses, moksha, foreign lands, isolation' },
};

const PLANET_NAMES: Record<number, LocaleText> = {
  0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'Sun', te: 'Sun', bn: 'Sun', kn: 'Sun', gu: 'Sun' },
  1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'Moon', te: 'Moon', bn: 'Moon', kn: 'Moon', gu: 'Moon' },
  2: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'Mars', te: 'Mars', bn: 'Mars', kn: 'Mars', gu: 'Mars' },
  3: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'Mercury', te: 'Mercury', bn: 'Mercury', kn: 'Mercury', gu: 'Mercury' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'Jupiter', te: 'Jupiter', bn: 'Jupiter', kn: 'Jupiter', gu: 'Jupiter' },
  5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'Venus', te: 'Venus', bn: 'Venus', kn: 'Venus', gu: 'Venus' },
  6: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'Saturn', te: 'Saturn', bn: 'Saturn', kn: 'Saturn', gu: 'Saturn' },
  7: { en: 'Rahu', hi: 'राहु', sa: 'राहु', mai: 'राहु', mr: 'राहु', ta: 'Rahu', te: 'Rahu', bn: 'Rahu', kn: 'Rahu', gu: 'Rahu' },
  8: { en: 'Ketu', hi: 'केतु', sa: 'केतु', mai: 'केतु', mr: 'केतु', ta: 'Ketu', te: 'Ketu', bn: 'Ketu', kn: 'Ketu', gu: 'Ketu' },
};

const CONTACT_EFFECTS: Record<number, LocaleText> = {
  0: { en: 'career/authority disruption, father\'s health', hi: 'कैरियर/अधिकार व्यवधान, पिता का स्वास्थ्य' },
  1: { en: 'emotional upheaval, mother\'s health, mental restlessness', hi: 'भावनात्मक उथल-पुथल, माता का स्वास्थ्य, मानसिक अशान्ति' },
  2: { en: 'energy conflicts, property disputes, sibling issues', hi: 'ऊर्जा संघर्ष, सम्पत्ति विवाद, भाई-बहन मुद्दे', sa: 'ऊर्जा संघर्ष, सम्पत्ति विवाद, भाई-बहन मुद्दे', mai: 'ऊर्जा संघर्ष, सम्पत्ति विवाद, भाई-बहन मुद्दे', mr: 'ऊर्जा संघर्ष, सम्पत्ति विवाद, भाई-बहन मुद्दे', ta: 'energy conflicts, property disputes, sibling issues', te: 'energy conflicts, property disputes, sibling issues', bn: 'energy conflicts, property disputes, sibling issues', kn: 'energy conflicts, property disputes, sibling issues', gu: 'energy conflicts, property disputes, sibling issues' },
  3: { en: 'communication breakdown, business disruption, intellect shift', hi: 'संवाद विच्छेद, व्यापार व्यवधान, बुद्धि परिवर्तन', sa: 'संवाद विच्छेद, व्यापार व्यवधान, बुद्धि परिवर्तन', mai: 'संवाद विच्छेद, व्यापार व्यवधान, बुद्धि परिवर्तन', mr: 'संवाद विच्छेद, व्यापार व्यवधान, बुद्धि परिवर्तन', ta: 'communication breakdown, business disruption, intellect shift', te: 'communication breakdown, business disruption, intellect shift', bn: 'communication breakdown, business disruption, intellect shift', kn: 'communication breakdown, business disruption, intellect shift', gu: 'communication breakdown, business disruption, intellect shift' },
  4: { en: 'wisdom expansion or guru issues, children matters, education shift', hi: 'ज्ञान विस्तार या गुरु मुद्दे, सन्तान, शिक्षा परिवर्तन', sa: 'ज्ञान विस्तार या गुरु मुद्दे, सन्तान, शिक्षा परिवर्तन', mai: 'ज्ञान विस्तार या गुरु मुद्दे, सन्तान, शिक्षा परिवर्तन', mr: 'ज्ञान विस्तार या गुरु मुद्दे, सन्तान, शिक्षा परिवर्तन', ta: 'wisdom expansion or guru issues, children matters, education shift', te: 'wisdom expansion or guru issues, children matters, education shift', bn: 'wisdom expansion or guru issues, children matters, education shift', kn: 'wisdom expansion or guru issues, children matters, education shift', gu: 'wisdom expansion or guru issues, children matters, education shift' },
  5: { en: 'relationship transformation, luxury/comfort changes, creative shift', hi: 'सम्बन्ध परिवर्तन, विलास/सुख परिवर्तन, रचनात्मक मोड़', sa: 'सम्बन्ध परिवर्तन, विलास/सुख परिवर्तन, रचनात्मक मोड़', mai: 'सम्बन्ध परिवर्तन, विलास/सुख परिवर्तन, रचनात्मक मोड़', mr: 'सम्बन्ध परिवर्तन, विलास/सुख परिवर्तन, रचनात्मक मोड़', ta: 'relationship transformation, luxury/comfort changes, creative shift', te: 'relationship transformation, luxury/comfort changes, creative shift', bn: 'relationship transformation, luxury/comfort changes, creative shift', kn: 'relationship transformation, luxury/comfort changes, creative shift', gu: 'relationship transformation, luxury/comfort changes, creative shift' },
  6: { en: 'structural collapse forcing rebuilding, discipline tested, chronic health', hi: 'ढाँचागत पतन जो पुनर्निर्माण बाध्य करे, अनुशासन परीक्षा, दीर्घकालिक स्वास्थ्य', sa: 'ढाँचागत पतन जो पुनर्निर्माण बाध्य करे, अनुशासन परीक्षा, दीर्घकालिक स्वास्थ्य', mai: 'ढाँचागत पतन जो पुनर्निर्माण बाध्य करे, अनुशासन परीक्षा, दीर्घकालिक स्वास्थ्य', mr: 'ढाँचागत पतन जो पुनर्निर्माण बाध्य करे, अनुशासन परीक्षा, दीर्घकालिक स्वास्थ्य', ta: 'structural collapse forcing rebuilding, discipline tested, chronic health', te: 'structural collapse forcing rebuilding, discipline tested, chronic health', bn: 'structural collapse forcing rebuilding, discipline tested, chronic health', kn: 'structural collapse forcing rebuilding, discipline tested, chronic health', gu: 'structural collapse forcing rebuilding, discipline tested, chronic health' },
  7: { en: 'obsessive new direction, foreign connection activated, desires amplified', hi: 'जुनूनी नई दिशा, विदेशी सम्बन्ध सक्रिय, इच्छाएं प्रबल', sa: 'जुनूनी नई दिशा, विदेशी सम्बन्ध सक्रिय, इच्छाएं प्रबल', mai: 'जुनूनी नई दिशा, विदेशी सम्बन्ध सक्रिय, इच्छाएं प्रबल', mr: 'जुनूनी नई दिशा, विदेशी सम्बन्ध सक्रिय, इच्छाएं प्रबल', ta: 'obsessive new direction, foreign connection activated, desires amplified', te: 'obsessive new direction, foreign connection activated, desires amplified', bn: 'obsessive new direction, foreign connection activated, desires amplified', kn: 'obsessive new direction, foreign connection activated, desires amplified', gu: 'obsessive new direction, foreign connection activated, desires amplified' },
  8: { en: 'past-life karmic acceleration, sudden spiritual detachment', hi: 'पूर्वजन्म कार्मिक त्वरण, अचानक आध्यात्मिक वैराग्य', sa: 'पूर्वजन्म कार्मिक त्वरण, अचानक आध्यात्मिक वैराग्य', mai: 'पूर्वजन्म कार्मिक त्वरण, अचानक आध्यात्मिक वैराग्य', mr: 'पूर्वजन्म कार्मिक त्वरण, अचानक आध्यात्मिक वैराग्य', ta: 'past-life karmic acceleration, sudden spiritual detachment', te: 'past-life karmic acceleration, sudden spiritual detachment', bn: 'past-life karmic acceleration, sudden spiritual detachment', kn: 'past-life karmic acceleration, sudden spiritual detachment', gu: 'past-life karmic acceleration, sudden spiritual detachment' },
};

function computePersonalInsight(eclipse: EclipseInfo, kundali: KundaliData, locale: Locale): PersonalInsight {
  const isHi = isDevanagariLocale(locale);
  const now = new Date();

  // 1. Which house does the eclipse fall in?
  const eclipseSign = Math.floor(eclipse.eclipseLongitude / 30) + 1;
  const ascSign = kundali.ascendant.sign;
  const house = ((eclipseSign - ascSign + 12) % 12) + 1;
  const houseMeaning = HOUSE_MEANINGS[house] || HOUSE_MEANINGS[1];

  // 2. Current Mahadasha + Antardasha
  const mahadashas = kundali.dashas.filter(d => d.level === 'maha');
  const currentMaha = mahadashas.find(d => new Date(d.startDate) <= now && new Date(d.endDate) >= now);
  const currentAntar = currentMaha?.subPeriods?.find(d => new Date(d.startDate) <= now && new Date(d.endDate) >= now);

  let dashAlert: string | null = null;
  if (currentMaha) {
    const mahaPlanet = currentMaha.planet.toLowerCase();
    const relevantPlanets = eclipse.type === 'solar'
      ? ['sun', 'ketu', 'rahu']
      : ['moon', 'ketu', 'rahu'];

    if (relevantPlanets.includes(mahaPlanet)) {
      const pName = isHi ? currentMaha.planetName.hi : currentMaha.planetName.en;
      dashAlert = isHi
        ? `⚠ आप ${pName} महादशा में हैं — यह ग्रहण आपके लिए अत्यन्त प्रभावशाली होगा!`
        : `⚠ You are in ${pName} Mahadasha — this eclipse will be especially powerful for you!`;
    } else if (currentAntar) {
      const antarPlanet = currentAntar.planet.toLowerCase();
      if (relevantPlanets.includes(antarPlanet)) {
        const pName = isHi ? currentAntar.planetName.hi : currentAntar.planetName.en;
        dashAlert = isHi
          ? `${pName} अन्तर्दशा चल रही है — इस ग्रहण का मध्यम प्रभाव अपेक्षित`
          : `${pName} Antardasha is active — moderate impact expected from this eclipse`;
      }
    }
  }

  // 3. Natal planet contacts (within 3° of eclipse degree)
  const natalContacts: string[] = [];
  for (const p of kundali.planets) {
    const diff = Math.abs(p.longitude - eclipse.eclipseLongitude);
    const minDiff = Math.min(diff, 360 - diff);
    if (minDiff < 3) {
      const pName = isHi ? PLANET_NAMES[p.planet.id]?.hi : PLANET_NAMES[p.planet.id]?.en;
      const effect = isHi ? CONTACT_EFFECTS[p.planet.id]?.hi : CONTACT_EFFECTS[p.planet.id]?.en;
      natalContacts.push(isHi
        ? `🎯 ग्रहण आपके जन्म ${pName} के ${minDiff.toFixed(1)}° भीतर — ${effect}`
        : `🎯 Eclipse within ${minDiff.toFixed(1)}° of your natal ${pName} — ${effect}`
      );
    }
  }

  // 4. Nakshatra lord match with dasha lord
  let nakshatraLink: string | null = null;
  if (currentMaha) {
    // Eclipse nakshatra from longitude
    const nakNum = Math.floor(eclipse.eclipseLongitude / (360 / 27)) + 1;
    // Nakshatra lords cycle: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury (repeat 3x)
    const NAK_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const nakLord = NAK_LORDS[(nakNum - 1) % 9];
    if (currentMaha.planet.toLowerCase() === nakLord.toLowerCase()) {
      nakshatraLink = isHi
        ? `⚡ ग्रहण नक्षत्र स्वामी (${nakLord}) = आपका महादशा स्वामी — अत्यन्त प्रबल प्रभाव!`
        : `⚡ Eclipse nakshatra lord (${nakLord}) = your Mahadasha lord — enormously amplified effect!`;
    }
  }

  // 5. Transit interactions — Saturn, Jupiter, Mars aspecting the eclipse degree
  // Vedic aspects: all planets aspect 7th (180°). Special: Mars 4th+8th, Jupiter 5th+9th, Saturn 3rd+10th
  const transitAspects: string[] = [];

  // Check if natal slow-moving planets (Saturn, Jupiter, Mars, Rahu, Ketu)
  // aspect the eclipse degree via Vedic drishti. These natal positions represent
  // the person's karmic blueprint — when an eclipse activates an aspected degree,
  // that planet's significations are triggered.
  const eclSignForAspect = Math.floor(eclipse.eclipseLongitude / 30) + 1;

  for (const p of kundali.planets) {
    const pSign = Math.floor(p.longitude / 30) + 1;
    const signDiff = ((eclSignForAspect - pSign + 12) % 12); // houses away

    // Check Vedic aspects
    let aspects = false;
    let aspectType = '';

    // All planets: 7th aspect (opposition)
    if (signDiff === 6) { aspects = true; aspectType = '7th aspect (opposition)'; }

    // Mars special: 4th and 8th
    if (p.planet.id === 2 && (signDiff === 3 || signDiff === 7)) {
      aspects = true;
      aspectType = signDiff === 3 ? '4th aspect' : '8th aspect';
    }

    // Jupiter special: 5th and 9th
    if (p.planet.id === 4 && (signDiff === 4 || signDiff === 8)) {
      aspects = true;
      aspectType = signDiff === 4 ? '5th aspect (trine)' : '9th aspect (trine)';
    }

    // Saturn special: 3rd and 10th
    if (p.planet.id === 6 && (signDiff === 2 || signDiff === 9)) {
      aspects = true;
      aspectType = signDiff === 2 ? '3rd aspect' : '10th aspect';
    }

    // Also check conjunction (same sign)
    if (signDiff === 0 && p.planet.id !== 0 && p.planet.id !== 1) {
      // Already caught by natal contacts if within 3°, but sign-level conjunction is worth noting
      const diff = Math.abs(p.longitude - eclipse.eclipseLongitude);
      const minDiff = Math.min(diff, 360 - diff);
      if (minDiff >= 3 && minDiff < 15) {
        aspects = true;
        aspectType = 'conjunction (same sign)';
      }
    }

    if (aspects && [2, 4, 6, 7, 8].includes(p.planet.id)) {
      const pName = isHi ? PLANET_NAMES[p.planet.id]?.hi : PLANET_NAMES[p.planet.id]?.en;

      // Detailed, plain-language implications based on planet + node + aspect
      let headline = '';
      let detail = '';

      if (p.planet.id === 6) { // Saturn
        if (eclipse.node === 'ketu') {
          headline = isHi ? 'शनि + केतु ग्रहण = अधिकतम कार्मिक दबाव' : 'Saturn + Ketu eclipse = maximum karmic pressure';
          detail = isHi
            ? 'आपके जन्म शनि की दृष्टि इस ग्रहण पर है। शनि अनुशासन, कठोर परिश्रम और कर्म-फल का ग्रह है। जब केतु (वैराग्य) के ग्रहण पर शनि दृष्टि डाले, तो जीवन के पुराने ढाँचे — कैरियर, सम्बन्ध, आदतें — टूट सकते हैं ताकि कुछ बेहतर बन सके। यह कठिन लगता है, पर यह शुद्धिकरण है। इस अवधि में बड़े निर्णय लेने से बचें — 6 माह बाद स्पष्टता आएगी।'
            : 'Your birth Saturn is casting its aspect on this eclipse point. Saturn is the planet of discipline, hard work, and karmic consequences. When Saturn aspects a Ketu eclipse, life\'s old structures — career arrangements, relationships, habits — may break down so something better can be built. This feels hard, but it\'s purification. Avoid major life decisions during this period — clarity comes 6 months later.';
        } else {
          headline = isHi ? 'शनि + राहु ग्रहण = दीर्घकालिक ढाँचागत परिवर्तन' : 'Saturn + Rahu eclipse = long-term structural change';
          detail = isHi
            ? 'शनि की दृष्टि इस राहु ग्रहण पर धैर्य की परीक्षा है। आपके जीवन में कोई व्यवस्था जो अब काम नहीं करती — कैरियर, वित्त, रहने की जगह — धीरे-धीरे बदलेगी। यह अचानक नहीं टूटता (जैसे केतु ग्रहण), बल्कि 1-2 वर्षों में धीमा परिवर्तन आता है। अनुशासन और व्यावहारिकता आपके सबसे बड़े सहयोगी हैं।'
            : 'Saturn\'s aspect on this Rahu eclipse is a test of patience. Some arrangement in your life that\'s no longer working — career, finances, living situation — will shift gradually. Unlike a Ketu eclipse (which breaks things suddenly), this is a slow 1-2 year restructuring. Discipline and practicality are your biggest allies.';
        }
      } else if (p.planet.id === 4) { // Jupiter
        if (eclipse.node === 'ketu') {
          headline = isHi ? 'बृहस्पति + केतु ग्रहण = आध्यात्मिक सफलता' : 'Jupiter + Ketu eclipse = spiritual breakthrough';
          detail = isHi
            ? 'बृहस्पति ज्ञान, गुरु और विस्तार का ग्रह है। जब बृहस्पति की दृष्टि केतु (मोक्ष) के ग्रहण पर पड़े, तो यह सबसे शुभ आध्यात्मिक संयोग है। किसी शिक्षक, पुस्तक, या अनुभव से गहन ज्ञान प्राप्त हो सकता है। ध्यान, तीर्थ यात्रा, या शास्त्र अध्ययन इस समय अत्यन्त फलदायी होंगे।'
            : 'Jupiter is the planet of wisdom, gurus, and expansion. When Jupiter aspects a Ketu (moksha) eclipse, it\'s one of the most auspicious spiritual combinations. You may receive profound wisdom from a teacher, book, or experience. Meditation, pilgrimage, or scripture study during this period will be extraordinarily fruitful.';
        } else {
          headline = isHi ? 'बृहस्पति + राहु ग्रहण = ज्ञान बनाम भ्रम' : 'Jupiter + Rahu eclipse = wisdom vs illusion';
          detail = isHi
            ? 'बृहस्पति ज्ञान चाहता है, राहु भ्रम फैलाता है। इस संयोग में बड़े-बड़े वादे और अवसर आ सकते हैं जो वास्तव में जितने दिखते हैं उतने अच्छे नहीं। विवेक से काम लें — हर चमकती चीज़ सोना नहीं। शिक्षा और धार्मिक मामलों में सावधानी बरतें।'
            : 'Jupiter wants wisdom, Rahu creates illusion. This combination may bring grand-sounding opportunities and promises that aren\'t as good as they appear. Use discernment — not everything that glitters is gold. Be cautious in educational and religious matters.';
        }
      } else if (p.planet.id === 2) { // Mars
        headline = isHi ? 'मंगल दृष्टि = अचानक ऊर्जा विस्फोट' : 'Mars aspect = sudden energy burst';
        detail = isHi
          ? 'मंगल साहस, ऊर्जा और कभी-कभी आक्रामकता का ग्रह है। जब मंगल की दृष्टि ग्रहण पर हो, तो अचानक कार्रवाई, टकराव, या निर्णय लेने का दबाव आ सकता है। ऊर्जा को सकारात्मक दिशा में लगाएं — व्यायाम, नए प्रोजेक्ट शुरू करना, या साहसिक कदम। क्रोध और आवेगपूर्ण निर्णयों से सावधान रहें।'
          : 'Mars is the planet of courage, energy, and sometimes aggression. When Mars aspects an eclipse, expect sudden pressure to act, confrontations, or forced decisions. Channel this energy positively — exercise, launch new projects, take bold steps. Be careful of anger and impulsive decisions.';
      } else if (p.planet.id === 7) { // Rahu
        headline = isHi ? 'राहु दृष्टि = इच्छाएं और जुनून तीव्र' : 'Rahu aspect = desires and obsessions intensify';
        detail = isHi
          ? 'आपके जन्म राहु की दृष्टि इस ग्रहण पर है। राहु अतृप्त इच्छा का ग्रह है — जो चीज़ आप सबसे ज़्यादा चाहते हैं, उसकी तीव्रता बढ़ेगी। यह समय बड़े वित्तीय निर्णय, नई साझेदारी, या जीवन-बदलने वाले कदमों के लिए अच्छा नहीं — भ्रम की सम्भावना अधिक है। 3-6 माह प्रतीक्षा करें।'
          : 'Your birth Rahu is casting its aspect on this eclipse. Rahu is the planet of insatiable desire — whatever you want most will feel more intense. This is NOT a good time for major financial decisions, new partnerships, or life-changing moves — the risk of illusion is high. Wait 3-6 months for clarity.';
      } else if (p.planet.id === 8) { // Ketu
        headline = isHi ? 'केतु दृष्टि = वैराग्य और आन्तरिक शुद्धि' : 'Ketu aspect = detachment and inner purification';
        detail = isHi
          ? 'आपके जन्म केतु की दृष्टि इस ग्रहण पर है। केतु आध्यात्मिक वैराग्य और पूर्वजन्म कर्म का ग्रह है। इस अवधि में आप ऐसी चीज़ों से अचानक उदासीन हो सकते हैं जो पहले बहुत महत्वपूर्ण लगती थीं — कैरियर, सम्पत्ति, सम्बन्ध। यह भयावह लग सकता है, पर यह आत्मा का शुद्धिकरण है। ध्यान और आत्मचिन्तन के लिए उत्तम समय।'
          : 'Your birth Ketu is casting its aspect on this eclipse. Ketu is the planet of spiritual detachment and past-life karma. During this period, you may suddenly become indifferent to things that previously felt very important — career ambitions, possessions, relationships. This can feel alarming, but it\'s the soul\'s purification process. Excellent time for meditation and self-reflection.';
      }

      transitAspects.push(isHi
        ? `🔥 ${headline}\n${detail}`
        : `🔥 ${headline}\n${detail}`
      );
    }
  }

  // 6. Overall intensity — now includes transit aspects
  const factors = (dashAlert ? 1 : 0) + natalContacts.length + (nakshatraLink ? 1 : 0) + transitAspects.length;
  const overallIntensity: PersonalInsight['overallIntensity'] =
    factors >= 3 ? 'high' : factors >= 1 ? 'moderate' : 'low';

  return {
    dashAlert,
    natalContacts,
    houseAffected: { house, meaning: isHi ? houseMeaning.hi || "" : houseMeaning.en },
    nakshatraLink,
    transitAspects,
    overallIntensity,
  };
}

export default function PersonalEclipseInsight({
  eclipseDate,
  eclipseType,
  eclipseNode,
  eclipseLongitude,
  locale,
}: {
  eclipseDate: string;
  eclipseType: 'solar' | 'lunar';
  eclipseNode: 'rahu' | 'ketu';
  eclipseLongitude: number;
  locale: Locale;
}) {
  const isHi = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);

  const { user } = useAuthStore();
  const { charts, fetchCharts } = useChartsStore();
  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Try sessionStorage first (fast, already computed from kundali page)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = sessionStorage.getItem('kundali_last_result');
      if (cached) {
        const { kundali: k } = JSON.parse(cached);
        if (k?.planets && k?.ascendant && k?.dashas) {
          setKundali(k as KundaliData);
          return;
        }
      }
    } catch { /* ignore */ }

    // 2. If logged in, fetch saved charts to find primary
    if (user?.id && charts.length === 0) {
      fetchCharts();
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. If we have a primary chart but no kundali, compute it via API
  useEffect(() => {
    if (kundali || loading) return;
    const primary = charts.find(c => c.is_primary) || charts[0];
    if (!primary?.birth_data) return;

    setLoading(true);
    const bd = primary.birth_data;
    fetch('/api/kundali', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: bd.date, time: bd.time,
        lat: bd.lat, lng: bd.lng,
        timezone: bd.timezone, ayanamsha: bd.ayanamsha || 'lahiri',
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data?.planets && data?.ascendant && data?.dashas) {
          setKundali(data as KundaliData);
          // Cache for other eclipses in same session
          try { sessionStorage.setItem('kundali_last_result', JSON.stringify({ kundali: data })); } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [charts, kundali, loading]);

  const insight = useMemo(() => {
    if (!kundali) return null;
    return computePersonalInsight(
      { date: eclipseDate, type: eclipseType, node: eclipseNode, eclipseLongitude },
      kundali,
      locale,
    );
  }, [kundali, eclipseDate, eclipseType, eclipseNode, eclipseLongitude, locale]);

  if (loading) {
    return (
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 p-4 text-center">
        <span className="text-text-secondary/50 text-xs">{isHi ? '🔮 आपकी कुण्डली लोड हो रही है...' : '🔮 Loading your chart...'}</span>
      </div>
    );
  }

  if (!kundali || !insight) return null;

  const intensityColor = insight.overallIntensity === 'high' ? 'text-red-400' : insight.overallIntensity === 'moderate' ? 'text-amber-400' : 'text-emerald-400';
  const intensityBorder = insight.overallIntensity === 'high' ? 'border-red-500/20' : insight.overallIntensity === 'moderate' ? 'border-amber-500/20' : 'border-emerald-500/20';
  const intensityLabel = {
    high: { en: 'HIGH IMPACT', hi: 'उच्च प्रभाव', sa: 'उच्च प्रभाव', mai: 'उच्च प्रभाव', mr: 'उच्च प्रभाव', ta: 'HIGH IMPACT', te: 'HIGH IMPACT', bn: 'HIGH IMPACT', kn: 'HIGH IMPACT', gu: 'HIGH IMPACT' },
    moderate: { en: 'MODERATE IMPACT', hi: 'मध्यम प्रभाव', sa: 'मध्यम प्रभाव', mai: 'मध्यम प्रभाव', mr: 'मध्यम प्रभाव', ta: 'MODERATE IMPACT', te: 'MODERATE IMPACT', bn: 'MODERATE IMPACT', kn: 'MODERATE IMPACT', gu: 'MODERATE IMPACT' },
    low: { en: 'LOW IMPACT', hi: 'न्यून प्रभाव', sa: 'न्यून प्रभाव', mai: 'न्यून प्रभाव', mr: 'न्यून प्रभाव', ta: 'LOW IMPACT', te: 'LOW IMPACT', bn: 'LOW IMPACT', kn: 'LOW IMPACT', gu: 'LOW IMPACT' },
  }[insight.overallIntensity];

  return (
    <div className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border ${intensityBorder} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
          {isHi ? '🔮 आपकी कुण्डली के लिए' : '🔮 For Your Chart'}
        </h4>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${intensityBorder} ${intensityColor}`}>
          {isHi ? intensityLabel.hi : intensityLabel.en}
        </span>
      </div>

      <div className="space-y-3 text-xs leading-relaxed" style={bodyFont}>
        {/* House affected */}
        <div className="flex items-start gap-2">
          <span className="text-gold-primary text-sm shrink-0">🏠</span>
          <div>
            <span className="text-gold-light font-semibold">
              {isHi ? `${insight.houseAffected.house}वाँ भाव प्रभावित` : `Falls in your ${insight.houseAffected.house}${ordinal(insight.houseAffected.house)} House`}
            </span>
            <span className="text-text-secondary/60"> — {insight.houseAffected.meaning}</span>
          </div>
        </div>

        {/* Dasha alert */}
        {insight.dashAlert && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
            <span className="text-red-400 text-sm shrink-0">⏰</span>
            <span className="text-red-300/90">{insight.dashAlert}</span>
          </div>
        )}

        {/* Natal contacts */}
        {insight.natalContacts.map((c, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <span className="text-amber-300/90">{c}</span>
          </div>
        ))}

        {/* Nakshatra link */}
        {insight.nakshatraLink && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/10">
            <span className="text-violet-300/90">{insight.nakshatraLink}</span>
          </div>
        )}

        {/* Transit aspects — natal Saturn/Jupiter/Mars/Rahu/Ketu aspecting eclipse */}
        {insight.transitAspects.map((t, i) => {
          const [headline, ...detailParts] = t.split('\n');
          const detail = detailParts.join(' ');
          return (
            <div key={i} className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 space-y-1.5">
              <div className="text-red-300/90 font-semibold text-xs">{headline}</div>
              {detail && <p className="text-text-secondary/70 text-xs leading-relaxed">{detail}</p>}
            </div>
          );
        })}

        {/* Low impact note */}
        {insight.overallIntensity === 'low' && !insight.dashAlert && insight.natalContacts.length === 0 && insight.transitAspects.length === 0 && (
          <p className="text-emerald-400/60 text-xs">
            {isHi
              ? '✓ इस ग्रहण का आपकी कुण्डली पर न्यूनतम प्रत्यक्ष प्रभाव — कोई ग्रह 3° के भीतर नहीं, कोई दृष्टि नहीं, सम्बन्धित दशा नहीं।'
              : '✓ Minimal direct impact on your chart — no planets within 3°, no aspects to eclipse, no relevant dasha active.'}
          </p>
        )}
      </div>
    </div>
  );
}

function ordinal(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}
