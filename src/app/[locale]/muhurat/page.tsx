'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid3X3, List, Sparkles, ArrowRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { Link } from '@/lib/i18n/navigation';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import type { LocaleText, Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import MSG from '@/messages/pages/muhurat.json';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { useLocationStore } from '@/stores/location-store';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DaySummary {
  date: string;
  bestScore: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  windowCount: number;
  bestWindow?: { startTime: string; endTime: string; score: number; shuddhi: number };
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
  tithi?: string;
  nakshatra?: string;
  vara?: string;
}

interface ActivityOption {
  id: string;
  label: LocaleText;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WEEKDAY_HEADERS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
};

const MONTH_NAMES_EN = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_HI = ['', 'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'];

const QUALITY_COLORS: Record<string, string> = {
  excellent: 'bg-emerald-500/20 border-emerald-500/30',
  good: 'bg-gold-primary/12 border-gold-primary/20',
  fair: 'bg-amber-500/8 border-amber-500/15',
  poor: 'bg-white/[0.02] border-white/5',
};

const QUALITY_DOT: Record<string, string> = {
  excellent: 'bg-emerald-500',
  good: 'bg-gold-primary',
  fair: 'bg-amber-500',
  poor: 'bg-gray-600',
};

const QUALITY_LABELS: Record<string, LocaleText> = {
  excellent: { en: 'Excellent', hi: 'उत्तम' },
  good: { en: 'Good', hi: 'शुभ' },
  fair: { en: 'Fair', hi: 'ठीक' },
  poor: { en: 'No window', hi: 'कोई शुभ समय नहीं' },
};

// Activity icon subtitles (1-liner)
const ACTIVITY_SUBTITLES: Record<string, LocaleText> = {
  marriage: { en: 'Wedding & Engagement', hi: 'विवाह एवं सगाई' },
  griha_pravesh: { en: 'Housewarming', hi: 'गृह प्रवेश' },
  mundan: { en: 'First Haircut', hi: 'मुण्डन संस्कार' },
  vehicle_purchase: { en: 'Buy a Vehicle', hi: 'वाहन खरीद' },
  travel: { en: 'Journey & Trips', hi: 'यात्रा' },
  property: { en: 'Buy or Sell Land', hi: 'भूमि क्रय-विक्रय' },
  business_start: { en: 'New Venture', hi: 'नया व्यापार' },
  education: { en: 'Start Learning', hi: 'शिक्षा आरम्भ' },
  gold_purchase: { en: 'Buy Gold & Gems', hi: 'स्वर्ण एवं रत्न' },
  spiritual: { en: 'Puja & Havan', hi: 'पूजा एवं हवन' },
  namkaran: { en: 'Naming Ceremony', hi: 'नामकरण' },
  annaprashan: { en: 'First Solid Food', hi: 'अन्नप्राशन' },
  upanayana: { en: 'Sacred Thread', hi: 'उपनयन संस्कार' },
  medical: { en: 'Surgery & Treatment', hi: 'चिकित्सा' },
  court: { en: 'Legal Proceedings', hi: 'न्यायालय कार्य' },
  lending: { en: 'Loans & Debts', hi: 'ऋण लेन-देन' },
  agriculture: { en: 'Sowing & Planting', hi: 'बुआई एवं रोपण' },
  construction: { en: 'Build & Renovate', hi: 'निर्माण कार्य' },
  joining: { en: 'New Job & Role', hi: 'नई नौकरी' },
  donation: { en: 'Charity & Giving', hi: 'दान-पुण्य' },
};

// ---------------------------------------------------------------------------
// Activity SVG Icons (64x64, bold, multi-layered, gold gradient)
// ---------------------------------------------------------------------------

function ActivityIcon({ activityId }: { activityId: string }) {
  const gid = `ai-${activityId}`;
  const grad = (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f0d48a" />
        <stop offset="50%" stopColor="#d4a853" />
        <stop offset="100%" stopColor="#8a6d2b" />
      </linearGradient>
    </defs>
  );
  const s = `url(#${gid})`;

  const icons: Record<string, React.ReactNode> = {
    marriage: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* Two interlocking rings */}
        <circle cx="24" cy="32" r="14" fill="none" stroke={s} strokeWidth="3" opacity="0.8" />
        <circle cx="40" cy="32" r="14" fill="none" stroke={s} strokeWidth="3" opacity="0.8" />
        <circle cx="24" cy="32" r="8" fill={s} opacity="0.1" />
        <circle cx="40" cy="32" r="8" fill={s} opacity="0.1" />
        {/* Center gem */}
        <path d="M32 24l3 4-3 5-3-5z" fill={s} opacity="0.6" />
        <circle cx="32" cy="20" r="2" fill="#f0d48a" opacity="0.7" />
      </svg>
    ),
    griha_pravesh: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* House with door and flame */}
        <path d="M32 10L8 30h8v22h32V30h8L32 10z" fill={s} opacity="0.1" stroke={s} strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="26" y="36" width="12" height="16" rx="1" fill={s} opacity="0.2" stroke={s} strokeWidth="1.5" />
        <circle cx="35" cy="44" r="1.5" fill="#f0d48a" opacity="0.8" />
        {/* Flame on top */}
        <path d="M32 6c0 0-3 3-3 5s1.5 3 3 3 3-1 3-3-3-5-3-5z" fill={s} opacity="0.5" />
      </svg>
    ),
    mundan: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* Scissors */}
        <circle cx="22" cy="22" r="10" fill="none" stroke={s} strokeWidth="2.5" opacity="0.7" />
        <circle cx="42" cy="22" r="10" fill="none" stroke={s} strokeWidth="2.5" opacity="0.7" />
        <line x1="28" y1="30" x2="36" y2="30" stroke={s} strokeWidth="3" strokeLinecap="round" />
        <line x1="26" y1="30" x2="18" y2="54" stroke={s} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="30" x2="46" y2="54" stroke={s} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="30" r="2" fill="#f0d48a" opacity="0.7" />
      </svg>
    ),
    vehicle_purchase: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* Car silhouette */}
        <path d="M10 38h44v8H10z" fill={s} opacity="0.15" stroke={s} strokeWidth="2" rx="3" />
        <path d="M16 38l4-12h24l4 12" fill={s} opacity="0.1" stroke={s} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="20" cy="46" r="5" fill={s} opacity="0.15" stroke={s} strokeWidth="2" />
        <circle cx="44" cy="46" r="5" fill={s} opacity="0.15" stroke={s} strokeWidth="2" />
        <circle cx="20" cy="46" r="2" fill="#f0d48a" opacity="0.6" />
        <circle cx="44" cy="46" r="2" fill="#f0d48a" opacity="0.6" />
        <rect x="14" y="32" width="8" height="4" rx="1" fill={s} opacity="0.4" />
        <rect x="42" y="32" width="8" height="4" rx="1" fill={s} opacity="0.4" />
      </svg>
    ),
    travel: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* Compass rose */}
        <circle cx="32" cy="32" r="24" fill="none" stroke={s} strokeWidth="2" opacity="0.4" />
        <circle cx="32" cy="32" r="18" fill={s} opacity="0.06" stroke={s} strokeWidth="1" opacity-rule="0.2" />
        <polygon points="32,8 35,28 32,32 29,28" fill={s} opacity="0.7" />
        <polygon points="32,56 35,36 32,32 29,36" fill={s} opacity="0.35" />
        <polygon points="8,32 28,29 32,32 28,35" fill={s} opacity="0.35" />
        <polygon points="56,32 36,29 32,32 36,35" fill={s} opacity="0.35" />
        <circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="0.8" />
      </svg>
    ),
    property: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* Building/skyscraper */}
        <rect x="18" y="14" width="28" height="40" rx="2" fill={s} opacity="0.1" stroke={s} strokeWidth="2.5" />
        <rect x="24" y="20" width="5" height="5" rx="1" fill={s} opacity="0.3" />
        <rect x="35" y="20" width="5" height="5" rx="1" fill={s} opacity="0.3" />
        <rect x="24" y="30" width="5" height="5" rx="1" fill={s} opacity="0.3" />
        <rect x="35" y="30" width="5" height="5" rx="1" fill={s} opacity="0.3" />
        <rect x="28" y="42" width="8" height="12" rx="1" fill={s} opacity="0.25" stroke={s} strokeWidth="1" />
        <line x1="18" y1="54" x2="46" y2="54" stroke={s} strokeWidth="2.5" />
      </svg>
    ),
    business_start: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* Briefcase with star */}
        <rect x="10" y="24" width="44" height="28" rx="4" fill={s} opacity="0.1" stroke={s} strokeWidth="2.5" />
        <path d="M24 24v-6a4 4 0 014-4h8a4 4 0 014 4v6" fill="none" stroke={s} strokeWidth="2" />
        <line x1="10" y1="36" x2="54" y2="36" stroke={s} strokeWidth="1.5" opacity="0.3" />
        <polygon points="32,28 33.5,33 38,33 34.5,36 36,41 32,38 28,41 29.5,36 26,33 30.5,33" fill="#f0d48a" opacity="0.6" />
      </svg>
    ),
    education: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* Graduation cap */}
        <polygon points="32,12 6,28 32,44 58,28" fill={s} opacity="0.15" stroke={s} strokeWidth="2" />
        <line x1="52" y1="28" x2="52" y2="48" stroke={s} strokeWidth="2" />
        <path d="M20 32v12c0 4 5.5 8 12 8s12-4 12-8V32" fill="none" stroke={s} strokeWidth="2" />
        <circle cx="52" cy="49" r="2.5" fill={s} opacity="0.4" />
        <circle cx="32" cy="28" r="2" fill="#f0d48a" opacity="0.7" />
      </svg>
    ),
    gold_purchase: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* Diamond/Gem */}
        <polygon points="32,8 48,24 32,56 16,24" fill={s} opacity="0.12" stroke={s} strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="32,8 22,24 32,24" fill={s} opacity="0.2" />
        <polygon points="32,8 42,24 32,24" fill={s} opacity="0.3" />
        <line x1="16" y1="24" x2="48" y2="24" stroke={s} strokeWidth="2" opacity="0.5" />
        <line x1="22" y1="24" x2="32" y2="56" stroke={s} strokeWidth="1" opacity="0.25" />
        <line x1="42" y1="24" x2="32" y2="56" stroke={s} strokeWidth="1" opacity="0.25" />
        <circle cx="32" cy="22" r="2" fill="#f0d48a" opacity="0.6" />
      </svg>
    ),
    spiritual: (
      <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
        {grad}
        {/* Om-inspired sacred symbol */}
        <circle cx="32" cy="32" r="24" fill="none" stroke={s} strokeWidth="1.5" opacity="0.3" />
        <circle cx="32" cy="32" r="18" fill={s} opacity="0.06" />
        <path d="M24 38c0-6 4-10 8-10s6 3 6 6-2 5-4 5c-3 0-4-2-4-4s2-4 4-4" fill="none" stroke={s} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M38 30c2-4 6-6 8-4" fill="none" stroke={s} strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="18" r="2.5" fill={s} opacity="0.4" />
        <path d="M36 16c2-2 6-2 6 0" fill="none" stroke={s} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        {/* Radiance dots */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          return <circle key={i} cx={32 + 22 * Math.cos(a)} cy={32 + 22 * Math.sin(a)} r="1" fill="#f0d48a" opacity="0.4" />;
        })}
      </svg>
    ),
  };

  // Fallback: a generic star icon for unknown activities
  const fallback = (
    <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
      {grad}
      <polygon points="32,6 38,24 58,24 42,36 48,54 32,42 16,54 22,36 6,24 26,24" fill={s} opacity="0.15" stroke={s} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="32" cy="30" r="3" fill="#f0d48a" opacity="0.6" />
    </svg>
  );

  return <>{icons[activityId] || fallback}</>;
}

// ---------------------------------------------------------------------------
// Hero SVG — Celestial Compass / Clock (128px)
// ---------------------------------------------------------------------------

function HeroSVG() {
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return (
    <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true" className="flex-shrink-0">
      <defs>
        <radialGradient id="mh-rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mh-lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="50%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
      </defs>
      {/* Outer glow */}
      <circle cx="32" cy="32" r="30" fill="url(#mh-rg)" />
      {/* Outer ring */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#mh-lg)" strokeWidth="2" opacity="0.6" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="url(#mh-lg)" strokeWidth="1" opacity="0.25" />
      {/* Compass points — bold triangles */}
      {[0, 90, 180, 270].map((deg, i) => {
        const a = (deg * Math.PI) / 180 - Math.PI / 2;
        const tip = 28;
        const base = 20;
        const cx = 32 + tip * Math.cos(a);
        const cy = 32 + tip * Math.sin(a);
        const bx1 = 32 + base * Math.cos(a - 0.15);
        const by1 = 32 + base * Math.sin(a - 0.15);
        const bx2 = 32 + base * Math.cos(a + 0.15);
        const by2 = 32 + base * Math.sin(a + 0.15);
        return (
          <polygon
            key={i}
            points={`${r2(cx)},${r2(cy)} ${r2(bx1)},${r2(by1)} ${r2(bx2)},${r2(by2)}`}
            fill="url(#mh-lg)"
            opacity={i === 0 ? 0.9 : 0.5}
          />
        );
      })}
      {/* 12 hour tick marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        const inner = i % 3 === 0 ? 21 : 23;
        return (
          <line key={i} x1={r2(32 + inner * Math.cos(a))} y1={r2(32 + inner * Math.sin(a))} x2={r2(32 + 26 * Math.cos(a))} y2={r2(32 + 26 * Math.sin(a))} stroke="url(#mh-lg)" strokeWidth={i % 3 === 0 ? '2' : '1'} strokeLinecap="round" opacity={i % 3 === 0 ? 0.8 : 0.35} />
        );
      })}
      {/* Clock hands */}
      <line x1="32" y1="32" x2="32" y2="14" stroke="url(#mh-lg)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      <line x1="32" y1="32" x2="44" y2="26" stroke="url(#mh-lg)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Inner circle & center */}
      <circle cx="32" cy="32" r="12" fill="url(#mh-lg)" opacity="0.06" />
      <circle cx="32" cy="32" r="3" fill="url(#mh-lg)" opacity="0.4" />
      <circle cx="32" cy="32" r="1.5" fill="#f0d48a" opacity="0.9" />
      {/* Stars decoration */}
      <circle cx="12" cy="10" r="0.8" fill="#f0d48a" opacity="0.3" />
      <circle cx="54" cy="52" r="1" fill="#f0d48a" opacity="0.25" />
      <circle cx="52" cy="12" r="0.7" fill="#f0d48a" opacity="0.35" />
      <circle cx="10" cy="54" r="0.9" fill="#f0d48a" opacity="0.2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Shuddhi dots component
// ---------------------------------------------------------------------------

function ShuddhiDots({ filled, total = 5 }: { filled: number; total?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full border ${
            i < filled
              ? 'bg-gold-primary border-gold-primary/60'
              : 'bg-transparent border-gold-dark/40'
          }`}
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MuhuratPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const birthNakshatra = useBirthDataStore((s) => s.birthNakshatra);
  const birthRashi = useBirthDataStore((s) => s.birthRashi);
  const locationStore = useLocationStore();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [activity, setActivity] = useState('marriage');
  const [days, setDays] = useState<DaySummary[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDay, setSelectedDay] = useState<DaySummary | null>(null);
  const [restrictions, setRestrictions] = useState<{ type: string; label: { en: string; hi: string } }[]>([]);

  useEffect(() => {
    setLoading(true);
    setSelectedDay(null);

    const params = new URLSearchParams({
      year: String(year),
      month: String(month),
      activity,
      lat: String(locationStore.lat ?? 28.6139),
      lng: String(locationStore.lng ?? 77.209),
      tz: String(locationStore.timezone
        ? getUTCOffsetForDate(year, month, 1, locationStore.timezone)
        : 5.5),
    });
    if (birthNakshatra > 0) params.set('birthNak', String(birthNakshatra));
    if (birthRashi > 0) params.set('birthRashi', String(birthRashi));

    fetch(`/api/muhurat/scan?${params}`)
      .then(r => r.json())
      .then(data => {
        setDays(data.days || []);
        if (data.activities) setActivities(data.activities);
        setRestrictions(data.restrictions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[muhurat] Scan failed:', err);
        setLoading(false);
      });
  }, [year, month, activity, birthNakshatra, birthRashi, locationStore.lat, locationStore.lng, locationStore.timezone]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build calendar grid data
  const calendarGrid = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const dayMap = new Map(days.map(d => [d.date, d]));

    const cells: (DaySummary | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push(dayMap.get(dateStr) ?? { date: dateStr, bestScore: 0, quality: 'poor' as const, windowCount: 0 });
    }
    return cells;
  }, [days, year, month]);

  const auspiciousDays = days.filter(d => d.quality !== 'poor');
  const weekHeaders = isDevanagari ? WEEKDAY_HEADERS.hi : WEEKDAY_HEADERS.en;

  // Next best date — first excellent, else first good
  const nextBestDay = useMemo(() => {
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const future = auspiciousDays
      .filter(d => d.date >= todayStr)
      .sort((a, b) => {
        // Excellent first, then good, then fair
        const qOrder: Record<string, number> = { excellent: 0, good: 1, fair: 2 };
        const qDiff = (qOrder[a.quality] ?? 3) - (qOrder[b.quality] ?? 3);
        if (qDiff !== 0) return qDiff;
        return a.date.localeCompare(b.date);
      });
    return future[0] ?? null;
  }, [auspiciousDays]);

  // Currently selected activity label
  const currentActivityLabel = useMemo(() => {
    const found = activities.find(a => a.id === activity);
    return found ? tl(found.label, locale) : activity;
  }, [activities, activity, locale]);

  const crossLinks = getLearnLinksForTool('/muhurat');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ================================================================ */}
      {/* HERO SECTION                                                     */}
      {/* ================================================================ */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-14">
        <div className="flex items-center justify-center mb-6">
          <HeroSVG />
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-5" style={headingFont}>
          <span className="bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] bg-clip-text text-transparent">
            {msg('pageTitle', locale)}
          </span>
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={bodyFont}>
          {locale === 'hi'
            ? 'महत्त्वपूर्ण जीवन-घटनाओं के लिए सबसे शुभ तिथि और समय खोजें — पंचांग शुद्धि, तारा बल, चन्द्र बल सहित'
            : 'Find the most auspicious dates and times for important life events — with Panchanga Shuddhi, Tara Bala, and Chandra Bala analysis'}
        </p>
        {birthNakshatra > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-5 px-5 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/25"
          >
            <Sparkles className="w-4 h-4 text-gold-primary" />
            <span className="text-gold-light text-sm font-medium" style={bodyFont}>
              {locale === 'hi' ? 'आपकी जन्म कुण्डली से व्यक्तिगत स्कोर सक्रिय' : 'Personalized with your birth chart'}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* ================================================================ */}
      {/* ACTIVITY SELECTION — Tarot-style cards                           */}
      {/* ================================================================ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} className="mb-10">
        <h2 className="text-sm font-semibold text-gold-dark uppercase tracking-[2px] text-center mb-5">
          {locale === 'hi' ? 'कार्य चुनें' : 'Select Activity'}
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {activities.map(a => {
            const isActive = activity === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setActivity(a.id)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] border-gold-primary/50 ring-1 ring-gold-primary/30 shadow-[0_0_20px_rgba(212,168,83,0.15)]'
                    : 'bg-gradient-to-br from-[#2d1b69]/25 via-[#1a1040]/30 to-[#0a0e27] border-gold-primary/8 hover:border-gold-primary/30 hover:shadow-[0_0_12px_rgba(212,168,83,0.08)]'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity [&_svg]:w-9 [&_svg]:h-9">
                  <ActivityIcon activityId={a.id} />
                </div>
                <div className="text-left">
                  <div className={`text-sm font-semibold ${isActive ? 'text-gold-light' : 'text-text-primary'}`} style={bodyFont}>
                    {tl(a.label, locale)}
                  </div>
                  {ACTIVITY_SUBTITLES[a.id] && (
                    <div className="text-[11px] text-text-secondary/70 leading-tight mt-0.5" style={bodyFont}>
                      {tl(ACTIVITY_SUBTITLES[a.id], locale)}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      <GoldDivider />

      {/* ================================================================ */}
      {/* RESTRICTION NOTICES — combustion, Adhika Masa, Chaturmas         */}
      {/* ================================================================ */}
      {!loading && restrictions.length > 0 && (
        <div className="my-6 space-y-2">
          {restrictions.map((r, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
              r.type === 'chaturmas_partial'
                ? 'bg-gold-primary/5 border-gold-primary/15'
                : 'bg-red-500/8 border-red-500/20'
            }`}>
              <span className="text-lg flex-shrink-0 mt-0.5">{r.type === 'combustion' ? '🔥' : r.type.startsWith('chaturmas') ? '🕉' : '📅'}</span>
              <p className={`text-sm ${r.type === 'chaturmas_partial' ? 'text-gold-primary/80' : 'text-red-300'}`}>
                {locale === 'hi' ? r.label.hi : r.label.en}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/* NEXT BEST DATE — Hero card                                       */}
      {/* ================================================================ */}
      {!loading && nextBestDay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="my-10"
        >
          <div className="rounded-2xl border border-gold-primary/25 bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] p-6 sm:p-8 shadow-[0_0_40px_rgba(212,168,83,0.08)]">
            <div className="flex items-start gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-sm font-bold text-gold-primary uppercase tracking-[2px]">
                {locale === 'hi'
                  ? `${currentActivityLabel} के लिए अगली शुभ तिथि`
                  : `Next Auspicious Date for ${currentActivityLabel}`}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-3xl sm:text-4xl font-bold text-gold-light mb-2" style={headingFont}>
                  {new Date(nextBestDay.date + 'T00:00:00').toLocaleDateString(
                    locale === 'hi' ? 'hi-IN' : 'en-US',
                    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
                  )}
                </h3>
                {nextBestDay.bestWindow && (
                  <p className="text-text-secondary text-base sm:text-lg mb-3" style={bodyFont}>
                    <span className="text-gold-dark">{locale === 'hi' ? 'सर्वोत्तम समय' : 'Best window'}:</span>{' '}
                    <span className="text-text-primary font-medium">{nextBestDay.bestWindow.startTime} — {nextBestDay.bestWindow.endTime}</span>
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  <span className={`text-sm px-3 py-1 rounded-full font-bold ${
                    nextBestDay.quality === 'excellent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    nextBestDay.quality === 'good' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {tl(QUALITY_LABELS[nextBestDay.quality], locale)} — {nextBestDay.bestScore}/100
                  </span>
                  {nextBestDay.bestWindow && (
                    <span className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="text-gold-dark">{msg('panchangaShuddhi', locale)}:</span>
                      <ShuddhiDots filled={nextBestDay.bestWindow.shuddhi} />
                    </span>
                  )}
                </div>
                {/* Tara & Chandra badges */}
                {(nextBestDay.taraBala || nextBestDay.chandraBala !== undefined) && (
                  <div className="flex gap-3 mt-3">
                    {nextBestDay.taraBala && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        nextBestDay.taraBala.auspicious ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {msg('tara', locale)}: {nextBestDay.taraBala.name} {nextBestDay.taraBala.auspicious ? '✓' : '✗'}
                      </span>
                    )}
                    {nextBestDay.chandraBala !== undefined && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        nextBestDay.chandraBala ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {msg('chandra', locale)}: {nextBestDay.chandraBala ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================================================================ */}
      {/* MONTH SELECTOR + VIEW TOGGLE                                     */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2.5 rounded-xl border border-gold-primary/20 hover:bg-gold-primary/10 hover:border-gold-primary/40 transition-all cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-gold-primary" />
          </button>
          <span className="text-2xl sm:text-3xl font-bold min-w-[220px] text-center" style={headingFont}>
            <span className="bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] bg-clip-text text-transparent">
              {isDevanagari ? MONTH_NAMES_HI[month] : MONTH_NAMES_EN[month]} {year}
            </span>
          </span>
          <button onClick={nextMonth} className="p-2.5 rounded-xl border border-gold-primary/20 hover:bg-gold-primary/10 hover:border-gold-primary/40 transition-all cursor-pointer">
            <ChevronRight className="w-5 h-5 text-gold-primary" />
          </button>
        </div>
        <div className="flex gap-1 border border-gold-primary/15 rounded-xl p-1 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27]">
          <button
            onClick={() => setView('calendar')}
            className={`p-2.5 rounded-lg transition-all cursor-pointer ${view === 'calendar' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary hover:text-gold-primary'}`}
            aria-label="Calendar view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2.5 rounded-lg transition-all cursor-pointer ${view === 'list' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary hover:text-gold-primary'}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-14 w-14 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : view === 'calendar' ? (
        /* ================================================================ */
        /* CALENDAR GRID VIEW                                               */
        /* ================================================================ */
        <div className="my-8">
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4 sm:p-6">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekHeaders.map(d => (
                <div key={d} className="text-center text-gold-dark text-xs uppercase tracking-[2px] py-2 font-semibold">{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarGrid.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} className="h-14 sm:h-16" />;
                const dayNum = parseInt(day.date.split('-')[2]);
                const isAuspicious = day.quality !== 'poor';
                const isSelected = selectedDay?.date === day.date;
                const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const isToday = day.date === todayStr;

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => isAuspicious ? setSelectedDay(isSelected ? null : day) : undefined}
                    className={`h-14 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all relative ${
                      isSelected
                        ? 'border-gold-primary/60 bg-gold-primary/15 ring-2 ring-gold-primary/30 scale-105 shadow-[0_0_16px_rgba(212,168,83,0.2)]'
                        : isAuspicious
                          ? `${QUALITY_COLORS[day.quality]} cursor-pointer hover:border-gold-primary/40 hover:scale-[1.03]`
                          : 'border-transparent bg-white/[0.02] opacity-35'
                    }`}
                  >
                    {isToday && (
                      <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />
                    )}
                    {/* Day number */}
                    <span className={`text-sm sm:text-base font-bold leading-none ${isAuspicious ? 'text-gold-light' : 'text-text-secondary/40'}`}>
                      {dayNum}
                    </span>
                    {/* Tithi name — contextualizes why the day is good/bad */}
                    {day.tithi && (
                      <span className={`text-[8px] sm:text-[9px] leading-none mt-0.5 truncate max-w-full px-0.5 ${isAuspicious ? 'text-text-secondary/60' : 'text-text-secondary/25'}`}>
                        {day.tithi.length > 8 ? day.tithi.slice(0, 7) + '.' : day.tithi}
                      </span>
                    )}
                    {/* Quality indicator — dot for auspicious, nothing for poor */}
                    {isAuspicious && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${QUALITY_DOT[day.quality]}`} />
                        {day.quality === 'excellent' && <div className={`w-1 h-1 rounded-full ${QUALITY_DOT[day.quality]} opacity-50`} />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day detail — enriched */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 overflow-hidden"
              >
                <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-2xl sm:text-3xl text-gold-light font-bold" style={headingFont}>
                        {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString(
                          locale === 'hi' ? 'hi-IN' : 'en-US',
                          { weekday: 'long', day: 'numeric', month: 'long' },
                        )}
                      </h3>
                      <span className={`inline-block mt-2 text-sm px-3 py-1 rounded-full font-bold ${
                        selectedDay.quality === 'excellent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        selectedDay.quality === 'good' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {tl(QUALITY_LABELS[selectedDay.quality], locale)} — {locale === 'hi' ? 'स्कोर' : 'Score'}: {selectedDay.bestScore}/100
                      </span>
                    </div>
                  </div>

                  {selectedDay.bestWindow && (
                    <div className="rounded-xl border border-gold-primary/15 bg-gold-primary/5 p-4 mb-5">
                      <p className="text-lg font-medium text-text-primary mb-2" style={bodyFont}>
                        <span className="text-gold-dark">{locale === 'hi' ? 'सर्वोत्तम समय' : 'Best Window'}:</span>{' '}
                        <span className="text-gold-light">{selectedDay.bestWindow.startTime} – {selectedDay.bestWindow.endTime}</span>
                      </p>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="text-gold-dark">{msg('panchangaShuddhi', locale)}:</span>
                        <ShuddhiDots filled={selectedDay.bestWindow.shuddhi} />
                        <span className="text-text-secondary/60">({selectedDay.bestWindow.shuddhi}/5)</span>
                      </div>
                    </div>
                  )}

                  {/* Tara & Chandra Bala badges */}
                  {(selectedDay.taraBala || selectedDay.chandraBala !== undefined) && (
                    <div className="flex flex-wrap gap-3 mb-5">
                      {selectedDay.taraBala && (
                        <span className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
                          selectedDay.taraBala.auspicious ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                        }`}>
                          {msg('tara', locale)}: {selectedDay.taraBala.name} {selectedDay.taraBala.auspicious ? '✓' : '✗'}
                        </span>
                      )}
                      {selectedDay.chandraBala !== undefined && (
                        <span className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
                          selectedDay.chandraBala ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                        }`}>
                          {msg('chandraBala', locale)} {selectedDay.chandraBala ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Why this day + window count */}
                  <div className="border-t border-gold-primary/10 pt-4 mt-2">
                    <p className="text-text-secondary text-sm mb-3" style={bodyFont}>
                      {locale === 'hi'
                        ? `इस दिन ${selectedDay.windowCount} शुभ समय-खिड़कियाँ मिलीं। पंचांग शुद्धि, ग्रह स्थिति, और नक्षत्र संयोजन इस तिथि को ${tl(QUALITY_LABELS[selectedDay.quality], locale)} बनाते हैं।`
                        : `${selectedDay.windowCount} auspicious windows found. The alignment of Panchanga elements, planetary positions, and Nakshatra combinations make this date ${tl(QUALITY_LABELS[selectedDay.quality], locale).toLowerCase()} for ${currentActivityLabel}.`}
                    </p>
                    <Link
                      href="/muhurta-ai"
                      className="inline-flex items-center gap-2 text-sm text-gold-primary hover:text-gold-light transition-colors"
                    >
                      {locale === 'hi' ? 'सटीक समय के लिए मुहूर्त AI आज़माएँ' : 'Need precise timing? Try Muhurta AI'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-5 mt-8">
            {(['excellent', 'good', 'fair'] as const).map(q => (
              <div key={q} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${QUALITY_DOT[q]}`} />
                <span className="text-text-secondary text-xs font-medium">{tl(QUALITY_LABELS[q], locale)}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-text-secondary text-sm mt-4" style={bodyFont}>
            {auspiciousDays.length} {locale === 'hi' ? 'शुभ दिन इस माह' : 'auspicious days this month'}
          </p>
        </div>
      ) : (
        /* ================================================================ */
        /* LIST VIEW (sorted by score)                                      */
        /* ================================================================ */
        <div className="space-y-3 my-10">
          {auspiciousDays.length === 0 ? (
            <div className="text-center py-20 text-text-secondary">
              <p className="text-lg" style={bodyFont}>
                {msg('noAuspiciousDates', locale)}
              </p>
            </div>
          ) : (
            <>
              {auspiciousDays
                .sort((a, b) => b.bestScore - a.bestScore)
                .map((d, i) => {
                  const dateObj = new Date(d.date + 'T00:00:00');
                  const dayNum = dateObj.getDate();

                  return (
                    <motion.div
                      key={d.date}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.5) }}
                      className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5 hover:border-gold-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-18 h-18 rounded-xl bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] flex flex-col items-center justify-center flex-shrink-0 border border-gold-primary/15 w-[72px] h-[72px]">
                          <span className="text-gold-light text-2xl font-bold leading-none">{dayNum}</span>
                          <span className="text-text-secondary text-xs mt-0.5">
                            {dateObj.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              d.quality === 'excellent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25' :
                              d.quality === 'good' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/25' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/25'
                            }`}>
                              {tl(QUALITY_LABELS[d.quality], locale)}
                            </span>
                            <span className="text-text-secondary text-xs font-medium">{d.bestScore}/100</span>
                          </div>
                          {d.bestWindow && (
                            <p className="text-text-secondary text-sm" style={bodyFont}>
                              <span className="text-gold-dark">{locale === 'hi' ? 'समय' : 'Best'}:</span>{' '}
                              <span className="text-text-primary">{d.bestWindow.startTime} – {d.bestWindow.endTime}</span>
                              <span className="mx-2 text-gold-dark/30">|</span>
                              <span className="text-gold-dark">{msg('shuddhi', locale)}:</span>{' '}
                              <ShuddhiDots filled={d.bestWindow.shuddhi} />
                            </p>
                          )}
                          {d.taraBala && (
                            <span className={`text-xs mt-1 inline-block ${d.taraBala.auspicious ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                              {msg('tara', locale)}: {d.taraBala.name} {d.taraBala.auspicious ? '✓' : '✗'}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              <p className="text-center text-text-secondary text-sm mt-4" style={bodyFont}>
                {auspiciousDays.length} {locale === 'hi' ? 'शुभ दिन' : 'auspicious days'}
              </p>
            </>
          )}
        </div>
      )}

      <GoldDivider />

      {/* ================================================================ */}
      {/* CROSS-LINKS                                                      */}
      {/* ================================================================ */}
      <div className="my-10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/muhurta-ai"
            className="flex-1 group flex items-center gap-3 px-5 py-4 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/40 transition-all"
          >
            <Sparkles className="w-5 h-5 text-gold-primary flex-shrink-0" />
            <div>
              <div className="text-gold-light text-sm font-semibold">{locale === 'hi' ? 'मुहूर्त AI स्कैनर' : 'Muhurta AI Scanner'}</div>
              <div className="text-text-secondary text-xs" style={bodyFont}>
                {locale === 'hi' ? 'AI-संचालित सटीक समय विश्लेषण' : 'AI-powered precise timing analysis'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gold-dark group-hover:text-gold-primary transition-colors ml-auto" />
          </Link>
          <Link
            href="/learn/muhurtas"
            className="flex-1 group flex items-center gap-3 px-5 py-4 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/40 transition-all"
          >
            <svg viewBox="0 0 24 24" width={20} height={20} className="text-gold-primary flex-shrink-0" aria-hidden="true">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div className="text-gold-light text-sm font-semibold">{locale === 'hi' ? 'मुहूर्त विज्ञान सीखें' : 'Learn Muhurta Science'}</div>
              <div className="text-text-secondary text-xs" style={bodyFont}>
                {locale === 'hi' ? 'शुभ मुहूर्त चयन कैसे काम करता है' : 'How auspicious timing selection works'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gold-dark group-hover:text-gold-primary transition-colors ml-auto" />
          </Link>
        </div>

        {crossLinks.length > 0 && (
          <RelatedLinks type="learn" links={crossLinks} locale={locale} />
        )}
      </div>

      {/* ================================================================ */}
      {/* EDUCATIONAL CALLOUT                                              */}
      {/* ================================================================ */}
      <details className="group my-10 rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27]">
        <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
          <span className="text-gold-primary text-lg">&#10043;</span>
          <span className="text-gold-light font-semibold text-sm" style={headingFont}>
            {locale === 'hi' ? 'मुहूर्त को शुभ क्या बनाता है?' : 'What makes a Muhurta auspicious?'}
          </span>
          <ChevronRight className="w-4 h-4 text-gold-dark ml-auto transition-transform group-open:rotate-90" />
        </summary>
        <div className="px-6 pb-5 text-text-secondary text-sm leading-relaxed space-y-3" style={bodyFont}>
          <p>
            {locale === 'hi'
              ? 'शुभ मुहूर्त चयन पाँच पंचांग तत्वों (पंचांग शुद्धि) पर आधारित होता है — तिथि, नक्षत्र, योग, करण, और वार। प्रत्येक कार्य के लिए इन तत्वों के विशेष संयोजन शुभ या अशुभ होते हैं।'
              : 'Muhurta selection is based on five Panchanga elements (Panchanga Shuddhi) — Tithi, Nakshatra, Yoga, Karana, and Vara (weekday). Each activity has specific combinations of these elements that are considered auspicious or inauspicious.'}
          </p>
          <p>
            {locale === 'hi'
              ? 'तारा बल: जन्म नक्षत्र से दिन के नक्षत्र तक की गणना — 9 तारों में से 5 शुभ होते हैं। चन्द्र बल: चन्द्रमा की राशि स्थिति — जन्म राशि से 1, 3, 6, 7, 10, 11वीं राशि शुभ।'
              : 'Tara Bala counts from your birth Nakshatra to the day\'s Nakshatra — 5 of the 9 Taras are auspicious. Chandra Bala checks the Moon\'s sign position — the 1st, 3rd, 6th, 7th, 10th, and 11th signs from your birth Rashi are favorable.'}
          </p>
          <Link href="/learn/muhurtas" className="inline-flex items-center gap-1 text-gold-primary hover:text-gold-light transition-colors text-sm">
            {locale === 'hi' ? 'विस्तार से जानें' : 'Learn more'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </details>
    </div>
  );
}
