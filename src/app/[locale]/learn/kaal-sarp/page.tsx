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
import LJ from '@/messages/learn/kaal-sarp.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { AlertTriangle, ArrowUp, ArrowDown, ShieldCheck, Flame, Info } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ── 12 types ──────────────────────────────────────────────────────────
const TWELVE_TYPES = [
  { name: 'Anant', hi: 'अनन्त', house: 1, theme: 'Identity, self-image' },
  { name: 'Kulik', hi: 'कुलिक', house: 2, theme: 'Finances, family' },
  { name: 'Vasuki', hi: 'वासुकि', house: 3, theme: 'Siblings, communication' },
  { name: 'Shankhpal', hi: 'शंखपाल', house: 4, theme: 'Property, mother' },
  { name: 'Padma', hi: 'पद्म', house: 5, theme: 'Children, education' },
  { name: 'Mahapadma', hi: 'महापद्म', house: 6, theme: 'Health, legal' },
  { name: 'Takshak', hi: 'तक्षक', house: 7, theme: 'Marriage, partnerships' },
  { name: 'Karkotak', hi: 'कर्कोटक', house: 8, theme: 'Sudden upheavals' },
  { name: 'Shankhachur', hi: 'शंखचूड़', house: 9, theme: 'Father/guru, faith' },
  { name: 'Ghatak', hi: 'घातक', house: 10, theme: 'Career instability' },
  { name: 'Vishdhar', hi: 'विषधर', house: 11, theme: 'Frustrated ambitions' },
  { name: 'Sheshnag', hi: 'शेषनाग', house: 12, theme: 'Isolation, foreign' },
];

const CANCELLATIONS = [
  'Any planet conjunct Rahu or Ketu breaks the hemming',
  'Strong benefic (Jupiter/Venus exalted or in own sign) aspects Rahu-Ketu axis',
  'Rahu in upachaya house (3, 6, 10, 11) — struggle becomes productive',
  'Jupiter or Venus mahadasha active — effects substantially mitigated',
];

export default function LearnKaalSarpPage() {
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
        'Kaal Sarpa occurs when all 7 planets are hemmed between Rahu and Ketu on one side of the chart.',
        'It is NOT found in BPHS or other major classical texts — it is a later traditional practice. We present it honestly.',
        'Multiple cancellation conditions exist; many successful people have Kaal Sarpa in their charts.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Rahu-Ketu Axis" explanation="The lunar nodes — Rahu (north node) and Ketu (south node) — always 180 degrees apart, forming an axis across the chart" />
        <BeginnerNote term="Dosha" explanation="A blemish or affliction in the birth chart that indicates challenges in specific life areas" />
        <BeginnerNote term="Upachaya Houses" explanation="Houses 3, 6, 10, and 11 — where malefic planets can produce positive results through struggle and effort" />
      </div>

      {/* ── What is Kaal Sarpa ── */}
      <LessonSection title={isHi ? 'काल सर्प दोष क्या है?' : 'What is Kaal Sarpa Dosha?'}>
        <p style={bf}>{t('whatIs')}</p>
      </LessonSection>

      {/* ── 12 Types ── */}
      <LessonSection number={1} title={t('typesTitle')}>
        <p style={bf} className="mb-4">{t('typesContent')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {TWELVE_TYPES.map((type, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
              <span className="text-gold-primary font-bold text-sm">{isHi ? type.hi : type.name}</span>
              <p className="text-text-secondary/60 text-xs">{isHi ? `भाव ${type.house}` : `House ${type.house}`}</p>
              <p className="text-text-secondary text-xs mt-1">{type.theme}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Ascending vs Descending ── */}
      <LessonSection number={2} title={t('ascDescTitle')}>
        <p style={bf}>{t('ascDescContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp size={16} className="text-red-400" />
              <span className="text-red-300 font-semibold text-sm">{isHi ? 'काल सर्प (आरोही)' : 'Kaal Sarpa (Ascending)'}</span>
            </div>
            <p className="text-text-secondary text-xs">
              {isHi ? 'राहु → केतु दिशा। अधिक चुनौतीपूर्ण। प्रभाव जीवन के पहले भाग में।' : 'Rahu → Ketu direction. More challenging. Effects in first half of life.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDown size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'काल अमृत (अवरोही)' : 'Kaal Amrita (Descending)'}</span>
            </div>
            <p className="text-text-secondary text-xs">
              {isHi ? 'केतु → राहु दिशा। प्रभाव क्रमिक। जीवन के दूसरे भाग में। संघर्ष अमृत में बदलता है।' : 'Ketu → Rahu direction. Gradual effects, second half of life. Struggle transmuted into nectar.'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Cancellation ── */}
      <LessonSection number={3} title={t('cancellationTitle')} variant="highlight">
        <p style={bf}>{t('cancellationContent')}</p>
        <div className="mt-4 space-y-2">
          {CANCELLATIONS.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-emerald-300 text-sm">{c}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Effects and Remedies ── */}
      <LessonSection number={4} title={t('effectsTitle')}>
        <p style={bf}>{t('effectsContent')}</p>
      </LessonSection>

      {/* ── Honest Context ── */}
      <LessonSection number={5} title={t('misconceptionsTitle')}>
        <div className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
          <Info size={20} className="text-gold-primary mt-0.5 flex-shrink-0" />
          <p className="text-gold-light text-sm font-medium italic" style={bf}>
            {isHi
              ? '"काल सर्प दोष बृहत् पाराशर होरा शास्त्र में नहीं है। हम इसे ईमानदारी से प्रस्तुत करते हैं — एक जीवित परम्परा के रूप में, न कि शास्त्रीय सिद्धान्त के रूप में।"'
              : '"Kaal Sarpa Dosha is not in BPHS. We present it honestly — as a living tradition, not settled classical doctrine."'}
          </p>
        </div>
        <p style={bf}>{t('misconceptionsContent')}</p>
        <ClassicalReference
          shortName="Traditional Practice"
          chapter="Not found in BPHS, Jataka Parijata, or Phaladeepika — later tradition"
        />
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
            { href: '/kaal-sarp', label: isHi ? 'काल सर्प जाँच उपकरण' : 'Kaal Sarpa Checker Tool' },
            { href: '/learn/doshas', label: isHi ? 'दोष' : 'Doshas' },
            { href: '/learn/doshas-detailed', label: isHi ? 'दोष (विस्तृत)' : 'Doshas (Detailed)' },
            { href: '/mangal-dosha', label: isHi ? 'मंगल दोष' : 'Mangal Dosha' },
            { href: '/pitra-dosha', label: isHi ? 'पितृ दोष' : 'Pitra Dosha' },
            { href: '/learn/remedies', label: isHi ? 'उपाय' : 'Remedies' },
            { href: '/learn/kundali', label: isHi ? 'कुण्डली पठन' : 'Reading a Kundali' },
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
