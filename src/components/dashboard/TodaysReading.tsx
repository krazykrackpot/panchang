'use client';

import TarotCard, { TAROT_ICON_SIZES } from '@/components/ui/TarotCard';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';

// ---------------------------------------------------------------------------
// Inline SVG symbol components (gold gradient palette)
// ---------------------------------------------------------------------------

function YogaSymbol({ number, size = 128 }: { number: number; size?: number }) {
  const isAuspicious = [1, 2, 3, 5, 6, 7, 10, 11, 13, 14, 16, 17, 20, 21, 24, 25, 27].includes(number);
  const primary = isAuspicious ? '#f0d48a' : '#d4a853';
  const secondary = isAuspicious ? '#d4a853' : '#8a6d2b';

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`yg-${number}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <radialGradient id={`yg-glow-${number}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.4" />
          <stop offset="60%" stopColor={secondary} stopOpacity="0.15" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Strong background glow */}
      <circle cx="32" cy="32" r="31" fill={`url(#yg-glow-${number})`} />
      {/* Filled ring band between outer and middle */}
      <path d="M32 2 A30 30 0 1 1 31.99 2 Z" fill={primary} opacity="0.08" />
      {/* Outer ring — very thick */}
      <circle cx="32" cy="32" r="30" stroke={primary} strokeWidth="3.5" opacity="0.85" />
      {/* Middle ring — thick */}
      <circle cx="32" cy="32" r="22" stroke={primary} strokeWidth="3" opacity="0.75" />
      {/* Inner ring — thick */}
      <circle cx="32" cy="32" r="14" stroke={primary} strokeWidth="3" opacity="0.9" />
      {/* Bold radiating spokes */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return (
          <line
            key={i}
            x1={32 + 14 * Math.cos(a)}
            y1={32 + 14 * Math.sin(a)}
            x2={32 + 30 * Math.cos(a)}
            y2={32 + 30 * Math.sin(a)}
            stroke={primary}
            strokeWidth={i % 3 === 0 ? 4 : 2.5}
            strokeLinecap="round"
            opacity={i % 3 === 0 ? 0.9 : 0.6}
          />
        );
      })}
      {/* Large filled petals at cardinals */}
      {[0, 90, 180, 270].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="7"
          rx="6"
          ry="11"
          fill={primary}
          opacity="0.6"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      {/* Large solid center */}
      <circle cx="32" cy="32" r="9" fill={`url(#yg-${number})`} opacity="0.85" />
      <circle cx="32" cy="32" r="5" fill={primary} opacity="1" />
    </svg>
  );
}

function EnergySymbol({ score, size = 128 }: { score: number; size?: number }) {
  const intensity = Math.max(0.6, score / 100);
  const rays = score >= 60 ? 16 : score >= 40 ? 12 : 10;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`eg-glow-${score}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity={intensity * 0.5} />
          <stop offset="50%" stopColor="#d4a853" stopOpacity={intensity * 0.2} />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`eg-core-${score}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </radialGradient>
      </defs>
      {/* Strong background glow */}
      <circle cx="32" cy="32" r="31" fill={`url(#eg-glow-${score})`} />
      {/* Very thick bold rays */}
      {Array.from({ length: rays }, (_, i) => {
        const a = (Math.PI * 2 * i) / rays;
        const isLong = i % 2 === 0;
        const outerR = isLong ? 31 : 26;
        return (
          <line
            key={i}
            x1={32 + 15 * Math.cos(a)}
            y1={32 + 15 * Math.sin(a)}
            x2={32 + outerR * Math.cos(a)}
            y2={32 + outerR * Math.sin(a)}
            stroke="#f0d48a"
            strokeWidth={isLong ? 4.5 : 3}
            strokeLinecap="round"
            opacity={intensity * 0.9}
          />
        );
      })}
      {/* Large solid center disc — very visible */}
      <circle cx="32" cy="32" r="14" fill={`url(#eg-core-${score})`} opacity={intensity * 0.85} />
      <circle cx="32" cy="32" r="14" stroke="#f0d48a" strokeWidth="3" opacity={intensity * 0.7} />
      {/* Bright solid core */}
      <circle cx="32" cy="32" r="8" fill="#f0d48a" opacity="1" />
    </svg>
  );
}

function DoshaSymbol({ dosha, size = 128 }: { dosha: string; size?: number }) {
  const d = dosha.toLowerCase();

  if (d === 'vata') {
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
        {/* Very thick primary wind curve */}
        <path d="M6 42 C16 24, 32 20, 42 30 C52 40, 58 22, 58 12" stroke="url(#dg-vata)" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
        {/* Thick secondary */}
        <path d="M4 54 C14 38, 30 34, 40 42 C50 50, 58 34, 60 22" stroke="url(#dg-vata)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
        {/* Third curve */}
        <path d="M12 34 C20 20, 36 16, 46 24 C54 32, 56 16, 52 8" stroke="url(#dg-vata)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55" />
        {/* Bold spiral endpoints */}
        <circle cx="58" cy="12" r="5" fill="#f0d48a" opacity="0.7" />
        <circle cx="52" cy="8" r="4" fill="#f0d48a" opacity="0.5" />
        <circle cx="60" cy="22" r="3.5" fill="#d4a853" opacity="0.6" />
      </svg>
    );
  }

  if (d === 'pitta') {
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
        {/* Massive flame — fills viewBox */}
        <path d="M32 2 C24 18, 10 28, 10 42 C10 54, 20 62, 32 62 C44 62, 54 54, 54 42 C54 28, 40 18, 32 2Z" fill="url(#dg-pitta)" fillOpacity="0.7" stroke="#f0d48a" strokeWidth="3" />
        {/* Inner flame — bold */}
        <path d="M32 14 C28 26, 18 34, 18 44 C18 52, 24 58, 32 58 C40 58, 46 52, 46 44 C46 34, 36 26, 32 14Z" fill="#f0d48a" fillOpacity="0.5" stroke="#f0d48a" strokeWidth="2" opacity="0.9" />
        {/* Bright core */}
        <ellipse cx="32" cy="46" rx="9" ry="11" fill="#f0d48a" opacity="0.7" />
        <ellipse cx="32" cy="48" rx="5" ry="6" fill="#f0d48a" opacity="1" />
      </svg>
    );
  }

  // Kapha
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
      {/* Large solid earth circle */}
      <circle cx="32" cy="24" r="18" stroke="#f0d48a" strokeWidth="3.5" fill="#d4a853" fillOpacity="0.5" />
      <circle cx="32" cy="24" r="11" stroke="#f0d48a" strokeWidth="2.5" fill="#f0d48a" fillOpacity="0.35" />
      <circle cx="32" cy="24" r="5" fill="#f0d48a" opacity="0.7" />
      {/* Very thick water waves */}
      <path d="M4 48 C12 40, 22 54, 30 46 C38 38, 48 54, 58 46" stroke="url(#dg-kapha)" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M6 57 C14 50, 24 60, 32 54 C40 48, 50 60, 58 54" stroke="url(#dg-kapha)" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.65" />
    </svg>
  );
}

function TithiSymbol({ number, size = 128 }: { number: number; size?: number }) {
  const isShukla = number <= 15;
  const phase = isShukla ? number : 30 - number;
  const illumination = Math.max(0.3, phase / 15); // Never fully invisible

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`tg-${number}`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
        <radialGradient id={`tg-glow-${number}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity={0.25 + illumination * 0.25} />
          <stop offset="50%" stopColor="#d4a853" stopOpacity={0.1 + illumination * 0.1} />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" />
        </radialGradient>
        <mask id={`tm-${number}`}>
          <rect width="64" height="64" fill="white" />
          <ellipse
            cx={isShukla ? 32 - (1 - illumination) * 34 : 32 + (1 - illumination) * 34}
            cy="32"
            rx={Math.max(1, (1 - illumination) * 28)}
            ry="28"
            fill="black"
          />
        </mask>
      </defs>
      {/* Strong background glow */}
      <circle cx="32" cy="32" r="31" fill={`url(#tg-glow-${number})`} />
      {/* Very thick outer glow ring */}
      <circle cx="32" cy="32" r="29" stroke="#f0d48a" strokeWidth="3.5" opacity={0.4 + illumination * 0.5} />
      {/* Large bold moon disc — r=26, high opacity */}
      <circle
        cx="32"
        cy="32"
        r="26"
        fill={`url(#tg-${number})`}
        opacity={0.7 + illumination * 0.3}
        mask={illumination < 0.95 ? `url(#tm-${number})` : undefined}
      />
      {/* Bold surface detail dots */}
      <circle cx="24" cy="24" r="5" fill="#f0d48a" opacity={illumination * 0.35} mask={illumination < 0.95 ? `url(#tm-${number})` : undefined} />
      <circle cx="38" cy="34" r="4" fill="#f0d48a" opacity={illumination * 0.25} mask={illumination < 0.95 ? `url(#tm-${number})` : undefined} />
      <circle cx="28" cy="40" r="3.5" fill="#f0d48a" opacity={illumination * 0.3} mask={illumination < 0.95 ? `url(#tm-${number})` : undefined} />
      <circle cx="36" cy="22" r="3" fill="#f0d48a" opacity={illumination * 0.2} mask={illumination < 0.95 ? `url(#tm-${number})` : undefined} />
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
