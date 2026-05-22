'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import MSG from '@/messages/pages/tithi.json';
import type { TithiDayData, NatalContext } from '@/types/tithi-calendar';
import { festivalIconFor } from '@/components/icons/FestivalIcons';
import { computeBalam } from '@/lib/panchang/balam';
import { parseLocalDate } from '@/lib/calendar/parse-local-date';

const NO_NATAL: NatalContext = { kind: 'none' };

/**
 * Day-detail slide-in panel — opens when a calendar cell is clicked.
 *
 * Desktop: right-edge rail (480px wide). Mobile: bottom sheet (75vh).
 * Closes on escape, backdrop click, and the X button.
 *
 * Drik navigates to a new page for the day. We slide a panel — keeps
 * the calendar visible so users can compare days without bouncing
 * between screens.
 */

interface Props {
  day: TithiDayData | null;
  locale: string;
  natal?: NatalContext;
  onClose: () => void;
  onNavigateFull?: (date: string) => void;
}

export default function DayDetailPanel({ day, locale, natal = NO_NATAL, onClose, onNavigateFull }: Props) {
  // Lock background scroll while panel is open, then restore on close.
  useEffect(() => {
    if (!day) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [day]);

  // Escape to close.
  useEffect(() => {
    if (!day) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [day, onClose]);

  if (!day || typeof document === 'undefined') return null;

  // parseLocalDate avoids the UTC-midnight Lesson L bug — without it,
  // Friday's cell shows "Thursday" in the panel header for users west of UTC.
  const dateObj = parseLocalDate(day.date) ?? new Date();
  const dateLabel = new Intl.DateTimeFormat(locale, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(dateObj);

  const balam =
    natal.kind === 'present' && day.nakshatraNum && day.moonRashiNum
      ? computeBalam(natal.nakshatra, natal.moonSign, day.nakshatraNum, day.moonRashiNum)
      : null;

  return createPortal(
    <div className="fixed inset-0 z-[9000]" role="dialog" aria-modal="true" aria-label={dateLabel}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      {/* Panel — bottom sheet on mobile, right rail on desktop */}
      <div
        className={[
          'absolute',
          // Mobile: bottom sheet 80vh.
          'bottom-0 left-0 right-0 max-h-[88vh]',
          // Desktop: right rail 480px full height.
          'sm:top-0 sm:bottom-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[480px]',
          'bg-gradient-to-br from-[#1c1244]/95 via-[#13093a]/95 to-[#0a0e27]/95 backdrop-blur-md',
          'border-t border-l border-gold-primary/35 sm:border-l-2 sm:border-t-0',
          'shadow-[0_-20px_80px_rgba(0,0,0,0.5)] sm:shadow-[-20px_0_60px_rgba(0,0,0,0.5)]',
          'overflow-y-auto rounded-t-3xl sm:rounded-l-2xl sm:rounded-t-none',
        ].join(' ')}
      >
        <header className="sticky top-0 z-10 px-5 pt-5 pb-3 bg-gradient-to-b from-[#1c1244]/98 to-[#1c1244]/85 border-b border-gold-primary/15">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gold-primary/80 font-bold mb-1">
                {tl(MSG.detailHeading, locale)}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gold-light leading-tight" suppressHydrationWarning>
                {dateLabel}
              </h2>
              {day.masa && (
                <div className="text-text-secondary text-xs mt-1">
                  {day.masa.amanta}{day.masa.isAdhika ? ` (${tl(MSG.adhika, locale)})` : ''} · {day.paksha === 'shukla' ? tl(MSG.pakshaShukla, locale) : tl(MSG.pakshaKrishna, locale)}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label={tl(MSG.closeLabel, locale)}
              className="p-1.5 rounded-lg border border-gold-primary/25 text-gold-primary hover:bg-gold-primary/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="px-5 py-4 space-y-5">
          {/* Headline festivals */}
          {day.festivals.length > 0 && (
            <section>
              <SectionLabel text={tl(MSG.detailFestivals, locale)} />
              <div className="space-y-2">
                {day.festivals.map((f, i) => {
                  const Icon = festivalIconFor(f.slug);
                  const chipBg =
                    f.type === 'major'
                      ? 'bg-gradient-to-r from-gold-primary/40 via-gold-primary/25 to-gold-primary/15 border-gold-primary/55'
                      : f.type === 'eclipse'
                        ? 'bg-red-500/25 border-red-400/50'
                        : 'bg-violet-500/20 border-violet-400/40';
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${chipBg}`}
                    >
                      <Icon size={32} className="shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-gold-light text-sm sm:text-base truncate">
                          {tl(f.name, locale)}
                        </div>
                        {f.category && (
                          <div className="text-[10px] uppercase tracking-wider text-text-secondary/80 font-semibold">
                            {f.category}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Panchang elements */}
          <section>
            <SectionLabel text={tl(MSG.detailPanchang, locale)} />
            <div className="grid grid-cols-1 gap-2">
              <Row label={tl(MSG.cellTithi, locale)} value={tl(day.tithiName, locale)} end={day.tithiEnd} accent="amber" />
              {day.nakshatra && (
                <Row label={tl(MSG.cellNakshatra, locale)} value={tl(day.nakshatra, locale)} end={day.nakshatraEnd} accent="cyan" />
              )}
              {day.yoga && (
                <Row label={tl(MSG.cellYoga, locale)} value={tl(day.yoga, locale)} end={day.yogaEnd} accent="fuchsia" />
              )}
              {day.karana && (
                <Row label={tl(MSG.cellKarana, locale)} value={tl(day.karana, locale)} accent="gold" />
              )}
              {day.moonRashi && (
                <Row label={tl(MSG.cellMoonSign, locale)} value={tl(day.moonRashi, locale)} end={day.moonRashiEnd} accent="slate" />
              )}
              {day.sunRashi && (
                <Row label={tl(MSG.detailSunSign, locale)} value={tl(day.sunRashi, locale)} accent="amber" />
              )}
            </div>
          </section>

          {/* Solar timing */}
          {(day.sunrise || day.sunset) && (
            <section>
              <SectionLabel text={tl(MSG.detailSolar, locale)} />
              <div className="grid grid-cols-2 gap-2">
                {day.sunrise && (
                  <Row label={tl(MSG.cellSunrise, locale)} value={day.sunrise} mono accent="amber" />
                )}
                {day.sunset && (
                  <Row label={tl(MSG.cellSunset, locale)} value={day.sunset} mono accent="amber" />
                )}
              </div>
            </section>
          )}

          {/* Inauspicious */}
          {day.rahuKaal && (
            <section>
              <SectionLabel text={tl(MSG.detailInauspicious, locale)} />
              <Row
                label={tl(MSG.rahuKaal, locale)}
                value={`${day.rahuKaal.start} – ${day.rahuKaal.end}`}
                accent="red"
                mono
              />
            </section>
          )}

          {/* Personalisation — only when the user has a kundali */}
          {balam && (
            <section>
              <SectionLabel text={tl(MSG.detailForYou, locale)} />
              <div className="space-y-2">
                <div className={`flex items-baseline justify-between gap-3 px-3 py-2 rounded-lg border ${
                  balam.tarabalam.favorable
                    ? 'bg-emerald-500/15 border-emerald-400/45'
                    : 'bg-red-500/10 border-red-400/35'
                }`}>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-text-secondary/85 font-semibold shrink-0">
                    {tl(MSG.detailTara, locale)}
                  </span>
                  <span className="flex items-baseline gap-2 min-w-0 justify-end">
                    <span className={`text-sm font-bold truncate ${balam.tarabalam.favorable ? 'text-emerald-100' : 'text-red-100'}`}>
                      {tl(balam.tarabalam.taraName, locale)}
                    </span>
                    <span className="text-[11px] shrink-0">{balam.tarabalam.favorable ? '✓' : '⚠'}</span>
                  </span>
                </div>
                <div className={`flex items-baseline justify-between gap-3 px-3 py-2 rounded-lg border ${
                  balam.chandrabalam.favorable
                    ? 'bg-emerald-500/15 border-emerald-400/45'
                    : 'bg-red-500/10 border-red-400/35'
                }`}>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-text-secondary/85 font-semibold shrink-0">
                    {tl(MSG.detailChandra, locale)}
                  </span>
                  <span className="flex items-baseline gap-2 min-w-0 justify-end">
                    <span className={`text-sm font-bold truncate ${balam.chandrabalam.favorable ? 'text-emerald-100' : 'text-red-100'}`}>
                      {balam.chandrabalam.house} {tl(MSG.detailHouse, locale)}
                    </span>
                    <span className="text-[11px] shrink-0">{balam.chandrabalam.favorable ? '✓' : '⚠'}</span>
                  </span>
                </div>
                {balam.tarabalam.favorable && balam.chandrabalam.favorable && (
                  <div className="flex items-center justify-center gap-1.5 mt-1 py-2 rounded-lg bg-gradient-to-r from-gold-primary/25 to-gold-primary/15 border border-gold-primary/55 text-gold-light font-black uppercase tracking-widest text-xs">
                    ★ {tl(MSG.detailAuspiciousForYou, locale)} ★
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Footer action */}
          {onNavigateFull && (
            <button
              onClick={() => onNavigateFull(day.date)}
              className="w-full mt-3 py-2.5 rounded-xl border border-gold-primary/40 bg-gradient-to-r from-gold-primary/25 to-gold-primary/15 text-gold-light text-sm font-bold tracking-wider uppercase hover:from-gold-primary/40 hover:to-gold-primary/25 transition-colors"
            >
              {tl(MSG.detailOpenFull, locale)} →
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.18em] text-gold-primary/80 font-bold mb-2">
      {text}
    </div>
  );
}

const ROW_ACCENTS: Record<string, string> = {
  amber:   'text-amber-200',
  cyan:    'text-cyan-200',
  fuchsia: 'text-fuchsia-200',
  gold:    'text-gold-light',
  slate:   'text-slate-200',
  red:     'text-red-200',
};

function Row({
  label,
  value,
  end,
  accent,
  mono = false,
}: {
  label: string;
  value: string;
  end?: { hhmm: string; nextDay: boolean };
  accent: keyof typeof ROW_ACCENTS | string;
  mono?: boolean;
}) {
  const color = ROW_ACCENTS[accent] ?? ROW_ACCENTS.gold;
  return (
    <div className="flex items-baseline justify-between gap-3 px-3 py-2 rounded-lg bg-bg-secondary/30 border border-gold-primary/10">
      <span className="text-[11px] uppercase tracking-[0.14em] text-text-secondary/70 font-semibold shrink-0">
        {label}
      </span>
      <span className="flex items-baseline gap-2 min-w-0 justify-end">
        <span className={`text-sm font-bold truncate ${color} ${mono ? 'font-mono' : ''}`}>{value}</span>
        {end && (
          <span className="text-[11px] font-mono text-text-secondary/80 shrink-0">
            → {end.hhmm}{end.nextDay ? '⁺' : ''}
          </span>
        )}
      </span>
    </div>
  );
}
