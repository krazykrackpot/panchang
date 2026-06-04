/**
 * Pandit dashboard home — Today view.
 * Spec §18.1.
 *
 * Hero greeting + 4 KPI cards + today's critical alerts inline + today's
 * panchang strip + recent client activity. The "what to do next" surface.
 */

import Link from 'next/link';
import {
  MOCK_PANDIT,
  MOCK_ALERTS,
  MOCK_CLIENTS,
  relativeTimeSince,
} from '@/lib/pandit/mock-fixtures';
import AlertCard from '@/components/pandit/AlertCard';
import KpiCard from '@/components/pandit/KpiCard';

export default function PanditDashboardHome() {
  const criticalAlerts = MOCK_ALERTS.filter((a) => a.severity === 'critical' && !a.acknowledged_at);
  const notableCount = MOCK_ALERTS.filter((a) => a.severity === 'notable' && !a.acknowledged_at).length;
  const todayEvents = MOCK_ALERTS.filter(
    (a) => new Date(a.fires_at).getTime() <= new Date('2026-06-04T23:59:59Z').getTime(),
  );
  const followupsDue = MOCK_CLIENTS.filter(
    (c) => c.next_followup_at && new Date(c.next_followup_at).getTime() < new Date('2026-06-10T00:00:00Z').getTime(),
  ).length;

  const recentActivity = [...MOCK_CLIENTS]
    .filter((c) => c.last_consult_at)
    .sort((a, b) => (a.last_consult_at! < b.last_consult_at! ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Hero greeting */}
      <section className="mb-8">
        <p
          className="text-xl sm:text-2xl text-gold-light mb-1"
          style={{ fontFamily: 'var(--font-devanagari-heading)' }}
        >
          शुभं प्रभातम्, {MOCK_PANDIT.full_name_hi.split(' ').slice(-2).join(' ')}
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1
            className="text-3xl sm:text-4xl font-bold text-text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Good morning, Panditji
          </h1>
          <p className="text-text-secondary text-[13px] tabular-nums">
            Tuesday, 4 June 2026 · 09:14 IST
          </p>
        </div>
      </section>

      {/* KPI row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <KpiCard
          label="Today"
          count={todayEvents.length}
          sublabel={`${criticalAlerts.length} critical · ${notableCount} notable`}
          href="/en/dashboard-preview/pandit/alerts"
        />
        <KpiCard
          label="Critical Alerts"
          count={criticalAlerts.length}
          sublabel="across 3 clients"
          tone="critical"
          href="/en/dashboard-preview/pandit/alerts"
        />
        <KpiCard
          label="Follow-ups"
          count={followupsDue}
          sublabel="due this week"
          tone="info"
          href="/en/dashboard-preview/pandit/calendar"
        />
        <KpiCard
          label="This Week"
          count="14"
          sublabel="events across 9 clients"
          href="/en/dashboard-preview/pandit/calendar"
        />
      </section>

      {/* Today's critical alerts */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2
              className="text-xl font-bold text-gold-light"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Today's critical alerts
            </h2>
            <p className="text-[12px] text-text-secondary mt-0.5">
              Events you should act on before tomorrow
            </p>
          </div>
          <Link
            href="/en/dashboard-preview/pandit/alerts"
            className="text-[12px] text-gold-primary hover:text-gold-light transition"
          >
            All alerts →
          </Link>
        </div>

        <div className="space-y-3">
          {criticalAlerts.slice(0, 3).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>

      {/* Today's panchang strip */}
      <section className="mb-10">
        <div className="mb-4">
          <h2
            className="text-xl font-bold text-gold-light"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Today's panchang · Mumbai
          </h2>
          <p className="text-[12px] text-text-secondary mt-0.5">For your reference and client consultations</p>
        </div>

        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
            <PanchangCell label="Tithi" value="Kṛṣṇa Saptami" hindi="कृष्ण सप्तमी" />
            <PanchangCell label="Nakshatra" value="Mūla → Pūrva Aṣāḍha" hindi="मूल → पूर्व आषाढ़ा" />
            <PanchangCell label="Vara" value="Maṅgalavāra" hindi="मंगलवार" />
            <PanchangCell label="Yoga" value="Vyāghāta → Harṣaṇa" hindi="व्याघात → हर्षण" />
            <PanchangCell label="Karaṇa" value="Vaṇij → Viṣṭi" hindi="वणिज → विष्टि" />
            <PanchangCell label="Sunrise" value="05:23 IST" hindi="" tabular />
            <PanchangCell label="Sunset" value="19:21 IST" hindi="" tabular />
            <PanchangCell
              label="Rāhu Kāla"
              value="15:32–17:05"
              hindi="(avoid)"
              tabular
              warn
            />
          </div>
          <div className="mt-4 pt-4 border-t border-gold-primary/10 flex flex-wrap items-center gap-3 text-[12px]">
            <span className="text-text-secondary">Suggested muhurta windows:</span>
            <span className="font-medium text-gold-light tabular-nums">06:48–08:21</span>
            <span className="font-medium text-gold-light tabular-nums">10:45–12:14</span>
            <Link href="#" className="ml-auto text-gold-primary hover:text-gold-light transition">
              Find specific muhurta →
            </Link>
          </div>
        </div>
      </section>

      {/* Recent activity */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2
              className="text-xl font-bold text-gold-light"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Recent client activity
            </h2>
            <p className="text-[12px] text-text-secondary mt-0.5">Your last 4 touch-points</p>
          </div>
          <Link
            href="/en/dashboard-preview/pandit/clients"
            className="text-[12px] text-gold-primary hover:text-gold-light transition"
          >
            View all clients ({MOCK_CLIENTS.length}) →
          </Link>
        </div>

        <div className="space-y-2">
          {recentActivity.map((c) => (
            <Link
              key={c.id}
              href={`/en/dashboard-preview/pandit/clients/${c.id}` as never}
              className="
                block rounded-xl border border-gold-primary/10 bg-bg-secondary/30
                hover:border-gold-primary/30 hover:bg-bg-secondary/50 transition
                p-3
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex-none w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-[12px]"
                  style={{ backgroundColor: c.avatar_color }}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-primary">
                      {c.display_label ?? c.full_name}
                    </span>
                    <span className="text-[11px] text-text-tertiary">
                      MD {c.current_maha_lord_en} / AD {c.current_antar_lord_en}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-secondary mt-0.5 truncate">
                    {c.pandit_notes ?? '—'}
                  </p>
                </div>
                <div className="flex-none text-right text-[11px] text-text-tertiary tabular-nums">
                  {relativeTimeSince(c.last_consult_at)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sticky add-client (bottom-right on desktop, bottom-centre on mobile) */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/en/dashboard-preview/pandit/add-client"
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

function PanchangCell({
  label,
  value,
  hindi,
  tabular,
  warn,
}: {
  label: string;
  value: string;
  hindi: string;
  tabular?: boolean;
  warn?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-text-tertiary font-semibold">
        {label}
      </p>
      <p
        className={`mt-0.5 ${warn ? 'text-[color:var(--color-alert-critical)]' : 'text-text-primary'} ${tabular ? 'tabular-nums' : ''} font-medium`}
      >
        {value}
      </p>
      {hindi && (
        <p
          className="text-[11px] text-[color:var(--color-text-devanagari)] mt-0.5"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          {hindi}
        </p>
      )}
    </div>
  );
}
