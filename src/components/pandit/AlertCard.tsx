'use client';

import { type MockAlert, relativeTimeUntil } from '@/lib/pandit/mock-fixtures';

/**
 * Single alert card with full context + 4 inline actions.
 * Spec §18.1 + §18.6 + §24.
 *
 * Each card carries everything a Pandit needs to triage: kind, who, when,
 * why (1-sentence context), and the 4 actions. No drilling required.
 */

const SEVERITY_STYLES = {
  critical: {
    border: 'border-[color:var(--color-alert-critical)]/35',
    bg: 'bg-[color:var(--color-alert-critical)]/8',
    dot: 'bg-[color:var(--color-alert-critical)]',
    label: 'CRITICAL',
    labelColor: 'text-[color:var(--color-alert-critical)]',
  },
  notable: {
    border: 'border-[color:var(--color-alert-notable)]/30',
    bg: 'bg-[color:var(--color-alert-notable)]/8',
    dot: 'bg-[color:var(--color-alert-notable)]',
    label: 'NOTABLE',
    labelColor: 'text-[color:var(--color-alert-notable)]',
  },
  info: {
    border: 'border-[color:var(--color-alert-info)]/25',
    bg: 'bg-[color:var(--color-alert-info)]/8',
    dot: 'bg-[color:var(--color-alert-info)]',
    label: 'INFO',
    labelColor: 'text-[color:var(--color-alert-info)]',
  },
};

interface Props {
  alert: MockAlert;
  compact?: boolean;
}

export default function AlertCard({ alert, compact = false }: Props) {
  const s = SEVERITY_STYLES[alert.severity];
  const acked = !!alert.acknowledged_at;
  const opacity = acked ? 'opacity-60' : '';

  return (
    <div
      className={`
        rounded-xl border ${s.border} ${s.bg} p-4 transition-all
        hover:brightness-110 ${opacity}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-2 h-2 rounded-full ${s.dot} mt-2 flex-none ${alert.severity === 'critical' && !acked ? 'animate-pulse' : ''}`}
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${s.labelColor}`}
            >
              {s.label}
            </span>
            <span className="text-text-tertiary text-[10px]">·</span>
            <span className="text-[11px] text-text-secondary">
              {alert.client_full_name}
            </span>
            <span className="text-text-tertiary text-[10px]">·</span>
            <span className="text-[11px] text-text-tertiary tabular-nums">
              {relativeTimeUntil(alert.fires_at)}
            </span>
          </div>

          <h4
            className="font-medium text-text-primary leading-snug mb-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {alert.title_en}
          </h4>

          {alert.title_hi && (
            <p
              className="text-[13px] text-[color:var(--color-text-devanagari)] leading-snug mb-2"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              {alert.title_hi}
            </p>
          )}

          {!compact && (
            <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
              {alert.context}
            </p>
          )}

          {!compact && (
            <div className="flex flex-wrap gap-2">
              <button
                className="
                  px-3 py-1.5 rounded-lg text-[11px] font-medium
                  bg-gold-primary/15 text-gold-light border border-gold-primary/30
                  hover:bg-gold-primary/25 transition cursor-pointer
                "
              >
                Open chart
              </button>
              <button
                className="
                  px-3 py-1.5 rounded-lg text-[11px] font-medium
                  bg-[color:var(--color-pandit-violet)]/20 text-[color:var(--color-pandit-violet-light)]
                  border border-[color:var(--color-pandit-violet)]/30
                  hover:bg-[color:var(--color-pandit-violet)]/30 transition cursor-pointer
                "
              >
                Draft tippanni
              </button>
              <button
                className="
                  px-3 py-1.5 rounded-lg text-[11px] font-medium
                  bg-bg-secondary text-text-secondary border border-gold-primary/15
                  hover:border-gold-primary/30 transition cursor-pointer
                "
              >
                {acked ? '✓ Noted' : 'Note ✓'}
              </button>
              <button
                className="
                  px-3 py-1.5 rounded-lg text-[11px] font-medium
                  text-text-tertiary border border-gold-primary/10
                  hover:text-text-secondary hover:border-gold-primary/20 transition cursor-pointer
                "
              >
                Snooze
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
