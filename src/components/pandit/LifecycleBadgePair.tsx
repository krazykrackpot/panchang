'use client';

import { type LinkState, type EngagementState } from '@/lib/pandit/mock-fixtures';

/**
 * Two pills side-by-side: engagement (left) + link (right).
 * Spec §3.3 + §19.1.
 *
 * Both are intentionally tappable in the production build (open menu to
 * change state). In the prototype, click is a no-op — interaction
 * affordance comes through hover style + cursor.
 */

const ENGAGEMENT_STYLES: Record<EngagementState, { label: string; bg: string; text: string; dot: string }> = {
  prospect: {
    label: 'Prospect',
    bg: 'bg-[color:var(--color-state-prospect)]/15',
    text: 'text-[color:var(--color-state-prospect)]',
    dot: 'bg-[color:var(--color-state-prospect)]',
  },
  active: {
    label: 'Active',
    bg: 'bg-[color:var(--color-state-active)]/15',
    text: 'text-[color:var(--color-state-active)]',
    dot: 'bg-[color:var(--color-state-active)]',
  },
  past: {
    label: 'Past',
    bg: 'bg-[color:var(--color-state-past)]/15',
    text: 'text-[color:var(--color-state-past)]',
    dot: 'bg-[color:var(--color-state-past)]',
  },
  archived: {
    label: 'Archived',
    bg: 'bg-[color:var(--color-state-archived)]/12',
    text: 'text-[color:var(--color-state-archived)]',
    dot: 'bg-[color:var(--color-state-archived)]',
  },
};

const LINK_STYLES: Record<LinkState, { label: string; bg: string; text: string; icon: string }> = {
  unlinked: {
    label: 'Unlinked',
    bg: 'bg-[color:var(--color-link-unlinked)]/15',
    text: 'text-[color:var(--color-link-unlinked)]',
    icon: '✎',
  },
  invited: {
    label: 'Invited',
    bg: 'bg-[color:var(--color-link-invited)]/15',
    text: 'text-[color:var(--color-link-invited)]',
    icon: '✉',
  },
  linked: {
    label: 'Linked',
    bg: 'bg-[color:var(--color-link-linked)]/15',
    text: 'text-[color:var(--color-link-linked)]',
    icon: '🔗',
  },
  paused: {
    label: 'Paused',
    bg: 'bg-[color:var(--color-link-paused)]/15',
    text: 'text-[color:var(--color-link-paused)]',
    icon: '⏸',
  },
  declined: {
    label: 'Declined',
    bg: 'bg-[color:var(--color-link-declined)]/15',
    text: 'text-[color:var(--color-link-declined)]',
    icon: '✕',
  },
};

interface Props {
  engagement: EngagementState;
  link: LinkState;
  size?: 'sm' | 'md';
}

export default function LifecycleBadgePair({ engagement, link, size = 'md' }: Props) {
  const e = ENGAGEMENT_STYLES[engagement];
  const l = LINK_STYLES[link];

  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-2 py-0.5 gap-1'
      : 'text-[11px] px-2.5 py-1 gap-1.5';

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-flex items-center ${sizeClasses} rounded-full font-medium uppercase tracking-wider ${e.bg} ${e.text} cursor-pointer hover:brightness-125 transition`}
        title={`Engagement: ${e.label}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${e.dot}`} aria-hidden />
        {e.label}
      </span>
      <span
        className={`inline-flex items-center ${sizeClasses} rounded-full font-medium uppercase tracking-wider ${l.bg} ${l.text} cursor-pointer hover:brightness-125 transition`}
        title={`Link state: ${l.label}`}
      >
        <span className="text-[11px] leading-none" aria-hidden>{l.icon}</span>
        {l.label}
      </span>
    </div>
  );
}
