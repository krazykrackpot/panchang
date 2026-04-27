'use client';

import TarotCard, { TAROT_ICON_SIZES } from '@/components/ui/TarotCard';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';

// ---------------------------------------------------------------------------
// Inline SVG symbol components (gold gradient palette)
// ---------------------------------------------------------------------------

function YogaSymbol({ size = 128 }: { number: number; size?: number }) {
  // Custom dramatic Sri Yantra / sacred geometry — interlocking triangles with lotus petals
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="yg-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
        <radialGradient id="yg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#d4a853" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Background glow */}
      <circle cx="32" cy="32" r="31" fill="url(#yg-glow)" />
      {/* Outer circle — thick */}
      <circle cx="32" cy="32" r="30" stroke="#f0d48a" strokeWidth="2.5" opacity="0.7" />
      {/* 8 lotus petals — large, bold fills */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="32" cy="6" rx="7" ry="13" fill="#f0d48a" opacity="0.5" stroke="#f0d48a" strokeWidth="1.5" transform={`rotate(${deg} 32 32)`} />
      ))}
      {/* Upward triangle — large, bold */}
      <polygon points="32,6 54,48 10,48" stroke="#f0d48a" strokeWidth="3" fill="#f0d48a" fillOpacity="0.15" strokeLinejoin="round" />
      {/* Downward triangle — large, bold */}
      <polygon points="32,58 10,16 54,16" stroke="#d4a853" strokeWidth="3" fill="#d4a853" fillOpacity="0.15" strokeLinejoin="round" />
      {/* Inner upward triangle */}
      <polygon points="32,18 44,42 20,42" stroke="#f0d48a" strokeWidth="2" fill="#f0d48a" fillOpacity="0.2" strokeLinejoin="round" />
      {/* Inner downward triangle */}
      <polygon points="32,46 20,22 44,22" stroke="#d4a853" strokeWidth="2" fill="#d4a853" fillOpacity="0.2" strokeLinejoin="round" />
      {/* Central bindu — bright solid */}
      <circle cx="32" cy="32" r="5" fill="url(#yg-main)" opacity="0.9" />
      <circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="1" />
    </svg>
  );
}

function EnergySymbol({ size = 128 }: { score: number; size?: number }) {
  // Custom dramatic sun with corona — solar eclipse style
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="eg-corona" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#d4a853" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="eg-sun" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
      </defs>
      {/* Corona glow — fills entire space */}
      <circle cx="32" cy="32" r="31" fill="url(#eg-corona)" />
      {/* 12 dramatic corona flares — thick, tapering outward */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        const isCardinal = i % 3 === 0;
        return (
          <path
            key={i}
            d={`M${32 + 16 * Math.cos(a - 0.12)},${32 + 16 * Math.sin(a - 0.12)} L${32 + (isCardinal ? 31 : 27) * Math.cos(a)},${32 + (isCardinal ? 31 : 27) * Math.sin(a)} L${32 + 16 * Math.cos(a + 0.12)},${32 + 16 * Math.sin(a + 0.12)} Z`}
            fill="#f0d48a"
            opacity={isCardinal ? 0.85 : 0.6}
          />
        );
      })}
      {/* Sun disc — large, solid, bold */}
      <circle cx="32" cy="32" r="15" fill="url(#eg-sun)" opacity="0.9" />
      <circle cx="32" cy="32" r="15" stroke="#f0d48a" strokeWidth="2.5" opacity="0.8" />
      {/* Face detail — inner circle pattern */}
      <circle cx="32" cy="32" r="10" stroke="#f0d48a" strokeWidth="1.5" opacity="0.4" />
      {/* Bright core */}
      <circle cx="32" cy="32" r="6" fill="#f0d48a" opacity="1" />
      <circle cx="32" cy="32" r="3" fill="#fff" opacity="0.3" />
    </svg>
  );
}

function DoshaSymbol({ dosha, size = 128 }: { dosha: string; size?: number }) {
  const d = dosha.toLowerCase();

  if (d === 'vata') {
    // Custom: Aeolus spiral — bold double spiral with flowing ribbons
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="dg-vata" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0d48a" />
            <stop offset="100%" stopColor="#d4a853" />
          </linearGradient>
          <radialGradient id="dg-vata-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="31" fill="url(#dg-vata-glow)" />
        {/* Outer boundary ring */}
        <circle cx="32" cy="32" r="30" stroke="#f0d48a" strokeWidth="2" opacity="0.5" />
        {/* Primary spiral — thick, sweeping across entire card */}
        <path d="M8 52 C8 36, 18 20, 32 20 C46 20, 52 32, 44 40 C36 48, 24 44, 24 36 C24 28, 32 26, 36 30" stroke="url(#dg-vata)" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.9" />
        {/* Secondary spiral — offset, bold */}
        <path d="M56 12 C56 24, 48 38, 36 42 C24 46, 14 38, 20 28 C26 18, 38 16, 42 24" stroke="#d4a853" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.7" />
        {/* Wind streaks */}
        <path d="M4 16 C12 14, 20 10, 30 12" stroke="#f0d48a" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        <path d="M50 56 C42 54, 36 58, 28 56" stroke="#f0d48a" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        {/* Spiral centers — solid filled */}
        <circle cx="36" cy="30" r="4" fill="#f0d48a" opacity="0.85" />
        <circle cx="42" cy="24" r="3" fill="#d4a853" opacity="0.7" />
      </svg>
    );
  }

  if (d === 'pitta') {
    // Custom: Sacred flame — upward triangle of fire with inner eye
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="dg-pitta" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#8a6d2b" />
            <stop offset="40%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#f0d48a" />
          </linearGradient>
          <radialGradient id="dg-pitta-glow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="36" r="31" fill="url(#dg-pitta-glow)" />
        {/* Outer flame silhouette — fills most of viewBox */}
        <path d="M32 2 C22 16, 6 26, 6 44 C6 56, 18 62, 32 62 C46 62, 58 56, 58 44 C58 26, 42 16, 32 2Z" fill="url(#dg-pitta)" fillOpacity="0.65" stroke="#f0d48a" strokeWidth="3" strokeLinejoin="round" />
        {/* Inner flame */}
        <path d="M32 16 C26 26, 16 34, 16 46 C16 54, 24 58, 32 58 C40 58, 48 54, 48 46 C48 34, 38 26, 32 16Z" fill="#f0d48a" fillOpacity="0.45" stroke="#f0d48a" strokeWidth="2" />
        {/* Third flame */}
        <path d="M32 28 C28 34, 22 38, 22 46 C22 52, 26 54, 32 54 C38 54, 42 52, 42 46 C42 38, 36 34, 32 28Z" fill="#f0d48a" fillOpacity="0.6" />
        {/* Inner eye — almond shape */}
        <ellipse cx="32" cy="44" rx="8" ry="5" fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.8" />
        <circle cx="32" cy="44" r="3" fill="#f0d48a" opacity="1" />
        {/* Tip spark */}
        <circle cx="32" cy="6" r="2.5" fill="#f0d48a" opacity="0.8" />
      </svg>
    );
  }

  // Kapha — Custom: Lotus on water — layered petals above wave lines
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dg-kapha" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
        <radialGradient id="dg-kapha-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="30" r="31" fill="url(#dg-kapha-glow)" />
      {/* Lotus petals — 5 large, overlapping */}
      <ellipse cx="32" cy="16" rx="6" ry="16" fill="#f0d48a" opacity="0.55" stroke="#f0d48a" strokeWidth="1.5" transform="rotate(0 32 30)" />
      <ellipse cx="32" cy="16" rx="6" ry="16" fill="#f0d48a" opacity="0.45" stroke="#f0d48a" strokeWidth="1.5" transform="rotate(30 32 30)" />
      <ellipse cx="32" cy="16" rx="6" ry="16" fill="#f0d48a" opacity="0.45" stroke="#f0d48a" strokeWidth="1.5" transform="rotate(-30 32 30)" />
      <ellipse cx="32" cy="16" rx="6" ry="16" fill="#d4a853" opacity="0.35" stroke="#d4a853" strokeWidth="1.5" transform="rotate(60 32 30)" />
      <ellipse cx="32" cy="16" rx="6" ry="16" fill="#d4a853" opacity="0.35" stroke="#d4a853" strokeWidth="1.5" transform="rotate(-60 32 30)" />
      {/* Lotus center */}
      <circle cx="32" cy="30" r="6" fill="url(#dg-kapha)" opacity="0.8" />
      <circle cx="32" cy="30" r="3" fill="#f0d48a" opacity="1" />
      {/* Bold water waves below lotus */}
      <path d="M2 50 C10 44, 20 56, 30 48 C40 40, 50 56, 62 48" stroke="url(#dg-kapha)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M4 58 C12 52, 22 62, 32 56 C42 50, 52 62, 60 56" stroke="url(#dg-kapha)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

function TithiSymbol({ number, size = 128 }: { number: number; size?: number }) {
  // Custom: Dramatic crescent moon with stars — always bold regardless of phase
  const isShukla = number <= 15;

  // Bold crescent with scattered stars — always dramatic regardless of phase
  // Crescent faces right for Shukla (waxing), left for Krishna (waning)
  const cx = isShukla ? 26 : 38;
  const shadowCx = isShukla ? 42 : 22;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`tg-${number}`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
        <radialGradient id={`tg-glow-${number}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#d4a853" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
        </radialGradient>
        <mask id={`tm-${number}`}>
          <rect width="64" height="64" fill="white" />
          <circle cx={shadowCx} cy="32" r="20" fill="black" />
        </mask>
      </defs>
      {/* Background glow */}
      <circle cx="32" cy="32" r="31" fill={`url(#tg-glow-${number})`} />
      {/* Outer halo ring */}
      <circle cx={cx} cy="32" r="26" stroke="#f0d48a" strokeWidth="2.5" opacity="0.4" />
      {/* Bold crescent moon — large, solid fill */}
      <circle cx={cx} cy="32" r="24" fill={`url(#tg-${number})`} opacity="0.85" mask={`url(#tm-${number})`} />
      <circle cx={cx} cy="32" r="24" stroke="#f0d48a" strokeWidth="3" opacity="0.7" mask={`url(#tm-${number})`} />
      {/* Surface craters on crescent */}
      <circle cx={isShukla ? 18 : 44} cy="28" r="3.5" fill="#f0d48a" opacity="0.3" mask={`url(#tm-${number})`} />
      <circle cx={isShukla ? 22 : 40} cy="38" r="2.5" fill="#f0d48a" opacity="0.25" mask={`url(#tm-${number})`} />
      {/* Scattered stars — bold, filled */}
      <polygon points={`${isShukla ? 50 : 14},12 ${isShukla ? 51.5 : 15.5},15.5 ${isShukla ? 55 : 18},16 ${isShukla ? 52 : 16},18.5 ${isShukla ? 53 : 17},22 ${isShukla ? 50 : 14},20 ${isShukla ? 47 : 11},22 ${isShukla ? 48 : 12},18.5 ${isShukla ? 45 : 10},16 ${isShukla ? 48.5 : 12.5},15.5`} fill="#f0d48a" opacity="0.9" />
      <circle cx={isShukla ? 54 : 10} cy="28" r="2" fill="#f0d48a" opacity="0.7" />
      <circle cx={isShukla ? 48 : 16} cy="48" r="1.5" fill="#f0d48a" opacity="0.6" />
      <circle cx={isShukla ? 56 : 8} cy="42" r="1.8" fill="#d4a853" opacity="0.5" />
      <circle cx={isShukla ? 44 : 20} cy="8" r="1.2" fill="#f0d48a" opacity="0.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Day insight generator
// ---------------------------------------------------------------------------

function generateDayInsight(energyScore: number, energyBestFor: string[], dashaLord: string): string {
  const focus = energyBestFor[0]?.toLowerCase() || 'mindful action';
  if (energyScore >= 80) return `A powerful day under ${dashaLord}'s influence. Channel the high energy into ${focus}.`;
  if (energyScore >= 60) return `A steady day with good potential. Focus on ${focus} during morning hours.`;
  if (energyScore >= 40) return `A moderate day \u2014 pace yourself. Best for ${focus}, avoid overcommitting.`;
  return `A quiet day for reflection. Avoid major decisions. ${energyBestFor[0] || 'Rest and restore'}.`;
}

function energyScoreColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400';
  if (score >= 60) return 'bg-[#d4a853]';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-400';
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TodaysReadingProps {
  yoga: { number: number; name: string; quality?: string };
  nakshatra: { number: number; name: string; type?: string };
  tithi: { number: number; name: string; paksha: string };
  dashaLord: { planetId: number; planetName: string; antarLord?: string };
  dayEnergy: { score: number; label: string; bestFor: string[] };
  prakriti: { dominant: string; secondary: string } | null;
  locale: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TodaysReading({
  yoga,
  nakshatra,
  tithi,
  dashaLord,
  dayEnergy,
  prakriti,
}: TodaysReadingProps) {
  const iconSize = TAROT_ICON_SIZES.full;
  const insight = generateDayInsight(dayEnergy.score, dayEnergy.bestFor, dashaLord.planetName);

  return (
    <section className="py-8 px-4">
      {/* Header — "The Lens" */}
      <div className="text-center mb-8">
        <h2 className="font-[var(--font-cinzel)] text-2xl md:text-3xl text-[#f0d48a] mb-2">
          Today&apos;s Reading
        </h2>
        <p className="text-[#e6e2d8] text-sm max-w-lg mx-auto italic leading-relaxed">
          &ldquo;{insight}&rdquo;
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${energyScoreColor(dayEnergy.score)}`} />
          <span className="text-xs text-[#8a8478]">{dayEnergy.label} Energy Day</span>
        </div>
      </div>

      {/* 5 Tarot Cards — full-width grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Card 1: Current Yoga */}
        <TarotCard
          size="full"
          subtitle="Today's Yoga"
          icon={<YogaSymbol number={yoga.number} size={iconSize} />}
          title={yoga.name}
          description={yoga.quality || 'Yoga'}
        />

        {/* Card 2: Moon Nakshatra */}
        <TarotCard
          size="full"
          subtitle="Moon In"
          icon={<NakshatraIconById id={nakshatra.number} size={iconSize} />}
          title={nakshatra.name}
          description={nakshatra.type || 'Nakshatra'}
        />

        {/* Card 3: Dasha Lord */}
        <TarotCard
          size="full"
          subtitle="Ruling Planet"
          icon={<GrahaIconById id={dashaLord.planetId} size={iconSize} />}
          title={dashaLord.planetName}
          description={dashaLord.antarLord ? `${dashaLord.antarLord} period` : undefined}
          glowColor={
            // Planet-specific glow tints
            [
              '#e67e22', // Sun — orange
              '#c0c0c0', // Moon — silver
              '#e74c3c', // Mars — red
              '#2ecc71', // Mercury — green
              '#f1c40f', // Jupiter — gold
              '#e91e9f', // Venus — pink
              '#7f8c8d', // Saturn — grey
              '#3498db', // Rahu — blue
              '#9b59b6', // Ketu — purple
            ][dashaLord.planetId] || '#d4a853'
          }
        />

        {/* Card 4: Day Energy */}
        <TarotCard
          size="full"
          subtitle="Day Energy"
          icon={<EnergySymbol score={dayEnergy.score} size={iconSize} />}
          title={dayEnergy.label}
          description={dayEnergy.bestFor[0] || undefined}
        />

        {/* Card 5: Prakriti / Tithi fallback */}
        <TarotCard
          size="full"
          subtitle={prakriti ? 'Your Dosha' : 'Lunar Day'}
          icon={
            prakriti
              ? <DoshaSymbol dosha={prakriti.dominant} size={iconSize} />
              : <TithiSymbol number={tithi.number} size={iconSize} />
          }
          title={prakriti ? prakriti.dominant : tithi.name}
          description={prakriti ? `${prakriti.dominant}-${prakriti.secondary}` : tithi.paksha}
        />
      </div>
    </section>
  );
}
