'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import type { Locale, Trilingual } from '@/types/panchang';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';

interface MuhuratDate {
  date: string;
  weekday: number;
  tithi: number;
  nakshatra: number;
  yoga: number;
  moonSign: number;
  quality: 'excellent' | 'good' | 'acceptable';
}

interface ActivityOption {
  key: string;
  label: Trilingual;
}

const WEEKDAY_NAMES: Record<string, Trilingual> = {
  '0': { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' },
  '1': { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' },
  '2': { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' },
  '3': { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' },
  '4': { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' },
  '5': { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' },
  '6': { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
};

const MONTH_NAMES_EN = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_HI = ['', 'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'];

const QUALITY_COLORS = {
  excellent: 'border-emerald-500/40 bg-emerald-500/10',
  good: 'border-gold-primary/30 bg-gold-primary/10',
  acceptable: 'border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]',
};

const QUALITY_LABELS: Record<string, Trilingual> = {
  excellent: { en: 'Excellent', hi: 'उत्तम', sa: 'उत्तमम्' },
  good: { en: 'Good', hi: 'शुभ', sa: 'शुभम्' },
  acceptable: { en: 'Acceptable', hi: 'स्वीकार्य', sa: 'स्वीकार्यम्' },
};

const QUALITY_BADGE = {
  excellent: 'bg-emerald-500/20 text-emerald-400',
  good: 'bg-gold-primary/20 text-gold-light',
  acceptable: 'bg-gray-500/20 text-text-secondary',
};

export default function MuhuratPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [activity, setActivity] = useState('marriage');
  const [dates, setDates] = useState<MuhuratDate[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/muhurat?year=${year}&month=${month}&activity=${activity}`)
      .then(r => r.json())
      .then(data => {
        setDates(data.dates || []);
        if (data.activities) setActivities(data.activities);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, month, activity]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(locale === 'en' || String(locale) === 'ta' ? 'en-IN' : 'hi-IN', { day: 'numeric', weekday: 'short' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">
            {locale === 'en' || String(locale) === 'ta' ? 'Muhurat Finder' : 'मुहूर्त खोजक'}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Find the most auspicious dates for important life events'
            : 'महत्त्वपूर्ण जीवन-घटनाओं के लिए सबसे शुभ तिथि खोजें'}
        </p>
      </motion.div>

      {/* Activity selection */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {activities.map(a => (
          <button
            key={a.key}
            onClick={() => setActivity(a.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activity === a.key
                ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
            }`}
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            {a.label[locale]}
          </button>
        ))}
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-center gap-6 mb-10">
        <button onClick={prevMonth} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-2xl font-bold text-gold-gradient min-w-[200px] text-center" style={headingFont}>
          {locale === 'en' || String(locale) === 'ta' ? MONTH_NAMES_EN[month] : MONTH_NAMES_HI[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      <GoldDivider />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : dates.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <p className="text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {locale === 'en' || String(locale) === 'ta' ? 'No auspicious dates found for this month.' : 'इस माह कोई शुभ तिथि नहीं मिली।'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 my-10">
          <AnimatePresence mode="wait">
            {dates.map((d, i) => {
              const nak = NAKSHATRAS[d.nakshatra - 1];
              const rashi = RASHIS[d.moonSign - 1];
              const dateObj = new Date(d.date + 'T00:00:00');
              const dayNum = dateObj.getDate();

              return (
                <motion.div
                  key={d.date}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.5) }}
                  className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border ${QUALITY_COLORS[d.quality]}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Big date number */}
                    <div className="w-16 h-16 rounded-xl bg-bg-primary/60 flex flex-col items-center justify-center flex-shrink-0 border border-gold-primary/10">
                      <span className="text-gold-light text-2xl font-bold leading-none">{dayNum}</span>
                      <span className="text-text-secondary text-xs mt-0.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {WEEKDAY_NAMES[String(d.weekday)][locale]}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${QUALITY_BADGE[d.quality]}`}>
                          {QUALITY_LABELS[d.quality][locale]}
                        </span>
                      </div>
                      <div className="text-text-secondary text-sm flex flex-wrap gap-x-4 gap-y-0.5">
                        <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          <span className="text-gold-dark">{locale === 'en' || String(locale) === 'ta' ? 'Nak:' : 'नक्ष:'}</span> {nak?.name[locale]}
                        </span>
                        <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          <span className="text-gold-dark">{locale === 'en' || String(locale) === 'ta' ? 'Moon:' : 'चन्द्र:'}</span> {rashi?.name[locale]}
                        </span>
                        <span>
                          <span className="text-gold-dark">{locale === 'en' || String(locale) === 'ta' ? 'Tithi:' : 'तिथि:'}</span> {d.tithi}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <div className="text-center text-text-secondary text-sm mt-6">
            {dates.length} {locale === 'en' || String(locale) === 'ta' ? 'auspicious dates found' : 'शुभ तिथियाँ मिलीं'}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {(['excellent', 'good', 'acceptable'] as const).map(q => (
              <div key={q} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${q === 'excellent' ? 'bg-emerald-500' : q === 'good' ? 'bg-gold-primary' : 'bg-gray-500'}`} />
                <span className="text-text-secondary text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {QUALITY_LABELS[q][locale]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
