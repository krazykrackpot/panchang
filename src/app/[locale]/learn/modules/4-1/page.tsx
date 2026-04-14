'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/4-1.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_4_1', phase: 1, topic: 'Ayanamsha', moduleNumber: '4.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Opening Hook */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whatIsPrecessionAndWhy', locale)}
        </h3>
        <p className="text-gold-light/90 text-sm leading-relaxed mb-4 italic border-l-2 border-gold-primary/30 pl-4">
          {t('every72YearsYourZodiac', locale)}
        </p>
      </section>

      {/* The Spinning Top Analogy */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('theSpinningTopAnalogy', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('imagineASpinningTopOn', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('thePhysicsTheSunAnd', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('theConsequenceTheVernalEquinox', locale)}
        </p>
      </section>

      {/* Historical Discovery */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('historicalDiscovery', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('hipparchusC150BceGreece', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('indianDiscoveryIndependentTheSurya', locale)}
        </p>
      </section>

      {/* Classical Origin Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('classicalOrigin', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('suryaSiddhantaChapter3The', locale)}
        </p>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 2 — The Ayanamsha: Where Tropical and Sidereal Diverge
   ═══════════════════════════════════════════════════════════════ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Zero Ayanamsha Date */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('theAyanamshaWhereTropicalAnd', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('whenWereTheTwoZodiacs', locale)}
        </p>
      </section>

      {/* Ayanamsha Systems Table */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 overflow-x-auto">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('ayanamshaSystemsCompared', locale)}
        </h4>
        <table className="w-full text-xs text-text-secondary">
          <thead>
            <tr className="border-b border-gold-primary/10">
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">{t('system', locale)}</th>
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">J2000.0</th>
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">2026</th>
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">{t('anchor', locale)}</th>
              <th className="text-left py-2 text-gold-light font-semibold">{t('zeroDate', locale)}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{t('lahiriChitrapaksha', locale)}</td>
              <td className="py-2 pr-3">23.85&deg;</td>
              <td className="py-2 pr-3">24.22&deg;</td>
              <td className="py-2 pr-3">{t('spicaChitraAt180U00b0', locale)}</td>
              <td className="py-2">{t('k285Ce', locale)}</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{t('raman', locale)}</td>
              <td className="py-2 pr-3">22.40&deg;</td>
              <td className="py-2 pr-3">22.76&deg;</td>
              <td className="py-2 pr-3">&#8212;</td>
              <td className="py-2">{t('k397Ce', locale)}</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{t('kpKrishnamurti', locale)}</td>
              <td className="py-2 pr-3">23.82&deg;</td>
              <td className="py-2 pr-3">24.19&deg;</td>
              <td className="py-2 pr-3">{t('spicaRefined', locale)}</td>
              <td className="py-2">{t('k291Ce', locale)}</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{t('faganBradley', locale)}</td>
              <td className="py-2 pr-3">24.74&deg;</td>
              <td className="py-2 pr-3">25.10&deg;</td>
              <td className="py-2 pr-3">&#8212;</td>
              <td className="py-2">{t('k221Ce', locale)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* The Calculation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('theCalculation', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theLahiriAyanamshaForAny', locale)}
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 font-mono text-xs text-gold-light/90 mb-3">
          <p>A = 24.042 + 1.3968 &times; T + 0.0005 &times; T&sup2;</p>
          <p className="text-text-secondary mt-1">
            {t('whereTCenturiesFromJ2000', locale)}
          </p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('forApril2026TIs', locale)}
        </p>
      </section>

      {/* Worked Examples Card */}
      <ExampleChart
        ascendant={1}
        planets={{ 1: [2], 4: [1], 10: [0] }}
        title="Ayanamsha Boundary — Same Sky, Different Coordinates"
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('workedExampleTheBoundaryProblem', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{t('problem', locale)}</span>{' '}
          {t('aPlanetIsAt24', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{t('lahiri2422Deg', locale)}</span>{' '}
          {t('k245Minus2422', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{t('faganBradley2510Deg', locale)}</span>{' '}
          {t('k245Minus2510', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-2 pt-2 border-t border-white/5">
          {t('aMere088Degree', locale)}
        </p>
      </section>

      {/* Real-World Comparison */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-violet-500/15">
        <h4 className="text-violet-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('realChartComparisonLahiriVs', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {t('birth14May198806', locale)}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-violet-500/20">
                <th className="text-left text-text-tertiary py-2 pr-3">{t('planet', locale)}</th>
                <th className="text-left text-gold-light py-2 pr-3">{t('lahiri', locale)}</th>
                <th className="text-left text-cyan-300 py-2 pr-3">{t('raman', locale)}</th>
                <th className="text-left text-red-400 py-2">{t('changed', locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5 bg-red-500/5">
                <td className="py-2 pr-3 font-medium text-gold-light">{t('sun', locale)}</td>
                <td className="py-2 pr-3">{t('aries2975', locale)}</td>
                <td className="py-2 pr-3">{t('taurus114', locale)}</td>
                <td className="py-2 text-red-400 font-bold">{t('signChanged', locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-amber-500/5">
                <td className="py-2 pr-3 font-medium text-gold-light">{t('venus', locale)}</td>
                <td className="py-2 pr-3">{t('mrigashiraNak', locale)}</td>
                <td className="py-2 pr-3">{t('ardraNak', locale)}</td>
                <td className="py-2 text-amber-400 font-bold">{t('nakChanged', locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-amber-500/5">
                <td className="py-2 pr-3 font-medium text-gold-light">{t('ketu', locale)}</td>
                <td className="py-2 pr-3">{t('pPhalguniNak', locale)}</td>
                <td className="py-2 pr-3">{t('uPhalguniNak', locale)}</td>
                <td className="py-2 text-amber-400 font-bold">{t('nakChanged', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('other6Planets', locale)}</td>
                <td className="py-2" colSpan={3}>{t('sameSignsSameNakshatrasNot', locale)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {t('theSunMovingFromAries', locale)}
        </p>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 3 — India's Contribution and the Great Debate
   ═══════════════════════════════════════════════════════════════ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Why Lahiri Won */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whyLahiriWonIndiaS', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theIndianCalendarReformCommittee', locale)}
        </p>
        <ul className="text-text-secondary text-sm leading-relaxed space-y-2 ml-4 mb-3">
          <li className="flex items-start gap-2">
            <span className="text-gold-primary mt-1 shrink-0">1.</span>
            <span>
              {t('itAnchorsToSpicaChitra', locale)}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-primary mt-1 shrink-0">2.</span>
            <span>
              {t('k180DegreesIsAstronomicallyClean', locale)}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-primary mt-1 shrink-0">3.</span>
            <span>
              {t('itBestFitsHistoricalAstronomical', locale)}
            </span>
          </li>
        </ul>
      </section>

      {/* WHY Everyone Disagrees */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whyEveryoneDisagreesTheRoot', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('toUnderstandTheAyanamshaDebate', locale)}
        </p>
        <ul className="text-text-secondary text-sm leading-relaxed space-y-3 ml-4 mb-3">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1 shrink-0 font-bold">1.</span>
            <span>
              {t('theEquinoxIsInvisibleIt', locale)}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1 shrink-0 font-bold">2.</span>
            <span>
              {t('k0AriesSiderealIsDefined', locale)}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1 shrink-0 font-bold">3.</span>
            <span>
              {t('ancientAstronomersMeasuredRelativePositions', locale)}
            </span>
          </li>
        </ul>
      </section>

      {/* Each System's Anchor Logic */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('howEachSystemChoseIts', locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-bold">Lahiri:</span> {t('fixedSpicaChitraΑVirginis', locale)}</p>
          <p><span className="text-gold-light font-bold">BV Raman:</span> {t('usedRevatiΖPisciumAs', locale)}</p>
          <p><span className="text-gold-light font-bold">KP (Krishnamurti):</span> {t('startedFromLahiriButApplied', locale)}</p>
          <p><span className="text-gold-light font-bold">Fagan-Bradley:</span> {t('cyrilFaganIrishUsedAldebaran', locale)}</p>
          <p><span className="text-gold-light font-bold">Yukteshwar:</span> {t('sriYukteshwarGiriYoganandaS', locale)}</p>
        </div>
      </section>

      {/* Why Can't We Just Measure It? */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-cyan-500/15">
        <h4 className="text-cyan-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('whyCanTWeJust', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('becausePrecessionIsContinuousAnd', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('thinkOfItLikeChoosing', locale)}
        </p>
      </section>

      {/* The Ongoing Debate */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whichOneShouldYouUse', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('lahiriIsDominantInIndia', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('practicalImpactIfYourPlanet', locale)}
        </p>
      </section>

      {/* How Our App Handles It */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('howOurAppHandlesIt', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('theKundaliGeneratorLetsYou', locale)}
        </p>
      </section>

      {/* Misconceptions Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('commonMisconceptions', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          <span className="text-red-300 font-medium">{t('myth', locale)}</span>{' '}
          {t('westernAstrologyIsWrongBecause', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-emerald-400 font-medium">{t('reality', locale)}</span>{' '}
          {t('bothSystemsAreInternallyConsistent', locale)}
        </p>
      </section>

      {/* Modern Relevance Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('modernRelevance', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('theIauInternationalAstronomicalUnion', locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module4_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
