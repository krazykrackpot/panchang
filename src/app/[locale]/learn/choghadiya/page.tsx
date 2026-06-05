'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import BeginnerNote from '@/components/learn/BeginnerNote';
import ClassicalReference from '@/components/learn/ClassicalReference';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/choghadiya.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Clock, Sun, Moon, Star, TrendingUp, ShieldAlert, ArrowRightLeft } from 'lucide-react';
import {
  CHOGHADIYA_NAMES,
  chogTypeAtDaySlot,
  type ChoghadiyaType,
} from '@/lib/constants/choghadiya';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ─── Per-type data NOT in canonical (page-specific pedagogy) ────────────────

/** Planet that rules each Choghadiya type (classical Muhurta lore). */
const PLANET_RULERS: Record<ChoghadiyaType, { en: string; hi: string }> = {
  amrit: { en: 'Moon',    hi: 'चन्द्र' },
  shubh: { en: 'Jupiter', hi: 'गुरु' },
  labh:  { en: 'Mercury', hi: 'बुध' },
  char:  { en: 'Venus',   hi: 'शुक्र' },
  rog:   { en: 'Mars',    hi: 'मंगल' },
  kaal:  { en: 'Saturn',  hi: 'शनि' },
  udveg: { en: 'Sun',     hi: 'सूर्य' },
};

/**
 * 5-tier educational quality labels — intentionally MORE granular than
 * the canonical 3-tier `CHOGHADIYA_NATURE`. Order is auspicious →
 * neutral → inauspicious so the table reads good-to-bad top-down.
 */
const QUALITY_LABELS: Record<ChoghadiyaType, string> = {
  amrit: 'Most Auspicious',
  shubh: 'Highly Auspicious',
  labh:  'Good for Finance',
  char:  'Neutral  –  Travel',
  rog:   'Inauspicious',
  kaal:  'Inauspicious',
  udveg: 'Inauspicious',
};

/** Tailwind classes per type — display only. */
const TYPE_CLASSES: Record<ChoghadiyaType, string> = {
  amrit: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  shubh: 'text-emerald-400/80 bg-emerald-500/8 border-emerald-500/15',
  labh:  'text-gold-light bg-gold-primary/10 border-gold-primary/20',
  char:  'text-gold-primary/70 bg-gold-primary/5 border-gold-primary/10',
  rog:   'text-red-400/70 bg-red-500/8 border-red-500/15',
  kaal:  'text-red-400 bg-red-500/10 border-red-500/20',
  udveg: 'text-red-400/70 bg-red-500/8 border-red-500/15',
};

/**
 * Pedagogical display order (good → bad), distinct from the canonical
 * rotation order in `CHOGHADIYA_TYPES`. The table reads top-down by
 * desirability so a learner sees Amrit / Shubh first.
 */
const DISPLAY_ORDER: readonly ChoghadiyaType[] = [
  'amrit', 'shubh', 'labh', 'char', 'rog', 'kaal', 'udveg',
] as const;

const CHOGHADIYA_TYPES = DISPLAY_ORDER.map((t) => ({
  type: t,
  name: CHOGHADIYA_NAMES[t].en,        // canonical
  hi: CHOGHADIYA_NAMES[t].hi,          // canonical
  planet: PLANET_RULERS[t].en,
  hi_planet: PLANET_RULERS[t].hi,
  quality: QUALITY_LABELS[t],
  cls: TYPE_CLASSES[t],
}));

// ─── Weekday-starts derived from canonical day rotation ────────────────────

const WEEKDAY_LABELS: readonly { day: string; hi: string }[] = [
  { day: 'Sunday',    hi: 'रविवार' },
  { day: 'Monday',    hi: 'सोमवार' },
  { day: 'Tuesday',   hi: 'मंगलवार' },
  { day: 'Wednesday', hi: 'बुधवार' },
  { day: 'Thursday',  hi: 'गुरुवार' },
  { day: 'Friday',    hi: 'शुक्रवार' },
  { day: 'Saturday',  hi: 'शनिवार' },
] as const;

/**
 * Weekday → first day-Choghadiya. `starts` is derived from the canonical
 * `chogTypeAtDaySlot(weekday, 0)` so any rotation correction in
 * `DAY_CHOGHADIYA_START` propagates here automatically. Audit P5g.1
 * follow-up to PR #451 — closes the learn-page side of #29.
 */
const WEEKDAY_STARTS = WEEKDAY_LABELS.map((w, weekday) => {
  const startType = chogTypeAtDaySlot(weekday, 0);
  return {
    day: w.day,
    hi: w.hi,
    starts: CHOGHADIYA_NAMES[startType].en,
    hi_starts: CHOGHADIYA_NAMES[startType].hi,
  };
});

export default function LearnChoghadiyaPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h1>
        <p className="text-text-secondary" style={bf}>{t('subtitle')}</p>
      </div>

      <KeyTakeaway locale={locale} points={[
        'Choghadiya splits each day and night into 8 periods (~90 min each)  –  Amrit and Shubh are best, Rog/Kaal/Udveg are worst.',
        'The first Choghadiya of each day is fixed by the weekday lord  –  Monday starts with Amrit (Moon), Saturday with Kaal (Saturn).',
        'Even an Amrit Choghadiya during Rahu Kaal should be treated with caution  –  inauspicious overlays take precedence.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Choghadiya" explanation="'Four ghadis'  –  a time division system splitting day and night into 8 planetary periods each" />
        <BeginnerNote term="Ghadi" explanation="A traditional Indian time unit of 24 minutes  –  one Choghadiya is theoretically 4 ghadis (96 minutes)" />
        <BeginnerNote term="Hora" explanation="A related system using fixed 60-minute periods  –  more granular than Choghadiya but follows the same planetary sequence" />
      </div>

      {/* Intro */}
      <LessonSection title={isHi ? 'चौघड़िया क्या है?' : 'What is Choghadiya?'}>
        <p style={bf}>{t('intro')}</p>
      </LessonSection>

      {/* 7 Types */}
      <LessonSection number={1} title={t('sevenTypesTitle')} variant="highlight">
        <p style={bf}>{t('sevenTypesContent')}</p>
        <div className="mt-4 space-y-2">
          {CHOGHADIYA_TYPES.map(c => (
            <div key={c.name} className={`flex items-center gap-3 p-3 rounded-xl border ${c.cls}`}>
              <div className="w-20">
                <span className="text-sm font-bold">{isHi ? c.hi : c.name}</span>
              </div>
              <div className="w-16 text-xs">{isHi ? c.hi_planet : c.planet}</div>
              <div className="flex-1 text-xs opacity-80">{c.quality}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Rotation */}
      <LessonSection number={2} title={t('rotationTitle')}>
        <p style={bf}>{t('rotationContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/10">
                <th className="py-2 text-left">{isHi ? 'वार' : 'Day'}</th>
                <th className="py-2 text-left">{isHi ? 'पहला चौघड़िया' : 'First Choghadiya'}</th>
              </tr>
            </thead>
            <tbody>
              {WEEKDAY_STARTS.map(w => (
                <tr key={w.day} className="border-b border-white/5">
                  <td className="py-2 text-text-primary">{isHi ? w.hi : w.day}</td>
                  <td className="py-2 text-gold-light font-semibold">{isHi ? w.hi_starts : w.starts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Daily Use */}
      <LessonSection number={3} title={t('dailyUseTitle')}>
        <p style={bf}>{t('dailyUseContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { activity: isHi ? 'व्यापार / वित्त' : 'Business / Finance', best: isHi ? 'लाभ, शुभ' : 'Labh, Shubh', icon: TrendingUp },
            { activity: isHi ? 'यात्रा' : 'Travel', best: isHi ? 'अमृत, चर' : 'Amrit, Char', icon: ArrowRightLeft },
            { activity: isHi ? 'नया उपक्रम' : 'New Venture', best: isHi ? 'शुभ, अमृत' : 'Shubh, Amrit', icon: Star },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <item.icon size={14} className="text-gold-primary" />
                <span className="text-gold-light text-sm font-semibold">{item.activity}</span>
              </div>
              <p className="text-emerald-400 text-xs">{item.best}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <ShieldAlert size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-300 text-xs">
            {isHi
              ? 'अमृत चौघड़िया भी राहु काल, यमगण्ड या वर्ज्यम में हो तो सावधानी बरतें  –  अशुभ आवरण प्राथमिकता पर है।'
              : 'Even an Amrit Choghadiya during Rahu Kaal, Yamaganda, or Varjyam should be treated with caution  –  the inauspicious overlay takes precedence.'}
          </p>
        </div>
      </LessonSection>

      {/* Hora Comparison */}
      <LessonSection number={4} title={t('horaRelationTitle')}>
        <p style={bf}>{t('horaRelationContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'चौघड़िया' : 'Choghadiya'}</span>
            </div>
            <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
              <li>{isHi ? '8 अवधि/दिन-रात' : '8 periods per day/night'}</li>
              <li>{isHi ? 'परिवर्तनशील अवधि' : 'Variable-length periods'}</li>
              <li>{isHi ? 'गुजरात/राजस्थान में लोकप्रिय' : 'Popular in Gujarat/Rajasthan'}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sun size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'होरा' : 'Hora'}</span>
            </div>
            <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
              <li>{isHi ? '24 अवधि/दिन (प्रत्येक 60 मिनट)' : '24 periods per day (60 min each)'}</li>
              <li>{isHi ? 'निश्चित अवधि' : 'Fixed-length periods'}</li>
              <li>{isHi ? 'सम्पूर्ण भारत में प्रचलित' : 'Used across all of India'}</li>
            </ul>
          </div>
        </div>
        <ClassicalReference shortName="Muhurta Chintamani" author="Daivagna Acharya Shri Ram" chapter="Gujarati Panchang tradition" />
      </LessonSection>

      {/* Source */}
      <WhyItMatters locale={locale}>{t('sourceDisclaimer')}</WhyItMatters>

      {/* Explore Further */}
      <div className="mt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'और जानें' : 'Explore Further'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/choghadiya', label: isHi ? 'आज का चौघड़िया' : 'Today\'s Choghadiya' },
            { href: '/learn/hora', label: isHi ? 'होरा' : 'Hora' },
            { href: '/learn/muhurta-selection', label: isHi ? 'मुहूर्त चयन' : 'Muhurta Selection' },
            { href: '/learn/muhurtas', label: isHi ? 'दिन के 30 मुहूर्त' : '30 Muhurtas of the Day' },
            { href: '/hora', label: isHi ? 'होरा कैलकुलेटर' : 'Hora Calculator' },
            { href: '/rahu-kaal', label: isHi ? 'राहु काल' : 'Rahu Kaal' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-gold-light border border-gold-primary/10 hover:border-gold-primary/25 hover:bg-gold-primary/5 transition-colors"
              style={bf}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
