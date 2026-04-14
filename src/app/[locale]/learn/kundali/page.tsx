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
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{tl({ en: 'Date', hi: 'तिथि', sa: 'तिथिः', ta: 'தேதி', te: 'తేదీ', bn: 'তারিখ', kn: 'ದಿನಾಂಕ', gu: 'તારીખ', mai: 'तिथि', mr: 'तारीख' }, locale)}</div>
              <div className="text-gold-light font-bold text-lg">15 Aug 1995</div>
            </div>
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{tl({ en: 'Time', hi: 'समय', sa: 'कालः', ta: 'நேரம்', te: 'సమయం', bn: 'সময়', kn: 'ಸಮಯ', gu: 'સમય', mai: 'समय', mr: 'वेळ' }, locale)}</div>
              <div className="text-gold-light font-bold text-lg">10:30 AM IST</div>
            </div>
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{tl({ en: 'Place', hi: 'स्थान', sa: 'स्थानम्', ta: 'இடம்', te: 'స్థలం', bn: 'স্থান', kn: 'ಸ್ಥಳ', gu: 'સ્થળ', mai: 'स्थान', mr: 'ठिकाण' }, locale)}</div>
              <div className="text-gold-light font-bold text-lg">{tl({ en: 'New Delhi', hi: 'नई दिल्ली', sa: 'नवदिल्ली', ta: 'புது தில்லி', te: 'న్యూ ఢిల్లీ', bn: 'নতুন দিল্লি', kn: 'ನವ ದೆಹಲಿ', gu: 'નવી દિલ્હી', mai: 'नई दिल्ली', mr: 'नवी दिल्ली' }, locale)}</div>
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
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'For our example:', hi: 'हमारे उदाहरण के लिए:', sa: 'अस्माकम् उदाहरणाय:', ta: 'நமது உதாரணத்திற்கு:', te: 'మన ఉదాహరణకు:', bn: 'আমাদের উদাহরণের জন্য:', kn: 'ನಮ್ಮ ಉದಾಹರಣೆಗಾಗಿ:', gu: 'આપણા ઉદાહરણ માટે:', mai: 'हमर उदाहरणक लेल:', mr: 'आमच्या उदाहरणासाठी:' }, locale)}</p>
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
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'For our example:', hi: 'हमारे उदाहरण के लिए:', sa: 'अस्माकम् उदाहरणाय:', ta: 'நமது உதாரணத்திற்கு:', te: 'మన ఉదాహరణకు:', bn: 'আমাদের উদাহরণের জন্য:', kn: 'ನಮ್ಮ ಉದಾಹರಣೆಗಾಗಿ:', gu: 'આપણા ઉદાહરણ માટે:', mai: 'हमर उदाहरणक लेल:', mr: 'आमच्या उदाहरणासाठी:' }, locale)}</p>
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
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'For our example:', hi: 'हमारे उदाहरण के लिए:', sa: 'अस्माकम् उदाहरणाय:', ta: 'நமது உதாரணத்திற்கு:', te: 'మన ఉదాహరణకు:', bn: 'আমাদের উদাহরণের জন্য:', kn: 'ನಮ್ಮ ಉದಾಹರಣೆಗಾಗಿ:', gu: 'આપણા ઉદાહરણ માટે:', mai: 'हमर उदाहरणक लेल:', mr: 'आमच्या उदाहरणासाठी:' }, locale)}</p>
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
            {tl({ en: 'See full mathematical derivation', hi: 'पूर्ण गणितीय व्युत्पत्ति देखें', sa: 'पूर्णं गाणितिकं व्युत्पादनं पश्यतु', ta: 'முழு கணித வருவாயைப் பாருங்கள்', te: 'పూర్తి గణిత ఉత్పత్తి చూడండి', bn: 'সম্পূর্ণ গাণিতিক ব্যুৎপত্তি দেখুন', kn: 'ಸಂಪೂರ್ಣ ಗಣಿತೀಯ ವ್ಯುತ್ಪತ್ತಿ ನೋಡಿ', gu: 'સંપૂર્ણ ગાણિતિક વ્યુત્પત્તિ જુઓ', mai: 'पूर्ण गणितीय व्युत्पत्ति देखू', mr: 'संपूर्ण गणितीय व्युत्पत्ती पाहा' }, locale)} →
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
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Graha', hi: 'ग्रह', sa: 'ग्रहः', ta: 'கிரகம்', te: 'గ్రహము', bn: 'গ্রহ', kn: 'ಗ್ರಹ', gu: 'ગ્રહ', mai: 'ग्रह', mr: 'ग्रह' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Sidereal°', hi: 'नाक्ष°', sa: 'नाक्षत्र°', ta: 'நక்ஷத்ர°', te: 'నాక్షత్ర°', bn: 'নাক্ষত্র°', kn: 'ನಾಕ್ಷತ್ರ°', gu: 'નાક્ષત્ર°', mai: 'नाक्षत्र°', mr: 'नाक्षत्र°' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Rashi', hi: 'राशि', sa: 'राशिः', ta: 'ராசி', te: 'రాశి', bn: 'রাশি', kn: 'ರಾಶಿ', gu: 'રાશિ', mai: 'राशि', mr: 'राशी' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs hidden sm:table-cell">{tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्', ta: 'நட்சத்திரம்', te: 'నక్షత్రము', bn: 'নক্ষত্র', kn: 'ನಕ್ಷತ್ರ', gu: 'નક્ષત્ર', mai: 'नक्षत्र', mr: 'नक्षत्र' }, locale)}</th>
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
            {tl({ en: 'Learn about all 9 Grahas', hi: 'सभी 9 ग्रहों के बारे में जानें', sa: 'सर्वेषां नवानां ग्रहाणां विषये जानातु', ta: 'அனைத்து 9 கிரகங்களையும் பற்றி அறியுங்கள்', te: 'అన్ని 9 గ్రహముల గురించి తెలుసుకోండి', bn: 'সমস্ত 9 গ্রহ সম্পর্কে জানুন', kn: 'ಎಲ್ಲಾ 9 ಗ್ರಹಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ', gu: 'બધા 9 ગ્રહો વિશે જાણો', mai: 'सभी 9 ग्रहक बारेमे जानू', mr: 'सर्व 9 ग्रहांबद्दल जाणून घ्या' }, locale)} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 7: House Mapping ─── */}
      <LessonSection number={7} title={t('s7Title')}>
        <p>{t('s7Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'Formula:', hi: 'सूत्र:', sa: 'सूत्रम्:', ta: 'சூத்திரம்:', te: 'సూత్రము:', bn: 'সূত্র:', kn: 'ಸೂತ್ರ:', gu: 'સૂત્ર:', mai: 'सूत्र:', mr: 'सूत्र:' }, locale)}</p>
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
            {tl({ en: 'Deep dive into all 12 houses', hi: 'सभी 12 भावों का विस्तृत अध्ययन', sa: 'सर्वेषां द्वादशानां भावानां गहनम् अध्ययनम्', ta: 'அனைத்து 12 இல்லங்களிலும் ஆழமாக ஆராயுங்கள்', te: 'అన్ని 12 భావముల లోతైన అధ్యయనం', bn: 'সমস্ত 12 ভাব সম্পর্কে গভীর আলোচনা', kn: 'ಎಲ್ಲಾ 12 ಭಾವಗಳ ಆಳವಾದ ಅಧ್ಯಯನ', gu: 'બધા 12 ભાવોમાં ઊંડો અભ્યાસ', mai: 'सभी 12 भावक गहन अध्ययन करू', mr: 'सर्व 12 भावांचा सखोल अभ्यास' }, locale)} →
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
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'Reading the chart:', hi: 'कुण्डली पढ़ना:', sa: 'कुण्डलीपठनम्:', ta: 'ஜாதகம் வாசிக்கவும்:', te: 'కుండలి చదవడం:', bn: 'কুণ্ডলী পাঠ করা:', kn: 'ಕುಂಡಲಿ ಓದುವುದು:', gu: 'કુંડળી વાંચવી:', mai: 'कुण्डली पढ़ब:', mr: 'कुंडली वाचणे:' }, locale)}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{tl({ en: '- Top diamond (House 1) = Lagna → Tula (Libra) with Rahu', hi: '- शीर्ष हीरा (भाव 1) = लग्न → तुला, राहु सहित', sa: '- शीर्षहीरकः (भावः 1) = लग्नम् → तुला, राहुणा सह', ta: '- மேல் வைரம் (இல்லம் 1) = லக்னம் → துலாம், ராகுவுடன்', te: '- పై వజ్రం (భావం 1) = లగ్నం → తుల, రాహువుతో', bn: '- শীর্ষ হীরা (ভাব 1) = লগ্ন → তুলা, রাহুসহ', kn: '- ಮೇಲಿನ ವಜ್ರ (ಭಾವ 1) = ಲಗ್ನ → ತುಲಾ, ರಾಹುವಿನೊಂದಿಗೆ', gu: '- ઉપરનો હીરો (ભાવ 1) = લગ્ન → તુલા, રાહુ સહ', mai: '- ऊपरक हीरा (भाव 1) = लग्न → तुला, राहुक संग', mr: '- शीर्ष हिरा (भाव 1) = लग्न → तुला, राहूसह' }, locale)}</p>
            <p>{tl({ en: '- Houses run counter-clockwise from the top', hi: '- भाव शीर्ष से वामावर्त चलते हैं', sa: '- भावाः शीर्षात् वामावर्तं चलन्ति', ta: '- இல்லங்கள் மேலிருந்து இடஞ்சுழியாக இயங்குகின்றன', te: '- భావాలు పైనుండి అపసవ్యంగా నడుస్తాయి', bn: '- ভাবগুলি উপর থেকে বামাবর্তে চলে', kn: '- ಭಾವಗಳು ಮೇಲಿನಿಂದ ಅಪ್ರದಕ್ಷಿಣಾಕಾರವಾಗಿ ಚಲಿಸುತ್ತವೆ', gu: '- ભાવ ઉપરથી ઘડિયાળ-વિરુદ્ધ દિશામાં ચાલે છે', mai: '- भाव ऊपरसँ वामावर्त चलैत अछि', mr: '- भाव वरून प्रतिघड्याळी दिशेने चालतात' }, locale)}</p>
            <p>{tl({ en: '- Rashi names label each house; planets shown at center', hi: '- राशि नाम प्रत्येक भाव में; ग्रह केन्द्र में दिखाए गए', sa: '- प्रत्येकं भावे राशिनाम; ग्रहाः केन्द्रे दर्शिताः', ta: '- ஒவ்வொரு இல்லத்திலும் ராசி பெயர்; கிரகங்கள் மையத்தில் காட்டப்படுகின்றன', te: '- ప్రతి భావంలో రాశి పేరు; గ్రహాలు మధ్యలో చూపబడ్డాయి', bn: '- প্রতিটি ভাবে রাশির নাম; গ্রহগুলি কেন্দ্রে প্রদর্শিত', kn: '- ಪ್ರತಿ ಭಾವದಲ್ಲಿ ರಾಶಿ ಹೆಸರು; ಗ್ರಹಗಳು ಕೇಂದ್ರದಲ್ಲಿ ತೋರಿಸಲಾಗಿದೆ', gu: '- દરેક ભાવ પર રાશિ નામ; ગ્રહ મધ્યમાં દર્શાવ્યા છે', mai: '- प्रत्येक भावमे राशि नाम; ग्रह केन्द्रमे देखाओल गेल अछि', mr: '- प्रत्येक भावावर राशी नाव; ग्रह मध्यभागी दाखवले आहेत' }, locale)}</p>
            <p>{tl({ en: '- Sun in 10th (career) = strong public presence', hi: '- सूर्य 10वें भाव (कर्म) में = शक्तिशाली सार्वजनिक उपस्थिति', sa: '- दशमभावे सूर्यः (कर्म) = सबलं सार्वजनिकं प्रभावः', ta: '- 10ஆம் இல்லத்தில் சூரியன் (தொழில்) = வலிமையான பொது இருப்பு', te: '- 10వ భావంలో సూర్యుడు (కర్మ) = బలమైన సార్వజనిక ఉనికి', bn: '- 10ম ভাবে সূর্য (কর্ম) = শক্তিশালী সার্বজনিক উপস্থিতি', kn: '- 10ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ (ಕರ್ಮ) = ಪ್ರಬಲ ಸಾರ್ವಜನಿಕ ಉಪಸ್ಥಿತಿ', gu: '- 10મા ભાવમાં સૂર્ય (કર્મ) = મજબૂત જાહેર હાજરી', mai: '- 10म भावमे सूर्य (कर्म) = शक्तिशाली सार्वजनिक उपस्थिति', mr: '- 10 व्या भावात सूर्य (कर्म) = मजबूत सार्वजनिक उपस्थिती' }, locale)}</p>
            <p>{tl({ en: '- Moon in 3rd (communication) = expressive mind', hi: '- चन्द्र 3रे भाव (संवाद) में = अभिव्यक्तिशील मन', sa: '- तृतीयभावे चन्द्रः (संवादः) = अभिव्यक्तिशीलं मनः', ta: '- 3ஆம் இல்லத்தில் சந்திரன் (தொடர்பு) = வெளிப்பாடுள்ள மனம்', te: '- 3వ భావంలో చంద్రుడు (సంభాషణ) = వ్యక్తీకరణ మనస్సు', bn: '- 3য় ভাবে চন্দ্র (যোগাযোগ) = প্রকাশমান মন', kn: '- 3ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ (ಸಂವಹನ) = ಅಭಿವ್ಯಕ್ತಿಶೀಲ ಮನಸ್ಸು', gu: '- 3જા ભાવમાં ચંદ્ર (સંવાદ) = અભિવ્યક્તિશીલ મન', mai: '- 3र भावमे चन्द्र (संवाद) = अभिव्यक्तिशील मन', mr: '- 3 र्‍या भावात चंद्र (संवाद) = अभिव्यक्तीशील मन' }, locale)}</p>
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
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'Dignity Hierarchy:', hi: 'गरिमा क्रम:', sa: 'ग्रहमर्यादाक्रमः:', ta: 'கண்ணியத் தரவரிசை:', te: 'గౌరవ క్రమం:', bn: 'মর্যাদার ক্রম:', kn: 'ಗೌರವ ಕ್ರಮ:', gu: 'ગ્રહ-ગૌરવ ક્રમ:', mai: 'गरिमा क्रम:', mr: 'प्रतिष्ठा क्रम:' }, locale)}</p>
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
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'In our example:', hi: 'हमारे उदाहरण में:', sa: 'अस्माकम् उदाहरणे:', ta: 'நமது உதாரணத்தில்:', te: 'మన ఉదాహరణలో:', bn: 'আমাদের উদাহরণে:', kn: 'ನಮ್ಮ ಉದಾಹರಣೆಯಲ್ಲಿ:', gu: 'આપણા ઉદાહરણમાં:', mai: 'हमर उदाहरणमे:', mr: 'आमच्या उदाहरणात:' }, locale)}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{tl({ en: 'Jupiter in 2nd aspects 8th → protects longevity house', hi: 'गुरु 2रे भाव में → 8वें भाव पर दृष्टि → आयु भाव की रक्षा', sa: 'द्वितीयभावे गुरुः अष्टमं पश्यति → आयुर्भावस्य रक्षणम्', ta: '2ஆம் இல்லத்தில் குரு 8ஆம் இல்லத்தை பார்க்கிறது → ஆயுள் இல்லத்தை காக்கிறது', te: '2వ భావంలో గురువు 8వ భావాన్ని చూస్తాడు → ఆయుర్భావాన్ని రక్షిస్తాడు', bn: '2য় ভাবে বৃহস্পতি 8ম দেখে → আয়ুর্ভাব রক্ষা করে', kn: '2ನೇ ಭಾವದಲ್ಲಿ ಗುರು 8ನೇ ಭಾವವನ್ನು ನೋಡುತ್ತಾನೆ → ಆಯುರ್ಭಾವ ರಕ್ಷಿಸುತ್ತಾನೆ', gu: '2જા ભાવ ગુરુ 8મો ભાવ જુએ → આયુષ્ય ભાવ સુરક્ષિત', mai: '2र भावमे गुरु 8म देखैत अछि → आयु भावक रक्षा करैत अछि', mr: '2 र्‍या भावात गुरू 8 व्याकडे दृष्टी → आयुर्भाव संरक्षण' }, locale)}</p>
            <p>{tl({ en: 'Saturn in 5th aspects 7th, 11th, 2nd → discipline in marriage, gains, speech', hi: 'शनि 5वें भाव में → 7, 11, 2 पर दृष्टि → विवाह, लाभ, वाणी में अनुशासन', sa: 'पञ्चमभावे शनिः सप्तमं, एकादशं, द्वितीयं च पश्यति → विवाहे, लाभे, वाण्यां च अनुशासनम्', ta: '5ஆம் இல்லத்தில் சனி 7, 11, 2ஐ பார்க்கிறது → திருமணம், லாபம், பேச்சில் ஒழுக்கம்', te: '5వ భావంలో శని 7, 11, 2 చూస్తాడు → వివాహం, లాభం, వాక్కులో క్రమశిక్షణ', bn: '5ম ভাবে শনি 7, 11, 2 দেখে → বিবাহ, লাভ, বাক্যে শৃঙ্খলা', kn: '5ನೇ ಭಾವದಲ್ಲಿ ಶನಿ 7, 11, 2 ನೋಡುತ್ತಾನೆ → ವಿವಾಹ, ಲಾಭ, ವಾಕ್ಯದಲ್ಲಿ ಶಿಸ್ತು', gu: '5મા ભાવ શનિ 7, 11, 2 જુએ → લગ્ન, લાભ, વાણીમાં શિસ્ત', mai: '5म भावमे शनि 7, 11, 2 देखैत अछि → विवाह, लाभ, वाणीमे अनुशासन', mr: '5 व्या भावात शनी 7, 11, 2 कडे दृष्टी → विवाह, लाभ, वाणीत शिस्त' }, locale)}</p>
            <p>{tl({ en: 'Sun in 10th aspects 4th → career impacts home life', hi: 'सूर्य 10वें में → 4वें पर दृष्टि → कर्म गृह जीवन प्रभावित करता है', sa: 'दशमभावे सूर्यः चतुर्थं पश्यति → कर्म गृहजीवनं प्रभावयति', ta: '10ஆம் இல்லத்தில் சூரியன் 4ஆம் இல்லத்தை பார்க்கிறது → தொழில் வீட்டு வாழ்க்கையை பாதிக்கிறது', te: '10వ భావంలో సూర్యుడు 4వ భావాన్ని చూస్తాడు → కర్మ గృహ జీవితాన్ని ప్రభావితం చేస్తుంది', bn: '10ম ভাবে সূর্য 4র্থ দেখে → কর্ম গৃহজীবনকে প্রভাবিত করে', kn: '10ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ 4ನೇ ಭಾವ ನೋಡುತ್ತಾನೆ → ಕರ್ಮ ಗೃಹಜೀವನ ಪ್ರಭಾವಿಸುತ್ತದೆ', gu: '10મા ભાવ સૂર્ય 4થો ભાવ જુએ → કર્મ ઘર-જીવન પ્રભાવિત કરે', mai: '10म भावमे सूर्य 4र्थ देखैत अछि → कर्म गृह जीवन प्रभावित करैत अछि', mr: '10 व्या भावात सूर्य 4 थ्याकडे दृष्टी → करिअर घरगुती जीवनावर परिणाम करते' }, locale)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 11: Dashas ─── */}
      <LessonSection number={11} title={t('s11Title')}>
        <p>{t('s11Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'In our example:', hi: 'हमारे उदाहरण में:', sa: 'अस्माकम् उदाहरणे:', ta: 'நமது உதாரணத்தில்:', te: 'మన ఉదాహరణలో:', bn: 'আমাদের উদাহরণে:', kn: 'ನಮ್ಮ ಉದಾಹರಣೆಯಲ್ಲಿ:', gu: 'આપણા ઉદાહરણમાં:', mai: 'हमर उदाहरणमे:', mr: 'आमच्या उदाहरणात:' }, locale)}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'Moon at 253.0° sidereal → Purva Ashadha Nakshatra', hi: 'चन्द्र 253.0° नाक्षत्रिक → पूर्वाषाढ़ा नक्षत्र', sa: '253.0° नाक्षत्रे चन्द्रः → पूर्वाषाढा नक्षत्रम्', ta: '253.0° நக்ஷத்ர சந்திரன் → பூர்வ ஆஷாடா நட்சத்திரம்', te: '253.0° నాక్షత్ర చంద్రుడు → పూర్వాషాఢ నక్షత్రం', bn: '253.0° নাক্ষত্রিক চন্দ্র → পূর্বাষাঢ়া নক্ষত্র', kn: '253.0° ನಾಕ್ಷತ್ರ ಚಂದ್ರ → ಪೂರ್ವಾಷಾಢ ನಕ್ಷತ್ರ', gu: '253.0° નાક્ષત્ર ચંદ્ર → પૂર્વ આષાઢ નક્ષત્ર', mai: '253.0° नाक्षत्रिक चन्द्र → पूर्वाषाढ़ा नक्षत्र', mr: '253.0° नाक्षत्रिक चंद्र → पूर्वाषाढा नक्षत्र' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'P. Ashadha lord = Venus → born in Venus Maha Dasha', hi: 'पूर्वाषाढ़ा स्वामी = शुक्र → शुक्र महादशा में जन्म', sa: 'पूर्वाषाढायाः स्वामी = शुक्रः → शुक्र-महादशायां जन्म', ta: 'பூர்வாஷாடா நாதன் = சுக்கிரன் → சுக்கிர மஹாதசையில் பிறப்பு', te: 'పూర్వాషాఢ నాథుడు = శుక్రుడు → శుక్ర మహాదశలో జన్మం', bn: 'পূর্বাষাঢ়া স্বামী = শুক্র → শুক্র মহাদশায় জন্ম', kn: 'ಪೂರ್ವಾಷಾಢ ಅಧಿಪತಿ = ಶುಕ್ರ → ಶುಕ್ರ ಮಹಾದಶೆಯಲ್ಲಿ ಜನನ', gu: 'પૂ. આષાઢ સ્વામી = શુક્ર → શુક્ર મહાદશામાં જન્મ', mai: 'पूर्वाषाढ़ा स्वामी = शुक्र → शुक्र महादशामे जन्म', mr: 'पूर्वाषाढा स्वामी = शुक्र → शुक्र महादशेत जन्म' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'Venus Maha Dasha = 20 years total', hi: 'शुक्र महादशा = कुल 20 वर्ष', sa: 'शुक्र-महादशा = विंशतिः वर्षाणि सर्वाणि', ta: 'சுக்கிர மஹாதசை = மொத்தம் 20 ஆண்டுகள்', te: 'శుక్ర మహాదశ = మొత్తం 20 సంవత్సరాలు', bn: 'শুক্র মহাদশা = মোট 20 বছর', kn: 'ಶುಕ್ರ ಮಹಾದಶೆ = ಒಟ್ಟು 20 ವರ್ಷಗಳು', gu: 'શુક્ર મહાદશા = કુલ 20 વર્ષ', mai: 'शुक्र महादशा = कुल 20 वर्ष', mr: 'शुक्र महादशा = एकूण 20 वर्षे' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">{tl({ en: 'Moon progress through P. Ashadha:', hi: 'पूर्वाषाढ़ा में चन्द्र की प्रगति:', sa: 'पूर्वाषाढायां चन्द्रस्य प्रगतिः:', ta: 'பூர்வாஷாடா வழியாக சந்திர முன்னேற்றம்:', te: 'పూర్వాషాఢ ద్వారా చంద్రుని ప్రగతి:', bn: 'পূর্বাষাঢ়ায় চন্দ্রের অগ্রগতি:', kn: 'ಪೂರ್ವಾಷಾಢದ ಮೂಲಕ ಚಂದ್ರನ ಪ್ರಗತಿ:', gu: 'પૂ. આષાઢ દ્વારા ચંદ્રની પ્રગતિ:', mai: 'पूर्वाषाढ़ामे चन्द्रक प्रगति:', mr: 'पूर्वाषाढातून चंद्राची प्रगती:' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: `P. Ashadha span: 253°20' to 266°40' (13°20')`, hi: `पूर्वाषाढ़ा: 253°20' से 266°40' (13°20')`, sa: `पूर्वाषाढ़ा: 253°20' से 266°40' (13°20')`, ta: `P. Ashadha span: 253°20' to 266°40' (13°20')`, te: `P. Ashadha span: 253°20' to 266°40' (13°20')`, bn: `P. Ashadha span: 253°20' to 266°40' (13°20')`, kn: `P. Ashadha span: 253°20' to 266°40' (13°20')`, gu: `P. Ashadha span: 253°20' to 266°40' (13°20')`, mai: `पूर्वाषाढ़ा: 253°20' से 266°40' (13°20')`, mr: `पूर्वाषाढ़ा: 253°20' से 266°40' (13°20')` }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'Moon at 253.0° → near the start → ~19.6 years of Venus remain', hi: 'चन्द्र 253.0° → प्रारम्भ के निकट → शुक्र के ~19.6 वर्ष शेष', sa: '253.0° चन्द्रः → आरम्भे निकटम् → शुक्रस्य ~19.6 वर्षाणि अवशिष्यन्ते', ta: '253.0° சந்திரன் → ஆரம்பத்திற்கு அருகில் → சுக்கிரனின் ~19.6 ஆண்டுகள் மீதமுள்ளன', te: '253.0° చంద్రుడు → ప్రారంభం దగ్గర → శుక్రుని ~19.6 సంవత్సరాలు మిగిలాయి', bn: '253.0° চন্দ্র → শুরুর কাছে → শুক্রের ~19.6 বছর বাকি', kn: '253.0° ಚಂದ್ರ → ಆರಂಭದ ಬಳಿ → ಶುಕ್ರನ ~19.6 ವರ್ಷಗಳು ಉಳಿದಿವೆ', gu: '253.0° ચંદ્ર → શરૂઆત નજીક → શુક્રના ~19.6 વર્ષ બાકી', mai: '253.0° चन्द्र → प्रारम्भक निकट → शुक्रक ~19.6 वर्ष शेष अछि', mr: '253.0° चंद्र → सुरुवातीजवळ → शुक्राचे ~19.6 वर्षे शिल्लक' }, locale)}</p>
            <p className="text-gold-light/60 font-mono text-xs mt-2">{tl({ en: 'After Venus: Sun (6y) → Moon (10y) → Mars (7y) → ...', hi: 'शुक्र के बाद: सूर्य (6 वर्ष) → चन्द्र (10 वर्ष) → मंगल (7 वर्ष) → ...', sa: 'शुक्रानन्तरम्: सूर्यः (6 वर्ष) → चन्द्रः (10 वर्ष) → मंगलः (7 वर्ष) → ...', ta: 'சுக்கிரனுக்கு பிறகு: சூரியன் (6ஆண்.) → சந்திரன் (10ஆண்.) → செவ்வாய் (7ஆண்.) → ...', te: 'శుక్రుని తర్వాత: సూర్యుడు (6సం.) → చంద్రుడు (10సం.) → మంగళుడు (7సం.) → ...', bn: 'শুক্রের পর: সূর্য (6 বছর) → চন্দ্র (10 বছর) → মঙ্গল (7 বছর) → ...', kn: 'ಶುಕ್ರನ ನಂತರ: ಸೂರ್ಯ (6ವ.) → ಚಂದ್ರ (10ವ.) → ಮಂಗಳ (7ವ.) → ...', gu: 'શુક્ર પછી: સૂર્ય (6 વ.) → ચંદ્ર (10 વ.) → મંગળ (7 વ.) → ...', mai: 'शुक्रक बाद: सूर्य (6 वर्ष) → चन्द्र (10 वर्ष) → मंगल (7 वर्ष) → ...', mr: 'शुक्रानंतर: सूर्य (6 वर्षे) → चंद्र (10 वर्षे) → मंगळ (7 वर्षे) → ...' }, locale)}</p>
          </div>
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/dashas" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {tl({ en: 'Complete Dasha system explained', hi: 'सम्पूर्ण दशा प्रणाली की व्याख्या', sa: 'सम्पूर्णस्य दशाप्रणाल्याः विवरणम्', ta: 'முழுமையான தசா முறை விளக்கம்', te: 'సంపూర్ణ దశా పద్ధతి వివరణ', bn: 'সম্পূর্ণ দশা পদ্ধতির ব্যাখ্যা', kn: 'ಸಂಪೂರ್ಣ ದಶಾ ಪದ್ಧತಿ ವಿವರಣೆ', gu: 'સંપૂર્ણ દશા પ્રણાલીની સમજૂતી', mai: 'सम्पूर्ण दशा प्रणालीक व्याख्या', mr: 'संपूर्ण दशा प्रणालीचे स्पष्टीकरण' }, locale)} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 12: Yogas & Doshas ─── */}
      <LessonSection number={12} title={t('s12Title')}>
        <p>{t('s12Text')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg p-4 border border-emerald-400/20 bg-emerald-400/5">
            <h4 className="text-emerald-400 font-bold text-sm mb-2">{tl({ en: 'Yogas (Auspicious Combos)', hi: 'योग (शुभ संयोग)', sa: 'योगाः (शुभसंयोगाः)', ta: 'யோகங்கள் (சுபமான சேர்க்கைகள்)', te: 'యోగాలు (శుభ సంయోగాలు)', bn: 'যোগ (শুভ সংযোগ)', kn: 'ಯೋಗಗಳು (ಶುಭ ಸಂಯೋಗಗಳು)', gu: 'યોગ (શુભ સંયોગ)', mai: 'योग (शुभ संयोग)', mr: 'योग (शुभ संयोग)' }, locale)}</h4>
            <ul className="space-y-1 text-text-secondary text-xs">
              <li>{tl({ en: 'Budhaditya Yoga — Mercury + Sun in same house (11th)', hi: 'बुधादित्य योग — बुध + सूर्य (यहाँ 10-11 में)', sa: 'बुधादित्ययोगः — बुधसूर्यौ एकस्मिन्नेव भावे (एकादशे)', ta: 'புதாதித்ய யோகம் — புதன் + சூரியன் ஒரே இல்லத்தில் (11ஆவது)', te: 'బుధాదిత్య యోగం — బుధ + సూర్యుడు ఒకే భావంలో (11వ)', bn: 'বুধাদিত্য যোগ — বুধ + সূর্য একই ভাবে (11তম)', kn: 'ಬುಧಾದಿತ್ಯ ಯೋಗ — ಬುಧ + ಸೂರ್ಯ ಒಂದೇ ಭಾವದಲ್ಲಿ (11ನೇ)', gu: 'બુધાદિત્ય યોગ — બુધ + સૂર્ય એ જ ભાવ (11મો)', mai: 'बुधादित्य योग — बुध + सूर्य एके भावमे (10-11 मे)', mr: 'बुधादित्य योग — बुध + सूर्य एकाच भावात (11 वा)' }, locale)}</li>
              <li>{tl({ en: 'Gajakesari Yoga — Jupiter in Kendra from Moon', hi: 'गजकेसरी योग — चन्द्र से केन्द्र में गुरु', sa: 'गजकेसरियोगः — चन्द्रात् केन्द्रे गुरुः', ta: 'கஜகேசரி யோகம் — சந்திரனிலிருந்து கேந்திரத்தில் குரு', te: 'గజకేసరి యోగం — చంద్రుని నుండి కేంద్రంలో గురువు', bn: 'গজকেশরী যোগ — চন্দ্র থেকে কেন্দ্রে বৃহস্পতি', kn: 'ಗಜಕೇಸರಿ ಯೋಗ — ಚಂದ್ರನಿಂದ ಕೇಂದ್ರದಲ್ಲಿ ಗುರು', gu: 'ગજકેસરી યોગ — ચંદ્રથી કેન્દ્રમાં ગુરુ', mai: 'गजकेसरी योग — चन्द्रसँ केन्द्रमे गुरु', mr: 'गजकेसरी योग — चंद्रापासून केंद्रात गुरू' }, locale)}</li>
              <li>{tl({ en: 'Dhana Yoga — lord of 2nd in good placement', hi: 'धन योग — 2 भाव का स्वामी शुभ स्थान में', sa: 'धनयोगः — द्वितीयभावस्य स्वामी शुभस्थाने', ta: 'தன யோகம் — 2ஆம் இல்லத்தின் அதிபதி நல்ல இடத்தில்', te: 'ధన యోగం — 2వ భావాధిపతి మంచి స్థానంలో', bn: 'ধন যোগ — 2য় ভাবের স্বামী শুভ স্থানে', kn: 'ಧನ ಯೋಗ — 2ನೇ ಭಾವಾಧಿಪತಿ ಶುಭ ಸ್ಥಾನದಲ್ಲಿ', gu: 'ધન યોગ — 2જા ભાવના સ્વામી શુભ સ્થાને', mai: 'धन योग — 2र भावक स्वामी शुभ स्थानमे', mr: 'धन योग — 2 र्‍या भावाचा स्वामी चांगल्या स्थानी' }, locale)}</li>
            </ul>
          </div>
          <div className="rounded-lg p-4 border border-red-400/20 bg-red-400/5">
            <h4 className="text-red-400 font-bold text-sm mb-2">{tl({ en: 'Doshas (Afflictions)', hi: 'दोष (कठिनाइयाँ)', sa: 'दोषाः (पीडाः)', ta: 'தோஷங்கள் (பாதிப்புகள்)', te: 'దోషాలు (పీడలు)', bn: 'দোষ (কষ্টসমূহ)', kn: 'ದೋಷಗಳು (ಪೀಡೆಗಳು)', gu: 'દોષ (પીડા)', mai: 'दोष (कठिनाइयाँ)', mr: 'दोष (पीडा)' }, locale)}</h4>
            <ul className="space-y-1 text-text-secondary text-xs">
              <li>{tl({ en: 'Mangal Dosha — Mars in 1, 2, 4, 7, 8, or 12 from Lagna', hi: 'मंगल दोष — लग्न से 1, 2, 4, 7, 8, 12 में मंगल', sa: 'मंगलदोषः — लग्नात् 1, 2, 4, 7, 8, 12 भावेषु मंगलः', ta: 'மங்கள தோஷம் — லக்னத்திலிருந்து 1, 2, 4, 7, 8, 12ல் செவ்வாய்', te: 'మంగళ దోషం — లగ్నం నుండి 1, 2, 4, 7, 8, 12లో మంగళుడు', bn: 'মঙ্গল দোষ — লগ্ন থেকে 1, 2, 4, 7, 8, 12তে মঙ্গল', kn: 'ಮಂಗಳ ದೋಷ — ಲಗ್ನದಿಂದ 1, 2, 4, 7, 8, 12ರಲ್ಲಿ ಮಂಗಳ', gu: 'મંગળ દોષ — લગ્નથી 1, 2, 4, 7, 8, 12 ભાવ મંગળ', mai: 'मंगल दोष — लग्नसँ 1, 2, 4, 7, 8, 12 मे मंगल', mr: 'मंगल दोष — लग्नापासून 1, 2, 4, 7, 8, 12 मध्ये मंगळ' }, locale)}</li>
              <li>{tl({ en: 'Kaal Sarpa — all planets between Rahu-Ketu axis', hi: 'काल सर्प — राहु-केतु अक्ष के बीच सभी ग्रह', sa: 'कालसर्पः — राहु-केत्वोः अक्षे सर्वे ग्रहाः', ta: 'கால சர்ப்பம் — ராகு-கேது அச்சுக்கு இடையே அனைத்து கிரகங்கள்', te: 'కాల సర్పం — రాహు-కేతు అక్షం మధ్య అన్ని గ్రహాలు', bn: 'কাল সর্প — রাহু-কেতু অক্ষের মধ্যে সব গ্রহ', kn: 'ಕಾಲ ಸರ್ಪ — ರಾಹು-ಕೇತು ಅಕ್ಷದ ನಡುವೆ ಎಲ್ಲ ಗ್ರಹಗಳು', gu: 'કાળ સર્પ — રાહુ-કેતુ અક્ષ વચ્ચે સઘળા ગ્રહ', mai: 'काल सर्प — राहु-केतु अक्षक बीच सभ ग्रह', mr: 'काल सर्प — राहू-केतू अक्षाच्या मध्ये सर्व ग्रह' }, locale)}</li>
              <li>{tl({ en: 'Pitru Dosha — Sun afflicted by malefics', hi: 'पितृ दोष — सूर्य पाप ग्रहों से पीड़ित', sa: 'पितृदोषः — पापग्रहैः पीडितः सूर्यः', ta: 'பித்ரு தோஷம் — சூரியன் பாப கிரகங்களால் பாதிக்கப்பட்டுள்ளான்', te: 'పితృ దోషం — సూర్యుడు పాప గ్రహాల వల్ల పీడితుడు', bn: 'পিতৃ দোষ — সূর্য পাপগ্রহ দ্বারা পীড়িত', kn: 'ಪಿತೃ ದೋಷ — ಸೂರ್ಯ ಪಾಪ ಗ್ರಹಗಳಿಂದ ಪೀಡಿತ', gu: 'પિતૃ દોષ — સૂર્ય પાપ ગ્રહ દ્વારા પ્રભાવિત', mai: 'पितृ दोष — पाप ग्रहसँ सूर्य पीड़ित', mr: 'पितृ दोष — सूर्य पापग्रहांनी पीडित' }, locale)}</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'In our example:', hi: 'हमारे उदाहरण में:', sa: 'अस्माकम् उदाहरणे:', ta: 'நமது உதாரணத்தில்:', te: 'మన ఉదాహరణలో:', bn: 'আমাদের উদাহরণে:', kn: 'ನಮ್ಮ ಉದಾಹರಣೆಯಲ್ಲಿ:', gu: 'આપણા ઉદાહરણમાં:', mai: 'हमर उदाहरणमे:', mr: 'आमच्या उदाहरणात:' }, locale)}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{tl({ en: 'Mars in 12th from Lagna → Mangal Dosha is present', hi: 'लग्न से 12वें भाव में मंगल → मंगल दोष उपस्थित', sa: 'लग्नात् द्वादशभावे मंगलः → मंगलदोषः विद्यते', ta: 'லக்னத்திலிருந்து 12ஆம் இல்லத்தில் செவ்வாய் → மங்கள தோஷம் உள்ளது', te: 'లగ్నం నుండి 12వ భావంలో మంగళుడు → మంగళ దోషం ఉంది', bn: 'লগ্ন থেকে 12তম ভাবে মঙ্গল → মঙ্গল দোষ বিদ্যমান', kn: 'ಲಗ್ನದಿಂದ 12ನೇ ಭಾವದಲ್ಲಿ ಮಂಗಳ → ಮಂಗಳ ದೋಷ ಇದೆ', gu: 'લગ્નથી 12મા ભાવ મંગળ → મંગળ દોષ ઉપસ્થિત', mai: 'लग्नसँ 12म भावमे मंगल → मंगल दोष उपस्थित अछि', mr: 'लग्नापासून 12 व्या भावात मंगळ → मंगल दोष आहे' }, locale)}</p>
            <p>{tl({ en: 'Mercury + Venus in Leo (11th) → Dhana Yoga (gains house)', hi: 'बुध + शुक्र सिंह (11वाँ) में → धन योग (लाभ भाव)', sa: 'बुध-शुक्रौ सिंहे (एकादशे) → धनयोगः (लाभभावः)', ta: 'புதன் + சுக்கிரன் சிம்மத்தில் (11ஆவது) → தன யோகம் (லாப இல்லம்)', te: 'బుధ + శుక్రుడు సింహంలో (11వ) → ధన యోగం (లాభ భావం)', bn: 'বুধ + শুক্র সিংহে (11তম) → ধন যোগ (লাভ ভাব)', kn: 'ಬುಧ + ಶುಕ್ರ ಸಿಂಹದಲ್ಲಿ (11ನೇ) → ಧನ ಯೋಗ (ಲಾಭ ಭಾವ)', gu: 'બુધ + શુક્ર સિંહ (11મો) → ધન યોગ (લાભ ભાવ)', mai: 'बुध + शुक्र सिंह (11म) मे → धन योग (लाभ भाव)', mr: 'बुध + शुक्र सिंह (11 वा) मध्ये → धन योग (लाभ भाव)' }, locale)}</p>
            <p>{tl({ en: 'Saturn in own sign Aquarius → strong 5th house (intelligence)', hi: 'शनि स्वराशि कुम्भ में → शक्तिशाली 5वाँ भाव (बुद्धि)', sa: 'स्वराशौ कुम्भे शनिः → सबलं पञ्चमभावः (बुद्धिः)', ta: 'சனி சொந்த ராசி கும்பத்தில் → வலிமையான 5ஆம் இல்லம் (அறிவு)', te: 'శని స్వరాశి కుంభంలో → బలమైన 5వ భావం (బుద్ధి)', bn: 'শনি স্বরাশি কুম্ভে → শক্তিশালী 5ম ভাব (বুদ্ধিমত্তা)', kn: 'ಶನಿ ಸ್ವರಾಶಿ ಕುಂಭದಲ್ಲಿ → ಬಲವಾದ 5ನೇ ಭಾವ (ಬುದ್ಧಿ)', gu: 'શનિ સ્વ-રાશિ કુંભ → બળવાન 5મો ભાવ (બુદ્ધિ)', mai: 'स्वराशि कुम्भमे शनि → शक्तिशाली 5म भाव (बुद्धि)', mr: 'स्वराशी कुंभात शनी → मजबूत 5 वा भाव (बुद्धी)' }, locale)}</p>
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
