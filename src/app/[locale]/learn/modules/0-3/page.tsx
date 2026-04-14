'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-3.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_0_3',
  phase: 0,
  topic: 'Pre-Foundation',
  moduleNumber: '0.3',
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
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whatSYourSignThe', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('hereSAPartyTrick', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('ifAWesternFriendAsks', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('twoBigDifferencesAreAt', locale)}
        </p>

        <div className="grid gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{t('the24DegreeGapAyanamsha', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('theTropicalZodiacIsTied', locale)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 border border-emerald-500/15">
            <p className="text-emerald-400 text-sm font-bold mb-2">{t('moonVsSun', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('westernAstrologyCentersOnThe', locale)}
            </p>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('whyDoesVedicUseThe', locale)}
        </p>
      </section>

      {/* Classical Origin — Gold card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('classicalOrigin', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {t('the12ZodiacSignsOriginated', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('eachNakshatraSpans13Degrees', locale)}
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
          {t('the12RashisIn2', locale)}
        </h3>

        {/* Rashi grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { n: 1, en: 'Mesha', hi: 'मेष', sym: 'Aries', ruler: t('mars', locale), elem: t('fire', locale) },
            { n: 2, en: 'Vrishabha', hi: 'वृषभ', sym: 'Taurus', ruler: t('venus', locale), elem: t('earth', locale) },
            { n: 3, en: 'Mithuna', hi: 'मिथुन', sym: 'Gemini', ruler: t('mercury', locale), elem: t('air', locale) },
            { n: 4, en: 'Karka', hi: 'कर्क', sym: 'Cancer', ruler: t('moon', locale), elem: t('water', locale) },
            { n: 5, en: 'Simha', hi: 'सिंह', sym: 'Leo', ruler: t('sun', locale), elem: t('fire', locale) },
            { n: 6, en: 'Kanya', hi: 'कन्या', sym: 'Virgo', ruler: t('mercury', locale), elem: t('earth', locale) },
            { n: 7, en: 'Tula', hi: 'तुला', sym: 'Libra', ruler: t('venus', locale), elem: t('air', locale) },
            { n: 8, en: 'Vrischika', hi: 'वृश्चिक', sym: 'Scorpio', ruler: t('mars', locale), elem: t('water', locale) },
            { n: 9, en: 'Dhanu', hi: 'धनु', sym: 'Sagittarius', ruler: t('jupiter', locale), elem: t('fire', locale) },
            { n: 10, en: 'Makara', hi: 'मकर', sym: 'Capricorn', ruler: t('saturn', locale), elem: t('earth', locale) },
            { n: 11, en: 'Kumbha', hi: 'कुम्भ', sym: 'Aquarius', ruler: t('saturn', locale), elem: t('air', locale) },
            { n: 12, en: 'Meena', hi: 'मीन', sym: 'Pisces', ruler: t('jupiter', locale), elem: t('water', locale) },
          ].map(r => (
            <div key={r.n} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-2 text-center">
              <p className="text-gold-light text-xs font-bold">{r.n}. {isHi ? r.hi : r.en}</p>
              <p className="text-text-tertiary text-xs">{r.sym}</p>
              <p className="text-text-secondary text-xs">{r.ruler} · {r.elem}</p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {t('hereSSomethingThatBlows', locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-base mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('the27NakshatrasQuickPreview', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('eachNakshatraIsRuledBy', locale)}
        </p>

        {/* Emerald fact card */}
        <ExampleChart
          ascendant={6}
          planets={{ 6: [1], 1: [0], 4: [4] }}
          title="Moon in Hasta (Virgo) — Birth Nakshatra Example"
          highlight={[6]}
        />
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
          <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
            {t('workedExample', locale)}
          </h4>
          <p className="text-text-secondary text-xs leading-relaxed mb-2">
            {t('supposeTheMoonWasIn', locale)}
          </p>
          <ul className="text-text-secondary text-xs space-y-1 ml-3">
            <li>{t('moonMahadashaStartsAtBirth', locale)}</li>
            <li>{t('moonSignKanyaVirgoHasta', locale)}</li>
            <li>{t('pada3NameSyllableNu', locale)}</li>
          </ul>
          <p className="text-text-secondary text-xs leading-relaxed mt-3">
            <span className="text-gold-light font-bold">{t('tryItNow', locale)}</span>{' '}
            {t('headToOurSignCalculator', locale)}
          </p>
        </section>
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
          {t('whyYourNakshatraMattersMore', locale)}
        </h3>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{t('naming', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('theFirstSyllableOfYour', locale)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{t('dashaTimingSystem', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('yourEntireLifeSPlanetary', locale)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{t('marriageMatching', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('ashtaKutaCompatibilityIs100', locale)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 border border-emerald-500/15">
            <p className="text-emerald-400 text-sm font-bold mb-2">{t('the120YearTimeline', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('yourBirthNakshatraDeterminesYour', locale)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{t('janmaNakshatraDay', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('eachMonthWhenTheMoon', locale)}
            </p>
          </div>
        </div>
      </section>

      {/* Red — Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('commonMisconceptions', locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('mySignIsLeoBecause', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('thatSOnlyYourWestern', locale)}
          </p>
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('nakshatrasAreJustIndianNames', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('completelyDifferentNakshatrasAreEqual', locale)}
          </p>
        </div>
      </section>

      {/* Blue — Modern Relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('modernRelevance', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">{t('historicalRecord', locale)}</span>{' '}
          {t('theRigvedaC1500Bce', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('ourAppCalculatesYourExact', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {t('chronobiologyTheStudyOfBiological', locale)}
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module0_3Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
