'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { KundaliData } from '@/types/kundali';
import type { CosmicBlueprint } from '@/lib/kundali/archetype-engine';
import type { PersonalReading } from '@/lib/kundali/domain-synthesis/types';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';

import CosmicIdentityCard from './simple/CosmicIdentityCard';
import AshramStage from './simple/AshramStage';
import DomainRingsCard, { type TopElement } from './simple/DomainRingsCard';
import SimpleTimeline from './simple/SimpleTimeline';
import StrengthsList from './simple/StrengthsList';
import GrowthAreas from './simple/GrowthAreas';
import ViewModeToggle, { type KundaliViewMode } from './simple/ViewModeToggle';
import KundaliSnapshot from './KundaliSnapshot';
import type { HealthDiagnosis } from '@/lib/kundali/health-diagnosis/types';

// ---------------------------------------------------------------------------
// Simple mode shows 4 key domains from the same synthesiser data as Expert
// ---------------------------------------------------------------------------

const SIMPLE_DOMAIN_KEYS = new Set(['career', 'marriage', 'health', 'wealth']);

// ---------------------------------------------------------------------------
// Locale helper — uses shared isDevanagariLocale for consistency
// ---------------------------------------------------------------------------

function L(locale: string, en: string, hi: string): string {
  return isDevanagariLocale(locale) ? hi : en;
}

// deriveDomainScores REMOVED — Simple now consumes personalReading
// (same data as Expert mode). Single source of truth.

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
// Fallback when blueprint is unavailable
// ---------------------------------------------------------------------------

function BlueprintUnavailable({ locale }: { locale: string }) {
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 text-center">
      <p className="text-gold-light text-lg font-semibold mb-2">
        {isHi ? 'आपकी कुंडली' : 'Your Kundali'}
      </p>
      <p className="text-text-secondary text-sm">
        {isHi
          ? 'विस्तृत आर्कीटाइप विश्लेषण के लिए एक्सपर्ट मोड में देखें।'
          : 'Switch to Expert Mode for the full archetype analysis.'}
      </p>
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
  /** Same personalReading used by Expert mode — single source of truth */
  personalReading: PersonalReading | null;
  locale: string;
  /**
   * Switch the parent into a higher-tier view. KundaliSimple emits
   * 'detailed' when the user wants the personalised reading and
   * 'expert' when they want the technical tabs. The parent owns the
   * mapping to localStorage + actual rendering.
   */
  onSwitchMode: (mode: KundaliViewMode) => void;
  /** Health diagnosis data — used to render top-3 vulnerable elements on the health domain card. */
  healthDiagnosis?: HealthDiagnosis | null;
}

export default function KundaliSimple({ kundali, blueprint, personalReading, locale, onSwitchMode, healthDiagnosis }: Props) {
  // Filter to 4 key domains from the same data Expert mode uses
  const domainScores = useMemo(() => {
    if (!personalReading) return [];
    return personalReading.domains.filter(d => SIMPLE_DOMAIN_KEYS.has(d.domain));
  }, [personalReading]);

  // Pre-compute top-3 vulnerable health elements for the health domain card.
  // Sorted by natalScore descending (higher = more vulnerable), take top 3.
  const healthTop3: TopElement[] | undefined = useMemo(() => {
    if (!healthDiagnosis?.natalElements?.length) return undefined;
    return [...healthDiagnosis.natalElements]
      .sort((a, b) => b.natalScore - a.natalScore)
      .slice(0, 3)
      .map((el) => ({ name: el.name, rating: el.rating, score: el.natalScore }));
  }, [healthDiagnosis]);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current); }, []);

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
          locale={locale}
          onToggle={(m) => {
            // Stay on simple if the user clicks Simple (no-op);
            // otherwise let the parent step us up to Detailed or Expert.
            if (m !== 'simple') onSwitchMode(m);
          }}
        />
      </div>

      {/* ─── Cosmic Identity Card (hosts 4 vital tiles + 4 Faces
              incl. Soul/Atmakaraka — see CosmicIdentityCard.tsx). ─── */}
      {blueprint ? (
        <CosmicIdentityCard
          blueprint={blueprint}
          kundali={kundali}
          locale={locale}
          personalReading={personalReading}
        />
      ) : (
        <BlueprintUnavailable locale={locale} />
      )}

      {/* ─── Ashram Stage ─── */}
      <AshramStage birthDate={kundali.birthData.date} locale={locale} />

      {/* ─── Life Domains — hidden entirely when personalReading is null ─── */}
      {domainScores.length > 0 && (
        <>
        <SectionHeader title={L(locale, 'Your Life Domains', 'आपके जीवन क्षेत्र')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {domainScores.map((d) => {
            const config = getDomainConfig(d.domain);
            const domainName = config ? tl(config.name, locale) : d.domain;
            const rating = d.overallRating.rating;
            return (
              <DomainRingsCard
                key={d.domain}
                domain={domainName}
                natalRating={rating}
                dashaScore={d.currentActivation.dashaActivationScore}
                nowScore={d.currentActivation.overallActivationScore}
                ratingLabel={tl(d.overallRating.label, locale)}
                locale={locale}
                onViewRemedies={
                  rating === 'adhama' || rating === 'atyadhama'
                    ? () => onSwitchMode('detailed') : undefined
                }
                topVulnerableElements={d.domain === 'health' ? healthTop3 : undefined}
              />
            );
          })}
        </div>
        </>
      )}

      {/* ─── Life Timeline ─── */}
      <SectionHeader title={L(locale, 'Your Life Timeline', 'आपकी जीवन समयरेखा')} />
      <SimpleTimeline dashas={kundali.dashas} locale={locale} />

      {/* ─── Key Strengths ─── */}
      <SectionHeader title={L(locale, 'Your Key Strengths', 'आपकी प्रमुख शक्तियाँ')} />
      <StrengthsList evaluatedYogas={kundali.evaluatedYogas} locale={locale} />

      {/* ─── Areas for Growth ─── */}
      <SectionHeader title={L(locale, 'Areas for Growth', 'विकास के क्षेत्र')} />
      <GrowthAreas evaluatedYogas={kundali.evaluatedYogas} locale={locale} />

      {/* ─── Pandit / Jyotish snapshot — dense one-page data card.
              Lives in Simple (free) so any user can share the canonical
              numerical surfaces (panchang-at-birth, D1+D9, planetary
              positions, dashas, ashtakavarga, chalit) with an astrologer
              without having to unlock the paid interpretation layer. ─── */}
      <SectionHeader title={L(locale, 'For Your Pandit / Jyotish', 'अपने पंडित / ज्योतिषी के लिए')} />
      <KundaliSnapshot kundali={kundali} locale={locale} />

      {/* ─── Soft upgrade prompt — pitched at users who just read the
              full Simple surface and might be ready to go deeper.
              The Footer Actions card (below) carries the secondary
              Detailed / Expert switches; this one is purpose-built
              copy for "you've seen the snapshot — want it interpreted?" ─── */}
      <div className="rounded-2xl border border-gold-primary/30 bg-gradient-to-br from-gold-primary/10 via-[#2d1b69]/30 to-[#0a0e27] p-6 mt-8 text-center">
        <p className="text-gold-light text-sm font-semibold mb-1">
          {L(locale,
            'Want the interpretation, not just the data?',
            'सिर्फ डेटा नहीं — व्याख्या भी चाहिए?')}
        </p>
        <p className="text-text-secondary text-xs mb-4">
          {L(locale,
            'Unlock the personalised Detailed reading: yogas explained in plain language, life-domain deep-dives, year predictions, dasha guidance and remedies. ₹299 / $4.99 per chart, one-time, never expires.',
            'व्यक्तिगत विस्तृत व्याख्या अनलॉक करें: सरल भाषा में योग, जीवन क्षेत्र विश्लेषण, वर्ष भविष्यवाणी, दशा मार्गदर्शन और उपाय। ₹299 / $4.99 प्रति कुंडली, एक बार, कभी समाप्त नहीं।')}
        </p>
        <button
          type="button"
          onClick={() => onSwitchMode('detailed')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/20 border border-gold-primary/50 text-gold-light hover:bg-gold-primary/30 transition-all text-sm font-semibold"
        >
          {L(locale,
            'Unlock Detailed reading →',
            'विस्तृत व्याख्या अनलॉक करें →')}
        </button>
      </div>

      {/* ─── Footer Actions ─── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 mt-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <button
            type="button"
            className="text-gold-light hover:text-gold-primary transition-colors"
            onClick={() => {
              // Web Share API (mobile) with clipboard fallback (desktop)
              const shareData = { title: kundali.birthData.name || 'My Kundali', url: window.location.href };
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share(shareData)
                  .catch((err) => {
                    if (err?.name !== 'AbortError') console.error('[KundaliSimple] Share failed:', err);
                  });
              } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href).then(() => {
                  setCopied(true);
                  copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
                }).catch((err) => {
                  console.error('[KundaliSimple] Clipboard copy failed:', err);
                });
              }
            }}
          >
            {copied
              ? L(locale, 'Link copied!', 'लिंक कॉपी हुआ!')
              : L(locale, 'Share My Chart', 'मेरा चार्ट शेयर करें')}
          </button>
        </div>

        {/* Step-up CTAs — offer Detailed (the personalised reading)
            as the natural next step plus Expert (the technical tabs)
            as the longer jump. Two visible doors, not one. */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onSwitchMode('detailed')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-gold-primary/40 text-gold-light hover:border-gold-primary/70 hover:bg-gold-primary/5 transition-all text-sm"
          >
            {L(locale,
              'Want a deeper personalised reading? Switch to Detailed →',
              'गहरी व्यक्तिगत व्याख्या चाहिए? विस्तृत मोड पर जाएँ →')}
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode('expert')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-gold-primary/30 text-text-secondary hover:text-gold-light hover:border-gold-primary/50 transition-all text-sm"
          >
            {L(locale,
              'Want the full technical chart? Switch to Expert Mode \u2192',
              'पूरा तकनीकी चार्ट चाहिए? एक्सपर्ट मोड पर जाएँ \u2192')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
