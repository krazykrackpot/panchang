'use client';

/**
 * Client Deliverables tab — list + generate + open.
 * Spec §7 + §18.3.
 *
 * Pandit CRM P5.
 *
 * The "centerpiece tippanni editor" experience (spec §18.5) ships with
 * P9 alongside branded letterhead PDF. P5 ships:
 *   - List of deliverables (kundali_report, tippanni, muhurta_pick,
 *     matching_report, consultation_summary, custom_letter)
 *   - "Generate kundali report" button — creates a deliverable record
 *     of kind=kundali_report with a minimal JSON content payload
 *     pointing at the computed kundali. PDF binding ships in P9.
 *   - "Open Tippanni editor" link — placeholder route per spec §18.5
 *     (full editor in P9).
 *   - Push to client's dashboard is P7 — button stubbed but disabled.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type {
  PanditClient,
  PanditDeliverable,
  DeliverableKind,
  PanditSettings,
} from '@/lib/pandit/types';
import { relativeTimeSince } from '@/lib/pandit/types';
import type { KundaliData, BirthData as EngineBirthData } from '@/types/kundali';
import { downloadBrandedPanditPdf } from '@/lib/export/pdf-pandit-branded';

interface Props {
  client: PanditClient;
}

interface PushResult {
  ok: boolean;
  pushedAt?: string;
  error?: string;
}

const KIND_LABELS: Record<DeliverableKind, { en: string; hi: string }> = {
  kundali_report: { en: 'Kundali report', hi: 'कुण्डली रिपोर्ट' },
  tippanni: { en: 'Tippanni', hi: 'टिप्पणी' },
  muhurta_pick: { en: 'Muhurta', hi: 'मुहूर्त' },
  matching_report: { en: 'Matching report', hi: 'मेलापक रिपोर्ट' },
  consultation_summary: { en: 'Consultation summary', hi: 'परामर्श सारांश' },
  custom_letter: { en: 'Custom letter', hi: 'पत्र' },
};

const KIND_GENERATABLE: { kind: DeliverableKind; label: string; description: string; primary?: boolean }[] = [
  {
    kind: 'kundali_report',
    label: 'Generate kundali report',
    description: 'Full natal chart + planet positions + dasha context',
    primary: true,
  },
  {
    kind: 'tippanni',
    label: 'Draft tippanni',
    description: 'Year-ahead narrative (full editor in P9)',
  },
  {
    kind: 'custom_letter',
    label: 'Write custom letter',
    description: 'Freeform — for one-off events, blessings, advice',
  },
];

export default function ClientDeliverablesTab({ client }: Props) {
  const { user } = useAuthStore();
  const [items, setItems] = useState<PanditDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<DeliverableKind | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
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
      const res = await fetch(`/api/pandit/clients/${client.id}/deliverables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        console.error('[ClientDeliverablesTab] load failed:', body?.error || res.status);
        setError(body?.error || `Failed to load (${res.status})`);
        setLoading(false);
        return;
      }
      const body = (await res.json()) as { deliverables: PanditDeliverable[] };
      setItems(body.deliverables);
      setLoading(false);
    } catch (e) {
      console.error('[ClientDeliverablesTab] uncaught:', e);
      setError('Could not reach the server.');
      setLoading(false);
    }
  }, [user, client.id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  async function handleGenerate(kind: DeliverableKind) {
    setGenerating(kind);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Auth not configured');
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error('No session');

      const baseTitle: Record<DeliverableKind, string> = {
        kundali_report: `Kundali report — ${client.full_name}`,
        tippanni: `Tippanni — ${client.full_name}`,
        muhurta_pick: `Muhurta — ${client.full_name}`,
        matching_report: `Matching report — ${client.full_name}`,
        consultation_summary: `Consultation summary — ${client.full_name}`,
        custom_letter: `Letter to ${client.full_name}`,
      };

      // Create the deliverable row first — `content` left null because
      // the actual PDF is regenerated from `client.birth_data` on every
      // download (same engine path as the consumer-side patrika/tippanni
      // PDF). The row exists for tracking only (title, kind, pushed_at).
      // Was previously stuffed with a placeholder `{ note: 'PDF binding
      // lands in P9.' }` — confusing for the pandit, who saw "JSON" when
      // they expected a downloadable file. P9 deferred → chain Download
      // here so Generate produces an actual PDF in one click.
      const res = await fetch(`/api/pandit/clients/${client.id}/deliverables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          kind,
          title: baseTitle[kind],
          content: null,
          locale: 'en',
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(body.message || body.error || `HTTP ${res.status}`);
      }
      const created = (await res.json().catch(() => ({}))) as { deliverable?: PanditDeliverable };
      await load();

      // Immediately render and download the branded PDF. Same flow the
      // Download button on existing deliverables runs — we just plumb
      // it in to the create action so there's no intermediate state
      // where the pandit has a row but no file.
      if (created.deliverable) {
        await handleDownloadPdf(created.deliverable);
      }
    } catch (e) {
      console.error('[ClientDeliverablesTab] generate failed:', e);
      alert(e instanceof Error ? e.message : 'Could not generate');
    } finally {
      setGenerating(null);
    }
  }

  async function handleDownloadPdf(deliverable: PanditDeliverable) {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        alert('Auth not configured');
        return;
      }
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) {
        alert('No session');
        return;
      }

      // Compute the kundali on the client's birth_data
      const engineBd: EngineBirthData = {
        name: client.full_name,
        date: client.birth_data.date,
        time: client.birth_data.time || '12:00',
        place: client.birth_data.place,
        lat: client.birth_data.lat,
        lng: client.birth_data.lng,
        timezone: client.birth_data.tz,
        ayanamsha: 'lahiri',
        relationship: 'other',
        node_type: 'mean',
      };
      const kundaliRes = await fetch('/api/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(engineBd),
      });
      if (!kundaliRes.ok) throw new Error(`Kundali compute failed (${kundaliRes.status})`);
      const kundali = (await kundaliRes.json()) as KundaliData;

      // Fetch Pandit settings
      const settingsRes = await fetch('/api/pandit/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!settingsRes.ok) throw new Error(`Settings load failed (${settingsRes.status})`);
      const settingsBody = (await settingsRes.json()) as { settings: PanditSettings };

      const filename = `${deliverable.title.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()}-${deliverable.id.slice(0, 8)}.pdf`;
      downloadBrandedPanditPdf(
        {
          kundali,
          locale: deliverable.locale as 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'mai' | 'mr',
          panditSettings: settingsBody.settings,
          deliverableTitle: deliverable.title,
          clientName: client.full_name,
        },
        filename,
      );
    } catch (e) {
      console.error('[ClientDeliverablesTab] PDF generation failed:', e);
      alert(`PDF generation failed: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }

  async function handlePush(id: string): Promise<PushResult> {
    if (client.link_state !== 'linked') {
      return { ok: false, error: 'Client must be linked to receive pushes' };
    }
    if (!confirm(`Push this reading to ${client.full_name}? They'll see it on their dashboard immediately.`)) {
      return { ok: false, error: 'cancelled' };
    }
    try {
      const supabase = getSupabase();
      if (!supabase) return { ok: false, error: 'Auth not configured' };
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) return { ok: false, error: 'No session' };
      const res = await fetch(`/api/pandit/deliverables/${id}/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const body = (await res.json().catch(() => ({}))) as {
        deliverable?: PanditDeliverable;
        error?: string;
        pushed_at?: string;
      };
      if (!res.ok) {
        // Common cases: 409 already_pushed, 403 permission_denied, 409 client_not_linked
        return { ok: false, error: body.error || `HTTP ${res.status}` };
      }
      await load();
      return { ok: true, pushedAt: body.deliverable?.pushed_at ?? undefined };
    } catch (e) {
      console.error('[ClientDeliverablesTab] push failed:', e);
      return { ok: false, error: e instanceof Error ? e.message : 'unknown' };
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this deliverable? This cannot be undone.')) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) return;
    const res = await fetch(`/api/pandit/deliverables/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      alert(body.error || 'Could not delete');
      return;
    }
    await load();
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-32 rounded-2xl bg-bg-secondary/30 animate-pulse" />
        <div className="h-24 rounded-2xl bg-bg-secondary/30 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-6 text-center">
        <p className="text-[color:var(--color-alert-critical)] font-medium mb-2">
          Couldn't load deliverables
        </p>
        <p className="text-text-secondary text-[13px] mb-4">{error}</p>
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 text-[13px] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generate panel */}
      <div className="rounded-2xl border border-[color:var(--color-pandit-violet)]/25 bg-[color:var(--color-pandit-violet)]/8 p-5">
        <h2
          className="text-base font-bold text-[color:var(--color-pandit-violet-light)] mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Generate a deliverable
        </h2>
        <p className="text-[12px] text-text-secondary mb-4">
          Create artifacts you can save, edit, and (when {client.full_name} is
          linked) push to their dashboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {KIND_GENERATABLE.map((g) => {
            const isGen = generating === g.kind;
            return (
              <button
                key={g.kind}
                onClick={() => handleGenerate(g.kind)}
                disabled={!!generating}
                className={`
                  text-left rounded-xl p-4 border transition
                  ${g.primary
                    ? 'bg-gradient-to-br from-gold-primary/20 to-gold-dark/20 border-gold-primary/40 hover:from-gold-primary/30 hover:to-gold-dark/30 text-gold-light'
                    : 'bg-bg-primary/40 border-gold-primary/10 hover:border-gold-primary/30 text-text-primary'}
                  ${generating && !isGen ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  disabled:cursor-not-allowed
                `}
              >
                <p className="text-[13px] font-semibold mb-1">
                  {isGen ? `Generating ${g.label.toLowerCase()}…` : g.label}
                </p>
                <p className="text-[11px] text-text-secondary leading-snug">{g.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <div>
            <h2
              className="text-xl font-bold text-gold-light"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {client.full_name}'s deliverables
            </h2>
            <p className="text-[12px] text-text-secondary mt-0.5">
              {items.length} item{items.length === 1 ? '' : 's'} generated
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-bg-secondary/20 p-8 text-center">
            <p className="text-text-secondary text-[13px]">
              No deliverables yet. Generate {client.full_name}'s first reading
              from the panel above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((d) => (
              <DeliverableRow
                key={d.id}
                deliverable={d}
                clientLinkState={client.link_state}
                onDelete={() => handleDelete(d.id)}
                onPush={() => handlePush(d.id)}
                onDownloadPdf={() => handleDownloadPdf(d)}
              />
            ))}
          </div>
        )}
      </div>

      {/* P7/P9 forward-looking hint */}
      <div className="rounded-xl border border-gold-primary/10 bg-bg-secondary/20 px-4 py-3 text-[12px] text-text-secondary">
        <span className="text-text-tertiary uppercase tracking-wider text-[10px] block mb-1">
          Coming soon
        </span>
        Branded letterhead PDF (your name, logo, signature) — P9. Push
        deliverables to a linked client's dashboard — P7.
      </div>
    </div>
  );
}

function DeliverableRow({
  deliverable,
  clientLinkState,
  onDelete,
  onPush,
  onDownloadPdf,
}: {
  deliverable: PanditDeliverable;
  clientLinkState: PanditClient['link_state'];
  onDelete: () => void;
  onPush: () => Promise<PushResult>;
  onDownloadPdf: () => Promise<void>;
}) {
  const d = deliverable;
  const label = KIND_LABELS[d.kind];
  const isPushed = d.visibility === 'client_pushed';
  const canPush = clientLinkState === 'linked' && !isPushed;
  const [pushing, setPushing] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);

  async function handlePushClick() {
    setPushError(null);
    setPushing(true);
    const result = await onPush();
    setPushing(false);
    if (!result.ok && result.error && result.error !== 'cancelled') {
      setPushError(result.error);
    }
  }

  // Tooltip / label for the push button based on state
  const pushDisabledReason = isPushed
    ? `Already pushed${d.pushed_at ? ` ${relativeTimeSince(d.pushed_at)}` : ''}`
    : clientLinkState !== 'linked'
      ? `Client must be linked first (current: ${clientLinkState})`
      : undefined;

  return (
    <div className="rounded-xl border border-gold-primary/12 bg-bg-secondary/30 p-4 hover:border-gold-primary/30 transition">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span
              className="text-[10px] uppercase tracking-wider text-text-tertiary font-semibold"
              title={`Kind: ${d.kind}`}
            >
              {label.en}
            </span>
            <span
              className="text-[12px] text-[color:var(--color-text-devanagari)]"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              {label.hi}
            </span>
            <span className="text-text-tertiary text-[10px]">·</span>
            <span className="text-[11px] text-text-tertiary uppercase tracking-wider">
              {d.locale}
            </span>
          </div>
          <p
            className="font-semibold text-text-primary mb-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {d.title}
          </p>
          <p className="text-[11px] text-text-secondary tabular-nums">
            Created {relativeTimeSince(d.created_at)}
            {d.pushed_at && (
              <>
                {' · '}
                <span className="text-[color:var(--color-state-active)]">
                  Pushed {relativeTimeSince(d.pushed_at)}
                </span>
              </>
            )}
            {d.client_seen_at && (
              <>
                {' · '}
                <span className="text-text-secondary">
                  Seen {relativeTimeSince(d.client_seen_at)}
                </span>
              </>
            )}
            {d.client_acknowledged_at && (
              <>
                {' · '}
                <span className="text-gold-primary">
                  Acknowledged {relativeTimeSince(d.client_acknowledged_at)}
                </span>
              </>
            )}
          </p>
          {pushError && (
            <p className="text-[11px] text-[color:var(--color-alert-critical)] mt-1">
              Push failed: {pushError}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-none">
          {d.kind === 'tippanni' && (
            <Link
              href={`/dashboard/clients/${d.client_record_id}/tippanni/${d.id}` as never}
              className="text-[11px] px-3 py-1.5 rounded text-gold-light bg-gold-primary/15 border border-gold-primary/30 hover:bg-gold-primary/25 transition"
            >
              Open editor
            </Link>
          )}
          <button
            type="button"
            onClick={onDownloadPdf}
            title="Download branded PDF (English; Devanagari and other scripts in P9.b)"
            className="text-[11px] px-3 py-1.5 rounded text-gold-light bg-gold-primary/15 border border-gold-primary/30 hover:bg-gold-primary/25 transition"
          >
            Download PDF
          </button>
          {isPushed ? (
            <span className="text-[11px] px-3 py-1.5 rounded text-[color:var(--color-state-active)] bg-[color:var(--color-state-active)]/15 border border-[color:var(--color-state-active)]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-state-active)]" />
              Shared
            </span>
          ) : (
            <button
              type="button"
              onClick={handlePushClick}
              disabled={!canPush || pushing}
              title={pushDisabledReason}
              className={`
                text-[11px] px-3 py-1.5 rounded transition
                ${canPush && !pushing
                  ? 'text-bg-primary bg-gradient-to-br from-gold-primary to-gold-dark hover:from-gold-light shadow-sm shadow-gold-primary/20 font-semibold'
                  : 'text-text-tertiary bg-bg-secondary/40 border border-gold-primary/10 cursor-not-allowed opacity-50'}
              `}
            >
              {pushing ? 'Pushing…' : 'Push to client'}
            </button>
          )}
          <button
            onClick={onDelete}
            className="text-[11px] px-2 py-1.5 rounded text-text-tertiary hover:text-[color:var(--color-alert-critical)] hover:bg-[color:var(--color-alert-critical)]/10 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
