'use client';
import { tl } from '@/lib/utils/trilingual';

import { useMemo } from 'react';
import { Sunrise, MapPin } from 'lucide-react';
import type { ParanaRule } from '@/lib/constants/puja-vidhi/types';
import { computeParana } from '@/lib/puja/parana-compute';
import { formatMuhurtaTime, muhurtaDurationMinutes } from '@/lib/puja/muhurta-compute';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface ParanaDisplayProps {
  parana: ParanaRule;
  vratDate: Date;
  lat: number;
  lng: number;
  timezoneOffset: number;
  locationName: string;
  timezone: string;
  locale: Locale;
  tithiEndDate?: Date;
}

const LABELS = {
  title: { en: 'Parana (Break Fast)', hi: 'पारण', sa: 'पारणम्' },
  nextDay: { en: 'Next Day', hi: 'अगला दिन', sa: 'परदिनम्' },
  duration: { en: 'Window', hi: 'समय सीमा', sa: 'कालावधिः' },
  breakFastBetween: {
    en: 'Break your fast between',
    hi: 'इस समय के बीच व्रत खोलें',
    sa: 'अस्मिन् काले व्रतं भञ्जयतु',
  },
} as const;

function formatDuration(start: Date, end: Date): string {
  const totalMin = Math.round(muhurtaDurationMinutes(start, end));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatNextDayDate(vratDate: Date, locale: Locale): string {
  const nextDay = new Date(vratDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };

  const loc = isDevanagariLocale(locale) ? 'hi-IN' : 'en-US';
  try {
    return nextDay.toLocaleDateString(loc, options);
  } catch {
    return nextDay.toLocaleDateString('en-US', options);
  }
}

export default function ParanaDisplay({
  parana,
  vratDate,
  lat,
  lng,
  timezoneOffset,
  locationName,
  timezone,
  locale,
  tithiEndDate,
}: ParanaDisplayProps) {
  const computed = useMemo(
    () => computeParana(parana, vratDate, lat, lng, timezoneOffset, tithiEndDate),
    [parana, vratDate, lat, lng, timezoneOffset, tithiEndDate],
  );

  const tzAbbr = useMemo(() => {
    try {
      const parts = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'short',
      }).formatToParts(computed.start);
      return parts.find((p) => p.type === 'timeZoneName')?.value ?? timezone;
    } catch {
      return timezone;
    }
  }, [timezone, computed.start]);

  const startTime = formatMuhurtaTime(computed.start);
  const endTime = formatMuhurtaTime(computed.end);
  const duration = formatDuration(computed.start, computed.end);
  const nextDayStr = formatNextDayDate(vratDate, locale);

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-transparent p-5 transition-all duration-500">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sunrise className="w-4 h-4 text-amber-400/70" />
          <span className="text-amber-300 text-sm font-semibold tracking-wide">
            {tl(LABELS.title, locale)}
          </span>
        </div>

        {/* Next-day date badge */}
        <span className="text-xs font-medium text-amber-400/60 bg-amber-500/10 border border-amber-500/15 px-2.5 py-1 rounded-full">
          {tl(LABELS.nextDay, locale)} &middot; {nextDayStr}
        </span>
      </div>

      {/* Instruction text */}
      <p className="text-xs text-text-secondary/70 mb-2">
        {tl(LABELS.breakFastBetween, locale)}
      </p>

      {/* Big time display */}
      <div className="mb-3">
        <span className="text-2xl font-black tracking-tight text-amber-200">
          {startTime}
        </span>
        <span className="text-text-secondary/65 text-2xl font-light mx-2">&mdash;</span>
        <span className="text-2xl font-black tracking-tight text-amber-200">
          {endTime}
        </span>
      </div>

      {/* Duration + Location row */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-secondary/75">
        <span>
          {tl(LABELS.duration, locale)}:{' '}
          <span className="text-text-secondary/80 font-medium">{duration}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {locationName} ({tzAbbr})
        </span>
      </div>

      {/* Parana description */}
      <div className="mt-4 pt-3 border-t border-amber-500/10">
        <p className="text-xs text-text-secondary/70 leading-relaxed">
          {parana.description[locale]}
        </p>
      </div>
    </div>
  );
}
