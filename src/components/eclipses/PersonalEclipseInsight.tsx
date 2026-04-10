'use client';

import { useMemo } from 'react';
import type { Locale, Trilingual } from '@/types/panchang';
import type { PlanetPosition, DashaEntry } from '@/types/kundali';

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
  overallIntensity: 'high' | 'moderate' | 'low';
}

const HOUSE_MEANINGS: Record<number, { en: string; hi: string }> = {
  1:  { en: 'Self, health, personality, physical body', hi: 'स्व, स्वास्थ्य, व्यक्तित्व, शरीर' },
  2:  { en: 'Wealth, family, speech, food habits', hi: 'धन, परिवार, वाणी, भोजन' },
  3:  { en: 'Courage, siblings, communication, short travels', hi: 'साहस, भाई-बहन, संवाद, लघु यात्रा' },
  4:  { en: 'Home, mother, emotional peace, property', hi: 'घर, माता, मानसिक शान्ति, सम्पत्ति' },
  5:  { en: 'Children, education, creativity, past-life merit', hi: 'सन्तान, शिक्षा, रचनात्मकता, पूर्व पुण्य' },
  6:  { en: 'Enemies, disease, debts, daily work', hi: 'शत्रु, रोग, ऋण, दैनिक कार्य' },
  7:  { en: 'Marriage, partnerships, business, public image', hi: 'विवाह, साझेदारी, व्यापार, सार्वजनिक छवि' },
  8:  { en: 'Transformation, longevity, occult, sudden events', hi: 'परिवर्तन, आयु, गुप्त, अचानक घटनाएं' },
  9:  { en: 'Fortune, dharma, guru, father, long journeys', hi: 'भाग्य, धर्म, गुरु, पिता, लम्बी यात्रा' },
  10: { en: 'Career, reputation, authority, public status', hi: 'कैरियर, प्रतिष्ठा, अधिकार, सार्वजनिक स्थिति' },
  11: { en: 'Gains, income, friendships, wish fulfillment', hi: 'लाभ, आय, मित्रता, इच्छापूर्ति' },
  12: { en: 'Expenses, moksha, foreign lands, isolation', hi: 'व्यय, मोक्ष, विदेश, एकान्त' },
};

const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' },
  1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' },
  3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'बृहस्पति' },
  5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' },
  7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

const CONTACT_EFFECTS: Record<number, { en: string; hi: string }> = {
  0: { en: 'career/authority disruption, father\'s health', hi: 'कैरियर/अधिकार व्यवधान, पिता का स्वास्थ्य' },
  1: { en: 'emotional upheaval, mother\'s health, mental restlessness', hi: 'भावनात्मक उथल-पुथल, माता का स्वास्थ्य, मानसिक अशान्ति' },
  2: { en: 'energy conflicts, property disputes, sibling issues', hi: 'ऊर्जा संघर्ष, सम्पत्ति विवाद, भाई-बहन मुद्दे' },
  3: { en: 'communication breakdown, business disruption, intellect shift', hi: 'संवाद विच्छेद, व्यापार व्यवधान, बुद्धि परिवर्तन' },
  4: { en: 'wisdom expansion or guru issues, children matters, education shift', hi: 'ज्ञान विस्तार या गुरु मुद्दे, सन्तान, शिक्षा परिवर्तन' },
  5: { en: 'relationship transformation, luxury/comfort changes, creative shift', hi: 'सम्बन्ध परिवर्तन, विलास/सुख परिवर्तन, रचनात्मक मोड़' },
  6: { en: 'structural collapse forcing rebuilding, discipline tested, chronic health', hi: 'ढाँचागत पतन जो पुनर्निर्माण बाध्य करे, अनुशासन परीक्षा, दीर्घकालिक स्वास्थ्य' },
  7: { en: 'obsessive new direction, foreign connection activated, desires amplified', hi: 'जुनूनी नई दिशा, विदेशी सम्बन्ध सक्रिय, इच्छाएं प्रबल' },
  8: { en: 'past-life karmic acceleration, sudden spiritual detachment', hi: 'पूर्वजन्म कार्मिक त्वरण, अचानक आध्यात्मिक वैराग्य' },
};

function computePersonalInsight(eclipse: EclipseInfo, kundali: KundaliData, locale: Locale): PersonalInsight {
  const isHi = locale !== 'en';
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

  // 5. Overall intensity
  const factors = (dashAlert ? 1 : 0) + natalContacts.length + (nakshatraLink ? 1 : 0);
  const overallIntensity: PersonalInsight['overallIntensity'] =
    factors >= 2 ? 'high' : factors >= 1 ? 'moderate' : 'low';

  return {
    dashAlert,
    natalContacts,
    houseAffected: { house, meaning: isHi ? houseMeaning.hi : houseMeaning.en },
    nakshatraLink,
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
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  // Try to get kundali from sessionStorage
  const kundali = useMemo<KundaliData | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = sessionStorage.getItem('kundali_last_result');
      if (!cached) return null;
      const { kundali: k } = JSON.parse(cached);
      if (k?.planets && k?.ascendant && k?.dashas) return k as KundaliData;
    } catch { /* ignore */ }
    return null;
  }, []);

  const insight = useMemo(() => {
    if (!kundali) return null;
    return computePersonalInsight(
      { date: eclipseDate, type: eclipseType, node: eclipseNode, eclipseLongitude },
      kundali,
      locale,
    );
  }, [kundali, eclipseDate, eclipseType, eclipseNode, eclipseLongitude, locale]);

  if (!kundali || !insight) return null;

  const intensityColor = insight.overallIntensity === 'high' ? 'text-red-400' : insight.overallIntensity === 'moderate' ? 'text-amber-400' : 'text-emerald-400';
  const intensityBorder = insight.overallIntensity === 'high' ? 'border-red-500/20' : insight.overallIntensity === 'moderate' ? 'border-amber-500/20' : 'border-emerald-500/20';
  const intensityLabel = {
    high: { en: 'HIGH IMPACT', hi: 'उच्च प्रभाव' },
    moderate: { en: 'MODERATE IMPACT', hi: 'मध्यम प्रभाव' },
    low: { en: 'LOW IMPACT', hi: 'न्यून प्रभाव' },
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

        {/* Low impact note */}
        {insight.overallIntensity === 'low' && !insight.dashAlert && insight.natalContacts.length === 0 && (
          <p className="text-emerald-400/60 text-xs">
            {isHi
              ? '✓ इस ग्रहण का आपकी कुण्डली पर न्यूनतम प्रत्यक्ष प्रभाव — कोई ग्रह 3° के भीतर नहीं, सम्बन्धित दशा नहीं।'
              : '✓ Minimal direct impact on your chart — no planets within 3° of eclipse, no relevant dasha active.'}
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
