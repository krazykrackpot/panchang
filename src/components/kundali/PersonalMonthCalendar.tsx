'use client';

/**
 * Personal Month Calendar — color-coded days based on natal chart + transits.
 *
 * Shows a monthly grid where each day is colored by personal quality
 * (excellent/good/neutral/caution/challenging). Highlights best and worst
 * days. Expandable day details showing Tara Bala, Chandra Bala, tithi, nakshatra.
 */

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star, AlertTriangle, Calendar } from 'lucide-react';
import { generateMonthlyCalendar, type MonthCalendarResult, type MonthDayResult } from '@/lib/personalization/monthly-calendar';
import type { UserSnapshot } from '@/lib/personalization/types';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';

const WEEKDAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_HEADERS_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

const QUALITY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  excellent: { bg: 'bg-emerald-500/25', text: 'text-emerald-300', border: 'border-emerald-500/40', dot: 'bg-emerald-400' },
  good: { bg: 'bg-emerald-500/12', text: 'text-emerald-400/80', border: 'border-emerald-500/20', dot: 'bg-emerald-400/60' },
  neutral: { bg: 'bg-white/[0.03]', text: 'text-text-secondary', border: 'border-white/5', dot: 'bg-gold-primary/40' },
  caution: { bg: 'bg-amber-500/12', text: 'text-amber-400/80', border: 'border-amber-500/20', dot: 'bg-amber-400/60' },
  challenging: { bg: 'bg-red-500/12', text: 'text-red-400/80', border: 'border-red-500/20', dot: 'bg-red-400/60' },
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'];

interface PersonalMonthCalendarProps {
  snapshot: UserSnapshot;
  lat: number;
  lng: number;
  timezone: string;
  locale: string;
}

export default function PersonalMonthCalendar({ snapshot, lat, lng, timezone, locale }: PersonalMonthCalendarProps) {
  const isHi = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [selectedDay, setSelectedDay] = useState<MonthDayResult | null>(null);

  const calendar = useMemo(() => {
    try {
      return generateMonthlyCalendar(snapshot, lat, lng, timezone, year, month, locale);
    } catch (err) {
      console.error('[personal-calendar] Generation failed:', err);
      return null;
    }
  }, [snapshot, lat, lng, timezone, year, month, locale]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  if (!calendar) {
    return (
      <div className="text-center py-8 text-text-secondary text-sm">
        {isHi ? 'व्यक्तिगत कैलेंडर लोड हो रहा है...' : 'Loading personal calendar...'}
      </div>
    );
  }

  const monthNames = isHi ? MONTH_NAMES_HI : MONTH_NAMES;
  const weekHeaders = isHi ? WEEKDAY_HEADERS_HI : WEEKDAY_HEADERS;

  // Calculate first day offset
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0=Sun

  return (
    <div className="space-y-4">
      {/* Header: month nav + stats */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-gold-light transition-colors">
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-lg font-bold text-gold-light" style={headingFont}>
          {monthNames[month - 1]} {year}
        </h3>
        <button onClick={nextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-gold-light transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Best/Worst days summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Star size={12} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              {isHi ? 'सर्वश्रेष्ठ दिन' : 'Best Days'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {calendar.bestDays.map(d => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-sm font-bold hover:bg-emerald-500/25 transition-colors"
              >
                {d.day}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-red-500/8 border border-red-500/20 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">
              {isHi ? 'सावधानी के दिन' : 'Caution Days'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {calendar.worstDays.map(d => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d)}
                className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 text-sm font-bold hover:bg-red-500/25 transition-colors"
              >
                {d.day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekHeaders.map((d, i) => (
            <div key={i} className="text-center text-[10px] text-text-secondary/50 font-semibold uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="h-12 sm:h-14" />
          ))}

          {/* Day cells */}
          {calendar.days.map(day => {
            const colors = QUALITY_COLORS[day.quality];
            const isSelected = selectedDay?.day === day.day;

            return (
              <button
                key={day.day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`h-12 sm:h-14 rounded-lg ${colors.bg} border ${isSelected ? 'border-gold-primary/60 ring-1 ring-gold-primary/30' : colors.border} flex flex-col items-center justify-center transition-all hover:scale-105 relative`}
              >
                <span className={`text-sm font-bold ${day.isToday ? 'text-gold-light' : colors.text}`}>
                  {day.day}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-0.5`} />
                {day.isToday && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-text-secondary/60">
        {Object.entries(QUALITY_COLORS).map(([quality, colors]) => (
          <span key={quality} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
            {isHi
              ? quality === 'excellent' ? 'उत्तम' : quality === 'good' ? 'शुभ' : quality === 'neutral' ? 'सामान्य' : quality === 'caution' ? 'सावधानी' : 'चुनौतीपूर्ण'
              : quality.charAt(0).toUpperCase() + quality.slice(1)}
          </span>
        ))}
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-gold-light font-bold">
              {monthNames[month - 1]} {selectedDay.day}, {year}
            </h4>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${QUALITY_COLORS[selectedDay.quality].bg} ${QUALITY_COLORS[selectedDay.quality].text}`}>
              {selectedDay.quality.toUpperCase()} ({selectedDay.score}/100)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/[0.03] p-2">
              <span className="text-text-secondary/60">Tithi</span>
              <p className="text-text-primary font-medium">{selectedDay.tithi}</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-2">
              <span className="text-text-secondary/60">Nakshatra</span>
              <p className="text-text-primary font-medium">{selectedDay.nakshatra}</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-2">
              <span className="text-text-secondary/60">Tara Bala</span>
              <p className={`font-medium ${selectedDay.taraBala.favorable ? 'text-emerald-400' : 'text-amber-400'}`}>
                {selectedDay.taraBala.name || '—'} {selectedDay.taraBala.favorable ? '✓' : '✗'}
              </p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-2">
              <span className="text-text-secondary/60">Chandra Bala</span>
              <p className={`font-medium ${selectedDay.chandraBala.favorable ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isHi ? 'भाव' : 'House'} {selectedDay.chandraBala.house} {selectedDay.chandraBala.favorable ? '✓' : '✗'}
              </p>
            </div>
          </div>

          {selectedDay.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedDay.highlights.map((h, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-dark text-[10px] font-medium">
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Month stats */}
      <div className="flex items-center justify-center gap-4 text-xs text-text-secondary/50">
        <Calendar size={12} />
        <span>{calendar.stats.excellent + calendar.stats.good} {isHi ? 'शुभ दिन' : 'favorable days'}</span>
        <span>·</span>
        <span>{calendar.stats.caution + calendar.stats.challenging} {isHi ? 'सावधानी' : 'caution days'}</span>
      </div>
    </div>
  );
}
