/**
 * Varshaphal (Solar Return) — Orchestrator
 * Generates the complete Tajika annual horoscopy chart
 */

import { generateKundali } from '@/lib/ephem/kundali-calc';
import { sunLongitude, toSidereal, getNakshatraNumber, normalizeDeg, dateToJD, approximateSunrise, approximateSunset } from '@/lib/ephem/astronomical';
import { resolveTimezone } from '@/lib/utils/timezone';
import { findSolarReturn } from './solar-return';
import { calculateMuntha } from './muntha';
import { determineVarsheshvara } from './varsheshvara';
import { calculateSahams } from './sahams';
import { detectTajikaYogas } from './tajika-aspects';
import { calculateMuddaDasha } from './mudda-dasha';
import type { BirthData } from '@/types/kundali';
import type { VarshaphalData } from '@/types/varshaphal';
import type { LocaleText,} from '@/types/panchang';

export function generateVarshaphal(birthData: BirthData, year: number): VarshaphalData {
  // 1. Generate natal chart
  const natalChart = generateKundali(birthData);
  const natalSunSidereal = natalChart.planets.find(p => p.planet.id === 0)!.longitude;

  // 2. Find solar return moment
  const [by, bm, bd] = birthData.date.split('-').map(Number);
  const tzOffset = resolveTimezone(birthData.timezone, by, bm, bd);
  const solarReturn = findSolarReturn(natalSunSidereal, year, birthData.lat, birthData.lng, tzOffset);

  // 3. Generate Varshaphal chart at solar return moment
  const srDate = solarReturn.date;
  const varshaphalBirthData: BirthData = {
    ...birthData,
    name: `Varshaphal ${year}`,
    date: `${srDate.getFullYear()}-${String(srDate.getMonth() + 1).padStart(2, '0')}-${String(srDate.getDate()).padStart(2, '0')}`,
    time: `${String(srDate.getHours()).padStart(2, '0')}:${String(srDate.getMinutes()).padStart(2, '0')}`,
  };
  const varshaphalChart = generateKundali(varshaphalBirthData);

  // 4. Calculate age
  const [birthYear] = birthData.date.split('-').map(Number);
  const age = year - birthYear;

  // 5. Muntha
  const muntha = calculateMuntha(
    natalChart.ascendant.sign,
    age,
    varshaphalChart.ascendant.sign,
  );

  // 6. Varsheshvara (Year Lord)
  const srWeekday = srDate.getDay();
  const varsheshvara = determineVarsheshvara(srWeekday, varshaphalChart.planets);

  // 7. Sahams — use actual sunrise/sunset for day/night determination
  const srYear = srDate.getFullYear();
  const srMonth = srDate.getMonth() + 1;
  const srDay = srDate.getDate();
  const jdSrNoon = dateToJD(srYear, srMonth, srDay, 12 - tzOffset);
  const srSunriseUT = approximateSunrise(jdSrNoon, birthData.lat, birthData.lng);
  const srSunsetUT = approximateSunset(jdSrNoon, birthData.lat, birthData.lng);
  const srHourUT = srDate.getHours() - tzOffset + srDate.getMinutes() / 60;
  const isDayBirth = srHourUT >= srSunriseUT && srHourUT < srSunsetUT;
  const sahams = calculateSahams(
    varshaphalChart.ascendant.degree,
    varshaphalChart.planets,
    varshaphalChart.houses,
    isDayBirth,
  );

  // 8. Tajika Yogas
  const tajikaYogas = detectTajikaYogas(varshaphalChart.planets);

  // 9. Mudda Dasha
  const moonPlanet = varshaphalChart.planets.find(p => p.planet.id === 1)!;
  const moonNak = getNakshatraNumber(moonPlanet.longitude);
  const nakshatraSpan = 360 / 27;
  const moonDegInNak = moonPlanet.longitude % nakshatraSpan;
  const muddaDasha = calculateMuddaDasha(moonNak, moonDegInNak, srDate);

  // 10. Year summary
  const yearSummary = generateYearSummary(muntha, varsheshvara, tajikaYogas);

  return {
    natalData: natalChart,
    solarReturnMoment: srDate.toISOString(),
    solarReturnJD: solarReturn.jd,
    year,
    age,
    chart: varshaphalChart,
    muntha,
    varsheshvara,
    sahams,
    tajikaYogas,
    muddaDasha,
    yearSummary,
  };
}

function generateYearSummary(
  muntha: { house: number },
  varsheshvara: { planetName: LocaleText },
  yogas: { favorable: boolean }[],
): LocaleText {
  const favorable = yogas.filter(y => y.favorable).length;
  const total = yogas.length;
  const mHouse = muntha.house;
  const lord = varsheshvara.planetName;

  const goodHouses = [1, 2, 4, 5, 9, 10, 11];
  const munthaGood = goodHouses.includes(mHouse);

  return {
    en: `Year Lord ${lord.en} guides this year. Muntha in house ${mHouse} is ${munthaGood ? 'favorable' : 'challenging'}. ${favorable}/${total} Tajika yogas are supportive. ${munthaGood && favorable > total / 2 ? 'Overall a promising year.' : 'Exercise caution and focus on remedies.'}`,
    hi: `वर्षेश्वर ${lord.hi} इस वर्ष का मार्गदर्शन करते हैं। मुन्था भाव ${mHouse} में ${munthaGood ? 'अनुकूल' : 'चुनौतीपूर्ण'} है। ${favorable}/${total} ताजिक योग सहायक हैं। ${munthaGood && favorable > total / 2 ? 'कुल मिलाकर आशाजनक वर्ष।' : 'सावधानी बरतें और उपायों पर ध्यान दें।'}`,
    sa: `वर्षेश्वरः ${lord.sa} अस्य वर्षस्य मार्गदर्शकः। मुन्था भावे ${mHouse} ${munthaGood ? 'अनुकूलः' : 'प्रतिकूलः'}। ${favorable}/${total} ताजिकयोगाः सहायकाः। ${munthaGood && favorable > total / 2 ? 'समग्रतया आशाजनकं वर्षम्।' : 'सावधानता उपायाश्च आवश्यकाः।'}`,
  };
}
