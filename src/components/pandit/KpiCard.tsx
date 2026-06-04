'use client';

import Link from 'next/link';

/**
 * Small dashboard tile with number, label, sublabel, "Open →" link.
 * Used on the Pandit dashboard home for 4-up triage row.
 * Spec §18.1 + §24.
 */

interface Props {
  label: string;
  count: number | string;
  sublabel?: string;
  href?: string;
  tone?: 'default' | 'critical' | 'notable' | 'info';
  icon?: React.ReactNode;
}

const TONE_STYLES = {
  default: {
    border: 'border-gold-primary/15',
    countColor: 'text-gold-light',
    hoverBorder: 'hover:border-gold-primary/40',
  },
  critical: {
    border: 'border-[color:var(--color-alert-critical)]/30',
    countColor: 'text-[color:var(--color-alert-critical)]',
    hoverBorder: 'hover:border-[color:var(--color-alert-critical)]/60',
  },
  notable: {
    border: 'border-[color:var(--color-alert-notable)]/30',
    countColor: 'text-[color:var(--color-alert-notable)]',
    hoverBorder: 'hover:border-[color:var(--color-alert-notable)]/60',
  },
  info: {
    border: 'border-[color:var(--color-alert-info)]/30',
    countColor: 'text-[color:var(--color-alert-info)]',
    hoverBorder: 'hover:border-[color:var(--color-alert-info)]/60',
  },
};

export default function KpiCard({ label, count, sublabel, href, tone = 'default', icon }: Props) {
  const tone_ = TONE_STYLES[tone];
  const inner = (
    <div
      className={`
        h-full rounded-2xl border ${tone_.border} ${tone_.hoverBorder}
        bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27]
        p-5 flex flex-col justify-between gap-2 transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-primary/5
      `}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-text-secondary font-semibold">
          {label}
        </span>
        {icon && <span className="opacity-50">{icon}</span>}
      </div>
      <div className={`text-3xl font-bold ${tone_.countColor} tabular-nums leading-none`}>
        {count}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-secondary">{sublabel}</span>
        {href && (
          <span className="text-[11px] text-gold-primary group-hover:text-gold-light transition flex items-center gap-0.5">
            Open
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href as never} className="group block h-full">
        {inner}
      </Link>
    );
  }
  return <div className="group h-full">{inner}</div>;
}
