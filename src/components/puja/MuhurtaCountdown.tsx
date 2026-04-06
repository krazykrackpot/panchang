'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import type { ComputedMuhurta } from '@/lib/puja/muhurta-compute';
import { formatMuhurtaTime, muhurtaDurationMinutes } from '@/lib/puja/muhurta-compute';
import type { Locale } from '@/types/panchang';

interface MuhurtaCountdownProps {
  muhurta: ComputedMuhurta;
  locationName: string;
  timezone: string;
  locale: Locale;
}

type MuhurtaStatus = 'upcoming' | 'active' | 'passed';

const LABELS = {
  title: { en: 'Puja Muhurta', hi: 'पूजा मुहूर्त', sa: 'पूजामुहूर्तम्' },
  duration: { en: 'Duration', hi: 'अवधि', sa: 'कालावधिः' },
  startsIn: { en: 'Starts in', hi: 'शुरू होने में', sa: 'आरम्भे शेषम्' },
  happeningNow: { en: 'Happening Now', hi: 'अभी चल रहा है', sa: 'सम्प्रति प्रवर्तते' },
  passed: { en: 'Muhurta has passed', hi: 'मुहूर्त बीत चुका है', sa: 'मुहूर्तं व्यतीतम्' },
} as const;

function getStatus(start: Date, end: Date, now: Date): MuhurtaStatus {
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'active';
  return 'passed';
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0m';
  const totalMin = Math.ceil(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatDuration(start: Date, end: Date): string {
  const totalMin = Math.round(muhurtaDurationMinutes(start, end));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function MuhurtaCountdown({
  muhurta,
  locationName,
  timezone,
  locale,
}: MuhurtaCountdownProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const status = getStatus(muhurta.start, muhurta.end, now);
  const loc = locale;

  // Timezone abbreviation from IANA timezone
  const tzAbbr = (() => {
    try {
      const parts = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'short',
      }).formatToParts(now);
      return parts.find((p) => p.type === 'timeZoneName')?.value ?? timezone;
    } catch {
      return timezone;
    }
  })();

  const startTime = formatMuhurtaTime(muhurta.start);
  const endTime = formatMuhurtaTime(muhurta.end);
  const duration = formatDuration(muhurta.start, muhurta.end);

  const borderColor =
    status === 'active'
      ? 'border-emerald-500/30'
      : status === 'upcoming'
        ? 'border-gold-primary/25'
        : 'border-gold-primary/10';

  const bgGradient =
    status === 'active'
      ? 'from-emerald-500/[0.06] to-transparent'
      : status === 'upcoming'
        ? 'from-gold-primary/[0.04] to-transparent'
        : 'from-gold-primary/[0.02] to-transparent';

  const opacity = status === 'passed' ? 'opacity-50' : '';

  return (
    <div
      className={`rounded-2xl border ${borderColor} bg-gradient-to-br ${bgGradient} p-5 ${opacity} transition-all duration-500`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold-primary/70" />
          <span className="text-gold-light text-sm font-semibold tracking-wide">
            {LABELS.title[loc]}
          </span>
        </div>

        {/* Status badge */}
        {status === 'active' && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {LABELS.happeningNow[loc]}
          </span>
        )}

        {status === 'passed' && (
          <span className="text-xs text-text-secondary/65 font-medium">
            {LABELS.passed[loc]}
          </span>
        )}
      </div>

      {/* Big time display */}
      <div className="mb-3">
        <span
          className={`text-2xl font-black tracking-tight ${
            status === 'active' ? 'text-emerald-300' : 'text-gold-light'
          }`}
        >
          {startTime}
        </span>
        <span className="text-text-secondary/65 text-2xl font-light mx-2">&mdash;</span>
        <span
          className={`text-2xl font-black tracking-tight ${
            status === 'active' ? 'text-emerald-300' : 'text-gold-light'
          }`}
        >
          {endTime}
        </span>
      </div>

      {/* Duration + Location row */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-secondary/75">
        <span>
          {LABELS.duration[loc]}: <span className="text-text-secondary/80 font-medium">{duration}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {locationName} ({tzAbbr})
        </span>
      </div>

      {/* Countdown — only show if within 24 hours */}
      {status === 'upcoming' && (() => {
        const msUntil = muhurta.start.getTime() - now.getTime();
        const isWithin24h = msUntil > 0 && msUntil < 24 * 60 * 60 * 1000;
        if (!isWithin24h) return null;
        return (
          <div className="mt-4 pt-3 border-t border-gold-primary/10">
            <span className="text-xs text-text-secondary/70">{LABELS.startsIn[loc]}: </span>
            <span className="text-sm font-bold text-gold-primary">
              {formatCountdown(msUntil)}
            </span>
          </div>
        );
      })()}
    </div>
  );
}
