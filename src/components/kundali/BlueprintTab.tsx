'use client';

import { useMemo } from 'react';
import { GRAHAS } from '@/lib/constants/grahas';
import { tl } from '@/lib/utils/trilingual';
import JyotishTerm from '@/components/ui/JyotishTerm';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { CosmicBlueprint } from '@/lib/kundali/archetype-engine';

// Planet Unicode symbols by ID (0=Sun through 8=Ketu)
const PLANET_SYMBOLS: Record<number, string> = {
  0: '☉', 1: '☽', 2: '♂', 3: '☿', 4: '♃', 5: '♀', 6: '♄', 7: '☊', 8: '☋',
};

interface BlueprintTabProps {
  blueprint: CosmicBlueprint;
  locale: string;
  onNavigateToDasha?: () => void;
}

function formatYear(date: Date): string {
  return date.getFullYear().toString();
}

function formatDateRange(start: Date, end: Date): string {
  const fmt = (d: Date) => `${d.toLocaleString('en', { month: 'short' })} ${d.getFullYear()}`;
  return `${fmt(start)} — ${fmt(end)}`;
}

export default function BlueprintTab({ blueprint, locale, onNavigateToDasha }: BlueprintTabProps) {
  const { primary, shadow, currentChapter, nextChapter, activeYogas, headline } = blueprint;

  // Previous dasha (the one before current) isn't in blueprint — we show current + next
  const timelineSegments = useMemo(() => {
    const now = new Date();
    const currentStart = currentChapter.startDate.getTime();
    const currentEnd = currentChapter.endDate.getTime();
    const totalSpan = nextChapter.startDate.getTime() + (5 * 365.25 * 24 * 3600 * 1000) - currentStart;
    const currentWidth = Math.min(100, Math.max(10, ((currentEnd - currentStart) / totalSpan) * 100));
    const elapsed = Math.min(100, Math.max(0, ((now.getTime() - currentStart) / (currentEnd - currentStart)) * 100));
    return { currentWidth, elapsed };
  }, [currentChapter, nextChapter]);

  const primaryGraha = GRAHAS.find(g => g.id === primary.planet);
  const shadowGraha = GRAHAS.find(g => g.id === shadow.planet);
  const chapterGraha = GRAHAS.find(g => g.id === currentChapter.dashaLord);

  return (
    <div className="space-y-8">

      {/* ===== HEADLINE ===== */}
      <div className="text-center">
        <h2 className="text-gold-light text-2xl sm:text-3xl font-bold leading-snug">
          {headline}
        </h2>
        <p className="text-text-secondary text-sm mt-2">
          Your Cosmic Blueprint — a psychological map drawn from your birth chart
        </p>
      </div>

      {/* ===== PRIMARY + SHADOW ARCHETYPE CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Primary Card */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border-l-4 border-gold-primary border-r border-t border-b border-r-gold-primary/12 border-t-gold-primary/12 border-b-gold-primary/12 hover:border-r-gold-primary/40 hover:border-t-gold-primary/40 hover:border-b-gold-primary/40 transition-all p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl" aria-hidden="true">{PLANET_SYMBOLS[primary.planet] ?? '★'}</span>
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wider">Primary Archetype</p>
              <h3 className="text-gold-light text-xl font-bold">{tl(primary.name, locale)}</h3>
            </div>
            {primaryGraha && (
              <div className="ml-auto opacity-60">
                <GrahaIconById id={primary.planet} size={32} />
              </div>
            )}
          </div>

          {primary.strength > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-text-secondary text-xs"><JyotishTerm term="shadbala">Shadbala</JyotishTerm> Score:</span>
              <span className="text-gold-primary text-sm font-semibold">{(primary.strength * 100).toFixed(0)}%</span>
            </div>
          )}

          <p className="text-text-primary text-sm leading-relaxed mb-4">{primary.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {primary.traits.map(trait => (
              <span key={trait} className="bg-gold-primary/10 text-gold-primary text-xs px-2 py-1 rounded-full">
                {trait}
              </span>
            ))}
          </div>

          <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Blind Spot</p>
            <p className="text-text-primary text-sm leading-relaxed">{primary.blindSpot}</p>
          </div>
        </div>

        {/* Shadow Card */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border border-gold-primary/12 hover:border-gold-primary/40 transition-all p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl opacity-60" aria-hidden="true">{PLANET_SYMBOLS[shadow.planet] ?? '★'}</span>
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wider">Shadow Archetype</p>
              <h3 className="text-gold-light text-xl font-bold">{tl(shadow.name, locale)}</h3>
            </div>
            {shadowGraha && (
              <div className="ml-auto opacity-40">
                <GrahaIconById id={shadow.planet} size={32} />
              </div>
            )}
          </div>

          {shadow.strength > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-text-secondary text-xs"><JyotishTerm term="shadbala">Shadbala</JyotishTerm> Score:</span>
              <span className="text-text-secondary text-sm font-semibold">{(shadow.strength * 100).toFixed(0)}%</span>
            </div>
          )}

          <p className="text-text-primary text-sm leading-relaxed mb-4">{shadow.description}</p>

          <div className="bg-text-secondary/5 rounded-lg p-3 border border-text-secondary/10">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Growth Area</p>
            <p className="text-text-primary text-sm leading-relaxed">{shadow.growthArea}</p>
          </div>
        </div>
      </div>

      {/* ===== TIMELINE BAR ===== */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border border-gold-primary/12 hover:border-gold-primary/40 transition-all p-6">
        <h3 className="text-gold-light text-lg font-bold mb-4">
          <JyotishTerm term="dasha">Dasha</JyotishTerm> Timeline
        </h3>

        <div className="relative">
          {/* Labels above bar */}
          <div className="flex justify-between text-xs text-text-secondary mb-2">
            <span>{formatYear(currentChapter.startDate)}</span>
            <span className="text-gold-primary font-semibold">You are here</span>
            <span>{formatYear(nextChapter.startDate)}+</span>
          </div>

          {/* Bar */}
          <div className="bg-bg-primary rounded-full h-3 overflow-hidden relative">
            {/* Current chapter segment */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-primary/60 to-gold-primary/30 rounded-full"
              style={{ width: `${timelineSegments.currentWidth}%` }}
            />
            {/* "You are here" marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gold-light rounded-full border-2 border-bg-primary shadow-lg shadow-gold-primary/40 z-10"
              style={{ left: `${(timelineSegments.elapsed / 100) * timelineSegments.currentWidth}%` }}
            />
            {/* Next chapter segment (dimmed) */}
            <div
              className="absolute inset-y-0 bg-text-secondary/20 rounded-r-full"
              style={{ left: `${timelineSegments.currentWidth}%`, right: 0 }}
            />
          </div>

          {/* Chapter labels below bar */}
          <div className="flex justify-between mt-2">
            <span className="text-gold-primary text-xs font-medium">
              {tl(currentChapter.name, locale)}
            </span>
            <span className="text-text-secondary text-xs">
              {tl(nextChapter.name, locale)}
            </span>
          </div>
        </div>
      </div>

      {/* ===== CURRENT CHAPTER DETAIL ===== */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border border-gold-primary/12 hover:border-gold-primary/40 transition-all p-6">
        <div className="flex items-center gap-3 mb-4">
          {chapterGraha && <GrahaIconById id={currentChapter.dashaLord} size={28} />}
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wider">Current Chapter</p>
            <h3 className="text-gold-light text-xl font-bold">{tl(currentChapter.name, locale)}</h3>
          </div>
          <div className="ml-auto text-right">
            <p className="text-gold-primary text-sm font-semibold">
              {currentChapter.yearsRemaining.toFixed(1)} years remaining
            </p>
            <p className="text-text-secondary text-xs">
              {formatDateRange(currentChapter.startDate, currentChapter.endDate)}
            </p>
          </div>
        </div>

        <p className="text-text-primary text-sm leading-relaxed mb-4">
          {currentChapter.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {currentChapter.themes.map(theme => (
            <span key={theme} className="bg-gold-primary/10 text-gold-primary text-xs px-2 py-1 rounded-full">
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* ===== NEXT CHAPTER PREVIEW ===== */}
      <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/30 to-[#0a0e27] rounded-2xl border border-gold-primary/12 hover:border-gold-primary/40 transition-all p-6">
        <div className="flex items-center gap-3 mb-3">
          <GrahaIconById id={nextChapter.dashaLord} size={24} />
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-wider">Next Chapter</p>
            <h3 className="text-gold-light text-lg font-semibold">{tl(nextChapter.name, locale)}</h3>
          </div>
          <span className="ml-auto text-text-secondary text-xs">
            Starting {formatYear(nextChapter.startDate)}
          </span>
        </div>
        <p className="text-text-primary text-sm leading-relaxed italic">
          {nextChapter.transitionNote}
        </p>
      </div>

      {/* ===== SHAPING INFLUENCES (YOGAS) ===== */}
      {activeYogas.length > 0 && (
        <div>
          <h3 className="text-gold-light text-lg font-bold mb-4">Shaping Influences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {activeYogas.map((yoga, i) => (
              <div key={i} className="bg-gold-primary/5 border border-gold-primary/10 rounded-lg p-4">
                <p className="text-gold-light text-sm font-semibold mb-2">
                  <JyotishTerm term="yoga">{tl(yoga.name, locale)}</JyotishTerm>
                </p>
                <p className="text-text-primary text-xs leading-relaxed">{yoga.influence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== CTAs ===== */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          className="px-6 py-3 rounded-xl bg-gold-primary/10 text-gold-primary border border-gold-primary/20 hover:bg-gold-primary/20 transition-colors text-sm font-semibold"
          onClick={() => {
            // Placeholder for share functionality
            if (typeof navigator !== 'undefined' && navigator.share) {
              navigator.share({ title: 'My Cosmic Blueprint', text: headline }).catch(() => {
                // Share cancelled or unsupported — no action needed (progressive enhancement)
              });
            }
          }}
        >
          Share Blueprint Card
        </button>
        {onNavigateToDasha && (
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-primary/20 to-gold-dark/20 text-gold-light border border-gold-primary/30 hover:from-gold-primary/30 hover:to-gold-dark/30 transition-all text-sm font-semibold"
            onClick={onNavigateToDasha}
          >
            Full <JyotishTerm term="dasha">Dasha</JyotishTerm> Timeline →
          </button>
        )}
      </div>
    </div>
  );
}
