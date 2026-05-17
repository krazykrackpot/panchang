'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { KundaliData } from '@/types/kundali';
import type { CosmicBlueprint } from '@/lib/kundali/archetype-engine';
import { tl } from '@/lib/utils/trilingual';
import { GRAHAS } from '@/lib/constants/grahas';

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
// House assignments per BPHS — no house appears in two domains.
// ---------------------------------------------------------------------------

interface SimpleDomain {
  key: string;
  label: { en: string; hi: string; sa: string };
  /** Primary houses that indicate this domain (1-indexed). No overlaps. */
  houses: number[];
}

const DOMAINS: SimpleDomain[] = [
  // No house appears in more than one domain — prevents double-counting bhavabala.
  // BPHS primary houses per domain:
  { key: 'career',   label: { en: 'Career',        hi: 'करियर',    sa: 'वृत्तिः' },   houses: [10, 6, 3] },  // 10=Karma, 6=service/daily work, 3=skills/effort
  { key: 'marriage', label: { en: 'Relationships',  hi: 'संबंध',    sa: 'सम्बन्धाः' }, houses: [7, 5, 4] },   // 7=partnerships, 5=romance, 4=domestic happiness
  { key: 'health',   label: { en: 'Health',         hi: 'स्वास्थ्य', sa: 'आरोग्यम्' },  houses: [1, 8, 12] },  // 1=body, 8=longevity, 12=hospitalisation
  { key: 'wealth',   label: { en: 'Wealth',         hi: 'धन',       sa: 'धनम्' },       houses: [2, 11, 9] },  // 2=dhana, 11=gains, 9=fortune
];

// ---------------------------------------------------------------------------
// Locale helper — handles hi + sa (Devanagari) vs everything else
// ---------------------------------------------------------------------------

function L(locale: string, en: string, hi: string): string {
  return locale === 'hi' || locale === 'sa' ? hi : en;
}

// ---------------------------------------------------------------------------
// Derive domain scores from already-computed kundali data
// ---------------------------------------------------------------------------

type RatingTier = 'uttama' | 'madhyama' | 'adhama' | 'atyadhama';

function scoreToRating(score: number): RatingTier {
  if (score >= 7) return 'uttama';
  if (score >= 5) return 'madhyama';
  if (score >= 3) return 'adhama';
  return 'atyadhama';
}

interface DomainScore {
  key: string;
  label: { en: string; hi: string; sa: string };
  natalScore: number;
  currentScore: number;
  overallScore: number;
  rating: RatingTier;
  natalRating: RatingTier;
  currentRating: RatingTier;
}

/** Planet English name → ID. Uses GRAHAS constant as source of truth. */
const PLANET_NAME_TO_ID: Record<string, number> = Object.fromEntries(
  GRAHAS.map(g => [g.name.en, g.id])
);

function deriveDomainScores(kundali: KundaliData): DomainScore[] {
  const bhavabala = kundali.bhavabala;

  // Find current mahadasha lord
  const now = Date.now();
  const currentMaha = kundali.dashas.find(d => {
    if (d.level !== 'maha') return false;
    return now >= new Date(d.startDate).getTime() && now < new Date(d.endDate).getTime();
  });
  const dashaLordId = currentMaha ? PLANET_NAME_TO_ID[currentMaha.planet] ?? null : null;
  const dashaLordHouse = dashaLordId != null
    ? kundali.planets.find(p => p.planet.id === dashaLordId)?.house
    : null;

  return DOMAINS.map(({ key, label, houses }) => {
    // Natal score: average bhavabala strengthPercent of primary houses, scaled to 0-10
    let natalScore = 5;
    if (bhavabala && bhavabala.length > 0) {
      const houseScores = houses.map(h => {
        const bala = bhavabala.find(b => b.bhava === h);
        return bala ? bala.strengthPercent : 50;
      });
      natalScore = Math.min(10, Math.max(0,
        (houseScores.reduce((a, b) => a + b, 0) / houseScores.length) / 10
      ));
    }

    // Current activation: dasha lord in domain houses = strong boost
    let currentScore = 5;
    if (dashaLordHouse != null) {
      currentScore = houses.includes(dashaLordHouse) ? 8 : 5;
    }

    const overallScore = Math.round((natalScore * 0.7 + currentScore * 0.3) * 10) / 10;

    return {
      key, label,
      natalScore: Math.round(natalScore * 10) / 10,
      currentScore,
      overallScore,
      rating: scoreToRating(overallScore),
      natalRating: scoreToRating(natalScore),
      currentRating: scoreToRating(currentScore),
    };
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
// Fallback when blueprint is unavailable
// ---------------------------------------------------------------------------

function BlueprintUnavailable({ locale }: { locale: string }) {
  const isHi = locale === 'hi' || locale === 'sa';
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
  locale: string;
  onSwitchToExpert: () => void;
}

export default function KundaliSimple({ kundali, blueprint, locale, onSwitchToExpert }: Props) {
  const domainScores = useMemo(() => deriveDomainScores(kundali), [kundali]);
  const [copied, setCopied] = useState(false);

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
            if (m === 'expert') onSwitchToExpert();
          }}
        />
      </div>

      {/* ─── Cosmic Identity Card (or fallback) ─── */}
      {blueprint ? (
        <CosmicIdentityCard blueprint={blueprint} kundali={kundali} locale={locale} />
      ) : (
        <BlueprintUnavailable locale={locale} />
      )}

      {/* ─── Ashram Stage ─── */}
      <AshramStage birthDate={kundali.birthData.date} locale={locale} />

      {/* ─── Life Domains ─── */}
      <SectionHeader title={L(locale, 'Your Life Domains', 'आपके जीवन क्षेत्र')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {domainScores.map((d) => (
          <DomainRingsCard
            key={d.key}
            domain={tl(d.label, locale)}
            natalScore={d.natalScore}
            currentScore={d.currentScore}
            overallScore={d.overallScore}
            rating={d.rating}
            natalRating={d.natalRating}
            currentRating={d.currentRating}
            locale={locale}
            onViewRemedies={
              d.rating === 'adhama' || d.rating === 'atyadhama'
                ? onSwitchToExpert : undefined
            }
          />
        ))}
      </div>

      {/* ─── Life Timeline ─── */}
      <SectionHeader title={L(locale, 'Your Life Timeline', 'आपकी जीवन समयरेखा')} />
      <SimpleTimeline dashas={kundali.dashas} locale={locale} />

      {/* ─── Key Strengths ─── */}
      <SectionHeader title={L(locale, 'Your Key Strengths', 'आपकी प्रमुख शक्तियाँ')} />
      <StrengthsList evaluatedYogas={kundali.evaluatedYogas} locale={locale} />

      {/* ─── Areas for Growth ─── */}
      <SectionHeader title={L(locale, 'Areas for Growth', 'विकास के क्षेत्र')} />
      <GrowthAreas evaluatedYogas={kundali.evaluatedYogas} locale={locale} />

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
                  setTimeout(() => setCopied(false), 2000);
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

        {/* Expert mode CTA */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToExpert}
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
