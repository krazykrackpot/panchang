'use client';

/**
 * Client Consultations tab — timeline + log new + edit existing.
 * Spec §18.3 + §5 + §7.
 *
 * Pandit CRM P5.
 *
 * Renders consultations newest-first as a vertical timeline. Each
 * entry shows: when, channel, duration, pandit-private notes (Pandit
 * sees), client-visible summary with a "Shared" badge (when shared),
 * follow-up reminder if set. Pandit can log a new consultation
 * (form opens inline), or edit/delete existing ones.
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type {
  PanditClient,
  PanditConsultation,
  ConsultationChannel,
} from '@/lib/pandit/types';
import { relativeTimeSince } from '@/lib/pandit/types';

interface Props {
  client: PanditClient;
}

const CHANNEL_LABELS: Record<ConsultationChannel, string> = {
  in_person: 'In person',
  phone: 'Phone',
  video: 'Video call',
  chat: 'Chat',
  email: 'Email',
  async_note: 'Async note',
};

export default function ClientConsultationsTab({ client }: Props) {
  const { user } = useAuthStore();
  const [items, setItems] = useState<PanditConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      const res = await fetch(`/api/pandit/clients/${client.id}/consultations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        console.error('[ClientConsultationsTab] load failed:', body?.error || res.status);
        setError(body?.error || `Failed to load (${res.status})`);
        setLoading(false);
        return;
      }
      const body = (await res.json()) as { consultations: PanditConsultation[] };
      setItems(body.consultations);
      setLoading(false);
    } catch (e) {
      console.error('[ClientConsultationsTab] uncaught:', e);
      setError('Could not reach the server.');
      setLoading(false);
    }
  }, [user, client.id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  async function handleSave(input: ConsultationInput, id: string | null) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) return;

    const url = id ? `/api/pandit/consultations/${id}` : `/api/pandit/clients/${client.id}/consultations`;
    const method = id ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      throw new Error(body.message || body.error || `HTTP ${res.status}`);
    }
    await load();
    setComposing(false);
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this consultation? This cannot be undone.')) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) return;
    const res = await fetch(`/api/pandit/consultations/${id}`, {
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
        <div className="h-24 rounded-2xl bg-bg-secondary/30 animate-pulse" />
        <div className="h-24 rounded-2xl bg-bg-secondary/30 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-6 text-center">
        <p className="text-[color:var(--color-alert-critical)] font-medium mb-2">
          Couldn't load consultations
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
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2
            className="text-xl font-bold text-gold-light"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Consultations
          </h2>
          <p className="text-[12px] text-text-secondary mt-0.5">
            {items.length} session{items.length === 1 ? '' : 's'} logged
          </p>
        </div>
        {!composing && (
          <button
            onClick={() => {
              setEditingId(null);
              setComposing(true);
            }}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
              bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary
              shadow-md shadow-gold-primary/30
              hover:from-gold-light hover:shadow-lg hover:shadow-gold-primary/40
              transition-all
            "
          >
            + Log consultation
          </button>
        )}
      </div>

      {/* Compose form (new or edit) */}
      {composing && (
        <ConsultationForm
          initial={editingId ? items.find((c) => c.id === editingId) ?? null : null}
          onSave={(input) => handleSave(input, editingId)}
          onCancel={() => {
            setComposing(false);
            setEditingId(null);
          }}
        />
      )}

      {/* Timeline */}
      {items.length === 0 && !composing ? (
        <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-bg-secondary/20 p-8 text-center">
          <h3
            className="text-lg font-bold text-gold-light mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            No consultations logged yet
          </h3>
          <p className="text-text-secondary text-[13px]">
            Log {client.full_name}'s first session to begin tracking.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline rail */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gold-primary/15" aria-hidden />
          <div className="space-y-4 relative">
            {items.map((c) => (
              <ConsultationRow
                key={c.id}
                consultation={c}
                onEdit={() => {
                  setEditingId(c.id);
                  setComposing(true);
                }}
                onDelete={() => handleDelete(c.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ConsultationInput {
  consulted_at: string;
  channel?: ConsultationChannel;
  duration_minutes?: number;
  pandit_private_notes?: string;
  client_visible_summary?: string;
  shared_with_client: boolean;
  next_followup_at?: string | null;
}

function ConsultationRow({
  consultation,
  onEdit,
  onDelete,
}: {
  consultation: PanditConsultation;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const c = consultation;
  return (
    <div className="relative pl-10">
      {/* Timeline dot */}
      <div className="absolute left-2.5 top-3 w-2 h-2 rounded-full bg-gold-primary border-2 border-bg-primary" aria-hidden />

      <div className="rounded-2xl border border-gold-primary/12 bg-bg-secondary/30 p-4 hover:border-gold-primary/30 transition">
        <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-baseline gap-2 text-[12px]">
            <span className="text-text-primary font-medium tabular-nums">
              {new Date(c.consulted_at).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className="text-text-tertiary">·</span>
            <span className="text-text-tertiary">{relativeTimeSince(c.consulted_at)}</span>
            {c.channel && (
              <>
                <span className="text-text-tertiary">·</span>
                <span className="text-text-secondary">{CHANNEL_LABELS[c.channel]}</span>
              </>
            )}
            {c.duration_minutes && (
              <>
                <span className="text-text-tertiary">·</span>
                <span className="text-text-secondary tabular-nums">{c.duration_minutes} min</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {c.shared_with_client && (
              <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-state-active)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-state-active)]" />
                Shared
              </span>
            )}
            <button
              onClick={onEdit}
              className="text-[11px] px-2 py-1 rounded text-text-tertiary hover:text-gold-light hover:bg-gold-primary/10 transition"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-[11px] px-2 py-1 rounded text-text-tertiary hover:text-[color:var(--color-alert-critical)] hover:bg-[color:var(--color-alert-critical)]/10 transition"
            >
              Delete
            </button>
          </div>
        </div>

        {c.pandit_private_notes && (
          <div className="mb-2">
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary mb-1">
              Private notes
            </p>
            <p className="text-[13px] text-[color:var(--color-text-pandit-author)] leading-relaxed whitespace-pre-wrap">
              {c.pandit_private_notes}
            </p>
          </div>
        )}

        {c.client_visible_summary && (
          <div className="mb-2">
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary mb-1 flex items-center gap-1.5">
              Client-visible summary
              {!c.shared_with_client && (
                <span className="text-[9px] text-text-tertiary normal-case">(not shared yet)</span>
              )}
            </p>
            <p className="text-[13px] text-text-primary leading-relaxed whitespace-pre-wrap">
              {c.client_visible_summary}
            </p>
          </div>
        )}

        {c.next_followup_at && (
          <p className="text-[11px] text-gold-primary mt-2">
            Follow-up scheduled:{' '}
            <span className="tabular-nums">
              {new Date(c.next_followup_at).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function ConsultationForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: PanditConsultation | null;
  onSave: (input: ConsultationInput) => Promise<void>;
  onCancel: () => void;
}) {
  const now = new Date();
  const toLocalInput = (iso: string | null | undefined) => {
    if (!iso) return now.toISOString().slice(0, 16);
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return now.toISOString().slice(0, 16);
    // Format as YYYY-MM-DDTHH:mm in local timezone
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  };

  const [consultedAt, setConsultedAt] = useState(toLocalInput(initial?.consulted_at));
  const [channel, setChannel] = useState<ConsultationChannel>(initial?.channel ?? 'phone');
  const [duration, setDuration] = useState(initial?.duration_minutes?.toString() ?? '');
  const [privateNotes, setPrivateNotes] = useState(initial?.pandit_private_notes ?? '');
  const [clientSummary, setClientSummary] = useState(initial?.client_visible_summary ?? '');
  const [sharedWithClient, setSharedWithClient] = useState(initial?.shared_with_client ?? false);
  const [followup, setFollowup] = useState(
    initial?.next_followup_at ? toLocalInput(initial.next_followup_at) : '',
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        consulted_at: new Date(consultedAt).toISOString(),
        channel,
        duration_minutes: duration ? Number(duration) : undefined,
        pandit_private_notes: privateNotes.trim() || undefined,
        client_visible_summary: clientSummary.trim() || undefined,
        shared_with_client: sharedWithClient,
        next_followup_at: followup ? new Date(followup).toISOString() : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5 space-y-4"
    >
      <h3
        className="text-base font-bold text-gold-light"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {initial ? 'Edit consultation' : 'Log new consultation'}
      </h3>

      {error && (
        <div className="rounded-lg border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-3 text-[13px] text-[color:var(--color-alert-critical)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="When" required>
          <input
            type="datetime-local"
            value={consultedAt}
            onChange={(e) => setConsultedAt(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg
              bg-bg-secondary/40 border border-gold-primary/15
              text-text-primary
              focus:outline-none focus:border-gold-primary/40 transition text-sm
            "
          />
        </Field>

        <Field label="Channel">
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as ConsultationChannel)}
            className="
              w-full px-3 py-2 rounded-lg cursor-pointer
              bg-bg-secondary/40 border border-gold-primary/15
              text-text-primary
              focus:outline-none focus:border-gold-primary/40 transition text-sm
            "
          >
            {(Object.entries(CHANNEL_LABELS) as [ConsultationChannel, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>

        <Field label="Duration (min)">
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min={0}
            max={1440}
            placeholder="e.g., 45"
            className="
              w-full px-3 py-2 rounded-lg
              bg-bg-secondary/40 border border-gold-primary/15
              text-text-primary placeholder:text-text-tertiary
              focus:outline-none focus:border-gold-primary/40 transition text-sm
            "
          />
        </Field>
      </div>

      <Field label="Private notes (only you see these)">
        <textarea
          rows={4}
          value={privateNotes}
          onChange={(e) => setPrivateNotes(e.target.value)}
          placeholder="Your full session notes — observations, concerns, prescriptions, hunches…"
          className="
            w-full px-3 py-2 rounded-lg
            bg-bg-secondary/40 border border-gold-primary/15
            text-text-primary placeholder:text-text-tertiary
            focus:outline-none focus:border-gold-primary/40 transition resize-y text-sm
          "
        />
      </Field>

      <Field label="Client-visible summary (shown on client's dashboard when shared)">
        <textarea
          rows={3}
          value={clientSummary}
          onChange={(e) => setClientSummary(e.target.value)}
          placeholder="A summary the client can read — concise, actionable, in their voice…"
          className="
            w-full px-3 py-2 rounded-lg
            bg-bg-secondary/40 border border-gold-primary/15
            text-text-primary placeholder:text-text-tertiary
            focus:outline-none focus:border-gold-primary/40 transition resize-y text-sm
          "
        />
        <label className="mt-2 flex items-center gap-2 text-[12px] text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={sharedWithClient}
            onChange={(e) => setSharedWithClient(e.target.checked)}
            className="w-3.5 h-3.5 accent-gold-primary"
          />
          Share this summary with the client (linked clients only)
        </label>
      </Field>

      <Field label="Next follow-up (optional)">
        <input
          type="datetime-local"
          value={followup}
          onChange={(e) => setFollowup(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg
            bg-bg-secondary/40 border border-gold-primary/15
            text-text-primary
            focus:outline-none focus:border-gold-primary/40 transition text-sm
          "
        />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-[12px] text-text-secondary hover:text-text-primary transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className={`
            px-5 py-2 rounded-lg text-[13px] font-semibold transition
            ${saving ? 'bg-bg-secondary text-text-tertiary cursor-not-allowed'
              : 'bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary hover:from-gold-light'}
          `}
        >
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Save consultation'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] text-text-secondary mb-1.5">
        {label}
        {required && <span className="text-[color:var(--color-alert-critical)] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
