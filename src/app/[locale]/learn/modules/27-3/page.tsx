'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/27-3.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_27_3', phase: 12, topic: 'Festival Calendar Science', moduleNumber: '27.3',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/27-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/27-2' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/5-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q27_3_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q27_3_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q27_3_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
];

/* ---- Quick reference table data (hoisted to module scope) ---- */
const COMPARISON_TABLE = [
  { aspect: 'Default rule', aspectHi: 'मूल नियम', smarta: 'Udaya Tithi', smartaHi: 'उदय तिथि', vaishnava: 'Shuddha Tithi', vaishnavHi: 'शुद्ध तिथि' },
  { aspect: 'Viddha tithi', aspectHi: 'विद्ध तिथि', smarta: 'Accepted', smartaHi: 'स्वीकृत', vaishnava: 'Rejected', vaishnavHi: 'अस्वीकृत' },
  { aspect: 'Ekadashi fast', aspectHi: 'एकादशी उपवास', smarta: 'Day tithi is at sunrise', smartaHi: 'सूर्योदय पर जो तिथि हो', vaishnava: 'Day tithi is "pure"', vaishnavHi: 'जब तिथि "शुद्ध" हो' },
  { aspect: 'Parana (break fast)', aspectHi: 'पारण (उपवास तोड़ना)', smarta: 'Before Dwadashi ends', smartaHi: 'द्वादशी समाप्त होने से पहले', vaishnava: 'After sunrise, before 1/4 Dwadashi', vaishnavHi: 'सूर्योदय बाद, 1/4 द्वादशी पहले' },
  { aspect: 'Authority', aspectHi: 'प्रामाणिक ग्रन्थ', smarta: 'Dharmasindhu, Nirnayasindhu', smartaHi: 'धर्मसिन्धु, निर्णयसिन्धु', vaishnava: 'Hari Bhakti Vilasa', vaishnavHi: 'हरि भक्ति विलास' },
  { aspect: 'Typical followers', aspectHi: 'अनुयायी', smarta: 'Most Hindu families', smartaHi: 'अधिकांश हिन्दू परिवार', vaishnava: 'ISKCON, Gaudiya Vaishnavas', vaishnavHi: 'इस्कॉन, गौड़ीय वैष्णव' },
] as const;

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Core Difference + Smarta vs Vaishnava overview             */
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

      {/* The Core Difference */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('coreDifference', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {t('coreDifferenceDesc', locale)}
        </p>

        {/* Visual: Same sky, different rules */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="flex-1 text-center">
              <div className="text-amber-400 font-mono text-sm font-bold">Same Moon</div>
              <div className="mt-1">{isHi ? 'वही चन्द्रमा' : 'Same astronomy'}</div>
            </div>
            <div className="text-gold-primary text-lg font-bold">=</div>
            <div className="flex-1 text-center">
              <div className="text-blue-400 font-mono text-sm font-bold">Same Tithis</div>
              <div className="mt-1">{isHi ? 'वही तिथियाँ' : 'Same tithis'}</div>
            </div>
            <div className="text-red-400 text-lg font-bold">/</div>
            <div className="flex-1 text-center">
              <div className="text-emerald-400 font-mono text-sm font-bold">{isHi ? 'भिन्न नियम' : 'Different Rules'}</div>
              <div className="mt-1">{isHi ? 'तिथि-चयन भिन्न' : 'Date selection differs'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Smarta */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('smartaTitle', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('smartaDesc', locale)}
        </p>
      </section>

      {/* Vaishnava */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-blue-500/15 rounded-xl p-5">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('vaishnavTitle', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('vaishnavDesc', locale)}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Viddha Rule + Ekadashi + Visual Timeline Comparison        */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* The Viddha Rule */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('viddhaRule', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {t('viddhaRuleDesc', locale)}
        </p>
      </section>

      {/* Visual: Ekadashi scenario — side by side timelines */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4">
          {isHi ? 'उदाहरण: जन्माष्टमी — दो दृष्टिकोण' : 'Example: Janmashtami — Two Perspectives'}
        </h4>

        {/* Shared timeline */}
        <div className="mb-4 text-xs text-text-secondary">
          <div className="flex items-center gap-1 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>{isHi ? 'सप्तमी' : 'Saptami'}: 3:00 AM — 6:00 AM ({isHi ? 'सूर्योदय' : 'sunrise'})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span>{isHi ? 'अष्टमी' : 'Ashtami'}: 4:00 AM — {isHi ? 'अगले दिन' : 'next day'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Smarta timeline */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              {isHi ? 'स्मार्त निर्णय' : 'Smarta Decision'}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-full h-3 rounded bg-gradient-to-r from-orange-400/40 via-violet-400/40 to-violet-400/40 border border-white/10 relative">
                  <div className="absolute top-1/2 left-[35%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-amber-400/50" title="sunrise" />
                  <div className="absolute top-1/2 left-[80%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 ring-2 ring-blue-400/50" title="nishita" />
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-text-secondary/60">
                <span>4 AM</span>
                <span>{isHi ? 'सूर्योदय' : 'Sunrise'}</span>
                <span>{isHi ? 'निशीथ' : 'Nishita'}</span>
              </div>
              <p className="text-emerald-400 text-xs font-medium mt-2">
                {isHi ? 'अष्टमी निशीथ काल पर व्याप्त → जन्माष्टमी आज' : 'Ashtami prevails at Nishita → Janmashtami TODAY'}
              </p>
            </div>
          </div>

          {/* Vaishnava timeline */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              {isHi ? 'वैष्णव निर्णय' : 'Vaishnava Decision'}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-full h-3 rounded bg-gradient-to-r from-orange-400/40 via-violet-400/40 to-violet-400/40 border border-white/10 relative">
                  <div className="absolute top-1/2 left-[35%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-400 ring-2 ring-red-400/50" title="sunrise — viddha!" />
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-text-secondary/60">
                <span>4 AM</span>
                <span className="text-red-400">{isHi ? 'सूर्योदय = विद्ध!' : 'Sunrise = VIDDHA!'}</span>
                <span>{isHi ? 'निशीथ' : 'Nishita'}</span>
              </div>
              <p className="text-red-400 text-xs font-medium mt-2">
                {isHi ? 'सूर्योदय पर सप्तमी → अष्टमी विद्ध → कल प्रतीक्षा करें' : 'Saptami at sunrise → Ashtami Viddha → wait TOMORROW'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affected Festivals */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('affectedFestivals', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('affectedFestivalsDesc', locale)}
        </p>
      </section>

      {/* Ekadashi Deep Dive */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('ekadashiDeepDive', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('ekadashiDeepDiveDesc', locale)}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Geographic Variation, Implementation, Quick Ref Table      */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Geographic Variation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('geographicVariation', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t('geographicVariationDesc', locale)}
        </p>
      </section>

      {/* Our Implementation */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('ourImplementation', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('ourImplementationDesc', locale)}
        </p>
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
                <th className="text-left text-gold-light py-2 pr-3 font-semibold">{t('tableHeaderAspect', locale)}</th>
                <th className="text-left text-amber-400 py-2 pr-3 font-semibold">{t('tableHeaderSmarta', locale)}</th>
                <th className="text-left text-blue-300 py-2 font-semibold">{t('tableHeaderVaishnava', locale)}</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row) => (
                <tr key={row.aspect} className="border-b border-gold-primary/8">
                  <td className="py-2 pr-3 text-gold-primary font-medium">
                    {isHi ? row.aspectHi : row.aspect}
                  </td>
                  <td className="py-2 pr-3 text-text-secondary">
                    {isHi ? row.smartaHi : row.smarta}
                  </td>
                  <td className="py-2 text-text-secondary">
                    {isHi ? row.vaishnavHi : row.vaishnava}
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
export default function Module27_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
