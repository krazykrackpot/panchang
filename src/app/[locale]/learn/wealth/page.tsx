'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, ChevronDown, CircleDollarSign, Crown, Gem, Landmark, Lightbulb, Scale, Shield, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual labels ───────────────────────────────────────────── */
const L = {
  title: { en: 'Wealth Prediction Guide', hi: 'धन भविष्यवाणी मार्गदर्शिका', sa: 'धनभविष्यवाणी-मार्गदर्शिका' },
  subtitle: {
    en: 'Analyze wealth potential through the 2-5-9-11 house axis, Dhana Yogas, timing techniques, and Ashtakavarga scoring.',
    hi: '2-5-9-11 भाव अक्ष, धन योग, समय निर्धारण तकनीक और अष्टकवर्ग स्कोरिंग से धन क्षमता का विश्लेषण।',
    sa: '2-5-9-11 भावाक्षेण धनयोगैः कालनिर्णयतन्त्रैः अष्टकवर्गाङ्कैश्च धनसामर्थ्यविश्लेषणम्।'
  },
};

/* ── Wealth Houses data ──────────────────────────────────────────── */
const WEALTH_HOUSES: { house: string; name: { en: string; hi: string }; desc: { en: string; hi: string }; significations: { en: string; hi: string }; color: string }[] = [
  { house: '2', name: { en: '2nd House', hi: 'द्वितीय भाव' }, desc: { en: 'Accumulated wealth, savings, family money', hi: 'संचित धन, बचत, पारिवारिक सम्पत्ति' }, significations: { en: 'Bank balance, speech (earnings through communication), food habits, family assets, precious metals/gems', hi: 'बैंक बैलेंस, वाणी (संवाद से आय), खानपान, पारिवारिक सम्पत्ति, बहुमूल्य धातु/रत्न' }, color: 'text-emerald-400' },
  { house: '5', name: { en: '5th House', hi: 'पञ्चम भाव' }, desc: { en: 'Speculative gains, intelligence-based income', hi: 'सट्टा लाभ, बुद्धि-आधारित आय' }, significations: { en: 'Stock market, lottery, creative income, children\'s success, past-life merit (Purva Punya), advisory income', hi: 'शेयर बाजार, लॉटरी, सृजनात्मक आय, सन्तान की सफलता, पूर्वपुण्य, सलाहकार आय' }, color: 'text-violet-400' },
  { house: '9', name: { en: '9th House', hi: 'नवम भाव' }, desc: { en: 'Fortune, luck, inherited wealth', hi: 'भाग्य, सौभाग्य, वंशानुगत धन' }, significations: { en: 'Luck, father\'s wealth, past-life credit, long-distance gains, higher education income, religious/spiritual wealth', hi: 'भाग्य, पिता का धन, पूर्वजन्म का श्रेय, दूरस्थ लाभ, उच्च शिक्षा आय, धार्मिक/आध्यात्मिक धन' }, color: 'text-amber-400' },
  { house: '11', name: { en: '11th House', hi: 'एकादश भाव' }, desc: { en: 'Income, gains, profits, wishes fulfilled', hi: 'आय, लाभ, मुनाफा, इच्छापूर्ति' }, significations: { en: 'Regular income, profit from business, network/friend wealth, elder sibling wealth, gains from all sources, fulfilled ambitions', hi: 'नियमित आय, व्यापार लाभ, मित्र/नेटवर्क धन, बड़े भाई-बहन का धन, सभी स्रोतों से लाभ' }, color: 'text-gold-light' },
];

/* ── Dhana Yogas ─────────────────────────────────────────────────── */
const DHANA_YOGAS: { name: { en: string; hi: string }; condition: { en: string; hi: string }; effect: { en: string; hi: string }; strength: 'powerful' | 'strong' | 'moderate' }[] = [
  { name: { en: '2nd + 11th Lord Exchange', hi: '2-11 भावेश परिवर्तन' }, condition: { en: '2nd lord in 11th AND 11th lord in 2nd (mutual exchange)', hi: '2वें भावेश 11वें में और 11वें भावेश 2वें में' }, effect: { en: 'EXCELLENT wealth combination. Earning and saving perfectly synchronized. Wealth accumulates naturally throughout life.', hi: 'उत्कृष्ट धन संयोग। कमाई और बचत पूर्णतः समन्वित। जीवन भर धन स्वाभाविक रूप से संचित।' }, strength: 'powerful' },
  { name: { en: 'Lakshmi Yoga', hi: 'लक्ष्मी योग' }, condition: { en: '9th lord strong in kendra (1,4,7,10) while lagna lord is also strong', hi: '9वें भावेश केन्द्र (1,4,7,10) में बलवान, लग्नेश भी बलवान' }, effect: { en: 'Blessed by Goddess Lakshmi. Fortune, beauty, wealth, and high social status. One of the most coveted wealth yogas.', hi: 'लक्ष्मी कृपा। भाग्य, सौन्दर्य, धन और उच्च सामाजिक स्थिति। सबसे प्रतिष्ठित धन योगों में से एक।' }, strength: 'powerful' },
  { name: { en: 'Jupiter + Mercury in 2nd/11th', hi: 'गुरु + बुध 2/11 में' }, condition: { en: 'Jupiter and Mercury conjunct in 2nd or 11th house', hi: 'गुरु और बुध 2वें या 11वें भाव में युति' }, effect: { en: 'Business wealth through wisdom and intellect. Natural financial acumen. Success in banking, consulting, trading.', hi: 'बुद्धि और ज्ञान से व्यापारिक धन। स्वाभाविक वित्तीय कुशलता। बैंकिंग, परामर्श, व्यापार में सफलता।' }, strength: 'strong' },
  { name: { en: 'Venus in Own/Exalted in 2nd', hi: 'शुक्र स्वगृह/उच्च 2वें में' }, condition: { en: 'Venus in Taurus, Libra, or Pisces in the 2nd house', hi: 'शुक्र वृषभ, तुला या मीन में 2वें भाव में' }, effect: { en: 'Luxury lifestyle, wealth through arts/beauty/entertainment. Enjoys fine food, beautiful possessions, and comfortable living.', hi: 'विलासिता जीवनशैली, कला/सौन्दर्य/मनोरंजन से धन। उत्तम भोजन, सुन्दर वस्तुएं, सुखद जीवन।' }, strength: 'strong' },
  { name: { en: '2nd + 11th Lord Conjunction', hi: '2-11 भावेश युति' }, condition: { en: '2nd lord and 11th lord conjunct in any house', hi: '2वें और 11वें भावेश किसी भी भाव में युति' }, effect: { en: 'Strong wealth indicator. The house of conjunction determines the SOURCE of wealth. In 10th = career wealth, in 9th = fortune.', hi: 'शक्तिशाली धन सूचक। युति का भाव धन का स्रोत निर्धारित करता है। 10वें में = करियर धन, 9वें में = भाग्य।' }, strength: 'strong' },
  { name: { en: 'Dhana Yoga (9th + 1st lords)', hi: 'धन योग (9-1 भावेश)' }, condition: { en: '9th lord and 1st lord in mutual kendras or trikonas', hi: '9वें और 1 भावेश परस्पर केन्द्र या त्रिकोण में' }, effect: { en: 'Fortune meets personality. Self-made wealth through personal effort backed by luck. Natural prosperity attractor.', hi: 'भाग्य और व्यक्तित्व मिलन। भाग्य समर्थित व्यक्तिगत प्रयास से स्वनिर्मित धन।' }, strength: 'moderate' },
];

/* ── SVG: Wealth Triangle — houses 2, 5, 9, 11 connected ────────── */
function WealthTriangleSVG() {
  const r = 105;
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const wealthHouses = [2, 5, 9, 11];

  // Calculate positions
  const getPos = (h: number) => {
    const mid = ((h - 0.5) * 30 - 90) * (Math.PI / 180);
    return { x: Math.cos(mid) * (r * 0.72), y: Math.sin(mid) * (r * 0.72) };
  };

  const wealthPositions = wealthHouses.map(getPos);

  return (
    <svg viewBox="-150 -150 300 300" className="w-full max-w-[340px] mx-auto">
      <defs>
        <radialGradient id="wt-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wt-gold-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0.3" />
        </linearGradient>
        <filter id="wt-glow-f"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <circle cx="0" cy="0" r="140" fill="url(#wt-glow)" />

      {/* House segments */}
      {houses.map((h) => {
        const a1 = ((h - 1) * 30 - 90) * (Math.PI / 180);
        const a2 = (h * 30 - 90) * (Math.PI / 180);
        const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
        const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
        const mid = ((h - 0.5) * 30 - 90) * (Math.PI / 180);
        const tx = Math.cos(mid) * (r * 0.88), ty = Math.sin(mid) * (r * 0.88);
        const isWealth = wealthHouses.includes(h);
        return (
          <g key={h}>
            <path d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
              fill={isWealth ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.02)'}
              stroke={isWealth ? '#d4a853' : 'rgba(212,168,83,0.1)'}
              strokeWidth={isWealth ? 1.5 : 0.5} />
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
              className={isWealth ? 'fill-gold-light font-bold' : 'fill-text-tertiary'}
              fontSize={isWealth ? 12 : 8}>{h}</text>
          </g>
        );
      })}

      {/* Golden connection lines between wealth houses */}
      {wealthPositions.map((p1, i) =>
        wealthPositions.slice(i + 1).map((p2, j) => (
          <line key={`${i}-${j}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="url(#wt-gold-line)" strokeWidth="1.5" strokeDasharray="6,3" />
        ))
      )}

      {/* Glow dots at wealth house positions */}
      {wealthPositions.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="8" fill="rgba(212,168,83,0.15)" filter="url(#wt-glow-f)" />
          <circle cx={p.x} cy={p.y} r="4" fill="#d4a853" opacity="0.7" />
        </g>
      ))}

      {/* Center label */}
      <circle cx="0" cy="0" r="22" fill="rgba(10,14,39,0.85)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
      <text x="0" y="-3" textAnchor="middle" dominantBaseline="middle" className="fill-gold-light" fontSize="7" fontWeight="bold">WEALTH</text>
      <text x="0" y="7" textAnchor="middle" dominantBaseline="middle" className="fill-gold-dark" fontSize="6">2-5-9-11</text>
    </svg>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function WealthPredictionGuide() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const t = (obj: { en: string; hi: string; sa?: string }) => isHi ? (locale === 'sa' && obj.sa ? obj.sa : obj.hi) : obj.en;
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedYoga, setExpandedYoga] = useState<number | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
          <CircleDollarSign className="w-3.5 h-3.5" />
          {isHi ? 'व्यावहारिक मार्गदर्शिका' : 'Practical Guide'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t(L.title)}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t(L.subtitle)}</p>
      </motion.div>

      {/* SVG Wealth Triangle */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/15 flex flex-col items-center">
          <WealthTriangleSVG />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {isHi ? '"धन त्रिकोण" — भाव 2, 5, 9, 11 सुनहरी रेखाओं से जुड़े। 2+11 = कमाई/बचत अक्ष। 5+9 = भाग्य/बुद्धि अक्ष।' : '"Wealth Triangle" — houses 2, 5, 9, 11 connected by golden lines. 2+11 = earning/saving axis. 5+9 = fortune/intelligence axis.'}
          </p>
        </div>
      </motion.div>

      {/* Section 1: The Wealth Houses */}
      <LessonSection number={1} title={isHi ? 'धन भाव' : 'The Wealth Houses'} variant="highlight">
        <div className="space-y-4">
          {WEALTH_HOUSES.map((wh) => (
            <div key={wh.house} className="p-5 rounded-xl bg-bg-secondary/40 border border-gold-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center font-bold text-sm ${wh.color}`}>{wh.house}</div>
                <div>
                  <h3 className={`font-bold text-base ${wh.color}`} style={hf}>{t(wh.name)}</h3>
                  <p className="text-text-tertiary text-xs">{t(wh.desc)}</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed ml-11">{t(wh.significations)}</p>
            </div>
          ))}
          {/* Axis explanation */}
          <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{isHi ? 'अक्ष सम्बन्ध' : 'The Axis Connection'}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-bg-secondary/40">
                <span className="text-emerald-400 font-bold text-xs">{isHi ? '2+11 = कमाई/बचत अक्ष' : '2+11 = Earning/Saving Axis'}</span>
                <p className="text-text-secondary text-xs mt-1">{isHi ? '11वां कमाता है, 2वां बचाता है। दोनों मजबूत = धन संचय।' : '11th earns, 2nd saves. Both strong = wealth accumulation.'}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-secondary/40">
                <span className="text-violet-400 font-bold text-xs">{isHi ? '5+9 = भाग्य/बुद्धि अक्ष' : '5+9 = Fortune/Intelligence Axis'}</span>
                <p className="text-text-secondary text-xs mt-1">{isHi ? '9वां भाग्य देता है, 5वां बुद्धि से बढ़ाता है।' : '9th gives fortune, 5th multiplies through intelligence.'}</p>
              </div>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 2: Dhana Yogas */}
      <LessonSection number={2} title={isHi ? 'धन योग (धन संयोग)' : 'Dhana Yogas (Wealth Combinations)'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi ? 'ये विशिष्ट ग्रह संयोग जन्म कुण्डली में धन क्षमता सूचित करते हैं:' : 'These specific planetary combinations in the birth chart indicate wealth potential:'}
        </p>
        <div className="space-y-2">
          {DHANA_YOGAS.map((dy, i) => {
            const isOpen = expandedYoga === i;
            const strengthColor = dy.strength === 'powerful' ? 'bg-amber-500/15 text-amber-300' : dy.strength === 'strong' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-blue-500/15 text-blue-300';
            return (
              <div key={i} className="rounded-xl border border-gold-primary/10 overflow-hidden">
                <button onClick={() => setExpandedYoga(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-gold-light font-bold text-sm" style={hf}>{t(dy.name)}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${strengthColor}`}>
                      {dy.strength === 'powerful' ? (isHi ? 'अति शक्तिशाली' : 'Powerful') : dy.strength === 'strong' ? (isHi ? 'शक्तिशाली' : 'Strong') : (isHi ? 'मध्यम' : 'Moderate')}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1 space-y-2">
                        <div className="p-2 rounded-lg bg-bg-secondary/50">
                          <span className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">{isHi ? 'शर्त' : 'Condition'}</span>
                          <p className="text-text-secondary text-sm">{t(dy.condition)}</p>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">{t(dy.effect)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 3: Poverty Indicators & Remedies */}
      <LessonSection number={3} title={isHi ? 'दरिद्रता सूचक एवं उपाय' : 'Poverty Indicators & Remedies'}>
        <div className="space-y-3">
          {[
            { indicator: { en: '11th Lord in 6/8/12', hi: '11वें भावेश 6/8/12 में' }, problem: { en: 'Income struggles. The house of gains is weakened by dusthana placement. Earnings come with great effort or are lost through debts (6th), sudden losses (8th), or expenses (12th).', hi: 'आय में संघर्ष। लाभ का भाव दुःस्थान स्थिति से कमजोर। ऋण (6), आकस्मिक हानि (8), या व्यय (12) से।' }, remedy: { en: 'Strengthen 11th lord through its gemstone, mantra, or charity on its day. Serve elders and network actively.', hi: '11वें भावेश को उसके रत्न, मन्त्र या उसके दिन दान से सशक्त करें। बड़ों की सेवा और सक्रिय नेटवर्किंग।' }, color: 'border-red-500/20' },
            { indicator: { en: 'Malefics in 2nd without Benefic Aspect', hi: 'शुभ दृष्टि बिना 2वें में पापग्रह' }, problem: { en: 'Savings drain constantly. Money comes but doesn\'t stay. Harsh speech may damage earning opportunities. Family financial disputes.', hi: 'बचत लगातार घटती है। धन आता है पर रुकता नहीं। कठोर वाणी अवसर क्षीण कर सकती है।' }, remedy: { en: 'Donate food on Saturdays (Saturn) or Tuesdays (Mars). Practice sweet speech. Store savings in fixed deposits.', hi: 'शनिवार (शनि) या मंगलवार (मंगल) को अन्नदान। मधुर वाणी का अभ्यास। फिक्स्ड डिपॉजिट में बचत।' }, color: 'border-amber-500/20' },
            { indicator: { en: 'Saturn + Rahu in 2nd', hi: 'शनि + राहु 2वें में' }, problem: { en: 'Financial anxiety and fear of poverty even when earning. Hoarding tendency. Sudden financial shocks. Debt traps.', hi: 'कमाई के बावजूद वित्तीय चिन्ता और गरीबी का भय। जमाखोरी। आकस्मिक वित्तीय आघात। ऋण जाल।' }, remedy: { en: 'Feed crows and black dogs on Saturdays. Recite Hanuman Chalisa. Avoid gambling and speculative investments.', hi: 'शनिवार को कौवों और काले कुत्तों को खिलाएं। हनुमान चालीसा पाठ। जुआ और सट्टा निवेश से बचें।' }, color: 'border-slate-500/20' },
            { indicator: { en: 'Debilitated Jupiter', hi: 'नीच गुरु' }, problem: { en: 'Jupiter debilitated in Capricorn weakens overall prosperity. Lack of wisdom in financial decisions. Missed opportunities due to pessimism.', hi: 'मकर में नीच गुरु समग्र समृद्धि कमजोर करता है। वित्तीय निर्णयों में ज्ञान की कमी।' }, remedy: { en: 'Wear yellow sapphire (if suitable), donate yellow items on Thursdays, respect teachers and priests.', hi: 'पुखराज धारण (यदि उपयुक्त), गुरुवार को पीली वस्तुएं दान, गुरुजनों का सम्मान।' }, color: 'border-yellow-500/20' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl bg-bg-secondary/40 border ${item.color}`}>
              <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{t(item.indicator)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">{t(item.problem)}</p>
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <span className="text-emerald-400 text-[10px] uppercase tracking-wider font-bold">{isHi ? 'उपाय' : 'Remedy'}</span>
                <p className="text-emerald-300/80 text-xs mt-1">{t(item.remedy)}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Timing Wealth Events */}
      <LessonSection number={4} title={isHi ? 'धन घटनाओं का समय निर्धारण' : 'Timing Wealth Events'} variant="highlight">
        <div className="space-y-4">
          {[
            { trigger: { en: '2nd/11th Lord Dasha', hi: '2/11 भावेश दशा' }, effect: { en: 'Primary earning period. The Mahadasha or Antardasha of 2nd lord brings savings accumulation; 11th lord dasha brings income growth, new revenue streams, and fulfilled financial wishes.', hi: 'प्राथमिक कमाई काल। 2वें भावेश दशा बचत संचय; 11वें भावेश दशा आय वृद्धि, नई आय धाराएं।' }, color: 'bg-emerald-500/10 border-emerald-500/20' },
            { trigger: { en: 'Jupiter in 2/5/9/11 from Moon', hi: 'चन्द्र से 2/5/9/11 में गुरु' }, effect: { en: 'Jupiter transiting the wealth houses from Moon sign expands financial opportunities. Jupiter in 11th from Moon is the single best transit for income growth.', hi: 'चन्द्र से धन भावों में गुरु गोचर वित्तीय अवसर बढ़ाता है। चन्द्र से 11वें में गुरु आय वृद्धि का सर्वोत्तम गोचर।' }, color: 'bg-yellow-500/10 border-yellow-500/20' },
            { trigger: { en: 'Saturn in 11th from Moon', hi: 'चन्द्र से 11वें में शनि' }, effect: { en: 'Steady income after sustained effort. Saturn in 11th rewards hard workers with consistent, reliable gains. Not sudden wealth but stable growth.', hi: 'निरन्तर प्रयास के बाद स्थिर आय। 11वें में शनि कठिन परिश्रमियों को सुसंगत, विश्वसनीय लाभ देता है।' }, color: 'bg-slate-500/10 border-slate-500/20' },
            { trigger: { en: '5th Lord Dasha + Jupiter Transit', hi: '5वें भावेश दशा + गुरु गोचर' }, effect: { en: 'Speculative gains, lottery, stock market success. When 5th lord dasha coincides with Jupiter transiting a wealth house, windfall gains are possible.', hi: 'सट्टा लाभ, लॉटरी, शेयर बाजार सफलता। 5वें भावेश दशा + गुरु धन भाव गोचर = अप्रत्याशित लाभ सम्भव।' }, color: 'bg-violet-500/10 border-violet-500/20' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t(item.trigger)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{t(item.effect)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 5: Ashtakavarga and Wealth */}
      <LessonSection number={5} title={isHi ? 'अष्टकवर्ग और धन' : 'Ashtakavarga & Wealth'}>
        <div className="space-y-4">
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? 'सर्वाष्टकवर्ग (SAV) में 11वें भाव का स्कोर धन क्षमता का संख्यात्मक मापदण्ड है। यह 8 ग्रहों के योगदान बिन्दुओं का योग है।'
              : 'The Sarvashtakavarga (SAV) score of the 11th sign is a numerical measure of wealth potential. It sums contribution points from all 8 chart factors.'}
          </p>
          {/* Score interpretation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { range: '30+', quality: { en: 'Excellent', hi: 'उत्कृष्ट' }, desc: { en: 'Strong income when planets transit the 11th sign. Financial abundance.', hi: 'ग्रहों के 11वें राशि गोचर पर मजबूत आय। वित्तीय प्रचुरता।' }, color: 'border-emerald-500/20 bg-emerald-500/5' },
              { range: '25-29', quality: { en: 'Good', hi: 'अच्छा' }, desc: { en: 'Decent income, especially during favorable dashas. Steady growth.', hi: 'अनुकूल दशा में अच्छी आय। स्थिर विकास।' }, color: 'border-blue-500/20 bg-blue-500/5' },
              { range: '<25', quality: { en: 'Challenging', hi: 'चुनौतीपूर्ण' }, desc: { en: 'Income requires more effort. Strengthen 11th lord and its dispositor through remedies.', hi: 'आय के लिए अधिक प्रयास। उपायों से 11वें भावेश को सशक्त करें।' }, color: 'border-red-500/20 bg-red-500/5' },
            ].map((s, i) => (
              <div key={i} className={`p-4 rounded-xl border ${s.color} text-center`}>
                <div className="text-2xl font-bold text-gold-light mb-1" style={hf}>{s.range}</div>
                <div className="text-gold-dark text-xs font-bold uppercase tracking-wider mb-2">{t(s.quality)}</div>
                <p className="text-text-secondary text-xs leading-relaxed">{t(s.desc)}</p>
              </div>
            ))}
          </div>
          {/* How it works */}
          <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{isHi ? 'कैसे उपयोग करें' : 'How to Use This'}</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {isHi
                ? 'अपनी कुण्डली बनाएं और अष्टकवर्ग तालिका देखें। 11वें राशि (लग्न से 11वें भाव की राशि) का SAV स्कोर जांचें। जब कोई ग्रह (विशेषकर गुरु या शनि) उस राशि से गोचर करे — वह आय की अवधि है।'
                : 'Generate your Kundali and check the Ashtakavarga table. Find the SAV score of the 11th sign (the sign of the 11th house from lagna). When any planet (especially Jupiter or Saturn) transits that sign — that is an income period.'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* Cross-references */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/15">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>{isHi ? 'सम्बन्धित विषय' : 'Related Topics'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: '/kundali' as const, label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएं' } },
            { href: '/learn/ashtakavarga' as const, label: { en: 'Ashtakavarga System', hi: 'अष्टकवर्ग प्रणाली' } },
            { href: '/learn/planet-in-house' as const, label: { en: 'Planet in House Guide', hi: 'भाव में ग्रह मार्गदर्शिका' } },
            { href: '/learn/yogas' as const, label: { en: 'Yogas (Combinations)', hi: 'योग (ग्रह संयोग)' } },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 p-3 rounded-xl bg-bg-secondary/40 border border-gold-primary/8 hover:border-gold-primary/25 transition-colors group">
              <Zap className="w-4 h-4 text-gold-dark group-hover:text-gold-light transition-colors" />
              <span className="text-text-secondary text-sm group-hover:text-gold-light transition-colors">{t(link.label)}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
