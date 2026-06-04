/**
 * Client roster — visual card grid (default) with list-view toggle.
 * Spec §18.2.
 */

import Link from 'next/link';
import { MOCK_CLIENTS } from '@/lib/pandit/mock-fixtures';
import PanditCard from '@/components/pandit/PanditCard';

export default function ClientRoster() {
  const activeCount = MOCK_CLIENTS.filter((c) => c.engagement_state === 'active').length;
  const pastCount = MOCK_CLIENTS.filter((c) => c.engagement_state === 'past').length;
  const prospectCount = MOCK_CLIENTS.filter((c) => c.engagement_state === 'prospect').length;
  const linkedCount = MOCK_CLIENTS.filter((c) => c.link_state === 'linked').length;
  const unlinkedCount = MOCK_CLIENTS.filter((c) => c.link_state === 'unlinked').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
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
            Clients
          </h1>
          <div className="text-[13px] text-text-secondary">
            <span className="text-text-primary font-medium">{activeCount}</span> active
            <span className="text-text-tertiary mx-2">·</span>
            <span className="text-text-primary font-medium">{prospectCount}</span> prospect
            <span className="text-text-tertiary mx-2">·</span>
            <span className="text-text-primary font-medium">{pastCount}</span> past
          </div>
        </div>
      </div>

      {/* Subtle cap nudge — "linked don't count against your cap" */}
      <div className="mb-6 rounded-xl border border-[color:var(--color-state-active)]/20 bg-[color:var(--color-state-active)]/8 px-4 py-3 text-[12px] text-text-secondary flex items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-[color:var(--color-state-active)]">{unlinkedCount} of 5</span>{' '}
          unlinked clients used.
          <span className="ml-2 text-text-tertiary">
            Linked clients ({linkedCount}) don't count against your cap.
          </span>
        </div>
        <Link
          href="#"
          className="text-[12px] text-gold-primary hover:text-gold-light transition flex-none"
        >
          Why? →
        </Link>
      </div>

      {/* Search + filters + view toggle */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients…"
              className="
                w-full px-4 py-2.5 pr-10 rounded-lg
                bg-bg-secondary/40 border border-gold-primary/15
                text-text-primary placeholder:text-text-tertiary
                focus:outline-none focus:border-gold-primary/40 transition
              "
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-[12px]">
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <FilterChip label="All" active />
          <FilterChip label="Active" />
          <FilterChip label="Past" />
          <FilterChip label="Prospect" />
          <FilterChip label="Linked" />
          <FilterChip label="Unlinked" />
          <FilterChip label="+ Tag" muted />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <ViewToggle icon="▦" label="Cards" active />
          <ViewToggle icon="≡" label="List" />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-4 flex items-center gap-3 text-[12px] text-text-secondary">
        Sort by:
        <SortPill label="Last consulted" active />
        <SortPill label="Name" />
        <SortPill label="Engagement" />
        <SortPill label="Critical alerts" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_CLIENTS.map((c) => (
          <PanditCard
            key={c.id}
            client={c}
            href={`/en/dashboard-preview/pandit/clients/${c.id}`}
          />
        ))}
      </div>

      {/* Sticky add-client */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/en/dashboard-preview/pandit/add-client"
          className="
            inline-flex items-center gap-2 px-5 py-3 rounded-full
            bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary
            font-semibold text-sm
            shadow-lg shadow-gold-primary/30
            hover:from-gold-light hover:shadow-xl hover:shadow-gold-primary/40
            transition-all
          "
        >
          + Add client
        </Link>
      </div>
    </div>
  );
}

function FilterChip({ label, active, muted }: { label: string; active?: boolean; muted?: boolean }) {
  let classes = 'px-3 py-1.5 rounded-full text-[12px] cursor-pointer transition border';
  if (active) {
    classes += ' bg-gold-primary/20 text-gold-light border-gold-primary/40';
  } else if (muted) {
    classes += ' text-text-tertiary border-gold-primary/10 hover:border-gold-primary/25 hover:text-text-secondary border-dashed';
  } else {
    classes +=
      ' text-text-secondary border-gold-primary/15 hover:border-gold-primary/30 hover:text-text-primary';
  }
  return <button className={classes}>{label}</button>;
}

function ViewToggle({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  return (
    <button
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition
        ${active ? 'bg-gold-primary/15 text-gold-light' : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40'}
      `}
      title={`${label} view`}
    >
      <span className="text-base leading-none" aria-hidden>
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SortPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`
        text-[12px] transition
        ${active ? 'text-gold-light font-medium' : 'text-text-tertiary hover:text-text-secondary'}
      `}
    >
      {label}
    </button>
  );
}
