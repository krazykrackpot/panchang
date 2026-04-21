/**
 * Nakshatra Activity Affinities
 *
 * Classical Muhurta Chintamani / BPHS-based activity recommendations
 * for each of the 27 nakshatras. Used by the Nakshatra Activity Guide
 * on the panchang page.
 */

export interface NakshatraActivity {
  nakshatraId: number; // 1-27
  goodFor: { en: string; hi: string }[];
  avoidFor: { en: string; hi: string }[];
  theme: { en: string; hi: string };
}

export const NAKSHATRA_ACTIVITIES: NakshatraActivity[] = [
  {
    nakshatraId: 1, // Ashwini
    goodFor: [
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Medicine & Healing', hi: 'चिकित्सा' },
      { en: 'Buying Vehicles', hi: 'वाहन खरीद' },
      { en: 'Starting New Ventures', hi: 'नया कार्य आरम्भ' },
    ],
    avoidFor: [
      { en: 'Marriage Ceremonies', hi: 'विवाह संस्कार' },
      { en: 'Binding Commitments', hi: 'बन्धनकारी प्रतिज्ञा' },
    ],
    theme: { en: 'Swift action and new beginnings', hi: 'तीव्र कार्य और नवारम्भ' },
  },
  {
    nakshatraId: 2, // Bharani
    goodFor: [
      { en: 'Agriculture', hi: 'कृषि' },
      { en: 'Tough Tasks', hi: 'कठिन कार्य' },
      { en: 'Discipline & Penance', hi: 'अनुशासन एवं तप' },
    ],
    avoidFor: [
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Auspicious Ceremonies', hi: 'शुभ संस्कार' },
      { en: 'New Ventures', hi: 'नया कार्य' },
    ],
    theme: { en: 'Restraint and transformation', hi: 'संयम और परिवर्तन' },
  },
  {
    nakshatraId: 3, // Krittika
    goodFor: [
      { en: 'Fire Rituals', hi: 'अग्नि कर्म' },
      { en: 'Cooking', hi: 'पाक कार्य' },
      { en: 'Sharp / Cutting Work', hi: 'शस्त्र / काटने का कार्य' },
      { en: 'Purification', hi: 'शुद्धि कर्म' },
    ],
    avoidFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Gentle Tasks', hi: 'कोमल कार्य' },
    ],
    theme: { en: 'Sharp focus and purification', hi: 'तीक्ष्ण ध्यान और शुद्धि' },
  },
  {
    nakshatraId: 4, // Rohini
    goodFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Agriculture', hi: 'कृषि' },
      { en: 'Buying Property', hi: 'सम्पत्ति खरीद' },
      { en: 'Beauty & Adornment', hi: 'श्रृंगार' },
    ],
    avoidFor: [
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Risky Ventures', hi: 'जोखिम कार्य' },
    ],
    theme: { en: 'Growth, beauty and abundance', hi: 'वृद्धि, सौन्दर्य और समृद्धि' },
  },
  {
    nakshatraId: 5, // Mrigashira
    goodFor: [
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Making Friends', hi: 'मित्रता' },
      { en: 'Buying Clothes', hi: 'वस्त्र खरीद' },
      { en: 'Learning', hi: 'अध्ययन' },
    ],
    avoidFor: [
      { en: 'Aggressive Actions', hi: 'आक्रामक कार्य' },
      { en: 'Confrontation', hi: 'टकराव' },
    ],
    theme: { en: 'Exploration and curiosity', hi: 'अन्वेषण और जिज्ञासा' },
  },
  {
    nakshatraId: 6, // Ardra
    goodFor: [
      { en: 'Destructive Work', hi: 'विध्वंसक कार्य' },
      { en: 'Research', hi: 'अनुसन्धान' },
      { en: 'Demolition & Clearing', hi: 'तोड़-फोड़ और सफाई' },
    ],
    avoidFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'New Ventures', hi: 'नया कार्य' },
      { en: 'Auspicious Acts', hi: 'शुभ कार्य' },
    ],
    theme: { en: 'Transformation through intensity', hi: 'तीव्रता से परिवर्तन' },
  },
  {
    nakshatraId: 7, // Punarvasu
    goodFor: [
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Starting Ventures', hi: 'नया कार्य आरम्भ' },
      { en: 'Education', hi: 'शिक्षा' },
      { en: 'Returning Home', hi: 'घर वापसी' },
    ],
    avoidFor: [],
    theme: { en: 'Return and renewal', hi: 'वापसी और नवीनीकरण' },
  },
  {
    nakshatraId: 8, // Pushya
    goodFor: [
      { en: 'All Auspicious Activities', hi: 'सभी शुभ कार्य' },
      { en: 'Business', hi: 'व्यापार' },
      { en: 'Spiritual Practice', hi: 'आध्यात्मिक साधना' },
      { en: 'Property & Investment', hi: 'सम्पत्ति एवं निवेश' },
    ],
    avoidFor: [],
    theme: { en: 'Nourishment and prosperity', hi: 'पोषण और समृद्धि' },
  },
  {
    nakshatraId: 9, // Ashlesha
    goodFor: [
      { en: 'Occult & Tantra', hi: 'तन्त्र विद्या' },
      { en: 'Research', hi: 'अनुसन्धान' },
      { en: 'Strategy & Planning', hi: 'रणनीति एवं योजना' },
    ],
    avoidFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Lending Money', hi: 'धन उधार' },
    ],
    theme: { en: 'Hidden power and strategy', hi: 'गुप्त शक्ति और रणनीति' },
  },
  {
    nakshatraId: 10, // Magha
    goodFor: [
      { en: 'Government Work', hi: 'सरकारी कार्य' },
      { en: 'Ancestral Rites', hi: 'पितृ कार्य' },
      { en: 'Ceremonies & Honours', hi: 'समारोह एवं सम्मान' },
    ],
    avoidFor: [
      { en: 'Routine Work', hi: 'सामान्य कार्य' },
      { en: 'Common Tasks', hi: 'दैनिक साधारण कार्य' },
    ],
    theme: { en: 'Authority and ancestral blessings', hi: 'अधिकार और पितृ आशीर्वाद' },
  },
  {
    nakshatraId: 11, // Purva Phalguni
    goodFor: [
      { en: 'Marriage & Romance', hi: 'विवाह एवं प्रेम' },
      { en: 'Rest & Recreation', hi: 'विश्राम एवं मनोरंजन' },
      { en: 'Arts & Music', hi: 'कला एवं संगीत' },
    ],
    avoidFor: [
      { en: 'Harsh Actions', hi: 'कठोर कार्य' },
      { en: 'Confrontation', hi: 'टकराव' },
    ],
    theme: { en: 'Joy, romance and creativity', hi: 'आनन्द, प्रेम और सृजनशीलता' },
  },
  {
    nakshatraId: 12, // Uttara Phalguni
    goodFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Partnerships', hi: 'साझेदारी' },
      { en: 'Agreements & Contracts', hi: 'अनुबन्ध एवं समझौता' },
    ],
    avoidFor: [
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Risky Ventures', hi: 'जोखिम कार्य' },
    ],
    theme: { en: 'Commitment and generosity', hi: 'प्रतिबद्धता और उदारता' },
  },
  {
    nakshatraId: 13, // Hasta
    goodFor: [
      { en: 'Crafts & Handiwork', hi: 'हस्तकला' },
      { en: 'Trade & Commerce', hi: 'व्यापार' },
      { en: 'Learning & Skill Work', hi: 'अध्ययन एवं कौशल कार्य' },
      { en: 'Healing', hi: 'चिकित्सा' },
    ],
    avoidFor: [],
    theme: { en: 'Skill and dexterity', hi: 'कौशल और निपुणता' },
  },
  {
    nakshatraId: 14, // Chitra
    goodFor: [
      { en: 'Wearing New Clothes', hi: 'नये वस्त्र' },
      { en: 'Jewelry & Ornaments', hi: 'आभूषण' },
      { en: 'Art & Design', hi: 'कला एवं डिजाइन' },
    ],
    avoidFor: [
      { en: 'Marriage (some traditions)', hi: 'विवाह (कुछ परम्पराओं में)' },
      { en: 'Travel', hi: 'यात्रा' },
    ],
    theme: { en: 'Beauty and artistic vision', hi: 'सौन्दर्य और कलात्मक दृष्टि' },
  },
  {
    nakshatraId: 15, // Swati
    goodFor: [
      { en: 'Trade & Business', hi: 'व्यापार' },
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Buying Vehicles', hi: 'वाहन खरीद' },
    ],
    avoidFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Building Construction', hi: 'भवन निर्माण' },
    ],
    theme: { en: 'Independence and movement', hi: 'स्वतन्त्रता और गति' },
  },
  {
    nakshatraId: 16, // Vishakha
    goodFor: [
      { en: 'Worship & Devotion', hi: 'पूजा एवं भक्ति' },
      { en: 'Goal-oriented Tasks', hi: 'लक्ष्य-केन्द्रित कार्य' },
      { en: 'Determination', hi: 'संकल्प' },
    ],
    avoidFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Travel', hi: 'यात्रा' },
    ],
    theme: { en: 'Focused determination', hi: 'एकाग्र संकल्प' },
  },
  {
    nakshatraId: 17, // Anuradha
    goodFor: [
      { en: 'Friendship & Networking', hi: 'मित्रता एवं सम्पर्क' },
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Starting Ventures', hi: 'नया कार्य आरम्भ' },
    ],
    avoidFor: [],
    theme: { en: 'Devotion and cooperation', hi: 'भक्ति और सहयोग' },
  },
  {
    nakshatraId: 18, // Jyeshtha
    goodFor: [
      { en: 'Authority Matters', hi: 'अधिकार सम्बन्धी कार्य' },
      { en: 'Competition', hi: 'प्रतियोगिता' },
      { en: 'Overcoming Enemies', hi: 'शत्रु निवारण' },
    ],
    avoidFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Gentle Tasks', hi: 'कोमल कार्य' },
    ],
    theme: { en: 'Seniority and protection', hi: 'ज्येष्ठता और रक्षा' },
  },
  {
    nakshatraId: 19, // Mula
    goodFor: [
      { en: 'Medicine & Herbs', hi: 'औषधि एवं जड़ी-बूटी' },
      { en: 'Research & Investigation', hi: 'अनुसन्धान एवं जाँच' },
      { en: 'Uprooting Old Patterns', hi: 'पुरानी आदतें त्यागना' },
    ],
    avoidFor: [
      { en: 'New Ventures', hi: 'नया कार्य' },
      { en: 'Auspicious Beginnings', hi: 'शुभारम्भ' },
      { en: 'Buying Property', hi: 'सम्पत्ति खरीद' },
    ],
    theme: { en: 'Getting to the root', hi: 'मूल तक पहुँचना' },
  },
  {
    nakshatraId: 20, // Purva Ashadha
    goodFor: [
      { en: 'Water-related Activities', hi: 'जल सम्बन्धी कार्य' },
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Declarations & Speeches', hi: 'घोषणा एवं भाषण' },
    ],
    avoidFor: [
      { en: 'Marriage (some traditions)', hi: 'विवाह (कुछ परम्पराओं में)' },
      { en: 'Permanent Actions', hi: 'स्थायी कार्य' },
    ],
    theme: { en: 'Invincible conviction', hi: 'अजेय विश्वास' },
  },
  {
    nakshatraId: 21, // Uttara Ashadha
    goodFor: [
      { en: 'Permanent Actions', hi: 'स्थायी कार्य' },
      { en: 'Government Work', hi: 'सरकारी कार्य' },
      { en: 'Commitments & Oaths', hi: 'प्रतिज्ञा एवं शपथ' },
    ],
    avoidFor: [],
    theme: { en: 'Final victory and commitment', hi: 'अन्तिम विजय और प्रतिबद्धता' },
  },
  {
    nakshatraId: 22, // Shravana
    goodFor: [
      { en: 'Learning & Education', hi: 'अध्ययन एवं शिक्षा' },
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Starting Studies', hi: 'विद्यारम्भ' },
      { en: 'Listening & Teaching', hi: 'श्रवण एवं अध्यापन' },
    ],
    avoidFor: [
      { en: 'Aggressive Acts', hi: 'आक्रामक कार्य' },
      { en: 'Confrontation', hi: 'टकराव' },
    ],
    theme: { en: 'Listening and learning', hi: 'श्रवण और अध्ययन' },
  },
  {
    nakshatraId: 23, // Dhanishtha
    goodFor: [
      { en: 'Property Matters', hi: 'सम्पत्ति कार्य' },
      { en: 'Music & Performance', hi: 'संगीत एवं प्रदर्शन' },
      { en: 'Charity & Donation', hi: 'दान एवं पुण्य' },
    ],
    avoidFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Delicate Tasks', hi: 'नाजुक कार्य' },
    ],
    theme: { en: 'Wealth and rhythm', hi: 'धन और लय' },
  },
  {
    nakshatraId: 24, // Shatabhisha
    goodFor: [
      { en: 'Medicine & Healing', hi: 'चिकित्सा' },
      { en: 'Technology', hi: 'प्रौद्योगिकी' },
      { en: 'Research', hi: 'अनुसन्धान' },
    ],
    avoidFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Ceremonies', hi: 'संस्कार' },
      { en: 'Auspicious Beginnings', hi: 'शुभारम्भ' },
    ],
    theme: { en: 'Healing and hidden knowledge', hi: 'चिकित्सा और गुप्त ज्ञान' },
  },
  {
    nakshatraId: 25, // Purva Bhadrapada
    goodFor: [
      { en: 'Fire Rituals', hi: 'अग्नि कर्म' },
      { en: 'Agriculture', hi: 'कृषि' },
      { en: 'Intense Effort', hi: 'तीव्र प्रयास' },
    ],
    avoidFor: [
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Marriage', hi: 'विवाह' },
    ],
    theme: { en: 'Burning zeal and transformation', hi: 'प्रज्वलित उत्साह और परिवर्तन' },
  },
  {
    nakshatraId: 26, // Uttara Bhadrapada
    goodFor: [
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Spiritual Practices', hi: 'आध्यात्मिक साधना' },
      { en: 'Charity & Donation', hi: 'दान एवं पुण्य' },
    ],
    avoidFor: [
      { en: 'Competitive Acts', hi: 'प्रतिस्पर्धात्मक कार्य' },
      { en: 'Aggression', hi: 'आक्रामकता' },
    ],
    theme: { en: 'Wisdom and deep rest', hi: 'ज्ञान और गहन विश्राम' },
  },
  {
    nakshatraId: 27, // Revati
    goodFor: [
      { en: 'Travel', hi: 'यात्रा' },
      { en: 'Buying Vehicles', hi: 'वाहन खरीद' },
      { en: 'Marriage', hi: 'विवाह' },
      { en: 'Completion of Tasks', hi: 'कार्य पूर्णता' },
    ],
    avoidFor: [
      { en: 'Aggressive Acts', hi: 'आक्रामक कार्य' },
      { en: 'Destruction', hi: 'विध्वंस कार्य' },
    ],
    theme: { en: 'Safe journeys and completion', hi: 'सुरक्षित यात्रा और पूर्णता' },
  },
];

/**
 * Get activity data for a given nakshatra by ID (1-27).
 * Returns undefined if ID is out of range.
 */
export function getNakshatraActivity(nakshatraId: number): NakshatraActivity | undefined {
  return NAKSHATRA_ACTIVITIES.find((a) => a.nakshatraId === nakshatraId);
}
