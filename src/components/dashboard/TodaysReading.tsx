'use client';

import TarotCard, { TAROT_ICON_SIZES } from '@/components/ui/TarotCard';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';

// ---------------------------------------------------------------------------
// Inline SVG symbol components (gold gradient palette)
// ---------------------------------------------------------------------------

function YogaSymbol({ number, size = 128 }: { number: number; size?: number }) {
  // Bold mandala — thick rings, wide spokes, large petals, radial glow
  const isAuspicious = [1, 2, 3, 5, 6, 7, 10, 11, 13, 14, 16, 17, 20, 21, 24, 25, 27].includes(number);
  const primary = isAuspicious ? '#f0d48a' : '#a87832';
  const secondary = isAuspicious ? '#d4a853' : '#6b4c1e';

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`yg-${number}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <radialGradient id={`yg-glow-${number}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.25" />
          <stop offset="70%" stopColor={secondary} stopOpacity="0.08" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Background radial glow */}
      <circle cx="32" cy="32" r="31" fill={`url(#yg-glow-${number})`} />
      {/* Outer ring — thick */}
      <circle cx="32" cy="32" r="29" stroke={`url(#yg-${number})`} strokeWidth="2.5" opacity="0.6" />
      {/* Middle ring */}
      <circle cx="32" cy="32" r="22" stroke={`url(#yg-${number})`} strokeWidth="2" opacity="0.7" />
      {/* Inner ring */}
      <circle cx="32" cy="32" r="15" stroke={`url(#yg-${number})`} strokeWidth="2.5" opacity="0.8" />
      {/* Wide radiating spokes */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return (
          <line
            key={i}
            x1={32 + 15 * Math.cos(a)}
            y1={32 + 15 * Math.sin(a)}
            x2={32 + 29 * Math.cos(a)}
            y2={32 + 29 * Math.sin(a)}
            stroke={primary}
            strokeWidth={i % 3 === 0 ? 3 : 1.8}
            strokeLinecap="round"
            opacity={i % 3 === 0 ? 0.8 : 0.5}
          />
        );
      })}
      {/* Large petal shapes at cardinal points */}
      {[0, 90, 180, 270].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="10"
          rx="5"
          ry="9"
          fill={primary}
          opacity="0.4"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      {/* Prominent filled center */}
      <circle cx="32" cy="32" r="7" fill={`url(#yg-${number})`} opacity="0.7" />
      <circle cx="32" cy="32" r="4" fill={primary} opacity="0.95" />
    </svg>
  );
}

function EnergySymbol({ score, size = 128 }: { score: number; size?: number }) {
  // Powerful radiant sun — thick bold rays, large filled center, strong glow
  const intensity = Math.max(0.4, score / 100);
  const rays = score >= 60 ? 16 : score >= 40 ? 12 : 8;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`eg-glow-${score}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity={intensity * 0.6} />
          <stop offset="50%" stopColor="#d4a853" stopOpacity={intensity * 0.25} />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`eg-core-${score}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </radialGradient>
      </defs>
      {/* Full-viewport radial glow */}
      <circle cx="32" cy="32" r="31" fill={`url(#eg-glow-${score})`} />
      {/* Thick bold rays — alternating long/short */}
      {Array.from({ length: rays }, (_, i) => {
        const a = (Math.PI * 2 * i) / rays;
        const isLong = i % 2 === 0;
        const outerR = isLong ? 31 : 27;
        return (
          <line
            key={i}
            x1={32 + 14 * Math.cos(a)}
            y1={32 + 14 * Math.sin(a)}
            x2={32 + outerR * Math.cos(a)}
            y2={32 + outerR * Math.sin(a)}
            stroke="#f0d48a"
            strokeWidth={isLong ? 3 : 2}
            strokeLinecap="round"
            opacity={intensity * 0.8}
          />
        );
      })}
      {/* Large solid center disc */}
      <circle cx="32" cy="32" r="13" fill={`url(#eg-core-${score})`} opacity={intensity * 0.7} />
      <circle cx="32" cy="32" r="13" stroke="#f0d48a" strokeWidth="1.5" opacity={intensity * 0.5} />
      {/* Bright inner core */}
      <circle cx="32" cy="32" r="7" fill="#f0d48a" opacity={intensity * 0.95} />
    </svg>
  );
}

function DoshaSymbol({ dosha, size = 128 }: { dosha: string; size?: number }) {
  const d = dosha.toLowerCase();

  if (d === 'vata') {
    // Bold sweeping wind curves — thick strokes, layered depths, spiral accents with fills
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="dg-vata" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0d48a" />
            <stop offset="100%" stopColor="#8a6d2b" />
          </linearGradient>
          <radialGradient id="dg-vata-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Background glow */}
        <circle cx="32" cy="32" r="31" fill="url(#dg-vata-glow)" />
        {/* Primary bold wind curve */}
        <path d="M8 40 C16 26, 30 22, 40 30 C50 38, 56 24, 56 16" stroke="url(#dg-vata)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
        {/* Secondary wind curve */}
        <path d="M6 50 C14 36, 28 32, 38 40 C48 48, 56 34, 58 24" stroke="url(#dg-vata)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.65" />
        {/* Tertiary wind curve */}
        <path d="M14 32 C20 22, 34 18, 44 26 C52 32, 54 18, 50 10" stroke="url(#dg-vata)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
        {/* Spiral accents with filled circles */}
        <circle cx="56" cy="16" r="4" stroke="#f0d48a" strokeWidth="1.5" fill="#f0d48a" fillOpacity="0.25" opacity="0.8" />
        <circle cx="50" cy="10" r="3" stroke="#f0d48a" strokeWidth="1.5" fill="#f0d48a" fillOpacity="0.2" opacity="0.65" />
        <circle cx="58" cy="24" r="2.5" stroke="#d4a853" strokeWidth="1" fill="#d4a853" fillOpacity="0.2" opacity="0.5" />
      </svg>
    );
  }

  if (d === 'pitta') {
    // Dramatic flame — fills 80% of viewBox, thick strokes, solid gradient, bright core
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="dg-pitta" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#8a6d2b" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#f0d48a" />
          </linearGradient>
          <radialGradient id="dg-pitta-glow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Background glow */}
        <circle cx="32" cy="36" r="30" fill="url(#dg-pitta-glow)" />
        {/* Main flame — large, fills most of the viewBox */}
        <path d="M32 4 C26 18, 14 26, 14 40 C14 52, 22 60, 32 60 C42 60, 50 52, 50 40 C50 26, 38 18, 32 4Z" fill="url(#dg-pitta)" fillOpacity="0.5" stroke="#d4a853" strokeWidth="2.5" />
        {/* Inner flame — strong opacity */}
        <path d="M32 16 C29 26, 22 32, 22 42 C22 50, 26 54, 32 54 C38 54, 42 50, 42 42 C42 32, 35 26, 32 16Z" fill="#f0d48a" fillOpacity="0.35" stroke="#f0d48a" strokeWidth="1.5" opacity="0.8" />
        {/* Large bright core */}
        <ellipse cx="32" cy="44" rx="7" ry="9" fill="#f0d48a" opacity="0.55" />
        <ellipse cx="32" cy="46" rx="4" ry="5" fill="#f0d48a" opacity="0.8" />
      </svg>
    );
  }

  // Kapha — bold earth circle + thick wavy water lines, strong gradient fills
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dg-kapha" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
        <radialGradient id="dg-kapha-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Background glow */}
      <circle cx="32" cy="30" r="31" fill="url(#dg-kapha-glow)" />
      {/* Bold earth circle — large, filled */}
      <circle cx="32" cy="26" r="16" stroke="url(#dg-kapha)" strokeWidth="2.5" fill="#d4a853" fillOpacity="0.3" />
      <circle cx="32" cy="26" r="9" stroke="#d4a853" strokeWidth="2" fill="#f0d48a" fillOpacity="0.2" />
      <circle cx="32" cy="26" r="4" fill="#f0d48a" fillOpacity="0.4" />
      {/* Thick wavy water lines */}
      <path d="M6 46 C14 40, 22 52, 30 46 C38 40, 46 52, 54 46 C58 42, 60 46, 60 44" stroke="url(#dg-kapha)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M8 54 C16 48, 24 58, 32 54 C40 48, 48 58, 56 54" stroke="url(#dg-kapha)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.55" />
    </svg>
  );
}

function TithiSymbol({ number, size = 128 }: { number: number; size?: number }) {
  // Bold luminous moon — large disc, visible gradient, thick glow ring, large surface details
  const isShukla = number <= 15;
  const phase = isShukla ? number : 30 - number; // 0 = new, 15 = full
  const illumination = phase / 15; // 0..1

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`tg-${number}`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
        <radialGradient id={`tg-glow-${number}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity={0.15 + illumination * 0.15} />
          <stop offset="60%" stopColor="#d4a853" stopOpacity={0.05 + illumination * 0.05} />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
        </radialGradient>
        <mask id={`tm-${number}`}>
          <rect width="64" height="64" fill="white" />
          <ellipse
            cx={isShukla ? 32 - (1 - illumination) * 32 : 32 + (1 - illumination) * 32}
            cy="32"
            rx={Math.max(1, (1 - illumination) * 26)}
            ry="26"
            fill="black"
          />
        </mask>
      </defs>
      {/* Background radial glow */}
      <circle cx="32" cy="32" r="31" fill={`url(#tg-glow-${number})`} />
      {/* Thick outer glow ring */}
      <circle cx="32" cy="32" r="28" stroke="#d4a853" strokeWidth="2" opacity={0.3 + illumination * 0.3} />
      {/* Large moon disc with phase mask — r=24, high opacity */}
      <circle
        cx="32"
        cy="32"
        r="24"
        fill={`url(#tg-${number})`}
        opacity={0.5 + illumination * 0.4}
        mask={illumination < 0.95 ? `url(#tm-${number})` : undefined}
      />
      {/* Large surface detail dots */}
      <circle cx="26" cy="26" r="4.5" fill="#f0d48a" opacity={illumination * 0.2} mask={illumination < 0.95 ? `url(#tm-${number})` : undefined} />
      <circle cx="37" cy="34" r="3.5" fill="#f0d48a" opacity={illumination * 0.15} mask={illumination < 0.95 ? `url(#tm-${number})` : undefined} />
      <circle cx="29" cy="38" r="2.5" fill="#f0d48a" opacity={illumination * 0.18} mask={illumination < 0.95 ? `url(#tm-${number})` : undefined} />
      <circle cx="35" cy="24" r="2" fill="#f0d48a" opacity={illumination * 0.12} mask={illumination < 0.95 ? `url(#tm-${number})` : undefined} />
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
