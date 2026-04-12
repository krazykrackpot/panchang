'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';

export default function HoroscopePage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [horoscopes, setHoroscopes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [date, setDate] = useState('');

  useEffect(() => {
    fetch(`/api/horoscope?locale=${locale}`)
      .then(r => r.json())
      .then(data => {
        setHoroscopes(data.horoscopes || {});
        setDate(data.date || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [locale]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient mb-3" style={headingFont}>
              {isHi ? 'आज का राशिफल' : "Today's Horoscope"}
            </h1>
            <p className="text-text-secondary text-sm">
              {isHi ? 'वास्तविक ग्रह गोचर पर आधारित — सामान्य राशिफल नहीं' : 'Based on actual planetary transits — not generic predictions'}
            </p>
            {date && <p className="text-gold-dark text-xs mt-2">{date}</p>}
          </div>

          {loading ? (
            <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold-primary mx-auto" /></div>
          ) : (
            <>
              {/* Sign grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
                {RASHIS.map((r) => (
                  <motion.button key={r.id} onClick={() => setSelectedSign(selectedSign === r.id ? null : r.id)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 text-center transition-all ${
                      selectedSign === r.id ? 'border-gold-primary/40 bg-gold-primary/10' : 'hover:border-gold-primary/25'
                    }`}>
                    <div className="flex justify-center mb-2"><RashiIconById id={r.id} size={36} /></div>
                    <div className="text-gold-light text-xs font-bold" style={headingFont}>{tl(r.name, locale)}</div>
                  </motion.button>
                ))}
              </div>

              {/* Selected sign forecast */}
              <AnimatePresence mode="wait">
                {selectedSign && horoscopes[selectedSign] && (
                  <motion.div key={selectedSign}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                      <RashiIconById id={selectedSign} size={48} />
                      <div>
                        <h2 className="text-gold-light text-2xl font-bold" style={headingFont}>
                          {tl(RASHIS[selectedSign - 1]?.name, locale)}
                        </h2>
                        <p className="text-text-secondary text-xs">{date}</p>
                      </div>
                    </div>
                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line"
                      style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {horoscopes[selectedSign]}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedSign && (
                <p className="text-text-tertiary text-sm text-center mt-4">
                  {isHi ? 'अपनी चन्द्र राशि चुनें' : 'Select your Moon sign to see your forecast'}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
