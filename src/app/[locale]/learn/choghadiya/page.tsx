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

const t_ = LJ as unknown as Record<string, LocaleText>;

const CHOGHADIYA_TYPES = [
  { name: 'Amrit', hi: 'अमृत', planet: 'Moon', hi_planet: 'चन्द्र', quality: 'Most Auspicious', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Shubh', hi: 'शुभ', planet: 'Jupiter', hi_planet: 'गुरु', quality: 'Highly Auspicious', cls: 'text-emerald-400/80 bg-emerald-500/8 border-emerald-500/15' },
  { name: 'Labh', hi: 'लाभ', planet: 'Mercury', hi_planet: 'बुध', quality: 'Good for Finance', cls: 'text-gold-light bg-gold-primary/10 border-gold-primary/20' },
  { name: 'Char', hi: 'चर', planet: 'Venus', hi_planet: 'शुक्र', quality: 'Neutral — Travel', cls: 'text-gold-primary/70 bg-gold-primary/5 border-gold-primary/10' },
  { name: 'Rog', hi: 'रोग', planet: 'Mars', hi_planet: 'मंगल', quality: 'Inauspicious', cls: 'text-red-400/70 bg-red-500/8 border-red-500/15' },
  { name: 'Kaal', hi: 'काल', planet: 'Saturn', hi_planet: 'शनि', quality: 'Inauspicious', cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { name: 'Udveg', hi: 'उद्वेग', planet: 'Sun', hi_planet: 'सूर्य', quality: 'Inauspicious', cls: 'text-red-400/70 bg-red-500/8 border-red-500/15' },
];

const WEEKDAY_STARTS = [
  { day: 'Sunday', hi: 'रविवार', starts: 'Udveg', hi_starts: 'उद्वेग' },
  { day: 'Monday', hi: 'सोमवार', starts: 'Amrit', hi_starts: 'अमृत' },
  { day: 'Tuesday', hi: 'मंगलवार', starts: 'Rog', hi_starts: 'रोग' },
  { day: 'Wednesday', hi: 'बुधवार', starts: 'Labh', hi_starts: 'लाभ' },
  { day: 'Thursday', hi: 'गुरुवार', starts: 'Shubh', hi_starts: 'शुभ' },
  { day: 'Friday', hi: 'शुक्रवार', starts: 'Char', hi_starts: 'चर' },
  { day: 'Saturday', hi: 'शनिवार', starts: 'Kaal', hi_starts: 'काल' },
];

export default function LearnChoghadiyaPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary" style={bf}>{t('subtitle')}</p>
      </div>

      <KeyTakeaway locale={locale} points={[
        'Choghadiya splits each day and night into 8 periods (~90 min each) — Amrit and Shubh are best, Rog/Kaal/Udveg are worst.',
        'The first Choghadiya of each day is fixed by the weekday lord — Monday starts with Amrit (Moon), Saturday with Kaal (Saturn).',
        'Even an Amrit Choghadiya during Rahu Kaal should be treated with caution — inauspicious overlays take precedence.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Choghadiya" explanation="'Four ghadis' — a time division system splitting day and night into 8 planetary periods each" />
        <BeginnerNote term="Ghadi" explanation="A traditional Indian time unit of 24 minutes — one Choghadiya is theoretically 4 ghadis (96 minutes)" />
        <BeginnerNote term="Hora" explanation="A related system using fixed 60-minute periods — more granular than Choghadiya but follows the same planetary sequence" />
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
              ? 'अमृत चौघड़िया भी राहु काल, यमगण्ड या वर्ज्यम में हो तो सावधानी बरतें — अशुभ आवरण प्राथमिकता पर है।'
              : 'Even an Amrit Choghadiya during Rahu Kaal, Yamaganda, or Varjyam should be treated with caution — the inauspicious overlay takes precedence.'}
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
