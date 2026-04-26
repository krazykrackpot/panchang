'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/27-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_27_1', phase: 7, topic: 'Festival Calendar Science', moduleNumber: '27.1',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 10,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/5-3' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/7-3' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/22-6' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q27_1_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q27_1_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q27_1_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
];

/* ---- Quick reference table data (hoisted to module scope) ---- */
const KALA_TABLE = [
  { rule: 'Udaya Tithi', ruleHi: 'उदय तिथि', window: 'Sunrise', windowHi: 'सूर्योदय', festivals: 'Holi, Hanuman Jayanti', festivalsHi: 'होली, हनुमान जयन्ती' },
  { rule: 'Madhyahna', ruleHi: 'मध्याह्न', window: 'Midday (2/5–3/5 of day)', windowHi: 'दोपहर (दिन का 2/5–3/5)', festivals: 'Ram Navami, Ganesh Chaturthi', festivalsHi: 'राम नवमी, गणेश चतुर्थी' },
  { rule: 'Pradosh', ruleHi: 'प्रदोष', window: 'Sunset + 96 min', windowHi: 'सूर्यास्त + 96 मिनट', festivals: 'Diwali, Dhanteras', festivalsHi: 'दीपावली, धनतेरस' },
  { rule: 'Nishita', ruleHi: 'निशीथ', window: 'Midnight +/- 24 min', windowHi: 'मध्यरात्रि +/- 24 मिनट', festivals: 'Janmashtami, Shivaratri', festivalsHi: 'जन्माष्टमी, शिवरात्रि' },
  { rule: 'Arunodaya', ruleHi: 'अरुणोदय', window: 'Pre-dawn (96 min before sunrise)', windowHi: 'प्रभात-पूर्व (सूर्योदय से 96 मिनट पहले)', festivals: 'Narak Chaturdashi', festivalsHi: 'नरक चतुर्दशी' },
  { rule: 'Aparahna', ruleHi: 'अपराह्ण', window: 'Afternoon (3/5–4/5 of day)', windowHi: 'दोपहर बाद (दिन का 3/5–4/5)', festivals: 'Dussehra', festivalsHi: 'दशहरा' },
  { rule: 'Chandrodaya', ruleHi: 'चन्द्रोदय', window: 'Moonrise', windowHi: 'चन्द्रोदय', festivals: 'Karwa Chauth', festivalsHi: 'करवा चौथ' },
] as const;

/* ---- Timeline segments for the day timeline visual ---- */
const TIMELINE_SEGMENTS = [
  { label: 'Arunodaya', labelHi: 'अरुणोदय', time: '~4:30', color: 'bg-indigo-500/60' },
  { label: 'Sunrise', labelHi: 'सूर्योदय', time: '~6:00', color: 'bg-amber-500/70' },
  { label: 'Pratah', labelHi: 'प्रातः', time: '6:00–9:36', color: 'bg-orange-400/40' },
  { label: 'Madhyahna', labelHi: 'मध्याह्न', time: '9:36–1:12', color: 'bg-yellow-500/50' },
  { label: 'Aparahna', labelHi: 'अपराह्ण', time: '1:12–4:48', color: 'bg-orange-600/50' },
  { label: 'Pradosh', labelHi: 'प्रदोष', time: '6:00–7:36', color: 'bg-purple-500/60' },
  { label: 'Nishita', labelHi: 'निशीथ', time: '11:40–12:28', color: 'bg-blue-700/60' },
] as const;

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Problem + Udaya Tithi + Madhyahna                     */
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
          {t('theProblemTithiVsSolarDay', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theProblemDesc', locale)}
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-4">
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="flex-1 text-center">
              <div className="text-gold-light font-mono text-sm">~23h 37m</div>
              <div className="mt-1">{isHi ? 'औसत तिथि अवधि' : 'Avg. Tithi Duration'}</div>
            </div>
            <div className="text-gold-primary text-lg font-bold">vs</div>
            <div className="flex-1 text-center">
              <div className="text-emerald-400 font-mono text-sm">24h 00m</div>
              <div className="mt-1">{isHi ? 'सौर दिन' : 'Solar Day'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Udaya Tithi */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('udayaTithiSunriseRule', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('udayaTithiDesc', locale)}
        </p>
        <p className="text-gold-primary text-xs italic">
          {t('udayaTithiFestivals', locale)}
        </p>
        <p className="text-text-secondary/60 text-xs mt-1">
          {t('udayaTithiSource', locale)}
        </p>
      </section>

      {/* Madhyahna */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-yellow-500/15 rounded-xl p-5">
        <h4 className="text-yellow-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('madhyahnaMiddayRule', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('madhyahnaDesc', locale)}
        </p>
        <p className="text-gold-primary text-xs italic">
          {t('madhyahnaFestivals', locale)}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Pradosh, Nishita, Arunodaya, Aparahna, Chandrodaya        */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Pradosh */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('pradoshEveningRule', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('pradoshDesc', locale)}
        </p>
        <p className="text-gold-primary text-xs italic">
          {t('pradoshFestivals', locale)}
        </p>
      </section>

      {/* Nishita */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-blue-500/15 rounded-xl p-5">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('nishitaMidnightRule', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('nishitaDesc', locale)}
        </p>
        <p className="text-gold-primary text-xs italic">
          {t('nishitaFestivals', locale)}
        </p>
      </section>

      {/* Arunodaya */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-indigo-500/15 rounded-xl p-5">
        <h4 className="text-indigo-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('arunodayaPreDawnRule', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('arunodayaDesc', locale)}
        </p>
        <p className="text-gold-primary text-xs italic">
          {t('arunodayaFestivals', locale)}
        </p>
      </section>

      {/* Aparahna */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-orange-500/15 rounded-xl p-5">
        <h4 className="text-orange-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('aparahnaAfternoonRule', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('aparahnaDesc', locale)}
        </p>
        <p className="text-gold-primary text-xs italic">
          {t('aparahnaFestivals', locale)}
        </p>
      </section>

      {/* Chandrodaya */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-sky-500/15 rounded-xl p-5">
        <h4 className="text-sky-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('chandrodayaMoonriseRule', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('chandrodayaDesc', locale)}
        </p>
        <p className="text-gold-primary text-xs italic">
          {t('chandrodayaFestivals', locale)}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Algorithm, Timeline, Quick Reference Table                 */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* The Algorithm */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('theAlgorithm', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theAlgorithmDesc', locale)}
        </p>
      </section>

      {/* Day Timeline Visual */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4">
          {t('dayTimelineTitle', locale)}
        </h4>
        {/* Timeline bar */}
        <div className="overflow-x-auto">
          <div className="flex gap-0.5 min-w-[540px]">
            {TIMELINE_SEGMENTS.map((seg) => (
              <div
                key={seg.label}
                className={`${seg.color} rounded-md px-2 py-3 flex-1 text-center border border-white/5`}
              >
                <div className="text-gold-light text-[10px] font-bold leading-tight">
                  {isHi ? seg.labelHi : seg.label}
                </div>
                <div className="text-text-secondary text-[9px] mt-1 font-mono">
                  {seg.time}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[9px] text-text-secondary/50 min-w-[540px] px-1">
            <span>{isHi ? 'रात्रि' : 'Night'}</span>
            <span>{isHi ? 'सूर्योदय' : 'Sunrise'}</span>
            <span>{isHi ? 'दोपहर' : 'Noon'}</span>
            <span>{isHi ? 'सूर्यास्त' : 'Sunset'}</span>
            <span>{isHi ? 'मध्यरात्रि' : 'Midnight'}</span>
          </div>
        </div>
      </section>

      {/* Quick Reference Table */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4">
          {t('quickReferenceTable', locale)}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left text-gold-light py-2 pr-3 font-semibold">{t('tableHeaderRule', locale)}</th>
                <th className="text-left text-gold-light py-2 pr-3 font-semibold">{t('tableHeaderWindow', locale)}</th>
                <th className="text-left text-gold-light py-2 font-semibold">{t('tableHeaderFestivals', locale)}</th>
              </tr>
            </thead>
            <tbody>
              {KALA_TABLE.map((row) => (
                <tr key={row.rule} className="border-b border-gold-primary/8">
                  <td className="py-2 pr-3 text-gold-primary font-medium whitespace-nowrap">
                    {isHi ? row.ruleHi : row.rule}
                  </td>
                  <td className="py-2 pr-3 text-text-secondary whitespace-nowrap">
                    {isHi ? row.windowHi : row.window}
                  </td>
                  <td className="py-2 text-text-secondary">
                    {isHi ? row.festivalsHi : row.festivals}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module27_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
