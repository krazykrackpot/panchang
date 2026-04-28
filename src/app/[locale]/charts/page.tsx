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
   8 INLINE SVG ICONS — bold, multi-layered, dramatic (128x128)
   Gradient IDs use unique 2-letter prefixes to avoid collisions.
   ════════════════════════════════════════════════════════════════════ */

/* 1. Kundali — Diamond-shaped North Indian chart grid */
function KundaliSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ku1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.3" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
        <linearGradient id="ku1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#ku1g)" />
      {/* Outer diamond */}
      <polygon points="32,4 60,32 32,60 4,32" fill="url(#ku1)" opacity="0.06" stroke="url(#ku1)" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Inner diamond */}
      <polygon points="32,18 46,32 32,46 18,32" fill="url(#ku1)" opacity="0.1" stroke="url(#ku1)" strokeWidth="2" strokeLinejoin="round" />
      {/* House division lines — the 4 diagonal cuts */}
      <line x1="4" y1="32" x2="32" y2="4" stroke="url(#ku1)" strokeWidth="1.2" opacity="0.35" />
      <line x1="32" y1="4" x2="60" y2="32" stroke="url(#ku1)" strokeWidth="1.2" opacity="0.35" />
      <line x1="60" y1="32" x2="32" y2="60" stroke="url(#ku1)" strokeWidth="1.2" opacity="0.35" />
      <line x1="32" y1="60" x2="4" y2="32" stroke="url(#ku1)" strokeWidth="1.2" opacity="0.35" />
      {/* Horizontal & vertical cross inside outer */}
      <line x1="18" y1="18" x2="46" y2="18" stroke="url(#ku1)" strokeWidth="1" opacity="0.25" />
      <line x1="18" y1="46" x2="46" y2="46" stroke="url(#ku1)" strokeWidth="1" opacity="0.25" />
      <line x1="18" y1="18" x2="18" y2="46" stroke="url(#ku1)" strokeWidth="1" opacity="0.25" />
      <line x1="46" y1="18" x2="46" y2="46" stroke="url(#ku1)" strokeWidth="1" opacity="0.25" />
      {/* Center glow */}
      <circle cx="32" cy="32" r="5" fill="url(#ku1)" opacity="0.2" />
      <circle cx="32" cy="32" r="2" fill="#f0d48a" opacity="0.65" />
      {/* Planet dots scattered in houses */}
      <circle cx="32" cy="10" r="1.8" fill="#f0d48a" opacity="0.5" />
      <circle cx="50" cy="22" r="1.5" fill="#f0d48a" opacity="0.45" />
      <circle cx="14" cy="38" r="1.6" fill="#f0d48a" opacity="0.4" />
      <circle cx="38" cy="52" r="1.4" fill="#f0d48a" opacity="0.35" />
      <circle cx="24" cy="24" r="1.3" fill="#f0d48a" opacity="0.3" />
      <circle cx="42" cy="38" r="1.2" fill="#f0d48a" opacity="0.38" />
      <circle cx="22" cy="50" r="1.5" fill="#f0d48a" opacity="0.42" />
      {/* Cosmic accent dots */}
      <circle cx="8" cy="10" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="56" cy="52" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="54" cy="10" r="0.7" fill="#f0d48a" opacity="0.18" />
    </svg>
  );
}

/* 2. Matching — Two interlocking rings with stars */
function MatchingSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ma1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" /><stop offset="100%" stopColor="#ec4899" stopOpacity="0" /></radialGradient>
        <linearGradient id="ma1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#ma1g)" />
      {/* Left ring */}
      <circle cx="24" cy="30" r="14" fill="url(#ma1)" opacity="0.06" stroke="url(#ma1)" strokeWidth="2.5" />
      <circle cx="24" cy="30" r="10" fill="none" stroke="url(#ma1)" strokeWidth="1" opacity="0.2" />
      {/* Right ring */}
      <circle cx="40" cy="30" r="14" fill="url(#ma1)" opacity="0.06" stroke="url(#ma1)" strokeWidth="2.5" />
      <circle cx="40" cy="30" r="10" fill="none" stroke="url(#ma1)" strokeWidth="1" opacity="0.2" />
      {/* Overlap glow */}
      <ellipse cx="32" cy="30" rx="6" ry="12" fill="url(#ma1)" opacity="0.15" />
      <ellipse cx="32" cy="30" rx="3" ry="8" fill="#f0d48a" opacity="0.12" />
      {/* Heart accent at intersection */}
      <path d="M 32 38 C 29 34 27 31 29 29 C 30 28 31 29 32 30 C 33 29 34 28 35 29 C 37 31 35 34 32 38 Z" fill="url(#ma1)" opacity="0.5" />
      {/* Stars radiating around */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8 - Math.PI / 4;
        const rad = 24 + (i % 2) * 3;
        return <circle key={i} cx={r2(32 + rad * Math.cos(a))} cy={r2(30 + rad * Math.sin(a))} r={i % 2 === 0 ? 1.5 : 1} fill="#f0d48a" opacity={0.3 + (i % 3) * 0.1} />;
      })}
      {/* Score text */}
      <text x="32" y="54" textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold" opacity="0.4" fontFamily="var(--font-cinzel)">36</text>
      {/* Tiny accent dots */}
      <circle cx="10" cy="14" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="54" cy="48" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="52" cy="12" r="0.7" fill="#f0d48a" opacity="0.18" />
    </svg>
  );
}

/* 3. Chart Comparison — Two overlapping diamond charts */
function ComparisonSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="cc1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
        <linearGradient id="cc1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#cc1g)" />
      {/* Left chart (slightly offset left) */}
      <polygon points="24,8 44,28 24,48 4,28" fill="url(#cc1)" opacity="0.06" stroke="url(#cc1)" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="24,18 34,28 24,38 14,28" fill="url(#cc1)" opacity="0.08" stroke="url(#cc1)" strokeWidth="1" strokeLinejoin="round" />
      {/* Left chart house lines */}
      <line x1="4" y1="28" x2="44" y2="28" stroke="url(#cc1)" strokeWidth="0.8" opacity="0.2" />
      <line x1="24" y1="8" x2="24" y2="48" stroke="url(#cc1)" strokeWidth="0.8" opacity="0.2" />
      {/* Right chart (slightly offset right) */}
      <polygon points="40,16 60,36 40,56 20,36" fill="url(#cc1)" opacity="0.06" stroke="url(#cc1)" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="40,26 50,36 40,46 30,36" fill="url(#cc1)" opacity="0.08" stroke="url(#cc1)" strokeWidth="1" strokeLinejoin="round" />
      {/* Right chart house lines */}
      <line x1="20" y1="36" x2="60" y2="36" stroke="url(#cc1)" strokeWidth="0.8" opacity="0.2" />
      <line x1="40" y1="16" x2="40" y2="56" stroke="url(#cc1)" strokeWidth="0.8" opacity="0.2" />
      {/* Overlap highlight */}
      <circle cx="32" cy="32" r="8" fill="url(#cc1)" opacity="0.1" />
      <circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="0.35" />
      {/* Connecting arrows */}
      <path d="M 24 28 Q 28 30 32 32" fill="none" stroke="#f0d48a" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 1.5" />
      <path d="M 40 36 Q 36 34 32 32" fill="none" stroke="#f0d48a" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 1.5" />
      {/* Planet dots — left chart */}
      <circle cx="18" cy="22" r="1.5" fill="#f0d48a" opacity="0.45" />
      <circle cx="30" cy="14" r="1.2" fill="#f0d48a" opacity="0.35" />
      {/* Planet dots — right chart */}
      <circle cx="48" cy="30" r="1.5" fill="#f0d48a" opacity="0.45" />
      <circle cx="44" cy="50" r="1.2" fill="#f0d48a" opacity="0.35" />
      {/* Cosmic accent dots */}
      <circle cx="8" cy="10" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="58" cy="54" r="1" fill="#f0d48a" opacity="0.22" />
      <circle cx="56" cy="8" r="0.7" fill="#f0d48a" opacity="0.18" />
      <circle cx="6" cy="54" r="0.9" fill="#f0d48a" opacity="0.15" />
    </svg>
  );
}

/* 4. Annual Forecast — Calendar page with star burst */
function AnnualForecastSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="af1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0" /></radialGradient>
        <linearGradient id="af1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#af1g)" />
      {/* Calendar body */}
      <rect x="12" y="14" width="40" height="42" rx="3" fill="url(#af1)" opacity="0.06" stroke="url(#af1)" strokeWidth="2" />
      {/* Calendar header bar */}
      <rect x="12" y="14" width="40" height="10" rx="3" fill="url(#af1)" opacity="0.15" />
      <line x1="12" y1="24" x2="52" y2="24" stroke="url(#af1)" strokeWidth="1.5" opacity="0.4" />
      {/* Binding rings */}
      <circle cx="22" cy="14" r="2.5" fill="none" stroke="url(#af1)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="42" cy="14" r="2.5" fill="none" stroke="url(#af1)" strokeWidth="1.5" opacity="0.5" />
      {/* Grid dots for days */}
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => {
          const cx = 18 + col * 7;
          const cy = 29 + row * 6;
          return <circle key={`${row}-${col}`} cx={cx} cy={cy} r="1" fill="url(#af1)" opacity={0.2 + ((row + col) % 3) * 0.08} />;
        })
      )}
      {/* Star burst emanating from calendar center */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        const inner = 8;
        const outer = i % 2 === 0 ? 18 : 14;
        const cx = 32;
        const cy = 38;
        return (
          <line key={`r${i}`} x1={r2(cx + inner * Math.cos(a))} y1={r2(cy + inner * Math.sin(a))} x2={r2(cx + outer * Math.cos(a))} y2={r2(cy + outer * Math.sin(a))} stroke="url(#af1)" strokeWidth={i % 2 === 0 ? '2' : '1'} strokeLinecap="round" opacity={i % 2 === 0 ? 0.55 : 0.3} />
        );
      })}
      {/* Central star glow */}
      <circle cx="32" cy="38" r="5" fill="url(#af1)" opacity="0.2" />
      <circle cx="32" cy="38" r="2" fill="#f0d48a" opacity="0.55" />
      {/* Cosmic accent dots */}
      <circle cx="8" cy="8" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="58" cy="58" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="56" cy="10" r="1.2" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

/* 5. Varshaphal — Sun with radiating orbit and return arrow */
function VarshaphalSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="vp1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.3" /><stop offset="100%" stopColor="#fb923c" stopOpacity="0" /></radialGradient>
        <linearGradient id="vp1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#vp1g)" />
      {/* Orbital path */}
      <circle cx="32" cy="32" r="22" fill="none" stroke="url(#vp1)" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 3" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="url(#vp1)" strokeWidth="1" opacity="0.2" />
      {/* Sun body */}
      <circle cx="32" cy="32" r="10" fill="url(#vp1)" opacity="0.15" stroke="url(#vp1)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="6" fill="url(#vp1)" opacity="0.3" />
      <circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="0.65" />
      {/* Sun rays */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        const inner = i % 2 === 0 ? 12 : 13;
        const outer = i % 2 === 0 ? 18 : 16;
        return (
          <line key={i} x1={r2(32 + inner * Math.cos(a))} y1={r2(32 + inner * Math.sin(a))} x2={r2(32 + outer * Math.cos(a))} y2={r2(32 + outer * Math.sin(a))} stroke="url(#vp1)" strokeWidth={i % 2 === 0 ? '2' : '1.2'} strokeLinecap="round" opacity={i % 2 === 0 ? 0.7 : 0.4} />
        );
      })}
      {/* Return arrow on orbit — planet returning to birth position */}
      <circle cx="54" cy="32" r="3.5" fill="url(#vp1)" opacity="0.35" stroke="url(#vp1)" strokeWidth="1.5" />
      <circle cx="54" cy="32" r="1.5" fill="#f0d48a" opacity="0.5" />
      {/* Arrow head showing return direction */}
      <path d="M 50 14 Q 58 20 54 28" fill="none" stroke="url(#vp1)" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <polygon points="54,28 51,24 56,25" fill="url(#vp1)" opacity="0.55" />
      {/* Tick marks on orbit */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        return <circle key={`t${i}`} cx={r2(32 + 22 * Math.cos(a))} cy={r2(32 + 22 * Math.sin(a))} r="0.8" fill="#f0d48a" opacity="0.25" />;
      })}
      {/* Cosmic accents */}
      <circle cx="8" cy="12" r="1" fill="#f0d48a" opacity="0.2" />
      <circle cx="10" cy="54" r="0.8" fill="#f0d48a" opacity="0.18" />
      <circle cx="56" cy="56" r="1.2" fill="#f0d48a" opacity="0.25" />
    </svg>
  );
}

/* 6. Tithi Pravesha — Moon phase cycle with chart center */
function TithiPraveshaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="tp1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></radialGradient>
        <linearGradient id="tp1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#tp1g)" />
      {/* Outer orbit ring */}
      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#tp1)" strokeWidth="1.5" opacity="0.3" />
      {/* Moon phases around the orbit — 8 phases */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
        const cx = r2(32 + 22 * Math.cos(a));
        const cy = r2(32 + 22 * Math.sin(a));
        const phase = i / 8; // 0=new, 0.5=full
        const r = 3.5;
        if (phase < 0.02) {
          // New moon — empty circle
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="url(#tp1)" strokeWidth="1.2" opacity="0.35" />;
        } else if (phase > 0.45 && phase < 0.55) {
          // Full moon — filled
          return <circle key={i} cx={cx} cy={cy} r={r} fill="url(#tp1)" opacity="0.45" stroke="url(#tp1)" strokeWidth="1.2" />;
        } else {
          // Partial — crescent approximation
          const lit = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#tp1)" strokeWidth="1.2" opacity="0.35" />
              <path d={`M ${cx},${cy - r} A ${r},${r} 0 0,1 ${cx},${r2(cy + r)} A ${r2(r * (1 - lit * 2))},${r} 0 0,${lit > 0.5 ? 1 : 0} ${cx},${cy - r}`} fill="url(#tp1)" opacity={0.2 + lit * 0.3} />
            </g>
          );
        }
      })}
      {/* Central mini chart diamond */}
      <polygon points="32,20 44,32 32,44 20,32" fill="url(#tp1)" opacity="0.08" stroke="url(#tp1)" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="32,25 38,32 32,39 26,32" fill="url(#tp1)" opacity="0.12" stroke="url(#tp1)" strokeWidth="1" strokeLinejoin="round" />
      <line x1="20" y1="32" x2="44" y2="32" stroke="url(#tp1)" strokeWidth="0.8" opacity="0.25" />
      <line x1="32" y1="20" x2="32" y2="44" stroke="url(#tp1)" strokeWidth="0.8" opacity="0.25" />
      {/* Center glow */}
      <circle cx="32" cy="32" r="4" fill="url(#tp1)" opacity="0.2" />
      <circle cx="32" cy="32" r="1.5" fill="#f0d48a" opacity="0.6" />
      {/* Connecting lines from phases to center */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
        return <line key={`c${i}`} x1={r2(32 + 18 * Math.cos(a))} y1={r2(32 + 18 * Math.sin(a))} x2={r2(32 + 6 * Math.cos(a))} y2={r2(32 + 6 * Math.sin(a))} stroke="url(#tp1)" strokeWidth="0.5" opacity="0.15" />;
      })}
      {/* Cosmic accents */}
      <circle cx="8" cy="8" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="56" cy="56" r="1" fill="#f0d48a" opacity="0.22" />
    </svg>
  );
}

/* 7. KP System — Concentric rings with degree markers and pointer */
function KPSystemSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="kp1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#34d399" stopOpacity="0.25" /><stop offset="100%" stopColor="#34d399" stopOpacity="0" /></radialGradient>
        <linearGradient id="kp1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#kp1g)" />
      {/* Outermost ring — sign divisions */}
      <circle cx="32" cy="32" r="27" fill="none" stroke="url(#kp1)" strokeWidth="2.5" opacity="0.6" />
      {/* 12 sign divisions */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return <line key={i} x1={r2(32 + 24 * Math.cos(a))} y1={r2(32 + 24 * Math.sin(a))} x2={r2(32 + 27 * Math.cos(a))} y2={r2(32 + 27 * Math.sin(a))} stroke="url(#kp1)" strokeWidth="1.5" opacity="0.5" />;
      })}
      {/* Nakshatra ring */}
      <circle cx="32" cy="32" r="21" fill="none" stroke="url(#kp1)" strokeWidth="1.5" opacity="0.4" />
      {/* 27 nakshatra ticks */}
      {Array.from({ length: 27 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 27;
        return <line key={`n${i}`} x1={r2(32 + 21 * Math.cos(a))} y1={r2(32 + 21 * Math.sin(a))} x2={r2(32 + 24 * Math.cos(a))} y2={r2(32 + 24 * Math.sin(a))} stroke="url(#kp1)" strokeWidth="0.6" opacity="0.3" />;
      })}
      {/* Sub-lord ring */}
      <circle cx="32" cy="32" r="15" fill="none" stroke="url(#kp1)" strokeWidth="1" opacity="0.3" />
      <circle cx="32" cy="32" r="15" fill="url(#kp1)" opacity="0.05" />
      {/* Cuspal pointer — dramatic line from center to edge */}
      <line x1="32" y1="32" x2="32" y2="5" stroke="url(#kp1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <polygon points="32,5 29,10 35,10" fill="url(#kp1)" opacity="0.6" />
      {/* Secondary pointer */}
      <line x1="32" y1="32" x2="52" y2="20" stroke="url(#kp1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      {/* Center hub */}
      <circle cx="32" cy="32" r="5" fill="url(#kp1)" opacity="0.2" stroke="url(#kp1)" strokeWidth="2" />
      <circle cx="32" cy="32" r="2" fill="#f0d48a" opacity="0.65" />
      {/* Sub-lord marker dots */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 9 + 0.3;
        return <circle key={`s${i}`} cx={r2(32 + 18 * Math.cos(a))} cy={r2(32 + 18 * Math.sin(a))} r="1.2" fill="#f0d48a" opacity={0.25 + (i % 3) * 0.1} />;
      })}
      {/* Cosmic accents */}
      <circle cx="10" cy="10" r="0.7" fill="#f0d48a" opacity="0.2" />
      <circle cx="56" cy="54" r="0.9" fill="#f0d48a" opacity="0.22" />
      <circle cx="8" cy="52" r="1" fill="#f0d48a" opacity="0.18" />
    </svg>
  );
}

/* 8. Sade Sati — Saturn ring planet with shadow */
function SadeSatiSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="st1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" /><stop offset="100%" stopColor="#60a5fa" stopOpacity="0" /></radialGradient>
        <linearGradient id="st1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#st1g)" />
      {/* Saturn body */}
      <circle cx="32" cy="28" r="12" fill="url(#st1)" opacity="0.15" stroke="url(#st1)" strokeWidth="2.5" />
      <circle cx="32" cy="28" r="7" fill="url(#st1)" opacity="0.25" />
      <circle cx="32" cy="28" r="3.5" fill="#f0d48a" opacity="0.35" />
      {/* Saturn's rings — tilted ellipses */}
      <ellipse cx="32" cy="28" rx="24" ry="7" fill="none" stroke="url(#st1)" strokeWidth="3" opacity="0.6" transform="rotate(-15 32 28)" />
      <ellipse cx="32" cy="28" rx="20" ry="5.5" fill="none" stroke="url(#st1)" strokeWidth="1.5" opacity="0.35" transform="rotate(-15 32 28)" />
      <ellipse cx="32" cy="28" rx="27" ry="8.5" fill="none" stroke="url(#st1)" strokeWidth="1" opacity="0.2" transform="rotate(-15 32 28)" />
      {/* Ring shadow across planet */}
      <path d="M 22 26 Q 32 23 42 26" fill="none" stroke="#0a0520" strokeWidth="2.5" opacity="0.3" />
      {/* 7.5 text badge */}
      <text x="22" y="54" fill="url(#st1)" fontSize="13" fontWeight="bold" opacity="0.6" fontFamily="var(--font-cinzel)">7.5</text>
      {/* Moon silhouette being shadowed */}
      <path d="M 46 44 A 5 5 0 1 0 46 54 A 3.5 3.5 0 1 1 46 44" fill="url(#st1)" opacity="0.2" stroke="url(#st1)" strokeWidth="1.2" />
      {/* Cosmic accent dots */}
      <circle cx="8" cy="14" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="56" cy="48" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="10" cy="52" r="1.2" fill="#f0d48a" opacity="0.28" />
      <circle cx="54" cy="10" r="0.7" fill="#f0d48a" opacity="0.18" />
      <circle cx="14" cy="8" r="0.6" fill="#f0d48a" opacity="0.15" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DATA: 2 rows × 4 cards
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
      label: isDevanagari ? 'जन्म कुण्डली' : 'Birth Chart',
      cards: [
        { href: '/kundali', title: 'Kundali', subtitle: 'Janma Kundali', description: 'Complete birth chart analysis', glowColor: '#d4a853', svg: <KundaliSVG /> },
        { href: '/matching', title: 'Matching', subtitle: 'Ashta Kuta \u00b7 36 Points', description: 'Marriage compatibility score', glowColor: '#ec4899', svg: <MatchingSVG /> },
        { href: '/kundali/compare', title: 'Chart Comparison', subtitle: 'Side-by-Side Charts', description: 'Compare two birth charts', glowColor: '#8b5cf6', svg: <ComparisonSVG /> },
        { href: '/annual-forecast', title: 'Annual Forecast', subtitle: 'Varsha Phal Preview', description: 'Year ahead predictions', glowColor: '#22d3ee', svg: <AnnualForecastSVG /> },
      ],
    },
    {
      label: isDevanagari ? 'उन्नत पद्धतियाँ' : 'Advanced Systems',
      cards: [
        { href: '/varshaphal', title: 'Varshaphal', subtitle: 'Solar Return \u00b7 Tajika', description: 'Birthday chart yearly forecast', glowColor: '#fb923c', svg: <VarshaphalSVG /> },
        { href: '/tithi-pravesha', title: 'Tithi Pravesha', subtitle: 'Lunar Return Chart', description: 'Vedic birthday annual chart', glowColor: '#6366f1', svg: <TithiPraveshaSVG /> },
        { href: '/kp-system', title: 'KP System', subtitle: 'Krishnamurti Paddhati', description: 'Sub-lord & significator analysis', glowColor: '#34d399', svg: <KPSystemSVG /> },
        { href: '/sade-sati', title: 'Sade Sati', subtitle: "Saturn\u2019s 7\u00bd Year Transit", description: 'Saturn over your Moon sign', glowColor: '#60a5fa', svg: <SadeSatiSVG /> },
      ],
    },
  ];
}

/* ════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function ChartsPage() {
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
          {isDevanagari ? 'ज्योतिष कुण्डली' : 'Jyotish Charts'}
        </h1>
        <p className="text-text-secondary text-sm">
          {isDevanagari
            ? '8 शक्तिशाली कुण्डली उपकरण \u2014 जन्मपत्री, गुण मिलान, भविष्यवाणी एवं उन्नत पद्धतियाँ'
            : '8 powerful chart tools \u2014 birth chart, matching, forecasts & advanced systems'}
        </p>
      </motion.div>

      {/* 2 rows */}
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx}>
          <div className="text-gold-dark text-[11px] uppercase tracking-[3px] font-semibold mt-8 mb-3 ml-1">
            {row.label}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 auto-rows-fr mb-2">
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
        <AdUnit slot="charts-bottom" />
      </div>
      <ShareRow pageTitle="Jyotish Charts" locale={locale} />
    </div>
  );
}
