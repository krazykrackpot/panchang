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
import LJ from '@/messages/learn/muhurta-selection.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { BookOpen, ShieldAlert, Star, Crown, Flame, Ban, Sun, Moon } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ── Nakshatra data tables ──────────────────────────────────────────────────

const AUSPICIOUS_NAKSHATRAS = [
  { id: 4, en: 'Rohini', hi: 'रोहिणी' },
  { id: 5, en: 'Mrigashira', hi: 'मृगशिरा' },
  { id: 7, en: 'Punarvasu', hi: 'पुनर्वसु' },
  { id: 8, en: 'Pushya', hi: 'पुष्य' },
  { id: 12, en: 'Uttara Phalguni', hi: 'उत्तर फाल्गुनी' },
  { id: 13, en: 'Hasta', hi: 'हस्त' },
  { id: 14, en: 'Chitra', hi: 'चित्रा' },
  { id: 15, en: 'Swati', hi: 'स्वाति' },
  { id: 17, en: 'Anuradha', hi: 'अनुराधा' },
  { id: 21, en: 'Uttara Ashadha', hi: 'उत्तराषाढ़ा' },
  { id: 22, en: 'Shravana', hi: 'श्रवण' },
  { id: 26, en: 'Uttara Bhadrapada', hi: 'उत्तर भाद्रपद' },
  { id: 27, en: 'Revati', hi: 'रेवती' },
];

const FORBIDDEN_NAKSHATRAS = [
  { id: 1, en: 'Ashwini', hi: 'अश्विनी' },
  { id: 6, en: 'Ardra', hi: 'आर्द्रा' },
  { id: 9, en: 'Ashlesha', hi: 'आश्लेषा' },
  { id: 16, en: 'Vishakha', hi: 'विशाखा' },
  { id: 18, en: 'Jyeshtha', hi: 'ज्येष्ठा' },
  { id: 19, en: 'Mula', hi: 'मूल' },
  { id: 20, en: 'Purva Ashadha', hi: 'पूर्वाषाढ़ा' },
  { id: 24, en: 'Shatabhisha', hi: 'शतभिषा' },
  { id: 25, en: 'Purva Bhadrapada', hi: 'पूर्व भाद्रपद' },
];

const LAGNA_TABLE = [
  { rashi: 'Mithuna / Gemini', hi: 'मिथुन', score: 'Best', cls: 'text-emerald-400' },
  { rashi: 'Kanya / Virgo', hi: 'कन्या', score: 'Best', cls: 'text-emerald-400' },
  { rashi: 'Tula / Libra', hi: 'तुला', score: 'Best', cls: 'text-emerald-400' },
  { rashi: 'Vrishabha / Taurus', hi: 'वृषभ', score: 'Good', cls: 'text-emerald-400/70' },
  { rashi: 'Karka / Cancer', hi: 'कर्क', score: 'Good', cls: 'text-emerald-400/70' },
  { rashi: 'Dhanu / Sagittarius', hi: 'धनु', score: 'Good', cls: 'text-emerald-400/70' },
  { rashi: 'Meena / Pisces', hi: 'मीन', score: 'Good', cls: 'text-emerald-400/70' },
  { rashi: 'Simha / Leo', hi: 'सिंह', score: 'Neutral', cls: 'text-gold-primary/70' },
  { rashi: 'Makara / Capricorn', hi: 'मकर', score: 'Neutral', cls: 'text-gold-primary/70' },
  { rashi: 'Kumbha / Aquarius', hi: 'कुम्भ', score: 'Neutral', cls: 'text-gold-primary/70' },
  { rashi: 'Mesha / Aries', hi: 'मेष', score: 'Avoid', cls: 'text-red-400/70' },
  { rashi: 'Vrischika / Scorpio', hi: 'वृश्चिक', score: 'Avoid', cls: 'text-red-400/70' },
];

const INAUSPICIOUS_YOGAS = [
  { name: 'Vishkambha', hi: 'विष्कम्भ', num: 1 },
  { name: 'Atiganda', hi: 'अतिगण्ड', num: 6 },
  { name: 'Shula', hi: 'शूल', num: 9 },
  { name: 'Ganda', hi: 'गण्ड', num: 10 },
  { name: 'Vyaghata', hi: 'व्याघात', num: 13 },
  { name: 'Vajra', hi: 'वज्र', num: 15 },
  { name: 'Vyatipata', hi: 'व्यतीपात', num: 17 },
  { name: 'Parigha', hi: 'परिघ', num: 19 },
  { name: 'Vaidhriti', hi: 'वैधृति', num: 27 },
];

export default function LearnMuhurtaSelectionPage() {
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
        'The nakshatra (Moon\'s constellation) is the primary factor — more important than tithi, weekday, or yoga.',
        'Venus or Jupiter combustion is an absolute prohibition for marriage — no amount of good panchanga can override it.',
        'The lagna (ascendant) is the most powerful corrective factor — Muhurta Chintamani says it can remove all other defects.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Panchanga Shuddhi" explanation="When all five panchang elements (Tithi, Nakshatra, Yoga, Karana, Vara) are favourable — the gold standard for muhurta" />
        <BeginnerNote term="Lagna" explanation="The zodiac sign rising on the eastern horizon at a specific time and place — changes every ~2 hours" />
        <BeginnerNote term="Combustion (Asta)" explanation="When a planet is too close to the Sun to be visible — its beneficent influence is considered nullified" />
        <BeginnerNote term="Rikta Tithi" explanation="The 4th, 9th, and 14th tithis — considered 'empty' and forbidden for auspicious activities" />
      </div>

      {/* ── Introduction ── */}
      <LessonSection title={isHi ? 'मुहूर्त शास्त्र क्या है?' : 'What is Muhurta Shastra?'}>
        <p style={bf}>{t('intro')}</p>
      </LessonSection>

      {/* ── Panchanga Shuddhi ── */}
      <LessonSection number={1} title={t('panchangShuddhi')}>
        <p style={bf}>{t('panchangContent')}</p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {[
            { label: isHi ? 'नक्षत्र' : 'Nakshatra', priority: 'Primary', icon: Star },
            { label: isHi ? 'तिथि' : 'Tithi', priority: 'Secondary', icon: Moon },
            { label: isHi ? 'योग' : 'Yoga', priority: 'Tertiary', icon: Sun },
            { label: isHi ? 'करण' : 'Karana', priority: 'Supporting', icon: BookOpen },
            { label: isHi ? 'वार' : 'Vara', priority: 'Supporting', icon: BookOpen },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
              <item.icon size={18} className="text-gold-primary" />
              <span className="text-text-primary text-sm font-medium">{item.label}</span>
              <span className="text-text-secondary text-xs">{item.priority}</span>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Combustion (Hard Veto) ── */}
      <LessonSection number={2} title={t('combustionTitle')} variant="highlight">
        <div className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <ShieldAlert size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-300 text-sm font-medium">
            {isHi
              ? 'यह सबसे कठोर निषेध है। शुक्र या गुरु अस्त हो तो कोई भी शुभ नक्षत्र या लग्न इसे नहीं सुधार सकता।'
              : 'This is the strongest prohibition. No favourable nakshatra or lagna can override Venus or Jupiter combustion.'}
          </p>
        </div>
        <p style={bf}>{t('combustionContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={16} className="text-amber-400" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'शुक्र अस्त' : 'Venus Combustion'}</span>
            </div>
            <p className="text-text-secondary text-xs">
              {isHi ? 'सूर्य से 10° के भीतर (वक्री में 8°)। वर्ष में ~2 बार, प्रत्येक 1-2 मास।' : 'Within 10° of Sun (8° if retrograde). ~2x per year, each lasting 1-2 months.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={16} className="text-amber-400" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'गुरु अस्त' : 'Jupiter Combustion'}</span>
            </div>
            <p className="text-text-secondary text-xs">
              {isHi ? 'सूर्य से 11° के भीतर। वर्ष में ~1 बार।' : 'Within 11° of Sun. ~1x per year.'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Nakshatra ── */}
      <LessonSection number={3} title={t('nakshatraTitle')}>
        <p style={bf}>{t('nakshatraContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Star size={12} /> {isHi ? 'शुभ नक्षत्र (13)' : 'Auspicious (13)'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {AUSPICIOUS_NAKSHATRAS.map(n => (
                <span key={n.id} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                  {isHi ? n.hi : n.en}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Ban size={12} /> {isHi ? 'वर्जित नक्षत्र (9)' : 'Forbidden (9)'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {FORBIDDEN_NAKSHATRAS.map(n => (
                <span key={n.id} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                  {isHi ? n.hi : n.en}
                </span>
              ))}
            </div>
          </div>
        </div>
        <ClassicalReference
          shortName="Muhurta Chintamani"
          author="Daivagna Acharya Shri Ram"
          chapter="Ch. 6 (Vivah Prakarana) + Jyotirnibandha (pada exceptions)"
        />
      </LessonSection>

      {/* ── Lagna ── */}
      <LessonSection number={4} title={t('lagnaTitle')} variant="highlight">
        <div className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
          <Crown size={20} className="text-gold-primary mt-0.5 flex-shrink-0" />
          <p className="text-gold-light text-sm font-medium italic" style={bf}>
            {isHi
              ? '"जहाँ अन्य अनुकूल स्थितियाँ नहीं भी हों, वहाँ भी उचित रूप से चुना गया लग्न मुहूर्त के अन्य अंगों द्वारा उत्पन्न दोषों का निवारण करेगा।"'
              : '"Even where other favourable conditions are not present, a properly chosen lagna will remove the defects created by other components of muhurta."'}
          </p>
        </div>
        <p style={bf}>{t('lagnaContent')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/10">
                <th className="py-2 text-left">{isHi ? 'राशि' : 'Rashi'}</th>
                <th className="py-2 text-left">{isHi ? 'गुणवत्ता' : 'Suitability'}</th>
              </tr>
            </thead>
            <tbody>
              {LAGNA_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2 text-text-primary">{isHi ? row.hi : row.rashi}</td>
                  <td className={`py-2 font-semibold ${row.cls}`}>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ClassicalReference
          shortName="Muhurta Chintamani + Raman"
          author="Daivagna Shri Ram / B.V. Raman"
          chapter="MC Ch. 6 + Muhurtha Ch. 12-13"
        />
      </LessonSection>

      {/* ── Tithi ── */}
      <LessonSection number={5} title={t('tithiTitle')}>
        <p style={bf}>{t('tithiContent')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { t: '2nd', hi: 'द्वितीया', ok: true }, { t: '3rd', hi: 'तृतीया', ok: true },
            { t: '5th', hi: 'पञ्चमी', ok: true }, { t: '7th', hi: 'सप्तमी', ok: true },
            { t: '10th', hi: 'दशमी', ok: true }, { t: '11th', hi: 'एकादशी', ok: true },
            { t: '13th', hi: 'त्रयोदशी', ok: true },
            { t: '4th', hi: 'चतुर्थी', ok: false }, { t: '9th', hi: 'नवमी', ok: false },
            { t: '14th', hi: 'चतुर्दशी', ok: false },
          ].map((item, i) => (
            <span key={i} className={`px-2.5 py-1 rounded-lg text-xs border ${
              item.ok
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-red-500/10 border-red-500/20 text-red-300 line-through'
            }`}>
              {isHi ? item.hi : item.t}
            </span>
          ))}
        </div>
      </LessonSection>

      {/* ── Paksha ── */}
      <LessonSection number={6} title={t('pakshaTitle')}>
        <p style={bf}>{t('pakshaContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <h4 className="text-emerald-400 font-semibold text-sm mb-1">{isHi ? 'शुक्ल पक्ष (बढ़ता चन्द्र)' : 'Shukla Paksha (Waxing Moon)'}</h4>
            <p className="text-text-secondary text-xs">{isHi ? 'सार्वभौमिक रूप से वरीय। नए आरम्भों में वृद्धि का प्रतीक।' : 'Universally preferred. Symbolises growth for new beginnings.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
            <h4 className="text-gold-primary font-semibold text-sm mb-1">{isHi ? 'कृष्ण पक्ष (घटता चन्द्र)' : 'Krishna Paksha (Waning Moon)'}</h4>
            <p className="text-text-secondary text-xs">{isHi ? 'किसी ग्रन्थ में वर्जित नहीं। उत्तम नक्षत्र + शुभ लग्न हो तो अनुमत।' : 'Not forbidden by any text. Permitted when nakshatra is excellent + lagna is favourable.'}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── Yogas ── */}
      <LessonSection number={7} title={t('yogaTitle')}>
        <p style={bf}>{t('yogaContent')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {INAUSPICIOUS_YOGAS.map(y => (
            <span key={y.num} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
              {isHi ? y.hi : y.name} <span className="text-red-400/50">#{y.num}</span>
            </span>
          ))}
        </div>
        <ClassicalReference
          shortName="Muhurta Chintamani"
          author="Daivagna Acharya Shri Ram"
          chapter="Ch. 6 — with Visha Ghati nuance"
        />
      </LessonSection>

      {/* ── Vara ── */}
      <LessonSection number={8} title={t('varaTitle')}>
        <p style={bf}>{t('varaContent')}</p>
      </LessonSection>

      {/* ── Karana ── */}
      <LessonSection number={9} title={t('karanaTitle')}>
        <p style={bf}>{t('karanaContent')}</p>
      </LessonSection>

      {/* ── Godhuli Lagna ── */}
      <LessonSection title={isHi ? 'गोधूलि लग्न: सर्वोत्कृष्ट काल' : 'Godhuli Lagna: The Supreme Override'} variant="highlight">
        <p style={bf}>{t('godhuli')}</p>
        <ClassicalReference
          shortName="Brihat Samhita"
          author="Varahamihira"
          chapter="Ch. 103 (Vivaha Patala)"
        />
      </LessonSection>

      {/* ── Summary ── */}
      <LessonSection title={t('summaryTitle')}>
        <p style={bf}>{t('summaryContent')}</p>
        <div className="mt-4 space-y-2">
          {[
            { num: '1', text: isHi ? 'शुक्र/गुरु अस्त न हों — सर्वोपरि' : 'Venus/Jupiter must not be combust — overrides everything', cls: 'text-red-400' },
            { num: '2', text: isHi ? 'नक्षत्र शुभ हो — प्रमुख पंचांग कारक' : 'Nakshatra must be favourable — primary panchanga filter', cls: 'text-emerald-400' },
            { num: '3', text: isHi ? 'लग्न सुचुना हो — सबसे शक्तिशाली सुधार' : 'Lagna should be well-chosen — most powerful corrective', cls: 'text-gold-primary' },
            { num: '4', text: isHi ? 'तिथि, योग, करण, वार — सहायक गुणवत्ता' : 'Tithi, yoga, karana, vara — supporting quality', cls: 'text-text-secondary' },
            { num: '5', text: isHi ? 'शुक्ल पक्ष वरीय, कृष्ण में उत्तम नक्षत्र/लग्न हो तो अनुमत' : 'Shukla Paksha preferred; Krishna allowed when nakshatra + lagna are strong', cls: 'text-text-secondary' },
          ].map((item) => (
            <div key={item.num} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                {item.num}
              </span>
              <p className={`text-sm ${item.cls}`}>{item.text}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Ayanamsha note ── */}
      <BeginnerNote
        term={isHi ? 'मुहूर्त में अयनांश' : 'Ayanamsha in Muhurta'}
        explanation={isHi
          ? 'इस पृष्ठ पर सभी मुहूर्त नियम और हमारा मुहूर्त AI इंजन लाहिरी (चित्रपक्ष) अयनांश का उपयोग करते हैं — भारत सरकार का मानक, जिस पर मुहूर्त चिन्तामणि और धर्म सिन्धु के मूल नियम आधारित हैं। यदि आपने अपनी कुण्डली के लिए केपी या रमन अयनांश चुना है, तो भी मुहूर्त स्कोरिंग लाहिरी पर ही रहता है ताकि शास्त्रीय नियम सही नक्षत्र सीमाओं पर लागू हों।'
          : 'All muhurta rules on this page and our Muhurta AI engine use Lahiri (Chitrapaksha) ayanamsha — the Indian government standard on which the original rules from Muhurta Chintamani and Dharma Sindhu were composed. Even if you have selected KP or Raman ayanamsha for your birth chart, muhurta scoring remains Lahiri-based so that classical rules are applied against the correct nakshatra boundaries.'}
      />

      {/* ── Source disclaimer ── */}
      <WhyItMatters locale={locale}>{t('sourceDisclaimer')}</WhyItMatters>

      {/* ── Explore Further ── */}
      <div className="mt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'और जानें' : 'Explore Further'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/learn/muhurtas', label: isHi ? 'दिन के 30 मुहूर्त' : '30 Muhurtas of the Day' },
            { href: '/learn/tithis', label: isHi ? 'तिथियाँ' : 'Tithis' },
            { href: '/learn/nakshatras', label: isHi ? 'नक्षत्र' : 'Nakshatras' },
            { href: '/learn/yogas', label: isHi ? 'योग' : 'Yogas' },
            { href: '/learn/karanas', label: isHi ? 'करण' : 'Karanas' },
            { href: '/learn/combustion', label: isHi ? 'अस्त ग्रह' : 'Combustion' },
            { href: '/learn/hora', label: isHi ? 'होरा' : 'Hora' },
            { href: '/muhurat', label: isHi ? 'मुहूर्त खोजक' : 'Muhurat Finder' },
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
