'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { useLocationStore } from '@/stores/location-store';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import type { Locale } from '@/types/panchang';

/**
 * Vedic Time calculation from sunrise/sunset.
 *
 * Ghati (Ishtakala clock): sunrise→next sunrise = 60 ghati (each ~24 min)
 * Prahar: day (sunrise→sunset) / 4 + night (sunset→sunrise) / 4 = 8
 * Muhurta: day / 15 + night / 15 = 30
 * Pala: 1/60 of ghati, Vipala: 1/60 of pala
 */
function computeVedicTime(now: Date, sunriseDate: Date, sunsetDate: Date, nextSunriseDate: Date) {
  const nowMs = now.getTime();
  const sunriseMs = sunriseDate.getTime();
  const sunsetMs = sunsetDate.getTime();
  const nextSunriseMs = nextSunriseDate.getTime();

  // Full ahoratra (sunrise to next sunrise) for Ishtakala
  const ahoratraMs = nextSunriseMs - sunriseMs;

  // Elapsed since sunrise
  let elapsedMs = nowMs - sunriseMs;
  if (elapsedMs < 0) elapsedMs += 24 * 3600 * 1000; // before sunrise today → count from yesterday's sunrise

  // Ghati/Pala/Vipala — 60 ghatis in the full ahoratra
  const ghatiDurationMs = ahoratraMs / 60;
  const totalGhati = elapsedMs / ghatiDurationMs;
  const ghati = Math.floor(totalGhati);
  const palaFraction = (totalGhati - ghati) * 60;
  const pala = Math.floor(palaFraction);
  const vipala = Math.floor((palaFraction - pala) * 60);

  // Ishtakala system — all units divide the full ahoratra equally
  // Prahar: 8 per ahoratra (each = 7.5 ghati)
  const praharDurationMs = ahoratraMs / 8;
  const prahar = Math.min(Math.floor(elapsedMs / praharDurationMs) + 1, 8);

  // Muhurta: 30 per ahoratra (each = 2 ghati)
  const muhurtaDurationMs = ahoratraMs / 30;
  const muhurta = Math.min(Math.floor(elapsedMs / muhurtaDurationMs) + 1, 30);

  const isDaytime = nowMs >= sunriseMs && nowMs < sunsetMs;

  return {
    ghati, pala, vipala,
    prahar, muhurta,
    isDaytime,
    praharDurationMin: Math.round(praharDurationMs / 60000),
    muhurtaDurationMin: Math.round(muhurtaDurationMs / 60000),
    sunriseStr: sunriseDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    sunsetStr: sunsetDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
  };
}

export default function VedicTimePage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const locationStore = useLocationStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!locationStore.confirmed && !locationStore.detecting) {
      locationStore.detect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 400);
    return () => clearInterval(interval);
  }, []);

  // Compute timezone offset from IANA name
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

  // Get sunrise/sunset for today and tomorrow's sunrise
  const sunTimes = useMemo(() => {
    const lat = locationStore.lat;
    const lng = locationStore.lng;
    if (lat == null || lng == null) return null;

    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
    const today = getSunTimes(y, m, d, lat, lng, tzOffset);

    // Tomorrow for next sunrise
    const tomorrow = new Date(y, m - 1, d + 1);
    const ty = tomorrow.getFullYear(), tm = tomorrow.getMonth() + 1, td = tomorrow.getDate();
    const tomorrowTimes = getSunTimes(ty, tm, td, lat, lng, tzOffset);

    return {
      sunrise: today.sunrise,
      sunset: today.sunset,
      nextSunrise: tomorrowTimes.sunrise,
    };
  }, [locationStore.lat, locationStore.lng, tzOffset]);

  const vedic = sunTimes
    ? computeVedicTime(time, sunTimes.sunrise, sunTimes.sunset, sunTimes.nextSunrise)
    : null;

  const timeUnits = vedic ? [
    { label: { en: 'Ghati', hi: 'घटी', sa: 'घटी' }, value: vedic.ghati, max: 60, desc: { en: '= 24 min (avg)', hi: '= ~24 मिनट' } },
    { label: { en: 'Pala', hi: 'पल', sa: 'पलम्' }, value: vedic.pala, max: 60, desc: { en: '= 24 sec (avg)', hi: '= ~24 सेकंड' } },
    { label: { en: 'Vipala', hi: 'विपल', sa: 'विपलम्' }, value: vedic.vipala, max: 60, desc: { en: '= 0.4 sec (avg)', hi: '= ~0.4 सेकंड' } },
  ] : [];

  const locationName = locationStore.name || userTimezone;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Vedic Time' : 'वैदिक समय'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'The ancient Indian time system — Ghati, Pala, Vipala'
            : 'प्राचीन भारतीय समय पद्धति — घटी, पल, विपल'}
        </p>
        {locationName && (
          <p className="text-text-secondary/50 text-sm mt-2">{locationName}</p>
        )}
      </motion.div>

      {/* Modern time */}
      <div className="glass-card rounded-2xl p-8 text-center mb-4 border border-gold-primary/20">
        <div className="text-text-secondary text-xs uppercase tracking-[0.3em] mb-2">
          {locale === 'en' ? `Current Time (${userTimezone})` : `वर्तमान समय (${userTimezone})`}
        </div>
        <div className="text-gold-light text-5xl font-bold font-mono tracking-wider">
          {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </div>
        {vedic && (
          <div className="flex justify-center gap-6 mt-3 text-xs text-text-secondary/60">
            <span>{locale === 'en' ? 'Sunrise' : 'सूर्योदय'} {vedic.sunriseStr}</span>
            <span>{locale === 'en' ? 'Sunset' : 'सूर्यास्त'} {vedic.sunsetStr}</span>
          </div>
        )}
      </div>

      {!vedic && (
        <div className="text-center py-8 text-text-secondary/50 text-sm">
          {locale === 'en' ? 'Detecting your location for accurate sunrise/sunset...' : 'सटीक सूर्योदय/सूर्यास्त के लिए स्थान खोज रहे हैं...'}
        </div>
      )}

      {vedic && (
        <>
          <GoldDivider />

          {/* Vedic time display */}
          <div className="glass-card rounded-2xl p-8 my-8 border-2 border-gold-primary/30 bg-gradient-to-br from-gold-primary/5 to-transparent">
            <div className="text-center mb-6">
              <div className="text-gold-dark text-xs uppercase tracking-[0.3em] mb-3">
                {locale === 'en' ? 'Vedic Time (Ishtakala from Sunrise)' : 'वैदिक समय (इष्टकाल — सूर्योदय से)'}
              </div>
              <div className="text-gold-light text-6xl font-bold" style={headingFont}>
                {String(vedic.ghati).padStart(2, '0')}
                <span className="text-gold-primary/50 mx-1">:</span>
                {String(vedic.pala).padStart(2, '0')}
                <span className="text-gold-primary/50 mx-1">:</span>
                {String(vedic.vipala).padStart(2, '0')}
              </div>
              <div className="text-text-secondary text-sm mt-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {locale === 'en' ? 'Ghati : Pala : Vipala' : 'घटी : पल : विपल'}
              </div>
            </div>

            {/* Circular gauges */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              {timeUnits.map((unit, i) => {
                const pct = (unit.value / unit.max) * 100;
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
                          /{unit.max}
                        </text>
                      </svg>
                    </div>
                    <div className="text-gold-light text-sm font-bold mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {unit.label[locale === 'sa' ? 'sa' : locale]}
                    </div>
                    <div className="text-text-secondary/50 text-xs">{locale === 'en' ? unit.desc.en : unit.desc.hi}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Prahar & Muhurta */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="glass-card rounded-xl p-5 text-center border border-gold-primary/10">
              <div className="text-gold-dark text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Prahar' : 'प्रहर'}</div>
              <div className="text-gold-light text-3xl font-bold">{vedic.prahar}<span className="text-text-secondary text-sm">/8</span></div>
              <div className="text-text-secondary text-xs mt-1">
                {locale === 'en'
                  ? `= ${vedic.praharDurationMin} min each`
                  : `= ${vedic.praharDurationMin} मिनट प्रत्येक`}
              </div>
            </div>
            <div className="glass-card rounded-xl p-5 text-center border border-gold-primary/10">
              <div className="text-gold-dark text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Muhurta' : 'मुहूर्त'}</div>
              <div className="text-gold-light text-3xl font-bold">{vedic.muhurta}<span className="text-text-secondary text-sm">/30</span></div>
              <div className="text-text-secondary text-xs mt-1">
                {locale === 'en'
                  ? `= ${vedic.muhurtaDurationMin} min each`
                  : `= ${vedic.muhurtaDurationMin} मिनट प्रत्येक`}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Conversion reference */}
      <div className="glass-card rounded-xl p-6 mt-8 border border-gold-primary/10">
        <h3 className="text-gold-light text-lg font-bold mb-4 text-center" style={headingFont}>
          {locale === 'en' ? 'Vedic Time Units' : 'वैदिक समय इकाइयाँ'}
        </h3>
        <div className="space-y-2 text-sm text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {[
            { en: '1 Truti = 29.6 microseconds', hi: '1 त्रुटि = 29.6 माइक्रोसेकंड' },
            { en: '1 Tatpara = 100 Truti', hi: '1 तत्पर = 100 त्रुटि' },
            { en: '1 Nimesha = 45 Tatpara (blink of an eye)', hi: '1 निमेष = 45 तत्पर (पलक झपकना)' },
            { en: '1 Kashtha = 18 Nimesha', hi: '1 काष्ठ = 18 निमेष' },
            { en: '1 Kala = 30 Kashtha', hi: '1 कला = 30 काष्ठ' },
            { en: '1 Nadika/Ghati = 15 Kala = ~24 minutes', hi: '1 नाड़िका/घटी = 15 कला = ~24 मिनट' },
            { en: '1 Muhurta = 2 Ghati (15 day + 15 night = 30/day)', hi: '1 मुहूर्त = 2 घटी (15 दिन + 15 रात = 30/दिन)' },
            { en: '1 Prahar/Yama = 7.5 Ghati (4 day + 4 night = 8/day)', hi: '1 प्रहर/याम = 7.5 घटी (4 दिन + 4 रात = 8/दिन)' },
            { en: '1 Ahoratra (day) = 60 Ghati = 30 Muhurta = 8 Prahar', hi: '1 अहोरात्र (दिन) = 60 घटी = 30 मुहूर्त = 8 प्रहर' },
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
