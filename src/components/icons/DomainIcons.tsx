'use client';

import React from 'react';

interface DomainIconProps {
  className?: string;
}

function DomainDefs() {
  return (
    <defs>
      <linearGradient id="domainGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0d48a" />
        <stop offset="50%" stopColor="#d4a853" />
        <stop offset="100%" stopColor="#8a6d2b" />
      </linearGradient>
      <filter id="domainGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

// 1. Health — Figure with chakra points and radiating energy
export function HealthIcon({ className }: DomainIconProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <DomainDefs />
      {/* Head */}
      <circle cx="60" cy="12" r="6" stroke="url(#domainGold)" strokeWidth="1.5" fill="none" />
      {/* Spine */}
      <line x1="60" y1="18" x2="60" y2="62" stroke="url(#domainGold)" strokeWidth="1.5" />
      {/* Arms */}
      <line x1="60" y1="30" x2="42" y2="44" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="30" x2="78" y2="44" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Legs */}
      <line x1="60" y1="62" x2="48" y2="76" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="62" x2="72" y2="76" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Chakra points */}
      <circle cx="60" cy="26" r="3" fill="url(#domainGold)" opacity="0.8" filter="url(#domainGlow)" />
      <circle cx="60" cy="40" r="2.5" fill="url(#domainGold)" opacity="0.6" />
      <circle cx="60" cy="54" r="2" fill="url(#domainGold)" opacity="0.5" />
      {/* Heart energy rays */}
      <line x1="52" y1="22" x2="46" y2="18" stroke="#f0d48a" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <line x1="68" y1="22" x2="74" y2="18" stroke="#f0d48a" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <line x1="52" y1="30" x2="46" y2="30" stroke="#f0d48a" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <line x1="68" y1="30" x2="74" y2="30" stroke="#f0d48a" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

// 2. Wealth — Balance scales with lotus and coins
export function WealthIcon({ className }: DomainIconProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <DomainDefs />
      {/* Center pillar */}
      <line x1="60" y1="10" x2="60" y2="70" stroke="url(#domainGold)" strokeWidth="1.5" />
      {/* Base */}
      <line x1="48" y1="70" x2="72" y2="70" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Beam */}
      <line x1="22" y1="22" x2="98" y2="22" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Fulcrum triangle */}
      <path d="M56 14L60 8L64 14z" fill="url(#domainGold)" opacity="0.6" />
      {/* Left chain */}
      <line x1="30" y1="22" x2="30" y2="38" stroke="#d4a853" strokeWidth="1" />
      {/* Left pan — lotus */}
      <path d="M20 38Q25 34 30 38Q35 34 40 38" stroke="url(#domainGold)" strokeWidth="1.5" fill="none" />
      <path d="M24 42Q27 38 30 42Q33 38 36 42" stroke="#f0d48a" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="30" cy="44" r="1.5" fill="#f0d48a" opacity="0.6" />
      {/* Right chain */}
      <line x1="90" y1="22" x2="90" y2="38" stroke="#d4a853" strokeWidth="1" />
      {/* Right pan — coins */}
      <path d="M80 42h20" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="86" cy="40" rx="4" ry="2" stroke="#d4a853" strokeWidth="1" fill="url(#domainGold)" fillOpacity="0.2" />
      <ellipse cx="90" cy="38" rx="4" ry="2" stroke="#d4a853" strokeWidth="1" fill="url(#domainGold)" fillOpacity="0.3" />
      <ellipse cx="94" cy="40" rx="4" ry="2" stroke="#d4a853" strokeWidth="1" fill="url(#domainGold)" fillOpacity="0.2" />
      {/* Prosperity arcs */}
      <path d="M18 54Q40 48 60 54Q80 48 102 54" stroke="#f0d48a" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  );
}

// 3. Career — Mountain with ascending path and flag
export function CareerIcon({ className }: DomainIconProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <DomainDefs />
      {/* Mountain */}
      <path d="M10 72L50 14L90 72z" stroke="url(#domainGold)" strokeWidth="1.5" fill="url(#domainGold)" fillOpacity="0.08" strokeLinejoin="round" />
      {/* Smaller peak */}
      <path d="M60 72L85 32L110 72" stroke="#d4a853" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Switchback trail */}
      <path d="M28 62Q38 58 42 52Q46 46 50 42Q54 36 52 28" stroke="#f0d48a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3 2" />
      {/* Flag at summit */}
      <line x1="50" y1="14" x2="50" y2="4" stroke="url(#domainGold)" strokeWidth="1.5" />
      <path d="M50 4L62 8L50 12" fill="url(#domainGold)" opacity="0.7" />
      {/* Stars above */}
      <circle cx="70" cy="8" r="1.5" fill="#f0d48a" opacity="0.6" />
      <circle cx="80" cy="14" r="1" fill="#f0d48a" opacity="0.4" />
      <circle cx="40" cy="6" r="1" fill="#f0d48a" opacity="0.5" />
      <circle cx="96" cy="6" r="1.5" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

// 4. Marriage — Interlocked rings with sacred flame
export function MarriageIcon({ className }: DomainIconProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <DomainDefs />
      {/* Left ring */}
      <circle cx="48" cy="42" r="18" stroke="url(#domainGold)" strokeWidth="1.5" fill="none" />
      {/* Right ring */}
      <circle cx="72" cy="42" r="18" stroke="url(#domainGold)" strokeWidth="1.5" fill="none" />
      {/* Agni flame at intersection */}
      <path d="M60 32C57 36 55 40 55 44c0 4 2 6 5 6s5-2 5-6c0-4-2-8-5-12z"
        fill="url(#domainGold)" opacity="0.6" filter="url(#domainGlow)" />
      <path d="M60 36c-2 3-3 5-3 7 0 2 1 3 3 3s3-1 3-3c0-2-1-4-3-7z"
        fill="#f0d48a" opacity="0.8" />
      {/* Decorative dots on rings */}
      <circle cx="30" cy="42" r="1.5" fill="#f0d48a" opacity="0.5" />
      <circle cx="90" cy="42" r="1.5" fill="#f0d48a" opacity="0.5" />
      <circle cx="48" cy="24" r="1.5" fill="#f0d48a" opacity="0.4" />
      <circle cx="72" cy="24" r="1.5" fill="#f0d48a" opacity="0.4" />
    </svg>
  );
}

// 5. Children — Tree with blossoms/fruits
export function ChildrenIcon({ className }: DomainIconProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <DomainDefs />
      {/* Trunk */}
      <path d="M60 76L60 36" stroke="url(#domainGold)" strokeWidth="2" strokeLinecap="round" />
      {/* Branches */}
      <path d="M60 36L42 22" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 36L78 22" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 44L38 36" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 44L82 36" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 30L60 18" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Blossoms/fruits */}
      <circle cx="42" cy="20" r="5" fill="url(#domainGold)" opacity="0.4" filter="url(#domainGlow)" />
      <circle cx="78" cy="20" r="5" fill="url(#domainGold)" opacity="0.4" filter="url(#domainGlow)" />
      <circle cx="36" cy="34" r="4" fill="url(#domainGold)" opacity="0.35" />
      <circle cx="84" cy="34" r="4" fill="url(#domainGold)" opacity="0.35" />
      <circle cx="60" cy="14" r="5" fill="url(#domainGold)" opacity="0.5" filter="url(#domainGlow)" />
      {/* Roots */}
      <path d="M60 76L52 78M60 76L68 78" stroke="#8a6d2b" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// 6. Family — Temple/house with shikhara roof and figures
export function FamilyIcon({ className }: DomainIconProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <DomainDefs />
      {/* Shikhara curved roof */}
      <path d="M30 34Q42 6 60 4Q78 6 90 34" stroke="url(#domainGold)" strokeWidth="1.5" fill="url(#domainGold)" fillOpacity="0.06" />
      {/* Kalash finial */}
      <circle cx="60" cy="4" r="2.5" fill="url(#domainGold)" opacity="0.7" />
      {/* Walls */}
      <line x1="30" y1="34" x2="30" y2="72" stroke="url(#domainGold)" strokeWidth="1.5" />
      <line x1="90" y1="34" x2="90" y2="72" stroke="url(#domainGold)" strokeWidth="1.5" />
      {/* Floor */}
      <line x1="28" y1="72" x2="92" y2="72" stroke="url(#domainGold)" strokeWidth="1.5" />
      {/* Door */}
      <path d="M52 72V52Q52 46 60 46Q68 46 68 52V72" stroke="#d4a853" strokeWidth="1.5" fill="url(#domainGold)" fillOpacity="0.1" />
      {/* Family figures inside — 3 circles+lines */}
      <circle cx="44" cy="52" r="2.5" fill="#f0d48a" opacity="0.5" />
      <line x1="44" y1="55" x2="44" y2="64" stroke="#f0d48a" strokeWidth="1" opacity="0.4" />
      <circle cx="76" cy="52" r="2.5" fill="#f0d48a" opacity="0.5" />
      <line x1="76" y1="55" x2="76" y2="64" stroke="#f0d48a" strokeWidth="1" opacity="0.4" />
      <circle cx="60" cy="56" r="2" fill="#f0d48a" opacity="0.4" />
      <line x1="60" y1="58" x2="60" y2="64" stroke="#f0d48a" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

// 7. Spiritual — Meditation figure with third eye and radiating circles
export function SpiritualIcon({ className }: DomainIconProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <DomainDefs />
      {/* Seated figure silhouette — padmasana */}
      <path d="M60 24L60 50" stroke="url(#domainGold)" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="60" cy="20" r="6" stroke="url(#domainGold)" strokeWidth="1.5" fill="none" />
      {/* Third eye */}
      <circle cx="60" cy="18" r="1.5" fill="#f0d48a" opacity="0.9" filter="url(#domainGlow)" />
      {/* Arms resting on knees */}
      <path d="M60 34L44 44L40 52" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M60 34L76 44L80 52" stroke="url(#domainGold)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Crossed legs */}
      <path d="M40 52Q50 58 60 54Q70 58 80 52" stroke="url(#domainGold)" strokeWidth="1.5" fill="none" />
      <path d="M42 56Q52 62 60 58Q68 62 78 56" stroke="#d4a853" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Concentric radiating circles */}
      <circle cx="60" cy="36" r="20" stroke="#f0d48a" strokeWidth="0.8" fill="none" opacity="0.2" />
      <circle cx="60" cy="36" r="30" stroke="#f0d48a" strokeWidth="0.6" fill="none" opacity="0.12" />
      <circle cx="60" cy="36" r="38" stroke="#f0d48a" strokeWidth="0.4" fill="none" opacity="0.08" />
      {/* Crescent moon above */}
      <path d="M54 6Q58 2 66 4" stroke="#f0d48a" strokeWidth="1.2" fill="none" opacity="0.6" />
      <circle cx="64" cy="4" r="3" fill="#0a0e27" />
    </svg>
  );
}

// 8. Education — Open book with light rays and star
export function EducationIcon({ className }: DomainIconProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <DomainDefs />
      {/* Book spine */}
      <line x1="60" y1="30" x2="60" y2="72" stroke="url(#domainGold)" strokeWidth="1.5" />
      {/* Left page */}
      <path d="M60 34Q50 30 28 32L28 68Q50 66 60 70" stroke="url(#domainGold)" strokeWidth="1.5" fill="url(#domainGold)" fillOpacity="0.06" />
      {/* Right page */}
      <path d="M60 34Q70 30 92 32L92 68Q70 66 60 70" stroke="url(#domainGold)" strokeWidth="1.5" fill="url(#domainGold)" fillOpacity="0.06" />
      {/* Page lines left */}
      <line x1="36" y1="40" x2="54" y2="40" stroke="#d4a853" strokeWidth="0.8" opacity="0.3" />
      <line x1="36" y1="46" x2="54" y2="46" stroke="#d4a853" strokeWidth="0.8" opacity="0.3" />
      <line x1="36" y1="52" x2="54" y2="52" stroke="#d4a853" strokeWidth="0.8" opacity="0.3" />
      {/* Page lines right */}
      <line x1="66" y1="40" x2="84" y2="40" stroke="#d4a853" strokeWidth="0.8" opacity="0.3" />
      <line x1="66" y1="46" x2="84" y2="46" stroke="#d4a853" strokeWidth="0.8" opacity="0.3" />
      <line x1="66" y1="52" x2="84" y2="52" stroke="#d4a853" strokeWidth="0.8" opacity="0.3" />
      {/* Light rays from center */}
      <line x1="60" y1="28" x2="60" y2="12" stroke="#f0d48a" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <line x1="60" y1="28" x2="48" y2="16" stroke="#f0d48a" strokeWidth="1" opacity="0.35" strokeLinecap="round" />
      <line x1="60" y1="28" x2="72" y2="16" stroke="#f0d48a" strokeWidth="1" opacity="0.35" strokeLinecap="round" />
      <line x1="60" y1="28" x2="40" y2="22" stroke="#f0d48a" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      <line x1="60" y1="28" x2="80" y2="22" stroke="#f0d48a" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      {/* Star/Om above */}
      <circle cx="60" cy="8" r="3" fill="url(#domainGold)" opacity="0.6" filter="url(#domainGlow)" />
      <circle cx="60" cy="8" r="1.2" fill="#f0d48a" opacity="0.9" />
    </svg>
  );
}

// Lookup map
export const DOMAIN_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  health: HealthIcon,
  wealth: WealthIcon,
  career: CareerIcon,
  marriage: MarriageIcon,
  children: ChildrenIcon,
  family: FamilyIcon,
  spiritual: SpiritualIcon,
  education: EducationIcon,
};
