'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import type { Locale } from '@/types/panchang';

function toVedicTime(date: Date) {
  // 1 day = 60 ghati = 3600 pala = 216000 vipala
  // 1 ghati = 24 minutes, 1 pala = 24 seconds, 1 vipala = 0.4 seconds
  // Vedic day starts at sunrise (approximately 6:00 AM IST)
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Minutes since midnight
  const totalMinutes = hours * 60 + minutes + seconds / 60;

  // Adjust for sunrise (~6:00 AM IST)
  const sunriseMinutes = 6 * 60; // 360 minutes
  let dayMinutes = totalMinutes - sunriseMinutes;
  if (dayMinutes < 0) dayMinutes += 24 * 60;

  // Convert to ghati
  const totalGhati = dayMinutes / 24;
  const ghati = Math.floor(totalGhati);
  const palaFraction = (totalGhati - ghati) * 60;
  const pala = Math.floor(palaFraction);
  const vipala = Math.floor((palaFraction - pala) * 60);

  // Prahar (8 prahars per day, each = 3 hours)
  const prahar = Math.floor(hours / 3) + 1;

  // Muhurta (30 per day, each = 48 minutes)
  const muhurta = Math.floor(totalMinutes / 48) + 1;

  return { ghati, pala, vipala, prahar: Math.min(prahar, 8), muhurta: Math.min(muhurta, 30) };
}

export default function VedicTimePage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 400);
    return () => clearInterval(interval);
  }, []);

  const vedic = toVedicTime(time);

  const timeUnits = [
    { label: { en: 'Ghati', hi: 'घटी', sa: 'घटी' }, value: vedic.ghati, max: 60, desc: { en: '= 24 minutes', hi: '= 24 मिनट' } },
    { label: { en: 'Pala', hi: 'पल', sa: 'पलम्' }, value: vedic.pala, max: 60, desc: { en: '= 24 seconds', hi: '= 24 सेकंड' } },
    { label: { en: 'Vipala', hi: 'विपल', sa: 'विपलम्' }, value: vedic.vipala, max: 60, desc: { en: '= 0.4 seconds', hi: '= 0.4 सेकंड' } },
  ];

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
      </motion.div>

      {/* Modern time */}
      <div className="glass-card rounded-2xl p-8 text-center mb-8 border border-gold-primary/20">
        <div className="text-text-secondary text-xs uppercase tracking-[0.3em] mb-2">
          {locale === 'en' ? 'Current Time (IST)' : 'वर्तमान समय (IST)'}
        </div>
        <div className="text-gold-light text-5xl font-bold font-mono tracking-wider">
          {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </div>
      </div>

      <GoldDivider />

      {/* Vedic time display */}
      <div className="glass-card rounded-2xl p-8 my-8 border-2 border-gold-primary/30 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <div className="text-center mb-6">
          <div className="text-gold-dark text-xs uppercase tracking-[0.3em] mb-3">
            {locale === 'en' ? 'Vedic Time (from Sunrise)' : 'वैदिक समय (सूर्योदय से)'}
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
          <div className="text-text-secondary text-xs mt-1">{locale === 'en' ? '= 3 hours each' : '= प्रत्येक 3 घण्टे'}</div>
        </div>
        <div className="glass-card rounded-xl p-5 text-center border border-gold-primary/10">
          <div className="text-gold-dark text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Muhurta' : 'मुहूर्त'}</div>
          <div className="text-gold-light text-3xl font-bold">{vedic.muhurta}<span className="text-text-secondary text-sm">/30</span></div>
          <div className="text-text-secondary text-xs mt-1">{locale === 'en' ? '= 48 minutes each' : '= प्रत्येक 48 मिनट'}</div>
        </div>
      </div>

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
            { en: '1 Nadika/Ghati = 15 Kala = 24 minutes', hi: '1 नाड़िका/घटी = 15 कला = 24 मिनट' },
            { en: '1 Muhurta = 2 Ghati = 48 minutes', hi: '1 मुहूर्त = 2 घटी = 48 मिनट' },
            { en: '1 Prahar/Yama = 7.5 Ghati = 3 hours', hi: '1 प्रहर/याम = 7.5 घटी = 3 घण्टे' },
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
