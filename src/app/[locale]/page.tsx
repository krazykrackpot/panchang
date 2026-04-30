import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import TarotCard from '@/components/ui/TarotCard';
import AdUnit from '@/components/ads/AdUnit';
import HomeClientWidgets from '@/components/home/HomeClientWidgets';
import ProfileBanner from '@/components/home/ProfileBanner';
import { getHeadingFont, getBodyFont, isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { PanchangData } from '@/types/panchang';

// ─── Locale text helper ───
function L(texts: { en: string; hi: string; sa?: string; ta?: string; te?: string; bn?: string; kn?: string; mr?: string; gu?: string; mai?: string }, locale: string): string {
  if (locale === 'mr' && texts.mr) return texts.mr;
  if (locale === 'gu' && texts.gu) return texts.gu;
  if (locale === 'mai' && texts.mai) return texts.mai;
  if (locale === 'te' && texts.te) return texts.te;
  if (locale === 'bn' && texts.bn) return texts.bn;
  if (locale === 'kn' && texts.kn) return texts.kn;
  if (locale === 'ta' && texts.ta) return texts.ta;
  if (locale === 'sa' && texts.sa) return texts.sa;
  // Devanagari locales (hi/sa/mr/mai) fall back to Hindi text
  if (isDevanagariLocale(locale) || locale === 'mr' || locale === 'mai') return texts.hi;
  return texts.en;
}

// ─── Bold Pillar Icons with gold gradients + glow ───
function PanchangPillarIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="50%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
        <filter id="pg1g"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d="M20 38 Q40 8 60 38" stroke="url(#pg1)" strokeWidth="2.5" fill="none" filter="url(#pg1g)" />
      {[0,1,2,3,4].map(i => {
        const angle = -140 + i * 35;
        const r = angle * Math.PI / 180;
        return <line key={i} x1={40 + 16 * Math.cos(r)} y1={30 + 16 * Math.sin(r)} x2={40 + 24 * Math.cos(r)} y2={30 + 24 * Math.sin(r)} stroke="#f0d48a" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />;
      })}
      <circle cx="40" cy="30" r="10" fill="url(#pg1)" opacity={0.15} />
      <circle cx="40" cy="30" r="6" fill="url(#pg1)" opacity={0.3} />
      <circle cx="40" cy="30" r="2.5" fill="#f0d48a" />
      <line x1="10" y1="42" x2="70" y2="42" stroke="#d4a853" strokeWidth="1" opacity={0.3} />
      <circle cx="58" cy="56" r="10" fill="none" stroke="url(#pg1)" strokeWidth="1.5" opacity={0.4} />
      <circle cx="62" cy="52" r="8" fill="#0a0e27" />
      <circle cx="18" cy="54" r="1.5" fill="#f0d48a" opacity={0.5} />
      <circle cx="28" cy="62" r="1" fill="#d4a853" opacity={0.4} />
      <circle cx="48" cy="68" r="1.2" fill="#f0d48a" opacity={0.3} />
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={18 + i * 7} y={72} width={4} height={2} rx={1} fill="#d4a853" opacity={i === 3 ? 0.8 : 0.15} />
      ))}
    </svg>
  );
}

function KundaliPillarIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="kg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <filter id="kg1g"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="12" y="12" width="56" height="56" rx="2" stroke="url(#kg1)" strokeWidth="2" fill="none" filter="url(#kg1g)" />
      <line x1="12" y1="12" x2="68" y2="68" stroke="#60a5fa" strokeWidth="1" opacity={0.3} />
      <line x1="68" y1="12" x2="12" y2="68" stroke="#60a5fa" strokeWidth="1" opacity={0.3} />
      <line x1="40" y1="12" x2="40" y2="68" stroke="#60a5fa" strokeWidth="0.8" opacity={0.2} />
      <line x1="12" y1="40" x2="68" y2="40" stroke="#60a5fa" strokeWidth="0.8" opacity={0.2} />
      <path d="M40 22 L58 40 L40 58 L22 40Z" stroke="#60a5fa" strokeWidth="1.5" fill="rgba(96,165,250,0.05)" />
      <circle cx="26" cy="22" r="4" fill="#60a5fa" opacity={0.15} />
      <circle cx="26" cy="22" r="2" fill="#93c5fd" filter="url(#kg1g)" />
      <circle cx="54" cy="18" r="3" fill="#60a5fa" opacity={0.12} />
      <circle cx="54" cy="18" r="1.5" fill="#93c5fd" />
      <circle cx="62" cy="34" r="3.5" fill="#60a5fa" opacity={0.12} />
      <circle cx="62" cy="34" r="1.8" fill="#93c5fd" />
      <circle cx="48" cy="52" r="3" fill="#2563eb" opacity={0.15} />
      <circle cx="48" cy="52" r="1.5" fill="#60a5fa" />
      <circle cx="18" cy="48" r="2.5" fill="#60a5fa" opacity={0.1} />
      <circle cx="18" cy="48" r="1.2" fill="#93c5fd" />
      <path d="M40 14 L43 20 L37 20Z" fill="#93c5fd" opacity={0.7} />
      <text x="36" y="43" fill="#60a5fa" fontSize="7" fontWeight="bold" opacity={0.4}>La</text>
    </svg>
  );
}

function JyotishPillarIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="jg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <filter id="jg1g"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d="M12 20 Q12 16 20 16 L38 16 Q40 16 40 18 L40 62 Q40 64 38 64 L20 64 Q12 64 12 60Z" stroke="url(#jg1)" strokeWidth="1.5" fill="rgba(245,158,11,0.04)" />
      <path d="M68 20 Q68 16 60 16 L42 16 Q40 16 40 18 L40 62 Q40 64 42 64 L60 64 Q68 64 68 60Z" stroke="url(#jg1)" strokeWidth="1.5" fill="rgba(245,158,11,0.04)" />
      <line x1="40" y1="16" x2="40" y2="64" stroke="#f59e0b" strokeWidth="1.5" opacity={0.4} />
      {[0,1,2,3,4,5].map(i => (
        <line key={`l${i}`} x1="18" y1={26 + i * 7} x2={32 - i * 1.5} y2={26 + i * 7} stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity={0.15 + i * 0.03} />
      ))}
      <text x="46" y="38" fill="url(#jg1)" fontSize="18" fontWeight="bold" opacity={0.5} filter="url(#jg1g)">&#x0950;</text>
      <circle cx="8" cy="14" r="1.5" fill="#fcd34d" opacity={0.4} />
      <circle cx="72" cy="12" r="2" fill="#f59e0b" opacity={0.3} />
      <circle cx="74" cy="52" r="1.5" fill="#fcd34d" opacity={0.25} />
      <circle cx="6" cy="56" r="1" fill="#f59e0b" opacity={0.3} />
      <path d="M40 6 Q42 2 40 0 Q38 2 36 6 Q38 8 40 6Z" fill="#fcd34d" opacity={0.5} />
      <path d="M40 10 Q43 4 40 0 Q37 4 34 10 Q37 12 40 10Z" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity={0.3} />
    </svg>
  );
}

// Dramatic custom SVG icons for hero cards (128px, bold tarot style)
function KundaliSVG() {
  // North Indian diamond chart — bold strokes, filled houses, planet dots
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hk1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f0d48a" /><stop offset="100%" stopColor="#d4a853" /></linearGradient>
        <radialGradient id="hk1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.3" /><stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hk1g)" />
      {/* Outer square */}
      <rect x="4" y="4" width="56" height="56" rx="2" stroke="#f0d48a" strokeWidth="3" opacity="0.85" />
      {/* Inner diamond */}
      <polygon points="32,4 60,32 32,60 4,32" stroke="#f0d48a" strokeWidth="2.5" fill="#f0d48a" fillOpacity="0.08" />
      {/* Cross lines */}
      <line x1="32" y1="4" x2="32" y2="60" stroke="#f0d48a" strokeWidth="2" opacity="0.5" />
      <line x1="4" y1="32" x2="60" y2="32" stroke="#f0d48a" strokeWidth="2" opacity="0.5" />
      {/* Diagonal lines */}
      <line x1="4" y1="4" x2="60" y2="60" stroke="#f0d48a" strokeWidth="1.5" opacity="0.35" />
      <line x1="60" y1="4" x2="4" y2="60" stroke="#f0d48a" strokeWidth="1.5" opacity="0.35" />
      {/* Planet dots — bold, scattered in houses */}
      <circle cx="20" cy="14" r="4" fill="url(#hk1)" opacity="0.9" />
      <circle cx="50" cy="12" r="3.5" fill="#d4a853" opacity="0.8" />
      <circle cx="14" cy="48" r="3" fill="#f0d48a" opacity="0.7" />
      <circle cx="46" cy="46" r="3.5" fill="url(#hk1)" opacity="0.75" />
      <circle cx="32" cy="32" r="5" fill="url(#hk1)" opacity="0.85" />
      <circle cx="32" cy="32" r="2.5" fill="#f0d48a" opacity="1" />
    </svg>
  );
}

function MuhurtaSVG() {
  // Auspicious star with clock — bold pentagram + thick hour markers
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hm1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4ade80" /><stop offset="100%" stopColor="#22c55e" /></linearGradient>
        <radialGradient id="hm1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" /><stop offset="100%" stopColor="#166534" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hm1g)" />
      {/* Outer ring — thick */}
      <circle cx="32" cy="32" r="30" stroke="#4ade80" strokeWidth="2.5" opacity="0.7" />
      {/* 12 hour markers — bold ticks */}
      {Array.from({ length: 12 }, (_, i) => { const a = (Math.PI * 2 * i) / 12 - Math.PI / 2; return <line key={i} x1={32 + 24 * Math.cos(a)} y1={32 + 24 * Math.sin(a)} x2={32 + 30 * Math.cos(a)} y2={32 + 30 * Math.sin(a)} stroke="#4ade80" strokeWidth={i % 3 === 0 ? 3.5 : 2} strokeLinecap="round" opacity={i % 3 === 0 ? 0.9 : 0.5} />; })}
      {/* Bold 5-pointed star */}
      <polygon points="32,6 38,24 56,24 42,34 47,52 32,42 17,52 22,34 8,24 26,24" stroke="#4ade80" strokeWidth="2.5" fill="#4ade80" fillOpacity="0.2" strokeLinejoin="round" />
      {/* Inner star */}
      <polygon points="32,16 36,28 48,28 38,36 42,46 32,38 22,46 26,36 16,28 28,28" fill="#4ade80" fillOpacity="0.15" />
      {/* Bright center */}
      <circle cx="32" cy="32" r="5" fill="url(#hm1)" opacity="0.85" />
      <circle cx="32" cy="32" r="2.5" fill="#4ade80" opacity="1" />
    </svg>
  );
}

function CalendarSVG() {
  // Sacred fire altar (Havan Kund) — pyramid fire with festival garland
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hc1" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stopColor="#ea580c" /><stop offset="40%" stopColor="#fb923c" /><stop offset="100%" stopColor="#fbbf24" /></linearGradient>
        <radialGradient id="hc1g" cx="50%" cy="55%" r="50%"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.35" /><stop offset="100%" stopColor="#7c2d12" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="36" r="31" fill="url(#hc1g)" />
      {/* Festival garland arc — draped at top with hanging tassels */}
      <path d="M6 14 Q18 22 32 14 Q46 22 58 14" stroke="#fb923c" strokeWidth="2.5" fill="none" opacity="0.7" />
      <path d="M6 14 Q18 24 32 16 Q46 24 58 14" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Tassels hanging from garland */}
      {[12, 22, 32, 42, 52].map(x => <line key={x} x1={x} y1={x === 32 ? 14 : 18} x2={x} y2={x === 32 ? 20 : 24} stroke="#fb923c" strokeWidth="2" strokeLinecap="round" opacity="0.6" />)}
      {/* Sacred fire — large, dramatic, 3 layers */}
      <path d="M32 18 C24 28, 14 36, 14 46 C14 54, 22 58, 32 58 C42 58, 50 54, 50 46 C50 36, 40 28, 32 18Z" fill="url(#hc1)" fillOpacity="0.6" stroke="#fbbf24" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 26 C28 32, 20 38, 20 46 C20 52, 26 56, 32 56 C38 56, 44 52, 44 46 C44 38, 36 32, 32 26Z" fill="#fbbf24" fillOpacity="0.4" />
      <path d="M32 34 C30 38, 26 42, 26 46 C26 50, 28 52, 32 52 C36 52, 38 50, 38 46 C38 42, 34 38, 32 34Z" fill="#fbbf24" fillOpacity="0.65" />
      {/* Bright core */}
      <ellipse cx="32" cy="48" rx="4" ry="5" fill="#fbbf24" opacity="0.9" />
      <ellipse cx="32" cy="49" rx="2" ry="3" fill="#fef3c7" opacity="1" />
      {/* Base platform — altar */}
      <rect x="10" y="58" width="44" height="4" rx="1" fill="#fb923c" fillOpacity="0.5" stroke="#fb923c" strokeWidth="2" />
      {/* Sparkle dots */}
      <circle cx="12" cy="8" r="1.5" fill="#fbbf24" opacity="0.7" />
      <circle cx="52" cy="10" r="1.5" fill="#fbbf24" opacity="0.6" />
      <circle cx="32" cy="6" r="2" fill="#fbbf24" opacity="0.8" />
    </svg>
  );
}

function TithiGridSVG() {
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="tg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c084fc" /><stop offset="50%" stopColor="#a855f7" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient>
        <radialGradient id="tg1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0" /></radialGradient>
        <radialGradient id="tg1m" cx="40%" cy="40%"><stop offset="0%" stopColor="#fff8e1" /><stop offset="100%" stopColor="#f0d48a" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#tg1g)" />
      {/* Calendar frame */}
      <rect x="8" y="14" width="48" height="42" rx="4" fill="none" stroke="url(#tg1)" strokeWidth="2" opacity="0.5" />
      <rect x="8" y="14" width="48" height="9" rx="4" fill="url(#tg1)" opacity="0.15" />
      {/* Binding rings */}
      <circle cx="20" cy="14" r="2.5" fill="none" stroke="url(#tg1)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="44" cy="14" r="2.5" fill="none" stroke="url(#tg1)" strokeWidth="1.5" opacity="0.5" />
      {/* Grid 5x4 */}
      {[0,1,2,3].map(r => [0,1,2,3,4].map(c => (
        <rect key={`${r}-${c}`} x={12 + c * 9} y={27 + r * 7} width="7" height="5.5" rx="1" fill="url(#tg1)" opacity={0.06} stroke="url(#tg1)" strokeWidth="0.3" strokeOpacity="0.2" />
      )))}
      {/* Full moon — glowing gold circle */}
      <circle cx="39" cy="30" r="2.2" fill="url(#tg1m)" />
      <circle cx="39" cy="30" r="3.5" fill="none" stroke="#f0d48a" strokeWidth="0.5" opacity="0.3" />
      {/* New moon — dark circle */}
      <circle cx="21" cy="37.5" r="2" fill="#1a1040" stroke="#c084fc" strokeWidth="0.5" opacity="0.6" />
      {/* Half moon */}
      <circle cx="30" cy="44.5" r="1.8" fill="#1a1040" stroke="#c084fc" strokeWidth="0.4" />
      <rect x="30" y="42.7" width="2" height="3.6" rx="0.5" fill="#f0d48a" opacity="0.7" />
      {/* Festival star */}
      <polygon points="48,35 49,37 51,37 49.5,38.5 50,40.5 48,39.2 46,40.5 46.5,38.5 45,37 47,37" fill="#f0d48a" opacity="0.6" />
      {/* Ekadashi highlight */}
      <rect x="12" y="34" width="7" height="5.5" rx="1" fill="#34d399" opacity="0.15" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.4" />
    </svg>
  );
}

function TransitSVG() {
  // Gochar — dramatic Scorpio-like constellation with a planet transiting through it
  // Bold stars connected by thick lines, a glowing planet moving along the path
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ht1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
        <radialGradient id="ht1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" /><stop offset="100%" stopColor="#1e3a5f" stopOpacity="0" /></radialGradient>
        <radialGradient id="ht1p" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" /><stop offset="100%" stopColor="#f59e0b" stopOpacity="0" /></radialGradient>
      </defs>
      {/* Deep space background glow */}
      <circle cx="32" cy="32" r="31" fill="url(#ht1g)" />
      {/* Constellation lines — thick, bold, connecting the stars */}
      <line x1="10" y1="14" x2="22" y2="22" stroke="#60a5fa" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
      <line x1="22" y1="22" x2="18" y2="36" stroke="#60a5fa" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
      <line x1="18" y1="36" x2="30" y2="40" stroke="#60a5fa" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
      <line x1="30" y1="40" x2="42" y2="32" stroke="#60a5fa" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
      <line x1="42" y1="32" x2="54" y2="38" stroke="#60a5fa" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
      <line x1="54" y1="38" x2="56" y2="50" stroke="#60a5fa" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
      {/* Scorpion tail curl */}
      <path d="M56 50 C54 56, 48 58, 44 54" stroke="#60a5fa" strokeWidth="3" opacity="0.7" strokeLinecap="round" fill="none" />
      {/* Stinger */}
      <line x1="44" y1="54" x2="40" y2="50" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      <line x1="44" y1="54" x2="42" y2="58" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      {/* Constellation stars — 4-pointed star shapes with glow halos */}
      {/* Star at (10,14) — medium */}
      <circle cx="10" cy="14" r="5" fill="url(#ht1)" opacity="0.3" />
      <polygon points="10,8 11.5,12 16,14 11.5,16 10,20 8.5,16 4,14 8.5,12" fill="#bfdbfe" opacity="0.95" />
      {/* Star at (22,22) — large, bright */}
      <circle cx="22" cy="22" r="7" fill="url(#ht1)" opacity="0.3" />
      <polygon points="22,14 24,19.5 30,22 24,24.5 22,30 20,24.5 14,22 20,19.5" fill="#bfdbfe" opacity="1" />
      {/* Star at (18,36) — medium */}
      <circle cx="18" cy="36" r="5" fill="url(#ht1)" opacity="0.25" />
      <polygon points="18,30.5 19.5,34 24,36 19.5,38 18,41.5 16.5,38 12,36 16.5,34" fill="#bfdbfe" opacity="0.9" />
      {/* Star at (30,40) — small */}
      <circle cx="30" cy="40" r="4" fill="url(#ht1)" opacity="0.2" />
      <polygon points="30,35.5 31.2,38.5 34.5,40 31.2,41.5 30,44.5 28.8,41.5 25.5,40 28.8,38.5" fill="#bfdbfe" opacity="0.85" />
      {/* Star at (54,38) — large */}
      <circle cx="54" cy="38" r="6" fill="url(#ht1)" opacity="0.3" />
      <polygon points="54,31 56,35.5 61,38 56,40.5 54,45 52,40.5 47,38 52,35.5" fill="#bfdbfe" opacity="0.95" />
      {/* Star at (56,50) — small */}
      <circle cx="56" cy="50" r="4" fill="url(#ht1)" opacity="0.2" />
      <polygon points="56,46 57.2,48.5 60,50 57.2,51.5 56,54 54.8,51.5 52,50 54.8,48.5" fill="#bfdbfe" opacity="0.8" />
      {/* The TRANSITING PLANET — golden, glowing, moving along the constellation */}
      <circle cx="42" cy="32" r="8" fill="url(#ht1p)" />
      <circle cx="42" cy="32" r="5.5" fill="#fbbf24" opacity="0.8" />
      <circle cx="42" cy="32" r="3" fill="#fef3c7" opacity="1" />
      {/* Motion trail behind the planet */}
      <path d="M30 40 Q34 38 42 32" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" strokeDasharray="3 2" />
      {/* Background star dust — tiny 4-pointed twinkles */}
      <polygon points="48,8.5 48.6,9.7 50,10 48.6,10.3 48,11.5 47.4,10.3 46,10 47.4,9.7" fill="#93c5fd" opacity="0.55" />
      <polygon points="6,46.5 6.5,47.5 8,48 6.5,48.5 6,49.5 5.5,48.5 4,48 5.5,47.5" fill="#60a5fa" opacity="0.45" />
      <polygon points="36,6 36.7,7.5 38.5,8 36.7,8.5 36,10 35.3,8.5 33.5,8 35.3,7.5" fill="#818cf8" opacity="0.5" />
      <polygon points="58,19 58.5,20 60,20.5 58.5,21 58,22 57.5,21 56,20.5 57.5,20" fill="#93c5fd" opacity="0.4" />
      <polygon points="14,54.5 14.5,55.5 16,56 14.5,56.5 14,57.5 13.5,56.5 12,56 13.5,55.5" fill="#60a5fa" opacity="0.35" />
    </svg>
  );
}

function MatchingSVG() {
  // Interlocking hearts/circles — bold Venn with spark at intersection
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hmm1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f472b6" stopOpacity="0.25" /><stop offset="100%" stopColor="#831843" stopOpacity="0" /></radialGradient>
        <linearGradient id="hmm1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f9a8d4" /><stop offset="100%" stopColor="#ec4899" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hmm1g)" />
      {/* Left circle — bold */}
      <circle cx="22" cy="32" r="18" stroke="#f472b6" strokeWidth="3" opacity="0.8" />
      <circle cx="22" cy="32" r="18" fill="#f472b6" fillOpacity="0.1" />
      {/* Right circle — bold */}
      <circle cx="42" cy="32" r="18" stroke="#f472b6" strokeWidth="3" opacity="0.8" />
      <circle cx="42" cy="32" r="18" fill="#f472b6" fillOpacity="0.1" />
      {/* Intersection fill — bright */}
      <path d="M32 17 A18 18 0 0 1 32 47 A18 18 0 0 1 32 17" fill="#f472b6" opacity="0.35" />
      {/* Spark at center of intersection */}
      <circle cx="32" cy="32" r="5" fill="url(#hmm1)" opacity="0.9" />
      <circle cx="32" cy="32" r="2.5" fill="#f9a8d4" opacity="1" />
      {/* Person dots */}
      <circle cx="16" cy="28" r="3" fill="#f472b6" opacity="0.7" />
      <circle cx="48" cy="28" r="3" fill="#f472b6" opacity="0.7" />
    </svg>
  );
}

function SadeSatiSVG() {
  // Saturn with rings — dramatic ringed planet + "7.5" badge
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hs1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" /><stop offset="100%" stopColor="#1e3a5f" stopOpacity="0" /></radialGradient>
        <linearGradient id="hs1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hs1g)" />
      {/* Saturn body — large, bold */}
      <circle cx="32" cy="30" r="14" fill="url(#hs1)" opacity="0.7" stroke="#60a5fa" strokeWidth="2.5" />
      <circle cx="32" cy="30" r="8" fill="#93c5fd" opacity="0.3" />
      {/* Rings — thick, dramatic tilt */}
      <ellipse cx="32" cy="30" rx="26" ry="8" stroke="#60a5fa" strokeWidth="3" opacity="0.7" transform="rotate(-15 32 30)" fill="none" />
      <ellipse cx="32" cy="30" rx="22" ry="6" stroke="#93c5fd" strokeWidth="2" opacity="0.4" transform="rotate(-15 32 30)" fill="none" />
      {/* 7.5 text — bold */}
      <text x="22" y="56" fill="#60a5fa" fontSize="14" fontWeight="bold" opacity="0.9" fontFamily="var(--font-cinzel)">7.5</text>
      {/* Year arc */}
      <path d="M14 58 Q32 50 50 58" stroke="#60a5fa" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
}

function PrashnaSVG() {
  // Crystal ball with stars — bold sphere + question energy
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hp1g" cx="50%" cy="45%" r="50%"><stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" /><stop offset="100%" stopColor="#4c1d95" stopOpacity="0" /></radialGradient>
        <linearGradient id="hp1" x1="30%" y1="0%" x2="70%" y2="100%"><stop offset="0%" stopColor="#c4b5fd" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient>
        <radialGradient id="hp1s" cx="35%" cy="30%" r="50%"><stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.6" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hp1g)" />
      {/* Crystal ball — large, bold, filled */}
      <circle cx="32" cy="28" r="22" fill="url(#hp1s)" stroke="#a78bfa" strokeWidth="3" />
      {/* Shine highlight */}
      <ellipse cx="24" cy="20" rx="6" ry="4" fill="#c4b5fd" opacity="0.3" transform="rotate(-20 24 20)" />
      {/* Inner stars */}
      <polygon points="28,22 29.5,26 34,26 30.5,29 32,33 28,30 24,33 25.5,29 22,26 26.5,26" fill="#c4b5fd" opacity="0.7" />
      <polygon points="38,30 39,32.5 42,32.5 39.5,34.5 40.5,37 38,35 35.5,37 36.5,34.5 34,32.5 37,32.5" fill="#a78bfa" opacity="0.5" />
      {/* Base pedestal */}
      <path d="M20 50 Q26 46 32 48 Q38 46 44 50" stroke="#a78bfa" strokeWidth="2.5" fill="none" opacity="0.7" />
      <line x1="22" y1="54" x2="42" y2="54" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* Mystical sparkles around */}
      <circle cx="10" cy="16" r="2" fill="#a78bfa" opacity="0.6" />
      <circle cx="54" cy="20" r="2.5" fill="#c4b5fd" opacity="0.5" />
      <circle cx="52" cy="44" r="1.5" fill="#a78bfa" opacity="0.4" />
    </svg>
  );
}

function LearnSVG() {
  // Open book with light rays — bold tome emanating knowledge
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hl1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f0d48a" /><stop offset="100%" stopColor="#d4a853" /></linearGradient>
        <radialGradient id="hl1g" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.35" /><stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hl1g)" />
      {/* Knowledge rays — emanating upward from book */}
      {[-40, -20, 0, 20, 40].map((deg, i) => (
        <line key={i} x1="32" y1="36" x2={32 + 24 * Math.sin(deg * Math.PI / 180)} y2={36 - 24 * Math.cos(deg * Math.PI / 180)} stroke="#f0d48a" strokeWidth={i === 2 ? 3 : 2} strokeLinecap="round" opacity={i === 2 ? 0.7 : 0.4} />
      ))}
      {/* Left page — bold */}
      <path d="M32 36 L32 56 L8 52 L8 32 Z" fill="#f0d48a" fillOpacity="0.25" stroke="#f0d48a" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Right page — bold */}
      <path d="M32 36 L32 56 L56 52 L56 32 Z" fill="#d4a853" fillOpacity="0.2" stroke="#f0d48a" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Page lines — left */}
      <line x1="14" y1="38" x2="28" y2="40" stroke="#f0d48a" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="14" y1="44" x2="28" y2="46" stroke="#f0d48a" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      {/* Page lines — right */}
      <line x1="36" y1="40" x2="50" y2="38" stroke="#f0d48a" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="36" y1="46" x2="50" y2="44" stroke="#f0d48a" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      {/* Spine highlight */}
      <line x1="32" y1="34" x2="32" y2="58" stroke="#f0d48a" strokeWidth="3" opacity="0.8" />
      {/* Top sparkle */}
      <circle cx="32" cy="10" r="3" fill="#f0d48a" opacity="0.8" />
      <circle cx="32" cy="10" r="1.5" fill="#f0d48a" opacity="1" />
    </svg>
  );
}

// Card data with unique gradient colors and SVGs
type LocaleText = { en: string; hi: string; sa?: string; ta?: string; te?: string; bn?: string; kn?: string; mr?: string; gu?: string; mai?: string };
const HERO_CARDS: { href: string; glowColor: string; svg: React.ReactNode; subtitle: LocaleText;
  label: LocaleText; desc: LocaleText }[] = [
  {
    href: '/kundali', glowColor: '#f0d48a',
    svg: <KundaliSVG />,
    subtitle: { en: 'Birth Chart', hi: 'जन्म कुण्डली', ta: 'ஜாதக வரைபடம்', bn: 'জাতক চার্ট' },
    label: { en: 'Birth Chart', hi: 'जन्म कुण्डली', sa: 'जन्मकुण्डली', ta: 'ஜாதக வரைபடம்', te: 'జాతక చార్ట్', bn: 'জাতক চার্ট', kn: 'ಜಾತಕ ನಕ್ಷೆ', mr: 'जन्म कुंडली', gu: 'જન્મ કુંડળી', mai: 'जन्म कुंडली' },
    desc: { en: 'Generate Kundali with Dasha, Yogas & AI insights', hi: 'दशा, योग और AI अंतर्दृष्टि के साथ कुण्डली बनाएं', sa: 'दशा-योग-AI-अन्तर्दृष्ट्या कुण्डलीं रचयतु', ta: 'தசா, யோகம் & AI நுண்ணறிவுடன் ஜாதகம் உருவாக்குங்கள்', te: 'దశ, యోగాలు & AI అంతర్దృష్టితో జాతకం రూపొందించండి', bn: 'দশা, যোগ ও AI অন্তর্দৃষ্টি সহ জাতক তৈরি করুন', kn: 'ದಶಾ, ಯೋಗ ಮತ್ತು AI ಒಳನೋಟಗಳೊಂದಿಗೆ ಜಾತಕ ರಚಿಸಿ', mr: 'दशा, योग आणि AI अंतर्दृष्टीसह कुंडली तयार करा', gu: 'દશા, યોગ અને AI આંતરદૃષ્ટિ સાથે કુંડળી બનાવો', mai: 'दशा, योग आ AI अंतर्दृष्टिक संग कुंडली बनाउ' },
  },
  {
    href: '/muhurta-ai', glowColor: '#4ade80',
    svg: <MuhurtaSVG />,
    subtitle: { en: 'Auspicious Timing', hi: 'शुभ मुहूर्त', ta: 'சுப நேரம்', bn: 'শুভ মুহূর্ত' },
    label: { en: 'Muhurta AI', hi: 'मुहूर्त AI', sa: 'मुहूर्तं AI', ta: 'முகூர்த்தம் AI', te: 'ముహూర్తం AI', bn: 'মুহূর্ত AI', kn: 'ಮುಹೂರ್ತ AI', mr: 'मुहूर्त AI', gu: 'મુહૂર્ત AI', mai: 'मुहूर्त AI' },
    desc: { en: 'AI-scored auspicious timing for 20 activities', hi: '20 गतिविधियों के लिए AI-अंकित शुभ समय', sa: '20 कार्येषु AI-मूल्यांकितं शुभमुहूर्तम्', ta: '20 நடவடிக்கைகளுக்கான AI-மதிப்பிட்ட சுப நேரம்', te: '20 కార్యకలాపాలకు AI-స్కోర్ శుభ సమయాలు', bn: '20টি কর্মকাণ্ডের জন্য AI-মূল্যায়িত শুভ সময়', kn: '20 ಚಟುವಟಿಕೆಗಳಿಗೆ AI-ಮೌಲ್ಯಮಾಪನ ಶುಭ ಸಮಯ', mr: '20 कार्यांसाठी AI-मूल्यांकित शुभ मुहूर्त', gu: '20 પ્રવૃત્તિઓ માટે AI-મૂલ્યાંકિત શુભ સમય', mai: '20 कार्यक लेल AI-अंकित शुभ समय' },
  },
  {
    href: '/calendar', glowColor: '#fb923c',
    svg: <CalendarSVG />,
    subtitle: { en: 'Hindu Calendar', hi: 'हिन्दू पंचांग', ta: 'இந்து நாள்காட்டி', bn: 'হিন্দু পঞ্চাঙ্গ' },
    label: { en: 'Festivals & Vrat', hi: 'त्योहार और व्रत', sa: 'उत्सवाः व्रतानि च', ta: 'திருவிழாக்கள் & விரதம்', te: 'పండుగలు & వ్రతాలు', bn: 'উৎসব ও ব্রত', kn: 'ಹಬ್ಬಗಳು & ವ್ರತಗಳು', mr: 'सण आणि व्रत', gu: 'તહેવાર અને વ્રત', mai: 'पर्व आ व्रत' },
    desc: { en: 'Hindu calendar with regional events & Ekadashi', hi: 'क्षेत्रीय त्योहार और एकादशी के साथ हिन्दू पंचांग', sa: 'प्रादेशिकोत्सवैः एकादश्या च हिन्दूपञ्चाङ्गम्', ta: 'பிராந்திய நிகழ்வுகள் & ஏகாதசியுடன் இந்து நாள்காட்டி', te: 'ప్రాంతీయ ఈవెంట్లు & ఏకాదశితో హిందూ పంచాంగం', bn: 'আঞ্চলিক অনুষ্ঠান ও একাদশী সহ হিন্দু পঞ্চাঙ্গ', kn: 'ಪ್ರಾದೇಶಿಕ ಕಾರ್ಯಕ್ರಮಗಳು & ಏಕಾದಶಿಯೊಂದಿಗೆ ಹಿಂದೂ ಪಂಚಾಂಗ', mr: 'प्रादेशिक सण आणि एकादशीसह हिंदू पंचांग', gu: 'પ્રાદેશિક ઘટનાઓ અને એકાદશી સાથે હિંદુ પંચાંગ', mai: 'क्षेत्रीय पर्व आ एकादशीक संग हिन्दू पंचांग' },
  },
  {
    href: '/calendars/tithi', glowColor: '#c084fc',
    svg: <TithiGridSVG />,
    subtitle: { en: 'Monthly Grid', hi: 'मासिक ग्रिड', ta: 'மாத கட்டம்', bn: 'মাসিক গ্রিড' },
    label: { en: 'Tithi Calendar', hi: 'तिथि पंचांग', sa: 'तिथिपञ्चाङ्गम्', ta: 'திதி நாள்காட்டி', te: 'తిథి పంచాంగం', bn: 'তিথি পঞ্চাঙ্গ', kn: 'ತಿಥಿ ಪಂಚಾಂಗ', mr: 'तिथी पंचांग', gu: 'તિથિ પંચાંગ', mai: 'तिथि पंचांग' },
    desc: { en: 'Moon phases, Nakshatra & festivals — daily grid', hi: 'चन्द्र कला, नक्षत्र और त्योहार — दैनिक ग्रिड', sa: 'चन्द्रकलाः, नक्षत्राणि, उत्सवाश्च', ta: 'சந்திர கலைகள், நட்சத்திரம் & திருவிழாக்கள்', te: 'చంద్ర కళలు, నక్షత్రం & పండుగలు', bn: 'চন্দ্র কলা, নক্ষত্র ও উৎসব', kn: 'ಚಂದ್ರ ಕಲೆ, ನಕ್ಷತ್ರ & ಹಬ್ಬಗಳು', mr: 'चंद्र कला, नक्षत्र आणि सण', gu: 'ચંદ્ર કળા, નક્ષત્ર અને તહેવાર', mai: 'चन्द्र कला, नक्षत्र आ पर्व' },
  },
  {
    href: '/transits', glowColor: '#60a5fa',
    svg: <TransitSVG />,
    subtitle: { en: 'Gochar', hi: 'गोचर', ta: 'கோசாரம்', bn: 'গোচর' },
    label: { en: 'Planet Transits', hi: 'ग्रह गोचर', sa: 'ग्रहगोचरः', ta: 'கிரக பெயர்ச்சி', te: 'గ్రహ గోచారం', bn: 'গ্রহ গোচর', kn: 'ಗ್ರಹ ಗೋಚಾರ', mr: 'ग्रह गोचर', gu: 'ગ્રહ ગોચર', mai: 'ग्रह गोचर' },
    desc: { en: 'Track planetary movements & Gochar predictions', hi: 'ग्रहों की चाल और गोचर फल ट्रैक करें', sa: 'ग्रहचलनं गोचरफलं च अनुसरतु', ta: 'கிரக நகர்வுகள் & கோசார கணிப்புகளைக் கண்காணிக்கவும்', te: 'గ్రహ చలనాలు & గోచార ఫలాలను ట్రాక్ చేయండి', bn: 'গ্রহের গতিবিধি ও গোচর ফল ট্র্যাক করুন', kn: 'ಗ್ರಹ ಚಲನೆಗಳು & ಗೋಚಾರ ಫಲಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', mr: 'ग्रहांची गती आणि गोचर फल ट्रॅक करा', gu: 'ગ્રહોની ગતિ અને ગોચર ફળ ટ્રેક કરો', mai: 'ग्रहक चाल आ गोचर फल ट्रैक करू' },
  },
  {
    href: '/matching', glowColor: '#f472b6',
    svg: <MatchingSVG />,
    subtitle: { en: 'Compatibility', hi: 'अनुकूलता', ta: 'பொருத்தம்', bn: 'সামঞ্জস্য' },
    label: { en: 'Kundali Matching', hi: 'कुण्डली मिलान', sa: 'कुण्डलीमेलनम्', ta: 'ஜாதக பொருத்தம்', te: 'జాతక పొంతన', bn: 'জাতক মিলন', kn: 'ಜಾತಕ ಹೊಂದಾಣಿಕೆ', mr: 'कुंडली जुळवणी', gu: 'કુંડળી મિલાન', mai: 'कुंडली मिलान' },
    desc: { en: 'Ashta Kuta 36-Guna compatibility analysis', hi: 'अष्ट कूट 36-गुण अनुकूलता विश्लेषण', sa: 'अष्टकूट-षट्त्रिंशद्गुण-अनुकूलताविश्लेषणम्', ta: 'அஷ்ட கூட 36-குண பொருத்த பகுப்பாய்வு', te: 'అష్ట కూట 36-గుణ అనుకూలత విశ్లేషణ', bn: 'অষ্ট কূট ৩৬-গুণ সামঞ্জস্য বিশ্লেষণ', kn: 'ಅಷ್ಟ ಕೂಟ 36-ಗುಣ ಹೊಂದಾಣಿಕೆ ವಿಶ್ಲೇಷಣೆ', mr: 'अष्टकूट ३६-गुण अनुकूलता विश्लेषण', gu: 'અષ્ટ કૂટ 36-ગુણ અનુકૂળતા વિશ્લેષણ', mai: 'अष्टकूट 36-गुण अनुकूलता विश्लेषण' },
  },
  {
    href: '/sade-sati', glowColor: '#60a5fa',
    svg: <SadeSatiSVG />,
    subtitle: { en: 'Saturn Cycle', hi: 'शनि चक्र', ta: 'சனி சுழற்சி', bn: 'শনি চক্র' },
    label: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साढेसप्तवर्षम्', ta: 'சனிப்பெயர்ச்சி', te: 'సాడే సాతి', bn: 'সাড়ে সাতি', kn: 'ಸಾಡೆ ಸಾತಿ', mr: 'साडेसाती', gu: 'સાડાસાતી', mai: 'साढ़ेसाती' },
    desc: { en: "Saturn's 7.5 year cycle — phase & remedies", hi: 'शनि की साढ़े साती — चरण और उपाय', sa: 'शनेः साढेसप्तवर्षचक्रम् — चरणाः उपचाराश्च', ta: 'சனியின் 7.5 ஆண்டு சுழற்சி — கட்டம் & பரிகாரங்கள்', te: 'శని 7.5 సంవత్సరాల చక్రం — దశ & పరిహారాలు', bn: 'শনির ৭.৫ বছরের চক্র — পর্ব ও প্রতিকার', kn: 'ಶನಿ 7.5 ವರ್ಷಗಳ ಚಕ್ರ — ಹಂತ & ಪರಿಹಾರಗಳು', mr: 'शनीची साडेसाती — टप्पे आणि उपाय', gu: 'શનિની સાડાસાતી — તબક્કા અને ઉપાય', mai: 'शनिक साढ़ेसाती — चरण आ उपाय' },
  },
  {
    href: '/prashna', glowColor: '#a78bfa',
    svg: <PrashnaSVG />,
    subtitle: { en: 'Horary', hi: 'होरेरी', ta: 'ஹோரேரி', bn: 'হোরারি' },
    label: { en: 'Prashna Kundali', hi: 'प्रश्न कुण्डली', sa: 'प्रश्नकुण्डली', ta: 'பிரச்ன ஜாதகம்', te: 'ప్రశ్న జాతకం', bn: 'প্রশ্ন জাতক', kn: 'ಪ್ರಶ್ನ ಜಾತಕ', mr: 'प्रश्न कुंडली', gu: 'પ્રશ્ન કુંડળી', mai: 'प्रश्न कुंडली' },
    desc: { en: 'Horary astrology — instant answers to questions', hi: 'होरेरी ज्योतिष — प्रश्नों के तत्काल उत्तर', sa: 'होराज्योतिषम् — प्रश्नानां तात्कालिकोत्तराणि', ta: 'ஹோரேரி ஜோதிடம் — கேள்விகளுக்கு உடனடி பதில்கள்', te: 'హోరరీ జ్యోతిషం — ప్రశ్నలకు తక్షణ సమాధానాలు', bn: 'হোরারি জ্যোতিষ — প্রশ্নের তাৎক্ষণিক উত্তর', kn: 'ಹೋರರಿ ಜ್ಯೋತಿಷ — ಪ್ರಶ್ನೆಗಳಿಗೆ ತಕ್ಷಣದ ಉತ್ತರಗಳು', mr: 'होरारी ज्योतिष — प्रश्नांची तात्काळ उत्तरे', gu: 'હોરરી જ્યોતિષ — પ્રશ્નોના તાત્કાલિક જવાબો', mai: 'होरेरी ज्योतिष — प्रश्नक तत्काल उत्तर' },
  },
  {
    href: '/learn', glowColor: '#d4a853',
    svg: <LearnSVG />,
    subtitle: { en: 'Vedic Wisdom', hi: 'वैदिक ज्ञान', ta: 'வேத ஞானம்', bn: 'বৈদিক জ্ঞান' },
    label: { en: 'Learn Jyotish', hi: 'ज्योतिष सीखें', sa: 'ज्योतिषं पठतु', ta: 'ஜோதிடம் கற்க', te: 'జ్యోతిషం నేర్చుకోండి', bn: 'জ্যোতিষ শিখুন', kn: 'ಜ್ಯೋತಿಷ ಕಲಿಯಿರಿ', mr: 'ज्योतिष शिका', gu: 'જ્યોતિષ શીખો', mai: 'ज्योतिष सीखू' },
    desc: { en: 'Grahas, Rashis, Nakshatras, Dashas & more', hi: 'ग्रह, राशि, नक्षत्र, दशा और बहुत कुछ', sa: 'ग्रहाः, राशयः, नक्षत्राणि, दशाः, अन्यच्च', ta: 'கிரகங்கள், ராசிகள், நட்சத்திரங்கள், தசைகள் & மேலும்', te: 'గ్రహాలు, రాశులు, నక్షత్రాలు, దశలు & మరిన్ని', bn: 'গ্রহ, রাশি, নক্ষত্র, দশা ও আরও অনেক কিছু', kn: 'ಗ್ರಹಗಳು, ರಾಶಿಗಳು, ನಕ್ಷತ್ರಗಳು, ದಶೆಗಳು & ಇನ್ನಷ್ಟು', mr: 'ग्रह, राशी, नक्षत्रे, दशा आणि बरेच काही', gu: 'ગ્રહ, રાશિ, નક્ષત્ર, દશા અને વધુ', mai: 'ग्रह, राशि, नक्षत्र, दशा आ आओर बहुत किछु' },
  },
];

const SECONDARY_TOOLS: { href: string; label: { en: string; hi: string; ta: string; te?: string; bn?: string; kn?: string; mr?: string; gu?: string; mai?: string }; gradient: string; border: string }[] = [
  { href: '/retrograde', label: { en: 'Retrograde Calendar', hi: 'वक्री पंचांग', ta: 'வக்ர நாள்காட்டி', te: 'వక్ర పంచాంగం', bn: 'বক্র পঞ্চাঙ্গ', kn: 'ವಕ್ರ ಪಂಚಾಂಗ', mr: 'वक्री पंचांग', gu: 'વક્રી પંચાંગ', mai: 'वक्री पंचांग' }, gradient: 'from-red-500/8 to-transparent', border: 'border-red-500/10 hover:border-red-500/25' },
  { href: '/eclipses', label: { en: 'Eclipse Calendar', hi: 'ग्रहण पंचांग', ta: 'கிரகண நாள்காட்டி', te: 'గ్రహణ పంచాంగం', bn: 'গ্রহণ পঞ্চাঙ্গ', kn: 'ಗ್ರಹಣ ಪಂಚಾಂಗ', mr: 'ग्रहण पंचांग', gu: 'ગ્રહણ પંચાંગ', mai: 'ग्रहण पंचांग' }, gradient: 'from-purple-500/8 to-transparent', border: 'border-purple-500/10 hover:border-purple-500/25' },
  { href: '/muhurat', label: { en: 'Muhurat Finder', hi: 'मुहूर्त खोजक', ta: 'முகூர்த்தம் தேடி', te: 'ముహూర్తం అన్వేషణ', bn: 'মুহূর্ত অনুসন্ধান', kn: 'ಮುಹೂರ್ತ ಹುಡುಕಾಟ', mr: 'मुहूर्त शोधक', gu: 'મુહૂર્ત શોધક', mai: 'मुहूर्त खोजक' }, gradient: 'from-emerald-500/8 to-transparent', border: 'border-emerald-500/10 hover:border-emerald-500/25' },
  { href: '/sign-calculator', label: { en: 'Sign Calculator', hi: 'राशि गणक', ta: 'ராசி கணிப்பான்', te: 'రాశి గణన', bn: 'রাশি গণক', kn: 'ರಾಶಿ ಲೆಕ್ಕಾಚಾರ', mr: 'राशी गणक', gu: 'રાશિ ગણક', mai: 'राशि गणक' }, gradient: 'from-amber-500/8 to-transparent', border: 'border-amber-500/10 hover:border-amber-500/25' },
  { href: '/baby-names', label: { en: 'Baby Names', hi: 'शिशु नाम', ta: 'குழந்தை பெயர்கள்', te: 'శిశు నామాలు', bn: 'শিশুর নাম', kn: 'ಶಿಶು ಹೆಸರುಗಳು', mr: 'बाळ नावे', gu: 'બાળ નામો', mai: 'शिशु नाम' }, gradient: 'from-pink-500/8 to-transparent', border: 'border-pink-500/10 hover:border-pink-500/25' },
  { href: '/shraddha', label: { en: 'Shraddha Calculator', hi: 'श्राद्ध गणक', ta: 'சிராத்த கணிப்பான்', te: 'శ్రాద్ధ గణన', bn: 'শ্রাদ্ধ গণক', kn: 'ಶ್ರಾದ್ಧ ಲೆಕ್ಕಾಚಾರ', mr: 'श्राद्ध गणक', gu: 'શ્રાદ્ધ ગણક', mai: 'श्राद्ध गणक' }, gradient: 'from-stone-400/8 to-transparent', border: 'border-stone-400/10 hover:border-stone-400/25' },
  { href: '/vedic-time', label: { en: 'Vedic Time', hi: 'वैदिक समय', ta: 'வேத நேரம்', te: 'వేద సమయం', bn: 'বৈদিক সময়', kn: 'ವೈದಿಕ ಸಮಯ', mr: 'वैदिक वेळ', gu: 'વૈદિક સમય', mai: 'वैदिक समय' }, gradient: 'from-amber-400/8 to-transparent', border: 'border-amber-400/10 hover:border-amber-400/25' },
  { href: '/devotional', label: { en: 'Devotional Guide', hi: 'भक्ति मार्गदर्शिका', ta: 'பக்தி வழிகாட்டி', te: 'భక్తి మార్గదర్శి', bn: 'ভক্তি পথনির্দেশিকা', kn: 'ಭಕ್ತಿ ಮಾರ್ಗದರ್ಶಿ', mr: 'भक्ती मार्गदर्शक', gu: 'ભક્તિ માર્ગદર્શક', mai: 'भक्ति मार्गदर्शिका' }, gradient: 'from-orange-500/8 to-transparent', border: 'border-orange-500/10 hover:border-orange-500/25' },
  { href: '/regional', label: { en: 'Regional Calendars', hi: 'क्षेत्रीय पंचांग', ta: 'பிராந்திய நாள்காட்டிகள்', te: 'ప్రాంతీయ పంచాంగాలు', bn: 'আঞ্চলিক পঞ্চাঙ্গ', kn: 'ಪ್ರಾದೇಶಿಕ ಪಂಚಾಂಗ', mr: 'प्रादेशिक पंचांग', gu: 'પ્રાદેશિક પંચાંગ', mai: 'क्षेत्रीय पंचांग' }, gradient: 'from-teal-500/8 to-transparent', border: 'border-teal-500/10 hover:border-teal-500/25' },
  { href: '/upagraha', label: { en: 'Upagraha', hi: 'उपग्रह', ta: 'உபகிரகம்', te: 'ఉపగ్రహం', bn: 'উপগ্রহ', kn: 'ಉಪಗ್ರಹ', mr: 'उपग्रह', gu: 'ઉપગ્રહ', mai: 'उपग्रह' }, gradient: 'from-cyan-500/8 to-transparent', border: 'border-cyan-500/10 hover:border-cyan-500/25' },
  { href: '/varshaphal', label: { en: 'Varshaphal', hi: 'वर्षफल', ta: 'வர்ஷபலன்', te: 'వర్షఫలం', bn: 'বর্ষফল', kn: 'ವರ್ಷಫಲ', mr: 'वर्षफल', gu: 'વર્ષફળ', mai: 'वर्षफल' }, gradient: 'from-yellow-500/8 to-transparent', border: 'border-yellow-500/10 hover:border-yellow-500/25' },
  { href: '/kp-system', label: { en: 'KP System', hi: 'केपी पद्धति', ta: 'KP முறை', te: 'KP పద్ధతి', bn: 'KP পদ্ধতি', kn: 'KP ಪದ್ಧತಿ', mr: 'केपी पद्धती', gu: 'KP પદ્ધતિ', mai: 'केपी पद्धति' }, gradient: 'from-indigo-500/8 to-transparent', border: 'border-indigo-500/10 hover:border-indigo-500/25' },
  { href: '/stories', label: { en: 'Web Stories', hi: 'वेब स्टोरीज़', ta: 'வலைக் கதைகள்', te: 'వెబ్ కథలు', bn: 'ওয়েব গল্প', kn: 'ವೆಬ್ ಕಥೆಗಳು', mr: 'वेब कथा', gu: 'વેબ વાર્તાઓ', mai: 'वेब स्टोरीज' }, gradient: 'from-purple-500/8 to-transparent', border: 'border-purple-500/10 hover:border-purple-500/25' },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  // ─── Server-side panchang via Vercel geo headers (eliminates LCP waterfall) ───
  let serverPanchang: PanchangData | null = null;
  let serverLocation: { lat: number; lng: number; name: string } | null = null;
  try {
    const hdrs = await headers();
    const geoLat = hdrs.get('x-vercel-ip-latitude');
    const geoLng = hdrs.get('x-vercel-ip-longitude');
    const geoCity = hdrs.get('x-vercel-ip-city');
    const geoCountry = hdrs.get('x-vercel-ip-country');
    const geoTz = hdrs.get('x-vercel-ip-timezone');
    if (geoLat && geoLng) {
      const lat = parseFloat(geoLat);
      const lng = parseFloat(geoLng);
      const locationName = [geoCity ? decodeURIComponent(geoCity) : '', geoCountry || ''].filter(Boolean).join(', ');
      const timezone = geoTz || 'UTC';
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const tzOffset = getUTCOffsetForDate(year, month, day, timezone);
      serverPanchang = computePanchang({ year, month, day, lat, lng, tzOffset, timezone, locationName });
      serverLocation = { lat, lng, name: locationName };
    }
  } catch { /* geo headers unavailable (local dev) — widget falls back to client fetch */ }
  const isDevanagari = isDevanagariLocale(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale) || {};

  return (
    <div className="relative">
      {/* ═══ HERO: Mantras + CTAs ═══ */}
      <section className="relative pt-16 pb-12 sm:pt-20 sm:pb-16 px-4">
        {/* Background: radial gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-gold-primary/5 via-transparent to-gold-dark/3 blur-3xl" />

        <div className="text-center max-w-3xl mx-auto relative z-10 stagger-children">
          {/* Gayatri Mantra — small, reverent, with sacred reveal */}
          <p className="text-gold-primary/60 text-xs sm:text-sm tracking-[0.2em] leading-relaxed mb-6 sacred-text-reveal"
            style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
            ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥
          </p>

          {/* Main tagline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight" style={hf}>
            <span className="text-gold-gradient">{t('tagline')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gold-primary/70 text-base sm:text-xl max-w-2xl mx-auto mb-8 italic font-medium"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {t('subtitle')}
          </p>

          {/* Two bold CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link href="/panchang" className="px-8 py-3 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light font-bold text-sm hover:bg-gold-primary/25 transition-all hover:-translate-y-0.5">
              {L({ en: "Today's Panchang", hi: 'आज का पञ्चाङ्ग', ta: 'இன்றைய பஞ்சாங்கம்', bn: 'আজকের পঞ্চাঙ্গ' }, locale)}
            </Link>
            <Link href="/kundali" className="px-8 py-3 rounded-xl bg-[#2d1b69]/40 border border-[#a78bfa]/20 text-[#c4b5fd] font-bold text-sm hover:bg-[#2d1b69]/60 transition-all hover:-translate-y-0.5">
              {L({ en: 'Generate Birth Chart', hi: 'जन्म कुण्डली बनाएं', ta: 'ஜாதகம் உருவாக்குங்கள்', bn: 'জাতক তৈরি করুন' }, locale)}
            </Link>
          </div>

          {/* Shloka — quiet, fading */}
          <p className="text-gold-primary/40 text-xs sm:text-sm tracking-wide"
            style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
            तमसो मा ज्योतिर्गमय
          </p>
        </div>
      </section>

      {/* ═══ TODAY'S PANCHANG — immediately after hero ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 yantra-bg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={hf}>
          <span className="text-gold-gradient">{t('todayPanchang')}</span>
        </h2>
        <HomeClientWidgets locale={locale} serverPanchang={serverPanchang} serverLocation={serverLocation} />
      </section>

      <GoldDivider />

      {/* ═══ PROFILE BANNER — for logged-in users, above the cards ═══ */}
      <ProfileBanner locale={locale} bf={bf} />

      {/* ═══ EXPLORE TOOLS — 3×3 tarot card grid ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={hf}>
            <span className="text-gold-gradient">{t('exploreTools')}</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto" style={bf}>
            {t('exploreToolsDesc')}
          </p>
        </div>

        {/* 3×3 mega tarot grid — Row 1: Birth Chart, Festivals, Learn. Rows 2-3: remaining 6 */}
        {(() => {
          // Reorder: Birth Chart (0), Festivals (2), Learn (8) first, then rest
          const row1Indices = [0, 2, 8];
          const restIndices = [1, 3, 4, 5, 6, 7];
          const ordered = [...row1Indices, ...restIndices].map(i => HERO_CARDS[i]);
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 stagger-children">
              {ordered.map((card) => (
                <TarotCard
                  key={card.href}
                  size="full"
                  href={card.href}
                  subtitle={L(card.subtitle, locale)}
                  icon={card.svg}
                  title={L(card.label, locale)}
                  description={L(card.desc, locale)}
                  glowColor={card.glowColor}
                />
              ))}
            </div>
          );
        })()}
      </section>

      <AdUnit placement="rectangle" className="max-w-2xl mx-auto" />

      {/* ═══ SECONDARY TOOLS — pill chips ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2.5 justify-center stagger-children">
          {SECONDARY_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <div className={`rounded-xl bg-gradient-to-br ${tool.gradient} border ${tool.border} px-4 py-2.5 transition-all duration-200 group-hover:-translate-y-0.5`}>
                <span className="text-text-secondary group-hover:text-text-primary text-sm font-medium transition-colors" style={bf}>
                  {L(tool.label, locale)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
