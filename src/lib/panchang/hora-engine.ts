/**
 * Hora Engine — Planetary Hour Computation
 *
 * Computes 24 planetary hours (12 day + 12 night) using the Chaldean sequence.
 * Day horas: sunrise to sunset divided into 12 equal parts.
 * Night horas: sunset to next sunrise divided into 12 equal parts.
 *
 * The Chaldean order: Sun(0) → Venus(5) → Mercury(3) → Moon(1) → Saturn(6) → Jupiter(4) → Mars(2)
 * Each weekday starts from its ruling planet and follows this cycle.
 */

export interface HoraSlot {
  planetId: number;       // 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
  startTime: string;      // "HH:MM"
  endTime: string;        // "HH:MM"
  isDay: boolean;
  activities: { en: string; hi: string };
}

// Chaldean sequence: Sun→Venus→Mercury→Moon→Saturn→Jupiter→Mars
const CHALDEAN_ORDER = [0, 5, 3, 1, 6, 4, 2];

// Starting planet for each vara day (0=Sunday)
const VARA_START_PLANET = [0, 1, 2, 3, 4, 5, 6];

export const HORA_PLANET_ACTIVITIES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Government work, authority, health, father', hi: 'सरकारी कार्य, अधिकार, स्वास्थ्य, पिता' },
  1: { en: 'Travel, liquids, public relations, mother', hi: 'यात्रा, तरल पदार्थ, जनसंपर्क, माता' },
  2: { en: 'Property, machinery, legal battles, surgery', hi: 'संपत्ति, मशीनरी, कानूनी कार्य, शल्यचिकित्सा' },
  3: { en: 'Communication, trade, learning, writing', hi: 'संचार, व्यापार, शिक्षा, लेखन' },
  4: { en: 'Education, finance, spiritual practice, children', hi: 'शिक्षा, वित्त, आध्यात्मिक साधना, संतान' },
  5: { en: 'Romance, arts, luxury, marriage', hi: 'प्रेम, कला, विलासिता, विवाह' },
  6: { en: 'Labor, discipline, mining, iron work, service', hi: 'श्रम, अनुशासन, खनन, लोहा कार्य, सेवा' },
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const wrapped = ((mins % 1440) + 1440) % 1440; // wrap to 0-1439
  const h = Math.floor(wrapped / 60);
  const m = Math.round(wrapped % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Get the Chaldean sequence starting from a specific planet.
 * Returns an array of 24 planet IDs.
 */
function getChaldeanSequence(startPlanetId: number): number[] {
  const startIdx = CHALDEAN_ORDER.indexOf(startPlanetId);
  if (startIdx === -1) return Array(24).fill(0);
  const seq: number[] = [];
  for (let i = 0; i < 24; i++) {
    seq.push(CHALDEAN_ORDER[(startIdx + i) % 7]);
  }
  return seq;
}

export function computeHoraTable(
  sunrise: string,
  sunset: string,
  nextSunrise: string,
  varaDay: number // 0=Sunday per JD convention
): HoraSlot[] {
  const sunriseMin = timeToMinutes(sunrise);
  let sunsetMin = timeToMinutes(sunset);
  let nextSunriseMin = timeToMinutes(nextSunrise);

  // Handle midnight crossing
  if (sunsetMin <= sunriseMin) sunsetMin += 1440;
  if (nextSunriseMin <= sunsetMin) nextSunriseMin += 1440;

  const dayDuration = (sunsetMin - sunriseMin) / 12;
  const nightDuration = (nextSunriseMin - sunsetMin) / 12;

  const startPlanet = VARA_START_PLANET[varaDay % 7];
  const sequence = getChaldeanSequence(startPlanet);

  const slots: HoraSlot[] = [];

  // 12 day horas
  for (let i = 0; i < 12; i++) {
    const start = sunriseMin + i * dayDuration;
    const end = sunriseMin + (i + 1) * dayDuration;
    slots.push({
      planetId: sequence[i],
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),
      isDay: true,
      activities: HORA_PLANET_ACTIVITIES[sequence[i]],
    });
  }

  // 12 night horas
  for (let i = 0; i < 12; i++) {
    const start = sunsetMin + i * nightDuration;
    const end = sunsetMin + (i + 1) * nightDuration;
    slots.push({
      planetId: sequence[12 + i],
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),
      isDay: false,
      activities: HORA_PLANET_ACTIVITIES[sequence[12 + i]],
    });
  }

  return slots;
}

/**
 * Find the currently active hora slot given the current time.
 */
export function getCurrentHora(horaTable: HoraSlot[], nowTime: string): HoraSlot | null {
  const now = timeToMinutes(nowTime);
  for (const slot of horaTable) {
    const start = timeToMinutes(slot.startTime);
    let end = timeToMinutes(slot.endTime);
    // Handle midnight crossing
    if (end <= start) {
      if (now >= start || now < end) return slot;
    } else {
      if (now >= start && now < end) return slot;
    }
  }
  return null;
}

/**
 * Get all hora windows for a specific planet today.
 */
export function getHoraWindowsForPlanet(horaTable: HoraSlot[], planetId: number): HoraSlot[] {
  return horaTable.filter(s => s.planetId === planetId);
}
