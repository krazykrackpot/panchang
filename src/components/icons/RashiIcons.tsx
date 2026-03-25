'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`rg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0d48a" />
        <stop offset="50%" stopColor="#d4a853" />
        <stop offset="100%" stopColor="#8a6d2b" />
      </linearGradient>
      <filter id={`gl-${id}`}>
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  );
}

// 1. Mesha (Aries) — Ram horns
export function MeshaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="mes" />
      <path d="M16 48C16 48 12 32 12 24C12 14 18 8 24 8C30 8 32 14 32 20C32 14 34 8 40 8C46 8 52 14 52 24C52 32 48 48 48 48"
        stroke="url(#rg-mes)" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#gl-mes)" />
      <circle cx="24" cy="10" r="2.5" fill="#f0d48a" />
      <circle cx="40" cy="10" r="2.5" fill="#f0d48a" />
      <line x1="32" y1="20" x2="32" y2="56" stroke="url(#rg-mes)" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

// 2. Vrishabha (Taurus) — Bull head
export function VrishabhaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="vri" />
      <circle cx="32" cy="36" r="18" stroke="url(#rg-vri)" strokeWidth="2.5" fill="url(#rg-vri)" fillOpacity="0.1" />
      {/* Horns */}
      <path d="M16 32C12 24 10 14 16 8" stroke="url(#rg-vri)" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#gl-vri)" />
      <path d="M48 32C52 24 54 14 48 8" stroke="url(#rg-vri)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="26" cy="34" r="2" fill="#f0d48a" />
      <circle cx="38" cy="34" r="2" fill="#f0d48a" />
      {/* Nostrils */}
      <circle cx="28" cy="44" r="2" fill="#f0d48a" opacity="0.4" />
      <circle cx="36" cy="44" r="2" fill="#f0d48a" opacity="0.4" />
    </svg>
  );
}

// 3. Mithuna (Gemini) — Twin figures
export function MithunaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="mit" />
      {/* Twin 1 */}
      <circle cx="22" cy="16" r="6" stroke="url(#rg-mit)" strokeWidth="2" fill="url(#rg-mit)" fillOpacity="0.15" />
      <line x1="22" y1="22" x2="22" y2="44" stroke="url(#rg-mit)" strokeWidth="2.5" />
      {/* Twin 2 */}
      <circle cx="42" cy="16" r="6" stroke="url(#rg-mit)" strokeWidth="2" fill="url(#rg-mit)" fillOpacity="0.15" filter="url(#gl-mit)" />
      <line x1="42" y1="22" x2="42" y2="44" stroke="url(#rg-mit)" strokeWidth="2.5" />
      {/* Connecting bars */}
      <line x1="22" y1="16" x2="42" y2="16" stroke="#f0d48a" strokeWidth="2" />
      <line x1="22" y1="44" x2="42" y2="44" stroke="#f0d48a" strokeWidth="2" />
      {/* Arms */}
      <path d="M22 30L14 36M42 30L50 36" stroke="#f0d48a" strokeWidth="1.5" opacity="0.5" />
      {/* Legs */}
      <path d="M22 44L16 56M22 44L28 56M42 44L36 56M42 44L48 56" stroke="url(#rg-mit)" strokeWidth="1.5" />
    </svg>
  );
}

// 4. Karka (Cancer) — Crab claws
export function KarkaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="kar" />
      {/* Upper claw */}
      <path d="M28 28C20 22 14 24 12 30C10 36 16 40 22 36" stroke="url(#rg-kar)" strokeWidth="3" fill="none" filter="url(#gl-kar)" />
      {/* Lower claw */}
      <path d="M36 36C44 42 50 40 52 34C54 28 48 24 42 28" stroke="url(#rg-kar)" strokeWidth="3" fill="none" />
      {/* Body */}
      <circle cx="32" cy="32" r="8" fill="url(#rg-kar)" opacity="0.2" stroke="url(#rg-kar)" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="0.5" />
    </svg>
  );
}

// 5. Simha (Leo) — Lion mane
export function SimhaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="sim" />
      {/* Mane */}
      <circle cx="32" cy="28" r="20" stroke="url(#rg-sim)" strokeWidth="2.5" fill="url(#rg-sim)" fillOpacity="0.08" />
      {/* Head */}
      <circle cx="32" cy="28" r="12" fill="url(#rg-sim)" fillOpacity="0.2" stroke="url(#rg-sim)" strokeWidth="2" filter="url(#gl-sim)" />
      {/* Eyes */}
      <circle cx="27" cy="26" r="2" fill="#f0d48a" />
      <circle cx="37" cy="26" r="2" fill="#f0d48a" />
      {/* Nose */}
      <path d="M30 32L32 34L34 32" stroke="#f0d48a" strokeWidth="1.5" fill="none" />
      {/* Tail curl */}
      <path d="M42 42C48 46 52 50 48 56C44 60 40 56 44 52" stroke="url(#rg-sim)" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

// 6. Kanya (Virgo) — Maiden with wheat
export function KanyaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="kan" />
      {/* M shape */}
      <path d="M12 48V16L22 36L32 16L42 36L52 16" stroke="url(#rg-kan)" strokeWidth="2.5" fill="none" filter="url(#gl-kan)" />
      {/* Wheat tail */}
      <path d="M52 16C52 16 56 22 54 30C52 38 48 42 44 44" stroke="url(#rg-kan)" strokeWidth="2" fill="none" />
      <path d="M54 30L58 28M54 34L58 34M52 38L56 40" stroke="#f0d48a" strokeWidth="1" opacity="0.4" />
      {/* Wheat grain */}
      <circle cx="44" cy="46" r="3" fill="#f0d48a" opacity="0.5" />
    </svg>
  );
}

// 7. Tula (Libra) — Balance scales
export function TulaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="tul" />
      {/* Center pillar */}
      <line x1="32" y1="12" x2="32" y2="52" stroke="url(#rg-tul)" strokeWidth="2.5" />
      {/* Beam */}
      <line x1="10" y1="24" x2="54" y2="24" stroke="url(#rg-tul)" strokeWidth="2.5" strokeLinecap="round" filter="url(#gl-tul)" />
      {/* Left pan */}
      <path d="M10 24L6 38h16L18 24" stroke="#f0d48a" strokeWidth="1.5" fill="url(#rg-tul)" fillOpacity="0.15" />
      {/* Right pan */}
      <path d="M46 24L42 38h16L54 24" stroke="#f0d48a" strokeWidth="1.5" fill="url(#rg-tul)" fillOpacity="0.15" />
      {/* Base */}
      <path d="M22 52h20" stroke="url(#rg-tul)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Fulcrum */}
      <path d="M28 12L32 6L36 12" fill="url(#rg-tul)" />
    </svg>
  );
}

// 8. Vrishchika (Scorpio) — Scorpion tail
export function VrishchikaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="vrs" />
      {/* M shape with arrow tail */}
      <path d="M10 20V44L20 24L30 44L40 24L50 44" stroke="url(#rg-vrs)" strokeWidth="2.5" fill="none" filter="url(#gl-vrs)" />
      {/* Sting arrow */}
      <path d="M50 44L56 36" stroke="url(#rg-vrs)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 36L58 42L52 40z" fill="#f0d48a" />
      {/* Claws hint */}
      <circle cx="10" cy="18" r="2" fill="#f0d48a" opacity="0.4" />
    </svg>
  );
}

// 9. Dhanu (Sagittarius) — Bow and arrow
export function DhanuIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="dhn" />
      {/* Arrow */}
      <line x1="12" y1="52" x2="52" y2="12" stroke="url(#rg-dhn)" strokeWidth="2.5" strokeLinecap="round" filter="url(#gl-dhn)" />
      {/* Arrowhead */}
      <path d="M52 12L44 12L52 20z" fill="#f0d48a" />
      {/* Bow */}
      <path d="M12 52C4 36 12 20 28 12" stroke="url(#rg-dhn)" strokeWidth="2.5" fill="none" />
      {/* Cross bar */}
      <line x1="24" y1="44" x2="40" y2="28" stroke="#f0d48a" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

// 10. Makara (Capricorn) — Sea-goat
export function MakaraIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="mak" />
      {/* Goat horns */}
      <path d="M24 28C20 20 16 12 20 8C24 4 28 8 28 14" stroke="url(#rg-mak)" strokeWidth="2.5" fill="none" filter="url(#gl-mak)" />
      {/* Body */}
      <path d="M28 14C30 20 32 26 34 32C36 38 40 42 46 44" stroke="url(#rg-mak)" strokeWidth="2.5" fill="none" />
      {/* Fish tail */}
      <path d="M46 44C50 46 54 44 56 40C54 48 50 52 44 50C40 48 42 44 46 44z"
        fill="url(#rg-mak)" opacity="0.3" stroke="url(#rg-mak)" strokeWidth="1.5" />
      {/* Ear/horn detail */}
      <circle cx="20" cy="8" r="2" fill="#f0d48a" opacity="0.5" />
    </svg>
  );
}

// 11. Kumbha (Aquarius) — Water bearer waves
export function KumbhaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="kum" />
      {/* Water waves — two parallel zigzags */}
      <path d="M8 26C14 20 20 32 26 26C32 20 38 32 44 26C50 20 56 32 56 26"
        stroke="url(#rg-kum)" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#gl-kum)" />
      <path d="M8 40C14 34 20 46 26 40C32 34 38 46 44 40C50 34 56 46 56 40"
        stroke="url(#rg-kum)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Water drops */}
      <circle cx="20" cy="52" r="2" fill="#f0d48a" opacity="0.4" />
      <circle cx="32" cy="54" r="1.5" fill="#f0d48a" opacity="0.3" />
      <circle cx="44" cy="52" r="2" fill="#f0d48a" opacity="0.4" />
    </svg>
  );
}

// 12. Meena (Pisces) — Two fish
export function MeenaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="mee" />
      {/* Fish 1 — swimming right */}
      <path d="M8 22C8 22 18 14 30 14C36 14 40 18 40 22C40 26 36 30 30 30C18 30 8 22 8 22z"
        stroke="url(#rg-mee)" strokeWidth="2" fill="url(#rg-mee)" fillOpacity="0.15" filter="url(#gl-mee)" />
      <path d="M40 22L50 16V28z" fill="url(#rg-mee)" opacity="0.3" />
      <circle cx="18" cy="22" r="2" fill="#f0d48a" />
      {/* Fish 2 — swimming left */}
      <path d="M56 42C56 42 46 34 34 34C28 34 24 38 24 42C24 46 28 50 34 50C46 50 56 42 56 42z"
        stroke="url(#rg-mee)" strokeWidth="2" fill="url(#rg-mee)" fillOpacity="0.15" />
      <path d="M24 42L14 36V48z" fill="url(#rg-mee)" opacity="0.3" />
      <circle cx="46" cy="42" r="2" fill="#f0d48a" />
      {/* Connecting cord */}
      <path d="M32 22C32 22 36 32 32 42" stroke="#f0d48a" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 3" />
    </svg>
  );
}

// ─── Export map keyed by rashi ID (1-12) ──────────────────────────
export const RASHI_ICONS: Record<number, React.FC<IconProps>> = {
  1: MeshaIcon,
  2: VrishabhaIcon,
  3: MithunaIcon,
  4: KarkaIcon,
  5: SimhaIcon,
  6: KanyaIcon,
  7: TulaIcon,
  8: VrishchikaIcon,
  9: DhanuIcon,
  10: MakaraIcon,
  11: KumbhaIcon,
  12: MeenaIcon,
};

export function RashiIconById({ id, size = 48, className }: IconProps & { id: number }) {
  const Icon = RASHI_ICONS[id];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
