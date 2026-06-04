'use client';

/**
 * Pandit dashboard home (P1 scaffold).
 *
 * In P1 we ship the SHELL — first-time experience for a Pandit who just
 * flipped account_type='pandit' and has zero clients. The KPI cards, alert
 * panel, and recent activity surface empty states with on-ramp CTAs per
 * spec §22 micro-copy + §16.2 obvious workflows.
 *
 * P2 wires real client data into this shell. The component shape is
 * already what we want — empty values now, real values then.
 *
 * Spec: docs/specs/2026-06-04-pandit-crm.md §18.1 + §22 + §25.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import KpiCard from '@/components/pandit/KpiCard';

interface PanditProfile {
  display_name: string | null;
  default_report_locale?: string;
}

export default function PanditDashboardHome() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<PanditProfile | null>(null);
  const [clientCount, setClientCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  // Date is rendered client-side only — SSR's server timezone may
  // differ from the visitor's, which would trip React hydration
  // mismatch on the localised date string. Empty on SSR, populated
  // post-mount. Gemini PR #406 round 3 MED.
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    setTodayStr(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }
      // Two independent fetches: profile (for display_name) + clients
      // count (for first-time empty state). Use a single round trip via
      // Promise.all so the dashboard renders ~150ms faster than
      // sequential awaits would.
      const [profileResult, countResult] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('display_name')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('pandit_clients')
          .select('id', { count: 'exact', head: true }),
      ]);

      if (profileResult.error) {
        console.error('[PanditDashboardHome] profile load failed:', profileResult.error);
      }
      if (countResult.error) {
        console.error('[PanditDashboardHome] count load failed:', countResult.error);
      }
      if (!cancelled) {
        setProfile(profileResult.data ?? null);
        setClientCount(countResult.count ?? 0);
        setLoading(false);
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const displayName =
    profile?.display_name ?? user?.user_metadata?.full_name ?? 'Panditji';

  // Wired to real count. A Pandit with zero clients sees the welcome
  // reveal + "Add your first client" CTA; one with any clients sees
  // the standard dashboard surface (KPIs + future content per phases).
  // Gemini PR #406 round 3 HIGH.
  const isFirstTime = clientCount === 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-bg-secondary/60 rounded" />
          <div className="h-4 w-48 bg-bg-secondary/40 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="h-32 bg-bg-secondary/40 rounded-2xl" />
            <div className="h-32 bg-bg-secondary/40 rounded-2xl" />
            <div className="h-32 bg-bg-secondary/40 rounded-2xl" />
            <div className="h-32 bg-bg-secondary/40 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Hero greeting */}
      <section className="mb-8">
        <p
          className="text-xl sm:text-2xl text-gold-light mb-1"
          style={{ fontFamily: 'var(--font-devanagari-heading)' }}
        >
          शुभं प्रभातम्, पंडित जी
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1
            className="text-3xl sm:text-4xl font-bold text-text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Good morning, {displayName}
          </h1>
          <p
            className="text-text-secondary text-[13px] tabular-nums"
            suppressHydrationWarning
          >
            {todayStr || ' ' /* non-breaking space placeholder before mount */}
          </p>
        </div>
      </section>

      {/* KPI row — all zeros until P2 wires data */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <KpiCard
          label="Today"
          count="0"
          sublabel="No events scheduled"
          href="/dashboard/alerts"
        />
        <KpiCard
          label="Critical Alerts"
          count="0"
          sublabel="Quiet skies"
          tone="critical"
          href="/dashboard/alerts"
        />
        <KpiCard
          label="Follow-ups"
          count="0"
          sublabel="None due"
          tone="info"
          href="/dashboard/calendar"
        />
        <KpiCard label="This Week" count="—" sublabel="Add clients to begin" href="/dashboard/clients" />
      </section>

      {/* First-time empty state — the dominant block when isFirstTime */}
      {isFirstTime && (
        <section className="mb-10">
          <div
            className="
              relative overflow-hidden rounded-2xl border border-gold-primary/20
              bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27]
              p-8 sm:p-12 text-center
            "
          >
            {/* Subtle yantra background pattern */}
            <div className="absolute inset-0 yantra-bg opacity-50" aria-hidden />
            <div className="relative">
              <div className="mb-4">
                <span
                  className="inline-block text-4xl"
                  style={{ fontFamily: 'var(--font-devanagari-heading)', color: '#f0d48a' }}
                >
                  ॐ
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-gold-light mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Welcome, {displayName.split(' ').slice(-1)[0]}
              </h2>
              <p
                className="text-[color:var(--color-text-devanagari)] text-base mb-5"
                style={{ fontFamily: 'var(--font-devanagari-body)' }}
              >
                आपकी ज्योतिष-यात्रा यहीं से प्रारम्भ होती है।
              </p>
              <p className="text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
                Your practice begins with your first client. Add their birth
                details, and we'll handle the kundali, tippanni, and dasha
                tracking — so you can focus on the consultation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/dashboard/clients/new"
                  className="
                    inline-flex items-center gap-2 px-6 py-3 rounded-full
                    bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary
                    font-semibold text-sm
                    shadow-lg shadow-gold-primary/30
                    hover:from-gold-light hover:shadow-xl hover:shadow-gold-primary/40
                    transition-all
                  "
                >
                  + Add your first client
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="
                    inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm
                    text-text-secondary hover:text-gold-light transition
                  "
                >
                  Configure letterhead first →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Workflow hint cards — what you can do in this dashboard */}
      <section className="mb-10">
        <h2
          className="text-base font-bold text-gold-light mb-4 uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          What you can do here
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HintCard
            title="Onboard clients"
            description="Add a client by birth details. Optionally invite them by email so readings push directly to their Dekho Panchang dashboard."
            href="/dashboard/clients"
            cta="Open roster →"
          />
          <HintCard
            title="Generate tippanni"
            description="Open a client's chart, draft a tippanni, edit in your voice. Send as PDF or push to their dashboard with one tap."
            href="/dashboard/clients"
            cta="See how →"
          />
          <HintCard
            title="Stay ahead of events"
            description="We track every client's dasha sandhi, sade sati phase, and major transits. Alerts arrive before events, not after."
            href="/dashboard/alerts"
            cta="View alerts →"
          />
          <HintCard
            title="See the month at a glance"
            description="Every client's birthday, dasha sandhi, sade sati phase, and follow-up on a single calendar — clickable through to the client."
            href="/dashboard/calendar"
            cta="Open calendar →"
          />
        </div>
      </section>
    </div>
  );
}

function HintCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href as never}
      className="
        group block rounded-2xl border border-gold-primary/12 p-5
        bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27]
        hover:border-gold-primary/30 hover:-translate-y-0.5 hover:shadow-lg
        transition-all duration-200
      "
    >
      <h3
        className="text-base font-bold text-gold-light mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h3>
      <p className="text-[13px] text-text-secondary leading-relaxed mb-3">{description}</p>
      <span className="text-[12px] text-gold-primary group-hover:text-gold-light transition flex items-center gap-1">
        {cta}
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}
