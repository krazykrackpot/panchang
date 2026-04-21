'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid3X3, List } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import type { LocaleText, Locale } from '@/types/panchang';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import MSG from '@/messages/pages/muhurat.json';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useBirthDataStore } from '@/stores/birth-data-store';

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DaySummary {
  date: string;
  bestScore: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  windowCount: number;
  bestWindow?: { startTime: string; endTime: string; score: number; shuddhi: number };
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
}

interface ActivityOption {
  id: string;
  label: LocaleText;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WEEKDAY_HEADERS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
};

const MONTH_NAMES_EN = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_HI = ['', 'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'];

const QUALITY_COLORS: Record<string, string> = {
  excellent: 'bg-emerald-500/20 border-emerald-500/40',
  good: 'bg-gold-primary/15 border-gold-primary/30',
  fair: 'bg-amber-500/10 border-amber-500/20',
  poor: 'bg-white/3 border-white/5',
};

const QUALITY_DOT: Record<string, string> = {
  excellent: 'bg-emerald-500',
  good: 'bg-gold-primary',
  fair: 'bg-amber-500',
  poor: 'bg-gray-600',
};

const QUALITY_LABELS: Record<string, LocaleText> = {
  excellent: { en: 'Excellent', hi: 'उत्तम' },
  good: { en: 'Good', hi: 'शुभ' },
  fair: { en: 'Fair', hi: 'ठीक' },
  poor: { en: 'No window', hi: 'कोई शुभ समय नहीं' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MuhuratPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const birthNakshatra = useBirthDataStore((s) => s.birthNakshatra);
  const birthRashi = useBirthDataStore((s) => s.birthRashi);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [activity, setActivity] = useState('marriage');
  const [days, setDays] = useState<DaySummary[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDay, setSelectedDay] = useState<DaySummary | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedDay(null);

    // Build query with personal data if available
    const params = new URLSearchParams({
      year: String(year),
      month: String(month),
      activity,
      lat: '28.6139',
      lng: '77.209',
      tz: '5.5',
    });
    if (birthNakshatra > 0) params.set('birthNak', String(birthNakshatra));
    if (birthRashi > 0) params.set('birthRashi', String(birthRashi));

    fetch(`/api/muhurat/scan?${params}`)
      .then(r => r.json())
      .then(data => {
        setDays(data.days || []);
        if (data.activities) setActivities(data.activities);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[muhurat] Scan failed:', err);
        setLoading(false);
      });
  }, [year, month, activity, birthNakshatra, birthRashi]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build calendar grid data
  const calendarGrid = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const dayMap = new Map(days.map(d => [d.date, d]));

    const cells: (DaySummary | null)[] = [];
    // Padding for first week
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    // Each day of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push(dayMap.get(dateStr) ?? { date: dateStr, bestScore: 0, quality: 'poor' as const, windowCount: 0 });
    }
    return cells;
  }, [days, year, month]);

  const auspiciousDays = days.filter(d => d.quality !== 'poor');
  const weekHeaders = isDevanagari ? WEEKDAY_HEADERS.hi : WEEKDAY_HEADERS.en;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{msg('pageTitle', locale)}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Find the most auspicious dates for important life events'
            : 'महत्त्वपूर्ण जीवन-घटनाओं के लिए सबसे शुभ तिथि खोजें'}
        </p>
        {birthNakshatra > 0 && (
          <p className="text-gold-primary/60 text-sm mt-2">
            {locale === 'hi' ? 'व्यक्तिगत स्कोर सक्रिय' : 'Personalized with your birth chart'}
          </p>
        )}
      </motion.div>

      {/* Activity selection */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {activities.map(a => (
          <button
            key={a.id}
            onClick={() => setActivity(a.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activity === a.id
                ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
            }`}
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            {tl(a.label, locale)}
          </button>
        ))}
      </div>

      {/* Month selector + view toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-gold-primary" />
          </button>
          <span className="text-2xl font-bold text-gold-gradient min-w-[200px] text-center" style={headingFont}>
            {isDevanagari ? MONTH_NAMES_HI[month] : MONTH_NAMES_EN[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all cursor-pointer">
            <ChevronRight className="w-5 h-5 text-gold-primary" />
          </button>
        </div>
        <div className="flex gap-1 border border-gold-primary/15 rounded-lg p-0.5">
          <button
            onClick={() => setView('calendar')}
            className={`p-2 rounded-md transition-all cursor-pointer ${view === 'calendar' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary hover:text-gold-primary'}`}
            aria-label="Calendar view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-md transition-all cursor-pointer ${view === 'list' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary hover:text-gold-primary'}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <GoldDivider />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : view === 'calendar' ? (
        /* ================================================================ */
        /* CALENDAR GRID VIEW                                               */
        /* ================================================================ */
        <div className="my-8">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekHeaders.map(d => (
              <div key={d} className="text-center text-text-secondary text-xs py-2 font-medium">{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarGrid.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} className="aspect-square" />;
              const dayNum = parseInt(day.date.split('-')[2]);
              const isAuspicious = day.quality !== 'poor';
              const isSelected = selectedDay?.date === day.date;

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => isAuspicious ? setSelectedDay(isSelected ? null : day) : undefined}
                  className={`aspect-square rounded-lg border p-1 flex flex-col items-center justify-center transition-all relative ${
                    isSelected
                      ? 'border-gold-primary/60 bg-gold-primary/15 ring-1 ring-gold-primary/30'
                      : isAuspicious
                        ? `${QUALITY_COLORS[day.quality]} cursor-pointer hover:border-gold-primary/40`
                        : 'border-transparent bg-white/2 opacity-40'
                  }`}
                >
                  <span className={`text-sm font-bold ${isAuspicious ? 'text-gold-light' : 'text-text-secondary/50'}`}>
                    {dayNum}
                  </span>
                  {isAuspicious && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${QUALITY_DOT[day.quality]}`} />
                  )}
                  {day.bestScore > 0 && (
                    <span className="text-[9px] text-text-secondary/60 mt-0.5">{day.bestScore}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day detail */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className={`rounded-xl border p-5 ${QUALITY_COLORS[selectedDay.quality]}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-gold-light font-bold text-lg">
                        {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString(
                          locale === 'hi' ? 'hi-IN' : 'en-US',
                          { weekday: 'long', day: 'numeric', month: 'long' },
                        )}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        selectedDay.quality === 'excellent' ? 'bg-emerald-500/20 text-emerald-400' :
                        selectedDay.quality === 'good' ? 'bg-gold-primary/20 text-gold-light' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {tl(QUALITY_LABELS[selectedDay.quality], locale)} — {locale === 'hi' ? 'स्कोर' : 'Score'}: {selectedDay.bestScore}/100
                      </span>
                    </div>
                  </div>

                  {selectedDay.bestWindow && (
                    <div className="text-text-secondary text-sm space-y-1">
                      <p>
                        <span className="text-gold-dark">{locale === 'hi' ? 'सर्वोत्तम समय' : 'Best window'}:</span>{' '}
                        {selectedDay.bestWindow.startTime} – {selectedDay.bestWindow.endTime}
                      </p>
                      <p>
                        <span className="text-gold-dark">{locale === 'hi' ? 'पंचांग शुद्धि' : 'Panchanga Shuddhi'}:</span>{' '}
                        {'●'.repeat(selectedDay.bestWindow.shuddhi)}{'○'.repeat(5 - selectedDay.bestWindow.shuddhi)} ({selectedDay.bestWindow.shuddhi}/5)
                      </p>
                    </div>
                  )}

                  {/* Personal Tara/Chandra Bala */}
                  {(selectedDay.taraBala || selectedDay.chandraBala !== undefined) && (
                    <div className="flex gap-3 mt-3">
                      {selectedDay.taraBala && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedDay.taraBala.auspicious ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          Tara: {selectedDay.taraBala.name} {selectedDay.taraBala.auspicious ? '✓' : '✗'}
                        </span>
                      )}
                      {selectedDay.chandraBala !== undefined && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedDay.chandraBala ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          Chandra Bala {selectedDay.chandraBala ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-text-secondary/50 text-xs mt-3">
                    {selectedDay.windowCount} {locale === 'hi' ? 'शुभ समय मिले' : 'auspicious windows found'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {(['excellent', 'good', 'fair'] as const).map(q => (
              <div key={q} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${QUALITY_DOT[q]}`} />
                <span className="text-text-secondary text-xs">{tl(QUALITY_LABELS[q], locale)}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-text-secondary text-sm mt-4">
            {auspiciousDays.length} {locale === 'hi' ? 'शुभ दिन इस माह' : 'auspicious days this month'}
          </p>
        </div>
      ) : (
        /* ================================================================ */
        /* LIST VIEW (sorted by score)                                      */
        /* ================================================================ */
        <div className="space-y-3 my-10">
          {auspiciousDays.length === 0 ? (
            <div className="text-center py-16 text-text-secondary">
              <p className="text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {msg('noAuspiciousDates', locale)}
              </p>
            </div>
          ) : (
            <>
              {auspiciousDays
                .sort((a, b) => b.bestScore - a.bestScore)
                .map((d, i) => {
                  const dateObj = new Date(d.date + 'T00:00:00');
                  const dayNum = dateObj.getDate();

                  return (
                    <motion.div
                      key={d.date}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.5) }}
                      className={`rounded-xl border p-5 ${QUALITY_COLORS[d.quality]}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-bg-primary/60 flex flex-col items-center justify-center flex-shrink-0 border border-gold-primary/10">
                          <span className="text-gold-light text-2xl font-bold leading-none">{dayNum}</span>
                          <span className="text-text-secondary text-xs mt-0.5">
                            {dateObj.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              d.quality === 'excellent' ? 'bg-emerald-500/20 text-emerald-400' :
                              d.quality === 'good' ? 'bg-gold-primary/20 text-gold-light' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {tl(QUALITY_LABELS[d.quality], locale)}
                            </span>
                            <span className="text-text-secondary text-xs">{d.bestScore}/100</span>
                          </div>
                          {d.bestWindow && (
                            <p className="text-text-secondary text-sm">
                              <span className="text-gold-dark">{locale === 'hi' ? 'समय' : 'Best'}:</span> {d.bestWindow.startTime} – {d.bestWindow.endTime}
                              {' · '}
                              <span className="text-gold-dark">{locale === 'hi' ? 'शुद्धि' : 'Shuddhi'}:</span> {d.bestWindow.shuddhi}/5
                            </p>
                          )}
                          {d.taraBala && (
                            <span className={`text-xs ${d.taraBala.auspicious ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                              Tara: {d.taraBala.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              <p className="text-center text-text-secondary text-sm mt-4">
                {auspiciousDays.length} {locale === 'hi' ? 'शुभ दिन' : 'auspicious days'}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
