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
import LJ from '@/messages/learn/tithi-pravesha.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Sun, Moon, Calendar, BarChart3, Layers } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ── Panchanga elements at TP ──────────────────────────────────────────
const PANCHANGA_ELEMENTS = [
  { element: 'Tithi Lord', hi: 'तिथि स्वामी', role: 'Year Lord — dominant influence', icon: Sun },
  { element: 'Nakshatra', hi: 'नक्षत्र', role: 'Emotional tone and focus areas', icon: Moon },
  { element: 'Yoga', hi: 'योग', role: 'General fortune or challenge pattern', icon: BarChart3 },
  { element: 'Karana', hi: 'करण', role: 'Pace of events unfolding', icon: Calendar },
  { element: 'Vara Lord', hi: 'वार स्वामी', role: 'Additional layer of influence', icon: Layers },
];

const COMPARISON = [
  { feature: 'Trigger', solar: 'Sun returns to natal degree', tp: 'Sun-Moon angle matches natal tithi' },
  { feature: 'Date', solar: 'Same Gregorian date (±1 day)', tp: 'Different date each year' },
  { feature: 'Basis', solar: 'Solar only', tp: 'Luni-solar (tithi)' },
  { feature: 'Panchanga', solar: 'Not considered', tp: 'All 5 elements read' },
  { feature: 'Tradition', solar: 'Western / Tajika', tp: 'Vedic (Parashara lineage)' },
];

export default function LearnTithiPraveshaPage() {
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
        'Tithi Pravesha finds the exact moment your birth Sun-Moon angle recurs each year — your Vedic birthday.',
        'The tithi lord at that moment becomes your Year Lord, the dominant planetary influence for the coming year.',
        'Unlike Western solar returns, TP captures the full panchanga (tithi, nakshatra, yoga, karana, vara) for richer prediction.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Tithi" explanation="One of 30 lunar days, defined by each 12-degree increment in the Sun-Moon angular separation" />
        <BeginnerNote term="Solar Return" explanation="The Western astrology technique of casting a chart when the Sun returns to its exact birth position each year" />
        <BeginnerNote term="Year Lord" explanation="The planet ruling the tithi at the Tithi Pravesha moment, considered the dominant influence for the coming year" />
      </div>

      {/* ── What is Tithi Pravesha ── */}
      <LessonSection title={isHi ? 'तिथि प्रवेश क्या है?' : 'What is Tithi Pravesha?'}>
        <p style={bf}>{t('whatIs')}</p>
      </LessonSection>

      {/* ── Vs Solar Return ── */}
      <LessonSection number={1} title={t('vsSolarTitle')}>
        <p style={bf}>{t('vsSolarContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/10">
                <th className="py-2 text-left"></th>
                <th className="py-2 text-left">{isHi ? 'सौर प्रत्यावर्तन' : 'Solar Return'}</th>
                <th className="py-2 text-left">{isHi ? 'तिथि प्रवेश' : 'Tithi Pravesha'}</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2 text-gold-primary text-xs font-medium">{row.feature}</td>
                  <td className="py-2 text-text-secondary text-xs">{row.solar}</td>
                  <td className="py-2 text-text-primary text-xs">{row.tp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ── Panchanga at TP ── */}
      <LessonSection number={2} title={t('panchangaTitle')} variant="highlight">
        <p style={bf}>{t('panchangaContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PANCHANGA_ELEMENTS.map((el, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10">
              <el.icon size={16} className="text-gold-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-gold-light font-semibold text-sm">{isHi ? el.hi : el.element}</span>
                <p className="text-text-secondary text-xs mt-1">{el.role}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Interpreting ── */}
      <LessonSection number={3} title={t('interpretingTitle')}>
        <p style={bf}>{t('interpretingContent')}</p>
        <div className="mt-4 space-y-2">
          {[
            { area: isHi ? 'लग्नेश' : 'Lagna Lord', desc: isHi ? 'वर्ष की समग्र जीवनशक्ति और दिशा' : 'Overall vitality and direction for the year' },
            { area: isHi ? 'चन्द्र राशि' : 'Moon Sign', desc: isHi ? 'भावनात्मक और मानसिक परिदृश्य' : 'Emotional and mental landscape' },
            { area: isHi ? 'दशम भाव' : '10th House', desc: isHi ? 'कैरियर विकास' : 'Career developments' },
            { area: isHi ? 'सप्तम भाव' : '7th House', desc: isHi ? 'सम्बन्ध गतिशीलता' : 'Relationship dynamics' },
            { area: isHi ? 'सक्रिय दशा' : 'Active Dasha', desc: isHi ? 'गहरा कार्मिक संदर्भ' : 'Deeper karmic context from natal Vimshottari' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-gold-primary/10">
              <span className="w-5 h-5 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <span className="text-gold-light font-semibold text-sm">{item.area}</span>
                <span className="text-text-secondary text-xs ml-2">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Practical Use ── */}
      <LessonSection number={4} title={t('practicalTitle')}>
        <p style={bf}>{t('practicalContent')}</p>
        <ClassicalReference
          shortName="Sanjay Rath"
          chapter="Tithi Pravesha technique (modern synthesis from traditional principles)"
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
            { href: '/tithi-pravesha', label: isHi ? 'तिथि प्रवेश उपकरण' : 'Tithi Pravesha Tool' },
            { href: '/varshaphal', label: isHi ? 'वर्षफल' : 'Varshaphal (Tajika)' },
            { href: '/learn/tithis', label: isHi ? 'तिथियाँ' : 'Tithis' },
            { href: '/learn/dashas', label: isHi ? 'दशाएँ' : 'Dashas' },
            { href: '/learn/nakshatras', label: isHi ? 'नक्षत्र' : 'Nakshatras' },
            { href: '/kundali', label: isHi ? 'कुण्डली' : 'Birth Chart Generator' },
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
