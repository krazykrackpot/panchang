/**
 * Sankalpa Generator — assembles a personalized ritual declaration
 * with computed astronomical fields (tithi, nakshatra, yoga, vara, masa, etc.)
 */

import { dateToJD, sunLongitude, moonLongitude, toSidereal, calculateTithi, getNakshatraNumber, calculateYoga, getMasa, getSamvatsara, getRitu, getAyana, MASA_NAMES, SAMVATSARA_NAMES, RITU_NAMES } from '@/lib/ephem/astronomical';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SankalpaInput {
  date: Date;
  lat: number;
  lng: number;
  timezoneOffset: number; // hours from UTC (e.g. 5.5 for IST, 1 for CET)
  userName?: string;      // Devanagari
  gotra?: string;         // Devanagari
  pujaDeity: string;      // Devanagari deity name
  festivalSlug: string;
}

export interface GeneratedSankalpa {
  devanagari: string;
  fields: {
    samvatsara: string;
    ayana: string;
    ritu: string;
    masa: string;
    paksha: string;
    tithi: string;
    vara: string;
    nakshatra: string;
    yoga: string;
  };
}

// ---------------------------------------------------------------------------
// Sanskrit weekday names (Sunday = 0)
// ---------------------------------------------------------------------------

const VARA_NAMES_SA = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export function generateSankalpa(input: SankalpaInput): GeneratedSankalpa {
  const { date, timezoneOffset, userName, gotra, pujaDeity } = input;

  // 1. Compute JD at ~6 AM local time (approximating sunrise)
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const localHour = 6; // approximate sunrise
  const utcHour = localHour - timezoneOffset;
  const jd = dateToJD(year, month, day, utcHour);

  // 2. Sun & Moon sidereal longitudes
  const sunTrop = sunLongitude(jd);
  const moonTrop = moonLongitude(jd);
  const sunSid = toSidereal(sunTrop, jd);
  const moonSid = toSidereal(moonTrop, jd);

  // 3. Compute panchang elements
  const tithiResult = calculateTithi(jd);   // { number: 1-30, degree }
  const nakshatraNum = getNakshatraNumber(moonSid); // 1-27
  const yogaNum = calculateYoga(jd);         // 1-27
  const masaIndex = getMasa(sunSid);          // 0-11
  const samvatsaraIndex = getSamvatsara(year); // 0-59
  const rituIndex = getRitu(masaIndex);       // 0-5
  const ayana = getAyana(sunSid);             // { en, hi, sa }

  // 4. Look up Sanskrit names
  const tithiData = TITHIS[tithiResult.number - 1]; // 0-indexed array, 1-based number
  const nakshatraData = NAKSHATRAS[nakshatraNum - 1];
  const yogaData = YOGAS[yogaNum - 1];

  const samvatsaraSa = SAMVATSARA_NAMES[samvatsaraIndex].sa;
  const rituSa = RITU_NAMES[rituIndex].sa;
  const masaSa = MASA_NAMES[masaIndex].sa;
  const ayanaSa = ayana.sa;

  const tithiSa = tithiData.name.sa;
  const pakshaSa = tithiResult.number <= 15 ? 'शुक्ल' : 'कृष्ण';
  const nakshatraSa = nakshatraData.name.sa;
  const yogaSa = yogaData.name.sa;

  // Vara: JS Date.getDay() returns 0=Sunday
  const varaIndex = date.getDay();
  const varaSa = VARA_NAMES_SA[varaIndex];

  // 5. Assemble the sankalpa text in Devanagari
  const nameField = userName || '______';
  const gotraField = gotra || '______';

  const devanagari = [
    'ॐ विष्णुर् विष्णुर् विष्णुः',
    `${samvatsaraSa} नाम संवत्सरे ${ayanaSa} ${rituSa} ऋतौ`,
    `${masaSa} मासे ${pakshaSa} पक्षे ${tithiSa} तिथौ`,
    `${varaSa}वासरे ${nakshatraSa} नक्षत्रे ${yogaSa} योगे`,
    `${nameField} ${gotraField} गोत्रस्य`,
    `${pujaDeity} प्रीत्यर्थं पूजनम् अहं करिष्ये ॥`,
  ].join('\n');

  return {
    devanagari,
    fields: {
      samvatsara: samvatsaraSa,
      ayana: ayanaSa,
      ritu: rituSa,
      masa: masaSa,
      paksha: pakshaSa,
      tithi: tithiSa,
      vara: varaSa,
      nakshatra: nakshatraSa,
      yoga: yogaSa,
    },
  };
}
