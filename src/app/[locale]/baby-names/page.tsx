'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_SYLLABLES, SAMPLE_NAMES } from '@/lib/constants/nakshatra-syllables';
import type { Locale } from '@/types/panchang';

export default function BabyNamesPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [selectedNak, setSelectedNak] = useState(0);
  const [selectedPada, setSelectedPada] = useState(0); // 0 = all padas
  const [nameFilter, setNameFilter] = useState('');

  const syllables = useMemo(() => {
    if (!selectedNak) return [];
    const data = NAKSHATRA_SYLLABLES[selectedNak];
    if (!data) return [];
    if (selectedPada > 0 && selectedPada <= 4) {
      return [data[selectedPada - 1]];
    }
    return data;
  }, [selectedNak, selectedPada]);

  const suggestedNames = useMemo(() => {
    const names: string[] = [];
    for (const syl of syllables) {
      const key = syl.en;
      if (SAMPLE_NAMES[key]) {
        names.push(...SAMPLE_NAMES[key]);
      }
    }
    return [...new Set(names)];
  }, [syllables]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Baby Name Suggester' : 'शिशु नाम सुझावक'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Find auspicious name syllables based on your birth Nakshatra & Pada'
            : 'जन्म नक्षत्र और पद के अनुसार शुभ नाम अक्षर खोजें'}
        </p>
      </motion.div>

      {/* Nakshatra selector */}
      <div className="mb-6">
        <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center">
          {locale === 'en' ? 'Select Birth Nakshatra' : 'जन्म नक्षत्र चुनें'}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {NAKSHATRAS.map(n => (
            <button key={n.id} onClick={() => { setSelectedNak(n.id); setSelectedPada(0); }}
              className={`rounded-xl p-2 text-center transition-all ${
                selectedNak === n.id ? 'bg-gold-primary/20 border-gold-primary/40 border' : 'bg-bg-tertiary/30 border border-gold-primary/10 hover:border-gold-primary/25'
              }`}>
              <div className="flex justify-center"><NakshatraIconById id={n.id} size={24} /></div>
              <div className="text-[9px] mt-1 text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {n.name[locale]}
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedNak > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Pada selector */}
            <div className="flex justify-center gap-3 mb-8">
              <button onClick={() => setSelectedPada(0)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPada === 0 ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10'}`}>
                {locale === 'en' ? 'All Padas' : 'सभी पद'}
              </button>
              {[1, 2, 3, 4].map(p => (
                <button key={p} onClick={() => setSelectedPada(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPada === p ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10'}`}>
                  {locale === 'en' ? `Pada ${p}` : `पद ${p}`}
                </button>
              ))}
            </div>

            <GoldDivider />

            {/* Syllables */}
            <div className="my-8">
              <h3 className="text-gold-light text-xl font-bold mb-4 text-center" style={headingFont}>
                {locale === 'en' ? 'Starting Syllables' : 'प्रारम्भिक अक्षर'}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {syllables.map((syl, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-2xl p-6 border-2 border-gold-primary/30 min-w-[100px] text-center"
                  >
                    <div className="text-4xl font-bold text-gold-light mb-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                      {locale === 'en' ? syl.en : syl.hi}
                    </div>
                    <div className="text-text-secondary text-xs">
                      {locale === 'en' ? syl.hi : syl.en}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Name suggestions */}
            {suggestedNames.length > 0 && (
              <div className="my-8">
                <h3 className="text-gold-light text-xl font-bold mb-4 text-center" style={headingFont}>
                  {locale === 'en' ? 'Name Suggestions' : 'नाम सुझाव'}
                </h3>
                <div className="max-w-md mx-auto mb-4">
                  <input
                    type="text"
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)}
                    placeholder={locale === 'en' ? 'Filter names...' : 'नाम खोजें...'}
                    className="w-full px-4 py-2 rounded-xl bg-bg-secondary/50 border border-gold-primary/15 text-text-primary text-sm focus:outline-none focus:border-gold-primary/40 placeholder:text-text-tertiary"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedNames.filter(n => !nameFilter || n.toLowerCase().includes(nameFilter.toLowerCase())).map((name, i) => (
                    <motion.span key={name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.5) }}
                      className="px-4 py-2 rounded-xl bg-bg-tertiary/30 border border-gold-primary/10 text-gold-light text-sm font-medium"
                    >
                      {name}
                    </motion.span>
                  ))}
                </div>
                <p className="text-text-secondary/50 text-xs text-center mt-4">
                  {locale === 'en' ? 'These are traditional suggestions. The first syllable is most important.' : 'ये परम्परागत सुझाव हैं। प्रथम अक्षर सबसे महत्त्वपूर्ण है।'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
