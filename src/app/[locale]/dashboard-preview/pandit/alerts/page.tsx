/**
 * Alerts inbox — 3-lane triage by severity.
 * Spec §18.6.
 */

import Link from 'next/link';
import { MOCK_ALERTS } from '@/lib/pandit/mock-fixtures';
import AlertCard from '@/components/pandit/AlertCard';

export default function AlertsInbox() {
  const critical = MOCK_ALERTS.filter((a) => a.severity === 'critical');
  const notable = MOCK_ALERTS.filter((a) => a.severity === 'notable');
  const info = MOCK_ALERTS.filter((a) => a.severity === 'info');
  const unackedCritical = critical.filter((a) => !a.acknowledged_at).length;
  const totalUnacked = MOCK_ALERTS.filter((a) => !a.acknowledged_at).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/en/dashboard-preview/pandit"
          className="text-[12px] text-text-secondary hover:text-gold-light transition mb-2 inline-block"
        >
          ← Dashboard
        </Link>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mt-1">
          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-light"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Alerts inbox
          </h1>
          <p className="text-[13px] text-text-secondary">
            <span className="text-text-primary font-medium">{totalUnacked}</span> unacked across {MOCK_ALERTS.length} alerts
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3 text-[12px]">
        <FilterChip label="All clients" muted />
        <FilterChip label="All kinds" muted />
        <FilterChip label="Unacked only" active />
      </div>

      {/* Lane: Critical */}
      <Lane
        title="Critical"
        count={critical.length}
        unacked={unackedCritical}
        tone="critical"
      >
        <div className="text-[11px] uppercase tracking-wider text-text-tertiary font-semibold mb-3">
          Today
        </div>
        <div className="space-y-3 mb-6">
          {critical.slice(0, 2).map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>

        {critical.length > 2 && (
          <>
            <div className="text-[11px] uppercase tracking-wider text-text-tertiary font-semibold mb-3">
              This week
            </div>
            <div className="space-y-3">
              {critical.slice(2).map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
            </div>
          </>
        )}
      </Lane>

      <Lane title="Notable" count={notable.length} unacked={notable.length} tone="notable">
        <div className="space-y-3">
          {notable.map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>
      </Lane>

      <Lane title="Info" count={info.length} unacked={info.length} tone="info">
        <div className="space-y-3">
          {info.map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>
      </Lane>

      {/* Footer actions */}
      <div className="mt-8 pt-6 border-t border-gold-primary/10 flex flex-wrap items-center gap-3 text-[12px]">
        <button
          className="
            px-4 py-2 rounded-lg
            bg-gold-primary/15 text-gold-light border border-gold-primary/30
            hover:bg-gold-primary/25 transition
          "
        >
          Mark all critical as noted
        </button>
        <Link
          href="#"
          className="text-text-secondary hover:text-gold-light transition ml-auto"
        >
          Weekly digest settings →
        </Link>
      </div>
    </div>
  );
}

function Lane({
  title,
  count,
  unacked,
  tone,
  children,
}: {
  title: string;
  count: number;
  unacked: number;
  tone: 'critical' | 'notable' | 'info';
  children: React.ReactNode;
}) {
  const toneColor = {
    critical: 'text-[color:var(--color-alert-critical)]',
    notable: 'text-[color:var(--color-alert-notable)]',
    info: 'text-[color:var(--color-alert-info)]',
  }[tone];

  return (
    <section className="mb-8">
      <div className="flex items-baseline gap-3 mb-4">
        <h2
          className={`text-xl font-bold ${toneColor} uppercase tracking-wider`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
        <span className="text-[13px] text-text-secondary">
          ({unacked} unacked of {count})
        </span>
      </div>
      {children}
    </section>
  );
}

function FilterChip({ label, active, muted }: { label: string; active?: boolean; muted?: boolean }) {
  let classes = 'px-3 py-1.5 rounded-full text-[12px] cursor-pointer transition border';
  if (active) {
    classes += ' bg-gold-primary/20 text-gold-light border-gold-primary/40';
  } else {
    classes += ' text-text-secondary border-gold-primary/15 hover:border-gold-primary/30';
    if (muted) classes += ' border-dashed';
  }
  return <button className={classes}>{label}</button>;
}
