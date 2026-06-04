'use client';

/**
 * Client Chart tab — wires the existing kundali engine to a Pandit's
 * client.birth_data.
 *
 * Spec §18.4. Pandit CRM P3.
 *
 * Reuses the canonical /api/kundali endpoint + ChartNorth component
 * already used on the consumer /kundali page. Zero engine duplication
 * — the same maths that renders a seeker's own chart renders the
 * Pandit's view of a client.
 *
 * Renders:
 *   - Rāśi (D1) + Navāṁśa (D9) side-by-side
 *   - Current Maha + Antar + Pratyantar dasha progress bars
 *   - Sade Sati phase badge (when active)
 *   - Key yogas inline with classical citations
 *   - Quick actions rail (pandit-violet)
 *
 * Calls onDashaResolved with the current Maha/Antar/Pratyantar lord
 * names so the parent's sticky context strip can show them.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { PanditClient } from '@/lib/pandit/types';
import type { KundaliData, DashaEntry, BirthData as EngineBirthData } from '@/types/kundali';
import ChartNorth from '@/components/kundali/ChartNorth';
import DashaProgressBar from '@/components/pandit/DashaProgressBar';

interface Props {
  client: PanditClient;
  onDashaResolved?: (summary: {
    mahaLord?: string;
    antarLord?: string;
    pratyantarLord?: string;
  }) => void;
}

interface CurrentDasha {
  maha?: DashaEntry;
  antar?: DashaEntry;
  pratyantar?: DashaEntry;
}

function findCurrentDasha(dashas: DashaEntry[] | undefined, now: number): CurrentDasha {
  if (!dashas) return {};
  const inRange = (d: DashaEntry) =>
    new Date(d.startDate).getTime() <= now && now < new Date(d.endDate).getTime();
  const maha = dashas.find((d) => d.level === 'maha' && inRange(d));
  if (!maha) return {};
  const antar = maha.subPeriods?.find((d) => d.level === 'antar' && inRange(d));
  if (!antar) return { maha };
  const pratyantar = antar.subPeriods?.find((d) => d.level === 'pratyantar' && inRange(d));
  return { maha, antar, pratyantar };
}

/** Adapter: pandit_clients.birth_data → engine BirthData. */
function toEngineBirthData(client: PanditClient): EngineBirthData {
  return {
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
}

export default function ClientChartTab({ client, onDashaResolved }: Props) {
  const { user } = useAuthStore();
  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
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
        const res = await fetch('/api/kundali', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(toEngineBirthData(client)),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          console.error('[ClientChartTab] kundali failed:', body?.error || res.status);
          if (!cancelled) {
            setError(body?.error || `Could not compute kundali (${res.status})`);
            setLoading(false);
          }
          return;
        }
        const data = (await res.json()) as KundaliData;
        if (!cancelled) {
          setKundali(data);
          setLoading(false);
        }
      } catch (e) {
        console.error('[ClientChartTab] uncaught:', e);
        if (!cancelled) {
          setError('Could not reach the chart engine.');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [client, user]);

  const currentDasha = useMemo(
    () => (kundali ? findCurrentDasha(kundali.dashas, Date.now()) : {}),
    [kundali],
  );

  useEffect(() => {
    if (!onDashaResolved) return;
    if (currentDasha.maha) {
      onDashaResolved({
        mahaLord: currentDasha.maha.planetName.en,
        antarLord: currentDasha.antar?.planetName.en,
        pratyantarLord: currentDasha.pratyantar?.planetName.en,
      });
    }
  }, [currentDasha, onDashaResolved]);

  if (loading) return <ChartTabSkeleton />;
  if (error || !kundali) return <ChartTabError error={error || 'Unknown error'} />;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Charts + dasha + yogas */}
      <div className="xl:col-span-8 space-y-6">
        {/* Rasi + Navamsa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChartCard title="Rāśi (D1)" subtitle="राशि" data={kundali.chart} />
          <ChartCard title="Navāṁśa (D9)" subtitle="नवांश" data={kundali.navamshaChart} />
        </div>

        {/* Dasha context */}
        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
          <h3
            className="text-base font-bold text-gold-light mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Current dasha context
          </h3>
          {currentDasha.maha && currentDasha.antar ? (
            <DashaProgressBar
              mahaLord={currentDasha.maha.planetName.en}
              mahaStart={currentDasha.maha.startDate.slice(0, 10)}
              mahaEnd={currentDasha.maha.endDate.slice(0, 10)}
              antarLord={currentDasha.antar.planetName.en}
              antarStart={currentDasha.antar.startDate.slice(0, 10)}
              antarEnd={currentDasha.antar.endDate.slice(0, 10)}
            />
          ) : (
            <p className="text-text-secondary text-sm">
              Could not resolve current dasha period from the chart data.
            </p>
          )}
          {kundali.sadeSati?.currentPhase && (
            <div className="mt-4 pt-4 border-t border-gold-primary/10 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[color:var(--color-alert-critical)]/15 border border-[color:var(--color-alert-critical)]/30 text-[11px] text-[color:var(--color-alert-critical)] font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-alert-critical)] animate-pulse" />
                Sade Sati {kundali.sadeSati.currentPhase}
              </span>
              <span className="text-[12px] text-text-secondary">
                Saturn transit affecting natal Moon
              </span>
            </div>
          )}
        </div>

        {/* Key yogas inline */}
        {kundali.evaluatedYogas && kundali.evaluatedYogas.length > 0 && (
          <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/30 p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3
                className="text-base font-bold text-gold-light"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Key yogas in this chart
              </h3>
              <span className="text-[11px] text-text-tertiary">
                {kundali.evaluatedYogas.length} total
              </span>
            </div>
            <div className="space-y-2.5">
              {kundali.evaluatedYogas
                .filter((y) => y.present)
                .slice(0, 5)
                .map((y) => (
                  <YogaRow
                    key={y.id}
                    name={y.name.en}
                    hindi={y.name.sa}
                    context={y.description.en || ''}
                    citation={y.classicalRef || ''}
                    auspicious={y.isAuspicious}
                    caution={!y.isAuspicious}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Right rail — Quick actions */}
      <div className="xl:col-span-4 space-y-6">
        <div className="rounded-2xl border border-[color:var(--color-pandit-violet)]/25 bg-[color:var(--color-pandit-violet)]/8 p-5">
          <h3
            className="text-base font-bold text-[color:var(--color-pandit-violet-light)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Quick actions
          </h3>
          <div className="space-y-2">
            <ActionRow label="Generate tippanni" sub="AI draft from this chart — P5" primary />
            <ActionRow label="Generate kundali PDF" sub="Branded with your letterhead — P5" />
            <ActionRow label="Find muhurta" sub="For a specific activity — P5" />
            <Link
              href={`/kundali?clientId=${client.id}` as never}
              className="block rounded-lg p-3 border border-gold-primary/10 hover:border-gold-primary/30 hover:bg-bg-primary/40 transition cursor-pointer"
            >
              <p className="text-[13px] font-medium text-text-primary">Open in Expert view</p>
              <p className="text-[11px] mt-0.5 text-text-tertiary">
                Vargas, Shadbala, Jaimini, KP, …
              </p>
            </Link>
          </div>
        </div>

        {/* Ascendant + Moon Sign at-a-glance */}
        <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/30 p-5">
          <h3
            className="text-base font-bold text-gold-light mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            At a glance
          </h3>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between text-text-secondary">
              <span>Lagna</span>
              <span className="text-text-primary font-medium">
                {kundali.ascendant.signName.en}{' '}
                <span className="tabular-nums">
                  {kundali.ascendant.degree.toFixed(2)}°
                </span>
              </span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Moon</span>
              <span className="text-text-primary">
                {kundali.planets.find((p) => p.planet.name.en === 'Moon')?.signName?.en ?? '—'}
              </span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Sun</span>
              <span className="text-text-primary">
                {kundali.planets.find((p) => p.planet.name.en === 'Sun')?.signName?.en ?? '—'}
              </span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Ayanamsha</span>
              <span className="text-text-primary tabular-nums">
                {kundali.ayanamshaValue.toFixed(3)}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: import('@/types/kundali').ChartData;
}) {
  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
      <div className="mb-3">
        <h3
          className="text-base font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
        <p
          className="text-[12px] text-[color:var(--color-text-devanagari)]"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          {subtitle}
        </p>
      </div>
      <ChartNorth data={data} title={title} size={300} />
    </div>
  );
}

function YogaRow({
  name,
  hindi,
  context,
  citation,
  auspicious,
  caution,
}: {
  name: string;
  hindi?: string;
  context: string;
  citation: string;
  auspicious?: boolean;
  caution?: boolean;
}) {
  const tone = auspicious
    ? 'border-l-[color:var(--color-state-active)]'
    : caution
      ? 'border-l-[color:var(--color-link-paused)]'
      : 'border-l-gold-primary';
  return (
    <div
      className={`pl-3 border-l-2 ${tone} hover:bg-bg-primary/30 rounded-r-md py-2 pr-3 transition cursor-pointer`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-medium text-text-primary text-[14px]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {name}
            </span>
            {hindi && (
              <span
                className="text-[12px] text-[color:var(--color-text-devanagari)]"
                style={{ fontFamily: 'var(--font-devanagari-body)' }}
              >
                {hindi}
              </span>
            )}
          </div>
          {context && (
            <p className="text-[12px] text-text-secondary mt-0.5 leading-snug">
              {context}
            </p>
          )}
        </div>
        {citation && (
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider tabular-nums flex-none">
            {citation}
          </span>
        )}
      </div>
    </div>
  );
}

function ActionRow({
  label,
  sub,
  primary,
}: {
  label: string;
  sub: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`
        block rounded-lg p-3 border transition
        ${primary ? 'bg-[color:var(--color-pandit-violet)]/25 border-[color:var(--color-pandit-violet-light)]/40' : 'border-gold-primary/10'}
      `}
    >
      <p className={`text-[13px] font-medium ${primary ? 'text-white' : 'text-text-primary'}`}>
        {label}
      </p>
      <p
        className={`text-[11px] mt-0.5 ${primary ? 'text-text-primary/80' : 'text-text-tertiary'}`}
      >
        {sub}
      </p>
    </div>
  );
}

function ChartTabSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="aspect-square rounded-2xl bg-bg-secondary/40 animate-pulse" />
          <div className="aspect-square rounded-2xl bg-bg-secondary/40 animate-pulse" />
        </div>
        <div className="h-40 rounded-2xl bg-bg-secondary/30 animate-pulse" />
        <div className="h-48 rounded-2xl bg-bg-secondary/30 animate-pulse" />
      </div>
      <div className="xl:col-span-4 h-64 rounded-2xl bg-bg-secondary/30 animate-pulse" />
    </div>
  );
}

function ChartTabError({ error }: { error: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-6 text-center">
      <p className="text-[color:var(--color-alert-critical)] font-medium mb-2">
        Could not compute this chart
      </p>
      <p className="text-text-secondary text-[13px] mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 text-[13px] transition"
      >
        Retry
      </button>
    </div>
  );
}
