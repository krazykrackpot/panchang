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
import LJ from '@/messages/learn/hindu-calendar.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Calendar, Sun, Moon, Leaf, Snowflake, Droplets, Flame } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ── Data tables ────────────────────────────────────────────────────────

const MONTHS = [
  { en: 'Chaitra', hi: 'चैत्र', greg: 'Mar–Apr', ritu: 'Vasanta' },
  { en: 'Vaishakha', hi: 'वैशाख', greg: 'Apr–May', ritu: 'Vasanta' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ', greg: 'May–Jun', ritu: 'Grishma' },
  { en: 'Ashadha', hi: 'आषाढ़', greg: 'Jun–Jul', ritu: 'Grishma' },
  { en: 'Shravana', hi: 'श्रावण', greg: 'Jul–Aug', ritu: 'Varsha' },
  { en: 'Bhadrapada', hi: 'भाद्रपद', greg: 'Aug–Sep', ritu: 'Varsha' },
  { en: 'Ashwin', hi: 'आश्विन', greg: 'Sep–Oct', ritu: 'Sharad' },
  { en: 'Kartik', hi: 'कार्तिक', greg: 'Oct–Nov', ritu: 'Sharad' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष', greg: 'Nov–Dec', ritu: 'Hemant' },
  { en: 'Pausha', hi: 'पौष', greg: 'Dec–Jan', ritu: 'Hemant' },
  { en: 'Magha', hi: 'माघ', greg: 'Jan–Feb', ritu: 'Shishir' },
  { en: 'Phalguna', hi: 'फाल्गुन', greg: 'Feb–Mar', ritu: 'Shishir' },
];

const RITUS = [
  { en: 'Vasanta', hi: 'वसन्त', meaning: 'Spring', months: 'Chaitra–Vaishakha', icon: Leaf, cls: 'text-emerald-400' },
  { en: 'Grishma', hi: 'ग्रीष्म', meaning: 'Summer', months: 'Jyeshtha–Ashadha', icon: Flame, cls: 'text-amber-400' },
  { en: 'Varsha', hi: 'वर्षा', meaning: 'Monsoon', months: 'Shravana–Bhadrapada', icon: Droplets, cls: 'text-blue-400' },
  { en: 'Sharad', hi: 'शरद', meaning: 'Autumn', months: 'Ashwin–Kartik', icon: Leaf, cls: 'text-orange-400' },
  { en: 'Hemant', hi: 'हेमन्त', meaning: 'Pre-winter', months: 'Margashirsha–Pausha', icon: Snowflake, cls: 'text-cyan-400' },
  { en: 'Shishir', hi: 'शिशिर', meaning: 'Winter', months: 'Magha–Phalguna', icon: Snowflake, cls: 'text-indigo-400' },
];

const ERAS = [
  { name: 'Vikram Samvat', hi: 'विक्रम सम्वत', offset: '+56–57', example: '2083', region: 'North India, Nepal' },
  { name: 'Shaka Samvat', hi: 'शक सम्वत', offset: '−78', example: '1948', region: 'Indian Govt, South India' },
  { name: 'Kali Yuga', hi: 'कलि युग', offset: '+3102', example: '5128', region: 'Scriptural reference' },
  { name: 'Gregorian', hi: 'ग्रेगोरियन', offset: '0', example: '2026', region: 'International standard' },
];

export default function LearnHinduCalendarPage() {
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
        'The Hindu calendar is lunisolar — it tracks both Moon phases and the Sun\'s zodiac position, unlike purely solar or lunar calendars.',
        'Adhika Masa (intercalary month) is inserted every ~32.5 months to keep lunar months aligned with seasons.',
        'Amanta and Purnimanta are two different starting conventions for the same months — they differ by region, not by content.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Lunisolar" explanation="A calendar system that tracks both the Moon's phases (lunar) and the Sun's position (solar)" />
        <BeginnerNote term="Sankranti" explanation="The Sun's transit from one zodiac sign to the next — there are 12 Sankrantis per year" />
        <BeginnerNote term="Paksha" explanation="A lunar fortnight — Shukla (waxing, bright) and Krishna (waning, dark)" />
      </div>

      {/* ── Introduction ── */}
      <LessonSection title={isHi ? 'हिन्दू कैलेंडर क्या है?' : 'What is the Hindu Calendar?'}>
        <p style={bf}>{t('intro')}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: isHi ? 'सौर (ग्रेगोरियन)' : 'Solar (Gregorian)', type: isHi ? 'केवल सूर्य' : 'Sun only', icon: Sun, cls: 'text-amber-400' },
            { label: isHi ? 'चन्द्र (हिजरी)' : 'Lunar (Hijri)', type: isHi ? 'केवल चन्द्र' : 'Moon only', icon: Moon, cls: 'text-blue-400' },
            { label: isHi ? 'चन्द्र-सौर (हिन्दू)' : 'Lunisolar (Hindu)', type: isHi ? 'सूर्य + चन्द्र' : 'Sun + Moon', icon: Calendar, cls: 'text-gold-primary' },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
              <item.icon size={18} className={item.cls} />
              <span className="text-text-primary text-xs font-medium">{item.label}</span>
              <span className="text-text-secondary text-[10px]">{item.type}</span>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Calendar Eras ── */}
      <LessonSection number={1} title={t('erasTitle')}>
        <p style={bf}>{t('erasContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/10">
                <th className="py-2 text-left">{isHi ? 'सम्वत' : 'Era'}</th>
                <th className="py-2 text-left">{isHi ? 'अन्तर' : 'Offset'}</th>
                <th className="py-2 text-left">2026 CE =</th>
                <th className="py-2 text-left">{isHi ? 'क्षेत्र' : 'Region'}</th>
              </tr>
            </thead>
            <tbody>
              {ERAS.map(e => (
                <tr key={e.name} className="border-b border-white/5">
                  <td className="py-2 text-text-primary">{isHi ? e.hi : e.name}</td>
                  <td className="py-2 text-text-secondary font-mono text-xs">{e.offset} yr</td>
                  <td className="py-2 text-gold-light font-semibold">{e.example}</td>
                  <td className="py-2 text-text-secondary text-xs">{e.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ── 12 Months ── */}
      <LessonSection number={2} title={t('monthsTitle')}>
        <p style={bf}>{t('monthsContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/10">
                <th className="py-2 text-left">#</th>
                <th className="py-2 text-left">{isHi ? 'मास' : 'Month'}</th>
                <th className="py-2 text-left">{isHi ? 'ग्रेगोरियन' : 'Gregorian'}</th>
                <th className="py-2 text-left">{isHi ? 'ऋतु' : 'Ritu'}</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((m, i) => (
                <tr key={m.en} className="border-b border-white/5">
                  <td className="py-1.5 text-text-secondary text-xs">{i + 1}</td>
                  <td className="py-1.5 text-text-primary">
                    {isHi ? m.hi : m.en}
                    {!isHi && <span className="text-gold-dark text-xs ml-1">({m.hi})</span>}
                  </td>
                  <td className="py-1.5 text-text-secondary text-xs">{m.greg}</td>
                  <td className="py-1.5 text-text-secondary text-xs">{m.ritu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ── Amanta vs Purnimanta ── */}
      <LessonSection number={3} title={t('amantaTitle')} variant="highlight">
        <p style={bf}>{t('amantaContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <h4 className="text-gold-light font-semibold text-sm mb-1">{isHi ? 'अमान्त (अमावस्या अन्त)' : 'Amanta (New Moon ending)'}</h4>
            <p className="text-text-secondary text-xs">
              {isHi ? 'गुजरात, महाराष्ट्र, दक्षिण भारत, अधिकांश पंचांग।' : 'Gujarat, Maharashtra, South India, most panchang publishers.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <h4 className="text-gold-light font-semibold text-sm mb-1">{isHi ? 'पूर्णिमान्त (पूर्णिमा अन्त)' : 'Purnimanta (Full Moon ending)'}</h4>
            <p className="text-text-secondary text-xs">
              {isHi ? 'उत्तर प्रदेश, मध्य प्रदेश, बिहार, राजस्थान।' : 'Uttar Pradesh, Madhya Pradesh, Bihar, Rajasthan.'}
            </p>
          </div>
        </div>
        <ClassicalReference
          shortName="Bharatiya Jyotish Shastra"
          author="S.B. Dikshit"
          chapter="Amanta/Purnimanta conventions"
        />
      </LessonSection>

      {/* ── 6 Ritus ── */}
      <LessonSection number={4} title={t('seasonsTitle')}>
        <p style={bf}>{t('seasonsContent')}</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {RITUS.map(r => (
            <div key={r.en} className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
              <r.icon size={20} className={r.cls} />
              <span className="text-text-primary text-sm font-semibold">
                {isHi ? r.hi : r.en}
              </span>
              <span className="text-text-secondary text-[10px]">{r.meaning}</span>
              <span className="text-gold-dark text-[10px]">{r.months}</span>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Uttarayana / Dakshinayana ── */}
      <LessonSection number={5} title={t('ayanaTitle')}>
        <p style={bf}>{t('ayanaContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <h4 className="text-emerald-400 font-semibold text-sm mb-1">
              {isHi ? 'उत्तरायण (मकर → कर्क)' : 'Uttarayana (Makara to Karka)'}
            </h4>
            <p className="text-text-secondary text-xs">
              {isHi ? 'जनवरी–जुलाई। शुभ कार्यों के लिए उत्तम।' : 'Jan–Jul. Favoured for auspicious ceremonies.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <h4 className="text-indigo-400 font-semibold text-sm mb-1">
              {isHi ? 'दक्षिणायन (कर्क → मकर)' : 'Dakshinayana (Karka to Makara)'}
            </h4>
            <p className="text-text-secondary text-xs">
              {isHi ? 'जुलाई–जनवरी। तपस्या और साधना काल।' : 'Jul–Jan. Period of austerity and spiritual practice.'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Adhika Masa ── */}
      <LessonSection number={6} title={t('adhikaTitle')}>
        <p style={bf}>{t('adhikaContent')}</p>
        <ClassicalReference
          shortName="Surya Siddhanta"
          chapter="Intercalation rules (Adhika / Kshaya Masa)"
        />
      </LessonSection>

      {/* ── How to read a Panchang ── */}
      <LessonSection number={7} title={t('readingTitle')}>
        <p style={bf}>{t('readingContent')}</p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {[
            { label: isHi ? 'तिथि' : 'Tithi', rate: isHi ? '~2x/दिन' : '~2x/day' },
            { label: isHi ? 'नक्षत्र' : 'Nakshatra', rate: isHi ? '~1x/दिन' : '~1x/day' },
            { label: isHi ? 'योग' : 'Yoga', rate: isHi ? '~1x/दिन' : '~1x/day' },
            { label: isHi ? 'करण' : 'Karana', rate: isHi ? '~2x/दिन' : '~2x/day' },
            { label: isHi ? 'वार' : 'Vara', rate: isHi ? 'सूर्योदय' : 'Sunrise' },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
              <span className="text-text-primary text-sm font-medium">{item.label}</span>
              <span className="text-text-secondary text-[10px]">{item.rate}</span>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Source disclaimer ── */}
      <WhyItMatters locale={locale}>{t('sourceDisclaimer')}</WhyItMatters>

      {/* ── Explore Further ── */}
      <div className="mt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'और जानें' : 'Explore Further'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/calendar', label: isHi ? 'त्योहार कैलेंडर' : 'Festival Calendar' },
            { href: '/panchang', label: isHi ? 'आज का पंचांग' : 'Today\'s Panchang' },
            { href: '/learn/panchang-guide', label: isHi ? 'पंचांग मार्गदर्शिका' : 'Panchang Guide' },
            { href: '/learn/tithis', label: isHi ? 'तिथियाँ' : 'Tithis' },
            { href: '/learn/masa', label: isHi ? 'मास' : 'Masa' },
            { href: '/learn/adhika-masa', label: isHi ? 'अधिक मास' : 'Adhika Masa' },
            { href: '/learn/festival-rules', label: isHi ? 'त्योहार नियम' : 'Festival Rules' },
            { href: '/learn/smarta-vaishnava', label: isHi ? 'स्मार्त बनाम वैष्णव' : 'Smarta vs Vaishnava' },
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
