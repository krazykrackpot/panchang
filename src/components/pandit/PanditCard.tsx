'use client';

import Link from 'next/link';
import { type MockClient, relativeTimeSince } from '@/lib/pandit/mock-fixtures';
import LifecycleBadgePair from './LifecycleBadgePair';

/**
 * Roster card — primary client representation in the visual card-grid view.
 * Spec §18.2 + §24.
 *
 * Tarot-card-shaped vertical card with avatar, name, janma rashi, current
 * dasha, last consult, lifecycle badges, critical-alerts ribbon.
 *
 * Renders 4-up on desktop, 1-up on mobile per spec §16.3.
 */

interface Props {
  client: MockClient;
  href: string;
}

export default function PanditCard({ client, href }: Props) {
  const hasCritical = client.critical_alerts > 0;
  const hasNotable = client.notable_alerts > 0;

  return (
    <Link
      href={href as never}
      className="group relative block"
      aria-label={`Open ${client.full_name}`}
    >
      <div
        className="
          relative h-full rounded-2xl border transition-all duration-200
          bg-gradient-to-br from-[#1a1f4e]/60 via-[#111638]/70 to-[#0a0e27]
          border-gold-primary/12
          hover:border-gold-primary/40 hover:-translate-y-1 hover:shadow-xl
          hover:shadow-gold-primary/5
        "
      >
        {/* Critical alert ribbon (top-right) */}
        {hasCritical && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[color:var(--color-alert-critical)]/20 border border-[color:var(--color-alert-critical)]/40">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-alert-critical)] animate-pulse"
              aria-hidden
            />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[color:var(--color-alert-critical)]">
              {client.critical_alerts} critical
            </span>
          </div>
        )}

        <div className="p-5 flex flex-col gap-3 h-full">
          {/* Avatar + name block */}
          <div className="flex items-start gap-3">
            <div
              className="flex-none w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-sm"
              style={{ backgroundColor: client.avatar_color }}
              aria-hidden
            >
              {client.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-text-primary leading-tight truncate"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {client.display_label ?? client.full_name}
              </h3>
              <p className="text-[11px] text-text-secondary tabular-nums mt-0.5">
                {client.janma_rashi_en} {client.janma_rashi_degrees} · age {client.age}
              </p>
            </div>
          </div>

          {/* Janma rashi (Devanagari for the reverence beat) */}
          <div className="text-[12px] text-text-secondary leading-snug">
            <span
              className="text-[color:var(--color-text-devanagari)]"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              {client.janma_rashi_hi}
            </span>{' '}
            · <span className="text-text-secondary">{client.nakshatra_en}</span>
          </div>

          {/* Current dasha */}
          <div className="rounded-lg bg-bg-primary/40 border border-gold-primary/8 p-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] uppercase tracking-wider text-text-tertiary">
                Mahā / Antar
              </span>
              {hasNotable && !hasCritical && (
                <span className="text-[10px] text-[color:var(--color-alert-notable)]">
                  {client.notable_alerts} notable
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-gold-light text-[13px] font-medium">
                {client.current_maha_lord_en}
              </span>
              <span className="text-text-tertiary text-[11px]">/</span>
              <span className="text-text-primary text-[13px]">
                {client.current_antar_lord_en}
              </span>
            </div>
            <div
              className="text-[11px] text-text-tertiary tabular-nums mt-0.5"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              {client.current_maha_lord_hi} / {client.current_antar_lord_hi}
            </div>
          </div>

          {/* Last consult + badges */}
          <div className="mt-auto pt-2 space-y-2.5">
            <div className="text-[11px] text-text-secondary">
              Last consult:{' '}
              <span className="text-text-primary">
                {relativeTimeSince(client.last_consult_at)}
              </span>
            </div>
            <LifecycleBadgePair
              engagement={client.engagement_state}
              link={client.link_state}
              size="sm"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
