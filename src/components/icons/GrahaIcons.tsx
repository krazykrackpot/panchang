'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

function Defs({ id, primary, secondary }: { id: string; primary: string; secondary: string }) {
  return (
    <defs>
      <radialGradient id={`grg-${id}`} cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor={secondary} />
        <stop offset="100%" stopColor={primary} />
      </radialGradient>
      <filter id={`gg-${id}`}>
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  );
}

// 0. Surya (Sun) — Radiant golden orb
export function SuryaIcon({ size = 48, className }: IconProps) {
  const c = '#e67e22', l = '#f5b041';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="sur" primary={c} secondary={l} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return <line key={i} x1={32 + 18 * Math.cos(a)} y1={32 + 18 * Math.sin(a)}
          x2={32 + 28 * Math.cos(a)} y2={32 + 28 * Math.sin(a)}
          stroke={l} strokeWidth={i % 2 === 0 ? 2.5 : 1.5} strokeLinecap="round" opacity={i % 2 === 0 ? 0.8 : 0.4} />;
      })}
      <circle cx="32" cy="32" r="14" fill={`url(#grg-sur)`} filter="url(#gg-sur)" />
      <circle cx="28" cy="28" r="4" fill={l} opacity="0.3" />
    </svg>
  );
}

// 1. Chandra (Moon) — Silver crescent
export function ChandraIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="cha" primary="#9b97a0" secondary="#ecf0f1" />
      <circle cx="32" cy="32" r="22" fill="url(#grg-cha)" filter="url(#gg-cha)" />
      <circle cx="42" cy="26" r="18" fill="#0a0e27" />
      {/* Craters */}
      <circle cx="24" cy="30" r="3" fill="#9b97a0" opacity="0.3" />
      <circle cx="28" cy="40" r="2" fill="#9b97a0" opacity="0.2" />
      <circle cx="20" cy="22" r="2" fill="#9b97a0" opacity="0.25" />
    </svg>
  );
}

// 2. Mangal (Mars) — Red warrior shield
export function MangalIcon({ size = 48, className }: IconProps) {
  const c = '#e74c3c', l = '#f1948a';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="man" primary={c} secondary={l} />
      <circle cx="28" cy="36" r="18" stroke={c} strokeWidth="2.5" fill={`url(#grg-man)`} fillOpacity="0.3" filter="url(#gg-man)" />
      {/* Arrow pointing NE */}
      <line x1="40" y1="24" x2="54" y2="10" stroke={l} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 10L46 12L52 18z" fill={l} />
    </svg>
  );
}

// 3. Budha (Mercury) — Green winged messenger
export function BudhaIcon({ size = 48, className }: IconProps) {
  const c = '#2ecc71', l = '#82e0aa';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="bud" primary={c} secondary={l} />
      <circle cx="32" cy="38" r="12" stroke={c} strokeWidth="2.5" fill={`url(#grg-bud)`} fillOpacity="0.3" filter="url(#gg-bud)" />
      {/* Cross below */}
      <line x1="32" y1="50" x2="32" y2="60" stroke={c} strokeWidth="2" />
      <line x1="26" y1="56" x2="38" y2="56" stroke={c} strokeWidth="2" />
      {/* Crescent on top */}
      <path d="M22 20C22 12 32 6 42 12C36 10 28 14 28 20" stroke={l} strokeWidth="2.5" fill="none" />
      {/* Horns/wings */}
      <path d="M24 26L18 16L26 22M40 26L46 16L38 22" stroke={l} strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  );
}

// 4. Guru/Brihaspati (Jupiter) — Golden wisdom orb
export function GuruIcon({ size = 48, className }: IconProps) {
  const c = '#f39c12', l = '#f9e79f';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="gur" primary={c} secondary={l} />
      {/* Large sphere */}
      <circle cx="32" cy="32" r="20" fill={`url(#grg-gur)`} fillOpacity="0.3" stroke={c} strokeWidth="2" filter="url(#gg-gur)" />
      {/* Bands */}
      <ellipse cx="32" cy="26" rx="18" ry="3" stroke={l} strokeWidth="1" opacity="0.4" fill="none" />
      <ellipse cx="32" cy="36" rx="19" ry="4" stroke={l} strokeWidth="1.5" opacity="0.5" fill="none" />
      {/* Great Red Spot */}
      <ellipse cx="38" cy="32" rx="5" ry="3" fill={c} opacity="0.5" />
      {/* Crescent */}
      <path d="M14 14C10 20 14 28 20 24" stroke={l} strokeWidth="2" fill="none" opacity="0.6" />
    </svg>
  );
}

// 5. Shukra (Venus) — Pearlescent circle with cross
export function ShukraIcon({ size = 48, className }: IconProps) {
  const c = '#e8e6e3', l = '#fdfefe';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="shu" primary={c} secondary={l} />
      <circle cx="32" cy="26" r="16" stroke={c} strokeWidth="2.5" fill={`url(#grg-shu)`} fillOpacity="0.25" filter="url(#gg-shu)" />
      {/* Venus cross */}
      <line x1="32" y1="42" x2="32" y2="58" stroke={c} strokeWidth="2.5" />
      <line x1="24" y1="50" x2="40" y2="50" stroke={c} strokeWidth="2.5" />
      {/* Luster */}
      <circle cx="26" cy="22" r="5" fill={l} opacity="0.15" />
    </svg>
  );
}

// 6. Shani (Saturn) — Blue ringed sphere
export function ShaniIcon({ size = 48, className }: IconProps) {
  const c = '#3498db', l = '#85c1e9';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="sha" primary={c} secondary={l} />
      <circle cx="32" cy="32" r="14" fill={`url(#grg-sha)`} fillOpacity="0.3" stroke={c} strokeWidth="2" filter="url(#gg-sha)" />
      {/* Ring */}
      <ellipse cx="32" cy="32" rx="26" ry="8" stroke={l} strokeWidth="2" fill="none" opacity="0.6"
        transform="rotate(-20 32 32)" />
      {/* Shadow band */}
      <ellipse cx="32" cy="34" rx="12" ry="2" fill={c} opacity="0.3" />
      {/* Cross/handle */}
      <path d="M44 20L52 8" stroke={l} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M50 8L56 12" stroke={l} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

// 7. Rahu — Purple shadowy ascending node
export function RahuIcon({ size = 48, className }: IconProps) {
  const c = '#8e44ad', l = '#c39bd3';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="rah" primary={c} secondary={l} />
      {/* Shadow sphere */}
      <circle cx="32" cy="32" r="20" fill={`url(#grg-rah)`} fillOpacity="0.2" filter="url(#gg-rah)" />
      {/* Dragon head silhouette */}
      <path d="M18 36C18 24 24 16 32 16s14 8 14 20"
        stroke={l} strokeWidth="2.5" fill="none" />
      {/* Eyes */}
      <circle cx="26" cy="30" r="3" fill={l} opacity="0.6" />
      <circle cx="38" cy="30" r="3" fill={l} opacity="0.6" />
      <circle cx="26" cy="30" r="1.5" fill={c} />
      <circle cx="38" cy="30" r="1.5" fill={c} />
      {/* Ascending node symbol */}
      <path d="M16 44C24 36 40 36 48 44" stroke={l} strokeWidth="2" fill="none" />
      <circle cx="32" cy="40" r="3" fill={l} opacity="0.4" />
      {/* Smoky trails */}
      <path d="M20 48C22 44 26 46 28 42M36 42C38 46 42 44 44 48" stroke={c} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

// 8. Ketu — Gray comet tail descending node
export function KetuIcon({ size = 48, className }: IconProps) {
  const c = '#95a5a6', l = '#d5dbdb';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="ket" primary={c} secondary={l} />
      {/* Comet head */}
      <circle cx="32" cy="20" r="10" fill={`url(#grg-ket)`} fillOpacity="0.4" filter="url(#gg-ket)" />
      {/* Tail streams */}
      <path d="M28 28C26 36 22 44 18 56" stroke={l} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <path d="M32 30C32 38 32 46 32 58" stroke={l} strokeWidth="2.5" opacity="0.4" strokeLinecap="round" />
      <path d="M36 28C38 36 42 44 46 56" stroke={l} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      {/* Descending node symbol */}
      <path d="M16 16C24 24 40 24 48 16" stroke={l} strokeWidth="2" fill="none" opacity="0.4" />
      {/* Headless indication — gap at top */}
      <path d="M26 14L32 8L38 14" stroke={c} strokeWidth="1.5" fill="none" opacity="0.3" />
    </svg>
  );
}

// ─── Export map keyed by graha ID (0-8) ───────────────────────────
export const GRAHA_ICONS: Record<number, React.FC<IconProps>> = {
  0: SuryaIcon,
  1: ChandraIcon,
  2: MangalIcon,
  3: BudhaIcon,
  4: GuruIcon,
  5: ShukraIcon,
  6: ShaniIcon,
  7: RahuIcon,
  8: KetuIcon,
};

export function GrahaIconById({ id, size = 48, className }: IconProps & { id: number }) {
  const Icon = GRAHA_ICONS[id];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
