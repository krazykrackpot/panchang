'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby, Calculator, ChevronDown, Clock, Heart, Sparkles, Star, Target, Users } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual labels ───────────────────────────────────────────── */
const L = {
  title: { en: 'Children Prediction Guide', hi: 'सन्तान भविष्यवाणी मार्गदर्शिका', sa: 'सन्तानभविष्यवाणी-मार्गदर्शिका' },
  subtitle: {
    en: 'A complete framework for analyzing childbirth timing, fertility indicators, and children\'s nature through the 5th house, Jupiter, and D7 Saptamsha chart.',
    hi: 'पञ्चम भाव, गुरु और D7 सप्तमांश कुण्डली से सन्तान प्राप्ति का समय, प्रजनन सूचक और सन्तान स्वभाव का विश्लेषण।',
    sa: 'पञ्चमभावेन गुरुणा D7-सप्तमांशकुण्डल्या च सन्तानप्राप्तिकालस्य प्रजननसूचकानां सन्तानस्वभावस्य च विश्लेषणम्।'
  },
};

/* ── 5th house sign data ─────────────────────────────────────────── */
const FIFTH_SIGN: { sign: { en: string; hi: string }; nature: { en: string; hi: string }; color: string }[] = [
  { sign: { en: 'Aries', hi: 'मेष' }, nature: { en: 'Energetic, independent first child. Quick conception likely. Male tendency.', hi: 'ऊर्जावान, स्वतन्त्र प्रथम सन्तान। शीघ्र गर्भधारण। पुत्र प्रवृत्ति।' }, color: 'text-red-400' },
  { sign: { en: 'Taurus', hi: 'वृषभ' }, nature: { en: 'Beautiful, artistic children. Steady fertility. Female tendency.', hi: 'सुन्दर, कलात्मक सन्तान। स्थिर प्रजनन। कन्या प्रवृत्ति।' }, color: 'text-emerald-400' },
  { sign: { en: 'Gemini', hi: 'मिथुन' }, nature: { en: 'Intelligent, communicative. Dual sign = twins possibility. Multiple children.', hi: 'बुद्धिमान, वाचाल। द्वि-राशि = जुड़वां सम्भावना। बहु सन्तान।' }, color: 'text-yellow-300' },
  { sign: { en: 'Cancer', hi: 'कर्क' }, nature: { en: 'Nurturing parent, emotionally bonded children. Strong fertility. Female tendency.', hi: 'पालनकर्ता माता/पिता, भावनात्मक बन्धन। सशक्त प्रजनन। कन्या प्रवृत्ति।' }, color: 'text-blue-300' },
  { sign: { en: 'Leo', hi: 'सिंह' }, nature: { en: 'Proud of children, talented offspring. May have fewer but distinguished. Male tendency.', hi: 'सन्तान पर गर्व, प्रतिभाशाली सन्तान। कम पर विशिष्ट। पुत्र प्रवृत्ति।' }, color: 'text-amber-400' },
  { sign: { en: 'Virgo', hi: 'कन्या' }, nature: { en: 'Health-conscious about children, analytical parenting. Delayed but planned.', hi: 'सन्तान स्वास्थ्य सजग, विश्लेषणात्मक पालन। विलम्बित परन्तु नियोजित।' }, color: 'text-green-400' },
  { sign: { en: 'Libra', hi: 'तुला' }, nature: { en: 'Harmonious relationship with children. Artistic, balanced offspring.', hi: 'सन्तान से सामञ्जस्यपूर्ण सम्बन्ध। कलात्मक, सन्तुलित सन्तान।' }, color: 'text-pink-300' },
  { sign: { en: 'Scorpio', hi: 'वृश्चिक' }, nature: { en: 'Deep bond, intense parenting. Possible complications but resilient children.', hi: 'गहरा बन्धन, तीव्र पालन। सम्भव जटिलता परन्तु लचीली सन्तान।' }, color: 'text-red-500' },
  { sign: { en: 'Sagittarius', hi: 'धनु' }, nature: { en: 'Fortunate with children, philosophical bond. Children may travel/study abroad.', hi: 'सन्तान भाग्यशाली, दार्शनिक बन्धन। विदेश में अध्ययन/यात्रा।' }, color: 'text-violet-400' },
  { sign: { en: 'Capricorn', hi: 'मकर' }, nature: { en: 'Delayed children, disciplined upbringing. Children are responsible, mature.', hi: 'विलम्बित सन्तान, अनुशासित पालन। जिम्मेदार, परिपक्व सन्तान।' }, color: 'text-slate-300' },
  { sign: { en: 'Aquarius', hi: 'कुम्भ' }, nature: { en: 'Unconventional path to children. Progressive, independent offspring.', hi: 'अपरम्परागत सन्तान मार्ग। प्रगतिशील, स्वतन्त्र सन्तान।' }, color: 'text-cyan-400' },
  { sign: { en: 'Pisces', hi: 'मीन' }, nature: { en: 'Spiritual bond, intuitive children. Creative, sensitive offspring.', hi: 'आध्यात्मिक बन्धन, अन्तर्ज्ञानी सन्तान। सृजनशील, संवेदनशील।' }, color: 'text-indigo-400' },
];

/* ── Challenge & remedy data ─────────────────────────────────────── */
const CHALLENGES: { condition: { en: string; hi: string }; meaning: { en: string; hi: string }; remedy: { en: string; hi: string }; color: string }[] = [
  { condition: { en: '5th lord in 6/8/12', hi: 'पञ्चमेश 6/8/12 में' }, meaning: { en: 'Difficulty in conception or childbirth complications. The 5th lord loses strength in dusthana houses.', hi: 'गर्भधारण कठिनाई या प्रसव जटिलता। पञ्चमेश दुःस्थान भावों में शक्ति खोता है।' }, remedy: { en: 'Jupiter strengthening: yellow sapphire, Thursday fasting, Dattatreya mantra, Santan Gopal puja', hi: 'गुरु बलवर्धन: पुखराज, गुरुवार व्रत, दत्तात्रेय मन्त्र, सन्तान गोपाल पूजा' }, color: 'border-amber-500/20' },
  { condition: { en: 'Rahu in 5th house', hi: 'राहु पञ्चम भाव में' }, meaning: { en: 'Unconventional path — IVF, adoption, surrogacy. NOT denial of children, but unusual circumstances.', hi: 'अपरम्परागत मार्ग — IVF, दत्तक, सरोगेसी। सन्तान निषेध नहीं, परन्तु असामान्य परिस्थिति।' }, remedy: { en: 'Rahu shanti, Naga puja, donate to orphanages, avoid intoxicants during conception period', hi: 'राहु शान्ति, नाग पूजा, अनाथालय दान, गर्भधारण काल में मादक पदार्थ वर्जित' }, color: 'border-cyan-500/20' },
  { condition: { en: 'Saturn in 5th house', hi: 'शनि पञ्चम भाव में' }, meaning: { en: 'Delayed children, not denied. Saturn matures at 36 — children often come after. Responsible, mature offspring.', hi: 'विलम्बित सन्तान, निषेध नहीं। शनि 36 वर्ष में परिपक्व — प्रायः उसके बाद सन्तान। जिम्मेदार सन्तान।' }, remedy: { en: 'Saturn shanti, Hanuman Chalisa, serve elderly, patience — Saturn rewards after its maturation age', hi: 'शनि शान्ति, हनुमान चालीसा, वृद्ध सेवा, धैर्य — शनि परिपक्वता आयु के बाद पुरस्कृत करता है' }, color: 'border-slate-500/20' },
  { condition: { en: 'Ketu in 5th house', hi: 'केतु पञ्चम भाव में' }, meaning: { en: 'Past-life karmic debt related to children. Spiritual children, or child drawn to spirituality. Detachment theme.', hi: 'सन्तान से सम्बन्धित पूर्वजन्म कर्म ऋण। आध्यात्मिक सन्तान। वैराग्य विषय।' }, remedy: { en: 'Ganesha worship, Ashwattha tree puja, past-life karma resolution through meditation', hi: 'गणेश पूजन, अश्वत्थ वृक्ष पूजा, ध्यान द्वारा पूर्वजन्म कर्म निवारण' }, color: 'border-violet-500/20' },
];

/* ── SVG: 5th House Highlighted Chart + D7 ───────────────────────── */
function FifthHouseChart() {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const r = 100;
  return (
    <svg viewBox="-180 -150 360 300" className="w-full max-w-[400px] mx-auto">
      <defs>
        <radialGradient id="ch-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
        <filter id="ch-blur"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <circle cx="0" cy="0" r="130" fill="url(#ch-glow)" />
      {houses.map((h) => {
        const a1 = ((h - 1) * 30 - 90) * (Math.PI / 180);
        const a2 = (h * 30 - 90) * (Math.PI / 180);
        const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
        const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
        const mid = ((h - 0.5) * 30 - 90) * (Math.PI / 180);
        const tx = Math.cos(mid) * (r * 0.7), ty = Math.sin(mid) * (r * 0.7);
        const is5 = h === 5;
        const is9 = h === 9;
        return (
          <g key={h}>
            <path d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
              fill={is5 ? 'rgba(212,168,83,0.25)' : is9 ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.03)'}
              stroke={is5 ? '#d4a853' : is9 ? '#a855f7' : 'rgba(212,168,83,0.15)'}
              strokeWidth={is5 ? 2 : is9 ? 1.5 : 0.5}
            />
            {is5 && <path d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill="rgba(212,168,83,0.1)" filter="url(#ch-blur)" />}
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
              className={is5 ? 'fill-gold-light font-bold' : is9 ? 'fill-violet-400' : 'fill-text-tertiary'}
              fontSize={is5 ? 14 : is9 ? 11 : 10}>{h}</text>
          </g>
        );
      })}
      {/* Jupiter symbol in center */}
      <circle cx="0" cy="0" r="20" fill="rgba(10,14,39,0.8)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
      <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" className="fill-yellow-400" fontSize="12" fontWeight="bold">Ju</text>
      {/* D7 badge */}
      <rect x="110" y="-140" width="55" height="24" rx="6" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1" />
      <text x="137" y="-124" textAnchor="middle" className="fill-violet-400" fontSize="10" fontWeight="bold">D7</text>
      {/* Labels */}
      <text x="-110" y="135" className="fill-gold-light" fontSize="9" fontWeight="bold">5H = Children</text>
      <text x="40" y="135" className="fill-violet-400" fontSize="9">9H = Fortune</text>
    </svg>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function ChildrenPredictionPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const t = (obj: { en: string; hi: string; sa?: string }) => isHi ? (locale === 'sa' && obj.sa ? obj.sa : obj.hi) : obj.en;
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedSign, setExpandedSign] = useState<number | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium mb-4">
          <Baby className="w-3.5 h-3.5" />
          {isHi ? 'सन्तान विश्लेषण' : 'Progeny Analysis'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t(L.title)}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t(L.subtitle)}</p>
      </motion.div>

      {/* SVG Chart */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 flex flex-col items-center">
          <FifthHouseChart />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {isHi
              ? 'पञ्चम भाव (5H) सन्तान का प्रमुख भाव। गुरु (Ju) प्राकृतिक पुत्रकारक। नवम भाव (9H) = 5वें से 5वां = पौत्र। D7 सप्तमांश = सन्तान विभाजन कुण्डली।'
              : '5th house (5H) is the primary house of children. Jupiter (Ju) is the natural Putrakaraka. 9th house (9H) = 5th from 5th = grandchildren. D7 Saptamsha = children divisional chart.'}
          </p>
        </div>
      </motion.div>

      {/* Section 1: Children Analysis Framework */}
      <LessonSection number={1} title={isHi ? 'सन्तान विश्लेषण ढांचा' : 'The Children Analysis Framework'} variant="highlight">
        <div className="space-y-4">
          {[
            { step: 1, icon: Star, title: { en: '5th House Sign', hi: 'पञ्चम भाव राशि' }, desc: { en: 'The sign on the 5th house determines the nature, gender tendency, and temperament of the first child. Fire/Air signs lean male; Earth/Water lean female.', hi: 'पञ्चम भाव की राशि प्रथम सन्तान की प्रकृति, लिंग प्रवृत्ति और स्वभाव निर्धारित करती है। अग्नि/वायु = पुत्र; पृथ्वी/जल = कन्या।' }, color: 'text-amber-400' },
            { step: 2, icon: Target, title: { en: '5th House Lord Placement', hi: 'पञ्चमेश की स्थिति' }, desc: { en: 'Where the 5th lord sits shows WHERE the children energy flows. In 11th = fulfilment of children desire. In 8th = complications but transformation.', hi: 'पञ्चमेश जहां बैठे वहां सन्तान ऊर्जा प्रवाहित होती है। 11वें में = सन्तान इच्छा पूर्ति। 8वें में = जटिलता परन्तु परिवर्तन।' }, color: 'text-emerald-400' },
            { step: 3, icon: Sparkles, title: { en: 'Jupiter (Putrakaraka)', hi: 'गुरु (पुत्रकारक)' }, desc: { en: 'Jupiter is the natural significator of children. Strong Jupiter (own sign, exalted, in kendra/trikona) = children blessed. Weak/afflicted Jupiter = difficulties.', hi: 'गुरु सन्तान का प्राकृतिक कारक है। बलवान गुरु (स्वराशि, उच्च, केन्द्र/त्रिकोण) = सन्तान सुख। दुर्बल गुरु = कठिनाई।' }, color: 'text-yellow-400' },
            { step: 4, icon: Users, title: { en: 'D7 Saptamsha Chart', hi: 'D7 सप्तमांश कुण्डली' }, desc: { en: 'The D7 divisional chart provides microscopic detail about children — their number, nature, and your relationship with them. The D7 lagna lord dasha confirms timing.', hi: 'D7 विभाजन कुण्डली सन्तान का सूक्ष्म विवरण देती है — संख्या, स्वभाव, और सम्बन्ध। D7 लग्नेश दशा समय की पुष्टि।' }, color: 'text-violet-400' },
            { step: 5, icon: Heart, title: { en: 'Putrakaraka (Jaimini)', hi: 'पुत्रकारक (जैमिनी)' }, desc: { en: 'In Jaimini astrology, the planet with the 5th highest degree becomes the Putrakaraka — the variable significator for children. Its sign, nakshatra, and navamsha reveal deep patterns.', hi: 'जैमिनी ज्योतिष में 5वें सर्वाधिक अंश वाला ग्रह पुत्रकारक बनता है। इसकी राशि, नक्षत्र और नवमांश गहरे पैटर्न प्रकट करते हैं।' }, color: 'text-cyan-400' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="flex gap-4 items-start p-4 rounded-xl bg-bg-secondary/40 border border-gold-primary/8">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold-dark text-xs font-bold uppercase tracking-wider">{isHi ? `चरण ${s.step}` : `Step ${s.step}`}</span>
                    <h3 className="text-gold-light font-bold text-sm" style={hf}>{t(s.title)}</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{t(s.desc)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 2: Timing of Childbirth */}
      <LessonSection number={2} title={isHi ? 'सन्तान प्राप्ति का समय' : 'Timing of Childbirth'} variant="formula">
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            {isHi ? 'कब सन्तान होगी — दशा और गोचर का संयुक्त विश्लेषण:' : 'When children will come — combined analysis of dasha periods and planetary transits:'}
          </p>
          {[
            { trigger: { en: '5th lord Dasha / Antardasha', hi: 'पञ्चमेश दशा / अन्तर्दशा' }, effect: { en: 'The primary conception/birth period. When the 5th lord runs its dasha or antardasha, the native is most likely to conceive or have a child.', hi: 'प्रमुख गर्भधारण/जन्म काल। जब पञ्चमेश की दशा या अन्तर्दशा चलती है तब सन्तान प्राप्ति सर्वाधिक सम्भव।' }, icon: Clock, color: 'text-amber-400' },
            { trigger: { en: 'Jupiter transit over 5th from Moon', hi: 'चन्द्र से 5वें पर गुरु गोचर' }, effect: { en: 'Fertility peak period. Jupiter\'s transit over the 5th house from Moon sign activates the children potential for approximately 13 months.', hi: 'प्रजनन शिखर काल। चन्द्र राशि से पञ्चम पर गुरु गोचर लगभग 13 माह सन्तान सम्भावना सक्रिय करता है।' }, icon: Sparkles, color: 'text-yellow-400' },
            { trigger: { en: 'Jupiter-Saturn double transit on 5th', hi: 'गुरु-शनि दोहरा गोचर पञ्चम पर' }, effect: { en: 'The Jaimini double-transit principle: when BOTH Jupiter and Saturn aspect the 5th house (or its lord) simultaneously by transit, childbirth year is confirmed.', hi: 'जैमिनी दोहरा-गोचर सिद्धान्त: जब गुरु और शनि दोनों गोचर से पञ्चम भाव (या पञ्चमेश) को एक साथ देखें, सन्तान वर्ष पुष्ट।' }, icon: Target, color: 'text-emerald-400' },
            { trigger: { en: 'D7 Lagna lord Dasha', hi: 'D7 लग्नेश दशा' }, effect: { en: 'Final confirmation. When the lord of the D7 lagna runs its period in the main Vimshottari dasha, childbirth timing is strongly indicated.', hi: 'अन्तिम पुष्टि। जब D7 लग्नेश की विंशोत्तरी दशा चलती है तब सन्तान प्राप्ति काल दृढ़ता से संकेतित।' }, icon: Star, color: 'text-violet-400' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-4 rounded-xl bg-bg-secondary/40 border border-gold-primary/10">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-gold-light font-bold text-sm" style={hf}>{t(item.trigger)}</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed ml-6">{t(item.effect)}</p>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 3: Fertility Assessment */}
      <LessonSection number={3} title={isHi ? 'प्रजनन मूल्यांकन' : 'Fertility Assessment'}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-gold-primary/15">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-amber-400" />
                <h4 className="text-gold-light font-bold text-sm" style={hf}>{isHi ? 'बीज स्फुट (पुरुष)' : 'Bija Sphuta (Male)'}</h4>
              </div>
              <p className="text-text-secondary text-xs mb-2">{isHi ? 'सूर्य + शुक्र + गुरु के अंश = बीज स्फुट' : 'Sun + Venus + Jupiter longitudes = Bija Sphuta'}</p>
              <p className="text-text-tertiary text-xs leading-relaxed">
                {isHi
                  ? 'विषम राशि में + शुभ नक्षत्र में = सशक्त प्रजनन क्षमता। सम राशि + पाप नक्षत्र = दुर्बल।'
                  : 'In odd sign + benefic nakshatra = strong fertility. Even sign + malefic nakshatra = weak. This ancient formula assesses male reproductive potential.'}
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/15">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-pink-400" />
                <h4 className="text-pink-300 font-bold text-sm" style={hf}>{isHi ? 'क्षेत्र स्फुट (स्त्री)' : 'Kshetra Sphuta (Female)'}</h4>
              </div>
              <p className="text-text-secondary text-xs mb-2">{isHi ? 'चन्द्र + मंगल + गुरु के अंश = क्षेत्र स्फुट' : 'Moon + Mars + Jupiter longitudes = Kshetra Sphuta'}</p>
              <p className="text-text-tertiary text-xs leading-relaxed">
                {isHi
                  ? 'सम राशि में = अनुकूल। शुभ ग्रह दृष्टि = प्रजनन क्षमता उत्तम। पाप दृष्टि = चिकित्सा आवश्यक।'
                  : 'In even sign = favorable. Benefic aspect = excellent fertility. Malefic aspect = medical support may be needed. Ancient gynecological astrology formula.'}
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {[
              { indicator: { en: 'Jupiter in 5th/9th', hi: 'गुरु 5वें/9वें में' }, result: { en: 'Natural fertility blessing. Jupiter in trikona from lagna strongly supports children.', hi: 'प्राकृतिक प्रजनन आशीर्वाद। लग्न से त्रिकोण में गुरु सन्तान सुख।' }, positive: true },
              { indicator: { en: 'Saturn in 5th', hi: 'शनि 5वें में' }, result: { en: 'Delayed children, NOT denied. Often children come after age 30-36. Patience rewarded.', hi: 'विलम्बित सन्तान, निषेध नहीं। प्रायः 30-36 वर्ष बाद। धैर्य पुरस्कृत।' }, positive: false },
              { indicator: { en: '4+ Bindus in 5th (SAV)', hi: '5वें में 4+ बिन्दु (SAV)' }, result: { en: 'Ashtakavarga: 4 or more bindus in the 5th sign = strong likelihood of children.', hi: 'अष्टकवर्ग: पञ्चम राशि में 4 या अधिक बिन्दु = सन्तान प्रबल सम्भावना।' }, positive: true },
              { indicator: { en: 'Multiple planets in 5th', hi: '5वें में बहु ग्रह' }, result: { en: 'Multiple children possibility. 5th lord in dual sign (Gemini/Sagittarius/Pisces/Virgo) = twins.', hi: 'बहु सन्तान सम्भावना। पञ्चमेश द्वि-राशि में = जुड़वां सम्भव।' }, positive: true },
            ].map((item, i) => (
              <div key={i} className={`p-3 rounded-xl border ${item.positive ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-amber-500/15 bg-amber-500/5'}`}>
                <span className={`font-bold text-xs ${item.positive ? 'text-emerald-400' : 'text-amber-400'}`} style={hf}>{t(item.indicator)}</span>
                <p className="text-text-tertiary text-xs mt-1 leading-relaxed">{t(item.result)}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* Section 4: 5th House Sign Nature */}
      <LessonSection number={4} title={isHi ? 'पञ्चम भाव राशि अनुसार सन्तान स्वभाव' : 'Child Nature by 5th House Sign'}>
        <p className="text-text-secondary text-sm mb-4">
          {isHi ? 'आपकी पञ्चम भाव राशि प्रथम सन्तान का स्वभाव और प्रवृत्ति दर्शाती है:' : 'Your 5th house sign reveals the nature and tendencies of your first child:'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FIFTH_SIGN.map((s, i) => (
            <button key={i} onClick={() => setExpandedSign(expandedSign === i ? null : i)}
              className="text-left p-3 rounded-xl bg-bg-secondary/40 border border-gold-primary/8 hover:border-gold-primary/20 transition-colors">
              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm ${s.color}`} style={hf}>{t(s.sign)}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gold-dark transition-transform ${expandedSign === i ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {expandedSign === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="text-text-tertiary text-xs mt-2 leading-relaxed overflow-hidden">{t(s.nature)}</motion.p>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </LessonSection>

      {/* Section 5: Challenges & Remedies */}
      <LessonSection number={5} title={isHi ? 'चुनौतियां एवं उपाय' : 'Challenges & Remedies'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi
            ? 'सन्तान सम्बन्धी कठिनाइयां और उनके ज्योतिषीय उपाय:'
            : 'Common children-related difficulties and their astrological remedies:'}
        </p>
        <div className="space-y-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className={`p-4 rounded-xl border ${c.color} bg-bg-secondary/30`}>
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t(c.condition)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">{t(c.meaning)}</p>
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold">{isHi ? 'उपाय' : 'Remedy'}</span>
                <p className="text-text-tertiary text-xs mt-1 leading-relaxed">{t(c.remedy)}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Navigation links */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          { href: '/kundali' as const, label: isHi ? 'कुण्डली बनाएं' : 'Generate Kundali' },
          { href: '/learn/sphutas' as const, label: isHi ? 'स्फुट विवरण' : 'Fertility Sphutas' },
          { href: '/learn/planet-in-house' as const, label: isHi ? 'भाव में ग्रह' : 'Planet in House' },
        ].map((link) => (
          <Link key={link.href} href={link.href}
            className="px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium hover:bg-gold-primary/20 transition-colors">
            {link.label}
          </Link>
        ))}
      </motion.div>
    </main>
  );
}
