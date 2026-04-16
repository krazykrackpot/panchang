import type { LocaleText } from '@/types/panchang';
/**
 * Pancha Pakshi Shastra — Five Bird System
 * Source: Prasna Marga (Kerala tradition), Kalaprakasika
 *
 * Five birds cycle through 5 activities throughout the day and night.
 * Bird is determined by birth nakshatra.
 * Current activity determines auspiciousness.
 *
 * The 5 Birds: Vulture (1), Owl (2), Crow (3), Cock (4), Peacock (5)
 * The 5 Activities: Ruling (1), Eating (2), Walking (3), Sleeping (4), Dying (5)
 */

export type Bird = 'vulture' | 'owl' | 'crow' | 'cock' | 'peacock';
export type Activity = 'ruling' | 'eating' | 'walking' | 'sleeping' | 'dying';

export interface BirdActivity {
  bird: Bird;
  birdName: LocaleText;
  activity: Activity;
  activityName: LocaleText;
  auspicious: 'excellent' | 'good' | 'neutral' | 'avoid';
  interpretation: LocaleText;
  periodStart: string; // HH:MM
  periodEnd: string;   // HH:MM
}

const BIRD_NAMES: Record<Bird, LocaleText> = {
  vulture: { en: 'Vulture (Gridhra)', hi: 'गृध्र', sa: 'गृध्रः' },
  owl:     { en: 'Owl (Uluka)',      hi: 'उलूक', sa: 'उलूकः' },
  crow:    { en: 'Crow (Kaka)',      hi: 'काक',  sa: 'काकः'  },
  cock:    { en: 'Cock (Kukkuta)',   hi: 'कुक्कुट', sa: 'कुक्कुटः' },
  peacock: { en: 'Peacock (Mayura)', hi: 'मयूर', sa: 'मयूरः' },
};

const ACTIVITY_NAMES: Record<Activity, LocaleText> = {
  ruling:   { en: 'Ruling',   hi: 'राज्य',   sa: 'राज्यम्'  },
  eating:   { en: 'Eating',   hi: 'भोजन',   sa: 'भोजनम्'  },
  walking:  { en: 'Walking',  hi: 'गमन',    sa: 'गमनम्'   },
  sleeping: { en: 'Sleeping', hi: 'शयन',    sa: 'शयनम्'   },
  dying:    { en: 'Dying',    hi: 'मृत्यु',  sa: 'मृत्युः'  },
};

const AUSPICIOUSNESS: Record<Activity, 'excellent' | 'good' | 'neutral' | 'avoid'> = {
  ruling:   'excellent',
  eating:   'good',
  walking:  'good',
  sleeping: 'neutral',
  dying:    'avoid',
};

const INTERPRETATIONS: Record<Activity, LocaleText> = {
  ruling: {
    en: 'Your bird is Ruling — supreme period for any action. Decisions made now succeed. Start new ventures, sign agreements, make important requests.',
    hi: 'आपका पक्षी राज्य कर रहा है — किसी भी कार्य के लिए श्रेष्ठ काल। अभी लिए निर्णय सफल होते हैं। नए कार्य, समझौते, महत्वपूर्ण अनुरोध करें।',
  },
  eating: {
    en: 'Your bird is Eating — good for nurturing activities, food-related work, financial matters, and creative pursuits. Moderate success for most actions.',
    hi: 'आपका पक्षी भोजन कर रहा है — पोषण कार्य, खाद्य संबंधी, वित्तीय और सृजनात्मक गतिविधियों के लिए अच्छा। अधिकांश कार्यों में मध्यम सफलता।',
  },
  walking: {
    en: 'Your bird is Walking — favorable for travel, movement, meetings, and social activities. Good for carrying out existing plans. Moderate for new beginnings.',
    hi: 'आपका पक्षी चल रहा है — यात्रा, गति, बैठकों और सामाजिक गतिविधियों के लिए अनुकूल। मौजूदा योजनाओं को आगे बढ़ाने के लिए अच्छा।',
  },
  sleeping: {
    en: 'Your bird is Sleeping — dormant period. Routine matters proceed normally. Avoid major new actions; use this time for planning, rest, and internal work.',
    hi: 'आपका पक्षी सो रहा है — निद्रा काल। नियमित कार्य सामान्य चलते हैं। बड़े नए कार्य टालें; यह समय योजना, विश्राम और आंतरिक कार्य के लिए उपयुक्त।',
  },
  dying: {
    en: 'Your bird is Dying — avoid all important new actions. This is the most inauspicious period. Rest, reflect, and wait. Actions started now tend to fail or create obstacles.',
    hi: 'आपका पक्षी मृत्युकाल में है — सभी महत्वपूर्ण नए कार्यों से बचें। यह सर्वाधिक अशुभ काल है। विश्राम करें, चिंतन करें और प्रतीक्षा करें।',
  },
};

/**
 * Birth nakshatra → ruling bird
 * Nakshatras 1-27 mapped to birds in groups of 5 (with one group of 2 at end)
 * Traditional assignment from Kalaprakasika:
 * Ashwini(1)-Mrigashira(5) = Vulture
 * Ardra(6)-Hasta(10) = Owl
 * Chitra(11)-Jyeshtha(15) = Crow
 * Mula(16)-Shravana(20) = Cock
 * Dhanishtha(21)-Revati(27) = Peacock
 */
function getBirthBird(nakshatra: number): Bird {
  if (nakshatra >= 1  && nakshatra <= 5)  return 'vulture';
  if (nakshatra >= 6  && nakshatra <= 10) return 'owl';
  if (nakshatra >= 11 && nakshatra <= 15) return 'crow';
  if (nakshatra >= 16 && nakshatra <= 20) return 'cock';
  return 'peacock'; // 21-27
}

/**
 * Day/Night each has 5 periods of equal duration.
 * During day: each period = (sunset - sunrise) / 5
 * During night: each period = (next sunrise - sunset) / 5
 *
 * Activity sequence for each bird during day and night:
 * The sequence rotates based on bird and whether it's day/night.
 *
 * Traditional day-sequence starting bird order:
 * Day order: Vulture, Owl, Crow, Cock, Peacock (period 1→5)
 * Night order: Owl, Vulture, Peacock, Cock, Crow (reversed for night)
 *
 * Within each period, the BIRD SEQUENCE activities rotate:
 * Activity order (same for all): Ruling → Eating → Walking → Sleeping → Dying
 * Which bird starts ruling in period 1 depends on the day of week.
 *
 * Simplified classical formula (from Kalaprakasika Ch.2):
 * Week day assigns the "ruling bird" for the first day period.
 * Sun=Vulture, Mon=Owl, Tue=Crow, Wed=Cock, Thu=Peacock, Fri=Vulture, Sat=Owl
 * (rotates by 2 each day)
 *
 * Then within each period (1-5 of day, 1-5 of night), 
 * the 5 birds cycle through 5 activities.
 */

const WEEKDAY_RULER: Record<number, Bird> = {
  0: 'vulture', // Sunday
  1: 'owl',
  2: 'crow',
  3: 'cock',
  4: 'peacock',
  5: 'vulture', // Friday rotates back to vulture
  6: 'owl',
};

const BIRDS: Bird[] = ['vulture', 'owl', 'crow', 'cock', 'peacock'];
const ACTIVITIES: Activity[] = ['ruling', 'eating', 'walking', 'sleeping', 'dying'];

function getBirdIndex(bird: Bird): number {
  return BIRDS.indexOf(bird);
}

function rotateBy(arr: Bird[], start: number): Bird[] {
  return [...arr.slice(start), ...arr.slice(0, start)];
}

function formatHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
}

export interface PanchaPakshiResult {
  birthBird: Bird;
  birthBirdName: LocaleText;
  currentPeriod: BirdActivity;
  allPeriods: BirdActivity[];
  isDay: boolean;
  periodIndex: number; // 0-4
}

/**
 * Calculate Pancha Pakshi for a given moment
 * @param now - current date/time
 * @param sunriseMs - sunrise time in milliseconds (Date.getTime())
 * @param sunsetMs  - sunset time in milliseconds
 * @param birthNakshatra - 1-27
 */
export function calculatePanchaPakshi(
  now: Date,
  sunriseMs: number,
  sunsetMs: number,
  birthNakshatra: number,
): PanchaPakshiResult {
  const birthBird = getBirthBird(birthNakshatra);
  const weekday = now.getDay(); // 0=Sun
  const nowMs = now.getTime();

  // Determine if day or night
  const isDay = nowMs >= sunriseMs && nowMs < sunsetMs;

  // Next sunrise for night calculation (approx +24h if needed)
  const nextSunriseMs = sunriseMs + 24 * 60 * 60 * 1000;

  const periodDuration = isDay
    ? (sunsetMs - sunriseMs) / 5
    : (nextSunriseMs - sunsetMs) / 5;

  // If before sunrise today, treat as previous day's night — use prev sunset (sunsetMs - 24h)
  const effectiveSunsetMs = nowMs < sunriseMs ? sunsetMs - 24 * 60 * 60 * 1000 : sunsetMs;
  const elapsed = isDay ? (nowMs - sunriseMs) : (nowMs - effectiveSunsetMs);
  const rawIndex = Math.floor(elapsed / periodDuration);
  // Clamp to [0,4] and guard against NaN (invalid sunrise/sunset inputs).
  const periodIndex = Number.isFinite(rawIndex) ? Math.max(0, Math.min(4, rawIndex)) : 0;

  // Determine ruling bird for day period 1 based on weekday
  const dayRulerBird = WEEKDAY_RULER[weekday];
  const dayRulerIdx = getBirdIndex(dayRulerBird);

  // Night ruler: rotate day order by 1 (traditional Kalaprakasika rule)
  const nightRulerIdx = (dayRulerIdx + 1) % 5;

  // Period 0's ruling bird; subsequent periods shift by 1
  const period0RulerIdx = isDay ? dayRulerIdx : nightRulerIdx;

  // Build all 5 periods
  const periods: BirdActivity[] = [];
  for (let p = 0; p < 5; p++) {
    // The bird sequence starts from the period's ruler
    const rulerIdxForPeriod = (period0RulerIdx + p) % 5;
    const birdSeq = rotateBy(BIRDS, rulerIdxForPeriod);

    // Find birth bird's position in this period's sequence
    const birthBirdPos = birdSeq.indexOf(birthBird);

    // Activity for birth bird in this period
    const activity = ACTIVITIES[birthBirdPos];

    // Period timing
    const start = new Date(isDay ? sunriseMs : sunsetMs);
    start.setTime(start.getTime() + p * periodDuration);
    const end = new Date(start.getTime() + periodDuration);

    periods.push({
      bird: birthBird,
      birdName: BIRD_NAMES[birthBird],
      activity,
      activityName: ACTIVITY_NAMES[activity],
      auspicious: AUSPICIOUSNESS[activity],
      interpretation: INTERPRETATIONS[activity],
      periodStart: formatHHMM(start),
      periodEnd: formatHHMM(end),
    });
  }

  return {
    birthBird,
    birthBirdName: BIRD_NAMES[birthBird],
    currentPeriod: periods[periodIndex],
    allPeriods: periods,
    isDay,
    periodIndex,
  };
}
