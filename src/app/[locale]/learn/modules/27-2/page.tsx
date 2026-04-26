'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/27-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_27_2', phase: 7, topic: 'Festival Calendar Science', moduleNumber: '27.2',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/27-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/5-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q27_2_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q27_2_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q27_2_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
];

/* ---- Normal year months ---- */
const NORMAL_MONTHS = [
  { en: 'Chai', hi: 'चै' },
  { en: 'Vai', hi: 'वै' },
  { en: 'Jye', hi: 'ज्ये' },
  { en: 'Ash', hi: 'आष' },
  { en: 'Shr', hi: 'श्रा' },
  { en: 'Bhd', hi: 'भा' },
  { en: 'Ash', hi: 'आश्वि' },
  { en: 'Kar', hi: 'का' },
  { en: 'Mar', hi: 'मा' },
  { en: 'Pau', hi: 'पौ' },
  { en: 'Mag', hi: 'मा' },
  { en: 'Pha', hi: 'फा' },
] as const;

/* ---- Adhika year months (example: Adhika Jyeshtha in 2026) ---- */
const ADHIKA_MONTHS = [
  { en: 'Chai', hi: 'चै', adhika: false },
  { en: 'Vai', hi: 'वै', adhika: false },
  { en: 'A.Jye', hi: 'अ.ज्ये', adhika: true },
  { en: 'Jye', hi: 'ज्ये', adhika: false },
  { en: 'Ash', hi: 'आष', adhika: false },
  { en: 'Shr', hi: 'श्रा', adhika: false },
  { en: 'Bhd', hi: 'भा', adhika: false },
  { en: 'Ash', hi: 'आश्वि', adhika: false },
  { en: 'Kar', hi: 'का', adhika: false },
  { en: 'Mar', hi: 'मा', adhika: false },
  { en: 'Pau', hi: 'पौ', adhika: false },
  { en: 'Mag', hi: 'मा', adhika: false },
  { en: 'Pha', hi: 'फा', adhika: false },
] as const;

/* ---- Detection algorithm steps ---- */
const DETECTION_STEPS = [
  'detectionStep1',
  'detectionStep2',
  'detectionStep3',
  'detectionStep4',
] as const;

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Problem + The Solution + Detection Algorithm          */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={
          isHi
            ? (L.keyTakeawayPoints.hi as string[])
            : (L.keyTakeawayPoints.en as string[])
        }
        locale={locale}
      />

      {/* The Problem */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('theProblemTitle', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theProblemDesc', locale)}
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-4">
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="flex-1 text-center">
              <div className="text-gold-light font-mono text-sm">~354</div>
              <div className="mt-1">{isHi ? 'चान्द्र वर्ष (दिन)' : 'Lunar Year (days)'}</div>
            </div>
            <div className="text-red-400 text-lg font-bold">-11</div>
            <div className="flex-1 text-center">
              <div className="text-emerald-400 font-mono text-sm">~365</div>
              <div className="mt-1">{isHi ? 'सौर वर्ष (दिन)' : 'Solar Year (days)'}</div>
            </div>
          </div>
          <div className="mt-3 text-center text-xs text-red-300/70 italic">
            {isHi ? '11 दिन का अन्तर हर वर्ष बढ़ता है' : '11-day gap accumulates every year'}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('theSolutionTitle', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('theSolutionDesc', locale)}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="bg-gold-primary/15 text-gold-light px-2 py-1 rounded font-mono">~30.4d</span>
          <span className="text-text-secondary">{isHi ? 'सौर मास' : 'Solar month'}</span>
          <span className="text-text-secondary mx-1">vs</span>
          <span className="bg-blue-500/15 text-blue-300 px-2 py-1 rounded font-mono">~29.5d</span>
          <span className="text-text-secondary">{isHi ? 'चान्द्र मास' : 'Lunar month'}</span>
        </div>
      </section>

      {/* Detection Algorithm */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-300 text-xs uppercase tracking-widest font-bold mb-4">
          {t('detectionAlgorithmTitle', locale)}
        </h4>
        <ol className="space-y-3">
          {DETECTION_STEPS.map((stepKey, i) => (
            <li key={stepKey} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <span className="text-text-secondary text-xs leading-relaxed">
                {t(stepKey, locale)}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-4 bg-emerald-500/8 border border-emerald-500/15 rounded-lg p-3">
          <div className="text-emerald-300 text-[10px] uppercase font-bold tracking-wider mb-1">
            {isHi ? 'मुख्य परीक्षण' : 'Key Test'}
          </div>
          <code className="text-gold-light text-xs font-mono">
            sign(NM_start) === sign(NM_end) → Adhika
          </code>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Naming, Amanta vs Purnimanta, Festival Rules              */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Naming Convention */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('namingConventionTitle', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('namingConventionDesc', locale)}
        </p>
        <div className="mt-3 bg-gold-primary/8 border border-gold-primary/15 rounded-lg p-3">
          <div className="text-gold-light text-[10px] uppercase font-bold tracking-wider mb-1">
            {isHi ? '2029 उदाहरण' : '2029 Example'}
          </div>
          <div className="text-xs text-text-secondary">
            <span className="text-gold-primary font-mono">{isHi ? 'मीन (12)' : 'Meena (12)'}</span>
            <span className="mx-2">→</span>
            <span className="text-gold-primary font-mono">{isHi ? 'चैत्र' : 'Chaitra'}</span>
            <span className="mx-2">→</span>
            <span className="text-gold-light font-bold">{isHi ? 'अधिक चैत्र' : 'Adhika Chaitra'}</span>
          </div>
        </div>
      </section>

      {/* Amanta vs Purnimanta */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('amantaPurnimantaTitle', locale)}
        </h4>
        <div className="space-y-3">
          <div className="bg-purple-500/8 border border-purple-500/12 rounded-lg p-3">
            <div className="text-purple-300 text-[10px] uppercase font-bold tracking-wider mb-1">
              {isHi ? 'अमान्त' : 'Amanta'}
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('amantaDesc', locale)}
            </p>
          </div>
          <div className="bg-indigo-500/8 border border-indigo-500/12 rounded-lg p-3">
            <div className="text-indigo-300 text-[10px] uppercase font-bold tracking-wider mb-1">
              {isHi ? 'पूर्णिमान्त' : 'Purnimanta'}
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('purnimantaDesc', locale)}
            </p>
          </div>
          <p className="text-amber-300/70 text-xs italic leading-relaxed">
            {t('bothSystemsNote', locale)}
          </p>
        </div>
      </section>

      {/* Festival Rules */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('festivalRulesTitle', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('festivalRulesDesc', locale)}
        </p>
        <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-lg p-3 mt-2">
          <div className="text-emerald-300 text-[10px] uppercase font-bold tracking-wider mb-1">
            {isHi ? 'अपवाद' : 'Exception'}
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            {t('festivalRulesException', locale)}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Kshaya Masa, Real Examples, Year Comparison Visual         */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Kshaya Masa */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-orange-500/15 rounded-xl p-5">
        <h4 className="text-orange-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('kshayaMasaTitle', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('kshayaMasaDesc', locale)}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="bg-orange-500/15 text-orange-300 px-2 py-1 rounded font-mono">2</span>
          <span className="text-text-secondary">{isHi ? 'संक्रान्तियाँ एक मास में → क्षय' : 'Sankrantis in one month → Kshaya'}</span>
        </div>
        <div className="mt-2 text-text-secondary/50 text-[10px]">
          {isHi ? 'अगला क्षय मास: ~2123 ईस्वी' : 'Next Kshaya Masa: ~2123 CE'}
        </div>
      </section>

      {/* Real Examples */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('realExamplesTitle', locale)}
        </h3>
        <div className="space-y-2">
          {(['example2026', 'example2029', 'example2027'] as const).map((key) => (
            <div key={key} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10 rounded-lg p-3">
              <p className="text-text-secondary text-xs leading-relaxed">
                {t(key, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Year Comparison Visual */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4">
          {t('yearComparisonTitle', locale)}
        </h4>

        {/* Normal Year */}
        <div className="mb-4">
          <div className="text-text-secondary text-[10px] uppercase tracking-wider font-bold mb-2">
            {t('normalYearLabel', locale)}
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-0.5 min-w-[480px]">
              {NORMAL_MONTHS.map((m, i) => (
                <div
                  key={`n-${i}`}
                  className="bg-blue-500/15 border border-blue-500/10 rounded px-1.5 py-2 flex-1 text-center"
                >
                  <div className="text-blue-300 text-[9px] font-bold leading-tight">
                    {isHi ? m.hi : m.en}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Adhika Year */}
        <div className="mb-4">
          <div className="text-text-secondary text-[10px] uppercase tracking-wider font-bold mb-2">
            {t('adhikaYearLabel', locale)}
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-0.5 min-w-[520px]">
              {ADHIKA_MONTHS.map((m, i) => (
                <div
                  key={`a-${i}`}
                  className={`${
                    m.adhika
                      ? 'bg-gold-primary/25 border-gold-primary/40 ring-1 ring-gold-primary/30'
                      : 'bg-blue-500/15 border-blue-500/10'
                  } border rounded px-1.5 py-2 flex-1 text-center`}
                >
                  <div className={`${m.adhika ? 'text-gold-light font-bold' : 'text-blue-300'} text-[9px] leading-tight`}>
                    {isHi ? m.hi : m.en}
                  </div>
                  {m.adhika && (
                    <div className="text-gold-primary text-[7px] mt-0.5 font-bold uppercase">
                      {t('adhikaMonthLabel', locale)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solar Year reference bar */}
        <div>
          <div className="text-text-secondary text-[10px] uppercase tracking-wider font-bold mb-2">
            {t('solarYearLabel', locale)}
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[520px]">
              <div className="h-4 bg-emerald-500/15 border border-emerald-500/15 rounded relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-emerald-300 text-[9px] font-mono">365.25 {isHi ? 'दिन' : 'days'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-text-secondary">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500/15 border border-blue-500/10" />
            <span>{isHi ? 'निज (नियमित) मास' : 'Nija (regular) month'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gold-primary/25 border border-gold-primary/40 ring-1 ring-gold-primary/30" />
            <span>{isHi ? 'अधिक मास' : 'Adhika month'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500/15 border border-emerald-500/15" />
            <span>{isHi ? 'सौर वर्ष' : 'Solar year'}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module27_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
