'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Brain, ChevronDown, Clock, Code2, Gauge, Heart, MessageCircle, RotateCcw, Sparkles, Swords, Zap } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual labels ───────────────────────────────────────────── */
const L = {
  title: { en: 'Retrograde Effects Per Planet', hi: 'ग्रहवार वक्री प्रभाव', sa: 'ग्रहशः वक्रिप्रभावाः' },
  subtitle: {
    en: 'Understanding retrograde motion — why planets appear to move backward, how it strengthens them in Vedic astrology, and what each retrograde planet means in your birth chart and current transits.',
    hi: 'वक्री गति को समझना — ग्रह पीछे क्यों चलते प्रतीत होते हैं, वैदिक ज्योतिष में यह उन्हें कैसे बलवान बनाता है, और प्रत्येक वक्री ग्रह का अर्थ।',
    sa: 'वक्रगतेः अवगमनम् — ग्रहाः पश्चाद्गामिनः किमर्थं प्रतीयन्ते, वैदिकज्योतिषे एतत् तान् कथं बलवन्तं करोति, प्रत्येकवक्रिग्रहस्य अर्थश्च।'
  },
};

/* ── Retrograde frequency table ──────────────────────────────────── */
const RETRO_TABLE: { planet: { en: string; hi: string }; frequency: { en: string; hi: string }; duration: { en: string; hi: string }; view: { en: string; hi: string }; color: string }[] = [
  { planet: { en: 'Mercury', hi: 'बुध' }, frequency: { en: '3-4x per year', hi: 'वर्ष में 3-4 बार' }, duration: { en: '~21 days', hi: '~21 दिन' }, view: { en: 'Communication internalized, deep processing', hi: 'संवाद आन्तरिक, गहन प्रसंस्करण' }, color: 'text-emerald-400' },
  { planet: { en: 'Venus', hi: 'शुक्र' }, frequency: { en: 'Every 18 months', hi: 'हर 18 माह' }, duration: { en: '~40 days', hi: '~40 दिन' }, view: { en: 'Relationship re-evaluation, inner beauty focus', hi: 'सम्बन्ध पुनर्मूल्यांकन, आन्तरिक सौन्दर्य' }, color: 'text-pink-400' },
  { planet: { en: 'Mars', hi: 'मंगल' }, frequency: { en: 'Every 26 months', hi: 'हर 26 माह' }, duration: { en: '~72 days', hi: '~72 दिन' }, view: { en: 'Action stalled then redirected, strategy over force', hi: 'कर्म अवरुद्ध फिर पुनर्निर्देशित, बल पर रणनीति' }, color: 'text-red-400' },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, frequency: { en: '4 months/year', hi: '4 माह/वर्ष' }, duration: { en: '~120 days', hi: '~120 दिन' }, view: { en: 'Inner wisdom deepening, unconventional guru', hi: 'आन्तरिक ज्ञान गहनता, अपरम्परागत गुरु' }, color: 'text-yellow-400' },
  { planet: { en: 'Saturn', hi: 'शनि' }, frequency: { en: '4.5 months/year', hi: '4.5 माह/वर्ष' }, duration: { en: '~138 days', hi: '~138 दिन' }, view: { en: 'Karmic review intensified, past debts surface', hi: 'कार्मिक समीक्षा तीव्र, पूर्व ऋण उभरना' }, color: 'text-slate-400' },
  { planet: { en: 'Rahu / Ketu', hi: 'राहु / केतु' }, frequency: { en: 'Always retrograde', hi: 'सदैव वक्री' }, duration: { en: 'Permanent', hi: 'स्थायी' }, view: { en: 'Their natural state — retrograde IS their default motion', hi: 'उनकी स्वाभाविक स्थिति — वक्री ही उनकी मूल गति' }, color: 'text-cyan-400' },
];

/* ── Natal retrograde effects ────────────────────────────────────── */
const NATAL_EFFECTS: { planet: { en: string; hi: string }; icon: typeof MessageCircle; traits: { en: string; hi: string }; depth: { en: string; hi: string }; famous: { en: string; hi: string }; color: string }[] = [
  { planet: { en: 'Mercury Retrograde (Natal)', hi: 'बुध वक्री (जन्म)' }, icon: MessageCircle, traits: { en: 'Deep thinker, may struggle with quick communication but excels at research, editing, and analysis. Learns by revisiting and revising.', hi: 'गहन विचारक, त्वरित संवाद में कठिनाई परन्तु अनुसन्धान, सम्पादन और विश्लेषण में निपुण। पुनरावलोकन से सीखता है।' }, depth: { en: 'The mind works in spirals, not lines. Ideas need multiple passes to crystallize. Writing improves dramatically with editing. Often bilingual or multilingual.', hi: 'मन सर्पिल गति से कार्य करता है, सीधी रेखा से नहीं। विचारों को क्रिस्टलीकरण के लिए बहु प्रयास चाहिए। सम्पादन से लेखन नाटकीय रूप से सुधरता है।' }, famous: { en: 'Einstein, Shakespeare, Nikola Tesla', hi: 'आइंस्टीन, शेक्सपियर, निकोला टेस्ला' }, color: 'text-emerald-400' },
  { planet: { en: 'Venus Retrograde (Natal)', hi: 'शुक्र वक्री (जन्म)' }, icon: Heart, traits: { en: 'Unconventional love life, may marry late or remarry. Deep appreciation for beauty but difficulty expressing affection openly. Artistic depth over surface charm.', hi: 'अपरम्परागत प्रेम जीवन, देर से विवाह या पुनर्विवाह सम्भव। सौन्दर्य की गहरी सराहना परन्तु स्नेह व्यक्त करने में कठिनाई।' }, depth: { en: 'Love is felt intensely but expressed awkwardly. Past-life relationship karma surfaces. Often drawn to art, music, or aesthetics as a profession. Values feel "different" from mainstream.', hi: 'प्रेम तीव्रता से अनुभव होता है परन्तु अजीब ढंग से व्यक्त। पूर्वजन्म सम्बन्ध कर्म उभरता है। कला, संगीत में आकर्षण।' }, famous: { en: 'Frida Kahlo, Kurt Cobain, Rumi', hi: 'फ्रीडा काहलो, कर्ट कोबेन, रूमी' }, color: 'text-pink-400' },
  { planet: { en: 'Mars Retrograde (Natal)', hi: 'मंगल वक्री (जन्म)' }, icon: Swords, traits: { en: 'Internalized anger, indirect action. Excels at strategy over brute force. May avoid confrontation. Energy comes in intense bursts rather than steady output.', hi: 'आन्तरिक क्रोध, अप्रत्यक्ष कार्य। बल पर रणनीति में श्रेष्ठ। टकराव से बचाव। ऊर्जा स्थिर नहीं, तीव्र विस्फोटों में।' }, depth: { en: 'The warrior fights with wit, not sword. Physical energy must be consciously channeled — gym, martial arts, competitive sports. Suppressed anger can cause health issues if not expressed.', hi: 'योद्धा बुद्धि से लड़ता है, तलवार से नहीं। शारीरिक ऊर्जा सचेत रूप से निर्देशित — व्यायाम, मार्शल आर्ट। दबा क्रोध स्वास्थ्य समस्या।' }, famous: { en: 'Mahatma Gandhi, Bruce Lee, Steve Jobs', hi: 'महात्मा गांधी, ब्रूस ली, स्टीव जॉब्स' }, color: 'text-red-400' },
  { planet: { en: 'Jupiter Retrograde (Natal)', hi: 'गुरु वक्री (जन्म)' }, icon: Brain, traits: { en: 'Questions conventional wisdom, spiritual seeker, may not follow mainstream religion. Finds own guru. Wisdom through experience, not books.', hi: 'परम्परागत ज्ञान पर प्रश्न, आध्यात्मिक खोजी, मुख्यधारा धर्म नहीं। स्वयं गुरु खोजता है। अनुभव से ज्ञान।' }, depth: { en: 'The inner guru is stronger than any external teacher. Philosophy is lived, not read. May reject family religion early but develop profound personal spirituality. Often becomes a guide for others.', hi: 'आन्तरिक गुरु किसी बाह्य शिक्षक से शक्तिशाली। दर्शन जीया जाता है, पढ़ा नहीं। पारिवारिक धर्म त्याग सम्भव परन्तु गहन व्यक्तिगत आध्यात्मिकता।' }, famous: { en: 'Buddha, Ramana Maharshi, Carl Jung', hi: 'बुद्ध, रमण महर्षि, कार्ल युंग' }, color: 'text-yellow-400' },
  { planet: { en: 'Saturn Retrograde (Natal)', hi: 'शनि वक्री (जन्म)' }, icon: Clock, traits: { en: 'Karmic debts intensified. Hard worker but feels unrecognized early in life. Success comes after age 36. Deep, almost painful sense of duty and responsibility.', hi: 'कार्मिक ऋण तीव्र। कठिन परिश्रमी परन्तु जीवन के आरम्भ में अपरिचित। 36 वर्ष बाद सफलता। कर्तव्य और जिम्मेदारी की गहरी भावना।' }, depth: { en: 'Saturn retrograde natives carry the weight of past-life karma consciously. They mature early, seem old beyond their years. The reward comes late but lasts forever. They build empires slowly.', hi: 'शनि वक्री जातक पूर्वजन्म कर्म का भार सचेत रूप से वहन करते हैं। शीघ्र परिपक्व, आयु से अधिक प्रौढ़। पुरस्कार देर से परन्तु शाश्वत।' }, famous: { en: 'Abraham Lincoln, Nelson Mandela', hi: 'अब्राहम लिंकन, नेल्सन मंडेला' }, color: 'text-slate-400' },
];

/* ── Transit retrograde effects ──────────────────────────────────── */
const TRANSIT_EFFECTS: { planet: { en: string; hi: string }; doList: { en: string; hi: string }; dontList: { en: string; hi: string }; color: string }[] = [
  { planet: { en: 'Mercury Retrograde Transit', hi: 'बुध वक्री गोचर' }, doList: { en: 'Revisit old plans, edit/revise documents, reconnect with old contacts, backup data, double-check communications', hi: 'पुरानी योजनाएं पुनरावलोकन, दस्तावेज सम्पादन, पुराने सम्पर्क, डेटा बैकअप, संचार दोबारा जांचें' }, dontList: { en: 'Sign major contracts, launch new products, buy electronics, start new communication projects', hi: 'बड़े अनुबन्ध, नए उत्पाद लॉन्च, इलेक्ट्रॉनिक्स खरीद, नई संचार परियोजनाएं' }, color: 'text-emerald-400' },
  { planet: { en: 'Venus Retrograde Transit', hi: 'शुक्र वक्री गोचर' }, doList: { en: 'Reassess relationships, reconnect with ex (carefully), revisit artistic projects, inner beauty work', hi: 'सम्बन्ध पुनर्मूल्यांकन, पूर्व साथी से सम्पर्क (सावधानी), कलात्मक परियोजना पुनरावलोकन' }, dontList: { en: 'Get married, major cosmetic procedures, expensive luxury purchases, start new relationships', hi: 'विवाह, बड़ी कॉस्मेटिक प्रक्रिया, महंगी विलासिता खरीद, नए सम्बन्ध' }, color: 'text-pink-400' },
  { planet: { en: 'Mars Retrograde Transit', hi: 'मंगल वक्री गोचर' }, doList: { en: 'Strategize, plan actions, exercise patience, redirect stalled projects, internal strength building', hi: 'रणनीति बनाएं, कार्य योजना, धैर्य, रुकी परियोजनाएं पुनर्निर्देशित, आन्तरिक शक्ति' }, dontList: { en: 'Start new ventures, initiate confrontations, surgery (if elective), risky physical activities', hi: 'नए उद्यम, टकराव, वैकल्पिक शल्यक्रिया, जोखिमपूर्ण शारीरिक गतिविधि' }, color: 'text-red-400' },
  { planet: { en: 'Jupiter Retrograde Transit', hi: 'गुरु वक्री गोचर' }, doList: { en: 'Spiritual introspection, reassess growth direction, deepen existing studies, inner teaching', hi: 'आध्यात्मिक आत्मनिरीक्षण, विकास दिशा पुनर्मूल्यांकन, विद्यमान अध्ययन गहन' }, dontList: { en: 'Expand business aggressively, take on excessive risk, assume guaranteed success in legal matters', hi: 'आक्रामक व्यापार विस्तार, अत्यधिक जोखिम, कानूनी मामलों में सफलता मान लेना' }, color: 'text-yellow-400' },
  { planet: { en: 'Saturn Retrograde Transit', hi: 'शनि वक्री गोचर' }, doList: { en: 'Revisit old responsibilities, karmic cleansing, restructure foundations, patience and discipline', hi: 'पुरानी जिम्मेदारियां पुनरावलोकन, कार्मिक शुद्धि, नींव पुनर्गठन, धैर्य और अनुशासन' }, dontList: { en: 'Ignore responsibilities, cut corners on quality, avoid hard conversations, neglect health', hi: 'जिम्मेदारी उपेक्षा, गुणवत्ता में कटौती, कठिन बातचीत से बचना, स्वास्थ्य उपेक्षा' }, color: 'text-slate-400' },
];

/* ── SVG Orbital Retrograde Diagram ──────────────────────────────── */
function RetrogradeOrbitalDiagram({ isHi }: { isHi: boolean }) {
  return (
    <svg viewBox="0 0 600 320" className="w-full max-w-[600px] mx-auto">
      <defs>
        <radialGradient id="rg-earth" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="rg-sun" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id="rg-planet" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#991b1b" stopOpacity="0.5" />
        </radialGradient>
        <filter id="rg-glow"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>

      {/* Background star field */}
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={20 + (i * 19) % 560} cy={10 + (i * 37) % 300} r={0.5 + (i % 3) * 0.3}
          fill="rgba(255,255,255,0.15)" />
      ))}

      {/* Sun at center */}
      <circle cx="300" cy="160" r="20" fill="url(#rg-sun)" />
      <circle cx="300" cy="160" r="24" fill="none" stroke="#fbbf24" strokeWidth="0.5" strokeOpacity="0.3" />
      <text x="300" y="164" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
        {isHi ? 'सूर्य' : 'Sun'}
      </text>

      {/* Earth orbit */}
      <ellipse cx="300" cy="160" rx="100" ry="100" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="1" strokeDasharray="4 4" />

      {/* Outer planet orbit */}
      <ellipse cx="300" cy="160" rx="200" ry="140" fill="none" stroke="rgba(239,68,68,0.12)" strokeWidth="1" strokeDasharray="6 4" />

      {/* Earth position 1 (behind) */}
      <circle cx="210" cy="100" r="7" fill="url(#rg-earth)" opacity="0.4" />
      <text x="210" y="86" textAnchor="middle" fill="rgba(59,130,246,0.5)" fontSize="7">E1</text>

      {/* Earth position 2 (passing) */}
      <circle cx="200" cy="160" r="8" fill="url(#rg-earth)" opacity="0.7" />
      <text x="184" y="164" textAnchor="middle" fill="rgba(59,130,246,0.8)" fontSize="7">E2</text>

      {/* Earth position 3 (ahead) */}
      <circle cx="210" cy="220" r="7" fill="url(#rg-earth)" opacity="0.4" />
      <text x="210" y="236" textAnchor="middle" fill="rgba(59,130,246,0.5)" fontSize="7">E3</text>

      {/* Outer planet positions */}
      <circle cx="100" cy="120" r="9" fill="url(#rg-planet)" opacity="0.5" />
      <text x="100" y="108" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="7">P1</text>

      <circle cx="100" cy="160" r="10" fill="url(#rg-planet)" />
      <text x="80" y="164" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="7">P2</text>

      <circle cx="100" cy="200" r="9" fill="url(#rg-planet)" opacity="0.5" />
      <text x="100" y="216" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="7">P3</text>

      {/* Sight lines from E2 to P1/P2/P3 — showing apparent motion */}
      <line x1="200" y1="160" x2="100" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1="200" y1="160" x2="100" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <line x1="200" y1="160" x2="100" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="3 3" />

      {/* Projected apparent positions on sky (right side) */}
      <line x1="100" y1="120" x2="530" y2="90" stroke="rgba(239,68,68,0.08)" strokeWidth="0.5" strokeDasharray="2 4" />
      <line x1="100" y1="160" x2="530" y2="160" stroke="rgba(239,68,68,0.15)" strokeWidth="0.5" strokeDasharray="2 4" />
      <line x1="100" y1="200" x2="530" y2="230" stroke="rgba(239,68,68,0.08)" strokeWidth="0.5" strokeDasharray="2 4" />

      {/* Apparent sky positions */}
      <rect x="520" y="60" width="70" height="200" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(212,168,83,0.15)" strokeWidth="0.5" />
      <text x="555" y="55" textAnchor="middle" fill="rgba(212,168,83,0.4)" fontSize="8">{isHi ? 'आकाश दृश्य' : 'Sky View'}</text>

      <circle cx="555" cy="90" r="5" fill="rgba(239,68,68,0.5)" />
      <text x="570" y="93" fill="rgba(239,68,68,0.6)" fontSize="7">1</text>

      <circle cx="555" cy="160" r="6" fill="rgba(239,68,68,0.8)" />
      <text x="570" y="163" fill="rgba(239,68,68,0.8)" fontSize="7">2</text>

      <circle cx="555" cy="230" r="5" fill="rgba(239,68,68,0.5)" />
      <text x="570" y="233" fill="rgba(239,68,68,0.6)" fontSize="7">3</text>

      {/* Apparent backward arrow */}
      <path d="M545,100 L545,220" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.6" markerEnd="url(#rg-arrow)" />
      <defs>
        <marker id="rg-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#ef4444" fillOpacity="0.6" />
        </marker>
      </defs>
      <text x="532" y="170" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="bold" transform="rotate(-90,532,170)">
        {isHi ? 'वक्री गति' : 'RETRO'}
      </text>

      {/* Earth overtaking arrow */}
      <path d="M215,105 C225,130 225,190 215,215" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" markerEnd="url(#rg-earrow)" />
      <defs>
        <marker id="rg-earrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#3b82f6" fillOpacity="0.5" />
        </marker>
      </defs>

      {/* Labels */}
      <text x="300" y="300" textAnchor="middle" fill="rgba(212,168,83,0.4)" fontSize="9" fontStyle="italic">
        {isHi ? 'पृथ्वी तीव्र ग्रह को पार करती है → ग्रह पीछे चलता प्रतीत होता है' : 'Earth overtakes slower planet → planet APPEARS to move backward'}
      </text>
    </svg>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function RetrogradeEffectsPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const t = (obj: { en: string; hi: string; sa?: string }) => isHi ? (locale === 'sa' && obj.sa ? obj.sa : obj.hi) : obj.en;
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedNatal, setExpandedNatal] = useState<number | null>(null);
  const [expandedTransit, setExpandedTransit] = useState<number | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium mb-4">
          <RotateCcw className="w-3.5 h-3.5" />
          {isHi ? 'वक्री ग्रह विश्लेषण' : 'Retrograde Analysis'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t(L.title)}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t(L.subtitle)}</p>
      </motion.div>

      {/* SVG Orbital Diagram */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/15">
          <RetrogradeOrbitalDiagram isHi={isHi} />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {isHi
              ? 'जैसे तेज कार धीमी कार को पार करती है, धीमी कार पीछे जाती प्रतीत होती है। पृथ्वी बाहरी ग्रह को पार करती है → वक्री गति का भ्रम।'
              : 'Like a fast car passing a slow car — the slow car APPEARS to go backward. Earth overtakes the outer planet, creating the retrograde illusion.'}
          </p>
        </div>
      </motion.div>

      {/* Section 1: What is Retrograde */}
      <LessonSection number={1} title={isHi ? 'वक्री गति क्या है?' : 'What is Retrograde?'} variant="highlight">
        <div className="space-y-4">
          {[
            { icon: ArrowLeftRight, point: { en: 'NOT actually moving backward', hi: 'वास्तव में पीछे नहीं चलता' }, detail: { en: 'It is a perspective illusion caused by Earth overtaking a slower outer planet (or an inner planet passing between Earth and Sun). The planet\'s orbital speed hasn\'t changed.', hi: 'यह एक दृष्टि भ्रम है जो पृथ्वी द्वारा धीमे बाहरी ग्रह को पार करने से (या आन्तरिक ग्रह पृथ्वी और सूर्य के बीच से गुजरने से) उत्पन्न होता है।' }, color: 'text-cyan-400' },
            { icon: Zap, point: { en: 'Retrograde = CLOSER to Earth = STRONGER', hi: 'वक्री = पृथ्वी से निकट = अधिक बलवान' }, detail: { en: 'In Vedic astrology, retrograde planets gain Cheshta Bala (motional strength). They are physically closer to Earth during retrograde, making their influence MORE powerful, not less.', hi: 'वैदिक ज्योतिष में वक्री ग्रह चेष्टा बल प्राप्त करते हैं। वक्री के दौरान वे पृथ्वी से भौतिक रूप से अधिक निकट होते हैं, उनका प्रभाव अधिक शक्तिशाली।' }, color: 'text-amber-400' },
            { icon: Gauge, point: { en: 'Western "Mercury retro panic" is misguided', hi: 'पश्चिमी "बुध वक्री भय" भ्रामक है' }, detail: { en: 'The Western astrology panic about retrograde Mercury causing disasters misunderstands the Vedic view. In Jyotish, retrograde intensifies and internalizes a planet\'s energy — it doesn\'t destroy it.', hi: 'पश्चिमी ज्योतिष का वक्री बुध से आपदा भय वैदिक दृष्टिकोण का गलत अर्थ है। ज्योतिष में वक्री ग्रह की ऊर्जा को तीव्र और आन्तरिक बनाता है — नष्ट नहीं।' }, color: 'text-emerald-400' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-bg-secondary/40 border border-gold-primary/8">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-gold-light font-bold text-sm mb-1" style={hf}>{t(item.point)}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{t(item.detail)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 2: Retrograde Frequency Table */}
      <LessonSection number={2} title={isHi ? 'वक्री आवृत्ति सारणी' : 'Retrograde Frequency Table'}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{isHi ? 'आवृत्ति' : 'Frequency'}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{isHi ? 'अवधि' : 'Duration'}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{isHi ? 'वैदिक दृष्टिकोण' : 'Vedic View'}</th>
              </tr>
            </thead>
            <tbody>
              {RETRO_TABLE.map((r, i) => (
                <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className={`py-2.5 px-3 font-bold text-xs ${r.color}`} style={hf}>{t(r.planet)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs">{t(r.frequency)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs">{t(r.duration)}</td>
                  <td className="py-2.5 px-3 text-text-tertiary text-xs">{t(r.view)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 3: Natal Retrograde Effects */}
      <LessonSection number={3} title={isHi ? 'जन्म कुण्डली में वक्री ग्रह' : 'Retrograde in Your Birth Chart (Natal)'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi
            ? 'जन्म समय वक्री ग्रह आपके व्यक्तित्व में गहरा आन्तरिक आयाम जोड़ते हैं:'
            : 'Planets retrograde at the time of your birth add a deep, internalized dimension to your personality:'}
        </p>
        <div className="space-y-3">
          {NATAL_EFFECTS.map((n, i) => {
            const Icon = n.icon;
            const isOpen = expandedNatal === i;
            return (
              <motion.div key={i} layout className="rounded-xl bg-bg-secondary/40 border border-gold-primary/8 overflow-hidden">
                <button onClick={() => setExpandedNatal(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${n.color}`} />
                  </div>
                  <span className={`font-bold text-sm flex-1 ${n.color}`} style={hf}>{t(n.planet)}</span>
                  <ChevronDown className={`w-4 h-4 text-gold-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-3 ml-11">
                        <p className="text-text-secondary text-sm leading-relaxed">{t(n.traits)}</p>
                        <div className="p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                          <span className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">{isHi ? 'गहरा अर्थ' : 'Deeper Meaning'}</span>
                          <p className="text-text-tertiary text-xs mt-1 leading-relaxed">{t(n.depth)}</p>
                        </div>
                        <div className="text-text-tertiary text-[11px]">
                          <span className="text-gold-dark font-bold">{isHi ? 'प्रसिद्ध उदाहरण:' : 'Famous examples:'}</span> {t(n.famous)}
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

      {/* Section 4: Transit Retrograde Effects */}
      <LessonSection number={4} title={isHi ? 'गोचर में वक्री प्रभाव (वर्तमान आकाश)' : 'Retrograde in Transit (Current Sky)'}>
        <p className="text-text-secondary text-sm mb-5">
          {isHi ? 'जब ग्रह वर्तमान गोचर में वक्री होता है — क्या करें और क्या न करें:' : 'When a planet goes retrograde in current transit — practical do\'s and don\'ts:'}
        </p>
        <div className="space-y-3">
          {TRANSIT_EFFECTS.map((te, i) => {
            const isOpen = expandedTransit === i;
            return (
              <motion.div key={i} layout className="rounded-xl bg-bg-secondary/40 border border-gold-primary/8 overflow-hidden">
                <button onClick={() => setExpandedTransit(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left">
                  <span className={`font-bold text-sm ${te.color}`} style={hf}>{t(te.planet)}</span>
                  <ChevronDown className={`w-4 h-4 text-gold-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                          <span className="text-emerald-400 text-[10px] uppercase tracking-wider font-bold">{isHi ? 'करें' : 'Do'}</span>
                          <p className="text-text-tertiary text-xs mt-1 leading-relaxed">{t(te.doList)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15">
                          <span className="text-red-400 text-[10px] uppercase tracking-wider font-bold">{isHi ? 'न करें' : 'Don\'t'}</span>
                          <p className="text-text-tertiary text-xs mt-1 leading-relaxed">{t(te.dontList)}</p>
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

      {/* Section 5: Mathematical Note */}
      <LessonSection number={5} title={isHi ? 'गणितीय टिप्पणी' : 'Mathematical Note'} variant="formula">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-bg-secondary/40 border border-gold-primary/10 font-mono text-sm">
            <div className="text-emerald-400 mb-2">// {isHi ? 'वक्री पहचान' : 'Retrograde detection'}</div>
            <div className="text-text-secondary">
              <span className="text-cyan-400">if</span> (planet.speed {'<'} <span className="text-amber-400">0</span>) {'{'}
            </div>
            <div className="text-text-secondary ml-4">
              planet.isRetrograde = <span className="text-amber-400">true</span>;
            </div>
            <div className="text-text-secondary">{'}'}</div>
          </div>
          {[
            { label: { en: 'Detection Method', hi: 'पहचान विधि' }, value: { en: 'When a planet\'s daily longitude change (speed) becomes negative, it is retrograde. This is computed from ephemeris calculations every 24 hours.', hi: 'जब ग्रह का दैनिक रेखांश परिवर्तन (गति) ऋणात्मक होता है, वह वक्री है। यह पंचांग गणना से प्रति 24 घण्टे गणना होता है।' } },
            { label: { en: 'Cheshta Bala (Shadbala)', hi: 'चेष्टा बल (षड्बल)' }, value: { en: 'Retrograde planets receive maximum motional strength — 60 Shashtiamsas (full score). This makes them among the strongest planets in the Shadbala system.', hi: 'वक्री ग्रह अधिकतम गति बल प्राप्त करते हैं — 60 षष्ट्यंश (पूर्ण अंक)। षड्बल प्रणाली में यह सबसे शक्तिशाली ग्रहों में बनाता है।' } },
            { label: { en: 'Stationary Planets', hi: 'स्थिर ग्रह' }, value: { en: 'Just before going retrograde or turning direct, a planet becomes "stationary" (near-zero speed). Stationary planets are extremely powerful — they "stop" and concentrate all energy on the degree they occupy.', hi: 'वक्री होने या मार्गी होने से ठीक पहले, ग्रह "स्थिर" (लगभग शून्य गति) होता है। स्थिर ग्रह अत्यन्त शक्तिशाली — वे "रुकते" हैं और सारी ऊर्जा उस अंश पर केन्द्रित करते हैं।' } },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-bg-secondary/30 border border-gold-primary/8">
              <span className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">{t(item.label)}</span>
              <p className="text-text-secondary text-sm mt-1 leading-relaxed">{t(item.value)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Navigation links */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          { href: '/kundali' as const, label: isHi ? 'कुण्डली बनाएं' : 'Generate Kundali' },
          { href: '/learn/planets' as const, label: isHi ? 'ग्रह विस्तार' : 'Learn Planets' },
          { href: '/learn/shadbala' as const, label: isHi ? 'षड्बल' : 'Shadbala Strength' },
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
