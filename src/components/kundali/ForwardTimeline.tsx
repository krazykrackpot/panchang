'use client';

import { useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import type { TimelineTrigger } from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ForwardTimelineProps {
  triggers: TimelineTrigger[];
  locale: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dotColor(nature: TimelineTrigger['nature']): string {
  switch (nature) {
    case 'opportunity': return '#34d399';
    case 'challenge':   return '#ef4444';
    case 'mixed':       return '#d4a853';
  }
}

function dotBg(nature: TimelineTrigger['nature']): string {
  switch (nature) {
    case 'opportunity': return 'bg-emerald-500/15 border-emerald-500/30';
    case 'challenge':   return 'bg-red-500/15 border-red-500/30';
    case 'mixed':       return 'bg-gold-primary/15 border-gold-primary/30';
  }
}

function fmtDate(iso: string, locale: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === 'hi' ? 'hi-IN' : locale === 'ta' ? 'ta-IN' : locale === 'bn' ? 'bn-IN' : 'en-GB', { month: 'short', year: 'numeric' });
}

const TYPE_LABELS: Record<TimelineTrigger['triggerType'], { en: string; hi: string }> = {
  transit: { en: 'Transit', hi: 'गोचर' },
  dasha_change: { en: 'Dasha', hi: 'दशा' },
  dasha_transit_confluence: { en: 'Confluence', hi: 'संगम' },
};

// ---------------------------------------------------------------------------
// Component — vertical full-width timeline
// ---------------------------------------------------------------------------

export default function ForwardTimeline({ triggers, locale, className }: ForwardTimelineProps) {
  const isHi = locale !== 'en' && locale !== 'ta';

  const sorted = useMemo(
    () =>
      triggers && triggers.length > 0
        ? [...triggers].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        : [],
    [triggers],
  );

  if (sorted.length === 0) {
    return (
      <div className={`flex items-center justify-center py-10 ${className ?? ''}`}>
        <p className="text-sm text-text-secondary italic">
          {isHi ? 'पूर्वानुमान विंडो में कोई प्रमुख ट्रिगर नहीं' : 'No major triggers in the forecast window'}
        </p>
      </div>
    );
  }

  const now = Date.now();

  return (
    <div className={`w-full ${className ?? ''}`}>
      {/* "Now" marker */}
      <div className="flex items-center gap-3 mb-2">
        <div className="relative">
          <span
            className="block w-4 h-4 rounded-full bg-gold-primary"
            style={{ boxShadow: '0 0 8px rgba(212,168,83,0.6)', animation: 'pulse-now 2s ease-in-out infinite' }}
          />
        </div>
        <span className="text-gold-light text-sm font-semibold">
          {isHi ? 'अभी' : 'Now'}
        </span>
      </div>

      {/* Vertical timeline track */}
      <div className="relative ml-2 border-l-2 border-gold-primary/20 pl-6 space-y-0">
        {sorted.map((trigger, i) => {
          const color = dotColor(trigger.nature);
          const bgClass = dotBg(trigger.nature);
          const isPast = new Date(trigger.startDate).getTime() < now;
          const typeLabel = TYPE_LABELS[trigger.triggerType];

          return (
            <div key={`${trigger.startDate}-${i}`} className="relative pb-6 last:pb-0">
              {/* Dot on the timeline track */}
              <div
                className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: isPast ? `${color}40` : color,
                  borderColor: color,
                }}
              />

              {/* Content card — full width */}
              <div className={`rounded-xl border p-4 ${bgClass} ${isPast ? 'opacity-60' : ''}`}>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {/* Date */}
                  <span className="text-sm font-semibold text-text-primary">
                    {fmtDate(trigger.startDate, locale)}
                  </span>

                  {/* Type pill */}
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${color}15`,
                      color,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {isHi ? typeLabel.hi : typeLabel.en}
                  </span>

                  {/* Nature label */}
                  <span className="text-[10px] text-text-secondary/60">
                    {trigger.nature === 'opportunity' ? (isHi ? '● अनुकूल' : '● Favorable')
                      : trigger.nature === 'challenge' ? (isHi ? '● चुनौती' : '● Challenge')
                      : (isHi ? '● मिश्रित' : '● Mixed')}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-text-primary/85 leading-relaxed">
                  {tl(trigger.description, locale)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pulse keyframes */}
      <style>{`
        @keyframes pulse-now {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
