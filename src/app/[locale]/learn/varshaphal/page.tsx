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
import LJ from '@/messages/learn/varshaphal.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Sun, Moon, Star, Crown, Clock, Layers, ArrowRightLeft, Compass } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

const TAJIKA_YOGAS = [
  { name: 'Ikkabal', hi: 'इक्क़बाल', desc: 'Planet in own sign / exaltation — strength' },
  { name: 'Induvara', hi: 'इन्दुवार', desc: 'Planet only in Panapharas — moderate success' },
  { name: 'Ithasala', hi: 'इत्थशाल', desc: 'Applying aspect — event will manifest' },
  { name: 'Ishrafa', hi: 'ईशराफ', desc: 'Separating aspect — opportunity has passed' },
  { name: 'Nakta', hi: 'नक्त', desc: 'Transfer of light through a third planet' },
  { name: 'Yamaya', hi: 'यमया', desc: 'Mutual application between two slow planets' },
  { name: 'Manau', hi: 'मनौ', desc: 'Translation of light (benefic intermediary)' },
  { name: 'Kamboola', hi: 'कम्बूल', desc: 'Ithasala with Moon involved — strong' },
  { name: 'Gairi Kamboola', hi: 'गैरी कम्बूल', desc: 'Moon separating — weaker Kamboola' },
  { name: 'Khalasara', hi: 'खलासरा', desc: 'Frustration by a third planet\'s interference' },
  { name: 'Radda', hi: 'रद्द', desc: 'Refranation — planet turns retrograde before aspect' },
  { name: 'Duhphali Kuttha', hi: 'दुःफलि कुत्थ', desc: 'Both planets in unfavourable houses' },
  { name: 'Dutthotthi Davira', hi: 'दुत्थोत्थि दवीर', desc: 'One planet combust — weakened yoga' },
  { name: 'Tambira', hi: 'तम्बीर', desc: 'Mutual exchange of signs (parivartana)' },
  { name: 'Kuttha', hi: 'कुत्थ', desc: 'Planet in 6th/8th/12th from its lord' },
  { name: 'Durpha', hi: 'दुर्फ', desc: 'No applying aspect from any planet' },
];

const SAHAMS_TABLE = [
  { name: 'Punya', hi: 'पुण्य', domain: 'Fortune / Merit' },
  { name: 'Vidya', hi: 'विद्या', domain: 'Education' },
  { name: 'Vivaha', hi: 'विवाह', domain: 'Marriage' },
  { name: 'Putra', hi: 'पुत्र', domain: 'Children' },
  { name: 'Karma', hi: 'कर्म', domain: 'Profession' },
  { name: 'Roga', hi: 'रोग', domain: 'Disease' },
  { name: 'Mrityu', hi: 'मृत्यु', domain: 'Danger / Death' },
  { name: 'Bandhu', hi: 'बन्धु', domain: 'Relatives' },
];

export default function LearnVarshaphalPage() {
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
        'Varshaphal is the Vedic solar return chart — cast for the exact moment the Sun returns to its natal degree each birthday.',
        'The Varshesha (Year Lord) and Muntha placement together set the tone for the entire year — check them first.',
        'Always overlay Varshaphal findings on the natal chart — a weak natal planet cannot deliver results even if strong in the annual chart.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Solar Return" explanation="A chart cast for the exact moment the Sun returns to its birth position each year — the basis of Varshaphal" />
        <BeginnerNote term="Tajika" explanation="The Indo-Persian astrological system specialised in annual predictions, using its own yoga and aspect framework" />
        <BeginnerNote term="Muntha" explanation="A sensitive point that advances one sign per year from the natal Lagna — its house placement indicates the year's direction" />
        <BeginnerNote term="Mudda Dasha" explanation="Vimshottari Dasha compressed into one year — each planet rules a period of days or weeks" />
      </div>

      {/* Intro */}
      <LessonSection title={isHi ? 'वर्षफल क्या है?' : 'What is Varshaphal?'}>
        <p style={bf}>{t('intro')}</p>
      </LessonSection>

      {/* Tajika vs Parashari */}
      <LessonSection number={1} title={t('tajikaVsParashariTitle')}>
        <p style={bf}>{t('tajikaVsParashariContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Compass size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'पाराशरी' : 'Parashari'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'जन्मकुण्डली = जीवनभर का खाका। भावेश, ग्रह स्थिति, दशा।' : 'Natal chart = lifetime blueprint. House lords, placements, dashas.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'ताजिक' : 'Tajika'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'वार्षिक कुण्डली = एक वर्ष का भविष्यफल। ताजिक योग, मुन्था, मुद्दा दशा।' : 'Annual chart = one-year forecast. Tajika yogas, Muntha, Mudda Dasha.'}</p>
          </div>
        </div>
      </LessonSection>

      {/* Muntha */}
      <LessonSection number={2} title={t('munthaTitle')} variant="highlight">
        <p style={bf}>{t('munthaContent')}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: isHi ? 'केन्द्र (1,4,7,10)' : 'Kendras (1,4,7,10)', quality: isHi ? 'उन्नति' : 'Growth', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            { label: isHi ? 'त्रिकोण (1,5,9)' : 'Trikonas (1,5,9)', quality: isHi ? 'अवसर' : 'Opportunity', cls: 'text-emerald-400/70 bg-emerald-500/10 border-emerald-500/15' },
            { label: isHi ? 'त्रिक (6,8,12)' : 'Trika (6,8,12)', quality: isHi ? 'चुनौती' : 'Challenges', cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
          ].map((item, i) => (
            <div key={i} className={`p-3 rounded-xl border text-center ${item.cls}`}>
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-xs mt-1 opacity-80">{item.quality}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Sahams */}
      <LessonSection number={3} title={t('sahamsTitle')}>
        <p style={bf}>{t('sahamsContent')}</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAHAMS_TABLE.map(s => (
            <div key={s.name} className="p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
              <div className="text-gold-light text-sm font-semibold">{isHi ? s.hi : s.name}</div>
              <div className="text-text-secondary text-xs">{s.domain}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Mudda Dasha */}
      <LessonSection number={4} title={t('muddaDashaTitle')}>
        <p style={bf}>{t('muddaDashaContent')}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { name: 'Sun', hi: 'सूर्य', days: '18.3' },
            { name: 'Moon', hi: 'चन्द्र', days: '30.4' },
            { name: 'Mars', hi: 'मंगल', days: '21.3' },
            { name: 'Rahu', hi: 'राहु', days: '54.7' },
            { name: 'Jupiter', hi: 'गुरु', days: '48.7' },
            { name: 'Saturn', hi: 'शनि', days: '57.8' },
            { name: 'Mercury', hi: 'बुध', days: '51.7' },
            { name: 'Ketu', hi: 'केतु', days: '21.3' },
            { name: 'Venus', hi: 'शुक्र', days: '60.9' },
          ].map(p => (
            <div key={p.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-gold-primary/10">
              <Clock size={12} className="text-gold-primary" />
              <span className="text-text-primary text-xs font-medium">{isHi ? p.hi : p.name}</span>
              <span className="text-text-secondary text-xs">{p.days}d</span>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 16 Tajika Yogas */}
      <LessonSection number={5} title={t('tajikaYogasTitle')} variant="highlight">
        <p style={bf}>{t('tajikaYogasContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TAJIKA_YOGAS.map((y, i) => (
            <div key={y.name} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/8">
              <span className="w-5 h-5 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-[10px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <span className="text-gold-light text-sm font-semibold">{isHi ? y.hi : y.name}</span>
                <p className="text-text-secondary text-xs">{y.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="Tajika Neelakanthi" author="Neelakantha Daivagna" chapter="16th century CE — foundational Tajika text" />
      </LessonSection>

      {/* Varshesha */}
      <LessonSection number={6} title={t('varsheshaTitle')}>
        <p style={bf}>{t('varsheshaContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { planet: isHi ? 'गुरु वर्षेश' : 'Jupiter Varshesha', effect: isHi ? 'ज्ञान, विस्तार, धर्म' : 'Wisdom, expansion, dharma', icon: Star, cls: 'text-amber-400' },
            { planet: isHi ? 'मंगल वर्षेश' : 'Mars Varshesha', effect: isHi ? 'ऊर्जा, संघर्ष, निर्णायक कार्य' : 'Energy, conflict, decisive action', icon: Sun, cls: 'text-red-400' },
            { planet: isHi ? 'शनि वर्षेश' : 'Saturn Varshesha', effect: isHi ? 'अनुशासन, विलम्ब, परिपक्वता' : 'Discipline, delays, maturation', icon: Moon, cls: 'text-blue-400' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <item.icon size={16} className={item.cls} />
                <span className="text-gold-light font-semibold text-sm">{item.planet}</span>
              </div>
              <p className="text-text-secondary text-xs">{item.effect}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* How to Read */}
      <LessonSection number={7} title={t('howToReadTitle')}>
        <p style={bf}>{t('howToReadContent')}</p>
        <div className="mt-4 space-y-2">
          {[
            { num: '1', text: isHi ? 'वर्षेश देखें — भाव, गरिमा, दृष्टि' : 'Check Varshesha — house, dignity, aspects', icon: Crown },
            { num: '2', text: isHi ? 'मुन्था — भाव और स्वामी की दशा' : 'Examine Muntha — house and lord condition', icon: Compass },
            { num: '3', text: isHi ? 'ताजिक योग — इत्थशाल/ईशराफ़' : 'Analyse Tajika Yogas — Ithasala / Ishrafa', icon: Layers },
            { num: '4', text: isHi ? 'मुद्दा दशा — मासिक समय निर्धारण' : 'Check Mudda Dasha — monthly timing', icon: Clock },
            { num: '5', text: isHi ? 'जन्मकुण्डली से मिलान करें' : 'Overlay on natal chart for validation', icon: ArrowRightLeft },
          ].map((item) => (
            <div key={item.num} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                {item.num}
              </span>
              <div className="flex items-center gap-2">
                <item.icon size={14} className="text-gold-primary flex-shrink-0" />
                <p className="text-sm text-text-primary">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="Varshaphala" author="B.V. Raman" chapter="Comprehensive modern reference on annual horoscopy" />
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
            { href: '/varshaphal', label: isHi ? 'वर्षफल कैलकुलेटर' : 'Varshaphal Calculator' },
            { href: '/learn/dashas', label: isHi ? 'दशा प्रणाली' : 'Dasha System' },
            { href: '/learn/kundali', label: isHi ? 'कुण्डली पठन' : 'Reading a Kundali' },
            { href: '/learn/planets', label: isHi ? 'ग्रह' : 'Planets' },
            { href: '/learn/bhavas', label: isHi ? 'भाव' : 'Houses (Bhavas)' },
            { href: '/annual-forecast', label: isHi ? 'वार्षिक पूर्वानुमान' : 'Annual Forecast' },
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
