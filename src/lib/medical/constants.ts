/**
 * Medical Astrology constants — planet→dosha, house→body region,
 * sign→element, disease pattern definitions.
 *
 * All tables from classical Ayurveda & Jyotish texts (Charaka Samhita,
 * BPHS, Sarvartha Chintamani).
 */

// ─── Dosha types ────────────────────────────────────────────────────────────
export type Dosha = 'vata' | 'pitta' | 'kapha';

// ─── Planet → Dosha ─────────────────────────────────────────────────────────
// Planet IDs: 0=Sun,1=Moon,2=Mars,3=Mercury,4=Jupiter,5=Venus,6=Saturn,7=Rahu,8=Ketu
// Mercury (3) is tridoshic — resolved at runtime by context
export const PLANET_DOSHA: Record<number, Dosha | 'tridosha'> = {
  0: 'pitta',    // Sun
  1: 'kapha',    // Moon
  2: 'pitta',    // Mars
  3: 'tridosha', // Mercury — adapts
  4: 'kapha',    // Jupiter
  5: 'kapha',    // Venus
  6: 'vata',     // Saturn
  7: 'vata',     // Rahu
  8: 'pitta',    // Ketu
};

// ─── Sign → Element ─────────────────────────────────────────────────────────
export type SignElement = 'fire' | 'earth' | 'air' | 'water';

/** Rashi IDs are 1-based (1=Aries … 12=Pisces) */
export const SIGN_ELEMENT: Record<number, SignElement> = {
  1: 'fire',   // Aries
  2: 'earth',  // Taurus
  3: 'air',    // Gemini
  4: 'water',  // Cancer
  5: 'fire',   // Leo
  6: 'earth',  // Virgo
  7: 'air',    // Libra
  8: 'water',  // Scorpio
  9: 'fire',   // Sagittarius
  10: 'earth', // Capricorn
  11: 'air',   // Aquarius
  12: 'water', // Pisces
};

/** Element → Dosha scores (must total 100%) */
export const ELEMENT_DOSHA_SCORES: Record<SignElement, Partial<Record<Dosha, number>>> = {
  fire:  { pitta: 100 },
  earth: { kapha: 100 },
  air:   { vata: 100 },
  water: { kapha: 50, pitta: 50 },
};

// ─── House → Body Region ─────────────────────────────────────────────────────
export interface BodyRegion {
  house: number;
  en: string;
  hi: string;
  ta: string;
  bn: string;
}

export const HOUSE_BODY_REGION: BodyRegion[] = [
  { house: 1,  en: 'Head & Brain',           hi: 'सिर एवं मस्तिष्क',    ta: 'தலை மற்றும் மூளை',         bn: 'মাথা ও মস্তিষ্ক' },
  { house: 2,  en: 'Face, Throat & Speech',  hi: 'मुख, कण्ठ एवं वाणी',  ta: 'முகம், தொண்டை மற்றும் பேச்சு', bn: 'মুখ, গলা ও বাক্' },
  { house: 3,  en: 'Arms, Lungs & Chest',    hi: 'भुजाएं, फेफड़े एवं वक्ष', ta: 'கைகள், நுரையீரல் மற்றும் மார்பு', bn: 'বাহু, ফুসফুস ও বুক' },
  { house: 4,  en: 'Chest, Heart & Breast',  hi: 'हृदय एवं स्तन',         ta: 'இதயம் மற்றும் மார்பகம்',    bn: 'হৃদয় ও বুক' },
  { house: 5,  en: 'Stomach, Liver & Mind',  hi: 'आमाशय, यकृत एवं मन',   ta: 'வயிறு, கல்லீரல் மற்றும் மனம்', bn: 'পাকস্থলী, যকৃৎ ও মন' },
  { house: 6,  en: 'Intestines & Digestion', hi: 'आंत एवं पाचन',          ta: 'குடல் மற்றும் செரிமானம்',    bn: 'অন্ত্র ও পাচনতন্ত্র' },
  { house: 7,  en: 'Kidneys & Reproductive', hi: 'वृक्क एवं प्रजनन',      ta: 'சிறுநீரகங்கள் மற்றும் இனப்பெருக்கம்', bn: 'কিডনি ও প্রজনন' },
  { house: 8,  en: 'Chronic & Hidden Illness', hi: 'दीर्घकालिक रोग',      ta: 'நாள்பட்ட நோய்கள்',          bn: 'দীর্ঘস্থায়ী রোগ' },
  { house: 9,  en: 'Hips & Thighs',          hi: 'कूल्हे एवं जंघाएं',    ta: 'இடுப்பு மற்றும் தொடைகள்',   bn: 'নিতম্ব ও উরু' },
  { house: 10, en: 'Knees & Spine',          hi: 'घुटने एवं मेरुदण्ड',   ta: 'முழங்கால் மற்றும் முதுகெலும்பு', bn: 'হাঁটু ও মেরুদণ্ড' },
  { house: 11, en: 'Calves & Ankles',        hi: 'पिण्डलियां एवं टखने',  ta: 'கால்கள் மற்றும் கணுக்கால்',  bn: 'পায়ের নলা ও গোড়ালি' },
  { house: 12, en: 'Feet, Eyes & Sleep',     hi: 'पाद, नेत्र एवं निद्रा', ta: 'பாதங்கள், கண்கள் மற்றும் தூக்கம்', bn: 'পা, চোখ ও ঘুম' },
];

// ─── Sign Lord (Rashi 1-based) ───────────────────────────────────────────────
/** Planet IDs: 0=Sun … 8=Ketu.  Rahu/Ketu have no rulership in classical Jyotish */
export const SIGN_LORD: Record<number, number> = {
  1: 2,   // Aries → Mars
  2: 5,   // Taurus → Venus
  3: 3,   // Gemini → Mercury
  4: 1,   // Cancer → Moon
  5: 0,   // Leo → Sun
  6: 3,   // Virgo → Mercury
  7: 5,   // Libra → Venus
  8: 2,   // Scorpio → Mars
  9: 4,   // Sagittarius → Jupiter
  10: 6,  // Capricorn → Saturn
  11: 6,  // Aquarius → Saturn
  12: 4,  // Pisces → Jupiter
};

// ─── Malefic / Benefic planet IDs ────────────────────────────────────────────
export const NATURAL_MALEFICS = new Set([0, 2, 6, 7, 8]); // Sun, Mars, Saturn, Rahu, Ketu
export const NATURAL_BENEFICS = new Set([1, 3, 4, 5]);      // Moon, Mercury, Jupiter, Venus

// ─── Disease Pattern Definitions ─────────────────────────────────────────────
export interface DiseasePatternDef {
  id: string;
  name: string;
  description: string;
  /** Return true if the pattern is present in the given kundali context */
  detect: (ctx: DiseasePatternCtx) => boolean;
}

export interface DiseasePatternCtx {
  /** Affliction score per house (0-100) */
  houseVulnerability: number[];
  /** Map from planet ID → house number */
  planetHouse: Map<number, number>;
  /** Map from planet ID → sign number */
  planetSign: Map<number, number>;
  /** Map from planet ID → isCombust */
  planetCombust: Map<number, boolean>;
  /** Map from planet ID → isDebilitated */
  planetDebilitated: Map<number, boolean>;
  /** Map from planet ID → isRetrograde */
  planetRetrograde: Map<number, boolean>;
  /** Lagna sign (1-12) */
  lagnaSign: number;
}

/** Classical Jyotish disease signature patterns */
export const DISEASE_PATTERNS: DiseasePatternDef[] = [
  {
    id: 'cardiac_risk',
    name: 'Cardiac Risk Pattern',
    description: 'Mars and Saturn afflicting the 4th house — classical indicator of cardiac stress (BPHS Ch.24)',
    detect: (ctx) => {
      const h4score = ctx.houseVulnerability[3]; // index 3 = house 4
      const marsHouse = ctx.planetHouse.get(2);
      const saturnHouse = ctx.planetHouse.get(6);
      const marsAfflicts4 = marsHouse === 4 || marsHouse === 10; // opposition
      const saturnAfflicts4 = saturnHouse === 4 || saturnHouse === 10;
      return (marsAfflicts4 || saturnAfflicts4) && h4score > 40;
    },
  },
  {
    id: 'anxiety_mental',
    name: 'Anxiety / Mental Health Pattern',
    description: 'Rahu in 5th house with Mercury afflicted — mental unrest, anxiety (Sarvartha Chintamani)',
    detect: (ctx) => {
      const rahuHouse = ctx.planetHouse.get(7);
      const mercuryDebil = ctx.planetDebilitated.get(3) ?? false;
      const mercuryCombust = ctx.planetCombust.get(3) ?? false;
      return rahuHouse === 5 && (mercuryDebil || mercuryCombust);
    },
  },
  {
    id: 'chronic_digestive',
    name: 'Chronic Digestive Pattern',
    description: 'Saturn in 6th or 6th lord debilitated — chronic digestive / intestinal weakness',
    detect: (ctx) => {
      const saturnHouse = ctx.planetHouse.get(6);
      const sixthLordSign = ((ctx.lagnaSign - 1 + 5) % 12) + 1; // lagna + 5 wraps to 6th house sign
      const sixthLordId = SIGN_LORD[sixthLordSign];
      const sixthLordDebil = ctx.planetDebilitated.get(sixthLordId) ?? false;
      return saturnHouse === 6 || sixthLordDebil;
    },
  },
  {
    id: 'urogenital',
    name: 'Urogenital / Reproductive Pattern',
    description: 'Venus afflicted and 7th house vulnerable — urogenital concerns (classical Jyotish)',
    detect: (ctx) => {
      const venusCombust = ctx.planetCombust.get(5) ?? false;
      const venusDebil = ctx.planetDebilitated.get(5) ?? false;
      const h7score = ctx.houseVulnerability[6]; // index 6 = house 7
      return (venusCombust || venusDebil) && h7score > 35;
    },
  },
  {
    id: 'chronic_hidden',
    name: 'Chronic / Hidden Disease Pattern',
    description: '8th house heavily afflicted — tendency toward chronic, difficult-to-diagnose conditions',
    detect: (ctx) => {
      const h8score = ctx.houseVulnerability[7]; // index 7 = house 8
      return h8score > 55;
    },
  },
  {
    id: 'nervous_system',
    name: 'Nervous System / Vata Pattern',
    description: 'Rahu or Saturn in lagna afflicting Moon — nervous system, anxiety, Vata aggravation',
    detect: (ctx) => {
      const rahuHouse = ctx.planetHouse.get(7);
      const saturnHouse = ctx.planetHouse.get(6);
      const moonDebil = ctx.planetDebilitated.get(1) ?? false;
      const moonCombust = ctx.planetCombust.get(1) ?? false;
      return (rahuHouse === 1 || saturnHouse === 1) && (moonDebil || moonCombust);
    },
  },
  {
    id: 'respiratory',
    name: 'Respiratory Pattern',
    description: 'Malefics in 3rd house or 3rd lord afflicted — lung, bronchial, arm conditions',
    detect: (ctx) => {
      const h3score = ctx.houseVulnerability[2]; // index 2 = house 3
      return h3score > 50;
    },
  },
  {
    id: 'eye_sleep',
    name: 'Eye / Sleep Pattern',
    description: '12th house afflicted with Sun or Moon weak — eye health and sleep disorders',
    detect: (ctx) => {
      const h12score = ctx.houseVulnerability[11]; // index 11 = house 12
      const sunDebil = ctx.planetDebilitated.get(0) ?? false;
      const moonDebil = ctx.planetDebilitated.get(1) ?? false;
      return h12score > 45 && (sunDebil || moonDebil);
    },
  },
];
