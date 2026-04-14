'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-4.json';
const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_0_4',
  phase: 0,
  topic: 'Foundations',
  moduleNumber: '0.4',
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
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('openThePanchangTheFirstTwo', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('openThePanchangPageOnOur', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('thinkOfThePanchangAsA', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('1TithiWhatMoonPhaseAre', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('westernCalendarsHaveJust4Moon', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('why12BecauseTheMoonGains', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('2VaraWhatDayIsIt', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('eachDayIsRuledByA', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('heresAMindblowingConnectionTheEnglish', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('keyHistoricalFact', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('the7dayWeekWasInventedIndependently', locale)}
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
          {t('theRemainingThreePanchangElements', locale)}
        </h3>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('nowHeresWhereThePanchangGets', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('3NakshatraWhichStarGroupIs', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theMoonVisitsAll27Nakshatras', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('4YogaWhatsTheCombinedSunmoon', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('sunLongitudeMoonLongitudeDividedInto', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('5KaranaHalfATithi', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('11TypesOfKaranasCycleThrough', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('keyHistoricalFact', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('varahamihirasBrihatSamhita6thCenturyCe', locale)}
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
          {t('thePracticalPartsTimingInformation', locale)}
        </h3>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('sunriseSunset', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('calculatedForYourLocationU2014Not', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('rahuKaal', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('a15HourInauspiciousWindowEach', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('choghadiyaMuhurta', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('choghadiya8TimeSlotsPerHalfday', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('proTipForBeginners', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('youDontNeedToUnderstandAll', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('practicalExercise', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('lookAtTodaysPanchangOnOur', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('inTheNextModuleWellUnderstand', locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module0_4() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
