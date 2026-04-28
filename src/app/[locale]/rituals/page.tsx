'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import TarotCard from '@/components/ui/TarotCard';
import { ShareRow } from '@/components/ui/ShareButton';
import AdUnit from '@/components/ads/AdUnit';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/lib/i18n/config';
import type { ReactNode } from 'react';

/* ── Helper: round to 2dp for computed SVG coords ── */
const r2 = (n: number) => Math.round(n * 100) / 100;

/* ════════════════════════════════════════════════════════════════════
   6 INLINE SVG ICONS — bold, multi-layered, dramatic (128x128)
   Gradient IDs use unique 2-letter prefixes to avoid collisions.
   ════════════════════════════════════════════════════════════════════ */

/* 1. Puja Vidhi — Ornate brass diya with flame and floating petals */
function PujaVidhiSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="pv1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.3" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
        <linearGradient id="pv1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
        <radialGradient id="pv1f" cx="50%" cy="80%" r="60%"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.6" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#pv1g)" />
      {/* Diya base — ornate bowl */}
      <ellipse cx="32" cy="44" rx="18" ry="5" fill="url(#pv1)" opacity="0.12" stroke="url(#pv1)" strokeWidth="2" />
      <path d="M 14 44 Q 16 36 22 34 L 42 34 Q 48 36 50 44" fill="url(#pv1)" opacity="0.1" stroke="url(#pv1)" strokeWidth="2" strokeLinejoin="round" />
      {/* Bowl interior detail */}
      <ellipse cx="32" cy="38" rx="10" ry="3" fill="url(#pv1)" opacity="0.08" stroke="url(#pv1)" strokeWidth="1" />
      {/* Pedestal foot */}
      <path d="M 26 44 L 24 50 L 40 50 L 38 44" fill="url(#pv1)" opacity="0.08" stroke="url(#pv1)" strokeWidth="1.5" />
      <line x1="22" y1="50" x2="42" y2="50" stroke="url(#pv1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      {/* Wick */}
      <line x1="32" y1="34" x2="32" y2="28" stroke="url(#pv1)" strokeWidth="1.5" opacity="0.5" />
      {/* Flame — multi-layered teardrop */}
      <path d="M 32 10 Q 38 18 36 24 Q 34 28 32 28 Q 30 28 28 24 Q 26 18 32 10 Z" fill="url(#pv1)" opacity="0.2" stroke="url(#pv1)" strokeWidth="2" />
      <path d="M 32 14 Q 36 19 34 23 Q 33 26 32 26 Q 31 26 30 23 Q 28 19 32 14 Z" fill="url(#pv1)" opacity="0.35" />
      <path d="M 32 17 Q 34 20 33 23 Q 32.5 25 32 25 Q 31.5 25 31 23 Q 30 20 32 17 Z" fill="#f0d48a" opacity="0.6" />
      <circle cx="32" cy="20" r="1.5" fill="#f0d48a" opacity="0.8" />
      {/* Flame glow */}
      <circle cx="32" cy="18" r="8" fill="url(#pv1f)" />
      {/* Floating petals */}
      <ellipse cx="14" cy="28" rx="3" ry="1.5" fill="url(#pv1)" opacity="0.25" transform="rotate(-30 14 28)" />
      <ellipse cx="50" cy="24" rx="2.5" ry="1.2" fill="url(#pv1)" opacity="0.2" transform="rotate(25 50 24)" />
      <ellipse cx="18" cy="16" rx="2" ry="1" fill="url(#pv1)" opacity="0.18" transform="rotate(-45 18 16)" />
      <ellipse cx="48" cy="36" rx="2.8" ry="1.3" fill="url(#pv1)" opacity="0.22" transform="rotate(15 48 36)" />
      <ellipse cx="12" cy="40" rx="2" ry="1" fill="url(#pv1)" opacity="0.15" transform="rotate(-20 12 40)" />
      {/* Ornamental dots on bowl rim */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = (i - 3) / 3;
        const cx = 32 + t * 14;
        const cy = 34 - Math.abs(t) * 1.5;
        return <circle key={i} cx={r2(cx)} cy={r2(cy)} r="1" fill="#f0d48a" opacity={0.4 - Math.abs(t) * 0.1} />;
      })}
      {/* Cosmic accent dots */}
      <circle cx="8" cy="10" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="56" cy="14" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="54" cy="52" r="0.7" fill="#f0d48a" opacity="0.2" />
      <circle cx="8" cy="54" r="1.2" fill="#f0d48a" opacity="0.25" />
    </svg>
  );
}

/* 2. Vrat Calendar — Calendar page with Om and crescent moon */
function VratCalendarSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="vc1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
        <linearGradient id="vc1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#vc1g)" />
      {/* Calendar page — rounded rect */}
      <rect x="12" y="10" width="40" height="46" rx="3" fill="url(#vc1)" opacity="0.08" stroke="url(#vc1)" strokeWidth="2.5" />
      {/* Calendar header bar */}
      <rect x="12" y="10" width="40" height="10" rx="3" fill="url(#vc1)" opacity="0.15" />
      <line x1="12" y1="20" x2="52" y2="20" stroke="url(#vc1)" strokeWidth="1.5" opacity="0.4" />
      {/* Binding rings */}
      <circle cx="22" cy="10" r="2" fill="none" stroke="url(#vc1)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="32" cy="10" r="2" fill="none" stroke="url(#vc1)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="42" cy="10" r="2" fill="none" stroke="url(#vc1)" strokeWidth="1.5" opacity="0.5" />
      {/* Grid dots for days */}
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => {
          const cx = 20 + col * 6;
          const cy = 26 + row * 6;
          const highlight = (row === 1 && col === 2) || (row === 3 && col === 0) || (row === 4 && col === 3);
          return <circle key={`${row}-${col}`} cx={cx} cy={cy} r={highlight ? 2 : 1} fill={highlight ? '#f0d48a' : 'url(#vc1)'} opacity={highlight ? 0.6 : 0.25} />;
        })
      )}
      {/* Om symbol — central */}
      <text x="38" y="40" textAnchor="middle" fill="#f0d48a" fontSize="14" fontWeight="bold" opacity="0.35" fontFamily="serif">{'\u0950'}</text>
      {/* Crescent moon — top right */}
      <path d="M 46 6 A 5 5 0 1 0 46 16 A 3.5 3.5 0 1 1 46 6" fill="url(#vc1)" opacity="0.35" stroke="url(#vc1)" strokeWidth="1.5" />
      {/* Stars near moon */}
      <circle cx="54" cy="8" r="0.8" fill="#f0d48a" opacity="0.4" />
      <circle cx="52" cy="14" r="0.6" fill="#f0d48a" opacity="0.3" />
      {/* Cosmic accent dots */}
      <circle cx="6" cy="18" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="58" cy="48" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="8" cy="54" r="1.2" fill="#f0d48a" opacity="0.3" />
      <circle cx="56" cy="30" r="0.7" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* 3. Sankalpa — Namaskar hands with water drops */
function SankalpaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="sk1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0" /></radialGradient>
        <linearGradient id="sk1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
        <linearGradient id="sk1w" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#sk1g)" />
      {/* Aura behind hands */}
      <ellipse cx="32" cy="30" rx="16" ry="20" fill="url(#sk1)" opacity="0.04" />
      {/* Left palm */}
      <path d="M 31 14 L 28 14 Q 20 16 18 24 L 18 38 Q 18 42 22 44 L 30 44 L 31 14 Z" fill="url(#sk1)" opacity="0.1" stroke="url(#sk1)" strokeWidth="2" strokeLinejoin="round" />
      {/* Right palm (mirrored) */}
      <path d="M 33 14 L 36 14 Q 44 16 46 24 L 46 38 Q 46 42 42 44 L 34 44 L 33 14 Z" fill="url(#sk1)" opacity="0.1" stroke="url(#sk1)" strokeWidth="2" strokeLinejoin="round" />
      {/* Center line where palms meet */}
      <line x1="32" y1="14" x2="32" y2="44" stroke="url(#sk1)" strokeWidth="1.5" opacity="0.3" />
      {/* Finger tips — left */}
      <circle cx="28" cy="14" r="1.5" fill="url(#sk1)" opacity="0.3" />
      <circle cx="25" cy="16" r="1.2" fill="url(#sk1)" opacity="0.25" />
      <circle cx="22" cy="19" r="1" fill="url(#sk1)" opacity="0.2" />
      {/* Finger tips — right */}
      <circle cx="36" cy="14" r="1.5" fill="url(#sk1)" opacity="0.3" />
      <circle cx="39" cy="16" r="1.2" fill="url(#sk1)" opacity="0.25" />
      <circle cx="42" cy="19" r="1" fill="url(#sk1)" opacity="0.2" />
      {/* Thumb hints */}
      <path d="M 22 28 Q 20 30 20 34" fill="none" stroke="url(#sk1)" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      <path d="M 42 28 Q 44 30 44 34" fill="none" stroke="url(#sk1)" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      {/* Inner palm glow */}
      <ellipse cx="32" cy="28" rx="5" ry="8" fill="#f0d48a" opacity="0.08" />
      {/* Water drops falling */}
      <path d="M 26 48 Q 25 50 26 52 Q 27 53 26 48 Z" fill="url(#sk1w)" stroke="url(#sk1)" strokeWidth="0.8" opacity="0.5" />
      <path d="M 32 46 Q 31 49 32 51 Q 33 52 32 46 Z" fill="url(#sk1w)" stroke="url(#sk1)" strokeWidth="0.8" opacity="0.6" />
      <path d="M 38 48 Q 37 50 38 52 Q 39 53 38 48 Z" fill="url(#sk1w)" stroke="url(#sk1)" strokeWidth="0.8" opacity="0.45" />
      <path d="M 29 52 Q 28.5 54 29 55.5 Q 29.5 56 29 52 Z" fill="url(#sk1w)" stroke="url(#sk1)" strokeWidth="0.6" opacity="0.35" />
      <path d="M 35 53 Q 34.5 55 35 56.5 Q 35.5 57 35 53 Z" fill="url(#sk1w)" stroke="url(#sk1)" strokeWidth="0.6" opacity="0.3" />
      {/* Energy rays from top */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (Math.PI * (i + 1)) / 6 - Math.PI;
        return <line key={i} x1={r2(32 + 10 * Math.cos(a))} y1={r2(10 + 10 * Math.sin(a))} x2={r2(32 + 18 * Math.cos(a))} y2={r2(10 + 18 * Math.sin(a))} stroke="url(#sk1)" strokeWidth="1" opacity={0.2 + (i % 2) * 0.1} strokeLinecap="round" />;
      })}
      {/* Cosmic accent dots */}
      <circle cx="8" cy="12" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="56" cy="16" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="10" cy="50" r="0.7" fill="#f0d48a" opacity="0.2" />
      <circle cx="54" cy="54" r="1" fill="#f0d48a" opacity="0.25" />
    </svg>
  );
}

/* 4. Devotional — Om with radiating sound waves */
function DevotionalSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="dv1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.3" /><stop offset="100%" stopColor="#fb923c" stopOpacity="0" /></radialGradient>
        <linearGradient id="dv1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#dv1g)" />
      {/* Outer sound wave rings */}
      <circle cx="32" cy="32" r="27" fill="none" stroke="url(#dv1)" strokeWidth="1" opacity="0.12" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="url(#dv1)" strokeWidth="1.2" opacity="0.18" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="url(#dv1)" strokeWidth="1.5" opacity="0.22" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="url(#dv1)" strokeWidth="1.8" opacity="0.28" />
      <circle cx="32" cy="32" r="15" fill="none" stroke="url(#dv1)" strokeWidth="2" opacity="0.15" />
      {/* Inner glow disc */}
      <circle cx="32" cy="32" r="12" fill="url(#dv1)" opacity="0.08" />
      <circle cx="32" cy="32" r="8" fill="url(#dv1)" opacity="0.12" />
      {/* Om symbol — bold */}
      <text x="32" y="38" textAnchor="middle" fill="#f0d48a" fontSize="22" fontWeight="bold" opacity="0.65" fontFamily="serif">{'\u0950'}</text>
      {/* Wave arc segments — left and right */}
      <path d="M 6 22 Q 4 32 6 42" fill="none" stroke="url(#dv1)" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      <path d="M 10 18 Q 7 32 10 46" fill="none" stroke="url(#dv1)" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      <path d="M 58 22 Q 60 32 58 42" fill="none" stroke="url(#dv1)" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      <path d="M 54 18 Q 57 32 54 46" fill="none" stroke="url(#dv1)" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      {/* Vibration dots along rings */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8;
        return <circle key={i} cx={r2(32 + 24 * Math.cos(a))} cy={r2(32 + 24 * Math.sin(a))} r="1.5" fill="#f0d48a" opacity={0.3 + (i % 2) * 0.15} />;
      })}
      {/* Smaller vibration dots */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 6 + Math.PI / 6;
        return <circle key={`s${i}`} cx={r2(32 + 18 * Math.cos(a))} cy={r2(32 + 18 * Math.sin(a))} r="0.8" fill="#f0d48a" opacity={0.2 + (i % 3) * 0.08} />;
      })}
      {/* Cosmic accent dots */}
      <circle cx="8" cy="8" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="56" cy="56" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="54" cy="8" r="1.2" fill="#f0d48a" opacity="0.3" />
      <circle cx="10" cy="56" r="0.7" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* 5. Shraddha — Ritual fire with rising smoke and offering bowl */
function ShraddhaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="sh1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></radialGradient>
        <linearGradient id="sh1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
        <linearGradient id="sh1f" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.5" /><stop offset="100%" stopColor="#f0d48a" stopOpacity="0.1" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#sh1g)" />
      {/* Offering bowl */}
      <path d="M 18 46 Q 20 54 32 56 Q 44 54 46 46" fill="url(#sh1)" opacity="0.1" stroke="url(#sh1)" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="32" cy="46" rx="14" ry="3" fill="url(#sh1)" opacity="0.08" stroke="url(#sh1)" strokeWidth="1.5" />
      {/* Fire base inside bowl */}
      <ellipse cx="32" cy="44" rx="8" ry="2" fill="url(#sh1)" opacity="0.15" />
      {/* Main fire tongues */}
      <path d="M 32 22 Q 38 28 36 34 Q 34 40 32 42 Q 30 40 28 34 Q 26 28 32 22 Z" fill="url(#sh1f)" stroke="url(#sh1)" strokeWidth="2" />
      <path d="M 32 26 Q 36 30 34 36 Q 33 40 32 40 Q 31 40 30 36 Q 28 30 32 26 Z" fill="url(#sh1)" opacity="0.3" />
      <path d="M 32 30 Q 34 33 33 37 Q 32.5 39 32 39 Q 31.5 39 31 37 Q 30 33 32 30 Z" fill="#f0d48a" opacity="0.5" />
      <circle cx="32" cy="34" r="1.5" fill="#f0d48a" opacity="0.7" />
      {/* Side flame licks */}
      <path d="M 24 32 Q 22 28 24 24 Q 26 28 26 34" fill="url(#sh1)" opacity="0.2" stroke="url(#sh1)" strokeWidth="1.2" />
      <path d="M 40 32 Q 42 28 40 24 Q 38 28 38 34" fill="url(#sh1)" opacity="0.2" stroke="url(#sh1)" strokeWidth="1.2" />
      {/* Rising smoke wisps */}
      <path d="M 30 18 Q 28 14 30 10 Q 32 8 30 4" fill="none" stroke="url(#sh1)" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
      <path d="M 34 16 Q 36 12 34 8 Q 32 6 34 2" fill="none" stroke="url(#sh1)" strokeWidth="1.5" opacity="0.18" strokeLinecap="round" />
      <path d="M 28 20 Q 26 16 24 12" fill="none" stroke="url(#sh1)" strokeWidth="1" opacity="0.12" strokeLinecap="round" />
      <path d="M 36 20 Q 38 16 40 12" fill="none" stroke="url(#sh1)" strokeWidth="1" opacity="0.12" strokeLinecap="round" />
      {/* Smoke particles */}
      <circle cx="29" cy="8" r="1.5" fill="url(#sh1)" opacity="0.1" />
      <circle cx="35" cy="6" r="1.8" fill="url(#sh1)" opacity="0.08" />
      <circle cx="26" cy="12" r="1.2" fill="url(#sh1)" opacity="0.08" />
      <circle cx="38" cy="10" r="1" fill="url(#sh1)" opacity="0.06" />
      {/* Embers / sparks */}
      <circle cx="26" cy="26" r="0.8" fill="#f0d48a" opacity="0.4" />
      <circle cx="38" cy="28" r="0.7" fill="#f0d48a" opacity="0.35" />
      <circle cx="30" cy="24" r="0.5" fill="#f0d48a" opacity="0.45" />
      <circle cx="34" cy="22" r="0.6" fill="#f0d48a" opacity="0.4" />
      {/* Cosmic accent dots */}
      <circle cx="8" cy="14" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="56" cy="50" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="52" cy="10" r="1.2" fill="#f0d48a" opacity="0.3" />
      <circle cx="10" cy="56" r="0.7" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* 6. Muhurta AI — Circuit pattern with clock center and cosmic sparkles */
function MuhurtaAiSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ma1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#34d399" stopOpacity="0.3" /><stop offset="100%" stopColor="#34d399" stopOpacity="0" /></radialGradient>
        <linearGradient id="ma1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#ma1g)" />
      {/* Circuit board traces — horizontal */}
      <line x1="4" y1="20" x2="18" y2="20" stroke="url(#ma1)" strokeWidth="1.2" opacity="0.3" />
      <line x1="46" y1="20" x2="60" y2="20" stroke="url(#ma1)" strokeWidth="1.2" opacity="0.3" />
      <line x1="4" y1="44" x2="18" y2="44" stroke="url(#ma1)" strokeWidth="1.2" opacity="0.3" />
      <line x1="46" y1="44" x2="60" y2="44" stroke="url(#ma1)" strokeWidth="1.2" opacity="0.3" />
      {/* Circuit traces — vertical */}
      <line x1="20" y1="4" x2="20" y2="18" stroke="url(#ma1)" strokeWidth="1.2" opacity="0.3" />
      <line x1="44" y1="4" x2="44" y2="18" stroke="url(#ma1)" strokeWidth="1.2" opacity="0.3" />
      <line x1="20" y1="46" x2="20" y2="60" stroke="url(#ma1)" strokeWidth="1.2" opacity="0.3" />
      <line x1="44" y1="46" x2="44" y2="60" stroke="url(#ma1)" strokeWidth="1.2" opacity="0.3" />
      {/* Diagonal circuit traces */}
      <line x1="18" y1="18" x2="22" y2="22" stroke="url(#ma1)" strokeWidth="1" opacity="0.25" />
      <line x1="46" y1="18" x2="42" y2="22" stroke="url(#ma1)" strokeWidth="1" opacity="0.25" />
      <line x1="18" y1="46" x2="22" y2="42" stroke="url(#ma1)" strokeWidth="1" opacity="0.25" />
      <line x1="46" y1="46" x2="42" y2="42" stroke="url(#ma1)" strokeWidth="1" opacity="0.25" />
      {/* Junction nodes */}
      {[[18, 20], [46, 20], [18, 44], [46, 44], [20, 18], [44, 18], [20, 46], [44, 46]].map(([cx, cy], i) => (
        <circle key={`j${i}`} cx={cx} cy={cy} r="1.8" fill="url(#ma1)" opacity="0.35" stroke="url(#ma1)" strokeWidth="0.8" />
      ))}
      {/* Corner nodes */}
      {[[4, 20], [60, 20], [4, 44], [60, 44], [20, 4], [44, 4], [20, 60], [44, 60]].map(([cx, cy], i) => (
        <circle key={`c${i}`} cx={cx} cy={cy} r="1.2" fill="#f0d48a" opacity="0.25" />
      ))}
      {/* Central clock face */}
      <circle cx="32" cy="32" r="12" fill="url(#ma1)" opacity="0.08" stroke="url(#ma1)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="9" fill="none" stroke="url(#ma1)" strokeWidth="1" opacity="0.25" />
      {/* Clock tick marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return <line key={i} x1={r2(32 + 10 * Math.cos(a))} y1={r2(32 + 10 * Math.sin(a))} x2={r2(32 + 12 * Math.cos(a))} y2={r2(32 + 12 * Math.sin(a))} stroke="url(#ma1)" strokeWidth={i % 3 === 0 ? 1.5 : 0.8} opacity={i % 3 === 0 ? 0.5 : 0.25} strokeLinecap="round" />;
      })}
      {/* Clock hands */}
      <line x1="32" y1="32" x2="32" y2="22" stroke="url(#ma1)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="32" y1="32" x2="40" y2="28" stroke="url(#ma1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <circle cx="32" cy="32" r="2.5" fill="url(#ma1)" opacity="0.3" stroke="url(#ma1)" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="1" fill="#f0d48a" opacity="0.7" />
      {/* AI sparkle — 4-pointed stars */}
      {[[10, 10], [54, 10], [10, 54], [54, 54]].map(([cx, cy], i) => (
        <g key={`sp${i}`} opacity={0.3 + i * 0.05}>
          <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} stroke="#f0d48a" strokeWidth="1" strokeLinecap="round" />
          <line x1={cx} y1={cy - 3} x2={cx} y2={cy + 3} stroke="#f0d48a" strokeWidth="1" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="0.8" fill="#f0d48a" opacity="0.6" />
        </g>
      ))}
      {/* Extra cosmic dots */}
      <circle cx="32" cy="6" r="0.6" fill="#f0d48a" opacity="0.2" />
      <circle cx="32" cy="58" r="0.6" fill="#f0d48a" opacity="0.2" />
      <circle cx="6" cy="32" r="0.6" fill="#f0d48a" opacity="0.2" />
      <circle cx="58" cy="32" r="0.6" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DATA: 2 rows x 3 cards
   ════════════════════════════════════════════════════════════════════ */

interface CardDef {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  glowColor: string;
  svg: ReactNode;
}

interface RowDef {
  label: string;
  cards: CardDef[];
}

function buildRows(isDevanagari: boolean): RowDef[] {
  return [
    {
      label: isDevanagari ? 'पूजा एवं भक्ति' : 'Worship & Devotion',
      cards: [
        { href: '/puja', title: 'Puja Vidhi', subtitle: 'Sacred Worship Guide', description: 'Step-by-step puja procedures', glowColor: '#d4a853', svg: <PujaVidhiSVG /> },
        { href: '/vrat-calendar', title: 'Vrat Calendar', subtitle: 'Fasting Schedule', description: 'Monthly vrat dates & rules', glowColor: '#8b5cf6', svg: <VratCalendarSVG /> },
        { href: '/sankalpa', title: 'Sankalpa', subtitle: 'Sacred Resolve', description: 'Generate your puja sankalpa', glowColor: '#22d3ee', svg: <SankalpaSVG /> },
      ],
    },
    {
      label: isDevanagari ? 'साधना एवं मार्गदर्शन' : 'Practice & Guidance',
      cards: [
        { href: '/devotional', title: 'Devotional', subtitle: 'Mantras \u00b7 Stotras \u00b7 Aartis', description: 'Sacred chants & hymns', glowColor: '#fb923c', svg: <DevotionalSVG /> },
        { href: '/shraddha', title: 'Shraddha', subtitle: 'Ancestor Rites', description: 'Pitru tarpan & shraddha dates', glowColor: '#6366f1', svg: <ShraddhaSVG /> },
        { href: '/muhurta-ai', title: 'Muhurta AI', subtitle: 'AI-Powered Timing', description: 'Best muhurta for your activity', glowColor: '#34d399', svg: <MuhurtaAiSVG /> },
      ],
    },
  ];
}

/* ════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function RitualsPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const ROWS = buildRows(isDevanagari);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] bg-clip-text text-transparent mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isDevanagari ? 'वैदिक अनुष्ठान' : 'Vedic Rituals'}
        </h1>
        <p className="text-text-secondary text-sm">
          {isDevanagari
            ? '6 पवित्र साधना मार्गदर्शक — पूजा, व्रत, मंत्र एवं शुभ मुहूर्त'
            : '6 sacred practice guides — puja, vrat, mantras & auspicious timing'}
        </p>
      </motion.div>

      {/* 2 rows */}
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx}>
          <div className="text-gold-dark text-[11px] uppercase tracking-[3px] font-semibold mt-8 mb-3 ml-1">
            {row.label}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 auto-rows-fr mb-2">
            {row.cards.map((card) => (
              <TarotCard
                key={card.href}
                size="full"
                href={card.href}
                subtitle={card.subtitle}
                icon={card.svg}
                title={card.title}
                description={card.description}
                glowColor={card.glowColor}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12">
        <AdUnit slot="rituals-bottom" />
      </div>
      <ShareRow pageTitle="Vedic Rituals" locale={locale} />
    </div>
  );
}
