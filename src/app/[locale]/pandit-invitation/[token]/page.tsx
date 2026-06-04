'use client';

/**
 * /pandit-invitation/[token] — public invitation landing page.
 *
 * Resolves the token, shows Pandit identity + message + permissions
 * checklist, and offers Accept / Decline. If recipient is not signed
 * in, deep-link to /signin with returnTo=this URL; on first sign-in
 * they're brought back here.
 *
 * Spec §5.2 (Path A) + §5.3 (permissions modal at accept).
 *
 * Pandit CRM P6.
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';

interface InvitationData {
  invitation: {
    id: string;
    status: string;
    sent_at: string;
    expires_at: string;
    pandit_message: string | null;
    permissions_requested: Record<string, boolean>;
    invited_email: string;
    has_existing_account: boolean;
  };
  pandit: {
    display_name: string;
    subtitle: string | null;
  };
  client_record: {
    full_name: string | null;
  };
}

const PERMISSION_LABELS: Record<string, { en: string; description: string }> = {
  read_birth_data: {
    en: 'Read your birth data',
    description: 'Required — without this, the Pandit can\'t see your chart',
  },
  read_family_charts: {
    en: 'See your family members',
    description: 'For family-level synthesis (marriage, children)',
  },
  generate_readings: {
    en: 'Generate readings on your chart',
    description: 'Kundalis, tippannis, transit forecasts',
  },
  push_deliverables: {
    en: 'Push readings to your dashboard',
    description: 'You see new readings in your Dekho Panchang dashboard',
  },
  send_alerts_to_client: {
    en: 'Send alerts to you',
    description: 'Notify you of major dasha changes, sade sati phases, eclipses',
  },
  view_consultation_history: {
    en: 'Share consultation history with you',
    description: 'Summaries the Pandit writes appear in your dashboard',
  },
};

export default function InvitationLandingPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { user, initialized } = useAuthStore();

  const [data, setData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState<'accept' | 'decline' | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!params?.token) return;
      try {
        const res = await fetch(`/api/pandit/invitations/${params.token}`);
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string; status?: string };
          if (!cancelled) {
            setError(body.error || `Failed to load (${res.status})`);
            setLoading(false);
          }
          return;
        }
        const body = (await res.json()) as InvitationData;
        if (!cancelled) {
          setData(body);
          setPermissionsGranted({ ...body.invitation.permissions_requested });
          setLoading(false);
        }
      } catch (e) {
        console.error('[InvitationLandingPage] uncaught:', e);
        if (!cancelled) {
          setError('Could not reach the server. Please retry.');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params?.token]);

  async function respond(action: 'accept' | 'decline') {
    if (!user) {
      // Deep link to signin with returnTo for post-signin redirect
      const returnTo = encodeURIComponent(`/pandit-invitation/${params.token}`);
      router.push(`/?signin=1&returnTo=${returnTo}` as never);
      return;
    }
    setSubmitting(action);
    setResultMessage(null);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Auth not available');
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error('No session');

      const url = `/api/pandit/invitations/${params.token}/${action}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: action === 'accept'
          ? JSON.stringify({ permissions_granted: permissionsGranted })
          : '{}',
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      if (action === 'accept') {
        setResultMessage(
          `Connected with ${data?.pandit.display_name}. They can now share readings directly with you.`,
        );
      } else {
        setResultMessage('Invitation declined. The Pandit has been notified.');
      }
    } catch (e) {
      console.error(`[InvitationLandingPage] ${action} failed:`, e);
      setSubmitting(null);
      setResultMessage(`Could not ${action} the invitation. ${e instanceof Error ? e.message : ''}`);
    }
  }

  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="animate-pulse text-text-tertiary text-sm">Loading invitation…</div>
      </div>
    );
  }

  if (error || !data) {
    const isExpired = error === 'invitation_expired' || error === 'invitation_not_pending';
    const isNotFound = error === 'invitation_not_found';
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-5xl text-gold-light mb-4" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
            {isExpired || isNotFound ? '✕' : '⚠'}
          </div>
          <h1
            className="text-2xl font-bold text-gold-light mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isExpired
              ? 'This invitation is no longer valid'
              : isNotFound
                ? 'Invitation not found'
                : 'Something went wrong'}
          </h1>
          <p className="text-text-secondary mb-6">
            {isExpired
              ? 'The Pandit can send you a new invitation if you\'d like to connect.'
              : isNotFound
                ? 'This invitation link doesn\'t exist or was revoked.'
                : error}
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 transition"
          >
            Go to Dekho Panchang
          </Link>
        </div>
      </div>
    );
  }

  // Success state (post-accept / post-decline)
  if (resultMessage && !submitting) {
    const isDecline = resultMessage.toLowerCase().startsWith('invitation declined');
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div
            className="text-5xl mb-4"
            style={{ fontFamily: 'var(--font-devanagari-heading)', color: isDecline ? '#8a8478' : '#f0d48a' }}
          >
            {isDecline ? '🙏' : 'ॐ'}
          </div>
          <h1
            className="text-2xl font-bold text-gold-light mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isDecline ? 'Invitation declined' : 'Connected'}
          </h1>
          <p className="text-text-secondary mb-6 leading-relaxed">{resultMessage}</p>
          <Link
            href={isDecline ? ('/' as never) : ('/dashboard' as never)}
            className="inline-block px-5 py-2.5 rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 transition"
          >
            {isDecline ? 'Back to Dekho Panchang' : 'Go to your dashboard'}
          </Link>
        </div>
      </div>
    );
  }

  const expiresIn = Math.ceil(
    (new Date(data.invitation.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-[#1a1f4e]/60 via-[#111638]/70 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-8 sm:p-12">
          {/* Hero */}
          <div className="text-center mb-8">
            <div
              className="text-4xl text-gold-light mb-3"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              ॐ
            </div>
            <p
              className="text-base text-[color:var(--color-text-devanagari)] mb-1"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              पंडित जी का आमन्त्रण
            </p>
            <h1
              className="text-2xl sm:text-3xl font-bold text-gold-light"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {data.pandit.display_name} invites you to connect
            </h1>
            {data.pandit.subtitle && (
              <p className="text-text-secondary text-sm mt-2">{data.pandit.subtitle}</p>
            )}
          </div>

          {/* Pandit's message */}
          {data.invitation.pandit_message && (
            <div className="mb-6 rounded-xl border border-gold-primary/15 bg-gold-primary/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-gold-primary mb-2">
                A note from {data.pandit.display_name}
              </p>
              <p className="text-[14px] text-text-primary leading-relaxed whitespace-pre-wrap">
                {data.invitation.pandit_message}
              </p>
            </div>
          )}

          {/* What linking does */}
          <div className="mb-6">
            <h2
              className="text-base font-bold text-gold-light mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              What linking does
            </h2>
            <p className="text-text-secondary text-[14px] leading-relaxed mb-4">
              Linking lets {data.pandit.display_name} send readings, tippannis, and
              alerts about important astrological events for you directly to your
              Dekho Panchang dashboard. You stay in control — you can pause or
              revoke the link at any time from your settings.
            </p>
          </div>

          {/* Permissions checklist */}
          <div className="mb-6">
            <h2
              className="text-base font-bold text-gold-light mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              What you're granting
            </h2>
            <div className="space-y-2">
              {Object.entries(data.invitation.permissions_requested).map(([key, requested]) => {
                if (!requested) return null;
                const label = PERMISSION_LABELS[key];
                if (!label) return null;
                const checked = permissionsGranted[key] ?? false;
                const isBaseline = key === 'read_birth_data';
                return (
                  <label
                    key={key}
                    className={`
                      flex items-start gap-3 p-3 rounded-lg cursor-pointer transition
                      ${checked ? 'border border-[color:var(--color-state-active)]/30 bg-[color:var(--color-state-active)]/10' : 'border border-gold-primary/10 bg-bg-secondary/30 hover:border-gold-primary/30'}
                      ${isBaseline ? 'opacity-90' : ''}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isBaseline}
                      onChange={(e) =>
                        setPermissionsGranted((prev) => ({ ...prev, [key]: e.target.checked }))
                      }
                      className="mt-1 w-4 h-4 accent-gold-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary text-[14px]">
                        {label.en}
                        {isBaseline && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-text-tertiary">
                            required
                          </span>
                        )}
                      </p>
                      <p className="text-[12px] text-text-secondary leading-snug mt-0.5">
                        {label.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Expiry hint */}
          <p className="text-[11px] text-text-tertiary text-center mb-6">
            This invitation expires in {expiresIn} day{expiresIn === 1 ? '' : 's'}.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => respond('decline')}
              disabled={!!submitting}
              className={`
                flex-1 px-5 py-3 rounded-lg text-sm font-medium transition
                ${submitting ? 'bg-bg-secondary text-text-tertiary cursor-not-allowed' : 'border border-gold-primary/20 text-text-secondary hover:text-text-primary hover:border-gold-primary/40'}
              `}
            >
              {submitting === 'decline' ? 'Declining…' : 'Decline'}
            </button>
            <button
              type="button"
              onClick={() => respond('accept')}
              disabled={!!submitting}
              className={`
                flex-[2] px-5 py-3 rounded-lg text-sm font-semibold transition
                ${submitting
                  ? 'bg-bg-secondary text-text-tertiary cursor-not-allowed'
                  : 'bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary shadow-md shadow-gold-primary/30 hover:from-gold-light hover:shadow-lg hover:shadow-gold-primary/40'}
              `}
            >
              {submitting === 'accept'
                ? 'Connecting…'
                : user
                  ? `Accept and connect with ${data.pandit.display_name.split(' ').slice(-1)[0]}`
                  : 'Sign in to accept'}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-text-tertiary mt-6">
          Don't recognise this Pandit?
          <Link href="/" className="ml-1 text-gold-primary hover:text-gold-light transition">
            Ignore and go to Dekho Panchang
          </Link>
        </p>
      </div>
    </div>
  );
}
