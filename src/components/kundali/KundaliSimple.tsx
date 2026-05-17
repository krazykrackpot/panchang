'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { KundaliData } from '@/types/kundali';
import type { CosmicBlueprint, BlueprintInput } from '@/lib/kundali/archetype-engine';
import { generateCosmicBlueprint } from '@/lib/kundali/archetype-engine';
import { synthesizeReading } from '@/lib/kundali/domain-synthesis/synthesizer';
import type { DomainReading } from '@/lib/kundali/domain-synthesis/types';
import { tl } from '@/lib/utils/trilingual';

import CosmicIdentityCard from './simple/CosmicIdentityCard';
import AshramStage from './simple/AshramStage';
import DomainRingsCard from './simple/DomainRingsCard';
import SimpleTimeline from './simple/SimpleTimeline';
import StrengthsList from './simple/StrengthsList';
import GrowthAreas from './simple/GrowthAreas';
import ViewModeToggle from './simple/ViewModeToggle';

// ---------------------------------------------------------------------------
// Domain display config — 4 key life domains from the 8-domain engine
// ---------------------------------------------------------------------------

const DISPLAY_DOMAINS: { key: string; label: { en: string; hi: string; sa: string } }[] = [
  { key: 'career',   label: { en: 'Career',        hi: 'करियर',    sa: 'वृत्तिः' } },
  { key: 'marriage', label: { en: 'Relationships',  hi: 'संबंध',    sa: 'सम्बन्धाः' } },
  { key: 'health',   label: { en: 'Health',         hi: 'स्वास्थ्य', sa: 'आरोग्यम्' } },
  { key: 'wealth',   label: { en: 'Wealth',         hi: 'धन',       sa: 'धनम्' } },
];

// ---------------------------------------------------------------------------
// Section header component
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
// Shimmer placeholder
// ---------------------------------------------------------------------------

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-[#2d1b69]/30 via-[#1a1040]/40 to-[#2d1b69]/30 rounded-2xl ${className ?? ''}`} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-16 space-y-6">
      <ShimmerBlock className="h-64 w-full" />
      <ShimmerBlock className="h-24 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <ShimmerBlock className="h-48" />
        <ShimmerBlock className="h-48" />
        <ShimmerBlock className="h-48" />
        <ShimmerBlock className="h-48" />
      </div>
      <ShimmerBlock className="h-40 w-full" />
      <ShimmerBlock className="h-32 w-full" />
      <ShimmerBlock className="h-32 w-full" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// BlueprintInput builder
// ---------------------------------------------------------------------------

function buildBlueprintInput(kundali: KundaliData): BlueprintInput {
  const mahaDashas = kundali.dashas
    .filter(d => d.level === 'maha')
    .map(d => {
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      const years = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return { planet: d.planet, startDate: start, endDate: end, years };
    });

  const yogas = (kundali.evaluatedYogas ?? []).map(y => ({
    id: y.id,
    name: y.name,
    present: y.present,
    strength: y.strength,
    isAuspicious: y.isAuspicious,
  }));

  return {
    shadbala: kundali.fullShadbala ?? [],
    dashas: mahaDashas,
    yogas,
    ascendantSign: kundali.ascendant.sign,
    planets: kundali.planets.map(p => ({ id: p.planet.id, longitude: p.longitude })),
    rahuLongitude: kundali.planets.find(p => p.planet.id === 7)?.longitude,
    ketuLongitude: kundali.planets.find(p => p.planet.id === 8)?.longitude,
    moonLongitude: kundali.planets.find(p => p.planet.id === 1)?.longitude,
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface Props {
  kundali: KundaliData;
  locale: string;
  onSwitchToExpert: () => void;
}

export default function KundaliSimple({ kundali, locale, onSwitchToExpert }: Props) {
  const [loading, setLoading] = useState(true);

  // Compute cosmic blueprint
  const blueprint = useMemo<CosmicBlueprint | null>(() => {
    try {
      const input = buildBlueprintInput(kundali);
      return generateCosmicBlueprint(input);
    } catch (err) {
      console.error('[KundaliSimple] Blueprint generation failed:', err);
      return null;
    }
  }, [kundali]);

  // Compute domain readings
  const domainReadings = useMemo<DomainReading[]>(() => {
    try {
      const reading = synthesizeReading(kundali);
      return reading.domains.filter(d =>
        DISPLAY_DOMAINS.some(dd => dd.key === d.domain)
      );
    } catch (err) {
      console.error('[KundaliSimple] Domain synthesis failed:', err);
      return [];
    }
  }, [kundali]);

  // Flip loading off after initial computation
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Section title resolver
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
        {DISPLAY_DOMAINS.map(({ key, label }) => {
          const domain = domainReadings.find(d => d.domain === key);
          if (!domain) return null;

          return (
            <DomainRingsCard
              key={key}
              domain={tl(label, locale)}
              natalScore={domain.natalPromise.rating.score}
              currentScore={domain.currentActivation.overallActivationScore}
              overallScore={domain.overallRating.score}
              rating={domain.overallRating.rating}
              natalLabel={tl(domain.natalPromise.summary, locale).split('.')[0]}
              currentLabel={tl(domain.currentActivation.summary, locale).split('.')[0]}
              overallLabel={tl(domain.headline, locale)}
              locale={locale}
            />
          );
        })}
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
              // Placeholder — share functionality will be wired to birth poster
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: kundali.birthData.name || 'My Kundali', url: window.location.href })
                  .catch(() => { /* user cancelled share — safe to ignore per Web Share API spec */ });
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
