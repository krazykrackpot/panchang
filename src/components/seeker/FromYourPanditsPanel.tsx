'use client';

/**
 * "From your Pandits" — seeker-side panel showing deliverables that
 * linked Pandits have pushed to this user's dashboard. Mounts on the
 * seeker variant of /dashboard.
 *
 * Spec §7.2 + §22.2 (My Pandits panel).
 *
 * Pandit CRM P7.
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';

interface PushedDeliverable {
  id: string;
  client_record_id: string;
  pandit_user_id: string;
  pandit_display_name: string;
  kind: string;
  title: string;
  content: unknown;
  locale: string;
  pushed_at: string | null;
  client_seen_at: string | null;
  client_acknowledged_at: string | null;
  created_at: string;
}

const KIND_LABELS: Record<string, { en: string; hi: string }> = {
  kundali_report: { en: 'Kundali report', hi: 'कुण्डली रिपोर्ट' },
  tippanni: { en: 'Tippanni', hi: 'टिप्पणी' },
  muhurta_pick: { en: 'Muhurta', hi: 'मुहूर्त' },
  matching_report: { en: 'Matching report', hi: 'मेलापक रिपोर्ट' },
  consultation_summary: { en: 'Consultation summary', hi: 'परामर्श सारांश' },
  custom_letter: { en: 'Letter', hi: 'पत्र' },
};

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '—';
  const diff = Date.now() - then;
  const day = 24 * 60 * 60 * 1000;
  if (diff < day) {
    const h = Math.floor(diff / (60 * 60 * 1000));
    return h < 1 ? 'just now' : `${h}h ago`;
  }
  const days = Math.floor(diff / day);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function FromYourPanditsPanel() {
  const { user, initialized } = useAuthStore();
  const [items, setItems] = useState<PushedDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch('/api/seeker/pandit-deliverables', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        console.error('[FromYourPanditsPanel] load failed:', body?.error || res.status);
        setError(body?.error || 'Failed to load');
        setLoading(false);
        return;
      }
      const body = (await res.json()) as { deliverables: PushedDeliverable[] };
      setItems(body.deliverables);
      setLoading(false);
    } catch (e) {
      console.error('[FromYourPanditsPanel] uncaught:', e);
      setError('Could not reach the server.');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialized) load();
  }, [load, initialized]);

  async function markAction(id: string, action: 'seen' | 'ack') {
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) return;
      const res = await fetch('/api/seeker/pandit-deliverables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deliverable_id: id, action }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        console.error('[FromYourPanditsPanel] markAction failed:', body?.error);
        return;
      }
      // Optimistic patch on local state
      setItems((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                client_seen_at: d.client_seen_at ?? new Date().toISOString(),
                client_acknowledged_at:
                  action === 'ack'
                    ? new Date().toISOString()
                    : d.client_acknowledged_at,
              }
            : d,
        ),
      );
    } catch (e) {
      console.error('[FromYourPanditsPanel] markAction uncaught:', e);
    }
  }

  // Hidden entirely if not logged in or if zero deliverables — the seeker
  // dashboard already has a busy home, no need for an empty panel.
  if (!user || (!loading && !error && items.length === 0)) return null;

  const unseen = items.filter((d) => !d.client_seen_at).length;

  return (
    <section className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5 mb-6">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-2">
          <h2
            className="text-base font-bold text-gold-light"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            From your Pandits
          </h2>
          {unseen > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold rounded-full bg-[color:var(--color-link-invited)]/30 text-[color:var(--color-link-invited)]">
              {unseen} new
            </span>
          )}
        </div>
        <span className="text-[11px] text-text-tertiary">
          {items.length} total
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-16 rounded-xl bg-bg-secondary/40 animate-pulse" />
          <div className="h-16 rounded-xl bg-bg-secondary/40 animate-pulse" />
        </div>
      ) : error ? (
        <div className="text-[12px] text-[color:var(--color-alert-critical)]">{error}</div>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 5).map((d) => (
            <DeliverableRow
              key={d.id}
              deliverable={d}
              onOpen={() => {
                setOpenId(d.id);
                if (!d.client_seen_at) markAction(d.id, 'seen');
              }}
            />
          ))}
        </div>
      )}

      {openId && (
        <DeliverableViewer
          deliverable={items.find((d) => d.id === openId) ?? null}
          onClose={() => setOpenId(null)}
          onAck={() => {
            if (openId) markAction(openId, 'ack');
          }}
        />
      )}
    </section>
  );
}

function DeliverableRow({
  deliverable,
  onOpen,
}: {
  deliverable: PushedDeliverable;
  onOpen: () => void;
}) {
  const d = deliverable;
  const label = KIND_LABELS[d.kind] ?? { en: d.kind, hi: '' };
  const isUnseen = !d.client_seen_at;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`
        w-full text-left rounded-xl border p-3 transition
        ${isUnseen
          ? 'border-[color:var(--color-link-invited)]/40 bg-[color:var(--color-link-invited)]/8 hover:border-[color:var(--color-link-invited)]/60'
          : 'border-gold-primary/12 bg-bg-secondary/30 hover:border-gold-primary/30'}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-semibold">
              {label.en}
            </span>
            {label.hi && (
              <span
                className="text-[12px] text-[color:var(--color-text-devanagari)]"
                style={{ fontFamily: 'var(--font-devanagari-body)' }}
              >
                {label.hi}
              </span>
            )}
            {isUnseen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-link-invited)]" aria-label="Unseen" />
            )}
          </div>
          <p
            className="font-semibold text-text-primary text-[14px] truncate"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {d.title}
          </p>
          <p className="text-[11px] text-text-secondary mt-0.5">
            From <span className="text-gold-light">{d.pandit_display_name}</span>
            {d.pushed_at && (
              <>
                {' · '}
                <span className="tabular-nums">{relativeTime(d.pushed_at)}</span>
              </>
            )}
          </p>
        </div>
        <span className="text-gold-primary text-lg leading-none" aria-hidden>→</span>
      </div>
    </button>
  );
}

function DeliverableViewer({
  deliverable,
  onClose,
  onAck,
}: {
  deliverable: PushedDeliverable | null;
  onClose: () => void;
  onAck: () => void;
}) {
  if (!deliverable) return null;
  const label = KIND_LABELS[deliverable.kind] ?? { en: deliverable.kind, hi: '' };
  const isAcked = !!deliverable.client_acknowledged_at;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-gradient-to-br from-[#1a1f4e]/95 via-[#111638]/95 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-baseline gap-2 flex-wrap mb-1">
              <span className="text-[10px] uppercase tracking-wider text-gold-primary font-semibold">
                {label.en}
              </span>
              {label.hi && (
                <span
                  className="text-[12px] text-[color:var(--color-text-devanagari)]"
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                >
                  {label.hi}
                </span>
              )}
            </div>
            <h2
              className="text-xl font-bold text-gold-light"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {deliverable.title}
            </h2>
            <p className="text-[12px] text-text-secondary mt-1">
              From <span className="text-text-primary">{deliverable.pandit_display_name}</span>
              {deliverable.pushed_at && (
                <> · {relativeTime(deliverable.pushed_at)}</>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-tertiary hover:text-gold-light text-xl px-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 max-h-[50vh] overflow-y-auto">
          <DeliverableContent kind={deliverable.kind} content={deliverable.content} />
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gold-primary/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] text-text-secondary hover:text-text-primary transition"
          >
            Close
          </button>
          {!isAcked && (
            <button
              type="button"
              onClick={() => {
                onAck();
                onClose();
              }}
              className="px-5 py-2 rounded-lg text-[13px] font-semibold bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary hover:from-gold-light shadow-md shadow-gold-primary/30 transition"
            >
              ✓ Acknowledge
            </button>
          )}
          {isAcked && (
            <span className="px-4 py-2 text-[12px] text-[color:var(--color-state-active)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-state-active)]" />
              Acknowledged
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DeliverableContent({ kind, content }: { kind: string; content: unknown }) {
  // Generic JSON rendering for P7; rich kind-specific renderers ship
  // with the tippanni editor + branded PDF in P9.
  if (!content || typeof content !== 'object') {
    return (
      <p className="text-[14px] text-text-secondary italic leading-relaxed">
        Your Pandit has shared this {kind.replace(/_/g, ' ')}. The full
        reading is available on this card; for a richer rendering,
        download as PDF when your Pandit provides it.
      </p>
    );
  }
  return (
    <pre className="text-[12px] text-text-primary leading-relaxed bg-bg-primary/30 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}
