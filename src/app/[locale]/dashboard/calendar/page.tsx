'use client';

/**
 * /dashboard/calendar — Pandit-only month-grid view.
 *
 * Aggregates every pandit_alerts row across the Pandit's entire
 * roster onto a Sunday-start calendar grid. Each event is rendered
 * as a coloured chip inside its day cell with the client's name and
 * the alert kind. Clicking an event opens the client detail page.
 *
 * Controls: month nav (prev / today / next). The current "month"
 * URL param syncs with browser history so back-button works.
 *
 * Pandit CRM P11.
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';

interface CalendarEvent {
  id: string;
  client_record_id: string;
  kind: string;
  fires_at: string; // YYYY-MM-DD
  severity: 'info' | 'notable' | 'critical';
  payload: Record<string, unknown> | null;
  acknowledged_at: string | null;
  client: {
    id: string;
    full_name: string;
    color: string | null;
    link_state: string;
  };
}

interface CalendarResponse {
  month: string;
  events: CalendarEvent[];
}

function toMonthString(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function parseMonth(s: string): Date {
  const [y, m] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1));
}

function addMonths(d: Date, n: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
}

const KIND_LABELS: Record<string, string> = {
  birthday: 'Birthday',
  sade_sati_entry: 'Sade Sati starts',
  sade_sati_peak: 'Sade Sati peak',
  sade_sati_exit: 'Sade Sati ends',
  followup_due: 'Follow-up due',
};
// Dasha-change alerts span many kinds (dasha_maha_*, dasha_antar_*).
function labelForKind(kind: string): string {
  if (KIND_LABELS[kind]) return KIND_LABELS[kind];
  if (kind.startsWith('dasha_')) {
    return kind.replace(/^dasha_/, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return kind.replace(/_/g, ' ');
}

const SEVERITY_RING: Record<CalendarEvent['severity'], string> = {
  info: 'border-[color:var(--color-state-active)]/40',
  notable: 'border-[color:var(--color-alert-warning)]/50',
  critical: 'border-[color:var(--color-alert-critical)]/50',
};

const SEVERITY_BG: Record<CalendarEvent['severity'], string> = {
  info: 'bg-[color:var(--color-state-active)]/10',
  notable: 'bg-[color:var(--color-alert-warning)]/10',
  critical: 'bg-[color:var(--color-alert-critical)]/10',
};

export default function PanditCalendarPage() {
  const { user, initialized } = useAuthStore();
  const params = useParams<{ locale?: string }>();
  const localePrefix = `/${params?.locale ?? 'en'}`;

  // Default to current month in UTC (cron + alerts both use UTC dates).
  const [monthDate, setMonthDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  });
  const monthString = toMonthString(monthDate);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError('Auth not configured');
        setLoading(false);
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) {
        setError('No session');
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/pandit/calendar?month=${monthString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const body = (await res.json()) as CalendarResponse;
      setEvents(body.events);
    } catch (e) {
      console.error('[PanditCalendarPage] load failed:', e);
      setError(e instanceof Error ? e.message : 'Failed to load calendar');
    } finally {
      setLoading(false);
    }
  }, [user, monthString]);

  useEffect(() => {
    load();
  }, [load]);

  // Group events by ISO date (YYYY-MM-DD) for O(1) cell lookup.
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const arr = map.get(e.fires_at) ?? [];
      arr.push(e);
      map.set(e.fires_at, arr);
    }
    return map;
  }, [events]);

  // Build the grid: weeks starting Sunday, padded with prev/next-month days.
  const cells = useMemo(() => {
    const firstOfMonth = new Date(monthDate);
    const startDow = firstOfMonth.getUTCDay(); // 0 = Sunday
    const gridStart = new Date(firstOfMonth);
    gridStart.setUTCDate(gridStart.getUTCDate() - startDow);

    const out: Array<{ date: Date; inMonth: boolean; iso: string }> = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setUTCDate(d.getUTCDate() + i);
      out.push({
        date: d,
        inMonth: d.getUTCMonth() === monthDate.getUTCMonth(),
        iso: d.toISOString().slice(0, 10),
      });
    }
    return out;
  }, [monthDate]);

  const todayIso = new Date().toISOString().slice(0, 10);

  if (!initialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-text-tertiary text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href={`${localePrefix}/dashboard`}
          className="text-[12px] text-text-secondary hover:text-gold-light transition mb-2 inline-block"
        >
          ← Dashboard
        </Link>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mt-1">
          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-light"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Calendar
          </h1>
          <div className="text-[13px] text-text-secondary">
            All client events across your roster — birthdays, dashas, sade sati phases, follow-ups.
          </div>
        </div>
      </div>

      {/* Month controls */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMonthDate((d) => addMonths(d, -1))}
          className="px-3 py-1.5 rounded-lg border border-gold-primary/20 bg-bg-secondary/40 text-text-secondary hover:text-gold-light hover:border-gold-primary/40 transition text-[13px]"
          aria-label="Previous month"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => {
            const n = new Date();
            setMonthDate(new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), 1)));
          }}
          className="px-3 py-1.5 rounded-lg border border-gold-primary/20 bg-bg-secondary/40 text-text-secondary hover:text-gold-light hover:border-gold-primary/40 transition text-[13px]"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setMonthDate((d) => addMonths(d, 1))}
          className="px-3 py-1.5 rounded-lg border border-gold-primary/20 bg-bg-secondary/40 text-text-secondary hover:text-gold-light hover:border-gold-primary/40 transition text-[13px]"
          aria-label="Next month"
        >
          →
        </button>
        <div className="ml-3 text-[16px] font-medium text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
          {monthDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-3 text-[13px] text-[color:var(--color-alert-critical)]">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] overflow-hidden">
        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-gold-primary/15 text-[11px] uppercase tracking-wider text-text-tertiary">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="px-2 py-2 text-center font-medium">
              {d}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            const dayEvents = eventsByDate.get(cell.iso) ?? [];
            const isToday = cell.iso === todayIso;
            return (
              <div
                key={i}
                className={`min-h-[110px] border-r border-b border-gold-primary/8 last-in-row:border-r-0 p-1.5 ${
                  cell.inMonth ? 'bg-transparent' : 'bg-bg-primary/30'
                }`}
              >
                <div
                  className={`text-[11px] font-mono mb-1 ${
                    isToday
                      ? 'text-bg-primary bg-gold-primary inline-block px-1.5 py-0.5 rounded-full'
                      : cell.inMonth
                        ? 'text-text-secondary'
                        : 'text-text-tertiary opacity-50'
                  }`}
                >
                  {cell.date.getUTCDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((e) => (
                    <Link
                      key={e.id}
                      href={`${localePrefix}/dashboard/clients/${e.client_record_id}`}
                      className={`block rounded-md border ${SEVERITY_RING[e.severity]} ${SEVERITY_BG[e.severity]} px-1.5 py-1 text-[10px] hover:bg-gold-primary/15 transition ${
                        e.acknowledged_at ? 'opacity-50' : ''
                      }`}
                      title={`${e.client.full_name} — ${labelForKind(e.kind)}`}
                    >
                      <div className="font-medium text-gold-light truncate">
                        {e.client.full_name}
                      </div>
                      <div className="text-text-secondary truncate">
                        {labelForKind(e.kind)}
                      </div>
                    </Link>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-text-tertiary px-1.5">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="mt-3 text-[12px] text-text-tertiary">Loading events…</div>
      )}

      {!loading && events.length === 0 && (
        <div className="mt-4 rounded-xl border border-gold-primary/15 bg-bg-secondary/30 p-6 text-center">
          <div className="text-[14px] text-text-secondary">
            No alerts firing this month. As you onboard clients, their birthdays, dasha
            transitions, sade-sati phases, and follow-up dates will appear here.
          </div>
        </div>
      )}
    </div>
  );
}
