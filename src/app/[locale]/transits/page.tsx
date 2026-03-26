'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { Locale, Trilingual } from '@/types/panchang';

interface TransitEvent {
  planetId: number;
  planetName: Trilingual;
  planetColor: string;
  fromSign: number;
  fromSignName: Trilingual;
  toSign: number;
  toSignName: Trilingual;
  date: string;
  significance: 'major' | 'moderate' | 'minor';
}

export default function TransitsPage() {
  const t = useTranslations('transits');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<TransitEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'major'>('all');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/transits?year=${year}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year]);

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.significance === 'major');

  const sigColors = {
    major: 'border-gold-primary/30 bg-gold-primary/5',
    moderate: 'border-amber-500/20 bg-amber-500/5',
    minor: 'border-gold-primary/5',
  };

  const sigBadge = {
    major: 'text-gold-light bg-gold-primary/20',
    moderate: 'text-amber-400 bg-amber-500/10',
    minor: 'text-text-secondary bg-bg-tertiary/50',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
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

      {/* Filter */}
      <div className="flex justify-center gap-3 mb-10">
        {(['all', 'major'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === f ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
            }`}>
            {f === 'all' ? (locale === 'en' ? 'All Transits' : 'सभी गोचर') : (locale === 'en' ? 'Major Only' : 'केवल प्रमुख')}
          </button>
        ))}
      </div>

      <GoldDivider />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3 my-10">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              {locale === 'en' ? 'No transit events found.' : 'कोई गोचर घटना नहीं मिली।'}
            </div>
          ) : filteredEvents.map((e, i) => {
            const dateObj = new Date(e.date + 'T00:00:00');
            const dateStr = dateObj.toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'short' });

            return (
              <motion.div
                key={`${e.date}-${e.planetId}`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.8) }}
                className={`glass-card rounded-xl p-4 flex items-center gap-4 border ${sigColors[e.significance]}`}
              >
                <div className="flex-shrink-0">
                  <GrahaIconById id={e.planetId} size={40} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {e.planetName[locale]}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${sigBadge[e.significance]}`}>
                      {e.significance.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <RashiIconById id={e.fromSign} size={16} />
                    <span className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {e.fromSignName[locale]}
                    </span>
                    <span className="text-gold-dark">→</span>
                    <RashiIconById id={e.toSign} size={16} />
                    <span className="text-text-primary font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {e.toSignName[locale]}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="font-mono text-sm text-gold-light">{dateStr}</div>
                </div>
              </motion.div>
            );
          })}
          <div className="text-center text-text-secondary text-sm mt-6">
            {filteredEvents.length} {locale === 'en' ? 'transit events' : 'गोचर घटनाएँ'}
          </div>
        </div>
      )}
    </div>
  );
}
