/**
 * Production roster page — /dashboard/clients (Pandit only).
 *
 * Visual design mirrors the prototype at
 * /dashboard-preview/pandit/clients (spec §18.2) but consumes real
 * pandit_clients data via /api/pandit/clients.
 *
 * Hidden behind AccountTypeRouter — this route is reachable from the
 * navbar only when account_type='pandit'. Seekers visiting it directly
 * see the empty state (or get redirected to /dashboard).
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { PanditClient, EngagementState, LinkState } from '@/lib/pandit/types';
import PanditClientCard from '@/components/pandit/PanditClientCard';

type EngagementFilter = 'all' | EngagementState;
type LinkFilter = 'all' | LinkState;

export default function ClientRosterPage() {
  const { user } = useAuthStore();
  const [clients, setClients] = useState<PanditClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [engagementFilter, setEngagementFilter] = useState<EngagementFilter>('all');
  const [linkFilter, setLinkFilter] = useState<LinkFilter>('all');

  useEffect(() => {
    let cancelled = false;
    async function loadClients() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const supabase = getSupabase();
        if (!supabase) {
          setError('Auth not configured');
          setLoading(false);
          return;
        }
        const { data: session } = await supabase.auth.getSession();
        const token = session.session?.access_token;
        if (!token) {
          setError('No session');
          setLoading(false);
          return;
        }
        const res = await fetch('/api/pandit/clients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          console.error('[ClientRoster] load failed:', body?.error || res.status);
          setError(body?.error || `Failed to load clients (${res.status})`);
          setLoading(false);
          return;
        }
        const body = (await res.json()) as { clients: PanditClient[] };
        if (!cancelled) {
          setClients(body.clients);
          setLoading(false);
        }
      } catch (e) {
        console.error('[ClientRoster] uncaught:', e);
        if (!cancelled) {
          setError('Could not reach the server. Please retry.');
          setLoading(false);
        }
      }
    }
    loadClients();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const filteredClients = useMemo(() => {
    let out = clients;
    if (engagementFilter !== 'all') {
      out = out.filter((c) => c.engagement_state === engagementFilter);
    }
    if (linkFilter !== 'all') {
      out = out.filter((c) => c.link_state === linkFilter);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      out = out.filter(
        (c) =>
          c.full_name.toLowerCase().includes(s) ||
          (c.display_label?.toLowerCase().includes(s) ?? false) ||
          (c.contact_email?.toLowerCase().includes(s) ?? false) ||
          c.tags.some((t) => t.toLowerCase().includes(s)),
      );
    }
    return out;
  }, [clients, engagementFilter, linkFilter, search]);

  const counts = useMemo(() => {
    const active = clients.filter((c) => c.engagement_state === 'active').length;
    const past = clients.filter((c) => c.engagement_state === 'past').length;
    const prospect = clients.filter((c) => c.engagement_state === 'prospect').length;
    const linked = clients.filter((c) => c.link_state === 'linked').length;
    const unlinked = clients.filter((c) => c.link_state === 'unlinked').length;
    return { active, past, prospect, linked, unlinked };
  }, [clients]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
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
          {clients.length > 0 && (
            <div className="text-[13px] text-text-secondary">
              <span className="text-text-primary font-medium">{counts.active}</span> active
              <span className="text-text-tertiary mx-2">·</span>
              <span className="text-text-primary font-medium">{counts.prospect}</span> prospect
              <span className="text-text-tertiary mx-2">·</span>
              <span className="text-text-primary font-medium">{counts.past}</span> past
            </div>
          )}
        </div>
      </div>

      {/* Cap nudge — only when there are clients */}
      {clients.length > 0 && (
        <div className="mb-6 rounded-xl border border-[color:var(--color-state-active)]/20 bg-[color:var(--color-state-active)]/8 px-4 py-3 text-[12px] text-text-secondary flex items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-[color:var(--color-state-active)]">
              {counts.unlinked} of 5
            </span>{' '}
            unlinked clients used.
            <span className="ml-2 text-text-tertiary">
              Linked clients ({counts.linked}) don't count against your cap.
            </span>
          </div>
          <Link href="#" className="text-[12px] text-gold-primary hover:text-gold-light transition flex-none">
            Why? →
          </Link>
        </div>
      )}

      {/* Search + filters (only when there are clients to filter) */}
      {clients.length > 0 && (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search clients…"
                  className="
                    w-full px-4 py-2.5 pr-10 rounded-lg
                    bg-bg-secondary/40 border border-gold-primary/15
                    text-text-primary placeholder:text-text-tertiary
                    focus:outline-none focus:border-gold-primary/40 transition
                  "
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <FilterChip label="All" active={engagementFilter === 'all'} onClick={() => setEngagementFilter('all')} />
              <FilterChip label="Active" active={engagementFilter === 'active'} onClick={() => setEngagementFilter('active')} />
              <FilterChip label="Prospect" active={engagementFilter === 'prospect'} onClick={() => setEngagementFilter('prospect')} />
              <FilterChip label="Past" active={engagementFilter === 'past'} onClick={() => setEngagementFilter('past')} />
              <FilterChip label="Linked" active={linkFilter === 'linked'} onClick={() => setLinkFilter(linkFilter === 'linked' ? 'all' : 'linked')} />
              <FilterChip label="Unlinked" active={linkFilter === 'unlinked'} onClick={() => setLinkFilter(linkFilter === 'unlinked' ? 'all' : 'unlinked')} />
            </div>
          </div>
        </>
      )}

      {/* Loading / error / empty / list */}
      {loading ? (
        <RosterSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-6 text-center">
          <p className="text-[color:var(--color-alert-critical)] font-medium mb-2">
            Couldn't load your clients
          </p>
          <p className="text-text-secondary text-[13px] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 text-[13px] transition"
          >
            Retry
          </button>
        </div>
      ) : clients.length === 0 ? (
        <EmptyState />
      ) : filteredClients.length === 0 ? (
        <div className="rounded-xl border border-gold-primary/12 bg-bg-secondary/30 p-8 text-center">
          <p className="text-text-secondary mb-2">No clients match your filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setEngagementFilter('all');
              setLinkFilter('all');
            }}
            className="text-[13px] text-gold-primary hover:text-gold-light transition"
          >
            Clear filters →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClients.map((c) => (
            <PanditClientCard key={c.id} client={c} />
          ))}
        </div>
      )}

      {/* Sticky add-client */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/dashboard/clients/new"
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

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const classes = active
    ? 'px-3 py-1.5 rounded-full text-[12px] cursor-pointer transition border bg-gold-primary/20 text-gold-light border-gold-primary/40'
    : 'px-3 py-1.5 rounded-full text-[12px] cursor-pointer transition border text-text-secondary border-gold-primary/15 hover:border-gold-primary/30 hover:text-text-primary';
  return (
    <button type="button" onClick={onClick} className={classes}>
      {label}
    </button>
  );
}

function RosterSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[200px] rounded-2xl border border-gold-primary/10 bg-bg-secondary/30 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="
        relative overflow-hidden rounded-2xl border border-gold-primary/20
        bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27]
        p-8 sm:p-12 text-center
      "
    >
      <div className="absolute inset-0 yantra-bg opacity-40" aria-hidden />
      <div className="relative">
        <div className="mb-4">
          <span
            className="inline-block text-3xl"
            style={{ fontFamily: 'var(--font-devanagari-heading)', color: '#f0d48a' }}
          >
            ॐ
          </span>
        </div>
        <h2
          className="text-2xl font-bold text-gold-light mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Your roster begins here
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mb-6 leading-relaxed">
          Add your first client by entering their birth details. You can
          optionally invite them by email so readings push directly to
          their Dekho Panchang dashboard.
        </p>
        <Link
          href="/dashboard/clients/new"
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-full
            bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary
            font-semibold text-sm
            shadow-lg shadow-gold-primary/30
            hover:from-gold-light hover:shadow-xl hover:shadow-gold-primary/40
            transition-all
          "
        >
          + Add your first client
        </Link>
      </div>
    </div>
  );
}
