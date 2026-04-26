'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import BeginnerNote from '@/components/learn/BeginnerNote';
import WhyItMatters from '@/components/learn/WhyItMatters';
import QuickCheck from '@/components/learn/QuickCheck';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-1.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_0_1',
  phase: 0,
  topic: 'Pre-Foundation',
  moduleNumber: '0.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 10,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

// ─── Content Pages ──────────────────────────────────────────────────────────

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={
          isHi
            ? [
                'ज्योतिष का अर्थ है "प्रकाश का विज्ञान" — यह अवलोकन खगोल विज्ञान है जो जीवन मार्गदर्शन से जुड़ा है, भाग्य-कथन नहीं',
                'वैदिक ज्योतिष नक्षत्र-आधारित राशिचक्र (सायन) का उपयोग करता है, जबकि पश्चिमी ज्योतिष ऋतु-आधारित (निरयन) — दोनों में ~24° का अन्तर है',
              ]
            : [
                'Jyotish means "science of light" — it is observational astronomy intertwined with life guidance, not fortune-telling',
                'Vedic astrology uses the sidereal zodiac (actual star positions), while Western uses the tropical zodiac (seasons) — they differ by ~24\u00B0',
              ]
        }
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('theScienceOfLight', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theWordJyotishComesFrom', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('jyotishHasThreeBranchesAnd', locale)}
        </p>
        <BeginnerNote term="Jyotish" explanation="Literally 'science of light' — the Vedic system of astronomy and astrology, one of the six Vedangas (limbs of the Vedas)." />
        <ul className="text-text-secondary text-sm space-y-2 ml-4">
          <li>
            <span className="text-gold-light font-bold">{t('siddhanta', locale)}</span>{' '}
            {t('mathematicalAstronomyPlanetaryPositionsEclipses', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('hora', locale)}</span>{' '}
            {t('birthChartInterpretationThisIs', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('samhita', locale)}</span>{' '}
            {t('mundaneAstrologyWeatherAgricultureNational', locale)}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {t('thinkOfItThisWay', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('hereSAMindBlowing', locale)}
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <BeginnerNote term="Sidereal zodiac" explanation="A zodiac anchored to actual star positions, as opposed to the tropical zodiac which is tied to the seasons." />
          <BeginnerNote term="Vedanga" explanation="One of six auxiliary disciplines attached to the Vedas — Jyotish is the 'eye' of the Vedas." />
        </div>
        <WhyItMatters locale={locale}>Jyotish is not fortune-telling — it is a mathematical framework built on real astronomy. Understanding this distinction is the foundation for everything that follows.</WhyItMatters>
      </section>

      {/* Classical Origin — Gold card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('classicalOrigin', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('indianAstronomicalAchievementsAreStaggering', locale)}
        </p>
        <ul className="text-text-secondary text-sm space-y-3 ml-2">
          <li>
            <span className="text-gold-light font-bold">{t('aryabhata476Ce', locale)}</span>{' '}
            {t('calculatedEarthSCircumferenceAs', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('trigonometrySSine', locale)}</span>{' '}
            {t('theWordSineComesFrom', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('varahamihira505Ce', locale)}</span>{' '}
            {t('wrotePanchaSiddhantikaComparing5', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('brahmagupta628Ce', locale)}</span>{' '}
            {t('gaveTheFirstRulesFor', locale)}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-4">
          {t('aryabhataDidnTJustCalculate', locale)}
        </p>
      </section>

      <QuickCheck
        question="Which zodiac system does Vedic astrology use?"
        options={['Tropical (seasons)', 'Sidereal (stars)', 'Both equally', 'Neither']}
        correctIndex={1}
        explanation="Sidereal means star-based — Vedic astrology tracks actual star positions, unlike Western astrology which tracks seasons."
      />
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('jyotishVsWesternAstrology', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('whenSomeoneInTheWest', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('westernAstrologyUsesTheTropical', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('butTheDifferencesGoFar', locale)}
        </p>

        {/* Comparison table */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary text-xs py-2 pr-3">{t('aspect', locale)}</th>
                <th className="text-left text-gold-light text-xs py-2 pr-3">{t('vedicJyotish', locale)}</th>
                <th className="text-left text-blue-300 text-xs py-2">{t('western', locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary text-xs">
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('zodiac', locale)}</td>
                <td className="py-2 pr-3">{t('siderealStarFixed', locale)}</td>
                <td className="py-2">{t('tropicalSeasonFixed', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('primaryLuminary', locale)}</td>
                <td className="py-2 pr-3">{t('moonMind', locale)}</td>
                <td className="py-2">{t('sunEgo', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('divergence', locale)}</td>
                <td className="py-2 pr-3" colSpan={2}>{t('about24DegreesTodayYour', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('nakshatras', locale)}</td>
                <td className="py-2 pr-3">{t('k27LunarMansions', locale)}</td>
                <td className="py-2">{t('noEquivalent', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('timingSystem', locale)}</td>
                <td className="py-2 pr-3">{t('dashaWhenEventsHappen', locale)}</td>
                <td className="py-2">{t('transitsOnly', locale)}</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 text-text-tertiary">{t('muhurta', locale)}</td>
                <td className="py-2 pr-3">{t('auspiciousTimeSelectionElaborate', locale)}</td>
                <td className="py-2">{t('noEquivalent', locale)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {t('hereSThePracticalDifference', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theKeralaSchoolOfMathematics', locale)}
        </p>
      </section>

      {/* Emerald fact card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('astonishingFacts', locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>
            <span className="text-emerald-300 font-bold">{t('suryaSiddhantaC400Ce', locale)}</span>{' '}
            {t('calculatedTheSiderealYearAs', locale)}
          </p>
          <p>
            <span className="text-emerald-300 font-bold">{t('jantarMantarObservatories', locale)}</span>{' '}
            {t('maharajaJaiSinghIiBuilt', locale)}
          </p>
        </div>
      </section>

      <QuickCheck
        question="How many 'wandering stars' (grahas) did ancient Indian astronomers identify?"
        options={['5', '7', '9', '12']}
        correctIndex={2}
        explanation="9 grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, plus Rahu and Ketu (the lunar nodes)."
      />
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whatThisCourseWillTeach', locale)}
        </h3>
        <ul className="text-text-secondary text-sm space-y-2 ml-4">
          <li>
            <span className="text-gold-light font-medium">{t('readingADailyPanchang', locale)}</span>{' '}
            — {t('yourCosmicWeatherReportFor', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('understandingABirthChart', locale)}</span>{' '}
            — {t('yourCosmicDna', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('theMathematicsBehindTheCalculations', locale)}</span>{' '}
            — {t('realAlgorithmsNotMysticism', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('culturalContext', locale)}</span>{' '}
            — {t('forHinduRitualsAndFestivals', locale)}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          <span className="text-red-300 font-bold">{t('whatThisCourseWillNot', locale)}</span>{' '}
          {t('deterministicFatePredictionReplacementFor', locale)}
        </p>
      </section>

      {/* Red — Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('commonMisconceptions', locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('jyotishIsJustSuperstition', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('theAstronomicalCalculationsAreScience', locale)}
          </p>
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('jyotishWasCopiedFromGreek', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('theRigvedaC1500Bce', locale)}
          </p>
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('jyotishAndWesternAstrologyAre', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('theyUseDifferentZodiacsDifferent', locale)}
          </p>
          <p className="mt-3">
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('theCalculationsAreUnscientific', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('hereSATestOur', locale)}
          </p>
        </div>
      </section>

      {/* Blue — Modern Relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('modernRelevance', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('theMathematicsOfJyotishIs', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('billionsOfHindusWorldwideUse', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {t('the2017NobelPrizeIn', locale)}
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module0_1Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
