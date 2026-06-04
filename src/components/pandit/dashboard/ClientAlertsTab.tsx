'use client';

/**
 * Client Alerts tab — filtered alerts for one client. Reuses the
 * AlertsInbox rendering structure but scoped via ?client_id=.
 *
 * Pandit CRM P8.
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { PanditClient, PanditAlert, AlertKind } from '@/lib/pandit/types';

interface Props {
  client: PanditClient;
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
  if (Math.abs(diff) < day) return diff > 0 ? `today` : `today`;
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

export default function ClientAlertsTab({ client }: Props) {
  const { user } = useAuthStore();
  const [alerts, setAlerts] = useState<PanditAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeAcked, setIncludeAcked] = useState(false);

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
      const params = new URLSearchParams({ client_id: client.id });
      if (includeAcked) params.set('include_acked', '1');
      const res = await fetch(`/api/pandit/alerts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        console.error('[ClientAlertsTab] load failed:', body?.error || res.status);
        setError(body?.error || 'Failed to load');
        setLoading(false);
        return;
      }
      const body = (await res.json()) as { alerts: PanditAlert[] };
      setAlerts(body.alerts);
      setLoading(false);
    } catch (e) {
      console.error('[ClientAlertsTab] uncaught:', e);
      setError('Could not reach the server.');
      setLoading(false);
    }
  }, [user, client.id, includeAcked]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

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
        console.error('[ClientAlertsTab] ack failed:', body?.error);
        return;
      }
      // Optimistic: stamp acknowledged_at locally
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, acknowledged_at: new Date().toISOString() } : a)),
      );
    } catch (e) {
      console.error('[ClientAlertsTab] ack uncaught:', e);
    }
  }

  const grouped = useMemo(() => {
    return {
      critical: alerts.filter((a) => a.severity === 'critical'),
      notable: alerts.filter((a) => a.severity === 'notable'),
      info: alerts.filter((a) => a.severity === 'info'),
    };
  }, [alerts]);

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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold text-gold-light"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Alerts for {client.full_name}
          </h2>
          <p className="text-[12px] text-text-secondary mt-0.5">
            {alerts.length} {includeAcked ? 'total' : 'unacked'}
          </p>
        </div>
        <label className="flex items-center gap-2 text-[12px] text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={includeAcked}
            onChange={(e) => setIncludeAcked(e.target.checked)}
            className="w-3.5 h-3.5 accent-gold-primary"
          />
          Show acknowledged
        </label>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-bg-secondary/20 p-8 text-center">
          <div className="text-2xl mb-2" style={{ fontFamily: 'var(--font-devanagari-heading)', color: '#f0d48a' }}>ॐ</div>
          <p className="text-text-secondary text-[13px]">
            No {includeAcked ? '' : 'unacked '}alerts for {client.full_name}.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {(['critical', 'notable', 'info'] as const).map((tone) => {
            const lane = grouped[tone];
            if (lane.length === 0) return null;
            return (
              <Lane
                key={tone}
                title={tone === 'critical' ? 'Critical' : tone === 'notable' ? 'Notable' : 'Info'}
                tone={tone}
                alerts={lane}
                onAck={markAck}
              />
            );
          })}
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
  alerts: PanditAlert[];
  tone: 'critical' | 'notable' | 'info';
  onAck: (id: string) => void;
}) {
  const toneColor = {
    critical: 'text-[color:var(--color-alert-critical)]',
    notable: 'text-[color:var(--color-alert-notable)]',
    info: 'text-[color:var(--color-alert-info)]',
  }[tone];
  return (
    <section>
      <div className="flex items-baseline gap-2 mb-2">
        <h3
          className={`text-base font-bold ${toneColor} uppercase tracking-wider`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
        <span className="text-[12px] text-text-secondary">({alerts.length})</span>
      </div>
      <div className="space-y-2">
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
  alert: PanditAlert;
  tone: 'critical' | 'notable' | 'info';
  onAck: () => void;
}) {
  const a = alert;
  const acked = !!a.acknowledged_at;
  const styles = {
    critical: 'border-[color:var(--color-alert-critical)]/35 bg-[color:var(--color-alert-critical)]/8',
    notable: 'border-[color:var(--color-alert-notable)]/30 bg-[color:var(--color-alert-notable)]/8',
    info: 'border-[color:var(--color-alert-info)]/25 bg-[color:var(--color-alert-info)]/8',
  }[tone];
  return (
    <div className={`rounded-xl border ${styles} p-3 ${acked ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap text-[11px]">
            <span className="uppercase tracking-wider text-text-tertiary font-semibold">
              {a.kind.replace(/_/g, ' ')}
            </span>
            <span className="text-text-tertiary">·</span>
            <span className="text-text-secondary tabular-nums">{relTime(a.fires_at)}</span>
            {acked && (
              <>
                <span className="text-text-tertiary">·</span>
                <span className="text-[color:var(--color-state-active)]">noted</span>
              </>
            )}
          </div>
          <p
            className="font-medium text-text-primary leading-snug"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {ALERT_TITLES[a.kind] ?? a.kind}
          </p>
          {a.payload && (
            <p className="text-[12px] text-text-secondary mt-1 leading-snug">
              {summarisePayload(a.kind, a.payload)}
            </p>
          )}
        </div>
        {!acked && (
          <button
            onClick={onAck}
            className="text-[11px] px-3 py-1 rounded text-text-secondary hover:text-gold-light hover:bg-gold-primary/10 transition flex-none"
          >
            Note ✓
          </button>
        )}
      </div>
    </div>
  );
}

function summarisePayload(kind: AlertKind, payload: Record<string, unknown>): string {
  if (kind === 'maha_dasha_change' || kind === 'antar_dasha_change') {
    const from = payload.from as string | undefined;
    const to = payload.to as string | undefined;
    return from && to ? `${from} → ${to}` : '';
  }
  if (kind.startsWith('sade_sati')) {
    return `Saturn transit · ${(payload.phase as string) ?? ''} phase`;
  }
  if (kind === 'birthday') {
    return payload.kind === 'reminder_7d' ? '7-day reminder before solar return' : 'Day of birthday';
  }
  return '';
}
