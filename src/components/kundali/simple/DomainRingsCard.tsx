'use client';

type RatingTier = 'uttama' | 'madhyama' | 'adhama' | 'atyadhama';

interface Props {
  domain: string;
  natalScore: number;
  currentScore: number;
  overallScore: number;
  rating: RatingTier;
  natalRating: RatingTier;
  currentRating: RatingTier;
  locale: string;
}

const RING_COLOURS: Record<RatingTier, string> = {
  uttama: '#22c55e',
  madhyama: '#60a5fa',
  adhama: '#f59e0b',
  atyadhama: '#ef4444',
};

/** Human-friendly rating labels — single source, used for all three layers */
const RATING_LABEL: Record<RatingTier, { en: string; hi: string }> = {
  uttama: { en: 'Strong', hi: 'प्रबल' },
  madhyama: { en: 'Moderate', hi: 'मध्यम' },
  adhama: { en: 'Needs attention', hi: 'ध्यान आवश्यक' },
  atyadhama: { en: 'Challenging', hi: 'चुनौतीपूर्ण' },
};

function ratingWord(tier: RatingTier, locale: string): string {
  return (locale === 'hi' || locale === 'sa') ? RATING_LABEL[tier].hi : RATING_LABEL[tier].en;
}

const CIRCUMFERENCE = (r: number) => 2 * Math.PI * r;

function Ring({ radius, score, colour, trackOpacity = 0.15 }: {
  radius: number;
  score: number;
  colour: string;
  trackOpacity?: number;
}) {
  const c = CIRCUMFERENCE(radius);
  const offset = c - (score / 10) * c;

  return (
    <>
      <circle cx="50" cy="50" r={radius} fill="none" stroke={colour} strokeWidth="5" opacity={trackOpacity} />
      <circle cx="50" cy="50" r={radius} fill="none" stroke={colour} strokeWidth="5"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 50 50)" className="transition-all duration-700" />
    </>
  );
}

export default function DomainRingsCard({
  domain, natalScore, currentScore, overallScore,
  rating, natalRating, currentRating, locale,
}: Props) {
  const isHi = locale === 'hi' || locale === 'sa';
  const overallColour = RING_COLOURS[rating];

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4">
      <div className="flex items-center gap-4">
        {/* SVG Rings — no numeric score in centre */}
        <svg viewBox="0 0 100 100" className="w-20 h-20 shrink-0">
          <Ring radius={44} score={overallScore} colour={overallColour} />
          <Ring radius={34} score={natalScore} colour="#3b82f6" />
          <Ring radius={24} score={currentScore} colour="#f59e0b" trackOpacity={0.1} />
        </svg>

        <div className="flex-1 min-w-0">
          <h4 className="text-gold-light font-semibold text-sm">{domain}</h4>
          {/* Overall as a word, not a number */}
          <p className="text-xs font-medium mt-0.5" style={{ color: overallColour }}>{ratingWord(rating, locale)}</p>

          {/* Natal + Current with rating words derived from parent (no re-derivation) */}
          <div className="mt-2 space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-text-secondary">{isHi ? 'जन्म' : 'Natal'}:</span>
              <span className="text-blue-400">{ratingWord(natalRating, locale)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-text-secondary">{isHi ? 'वर्तमान' : 'Current'}:</span>
              <span className="text-amber-400">{ratingWord(currentRating, locale)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
