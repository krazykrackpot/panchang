'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { dateToJD, toSidereal, getRashiNumber, getPlanetaryPositions } from '@/lib/ephem/astronomical';

interface SadeSatiCycle {
  startYear: number;
  peakYear: number;
  endYear: number;
  phase: 'rising' | 'peak' | 'setting';
  active: boolean;
}

function computeSadeSatiTimeline(moonRashi: number): SadeSatiCycle[] {
  const cycles: SadeSatiCycle[] = [];

  // Scan from 1950 to 2060 to find all Sade Sati cycles
  // Saturn takes ~29.5 years to orbit, so it visits each sign ~every 29.5 years
  // Sade Sati: Saturn in 12th, 1st, or 2nd from Moon sign

  let inSadeSati = false;
  let currentCycleStart = 0;

  for (let year = 1950; year <= 2060; year++) {
    const jd = dateToJD(year, 6, 15, 6); // mid-year
    const positions = getPlanetaryPositions(jd);
    const saturnTrop = positions[6].longitude; // Saturn = id 6
    const saturnSid = toSidereal(saturnTrop, jd);
    const saturnSign = getRashiNumber(saturnSid);

    // Check if Saturn is in 12th, 1st, or 2nd from Moon
    const dist = ((saturnSign - moonRashi + 12) % 12);
    const inRange = dist === 11 || dist === 0 || dist === 1; // 12th, 1st, 2nd

    if (inRange && !inSadeSati) {
      currentCycleStart = year;
      inSadeSati = true;
    } else if (!inRange && inSadeSati) {
      const startYear = currentCycleStart;
      const endYear = year - 1;
      const peakYear = Math.round((startYear + endYear) / 2);

      cycles.push({
        startYear,
        peakYear,
        endYear,
        phase: 'peak',
        active: false,
      });
      inSadeSati = false;
    }
  }

  // Check current year
  const currentYear = new Date().getFullYear();
  for (const cycle of cycles) {
    if (currentYear >= cycle.startYear && currentYear <= cycle.endYear) {
      cycle.active = true;
      if (currentYear <= cycle.startYear + 1) cycle.phase = 'rising';
      else if (currentYear >= cycle.endYear - 1) cycle.phase = 'setting';
      else cycle.phase = 'peak';
    }
  }

  return cycles;
}

export default function SadeSatiPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [moonRashi, setMoonRashi] = useState(0);

  const cycles = useMemo(() => {
    if (!moonRashi) return [];
    return computeSadeSatiTimeline(moonRashi);
  }, [moonRashi]);

  const activeCycle = cycles.find(c => c.active);

  const phaseNames = {
    rising: { en: 'Rising Phase (12th from Moon)', hi: 'आरम्भ चरण (चन्द्र से 12वाँ)', sa: 'उत्थानचरणः (चन्द्रात् द्वादशः)' },
    peak: { en: 'Peak Phase (Over Moon Sign)', hi: 'चरम चरण (चन्द्र राशि पर)', sa: 'चरमचरणः (चन्द्रराशौ)' },
    setting: { en: 'Setting Phase (2nd from Moon)', hi: 'अवसान चरण (चन्द्र से 2रा)', sa: 'अवसानचरणः (चन्द्रात् द्वितीयः)' },
  };

  const remedies = [
    { en: 'Recite Hanuman Chalisa daily', hi: 'प्रतिदिन हनुमान चालीसा पढ़ें', sa: 'प्रतिदिनं हनुमच्चालीसां पठेत्' },
    { en: 'Wear blue sapphire (Neelam) after consultation', hi: 'परामर्श के बाद नीलम धारण करें', sa: 'परामर्शानन्तरं नीलमणिं धारयेत्' },
    { en: 'Donate black items on Saturday', hi: 'शनिवार को काली वस्तुएं दान करें', sa: 'शनिवासरे कृष्णवस्तूनि दानं कुर्यात्' },
    { en: 'Light mustard oil lamp under Peepal tree on Saturdays', hi: 'शनिवार को पीपल के पेड़ के नीचे सरसों के तेल का दीपक जलाएं', sa: 'शनिवासरे पिप्पलवृक्षस्य अधस्तात् सर्षपतैलदीपं प्रज्वालयेत्' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="flex justify-center mb-6"><GrahaIconById id={6} size={80} /></div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Sade Sati Calculator' : 'साढ़े साती गणक'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? "Saturn's 7.5-year transit over your Moon sign — the most significant transit in Vedic astrology"
            : 'शनि का आपकी चन्द्र राशि पर 7.5 वर्ष का गोचर — वैदिक ज्योतिष का सबसे महत्वपूर्ण गोचर'}
        </p>
      </motion.div>

      {/* Moon Sign Selection */}
      <div className="max-w-md mx-auto mb-12">
        <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center">
          {locale === 'en' ? 'Select Your Moon Sign (Janma Rashi)' : 'अपनी जन्म राशि (चन्द्र राशि) चुनें'}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {RASHIS.map((r) => (
            <button
              key={r.id}
              onClick={() => setMoonRashi(r.id)}
              className={`rounded-xl p-3 text-center border transition-all ${
                moonRashi === r.id
                  ? 'bg-gold-primary/20 border-gold-primary/40'
                  : 'bg-bg-tertiary/30 border-gold-primary/10 hover:border-gold-primary/30'
              }`}
            >
              <div className="flex justify-center mb-1"><RashiIconById id={r.id} size={28} /></div>
              <div className="text-gold-light text-[10px] font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {r.name[locale]}
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {moonRashi > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GoldDivider />

            {/* Current Status */}
            {activeCycle ? (
              <div className="my-10 glass-card rounded-2xl p-8 border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent text-center">
                <div className="text-red-400 text-xs uppercase tracking-[0.3em] font-bold mb-2">
                  {locale === 'en' ? 'SADE SATI ACTIVE' : 'साढ़े साती सक्रिय'}
                </div>
                <div className="text-red-300 text-2xl font-bold mb-3" style={headingFont}>
                  {activeCycle.startYear} — {activeCycle.endYear}
                </div>
                <div className="text-text-secondary text-sm">{phaseNames[activeCycle.phase][locale]}</div>
              </div>
            ) : (
              <div className="my-10 glass-card rounded-2xl p-8 border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent text-center">
                <div className="text-emerald-400 text-xs uppercase tracking-[0.3em] font-bold mb-2">
                  {locale === 'en' ? 'NO SADE SATI' : 'साढ़े साती नहीं'}
                </div>
                <div className="text-emerald-300 text-lg font-bold" style={headingFont}>
                  {locale === 'en' ? 'Saturn is not transiting over your Moon sign currently.' : 'शनि वर्तमान में आपकी चन्द्र राशि पर गोचर नहीं कर रहा।'}
                </div>
              </div>
            )}

            {/* Timeline */}
            <h2 className="text-3xl font-bold text-gold-gradient mb-8 text-center" style={headingFont}>
              {locale === 'en' ? 'Full Sade Sati Timeline' : 'सम्पूर्ण साढ़े साती समयरेखा'}
            </h2>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gold-primary/20" />

              <div className="space-y-4 ml-14">
                {cycles.map((cycle, i) => (
                  <motion.div
                    key={cycle.startYear}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-card rounded-xl p-5 border relative ${
                      cycle.active ? 'border-red-500/30 bg-red-500/5' : 'border-gold-primary/10'
                    }`}
                  >
                    {/* Dot on timeline */}
                    <div className={`absolute -left-[2.4rem] top-6 w-3 h-3 rounded-full ${
                      cycle.active ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gold-primary/40'
                    }`} />

                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-mono text-lg font-bold ${cycle.active ? 'text-red-300' : 'text-gold-light'}`}>
                          {cycle.startYear} — {cycle.endYear}
                        </span>
                        {cycle.active && (
                          <span className="ml-3 text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full font-bold animate-pulse">
                            {locale === 'en' ? 'CURRENT' : 'वर्तमान'}
                          </span>
                        )}
                      </div>
                      <span className="text-text-secondary text-xs">~7.5 {locale === 'en' ? 'years' : 'वर्ष'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Remedies */}
            <GoldDivider />
            <div className="my-10">
              <h2 className="text-3xl font-bold text-gold-gradient mb-6 text-center" style={headingFont}>
                {locale === 'en' ? 'Remedies' : 'उपाय'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {remedies.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="glass-card rounded-xl p-4 border border-gold-primary/10"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-gold-primary text-lg font-bold">{i + 1}</span>
                      <span className="text-text-primary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {r[locale]}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
