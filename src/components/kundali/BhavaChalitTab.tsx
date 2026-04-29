'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { computeBhavaChalit, type BhavaChalitResult } from '@/lib/kundali/bhava-chalit';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';

interface BhavaChalitTabProps {
  ascendant: number;  // sidereal degree 0-360
  planets: Array<{ id: number; longitude: number; name?: { en?: string; hi?: string } }>;
  locale: string;
}

// ─── Planet nature descriptions (module-level, never recreated) ───────────

const PLANET_NATURE: Record<number, { en: string; hi: string }> = {
  0: {
    en: 'The Sun represents your soul, ego, vitality, authority, and sense of self. It governs leadership, father figures, government dealings, and your core identity.',
    hi: 'सूर्य आत्मा, अहंकार, जीवन शक्ति, अधिकार और आत्म-भाव का प्रतिनिधित्व करता है। यह नेतृत्व, पिता, सरकारी कार्य और आपकी मूल पहचान को नियंत्रित करता है।',
  },
  1: {
    en: 'The Moon governs your mind, emotions, mother, nurturing instinct, and inner peace. It shapes how you feel, respond emotionally, and connect with people.',
    hi: 'चन्द्रमा मन, भावनाओं, माता, पालन-पोषण और आन्तरिक शान्ति को नियंत्रित करता है। यह आपकी भावनात्मक प्रतिक्रिया और लोगों से जुड़ाव को आकार देता है।',
  },
  2: {
    en: 'Mars is your energy, courage, aggression, physical strength, and competitive drive. It governs initiative, risk-taking, siblings, and how you assert yourself.',
    hi: 'मंगल ऊर्जा, साहस, आक्रामकता, शारीरिक बल और प्रतिस्पर्धा की भावना है। यह पहल, जोखिम लेने की क्षमता, भाई-बहन और आत्म-स्थापन को नियंत्रित करता है।',
  },
  3: {
    en: 'Mercury rules intellect, communication, analytical thinking, commerce, and adaptability. It governs speech, writing, learning ability, and business acumen.',
    hi: 'बुध बुद्धि, संवाद, विश्लेषणात्मक सोच, व्यापार और अनुकूलन क्षमता को नियंत्रित करता है। यह वाणी, लेखन, सीखने की क्षमता और व्यावसायिक कुशलता पर शासन करता है।',
  },
  4: {
    en: 'Jupiter is wisdom, expansion, fortune, spirituality, and higher learning. It governs teachers, children, dharma, optimism, and the capacity for growth.',
    hi: 'बृहस्पति ज्ञान, विस्तार, भाग्य, आध्यात्मिकता और उच्च शिक्षा का कारक है। यह गुरु, संतान, धर्म, आशावाद और विकास की क्षमता को नियंत्रित करता है।',
  },
  5: {
    en: 'Venus governs love, beauty, luxury, marriage, creativity, and sensual pleasures. It shapes your aesthetic sense, romantic nature, and artistic abilities.',
    hi: 'शुक्र प्रेम, सौन्दर्य, विलासिता, विवाह, रचनात्मकता और भोग-विलास को नियंत्रित करता है। यह आपकी सौन्दर्य बोध, रोमांटिक प्रवृत्ति और कलात्मक क्षमता को आकार देता है।',
  },
  6: {
    en: 'Saturn represents discipline, karma, delays, hard work, longevity, and life lessons. It governs structure, responsibility, endurance, and the consequences of past actions.',
    hi: 'शनि अनुशासन, कर्म, विलम्ब, कठोर परिश्रम, दीर्घायु और जीवन के पाठ का प्रतिनिधित्व करता है। यह संरचना, जिम्मेदारी, सहनशक्ति और पूर्व कर्मों के परिणामों पर शासन करता है।',
  },
  7: {
    en: 'Rahu is the north lunar node — desire, obsession, foreign influences, unconventional paths, and material ambition. It amplifies whichever house it occupies.',
    hi: 'राहु उत्तर चन्द्र पात है — इच्छा, जुनून, विदेशी प्रभाव, अपरम्परागत मार्ग और भौतिक महत्वाकांक्षा। यह जिस भाव में हो उसे तीव्र करता है।',
  },
  8: {
    en: 'Ketu is the south lunar node — detachment, spirituality, past-life karma, and liberation. It diminishes material desire in its house and pushes toward transcendence.',
    hi: 'केतु दक्षिण चन्द्र पात है — वैराग्य, आध्यात्मिकता, पूर्वजन्म कर्म और मोक्ष। यह अपने भाव में भौतिक इच्छा को कम करता है और पारलौकिकता की ओर प्रेरित करता है।',
  },
};

// ─── House theme descriptions (1-indexed, module-level) ──────────────────

const HOUSE_THEMES: Record<number, { en: string; hi: string; keywords_en: string; keywords_hi: string }> = {
  1:  { en: 'personality, physical body, temperament, and life direction', hi: 'व्यक्तित्व, शरीर, स्वभाव और जीवन दिशा', keywords_en: 'Self', keywords_hi: 'आत्म' },
  2:  { en: 'wealth, family, speech, food habits, and personal values', hi: 'धन, परिवार, वाणी, भोजन और व्यक्तिगत मूल्य', keywords_en: 'Wealth', keywords_hi: 'धन' },
  3:  { en: 'courage, siblings, short travels, communication, and skills', hi: 'साहस, भाई-बहन, छोटी यात्रा, संवाद और कौशल', keywords_en: 'Courage', keywords_hi: 'साहस' },
  4:  { en: 'mother, home, property, vehicles, and emotional peace', hi: 'माता, घर, सम्पत्ति, वाहन और मानसिक शान्ति', keywords_en: 'Home', keywords_hi: 'गृह' },
  5:  { en: 'children, intelligence, creativity, romance, and past-life merit', hi: 'संतान, बुद्धि, रचनात्मकता, प्रेम और पूर्वजन्म पुण्य', keywords_en: 'Children', keywords_hi: 'संतान' },
  6:  { en: 'enemies, disease, debt, service, and competition', hi: 'शत्रु, रोग, ऋण, सेवा और प्रतिस्पर्धा', keywords_en: 'Enemies', keywords_hi: 'शत्रु' },
  7:  { en: 'marriage, partnerships, business relationships, and public dealings', hi: 'विवाह, साझेदारी, व्यापारिक सम्बन्ध और सार्वजनिक व्यवहार', keywords_en: 'Marriage', keywords_hi: 'विवाह' },
  8:  { en: 'longevity, hidden things, transformation, inheritance, and the occult', hi: 'आयु, छिपी बातें, रूपान्तरण, विरासत और गूढ़ विद्या', keywords_en: 'Longevity', keywords_hi: 'आयु' },
  9:  { en: 'father, fortune, dharma, higher learning, and long-distance travel', hi: 'पिता, भाग्य, धर्म, उच्च शिक्षा और दीर्घ यात्रा', keywords_en: 'Dharma', keywords_hi: 'धर्म' },
  10: { en: 'career, status, government, authority, and public image', hi: 'कैरियर, प्रतिष्ठा, सरकार, अधिकार और सार्वजनिक छवि', keywords_en: 'Career', keywords_hi: 'कर्म' },
  11: { en: 'gains, income, friends, elder siblings, and aspirations', hi: 'लाभ, आय, मित्र, बड़े भाई-बहन और आकांक्षाएँ', keywords_en: 'Gains', keywords_hi: 'लाभ' },
  12: { en: 'losses, expenses, foreign lands, liberation, and spiritual growth', hi: 'व्यय, हानि, विदेश, मोक्ष और आध्यात्मिक विकास', keywords_en: 'Liberation', keywords_hi: 'मोक्ष' },
};

// ─── House classification for sentiment ─────────────────────────────────

const TRIKONA = new Set([1, 5, 9]);     // generally positive
const KENDRA = new Set([1, 4, 7, 10]);  // powerful
const DUSTHANA = new Set([6, 8, 12]);   // challenging
const UPACHAYA = new Set([3, 6, 10, 11]); // improves with time

function getShiftSentiment(fromHouse: number, toHouse: number): 'positive' | 'negative' | 'neutral' | 'mixed' {
  const toDusthana = DUSTHANA.has(toHouse);
  const fromDusthana = DUSTHANA.has(fromHouse);
  const toTrikona = TRIKONA.has(toHouse);
  const toKendra = KENDRA.has(toHouse);

  // Moving FROM dusthana TO trikona/kendra = positive
  if (fromDusthana && (toTrikona || toKendra)) return 'positive';
  // Moving TO dusthana FROM non-dusthana = challenging
  if (toDusthana && !fromDusthana) return 'negative';
  // Moving TO trikona = generally positive
  if (toTrikona && !fromDusthana) return 'positive';
  // Moving TO kendra = powerful, generally positive
  if (toKendra) return 'mixed';
  return 'neutral';
}

function getSentimentLabel(sentiment: 'positive' | 'negative' | 'neutral' | 'mixed', locale: string): { text: string; color: string } {
  const labels: Record<string, { en: string; hi: string; color: string }> = {
    positive: { en: 'Generally Favorable', hi: 'सामान्यतः अनुकूल', color: 'text-emerald-400' },
    negative: { en: 'Challenging', hi: 'चुनौतीपूर्ण', color: 'text-red-400' },
    neutral:  { en: 'Neutral Shift', hi: 'तटस्थ परिवर्तन', color: 'text-text-secondary' },
    mixed:    { en: 'Powerful Shift', hi: 'शक्तिशाली परिवर्तन', color: 'text-amber-400' },
  };
  const entry = labels[sentiment];
  return { text: locale === 'hi' ? entry.hi : entry.en, color: entry.color };
}

// ─── Shift interpretation generator ─────────────────────────────────────

function getShiftInterpretation(
  planetId: number,
  fromHouse: number,
  toHouse: number,
  locale: string
): { summary: string; prediction: string } {
  const isHi = locale === 'hi';
  const pNature = PLANET_NATURE[planetId];
  const from = HOUSE_THEMES[fromHouse];
  const to = HOUSE_THEMES[toHouse];

  if (!pNature || !from || !to) {
    return { summary: '', prediction: '' };
  }

  const planetName = (() => {
    const graha = GRAHAS.find(g => g.id === planetId);
    return graha ? tl(graha.name, locale) : `Planet ${planetId}`;
  })();

  if (isHi) {
    return {
      summary: `${planetName} राशि कुण्डली में ${fromHouse}वें भाव (${from.hi}) से भाव चलित में ${toHouse}वें भाव (${to.hi}) में स्थानान्तरित होता है। इसका अर्थ है कि राशि कुण्डली में यह ग्रह ${from.keywords_hi} के विषयों से जुड़ा दिखता है, किन्तु वास्तविक जीवन में इसकी ऊर्जा ${to.keywords_hi} के विषयों से अधिक प्रकट होती है। आप देख सकते हैं कि इस ग्रह से जुड़े अनुभव ${to.hi} के क्षेत्रों में अधिक स्पष्ट हैं।`,
      prediction: `दशा और गोचर विश्लेषण के लिए: जब ${planetName} की दशा या गोचर सक्रिय हो, तो ${toHouse}वें भाव (${to.hi}) के विषयों को प्राथमिकता दें, ${fromHouse}वें भाव (${from.hi}) के विषयों की अपेक्षा। यह अधिक सटीक भविष्यवाणी देगा।`,
    };
  }

  return {
    summary: `${planetName} shifts from the ${ordinal(fromHouse)} house (${from.en}) to the ${ordinal(toHouse)} house (${to.en}). In the Rashi chart, this planet's energy connects to themes of ${from.keywords_en.toLowerCase()}. But in actual life manifestation (Bhava Chalit), that energy channels through ${to.keywords_en.toLowerCase()} themes instead. You may find that experiences related to this planet show up more clearly in the areas of ${to.en}.`,
    prediction: `For prediction: When analyzing dashas and transits involving ${planetName}, use the ${ordinal(toHouse)} house themes (${to.en}) rather than the ${ordinal(fromHouse)} house themes (${from.en}) for more accurate predictions.`,
  };
}

function ordinal(n: number): string {
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || 'th');
}

// ─── Unshifted planet one-liner ─────────────────────────────────────────

function getUnshiftedNote(planetId: number, house: number, locale: string): string {
  const planetName = (() => {
    const graha = GRAHAS.find(g => g.id === planetId);
    return graha ? tl(graha.name, locale) : `Planet ${planetId}`;
  })();
  const h = HOUSE_THEMES[house];
  if (!h) return '';

  if (locale === 'hi') {
    return `${planetName} दोनों कुंडलियों में भाव ${house} (${h.keywords_hi}) में स्थित है — इस ग्रह के ${h.keywords_hi} विषय किसी भी भाव पद्धति में समान रहते हैं।`;
  }
  return `${planetName} remains in House ${house} (${h.keywords_en}) in both charts — this planet's ${h.keywords_en.toLowerCase()} themes are consistent regardless of the house system used.`;
}

// ─── Impact interpretation text ─────────────────────────────────────────

const IMPACT_INTERPRETATION: Record<'minor' | 'moderate' | 'significant', { en: string; hi: string }> = {
  minor: {
    en: 'Your Rashi chart and Bhava Chalit largely agree. For most planets, the sign-based and house-based readings will be identical. Focus your attention on any shifted planet below for the nuanced difference in that specific life area.',
    hi: 'आपकी राशि कुंडली और भाव चलित कुंडली काफी हद तक एकमत हैं। अधिकांश ग्रहों के लिए, राशि-आधारित और भाव-आधारित पठन समान होंगे। किसी भी स्थानांतरित ग्रह पर ध्यान दें — वहीं सूक्ष्म अन्तर दिखेगा।',
  },
  moderate: {
    en: 'Several planets express through different houses than their Rashi positions suggest. This means your Rashi chart gives one picture, but the lived reality may differ in these specific areas. Pay attention to the shifted planets — these are where your life experience may not match a simple sign-based reading.',
    hi: 'कई ग्रह अपनी राशि स्थिति से भिन्न भावों द्वारा कार्य करते हैं। इसका अर्थ है कि राशि कुण्डली एक चित्र दिखाती है, किन्तु वास्तविक जीवन इन विशिष्ट क्षेत्रों में भिन्न हो सकता है। स्थानान्तरित ग्रहों पर ध्यान दें — यही वे क्षेत्र हैं जहाँ आपका अनुभव सरल राशि-आधारित पठन से मेल नहीं खा सकता।',
  },
  significant: {
    en: 'Many planets fall in different houses in the Bhava Chalit — your chart is highly sensitive to the house system used. This is common when the ascendant degree is near the middle of a sign. You should read BOTH the Rashi and Bhava Chalit interpretations together for a complete picture of how each planet expresses in your life.',
    hi: 'भाव चलित में अनेक ग्रह भिन्न भावों में आते हैं — आपकी कुण्डली भाव पद्धति के प्रति अत्यन्त संवेदनशील है। यह तब सामान्य है जब लग्न अंश राशि के मध्य के निकट हो। सम्पूर्ण चित्र के लिए राशि और भाव चलित दोनों व्याख्याएँ साथ पढ़ें।',
  },
};

// ─── Static labels ──────────────────────────────────────────────────────

const LABELS = {
  title: { en: 'Bhava Chalit Chart', hi: 'भाव चलित कुंडली' },
  whatIsTitle: { en: 'What is Bhava Chalit?', hi: 'भाव चलित क्या है?' },
  whatIsBody: {
    en: 'In Vedic astrology, there are two ways to read your chart:\n\n- Rashi Chart (D1): planets are placed by sign — simple, used for basic readings\n- Bhava Chalit: planets are placed by actual house cusps — more nuanced, used for prediction\n\nWhen a planet is near the edge of a sign, the Bhava Chalit may place it in a different house than the Rashi chart. This does not mean one is wrong — they answer different questions. The Rashi chart shows your inherent nature; the Bhava Chalit shows how themes actually manifest in your life.',
    hi: 'वैदिक ज्योतिष में कुंडली पढ़ने के दो तरीके हैं:\n\n- राशि कुंडली (D1): ग्रह राशि के अनुसार रखे जाते हैं — सरल, मूल पठन के लिए\n- भाव चलित: ग्रह वास्तविक भाव सन्धियों के अनुसार रखे जाते हैं — अधिक सूक्ष्म, भविष्यवाणी के लिए\n\nजब कोई ग्रह राशि की सीमा के निकट होता है, तो भाव चलित उसे राशि कुंडली से भिन्न भाव में रख सकती है। इसका अर्थ यह नहीं कि कोई गलत है — दोनों अलग-अलग प्रश्नों का उत्तर देती हैं। राशि कुंडली आपके स्वाभाविक गुण दिखाती है; भाव चलित दिखाती है कि विषय जीवन में कैसे प्रकट होते हैं।',
  },
  shiftedTitle: { en: 'Shifted Planets — Detailed Interpretation', hi: 'स्थानांतरित ग्रह — विस्तृत व्याख्या' },
  unshiftedTitle: { en: 'Unshifted Planets', hi: 'अपरिवर्तित ग्रह' },
  allPlanetsTitle: { en: 'All Planets', hi: 'सभी ग्रह' },
  bhavaBoundaries: { en: 'Bhava Boundaries', hi: 'भाव सीमाएँ' },
  planet: { en: 'Planet', hi: 'ग्रह' },
  longitude: { en: 'Longitude', hi: 'रेखांश' },
  rashiSign: { en: 'Rashi Sign', hi: 'राशि' },
  rashiHouse: { en: 'Rashi House', hi: 'राशि भाव' },
  bhavaHouse: { en: 'Bhava House', hi: 'भाव' },
  shifted: { en: 'Shifted', hi: 'स्थानांतरित' },
  yes: { en: 'Yes', hi: 'हाँ' },
  no: { en: 'No', hi: 'नहीं' },
  bhava: { en: 'Bhava', hi: 'भाव' },
  madhya: { en: 'Madhya (Midpoint)', hi: 'मध्य (केन्द्र बिन्दु)' },
  sandhi: { en: 'Sandhi (Boundary)', hi: 'संधि (सीमा)' },
  ofNine: { en: 'of 9 planets shifted houses in the Bhava Chalit chart', hi: 'में से 9 ग्रहों ने भाव चलित कुंडली में भाव बदला' },
  predictionGuidance: { en: 'Prediction Guidance', hi: 'भविष्यवाणी मार्गदर्शन' },
  learnMore: { en: 'Learn more about Kundali', hi: 'कुंडली के बारे में और जानें' },
};

function l(obj: { en: string; hi: string }, locale: string): string {
  return locale === 'hi' ? obj.hi : obj.en;
}

function formatDeg(deg: number): string {
  const d = ((deg % 360) + 360) % 360;
  const sign = Math.floor(d / 30);
  const inSign = d - sign * 30;
  const dd = Math.floor(inSign);
  const mm = Math.floor((inSign - dd) * 60);
  return `${dd}°${mm.toString().padStart(2, '0')}'`;
}

function formatFullDeg(deg: number): string {
  const d = ((deg % 360) + 360) % 360;
  return `${d.toFixed(2)}°`;
}

export default function BhavaChalitTab({ ascendant, planets, locale }: BhavaChalitTabProps) {
  const [showBoundaries, setShowBoundaries] = useState(false);
  const [showUnshifted, setShowUnshifted] = useState(false);

  const result: BhavaChalitResult = useMemo(
    () => computeBhavaChalit(ascendant, planets),
    [ascendant, planets],
  );

  const shiftedPlanets = result.planets.filter(p => p.shifted);
  const unshiftedPlanets = result.planets.filter(p => !p.shifted);

  // Impact level
  const impactLevel: 'minor' | 'moderate' | 'significant' =
    result.shiftCount <= 2 ? 'minor' : result.shiftCount <= 4 ? 'moderate' : 'significant';

  const impactColors = {
    minor: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    moderate: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
    significant: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
  };
  const colors = impactColors[impactLevel];

  const getGrahaColor = (planetId: number): string => {
    const graha = GRAHAS.find(g => g.id === planetId);
    return graha?.color || '#d4a853';
  };

  const getGrahaName = (planetId: number): string => {
    const graha = GRAHAS.find(g => g.id === planetId);
    if (!graha) return `Planet ${planetId}`;
    return tl(graha.name, locale);
  };

  const getRashiName = (longitude: number): string => {
    const signIdx = Math.floor(((longitude % 360) + 360) % 360 / 30); // 0-11
    const rashi = RASHIS[signIdx];
    if (!rashi) return '';
    return tl(rashi.name, locale);
  };

  return (
    <div className="space-y-6">
      {/* 1. What is Bhava Chalit — prominent explanation at TOP */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-5">
        <h3 className="text-gold-light font-bold text-lg mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-gold-primary shrink-0" />
          {l(LABELS.whatIsTitle, locale)}
        </h3>
        <div className="text-text-secondary text-sm leading-relaxed space-y-2">
          {l(LABELS.whatIsBody, locale).split('\n\n').map((para, i) => (
            <p key={i}>
              {para.startsWith('- ') ? (
                <span className="block ml-2">
                  {para.split('\n').map((line, j) => (
                    <span key={j} className="block">
                      {line.startsWith('- ') ? (
                        <>
                          <span className="text-gold-primary mr-1">&bull;</span>
                          <span className="text-text-primary font-medium">{line.slice(2).split(':')[0]}:</span>
                          {line.slice(2).split(':').slice(1).join(':')}
                        </>
                      ) : line}
                    </span>
                  ))}
                </span>
              ) : para}
            </p>
          ))}
        </div>
      </div>

      {/* 2. Impact Summary with INTERPRETATION */}
      <div className={`rounded-xl p-5 ${colors.bg} border ${colors.border}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`w-3 h-3 rounded-full ${colors.dot} shrink-0`} />
          <h3 className={`text-lg font-bold ${colors.text}`}>
            {result.shiftCount} {l(LABELS.ofNine, locale)}
          </h3>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          {l(IMPACT_INTERPRETATION[impactLevel], locale)}
        </p>
      </div>

      {/* 3. Shifted Planets — rich interpretation */}
      {shiftedPlanets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-gold-light font-bold text-base flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gold-primary" />
            {l(LABELS.shiftedTitle, locale)}
          </h3>
          {shiftedPlanets.map((p) => {
            const fromH = HOUSE_THEMES[p.rashiHouse];
            const toH = HOUSE_THEMES[p.bhavaHouse];
            const sentiment = getShiftSentiment(p.rashiHouse, p.bhavaHouse);
            const sentimentLabel = getSentimentLabel(sentiment, locale);
            const interp = getShiftInterpretation(p.planetId, p.rashiHouse, p.bhavaHouse, locale);

            return (
              <div
                key={p.planetId}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 p-5"
              >
                {/* Planet header with shift arrow */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: getGrahaColor(p.planetId) }}
                  />
                  <span className="text-text-primary font-bold text-base">
                    {getGrahaName(p.planetId)}
                  </span>
                  <span className="text-text-secondary text-sm flex items-center gap-1.5">
                    {locale === 'hi' ? 'भाव' : 'House'} {p.rashiHouse}
                    <span className="text-text-secondary/50">({fromH ? l({ en: fromH.keywords_en, hi: fromH.keywords_hi }, locale) : ''})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-primary" />
                    {locale === 'hi' ? 'भाव' : 'House'} {p.bhavaHouse}
                    <span className="text-text-secondary/50">({toH ? l({ en: toH.keywords_en, hi: toH.keywords_hi }, locale) : ''})</span>
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sentimentLabel.color} bg-white/5 border border-white/10`}>
                    {sentimentLabel.text}
                  </span>
                </div>

                {/* Planet nature (collapsible context) */}
                <p className="text-text-secondary/70 text-xs leading-relaxed mb-3 border-l-2 border-gold-primary/20 pl-3">
                  {l(PLANET_NATURE[p.planetId] || { en: '', hi: '' }, locale)}
                </p>

                {/* Core interpretation */}
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {interp.summary}
                </p>

                {/* Prediction guidance */}
                <div className="rounded-lg bg-gold-primary/5 border border-gold-primary/10 p-3">
                  <p className="text-gold-light text-xs font-bold uppercase tracking-wider mb-1">
                    {l(LABELS.predictionGuidance, locale)}
                  </p>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {interp.prediction}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Unshifted Planets (collapsible) */}
      {unshiftedPlanets.length > 0 && (
        <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/15 overflow-hidden">
          <button
            onClick={() => setShowUnshifted(!showUnshifted)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-bg-secondary/30 transition-colors"
          >
            <h3 className="text-gold-light font-bold text-base">
              {l(LABELS.unshiftedTitle, locale)} ({unshiftedPlanets.length})
            </h3>
            {showUnshifted
              ? <ChevronUp className="w-5 h-5 text-gold-primary" />
              : <ChevronDown className="w-5 h-5 text-gold-primary" />
            }
          </button>
          {showUnshifted && (
            <div className="px-5 pb-5 space-y-2">
              {unshiftedPlanets.map((p) => (
                <div key={p.planetId} className="flex items-start gap-2.5 py-2 border-b border-gold-primary/5 last:border-b-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: getGrahaColor(p.planetId) }}
                  />
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {getUnshiftedNote(p.planetId, p.bhavaHouse, locale)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. All Planets Table */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/15 overflow-hidden">
        <h3 className="text-gold-light font-bold text-base p-5 pb-3">
          {l(LABELS.allPlanetsTitle, locale)}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/10 text-text-secondary text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-2.5">{l(LABELS.planet, locale)}</th>
                <th className="text-right px-3 py-2.5">{l(LABELS.longitude, locale)}</th>
                <th className="text-left px-3 py-2.5">{l(LABELS.rashiSign, locale)}</th>
                <th className="text-center px-3 py-2.5">{l(LABELS.rashiHouse, locale)}</th>
                <th className="text-center px-3 py-2.5">{l(LABELS.bhavaHouse, locale)}</th>
                <th className="text-center px-3 py-2.5">{l(LABELS.shifted, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {result.planets.map((p) => (
                <tr
                  key={p.planetId}
                  className={`border-b border-gold-primary/5 transition-colors ${
                    p.shifted ? 'bg-amber-500/5' : 'hover:bg-bg-secondary/30'
                  }`}
                >
                  <td className="px-5 py-3 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getGrahaColor(p.planetId) }}
                    />
                    <span className="text-text-primary font-medium">{getGrahaName(p.planetId)}</span>
                  </td>
                  <td className="text-right px-3 py-3 text-text-secondary font-mono text-xs">
                    {formatDeg(p.longitude)}
                  </td>
                  <td className="px-3 py-3 text-text-secondary">
                    {getRashiName(p.longitude)}
                  </td>
                  <td className="text-center px-3 py-3 text-text-primary">
                    {p.rashiHouse}
                  </td>
                  <td className="text-center px-3 py-3 text-text-primary font-semibold">
                    {p.bhavaHouse}
                  </td>
                  <td className="text-center px-3 py-3">
                    {p.shifted ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {l(LABELS.yes, locale)}
                      </span>
                    ) : (
                      <span className="text-text-secondary/50 text-xs">{l(LABELS.no, locale)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Bhava Boundaries (collapsible) */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/15 overflow-hidden">
        <button
          onClick={() => setShowBoundaries(!showBoundaries)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-bg-secondary/30 transition-colors"
        >
          <h3 className="text-gold-light font-bold text-base">
            {l(LABELS.bhavaBoundaries, locale)}
          </h3>
          {showBoundaries
            ? <ChevronUp className="w-5 h-5 text-gold-primary" />
            : <ChevronDown className="w-5 h-5 text-gold-primary" />
          }
        </button>
        {showBoundaries && (
          <div className="overflow-x-auto border-t border-gold-primary/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/10 text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-2.5">{l(LABELS.bhava, locale)}</th>
                  <th className="text-right px-3 py-2.5">{l(LABELS.madhya, locale)}</th>
                  <th className="text-right px-5 py-2.5">{l(LABELS.sandhi, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {result.bhavaMadhya.map((madhya, i) => (
                  <tr key={i} className="border-b border-gold-primary/5 hover:bg-bg-secondary/30 transition-colors">
                    <td className="px-5 py-2.5 text-text-primary font-medium">
                      {l(LABELS.bhava, locale)} {i + 1}
                      <span className="text-text-secondary/50 text-xs ml-2">({l({ en: HOUSE_THEMES[i + 1]?.keywords_en || '', hi: HOUSE_THEMES[i + 1]?.keywords_hi || '' }, locale)})</span>
                    </td>
                    <td className="text-right px-3 py-2.5 text-text-secondary font-mono text-xs">
                      {formatFullDeg(madhya)}
                    </td>
                    <td className="text-right px-5 py-2.5 text-text-secondary font-mono text-xs">
                      {formatFullDeg(result.bhavaSandhi[i])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 7. Learn More */}
      <div className="text-center">
        <Link
          href="/learn/kundali"
          className="inline-block text-xs text-gold-primary hover:text-gold-light transition-colors underline underline-offset-2"
        >
          {l(LABELS.learnMore, locale)}
        </Link>
      </div>
    </div>
  );
}
