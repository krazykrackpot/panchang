/**
 * Narrator V2 — Emotionally Intelligent Domain Narrative Enhancement
 *
 * Three composable functions that wrap/enhance the existing narrator's output:
 *
 * 1. narrateWithEmpathy  — Progressive disclosure for difficult readings (adhama/atyadhama)
 * 2. narrateStrength      — Celebratory + actionable language for strong readings (uttama)
 * 3. generateActionPlan   — Structured modern guidance for ALL domains
 *
 * Output is bilingual (en + hi). Devanagari-script locales (mr, mai, sa)
 * receive hi text via the isDevanagariLocale pattern.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { LocaleText } from '@/types/panchang';
import type { DomainReading, DomainType, Rating, TimelineTrigger, DomainRemedy } from './types';
import { DOMAIN_CONFIGS } from './config';

// ---------------------------------------------------------------------------
// ActionPlan interface
// ---------------------------------------------------------------------------

export interface ActionPlan {
  /** Modern practical guidance */
  lifestyle: LocaleText;
  /** Next 3 favorable days (ISO date strings) for this domain's activities */
  bestDays: string[];
  /** What to avoid and when */
  avoid: LocaleText;
  /** Positive daily affirmation */
  affirmation: LocaleText;
  /** One specific thing to do this week */
  weeklyPractice: LocaleText;
}

// ---------------------------------------------------------------------------
// Planet data maps
// ---------------------------------------------------------------------------

const PLANET_NAMES_EN: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

const PLANET_NAMES_HI: Record<number, string> = {
  0: 'सूर्य', 1: 'चन्द्र', 2: 'मंगल', 3: 'बुध',
  4: 'बृहस्पति', 5: 'शुक्र', 6: 'शनि', 7: 'राहु', 8: 'केतु',
};

/** Planet ID → day of week (0=Sunday ... 6=Saturday) */
const PLANET_DAY: Record<number, number> = {
  0: 0, // Sun → Sunday
  1: 1, // Moon → Monday
  2: 2, // Mars → Tuesday
  3: 3, // Mercury → Wednesday
  4: 4, // Jupiter → Thursday
  5: 5, // Venus → Friday
  6: 6, // Saturn → Saturday
};

const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const DOMAIN_NAMES_EN: Record<DomainType, string> = {
  currentPeriod: 'current period',
  health: 'health', wealth: 'wealth', career: 'career',
  marriage: 'marriage', children: 'children', family: 'family',
  spiritual: 'spiritual growth', education: 'education',
};

const DOMAIN_NAMES_HI: Record<DomainType, string> = {
  currentPeriod: 'वर्तमान काल',
  health: 'स्वास्थ्य', wealth: 'धन', career: 'करियर',
  marriage: 'विवाह', children: 'संतान', family: 'परिवार',
  spiritual: 'आध्यात्मिक विकास', education: 'शिक्षा',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickLocale(en: string, hi: string, locale: string): string {
  // Devanagari-script locales get hi text
  if (locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai') return hi;
  return en;
}

function domainName(domain: DomainType, locale: string): string {
  return pickLocale(DOMAIN_NAMES_EN[domain], DOMAIN_NAMES_HI[domain], locale);
}

function planetName(id: number, locale: string): string {
  return pickLocale(PLANET_NAMES_EN[id] ?? 'Planet', PLANET_NAMES_HI[id] ?? 'ग्रह', locale);
}

/** Get the primary planet for a domain from its config */
function getDomainPrimaryPlanet(domain: DomainType): number {
  const cfg = DOMAIN_CONFIGS.find(c => c.id === domain);
  return cfg?.primaryPlanets[0] ?? 0;
}

/** Find the first positive timeline trigger (opportunity or mixed) */
function findPositiveTrigger(triggers: TimelineTrigger[]): TimelineTrigger | undefined {
  return triggers.find(t => t.nature === 'opportunity') ?? triggers.find(t => t.nature === 'mixed');
}

/** Find the first challenge trigger */
function findChallengeTrigger(triggers: TimelineTrigger[]): TimelineTrigger | undefined {
  return triggers.find(t => t.nature === 'challenge');
}

/** Find the best natal sub-score from houseScores or lord qualities */
function findBestStrength(reading: DomainReading): { en: string; hi: string } {
  // Check supporting yogas first — most meaningful
  if (reading.natalPromise.supportingYogas.length > 0) {
    const best = reading.natalPromise.supportingYogas.reduce(
      (a, b) => (b.strength > a.strength ? b : a),
      reading.natalPromise.supportingYogas[0],
    );
    return { en: best.name.en, hi: best.name.hi ?? best.name.en };
  }

  // Check lord qualities for best dignity
  const lords = reading.natalPromise.lordQualities;
  if (lords.length > 0) {
    const best = lords.reduce((a, b) => (b.score > a.score ? b : a), lords[0]);
    const pEn = PLANET_NAMES_EN[best.lordId] ?? 'a planet';
    const pHi = PLANET_NAMES_HI[best.lordId] ?? 'एक ग्रह';
    return {
      en: `${pEn}'s placement in the ${best.houseInD1}${ordSuffix(best.houseInD1)} house`,
      hi: `${pHi} की ${best.houseInD1}वें भाव में स्थिति`,
    };
  }

  // Check benefic transits
  const beneficTransit = reading.currentActivation.transitInfluences.find(t => t.nature === 'benefic');
  if (beneficTransit) {
    const pEn = PLANET_NAMES_EN[beneficTransit.planetId] ?? 'a benefic planet';
    const pHi = PLANET_NAMES_HI[beneficTransit.planetId] ?? 'एक शुभ ग्रह';
    return { en: `${pEn}'s supportive transit`, hi: `${pHi} का सहायक गोचर` };
  }

  return { en: 'underlying resilience in the chart', hi: 'कुंडली में अंतर्निहित लचीलापन' };
}

/** Find the primary challenge from afflictions or malefic transits */
function findPrimaryChallenge(reading: DomainReading): { en: string; hi: string } {
  // Severe afflictions first
  const severe = reading.natalPromise.activeAfflictions.find(a => a.severity === 'severe');
  if (severe) return { en: severe.name.en, hi: severe.name.hi ?? severe.name.en };

  // Any affliction
  if (reading.natalPromise.activeAfflictions.length > 0) {
    const aff = reading.natalPromise.activeAfflictions[0];
    return { en: aff.name.en, hi: aff.name.hi ?? aff.name.en };
  }

  // Malefic transit
  const malefic = reading.currentActivation.transitInfluences.find(t => t.nature === 'malefic');
  if (malefic) {
    const pEn = PLANET_NAMES_EN[malefic.planetId] ?? 'a planet';
    const pHi = PLANET_NAMES_HI[malefic.planetId] ?? 'एक ग्रह';
    return { en: `${pEn}'s challenging transit`, hi: `${pHi} का चुनौतीपूर्ण गोचर` };
  }

  // Weak lord
  const weakLord = reading.natalPromise.lordQualities.find(l => l.dignity === 'debilitated' || l.dignity === 'enemy');
  if (weakLord) {
    const pEn = PLANET_NAMES_EN[weakLord.lordId] ?? 'a planet';
    const pHi = PLANET_NAMES_HI[weakLord.lordId] ?? 'एक ग्रह';
    return { en: `${pEn}'s weakened dignity`, hi: `${pHi} की कमजोर गरिमा` };
  }

  return { en: 'certain karmic patterns', hi: 'कुछ कार्मिक पैटर्न' };
}

function ordSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/** Get the maha-dasha lord's name */
function dashaPlanetName(reading: DomainReading, locale: string): string {
  return planetName(reading.currentActivation.mahaDashaLordId, locale);
}

/** Format an ISO date as a short readable string */
function formatDate(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    if (locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai') {
      const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
      return `${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

/** Get the next N occurrences of a given weekday from today */
function getNextDaysForWeekday(weekday: number, count: number): string[] {
  const results: string[] = [];
  const today = new Date();
  let d = new Date(today);
  // Advance to first occurrence of the weekday
  while (d.getDay() !== weekday) {
    d.setDate(d.getDate() + 1);
  }
  for (let i = 0; i < count; i++) {
    results.push(d.toISOString().slice(0, 10));
    d = new Date(d);
    d.setDate(d.getDate() + 7);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Lifestyle guidance templates
// ---------------------------------------------------------------------------

interface LifestyleTemplate {
  condition: (r: DomainReading) => boolean;
  en: string;
  hi: string;
}

const LIFESTYLE_TEMPLATES: Record<DomainType, LifestyleTemplate[]> = {
  career: [
    {
      condition: r => (r.overallRating.rating === 'adhama' || r.overallRating.rating === 'atyadhama') && r.currentActivation.transitInfluences.some(t => t.planetId === 6),
      en: 'This is a consolidation period. Focus on skill-building and deepening expertise, not promotions or job changes. Saturn demands patience — invest in your craft.',
      hi: 'यह एक समेकन काल है। पदोन्नति या नौकरी बदलने के बजाय कौशल-निर्माण पर ध्यान दें। शनि धैर्य की मांग करता है — अपनी कला में निवेश करें।',
    },
    {
      condition: r => r.overallRating.rating === 'uttama',
      en: 'Your career energy is at its peak. This is the time for bold professional moves — launch that project, seek that promotion, or pivot to your true calling.',
      hi: 'आपकी करियर ऊर्जा चरम पर है। यह साहसिक पेशेवर कदम उठाने का समय है — वह प्रोजेक्ट शुरू करें, पदोन्नति के लिए प्रयास करें।',
    },
    {
      condition: () => true,
      en: 'Steady professional growth is indicated. Focus on building strong work relationships and delivering consistent results. Systematic progress is favored over dramatic leaps.',
      hi: 'स्थिर व्यावसायिक वृद्धि का संकेत है। मजबूत कार्य संबंध बनाने और सुसंगत परिणाम देने पर ध्यान दें।',
    },
  ],
  marriage: [
    {
      condition: r => r.overallRating.rating === 'uttama' && r.currentActivation.transitInfluences.some(t => t.planetId === 5),
      en: 'Your relationship energy is at its peak. Prioritize quality time and heartfelt communication. This is an ideal window for deepening commitment or rekindling romance.',
      hi: 'आपकी संबंध ऊर्जा चरम पर है। गुणवत्तापूर्ण समय और हार्दिक संवाद को प्राथमिकता दें। यह प्रतिबद्धता गहरा करने का आदर्श समय है।',
    },
    {
      condition: r => r.overallRating.rating === 'adhama' || r.overallRating.rating === 'atyadhama',
      en: 'Relationships require extra patience now. Avoid major confrontations and focus on understanding your partner\'s perspective. Small, consistent gestures of care matter more than grand romantic moves.',
      hi: 'संबंधों में अभी अतिरिक्त धैर्य की आवश्यकता है। बड़े टकरावों से बचें और अपने साथी के दृष्टिकोण को समझने पर ध्यान दें।',
    },
    {
      condition: () => true,
      en: 'Steady relationship energy. Focus on building trust through daily acts of kindness. Open, honest communication strengthens your bond during this period.',
      hi: 'स्थिर संबंध ऊर्जा। दैनिक दया के कार्यों से विश्वास बनाएं। खुला, ईमानदार संवाद इस अवधि में आपके बंधन को मजबूत करता है।',
    },
  ],
  health: [
    {
      condition: r => (r.overallRating.rating === 'adhama' || r.overallRating.rating === 'atyadhama') && r.currentActivation.transitInfluences.some(t => t.planetId === 2),
      en: 'Pay extra attention to inflammation, stress, and energy management. Regular moderate exercise is crucial now — avoid extremes. Prioritize sleep and anti-inflammatory foods.',
      hi: 'सूजन, तनाव और ऊर्जा प्रबंधन पर विशेष ध्यान दें। नियमित मध्यम व्यायाम अभी महत्वपूर्ण है — चरम सीमाओं से बचें। नींद और सूजन-रोधी आहार को प्राथमिकता दें।',
    },
    {
      condition: r => r.overallRating.rating === 'uttama',
      en: 'Your vitality is strong. This is the time to establish healthy routines that will serve you for years. Consider starting a new fitness regimen or wellness practice.',
      hi: 'आपकी जीवन शक्ति मजबूत है। यह स्वस्थ दिनचर्या स्थापित करने का समय है जो वर्षों तक आपकी सेवा करेगी।',
    },
    {
      condition: () => true,
      en: 'Maintain a balanced approach to health. Regular routine, adequate rest, and mindful eating form your foundation. Listen to your body\'s signals and address small issues before they grow.',
      hi: 'स्वास्थ्य के प्रति संतुलित दृष्टिकोण बनाए रखें। नियमित दिनचर्या, पर्याप्त विश्राम और सचेत भोजन आपकी नींव हैं।',
    },
  ],
  wealth: [
    {
      condition: r => r.overallRating.rating === 'uttama',
      en: 'Financial opportunities are flowing. This is the time for strategic investments and expanding income streams. Your ability to attract abundance is heightened.',
      hi: 'वित्तीय अवसर बह रहे हैं। यह रणनीतिक निवेश और आय स्रोत बढ़ाने का समय है। आपकी प्रचुरता आकर्षित करने की क्षमता बढ़ी हुई है।',
    },
    {
      condition: r => r.overallRating.rating === 'adhama' || r.overallRating.rating === 'atyadhama',
      en: 'Financial caution is warranted. Avoid speculative ventures and large purchases. Focus on saving, reducing debt, and building an emergency fund. Frugality now brings abundance later.',
      hi: 'वित्तीय सावधानी उचित है। सट्टेबाजी और बड़ी खरीदारी से बचें। बचत, ऋण कम करने और आपातकालीन कोष बनाने पर ध्यान दें।',
    },
    {
      condition: () => true,
      en: 'Steady growth phase. Systematic investments favored over speculative ventures. Build a diversified portfolio and maintain consistent saving habits.',
      hi: 'स्थिर वृद्धि चरण। सट्टेबाजी से अधिक व्यवस्थित निवेश को प्राथमिकता दें। विविध पोर्टफोलियो बनाएं और निरंतर बचत आदतें बनाए रखें।',
    },
  ],
  children: [
    {
      condition: r => r.overallRating.rating === 'uttama',
      en: 'Your nurturing energy is exceptionally strong. Children thrive under your guidance now. This is an ideal time for creative activities with children or for those planning to start a family.',
      hi: 'आपकी पोषण ऊर्जा असाधारण रूप से मजबूत है। बच्चे अभी आपके मार्गदर्शन में फलते-फूलते हैं।',
    },
    {
      condition: () => true,
      en: 'Focus on quality interactions with children and creative self-expression. Patience and consistent presence matter more than perfection in parenting.',
      hi: 'बच्चों के साथ गुणवत्तापूर्ण बातचीत और रचनात्मक आत्म-अभिव्यक्ति पर ध्यान दें। पालन-पोषण में परिपूर्णता से अधिक धैर्य और निरंतर उपस्थिति मायने रखती है।',
    },
  ],
  family: [
    {
      condition: r => r.overallRating.rating === 'adhama' || r.overallRating.rating === 'atyadhama',
      en: 'Family dynamics may feel strained. Prioritize empathy over being right. Regular family meals and shared activities rebuild bonds. Address conflicts calmly, one at a time.',
      hi: 'पारिवारिक गतिशीलता तनावपूर्ण लग सकती है। सही होने से अधिक सहानुभूति को प्राथमिकता दें। नियमित पारिवारिक भोजन और साझा गतिविधियां बंधन को मजबूत करती हैं।',
    },
    {
      condition: () => true,
      en: 'Nurture family bonds through regular quality time. Home improvements and property matters are well-supported. Honoring elders and traditions brings blessings.',
      hi: 'नियमित गुणवत्तापूर्ण समय से पारिवारिक बंधनों को पोषित करें। घर में सुधार और संपत्ति के मामले अच्छी तरह से समर्थित हैं।',
    },
  ],
  spiritual: [
    {
      condition: r => r.overallRating.rating === 'uttama',
      en: 'Your spiritual receptivity is exceptionally high. Meditation, pilgrimages, and deep study will yield profound insights. Trust your intuition — it is a reliable guide now.',
      hi: 'आपकी आध्यात्मिक ग्रहणशीलता असाधारण रूप से उच्च है। ध्यान, तीर्थयात्रा और गहन अध्ययन गहन अंतर्दृष्टि देंगे।',
    },
    {
      condition: () => true,
      en: 'Maintain a daily meditation or prayer practice, even if brief. Spiritual growth happens in small, consistent steps. Reading sacred texts and spending time in nature nourishes the soul.',
      hi: 'दैनिक ध्यान या प्रार्थना अभ्यास बनाए रखें, भले ही संक्षिप्त हो। आध्यात्मिक विकास छोटे, निरंतर कदमों में होता है।',
    },
  ],
  education: [
    {
      condition: r => r.overallRating.rating === 'uttama',
      en: 'Your intellectual absorption is at its peak. Take on challenging courses, certifications, or research. Your capacity for deep learning is maximized — use this window well.',
      hi: 'आपकी बौद्धिक अवशोषण क्षमता चरम पर है। चुनौतीपूर्ण पाठ्यक्रम, प्रमाणपत्र या शोध करें।',
    },
    {
      condition: () => true,
      en: 'Steady learning energy supports skill development. Focus on structured study plans and consistent daily practice. Teaching others reinforces your own understanding.',
      hi: 'स्थिर सीखने की ऊर्जा कौशल विकास का समर्थन करती है। संरचित अध्ययन योजनाओं और निरंतर दैनिक अभ्यास पर ध्यान दें।',
    },
  ],
  currentPeriod: [
    {
      condition: () => true,
      en: 'Stay present and responsive to the energies of this period. Balance action with reflection.',
      hi: 'इस अवधि की ऊर्जाओं के प्रति उपस्थित और प्रतिक्रियाशील रहें। क्रिया को चिंतन से संतुलित करें।',
    },
  ],
};

// ---------------------------------------------------------------------------
// Affirmation templates per domain
// ---------------------------------------------------------------------------

const AFFIRMATIONS: Record<DomainType, { en: string; hi: string }> = {
  health:       { en: 'My body is strong, resilient, and capable of healing. I honor it with care and gratitude.', hi: 'मेरा शरीर मजबूत, लचीला और उपचार में सक्षम है। मैं इसका देखभाल और कृतज्ञता से सम्मान करता/करती हूं।' },
  wealth:       { en: 'Abundance flows to me through right action and wise choices. I am worthy of prosperity.', hi: 'सही कर्म और बुद्धिमान चयन से प्रचुरता मेरी ओर बहती है। मैं समृद्धि का पात्र हूं।' },
  career:       { en: 'I bring unique value to my work. My efforts are recognized and my path unfolds with purpose.', hi: 'मैं अपने कार्य में अद्वितीय मूल्य लाता/लाती हूं। मेरे प्रयास पहचाने जाते हैं और मेरा मार्ग उद्देश्य से प्रकट होता है।' },
  marriage:     { en: 'I attract and nurture love with an open heart. My relationships grow deeper with every shared moment.', hi: 'मैं खुले दिल से प्रेम आकर्षित और पोषित करता/करती हूं। मेरे संबंध हर साझा पल के साथ गहरे होते हैं।' },
  children:     { en: 'I am a patient, loving guide. My nurturing energy creates a safe space for growth and joy.', hi: 'मैं एक धैर्यवान, प्रेमपूर्ण मार्गदर्शक हूं। मेरी पोषण ऊर्जा विकास और आनंद के लिए एक सुरक्षित स्थान बनाती है।' },
  family:       { en: 'My family is my strength. I contribute love, stability, and understanding to those I cherish.', hi: 'मेरा परिवार मेरी शक्ति है। मैं अपने प्रियजनों को प्रेम, स्थिरता और समझ प्रदान करता/करती हूं।' },
  spiritual:    { en: 'I am connected to a wisdom greater than myself. Each day, my inner light grows brighter.', hi: 'मैं अपने से परे एक ज्ञान से जुड़ा/जुड़ी हूं। हर दिन, मेरा आंतरिक प्रकाश उज्जवल होता जाता है।' },
  education:    { en: 'My mind is sharp, curious, and ever-expanding. Knowledge flows to me effortlessly.', hi: 'मेरा मन तीक्ष्ण, जिज्ञासु और सदैव विस्तारित है। ज्ञान सहज रूप से मेरी ओर बहता है।' },
  currentPeriod:{ en: 'I navigate this period with clarity and grace. Every challenge is an opportunity for growth.', hi: 'मैं इस अवधि को स्पष्टता और कृपा से नेविगेट करता/करती हूं। हर चुनौती विकास का अवसर है।' },
};

// ---------------------------------------------------------------------------
// Weekly practice templates
// ---------------------------------------------------------------------------

const WEEKLY_PRACTICES: Record<DomainType, { en: string; hi: string }[]> = {
  health:       [
    { en: 'Dedicate 20 minutes every morning this week to a mindful walk or gentle yoga. Notice how your body feels without judgment.', hi: 'इस सप्ताह हर सुबह 20 मिनट सचेत चलने या सौम्य योग के लिए समर्पित करें।' },
  ],
  wealth:       [
    { en: 'Review your monthly expenses and identify one recurring cost you can reduce or eliminate. Redirect that amount to savings.', hi: 'अपने मासिक खर्चों की समीक्षा करें और एक आवर्ती लागत की पहचान करें जिसे आप कम कर सकते हैं।' },
  ],
  career:       [
    { en: 'Reach out to one professional contact you have not spoken to recently. A genuine 10-minute conversation can open unexpected doors.', hi: 'एक पेशेवर संपर्क से जुड़ें जिनसे आपने हाल ही में बात नहीं की है। एक सच्ची 10 मिनट की बातचीत अप्रत्याशित दरवाजे खोल सकती है।' },
  ],
  marriage:     [
    { en: 'Plan one undistracted, device-free evening with your partner this week. Focus on listening and being present.', hi: 'इस सप्ताह अपने साथी के साथ एक बिना ध्यान भटकाए, डिवाइस-मुक्त शाम की योजना बनाएं।' },
  ],
  children:     [
    { en: 'Set aside one hour this week for a creative activity with your children — art, cooking, or storytelling. No screens, just presence.', hi: 'इस सप्ताह बच्चों के साथ एक रचनात्मक गतिविधि के लिए एक घंटा अलग रखें — कला, खाना बनाना या कहानी सुनाना।' },
  ],
  family:       [
    { en: 'Call or visit one family member you have not connected with recently. Express gratitude for something specific they have done for you.', hi: 'एक ऐसे परिवार के सदस्य को कॉल करें या मिलें जिनसे आप हाल ही में नहीं मिले। उन्होंने आपके लिए जो किया उसके लिए कृतज्ञता व्यक्त करें।' },
  ],
  spiritual:    [
    { en: 'Commit to 10 minutes of silent meditation every morning this week. If the mind wanders, gently return to the breath without self-criticism.', hi: 'इस सप्ताह हर सुबह 10 मिनट मौन ध्यान के लिए प्रतिबद्ध हों। यदि मन भटके, तो आत्म-आलोचना के बिना धीरे से श्वास पर लौटें।' },
  ],
  education:    [
    { en: 'Spend 30 minutes daily reading or studying a topic that genuinely excites you — unrelated to obligations. Curiosity-driven learning sticks deeper.', hi: 'प्रतिदिन 30 मिनट एक ऐसे विषय को पढ़ने या अध्ययन करने में बिताएं जो आपको सचमुच उत्साहित करता है।' },
  ],
  currentPeriod:[
    { en: 'Journal for 5 minutes each evening about what went well today and what you are grateful for.', hi: 'हर शाम 5 मिनट इस बारे में लिखें कि आज क्या अच्छा रहा और आप किसके लिए आभारी हैं।' },
  ],
};

// ---------------------------------------------------------------------------
// 1. narrateWithEmpathy — Progressive disclosure for difficult readings
// ---------------------------------------------------------------------------

/**
 * For domains scoring adhama (< 5.0) or atyadhama (< 3.0), restructures
 * the narrative into a 5-step empathetic framework:
 *
 * 1. Acknowledge ONE strength
 * 2. Name the challenge
 * 3. Time context
 * 4. Concrete remedy
 * 5. Hope
 *
 * Returns the original narrative wrapped in LocaleText for non-weak domains.
 */
export function narrateWithEmpathy(domainReading: DomainReading, locale: string): LocaleText {
  const rating = domainReading.overallRating.rating;

  // Only apply empathy framework to weak/very weak domains
  if (rating !== 'adhama' && rating !== 'atyadhama') {
    return domainReading.detailedNarrative;
  }

  const domain = domainReading.domain;
  const domEn = DOMAIN_NAMES_EN[domain];
  const domHi = DOMAIN_NAMES_HI[domain];

  // Step 1: Acknowledge ONE strength
  const strength = findBestStrength(domainReading);
  const step1En = `Your ${domEn} has the support of ${strength.en}.`;
  const step1Hi = `आपके ${domHi} को ${strength.hi} का सहारा है।`;

  // Step 2: Name the challenge
  const challenge = findPrimaryChallenge(domainReading);
  const step2En = `However, ${challenge.en} creates friction in this area.`;
  const step2Hi = `हालांकि, ${challenge.hi} इस क्षेत्र में घर्षण पैदा करता है।`;

  // Step 3: Time context
  const mahaDasha = dashaPlanetName(domainReading, 'en');
  const mahaDashaHi = dashaPlanetName(domainReading, 'hi');
  const positiveTrigger = findPositiveTrigger(domainReading.timelineTriggers);
  let step3En: string;
  let step3Hi: string;
  if (positiveTrigger) {
    const dateEn = formatDate(positiveTrigger.startDate, 'en');
    const dateHi = formatDate(positiveTrigger.startDate, 'hi');
    step3En = `This intensifies during the current ${mahaDasha} dasha and eases around ${dateEn} when a favorable shift arrives.`;
    step3Hi = `यह वर्तमान ${mahaDashaHi} दशा के दौरान तीव्र होता है और ${dateHi} के आसपास एक अनुकूल परिवर्तन आने पर आसान होता है।`;
  } else {
    step3En = `This pattern is active during the current ${mahaDasha} dasha period. The intensity naturally shifts as planetary periods change.`;
    step3Hi = `यह पैटर्न वर्तमान ${mahaDashaHi} दशा काल के दौरान सक्रिय है। ग्रहीय अवधि बदलने पर तीव्रता स्वाभाविक रूप से बदलती है।`;
  }

  // Step 4: Concrete remedy
  let step4En: string;
  let step4Hi: string;
  if (domainReading.remedies.length > 0) {
    const remedy = domainReading.remedies[0];
    const dayNum = PLANET_DAY[remedy.targetPlanetId ?? getDomainPrimaryPlanet(domain)];
    const dayEn = dayNum != null ? DAY_NAMES_EN[dayNum] : 'a favorable day';
    const dayHi = dayNum != null ? DAY_NAMES_HI[dayNum] : 'एक अनुकूल दिन';
    step4En = `To navigate this: ${remedy.instructions.en} Practice this especially on ${dayEn}s for maximum benefit.`;
    step4Hi = `इससे निपटने के लिए: ${remedy.instructions.hi ?? remedy.instructions.en} अधिकतम लाभ के लिए विशेष रूप से ${dayHi} को यह अभ्यास करें।`;
  } else {
    const primaryPlanet = getDomainPrimaryPlanet(domain);
    const dayNum = PLANET_DAY[primaryPlanet];
    const dayEn = dayNum != null ? DAY_NAMES_EN[dayNum] : 'a favorable day';
    const dayHi = dayNum != null ? DAY_NAMES_HI[dayNum] : 'एक अनुकूल दिन';
    step4En = `To navigate this: Strengthen your ${domEn} through consistent positive action on ${dayEn}s, the day ruled by this domain's primary planet.`;
    step4Hi = `इससे निपटने के लिए: ${dayHi} को, जो इस क्षेत्र के प्रमुख ग्रह का दिन है, निरंतर सकारात्मक कार्य से अपने ${domHi} को मजबूत करें।`;
  }

  // Step 5: Hope
  let step5En: string;
  let step5Hi: string;
  if (positiveTrigger) {
    const dateEn = formatDate(positiveTrigger.startDate, 'en');
    const dateHi = formatDate(positiveTrigger.startDate, 'hi');
    const descEn = positiveTrigger.description.en;
    const descHi = positiveTrigger.description.hi ?? positiveTrigger.description.en;
    step5En = `Looking ahead, ${descEn} around ${dateEn} brings relief and fresh opportunity to this domain.`;
    step5Hi = `आगे देखते हुए, ${dateHi} के आसपास ${descHi} इस क्षेत्र में राहत और नए अवसर लाता है।`;
  } else {
    step5En = `Looking ahead, every planetary period carries its own gifts. The challenges you face now are building resilience that will serve you when brighter periods arrive.`;
    step5Hi = `आगे देखते हुए, हर ग्रहीय अवधि अपने उपहार लाती है। आप अभी जो चुनौतियों का सामना कर रहे हैं, वे लचीलापन बना रही हैं जो उज्जवल अवधि आने पर आपकी सेवा करेंगी।`;
  }

  return {
    en: [step1En, step2En, step3En, step4En, step5En].join(' '),
    hi: [step1Hi, step2Hi, step3Hi, step4Hi, step5Hi].join(' '),
  };
}

// ---------------------------------------------------------------------------
// 2. narrateStrength — Celebratory language for strong readings
// ---------------------------------------------------------------------------

/**
 * For domains scoring uttama (>= 7.5/10), adds celebratory and
 * actionable language that validates the native's strength and
 * encourages bold action within the favorable window.
 *
 * Returns the original narrative for non-uttama domains.
 */
export function narrateStrength(domainReading: DomainReading, locale: string): LocaleText {
  const rating = domainReading.overallRating.rating;

  if (rating !== 'uttama') {
    return domainReading.detailedNarrative;
  }

  const domain = domainReading.domain;
  const domEn = DOMAIN_NAMES_EN[domain];
  const domHi = DOMAIN_NAMES_HI[domain];

  // Identify top factors
  const topFactors: string[] = [];
  const topFactorsHi: string[] = [];

  // Strong yogas
  for (const yoga of domainReading.natalPromise.supportingYogas.slice(0, 2)) {
    topFactors.push(yoga.name.en);
    topFactorsHi.push(yoga.name.hi ?? yoga.name.en);
  }

  // Strong lord dignity
  for (const lord of domainReading.natalPromise.lordQualities) {
    if (lord.dignity === 'exalted' || lord.dignity === 'own' || lord.dignity === 'moolatrikona') {
      const pEn = PLANET_NAMES_EN[lord.lordId] ?? 'a planet';
      const pHi = PLANET_NAMES_HI[lord.lordId] ?? 'एक ग्रह';
      topFactors.push(`${pEn}'s strong dignity`);
      topFactorsHi.push(`${pHi} की मजबूत गरिमा`);
    }
  }

  // Benefic transits
  for (const t of domainReading.currentActivation.transitInfluences.filter(t => t.nature === 'benefic').slice(0, 1)) {
    const pEn = PLANET_NAMES_EN[t.planetId] ?? 'a benefic';
    const pHi = PLANET_NAMES_HI[t.planetId] ?? 'शुभ ग्रह';
    topFactors.push(`${pEn}'s favorable transit`);
    topFactorsHi.push(`${pHi} का अनुकूल गोचर`);
  }

  const factorsEn = topFactors.length > 0 ? topFactors.join(', ') : 'multiple strong placements';
  const factorsHi = topFactorsHi.length > 0 ? topFactorsHi.join(', ') : 'कई मजबूत स्थितियां';

  // Validate
  const validateEn = `Your ${domEn} is exceptionally well-supported — this is a rare alignment of ${factorsEn}.`;
  const validateHi = `आपका ${domHi} असाधारण रूप से अच्छी तरह से समर्थित है — यह ${factorsHi} का एक दुर्लभ संयोग है।`;

  // Amplify — domain-specific bold move suggestion
  const amplifyMap: Record<DomainType, { en: string; hi: string }> = {
    health:       { en: 'This is your window for establishing powerful health routines and peak physical performance.', hi: 'यह शक्तिशाली स्वास्थ्य दिनचर्या और शिखर शारीरिक प्रदर्शन स्थापित करने का आपका अवसर है।' },
    wealth:       { en: 'This is your window for bold financial moves: investments, business expansion, or launching income streams.', hi: 'यह साहसिक वित्तीय कदमों का आपका अवसर है: निवेश, व्यापार विस्तार, या आय स्रोत शुरू करना।' },
    career:       { en: 'This is your window for bold career moves: launch that project, seek that promotion, or make your vision public.', hi: 'यह साहसिक करियर कदमों का आपका अवसर है: वह प्रोजेक्ट शुरू करें, पदोन्नति मांगें, या अपना दृष्टिकोण सार्वजनिक करें।' },
    marriage:     { en: 'This is your window for deepening commitment — heartfelt conversations, shared adventures, and renewed vows carry special power now.', hi: 'यह प्रतिबद्धता गहरा करने का आपका अवसर है — हार्दिक बातचीत, साझा साहसिक कार्य और नवीनीकृत प्रतिज्ञाओं में अभी विशेष शक्ति है।' },
    children:     { en: 'This is your window for nurturing creative bonds with children and inspiring their growth with your wisdom.', hi: 'यह बच्चों के साथ रचनात्मक बंधन पोषित करने और अपने ज्ञान से उनके विकास को प्रेरित करने का आपका अवसर है।' },
    family:       { en: 'This is your window for strengthening family bonds — reunions, property decisions, and honoring traditions bring lasting rewards.', hi: 'यह पारिवारिक बंधन मजबूत करने का आपका अवसर है — पुनर्मिलन, संपत्ति निर्णय और परंपराओं का सम्मान स्थायी पुरस्कार लाते हैं।' },
    spiritual:    { en: 'This is your window for deep spiritual breakthroughs — pilgrimages, retreats, and intensive meditation yield profound insights now.', hi: 'यह गहन आध्यात्मिक सफलताओं का आपका अवसर है — तीर्थयात्रा, एकांतवास और गहन ध्यान अभी गहन अंतर्दृष्टि देते हैं।' },
    education:    { en: 'This is your window for ambitious learning — advanced degrees, challenging certifications, or mastering a new discipline.', hi: 'यह महत्वाकांक्षी सीखने का आपका अवसर है — उन्नत डिग्री, चुनौतीपूर्ण प्रमाणपत्र, या एक नई विधा में महारत।' },
    currentPeriod:{ en: 'This is your window for taking initiative across all life areas.', hi: 'यह जीवन के सभी क्षेत्रों में पहल करने का आपका अवसर है।' },
  };
  const amplify = amplifyMap[domain] ?? amplifyMap.currentPeriod;

  // Timeline — find when the favorable period ends
  const positiveTrigger = findPositiveTrigger(domainReading.timelineTriggers);
  const challengeTrigger = findChallengeTrigger(domainReading.timelineTriggers);
  let timelineEn: string;
  let timelineHi: string;

  if (challengeTrigger) {
    // The favorable period extends until the next challenge
    const dateEn = formatDate(challengeTrigger.startDate, 'en');
    const dateHi = formatDate(challengeTrigger.startDate, 'hi');
    timelineEn = `This favorable period extends through ${dateEn}. Plan major ${domEn} initiatives before then.`;
    timelineHi = `यह अनुकूल अवधि ${dateHi} तक विस्तारित है। तब तक प्रमुख ${domHi} पहल की योजना बनाएं।`;
  } else if (positiveTrigger) {
    const dateEn = formatDate(positiveTrigger.endDate, 'en');
    const dateHi = formatDate(positiveTrigger.endDate, 'hi');
    timelineEn = `This strength is amplified through ${dateEn}. Seize the momentum while it is strong.`;
    timelineHi = `यह शक्ति ${dateHi} तक प्रवर्धित है। जब तक यह मजबूत है, गति का लाभ उठाएं।`;
  } else {
    timelineEn = `Your natal chart provides enduring strength in this domain. Continue to invest in ${domEn} with confidence.`;
    timelineHi = `आपकी जन्म कुंडली इस क्षेत्र में स्थायी शक्ति प्रदान करती है। आत्मविश्वास से ${domHi} में निवेश करते रहें।`;
  }

  return {
    en: [validateEn, amplify.en, timelineEn].join(' '),
    hi: [validateHi, amplify.hi, timelineHi].join(' '),
  };
}

// ---------------------------------------------------------------------------
// 3. generateActionPlan — Structured modern guidance for ALL domains
// ---------------------------------------------------------------------------

/**
 * Produces a structured, actionable plan for any domain at any rating level.
 * Includes lifestyle guidance, best days, avoidance advice, an affirmation,
 * and a specific weekly practice.
 */
export function generateActionPlan(domainReading: DomainReading, locale: string): ActionPlan {
  const domain = domainReading.domain;

  // --- Lifestyle guidance ---
  const templates = LIFESTYLE_TEMPLATES[domain] ?? LIFESTYLE_TEMPLATES.currentPeriod;
  const matched = templates.find(t => t.condition(domainReading)) ?? templates[templates.length - 1];
  const lifestyle: LocaleText = { en: matched.en, hi: matched.hi };

  // --- Best days ---
  const primaryPlanet = getDomainPrimaryPlanet(domain);
  const weekday = PLANET_DAY[primaryPlanet];
  const bestDays = weekday != null ? getNextDaysForWeekday(weekday, 3) : [];

  // --- Avoid guidance ---
  const avoid = buildAvoidGuidance(domainReading, locale);

  // --- Affirmation ---
  const affirmation: LocaleText = AFFIRMATIONS[domain] ?? AFFIRMATIONS.currentPeriod;

  // --- Weekly practice ---
  const practices = WEEKLY_PRACTICES[domain] ?? WEEKLY_PRACTICES.currentPeriod;
  const weeklyPractice: LocaleText = practices[0];

  return { lifestyle, bestDays, avoid, affirmation, weeklyPractice };
}

// ---------------------------------------------------------------------------
// Avoid guidance builder
// ---------------------------------------------------------------------------

function buildAvoidGuidance(reading: DomainReading, locale: string): LocaleText {
  const domain = reading.domain;
  const domEn = DOMAIN_NAMES_EN[domain];
  const domHi = DOMAIN_NAMES_HI[domain];

  // Malefic transits suggest avoidance periods
  const malefics = reading.currentActivation.transitInfluences.filter(t => t.nature === 'malefic');
  if (malefics.length > 0) {
    const m = malefics[0];
    const pEn = PLANET_NAMES_EN[m.planetId] ?? 'a challenging planet';
    const pHi = PLANET_NAMES_HI[m.planetId] ?? 'एक चुनौतीपूर्ण ग्रह';
    const dayNum = PLANET_DAY[m.planetId];
    const dayEn = dayNum != null ? DAY_NAMES_EN[dayNum] : null;
    const dayHi = dayNum != null ? DAY_NAMES_HI[dayNum] : null;

    if (dayEn && dayHi) {
      return {
        en: `Avoid initiating major ${domEn} decisions on ${dayEn}s while ${pEn}'s transit is active. Also avoid impulsive actions during Rahu Kaal.`,
        hi: `${pHi} का गोचर सक्रिय रहने तक ${dayHi} को प्रमुख ${domHi} निर्णय शुरू करने से बचें। राहु काल में आवेगी कार्यों से भी बचें।`,
      };
    }
  }

  // Challenge timeline triggers
  const challenge = findChallengeTrigger(reading.timelineTriggers);
  if (challenge) {
    const dateEn = formatDate(challenge.startDate, 'en');
    const dateHi = formatDate(challenge.startDate, 'hi');
    return {
      en: `Exercise caution around ${dateEn} when a challenging phase begins. Avoid risky ${domEn} commitments during that window.`,
      hi: `${dateHi} के आसपास सावधानी बरतें जब एक चुनौतीपूर्ण चरण शुरू होता है। उस अवधि में जोखिमभरे ${domHi} प्रतिबद्धताओं से बचें।`,
    };
  }

  // Generic
  return {
    en: `Avoid rushed decisions about ${domEn}. Take time to reflect before committing to major changes. Impulsive actions during emotionally charged moments rarely serve you well.`,
    hi: `${domHi} के बारे में जल्दबाजी के निर्णयों से बचें। बड़े बदलावों के लिए प्रतिबद्ध होने से पहले चिंतन का समय लें।`,
  };
}
