'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import BeginnerNote from '@/components/learn/BeginnerNote';
import ClassicalReference from '@/components/learn/ClassicalReference';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/vivah-muhurta.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;

export default function LearnVivahMuhurtaPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const bodyFont = getBodyFont(locale);
  const headingFont = getHeadingFont(locale);
  const isIndic = isIndicLocale(locale);

  const takeawayPoints = (LJ.takeawayPoints as unknown as LocaleText[]).map(
    (pt) => lt(pt, locale)
  );

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' as const }}
          className="mb-10"
        >
          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3"
            style={headingFont}
          >
            {t('title')}
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed" style={bodyFont || undefined}>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Beginner Notes */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-6">
          <BeginnerNote
            term="Muhurta"
            explanation="Electional astrology  –  choosing an auspicious time for an important activity based on planetary positions"
          />
          <BeginnerNote
            term="Nakshatra"
            explanation="One of 27 lunar mansions  –  segments of the zodiac the Moon passes through, each with a distinct deity and energy"
          />
          <BeginnerNote
            term="Tithi"
            explanation="A lunar day  –  determined by the angular distance between the Sun and Moon. There are 30 tithis in a lunar month"
          />
          <BeginnerNote
            term="Lagna"
            explanation="The ascendant or rising sign  –  the zodiac sign on the eastern horizon at the moment of the ceremony"
          />
          <BeginnerNote
            term="Asta (Combustion)"
            explanation="When a planet comes too close to the Sun and becomes invisible, its energy is considered weakened or suppressed"
          />
          <BeginnerNote
            term="Karana"
            explanation="A half-tithi  –  each tithi has two karanas. Some karanas carry severe classical warnings for marriage"
          />
        </div>

        {/* Section 1: Introduction */}
        <LessonSection number={1} title={t('introTitle')}>
          <p style={bodyFont || undefined}>{t('introContent1')}</p>
          <p className="mt-3" style={bodyFont || undefined}>{t('introContent2')}</p>

          <WhyItMatters locale={locale}>
            {isIndic
              ? 'विवाह मुहूर्त चयन मनमानी अंधविश्वास नहीं है  –  यह एक कठोर बहु-कारक विश्लेषण है जो शास्त्रीय ग्रंथों, खगोलीय गणना और पीढ़ियों के अनुभव पर आधारित है। प्रत्येक नियम के पीछे एक स्पष्ट ऊर्जात्मक तर्क है।'
              : 'Marriage muhurta selection is not arbitrary superstition  –  it is a rigorous multi-factor analysis grounded in classical texts, astronomical computation, and generations of observational experience. Every rule has a clear energetic rationale behind it.'}
          </WhyItMatters>

          <div className="mt-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-amber-300 text-sm font-semibold mb-1">
              {isIndic ? 'महत्वपूर्ण नोट' : 'Important Note'}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
              {t('introContent3')}
            </p>
          </div>
        </LessonSection>

        {/* Section 2: Solar Month Foundation */}
        <LessonSection number={2} title={t('solarTitle')}>
          <ClassicalReference shortName="MC" chapter="Ch. 4-5" topic="Solar month suitability for Vivah Muhurta  –  Kharmas, Malamas, and seasonal prohibitions" />
          <p style={bodyFont || undefined}>{t('solarContent1')}</p>
          <p className="mt-3" style={bodyFont || undefined}>{t('solarContent2')}</p>

          <div className="mt-5 overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">
                    {isIndic ? 'सौर राशि' : 'Solar Sign'}
                  </th>
                  <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">
                    {isIndic ? 'अनुमानित अवधि' : 'Approx. Period'}
                  </th>
                  <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">
                    {isIndic ? 'स्थिति' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/5 text-text-secondary">
                {[
                  { sign: isIndic ? 'मेष (Aries)' : 'Mesha (Aries)', period: 'Apr-May', status: 'allowed', color: 'text-emerald-400' },
                  { sign: isIndic ? 'वृषभ (Taurus)' : 'Vrishabha (Taurus)', period: 'May-Jun', status: 'allowed', color: 'text-emerald-400' },
                  { sign: isIndic ? 'मिथुन (Gemini)' : 'Mithuna (Gemini)', period: 'Jun-Jul', status: 'allowed', color: 'text-emerald-400' },
                  { sign: isIndic ? 'कर्क (Cancer)' : 'Karka (Cancer)', period: 'Jul-Aug', status: 'prohibited', color: 'text-red-400' },
                  { sign: isIndic ? 'सिंह (Leo)' : 'Simha (Leo)', period: 'Aug-Sep', status: 'prohibited', color: 'text-red-400' },
                  { sign: isIndic ? 'कन्या (Virgo)' : 'Kanya (Virgo)', period: 'Sep-Oct', status: 'prohibited', color: 'text-red-400' },
                  { sign: isIndic ? 'तुला (Libra)' : 'Tula (Libra)', period: 'Oct-Nov', status: 'prohibited', color: 'text-red-400' },
                  { sign: isIndic ? 'वृश्चिक (Scorpio)' : 'Vrishchika (Scorpio)', period: 'Nov-Dec', status: 'allowed', color: 'text-emerald-400' },
                  { sign: isIndic ? 'धनु (Sagittarius)' : 'Dhanu (Sagittarius)', period: 'Dec-Jan', status: 'kharmas', color: 'text-red-400' },
                  { sign: isIndic ? 'मकर (Capricorn)' : 'Makara (Capricorn)', period: 'Jan-Feb', status: 'allowed', color: 'text-emerald-400' },
                  { sign: isIndic ? 'कुम्भ (Aquarius)' : 'Kumbha (Aquarius)', period: 'Feb-Mar', status: 'allowed', color: 'text-emerald-400' },
                  { sign: isIndic ? 'मीन (Pisces)' : 'Meena (Pisces)', period: 'Mar-Apr', status: 'kharmas', color: 'text-red-400' },
                ].map((row) => (
                  <tr key={row.sign}>
                    <td className="py-1.5 px-3">{row.sign}</td>
                    <td className="py-1.5 px-3 text-text-secondary/70">{row.period}</td>
                    <td className={`py-1.5 px-3 font-semibold ${row.color}`}>
                      {row.status === 'allowed'
                        ? (isIndic ? 'अनुमत' : 'Allowed')
                        : row.status === 'kharmas'
                          ? (isIndic ? 'खरमास' : 'Kharmas')
                          : (isIndic ? 'निषिद्ध' : 'Prohibited')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-4 rounded-lg bg-bg-primary/50 border border-emerald-400/10">
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('solarAllowed')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-bg-primary/50 border border-red-500/10">
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('solarProhibited')}
              </p>
            </div>
          </div>
        </LessonSection>

        {/* Section 3: Lunar Month Prohibitions */}
        <LessonSection number={3} title={t('lunarTitle')}>
          <ClassicalReference shortName="Dharmasindhu" chapter="Samskara Prakarana" topic="Adhika Masa, Kshaya Masa, and Chaturmas prohibitions for Vivah" />
          <p style={bodyFont || undefined}>{t('lunarContent')}</p>

          <div className="mt-5 space-y-4">
            {[
              { key: 'lunarAdhika', color: 'border-red-500/15 bg-red-500/5' },
              { key: 'lunarKshaya', color: 'border-red-500/10 bg-red-500/3' },
              { key: 'lunarChaturmas', color: 'border-amber-500/15 bg-amber-500/5' },
              { key: 'lunarPitra', color: 'border-purple-400/15 bg-purple-400/5' },
            ].map((item) => (
              <div key={item.key} className={`p-4 rounded-lg border ${item.color}`}>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(item.key)}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 4: 11 Auspicious Nakshatras */}
        <LessonSection number={4} title={t('nakshatraGoodTitle')}>
          <ClassicalReference shortName="MC" chapter="Ch. 7" topic="Nakshatra suitability for Vivah  –  the 11 classically approved lunar mansions" />
          <ClassicalReference shortName="B.V. Raman" chapter="Muhurtha" topic="Nakshatra classification for marriage elections" />
          <p style={bodyFont || undefined}>{t('nakshatraGoodContent')}</p>

          <div className="mt-5 space-y-3">
            {[
              { key: 'nakRohini', id: 4, color: 'border-emerald-500/20 bg-emerald-500/5' },
              { key: 'nakMrigashira', id: 5, color: 'border-emerald-400/15 bg-emerald-400/3' },
              { key: 'nakMagha', id: 10, color: 'border-gold-primary/20 bg-gold-primary/5' },
              { key: 'nakUttaraPhalguni', id: 12, color: 'border-gold-primary/20 bg-gold-primary/5' },
              { key: 'nakHasta', id: 13, color: 'border-emerald-400/15 bg-emerald-400/3' },
              { key: 'nakSwati', id: 15, color: 'border-emerald-400/15 bg-emerald-400/3' },
              { key: 'nakAnuradha', id: 17, color: 'border-emerald-500/20 bg-emerald-500/5' },
              { key: 'nakMoola', id: 19, color: 'border-gold-primary/20 bg-gold-primary/5' },
              { key: 'nakUttarashada', id: 21, color: 'border-emerald-400/15 bg-emerald-400/3' },
              { key: 'nakUttaraBhadrapada', id: 26, color: 'border-emerald-400/15 bg-emerald-400/3' },
              { key: 'nakRevati', id: 27, color: 'border-emerald-500/20 bg-emerald-500/5' },
            ].map((nak) => (
              <div key={nak.key} className={`p-4 rounded-xl border ${nak.color}`}>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(nak.key)}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 5: Moderate and Prohibited Nakshatras */}
        <LessonSection number={5} title={t('nakshatraBadTitle')}>
          <ClassicalReference shortName="MC" chapter="Ch. 7" topic="Nakshatra prohibitions for marriage  –  classical warnings and severity levels" />
          <p style={bodyFont || undefined}>{t('nakshatraBadContent')}</p>

          {/* Moderate */}
          <div className="mt-5 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-amber-300 text-sm font-semibold mb-2">
              {isIndic ? 'मध्यम  –  सशर्त स्वीकार्य' : 'Moderate  –  Conditionally Acceptable'}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
              {t('nakModerate')}
            </p>
          </div>

          {/* Prohibited list */}
          <div className="mt-5 space-y-3">
            <p className="text-red-300 text-xs uppercase tracking-widest font-bold">
              {isIndic ? 'निषिद्ध नक्षत्र' : 'Prohibited Nakshatras'}
            </p>
            {[
              'nakBharani', 'nakKrittika', 'nakArdra', 'nakPunarvasu', 'nakPushya',
              'nakAshlesha', 'nakPurvaPhalguni', 'nakVishakha', 'nakJyeshtha',
              'nakPurvaAshadha', 'nakShatabhisha', 'nakPurvaBhadrapada',
            ].map((key) => (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/50 border border-red-500/10">
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 6: Tithis */}
        <LessonSection number={6} title={t('tithiTitle')}>
          <p style={bodyFont || undefined}>{t('tithiContent')}</p>

          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-emerald-300 text-sm font-semibold mb-2">
                {isIndic ? 'शुभ तिथियाँ' : 'Auspicious Tithis'}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('tithiGood')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-red-300 text-sm font-semibold mb-2">
                {isIndic ? 'अशुभ तिथियाँ' : 'Tithis to Avoid'}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('tithiBad')}
              </p>
            </div>
          </div>
        </LessonSection>

        {/* Section 7: Weekdays */}
        <LessonSection number={7} title={t('weekdayTitle')}>
          <p style={bodyFont || undefined}>{t('weekdayContent')}</p>

          <div className="mt-5 grid gap-3">
            {[
              { key: 'weekdayBest', label: isIndic ? 'सर्वश्रेष्ठ' : 'Best', color: 'border-emerald-500/20 bg-emerald-500/5' },
              { key: 'weekdayModerate', label: isIndic ? 'मध्यम' : 'Moderate', color: 'border-amber-500/20 bg-amber-500/5' },
              { key: 'weekdayAvoid', label: isIndic ? 'टालें' : 'Avoid', color: 'border-red-500/20 bg-red-500/5' },
            ].map((item) => (
              <div key={item.key} className={`p-4 rounded-lg border ${item.color}`}>
                <span className="text-gold-light text-xs uppercase tracking-wider font-bold">{item.label}</span>
                <p className="text-text-secondary text-sm leading-relaxed mt-2" style={bodyFont || undefined}>
                  {t(item.key)}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 8: Venus and Jupiter Combustion */}
        <LessonSection number={8} title={t('combustionTitle')}>
          <ClassicalReference shortName="BPHS" chapter="Ch. 3" topic="Planetary combustion (Asta) orbs  –  proximity thresholds for Shukra and Guru" />
          <p style={bodyFont || undefined}>{t('combustionContent1')}</p>

          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-pink-400/60" />
                <span className="text-pink-300 font-bold text-sm">{isIndic ? 'शुक्र अस्त' : 'Venus Combustion'}</span>
                <span className="text-text-secondary/50 text-xs ml-auto">10° (8° {isIndic ? 'वक्री' : 'retrograde'})</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('combustionVenus')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-amber-400/60" />
                <span className="text-amber-300 font-bold text-sm">{isIndic ? 'गुरु अस्त' : 'Jupiter Combustion'}</span>
                <span className="text-text-secondary/50 text-xs ml-auto">11°</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('combustionJupiter')}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full font-bold uppercase">
                {isIndic ? 'कठोर निषेध' : 'Hard Prohibition'}
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
              {t('combustionHard')}
            </p>
          </div>
        </LessonSection>

        {/* Section 9: Prohibited Karanas */}
        <LessonSection number={9} title={t('karanaTitle')}>
          <ClassicalReference shortName="MC" chapter="Ch. 6" topic="Karana suitability for marriage  –  Vishti Bhadra severity by Moon's sign modality" />
          <p style={bodyFont || undefined}>{t('karanaContent')}</p>

          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/15">
              <p className="text-red-300 text-sm font-semibold mb-2">
                {isIndic ? 'विष्टि (भद्रा)' : 'Vishti (Bhadra)'}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('karanaVishti')}
              </p>
              {/* Vishti severity table */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded border border-red-500/20 bg-red-500/5">
                  <span className="text-red-400 font-bold">{isIndic ? 'मुख' : 'Mukha'}</span>
                  <p className="text-text-secondary mt-1">{isIndic ? 'चर राशि  –  सर्वाधिक खतरनाक' : 'Movable sign  –  most dangerous'}</p>
                </div>
                <div className="p-2 rounded border border-amber-500/20 bg-amber-500/5">
                  <span className="text-amber-400 font-bold">{isIndic ? 'मध्य' : 'Madhya'}</span>
                  <p className="text-text-secondary mt-1">{isIndic ? 'स्थिर राशि  –  मध्यम' : 'Fixed sign  –  moderate'}</p>
                </div>
                <div className="p-2 rounded border border-gold-primary/20 bg-gold-primary/5">
                  <span className="text-gold-light font-bold">{isIndic ? 'पुच्छ' : 'Puchha'}</span>
                  <p className="text-text-secondary mt-1">{isIndic ? 'द्विस्वभाव  –  न्यूनतम' : 'Dual sign  –  least dangerous'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-bg-primary/50 border border-red-500/10">
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('karanaSthira')}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
              <p className="text-emerald-300 text-sm font-semibold mb-1">
                {isIndic ? 'अनुकूल करण' : 'Favourable Karanas'}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('karanaGood')}
              </p>
            </div>
          </div>
        </LessonSection>

        {/* Section 10: Lagna Selection */}
        <LessonSection number={10} title={t('lagnaTitle')}>
          <ClassicalReference shortName="BPHS" chapter="Ch. 6-7" topic="Lagna Shuddhi  –  ascendant selection rules for Vivah Muhurta" />
          <ClassicalReference shortName="B.V. Raman" chapter="Muhurtha Ch. 11" topic="Marriage lagna selection and 7th house vacancy rule" />
          <p style={bodyFont || undefined}>{t('lagnaContent')}</p>

          <div className="mt-5 grid gap-3">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-emerald-300 text-sm font-semibold mb-2">
                {isIndic ? 'सर्वश्रेष्ठ  –  \"तीन सर्वोत्तम\"' : 'Best  –  The "Big Three"'}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('lagnaBest')}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
              <p className="text-gold-light text-sm font-semibold mb-2">
                {isIndic ? 'अच्छे लग्न' : 'Good Lagnas'}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('lagnaGood')}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
              <p className="text-red-300 text-sm font-semibold mb-2">
                {isIndic ? 'टालें' : 'Avoid'}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('lagnaAvoid')}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('lagnaHouse7')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('lagnaOther')}
              </p>
            </div>
          </div>
        </LessonSection>

        {/* Section 11: Special Yogas */}
        <LessonSection number={11} title={t('yogaTitle')}>
          <ClassicalReference shortName="BS" chapter="Ch. 100-104" topic="Godhuli Lagna, Abhijit Muhurta, and special yogas for marriage elections" />
          <p style={bodyFont || undefined}>{t('yogaContent')}</p>

          <div className="mt-5 space-y-4">
            {[
              { key: 'yogaGodhuli', color: 'border-gold-primary/30 bg-gold-primary/5', label: isIndic ? 'गोधूलि लग्न' : 'Godhuli Lagna' },
              { key: 'yogaAbhijit', color: 'border-emerald-400/20 bg-emerald-400/5', label: isIndic ? 'अभिजित मुहूर्त' : 'Abhijit Muhurta' },
              { key: 'yogaSarvartha', color: 'border-indigo-400/20 bg-indigo-400/5', label: isIndic ? 'सर्वार्थ / अमृत सिद्धि' : 'Sarvartha / Amrit Siddhi' },
              { key: 'yogaSinghast', color: 'border-amber-500/15 bg-amber-500/5', label: isIndic ? 'सिंहस्थ गुरु' : 'Singhast Guru' },
              { key: 'yogaHolashtak', color: 'border-amber-500/15 bg-amber-500/5', label: isIndic ? 'होलाष्टक' : 'Holashtak' },
            ].map((item) => (
              <div key={item.key} className={`p-4 rounded-lg border ${item.color}`}>
                <p className="text-gold-light text-sm font-semibold mb-1">{item.label}</p>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(item.key)}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 12: Selection Hierarchy */}
        <LessonSection number={12} title={t('hierarchyTitle')}>
          <p style={bodyFont || undefined}>{t('hierarchyContent')}</p>

          <div className="mt-5 space-y-2">
            {[
              { key: 'hierarchyStep1', num: 1, color: 'border-red-500/15' },
              { key: 'hierarchyStep2', num: 2, color: 'border-red-500/12' },
              { key: 'hierarchyStep3', num: 3, color: 'border-amber-500/15' },
              { key: 'hierarchyStep4', num: 4, color: 'border-emerald-400/15' },
              { key: 'hierarchyStep5', num: 5, color: 'border-emerald-400/12' },
              { key: 'hierarchyStep6', num: 6, color: 'border-gold-primary/15' },
              { key: 'hierarchyStep7', num: 7, color: 'border-indigo-400/15' },
              { key: 'hierarchyStep8', num: 8, color: 'border-purple-400/15' },
            ].map((step) => (
              <div key={step.key} className={`rounded-lg border p-3 bg-bg-primary/50 ${step.color}`}>
                <div className="flex items-start gap-3">
                  <span className="text-gold-primary font-bold text-sm w-5 shrink-0">{step.num}</span>
                  <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                    {t(step.key)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 13: Practical Guidance */}
        <LessonSection number={13} title={t('practicalTitle')}>
          <p style={bodyFont || undefined}>{t('practicalContent')}</p>

          <div className="mt-5 space-y-4">
            {(['practicalTimeline', 'practicalWeekend', 'practicalAstrologer', 'practicalExpectations'] as const).map((key) => (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 14: Key Takeaways */}
        <LessonSection number={14} title={isIndic ? 'मुख्य बिन्दु' : 'Key Takeaways'}>
          <KeyTakeaway locale={locale} points={takeawayPoints} />
        </LessonSection>

        {/* Explore Further */}
        <div className="mt-10 space-y-3">
          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
            {t('exploreTitle')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                label: isIndic ? 'मुहूर्त AI  –  शुभ समय खोजें' : 'Muhurta AI  –  Find Auspicious Dates',
                href: '/muhurta-ai' as const,
                color: 'border-emerald-500/20 hover:border-emerald-500/40',
              },
              {
                label: isIndic ? 'मुहूर्त सीखें' : 'Learn Muhurtas',
                href: '/learn/muhurtas' as const,
                color: 'border-blue-500/20 hover:border-blue-500/40',
              },
              {
                label: isIndic ? 'नक्षत्र सीखें' : 'Learn Nakshatras',
                href: '/learn/nakshatras' as const,
                color: 'border-blue-500/20 hover:border-blue-500/40',
              },
              {
                label: isIndic ? 'तिथि सीखें' : 'Learn Tithis',
                href: '/learn/tithis' as const,
                color: 'border-blue-500/20 hover:border-blue-500/40',
              },
              {
                label: isIndic ? 'अष्टकूट मिलान' : 'Compatibility Matching',
                href: '/matching' as const,
                color: 'border-gold-primary/20 hover:border-gold-primary/40',
              },
              {
                label: isIndic ? 'सीजेरियन मुहूर्त' : 'Caesarean Muhurta Guide',
                href: '/learn/caesarean-muhurta' as const,
                color: 'border-gold-primary/20 hover:border-gold-primary/40',
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-lg p-3 border ${link.color} transition-colors text-sm text-gold-light hover:bg-gold-primary/5`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
