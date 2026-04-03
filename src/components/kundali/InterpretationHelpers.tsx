'use client';

import { useMemo } from 'react';
import type { PlanetPosition } from '@/types/kundali';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { PlanetAvasthas } from '@/lib/kundali/avasthas';

// ─── Planet metadata ────────────────────────────────────────────────────────

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANET_NAMES_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

function pName(id: number, isHi: boolean): string {
  return isHi ? (PLANET_NAMES_HI[id] ?? `Planet ${id}`) : (PLANET_NAMES_EN[id] ?? `Planet ${id}`);
}

const PLANET_THEMES: Record<number, { strong: string; weak: string; strongHi: string; weakHi: string }> = {
  0: {
    strong: 'Authority, career recognition, father\'s support',
    weak: 'Career struggles, lack of recognition, father issues',
    strongHi: 'अधिकार, करियर में मान्यता, पिता का सहयोग',
    weakHi: 'करियर में कठिनाई, मान्यता की कमी, पिता से समस्या',
  },
  1: {
    strong: 'Emotional stability, good public image, mother\'s support',
    weak: 'Anxiety, emotional turbulence, mother\'s health concerns',
    strongHi: 'भावनात्मक स्थिरता, अच्छी सार्वजनिक छवि, माता का सहयोग',
    weakHi: 'चिंता, भावनात्मक अस्थिरता, माता के स्वास्थ्य की चिंता',
  },
  2: {
    strong: 'Courage, property gains, technical ability',
    weak: 'Lack of initiative, property disputes, accident-prone',
    strongHi: 'साहस, संपत्ति लाभ, तकनीकी क्षमता',
    weakHi: 'पहल की कमी, संपत्ति विवाद, दुर्घटना की संभावना',
  },
  3: {
    strong: 'Business acumen, communication skills, analytical mind',
    weak: 'Indecision, communication problems, skin issues',
    strongHi: 'व्यापार कौशल, संवाद कला, विश्लेषणात्मक बुद्धि',
    weakHi: 'अनिर्णय, संवाद में समस्या, त्वचा रोग',
  },
  4: {
    strong: 'Wisdom, children, spiritual growth, wealth',
    weak: 'Bad advice, delayed children, lack of faith',
    strongHi: 'ज्ञान, संतान, आध्यात्मिक विकास, धन',
    weakHi: 'गलत सलाह, संतान में विलम्ब, श्रद्धा की कमी',
  },
  5: {
    strong: 'Happy marriage, luxury, artistic talent',
    weak: 'Relationship issues, lack of comfort, kidney problems',
    strongHi: 'सुखी विवाह, विलासिता, कलात्मक प्रतिभा',
    weakHi: 'संबंधों में समस्या, सुख की कमी, गुर्दे की समस्या',
  },
  6: {
    strong: 'Discipline, longevity, career stability',
    weak: 'Chronic problems, delays, bone/joint issues',
    strongHi: 'अनुशासन, दीर्घायु, करियर स्थिरता',
    weakHi: 'दीर्घकालिक समस्याएं, विलम्ब, हड्डी/जोड़ों की समस्या',
  },
};

const PLANET_REMEDIES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Offer water to Sun at sunrise, recite Aditya Hridayam, wear Ruby', hi: 'सूर्य को जल अर्पित करें, आदित्य हृदयम का पाठ करें, माणिक्य धारण करें' },
  1: { en: 'Wear Pearl, Monday fasting, recite Chandra mantra, serve mother', hi: 'मोती धारण करें, सोमवार व्रत, चन्द्र मंत्र, माता की सेवा' },
  2: { en: 'Wear Red Coral, Hanuman Chalisa on Tuesday, donate jaggery', hi: 'मूंगा धारण करें, मंगलवार को हनुमान चालीसा, गुड़ दान करें' },
  3: { en: 'Wear Emerald, recite Vishnu Sahasranama, feed green moong', hi: 'पन्ना धारण करें, विष्णु सहस्रनाम, हरी मूंग दान करें' },
  4: { en: 'Wear Yellow Sapphire, Thursday fasting, recite Guru Stotra', hi: 'पुखराज धारण करें, गुरुवार व्रत, गुरु स्तोत्र का पाठ' },
  5: { en: 'Wear Diamond/White Sapphire, Friday puja, recite Lakshmi Stotra', hi: 'हीरा/श्वेत पुखराज धारण करें, शुक्रवार पूजा, लक्ष्मी स्तोत्र' },
  6: { en: 'Wear Blue Sapphire (with caution), Saturday charity, feed crows', hi: 'नीलम (सावधानी से) धारण करें, शनिवार दान, कौवों को खिलाएं' },
};

// ─── House significations ────────────────────────────────────────────────────

const HOUSE_SIGNIFICATIONS: Record<number, { en: string; hi: string; remedy_en: string; remedy_hi: string }> = {
  1: { en: 'Self, personality, health, vitality', hi: 'आत्म, व्यक्तित्व, स्वास्थ्य', remedy_en: 'Strengthen lagna lord, Sun worship', remedy_hi: 'लग्नेश को बलवान करें, सूर्य उपासना' },
  2: { en: 'Wealth, family, speech, food habits', hi: 'धन, परिवार, वाणी, भोजन', remedy_en: 'Donate food, strengthen 2nd lord', remedy_hi: 'अन्न दान, द्वितीयेश को बलवान करें' },
  3: { en: 'Courage, siblings, short travel, efforts', hi: 'साहस, भाई-बहन, छोटी यात्रा', remedy_en: 'Mars remedies, regular exercise', remedy_hi: 'मंगल उपाय, नियमित व्यायाम' },
  4: { en: 'Mother, home, vehicles, inner peace', hi: 'माता, घर, वाहन, मानसिक शांति', remedy_en: 'Moon remedies, serve mother, plant trees', remedy_hi: 'चन्द्र उपाय, माता की सेवा, वृक्ष लगाएं' },
  5: { en: 'Children, education, intellect, romance', hi: 'संतान, शिक्षा, बुद्धि, प्रेम', remedy_en: 'Jupiter remedies, Saraswati puja', remedy_hi: 'गुरु उपाय, सरस्वती पूजा' },
  6: { en: 'Enemies, disease, debts, daily work', hi: 'शत्रु, रोग, ऋण, दैनिक कार्य', remedy_en: 'Mars/Saturn remedies, Hanuman worship', remedy_hi: 'मंगल/शनि उपाय, हनुमान उपासना' },
  7: { en: 'Marriage, partnerships, public dealings', hi: 'विवाह, साझेदारी, सार्वजनिक व्यवहार', remedy_en: 'Venus remedies, Gauri puja for marriage', remedy_hi: 'शुक्र उपाय, विवाह हेतु गौरी पूजा' },
  8: { en: 'Longevity, transformation, hidden matters', hi: 'आयु, रूपांतरण, गुप्त विषय', remedy_en: 'Mahamrityunjaya mantra, donate black items on Saturday', remedy_hi: 'महामृत्युंजय मंत्र, शनिवार काले वस्तुओं का दान' },
  9: { en: 'Fortune, father, dharma, higher education', hi: 'भाग्य, पिता, धर्म, उच्च शिक्षा', remedy_en: 'Jupiter remedies, pilgrimage, serve guru', remedy_hi: 'गुरु उपाय, तीर्थयात्रा, गुरु सेवा' },
  10: { en: 'Career, reputation, authority, karma', hi: 'करियर, प्रतिष्ठा, अधिकार, कर्म', remedy_en: 'Sun + Saturn remedies, Shani Stotra', remedy_hi: 'सूर्य + शनि उपाय, शनि स्तोत्र' },
  11: { en: 'Gains, income, elder siblings, desires', hi: 'लाभ, आय, बड़े भाई-बहन, इच्छाएं', remedy_en: 'Jupiter remedies, donate on Thursdays', remedy_hi: 'गुरु उपाय, गुरुवार दान' },
  12: { en: 'Losses, expenses, foreign travel, moksha', hi: 'हानि, खर्च, विदेश यात्रा, मोक्ष', remedy_en: 'Ketu remedies, meditation, spiritual practice', remedy_hi: 'केतु उपाय, ध्यान, आध्यात्मिक साधना' },
};

// ─── Yoga remedies table ─────────────────────────────────────────────────────

const COMMON_YOGA_REMEDIES = [
  { yoga: 'Kemadruma', issue: 'Loneliness, isolation', issueHi: 'अकेलापन, एकांत', remedy: 'Strengthen Moon — pearl, Monday fasting', remedyHi: 'चन्द्र बलवान करें — मोती, सोमवार व्रत' },
  { yoga: 'Mangal Dosha', issue: 'Marital conflict', issueHi: 'वैवाहिक विवाद', remedy: 'Mars remedies — red coral, Hanuman worship', remedyHi: 'मंगल उपाय — मूंगा, हनुमान पूजा' },
  { yoga: 'Kala Sarpa', issue: 'Career blocks', issueHi: 'करियर में बाधा', remedy: 'Rahu-Ketu remedies — Nag puja, Saturday charity', remedyHi: 'राहु-केतु उपाय — नाग पूजा, शनिवार दान' },
  { yoga: 'Guru Chandal', issue: 'Poor judgment', issueHi: 'खराब निर्णय', remedy: 'Jupiter remedies — yellow sapphire, Thursday puja', remedyHi: 'गुरु उपाय — पुखराज, गुरुवार पूजा' },
  { yoga: 'Daridra', issue: 'Financial struggle', issueHi: 'आर्थिक कठिनाई', remedy: '2nd/11th lord remedies, charity on Saturdays', remedyHi: '२/११ भावेश उपाय, शनिवार दान' },
];

// ─── Avastha quick reference ─────────────────────────────────────────────────

const AVASTHA_REFERENCE = [
  { state: 'Bala (infant)', meaning: 'Planet learning', good: 'Neutral', effect: 'Delayed but growing results', meaningHi: 'ग्रह सीख रहा है', effectHi: 'विलम्बित लेकिन बढ़ते परिणाम' },
  { state: 'Kumara (youth)', meaning: 'Planet developing', good: 'Good', effect: 'Moderate, improving results', meaningHi: 'ग्रह विकसित हो रहा', effectHi: 'मध्यम, सुधरते परिणाम' },
  { state: 'Yuva (prime)', meaning: 'Planet at peak', good: 'Best', effect: 'Full, strong results', meaningHi: 'ग्रह चरम पर', effectHi: 'पूर्ण, बलवान परिणाम' },
  { state: 'Vriddha (old)', meaning: 'Planet declining', good: 'Weak', effect: 'Diminishing results', meaningHi: 'ग्रह क्षीण हो रहा', effectHi: 'घटते परिणाम' },
  { state: 'Mrita (dead)', meaning: 'Planet exhausted', good: 'Worst', effect: 'Very weak or denied results', meaningHi: 'ग्रह थका हुआ', effectHi: 'बहुत कमजोर या अस्वीकृत परिणाम' },
  { state: 'Deepta (shining)', meaning: 'Exalted', good: 'Best', effect: 'Brilliant, effortless results', meaningHi: 'उच्च', effectHi: 'शानदार, सहज परिणाम' },
  { state: 'Swastha (content)', meaning: 'Own sign', good: 'Great', effect: 'Natural, comfortable results', meaningHi: 'स्वराशि', effectHi: 'स्वाभाविक, आरामदायक परिणाम' },
  { state: 'Mudita (happy)', meaning: 'Friend\'s sign', good: 'Good', effect: 'Cooperative results', meaningHi: 'मित्र राशि', effectHi: 'सहयोगात्मक परिणाम' },
  { state: 'Lajjita (ashamed)', meaning: '5th house with malefics', good: 'Bad', effect: 'Results with embarrassment', meaningHi: '5वें भाव में पाप ग्रह के साथ', effectHi: 'शर्मिंदगी के साथ परिणाम' },
  { state: 'Garvita (proud)', meaning: 'Exalted/moolatrikona', good: 'Best', effect: 'Confident, grand results', meaningHi: 'उच्च/मूलत्रिकोण', effectHi: 'आत्मविश्वासपूर्ण, भव्य परिणाम' },
  { state: 'Kshobhita (agitated)', meaning: 'With Sun + malefic aspect', good: 'Bad', effect: 'Results with stress', meaningHi: 'सूर्य + पाप दृष्टि के साथ', effectHi: 'तनाव के साथ परिणाम' },
];

// ─── Shared UI helpers ──────────────────────────────────────────────────────

function SectionCard({ children, border = 'border-sky-500/15', className = '' }: { children: React.ReactNode; border?: string; className?: string }) {
  return (
    <div className={`rounded-xl border ${border} bg-white/[0.03] backdrop-blur-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-lg font-semibold text-[#d4a853] mb-3">{children}</h4>;
}

function InfoParagraph({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-300 leading-relaxed mb-4">{children}</p>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SHADBALA INTERPRETATION
// ═══════════════════════════════════════════════════════════════════════════════

interface ShadbalaInterpretationProps {
  shadbala: ShadBalaComplete[];
  planets: PlanetPosition[];
  locale: string;
}

export function ShadbalaInterpretation({ shadbala, planets, locale }: ShadbalaInterpretationProps) {
  const isHi = locale !== 'en';

  const sorted = useMemo(() => {
    return [...shadbala].sort((a, b) => b.rupas - a.rupas);
  }, [shadbala]);

  const strongest = sorted[0];
  const weakPlanets = sorted.filter(p => p.rupas < 1.0);

  if (!sorted.length) return null;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'षड्बल विश्लेषण' : 'Shadbala Interpretation'}
      </h3>

      {/* Intro */}
      <SectionCard>
        <SectionHeading>{isHi ? 'इन संख्याओं का क्या अर्थ है?' : 'What do these numbers mean?'}</SectionHeading>
        <InfoParagraph>
          {isHi
            ? 'षड्बल मापता है कि आपकी कुंडली में प्रत्येक ग्रह कितना शक्तिशाली है, रूपा में मापा जाता है। एक ग्रह को प्रभावी ढंग से कार्य करने के लिए कम से कम 1.0 रूपा की आवश्यकता होती है। अधिक = अधिक बलवान परिणाम। 6 उप-घटक (स्थान, दिग्, काल, चेष्टा, नैसर्गिक, दृग्) बल के विभिन्न पहलुओं को मापते हैं।'
            : 'Shadbala measures how POWERFUL each planet is in your chart, on a scale measured in Rupas. A planet needs at least 1.0 Rupa to function effectively. Higher = stronger results. The 6 sub-components (Sthana, Dig, Kala, Cheshta, Naisargika, Drig) measure different aspects of strength.'}
        </InfoParagraph>
      </SectionCard>

      {/* Chart Captain */}
      {strongest && (
        <SectionCard border="border-emerald-500/15">
          <SectionHeading>{isHi ? 'आपकी कुंडली का सेनापति' : 'Your Chart Captain'}</SectionHeading>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
              1
            </div>
            <div>
              <p className="text-sm text-gray-200 leading-relaxed">
                {isHi
                  ? `आपका सबसे शक्तिशाली ग्रह ${pName(strongest.planetId, true)} है जिसके ${strongest.rupas.toFixed(2)} रूपा हैं। यह ग्रह आपके जीवन पर प्रभुत्व रखता है: ${PLANET_THEMES[strongest.planetId]?.strongHi ?? ''}। ${pName(strongest.planetId, true)} की महादशा में प्रबल परिणाम अपेक्षित हैं।`
                  : `Your strongest planet is ${pName(strongest.planetId, false)} with ${strongest.rupas.toFixed(2)} Rupas. This planet's themes dominate your life: ${PLANET_THEMES[strongest.planetId]?.strong ?? ''}. During ${pName(strongest.planetId, false)}'s Mahadasha, expect amplified results.`}
              </p>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Weak planets */}
      {weakPlanets.length > 0 && (
        <SectionCard border="border-amber-500/15">
          <SectionHeading>{isHi ? 'सहायता चाहिए' : 'Planets Needing Support'}</SectionHeading>
          <div className="space-y-3">
            {weakPlanets.map(wp => (
              <div key={wp.planetId} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <p className="text-sm text-gray-200">
                  <span className="font-semibold text-amber-400">{pName(wp.planetId, isHi)}</span>
                  {isHi
                    ? ` कमजोर है (${wp.rupas.toFixed(2)} रूपा)। इसका अर्थ है कि ${pName(wp.planetId, true)} के कारकत्व (जिन भावों का स्वामी है) में चुनौतियां आ सकती हैं।`
                    : ` is weak (${wp.rupas.toFixed(2)} Rupas). This means ${pName(wp.planetId, false)}'s significations (houses it rules) may face challenges.`}
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  {isHi ? 'उपाय: ' : 'Consider: '}
                  {isHi ? PLANET_REMEDIES[wp.planetId]?.hi : PLANET_REMEDIES[wp.planetId]?.en}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Strength ranking */}
      <SectionCard>
        <SectionHeading>{isHi ? 'बल क्रमांकन' : 'Strength Ranking'}</SectionHeading>
        <div className="space-y-2">
          {sorted.map((sb, i) => {
            const isStrong = sb.rupas >= 1.0;
            const themes = PLANET_THEMES[sb.planetId];
            const implication = isStrong
              ? (isHi ? themes?.strongHi : themes?.strong)
              : (isHi ? themes?.weakHi : themes?.weak);
            return (
              <div key={sb.planetId} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="w-6 text-center text-xs text-gray-500 font-mono">{i + 1}</span>
                <span className={`w-20 font-semibold text-sm ${isStrong ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {pName(sb.planetId, isHi)}
                </span>
                <span className="w-16 text-xs text-gray-400 font-mono">{sb.rupas.toFixed(2)} R</span>
                <span className="text-xs text-gray-400 flex-1">{implication}</span>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. YOGAS INTERPRETATION
// ═══════════════════════════════════════════════════════════════════════════════

interface YogasInterpretationProps {
  yogas: YogaComplete[];
  locale: string;
}

export function YogasInterpretation({ yogas, locale }: YogasInterpretationProps) {
  const isHi = locale !== 'en';

  const present = yogas.filter(y => y.present);
  const auspicious = present.filter(y => y.isAuspicious);
  const inauspicious = present.filter(y => !y.isAuspicious);
  const mixed = present.filter(y => y.category === 'other');

  if (!present.length) return null;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'योग विश्लेषण' : 'Yogas Interpretation'}
      </h3>

      {/* Summary */}
      <SectionCard>
        <SectionHeading>{isHi ? 'सारांश' : 'Summary'}</SectionHeading>
        <InfoParagraph>
          {isHi
            ? `आपकी कुंडली में ${present.length} योग पाए गए: ${auspicious.length} शुभ, ${inauspicious.length} अशुभ, ${mixed.length} मिश्रित।`
            : `Your chart has ${present.length} yogas detected: ${auspicious.length} auspicious, ${inauspicious.length} inauspicious, ${mixed.length} mixed.`}
        </InfoParagraph>
      </SectionCard>

      {/* Auspicious Yogas */}
      {auspicious.length > 0 && (
        <SectionCard border="border-emerald-500/15">
          <SectionHeading>{isHi ? 'शुभ योग' : 'Top Auspicious Yogas'}</SectionHeading>
          <div className="space-y-4">
            {auspicious.map(y => (
              <div key={y.id} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-emerald-400 text-sm">{isHi ? y.name.hi : y.name.en}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    y.strength === 'Strong' ? 'bg-emerald-500/20 text-emerald-300' :
                    y.strength === 'Moderate' ? 'bg-sky-500/20 text-sky-300' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {y.strength}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-1">
                  <span className="text-gray-500">{isHi ? 'आपके लिए अर्थ: ' : 'What it means for you: '}</span>
                  {isHi ? y.description.hi : y.description.en}
                </p>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-500">{isHi ? 'निर्माण नियम: ' : 'Formation: '}</span>
                  {isHi ? y.formationRule.hi : y.formationRule.en}
                </p>
                <p className="text-[11px] text-sky-400 mt-1">
                  {isHi
                    ? 'अधिकतम लाभ हेतु: इसके निर्माणकारी ग्रह की दशा में सक्रिय होता है। उस अवधि में सकारात्मक कार्य करें।'
                    : 'How to maximize: This yoga activates most during the Mahadasha of its forming planets. Take positive action during those periods.'}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Inauspicious Yogas */}
      {inauspicious.length > 0 && (
        <SectionCard border="border-amber-500/15">
          <SectionHeading>{isHi ? 'अशुभ योग एवं उपाय' : 'Inauspicious Yogas & What To Do'}</SectionHeading>
          <div className="space-y-4">
            {inauspicious.map(y => (
              <div key={y.id} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-amber-400 text-sm">{isHi ? y.name.hi : y.name.en}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    y.strength === 'Strong' ? 'bg-red-500/20 text-red-300' :
                    y.strength === 'Moderate' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {y.strength}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-1">
                  <span className="text-gray-500">{isHi ? 'संकेत: ' : 'What this indicates: '}</span>
                  {isHi ? y.description.hi : y.description.en}
                </p>
                <p className="text-xs text-emerald-400/80 italic mb-1">
                  {isHi
                    ? 'यह कोई श्राप नहीं है — यह एक कार्मिक प्रारूप है जिस पर कार्य किया जा सकता है।'
                    : 'This is NOT a curse — it\'s a karmic pattern that can be worked with.'}
                </p>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-500">{isHi ? 'निर्माण: ' : 'Formation: '}</span>
                  {isHi ? y.formationRule.hi : y.formationRule.en}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Common Yoga Remedies Table */}
      <SectionCard border="border-emerald-500/15">
        <SectionHeading>{isHi ? 'सामान्य योग उपाय' : 'Common Yoga Remedies'}</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-2 text-gray-400 font-medium">{isHi ? 'योग' : 'Yoga'}</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">{isHi ? 'समस्या' : 'Issue'}</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">{isHi ? 'उपाय' : 'Remedy'}</th>
              </tr>
            </thead>
            <tbody>
              {COMMON_YOGA_REMEDIES.map(r => (
                <tr key={r.yoga} className="border-b border-white/5">
                  <td className="py-2 px-2 text-[#d4a853] font-medium">{r.yoga}</td>
                  <td className="py-2 px-2 text-gray-300">{isHi ? r.issueHi : r.issue}</td>
                  <td className="py-2 px-2 text-emerald-400/80">{isHi ? r.remedyHi : r.remedy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. AVASTHAS INTERPRETATION
// ═══════════════════════════════════════════════════════════════════════════════

interface AvasthasInterpretationProps {
  avasthas: PlanetAvasthas[];
  planets: PlanetPosition[];
  locale: string;
}

export function AvasthasInterpretation({ avasthas, planets, locale }: AvasthasInterpretationProps) {
  const isHi = locale !== 'en';

  if (!avasthas.length) return null;

  // Build a combined personality sketch for each planet
  function buildSketch(av: PlanetAvasthas): string {
    const name = pName(av.planetId, isHi);
    const baladi = isHi ? av.baladi.name.hi : av.baladi.name.en;
    const deeptadi = isHi ? av.deeptadi.name.hi : av.deeptadi.name.en;
    const lajjitadi = isHi ? av.lajjitadi.name.hi : av.lajjitadi.name.en;
    const jagradadi = isHi ? av.jagradadi.name.hi : av.jagradadi.name.en;

    // Determine overall quality
    const avgStrength = (av.baladi.strength + av.deeptadi.luminosity) / 2;
    const quality = avgStrength >= 70 ? (isHi ? 'बलवान' : 'strong') :
                    avgStrength >= 40 ? (isHi ? 'मिश्रित' : 'mixed') :
                    (isHi ? 'कमजोर' : 'weak');
    const flavor = av.lajjitadi.effect === 'benefic' ? (isHi ? 'शुभ' : 'positive') :
                   av.lajjitadi.effect === 'malefic' ? (isHi ? 'कठिन' : 'challenging') :
                   (isHi ? 'तटस्थ' : 'neutral');

    if (isHi) {
      return `आपका ${name} ${baladi} अवस्था (आयु), ${deeptadi} (दीप्ति), ${lajjitadi} (भावनात्मक), ${jagradadi} (जागृति) में है। संयुक्त अर्थ: ${name} ${quality} परिणाम ${flavor} स्वभाव के साथ देता है।`;
    }
    return `Your ${name} is in ${baladi} state (age), ${deeptadi} (luminosity), ${lajjitadi} (emotional), ${jagradadi} (wakefulness). Combined meaning: ${name} delivers ${quality} results with a ${flavor} flavor.`;
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'अवस्था विश्लेषण' : 'Avasthas Interpretation'}
      </h3>

      {/* What are Avasthas? */}
      <SectionCard>
        <SectionHeading>{isHi ? 'अवस्था क्या हैं?' : 'What are Avasthas?'}</SectionHeading>
        <InfoParagraph>
          {isHi
            ? 'अवस्थाएं बताती हैं कि प्रत्येक ग्रह किस मनोदशा और गुणवत्ता के साथ अपने परिणाम देता है। इसे ऐसे समझें: एक ग्रह "शक्तिशाली" (षड्बल) हो सकता है लेकिन "क्रोधित" (अवस्था) — वह परिणाम देगा, लेकिन कठोर तरीके से।'
            : 'Avasthas describe the MOOD and QUALITY of how each planet delivers its results. Think of it like this: a planet can be "powerful" (Shadbala) but "angry" (Avastha) — it will give results, but in a harsh way.'}
        </InfoParagraph>
      </SectionCard>

      {/* Per-planet personality sketch */}
      <SectionCard border="border-sky-500/15">
        <SectionHeading>{isHi ? 'ग्रह अवस्था सारांश' : 'Planet Avastha Summary'}</SectionHeading>
        <div className="space-y-3">
          {avasthas.map(av => {
            const avgStrength = (av.baladi.strength + av.deeptadi.luminosity) / 2;
            const colorClass = avgStrength >= 70 ? 'border-emerald-500/15 bg-emerald-500/5' :
                               avgStrength >= 40 ? 'border-sky-500/15 bg-sky-500/5' :
                               'border-amber-500/15 bg-amber-500/5';
            return (
              <div key={av.planetId} className={`p-3 rounded-lg border ${colorClass}`}>
                <span className="font-semibold text-sm text-[#d4a853]">{pName(av.planetId, isHi)}</span>
                <p className="text-xs text-gray-300 leading-relaxed mt-1">{buildSketch(av)}</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Quick Reference Table */}
      <SectionCard>
        <SectionHeading>{isHi ? 'त्वरित संदर्भ' : 'Quick Reference Table'}</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-2 text-gray-400 font-medium">{isHi ? 'अवस्था' : 'State'}</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">{isHi ? 'अर्थ' : 'Meaning'}</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">{isHi ? 'शुभ?' : 'Good?'}</th>
                <th className="text-left py-2 px-2 text-gray-400 font-medium">{isHi ? 'परिणामों पर प्रभाव' : 'Effect on Results'}</th>
              </tr>
            </thead>
            <tbody>
              {AVASTHA_REFERENCE.map(r => (
                <tr key={r.state} className="border-b border-white/5">
                  <td className="py-2 px-2 text-[#d4a853] font-medium">{r.state}</td>
                  <td className="py-2 px-2 text-gray-300">{isHi ? r.meaningHi : r.meaning}</td>
                  <td className="py-2 px-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      r.good === 'Best' ? 'bg-emerald-500/20 text-emerald-300' :
                      r.good === 'Great' || r.good === 'Good' ? 'bg-sky-500/20 text-sky-300' :
                      r.good === 'Neutral' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {r.good}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-gray-400">{isHi ? r.effectHi : r.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. BHAVABALA INTERPRETATION
// ═══════════════════════════════════════════════════════════════════════════════

interface BhavabalaInterpretationProps {
  bhavabala: BhavaBalaResult[];
  locale: string;
}

export function BhavabalaInterpretation({ bhavabala, locale }: BhavabalaInterpretationProps) {
  const isHi = locale !== 'en';

  const sorted = useMemo(() => {
    return [...bhavabala].sort((a, b) => b.total - a.total);
  }, [bhavabala]);

  if (!sorted.length) return null;

  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const strongSig = HOUSE_SIGNIFICATIONS[strongest.bhava];
  const weakSig = HOUSE_SIGNIFICATIONS[weakest.bhava];

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'भावबल विश्लेषण' : 'Bhavabala Interpretation'}
      </h3>

      {/* Strongest house */}
      <SectionCard border="border-emerald-500/15">
        <SectionHeading>{isHi ? 'सबसे बलवान जीवन क्षेत्र' : 'Strongest Life Area'}</SectionHeading>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
            {strongest.bhava}
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">
            {isHi
              ? `आपका सबसे बलवान भाव ${strongest.bhava}वां भाव है (${strongSig?.hi ?? ''})। यही वह क्षेत्र है जहां जीवन सबसे सहज रूप से आता है।`
              : `Your strongest house is House ${strongest.bhava} (${strongSig?.en ?? ''}). This is where life comes most easily to you.`}
          </p>
        </div>
      </SectionCard>

      {/* Weakest house */}
      <SectionCard border="border-amber-500/15">
        <SectionHeading>{isHi ? 'सबसे कमजोर जीवन क्षेत्र' : 'Weakest Life Area'}</SectionHeading>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
            {weakest.bhava}
          </div>
          <div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {isHi
                ? `आपका सबसे कमजोर भाव ${weakest.bhava}वां भाव है (${weakSig?.hi ?? ''})। इस क्षेत्र में सचेत प्रयास की आवश्यकता है।`
                : `Your weakest house is House ${weakest.bhava} (${weakSig?.en ?? ''}). This area needs conscious effort.`}
            </p>
            <p className="text-xs text-emerald-400 mt-1">
              {isHi ? 'उपाय: ' : 'Remedies: '}
              {isHi ? weakSig?.remedy_hi : weakSig?.remedy_en}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* House ranking */}
      <SectionCard>
        <SectionHeading>{isHi ? 'भाव बल क्रमांकन' : 'House Strength Ranking'}</SectionHeading>
        <div className="space-y-2">
          {sorted.map((bh, i) => {
            const sig = HOUSE_SIGNIFICATIONS[bh.bhava];
            const isTop = i < 4;
            return (
              <div key={bh.bhava} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="w-6 text-center text-xs text-gray-500 font-mono">{i + 1}</span>
                <span className={`w-20 font-semibold text-sm ${isTop ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {isHi ? `भाव ${bh.bhava}` : `House ${bh.bhava}`}
                </span>
                <span className="w-16 text-xs text-gray-400 font-mono">{bh.total.toFixed(1)}</span>
                <span className="text-xs text-gray-400 flex-1">{isHi ? sig?.hi : sig?.en}</span>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
