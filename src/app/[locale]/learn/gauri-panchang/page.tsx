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
import LJ from '@/messages/learn/gauri-panchang.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Clock, Sun, Star, TrendingUp, ShieldAlert, ArrowRightLeft } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// 8 Gauri periods with attributes for the comparison table.
// Each row carries an English name, Hindi rendering, Tamil rendering,
// quality summary, and a Tailwind class set for nature-based coloring.
const GAURI_TYPES = [
  { name: 'Amritha', hi: 'अमृत',  ta: 'அமிர்தம்', quality: 'Most Auspicious — nectar',       cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Siddha',  hi: 'सिद्ध',  ta: 'சித்தம்',  quality: 'Auspicious — achievement',         cls: 'text-emerald-400/80 bg-emerald-500/8 border-emerald-500/15' },
  { name: 'Marana',  hi: 'मरण',   ta: 'மரணம்',   quality: 'Inauspicious — death',             cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { name: 'Rogam',   hi: 'रोग',   ta: 'ரோகம்',   quality: 'Inauspicious — disease',           cls: 'text-red-400/80 bg-red-500/8 border-red-500/15' },
  { name: 'Laabha',  hi: 'लाभ',   ta: 'லாபம்',   quality: 'Auspicious — gain',                cls: 'text-gold-light bg-gold-primary/10 border-gold-primary/20' },
  { name: 'Dhanam',  hi: 'धन',    ta: 'தனம்',    quality: 'Auspicious — wealth',              cls: 'text-gold-light/90 bg-gold-primary/8 border-gold-primary/15' },
  { name: 'Sugam',   hi: 'सुगम',  ta: 'சுகம்',   quality: 'Auspicious — comfort',             cls: 'text-emerald-400/70 bg-emerald-500/7 border-emerald-500/12' },
  { name: 'Sokam',   hi: 'शोक',   ta: 'சோகம்',   quality: 'Inauspicious — sorrow',            cls: 'text-red-400/70 bg-red-500/8 border-red-500/15' },
];

// Weekday → first day-Gauri period (matches GAURI_DAY_START_BY_WEEKDAY
// in src/lib/constants/gauri-panchang.ts — keep in sync if updated).
const WEEKDAY_STARTS = [
  { day: 'Sunday',    hi: 'रविवार',  ta: 'ஞாயிறு',  starts: 'Sokam',   hi_starts: 'शोक',  ta_starts: 'சோகம்' },
  { day: 'Monday',    hi: 'सोमवार',  ta: 'திங்கள்', starts: 'Amritha', hi_starts: 'अमृत', ta_starts: 'அமிர்தம்' },
  { day: 'Tuesday',   hi: 'मंगलवार', ta: 'செவ்வாய்', starts: 'Marana',  hi_starts: 'मरण',  ta_starts: 'மரணம்' },
  { day: 'Wednesday', hi: 'बुधवार',  ta: 'புதன்',   starts: 'Laabha',  hi_starts: 'लाभ',  ta_starts: 'லாபம்' },
  { day: 'Thursday',  hi: 'गुरुवार', ta: 'வியாழன்', starts: 'Sugam',   hi_starts: 'सुगम', ta_starts: 'சுகம்' },
  { day: 'Friday',    hi: 'शुक्रवार', ta: 'வெள்ளி',  starts: 'Siddha',  hi_starts: 'सिद्ध', ta_starts: 'சித்தம்' },
  { day: 'Saturday',  hi: 'शनिवार',  ta: 'சனி',    starts: 'Rogam',   hi_starts: 'रोग',  ta_starts: 'ரோகம்' },
];

export default function LearnGauriPanchangPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const isTa = locale === 'ta';
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};

  const nameFor = (entry: typeof GAURI_TYPES[number]) => isTa ? entry.ta : isHi ? entry.hi : entry.name;
  const startsFor = (entry: typeof WEEKDAY_STARTS[number]) => isTa ? entry.ta_starts : isHi ? entry.hi_starts : entry.starts;
  const dayFor = (entry: typeof WEEKDAY_STARTS[number]) => isTa ? entry.ta : isHi ? entry.hi : entry.day;

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
        'Gauri Panchang divides each day and night into 8 periods (~90 min each) — five auspicious (Amritha, Siddha, Laabha, Dhanam, Sugam) and three inauspicious (Marana, Rogam, Sokam).',
        'Each weekday starts at a different period — Monday begins with Amritha (Soma=Moon=nectar), Tuesday with Marana, Wednesday with Laabha, and so on.',
        'Even an Amritha Gauri overlapping with Rahu Kaalam, Yamagandam, or Gulika Kaalam should be treated with caution — the inauspicious overlay takes precedence.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Gauri Panchang" explanation="The South-Indian counterpart of Choghadiya — 8 auspicious/inauspicious time periods per day and night" />
        <BeginnerNote term="Nalla Neram" explanation="Tamil for 'good time' — collectively refers to the auspicious Gauri periods (Amritha, Siddha, Laabha, Dhanam, Sugam)" />
        <BeginnerNote term="Choghadiya" explanation="The North/West-Indian equivalent — same algorithmic structure but with different period names" />
      </div>

      {/* Intro */}
      <LessonSection title={isTa ? 'கௌரி பஞ்சாங்கம் என்றால் என்ன?' : isHi ? 'गौरी पंचांग क्या है?' : 'What is Gauri Panchang?'}>
        <p style={bf}>{t('intro')}</p>
      </LessonSection>

      {/* 8 Types */}
      <LessonSection number={1} title={t('eightTypesTitle')} variant="highlight">
        <p style={bf}>{t('eightTypesContent')}</p>
        <div className="mt-4 space-y-2">
          {GAURI_TYPES.map(g => (
            <div key={g.name} className={`flex items-center gap-3 p-3 rounded-xl border ${g.cls}`}>
              <div className="w-24">
                <span className="text-sm font-bold">{nameFor(g)}</span>
              </div>
              <div className="flex-1 text-xs opacity-80">{g.quality}</div>
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
                <th className="py-2 text-left">{isTa ? 'நாள்' : isHi ? 'वार' : 'Day'}</th>
                <th className="py-2 text-left">{isTa ? 'முதல் கௌரி' : isHi ? 'पहला गौरी' : 'First Gauri'}</th>
              </tr>
            </thead>
            <tbody>
              {WEEKDAY_STARTS.map(w => (
                <tr key={w.day} className="border-b border-white/5">
                  <td className="py-2 text-text-primary">{dayFor(w)}</td>
                  <td className="py-2 text-gold-light font-semibold">{startsFor(w)}</td>
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
            { activity: isTa ? 'வியாபாரம் / நிதி' : isHi ? 'व्यापार / वित्त' : 'Business / Finance', best: isTa ? 'லாபம், தனம்' : isHi ? 'लाभ, धन' : 'Laabha, Dhanam', icon: TrendingUp },
            { activity: isTa ? 'பயணம்' : isHi ? 'यात्रा' : 'Travel', best: isTa ? 'சுகம், அமிர்தம்' : isHi ? 'सुगम, अमृत' : 'Sugam, Amritha', icon: ArrowRightLeft },
            { activity: isTa ? 'புதிய காரியம்' : isHi ? 'नया उपक्रम' : 'New Venture', best: isTa ? 'அமிர்தம், சித்தம்' : isHi ? 'अमृत, सिद्ध' : 'Amritha, Siddha', icon: Star },
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
            {isTa
              ? 'ராகு காலம், யமகண்டம், அல்லது குலிக காலத்தில் அமிர்த கௌரி வந்தாலும் கவனமாக இருக்கவும் — அசுப ஆச்சாதனம் முதன்மை பெறுகிறது.'
              : isHi
                ? 'राहु काल, यमगण्ड, या गुलिक काल में अमृत गौरी हो तो भी सावधानी बरतें — अशुभ आवरण प्राथमिकता पर है।'
                : 'Even an Amritha Gauri during Rahu Kaalam, Yamagandam, or Gulika Kaalam should be treated with caution — the inauspicious overlay takes precedence.'}
          </p>
        </div>
      </LessonSection>

      {/* Choghadiya Comparison */}
      <LessonSection number={4} title={t('choghadiyaComparisonTitle')}>
        <p style={bf}>{t('choghadiyaComparisonContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sun size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isTa ? 'கௌரி பஞ்சாங்கம்' : isHi ? 'गौरी पंचांग' : 'Gauri Panchang'}</span>
            </div>
            <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
              <li>{isTa ? '8 வேறுபட்ட காலப் பெயர்கள்' : isHi ? '8 भिन्न काल-नाम' : '8 distinct period names'}</li>
              <li>{isTa ? 'நடுநிலை வகை இல்லை' : isHi ? 'कोई तटस्थ श्रेणी नहीं' : 'No neutral tier'}</li>
              <li>{isTa ? 'தென்னிந்தியாவில் பாரம்பரியம்' : isHi ? 'दक्षिण भारत में पारम्परिक' : 'Traditional in South India'}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isTa ? 'சௌகாடியா' : isHi ? 'चौघड़िया' : 'Choghadiya'}</span>
            </div>
            <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
              <li>{isTa ? '7 காலப் பெயர்கள் (சார் மீள்கிறது)' : isHi ? '7 काल-नाम (चर पुनरावृत्ति)' : '7 period names (Char repeats)'}</li>
              <li>{isTa ? 'நடுநிலை வகை உள்ளது' : isHi ? 'तटस्थ श्रेणी है' : 'Has a neutral tier'}</li>
              <li>{isTa ? 'குஜராத், ராஜஸ்தான், மத்திய இந்தியா' : isHi ? 'गुजरात, राजस्थान, मध्य भारत' : 'Gujarat, Rajasthan, central India'}</li>
            </ul>
          </div>
        </div>
        <ClassicalReference shortName="Gowri Panchangam (Tamil)" author="Various traditional sources" chapter="Sri Vakratunda style tables" />
      </LessonSection>

      {/* Source */}
      <WhyItMatters locale={locale}>{t('sourceDisclaimer')}</WhyItMatters>

      {/* Explore Further */}
      <div className="mt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isTa ? 'மேலும் ஆராய' : isHi ? 'और जानें' : 'Explore Further'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/gauri-panchang', label: isTa ? "இன்றைய கௌரி பஞ்சாங்கம்" : isHi ? 'आज का गौरी पंचांग' : "Today's Gauri Panchang" },
            { href: '/learn/choghadiya', label: isTa ? 'சௌகாடியா' : isHi ? 'चौघड़िया' : 'Choghadiya' },
            { href: '/choghadiya', label: isTa ? 'சௌகாடியா இன்று' : isHi ? 'चौघड़िया कैलकुलेटर' : 'Choghadiya Today' },
            { href: '/learn/muhurtas', label: isTa ? '30 முகூர்த்தங்கள்' : isHi ? '30 मुहूर्त' : '30 Muhurtas' },
            { href: '/hora', label: isTa ? 'ஹோரை கணிப்பான்' : isHi ? 'होरा कैलकुलेटर' : 'Hora Calculator' },
            { href: '/rahu-kaal', label: isTa ? 'ராகு காலம்' : isHi ? 'राहु काल' : 'Rahu Kaal' },
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
