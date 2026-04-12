'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, BookOpen, Ruler, Eye, Mountain, MapPin, Star } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ═══════════════════════════════════════════════════════════════
   LABELS
   ═══════════════════════════════════════════════════════════════ */
const L = {
  title: { en: 'Jantar Mantar — India\'s Stone Observatories', hi: 'जन्तर मन्तर — भारत की पाषाण वेधशालाएँ' , ta: 'ஜந்தர் மந்தர் — இந்திய வான் ஆய்வகங்கள்' },
  subtitle: {
    en: 'Stone instruments that rival modern accuracy — built when Europe still relied on tiny brass gadgets.',
    hi: 'पत्थर के यन्त्र जो आधुनिक सटीकता की बराबरी करते हैं — जब यूरोप अभी भी छोटे पीतल के उपकरणों पर निर्भर था।',
  },
  s1Title: { en: 'Maharaja Jai Singh II — The Astronomer King', hi: 'महाराजा जयसिंह द्वितीय — खगोलशास्त्री सम्राट' },
  s2Title: { en: 'The Instruments', hi: 'यन्त्र' },
  s3Title: { en: 'Why Stone Beats Brass', hi: 'पत्थर पीतल से श्रेष्ठ क्यों' },
  s4Title: { en: 'Legacy', hi: 'विरासत' },
  s5Title: { en: 'Visit', hi: 'दर्शन करें' },
  backToLearn: { en: 'Back to Learn', hi: 'सीखने पर वापस' },
  exploreMore: { en: 'Continue Exploring', hi: 'और जानें' },
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

interface Instrument {
  name: string;
  nameHi: string;
  purpose: { en: string; hi: string };
  description: { en: string; hi: string };
  highlight: { en: string; hi: string };
  color: string;
  border: string;
}

const INSTRUMENTS: Instrument[] = [
  {
    name: 'Samrat Yantra',
    nameHi: 'सम्राट यन्त्र',
    purpose: { en: 'Giant Sundial', hi: 'विशाल धूपघड़ी' },
    description: {
      en: 'The Jaipur version stands 27 meters tall — the height of a 9-story building. The world\'s largest sundial. Its shadow moves approximately 1mm per second across the graduated scale, making it readable by the naked eye to an accuracy of 2 seconds of time.',
      hi: 'जयपुर का संस्करण 27 मीटर ऊँचा है — 9 मंजिल इमारत जितना। विश्व की सबसे बड़ी धूपघड़ी। इसकी छाया अंशांकित पैमाने पर लगभग 1 मिमी प्रति सेकंड चलती है, जिसे नग्न आँखों से 2 सेकंड की सटीकता तक पढ़ा जा सकता है।',
    },
    highlight: {
      en: 'Tells time accurate to 2 SECONDS — from a stone structure built in 1734.',
      hi: '2 सेकंड तक सही समय बताता है — 1734 में बने पत्थर के ढाँचे से।',
    },
    color: 'from-amber-500/20 to-amber-900/10',
    border: 'border-amber-500/25',
  },
  {
    name: 'Jai Prakash Yantra',
    nameHi: 'जयप्रकाश यन्त्र',
    purpose: { en: 'Inverted Celestial Sphere', hi: 'उलटा खगोलीय गोला' },
    description: {
      en: 'A hemispherical bowl carved from marble — the entire sky mapped onto a concave surface. The observer walks INSIDE the bowl to read celestial positions. A genius inversion: instead of looking up at the sky, you look down at the sky projected at your feet.',
      hi: 'संगमरमर से तराशा गया अर्धगोलाकार कटोरा — सम्पूर्ण आकाश एक अवतल सतह पर अंकित। प्रेक्षक कटोरे के भीतर चलकर खगोलीय स्थिति पढ़ता है। एक प्रतिभाशाली उलटफेर: आकाश को ऊपर देखने के बजाय, आप अपने पैरों पर प्रक्षेपित आकाश को नीचे देखते हैं।',
    },
    highlight: {
      en: 'You literally walk through the sky — the entire celestial hemisphere at your feet.',
      hi: 'आप शाब्दिक रूप से आकाश में चलते हैं — सम्पूर्ण खगोलीय गोलार्ध आपके पैरों में।',
    },
    color: 'from-violet-500/20 to-violet-900/10',
    border: 'border-violet-500/25',
  },
  {
    name: 'Ram Yantra',
    nameHi: 'राम यन्त्र',
    purpose: { en: 'Altitude-Azimuth Instrument', hi: 'उन्नतांश-दिगंश यन्त्र' },
    description: {
      en: 'Two complementary cylindrical structures, open to the sky. Where one has walls, the other has gaps — together they cover every point of the sky without obstruction. Measures altitude and azimuth of any celestial body, day or night.',
      hi: 'दो पूरक बेलनाकार संरचनाएँ, आकाश की ओर खुली। जहाँ एक में दीवारें हैं, वहाँ दूसरे में अन्तराल — मिलकर ये आकाश के हर बिन्दु को बिना अवरोध मापते हैं। किसी भी खगोलीय पिण्ड का उन्नतांश और दिगंश, दिन या रात।',
    },
    highlight: {
      en: 'Two halves that complete each other — full sky coverage with zero blind spots.',
      hi: 'दो अर्ध जो एक-दूसरे को पूर्ण करते हैं — शून्य अन्ध बिन्दुओं के साथ पूर्ण आकाश कवरेज।',
    },
    color: 'from-emerald-500/20 to-emerald-900/10',
    border: 'border-emerald-500/25',
  },
  {
    name: 'Rashivalaya Yantra',
    nameHi: 'राशिवलय यन्त्र',
    purpose: { en: 'Zodiac Sign Measurer', hi: 'राशि मापक' },
    description: {
      en: 'A set of 12 instruments — one for EACH zodiac sign. Each is angled precisely to measure when the Sun enters that particular sign. This is a mechanical ayanamsha computer from 1730 — hardware doing what our software does digitally today.',
      hi: '12 यन्त्रों का समूह — प्रत्येक राशि के लिए एक। प्रत्येक को ठीक उस कोण पर बनाया गया है जब सूर्य उस विशेष राशि में प्रवेश करता है। यह 1730 का यान्त्रिक अयनांश कम्प्यूटर है — वही कार्य जो आज हमारा सॉफ़्टवेयर करता है।',
    },
    highlight: {
      en: 'A MECHANICAL AYANAMSHA COMPUTER from 1730 — one instrument per rashi.',
      hi: '1730 का यान्त्रिक अयनांश कम्प्यूटर — प्रत्येक राशि के लिए एक यन्त्र।',
    },
    color: 'from-rose-500/20 to-rose-900/10',
    border: 'border-rose-500/25',
  },
  {
    name: 'Chakra Yantra',
    nameHi: 'चक्र यन्त्र',
    purpose: { en: 'Declination & Hour Angle', hi: 'क्रान्ति एवं कालांश' },
    description: {
      en: 'A large brass ring aligned with the celestial meridian. Uses a pinhole gnomon to project a spot of light onto the graduated ring. Measures declination and hour angle of celestial bodies with precision.',
      hi: 'खगोलीय याम्योत्तर के साथ संरेखित एक बड़ा पीतल का वलय। एक सूच्यग्र शंकु प्रकाश का बिन्दु अंशांकित वलय पर प्रक्षेपित करता है। खगोलीय पिण्डों की क्रान्ति और कालांश सटीकता से मापता है।',
    },
    highlight: {
      en: 'Pinhole precision — a spot of light on a brass ring tells you where a star is.',
      hi: 'सूच्यग्र सटीकता — पीतल के वलय पर प्रकाश का बिन्दु बताता है तारा कहाँ है।',
    },
    color: 'from-cyan-500/20 to-cyan-900/10',
    border: 'border-cyan-500/25',
  },
  {
    name: 'Mishra Yantra (Delhi)',
    nameHi: 'मिश्र यन्त्र (दिल्ली)',
    purpose: { en: 'Multi-function Instrument', hi: 'बहु-कार्य यन्त्र' },
    description: {
      en: 'Five instruments merged into one massive stone structure — the Swiss Army knife of 18th century astronomy. Only found at the Delhi observatory. Includes a Niyat Chakra that identifies the shortest and longest days of the year.',
      hi: 'पाँच यन्त्र एक विशाल पत्थर संरचना में विलीन — 18वीं शताब्दी के खगोल विज्ञान का स्विस आर्मी चाकू। केवल दिल्ली वेधशाला में। इसमें एक नियत चक्र है जो वर्ष के सबसे छोटे और सबसे लम्बे दिन पहचानता है।',
    },
    highlight: {
      en: 'Five instruments in one structure — astronomy\'s original multitool.',
      hi: 'एक संरचना में पाँच यन्त्र — खगोल विज्ञान का मूल बहु-उपकरण।',
    },
    color: 'from-blue-500/20 to-blue-900/10',
    border: 'border-blue-500/25',
  },
];

const OBSERVATORIES = [
  { city: 'Jaipur', cityHi: 'जयपुर', instruments: 19, status: { en: 'UNESCO World Heritage Site (2010). Largest, best preserved. 19 instruments including the world\'s largest stone sundial.', hi: 'यूनेस्को विश्व धरोहर स्थल (2010)। सबसे बड़ी, सबसे सुरक्षित। विश्व की सबसे बड़ी पत्थर धूपघड़ी सहित 19 यन्त्र।' }, color: 'text-amber-400' },
  { city: 'Delhi', cityHi: 'दिल्ली', instruments: 13, status: { en: 'Most accessible. 13 instruments near Connaught Place. Home to the unique Mishra Yantra.', hi: 'सबसे सुलभ। कनॉट प्लेस के निकट 13 यन्त्र। अद्वितीय मिश्र यन्त्र का स्थान।' }, color: 'text-emerald-400' },
  { city: 'Ujjain', cityHi: 'उज्जैन', instruments: 13, status: { en: 'On the Tropic of Cancer — astronomically ideal. Ujjain was India\'s prime meridian for centuries.', hi: 'कर्क रेखा पर — खगोलीय रूप से आदर्श। उज्जैन शताब्दियों तक भारत की प्रधान याम्योत्तर रेखा रही।' }, color: 'text-violet-400' },
  { city: 'Varanasi', cityHi: 'वाराणसी', instruments: 6, status: { en: 'Smaller but significant. On the rooftop of Man Singh Observatory near the ghats.', hi: 'छोटी किन्तु महत्वपूर्ण। घाटों के निकट मानसिंह वेधशाला की छत पर।' }, color: 'text-cyan-400' },
  { city: 'Mathura', cityHi: 'मथुरा', instruments: 0, status: { en: 'No longer extant — destroyed over the centuries. Only historical references remain.', hi: 'अब अस्तित्व में नहीं — शताब्दियों में नष्ट। केवल ऐतिहासिक सन्दर्भ शेष।' }, color: 'text-text-secondary/70' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ObservatoriesPage() {
  const locale = useLocale() as Locale;
  const hi = isDevanagariLocale(locale);
  const t = (obj: { en: string; hi: string }) => (hi ? obj.hi : obj.en);

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Hero */}
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 mb-4">
          <Mountain className="w-4 h-4 text-gold-primary" />
          <span className="text-xs text-gold-light font-medium tracking-wider uppercase">{hi ? 'भारतीय वेधशालाएँ' : 'Indian Observatories'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gold-gradient leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {t(L.title)}
        </h1>
        <p className="mt-4 text-text-secondary/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">{t(L.subtitle)}</p>

        {/* Key stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 inline-flex items-center gap-4 bg-gradient-to-r from-amber-500/[0.08] to-transparent border border-amber-500/20 rounded-full px-6 py-3"
        >
          <span className="text-3xl sm:text-4xl font-black text-amber-400" style={{ fontFamily: 'var(--font-heading)' }}>2&Prime;</span>
          <span className="text-xs sm:text-sm text-text-secondary/70 text-left leading-tight">
            {hi ? 'कालांश सटीकता — 1734 के पत्थर से' : 'arc-second accuracy — from stone, built 1734'}
          </span>
        </motion.div>
      </motion.header>

      <div className="space-y-6">
        {/* ═══ SECTION 1: Jai Singh ═══ */}
        <LessonSection number={1} title={t(L.s1Title)} variant="highlight">
          <div className="space-y-4">
            <p className="text-text-secondary/80 text-sm leading-relaxed">
              {hi
                ? 'सवाई जयसिंह द्वितीय (1688-1743), जयपुर के शासक — योद्धा, राजनयिक, और भारत के महानतम वैज्ञानिक संरक्षकों में से एक। उन्होंने यूरोप से आयातित पीतल के यन्त्रों को बहुत छोटा और अशुद्ध पाया।'
                : 'Sawai Jai Singh II (1688-1743), ruler of Jaipur — warrior, diplomat, and one of India\'s greatest scientific patrons. He found European brass instruments imported to the Mughal court too small and too inaccurate for serious astronomical work.'}
            </p>
            <p className="text-text-secondary/80 text-sm leading-relaxed">
              {hi
                ? 'उनका समाधान? बड़ा बनाओ। बहुत बड़ा। पीतल को त्यागो — पत्थर से बनाओ। उन्होंने 5 वेधशालाएँ बनवाईं: जयपुर, दिल्ली, उज्जैन, वाराणसी, मथुरा। सभी यन्त्र पत्थर और चूने से — न धातु, न काँच, न लेंस।'
                : 'His solution? Go big. Absurdly big. Abandon brass — build from stone. He constructed 5 observatories across India: Jaipur, Delhi, Ujjain, Varanasi, and Mathura. ALL instruments from stone and lime — no metal, no glass, no lenses.'}
            </p>

            {/* Five observatories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {OBSERVATORIES.map((obs, i) => (
                <motion.div
                  key={obs.city}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-lg p-3 border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className={`w-3.5 h-3.5 ${obs.color}`} />
                    <span className="font-bold text-sm text-gold-light">{obs.city}</span>
                    <span className="text-text-secondary/65 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>({obs.cityHi})</span>
                  </div>
                  {obs.instruments > 0 && (
                    <div className="text-xs text-text-secondary/70">{obs.instruments} {hi ? 'यन्त्र' : 'instruments'}</div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3 bg-amber-500/[0.06] border border-amber-500/15 rounded-lg p-4"
            >
              <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary/70 leading-relaxed">
                {hi
                  ? 'जयसिंह ने यूरोपीय खगोल विज्ञान का भी अध्ययन किया — उन्होंने लॉगरिदम सारणियाँ और यूक्लिड के तत्वों का संस्कृत में अनुवाद कराया। ये वेधशालाएँ भारतीय और पश्चिमी दोनों ज्ञान परम्पराओं का संगम हैं।'
                  : 'Jai Singh also studied European astronomy — he commissioned Sanskrit translations of logarithm tables and Euclid\'s Elements. These observatories represent a confluence of both Indian and Western knowledge traditions.'}
              </p>
            </motion.div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 2: The Instruments ═══ */}
        <LessonSection number={2} title={t(L.s2Title)}>
          <p className="text-text-secondary/70 text-sm mb-4">
            {hi
              ? 'प्रत्येक यन्त्र एक विशिष्ट खगोलीय माप के लिए बनाया गया — और प्रत्येक इंजीनियरिंग की उत्कृष्ट कृति है।'
              : 'Each instrument was purpose-built for a specific astronomical measurement — and each is a masterpiece of engineering.'}
          </p>
          <div className="space-y-4">
            {INSTRUMENTS.map((inst, i) => (
              <motion.div
                key={inst.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`rounded-xl border ${inst.border} bg-gradient-to-br ${inst.color} p-5`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-gold-light font-bold text-base sm:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                      {inst.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary/65 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{inst.nameHi}</span>
                      <span className="text-xs text-gold-primary/60">|</span>
                      <span className="text-xs text-gold-primary/70">{t(inst.purpose)}</span>
                    </div>
                  </div>
                  <Ruler className="w-5 h-5 text-gold-primary/30 flex-shrink-0" />
                </div>
                <p className="text-xs sm:text-sm text-text-secondary/75 leading-relaxed mb-3">{t(inst.description)}</p>
                <div className="bg-gold-primary/[0.06] border border-gold-primary/15 rounded-lg px-4 py-2.5">
                  <p className="text-xs sm:text-sm text-gold-light/90 font-medium leading-relaxed">{t(inst.highlight)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 3: Why Stone Beats Brass ═══ */}
        <LessonSection number={3} title={t(L.s3Title)} variant="highlight">
          <div className="space-y-5">
            <p className="text-text-secondary/80 text-sm leading-relaxed">
              {hi
                ? 'यूरोप के खगोलविद पीतल के उपकरणों पर निर्भर थे — ज्योतिर्लोक (astrolabes), चतुर्थांश (quadrants), लघु गोल (armillary spheres)। ये सुन्दर थे, किन्तु तीन मूलभूत समस्याएँ थीं:'
                : 'European astronomers relied on brass instruments — astrolabes, quadrants, armillary spheres. Beautiful objects, but they suffered from three fundamental problems:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  problem: { en: 'Too Small', hi: 'बहुत छोटे' },
                  detail: { en: 'A 30cm quadrant can only resolve to ~1 arcminute. Jai Singh\'s 27m Samrat Yantra resolves to 2 arcseconds — 30x better.', hi: '30 सेमी का चतुर्थांश केवल ~1 कलांश तक पढ़ सकता है। जयसिंह का 27 मीटर सम्राट यन्त्र 2 कलांश तक — 30 गुना बेहतर।' },
                  color: 'border-red-500/20 bg-red-500/[0.04]',
                  icon: <Ruler className="w-4 h-4 text-red-400" />,
                },
                {
                  problem: { en: 'Metal Expands', hi: 'धातु फैलती है' },
                  detail: { en: 'Brass expands with heat — readings drift from morning to afternoon. Stone is thermally stable. No expansion, no drift, no recalibration needed.', hi: 'पीतल ताप से फैलता है — प्रातः से अपराह्न तक माप बदलते हैं। पत्थर ताप-स्थिर है। न फैलाव, न विचलन, न पुनः अंशांकन।' },
                  color: 'border-orange-500/20 bg-orange-500/[0.04]',
                  icon: <Star className="w-4 h-4 text-orange-400" />,
                },
                {
                  problem: { en: 'Parts Wear Out', hi: 'पुर्ज़े घिसते हैं' },
                  detail: { en: 'Pivot joints, hinges, rotating parts — all accumulate error over years. Stone instruments have ZERO moving parts. Nothing to wear, nothing to break.', hi: 'कीलक जोड़, टिका, घूमने वाले भाग — सब वर्षों में त्रुटि संचित करते हैं। पत्थर यन्त्रों में शून्य चल भाग। न घिसाव, न टूट-फूट।' },
                  color: 'border-yellow-500/20 bg-yellow-500/[0.04]',
                  icon: <Eye className="w-4 h-4 text-yellow-400" />,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-xl border ${item.color} p-4`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {item.icon}
                    <h4 className="font-bold text-sm text-gold-light">{t(item.problem)}</h4>
                  </div>
                  <p className="text-xs text-text-secondary/70 leading-relaxed">{t(item.detail)}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-gold-primary/20 bg-gradient-to-r from-gold-primary/[0.06] to-transparent p-5 text-center"
            >
              <p className="text-sm text-gold-light/90 font-medium max-w-lg mx-auto leading-relaxed">
                {hi
                  ? 'सम्राट यन्त्र की छाया प्रति सेकंड ~1 मिमी चलती है। उस पैमाने पर, 2 कलांश का संकल्प नग्न आँखों से पढ़ने योग्य है — बिना किसी ऑप्टिक्स के।'
                  : 'The Samrat Yantra\'s shadow moves ~1mm per second. At that scale, 2-arcsecond resolution is readable by the naked eye — without any optics whatsoever.'}
              </p>
            </motion.div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4: Legacy ═══ */}
        <LessonSection number={4} title={t(L.s4Title)}>
          <div className="space-y-4">
            {[
              {
                text: { en: 'The Jaipur Jantar Mantar was declared a UNESCO World Heritage Site in 2010 — recognized as "the most significant, comprehensive, and well-preserved collection of architectural astronomical instruments in the world."', hi: 'जयपुर जन्तर मन्तर को 2010 में यूनेस्को विश्व धरोहर स्थल घोषित किया गया — "विश्व में वास्तुशिल्पीय खगोलीय यन्त्रों का सबसे महत्वपूर्ण, व्यापक और सुरक्षित संग्रह" के रूप में मान्यता प्राप्त।' },
                color: 'border-amber-500/20 bg-amber-500/[0.04]',
              },
              {
                text: { en: 'Traditional pandits still use these instruments for calendar calculations. The Rashivalaya Yantra predicted Makar Sankranti within MINUTES of modern astronomical computation — and it was built in 1730, nearly 300 years ago.', hi: 'परम्परागत पण्डित आज भी इन यन्त्रों का उपयोग पञ्चाङ्ग गणना के लिए करते हैं। राशिवलय यन्त्र ने मकर सङ्क्रान्ति की भविष्यवाणी आधुनिक खगोलीय गणना से केवल मिनटों के अन्तर से की — और यह 1730 में बना था।' },
                color: 'border-emerald-500/20 bg-emerald-500/[0.04]',
              },
              {
                text: { en: 'Our app computes digitally what these stone instruments computed physically. The Samrat Yantra measures local apparent solar time; our code calculates the same from the Sun\'s hour angle. The Rashivalaya Yantra tracks solar ingress into rashis; our tropical-to-sidereal conversion does the same. The math is identical — only the medium has changed.', hi: 'हमारा ऐप वही डिजिटली गणना करता है जो ये पत्थर यन्त्र भौतिक रूप से करते थे। सम्राट यन्त्र स्थानीय दृश्य सौर समय मापता है; हमारा कोड सूर्य के कालांश से वही गणना करता है। राशिवलय यन्त्र राशि प्रवेश को ट्रैक करता है; हमारा सायन-निरयन रूपान्तरण वही करता है। गणित समान है — केवल माध्यम बदला है।' },
                color: 'border-blue-500/20 bg-blue-500/[0.04]',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border ${item.color} p-4 sm:p-5`}
              >
                <p className="text-xs sm:text-sm text-text-secondary/80 leading-relaxed">{t(item.text)}</p>
              </motion.div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 5: Visit ═══ */}
        <LessonSection number={5} title={t(L.s5Title)} variant="highlight">
          <p className="text-text-secondary/80 text-sm leading-relaxed mb-4">
            {hi
              ? 'यदि आप कभी भारत जाएँ, तो इन वेधशालाओं को अवश्य देखें। कोई फ़ोटो या पुस्तक इन यन्त्रों के पैमाने को व्यक्त नहीं कर सकती।'
              : 'If you ever visit India, these observatories are a must-see. No photograph or book can convey the sheer scale of these instruments.'}
          </p>

          <div className="space-y-3">
            {OBSERVATORIES.filter(o => o.instruments > 0).map((obs, i) => (
              <motion.div
                key={obs.city}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <MapPin className={`w-4 h-4 ${obs.color} flex-shrink-0 mt-0.5`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gold-light">{obs.city}</span>
                    <span className="text-text-secondary/65 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>({obs.cityHi})</span>
                    <span className="text-xs font-mono text-gold-primary/50">{obs.instruments} {hi ? 'यन्त्र' : 'instruments'}</span>
                  </div>
                  <p className="text-xs text-text-secondary/75 leading-relaxed mt-1">{t(obs.status)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-5 rounded-xl border border-gold-primary/15 bg-gradient-to-r from-gold-primary/[0.04] to-transparent p-4"
          >
            <p className="text-xs sm:text-sm text-gold-light/80 leading-relaxed">
              {hi
                ? 'सर्वोत्तम समय: प्रातःकाल (तीक्ष्ण छायाएँ)। जयप्रकाश यन्त्र के भीतर खड़े होकर, सूर्य का प्रकाश बिन्दु आपके पैरों पर चलते देखना — एक अविस्मरणीय अनुभव है। आप शाब्दिक रूप से आकाश के भीतर खड़े होते हैं।'
                : 'Best time: morning, when shadows are sharpest. Standing inside the Jai Prakash Yantra as the Sun\'s spot of light moves across your feet — this is an unforgettable experience. You are literally standing inside the sky.'}
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
            <SanskritTermCard term="Yantra" devanagari="यन्त्र" transliteration="Yantra" meaning={hi ? 'यन्त्र / उपकरण' : 'Instrument / Device'} />
            <SanskritTermCard term="Vedha" devanagari="वेध" transliteration="Vedha" meaning={hi ? 'खगोलीय प्रेक्षण' : 'Astronomical observation'} />
            <SanskritTermCard term="Shala" devanagari="शाला" transliteration="Shala" meaning={hi ? 'गृह / भवन' : 'House / Hall'} />
            <SanskritTermCard term="Samrat" devanagari="सम्राट" transliteration="Samrat" meaning={hi ? 'सम्राट / शासक' : 'Emperor / Supreme'} />
            <SanskritTermCard term="Chakra" devanagari="चक्र" transliteration="Chakra" meaning={hi ? 'वलय / चक्र' : 'Ring / Wheel'} />
            <SanskritTermCard term="Rashivalaya" devanagari="राशिवलय" transliteration="Rashivalaya" meaning={hi ? 'राशि माप वलय' : 'Zodiac measuring ring'} />
          </div>
        </motion.section>

        {/* ═══ NAVIGATION ═══ */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6"
        >
          <h3 className="text-gold-light font-semibold text-sm uppercase tracking-wider mb-4">{t(L.exploreMore)}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/learn/vedanga' as const, label: { en: 'Vedanga Jyotisha & Indian Astronomy', hi: 'वेदाङ्ग ज्योतिष एवं भारतीय खगोल' } },
              { href: '/learn/cosmology' as const, label: { en: 'Hindu Cosmological Time Scales', hi: 'हिन्दू ब्रह्माण्डीय कालमान' } },
              { href: '/learn/classical-texts' as const, label: { en: 'Classical Astronomical Texts', hi: 'शास्त्रीय खगोलीय ग्रन्थ' } },
              { href: '/learn/calculations' as const, label: { en: 'How We Calculate', hi: 'हम कैसे गणना करते हैं' } },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center justify-between bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg px-4 py-3 hover:border-gold-primary/30 hover:bg-gold-primary/[0.04] transition-all group"
              >
                <span className="text-sm text-text-secondary group-hover:text-gold-light transition-colors">{t(link.label)}</span>
                <ArrowRight className="w-4 h-4 text-gold-primary/40 group-hover:text-gold-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.05]">
            <Link href="/learn" className="text-sm text-text-secondary/75 hover:text-gold-light transition-colors">
              &larr; {t(L.backToLearn)}
            </Link>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}
