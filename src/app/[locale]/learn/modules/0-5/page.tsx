'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-5.json';
const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_0_5',
  phase: 0,
  topic: 'Foundations',
  moduleNumber: '0.5',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 mb-2">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('yourSpotifyWrappedSummarizesYourYear', locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('aSnapshotOfTheSkyAt', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('imagineFreezingTheEntireSkyAt', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('theLagnaAscendant', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theLagnaWhichSignWasRising', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('12Houses12SlicesOfSky', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('eachHouseGovernsAnAreaOf', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('heresWhyBirthTimeIsSo', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('keyHistoricalFact', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('aryabhataCalculatedThatTheLagnaMoves', locale)}
        </p>
      </section>
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
          {t('chartStylesWhatToLookFor', locale)}
        </h3>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('northIndianVsSouthIndianChart', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('northIndianDiamondHousesAreFixed', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('whatToLookForFirstIn', locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('1YourLagnaSignYourPersonality', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('2MoonSignYourEmotionalCore', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('3StrongestPlanetByShadbalaThe', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('4AnyPlanetsInThe1st', locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('dontLetTheVisualComplexityIntimidate', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('keyHistoricalFact', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('theIndianEqualhouseSystemEachHouse', locale)}
        </p>
      </section>
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
          {t('generateYourKundaliPracticalGuide', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('headToTheKundaliPageOn', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('whatTheTabsShow', locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('chartTheVisualKundaliNorthIndian', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('planetsExactPositionOfEachPlanet', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('dashasLifeTimingCyclesMahadashaAntardasha', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('yogasPlanetaryCombinationsThatProduceSpecial', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('strengthShadbalaSixTypesOfStrength', locale)}
          </p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          {t('dontTryToInterpretEverythingAt', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('theBeginners3minuteReading', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('whenYouGenerateYourFirstKundali', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-400/20 bg-gradient-to-br from-red-900/10 to-transparent">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('commonMisconception', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('kundaliIsDestinyNotDeterministicThink', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('keyHistoricalFact', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('parasharasBrihatHoraShastraC2nd', locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module0_5() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
