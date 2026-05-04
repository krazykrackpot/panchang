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
import LJ from '@/messages/learn/rahu-kaal.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Clock, AlertTriangle, Shield, Sun, Moon, Info } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ── Rahu Kaal slot rotation sequence ──────────────────────────────────
const RAHU_KAAL_SLOTS = [
  { day: 'Sunday',    hi: 'रविवार',    ta: 'ஞாயிறு',    bn: 'রবিবার',    slot: 8, approx: '4:30 PM – 6:00 PM' },
  { day: 'Monday',    hi: 'सोमवार',    ta: 'திங்கள்',    bn: 'সোমবার',    slot: 2, approx: '7:30 AM – 9:00 AM' },
  { day: 'Tuesday',   hi: 'मंगलवार',   ta: 'செவ்வாய்',   bn: 'মঙ্গলবার',   slot: 7, approx: '3:00 PM – 4:30 PM' },
  { day: 'Wednesday', hi: 'बुधवार',    ta: 'புதன்',     bn: 'বুধবার',    slot: 5, approx: '12:00 PM – 1:30 PM' },
  { day: 'Thursday',  hi: 'गुरुवार',   ta: 'வியாழன்',   bn: 'বৃহস্পতিবার', slot: 6, approx: '1:30 PM – 3:00 PM' },
  { day: 'Friday',    hi: 'शुक्रवार',  ta: 'வெள்ளி',    bn: 'শুক্রবার',   slot: 4, approx: '10:30 AM – 12:00 PM' },
  { day: 'Saturday',  hi: 'शनिवार',    ta: 'சனி',       bn: 'শনিবার',    slot: 3, approx: '9:00 AM – 10:30 AM' },
];

const THREE_KAALS = [
  { name: 'Rahu Kaal', hi: 'राहु काल', ruler: 'Rahu', nature: 'Strongest prohibition for new beginnings', cls: 'text-red-400' },
  { name: 'Yamaganda', hi: 'यमगण्ड', ruler: 'Yama', nature: 'Avoid risky travel and health procedures', cls: 'text-amber-400' },
  { name: 'Gulika Kaal', hi: 'गुलिक काल', ruler: 'Saturn (sub)', nature: 'Avoid auspicious ceremonies', cls: 'text-purple-400' },
];

export default function LearnRahuKaalPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};

  const dayLabel = (row: typeof RAHU_KAAL_SLOTS[0]) => {
    if (locale === 'hi') return row.hi;
    if (locale === 'ta') return row.ta;
    if (locale === 'bn') return row.bn;
    return row.day;
  };

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
        'Rahu Kaal is 1/8th of daytime — roughly 1.5 hours — assigned to Rahu each day.',
        'Only the commencement of new activities is discouraged; ongoing tasks are unaffected.',
        'The slot rotates daily: Sun=8, Mon=2, Tue=7, Wed=5, Thu=6, Fri=4, Sat=3.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Rahu" explanation="A shadow planet (lunar node) associated with illusion, obsession, and unexpected disruption in Vedic astrology" />
        <BeginnerNote term="Daytime Division" explanation="The period from sunrise to sunset, divided into 8 equal slots for calculating Rahu Kaal, Yamaganda, and Gulika" />
        <BeginnerNote term="Muhurta" explanation="An auspicious time window chosen using panchang factors for starting important activities" />
      </div>

      {/* ── What is Rahu Kaal ── */}
      <LessonSection title={isHi ? 'राहु काल क्या है?' : 'What is Rahu Kaal?'}>
        <p style={bf}>{t('whatIs')}</p>
      </LessonSection>

      {/* ── Daily Rotation ── */}
      <LessonSection number={1} title={t('rotationTitle')}>
        <p style={bf}>{t('rotationContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/10">
                <th className="py-2 text-left">{isHi ? 'वार' : 'Day'}</th>
                <th className="py-2 text-left">{isHi ? 'खंड' : 'Slot'}</th>
                <th className="py-2 text-left">{isHi ? 'अनुमानित समय' : 'Approx. Time*'}</th>
              </tr>
            </thead>
            <tbody>
              {RAHU_KAAL_SLOTS.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2 text-text-primary font-medium">{dayLabel(row)}</td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold">
                      #{row.slot}
                    </span>
                  </td>
                  <td className="py-2 text-text-secondary text-xs">{row.approx}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-text-secondary/60 text-xs mt-2 italic">
            * Approximate times for 6:00 AM sunrise / 6:00 PM sunset. Actual times vary by location and season.
          </p>
        </div>
        <ClassicalReference
          shortName="Muhurta Chintamani"
          author="Daivagna Acharya Shri Ram"
          chapter="Rahu Kaal rotation sequence"
        />
      </LessonSection>

      {/* ── Why Avoid ── */}
      <LessonSection number={2} title={isHi ? 'नये कार्य क्यों वर्जित हैं?' : 'Why Avoid Starting New Ventures?'}>
        <p style={bf}>{t('whyAvoid')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-red-400" />
              <span className="text-red-300 font-semibold text-sm">{isHi ? 'वर्जित' : 'Avoid'}</span>
            </div>
            <p className="text-text-secondary text-xs">
              {isHi ? 'नया व्यापार आरम्भ, अनुबन्ध हस्ताक्षर, यात्रा शुरू, शुभ संस्कार, नई खरीदारी' : 'Starting a business, signing contracts, beginning travel, auspicious ceremonies, new purchases'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-emerald-300 font-semibold text-sm">{isHi ? 'ठीक है' : 'Perfectly Fine'}</span>
            </div>
            <p className="text-text-secondary text-xs">
              {isHi ? 'चालू कार्य जारी रखना, भोजन, नींद, नियमित कार्यालय कार्य, पहले से तय बैठकें' : 'Continuing ongoing work, eating, sleeping, routine office work, pre-scheduled meetings'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Three Kaals ── */}
      <LessonSection number={3} title={t('differenceTitle')} variant="highlight">
        <p style={bf}>{t('differenceContent')}</p>
        <div className="mt-4 space-y-3">
          {THREE_KAALS.map((kaal, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10">
              <Clock size={16} className={`${kaal.cls} mt-0.5 flex-shrink-0`} />
              <div>
                <span className={`font-semibold text-sm ${kaal.cls}`}>{isHi ? kaal.hi : kaal.name}</span>
                <span className="text-text-secondary text-xs ml-2">({isHi ? 'शासक: ' : 'Ruler: '}{kaal.ruler})</span>
                <p className="text-text-secondary text-xs mt-1">{kaal.nature}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Misconceptions ── */}
      <LessonSection number={4} title={t('misconceptionsTitle')}>
        <div className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
          <Info size={20} className="text-gold-primary mt-0.5 flex-shrink-0" />
          <p className="text-gold-light text-sm font-medium italic" style={bf}>
            {isHi
              ? '"राहु काल में सब कुछ रुकना चाहिए — यह सबसे बड़ी भ्रान्ति है। शास्त्र केवल नये आरम्भ से बचने कहते हैं।"'
              : '"Everything must stop during Rahu Kaal — this is the biggest misconception. Classical texts only caution against new beginnings."'}
          </p>
        </div>
        <p style={bf}>{t('misconceptionsContent')}</p>
      </LessonSection>

      {/* ── Practical Application ── */}
      <LessonSection number={5} title={t('practicalTitle')}>
        <p style={bf}>{t('practicalContent')}</p>
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
            { href: '/rahu-kaal', label: isHi ? 'राहु काल उपकरण' : 'Rahu Kaal Tool' },
            { href: '/learn/muhurta-selection', label: isHi ? 'मुहूर्त चयन' : 'Muhurta Selection' },
            { href: '/learn/muhurtas', label: isHi ? 'दिन के 30 मुहूर्त' : '30 Muhurtas of the Day' },
            { href: '/learn/hora', label: isHi ? 'होरा' : 'Hora' },
            { href: '/learn/tarabalam', label: isHi ? 'तारा बल' : 'Tara Bala' },
            { href: '/panchang/inauspicious', label: isHi ? 'अशुभ समय' : 'Inauspicious Timings' },
            { href: '/choghadiya', label: isHi ? 'चौघड़िया' : 'Choghadiya' },
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
