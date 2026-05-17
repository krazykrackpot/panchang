export const YOGA_PLAIN_NAMES: Record<string, { en: string; hi: string }> = {
  // 5 Pancha Mahapurusha Yogas
  'hamsa': { en: 'Noble Character & Spiritual Wisdom', hi: 'उत्तम चरित्र और आध्यात्मिक ज्ञान' },
  'malavya': { en: 'Beauty, Luxury & Romantic Fulfilment', hi: 'सौन्दर्य, विलासिता और प्रेम पूर्ति' },
  'ruchaka': { en: 'Physical Courage & Leadership', hi: 'शारीरिक साहस और नेतृत्व' },
  'bhadra': { en: 'Eloquence & Analytical Brilliance', hi: 'वाक्पटुता और विश्लेषणात्मक प्रतिभा' },
  'shasha': { en: 'Authority & Enduring Power', hi: 'अधिकार और स्थायी शक्ति' },

  // Chandra (Moon) Yogas
  'gajakesari': { en: 'Wisdom & Public Recognition', hi: 'ज्ञान और सार्वजनिक मान्यता' },
  'sunapha': { en: 'Self-Made Prosperity', hi: 'स्व-निर्मित समृद्धि' },
  'anapha': { en: 'Grace, Reputation & Inner Contentment', hi: 'शालीनता, प्रतिष्ठा और आन्तरिक सन्तोष' },
  'durudhura': { en: 'Wealth from Many Sources', hi: 'अनेक स्रोतों से धन' },
  'kemadruma': { en: 'Solitary Strength & Self-Reliance', hi: 'एकाकी शक्ति और आत्मनिर्भरता' },
  'chandradhi': { en: 'Charisma & Popular Appeal', hi: 'आकर्षण और लोकप्रिय अपील' },

  // Budha (Mercury) Yogas
  'budhaditya': { en: 'Sharp Intellect & Communication', hi: 'तीव्र बुद्धि और संवाद कौशल' },

  // Guru (Jupiter) Yogas
  'saraswati': { en: 'Eloquence, Arts & Scholarly Gifts', hi: 'वाक्पटुता, कला और विद्वत्ता के उपहार' },

  // Mangala (Mars) Yogas
  'chandra-mangala': { en: 'Wealth Through Action', hi: 'कर्म से धन' },
  'kahala': { en: 'Boldness & Command Over Others', hi: 'साहस और दूसरों पर नियंत्रण' },

  // Shukra (Venus) Yogas
  'amala': { en: 'Spotless Reputation & Lasting Fame', hi: 'निष्कलंक प्रतिष्ठा और स्थायी कीर्ति' },

  // Dhana (Wealth) Yogas
  'vasumati': { en: 'Wealth from Service & Diligence', hi: 'सेवा और परिश्रम से धन' },
  'lakshmi': { en: 'Exceptional Wealth & Auspicious Fortune', hi: 'असाधारण धन और शुभ भाग्य' },

  // Raja (Royal) Yogas
  'raja': { en: 'Power, Influence & High Achievement', hi: 'शक्ति, प्रभाव और उच्च उपलब्धि' },
  'mahabhagya': { en: 'Exceptional Fortune & Outstanding Destiny', hi: 'असाधारण भाग्य और उत्कृष्ट नियति' },
  'parvata': { en: 'Prosperity & Charitable Nature', hi: 'समृद्धि और दानशील स्वभाव' },
  'neecha-bhanga-raja': { en: 'Triumph Over Adversity', hi: 'विपरीत परिस्थितियों पर विजय' },

  // Viparita Raja Yogas (apparent reversals that strengthen)
  'vimala': { en: 'Hidden Depths & Self-Sufficient Spirituality', hi: 'छिपी गहराइयाँ और आत्मनिर्भर आध्यात्मिकता' },
  'harsha': { en: 'Joy Through Challenges & Resilient Health', hi: 'चुनौतियों से आनन्द और लचीला स्वास्थ्य' },
  'sarala': { en: 'Straightforwardness & Fearless Living', hi: 'सरलता और निडर जीवन' },

  // Panchanga-based Yogas (day-specific, included for completeness)
  'siddha': { en: 'Success & Auspicious Outcomes', hi: 'सफलता और शुभ परिणाम' },
  'amrita': { en: 'Nectarine Blessings & Long-Lasting Gains', hi: 'अमृत आशीर्वाद और दीर्घकालिक लाभ' },
  'brahma': { en: 'Divine Grace & Sacred Timing', hi: 'दैवीय कृपा और पवित्र समय' },
  'indra': { en: 'Royal Favour & Worldly Triumph', hi: 'राजकीय कृपा और सांसारिक विजय' },
};

/** Get plain name for a yoga. Falls back to first sentence of description. */
export function getYogaPlainName(yogaId: string, descriptionEn: string, locale: string): string {
  const plain = YOGA_PLAIN_NAMES[yogaId];
  if (plain) return locale === 'hi' ? plain.hi : plain.en;
  return descriptionEn.split('.')[0] + '.';
}
