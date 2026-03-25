import {
  dateToJD, calculateTithi, calculateYoga, calculateKarana,
  sunLongitude, moonLongitude, toSidereal,
  getNakshatraNumber, getNakshatraPada, getRashiNumber,
  approximateSunrise, approximateSunset, formatTime,
  calculateRahuKaal, getPlanetaryPositions,
  getMasa, MASA_NAMES, RITU_NAMES, SAMVATSARA_NAMES,
  getSamvatsara, getRitu, getAyana, formatDegrees, lahiriAyanamsha,
} from './astronomical';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS, VARA_DATA } from '@/lib/constants/grahas';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import { PanchangData, Muhurta } from '@/types/panchang';

export interface PanchangInput {
  year: number;
  month: number; // 1-12
  day: number;
  lat: number;
  lng: number;
  tzOffset: number; // hours from UTC (e.g., 5.5 for IST)
  locationName?: string;
}

export function computePanchang(input: PanchangInput): PanchangData {
  const { year, month, day, lat, lng, tzOffset, locationName } = input;

  // Compute Julian Day at midnight UT for this date
  const jd = dateToJD(year, month, day, 12 - tzOffset); // Convert local noon to UT

  // Sunrise and sunset (in UT decimal hours)
  const sunriseUT = approximateSunrise(jd, lat, lng);
  const sunsetUT = approximateSunset(jd, lat, lng);

  // Compute at local sunrise time
  const jdSunrise = dateToJD(year, month, day, sunriseUT);

  // 1. Tithi
  const tithiResult = calculateTithi(jdSunrise);
  const tithiData = TITHIS[tithiResult.number - 1] || TITHIS[0];

  // 2. Nakshatra (of Moon)
  const moonSid = toSidereal(moonLongitude(jdSunrise), jdSunrise);
  const nakshatraNum = getNakshatraNumber(moonSid);
  const nakshatraPada = getNakshatraPada(moonSid);
  const nakshatraData = { ...NAKSHATRAS[nakshatraNum - 1], pada: nakshatraPada };

  // 3. Yoga
  const yogaNum = calculateYoga(jdSunrise);
  const yogaData = YOGAS[yogaNum - 1] || YOGAS[0];

  // 4. Karana
  const karanaNum = calculateKarana(jdSunrise);
  const karanaData = KARANAS[karanaNum - 1] || KARANAS[0];

  // 5. Vara
  const date = new Date(year, month - 1, day);
  const weekday = date.getDay();
  const varaData = VARA_DATA[weekday];

  // Rahu Kaal
  const rahuKaal = calculateRahuKaal(sunriseUT, sunsetUT, weekday);

  // Yamaganda (similar pattern)
  const yamaOrder = [5, 4, 3, 2, 1, 7, 6];
  const yamaDuration = (sunsetUT - sunriseUT) / 8;
  const yamaSegment = yamaOrder[weekday] - 1;
  const yamaganda = {
    start: sunriseUT + yamaSegment * yamaDuration,
    end: sunriseUT + (yamaSegment + 1) * yamaDuration,
  };

  // Gulika Kaal
  const gulikaOrder = [7, 6, 5, 4, 3, 2, 1];
  const gulikaSegment = gulikaOrder[weekday] - 1;
  const gulikaKaal = {
    start: sunriseUT + gulikaSegment * yamaDuration,
    end: sunriseUT + (gulikaSegment + 1) * yamaDuration,
  };

  // Planetary positions
  const planetPositions = getPlanetaryPositions(jdSunrise);
  const planets = planetPositions.map((p) => {
    const graha = GRAHAS[p.id];
    const sidLong = toSidereal(p.longitude, jdSunrise);
    const rashi = getRashiNumber(sidLong);
    const nakshatra = getNakshatraNumber(sidLong);
    return {
      ...graha,
      longitude: sidLong,
      rashi,
      nakshatra,
      isRetrograde: p.isRetrograde,
    };
  });

  // Muhurtas (15 day + 15 night)
  const dayDuration = sunsetUT - sunriseUT;
  const nightDuration = 24 - dayDuration;
  const dayMuhurtaDuration = dayDuration / 15;
  const nightMuhurtaDuration = nightDuration / 15;

  const muhurtas: Muhurta[] = MUHURTA_DATA.map((m) => {
    const isDay = m.period === 'day';
    const idx = isDay ? m.number - 1 : m.number - 16;
    const duration = isDay ? dayMuhurtaDuration : nightMuhurtaDuration;
    const base = isDay ? sunriseUT : sunsetUT;
    const startUT = base + idx * duration;
    const endUT = startUT + duration;
    return {
      number: m.number,
      name: m.name,
      startTime: formatTime(startUT % 24, tzOffset),
      endTime: formatTime(endUT % 24, tzOffset),
      nature: m.nature,
    };
  });

  // Abhijit Muhurta — the 8th daytime muhurta (around midday)
  const abhijitStart = sunriseUT + 7 * dayMuhurtaDuration;
  const abhijitEnd = abhijitStart + dayMuhurtaDuration;
  const abhijitMuhurta = {
    start: formatTime(abhijitStart, tzOffset),
    end: formatTime(abhijitEnd, tzOffset),
  };

  // Masa, Ritu, Samvatsara
  const sunSid = toSidereal(sunLongitude(jdSunrise), jdSunrise);
  const masaIndex = getMasa(sunSid);
  const rituIndex = getRitu(masaIndex);
  const samvatsaraIndex = getSamvatsara(year);
  const ayana = getAyana(sunSid);

  return {
    date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    location: { lat, lng, name: locationName || `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E` },
    tithi: tithiData,
    nakshatra: nakshatraData,
    yoga: yogaData,
    karana: karanaData,
    vara: { day: weekday, name: varaData.name, ruler: varaData.ruler },
    sunrise: formatTime(sunriseUT, tzOffset),
    sunset: formatTime(sunsetUT, tzOffset),
    moonrise: formatTime((sunriseUT + 0.5 + (tithiResult.number % 15) * 0.2) % 24, tzOffset), // Approximate based on tithi
    moonset: formatTime((sunsetUT + 0.5 + (tithiResult.number % 15) * 0.2) % 24, tzOffset), // Approximate based on tithi
    rahuKaal: { start: formatTime(rahuKaal.start, tzOffset), end: formatTime(rahuKaal.end, tzOffset) },
    yamaganda: { start: formatTime(yamaganda.start, tzOffset), end: formatTime(yamaganda.end, tzOffset) },
    gulikaKaal: { start: formatTime(gulikaKaal.start, tzOffset), end: formatTime(gulikaKaal.end, tzOffset) },
    muhurtas,
    abhijitMuhurta,
    planets,
    masa: MASA_NAMES[masaIndex] || MASA_NAMES[0],
    samvatsara: SAMVATSARA_NAMES[samvatsaraIndex] || SAMVATSARA_NAMES[0],
    ritu: RITU_NAMES[rituIndex] || RITU_NAMES[0],
    ayana,
  };
}
