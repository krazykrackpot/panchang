'use client';

import { useMemo } from 'react';
import type { PlanetPosition } from '@/types/kundali';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { PlanetAvasthas } from '@/lib/kundali/avasthas';
import HouseVisual, { HouseBadge } from './HouseVisual';

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
        <div className="flex items-start gap-4">
          <HouseVisual highlight={strongest.bhava} color="emerald" size="md" label={isHi ? 'बलवान' : 'Strong'} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HouseBadge house={strongest.bhava} locale={locale} color="emerald" />
              <span className="text-emerald-300 text-xs font-bold">{strongest.total.toFixed(1)} {isHi ? 'अंक' : 'pts'}</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {isHi
                ? `आपका सबसे बलवान भाव ${strongest.bhava}वां भाव है (${strongSig?.hi ?? ''})। यही वह क्षेत्र है जहां जीवन सबसे सहज रूप से आता है। इस भाव से जुड़े कार्यों में आपको स्वाभाविक सफलता मिलती है।`
                : `Your strongest house is House ${strongest.bhava} (${strongSig?.en ?? ''}). This is where life comes most easily to you. Activities related to this house bring natural success with less effort.`}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Weakest house */}
      <SectionCard border="border-amber-500/15">
        <SectionHeading>{isHi ? 'सबसे कमजोर जीवन क्षेत्र' : 'Weakest Life Area'}</SectionHeading>
        <div className="flex items-start gap-4">
          <HouseVisual highlight={weakest.bhava} color="amber" size="md" label={isHi ? 'कमजोर' : 'Weak'} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HouseBadge house={weakest.bhava} locale={locale} color="amber" />
              <span className="text-amber-300 text-xs font-bold">{weakest.total.toFixed(1)} {isHi ? 'अंक' : 'pts'}</span>
            </div>
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

      {/* Visual overview — all 12 houses */}
      <SectionCard border="border-sky-500/15">
        <SectionHeading>{isHi ? 'भाव बल दृश्य अवलोकन' : 'House Strength Visual Overview'}</SectionHeading>
        <p className="text-xs text-gray-400 mb-3">
          {isHi ? 'हरा = बलवान, पीला = मध्यम, लाल = कमजोर। प्रत्येक भाव जीवन के एक क्षेत्र को दर्शाता है।' : 'Green = strong, Yellow = moderate, Red = weak. Each house represents a life area.'}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {sorted.map(h => {
            const sig = HOUSE_SIGNIFICATIONS[h.bhava];
            const strength = h.total;
            const max = sorted[0].total;
            const pct = max > 0 ? strength / max : 0;
            const barColor = pct >= 0.7 ? 'bg-emerald-500' : pct >= 0.4 ? 'bg-amber-500' : 'bg-red-500';
            return (
              <div key={h.bhava} className="glass-card rounded-lg p-2 w-[72px] text-center border border-gold-primary/10">
                <div className="text-gold-light font-bold text-sm">H{h.bhava}</div>
                <div className="text-text-tertiary text-[9px]">{isHi ? sig?.hi : sig?.en}</div>
                <div className="w-full h-1.5 bg-bg-tertiary/50 rounded-full mt-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct * 100}%` }} />
                </div>
                <div className="text-[9px] text-text-tertiary mt-0.5">{strength.toFixed(0)}</div>
              </div>
            );
          })}
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
                <HouseBadge house={bh.bhava} locale={locale} color={isTop ? 'emerald' : 'gold'} />
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

// ═══════════════════════════════════════════════════════════════════════════════
// 5. PLANETS INTERPRETATION — Beginner-friendly chart overview
// ═══════════════════════════════════════════════════════════════════════════════

const LAGNA_SKETCHES: Record<number, { en: string; hi: string }> = {
  1:  { en: 'Bold, independent, action-oriented leader', hi: 'साहसी, स्वतंत्र, कर्मप्रधान नेता' },
  2:  { en: 'Stable, patient, values comfort and security', hi: 'स्थिर, धैर्यवान, सुख और सुरक्षा को महत्व देने वाले' },
  3:  { en: 'Curious, communicative, intellectually agile', hi: 'जिज्ञासु, संवादशील, बौद्धिक रूप से चुस्त' },
  4:  { en: 'Nurturing, emotionally deep, home-oriented', hi: 'पोषणकर्ता, भावनात्मक रूप से गहरे, गृह-केंद्रित' },
  5:  { en: 'Charismatic, confident, creative, seeks recognition', hi: 'करिश्माई, आत्मविश्वासी, रचनात्मक, मान्यता के इच्छुक' },
  6:  { en: 'Analytical, detail-oriented, service-minded', hi: 'विश्लेषणात्मक, विस्तार-उन्मुख, सेवा-भावी' },
  7:  { en: 'Diplomatic, relationship-focused, aesthetic sense', hi: 'कूटनीतिक, संबंध-केंद्रित, सौंदर्य बोध' },
  8:  { en: 'Intense, transformative, deep researcher', hi: 'तीव्र, परिवर्तनकारी, गहन शोधकर्ता' },
  9:  { en: 'Adventurous, philosophical, freedom-loving', hi: 'साहसिक, दार्शनिक, स्वतंत्रता-प्रेमी' },
  10: { en: 'Disciplined, ambitious, practical, career-focused', hi: 'अनुशासित, महत्वाकांक्षी, व्यावहारिक, करियर-केंद्रित' },
  11: { en: 'Innovative, humanitarian, independent thinker', hi: 'नवोन्मेषी, मानवतावादी, स्वतंत्र विचारक' },
  12: { en: 'Intuitive, spiritual, compassionate, creative', hi: 'अंतर्ज्ञानी, आध्यात्मिक, करुणामय, रचनात्मक' },
};

const RASHI_NAMES_EN = ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const RASHI_NAMES_HI = ['', 'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];

const PLANET_NAMES_FULL_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_NAMES_FULL_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'राहु', 'केतु'];

function pNameFull(id: number, isHi: boolean): string {
  return isHi ? (PLANET_NAMES_FULL_HI[id] ?? `ग्रह ${id}`) : (PLANET_NAMES_FULL_EN[id] ?? `Planet ${id}`);
}

interface PlanetsInterpretationProps {
  planets: PlanetPosition[];
  ascendant: { sign: number; signName: { en: string; hi: string } };
  locale: string;
}

export function PlanetsInterpretation({ planets, ascendant, locale }: PlanetsInterpretationProps) {
  const isHi = locale !== 'en';

  const moonPlanet = planets.find(p => p.planet.id === 1);
  const exalted = planets.filter(p => p.isExalted);
  const debilitated = planets.filter(p => p.isDebilitated);
  const retrograde = planets.filter(p => p.isRetrograde);
  const ownSign = planets.filter(p => p.isOwnSign);
  const combust = planets.filter(p => p.isCombust);

  const lagnaSketch = LAGNA_SKETCHES[ascendant.sign];
  const lagnaName = isHi ? ascendant.signName.hi : ascendant.signName.en;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'ग्रह विश्लेषण' : 'Planets Interpretation'}
      </h3>

      {/* Intro */}
      <SectionCard>
        <SectionHeading>{isHi ? 'आपकी कुंडली एक नज़र में' : 'Your Chart at a Glance'}</SectionHeading>
        <InfoParagraph>
          {isHi
            ? 'यह आपकी जन्म कुंडली की प्रमुख विशेषताओं का सरल सारांश है। यह समझने का सबसे आसान तरीका है कि आपके ग्रह क्या कहते हैं।'
            : 'This is a beginner-friendly summary of your birth chart\'s key features. It\'s the simplest way to understand what your planets are telling you.'}
        </InfoParagraph>
      </SectionCard>

      {/* Lagna */}
      <SectionCard border="border-emerald-500/15">
        <SectionHeading>{isHi ? 'लग्न (उदय राशि)' : 'Lagna (Ascendant)'}</SectionHeading>
        <p className="text-sm text-gray-200 leading-relaxed">
          {isHi
            ? `आपका लग्न ${lagnaName} है। यह आपकी "उदय राशि" है — दुनिया आपको ऐसे देखती है। ${lagnaSketch?.hi ?? ''}`
            : `Your Lagna is ${lagnaName}. This is your 'rising sign' — how the world sees you. ${lagnaSketch?.en ?? ''}`}
        </p>
      </SectionCard>

      {/* Moon Sign */}
      {moonPlanet && (
        <SectionCard border="border-sky-500/15">
          <SectionHeading>{isHi ? 'चन्द्र राशि' : 'Moon Sign (Rashi)'}</SectionHeading>
          <p className="text-sm text-gray-200 leading-relaxed">
            {isHi
              ? `आपका चन्द्रमा ${RASHI_NAMES_HI[moonPlanet.sign] ?? moonPlanet.signName.hi} राशि में है। यह आपका भावनात्मक केंद्र है — आप कैसा महसूस करते हैं, क्या आपको सुकून देता है। ${LAGNA_SKETCHES[moonPlanet.sign]?.hi ?? ''}`
              : `Your Moon is in ${RASHI_NAMES_EN[moonPlanet.sign] ?? moonPlanet.signName.en}. This is your emotional core — how you FEEL, what gives you comfort. ${LAGNA_SKETCHES[moonPlanet.sign]?.en ?? ''}`}
          </p>
        </SectionCard>
      )}

      {/* Key Dignities */}
      {(exalted.length > 0 || debilitated.length > 0 || retrograde.length > 0 || ownSign.length > 0) && (
        <SectionCard border="border-sky-500/15">
          <SectionHeading>{isHi ? 'प्रमुख गरिमाएं' : 'Key Dignities'}</SectionHeading>
          <div className="space-y-3">
            {exalted.map(p => (
              <div key={`ex-${p.planet.id}`} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-emerald-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` उच्च है — अत्यंत बलवान। ${pNameFull(p.planet.id, true)} के कारकत्वों से उत्कृष्ट परिणाम अपेक्षित हैं।`
                    : ` is exalted — extremely strong. Expect excellent results from ${pNameFull(p.planet.id, false)}'s significations.`}
                </p>
              </div>
            ))}
            {debilitated.map(p => (
              <div key={`deb-${p.planet.id}`} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-amber-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` नीच है — चुनौतीपूर्ण। ${pNameFull(p.planet.id, true)} के विषयों में बाधाएं आ सकती हैं। नीच भंग (निरस्तीकरण) की जांच करें।`
                    : ` is debilitated — challenged. ${pNameFull(p.planet.id, false)}'s themes may face obstacles. Check for Neecha Bhanga (cancellation).`}
                </p>
              </div>
            ))}
            {ownSign.map(p => (
              <div key={`own-${p.planet.id}`} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-emerald-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` अपनी ही राशि में है — सहज और स्वाभाविक। मजबूत, विश्वसनीय परिणाम।`
                    : ` is in its own sign — comfortable and natural. Strong, reliable results.`}
                </p>
              </div>
            ))}
            {retrograde.map(p => (
              <div key={`ret-${p.planet.id}`} className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-sky-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` वक्री है — आंतरिक ऊर्जा। परिणाम पुनर्विचार, पुनरावलोकन और गहन प्रयास से आते हैं।`
                    : ` is retrograde — internalized energy. Results come through revisiting, rethinking, and deeper effort.`}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Combustion warning */}
      {combust.length > 0 && (
        <SectionCard border="border-amber-500/15">
          <SectionHeading>{isHi ? 'अस्त ग्रह चेतावनी' : 'Combustion Warning'}</SectionHeading>
          <div className="space-y-2">
            {combust.map(p => (
              <div key={`comb-${p.planet.id}`} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-amber-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` सूर्य के बहुत निकट है (अस्त) — इसके कारकत्व सूर्य की छाया में आ सकते हैं।`
                    : ` is too close to the Sun (combust) — its significations may be overshadowed.`}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. DASHA INTERPRETATION — Current life chapter
// ═══════════════════════════════════════════════════════════════════════════════

const MAHADASHA_THEMES: Record<string, { en: string; hi: string }> = {
  Ketu:    { en: 'Spiritual growth, detachment from material pursuits, past karma resolving. You may feel restless or disconnected. Embrace meditation, spiritual practices, and letting go.', hi: 'आध्यात्मिक विकास, भौतिक सुखों से वैराग्य, पिछले कर्मों का फल। आप बेचैन या अलग-थलग महसूस कर सकते हैं। ध्यान, आध्यात्मिक साधना और त्याग को अपनाएं।' },
  Venus:   { en: 'Relationships, marriage, luxury, creativity flourish. This is a time for partnerships, artistic pursuits, and enjoying life\'s comforts. Invest in relationships.', hi: 'संबंध, विवाह, विलासिता, रचनात्मकता फलती-फूलती है। यह साझेदारी, कलात्मक कार्यों और जीवन के सुखों का समय है। संबंधों में निवेश करें।' },
  Sun:     { en: 'Career recognition, authority, leadership. Father-related matters prominent. Focus on your public role and professional growth.', hi: 'करियर में मान्यता, अधिकार, नेतृत्व। पिता से संबंधित मामले प्रमुख। अपनी सार्वजनिक भूमिका और पेशेवर विकास पर ध्यान दें।' },
  Moon:    { en: 'Emotional depth, mother\'s influence, travel, public image. Nurture your mental health, connect with family, explore new places.', hi: 'भावनात्मक गहराई, माता का प्रभाव, यात्रा, सार्वजनिक छवि। मानसिक स्वास्थ्य का ध्यान रखें, परिवार से जुड़ें, नए स्थानों की खोज करें।' },
  Mars:    { en: 'Action, property, courage, technical pursuits. Energy is high. Good for real estate, sports, engineering. Watch for conflicts and impatience.', hi: 'कार्यवाही, संपत्ति, साहस, तकनीकी कार्य। ऊर्जा उच्च है। अचल संपत्ति, खेल, इंजीनियरिंग के लिए अच्छा। संघर्ष और अधीरता से बचें।' },
  Rahu:    { en: 'Unconventional growth, foreign connections, technology, ambition. Life may feel chaotic but opportunities abound. Embrace change, avoid shortcuts.', hi: 'अपरंपरागत विकास, विदेशी संबंध, प्रौद्योगिकी, महत्वाकांक्षा। जीवन अराजक लग सकता है लेकिन अवसर प्रचुर हैं। परिवर्तन अपनाएं, शॉर्टकट से बचें।' },
  Jupiter: { en: 'Wisdom, education, children, spiritual growth, wealth. The most benevolent period. Teach, learn, expand. Good for higher studies and dharma.', hi: 'ज्ञान, शिक्षा, संतान, आध्यात्मिक विकास, धन। सबसे शुभ काल। पढ़ाएं, सीखें, विस्तार करें। उच्च शिक्षा और धर्म के लिए उत्तम।' },
  Saturn:  { en: 'Discipline, hard work, career building, responsibility. Slow but lasting results. Build structures, face karma, earn respect through effort.', hi: 'अनुशासन, कठिन परिश्रम, करियर निर्माण, जिम्मेदारी। धीमे लेकिन स्थायी परिणाम। संरचनाएं बनाएं, कर्म का सामना करें, प्रयास से सम्मान अर्जित करें।' },
  Mercury: { en: 'Business, communication, intellect, skills. Start ventures, write, network. Good for education, commerce, and analytical work.', hi: 'व्यापार, संवाद, बुद्धि, कौशल। उद्यम शुरू करें, लिखें, नेटवर्क बनाएं। शिक्षा, वाणिज्य और विश्लेषणात्मक कार्य के लिए अच्छा।' },
};

const DASHA_DURATIONS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

interface DashaInterpretationProps {
  dashas: any[];
  planets: PlanetPosition[];
  locale: string;
}

export function DashaInterpretation({ dashas, planets, locale }: DashaInterpretationProps) {
  const isHi = locale !== 'en';

  const { currentMaha, currentAntar, nextMaha } = useMemo(() => {
    const now = new Date();
    let maha: any = null;
    let antar: any = null;
    let next: any = null;

    for (let i = 0; i < dashas.length; i++) {
      const d = dashas[i];
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      if (now >= start && now <= end) {
        maha = d;
        if (d.subPeriods && Array.isArray(d.subPeriods)) {
          for (const sub of d.subPeriods) {
            const sStart = new Date(sub.startDate);
            const sEnd = new Date(sub.endDate);
            if (now >= sStart && now <= sEnd) {
              antar = sub;
              break;
            }
          }
        }
        if (i + 1 < dashas.length) {
          next = dashas[i + 1];
        }
        break;
      }
    }
    return { currentMaha: maha, currentAntar: antar, nextMaha: next };
  }, [dashas]);

  if (!currentMaha) return null;

  const mahaPlanet = currentMaha.planet || (isHi ? currentMaha.planetName?.hi : currentMaha.planetName?.en) || 'Unknown';
  const mahaTheme = MAHADASHA_THEMES[mahaPlanet];
  const mahaDuration = DASHA_DURATIONS[mahaPlanet] ?? '?';

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isHi ? 'hi-IN' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'दशा विश्लेषण' : 'Dasha Interpretation'}
      </h3>

      {/* Current Chapter */}
      <SectionCard border="border-emerald-500/15">
        <SectionHeading>{isHi ? 'आपका वर्तमान अध्याय' : 'Your Current Chapter'}</SectionHeading>
        <p className="text-sm text-gray-200 leading-relaxed mb-3">
          {isHi
            ? `आप वर्तमान में ${mahaPlanet} महादशा में हैं (${formatDate(currentMaha.startDate)} से ${formatDate(currentMaha.endDate)})। यह ${mahaDuration} वर्षों की अवधि है जो ${mahaPlanet} के विषयों से प्रभावित है।`
            : `You are currently in ${mahaPlanet} Mahadasha (${formatDate(currentMaha.startDate)} to ${formatDate(currentMaha.endDate)}). This is a ${mahaDuration}-year period dominated by ${mahaPlanet}'s themes.`}
        </p>
      </SectionCard>

      {/* What this means */}
      {mahaTheme && (
        <SectionCard border="border-sky-500/15">
          <SectionHeading>{isHi ? 'आपके लिए इसका क्या अर्थ है' : 'What this means for you'}</SectionHeading>
          <p className="text-sm text-gray-200 leading-relaxed">
            {isHi ? mahaTheme.hi : mahaTheme.en}
          </p>
        </SectionCard>
      )}

      {/* Current Antardasha */}
      {currentAntar && (
        <SectionCard border="border-sky-500/15">
          <SectionHeading>{isHi ? 'वर्तमान अन्तर्दशा' : 'Current Antardasha'}</SectionHeading>
          <p className="text-sm text-gray-200 leading-relaxed">
            {(() => {
              const antarPlanet = currentAntar.planet || (isHi ? currentAntar.planetName?.hi : currentAntar.planetName?.en) || 'Unknown';
              const antarTheme = MAHADASHA_THEMES[antarPlanet];
              return isHi
                ? `इसमें, आप ${mahaPlanet}-${antarPlanet} अन्तर्दशा में हैं (${formatDate(currentAntar.startDate)} से ${formatDate(currentAntar.endDate)})। ${mahaPlanet} के व्यापक विषयों में ${antarPlanet} की ऊर्जा मिलती है${antarTheme ? `: ${antarTheme.hi.split('.')[0]}.` : '।'}`
                : `Within this, you're in ${mahaPlanet}-${antarPlanet} Antardasha (${formatDate(currentAntar.startDate)} to ${formatDate(currentAntar.endDate)}). ${antarPlanet}'s energy blends with ${mahaPlanet}'s broader themes${antarTheme ? `: ${antarTheme.en.split('.')[0]}.` : '.'}`;
            })()}
          </p>
        </SectionCard>
      )}

      {/* Next Transition */}
      {nextMaha && (
        <SectionCard border="border-amber-500/15">
          <SectionHeading>{isHi ? 'अगला परिवर्तन' : 'Next Transition'}</SectionHeading>
          <p className="text-sm text-gray-200 leading-relaxed">
            {(() => {
              const nextPlanet = nextMaha.planet || (isHi ? nextMaha.planetName?.hi : nextMaha.planetName?.en) || 'Unknown';
              return isHi
                ? `आपकी अगली महादशा: ${nextPlanet} ${formatDate(nextMaha.startDate)} से शुरू होगी। जीवन के विषयों में बदलाव के लिए तैयार रहें।`
                : `Your next Mahadasha change: ${nextPlanet} starts on ${formatDate(nextMaha.startDate)}. Prepare for a shift in life themes.`;
            })()}
          </p>
        </SectionCard>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. JAIMINI INTERPRETATION — Soul's purpose via Chara Karakas
// ═══════════════════════════════════════════════════════════════════════════════

const AK_THEMES: Record<string, { en: string; hi: string }> = {
  Sun:     { en: 'Your soul seeks recognition, authority, and self-expression', hi: 'आपकी आत्मा मान्यता, अधिकार और आत्म-अभिव्यक्ति चाहती है' },
  Moon:    { en: 'Your soul seeks emotional connection, nurturing, and peace', hi: 'आपकी आत्मा भावनात्मक संबंध, पोषण और शांति चाहती है' },
  Mars:    { en: 'Your soul seeks courage, action, and the ability to protect', hi: 'आपकी आत्मा साहस, कार्यवाही और रक्षा की क्षमता चाहती है' },
  Mercury: { en: 'Your soul seeks knowledge, communication, and intellectual mastery', hi: 'आपकी आत्मा ज्ञान, संवाद और बौद्धिक निपुणता चाहती है' },
  Jupiter: { en: 'Your soul seeks wisdom, teaching, and spiritual growth', hi: 'आपकी आत्मा ज्ञान, शिक्षण और आध्यात्मिक विकास चाहती है' },
  Venus:   { en: 'Your soul seeks love, beauty, and harmonious relationships', hi: 'आपकी आत्मा प्रेम, सौंदर्य और सामंजस्यपूर्ण संबंध चाहती है' },
  Saturn:  { en: 'Your soul seeks discipline, service, and karmic completion', hi: 'आपकी आत्मा अनुशासन, सेवा और कार्मिक पूर्णता चाहती है' },
};

const AMK_THEMES: Record<string, { en: string; hi: string }> = {
  Sun:     { en: 'Government, leadership, administration', hi: 'सरकार, नेतृत्व, प्रशासन' },
  Moon:    { en: 'Public service, nursing, hospitality, psychology', hi: 'जनसेवा, नर्सिंग, आतिथ्य, मनोविज्ञान' },
  Mars:    { en: 'Military, engineering, surgery, real estate', hi: 'सेना, इंजीनियरिंग, शल्य चिकित्सा, अचल संपत्ति' },
  Mercury: { en: 'Writing, business, accounting, IT, teaching', hi: 'लेखन, व्यापार, लेखाकरण, आईटी, शिक्षण' },
  Jupiter: { en: 'Teaching, law, priesthood, counseling', hi: 'शिक्षण, कानून, पुरोहित, परामर्श' },
  Venus:   { en: 'Arts, entertainment, luxury goods, fashion', hi: 'कला, मनोरंजन, विलासिता सामग्री, फैशन' },
  Saturn:  { en: 'Labor, mining, agriculture, social work', hi: 'श्रम, खनन, कृषि, सामाजिक कार्य' },
};

const DK_THEMES: Record<string, { en: string; hi: string }> = {
  Sun:     { en: 'Authoritative, career-oriented, dignified spouse', hi: 'अधिकारपूर्ण, करियर-उन्मुख, प्रतिष्ठित जीवनसाथी' },
  Moon:    { en: 'Nurturing, emotional, caring spouse', hi: 'पोषणकारी, भावनात्मक, देखभाल करने वाले जीवनसाथी' },
  Mars:    { en: 'Energetic, assertive, passionate spouse', hi: 'ऊर्जावान, मुखर, जुनूनी जीवनसाथी' },
  Mercury: { en: 'Intellectual, communicative, youthful spouse', hi: 'बुद्धिमान, संवादशील, युवा जीवनसाथी' },
  Jupiter: { en: 'Wise, religious, generous, well-educated spouse', hi: 'बुद्धिमान, धार्मिक, उदार, सुशिक्षित जीवनसाथी' },
  Venus:   { en: 'Beautiful, artistic, romantic, luxury-loving spouse', hi: 'सुंदर, कलात्मक, रोमांटिक, विलासिता-प्रेमी जीवनसाथी' },
  Saturn:  { en: 'Mature, responsible, hardworking, older spouse', hi: 'परिपक्व, जिम्मेदार, मेहनती, बड़ी उम्र के जीवनसाथी' },
};

interface JaiminiInterpretationProps {
  jaimini: any;
  locale: string;
}

export function JaiminiInterpretation({ jaimini, locale }: JaiminiInterpretationProps) {
  const isHi = locale !== 'en';

  if (!jaimini) return null;

  const karakas = jaimini.charaKarakas || jaimini.karakas || [];
  const findKaraka = (role: string) => {
    if (Array.isArray(karakas)) {
      return karakas.find((k: any) => k.karaka === role || k.role === role || k.type === role);
    }
    return karakas[role] ?? null;
  };

  const atmakaraka = findKaraka('Atmakaraka') || findKaraka('AK');
  const amatyakaraka = findKaraka('Amatyakaraka') || findKaraka('AmK');
  const darakaraka = findKaraka('Darakaraka') || findKaraka('DK');

  const getPlanetName = (karaka: any): string => {
    if (!karaka) return isHi ? 'अज्ञात' : 'Unknown';
    return karaka.planet || karaka.planetName?.en || (isHi ? karaka.planetName?.hi : karaka.planetName?.en) || 'Unknown';
  };

  const akPlanet = getPlanetName(atmakaraka);
  const amkPlanet = getPlanetName(amatyakaraka);
  const dkPlanet = getPlanetName(darakaraka);

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'जैमिनी विश्लेषण' : 'Jaimini Interpretation'}
      </h3>

      {/* Atmakaraka */}
      <SectionCard border="border-emerald-500/15">
        <SectionHeading>{isHi ? 'आपकी आत्मा का उद्देश्य (आत्मकारक)' : 'Your Soul\'s Purpose (Atmakaraka)'}</SectionHeading>
        <p className="text-sm text-gray-200 leading-relaxed mb-2">
          {isHi
            ? `आपका आत्मकारक ${akPlanet} है — आपकी कुंडली में सबसे ऊंचे अंश वाला ग्रह। यह इस जन्म में आपकी आत्मा की सबसे गहरी इच्छा को दर्शाता है।`
            : `Your Atmakaraka is ${akPlanet} — the planet with the highest degree in your chart. This represents your soul's deepest desire in this life.`}
        </p>
        {AK_THEMES[akPlanet] && (
          <p className="text-sm text-emerald-400 leading-relaxed italic">
            {isHi ? AK_THEMES[akPlanet].hi : AK_THEMES[akPlanet].en}
          </p>
        )}
      </SectionCard>

      {/* Amatyakaraka */}
      <SectionCard border="border-sky-500/15">
        <SectionHeading>{isHi ? 'अमात्यकारक (करियर)' : 'Amatya Karaka (Career)'}</SectionHeading>
        <p className="text-sm text-gray-200 leading-relaxed mb-2">
          {isHi
            ? `आपका अमात्यकारक ${amkPlanet} है — यह आपकी स्वाभाविक करियर दिशा का संकेत देता है।`
            : `Your Amatya Karaka is ${amkPlanet} — indicating your natural career direction.`}
        </p>
        {AMK_THEMES[amkPlanet] && (
          <p className="text-sm text-sky-400 leading-relaxed">
            {isHi
              ? `करियर संकेत: ${AMK_THEMES[amkPlanet].hi}`
              : `Career direction: ${AMK_THEMES[amkPlanet].en}`}
          </p>
        )}
      </SectionCard>

      {/* Darakaraka */}
      <SectionCard border="border-sky-500/15">
        <SectionHeading>{isHi ? 'दारकारक (जीवनसाथी)' : 'Dara Karaka (Spouse)'}</SectionHeading>
        <p className="text-sm text-gray-200 leading-relaxed mb-2">
          {isHi
            ? `आपका दारकारक ${dkPlanet} है — सबसे कम अंश वाला ग्रह। यह आपके जीवनसाथी के स्वभाव का संकेत देता है।`
            : `Your Dara Karaka is ${dkPlanet} — the planet with the lowest degree. This indicates your spouse's nature.`}
        </p>
        {DK_THEMES[dkPlanet] && (
          <p className="text-sm text-sky-400 leading-relaxed">
            {isHi ? DK_THEMES[dkPlanet].hi : DK_THEMES[dkPlanet].en}
          </p>
        )}
      </SectionCard>
    </div>
  );
}
