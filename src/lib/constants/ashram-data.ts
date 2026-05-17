export interface AshramInfo {
  id: string;
  nameEn: string;
  nameHi: string;
  nameSa: string;
  ageMin: number;
  ageMax: number;
  descriptionEn: string;
  descriptionHi: string;
  focusAreas: { en: string; hi: string }[];
}

export const ASHRAMS: AshramInfo[] = [
  {
    id: 'brahmacharya',
    nameEn: 'Brahmacharya',
    nameHi: 'ब्रह्मचर्य',
    nameSa: 'ब्रह्मचर्यम्',
    ageMin: 0,
    ageMax: 25,
    descriptionEn: 'The Student — your dharma now is to learn, build discipline, and lay the foundation for everything that follows.',
    descriptionHi: 'विद्यार्थी — आपका वर्तमान धर्म सीखना, अनुशासन बनाना और आगे आने वाली हर चीज़ की नींव रखना है।',
    focusAreas: [
      { en: 'Education', hi: 'शिक्षा' },
      { en: 'Skill Building', hi: 'कौशल निर्माण' },
      { en: 'Self-Discipline', hi: 'आत्म-अनुशासन' },
      { en: 'Foundation', hi: 'नींव निर्माण' },
    ],
  },
  {
    id: 'grihastha',
    nameEn: 'Grihastha',
    nameHi: 'गृहस्थ',
    nameSa: 'गृहस्थम्',
    ageMin: 25,
    ageMax: 50,
    descriptionEn: 'The Householder — the most active ashram. Build wealth, raise family, serve society. All four Purusharthas are pursued simultaneously.',
    descriptionHi: 'गृहस्थी — सबसे सक्रिय आश्रम। धन बनाएँ, परिवार पालें, समाज सेवा करें। चारों पुरुषार्थ एक साथ साधें।',
    focusAreas: [
      { en: 'Career Growth', hi: 'करियर उन्नति' },
      { en: 'Family Building', hi: 'परिवार निर्माण' },
      { en: 'Wealth Creation', hi: 'धन सृजन' },
      { en: 'Dharmic Service', hi: 'धार्मिक सेवा' },
    ],
  },
  {
    id: 'vanaprastha',
    nameEn: 'Vanaprastha',
    nameHi: 'वानप्रस्थ',
    nameSa: 'वानप्रस्थम्',
    ageMin: 50,
    ageMax: 75,
    descriptionEn: 'The Mentor — step back from active accumulation. Share wisdom, mentor the young, deepen spiritual practice.',
    descriptionHi: 'मार्गदर्शक — सक्रिय संचय से पीछे हटें। ज्ञान बाँटें, युवाओं का मार्गदर्शन करें, आध्यात्मिक साधना गहरी करें।',
    focusAreas: [
      { en: 'Mentoring', hi: 'मार्गदर्शन' },
      { en: 'Giving Back', hi: 'समाज सेवा' },
      { en: 'Spiritual Practice', hi: 'आध्यात्मिक साधना' },
      { en: 'Legacy Building', hi: 'विरासत निर्माण' },
    ],
  },
  {
    id: 'sannyasa',
    nameEn: 'Sannyasa',
    nameHi: 'संन्यास',
    nameSa: 'संन्यासम्',
    ageMin: 75,
    ageMax: 150,
    descriptionEn: 'The Sage — release attachment to worldly outcomes. Focus on inner peace, moksha, and the transmission of wisdom.',
    descriptionHi: 'संन्यासी — सांसारिक परिणामों से आसक्ति त्यागें। आन्तरिक शान्ति, मोक्ष और ज्ञान के संचरण पर ध्यान दें।',
    focusAreas: [
      { en: 'Inner Peace', hi: 'आन्तरिक शान्ति' },
      { en: 'Moksha', hi: 'मोक्ष' },
      { en: 'Wisdom Sharing', hi: 'ज्ञान दान' },
      { en: 'Spiritual Legacy', hi: 'आध्यात्मिक विरासत' },
    ],
  },
];

export function getAshram(birthDate: string): AshramInfo {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  return ASHRAMS.find(a => age >= a.ageMin && age < a.ageMax) ?? ASHRAMS[1]; // Default grihastha
}
