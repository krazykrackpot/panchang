'use client';

/**
 * JournalCalendarHeatmap — GitHub-style 90-day mood heatmap.
 *
 * Grid: 7 rows (Mon–Sun) × ~13 weeks.
 * Color: keyed by mood level (1-5) or empty.
 * Click: calls onDateClick(dateStr "YYYY-MM-DD").
 * Tooltip: date + mood label + nakshatra name on hover.
 */

import { useMemo, useState } from 'react';
import type { JournalEntry } from '@/types/journal';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    heading: 'Last 90 Days',
    noEntry: 'No entry',
    mood: 'Mood',
    nakshatra: 'Nakshatra',
    moodNames: ['', 'Low', 'Rough', 'Okay', 'Good', 'Great'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  hi: {
    heading: 'पिछले 90 दिन',
    noEntry: 'कोई प्रविष्टि नहीं',
    mood: 'मनोदशा',
    nakshatra: 'नक्षत्र',
    moodNames: ['', 'निम्न', 'कठिन', 'ठीक', 'अच्छा', 'बेहतरीन'],
    days: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
  },
  sa: {
    heading: 'अन्तिमानि ९० दिनानि',
    noEntry: 'प्रविष्टिः नास्ति',
    mood: 'मनोदशा',
    nakshatra: 'नक्षत्रम्',
    moodNames: ['', 'न्यून', 'कठिनः', 'साधारण', 'शुभः', 'उत्तमः'],
    days: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
  },
  ta: {
    heading: 'கடந்த 90 நாட்கள்',
    noEntry: 'பதிவு இல்லை',
    mood: 'மனநிலை',
    nakshatra: 'நட்சத்திரம்',
    moodNames: ['', 'குறைவு', 'கடினம்', 'சரி', 'நல்லது', 'மிகவும் நல்லது'],
    days: ['திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி', 'ஞாயிறு'],
  },
  bn: {
    heading: 'শেষ ৯০ দিন',
    noEntry: 'কোনো এন্ট্রি নেই',
    mood: 'মেজাজ',
    nakshatra: 'নক্ষত্র',
    moodNames: ['', 'নিম্ন', 'কঠিন', 'ঠিক আছে', 'ভালো', 'দারুণ'],
    days: ['সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি', 'রবি'],
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getLabels(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Mood cell colours (index 0 = no entry, 1-5 = mood levels)
// ---------------------------------------------------------------------------
const CELL_BG = [
  'bg-[#111633]',          // 0 — no entry
  'bg-red-500/40',         // 1
  'bg-orange-500/40',      // 2
  'bg-yellow-500/40',      // 3
  'bg-lime-500/40',        // 4
  'bg-emerald-500/40',     // 5
] as const;

const CELL_HOVER_RING = [
  'hover:ring-1 hover:ring-white/20',
  'hover:ring-1 hover:ring-red-400/60',
  'hover:ring-1 hover:ring-orange-400/60',
  'hover:ring-1 hover:ring-yellow-400/60',
  'hover:ring-1 hover:ring-lime-400/60',
  'hover:ring-1 hover:ring-emerald-400/60',
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function toDateStr(d: Date): string {
  // YYYY-MM-DD in local calendar
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  entries: JournalEntry[];
  locale: string;
  onDateClick: (date: string) => void;
}

interface TooltipState {
  dateStr: string;
  entry: JournalEntry | null;
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function JournalCalendarHeatmap({ entries, locale, onDateClick }: Props) {
  const L = getLabels(locale);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Build a Map<dateStr, JournalEntry> for O(1) lookups
  const entryMap = useMemo(() => {
    const m = new Map<string, JournalEntry>();
    for (const e of entries) {
      m.set(e.entry_date, e);
    }
    return m;
  }, [entries]);

  // Build 90-day grid: array of ISO date strings from 90 days ago to today.
  // We start from a Monday so the grid aligns by weekday.
  const cells = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the Monday on or before (today - 89 days)
    const earliest = new Date(today);
    earliest.setDate(today.getDate() - 89);
    // getDay(): 0=Sun,1=Mon,...,6=Sat → shift so Mon=0
    const dow = (earliest.getDay() + 6) % 7; // Mon=0
    earliest.setDate(earliest.getDate() - dow); // snap back to Monday

    const days: string[] = [];
    const cursor = new Date(earliest);
    while (cursor <= today) {
      days.push(toDateStr(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, []);

  // Group cells into weeks (columns of 7)
  const weeks = useMemo(() => {
    const result: string[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [cells]);

  // Today's date string for outline
  const todayStr = toDateStr(new Date());

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, dateStr: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      dateStr,
      entry: entryMap.get(dateStr) ?? null,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-5">
      {/* Heading */}
      <h3 className="text-sm font-bold uppercase tracking-widest text-gold-light mb-4">
        {L.heading}
      </h3>

      {/* Day-of-week labels */}
      <div className="flex gap-1.5 mb-1.5">
        {/* Spacer for row labels */}
        <div className="w-7 shrink-0" />
        {weeks.map((_, wi) => (
          <div key={wi} className="w-3.5 shrink-0" />
        ))}
      </div>

      {/* Grid: row per weekday (0=Mon…6=Sun) */}
      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col gap-1">
          {L.days.map((d, i) => (
            <div
              key={i}
              className="h-3.5 flex items-center text-[9px] text-text-secondary w-7 leading-none"
            >
              {/* Show only Mon, Wed, Fri, Sun to avoid crowding */}
              {i % 2 === 0 ? d : ''}
            </div>
          ))}
        </div>

        {/* Weeks × days grid */}
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((dateStr, di) => {
                const entry = entryMap.get(dateStr);
                const mood = entry?.mood ?? 0;
                const isToday = dateStr === todayStr;
                const isFuture = dateStr > todayStr;

                return (
                  <button
                    key={di}
                    onClick={() => !isFuture && onDateClick(dateStr)}
                    onMouseEnter={(e) => !isFuture && handleMouseEnter(e, dateStr)}
                    onMouseLeave={handleMouseLeave}
                    disabled={isFuture}
                    aria-label={`${dateStr}${entry ? ` — Mood ${mood}` : ''}`}
                    className={[
                      'w-3.5 h-3.5 rounded-sm transition-all',
                      isFuture
                        ? 'bg-[#0d1224] opacity-30 cursor-default'
                        : CELL_BG[mood as 0 | 1 | 2 | 3 | 4 | 5],
                      !isFuture && CELL_HOVER_RING[mood as 0 | 1 | 2 | 3 | 4 | 5],
                      isToday ? 'ring-1 ring-gold-primary/60' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <span className="text-[10px] text-text-secondary">{L.noEntry}</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4, 5].map((m) => (
            <span
              key={m}
              className={`w-3 h-3 rounded-sm ${CELL_BG[m as 0 | 1 | 2 | 3 | 4 | 5]}`}
              title={m === 0 ? L.noEntry : `${L.mood} ${m}: ${L.moodNames[m as 1|2|3|4|5]}`}
            />
          ))}
        </div>
        <span className="text-[10px] text-text-secondary">{L.moodNames[5]}</span>
      </div>

      {/* Tooltip (fixed position, rendered via portal-style absolute) */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          <div className="rounded-lg border border-gold-primary/20 bg-[#0d1130]/95 backdrop-blur-sm px-3 py-2 text-xs shadow-xl min-w-[140px]">
            <p className="text-gold-light font-semibold mb-1">
              {formatDisplayDate(tooltip.dateStr)}
            </p>
            {tooltip.entry ? (
              <>
                <p className="text-text-primary">
                  {L.mood}: <span className="text-gold-primary">{L.moodNames[tooltip.entry.mood ?? 0]}</span>
                </p>
                {tooltip.entry.planetary_state?.nakshatra?.name && (
                  <p className="text-text-secondary mt-0.5">
                    {L.nakshatra}: {tooltip.entry.planetary_state.nakshatra.name}
                  </p>
                )}
              </>
            ) : (
              <p className="text-text-secondary">{L.noEntry}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
