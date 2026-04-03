'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { Compass, BookOpen, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { RashiIconById } from '@/components/icons/RashiIcons';
import dynamic from 'next/dynamic';

const TodayPanchangWidget = dynamic(() => import('@/components/panchang/TodayPanchangWidget'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" />
    </div>
  ),
});

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

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
      {/* Sun arc at top */}
      <path d="M20 38 Q40 8 60 38" stroke="url(#pg1)" strokeWidth="2.5" fill="none" filter="url(#pg1g)" />
      {/* Sun rays */}
      {[0,1,2,3,4].map(i => {
        const angle = -140 + i * 35;
        const r = angle * Math.PI / 180;
        return <line key={i} x1={40 + 16 * Math.cos(r)} y1={30 + 16 * Math.sin(r)} x2={40 + 24 * Math.cos(r)} y2={30 + 24 * Math.sin(r)} stroke="#f0d48a" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />;
      })}
      {/* Sun disc */}
      <circle cx="40" cy="30" r="10" fill="url(#pg1)" opacity={0.15} />
      <circle cx="40" cy="30" r="6" fill="url(#pg1)" opacity={0.3} />
      <circle cx="40" cy="30" r="2.5" fill="#f0d48a" />
      {/* Horizon line */}
      <line x1="10" y1="42" x2="70" y2="42" stroke="#d4a853" strokeWidth="1" opacity={0.3} />
      {/* Moon crescent bottom-right */}
      <circle cx="58" cy="56" r="10" fill="none" stroke="url(#pg1)" strokeWidth="1.5" opacity={0.4} />
      <circle cx="62" cy="52" r="8" fill="#0a0e27" />
      {/* Stars */}
      <circle cx="18" cy="54" r="1.5" fill="#f0d48a" opacity={0.5} />
      <circle cx="28" cy="62" r="1" fill="#d4a853" opacity={0.4} />
      <circle cx="48" cy="68" r="1.2" fill="#f0d48a" opacity={0.3} />
      {/* Tithi marks along bottom */}
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
      {/* North Indian chart — diamond */}
      <rect x="12" y="12" width="56" height="56" rx="2" stroke="url(#kg1)" strokeWidth="2" fill="none" filter="url(#kg1g)" />
      {/* Diagonals forming 12 houses */}
      <line x1="12" y1="12" x2="68" y2="68" stroke="#60a5fa" strokeWidth="1" opacity={0.3} />
      <line x1="68" y1="12" x2="12" y2="68" stroke="#60a5fa" strokeWidth="1" opacity={0.3} />
      <line x1="40" y1="12" x2="40" y2="68" stroke="#60a5fa" strokeWidth="0.8" opacity={0.2} />
      <line x1="12" y1="40" x2="68" y2="40" stroke="#60a5fa" strokeWidth="0.8" opacity={0.2} />
      {/* Center diamond */}
      <path d="M40 22 L58 40 L40 58 L22 40Z" stroke="#60a5fa" strokeWidth="1.5" fill="rgba(96,165,250,0.05)" />
      {/* Planets as glowing dots in various houses */}
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
      {/* Ascendant marker */}
      <path d="M40 14 L43 20 L37 20Z" fill="#93c5fd" opacity={0.7} />
      {/* "Lagna" text hint */}
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
      {/* Open book / scroll */}
      <path d="M12 20 Q12 16 20 16 L38 16 Q40 16 40 18 L40 62 Q40 64 38 64 L20 64 Q12 64 12 60Z" stroke="url(#jg1)" strokeWidth="1.5" fill="rgba(245,158,11,0.04)" />
      <path d="M68 20 Q68 16 60 16 L42 16 Q40 16 40 18 L40 62 Q40 64 42 64 L60 64 Q68 64 68 60Z" stroke="url(#jg1)" strokeWidth="1.5" fill="rgba(245,158,11,0.04)" />
      {/* Spine */}
      <line x1="40" y1="16" x2="40" y2="64" stroke="#f59e0b" strokeWidth="1.5" opacity={0.4} />
      {/* Text lines - left page */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`l${i}`} x1="18" y1={26 + i * 7} x2={32 - i * 1.5} y2={26 + i * 7} stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity={0.15 + i * 0.03} />
      ))}
      {/* Sanskrit OM symbol — right page */}
      <text x="46" y="38" fill="url(#jg1)" fontSize="18" fontWeight="bold" opacity={0.5} filter="url(#jg1g)">&#x0950;</text>
      {/* Stars of knowledge around the book */}
      <circle cx="8" cy="14" r="1.5" fill="#fcd34d" opacity={0.4} />
      <circle cx="72" cy="12" r="2" fill="#f59e0b" opacity={0.3} />
      <circle cx="74" cy="52" r="1.5" fill="#fcd34d" opacity={0.25} />
      <circle cx="6" cy="56" r="1" fill="#f59e0b" opacity={0.3} />
      {/* Flame of knowledge at top */}
      <path d="M40 6 Q42 2 40 0 Q38 2 36 6 Q38 8 40 6Z" fill="#fcd34d" opacity={0.5} />
      <path d="M40 10 Q43 4 40 0 Q37 4 34 10 Q37 12 40 10Z" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity={0.3} />
    </svg>
  );
}

// Legacy SVG references kept for secondary usage
function KundaliSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <rect x="6" y="6" width="60" height="60" rx="3" stroke="#f0d48a" strokeWidth="1.5" />
      <line x1="36" y1="6" x2="36" y2="66" stroke="rgba(240,212,138,0.2)" strokeWidth="0.8" />
      <line x1="6" y1="36" x2="66" y2="36" stroke="rgba(240,212,138,0.2)" strokeWidth="0.8" />
      <line x1="6" y1="6" x2="66" y2="66" stroke="rgba(240,212,138,0.12)" strokeWidth="0.8" />
      <line x1="66" y1="6" x2="6" y2="66" stroke="rgba(240,212,138,0.12)" strokeWidth="0.8" />
      <circle cx="22" cy="18" r="3.5" fill="#f0d48a" />
      <circle cx="52" cy="14" r="2.5" fill="#d4a853" />
      <circle cx="44" cy="48" r="3" fill="#f0d48a" opacity={0.7} />
      <circle cx="16" cy="52" r="2" fill="#d4a853" opacity={0.5} />
      <circle cx="36" cy="36" r="4" fill="none" stroke="#f0d48a" strokeWidth="1" opacity={0.3} />
    </svg>
  );
}

function MuhurtaSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="30" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 3" />
      <circle cx="36" cy="36" r="18" stroke="rgba(74,222,128,0.3)" strokeWidth="0.8" />
      <path d="M36 10 L40 26 L56 26 L44 36 L48 52 L36 44 L24 52 L28 36 L16 26 L32 26Z" stroke="#4ade80" strokeWidth="1.3" fill="none" />
      <circle cx="36" cy="36" r="4" fill="#4ade80" opacity={0.25} />
      <circle cx="36" cy="36" r="1.5" fill="#4ade80" />
    </svg>
  );
}

function CalendarSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <rect x="10" y="8" width="52" height="56" rx="5" stroke="#fb923c" strokeWidth="1.3" />
      <line x1="10" y1="24" x2="62" y2="24" stroke="rgba(251,146,60,0.4)" strokeWidth="0.8" />
      <circle cx="22" cy="16" r="2.5" fill="#fb923c" opacity={0.6} />
      <circle cx="50" cy="16" r="2.5" fill="#fb923c" opacity={0.6} />
      <line x1="22" y1="4" x2="22" y2="12" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="4" x2="50" y2="12" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
      {[0,1,2,3,4].map(r => [0,1,2,3,4,5].map(c => (
        <rect key={`${r}${c}`} x={16 + c * 7} y={30 + r * 7} width="4" height="4" rx="1" fill="#fb923c" opacity={r === 2 && c === 3 ? 0.8 : 0.12} />
      )))}
    </svg>
  );
}

function TransitSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="28" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
      <circle cx="36" cy="36" r="18" stroke="rgba(96,165,250,0.15)" strokeWidth="0.8" />
      <circle cx="36" cy="36" r="8" stroke="rgba(96,165,250,0.1)" strokeWidth="0.8" />
      <ellipse cx="36" cy="36" rx="28" ry="11" stroke="rgba(96,165,250,0.2)" strokeWidth="0.8" transform="rotate(-28 36 36)" />
      <circle cx="18" cy="18" r="4.5" fill="#60a5fa" opacity={0.6} />
      <circle cx="56" cy="28" r="3.5" fill="#a78bfa" opacity={0.5} />
      <circle cx="36" cy="60" r="3" fill="#60a5fa" opacity={0.4} />
      <circle cx="48" cy="48" r="2" fill="#818cf8" opacity={0.4} />
    </svg>
  );
}

function MatchingSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="26" cy="36" r="18" stroke="#f472b6" strokeWidth="1" opacity={0.5} />
      <circle cx="46" cy="36" r="18" stroke="#f472b6" strokeWidth="1" opacity={0.5} />
      <path d="M36 22 A18 18 0 0 1 36 50 A18 18 0 0 1 36 22" fill="#f472b6" opacity={0.08} />
      <circle cx="26" cy="30" r="2" fill="#f472b6" opacity={0.6} />
      <circle cx="46" cy="30" r="2" fill="#f472b6" opacity={0.6} />
      <circle cx="36" cy="36" r="3" fill="#f472b6" opacity={0.3} />
    </svg>
  );
}

function SadeSatiSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="26" stroke="rgba(96,165,250,0.2)" strokeWidth="0.8" />
      <circle cx="36" cy="36" r="12" stroke="rgba(96,165,250,0.15)" strokeWidth="0.8" />
      <circle cx="36" cy="10" r="6" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
      <line x1="30" y1="10" x2="42" y2="10" stroke="#60a5fa" strokeWidth="1" opacity={0.4} />
      <circle cx="36" cy="36" r="3" fill="#60a5fa" opacity={0.3} />
      <path d="M20 56 Q36 44 52 56" stroke="#60a5fa" strokeWidth="1" fill="none" opacity={0.3} />
      <text x="30" y="40" fill="#60a5fa" fontSize="12" fontWeight="bold" opacity={0.5}>7.5</text>
    </svg>
  );
}

function LearnSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <rect x="14" y="10" width="36" height="48" rx="3" stroke="#d4a853" strokeWidth="1.2" />
      <rect x="22" y="14" width="36" height="48" rx="3" stroke="#d4a853" strokeWidth="1.2" opacity={0.4} />
      <line x1="22" y1="24" x2="42" y2="24" stroke="rgba(212,168,83,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="32" x2="38" y2="32" stroke="rgba(212,168,83,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="40" x2="40" y2="40" stroke="rgba(212,168,83,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="48" x2="34" y2="48" stroke="rgba(212,168,83,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="30" cy="16" r="1.5" fill="#d4a853" opacity={0.4} />
    </svg>
  );
}

function PrashnaSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="26" stroke="#a78bfa" strokeWidth="1" opacity={0.4} />
      <text x="28" y="46" fill="#a78bfa" fontSize="28" fontWeight="bold" opacity={0.6}>?</text>
      <circle cx="16" cy="20" r="2" fill="#a78bfa" opacity={0.3} />
      <circle cx="56" cy="24" r="2.5" fill="#a78bfa" opacity={0.25} />
      <circle cx="52" cy="52" r="2" fill="#a78bfa" opacity={0.2} />
      <circle cx="18" cy="50" r="1.5" fill="#a78bfa" opacity={0.2} />
    </svg>
  );
}

// Card data with unique gradient colors and SVGs
const HERO_CARDS: { href: string; gradient: string; border: string; titleColor: string; svg: React.ReactNode;
  label: { en: string; hi: string }; desc: { en: string; hi: string } }[] = [
  {
    href: '/kundali', gradient: 'from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27]',
    border: 'border-gold-primary/12 hover:border-gold-primary/35', titleColor: 'text-[#f0d48a]',
    svg: <KundaliSVG />,
    label: { en: 'Birth Chart', hi: 'जन्म कुण्डली' },
    desc: { en: 'Generate Kundali with Dasha, Yogas & AI insights', hi: 'दशा, योग और AI अंतर्दृष्टि के साथ कुण्डली बनाएं' },
  },
  {
    href: '/muhurta-ai', gradient: 'from-[#1a4a3a]/40 via-[#0a2520]/50 to-[#0a0e27]',
    border: 'border-emerald-500/10 hover:border-emerald-500/30', titleColor: 'text-emerald-400',
    svg: <MuhurtaSVG />,
    label: { en: 'Muhurta AI', hi: 'मुहूर्त AI' },
    desc: { en: 'AI-scored auspicious timing for 20 activities', hi: '20 गतिविधियों के लिए AI-अंकित शुभ समय' },
  },
  {
    href: '/calendar', gradient: 'from-[#4a2a10]/40 via-[#2a1a0a]/50 to-[#0a0e27]',
    border: 'border-orange-500/10 hover:border-orange-500/30', titleColor: 'text-orange-400',
    svg: <CalendarSVG />,
    label: { en: 'Festivals & Vrat', hi: 'त्योहार और व्रत' },
    desc: { en: 'Hindu calendar with regional events & Ekadashi', hi: 'क्षेत्रीय त्योहार और एकादशी के साथ हिन्दू पंचांग' },
  },
  {
    href: '/transits', gradient: 'from-[#1a2a5a]/40 via-[#0a1530]/50 to-[#0a0e27]',
    border: 'border-blue-500/10 hover:border-blue-500/30', titleColor: 'text-blue-400',
    svg: <TransitSVG />,
    label: { en: 'Planet Transits', hi: 'ग्रह गोचर' },
    desc: { en: 'Track planetary movements & Gochar predictions', hi: 'ग्रहों की चाल और गोचर फल ट्रैक करें' },
  },
  {
    href: '/matching', gradient: 'from-[#4a1a3a]/35 via-[#2a0a20]/45 to-[#0a0e27]',
    border: 'border-pink-500/10 hover:border-pink-500/30', titleColor: 'text-pink-400',
    svg: <MatchingSVG />,
    label: { en: 'Kundali Matching', hi: 'कुण्डली मिलान' },
    desc: { en: 'Ashta Kuta 36-Guna compatibility analysis', hi: 'अष्ट कूट 36-गुण अनुकूलता विश्लेषण' },
  },
  {
    href: '/sade-sati', gradient: 'from-[#1a2040]/40 via-[#0a1025]/50 to-[#0a0e27]',
    border: 'border-blue-400/10 hover:border-blue-400/30', titleColor: 'text-blue-300',
    svg: <SadeSatiSVG />,
    label: { en: 'Sade Sati', hi: 'साढ़े साती' },
    desc: { en: "Saturn's 7.5 year cycle — phase & remedies", hi: 'शनि की साढ़े साती — चरण और उपाय' },
  },
  {
    href: '/prashna', gradient: 'from-[#2a1a4a]/35 via-[#1a0a30]/45 to-[#0a0e27]',
    border: 'border-violet-500/10 hover:border-violet-500/30', titleColor: 'text-violet-400',
    svg: <PrashnaSVG />,
    label: { en: 'Prashna Kundali', hi: 'प्रश्न कुण्डली' },
    desc: { en: 'Horary astrology — instant answers to questions', hi: 'होरेरी ज्योतिष — प्रश्नों के तत्काल उत्तर' },
  },
  {
    href: '/learn', gradient: 'from-[#3a2a10]/35 via-[#1a1508]/45 to-[#0a0e27]',
    border: 'border-gold-primary/10 hover:border-gold-primary/30', titleColor: 'text-gold-light',
    svg: <LearnSVG />,
    label: { en: 'Learn Jyotish', hi: 'ज्योतिष सीखें' },
    desc: { en: 'Grahas, Rashis, Nakshatras, Dashas & more', hi: 'ग्रह, राशि, नक्षत्र, दशा और बहुत कुछ' },
  },
];

const SECONDARY_TOOLS: { href: string; label: { en: string; hi: string }; gradient: string; border: string }[] = [
  { href: '/retrograde', label: { en: 'Retrograde Calendar', hi: 'वक्री पंचांग' }, gradient: 'from-red-500/8 to-transparent', border: 'border-red-500/10 hover:border-red-500/25' },
  { href: '/eclipses', label: { en: 'Eclipse Calendar', hi: 'ग्रहण पंचांग' }, gradient: 'from-purple-500/8 to-transparent', border: 'border-purple-500/10 hover:border-purple-500/25' },
  { href: '/muhurat', label: { en: 'Muhurat Finder', hi: 'मुहूर्त खोजक' }, gradient: 'from-emerald-500/8 to-transparent', border: 'border-emerald-500/10 hover:border-emerald-500/25' },
  { href: '/sign-calculator', label: { en: 'Sign Calculator', hi: 'राशि गणक' }, gradient: 'from-amber-500/8 to-transparent', border: 'border-amber-500/10 hover:border-amber-500/25' },
  { href: '/baby-names', label: { en: 'Baby Names', hi: 'शिशु नाम' }, gradient: 'from-pink-500/8 to-transparent', border: 'border-pink-500/10 hover:border-pink-500/25' },
  { href: '/shraddha', label: { en: 'Shraddha Calculator', hi: 'श्राद्ध गणक' }, gradient: 'from-stone-400/8 to-transparent', border: 'border-stone-400/10 hover:border-stone-400/25' },
  { href: '/vedic-time', label: { en: 'Vedic Time', hi: 'वैदिक समय' }, gradient: 'from-amber-400/8 to-transparent', border: 'border-amber-400/10 hover:border-amber-400/25' },
  { href: '/devotional', label: { en: 'Devotional Guide', hi: 'भक्ति मार्गदर्शिका' }, gradient: 'from-orange-500/8 to-transparent', border: 'border-orange-500/10 hover:border-orange-500/25' },
  { href: '/regional', label: { en: 'Regional Calendars', hi: 'क्षेत्रीय पंचांग' }, gradient: 'from-teal-500/8 to-transparent', border: 'border-teal-500/10 hover:border-teal-500/25' },
  { href: '/upagraha', label: { en: 'Upagraha', hi: 'उपग्रह' }, gradient: 'from-cyan-500/8 to-transparent', border: 'border-cyan-500/10 hover:border-cyan-500/25' },
  { href: '/varshaphal', label: { en: 'Varshaphal', hi: 'वर्षफल' }, gradient: 'from-yellow-500/8 to-transparent', border: 'border-yellow-500/10 hover:border-yellow-500/25' },
  { href: '/kp-system', label: { en: 'KP System', hi: 'केपी पद्धति' }, gradient: 'from-indigo-500/8 to-transparent', border: 'border-indigo-500/10 hover:border-indigo-500/25' },
];

interface ProfileBannerData {
  display_name: string;
  moon_sign: number;
  ascendant_sign: number;
  moonRashiName: { en: string; hi: string; sa: string } | null;
  lagnaRashiName: { en: string; hi: string; sa: string } | null;
  moonNakshatraName: { en: string; hi: string; sa: string } | null;
  currentDasha: { maha: { planetName: { en: string; hi: string; sa: string } } } | null;
  spiActive: boolean;
}

function useProfileBanner() {
  const { user, initialized } = useAuthStore();
  const [data, setData] = useState<ProfileBannerData | null>(null);

  const fetchProfile = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (!json.snapshot) return;
      setData({
        display_name: json.profile?.display_name || '',
        moon_sign: json.snapshot.moon_sign,
        ascendant_sign: json.snapshot.ascendant_sign,
        moonRashiName: json.snapshot.moonRashiName,
        lagnaRashiName: json.snapshot.lagnaRashiName,
        moonNakshatraName: json.snapshot.moonNakshatraName,
        currentDasha: json.snapshot.currentDasha,
        spiActive: json.snapshot.sade_sati?.isActive || false,
      });
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (initialized && user) fetchProfile();
  }, [initialized, user, fetchProfile]);

  return data;
}

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const isDevanagari = locale === 'hi' || locale === 'sa';
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const profileBanner = useProfileBanner();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gold-primary/5 via-transparent to-gold-dark/5 blur-3xl" />

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center max-w-4xl mx-auto relative z-10"
        >
          {/* Gayatri Mantra — full */}
          <motion.div variants={fadeInUp} className="mb-8">
            <p
              className="text-gold-dark text-lg sm:text-xl md:text-2xl tracking-wide leading-relaxed"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              ॐ भूर्भुवः स्वः
            </p>
            <p
              className="text-gold-dark text-lg sm:text-xl md:text-2xl tracking-wide leading-relaxed"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि
            </p>
            <p
              className="text-gold-dark text-lg sm:text-xl md:text-2xl tracking-wide leading-relaxed"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              धियो यो नः प्रचोदयात्
            </p>
          </motion.div>

          {/* Main tagline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
            style={hf}
          >
            <span className="text-gold-gradient">{t('tagline')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-6 leading-relaxed"
            style={bf}
          >
            {t('subtitle')}
          </motion.p>

          {/* Tamaso Ma Jyotirgamaya */}
          <motion.p
            variants={fadeInUp}
            className="text-gold-primary/60 text-base sm:text-lg italic mb-10"
            style={{ fontFamily: 'var(--font-devanagari-body)' }}
          >
            असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय।
          </motion.p>
        </motion.div>
      </section>

      <GoldDivider />

      {/* Today's Panchang — bigger cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={hf}>
            <span className="text-gold-gradient">{t('todayPanchang')}</span>
          </h2>
          <TodayPanchangWidget />

          {/* CTA buttons — moved below Today's Panchang */}
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link
              href="/panchang"
              className="group px-10 py-4 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-bold text-lg rounded-xl hover:from-gold-primary hover:to-gold-light transition-all duration-300 flex items-center gap-3"
            >
              <Compass className="w-6 h-6" />
              {t('explorePanchang')}
            </Link>
            <Link
              href="/kundali"
              className="px-10 py-4 border-2 border-gold-primary/30 text-gold-light font-bold text-lg rounded-xl hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300 flex items-center gap-3"
            >
              <BookOpen className="w-6 h-6" />
              {t('generateKundali')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Profile Banner — logged-in users with birth data */}
      {profileBanner && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/profile" className="block group">
              <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-r from-gold-primary/[0.04] via-transparent to-gold-primary/[0.04] hover:border-gold-primary/30 transition-all px-6 py-4">
                <div className="flex items-center gap-4">
                  {/* Rashi icon */}
                  <div className="shrink-0">
                    <RashiIconById id={profileBanner.moon_sign} size={44} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gold-light font-semibold text-sm truncate" style={bf}>
                        {profileBanner.display_name || (locale === 'en' ? 'Your Vedic Profile' : 'आपकी वैदिक कुंडली')}
                      </span>
                      {profileBanner.spiActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium shrink-0">
                          {locale === 'en' ? 'Sade Sati' : 'साढ़े साती'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-text-secondary/70" style={bf}>
                      <span>
                        {locale === 'en' ? 'Moon' : 'चन्द्र'}: <span className="text-gold-primary/80">{profileBanner.moonRashiName?.[locale as 'en' | 'hi' | 'sa'] || profileBanner.moonRashiName?.en}</span>
                      </span>
                      <span className="text-gold-primary/20">|</span>
                      <span>
                        {locale === 'en' ? 'Lagna' : 'लग्न'}: <span className="text-gold-primary/80">{profileBanner.lagnaRashiName?.[locale as 'en' | 'hi' | 'sa'] || profileBanner.lagnaRashiName?.en}</span>
                      </span>
                      {profileBanner.currentDasha && (
                        <>
                          <span className="text-gold-primary/20">|</span>
                          <span>
                            {locale === 'en' ? 'Dasha' : 'दशा'}: <span className="text-gold-primary/80">{profileBanner.currentDasha.maha.planetName?.[locale as 'en' | 'hi' | 'sa'] || profileBanner.currentDasha.maha.planetName?.en}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-text-secondary/30 group-hover:text-gold-primary/60 transition-colors shrink-0" />
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      <GoldDivider />

      {/* Three Pillars — Value Propositions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={hf}>
              <span className="text-gold-gradient">{locale === 'en' ? 'Three Pillars of Vedic Wisdom' : locale === 'hi' ? 'वैदिक ज्ञान के तीन स्तम्भ' : 'वैदिकज्ञानस्य त्रयः स्तम्भाः'}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Pillar 1: Panchang ── */}
            <motion.div variants={fadeInUp}>
              <Link href="/panchang" className="block group h-full">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 hover:border-gold-primary/40 p-7 sm:p-8 h-full flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-gold-primary/10 overflow-hidden">
                  <div className="mb-5"><PanchangPillarIcon /></div>
                  <h3 className="text-gold-light text-xl sm:text-2xl font-black mb-1" style={hf}>
                    {locale === 'en' ? 'Panchang' : 'पञ्चाङ्ग'}
                  </h3>
                  <p className="text-gold-primary/70 text-sm font-semibold mb-4" style={bf}>
                    {locale === 'en' ? 'Know Your Day' : locale === 'hi' ? 'अपना दिन जानें' : 'स्वदिनं जानातु'}
                  </p>
                  <ul className="space-y-2.5 text-text-secondary text-sm flex-1" style={bf}>
                    <li className="flex items-start gap-2"><span className="text-gold-primary mt-0.5">&#9670;</span> {locale === 'en' ? 'Daily panchang with precise 24h timings' : 'सटीक 24h समय के साथ दैनिक पंचांग'}</li>
                    <li className="flex items-start gap-2"><span className="text-gold-primary mt-0.5">&#9670;</span> {locale === 'en' ? 'Festival calendar with puja vidhis & mantras' : 'पूजा विधि और मन्त्रों के साथ त्योहार पंचांग'}</li>
                    <li className="flex items-start gap-2"><span className="text-gold-primary mt-0.5">&#9670;</span> {locale === 'en' ? 'Ekadashi parana with Hari Vasara rules' : 'हरि वासर नियमों के साथ एकादशी पारण'}</li>
                    <li className="flex items-start gap-2"><span className="text-gold-primary mt-0.5">&#9670;</span> {locale === 'en' ? 'Muhurat finder for 20 activities' : '20 गतिविधियों के लिए मुहूर्त खोजक'}</li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gold-primary/10">
                    <span className="text-gold-primary text-sm font-bold group-hover:text-gold-light transition-colors">
                      {locale === 'en' ? "View Today's Panchang →" : 'आज का पंचांग देखें →'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* ── Pillar 2: Kundali ── */}
            <motion.div variants={fadeInUp}>
              <Link href="/kundali" className="block group h-full">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#1a2a5a]/40 via-[#0a1530]/50 to-[#0a0e27] border border-blue-500/15 hover:border-blue-500/40 p-7 sm:p-8 h-full flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-blue-500/10 overflow-hidden">
                  <div className="mb-5"><KundaliPillarIcon /></div>
                  <h3 className="text-blue-300 text-xl sm:text-2xl font-black mb-1" style={hf}>
                    {locale === 'en' ? 'Kundali' : 'कुण्डली'}
                  </h3>
                  <p className="text-blue-400/70 text-sm font-semibold mb-4" style={bf}>
                    {locale === 'en' ? 'Know Yourself' : locale === 'hi' ? 'स्वयं को जानें' : 'आत्मानं जानातु'}
                  </p>
                  <ul className="space-y-2.5 text-text-secondary text-sm flex-1" style={bf}>
                    <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">&#9670;</span> {locale === 'en' ? 'Birth chart with 150+ yogas & shadbala' : '150+ योग और षड्बल के साथ जन्म कुण्डली'}</li>
                    <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">&#9670;</span> {locale === 'en' ? 'Dasha forecast — period-by-period life predictions' : 'दशा पूर्वानुमान — काल-दर-काल जीवन भविष्यवाणी'}</li>
                    <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">&#9670;</span> {locale === 'en' ? 'Compatibility matching (36-Guna Milan)' : 'गुण मिलान (36 गुण अनुकूलता)'}</li>
                    <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">&#9670;</span> {locale === 'en' ? 'Varshaphal, KP System & Prashna' : 'वर्षफल, केपी पद्धति और प्रश्न'}</li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-blue-500/10">
                    <span className="text-blue-400 text-sm font-bold group-hover:text-blue-300 transition-colors">
                      {locale === 'en' ? 'Generate Your Chart →' : 'अपनी कुण्डली बनाएं →'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* ── Pillar 3: Jyotish (Learn) ── */}
            <motion.div variants={fadeInUp}>
              <Link href="/learn" className="block group h-full">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#3a2a10]/40 via-[#1a1508]/50 to-[#0a0e27] border border-amber-500/15 hover:border-amber-500/40 p-7 sm:p-8 h-full flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-amber-500/10 overflow-hidden">
                  <div className="mb-5"><JyotishPillarIcon /></div>
                  <h3 className="text-amber-300 text-xl sm:text-2xl font-black mb-1" style={hf}>
                    {locale === 'en' ? 'Jyotish' : 'ज्योतिष'}
                  </h3>
                  <p className="text-amber-400/70 text-sm font-semibold mb-4" style={bf}>
                    {locale === 'en' ? 'Master the Science' : locale === 'hi' ? 'विज्ञान में निपुणता' : 'विज्ञानं वशीकुर्यात्'}
                  </p>
                  <ul className="space-y-2.5 text-text-secondary text-sm flex-1" style={bf}>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#9670;</span> {locale === 'en' ? '89 structured modules — foundation to advanced' : '89 संरचित पाठ्यक्रम — आधार से उन्नत तक'}</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#9670;</span> {locale === 'en' ? 'Grahas, Rashis, Nakshatras, Dashas & Yogas' : 'ग्रह, राशि, नक्षत्र, दशा और योग'}</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#9670;</span> {locale === 'en' ? 'KP System, Jaimini & Tajika techniques' : 'केपी पद्धति, जैमिनी और ताजिक तकनीक'}</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#9670;</span> {locale === 'en' ? 'Interactive diagrams & classical references' : 'इंटरैक्टिव आरेख और शास्त्रीय सन्दर्भ'}</li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-amber-500/10">
                    <span className="text-amber-400 text-sm font-bold group-hover:text-amber-300 transition-colors">
                      {locale === 'en' ? 'Start Learning →' : 'सीखना शुरू करें →'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <GoldDivider />

      {/* Why Panchang is Science */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={hf}>
              <span className="text-gold-gradient">{t('scienceTitle')}</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto" style={bf}>
              {t('scienceDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t('sciencePoint1Title'), desc: t('sciencePoint1'), gradient: 'from-indigo-500/8', icon: (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" stroke="#6366f1" strokeWidth="1" opacity={0.4} /><circle cx="22" cy="22" r="8" stroke="#6366f1" strokeWidth="1.2" /><circle cx="22" cy="4" r="2" fill="#6366f1" opacity={0.6} /><line x1="22" y1="14" x2="22" y2="30" stroke="#6366f1" strokeWidth="0.8" opacity={0.3} /><line x1="14" y1="22" x2="30" y2="22" stroke="#6366f1" strokeWidth="0.8" opacity={0.3} /></svg>
              ) },
              { title: t('sciencePoint2Title'), desc: t('sciencePoint2'), gradient: 'from-amber-500/8', icon: (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="14" fill="none" stroke="#d4a853" strokeWidth="1.2" /><circle cx="22" cy="22" r="14" fill="#d4a853" opacity={0.05} /><path d="M22 8 A14 14 0 0 1 22 36" fill="#d4a853" opacity={0.1} /><circle cx="22" cy="22" r="4" fill="#d4a853" opacity={0.3} /></svg>
              ) },
              { title: t('sciencePoint3Title'), desc: t('sciencePoint3'), gradient: 'from-violet-500/8', icon: (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="16" stroke="#8b5cf6" strokeWidth="1" opacity={0.3} /><circle cx="22" cy="22" r="10" fill="#8b5cf6" opacity={0.06} /><circle cx="22" cy="22" r="10" stroke="#8b5cf6" strokeWidth="1.2" /><circle cx="14" cy="22" r="3" fill="#0a0e27" stroke="#8b5cf6" strokeWidth="0.8" /></svg>
              ) },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className={`glass-card rounded-2xl p-8 bg-gradient-to-br ${item.gradient} to-transparent`}>
                <div className="mb-5">{item.icon}</div>
                <h3 className="text-gold-light text-lg font-semibold mb-3" style={hf}>{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
