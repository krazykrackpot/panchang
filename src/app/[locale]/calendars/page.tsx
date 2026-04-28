'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import TarotCard from '@/components/ui/TarotCard';
import { ShareRow } from '@/components/ui/ShareButton';
import AdUnit from '@/components/ads/AdUnit';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/lib/i18n/config';
import type { ReactNode } from 'react';

/* -- Helper: round to 2dp for computed SVG coords -- */
const r2 = (n: number) => Math.round(n * 100) / 100;

/* ================================================================
   13 INLINE SVG ICONS -- bold, multi-layered, dramatic (128x128)
   Gradient IDs use unique 2-letter prefixes to avoid collisions.
   ================================================================ */

/* 1. Festivals -- Ornate diya lamp with flame */
function FestivalsSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="fe1g" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.3" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
        <linearGradient id="fe1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
        <radialGradient id="fe1f" cx="50%" cy="60%" r="50%"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.6" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#fe1g)" />
      {/* Diya base — ornate bowl */}
      <ellipse cx="32" cy="42" rx="16" ry="6" fill="url(#fe1)" opacity="0.12" stroke="url(#fe1)" strokeWidth="2.5" />
      <path d="M 16 42 Q 18 50 32 52 Q 46 50 48 42" fill="url(#fe1)" opacity="0.15" stroke="url(#fe1)" strokeWidth="2" />
      {/* Inner oil */}
      <ellipse cx="32" cy="42" rx="12" ry="4" fill="url(#fe1)" opacity="0.2" />
      {/* Wick */}
      <line x1="32" y1="38" x2="32" y2="26" stroke="url(#fe1)" strokeWidth="1.5" opacity="0.5" />
      {/* Flame — layered teardrop */}
      <ellipse cx="32" cy="18" rx="6" ry="10" fill="url(#fe1f)" opacity="0.15" />
      <path d="M 32 8 C 28 14 26 20 32 26 C 38 20 36 14 32 8 Z" fill="url(#fe1)" opacity="0.35" stroke="url(#fe1)" strokeWidth="1.5" />
      <path d="M 32 12 C 30 16 29 20 32 24 C 35 20 34 16 32 12 Z" fill="#f0d48a" opacity="0.5" />
      <ellipse cx="32" cy="18" rx="2" ry="4" fill="#f0d48a" opacity="0.7" />
      {/* Flame glow halo */}
      <circle cx="32" cy="18" r="12" fill="url(#fe1f)" opacity="0.08" />
      {/* Decorative side curls on diya */}
      <path d="M 16 42 C 12 40 10 44 14 46" fill="none" stroke="url(#fe1)" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <path d="M 48 42 C 52 40 54 44 50 46" fill="none" stroke="url(#fe1)" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Ornate dots on rim */}
      {Array.from({ length: 7 }, (_, i) => {
        const a = Math.PI + (Math.PI * i) / 6;
        return <circle key={i} cx={r2(32 + 14 * Math.cos(a))} cy={r2(42 + 5 * Math.sin(a))} r="1" fill="#f0d48a" opacity="0.45" />;
      })}
      {/* Scattered sparkles */}
      <circle cx="14" cy="14" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="50" cy="10" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="52" cy="34" r="1.2" fill="#f0d48a" opacity="0.3" />
      <circle cx="10" cy="30" r="0.7" fill="#f0d48a" opacity="0.2" />
      <circle cx="22" cy="8" r="0.6" fill="#f0d48a" opacity="0.2" />
      <circle cx="44" cy="6" r="0.9" fill="#f0d48a" opacity="0.25" />
    </svg>
  );
}

/* 2. Horoscope -- Zodiac wheel with 12 divisions */
function HoroscopeSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="hr1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
        <linearGradient id="hr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#hr1g)" />
      {/* Outer zodiac ring */}
      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#hr1)" strokeWidth="2.5" opacity="0.6" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="url(#hr1)" strokeWidth="1.5" opacity="0.35" />
      <circle cx="32" cy="32" r="20" fill="url(#hr1)" opacity="0.06" />
      {/* 12 zodiac divisions */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        return (
          <line key={i} x1={r2(32 + 20 * Math.cos(a))} y1={r2(32 + 20 * Math.sin(a))} x2={r2(32 + 26 * Math.cos(a))} y2={r2(32 + 26 * Math.sin(a))} stroke="url(#hr1)" strokeWidth="1.5" opacity="0.5" />
        );
      })}
      {/* Inner ring with sign dots */}
      <circle cx="32" cy="32" r="13" fill="none" stroke="url(#hr1)" strokeWidth="1" opacity="0.25" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * (i + 0.5)) / 12 - Math.PI / 2;
        return <circle key={`s${i}`} cx={r2(32 + 23 * Math.cos(a))} cy={r2(32 + 23 * Math.sin(a))} r="1.8" fill="url(#hr1)" opacity={0.35 + (i % 4) * 0.08} stroke="url(#hr1)" strokeWidth="0.7" />;
      })}
      {/* Center sun symbol */}
      <circle cx="32" cy="32" r="6" fill="url(#hr1)" opacity="0.15" stroke="url(#hr1)" strokeWidth="2" />
      <circle cx="32" cy="32" r="2.5" fill="#f0d48a" opacity="0.65" />
      {/* Decorative rays from center */}
      {Array.from({ length: 4 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 4 + Math.PI / 4;
        return <line key={`r${i}`} x1={r2(32 + 7 * Math.cos(a))} y1={r2(32 + 7 * Math.sin(a))} x2={r2(32 + 12 * Math.cos(a))} y2={r2(32 + 12 * Math.sin(a))} stroke="url(#hr1)" strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />;
      })}
      {/* Cosmic dust */}
      <circle cx="8" cy="10" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="56" cy="52" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="54" cy="10" r="0.7" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* 3. Transits -- Orbital paths with planet dots */
function TransitsSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="tr1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0" /></radialGradient>
        <linearGradient id="tr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#tr1g)" />
      {/* Central body (Sun) */}
      <circle cx="32" cy="32" r="5" fill="url(#tr1)" opacity="0.3" stroke="url(#tr1)" strokeWidth="2" />
      <circle cx="32" cy="32" r="2" fill="#f0d48a" opacity="0.7" />
      {/* Orbit 1 — inner */}
      <circle cx="32" cy="32" r="11" fill="none" stroke="url(#tr1)" strokeWidth="1.2" opacity="0.3" strokeDasharray="3 2" />
      <circle cx={r2(32 + 11 * Math.cos(0.8))} cy={r2(32 + 11 * Math.sin(0.8))} r="2.5" fill="url(#tr1)" opacity="0.55" stroke="url(#tr1)" strokeWidth="1.5" />
      {/* Orbit 2 — middle */}
      <circle cx="32" cy="32" r="18" fill="none" stroke="url(#tr1)" strokeWidth="1" opacity="0.25" strokeDasharray="4 3" />
      <circle cx={r2(32 + 18 * Math.cos(3.5))} cy={r2(32 + 18 * Math.sin(3.5))} r="3" fill="url(#tr1)" opacity="0.5" stroke="url(#tr1)" strokeWidth="1.5" />
      {/* Orbit 3 — outer */}
      <circle cx="32" cy="32" r="25" fill="none" stroke="url(#tr1)" strokeWidth="0.8" opacity="0.2" strokeDasharray="5 4" />
      <circle cx={r2(32 + 25 * Math.cos(5.2))} cy={r2(32 + 25 * Math.sin(5.2))} r="3.5" fill="url(#tr1)" opacity="0.45" stroke="url(#tr1)" strokeWidth="1.5" />
      {/* Motion trail arcs */}
      <path d={`M ${r2(32 + 11 * Math.cos(0.4))} ${r2(32 + 11 * Math.sin(0.4))} A 11 11 0 0 1 ${r2(32 + 11 * Math.cos(0.8))} ${r2(32 + 11 * Math.sin(0.8))}`} fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      <path d={`M ${r2(32 + 18 * Math.cos(3.1))} ${r2(32 + 18 * Math.sin(3.1))} A 18 18 0 0 1 ${r2(32 + 18 * Math.cos(3.5))} ${r2(32 + 18 * Math.sin(3.5))}`} fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
      {/* Scattered stars */}
      <circle cx="8" cy="8" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="56" cy="14" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="10" cy="54" r="0.7" fill="#f0d48a" opacity="0.2" />
      <circle cx="54" cy="56" r="1.2" fill="#f0d48a" opacity="0.25" />
      <circle cx="6" cy="32" r="0.5" fill="#f0d48a" opacity="0.15" />
    </svg>
  );
}

/* 4. Retrograde -- Backward spiral arrow */
function RetrogradeSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="re1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.28" /><stop offset="100%" stopColor="#f43f5e" stopOpacity="0" /></radialGradient>
        <linearGradient id="re1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#re1g)" />
      {/* Outer spiral — large backward loop */}
      <path d="M 48 18 C 56 28, 52 44, 38 48 C 24 52, 12 42, 12 32 C 12 22, 22 14, 32 14" fill="none" stroke="url(#re1)" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
      {/* Inner spiral — tighter */}
      <path d="M 32 14 C 38 14, 44 20, 44 28 C 44 36, 38 40, 32 40 C 26 40, 22 36, 22 30" fill="none" stroke="url(#re1)" strokeWidth="2" opacity="0.45" strokeLinecap="round" />
      {/* Innermost curl */}
      <path d="M 22 30 C 22 26, 26 24, 30 24 C 34 24, 36 28, 34 30" fill="none" stroke="url(#re1)" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
      {/* Backward arrowhead at start */}
      <polygon points="48,18 44,12 42,20" fill="url(#re1)" opacity="0.7" stroke="url(#re1)" strokeWidth="1" />
      {/* Rx symbol */}
      <text x="32" y="34" textAnchor="middle" fill="#f0d48a" fontSize="10" fontWeight="bold" opacity="0.35" fontFamily="serif">R</text>
      {/* Planet dot at center of spiral */}
      <circle cx="32" cy="30" r="3" fill="url(#re1)" opacity="0.3" stroke="url(#re1)" strokeWidth="1.5" />
      <circle cx="32" cy="30" r="1.2" fill="#f0d48a" opacity="0.6" />
      {/* Warning accent dots */}
      <circle cx="8" cy="12" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="56" cy="50" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="52" cy="8" r="1.2" fill="#f0d48a" opacity="0.3" />
      <circle cx="10" cy="52" r="0.7" fill="#f0d48a" opacity="0.2" />
      <circle cx="56" cy="28" r="0.6" fill="#f0d48a" opacity="0.15" />
    </svg>
  );
}

/* 5. Eclipses -- Sun/moon eclipse overlap */
function EclipsesSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ec1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.25" /><stop offset="100%" stopColor="#fb923c" stopOpacity="0" /></radialGradient>
        <linearGradient id="ec1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
        <radialGradient id="ec1c" cx="40%" cy="40%" r="50%"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.4" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#ec1g)" />
      {/* Corona rays — visible during eclipse */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 16;
        const inner = 17;
        const outer = i % 2 === 0 ? 28 : 24;
        return (
          <line key={i} x1={r2(28 + inner * Math.cos(a))} y1={r2(32 + inner * Math.sin(a))} x2={r2(28 + outer * Math.cos(a))} y2={r2(32 + outer * Math.sin(a))} stroke="url(#ec1)" strokeWidth={i % 2 === 0 ? '2' : '1'} strokeLinecap="round" opacity={i % 2 === 0 ? 0.5 : 0.25} />
        );
      })}
      {/* Sun body */}
      <circle cx="28" cy="32" r="15" fill="url(#ec1)" opacity="0.15" stroke="url(#ec1)" strokeWidth="2.5" />
      <circle cx="28" cy="32" r="15" fill="url(#ec1c)" />
      <circle cx="28" cy="32" r="8" fill="url(#ec1)" opacity="0.25" />
      <circle cx="28" cy="32" r="3" fill="#f0d48a" opacity="0.5" />
      {/* Moon shadow — dark disc overlapping */}
      <circle cx="36" cy="30" r="14" fill="#0a0520" opacity="0.85" />
      <circle cx="38" cy="28" r="10" fill="#0a0520" opacity="0.6" />
      {/* Moon edge highlight — thin crescent of light */}
      <path d="M 42 18 A 14 14 0 0 1 42 42" fill="none" stroke="url(#ec1)" strokeWidth="1.5" opacity="0.4" />
      {/* Diamond ring effect */}
      <circle cx="22" cy="22" r="2.5" fill="#f0d48a" opacity="0.6" />
      <circle cx="22" cy="22" r="5" fill="#f0d48a" opacity="0.1" />
      {/* Scattered stars */}
      <circle cx="54" cy="10" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="8" cy="14" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="56" cy="50" r="1.2" fill="#f0d48a" opacity="0.25" />
      <circle cx="6" cy="50" r="0.7" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* 6. Celestial Events — Dramatic starburst with concentric explosion rings */
function CelestialEventsSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ce1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" /><stop offset="100%" stopColor="#38bdf8" stopOpacity="0" /></radialGradient>
        <linearGradient id="ce1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#ce1g)" />
      {/* Concentric explosion rings */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#ce1)" strokeWidth="2" opacity="0.15" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="url(#ce1)" strokeWidth="2.5" opacity="0.25" />
      <circle cx="32" cy="32" r="15" fill="url(#ce1)" opacity="0.06" stroke="url(#ce1)" strokeWidth="2" />
      {/* Bold 16-point starburst filling the card */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 16;
        const inner = 4;
        const outer = i % 2 === 0 ? 30 : 22;
        return <line key={i} x1={r2(32 + inner * Math.cos(a))} y1={r2(32 + inner * Math.sin(a))} x2={r2(32 + outer * Math.cos(a))} y2={r2(32 + outer * Math.sin(a))} stroke="url(#ce1)" strokeWidth={i % 2 === 0 ? '3' : '1.5'} opacity={i % 2 === 0 ? 0.5 : 0.25} strokeLinecap="round" />;
      })}
      {/* Core — bright center */}
      <circle cx="32" cy="32" r="8" fill="url(#ce1)" opacity="0.15" />
      <circle cx="32" cy="32" r="4" fill="url(#ce1)" opacity="0.35" />
      <circle cx="32" cy="32" r="2" fill="#f0d48a" opacity="0.7" />
      {/* Orbital arcs */}
      <path d="M 6 42 Q 20 56 40 50 Q 58 44 60 28" fill="none" stroke="url(#ce1)" strokeWidth="1.5" opacity="0.2" strokeDasharray="4 3" />
      <path d="M 4 24 Q 14 8 32 6 Q 52 4 60 18" fill="none" stroke="url(#ce1)" strokeWidth="1" opacity="0.15" strokeDasharray="3 4" />
      {/* Accent dots at ray tips */}
      {[0, 2, 4, 6, 8, 10, 12, 14].map((i) => {
        const a = (Math.PI * 2 * i) / 16;
        return <circle key={`d${i}`} cx={r2(32 + 30 * Math.cos(a))} cy={r2(32 + 30 * Math.sin(a))} r="1.5" fill="#f0d48a" opacity="0.35" />;
      })}
    </svg>
  );
}

/* 7. Muhurat Calendar — Bold 12-segment auspicious wheel with glowing sectors */
function MuhuratCalendarSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="mc1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.35" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
        <linearGradient id="mc1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#mc1g)" />
      {/* Outer bold ring */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#mc1)" strokeWidth="3" opacity="0.55" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="url(#mc1)" strokeWidth="1.5" opacity="0.3" />
      <circle cx="32" cy="32" r="18" fill="url(#mc1)" opacity="0.06" />
      {/* 12 segment dividers */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        return <line key={i} x1={r2(32 + 10 * Math.cos(a))} y1={r2(32 + 10 * Math.sin(a))} x2={r2(32 + 28 * Math.cos(a))} y2={r2(32 + 28 * Math.sin(a))} stroke="url(#mc1)" strokeWidth="1.5" opacity="0.25" />;
      })}
      {/* Auspicious sector highlights — bold arcs */}
      {[0, 2, 5, 8, 10].map((i) => {
        const a1 = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        const a2 = (Math.PI * 2 * (i + 1)) / 12 - Math.PI / 2;
        return <path key={`a${i}`} d={`M ${r2(32 + 18 * Math.cos(a1))} ${r2(32 + 18 * Math.sin(a1))} A 18 18 0 0 1 ${r2(32 + 18 * Math.cos(a2))} ${r2(32 + 18 * Math.sin(a2))} L ${r2(32 + 24 * Math.cos(a2))} ${r2(32 + 24 * Math.sin(a2))} A 24 24 0 0 0 ${r2(32 + 24 * Math.cos(a1))} ${r2(32 + 24 * Math.sin(a1))} Z`} fill="url(#mc1)" opacity="0.12" />;
      })}
      {/* Bold hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        const isMajor = i % 3 === 0;
        return <circle key={`m${i}`} cx={r2(32 + 26 * Math.cos(a))} cy={r2(32 + 26 * Math.sin(a))} r={isMajor ? 2.5 : 1.5} fill="#f0d48a" opacity={isMajor ? 0.6 : 0.35} />;
      })}
      {/* Clock hands — bold */}
      <line x1="32" y1="32" x2="32" y2="10" stroke="url(#mc1)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
      <line x1="32" y1="32" x2="48" y2="24" stroke="url(#mc1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      {/* Center jewel — large */}
      <circle cx="32" cy="32" r="6" fill="url(#mc1)" opacity="0.2" stroke="url(#mc1)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="0.45" />
      <circle cx="32" cy="32" r="1.5" fill="#f0d48a" opacity="0.8" />
    </svg>
  );
}

/* 8. Regional — Bold compass rose with directional spokes and region dots */
function RegionalSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="rg1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#34d399" stopOpacity="0.35" /><stop offset="100%" stopColor="#34d399" stopOpacity="0" /></radialGradient>
        <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#rg1g)" />
      {/* Outer ring */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#rg1)" strokeWidth="2.5" opacity="0.45" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="url(#rg1)" strokeWidth="1.5" opacity="0.25" />
      {/* 4 cardinal compass points — bold diamond arrows */}
      <path d="M 32 2 L 36 14 L 32 10 L 28 14 Z" fill="url(#rg1)" opacity="0.5" stroke="url(#rg1)" strokeWidth="1.5" /> {/* N */}
      <path d="M 62 32 L 50 36 L 54 32 L 50 28 Z" fill="url(#rg1)" opacity="0.4" stroke="url(#rg1)" strokeWidth="1" /> {/* E */}
      <path d="M 32 62 L 28 50 L 32 54 L 36 50 Z" fill="url(#rg1)" opacity="0.35" stroke="url(#rg1)" strokeWidth="1" /> {/* S */}
      <path d="M 2 32 L 14 28 L 10 32 L 14 36 Z" fill="url(#rg1)" opacity="0.4" stroke="url(#rg1)" strokeWidth="1" /> {/* W */}
      {/* 4 intercardinal spokes */}
      {[Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4].map((a, i) => (
        <line key={i} x1={r2(32 + 8 * Math.cos(a))} y1={r2(32 + 8 * Math.sin(a))} x2={r2(32 + 24 * Math.cos(a))} y2={r2(32 + 24 * Math.sin(a))} stroke="url(#rg1)" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      ))}
      {/* Cardinal axis lines */}
      <line x1="32" y1="10" x2="32" y2="54" stroke="url(#rg1)" strokeWidth="1.5" opacity="0.2" />
      <line x1="10" y1="32" x2="54" y2="32" stroke="url(#rg1)" strokeWidth="1.5" opacity="0.2" />
      {/* Degree tick marks around ring */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 16;
        return <line key={`t${i}`} x1={r2(32 + 26 * Math.cos(a))} y1={r2(32 + 26 * Math.sin(a))} x2={r2(32 + 28 * Math.cos(a))} y2={r2(32 + 28 * Math.sin(a))} stroke="url(#rg1)" strokeWidth={i % 4 === 0 ? '2' : '1'} opacity={i % 4 === 0 ? 0.5 : 0.3} />;
      })}
      {/* Region marker dots — scattered in the inner field */}
      {[[26, 20, 2.5], [38, 24, 2], [22, 32, 2.2], [40, 34, 1.8], [28, 40, 2.3], [36, 42, 2], [32, 28, 3]].map(([cx, cy, rr], i) => (
        <g key={`r${i}`}>
          <circle cx={cx} cy={cy} r={(rr as number) + 2} fill="url(#rg1)" opacity="0.06" />
          <circle cx={cx} cy={cy} r={rr as number} fill="url(#rg1)" opacity={0.3 + i * 0.04} stroke="url(#rg1)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={(rr as number) * 0.35} fill="#f0d48a" opacity="0.6" />
        </g>
      ))}
      {/* Center jewel */}
      <circle cx="32" cy="32" r="5" fill="url(#rg1)" opacity="0.15" stroke="url(#rg1)" strokeWidth="2" />
      <circle cx="32" cy="32" r="2" fill="#f0d48a" opacity="0.6" />
    </svg>
  );
}

/* 9. Ekadashi -- Crescent moon with Roman XI */
function EkadashiSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ek1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
        <linearGradient id="ek1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#ek1g)" />
      {/* Crescent moon — waxing */}
      <circle cx="26" cy="26" r="16" fill="url(#ek1)" opacity="0.15" stroke="url(#ek1)" strokeWidth="2.5" />
      <circle cx="34" cy="22" r="14" fill="#0a0e27" /> {/* shadow bite */}
      {/* Moon surface details */}
      <circle cx="20" cy="24" r="2" fill="url(#ek1)" opacity="0.1" />
      <circle cx="24" cy="32" r="1.5" fill="url(#ek1)" opacity="0.08" />
      <circle cx="18" cy="30" r="1" fill="url(#ek1)" opacity="0.06" />
      {/* XI numeral — bold serif */}
      <text x="38" y="48" textAnchor="middle" fill="#f0d48a" fontSize="16" fontWeight="bold" opacity="0.45" fontFamily="serif">XI</text>
      {/* Decorative underline */}
      <line x1="28" y1="50" x2="48" y2="50" stroke="url(#ek1)" strokeWidth="1.5" opacity="0.25" strokeLinecap="round" />
      {/* Halo around crescent */}
      <circle cx="26" cy="26" r="20" fill="none" stroke="url(#ek1)" strokeWidth="0.8" opacity="0.15" strokeDasharray="3 3" />
      {/* Stars scattered */}
      <circle cx="50" cy="10" r="1.5" fill="#f0d48a" opacity="0.4" />
      <circle cx="54" cy="20" r="0.8" fill="#f0d48a" opacity="0.3" />
      <circle cx="48" cy="14" r="0.6" fill="#f0d48a" opacity="0.25" />
      <circle cx="56" cy="30" r="1" fill="#f0d48a" opacity="0.2" />
      <circle cx="10" cy="50" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="14" cy="46" r="1.2" fill="#f0d48a" opacity="0.25" />
      <circle cx="44" cy="8" r="0.7" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* 10. Purnima -- Full moon with glow rays */
function PurnimaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="pu1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.3" /><stop offset="100%" stopColor="#f0d48a" stopOpacity="0" /></radialGradient>
        <linearGradient id="pu1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
        <radialGradient id="pu1m" cx="45%" cy="40%" r="50%"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.35" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0.05" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#pu1g)" />
      {/* Glow rays — radiating outward */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 16;
        const inner = 18;
        const outer = i % 2 === 0 ? 28 : 24;
        return (
          <line key={i} x1={r2(32 + inner * Math.cos(a))} y1={r2(32 + inner * Math.sin(a))} x2={r2(32 + outer * Math.cos(a))} y2={r2(32 + outer * Math.sin(a))} stroke="url(#pu1)" strokeWidth={i % 2 === 0 ? '2' : '1.2'} strokeLinecap="round" opacity={i % 2 === 0 ? 0.4 : 0.2} />
        );
      })}
      {/* Moon body — full luminous disc */}
      <circle cx="32" cy="32" r="16" fill="url(#pu1m)" stroke="url(#pu1)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="16" fill="url(#pu1)" opacity="0.2" />
      {/* Surface details — maria */}
      <circle cx="28" cy="28" r="3" fill="url(#pu1)" opacity="0.1" />
      <circle cx="36" cy="30" r="2" fill="url(#pu1)" opacity="0.08" />
      <circle cx="30" cy="36" r="2.5" fill="url(#pu1)" opacity="0.07" />
      <circle cx="38" cy="24" r="1.5" fill="url(#pu1)" opacity="0.06" />
      <circle cx="24" cy="34" r="1.8" fill="url(#pu1)" opacity="0.05" />
      {/* Bright center highlight */}
      <circle cx="32" cy="32" r="8" fill="url(#pu1)" opacity="0.15" />
      <circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="0.4" />
      {/* Outer halo */}
      <circle cx="32" cy="32" r="22" fill="none" stroke="url(#pu1)" strokeWidth="0.8" opacity="0.12" />
      {/* Stars */}
      <circle cx="6" cy="10" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="58" cy="14" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="56" cy="52" r="1.2" fill="#f0d48a" opacity="0.2" />
      <circle cx="8" cy="54" r="0.7" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* 11. Amavasya -- Dark moon with surrounding stars */
function AmavasyaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="am1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></radialGradient>
        <linearGradient id="am1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#am1g)" />
      {/* Dark moon body — barely visible disc */}
      <circle cx="32" cy="32" r="16" fill="url(#am1)" opacity="0.04" stroke="url(#am1)" strokeWidth="2" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="url(#am1)" strokeWidth="0.8" opacity="0.15" strokeDasharray="4 2" />
      {/* Subtle surface hint */}
      <circle cx="28" cy="28" r="3" fill="url(#am1)" opacity="0.03" />
      <circle cx="36" cy="34" r="2.5" fill="url(#am1)" opacity="0.03" />
      {/* Inner shadow rings */}
      <circle cx="32" cy="32" r="12" fill="none" stroke="url(#am1)" strokeWidth="0.6" opacity="0.1" />
      <circle cx="32" cy="32" r="8" fill="none" stroke="url(#am1)" strokeWidth="0.5" opacity="0.08" />
      {/* Scattered stars — the sky shines on Amavasya */}
      {[[10, 10, 2], [52, 12, 1.8], [8, 46, 1.5], [54, 50, 2.2], [16, 26, 1.2], [48, 28, 1.4], [22, 52, 1.6], [42, 54, 1.3], [12, 36, 1], [50, 38, 1.1], [26, 8, 1.5], [38, 8, 1.3], [6, 56, 0.8], [58, 20, 1], [36, 58, 0.9]].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r as number} fill="#f0d48a" opacity={0.15 + (i % 5) * 0.06} />
          <circle cx={cx} cy={cy} r={(r as number) * 0.4} fill="#f0d48a" opacity={0.3 + (i % 3) * 0.1} />
        </g>
      ))}
      {/* 4-point star sparkles */}
      {[[10, 10], [52, 12], [54, 50], [8, 46]].map(([cx, cy], i) => (
        <g key={`sp${i}`}>
          <line x1={(cx as number) - 3} y1={cy} x2={(cx as number) + 3} y2={cy} stroke="#f0d48a" strokeWidth="0.6" opacity="0.3" />
          <line x1={cx} y1={(cy as number) - 3} x2={cx} y2={(cy as number) + 3} stroke="#f0d48a" strokeWidth="0.6" opacity="0.3" />
        </g>
      ))}
    </svg>
  );
}

/* 12. Pradosham — Prabha Mandala: Shiva's cosmic fire ring with crescent moon center */
function PradoshamSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="pd1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" /><stop offset="100%" stopColor="#ec4899" stopOpacity="0" /></radialGradient>
        <linearGradient id="pd1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#pd1g)" />
      {/* Outer fire ring — bold, fills the card */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#pd1)" strokeWidth="3.5" opacity="0.5" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="url(#pd1)" strokeWidth="1.5" opacity="0.25" />
      {/* 20 fire tongues — dramatic, outward-pointing */}
      {Array.from({ length: 20 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 20;
        const inner = 24;
        const outer = i % 2 === 0 ? 31 : 28;
        const w = i % 2 === 0 ? 3 : 1.5;
        return <line key={i} x1={r2(32 + inner * Math.cos(a))} y1={r2(32 + inner * Math.sin(a))} x2={r2(32 + outer * Math.cos(a))} y2={r2(32 + outer * Math.sin(a))} stroke="url(#pd1)" strokeWidth={w} strokeLinecap="round" opacity={i % 2 === 0 ? 0.65 : 0.3} />;
      })}
      {/* Inner sacred space */}
      <circle cx="32" cy="32" r="18" fill="url(#pd1)" opacity="0.05" />
      {/* Crescent moon — Shiva's crown, bold and centered */}
      <circle cx="32" cy="26" r="10" fill="url(#pd1)" opacity="0.2" stroke="url(#pd1)" strokeWidth="2.5" />
      <circle cx="38" cy="23" r="8" fill="#0a0520" />
      {/* Three horizontal lines — tripundra (Shiva's forehead mark) */}
      <line x1="24" y1="38" x2="40" y2="38" stroke="url(#pd1)" strokeWidth="2.5" opacity="0.55" strokeLinecap="round" />
      <line x1="25" y1="42" x2="39" y2="42" stroke="url(#pd1)" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      <line x1="26" y1="46" x2="38" y2="46" stroke="url(#pd1)" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      {/* Bindu dot above tripundra */}
      <circle cx="32" cy="34" r="2" fill="#f0d48a" opacity="0.6" />
      <circle cx="32" cy="34" r="4" fill="url(#pd1)" opacity="0.1" />
      {/* Accent sparkles */}
      <circle cx="10" cy="10" r="1.2" fill="#f0d48a" opacity="0.3" />
      <circle cx="54" cy="10" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="10" cy="54" r="0.9" fill="#f0d48a" opacity="0.22" />
      <circle cx="54" cy="54" r="1.1" fill="#f0d48a" opacity="0.28" />
    </svg>
  );
}

/* 13. Chaturthi — Sacred Om (ॐ) with lotus petals and swastik — Ganesha's abstract symbols */
function ChaturthiSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ct1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.4" /><stop offset="100%" stopColor="#fb923c" stopOpacity="0" /></radialGradient>
        <linearGradient id="ct1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#ct1g)" />
      {/* Outer sacred circle */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#ct1)" strokeWidth="2.5" opacity="0.35" />
      {/* 8 lotus petals — large, bold, filling the ring */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8;
        const tipX = r2(32 + 26 * Math.cos(a));
        const tipY = r2(32 + 26 * Math.sin(a));
        const baseL = (Math.PI * 2 * (i - 0.3)) / 8;
        const baseR = (Math.PI * 2 * (i + 0.3)) / 8;
        return (
          <path
            key={i}
            d={`M ${r2(32 + 10 * Math.cos(baseL))} ${r2(32 + 10 * Math.sin(baseL))} Q ${tipX} ${tipY} ${r2(32 + 10 * Math.cos(baseR))} ${r2(32 + 10 * Math.sin(baseR))}`}
            fill="url(#ct1)" opacity={0.08 + (i % 2) * 0.06}
            stroke="url(#ct1)" strokeWidth="2" strokeOpacity={0.3 + (i % 2) * 0.15}
          />
        );
      })}
      {/* Inner circle */}
      <circle cx="32" cy="32" r="12" fill="url(#ct1)" opacity="0.08" stroke="url(#ct1)" strokeWidth="2" />
      {/* Bold Om symbol — the centerpiece */}
      <text x="32" y="40" textAnchor="middle" fill="url(#ct1)" fontSize="24" fontWeight="bold" opacity="0.65" style={{ fontFamily: 'serif' }}>ॐ</text>
      {/* Swastik marks at 4 corners — small, sacred */}
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([dx, dy], i) => {
        const cx = 32 + dx * 22;
        const cy = 32 + dy * 22;
        return (
          <g key={`sw${i}`}>
            <line x1={cx - 2} y1={cy} x2={cx + 2} y2={cy} stroke="url(#ct1)" strokeWidth="1.5" opacity="0.35" />
            <line x1={cx} y1={cy - 2} x2={cx} y2={cy + 2} stroke="url(#ct1)" strokeWidth="1.5" opacity="0.35" />
            <circle cx={cx} cy={cy} r="0.8" fill="#f0d48a" opacity="0.4" />
          </g>
        );
      })}
      {/* Decorative dots between petals */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * (i + 0.5)) / 8;
        return <circle key={`pd${i}`} cx={r2(32 + 20 * Math.cos(a))} cy={r2(32 + 20 * Math.sin(a))} r="1.5" fill="#f0d48a" opacity="0.35" />;
      })}
      {/* Center bindu */}
      <circle cx="32" cy="28" r="1.5" fill="#f0d48a" opacity="0.7" />
    </svg>
  );
}

/* ================================================================
   DATA: 3 rows of cards
   ================================================================ */

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
      label: isDevanagari ? 'मुख्य पंचांग' : 'Core Calendars',
      cards: [
        { href: '/calendar', title: 'Festivals', subtitle: 'Hindu Festivals', description: 'Sacred days & celebrations', glowColor: '#d4a853', svg: <FestivalsSVG /> },
        { href: '/horoscope', title: 'Horoscope', subtitle: 'Daily \u00b7 Weekly \u00b7 Monthly', description: 'Rashi-based forecasts', glowColor: '#8b5cf6', svg: <HoroscopeSVG /> },
        { href: '/transits', title: 'Transits', subtitle: 'Graha Gochara', description: 'Real-time planet movements', glowColor: '#22d3ee', svg: <TransitsSVG /> },
        { href: '/retrograde', title: 'Retrograde', subtitle: 'Vakri Graha', description: 'Retrograde windows & effects', glowColor: '#f43f5e', svg: <RetrogradeSVG /> },
        { href: '/eclipses', title: 'Eclipses', subtitle: 'Grahan \u00b7 Solar \u00b7 Lunar', description: 'Eclipse dates & visibility', glowColor: '#fb923c', svg: <EclipsesSVG /> },
      ],
    },
    {
      label: isDevanagari ? 'समय एवं क्षेत्रीय' : 'Timing & Regional',
      cards: [
        { href: '/events', title: 'Celestial Events', subtitle: 'Conjunctions \u00b7 Occultations', description: 'Notable sky phenomena', glowColor: '#38bdf8', svg: <CelestialEventsSVG /> },
        { href: '/muhurat', title: 'Muhurat Calendar', subtitle: 'Auspicious Windows', description: 'Best times for life events', glowColor: '#d4a853', svg: <MuhuratCalendarSVG /> },
        { href: '/regional', title: 'Regional', subtitle: 'State-wise Panchang', description: "India\u2019s regional traditions", glowColor: '#34d399', svg: <RegionalSVG /> },
      ],
    },
    {
      label: isDevanagari ? 'पवित्र तिथियाँ' : 'Sacred Dates',
      cards: [
        { href: '/dates/ekadashi', title: 'Ekadashi', subtitle: '11th Tithi Fasting', description: '24 Ekadashi dates yearly', glowColor: '#8b5cf6', svg: <EkadashiSVG /> },
        { href: '/dates/purnima', title: 'Purnima', subtitle: 'Full Moon Days', description: 'Monthly Purnima dates', glowColor: '#f0d48a', svg: <PurnimaSVG /> },
        { href: '/dates/amavasya', title: 'Amavasya', subtitle: 'New Moon Days', description: 'Monthly Amavasya dates', glowColor: '#6366f1', svg: <AmavasyaSVG /> },
        { href: '/dates/pradosham', title: 'Pradosham', subtitle: "Shiva\u2019s Twilight", description: 'Trayodashi vrat dates', glowColor: '#ec4899', svg: <PradoshamSVG /> },
        { href: '/dates/chaturthi', title: 'Chaturthi', subtitle: "Ganesha\u2019s Day", description: 'Vinayaka Chaturthi dates', glowColor: '#fb923c', svg: <ChaturthiSVG /> },
      ],
    },
  ];
}

/* ================================================================
   PAGE COMPONENT
   ================================================================ */

export default function CalendarsPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const ROWS = buildRows(isDevanagari);

  const ROW_GRIDS = [
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 auto-rows-fr mb-2',
    'grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 auto-rows-fr mb-2',
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 auto-rows-fr mb-2',
  ];

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
          {isDevanagari ? 'वैदिक पंचांग' : 'Vedic Calendars'}
        </h1>
        <p className="text-text-secondary text-sm">
          {isDevanagari
            ? '13 पवित्र कैलेंडर \u2014 त्योहार, गोचर, ग्रहण एवं शुभ तिथियाँ'
            : '13 sacred calendars \u2014 festivals, transits, eclipses & auspicious dates'}
        </p>
      </motion.div>

      {/* 3 rows */}
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx}>
          <div className="text-gold-dark text-[11px] uppercase tracking-[3px] font-semibold mt-8 mb-3 ml-1">
            {row.label}
          </div>
          <div className={ROW_GRIDS[rowIdx]}>
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
        <AdUnit slot="calendars-bottom" />
      </div>
      <ShareRow pageTitle="Vedic Calendars" locale={locale} />
    </div>
  );
}
