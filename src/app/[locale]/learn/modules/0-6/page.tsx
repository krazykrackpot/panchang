'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-6.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import BeginnerNote from '@/components/learn/BeginnerNote';
import WhyItMatters from '@/components/learn/WhyItMatters';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_0_6',
  phase: 0,
  topic: 'Foundations',
  moduleNumber: '0.6',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 10,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'Hindu festivals are not arbitrary dates — each one is timed to a specific astronomical event (full moon, solstice, planetary alignment).',
          'Understanding the astronomy behind rituals connects ancient tradition with observable sky phenomena.',
        ]}
        locale={locale}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('hereSSomethingThatMight', locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('everyHinduRitualHasAn', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('everWonderedWhyFastSpecifically', locale)}
        </p>
        <div className="flex flex-wrap gap-3 my-2">
          <BeginnerNote term="Sankalpa" explanation="A spoken cosmic timestamp recited before every puja — it names the current year, month, tithi, nakshatra, and yoga to anchor the ritual in astronomical time." />
          <BeginnerNote term="Muhurta" explanation="An auspicious time window selected using multiple Panchang factors — used for weddings, housewarming, business launches, and other important events." />
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('ekadashiFasting11thTithi', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('whenMoonSunElongationReaches', locale)}
        </p>
      </section>

      <WhyItMatters locale={locale}>Every Hindu ritual — from daily puja to once-in-a-lifetime ceremonies — is timed to astronomical events. Understanding the link between ritual and sky lets you see that tradition is encoded astronomy.</WhyItMatters>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('modernChronobiologyU2014TheStudy', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('purnimaFullMoonWorship', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theMoonIsDirectlyOpposite', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('amavasyaNewMoonTarpana', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('moonConjunctSunU2014Invisible', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('keyHistoricalFact', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('aryabhataCorrectlyExplainedThatThe', locale)}
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
          {t('whySpecificDaysAndTimes', locale)}
        </h3>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('tuesdayMarsDayMangalavara', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('marsRulesCourageConflictSurgery', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('saturdaySaturnDayShanivara', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('saturnRulesDisciplineKarmaHardship', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('thinkAboutItYouAlready', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('marriageMuhurtaNotArbitrary', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('aGoodMarriageMuhurtaRequires', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('sankalpaACosmicTimestamp', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theSankalpaBeforeEveryPuja', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('keyHistoricalFact', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('theSuryaSiddhantaDescribesTime', locale)}
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
          {t('howOurAppConnectsIt', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('nowYouKnowThatRituals', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <div className="space-y-3">
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('dailyPanchangU2192KnowThe', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('festivalCalendarU2192WhenTo', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('pujaVidhiU2192StepBy', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('sankalpaGeneratorU2192YourPersonalized', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('muhurtaAiU2192FindThe', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('kundaliU2192YourPersonalCosmic', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('learnJyotishU2192UnderstandThe', locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('hereSTheBeautifulThing', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('foundationsComplete', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('youNowKnow', locale)}
        </p>
        <div className="space-y-1">
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('u2713WhatJyotishIsAnd', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('u2713HowTheHinduCalendar', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('u2713YourRashiAndNakshatra', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('u2713HowToReadA', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('u2713WhatAKundaliShows', locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('u2713WhyRitualsHaveAstronomical', locale)}
          </p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          {t('nextModule11Starts', locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module0_6() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
