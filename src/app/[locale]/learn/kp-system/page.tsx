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
import LJ from '@/messages/learn/kp-system.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Target, Layers, Grid3X3, Hash, Zap, ArrowRightLeft } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

const SIGNIFICATOR_LEVELS = [
  { level: '1', en: 'Planets in the star of the house occupant', hi: 'भाव में स्थित ग्रह के नक्षत्र में स्थित ग्रह', strength: 'Strongest' },
  { level: '2', en: 'The occupant of the house itself', hi: 'स्वयं भाव में स्थित ग्रह', strength: 'Strong' },
  { level: '3', en: 'Planets in the star of the cusp lord', hi: 'सन्धि स्वामी के नक्षत्र में स्थित ग्रह', strength: 'Moderate' },
  { level: '4', en: 'The cusp lord itself', hi: 'स्वयं सन्धि स्वामी', strength: 'Weakest' },
];

export default function LearnKPSystemPage() {
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
        'KP\'s sub-lord theory divides each nakshatra into 9 unequal parts — the sub-lord is the decisive factor, not just the sign or star lord.',
        'KP uses Placidus houses (unequal sizes) instead of Equal Houses — the cusp sub-lord determines what a house actually delivers.',
        'KP excels at binary yes/no predictions; Parashari excels at understanding the quality and karmic depth of life events. Use both.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Sub-Lord" explanation="The planet ruling the sub-division of a nakshatra where a planet or cusp falls — the decisive factor in KP" />
        <BeginnerNote term="Placidus" explanation="A house system where houses are unequal in size, based on the time it takes degrees to move between angles" />
        <BeginnerNote term="Significator" explanation="In KP, a planet that represents a house through a 4-level hierarchy — not just by ruling the cusp sign" />
        <BeginnerNote term="Ruling Planets" explanation="The sign, star, and sub lords of Moon and Ascendant at the moment of judgement — used to verify predictions" />
      </div>

      {/* Intro */}
      <LessonSection title={isHi ? 'केपी पद्धति क्या है?' : 'What is KP System?'}>
        <p style={bf}>{t('intro')}</p>
      </LessonSection>

      {/* Sub-Lord Theory */}
      <LessonSection number={1} title={t('subLordTitle')} variant="highlight">
        <p style={bf}>{t('subLordContent')}</p>
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-gold-primary" />
            <span className="text-gold-light font-semibold text-sm">{isHi ? 'विभाजन श्रेणी' : 'Division Hierarchy'}</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap text-xs">
            <span className="px-2 py-1 rounded bg-gold-primary/15 text-gold-light border border-gold-primary/20">
              {isHi ? 'राशि (30°)' : 'Sign (30°)'}
            </span>
            <span className="text-text-secondary">&rarr;</span>
            <span className="px-2 py-1 rounded bg-gold-primary/15 text-gold-light border border-gold-primary/20">
              {isHi ? 'नक्षत्र (13°20\')' : 'Star (13°20\')'}
            </span>
            <span className="text-text-secondary">&rarr;</span>
            <span className="px-2 py-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold">
              {isHi ? 'सब (असमान)' : 'Sub (unequal)'}
            </span>
            <span className="text-text-secondary">&rarr;</span>
            <span className="px-2 py-1 rounded bg-white/[0.05] text-text-secondary border border-white/10">
              {isHi ? 'सब-सब' : 'Sub-Sub'}
            </span>
          </div>
        </div>
      </LessonSection>

      {/* Placidus */}
      <LessonSection number={2} title={t('placidusTitle')}>
        <p style={bf}>{t('placidusContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Grid3X3 size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'समान भाव' : 'Equal House'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'प्रत्येक भाव = 30°। पारम्परिक वैदिक ज्योतिष का मानक।' : 'Each house = 30°. Standard in traditional Vedic astrology.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'प्लेसिडस' : 'Placidus'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'भाव असमान (25°–35°)। सन्धि उप-स्वामी निर्णायक।' : 'Houses unequal (25°–35°). Cusp sub-lord is decisive.'}</p>
          </div>
        </div>
      </LessonSection>

      {/* KP Number */}
      <LessonSection number={3} title={t('kpNumberTitle')}>
        <p style={bf}>{t('kpNumberContent')}</p>
        <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Hash size={16} className="text-gold-primary" />
            <span className="text-gold-light font-semibold text-sm">{isHi ? 'केपी संख्या सूत्र' : 'KP Number Formula'}</span>
          </div>
          <p className="text-text-secondary text-xs">249 = 27 {isHi ? 'नक्षत्र' : 'nakshatras'} × 9 {isHi ? 'सब' : 'subs'} + 6 {isHi ? 'सब-सब' : 'sub-subs'}</p>
          <p className="text-text-secondary text-xs mt-1">{isHi ? 'एक संख्या → राशिचक्र में एक विशिष्ट बिन्दु → सम्पूर्ण होरेरी कुण्डली' : 'One number → a specific zodiac point → a complete horary chart'}</p>
        </div>
      </LessonSection>

      {/* Significators */}
      <LessonSection number={4} title={t('significatorsTitle')} variant="highlight">
        <p style={bf}>{t('significatorsContent')}</p>
        <div className="mt-4 space-y-2">
          {SIGNIFICATOR_LEVELS.map(s => (
            <div key={s.level} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                {s.level}
              </span>
              <div className="flex-1">
                <p className="text-sm text-text-primary">{isHi ? s.hi : s.en}</p>
                <span className={`text-xs ${s.level === '1' ? 'text-emerald-400' : s.level === '4' ? 'text-text-secondary' : 'text-gold-primary/70'}`}>
                  {s.strength}
                </span>
              </div>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="KP Reader I-VI" author="Prof. K.S. Krishnamurti" chapter="Volumes I through VI — the complete KP reference" />
      </LessonSection>

      {/* KP vs Parashari */}
      <LessonSection number={5} title={t('kpVsParashariTitle')}>
        <p style={bf}>{t('kpVsParashariContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-amber-400" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'केपी श्रेष्ठ कब' : 'When KP Excels'}</span>
            </div>
            <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
              <li>{isHi ? 'हाँ/नहीं प्रश्न' : 'Binary yes/no questions'}</li>
              <li>{isHi ? 'घटना का समय' : 'Event timing'}</li>
              <li>{isHi ? 'प्रश्न ज्योतिष' : 'Horary astrology'}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft size={16} className="text-amber-400" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'पाराशरी श्रेष्ठ कब' : 'When Parashari Excels'}</span>
            </div>
            <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
              <li>{isHi ? 'जीवन गुणवत्ता का विश्लेषण' : 'Life quality analysis'}</li>
              <li>{isHi ? 'कार्मिक प्रतिरूप' : 'Karmic patterns'}</li>
              <li>{isHi ? 'उपचार ढाँचा' : 'Remedial framework'}</li>
            </ul>
          </div>
        </div>
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
            { href: '/kp-system', label: isHi ? 'केपी कैलकुलेटर' : 'KP System Calculator' },
            { href: '/learn/kundali', label: isHi ? 'कुण्डली पठन' : 'Reading a Kundali' },
            { href: '/learn/bhavas', label: isHi ? 'भाव' : 'Houses (Bhavas)' },
            { href: '/learn/nakshatras', label: isHi ? 'नक्षत्र' : 'Nakshatras' },
            { href: '/learn/dashas', label: isHi ? 'दशा' : 'Dashas' },
            { href: '/prashna', label: isHi ? 'प्रश्न कुण्डली' : 'Prashna Kundali' },
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
