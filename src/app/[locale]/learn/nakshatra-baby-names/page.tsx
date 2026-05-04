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
import LJ from '@/messages/learn/nakshatra-baby-names.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { NAKSHATRA_SYLLABLES } from '@/lib/constants/nakshatra-syllables';
import { Baby, Moon, Star, BookOpen } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ── Nakshatra names (inline to avoid pulling full constant with all locales) ──

const NAKSHATRA_NAMES: { id: number; en: string; hi: string }[] = [
  { id: 1, en: 'Ashwini', hi: 'अश्विनी' },
  { id: 2, en: 'Bharani', hi: 'भरणी' },
  { id: 3, en: 'Krittika', hi: 'कृत्तिका' },
  { id: 4, en: 'Rohini', hi: 'रोहिणी' },
  { id: 5, en: 'Mrigashira', hi: 'मृगशिरा' },
  { id: 6, en: 'Ardra', hi: 'आर्द्रा' },
  { id: 7, en: 'Punarvasu', hi: 'पुनर्वसु' },
  { id: 8, en: 'Pushya', hi: 'पुष्य' },
  { id: 9, en: 'Ashlesha', hi: 'आश्लेषा' },
  { id: 10, en: 'Magha', hi: 'मघा' },
  { id: 11, en: 'Purva Phalguni', hi: 'पूर्व फाल्गुनी' },
  { id: 12, en: 'Uttara Phalguni', hi: 'उत्तर फाल्गुनी' },
  { id: 13, en: 'Hasta', hi: 'हस्त' },
  { id: 14, en: 'Chitra', hi: 'चित्रा' },
  { id: 15, en: 'Swati', hi: 'स्वाति' },
  { id: 16, en: 'Vishakha', hi: 'विशाखा' },
  { id: 17, en: 'Anuradha', hi: 'अनुराधा' },
  { id: 18, en: 'Jyeshtha', hi: 'ज्येष्ठा' },
  { id: 19, en: 'Mula', hi: 'मूल' },
  { id: 20, en: 'Purva Ashadha', hi: 'पूर्वाषाढ़ा' },
  { id: 21, en: 'Uttara Ashadha', hi: 'उत्तराषाढ़ा' },
  { id: 22, en: 'Shravana', hi: 'श्रवण' },
  { id: 23, en: 'Dhanishtha', hi: 'धनिष्ठा' },
  { id: 24, en: 'Shatabhisha', hi: 'शतभिषा' },
  { id: 25, en: 'Purva Bhadrapada', hi: 'पूर्व भाद्रपद' },
  { id: 26, en: 'Uttara Bhadrapada', hi: 'उत्तर भाद्रपद' },
  { id: 27, en: 'Revati', hi: 'रेवती' },
];

export default function LearnNakshatraBabyNamesPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};

  // Resolve syllable display based on locale
  const syllableKey = (locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai')
    ? 'hi'
    : (locale === 'ta') ? 'ta'
    : (locale === 'bn') ? 'bn'
    : 'en';

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
        'Each Nakshatra Pada has a prescribed starting syllable for the baby\'s name — 108 syllables total (27 Nakshatras x 4 Padas).',
        'The Moon\'s Nakshatra at the exact moment of birth determines the syllable — not the Sun sign or Lagna.',
        'The Namakarana ceremony is traditionally performed on the 11th or 12th day after birth.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Nakshatra" explanation="One of 27 lunar mansions — the Moon spends roughly one day in each Nakshatra" />
        <BeginnerNote term="Pada" explanation="Each Nakshatra is divided into 4 quarters (padas) of 3°20' each" />
        <BeginnerNote term="Namakarana" explanation="The Hindu naming ceremony — one of the 16 Samskaras (life sacraments)" />
      </div>

      {/* ── Introduction ── */}
      <LessonSection title={isHi ? 'वैदिक नामकरण परम्परा' : 'The Vedic Naming Tradition'}>
        <p style={bf}>{t('intro')}</p>
      </LessonSection>

      {/* ── Syllable System ── */}
      <LessonSection number={1} title={t('syllableTitle')}>
        <p style={bf}>{t('syllableContent')}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
            <Star size={18} className="text-gold-primary" />
            <span className="text-gold-light text-lg font-bold">27</span>
            <span className="text-text-secondary text-xs">{isHi ? 'नक्षत्र' : 'Nakshatras'}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
            <Moon size={18} className="text-gold-primary" />
            <span className="text-gold-light text-lg font-bold">4</span>
            <span className="text-text-secondary text-xs">{isHi ? 'पद प्रत्येक' : 'Padas each'}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
            <Baby size={18} className="text-gold-primary" />
            <span className="text-gold-light text-lg font-bold">108</span>
            <span className="text-text-secondary text-xs">{isHi ? 'कुल अक्षर' : 'Total syllables'}</span>
          </div>
        </div>
      </LessonSection>

      {/* ── Complete Syllable Table ── */}
      <LessonSection number={2} title={t('tableTitle')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/10">
                <th className="py-2 text-left">#</th>
                <th className="py-2 text-left">{isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                <th className="py-2 text-center">{isHi ? 'पद 1' : 'Pada 1'}</th>
                <th className="py-2 text-center">{isHi ? 'पद 2' : 'Pada 2'}</th>
                <th className="py-2 text-center">{isHi ? 'पद 3' : 'Pada 3'}</th>
                <th className="py-2 text-center">{isHi ? 'पद 4' : 'Pada 4'}</th>
              </tr>
            </thead>
            <tbody>
              {NAKSHATRA_NAMES.map(n => {
                const syllables = NAKSHATRA_SYLLABLES[n.id];
                if (!syllables) return null;
                return (
                  <tr key={n.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-1.5 text-text-secondary text-xs">{n.id}</td>
                    <td className="py-1.5 text-text-primary text-xs">
                      {isHi ? n.hi : n.en}
                    </td>
                    {syllables.map((s, i) => (
                      <td key={i} className="py-1.5 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-gold-primary/10 text-gold-light text-xs font-semibold">
                          {(s as Record<string, string>)[syllableKey] || s.en}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ClassicalReference
          shortName="Muhurta Chintamani"
          chapter="Namakarana Prakarana (Naming chapter)"
        />
      </LessonSection>

      {/* ── Namakarana Ceremony ── */}
      <LessonSection number={3} title={t('namakaranaTitle')}>
        <p style={bf}>{t('namakaranaContent')}</p>
        <div className="mt-4 space-y-2">
          {[
            { num: '1', text: isHi ? 'जन्म के 11वें या 12वें दिन (या शुभ नक्षत्र दिवस पर)' : 'Performed on the 11th or 12th day after birth (or an auspicious Nakshatra day)' },
            { num: '2', text: isHi ? 'पुरोहित जन्म नक्षत्र और पद की गणना करते हैं' : 'Priest calculates the birth Nakshatra and Pada' },
            { num: '3', text: isHi ? 'निर्धारित अक्षर की घोषणा होती है' : 'The prescribed syllables are announced' },
            { num: '4', text: isHi ? 'परिवार इन अक्षरों से प्रारम्भ होने वाला नाम चुनता है' : 'Family chooses a name beginning with one of these syllables' },
          ].map(item => (
            <div key={item.num} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                {item.num}
              </span>
              <p className="text-sm text-text-primary">{item.text}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Moon vs Lagna Nakshatra ── */}
      <LessonSection number={4} title={t('moonVsLagnaTitle')}>
        <p style={bf}>{t('moonVsLagnaContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Moon size={16} className="text-emerald-400" />
              <h4 className="text-emerald-400 font-semibold text-sm">{isHi ? 'चन्द्र नक्षत्र (प्राथमिक)' : 'Moon Nakshatra (Primary)'}</h4>
            </div>
            <p className="text-text-secondary text-xs">
              {isHi ? 'सर्वाधिक प्रचलित। भारत भर में मुख्य परम्परा।' : 'Most common practice across India. The standard tradition.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-gold-primary" />
              <h4 className="text-gold-primary font-semibold text-sm">{isHi ? 'लग्न नक्षत्र (वैकल्पिक)' : 'Lagna Nakshatra (Alternative)'}</h4>
            </div>
            <p className="text-text-secondary text-xs">
              {isHi ? 'कुछ परिवारों में। गण्डान्त चन्द्र होने पर प्राथमिकता।' : 'Used by some families. Preferred when Moon is in Gandanta.'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Modern Considerations ── */}
      <LessonSection number={5} title={t('modernTitle')}>
        <p style={bf}>{t('modernContent')}</p>
        <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-gold-primary" />
            <h4 className="text-gold-light font-semibold text-sm">{isHi ? 'उदाहरण' : 'Example'}</h4>
          </div>
          <p className="text-text-secondary text-sm">
            {isHi
              ? 'रोहिणी पद 2 (अक्षर: वा) → वान्या, वरुण, वसुन्धरा, वनिता — आधुनिक नाम जो परम्परागत अक्षर से प्रारम्भ होते हैं।'
              : 'Rohini Pada 2 (syllable: Va) → Vanya, Varun, Vasundhara, Vanita — modern names that honour the traditional syllable.'}
          </p>
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
            { href: '/baby-names', label: isHi ? 'शिशु नाम खोजक' : 'Baby Names Finder' },
            { href: '/learn/nakshatras', label: isHi ? 'नक्षत्र' : 'Nakshatras' },
            { href: '/learn/nakshatra-pada', label: isHi ? 'नक्षत्र पद' : 'Nakshatra Pada' },
            { href: '/sign-calculator', label: isHi ? 'राशि गणक' : 'Sign Calculator' },
            { href: '/learn/kundali', label: isHi ? 'कुण्डली पठन' : 'Reading a Kundali' },
            { href: '/kundali', label: isHi ? 'कुण्डली बनाएं' : 'Generate Kundali' },
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
