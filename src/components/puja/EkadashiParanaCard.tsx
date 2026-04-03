'use client';

import { useMemo } from 'react';
import { Sunrise, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { Locale } from '@/types/panchang';

interface EkadashiParanaCardProps {
  paranaDate: string;
  paranaStart: string;
  paranaEnd: string;
  paranaSunrise: string;
  paranaHariVasaraEnd: string;
  paranaDwadashiEnd: string;
  paranaMadhyahnaStart: string;
  paranaMadhyahnaEnd: string;
  paranaEarlyEnd?: boolean;
  locale: Locale;
}

const LABELS = {
  en: {
    title: 'Ekadashi Parana',
    subtitle: 'Fast Breaking',
    paranaWindow: 'Parana Window',
    breakFast: 'Break your fast in this window',
    rules: 'Rules',
    afterSunrise: 'After sunrise',
    afterHariVasara: 'After Hari Vasara ends',
    hariVasaraNote: 'First quarter of Dwadashi tithi is Hari Vasara — breaking fast during this is prohibited (Padma Purana)',
    notDuringMadhyahna: 'NOT during Madhyahna',
    madhyahnaNote: 'Midday period when parana is not recommended',
    beforeDwadashi: 'Before Dwadashi tithi ends',
    dwadashiNote: 'Parana must be completed before Dwadashi ends, otherwise the vrat is broken improperly',
    earlyEndWarning: 'Dwadashi ends before Hari Vasara — parana immediately at sunrise',
    sunrise: 'Sunrise',
    hariVasara: 'Hari Vasara',
    parana: 'Parana',
    madhyahna: 'Madhyahna',
    dwadashiEnd: 'Dw. End',
    format24h: '24h format for your location',
    acceptable: 'Acceptable if window missed',
  },
  hi: {
    title: 'एकादशी पारण',
    subtitle: 'व्रत उद्यापन',
    paranaWindow: 'पारण समय',
    breakFast: 'इस समय में व्रत खोलें',
    rules: 'नियम',
    afterSunrise: 'सूर्योदय के बाद',
    afterHariVasara: 'हरि वासर समाप्ति के बाद',
    hariVasaraNote: 'द्वादशी तिथि का प्रथम चतुर्थांश हरि वासर है — इस काल में पारण वर्जित है (पद्म पुराण)',
    notDuringMadhyahna: 'मध्याह्न में नहीं',
    madhyahnaNote: 'मध्यदिन का काल जिसमें पारण अनुशंसित नहीं',
    beforeDwadashi: 'द्वादशी तिथि समाप्ति से पहले',
    dwadashiNote: 'द्वादशी समाप्ति से पहले पारण पूर्ण होना चाहिए, अन्यथा व्रत अनुचित रूप से भंग होता है',
    earlyEndWarning: 'द्वादशी हरि वासर से पहले समाप्त — सूर्योदय पर तुरन्त पारण करें',
    sunrise: 'सूर्योदय',
    hariVasara: 'हरि वासर',
    parana: 'पारण',
    madhyahna: 'मध्याह्न',
    dwadashiEnd: 'द्वा. अन्त',
    format24h: '24 घंटे प्रारूप, आपके स्थान के लिए',
    acceptable: 'यदि समय सीमा चूक जाए तो स्वीकार्य',
  },
  sa: {
    title: 'एकादशीपारणम्',
    subtitle: 'व्रतोद्यापनम्',
    paranaWindow: 'पारणकालः',
    breakFast: 'अस्मिन् काले व्रतं भञ्जयतु',
    rules: 'नियमाः',
    afterSunrise: 'सूर्योदयानन्तरम्',
    afterHariVasara: 'हरिवासरसमाप्त्यनन्तरम्',
    hariVasaraNote: 'द्वादशीतिथेः प्रथमचतुर्थांशः हरिवासरः — अस्मिन् काले पारणं निषिद्धम् (पद्मपुराणम्)',
    notDuringMadhyahna: 'मध्याह्ने न',
    madhyahnaNote: 'मध्यदिनकालः यत्र पारणम् अननुशंसितम्',
    beforeDwadashi: 'द्वादशीतिथिसमाप्तेः पूर्वम्',
    dwadashiNote: 'द्वादशीसमाप्तेः पूर्वं पारणं सम्पन्नं भवेत्, अन्यथा व्रतं अयथावत् भज्यते',
    earlyEndWarning: 'द्वादशी हरिवासरात् पूर्वं समाप्यते — सूर्योदये तत्क्षणं पारणं कुर्यात्',
    sunrise: 'सूर्योदयः',
    hariVasara: 'हरिवासरः',
    parana: 'पारणम्',
    madhyahna: 'मध्याह्नः',
    dwadashiEnd: 'द्वा. अन्तः',
    format24h: '24 होरा प्रारूपम्',
    acceptable: 'यदि कालः अतीतः तर्हि स्वीकार्यम्',
  },
};

/** Parse "HH:MM" → minutes since midnight */
function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatDateLocale(dateStr: string, locale: Locale): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const loc = locale === 'hi' ? 'hi-IN' : locale === 'sa' ? 'sa-IN' : 'en-US';
  try {
    return date.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
}

export default function EkadashiParanaCard({
  paranaDate,
  paranaStart,
  paranaEnd,
  paranaSunrise,
  paranaHariVasaraEnd,
  paranaDwadashiEnd,
  paranaMadhyahnaStart,
  paranaMadhyahnaEnd,
  paranaEarlyEnd,
  locale,
}: EkadashiParanaCardProps) {
  const ll = LABELS[locale] || LABELS.en;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const dateFormatted = useMemo(() => formatDateLocale(paranaDate, locale), [paranaDate, locale]);

  // Parse all times to minutes for the timeline
  const sunriseMin = parseTime(paranaSunrise);
  const hvEndMin = parseTime(paranaHariVasaraEnd);
  const paranaStartMin = parseTime(paranaStart);
  const paranaEndMin = parseTime(paranaEnd);
  const madhStartMin = parseTime(paranaMadhyahnaStart);
  const madhEndMin = parseTime(paranaMadhyahnaEnd);
  const dwEndMin = parseTime(paranaDwadashiEnd);

  // Timeline range: sunrise to dwadashi end (or a bit beyond)
  const timelineStart = sunriseMin;
  const timelineEnd = Math.max(dwEndMin, madhEndMin) + 15; // 15 min padding
  const totalSpan = timelineEnd - timelineStart;

  const pct = (min: number) => {
    const p = ((min - timelineStart) / totalSpan) * 100;
    return Math.max(0, Math.min(100, p));
  };

  // Determine if HV end and sunrise are the same (HV already over at sunrise)
  const hvSameAsSunrise = paranaSunrise === paranaHariVasaraEnd;

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] via-transparent to-emerald-500/[0.02] p-5 sm:p-6 transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Sunrise className="w-5 h-5 text-amber-400" />
          <h2
            className="text-amber-200 text-lg font-bold tracking-wide"
            style={headingFont}
          >
            {ll.title}
          </h2>
        </div>
        <span className="text-[11px] font-mono text-text-secondary/40 bg-bg-tertiary/50 px-2 py-0.5 rounded border border-white/5">
          24h
        </span>
      </div>
      <p className="text-text-secondary/50 text-xs mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {ll.subtitle}
      </p>
      <p
        className="text-xl sm:text-2xl font-black text-gold-light mb-5"
        style={headingFont}
      >
        {dateFormatted}
      </p>

      {/* Early end warning */}
      {paranaEarlyEnd && (
        <div className="mb-4 p-3 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <p className="text-rose-300/90 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {ll.earlyEndWarning}
          </p>
        </div>
      )}

      {/* ═══ Visual Timeline Bar ═══ */}
      <div className="mb-6">
        <div className="relative h-8 rounded-lg overflow-hidden bg-bg-tertiary/40 border border-white/5">
          {/* Hari Vasara segment (sunrise → HV end) — blue */}
          {!hvSameAsSunrise && (
            <div
              className="absolute top-0 bottom-0 bg-blue-500/30 border-r border-blue-400/40"
              style={{ left: `${pct(sunriseMin)}%`, width: `${pct(hvEndMin) - pct(sunriseMin)}%` }}
            />
          )}

          {/* Parana window (paranaStart → paranaEnd) — green */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-500/35 border-x border-emerald-400/50"
            style={{ left: `${pct(paranaStartMin)}%`, width: `${pct(paranaEndMin) - pct(paranaStartMin)}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold text-emerald-200 uppercase tracking-widest whitespace-nowrap">
                {ll.parana}
              </span>
            </div>
          </div>

          {/* Madhyahna segment — red */}
          <div
            className="absolute top-0 bottom-0 bg-rose-500/25 border-x border-rose-400/30"
            style={{ left: `${pct(madhStartMin)}%`, width: `${pct(madhEndMin) - pct(madhStartMin)}%` }}
          />

          {/* Post-madhyahna acceptable zone (madhEndMin → dwEndMin) — amber */}
          {madhEndMin < dwEndMin && (
            <div
              className="absolute top-0 bottom-0 bg-amber-500/15 border-x border-amber-400/20"
              style={{ left: `${pct(madhEndMin)}%`, width: `${pct(dwEndMin) - pct(madhEndMin)}%` }}
            />
          )}

          {/* Dwadashi end marker */}
          <div
            className="absolute top-0 bottom-0 w-px bg-amber-400/60"
            style={{ left: `${pct(dwEndMin)}%` }}
          />
        </div>

        {/* Timeline labels below the bar */}
        <div className="relative h-10 mt-1 text-[9px] sm:text-[10px] font-mono">
          {/* Sunrise */}
          <div className="absolute flex flex-col items-center" style={{ left: `${pct(sunriseMin)}%`, transform: 'translateX(-50%)' }}>
            <div className="w-px h-2 bg-text-secondary/30" />
            <span className="text-text-secondary/50 whitespace-nowrap">{paranaSunrise}</span>
          </div>

          {/* HV End (only if different from sunrise) */}
          {!hvSameAsSunrise && (
            <div className="absolute flex flex-col items-center" style={{ left: `${pct(hvEndMin)}%`, transform: 'translateX(-50%)' }}>
              <div className="w-px h-2 bg-blue-400/50" />
              <span className="text-blue-300/60 whitespace-nowrap">{paranaHariVasaraEnd}</span>
            </div>
          )}

          {/* Madhyahna start */}
          <div className="absolute flex flex-col items-center" style={{ left: `${pct(madhStartMin)}%`, transform: 'translateX(-50%)' }}>
            <div className="w-px h-2 bg-rose-400/50" />
            <span className="text-rose-300/60 whitespace-nowrap">{paranaMadhyahnaStart}</span>
          </div>

          {/* Dwadashi end */}
          <div className="absolute flex flex-col items-center" style={{ left: `${pct(dwEndMin)}%`, transform: 'translateX(-50%)' }}>
            <div className="w-px h-2 bg-amber-400/50" />
            <span className="text-amber-300/60 whitespace-nowrap">{paranaDwadashiEnd}</span>
          </div>
        </div>

        {/* Legend row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] text-text-secondary/50">
          {!hvSameAsSunrise && (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/40 border border-blue-400/30" />
              {ll.hariVasara}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-400/30" />
            {ll.parana}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/30 border border-rose-400/30" />
            {ll.madhyahna}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/20 border border-amber-400/20" />
            {ll.acceptable}
          </span>
        </div>
      </div>

      {/* ═══ Big Parana Window ═══ */}
      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider" style={headingFont}>
            {ll.paranaWindow}
          </span>
        </div>
        <div className="mb-1">
          <span className="text-3xl font-black tracking-tight text-emerald-200 font-mono">
            {paranaStart}
          </span>
          <span className="text-emerald-400/40 text-3xl font-light mx-2">&mdash;</span>
          <span className="text-3xl font-black tracking-tight text-emerald-200 font-mono">
            {paranaEnd}
          </span>
        </div>
        <p className="text-emerald-300/60 text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {ll.breakFast}
        </p>
      </div>

      {/* ═══ Rules Checklist ═══ */}
      <div className="space-y-2.5">
        <h3 className="text-text-secondary/60 text-xs font-bold uppercase tracking-wider mb-2" style={headingFont}>
          {ll.rules}
        </h3>

        {/* Rule 1: After sunrise */}
        <RuleRow
          ok
          label={`${ll.afterSunrise} (${paranaSunrise})`}
          isDevanagari={isDevanagari}
        />

        {/* Rule 2: After Hari Vasara */}
        <RuleRow
          ok
          label={`${ll.afterHariVasara} (${paranaHariVasaraEnd})`}
          note={ll.hariVasaraNote}
          isDevanagari={isDevanagari}
        />

        {/* Rule 3: NOT during Madhyahna */}
        <RuleRow
          ok={false}
          label={`${ll.notDuringMadhyahna} (${paranaMadhyahnaStart} — ${paranaMadhyahnaEnd})`}
          note={ll.madhyahnaNote}
          isDevanagari={isDevanagari}
        />

        {/* Rule 4: Before Dwadashi ends */}
        <RuleRow
          ok
          label={`${ll.beforeDwadashi} (${paranaDwadashiEnd})`}
          note={ll.dwadashiNote}
          isDevanagari={isDevanagari}
        />
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-amber-500/10">
        <p className="text-[10px] text-text-secondary/40 font-mono">
          {ll.format24h}
        </p>
      </div>
    </div>
  );
}

function RuleRow({
  ok,
  label,
  note,
  isDevanagari,
}: {
  ok: boolean;
  label: string;
  note?: string;
  isDevanagari: boolean;
}) {
  return (
    <div className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${
      ok
        ? 'border-emerald-500/10 bg-emerald-500/[0.03]'
        : 'border-rose-500/15 bg-rose-500/[0.04]'
    }`}>
      {ok ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
      )}
      <div className="min-w-0">
        <p className={`text-sm font-medium ${ok ? 'text-emerald-200/80' : 'text-rose-200/80'}`}
          style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
        >
          {label}
        </p>
        {note && (
          <p className="text-[11px] text-text-secondary/40 leading-relaxed mt-0.5"
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
