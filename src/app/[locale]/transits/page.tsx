'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
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

const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्तूबर', 'नवम्बर', 'दिसम्बर'];

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_NAMES_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'राहु', 'केतु'];

export default function TransitsPage() {
  const t = useTranslations('transits');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<TransitEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sigFilter, setSigFilter] = useState<'all' | 'major' | 'moderate'>('all');
  const [planetFilter, setPlanetFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  // Filtered events
  const filteredEvents = useMemo(() => {
    let result = events;
    if (sigFilter === 'major') result = result.filter(e => e.significance === 'major');
    else if (sigFilter === 'moderate') result = result.filter(e => e.significance !== 'minor');
    if (planetFilter !== null) result = result.filter(e => e.planetId === planetFilter);
    return result;
  }, [events, sigFilter, planetFilter]);

  // Group by month
  const eventsByMonth = useMemo(() => {
    const grouped: Record<number, TransitEvent[]> = {};
    for (const e of filteredEvents) {
      const month = parseInt(e.date.split('-')[1]) - 1; // 0-indexed
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(e);
    }
    return grouped;
  }, [filteredEvents]);

  // Current transits summary — find the most recent transit for each slow planet (Mars-Ketu)
  const currentTransits = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const slowPlanets = [2, 3, 4, 5, 6, 7, 8]; // Mars through Ketu
    return slowPlanets.map(pid => {
      const planetEvents = events.filter(e => e.planetId === pid && e.date <= today);
      const latest = planetEvents[planetEvents.length - 1];
      if (!latest) {
        // Planet hasn't changed sign this year — find from ALL events
        const allForPlanet = events.filter(e => e.planetId === pid);
        if (allForPlanet.length > 0) {
          return { planetId: pid, sign: allForPlanet[0].fromSign, signName: allForPlanet[0].fromSignName, planetName: allForPlanet[0].planetName };
        }
        return null;
      }
      return { planetId: pid, sign: latest.toSign, signName: latest.toSignName, planetName: latest.planetName };
    }).filter(Boolean) as { planetId: number; sign: number; signName: Trilingual; planetName: Trilingual }[];
  }, [events]);

  // Stats
  const stats = useMemo(() => {
    const majorCount = events.filter(e => e.significance === 'major').length;
    const uniquePlanets = new Set(events.map(e => e.planetId)).size;
    return { total: events.length, major: majorCount, planets: uniquePlanets };
  }, [events]);

  const sigColors: Record<string, string> = {
    major: 'border-gold-primary/30 bg-gold-primary/5',
    moderate: 'border-amber-500/20 bg-amber-500/5',
    minor: 'border-gold-primary/5 bg-bg-primary/20',
  };

  const sigBadge: Record<string, string> = {
    major: 'text-gold-light bg-gold-primary/20',
    moderate: 'text-amber-400 bg-amber-500/10',
    minor: 'text-text-tertiary bg-bg-tertiary/30',
  };

  const sigLabel: Record<string, { en: string; hi: string }> = {
    major: { en: 'MAJOR', hi: 'प्रमुख' },
    moderate: { en: 'MODERATE', hi: 'मध्यम' },
    minor: { en: 'MINOR', hi: 'गौण' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>{t('subtitle')}</p>
      </motion.div>

      {/* Year selector */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-8">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all" aria-label="Previous year">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-4xl font-bold text-gold-gradient" style={headingFont}>{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all" aria-label="Next year">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* Current transits summary */}
      {year === new Date().getFullYear() && currentTransits.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-4 md:p-6 mb-8">
          <h2 className="text-lg text-gold-gradient font-bold mb-4 text-center" style={headingFont}>
            {locale === 'en' ? 'Current Planetary Positions' : 'वर्तमान ग्रह स्थिति'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {currentTransits.map(ct => (
              <div key={ct.planetId} className="flex flex-col items-center p-3 bg-bg-primary/30 rounded-xl border border-gold-primary/10">
                <GrahaIconById id={ct.planetId} size={32} />
                <span className="text-gold-light text-xs font-semibold mt-1.5" style={headingFont}>{ct.planetName[locale]}</span>
                <div className="flex items-center gap-1 mt-1">
                  <RashiIconById id={ct.sign} size={14} />
                  <span className="text-text-secondary text-xs" style={bodyFont}>{ct.signName[locale]}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats bar */}
      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-6 text-sm">
          <span className="text-text-secondary">
            <span className="text-gold-light font-bold">{stats.total}</span> {locale === 'en' ? 'transits' : 'गोचर'}
          </span>
          <span className="text-text-tertiary">|</span>
          <span className="text-text-secondary">
            <span className="text-gold-light font-bold">{stats.major}</span> {locale === 'en' ? 'major' : 'प्रमुख'}
          </span>
          <span className="text-text-tertiary">|</span>
          <span className="text-text-secondary">
            <span className="text-gold-light font-bold">{stats.planets}</span> {locale === 'en' ? 'planets' : 'ग्रह'}
          </span>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        {/* Significance filter */}
        <div className="flex gap-2">
          {(['all', 'major', 'moderate'] as const).map(f => (
            <button key={f} onClick={() => setSigFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                sigFilter === f ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
              }`}>
              {f === 'all' ? (locale === 'en' ? 'All' : 'सभी') : f === 'major' ? (locale === 'en' ? 'Major' : 'प्रमुख') : (locale === 'en' ? 'Major + Moderate' : 'प्रमुख + मध्यम')}
            </button>
          ))}
        </div>

        {/* Planet filter toggle */}
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${showFilters || planetFilter !== null ? 'bg-gold-primary/20 text-gold-light border-gold-primary/40' : 'text-text-secondary border-gold-primary/10 hover:bg-gold-primary/10'}`}>
          <Filter className="w-3.5 h-3.5" />
          {locale === 'en' ? 'Planet' : 'ग्रह'}
          {planetFilter !== null && `: ${(locale === 'en' ? PLANET_NAMES_EN : PLANET_NAMES_HI)[planetFilter]}`}
        </button>
      </div>

      {/* Planet filter chips */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap justify-center gap-2 mb-8 overflow-hidden">
            <button onClick={() => setPlanetFilter(null)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all ${planetFilter === null ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/5'}`}>
              {locale === 'en' ? 'All Planets' : 'सभी ग्रह'}
            </button>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(pid => {
              const hasEvents = events.some(e => e.planetId === pid);
              if (!hasEvents) return null;
              return (
                <button key={pid} onClick={() => setPlanetFilter(planetFilter === pid ? null : pid)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all ${planetFilter === pid ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/5'}`}>
                  <GrahaIconById id={pid} size={14} />
                  {(locale === 'en' ? PLANET_NAMES_EN : PLANET_NAMES_HI)[pid]}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <GoldDivider />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 text-text-secondary" style={bodyFont}>
          {locale === 'en' ? 'No transit events match your filters.' : 'आपके फ़िल्टर से कोई गोचर घटना मेल नहीं खाती।'}
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {Array.from({ length: 12 }, (_, monthIdx) => {
            const monthEvents = eventsByMonth[monthIdx];
            if (!monthEvents || monthEvents.length === 0) return null;
            const monthName = (locale === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_HI)[monthIdx];
            const isCurrentMonth = year === new Date().getFullYear() && monthIdx === new Date().getMonth();

            return (
              <motion.div key={monthIdx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3 }}>
                {/* Month header */}
                <div className={`flex items-center gap-3 mb-4 ${isCurrentMonth ? '' : ''}`}>
                  <h3 className={`text-xl font-bold ${isCurrentMonth ? 'text-gold-gradient' : 'text-text-primary'}`} style={headingFont}>
                    {monthName}
                  </h3>
                  <span className="text-text-tertiary text-xs">{monthEvents.length} {locale === 'en' ? 'events' : 'घटनाएँ'}</span>
                  {isCurrentMonth && (
                    <span className="px-2 py-0.5 bg-gold-primary/20 text-gold-light text-xs rounded-full font-bold">
                      {locale === 'en' ? 'NOW' : 'अभी'}
                    </span>
                  )}
                  <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
                </div>

                {/* Events */}
                <div className="space-y-2">
                  {monthEvents.map((e, i) => {
                    const dateObj = new Date(e.date + 'T00:00:00');
                    const dayNum = dateObj.getDate();
                    const dayName = dateObj.toLocaleDateString(locale === 'en' ? 'en-US' : 'hi-IN', { weekday: 'short' });
                    const isPast = new Date(e.date) < new Date(new Date().toISOString().split('T')[0]);

                    return (
                      <div
                        key={`${e.date}-${e.planetId}`}
                        className={`flex items-center gap-3 sm:gap-4 rounded-xl p-3 sm:p-4 border transition-all ${sigColors[e.significance]} ${isPast ? 'opacity-50' : ''}`}>
                        {/* Date column */}
                        <div className="flex-shrink-0 w-12 text-center">
                          <div className="text-2xl font-bold text-gold-light leading-none">{dayNum}</div>
                          <div className="text-xs text-text-tertiary uppercase">{dayName}</div>
                        </div>

                        {/* Separator */}
                        <div className="w-px h-10 bg-gold-primary/15 flex-shrink-0" />

                        {/* Planet icon */}
                        <div className="flex-shrink-0">
                          <GrahaIconById id={e.planetId} size={36} />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-gold-light font-bold" style={headingFont}>
                              {e.planetName[locale]}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sigBadge[e.significance]}`}>
                              {(locale === 'en' ? sigLabel[e.significance].en : sigLabel[e.significance].hi)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-sm">
                            <RashiIconById id={e.fromSign} size={14} />
                            <span className="text-text-tertiary" style={bodyFont}>{e.fromSignName[locale]}</span>
                            <span className="text-gold-dark mx-0.5">→</span>
                            <RashiIconById id={e.toSign} size={14} />
                            <span className="text-text-primary font-medium" style={bodyFont}>{e.toSignName[locale]}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer count */}
      {!loading && filteredEvents.length > 0 && (
        <div className="text-center text-text-tertiary text-sm mt-10">
          {locale === 'en'
            ? `Showing ${filteredEvents.length} of ${events.length} transit events for ${year}`
            : `${year} के ${events.length} गोचर में से ${filteredEvents.length} दिखाए जा रहे हैं`}
        </div>
      )}
    </div>
  );
}
