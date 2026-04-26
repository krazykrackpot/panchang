export type Dosha = 'vata' | 'pitta' | 'kapha';
export type DoshaProfile = {
  dominant: Dosha;
  secondary: Dosha;
  scores: { vata: number; pitta: number; kapha: number };
  label: string; // e.g. "Pitta-Vata"
};

export interface PrakritiQuestion {
  id: string;
  question: { en: string; hi: string };
  options: {
    label: { en: string; hi: string };
    dosha: Dosha;
  }[];
}

export const PRAKRITI_QUESTIONS: PrakritiQuestion[] = [
  {
    id: 'frame',
    question: {
      en: 'What best describes your body frame?',
      hi: 'आपके शरीर की बनावट कैसी है?',
    },
    options: [
      { label: { en: 'Thin, light, hard to gain weight', hi: 'पतला, हल्का, वजन बढ़ना कठिन' }, dosha: 'vata' },
      { label: { en: 'Medium, muscular, athletic', hi: 'मध्यम, मांसल, एथलेटिक' }, dosha: 'pitta' },
      { label: { en: 'Broad, heavy, gains weight easily', hi: 'चौड़ा, भारी, वजन आसानी से बढ़ता है' }, dosha: 'kapha' },
    ],
  },
  {
    id: 'digestion',
    question: {
      en: 'How would you describe your digestion?',
      hi: 'आपकी पाचन शक्ति कैसी है?',
    },
    options: [
      { label: { en: 'Irregular — sometimes strong, sometimes weak', hi: 'अनियमित — कभी अच्छी, कभी कमज़ोर' }, dosha: 'vata' },
      { label: { en: 'Strong — I get irritable if I miss a meal', hi: 'तेज़ — भोजन छूटने पर चिड़चिड़ाहट' }, dosha: 'pitta' },
      { label: { en: 'Slow but steady — I can skip meals easily', hi: 'धीमी लेकिन स्थिर — भोजन छोड़ सकता हूँ' }, dosha: 'kapha' },
    ],
  },
  {
    id: 'sleep',
    question: {
      en: 'What is your sleep pattern?',
      hi: 'आपकी नींद कैसी है?',
    },
    options: [
      { label: { en: 'Light sleeper, wake up easily, variable', hi: 'हल्की नींद, आसानी से जागना' }, dosha: 'vata' },
      { label: { en: 'Moderate — I sleep well but wake alert', hi: 'मध्यम — अच्छी नींद, सतर्क जागना' }, dosha: 'pitta' },
      { label: { en: 'Deep, heavy sleeper — hard to wake up', hi: 'गहरी, भारी नींद — जागना कठिन' }, dosha: 'kapha' },
    ],
  },
  {
    id: 'stress',
    question: {
      en: 'How do you typically respond to stress?',
      hi: 'तनाव में आपकी प्रतिक्रिया कैसी होती है?',
    },
    options: [
      { label: { en: 'Anxiety, worry, overthinking', hi: 'चिंता, बेचैनी, अधिक सोचना' }, dosha: 'vata' },
      { label: { en: 'Frustration, anger, impatience', hi: 'निराशा, क्रोध, अधीरता' }, dosha: 'pitta' },
      { label: { en: 'Withdrawal, avoidance, lethargy', hi: 'पीछे हटना, टालना, सुस्ती' }, dosha: 'kapha' },
    ],
  },
  {
    id: 'energy',
    question: {
      en: 'What describes your energy pattern?',
      hi: 'आपकी ऊर्जा का पैटर्न कैसा है?',
    },
    options: [
      { label: { en: 'Bursts of energy, then crashes', hi: 'ऊर्जा के उभार, फिर थकान' }, dosha: 'vata' },
      { label: { en: 'Steady and focused throughout the day', hi: 'पूरे दिन स्थिर और केंद्रित' }, dosha: 'pitta' },
      { label: { en: 'Slow to start, but great endurance', hi: 'शुरू में धीमा, लेकिन सहनशक्ति अच्छी' }, dosha: 'kapha' },
    ],
  },
];

export function scorePrakriti(answers: Record<string, Dosha>): DoshaProfile {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  for (const dosha of Object.values(answers)) {
    scores[dosha]++;
  }

  const sorted = (['vata', 'pitta', 'kapha'] as Dosha[])
    .sort((a, b) => scores[b] - scores[a]);

  return {
    dominant: sorted[0],
    secondary: sorted[1],
    scores,
    label: `${sorted[0].charAt(0).toUpperCase() + sorted[0].slice(1)}-${sorted[1].charAt(0).toUpperCase() + sorted[1].slice(1)}`,
  };
}
