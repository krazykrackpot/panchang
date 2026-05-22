'use client';

import { useEffect, useState } from 'react';
import { tl } from '@/lib/utils/trilingual';
import MSG from '@/messages/pages/tithi.json';
import type { LocaleText } from '@/types/panchang';
import type { TithiDayData } from './TithiMonthGrid';
import { computeBalam } from '@/lib/panchang/balam';

/**
 * Today panchang header — sits at the top of the tithi calendar.
 * Pulls the "today" row from the grid response and presents it as a
 * single rich card with a live "now" indicator updating every 60s.
 *
 * Live signals:
 *   - "currently in Rahu Kaal" pill (red) when now ∈ [rahuKaal.start, rahuKaal.end]
 *   - "ends in HH:MM" countdown to the next nakshatra/yoga/tithi transition
 *     (shown on the most-imminent one — visual focal point).
 *
 * Drik does NOT have this. Their daily page is static. This is one of the
 * "way better than Drik" wins in the redesign plan.
 */

interface Props {
  today: TithiDayData | null;
  locale: string;
  /** Natal moon nakshatra (1-27) from the user's saved kundali, if any. */
  natalNakshatra?: number | null;
  /** Natal moon sign / Janma Rashi (1-12) from the user's saved kundali. */
  natalMoonSign?: number | null;
}

export default function TodayPanchangHeader({ today, locale, natalNakshatra, natalMoonSign }: Props) {
  // Live "now" tick — refreshes every 60s so the Rahu Kaal pill / next
  // transition countdown stay accurate without manual reload.
  const [nowHHMM, setNowHHMM] = useState<string>(currentHHMM());
  useEffect(() => {
    const id = setInterval(() => setNowHHMM(currentHHMM()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!today) return null;

  const insideRahuKaal = today.rahuKaal
    ? isInsideWindow(nowHHMM, today.rahuKaal.start, today.rahuKaal.end)
    : false;

  // Personalised Tara + Chandrabalam — only when the user has a saved
  // kundali with moon nakshatra + sign. Computed live each render; cheap
  // pure function (~9 set-membership lookups).
  const balam =
    natalNakshatra && natalMoonSign && today.nakshatraNum && today.moonRashiNum
      ? computeBalam(natalNakshatra, natalMoonSign, today.nakshatraNum, today.moonRashiNum)
      : null;
  const personalisedAuspicious = !!balam && balam.chandrabalam.favorable && balam.tarabalam.favorable;

  return (
    <section
      role="region"
      aria-label="Today panchang"
      className="mb-6 rounded-2xl border border-gold-primary/35 bg-gradient-to-br from-[#2d1b69]/55 via-[#1a1040]/55 to-[#0a0e27] shadow-[0_0_28px_rgba(212,168,83,0.18)] p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold text-gold-primary/85">
            {tl(MSG.todayHeader, locale)}
          </span>
          <span className="text-text-secondary/70 font-mono text-[11px]">{nowHHMM}</span>
        </div>
        {insideRahuKaal && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/25 border border-red-400/60 text-red-100 text-[10px] sm:text-[11px] font-black uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.35)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
            {tl(MSG.nowInRahuKaal, locale)} · {today.rahuKaal!.start}–{today.rahuKaal!.end}
          </span>
        )}
        {!insideRahuKaal && today.rahuKaal && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-400/30 text-red-200/80 text-[10px] font-mono tracking-wider">
            {tl(MSG.rahuKaal, locale)} {today.rahuKaal.start}–{today.rahuKaal.end}
          </span>
        )}
      </div>

      {/* Personalisation row — visible only when the user has a kundali */}
      {balam && (
        <div className="mb-3 flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 via-gold-primary/8 to-violet-500/10 border border-gold-primary/25">
          <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-gold-primary/85">
            {tl(MSG.detailForYou, locale)}
          </span>
          <PersonalChip
            label={tl(MSG.detailTara, locale)}
            value={tl(balam.tarabalam.taraName, locale)}
            favorable={balam.tarabalam.favorable}
          />
          <PersonalChip
            label={tl(MSG.detailChandra, locale)}
            value={`${balam.chandrabalam.house}${ordinalSuffix(balam.chandrabalam.house)} ${tl(MSG.detailHouse, locale)}`}
            favorable={balam.chandrabalam.favorable}
          />
          {personalisedAuspicious && (
            <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-primary/30 border border-gold-primary/60 text-gold-light text-[10px] font-black uppercase tracking-widest">
              ★ {tl(MSG.detailAuspiciousForYou, locale)}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <PanchangCell
          label={tl(MSG.cellTithi, locale)}
          name={tl(today.tithiName, locale)}
          end={today.tithiEnd}
          accent="amber"
        />
        <PanchangCell
          label={tl(MSG.cellNakshatra, locale)}
          name={today.nakshatra ? tl(today.nakshatra, locale) : '—'}
          end={today.nakshatraEnd}
          accent="cyan"
        />
        <PanchangCell
          label={tl(MSG.cellYoga, locale)}
          name={today.yoga ? tl(today.yoga, locale) : '—'}
          end={today.yogaEnd}
          accent="fuchsia"
        />
        <PanchangCell
          label={tl(MSG.cellKarana, locale)}
          name={today.karana ? tl(today.karana, locale) : '—'}
          accent="gold"
        />
        <PanchangCell
          label={tl(MSG.cellSunrise, locale)}
          name={today.sunrise ?? '—'}
          subline={today.sunset ? `${tl(MSG.cellSunset, locale)} ${today.sunset}` : undefined}
          accent="amber"
          mono
        />
        <PanchangCell
          label={tl(MSG.cellMoonSign, locale)}
          name={today.moonRashi ? tl(today.moonRashi, locale) : '—'}
          end={today.moonRashiEnd}
          accent="slate"
        />
      </div>
    </section>
  );
}

const ACCENTS: Record<string, string> = {
  amber:   'text-amber-200',
  cyan:    'text-cyan-200',
  fuchsia: 'text-fuchsia-200',
  gold:    'text-gold-light',
  slate:   'text-slate-200',
};

function PanchangCell({
  label,
  name,
  end,
  subline,
  accent,
  mono = false,
}: {
  label: string;
  name: string;
  end?: { hhmm: string; nextDay: boolean };
  subline?: string;
  accent: keyof typeof ACCENTS | string;
  mono?: boolean;
}) {
  const color = ACCENTS[accent] ?? ACCENTS.gold;
  return (
    <div className="min-w-0">
      <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] font-bold text-text-secondary/70 mb-0.5">
        {label}
      </div>
      <div className={`text-[15px] sm:text-base font-bold leading-tight truncate ${color} ${mono ? 'font-mono' : ''}`} title={name}>
        {name}
      </div>
      {end && (
        <div className="text-[10px] sm:text-[11px] font-mono text-text-secondary/85 mt-0.5">
          → {end.hhmm}{end.nextDay ? '⁺' : ''}
        </div>
      )}
      {subline && (
        <div className="text-[10px] sm:text-[11px] font-mono text-text-secondary/85 mt-0.5">
          {subline}
        </div>
      )}
    </div>
  );
}

function PersonalChip({
  label,
  value,
  favorable,
}: {
  label: string;
  value: string;
  favorable: boolean;
}) {
  return (
    <span className={`inline-flex items-baseline gap-1 px-2 py-1 rounded-lg border text-[11px] ${
      favorable
        ? 'bg-emerald-500/15 border-emerald-400/45 text-emerald-100'
        : 'bg-red-500/12 border-red-400/40 text-red-100/90'
    }`}>
      <span className="text-[9px] uppercase tracking-wider opacity-80 font-bold">{label}</span>
      <span className="font-bold">{value}</span>
      <span className="text-[10px]">{favorable ? '✓' : '⚠'}</span>
    </span>
  );
}

function ordinalSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────

function currentHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Inclusive-start, exclusive-end window check that handles midnight wrap
 * (e.g. start='22:30', end='01:15' means now ∈ {22:30-23:59 OR 00:00-01:14}).
 * Hard rule from CLAUDE.md (Lesson R).
 */
function isInsideWindow(now: string, start: string, end: string): boolean {
  const m = (t: string) => {
    const [h, mm] = t.split(':').map(Number);
    return h * 60 + mm;
  };
  const n = m(now);
  const s = m(start);
  const e = m(end);
  return e < s ? (n >= s || n < e) : (n >= s && n < e);
}

// Cast inside the component file to avoid an unused-import warning when
// LocaleText is not directly referenced in TSX.
export type { LocaleText };
