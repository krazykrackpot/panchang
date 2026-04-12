'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown, Clock, AlertTriangle, Crown, Gem, Moon, Shield, Sparkles, Star, Users, Zap } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual labels ───────────────────────────────────────────── */
const L = {
  title: { en: 'Marriage Prediction Guide', hi: 'विवाह भविष्यवाणी मार्गदर्शिका', sa: 'विवाहभविष्यवाणी-मार्गदर्शिका' , ta: 'திருமண கணிப்பு வழிகாட்டி' },
  subtitle: {
    en: 'A comprehensive framework for analyzing marriage timing, spouse characteristics, and marital happiness through D1, D9 Navamsha, and Jaimini techniques.',
    hi: 'D1, D9 नवमांश और जैमिनी तकनीकों से विवाह समय, जीवनसाथी विशेषताएं और वैवाहिक सुख का विश्लेषण।',
    sa: 'D1, D9 नवमांशं जैमिनीतन्त्रैश्च विवाहकालं पतिपत्नीगुणान् वैवाहिकसुखं च विश्लेष्टुं सम्पूर्णं ढाञ्चम्।'
  },
};

/* ── 7th house sign spouse data ──────────────────────────────────── */
const SPOUSE_BY_SIGN: { sign: { en: string; hi: string }; traits: { en: string; hi: string }; color: string }[] = [
  { sign: { en: 'Aries', hi: 'मेष' }, traits: { en: 'Independent, assertive, energetic spouse. May be athletic or in a leadership role. Dynamic but potentially argumentative relationship.', hi: 'स्वतन्त्र, दृढ़, ऊर्जावान जीवनसाथी। खिलाड़ी या नेता हो सकता है। गतिशील किन्तु विवादास्पद सम्बन्ध।' }, color: 'text-red-400' },
  { sign: { en: 'Taurus', hi: 'वृषभ' }, traits: { en: 'Stable, financially secure, beauty-conscious spouse. Loves comfort and luxury. Loyal but possessive. Sensual relationship.', hi: 'स्थिर, आर्थिक रूप से सम्पन्न, सौन्दर्य-प्रेमी। वफादार किन्तु अधिकारी। संवेदनशील सम्बन्ध।' }, color: 'text-emerald-400' },
  { sign: { en: 'Gemini', hi: 'मिथुन' }, traits: { en: 'Witty, communicative, youthful spouse. Intellectual connection matters most. May be younger-looking or in media/communication.', hi: 'हाजिरजवाब, संवादशील, युवा जीवनसाथी। बौद्धिक सम्बन्ध सबसे महत्वपूर्ण।' }, color: 'text-yellow-300' },
  { sign: { en: 'Cancer', hi: 'कर्क' }, traits: { en: 'Nurturing, emotional, family-oriented spouse. Excellent cook/homemaker. Deep emotional bond but mood swings possible.', hi: 'पोषणकारी, भावनात्मक, परिवार-उन्मुख। उत्कृष्ट गृहिणी। गहरा बन्धन किन्तु मनोदशा परिवर्तन।' }, color: 'text-blue-300' },
  { sign: { en: 'Leo', hi: 'सिंह' }, traits: { en: 'Proud, generous, charismatic spouse. Wants to be admired. Creative and warm-hearted. May dominate the relationship.', hi: 'गर्वित, उदार, करिश्माई। प्रशंसा चाहता है। सृजनशील और उदारहृदय। सम्बन्ध में प्रभुत्व।' }, color: 'text-amber-400' },
  { sign: { en: 'Virgo', hi: 'कन्या' }, traits: { en: 'Practical, health-conscious, detail-oriented spouse. Helpful and service-minded. May be critical. Values routine.', hi: 'व्यावहारिक, स्वास्थ्य-सचेत, विस्तार-उन्मुख। सहायक किन्तु आलोचक। दिनचर्या को महत्व देता है।' }, color: 'text-green-400' },
  { sign: { en: 'Libra', hi: 'तुला' }, traits: { en: 'Attractive, diplomatic, refined spouse. Values harmony and fairness. Artistic sensibility. May be indecisive.', hi: 'आकर्षक, कूटनीतिक, परिष्कृत। सामंजस्य और निष्पक्षता को महत्व। अनिर्णायक हो सकता है।' }, color: 'text-pink-300' },
  { sign: { en: 'Scorpio', hi: 'वृश्चिक' }, traits: { en: 'Intense, passionate, magnetic spouse. Deep emotional/physical bond. Jealous and possessive. Transformative relationship.', hi: 'तीव्र, जुनूनी, चुम्बकीय। गहरा भावनात्मक/शारीरिक बन्धन। ईर्ष्यालु। परिवर्तनकारी सम्बन्ध।' }, color: 'text-red-500' },
  { sign: { en: 'Sagittarius', hi: 'धनु' }, traits: { en: 'Philosophical, adventurous, freedom-loving spouse. May be from different culture/religion. Values growth and travel.', hi: 'दार्शनिक, साहसी, स्वतन्त्रता-प्रेमी। भिन्न संस्कृति/धर्म से हो सकता है। विकास और यात्रा को महत्व।' }, color: 'text-violet-400' },
  { sign: { en: 'Capricorn', hi: 'मकर' }, traits: { en: 'Mature, ambitious, disciplined spouse. Career-focused. May marry someone older. Relationship improves with time.', hi: 'परिपक्व, महत्वाकांक्षी, अनुशासित। करियर-केन्द्रित। बड़ा जीवनसाथी सम्भव। समय के साथ सम्बन्ध सुधरे।' }, color: 'text-slate-300' },
  { sign: { en: 'Aquarius', hi: 'कुम्भ' }, traits: { en: 'Unconventional, intellectual, humanitarian spouse. Values friendship in marriage. May be eccentric. Progressive views.', hi: 'अपरम्परागत, बौद्धिक, मानवतावादी। विवाह में मित्रता को महत्व। प्रगतिशील विचार।' }, color: 'text-cyan-400' },
  { sign: { en: 'Pisces', hi: 'मीन' }, traits: { en: 'Spiritual, compassionate, artistic spouse. Deep intuitive connection. May be dreamy or escapist. Selfless love.', hi: 'आध्यात्मिक, दयालु, कलात्मक। गहरा अन्तर्ज्ञानी सम्बन्ध। निःस्वार्थ प्रेम।' }, color: 'text-indigo-400' },
];

/* ── SVG: D1 (7H highlighted) + D9 Navamsha side by side ─────── */
function MarriageChartSVG() {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const r = 85;

  function Wheel({ cx, label, highlightHouse }: { cx: number; label: string; highlightHouse: number }) {
    return (
      <g transform={`translate(${cx}, 0)`}>
        {houses.map((h) => {
          const a1 = ((h - 1) * 30 - 90) * (Math.PI / 180);
          const a2 = (h * 30 - 90) * (Math.PI / 180);
          const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
          const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
          const mid = ((h - 0.5) * 30 - 90) * (Math.PI / 180);
          const tx = Math.cos(mid) * (r * 0.68), ty = Math.sin(mid) * (r * 0.68);
          const isHL = h === highlightHouse;
          return (
            <g key={h}>
              <path d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                fill={isHL ? 'rgba(220,100,130,0.2)' : 'rgba(255,255,255,0.03)'}
                stroke={isHL ? '#e8829a' : 'rgba(212,168,83,0.12)'}
                strokeWidth={isHL ? 1.5 : 0.5} />
              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                className={isHL ? 'fill-pink-300 font-bold' : 'fill-text-tertiary'}
                fontSize={isHL ? 11 : 8}>{h}</text>
            </g>
          );
        })}
        <circle cx="0" cy="0" r="14" fill="rgba(10,14,39,0.8)" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />
        <text x="0" y="-100" textAnchor="middle" className="fill-gold-light" fontSize="10" fontWeight="bold">{label}</text>
      </g>
    );
  }

  return (
    <svg viewBox="-220 -120 440 240" className="w-full max-w-[480px] mx-auto">
      <defs>
        <radialGradient id="mw-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#e8829a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e8829a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-220" y="-120" width="440" height="240" fill="url(#mw-glow)" rx="12" />
      <Wheel cx={-105} label="D1 (Rashi)" highlightHouse={7} />
      <Wheel cx={105} label="D9 (Navamsha)" highlightHouse={7} />
      {/* connector */}
      <line x1="-15" y1="0" x2="15" y2="0" stroke="rgba(212,168,83,0.3)" strokeWidth="1" strokeDasharray="4,3" />
      <text x="0" y="4" textAnchor="middle" className="fill-gold-dark" fontSize="7">+</text>
    </svg>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function MarriagePredictionGuide() {
  const locale = useLocale() as Locale;
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  const t = (obj: { en: string; hi: string; sa?: string }) => isHi ? (locale === 'sa' && obj.sa ? obj.sa : obj.hi) : obj.en;
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedSign, setExpandedSign] = useState<number | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium mb-4">
          <Heart className="w-3.5 h-3.5" />
          {isHi ? 'व्यावहारिक मार्गदर्शिका' : 'Practical Guide'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t(L.title)}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t(L.subtitle)}</p>
      </motion.div>

      {/* SVG Charts */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-pink-500/15 flex flex-col items-center">
          <MarriageChartSVG />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {isHi ? 'D1 रासि चार्ट (7वां भाव = विवाह) और D9 नवमांश (विवाह का सूक्ष्म चार्ट) साथ-साथ' : 'D1 Rashi chart (7th house = marriage) alongside D9 Navamsha (the microscopic marriage chart)'}
          </p>
        </div>
      </motion.div>

      {/* Section 1: Marriage Analysis Framework */}
      <LessonSection number={1} title={isHi ? 'विवाह विश्लेषण ढांचा' : 'The Marriage Analysis Framework'} variant="highlight">
        <div className="space-y-6">
          {[
            { step: 1, title: { en: '7th House Sign', hi: 'सप्तम भाव राशि' }, desc: { en: 'The sign on the 7th house cusp describes your spouse\'s fundamental personality and the nature of your marriage. This is the most direct indicator of partner characteristics.', hi: '7वें भाव पर राशि आपके जीवनसाथी के मूल व्यक्तित्व और विवाह की प्रकृति का वर्णन करती है।' }, icon: Users, color: 'text-pink-400' },
            { step: 2, title: { en: '7th Lord Placement', hi: 'सप्तमेश की स्थिति' }, desc: { en: 'Where the 7th lord sits reveals WHERE marriage energy comes from. 7th lord in 1st = spouse comes to you; in 4th = through family; in 9th = through travel/education; in 12th = foreign spouse.', hi: 'सप्तमेश जहां बैठता है वह दर्शाता है विवाह ऊर्जा कहां से आती है। 1 में = जीवनसाथी आपके पास आता है; 4 में = परिवार से; 12 में = विदेशी।' }, icon: Star, color: 'text-amber-400' },
            { step: 3, title: { en: 'Venus Condition', hi: 'शुक्र की स्थिति' }, desc: { en: 'Venus is the karaka (significator) of marriage and love. Venus combust (too close to Sun), debilitated (in Virgo), or afflicted by malefics = relationship challenges. Strong Venus = harmonious marriage.', hi: 'शुक्र विवाह और प्रेम का कारक है। अस्त, नीच या पापग्रहों से पीड़ित शुक्र = सम्बन्ध चुनौतियां। बलवान शुक्र = सामंजस्यपूर्ण विवाह।' }, icon: Gem, color: 'text-pink-300' },
            { step: 4, title: { en: 'D9 Navamsha Chart', hi: 'D9 नवमांश कुण्डली' }, desc: { en: 'THE marriage chart. The 7th house of D9 reveals deeper spouse qualities. The D9 lagna lord\'s condition shows marital happiness. D9 is consulted for ALL marriage predictions.', hi: 'यह विवाह कुण्डली है। D9 का 7वां भाव गहरे जीवनसाथी गुण दर्शाता है। D9 लग्नेश वैवाहिक सुख दर्शाता है।' }, icon: Crown, color: 'text-violet-400' },
            { step: 5, title: { en: 'Darakaraka (DK)', hi: 'दारकारक' }, desc: { en: 'In Jaimini astrology, the planet with the LOWEST degree becomes the Darakaraka — the spouse significator. Its sign, nakshatra, and navamsha placement describe the spouse in detail.', hi: 'जैमिनी ज्योतिष में सबसे कम अंश वाला ग्रह दारकारक बनता है — जीवनसाथी सूचक। इसकी राशि, नक्षत्र, नवमांश जीवनसाथी का वर्णन करते हैं।' }, icon: Sparkles, color: 'text-cyan-400' },
            { step: 6, title: { en: 'Upapada Lagna', hi: 'उपपद लग्न' }, desc: { en: 'The Arudha of the 12th house (UL). Its sign and planets influencing it describe the spouse\'s social image and the nature of the marital bond from a Jaimini perspective.', hi: '12वें भाव का आरूढ (UL)। इसकी राशि और प्रभावी ग्रह जीवनसाथी की सामाजिक छवि और वैवाहिक बन्धन का वर्णन करते हैं।' }, icon: Shield, color: 'text-gold-light' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="flex gap-4 items-start p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pink-300/70 text-xs font-bold uppercase tracking-wider">{isHi ? `चरण ${s.step}` : `Step ${s.step}`}</span>
                    <h3 className="text-gold-light font-bold text-base" style={hf}>{t(s.title)}</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{t(s.desc)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 2: Spouse by 7th House Sign */}
      <LessonSection number={2} title={isHi ? 'सप्तम भाव राशि अनुसार जीवनसाथी' : 'Spouse Characteristics by 7th House Sign'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi ? 'आपके 7वें भाव की राशि जीवनसाथी के व्यक्तित्व का खाका खींचती है:' : 'The sign on your 7th house cusp sketches the blueprint of your spouse\'s personality:'}
        </p>
        <div className="space-y-2">
          {SPOUSE_BY_SIGN.map((s, i) => {
            const isOpen = expandedSign === i;
            return (
              <div key={i} className="rounded-xl border border-gold-primary/10 overflow-hidden">
                <button onClick={() => setExpandedSign(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-pink-500/5 transition-colors">
                  <span className={`font-bold text-sm ${s.color}`} style={hf}>{t(s.sign)}</span>
                  <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1">
                        <p className="text-text-secondary text-sm leading-relaxed">{t(s.traits)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 3: Marriage Timing */}
      <LessonSection number={3} title={isHi ? 'विवाह का समय निर्धारण' : 'Marriage Timing'} variant="highlight">
        <div className="space-y-4">
          {[
            { trigger: { en: 'Venus or 7th Lord Dasha', hi: 'शुक्र या सप्तमेश दशा' }, effect: { en: 'The Mahadasha or Antardasha of Venus (marriage karaka) or the 7th lord is the primary marriage window. If both activate simultaneously, marriage is highly likely.', hi: 'शुक्र (विवाह कारक) या सप्तमेश की महादशा/अन्तर्दशा प्राथमिक विवाह काल है। दोनों एक साथ सक्रिय = विवाह अत्यधिक सम्भव।' }, color: 'bg-pink-500/10 border-pink-500/20' },
            { trigger: { en: 'Jupiter Transit over 7th', hi: 'गुरु का सप्तम पर गोचर' }, effect: { en: 'Jupiter transiting the 7th house from Moon or Lagna expands relationship opportunities. Jupiter\'s blessing on the marriage house opens doors.', hi: 'चन्द्र या लग्न से 7वें भाव में गुरु का गोचर सम्बन्ध अवसर बढ़ाता है।' }, color: 'bg-yellow-500/10 border-yellow-500/20' },
            { trigger: { en: 'Saturn Activating 7th', hi: 'शनि का सप्तम पर प्रभाव' }, effect: { en: 'Saturn transiting the 7th or aspecting it (3rd, 7th, 10th aspect) brings commitment and formalization. Saturn makes relationships serious.', hi: 'शनि का 7वें भाव में गोचर या दृष्टि प्रतिबद्धता और औपचारिकता लाता है।' }, color: 'bg-slate-500/10 border-slate-500/20' },
            { trigger: { en: 'Double Transit = Marriage Year', hi: 'दोहरा गोचर = विवाह वर्ष' }, effect: { en: 'When BOTH Jupiter AND Saturn simultaneously activate the 7th house (by transit or aspect), this is the strongest marriage timing indicator. The year this occurs during Venus/7th lord dasha is the marriage year.', hi: 'जब गुरु और शनि दोनों एक साथ 7वें भाव को सक्रिय करें — यह सबसे शक्तिशाली विवाह समय सूचक है। शुक्र/सप्तमेश दशा में यह वर्ष विवाह वर्ष है।' }, color: 'bg-gold-primary/10 border-gold-primary/20' },
            { trigger: { en: 'Navamsha Lagna Lord Dasha', hi: 'नवमांश लग्नेश दशा' }, effect: { en: 'The dasha of the D9 lagna lord also triggers marriage events. This is a powerful confirmatory indicator used alongside the D1 analysis.', hi: 'D9 लग्नेश की दशा भी विवाह घटनाओं को सक्रिय करती है। यह D1 विश्लेषण के साथ शक्तिशाली पुष्टिकारक सूचक है।' }, color: 'bg-violet-500/10 border-violet-500/20' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t(item.trigger)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{t(item.effect)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Delay Indicators */}
      <LessonSection number={4} title={isHi ? 'विवाह विलम्ब सूचक' : 'Marriage Delay Indicators'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi ? 'कुछ ग्रह संयोग विवाह में विलम्ब का कारण बनते हैं। समझना महत्वपूर्ण — विलम्ब निषेध नहीं है:' : 'Certain planetary configurations delay marriage. Understanding is key — delay is not denial:'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { indicator: { en: 'Saturn Aspect on 7th/Venus', hi: 'शनि की 7वें/शुक्र पर दृष्टि' }, detail: { en: 'Saturn\'s aspect on the 7th house or Venus delays marriage but brings a mature, lasting union. Marriage typically after 28-30 or during Saturn dasha.', hi: 'शनि की 7वें भाव या शुक्र पर दृष्टि विवाह में विलम्ब करती है किन्तु परिपक्व, स्थायी बन्धन देती है। 28-30 के बाद या शनि दशा में विवाह।' }, icon: Clock, color: 'text-slate-400' },
            { indicator: { en: '7th Lord in Dusthana (6/8/12)', hi: 'सप्तमेश दुःस्थान (6/8/12) में' }, detail: { en: '7th lord in 6th = conflicts before marriage; in 8th = transformative/delayed marriage; in 12th = foreign spouse or marriage away from homeland.', hi: '6वें में = विवाह पूर्व विवाद; 8वें = परिवर्तनकारी/विलम्बित; 12वें = विदेशी जीवनसाथी।' }, icon: AlertTriangle, color: 'text-amber-400' },
            { indicator: { en: 'Rahu in 7th House', hi: 'राहु सप्तम भाव में' }, detail: { en: 'Foreign or unconventional spouse. Delayed marriage. May marry someone from a different culture, religion, or social background. Relationship obsession possible.', hi: 'विदेशी या अपरम्परागत जीवनसाथी। विलम्बित विवाह। भिन्न संस्कृति या सामाजिक पृष्ठभूमि।' }, icon: Sparkles, color: 'text-cyan-400' },
            { indicator: { en: 'Venus Combust', hi: 'शुक्र अस्त' }, detail: { en: 'Venus within 6 degrees of Sun loses its power. Love life feels "burned" — difficulty expressing affection, attracting partners, or finding satisfaction in relationships.', hi: 'सूर्य से 6 अंश के भीतर शुक्र शक्ति खो देता है। प्रेम जीवन "जला हुआ" लगता है।' }, icon: AlertTriangle, color: 'text-red-400' },
            { indicator: { en: 'Mangal Dosha', hi: 'मंगल दोष' }, detail: { en: 'Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house creates Mangal Dosha. Cancellation: Mars in own/exalted sign, Jupiter aspect, spouse also has dosha, or Mars in certain signs.', hi: 'मंगल 1, 2, 4, 7, 8, 12वें भाव में मंगल दोष बनाता है। निवारण: स्वराशि/उच्च, गुरु दृष्टि, जीवनसाथी में भी दोष।' }, icon: Shield, color: 'text-red-500' },
            { indicator: { en: '12th Lord in 7th', hi: '12वें भावेश सप्तम में' }, detail: { en: 'Brings loss or expenditure through marriage. Spouse may drain resources. However, also indicates foreign connections and spiritual bond.', hi: 'विवाह से हानि या व्यय। जीवनसाथी संसाधन क्षीण कर सकता है। विदेशी सम्बन्ध और आध्यात्मिक बन्धन भी सूचित।' }, icon: Moon, color: 'text-indigo-400' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <h4 className={`font-bold text-sm ${item.color}`} style={hf}>{t(item.indicator)}</h4>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{t(item.detail)}</p>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 5: Post-marriage from D9 */}
      <LessonSection number={5} title={isHi ? 'D9 नवमांश से विवाहोपरान्त भविष्यवाणी' : 'Post-Marriage Predictions from D9'}>
        <div className="space-y-4">
          {[
            { aspect: { en: 'D9 Lagna Lord Strong', hi: 'D9 लग्नेश बलवान' }, result: { en: 'Happy married life. The native adapts well to marriage. Emotional fulfillment and marital harmony.', hi: 'सुखी वैवाहिक जीवन। विवाह में अच्छा अनुकूलन। भावनात्मक सन्तुष्टि।' } },
            { aspect: { en: 'Benefics in D9 7th', hi: 'D9 सप्तम में शुभ ग्रह' }, result: { en: 'Jupiter/Venus in D9 7th = supportive, loving spouse. The marriage is a source of growth and happiness.', hi: 'D9 सप्तम में गुरु/शुक्र = सहायक, प्रेमपूर्ण जीवनसाथी। विवाह विकास और सुख का स्रोत।' } },
            { aspect: { en: 'Malefics in D9 7th', hi: 'D9 सप्तम में पाप ग्रह' }, result: { en: 'Saturn/Mars/Rahu in D9 7th = challenges in marriage. Saturn = cold spouse; Mars = argumentative; Rahu = deception or unconventional dynamics.', hi: 'शनि/मंगल/राहु = विवाह में चुनौतियां। शनि = ठंडा; मंगल = विवादी; राहु = छल या अपरम्परागत।' } },
            { aspect: { en: 'D9 7th Lord in Dusthana', hi: 'D9 सप्तमेश दुःस्थान में' }, result: { en: 'The 7th lord of D9 in 6/8/12 indicates post-marriage difficulties: health issues of spouse (6th), sudden changes (8th), or separation themes (12th).', hi: 'D9 का सप्तमेश 6/8/12 में = विवाहोपरान्त कठिनाइयां: जीवनसाथी का स्वास्थ्य (6), आकस्मिक परिवर्तन (8), विरह (12)।' } },
            { aspect: { en: 'Venus-Jupiter in D9', hi: 'D9 में शुक्र-गुरु' }, result: { en: 'Venus-Jupiter combination anywhere in D9 is one of the best indicators for a blessed marriage. Mutual respect, devotion, and abundance.', hi: 'D9 में शुक्र-गुरु का संयोग सर्वोत्तम विवाह सूचकों में से एक है। आदर, भक्ति और समृद्धि।' } },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-pink-400 mt-2" />
              <div>
                <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{t(item.aspect)}</h4>
                <p className="text-text-secondary text-sm leading-relaxed">{t(item.result)}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Cross-references */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>{isHi ? 'सम्बन्धित विषय' : 'Related Topics'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: '/kundali' as const, label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएं' } },
            { href: '/matching' as const, label: { en: 'Kundali Matching (Ashtakoot)', hi: 'कुण्डली मिलान (अष्टकूट)' } },
            { href: '/learn/planet-in-house' as const, label: { en: 'Planet in House Guide', hi: 'भाव में ग्रह मार्गदर्शिका' } },
            { href: '/learn/doshas' as const, label: { en: 'Doshas (Mangal, Kaal Sarp)', hi: 'दोष (मंगल, काल सर्प)' } },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/25 transition-colors group">
              <Zap className="w-4 h-4 text-gold-dark group-hover:text-gold-light transition-colors" />
              <span className="text-text-secondary text-sm group-hover:text-gold-light transition-colors">{t(link.label)}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
