'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, ChevronDown, Crown, Gem, Globe, GraduationCap, Hammer, Landmark, Lightbulb, Palette, Rocket, Shield, Star, TrendingUp, Users, Zap } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual labels ───────────────────────────────────────────── */
const L = {
  title: { en: 'Career Prediction Guide', hi: 'करियर भविष्यवाणी मार्गदर्शिका', sa: 'वृत्तिभविष्यवाणी-मार्गदर्शिका' },
  subtitle: {
    en: 'A systematic 5-step framework for analyzing career potential, professional direction, and timing of career milestones through the birth chart.',
    hi: 'जन्म कुण्डली से व्यावसायिक क्षमता, दिशा और करियर मील के पत्थरों के समय का विश्लेषण करने के लिए 5-चरणीय ढांचा।',
    sa: 'जन्मकुण्डल्या वृत्तिसामर्थ्यस्य दिशायाः कालनिर्णयस्य च विश्लेषणाय पञ्चचरणात्मकं ढाञ्चम्।'
  },
};

/* ── 10th house sign career data ─────────────────────────────────── */
const SIGN_CAREERS: { sign: { en: string; hi: string }; nature: { en: string; hi: string }; fields: { en: string; hi: string }; color: string }[] = [
  { sign: { en: 'Aries', hi: 'मेष' }, nature: { en: 'Entrepreneurial, pioneering', hi: 'उद्यमशील, अग्रणी' }, fields: { en: 'Startups, sports, military, surgery', hi: 'स्टार्टअप, खेल, सेना, शल्यचिकित्सा' }, color: 'text-red-400' },
  { sign: { en: 'Taurus', hi: 'वृषभ' }, nature: { en: 'Stable, luxury-oriented', hi: 'स्थिर, विलासिता-उन्मुख' }, fields: { en: 'Finance, banking, luxury goods, agriculture', hi: 'वित्त, बैंकिंग, विलासिता, कृषि' }, color: 'text-emerald-400' },
  { sign: { en: 'Gemini', hi: 'मिथुन' }, nature: { en: 'Communicative, versatile', hi: 'संवादशील, बहुमुखी' }, fields: { en: 'Media, journalism, marketing, IT', hi: 'मीडिया, पत्रकारिता, विपणन, आईटी' }, color: 'text-yellow-300' },
  { sign: { en: 'Cancer', hi: 'कर्क' }, nature: { en: 'Nurturing, public-facing', hi: 'पोषणकारी, जनसेवा' }, fields: { en: 'Hospitality, nursing, food, real estate', hi: 'आतिथ्य, नर्सिंग, खाद्य, रियल एस्टेट' }, color: 'text-blue-300' },
  { sign: { en: 'Leo', hi: 'सिंह' }, nature: { en: 'Authoritative, creative', hi: 'अधिकारी, सृजनशील' }, fields: { en: 'Entertainment, politics, leadership, government', hi: 'मनोरंजन, राजनीति, नेतृत्व, सरकार' }, color: 'text-amber-400' },
  { sign: { en: 'Virgo', hi: 'कन्या' }, nature: { en: 'Analytical, service-oriented', hi: 'विश्लेषणात्मक, सेवा-उन्मुख' }, fields: { en: 'Healthcare, accounting, editing, quality control', hi: 'स्वास्थ्य, लेखा, सम्पादन, गुणवत्ता' }, color: 'text-green-400' },
  { sign: { en: 'Libra', hi: 'तुला' }, nature: { en: 'Diplomatic, aesthetic', hi: 'कूटनीतिक, सौन्दर्यपरक' }, fields: { en: 'Law, diplomacy, fashion, art dealing', hi: 'कानून, कूटनीति, फैशन, कला' }, color: 'text-pink-300' },
  { sign: { en: 'Scorpio', hi: 'वृश्चिक' }, nature: { en: 'Investigative, transformative', hi: 'खोजी, परिवर्तनकारी' }, fields: { en: 'Research, occult, insurance, detective work', hi: 'अनुसन्धान, तान्त्रिक, बीमा, जासूसी' }, color: 'text-red-500' },
  { sign: { en: 'Sagittarius', hi: 'धनु' }, nature: { en: 'Academic, philosophical', hi: 'शैक्षिक, दार्शनिक' }, fields: { en: 'Academia, travel, publishing, religion', hi: 'शिक्षा, यात्रा, प्रकाशन, धर्म' }, color: 'text-violet-400' },
  { sign: { en: 'Capricorn', hi: 'मकर' }, nature: { en: 'Corporate, structured', hi: 'कॉर्पोरेट, संरचित' }, fields: { en: 'Government, corporate leadership, engineering', hi: 'सरकार, कॉर्पोरेट नेतृत्व, इंजीनियरिंग' }, color: 'text-slate-300' },
  { sign: { en: 'Aquarius', hi: 'कुम्भ' }, nature: { en: 'Innovative, humanitarian', hi: 'नवाचारी, मानवतावादी' }, fields: { en: 'Technology, NGO, social work, aviation', hi: 'तकनीक, एनजीओ, सामाजिक कार्य, विमानन' }, color: 'text-cyan-400' },
  { sign: { en: 'Pisces', hi: 'मीन' }, nature: { en: 'Creative, spiritual', hi: 'सृजनशील, आध्यात्मिक' }, fields: { en: 'Arts, spirituality, healing, film', hi: 'कला, आध्यात्मिकता, चिकित्सा, फिल्म' }, color: 'text-indigo-400' },
];

/* ── Planets in 10th house ───────────────────────────────────────── */
const PLANET_10TH: { planet: { en: string; hi: string }; careers: { en: string; hi: string }; icon: typeof Briefcase; color: string }[] = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, careers: { en: 'Government, administration, politics, medicine. Authority roles where one commands respect.', hi: 'सरकार, प्रशासन, राजनीति, चिकित्सा। सम्मान प्राप्त अधिकार पद।' }, icon: Crown, color: 'text-amber-400' },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, careers: { en: 'Public service, hospitality, nursing, psychology. Careers involving public contact and emotional intelligence.', hi: 'जनसेवा, आतिथ्य, नर्सिंग, मनोविज्ञान। जनसम्पर्क और भावनात्मक बुद्धि।' }, icon: Users, color: 'text-blue-300' },
  { planet: { en: 'Mars', hi: 'मंगल' }, careers: { en: 'Engineering, military, surgery, sports, police. Action-oriented fields requiring courage and physical energy.', hi: 'इंजीनियरिंग, सेना, शल्यचिकित्सा, खेल, पुलिस। साहस और शारीरिक ऊर्जा।' }, icon: Shield, color: 'text-red-400' },
  { planet: { en: 'Mercury', hi: 'बुध' }, careers: { en: 'Business, writing, accounting, IT, trading. Intellectual pursuits, communication, commerce.', hi: 'व्यापार, लेखन, लेखा, आईटी, व्यापार। बौद्धिक, संचार, वाणिज्य।' }, icon: Lightbulb, color: 'text-emerald-400' },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, careers: { en: 'Teaching, law, judiciary, priesthood, banking. Wisdom-based careers, advisory roles.', hi: 'शिक्षण, कानून, न्यायपालिका, पुरोहित, बैंकिंग। ज्ञान-आधारित।' }, icon: GraduationCap, color: 'text-yellow-400' },
  { planet: { en: 'Venus', hi: 'शुक्र' }, careers: { en: 'Arts, entertainment, luxury brands, fashion, beauty, hospitality. Aesthetic and pleasure industries.', hi: 'कला, मनोरंजन, विलासिता, फैशन, सौन्दर्य। सौन्दर्य और आनन्द उद्योग।' }, icon: Palette, color: 'text-pink-400' },
  { planet: { en: 'Saturn', hi: 'शनि' }, careers: { en: 'Manufacturing, mining, labour, judiciary, agriculture. Slow but steady rise through hard work and discipline.', hi: 'विनिर्माण, खनन, श्रम, न्यायपालिका, कृषि। कठिन परिश्रम से धीमी किन्तु स्थिर उन्नति।' }, icon: Hammer, color: 'text-slate-400' },
  { planet: { en: 'Rahu', hi: 'राहु' }, careers: { en: 'Foreign companies, technology, unconventional fields, politics, aviation, film. Innovation and breaking boundaries.', hi: 'विदेशी कम्पनी, तकनीक, अपरम्परागत, राजनीति, विमानन, फिल्म।' }, icon: Globe, color: 'text-cyan-400' },
  { planet: { en: 'Ketu', hi: 'केतु' }, careers: { en: 'Spirituality, research, programming, alternative medicine, astrology. Detached, behind-the-scenes roles.', hi: 'आध्यात्मिकता, अनुसन्धान, प्रोग्रामिंग, वैकल्पिक चिकित्सा, ज्योतिष।' }, icon: Star, color: 'text-violet-400' },
];

/* ── 10th lord placement data ────────────────────────────────────── */
const LORD_PLACEMENTS: { house: string; meaning: { en: string; hi: string } }[] = [
  { house: '1st', meaning: { en: 'Self-employed, personal brand, career tied to identity', hi: 'स्वरोजगार, व्यक्तिगत ब्रांड, पहचान से जुड़ा करियर' } },
  { house: '2nd', meaning: { en: 'Family business, banking, speech-related career', hi: 'पारिवारिक व्यवसाय, बैंकिंग, वाणी-सम्बन्धित' } },
  { house: '3rd', meaning: { en: 'Media, communication, siblings in same field', hi: 'मीडिया, संचार, भाई-बहन एक ही क्षेत्र में' } },
  { house: '4th', meaning: { en: 'Real estate, vehicles, homeland-based career', hi: 'अचल सम्पत्ति, वाहन, स्वदेश में करियर' } },
  { house: '5th', meaning: { en: 'Creative fields, education, speculation, children-related', hi: 'सृजनात्मक, शिक्षा, सट्टा, बाल-सम्बन्धित' } },
  { house: '6th', meaning: { en: 'Service sector, healthcare, legal disputes at work', hi: 'सेवा क्षेत्र, स्वास्थ्य, कार्यस्थल पर विवाद' } },
  { house: '7th', meaning: { en: 'Partnership business, spouse involved in career', hi: 'साझेदारी व्यवसाय, जीवनसाथी करियर में शामिल' } },
  { house: '8th', meaning: { en: 'Research, insurance, occult, career transformations', hi: 'अनुसन्धान, बीमा, तान्त्रिक, करियर में परिवर्तन' } },
  { house: '9th', meaning: { en: 'Teaching, father\'s profession, foreign connections', hi: 'शिक्षण, पिता का व्यवसाय, विदेशी सम्बन्ध' } },
  { house: '10th', meaning: { en: 'Very strong career, high status, own house = powerful', hi: 'बहुत मजबूत करियर, उच्च पद, स्वगृह = शक्तिशाली' } },
  { house: '11th', meaning: { en: 'Income from career excellent, networking, large organizations', hi: 'करियर से आय उत्कृष्ट, नेटवर्किंग, बड़े संगठन' } },
  { house: '12th', meaning: { en: 'Foreign career, MNC, spiritual vocation, hospital work', hi: 'विदेशी करियर, बहुराष्ट्रीय, आध्यात्मिक व्यवसाय, अस्पताल' } },
];

/* ── SVG House Wheel with 10th house highlighted ─────────────────── */
function CareerHouseWheel() {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const r = 110;
  return (
    <svg viewBox="-150 -150 300 300" className="w-full max-w-[320px] mx-auto">
      <defs>
        <radialGradient id="cw-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
        <filter id="cw-blur"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      {/* background glow */}
      <circle cx="0" cy="0" r="140" fill="url(#cw-glow)" />
      {/* house segments */}
      {houses.map((h) => {
        const a1 = ((h - 1) * 30 - 90) * (Math.PI / 180);
        const a2 = (h * 30 - 90) * (Math.PI / 180);
        const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
        const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
        const mid = ((h - 0.5) * 30 - 90) * (Math.PI / 180);
        const tx = Math.cos(mid) * (r * 0.7), ty = Math.sin(mid) * (r * 0.7);
        const is10 = h === 10;
        return (
          <g key={h}>
            <path
              d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
              fill={is10 ? 'rgba(212,168,83,0.2)' : 'rgba(255,255,255,0.03)'}
              stroke={is10 ? '#d4a853' : 'rgba(212,168,83,0.15)'}
              strokeWidth={is10 ? 2 : 0.5}
            />
            {is10 && <path d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill="rgba(212,168,83,0.08)" filter="url(#cw-blur)" />}
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
              className={`${is10 ? 'fill-gold-light font-bold' : 'fill-text-tertiary'}`}
              fontSize={is10 ? 14 : 10}>{h}</text>
          </g>
        );
      })}
      {/* D10 overlay label */}
      <rect x="-30" y="-140" width="60" height="22" rx="6" fill="rgba(212,168,83,0.15)" stroke="#d4a853" strokeWidth="1" />
      <text x="0" y="-125" textAnchor="middle" className="fill-gold-light" fontSize="10" fontWeight="bold">D10</text>
      {/* center */}
      <circle cx="0" cy="0" r="18" fill="rgba(10,14,39,0.8)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
      <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" className="fill-gold-light" fontSize="8" fontWeight="bold">10H</text>
    </svg>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function CareerPredictionGuide() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const t = (obj: { en: string; hi: string; sa?: string }) => isHi ? (locale === 'sa' && obj.sa ? obj.sa : obj.hi) : obj.en;
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedPlanet, setExpandedPlanet] = useState<number | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium mb-4">
          <Briefcase className="w-3.5 h-3.5" />
          {isHi ? 'व्यावहारिक मार्गदर्शिका' : 'Practical Guide'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t(L.title)}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t(L.subtitle)}</p>
      </motion.div>

      {/* SVG Wheel */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/15 flex flex-col items-center">
          <CareerHouseWheel />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {isHi ? 'दशम भाव (10H) करियर और सामाजिक स्थिति का प्रमुख भाव। D10 दशमांश विभाजन चार्ट।' : 'The 10th house (10H) is the primary house of career and public status. D10 = Dasamsha divisional chart.'}
          </p>
        </div>
      </motion.div>

      {/* Section 1: 5-Step Career Analysis */}
      <LessonSection number={1} title={isHi ? 'करियर विश्लेषण के 5 चरण' : 'The 5-Step Career Analysis'} variant="highlight">
        <div className="space-y-6">
          {[
            { step: 1, title: { en: '10th House Sign', hi: 'दशम भाव राशि' }, desc: { en: 'The sign on the 10th house cusp determines the fundamental NATURE of your career. It sets the tone, environment, and style of your professional life.', hi: 'दशम भाव शीर्ष पर राशि आपके करियर की मूलभूत प्रकृति निर्धारित करती है। यह आपके व्यावसायिक जीवन का स्वर, वातावरण और शैली तय करती है।' }, icon: Building2, color: 'text-amber-400' },
            { step: 2, title: { en: '10th Lord Placement', hi: 'दशमेश की स्थिति' }, desc: { en: 'Where the 10th lord sits shows WHERE your career energy flows. The house placement channels your professional drive into specific life areas.', hi: 'दशमेश जहां बैठता है वह दर्शाता है कि करियर ऊर्जा कहां प्रवाहित होती है।' }, icon: TrendingUp, color: 'text-emerald-400' },
            { step: 3, title: { en: 'Planets IN 10th House', hi: 'दशम भाव में ग्रह' }, desc: { en: 'Any planet sitting in the 10th house directly colors your professional life with its nature and significations.', hi: 'दशम भाव में बैठा कोई भी ग्रह अपनी प्रकृति और सूचनाओं से व्यावसायिक जीवन को रंगता है।' }, icon: Star, color: 'text-violet-400' },
            { step: 4, title: { en: 'D10 Dasamsha Chart', hi: 'D10 दशमांश कुण्डली' }, desc: { en: 'The D10 divisional chart provides microscopic career detail. Each D10 house reveals a specific professional dimension. The 10th house OF the D10 is the "career within career."', hi: 'D10 विभाजन कुण्डली सूक्ष्म करियर विवरण देती है। D10 का दशम भाव "करियर के भीतर करियर" है।' }, icon: Gem, color: 'text-cyan-400' },
            { step: 5, title: { en: 'Amatyakaraka', hi: 'अमात्यकारक' }, desc: { en: 'In Jaimini astrology, the planet with the 2nd highest degree becomes the Amatyakaraka — the career significator. Its sign, house, and nakshatra reveal your professional calling.', hi: 'जैमिनी ज्योतिष में दूसरी सबसे ऊंची अंश वाला ग्रह अमात्यकारक बनता है — करियर सूचक।' }, icon: Rocket, color: 'text-gold-light' },
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
                    <h3 className="text-gold-light font-bold text-base" style={hf}>{t(s.title)}</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{t(s.desc)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section: 10th House Sign Career Table */}
      <LessonSection number={2} title={isHi ? 'दशम भाव राशि अनुसार करियर' : 'Career by 10th House Sign'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi ? 'आपकी दशम भाव की राशि आपके व्यवसाय का मूल स्वभाव निर्धारित करती है:' : 'Your 10th house sign sets the fundamental tone of your professional life:'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SIGN_CAREERS.map((s, i) => (
            <div key={i} className="p-3 rounded-xl bg-bg-secondary/40 border border-gold-primary/8 hover:border-gold-primary/20 transition-colors">
              <div className={`font-bold text-sm mb-1 ${s.color}`} style={hf}>{t(s.sign)}</div>
              <div className="text-text-secondary text-xs mb-1">{t(s.nature)}</div>
              <div className="text-text-tertiary text-[11px]">{t(s.fields)}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section: Planets in 10th House */}
      <LessonSection number={3} title={isHi ? 'दशम भाव में ग्रह — करियर निर्देशक' : 'Planets in the 10th House — Career Indicators'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi ? 'दशम भाव में बैठा ग्रह सीधे व्यावसायिक क्षेत्र को परिभाषित करता है:' : 'A planet occupying the 10th house directly defines the professional domain:'}
        </p>
        <div className="space-y-2">
          {PLANET_10TH.map((p, i) => {
            const Icon = p.icon;
            const isOpen = expandedPlanet === i;
            return (
              <div key={i} className="rounded-xl border border-gold-primary/10 overflow-hidden">
                <button onClick={() => setExpandedPlanet(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${p.color}`} />
                    <span className="text-gold-light font-bold text-sm" style={hf}>{t(p.planet)}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1">
                        <p className="text-text-secondary text-sm leading-relaxed">{t(p.careers)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section: 10th Lord Placement */}
      <LessonSection number={4} title={isHi ? 'दशमेश की भाव स्थिति' : '10th Lord Placement by House'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi ? 'दशमेश जिस भाव में बैठता है, वहां करियर ऊर्जा केन्द्रित होती है:' : 'The house where the 10th lord sits channels career energy into that life area:'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {LORD_PLACEMENTS.map((lp) => (
            <div key={lp.house} className="p-3 rounded-lg bg-bg-secondary/40 border border-gold-primary/8">
              <span className="text-gold-light font-bold text-xs">{isHi ? `${lp.house} भाव` : `${lp.house} House`}</span>
              <p className="text-text-secondary text-[11px] mt-1 leading-relaxed">{t(lp.meaning)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section: Timing Career Events */}
      <LessonSection number={5} title={isHi ? 'करियर घटनाओं का समय निर्धारण' : 'Timing Career Events'} variant="highlight">
        <div className="space-y-4">
          {[
            { trigger: { en: '10th Lord Mahadasha/Antardasha', hi: 'दशमेश महादशा/अन्तर्दशा' }, effect: { en: 'Primary career activation period. Promotions, new roles, professional recognition. The sub-period of the 10th lord within another major period also activates career.', hi: 'प्राथमिक करियर सक्रियता काल। पदोन्नति, नई भूमिकाएं, व्यावसायिक मान्यता।' }, color: 'bg-amber-500/10 border-amber-500/20' },
            { trigger: { en: 'Saturn Transit over 10th House', hi: 'शनि का दशम भाव पर गोचर' }, effect: { en: 'Saturn transiting the 10th house (2.5 years) restructures career. May bring heavy workload, then consolidation. Saturn rewards effort here.', hi: 'शनि का दशम भाव में गोचर (2.5 वर्ष) करियर का पुनर्गठन करता है। भारी कार्यभार, फिर स्थिरता।' }, color: 'bg-slate-500/10 border-slate-500/20' },
            { trigger: { en: 'Jupiter Transit in 2/6/10/11 from Moon', hi: 'चन्द्र से 2/6/10/11 में गुरु गोचर' }, effect: { en: 'Jupiter in these houses from Moon sign expands professional opportunities. 10th from Moon is especially powerful for career growth.', hi: 'चन्द्र से इन भावों में गुरु व्यावसायिक अवसर बढ़ाता है। चन्द्र से 10वां विशेष शक्तिशाली।' }, color: 'bg-yellow-500/10 border-yellow-500/20' },
            { trigger: { en: 'Double Transit (Jupiter + Saturn)', hi: 'दोहरा गोचर (गुरु + शनि)' }, effect: { en: 'When BOTH Jupiter and Saturn simultaneously aspect the 10th house or 10th lord — this creates the most significant career events: major promotions, new ventures, career peaks.', hi: 'जब गुरु और शनि दोनों एक साथ दशम भाव या दशमेश पर दृष्टि डालें — यह सबसे महत्वपूर्ण करियर घटनाएं बनाता है।' }, color: 'bg-gold-primary/10 border-gold-primary/20' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t(item.trigger)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{t(item.effect)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section: Career Change Indicators */}
      <LessonSection number={6} title={isHi ? 'करियर परिवर्तन सूचक' : 'Career Change Indicators'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { indicator: { en: 'Rahu in 10th House', hi: 'राहु दशम भाव में' }, meaning: { en: 'Unconventional career, foreign employer, obsessive ambition, sudden rise through innovation. May change career entirely at Rahu dasha.', hi: 'अपरम्परागत करियर, विदेशी नियोक्ता, जुनूनी महत्वाकांक्षा। राहु दशा में पूर्ण करियर परिवर्तन सम्भव।' }, color: 'text-cyan-400' },
            { indicator: { en: 'Saturn-Jupiter in 10th', hi: 'शनि-गुरु दशम में' }, meaning: { en: 'Major career restructuring when these two conjoin in 10th. Old structures dissolve, new professional identity forms.', hi: 'दशम में इन दो ग्रहों की युति पर बड़ा करियर पुनर्गठन। पुरानी संरचनाएं विलीन, नई पहचान।' }, color: 'text-violet-400' },
            { indicator: { en: '10th Lord Retrograde', hi: 'दशमेश वक्री' }, meaning: { en: 'Career rethinking, delayed recognition that comes eventually. May revisit old career paths. Internalized professional growth.', hi: 'करियर पुनर्विचार, विलम्बित मान्यता जो अन्ततः आती है। पुराने मार्गों पर पुनर्विचार।' }, color: 'text-amber-400' },
            { indicator: { en: 'Ketu in 10th House', hi: 'केतु दशम भाव में' }, meaning: { en: 'Detachment from worldly ambition, spiritual or research-oriented career. May feel undervalued despite skills. Past-life career patterns repeat.', hi: 'सांसारिक महत्वाकांक्षा से विरक्ति, आध्यात्मिक या अनुसन्धान करियर। कौशल के बावजूद कम मूल्यांकित।' }, color: 'text-indigo-400' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-secondary/40 border border-gold-primary/10">
              <h4 className={`font-bold text-sm mb-2 ${item.color}`} style={hf}>{t(item.indicator)}</h4>
              <p className="text-text-secondary text-xs leading-relaxed">{t(item.meaning)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Cross-references */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/15">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>{isHi ? 'सम्बन्धित विषय' : 'Related Topics'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: '/kundali' as const, label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएं' } },
            { href: '/learn/planet-in-house' as const, label: { en: 'Planet in House Guide', hi: 'भाव में ग्रह मार्गदर्शिका' } },
            { href: '/learn/planets' as const, label: { en: 'Planet Significations', hi: 'ग्रह सूचनाएं' } },
            { href: '/learn/dashas' as const, label: { en: 'Dasha System', hi: 'दशा प्रणाली' } },
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
