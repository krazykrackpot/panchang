'use client';


import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/kundali.json';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import HouseHighlightChart from '@/components/learn/HouseHighlightChart';
import ExampleKundaliChart from '@/components/learn/ExampleKundaliChart';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ─── Data for Steps ─── */

// Step 6: Planet positions table for the example
const EXAMPLE_PLANETS = [
  { id: 'Su', name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, tropical: '142.3°', sidereal: '118.5°', rashi: { en: 'Cancer (Karka)', hi: 'कर्क', sa: 'कर्कः' }, nak: { en: 'Ashlesha', hi: 'आश्लेषा', sa: 'आश्लेषा' }, color: '#f59e0b' },
  { id: 'Mo', name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, tropical: '276.8°', sidereal: '253.0°', rashi: { en: 'Sagittarius (Dhanu)', hi: 'धनु', sa: 'धनुः' }, nak: { en: 'P. Ashadha', hi: 'पूर्वाषाढ़ा', sa: 'पूर्वाषाढा' }, color: '#e2e8f0' },
  { id: 'Ma', name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, tropical: '195.1°', sidereal: '171.3°', rashi: { en: 'Virgo (Kanya)', hi: 'कन्या', sa: 'कन्या' }, nak: { en: 'U. Phalguni', hi: 'उत्तर फाल्गुनी', sa: 'उत्तरफाल्गुनी' }, color: '#ef4444' },
  { id: 'Me', name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, tropical: '155.9°', sidereal: '132.1°', rashi: { en: 'Leo (Simha)', hi: 'सिंह', sa: 'सिंहः' }, nak: { en: 'P. Phalguni', hi: 'पूर्व फाल्गुनी', sa: 'पूर्वफाल्गुनी' }, color: '#22c55e' },
  { id: 'Ju', name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, tropical: '240.6°', sidereal: '216.8°', rashi: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक', sa: 'वृश्चिकः' }, nak: { en: 'Vishakha', hi: 'विशाखा', sa: 'विशाखा' }, color: '#f0d48a' },
  { id: 'Ve', name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, tropical: '148.2°', sidereal: '124.4°', rashi: { en: 'Leo (Simha)', hi: 'सिंह', sa: 'सिंहः' }, nak: { en: 'Magha', hi: 'मघा', sa: 'मघा' }, color: '#ec4899' },
  { id: 'Sa', name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, tropical: '336.4°', sidereal: '312.6°', rashi: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ', sa: 'कुम्भः' }, nak: { en: 'Shatabhisha', hi: 'शतभिषा', sa: 'शतभिषा' }, color: '#3b82f6' },
  { id: 'Ra', name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, tropical: '207.5°', sidereal: '183.7°', rashi: { en: 'Libra (Tula)', hi: 'तुला', sa: 'तुला' }, nak: { en: 'Swati', hi: 'स्वाति', sa: 'स्वाती' }, color: '#8b5cf6' },
  { id: 'Ke', name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, tropical: '27.5°', sidereal: '3.7°', rashi: { en: 'Aries (Mesha)', hi: 'मेष', sa: 'मेषः' }, nak: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, color: '#9ca3af' },
];

// Step 7: House mapping for the example (Tula Lagna)
const EXAMPLE_HOUSES = [
  { house: 1, rashi: { en: 'Libra (Tula)', hi: 'तुला', sa: 'तुला' }, planets: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' } },
  { house: 2, rashi: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक', sa: 'वृश्चिकः' }, planets: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' } },
  { house: 3, rashi: { en: 'Sagittarius (Dhanu)', hi: 'धनु', sa: 'धनुः' }, planets: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' } },
  { house: 4, rashi: { en: 'Capricorn (Makara)', hi: 'मकर', sa: 'मकरः' }, planets: { en: '—', hi: '—', sa: '—' } },
  { house: 5, rashi: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ', sa: 'कुम्भः' }, planets: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' } },
  { house: 6, rashi: { en: 'Pisces (Meena)', hi: 'मीन', sa: 'मीनः' }, planets: { en: '—', hi: '—', sa: '—' } },
  { house: 7, rashi: { en: 'Aries (Mesha)', hi: 'मेष', sa: 'मेषः' }, planets: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' } },
  { house: 8, rashi: { en: 'Taurus (Vrishabha)', hi: 'वृषभ', sa: 'वृषभः' }, planets: { en: '—', hi: '—', sa: '—' } },
  { house: 9, rashi: { en: 'Gemini (Mithuna)', hi: 'मिथुन', sa: 'मिथुनम्' }, planets: { en: '—', hi: '—', sa: '—' } },
  { house: 10, rashi: { en: 'Cancer (Karka)', hi: 'कर्क', sa: 'कर्कः' }, planets: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' } },
  { house: 11, rashi: { en: 'Leo (Simha)', hi: 'सिंह', sa: 'सिंहः' }, planets: { en: 'Mercury, Venus', hi: 'बुध, शुक्र', sa: 'बुधः, शुक्रः' } },
  { house: 12, rashi: { en: 'Virgo (Kanya)', hi: 'कन्या', sa: 'कन्या' }, planets: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' } },
];

// Step 9: Dignity examples for the chart
const DIGNITY_EXAMPLES = [
  { planet: { en: 'Jupiter in Scorpio', hi: 'वृश्चिक में गुरु', sa: 'वृश्चिके गुरुः' }, status: { en: 'Neutral (friendly sign)', hi: 'तटस्थ (मित्र राशि)', sa: 'तटस्थः (मित्रराशिः)' }, color: '#f0d48a' },
  { planet: { en: 'Saturn in Aquarius', hi: 'कुम्भ में शनि', sa: 'कुम्भे शनिः' }, status: { en: 'Own Sign (Swa Rashi) — strong', hi: 'स्वराशि — बलवान', sa: 'स्वराशिः — बलवान्' }, color: '#34d399' },
  { planet: { en: 'Mars in Virgo', hi: 'कन्या में मंगल', sa: 'कन्यायां मङ्गलः' }, status: { en: 'Enemy sign — weakened', hi: 'शत्रु राशि — दुर्बल', sa: 'शत्रुराशिः — दुर्बलः' }, color: '#f87171' },
  { planet: { en: 'Sun in Cancer', hi: 'कर्क में सूर्य', sa: 'कर्के सूर्यः' }, status: { en: 'Friendly sign (Moon\'s sign)', hi: 'मित्र राशि (चन्द्र की राशि)', sa: 'मित्रराशिः (चन्द्रस्य राशिः)' }, color: '#fbbf24' },
];

// Cross-link cards
const DEEPER_LINKS = [
  { href: '/learn/bhavas', label: { en: 'The 12 Houses', hi: '12 भाव', sa: 'द्वादशभावाः' }, desc: { en: 'Deep dive into each house\'s significations', hi: 'प्रत्येक भाव के संकेतों में गहराई', sa: 'प्रत्येकभावसङ्केतेषु गहनम्' } },
  { href: '/learn/grahas', label: { en: 'The 9 Grahas', hi: '9 ग्रह', sa: 'नवग्रहाः' }, desc: { en: 'Planets, their natures, and rulerships', hi: 'ग्रह, उनके स्वभाव, और स्वामित्व', sa: 'ग्रहाः, तेषां स्वभावाः, स्वामित्वं च' } },
  { href: '/learn/vargas', label: { en: 'Divisional Charts', hi: 'विभागीय कुण्डलियाँ', sa: 'विभागकुण्डल्यः' }, desc: { en: '16 Shodasvarga charts — D9, D10, and beyond', hi: '16 षोडशवर्ग — D9, D10, और आगे', sa: '16 षोडशवर्गाः — D9, D10, अग्रे च' } },
  { href: '/learn/dashas', label: { en: 'Dashas', hi: 'दशाएँ', sa: 'दशाः' }, desc: { en: 'The Vimshottari planetary period system', hi: 'विंशोत्तरी ग्रह अवधि प्रणाली', sa: 'विंशोत्तरीग्रहकालखण्डपद्धतिः' } },
  { href: '/learn/nakshatras', label: { en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्राणि' }, desc: { en: '27 lunar mansions and their meanings', hi: '27 चान्द्रगृह और उनके अर्थ', sa: '27 चान्द्रगृहाणि तेषाम् अर्थाः च' } },
  { href: '/learn/gochar', label: { en: 'Gochar (Transits)', hi: 'गोचर', sa: 'गोचरः' }, desc: { en: 'Current planet movements and predictions', hi: 'वर्तमान ग्रह गति और भविष्यवाणी', sa: 'वर्तमानग्रहगतिः भविष्यवाणी च' } },
  { href: '/learn/calculations', label: { en: 'The Math', hi: 'गणित', sa: 'गणितम्' }, desc: { en: 'Algorithms behind our calculations', hi: 'हमारी गणनाओं के पीछे के एल्गोरिथ्म', sa: 'अस्माकं गणनानां गणितानि' } },
];

/* ─── Page Component ─── */
export default function LearnKundaliPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      {/* Key Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Kundali" devanagari="कुण्डली" transliteration="Kuṇḍalī" meaning="Birth chart / Horoscope" />
        <SanskritTermCard term="Lagna" devanagari="लग्न" transliteration="Lagna" meaning="Ascendant (Rising Sign)" />
        <SanskritTermCard term="Graha" devanagari="ग्रह" transliteration="Graha" meaning="Planet (that which seizes)" />
        <SanskritTermCard term="Bhava" devanagari="भाव" transliteration="Bhāva" meaning="House (life area)" />
      </div>

      {/* ─── Overview ─── */}
      <LessonSection title={t('overviewTitle')}>
        <p>{t('overviewText')}</p>
      </LessonSection>

      {/* ─── Example Introduction ─── */}
      <LessonSection title={t('exampleTitle')} variant="highlight">
        <p>{t('exampleText')}</p>
        <div className="mt-4 p-5 rounded-xl bg-gold-primary/5 border border-gold-primary/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{tl({ en: 'Date', hi: 'तिथि', sa: 'तिथि', ta: 'Date', te: 'Date', bn: 'Date', kn: 'Date', gu: 'Date', mai: 'तिथि', mr: 'तिथि' }, locale)}</div>
              <div className="text-gold-light font-bold text-lg">15 Aug 1995</div>
            </div>
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{tl({ en: 'Time', hi: 'समय', sa: 'समय', ta: 'Time', te: 'Time', bn: 'Time', kn: 'Time', gu: 'Time', mai: 'समय', mr: 'समय' }, locale)}</div>
              <div className="text-gold-light font-bold text-lg">10:30 AM IST</div>
            </div>
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{tl({ en: 'Place', hi: 'स्थान', sa: 'स्थान', ta: 'Place', te: 'Place', bn: 'Place', kn: 'Place', gu: 'Place', mai: 'स्थान', mr: 'स्थान' }, locale)}</div>
              <div className="text-gold-light font-bold text-lg">{tl({ en: 'New Delhi', hi: 'नई दिल्ली', sa: 'नई दिल्ली', ta: 'New Delhi', te: 'New Delhi', bn: 'New Delhi', kn: 'New Delhi', gu: 'New Delhi', mai: 'नई दिल्ली', mr: 'नई दिल्ली' }, locale)}</div>
            </div>
          </div>
          <div className="text-center mt-3 text-text-secondary/70 font-mono text-xs">
            28.6139°N, 77.2090°E
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 1: Birth Data ─── */}
      <LessonSection number={1} title={t('s1Title')}>
        <p>{t('s1Text')}</p>
        <div className="mt-4 space-y-3">
          {[
            { label: { en: 'Date of Birth', hi: 'जन्म तिथि', sa: 'जन्मतिथिः' }, text: L.s1Date, icon: '1' },
            { label: { en: 'Time of Birth', hi: 'जन्म समय', sa: 'जन्मसमयः' }, text: L.s1Time, icon: '2' },
            { label: { en: 'Place of Birth', hi: 'जन्म स्थान', sa: 'जन्मस्थानम्' }, text: L.s1Place, icon: '3' },
          ].map((item) => (
            <div key={item.icon} className="flex gap-4 p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
              <span className="w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold flex-shrink-0">
                {item.icon}
              </span>
              <div>
                <div className="text-gold-light font-semibold text-sm mb-1">{lt(item.label as LocaleText, locale)}</div>
                <p className="text-text-secondary text-sm">{lt(item.text as LocaleText, locale)}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── STEP 2: Time Conversion ─── */}
      <LessonSection number={2} title={t('s2Title')}>
        <p>{t('s2Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'For our example:', hi: 'हमारे उदाहरण के लिए:', sa: 'हमारे उदाहरण के लिए:', ta: 'For our example:', te: 'For our example:', bn: 'For our example:', kn: 'For our example:', gu: 'For our example:', mai: 'हमारे उदाहरण के लिए:', mr: 'हमारे उदाहरण के लिए:' }, locale)}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">IST = UTC + 5:30</p>
            <p className="text-gold-light/80 font-mono text-xs">10:30 AM IST = 05:00 AM UT</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">Date: 15 Aug 1995, UT 05:00</p>
            <p className="text-gold-light/80 font-mono text-xs">JD = 2449945.708  <span className="text-gold-light/40">// Julian Day Number</span></p>
            <p className="text-gold-light/80 font-mono text-xs">T = -0.0439  <span className="text-gold-light/40">// centuries from J2000.0</span></p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 3: Sidereal Time ─── */}
      <LessonSection number={3} title={t('s3Title')}>
        <p>{t('s3Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'For our example:', hi: 'हमारे उदाहरण के लिए:', sa: 'हमारे उदाहरण के लिए:', ta: 'For our example:', te: 'For our example:', bn: 'For our example:', kn: 'For our example:', gu: 'For our example:', mai: 'हमारे उदाहरण के लिए:', mr: 'हमारे उदाहरण के लिए:' }, locale)}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">GST (Greenwich Sidereal Time) at 0h UT = 21h 33m</p>
            <p className="text-gold-light/80 font-mono text-xs">Correction for 05:00 UT = +5h 01m  <span className="text-gold-light/40">// sidereal day is 3m 56s shorter</span></p>
            <p className="text-gold-light/80 font-mono text-xs">GST at 05:00 UT = 2h 34m</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">LST = GST + Longitude/15</p>
            <p className="text-gold-light/80 font-mono text-xs">LST = 2h 34m + 77.209°/15 = 2h 34m + 5h 09m</p>
            <p className="text-gold-light/80 font-mono text-xs font-bold text-gold-light">LST = 7h 43m  <span className="text-gold-light/40">// = 115.7°</span></p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 4: Lagna ─── */}
      <LessonSection
        number={4}
        title={t('s4Title')}
        illustration={
          <HouseHighlightChart
            highlightHouses={[1]}
            highlightColor="#d4a853"
            size={220}
            showAllNumbers
            label="House 1 (Lagna) highlighted in the North Indian chart"
          />
        }
      >
        <p>{t('s4Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'For our example:', hi: 'हमारे उदाहरण के लिए:', sa: 'हमारे उदाहरण के लिए:', ta: 'For our example:', te: 'For our example:', bn: 'For our example:', kn: 'For our example:', gu: 'For our example:', mai: 'हमारे उदाहरण के लिए:', mr: 'हमारे उदाहरण के लिए:' }, locale)}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">Lagna° = atan2(sin(LST), cos(LST)·cos(ε) - tan(φ)·sin(ε))</p>
            <p className="text-gold-light/80 font-mono text-xs">where ε = 23.44° (obliquity), φ = 28.61° (Delhi latitude)</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">Tropical Lagna ≈ 207.5°  <span className="text-gold-light/40">// Scorpio in tropical</span></p>
            <p className="text-gold-light/80 font-mono text-xs">Ayanamsha (1995) ≈ 23.8°</p>
            <p className="text-gold-light/80 font-mono text-xs font-bold text-gold-light">Sidereal Lagna ≈ 183.7° = <span className="text-emerald-400">Tula (Libra)</span> 3°42&apos;</p>
          </div>
          <p className="text-text-secondary/75 text-xs mt-3 italic">
            {locale === 'en'
              ? 'Tula (Libra) rising means Venus-ruled personality: diplomatic, artistic, relationship-oriented.'
              : 'तुला लग्न अर्थात् शुक्र-शासित व्यक्तित्व: कूटनीतिक, कलात्मक, सम्बन्ध-उन्मुख।'}
          </p>
        </div>
      </LessonSection>

      {/* ─── STEP 5: Ayanamsha ─── */}
      <LessonSection number={5} title={t('s5Title')}>
        <p>{t('s5Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">Lahiri Ayanamsha ≈ 23.85° + 1.397° × T</p>
            <p className="text-gold-light/80 font-mono text-xs">For 1995 (T ≈ -0.044): Ayanamsha ≈ 23.79°</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">Sidereal position = Tropical position - 23.79°</p>
          </div>
          <p className="text-text-secondary/75 text-xs mt-3 italic">
            {locale === 'en'
              ? 'This is why your "Western sign" and "Vedic sign" usually differ by about one sign.'
              : 'इसीलिए आपकी "पश्चिमी राशि" और "वैदिक राशि" प्रायः लगभग एक राशि भिन्न होती हैं।'}
          </p>
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/calculations" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {tl({ en: 'See full mathematical derivation', hi: 'पूर्ण गणितीय व्युत्पत्ति देखें', sa: 'पूर्ण गणितीय व्युत्पत्ति देखें', ta: 'See full mathematical derivation', te: 'See full mathematical derivation', bn: 'See full mathematical derivation', kn: 'See full mathematical derivation', gu: 'See full mathematical derivation', mai: 'पूर्ण गणितीय व्युत्पत्ति देखें', mr: 'पूर्ण गणितीय व्युत्पत्ति देखें' }, locale)} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 6: Planet Positions ─── */}
      <LessonSection number={6} title={t('s6Title')}>
        <p>{t('s6Text')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Graha', hi: 'ग्रह', sa: 'ग्रह', ta: 'Graha', te: 'Graha', bn: 'Graha', kn: 'Graha', gu: 'Graha', mai: 'ग्रह', mr: 'ग्रह' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Sidereal°', hi: 'नाक्ष°', sa: 'नाक्ष°', ta: 'Sidereal°', te: 'Sidereal°', bn: 'Sidereal°', kn: 'Sidereal°', gu: 'Sidereal°', mai: 'नाक्ष°', mr: 'नाक्ष°' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Rashi', hi: 'राशि', sa: 'राशि', ta: 'Rashi', te: 'Rashi', bn: 'Rashi', kn: 'Rashi', gu: 'Rashi', mai: 'राशि', mr: 'राशि' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs hidden sm:table-cell">{tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्र', ta: 'Nakshatra', te: 'Nakshatra', bn: 'Nakshatra', kn: 'Nakshatra', gu: 'Nakshatra', mai: 'नक्षत्र', mr: 'नक्षत्र' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_PLANETS.map((p) => (
                <tr key={p.id} className="border-b border-gold-primary/5">
                  <td className="py-2 text-xs font-semibold" style={{ color: p.color }}>{lt(p.name as LocaleText, locale)}</td>
                  <td className="py-2 text-gold-light/70 font-mono text-xs">{p.sidereal}</td>
                  <td className="py-2 text-text-secondary text-xs">{lt(p.rashi as LocaleText, locale)}</td>
                  <td className="py-2 text-text-secondary/75 text-xs hidden sm:table-cell" style={(isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{lt(p.nak as LocaleText, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/grahas" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {tl({ en: 'Learn about all 9 Grahas', hi: 'सभी 9 ग्रहों के बारे में जानें', sa: 'सभी 9 ग्रहों के बारे में जानें', ta: 'Learn about all 9 Grahas', te: 'Learn about all 9 Grahas', bn: 'Learn about all 9 Grahas', kn: 'Learn about all 9 Grahas', gu: 'Learn about all 9 Grahas', mai: 'सभी 9 ग्रहों के बारे में जानें', mr: 'सभी 9 ग्रहों के बारे में जानें' }, locale)} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 7: House Mapping ─── */}
      <LessonSection number={7} title={t('s7Title')}>
        <p>{t('s7Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'Formula:', hi: 'सूत्र:', sa: 'सूत्र:', ta: 'Formula:', te: 'Formula:', bn: 'Formula:', kn: 'Formula:', gu: 'Formula:', mai: 'सूत्र:', mr: 'सूत्र:' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">House = (Planet_Rashi_Number - Lagna_Rashi_Number + 12) % 12 + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? 'Example: Sun in Cancer (4), Lagna in Libra (7) → (4 - 7 + 12) % 12 + 1 = 10th house'
              : 'उदाहरण: सूर्य कर्क (4) में, लग्न तुला (7) → (4 - 7 + 12) % 12 + 1 = 10वाँ भाव'}
          </p>
        </div>

        {/* House mapping table */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {EXAMPLE_HOUSES.map((h) => (
            <div
              key={h.house}
              className={`rounded-lg p-3 border ${lt(h.planets as LocaleText, locale) !== '—' ? 'border-gold-primary/20 bg-gold-primary/5' : 'border-gold-primary/5 bg-bg-primary/30'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-light text-xs font-bold">{h.house}</span>
                <span className="text-text-secondary/75 text-xs">{lt(h.rashi as LocaleText, locale)}</span>
              </div>
              <div className={`text-xs font-semibold ${lt(h.planets as LocaleText, locale) !== '—' ? 'text-gold-light' : 'text-text-secondary/55'}`}>
                {lt(h.planets as LocaleText, locale)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/bhavas" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {tl({ en: 'Deep dive into all 12 houses', hi: 'सभी 12 भावों का विस्तृत अध्ययन', sa: 'सभी 12 भावों का विस्तृत अध्ययन', ta: 'Deep dive into all 12 houses', te: 'Deep dive into all 12 houses', bn: 'Deep dive into all 12 houses', kn: 'Deep dive into all 12 houses', gu: 'Deep dive into all 12 houses', mai: 'सभी 12 भावों का विस्तृत अध्ययन', mr: 'सभी 12 भावों का विस्तृत अध्ययन' }, locale)} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 8: The Chart ─── */}
      <LessonSection
        number={8}
        title={t('s8Title')}
        variant="highlight"
        illustration={<ExampleKundaliChart size={380} />}
      >
        <p>{t('s8Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'Reading the chart:', hi: 'कुण्डली पढ़ना:', sa: 'कुण्डली पढ़ना:', ta: 'Reading the chart:', te: 'Reading the chart:', bn: 'Reading the chart:', kn: 'Reading the chart:', gu: 'Reading the chart:', mai: 'कुण्डली पढ़ना:', mr: 'कुण्डली पढ़ना:' }, locale)}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{tl({ en: '- Top diamond (House 1) = Lagna → Tula (Libra) with Rahu', hi: '- शीर्ष हीरा (भाव 1) = लग्न → तुला, राहु सहित', sa: '- शीर्ष हीरा (भाव 1) = लग्न → तुला, राहु सहित', ta: '- Top diamond (House 1) = Lagna → Tula (Libra) with Rahu', te: '- Top diamond (House 1) = Lagna → Tula (Libra) with Rahu', bn: '- Top diamond (House 1) = Lagna → Tula (Libra) with Rahu', kn: '- Top diamond (House 1) = Lagna → Tula (Libra) with Rahu', gu: '- Top diamond (House 1) = Lagna → Tula (Libra) with Rahu', mai: '- शीर्ष हीरा (भाव 1) = लग्न → तुला, राहु सहित', mr: '- शीर्ष हीरा (भाव 1) = लग्न → तुला, राहु सहित' }, locale)}</p>
            <p>{tl({ en: '- Houses run counter-clockwise from the top', hi: '- भाव शीर्ष से वामावर्त चलते हैं', sa: '- भाव शीर्ष से वामावर्त चलते हैं', ta: '- Houses run counter-clockwise from the top', te: '- Houses run counter-clockwise from the top', bn: '- Houses run counter-clockwise from the top', kn: '- Houses run counter-clockwise from the top', gu: '- Houses run counter-clockwise from the top', mai: '- भाव शीर्ष से वामावर्त चलते हैं', mr: '- भाव शीर्ष से वामावर्त चलते हैं' }, locale)}</p>
            <p>{tl({ en: '- Rashi names label each house; planets shown at center', hi: '- राशि नाम प्रत्येक भाव में; ग्रह केन्द्र में दिखाए गए', sa: '- राशि नाम प्रत्येक भाव में; ग्रह केन्द्र में दिखाए गए', ta: '- Rashi names label each house; planets shown at center', te: '- Rashi names label each house; planets shown at center', bn: '- Rashi names label each house; planets shown at center', kn: '- Rashi names label each house; planets shown at center', gu: '- Rashi names label each house; planets shown at center', mai: '- राशि नाम प्रत्येक भाव में; ग्रह केन्द्र में दिखाए गए', mr: '- राशि नाम प्रत्येक भाव में; ग्रह केन्द्र में दिखाए गए' }, locale)}</p>
            <p>{tl({ en: '- Sun in 10th (career) = strong public presence', hi: '- सूर्य 10वें भाव (कर्म) में = शक्तिशाली सार्वजनिक उपस्थिति', sa: '- सूर्य 10वें भाव (कर्म) में = शक्तिशाली सार्वजनिक उपस्थिति', ta: '- Sun in 10th (career) = strong public presence', te: '- Sun in 10th (career) = strong public presence', bn: '- Sun in 10th (career) = strong public presence', kn: '- Sun in 10th (career) = strong public presence', gu: '- Sun in 10th (career) = strong public presence', mai: '- सूर्य 10वें भाव (कर्म) में = शक्तिशाली सार्वजनिक उपस्थिति', mr: '- सूर्य 10वें भाव (कर्म) में = शक्तिशाली सार्वजनिक उपस्थिति' }, locale)}</p>
            <p>{tl({ en: '- Moon in 3rd (communication) = expressive mind', hi: '- चन्द्र 3रे भाव (संवाद) में = अभिव्यक्तिशील मन', sa: '- चन्द्र 3रे भाव (संवाद) में = अभिव्यक्तिशील मन', ta: '- Moon in 3rd (communication) = expressive mind', te: '- Moon in 3rd (communication) = expressive mind', bn: '- Moon in 3rd (communication) = expressive mind', kn: '- Moon in 3rd (communication) = expressive mind', gu: '- Moon in 3rd (communication) = expressive mind', mai: '- चन्द्र 3रे भाव (संवाद) में = अभिव्यक्तिशील मन', mr: '- चन्द्र 3रे भाव (संवाद) में = अभिव्यक्तिशील मन' }, locale)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 9: Dignity ─── */}
      <LessonSection number={9} title={t('s9Title')}>
        <p>{t('s9Text')}</p>
        <div className="mt-4 space-y-2">
          {DIGNITY_EXAMPLES.map((d) => (
            <div key={d.planet.en} className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/5">
              <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <div className="flex-1">
                <span className="text-gold-light text-sm font-semibold">{lt(d.planet as LocaleText, locale)}</span>
                <span className="text-text-secondary/75 text-sm"> — </span>
                <span className="text-sm" style={{ color: d.color }}>{lt(d.status as LocaleText, locale)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'Dignity Hierarchy:', hi: 'गरिमा क्रम:', sa: 'गरिमा क्रम:', ta: 'Dignity Hierarchy:', te: 'Dignity Hierarchy:', bn: 'Dignity Hierarchy:', kn: 'Dignity Hierarchy:', gu: 'Dignity Hierarchy:', mai: 'गरिमा क्रम:', mr: 'गरिमा क्रम:' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Exalted (Uccha) > Own Sign (Swa) > Friendly (Mitra) > Neutral > Enemy (Shatru) > Debilitated (Neecha)'
              : 'उच्च > स्वराशि > मित्र > तटस्थ > शत्रु > नीच'}
          </p>
        </div>
      </LessonSection>

      {/* ─── STEP 10: Aspects ─── */}
      <LessonSection number={10} title={t('s10Title')}>
        <p>{t('s10Text')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { planet: { en: 'All Planets', hi: 'सभी ग्रह', sa: 'सर्वे ग्रहाः' }, aspect: { en: '7th house from their position', hi: 'अपनी स्थिति से 7वें भाव पर', sa: 'स्वस्थानात् सप्तमभावे' }, color: '#d4a853' },
            { planet: { en: 'Mars (special)', hi: 'मंगल (विशेष)', sa: 'मङ्गलः (विशेषः)' }, aspect: { en: '+ 4th and 8th houses', hi: '+ 4वें और 8वें भाव पर', sa: '+ चतुर्थाष्टमभावयोः' }, color: '#ef4444' },
            { planet: { en: 'Jupiter (special)', hi: 'गुरु (विशेष)', sa: 'गुरुः (विशेषः)' }, aspect: { en: '+ 5th and 9th houses', hi: '+ 5वें और 9वें भाव पर', sa: '+ पञ्चमनवमभावयोः' }, color: '#f0d48a' },
            { planet: { en: 'Saturn (special)', hi: 'शनि (विशेष)', sa: 'शनिः (विशेषः)' }, aspect: { en: '+ 3rd and 10th houses', hi: '+ 3रे और 10वें भाव पर', sa: '+ तृतीयदशमभावयोः' }, color: '#3b82f6' },
          ].map((a) => (
            <div key={a.planet.en} className="rounded-lg p-3 border border-gold-primary/10 bg-bg-primary/30">
              <div className="text-sm font-semibold mb-1" style={{ color: a.color }}>{lt(a.planet as LocaleText, locale)}</div>
              <div className="text-text-secondary text-xs">{lt(a.aspect as LocaleText, locale)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'In our example:', hi: 'हमारे उदाहरण में:', sa: 'हमारे उदाहरण में:', ta: 'In our example:', te: 'In our example:', bn: 'In our example:', kn: 'In our example:', gu: 'In our example:', mai: 'हमारे उदाहरण में:', mr: 'हमारे उदाहरण में:' }, locale)}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{tl({ en: 'Jupiter in 2nd aspects 8th → protects longevity house', hi: 'गुरु 2रे भाव में → 8वें भाव पर दृष्टि → आयु भाव की रक्षा', sa: 'गुरु 2रे भाव में → 8वें भाव पर दृष्टि → आयु भाव की रक्षा', ta: 'Jupiter in 2nd aspects 8th → protects longevity house', te: 'Jupiter in 2nd aspects 8th → protects longevity house', bn: 'Jupiter in 2nd aspects 8th → protects longevity house', kn: 'Jupiter in 2nd aspects 8th → protects longevity house', gu: 'Jupiter in 2nd aspects 8th → protects longevity house', mai: 'गुरु 2रे भाव में → 8वें भाव पर दृष्टि → आयु भाव की रक्षा', mr: 'गुरु 2रे भाव में → 8वें भाव पर दृष्टि → आयु भाव की रक्षा' }, locale)}</p>
            <p>{tl({ en: 'Saturn in 5th aspects 7th, 11th, 2nd → discipline in marriage, gains, speech', hi: 'शनि 5वें भाव में → 7, 11, 2 पर दृष्टि → विवाह, लाभ, वाणी में अनुशासन', sa: 'शनि 5वें भाव में → 7, 11, 2 पर दृष्टि → विवाह, लाभ, वाणी में अनुशासन', ta: 'Saturn in 5th aspects 7th, 11th, 2nd → discipline in marriage, gains, speech', te: 'Saturn in 5th aspects 7th, 11th, 2nd → discipline in marriage, gains, speech', bn: 'Saturn in 5th aspects 7th, 11th, 2nd → discipline in marriage, gains, speech', kn: 'Saturn in 5th aspects 7th, 11th, 2nd → discipline in marriage, gains, speech', gu: 'Saturn in 5th aspects 7th, 11th, 2nd → discipline in marriage, gains, speech', mai: 'शनि 5वें भाव में → 7, 11, 2 पर दृष्टि → विवाह, लाभ, वाणी में अनुशासन', mr: 'शनि 5वें भाव में → 7, 11, 2 पर दृष्टि → विवाह, लाभ, वाणी में अनुशासन' }, locale)}</p>
            <p>{tl({ en: 'Sun in 10th aspects 4th → career impacts home life', hi: 'सूर्य 10वें में → 4वें पर दृष्टि → कर्म गृह जीवन प्रभावित करता है', sa: 'सूर्य 10वें में → 4वें पर दृष्टि → कर्म गृह जीवन प्रभावित करता है', ta: 'Sun in 10th aspects 4th → career impacts home life', te: 'Sun in 10th aspects 4th → career impacts home life', bn: 'Sun in 10th aspects 4th → career impacts home life', kn: 'Sun in 10th aspects 4th → career impacts home life', gu: 'Sun in 10th aspects 4th → career impacts home life', mai: 'सूर्य 10वें में → 4वें पर दृष्टि → कर्म गृह जीवन प्रभावित करता है', mr: 'सूर्य 10वें में → 4वें पर दृष्टि → कर्म गृह जीवन प्रभावित करता है' }, locale)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 11: Dashas ─── */}
      <LessonSection number={11} title={t('s11Title')}>
        <p>{t('s11Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'In our example:', hi: 'हमारे उदाहरण में:', sa: 'हमारे उदाहरण में:', ta: 'In our example:', te: 'In our example:', bn: 'In our example:', kn: 'In our example:', gu: 'In our example:', mai: 'हमारे उदाहरण में:', mr: 'हमारे उदाहरण में:' }, locale)}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'Moon at 253.0° sidereal → Purva Ashadha Nakshatra', hi: 'चन्द्र 253.0° नाक्षत्रिक → पूर्वाषाढ़ा नक्षत्र', sa: 'चन्द्र 253.0° नाक्षत्रिक → पूर्वाषाढ़ा नक्षत्र', ta: 'Moon at 253.0° sidereal → Purva Ashadha Nakshatra', te: 'Moon at 253.0° sidereal → Purva Ashadha Nakshatra', bn: 'Moon at 253.0° sidereal → Purva Ashadha Nakshatra', kn: 'Moon at 253.0° sidereal → Purva Ashadha Nakshatra', gu: 'Moon at 253.0° sidereal → Purva Ashadha Nakshatra', mai: 'चन्द्र 253.0° नाक्षत्रिक → पूर्वाषाढ़ा नक्षत्र', mr: 'चन्द्र 253.0° नाक्षत्रिक → पूर्वाषाढ़ा नक्षत्र' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'P. Ashadha lord = Venus → born in Venus Maha Dasha', hi: 'पूर्वाषाढ़ा स्वामी = शुक्र → शुक्र महादशा में जन्म', sa: 'पूर्वाषाढ़ा स्वामी = शुक्र → शुक्र महादशा में जन्म', ta: 'P. Ashadha lord = Venus → born in Venus Maha Dasha', te: 'P. Ashadha lord = Venus → born in Venus Maha Dasha', bn: 'P. Ashadha lord = Venus → born in Venus Maha Dasha', kn: 'P. Ashadha lord = Venus → born in Venus Maha Dasha', gu: 'P. Ashadha lord = Venus → born in Venus Maha Dasha', mai: 'पूर्वाषाढ़ा स्वामी = शुक्र → शुक्र महादशा में जन्म', mr: 'पूर्वाषाढ़ा स्वामी = शुक्र → शुक्र महादशा में जन्म' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'Venus Maha Dasha = 20 years total', hi: 'शुक्र महादशा = कुल 20 वर्ष', sa: 'शुक्र महादशा = कुल 20 वर्ष', ta: 'Venus Maha Dasha = 20 years total', te: 'Venus Maha Dasha = 20 years total', bn: 'Venus Maha Dasha = 20 years total', kn: 'Venus Maha Dasha = 20 years total', gu: 'Venus Maha Dasha = 20 years total', mai: 'शुक्र महादशा = कुल 20 वर्ष', mr: 'शुक्र महादशा = कुल 20 वर्ष' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">{tl({ en: 'Moon progress through P. Ashadha:', hi: 'पूर्वाषाढ़ा में चन्द्र की प्रगति:', sa: 'पूर्वाषाढ़ा में चन्द्र की प्रगति:', ta: 'Moon progress through P. Ashadha:', te: 'Moon progress through P. Ashadha:', bn: 'Moon progress through P. Ashadha:', kn: 'Moon progress through P. Ashadha:', gu: 'Moon progress through P. Ashadha:', mai: 'पूर्वाषाढ़ा में चन्द्र की प्रगति:', mr: 'पूर्वाषाढ़ा में चन्द्र की प्रगति:' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: `P. Ashadha span: 253°20' to 266°40' (13°20')`, hi: `पूर्वाषाढ़ा: 253°20' से 266°40' (13°20')`, sa: `पूर्वाषाढ़ा: 253°20' से 266°40' (13°20')`, ta: `P. Ashadha span: 253°20' to 266°40' (13°20')`, te: `P. Ashadha span: 253°20' to 266°40' (13°20')`, bn: `P. Ashadha span: 253°20' to 266°40' (13°20')`, kn: `P. Ashadha span: 253°20' to 266°40' (13°20')`, gu: `P. Ashadha span: 253°20' to 266°40' (13°20')`, mai: `पूर्वाषाढ़ा: 253°20' से 266°40' (13°20')`, mr: `पूर्वाषाढ़ा: 253°20' से 266°40' (13°20')` }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'Moon at 253.0° → near the start → ~19.6 years of Venus remain', hi: 'चन्द्र 253.0° → प्रारम्भ के निकट → शुक्र के ~19.6 वर्ष शेष', sa: 'चन्द्र 253.0° → प्रारम्भ के निकट → शुक्र के ~19.6 वर्ष शेष', ta: 'Moon at 253.0° → near the start → ~19.6 years of Venus remain', te: 'Moon at 253.0° → near the start → ~19.6 years of Venus remain', bn: 'Moon at 253.0° → near the start → ~19.6 years of Venus remain', kn: 'Moon at 253.0° → near the start → ~19.6 years of Venus remain', gu: 'Moon at 253.0° → near the start → ~19.6 years of Venus remain', mai: 'चन्द्र 253.0° → प्रारम्भ के निकट → शुक्र के ~19.6 वर्ष शेष', mr: 'चन्द्र 253.0° → प्रारम्भ के निकट → शुक्र के ~19.6 वर्ष शेष' }, locale)}</p>
            <p className="text-gold-light/60 font-mono text-xs mt-2">{tl({ en: 'After Venus: Sun (6y) → Moon (10y) → Mars (7y) → ...', hi: 'शुक्र के बाद: सूर्य (6 वर्ष) → चन्द्र (10 वर्ष) → मंगल (7 वर्ष) → ...', sa: 'शुक्र के बाद: सूर्य (6 वर्ष) → चन्द्र (10 वर्ष) → मंगल (7 वर्ष) → ...', ta: 'After Venus: Sun (6y) → Moon (10y) → Mars (7y) → ...', te: 'After Venus: Sun (6y) → Moon (10y) → Mars (7y) → ...', bn: 'After Venus: Sun (6y) → Moon (10y) → Mars (7y) → ...', kn: 'After Venus: Sun (6y) → Moon (10y) → Mars (7y) → ...', gu: 'After Venus: Sun (6y) → Moon (10y) → Mars (7y) → ...', mai: 'शुक्र के बाद: सूर्य (6 वर्ष) → चन्द्र (10 वर्ष) → मंगल (7 वर्ष) → ...', mr: 'शुक्र के बाद: सूर्य (6 वर्ष) → चन्द्र (10 वर्ष) → मंगल (7 वर्ष) → ...' }, locale)}</p>
          </div>
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/dashas" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {tl({ en: 'Complete Dasha system explained', hi: 'सम्पूर्ण दशा प्रणाली की व्याख्या', sa: 'सम्पूर्ण दशा प्रणाली की व्याख्या', ta: 'Complete Dasha system explained', te: 'Complete Dasha system explained', bn: 'Complete Dasha system explained', kn: 'Complete Dasha system explained', gu: 'Complete Dasha system explained', mai: 'सम्पूर्ण दशा प्रणाली की व्याख्या', mr: 'सम्पूर्ण दशा प्रणाली की व्याख्या' }, locale)} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 12: Yogas & Doshas ─── */}
      <LessonSection number={12} title={t('s12Title')}>
        <p>{t('s12Text')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg p-4 border border-emerald-400/20 bg-emerald-400/5">
            <h4 className="text-emerald-400 font-bold text-sm mb-2">{tl({ en: 'Yogas (Auspicious Combos)', hi: 'योग (शुभ संयोग)', sa: 'योग (शुभ संयोग)', ta: 'Yogas (Auspicious Combos)', te: 'Yogas (Auspicious Combos)', bn: 'Yogas (Auspicious Combos)', kn: 'Yogas (Auspicious Combos)', gu: 'Yogas (Auspicious Combos)', mai: 'योग (शुभ संयोग)', mr: 'योग (शुभ संयोग)' }, locale)}</h4>
            <ul className="space-y-1 text-text-secondary text-xs">
              <li>{tl({ en: 'Budhaditya Yoga — Mercury + Sun in same house (11th)', hi: 'बुधादित्य योग — बुध + सूर्य (यहाँ 10-11 में)', sa: 'बुधादित्य योग — बुध + सूर्य (यहाँ 10-11 में)', ta: 'Budhaditya Yoga — Mercury + Sun in same house (11th)', te: 'Budhaditya Yoga — Mercury + Sun in same house (11th)', bn: 'Budhaditya Yoga — Mercury + Sun in same house (11th)', kn: 'Budhaditya Yoga — Mercury + Sun in same house (11th)', gu: 'Budhaditya Yoga — Mercury + Sun in same house (11th)', mai: 'बुधादित्य योग — बुध + सूर्य (यहाँ 10-11 में)', mr: 'बुधादित्य योग — बुध + सूर्य (यहाँ 10-11 में)' }, locale)}</li>
              <li>{tl({ en: 'Gajakesari Yoga — Jupiter in Kendra from Moon', hi: 'गजकेसरी योग — चन्द्र से केन्द्र में गुरु', sa: 'गजकेसरी योग — चन्द्र से केन्द्र में गुरु', ta: 'Gajakesari Yoga — Jupiter in Kendra from Moon', te: 'Gajakesari Yoga — Jupiter in Kendra from Moon', bn: 'Gajakesari Yoga — Jupiter in Kendra from Moon', kn: 'Gajakesari Yoga — Jupiter in Kendra from Moon', gu: 'Gajakesari Yoga — Jupiter in Kendra from Moon', mai: 'गजकेसरी योग — चन्द्र से केन्द्र में गुरु', mr: 'गजकेसरी योग — चन्द्र से केन्द्र में गुरु' }, locale)}</li>
              <li>{tl({ en: 'Dhana Yoga — lord of 2nd in good placement', hi: 'धन योग — 2 भाव का स्वामी शुभ स्थान में', sa: 'धन योग — 2 भाव का स्वामी शुभ स्थान में', ta: 'Dhana Yoga — lord of 2nd in good placement', te: 'Dhana Yoga — lord of 2nd in good placement', bn: 'Dhana Yoga — lord of 2nd in good placement', kn: 'Dhana Yoga — lord of 2nd in good placement', gu: 'Dhana Yoga — lord of 2nd in good placement', mai: 'धन योग — 2 भाव का स्वामी शुभ स्थान में', mr: 'धन योग — 2 भाव का स्वामी शुभ स्थान में' }, locale)}</li>
            </ul>
          </div>
          <div className="rounded-lg p-4 border border-red-400/20 bg-red-400/5">
            <h4 className="text-red-400 font-bold text-sm mb-2">{tl({ en: 'Doshas (Afflictions)', hi: 'दोष (कठिनाइयाँ)', sa: 'दोष (कठिनाइयाँ)', ta: 'Doshas (Afflictions)', te: 'Doshas (Afflictions)', bn: 'Doshas (Afflictions)', kn: 'Doshas (Afflictions)', gu: 'Doshas (Afflictions)', mai: 'दोष (कठिनाइयाँ)', mr: 'दोष (कठिनाइयाँ)' }, locale)}</h4>
            <ul className="space-y-1 text-text-secondary text-xs">
              <li>{tl({ en: 'Mangal Dosha — Mars in 1, 2, 4, 7, 8, or 12 from Lagna', hi: 'मंगल दोष — लग्न से 1, 2, 4, 7, 8, 12 में मंगल', sa: 'मंगल दोष — लग्न से 1, 2, 4, 7, 8, 12 में मंगल', ta: 'Mangal Dosha — Mars in 1, 2, 4, 7, 8, or 12 from Lagna', te: 'Mangal Dosha — Mars in 1, 2, 4, 7, 8, or 12 from Lagna', bn: 'Mangal Dosha — Mars in 1, 2, 4, 7, 8, or 12 from Lagna', kn: 'Mangal Dosha — Mars in 1, 2, 4, 7, 8, or 12 from Lagna', gu: 'Mangal Dosha — Mars in 1, 2, 4, 7, 8, or 12 from Lagna', mai: 'मंगल दोष — लग्न से 1, 2, 4, 7, 8, 12 में मंगल', mr: 'मंगल दोष — लग्न से 1, 2, 4, 7, 8, 12 में मंगल' }, locale)}</li>
              <li>{tl({ en: 'Kaal Sarpa — all planets between Rahu-Ketu axis', hi: 'काल सर्प — राहु-केतु अक्ष के बीच सभी ग्रह', sa: 'काल सर्प — राहु-केतु अक्ष के बीच सभी ग्रह', ta: 'Kaal Sarpa — all planets between Rahu-Ketu axis', te: 'Kaal Sarpa — all planets between Rahu-Ketu axis', bn: 'Kaal Sarpa — all planets between Rahu-Ketu axis', kn: 'Kaal Sarpa — all planets between Rahu-Ketu axis', gu: 'Kaal Sarpa — all planets between Rahu-Ketu axis', mai: 'काल सर्प — राहु-केतु अक्ष के बीच सभी ग्रह', mr: 'काल सर्प — राहु-केतु अक्ष के बीच सभी ग्रह' }, locale)}</li>
              <li>{tl({ en: 'Pitru Dosha — Sun afflicted by malefics', hi: 'पितृ दोष — सूर्य पाप ग्रहों से पीड़ित', sa: 'पितृ दोष — सूर्य पाप ग्रहों से पीड़ित', ta: 'Pitru Dosha — Sun afflicted by malefics', te: 'Pitru Dosha — Sun afflicted by malefics', bn: 'Pitru Dosha — Sun afflicted by malefics', kn: 'Pitru Dosha — Sun afflicted by malefics', gu: 'Pitru Dosha — Sun afflicted by malefics', mai: 'पितृ दोष — सूर्य पाप ग्रहों से पीड़ित', mr: 'पितृ दोष — सूर्य पाप ग्रहों से पीड़ित' }, locale)}</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'In our example:', hi: 'हमारे उदाहरण में:', sa: 'हमारे उदाहरण में:', ta: 'In our example:', te: 'In our example:', bn: 'In our example:', kn: 'In our example:', gu: 'In our example:', mai: 'हमारे उदाहरण में:', mr: 'हमारे उदाहरण में:' }, locale)}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{tl({ en: 'Mars in 12th from Lagna → Mangal Dosha is present', hi: 'लग्न से 12वें भाव में मंगल → मंगल दोष उपस्थित', sa: 'लग्न से 12वें भाव में मंगल → मंगल दोष उपस्थित', ta: 'Mars in 12th from Lagna → Mangal Dosha is present', te: 'Mars in 12th from Lagna → Mangal Dosha is present', bn: 'Mars in 12th from Lagna → Mangal Dosha is present', kn: 'Mars in 12th from Lagna → Mangal Dosha is present', gu: 'Mars in 12th from Lagna → Mangal Dosha is present', mai: 'लग्न से 12वें भाव में मंगल → मंगल दोष उपस्थित', mr: 'लग्न से 12वें भाव में मंगल → मंगल दोष उपस्थित' }, locale)}</p>
            <p>{tl({ en: 'Mercury + Venus in Leo (11th) → Dhana Yoga (gains house)', hi: 'बुध + शुक्र सिंह (11वाँ) में → धन योग (लाभ भाव)', sa: 'बुध + शुक्र सिंह (11वाँ) में → धन योग (लाभ भाव)', ta: 'Mercury + Venus in Leo (11th) → Dhana Yoga (gains house)', te: 'Mercury + Venus in Leo (11th) → Dhana Yoga (gains house)', bn: 'Mercury + Venus in Leo (11th) → Dhana Yoga (gains house)', kn: 'Mercury + Venus in Leo (11th) → Dhana Yoga (gains house)', gu: 'Mercury + Venus in Leo (11th) → Dhana Yoga (gains house)', mai: 'बुध + शुक्र सिंह (11वाँ) में → धन योग (लाभ भाव)', mr: 'बुध + शुक्र सिंह (11वाँ) में → धन योग (लाभ भाव)' }, locale)}</p>
            <p>{tl({ en: 'Saturn in own sign Aquarius → strong 5th house (intelligence)', hi: 'शनि स्वराशि कुम्भ में → शक्तिशाली 5वाँ भाव (बुद्धि)', sa: 'शनि स्वराशि कुम्भ में → शक्तिशाली 5वाँ भाव (बुद्धि)', ta: 'Saturn in own sign Aquarius → strong 5th house (intelligence)', te: 'Saturn in own sign Aquarius → strong 5th house (intelligence)', bn: 'Saturn in own sign Aquarius → strong 5th house (intelligence)', kn: 'Saturn in own sign Aquarius → strong 5th house (intelligence)', gu: 'Saturn in own sign Aquarius → strong 5th house (intelligence)', mai: 'शनि स्वराशि कुम्भ में → शक्तिशाली 5वाँ भाव (बुद्धि)', mr: 'शनि स्वराशि कुम्भ में → शक्तिशाली 5वाँ भाव (बुद्धि)' }, locale)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 13: Synthesis ─── */}
      <LessonSection title={t('s13Title')} variant="highlight">
        <p>{t('s13Text')}</p>

        {/* Summary pipeline */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            { en: 'Birth Data', hi: 'जन्म विवरण' },
            { en: 'Time → JD', hi: 'समय → JD' },
            { en: 'LST', hi: 'LST' },
            { en: 'Lagna', hi: 'लग्न' },
            { en: 'Planets', hi: 'ग्रह' },
            { en: 'Houses', hi: 'भाव' },
            { en: 'Chart', hi: 'कुण्डली' },
            { en: 'Dignity', hi: 'गरिमा' },
            { en: 'Aspects', hi: 'दृष्टि' },
            { en: 'Dashas', hi: 'दशा' },
            { en: 'Yogas', hi: 'योग' },
          ].map((step, i, arr) => (
            <span key={step.en} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gold-primary/10 border border-gold-primary/20 text-gold-light">
                {!isDevanagariLocale(locale) ? step.en : step.hi}
              </span>
              {i < arr.length - 1 && <span className="text-gold-primary/40 text-xs">→</span>}
            </span>
          ))}
        </div>
      </LessonSection>

      {/* ─── Deeper Links ─── */}
      <div className="mt-8 mb-6">
        <h3 className="text-xl font-bold text-gold-gradient mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('deeper')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEEPER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 hover:border-gold-primary/30 transition-colors group"
            >
              <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">{lt(link.label as LocaleText, locale)}</div>
              <p className="text-text-secondary/75 text-xs mt-1">{lt(link.desc as LocaleText, locale)}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/25 transition-colors font-semibold"
        >
          {t('tryIt')} →
        </Link>
      </div>
    </div>
  );
}
