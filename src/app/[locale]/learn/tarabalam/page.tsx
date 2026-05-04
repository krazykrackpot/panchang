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
import LJ from '@/messages/learn/tarabalam.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Star, CheckCircle, XCircle, Calculator } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ── Nine Taras ──────────────────────────────────────────────────────
const NINE_TARAS = [
  { num: 1, name: 'Janma', hi: 'जन्म', sa: 'Birth', good: false, desc: 'Vulnerability, caution needed' },
  { num: 2, name: 'Sampat', hi: 'सम्पत्', sa: 'Wealth', good: true, desc: 'Prosperity and gains' },
  { num: 3, name: 'Vipat', hi: 'विपत्', sa: 'Danger', good: false, desc: 'Obstacles and setbacks' },
  { num: 4, name: 'Kshema', hi: 'क्षेम', sa: 'Well-being', good: true, desc: 'Comfort and safety' },
  { num: 5, name: 'Pratyari', hi: 'प्रत्यरि', sa: 'Obstacle', good: false, desc: 'Opposition and conflict' },
  { num: 6, name: 'Sadhaka', hi: 'साधक', sa: 'Achievement', good: true, desc: 'Accomplishment and success' },
  { num: 7, name: 'Vadha', hi: 'वध', sa: 'Harm', good: false, desc: 'Risk of loss or harm' },
  { num: 8, name: 'Mitra', hi: 'मित्र', sa: 'Friend', good: true, desc: 'Support and alliances' },
  { num: 9, name: 'Atimitra', hi: 'अतिमित्र', sa: 'Great Friend', good: true, desc: 'The best — highly auspicious' },
];

export default function LearnTarabalamPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};

  return (
    <div>
      {/* ── Hero ── */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary" style={bf}>{t('subtitle')}</p>
      </div>

      <KeyTakeaway locale={locale} points={[
        'Count from birth nakshatra to today\'s nakshatra, divide by 9 — the remainder gives your Tara for the day.',
        'Auspicious Taras (2, 4, 6, 8, 9) favour new ventures; inauspicious Taras (3, 5, 7) call for caution.',
        'Tara Bala is one of three personalised daily checks alongside Chandra Bala and Panchaka.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Birth Nakshatra" explanation="The nakshatra (lunar mansion) occupied by the Moon at the time of your birth — also called Janma Nakshatra" />
        <BeginnerNote term="Transit Nakshatra" explanation="The nakshatra the Moon is currently occupying today — changes roughly every day" />
        <BeginnerNote term="Chandra Bala" explanation="Moon strength — checks which house the transit Moon occupies from your natal Moon sign" />
      </div>

      {/* ── What is Tara Bala ── */}
      <LessonSection title={isHi ? 'तारा बल क्या है?' : 'What is Tara Bala?'}>
        <p style={bf}>{t('whatIs')}</p>
      </LessonSection>

      {/* ── Nine Taras ── */}
      <LessonSection number={1} title={t('nineTarasTitle')} variant="highlight">
        <p style={bf}>{t('nineTarasContent')}</p>
        <div className="mt-4 space-y-2">
          {NINE_TARAS.map((tara) => (
            <div key={tara.num} className={`flex items-center gap-3 p-3 rounded-xl border ${
              tara.good
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                tara.good
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {tara.num}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${tara.good ? 'text-emerald-300' : 'text-red-300'}`}>
                    {isHi ? tara.hi : tara.name}
                  </span>
                  <span className="text-text-secondary/50 text-xs">({tara.sa})</span>
                </div>
                <p className="text-text-secondary text-xs mt-0.5">{tara.desc}</p>
              </div>
              {tara.good
                ? <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                : <XCircle size={16} className="text-red-400 flex-shrink-0" />
              }
            </div>
          ))}
        </div>
        <ClassicalReference
          shortName="Muhurta Chintamani"
          chapter="Tara Bala classification"
        />
      </LessonSection>

      {/* ── Auspicious vs Inauspicious ── */}
      <LessonSection number={2} title={t('whichGoodTitle')}>
        <p style={bf}>{t('whichGoodContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-emerald-400" />
              <span className="text-emerald-300 font-semibold text-sm">{isHi ? 'शुभ (6 तारे)' : 'Auspicious (6 Taras)'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[2, 4, 6, 8, 9].map(n => (
                <span key={n} className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-medium">
                  {isHi ? NINE_TARAS[n - 1].hi : NINE_TARAS[n - 1].name} ({n})
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={16} className="text-red-400" />
              <span className="text-red-300 font-semibold text-sm">{isHi ? 'अशुभ (3 तारे)' : 'Inauspicious (3 Taras)'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[3, 5, 7].map(n => (
                <span key={n} className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/25 text-red-300 text-xs font-medium">
                  {isHi ? NINE_TARAS[n - 1].hi : NINE_TARAS[n - 1].name} ({n})
                </span>
              ))}
            </div>
          </div>
        </div>
      </LessonSection>

      {/* ── Daily Use ── */}
      <LessonSection number={3} title={t('dailyUseTitle')}>
        <p style={bf}>{t('dailyUseContent')}</p>
        <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={16} className="text-gold-primary" />
            <span className="text-gold-light font-semibold text-sm">{isHi ? 'उदाहरण' : 'Example'}</span>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-text-secondary">
              {isHi ? 'जन्म नक्षत्र: रोहिणी (#4)' : 'Birth nakshatra: Rohini (#4)'}
            </p>
            <p className="text-text-secondary">
              {isHi ? 'आज का नक्षत्र: हस्त (#13)' : 'Today\'s nakshatra: Hasta (#13)'}
            </p>
            <p className="text-text-secondary">
              {isHi ? 'गिनती: 13 - 4 + 1 = 10' : 'Count: 13 - 4 + 1 = 10'}
            </p>
            <p className="text-text-secondary">
              {isHi ? 'शेषफल: 10 mod 9 = 1' : 'Remainder: 10 mod 9 = 1'}
            </p>
            <p className="text-red-300 font-medium">
              {isHi ? '→ जन्म तारा — सावधानी बरतें' : '→ Janma Tara — exercise caution'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Muhurta Relationship ── */}
      <LessonSection number={4} title={t('muhurtaTitle')}>
        <p style={bf}>{t('muhurtaContent')}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { check: 'Tara Bala', hi: 'तारा बल', desc: 'Birth nak → transit nak' },
            { check: 'Chandra Bala', hi: 'चन्द्र बल', desc: 'Moon transit house from natal' },
            { check: 'Panchaka', hi: 'पंचक', desc: 'Moon in nak 23-27 check' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
              <span className="text-gold-primary font-bold text-sm">{isHi ? item.hi : item.check}</span>
              <p className="text-text-secondary text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Source ── */}
      <WhyItMatters locale={locale}>{t('sourceDisclaimer')}</WhyItMatters>

      {/* ── Explore Further ── */}
      <div className="mt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'और जानें' : 'Explore Further'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/tarabalam', label: isHi ? 'तारा बल उपकरण' : 'Tara Bala Tool' },
            { href: '/chandrabalam', label: isHi ? 'चन्द्र बल' : 'Chandra Bala Tool' },
            { href: '/learn/muhurta-selection', label: isHi ? 'मुहूर्त चयन' : 'Muhurta Selection' },
            { href: '/learn/nakshatras', label: isHi ? 'नक्षत्र' : 'Nakshatras' },
            { href: '/learn/rahu-kaal', label: isHi ? 'राहु काल' : 'Rahu Kaal' },
            { href: '/muhurta-ai', label: isHi ? 'मुहूर्त AI' : 'Muhurta AI' },
            { href: '/panchang', label: isHi ? 'आज का पंचांग' : 'Today\'s Panchang' },
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
