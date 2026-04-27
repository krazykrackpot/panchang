'use client';

import TarotCard, { TAROT_ICON_SIZES } from '@/components/ui/TarotCard';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';

// ---------------------------------------------------------------------------
// Inline SVG symbol components (gold gradient palette)
// ---------------------------------------------------------------------------

function YogaSymbol({ number, size = 80 }: { number: number; size?: number }) {
  // Mandala pattern — concentric circles + radiating lines
  // Auspicious yogas (1-based: 1=Vishkambha through 27) — even numbers tend inauspicious
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
      </defs>
      {/* Outer ring */}
      <circle cx="32" cy="32" r="28" stroke={`url(#yg-${number})`} strokeWidth="0.8" opacity="0.3" />
      {/* Middle ring */}
      <circle cx="32" cy="32" r="22" stroke={`url(#yg-${number})`} strokeWidth="0.6" opacity="0.4" />
      {/* Inner ring */}
      <circle cx="32" cy="32" r="16" stroke={`url(#yg-${number})`} strokeWidth="1" opacity="0.6" />
      {/* Radiating lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return (
          <line
            key={i}
            x1={32 + 16 * Math.cos(a)}
            y1={32 + 16 * Math.sin(a)}
            x2={32 + 28 * Math.cos(a)}
            y2={32 + 28 * Math.sin(a)}
            stroke={primary}
            strokeWidth={i % 3 === 0 ? 1.2 : 0.5}
            opacity={i % 3 === 0 ? 0.7 : 0.25}
          />
        );
      })}
      {/* Center dot cluster */}
      <circle cx="32" cy="32" r="4" fill={primary} opacity="0.5" />
      <circle cx="32" cy="32" r="2" fill={primary} opacity="0.9" />
      {/* Petal shapes at cardinal points */}
      {[0, 90, 180, 270].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="12"
          rx="3"
          ry="6"
          fill={primary}
          opacity="0.15"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
    </svg>
  );
}

function EnergySymbol({ score, size = 80 }: { score: number; size?: number }) {
  // Radiant sun/star whose intensity varies by score (0-100)
  const intensity = Math.max(0.2, score / 100);
  const rays = score >= 60 ? 16 : score >= 40 ? 12 : 8;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`eg-${score}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity={intensity} />
          <stop offset="100%" stopColor="#d4a853" stopOpacity={intensity * 0.3} />
        </radialGradient>
      </defs>
      {/* Glow disc */}
      <circle cx="32" cy="32" r="24" fill={`url(#eg-${score})`} />
      {/* Rays */}
      {Array.from({ length: rays }, (_, i) => {
        const a = (Math.PI * 2 * i) / rays;
        const outerR = i % 2 === 0 ? 30 : 26;
        return (
          <line
            key={i}
            x1={32 + 14 * Math.cos(a)}
            y1={32 + 14 * Math.sin(a)}
            x2={32 + outerR * Math.cos(a)}
            y2={32 + outerR * Math.sin(a)}
            stroke="#f0d48a"
            strokeWidth={i % 2 === 0 ? 1.5 : 0.8}
            strokeLinecap="round"
            opacity={intensity * 0.7}
          />
        );
      })}
      {/* Core */}
      <circle cx="32" cy="32" r="10" fill="#f0d48a" opacity={intensity * 0.4} />
      <circle cx="32" cy="32" r="5" fill="#f0d48a" opacity={intensity * 0.8} />
    </svg>
  );
}

function DoshaSymbol({ dosha, size = 80 }: { dosha: string; size?: number }) {
  const d = dosha.toLowerCase();

  if (d === 'vata') {
    // Swirling wind / air curves
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="dg-vata" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0d48a" />
            <stop offset="100%" stopColor="#8a6d2b" />
          </linearGradient>
        </defs>
        <path d="M12 38 C18 28, 30 26, 38 32 C46 38, 52 28, 52 22" stroke="url(#dg-vata)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M8 46 C16 36, 28 34, 36 40 C44 46, 54 36, 56 28" stroke="url(#dg-vata)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M16 30 C22 22, 32 20, 40 26 C48 32, 50 20, 48 14" stroke="url(#dg-vata)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35" />
        {/* Spiral accent */}
        <circle cx="52" cy="22" r="3" stroke="#f0d48a" strokeWidth="0.8" fill="none" opacity="0.6" />
        <circle cx="48" cy="14" r="2" stroke="#f0d48a" strokeWidth="0.6" fill="none" opacity="0.4" />
      </svg>
    );
  }

  if (d === 'pitta') {
    // Fire / upward flame triangles
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="dg-pitta" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#8a6d2b" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#f0d48a" />
          </linearGradient>
        </defs>
        {/* Main flame */}
        <path d="M32 8 C28 20, 18 28, 18 40 C18 50, 24 56, 32 56 C40 56, 46 50, 46 40 C46 28, 36 20, 32 8Z" fill="url(#dg-pitta)" fillOpacity="0.25" stroke="#d4a853" strokeWidth="1.5" />
        {/* Inner flame */}
        <path d="M32 18 C30 26, 24 32, 24 40 C24 46, 28 50, 32 50 C36 50, 40 46, 40 40 C40 32, 34 26, 32 18Z" fill="#f0d48a" fillOpacity="0.15" stroke="#f0d48a" strokeWidth="0.8" opacity="0.6" />
        {/* Core */}
        <ellipse cx="32" cy="42" rx="4" ry="6" fill="#f0d48a" opacity="0.3" />
      </svg>
    );
  }

  // Kapha — water/earth: wavy lines + solid circle
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dg-kapha" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
      </defs>
      {/* Earth circle */}
      <circle cx="32" cy="28" r="14" stroke="url(#dg-kapha)" strokeWidth="1.5" fill="#d4a853" fillOpacity="0.1" />
      <circle cx="32" cy="28" r="8" stroke="#d4a853" strokeWidth="0.8" fill="#f0d48a" fillOpacity="0.08" />
      {/* Water waves */}
      <path d="M10 46 C16 42, 22 50, 28 46 C34 42, 40 50, 46 46 C52 42, 56 46, 58 44" stroke="url(#dg-kapha)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M12 52 C18 48, 24 56, 30 52 C36 48, 42 56, 48 52 C54 48, 56 52, 56 50" stroke="url(#dg-kapha)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
  );
}

function TithiSymbol({ number, size = 80 }: { number: number; size?: number }) {
  // Moon phase based on tithi number (1-30):
  // 1-15 = Shukla (waxing), 16-30 = Krishna (waning)
  // Tithi 15 = Purnima (full), Tithi 30 = Amavasya (new)
  const isShukla = number <= 15;
  const phase = isShukla ? number : 30 - number; // 0 = new, 15 = full

  // Calculate crescent offset — 0 = full disc visible, 15 = thin crescent
  const illumination = phase / 15; // 0..1

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`tg-${number}`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
        <mask id={`tm-${number}`}>
          <rect width="64" height="64" fill="white" />
          {/* Shadow ellipse to create crescent effect */}
          <ellipse
            cx={isShukla ? 32 - (1 - illumination) * 30 : 32 + (1 - illumination) * 30}
            cy="32"
            rx={Math.max(1, (1 - illumination) * 22)}
            ry="22"
            fill="black"
          />
        </mask>
      </defs>
      {/* Outer glow ring */}
      <circle cx="32" cy="32" r="26" stroke="#d4a853" strokeWidth="0.5" opacity="0.2" />
      {/* Moon disc with phase mask */}
      <circle
        cx="32"
        cy="32"
        r="20"
        fill={`url(#tg-${number})`}
        opacity={0.3 + illumination * 0.6}
        mask={illumination < 0.95 ? `url(#tm-${number})` : undefined}
      />
      {/* Surface detail dots */}
      <circle cx="28" cy="28" r="2.5" fill="#f0d48a" opacity={illumination * 0.15} />
      <circle cx="36" cy="35" r="1.8" fill="#f0d48a" opacity={illumination * 0.1} />
      <circle cx="30" cy="38" r="1.2" fill="#f0d48a" opacity={illumination * 0.12} />
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
