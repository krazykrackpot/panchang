'use client';

/**
 * Production sticky context strip for the client detail page.
 * Spec §18.3 + §24.
 *
 * Variant of src/components/pandit/StickyContextStrip.tsx that consumes
 * the canonical PanditClient type instead of MockClient. Visual design
 * unchanged.
 *
 * Computed fields (age, current dasha) source from the chart engine
 * wired in P3; for P2 we show what's available on the client record
 * directly. The Maha/Antar lords appear as "—" until P3 wires the
 * dasha computation.
 */

import {
  type PanditClient,
  clientInitials,
  ageFromBirthDate,
  relativeTimeSince,
  relativeTimeUntil,
} from '@/lib/pandit/types';
import LifecycleBadgePair from './LifecycleBadgePair';

interface Props {
  client: PanditClient;
  currentDashaSummary?: {
    mahaLord?: string;
    antarLord?: string;
    pratyantarLord?: string;
  };
}

function avatarColorForId(id: string): string {
  const palette = [
    '#5a3aa3', '#3aa370', '#d4a853', '#c97a4a',
    '#5a8ad9', '#8c66d9', '#c79a4a', '#3a4566',
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
}

export default function PanditStickyContextStrip({ client, currentDashaSummary }: Props) {
  const initials = clientInitials(client.full_name);
  const age = ageFromBirthDate(client.birth_data.date);
  const color = client.color || avatarColorForId(client.id);

  return (
    <div
      className="
        sticky top-0 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6
        backdrop-blur-md
        bg-gradient-to-b from-bg-primary/95 via-bg-primary/90 to-bg-primary/70
        border-b border-gold-primary/12
      "
    >
      <div className="max-w-7xl mx-auto py-4 flex items-center gap-4">
        <div
          className="flex-none w-14 h-14 rounded-full flex items-center justify-center font-semibold text-white text-base"
          style={{ backgroundColor: color }}
          aria-hidden
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <h1
              className="text-xl font-bold text-gold-light truncate"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {client.display_label ?? client.full_name}
            </h1>
            <LifecycleBadgePair
              engagement={client.engagement_state}
              link={client.link_state}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[12px] text-text-secondary">
            <span>
              Born <span className="tabular-nums text-text-primary">{client.birth_data.date}</span>
              {client.birth_data.time && (
                <>
                  ,{' '}
                  <span className="tabular-nums text-text-primary">{client.birth_data.time}</span>
                  {client.birth_data.time_estimated && (
                    <span
                      className="ml-1 text-[10px] text-[color:var(--color-link-paused)] uppercase tracking-wider"
                      title="Birth time is approximate"
                    >
                      ~est
                    </span>
                  )}
                </>
              )}
            </span>
            {age !== null && (
              <>
                <span className="text-text-tertiary">·</span>
                <span>Age <span className="text-text-primary">{age}</span></span>
              </>
            )}
            <span className="text-text-tertiary">·</span>
            <span className="truncate max-w-xs">{client.birth_data.place}</span>
            {currentDashaSummary?.mahaLord && (
              <>
                <span className="text-text-tertiary">·</span>
                <span>
                  MD{' '}
                  <span className="text-gold-light font-medium">
                    {currentDashaSummary.mahaLord}
                  </span>
                  {currentDashaSummary.antarLord && (
                    <>
                      {' / '}AD{' '}
                      <span className="text-text-primary">{currentDashaSummary.antarLord}</span>
                    </>
                  )}
                  {currentDashaSummary.pratyantarLord && (
                    <>
                      {' / '}PD{' '}
                      <span className="text-text-secondary">
                        {currentDashaSummary.pratyantarLord}
                      </span>
                    </>
                  )}
                </span>
              </>
            )}
          </div>

          <div className="flex items-baseline gap-3 text-[11px] text-text-tertiary mt-1">
            <span>
              Last consult:{' '}
              <span className="text-text-secondary">
                {relativeTimeSince(client.last_consult_at)}
              </span>
            </span>
          </div>
        </div>

        <button
          className="
            flex-none p-2 rounded-lg text-text-secondary
            hover:bg-bg-secondary hover:text-gold-light transition cursor-pointer
          "
          aria-label="Client menu"
        >
          ⋮
        </button>
      </div>
    </div>
  );
}
