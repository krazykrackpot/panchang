export interface TithiInfo {
  number: number;       // 1-30
  name: string;
  paksha: 'Shukla' | 'Krishna';
  deity: string;
  description: string;
}

export interface NakshatraInfo {
  number: number;       // 1-27
  name: string;
  deity: string;
  ruler: string;        // Ruling planet
  symbol: string;
  pada: number;         // 1-4
  description: string;
}

export interface YogaInfo {
  number: number;       // 1-27
  name: string;
  meaning: string;
  nature: 'Auspicious' | 'Inauspicious' | 'Mixed';
}

export interface KaranaInfo {
  number: number;       // 1-11
  name: string;
  nature: 'Movable' | 'Fixed' | 'Unstable';
}

export interface RahuKalamInfo {
  start: Date;
  end: Date;
  label: string;
}

export interface PanchangData {
  date: Date;
  tithi: TithiInfo;
  nakshatra: NakshatraInfo;
  yoga: YogaInfo;
  karana: KaranaInfo;
  sunrise: Date;
  sunset: Date;
  moonrise?: Date;
  rahuKalam: RahuKalamInfo;
  yamagandam: RahuKalamInfo;
  gulikaKalam: RahuKalamInfo;
  sunLongitude: number;
  moonLongitude: number;
  moonPhase: number;
  ayanamsa: number;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    timezone: number;
  };
}

export const TITHI_NAMES: string[] = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

export const TITHI_DEITIES: string[] = [
  'Agni', 'Brahma', 'Gauri', 'Ganesh', 'Naga',
  'Kartikeya', 'Surya', 'Shiva', 'Durga', 'Dharma',
  'Vishnu', 'Hari', 'Kamadeva', 'Shiva', 'Chandra',
  'Agni', 'Brahma', 'Gauri', 'Ganesh', 'Naga',
  'Kartikeya', 'Surya', 'Shiva', 'Durga', 'Dharma',
  'Vishnu', 'Hari', 'Kamadeva', 'Shiva', 'Pitra',
];

export const NAKSHATRA_DATA: Array<{ name: string; deity: string; ruler: string; symbol: string }> = [
  { name: 'Ashwini', deity: 'Ashwini Kumaras', ruler: 'Ketu', symbol: 'Horse head' },
  { name: 'Bharani', deity: 'Yama', ruler: 'Venus', symbol: 'Yoni' },
  { name: 'Krittika', deity: 'Agni', ruler: 'Sun', symbol: 'Razor' },
  { name: 'Rohini', deity: 'Brahma', ruler: 'Moon', symbol: 'Chariot' },
  { name: 'Mrigashira', deity: 'Soma', ruler: 'Mars', symbol: 'Deer head' },
  { name: 'Ardra', deity: 'Rudra', ruler: 'Rahu', symbol: 'Teardrop' },
  { name: 'Punarvasu', deity: 'Aditi', ruler: 'Jupiter', symbol: 'Bow' },
  { name: 'Pushya', deity: 'Brihaspati', ruler: 'Saturn', symbol: 'Lotus' },
  { name: 'Ashlesha', deity: 'Naga', ruler: 'Mercury', symbol: 'Serpent' },
  { name: 'Magha', deity: 'Pitrs', ruler: 'Ketu', symbol: 'Throne' },
  { name: 'Purva Phalguni', deity: 'Bhaga', ruler: 'Venus', symbol: 'Hammock' },
  { name: 'Uttara Phalguni', deity: 'Aryaman', ruler: 'Sun', symbol: 'Bed' },
  { name: 'Hasta', deity: 'Savitar', ruler: 'Moon', symbol: 'Palm' },
  { name: 'Chitra', deity: 'Tvashtar', ruler: 'Mars', symbol: 'Pearl' },
  { name: 'Swati', deity: 'Vayu', ruler: 'Rahu', symbol: 'Coral' },
  { name: 'Vishakha', deity: 'Indra-Agni', ruler: 'Jupiter', symbol: 'Archway' },
  { name: 'Anuradha', deity: 'Mitra', ruler: 'Saturn', symbol: 'Lotus' },
  { name: 'Jyeshtha', deity: 'Indra', ruler: 'Mercury', symbol: 'Earring' },
  { name: 'Moola', deity: 'Nirriti', ruler: 'Ketu', symbol: 'Roots' },
  { name: 'Purva Ashadha', deity: 'Apas', ruler: 'Venus', symbol: 'Fan' },
  { name: 'Uttara Ashadha', deity: 'Vishvadevas', ruler: 'Sun', symbol: 'Tusk' },
  { name: 'Shravana', deity: 'Vishnu', ruler: 'Moon', symbol: 'Ear' },
  { name: 'Dhanishtha', deity: 'Vasus', ruler: 'Mars', symbol: 'Drum' },
  { name: 'Shatabhisha', deity: 'Varuna', ruler: 'Rahu', symbol: 'Circle' },
  { name: 'Purva Bhadrapada', deity: 'Aja Ekapada', ruler: 'Jupiter', symbol: 'Sword' },
  { name: 'Uttara Bhadrapada', deity: 'Ahir Budhnya', ruler: 'Saturn', symbol: 'Twins' },
  { name: 'Revati', deity: 'Pushan', ruler: 'Mercury', symbol: 'Fish' },
];

export const YOGA_DATA: Array<{ name: string; meaning: string; nature: 'Auspicious' | 'Inauspicious' | 'Mixed' }> = [
  { name: 'Vishkambha', meaning: 'Support', nature: 'Mixed' },
  { name: 'Priti', meaning: 'Love', nature: 'Auspicious' },
  { name: 'Ayushman', meaning: 'Long-lived', nature: 'Auspicious' },
  { name: 'Saubhagya', meaning: 'Good fortune', nature: 'Auspicious' },
  { name: 'Shobhana', meaning: 'Splendor', nature: 'Auspicious' },
  { name: 'Atiganda', meaning: 'Obstacles', nature: 'Inauspicious' },
  { name: 'Sukarma', meaning: 'Good deeds', nature: 'Auspicious' },
  { name: 'Dhriti', meaning: 'Steadiness', nature: 'Auspicious' },
  { name: 'Shula', meaning: 'Spear', nature: 'Inauspicious' },
  { name: 'Ganda', meaning: 'Danger', nature: 'Inauspicious' },
  { name: 'Vriddhi', meaning: 'Growth', nature: 'Auspicious' },
  { name: 'Dhruva', meaning: 'Firm', nature: 'Auspicious' },
  { name: 'Vyaghata', meaning: 'Beating', nature: 'Inauspicious' },
  { name: 'Harshana', meaning: 'Joy', nature: 'Auspicious' },
  { name: 'Vajra', meaning: 'Diamond', nature: 'Mixed' },
  { name: 'Siddhi', meaning: 'Success', nature: 'Auspicious' },
  { name: 'Vyatipata', meaning: 'Calamity', nature: 'Inauspicious' },
  { name: 'Variyan', meaning: 'Comfort', nature: 'Auspicious' },
  { name: 'Parigha', meaning: 'Obstruction', nature: 'Inauspicious' },
  { name: 'Shiva', meaning: 'Auspicious', nature: 'Auspicious' },
  { name: 'Siddha', meaning: 'Accomplished', nature: 'Auspicious' },
  { name: 'Sadhya', meaning: 'Achievable', nature: 'Auspicious' },
  { name: 'Shubha', meaning: 'Auspicious', nature: 'Auspicious' },
  { name: 'Shukla', meaning: 'Bright', nature: 'Auspicious' },
  { name: 'Brahma', meaning: 'Creator', nature: 'Auspicious' },
  { name: 'Indra', meaning: 'Chief', nature: 'Auspicious' },
  { name: 'Vaidhriti', meaning: 'Inauspicious', nature: 'Inauspicious' },
];

export const KARANA_NAMES: string[] = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti',
  'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
];

export const RASHI_NAMES: string[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const RASHI_NAMES_SANSKRIT: string[] = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
];
