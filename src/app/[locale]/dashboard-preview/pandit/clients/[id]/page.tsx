/**
 * Client detail page — Chart tab is the default.
 * Spec §18.3 + §18.4.
 *
 * Sticky context strip + tab strip + active-tab content. The Chart tab
 * shows the existing Rasi chart placeholder + dasha progress bar + key
 * yogas inline.
 *
 * In the prototype, only Chart tab is wired with real-feeling content;
 * other tabs show "Coming in next prototype build" placeholders.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getClientById,
  getFamilyMembersForClient,
  getConsultationsForClient,
  getAlertsForClient,
  getDeliverablesForClient,
  relativeTimeSince,
} from '@/lib/pandit/mock-fixtures';
import StickyContextStrip from '@/components/pandit/StickyContextStrip';
import DashaProgressBar from '@/components/pandit/DashaProgressBar';
import AlertCard from '@/components/pandit/AlertCard';

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = getClientById(id);
  if (!client) notFound();

  const family = getFamilyMembersForClient(id);
  const consultations = getConsultationsForClient(id);
  const alerts = getAlertsForClient(id);
  const deliverables = getDeliverablesForClient(id);

  return (
    <div>
      <StickyContextStrip client={client} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Tab strip */}
        <div className="border-b border-gold-primary/12 mb-6 mt-2">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            <Tab label="Chart" active />
            <Tab label="Family" count={family.length} />
            <Tab label="Consultations" count={consultations.length} />
            <Tab label="Alerts" count={alerts.length} hasCritical={alerts.some((a) => a.severity === 'critical')} />
            <Tab label="Deliverables" count={deliverables.length} />
            <Tab label="Notes" />
            <Tab label="History" />
          </nav>
        </div>

        {/* Chart tab content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-12">
          {/* Charts (Rasi + Navamsa side-by-side, then dasha bar) */}
          <div className="xl:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ChartPanel title="Rāśi" subtitle="राशि" client={client} />
              <ChartPanel title="Navāṁśa" subtitle="नवांश" client={client} variant="navamsa" />
            </div>

            {/* Dasha progress bars */}
            <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
              <h3
                className="text-base font-bold text-gold-light mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Current dasha context
              </h3>
              <DashaProgressBar
                mahaLord={client.current_maha_lord_en}
                mahaStart={client.maha_started_at}
                mahaEnd={client.maha_ends_at}
                antarLord={client.current_antar_lord_en}
                antarStart={client.antar_started_at}
                antarEnd={client.antar_ends_at}
              />
              {client.sade_sati_phase && (
                <div className="mt-4 pt-4 border-t border-gold-primary/10 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[color:var(--color-alert-critical)]/15 border border-[color:var(--color-alert-critical)]/30 text-[11px] text-[color:var(--color-alert-critical)] font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-alert-critical)] animate-pulse" />
                    Sade Sati {client.sade_sati_phase}
                  </span>
                  <span className="text-[12px] text-text-secondary">
                    Saturn transit affecting natal Moon
                  </span>
                </div>
              )}
            </div>

            {/* Key yogas inline */}
            <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/30 p-5">
              <div className="flex items-baseline justify-between mb-3">
                <h3
                  className="text-base font-bold text-gold-light"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Key yogas in this chart
                </h3>
                <Link
                  href="#"
                  className="text-[11px] text-gold-primary hover:text-gold-light transition"
                >
                  View all 17 →
                </Link>
              </div>
              <div className="space-y-2.5">
                <YogaRow
                  name="Mahābhāgya yoga"
                  hindi="महाभाग्य योग"
                  context="Daytime birth · all benefics in angular houses"
                  citation="BPHS 36.42"
                  auspicious
                />
                <YogaRow
                  name="Gajakesari yoga"
                  hindi="गजकेसरी योग"
                  context="Jupiter and Moon in kendra from each other"
                  citation="Saravali 32.1"
                  auspicious
                />
                <YogaRow
                  name="Vipareeta Rāja yoga"
                  hindi="विपरीत राज योग"
                  context="8th lord in 12th — adversity transmutes to wealth"
                  citation="Phaladeepika 6.31"
                  auspicious
                />
                <YogaRow
                  name="Manglik (medium)"
                  hindi="मांगलिक"
                  context="Mars in 4th house from lagna"
                  citation="Mantreśvara 6.43"
                  caution
                />
              </div>
            </div>
          </div>

          {/* Right rail — Quick actions, recent activity */}
          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[color:var(--color-pandit-violet)]/25 bg-[color:var(--color-pandit-violet)]/8 p-5">
              <h3
                className="text-base font-bold text-[color:var(--color-pandit-violet-light)] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Quick actions
              </h3>
              <div className="space-y-2">
                <ActionRow
                  href="/en/dashboard-preview/pandit/tippanni"
                  label="Generate tippanni"
                  sub="AI draft from this chart + recent context"
                  primary
                />
                <ActionRow label="Generate kundali PDF" sub="Branded with your letterhead" />
                <ActionRow label="Find muhurta" sub="For a specific activity" />
                <ActionRow label="Run matching" sub="Ashta Kuta with another chart" />
                <ActionRow label="Open in Expert view" sub="Vargas, Shadbala, Jaimini, KP, …" />
              </div>
            </div>

            {alerts.length > 0 && (
              <div className="space-y-3">
                <h3
                  className="text-base font-bold text-gold-light"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Recent alerts for this client
                </h3>
                {alerts.slice(0, 3).map((a) => (
                  <AlertCard key={a.id} alert={a} compact />
                ))}
              </div>
            )}

            {consultations.length > 0 && (
              <div>
                <h3
                  className="text-base font-bold text-gold-light mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Last consultation
                </h3>
                <div className="rounded-xl border border-gold-primary/10 bg-bg-secondary/30 p-4">
                  <div className="flex items-baseline justify-between mb-2 text-[11px]">
                    <span className="uppercase tracking-wider text-text-tertiary">
                      {consultations[0].channel.replace('_', ' ')}
                    </span>
                    <span className="text-text-secondary">
                      {relativeTimeSince(consultations[0].consulted_at)}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-4">
                    {consultations[0].pandit_private_notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab({
  label,
  active,
  count,
  hasCritical,
}: {
  label: string;
  active?: boolean;
  count?: number;
  hasCritical?: boolean;
}) {
  return (
    <button
      className={`
        relative px-4 py-3 text-[13px] font-medium whitespace-nowrap transition
        ${active ? 'text-gold-light' : 'text-text-secondary hover:text-text-primary'}
      `}
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        {count !== undefined && count > 0 && (
          <span
            className={`
              inline-flex items-center justify-center min-w-4 h-4 px-1.5 text-[10px] rounded-full font-semibold
              ${hasCritical ? 'bg-[color:var(--color-alert-critical)]/30 text-[color:var(--color-alert-critical)]' : 'bg-bg-secondary text-text-secondary'}
            `}
          >
            {count}
          </span>
        )}
      </span>
      {active && (
        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-primary rounded-full" />
      )}
    </button>
  );
}

function ChartPanel({
  title,
  subtitle,
  client,
  variant = 'rasi',
}: {
  title: string;
  subtitle: string;
  client: ReturnType<typeof getClientById>;
  variant?: 'rasi' | 'navamsa';
}) {
  // Placeholder schematic: draws a north-indian diamond layout with
  // placeholder planet positions. Real implementation will swap in the
  // ChartNorth component from src/components/kundali/ChartNorth.tsx.
  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
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
        <button className="text-[11px] text-gold-primary hover:text-gold-light transition">
          South Indian
        </button>
      </div>

      {/* Schematic chart — replace with ChartNorth in real impl */}
      <div className="aspect-square relative bg-bg-primary/40 rounded-lg border border-gold-primary/10">
        <svg viewBox="0 0 100 100" className="absolute inset-2">
          <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(212,168,83,0.3)" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
          <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="rgba(212,168,83,0.4)" strokeWidth="0.5" />
          {/* Placeholder planet letters */}
          <text x="50" y="20" textAnchor="middle" fill="#f0d48a" fontSize="6" fontFamily="sans-serif">
            {variant === 'rasi' ? client?.janma_rashi_en : 'D9'}
          </text>
          {variant === 'rasi' && (
            <>
              <text x="32" y="50" textAnchor="middle" fill="#e74c3c" fontSize="4">Ma</text>
              <text x="50" y="50" textAnchor="middle" fill="#ecf0f1" fontSize="4">Mo</text>
              <text x="68" y="50" textAnchor="middle" fill="#f39c12" fontSize="4">Ju</text>
              <text x="50" y="80" textAnchor="middle" fill="#e67e22" fontSize="4">Su</text>
              <text x="20" y="80" textAnchor="middle" fill="#2ecc71" fontSize="4">Me</text>
              <text x="80" y="80" textAnchor="middle" fill="#3498db" fontSize="4">Sa</text>
            </>
          )}
        </svg>
        <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-text-tertiary">
          Schematic — real chart engine wires in P3
        </div>
      </div>
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
  hindi: string;
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
    <div className={`pl-3 border-l-2 ${tone} hover:bg-bg-primary/30 rounded-r-md py-2 pr-3 transition cursor-pointer`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-text-primary text-[14px]" style={{ fontFamily: 'var(--font-heading)' }}>
              {name}
            </span>
            <span
              className="text-[12px] text-[color:var(--color-text-devanagari)]"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              {hindi}
            </span>
          </div>
          <p className="text-[12px] text-text-secondary mt-0.5">{context}</p>
        </div>
        <span className="text-[10px] text-text-tertiary uppercase tracking-wider tabular-nums flex-none">
          {citation}
        </span>
      </div>
    </div>
  );
}

function ActionRow({
  href,
  label,
  sub,
  primary,
}: {
  href?: string;
  label: string;
  sub: string;
  primary?: boolean;
}) {
  const inner = (
    <div
      className={`
        block rounded-lg p-3 border transition cursor-pointer
        ${primary ? 'bg-[color:var(--color-pandit-violet)]/25 border-[color:var(--color-pandit-violet-light)]/40 hover:bg-[color:var(--color-pandit-violet)]/35' : 'border-gold-primary/10 hover:border-gold-primary/30 hover:bg-bg-primary/40'}
      `}
    >
      <p className={`text-[13px] font-medium ${primary ? 'text-white' : 'text-text-primary'}`}>{label}</p>
      <p className={`text-[11px] mt-0.5 ${primary ? 'text-text-primary/80' : 'text-text-secondary'}`}>
        {sub}
      </p>
    </div>
  );
  return href ? <Link href={href as never}>{inner}</Link> : inner;
}
