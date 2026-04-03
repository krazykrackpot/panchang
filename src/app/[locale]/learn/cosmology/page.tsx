'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Clock, Infinity as InfinityIcon, Sparkles } from 'lucide-react';
import type { Locale } from '@/types/panchang';

/* ═══════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi) via ternaries on locale
   ═══════════════════════════════════════════════════════════════ */
const L = {
  title: { en: 'Hindu Cosmological Time Scales', hi: 'हिन्दू ब्रह्माण्डीय कालमान' },
  subtitle: {
    en: 'The only ancient civilization that measured time in BILLIONS of years — matching modern cosmology 2,000 years before the telescope.',
    hi: 'एकमात्र प्राचीन सभ्यता जिसने समय को अरबों वर्षों में मापा — दूरबीन से 2,000 वर्ष पहले आधुनिक ब्रह्माण्ड विज्ञान से मेल खाती।',
  },

  /* Section 1 */
  s1Title: { en: 'The Scale That Awed Scientists', hi: 'वह पैमाना जिसने वैज्ञानिकों को चकित किया' },
  s1Quote: {
    en: '"The Hindu religion is the only one of the world\'s great faiths dedicated to the idea that the Cosmos itself undergoes an immense, indeed an infinite, number of deaths and rebirths."',
    hi: '"हिन्दू धर्म विश्व के महान धर्मों में एकमात्र है जो इस विचार को समर्पित है कि ब्रह्माण्ड स्वयं असीम मृत्यु और पुनर्जन्मों से गुजरता है।"',
  },
  s1Attr: { en: '— Carl Sagan, Cosmos (1980)', hi: '— कार्ल सेगन, कॉस्मॉस (1980)' },
  s1Body: {
    en: 'No other ancient civilization conceived of time on this scale. While Greek, Roman, and Biblical traditions measured creation in thousands of years, Vedic cosmology spoke of billions — with a cyclic model of creation and dissolution that resonates with cutting-edge physics today.',
    hi: 'किसी अन्य प्राचीन सभ्यता ने इस पैमाने पर समय की कल्पना नहीं की। जहाँ ग्रीक, रोमन और बाइबिल परम्पराओं ने सृष्टि को हजारों वर्षों में मापा, वैदिक ब्रह्माण्ड विज्ञान ने अरबों की बात की — सृष्टि और प्रलय के चक्रीय मॉडल के साथ जो आज के अत्याधुनिक भौतिकी से मेल खाता है।',
  },

  /* Section 2 */
  s2Title: { en: 'From Truti to Brahma — The Full Scale', hi: 'त्रुटि से ब्रह्मा तक — सम्पूर्ण पैमाना' },
  s2Intro: {
    en: 'The Surya Siddhanta (~400 CE) defined time units ranging from microseconds to trillions of years. The smallest unit, Truti, is in the range of atomic clock precision — defined over 1,600 years ago.',
    hi: 'सूर्य सिद्धान्त (~400 ई.) ने माइक्रोसेकंड से लेकर खरबों वर्षों तक की समय इकाइयाँ परिभाषित कीं। सबसे छोटी इकाई, त्रुटि, परमाणु घड़ी की सटीकता की सीमा में है — 1,600 वर्ष पहले परिभाषित।',
  },

  /* Section 3 */
  s3Title: { en: 'The Four Yugas — Ages of Humanity', hi: 'चार युग — मानवता की अवस्थाएँ' },
  s3Intro: {
    en: 'Time cycles through four ages (Yugas) in a mathematically perfect 4:3:2:1 ratio. Each successive age sees a decline in dharma, lifespan, and human virtue. Together they form one Maha Yuga of 4,320,000 years.',
    hi: 'समय चार युगों में गणितीय रूप से सटीक 4:3:2:1 अनुपात में चक्रित होता है। प्रत्येक आगामी युग में धर्म, आयु और मानवीय सद्गुणों में ह्रास होता है। मिलकर ये एक महायुग 43,20,000 वर्ष बनाते हैं।',
  },

  /* Section 4 */
  s4Title: { en: 'Manvantara & Kalpa — Brahma\'s Day', hi: 'मन्वन्तर एवं कल्प — ब्रह्मा का दिन' },
  s4Comparison: {
    en: 'One Kalpa = 4.32 billion years. Earth\'s actual age = 4.54 billion years. The Hindu concept of Brahma\'s "day" is within 5% of Earth\'s scientifically measured age.',
    hi: 'एक कल्प = 4.32 अरब वर्ष। पृथ्वी की वास्तविक आयु = 4.54 अरब वर्ष। ब्रह्मा के "दिन" की हिन्दू अवधारणा पृथ्वी की वैज्ञानिक रूप से मापी गई आयु के 5% के भीतर है।',
  },

  /* Section 5 */
  s5Title: { en: 'Brahma\'s Lifespan — The Ultimate Scale', hi: 'ब्रह्मा की आयु — चरम पैमाना' },

  /* Section 6 */
  s6Title: { en: 'Why This Matters for Jyotish', hi: 'ज्योतिष के लिए यह क्यों महत्वपूर्ण है' },
  s6Body: {
    en: 'The Sankalpa (puja resolution) places you precisely in this cosmic timeline. When a priest recites "Shri Shveta Varaha Kalpe, Vaivasvata Manvantare, Ashtavimshatitame Kaliyuge..." — he is specifying your exact position across billions of years of cosmic time. The Kali Ahargana (days elapsed since the start of Kali Yuga) is the mathematical foundation for all Panchang calculations.',
    hi: 'सङ्कल्प (पूजा संकल्प) आपको इस ब्रह्माण्डीय समयरेखा में सटीक रूप से स्थापित करता है। जब पुरोहित "श्री श्वेतवाराहकल्पे, वैवस्वतमन्वन्तरे, अष्टाविंशतितमे कलियुगे..." का पाठ करते हैं — वे अरबों वर्षों में आपकी सटीक स्थिति निर्दिष्ट कर रहे हैं। कलि अहर्गण (कलियुग आरम्भ से बीते दिन) सभी पंचांग गणनाओं का गणितीय आधार है।',
  },

  /* Section 7 */
  s7Title: { en: 'What No Other Civilization Conceived', hi: 'जो किसी अन्य सभ्यता ने नहीं सोचा' },

  /* Navigation */
  backToLearn: { en: 'Back to Learn', hi: 'सीखने पर वापस' },
  exploreMore: { en: 'Continue Exploring', hi: 'और जानें' },
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const TIME_UNITS = [
  { unit: 'Truti (त्रुटि)', duration: '29.6 microseconds', modern: 'Atomic clock range', wow: { en: 'Surya Siddhanta defined this ~1,600 years ago', hi: 'सूर्य सिद्धान्त ने ~1,600 वर्ष पहले परिभाषित किया' } },
  { unit: 'Tatpara (तत्पर)', duration: '100 Trutis = 2.96 ms', modern: 'Reflex speed', wow: null },
  { unit: 'Nimesha (निमेष)', duration: '45 Tatparas = 133 ms', modern: 'Eye blink', wow: { en: '"Nimesha" literally means "blink"', hi: '"निमेष" का शाब्दिक अर्थ "पलक झपकना" है' } },
  { unit: 'Kashtha (काष्ठा)', duration: '18 Nimeshas = 2.4 s', modern: '', wow: null },
  { unit: 'Kala (कला)', duration: '30 Kashthas = 72 s', modern: '~1 minute', wow: null },
  { unit: 'Nadika (नाडिका)', duration: '15 Kalas = 1,080 s', modern: '18 minutes', wow: { en: 'Used in muhurta calculations', hi: 'मुहूर्त गणना में प्रयुक्त' } },
  { unit: 'Muhurta (मुहूर्त)', duration: '2 Nadis = 2,160 s', modern: '48 minutes', wow: { en: '30 muhurtas per day', hi: 'प्रतिदिन 30 मुहूर्त' } },
  { unit: 'Prahara (प्रहर)', duration: '7.5 Muhurtas', modern: '3 hours', wow: { en: '8 praharas per day', hi: 'प्रतिदिन 8 प्रहर' } },
  { unit: 'Ahoratra (अहोरात्र)', duration: '8 Praharas', modern: '24 hours', wow: { en: '"Aho" (day) + "Ratra" (night)', hi: '"अहो" (दिन) + "रात्र" (रात)' } },
  { unit: 'Paksha (पक्ष)', duration: '15 Ahoratras', modern: 'Fortnight', wow: { en: 'Shukla / Krishna', hi: 'शुक्ल / कृष्ण' } },
  { unit: 'Masa (मास)', duration: '2 Pakshas', modern: 'Month', wow: null },
  { unit: 'Ritu (ऋतु)', duration: '2 Masas', modern: 'Season', wow: { en: '6 ritus per year', hi: 'प्रतिवर्ष 6 ऋतुएँ' } },
  { unit: 'Ayana (अयन)', duration: '3 Ritus', modern: 'Half-year', wow: { en: 'Uttara / Dakshina', hi: 'उत्तर / दक्षिण' } },
  { unit: 'Varsha (वर्ष)', duration: '2 Ayanas', modern: 'Year', wow: null },
];

const YUGAS = [
  { name: 'Satya (Krita)', nameHi: 'सत्य (कृत)', years: '1,728,000', ratio: 4, dharma: 100, color: 'from-yellow-300 to-amber-400', barColor: 'bg-gradient-to-r from-yellow-300/80 to-amber-400/80', desc: { en: 'Golden age. Truth prevails. Humans live 100,000 years.', hi: 'स्वर्ण युग। सत्य प्रबल। मानव 1,00,000 वर्ष जीते हैं।' } },
  { name: 'Treta', nameHi: 'त्रेता', years: '1,296,000', ratio: 3, dharma: 75, color: 'from-gray-200 to-gray-400', barColor: 'bg-gradient-to-r from-gray-200/70 to-gray-400/70', desc: { en: 'Silver age. Dharma on 3 legs. Age of Ramayana.', hi: 'रजत युग। धर्म 3 पैरों पर। रामायण काल।' } },
  { name: 'Dwapara', nameHi: 'द्वापर', years: '864,000', ratio: 2, dharma: 50, color: 'from-amber-600 to-amber-800', barColor: 'bg-gradient-to-r from-amber-600/60 to-amber-800/60', desc: { en: 'Bronze age. Dharma on 2 legs. Mahabharata era.', hi: 'कांस्य युग। धर्म 2 पैरों पर। महाभारत काल।' } },
  { name: 'Kali', nameHi: 'कलि', years: '432,000', ratio: 1, dharma: 25, color: 'from-red-500 to-red-700', barColor: 'bg-gradient-to-r from-red-500/50 to-red-700/50', desc: { en: 'Iron age. Dharma on 1 leg. WE ARE HERE (started 3102 BCE).', hi: 'लौह युग। धर्म 1 पैर पर। हम यहाँ हैं (3102 ई.पू. से)।' } },
];

const SCALE_BARS = [
  { label: { en: 'Biblical Creation', hi: 'बाइबिल सृष्टि' }, years: 6000, display: '~6,000 yrs', color: 'bg-slate-500/60' },
  { label: { en: 'Greek/Roman Cosmos', hi: 'ग्रीक/रोमन सृष्टि' }, years: 5000, display: '~5,000 yrs', color: 'bg-blue-500/50' },
  { label: { en: 'Kali Yuga alone', hi: 'केवल कलियुग' }, years: 432000, display: '432,000 yrs', color: 'bg-red-500/50' },
  { label: { en: 'One Maha Yuga', hi: 'एक महायुग' }, years: 4320000, display: '4.32M yrs', color: 'bg-amber-500/50' },
  { label: { en: 'One Kalpa (Brahma\'s Day)', hi: 'एक कल्प (ब्रह्मा का दिन)' }, years: 4320000000, display: '4.32B yrs', color: 'bg-gradient-to-r from-gold-primary/60 to-amber-500/60' },
  { label: { en: 'Earth\'s Age (Science)', hi: 'पृथ्वी की आयु (विज्ञान)' }, years: 4540000000, display: '4.54B yrs', color: 'bg-emerald-500/50' },
  { label: { en: 'Universe Age (Science)', hi: 'ब्रह्माण्ड आयु (विज्ञान)' }, years: 13800000000, display: '13.8B yrs', color: 'bg-violet-500/50' },
  { label: { en: 'Brahma\'s Lifespan', hi: 'ब्रह्मा की आयु' }, years: 311040000000000, display: '311 Trillion yrs', color: 'bg-gradient-to-r from-gold-primary/80 to-yellow-300/80' },
];

const SANKALPA_LINE = 'श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे';

const CURRENT_POSITION = [
  { label: { en: 'Kalpa', hi: 'कल्प' }, value: { en: 'Shveta Varaha Kalpa', hi: 'श्वेतवाराह कल्प' } },
  { label: { en: 'Manvantara', hi: 'मन्वन्तर' }, value: { en: '7th — Vaivasvata', hi: '7वाँ — वैवस्वत' } },
  { label: { en: 'Maha Yuga', hi: 'महायुग' }, value: { en: '28th of this Manvantara', hi: 'इस मन्वन्तर का 28वाँ' } },
  { label: { en: 'Yuga', hi: 'युग' }, value: { en: 'Kali Yuga', hi: 'कलियुग' } },
  { label: { en: 'Year in Kali Yuga', hi: 'कलियुग में वर्ष' }, value: { en: '~5,128', hi: '~5,128' } },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function CosmologyPage() {
  const locale = useLocale() as Locale;
  const hi = locale === 'hi';

  const t = (obj: { en: string; hi: string }) => hi ? obj.hi : obj.en;

  /* log scale helper for the comparison bars */
  const logWidth = (years: number) => {
    const min = Math.log10(5000);
    const max = Math.log10(311040000000000);
    const pct = ((Math.log10(years) - min) / (max - min)) * 100;
    return Math.max(3, Math.min(100, pct));
  };

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Starfield background effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full bg-white/40"
              style={{ left: `${(i * 17 + 7) % 100}%`, top: `${(i * 23 + 11) % 100}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-primary/30 to-amber-500/10 border border-gold-primary/30 flex items-center justify-center">
                <InfinityIcon className="w-10 h-10 text-gold-primary" />
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
          </motion.div>

          {/* Animated number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7, type: 'spring' as const }}
            className="mt-10"
          >
            <div className="inline-flex flex-col items-center glass-card rounded-2xl px-8 py-6 border border-gold-primary/20">
              <span className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-gold-primary via-yellow-300 to-gold-primary bg-clip-text text-transparent"
                style={{ fontFamily: 'var(--font-heading)' }}>
                311,040,000,000,000
              </span>
              <span className="text-text-secondary mt-2 text-sm sm:text-base">
                {hi ? 'ब्रह्मा की आयु वर्षों में — 311 खरब वर्ष' : 'Brahma\'s lifespan in years — 311 TRILLION years'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1: The Scale That Awed Scientists ═══ */}
        <LessonSection number={1} title={t(L.s1Title)} variant="highlight">
          {/* Sagan Quote */}
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-l-4 border-gold-primary/50 pl-6 py-3 my-6 italic text-gold-light/90 text-lg sm:text-xl leading-relaxed"
          >
            {t(L.s1Quote)}
            <footer className="text-gold-primary/60 text-sm mt-2 not-italic font-semibold">{t(L.s1Attr)}</footer>
          </motion.blockquote>

          <p>{t(L.s1Body)}</p>

          {/* ── LOGARITHMIC SCALE COMPARISON ── */}
          <div className="mt-8 space-y-3">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider mb-4">
              {hi ? 'लघुगणकीय समय पैमाना तुलना' : 'Logarithmic Time Scale Comparison'}
            </h4>
            {SCALE_BARS.map((bar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs text-text-secondary/80 w-44 sm:w-56 text-right flex-shrink-0 truncate">
                    {t(bar.label)}
                  </span>
                  <div className="flex-1 relative h-7 rounded-md overflow-hidden bg-white/[0.03] border border-white/[0.05]">
                    <motion.div
                      className={`absolute inset-y-0 left-0 rounded-md ${bar.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${logWidth(bar.years)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: 'easeOut' as const }}
                    />
                    <span className="absolute inset-y-0 right-2 flex items-center text-xs font-mono text-white/70 font-semibold">
                      {bar.display}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            <p className="text-xs text-text-secondary/50 italic mt-2 text-center">
              {hi ? 'लघुगणकीय पैमाना — प्रत्येक चरण 10 गुना बड़ा है' : 'Logarithmic scale — each step is 10x larger'}
            </p>
          </div>
        </LessonSection>

        {/* ═══ SECTION 2: From Truti to Brahma ═══ */}
        <LessonSection number={2} title={t(L.s2Title)}>
          <p>{t(L.s2Intro)}</p>

          {/* Time units table */}
          <div className="mt-6 overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-3 px-2 text-gold-light font-semibold">{hi ? 'इकाई' : 'Unit'}</th>
                  <th className="text-left py-3 px-2 text-gold-light font-semibold">{hi ? 'अवधि' : 'Duration'}</th>
                  <th className="text-left py-3 px-2 text-gold-light font-semibold hidden sm:table-cell">{hi ? 'आधुनिक समतुल्य' : 'Modern Eq.'}</th>
                  <th className="text-left py-3 px-2 text-gold-light font-semibold hidden md:table-cell">{hi ? 'विशेष' : 'Note'}</th>
                </tr>
              </thead>
              <tbody>
                {TIME_UNITS.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/[0.04] hover:bg-gold-primary/[0.03] transition-colors"
                  >
                    <td className="py-2.5 px-2 font-medium text-text-primary whitespace-nowrap">{row.unit}</td>
                    <td className="py-2.5 px-2 font-mono text-xs text-amber-300/80">{row.duration}</td>
                    <td className="py-2.5 px-2 text-text-secondary/70 hidden sm:table-cell">{row.modern}</td>
                    <td className="py-2.5 px-2 text-text-secondary/50 text-xs italic hidden md:table-cell">{row.wow ? t(row.wow) : ''}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bridge to yugas */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 border border-gold-primary/20">
              <Sparkles className="w-4 h-4 text-gold-primary" />
              <span className="text-gold-light text-sm font-semibold">
                {hi ? 'वर्ष (Year) के बाद — पैमाना ब्रह्माण्डीय हो जाता है' : 'Beyond the Year — the scale becomes COSMIC'}
              </span>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 3: The Four Yugas ═══ */}
        <LessonSection number={3} title={t(L.s3Title)} variant="highlight">
          <p>{t(L.s3Intro)}</p>

          {/* Yuga proportional bars */}
          <div className="mt-8 space-y-4">
            {YUGAS.map((yuga, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-gold-light font-bold text-sm w-28 sm:w-36 text-right flex-shrink-0">
                    {hi ? yuga.nameHi : yuga.name}
                  </span>
                  <div className="flex-1 relative">
                    <div className="h-10 sm:h-12 rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.06]">
                      <motion.div
                        className={`h-full rounded-lg ${yuga.barColor} flex items-center justify-between px-3`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(yuga.ratio / 4) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: 'easeOut' as const }}
                      >
                        <span className="text-xs sm:text-sm font-bold text-white/90 whitespace-nowrap">
                          {yuga.years} {hi ? 'वर्ष' : 'years'}
                        </span>
                        <span className="text-xs font-mono text-white/60 hidden sm:inline">
                          {yuga.dharma}% {hi ? 'धर्म' : 'dharma'}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-text-secondary/60 ml-32 sm:ml-40">
                  {t(yuga.desc)}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Key mathematical facts */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { n: '4:3:2:1', d: { en: 'Perfectly mathematical ratio of the four Yugas', hi: 'चार युगों का पूर्णतः गणितीय अनुपात' } },
              { n: '4,320,000', d: { en: 'Total years in one Maha Yuga (Chatur Yuga)', hi: 'एक महायुग (चतुर्युग) में कुल वर्ष' } },
              { n: '10%', d: { en: 'Each yuga has a Sandhya (dawn) + Sandhyamsha (dusk)', hi: 'प्रत्येक युग में सन्ध्या + सन्ध्यांश = 10%' } },
              { n: '~5,128', d: { en: 'Years elapsed in current Kali Yuga (started 3102 BCE)', hi: 'वर्तमान कलियुग में बीते वर्ष (3102 ई.पू. से)' } },
            ].map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-lg p-4 border border-gold-primary/10"
              >
                <div className="text-2xl font-black text-gold-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{fact.n}</div>
                <div className="text-xs text-text-secondary/70">{t(fact.d)}</div>
              </motion.div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 4: Manvantara & Kalpa ═══ */}
        <LessonSection number={4} title={t(L.s4Title)}>
          {/* Nested hierarchy boxes */}
          <div className="mt-4 space-y-3">
            {[
              { label: { en: 'One Maha Yuga', hi: 'एक महायुग' }, formula: 'Satya + Treta + Dwapara + Kali', value: '4.32 million years', depth: 0, border: 'border-amber-500/20', bg: 'bg-amber-500/[0.04]' },
              { label: { en: 'One Manvantara', hi: 'एक मन्वन्तर' }, formula: '71 Maha Yugas + 1 Sandhya', value: '~306.72 million years', depth: 1, border: 'border-blue-400/20', bg: 'bg-blue-400/[0.04]' },
              { label: { en: 'One Kalpa (Brahma\'s Day)', hi: 'एक कल्प (ब्रह्मा का दिन)' }, formula: '14 Manvantaras + 15 Sandhyas', value: '4.32 BILLION years', depth: 2, border: 'border-gold-primary/25', bg: 'bg-gold-primary/[0.06]' },
              { label: { en: 'One Ahoratra of Brahma', hi: 'ब्रह्मा का एक अहोरात्र' }, formula: '2 Kalpas (day + night)', value: '8.64 BILLION years', depth: 3, border: 'border-purple-400/20', bg: 'bg-purple-400/[0.04]' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`rounded-xl p-4 sm:p-5 border ${item.border} ${item.bg}`}
                style={{ marginLeft: `${item.depth * 16}px` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="text-gold-light font-bold text-sm">{t(item.label)}</span>
                    <span className="text-text-secondary/50 text-xs ml-2">= {item.formula}</span>
                  </div>
                  <span className="text-amber-300 font-mono font-bold text-sm sm:text-base">{item.value}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mind-blowing comparison card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 rounded-2xl border-2 border-gold-primary/30 bg-gradient-to-br from-gold-primary/[0.08] to-transparent p-6 sm:p-8 text-center"
          >
            <div className="flex justify-center gap-4 sm:gap-12 mb-4 flex-wrap">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-gold-primary" style={{ fontFamily: 'var(--font-heading)' }}>4.32B</div>
                <div className="text-xs text-text-secondary/60 mt-1">{hi ? 'एक कल्प' : 'One Kalpa'}</div>
              </div>
              <div className="flex items-center text-2xl text-gold-primary/40">&asymp;</div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400" style={{ fontFamily: 'var(--font-heading)' }}>4.54B</div>
                <div className="text-xs text-text-secondary/60 mt-1">{hi ? 'पृथ्वी की आयु' : 'Earth\'s Age'}</div>
              </div>
            </div>
            <p className="text-gold-light/90 text-sm sm:text-base font-semibold max-w-xl mx-auto">
              {t(L.s4Comparison)}
            </p>
            <p className="text-text-secondary/50 text-xs mt-3 italic">
              {hi ? 'यह संयोग का दावा नहीं है — लेकिन सोच का पैमाना असाधारण है।' : 'This is NOT a coincidence claim — but the scale of thinking is extraordinary.'}
            </p>
          </motion.div>

          {/* Current position */}
          <div className="mt-8">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider mb-4">
              {hi ? 'आप कहाँ हैं — ब्रह्माण्डीय समयरेखा में' : 'Where YOU Are — In the Cosmic Timeline'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {CURRENT_POSITION.map((pos, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-lg p-3 border border-gold-primary/10 text-center"
                >
                  <div className="text-[10px] uppercase tracking-wider text-text-secondary/50 mb-1">{t(pos.label)}</div>
                  <div className="text-xs sm:text-sm font-semibold text-gold-light">{t(pos.value)}</div>
                </motion.div>
              ))}
            </div>

            {/* Sankalpa text */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center"
            >
              <p className="text-text-secondary/50 text-xs mb-2">
                {hi ? 'यही संकल्प पाठ में प्रकट होता है:' : 'This is EXACTLY what appears in the Sankalpa text:'}
              </p>
              <div
                className="text-lg sm:text-xl text-gold-primary/80 font-medium"
                style={{ fontFamily: 'var(--font-devanagari-heading)' }}
              >
                {SANKALPA_LINE}
              </div>
            </motion.div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 5: Brahma's Lifespan ═══ */}
        <LessonSection number={5} title={t(L.s5Title)} variant="highlight">
          {/* Grand calculation */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: { en: 'Brahma lives', hi: 'ब्रह्मा जीते हैं' }, value: { en: '100 Brahma-years', hi: '100 ब्रह्मा-वर्ष' } },
                { label: { en: 'Each Brahma-year', hi: 'प्रत्येक ब्रह्मा-वर्ष' }, value: { en: '360 Brahma-days (Kalpas)', hi: '360 ब्रह्मा-दिन (कल्प)' } },
                { label: { en: 'Each Brahma-day', hi: 'प्रत्येक ब्रह्मा-दिन' }, value: { en: '2 Kalpas (day + night)', hi: '2 कल्प (दिन + रात)' } },
                { label: { en: 'Total lifespan', hi: 'कुल आयु' }, value: { en: '100 x 360 x 2 x 4.32B', hi: '100 x 360 x 2 x 4.32 अरब' } },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-lg p-4 border border-gold-primary/10"
                >
                  <div className="text-xs text-text-secondary/50 mb-1">{t(item.label)}</div>
                  <div className="text-sm font-semibold text-gold-light">{t(item.value)}</div>
                </motion.div>
              ))}
            </div>

            {/* Result */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring' as const }}
              className="rounded-2xl border-2 border-gold-primary/30 bg-gradient-to-r from-gold-primary/[0.1] via-transparent to-gold-primary/[0.1] p-6 text-center"
            >
              <div className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-gold-primary via-yellow-300 to-gold-primary bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-heading)' }}>
                311.04 {hi ? 'खरब' : 'TRILLION'}
              </div>
              <div className="text-text-secondary/60 text-sm mt-2">{hi ? 'वर्ष — ब्रह्मा की सम्पूर्ण आयु' : 'years — Brahma\'s total lifespan'}</div>
              <div className="text-text-secondary/40 text-xs mt-1">{hi ? 'वर्तमान: ब्रह्मा अपने 51वें वर्ष (द्वितीय परार्ध) के प्रथम दिन में हैं' : 'Current: Brahma is in his 51st year (second Parardha), first day'}</div>
            </motion.div>

            {/* Cyclic nature */}
            <div className="flex items-start gap-3 mt-4">
              <InfinityIcon className="w-5 h-5 text-gold-primary/60 flex-shrink-0 mt-0.5" />
              <p className="text-text-secondary/80 text-sm">
                {hi
                  ? 'ब्रह्मा के 100 वर्षों के बाद: महाप्रलय (पूर्ण विलय), फिर एक नए ब्रह्मा का जन्म। चक्र अनन्त है। यही सेगन ने वर्णित किया — कोई "आरम्भ" या "अन्त" नहीं है।'
                  : 'After Brahma\'s 100 years: Maha Pralaya (complete dissolution), then a new Brahma is born. The cycle is INFINITE. This is what Sagan described — there is no "beginning" or "end." Each Brahma\'s death is followed by a new creation.'}
              </p>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 6: Why This Matters for Jyotish ═══ */}
        <LessonSection number={6} title={t(L.s6Title)}>
          <p>{t(L.s6Body)}</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Clock, title: { en: 'Kali Ahargana', hi: 'कलि अहर्गण' }, desc: { en: 'Days elapsed since Kali Yuga start (3102 BCE Feb 17/18) — the mathematical basis for all astronomical calculations in this app.', hi: 'कलियुग आरम्भ (3102 ई.पू. फ़रवरी 17/18) से बीते दिन — इस ऐप में सभी खगोलीय गणनाओं का गणितीय आधार।' } },
              { icon: Clock, title: { en: 'Samvatsara Cycle', hi: 'संवत्सर चक्र' }, desc: { en: 'The 60-year cycle (Jupiter\'s orbit x 5) is a practical sub-unit within the Yuga framework. Vikram & Shaka Samvat are "small" cycles within Kali Yuga.', hi: '60-वर्ष चक्र (बृहस्पति कक्षा x 5) युग ढाँचे के भीतर एक व्यावहारिक उप-इकाई। विक्रम और शक संवत् कलियुग के भीतर "छोटे" चक्र हैं।' } },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 border border-gold-primary/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4 text-gold-primary" />
                  <span className="text-gold-light font-semibold text-sm">{t(item.title)}</span>
                </div>
                <p className="text-xs text-text-secondary/70 leading-relaxed">{t(item.desc)}</p>
              </motion.div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 7: What No Other Civilization Conceived ═══ */}
        <LessonSection number={7} title={t(L.s7Title)} variant="highlight">
          {/* Comparison facts */}
          <div className="space-y-4 mt-2">
            {[
              { fact: { en: 'Archbishop Ussher (1650 CE) calculated Biblical creation at 4004 BCE = ~6,030 years ago. Hindu Kali Yuga ALONE started 5,128 years ago — and that is the SMALLEST yuga.', hi: 'आर्कबिशप अशर (1650 ई.) ने बाइबिल सृष्टि 4004 ई.पू. = ~6,030 वर्ष पहले आँकी। केवल हिन्दू कलियुग 5,128 वर्ष पहले शुरू हुआ — और वह सबसे छोटा युग है।' } },
              { fact: { en: 'The Big Bang theory (13.8 billion years) was proposed in 1931. Hindu texts described comparable timescales over 2,000 years earlier.', hi: 'बिग बैंग सिद्धान्त (13.8 अरब वर्ष) 1931 में प्रस्तावित हुआ। हिन्दू ग्रन्थों ने 2,000 वर्ष पहले तुलनीय कालमान वर्णित किए।' } },
              { fact: { en: 'Roger Penrose\'s Conformal Cyclic Cosmology proposes infinite cycles of Big Bangs — structurally identical to the Hindu model of Srishti (creation) and Pralaya (dissolution).', hi: 'रोजर पेनरोज़ का कॉन्फ़ॉर्मल चक्रीय ब्रह्माण्ड विज्ञान अनन्त बिग बैंग चक्रों का प्रस्ताव करता है — हिन्दू सृष्टि और प्रलय मॉडल के संरचनात्मक रूप से समरूप।' } },
              { fact: { en: 'The concept of entropy and heat death leading to dissolution and new creation is structurally identical to Hindu cosmological cycles.', hi: 'एन्ट्रॉपी और ऊष्मा मृत्यु से प्रलय और नई सृष्टि की अवधारणा हिन्दू ब्रह्माण्डीय चक्रों के संरचनात्मक रूप से समरूप है।' } },
              { fact: { en: 'Greek cosmos: eternal but spatially limited. Hindu cosmos: eternal AND temporally vast — infinite in both space and time.', hi: 'ग्रीक ब्रह्माण्ड: शाश्वत पर स्थानिक रूप से सीमित। हिन्दू ब्रह्माण्ड: शाश्वत और कालिक रूप से विशाल — स्थान और समय दोनों में अनन्त।' } },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gold-primary/60 flex-shrink-0 mt-2" />
                <p className="text-sm text-text-secondary/80 leading-relaxed">{t(item.fact)}</p>
              </motion.div>
            ))}
          </div>

          {/* Quotes */}
          <div className="mt-8 space-y-4">
            <motion.blockquote
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-l-4 border-amber-500/40 pl-5 py-2"
            >
              <p className="text-gold-light/80 italic text-sm leading-relaxed">
                {hi
                  ? '"वेदों तक पहुँच सबसे बड़ा विशेषाधिकार है जो यह शताब्दी सभी पिछली शताब्दियों पर दावा कर सकती है।"'
                  : '"Access to the Vedas is the greatest privilege this century may claim over all previous centuries."'}
              </p>
              <footer className="text-gold-primary/50 text-xs mt-2 font-semibold">
                — J. Robert Oppenheimer
              </footer>
            </motion.blockquote>

            <motion.blockquote
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="border-l-4 border-purple-400/40 pl-5 py-2"
            >
              <p className="text-gold-light/80 italic text-sm leading-relaxed">
                {hi
                  ? '"यदि आप ब्रह्माण्ड के रहस्य खोजना चाहते हैं, तो ऊर्जा, आवृत्ति और कम्पन के सन्दर्भ में सोचें।"'
                  : '"If you want to find the secrets of the universe, think in terms of energy, frequency and vibration."'}
              </p>
              <footer className="text-text-secondary/50 text-xs mt-2">
                {hi ? '— निकोला टेस्ला — वैदिक परम्परा ने ठीक यही किया।' : '— Nikola Tesla — The Vedic tradition did exactly this.'}
              </footer>
            </motion.blockquote>
          </div>

          {/* Closing message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 rounded-xl bg-gradient-to-r from-gold-primary/[0.08] via-transparent to-purple-500/[0.08] border border-gold-primary/15 p-6 text-center"
          >
            <p className="text-gold-light/90 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
              {hi
                ? 'यह रहस्यवाद नहीं है — यह गहन वैज्ञानिक अन्तर्ज्ञान है। जब कोई अन्य सभ्यता हजारों वर्षों से आगे नहीं सोच रही थी, वैदिक ऋषियों ने अरबों और खरबों वर्षों का ढाँचा निर्मित किया — जो आधुनिक भौतिकी अब पुनः खोज रही है।'
                : 'This is NOT mysticism — it is profound scientific intuition. When no other civilization was thinking beyond a few thousand years, Vedic sages constructed a framework of billions and trillions of years — one that modern physics is now rediscovering.'}
            </p>
          </motion.div>
        </LessonSection>

        {/* ═══ SANSKRIT TERMS ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <h3 className="text-xl font-bold text-gold-gradient mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {hi ? 'संस्कृत शब्दावली' : 'Sanskrit Terminology'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <SanskritTermCard term="Kalpa" devanagari="कल्प" transliteration="Kalpa" meaning={hi ? 'ब्रह्मा का दिन (4.32 अरब वर्ष)' : "Brahma's day (4.32B years)"} />
            <SanskritTermCard term="Manvantara" devanagari="मन्वन्तर" transliteration="Manvantara" meaning={hi ? 'मनु का युग (~306M वर्ष)' : "Manu's era (~306M years)"} />
            <SanskritTermCard term="Yuga" devanagari="युग" transliteration="Yuga" meaning={hi ? 'युग / कालखण्ड' : 'Age / Epoch'} />
            <SanskritTermCard term="Pralaya" devanagari="प्रलय" transliteration="Pralaya" meaning={hi ? 'विलय / प्रलय' : 'Dissolution'} />
            <SanskritTermCard term="Srishti" devanagari="सृष्टि" transliteration="Srishti" meaning={hi ? 'सृजन' : 'Creation'} />
            <SanskritTermCard term="Truti" devanagari="त्रुटि" transliteration="Truti" meaning={hi ? 'सबसे छोटी समय इकाई' : 'Smallest time unit'} />
          </div>
        </motion.section>

        {/* ═══ NAVIGATION LINKS ═══ */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 glass-card rounded-xl p-6 border border-gold-primary/10"
        >
          <h3 className="text-gold-light font-semibold text-sm uppercase tracking-wider mb-4">{t(L.exploreMore)}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/learn/modules/0-2' as const, label: { en: 'The Hindu Calendar', hi: 'हिन्दू पंचांग' } },
              { href: '/sankalpa' as const, label: { en: 'Sankalpa Generator', hi: 'संकल्प जनरेटर' } },
              { href: '/learn/calculations' as const, label: { en: 'Astronomical Calculations', hi: 'खगोलीय गणनाएँ' } },
              { href: '/panchang' as const, label: { en: 'Today\'s Panchang', hi: 'आज का पंचांग' } },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center justify-between glass-card rounded-lg px-4 py-3 border border-gold-primary/10 hover:border-gold-primary/30 hover:bg-gold-primary/[0.04] transition-all group"
              >
                <span className="text-sm text-text-secondary group-hover:text-gold-light transition-colors">{t(link.label)}</span>
                <ArrowRight className="w-4 h-4 text-gold-primary/40 group-hover:text-gold-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.05]">
            <Link
              href="/learn"
              className="text-sm text-text-secondary/60 hover:text-gold-light transition-colors"
            >
              &larr; {t(L.backToLearn)}
            </Link>
          </div>
        </motion.nav>

      </div>
    </div>
  );
}
