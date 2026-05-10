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
import LJ from '@/messages/learn/caesarean-muhurta.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;

export default function LearnCaesareanMuhurtaPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const bodyFont = getBodyFont(locale);
  const headingFont = getHeadingFont(locale);
  const isIndic = isIndicLocale(locale);

  // takeawayPoints is an array of LocaleText  –  resolve each to the current locale
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
            term="Lagna"
            explanation="The ascendant or rising sign  –  the zodiac sign on the eastern horizon at the moment of birth"
          />
          <BeginnerNote
            term="Gandanta"
            explanation="The junction of water and fire signs (Cancer-Leo, Scorpio-Sagittarius, Pisces-Aries)  –  classically the most dangerous zone for the Moon at birth"
          />
          <BeginnerNote
            term="Vimshottari Dasha"
            explanation="The 120-year planetary period system used in Vedic astrology  –  the starting dasha at birth is determined by the Moon's nakshatra"
          />
        </div>

        {/* Section 1: Introduction */}
        <LessonSection number={1} title={t('introTitle')}>
          <p style={bodyFont || undefined}>{t('introContent')}</p>
          <p style={bodyFont || undefined}>{t('introContent2')}</p>
          <div className="mt-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-amber-300 text-sm font-semibold mb-1">
              {isIndic ? 'चिकित्सा अस्वीकरण' : 'Medical Disclaimer'}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
              {t('introDisclaimer')}
            </p>
          </div>
        </LessonSection>

        {/* Section 2: The 5 Pillars Overview */}
        <LessonSection number={2} title={t('pillarsTitle')}>
          <p style={bodyFont || undefined}>{t('pillarsContent')}</p>
          <div className="mt-6 grid gap-3">
            {[
              { name: 'pillar1', color: 'border-gold-primary/30 bg-gold-primary/5' },
              { name: 'pillar2', color: 'border-indigo-400/30 bg-indigo-400/5' },
              { name: 'pillar3', color: 'border-emerald-400/30 bg-emerald-400/5' },
              { name: 'pillar4', color: 'border-purple-400/30 bg-purple-400/5' },
              { name: 'pillar5', color: 'border-red-400/30 bg-red-400/5' },
            ].map((pillar, i) => (
              <div
                key={pillar.name}
                className={`rounded-lg border p-4 ${pillar.color}`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-gold-light font-bold text-sm" style={bodyFont || undefined}>
                    {i + 1}. {t(`${pillar.name}Name`)}
                  </span>
                  <span className="text-text-secondary text-xs">
                    {t(`${pillar.name}Pts`)}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(`${pillar.name}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 3: Lagna Strength */}
        <LessonSection number={3} title={t('lagnaTitle')}>
          <ClassicalReference shortName="BPHS" chapter="Ch. 6-7" topic="Lagna Shuddhi  –  rules for ascendant strength and dignity evaluation" />
          <p style={bodyFont || undefined}>{t('lagnaContent')}</p>

          <div className="mt-5 space-y-4">
            {(['lagnaLordDignity', 'lagnaLordHouse', 'lagnaBenefic', 'lagnaMalefic', 'lagnaPushkar', 'lagnaSandhi'] as const).map((key) => (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(key)}
                </p>
              </div>
            ))}
          </div>

          {/* Dignity scoring table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">
                    {isIndic ? 'गरिमा' : 'Dignity'}
                  </th>
                  <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">
                    {isIndic ? 'अंक' : 'Points'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/5 text-text-secondary">
                <tr><td className="py-1.5 px-3">{isIndic ? 'उच्च' : 'Exalted'}</td><td className="py-1.5 px-3 text-emerald-400 font-bold">10</td></tr>
                <tr><td className="py-1.5 px-3">{isIndic ? 'मूलत्रिकोण' : 'Moolatrikona'}</td><td className="py-1.5 px-3 text-emerald-400 font-bold">9</td></tr>
                <tr><td className="py-1.5 px-3">{isIndic ? 'स्वराशि' : 'Own Sign'}</td><td className="py-1.5 px-3 text-emerald-400 font-bold">8</td></tr>
                <tr><td className="py-1.5 px-3">{isIndic ? 'मित्र राशि' : 'Friendly Sign'}</td><td className="py-1.5 px-3 text-gold-light">6</td></tr>
                <tr><td className="py-1.5 px-3">{isIndic ? 'सम' : 'Neutral'}</td><td className="py-1.5 px-3 text-amber-400">4</td></tr>
                <tr><td className="py-1.5 px-3">{isIndic ? 'शत्रु राशि' : 'Enemy Sign'}</td><td className="py-1.5 px-3 text-red-400">2</td></tr>
                <tr><td className="py-1.5 px-3">{isIndic ? 'नीच' : 'Debilitated'}</td><td className="py-1.5 px-3 text-red-500 font-bold">0</td></tr>
              </tbody>
            </table>
          </div>
        </LessonSection>

        {/* Section 4: Moon's Role at Birth */}
        <LessonSection number={4} title={t('moonTitle')}>
          <ClassicalReference shortName="MC" chapter="Ch. 1-3" topic="Lunar strength for birth elections, paksha bala, nakshatra gana classification" />
          <p style={bodyFont || undefined}>{t('moonContent')}</p>

          <div className="mt-5 space-y-4">
            {(['moonHouse', 'moonPaksha', 'moonNakshatra', 'moonJupiterAspect'] as const).map((key) => (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/50 border border-indigo-400/10">
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(key)}
                </p>
              </div>
            ))}
          </div>

          {/* Gandanta explanation */}
          <div className="mt-5 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <p className="text-red-300 text-sm font-semibold mb-2">
              {isIndic ? 'गंडांत  –  कठोर निषेध क्षेत्र' : 'Gandanta  –  Hard Veto Zones'}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
              {t('gandantaExplain')}
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { water: isIndic ? 'मीन' : 'Pisces', fire: isIndic ? 'मेष' : 'Aries', nak: 'Revati 4 → Ashwini 1' },
                { water: isIndic ? 'कर्क' : 'Cancer', fire: isIndic ? 'सिंह' : 'Leo', nak: 'Ashlesha 4 → Magha 1' },
                { water: isIndic ? 'वृश्चिक' : 'Scorpio', fire: isIndic ? 'धनु' : 'Sagittarius', nak: 'Jyeshtha 4 → Moola 1' },
              ].map((g) => (
                <div key={g.nak} className="rounded-lg border border-red-500/15 p-3 bg-red-500/5">
                  <p className="text-red-300 text-xs font-bold">{g.water} → {g.fire}</p>
                  <p className="text-text-secondary text-xs mt-1">{g.nak}</p>
                </div>
              ))}
            </div>
          </div>
        </LessonSection>

        {/* Section 5: Janma Nakshatra Doshas */}
        <LessonSection number={5} title={t('nakshatraDoshaTitle')}>
          <ClassicalReference shortName="MC" chapter="Ch. 4" topic="Janma Nakshatra Dosha  –  classical warnings for specific nakshatras and padas" />
          <p style={bodyFont || undefined}>{t('nakshatraDoshaContent')}</p>

          <div className="mt-5 overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">
                    {isIndic ? 'नक्षत्र' : 'Nakshatra'}
                  </th>
                  <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">
                    {isIndic ? 'पद' : 'Pada'}
                  </th>
                  <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">
                    {isIndic ? 'शास्त्रीय चिंता' : 'Classical Concern'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/5 text-text-secondary">
                <tr>
                  <td className="py-2 px-3 text-red-300 font-semibold">{isIndic ? 'आश्लेषा' : 'Ashlesha'} (9)</td>
                  <td className="py-2 px-3">4th</td>
                  <td className="py-2 px-3">{isIndic ? 'माता' : 'Mother'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-red-300 font-semibold">{isIndic ? 'मघा' : 'Magha'} (10)</td>
                  <td className="py-2 px-3">1st</td>
                  <td className="py-2 px-3">{isIndic ? 'पिता' : 'Father'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-red-300 font-semibold">{isIndic ? 'ज्येष्ठा' : 'Jyeshtha'} (18)</td>
                  <td className="py-2 px-3">4th</td>
                  <td className="py-2 px-3">{isIndic ? 'बड़ा भाई' : 'Elder brother'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-red-300 font-semibold">{isIndic ? 'मूल' : 'Moola'} (19)</td>
                  <td className="py-2 px-3">1st</td>
                  <td className="py-2 px-3">{isIndic ? 'पिता / परिवार' : 'Father / family'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-3">
            {(['nakshatraDoshaAshlesha', 'nakshatraDoshaMagha', 'nakshatraDoshaJyeshtha', 'nakshatraDoshaMoola', 'nakshatraDoshaMild'] as const).map((key) => (
              <div key={key} className="p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/8">
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 6: Benefic/Malefic Distribution */}
        <LessonSection number={6} title={t('distributionTitle')}>
          <ClassicalReference shortName="BPHS" chapter="Ch. 11" topic="Benefic and malefic planet placement  –  kendras, trikonas, upachaya houses" />
          <p style={bodyFont || undefined}>{t('distributionContent')}</p>

          <div className="mt-5 space-y-4">
            {(['distributionBeneficKendra', 'distributionBeneficTrikona', 'distributionMaleficUpachaya', 'distribution8thHouse'] as const).map((key) => (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/50 border border-emerald-400/10">
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(key)}
                </p>
              </div>
            ))}
          </div>

          {/* Ideal chart diagram */}
          <div className="mt-5 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-emerald-300 text-sm font-semibold mb-2">
              {isIndic ? 'आदर्श विन्यास' : 'The Ideal Layout'}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded border border-emerald-500/15 bg-emerald-500/5">
                <span className="text-emerald-400 font-bold">{isIndic ? 'केंद्र (1,4,7,10)' : 'Kendras (1,4,7,10)'}</span>
                <p className="text-text-secondary mt-1">{isIndic ? 'गुरु, शुक्र, बुध, शुक्ल चंद्र' : 'Jupiter, Venus, Mercury, Waxing Moon'}</p>
              </div>
              <div className="p-2 rounded border border-emerald-500/15 bg-emerald-500/5">
                <span className="text-emerald-400 font-bold">{isIndic ? 'त्रिकोण (5,9)' : 'Trikonas (5,9)'}</span>
                <p className="text-text-secondary mt-1">{isIndic ? 'शुभ ग्रह' : 'Benefic planets'}</p>
              </div>
              <div className="p-2 rounded border border-amber-500/15 bg-amber-500/5">
                <span className="text-amber-400 font-bold">{isIndic ? 'उपचय (3,6,11)' : 'Upachaya (3,6,11)'}</span>
                <p className="text-text-secondary mt-1">{isIndic ? 'शनि, मंगल, राहु, केतु' : 'Saturn, Mars, Rahu, Ketu'}</p>
              </div>
              <div className="p-2 rounded border border-gold-primary/15 bg-gold-primary/5">
                <span className="text-gold-light font-bold">{isIndic ? '8वाँ भाव' : '8th House'}</span>
                <p className="text-text-secondary mt-1">{isIndic ? 'खाली = सर्वश्रेष्ठ' : 'Empty = Best'}</p>
              </div>
            </div>
          </div>
        </LessonSection>

        {/* Section 7: Dasha Trajectory */}
        <LessonSection number={7} title={t('dashaTitle')}>
          <ClassicalReference shortName="BPHS" chapter="Dasha chapters" topic="Vimshottari Dasha system  –  planetary periods, starting dasha at birth" />
          <p style={bodyFont || undefined}>{t('dashaContent')}</p>

          {/* Dasha ranking table */}
          <div className="mt-5 overflow-x-auto">
            <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
              {t('dashaTableTitle')}
            </p>
            <div className="space-y-2">
              {([
                { key: 'dashaJupiter', rank: 1, color: 'border-emerald-500/20 bg-emerald-500/5' },
                { key: 'dashaVenus', rank: 2, color: 'border-emerald-400/20 bg-emerald-400/5' },
                { key: 'dashaMercury', rank: 3, color: 'border-green-400/20 bg-green-400/5' },
                { key: 'dashaMoon', rank: 4, color: 'border-gold-primary/20 bg-gold-primary/5' },
                { key: 'dashaSun', rank: 5, color: 'border-gold-primary/15 bg-gold-primary/3' },
                { key: 'dashaMars', rank: 6, color: 'border-amber-500/20 bg-amber-500/5' },
                { key: 'dashaSaturn', rank: 7, color: 'border-red-400/15 bg-red-400/5' },
                { key: 'dashaRahu', rank: 8, color: 'border-red-500/15 bg-red-500/5' },
                { key: 'dashaKetu', rank: 9, color: 'border-red-500/20 bg-red-500/8' },
              ] as const).map((d) => (
                <div key={d.key} className={`rounded-lg border p-3 ${d.color}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-gold-primary font-bold text-sm w-5">{d.rank}</span>
                    <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                      {t(d.key)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <p className="text-purple-300 text-sm font-semibold mb-2">
              {isIndic ? 'शेष संतुलन गुणक' : 'Balance Multiplier'}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
              {t('dashaBalance')}
            </p>
            <div className="mt-3 p-3 bg-bg-primary/50 rounded border border-purple-500/10">
              <p className="text-purple-200 font-mono text-xs">
                score = baseScore x min(1.0, remainingYears / (totalYears x 0.5)) x 1.5
              </p>
              <p className="text-purple-200/60 font-mono text-xs mt-1">
                {isIndic ? 'अधिकतम 15 अंक' : 'Capped at 15 points'}
              </p>
            </div>
          </div>
        </LessonSection>

        {/* Section 8: Structural Defects */}
        <LessonSection number={8} title={t('defectsTitle')}>
          <p style={bodyFont || undefined}>{t('defectsContent')}</p>

          <div className="mt-5 space-y-3">
            {/* Hard veto */}
            <div className="p-4 rounded-lg bg-red-500/10 border-2 border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full font-bold uppercase">
                  {isIndic ? 'कठोर निषेध' : 'Hard Veto'}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                {t('defectGandanta')}
              </p>
            </div>

            {/* Other defects */}
            {(['defectKaalSarpa', 'defectCombustLagna', 'defectRahuKetuLagna', 'defectSaturnLagna', 'defectVishti', 'defectVyatipata', 'defectRahuKaal'] as const).map((key) => (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/50 border border-red-500/10">
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(key)}
                </p>
              </div>
            ))}
          </div>

          {/* Defect severity table */}
          <div className="mt-5 overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-red-500/15">
                  <th className="text-left py-2 px-2 text-gold-dark">{isIndic ? 'दोष' : 'Defect'}</th>
                  <th className="text-left py-2 px-2 text-red-300">{isIndic ? 'कटौती' : 'Deduction'}</th>
                  <th className="text-left py-2 px-2 text-amber-300">{isIndic ? 'निषेध?' : 'Veto?'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/5 text-text-secondary">
                <tr><td className="py-1.5 px-2">{isIndic ? 'गंडांत चंद्र' : 'Gandanta Moon'}</td><td className="py-1.5 px-2 text-red-400 font-bold">-10</td><td className="py-1.5 px-2 text-red-400 font-bold">{isIndic ? 'हाँ' : 'YES'}</td></tr>
                <tr><td className="py-1.5 px-2">{isIndic ? 'काल सर्प योग' : 'Kaal Sarpa Yoga'}</td><td className="py-1.5 px-2">-8</td><td className="py-1.5 px-2">{isIndic ? 'नहीं' : 'No'}</td></tr>
                <tr><td className="py-1.5 px-2">{isIndic ? 'अस्त लग्नेश' : 'Combust Lagna Lord'}</td><td className="py-1.5 px-2">-6</td><td className="py-1.5 px-2">{isIndic ? 'नहीं' : 'No'}</td></tr>
                <tr><td className="py-1.5 px-2">{isIndic ? 'राहु/केतु लग्न में' : 'Rahu/Ketu in Lagna'}</td><td className="py-1.5 px-2">-5</td><td className="py-1.5 px-2">{isIndic ? 'नहीं' : 'No'}</td></tr>
                <tr><td className="py-1.5 px-2">{isIndic ? 'राहु/केतु 7वें में' : 'Rahu/Ketu in 7th'}</td><td className="py-1.5 px-2">-4</td><td className="py-1.5 px-2">{isIndic ? 'नहीं' : 'No'}</td></tr>
                <tr><td className="py-1.5 px-2">{isIndic ? 'शनि लग्न में (गुरु दृष्टि रहित)' : 'Saturn in Lagna (no Jupiter aspect)'}</td><td className="py-1.5 px-2">-5</td><td className="py-1.5 px-2">{isIndic ? 'नहीं' : 'No'}</td></tr>
                <tr><td className="py-1.5 px-2">{isIndic ? 'विष्टि करण' : 'Vishti Karana'}</td><td className="py-1.5 px-2">-3</td><td className="py-1.5 px-2">{isIndic ? 'नहीं' : 'No'}</td></tr>
                <tr><td className="py-1.5 px-2">{isIndic ? 'व्यतीपात / वैधृति' : 'Vyatipata / Vaidhriti'}</td><td className="py-1.5 px-2">-3</td><td className="py-1.5 px-2">{isIndic ? 'नहीं' : 'No'}</td></tr>
                <tr><td className="py-1.5 px-2">{isIndic ? 'राहु काल / गुलिक काल' : 'Rahu Kaal / Gulika Kaal'}</td><td className="py-1.5 px-2">-3</td><td className="py-1.5 px-2">{isIndic ? 'नहीं' : 'No'}</td></tr>
              </tbody>
            </table>
          </div>
        </LessonSection>

        {/* Section 9: Practical Guidance */}
        <LessonSection number={9} title={t('practicalTitle')}>
          <p style={bodyFont || undefined}>{t('practicalContent')}</p>

          <WhyItMatters locale={locale}>
            {isIndic
              ? 'सीजेरियन मुहूर्त शास्त्रीय ज्ञान और आधुनिक चिकित्सा वास्तविकता के बीच सेतु है। लक्ष्य डॉक्टर की योजना को बाधित करना नहीं बल्कि चिकित्सकीय रूप से सुरक्षित सीमाओं के भीतर सर्वोत्तम संभव क्षण खोजना है।'
              : 'Caesarean muhurta bridges classical wisdom and modern medical reality. The goal is not to override the doctor\'s plan but to find the best possible moment within medically safe boundaries. Families who approach this with flexibility and respect for the medical team get the best outcomes  –  both clinically and astrologically.'}
          </WhyItMatters>

          <div className="mt-5 space-y-4">
            {(['practicalHospital', 'practicalBuffer', 'practicalDoctor', 'practicalExpectations'] as const).map((key) => (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont || undefined}>
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* Section 10: Key Takeaways */}
        <LessonSection number={10} title={isIndic ? 'मुख्य बिन्दु' : 'Key Takeaways'}>
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
                label: isIndic ? 'सीजेरियन मुहूर्त उपकरण' : 'Caesarean Muhurta Tool',
                href: '/caesarean-muhurta' as const,
                color: 'border-emerald-500/20 hover:border-emerald-500/40',
              },
              {
                label: isIndic ? 'मुहूर्त AI  –  शुभ समय खोजें' : 'Muhurta AI  –  Find Auspicious Times',
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
                label: isIndic ? 'कुंडली बनाएँ' : 'Generate Kundali',
                href: '/charts' as const,
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
