'use client';

import { useMemo } from 'react';
import type { KeyDate } from '@/lib/kundali/domain-synthesis/key-dates';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

// Impact → color mapping
const IMPACT_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  positive: { dot: 'bg-emerald-400', bg: 'bg-emerald-500/8', text: 'text-emerald-400' },
  challenging: { dot: 'bg-red-400', bg: 'bg-red-500/8', text: 'text-red-400' },
  transformative: { dot: 'bg-violet-400', bg: 'bg-violet-500/8', text: 'text-violet-400' },
  neutral: { dot: 'bg-gold-primary', bg: 'bg-gold-primary/8', text: 'text-gold-primary' },
};

// Type → icon
const TYPE_ICONS: Record<string, string> = {
  dasha: '◐',
  transit: '⟳',
  eclipse: '◑',
  sadeSati: '♄',
  varshaphal: '☉',
  retroStation: '℞',
  rahuKetuAxis: '☊',
  dashaSandhi: '⊘',
  muhurta: '✧',
};

interface Props {
  dates: KeyDate[];
  locale: string;
  compact?: boolean; // true = dashboard mode (max 3, no descriptions)
}

export default function KeyDatesTimeline({ dates, locale, compact = false }: Props) {
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale) || {};
  const isHi = isDevanagariLocale(locale);

  const visibleDates = useMemo(() => {
    return compact ? dates.slice(0, 3) : dates;
  }, [dates, compact]);

  if (!visibleDates.length) return null;

  const formatDate = (iso: string) => {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const daysUntil = (iso: string) => {
    const diff = Math.ceil((new Date(iso + 'T00:00:00').getTime() - Date.now()) / 86400000);
    if (diff === 0) return isHi ? 'आज' : 'Today';
    if (diff === 1) return isHi ? 'कल' : 'Tomorrow';
    if (diff < 0) return '';
    return isHi ? `${diff} दिन` : `${diff} days`;
  };

  return (
    <div className="relative">
      {/* Section header */}
      <h3 className="text-lg font-bold text-gold-light mb-4" style={hf}>
        {isHi ? 'आगामी महत्वपूर्ण तिथियाँ' : 'Upcoming Key Dates'}
      </h3>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* Vertical gold line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-gold-primary/40 via-gold-primary/20 to-transparent" />

        <div className="space-y-3">
          {visibleDates.map((event, i) => {
            const colors = IMPACT_COLORS[event.impact] || IMPACT_COLORS.neutral;
            const icon = TYPE_ICONS[event.type] || '•';

            return (
              <div key={`${event.date}-${event.type}-${i}`} className="relative group">
                {/* Dot on timeline */}
                <div className={`absolute -left-6 top-2.5 w-[11px] h-[11px] rounded-full border-2 border-bg-primary ${colors.dot} shadow-sm`} />

                {/* Card */}
                <div className={`rounded-lg ${colors.bg} border border-white/5 p-3 transition-all group-hover:border-white/10`}>
                  {/* Top row: date + days until + type icon */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-text-secondary">{formatDate(event.date)}</span>
                      {daysUntil(event.date) && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} font-medium`}>
                          {daysUntil(event.date)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm opacity-50" title={event.type}>{icon}</span>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-semibold text-text-primary leading-snug" style={bf}>
                    {tl(event.title as any, locale)}
                  </p>

                  {/* Description (hidden in compact mode) */}
                  {!compact && (
                    <p className="text-xs text-text-secondary/70 mt-1 leading-relaxed" style={bf}>
                      {tl(event.description as any, locale)}
                    </p>
                  )}

                  {/* Domain badge */}
                  {event.domain && (
                    <span className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-secondary capitalize">
                      {event.domain}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "View all" link in compact mode */}
      {compact && dates.length > 3 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gold-primary/70 hover:text-gold-primary cursor-pointer transition-colors">
            {isHi ? `सभी ${dates.length} तिथियाँ देखें →` : `View all ${dates.length} dates →`}
          </span>
        </div>
      )}
    </div>
  );
}
