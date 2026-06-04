'use client';

import { type MockClient, relativeTimeSince, relativeTimeUntil } from '@/lib/pandit/mock-fixtures';
import LifecycleBadgePair from './LifecycleBadgePair';

/**
 * Always-visible client identity strip on every client subpage.
 * Spec §18.3 + §24.
 *
 * Sticky to top of viewport. Anchors the Pandit's mental model — showing
 * current dasha + age + last consult lets the Pandit speak knowledgeably
 * about the client without scrolling.
 *
 * On scroll past a threshold, collapses to a single line via CSS only
 * (sticky position + scaling). Implementation here is the full version;
 * a collapsed-on-scroll variant is a follow-up.
 */

interface Props {
  client: MockClient;
}

export default function StickyContextStrip({ client }: Props) {
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
        {/* Avatar */}
        <div
          className="flex-none w-14 h-14 rounded-full flex items-center justify-center font-semibold text-white text-base"
          style={{ backgroundColor: client.avatar_color }}
          aria-hidden
        >
          {client.initials}
        </div>

        {/* Identity + dasha */}
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
            <span className="text-text-tertiary">·</span>
            <span>Age <span className="text-text-primary">{client.age}</span></span>
            <span className="text-text-tertiary">·</span>
            <span>
              <span
                className="text-[color:var(--color-text-devanagari)]"
                style={{ fontFamily: 'var(--font-devanagari-body)' }}
              >
                {client.janma_rashi_hi}
              </span>{' '}
              <span className="text-text-primary">{client.janma_rashi_degrees}</span>
            </span>
            <span className="text-text-tertiary">·</span>
            <span>
              MD <span className="text-gold-light font-medium">{client.current_maha_lord_en}</span>
              {' / '}
              AD <span className="text-text-primary">{client.current_antar_lord_en}</span>
              {client.current_pratyantar_lord_en && (
                <>
                  {' / '}
                  PD <span className="text-text-secondary">{client.current_pratyantar_lord_en}</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-baseline gap-3 text-[11px] text-text-tertiary mt-1">
            <span>
              Last consult:{' '}
              <span className="text-text-secondary">{relativeTimeSince(client.last_consult_at)}</span>
            </span>
            {client.next_followup_at && (
              <>
                <span>·</span>
                <span>
                  Next follow-up:{' '}
                  <span className="text-gold-primary">{relativeTimeUntil(client.next_followup_at)}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Menu */}
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
