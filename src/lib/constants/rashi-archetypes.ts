export interface RashiArchetype {
  rashiId: number;
  archetype: string;          // "The Warrior"
  oneLineEn: string;          // Poetic one-liner
  oneLineHi: string;
  glowColor: string;          // For the tarot card glow
}

export const RASHI_ARCHETYPES: RashiArchetype[] = [
  {
    rashiId: 1,
    archetype: 'The Warrior',
    oneLineEn: 'First to act, first to dare. You enter every room like it was built for you.',
    oneLineHi: 'सबसे पहले कार्य, सबसे पहले साहस। आप हर कमरे में ऐसे प्रवेश करते हैं जैसे वह आपके लिए बना हो।',
    glowColor: '#ef4444',
  },
  {
    rashiId: 2,
    archetype: 'The Builder',
    oneLineEn: 'Beneath the fire burns a soul that craves beauty, loyalty, and the slow art of creation.',
    oneLineHi: 'अग्नि के नीचे एक आत्मा है जो सौन्दर्य, निष्ठा और धीमी सृजनकला चाहती है।',
    glowColor: '#22c55e',
  },
  {
    rashiId: 3,
    archetype: 'The Messenger',
    oneLineEn: 'Your mind moves faster than the world. Words are your weapons and your wings.',
    oneLineHi: 'आपका मन संसार से तेज़ चलता है। शब्द आपके अस्त्र और पंख हैं।',
    glowColor: '#f59e0b',
  },
  {
    rashiId: 4,
    archetype: 'The Nurturer',
    oneLineEn: 'You feel everything twice — once for yourself, once for the world. That is your power.',
    oneLineHi: 'आप सब कुछ दो बार अनुभव करते हैं — एक बार स्वयं के लिए, एक बार संसार के लिए।',
    glowColor: '#e0e0e0',
  },
  {
    rashiId: 5,
    archetype: 'The Sovereign',
    oneLineEn: 'Born to lead, not to follow. The spotlight finds you whether you seek it or not.',
    oneLineHi: 'नेतृत्व के लिए जन्मे, अनुसरण के लिए नहीं। प्रकाश आपको ढूँढ लेता है।',
    glowColor: '#f59e0b',
  },
  {
    rashiId: 6,
    archetype: 'The Analyst',
    oneLineEn: 'Precision is your art. Where others see chaos, you find patterns waiting to be named.',
    oneLineHi: 'सटीकता आपकी कला है। जहाँ अन्य अराजकता देखते हैं, आप प्रतिरूप खोज लेते हैं।',
    glowColor: '#22c55e',
  },
  {
    rashiId: 7,
    archetype: 'The Harmonizer',
    oneLineEn: 'Balance is not passive — it is the hardest act of creation. You make it look effortless.',
    oneLineHi: 'संतुलन निष्क्रिय नहीं — यह सृजन का सबसे कठिन कार्य है। आप इसे सहज बना देते हैं।',
    glowColor: '#3b82f6',
  },
  {
    rashiId: 8,
    archetype: 'The Alchemist',
    oneLineEn: 'You transform everything you touch. Destruction and creation are the same act in your hands.',
    oneLineHi: 'आप जो छूते हैं उसे रूपान्तरित कर देते हैं। विनाश और सृजन आपके हाथों में एक ही क्रिया हैं।',
    glowColor: '#ef4444',
  },
  {
    rashiId: 9,
    archetype: 'The Seeker',
    oneLineEn: 'The horizon is not a destination — it is an invitation. You were born to explore.',
    oneLineHi: 'क्षितिज गन्तव्य नहीं — यह निमन्त्रण है। आप अन्वेषण के लिए जन्मे हैं।',
    glowColor: '#8b5cf6',
  },
  {
    rashiId: 10,
    archetype: 'The Architect',
    oneLineEn: 'You build structures that outlast you. Discipline is your love language.',
    oneLineHi: 'आप ऐसी संरचनाएँ बनाते हैं जो आपसे आगे जीवित रहें। अनुशासन आपकी प्रेम भाषा है।',
    glowColor: '#8a6d2b',
  },
  {
    rashiId: 11,
    archetype: 'The Visionary',
    oneLineEn: 'You see the future before it arrives. The world catches up to your ideas — eventually.',
    oneLineHi: 'आप भविष्य को उसके आने से पहले देखते हैं। संसार आपके विचारों तक पहुँचता है — अन्ततः।',
    glowColor: '#3b82f6',
  },
  {
    rashiId: 12,
    archetype: 'The Mystic',
    oneLineEn: 'The boundary between dream and reality is thinner for you than for anyone else alive.',
    oneLineHi: 'स्वप्न और वास्तविकता की सीमा आपके लिए किसी भी अन्य से पतली है।',
    glowColor: '#8b5cf6',
  },
];
