import type { DashaEntry } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

export interface DashaSandhiPeriod {
  outgoingPlanet: string;
  outgoingPlanetName: LocaleText;
  incomingPlanet: string;
  incomingPlanetName: LocaleText;
  sandhiStart: string;   // ISO date — when transition period begins
  sandhiEnd: string;     // ISO date — when transition period ends
  transitionDate: string; // ISO date — exact dasha changeover
  durationMonths: number; // approximate duration in months
  intensity: 'mild' | 'moderate' | 'intense';
  description: LocaleText;   // Multilingual description of what to expect
}

/**
 * Natural friendship table per classical Parashari rules.
 * Friends listed for each planet by English name.
 */
const FRIENDS: Record<string, string[]> = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus'],
  Rahu: ['Saturn', 'Venus'],
  Ketu: ['Mars', 'Jupiter'],
};

/**
 * Natural enemy table — inverse of friendship (where explicitly enmity exists).
 * Planets not in friends list and not in enemies are neutral.
 */
const ENEMIES: Record<string, string[]> = {
  Sun: ['Venus', 'Saturn'],
  Moon: ['Rahu', 'Ketu'],
  Mars: ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus', 'Saturn'],
  Venus: ['Sun', 'Moon'],
  Saturn: ['Sun', 'Moon', 'Mars'],
  Rahu: ['Sun', 'Moon', 'Mars'],
  Ketu: ['Venus', 'Saturn'],
};

function getIntensity(outgoing: string, incoming: string): 'mild' | 'moderate' | 'intense' {
  const friends = FRIENDS[outgoing] ?? [];
  const enemies = ENEMIES[outgoing] ?? [];
  if (friends.includes(incoming)) return 'mild';
  if (enemies.includes(incoming)) return 'intense';
  return 'moderate';
}

const SANDHI_DESCRIPTIONS: Record<string, LocaleText> = {
  mild: {
    en: 'Smooth transition — both planets are friendly. Minor adjustments expected.',
    hi: 'सहज संक्रमण — दोनों ग्रह मित्र हैं। मामूली समायोजन अपेक्षित।',
    ta: 'சுமூகமான மாற்றம் — இரு கிரகங்களும் நட்பானவை. சிறிய மாற்றங்கள் எதிர்பார்க்கப்படுகின்றன.',
    bn: 'সহজ সংক্রমণ — উভয় গ্রহ বন্ধুত্বপূর্ণ। সামান্য সমন্বয় প্রত্যাশিত।',
  },
  moderate: {
    en: 'Moderate transition — neutral planets. Some confusion and mixed signals likely.',
    hi: 'मध्यम संक्रमण — तटस्थ ग्रह। कुछ भ्रम और मिश्रित संकेत संभव।',
    ta: 'மிதமான மாற்றம் — நடுநிலை கிரகங்கள். சில குழப்பங்கள் மற்றும் கலவையான சமிக்ஞைகள் சாத்தியம்.',
    bn: 'মধ্যম সংক্রমণ — নিরপেক্ষ গ্রহ। কিছু বিভ্রান্তি এবং মিশ্র সংকেত সম্ভব।',
  },
  intense: {
    en: 'Intense transition — planetary enmity creates turbulence. Major life shifts possible. Avoid big decisions during this period.',
    hi: 'तीव्र संक्रमण — ग्रह शत्रुता अशांति उत्पन्न करती है। बड़े जीवन परिवर्तन संभव। इस काल में बड़े निर्णय टालें।',
    ta: 'தீவிரமான மாற்றம் — கிரக பகை கொந்தளிப்பை உருவாக்குகிறது. பெரிய வாழ்க்கை மாற்றங்கள் சாத்தியம். இந்த காலத்தில் பெரிய முடிவுகளை தவிர்க்கவும்.',
    bn: 'তীব্র সংক্রমণ — গ্রহ শত্রুতা অশান্তি সৃষ্টি করে। বড় জীবন পরিবর্তন সম্ভব। এই সময়ে বড় সিদ্ধান্ত এড়িয়ে চলুন।',
  },
};

function getDescription(intensity: 'mild' | 'moderate' | 'intense'): LocaleText {
  return SANDHI_DESCRIPTIONS[intensity];
}

/**
 * Add a fractional number of days to an ISO date string and return a new ISO date string.
 */
function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
}

/**
 * Compute the difference in days between two ISO date strings.
 */
function daysBetween(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return (e - s) / (24 * 60 * 60 * 1000);
}

/**
 * Find all Maha Dasha Sandhi (junction) periods from a dasha sequence.
 * Sandhi = last 10% of outgoing Maha Dasha + first 10% of incoming Maha Dasha.
 *
 * Per BPHS and Phaladeepika, the junction between two consecutive Maha Dasha lords
 * is turbulent: the native experiences confusion and instability as one planetary
 * theme gives way to another. Intensity depends on the natural friendship between
 * the outgoing and incoming lords.
 */
export function findDashaSandhiPeriods(dashas: DashaEntry[]): DashaSandhiPeriod[] {
  // Only maha-level dashas participate in Sandhi
  const mahaDashas = dashas.filter(d => d.level === 'maha');
  if (mahaDashas.length < 2) return [];

  const result: DashaSandhiPeriod[] = [];

  for (let i = 0; i < mahaDashas.length - 1; i++) {
    const outgoing = mahaDashas[i];
    const incoming = mahaDashas[i + 1];

    const outgoingDuration = daysBetween(outgoing.startDate, outgoing.endDate);
    const incomingDuration = daysBetween(incoming.startDate, incoming.endDate);

    // Sandhi window: last 10% of outgoing + first 10% of incoming
    const sandhiStart = addDays(outgoing.endDate, -(outgoingDuration * 0.1));
    const sandhiEnd = addDays(incoming.startDate, incomingDuration * 0.1);
    const transitionDate = outgoing.endDate; // = incoming.startDate

    const totalSandhiDays = daysBetween(sandhiStart, sandhiEnd);
    const durationMonths = Math.round((totalSandhiDays / 30.44) * 10) / 10;

    const outgoingPlanetName = outgoing.planetName;
    const incomingPlanetName = incoming.planetName;
    const outgoingPlanetEn = outgoingPlanetName.en;
    const incomingPlanetEn = incomingPlanetName.en;

    const intensity = getIntensity(outgoingPlanetEn, incomingPlanetEn);
    const description = getDescription(intensity);

    result.push({
      outgoingPlanet: outgoingPlanetEn,
      outgoingPlanetName,
      incomingPlanet: incomingPlanetEn,
      incomingPlanetName,
      sandhiStart,
      sandhiEnd,
      transitionDate,
      durationMonths,
      intensity,
      description,
    });
  }

  return result;
}
