import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import TarotCard from '@/components/ui/TarotCard';
import AdUnit from '@/components/ads/AdUnit';
import HomeClientWidgets from '@/components/home/HomeClientWidgets';
import ProfileBanner from '@/components/home/ProfileBanner';
import { BrihaspatiHomeBanner } from '@/components/brihaspati/BrihaspatiHomeBanner';
import { getHeadingFont, getBodyFont, isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getLocaleDefaultCity, isBotUserAgent } from '@/lib/seo/locale-default-city';
import { DailyBriefingBody } from '@/components/dashboard/DailyBriefingBody';
import { Clock, Zap, BookOpen } from 'lucide-react';
import type { PanchangData } from '@/types/panchang';
import { getProminentFeatures, getFeatureLabel } from '@/lib/seo/feature-catalog';

/**
 * Per-locale label for the capability-strip intro line. ALL 9 visible
 * locales filled in directly — no Hindi fallback for Devanagari (the
 * 2026-05-31 Marathi duplicate-content de-rank was caused by exactly
 * that fallback pattern in the SEO templates).
 *
 * Editorial discipline: when adding a new visible locale to
 * `visibleLocales`, add a key here in the same commit. The
 * `llm-grounding-invariants.test.ts` test asserts this stays
 * pairwise-distinct across all 9 locales.
 */
const CAPABILITY_INTRO: Record<string, string> = {
  en: 'Everything Vedic astrology needs, computed from first principles:',
  hi: 'वैदिक ज्योतिष का सम्पूर्ण कार्य, मूल सिद्धान्तों से गणित द्वारा:',
  mr: 'वैदिक ज्योतिषाची सर्व आवश्यक गणना, मूळ तत्त्वांपासून:',
  mai: 'वैदिक ज्योतिष क सर्व आवश्यकता, मूल सिद्धान्त सँ गणित कएल गेल:',
  ta: 'வேத ஜோதிடம் தேவைப்படும் அனைத்தும், மூல கோட்பாடுகளிலிருந்து கணிக்கப்பட்டது:',
  te: 'వైదిక జ్యోతిష్యానికి కావలసిన ప్రతిదీ, మూల సూత్రాల నుండి లెక్కించబడింది:',
  bn: 'বৈদিক জ্যোতিষের জন্য প্রয়োজনীয় সবকিছু, মূল নীতি থেকে গণনা করা:',
  gu: 'વૈદિક જ્યોતિષની તમામ આવશ્યકતા, મૂળભૂત સિદ્ધાંતોથી ગણિત:',
  kn: 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯಕ್ಕೆ ಬೇಕಾದ ಎಲ್ಲವೂ, ಮೂಲ ತತ್ವಗಳಿಂದ ಲೆಕ್ಕಿಸಲಾಗಿದೆ:',
};

// NO revalidate here  –  page reads request headers for geo-location.
// ISR would cache one user's city and serve it to everyone.
// CPU protection via API-level caching (s-maxage=43200 on /api/panchang).

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
  // North Indian diamond chart  –  bold strokes, filled houses, planet dots
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
      {/* Planet dots  –  bold, scattered in houses */}
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
  // Auspicious star with clock  –  bold pentagram + thick hour markers
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hm1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4ade80" /><stop offset="100%" stopColor="#22c55e" /></linearGradient>
        <radialGradient id="hm1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" /><stop offset="100%" stopColor="#166534" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hm1g)" />
      {/* Outer ring  –  thick */}
      <circle cx="32" cy="32" r="30" stroke="#4ade80" strokeWidth="2.5" opacity="0.7" />
      {/* 12 hour markers  –  bold ticks */}
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
  // Sacred fire altar (Havan Kund)  –  pyramid fire with festival garland
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hc1" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stopColor="#ea580c" /><stop offset="40%" stopColor="#fb923c" /><stop offset="100%" stopColor="#fbbf24" /></linearGradient>
        <radialGradient id="hc1g" cx="50%" cy="55%" r="50%"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.35" /><stop offset="100%" stopColor="#7c2d12" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="36" r="31" fill="url(#hc1g)" />
      {/* Festival garland arc  –  draped at top with hanging tassels */}
      <path d="M6 14 Q18 22 32 14 Q46 22 58 14" stroke="#fb923c" strokeWidth="2.5" fill="none" opacity="0.7" />
      <path d="M6 14 Q18 24 32 16 Q46 24 58 14" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Tassels hanging from garland */}
      {[12, 22, 32, 42, 52].map(x => <line key={x} x1={x} y1={x === 32 ? 14 : 18} x2={x} y2={x === 32 ? 20 : 24} stroke="#fb923c" strokeWidth="2" strokeLinecap="round" opacity="0.6" />)}
      {/* Sacred fire  –  large, dramatic, 3 layers */}
      <path d="M32 18 C24 28, 14 36, 14 46 C14 54, 22 58, 32 58 C42 58, 50 54, 50 46 C50 36, 40 28, 32 18Z" fill="url(#hc1)" fillOpacity="0.6" stroke="#fbbf24" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 26 C28 32, 20 38, 20 46 C20 52, 26 56, 32 56 C38 56, 44 52, 44 46 C44 38, 36 32, 32 26Z" fill="#fbbf24" fillOpacity="0.4" />
      <path d="M32 34 C30 38, 26 42, 26 46 C26 50, 28 52, 32 52 C36 52, 38 50, 38 46 C38 42, 34 38, 32 34Z" fill="#fbbf24" fillOpacity="0.65" />
      {/* Bright core */}
      <ellipse cx="32" cy="48" rx="4" ry="5" fill="#fbbf24" opacity="0.9" />
      <ellipse cx="32" cy="49" rx="2" ry="3" fill="#fef3c7" opacity="1" />
      {/* Base platform  –  altar */}
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
      {/* Full moon  –  glowing gold circle */}
      <circle cx="39" cy="30" r="2.2" fill="url(#tg1m)" />
      <circle cx="39" cy="30" r="3.5" fill="none" stroke="#f0d48a" strokeWidth="0.5" opacity="0.3" />
      {/* New moon  –  dark circle */}
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
  // Gochar  –  dramatic Scorpio-like constellation with a planet transiting through it
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
      {/* Constellation lines  –  thick, bold, connecting the stars */}
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
      {/* Constellation stars  –  4-pointed star shapes with glow halos */}
      {/* Star at (10,14)  –  medium */}
      <circle cx="10" cy="14" r="5" fill="url(#ht1)" opacity="0.3" />
      <polygon points="10,8 11.5,12 16,14 11.5,16 10,20 8.5,16 4,14 8.5,12" fill="#bfdbfe" opacity="0.95" />
      {/* Star at (22,22)  –  large, bright */}
      <circle cx="22" cy="22" r="7" fill="url(#ht1)" opacity="0.3" />
      <polygon points="22,14 24,19.5 30,22 24,24.5 22,30 20,24.5 14,22 20,19.5" fill="#bfdbfe" opacity="1" />
      {/* Star at (18,36)  –  medium */}
      <circle cx="18" cy="36" r="5" fill="url(#ht1)" opacity="0.25" />
      <polygon points="18,30.5 19.5,34 24,36 19.5,38 18,41.5 16.5,38 12,36 16.5,34" fill="#bfdbfe" opacity="0.9" />
      {/* Star at (30,40)  –  small */}
      <circle cx="30" cy="40" r="4" fill="url(#ht1)" opacity="0.2" />
      <polygon points="30,35.5 31.2,38.5 34.5,40 31.2,41.5 30,44.5 28.8,41.5 25.5,40 28.8,38.5" fill="#bfdbfe" opacity="0.85" />
      {/* Star at (54,38)  –  large */}
      <circle cx="54" cy="38" r="6" fill="url(#ht1)" opacity="0.3" />
      <polygon points="54,31 56,35.5 61,38 56,40.5 54,45 52,40.5 47,38 52,35.5" fill="#bfdbfe" opacity="0.95" />
      {/* Star at (56,50)  –  small */}
      <circle cx="56" cy="50" r="4" fill="url(#ht1)" opacity="0.2" />
      <polygon points="56,46 57.2,48.5 60,50 57.2,51.5 56,54 54.8,51.5 52,50 54.8,48.5" fill="#bfdbfe" opacity="0.8" />
      {/* The TRANSITING PLANET  –  golden, glowing, moving along the constellation */}
      <circle cx="42" cy="32" r="8" fill="url(#ht1p)" />
      <circle cx="42" cy="32" r="5.5" fill="#fbbf24" opacity="0.8" />
      <circle cx="42" cy="32" r="3" fill="#fef3c7" opacity="1" />
      {/* Motion trail behind the planet */}
      <path d="M30 40 Q34 38 42 32" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" strokeDasharray="3 2" />
      {/* Background star dust  –  tiny 4-pointed twinkles */}
      <polygon points="48,8.5 48.6,9.7 50,10 48.6,10.3 48,11.5 47.4,10.3 46,10 47.4,9.7" fill="#93c5fd" opacity="0.55" />
      <polygon points="6,46.5 6.5,47.5 8,48 6.5,48.5 6,49.5 5.5,48.5 4,48 5.5,47.5" fill="#60a5fa" opacity="0.45" />
      <polygon points="36,6 36.7,7.5 38.5,8 36.7,8.5 36,10 35.3,8.5 33.5,8 35.3,7.5" fill="#818cf8" opacity="0.5" />
      <polygon points="58,19 58.5,20 60,20.5 58.5,21 58,22 57.5,21 56,20.5 57.5,20" fill="#93c5fd" opacity="0.4" />
      <polygon points="14,54.5 14.5,55.5 16,56 14.5,56.5 14,57.5 13.5,56.5 12,56 13.5,55.5" fill="#60a5fa" opacity="0.35" />
    </svg>
  );
}

function MatchingSVG() {
  // Interlocking hearts/circles  –  bold Venn with spark at intersection
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hmm1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f472b6" stopOpacity="0.25" /><stop offset="100%" stopColor="#831843" stopOpacity="0" /></radialGradient>
        <linearGradient id="hmm1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f9a8d4" /><stop offset="100%" stopColor="#ec4899" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hmm1g)" />
      {/* Left circle  –  bold */}
      <circle cx="22" cy="32" r="18" stroke="#f472b6" strokeWidth="3" opacity="0.8" />
      <circle cx="22" cy="32" r="18" fill="#f472b6" fillOpacity="0.1" />
      {/* Right circle  –  bold */}
      <circle cx="42" cy="32" r="18" stroke="#f472b6" strokeWidth="3" opacity="0.8" />
      <circle cx="42" cy="32" r="18" fill="#f472b6" fillOpacity="0.1" />
      {/* Intersection fill  –  bright */}
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
  // Saturn with rings  –  dramatic ringed planet + "7.5" badge
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hs1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" /><stop offset="100%" stopColor="#1e3a5f" stopOpacity="0" /></radialGradient>
        <linearGradient id="hs1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hs1g)" />
      {/* Saturn body  –  large, bold */}
      <circle cx="32" cy="30" r="14" fill="url(#hs1)" opacity="0.7" stroke="#60a5fa" strokeWidth="2.5" />
      <circle cx="32" cy="30" r="8" fill="#93c5fd" opacity="0.3" />
      {/* Rings  –  thick, dramatic tilt */}
      <ellipse cx="32" cy="30" rx="26" ry="8" stroke="#60a5fa" strokeWidth="3" opacity="0.7" transform="rotate(-15 32 30)" fill="none" />
      <ellipse cx="32" cy="30" rx="22" ry="6" stroke="#93c5fd" strokeWidth="2" opacity="0.4" transform="rotate(-15 32 30)" fill="none" />
      {/* 7.5 text  –  bold */}
      <text x="22" y="56" fill="#60a5fa" fontSize="14" fontWeight="bold" opacity="0.9" fontFamily="var(--font-cinzel)">7.5</text>
      {/* Year arc */}
      <path d="M14 58 Q32 50 50 58" stroke="#60a5fa" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
}

function PrashnaSVG() {
  // Crystal ball with stars  –  bold sphere + question energy
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hp1g" cx="50%" cy="45%" r="50%"><stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" /><stop offset="100%" stopColor="#4c1d95" stopOpacity="0" /></radialGradient>
        <linearGradient id="hp1" x1="30%" y1="0%" x2="70%" y2="100%"><stop offset="0%" stopColor="#c4b5fd" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient>
        <radialGradient id="hp1s" cx="35%" cy="30%" r="50%"><stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.6" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hp1g)" />
      {/* Crystal ball  –  large, bold, filled */}
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
  // Open book with light rays  –  bold tome emanating knowledge
  return (
    <svg width="128" height="128" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hl1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f0d48a" /><stop offset="100%" stopColor="#d4a853" /></linearGradient>
        <radialGradient id="hl1g" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.35" /><stop offset="100%" stopColor="#8a6d2b" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#hl1g)" />
      {/* Knowledge rays  –  emanating upward from book */}
      {[-40, -20, 0, 20, 40].map((deg, i) => (
        <line key={i} x1="32" y1="36" x2={32 + 24 * Math.sin(deg * Math.PI / 180)} y2={36 - 24 * Math.cos(deg * Math.PI / 180)} stroke="#f0d48a" strokeWidth={i === 2 ? 3 : 2} strokeLinecap="round" opacity={i === 2 ? 0.7 : 0.4} />
      ))}
      {/* Left page  –  bold */}
      <path d="M32 36 L32 56 L8 52 L8 32 Z" fill="#f0d48a" fillOpacity="0.25" stroke="#f0d48a" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Right page  –  bold */}
      <path d="M32 36 L32 56 L56 52 L56 32 Z" fill="#d4a853" fillOpacity="0.2" stroke="#f0d48a" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Page lines  –  left */}
      <line x1="14" y1="38" x2="28" y2="40" stroke="#f0d48a" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="14" y1="44" x2="28" y2="46" stroke="#f0d48a" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      {/* Page lines  –  right */}
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
    desc: { en: 'Moon phases, Nakshatra & festivals  –  daily grid', hi: 'चन्द्र कला, नक्षत्र और त्योहार  –  दैनिक ग्रिड', sa: 'चन्द्रकलाः, नक्षत्राणि, उत्सवाश्च', ta: 'சந்திர கலைகள், நட்சத்திரம் & திருவிழாக்கள்', te: 'చంద్ర కళలు, నక్షత్రం & పండుగలు', bn: 'চন্দ্র কলা, নক্ষত্র ও উৎসব', kn: 'ಚಂದ್ರ ಕಲೆ, ನಕ್ಷತ್ರ & ಹಬ್ಬಗಳು', mr: 'चंद्र कला, नक्षत्र आणि सण', gu: 'ચંદ્ર કળા, નક્ષત્ર અને તહેવાર', mai: 'चन्द्र कला, नक्षत्र आ पर्व' },
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
    desc: { en: "Saturn's 7.5 year cycle  –  phase & remedies", hi: 'शनि की साढ़े साती  –  चरण और उपाय', sa: 'शनेः साढेसप्तवर्षचक्रम्  –  चरणाः उपचाराश्च', ta: 'சனியின் 7.5 ஆண்டு சுழற்சி  –  கட்டம் & பரிகாரங்கள்', te: 'శని 7.5 సంవత్సరాల చక్రం  –  దశ & పరిహారాలు', bn: 'শনির ৭.৫ বছরের চক্র  –  পর্ব ও প্রতিকার', kn: 'ಶನಿ 7.5 ವರ್ಷಗಳ ಚಕ್ರ  –  ಹಂತ & ಪರಿಹಾರಗಳು', mr: 'शनीची साडेसाती  –  टप्पे आणि उपाय', gu: 'શનિની સાડાસાતી  –  તબક્કા અને ઉપાય', mai: 'शनिक साढ़ेसाती  –  चरण आ उपाय' },
  },
  {
    href: '/prashna', glowColor: '#a78bfa',
    svg: <PrashnaSVG />,
    subtitle: { en: 'Horary', hi: 'होरेरी', ta: 'ஹோரேரி', bn: 'হোরারি' },
    label: { en: 'Prashna Kundali', hi: 'प्रश्न कुण्डली', sa: 'प्रश्नकुण्डली', ta: 'பிரச்ன ஜாதகம்', te: 'ప్రశ్న జాతకం', bn: 'প্রশ্ন জাতক', kn: 'ಪ್ರಶ್ನ ಜಾತಕ', mr: 'प्रश्न कुंडली', gu: 'પ્રશ્ન કુંડળી', mai: 'प्रश्न कुंडली' },
    desc: { en: 'Horary astrology  –  instant answers to questions', hi: 'होरेरी ज्योतिष  –  प्रश्नों के तत्काल उत्तर', sa: 'होराज्योतिषम्  –  प्रश्नानां तात्कालिकोत्तराणि', ta: 'ஹோரேரி ஜோதிடம்  –  கேள்விகளுக்கு உடனடி பதில்கள்', te: 'హోరరీ జ్యోతిషం  –  ప్రశ్నలకు తక్షణ సమాధానాలు', bn: 'হোরারি জ্যোতিষ  –  প্রশ্নের তাৎক্ষণিক উত্তর', kn: 'ಹೋರರಿ ಜ್ಯೋತಿಷ  –  ಪ್ರಶ್ನೆಗಳಿಗೆ ತಕ್ಷಣದ ಉತ್ತರಗಳು', mr: 'होरारी ज्योतिष  –  प्रश्नांची तात्काळ उत्तरे', gu: 'હોરરી જ્યોતિષ  –  પ્રશ્નોના તાત્કાલિક જવાબો', mai: 'होरेरी ज्योतिष  –  प्रश्नक तत्काल उत्तर' },
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
  { href: '/rahu-kaal', label: { en: 'Rahu Kaal Today', hi: 'आज का राहु काल', ta: 'இன்றைய ராகு காலம்', te: 'నేటి రాహు కాలం', bn: 'আজকের রাহু কাল', kn: 'ಇಂದಿನ ರಾಹು ಕಾಲ', gu: 'આજનો રાહુ કાળ', mai: 'आजुक राहु काल' }, gradient: 'from-red-600/10 to-transparent', border: 'border-red-500/15 hover:border-red-500/30' },
  { href: '/choghadiya', label: { en: 'Choghadiya Today', hi: 'आज का चौघड़िया', ta: 'இன்றைய சோகடியா', te: 'నేటి చౌఘడియా', bn: 'আজকের চৌঘড়িয়া', kn: 'ಇಂದಿನ ಚೌಘಡಿಯಾ', gu: 'આજનું ચોઘડિયું', mai: 'आजुक चौघड़िया' }, gradient: 'from-amber-500/8 to-transparent', border: 'border-amber-500/10 hover:border-amber-500/25' },
  { href: '/gauri-panchang', label: { en: 'Gauri Panchang Today', hi: 'आज का गौरी पंचांग', ta: 'இன்றைய கௌரி பஞ்சாங்கம்', te: 'నేటి గౌరి పంచాంగం', bn: 'আজকের গৌরী পঞ্চাঙ্গ', kn: 'ಇಂದಿನ ಗೌರಿ ಪಂಚಾಂಗ', gu: 'આજનું ગૌરી પંચાંગ', mai: 'आजुक गौरी पंचांग' }, gradient: 'from-emerald-500/8 to-transparent', border: 'border-emerald-500/10 hover:border-emerald-500/25' },
  { href: '/hora', label: { en: 'Hora Chart Today', hi: 'आज का होरा', ta: 'இன்றைய ஹோரா', te: 'నేటి హోరా', bn: 'আজকের হোরা', kn: 'ಇಂದಿನ ಹೋರಾ', gu: 'આજનો હોરા', mai: 'आजुक होरा' }, gradient: 'from-blue-500/8 to-transparent', border: 'border-blue-500/10 hover:border-blue-500/25' },
  { href: '/calendar/regional/bengali',  label: { en: 'Bengali Calendar',   hi: 'बंगाली पंचांग',    ta: 'வங்காள நாள்காட்டி',     te: 'బెంగాలీ క్యాలెండర్',  bn: 'বাংলা পঞ্জিকা',        kn: 'ಬೆಂಗಾಲಿ ಪಂಚಾಂಗ',     gu: 'બંગાળી પંચાંગ',     mai: 'बंगाली पंचांग'   }, gradient: 'from-orange-500/8 to-transparent', border: 'border-orange-500/10 hover:border-orange-500/25' },
  // 6 regional calendars added 2026-06-11 (SEO Item 10) — only Bengali
  // was 1-click reachable from homepage; the other 6 were 2+ clicks via
  // /calendar/regional. Each tile uses the same gradient family as the
  // /calendar/regional/<lang>/page.tsx hero so the homepage visual maps
  // to the destination chrome.
  { href: '/calendar/regional/gujarati', label: { en: 'Gujarati Calendar',  hi: 'गुजराती पंचांग',   ta: 'குஜராத்தி நாள்காட்டி',  te: 'గుజరాతీ క్యాలెండర్',  bn: 'গুজরাটি পঞ্জিকা',      kn: 'ಗುಜರಾತಿ ಪಂಚಾಂಗ',     gu: 'ગુજરાતી પંચાંગ',    mai: 'गुजराती पंचांग'  }, gradient: 'from-rose-500/8 to-transparent',   border: 'border-rose-500/10 hover:border-rose-500/25' },
  { href: '/calendar/regional/tamil',    label: { en: 'Tamil Calendar',     hi: 'तमिल पंचांग',       ta: 'தமிழ் நாள்காட்டி',       te: 'తమిళ క్యాలెండర్',     bn: 'তামিল পঞ্জিকা',        kn: 'ತಮಿಳು ಪಂಚಾಂಗ',        gu: 'તમિલ પંચાંગ',       mai: 'तमिल पंचांग'    }, gradient: 'from-red-500/8 to-transparent',    border: 'border-red-500/10 hover:border-red-500/25' },
  { href: '/calendar/regional/telugu',   label: { en: 'Telugu Calendar',    hi: 'तेलुगु पंचांग',     ta: 'தெலுங்கு நாள்காட்டி',    te: 'తెలుగు క్యాలెండర్',   bn: 'তেলুগু পঞ্জিকা',       kn: 'ತೆಲುಗು ಪಂಚಾಂಗ',       gu: 'તેલુગુ પંચાંગ',     mai: 'तेलुगु पंचांग'   }, gradient: 'from-amber-600/8 to-transparent',  border: 'border-amber-500/10 hover:border-amber-500/25' },
  { href: '/calendar/regional/kannada',  label: { en: 'Kannada Calendar',   hi: 'कन्नड़ पंचांग',    ta: 'கன்னட நாள்காட்டி',      te: 'కన్నడ క్యాలెండర్',    bn: 'কন্নড় পঞ্জিকা',       kn: 'ಕನ್ನಡ ಪಂಚಾಂಗ',        gu: 'કન્નડ પંચાંગ',      mai: 'कन्नड़ पंचांग'  }, gradient: 'from-yellow-500/8 to-transparent', border: 'border-yellow-500/10 hover:border-yellow-500/25' },
  { href: '/calendar/regional/odia',     label: { en: 'Odia Calendar',      hi: 'ओड़िआ पंचांग',     ta: 'ஒடியா நாள்காட்டி',       te: 'ఒడియా క్యాలెండర్',    bn: 'ওড়িয়া পঞ্জিকা',      kn: 'ಒಡಿಯಾ ಪಂಚಾಂಗ',        gu: 'ઓડિયા પંચાંગ',      mai: 'ओड़िआ पंचांग'   }, gradient: 'from-violet-500/8 to-transparent', border: 'border-violet-500/10 hover:border-violet-500/25' },
  { href: '/calendar/regional/mithila',  label: { en: 'Mithila Panchang',   hi: 'मिथिला पंचांग',    ta: 'மிதிலா நாள்காட்டி',     te: 'మిథిలా క్యాలెండర్',   bn: 'মিথিলা পঞ্জিকা',       kn: 'ಮಿಥಿಲಾ ಪಂಚಾಂಗ',       gu: 'મિથિલા પંચાંગ',     mai: 'मिथिला पंचांग'  }, gradient: 'from-fuchsia-500/8 to-transparent',border: 'border-fuchsia-500/10 hover:border-fuchsia-500/25' },
  { href: '/retrograde', label: { en: 'Retrograde Calendar', hi: 'वक्री पंचांग', ta: 'வக்ர நாள்காட்டி', te: 'వక్ర పంచాంగం', bn: 'বক্র পঞ্চাঙ্গ', kn: 'ವಕ್ರ ಪಂಚಾಂಗ', mr: 'वक्री पंचांग', gu: 'વક્રી પંચાંગ', mai: 'वक्री पंचांग' }, gradient: 'from-red-500/8 to-transparent', border: 'border-red-500/10 hover:border-red-500/25' },
  { href: '/eclipses', label: { en: 'Eclipse Calendar', hi: 'ग्रहण पंचांग', ta: 'கிரகண நாள்காட்டி', te: 'గ్రహణ పంచాంగం', bn: 'গ্রহণ পঞ্চাঙ্গ', kn: 'ಗ್ರಹಣ ಪಂಚಾಂಗ', mr: 'ग्रहण पंचांग', gu: 'ગ્રહણ પંચાંગ', mai: 'ग्रहण पंचांग' }, gradient: 'from-purple-500/8 to-transparent', border: 'border-purple-500/10 hover:border-purple-500/25' },
  { href: '/muhurta-ai', label: { en: 'Muhurat Finder', hi: 'मुहूर्त खोजक', ta: 'முகூர்த்தம் தேடி', te: 'ముహూర్తం అన్వేషణ', bn: 'মুহূর্ত অনুসন্ধান', kn: 'ಮುಹೂರ್ತ ಹುಡುಕಾಟ', mr: 'मुहूर्त शोधक', gu: 'મુહૂર્ત શોધક', mai: 'मुहूर्त खोजक' }, gradient: 'from-emerald-500/8 to-transparent', border: 'border-emerald-500/10 hover:border-emerald-500/25' },
  { href: '/career-muhurta', label: { en: 'Career Muhurta', hi: 'करियर मुहूर्त', ta: 'தொழில் முகூர்த்தம்', te: 'కెరీర్ ముహూర్తం', bn: 'কেরিয়ার মুহূর্ত', kn: 'ಕೆರಿಯರ್ ಮುಹೂರ್ತ', mr: 'करियर मुहूर्त', gu: 'કેરિયર મુહૂર્ત', mai: 'करियर मुहूर्त' }, gradient: 'from-cyan-500/8 to-transparent', border: 'border-cyan-500/10 hover:border-cyan-500/25' },
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
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });

  // ─── Server-side panchang via Vercel geo headers (eliminates LCP waterfall) ───
  //
  // On Vercel: read `x-vercel-ip-*` headers and SSR-compute panchang for the
  // user's nearest edge location.
  //
  // OFF Vercel (local dev, non-Vercel deployments): the headers don't exist
  // and the Daily Cosmic Briefing previously disappeared entirely — `null`
  // serverPanchang propagated to <HomeClientWidgets> which rendered nothing.
  // External audit caught this as a functionality gap. Fallback to the
  // locale-canonical city — Delhi (en/hi), Chennai (ta), Kolkata (bn),
  // etc. — so the section renders consistently across environments AND
  // bot-indexed HTML shows a city the target audience recognises rather
  // than an accidental US datacentre from Vercel geo. The client widget
  // still re-fetches if the user has a saved location, so this default
  // only shows for first-time anon users on non-Vercel.
  const localeDefault = getLocaleDefaultCity(locale);
  const DEFAULT_FALLBACK = {
    lat: localeDefault.lat,
    lng: localeDefault.lng,
    name: localeDefault.displayName,
    timezone: localeDefault.timezone,
  };

  let serverPanchang: PanchangData | null = null;
  let serverLocation: { lat: number; lng: number; name: string } | null = null;
  try {
    const hdrs = await headers();
    const isBot = isBotUserAgent(hdrs.get('user-agent'));
    const geoLat = hdrs.get('x-vercel-ip-latitude');
    const geoLng = hdrs.get('x-vercel-ip-longitude');
    const geoCity = hdrs.get('x-vercel-ip-city');
    const geoCountry = hdrs.get('x-vercel-ip-country');
    const geoTz = hdrs.get('x-vercel-ip-timezone');

    let lat: number;
    let lng: number;
    let locationName: string;
    let timezone: string;
    // Bots skip geo entirely — Googlebot's US datacentre coordinates
    // otherwise seeped into indexed HTML and tanked ranking on Indian
    // panchang head-term queries. NaN guard prevents a malformed
    // header (e.g. Vercel emitting "-" or an empty float) from
    // silently poisoning computePanchang — falls through to the
    // locale-default city instead. PR #735 Gemini round-2 MEDIUM.
    const parsedLat = geoLat ? parseFloat(geoLat) : NaN;
    const parsedLng = geoLng ? parseFloat(geoLng) : NaN;
    if (!isBot && Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
      lat = parsedLat;
      lng = parsedLng;
      locationName = [geoCity ? decodeURIComponent(geoCity) : '', geoCountry || ''].filter(Boolean).join(', ');
      timezone = geoTz || 'UTC';
    } else {
      lat = DEFAULT_FALLBACK.lat;
      lng = DEFAULT_FALLBACK.lng;
      locationName = DEFAULT_FALLBACK.name;
      timezone = DEFAULT_FALLBACK.timezone;
    }
    // Use the user's timezone to determine "today" — not server UTC (Lesson L).
    // On Vercel (UTC), new Date() at 02:00 IST would give yesterday's date for
    // Indian users.
    //
    // Use Intl.DateTimeFormat.formatToParts (not new Date(toLocaleString))
    // — the toLocaleString round-trip is locale-sensitive and on some Node
    // versions silently swaps day/month or produces Invalid Date on edge
    // locales (Gemini PR #476 round-3 HIGH). formatToParts hands back tagged
    // numerics that we can read directly.
    const dtParts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).formatToParts(new Date());
    const year = Number(dtParts.find(p => p.type === 'year')?.value);
    const month = Number(dtParts.find(p => p.type === 'month')?.value);
    const day = Number(dtParts.find(p => p.type === 'day')?.value);
    const tzOffset = getUTCOffsetForDate(year, month, day, timezone);
    serverPanchang = computePanchang({ year, month, day, lat, lng, tzOffset, timezone, locationName });
    serverLocation = { lat, lng, name: locationName };
  } catch (err) {
    // Computation error (not just missing headers) — log so it shows in Vercel logs.
    console.error('[home] SSR panchang failed:', err);
  }
  const isDevanagari = isDevanagariLocale(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale) || {};

  return (
    <div className="relative">
      {/* ═══ HERO: Mantras + CTAs — sit just under the navbar ═══ */}
      <section className="relative pt-3 pb-3 sm:pt-4 sm:pb-4 px-4 overflow-hidden">
        {/* Background: radial gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-br from-gold-primary/5 via-transparent to-gold-dark/3 blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto relative z-10 stagger-children">
          {/* Gayatri Mantra  –  small, reverent, with sacred reveal */}
          <p className="text-gold-primary/60 text-xs sm:text-sm tracking-[0.2em] leading-relaxed mb-2 sacred-text-reveal"
            style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
            ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥
          </p>

          {/* Shloka  –  immediately after Gayatri, quiet/fading */}
          <p className="text-gold-primary/40 text-xs sm:text-sm tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
            तमसो मा ज्योतिर्गमय
          </p>

          {/* Main tagline — smaller. Wraps naturally on narrow screens
              (no `whitespace-nowrap` — translated strings can exceed
              320 px and force horizontal overflow). */}
          <h1 className="text-base sm:text-lg md:text-xl font-semibold mb-4 leading-tight" style={hf}>
            <span className="text-gold-gradient">{t('tagline')}</span>
          </h1>

          {/*
            ─── Capability density strip ───
            Inserted 2026-06-02 to address LLM-grounding failures (Gemini
            mischaracterised the site as a "simple calendar app"). This
            is the first ItemList Google + Gemini retrieve after the H1.
            Each chip is a real Link to a working tool — internal link
            equity flows from this strip to every priority surface.

            Marked up as <nav> (not <div>) so crawlers read it as
            navigation rather than body content — protects against the
            anchor-spam pattern flag.

            All 9 visible locales have their own intro text + chip
            labels (catalog enforces 9-locale completeness for prominent
            features). NO Hindi fallback for Devanagari locales — the
            May 2026 Core Update demotion was triggered by exactly that
            fallback in the SEO templates; see feedback_gsc_use_adc and
            the broader 2026-06-01-recovery-plan spec.

            Lesson ZD compliant — pure server render, no clock-reading
            client mounts, no hydration risk.
          */}
          <nav
            aria-label={L({
              en: 'Capabilities',
              hi: 'क्षमताएं',
              ta: 'திறன்கள்',
              te: 'సామర్థ్యాలు',
              bn: 'সক্ষমতা',
              gu: 'ક્ષમતાઓ',
              kn: 'ಸಾಮರ್ಥ್ಯಗಳು',
              mr: 'क्षमता',
              mai: 'क्षमता',
            }, locale)}
            className="mt-2 mb-6"
          >
            <p className="text-text-secondary/85 text-xs sm:text-sm mb-3 leading-relaxed">
              {CAPABILITY_INTRO[locale] ?? CAPABILITY_INTRO.en}
            </p>
            <ul
              className="flex flex-wrap gap-2 justify-center min-h-[44px] sm:min-h-[36px]"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              <meta itemProp="itemListOrder" content="https://schema.org/ItemListOrderAscending" />
              <meta itemProp="numberOfItems" content="10" />
              {getProminentFeatures().map((f, i) => {
                const label = getFeatureLabel(f.name, locale);
                return (
                  <li
                    key={f.href}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <meta itemProp="position" content={String(i + 1)} />
                    <Link
                      href={f.href as `/${string}`}
                      itemProp="item"
                      className="inline-block px-3 py-1 rounded-full border border-gold-primary/25 text-text-primary/85 text-xs hover:border-gold-primary/60 hover:text-gold-light focus-visible:ring-2 focus-visible:ring-gold-primary/40 focus-visible:outline-none transition-colors"
                    >
                      <span itemProp="name">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Three bold CTAs — Birth Chart (primary), Today's Forecast, Auspicious Timing */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/kundali" className="px-8 py-3 rounded-xl bg-gold-primary/20 border-2 border-gold-primary/50 text-gold-light font-bold text-sm hover:bg-gold-primary/30 transition-all hover:-translate-y-0.5 shadow-lg shadow-gold-primary/10">
              {L({ en: 'Generate Your Birth Chart', hi: 'अपनी जन्म कुण्डली बनाएं', ta: 'உங்கள் ஜாதகம் உருவாக்குங்கள்', bn: 'আপনার জাতক তৈরি করুন', te: "మీ జన్మ కుండలిని రూపొందించండి", gu: "તમારી જન્મ કુંડળી બનાવો", kn: "ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿ ರಚಿಸಿ", mai: "अहाँक जन्म कुण्डली बनाउ", mr: "तुमची जन्मकुंडली तयार करा" }, locale)}
            </Link>
            <Link href="/panchang" className="px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light font-bold text-sm hover:bg-gold-primary/20 transition-all hover:-translate-y-0.5">
              {L({ en: "Today's Forecast", hi: 'आज का पञ्चाङ्ग', ta: 'இன்றைய பஞ்சாங்கம்', bn: 'আজকের পঞ্চাঙ্গ', te: "నేటి పంచాంగం", gu: "આજનું પંચાંગ", kn: "ಇಂದಿನ ಪಂಚಾಂಗ", mai: "आजुक पञ्चाङ्ग", mr: "आजचे पंचांग" }, locale)}
            </Link>
            <Link href="/muhurta-ai" className="px-6 py-3 rounded-xl bg-emerald-900/30 border border-emerald-400/20 text-emerald-300 font-bold text-sm hover:bg-emerald-900/50 transition-all hover:-translate-y-0.5">
              {L({ en: 'Find Auspicious Times', hi: 'शुभ मुहूर्त खोजें', ta: 'சுப முகூர்த்தம் கண்டறியுங்கள்', bn: 'শুভ মুহূর্ত খুঁজুন', te: "శుభ ముహూర్తాలను కనుగొనండి", gu: "શુભ મુહૂર્ત શોધો", kn: "ಶುಭ ಮುಹೂರ್ತಗಳನ್ನು ಹುಡುಕಿ", mai: "शुभ मुहूर्त खोजू", mr: "शुभ मुहूर्त शोधा" }, locale)}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ BRIHASPATI RIBBON — full-bleed across the page ═══ */}
      <BrihaspatiHomeBanner />

      {/* ═══ TODAY'S PANCHANG  –  immediately after hero ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 yantra-bg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={hf}>
          <span className="text-gold-gradient">{t('todayPanchang')}</span>
        </h2>
        <p className="text-text-secondary text-sm text-center mb-8">
          {L({ en: 'The five elements of today\'s Vedic astronomical calendar — computed for your location', hi: 'आज के वैदिक खगोलीय कालदर्शिका के पाँच अंग — आपके स्थान के लिए गणित', ta: 'இன்றைய வேத வானியல் நாட்காட்டியின் ஐந்து அங்கங்கள்', bn: 'আজকের বৈদিক জ্যোতির্বিদ্যা ক্যালেন্ডারের পাঁচটি উপাদান', te: "నేటి వైదిక ఖగోళ కాలదర్శిని యొక్క ఐదు అంశాలు — మీ స్థానం కోసం గణించబడినవి", gu: "આજના વૈદિક ખગોળીય કાલદર્શિકાના પાંચ અંગ — તમારા સ્થાન માટે ગણતરી કરેલ", kn: "ಇಂದಿನ ವೈದಿಕ ಖಗೋಳ ಪಂಚಾಂಗದ ಐದು ಅಂಗಗಳು — ನಿಮ್ಮ ಸ್ಥಳಕ್ಕಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ", mai: "आजुक वैदिक खगोलीय कालदर्शिकाक पाँच अंग — अहाँक स्थानक लेल गणित", mr: "आजच्या वैदिक खगोलशास्त्रीय दिनदर्शिकेचे पाच घटक — तुमच्या स्थानानुसार गणना केलेले" }, locale)}
        </p>
        {/* min-h prevents CLS when client widget hydrates and expands */}
        <div className="min-h-[400px] sm:min-h-[350px]">
          <HomeClientWidgets locale={locale} serverPanchang={serverPanchang} serverLocation={serverLocation} />
        </div>
      </section>

      {/* ═══ DAILY COSMIC BRIEFING  –  server-rendered narrative from today's panchang ═══ */}
      {/* Energy score removed (May 2026): a 0-10 integer implied more precision
          than the heuristic could justify. Narrative + Do/Don't + timing bar
          carry the same information without the false-accuracy framing. */}
      {serverPanchang && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" suppressHydrationWarning>
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              {/* Header row */}
              <div className="flex items-center gap-3 mb-5">
                <Zap className="w-5 h-5 text-gold-primary" />
                <h2 className="text-xl sm:text-2xl font-bold" style={hf}>
                  <span className="text-gold-gradient">
                    {L({ en: 'Daily Cosmic Briefing', hi: 'दैनिक ब्रह्माण्डीय सारांश', ta: 'தினசரி அண்ட சுருக்கம்', bn: 'দৈনিক মহাজাগতিক সারাংশ', te: "దైనందిన బ్రహ్మాండ సారాంశం", gu: "દૈનિક બ્રહ્માંડીય સારાંશ", kn: "ದೈನಿಕ ಬ್ರಹ್ಮಾಂಡದ ಸಾರಾಂಶ", mai: "दैनिक ब्रह्माण्डीय सारांश", mr: "दैनिक ब्रह्मांडीय सारांश" }, locale)}
                  </span>
                </h2>
              </div>

              <div>
                {/* Briefing body — persona-aware client component. On
                    hydration, swaps to the Acharya classical register
                    if the user is in Acharya mode. SSR renders the
                    default (Enthusiast) so the static HTML stays
                    cacheable for SEO. Spec PR-3. */}
                <DailyBriefingBody
                  panchang={serverPanchang}
                  locale={locale}
                  bodyFont={bf}
                />

                  {/* Timing bar. The Abhijit badge respects the same
                      Wednesday-exclusion gate the narrative engine uses
                      (abhijitMuhurta.available !== false). Without this
                      gate the badge would show a green "Abhijit X-Y" on
                      Wednesdays while the narrative just above declared
                      the slot ineligible per Muhurta Chintamani. Gemini
                      PR #388 cycle-2 HIGH. */}
                  {(serverPanchang.rahuKaal?.start || (serverPanchang.abhijitMuhurta?.start && serverPanchang.abhijitMuhurta?.available !== false)) && (
                    <div className="mt-5 flex flex-wrap gap-3 text-xs" style={bf}>
                      {serverPanchang.abhijitMuhurta?.start && serverPanchang.abhijitMuhurta.available !== false && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">
                            {L({ en: 'Abhijit', hi: 'अभिजित', ta: 'அபிஜித்', bn: 'অভিজিৎ', te: "అభిజిత్", gu: "અભિજિત", kn: "ಅಭಿಜಿತ್", mai: "अभिजित", mr: "अभिजित" }, locale)} {serverPanchang.abhijitMuhurta.start}–{serverPanchang.abhijitMuhurta.end}
                          </span>
                        </div>
                      )}
                      {serverPanchang.rahuKaal?.start && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                          <Clock className="w-3.5 h-3.5 text-red-400" />
                          <span className="text-red-300">
                            {L({ en: 'Rahu Kaal', hi: 'राहु काल', ta: 'ராகு காலம்', bn: 'রাহু কাল', te: "రాహు కాలం", gu: "રાહુ કાળ", kn: "ರಾಹು ಕಾಲ", mai: "राहु काल", mr: "राहु काल" }, locale)} {serverPanchang.rahuKaal.start}–{serverPanchang.rahuKaal.end}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Full Panchang link */}
                  <div className="mt-5">
                    <Link href="/panchang" className="text-gold-primary hover:text-gold-light text-sm font-medium transition-colors inline-flex items-center gap-1.5">
                      {L({ en: 'Full Panchang', hi: 'पूर्ण पञ्चाङ्ग', ta: 'முழு பஞ்சாங்கம்', bn: 'পূর্ণ পঞ্চাঙ্গ', te: "పూర్తి పంచాంగం", gu: "પૂર્ણ પંચાંગ", kn: "ಪೂರ್ಣ ಪಂಚಾಂಗ", mai: "पूर्ण पञ्चाङ्ग", mr: "पूर्ण पंचांग" }, locale)} &rarr;
                    </Link>
                  </div>
              </div>
            </div>
          </section>
      )}

      {/* ═══ PROFILE BANNER  –  for logged-in users, above the cards ═══ */}
      <ProfileBanner locale={locale} bf={bf} />

      {/* ═══ EXPLORE TOOLS  –  compact tarot card grid ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2" style={hf}>
            <span className="text-gold-gradient">{t('exploreTools')}</span>
          </h2>
          <p className="text-text-secondary text-xs sm:text-sm max-w-xl mx-auto" style={bf}>
            {t('exploreToolsDesc')}
          </p>
        </div>

        {/* Cards fill their cell (size=full) so text never truncates.
            4-col grid on desktop (was 3) makes each card narrower than
            the original chunky layout but still wide enough for the
            title + description to breathe. Tight gap keeps the section
            dense. */}
        {(() => {
          // Reorder: Birth Chart (0), Festivals (2), Learn (8) first, then rest
          const row1Indices = [0, 2, 8];
          const restIndices = [1, 3, 4, 5, 6, 7];
          const ordered = [...row1Indices, ...restIndices].map(i => HERO_CARDS[i]);
          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2 stagger-children">
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

      {/* ═══ SECONDARY TOOLS  –  pill chips ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2.5 justify-center stagger-children">
          {SECONDARY_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <div className={`rounded-xl bg-gradient-to-br ${tool.gradient} border ${tool.border} px-4 py-3 transition-all duration-200 group-hover:-translate-y-0.5`}>
                <span className="text-text-secondary group-hover:text-text-primary text-sm font-medium transition-colors" style={bf}>
                  {L(tool.label, locale)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ EDITORIAL  –  crawlable content for SEO ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 border-t border-gold-primary/8">
        <h2 className="text-lg font-semibold text-gold-dark/80 mb-4" style={hf}>
          {L({ en: 'What is Panchang?', hi: 'पंचांग क्या है?', ta: 'பஞ்சாங்கம் என்றால் என்ன?', bn: 'পঞ্চাঙ্গ কী?', te: "పంచాంగం అంటే ఏమిటి?", gu: "પંચાંગ શું છે?", kn: "ಪಂಚಾಂಗ ಎಂದರೇನು?", mai: "पञ्चाङ्ग की अछि?", mr: "पंचांग म्हणजे काय?" }, locale)}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bf}>
          {L({ en: 'Panchang (पञ्चाङ्ग) is the traditional Hindu almanac that tracks five key astronomical elements every day: Tithi (lunar day), Nakshatra (lunar mansion), Yoga (luni-solar combination), Karana (half-tithi), and Vara (weekday). For thousands of years, these five limbs have guided daily rituals, agriculture, medicine, and all auspicious timing decisions across the Indian subcontinent. Each element carries specific energetic qualities that influence the nature of the day  –  from whether it is suitable for starting a new venture to whether it is a day for rest and reflection.', hi: 'पंचांग (पञ्चाङ्ग) पारम्परिक हिन्दू पंचांग है जो प्रतिदिन पाँच प्रमुख खगोलीय तत्त्वों को ट्रैक करता है: तिथि (चन्द्र दिवस), नक्षत्र (चन्द्र भवन), योग (सूर्य-चन्द्र संयोजन), करण (अर्ध-तिथि), और वार (सप्ताह दिवस)। हजारों वर्षों से ये पाँच अंग दैनिक अनुष्ठानों, कृषि, चिकित्सा और सभी शुभ समय निर्णयों का मार्गदर्शन करते आए हैं।', ta: 'பஞ்சாங்கம் என்பது ஐந்து முக்கிய வானியல் கூறுகளை தினமும் கண்காணிக்கும் பாரம்பரிய இந்து நாட்காட்டி: திதி, நட்சத்திரம், யோகம், கரணம் மற்றும் வாரம்.', bn: 'পঞ্চাঙ্গ হল ঐতিহ্যবাহী হিন্দু পঞ্জিকা যা প্রতিদিন পাঁচটি প্রধান জ্যোতির্বিদ্যাগত উপাদান ট্র্যাক করে: তিথি, নক্ষত্র, যোগ, করণ এবং বার।', te: "పంచాంగం (పఞ్చాఙ్గ) అనేది ప్రతిరోజూ ఐదు ముఖ్యమైన ఖగోళ అంశాలను ట్రాక్ చేసే సాంప్రదాయ హిందూ పంచాంగం: తిథి (చంద్ర దినం), నక్షత్రం (చంద్ర గృహం), యోగం (చంద్ర-సూర్య కలయిక), కరణం (అర్ధ-తిథి), మరియు వారం (వారపు రోజు). వేల సంవత్సరాలుగా, ఈ ఐదు అంగాలు రోజువారీ ఆచారాలు, వ్యవసాయం, వైద్యం మరియు భారత ఉపఖండం అంతటా అన్ని శుభ సమయ నిర్ణయాలకు మార్గనిర్దేశం చేశాయి. ప్రతి అంశం రోజు స్వభావాన్ని ప్రభావితం చేసే నిర్దిష్ట శక్తివంతమైన లక్షణాలను కలిగి ఉంటుంది – కొత్త వ్యాపారాన్ని ప్రారంభించడానికి ఇది అనుకూలమైనదా లేదా విశ్రాంతి మరియు ధ్యానం కోసం ఒక రోజునా అనే దాని నుండి.", gu: "પંચાંગ (પંચાંગ) એ પરંપરાગત હિંદુ પંચાંગ છે જે દરરોજ પાંચ મુખ્ય ખગોળીય તત્વોને ટ્રૅક કરે છે: તિથિ (ચંદ્ર દિવસ), નક્ષત્ર (ચંદ્ર નક્ષત્ર), યોગ (ચંદ્ર-સૂર્ય સંયોજન), કરણ (અર્ધ-તિથિ), અને વાર (અઠવાડિયાનો દિવસ). હજારો વર્ષોથી, આ પાંચ અંગોએ ભારતીય ઉપખંડમાં દૈનિક વિધિઓ, કૃષિ, દવા અને તમામ શુભ સમયના નિર્ણયોનું માર્ગદર્શન કર્યું છે. દરેક તત્વ ચોક્કસ ઊર્જાવાન ગુણધર્મો ધરાવે છે જે દિવસના સ્વભાવને પ્રભાવિત કરે છે – પછી ભલે તે નવું સાહસ શરૂ કરવા માટે યોગ્ય હોય કે આરામ અને ચિંતનનો દિવસ હોય.", kn: "ಪಂಚಾಂಗ (पञ्चाङ्ग) ಎಂಬುದು ಸಾಂಪ್ರದಾಯಿಕ ಹಿಂದೂ ಪಂಚಾಂಗವಾಗಿದ್ದು, ಇದು ಪ್ರತಿದಿನ ಐದು ಪ್ರಮುಖ ಖಗೋಳ ಅಂಶಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ: ತಿಥಿ (ಚಂದ್ರ ದಿನ), ನಕ್ಷತ್ರ (ಚಂದ್ರ ನಕ್ಷತ್ರ), ಯೋಗ (ಚಂದ್ರ-ಸೌರ ಸಂಯೋಜನೆ), ಕರಣ (ಅರ್ಧ-ತಿಥಿ), ಮತ್ತು ವಾರ (ವಾರದ ದಿನ). ಸಾವಿರಾರು ವರ್ಷಗಳಿಂದ, ಈ ಐದು ಅಂಗಗಳು ದೈನಂದಿನ ಆಚರಣೆಗಳು, ಕೃಷಿ, ವೈದ್ಯಕೀಯ ಮತ್ತು ಭಾರತೀಯ ಉಪಖಂಡದಾದ್ಯಂತ ಎಲ್ಲಾ ಶುಭ ಸಮಯದ ನಿರ್ಧಾರಗಳಿಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಿವೆ. ಪ್ರತಿಯೊಂದು ಅಂಶವು ದಿನದ ಸ್ವರೂಪವನ್ನು ಪ್ರಭಾವಿಸುವ ನಿರ್ದಿಷ್ಟ ಶಕ್ತಿಯ ಗುಣಗಳನ್ನು ಹೊಂದಿರುತ್ತದೆ – ಹೊಸ ಉದ್ಯಮವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಸೂಕ್ತವೇ ಅಥವಾ ವಿಶ್ರಾಂತಿ ಮತ್ತು ಚಿಂತನೆಗೆ ದಿನವೇ ಎಂಬುದರಿಂದ.", mai: "पञ्चाङ्ग (पञ्चाङ्ग) पारम्परिक हिन्दू पञ्चाङ्ग अछि जे प्रतिदिन पाँचटा प्रमुख खगोलीय तत्वकेँ ट्रैक करैत अछि: तिथि (चन्द्र दिवस), नक्षत्र (चन्द्र भवन), योग (सूर्य-चन्द्र संयोजन), करण (अर्ध-तिथि), आओर वार (सप्ताह दिवस)। हजारो वर्षसँ ई पाँचो अंग दैनिक अनुष्ठान, कृषि, चिकित्सा, आओर सभटा शुभ समयक निर्णयमे मार्गदर्शन करैत आयल अछि।", mr: "पंचांग (पञ्चाङ्ग) हे पारंपारिक हिंदू पंचांग आहे जे दररोज पाच प्रमुख खगोलशास्त्रीय घटकांचा मागोवा घेते: तिथी (चंद्र दिवस), नक्षत्र (चंद्र नक्षत्र), योग (चंद्र-सूर्य संयोजन), करण (अर्ध-तिथी) आणि वार (आठवड्याचा दिवस). हजारो वर्षांपासून, हे पाच घटक दैनंदिन विधी, शेती, औषधोपचार आणि भारतीय उपखंडातील सर्व शुभ वेळेच्या निर्णयांना मार्गदर्शन करत आले आहेत. प्रत्येक घटकात विशिष्ट ऊर्जावान गुणधर्म असतात जे दिवसाच्या स्वरूपावर परिणाम करतात – नवीन उपक्रम सुरू करण्यासाठी तो योग्य आहे की नाही किंवा तो विश्रांती आणि आत्मचिंतनाचा दिवस आहे की नाही यावर." }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-6" style={bf}>
          {L({ en: 'Dekho Panchang computes all five elements in real time using astronomical algorithms based on Jean Meeus\'s "Astronomical Algorithms"  –  the same mathematical foundation used by NASA and modern observatories. Unlike most Panchang websites that rely on pre-computed tables or external APIs, every calculation here runs locally in your browser with sub-arcminute precision. The result is a Panchang that is accurate for any location on Earth, not just Indian cities  –  whether you are in New York, London, Sydney, or Varanasi, your sunrise, sunset, and muhurta timings reflect your exact coordinates.', hi: 'देखो पंचांग जीन मीयस के "Astronomical Algorithms" पर आधारित खगोलीय एल्गोरिदम का उपयोग करके सभी पाँच तत्त्वों की वास्तविक समय में गणना करता है  –  वही गणितीय आधार जिसका NASA और आधुनिक वेधशालाएँ उपयोग करती हैं। अधिकांश पंचांग वेबसाइटों के विपरीत जो पूर्व-गणित तालिकाओं या बाहरी API पर निर्भर करती हैं, यहाँ प्रत्येक गणना उप-आर्कमिनट सटीकता से स्थानीय रूप से चलती है।', ta: 'தெகோ பஞ்சாங்கம் ஜீன் மீயஸின் வானியல் கணிதத்தின் அடிப்படையில் அனைத்து ஐந்து கூறுகளையும் நிகழ்நேரத்தில் கணக்கிடுகிறது.', bn: 'দেখো পঞ্চাঙ্গ জিন মিউসের জ্যোতির্বিদ্যা অ্যালগরিদম ব্যবহার করে সমস্ত পাঁচটি উপাদান রিয়েল টাইমে গণনা করে।', te: "దేఖో పంచాంగ్, జీన్ మీయస్ యొక్క “ఆస్ట్రోనామికల్ అల్గోరిథమ్స్” ఆధారంగా ఖగోళ అల్గోరిథమ్‌లను ఉపయోగించి ఐదు అంశాలను నిజ సమయంలో గణిస్తుంది – NASA మరియు ఆధునిక అబ్జర్వేటరీలు ఉపయోగించే అదే గణిత ప్రాతిపదిక. ముందే లెక్కించిన పట్టికలు లేదా బాహ్య APIలపై ఆధారపడే చాలా పంచాంగ వెబ్‌సైట్‌ల వలె కాకుండా, ఇక్కడ ప్రతి గణన మీ బ్రౌజర్‌లో ఉప-ఆర్క్‌మినిట్ ఖచ్చితత్వంతో స్థానికంగా నడుస్తుంది. ఫలితంగా, భారతీయ నగరాలకే కాకుండా భూమిపై ఏ ప్రదేశానికైనా ఖచ్చితమైన పంచాంగం లభిస్తుంది – మీరు న్యూయార్క్, లండన్, సిడ్నీ లేదా వారణాసిలో ఉన్నా, మీ సూర్యోదయం, సూర్యాస్తమయం మరియు ముహూర్త సమయాలు మీ ఖచ్చితమైన అక్షాంశాలను ప్రతిబింబిస్తాయి.", gu: "દેખો પંચાંગ જીન મીયસના “Astronomical Algorithms” પર આધારિત ખગોળીય એલ્ગોરિધમ્સનો ઉપયોગ કરીને તમામ પાંચ તત્વોની વાસ્તવિક સમયમાં ગણતરી કરે છે – તે જ ગાણિતિક આધાર જેનો NASA અને આધુનિક વેધશાળાઓ ઉપયોગ કરે છે. મોટાભાગની પંચાંગ વેબસાઇટ્સથી વિપરીત જે પૂર્વ-ગણતરી કરેલા કોષ્ટકો અથવા બાહ્ય API પર આધાર રાખે છે, અહીં દરેક ગણતરી સબ-આર્કમિનિટ ચોકસાઈ સાથે તમારા બ્રાઉઝરમાં સ્થાનિક રીતે ચાલે છે. પરિણામ એવું પંચાંગ છે જે પૃથ્વી પરના કોઈપણ સ્થાન માટે સચોટ છે, ફક્ત ભારતીય શહેરો માટે જ નહીં – પછી ભલે તમે ન્યુ યોર્ક, લંડન, સિડની કે વારાણસીમાં હોવ, તમારા સૂર્યોદય, સૂર્યાસ્ત અને મુહૂર્તના સમય તમારા ચોક્કસ કોઓર્ડિનેટ્સને પ્રતિબિંબિત કરે છે.", kn: "ದೇಖೋ ಪಂಚಾಂಗವು ಜೀನ್ ಮೀಯಸ್ ಅವರ “Astronomical Algorithms” ಆಧಾರಿತ ಖಗೋಳ ಅಲ್ಗಾರಿದಮ್‌ಗಳನ್ನು ಬಳಸಿಕೊಂಡು ಎಲ್ಲಾ ಐದು ಅಂಶಗಳನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ – NASA ಮತ್ತು ಆಧುನಿಕ ವೀಕ್ಷಣಾಲಯಗಳು ಬಳಸುವ ಅದೇ ಗಣಿತದ ಆಧಾರ. ಪೂರ್ವ-ಲೆಕ್ಕಾಚಾರ ಮಾಡಿದ ಕೋಷ್ಟಕಗಳು ಅಥವಾ ಬಾಹ್ಯ API ಗಳನ್ನು ಅವಲಂಬಿಸಿರುವ ಹೆಚ್ಚಿನ ಪಂಚಾಂಗ ವೆಬ್‌ಸೈಟ್‌ಗಳಿಗಿಂತ ಭಿನ್ನವಾಗಿ, ಇಲ್ಲಿನ ಪ್ರತಿಯೊಂದು ಲೆಕ್ಕಾಚಾರವು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಉಪ-ಆರ್ಕ್‌ಮಿನಿಟ್ ನಿಖರತೆಯೊಂದಿಗೆ ಸ್ಥಳೀಯವಾಗಿ ನಡೆಯುತ್ತದೆ. ಇದರ ಫಲಿತಾಂಶವು ಭೂಮಿಯ ಮೇಲಿನ ಯಾವುದೇ ಸ್ಥಳಕ್ಕೆ ನಿಖರವಾದ ಪಂಚಾಂಗವಾಗಿದೆ, ಕೇವಲ ಭಾರತೀಯ ನಗರಗಳಿಗೆ ಮಾತ್ರವಲ್ಲ – ನೀವು ನ್ಯೂಯಾರ್ಕ್, ಲಂಡನ್, ಸಿಡ್ನಿ ಅಥವಾ ವಾರಣಾಸಿಯಲ್ಲಿರಲಿ, ನಿಮ್ಮ ಸೂರ್ಯೋದಯ, ಸೂರ್ಯಾಸ್ತ ಮತ್ತು ಮುಹೂರ್ತದ ಸಮಯಗಳು ನಿಮ್ಮ ನಿಖರವಾದ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತವೆ.", mai: "देखो पञ्चाङ्ग जीन मीयसक “Astronomical Algorithms” पर आधारित खगोलीय एल्गोरिदमक उपयोग कऽ कऽ सभ पाँचो तत्वकेँ वास्तविक समयमे गणना करैत अछि – ओहि गणितीय आधारक जेकर उपयोग नासा आओर आधुनिक वेधशालासभ करैत अछि। बेसीतर पञ्चाङ्ग वेबसाइटसभक विपरीत जे पूर्व-गणित तालिका वा बाहरी एपीआई पर निर्भर करैत अछि, एतय प्रत्येक गणना उप-आर्कमिनट सटीकताक संग स्थानीय रूपसँ अहाँक ब्राउजरमे चलैत अछि।", mr: "देखो पंचांग जीन मीयस यांच्या “Astronomical Algorithms” वर आधारित खगोलशास्त्रीय अल्गोरिदम वापरून सर्व पाच घटकांची वास्तविक वेळेत गणना करते – NASA आणि आधुनिक वेधशाळा वापरतात तोच गणितीय आधार. पूर्व-गणित सारण्या किंवा बाह्य API वर अवलंबून असलेल्या बहुतेक पंचांग वेबसाइट्सच्या विपरीत, येथील प्रत्येक गणना तुमच्या ब्राउझरमध्ये उप-आर्कमिनिट अचूकतेसह स्थानिक पातळीवर चालते. याचा परिणाम म्हणून, हे पंचांग पृथ्वीवरील कोणत्याही स्थानासाठी अचूक आहे, केवळ भारतीय शहरांसाठीच नाही – तुम्ही न्यूयॉर्क, लंडन, सिडनी किंवा वाराणसीमध्ये असाल तरीही, तुमच्या सूर्योदय, सूर्यास्त आणि मुहूर्ताच्या वेळा तुमच्या अचूक निर्देशांकांना प्रतिबिंबित करतात." }, locale)}
        </p>
        <h2 className="text-lg font-semibold text-gold-dark/80 mb-4" style={hf}>
          {L({ en: 'Kundali & Vedic Astrology Tools', hi: 'कुण्डली एवं वैदिक ज्योतिष उपकरण', ta: 'குண்டலி & வேத ஜோதிட கருவிகள்', bn: 'কুণ্ডলী ও বৈদিক জ্যোতিষ সরঞ্জাম', te: "కుండలి & వైదిక జ్యోతిష్య సాధనాలు", gu: "કુંડળી અને વૈદિક જ્યોતિષ સાધનો", kn: "ಕುಂಡಲಿ ಮತ್ತು ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಉಪಕರಣಗಳು", mai: "कुण्डली आओर वैदिक ज्योतिष उपकरण", mr: "कुंडली आणि वैदिक ज्योतिष साधने" }, locale)}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bf}>
          {L({ en: 'Beyond daily Panchang, Dekho Panchang offers a complete suite of Vedic astrology tools  –  all free. Generate your Kundali (birth chart) with precise planetary positions, Vimshottari Dasha timelines, Shadbala strength analysis, Ashtakavarga scores, and detailed Tippanni (interpretive commentary) covering personality, career, relationships, and spiritual path. The Ashta Kuta matching system computes 36-point compatibility for marriage, while the Muhurta AI finds auspicious timings for weddings, house warming, travel, and 20 other life events.', hi: 'दैनिक पंचांग से परे, देखो पंचांग वैदिक ज्योतिष उपकरणों का पूर्ण सूट प्रदान करता है  –  सभी निःशुल्क। सटीक ग्रह स्थितियों, विंशोत्तरी दशा, षड्बल विश्लेषण, अष्टकवर्ग अंक, और विस्तृत टिप्पणी के साथ अपनी कुण्डली बनाएँ। अष्ट कूट मिलान प्रणाली विवाह के लिए 36-बिन्दु अनुकूलता की गणना करती है।', ta: 'தினசரி பஞ்சாங்கத்தைத் தாண்டி, வேத ஜோதிட கருவிகளின் முழுமையான தொகுப்பை வழங்குகிறோம்.', bn: 'দৈনিক পঞ্চাঙ্গের বাইরে, বৈদিক জ্যোতিষ সরঞ্জামের সম্পূর্ণ সুইট প্রদান করে  –  সব বিনামূল্যে।', te: "దైనందిన పంచాంగం కాకుండా, దేఖో పంచాంగ్ వైదిక జ్యోతిష్య సాధనాల పూర్తి సూట్‌ను అందిస్తుంది – అన్నీ ఉచితంగా. ఖచ్చితమైన గ్రహ స్థానాలు, వింశోత్తరి దశ కాలక్రమాలు, షడ్బల బలం విశ్లేషణ, అష్టకవర్గ స్కోర్‌లు మరియు వ్యక్తిత్వం, వృత్తి, సంబంధాలు, ఆధ్యాత్మిక మార్గాన్ని కవర్ చేసే వివరణాత్మక టిప్పణి (వ్యాఖ్యానం)తో మీ కుండలిని (జన్మ చార్ట్) రూపొందించండి. అష్ట కూట పొంతన వ్యవస్థ వివాహానికి 36-పాయింట్ల అనుకూలతను గణిస్తుంది, అయితే ముహూర్త AI వివాహాలు, గృహప్రవేశం, ప్రయాణం మరియు ఇతర 20 జీవిత సంఘటనల కోసం శుభ సమయాలను కనుగొంటుంది.", gu: "દૈનિક પંચાંગ ઉપરાંત, દેખો પંચાંગ વૈદિક જ્યોતિષ સાધનોનો સંપૂર્ણ સ્યુટ પ્રદાન કરે છે – બધા મફત. ચોક્કસ ગ્રહ સ્થિતિઓ, વિંશોત્તરી દશા સમયરેખા, ષડ્બલ શક્તિ વિશ્લેષણ, અષ્ટકવર્ગ સ્કોર્સ અને વ્યક્તિત્વ, કારકિર્દી, સંબંધો તથા આધ્યાત્મિક માર્ગને આવરી લેતી વિગતવાર ટિપ્પણી (વ્યાખ્યાત્મક ટિપ્પણી) સાથે તમારી કુંડળી (જન્મ કુંડળી) બનાવો. અષ્ટ કૂટ મેચિંગ સિસ્ટમ લગ્ન માટે 36-પોઇન્ટ સુસંગતતાની ગણતરી કરે છે, જ્યારે મુહૂર્ત AI લગ્ન, ગૃહ પ્રવેશ, મુસાફરી અને અન્ય 20 જીવન ઘટનાઓ માટે શુભ સમય શોધે છે.", kn: "ದೈನಿಕ ಪಂಚಾಂಗದಿಂದಾಚೆಗೆ, ದೇಕೋ ಪಂಚಾಂಗವು ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಉಪಕರಣಗಳ ಸಂಪೂರ್ಣ ಸೂಟ್ ಅನ್ನು ನೀಡುತ್ತದೆ – ಎಲ್ಲವೂ ಉಚಿತ. ನಿಖರವಾದ ಗ್ರಹ ಸ್ಥಾನಗಳು, ವಿಂಶೋತ್ತರಿ ದಶಾ ಟೈಮ್‌ಲೈನ್‌ಗಳು, ಷಡ್ಬಲ ಶಕ್ತಿ ವಿಶ್ಲೇಷಣೆ, ಅಷ್ಟಕವರ್ಗ ಅಂಕಗಳು ಮತ್ತು ವ್ಯಕ್ತಿತ್ವ, ವೃತ್ತಿ, ಸಂಬಂಧಗಳು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗವನ್ನು ಒಳಗೊಂಡ ವಿವರವಾದ ಟಿಪ್ಪಣಿ (ವ್ಯಾಖ್ಯಾನಾತ್ಮಕ ವ್ಯಾಖ್ಯಾನ) ಯೊಂದಿಗೆ ನಿಮ್ಮ ಕುಂಡಲಿಯನ್ನು (ಜನ್ಮ ಕುಂಡಲಿ) ರಚಿಸಿ. ಅಷ್ಟ ಕೂಟ ಹೊಂದಾಣಿಕೆ ವ್ಯವಸ್ಥೆಯು ವಿವಾಹಕ್ಕಾಗಿ 36-ಅಂಕಗಳ ಹೊಂದಾಣಿಕೆಯನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ, ಆದರೆ ಮುಹೂರ್ತ AI ವಿವಾಹಗಳು, ಗೃಹಪ್ರವೇಶ, ಪ್ರಯಾಣ ಮತ್ತು 20 ಇತರ ಜೀವನ ಘಟನೆಗಳಿಗೆ ಶುಭ ಸಮಯಗಳನ್ನು ಕಂಡುಕೊಳ್ಳುತ್ತದೆ.", mai: "दैनिक पञ्चाङ्गसँ बेसी, देखो पञ्चाङ्ग वैदिक ज्योतिष उपकरणक एकटा पूर्ण सूट प्रदान करैत अछि – सभटा निःशुल्क। सटीक ग्रह स्थिति, विंशोत्तरी दशाक समयरेखा, षड्बल शक्ति विश्लेषण, अष्टकवर्ग अंक, आओर विस्तृत टिप्पणी (व्याख्यात्मक टिप्पणी) जे व्यक्तित्व, करियर, सम्बन्ध, आओर आध्यात्मिक मार्गकेँ कवर करैत अछि, ओहि सबहक संग अहाँक कुण्डली बनाउ। अष्ट कूट मिलान प्रणाली विवाहक लेल 36-बिन्दुक अनुकूलताक गणना करैत अछि, जखन कि मुहूर्त एआई विवाह, गृह प्रवेश, यात्रा, आओर 20 अन्य जीवन घटनासभक लेल शुभ समय खोजैत अछि।", mr: "दैनंदिन पंचांगापलीकडे, देखो पंचांग वैदिक ज्योतिष साधनांचा एक संपूर्ण संच प्रदान करते – सर्व विनामूल्य. अचूक ग्रह स्थिती, विंशोत्तरी दशा टाइमलाइन, षड्बल सामर्थ्य विश्लेषण, अष्टकवर्ग गुण आणि व्यक्तिमत्व, करिअर, नातेसंबंध आणि आध्यात्मिक मार्ग यावर सविस्तर टिप्पणी (व्याख्यात्मक भाष्य) सह तुमची कुंडली तयार करा. अष्ट कूट जुळणी प्रणाली विवाहासाठी 36-गुणांची अनुकूलता मोजते, तर मुहूर्त AI विवाह, गृहप्रवेश, प्रवास आणि इतर 20 जीवन घटनांसाठी शुभ वेळ शोधते." }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bf}>
          {L({ en: 'The learning library contains over 120 in-depth articles covering every aspect of Jyotish Shastra  –  from foundational concepts like the nine Grahas and twelve Rashis to advanced topics like Jaimini Chara Dasha, KP System sub-lords, and Ashtakavarga transit analysis. Each article includes Sanskrit terminology with Devanagari script, classical references from Brihat Parashara Hora Shastra and Surya Siddhanta, and practical guidance for applying these ancient principles to modern life decisions.', hi: 'शिक्षण पुस्तकालय में ज्योतिष शास्त्र के प्रत्येक पहलू को कवर करने वाले 120 से अधिक गहन लेख हैं  –  नवग्रह और बारह राशियों जैसी मूलभूत अवधारणाओं से लेकर जैमिनी चर दशा, KP प्रणाली, और अष्टकवर्ग गोचर विश्लेषण जैसे उन्नत विषयों तक। प्रत्येक लेख में संस्कृत शब्दावली, बृहत् पराशर होरा शास्त्र और सूर्य सिद्धान्त से शास्त्रीय सन्दर्भ शामिल हैं।', ta: 'கற்றல் நூலகத்தில் ஜோதிட சாஸ்திரத்தின் ஒவ்வொரு அம்சத்தையும் உள்ளடக்கிய 120க்கும் மேற்பட்ட ஆழமான கட்டுரைகள் உள்ளன.', bn: 'শেখার গ্রন্থাগারে জ্যোতিষ শাস্ত্রের প্রতিটি দিক কভার করে ১২০টিরও বেশি গভীর নিবন্ধ রয়েছে।', te: "అధ్యయన గ్రంథాలయం జ్యోతిష్య శాస్త్రంలోని ప్రతి అంశాన్ని కవర్ చేసే 120కి పైగా లోతైన వ్యాసాలను కలిగి ఉంది – నవగ్రహాలు మరియు పన్నెండు రాశుల వంటి ప్రాథమిక భావనల నుండి జైమిని చర దశ, KP సిస్టమ్ సబ్-లార్డ్స్ మరియు అష్టకవర్గ గోచర విశ్లేషణ వంటి అధునాతన అంశాల వరకు. ప్రతి వ్యాసంలో దేవనాగరి లిపితో సంస్కృత పదజాలం, బృహత్ పరాశర హోరా శాస్త్రం మరియు సూర్య సిద్ధాంతం నుండి శాస్త్రీయ సూచనలు మరియు ఈ ప్రాచీన సూత్రాలను ఆధునిక జీవిత నిర్ణయాలకు వర్తింపజేయడానికి ఆచరణాత్మక మార్గదర్శకత్వం ఉన్నాయి.", gu: "શિક્ષણ પુસ્તકાલયમાં જ્યોતિષ શાસ્ત્રના દરેક પાસાને આવરી લેતા 120 થી વધુ ઊંડાણપૂર્વકના લેખો છે – નવ ગ્રહો અને બાર રાશિઓ જેવા મૂળભૂત ખ્યાલોથી લઈને જૈમિની ચર દશા, KP સિસ્ટમ સબ-લોર્ડ્સ અને અષ્ટકવર્ગ ગોચર વિશ્લેષણ જેવા અદ્યતન વિષયો સુધી. દરેક લેખમાં દેવનાગરી લિપિ સાથે સંસ્કૃત પરિભાષા, બૃહત્ પરાશર હોરા શાસ્ત્ર અને સૂર્ય સિદ્ધાંતના શાસ્ત્રીય સંદર્ભો અને આ પ્રાચીન સિદ્ધાંતોને આધુનિક જીવનના નિર્ણયોમાં લાગુ કરવા માટે વ્યવહારુ માર્ગદર્શન શામેલ છે.", kn: "ಕಲಿಕಾ ಗ್ರಂಥಾಲಯವು ಜ್ಯೋತಿಷ್ಯ ಶಾಸ್ತ್ರದ ಪ್ರತಿಯೊಂದು ಅಂಶವನ್ನು ಒಳಗೊಂಡ 120 ಕ್ಕೂ ಹೆಚ್ಚು ಆಳವಾದ ಲೇಖನಗಳನ್ನು ಹೊಂದಿದೆ – ನವಗ್ರಹಗಳು ಮತ್ತು ಹನ್ನೆರಡು ರಾಶಿಗಳಂತಹ ಮೂಲಭೂತ ಪರಿಕಲ್ಪನೆಗಳಿಂದ ಹಿಡಿದು ಜೈಮಿನಿ ಚರ ದಶಾ, ಕೆಪಿ ಸಿಸ್ಟಮ್ ಉಪ-ಅಧಿಪತಿಗಳು ಮತ್ತು ಅಷ್ಟಕವರ್ಗ ಗೋಚಾರ ವಿಶ್ಲೇಷಣೆಯಂತಹ ಸುಧಾರಿತ ವಿಷಯಗಳವರೆಗೆ. ಪ್ರತಿಯೊಂದು ಲೇಖನವು ದೇವನಾಗರಿ ಲಿಪಿಯೊಂದಿಗೆ ಸಂಸ್ಕೃತ ಪದಗಳನ್ನು, ಬೃಹತ್ ಪರಾಶರ ಹೋರಾ ಶಾಸ್ತ್ರ ಮತ್ತು ಸೂರ್ಯ ಸಿದ್ಧಾಂತದಿಂದ ಶಾಸ್ತ್ರೀಯ ಉಲ್ಲೇಖಗಳನ್ನು ಮತ್ತು ಈ ಪ್ರಾಚೀನ ತತ್ವಗಳನ್ನು ಆಧುನಿಕ ಜೀವನ ನಿರ್ಧಾರಗಳಿಗೆ ಅನ್ವಯಿಸಲು ಪ್ರಾಯೋಗಿಕ ಮಾರ್ಗದರ್ಶನವನ್ನು ಒಳಗೊಂಡಿದೆ.", mai: "शिक्षण पुस्तकालयमे ज्योतिष शास्त्रक प्रत्येक पहलूकेँ कवर करयवला 120 सँ बेसी गहन लेख अछि – नवग्रह आओर बारह राशि जेहन मूलभूत अवधारणासभसँ लऽ कऽ जैमिनी चर दशा, केपी प्रणालीक उप-स्वामी, आओर अष्टकवर्ग गोचर विश्लेषण जेहन उन्नत विषय धरि। प्रत्येक लेखमे देवनागरी लिपिमे संस्कृत शब्दावली, बृहत् पराशर होरा शास्त्र आओर सूर्य सिद्धान्तसँ शास्त्रीय सन्दर्भ, आओर आधुनिक जीवनक निर्णयसभमे ई प्राचीन सिद्धान्तसभकेँ लागू करबाक लेल व्यावहारिक मार्गदर्शन शामिल अछि।", mr: "शिक्षण ग्रंथालयात ज्योतिष शास्त्राच्या प्रत्येक पैलूवर आधारित 120 हून अधिक सखोल लेख आहेत – नवग्रह आणि बारा राशींसारख्या मूलभूत संकल्पनांपासून ते जैमिनी चर दशा, केपी प्रणाली उप-स्वामी आणि अष्टकवर्ग गोचर विश्लेषण यांसारख्या प्रगत विषयांपर्यंत. प्रत्येक लेखात देवनागरी लिपीसह संस्कृत संज्ञा, बृहत् पराशर होरा शास्त्र आणि सूर्य सिद्धांत यांमधील शास्त्रीय संदर्भ आणि ही प्राचीन तत्त्वे आधुनिक जीवनातील निर्णयांना लागू करण्यासाठी व्यावहारिक मार्गदर्शन समाविष्ट आहे." }, locale)}
        </p>
      </section>

      {/* ═══ NEWCOMER CARD — moved to bottom of page (was top) ═══ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <Link href="/learn/modules/0-1" className="block rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 p-5 hover:border-gold-primary/30 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gold-primary/15 flex items-center justify-center shrink-0 text-gold-primary"><BookOpen size={20} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-gold-light text-sm font-bold group-hover:text-gold-primary transition-colors">
                {L({ en: 'New to Vedic Astrology? Start here', hi: 'वैदिक ज्योतिष में नए हैं? यहाँ से शुरू करें', ta: 'வேத ஜோதிடத்தில் புதியவரா?', bn: 'বৈদিক জ্যোতিষে নতুন?', te: "వైదిక జ్యోతిష్యానికి కొత్తవారా? ఇక్కడ ప్రారంభించండి", gu: "વૈદિક જ્યોતિષમાં નવા છો? અહીંથી શરૂ કરો", kn: "ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯಕ್ಕೆ ಹೊಸಬರೇ? ಇಲ್ಲಿಂದ ಪ್ರಾರಂಭಿಸಿ", mai: "वैदिक ज्योतिषमे नव छी? एतयसँ शुरू करू", mr: "वैदिक ज्योतिष तुमच्यासाठी नवीन आहे का? येथून सुरुवात करा" }, locale)}
              </p>
              <p className="text-text-secondary text-xs mt-0.5">
                {L({ en: 'Jyotish means "science of light" — not fortune-telling. A 10-minute introduction to India\'s oldest scientific tradition.', hi: 'ज्योतिष का अर्थ "प्रकाश का विज्ञान" — भविष्यवाणी नहीं। भारत की सबसे प्राचीन वैज्ञानिक परम्परा का 10 मिनट का परिचय।', ta: 'ஜோதிடம் என்றால் "ஒளியின் அறிவியல்" — குறிசொல்லுதல் அல்ல.', bn: 'জ্যোতিষ মানে "আলোর বিজ্ঞান" — ভবিষ্যৎবাণী নয়।', te: "జ్యోతిష్యం అంటే “కాంతి విజ్ఞానం” – భవిష్యవాణి కాదు. భారతదేశపు పురాతన శాస్త్రీయ సంప్రదాయానికి 10 నిమిషాల పరిచయం.", gu: "જ્યોતિષનો અર્થ “પ્રકાશનું વિજ્ઞાન” છે — ભવિષ્યકથન નહીં. ભારતની સૌથી પ્રાચીન વૈજ્ઞાનિક પરંપરાનો 10-મિનિટનો પરિચય.", kn: "ಜ್ಯೋತಿಷ್ಯ ಎಂದರೆ “ಪ್ರಕಾಶದ ವಿಜ್ಞಾನ” — ಭವಿಷ್ಯ ಹೇಳುವುದಲ್ಲ. ಭಾರತದ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ವೈಜ್ಞಾನಿಕ ಸಂಪ್ರದಾಯಕ್ಕೆ 10 ನಿಮಿಷಗಳ ಪರಿಚಯ.", mai: "ज्योतिषक अर्थ “प्रकाशक विज्ञान” अछि — भविष्यवाणी नहि। भारतक सभसँ पुरान वैज्ञानिक परम्पराक 10 मिनटक परिचय।", mr: "ज्योतिष म्हणजे “प्रकाशाचे विज्ञान” — भविष्य सांगणे नाही. भारताच्या सर्वात प्राचीन वैज्ञानिक परंपरेची 10 मिनिटांची ओळख." }, locale)}
              </p>
            </div>
            <span className="text-gold-primary/40 group-hover:text-gold-primary transition-colors shrink-0">→</span>
          </div>
        </Link>
      </section>

      {/* ═══ THE SCIENCE BEHIND THE SACRED  –  philosophical close, last section ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gold-primary/10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light mb-6" style={hf}>
          {L({ en: 'The Science Behind the Sacred', hi: 'पवित्र के पीछे का विज्ञान', ta: 'புனிதத்தின் பின்னால் உள்ள அறிவியல்', bn: 'পবিত্রের পেছনের বিজ্ঞান', te: "పవిత్రత వెనుక ఉన్న విజ్ఞానం", gu: "પવિત્ર પાછળનું વિજ્ઞાન", kn: "ಪವಿತ್ರದ ಹಿಂದಿನ ವಿಜ್ಞಾನ", mai: "पवित्रक पाछूक विज्ञान", mr: "पवित्रतेमागील विज्ञान" }, locale)}
        </h2>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed" style={bf}>
          <p>
            {L({
              en: 'Jyotish is not astrology as the West understands it. It is a mathematical framework — the Surya Siddhanta calculated Saturn\'s orbital period as 29.4 years, a value NASA confirmed at 29.46 years. Aryabhata proposed Earth\'s rotation a millennium before Copernicus. This is Siddhantic Jyotish — pure astronomy, empirically verified.',
              hi: 'ज्योतिष वह नहीं है जिसे पश्चिम "astrology" कहता है। यह एक गणितीय ढाँचा है — सूर्य सिद्धान्त ने शनि की कक्षा अवधि 29.4 वर्ष गणित की, जिसे NASA ने 29.46 वर्ष पर पुष्ट किया। आर्यभट ने कोपर्निकस से एक सहस्राब्दी पहले पृथ्वी के घूर्णन का प्रस्ताव दिया। यह सिद्धान्तिक ज्योतिष है — शुद्ध खगोल विज्ञान, प्रायोगिक रूप से सत्यापित।',
              ta: 'ஜோதிடம் என்பது மேற்கத்தியர் புரிந்துகொள்ளும் astrology அல்ல. இது ஒரு கணித கட்டமைப்பு — சூர்ய சித்தாந்தம் சனியின் சுற்றுப்பாதை காலத்தை 29.4 ஆண்டுகள் என கணக்கிட்டது, NASA இதை 29.46 ஆண்டுகள் என உறுதிப்படுத்தியது.',
              bn: 'জ্যোতিষ পশ্চিমের বোঝা astrology নয়। এটি একটি গাণিতিক কাঠামো — সূর্য সিদ্ধান্ত শনির কক্ষপথ 29.4 বছর গণনা করেছিল, যা NASA 29.46 বছরে নিশ্চিত করেছে।',
              te: "పశ్చిమ దేశాలు అర్థం చేసుకున్నట్లు జ్యోతిష్యం అంటే జ్యోతిష్యశాస్త్రం కాదు. ఇది ఒక గణిత ఫ్రేమ్‌వర్క్ – సూర్య సిద్ధాంతం శని కక్ష్య కాలాన్ని 29.4 సంవత్సరాలుగా లెక్కించింది, ఈ విలువను NASA 29.46 సంవత్సరాలుగా ధృవీకరించింది. ఆర్యభట్ట కోపర్నికస్ కంటే ఒక సహస్రాబ్ది ముందు భూమి భ్రమణాన్ని ప్రతిపాదించాడు. ఇది సిద్ధాంత జ్యోతిష్యం – స్వచ్ఛమైన ఖగోళ శాస్త్రం, అనుభవపూర్వకంగా ధృవీకరించబడింది.",
              gu: "જ્યોતિષ એ નથી જેને પશ્ચિમ “જ્યોતિષશાસ્ત્ર” તરીકે સમજે છે. તે એક ગાણિતિક માળખું છે — સૂર્ય સિદ્ધાંતે શનિનો ભ્રમણકાળ 29.4 વર્ષ ગણ્યો હતો, જે મૂલ્ય NASA એ 29.46 વર્ષ તરીકે પુષ્ટિ કરી. આર્યભટ્ટે કોપરનિકસના એક સહસ્ત્રાબ્દી પહેલા પૃથ્વીના પરિભ્રમણનો પ્રસ્તાવ મૂક્યો હતો. આ સિદ્ધાંતિક જ્યોતિષ છે — શુદ્ધ ખગોળશાસ્ત્ર, પ્રાયોગિક રીતે ચકાસાયેલ.",
              kn: "ಜ್ಯೋತಿಷ್ಯವು ಪಾಶ್ಚಿಮಾತ್ಯರು “ಜ್ಯೋತಿಷ್ಯ” ಎಂದು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವಂತದ್ದಲ್ಲ. ಇದು ಒಂದು ಗಣಿತದ ಚೌಕಟ್ಟು — ಸೂರ್ಯ ಸಿದ್ಧಾಂತವು ಶನಿಯ ಕಕ್ಷೀಯ ಅವಧಿಯನ್ನು 29.4 ವರ್ಷಗಳು ಎಂದು ಲೆಕ್ಕಹಾಕಿದೆ, NASA 29.46 ವರ್ಷಗಳಲ್ಲಿ ಇದನ್ನು ದೃಢಪಡಿಸಿದೆ. ಆರ್ಯಭಟನು ಕೋಪರ್ನಿಕಸ್‌ಗಿಂತ ಒಂದು ಸಹಸ್ರಮಾನದ ಮೊದಲು ಭೂಮಿಯ ತಿರುಗುವಿಕೆಯನ್ನು ಪ್ರಸ್ತಾಪಿಸಿದನು. ಇದು ಸಿದ್ಧಾಂತಿಕ ಜ್ಯೋತಿಷ್ಯ — ಶುದ್ಧ ಖಗೋಳ ವಿಜ್ಞಾನ, ಪ್ರಾಯೋಗಿಕವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
              mai: "ज्योतिष ओ नहि अछि जेकरा पश्चिम “ज्योतिष” बुझैत अछि। ई एकटा गणितीय ढाँचा अछि — सूर्य सिद्धान्त शनि ग्रहक कक्षीय अवधि 29.4 वर्ष गणना केलक, एकटा मान जेकरा नासा 29.46 वर्ष पर पुष्टि केलक। आर्यभट कोपर्निकससँ एक सहस्राब्दी पहिने पृथ्वीक घूर्णनक प्रस्ताव देलनि। ई सिद्धान्तिक ज्योतिष अछि — शुद्ध खगोल विज्ञान, प्रायोगिक रूपसँ सत्यापित।",
              mr: "ज्योतिष म्हणजे पाश्चिमात्य देश ज्याला “ज्योतिषशास्त्र” (astrology) समजतात ते नाही. ही एक गणितीय चौकट आहे — सूर्य सिद्धांताने शनीचा परिभ्रमण कालावधी 29.4 वर्षे मोजला, ज्या मूल्याची NASA ने 29.46 वर्षांवर पुष्टी केली. आर्यभटाने कोपर्निकसच्या एक सहस्रक वर्षांपूर्वी पृथ्वीच्या परिवलनाचा प्रस्ताव दिला. हे आहे सिद्धांतिक ज्योतिष — शुद्ध खगोलशास्त्र, प्रायोगिकरित्या सत्यापित.",
            }, locale)}
          </p>
          <p>
            {L({
              en: 'Upon this mathematical foundation stands Phalit Jyotish — the interpretive system of houses, dashas, and yogas that maps celestial patterns to human experience. Together, they form a Vedanga — a limb of the Veda, the \'eye\' that helps us see the patterns of time.',
              hi: 'इस गणितीय नींव पर खड़ा है फलित ज्योतिष — भावों, दशाओं और योगों की व्याख्यात्मक प्रणाली जो आकाशीय प्रतिरूपों को मानवीय अनुभव से जोड़ती है। ये दोनों मिलकर एक वेदाङ्ग बनाते हैं — वेद का अंग, वह "नेत्र" जो हमें काल के प्रतिरूपों को देखने में सहायता करता है।',
              ta: 'இந்த கணித அடித்தளத்தின் மீது பலித ஜோதிடம் நிற்கிறது — வீடுகள், தசைகள் மற்றும் யோகங்களின் விளக்க அமைப்பு. இவை இணைந்து ஒரு வேதாங்கம் — வேதத்தின் "கண்".',
              bn: 'এই গাণিতিক ভিত্তির উপর দাঁড়িয়ে আছে ফলিত জ্যোতিষ — ভাব, দশা এবং যোগের ব্যাখ্যামূলক ব্যবস্থা। একসাথে এরা একটি বেদাঙ্গ গঠন করে — বেদের "চোখ"।',
              te: "ఈ గణిత ప్రాతిపదికపై ఫలిత జ్యోతిష్యం నిలుస్తుంది — ఇది భావాలు, దశలు మరియు యోగాల వ్యాఖ్యాన వ్యవస్థ, ఇది ఖగోళ నమూనాలను మానవ అనుభవానికి అనుసంధానిస్తుంది. కలిసి, అవి ఒక వేదాంగాన్ని ఏర్పరుస్తాయి — వేదానికి ఒక అంగం, కాలపు నమూనాలను చూడటానికి మనకు సహాయపడే “కన్ను”.",
              gu: "આ ગાણિતિક પાયા પર ફલિત જ્યોતિષ ઊભું છે — ભાવો, દશાઓ અને યોગોની વ્યાખ્યાત્મક પ્રણાલી જે આકાશી દાખલાઓને માનવીય અનુભવ સાથે જોડે છે. સાથે મળીને, તેઓ એક વેદાંગ બનાવે છે — વેદનું એક અંગ, તે “નેત્ર” જે આપણને સમયના દાખલાઓને જોવામાં મદદ કરે છે.",
              kn: "ಈ ಗಣಿತದ ಅಡಿಪಾಯದ ಮೇಲೆ ಫಲಿತ ಜ್ಯೋತಿಷ್ಯ ನಿಂತಿದೆ — ಇದು ಭಾವಗಳು, ದಶಾ ಮತ್ತು ಯೋಗಗಳ ವ್ಯಾಖ್ಯಾನಾತ್ಮಕ ವ್ಯವಸ್ಥೆಯಾಗಿದ್ದು, ಆಕಾಶದ ಮಾದರಿಗಳನ್ನು ಮಾನವ ಅನುಭವಕ್ಕೆ ನಕ್ಷೆ ಮಾಡುತ್ತದೆ. ಒಟ್ಟಾಗಿ, ಅವು ವೇದಾಂಗವನ್ನು ರೂಪಿಸುತ್ತವೆ — ವೇದದ ಒಂದು ಅಂಗ, ಕಾಲದ ಮಾದರಿಗಳನ್ನು ನೋಡಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುವ “ಕಣ್ಣು”.",
              mai: "एहि गणितीय नीव पर ठाढ़ अछि फलित ज्योतिष — भाव, दशा, आओर योगक व्याख्यात्मक प्रणाली जे आकाशीय प्रतिरूपकेँ मानवीय अनुभवसँ जोड़ैत अछि। संगहि, ई दुनू मिलिकऽ एकटा वेदाङ्ग बनबैत अछि — वेदक एकटा अंग, ओ “आँखि” जे हमरा सभकेँ समयक प्रतिरूपकेँ देखबामे सहायता करैत अछि।",
              mr: "या गणितीय पायावर फलित ज्योतिष उभे आहे — भाव, दशा आणि योगांची व्याख्यात्मक प्रणाली जी आकाशीय नमुन्यांना मानवी अनुभवाशी जोडते. एकत्रितपणे, ते वेदांग तयार करतात — वेदाचा एक अवयव, तो ‘डोळा’ जो आपल्याला काळाचे नमुने पाहण्यास मदत करतो.",
            }, locale)}
          </p>
          <p>
            {L({
              en: 'Every calculation on Dekho Panchang uses these same algorithms, now running on modern infrastructure — Swiss Ephemeris precision, NASA JPL DE441 planetary data, verified by 3,000+ automated tests.',
              hi: 'देखो पंचांग पर प्रत्येक गणना इन्हीं एल्गोरिदम का उपयोग करती है, जो अब आधुनिक अवसंरचना पर चलती हैं — Swiss Ephemeris की सटीकता, NASA JPL DE441 ग्रह डेटा, 3,000+ स्वचालित परीक्षणों द्वारा सत्यापित।',
              ta: 'தெகோ பஞ்சாங்கத்தின் ஒவ்வொரு கணக்கீடும் இதே வழிமுறைகளைப் பயன்படுத்துகிறது — Swiss Ephemeris துல்லியம், NASA JPL DE441 கிரக தரவு, 3,000+ தானியங்கி சோதனைகளால் சரிபார்க்கப்பட்டது.',
              bn: 'দেখো পঞ্চাঙ্গের প্রতিটি গণনা এই একই অ্যালগরিদম ব্যবহার করে — Swiss Ephemeris নির্ভুলতা, NASA JPL DE441 গ্রহ তথ্য, 3,000+ স্বয়ংক্রিয় পরীক্ষা দ্বারা যাচাইকৃত।',
              te: "దేఖో పంచాంగ్‌లో ప్రతి గణన ఈ అల్గోరిథమ్‌లనే ఉపయోగిస్తుంది, ఇప్పుడు ఆధునిక మౌలిక సదుపాయాలపై నడుస్తుంది — స్విస్ ఎఫెమెరిస్ ఖచ్చితత్వం, NASA JPL DE441 గ్రహ డేటా, 3,000+ ఆటోమేటెడ్ పరీక్షల ద్వారా ధృవీకరించబడింది.",
              gu: "દેખો પંચાંગ પરની દરેક ગણતરી આ જ એલ્ગોરિધમ્સનો ઉપયોગ કરે છે, જે હવે આધુનિક ઇન્ફ્રાસ્ટ્રક્ચર પર ચાલે છે — સ્વિસ એફેમેરિસની ચોકસાઈ, NASA JPL DE441 ગ્રહ ડેટા, 3,000+ સ્વચાલિત પરીક્ષણો દ્વારા ચકાસાયેલ.",
              kn: "ದೇಖೋ ಪಂಚಾಂಗದಲ್ಲಿನ ಪ್ರತಿಯೊಂದು ಲೆಕ್ಕಾಚಾರವು ಇದೇ ಅಲ್ಗಾರಿದಮ್‌ಗಳನ್ನು ಬಳಸುತ್ತದೆ, ಈಗ ಆಧುನಿಕ ಮೂಲಸೌಕರ್ಯದ ಮೇಲೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ — ಸ್ವಿಟ್ಜರ್ಲೆಂಡ್ ಎಫೆಮೆರಿಸ್ ನಿಖರತೆ, NASA JPL DE441 ಗ್ರಹಗಳ ಡೇಟಾ, 3,000+ ಸ್ವಯಂಚಾಲಿತ ಪರೀಕ್ಷೆಗಳಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
              mai: "देखो पञ्चाङ्ग पर प्रत्येक गणना एहि समान एल्गोरिदमक उपयोग करैत अछि, जे आब आधुनिक अवसंरचना पर चलैत अछि — स्विस एफिमेरिसक सटीकता, नासा जेपीएल डीई441 ग्रहीय डेटा, 3,000 सँ बेसी स्वचालित परीक्षणसभ द्वारा सत्यापित।",
              mr: "देखो पंचांगवरील प्रत्येक गणना याच अल्गोरिदमचा वापर करते, जी आता आधुनिक पायाभूत सुविधांवर चालते — स्विस एफिमेरिसची अचूकता, NASA JPL DE441 ग्रहांचा डेटा, 3,000+ स्वयंचलित चाचण्यांद्वारे सत्यापित.",
            }, locale)}
          </p>
        </div>
      </section>

    </div>
  );
}
