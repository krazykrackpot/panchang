'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import type { Locale } from '@/types/panchang';
import type { KundaliData, ChartStyle } from '@/types/kundali';

export default function PrashnaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');
  const [loading, setLoading] = useState(false);
  const [castTime, setCastTime] = useState('');

  const castPrashna = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    setCastTime(now.toLocaleString(locale === 'en' ? 'en-IN' : 'hi-IN'));

    try {
      // Use current time and a default location (Delhi) for Prashna
      const birthData = {
        name: locale === 'en' ? 'Prashna Chart' : 'प्रश्न कुण्डली',
        date: now.toISOString().split('T')[0],
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        place: 'Delhi, India',
        lat: 28.6139,
        lng: 77.2090,
        timezone: '5.5',
        ayanamsha: 'lahiri' as const,
      };

      const res = await fetch('/api/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData),
      });
      const data = await res.json();
      setKundali(data);
    } catch (e) {
      console.error('Prashna generation failed:', e);
    }
    setLoading(false);
  }, [locale]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Prashna Kundali' : 'प्रश्न कुण्डली'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Horary chart cast for this exact moment — no birth data needed. Ask your question and cast the chart.'
            : 'इस क्षण की कुण्डली — जन्म विवरण की आवश्यकता नहीं। अपना प्रश्न पूछें और कुण्डली बनाएं।'}
        </p>
      </motion.div>

      <div className="text-center mb-10">
        <motion.button
          onClick={castPrashna}
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-10 py-4 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-light text-lg font-bold transition-all hover:bg-gold-primary/30 disabled:opacity-50"
          style={headingFont}
        >
          {loading
            ? (locale === 'en' ? 'Casting Chart...' : 'कुण्डली बन रही है...')
            : (locale === 'en' ? 'Cast Prashna Chart Now' : 'अभी प्रश्न कुण्डली बनाएं')}
        </motion.button>
        {castTime && (
          <p className="text-text-secondary text-sm mt-3">
            {locale === 'en' ? 'Cast at' : 'समय'}: {castTime}
          </p>
        )}
      </div>

      <AnimatePresence>
        {kundali && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <GoldDivider />

            {/* Ascendant info */}
            <div className="glass-card rounded-xl p-6 my-8 text-center">
              <div className="flex items-center justify-center gap-3">
                <RashiIconById id={kundali.ascendant.sign} size={36} />
                <span className="text-gold-primary text-xl font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                  {locale === 'en' ? 'Ascendant' : 'लग्न'}: {kundali.ascendant.signName[locale]} ({kundali.ascendant.degree.toFixed(2)}°)
                </span>
              </div>
            </div>

            {/* Chart style toggle */}
            <div className="flex justify-center gap-4 mb-6">
              <button onClick={() => setChartStyle('north')} className={`px-5 py-2 rounded-lg text-sm ${chartStyle === 'north' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary'}`}>
                {locale === 'en' ? 'North Indian' : 'उत्तर भारतीय'}
              </button>
              <button onClick={() => setChartStyle('south')} className={`px-5 py-2 rounded-lg text-sm ${chartStyle === 'south' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary'}`}>
                {locale === 'en' ? 'South Indian' : 'दक्षिण भारतीय'}
              </button>
            </div>

            {/* Chart */}
            <div className="flex justify-center mb-10">
              {chartStyle === 'north' ? (
                <ChartNorth data={kundali.chart} title={locale === 'en' ? 'Prashna Chart' : 'प्रश्न कुण्डली'} size={500} />
              ) : (
                <ChartSouth data={kundali.chart} title={locale === 'en' ? 'Prashna Chart' : 'प्रश्न कुण्डली'} size={500} />
              )}
            </div>

            {/* Planet positions */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-gold-light text-xl font-bold mb-4 text-center" style={headingFont}>
                {locale === 'en' ? 'Current Planetary Positions' : 'वर्तमान ग्रह स्थिति'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {kundali.planets.map(p => (
                  <div key={p.planet.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
                    <GrahaIconById id={p.planet.id} size={32} />
                    <div>
                      <span className="font-bold text-sm" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>
                        {p.planet.name[locale]}
                      </span>
                      <div className="text-text-secondary text-xs">
                        <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{p.signName[locale]}</span>
                        <span className="text-gold-dark/30 mx-1">|</span>
                        <span className="font-mono">{p.degree}</span>
                        <span className="text-gold-dark/30 mx-1">|</span>
                        <span>H{p.house}</span>
                        {p.isRetrograde && <span className="text-red-400 ml-1">(R)</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidance */}
            <div className="glass-card rounded-xl p-6 mt-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
              <h3 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-bold">
                {locale === 'en' ? 'How to Read Prashna' : 'प्रश्न कुण्डली कैसे पढ़ें'}
              </h3>
              <ul className="text-text-secondary text-sm space-y-2 list-disc list-inside" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                <li>{locale === 'en' ? 'The Ascendant represents the querent (person asking).' : 'लग्न प्रश्नकर्ता का प्रतिनिधित्व करता है।'}</li>
                <li>{locale === 'en' ? 'The 7th house represents the matter being asked about.' : 'सप्तम भाव पूछे गए विषय का प्रतिनिधित्व करता है।'}</li>
                <li>{locale === 'en' ? 'The Moon\'s position and aspects are most important.' : 'चन्द्रमा की स्थिति और दृष्टि सबसे महत्त्वपूर्ण है।'}</li>
                <li>{locale === 'en' ? 'Strong benefics in kendras (1,4,7,10) indicate positive outcome.' : 'केन्द्र (1,4,7,10) में बलवान शुभ ग्रह सकारात्मक परिणाम दर्शाते हैं।'}</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
