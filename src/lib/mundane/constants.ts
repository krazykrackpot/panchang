/**
 * Mundane Astrology Constants
 *
 * House significations differ from natal astrology — each house represents
 * national/collective themes rather than individual life areas.
 *
 * Classical basis: Raphael's Mundane Astrology, Baigent/Campion/Harvey
 * "Mundane Astrology" (1984), H.S. Green "Mundane Astrology" (1911).
 */

export interface MundaneHouseInfo {
  house: number;
  domain: string;
  keywords: string[];
  significations: {
    en: string;
    hi: string;
    ta: string;
    bn: string;
  };
}

export const MUNDANE_HOUSES: MundaneHouseInfo[] = [
  {
    house: 1,
    domain: 'national',
    keywords: ['general condition', 'national identity', 'people', 'vitality'],
    significations: {
      en: "Nation's general condition, people's health and vitality, national identity and character",
      hi: 'राष्ट्र की सामान्य दशा, जनता का स्वास्थ्य, राष्ट्रीय पहचान और चरित्र',
      ta: 'தேசத்தின் பொது நிலை, மக்கள் ஆரோக்கியம், தேசிய அடையாளம்',
      bn: 'জাতির সাধারণ অবস্থা, জনগণের স্বাস্থ্য, জাতীয় পরিচয়',
    },
  },
  {
    house: 2,
    domain: 'economy',
    keywords: ['wealth', 'treasury', 'GDP', 'currency', 'national wealth'],
    significations: {
      en: 'National wealth, treasury, GDP, banking system, currency strength, government finances',
      hi: 'राष्ट्रीय सम्पत्ति, कोषागार, जीडीपी, बैंकिंग प्रणाली, मुद्रा शक्ति',
      ta: 'தேசிய செல்வம், கஜானா, மொ.உ.உ, வங்கி அமைப்பு, நாணய வலிமை',
      bn: 'জাতীয় সম্পদ, রাজকোষ, জিডিপি, ব্যাংকিং ব্যবস্থা, মুদ্রার শক্তি',
    },
  },
  {
    house: 3,
    domain: 'communications',
    keywords: ['media', 'transport', 'communications', 'neighbours', 'technology'],
    significations: {
      en: 'Communications, transport infrastructure, media, press, neighbouring countries, technology sector',
      hi: 'संचार, परिवहन अवसंरचना, मीडिया, प्रेस, पड़ोसी देश, प्रौद्योगिकी क्षेत्र',
      ta: 'தகவல்தொடர்பு, போக்குவரத்து, ஊடகம், அச்சு, அண்டை நாடுகள்',
      bn: 'যোগাযোগ, পরিবহন, মিডিয়া, সংবাদমাধ্যম, প্রতিবেশী দেশ',
    },
  },
  {
    house: 4,
    domain: 'agriculture',
    keywords: ['land', 'agriculture', 'opposition', 'housing', 'natural resources'],
    significations: {
      en: 'Agriculture, land, housing, natural resources, opposition party, end of matters, public sentiment',
      hi: 'कृषि, भूमि, आवास, प्राकृतिक संसाधन, विपक्षी दल, जनभावना',
      ta: 'விவசாயம், நிலம், வீட்டுவசதி, இயற்கை வளங்கள், எதிர்க்கட்சி',
      bn: 'কৃষি, ভূমি, আবাসন, প্রাকৃতিক সম্পদ, বিরোধী দল, জনমত',
    },
  },
  {
    house: 5,
    domain: 'entertainment',
    keywords: ['speculation', 'sports', 'entertainment', 'birth rate', 'youth'],
    significations: {
      en: 'Speculation markets, stock exchange, sports, entertainment industry, birth rate, youth, diplomatic envoys',
      hi: 'सट्टा बाजार, शेयर बाजार, खेल, मनोरंजन उद्योग, जन्म दर, युवा',
      ta: 'ஊக சந்தை, பங்குச்சந்தை, விளையாட்டு, பொழுதுபோக்கு, பிறப்பு விகிதம்',
      bn: 'ফটকা বাজার, শেয়ার বাজার, ক্রীড়া, বিনোদন, জন্মহার, যুব',
    },
  },
  {
    house: 6,
    domain: 'health',
    keywords: ['public health', 'military', 'labor', 'disease', 'armed forces'],
    significations: {
      en: 'Public health, epidemics, military forces, labor unions, working class, civil service, food supply',
      hi: 'सार्वजनिक स्वास्थ्य, महामारी, सशस्त्र बल, श्रम संघ, मजदूर वर्ग, खाद्य आपूर्ति',
      ta: 'பொது சுகாதாரம், தொற்றுநோய்கள், இராணுவம், தொழிலாளர் சங்கம்',
      bn: 'জনস্বাস্থ্য, মহামারী, সামরিক বাহিনী, শ্রমিক সংঘ, কর্মজীবী শ্রেণী',
    },
  },
  {
    house: 7,
    domain: 'foreign',
    keywords: ['foreign relations', 'treaties', 'war', 'alliances', 'open enemies'],
    significations: {
      en: 'Foreign relations, international treaties, diplomacy, war, alliances, open enemies, trade partners',
      hi: 'विदेश सम्बन्ध, अन्तर्राष्ट्रीय संधियाँ, कूटनीति, युद्ध, गठबन्धन, व्यापार साझेदार',
      ta: 'வெளியுறவு, சர்வதேச உடன்படிக்கைகள், தூதுவர்த்தம், போர், கூட்டணி',
      bn: 'বৈদেশিক সম্পর্ক, আন্তর্জাতিক চুক্তি, কূটনীতি, যুদ্ধ, জোট',
    },
  },
  {
    house: 8,
    domain: 'crisis',
    keywords: ['death rate', 'taxes', 'natural disasters', 'debt', 'transformation'],
    significations: {
      en: 'Death rate, national debt, taxation, natural disasters, hidden crises, national transformation, foreign debt',
      hi: 'मृत्यु दर, राष्ट्रीय ऋण, कराधान, प्राकृतिक आपदाएँ, छिपे संकट, राष्ट्रीय रूपान्तरण',
      ta: 'மரண விகிதம், தேசிய கடன், வரிவிதிப்பு, இயற்கை பேரிடர்கள்',
      bn: 'মৃত্যুহার, জাতীয় ঋণ, করারোপণ, প্রাকৃতিক দুর্যোগ, লুক্কায়িত সংকট',
    },
  },
  {
    house: 9,
    domain: 'judiciary',
    keywords: ['judiciary', 'religion', 'education', 'higher learning', 'long travel'],
    significations: {
      en: 'Judiciary, legal system, religion, higher education, foreign trade, international commerce, philosophy',
      hi: 'न्यायपालिका, कानूनी व्यवस्था, धर्म, उच्च शिक्षा, विदेश व्यापार, दर्शन',
      ta: 'நீதித்துறை, சட்ட அமைப்பு, மதம், உயர்கல்வி, வெளிநாட்டு வர்த்தகம்',
      bn: 'বিচার বিভাগ, আইনি ব্যবস্থা, ধর্ম, উচ্চশিক্ষা, বৈদেশিক বাণিজ্য',
    },
  },
  {
    house: 10,
    domain: 'government',
    keywords: ['government', 'ruling party', 'PM', 'President', 'national prestige'],
    significations: {
      en: 'Government, ruling party, Prime Minister / President, national prestige, international standing, authority',
      hi: 'सरकार, सत्तारूढ़ दल, प्रधानमन्त्री/राष्ट्रपति, राष्ट्रीय प्रतिष्ठा, अन्तर्राष्ट्रीय स्थिति',
      ta: 'அரசாங்கம், ஆளும் கட்சி, பிரதமர்/குடியரசுத் தலைவர், தேசிய கௌரவம்',
      bn: 'সরকার, ক্ষমতাসীন দল, প্রধানমন্ত্রী/রাষ্ট্রপতি, জাতীয় মর্যাদা',
    },
  },
  {
    house: 11,
    domain: 'parliament',
    keywords: ['parliament', 'legislature', 'allies', 'national goals', 'social reform'],
    significations: {
      en: 'Parliament, legislature, allies, international alliances, national income, social reform movements',
      hi: 'संसद, विधायिका, मित्र देश, अन्तर्राष्ट्रीय गठबन्धन, राष्ट्रीय आय, सामाजिक सुधार',
      ta: 'நாடாளுமன்றம், சட்டமன்றம், நட்பு நாடுகள், சர்வதேச கூட்டணி',
      bn: 'সংসদ, আইনসভা, মিত্র দেশ, আন্তর্জাতিক জোট, জাতীয় আয়',
    },
  },
  {
    house: 12,
    domain: 'hidden',
    keywords: ['espionage', 'hospitals', 'prisons', 'foreign expenditure', 'hidden enemies'],
    significations: {
      en: 'Espionage, secret societies, hospitals, prisons, hidden enemies, foreign expenditure, exile, refugees',
      hi: 'जासूसी, गुप्त संगठन, अस्पताल, कारागार, छिपे शत्रु, विदेश व्यय, निर्वासन, शरणार्थी',
      ta: 'உளவு, இரகசிய சங்கங்கள், மருத்துவமனை, சிறை, மறைவான எதிரிகள்',
      bn: 'গুপ্তচরবৃত্তি, গোপন সংস্থা, হাসপাতাল, কারাগার, গোপন শত্রু',
    },
  },
];

// Domain → display name (4 locales)
export const DOMAIN_LABELS: Record<string, { en: string; hi: string; ta: string; bn: string }> = {
  national:     { en: 'National Condition', hi: 'राष्ट्रीय दशा',          ta: 'தேசிய நிலை',        bn: 'জাতীয় অবস্থা' },
  economy:      { en: 'Economy',            hi: 'अर्थव्यवस्था',           ta: 'பொருளாதாரம்',       bn: 'অর্থনীতি' },
  communications: { en: 'Communications',  hi: 'संचार',                   ta: 'தகவல்தொடர்பு',      bn: 'যোগাযোগ' },
  agriculture:  { en: 'Agriculture & Land', hi: 'कृषि एवं भूमि',          ta: 'விவசாயம் மற்றும் நிலம்', bn: 'কৃষি ও ভূমি' },
  entertainment: { en: 'Speculation & Culture', hi: 'सट्टा एवं संस्कृति', ta: 'ஊகம் மற்றும் கலாச்சாரம்', bn: 'ফটকা ও সংস্কৃতি' },
  health:       { en: 'Public Health & Military', hi: 'सार्वजनिक स्वास्थ्य', ta: 'பொது சுகாதாரம்', bn: 'জনস্বাস্থ্য ও সামরিক' },
  foreign:      { en: 'Foreign Relations',  hi: 'विदेश सम्बन्ध',          ta: 'வெளியுறவு',         bn: 'বৈদেশিক সম্পর্ক' },
  crisis:       { en: 'Crises & Taxation',  hi: 'संकट एवं कर',            ta: 'நெருக்கடி மற்றும் வரி', bn: 'সংকট ও করারোপণ' },
  judiciary:    { en: 'Judiciary & Religion', hi: 'न्यायपालिका एवं धर्म', ta: 'நீதித்துறை மற்றும் மதம்', bn: 'বিচার বিভাগ ও ধর্ম' },
  government:   { en: 'Government & Leadership', hi: 'सरकार एवं नेतृत्व', ta: 'அரசாங்கம் மற்றும் தலைமை', bn: 'সরকার ও নেতৃত্ব' },
  parliament:   { en: 'Parliament & Allies', hi: 'संसद एवं मित्र',        ta: 'நாடாளுமன்றம் மற்றும் நட்பு நாடுகள்', bn: 'সংসদ ও মিত্র' },
  hidden:       { en: 'Hidden Affairs',     hi: 'गुप्त मामले',            ta: 'இரகசிய விவகாரங்கள்', bn: 'গোপন বিষয়' },
};

// Planet IDs for transit scoring
// 0=Sun,1=Moon,2=Mars,3=Mercury,4=Jupiter,5=Venus,6=Saturn,7=Rahu,8=Ketu
export const TRANSIT_PLANET_NAMES: Record<number, { en: string; hi: string; ta: string; bn: string }> = {
  0: { en: 'Sun',     hi: 'सूर्य',        ta: 'சூரியன்',   bn: 'সূর্য' },
  1: { en: 'Moon',    hi: 'चन्द्र',       ta: 'சந்திரன்',  bn: 'চন্দ্র' },
  2: { en: 'Mars',    hi: 'मंगल',         ta: 'செவ்வாய்',  bn: 'মঙ্গল' },
  3: { en: 'Mercury', hi: 'बुध',          ta: 'புதன்',     bn: 'বুধ' },
  4: { en: 'Jupiter', hi: 'बृहस्पति',    ta: 'குரு',      bn: 'বৃহস্পতি' },
  5: { en: 'Venus',   hi: 'शुक्र',        ta: 'சுக்கிரன்', bn: 'சுக்கிரன்' },
  6: { en: 'Saturn',  hi: 'शनि',          ta: 'சனி',       bn: 'শনি' },
  7: { en: 'Rahu',    hi: 'राहु',         ta: 'ராகு',      bn: 'রাহু' },
  8: { en: 'Ketu',    hi: 'केतु',         ta: 'கேது',      bn: 'কেতু' },
};

// Planet nature for mundane transit scoring
// benefic = positive influence, malefic = negative, neutral = context-dependent
export const PLANET_MUNDANE_NATURE: Record<number, 'benefic' | 'malefic' | 'neutral'> = {
  0: 'neutral',   // Sun — authority; good for govt (10th) but harsh elsewhere
  1: 'benefic',   // Moon — public welfare
  2: 'malefic',   // Mars — conflict, war
  3: 'neutral',   // Mercury — commerce, media
  4: 'benefic',   // Jupiter — growth, prosperity
  5: 'benefic',   // Venus — culture, peace
  6: 'malefic',   // Saturn — hardship, delay, but good in 3/6/11
  7: 'malefic',   // Rahu — sudden disruption, foreign influence
  8: 'malefic',   // Ketu — separatism, hidden crises
};

// Houses where Saturn is actually beneficial in mundane astrology
export const SATURN_BENEFICIAL_HOUSES = [3, 6, 11] as const;

// Sign element groups (1-based rashi IDs)
export const FIRE_SIGNS = [1, 5, 9] as const;
export const EARTH_SIGNS = [2, 6, 10] as const;
export const AIR_SIGNS = [3, 7, 11] as const;
export const WATER_SIGNS = [4, 8, 12] as const;

export type ConjunctionElement = 'fire' | 'earth' | 'air' | 'water';

export function getSignElement(sign: number): ConjunctionElement {
  if ((FIRE_SIGNS as readonly number[]).includes(sign)) return 'fire';
  if ((EARTH_SIGNS as readonly number[]).includes(sign)) return 'earth';
  if ((AIR_SIGNS as readonly number[]).includes(sign)) return 'air';
  return 'water';
}

export const SIGN_NAMES_EN: Record<number, string> = {
  1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer',
  5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Scorpio',
  9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces',
};
