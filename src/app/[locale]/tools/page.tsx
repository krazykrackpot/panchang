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
   20 INLINE SVG ICONS — bold, multi-layered, dramatic (128x128)
   Gradient IDs use unique 2-letter prefixes to avoid collisions.
   ════════════════════════════════════════════════════════════════════ */

/* 1. Rahu Kaal — Dramatic sun/eclipse with shadow biting */
function RahuKaalSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="rk1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" /><stop offset="100%" stopColor="#ef4444" stopOpacity="0" /></radialGradient>
        <linearGradient id="rk1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#rk1g)" />
      {/* Sun body */}
      <circle cx="32" cy="32" r="14" fill="url(#rk1)" opacity="0.15" stroke="url(#rk1)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="7" fill="url(#rk1)" opacity="0.35" />
      <circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="0.7" />
      {/* Sun rays */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        const inner = i % 2 === 0 ? 17 : 18;
        const outer = i % 2 === 0 ? 28 : 24;
        return (
          <line key={i} x1={r2(32 + inner * Math.cos(a))} y1={r2(32 + inner * Math.sin(a))} x2={r2(32 + outer * Math.cos(a))} y2={r2(32 + outer * Math.sin(a))} stroke="url(#rk1)" strokeWidth={i % 2 === 0 ? '2.5' : '1.5'} strokeLinecap="round" opacity={i % 2 === 0 ? 0.9 : 0.5} />
        );
      })}
      {/* Eclipse shadow — Rahu biting the sun */}
      <circle cx="38" cy="28" r="12" fill="#0a0520" opacity="0.85" />
      <circle cx="40" cy="26" r="8" fill="#0a0520" opacity="0.6" />
      {/* Warning dots */}
      <circle cx="12" cy="12" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="54" cy="50" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="52" cy="14" r="1.2" fill="#f0d48a" opacity="0.35" />
    </svg>
  );
}

/* 2. Choghadiya — Bold 8-segment dharma wheel */
function ChoghadiyaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ch1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.25" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
        <linearGradient id="ch1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#ch1g)" />
      <polygon
        points={Array.from({ length: 8 }, (_, i) => `${r2(32 + 27 * Math.cos((Math.PI * 2 * i) / 8 - Math.PI / 8))},${r2(32 + 27 * Math.sin((Math.PI * 2 * i) / 8 - Math.PI / 8))}`).join(' ')}
        fill="url(#ch1)" opacity="0.08" stroke="url(#ch1)" strokeWidth="2.5"
      />
      <polygon
        points={Array.from({ length: 8 }, (_, i) => `${r2(32 + 18 * Math.cos((Math.PI * 2 * i) / 8))},${r2(32 + 18 * Math.sin((Math.PI * 2 * i) / 8))}`).join(' ')}
        fill="url(#ch1)" opacity="0.12" stroke="url(#ch1)" strokeWidth="1.5"
      />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8;
        return <line key={i} x1={r2(32 + 6 * Math.cos(a))} y1={r2(32 + 6 * Math.sin(a))} x2={r2(32 + 27 * Math.cos(a))} y2={r2(32 + 27 * Math.sin(a))} stroke="url(#ch1)" strokeWidth="1.2" opacity="0.35" />;
      })}
      <circle cx="32" cy="32" r="6" fill="url(#ch1)" opacity="0.2" stroke="url(#ch1)" strokeWidth="2" />
      <circle cx="32" cy="32" r="2.5" fill="#f0d48a" opacity="0.7" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8;
        return <circle key={`d${i}`} cx={r2(32 + 22 * Math.cos(a))} cy={r2(32 + 22 * Math.sin(a))} r="1.5" fill="#f0d48a" opacity="0.5" />;
      })}
    </svg>
  );
}

/* 3. Hora — Planetary clock with 7 symbols */
function HoraSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ho1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
        <linearGradient id="ho1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#ho1g)" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#ho1)" strokeWidth="2.5" opacity="0.7" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="url(#ho1)" strokeWidth="1" opacity="0.3" />
      <circle cx="32" cy="32" r="15" fill="url(#ho1)" opacity="0.06" />
      {(['☉', '☽', '♂', '☿', '♃', '♀', '♄'] as const).map((sym, i) => {
        const a = (Math.PI * 2 * i) / 7 - Math.PI / 2;
        return <text key={i} x={r2(32 + 22 * Math.cos(a))} y={r2(32 + 22 * Math.sin(a) + 1.5)} textAnchor="middle" fill="#f0d48a" fontSize="5" opacity="0.75">{sym}</text>;
      })}
      <line x1="32" y1="32" x2="32" y2="12" stroke="url(#ho1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      <line x1="32" y1="32" x2="46" y2="28" stroke="url(#ho1)" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      <circle cx="32" cy="32" r="4" fill="url(#ho1)" opacity="0.3" stroke="url(#ho1)" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="1.5" fill="#f0d48a" opacity="0.8" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return <circle key={`t${i}`} cx={r2(32 + 26 * Math.cos(a))} cy={r2(32 + 26 * Math.sin(a))} r={i % 3 === 0 ? 1.2 : 0.6} fill="#f0d48a" opacity={i % 3 === 0 ? 0.6 : 0.3} />;
      })}
    </svg>
  );
}

/* 4. Dinacharya — Sun/Moon dual cycle */
function DinacharyaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="di1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0" /></radialGradient>
        <linearGradient id="di1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#di1g)" />
      {/* Dividing arc */}
      <path d="M 32 6 A 26 26 0 0 1 32 58" fill="url(#di1)" opacity="0.06" />
      <path d="M 32 6 A 26 26 0 0 0 32 58" fill="url(#di1)" opacity="0.12" />
      <line x1="32" y1="6" x2="32" y2="58" stroke="url(#di1)" strokeWidth="1" opacity="0.3" />
      {/* Sun (left) */}
      <circle cx="22" cy="28" r="8" fill="url(#di1)" opacity="0.2" stroke="url(#di1)" strokeWidth="2" />
      <circle cx="22" cy="28" r="4" fill="#f0d48a" opacity="0.5" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8;
        return <line key={i} x1={r2(22 + 10 * Math.cos(a))} y1={r2(28 + 10 * Math.sin(a))} x2={r2(22 + 14 * Math.cos(a))} y2={r2(28 + 14 * Math.sin(a))} stroke="url(#di1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />;
      })}
      {/* Moon (right) */}
      <path d="M 46 20 A 9 9 0 1 0 46 36 A 6 6 0 1 1 46 20" fill="url(#di1)" opacity="0.25" stroke="url(#di1)" strokeWidth="2" />
      {/* Stars around moon */}
      <circle cx="48" cy="18" r="1" fill="#f0d48a" opacity="0.5" />
      <circle cx="52" cy="24" r="0.7" fill="#f0d48a" opacity="0.35" />
      <circle cx="50" cy="38" r="0.8" fill="#f0d48a" opacity="0.4" />
      {/* Cycle arrow */}
      <path d="M 16 46 Q 32 54 48 46" fill="none" stroke="url(#di1)" strokeWidth="1.5" opacity="0.4" />
      <polygon points="48,46 46,42 50,44" fill="url(#di1)" opacity="0.5" />
    </svg>
  );
}

/* 5. Vedic Time — Hourglass with sand particles */
function VedicTimeSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="vt1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.25" /><stop offset="100%" stopColor="#fb923c" stopOpacity="0" /></radialGradient>
        <linearGradient id="vt1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#vt1g)" />
      {/* Hourglass frame */}
      <line x1="18" y1="8" x2="46" y2="8" stroke="url(#vt1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="18" y1="56" x2="46" y2="56" stroke="url(#vt1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      {/* Glass body */}
      <path d="M 20 10 L 30 30 L 20 50 L 44 50 L 34 30 L 44 10 Z" fill="url(#vt1)" opacity="0.08" stroke="url(#vt1)" strokeWidth="2" strokeLinejoin="round" />
      {/* Sand top */}
      <path d="M 24 14 L 32 26 L 40 14 Z" fill="url(#vt1)" opacity="0.2" />
      {/* Sand bottom */}
      <path d="M 26 46 L 38 46 L 32 38 Z" fill="url(#vt1)" opacity="0.25" />
      {/* Falling sand stream */}
      <line x1="32" y1="28" x2="32" y2="36" stroke="#f0d48a" strokeWidth="1.5" opacity="0.5" strokeDasharray="2 2" />
      {/* Sand particles */}
      <circle cx="30" cy="42" r="0.8" fill="#f0d48a" opacity="0.4" />
      <circle cx="34" cy="44" r="0.6" fill="#f0d48a" opacity="0.35" />
      <circle cx="32" cy="43" r="0.7" fill="#f0d48a" opacity="0.45" />
      <circle cx="28" cy="44" r="0.5" fill="#f0d48a" opacity="0.3" />
      <circle cx="36" cy="43" r="0.6" fill="#f0d48a" opacity="0.35" />
      {/* Decorative stars */}
      <circle cx="12" cy="16" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="52" cy="48" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="50" cy="12" r="1.2" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

/* 6. Rashi Calculator — Zodiac wheel with 12 marks */
function RashiCalcSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="rc1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.25" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
        <linearGradient id="rc1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#rc1g)" />
      {/* Outer ring */}
      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#rc1)" strokeWidth="2.5" opacity="0.6" />
      {/* Inner ring */}
      <circle cx="32" cy="32" r="18" fill="none" stroke="url(#rc1)" strokeWidth="1.5" opacity="0.35" />
      <circle cx="32" cy="32" r="18" fill="url(#rc1)" opacity="0.06" />
      {/* 12 division lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        return <line key={i} x1={r2(32 + 18 * Math.cos(a))} y1={r2(32 + 18 * Math.sin(a))} x2={r2(32 + 26 * Math.cos(a))} y2={r2(32 + 26 * Math.sin(a))} stroke="url(#rc1)" strokeWidth="1.5" opacity="0.5" />;
      })}
      {/* 12 sign markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * (i + 0.5)) / 12 - Math.PI / 2;
        return <circle key={`s${i}`} cx={r2(32 + 22 * Math.cos(a))} cy={r2(32 + 22 * Math.sin(a))} r="2" fill="url(#rc1)" opacity={0.3 + (i % 3) * 0.1} stroke="url(#rc1)" strokeWidth="0.8" />;
      })}
      {/* Center */}
      <circle cx="32" cy="32" r="6" fill="url(#rc1)" opacity="0.15" stroke="url(#rc1)" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="2.5" fill="#f0d48a" opacity="0.6" />
      {/* Pointer */}
      <line x1="32" y1="32" x2="32" y2="14" stroke="url(#rc1)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* 7. Sade Sati — Saturn with rings + "7.5" badge (from page.tsx, IDs renamed) */
function SadeSatiSVG() {
  return (
    <svg width={128} height={128} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="ss1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" /><stop offset="100%" stopColor="#1e3a5f" stopOpacity="0" /></radialGradient>
        <linearGradient id="ss1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#ss1g)" />
      <circle cx="32" cy="30" r="14" fill="url(#ss1)" opacity="0.7" stroke="#60a5fa" strokeWidth="2.5" />
      <circle cx="32" cy="30" r="8" fill="#93c5fd" opacity="0.3" />
      <ellipse cx="32" cy="30" rx="26" ry="8" stroke="#60a5fa" strokeWidth="3" opacity="0.7" transform="rotate(-15 32 30)" fill="none" />
      <ellipse cx="32" cy="30" rx="22" ry="6" stroke="#93c5fd" strokeWidth="2" opacity="0.4" transform="rotate(-15 32 30)" fill="none" />
      <text x="22" y="56" fill="#60a5fa" fontSize="14" fontWeight="bold" opacity="0.9" fontFamily="var(--font-cinzel)">7.5</text>
      <path d="M14 58 Q32 50 50 58" stroke="#60a5fa" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
}

/* 8. Kaal Sarpa — Serpentine axis through a chart */
function KaalSarpaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ks1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" /><stop offset="100%" stopColor="#f43f5e" stopOpacity="0" /></radialGradient>
        <linearGradient id="ks1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#ks1g)" />
      {/* Chart diamond */}
      <polygon points="32,6 58,32 32,58 6,32" fill="url(#ks1)" opacity="0.06" stroke="url(#ks1)" strokeWidth="2" />
      <polygon points="32,19 45,32 32,45 19,32" fill="url(#ks1)" opacity="0.08" stroke="url(#ks1)" strokeWidth="1" />
      {/* Serpent body — sinuous S-curve axis */}
      <path d="M 14 14 C 22 20, 26 28, 32 32 C 38 36, 42 44, 50 50" fill="none" stroke="url(#ks1)" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
      <path d="M 14 14 C 20 18, 24 26, 30 30" fill="none" stroke="#f0d48a" strokeWidth="1.5" opacity="0.3" />
      {/* Rahu head (top-left) */}
      <circle cx="14" cy="14" r="5" fill="url(#ks1)" opacity="0.3" stroke="url(#ks1)" strokeWidth="2" />
      <circle cx="13" cy="13" r="1.5" fill="#f0d48a" opacity="0.6" />
      {/* Ketu tail (bottom-right) */}
      <circle cx="50" cy="50" r="4" fill="url(#ks1)" opacity="0.25" stroke="url(#ks1)" strokeWidth="1.5" />
      <path d="M 52 52 L 56 56 M 52 54 L 56 50" stroke="url(#ks1)" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      {/* Stars */}
      <circle cx="48" cy="12" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="12" cy="50" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="50" cy="22" r="0.7" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* 9. Mangal Dosha — Mars symbol over heart */
function MangalDoshaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="md1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" /><stop offset="100%" stopColor="#f43f5e" stopOpacity="0" /></radialGradient>
        <linearGradient id="md1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#md1g)" />
      {/* Heart shape */}
      <path d="M 32 50 C 16 38 8 26 16 18 C 22 12 30 16 32 22 C 34 16 42 12 48 18 C 56 26 48 38 32 50 Z" fill="url(#md1)" opacity="0.12" stroke="url(#md1)" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Mars symbol ♂ — circle + arrow */}
      <circle cx="30" cy="30" r="8" fill="none" stroke="url(#md1)" strokeWidth="2.5" opacity="0.7" />
      <line x1="36" y1="24" x2="46" y2="14" stroke="url(#md1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <polyline points="40,14 46,14 46,20" fill="none" stroke="url(#md1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      {/* Glow center */}
      <circle cx="30" cy="30" r="3" fill="#f0d48a" opacity="0.4" />
      {/* Stars */}
      <circle cx="10" cy="12" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="54" cy="46" r="0.8" fill="#f0d48a" opacity="0.2" />
      <circle cx="14" cy="52" r="1.2" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

/* 10. Cosmic Blueprint — Nested rings with pentagram star */
function CosmicBlueprintSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="cb1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></radialGradient>
        <linearGradient id="cb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#cb1g)" />
      {/* Three nested rings */}
      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#cb1)" strokeWidth="2" opacity="0.5" />
      <circle cx="32" cy="32" r="19" fill="none" stroke="url(#cb1)" strokeWidth="1.5" opacity="0.35" />
      <circle cx="32" cy="32" r="12" fill="url(#cb1)" opacity="0.08" stroke="url(#cb1)" strokeWidth="1" />
      {/* Pentagram */}
      <polygon
        points={Array.from({ length: 5 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const j = (i * 2) % 5;
          const aa = (Math.PI * 2 * j) / 5 - Math.PI / 2;
          return `${r2(32 + 19 * Math.cos(aa))},${r2(32 + 19 * Math.sin(aa))}`;
        }).join(' ')}
        fill="url(#cb1)" opacity="0.1" stroke="url(#cb1)" strokeWidth="2" strokeLinejoin="round"
      />
      {/* Vertex dots */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        return <circle key={i} cx={r2(32 + 19 * Math.cos(a))} cy={r2(32 + 19 * Math.sin(a))} r="2" fill="#f0d48a" opacity="0.5" />;
      })}
      <circle cx="32" cy="32" r="4" fill="url(#cb1)" opacity="0.25" stroke="url(#cb1)" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="1.5" fill="#f0d48a" opacity="0.7" />
    </svg>
  );
}

/* 11. Prashna — Crystal ball with question energy */
function PrashnaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="pr1g" cx="50%" cy="45%" r="50%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
        <linearGradient id="pr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
        <radialGradient id="pr1s" cx="35%" cy="30%" r="50%"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.3" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#pr1g)" />
      {/* Crystal ball */}
      <circle cx="32" cy="28" r="18" fill="url(#pr1s)" stroke="url(#pr1)" strokeWidth="2.5" />
      <circle cx="32" cy="28" r="18" fill="url(#pr1)" opacity="0.06" />
      {/* Highlight */}
      <ellipse cx="26" cy="22" rx="5" ry="3" fill="#f0d48a" opacity="0.15" transform="rotate(-20 26 22)" />
      {/* Question mark */}
      <text x="32" y="34" textAnchor="middle" fill="#f0d48a" fontSize="18" fontWeight="bold" opacity="0.4" fontFamily="serif">?</text>
      {/* Base/stand */}
      <path d="M 22 46 Q 27 44 32 46 Q 37 44 42 46" fill="none" stroke="url(#pr1)" strokeWidth="2" opacity="0.5" />
      <line x1="24" y1="48" x2="40" y2="48" stroke="url(#pr1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      {/* Energy sparks */}
      <circle cx="16" cy="16" r="1.5" fill="#f0d48a" opacity="0.4" />
      <circle cx="48" cy="20" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="50" cy="38" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="14" cy="36" r="1.2" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

/* 12. Sarvatobhadra — Nested squares with diagonals */
function SarvatobhadraSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="sb1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" /><stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" /></radialGradient>
        <linearGradient id="sb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#sb1g)" />
      {/* Outer square */}
      <rect x="6" y="6" width="52" height="52" fill="url(#sb1)" opacity="0.06" stroke="url(#sb1)" strokeWidth="2.5" rx="1" />
      {/* Middle square */}
      <rect x="14" y="14" width="36" height="36" fill="url(#sb1)" opacity="0.08" stroke="url(#sb1)" strokeWidth="1.5" rx="1" />
      {/* Inner square */}
      <rect x="22" y="22" width="20" height="20" fill="url(#sb1)" opacity="0.1" stroke="url(#sb1)" strokeWidth="1" />
      {/* Diagonals */}
      <line x1="6" y1="6" x2="58" y2="58" stroke="url(#sb1)" strokeWidth="1.2" opacity="0.3" />
      <line x1="58" y1="6" x2="6" y2="58" stroke="url(#sb1)" strokeWidth="1.2" opacity="0.3" />
      {/* Cross */}
      <line x1="32" y1="6" x2="32" y2="58" stroke="url(#sb1)" strokeWidth="1" opacity="0.25" />
      <line x1="6" y1="32" x2="58" y2="32" stroke="url(#sb1)" strokeWidth="1" opacity="0.25" />
      {/* Corner dots */}
      {[[6, 6], [58, 6], [6, 58], [58, 58], [32, 6], [32, 58], [6, 32], [58, 32]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="#f0d48a" opacity="0.5" />
      ))}
      <circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="0.5" />
    </svg>
  );
}

/* 13. Medical Jyotish — Caduceus serpents on rod */
function MedicalSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="mj1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" /><stop offset="100%" stopColor="#ec4899" stopOpacity="0" /></radialGradient>
        <linearGradient id="mj1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#mj1g)" />
      {/* Central rod */}
      <line x1="32" y1="8" x2="32" y2="56" stroke="url(#mj1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      {/* Top orb */}
      <circle cx="32" cy="8" r="3" fill="url(#mj1)" opacity="0.35" stroke="url(#mj1)" strokeWidth="1.5" />
      {/* Wings */}
      <path d="M 28 12 Q 18 8 14 14 Q 18 12 26 14" fill="url(#mj1)" opacity="0.2" stroke="url(#mj1)" strokeWidth="1.5" />
      <path d="M 36 12 Q 46 8 50 14 Q 46 12 38 14" fill="url(#mj1)" opacity="0.2" stroke="url(#mj1)" strokeWidth="1.5" />
      {/* Left serpent */}
      <path d="M 32 16 C 20 20, 20 26, 32 30 C 20 34, 20 40, 32 44 C 20 48, 22 52, 28 52" fill="none" stroke="url(#mj1)" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      {/* Right serpent */}
      <path d="M 32 16 C 44 20, 44 26, 32 30 C 44 34, 44 40, 32 44 C 44 48, 42 52, 36 52" fill="none" stroke="url(#mj1)" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      {/* Crossing dots */}
      <circle cx="32" cy="30" r="2" fill="#f0d48a" opacity="0.5" />
      <circle cx="32" cy="44" r="2" fill="#f0d48a" opacity="0.4" />
      {/* Stars */}
      <circle cx="10" cy="24" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="54" cy="38" r="1" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

/* 14. Financial Jyotish — Ascending chart with planetary markers */
function FinancialSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="fj1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#34d399" stopOpacity="0.25" /><stop offset="100%" stopColor="#34d399" stopOpacity="0" /></radialGradient>
        <linearGradient id="fj1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#fj1g)" />
      {/* Grid lines */}
      {[20, 30, 40, 50].map((y) => (
        <line key={y} x1="8" y1={y} x2="56" y2={y} stroke="url(#fj1)" strokeWidth="0.5" opacity="0.15" />
      ))}
      {[16, 26, 36, 46].map((x) => (
        <line key={x} x1={x} y1="14" x2={x} y2="54" stroke="url(#fj1)" strokeWidth="0.5" opacity="0.15" />
      ))}
      {/* Chart line — ascending with dips */}
      <polyline points="10,48 18,42 24,44 30,34 36,28 42,30 48,18 54,12" fill="none" stroke="url(#fj1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      {/* Area fill */}
      <polygon points="10,48 18,42 24,44 30,34 36,28 42,30 48,18 54,12 54,52 10,52" fill="url(#fj1)" opacity="0.08" />
      {/* Planet markers */}
      <circle cx="18" cy="42" r="2.5" fill="url(#fj1)" opacity="0.4" stroke="url(#fj1)" strokeWidth="1.5" />
      <circle cx="30" cy="34" r="3" fill="url(#fj1)" opacity="0.45" stroke="url(#fj1)" strokeWidth="1.5" />
      <circle cx="42" cy="30" r="2.5" fill="url(#fj1)" opacity="0.4" stroke="url(#fj1)" strokeWidth="1.5" />
      <circle cx="54" cy="12" r="3" fill="#f0d48a" opacity="0.5" />
      {/* Stars */}
      <circle cx="8" cy="10" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="52" cy="46" r="0.7" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

/* 15. Mundane Jyotish — Globe with meridians */
function MundaneSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="mu1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.25" /><stop offset="100%" stopColor="#fb923c" stopOpacity="0" /></radialGradient>
        <linearGradient id="mu1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#mu1g)" />
      {/* Globe */}
      <circle cx="32" cy="32" r="22" fill="url(#mu1)" opacity="0.08" stroke="url(#mu1)" strokeWidth="2.5" />
      {/* Meridians */}
      <ellipse cx="32" cy="32" rx="10" ry="22" fill="none" stroke="url(#mu1)" strokeWidth="1" opacity="0.3" />
      <ellipse cx="32" cy="32" rx="18" ry="22" fill="none" stroke="url(#mu1)" strokeWidth="0.8" opacity="0.2" />
      {/* Parallels */}
      <ellipse cx="32" cy="22" rx="20" ry="5" fill="none" stroke="url(#mu1)" strokeWidth="0.8" opacity="0.25" />
      <ellipse cx="32" cy="32" rx="22" ry="6" fill="none" stroke="url(#mu1)" strokeWidth="1" opacity="0.3" />
      <ellipse cx="32" cy="42" rx="20" ry="5" fill="none" stroke="url(#mu1)" strokeWidth="0.8" opacity="0.25" />
      {/* Planetary aspect lines */}
      <line x1="8" y1="14" x2="32" y2="10" stroke="url(#mu1)" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 2" />
      <line x1="56" y1="18" x2="40" y2="14" stroke="url(#mu1)" strokeWidth="1.5" opacity="0.35" strokeDasharray="3 2" />
      <line x1="10" y1="50" x2="24" y2="50" stroke="url(#mu1)" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 2" />
      {/* Planet dots */}
      <circle cx="8" cy="14" r="2.5" fill="url(#mu1)" opacity="0.45" stroke="url(#mu1)" strokeWidth="1.5" />
      <circle cx="56" cy="18" r="2" fill="url(#mu1)" opacity="0.4" stroke="url(#mu1)" strokeWidth="1" />
      <circle cx="10" cy="50" r="1.8" fill="url(#mu1)" opacity="0.35" stroke="url(#mu1)" strokeWidth="1" />
    </svg>
  );
}

/* 16. Baby Names — Book/scroll with Devanagari अ */
function BabyNamesSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="bn1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.25" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
        <linearGradient id="bn1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#bn1g)" />
      {/* Open book */}
      <path d="M 32 14 L 32 52" stroke="url(#bn1)" strokeWidth="1.5" opacity="0.4" />
      <path d="M 32 14 C 28 16, 14 14, 10 16 L 10 50 C 14 48, 28 50, 32 52" fill="url(#bn1)" opacity="0.08" stroke="url(#bn1)" strokeWidth="2" />
      <path d="M 32 14 C 36 16, 50 14, 54 16 L 54 50 C 50 48, 36 50, 32 52" fill="url(#bn1)" opacity="0.1" stroke="url(#bn1)" strokeWidth="2" />
      {/* Lines on pages */}
      {[24, 28, 32, 36].map((y) => (
        <line key={`l${y}`} x1="15" y1={y} x2="28" y2={y + 1} stroke="url(#bn1)" strokeWidth="0.8" opacity="0.2" />
      ))}
      {[24, 28, 32, 36].map((y) => (
        <line key={`r${y}`} x1="36" y1={y + 1} x2="49" y2={y} stroke="url(#bn1)" strokeWidth="0.8" opacity="0.2" />
      ))}
      {/* Devanagari अ */}
      <text x="40" y="30" textAnchor="middle" fill="#f0d48a" fontSize="16" fontWeight="bold" opacity="0.5">अ</text>
      {/* Stars */}
      <circle cx="8" cy="10" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="56" cy="12" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="54" cy="56" r="1.2" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

/* 17. Kaal Nirnaya — Compass/clock with directional pointer */
function KaalNirnayaSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="kn1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
        <linearGradient id="kn1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#kn1g)" />
      {/* Outer ring */}
      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#kn1)" strokeWidth="2.5" opacity="0.6" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="url(#kn1)" strokeWidth="1" opacity="0.25" />
      {/* Cardinal marks */}
      {Array.from({ length: 4 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 4 - Math.PI / 2;
        return <line key={i} x1={r2(32 + 22 * Math.cos(a))} y1={r2(32 + 22 * Math.sin(a))} x2={r2(32 + 26 * Math.cos(a))} y2={r2(32 + 26 * Math.sin(a))} stroke="url(#kn1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />;
      })}
      {/* Minor marks */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * (i + 0.5)) / 4 - Math.PI / 2;
        return <line key={`m${i}`} x1={r2(32 + 23 * Math.cos(a))} y1={r2(32 + 23 * Math.sin(a))} x2={r2(32 + 26 * Math.cos(a))} y2={r2(32 + 26 * Math.sin(a))} stroke="url(#kn1)" strokeWidth="1" opacity="0.35" />;
      })}
      {/* Compass needle — north-pointing */}
      <polygon points="32,8 35,30 32,32 29,30" fill="url(#kn1)" opacity="0.6" stroke="url(#kn1)" strokeWidth="1.5" />
      <polygon points="32,56 29,34 32,32 35,34" fill="url(#kn1)" opacity="0.25" stroke="url(#kn1)" strokeWidth="1" />
      <circle cx="32" cy="32" r="4" fill="url(#kn1)" opacity="0.2" stroke="url(#kn1)" strokeWidth="2" />
      <circle cx="32" cy="32" r="1.5" fill="#f0d48a" opacity="0.7" />
      {/* Stars */}
      <circle cx="10" cy="10" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="54" cy="54" r="1" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

/* 18. Nadi Jyotish — Palm leaf with veins */
function NadiSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="nj1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" /><stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" /></radialGradient>
        <linearGradient id="nj1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#nj1g)" />
      {/* Palm leaf — pointed oval */}
      <ellipse cx="32" cy="30" rx="14" ry="24" fill="url(#nj1)" opacity="0.1" stroke="url(#nj1)" strokeWidth="2.5" transform="rotate(-10 32 30)" />
      {/* Central vein */}
      <line x1="32" y1="8" x2="32" y2="52" stroke="url(#nj1)" strokeWidth="2" opacity="0.5" transform="rotate(-10 32 30)" />
      {/* Side veins */}
      {[-18, -10, -2, 6, 14].map((dy, i) => (
        <g key={i} transform="rotate(-10 32 30)">
          <line x1="32" y1={30 + dy} x2={20} y2={26 + dy} stroke="url(#nj1)" strokeWidth="1" opacity={0.3 - i * 0.02} />
          <line x1="32" y1={30 + dy} x2={44} y2={26 + dy} stroke="url(#nj1)" strokeWidth="1" opacity={0.3 - i * 0.02} />
        </g>
      ))}
      {/* Script marks */}
      {[16, 22, 28, 34].map((y) => (
        <line key={y} x1="26" y1={y} x2="30" y2={y} stroke="#f0d48a" strokeWidth="1" opacity="0.25" transform="rotate(-10 32 30)" />
      ))}
      {/* Stars */}
      <circle cx="8" cy="14" r="1" fill="#f0d48a" opacity="0.3" />
      <circle cx="56" cy="48" r="0.8" fill="#f0d48a" opacity="0.25" />
      <circle cx="52" cy="10" r="1.2" fill="#f0d48a" opacity="0.3" />
    </svg>
  );
}

/* 19. Lunar Calendar — 5 moon phases in an arc */
function LunarCalendarSVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="lc1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.2" /><stop offset="100%" stopColor="#d4a853" stopOpacity="0" /></radialGradient>
        <linearGradient id="lc1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#lc1g)" />
      {/* Arc path */}
      <path d="M 6,40 Q 16,20 32,16 Q 48,20 58,40" fill="none" stroke="url(#lc1)" strokeWidth="1" opacity="0.25" />
      {/* New moon (empty) */}
      <circle cx="10" cy="36" r="5" fill="none" stroke="url(#lc1)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="10" cy="36" r="5" fill="url(#lc1)" opacity="0.05" />
      {/* Waxing crescent */}
      <circle cx="22" cy="26" r="6" fill="none" stroke="url(#lc1)" strokeWidth="1.8" opacity="0.55" />
      <path d="M 22,20 A 6,6 0 0,1 22,32 A 3,6 0 0,0 22,20" fill="url(#lc1)" opacity="0.25" />
      {/* Half moon */}
      <circle cx="34" cy="22" r="7" fill="none" stroke="url(#lc1)" strokeWidth="2" opacity="0.7" />
      <path d="M 34,15 A 7,7 0 0,1 34,29 A 2,7 0 0,0 34,15" fill="url(#lc1)" opacity="0.3" />
      {/* Waxing gibbous */}
      <circle cx="46" cy="28" r="6" fill="none" stroke="url(#lc1)" strokeWidth="1.8" opacity="0.6" />
      <path d="M 46,22 A 6,6 0 0,1 46,34 A 1,6 0 0,0 46,22" fill="url(#lc1)" opacity="0.35" />
      {/* Full moon */}
      <circle cx="56" cy="36" r="5" fill="url(#lc1)" opacity="0.35" stroke="url(#lc1)" strokeWidth="2" />
      <circle cx="56" cy="36" r="2" fill="#f0d48a" opacity="0.5" />
      {/* Stars */}
      {[[14, 48, 0.6], [28, 44, 0.8], [42, 46, 0.7], [52, 48, 0.5], [8, 46, 0.4]].map(([cx, cy, rr], i) => (
        <circle key={i} cx={cx} cy={cy} r={rr} fill="#f0d48a" opacity={0.2 + i * 0.04} />
      ))}
    </svg>
  );
}

/* 20. Live Sky — Constellation map with connected stars */
function LiveSkySVG() {
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true">
      <defs>
        <radialGradient id="ls1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" /><stop offset="100%" stopColor="#38bdf8" stopOpacity="0" /></radialGradient>
        <linearGradient id="ls1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#ls1g)" />
      {/* Background glow circles */}
      {[[8, 12], [14, 28], [18, 48], [30, 16], [32, 38], [46, 12], [50, 30], [54, 48], [38, 54]].map(([cx, cy], i) => (
        <circle key={`bg${i}`} cx={cx} cy={cy} r="5" fill="url(#ls1)" opacity="0.04" />
      ))}
      {/* Constellation lines */}
      <line x1="30" y1="16" x2="46" y2="12" stroke="url(#ls1)" strokeWidth="1.2" opacity="0.4" />
      <line x1="30" y1="16" x2="14" y2="28" stroke="url(#ls1)" strokeWidth="1.2" opacity="0.35" />
      <line x1="14" y1="28" x2="18" y2="48" stroke="url(#ls1)" strokeWidth="1" opacity="0.3" />
      <line x1="46" y1="12" x2="50" y2="30" stroke="url(#ls1)" strokeWidth="1.2" opacity="0.4" />
      <line x1="50" y1="30" x2="54" y2="48" stroke="url(#ls1)" strokeWidth="1" opacity="0.3" />
      <line x1="50" y1="30" x2="32" y2="38" stroke="url(#ls1)" strokeWidth="1" opacity="0.35" />
      <line x1="32" y1="38" x2="14" y2="28" stroke="url(#ls1)" strokeWidth="1" opacity="0.3" />
      <line x1="32" y1="38" x2="38" y2="54" stroke="url(#ls1)" strokeWidth="0.8" opacity="0.25" />
      <line x1="18" y1="48" x2="38" y2="54" stroke="url(#ls1)" strokeWidth="0.8" opacity="0.2" />
      {/* Stars at constellation vertices */}
      <circle cx="30" cy="16" r="3.5" fill="url(#ls1)" opacity="0.5" stroke="url(#ls1)" strokeWidth="1.5" />
      <circle cx="46" cy="12" r="3" fill="url(#ls1)" opacity="0.45" stroke="url(#ls1)" strokeWidth="1.5" />
      <circle cx="14" cy="28" r="2.8" fill="url(#ls1)" opacity="0.4" stroke="url(#ls1)" strokeWidth="1.2" />
      <circle cx="50" cy="30" r="3.2" fill="url(#ls1)" opacity="0.45" stroke="url(#ls1)" strokeWidth="1.5" />
      <circle cx="32" cy="38" r="3.8" fill="url(#ls1)" opacity="0.55" stroke="url(#ls1)" strokeWidth="1.8" />
      <circle cx="18" cy="48" r="2.5" fill="url(#ls1)" opacity="0.35" stroke="url(#ls1)" strokeWidth="1" />
      <circle cx="54" cy="48" r="2.2" fill="url(#ls1)" opacity="0.3" stroke="url(#ls1)" strokeWidth="1" />
      <circle cx="38" cy="54" r="2" fill="url(#ls1)" opacity="0.3" stroke="url(#ls1)" strokeWidth="0.8" />
      <circle cx="8" cy="12" r="1.5" fill="url(#ls1)" opacity="0.2" />
      {/* Scattered tiny stars */}
      {[[5, 42, 0.5], [56, 8, 0.7], [24, 58, 0.4], [48, 56, 0.6], [6, 56, 0.5], [58, 20, 0.8], [40, 6, 0.6], [20, 8, 0.4]].map(([cx, cy, rr], i) => (
        <circle key={`s${i}`} cx={cx} cy={cy} r={rr} fill="#f0d48a" opacity={0.15 + i * 0.02} />
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DATA: 4 rows × 5 cards
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
      label: isDevanagari ? 'दैनिक समय' : 'Daily Timing',
      cards: [
        { href: '/rahu-kaal', title: 'Rahu Kaal', subtitle: 'Inauspicious Period', description: 'Daily inauspicious window', glowColor: '#ef4444', svg: <RahuKaalSVG /> },
        { href: '/choghadiya', title: 'Choghadiya', subtitle: '8-fold Day & Night', description: 'Shubh \u00b7 Labh \u00b7 Amrit', glowColor: '#d4a853', svg: <ChoghadiyaSVG /> },
        { href: '/hora', title: 'Hora', subtitle: 'Planetary Hours', description: '24-hour planetary cycle', glowColor: '#8b5cf6', svg: <HoraSVG /> },
        { href: '/dinacharya', title: 'Dinacharya', subtitle: 'Ayurvedic Routine', description: 'Dosha \u00b7 Prahara \u00b7 Routine', glowColor: '#22d3ee', svg: <DinacharyaSVG /> },
        { href: '/vedic-time', title: 'Vedic Time', subtitle: 'Ancient Time Units', description: 'Ghati \u00b7 Pala \u00b7 Vipala', glowColor: '#fb923c', svg: <VedicTimeSVG /> },
      ],
    },
    {
      label: isDevanagari ? 'कुण्डली एवं दोष' : 'Chart & Doshas',
      cards: [
        { href: '/sign-calculator', title: 'Rashi Calculator', subtitle: 'Sign \u00b7 Tropical \u00b7 Shift', description: 'Find your Vedic sign', glowColor: '#d4a853', svg: <RashiCalcSVG /> },
        { href: '/sade-sati', title: 'Sade Sati', subtitle: "Saturn\u2019s 7\u00bd Year Transit", description: 'Saturn over your Moon', glowColor: '#60a5fa', svg: <SadeSatiSVG /> },
        { href: '/kaal-sarp', title: 'Kaal Sarpa', subtitle: 'Rahu-Ketu Axis Dosha', description: '12 serpent formations', glowColor: '#f43f5e', svg: <KaalSarpaSVG /> },
        { href: '/mangal-dosha', title: 'Mangal Dosha', subtitle: 'Mars Affliction', description: 'Marriage compatibility check', glowColor: '#f43f5e', svg: <MangalDoshaSVG /> },
        { href: '/cosmic-blueprint', title: 'Cosmic Blueprint', subtitle: 'Celestial Signature', description: 'Your celestial DNA', glowColor: '#6366f1', svg: <CosmicBlueprintSVG /> },
      ],
    },
    {
      label: isDevanagari ? 'प्रश्न एवं विशेष' : 'Divination & Specialized',
      cards: [
        { href: '/prashna', title: 'Prashna', subtitle: 'Horary + Ashtamangala', description: 'Ask the stars a question', glowColor: '#8b5cf6', svg: <PrashnaSVG /> },
        { href: '/sarvatobhadra', title: 'Sarvatobhadra', subtitle: '28-Nakshatra Chakra', description: 'Vedic transit analysis', glowColor: '#2dd4bf', svg: <SarvatobhadraSVG /> },
        { href: '/medical-astrology', title: 'Medical Jyotish', subtitle: 'Health & Planets', description: 'Body \u00b7 Planet \u00b7 Disease links', glowColor: '#ec4899', svg: <MedicalSVG /> },
        { href: '/financial-astrology', title: 'Financial Jyotish', subtitle: 'Markets & Cycles', description: 'Planetary market cycles', glowColor: '#34d399', svg: <FinancialSVG /> },
        { href: '/mundane', title: 'Mundane Jyotish', subtitle: 'World Events', description: 'Nations \u00b7 Weather \u00b7 Fate', glowColor: '#fb923c', svg: <MundaneSVG /> },
      ],
    },
    {
      label: isDevanagari ? 'जीवन एवं आकाश' : 'Life Events & Sky',
      cards: [
        { href: '/baby-names', title: 'Baby Names', subtitle: 'Nakshatra Syllables', description: 'Names by birth nakshatra', glowColor: '#d4a853', svg: <BabyNamesSVG /> },
        { href: '/kaal-nirnaya', title: 'Kaal Nirnaya', subtitle: 'Auspicious Timing', description: 'Right time for everything', glowColor: '#8b5cf6', svg: <KaalNirnayaSVG /> },
        { href: '/nadi-jyotish', title: 'Nadi Jyotish', subtitle: 'Palm-Leaf Traditions', description: 'Ancient leaf inscriptions', glowColor: '#2dd4bf', svg: <NadiSVG /> },
        { href: '/lunar-calendar', title: 'Lunar Calendar', subtitle: 'Tithi \u00b7 Masa \u00b7 Paksha', description: 'Moon phase panchang', glowColor: '#d4a853', svg: <LunarCalendarSVG /> },
        { href: '/sky', title: 'Live Sky', subtitle: 'Real-time Positions', description: 'Graha positions now', glowColor: '#38bdf8', svg: <LiveSkySVG /> },
      ],
    },
  ];
}

/* ════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function ToolsPage() {
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
          {isDevanagari ? 'ज्योतिष उपकरण' : 'Jyotish Tools'}
        </h1>
        <p className="text-text-secondary text-sm">
          {isDevanagari
            ? '20 शक्तिशाली वैदिक ज्योतिष गणक — अपना कार्ड चुनें'
            : '20 powerful Vedic astrology calculators — pick your card'}
        </p>
      </motion.div>

      {/* 4 rows */}
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx}>
          <div className="text-gold-dark text-[11px] uppercase tracking-[3px] font-semibold mt-8 mb-3 ml-1">
            {row.label}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 auto-rows-fr mb-2">
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
        <AdUnit slot="tools-bottom" />
      </div>
      <ShareRow pageTitle="Jyotish Tools" locale={locale} />
    </div>
  );
}
