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

/** Map trigger nature to dot color. */
function dotColor(nature: TimelineTrigger['nature']): string {
  switch (nature) {
    case 'opportunity': return '#34d399';
    case 'challenge':   return '#ef4444';
    case 'mixed':       return '#d4a853';
  }
}

/** Format ISO date as "MMM YYYY". */
function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Trigger type to display label. */
const TYPE_LABELS: Record<TimelineTrigger['triggerType'], string> = {
  transit: 'Transit',
  dasha_change: 'Dasha',
  dasha_transit_confluence: 'Confluence',
};

/** Horizontal gap between nodes in px. */
const NODE_GAP = 140;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ForwardTimeline({ triggers, locale, className }: ForwardTimelineProps) {
  // All hooks MUST run unconditionally (Rules of Hooks).
  const sorted = useMemo(
    () =>
      triggers && triggers.length > 0
        ? [...triggers].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        : [],
    [triggers],
  );

  const nowIndex = useMemo(() => {
    if (sorted.length === 0) return 0;
    const now = Date.now();
    const firstMs = new Date(sorted[0].startDate).getTime();
    const lastMs = new Date(sorted[sorted.length - 1].startDate).getTime();
    if (now <= firstMs) return 0;
    if (now >= lastMs) return sorted.length - 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      const curMs = new Date(sorted[i].startDate).getTime();
      const nxtMs = new Date(sorted[i + 1].startDate).getTime();
      if (now >= curMs && now <= nxtMs) {
        return i + (now - curMs) / (nxtMs - curMs);
      }
    }
    return 0;
  }, [sorted]);

  const favorableRanges = useMemo(() => {
    const ranges: { startIdx: number; endIdx: number }[] = [];
    let runStart: number | null = null;
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].nature === 'opportunity') {
        if (runStart === null) runStart = i;
      } else {
        if (runStart !== null && i - 1 > runStart) {
          ranges.push({ startIdx: runStart, endIdx: i - 1 });
        }
        runStart = null;
      }
    }
    if (runStart !== null && sorted.length - 1 > runStart) {
      ranges.push({ startIdx: runStart, endIdx: sorted.length - 1 });
    }
    return ranges;
  }, [sorted]);

  // --- Empty state ---
  if (sorted.length === 0) {
    return (
      <div className={`flex items-center justify-center py-10 ${className ?? ''}`}>
        <p className="text-sm text-text-tertiary">No major triggers in the forecast window</p>
      </div>
    );
  }

  const trackWidth = (sorted.length - 1) * NODE_GAP;
  const nowLeft = nowIndex * NODE_GAP;

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Scrollable container */}
      <div className="scrollbar-hide overflow-x-auto">
        <div
          className="relative flex items-start"
          style={{ minWidth: trackWidth + NODE_GAP + 40, paddingLeft: 20, paddingRight: 20 }}
        >
          {/* Favorable window bars */}
          {favorableRanges.map((r) => (
            <div
              key={`fav-${r.startIdx}`}
              className="absolute rounded-md"
              style={{
                left: r.startIdx * NODE_GAP + 20 - 8,
                width: (r.endIdx - r.startIdx) * NODE_GAP + 16,
                top: 48,
                height: 24,
                background: 'rgba(52,211,153,0.08)',
              }}
            />
          ))}

          {/* Connecting line */}
          <div
            className="absolute"
            style={{
              left: 20,
              width: trackWidth,
              top: 58,
              height: 2,
              background: 'var(--gold-primary, #d4a853)',
              opacity: 0.2,
            }}
          />

          {/* "You are here" marker */}
          <div
            className="absolute flex flex-col items-center"
            style={{ left: nowLeft + 20, top: 28, zIndex: 10 }}
          >
            <span className="text-[10px] font-semibold text-gold-light mb-0.5 whitespace-nowrap">Now</span>
            <span
              className="block rounded-full"
              style={{
                width: 16,
                height: 16,
                background: 'var(--gold-primary, #d4a853)',
                boxShadow: '0 0 8px rgba(212,168,83,0.6)',
                animation: 'pulse-now 2s ease-in-out infinite',
              }}
            />
          </div>

          {/* Nodes */}
          {sorted.map((trigger, i) => {
            const color = dotColor(trigger.nature);
            const left = i * NODE_GAP;
            return (
              <div
                key={`${trigger.startDate}-${i}`}
                className="absolute flex flex-col items-center"
                style={{ left: left + 20, width: NODE_GAP }}
              >
                {/* Date */}
                <span className="text-[11px] text-text-tertiary whitespace-nowrap mb-1">
                  {fmtDate(trigger.startDate)}
                </span>

                {/* Dot */}
                <span
                  className="block rounded-full transition-shadow duration-200"
                  style={{
                    width: 12,
                    height: 12,
                    background: color,
                    boxShadow: `0 0 0 0 ${color}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 10px 3px ${color}40`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${color}`;
                  }}
                />

                {/* Description */}
                <span className="mt-1.5 text-[11px] text-text-secondary text-center leading-tight max-w-[120px] line-clamp-3">
                  {tl(trigger.description, locale)}
                </span>

                {/* Type pill */}
                <span
                  className="mt-1 text-[9px] px-1.5 py-px rounded-full whitespace-nowrap"
                  style={{
                    background: `${color}15`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {TYPE_LABELS[trigger.triggerType]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Spacer for node content overflow */}
        <div style={{ height: 100 }} />
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
