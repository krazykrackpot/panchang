import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Circle, Cpu, Globe } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';

/* ═══════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ═══════════════════════════════════════════════════════════════ */
const L = {
  title: { en: 'Zero — The Most Dangerous Idea in History', hi: 'शून्य — इतिहास का सबसे खतरनाक विचार' },
  subtitle: {
    en: "What's the most important invention in human history? Not the wheel. Not fire. Not electricity. It's a number that represents nothing — and it was invented in India.",
    hi: 'मानव इतिहास का सबसे महत्वपूर्ण आविष्कार क्या है? न पहिया, न आग, न बिजली। यह एक संख्या है जो शून्यता को दर्शाती है — और यह भारत में आविष्कृत हुई।',
  },

  s1Title: { en: 'Before Zero, Mathematics Was Crippled', hi: 'शून्य से पहले, गणित अपंग था' },
  s1Body: {
    en: "Before Brahmagupta defined zero in 628 CE, the world used placeholder zeros — a gap, a dot, a symbol meaning 'nothing here.' No civilization had the audacity to call Nothing a number in its own right, with its own arithmetic. The Romans couldn't divide MMCXLVII by III without a counting board. They had no zero. The Greeks, for all their geometry, were paralyzed by the concept. Then came India.",
    hi: 'ब्रह्मगुप्त ने 628 ईस्वी में शून्य को परिभाषित करने से पहले, दुनिया स्थान-धारक शून्य का उपयोग करती थी — एक अंतराल, एक बिंदु, एक प्रतीक जिसका अर्थ था "यहाँ कुछ नहीं है।" किसी भी सभ्यता में शून्यता को अपने अंकगणित के साथ एक स्वतंत्र संख्या कहने का साहस नहीं था। फिर भारत आया।',
  },

  s2Title: { en: 'Brahmagupta — The Man Who Defined Nothing', hi: 'ब्रह्मगुप्त — जिसने शून्य को परिभाषित किया' },
  s2Intro: {
    en: "In 628 CE, Brahmagupta wrote the Brahmasphutasiddhanta. Chapter 18 — titled 'Kuttaka' — contains the first formal rules for zero arithmetic ever written. He called zero 'shunya' (void) and treated it as a full number. He gave six rules:",
    hi: '628 ईस्वी में, ब्रह्मगुप्त ने ब्रह्मस्फुटसिद्धान्त लिखा। अध्याय 18 — जिसका शीर्षक "कुट्टक" है — में शून्य अंकगणित के पहले औपचारिक नियम हैं। उन्होंने शून्य को "शून्य" (रिक्त) कहा और इसे एक पूर्ण संख्या के रूप में माना।',
  },
  s2QuoteMain: { en: 'शून्यं शून्येन संयुक्तं शून्यम्', hi: 'शून्यं शून्येन संयुक्तं शून्यम्' },
  s2QuoteTrans: { en: 'Zero plus zero equals zero.', hi: 'शून्य जमा शून्य = शून्य।' },

  s3Title: { en: 'The Bakhshali Manuscript — Zero Gets Older', hi: 'बख्शाली पाण्डुलिपि — शून्य और पुराना हो गया' },
  s3Body: {
    en: 'In 1881, a farmer near Peshawar dug up a manuscript written on birch bark. In 2017, Oxford University carbon-dated it to approximately 300 CE — pushing the physical record of zero back 300 years before Brahmagupta. The manuscript uses a dot (·) as a placeholder zero, showing the evolution from positional placeholder to the abstract number zero. The oldest zero dot on Earth was written in India.',
    hi: '1881 में, पेशावर के पास एक किसान ने भोजपत्र पर लिखी एक पांडुलिपि खोदी। 2017 में, ऑक्सफोर्ड विश्वविद्यालय ने इसे कार्बन-डेटिंग से लगभग 300 ईस्वी का बताया — ब्रह्मगुप्त से 300 साल पहले शून्य का भौतिक रिकॉर्ड पीछे धकेलते हुए। पृथ्वी पर सबसे पुराना शून्य बिंदु भारत में लिखा गया था।',
  },

  s4Title: { en: 'Placeholder vs. Number — The Crucial Difference', hi: 'स्थान-धारक बनाम संख्या — महत्वपूर्ण अंतर' },
  s4Body: {
    en: "Every civilization that used positional notation needed a placeholder — a symbol saying 'this column is empty.' The Babylonians had it. The Maya had it. But India did something NO OTHER civilization did: they made zero a NUMBER. Zero could be added, subtracted, multiplied. It had rules. It was on equal footing with 1, 2, 3... This leap — from placeholder to number — is what gave us the entire modern number system.",
    hi: "पोजिशनल नोटेशन का उपयोग करने वाली हर सभ्यता को एक स्थान-धारक की जरूरत थी — एक प्रतीक जो कहे 'यह कॉलम खाली है।' बेबीलोनियाई के पास था, माया के पास था। लेकिन भारत ने कुछ ऐसा किया जो किसी अन्य सभ्यता ने नहीं किया: उन्होंने शून्य को एक संख्या बनाया। यह छलांग — स्थान-धारक से संख्या तक — ने हमें पूरी आधुनिक संख्या प्रणाली दी।",
  },

  s5Title: { en: "Zero's Journey West — India to Baghdad to Florence", hi: 'शून्य की पश्चिम यात्रा — भारत से बगदाद से फ्लोरेंस' },
  s5Body: {
    en: "India → Baghdad: Al-Khwarizmi studied Indian numerals in 825 CE and wrote 'Algoritmi de numero Indorum' ('Al-Khwarizmi on the Numbers of the Indians'). His name became 'algorithm.' His subject became 'algebra.' Baghdad → Europe: Leonardo Fibonacci encountered Indian numerals in North Africa and published Liber Abaci in 1202 CE, introducing Hindu-Arabic numerals to Europe. Europe resisted HARD: Florence banned the new 'Saracen numerals' in 1299 CE — merchants were ordered to use Roman numerals or write numbers in words. The Church considered zero dangerous (how can God be Nothing?). It took 300 years to overcome the resistance.",
    hi: 'भारत → बगदाद: अल-ख्वारिज्मी ने 825 ईस्वी में भारतीय अंकों का अध्ययन किया और "अल्गोरिटमी दे नुमेरो इंडोरम" लिखी। उनका नाम "एल्गोरिदम" बन गया। बगदाद → यूरोप: लियोनार्डो फिबोनाची ने 1202 ईस्वी में लिबर अबासी प्रकाशित की। यूरोप ने कड़ा प्रतिरोध किया: फ्लोरेंस ने 1299 ईस्वी में नए "सारासेन अंकों" पर प्रतिबंध लगा दिया। प्रतिरोध को दूर करने में 300 साल लगे।',
  },

  s6Title: { en: 'Without Zero: No Digital Age at All', hi: 'शून्य के बिना: कोई डिजिटल युग नहीं' },
  s6Body: {
    en: 'Binary computing (0s and 1s) is literally impossible without zero as a number. Positional arithmetic is impossible — you cannot write 100 without zero. Calculus requires limits approaching zero. GPS satellites do continuous calculus. Every transistor switches between zero and one. Your phone has ~16 billion transistors. Each switch requires the concept of zero. The entire digital civilization rests on this single Indian idea.',
    hi: 'बाइनरी कंप्यूटिंग (0 और 1) शून्य के बिना शाब्दिक रूप से असंभव है। पोजिशनल अंकगणित असंभव है — आप शून्य के बिना 100 नहीं लिख सकते। कलन (कैलकुलस) के लिए शून्य की सीमा आवश्यक है। GPS उपग्रह निरंतर कलन करते हैं। आपके फोन में ~1.6 अरब ट्रांजिस्टर हैं। प्रत्येक स्विच के लिए शून्य की अवधारणा आवश्यक है।',
  },

  s7Title: { en: 'The One Rule Brahmagupta Got Wrong', hi: 'एकमात्र नियम जो ब्रह्मगुप्त से गलत हुआ' },
  s7Body: {
    en: "Brahmagupta was so bold that he even tried to define 0÷0 = 0. This is wrong — 0/0 is undefined. It took Bhaskara II (1150 CE) to refine this: he introduced the concept of infinity (ananta) for n÷0 (where n≠0). Even the errors were productive. The struggle with division by zero eventually led directly to calculus, limits, and L'Hôpital's rule. A wrong answer in 628 CE seeded the mathematical revolution of the 1600s.",
    hi: 'ब्रह्मगुप्त इतने साहसी थे कि उन्होंने 0÷0 = 0 भी परिभाषित करने की कोशिश की। यह गलत है — 0/0 अपरिभाषित है। इसे परिष्कृत करने में भास्कर II (1150 ईस्वी) को समय लगा। एक गलत उत्तर ने 1600 के दशक की गणितीय क्रांति को प्रेरित किया।',
  },

  s8Title: { en: 'Zero in Our App', hi: 'हमारे ऐप में शून्य' },
  s8Body: {
    en: 'Every astronomical calculation in this app depends on the positional number system India gave the world. The Julian Day Number — a continuous count of days since 4713 BCE — starts at zero. Longitude coordinates use signed decimals (which require negative numbers and zero). The Kali Ahargana is a count from zero. Without zero, there is no Panchang.',
    hi: 'इस ऐप में हर खगोलीय गणना भारत द्वारा दी गई पोजिशनल संख्या प्रणाली पर निर्भर करती है। जूलियन डे नंबर — 4713 ईसा पूर्व से दिनों की निरंतर गिनती — शून्य से शुरू होती है। कलि अहर्गण शून्य से एक गिनती है। शून्य के बिना, कोई पंचांग नहीं।',
  },

  backToContributions: { en: 'Back to Contributions', hi: 'योगदान पर वापस' },
  exploreMore: { en: 'Continue Exploring', hi: 'और जानें' },
};

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
  const hi = locale === 'hi';
  const t = (obj: { en: string; hi: string }) => hi ? obj.hi : obj.en;

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
        <LessonSection number={1} title={t(L.s1Title)} variant="highlight">
          <p>{t(L.s1Body)}</p>
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
                <div className="text-text-secondary text-sm">{t(item.problem)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 ═══ */}
        <LessonSection number={2} title={t(L.s2Title)}>
          <p>{t(L.s2Intro)}</p>

          <div
            className="my-6 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center"
          >
            <div
              className="text-2xl sm:text-3xl text-gold-primary font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              {t(L.s2QuoteMain)}
            </div>
            <div className="text-gold-light/70 text-sm italic">{t(L.s2QuoteTrans)}</div>
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
                <span className="text-text-primary text-sm flex-1">{t(item.rule)}</span>
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
        <LessonSection number={3} title={t(L.s3Title)} variant="highlight">
          <p>{t(L.s3Body)}</p>
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
        <LessonSection number={4} title={t(L.s4Title)}>
          <p>{t(L.s4Body)}</p>
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
                    <td className="py-3 px-3 text-text-secondary">{t(row.type)}</td>
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
        <LessonSection number={5} title={t(L.s5Title)} variant="highlight">
          <p>{t(L.s5Body)}</p>
          <div className="mt-6 space-y-4">
            {JOURNEY.map((stop, i) => (
              <div
                key={i}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${stop.color} px-4 py-4`}
              >
                <div className="flex-shrink-0">
                  <div className="text-gold-primary font-bold text-sm font-mono">{stop.year}</div>
                  <div className="text-text-secondary/70 text-xs">{t(stop.place)}</div>
                </div>
                <div className="text-text-secondary text-sm leading-relaxed">{t(stop.event)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 ═══ */}
        <LessonSection number={6} title={t(L.s6Title)}>
          <p>{t(L.s6Body)}</p>
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
                <div className="text-gold-light font-semibold text-sm">{t(item.label)}</div>
                <div className="text-text-secondary text-xs mt-1">{t(item.dep)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 7 ═══ */}
        <LessonSection number={7} title={t(L.s7Title)} variant="formula">
          <p>{t(L.s7Body)}</p>
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
        <LessonSection number={8} title={t(L.s8Title)} variant="highlight">
          <p>{t(L.s8Body)}</p>
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
            ← {t(L.backToContributions)}
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
