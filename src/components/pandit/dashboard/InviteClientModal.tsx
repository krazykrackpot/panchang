'use client';

/**
 * Invite-to-claim modal — opens from the Pandit's client detail header
 * when the client is unlinked/declined. Sends the invitation email +
 * stores the pending invitation row.
 *
 * Spec §5.2 + §5.3.
 *
 * Pandit CRM P6.
 */

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { PanditClient, ClientPermissions } from '@/lib/pandit/types';
import { DEFAULT_REQUESTED_PERMISSIONS } from '@/lib/pandit/types';

const PERMISSION_LABELS: Record<keyof ClientPermissions, { label: string; description: string; baseline?: boolean }> = {
  read_birth_data: {
    label: 'Read birth data',
    description: 'Required — without this the link is useless',
    baseline: true,
  },
  read_family_charts: {
    label: 'See family members',
    description: 'For family-level synthesis',
  },
  generate_readings: {
    label: 'Generate readings on the chart',
    description: 'Kundalis, tippannis, transit forecasts',
  },
  push_deliverables: {
    label: 'Push readings to client\'s dashboard',
    description: 'Without this, you can only download PDFs',
  },
  send_alerts_to_client: {
    label: 'Notify client of major events',
    description: 'Dasha changes, sade sati phases, eclipses',
  },
  view_consultation_history: {
    label: 'Share consultation summaries with client',
    description: 'Summaries you mark as "shared" appear in their dashboard',
  },
};

interface Props {
  client: PanditClient;
  onClose: () => void;
  onInvited: () => void;
}

export default function InviteClientModal({ client, onClose, onInvited }: Props) {
  const { user } = useAuthStore();
  const [email, setEmail] = useState(client.contact_email ?? '');
  const [message, setMessage] = useState('');
  const [permissions, setPermissions] = useState<ClientPermissions>({ ...DEFAULT_REQUESTED_PERMISSIONS });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = validEmail && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !user) return;
    setError(null);
    setEmailWarning(null);
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Auth not configured');
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error('No session');

      const res = await fetch(`/api/pandit/clients/${client.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          invited_email: email.trim(),
          pandit_message: message.trim() || undefined,
          permissions_requested: permissions,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        invitation?: unknown;
        email_sent?: boolean;
        email_error?: string;
        resent?: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        throw new Error(body.message || body.error || `HTTP ${res.status}`);
      }
      if (body.email_sent === false) {
        setEmailWarning(
          `Invitation saved, but the email could not be sent (${body.email_error ?? 'unknown error'}). You can copy the invitation link from this client's detail page.`,
        );
      } else {
        onInvited();
        onClose();
      }
    } catch (err) {
      console.error('[InviteClientModal] failed:', err);
      setError(err instanceof Error ? err.message : 'Could not send invitation');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-gradient-to-br from-[#1a1f4e]/95 via-[#111638]/95 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-gold-primary/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2
              className="text-xl font-bold text-gold-light"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Invite {client.full_name} to claim
            </h2>
            <p className="text-[12px] text-text-secondary mt-1">
              Once they accept, you can push readings directly to their dashboard
              and they'll receive event alerts.
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

        {emailWarning && (
          <div className="rounded-lg border border-[color:var(--color-link-paused)]/30 bg-[color:var(--color-link-paused)]/10 p-3 text-[13px] text-[color:var(--color-link-paused)] mb-4">
            {emailWarning}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-3 text-[13px] text-[color:var(--color-alert-critical)] mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Field label="Their email" required>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold-primary/40 transition text-sm"
            />
          </Field>

          <Field label="Personal message (optional)">
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="A short note — what readings they should expect, how often you'll connect…"
              className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold-primary/40 transition resize-none text-sm"
            />
          </Field>

          <div>
            <p className="text-[12px] text-text-secondary mb-2">What you're asking for</p>
            <div className="space-y-1.5">
              {(Object.entries(PERMISSION_LABELS) as [keyof ClientPermissions, { label: string; description: string; baseline?: boolean }][]).map(
                ([key, lbl]) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gold-primary/10 bg-bg-secondary/30 hover:border-gold-primary/25 transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={permissions[key]}
                      disabled={lbl.baseline}
                      onChange={(e) =>
                        setPermissions((prev) => ({ ...prev, [key]: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 accent-gold-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-text-primary">
                        {lbl.label}
                        {lbl.baseline && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-text-tertiary">
                            required
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{lbl.description}</p>
                    </div>
                  </label>
                ),
              )}
            </div>
            <p className="text-[11px] text-text-tertiary mt-2 leading-snug">
              The client can un-tick any of these at accept-time. You can adjust
              later from their detail page.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gold-primary/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] text-text-secondary hover:text-text-primary transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`
              px-5 py-2 rounded-lg text-[13px] font-semibold transition
              ${canSubmit ? 'bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary hover:from-gold-light shadow-md shadow-gold-primary/30' : 'bg-bg-secondary text-text-tertiary cursor-not-allowed'}
            `}
          >
            {submitting ? 'Sending…' : 'Send invitation'}
          </button>
        </div>
      </form>
    </div>
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
