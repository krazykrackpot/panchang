import type { Dosha, DoshaProfile } from './prakriti-quiz';

export type VoiceMode = 'traditional' | 'modern';

export interface HoraSlot {
  planetId: number;       // 0-6
  planetName: string;
  startTime: string;      // HH:MM
  endTime: string;
  isCurrent: boolean;
  activity: { traditional: string; modern: string };
}

export interface EnergyPhase {
  label: { traditional: string; modern: string };
  startTime: string;
  endTime: string;
  level: 'high' | 'medium' | 'low' | 'avoid';
  description: { traditional: string; modern: string };
}

export interface NutritionWindow {
  eatingWindow: { start: string; end: string };
  bestMealTime: string;
  agniLevel: 'strong' | 'moderate' | 'low';
  advice: { traditional: string; modern: string };
}

export interface PracticeRecommendation {
  focus: { traditional: string; modern: string };
  nakshatraActivity: string; // fixed/movable/sharp/soft/mixed
  avoid: { traditional: string; modern: string };
}

export interface DeadZone {
  name: string;
  startTime: string;
  endTime: string;
  advice: { traditional: string; modern: string };
}

export interface DailyProtocol {
  date: string;
  tithi: { number: number; name: string; paksha: string };
  nakshatra: { number: number; name: string };
  moonPhasePercent: number;   // 0-100 (0=new, 100=full)
  moonPhaseLabel: { traditional: string; modern: string };
  horaSchedule: HoraSlot[];
  energyPhases: EnergyPhase[];
  nutrition: NutritionWindow;
  practice: PracticeRecommendation;
  deadZones: DeadZone[];
  prakritiAdvice: { traditional: string; modern: string } | null;
}

// --- Planet name mapping (0=Sun through 6=Saturn) ---
const PLANET_NAMES: Record<number, string> = {
  0: 'Sun',
  1: 'Moon',
  2: 'Mars',
  3: 'Mercury',
  4: 'Jupiter',
  5: 'Venus',
  6: 'Saturn',
};

// --- Hora activity mapping ---
const HORA_ACTIVITIES: Record<number, { traditional: string; modern: string }> = {
  0: {
    traditional: 'Leadership, authority, government matters',
    modern: 'High-stakes decisions, presentations, pitches',
  },
  1: {
    traditional: 'Nurturing, family, emotional matters',
    modern: 'Team 1-on-1s, empathy work, journaling',
  },
  2: {
    traditional: 'Courage, competition, physical labor',
    modern: 'Intense workouts, competitive tasks, deadlines',
  },
  3: {
    traditional: 'Learning, commerce, communication',
    modern: 'Deep work, coding, writing, negotiations',
  },
  4: {
    traditional: 'Wisdom, teaching, spiritual practice',
    modern: 'Strategy, mentoring, long-term planning',
  },
  5: {
    traditional: 'Arts, beauty, love, pleasure',
    modern: 'Creative work, design, social media, dating',
  },
  6: {
    traditional: 'Discipline, service, endurance',
    modern: 'Admin, cleanup, systems work, tech debt',
  },
};

// --- Nakshatra classification ---
// Fixed (Dhruva): stability, completion, foundation
const FIXED_NAKSHATRAS = new Set([4, 8, 12, 21, 26]);
// Movable (Chara): travel, starting, change
const MOVABLE_NAKSHATRAS = new Set([1, 6, 7, 13, 15, 22, 27]);
// Sharp (Tikshna): confrontation, surgery, breaking
const SHARP_NAKSHATRAS = new Set([5, 14, 18, 19]);
// Soft (Mridu): art, romance, ceremony
const SOFT_NAKSHATRAS = new Set([3, 10, 11, 16]);
// Mixed (Mishra): flexible, depends on hora — everything else: 2, 9, 17, 20, 23, 24, 25

function classifyNakshatra(id: number): string {
  if (FIXED_NAKSHATRAS.has(id)) return 'fixed';
  if (MOVABLE_NAKSHATRAS.has(id)) return 'movable';
  if (SHARP_NAKSHATRAS.has(id)) return 'sharp';
  if (SOFT_NAKSHATRAS.has(id)) return 'soft';
  return 'mixed';
}

// --- Nakshatra focus text by activity type ---
const NAKSHATRA_FOCUS: Record<string, { traditional: string; modern: string }> = {
  fixed: {
    traditional: 'Foundation-building, completing vows, laying cornerstones',
    modern: 'Lock in commitments, finalize contracts, establish routines',
  },
  movable: {
    traditional: 'Travel, beginning new ventures, change of place',
    modern: 'Launch projects, schedule travel, pivot strategies',
  },
  sharp: {
    traditional: 'Confrontation, breaking obstacles, surgery',
    modern: 'Have tough conversations, cut losses, remove blockers',
  },
  soft: {
    traditional: 'Arts, romance, ceremonies, healing',
    modern: 'Creative sessions, relationship building, team celebrations',
  },
  mixed: {
    traditional: 'Flexible energy, follow the hora lord for guidance',
    modern: 'Adapt to what comes — check current hora for best activity',
  },
};

const NAKSHATRA_AVOID: Record<string, { traditional: string; modern: string }> = {
  fixed: {
    traditional: 'Avoid travel or starting new ventures',
    modern: 'Not ideal for pivots or major changes',
  },
  movable: {
    traditional: 'Avoid laying foundations or permanent commitments',
    modern: 'Skip long-term binding decisions',
  },
  sharp: {
    traditional: 'Avoid auspicious ceremonies and gentle activities',
    modern: 'Not the day for soft launches or team bonding',
  },
  soft: {
    traditional: 'Avoid conflict, legal disputes, harsh actions',
    modern: 'Postpone difficult conversations and layoffs',
  },
  mixed: {
    traditional: 'No specific avoidances, but check inauspicious periods',
    modern: 'Watch your dead zones — otherwise flexible',
  },
};

// --- Time arithmetic helpers ---

/** Parse "HH:MM" to minutes since midnight */
function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Format minutes since midnight to "HH:MM" */
function formatTime(minutes: number): string {
  // Handle wrap-around past midnight
  const clamped = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Add hours to a time string, return new time string */
function addHours(hhmm: string, hours: number): string {
  return formatTime(parseTime(hhmm) + Math.round(hours * 60));
}

// --- Energy phases based on Ayurvedic clock ---

function computeEnergyPhases(sunrise: string, sunset: string): EnergyPhase[] {
  const phases: EnergyPhase[] = [];

  // Kapha time: sunrise to sunrise+4h — slow, grounding
  phases.push({
    label: { traditional: 'Kapha Kala', modern: 'Grounding Phase' },
    startTime: sunrise,
    endTime: addHours(sunrise, 4),
    level: 'medium',
    description: {
      traditional: 'Kapha dominates — slow, steady energy ideal for routine and grounding practices',
      modern: 'Slow start window — best for exercise, meditation, and establishing momentum',
    },
  });

  // Pitta time: sunrise+4h to sunrise+8h — peak productivity
  phases.push({
    label: { traditional: 'Pitta Kala', modern: 'Peak Performance' },
    startTime: addHours(sunrise, 4),
    endTime: addHours(sunrise, 8),
    level: 'high',
    description: {
      traditional: 'Pitta dominates — digestive fire and mental sharpness at their peak',
      modern: 'Your highest-output window — tackle the hardest work here',
    },
  });

  // Vata time: sunrise+8h to sunset — creative, variable
  phases.push({
    label: { traditional: 'Vata Kala', modern: 'Creative Phase' },
    startTime: addHours(sunrise, 8),
    endTime: sunset,
    level: 'medium',
    description: {
      traditional: 'Vata dominates — creative but scattered energy, needs anchoring',
      modern: 'Creative but variable — good for brainstorming, risky for detail work',
    },
  });

  // Evening Kapha: sunset to sunset+4h — winding down
  phases.push({
    label: { traditional: 'Sayam Kapha', modern: 'Wind-Down Phase' },
    startTime: sunset,
    endTime: addHours(sunset, 4),
    level: 'low',
    description: {
      traditional: 'Evening Kapha — body seeks rest, ideal for light food and family time',
      modern: 'Recovery zone — light dinner, reading, screen-free time',
    },
  });

  return phases;
}

// --- Tithi classification for nutrition ---

type TithiType = 'nanda' | 'bhadra' | 'jaya' | 'rikta' | 'purna';

function getTithiType(tithiNumber: number): TithiType {
  // Paksha-relative tithi: 1-15 within each paksha
  const rel = ((tithiNumber - 1) % 15) + 1;
  const mod5 = ((rel - 1) % 5) + 1;
  switch (mod5) {
    case 1: return 'nanda';
    case 2: return 'bhadra';
    case 3: return 'jaya';
    case 4: return 'rikta';
    case 5: return 'purna';
    default: return 'purna';
  }
}

const NUTRITION_BY_TITHI: Record<TithiType, { agniLevel: NutritionWindow['agniLevel']; advice: { traditional: string; modern: string } }> = {
  nanda: {
    agniLevel: 'strong',
    advice: {
      traditional: 'Nanda tithi — strong digestive fire, favor protein-rich foods and ghee',
      modern: 'High metabolism day — eat freely, favor protein and healthy fats',
    },
  },
  bhadra: {
    agniLevel: 'moderate',
    advice: {
      traditional: 'Bhadra tithi — balanced agni, take regular warm meals',
      modern: 'Standard metabolism — stick to regular meals, warm food preferred',
    },
  },
  jaya: {
    agniLevel: 'strong',
    advice: {
      traditional: 'Jaya tithi — victorious energy, feast day with celebration foods',
      modern: 'High-energy day — refuel generously, celebration meals welcome',
    },
  },
  rikta: {
    agniLevel: 'low',
    advice: {
      traditional: 'Rikta tithi — diminished agni, light meals or fasting recommended',
      modern: 'Low metabolism day — light meals, intermittent fasting works well',
    },
  },
  purna: {
    agniLevel: 'moderate',
    advice: {
      traditional: 'Purna tithi — complete energy, balanced meals maintain equilibrium',
      modern: 'Balanced day — moderate portions, no extremes',
    },
  },
};

// --- Nutrition window ---

function computeNutrition(sunrise: string, sunset: string, tithiNumber: number): NutritionWindow {
  const tithiType = getTithiType(tithiNumber);
  const { agniLevel, advice } = NUTRITION_BY_TITHI[tithiType];

  // Eating window: sunrise+1h to sunset-1h (Ayurvedic principle: eat only during daylight)
  const eatingStart = addHours(sunrise, 1);
  const eatEnd = addHours(sunset, -1);

  // Best meal time: midday (pitta peak) — sunrise+5h roughly
  const bestMealTime = addHours(sunrise, 5);

  return {
    eatingWindow: { start: eatingStart, end: eatEnd },
    bestMealTime,
    agniLevel,
    advice,
  };
}

// --- Moon phase from tithi ---

function computeMoonPhase(tithiNumber: number): { percent: number; label: { traditional: string; modern: string } } {
  // Tithi 1-15 = Shukla (waxing), 16-30 = Krishna (waning)
  const percent = tithiNumber <= 15
    ? Math.round((tithiNumber / 15) * 100)
    : Math.round(((30 - tithiNumber) / 15) * 100);

  const isWaxing = tithiNumber <= 15;
  const label = isWaxing
    ? {
        traditional: 'Shukla Paksha — building, accumulating energy',
        modern: 'Anabolic phase — optimal for starting new projects and building',
      }
    : {
        traditional: 'Krishna Paksha — releasing, purifying energy',
        modern: 'Catabolic phase — optimal for completing, editing, and letting go',
      };

  return { percent, label };
}

// --- Prakriti-specific advice ---

const PRAKRITI_ADVICE: Record<Dosha, { traditional: string; modern: string }> = {
  vata: {
    traditional: 'Stay warm, eat cooked foods, avoid cold drinks. Ground yourself during Vata hours (2-6 PM).',
    modern: 'Prioritize warm liquids. Schedule creative work for Vata hours but set timers to avoid burnout spirals.',
  },
  pitta: {
    traditional: 'Avoid overheating, favor cooling foods. Do not exercise during Sun or Mars hora.',
    modern: 'Skip HIIT during Sun hora. Cooling protocol: coconut water, shade breaks. Peak focus window: Mercury/Jupiter hora.',
  },
  kapha: {
    traditional: 'Start morning active, avoid heavy breakfast. Movement during Kapha hours (6-10 AM) is essential.',
    modern: 'Front-load your day. 6-10 AM is your optimization window — high-intensity work and exercise. Afternoon: coast.',
  },
};

// --- Dead zones from inauspicious periods ---

function computeDeadZones(params: {
  rahuKaal?: { start: string; end: string };
  yamaganda?: { start: string; end: string };
  varjyam?: { start: string; end: string }[];
}): DeadZone[] {
  const zones: DeadZone[] = [];

  if (params.rahuKaal) {
    zones.push({
      name: 'Rahu Kaal',
      startTime: params.rahuKaal.start,
      endTime: params.rahuKaal.end,
      advice: {
        traditional: 'Avoid initiating important activities during Rahu Kaal',
        modern: 'Dead zone — schedule low-stakes admin tasks here',
      },
    });
  }

  if (params.yamaganda) {
    zones.push({
      name: 'Yamaganda',
      startTime: params.yamaganda.start,
      endTime: params.yamaganda.end,
      advice: {
        traditional: 'Period of obstruction — avoid new beginnings',
        modern: 'Avoid commitments and sign-offs during this window',
      },
    });
  }

  if (params.varjyam) {
    for (const v of params.varjyam) {
      zones.push({
        name: 'Varjyam',
        startTime: v.start,
        endTime: v.end,
        advice: {
          traditional: 'Varjyam — avoid auspicious activities and important decisions',
          modern: 'Pause important decisions — use for routine or rest',
        },
      });
    }
  }

  return zones;
}

// --- Main engine function ---

export function generateDailyProtocol(params: {
  tithi: { number: number; name: string };
  nakshatra: { number: number; name: string };
  sunrise: string;       // HH:MM
  sunset: string;
  moonLongitude?: number;
  sunLongitude?: number;
  horaSlots: { planetId: number; startTime: string; endTime: string; isCurrent: boolean }[];
  rahuKaal?: { start: string; end: string };
  yamaganda?: { start: string; end: string };
  varjyam?: { start: string; end: string }[];
  prakriti: DoshaProfile | null;
}): DailyProtocol {
  const { tithi, nakshatra, sunrise, sunset, horaSlots, prakriti } = params;

  // Paksha from tithi number
  const paksha = tithi.number <= 15 ? 'Shukla' : 'Krishna';

  // Moon phase
  const moonPhase = computeMoonPhase(tithi.number);

  // Hora schedule with planet names and activities
  const horaSchedule: HoraSlot[] = horaSlots.map((slot) => ({
    planetId: slot.planetId,
    planetName: PLANET_NAMES[slot.planetId] ?? `Planet ${slot.planetId}`,
    startTime: slot.startTime,
    endTime: slot.endTime,
    isCurrent: slot.isCurrent,
    activity: HORA_ACTIVITIES[slot.planetId] ?? {
      traditional: 'General activities',
      modern: 'General activities',
    },
  }));

  // Energy phases
  const energyPhases = computeEnergyPhases(sunrise, sunset);

  // Nutrition
  const nutrition = computeNutrition(sunrise, sunset, tithi.number);

  // Nakshatra-based practice recommendation
  const nakshatraType = classifyNakshatra(nakshatra.number);
  const practice: PracticeRecommendation = {
    focus: NAKSHATRA_FOCUS[nakshatraType],
    nakshatraActivity: nakshatraType,
    avoid: NAKSHATRA_AVOID[nakshatraType],
  };

  // Dead zones
  const deadZones = computeDeadZones({
    rahuKaal: params.rahuKaal,
    yamaganda: params.yamaganda,
    varjyam: params.varjyam,
  });

  // Prakriti advice
  const prakritiAdvice = prakriti
    ? PRAKRITI_ADVICE[prakriti.dominant]
    : null;

  // Date string (today)
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return {
    date,
    tithi: { number: tithi.number, name: tithi.name, paksha },
    nakshatra: { number: nakshatra.number, name: nakshatra.name },
    moonPhasePercent: moonPhase.percent,
    moonPhaseLabel: moonPhase.label,
    horaSchedule,
    energyPhases,
    nutrition,
    practice,
    deadZones,
    prakritiAdvice,
  };
}
