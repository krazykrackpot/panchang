'use client';

/**
 * Client detail page — /dashboard/clients/[id].
 *
 * Sticky context strip + tab strip + active-tab content. P2 ships with
 * Chart/Family/Consultations/Alerts/Deliverables/Notes/History tabs as
 * scaffolds. Each tab body wires real data in its own phase:
 *   - Chart (P3): existing kundali engine on client birth_data
 *   - Family (P4): family-synthesis on Pandit-owned family rows
 *   - Consultations (P5): timeline + log new
 *   - Alerts (P8): per-client alert stream
 *   - Deliverables (P5 + P7): PDF + push
 *   - Notes: inline edit (P5)
 *   - History: audit log (P11)
 *
 * Spec §18.3 + §18.4.
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { PanditClient } from '@/lib/pandit/types';
import PanditStickyContextStrip from '@/components/pandit/PanditStickyContextStrip';

type TabKey =
  | 'chart'
  | 'family'
  | 'consultations'
  | 'alerts'
  | 'deliverables'
  | 'notes'
  | 'history';

interface Tab {
  key: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: 'chart', label: 'Chart' },
  { key: 'family', label: 'Family' },
  { key: 'consultations', label: 'Consultations' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'deliverables', label: 'Deliverables' },
  { key: 'notes', label: 'Notes' },
  { key: 'history', label: 'History' },
];

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, initialized } = useAuthStore();

  const [client, setClient] = useState<PanditClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('chart');

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/dashboard');
    }
  }, [initialized, user, router]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user || !params?.id) return;
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
        const res = await fetch(`/api/pandit/clients/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) {
          if (!cancelled) {
            setError('not_found');
            setLoading(false);
          }
          return;
        }
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          console.error('[ClientDetail] load failed:', body?.error || res.status);
          if (!cancelled) {
            setError(body?.error || `Failed to load (${res.status})`);
            setLoading(false);
          }
          return;
        }
        const body = (await res.json()) as { client: PanditClient };
        if (!cancelled) {
          setClient(body.client);
          setLoading(false);
        }
      } catch (e) {
        console.error('[ClientDetail] uncaught:', e);
        if (!cancelled) {
          setError('Could not reach the server.');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, params?.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-bg-secondary/40 rounded-2xl" />
          <div className="h-10 bg-bg-secondary/30 rounded-lg w-1/2" />
          <div className="h-96 bg-bg-secondary/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error === 'not_found') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p
          className="text-2xl font-bold text-gold-light mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Client not found
        </p>
        <p className="text-text-secondary mb-6">
          This client doesn't exist in your roster, or you don't have access.
        </p>
        <Link
          href="/dashboard/clients"
          className="inline-flex px-4 py-2 rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 transition"
        >
          ← Back to roster
        </Link>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-[color:var(--color-alert-critical)] font-medium mb-2">
          Couldn't load this client
        </p>
        <p className="text-text-secondary text-[13px] mb-4">{error || 'Unknown error'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 text-[13px] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <PanditStickyContextStrip client={client} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-2 mt-2">
          <Link
            href="/dashboard/clients"
            className="text-[11px] text-text-tertiary hover:text-gold-light transition"
          >
            ← Roster
          </Link>
        </div>

        {/* Tab strip */}
        <div className="border-b border-gold-primary/12 mb-6">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <TabButton
                key={t.key}
                label={t.label}
                active={activeTab === t.key}
                onClick={() => setActiveTab(t.key)}
              />
            ))}
          </nav>
        </div>

        {/* Active tab */}
        <div className="pb-12">
          {activeTab === 'chart' && <ChartTabPlaceholder client={client} />}
          {activeTab === 'family' && <PlaceholderTab title="Family" phase="P4" />}
          {activeTab === 'consultations' && (
            <PlaceholderTab title="Consultations" phase="P5" />
          )}
          {activeTab === 'alerts' && <PlaceholderTab title="Alerts" phase="P8" />}
          {activeTab === 'deliverables' && (
            <PlaceholderTab title="Deliverables" phase="P5 + P7" />
          )}
          {activeTab === 'notes' && <NotesTab client={client} />}
          {activeTab === 'history' && <PlaceholderTab title="History" phase="P11" />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative px-4 py-3 text-[13px] font-medium whitespace-nowrap transition
        ${active ? 'text-gold-light' : 'text-text-secondary hover:text-text-primary'}
      `}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-primary rounded-full" />
      )}
    </button>
  );
}

function ChartTabPlaceholder({ client }: { client: PanditClient }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChartPanel title="Rāśi" subtitle="राशि" client={client} />
          <ChartPanel title="Navāṁśa" subtitle="नवांश" client={client} variant="navamsa" />
        </div>
        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
          <h3
            className="text-base font-bold text-gold-light mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Dasha context
          </h3>
          <p className="text-[13px] text-text-secondary">
            The Vimshottari dasha computation, key yogas, and ashtakavarga
            totals wire in here in P3 (chart engine reuse). The existing
            kundali engine takes this client's birth_data and renders the
            same surfaces you have on /kundali, restyled for Pandit use.
          </p>
        </div>
      </div>
      <div className="xl:col-span-4 space-y-6">
        <div className="rounded-2xl border border-[color:var(--color-pandit-violet)]/25 bg-[color:var(--color-pandit-violet)]/8 p-5">
          <h3
            className="text-base font-bold text-[color:var(--color-pandit-violet-light)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Quick actions
          </h3>
          <div className="space-y-2">
            <ActionRow label="Generate tippanni" sub="Wires in P5" primary />
            <ActionRow label="Generate kundali PDF" sub="Wires in P5" />
            <ActionRow label="Find muhurta" sub="Wires in P5" />
            <ActionRow label="Run matching" sub="Existing /matching tool" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  client,
  variant = 'rasi',
}: {
  title: string;
  subtitle: string;
  client: PanditClient;
  variant?: 'rasi' | 'navamsa';
}) {
  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
      <div className="mb-3">
        <h3
          className="text-base font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
        <p
          className="text-[12px] text-[color:var(--color-text-devanagari)]"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          {subtitle}
        </p>
      </div>
      <div className="aspect-square relative bg-bg-primary/40 rounded-lg border border-gold-primary/10">
        <svg viewBox="0 0 100 100" className="absolute inset-2">
          <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(212,168,83,0.3)" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
          <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="rgba(212,168,83,0.4)" strokeWidth="0.5" />
          <text x="50" y="20" textAnchor="middle" fill="#f0d48a" fontSize="6">
            {variant === 'rasi' ? 'D1' : 'D9'}
          </text>
          <text x="50" y="55" textAnchor="middle" fill="#8a8478" fontSize="3">
            {client.birth_data.date}
          </text>
        </svg>
        <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-text-tertiary">
          Real chart wires in P3
        </div>
      </div>
    </div>
  );
}

function PlaceholderTab({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gold-primary/15 bg-bg-secondary/20 p-8 sm:p-12 text-center">
      <h2
        className="text-xl font-bold text-gold-light mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h2>
      <p className="text-text-secondary text-[13px]">
        This tab wires in {phase}. The shell, routing, and styling are in
        place; the underlying logic ships in the named phase.
      </p>
    </div>
  );
}

function NotesTab({ client }: { client: PanditClient }) {
  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/30 p-6 max-w-3xl">
      <h2
        className="text-lg font-bold text-gold-light mb-3"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Private notes
      </h2>
      <p className="text-[12px] text-text-tertiary mb-4">
        Inline edit + autosave wires in P5. For now, this is what you
        recorded when adding {client.full_name}.
      </p>
      {client.pandit_notes ? (
        <p className="text-[14px] text-[color:var(--color-text-pandit-author)] leading-relaxed whitespace-pre-wrap">
          {client.pandit_notes}
        </p>
      ) : (
        <p className="text-text-secondary italic">No notes yet.</p>
      )}
    </div>
  );
}

function ActionRow({
  label,
  sub,
  primary,
}: {
  label: string;
  sub: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`
        block rounded-lg p-3 border transition
        ${primary ? 'bg-[color:var(--color-pandit-violet)]/25 border-[color:var(--color-pandit-violet-light)]/40' : 'border-gold-primary/10'}
      `}
    >
      <p className={`text-[13px] font-medium ${primary ? 'text-white' : 'text-text-primary'}`}>
        {label}
      </p>
      <p className={`text-[11px] mt-0.5 ${primary ? 'text-text-primary/80' : 'text-text-tertiary'}`}>
        {sub}
      </p>
    </div>
  );
}
