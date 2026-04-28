'use client';

import { useMemo, useState } from 'react';
import { getAyanamsa, type AyanamsaType } from '@/lib/astronomy/ayanamsa';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// Ayanamsha system metadata — hoisted to module level (no inline objects in render)
const AYANAMSHA_SYSTEMS: { key: AyanamsaType; label: string; desc: string }[] = [
  { key: 'lahiri', label: 'Lahiri', desc: 'Chitrapaksha — IAU standard, most widely used in India' },
  { key: 'raman', label: 'Raman', desc: 'B.V. Raman — popular in South India' },
  { key: 'krishnamurti', label: 'KP', desc: 'Krishnamurti Paddhati — used in KP system' },
];

interface AyanamshaComparisonProps {
  kundali: KundaliData;
  locale: string;
}

interface PlanetRow {
  id: number;
  name: string;
  /** Sidereal longitude per ayanamsha system */
  positions: {
    lahiri: number;
    raman: number;
    krishnamurti: number;
  };
  /** true if any system puts the planet in a different sign */
  hasSignChange: boolean;
}

/** Format sidereal longitude as "Aries 11°44'" */
function formatPosition(siderealLong: number, locale: string): { sign: string; formatted: string; signIndex: number } {
  const normalized = ((siderealLong % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30); // 0-based
  const degInSign = normalized - signIndex * 30;
  const deg = Math.floor(degInSign);
  const min = Math.floor((degInSign - deg) * 60);
  const signName = tl(RASHIS[signIndex]?.name, locale) || `Sign ${signIndex + 1}`;
  return {
    sign: signName,
    formatted: `${signName} ${deg}°${min.toString().padStart(2, '0')}'`,
    signIndex,
  };
}

/** Planet expression keywords per sign (0-indexed). Short, evocative phrases. */
const PLANET_IN_SIGN_FLAVOR: Record<number, Record<number, { en: string; hi: string }>> = {
  // Sun (0)
  0: {
    0: { en: 'bold pioneering energy and leadership drive', hi: 'साहसी अग्रणी ऊर्जा और नेतृत्व' },
    1: { en: 'steady material confidence and enduring willpower', hi: 'स्थिर भौतिक आत्मविश्वास और दृढ़ इच्छाशक्ति' },
    2: { en: 'intellectual curiosity and communicative brilliance', hi: 'बौद्धिक जिज्ञासा और संवाद कौशल' },
    3: { en: 'emotional depth and protective nurturing', hi: 'भावनात्मक गहराई और पोषण स्वभाव' },
    4: { en: 'creative authority and generous self-expression', hi: 'रचनात्मक सत्ता और उदार आत्म-अभिव्यक्ति' },
    5: { en: 'analytical precision and dedication to service', hi: 'विश्लेषणात्मक परिशुद्धता और सेवा समर्पण' },
    6: { en: 'diplomatic balance and partnership focus', hi: 'कूटनीतिक संतुलन और साझेदारी पर ध्यान' },
    7: { en: 'intense transformation and penetrating insight', hi: 'गहन परिवर्तन और भेदक अन्तर्दृष्टि' },
    8: { en: 'philosophical expansiveness and adventurous spirit', hi: 'दार्शनिक विस्तार और साहसिक भावना' },
    9: { en: 'ambitious discipline and structural authority', hi: 'महत्वाकांक्षी अनुशासन और संरचनात्मक सत्ता' },
    10: { en: 'humanitarian vision and progressive ideals', hi: 'मानवतावादी दृष्टि और प्रगतिशील आदर्श' },
    11: { en: 'spiritual compassion and intuitive sensitivity', hi: 'आध्यात्मिक करुणा और सहज संवेदनशीलता' },
  },
  // Moon (1)
  1: {
    0: { en: 'impulsive emotions and quick reactions', hi: 'आवेगपूर्ण भावनाएँ और त्वरित प्रतिक्रियाएँ' },
    1: { en: 'emotional stability and sensory contentment', hi: 'भावनात्मक स्थिरता और इन्द्रिय संतोष' },
    2: { en: 'mental restlessness and adaptive emotional expression', hi: 'मानसिक चंचलता और अनुकूल भावात्मक अभिव्यक्ति' },
    3: { en: 'deep emotional nourishment and domestic attachment', hi: 'गहन भावनात्मक पोषण और घरेलू लगाव' },
    4: { en: 'dramatic emotions and need for admiration', hi: 'नाटकीय भावनाएँ और प्रशंसा की आवश्यकता' },
    5: { en: 'practical emotional processing and worry tendency', hi: 'व्यावहारिक भावनात्मक प्रक्रिया और चिन्ता प्रवृत्ति' },
    6: { en: 'need for harmony and emotional partnership', hi: 'सामंजस्य की आवश्यकता और भावनात्मक साझेदारी' },
    7: { en: 'intense emotional undercurrents and transformative moods', hi: 'तीव्र भावनात्मक अन्तर्धाराएँ और परिवर्तनकारी मनोदशा' },
    8: { en: 'optimistic emotional outlook and love of freedom', hi: 'आशावादी भावनात्मक दृष्टिकोण और स्वतन्त्रता प्रेम' },
    9: { en: 'disciplined emotions and cautious reserve', hi: 'अनुशासित भावनाएँ और सतर्क संयम' },
    10: { en: 'detached emotional perspective and group consciousness', hi: 'विरक्त भावनात्मक दृष्टि और सामूहिक चेतना' },
    11: { en: 'empathic absorption and spiritual emotional nature', hi: 'सहानुभूतिपूर्ण अवशोषण और आध्यात्मिक भावना' },
  },
  // Mars (2)
  2: {
    0: { en: 'fierce courage and warrior assertiveness', hi: 'प्रचंड साहस और योद्धा दृढ़ता' },
    1: { en: 'persistent determination and sensual drive', hi: 'अटल दृढ़ संकल्प और भौतिक प्रेरणा' },
    2: { en: 'sharp wit and combative debate skills', hi: 'तीक्ष्ण बुद्धि और वाद-विवाद कौशल' },
    3: { en: 'protective aggression and emotional volatility', hi: 'रक्षात्मक आक्रामकता और भावनात्मक अस्थिरता' },
    4: { en: 'dramatic courage and passionate creativity', hi: 'नाटकीय साहस और जुनूनी रचनात्मकता' },
    5: { en: 'methodical action and critical precision', hi: 'क्रमबद्ध कार्यवाही और आलोचनात्मक परिशुद्धता' },
    6: { en: 'diplomatic aggression and strategic partnerships', hi: 'कूटनीतिक आक्रामकता और रणनीतिक साझेदारी' },
    7: { en: 'intense willpower and investigative drive', hi: 'तीव्र इच्छाशक्ति और अन्वेषणात्मक प्रेरणा' },
    8: { en: 'adventurous action and philosophical combat', hi: 'साहसिक कार्यवाही और दार्शनिक युद्ध' },
    9: { en: 'disciplined ambition and enduring effort', hi: 'अनुशासित महत्वाकांक्षा और दीर्घकालिक प्रयास' },
    10: { en: 'revolutionary energy and group-oriented action', hi: 'क्रान्तिकारी ऊर्जा और सामूहिक कार्यवाही' },
    11: { en: 'diffused energy and compassionate action', hi: 'विसरित ऊर्जा और करुणामय कार्य' },
  },
  // Mercury (3)
  3: {
    0: { en: 'quick thinking and direct communication', hi: 'तीव्र विचार और सीधा संवाद' },
    1: { en: 'practical intellect and deliberate thought', hi: 'व्यावहारिक बुद्धि और विचारशील चिन्तन' },
    2: { en: 'versatile communication and intellectual agility', hi: 'बहुमुखी संवाद और बौद्धिक चपलता' },
    3: { en: 'intuitive thinking and emotional intelligence', hi: 'अन्तर्ज्ञानी चिन्तन और भावनात्मक बुद्धि' },
    4: { en: 'creative expression and theatrical communication', hi: 'रचनात्मक अभिव्यक्ति और नाट्य संवाद' },
    5: { en: 'analytical brilliance and systematic reasoning', hi: 'विश्लेषणात्मक प्रतिभा और व्यवस्थित तर्क' },
    6: { en: 'balanced judgment and persuasive diplomacy', hi: 'सन्तुलित निर्णय और प्रभावशाली कूटनीति' },
    7: { en: 'probing intellect and strategic thinking', hi: 'गहन बुद्धि और रणनीतिक चिन्तन' },
    8: { en: 'expansive learning and philosophical discourse', hi: 'विस्तृत शिक्षा और दार्शनिक प्रवचन' },
    9: { en: 'structured thinking and methodical communication', hi: 'संरचित विचार और क्रमबद्ध संवाद' },
    10: { en: 'innovative ideas and unconventional thinking', hi: 'नवोन्मेषी विचार और अपारम्परिक चिन्तन' },
    11: { en: 'imaginative mind and poetic expression', hi: 'कल्पनाशील मन और काव्यात्मक अभिव्यक्ति' },
  },
  // Jupiter (4)
  4: {
    0: { en: 'pioneering wisdom and enthusiastic faith', hi: 'अग्रणी ज्ञान और उत्साही श्रद्धा' },
    1: { en: 'material abundance and steady growth', hi: 'भौतिक समृद्धि और स्थिर वृद्धि' },
    2: { en: 'intellectual breadth and diverse learning', hi: 'बौद्धिक विस्तार और विविध शिक्षा' },
    3: { en: 'emotional generosity and family blessings', hi: 'भावनात्मक उदारता और पारिवारिक आशीर्वाद' },
    4: { en: 'creative wisdom and generous leadership', hi: 'रचनात्मक ज्ञान और उदार नेतृत्व' },
    5: { en: 'analytical expansion and service-oriented growth', hi: 'विश्लेषणात्मक विस्तार और सेवा-उन्मुख वृद्धि' },
    6: { en: 'diplomatic wisdom and partnership growth', hi: 'कूटनीतिक ज्ञान और साझेदारी में वृद्धि' },
    7: { en: 'transformative philosophy and occult knowledge', hi: 'परिवर्तनकारी दर्शन और गूढ़ ज्ञान' },
    8: { en: 'expansive philosophy and spiritual teaching', hi: 'विस्तृत दर्शन और आध्यात्मिक शिक्षण' },
    9: { en: 'structured wisdom and institutional authority', hi: 'संरचित ज्ञान और संस्थागत सत्ता' },
    10: { en: 'humanitarian philosophy and progressive values', hi: 'मानवतावादी दर्शन और प्रगतिशील मूल्य' },
    11: { en: 'spiritual devotion and universal compassion', hi: 'आध्यात्मिक भक्ति और सार्वभौमिक करुणा' },
  },
  // Venus (5)
  5: {
    0: { en: 'passionate attraction and bold aesthetics', hi: 'जुनूनी आकर्षण और साहसी सौन्दर्य' },
    1: { en: 'sensual luxury and enduring affection', hi: 'इन्द्रिय विलास और स्थायी स्नेह' },
    2: { en: 'intellectual charm and playful romance', hi: 'बौद्धिक आकर्षण और चंचल प्रेम' },
    3: { en: 'nurturing love and domestic harmony', hi: 'पोषणकारी प्रेम और घरेलू सामंजस्य' },
    4: { en: 'dramatic romance and creative expression', hi: 'नाटकीय प्रेम और रचनात्मक अभिव्यक्ति' },
    5: { en: 'refined taste and analytical appreciation', hi: 'परिष्कृत रुचि और विश्लेषणात्मक सराहना' },
    6: { en: 'harmonious partnerships and aesthetic balance', hi: 'सामंजस्यपूर्ण साझेदारी और सौन्दर्य संतुलन' },
    7: { en: 'intense desire and magnetic attraction', hi: 'तीव्र इच्छा और चुम्बकीय आकर्षण' },
    8: { en: 'adventurous love and philosophical beauty', hi: 'साहसिक प्रेम और दार्शनिक सौन्दर्य' },
    9: { en: 'mature love and status-conscious aesthetics', hi: 'परिपक्व प्रेम और स्थिति-सजग सौन्दर्य' },
    10: { en: 'unconventional love and progressive aesthetics', hi: 'अपारम्परिक प्रेम और प्रगतिशील सौन्दर्य' },
    11: { en: 'devotional love and artistic imagination', hi: 'भक्तिपूर्ण प्रेम और कलात्मक कल्पना' },
  },
  // Saturn (6)
  6: {
    0: { en: 'disciplined initiative and cautious action', hi: 'अनुशासित पहल और सतर्क कार्यवाही' },
    1: { en: 'patient accumulation and stubborn persistence', hi: 'धैर्यपूर्ण संचय और हठी दृढ़ता' },
    2: { en: 'serious communication and structured learning', hi: 'गम्भीर संवाद और संरचित शिक्षा' },
    3: { en: 'emotional restriction and family responsibilities', hi: 'भावनात्मक प्रतिबन्ध और पारिवारिक दायित्व' },
    4: { en: 'disciplined creativity and cautious self-expression', hi: 'अनुशासित रचनात्मकता और सतर्क आत्म-अभिव्यक्ति' },
    5: { en: 'meticulous service and perfectionist standards', hi: 'सूक्ष्म सेवा और पूर्णतावादी मानक' },
    6: { en: 'serious partnerships and committed relationships', hi: 'गम्भीर साझेदारी और प्रतिबद्ध सम्बन्ध' },
    7: { en: 'deep transformation through hardship and perseverance', hi: 'कठिनाई और दृढ़ता से गहन परिवर्तन' },
    8: { en: 'philosophical discipline and traditional wisdom', hi: 'दार्शनिक अनुशासन और पारम्परिक ज्ञान' },
    9: { en: 'ambitious structure and authoritative mastery', hi: 'महत्वाकांक्षी संरचना और प्रामाणिक निपुणता' },
    10: { en: 'humanitarian structure and progressive discipline', hi: 'मानवतावादी संरचना और प्रगतिशील अनुशासन' },
    11: { en: 'spiritual discipline and karmic dissolution', hi: 'आध्यात्मिक अनुशासन और कर्म विलयन' },
  },
  // Rahu (7)
  7: {
    0: { en: 'obsessive drive for independence and recognition', hi: 'स्वतन्त्रता और मान्यता के लिए जुनूनी प्रेरणा' },
    1: { en: 'intense material desires and sensory pursuits', hi: 'तीव्र भौतिक इच्छाएँ और इन्द्रिय खोज' },
    2: { en: 'restless intellect and unconventional communication', hi: 'चंचल बुद्धि और अपारम्परिक संवाद' },
    3: { en: 'emotional obsession and unconventional family dynamics', hi: 'भावनात्मक जुनून और अपारम्परिक पारिवारिक गतिशीलता' },
    4: { en: 'dramatic ambition and hunger for fame', hi: 'नाटकीय महत्वाकांक्षा और प्रसिद्धि की भूख' },
    5: { en: 'obsessive perfectionism and health anxieties', hi: 'जुनूनी पूर्णतावाद और स्वास्थ्य चिन्ता' },
    6: { en: 'intense desire for partnership and social status', hi: 'साझेदारी और सामाजिक स्थिति की तीव्र इच्छा' },
    7: { en: 'deep occult fascination and transformative obsession', hi: 'गहन गूढ़ आकर्षण और परिवर्तनकारी जुनून' },
    8: { en: 'philosophical obsession and foreign connections', hi: 'दार्शनिक जुनून और विदेशी सम्बन्ध' },
    9: { en: 'ambitious worldly drive and power pursuit', hi: 'महत्वाकांक्षी सांसारिक प्रेरणा और सत्ता खोज' },
    10: { en: 'revolutionary idealism and group obsession', hi: 'क्रान्तिकारी आदर्शवाद और सामूहिक जुनून' },
    11: { en: 'spiritual illusions and escapist tendencies', hi: 'आध्यात्मिक भ्रम और पलायनवादी प्रवृत्ति' },
  },
  // Ketu (8)
  8: {
    0: { en: 'detached courage and spiritual warrior nature', hi: 'विरक्त साहस और आध्यात्मिक योद्धा स्वभाव' },
    1: { en: 'detachment from material comfort and inner contentment', hi: 'भौतिक सुख से विरक्ति और आन्तरिक सन्तोष' },
    2: { en: 'intuitive insight beyond intellectual analysis', hi: 'बौद्धिक विश्लेषण से परे अन्तर्ज्ञानी दृष्टि' },
    3: { en: 'emotional detachment and psychic sensitivity', hi: 'भावनात्मक विरक्ति और अतीन्द्रिय संवेदनशीलता' },
    4: { en: 'detachment from ego and selfless creativity', hi: 'अहंकार से विरक्ति और निस्वार्थ रचनात्मकता' },
    5: { en: 'spiritual healing and transcendence of critique', hi: 'आध्यात्मिक चिकित्सा और आलोचना का अतिक्रमण' },
    6: { en: 'past-life relationship karma and spiritual partnerships', hi: 'पूर्वजन्म सम्बन्ध कर्म और आध्यात्मिक साझेदारी' },
    7: { en: 'mystical insight and transcendence of fear', hi: 'रहस्यात्मक अन्तर्दृष्टि और भय का अतिक्रमण' },
    8: { en: 'innate philosophical wisdom and past-life learning', hi: 'सहज दार्शनिक ज्ञान और पूर्वजन्म शिक्षा' },
    9: { en: 'renunciation of worldly ambition and inner authority', hi: 'सांसारिक महत्वाकांक्षा का त्याग और आन्तरिक सत्ता' },
    10: { en: 'spiritual detachment from groups and revolutionary insight', hi: 'समूहों से आध्यात्मिक विरक्ति और क्रान्तिकारी दृष्टि' },
    11: { en: 'deep liberation and moksha-oriented surrender', hi: 'गहन मुक्ति और मोक्षोन्मुख समर्पण' },
  },
};

/** Generate interpretive commentary for a planet that shifts signs across ayanamsha systems. */
function getSignShiftCommentary(
  planetId: number,
  planetName: string,
  lahiriSignIdx: number,
  ramanSignIdx: number,
  kpSignIdx: number,
  locale: string,
): string {
  const isHi = isDevanagariLocale(locale);
  const sign1Name = tl(RASHIS[lahiriSignIdx]?.name, locale) || `Sign ${lahiriSignIdx + 1}`;
  const sign2Name = tl(RASHIS[ramanSignIdx]?.name, locale) || `Sign ${ramanSignIdx + 1}`;
  const sign3Name = tl(RASHIS[kpSignIdx]?.name, locale) || `Sign ${kpSignIdx + 1}`;

  // Determine which systems agree
  const lahiriKpSame = lahiriSignIdx === kpSignIdx;
  const allDifferent = lahiriSignIdx !== ramanSignIdx && lahiriSignIdx !== kpSignIdx && ramanSignIdx !== kpSignIdx;

  const flavor1 = PLANET_IN_SIGN_FLAVOR[planetId]?.[lahiriSignIdx];
  const flavor2 = PLANET_IN_SIGN_FLAVOR[planetId]?.[ramanSignIdx];

  if (!flavor1 || !flavor2) return '';

  const f1 = isHi ? flavor1.hi : flavor1.en;
  const f2 = isHi ? flavor2.hi : flavor2.en;

  if (isHi) {
    const systemNote = lahiriKpSame
      ? `लाहिरी/कृष्णमूर्ति में ${sign1Name}, रमन में ${sign2Name}`
      : allDifferent
        ? `लाहिरी में ${sign1Name}, रमन में ${sign2Name}, कृष्णमूर्ति में ${sign3Name}`
        : `लाहिरी में ${sign1Name}, रमन/कृष्णमूर्ति में ${sign2Name}`;
    return `${planetName} — ${systemNote}: ${sign1Name} में ${planetName} ${f1} व्यक्त करता है। ${sign2Name} में, ${f2} का मार्ग अपनाता है। यह एक सार्थक अन्तर है — आपके ज्योतिषी द्वारा उपयोग की जाने वाली पद्धति के अनुसार ${planetName} की व्याख्या भिन्न होगी।`;
  }

  const systemNote = lahiriKpSame
    ? `${sign1Name} (Lahiri/KP) vs ${sign2Name} (Raman)`
    : allDifferent
      ? `${sign1Name} (Lahiri) vs ${sign2Name} (Raman) vs ${sign3Name} (KP)`
      : `${sign1Name} (Lahiri) vs ${sign2Name} (Raman/KP)`;

  return `${planetName} — ${systemNote}: In ${sign1Name}, ${planetName} expresses ${f1}. In ${sign2Name}, ${planetName} channels ${f2}. This is a meaningful difference — your ${planetName} reading will vary depending on which ayanamsha system your astrologer follows.`;
}

/** Expandable commentary cards for planets with sign shifts. */
function SignShiftCommentary({ planets, locale }: { planets: PlanetRow[]; locale: string }) {
  const shifted = planets.filter(p => p.hasSignChange && p.id >= 0); // exclude Lagna (id=-1)
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (shifted.length === 0) return null;

  const isHi = isDevanagariLocale(locale);

  return (
    <div className="mt-5">
      <h4 className="text-gold-light text-xs font-bold mb-3 text-center">
        {isHi ? 'राशि परिवर्तन विश्लेषण' : 'Sign Shift Analysis'}
      </h4>
      <div className="flex flex-col gap-2">
        {shifted.map((row) => {
          const lahiriSign = Math.floor(((row.positions.lahiri % 360) + 360) % 360 / 30);
          const ramanSign = Math.floor(((row.positions.raman % 360) + 360) % 360 / 30);
          const kpSign = Math.floor(((row.positions.krishnamurti % 360) + 360) % 360 / 30);
          const commentary = getSignShiftCommentary(row.id, row.name, lahiriSign, ramanSign, kpSign, locale);
          if (!commentary) return null;

          const isExpanded = expandedId === row.id;

          return (
            <button
              key={row.id}
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : row.id)}
              className="w-full text-left rounded-lg bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-amber-400/15 hover:border-amber-400/30 p-3 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-amber-300 text-xs font-bold">
                  {row.name}
                </span>
                <span className="text-text-secondary text-xs">
                  {isExpanded ? '−' : '+'}
                </span>
              </div>
              {isExpanded && (
                <p className="text-text-secondary text-xs mt-2 leading-relaxed">
                  {commentary}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AyanamshaComparison({ kundali, locale }: AyanamshaComparisonProps) {
  const rows = useMemo(() => {
    const jd = kundali.julianDay;
    const lahiriAya = kundali.ayanamshaValue;
    const ramanAya = getAyanamsa(jd, 'raman');
    const kpAya = getAyanamsa(jd, 'krishnamurti');

    // Compute planet rows
    const planetRows: PlanetRow[] = kundali.planets.map((p: PlanetPosition) => {
      // p.longitude is sidereal (Lahiri). Convert back to tropical, then to each system.
      const tropicalLong = p.longitude + lahiriAya;
      const lahiriLong = tropicalLong - lahiriAya; // same as p.longitude
      const ramanLong = ((tropicalLong - ramanAya) % 360 + 360) % 360;
      const kpLong = ((tropicalLong - kpAya) % 360 + 360) % 360;

      const lahiriSign = Math.floor(lahiriLong / 30);
      const ramanSign = Math.floor(ramanLong / 30);
      const kpSign = Math.floor(kpLong / 30);

      return {
        id: p.planet.id,
        name: tl(p.planet.name, locale),
        positions: { lahiri: lahiriLong, raman: ramanLong, krishnamurti: kpLong },
        hasSignChange: lahiriSign !== ramanSign || lahiriSign !== kpSign,
      };
    });

    // Add Lagna row
    const ascLong = kundali.ascendant.degree;
    const tropAsc = ascLong + lahiriAya;
    const ramanAsc = ((tropAsc - ramanAya) % 360 + 360) % 360;
    const kpAsc = ((tropAsc - kpAya) % 360 + 360) % 360;
    const lahiriAscSign = Math.floor(ascLong / 30);
    const ramanAscSign = Math.floor(ramanAsc / 30);
    const kpAscSign = Math.floor(kpAsc / 30);

    planetRows.push({
      id: -1,
      name: locale === 'hi' ? 'लग्न' : 'Lagna',
      positions: { lahiri: ascLong, raman: ramanAsc, krishnamurti: kpAsc },
      hasSignChange: lahiriAscSign !== ramanAscSign || lahiriAscSign !== kpAscSign,
    });

    return {
      planets: planetRows,
      ayanamshaValues: {
        lahiri: lahiriAya,
        raman: ramanAya,
        krishnamurti: kpAya,
      },
    };
  }, [kundali, locale]);

  return (
    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 p-4 sm:p-6">
      <h3 className="text-gold-light text-sm font-bold mb-4 text-center">
        {locale === 'hi' ? 'अयनांश तुलना' : 'Ayanamsha Comparison'}
      </h3>

      {/* Ayanamsha values */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {AYANAMSHA_SYSTEMS.map((sys) => (
          <div key={sys.key} className="text-center p-2 rounded-lg bg-bg-secondary/50 border border-gold-primary/10">
            <div className="text-gold-light text-xs font-bold">{sys.label}</div>
            <div className="text-text-primary text-sm font-mono mt-0.5">
              {rows.ayanamshaValues[sys.key].toFixed(4)}°
            </div>
            <div className="text-text-secondary text-xs mt-0.5 hidden sm:block">{sys.desc}</div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-text-secondary font-medium">
                {locale === 'hi' ? 'ग्रह' : 'Planet'}
              </th>
              <th className="text-center py-2 px-2 text-gold-light font-bold">Lahiri</th>
              <th className="text-center py-2 px-2 text-gold-light font-bold">Raman</th>
              <th className="text-center py-2 px-2 text-gold-light font-bold">KP</th>
            </tr>
          </thead>
          <tbody>
            {rows.planets.map((row) => {
              const lahiri = formatPosition(row.positions.lahiri, locale);
              const raman = formatPosition(row.positions.raman, locale);
              const kp = formatPosition(row.positions.krishnamurti, locale);

              return (
                <tr
                  key={row.id}
                  className={`border-b border-gold-primary/5 ${
                    row.hasSignChange ? 'bg-amber-500/8' : ''
                  } ${row.id === -1 ? 'font-bold' : ''}`}
                >
                  <td className="py-2 px-2 text-text-primary whitespace-nowrap">
                    {row.name}
                    {row.hasSignChange && (
                      <span
                        className="ml-1.5 inline-block w-2 h-2 rounded-full bg-amber-400"
                        title={locale === 'hi'
                          ? 'भिन्न अयनांश में राशि परिवर्तन'
                          : 'Sign changes across ayanamshas'}
                      />
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-text-primary whitespace-nowrap">
                    {lahiri.formatted}
                  </td>
                  <td className={`py-2 px-2 text-center whitespace-nowrap ${
                    raman.signIndex !== lahiri.signIndex ? 'text-amber-300' : 'text-text-primary'
                  }`}>
                    {raman.formatted}
                  </td>
                  <td className={`py-2 px-2 text-center whitespace-nowrap ${
                    kp.signIndex !== lahiri.signIndex ? 'text-amber-300' : 'text-text-primary'
                  }`}>
                    {kp.formatted}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sign Shift Commentary */}
      <SignShiftCommentary planets={rows.planets} locale={locale} />

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 justify-center">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-text-secondary text-xs">
          {locale === 'hi'
            ? 'एम्बर = इस अयनांश में राशि भिन्न है'
            : 'Amber = sign differs from Lahiri in this ayanamsha'}
        </span>
      </div>

      <p className="text-text-secondary/60 text-xs text-center mt-3">
        {locale === 'hi'
          ? 'राशि सन्धि पर स्थित ग्रह अयनांश के अनुसार राशि बदल सकते हैं। अधिकांश ज्योतिषी लाहिरी का प्रयोग करते हैं।'
          : 'Planets near sign boundaries may shift signs depending on the ayanamsha. Most Vedic astrologers use Lahiri (Chitrapaksha). KP practitioners use Krishnamurti. B.V. Raman\'s system is popular in South India.'}
      </p>
    </div>
  );
}
