/**
 * Financial Astrology constants — planet→commodity/sector mapping,
 * wealth houses, favorability tables.
 *
 * Classical basis: BPHS Ch.24-25 (Dhana Bhava), Brihat Jataka,
 * Phaladeepika. Planet-commodity associations from Muhurta Chintamani.
 */

// ─── Planet commodity / sector mappings ─────────────────────────────────────
// Planet IDs: 0=Sun,1=Moon,2=Mars,3=Mercury,4=Jupiter,5=Venus,6=Saturn,7=Rahu,8=Ketu

export interface PlanetSectors {
  commodities: string[];
  sectors: string[];
  /** Brief keyword for the hora guide */
  keyword: string;
}

export const PLANET_SECTORS: Record<number, PlanetSectors> = {
  0: {  // Sun
    commodities: ['Gold', 'Wheat', 'Saffron'],
    sectors: ['Government', 'Energy', 'Pharma', 'Public sector'],
    keyword: 'Authority & Gold',
  },
  1: {  // Moon
    commodities: ['Silver', 'Dairy', 'Water'],
    sectors: ['FMCG', 'Hospitality', 'Water utilities', 'Tourism'],
    keyword: 'Silver & Liquidity',
  },
  2: {  // Mars
    commodities: ['Copper', 'Steel', 'Land'],
    sectors: ['Real estate', 'Metals', 'Defence', 'Construction'],
    keyword: 'Real estate & Metals',
  },
  3: {  // Mercury
    commodities: ['Mixed metals', 'Textiles'],
    sectors: ['Technology', 'Media', 'Trading', 'Communications'],
    keyword: 'Tech & Trade',
  },
  4: {  // Jupiter
    commodities: ['Gold', 'Silver', 'Turmeric'],
    sectors: ['Banking', 'Finance', 'Education', 'Consulting'],
    keyword: 'Banking & Finance',
  },
  5: {  // Venus
    commodities: ['Diamonds', 'Luxury goods', 'Sugar'],
    sectors: ['Luxury', 'Entertainment', 'Automobiles', 'Beauty'],
    keyword: 'Luxury & Arts',
  },
  6: {  // Saturn
    commodities: ['Iron', 'Coal', 'Oil', 'Lead'],
    sectors: ['Agriculture', 'Mining', 'Oil & Gas', 'Infrastructure'],
    keyword: 'Infrastructure & Commodities',
  },
  7: {  // Rahu
    commodities: ['Foreign currency', 'Cryptocurrency', 'Chemicals'],
    sectors: ['Airlines', 'Forex', 'Crypto', 'IT outsourcing'],
    keyword: 'Foreign & Digital',
  },
  8: {  // Ketu
    commodities: ['Spiritual items', 'Recycled materials'],
    sectors: ['Spiritual sector', 'Recycling', 'Alternative medicine', 'Occult'],
    keyword: 'Spiritual & Niche',
  },
};

// ─── Wealth houses ───────────────────────────────────────────────────────────
export const WEALTH_HOUSES = [2, 5, 8, 9, 11] as const;
export type WealthHouseNumber = typeof WEALTH_HOUSES[number];

export const WEALTH_HOUSE_MEANINGS: Record<WealthHouseNumber, string> = {
  2:  'Savings, accumulated wealth, liquid assets',
  5:  'Speculation, investments, creative income',
  8:  'Unearned wealth, inheritance, sudden gains',
  9:  'Fortune, blessings, long-term prosperity',
  11: 'Income, gains from business, realisation of desires',
};

// ─── House → financial area (4-locale, house 2/5/8/9/11 only) ──────────────
export interface WealthHouseText {
  house: WealthHouseNumber;
  en: string;
  hi: string;
  ta: string;
  bn: string;
}

export const WEALTH_HOUSE_TEXTS: WealthHouseText[] = [
  {
    house: 2,
    en: 'Savings & Liquid Assets',
    hi: 'बचत एवं तरल सम्पत्ति',
    ta: 'சேமிப்பு மற்றும் திரவ சொத்துகள்',
    bn: 'সঞ্চয় ও তরল সম্পদ',
  },
  {
    house: 5,
    en: 'Speculation & Investments',
    hi: 'सट्टा एवं निवेश',
    ta: 'ஊகம் மற்றும் முதலீடுகள்',
    bn: 'জল্পনা ও বিনিয়োগ',
  },
  {
    house: 8,
    en: 'Inherited & Unearned Wealth',
    hi: 'पैतृक एवं अर्जित धन',
    ta: 'மரபு மற்றும் சம்பாதிக்காத செல்வம்',
    bn: 'উত্তরাধিকার ও অর্জিত সম্পদ',
  },
  {
    house: 9,
    en: 'Fortune & Long-term Prosperity',
    hi: 'भाग्य एवं दीर्घकालिक समृद्धि',
    ta: 'அதிர்ஷ்டம் மற்றும் நீண்டகால செழிப்பு',
    bn: 'ভাগ্য ও দীর্ঘমেয়াদী সমৃদ্ধি',
  },
  {
    house: 11,
    en: 'Income & Gains',
    hi: 'आय एवं लाभ',
    ta: 'வருமானம் மற்றும் ஆதாயங்கள்',
    bn: 'আয় ও লাভ',
  },
];

// ─── Hora → financial favorability ──────────────────────────────────────────
export type HoraFavorability = 'excellent' | 'good' | 'neutral' | 'avoid';

/** Planet → hora favorability for financial activities (classical Jyotish) */
export const HORA_FINANCIAL_FAVORABILITY: Record<number, HoraFavorability> = {
  0: 'good',      // Sun — government dealings, gold transactions
  1: 'good',      // Moon — liquid assets, trading, new contacts
  2: 'avoid',     // Mars — avoid new financial agreements
  3: 'excellent', // Mercury — contracts, communication, trading
  4: 'excellent', // Jupiter — banking, investments, legal finance
  5: 'good',      // Venus — luxury purchases, entertainment contracts
  6: 'neutral',   // Saturn — long-term fixed assets only
};

// ─── Planet names (by ID, for display) ──────────────────────────────────────
export const PLANET_NAMES_EN: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

// ─── Sign lord (Rashi 1-based) ────────────────────────────────────────────────
// Duplicate-free canonical — defined once here, imported by financial engines.
// Canonical BPHS source. Rahu/Ketu have no classical rulership.
export const SIGN_LORD_FINANCIAL: Record<number, number> = {
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

// ─── Planet exaltation signs (1-based) ──────────────────────────────────────
// Canonical BPHS Ch.3
export const EXALTATION_SIGN: Record<number, number> = {
  0: 1,   // Sun exalted in Aries
  1: 2,   // Moon exalted in Taurus
  2: 10,  // Mars exalted in Capricorn
  3: 6,   // Mercury exalted in Virgo
  4: 4,   // Jupiter exalted in Cancer
  5: 12,  // Venus exalted in Pisces
  6: 7,   // Saturn exalted in Libra
};
