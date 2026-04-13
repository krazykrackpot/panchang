import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-pi.json';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Sigma } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const TIMELINE = [
  { year: '~800 BCE', who: { en: 'Baudhayana (India)', hi: 'बौधायन (भारत)', sa: 'बौधायन (भारत)', mai: 'बौधायन (भारत)', mr: 'बौधायन (भारत)', ta: 'Baudhayana (India)', te: 'Baudhayana (India)', bn: 'Baudhayana (India)', kn: 'Baudhayana (India)', gu: 'Baudhayana (India)' }, value: '≈ 3.088', decimals: 1, color: 'bg-amber-700/50' },
  { year: '~250 BCE', who: { en: 'Archimedes (Greece)', hi: 'आर्किमिडीज (ग्रीस)', sa: 'आर्किमिडीज (ग्रीस)', mai: 'आर्किमिडीज (ग्रीस)', mr: 'आर्किमिडीज (ग्रीस)', ta: 'Archimedes (Greece)', te: 'Archimedes (Greece)', bn: 'Archimedes (Greece)', kn: 'Archimedes (Greece)', gu: 'Archimedes (Greece)' }, value: '3.14163', decimals: 2, color: 'bg-blue-700/50' },
  { year: '263 CE', who: { en: 'Liu Hui (China)', hi: 'लियू हुई (चीन)', sa: 'लियू हुई (चीन)', mai: 'लियू हुई (चीन)', mr: 'लियू हुई (चीन)', ta: 'Liu Hui (China)', te: 'Liu Hui (China)', bn: 'Liu Hui (China)', kn: 'Liu Hui (China)', gu: 'Liu Hui (China)' }, value: '3.14159', decimals: 3, color: 'bg-red-700/50' },
  { year: '499 CE', who: { en: 'Aryabhata (India)', hi: 'आर्यभट (भारत)', sa: 'आर्यभट (भारत)', mai: 'आर्यभट (भारत)', mr: 'आर्यभट (भारत)', ta: 'Aryabhata (India)', te: 'Aryabhata (India)', bn: 'Aryabhata (India)', kn: 'Aryabhata (India)', gu: 'Aryabhata (India)' }, value: '3.14160', decimals: 4, color: 'bg-gold-primary/50', highlight: true },
  { year: '~1350 CE', who: { en: 'Madhava (India)', hi: 'माधव (भारत)', sa: 'माधव (भारत)', mai: 'माधव (भारत)', mr: 'माधव (भारत)', ta: 'Madhava (India)', te: 'Madhava (India)', bn: 'Madhava (India)', kn: 'Madhava (India)', gu: 'Madhava (India)' }, value: '3.14159265358...', decimals: 11, color: 'bg-emerald-700/50', highlight: true },
  { year: '1424 CE', who: { en: 'Al-Kashi (Persia)', hi: 'अल-काशी (फ़ारस)', sa: 'अल-काशी (फ़ारस)', mai: 'अल-काशी (फ़ारस)', mr: 'अल-काशी (फ़ारस)', ta: 'Al-Kashi (Persia)', te: 'Al-Kashi (Persia)', bn: 'Al-Kashi (Persia)', kn: 'Al-Kashi (Persia)', gu: 'Al-Kashi (Persia)' }, value: '3.14159265358979...', decimals: 16, color: 'bg-violet-700/50' },
  { year: '1761 CE', who: { en: 'Lambert (Europe)', hi: 'लैम्बर्ट (यूरोप)', sa: 'लैम्बर्ट (यूरोप)', mai: 'लैम्बर्ट (यूरोप)', mr: 'लैम्बर्ट (यूरोप)', ta: 'Lambert (Europe)', te: 'Lambert (Europe)', bn: 'Lambert (Europe)', kn: 'Lambert (Europe)', gu: 'Lambert (Europe)' }, value: 'Proved irrational', decimals: 0, color: 'bg-slate-600/50' },
];

const SANSKRIT_TERMS = [
  { term: 'Aryabhatiya', transliteration: 'Āryabhaṭīya', meaning: 'Aryabhata\'s treatise — 499 CE, covers arithmetic, algebra, trigonometry', devanagari: 'आर्यभटीय' },
  { term: 'Ganitapada', transliteration: 'Gaṇitapāda', meaning: 'Mathematics chapter of Aryabhatiya (33 verses)', devanagari: 'गणितपाद' },
  { term: 'Asannah', transliteration: 'āsannaḥ', meaning: '"Approaching" / "approximate" — Aryabhata\'s hint at irrationality', devanagari: 'आसन्नः' },
  { term: 'Parinaha', transliteration: 'pariṇāha', meaning: 'circumference', devanagari: 'परिणाह' },
  { term: 'Vishkambha', transliteration: 'viṣkambha', meaning: 'diameter', devanagari: 'विष्कम्भ' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default async function PiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const hi = isDevanagariLocale(locale);
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gold-primary/10"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-primary/30 to-amber-500/10 border border-gold-primary/30 flex items-center justify-center">
                <Sigma className="w-10 h-10 text-gold-primary" />
              </div>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-gold-gradient mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('title')}
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
            <div className="flex justify-center mt-4">
              <ShareRow pageTitle={t('title')} locale={locale} />
            </div>
          </div>

          <div
            className="mt-10"
          >
            <div className="inline-flex flex-col items-center bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl px-8 py-6">
              <span
                className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-gold-primary via-yellow-300 to-gold-primary bg-clip-text text-transparent font-mono"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                3.14160
              </span>
              <span className="text-text-secondary mt-2 text-sm sm:text-base">
                {hi ? 'आर्यभट का π — 499 ईस्वी | वास्तविक: 3.14159265... | त्रुटि: 0.0001%' : "Aryabhata's π — 499 CE | True: 3.14159265... | Error: 0.0001%"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1 ═══ */}
        <LessonSection number={1} title={t('s1Title')} variant="highlight">
          <p>{t('s1Body')}</p>
          <div
            className="my-6 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center"
          >
            <div
              className="text-lg sm:text-xl text-gold-primary font-bold leading-relaxed whitespace-pre-line mb-4"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              {t('s1Sanskrit')}
            </div>
            <div className="text-gold-light/70 text-sm italic px-4">{t('s1Trans')}</div>
            <div className="text-text-secondary/60 text-xs mt-2">— Aryabhatiya, Ganitapada, verse 10, 499 CE</div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 ═══ */}
        <LessonSection number={2} title={t('s2Title')}>
          <p>{t('s2Body')}</p>
          <div className="mt-6 space-y-3">
            {[
              { step: { en: '100 + 4 = 104', hi: '100 + 4 = 104', sa: '100 + 4 = 104', mai: '100 + 4 = 104', mr: '100 + 4 = 104', ta: '100 + 4 = 104', te: '100 + 4 = 104', bn: '100 + 4 = 104', kn: '100 + 4 = 104', gu: '100 + 4 = 104' }, note: { en: '"Add 4 to 100"', hi: '"100 में 4 जोड़ें"', sa: '"100 में 4 जोड़ें"', mai: '"100 में 4 जोड़ें"', mr: '"100 में 4 जोड़ें"', ta: '"Add 4 to 100"', te: '"Add 4 to 100"', bn: '"Add 4 to 100"', kn: '"Add 4 to 100"', gu: '"Add 4 to 100"' } },
              { step: { en: '104 × 8 = 832', hi: '104 × 8 = 832', sa: '104 × 8 = 832', mai: '104 × 8 = 832', mr: '104 × 8 = 832', ta: '104 × 8 = 832', te: '104 × 8 = 832', bn: '104 × 8 = 832', kn: '104 × 8 = 832', gu: '104 × 8 = 832' }, note: { en: '"Multiply by 8"', hi: '"8 से गुणा करें"', sa: '"8 से गुणा करें"', mai: '"8 से गुणा करें"', mr: '"8 से गुणा करें"', ta: '"Multiply by 8"', te: '"Multiply by 8"', bn: '"Multiply by 8"', kn: '"Multiply by 8"', gu: '"Multiply by 8"' } },
              { step: { en: '832 + 62,000 = 62,832', hi: '832 + 62,000 = 62,832', sa: '832 + 62,000 = 62,832', mai: '832 + 62,000 = 62,832', mr: '832 + 62,000 = 62,832', ta: '832 + 62,000 = 62,832', te: '832 + 62,000 = 62,832', bn: '832 + 62,000 = 62,832', kn: '832 + 62,000 = 62,832', gu: '832 + 62,000 = 62,832' }, note: { en: '"Add 62,000" = circumference for diameter 20,000', hi: '"62,000 जोड़ें" = 20,000 व्यास के लिए परिधि', sa: '"62,000 जोड़ें" = 20,000 व्यास के लिए परिधि', mai: '"62,000 जोड़ें" = 20,000 व्यास के लिए परिधि', mr: '"62,000 जोड़ें" = 20,000 व्यास के लिए परिधि', ta: '"Add 62,000" = circumference for diameter 20,000', te: '"Add 62,000" = circumference for diameter 20,000', bn: '"Add 62,000" = circumference for diameter 20,000', kn: '"Add 62,000" = circumference for diameter 20,000', gu: '"Add 62,000" = circumference for diameter 20,000' } },
              { step: { en: '62,832 ÷ 20,000 = 3.1416', hi: '62,832 ÷ 20,000 = 3.1416', sa: '62,832 ÷ 20,000 = 3.1416', mai: '62,832 ÷ 20,000 = 3.1416', mr: '62,832 ÷ 20,000 = 3.1416', ta: '62,832 ÷ 20,000 = 3.1416', te: '62,832 ÷ 20,000 = 3.1416', bn: '62,832 ÷ 20,000 = 3.1416', kn: '62,832 ÷ 20,000 = 3.1416', gu: '62,832 ÷ 20,000 = 3.1416' }, note: { en: 'Circumference ÷ Diameter = π', hi: 'परिधि ÷ व्यास = π', sa: 'परिधि ÷ व्यास = π', mai: 'परिधि ÷ व्यास = π', mr: 'परिधि ÷ व्यास = π', ta: 'Circumference ÷ Diameter = π', te: 'Circumference ÷ Diameter = π', bn: 'Circumference ÷ Diameter = π', kn: 'Circumference ÷ Diameter = π', gu: 'Circumference ÷ Diameter = π' }, highlight: true },
            ].map((row, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 rounded-lg px-4 py-3 border ${row.highlight ? 'bg-gold-primary/10 border-gold-primary/30' : 'bg-white/[0.02] border-white/[0.05]'}`}
              >
                <span className="font-mono text-gold-light font-bold text-sm sm:text-base flex-shrink-0">{lt(row.step as LocaleText, locale)}</span>
                <span className="text-text-secondary text-sm">{lt(row.note as LocaleText, locale)}</span>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 3 ═══ */}
        <LessonSection number={3} title={t('s3Title')} variant="highlight">
          <p>{t('s3Body')}</p>
          <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center">
            <div
              className="text-4xl text-gold-primary font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              आसन्नः
            </div>
            <div className="text-gold-light font-semibold">"āsannaḥ"</div>
            <div className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
              {hi ? '"निकट" या "लगभग" — आर्यभट ने जानबूझकर यह शब्द चुना। यह एक गणितज्ञ की भाषा है जो जानता है कि सटीक उत्तर असंभव है।' : '"Approaching" / "approximate" — Aryabhata chose this word deliberately. This is the language of a mathematician who knows the exact answer is impossible.'}
            </div>
            <div className="mt-3 text-xs text-text-secondary/60 italic">
              {hi ? 'लैम्बर्ट ने 1761 में π की अपरिमेयता को सिद्ध किया — आर्यभट के 1,262 साल बाद' : 'Lambert proved the irrationality of π in 1761 — 1,262 years after Aryabhata'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4 ═══ */}
        <LessonSection number={4} title={t('s4Title')}>
          <p>{t('s4Body')}</p>
          <div className="mt-6 bg-white/[0.02] border border-gold-primary/15 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <div className="text-gold-light mb-2">Madhava-Leibniz series (~1350 CE):</div>
            <div className="text-text-primary text-lg">π/4 = 1 − <span className="text-amber-400">1/3</span> + <span className="text-emerald-400">1/5</span> − <span className="text-blue-400">1/7</span> + <span className="text-violet-400">1/9</span> − ...</div>
            <div className="text-text-secondary/60 text-xs mt-3">
              {hi ? 'माधव ने सुधार पद भी जोड़े जिसने अभिसरण को नाटकीय रूप से त्वरित किया → 11 दशमलव स्थान' : 'Madhava also added correction terms that dramatically accelerated convergence → 11 decimal places'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 5: Timeline ═══ */}
        <LessonSection number={5} title={t('s5Title')} variant="highlight">
          <div className="space-y-3 mt-2">
            {TIMELINE.map((row, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 border ${row.highlight ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-white/[0.05] bg-white/[0.02]'}`}
              >
                <span className="text-text-secondary/70 text-xs font-mono w-20 flex-shrink-0">{row.year}</span>
                <span className={`text-sm font-medium flex-1 ${row.highlight ? 'text-gold-light' : 'text-text-primary'}`}>{lt(row.who as LocaleText, locale)}</span>
                <span className="font-mono text-xs text-right flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded ${row.color} text-white/90`}>{row.value}</span>
                </span>
                {row.decimals > 0 && (
                  <span className="text-xs text-text-secondary/50 flex-shrink-0 hidden sm:block">
                    {row.decimals} {hi ? 'दशमलव' : 'decimals'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 ═══ */}
        <LessonSection number={6} title={t('s6Title')}>
          <p>{t('s6Body')}</p>
          <div className="mt-6 bg-white/[0.02] border border-gold-primary/15 rounded-xl p-5 overflow-x-auto">
            <div className="text-gold-light text-sm mb-3">{hi ? 'रामानुजन का π सूत्र (1914):' : "Ramanujan's π formula (1914):"}</div>
            <div className="font-mono text-text-primary text-sm leading-relaxed">
              1/π = (2√2/9801) × Σ [(4n)!(1103+26390n)] / [(n!)⁴ × 396⁴ⁿ]
            </div>
            <div className="text-text-secondary/60 text-xs mt-3 italic">
              {hi ? 'प्रत्येक पद ~8 सही अंक जोड़ता है — 1985 में 17 मिलियन अंकों की गणना का आधार' : 'Each term adds ~8 correct digits — basis for 17 million digit computation in 1985'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 7 ═══ */}
        <LessonSection number={7} title={t('s7Title')} variant="formula">
          <p>{t('s7Body')}</p>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-3 gap-3">
            {[
              { name: 'Baudhayana', year: '~800 BCE', pi: '≈ 3.088' },
              { name: 'Apastamba', year: '~600 BCE', pi: '≈ 3.097' },
              { name: 'Manava', year: '~750 BCE', pi: '≈ 3.160' },
            ].map((item, i) => (
              <div key={i} className="rounded-lg bg-white/[0.03] border border-gold-primary/10 p-3 text-center">
                <div className="text-gold-light font-semibold text-sm">{item.name}</div>
                <div className="text-text-secondary/70 text-xs">{item.year}</div>
                <div className="text-gold-primary font-mono text-sm mt-1">{item.pi}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 8 ═══ */}
        <LessonSection number={8} title={t('s8Title')} variant="highlight">
          <p>{t('s8Body')}</p>
        </LessonSection>

        {/* ═══ SANSKRIT TERMS ═══ */}
        <LessonSection title={hi ? 'मुख्य संस्कृत शब्द' : 'Key Sanskrit Terms'}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SANSKRIT_TERMS.map((term, i) => (
              <SanskritTermCard key={i} {...term} />
            ))}
          </div>
        </LessonSection>

        {/* ═══ NAVIGATION ═══ */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/learn/contributions/zero"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gold-primary/20 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-sm font-medium"
          >
            ← {hi ? 'पिछला: शून्य' : 'Previous: Zero'}
          </Link>
          <Link
            href="/learn/contributions/binary"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {t('next')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
