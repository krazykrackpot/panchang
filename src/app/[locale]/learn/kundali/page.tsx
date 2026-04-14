'use client';


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
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{t('dateLabel')}</div>
              <div className="text-gold-light font-bold text-lg">15 Aug 1995</div>
            </div>
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{t('timeLabel')}</div>
              <div className="text-gold-light font-bold text-lg">10:30 AM IST</div>
            </div>
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{t('placeLabel')}</div>
              <div className="text-gold-light font-bold text-lg">{t('exampleCity')}</div>
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
          <p className="text-gold-light font-mono text-sm mb-3">{t('forOurExample')}</p>
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
          <p className="text-gold-light font-mono text-sm mb-3">{t('forOurExample')}</p>
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
          <p className="text-gold-light font-mono text-sm mb-3">{t('forOurExample')}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">Lagna° = atan2(sin(LST), cos(LST)·cos(ε) - tan(φ)·sin(ε))</p>
            <p className="text-gold-light/80 font-mono text-xs">where ε = 23.44° (obliquity), φ = 28.61° (Delhi latitude)</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">Tropical Lagna ≈ 207.5°  <span className="text-gold-light/40">// Scorpio in tropical</span></p>
            <p className="text-gold-light/80 font-mono text-xs">Ayanamsha (1995) ≈ 23.8°</p>
            <p className="text-gold-light/80 font-mono text-xs font-bold text-gold-light">Sidereal Lagna ≈ 183.7° = <span className="text-emerald-400">Tula (Libra)</span> 3°42&apos;</p>
          </div>
          <p className="text-text-secondary/75 text-xs mt-3 italic">
            {t('tulaRisingNote')}
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
            {t('westerVsVedicNote')}
          </p>
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/calculations" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {t('seeFullDerivation')} →
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
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{t('thGraha')}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{t('thSidereal')}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{t('thRashi')}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs hidden sm:table-cell">{t('thNakshatra')}</th>
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
            {t('learnAllGrahas')} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 7: House Mapping ─── */}
      <LessonSection number={7} title={t('s7Title')}>
        <p>{t('s7Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{t('houseFormula')}</p>
          <p className="text-gold-light/80 font-mono text-xs">House = (Planet_Rashi_Number - Lagna_Rashi_Number + 12) % 12 + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {t('houseFormulaExample')}
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
            {t('deepDiveHouses')} →
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
          <p className="text-gold-light font-mono text-sm mb-2">{t('readingTheChart')}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{t('chartNote1')}</p>
            <p>{t('chartNote2')}</p>
            <p>{t('chartNote3')}</p>
            <p>{t('chartNote4')}</p>
            <p>{t('chartNote5')}</p>
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
          <p className="text-gold-light font-mono text-sm mb-2">{t('dignityHierarchy')}</p>
          <p className="text-gold-light/80 font-mono text-xs">
            {t('dignityHierarchyList')}
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
          <p className="text-gold-light font-mono text-sm mb-2">{t('inOurExample')}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{t('aspectEx1')}</p>
            <p>{t('aspectEx2')}</p>
            <p>{t('aspectEx3')}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 11: Dashas ─── */}
      <LessonSection number={11} title={t('s11Title')}>
        <p>{t('s11Text')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{t('inOurExample')}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">{t('dashaMoonPosition')}</p>
            <p className="text-gold-light/80 font-mono text-xs">{t('dashaLord')}</p>
            <p className="text-gold-light/80 font-mono text-xs">{t('dashaVenusDuration')}</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">{t('dashaProgress')}</p>
            <p className="text-gold-light/80 font-mono text-xs">{t('dashaSpan')}</p>
            <p className="text-gold-light/80 font-mono text-xs">{t('dashaRemaining')}</p>
            <p className="text-gold-light/60 font-mono text-xs mt-2">{t('dashaAfterVenus')}</p>
          </div>
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/dashas" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {t('completeDasha')} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 12: Yogas & Doshas ─── */}
      <LessonSection number={12} title={t('s12Title')}>
        <p>{t('s12Text')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg p-4 border border-emerald-400/20 bg-emerald-400/5">
            <h4 className="text-emerald-400 font-bold text-sm mb-2">{t('yogasLabel')}</h4>
            <ul className="space-y-1 text-text-secondary text-xs">
              <li>{t('yoga1')}</li>
              <li>{t('yoga2')}</li>
              <li>{t('yoga3')}</li>
            </ul>
          </div>
          <div className="rounded-lg p-4 border border-red-400/20 bg-red-400/5">
            <h4 className="text-red-400 font-bold text-sm mb-2">{t('doshasLabel')}</h4>
            <ul className="space-y-1 text-text-secondary text-xs">
              <li>{t('dosha1')}</li>
              <li>{t('dosha2')}</li>
              <li>{t('dosha3')}</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{t('inOurExample')}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{t('yogaEx1')}</p>
            <p>{t('yogaEx2')}</p>
            <p>{t('yogaEx3')}</p>
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
