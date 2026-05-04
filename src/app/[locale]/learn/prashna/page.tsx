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
import LJ from '@/messages/learn/prashna.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { HelpCircle, Star, Target, BookOpen, Compass, Sparkles } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ── Key Prashna houses ──────────────────────────────────────────────
const PRASHNA_HOUSES = [
  { house: '1st', topic: 'Self / Querent', hi: 'स्वयं / प्रश्नकर्ता' },
  { house: '2nd', topic: 'Money / Family', hi: 'धन / परिवार' },
  { house: '4th', topic: 'Property / Vehicle', hi: 'सम्पत्ति / वाहन' },
  { house: '5th', topic: 'Children / Education', hi: 'सन्तान / शिक्षा' },
  { house: '7th', topic: 'Marriage / Partnership', hi: 'विवाह / साझेदारी' },
  { house: '8th', topic: 'Hidden matters / Longevity', hi: 'छिपी बातें / आयु' },
  { house: '10th', topic: 'Career / Status', hi: 'कैरियर / प्रतिष्ठा' },
  { house: '11th', topic: 'Gains / Fulfilment', hi: 'लाभ / पूर्ति' },
  { house: '12th', topic: 'Loss / Foreign', hi: 'हानि / विदेश' },
];

const QUICK_YOGAS = [
  { condition: 'Waxing Moon in lagna', hi: 'शुक्ल चन्द्र लग्न में', result: 'Strong YES', cls: 'text-emerald-400' },
  { condition: 'Lagna lord + question lord in mutual kendras', hi: 'लग्नेश + प्रश्न भावेश परस्पर केन्द्र में', result: 'Success', cls: 'text-emerald-400' },
  { condition: 'Benefics in lagna and 7th', hi: 'शुभ ग्रह लग्न और सप्तम में', result: 'Favourable', cls: 'text-emerald-400' },
  { condition: 'Malefics in lagna + 7th, Moon waning', hi: 'पाप ग्रह लग्न + सप्तम में, क्षीण चन्द्र', result: 'Clear NO', cls: 'text-red-400' },
  { condition: 'Lagna cusp sub-lord retrograde (KP)', hi: 'लग्न शिखर उप-स्वामी वक्री (KP)', result: 'Will not happen', cls: 'text-red-400' },
];

export default function LearnPrashnaPage() {
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
        'Prashna casts a chart for the moment of the question — not the birth time — making it ideal when birth data is unavailable.',
        'The three pillars: Arudha Lagna (from querent\'s number), Moon\'s position (mental state), and relevant house lord (topic).',
        'Kerala\'s Ashtamangala Prashna tradition adds eight physical objects for layered divination.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Horary Astrology" explanation="A branch of astrology that answers specific questions from a chart cast at the moment of asking, rather than from a birth chart" />
        <BeginnerNote term="Arudha Lagna" explanation="A special ascendant in Prashna derived from a number (1-108) chosen by the querent or from the first syllable of the question" />
        <BeginnerNote term="Kendra" explanation="Houses 1, 4, 7, and 10 — the angular houses, considered the strongest positions in a chart" />
      </div>

      {/* ── What is Prashna ── */}
      <LessonSection title={isHi ? 'प्रश्न ज्योतिष क्या है?' : 'What is Prashna?'}>
        <p style={bf}>{t('whatIs')}</p>
      </LessonSection>

      {/* ── How Cast ── */}
      <LessonSection number={1} title={t('castingTitle')}>
        <p style={bf}>{t('castingContent')}</p>
        <ClassicalReference
          shortName="Prashna Marga"
          chapter="Ch. 1-3 (Principles of Prashna chart casting)"
        />
      </LessonSection>

      {/* ── Key Factors ── */}
      <LessonSection number={2} title={t('keyFactorsTitle')} variant="highlight">
        <p style={bf}>{t('keyFactorsContent')}</p>
        <div className="mt-4 space-y-2">
          {[
            { num: '1', icon: Compass, label: isHi ? 'आरूढ़ लग्न' : 'Arudha Lagna', desc: isHi ? 'प्रश्नकर्ता की संख्या (1-108) या प्रथम अक्षर से' : 'From querent\'s number (1-108) or first syllable' },
            { num: '2', icon: Star, label: isHi ? 'चन्द्र स्थिति' : 'Moon\'s Position', desc: isHi ? 'मन और भावनात्मक स्थिति का दर्पण' : 'Mirror of the mind and emotional state' },
            { num: '3', icon: Target, label: isHi ? 'भाव स्वामी' : 'Relevant House Lord', desc: isHi ? 'प्रश्न विषय का भाव और उसके स्वामी की शक्ति' : 'The house governing the question\'s topic and its lord\'s strength' },
          ].map(item => (
            <div key={item.num} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                {item.num}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <item.icon size={14} className="text-gold-primary" />
                  <span className="text-gold-light font-semibold text-sm">{item.label}</span>
                </div>
                <p className="text-text-secondary text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Houses for questions ── */}
      <LessonSection number={3} title={isHi ? 'प्रश्न विषय और भाव' : 'Question Topics and Houses'}>
        <div className="grid grid-cols-3 gap-2">
          {PRASHNA_HOUSES.map((h, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
              <span className="text-gold-primary font-bold text-sm">{h.house}</span>
              <p className="text-text-secondary text-xs mt-1">{isHi ? h.hi : h.topic}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── When to use ── */}
      <LessonSection number={4} title={t('vsNatalTitle')}>
        <p style={bf}>{t('vsNatalContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'प्रश्न कुण्डली' : 'Use Prashna'}</span>
            </div>
            <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
              <li>{isHi ? 'जन्म समय अज्ञात' : 'Birth time unknown'}</li>
              <li>{isHi ? 'तत्काल उत्तर चाहिए' : 'Need immediate answer'}</li>
              <li>{isHi ? 'विशिष्ट प्रश्न' : 'Specific question'}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-text-secondary" />
              <span className="text-text-primary font-semibold text-sm">{isHi ? 'जन्म कुण्डली' : 'Use Natal Chart'}</span>
            </div>
            <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
              <li>{isHi ? 'सम्पूर्ण जीवन अवलोकन' : 'Full life overview'}</li>
              <li>{isHi ? 'दशा/योग विश्लेषण' : 'Dasha/yoga analysis'}</li>
              <li>{isHi ? 'अनुकूलता मिलान' : 'Compatibility matching'}</li>
            </ul>
          </div>
        </div>
      </LessonSection>

      {/* ── Quick Yogas ── */}
      <LessonSection number={5} title={t('yogasTitle')}>
        <p style={bf}>{t('yogasContent')}</p>
        <div className="mt-4 space-y-2">
          {QUICK_YOGAS.map((y, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-gold-primary/10">
              <Sparkles size={14} className={y.cls} />
              <span className="text-text-primary text-sm flex-1">{isHi ? y.hi : y.condition}</span>
              <span className={`text-xs font-bold ${y.cls}`}>{y.result}</span>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Kerala tradition ── */}
      <LessonSection number={6} title={t('keralaTitle')} variant="highlight">
        <p style={bf}>{t('keralaContent')}</p>
        <ClassicalReference
          shortName="Prashna Marga"
          chapter="Ashtamangala Prashna chapters"
        />
        <ClassicalReference
          shortName="Tajika Neelakanthi"
          author="Neelakantha Daivagna"
          chapter="Prashna integration with Tajika techniques"
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
            { href: '/prashna', label: isHi ? 'प्रश्न कुण्डली उपकरण' : 'Prashna Kundali Tool' },
            { href: '/prashna-ashtamangala', label: isHi ? 'अष्टमंगल प्रश्न' : 'Ashtamangala Prashna' },
            { href: '/learn/kundali', label: isHi ? 'कुण्डली पठन' : 'Reading a Kundali' },
            { href: '/learn/bhavas', label: isHi ? 'भाव (गृह)' : 'Bhavas (Houses)' },
            { href: '/learn/lagna', label: isHi ? 'लग्न' : 'Lagna' },
            { href: '/kp-system', label: isHi ? 'केपी प्रणाली' : 'KP System' },
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
