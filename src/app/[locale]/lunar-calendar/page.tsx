'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { useLocationStore } from '@/stores/location-store';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import { computeDailyEnergy, type DailyEnergy } from '@/lib/panchang/energy-score';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import type { PanchangData } from '@/types/panchang';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, Moon, Sun, Sparkles, AlertTriangle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────

interface DayData {
  date: Date;
  day: number;
  panchang: PanchangData | null;
  energy: DailyEnergy | null;
  moonPhaseIcon: string;
  moonPhaseLabel: string;
  isFullMoon: boolean;
  isNewMoon: boolean;
}

// ─── Helpers ────────────────────────────────────────────────

function getMoonPhaseIcon(tithiNumber: number, paksha: 'shukla' | 'krishna'): { icon: string; label: string } {
  if (paksha === 'shukla') {
    if (tithiNumber === 15) return { icon: '\u25CB', label: 'Full Moon' };    // ○
    if (tithiNumber <= 4) return { icon: '\u{1F312}', label: 'Waxing Crescent' }; // 🌒
    if (tithiNumber <= 8) return { icon: '\u25D0', label: 'First Quarter' };  // ◐
    if (tithiNumber <= 12) return { icon: '\u{1F314}', label: 'Waxing Gibbous' }; // 🌔
    return { icon: '\u25CB', label: 'Near Full' };                            // ○
  } else {
    if (tithiNumber === 15) return { icon: '\u25CF', label: 'New Moon' };     // ●
    if (tithiNumber <= 4) return { icon: '\u{1F316}', label: 'Waning Gibbous' }; // 🌖
    if (tithiNumber <= 8) return { icon: '\u25D1', label: 'Last Quarter' };   // ◑
    if (tithiNumber <= 12) return { icon: '\u{1F318}', label: 'Waning Crescent' }; // 🌘
    return { icon: '\u25CF', label: 'Near New' };                             // ●
  }
}

function getEnergyColor(score: number): string {
  if (score >= 80) return 'text-gold-light';
  if (score >= 50) return 'text-text-primary';
  return 'text-text-secondary';
}

function getEnergyBgColor(score: number): string {
  if (score >= 80) return 'bg-gold-primary/20';
  if (score >= 50) return 'bg-gold-primary/10';
  return 'bg-white/5';
}

const WEEKDAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Lunar Phase Guide static content ────────────────────────

const LUNAR_PHASES = [
  {
    title: 'Waxing Phase (Shukla Paksha)',
    icon: '\u25D0',
    description: 'The Moon grows from New to Full over ~15 days. Energy builds progressively. This is the time for initiating projects, making commitments, expanding efforts, and building momentum. Each day carries more creative and outward energy than the last.',
  },
  {
    title: 'Full Moon (Purnima)',
    icon: '\u25CB',
    description: 'Peak lunar energy. Emotions run high, intuition is sharpest, and visibility (both literal and metaphorical) is at maximum. Ideal for celebrations, community gatherings, acts of generosity, and completing tasks begun during the waxing phase. Fasting on Purnima is a widespread Vedic practice.',
  },
  {
    title: 'Waning Phase (Krishna Paksha)',
    icon: '\u25D1',
    description: 'The Moon diminishes from Full to New over ~15 days. Energy turns inward. This is the time for review, release, closure, and shedding what no longer serves. Spiritual practice, introspection, and ancestral offerings gain potency as the Moon recedes.',
  },
  {
    title: 'New Moon (Amavasya)',
    icon: '\u25CF',
    description: 'The Moon is invisible — the quietest point of the cycle. A day for rest, setting intentions for the next cycle, ancestor remembrance (Pitru work), and deep meditation. Not suitable for launching new external ventures.',
  },
];

const KEY_WINDOWS = [
  {
    title: 'Ekadashi',
    description: 'The 11th tithi of each paksha (twice monthly). A premier day for fasting, meditation, and spiritual discipline. Ekadashi falls in both Shukla and Krishna pakshas — each carries a distinct name and specific benefits.',
  },
  {
    title: 'Eclipse Windows',
    description: 'During solar or lunar eclipses, the normal energy patterns are disrupted. Vedic tradition advises against starting new ventures, eating, or performing rituals during the eclipse period. Post-eclipse bathing and charity are recommended.',
  },
];

// ─── Component ──────────────────────────────────────────────

export default function LunarCalendarPage() {
  const locale = useLocale();
  const { lat, lng, name: locationName, timezone, confirmed, detect } = useLocationStore();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-indexed
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [monthData, setMonthData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect location on mount
  useEffect(() => {
    detect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute panchang for the entire month when month/year/location changes
  useEffect(() => {
    if (lat === null || lng === null || !timezone) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedDay(null);

    // Use setTimeout to avoid blocking the UI thread during heavy computation
    const timer = setTimeout(() => {
      try {
        const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
        const results: DayData[] = [];

        for (let d = 1; d <= daysInMonth; d++) {
          try {
            const tzOffset = getUTCOffsetForDate(viewYear, viewMonth, d, timezone);
            const input: PanchangInput = {
              year: viewYear,
              month: viewMonth,
              day: d,
              lat,
              lng,
              tzOffset,
              timezone,
              locationName: locationName || undefined,
            };

            const panchang = computePanchang(input);
            const energy = computeDailyEnergy(panchang);
            const { icon, label } = getMoonPhaseIcon(panchang.tithi.number, panchang.tithi.paksha);

            results.push({
              date: new Date(Date.UTC(viewYear, viewMonth - 1, d)),
              day: d,
              panchang,
              energy,
              moonPhaseIcon: icon,
              moonPhaseLabel: label,
              isFullMoon: panchang.tithi.paksha === 'shukla' && panchang.tithi.number === 15,
              isNewMoon: panchang.tithi.paksha === 'krishna' && panchang.tithi.number === 15,
            });
          } catch (dayErr) {
            console.error(`[lunar-calendar] Failed to compute day ${d}:`, dayErr);
            results.push({
              date: new Date(Date.UTC(viewYear, viewMonth - 1, d)),
              day: d,
              panchang: null,
              energy: null,
              moonPhaseIcon: '\u00B7',
              moonPhaseLabel: 'Unknown',
              isFullMoon: false,
              isNewMoon: false,
            });
          }
        }

        setMonthData(results);
      } catch (err) {
        console.error('[lunar-calendar] Month computation failed:', err);
        setError('Failed to compute lunar data for this month. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [viewYear, viewMonth, lat, lng, timezone, locationName]);

  // Navigation
  const goToPrevMonth = useCallback(() => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  }, [viewMonth]);

  const goToNextMonth = useCallback(() => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  }, [viewMonth]);

  const goToToday = useCallback(() => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth() + 1);
    setSelectedDay(today.getDate());
  }, [today]);

  // Calendar grid computation
  const calendarGrid = useMemo(() => {
    // First day of month: 0=Sun, 1=Mon...6=Sat
    // We want Mon=0, so shift: (jsDay + 6) % 7
    const firstDayJs = new Date(viewYear, viewMonth - 1, 1).getDay();
    const startOffset = (firstDayJs + 6) % 7; // 0=Mon start
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

    const rows: (DayData | null)[][] = [];
    let currentRow: (DayData | null)[] = [];

    // Leading empty cells
    for (let i = 0; i < startOffset; i++) {
      currentRow.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayData = monthData.find(dd => dd.day === d) || null;
      currentRow.push(dayData);
      if (currentRow.length === 7) {
        rows.push(currentRow);
        currentRow = [];
      }
    }

    // Trailing empty cells
    if (currentRow.length > 0) {
      while (currentRow.length < 7) currentRow.push(null);
      rows.push(currentRow);
    }

    return rows;
  }, [monthData, viewYear, viewMonth]);

  // Today's data for the hero section
  const todayData = useMemo(() => {
    const todayDate = new Date();
    if (viewYear === todayDate.getFullYear() && viewMonth === todayDate.getMonth() + 1) {
      return monthData.find(d => d.day === todayDate.getDate()) || null;
    }
    return null;
  }, [monthData, viewYear, viewMonth]);

  // Selected day data for the detail panel
  const selectedDayData = useMemo(() => {
    if (selectedDay === null) return null;
    return monthData.find(d => d.day === selectedDay) || null;
  }, [monthData, selectedDay]);

  // Which row contains the selected day? For inline expansion.
  const selectedRowIndex = useMemo(() => {
    if (selectedDay === null) return -1;
    for (let r = 0; r < calendarGrid.length; r++) {
      if (calendarGrid[r].some(cell => cell?.day === selectedDay)) return r;
    }
    return -1;
  }, [calendarGrid, selectedDay]);

  const monthName = new Date(viewYear, viewMonth - 1).toLocaleDateString(locale === 'sa' ? 'hi-IN' : locale, { month: 'long' });

  const isToday = (day: number) => {
    const now = new Date();
    return viewYear === now.getFullYear() && viewMonth === now.getMonth() + 1 && day === now.getDate();
  };

  return (
    <main className="min-h-screen bg-bg-primary pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ─── Section 1: Lunar Phase Hero ─── */}
        <section className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-light mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {locale === 'hi' ? 'चंद्र जीवनशैली कैलेंडर' : locale === 'sa' ? 'चन्द्रकलापत्रम्' : 'Lunar Lifestyle Calendar'}
          </h1>
          <p className="text-text-secondary mb-6">
            {locale === 'hi'
              ? 'चंद्रमा की दैनिक ऊर्जा को ट्रैक करें और वैदिक पंचांग के अनुसार जीवनशैली योजना बनाएं।'
              : 'Track the Moon\'s daily energy and plan your lifestyle according to Vedic Panchang rhythms.'}
          </p>

          {/* Location display */}
          {confirmed && locationName && (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary mb-6">
              <MapPin className="w-3.5 h-3.5 text-gold-primary" />
              <span>{locationName}</span>
            </div>
          )}

          {!confirmed && !loading && (
            <div className="bg-gold-primary/10 border border-gold-primary/20 rounded-xl p-4 mb-6">
              <p className="text-text-primary text-sm">
                <AlertTriangle className="w-4 h-4 inline mr-1.5 text-gold-primary" />
                Location not detected. The calendar uses your location for accurate sunrise-based panchang.
                Please allow location access or set it in your profile.
              </p>
            </div>
          )}

          {/* Today's hero card */}
          {todayData?.panchang && todayData.energy && (
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border border-gold-primary/12 hover:border-gold-primary/40 transition-all p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Moon phase visual */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-6xl sm:text-7xl leading-none mb-2" aria-label={todayData.moonPhaseLabel}>
                    {todayData.moonPhaseIcon}
                  </div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider">
                    {todayData.moonPhaseLabel}
                  </div>
                </div>

                {/* Energy info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-gold-light">
                      {locale === 'hi' ? 'आज की चंद्र ऊर्जा' : 'Today\'s Lunar Energy'}
                    </h2>
                    <span className={`text-2xl font-bold ${getEnergyColor(todayData.energy.score)}`}>
                      {todayData.energy.score}
                    </span>
                    <span className="text-sm text-text-secondary">/ 100</span>
                  </div>

                  {/* Energy bar */}
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold-primary to-gold-light transition-all duration-700"
                      style={{ width: `${todayData.energy.score}%` }}
                    />
                  </div>

                  <div className="text-sm text-text-secondary mb-1">
                    {locale === 'hi' ? 'प्रमुख कारक' : 'Dominant factor'}: <span className="text-text-primary">{todayData.energy.dominantFactor}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {/* Best for */}
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gold-primary mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {locale === 'hi' ? 'सर्वोत्तम' : 'Best For'}
                      </div>
                      <ul className="space-y-0.5">
                        {todayData.energy.bestFor.map((item, i) => (
                          <li key={i} className="text-sm text-text-primary">{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Avoid */}
                    {todayData.energy.avoid.length > 0 && (
                      <div>
                        <div className="text-xs uppercase tracking-wider text-red-400/80 mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {locale === 'hi' ? 'बचें' : 'Avoid'}
                        </div>
                        <ul className="space-y-0.5">
                          {todayData.energy.avoid.map((item, i) => (
                            <li key={i} className="text-sm text-text-secondary">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading state for hero */}
          {loading && (
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border border-gold-primary/12 p-8 animate-pulse">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/5" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-white/5 rounded w-48" />
                  <div className="h-2.5 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-32" />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ─── Section 2: Month View Calendar ─── */}
        <section className="mb-16">
          {/* Month header with navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPrevMonth}
              className="p-2 rounded-lg hover:bg-gold-primary/10 text-text-secondary hover:text-gold-light transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gold-light capitalize" style={{ fontFamily: 'var(--font-heading)' }}>
                {monthName} {viewYear}
              </h2>
              {(viewYear !== today.getFullYear() || viewMonth !== today.getMonth() + 1) && (
                <button
                  onClick={goToToday}
                  className="text-xs text-gold-primary hover:text-gold-light mt-1 transition-colors"
                >
                  {locale === 'hi' ? 'आज पर जाएं' : 'Go to today'}
                </button>
              )}
            </div>

            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gold-primary/10 text-text-secondary hover:text-gold-light transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Calendar grid */}
          <div className="rounded-xl border border-gold-primary/10 overflow-hidden">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 bg-bg-secondary/80">
              {WEEKDAY_HEADERS.map(day => (
                <div key={day} className="py-2.5 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar rows */}
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-gold-primary/30 border-t-gold-primary rounded-full animate-spin mb-3" />
                <p className="text-sm text-text-secondary">
                  {locale === 'hi' ? 'पंचांग गणना हो रही है...' : 'Computing panchang data...'}
                </p>
              </div>
            ) : (
              calendarGrid.map((row, rowIdx) => (
                <div key={rowIdx}>
                  <div className="grid grid-cols-7">
                    {row.map((cell, colIdx) => {
                      if (!cell) {
                        return <div key={`empty-${colIdx}`} className="p-1 sm:p-2 min-h-[72px] sm:min-h-[84px] bg-bg-primary/30" />;
                      }

                      const isSelected = selectedDay === cell.day;
                      const isTodayCell = isToday(cell.day);
                      const score = cell.energy?.score ?? 0;

                      return (
                        <button
                          key={cell.day}
                          onClick={() => setSelectedDay(isSelected ? null : cell.day)}
                          className={`
                            p-1.5 sm:p-2 min-h-[72px] sm:min-h-[84px] text-left transition-all duration-200
                            border-b border-r border-white/5 relative
                            ${isSelected
                              ? 'bg-gold-primary/10 border-gold-primary/20'
                              : 'bg-bg-primary/20 hover:bg-bg-secondary/60'}
                            ${isTodayCell ? 'ring-1 ring-inset ring-gold-primary/40' : ''}
                          `}
                          aria-label={`${cell.day} ${monthName} — Energy: ${score}`}
                        >
                          {/* Day number */}
                          <div className="flex items-center justify-between mb-0.5">
                            <span className={`text-sm font-medium ${isTodayCell ? 'text-gold-light' : 'text-text-primary'}`}>
                              {cell.day}
                            </span>
                            {/* Full Moon / New Moon badge */}
                            {cell.isFullMoon && (
                              <span className="text-[9px] font-bold text-gold-primary bg-gold-primary/15 px-1 rounded">FM</span>
                            )}
                            {cell.isNewMoon && (
                              <span className="text-[9px] font-bold text-text-secondary bg-white/10 px-1 rounded">NM</span>
                            )}
                          </div>

                          {/* Moon phase icon */}
                          <div className="text-lg sm:text-xl leading-none mb-0.5 text-center opacity-70">
                            {cell.moonPhaseIcon}
                          </div>

                          {/* Energy score */}
                          <div className={`text-[11px] sm:text-xs font-medium text-center ${getEnergyColor(score)}`}>
                            {score}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline detail panel — rendered below the row containing the selected day */}
                  {selectedRowIndex === rowIdx && selectedDayData?.panchang && selectedDayData.energy && (
                    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-t border-b border-gold-primary/12 p-4 sm:p-6 animate-fade-in">
                      <div className="max-w-2xl mx-auto">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gold-light">
                              {selectedDayData.date.toLocaleDateString(locale === 'sa' ? 'hi-IN' : locale, {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                timeZone: 'UTC',
                              })}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-2xl">{selectedDayData.moonPhaseIcon}</span>
                              <span className="text-sm text-text-secondary">{selectedDayData.moonPhaseLabel}</span>
                              {selectedDayData.panchang.tithi?.name && (
                                <span className="text-sm text-text-secondary">
                                  {tl(selectedDayData.panchang.tithi.name, locale)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Energy score circle */}
                          <div className={`flex flex-col items-center ${getEnergyBgColor(selectedDayData.energy.score)} rounded-xl px-4 py-2`}>
                            <span className={`text-2xl font-bold ${getEnergyColor(selectedDayData.energy.score)}`}>
                              {selectedDayData.energy.score}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-text-secondary">energy</span>
                          </div>
                        </div>

                        {/* Panchang summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                          <div>
                            <span className="text-text-secondary text-xs block">Tithi</span>
                            <span className="text-text-primary">{tl(selectedDayData.panchang.tithi.name, locale)}</span>
                          </div>
                          <div>
                            <span className="text-text-secondary text-xs block">Nakshatra</span>
                            <span className="text-text-primary">{tl(selectedDayData.panchang.nakshatra.name, locale)}</span>
                          </div>
                          <div>
                            <span className="text-text-secondary text-xs block">Yoga</span>
                            <span className="text-text-primary">{tl(selectedDayData.panchang.yoga.name, locale)}</span>
                          </div>
                          <div>
                            <span className="text-text-secondary text-xs block">Karana</span>
                            <span className="text-text-primary">{tl(selectedDayData.panchang.karana.name, locale)}</span>
                          </div>
                        </div>

                        {/* Best for / Avoid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-gold-primary mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Best For
                            </div>
                            <ul className="space-y-0.5">
                              {selectedDayData.energy.bestFor.map((item, i) => (
                                <li key={i} className="text-sm text-text-primary">{item}</li>
                              ))}
                            </ul>
                          </div>
                          {selectedDayData.energy.avoid.length > 0 && (
                            <div>
                              <div className="text-xs uppercase tracking-wider text-red-400/80 mb-1.5 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Avoid
                              </div>
                              <ul className="space-y-0.5">
                                {selectedDayData.energy.avoid.map((item, i) => (
                                  <li key={i} className="text-sm text-text-secondary">{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Link to full panchang */}
                        <Link
                          href={`/panchang?date=${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`}
                          className="inline-flex items-center gap-1.5 text-sm text-gold-primary hover:text-gold-light transition-colors"
                        >
                          {locale === 'hi' ? 'पूर्ण पंचांग देखें' : 'See Full Panchang'}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-primary/40" /> FM = Full Moon
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" /> NM = New Moon
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-gold-light font-medium">80+</span> High energy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-text-primary font-medium">50-79</span> Moderate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-text-secondary font-medium">&lt;50</span> Low
            </span>
          </div>
        </section>

        {/* ─── Section 3: Lunar Rhythm Guide ─── */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            {locale === 'hi' ? 'चंद्र लय मार्गदर्शिका' : 'Lunar Rhythm Guide'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {LUNAR_PHASES.map(phase => (
              <div
                key={phase.title}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-xl border border-gold-primary/12 p-5 hover:border-gold-primary/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{phase.icon}</span>
                  <h3 className="text-base font-semibold text-gold-light">{phase.title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>

          {/* Key Windows */}
          <h3 className="text-lg font-semibold text-gold-light mb-4">
            {locale === 'hi' ? 'विशेष चन्द्र काल' : 'Key Lunar Windows'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {KEY_WINDOWS.map(w => (
              <div
                key={w.title}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-xl border border-gold-primary/12 p-5 hover:border-gold-primary/40 transition-all"
              >
                <h4 className="text-base font-semibold text-text-primary mb-2">{w.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{w.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-primary/15 hover:bg-gold-primary/25 border border-gold-primary/30 rounded-xl text-gold-light font-medium transition-colors"
            >
              {locale === 'hi' ? 'पूर्ण वैदिक कैलेंडर देखें' : 'Explore the Full Vedic Calendar'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
