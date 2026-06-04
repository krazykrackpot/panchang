'use client';

/**
 * Production AlertsInbox — /dashboard/alerts. Pandit-only via the
 * AccountTypeRouter at /dashboard. Visual lifted from prototype
 * (/dashboard-preview/pandit/alerts) with real pandit_alerts data.
 *
 * Spec §18.6.
 *
 * Pandit CRM P8.
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { PanditAlert, AlertKind, AlertSeverity } from '@/lib/pandit/types';

interface HydratedAlert extends PanditAlert {
  client_full_name: string;
}

const ALERT_TITLES: Partial<Record<AlertKind, string>> = {
  maha_dasha_change: 'Mahā Daśā transition',
  antar_dasha_change: 'Antar Daśā transition',
  pratyantar_dasha_change: 'Pratyantar transition',
  sade_sati_entry: 'Sade Sati entering',
  sade_sati_peak: 'Sade Sati peak phase',
  sade_sati_exit: 'Sade Sati exiting',
  jupiter_aspect_natal: 'Jupiter aspect to natal',
  saturn_ingress_natal_house: 'Saturn ingress to natal house',
  rahu_ketu_ingress: 'Rahu / Ketu ingress',
  eclipse_impact: 'Eclipse impact on natal',
  birthday: 'Birthday',
  followup_due: 'Follow-up due',
  birthday_solar_return: 'Solar return',
};

function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = then - now;
  const day = 24 * 60 * 60 * 1000;
  if (Math.abs(diff) < day) return diff > 0 ? `in <1d` : `today`;
  const days = Math.round(diff / day);
  if (days > 0) {
    if (days < 7) return `in ${days}d`;
    if (days < 30) return `in ${Math.floor(days / 7)}w`;
    return `in ${Math.floor(days / 30)}mo`;
  }
  const abs = Math.abs(days);
  if (abs < 7) return `${abs}d ago`;
  if (abs < 30) return `${Math.floor(abs / 7)}w ago`;
  return `${Math.floor(abs / 30)}mo ago`;
}

function formatPayload(kind: AlertKind, payload: Record<string, unknown> | null): string {
  if (!payload) return '';
  if (kind === 'maha_dasha_change' || kind === 'antar_dasha_change') {
    const from = payload.from as string | undefined;
    const to = payload.to as string | undefined;
    return from && to ? `${from} → ${to}` : from ? `${from} period ending` : '';
  }
  if (kind.startsWith('sade_sati')) {
    return `Saturn transit affecting natal Moon · ${(payload.phase as string) ?? ''} phase`;
  }
  if (kind === 'birthday') {
    return payload.kind === 'reminder_7d' ? '7 days out — solar return reading window opens' : 'Today';
  }
  if (kind === 'followup_due') {
    return 'You scheduled this follow-up';
  }
  return '';
}

export default function AlertsInboxPage() {
  const { user, initialized } = useAuthStore();
  const [alerts, setAlerts] = useState<HydratedAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
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
      const res = await fetch('/api/pandit/alerts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        console.error('[AlertsInbox] load failed:', body?.error || res.status);
        setError(body?.error || 'Failed to load');
        setLoading(false);
        return;
      }
      const body = (await res.json()) as { alerts: HydratedAlert[] };
      setAlerts(body.alerts);
      setLoading(false);
    } catch (e) {
      console.error('[AlertsInbox] uncaught:', e);
      setError('Could not reach the server.');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialized) load();
  }, [load, initialized]);

  async function markAck(id: string) {
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) return;
      const res = await fetch('/api/pandit/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ alert_id: id, action: 'ack' }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        console.error('[AlertsInbox] ack failed:', body?.error);
        return;
      }
      // Optimistic: drop the row from the inbox (we showed unacked only).
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error('[AlertsInbox] ack uncaught:', e);
    }
  }

  const { critical, notable, info } = useMemo(() => {
    return {
      critical: alerts.filter((a) => a.severity === 'critical'),
      notable: alerts.filter((a) => a.severity === 'notable'),
      info: alerts.filter((a) => a.severity === 'info'),
    };
  }, [alerts]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
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
            Alerts inbox
          </h1>
          <p className="text-[13px] text-text-secondary">
            <span className="text-text-primary font-medium">{alerts.length}</span> unacked
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-32 rounded-2xl bg-bg-secondary/30 animate-pulse" />
          <div className="h-32 rounded-2xl bg-bg-secondary/30 animate-pulse" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-6 text-center">
          <p className="text-[color:var(--color-alert-critical)] font-medium mb-2">
            Couldn't load alerts
          </p>
          <p className="text-text-secondary text-[13px] mb-4">{error}</p>
          <button
            onClick={load}
            className="px-4 py-2 rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 text-[13px] transition"
          >
            Retry
          </button>
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-bg-secondary/20 p-12 text-center">
          <div className="text-3xl mb-3" style={{ fontFamily: 'var(--font-devanagari-heading)', color: '#f0d48a' }}>ॐ</div>
          <h2
            className="text-xl font-bold text-gold-light mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Quiet skies
          </h2>
          <p className="text-text-secondary text-[13px] max-w-md mx-auto">
            No outstanding alerts for your clients. Alerts arrive as dasha
            sandhis, sade sati phase transitions, birthdays, and follow-ups
            approach.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <Lane title="Critical" alerts={critical} tone="critical" onAck={markAck} />
          <Lane title="Notable" alerts={notable} tone="notable" onAck={markAck} />
          <Lane title="Info" alerts={info} tone="info" onAck={markAck} />
        </div>
      )}
    </div>
  );
}

function Lane({
  title,
  alerts,
  tone,
  onAck,
}: {
  title: string;
  alerts: HydratedAlert[];
  tone: 'critical' | 'notable' | 'info';
  onAck: (id: string) => void;
}) {
  if (alerts.length === 0) return null;
  const toneColor = {
    critical: 'text-[color:var(--color-alert-critical)]',
    notable: 'text-[color:var(--color-alert-notable)]',
    info: 'text-[color:var(--color-alert-info)]',
  }[tone];
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-3">
        <h2
          className={`text-xl font-bold ${toneColor} uppercase tracking-wider`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
        <span className="text-[13px] text-text-secondary">({alerts.length})</span>
      </div>
      <div className="space-y-2.5">
        {alerts.map((a) => (
          <AlertRow key={a.id} alert={a} tone={tone} onAck={() => onAck(a.id)} />
        ))}
      </div>
    </section>
  );
}

function AlertRow({
  alert,
  tone,
  onAck,
}: {
  alert: HydratedAlert;
  tone: 'critical' | 'notable' | 'info';
  onAck: () => void;
}) {
  const a = alert;
  const styles = {
    critical: {
      border: 'border-[color:var(--color-alert-critical)]/35',
      bg: 'bg-[color:var(--color-alert-critical)]/8',
      dot: 'bg-[color:var(--color-alert-critical)]',
      label: 'text-[color:var(--color-alert-critical)]',
    },
    notable: {
      border: 'border-[color:var(--color-alert-notable)]/30',
      bg: 'bg-[color:var(--color-alert-notable)]/8',
      dot: 'bg-[color:var(--color-alert-notable)]',
      label: 'text-[color:var(--color-alert-notable)]',
    },
    info: {
      border: 'border-[color:var(--color-alert-info)]/25',
      bg: 'bg-[color:var(--color-alert-info)]/8',
      dot: 'bg-[color:var(--color-alert-info)]',
      label: 'text-[color:var(--color-alert-info)]',
    },
  }[tone];

  return (
    <div className={`rounded-xl border ${styles.border} ${styles.bg} p-4 transition hover:brightness-110`}>
      <div className="flex items-start gap-3">
        <div
          className={`w-2 h-2 rounded-full ${styles.dot} mt-2 flex-none ${tone === 'critical' ? 'animate-pulse' : ''}`}
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.label}`}>
              {tone.toUpperCase()}
            </span>
            <span className="text-text-tertiary text-[10px]">·</span>
            <Link
              href={`/dashboard/clients/${a.client_record_id}` as never}
              className="text-[11px] text-text-secondary hover:text-gold-light transition"
            >
              {a.client_full_name}
            </Link>
            <span className="text-text-tertiary text-[10px]">·</span>
            <span className="text-[11px] text-text-tertiary tabular-nums">
              {relTime(a.fires_at)}
            </span>
          </div>
          <h4
            className="font-medium text-text-primary leading-snug mb-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {ALERT_TITLES[a.kind] ?? a.kind}
          </h4>
          {formatPayload(a.kind, a.payload) && (
            <p className="text-[13px] text-text-secondary leading-relaxed mb-2">
              {formatPayload(a.kind, a.payload)}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <Link
              href={`/dashboard/clients/${a.client_record_id}` as never}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 transition"
            >
              Open chart
            </Link>
            <button
              onClick={onAck}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-bg-secondary text-text-secondary border border-gold-primary/15 hover:border-gold-primary/30 hover:text-text-primary transition"
            >
              Note ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
