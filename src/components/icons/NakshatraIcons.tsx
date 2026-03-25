'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`ng-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0d48a" />
        <stop offset="50%" stopColor="#d4a853" />
        <stop offset="100%" stopColor="#8a6d2b" />
      </linearGradient>
      <radialGradient id={`rg-${id}`} cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#f0d48a" />
        <stop offset="100%" stopColor="#8a6d2b" />
      </radialGradient>
      <filter id={`gl-${id}`}>
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  );
}

// 1. Ashwini — Horse head (swift healers)
export function AshwiniIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="ash" />
      {/* Horse head profile */}
      <path d="M20 48L22 34L18 26L22 16L28 10L36 8L42 12L44 20L48 24L46 30L40 34L38 44L34 48"
        stroke="url(#ng-ash)" strokeWidth="2.5" fill="url(#ng-ash)" fillOpacity="0.15" strokeLinejoin="round" filter="url(#gl-ash)" />
      {/* Eye */}
      <circle cx="36" cy="18" r="2.5" fill="#f0d48a" />
      {/* Mane lines */}
      <path d="M28 10L24 18M32 8L30 16M36 8L34 14" stroke="#f0d48a" strokeWidth="1.5" opacity="0.5" />
      {/* Star marks */}
      <circle cx="12" cy="12" r="1.5" fill="#f0d48a" opacity="0.4" />
      <circle cx="54" cy="10" r="1" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

// 2. Bharani — Yoni/Triangle (creation)
export function BharaniIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="bha" />
      {/* Inverted triangle */}
      <path d="M32 52L12 16h40z" stroke="url(#ng-bha)" strokeWidth="2.5" fill="url(#ng-bha)" fillOpacity="0.15" strokeLinejoin="round" filter="url(#gl-bha)" />
      {/* Inner triangle */}
      <path d="M32 44L20 22h24z" stroke="#f0d48a" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Center circle — seed of life */}
      <circle cx="32" cy="28" r="4" fill="url(#ng-bha)" opacity="0.6" />
      <circle cx="32" cy="28" r="2" fill="#f0d48a" />
    </svg>
  );
}

// 3. Krittika — Flame / Razor
export function KrittikaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="kri" />
      {/* Main flame */}
      <path d="M32 6C26 18 18 28 18 40c0 10 6 18 14 18s14-8 14-18C46 28 38 18 32 6z"
        fill="url(#rg-kri)" opacity="0.3" stroke="url(#ng-kri)" strokeWidth="2" />
      {/* Inner flame */}
      <path d="M32 16c-4 8-8 14-8 22 0 6 4 10 8 10s8-4 8-10c0-8-4-14-8-22z"
        fill="url(#ng-kri)" opacity="0.5" filter="url(#gl-kri)" />
      {/* Core */}
      <ellipse cx="32" cy="42" rx="3" ry="5" fill="#f0d48a" opacity="0.8" />
    </svg>
  );
}

// 4. Rohini — Chariot / Cart (creation, growth)
export function RohiniIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="roh" />
      {/* Cart body */}
      <rect x="16" y="22" width="32" height="18" rx="3" stroke="url(#ng-roh)" strokeWidth="2" fill="url(#ng-roh)" fillOpacity="0.15" />
      {/* Wheels */}
      <circle cx="22" cy="46" r="8" stroke="url(#ng-roh)" strokeWidth="2" fill="none" filter="url(#gl-roh)" />
      <circle cx="42" cy="46" r="8" stroke="url(#ng-roh)" strokeWidth="2" fill="none" />
      {/* Wheel spokes */}
      <line x1="22" y1="38" x2="22" y2="54" stroke="#f0d48a" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="46" x2="30" y2="46" stroke="#f0d48a" strokeWidth="1" opacity="0.5" />
      <line x1="42" y1="38" x2="42" y2="54" stroke="#f0d48a" strokeWidth="1" opacity="0.5" />
      <line x1="34" y1="46" x2="50" y2="46" stroke="#f0d48a" strokeWidth="1" opacity="0.5" />
      {/* Axle */}
      <circle cx="22" cy="46" r="2" fill="#f0d48a" />
      <circle cx="42" cy="46" r="2" fill="#f0d48a" />
      {/* Yoke */}
      <path d="M16 30L6 24L4 18" stroke="url(#ng-roh)" strokeWidth="2" strokeLinecap="round" />
      {/* Star */}
      <circle cx="50" cy="12" r="2" fill="#f0d48a" opacity="0.6" />
    </svg>
  );
}

// 5. Mrigashira — Deer head (searching, quest)
export function MrigashiraIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="mri" />
      {/* Antlers */}
      <path d="M24 26L18 12L14 6M24 26L22 14L26 8" stroke="url(#ng-mri)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M40 26L46 12L50 6M40 26L42 14L38 8" stroke="url(#ng-mri)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Head */}
      <ellipse cx="32" cy="36" rx="12" ry="16" stroke="url(#ng-mri)" strokeWidth="2.5" fill="url(#ng-mri)" fillOpacity="0.12" filter="url(#gl-mri)" />
      {/* Eyes */}
      <circle cx="27" cy="32" r="2" fill="#f0d48a" />
      <circle cx="37" cy="32" r="2" fill="#f0d48a" />
      {/* Nose */}
      <ellipse cx="32" cy="42" rx="3" ry="2" fill="url(#ng-mri)" opacity="0.5" />
      {/* Ears */}
      <path d="M22 28L16 22L20 30M42 28L48 22L44 30" stroke="#f0d48a" strokeWidth="1.5" fill="url(#ng-mri)" fillOpacity="0.2" />
    </svg>
  );
}

// 6. Ardra — Teardrop / Diamond (storm, transformation)
export function ArdraIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="ard" />
      {/* Main teardrop */}
      <path d="M32 8C32 8 14 30 14 42c0 8 8 14 18 14s18-6 18-14C50 30 32 8 32 8z"
        fill="url(#rg-ard)" opacity="0.25" stroke="url(#ng-ard)" strokeWidth="2.5" filter="url(#gl-ard)" />
      {/* Inner ripple */}
      <path d="M32 18C32 18 22 32 22 40c0 5 4.5 8 10 8s10-3 10-8c0-8-10-22-10-22z"
        fill="url(#ng-ard)" opacity="0.3" />
      {/* Highlight */}
      <ellipse cx="28" cy="36" rx="3" ry="5" fill="#f0d48a" opacity="0.3" transform="rotate(-15 28 36)" />
      {/* Small drops */}
      <circle cx="20" cy="14" r="2" fill="#f0d48a" opacity="0.4" />
      <circle cx="44" cy="18" r="1.5" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

// 7. Punarvasu — Bow and quiver (return, renewal)
export function PunarvasuIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="pun" />
      {/* Bow */}
      <path d="M16 52C10 36 10 28 16 12" stroke="url(#ng-pun)" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#gl-pun)" />
      {/* Bowstring */}
      <line x1="16" y1="12" x2="16" y2="52" stroke="#f0d48a" strokeWidth="1.5" opacity="0.6" />
      {/* Arrow */}
      <line x1="16" y1="32" x2="54" y2="32" stroke="url(#ng-pun)" strokeWidth="2" strokeLinecap="round" />
      {/* Arrowhead */}
      <path d="M54 32L46 26V38z" fill="url(#ng-pun)" />
      {/* Fletching */}
      <path d="M18 32L22 28M18 32L22 36" stroke="#f0d48a" strokeWidth="1.5" opacity="0.5" />
      {/* Stars (the twins) */}
      <circle cx="48" cy="14" r="3" fill="#f0d48a" opacity="0.5" />
      <circle cx="56" cy="20" r="2.5" fill="#f0d48a" opacity="0.4" />
    </svg>
  );
}

// 8. Pushya — Lotus flower (nourishment)
export function PushyaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="pus" />
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <ellipse key={i} cx="32" cy="20" rx="6" ry="12"
          fill="url(#ng-pus)" fillOpacity={0.2 + (i % 2) * 0.1}
          stroke="url(#ng-pus)" strokeWidth="1"
          transform={`rotate(${deg} 32 32)`} />
      ))}
      {/* Center */}
      <circle cx="32" cy="32" r="6" fill="url(#ng-pus)" filter="url(#gl-pus)" />
      <circle cx="32" cy="32" r="3" fill="#0a0e27" />
      <circle cx="32" cy="32" r="1.5" fill="#f0d48a" />
    </svg>
  );
}

// 9. Ashlesha — Coiled serpent (mystical energy)
export function AshleshaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="asl" />
      {/* Coiled body */}
      <path d="M32 56C20 56 12 48 12 40s6-14 14-14c-4 0-8-4-8-10s6-10 14-10c8 0 14 4 14 10s-4 10-8 10c8 0 14 6 14 14s-8 16-20 16z"
        stroke="url(#ng-asl)" strokeWidth="2.5" fill="url(#ng-asl)" fillOpacity="0.12" filter="url(#gl-asl)" />
      {/* Head */}
      <circle cx="32" cy="10" r="5" fill="url(#ng-asl)" opacity="0.5" />
      {/* Eyes */}
      <circle cx="30" cy="9" r="1" fill="#f0d48a" />
      <circle cx="34" cy="9" r="1" fill="#f0d48a" />
      {/* Tongue */}
      <path d="M32 14L30 18M32 14L34 18" stroke="#f0d48a" strokeWidth="1" strokeLinecap="round" />
      {/* Scales pattern */}
      <circle cx="22" cy="36" r="1.5" fill="#f0d48a" opacity="0.2" />
      <circle cx="28" cy="44" r="1.5" fill="#f0d48a" opacity="0.2" />
      <circle cx="36" cy="48" r="1.5" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

// 10. Magha — Royal throne / Crown (ancestry, authority)
export function MaghaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="mag" />
      {/* Crown base */}
      <path d="M14 40h36v10H14z" fill="url(#ng-mag)" opacity="0.3" stroke="url(#ng-mag)" strokeWidth="1.5" />
      {/* Crown peaks */}
      <path d="M14 40L8 18L22 30L32 10L42 30L56 18L50 40"
        stroke="url(#ng-mag)" strokeWidth="2.5" fill="url(#ng-mag)" fillOpacity="0.2" strokeLinejoin="round" filter="url(#gl-mag)" />
      {/* Jewels */}
      <circle cx="32" cy="14" r="3" fill="#f0d48a" />
      <circle cx="22" cy="30" r="2.5" fill="#f0d48a" opacity="0.7" />
      <circle cx="42" cy="30" r="2.5" fill="#f0d48a" opacity="0.7" />
      <circle cx="10" cy="20" r="2" fill="#f0d48a" opacity="0.5" />
      <circle cx="54" cy="20" r="2" fill="#f0d48a" opacity="0.5" />
      {/* Band detail */}
      <line x1="14" y1="44" x2="50" y2="44" stroke="#f0d48a" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

// 11. Purva Phalguni — Hammock / Swinging bed (enjoyment)
export function PurvaPhalgIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="ppf" />
      {/* Support poles */}
      <line x1="12" y1="8" x2="12" y2="56" stroke="url(#ng-ppf)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="8" x2="52" y2="56" stroke="url(#ng-ppf)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hammock curve */}
      <path d="M12 20C12 20 22 44 32 44S52 20 52 20"
        stroke="url(#ng-ppf)" strokeWidth="2.5" fill="url(#ng-ppf)" fillOpacity="0.15" filter="url(#gl-ppf)" />
      {/* Cross ropes */}
      <path d="M12 20L52 20" stroke="#f0d48a" strokeWidth="1" opacity="0.3" />
      <path d="M16 28L48 28" stroke="#f0d48a" strokeWidth="1" opacity="0.2" />
      {/* Decorative tassels */}
      <circle cx="12" cy="8" r="2" fill="#f0d48a" />
      <circle cx="52" cy="8" r="2" fill="#f0d48a" />
    </svg>
  );
}

// 12. Uttara Phalguni — Sun / Patronage (friendship)
export function UttaraPhalgIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="upf" />
      {/* Bed/cot frame */}
      <rect x="10" y="26" width="44" height="22" rx="2" stroke="url(#ng-upf)" strokeWidth="2" fill="url(#ng-upf)" fillOpacity="0.1" />
      {/* Legs */}
      <line x1="14" y1="48" x2="14" y2="56" stroke="url(#ng-upf)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="48" x2="50" y2="56" stroke="url(#ng-upf)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sun above */}
      <circle cx="32" cy="14" r="7" fill="url(#ng-upf)" filter="url(#gl-upf)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return <line key={i} x1={32 + 9 * Math.cos(a)} y1={14 + 9 * Math.sin(a)}
          x2={32 + 13 * Math.cos(a)} y2={14 + 13 * Math.sin(a)}
          stroke="#f0d48a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />;
      })}
    </svg>
  );
}

// 13. Hasta — Open hand (skill, dexterity)
export function HastaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="has" />
      {/* Palm */}
      <path d="M24 54V28L20 16L24 14V8L28 6V14L32 4L36 6V14L40 6L44 8V14L46 12L48 16L44 28V54z"
        stroke="url(#ng-has)" strokeWidth="2" fill="url(#ng-has)" fillOpacity="0.15" strokeLinejoin="round" filter="url(#gl-has)" />
      {/* Palm lines */}
      <path d="M26 34C30 30 38 30 42 34" stroke="#f0d48a" strokeWidth="1" opacity="0.4" />
      <path d="M26 40C30 37 36 37 40 40" stroke="#f0d48a" strokeWidth="1" opacity="0.3" />
      {/* Center symbol */}
      <circle cx="34" cy="38" r="3" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

// 14. Chitra — Pearl / Gem (brilliance)
export function ChitraIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="chi" />
      {/* Diamond gem */}
      <path d="M32 8L52 28L32 56L12 28z" stroke="url(#ng-chi)" strokeWidth="2.5"
        fill="url(#rg-chi)" fillOpacity="0.2" filter="url(#gl-chi)" />
      {/* Facets */}
      <path d="M32 8L22 28h20z" fill="url(#ng-chi)" opacity="0.15" />
      <path d="M12 28L32 56L22 28z" fill="url(#ng-chi)" opacity="0.1" />
      <path d="M52 28L32 56L42 28z" fill="url(#ng-chi)" opacity="0.2" />
      {/* Top facet line */}
      <line x1="22" y1="28" x2="42" y2="28" stroke="#f0d48a" strokeWidth="1" opacity="0.4" />
      {/* Sparkles */}
      <circle cx="30" cy="22" r="2" fill="#f0d48a" opacity="0.6" />
      <circle cx="38" cy="36" r="1.5" fill="#f0d48a" opacity="0.4" />
    </svg>
  );
}

// 15. Swati — Coral / Young plant shoot (independence)
export function SwatiIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="swa" />
      {/* Stem */}
      <path d="M32 56C32 56 30 40 28 34s2-12 4-20" stroke="url(#ng-swa)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M32 14C26 18 22 26 28 34" stroke="url(#ng-swa)" strokeWidth="2" fill="url(#ng-swa)" fillOpacity="0.15" />
      <path d="M32 14C38 18 44 24 36 30" stroke="url(#ng-swa)" strokeWidth="2" fill="url(#ng-swa)" fillOpacity="0.15" />
      {/* Tendril */}
      <path d="M36 30C42 28 46 22 44 16" stroke="#f0d48a" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Wind lines */}
      <path d="M8 20h12M6 28h10M10 36h8" stroke="#f0d48a" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      {/* Bud */}
      <circle cx="32" cy="12" r="3.5" fill="url(#ng-swa)" filter="url(#gl-swa)" />
    </svg>
  );
}

// 16. Vishakha — Triumphal archway / forked branch (determination)
export function VishakhaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="vis" />
      {/* Archway */}
      <path d="M12 56V24C12 14 22 6 32 6s20 8 20 18v32"
        stroke="url(#ng-vis)" strokeWidth="2.5" fill="none" filter="url(#gl-vis)" />
      {/* Inner arch */}
      <path d="M20 56V30c0-6 5-12 12-12s12 6 12 12v26"
        stroke="#f0d48a" strokeWidth="1.5" fill="url(#ng-vis)" fillOpacity="0.1" />
      {/* Keystone */}
      <path d="M28 8L32 4L36 8" stroke="#f0d48a" strokeWidth="2" fill="url(#ng-vis)" fillOpacity="0.3" />
      {/* Decorative circles */}
      <circle cx="32" cy="12" r="3" fill="#f0d48a" opacity="0.5" />
      <circle cx="20" cy="40" r="2" fill="#f0d48a" opacity="0.3" />
      <circle cx="44" cy="40" r="2" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

// 17. Anuradha — Lotus (devotion, friendship)
export function AnuradhaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="anu" />
      {/* Lotus petals - top layer */}
      <path d="M32 12C28 20 24 28 32 36C40 28 36 20 32 12z" fill="url(#ng-anu)" opacity="0.5" filter="url(#gl-anu)" />
      <path d="M16 28C22 28 28 30 32 36C26 38 20 36 16 28z" fill="url(#ng-anu)" opacity="0.4" />
      <path d="M48 28C42 28 36 30 32 36C38 38 44 36 48 28z" fill="url(#ng-anu)" opacity="0.4" />
      {/* Lower petals */}
      <path d="M12 38C18 34 26 34 32 36C26 42 18 42 12 38z" fill="url(#ng-anu)" opacity="0.25" />
      <path d="M52 38C46 34 38 34 32 36C38 42 46 42 52 38z" fill="url(#ng-anu)" opacity="0.25" />
      {/* Stem */}
      <path d="M32 36V56" stroke="url(#ng-anu)" strokeWidth="2" />
      {/* Water */}
      <path d="M8 52C16 48 24 52 32 48C40 52 48 48 56 52" stroke="#f0d48a" strokeWidth="1" opacity="0.3" />
      {/* Center */}
      <circle cx="32" cy="32" r="3" fill="#f0d48a" />
    </svg>
  );
}

// 18. Jyeshtha — Circular earring / Talisman (protection, seniority)
export function JyeshthaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="jye" />
      {/* Outer ring */}
      <circle cx="32" cy="30" r="20" stroke="url(#ng-jye)" strokeWidth="3" fill="none" filter="url(#gl-jye)" />
      {/* Inner ring */}
      <circle cx="32" cy="30" r="12" stroke="url(#ng-jye)" strokeWidth="2" fill="url(#ng-jye)" fillOpacity="0.1" />
      {/* Center jewel */}
      <circle cx="32" cy="30" r="5" fill="url(#rg-jye)" />
      <circle cx="32" cy="30" r="2.5" fill="#f0d48a" />
      {/* Pendant drop */}
      <path d="M32 50L28 56h8z" fill="url(#ng-jye)" />
      <line x1="32" y1="50" x2="32" y2="42" stroke="url(#ng-jye)" strokeWidth="1.5" />
      {/* Decorative dots */}
      <circle cx="32" cy="12" r="2" fill="#f0d48a" opacity="0.5" />
      <circle cx="14" cy="30" r="2" fill="#f0d48a" opacity="0.4" />
      <circle cx="50" cy="30" r="2" fill="#f0d48a" opacity="0.4" />
    </svg>
  );
}

// 19. Mula — Roots / tied bunch (foundation, origin)
export function MulaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="mul" />
      {/* Root system */}
      <path d="M32 8V24" stroke="url(#ng-mul)" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 24C32 24 20 30 14 42s-2 16 2 18" stroke="url(#ng-mul)" strokeWidth="2.5" fill="none" filter="url(#gl-mul)" />
      <path d="M32 24C32 24 44 30 50 42s2 16-2 18" stroke="url(#ng-mul)" strokeWidth="2.5" fill="none" />
      <path d="M32 24C32 24 30 36 30 48s0 10 2 12" stroke="url(#ng-mul)" strokeWidth="2" fill="none" />
      {/* Side roots */}
      <path d="M22 36L16 44M42 36L48 44" stroke="#f0d48a" strokeWidth="1.5" opacity="0.4" />
      {/* Tie/knot */}
      <ellipse cx="32" cy="24" rx="6" ry="3" fill="url(#ng-mul)" opacity="0.5" />
      {/* Earth line */}
      <line x1="6" y1="28" x2="58" y2="28" stroke="#f0d48a" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
    </svg>
  );
}

// 20. Purva Ashadha — Fan / Winnowing basket (invincibility)
export function PurvaAshadhaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="pas" />
      {/* Fan shape */}
      <path d="M32 52C32 52 8 30 8 18C8 12 14 8 22 12C26 14 30 18 32 24C34 18 38 14 42 12C50 8 56 12 56 18C56 30 32 52 32 52z"
        stroke="url(#ng-pas)" strokeWidth="2.5" fill="url(#ng-pas)" fillOpacity="0.15" strokeLinejoin="round" filter="url(#gl-pas)" />
      {/* Ribs */}
      <path d="M32 52L18 22M32 52L26 18M32 52V16M32 52L38 18M32 52L46 22"
        stroke="#f0d48a" strokeWidth="1" opacity="0.3" />
      {/* Water drops */}
      <circle cx="20" cy="44" r="2" fill="#f0d48a" opacity="0.4" />
      <circle cx="44" cy="44" r="2" fill="#f0d48a" opacity="0.4" />
      <circle cx="32" cy="10" r="2.5" fill="#f0d48a" opacity="0.6" />
    </svg>
  );
}

// 21. Uttara Ashadha — Elephant tusk (final victory)
export function UttaraAshadhaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="uas" />
      {/* Tusk */}
      <path d="M24 8C22 16 20 28 22 40C24 50 30 56 36 56C40 56 42 50 40 40C38 28 34 16 30 8"
        stroke="url(#ng-uas)" strokeWidth="2.5" fill="url(#ng-uas)" fillOpacity="0.2" filter="url(#gl-uas)" />
      {/* Second tusk */}
      <path d="M36 12C34 18 34 30 38 40C40 48 44 52 48 50"
        stroke="url(#ng-uas)" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Base/mount */}
      <ellipse cx="28" cy="8" rx="5" ry="3" fill="url(#ng-uas)" opacity="0.5" />
      {/* Victory star */}
      <path d="M50 12l2-6 2 6-6-2h6z" fill="#f0d48a" opacity="0.5" />
    </svg>
  );
}

// 22. Shravana — Three footprints / Ear (listening, learning)
export function ShravanaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="shr" />
      {/* Ear outline */}
      <path d="M40 12C50 16 54 26 52 36C50 44 44 50 38 52C34 54 28 52 26 48C24 44 28 40 32 38C36 36 38 32 38 28C38 24 36 20 32 18C28 16 24 20 24 26"
        stroke="url(#ng-shr)" strokeWidth="2.5" fill="none" filter="url(#gl-shr)" />
      {/* Inner ear */}
      <path d="M32 26C30 28 30 32 32 34" stroke="#f0d48a" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Sound waves */}
      <path d="M14 24C12 28 12 32 14 36" stroke="#f0d48a" strokeWidth="1.5" opacity="0.3" />
      <path d="M10 20C6 26 6 34 10 40" stroke="#f0d48a" strokeWidth="1.5" opacity="0.2" />
      {/* Three footprints (Vishnu's steps) */}
      <circle cx="48" cy="48" r="2" fill="#f0d48a" opacity="0.5" />
      <circle cx="54" cy="42" r="2" fill="#f0d48a" opacity="0.4" />
      <circle cx="58" cy="36" r="2" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

// 23. Dhanishtha — Drum / Mridanga (wealth, music)
export function DhanishthaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="dha" />
      {/* Drum body */}
      <ellipse cx="32" cy="32" rx="12" ry="22" stroke="url(#ng-dha)" strokeWidth="2.5"
        fill="url(#ng-dha)" fillOpacity="0.15" filter="url(#gl-dha)" />
      {/* Top and bottom heads */}
      <ellipse cx="32" cy="12" rx="12" ry="5" stroke="url(#ng-dha)" strokeWidth="2" fill="url(#ng-dha)" fillOpacity="0.2" />
      <ellipse cx="32" cy="52" rx="12" ry="5" stroke="url(#ng-dha)" strokeWidth="2" fill="url(#ng-dha)" fillOpacity="0.2" />
      {/* Binding ropes */}
      <path d="M20 14L44 50M44 14L20 50" stroke="#f0d48a" strokeWidth="1" opacity="0.4" />
      <path d="M22 12L42 52M42 12L22 52" stroke="#f0d48a" strokeWidth="1" opacity="0.3" />
      {/* Sound vibrations */}
      <path d="M48 26C50 28 50 36 48 38" stroke="#f0d48a" strokeWidth="1.5" opacity="0.3" />
      <path d="M52 22C56 28 56 36 52 42" stroke="#f0d48a" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

// 24. Shatabhisha — Empty circle / 100 stars (healing, mysticism)
export function ShatabhishaIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="sat" />
      {/* Outer ring */}
      <circle cx="32" cy="32" r="24" stroke="url(#ng-sat)" strokeWidth="2.5" fill="none" filter="url(#gl-sat)" />
      {/* 100 stars (represented as dots around) */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 24;
        const r = 20;
        return <circle key={i} cx={32 + r * Math.cos(angle)} cy={32 + r * Math.sin(angle)}
          r={i % 3 === 0 ? 1.5 : 1} fill="#f0d48a" opacity={0.3 + (i % 3) * 0.15} />;
      })}
      {/* Inner circle of stars */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 12;
        return <circle key={i} cx={32 + 12 * Math.cos(angle)} cy={32 + 12 * Math.sin(angle)}
          r={1} fill="#f0d48a" opacity={0.2 + (i % 2) * 0.15} />;
      })}
      {/* Center — healing symbol */}
      <circle cx="32" cy="32" r="4" fill="url(#ng-sat)" opacity="0.4" />
      <circle cx="32" cy="32" r="2" fill="#f0d48a" />
    </svg>
  );
}

// 25. Purva Bhadrapada — Sword / Two-faced man (spiritual fire)
export function PurvaBhadraIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="pbd" />
      {/* Sword blade */}
      <path d="M32 6L36 42h-8z" fill="url(#ng-pbd)" opacity="0.3" stroke="url(#ng-pbd)" strokeWidth="2" filter="url(#gl-pbd)" />
      {/* Guard */}
      <rect x="22" y="42" width="20" height="4" rx="2" fill="url(#ng-pbd)" />
      {/* Handle */}
      <rect x="28" y="46" width="8" height="12" rx="1" fill="url(#ng-pbd)" opacity="0.5" />
      {/* Pommel */}
      <circle cx="32" cy="60" r="3" fill="#f0d48a" opacity="0.5" />
      {/* Edge gleam */}
      <line x1="32" y1="10" x2="32" y2="40" stroke="#f0d48a" strokeWidth="1" opacity="0.5" />
      {/* Flame on tip */}
      <path d="M32 6L30 2L32 0L34 2z" fill="#f0d48a" opacity="0.6" />
    </svg>
  );
}

// 26. Uttara Bhadrapada — Twin serpent / back legs of bed (deep wisdom)
export function UttaraBhadraIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="ubd" />
      {/* Twin serpent / caduceus-like */}
      <path d="M32 8V56" stroke="url(#ng-ubd)" strokeWidth="2" />
      {/* Left serpent */}
      <path d="M32 12C24 16 24 24 32 28C24 32 24 40 32 44C24 48 24 52 32 56"
        stroke="url(#ng-ubd)" strokeWidth="2.5" fill="none" filter="url(#gl-ubd)" />
      {/* Right serpent */}
      <path d="M32 12C40 16 40 24 32 28C40 32 40 40 32 44C40 48 40 52 32 56"
        stroke="url(#ng-ubd)" strokeWidth="2.5" fill="none" />
      {/* Heads */}
      <circle cx="24" cy="10" r="3" fill="url(#ng-ubd)" opacity="0.5" />
      <circle cx="40" cy="10" r="3" fill="url(#ng-ubd)" opacity="0.5" />
      {/* Top emblem */}
      <circle cx="32" cy="6" r="2" fill="#f0d48a" />
    </svg>
  );
}

// 27. Revati — Fish / Pair of fish (journey, nourishment)
export function RevatiIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <Defs id="rev" />
      {/* Fish 1 */}
      <path d="M12 24C12 24 20 18 32 18C38 18 44 20 48 24C44 28 38 30 32 30C20 30 12 24 12 24z"
        fill="url(#ng-rev)" opacity="0.3" stroke="url(#ng-rev)" strokeWidth="2" filter="url(#gl-rev)" />
      {/* Fish 1 tail */}
      <path d="M48 24L56 18V30z" fill="url(#ng-rev)" opacity="0.4" />
      {/* Fish 1 eye */}
      <circle cx="20" cy="24" r="2" fill="#f0d48a" />
      {/* Fish 2 (swimming opposite) */}
      <path d="M52 42C52 42 44 36 32 36C26 36 20 38 16 42C20 46 26 48 32 48C44 48 52 42 52 42z"
        fill="url(#ng-rev)" opacity="0.25" stroke="url(#ng-rev)" strokeWidth="2" />
      {/* Fish 2 tail */}
      <path d="M16 42L8 36V48z" fill="url(#ng-rev)" opacity="0.35" />
      {/* Fish 2 eye */}
      <circle cx="44" cy="42" r="2" fill="#f0d48a" />
      {/* Water ripple */}
      <path d="M8 56C16 52 24 56 32 52C40 56 48 52 56 56" stroke="#f0d48a" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

// ─── Export map keyed by nakshatra ID (1-27) ──────────────────────
export const NAKSHATRA_ICONS: Record<number, React.FC<IconProps>> = {
  1: AshwiniIcon,
  2: BharaniIcon,
  3: KrittikaIcon,
  4: RohiniIcon,
  5: MrigashiraIcon,
  6: ArdraIcon,
  7: PunarvasuIcon,
  8: PushyaIcon,
  9: AshleshaIcon,
  10: MaghaIcon,
  11: PurvaPhalgIcon,
  12: UttaraPhalgIcon,
  13: HastaIcon,
  14: ChitraIcon,
  15: SwatiIcon,
  16: VishakhaIcon,
  17: AnuradhaIcon,
  18: JyeshthaIcon,
  19: MulaIcon,
  20: PurvaAshadhaIcon,
  21: UttaraAshadhaIcon,
  22: ShravanaIcon,
  23: DhanishthaIcon,
  24: ShatabhishaIcon,
  25: PurvaBhadraIcon,
  26: UttaraBhadraIcon,
  27: RevatiIcon,
};

// Convenience component that picks the right icon by ID
export function NakshatraIconById({ id, size = 48, className }: IconProps & { id: number }) {
  const Icon = NAKSHATRA_ICONS[id];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
