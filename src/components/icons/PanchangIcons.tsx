'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  glowColor?: string;
}

const defaults = { size: 48, color: '#d4a853', glowColor: '#f0d48a' };

// ─── Shared gradient defs ──────────────────────────────────────────
function GoldGradient({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`gold-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0d48a" />
        <stop offset="50%" stopColor="#d4a853" />
        <stop offset="100%" stopColor="#8a6d2b" />
      </linearGradient>
      <filter id={`glow-${id}`}>
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

// ─── TITHI: Crescent Moon with phase arc ──────────────────────────
export function TithiIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="tithi" />
      {/* Outer moon circle */}
      <circle cx="32" cy="32" r="26" stroke="url(#gold-tithi)" strokeWidth="2" fill="none" opacity="0.3" />
      {/* Crescent moon */}
      <path
        d="M38 8C28 14 22 22 22 32s6 18 16 24c-2 0.7-4 1-6 1C18.7 57 8 46.3 8 32S18.7 7 32 7c2 0 4 0.3 6 1z"
        fill="url(#gold-tithi)"
        filter="url(#glow-tithi)"
      />
      {/* Phase indicator dots */}
      <circle cx="50" cy="20" r="2" fill="#f0d48a" opacity="0.6" />
      <circle cx="54" cy="32" r="1.5" fill="#f0d48a" opacity="0.4" />
      <circle cx="50" cy="44" r="2" fill="#f0d48a" opacity="0.6" />
    </svg>
  );
}

// ─── NAKSHATRA: Star with radiating points ────────────────────────
export function NakshatraIcon({ size = defaults.size, className }: IconProps) {
  const points = 8;
  const outerR = 22;
  const innerR = 10;
  const cx = 32, cy = 32;
  const starPath = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + 'Z';

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="nak" />
      {/* Outer glow ring */}
      <circle cx="32" cy="32" r="28" stroke="#f0d48a" strokeWidth="0.5" opacity="0.3" />
      {/* Star */}
      <path d={starPath} fill="url(#gold-nak)" filter="url(#glow-nak)" />
      {/* Center dot */}
      <circle cx="32" cy="32" r="3" fill="#0a0e27" />
      <circle cx="32" cy="32" r="2" fill="#f0d48a" />
    </svg>
  );
}

// ─── YOGA: Interlocking celestial rings ───────────────────────────
export function YogaIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="yoga" />
      {/* Sun circle */}
      <circle cx="24" cy="32" r="16" stroke="url(#gold-yoga)" strokeWidth="2.5" fill="none" />
      {/* Moon circle interlocking */}
      <circle cx="40" cy="32" r="16" stroke="url(#gold-yoga)" strokeWidth="2.5" fill="none" />
      {/* Intersection highlight */}
      <path
        d="M32 18.5c4.5 3.5 7.5 8 7.5 13.5s-3 10-7.5 13.5c-4.5-3.5-7.5-8-7.5-13.5s3-10 7.5-13.5z"
        fill="url(#gold-yoga)"
        opacity="0.3"
      />
      {/* Center point */}
      <circle cx="32" cy="32" r="2.5" fill="#f0d48a" filter="url(#glow-yoga)" />
    </svg>
  );
}

// ─── KARANA: Half-moon with geometric split ───────────────────────
export function KaranaIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="karana" />
      {/* Full circle outline */}
      <circle cx="32" cy="32" r="24" stroke="url(#gold-karana)" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Left half filled */}
      <path
        d="M32 8A24 24 0 0 0 32 56V8z"
        fill="url(#gold-karana)"
        filter="url(#glow-karana)"
      />
      {/* Right half with dots */}
      <circle cx="42" cy="24" r="2" fill="#f0d48a" opacity="0.3" />
      <circle cx="46" cy="32" r="2" fill="#f0d48a" opacity="0.3" />
      <circle cx="42" cy="40" r="2" fill="#f0d48a" opacity="0.3" />
      {/* Dividing line */}
      <line x1="32" y1="6" x2="32" y2="58" stroke="#f0d48a" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

// ─── VARA: Sun with radiating rays ────────────────────────────────
export function VaraIcon({ size = defaults.size, className }: IconProps) {
  const rays = 12;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="vara" />
      {/* Rays */}
      {Array.from({ length: rays }, (_, i) => {
        const angle = (Math.PI * 2 * i) / rays;
        const x1 = 32 + 16 * Math.cos(angle);
        const y1 = 32 + 16 * Math.sin(angle);
        const x2 = 32 + 26 * Math.cos(angle);
        const y2 = 32 + 26 * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="url(#gold-vara)" strokeWidth={i % 2 === 0 ? 2.5 : 1.5}
            strokeLinecap="round" opacity={i % 2 === 0 ? 0.9 : 0.5} />
        );
      })}
      {/* Center sun */}
      <circle cx="32" cy="32" r="14" fill="url(#gold-vara)" filter="url(#glow-vara)" />
      <circle cx="32" cy="32" r="10" fill="#0a0e27" />
      <circle cx="32" cy="32" r="6" fill="url(#gold-vara)" opacity="0.7" />
    </svg>
  );
}

// ─── MUHURTA: Hourglass / Time ────────────────────────────────────
export function MuhurtaIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="muhurta" />
      {/* Top triangle */}
      <path d="M16 12h32L32 32z" fill="url(#gold-muhurta)" opacity="0.8" />
      {/* Bottom triangle */}
      <path d="M16 52h32L32 32z" fill="url(#gold-muhurta)" opacity="0.5" />
      {/* Frame */}
      <line x1="14" y1="12" x2="50" y2="12" stroke="#f0d48a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="52" x2="50" y2="52" stroke="#f0d48a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sand particles */}
      <circle cx="32" cy="32" r="1.5" fill="#f0d48a" filter="url(#glow-muhurta)" />
      <circle cx="30" cy="38" r="1" fill="#f0d48a" opacity="0.6" />
      <circle cx="34" cy="40" r="1" fill="#f0d48a" opacity="0.6" />
      <circle cx="32" cy="44" r="1" fill="#f0d48a" opacity="0.4" />
    </svg>
  );
}

// ─── GRAHAN: Eclipse — overlapping sun and moon ───────────────────
export function GrahanIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="grahan" />
      {/* Corona rays */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 16;
        const x1 = 32 + 20 * Math.cos(angle);
        const y1 = 32 + 20 * Math.sin(angle);
        const x2 = 32 + 28 * Math.cos(angle);
        const y2 = 32 + 28 * Math.sin(angle);
        const opacity = 0.2 + (i % 5) * 0.06;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#f0d48a" strokeWidth="1" opacity={opacity} />;
      })}
      {/* Sun */}
      <circle cx="32" cy="32" r="18" fill="url(#gold-grahan)" opacity="0.4" />
      {/* Moon (eclipsing) */}
      <circle cx="34" cy="30" r="16" fill="#0a0e27" />
      {/* Baily's beads */}
      <circle cx="18" cy="24" r="2" fill="#f0d48a" filter="url(#glow-grahan)" />
      <circle cx="16" cy="32" r="1.5" fill="#f0d48a" opacity="0.7" />
    </svg>
  );
}

// ─── RASHI: Zodiac wheel segment ──────────────────────────────────
export function RashiIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="rashi" />
      {/* Outer wheel */}
      <circle cx="32" cy="32" r="26" stroke="url(#gold-rashi)" strokeWidth="2" fill="none" />
      {/* 12 segments */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        const x = 32 + 26 * Math.cos(angle);
        const y = 32 + 26 * Math.sin(angle);
        return <line key={i} x1="32" y1="32" x2={x} y2={y}
          stroke="url(#gold-rashi)" strokeWidth="1" opacity="0.4" />;
      })}
      {/* Inner circle */}
      <circle cx="32" cy="32" r="12" stroke="#f0d48a" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Aries marker */}
      <circle cx="32" cy="6" r="3" fill="url(#gold-rashi)" filter="url(#glow-rashi)" />
    </svg>
  );
}

// ─── MASA: Lunar month — waxing/waning cycle ──────────────────────
export function MasaIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="masa" />
      {/* Orbit path */}
      <ellipse cx="32" cy="32" rx="26" ry="12" stroke="url(#gold-masa)" strokeWidth="1.5" fill="none" opacity="0.4"
        transform="rotate(-20 32 32)" />
      {/* Moon phases along path */}
      <circle cx="10" cy="28" r="5" fill="url(#gold-masa)" opacity="0.3" />
      <circle cx="22" cy="20" r="5" fill="url(#gold-masa)" opacity="0.5" />
      <circle cx="38" cy="18" r="6" fill="url(#gold-masa)" filter="url(#glow-masa)" />
      <circle cx="52" cy="24" r="5" fill="url(#gold-masa)" opacity="0.5" />
      {/* Calendar tick marks */}
      <line x1="8" y1="50" x2="56" y2="50" stroke="#f0d48a" strokeWidth="1" opacity="0.3" />
      {Array.from({ length: 15 }, (_, i) => (
        <line key={i} x1={8 + i * 3.4} y1="48" x2={8 + i * 3.4} y2="52"
          stroke="#f0d48a" strokeWidth="1" opacity={i === 7 ? 0.9 : 0.3} />
      ))}
    </svg>
  );
}

// ─── SAMVATSARA: Cycle wheel with 60 segments ─────────────────────
export function SamvatsaraIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="samv" />
      {/* Outer ring with tick marks */}
      <circle cx="32" cy="32" r="26" stroke="url(#gold-samv)" strokeWidth="2" fill="none" opacity="0.4" />
      {/* 12 major ticks (for 5 cycles of 12) */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        const x1 = 32 + 23 * Math.cos(angle);
        const y1 = 32 + 23 * Math.sin(angle);
        const x2 = 32 + 26 * Math.cos(angle);
        const y2 = 32 + 26 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#f0d48a" strokeWidth="1.5" />;
      })}
      {/* Inner cycle arrow */}
      <path
        d="M32 14a18 18 0 0 1 15.6 9"
        stroke="url(#gold-samv)" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <path
        d="M47.6 23l2-5 5 2"
        stroke="#f0d48a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Center Om/cycle symbol */}
      <circle cx="32" cy="32" r="8" fill="url(#gold-samv)" opacity="0.2" />
      <text x="32" y="36" textAnchor="middle" fill="#f0d48a" fontSize="12" fontWeight="bold">60</text>
    </svg>
  );
}

// ─── SUNRISE icon ─────────────────────────────────────────────────
export function SunriseIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="rise" />
      {/* Horizon line */}
      <line x1="6" y1="40" x2="58" y2="40" stroke="#f0d48a" strokeWidth="2" opacity="0.5" />
      {/* Rising sun arc */}
      <path d="M14 40a18 18 0 0 1 36 0" fill="url(#gold-rise)" filter="url(#glow-rise)" />
      {/* Rays above */}
      {[0, 30, 60, 90, 120, 150, 180].map((deg, i) => {
        const angle = (deg * Math.PI) / 180;
        const x1 = 32 + 20 * Math.cos(Math.PI + angle);
        const y1 = 40 + 20 * Math.sin(Math.PI + angle);
        const x2 = 32 + 28 * Math.cos(Math.PI + angle);
        const y2 = 40 + 28 * Math.sin(Math.PI + angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#f0d48a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />;
      })}
    </svg>
  );
}

// ─── SUNSET icon ──────────────────────────────────────────────────
export function SunsetIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="set" />
      <line x1="6" y1="40" x2="58" y2="40" stroke="#8a6d2b" strokeWidth="2" opacity="0.5" />
      <path d="M14 40a18 18 0 0 1 36 0" fill="url(#gold-set)" opacity="0.4" />
      {/* Down arrow */}
      <path d="M32 20v14M26 28l6 6 6-6" stroke="#f0d48a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

// ─── MOONRISE icon ────────────────────────────────────────────────
export function MoonriseIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="mrise" />
      <line x1="6" y1="40" x2="58" y2="40" stroke="#f0d48a" strokeWidth="1.5" opacity="0.4" />
      {/* Crescent rising */}
      <path
        d="M38 18c-6 4-10 10-10 16h0a18 18 0 0 1 24 0h0c0-8-2-14-8-18-2 2-4 2-6 2z"
        fill="url(#gold-mrise)" opacity="0.7"
      />
      {/* Stars */}
      <circle cx="16" cy="20" r="1" fill="#f0d48a" opacity="0.5" />
      <circle cx="52" cy="16" r="1.5" fill="#f0d48a" opacity="0.4" />
      <circle cx="48" cy="28" r="1" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

// ─── RITU: Season leaf/cycle ──────────────────────────────────────
export function RituIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="ritu" />
      {/* Leaf shape */}
      <path
        d="M32 8C18 18 12 28 12 38c0 10 9 18 20 18s20-8 20-18C52 28 46 18 32 8z"
        fill="url(#gold-ritu)" opacity="0.3" stroke="url(#gold-ritu)" strokeWidth="1.5"
      />
      {/* Leaf vein */}
      <path d="M32 14v38" stroke="#f0d48a" strokeWidth="1.5" opacity="0.5" />
      <path d="M32 24l-8 6M32 30l8 5M32 36l-6 5" stroke="#f0d48a" strokeWidth="1" opacity="0.4" />
      {/* Season indicator dots */}
      <circle cx="32" cy="6" r="2" fill="#f0d48a" filter="url(#glow-ritu)" />
    </svg>
  );
}

// ─── AYANA: Solstice path ─────────────────────────────────────────
export function AyanaIcon({ size = defaults.size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <GoldGradient id="ayana" />
      {/* Sine wave path */}
      <path
        d="M6 32C16 16 24 16 32 32s16 16 26 0"
        stroke="url(#gold-ayana)" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      {/* Sun at peak */}
      <circle cx="18" cy="18" r="6" fill="url(#gold-ayana)" filter="url(#glow-ayana)" />
      {/* Sun at trough */}
      <circle cx="46" cy="46" r="5" fill="url(#gold-ayana)" opacity="0.4" />
      {/* Equator line */}
      <line x1="4" y1="32" x2="60" y2="32" stroke="#f0d48a" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
    </svg>
  );
}

// ─── Export map for easy lookup ────────────────────────────────────
export const PANCHANG_ICONS = {
  tithi: TithiIcon,
  nakshatra: NakshatraIcon,
  yoga: YogaIcon,
  karana: KaranaIcon,
  vara: VaraIcon,
  muhurta: MuhurtaIcon,
  grahan: GrahanIcon,
  rashi: RashiIcon,
  masa: MasaIcon,
  samvatsara: SamvatsaraIcon,
  sunrise: SunriseIcon,
  sunset: SunsetIcon,
  moonrise: MoonriseIcon,
  ritu: RituIcon,
  ayana: AyanaIcon,
} as const;
