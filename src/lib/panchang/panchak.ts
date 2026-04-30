/**
 * Panchak (पंचक) — inauspicious period when Moon transits through nakshatras 23-27
 * (Dhanishtha, Shatabhisha, Purva Bhadrapada, Uttara Bhadrapada, Revati).
 *
 * During Panchak, activities like collecting wood/fuel, building roofs, southward travel,
 * making beds, and cremation are avoided. The specific fear associated with Panchak
 * depends on the nakshatra Moon is transiting.
 *
 * Reference: Dharma Sindhu, Nirṇaya Sindhu.
 */

export interface PanchakInfo {
  isActive: boolean;
  nakshatraId: number | null;  // 23-27 if active
  type: string | null;  // 'death' | 'disease' | 'fire' | 'financial' | 'travel'
  description: { en: string; hi: string };
  avoidActivities: { en: string; hi: string }[];
}

/** Panchak type by nakshatra — each of the 5 nakshatras carries a specific fear. */
const PANCHAK_NAKSHATRA_TYPE: Record<number, {
  type: string;
  description: { en: string; hi: string };
}> = {
  23: {
    type: 'death',
    description: {
      en: 'Dhanishtha Panchak — associated with death-related fears. Avoid cremation and funeral rites.',
      hi: 'धनिष्ठा पंचक — मृत्यु संबंधी भय। अंत्येष्टि एवं श्राद्ध कर्म वर्जित।',
    },
  },
  24: {
    type: 'disease',
    description: {
      en: 'Shatabhisha Panchak — associated with disease fears. Avoid starting medical treatments.',
      hi: 'शतभिषा पंचक — रोग संबंधी भय। नवीन चिकित्सा आरम्भ वर्जित।',
    },
  },
  25: {
    type: 'fire',
    description: {
      en: 'Purva Bhadrapada Panchak — associated with fire-related fears. Avoid building roofs and collecting fuel.',
      hi: 'पूर्वा भाद्रपद पंचक — अग्नि संबंधी भय। छत निर्माण एवं ईंधन संग्रह वर्जित।',
    },
  },
  26: {
    type: 'financial',
    description: {
      en: 'Uttara Bhadrapada Panchak — associated with financial fears. Avoid major financial decisions.',
      hi: 'उत्तरा भाद्रपद पंचक — आर्थिक संबंधी भय। बड़े वित्तीय निर्णय वर्जित।',
    },
  },
  27: {
    type: 'travel',
    description: {
      en: 'Revati Panchak — associated with travel-related fears. Avoid southward journeys.',
      hi: 'रेवती पंचक — यात्रा संबंधी भय। दक्षिण दिशा की यात्रा वर्जित।',
    },
  },
};

/** Activities to avoid during any Panchak period. */
const PANCHAK_AVOID_ACTIVITIES: { en: string; hi: string }[] = [
  { en: 'Collecting wood or fuel', hi: 'लकड़ी या ईंधन संग्रह' },
  { en: 'Building roof or ceiling', hi: 'छत या छज्जा निर्माण' },
  { en: 'Starting southward journeys', hi: 'दक्षिण दिशा की यात्रा' },
  { en: 'Making bed or cot', hi: 'खाट या शय्या निर्माण' },
  { en: 'Cremation (special rituals needed — 5 effigies)', hi: 'अंत्येष्टि (विशेष विधि आवश्यक — 5 पुतले)' },
];

/**
 * Check if Panchak is active based on the current Moon nakshatra.
 * Panchak is active when Moon is in nakshatras 23-27 (Dhanishtha through Revati).
 *
 * @param moonNakshatraId — current Moon nakshatra (1-27)
 */
export function checkPanchak(moonNakshatraId: number): PanchakInfo {
  const nkData = PANCHAK_NAKSHATRA_TYPE[moonNakshatraId];

  if (!nkData) {
    return {
      isActive: false,
      nakshatraId: null,
      type: null,
      description: { en: '', hi: '' },
      avoidActivities: [],
    };
  }

  return {
    isActive: true,
    nakshatraId: moonNakshatraId,
    type: nkData.type,
    description: nkData.description,
    avoidActivities: PANCHAK_AVOID_ACTIVITIES,
  };
}
