'use client';

import { tl } from '@/lib/utils/trilingual';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';
import { GRAHAS } from '@/lib/constants/grahas';
import type { DomainReading, Rating } from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Rating colour map — static, no dynamic Tailwind classes
// ---------------------------------------------------------------------------

const RATING_COLORS: Record<Rating, string> = {
  uttama: '#34d399',
  madhyama: '#d4a853',
  adhama: '#f59e0b',
  atyadhama: '#ef4444',
};

const RATING_BG: Record<Rating, string> = {
  uttama: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  madhyama: 'bg-gold-primary/10 border-gold-primary/30 text-gold-primary',
  adhama: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  atyadhama: 'bg-red-500/10 border-red-500/30 text-red-400',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DomainCardProps {
  reading: DomainReading;
  locale: string;
  onClick: () => void;
}

// ---------------------------------------------------------------------------
// Helper: find the strongest benefic transit for the activation badge
// ---------------------------------------------------------------------------

function getActivationLabel(reading: DomainReading, locale: string): string | null {
  const { currentActivation } = reading;
  if (!currentActivation) return null;

  // Find a high-intensity transit to highlight
  const topTransit = currentActivation.transitInfluences?.find(
    (t) => t.intensity === 'high'
  ) ?? currentActivation.transitInfluences?.[0];

  if (topTransit) {
    const planet = GRAHAS.find((g) => g.id === topTransit.planetId);
    const planetName = planet ? tl(planet.name, locale) : '';
    const arrow = topTransit.nature === 'benefic' ? '\u2191' : topTransit.nature === 'malefic' ? '\u2193' : '\u2194';
    return `${planetName} transit ${arrow}`;
  }

  if (currentActivation.isDashaActive) {
    const md = GRAHAS.find((g) => g.id === currentActivation.mahaDashaLordId);
    return md ? `${tl(md.name, locale)} dasha` : null;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DomainCard({ reading, locale, onClick }: DomainCardProps) {
  const config = getDomainConfig(reading.domain);
  const ratingColor = RATING_COLORS[reading.overallRating.rating];
  const activationRating = reading.currentActivation
    ? (reading.currentActivation.overallActivationScore >= 7.5
        ? 'uttama'
        : reading.currentActivation.overallActivationScore >= 5
          ? 'madhyama'
          : reading.currentActivation.overallActivationScore >= 3
            ? 'adhama'
            : 'atyadhama')
    : reading.overallRating.rating;
  const activationColor = RATING_COLORS[activationRating];
  const activationLabel = getActivationLabel(reading, locale);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      className="relative rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gold-primary/30 overflow-hidden group"
    >
      {/* Left edge rating bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: ratingColor }}
      />

      {/* Current activation dot — top-right */}
      <div
        className="absolute top-3 right-3 w-2 h-2 rounded-full"
        style={{ backgroundColor: activationColor, boxShadow: `0 0 6px ${activationColor}40` }}
      />

      {/* Domain icon placeholder */}
      <div className="w-12 h-12 rounded-xl bg-gold-primary/8 border border-gold-primary/15 flex items-center justify-center mb-3">
        <span className="text-gold-primary/60 text-xs font-medium uppercase tracking-wider">
          {config ? tl(config.name, 'en').slice(0, 3) : reading.domain.slice(0, 3)}
        </span>
      </div>

      {/* Domain name + vedic name */}
      <h3 className="font-heading text-gold-light text-base font-semibold leading-tight">
        {config ? tl(config.name, locale) : reading.domain}
      </h3>
      {config && (
        <p className="font-devanagari text-gold-primary/60 text-xs mt-0.5 leading-tight">
          {tl(config.vedicName, locale)}
        </p>
      )}

      {/* Headline */}
      <p className="text-text-secondary text-sm leading-relaxed mt-3 line-clamp-2">
        {tl(reading.headline, locale)}
      </p>

      {/* Activation badge */}
      {activationLabel && (
        <div className="mt-3 pt-3 border-t border-gold-primary/8">
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${RATING_BG[activationRating]}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: activationColor }}
            />
            {activationLabel}
          </span>
        </div>
      )}
    </div>
  );
}
