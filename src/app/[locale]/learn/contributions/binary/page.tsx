import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Binary } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';

/* ═══════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ═══════════════════════════════════════════════════════════════ */
const L = {
  title: { en: 'Binary Code — 1,800 Years Before Computers', hi: 'बाइनरी कोड — कंप्यूटर से 1,800 साल पहले' },
  subtitle: {
    en: "Every computer runs on binary — 0s and 1s. The inventor of binary? Not Leibniz (1703). It was Pingala, an Indian mathematician who lived around 200 BCE. He wasn't trying to build a computer. He was studying poetry.",
    hi: 'हर कंप्यूटर बाइनरी पर चलता है — 0 और 1। बाइनरी का आविष्कारक? लाइबनिज (1703) नहीं। यह पिंगल था, एक भारतीय गणितज्ञ जो लगभग 200 ईसा पूर्व जीते थे। वह कंप्यूटर नहीं बना रहे थे। वे कविता का अध्ययन कर रहे थे।',
  },

  s1Title: { en: "Pingala's Chandahshastra — A Poetry Manual That Invented Binary", hi: 'पिंगल का छन्दःशास्त्र — एक काव्य नियमावली जिसने बाइनरी का आविष्कार किया' },
  s1Body: {
    en: "Chandahshastra (~200 BCE) is a treatise on Sanskrit prosody — the mathematical analysis of poetic meters. Sanskrit poetry is built from syllables that are either laghu (short, light) or guru (long, heavy). Pingala needed a systematic way to catalogue all possible combinations of short and long syllables in a line of poetry. His solution was binary encoding.",
    hi: 'छन्दःशास्त्र (~200 ईसा पूर्व) संस्कृत छन्दशास्त्र पर एक ग्रन्थ है — काव्य वृत्तों का गणितीय विश्लेषण। संस्कृत कविता उन अक्षरों से बनती है जो या तो लघु (छोटा, हल्का) या गुरु (लंबा, भारी) हैं। पिंगल को एक पंक्ति में लघु और गुरु अक्षरों के सभी संभावित संयोजनों को सूचीबद्ध करने का व्यवस्थित तरीका चाहिए था। उनका समाधान बाइनरी एन्कोडिंग था।',
  },

  s2Title: { en: 'Laghu = 0, Guru = 1 — The Binary Encoding', hi: 'लघु = 0, गुरु = 1 — बाइनरी एन्कोडिंग' },
  s2Body: {
    en: 'Pingala assigned: laghu (light syllable) = 0, guru (heavy syllable) = 1. A line of n syllables has 2ⁿ possible patterns. He catalogued all of them — systematically, using what is unmistakably a binary number system. He also gave an algorithm for converting between the position of a pattern in his list and its binary representation. This algorithm is equivalent to modern binary-to-decimal conversion.',
    hi: 'पिंगल ने नियत किया: लघु (हल्का अक्षर) = 0, गुरु (भारी अक्षर) = 1। n अक्षरों वाली एक पंक्ति में 2ⁿ संभावित पैटर्न हैं। उन्होंने सभी को सूचीबद्ध किया — व्यवस्थित रूप से, जो निःसंदेह एक बाइनरी संख्या प्रणाली का उपयोग करते हुए।',
  },

  s3Title: { en: 'The Sutra: "Dvih Shunye" — Counting in Binary', hi: 'सूत्र: "द्विः शून्ये" — बाइनरी में गिनना' },
  s3Body: {
    en: "The key sutra is cryptic, as sutras are meant to be: \"द्विः शून्ये\" (dviḥ śūnye) — 'two in the zero/empty place.' This encodes the rule for binary counting: when you reach 2 in a position, write 0 and carry 1 to the next position. This is precisely how binary numbers work. Written ~200 BCE. Rediscovered in the West by Leibniz in 1703 CE — 1,900 years later.",
    hi: 'मुख्य सूत्र रहस्यमय है, जैसा सूत्रों को होना चाहिए: "द्विः शून्ये" (dviḥ śūnye) — "शून्य/रिक्त स्थान में दो।" यह बाइनरी गिनती के नियम को एन्कोड करता है: जब किसी स्थान पर 2 आए, 0 लिखें और अगले स्थान पर 1 ले जाएं। यह ठीक वैसे ही है जैसे बाइनरी संख्याएँ काम करती हैं।',
  },

  s4Title: { en: 'Meru Prastara — Pascal\'s Triangle, 1,800 Years Early', hi: 'मेरु प्रस्तार — पास्कल का त्रिभुज, 1,800 वर्ष पहले' },
  s4Body: {
    en: "Pingala's 'Meru Prastara' (mountain arrangement) describes what Europe calls Pascal's Triangle. The triangle gives the number of ways to choose k items from n (binomial coefficients). Pingala used it to count how many meters of n syllables have exactly k gurus (heavies). Blaise Pascal published 'his' triangle in 1653 CE. Pingala had it in ~200 BCE. It is correctly called the Pingala-Pascal triangle.",
    hi: 'पिंगल का "मेरु प्रस्तार" (पर्वत व्यवस्था) वह वर्णन करता है जिसे यूरोप पास्कल का त्रिभुज कहता है। ब्लेज़ पास्कल ने "अपना" त्रिभुज 1653 ईस्वी में प्रकाशित किया। पिंगल के पास यह ~200 ईसा पूर्व था। इसे सही ढंग से पिंगल-पास्कल त्रिभुज कहा जाता है।',
  },

  s5Title: { en: "Fibonacci Numbers — 600 Years Before Fibonacci", hi: 'फिबोनाची संख्याएँ — फिबोनाची से 600 वर्ष पहले' },
  s5Body: {
    en: 'Pingala\'s "Mishrau cha" (mixing rule) generates what we call Fibonacci numbers. He observed that the number of meters with n syllables equals the sum of meters with (n-1) and (n-2) syllables. This is the Fibonacci recurrence: F(n) = F(n-1) + F(n-2). Leonardo Fibonacci published this sequence in Europe in 1202 CE. Pingala had it around 200 BCE. It is correctly called the Pingala-Fibonacci sequence.',
    hi: 'पिंगल का "मिश्रौ च" (मिश्रण नियम) वह उत्पन्न करता है जिसे हम फिबोनाची संख्याएँ कहते हैं। लियोनार्डो फिबोनाची ने यह अनुक्रम 1202 ईस्वी में प्रकाशित किया। पिंगल के पास यह लगभग 200 ईसा पूर्व था।',
  },

  s6Title: { en: 'Leibniz, the I Ching, and the Indian Connection', hi: 'लाइबनिज, I Ching, और भारतीय संबंध' },
  s6Body: {
    en: "Leibniz developed binary arithmetic in 1679–1703 CE. He was inspired partly by the Chinese I Ching (Book of Changes), which uses hexagrams of broken (0) and unbroken (1) lines. Chinese scholars believe the I Ching's binary structure was influenced by Indian mathematical traditions transmitted via Buddhist monks. The trail from Pingala to Leibniz runs through 1,900 years of mathematical transmission across Asia. Whether Leibniz reinvented it independently or not, Pingala was first.",
    hi: 'लाइबनिज ने 1679–1703 ईस्वी में बाइनरी अंकगणित विकसित किया। वे आंशिक रूप से चीनी I Ching से प्रेरित थे। चीनी विद्वानों का मानना है कि I Ching की बाइनरी संरचना भारतीय गणितीय परम्पराओं से प्रभावित थी। पिंगल से लाइबनिज तक का मार्ग एशिया में 1,900 वर्षों की गणितीय प्रसारण से होकर जाता है।',
  },

  s7Title: { en: 'Binary in Every Device You Own', hi: 'आपके पास मौजूद हर डिवाइस में बाइनरी' },
  s7Body: {
    en: 'Your smartphone has 16+ billion transistors. Each transistor is a switch: on (1) or off (0). Every character in this sentence was transmitted as binary. Every image is binary. Every computation is binary. The entire digital civilization — from this web page to the Mars rovers — runs on the fundamental insight that Pingala encoded into Sanskrit poetry around 200 BCE: information can be represented as sequences of two states.',
    hi: 'आपके स्मार्टफोन में 16+ अरब ट्रांजिस्टर हैं। प्रत्येक ट्रांजिस्टर एक स्विच है: चालू (1) या बंद (0)। यह पूरी डिजिटल सभ्यता उस मूलभूत अंतर्दृष्टि पर चलती है जिसे पिंगल ने लगभग 200 ईसा पूर्व संस्कृत काव्य में एन्कोड किया था।',
  },

  s8Title: { en: 'Binary in Jyotish — Odd/Even, Light/Dark', hi: 'ज्योतिष में बाइनरी — विषम/सम, प्रकाश/अंधकार' },
  s8Body: {
    en: "Vedic astrology uses fundamental binary distinctions: Shukla Paksha (bright fortnight, waxing moon) vs. Krishna Paksha (dark fortnight, waning moon). Odd vs. even tithis. Masculine vs. feminine rashis. Day vs. night charts (Diurnal/Nocturnal). Benefic vs. malefic planets. The binary logic of Pingala runs throughout the philosophical framework of Jyotish.",
    hi: 'वैदिक ज्योतिष मूलभूत बाइनरी भेदों का उपयोग करती है: शुक्ल पक्ष (उज्ज्वल पखवाड़ा, वर्धमान चंद्रमा) बनाम कृष्ण पक्ष (अंधेरा पखवाड़ा, क्षीण चंद्रमा)। विषम बनाम सम तिथियाँ। पुरुष बनाम स्त्री राशियाँ। पिंगल का बाइनरी तर्क ज्योतिष के दार्शनिक ढाँचे में व्याप्त है।',
  },

  backToContributions: { en: 'Back to Contributions', hi: 'योगदान पर वापस' },
  next: { en: 'Next: Cosmic Time', hi: 'अगला: ब्रह्माण्डीय समय' },
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const BINARY_EXAMPLES = [
  { pattern: 'L L', binary: '0 0', meter: { en: '2-syllable: both light', hi: '2-अक्षर: दोनों लघु' } },
  { pattern: 'L G', binary: '0 1', meter: { en: '2-syllable: light-heavy', hi: '2-अक्षर: लघु-गुरु' } },
  { pattern: 'G L', binary: '1 0', meter: { en: '2-syllable: heavy-light', hi: '2-अक्षर: गुरु-लघु' } },
  { pattern: 'G G', binary: '1 1', meter: { en: '2-syllable: both heavy', hi: '2-अक्षर: दोनों गुरु' } },
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
  const hi = locale === 'hi';
  const t = (obj: { en: string; hi: string }) => hi ? obj.hi : obj.en;

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
              {t(L.title)}
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {t(L.subtitle)}
            </p>
            <div className="flex justify-center mt-4">
              <ShareRow pageTitle={t(L.title)} locale={locale} />
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
                {hi ? '"INDIA" बाइनरी में — पिंगल, ~200 ईसा पूर्व से शुरू हुई' : '"INDIA" in binary — a tradition started by Pingala, ~200 BCE'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1 ═══ */}
        <LessonSection number={1} title={t(L.s1Title)} variant="highlight">
          <p>{t(L.s1Body)}</p>
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
              {hi ? 'संस्कृत काव्य छन्दों की गणितीय नियमावली' : 'Mathematical treatise on Sanskrit poetic meters'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 ═══ */}
        <LessonSection number={2} title={t(L.s2Title)}>
          <p>{t(L.s2Body)}</p>
          <div className="mt-6 overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{hi ? 'छन्द पैटर्न' : 'Meter Pattern'}</th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{hi ? 'बाइनरी' : 'Binary'}</th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold hidden sm:table-cell">{hi ? 'विवरण' : 'Description'}</th>
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
                    <td className="py-3 px-3 text-text-secondary hidden sm:table-cell">{t(row.meter)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-secondary/60 mt-3 italic">
            {hi ? 'L = लघु (छोटा, light = 0), G = गुरु (लंबा, heavy = 1)' : 'L = laghu (short, light = 0), G = guru (long, heavy = 1)'}
          </p>
        </LessonSection>

        {/* ═══ SECTION 3 ═══ */}
        <LessonSection number={3} title={t(L.s3Title)} variant="highlight">
          <p>{t(L.s3Body)}</p>
          <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center">
            <div
              className="text-3xl text-gold-primary font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              द्विः शून्ये
            </div>
            <div className="text-gold-light font-semibold">"dviḥ śūnye"</div>
            <div className="text-text-secondary text-sm mt-2">
              {hi ? '"शून्य/रिक्त स्थान में दो" — बाइनरी गिनती का नियम' : '"Two in the zero/empty place" — the binary counting rule'}
            </div>
            <div className="mt-3 font-mono text-text-secondary/70 text-xs">
              {hi ? 'जब किसी स्थान में 2 आए → 0 लिखें, अगले स्थान पर 1 ले जाएं' : 'When a position reaches 2 → write 0, carry 1 to the next position'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4: Meru Prastara ═══ */}
        <LessonSection number={4} title={t(L.s4Title)}>
          <p>{t(L.s4Body)}</p>
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
              {hi ? 'पिंगल का मेरु प्रस्तार (~200 ईसा पूर्व) = पास्कल का त्रिभुज (1653 ईस्वी से 1,850 वर्ष पहले)' : "Pingala's Meru Prastara (~200 BCE) = Pascal's Triangle (1,850 years before Pascal's 1653 CE)"}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 5 ═══ */}
        <LessonSection number={5} title={t(L.s5Title)} variant="highlight">
          <p>{t(L.s5Body)}</p>
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
              {hi ? 'पिंगल-फिबोनाची अनुक्रम: F(n) = F(n-1) + F(n-2)' : 'Pingala-Fibonacci sequence: F(n) = F(n-1) + F(n-2)'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 ═══ */}
        <LessonSection number={6} title={t(L.s6Title)}>
          <p>{t(L.s6Body)}</p>
        </LessonSection>

        {/* ═══ SECTION 7 ═══ */}
        <LessonSection number={7} title={t(L.s7Title)} variant="formula">
          <p>{t(L.s7Body)}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: { en: 'Transistors in your phone', hi: 'फोन में ट्रांजिस्टर' }, val: '16B+', sub: { en: 'all binary switches', hi: 'सब बाइनरी स्विच' } },
              { label: { en: 'Web pages online', hi: 'ऑनलाइन वेब पेज' }, val: '~5.5B', sub: { en: 'all transmitted as binary', hi: 'सब बाइनरी में' } },
              { label: { en: 'ASCII characters', hi: 'ASCII अक्षर' }, val: '128', sub: { en: '7-bit binary', hi: '7-बिट बाइनरी' } },
              { label: { en: 'Colors on screen', hi: 'स्क्रीन पर रंग' }, val: '16.7M', sub: { en: '24-bit binary', hi: '24-बिट बाइनरी' } },
            ].map((item, i) => (
              <div key={i} className="rounded-lg bg-white/[0.03] border border-gold-primary/10 p-3 text-center">
                <div className="text-gold-primary font-bold text-lg">{item.val}</div>
                <div className="text-gold-light text-xs font-medium mt-1">{t(item.label)}</div>
                <div className="text-text-secondary/60 text-xs mt-0.5">{t(item.sub)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 8 ═══ */}
        <LessonSection number={8} title={t(L.s8Title)} variant="highlight">
          <p>{t(L.s8Body)}</p>
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
            href="/learn/contributions/pi"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gold-primary/20 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-sm font-medium"
          >
            ← {hi ? 'पिछला: π और आर्यभट' : 'Previous: π and Aryabhata'}
          </Link>
          <Link
            href="/learn/contributions/cosmic-time"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {t(L.next)} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
