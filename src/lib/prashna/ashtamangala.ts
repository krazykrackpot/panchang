/**
 * Ashtamangala Prashna — Core Engine
 * Implements the 8 sacred objects, number-to-object mapping,
 * aruda house calculation, and the main orchestrator function.
 */

import { GRAHAS } from '@/lib/constants/grahas';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData, KundaliData } from '@/types/kundali';
import type {
  AshtamangalaObject,
  QuestionCategory,
  AshtamangalaPrashnaData,
} from '@/types/prashna';
import type { Locale } from '@/types/panchang';
import { detectPrashnaYogas } from './prashna-yogas';
import { generateInterpretation } from './interpretation';

/**
 * The 8 Ashtamangala objects with their planetary rulers,
 * elements, and symbolic meanings — all in Trilingual form.
 */
export const ASHTAMANGALA_OBJECTS: AshtamangalaObject[] = [
  {
    id: 1,
    name: { en: 'Darpana (Mirror)', hi: 'दर्पण (आईना)', sa: 'दर्पणम्' },
    planetRuler: 5,
    planetName: GRAHAS[5].name,
    element: { en: 'Water', hi: 'जल', sa: 'जलम्' },
    symbolism: { en: 'Clarity and Reflection', hi: 'स्पष्टता एवं प्रतिबिम्ब', sa: 'स्पष्टता प्रतिबिम्बश्च' },
  },
  {
    id: 2,
    name: { en: 'Purna Kumbha (Full Vessel)', hi: 'पूर्ण कुम्भ', sa: 'पूर्णकुम्भः' },
    planetRuler: 1,
    planetName: GRAHAS[1].name,
    element: { en: 'Water', hi: 'जल', sa: 'जलम्' },
    symbolism: { en: 'Abundance and Fulfillment', hi: 'प्रचुरता एवं पूर्णता', sa: 'प्राचुर्यं पूर्णता च' },
  },
  {
    id: 3,
    name: { en: 'Matsya Yugma (Fish Pair)', hi: 'मत्स्य युग्म', sa: 'मत्स्ययुग्मम्' },
    planetRuler: 4,
    planetName: GRAHAS[4].name,
    element: { en: 'Water', hi: 'जल', sa: 'जलम्' },
    symbolism: { en: 'Prosperity and Growth', hi: 'समृद्धि एवं वृद्धि', sa: 'समृद्धिः वृद्धिश्च' },
  },
  {
    id: 4,
    name: { en: 'Deepa (Lamp)', hi: 'दीप', sa: 'दीपः' },
    planetRuler: 0,
    planetName: GRAHAS[0].name,
    element: { en: 'Fire', hi: 'अग्नि', sa: 'अग्निः' },
    symbolism: { en: 'Knowledge and Fame', hi: 'ज्ञान एवं यश', sa: 'ज्ञानं यशश्च' },
  },
  {
    id: 5,
    name: { en: 'Simhasana (Throne)', hi: 'सिंहासन', sa: 'सिंहासनम्' },
    planetRuler: 2,
    planetName: GRAHAS[2].name,
    element: { en: 'Fire', hi: 'अग्नि', sa: 'अग्निः' },
    symbolism: { en: 'Authority and Power', hi: 'अधिकार एवं शक्ति', sa: 'अधिकारः शक्तिश्च' },
  },
  {
    id: 6,
    name: { en: 'Vrishabha (Bull)', hi: 'वृषभ (बैल)', sa: 'वृषभः' },
    planetRuler: 6,
    planetName: GRAHAS[6].name,
    element: { en: 'Earth', hi: 'पृथ्वी', sa: 'पृथिवी' },
    symbolism: { en: 'Stability and Wealth', hi: 'स्थिरता एवं धन', sa: 'स्थैर्यं धनं च' },
  },
  {
    id: 7,
    name: { en: 'Dhvaja (Flag)', hi: 'ध्वज (पताका)', sa: 'ध्वजः' },
    planetRuler: 3,
    planetName: GRAHAS[3].name,
    element: { en: 'Air', hi: 'वायु', sa: 'वायुः' },
    symbolism: { en: 'Victory and Success', hi: 'विजय एवं सफलता', sa: 'विजयः सिद्धिश्च' },
  },
  {
    id: 8,
    name: { en: 'Chamara (Fan)', hi: 'चामर', sa: 'चामरम्' },
    planetRuler: 7,
    planetName: GRAHAS[7].name,
    element: { en: 'Air', hi: 'वायु', sa: 'वायुः' },
    symbolism: { en: 'Luxury and Comfort', hi: 'विलासिता एवं सुख', sa: 'विलासः सुखं च' },
  },
];

/**
 * Map a querent-chosen number to one of the 8 Ashtamangala objects.
 * Uses modular arithmetic so any positive integer maps to an object.
 *
 * @param num - A positive integer chosen by the querent
 * @returns The corresponding AshtamangalaObject
 */
export function mapNumberToObject(num: number): AshtamangalaObject {
  const index = ((num - 1) % 8 + 8) % 8; // handles negatives gracefully
  return ASHTAMANGALA_OBJECTS[index];
}

/**
 * Calculate the Aruda house from a querent-chosen number.
 * The aruda indicates which bhava (house) is activated.
 *
 * @param num - A positive integer chosen by the querent
 * @returns House number 1-12
 */
export function calculateArudaHouse(num: number): number {
  return ((num - 1) % 12 + 12) % 12 + 1; // handles negatives gracefully
}

/**
 * Format current local time as an ISO date string and HH:mm time string.
 */
function getCurrentDateTime(tz: number | string): { date: string; time: string } {
  const now = new Date();

  // Parse timezone offset
  const tzOffset = (typeof tz === 'number' ? tz : parseFloat(tz)) || 5.5;
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const localMs = utcMs + tzOffset * 3600000;
  const local = new Date(localMs);

  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, '0');
  const day = String(local.getDate()).padStart(2, '0');
  const hours = String(local.getHours()).padStart(2, '0');
  const minutes = String(local.getMinutes()).padStart(2, '0');

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}

/**
 * Main orchestrator: generate a complete Ashtamangala Prashna result.
 *
 * @param numbers - Three numbers chosen by the querent
 * @param category - The question category
 * @param lat - Latitude of the query location
 * @param lng - Longitude of the query location
 * @param tz - Timezone offset (e.g. 5.5 for IST, or "5.5")
 * @param locale - Display locale for text (optional, defaults to 'en')
 * @returns Complete AshtamangalaPrashnaData
 */
export function generatePrashnaResult(
  numbers: [number, number, number],
  category: QuestionCategory,
  lat: number,
  lng: number,
  tz: number | string,
  locale: Locale = 'en'
): AshtamangalaPrashnaData {
  // 1. Map numbers to objects
  const objects: [AshtamangalaObject, AshtamangalaObject, AshtamangalaObject] = [
    mapNumberToObject(numbers[0]),
    mapNumberToObject(numbers[1]),
    mapNumberToObject(numbers[2]),
  ];

  // 2. Calculate aruda houses
  const arudaHouses: [number, number, number] = [
    calculateArudaHouse(numbers[0]),
    calculateArudaHouse(numbers[1]),
    calculateArudaHouse(numbers[2]),
  ];

  // 3. Generate prashna kundali using current time
  const { date, time } = getCurrentDateTime(tz);
  const birthData: BirthData = {
    name: 'Prashna Chart',
    date,
    time,
    place: 'Prashna Location',
    lat,
    lng,
    timezone: String(tz),
    ayanamsha: 'lahiri',
  };

  const prashnaChart: KundaliData = generateKundali(birthData);
  const ascSign = prashnaChart.ascendant.sign;

  // 4. Detect prashna yogas
  const yogas = detectPrashnaYogas(prashnaChart.planets, ascSign);

  // 5. Generate interpretation
  const interpretation = generateInterpretation(
    objects,
    yogas,
    category,
    arudaHouses,
    prashnaChart.planets,
    ascSign
  );

  // 6. Return complete data
  return {
    numbers,
    objects,
    arudaHouses,
    category,
    prashnaChart,
    yogas,
    interpretation,
    castTime: new Date().toISOString(),
  };
}
