'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { KundaliData } from '@/types/kundali';
import type { CosmicBlueprint } from '@/lib/kundali/archetype-engine';
import { tl } from '@/lib/utils/trilingual';

import CosmicIdentityCard from './simple/CosmicIdentityCard';
import AshramStage from './simple/AshramStage';
import DomainRingsCard from './simple/DomainRingsCard';
import SimpleTimeline from './simple/SimpleTimeline';
import StrengthsList from './simple/StrengthsList';
import GrowthAreas from './simple/GrowthAreas';
import ViewModeToggle from './simple/ViewModeToggle';

// ---------------------------------------------------------------------------
// Domain config — maps life domains to their primary houses in the kundali.
// Scores are derived from bhavabala (already computed), NOT recomputed.
// ---------------------------------------------------------------------------

interface SimpleDomain {
  key: string;
  label: { en: string; hi: string; sa: string };
  /** Primary houses that indicate this domain (1-indexed) */
  houses: number[];
}

const DOMAINS: SimpleDomain[] = [
  { key: 'career',   label: { en: 'Career',        hi: 'करियर',    sa: 'वृत्तिः' },   houses: [10, 6, 2] },
  { key: 'marriage', label: { en: 'Relationships',  hi: 'संबंध',    sa: 'सम्बन्धाः' }, houses: [7, 5, 11] },
  { key: 'health',   label: { en: 'Health',         hi: 'स्वास्थ्य', sa: 'आरोग्यम्' },  houses: [1, 6, 8] },
  { key: 'wealth',   label: { en: 'Wealth',         hi: 'धन',       sa: 'धनम्' },       houses: [2, 11, 5] },
];

// ---------------------------------------------------------------------------
// Derive domain scores from already-computed kundali data
// ---------------------------------------------------------------------------

interface DomainScore {
  key: string;
  label: { en: string; hi: string; sa: string };
  /** 0-10 score from bhavabala (natal promise) */
  natalScore: number;
  /** 0-10 score: is the dasha lord activating these houses now? */
  currentScore: number;
  /** Blended overall */
  overallScore: number;
  rating: 'uttama' | 'madhyama' | 'adhama' | 'atyadhama';
}

function deriveDomainScores(kundali: KundaliData): DomainScore[] {
  const bhavabala = kundali.bhavabala;

  // Find current mahadasha lord
  const now = Date.now();
  const currentMaha = kundali.dashas.find(d => {
    if (d.level !== 'maha') return false;
    return now >= new Date(d.startDate).getTime() && now < new Date(d.endDate).getTime();
  });
  const PLANET_NAME_TO_ID: Record<string, number> = {
    Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
  };
  const dashaLordId = currentMaha ? PLANET_NAME_TO_ID[currentMaha.planet] : null;
  const dashaLordHouse = dashaLordId != null
    ? kundali.planets.find(p => p.planet.id === dashaLordId)?.house
    : null;

  return DOMAINS.map(({ key, label, houses }) => {
    // Natal score: average bhavabala strengthPercent of primary houses, scaled to 0-10
    let natalScore = 5; // default if bhavabala unavailable
    if (bhavabala && bhavabala.length > 0) {
      const houseScores = houses.map(h => {
        const bala = bhavabala.find(b => b.bhava === h);
        return bala ? bala.strengthPercent : 50;
      });
      natalScore = Math.min(10, Math.max(0,
        (houseScores.reduce((a, b) => a + b, 0) / houseScores.length) / 10
      ));
    }

    // Current activation: does the dasha lord sit in or aspect one of these houses?
    let currentScore = 5;
    if (dashaLordHouse != null) {
      currentScore = houses.includes(dashaLordHouse) ? 8 : 4;
    }

    // Overall: weighted blend (70% natal, 30% current)
    const overallScore = Math.round((natalScore * 0.7 + currentScore * 0.3) * 10) / 10;

    // Rating tier from overall score
    let rating: DomainScore['rating'] = 'madhyama';
    if (overallScore >= 7) rating = 'uttama';
    else if (overallScore >= 5) rating = 'madhyama';
    else if (overallScore >= 3) rating = 'adhama';
    else rating = 'atyadhama';

    return { key, label, natalScore: Math.round(natalScore * 10) / 10, currentScore, overallScore, rating };
  });
}

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <span className="text-gold-primary/40 text-sm select-none">{'\u2726'} · ·</span>
      <h2 className="text-gold-light text-xl font-bold">{title}</h2>
      <span className="text-gold-primary/40 text-sm select-none">· · {'\u2726'}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component — READS from KundaliData, NEVER recomputes
// ---------------------------------------------------------------------------

interface Props {
  kundali: KundaliData;
  /** Blueprint already computed by Client.tsx — same instance used by Expert mode's BlueprintTab */
  blueprint: CosmicBlueprint | null;
  locale: string;
  onSwitchToExpert: () => void;
}

export default function KundaliSimple({ kundali, blueprint, locale, onSwitchToExpert }: Props) {
  // Domain scores derived from already-computed bhavabala + dasha data
  const domainScores = useMemo(() => deriveDomainScores(kundali), [kundali]);

  const sectionTitle = (en: string, hi: string) =>
    locale === 'hi' ? hi : en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-16 space-y-2"
    >
      {/* ─── View Mode Toggle ─── */}
      <div className="flex justify-end mb-4">
        <ViewModeToggle
          mode="simple"
          onToggle={(m) => {
            if (m === 'expert') onSwitchToExpert();
          }}
        />
      </div>

      {/* ─── Cosmic Identity Card ─── */}
      {blueprint && (
        <CosmicIdentityCard
          blueprint={blueprint}
          kundali={kundali}
          locale={locale}
        />
      )}

      {/* ─── Ashram Stage ─── */}
      <AshramStage birthDate={kundali.birthData.date} locale={locale} />

      {/* ─── Life Domains ─── */}
      <SectionHeader title={sectionTitle('Your Life Domains', 'आपके जीवन क्षेत्र')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {domainScores.map((d) => (
          <DomainRingsCard
            key={d.key}
            domain={tl(d.label, locale)}
            natalScore={d.natalScore}
            currentScore={d.currentScore}
            overallScore={d.overallScore}
            rating={d.rating}
            natalLabel=""
            currentLabel=""
            overallLabel=""
            locale={locale}
          />
        ))}
      </div>

      {/* ─── Life Timeline ─── */}
      <SectionHeader title={sectionTitle('Your Life Timeline', 'आपकी जीवन समयरेखा')} />
      <SimpleTimeline dashas={kundali.dashas} locale={locale} />

      {/* ─── Key Strengths ─── */}
      <SectionHeader title={sectionTitle('Your Key Strengths', 'आपकी प्रमुख शक्तियाँ')} />
      <StrengthsList evaluatedYogas={kundali.evaluatedYogas} locale={locale} />

      {/* ─── Areas for Growth ─── */}
      <SectionHeader title={sectionTitle('Areas for Growth', 'विकास के क्षेत्र')} />
      <GrowthAreas evaluatedYogas={kundali.evaluatedYogas} locale={locale} />

      {/* ─── Footer Actions ─── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 mt-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <button
            type="button"
            className="text-gold-light hover:text-gold-primary transition-colors"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: kundali.birthData.name || 'My Kundali', url: window.location.href })
                  .catch((err) => {
                    if (err?.name !== 'AbortError') console.error('[KundaliSimple] Share failed:', err);
                  });
              }
            }}
          >
            Share My Chart
          </button>
        </div>

        {/* Expert mode CTA */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToExpert}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-gold-primary/30 text-text-secondary hover:text-gold-light hover:border-gold-primary/50 transition-all text-sm"
          >
            {locale === 'hi'
              ? 'पूरा तकनीकी चार्ट चाहिए? एक्सपर्ट मोड पर जाएँ →'
              : 'Want the full technical chart? Switch to Expert Mode \u2192'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
