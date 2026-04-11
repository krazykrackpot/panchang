'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronDown, Heart, Hospital, ShieldAlert, Stethoscope, Thermometer, Leaf } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual labels ───────────────────────────────────────────── */
const L = {
  title: { en: 'Health & Medical Astrology', hi: 'स्वास्थ्य एवं चिकित्सा ज्योतिष', sa: 'आरोग्यं चिकित्साज्योतिषं च' },
  subtitle: {
    en: 'The ancient science of diagnosing health vulnerabilities, timing medical events, and understanding constitution through the birth chart.',
    hi: 'जन्म कुण्डली से स्वास्थ्य कमजोरियों, चिकित्सा घटनाओं के समय और शारीरिक प्रकृति को समझने का प्राचीन विज्ञान।',
    sa: 'जन्मकुण्डल्या आरोग्यदौर्बल्यानां चिकित्साकालनिर्णयस्य शारीरिकप्रकृतेश्च ज्ञानार्थं प्राचीनं शास्त्रम्।'
  },
};

/* ── Zodiac body map data ────────────────────────────────────────── */
const BODY_ZONES: { sign: { en: string; hi: string }; parts: { en: string; hi: string }; color: string; y: number; h: number }[] = [
  { sign: { en: 'Aries', hi: 'मेष' }, parts: { en: 'Head, Face, Brain', hi: 'सिर, चेहरा, मस्तिष्क' }, color: '#ef4444', y: 0, h: 42 },
  { sign: { en: 'Taurus', hi: 'वृषभ' }, parts: { en: 'Throat, Neck, Thyroid', hi: 'गला, गर्दन, थायरॉइड' }, color: '#22c55e', y: 42, h: 32 },
  { sign: { en: 'Gemini', hi: 'मिथुन' }, parts: { en: 'Arms, Shoulders, Lungs', hi: 'भुजाएं, कन्धे, फेफड़े' }, color: '#eab308', y: 74, h: 40 },
  { sign: { en: 'Cancer', hi: 'कर्क' }, parts: { en: 'Chest, Stomach, Breasts', hi: 'छाती, पेट, स्तन' }, color: '#94a3b8', y: 114, h: 38 },
  { sign: { en: 'Leo', hi: 'सिंह' }, parts: { en: 'Heart, Spine, Upper Back', hi: 'हृदय, रीढ़, पीठ' }, color: '#d4a853', y: 152, h: 36 },
  { sign: { en: 'Virgo', hi: 'कन्या' }, parts: { en: 'Intestines, Digestive System', hi: 'आंतें, पाचन तन्त्र' }, color: '#4ade80', y: 188, h: 34 },
  { sign: { en: 'Libra', hi: 'तुला' }, parts: { en: 'Kidneys, Lower Back', hi: 'गुर्दे, कमर' }, color: '#f472b6', y: 222, h: 32 },
  { sign: { en: 'Scorpio', hi: 'वृश्चिक' }, parts: { en: 'Reproductive, Elimination', hi: 'प्रजनन, उत्सर्जन' }, color: '#b91c1c', y: 254, h: 34 },
  { sign: { en: 'Sagittarius', hi: 'धनु' }, parts: { en: 'Thighs, Liver, Hips', hi: 'जांघें, यकृत, कूल्हे' }, color: '#a855f7', y: 288, h: 38 },
  { sign: { en: 'Capricorn', hi: 'मकर' }, parts: { en: 'Knees, Bones, Joints', hi: 'घुटने, हड्डियां, जोड़' }, color: '#78716c', y: 326, h: 34 },
  { sign: { en: 'Aquarius', hi: 'कुम्भ' }, parts: { en: 'Calves, Circulation, Ankles', hi: 'पिण्डलियां, रक्त संचार, टखने' }, color: '#3b82f6', y: 360, h: 36 },
  { sign: { en: 'Pisces', hi: 'मीन' }, parts: { en: 'Feet, Lymphatic System', hi: 'पैर, लसीका तन्त्र' }, color: '#2dd4bf', y: 396, h: 34 },
];

/* ── Planet disease table ────────────────────────────────────────── */
const PLANET_HEALTH: { planet: { en: string; hi: string }; parts: { en: string; hi: string }; diseases: { en: string; hi: string }; color: string }[] = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, parts: { en: 'Heart, eyes, bones, vitality', hi: 'हृदय, नेत्र, अस्थि, जीवनशक्ति' }, diseases: { en: 'Heart disease, eye problems, low vitality, high fever', hi: 'हृदय रोग, नेत्र रोग, जीवनशक्ति क्षीण, तीव्र ज्वर' }, color: 'text-amber-400' },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, parts: { en: 'Mind, blood, fluids, breasts', hi: 'मन, रक्त, तरल, स्तन' }, diseases: { en: 'Depression, anxiety, water retention, hormonal imbalance', hi: 'अवसाद, चिन्ता, जलधारण, हार्मोनल असन्तुलन' }, color: 'text-blue-300' },
  { planet: { en: 'Mars', hi: 'मंगल' }, parts: { en: 'Blood, muscles, head, bile', hi: 'रक्त, मांसपेशियां, सिर, पित्त' }, diseases: { en: 'Accidents, surgery, fever, inflammation, burns', hi: 'दुर्घटना, शल्यक्रिया, ज्वर, सूजन, जलन' }, color: 'text-red-400' },
  { planet: { en: 'Mercury', hi: 'बुध' }, parts: { en: 'Skin, nervous system, speech', hi: 'त्वचा, तन्त्रिका तन्त्र, वाणी' }, diseases: { en: 'Skin diseases, nerve disorders, stammering, allergies', hi: 'त्वचा रोग, तन्त्रिका विकार, हकलाहट, एलर्जी' }, color: 'text-emerald-400' },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, parts: { en: 'Liver, fat, ears, wisdom', hi: 'यकृत, वसा, कान, बुद्धि' }, diseases: { en: 'Diabetes, obesity, liver issues, tumors', hi: 'मधुमेह, मोटापा, यकृत रोग, अर्बुद' }, color: 'text-yellow-400' },
  { planet: { en: 'Venus', hi: 'शुक्र' }, parts: { en: 'Kidneys, reproductive, face', hi: 'गुर्दे, प्रजनन, मुख' }, diseases: { en: 'Kidney stones, STDs, diabetes, skin conditions', hi: 'गुर्दे की पथरी, यौन रोग, मधुमेह, त्वचा रोग' }, color: 'text-pink-400' },
  { planet: { en: 'Saturn', hi: 'शनि' }, parts: { en: 'Bones, joints, teeth, chronic', hi: 'हड्डी, जोड़, दन्त, दीर्घकालिक' }, diseases: { en: 'Arthritis, chronic pain, paralysis, depression', hi: 'गठिया, दीर्घकालिक दर्द, पक्षाघात, अवसाद' }, color: 'text-slate-400' },
  { planet: { en: 'Rahu', hi: 'राहु' }, parts: { en: 'Poisons, mysterious ailments', hi: 'विष, रहस्यमय रोग' }, diseases: { en: 'Phobias, unexplained illness, toxicity, addictions', hi: 'भय, अज्ञात रोग, विषाक्तता, व्यसन' }, color: 'text-cyan-400' },
  { planet: { en: 'Ketu', hi: 'केतु' }, parts: { en: 'Infections, viral, spiritual', hi: 'संक्रमण, विषाणु, आध्यात्मिक' }, diseases: { en: 'Fever of unknown origin, autoimmune, surgery complications', hi: 'अज्ञात ज्वर, स्वप्रतिरक्षी, शल्यक्रिया जटिलता' }, color: 'text-violet-400' },
];

/* ── Health per Lagna sign ───────────────────────────────────────── */
const LAGNA_HEALTH: { sign: { en: string; hi: string }; constitution: { en: string; hi: string }; vulnerability: { en: string; hi: string }; color: string }[] = [
  { sign: { en: 'Aries', hi: 'मेष' }, constitution: { en: 'Strong vitality, athletic build, fast metabolism', hi: 'सशक्त जीवनशक्ति, एथलेटिक काया, तीव्र चयापचय' }, vulnerability: { en: 'Head injuries, migraines, fever, inflammation', hi: 'सिर की चोट, माइग्रेन, ज्वर, सूजन' }, color: 'text-red-400' },
  { sign: { en: 'Taurus', hi: 'वृषभ' }, constitution: { en: 'Sturdy, enduring, tends toward weight gain', hi: 'मजबूत, सहनशील, वजन बढ़ने की प्रवृत्ति' }, vulnerability: { en: 'Throat infections, thyroid, tonsils, neck pain', hi: 'गले का संक्रमण, थायरॉइड, टॉन्सिल, गर्दन दर्द' }, color: 'text-emerald-400' },
  { sign: { en: 'Gemini', hi: 'मिथुन' }, constitution: { en: 'Nervous energy, lean, restless', hi: 'तन्त्रिका ऊर्जा, दुबला, बेचैन' }, vulnerability: { en: 'Respiratory issues, shoulder pain, anxiety', hi: 'श्वसन रोग, कन्धे का दर्द, चिन्ता' }, color: 'text-yellow-300' },
  { sign: { en: 'Cancer', hi: 'कर्क' }, constitution: { en: 'Sensitive digestion, emotional health linked', hi: 'संवेदनशील पाचन, भावनात्मक स्वास्थ्य' }, vulnerability: { en: 'Stomach ulcers, water retention, chest congestion', hi: 'पेट के अल्सर, जलधारण, छाती में जमाव' }, color: 'text-blue-300' },
  { sign: { en: 'Leo', hi: 'सिंह' }, constitution: { en: 'Strong heart, warm constitution, robust', hi: 'सशक्त हृदय, उष्ण प्रकृति, बलशाली' }, vulnerability: { en: 'Heart conditions, spinal issues, high BP', hi: 'हृदय रोग, रीढ़ की समस्या, उच्च रक्तचाप' }, color: 'text-amber-400' },
  { sign: { en: 'Virgo', hi: 'कन्या' }, constitution: { en: 'Health-conscious, prone to worry about health', hi: 'स्वास्थ्य सजग, स्वास्थ्य चिन्ता प्रवण' }, vulnerability: { en: 'Digestive disorders, IBS, food sensitivities', hi: 'पाचन विकार, आईबीएस, खाद्य संवेदनशीलता' }, color: 'text-green-400' },
  { sign: { en: 'Libra', hi: 'तुला' }, constitution: { en: 'Balanced but delicate, beauty-focused', hi: 'सन्तुलित परन्तु कोमल, सौन्दर्य-केन्द्रित' }, vulnerability: { en: 'Kidney issues, lower back, skin conditions', hi: 'गुर्दे की समस्या, कमर दर्द, त्वचा रोग' }, color: 'text-pink-300' },
  { sign: { en: 'Scorpio', hi: 'वृश्चिक' }, constitution: { en: 'Intense recovery power, high endurance', hi: 'तीव्र पुनर्प्राप्ति शक्ति, उच्च सहनशक्ति' }, vulnerability: { en: 'Reproductive issues, piles, hidden chronic conditions', hi: 'प्रजनन रोग, बवासीर, छिपी दीर्घकालिक स्थिति' }, color: 'text-red-500' },
  { sign: { en: 'Sagittarius', hi: 'धनु' }, constitution: { en: 'Active, sporty, optimistic outlook aids healing', hi: 'सक्रिय, खिलाड़ी, आशावादी दृष्टिकोण' }, vulnerability: { en: 'Liver problems, hip/thigh injuries, sciatica', hi: 'यकृत रोग, कूल्हे/जांघ चोट, साइटिका' }, color: 'text-violet-400' },
  { sign: { en: 'Capricorn', hi: 'मकर' }, constitution: { en: 'Improves with age, slow but steady vitality', hi: 'उम्र के साथ सुधार, धीमी परन्तु स्थिर जीवनशक्ति' }, vulnerability: { en: 'Joint pain, arthritis, knee problems, dental issues', hi: 'जोड़ दर्द, गठिया, घुटने, दन्त समस्या' }, color: 'text-slate-300' },
  { sign: { en: 'Aquarius', hi: 'कुम्भ' }, constitution: { en: 'Unusual health patterns, erratic energy', hi: 'असामान्य स्वास्थ्य पैटर्न, अनियमित ऊर्जा' }, vulnerability: { en: 'Circulatory issues, varicose veins, ankle injuries', hi: 'रक्तसंचार रोग, वैरिकोज़ वेन्स, टखने की चोट' }, color: 'text-cyan-400' },
  { sign: { en: 'Pisces', hi: 'मीन' }, constitution: { en: 'Sensitive, absorbs environment, needs rest', hi: 'संवेदनशील, वातावरण अवशोषक, विश्राम आवश्यक' }, vulnerability: { en: 'Foot problems, immune weakness, fluid imbalance', hi: 'पैर की समस्या, प्रतिरक्षा दुर्बलता, तरल असन्तुलन' }, color: 'text-indigo-400' },
];

/* ── Ayurvedic constitution data ─────────────────────────────────── */
const DOSHAS: { dosha: { en: string; hi: string }; elements: { en: string; hi: string }; signs: { en: string; hi: string }; traits: { en: string; hi: string }; color: string }[] = [
  { dosha: { en: 'Pitta', hi: 'पित्त' }, elements: { en: 'Fire signs dominant', hi: 'अग्नि राशि प्रबल' }, signs: { en: 'Aries, Leo, Sagittarius', hi: 'मेष, सिंह, धनु' }, traits: { en: 'Heat, inflammation, sharp digestion, anger, acidity, skin rashes', hi: 'उष्णता, सूजन, तीव्र पाचन, क्रोध, अम्लता, त्वचा रोग' }, color: 'from-red-500/20 to-amber-500/20' },
  { dosha: { en: 'Kapha', hi: 'कफ' }, elements: { en: 'Earth signs dominant', hi: 'पृथ्वी राशि प्रबल' }, signs: { en: 'Taurus, Virgo, Capricorn', hi: 'वृषभ, कन्या, मकर' }, traits: { en: 'Sluggish metabolism, weight gain, congestion, loyalty, stability', hi: 'मन्द चयापचय, वजन वृद्धि, जमाव, निष्ठा, स्थिरता' }, color: 'from-green-500/20 to-emerald-500/20' },
  { dosha: { en: 'Vata', hi: 'वात' }, elements: { en: 'Air signs dominant', hi: 'वायु राशि प्रबल' }, signs: { en: 'Gemini, Libra, Aquarius', hi: 'मिथुन, तुला, कुम्भ' }, traits: { en: 'Nervous energy, dryness, anxiety, joint pain, gas, insomnia', hi: 'तन्त्रिका ऊर्जा, शुष्कता, चिन्ता, जोड़ दर्द, वायु, अनिद्रा' }, color: 'from-blue-500/20 to-cyan-500/20' },
  { dosha: { en: 'Kapha-Pitta', hi: 'कफ-पित्त' }, elements: { en: 'Water signs dominant', hi: 'जल राशि प्रबल' }, signs: { en: 'Cancer, Scorpio, Pisces', hi: 'कर्क, वृश्चिक, मीन' }, traits: { en: 'Emotional, fluid retention, oedema, hormonal sensitivity', hi: 'भावनात्मक, जलधारण, शोथ, हार्मोनल संवेदनशीलता' }, color: 'from-indigo-500/20 to-purple-500/20' },
];

/* ── SVG Body Map Component ──────────────────────────────────────── */
function ZodiacBodyMap({ t }: { t: (o: { en: string; hi: string }) => string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      <svg viewBox="0 0 680 460" className="w-full">
        <defs>
          <filter id="hb-glow"><feGaussianBlur stdDeviation="6" /><feComposite in="SourceGraphic" /></filter>
          <linearGradient id="hb-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a853" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#d4a853" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Body silhouette outline */}
        <ellipse cx="340" cy="24" rx="32" ry="24" fill="none" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />
        <line x1="340" y1="48" x2="340" y2="260" stroke="rgba(212,168,83,0.15)" strokeWidth="1.5" />
        <line x1="340" y1="90" x2="270" y2="160" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />
        <line x1="340" y1="90" x2="410" y2="160" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />
        <line x1="340" y1="260" x2="300" y2="420" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />
        <line x1="340" y1="260" x2="380" y2="420" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />
        {/* Zone stripes */}
        {BODY_ZONES.map((z, i) => {
          const isActive = hovered === i;
          const barY = z.y + 4;
          const barH = z.h - 4;
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Left label band */}
              <rect x="0" y={barY} width="200" height={barH} rx="6"
                fill={isActive ? z.color : 'transparent'}
                fillOpacity={isActive ? 0.15 : 0}
                stroke={z.color} strokeWidth={isActive ? 1.5 : 0.5} strokeOpacity={isActive ? 0.8 : 0.25}
              />
              <text x="10" y={barY + barH / 2} dominantBaseline="middle"
                fill={z.color} fontSize="11" fontWeight="bold" opacity={isActive ? 1 : 0.7}>
                {t(z.sign)}
              </text>
              <text x="196" y={barY + barH / 2} dominantBaseline="middle" textAnchor="end"
                fill="rgba(255,255,255,0.5)" fontSize="9" opacity={isActive ? 1 : 0.5}>
                {t(z.parts)}
              </text>
              {/* Connector to center body */}
              <line x1="200" y1={barY + barH / 2} x2="310" y2={barY + barH / 2}
                stroke={z.color} strokeWidth={isActive ? 1 : 0.3} strokeOpacity={isActive ? 0.6 : 0.15}
                strokeDasharray={isActive ? '0' : '4 4'}
              />
              {/* Center body zone indicator */}
              <rect x="310" y={barY + 2} width="60" height={barH - 4} rx="4"
                fill={z.color} fillOpacity={isActive ? 0.25 : 0.06}
                stroke={z.color} strokeWidth={isActive ? 1 : 0} strokeOpacity={0.5}
              />
              {/* Right connector */}
              <line x1="370" y1={barY + barH / 2} x2="480" y2={barY + barH / 2}
                stroke={z.color} strokeWidth={isActive ? 1 : 0.3} strokeOpacity={isActive ? 0.6 : 0.15}
                strokeDasharray={isActive ? '0' : '4 4'}
              />
              {/* Right rashi number */}
              <circle cx="500" cy={barY + barH / 2} r="12"
                fill={isActive ? z.color : 'transparent'} fillOpacity={isActive ? 0.2 : 0}
                stroke={z.color} strokeWidth={isActive ? 1.5 : 0.5} strokeOpacity={isActive ? 0.8 : 0.3}
              />
              <text x="500" y={barY + barH / 2} textAnchor="middle" dominantBaseline="middle"
                fill={z.color} fontSize="10" fontWeight="bold" opacity={isActive ? 1 : 0.6}>
                {i + 1}
              </text>
            </g>
          );
        })}
        {/* Title */}
        <text x="340" y="452" textAnchor="middle" fill="rgba(212,168,83,0.5)" fontSize="10" fontStyle="italic">
          Zodiac Man (Melothesia) — Hover to explore
        </text>
      </svg>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function HealthAstrologyPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const t = (obj: { en: string; hi: string; sa?: string }) => isHi ? (locale === 'sa' && obj.sa ? obj.sa : obj.hi) : obj.en;
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedLagna, setExpandedLagna] = useState<number | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium mb-4">
          <Stethoscope className="w-3.5 h-3.5" />
          {isHi ? 'चिकित्सा ज्योतिष' : 'Medical Astrology'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t(L.title)}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t(L.subtitle)}</p>
      </motion.div>

      {/* SVG Body Map */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <ZodiacBodyMap t={t} />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {isHi
              ? 'प्रत्येक राशि शरीर के एक भाग को नियन्त्रित करती है। यह "ज्योतिष पुरुष" (मेलोथेसिया) प्राचीन मानचित्रण है।'
              : 'Each zodiac sign governs a specific body region. This "Zodiac Man" (Melothesia) mapping dates back to Hellenistic and Vedic traditions.'}
          </p>
        </div>
      </motion.div>

      {/* Section 1: Medical Astrology Basics */}
      <LessonSection number={1} title={isHi ? 'चिकित्सा ज्योतिष के मूल सिद्धान्त' : 'Medical Astrology Basics'} variant="highlight">
        <div className="space-y-4">
          {[
            { house: '1st', icon: Heart, label: { en: '1st House — Constitution & Vitality', hi: 'प्रथम भाव — शारीरिक संरचना एवं जीवनशक्ति' }, desc: { en: 'The ascendant and its lord determine your overall physical constitution, natural vitality, and resistance to disease. A strong lagna lord = strong immune system.', hi: 'लग्न और लग्नेश आपकी समग्र शारीरिक संरचना, प्राकृतिक जीवनशक्ति और रोग प्रतिरोधक क्षमता निर्धारित करते हैं।' }, color: 'text-emerald-400' },
            { house: '6th', icon: ShieldAlert, label: { en: '6th House — Disease & Acute Illness', hi: 'षष्ठ भाव — रोग एवं तीव्र बीमारी' }, desc: { en: 'The house of enemies includes disease as an enemy. The 6th lord, planets here, and aspects show the TYPE of disease you are prone to. Strong 6th = ability to overcome.', hi: 'शत्रु भाव में रोग भी शत्रु है। षष्ठेश, यहां ग्रह और दृष्टि रोग प्रकार दर्शाते हैं। शक्तिशाली छठा = रोग पर विजय।' }, color: 'text-amber-400' },
            { house: '8th', icon: Thermometer, label: { en: '8th House — Chronic, Surgery, Emergencies', hi: 'अष्टम भाव — दीर्घकालिक, शल्यक्रिया, आपातकाल' }, desc: { en: 'Chronic conditions, surgical interventions, life-threatening situations. The 8th house shows longevity quality. Afflicted 8th = sudden health crises.', hi: 'दीर्घकालिक स्थिति, शल्यचिकित्सा, जीवन-संकट। अष्टम भाव आयु गुणवत्ता दर्शाता है। पीड़ित अष्टम = अचानक स्वास्थ्य संकट।' }, color: 'text-red-400' },
            { house: '12th', icon: Hospital, label: { en: '12th House — Hospitalization & Recovery', hi: 'द्वादश भाव — अस्पताल एवं स्वास्थ्य लाभ' }, desc: { en: 'Long hospital stays, bed-ridden periods, expenses on treatment. A strong 12th with benefics = good recovery in isolation. Malefics = prolonged suffering.', hi: 'लम्बे अस्पताल प्रवास, शय्याग्रस्त अवधि, उपचार व्यय। शुभ ग्रहों सहित शक्तिशाली द्वादश = एकान्त में अच्छा स्वास्थ्य लाभ।' }, color: 'text-violet-400' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.house} className="flex gap-4 items-start p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-gold-light font-bold text-sm mb-1" style={hf}>{t(item.label)}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{t(item.desc)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 2: Planet-Body Part Table */}
      <LessonSection number={2} title={isHi ? 'ग्रह-शरीर भाग सारणी' : 'Planet-Body Part Table'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi
            ? 'प्रत्येक ग्रह विशिष्ट अंगों और तन्त्रों का कारक है। पीड़ित होने पर सम्बन्धित रोग उत्पन्न होते हैं:'
            : 'Each planet governs specific organs and systems. When afflicted (conjunct malefics, debilitated, combust), related diseases manifest:'}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{isHi ? 'शरीर भाग' : 'Body Parts'}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{isHi ? 'पीड़ित होने पर रोग' : 'Diseases When Afflicted'}</th>
              </tr>
            </thead>
            <tbody>
              {PLANET_HEALTH.map((p, i) => (
                <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className={`py-2.5 px-3 font-bold ${p.color}`} style={hf}>{t(p.planet)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs">{t(p.parts)}</td>
                  <td className="py-2.5 px-3 text-text-tertiary text-xs">{t(p.diseases)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 3: Health Per Lagna Sign */}
      <LessonSection number={3} title={isHi ? 'लग्न अनुसार स्वास्थ्य प्रवृत्ति' : 'Health Per Lagna (Rising Sign)'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi ? 'आपकी लग्न राशि आपकी शारीरिक प्रकृति और कमजोरियां निर्धारित करती है:' : 'Your rising sign determines your physical constitution and inherent health vulnerabilities:'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LAGNA_HEALTH.map((l, i) => {
            const isOpen = expandedLagna === i;
            return (
              <motion.div key={i} layout className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 overflow-hidden">
                <button onClick={() => setExpandedLagna(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-3 text-left">
                  <span className={`font-bold text-sm ${l.color}`} style={hf}>{t(l.sign)}</span>
                  <ChevronDown className={`w-4 h-4 text-gold-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-3 pb-3 space-y-1.5">
                        <div>
                          <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{isHi ? 'प्रकृति' : 'Constitution'}</span>
                          <p className="text-text-secondary text-xs">{t(l.constitution)}</p>
                        </div>
                        <div>
                          <span className="text-red-400/80 text-xs uppercase tracking-wider font-bold">{isHi ? 'कमजोरी' : 'Vulnerability'}</span>
                          <p className="text-text-tertiary text-xs">{t(l.vulnerability)}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 4: Timing of Health Events */}
      <LessonSection number={4} title={isHi ? 'स्वास्थ्य घटनाओं का समय' : 'Timing of Health Events'} variant="formula">
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            {isHi
              ? 'रोग कब प्रकट होगा, यह जानने के लिए दशा और गोचर दोनों देखें:'
              : 'To predict WHEN health events manifest, analyze both dasha periods and transits simultaneously:'}
          </p>
          {[
            { trigger: { en: '6th/8th lord Dasha-Antardasha', hi: 'षष्ठेश/अष्टमेश दशा-अन्तर्दशा' }, effect: { en: 'Primary health alert periods. The specific disease depends on which planet rules these houses and its nature.', hi: 'प्रमुख स्वास्थ्य चेतावनी काल। विशिष्ट रोग इन भावों के स्वामी ग्रह पर निर्भर।' }, severity: 'high' },
            { trigger: { en: 'Saturn transit over 1st/6th/8th', hi: 'शनि का 1/6/8 पर गोचर' }, effect: { en: 'Chronic issues peak. Saturn brings slow-developing, persistent health problems. Bones, joints, teeth particularly affected.', hi: 'दीर्घकालिक रोग चरम पर। शनि धीमे विकसित होने वाली, लगातार स्वास्थ्य समस्याएं लाता है।' }, severity: 'high' },
            { trigger: { en: 'Mars transit over 6th/8th', hi: 'मंगल का 6/8 पर गोचर' }, effect: { en: 'Acute illness, accident risk, surgery timing. Mars brings sudden, sharp health events — fevers, injuries, surgical interventions.', hi: 'तीव्र बीमारी, दुर्घटना जोखिम, शल्यक्रिया। मंगल अचानक तीव्र स्वास्थ्य घटनाएं लाता है।' }, severity: 'medium' },
            { trigger: { en: 'Eclipse on natal Moon/Lagna', hi: 'जन्म चन्द्र/लग्न पर ग्रहण' }, effect: { en: 'Major health turning point. Eclipses within 5 degrees of natal Moon or Ascendant degree can trigger significant medical events within 6 months.', hi: 'प्रमुख स्वास्थ्य मोड़। जन्म चन्द्र या लग्न अंश के 5 अंश भीतर ग्रहण 6 माह में महत्वपूर्ण चिकित्सा घटना।' }, severity: 'high' },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.severity === 'high' ? 'border-red-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]' : 'border-amber-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Activity className={`w-4 h-4 ${item.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                <span className="text-gold-light font-bold text-sm" style={hf}>{t(item.trigger)}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed ml-6">{t(item.effect)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 5: Ayurvedic Constitution */}
      <LessonSection number={5} title={isHi ? 'कुण्डली से आयुर्वेदिक प्रकृति' : 'Ayurvedic Constitution from Chart'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi
            ? 'कुण्डली में तत्त्वों का प्रभुत्व आपकी आयुर्वेदिक प्रकृति (दोष) निर्धारित करता है:'
            : 'The dominant element in your chart determines your Ayurvedic constitution (dosha). Count planets in each element to find your primary dosha:'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOSHAS.map((d, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-xl bg-gradient-to-br ${d.color} border border-gold-primary/10`}>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-gold-light" />
                <h4 className="text-gold-light font-bold text-base" style={hf}>{t(d.dosha)}</h4>
              </div>
              <p className="text-text-secondary text-xs mb-2 font-medium">{t(d.elements)}</p>
              <p className="text-gold-dark text-xs mb-2">{t(d.signs)}</p>
              <p className="text-text-tertiary text-xs leading-relaxed">{t(d.traits)}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
          <p className="text-text-tertiary text-xs leading-relaxed">
            {isHi
              ? 'गणना विधि: सूर्य से केतु तक सभी 9 ग्रहों की राशि देखें। जिस तत्त्व (अग्नि/पृथ्वी/वायु/जल) में सबसे अधिक ग्रह हों, वह आपकी प्रमुख प्रकृति है। लग्न और चन्द्र राशि को दोहरा भार दें।'
              : 'Method: Check the sign of all 9 planets (Sun through Ketu). The element (fire/earth/air/water) with the most planets is your dominant dosha. Give double weight to Lagna and Moon sign.'}
          </p>
        </div>
      </LessonSection>

      {/* Navigation links */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          { href: '/kundali' as const, label: isHi ? 'कुण्डली बनाएं' : 'Generate Kundali' },
          { href: '/learn/planets' as const, label: isHi ? 'ग्रह विस्तार' : 'Learn Planets' },
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
