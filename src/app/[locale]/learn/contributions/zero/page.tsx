import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Circle, Cpu, Globe } from 'lucide-react';
import { ShareRow } from '@/components/ui/ShareButton';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-zero.json';


/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const BRAHMAGUPTA_RULES = [
  { rule: { en: 'zero + zero = zero', hi: 'शून्य + शून्य = शून्य' }, sanskrit: 'शून्यं शून्येन संयुक्तं शून्यम्' },
  { rule: { en: 'positive + zero = positive', hi: 'धन + शून्य = धन' }, sanskrit: 'धनं शून्येन संयुक्तं धनम्' },
  { rule: { en: 'negative + zero = negative', hi: 'ऋण + शून्य = ऋण' }, sanskrit: 'ऋणं शून्येन संयुक्तं ऋणम्' },
  { rule: { en: 'zero × any number = zero', hi: 'शून्य × कोई भी = शून्य' }, sanskrit: 'शून्यं धनर्णयोः कृतिः शून्यम्' },
  { rule: { en: 'positive × negative = negative', hi: 'धन × ऋण = ऋण' }, sanskrit: 'धनर्णयोः घातो ऋणम्' },
  { rule: { en: '0 ÷ 0 = 0 (his one error!)', hi: '0 ÷ 0 = 0 (उनकी एकमात्र त्रुटि!)' }, sanskrit: 'शून्यं शून्यहृतं शून्यम् ✗' },
];

const JOURNEY = [
  { year: '~300 CE', place: { en: 'Bakhshali, India', hi: 'बख्शाली, भारत' }, event: { en: 'Earliest physical zero dot on birch bark manuscript', hi: 'भोजपत्र पांडुलिपि पर सबसे पुराना भौतिक शून्य बिंदु' }, color: 'border-gold-primary/60' },
  { year: '628 CE', place: { en: 'Ujjain, India', hi: 'उज्जैन, भारत' }, event: { en: 'Brahmagupta defines zero as a full number with arithmetic rules', hi: 'ब्रह्मगुप्त शून्य को अंकगणितीय नियमों के साथ पूर्ण संख्या के रूप में परिभाषित करते हैं' }, color: 'border-amber-400/60' },
  { year: '825 CE', place: { en: 'Baghdad, Iraq', hi: 'बगदाद, इराक' }, event: { en: "Al-Khwarizmi translates Indian numerals — gives us 'algorithm'", hi: 'अल-ख्वारिज्मी भारतीय अंकों का अनुवाद करते हैं — हमें "एल्गोरिदम" देते हैं' }, color: 'border-blue-400/60' },
  { year: '1202 CE', place: { en: 'Pisa, Italy', hi: 'पीसा, इटली' }, event: { en: 'Fibonacci publishes Liber Abaci, introducing zero to Europe', hi: 'फिबोनाची लिबर अबासी प्रकाशित करते हैं, यूरोप को शून्य से परिचित कराते हैं' }, color: 'border-emerald-400/60' },
  { year: '1299 CE', place: { en: 'Florence, Italy', hi: 'फ्लोरेंस, इटली' }, event: { en: "Florence BANS Indian numerals — calls them 'Saracen numerals'", hi: 'फ्लोरेंस ने भारतीय अंकों पर प्रतिबंध लगाया — उन्हें "सारासेन अंक" कहा' }, color: 'border-red-400/60' },
  { year: '~1500 CE', place: { en: 'All of Europe', hi: 'सारा यूरोप' }, event: { en: 'Indian numerals finally win. Zero universally accepted. Modern math begins.', hi: 'भारतीय अंक अंततः जीत गए। शून्य सार्वभौमिक रूप से स्वीकृत। आधुनिक गणित शुरू।' }, color: 'border-violet-400/60' },
];

const SANSKRIT_TERMS = [
  { term: 'Shunya', transliteration: 'śūnya', meaning: 'void, empty — the philosophical concept behind zero', devanagari: 'शून्य' },
  { term: 'Brahmasphutasiddhanta', transliteration: 'Brahma-sphuṭa-siddhānta', meaning: 'The Correctly Established Doctrine of Brahma (628 CE)', devanagari: 'ब्रह्मस्फुटसिद्धान्त' },
  { term: 'Kuttaka', transliteration: 'kuṭṭaka', meaning: 'Pulverizer — Chapter 18 where zero rules appear', devanagari: 'कुट्टक' },
  { term: 'Ananta', transliteration: 'ananta', meaning: 'infinity — introduced by Bhaskara II for n÷0', devanagari: 'अनन्त' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default async function ZeroPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const hi = isDevanagariLocale(locale);
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gold-primary/10"
              style={{
                width: `${(i % 4 + 1) * 2}px`,
                height: `${(i % 4 + 1) * 2}px`,
                left: `${(i * 19 + 3) % 100}%`,
                top: `${(i * 29 + 7) % 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-primary/30 to-amber-500/10 border border-gold-primary/30 flex items-center justify-center">
                <Circle className="w-10 h-10 text-gold-primary" />
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
                className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-gold-primary via-yellow-300 to-gold-primary bg-clip-text text-transparent"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                0
              </span>
              <span className="text-text-secondary mt-2 text-sm sm:text-base">
                {hi ? 'ब्रह्मगुप्त द्वारा परिभाषित, 628 ईस्वी — उज्जैन, भारत' : 'Defined by Brahmagupta, 628 CE — Ujjain, India'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1 ═══ */}
        <LessonSection number={1} title={t('s1Title')} variant="highlight">
          <p>{t('s1Body')}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { civ: 'Rome', problem: { en: 'No zero → counting boards required for every calculation', hi: 'शून्य नहीं → हर गणना के लिए काउंटिंग बोर्ड चाहिए' }, color: 'border-red-500/30' },
              { civ: 'Greece', problem: { en: 'Philosophical block — "Nothing cannot be Something"', hi: 'दार्शनिक बाधा — "शून्य कुछ नहीं हो सकता"' }, color: 'border-blue-500/30' },
              { civ: 'Babylon', problem: { en: 'Placeholder zero only — never a number', hi: 'केवल स्थान-धारक शून्य — कभी संख्या नहीं' }, color: 'border-amber-500/30' },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-lg p-4 bg-white/[0.02] border ${item.color}`}
              >
                <div className="text-gold-light font-bold mb-2">{item.civ}</div>
                <div className="text-text-secondary text-sm">{lt(item.problem as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 ═══ */}
        <LessonSection number={2} title={t('s2Title')}>
          <p>{t('s2Intro')}</p>

          <div
            className="my-6 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center"
          >
            <div
              className="text-2xl sm:text-3xl text-gold-primary font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              {t('s2QuoteMain')}
            </div>
            <div className="text-gold-light/70 text-sm italic">{t('s2QuoteTrans')}</div>
            <div className="text-text-secondary/60 text-xs mt-1">— Brahmasphutasiddhanta, Ch. 18, 628 CE</div>
          </div>

          <div className="mt-4 space-y-3">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider">
              {hi ? 'ब्रह्मगुप्त के शून्य के 6 नियम' : "Brahmagupta's 6 Rules for Zero"}
            </h4>
            {BRAHMAGUPTA_RULES.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg bg-white/[0.02] border border-white/[0.05] px-4 py-3"
              >
                <span className="text-gold-primary/60 text-xs font-mono w-5 flex-shrink-0">{i + 1}.</span>
                <span className="text-text-primary text-sm flex-1">{lt(item.rule as LocaleText, locale)}</span>
                <span
                  className="text-gold-primary/50 text-xs hidden sm:block"
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                >
                  {item.sanskrit}
                </span>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 3 ═══ */}
        <LessonSection number={3} title={t('s3Title')} variant="highlight">
          <p>{t('s3Body')}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="bg-white/[0.03] border border-gold-primary/20 rounded-xl p-5 text-center flex-1 max-w-xs">
              <div className="text-4xl font-black text-gold-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>·</div>
              <div className="text-gold-light font-semibold text-sm">{hi ? 'बख्शाली बिंदु (~300 ईस्वी)' : 'Bakhshali dot (~300 CE)'}</div>
              <div className="text-text-secondary text-xs mt-1">{hi ? 'पृथ्वी पर सबसे पुराना शून्य' : "Earth's oldest zero"}</div>
            </div>
            <ArrowRight className="text-gold-primary/50 w-6 h-6 rotate-0 sm:rotate-0" />
            <div className="bg-white/[0.03] border border-gold-primary/20 rounded-xl p-5 text-center flex-1 max-w-xs">
              <div className="text-4xl font-black text-gold-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>0</div>
              <div className="text-gold-light font-semibold text-sm">{hi ? 'ब्रह्मगुप्त संख्या (628 ईस्वी)' : 'Brahmagupta number (628 CE)'}</div>
              <div className="text-text-secondary text-xs mt-1">{hi ? 'स्थान-धारक से पूर्ण संख्या' : 'Placeholder to full number'}</div>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4 ═══ */}
        <LessonSection number={4} title={t('s4Title')}>
          <p>{t('s4Body')}</p>
          <div className="mt-6 overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{hi ? 'सभ्यता' : 'Civilization'}</th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{hi ? 'शून्य का प्रकार' : 'Zero Type'}</th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{hi ? 'अंकगणित?' : 'Arithmetic?'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { civ: 'Babylon (~300 BCE)', type: { en: 'Placeholder only', hi: 'केवल स्थान-धारक' }, arith: false },
                  { civ: 'Maya (~350 CE)', type: { en: 'Placeholder only', hi: 'केवल स्थान-धारक' }, arith: false },
                  { civ: 'India — Bakhshali (~300 CE)', type: { en: 'Placeholder dot', hi: 'स्थान-धारक बिंदु' }, arith: false },
                  { civ: 'India — Brahmagupta (628 CE)', type: { en: 'FULL NUMBER with rules', hi: 'नियमों के साथ पूर्ण संख्या' }, arith: true },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/[0.05] ${row.arith ? 'bg-gold-primary/5' : ''}`}
                  >
                    <td className="py-3 px-3 text-text-primary font-medium">{row.civ}</td>
                    <td className="py-3 px-3 text-text-secondary">{lt(row.type as LocaleText, locale)}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${row.arith ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {row.arith ? (hi ? 'हाँ!' : 'YES!') : (hi ? 'नहीं' : 'No')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LessonSection>

        {/* ═══ SECTION 5 ═══ */}
        <LessonSection number={5} title={t('s5Title')} variant="highlight">
          <p>{t('s5Body')}</p>
          <div className="mt-6 space-y-4">
            {JOURNEY.map((stop, i) => (
              <div
                key={i}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${stop.color} px-4 py-4`}
              >
                <div className="flex-shrink-0">
                  <div className="text-gold-primary font-bold text-sm font-mono">{stop.year}</div>
                  <div className="text-text-secondary/70 text-xs">{lt(stop.place as LocaleText, locale)}</div>
                </div>
                <div className="text-text-secondary text-sm leading-relaxed">{lt(stop.event as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 ═══ */}
        <LessonSection number={6} title={t('s6Title')}>
          <p>{t('s6Body')}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Cpu className="w-5 h-5" />, label: { en: 'Binary Code', hi: 'बाइनरी कोड' }, dep: { en: 'Requires 0 and 1', hi: '0 और 1 आवश्यक' } },
              { icon: <Globe className="w-5 h-5" />, label: { en: 'GPS', hi: 'जीपीएस' }, dep: { en: 'Continuous calculus', hi: 'निरंतर कलन' } },
              { icon: <Circle className="w-5 h-5" />, label: { en: 'Calculus', hi: 'कलन' }, dep: { en: 'Limits → 0', hi: 'सीमाएँ → 0' } },
              { icon: <ArrowRight className="w-5 h-5" />, label: { en: 'Algebra', hi: 'बीजगणित' }, dep: { en: 'Equations need 0', hi: 'समीकरणों को 0 चाहिए' } },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/[0.03] border border-gold-primary/15 p-4 text-center"
              >
                <div className="text-gold-primary flex justify-center mb-2">{item.icon}</div>
                <div className="text-gold-light font-semibold text-sm">{lt(item.label as LocaleText, locale)}</div>
                <div className="text-text-secondary text-xs mt-1">{lt(item.dep as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 7 ═══ */}
        <LessonSection number={7} title={t('s7Title')} variant="formula">
          <p>{t('s7Body')}</p>
          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="text-amber-400 font-semibold text-sm mb-1">
              {hi ? 'ब्रह्मगुप्त की एकमात्र त्रुटि:' : "Brahmagupta's one error:"}
            </div>
            <div className="font-mono text-text-primary">0 ÷ 0 = 0 &nbsp;<span className="text-red-400">✗</span></div>
            <div className="text-text-secondary text-xs mt-2">
              {hi ? 'भास्कर II (1150 ईस्वी): n ÷ 0 = अनन्त (∞) जहाँ n≠0 — यह भी पूरी तरह सही नहीं, लेकिन करीब था।' : 'Bhaskara II (1150 CE): n ÷ 0 = ananta (∞) where n≠0 — still not fully correct, but closer.'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 8 ═══ */}
        <LessonSection number={8} title={t('s8Title')} variant="highlight">
          <p>{t('s8Body')}</p>
        </LessonSection>

        {/* ═══ SANSKRIT TERMS ═══ */}
        <LessonSection title={hi ? 'मुख्य संस्कृत शब्द' : 'Key Sanskrit Terms'}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SANSKRIT_TERMS.map((term, i) => (
              <SanskritTermCard key={i} {...term} />
            ))}
          </div>
        </LessonSection>

        {/* ═══ NAVIGATION ═══ */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/learn/contributions"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gold-primary/20 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-sm font-medium"
          >
            ← {t('backToContributions')}
          </Link>
          <Link
            href="/learn/contributions/pi"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {hi ? 'अगला: π और आर्यभट' : 'Next: π and Aryabhata'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
