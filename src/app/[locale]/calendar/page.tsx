'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { MasaIcon } from '@/components/icons/PanchangIcons';
import type { Locale, Trilingual } from '@/types/panchang';

interface FestivalEntry {
  name: Trilingual;
  date: string;
  tithi?: string;
  type: 'major' | 'vrat' | 'regional';
  category: string;
  description: Trilingual;
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_NAMES_HI = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'];

type Filter = 'all' | 'major' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham';

export default function CalendarPage() {
  const t = useTranslations('calendar');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [year, setYear] = useState(new Date().getFullYear());
  const [festivals, setFestivals] = useState<FestivalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/calendar?year=${year}`)
      .then(res => res.json())
      .then(data => {
        setFestivals(data.festivals || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year]);

  const filteredFestivals = festivals.filter(f => {
    if (filter !== 'all') {
      if (filter === 'major' && f.type !== 'major') return false;
      if (filter !== 'major' && f.category !== filter) return false;
    }
    if (selectedMonth !== null) {
      const m = parseInt(f.date.split('-')[1]);
      if (m !== selectedMonth + 1) return false;
    }
    return true;
  });

  const categoryColors: Record<string, string> = {
    festival: 'text-gold-light bg-gold-primary/10 border-gold-primary/20',
    ekadashi: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purnima: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    amavasya: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    chaturthi: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    pradosham: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    sankranti: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const filterButtons: { key: Filter; label: string; labelHi: string }[] = [
    { key: 'all', label: 'All', labelHi: 'सभी' },
    { key: 'major', label: 'Major Festivals', labelHi: 'प्रमुख त्योहार' },
    { key: 'ekadashi', label: 'Ekadashi', labelHi: 'एकादशी' },
    { key: 'purnima', label: 'Purnima', labelHi: 'पूर्णिमा' },
    { key: 'amavasya', label: 'Amavasya', labelHi: 'अमावस्या' },
    { key: 'chaturthi', label: 'Chaturthi', labelHi: 'चतुर्थी' },
    { key: 'pradosham', label: 'Pradosham', labelHi: 'प्रदोष' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="flex justify-center mb-6"><MasaIcon size={80} /></div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
      </motion.div>

      {/* Year selector */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-4xl font-bold text-gold-gradient" style={headingFont}>{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* Month tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => setSelectedMonth(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedMonth === null ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
          }`}
        >
          {locale === 'en' ? 'All Months' : 'सभी महीने'}
        </button>
        {MONTH_NAMES.map((name, i) => (
          <button
            key={i}
            onClick={() => setSelectedMonth(selectedMonth === i ? null : i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMonth === i ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
            }`}
          >
            {locale === 'en' ? name.slice(0, 3) : MONTH_NAMES_HI[i].slice(0, 4)}
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {filterButtons.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === f.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
            }`}
          >
            {locale === 'en' ? f.label : f.labelHi}
          </button>
        ))}
      </div>

      <GoldDivider />

      {/* Festival list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3 my-10">
          {filteredFestivals.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              {locale === 'en' ? 'No festivals found for this filter.' : 'इस फ़िल्टर के लिए कोई त्योहार नहीं मिला।'}
            </div>
          ) : filteredFestivals.map((f, i) => {
            const dateObj = new Date(f.date + 'T00:00:00');
            const dayStr = dateObj.getDate();
            const monthStr = locale === 'en' ? MONTH_NAMES[dateObj.getMonth()]?.slice(0, 3) : MONTH_NAMES_HI[dateObj.getMonth()]?.slice(0, 4);

            return (
              <motion.div
                key={`${f.date}-${f.name.en}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className={`glass-card rounded-xl p-4 flex items-center gap-4 border ${
                  f.type === 'major' ? 'border-gold-primary/20' : 'border-gold-primary/5'
                }`}
              >
                {/* Date badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-bg-tertiary/50 flex flex-col items-center justify-center">
                  <span className="text-gold-light text-xl font-bold leading-none">{dayStr}</span>
                  <span className="text-text-secondary text-[10px] uppercase">{monthStr}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-lg font-bold ${f.type === 'major' ? 'text-gold-light' : 'text-text-primary'}`}
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {f.name[locale]}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${categoryColors[f.category] || 'text-text-secondary bg-bg-tertiary/50 border-gold-primary/10'}`}>
                      {f.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-text-secondary text-xs mt-1 line-clamp-1"
                    style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {f.description[locale]}
                  </div>
                </div>

                {/* Tithi */}
                {f.tithi && (
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <div className="text-text-secondary text-[10px] uppercase tracking-wider">{locale === 'en' ? 'Tithi' : 'तिथि'}</div>
                    <div className="text-gold-dark text-xs font-mono">{f.tithi}</div>
                  </div>
                )}
              </motion.div>
            );
          })}
          <div className="text-center text-text-secondary text-sm mt-6">
            {filteredFestivals.length} {locale === 'en' ? 'entries' : 'प्रविष्टियाँ'}
          </div>
        </div>
      )}
    </div>
  );
}
