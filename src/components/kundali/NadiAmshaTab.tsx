'use client';

import React, { useState, useMemo } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Sparkles, Shield, BookOpen } from 'lucide-react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { EXALTATION_SIGNS, DEBILITATION_SIGNS, OWN_SIGNS } from '@/lib/constants/dignities';
import { calculateNadiAmsha } from '@/lib/kundali/nadi-amsha';
import type { NadiAmshaPosition } from '@/lib/kundali/nadi-amsha';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';

const PLANET_COLORS: Record<number, string> = {
  0: 'text-amber-400', 1: 'text-slate-300', 2: 'text-red-400', 3: 'text-emerald-400',
  4: 'text-yellow-300', 5: 'text-pink-300', 6: 'text-blue-400', 7: 'text-purple-400', 8: 'text-gray-400',
  [-1]: 'text-gold-light',
};

const ELEMENT_COLORS = [
  { bg: 'from-orange-500/12 to-transparent', border: 'border-orange-500/20', text: 'text-orange-400', bar: 'bg-orange-500' },  // Fire
  { bg: 'from-emerald-500/12 to-transparent', border: 'border-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-500' },  // Earth
  { bg: 'from-sky-500/12 to-transparent', border: 'border-sky-500/20', text: 'text-sky-400', bar: 'bg-sky-500' },  // Air
  { bg: 'from-blue-500/12 to-transparent', border: 'border-blue-500/20', text: 'text-blue-400', bar: 'bg-blue-500' },  // Water
] as const;

const ELEMENT_NAMES_EN = ['Fire', 'Earth', 'Air', 'Water'] as const;
const ELEMENT_NAMES_HI = ['अग्नि', 'पृथ्वी', 'वायु', 'जल'] as const;

// Element compatibility matrix: 0=Fire, 1=Earth, 2=Air, 3=Water
// Compatible pairs: Fire+Air, Earth+Water, same+same
// Conflicting pairs: Fire+Water, Earth+Air
const ELEMENT_COMPAT: Record<string, 'harmonious' | 'conflicting' | 'neutral'> = {
  '0-0': 'harmonious', '0-1': 'neutral', '0-2': 'harmonious', '0-3': 'conflicting',
  '1-0': 'neutral', '1-1': 'harmonious', '1-2': 'conflicting', '1-3': 'harmonious',
  '2-0': 'harmonious', '2-1': 'conflicting', '2-2': 'harmonious', '2-3': 'neutral',
  '3-0': 'conflicting', '3-1': 'harmonious', '3-2': 'neutral', '3-3': 'harmonious',
};

/** Get the element index (0=Fire,1=Earth,2=Air,3=Water) from a rashi ID (1-12). */
function getElementIndex(signId: number): number {
  // Aries(1)=Fire, Taurus(2)=Earth, Gemini(3)=Air, Cancer(4)=Water, Leo(5)=Fire...
  return (signId - 1) % 4;
}

/** Planet labels used in narrative text (English only — Hindi uses pos.planetName). */
const PLANET_LABELS_EN: Record<number, string> = {
  [-1]: 'Ascendant', 0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

/** Domain/life-area associated with each planet (used in narrative). */
const PLANET_DOMAINS_EN: Record<number, string> = {
  0: 'identity and vitality', 1: 'emotions and intuition', 2: 'action and courage',
  3: 'intellect and communication', 4: 'wisdom and expansion', 5: 'love and creativity',
  6: 'discipline and karma', 7: 'worldly desires and obsession', 8: 'detachment and liberation',
};
const PLANET_DOMAINS_HI: Record<number, string> = {
  0: 'पहचान और जीवन-शक्ति', 1: 'भावनाएँ और अन्तर्ज्ञान', 2: 'कर्म और साहस',
  3: 'बुद्धि और संवाद', 4: 'ज्ञान और विस्तार', 5: 'प्रेम और रचनात्मकता',
  6: 'अनुशासन और कर्म-फल', 7: 'सांसारिक इच्छाएँ और आसक्ति', 8: 'वैराग्य और मोक्ष',
};

/** Karmic guidance actions mapped to dominant element */
const GUIDANCE_EN: Record<number, { quality: string; action: string }[]> = {
  0: [ // Fire
    { quality: 'courage and initiative', action: 'Take on leadership roles — your soul chose this lifetime to lead, not follow.' },
    { quality: 'creative self-expression', action: 'Channel fire energy through physical activity, competition, or performance art.' },
    { quality: 'patience under pressure', action: 'Practice cooling pranayama (Sheetali) to balance excess fire without dimming your spark.' },
  ],
  1: [ // Earth
    { quality: 'material stewardship', action: 'Build something tangible that outlasts you — a business, a garden, a family tradition.' },
    { quality: 'sensory grounding', action: 'Spend time in nature daily. Earth karma resolves through physical connection to the land.' },
    { quality: 'releasing attachment', action: 'Practice dana (giving) regularly — your karmic lesson is that security comes from within.' },
  ],
  2: [ // Air
    { quality: 'intellectual connection', action: 'Teach, write, or mentor — your soul chose to distribute knowledge this lifetime.' },
    { quality: 'social bridge-building', action: 'Connect disparate groups. Your karma is fulfilled when you unite divided communities.' },
    { quality: 'embodied presence', action: 'Ground air energy through walking meditation or yoga to prevent mental restlessness.' },
  ],
  3: [ // Water
    { quality: 'emotional wisdom', action: 'Trust your intuition — it is a karmic gift refined over many lifetimes.' },
    { quality: 'compassionate service', action: 'Serve those who suffer. Water karma resolves through healing and empathy.' },
    { quality: 'healthy boundaries', action: 'Learn to distinguish your emotions from others\' — practice psychic shielding through mantra.' },
  ],
};
const GUIDANCE_HI: Record<number, { quality: string; action: string }[]> = {
  0: [
    { quality: 'साहस और पहल', action: 'नेतृत्व की भूमिका अपनाएँ — आपकी आत्मा ने इस जन्म में अगुआई करने का चयन किया।' },
    { quality: 'रचनात्मक आत्म-अभिव्यक्ति', action: 'अग्नि ऊर्जा को शारीरिक गतिविधि या कला के माध्यम से प्रवाहित करें।' },
    { quality: 'धैर्य', action: 'अतिरिक्त अग्नि को संतुलित करने के लिए शीतली प्राणायाम का अभ्यास करें।' },
  ],
  1: [
    { quality: 'भौतिक प्रबन्धन', action: 'कुछ स्थायी बनाएँ — व्यवसाय, बगीचा, या पारिवारिक परम्परा।' },
    { quality: 'प्रकृति से जुड़ाव', action: 'प्रतिदिन प्रकृति में समय बिताएँ। पृथ्वी कर्म भूमि से जुड़कर ही पूरा होता है।' },
    { quality: 'आसक्ति का त्याग', action: 'नियमित दान करें — आपका कर्म-पाठ यह है कि सुरक्षा भीतर से आती है।' },
  ],
  2: [
    { quality: 'बौद्धिक सम्पर्क', action: 'सिखाएँ, लिखें या मार्गदर्शन करें — आपकी आत्मा ने ज्ञान बाँटने का चयन किया।' },
    { quality: 'सामाजिक सेतु', action: 'विभिन्न समूहों को जोड़ें। आपका कर्म तब पूरा होता है जब आप विभाजन मिटाते हैं।' },
    { quality: 'मूर्त उपस्थिति', action: 'वायु ऊर्जा को चलने वाले ध्यान या योग से स्थिर करें।' },
  ],
  3: [
    { quality: 'भावनात्मक ज्ञान', action: 'अपनी अन्तर्ज्ञान पर भरोसा करें — यह कई जन्मों में परिष्कृत कर्मिक उपहार है।' },
    { quality: 'करुणामय सेवा', action: 'पीड़ितों की सेवा करें। जल कर्म उपचार और सहानुभूति से पूरा होता है।' },
    { quality: 'स्वस्थ सीमाएँ', action: 'अपनी और दूसरों की भावनाओं में अन्तर करना सीखें — मन्त्र द्वारा अभ्यास करें।' },
  ],
};

interface Props {
  kundali: KundaliData;
  locale: Locale;
}

export default function NadiAmshaTab({ kundali, locale }: Props) {
  const isTamil = String(locale) === 'ta';
  const isLatin = locale === 'en' || isTamil;
  const [expandedPlanet, setExpandedPlanet] = useState<number | null>(null);

  const nadiChart = useMemo(() => calculateNadiAmsha(kundali), [kundali]);

  const allPositions: NadiAmshaPosition[] = useMemo(
    () => [nadiChart.ascendantNadi, ...nadiChart.positions],
    [nadiChart]
  );

  const toggle = (pid: number) => {
    setExpandedPlanet(prev => prev === pid ? null : pid);
  };

  const getD1SignName = (signId: number): string => {
    const r = RASHIS.find(rs => rs.id === signId);
    return r ? tl(r.name, locale) : '?';
  };

  const getNadiSignName = (signId: number): string => {
    const r = RASHIS.find(rs => rs.id === signId);
    return r ? tl(r.name, locale) : '?';
  };

  // ---- Karmic Synthesis Computation ----
  const karmicSynthesis = useMemo(() => {
    const sunPos = allPositions.find(p => p.planetId === 0);
    const moonPos = allPositions.find(p => p.planetId === 1);
    const marsPos = allPositions.find(p => p.planetId === 2);
    const jupPos = allPositions.find(p => p.planetId === 4);

    // Element distribution using actual rashi element mapping
    const elCount = [0, 0, 0, 0]; // fire, earth, air, water
    const elPlanets: number[][] = [[], [], [], []]; // planet IDs per element
    for (const p of allPositions) {
      const elIdx = getElementIndex(p.nadiSign);
      elCount[elIdx]++;
      elPlanets[elIdx].push(p.planetId);
    }
    const dominantEl = elCount.indexOf(Math.max(...elCount));

    // Find Nadi conjunctions (planets sharing the same D-150 sign)
    const signGroups: Record<number, NadiAmshaPosition[]> = {};
    for (const p of allPositions) {
      if (!signGroups[p.nadiSign]) signGroups[p.nadiSign] = [];
      signGroups[p.nadiSign].push(p);
    }
    const conjunctions = Object.values(signGroups).filter(g => g.length >= 2);

    // Sun-Moon element compatibility
    let sunMoonCompat: 'harmonious' | 'conflicting' | 'neutral' = 'neutral';
    if (sunPos && moonPos) {
      const sunEl = getElementIndex(sunPos.nadiSign);
      const moonEl = getElementIndex(moonPos.nadiSign);
      sunMoonCompat = ELEMENT_COMPAT[`${sunEl}-${moonEl}`] ?? 'neutral';
    }

    // Strongest karmic indicator: planet with extreme Nadi number (closest to 1 or 150)
    let strongestKarmic = allPositions[0];
    let maxExtreme = 0;
    for (const p of allPositions) {
      if (p.planetId < 0) continue; // skip ascendant for this metric
      const distFromCenter = Math.abs(p.nadiAmshaNumber - 75.5);
      if (distFromCenter > maxExtreme) {
        maxExtreme = distFromCenter;
        strongestKarmic = p;
      }
    }
    const isBeginning = strongestKarmic.nadiAmshaNumber <= 75;

    // Karmic gifts (exalted or own sign at D-150) and challenges (debilitated)
    const gifts: NadiAmshaPosition[] = [];
    const challenges: NadiAmshaPosition[] = [];
    for (const p of allPositions) {
      if (p.planetId < 0) continue;
      if (EXALTATION_SIGNS[p.planetId] === p.nadiSign) {
        gifts.push(p);
      } else if (OWN_SIGNS[p.planetId]?.includes(p.nadiSign)) {
        gifts.push(p);
      }
      if (DEBILITATION_SIGNS[p.planetId] === p.nadiSign) {
        challenges.push(p);
      }
    }

    return {
      sunPos, moonPos, marsPos, jupPos,
      elCount, elPlanets, dominantEl,
      conjunctions, sunMoonCompat,
      strongestKarmic, isBeginning,
      gifts, challenges,
    };
  }, [allPositions]);

  // ---- Narrative Generator ----
  const narrative = useMemo(() => {
    const { sunPos, moonPos, marsPos, dominantEl, conjunctions, sunMoonCompat } = karmicSynthesis;
    if (!sunPos || !moonPos) return '';

    const elName = isLatin ? ELEMENT_NAMES_EN[dominantEl] : ELEMENT_NAMES_HI[dominantEl];
    const sunSign = getNadiSignName(sunPos.nadiSign);
    const moonSign = getNadiSignName(moonPos.nadiSign);

    const para1 = isLatin
      ? `Your karmic blueprint reveals a soul deeply oriented toward ${elName} energy. With the Sun in ${sunSign} at the D-150 level, your core mission centers on ${sunPos.karmicTheme.split('.')[0].toLowerCase()}. The Moon's placement in ${moonSign} adds an emotional undercurrent of ${moonPos.karmicTheme.split('.')[0].toLowerCase()}, suggesting past-life experiences that shaped your current emotional responses.`
      : `आपका कार्मिक आधार ${elName} ऊर्जा की ओर गहराई से उन्मुख आत्मा को प्रकट करता है। D-150 स्तर पर सूर्य ${sunSign} में होने से आपका मूल उद्देश्य ${sunPos.karmicTheme.split('.')[0]} से सम्बन्धित है। चन्द्रमा ${moonSign} में होने से ${moonPos.karmicTheme.split('.')[0]} का भावनात्मक अधोप्रवाह जुड़ता है।`;

    let para2 = '';
    if (marsPos) {
      const marsSign = getNadiSignName(marsPos.nadiSign);
      const compatText = isLatin
        ? sunMoonCompat === 'harmonious'
          ? 'Sun and Moon occupy compatible elements, suggesting inner alignment — your conscious will and emotional nature reinforce each other. This is a karmic gift of coherence.'
          : sunMoonCompat === 'conflicting'
          ? 'Sun and Moon occupy conflicting elements, revealing an inner tension between your conscious purpose and emotional needs. This friction is itself a karmic catalyst — it drives transformation.'
          : 'Sun and Moon occupy neutral elements, suggesting a balanced but dynamic interplay between will and emotion.'
        : sunMoonCompat === 'harmonious'
          ? 'सूर्य और चन्द्रमा अनुकूल तत्वों में हैं, जो आन्तरिक सामंजस्य दर्शाता है।'
          : sunMoonCompat === 'conflicting'
          ? 'सूर्य और चन्द्रमा परस्पर विरोधी तत्वों में हैं, जो सचेतन उद्देश्य और भावनात्मक आवश्यकताओं के बीच आन्तरिक तनाव प्रकट करता है।'
          : 'सूर्य और चन्द्रमा तटस्थ तत्वों में हैं, जो इच्छा और भावना के बीच सन्तुलित गतिशीलता दर्शाता है।';

      para2 = isLatin
        ? `Mars in ${marsSign} indicates your karmic action style is rooted in ${marsPos.karmicTheme.split('.')[0].toLowerCase()}. ${compatText}`
        : `मंगल ${marsSign} में होने से आपकी कार्मिक क्रिया-शैली ${marsPos.karmicTheme.split('.')[0]} पर आधारित है। ${compatText}`;
    }

    let para3 = '';
    if (conjunctions.length > 0) {
      const conj = conjunctions[0]; // highlight the first conjunction
      const names = conj.map(p => isLatin ? (PLANET_LABELS_EN[p.planetId] ?? tl(p.planetName, locale)) : tl(p.planetName, locale));
      const domains = conj.map(p => isLatin ? (PLANET_DOMAINS_EN[p.planetId] ?? '') : (PLANET_DOMAINS_HI[p.planetId] ?? ''));
      const conjSign = getNadiSignName(conj[0].nadiSign);
      para3 = isLatin
        ? `Notably, ${names.join(' and ')} share the same Nadi sign (${conjSign}), creating a powerful karmic bond between ${domains.filter(Boolean).join(' and ')}. This conjunction at the D-150 level suggests these life areas are inseparably linked across lifetimes.`
        : `विशेष रूप से, ${names.join(' और ')} एक ही नाडी राशि (${conjSign}) में हैं, जो ${domains.filter(Boolean).join(' और ')} के बीच शक्तिशाली कार्मिक बन्धन बनाता है।`;
    }

    return [para1, para2, para3].filter(Boolean).join('\n\n');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [karmicSynthesis, isLatin, locale]);

  return (
    <div className="space-y-6">
      {/* What is Nadi Amsha */}
      <div className="bg-white/[0.02] border border-gold-primary/10 rounded-xl p-5 space-y-3">
        <h3 className="text-gold-light font-semibold text-sm">
          {isLatin ? 'What is Nadi Amsha (D-150)?' : 'नाडी अंश (D-150) क्या है?'}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {isLatin
            ? 'Nadi Amsha is the 150th divisional chart (D-150) — the finest subdivision in Vedic astrology. Each zodiac sign (30\u00B0) is divided into 150 equal parts of 0.2\u00B0 (12 arc-minutes) each. At this microscopic level, even twins born minutes apart can have different Nadi positions, revealing unique karmic signatures invisible in coarser charts like D-1 (Rashi) or D-9 (Navamsha).'
            : 'नाडी अंश 150वां विभागीय चार्ट (D-150) है — वैदिक ज्योतिष में सबसे सूक्ष्म विभाजन। प्रत्येक राशि (30\u00B0) को 0.2\u00B0 (12 कला-मिनट) के 150 समान भागों में विभाजित किया जाता है। इस सूक्ष्म स्तर पर, मिनटों के अन्तर से जन्मे जुड़वाँ बच्चों की भी अलग-अलग नाडी स्थितियाँ हो सकती हैं।'}
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
            <p className="text-gold-light font-medium mb-1">{isLatin ? 'Nadi Number (1-150)' : 'नाडी संख्या (1-150)'}</p>
            <p className="text-text-secondary">{isLatin ? 'Which of the 150 micro-divisions the planet occupies within its D-1 sign. Lower numbers = early in the sign, higher = late.' : 'ग्रह अपनी D-1 राशि के 150 सूक्ष्म भागों में से किसमें है।'}</p>
          </div>
          <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
            <p className="text-gold-light font-medium mb-1">{isLatin ? 'D-150 Sign' : 'D-150 राशि'}</p>
            <p className="text-text-secondary">{isLatin ? 'The zodiac sign this Nadi division maps to. It reveals the subtle karmic coloring of the planet beyond what the birth chart shows.' : 'यह नाडी विभाजन किस राशि से मेल खाता है, जो ग्रह का सूक्ष्म कार्मिक रंग दर्शाता है।'}</p>
          </div>
          <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
            <p className="text-gold-light font-medium mb-1">{isLatin ? 'Karmic Theme' : 'कर्म विषय'}</p>
            <p className="text-text-secondary">{isLatin ? 'The deep karmic pattern revealed by this placement — past-life tendencies, soul-level lessons, and latent gifts that unfold over a lifetime.' : 'इस स्थिति द्वारा प्रकट गहन कार्मिक प्रतिरूप — पूर्वजन्म प्रवृत्तियाँ और आत्मा-स्तरीय शिक्षाएँ।'}</p>
          </div>
        </div>
      </div>

      {/* Birth time sensitivity warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-300/90">
          {isLatin
            ? 'D-150 (Nadi Amsha) requires highly accurate birth time. A difference of \u00B12 minutes can change positions. Treat these results as indicative if birth time is approximate.'
            : 'D-150 (नाडी अंश) में अत्यन्त सटीक जन्म समय आवश्यक है। \u00B12 मिनट का अन्तर स्थिति बदल सकता है। यदि जन्म समय अनुमानित है तो इन परिणामों को संकेतात्मक मानें।'}
        </p>
      </div>

      {/* ======== KARMIC SYNTHESIS SECTION ======== */}
      {allPositions.length > 0 && (
        <div className="space-y-5">

          {/* 1. Element Distribution Visual */}
          <div className="rounded-xl bg-gradient-to-br from-violet-500/8 via-[#1a1040]/40 to-[#0a0e27] border border-violet-500/15 p-5">
            <h4 className="text-violet-300 text-sm font-bold mb-4">
              {isLatin ? 'Elemental Karmic Distribution' : 'तात्त्विक कर्म वितरण'}
            </h4>
            <div className="space-y-3">
              {ELEMENT_NAMES_EN.map((elNameEn, idx) => {
                const elName = isLatin ? elNameEn : ELEMENT_NAMES_HI[idx];
                const count = karmicSynthesis.elCount[idx];
                const pct = allPositions.length > 0 ? (count / allPositions.length) * 100 : 0;
                const planetIds = karmicSynthesis.elPlanets[idx];
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${ELEMENT_COLORS[idx].text}`}>{elName}</span>
                      <span className="text-xs text-text-secondary">{count}/{allPositions.length}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${ELEMENT_COLORS[idx].bar} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(pct, 2)}%`, opacity: 0.7 }}
                      />
                    </div>
                    {planetIds.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {planetIds.map(pid => (
                          <div key={pid} className="flex items-center gap-0.5" title={isLatin ? PLANET_LABELS_EN[pid] : undefined}>
                            {pid >= 0 ? (
                              <GrahaIconById id={pid} className="w-4 h-4" />
                            ) : (
                              <span className="text-gold-light text-[10px] font-bold">Asc</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Karmic Axis Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Soul Purpose (Sun) */}
            {karmicSynthesis.sunPos && (
              <div className="rounded-xl bg-gradient-to-br from-amber-500/8 to-transparent border border-amber-500/15 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GrahaIconById id={0} className="w-5 h-5" />
                  <span className="text-amber-400 font-bold text-sm">
                    {isLatin ? 'Soul Purpose (Sun)' : 'आत्म-उद्देश्य (सूर्य)'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-1">
                  D-150: {getNadiSignName(karmicSynthesis.sunPos.nadiSign)} | {isLatin ? 'Nadi' : 'नाडी'} #{karmicSynthesis.sunPos.nadiAmshaNumber}
                </p>
                <p className="text-text-primary/90 text-sm leading-relaxed">
                  {karmicSynthesis.sunPos.karmicTheme}
                </p>
              </div>
            )}

            {/* Emotional Karma (Moon) */}
            {karmicSynthesis.moonPos && (
              <div className="rounded-xl bg-gradient-to-br from-slate-400/8 to-transparent border border-slate-400/15 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GrahaIconById id={1} className="w-5 h-5" />
                  <span className="text-slate-300 font-bold text-sm">
                    {isLatin ? 'Emotional Karma (Moon)' : 'भावनात्मक कर्म (चन्द्र)'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-1">
                  D-150: {getNadiSignName(karmicSynthesis.moonPos.nadiSign)} | {isLatin ? 'Nadi' : 'नाडी'} #{karmicSynthesis.moonPos.nadiAmshaNumber}
                </p>
                <p className="text-text-primary/90 text-sm leading-relaxed">
                  {karmicSynthesis.moonPos.karmicTheme}
                </p>
              </div>
            )}

            {/* Action Karma (Mars) */}
            {karmicSynthesis.marsPos && (
              <div className="rounded-xl bg-gradient-to-br from-red-500/8 to-transparent border border-red-500/15 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GrahaIconById id={2} className="w-5 h-5" />
                  <span className="text-red-400 font-bold text-sm">
                    {isLatin ? 'Action Karma (Mars)' : 'क्रिया-कर्म (मंगल)'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-1">
                  D-150: {getNadiSignName(karmicSynthesis.marsPos.nadiSign)} | {isLatin ? 'Nadi' : 'नाडी'} #{karmicSynthesis.marsPos.nadiAmshaNumber}
                </p>
                <p className="text-text-primary/90 text-sm leading-relaxed">
                  {karmicSynthesis.marsPos.karmicTheme}
                </p>
              </div>
            )}

            {/* Wisdom & Expansion (Jupiter) */}
            {karmicSynthesis.jupPos && (
              <div className="rounded-xl bg-gradient-to-br from-yellow-500/8 to-transparent border border-yellow-500/15 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GrahaIconById id={4} className="w-5 h-5" />
                  <span className="text-yellow-300 font-bold text-sm">
                    {isLatin ? 'Wisdom & Expansion (Jupiter)' : 'ज्ञान और विस्तार (बृहस्पति)'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-1">
                  D-150: {getNadiSignName(karmicSynthesis.jupPos.nadiSign)} | {isLatin ? 'Nadi' : 'नाडी'} #{karmicSynthesis.jupPos.nadiAmshaNumber}
                </p>
                <p className="text-text-primary/90 text-sm leading-relaxed">
                  {karmicSynthesis.jupPos.karmicTheme}
                </p>
              </div>
            )}
          </div>

          {/* Strongest Karmic Indicator */}
          <div className="rounded-xl bg-gradient-to-br from-violet-600/12 via-[#1a1040]/40 to-[#0a0e27] border border-violet-500/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-violet-300 font-bold text-sm">
                {isLatin ? 'Strongest Karmic Indicator' : 'प्रबलतम कार्मिक सूचक'}
              </span>
            </div>
            <p className="text-text-primary/90 text-sm leading-relaxed">
              {isLatin
                ? `${PLANET_LABELS_EN[karmicSynthesis.strongestKarmic.planetId] ?? tl(karmicSynthesis.strongestKarmic.planetName, locale)} at Nadi #${karmicSynthesis.strongestKarmic.nadiAmshaNumber} — ${karmicSynthesis.isBeginning ? 'positioned at the beginning of its karmic cycle, suggesting fresh karmic initiation and new lessons to learn in this domain' : 'positioned near the end of its karmic cycle, suggesting accumulated wisdom and near-completion of lessons in this area'}. ${karmicSynthesis.strongestKarmic.karmicTheme}`
                : `${tl(karmicSynthesis.strongestKarmic.planetName, locale)} नाडी #${karmicSynthesis.strongestKarmic.nadiAmshaNumber} पर — ${karmicSynthesis.isBeginning ? 'कार्मिक चक्र के आरम्भ में, नये कर्म-पाठों का संकेत' : 'कार्मिक चक्र के अन्त के निकट, संचित ज्ञान और पाठों की पूर्णता का संकेत'}। ${karmicSynthesis.strongestKarmic.karmicTheme}`}
            </p>
          </div>

          {/* 3. Past-Life Narrative */}
          {narrative && (
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-violet-500/15 p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-violet-400" />
                <h4 className="text-violet-300 text-sm font-bold">
                  {isLatin ? 'Past-Life Narrative' : 'पूर्वजन्म वृत्तान्त'}
                </h4>
              </div>
              <div className="space-y-3">
                {narrative.split('\n\n').map((para, i) => (
                  <p key={i} className="text-text-primary/85 text-sm leading-relaxed italic">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 4. Karmic Strengths & Challenges */}
          {(karmicSynthesis.gifts.length > 0 || karmicSynthesis.challenges.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gifts */}
              <div className="rounded-xl bg-gradient-to-br from-emerald-500/8 to-transparent border border-emerald-500/15 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h5 className="text-emerald-400 font-bold text-sm">
                    {isLatin ? 'Karmic Gifts' : 'कार्मिक वरदान'}
                  </h5>
                </div>
                {karmicSynthesis.gifts.length === 0 ? (
                  <p className="text-text-secondary text-xs italic">
                    {isLatin
                      ? 'No planets in exalted or own D-150 sign — your karmic gifts express through subtler channels.'
                      : 'कोई ग्रह उच्च या स्व D-150 राशि में नहीं — आपके कार्मिक वरदान सूक्ष्म मार्गों से प्रकट होते हैं।'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {karmicSynthesis.gifts.map(p => {
                      const isExalt = EXALTATION_SIGNS[p.planetId] === p.nadiSign;
                      return (
                        <div key={p.planetId} className="flex items-start gap-2">
                          <GrahaIconById id={p.planetId} className="w-4 h-4 mt-0.5 shrink-0" />
                          <div>
                            <span className={`text-xs font-semibold ${PLANET_COLORS[p.planetId] ?? 'text-text-primary'}`}>
                              {tl(p.planetName, locale)}
                            </span>
                            <span className="text-emerald-400/70 text-xs ml-1">
                              ({isExalt
                                ? (isLatin ? 'exalted' : 'उच्च')
                                : (isLatin ? 'own sign' : 'स्वराशि')
                              } {isLatin ? 'in' : ''} {getNadiSignName(p.nadiSign)})
                            </span>
                            <p className="text-text-secondary text-xs mt-0.5">{p.karmicTheme.split('.')[0]}.</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Challenges */}
              <div className="rounded-xl bg-gradient-to-br from-red-500/8 to-transparent border border-red-500/15 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-red-400" />
                  <h5 className="text-red-400 font-bold text-sm">
                    {isLatin ? 'Karmic Lessons' : 'कार्मिक पाठ'}
                  </h5>
                </div>
                {karmicSynthesis.challenges.length === 0 ? (
                  <p className="text-text-secondary text-xs italic">
                    {isLatin
                      ? 'No planets debilitated at D-150 level — your karmic challenges are distributed evenly rather than concentrated.'
                      : 'D-150 स्तर पर कोई ग्रह नीच नहीं — आपकी कार्मिक चुनौतियाँ समान रूप से वितरित हैं।'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {karmicSynthesis.challenges.map(p => (
                      <div key={p.planetId} className="flex items-start gap-2">
                        <GrahaIconById id={p.planetId} className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <span className={`text-xs font-semibold ${PLANET_COLORS[p.planetId] ?? 'text-text-primary'}`}>
                            {tl(p.planetName, locale)}
                          </span>
                          <span className="text-red-400/70 text-xs ml-1">
                            ({isLatin ? 'debilitated in' : 'नीच'} {getNadiSignName(p.nadiSign)})
                          </span>
                          <p className="text-text-secondary text-xs mt-0.5">{p.karmicTheme.split('.')[0]}.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Practical Karmic Guidance */}
          <div className="rounded-xl bg-gradient-to-br from-violet-500/8 via-[#1a1040]/40 to-[#0a0e27] border border-violet-500/15 p-5">
            <h4 className="text-violet-300 text-sm font-bold mb-3">
              {isLatin ? 'Practical Karmic Guidance' : 'व्यावहारिक कर्म मार्गदर्शन'}
            </h4>
            <div className="space-y-3">
              {(isLatin ? GUIDANCE_EN : GUIDANCE_HI)[karmicSynthesis.dominantEl]?.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full ${ELEMENT_COLORS[karmicSynthesis.dominantEl].bar}/20 flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className={`text-xs font-bold ${ELEMENT_COLORS[karmicSynthesis.dominantEl].text}`}>{i + 1}</span>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${ELEMENT_COLORS[karmicSynthesis.dominantEl].text} mb-0.5`}>
                      {isLatin ? `Strengthen your ${item.quality}` : item.quality}
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nadi Conjunctions highlight (if any) */}
          {karmicSynthesis.conjunctions.length > 0 && (
            <div className="rounded-xl bg-gradient-to-br from-gold-primary/8 to-transparent border border-gold-primary/15 p-4">
              <h4 className="text-gold-light text-sm font-bold mb-3">
                {isLatin ? 'Karmic Bonds (D-150 Conjunctions)' : 'कार्मिक बन्धन (D-150 युति)'}
              </h4>
              <div className="space-y-2">
                {karmicSynthesis.conjunctions.map((group, gi) => (
                  <div key={gi} className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      {group.map(p => (
                        <div key={p.planetId} className="flex items-center gap-1">
                          {p.planetId >= 0 && <GrahaIconById id={p.planetId} className="w-4 h-4" />}
                          <span className={`text-xs font-medium ${PLANET_COLORS[p.planetId] ?? 'text-text-primary'}`}>
                            {tl(p.planetName, locale)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="text-text-secondary text-xs">
                      {isLatin ? 'in' : '—'} {getNadiSignName(group[0].nadiSign)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Summary table */}
      <div className="overflow-x-auto rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold-primary/20">
              <th className="text-left px-4 py-3 text-gold-light font-semibold">
                {isLatin ? 'Planet' : 'ग्रह'}
              </th>
              <th className="text-center px-4 py-3 text-gold-light font-semibold">
                {isLatin ? 'D1 Sign' : 'D1 राशि'}
              </th>
              <th className="text-center px-4 py-3 text-gold-light font-semibold">
                {isLatin ? 'Nadi #' : 'नाडी #'}
              </th>
              <th className="text-center px-4 py-3 text-gold-light font-semibold">
                {isLatin ? 'D-150 Sign' : 'D-150 राशि'}
              </th>
              <th className="text-left px-4 py-3 text-gold-light font-semibold hidden sm:table-cell">
                {isLatin ? 'Karmic Theme' : 'कर्म विषय'}
              </th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((pos) => (
              <tr
                key={pos.planetId}
                className="border-b border-gold-primary/10 hover:bg-gold-primary/5 transition-colors cursor-pointer"
                onClick={() => toggle(pos.planetId)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {pos.planetId >= 0 && (
                      <GrahaIconById id={pos.planetId} className="w-5 h-5" />
                    )}
                    <span className={`font-medium ${PLANET_COLORS[pos.planetId] ?? 'text-text-primary'}`}>
                      {tl(pos.planetName, locale)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-text-primary">
                  {getD1SignName(pos.d1Sign)}
                </td>
                <td className="px-4 py-3 text-center font-mono text-gold-primary">
                  {pos.nadiAmshaNumber}
                </td>
                <td className="px-4 py-3 text-center text-text-primary">
                  {tl(pos.nadiSignName, locale)}
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs hidden sm:table-cell max-w-xs truncate">
                  {pos.karmicTheme}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail cards */}
      <div className="space-y-3">
        <h3 className="text-gold-light font-semibold text-base">
          {isLatin ? 'Detailed Karmic Insights' : 'विस्तृत कर्म अन्तर्दृष्टि'}
        </h3>
        {allPositions.map((pos) => {
          const isExpanded = expandedPlanet === pos.planetId;
          return (
            <div
              key={pos.planetId}
              className="rounded-xl border border-gold-primary/15 bg-bg-secondary/40 overflow-hidden"
            >
              <button
                onClick={() => toggle(pos.planetId)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {pos.planetId >= 0 && (
                    <GrahaIconById id={pos.planetId} className="w-6 h-6" />
                  )}
                  <div className="text-left">
                    <span className={`font-semibold ${PLANET_COLORS[pos.planetId] ?? 'text-text-primary'}`}>
                      {tl(pos.planetName, locale)}
                    </span>
                    <span className="text-text-secondary text-xs ml-2">
                      {isLatin ? 'Nadi' : 'नाडी'} {pos.nadiAmshaNumber} {isLatin ? 'of' : '—'} {getD1SignName(pos.d1Sign)} {'\u2192'} {tl(pos.nadiSignName, locale)}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gold-primary/60" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gold-primary/60" />
                )}
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-gold-primary/10">
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div>
                      <span className="text-text-secondary">{isLatin ? 'Longitude' : 'रेखांश'}:</span>
                      <span className="text-text-primary ml-1">{pos.longitude.toFixed(4)}{'\u00B0'}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">{isLatin ? 'D1 Sign' : 'D1 राशि'}:</span>
                      <span className="text-text-primary ml-1">{getD1SignName(pos.d1Sign)}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">{isLatin ? 'Nadi Amsha' : 'नाडी अंश'}:</span>
                      <span className="text-gold-primary ml-1 font-mono">{pos.nadiAmshaNumber}/150</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">{isLatin ? 'D-150 Sign' : 'D-150 राशि'}:</span>
                      <span className="text-text-primary ml-1">{tl(pos.nadiSignName, locale)}</span>
                    </div>
                  </div>
                  <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                    <p className="text-sm text-text-primary leading-relaxed">
                      {pos.karmicTheme}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
