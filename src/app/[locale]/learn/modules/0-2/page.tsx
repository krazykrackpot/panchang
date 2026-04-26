'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import BeginnerNote from '@/components/learn/BeginnerNote';
import WhyItMatters from '@/components/learn/WhyItMatters';
import QuickCheck from '@/components/learn/QuickCheck';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_0_2',
  phase: 0,
  topic: 'Pre-Foundation',
  moduleNumber: '0.2',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
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
        points={[
          'The Hindu calendar is lunisolar — it tracks both the Moon and the Sun, unlike purely solar (Gregorian) or purely lunar (Islamic) calendars.',
          'This system explains why festivals like Diwali shift dates every year but always fall in the same season.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whyHinduFestivalsMoveEvery', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('whyIsDiwaliInNovember', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('haveYouEverWonderedWhy', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('hereSWhatSGenius', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('thereAreThreeMainCalendar', locale)}
        </p>

        <div className="grid gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light text-sm font-bold mb-1">{t('gregorianPureSolar', locale)}</p>
            <p className="text-text-secondary text-xs">
              {t('k36525DaysYearAligned', locale)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-blue-300 text-sm font-bold mb-1">{t('islamicPureLunar', locale)}</p>
            <p className="text-text-secondary text-xs">
              {t('k354DaysYearAlignedWith', locale)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-emerald-500/15">
            <p className="text-emerald-400 text-sm font-bold mb-1">{t('hinduLunisolarGeniusHybrid', locale)}</p>
            <p className="text-text-secondary text-xs">
              {t('monthsFollowTheMoon29', locale)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 my-3">
          <BeginnerNote term="Tithi" explanation="A lunar day — one of 30 divisions of the lunar month, determined by the angular distance between Sun and Moon." />
          <BeginnerNote term="Panchang" explanation="The five-element Vedic almanac: tithi, nakshatra, yoga, karana, and vara (weekday)." />
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('diwaliIsAlwaysOnKartik', locale)}
        </p>
        <WhyItMatters locale={locale}>Understanding the lunar calendar lets you know why Hindu festivals shift dates every year — and predict them yourself.</WhyItMatters>
      </section>

      {/* Classical Origin — Gold card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('classicalOrigin', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {t('indiaDevelopedTheLunisolarCalendar', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('theIndianCalendarReformCommittee', locale)}
        </p>
      </section>

      <QuickCheck
        question="Why does Diwali fall on different Gregorian dates each year?"
        options={['Leap years', 'Lunar calendar', 'Time zones', 'Random']}
        correctIndex={1}
        explanation="The Hindu calendar is lunisolar — months follow the Moon, so dates shift relative to the solar Gregorian calendar."
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
          {t('amantaVsPurnimanta', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('ifYouAskANorth', locale)}
        </p>
        <BeginnerNote term="Amanta / Purnimanta" explanation="Two systems for when a lunar month ends — Amanta ends at new moon (used in South India), Purnimanta ends at full moon (used in North India)." />

        <div className="grid gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{t('purnimantaNorthIndia', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed mb-1">
              {t('monthEndsAtPurnimaFull', locale)}
            </p>
            <p className="text-text-tertiary text-xs">
              {t('uttarPradeshRajasthanMadhyaPradesh', locale)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-blue-300 text-sm font-bold mb-2">{t('amantaSouthIndiaGujarat', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed mb-1">
              {t('monthEndsAtAmavasyaNew', locale)}
            </p>
            <p className="text-text-tertiary text-xs">
              {t('maharashtraKarnatakaAndhraTamilNadu', locale)}
            </p>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">{t('whatThisMeans', locale)}</span>{' '}
          {t('theSameEkadashiMightBe', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('whyDoesThisMatterTo', locale)}
        </p>
      </section>

      {/* Emerald fact card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('indianYearCountingEras', locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>
            <span className="text-emerald-300 font-bold">{t('vikramSamvat', locale)}</span>{' '}
            {t('started57BceNamedAfter', locale)}
          </p>
          <p>
            <span className="text-emerald-300 font-bold">{t('shakaSamvat', locale)}</span>{' '}
            {t('started78CeAttributedTo', locale)}
          </p>
          <p className="text-text-tertiary text-xs">
            {t('theGregorianCalendarCameWith', locale)}
          </p>
        </div>
      </section>

      <QuickCheck
        question="What marks the beginning of a month in the Amanta system?"
        options={['Full Moon', 'New Moon (Amavasya)', 'Solstice', 'Sunrise']}
        correctIndex={1}
        explanation="Amanta (South/West India) starts each month at Amavasya. Purnimanta (North) starts at Purnima."
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
          {t('practicalExerciseReadTodayS', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('nowThatYouUnderstandHow', locale)}
        </p>
        <ul className="text-text-secondary text-sm space-y-2 ml-4 mb-4">
          <li>
            <span className="text-gold-light font-medium">{t('masaMonth', locale)}</span>{' '}
            — {t('whatLunarMonthIsIt', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('tithi', locale)}</span>{' '}
            — {t('whatTithiIsItShukla', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('nakshatra', locale)}</span>{' '}
            — {t('whichNakshatraIsTheMoon', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('nextFestival', locale)}</span>{' '}
            — {t('whatTithiMasaDoesIt', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('sunriseSunset', locale)}</span>{' '}
            — {t('noticeHowRahuKaalAnd', locale)}
          </li>
        </ul>
      </section>

      {/* Red — Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('commonMisconceptions', locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('hinduFestivalsChangeTheirDates', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('theyDonTDiwaliIs', locale)}
          </p>
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('thePanchangIsOutdatedAnd', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('thePanchangIsBasedOn', locale)}
          </p>
        </div>
      </section>

      {/* Blue — Modern Relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('modernRelevance', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('theHinduConceptOfTime', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('todayTheLunisolarSystemIs', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {t('theSmallestTimeUnitIn', locale)}
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module0_2Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
