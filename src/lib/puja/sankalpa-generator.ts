/**
 * Sankalpa Generator — assembles a personalized ritual declaration
 * with computed astronomical fields (tithi, nakshatra, yoga, karana, vara, masa, etc.)
 */

import { dateToJD, approximateSunrise, sunLongitude, moonLongitude, toSidereal, calculateTithi, calculateKarana, getNakshatraNumber, getRashiNumber, calculateYoga, getMasa, getSamvatsara, getRitu, getAyana, MASA_NAMES, SAMVATSARA_NAMES, RITU_NAMES } from '@/lib/ephem/astronomical';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { RASHIS } from '@/lib/constants/rashis';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SankalpaInput {
  date: Date;
  lat: number;
  lng: number;
  timezoneOffset: number; // hours from UTC (e.g. 5.5 for IST, 1 for CET)
  userName?: string;
  gotra?: string;
  pujaDeity: string;
  festivalSlug: string;
  placeName?: string;     // City/town name for geographic context
  masaSystem?: 'purnimant' | 'amant'; // Calendar system (default: purnimant)
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
    karana: string;
    moonRashi: string;
    sunRashi: string;
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

  // 1. Compute JD at actual sunrise
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const jdNoon = dateToJD(year, month, day, 12 - timezoneOffset);
  const sunriseUT = approximateSunrise(jdNoon, input.lat, input.lng);
  const jd = dateToJD(year, month, day, sunriseUT);

  // 2. Sun & Moon sidereal longitudes
  const sunTrop = sunLongitude(jd);
  const moonTrop = moonLongitude(jd);
  const sunSid = toSidereal(sunTrop, jd);
  const moonSid = toSidereal(moonTrop, jd);

  // 3. Compute panchang elements
  const tithiResult = calculateTithi(jd);   // { number: 1-30, degree }
  const nakshatraNum = getNakshatraNumber(moonSid); // 1-27
  const yogaNum = calculateYoga(jd);         // 1-27
  const purnimantMasaIndex = getMasa(sunSid);  // 0-11 (Purnimant: default, used in North India)
  // Amant masa: in Krishna paksha (tithi > 15), the Amant month is the NEXT Purnimant month
  const amantMasaIndex = tithiResult.number > 15 ? (purnimantMasaIndex + 1) % 12 : purnimantMasaIndex;
  const useAmant = input.masaSystem === 'amant';
  const masaIndex = useAmant ? amantMasaIndex : purnimantMasaIndex;

  const samvatsaraIndex = getSamvatsara(year); // 0-59
  const rituIndex = getRitu(purnimantMasaIndex); // Ritu always based on solar month
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

  // Karana
  const karanaNum = calculateKarana(jd);
  const karanaData = KARANAS[karanaNum - 1];
  const karanaSa = karanaData?.name?.sa || karanaData?.name?.hi || '';

  // Moon & Sun rashis
  const moonRashi = getRashiNumber(moonSid);
  const sunRashi = getRashiNumber(sunSid);
  const moonRashiSa = RASHIS[moonRashi - 1]?.name?.sa || RASHIS[moonRashi - 1]?.name?.hi || '';
  const sunRashiSa = RASHIS[sunRashi - 1]?.name?.sa || RASHIS[sunRashi - 1]?.name?.hi || '';

  // Vikram Samvat
  const vikramSamvat = year + 57;

  // 5. Assemble the full traditional sankalpa in Devanagari (traditional Dharma Sindhu format)
  const nameField = userName || '............';
  const gotraField = gotra || '............';
  const place = input.placeName || '............';

  // Geographic context — Ganga reference based on latitude
  const isIndia = input.lat >= 8 && input.lat <= 37 && input.lng >= 68 && input.lng <= 97;
  const gangaRef = input.lat >= 25 ? 'उत्तरे' : 'दक्षिणे'; // North/South of Ganga (~25°N)

  const geoPreamble = isIndia
    ? `भूर्लोके भारतवर्षे जम्बूद्वीपे भरतखण्डे आर्यावर्तान्तर्गतब्रह्मावर्तस्य ${place} क्षेत्रे ${place} नाम्निनगरे श्रीगङ्गायाः ${gangaRef} दिग्भागे`
    : `भूर्लोके भारतवर्षे जम्बूद्वीपे भरतखण्डे आर्यावर्तान्तर्गतब्रह्मावर्तस्य ${place} क्षेत्रे ${place} नाम्निनगरे`;

  const devanagari = [
    // Invocation
    'ॐ विष्णुर्विष्णुर्विष्णुः।',
    // Cosmic era
    'श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य अद्यैतस्य ब्रह्मणोह्नि द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे युगे कलियुगे कलि प्रथमचरणे',
    // Geographic context
    geoPreamble,
    // Vikram era + Samvatsara
    `देवब्राह्मणानां सन्निधौ श्रीमन्नृपतिवीरविक्रमादित्यसमयतः ${vikramSamvat} संख्या-परिमिते प्रवर्त्तमानसंवत्सरे प्रभवादिषष्ठि-संवत्सराणां मध्ये ${samvatsaraSa} नामसंवत्सरे`,
    // Ayana, Ritu, Masa, Paksha, Tithi
    `${ayanaSa.replace('म्', '')} अयने ${rituSa.replace('ः', '')} ऋतौ ${masaSa.replace('ः', '')} मासे ${pakshaSa} पक्षे ${tithiSa} तिथौ`,
    // Vara, Nakshatra, Yoga, Karana
    `${varaSa}वार वासरे ${nakshatraSa.replace('ः', '')} नक्षत्रे ${yogaSa.replace('ः', '')} योगे ${karanaSa.replace('ः', '')} करणे`,
    // Graha positions
    `${moonRashiSa} राशिस्थिते चन्द्रे ${sunRashiSa} राशिस्थितेश्रीसूर्ये शेषेशु ग्रहेषु यथायथा राशिस्थानस्थितेषु सत्सु`,
    // Auspicious time declaration
    'एवं ग्रहगुणविशेषणविशिष्टायां शुभपुण्यतिथौ',
    // Person identity
    `${gotraField} गोत्रोत्पन्नस्य ${nameField} सपरिवारस्य ममात्मनः`,
    // Purpose with full traditional preamble
    `श्रुति-स्मृति-पुराणोक्त-पुण्य-फलप्राप्त्यर्थं मम सकुटुम्बस्य सपरिवारस्य क्षेमस्थैर्यायुरारोग्यैश्वर्याभिवृद्ध्यर्थं धर्मार्थकाममोक्षफलप्राप्त्यर्थं`,
    `${pujaDeity} देवस्य प्रीत्यर्थं पूजनम् अहं करिष्ये ॥`,
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
      karana: karanaSa,
      moonRashi: moonRashiSa,
      sunRashi: sunRashiSa,
    },
  };
}
