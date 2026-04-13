import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Binary } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-binary.json';

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const BINARY_EXAMPLES = [
  { pattern: 'L L', binary: '0 0', meterKey: 'meter2BothLight' },
  { pattern: 'L G', binary: '0 1', meterKey: 'meter2LightHeavy' },
  { pattern: 'G L', binary: '1 0', meterKey: 'meter2HeavyLight' },
  { pattern: 'G G', binary: '1 1', meterKey: 'meter2BothHeavy' },
];

const MERU = [
  [1],
  [1, 1],
  [1, 2, 1],
  [1, 3, 3, 1],
  [1, 4, 6, 4, 1],
  [1, 5, 10, 10, 5, 1],
];

const SANSKRIT_TERMS = [
  { term: 'Chandahshastra', transliteration: 'Chandaḥśāstra', meaning: 'Science of meters — Pingala\'s prosody treatise (~200 BCE)', devanagari: 'छन्दःशास्त्र' },
  { term: 'Laghu', transliteration: 'laghu', meaning: 'light/short syllable — maps to binary 0', devanagari: 'लघु' },
  { term: 'Guru', transliteration: 'guru', meaning: 'heavy/long syllable — maps to binary 1', devanagari: 'गुरु' },
  { term: 'Meru Prastara', transliteration: 'meru-prastāra', meaning: 'Mountain arrangement — Pingala\'s Pascal Triangle', devanagari: 'मेरु प्रस्तार' },
  { term: 'Mishrau cha', transliteration: 'miśrau ca', meaning: 'mixing rule — generates Fibonacci sequence', devanagari: 'मिश्रौ च' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default async function BinaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['1','0','1','1','0','1','0','0','1','0','1','1','0','0','1','0'].map((bit, i) => (
            <div
              key={i}
              className="absolute font-mono text-gold-primary/15 font-bold select-none"
              style={{
                fontSize: `${12 + (i % 4) * 4}px`,
                left: `${(i * 23 + 5) % 95}%`,
                top: `${(i * 17 + 3) % 90}%`,
              }}
            >
              {bit}
            </div>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-primary/30 to-amber-500/10 border border-gold-primary/30 flex items-center justify-center">
                <Binary className="w-10 h-10 text-gold-primary" />
              </div>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-gold-gradient mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t("title")}
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="flex justify-center mt-4">
              <ShareRow pageTitle={t("title")} locale={locale} />
            </div>
          </div>

          <div
            className="mt-10"
          >
            <div className="inline-flex flex-col items-center bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl px-8 py-6">
              <span
                className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-gold-primary via-yellow-300 to-gold-primary bg-clip-text text-transparent font-mono tracking-widest"
              >
                01001001 01001110 01000100 01001001 01000001
              </span>
              <span className="text-text-secondary mt-2 text-sm">
                {t('indiaBinaryCaption')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1 ═══ */}
        <LessonSection number={1} title={t("s1Title")} variant="highlight">
          <p>{t("s1Body")}</p>
          <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-5 text-center">
            <div
              className="text-gold-primary font-bold text-2xl mb-2"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              छन्दःशास्त्र
            </div>
            <div className="text-gold-light font-semibold text-sm">Chandahshastra</div>
            <div className="text-text-secondary text-xs mt-1">Pingala, ~200 BCE</div>
            <div className="text-text-secondary text-sm mt-2">
              {t('chandahshastraLabel')}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 ═══ */}
        <LessonSection number={2} title={t("s2Title")}>
          <p>{t("s2Body")}</p>
          <div className="mt-6 overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('meterPattern')}</th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('binary')}</th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold hidden sm:table-cell">{t('description')}</th>
                </tr>
              </thead>
              <tbody>
                {BINARY_EXAMPLES.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.05]"
                  >
                    <td className="py-3 px-3 font-mono text-gold-primary">{row.pattern}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{row.binary}</td>
                    <td className="py-3 px-3 text-text-secondary hidden sm:table-cell">{t(row.meterKey)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-secondary/60 mt-3 italic">
            {t('lgNote')}
          </p>
        </LessonSection>

        {/* ═══ SECTION 3 ═══ */}
        <LessonSection number={3} title={t("s3Title")} variant="highlight">
          <p>{t("s3Body")}</p>
          <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center">
            <div
              className="text-3xl text-gold-primary font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              द्विः शून्ये
            </div>
            <div className="text-gold-light font-semibold">"dviḥ śūnye"</div>
            <div className="text-text-secondary text-sm mt-2">
              {t('dviShunye')}
            </div>
            <div className="mt-3 font-mono text-text-secondary/70 text-xs">
              {t('binaryCarryRule')}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4: Meru Prastara ═══ */}
        <LessonSection number={4} title={t("s4Title")}>
          <p>{t("s4Body")}</p>
          <div className="mt-6 flex flex-col items-center gap-1">
            {MERU.map((row, i) => (
              <div
                key={i}
                className="flex gap-2"
              >
                {row.map((val, j) => (
                  <div
                    key={j}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: `rgba(212, 168, 83, ${0.05 + (val / 10) * 0.3})`,
                      borderColor: `rgba(212, 168, 83, ${0.1 + (val / 10) * 0.4})`,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: val > 4 ? 'rgb(240, 212, 138)' : 'rgb(138, 132, 120)',
                    }}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
            <div className="text-text-secondary/60 text-xs mt-3 italic">
              {t('meruCaption')}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 5 ═══ */}
        <LessonSection number={5} title={t("s5Title")} variant="highlight">
          <p>{t("s5Body")}</p>
          <div className="mt-6 flex gap-2 flex-wrap justify-center">
            {[1,1,2,3,5,8,13,21,34,55,89].map((n, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-primary/20 to-amber-500/10 border border-gold-primary/25 flex items-center justify-center text-gold-light font-bold text-sm"
              >
                {n}
              </div>
            ))}
            <div className="w-full text-center text-text-secondary/60 text-xs italic mt-2">
              {t('fibCaption')}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 ═══ */}
        <LessonSection number={6} title={t("s6Title")}>
          <p>{t("s6Body")}</p>
        </LessonSection>

        {/* ═══ SECTION 7 ═══ */}
        <LessonSection number={7} title={t("s7Title")} variant="formula">
          <p>{t("s7Body")}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { labelKey: 'transistorsLabel', val: '16B+', subKey: 'transistorsSub' },
              { labelKey: 'webPagesLabel', val: '~5.5B', subKey: 'webPagesSub' },
              { labelKey: 'asciiLabel', val: '128', subKey: 'asciiSub' },
              { labelKey: 'colorsLabel', val: '16.7M', subKey: 'colorsSub' },
            ].map((item, i) => (
              <div key={i} className="rounded-lg bg-white/[0.03] border border-gold-primary/10 p-3 text-center">
                <div className="text-gold-primary font-bold text-lg">{item.val}</div>
                <div className="text-gold-light text-xs font-medium mt-1">{t(item.labelKey)}</div>
                <div className="text-text-secondary/60 text-xs mt-0.5">{t(item.subKey)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 8 ═══ */}
        <LessonSection number={8} title={t("s8Title")} variant="highlight">
          <p>{t("s8Body")}</p>
        </LessonSection>

        {/* ═══ SANSKRIT TERMS ═══ */}
        <LessonSection title={t('keySanskritTerms')}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SANSKRIT_TERMS.map((term, i) => (
              <SanskritTermCard key={i} {...term} />
            ))}
          </div>
        </LessonSection>

        {/* ═══ NAVIGATION ═══ */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/learn/contributions/pi"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gold-primary/20 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-sm font-medium"
          >
            ← {t('prevPi')}
          </Link>
          <Link
            href="/learn/contributions/cosmic-time"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {t("next")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
