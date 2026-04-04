'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { useLocationStore } from '@/stores/location-store';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import {
  dateToJD, sunLongitude, toSidereal, calculateTithi, calculateYoga,
  getMasa, getSamvatsara, MASA_NAMES, SAMVATSARA_NAMES,
} from '@/lib/ephem/astronomical';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { VARA_DATA } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';

// ─── Constants ──────────────────────────────────────────────────

type ClockMode = '60' | '30';

// 30 Muhurta names — traditional sequence from sunrise
const MUHURTA_NAMES: { en: string; hi: string; nature: 'good' | 'bad' | 'mixed' }[] = [
  { en: 'Rudra', hi: 'रुद्र', nature: 'bad' },
  { en: 'Ahi', hi: 'अहि', nature: 'bad' },
  { en: 'Mitra', hi: 'मित्र', nature: 'good' },
  { en: 'Pitri', hi: 'पितृ', nature: 'bad' },
  { en: 'Vasu', hi: 'वसु', nature: 'good' },
  { en: 'Vara', hi: 'वाराह', nature: 'good' },
  { en: 'Vishvedeva', hi: 'विश्वदेव', nature: 'good' },
  { en: 'Vidhi', hi: 'विधि', nature: 'good' },
  { en: 'Satamukhi', hi: 'शतमुखी', nature: 'good' },
  { en: 'Puruhuta', hi: 'पुरुहूत', nature: 'good' },
  { en: 'Vahini', hi: 'वाहिनी', nature: 'bad' },
  { en: 'Naktanakara', hi: 'नक्तनकर', nature: 'bad' },
  { en: 'Varuna', hi: 'वरुण', nature: 'good' },
  { en: 'Aryaman', hi: 'अर्यमन्', nature: 'good' },
  { en: 'Bhaga', hi: 'भग', nature: 'bad' },
  { en: 'Girisha', hi: 'गिरीश', nature: 'bad' },
  { en: 'Ajapada', hi: 'अजपाद', nature: 'bad' },
  { en: 'Ahirbudhnya', hi: 'अहिर्बुध्न्य', nature: 'good' },
  { en: 'Pusha', hi: 'पूषन्', nature: 'good' },
  { en: 'Ashvini', hi: 'अश्विनी', nature: 'good' },
  { en: 'Yama', hi: 'यम', nature: 'bad' },
  { en: 'Agni', hi: 'अग्नि', nature: 'good' },
  { en: 'Vidhata', hi: 'विधाता', nature: 'good' },
  { en: 'Kanda', hi: 'कण्ड', nature: 'good' },
  { en: 'Aditi', hi: 'अदिति', nature: 'good' },
  { en: 'Jiva', hi: 'जीव', nature: 'good' },
  { en: 'Vishnu', hi: 'विष्णु', nature: 'good' },
  { en: 'Dyumadgadyuti', hi: 'द्युमद्गद्युति', nature: 'good' },
  { en: 'Brahma', hi: 'ब्रह्म', nature: 'good' },
  { en: 'Samudram', hi: 'समुद्रम्', nature: 'mixed' },
];

// 5 Dinamana Kalas — day divided into 5 × 6 ghati (30-ghati clock only)
const DINAMANA_KALAS: { en: string; hi: string; sa: string }[] = [
  { en: 'Pratah Kala', hi: 'प्रातःकाल', sa: 'प्रातःकालः' },
  { en: 'Sangava Kala', hi: 'सङ्गवकाल', sa: 'सङ्गवकालः' },
  { en: 'Madhyahna', hi: 'मध्याह्न', sa: 'मध्याह्नः' },
  { en: 'Aparahna', hi: 'अपराह्ण', sa: 'अपराह्णः' },
  { en: 'Sayana Kala', hi: 'सायंकाल', sa: 'सायंकालः' },
];

// 5 Ratrimana Kalas — night divided into 5 × 6 ghati
const RATRIMANA_KALAS: { en: string; hi: string; sa: string }[] = [
  { en: 'Pradosha Kala', hi: 'प्रदोषकाल', sa: 'प्रदोषकालः' },
  { en: 'Nisha Kala', hi: 'निशाकाल', sa: 'निशाकालः' },
  { en: 'Madhya Ratri', hi: 'मध्यरात्रि', sa: 'मध्यरात्रिः' },
  { en: 'Aparatri Kala', hi: 'अपरात्रिकाल', sa: 'अपरात्रिकालः' },
  { en: 'Usha Kala', hi: 'ऊषाकाल', sa: 'ऊषाकालः' },
];

// 8 Prahar names (used in 60-ghati Ishtakala clock)
const PRAHAR_NAMES: { en: string; hi: string }[] = [
  { en: 'Pratah Kaal', hi: 'प्रातःकाल' },
  { en: 'Sangava Kaal', hi: 'सङ्गवकाल' },
  { en: 'Madhyahna Kaal', hi: 'मध्याह्नकाल' },
  { en: 'Aparahna Kaal', hi: 'अपराह्णकाल' },
  { en: 'Sayahna Kaal', hi: 'सायंकाल' },
  { en: 'Pradosha Kaal', hi: 'प्रदोषकाल' },
  { en: 'Nisha Kaal', hi: 'निशाकाल' },
  { en: 'Usha Kaal', hi: 'ऊषाकाल' },
];

// ─── Computation ────────────────────────────────────────────────

interface VedicTimeResult {
  ghati: number; pala: number; vipala: number;
  prahar: number; muhurta: number;
  praharName: { en: string; hi: string } | undefined;
  muhurtaName: { en: string; hi: string; nature: 'good' | 'bad' | 'mixed' } | undefined;
  kalaName: { en: string; hi: string; sa: string } | undefined;
  isDaytime: boolean;
  praharDurationMin: number;
  muhurtaDurationMin: number;
  ghatiDurationSec: number;
  sunriseVedic: string;
  sunsetVedic: string;
  sunriseStr: string;
  sunsetStr: string;
}

function computeVedicTime(
  now: Date, sunriseDate: Date, sunsetDate: Date, nextSunriseDate: Date, mode: ClockMode,
): VedicTimeResult {
  const nowMs = now.getTime();
  const sunriseMs = sunriseDate.getTime();
  const sunsetMs = sunsetDate.getTime();
  const nextSunriseMs = nextSunriseDate.getTime();

  const dayMs = sunsetMs - sunriseMs;
  const nightMs = nextSunriseMs - sunsetMs;
  const ahoratraMs = nextSunriseMs - sunriseMs;
  const isDaytime = nowMs >= sunriseMs && nowMs < sunsetMs;

  let ghati: number, pala: number, vipala: number;
  let ghatiDurationMs: number;

  if (mode === '60') {
    // ── 60-Ghati Ishtakala: sunrise→next sunrise = 60 equal ghati ──
    ghatiDurationMs = ahoratraMs / 60;
    let elapsedMs = nowMs - sunriseMs;
    if (elapsedMs < 0) elapsedMs += 24 * 3600 * 1000;

    const totalGhati = elapsedMs / ghatiDurationMs;
    ghati = Math.floor(totalGhati);
    const pF = (totalGhati - ghati) * 60;
    pala = Math.floor(pF);
    vipala = Math.floor((pF - pala) * 60);
  } else {
    // ── 30-Ghati: day = 30 ghati, night = 30 ghati ──
    // Sunrise = 00:00:00, Sunset = 30:00:00
    if (isDaytime) {
      ghatiDurationMs = dayMs / 30;
      const elapsedMs = nowMs - sunriseMs;
      const totalGhati = elapsedMs / ghatiDurationMs;
      ghati = Math.floor(totalGhati);
      const pF = (totalGhati - ghati) * 60;
      pala = Math.floor(pF);
      vipala = Math.floor((pF - pala) * 60);
    } else {
      ghatiDurationMs = nightMs / 30;
      const nightElapsed = nowMs >= sunsetMs ? nowMs - sunsetMs : nowMs - sunsetMs + 24 * 3600 * 1000;
      const totalGhati = nightElapsed / ghatiDurationMs;
      ghati = 30 + Math.floor(totalGhati); // 30-59 for night
      const pF = (totalGhati - Math.floor(totalGhati)) * 60;
      pala = Math.floor(pF);
      vipala = Math.floor((pF - pala) * 60);
    }
  }

  // Elapsed from sunrise for prahar/muhurta (always based on full ahoratra for 60-ghati)
  let elapsedForPM = nowMs - sunriseMs;
  if (elapsedForPM < 0) elapsedForPM += 24 * 3600 * 1000;

  // Prahar & Muhurta
  let prahar: number, muhurta: number;
  let praharDurationMs: number, muhurtaDurationMs: number;

  if (mode === '60') {
    // Equal divisions of ahoratra
    praharDurationMs = ahoratraMs / 8;
    muhurtaDurationMs = ahoratraMs / 30;
    prahar = Math.min(Math.floor(elapsedForPM / praharDurationMs) + 1, 8);
    muhurta = Math.min(Math.floor(elapsedForPM / muhurtaDurationMs) + 1, 30);
  } else {
    // Day and night divided separately
    if (isDaytime) {
      praharDurationMs = dayMs / 4;
      muhurtaDurationMs = dayMs / 15;
      const dayElapsed = nowMs - sunriseMs;
      prahar = Math.min(Math.floor(dayElapsed / praharDurationMs) + 1, 4);
      muhurta = Math.min(Math.floor(dayElapsed / muhurtaDurationMs) + 1, 15);
    } else {
      praharDurationMs = nightMs / 4;
      muhurtaDurationMs = nightMs / 15;
      const nightElapsed = nowMs >= sunsetMs ? nowMs - sunsetMs : nowMs - sunsetMs + 24 * 3600 * 1000;
      prahar = Math.min(Math.floor(nightElapsed / praharDurationMs) + 5, 8);
      muhurta = Math.min(Math.floor(nightElapsed / muhurtaDurationMs) + 16, 30);
    }
  }

  // Kala name (30-ghati clock: 5 kalas of 6 ghati each for day & night)
  let kalaName: { en: string; hi: string; sa: string } | undefined;
  if (mode === '30') {
    if (isDaytime) {
      const dayElapsed = nowMs - sunriseMs;
      const kalaIdx = Math.min(Math.floor(dayElapsed / (dayMs / 5)), 4);
      kalaName = DINAMANA_KALAS[kalaIdx];
    } else {
      const nightElapsed = nowMs >= sunsetMs ? nowMs - sunsetMs : nowMs - sunsetMs + 24 * 3600 * 1000;
      const kalaIdx = Math.min(Math.floor(nightElapsed / (nightMs / 5)), 4);
      kalaName = RATRIMANA_KALAS[kalaIdx];
    }
  }

  // Sunrise/Sunset in vedic ghati format
  // 60-ghati: sunrise = 00:00:00, sunset floats
  // 30-ghati: sunrise = 00:00:00, sunset = 30:00:00
  let sunriseVedic = '00:00:00';
  let sunsetVedic: string;
  if (mode === '30') {
    sunsetVedic = '30:00:00';
  } else {
    const sunsetFrac = (dayMs / ahoratraMs) * 60;
    const sG = Math.floor(sunsetFrac);
    const sPF = (sunsetFrac - sG) * 60;
    const sP = Math.floor(sPF);
    const sV = Math.floor((sPF - sP) * 60);
    sunsetVedic = `${String(sG).padStart(2, '0')}:${String(sP).padStart(2, '0')}:${String(sV).padStart(2, '0')}`;
  }

  return {
    ghati, pala, vipala,
    prahar, muhurta,
    praharName: PRAHAR_NAMES[prahar - 1],
    muhurtaName: MUHURTA_NAMES[muhurta - 1],
    kalaName,
    isDaytime,
    praharDurationMin: Math.round(praharDurationMs / 60000),
    muhurtaDurationMin: Math.round(muhurtaDurationMs / 60000),
    ghatiDurationSec: Math.round(ghatiDurationMs / 1000),
    sunriseVedic,
    sunsetVedic,
    sunriseStr: sunriseDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    sunsetStr: sunsetDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
  };
}

// ─── Component ──────────────────────────────────────────────────

export default function VedicTimePage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const locationStore = useLocationStore();
  const [time, setTime] = useState(new Date());
  const [clockMode, setClockMode] = useState<ClockMode>('60');

  useEffect(() => {
    if (!locationStore.confirmed && !locationStore.detecting) {
      locationStore.detect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 400);
    return () => clearInterval(interval);
  }, []);

  const userTimezone = locationStore.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzOffset = useMemo(() => {
    try {
      const now = new Date();
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const localDate = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
      return (localDate.getTime() - utcDate.getTime()) / 3600000;
    } catch {
      return new Date().getTimezoneOffset() / -60;
    }
  }, [userTimezone]);

  const sunTimes = useMemo(() => {
    const lat = locationStore.lat;
    const lng = locationStore.lng;
    if (lat == null || lng == null) return null;
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
    const today = getSunTimes(y, m, d, lat, lng, tzOffset);
    const tomorrow = new Date(y, m - 1, d + 1);
    const tomorrowTimes = getSunTimes(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate(), lat, lng, tzOffset);
    return { sunrise: today.sunrise, sunset: today.sunset, nextSunrise: tomorrowTimes.sunrise };
  }, [locationStore.lat, locationStore.lng, tzOffset]);

  const vedic = sunTimes
    ? computeVedicTime(time, sunTimes.sunrise, sunTimes.sunset, sunTimes.nextSunrise, clockMode)
    : null;

  // Panchang context — tithi, vara, masa, samvatsara at sunrise
  const panchangCtx = useMemo(() => {
    if (!sunTimes) return null;
    const sr = sunTimes.sunrise;
    const y = sr.getFullYear(), m = sr.getMonth() + 1, d = sr.getDate();
    const srHour = sr.getHours() + sr.getMinutes() / 60 + sr.getSeconds() / 3600;
    const utHour = srHour - tzOffset;
    const jd = dateToJD(y, m, d, utHour);

    const tithiResult = calculateTithi(jd);
    const tithiData = TITHIS[tithiResult.number - 1];
    const yogaNum = calculateYoga(jd);
    const yogaData = YOGAS[yogaNum - 1];
    const sunSid = toSidereal(sunLongitude(jd), jd);
    const masaIndex = getMasa(sunSid);
    const masaData = MASA_NAMES[masaIndex];
    const samvatsaraIndex = getSamvatsara(y);
    const samvatsaraData = SAMVATSARA_NAMES[samvatsaraIndex];

    const weekday = new Date(y, m - 1, d).getDay();
    const varaData = VARA_DATA[weekday];

    // Shaka Samvat: Gregorian year - 78 (Chaitra onwards), year - 79 (before Chaitra)
    const shakaSamvat = masaIndex >= 0 ? y - 78 : y - 79;
    // Vikram Samvat: Gregorian year + 57 (Chaitra onwards), year + 56 (before Chaitra)
    const vikramSamvat = masaIndex >= 0 ? y + 57 : y + 56;

    return {
      tithi: tithiData,
      yoga: yogaData,
      masa: masaData,
      vara: varaData,
      samvatsara: samvatsaraData,
      shakaSamvat,
      vikramSamvat,
      gregorianDate: new Date(y, m - 1, d),
    };
  }, [sunTimes, tzOffset]);

  const locationName = locationStore.name || userTimezone;
  const timeUnits = vedic ? [
    { label: { en: 'Ghati', hi: 'घटी' }, value: vedic.ghati, max: clockMode === '60' ? 60 : 60, desc: { en: `= ${Math.round(vedic.ghatiDurationSec / 60 * 10) / 10} min`, hi: `= ${Math.round(vedic.ghatiDurationSec / 60 * 10) / 10} मिनट` } },
    { label: { en: 'Pala', hi: 'पल' }, value: vedic.pala, max: 60, desc: { en: `= ${(vedic.ghatiDurationSec / 60).toFixed(1)} sec`, hi: `= ${(vedic.ghatiDurationSec / 60).toFixed(1)} सेकंड` } },
    { label: { en: 'Vipala', hi: 'विपल' }, value: vedic.vipala, max: 60, desc: { en: `= ${(vedic.ghatiDurationSec / 3600).toFixed(2)} sec`, hi: `= ${(vedic.ghatiDurationSec / 3600).toFixed(2)} सेकंड` } },
  ] : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Vedic Time' : 'वैदिक समय'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'The ancient Indian time system — Ghati, Pala, Vipala'
            : 'प्राचीन भारतीय समय पद्धति — घटी, पल, विपल'}
        </p>
        {locationName && <p className="text-text-secondary/50 text-sm mt-2">{locationName}</p>}
      </motion.div>

      {/* Clock mode toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-xl border border-gold-primary/20 overflow-hidden text-sm">
          <button
            onClick={() => setClockMode('60')}
            className={`px-5 py-2.5 font-medium transition-all ${clockMode === '60' ? 'bg-gold-primary/15 text-gold-light border-r border-gold-primary/20' : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5 border-r border-gold-primary/20'}`}
          >
            {locale === 'en' ? '60-Ghati (Ishtakala)' : '60-घटी (इष्टकाल)'}
          </button>
          <button
            onClick={() => setClockMode('30')}
            className={`px-5 py-2.5 font-medium transition-all ${clockMode === '30' ? 'bg-gold-primary/15 text-gold-light' : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'}`}
          >
            {locale === 'en' ? '30-Ghati (Muhurta)' : '30-घटी (मुहूर्त)'}
          </button>
        </div>
      </div>

      {/* Clock description */}
      <div className="text-center text-xs text-text-secondary/60 mb-6 max-w-xl mx-auto">
        {clockMode === '60'
          ? (locale === 'en'
            ? 'Sunrise → Next Sunrise = 60 equal Ghati. Sunset floats. Preferred for Kundali / Astrology.'
            : 'सूर्योदय → अगला सूर्योदय = 60 समान घटी। सूर्यास्त परिवर्तनशील। कुण्डली/ज्योतिष हेतु उपयुक्त।')
          : (locale === 'en'
            ? 'Dinamana (day) = 30 Ghati, Ratrimana (night) = 30 Ghati. Sunset fixed at 30:00:00. Preferred for Muhurta / Rituals.'
            : 'दिनमान = 30 घटी, रात्रिमान = 30 घटी। सूर्यास्त = 30:00:00। मुहूर्त/कर्मकाण्ड हेतु उपयुक्त।')}
      </div>

      {/* Dual time display — Vedic + Gregorian side by side */}
      {vedic ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Vedic Clock */}
          <div className="bg-gradient-to-br from-\[#2d1b69\]/40 via-\[#1a1040\]/50 to-\[#0a0e27\] border border-gold-primary/12 rounded-2xl p-6 text-center">
            <div className="text-gold-dark text-[10px] uppercase tracking-[0.3em] mb-2">
              {locale === 'en' ? 'Vedic Time' : 'वैदिक समय'}
            </div>
            <div className="text-gold-light text-4xl font-bold" style={headingFont}>
              {String(vedic.ghati).padStart(2, '0')}
              <span className="text-gold-primary/40">:</span>
              {String(vedic.pala).padStart(2, '0')}
              <span className="text-gold-primary/40">:</span>
              {String(vedic.vipala).padStart(2, '0')}
            </div>
            <div className="text-text-secondary/50 text-xs mt-1">
              {locale === 'en' ? 'Ghati : Pala : Vipala' : 'घटी : पल : विपल'}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-bg-secondary/40 py-2 px-2">
                <div className="text-text-secondary/50 text-[10px]">{locale === 'en' ? 'Sunrise' : 'सूर्योदय'}</div>
                <div className="text-gold-light font-mono font-semibold">{vedic.sunriseVedic}</div>
              </div>
              <div className="rounded-lg bg-bg-secondary/40 py-2 px-2">
                <div className="text-text-secondary/50 text-[10px]">{locale === 'en' ? 'Sunset' : 'सूर्यास्त'}</div>
                <div className="text-gold-light font-mono font-semibold">{vedic.sunsetVedic}</div>
              </div>
            </div>
          </div>

          {/* Gregorian Clock */}
          <div className="bg-gradient-to-br from-\[#2d1b69\]/40 via-\[#1a1040\]/50 to-\[#0a0e27\] border border-gold-primary/12 rounded-2xl p-6 text-center">
            <div className="text-text-secondary/50 text-[10px] uppercase tracking-[0.3em] mb-2">
              {locale === 'en' ? 'Gregorian Time' : 'ग्रेगोरियन समय'}
            </div>
            <div className="text-gold-light text-4xl font-bold font-mono tracking-wider">
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </div>
            <div className="text-text-secondary/50 text-xs mt-1">
              {locale === 'en' ? 'Hours : Minutes : Seconds' : 'घंटे : मिनट : सेकंड'}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-bg-secondary/40 py-2 px-2">
                <div className="text-text-secondary/50 text-[10px]">{locale === 'en' ? 'Sunrise' : 'सूर्योदय'}</div>
                <div className="text-text-primary font-mono font-semibold">{vedic.sunriseStr}</div>
              </div>
              <div className="rounded-lg bg-bg-secondary/40 py-2 px-2">
                <div className="text-text-secondary/50 text-[10px]">{locale === 'en' ? 'Sunset' : 'सूर्यास्त'}</div>
                <div className="text-text-primary font-mono font-semibold">{vedic.sunsetStr}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-text-secondary/50 text-sm">
          {locale === 'en' ? 'Detecting your location for accurate sunrise/sunset...' : 'सटीक सूर्योदय/सूर्यास्त के लिए स्थान खोज रहे हैं...'}
        </div>
      )}

      {/* Panchang context — Tithi, Vara, Masa, Samvatsara */}
      {panchangCtx && (
        <div className="bg-gradient-to-br from-\[#2d1b69\]/40 via-\[#1a1040\]/50 to-\[#0a0e27\] border border-gold-primary/12 rounded-xl px-5 py-3 mb-4 text-center" style={bodyFont}>
          <div className="text-gold-light text-sm font-semibold">
            {panchangCtx.masa?.[locale] || panchangCtx.masa?.en},{' '}
            {panchangCtx.tithi?.paksha === 'krishna'
              ? (locale === 'en' ? 'Krishna' : 'कृष्ण')
              : (locale === 'en' ? 'Shukla' : 'शुक्ल')}{' '}
            {panchangCtx.tithi?.name?.[locale] || panchangCtx.tithi?.name?.en},{' '}
            {panchangCtx.vikramSamvat} {locale === 'en' ? 'Vikram' : 'विक्रम'} / {panchangCtx.shakaSamvat} {locale === 'en' ? 'Shaka' : 'शक'}
          </div>
          <div className="text-text-secondary/60 text-xs mt-1">
            {panchangCtx.vara?.name?.[locale] || panchangCtx.vara?.name?.en}
            {' — '}
            {panchangCtx.samvatsara?.[locale] || panchangCtx.samvatsara?.en}{' '}
            {locale === 'en' ? 'Samvatsara' : 'संवत्सर'}
          </div>
          <div className="text-text-secondary/40 text-xs mt-0.5">
            {panchangCtx.gregorianDate.toLocaleDateString(locale === 'en' ? 'en-GB' : 'hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      )}

      {vedic && (
        <>
          <GoldDivider />

          {/* Vedic time display */}
          <div className="bg-gradient-to-br from-\[#2d1b69\]/40 via-\[#1a1040\]/50 to-\[#0a0e27\] border border-gold-primary/12 rounded-2xl p-8 my-8 border-2 border-gold-primary/30 bg-gradient-to-br from-gold-primary/5 to-transparent">
            <div className="text-center mb-6">
              <div className="text-gold-dark text-xs uppercase tracking-[0.3em] mb-3">
                {clockMode === '60'
                  ? (locale === 'en' ? 'Ishtakala (60-Ghati Clock)' : 'इष्टकाल (60-घटी घड़ी)')
                  : (locale === 'en'
                    ? `${vedic.isDaytime ? 'Dinamana' : 'Ratrimana'} (30-Ghati Clock)`
                    : `${vedic.isDaytime ? 'दिनमान' : 'रात्रिमान'} (30-घटी घड़ी)`)}
              </div>
              <div className="text-gold-light text-6xl font-bold" style={headingFont}>
                {String(vedic.ghati).padStart(2, '0')}
                <span className="text-gold-primary/50 mx-1">:</span>
                {String(vedic.pala).padStart(2, '0')}
                <span className="text-gold-primary/50 mx-1">:</span>
                {String(vedic.vipala).padStart(2, '0')}
              </div>
              <div className="text-text-secondary text-sm mt-2" style={bodyFont}>
                {locale === 'en' ? 'Ghati : Pala : Vipala' : 'घटी : पल : विपल'}
              </div>

              {/* Kala name — 30-ghati clock only */}
              {clockMode === '30' && vedic.kalaName && (
                <div className="mt-3 inline-block px-4 py-1.5 rounded-lg bg-gold-primary/10 border border-gold-primary/15">
                  <span className="text-gold-light text-sm font-semibold" style={bodyFont}>
                    {locale === 'sa' ? vedic.kalaName.sa : locale === 'hi' ? vedic.kalaName.hi : vedic.kalaName.en}
                  </span>
                  <span className="text-text-secondary/50 text-xs ml-2">
                    ({vedic.isDaytime
                      ? (locale === 'en' ? 'Dinamana' : 'दिनमान')
                      : (locale === 'en' ? 'Ratrimana' : 'रात्रिमान')})
                  </span>
                </div>
              )}
            </div>

            {/* Circular gauges */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              {timeUnits.map((unit, i) => {
                const displayMax = i === 0 ? (clockMode === '30' ? 60 : 60) : 60;
                const pct = Math.min((unit.value / displayMax) * 100, 100);
                const radius = 45;
                const circumference = 2 * Math.PI * radius;
                const dashOffset = circumference - (pct / 100) * circumference;

                return (
                  <motion.div key={i} className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}>
                    <div className="relative inline-block">
                      <svg viewBox="0 0 100 100" className="w-28 h-28">
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(212,168,83,0.1)" strokeWidth="6" />
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="#d4a853" strokeWidth="6"
                          strokeDasharray={circumference} strokeDashoffset={dashOffset}
                          strokeLinecap="round" transform="rotate(-90 50 50)"
                          className="transition-all duration-300" />
                        <text x="50" y="48" textAnchor="middle" dominantBaseline="middle" fill="#f0d48a" fontSize="24" fontWeight="bold">
                          {unit.value}
                        </text>
                        <text x="50" y="68" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" fontSize="9">
                          /{displayMax}
                        </text>
                      </svg>
                    </div>
                    <div className="text-gold-light text-sm font-bold mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {unit.label[locale === 'en' ? 'en' : 'hi']}
                    </div>
                    <div className="text-text-secondary/50 text-xs">{locale === 'en' ? unit.desc.en : unit.desc.hi}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Prahar & Muhurta */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-br from-\[#2d1b69\]/40 via-\[#1a1040\]/50 to-\[#0a0e27\] border border-gold-primary/12 rounded-xl p-5 text-center">
              <div className="text-gold-dark text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Prahar' : 'प्रहर'}</div>
              <div className="text-gold-light text-3xl font-bold">{vedic.prahar}<span className="text-text-secondary text-sm">/8</span></div>
              {vedic.praharName && (
                <div className="text-gold-primary text-sm font-semibold mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                  {locale === 'en' ? vedic.praharName.en : vedic.praharName.hi}
                </div>
              )}
              <div className="text-text-secondary/50 text-xs mt-0.5">
                {locale === 'en' ? `${vedic.praharDurationMin} min each` : `${vedic.praharDurationMin} मिनट प्रत्येक`}
              </div>
            </div>
            <div className="bg-gradient-to-br from-\[#2d1b69\]/40 via-\[#1a1040\]/50 to-\[#0a0e27\] border border-gold-primary/12 rounded-xl p-5 text-center">
              <div className="text-gold-dark text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Muhurta' : 'मुहूर्त'}</div>
              <div className="text-gold-light text-3xl font-bold">{vedic.muhurta}<span className="text-text-secondary text-sm">/30</span></div>
              {vedic.muhurtaName && (
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <span className="text-gold-primary text-sm font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                    {locale === 'en' ? vedic.muhurtaName.en : vedic.muhurtaName.hi}
                  </span>
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    vedic.muhurtaName.nature === 'good' ? 'bg-emerald-400' :
                    vedic.muhurtaName.nature === 'bad' ? 'bg-red-400' : 'bg-amber-400'
                  }`} title={vedic.muhurtaName.nature} />
                </div>
              )}
              <div className="text-text-secondary/50 text-xs mt-0.5">
                {locale === 'en' ? `${vedic.muhurtaDurationMin} min each` : `${vedic.muhurtaDurationMin} मिनट प्रत्येक`}
              </div>
            </div>
          </div>

          {/* 30-Ghati: Dinamana / Ratrimana Kala breakdown */}
          {clockMode === '30' && (
            <div className="bg-gradient-to-br from-\[#2d1b69\]/40 via-\[#1a1040\]/50 to-\[#0a0e27\] border border-gold-primary/12 rounded-xl p-5 mt-4">
              <div className="text-gold-dark text-xs uppercase tracking-wider mb-3 text-center">
                {vedic.isDaytime
                  ? (locale === 'en' ? 'Dinamana — 5 Kalas (6 Ghati each)' : 'दिनमान — 5 काल (6-6 घटी)')
                  : (locale === 'en' ? 'Ratrimana — 5 Kalas (6 Ghati each)' : 'रात्रिमान — 5 काल (6-6 घटी)')}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {(vedic.isDaytime ? DINAMANA_KALAS : RATRIMANA_KALAS).map((kala, i) => {
                  const isActive = vedic.kalaName?.en === kala.en;
                  return (
                    <div key={i} className={`text-center p-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-gold-primary/15 border border-gold-primary/30 text-gold-light'
                        : 'bg-bg-secondary/30 border border-gold-primary/5 text-text-secondary/50'
                    }`}>
                      <div className="font-semibold" style={bodyFont}>
                        {locale === 'sa' ? kala.sa : locale === 'hi' ? kala.hi : kala.en}
                      </div>
                      <div className="text-[10px] mt-0.5 opacity-60">{i * 6}–{(i + 1) * 6}G</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Conversion reference */}
      <div className="bg-gradient-to-br from-\[#2d1b69\]/40 via-\[#1a1040\]/50 to-\[#0a0e27\] border border-gold-primary/12 rounded-xl p-6 mt-8">
        <h3 className="text-gold-light text-lg font-bold mb-4 text-center" style={headingFont}>
          {locale === 'en' ? 'Vedic Time Units' : 'वैदिक समय इकाइयाँ'}
        </h3>
        <div className="space-y-2 text-sm text-text-secondary" style={bodyFont}>
          {[
            { en: '1 Truti = 29.6 microseconds', hi: '1 त्रुटि = 29.6 माइक्रोसेकंड' },
            { en: '1 Tatpara = 100 Truti', hi: '1 तत्पर = 100 त्रुटि' },
            { en: '1 Nimesha = 45 Tatpara (blink of an eye)', hi: '1 निमेष = 45 तत्पर (पलक झपकना)' },
            { en: '1 Kashtha = 18 Nimesha', hi: '1 काष्ठ = 18 निमेष' },
            { en: '1 Kala = 30 Kashtha', hi: '1 कला = 30 काष्ठ' },
            { en: '1 Nadika/Ghati = 15 Kala ≈ 24 minutes', hi: '1 नाड़िका/घटी = 15 कला ≈ 24 मिनट' },
            { en: '1 Muhurta = 2 Ghati ≈ 48 minutes', hi: '1 मुहूर्त = 2 घटी ≈ 48 मिनट' },
            { en: '1 Prahar/Yama = 7.5 Ghati ≈ 3 hours', hi: '1 प्रहर/याम = 7.5 घटी ≈ 3 घण्टे' },
            { en: '1 Ahoratra = 60 Ghati = 30 Muhurta = 8 Prahar', hi: '1 अहोरात्र = 60 घटी = 30 मुहूर्त = 8 प्रहर' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gold-primary/40 mt-0.5">&#9672;</span>
              <span>{locale === 'en' ? item.en : item.hi}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
