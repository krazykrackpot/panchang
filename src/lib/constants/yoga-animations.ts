// Yoga Formation Animator — animation data for key Jyotish yogas.
// Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
// Houses are 1-based (1=Lagna). fromLagna=true means house counted from Lagna;
// fromLagna=false means house counted from Moon.

export type YogaCategory = 'mahapurusha' | 'lunar' | 'raja' | 'dhana' | 'dosha';

export interface YogaPlanetStep {
  planetId: number;
  house: number;       // 1-based
  fromLagna: boolean;
}

export interface YogaCondition {
  text: string;
  textHi: string;
  textTa: string;
  textBn: string;
  // Identifies which step(s) complete this condition (0-based index into planets array)
  triggeredByStep: number[];
}

export interface YogaAnimation {
  id: string;
  name: string;
  nameHi: string;
  nameTa: string;
  nameBn: string;
  category: YogaCategory;
  description: string;
  descriptionHi: string;
  descriptionTa: string;
  descriptionBn: string;
  classical: string;   // BPHS chapter / verse reference
  conditions: YogaCondition[];
  // Ordered steps — planets animate to position one by one
  planets: YogaPlanetStep[];
  frequency: string;   // human-readable, e.g. "~8% of charts"
  frequencyHi: string;
  accentColor: string; // Tailwind color class for category tint
}

// ─── Planet display info ────────────────────────────────────────────────────
export const PLANET_META: Record<number, {
  symbol: string;
  label: { en: string; hi: string; ta: string; bn: string };
  color: string;  // hex
}> = {
  0: { symbol: '☉', label: { en: 'Sun',     hi: 'सूर्य',       ta: 'சூரியன்',     bn: 'সূর্য'     }, color: '#f0a020' },
  1: { symbol: '☽', label: { en: 'Moon',    hi: 'चन्द्र',      ta: 'சந்திரன்',    bn: 'চন্দ্র'    }, color: '#b0c8f0' },
  2: { symbol: '♂', label: { en: 'Mars',    hi: 'मंगल',        ta: 'செவ்வாய்',    bn: 'মঙ্গল'    }, color: '#e84040' },
  3: { symbol: '☿', label: { en: 'Mercury', hi: 'बुध',          ta: 'புதன்',       bn: 'বুধ'       }, color: '#50d890' },
  4: { symbol: '♃', label: { en: 'Jupiter', hi: 'बृहस्पति',    ta: 'வியாழன்',     bn: 'বৃহস্পতি' }, color: '#f0c030' },
  5: { symbol: '♀', label: { en: 'Venus',   hi: 'शुक्र',       ta: 'சுக்கிரன்',   bn: 'শুক্র'    }, color: '#f080c0' },
  6: { symbol: '♄', label: { en: 'Saturn',  hi: 'शनि',          ta: 'சனி',         bn: 'শনি'       }, color: '#8080d0' },
  7: { symbol: '☊', label: { en: 'Rahu',    hi: 'राहु',        ta: 'ராகு',        bn: 'রাহু'     }, color: '#70c0b0' },
  8: { symbol: '☋', label: { en: 'Ketu',    hi: 'केतु',        ta: 'கேது',        bn: 'কেতু'     }, color: '#c07050' },
};

// ─── Category display info ─────────────────────────────────────────────────
export const CATEGORY_META: Record<YogaCategory, {
  label: { en: string; hi: string; ta: string; bn: string };
  color: string;
  glow: string;
}> = {
  mahapurusha: {
    label: { en: 'Mahapurusha', hi: 'महापुरुष', ta: 'மகாபுருஷ', bn: 'মহাপুরুষ' },
    color: '#f0c030',
    glow: 'rgba(240,192,48,0.3)',
  },
  lunar: {
    label: { en: 'Lunar (Chandra)', hi: 'चन्द्र योग', ta: 'சந்திர யோகம்', bn: 'চন্দ্র যোগ' },
    color: '#80b8f0',
    glow: 'rgba(128,184,240,0.3)',
  },
  raja: {
    label: { en: 'Raja Yoga', hi: 'राज योग', ta: 'ராஜ யோகம்', bn: 'রাজ যোগ' },
    color: '#d4a853',
    glow: 'rgba(212,168,83,0.3)',
  },
  dhana: {
    label: { en: 'Dhana Yoga', hi: 'धन योग', ta: 'தன யோகம்', bn: 'ধন যোগ' },
    color: '#40c880',
    glow: 'rgba(64,200,128,0.3)',
  },
  dosha: {
    label: { en: 'Dosha', hi: 'दोष', ta: 'தோஷம்', bn: 'দোষ' },
    color: '#e85050',
    glow: 'rgba(232,80,80,0.3)',
  },
};

// ─── The yoga catalog ──────────────────────────────────────────────────────
export const YOGA_ANIMATIONS: YogaAnimation[] = [
  // ── Mahapurusha: Hamsa ──────────────────────────────────────────────────
  {
    id: 'hamsa',
    name: 'Hamsa Yoga',
    nameHi: 'हंस योग',
    nameTa: 'ஹம்ஸ யோகம்',
    nameBn: 'হংস যোগ',
    category: 'mahapurusha',
    classical: 'BPHS Ch.34 v.3',
    description: 'Jupiter occupies a kendra house (1, 4, 7, or 10) and is in its own sign (Sagittarius/Pisces) or exaltation (Cancer). Bestows wisdom, spiritual authority, and natural leadership.',
    descriptionHi: 'बृहस्पति केन्द्र भाव (1, 4, 7 या 10) में स्वराशि (धनु/मीन) या उच्च (कर्क) में हो। ज्ञान, आध्यात्मिक अधिकार और नेतृत्व प्रदान करता है।',
    descriptionTa: 'வியாழன் கேந்திர வீட்டில் (1, 4, 7, அல்லது 10) சொந்த ராசியில் (தனுசு/மீனம்) அல்லது உச்சத்தில் (கடகம்) இருக்கும்போது. ஞானம், ஆன்மீக அதிகாரம் வழங்கும்.',
    descriptionBn: 'বৃহস্পতি কেন্দ্র ঘরে (১, ৪, ৭, বা ১০) নিজ রাশিতে (ধনু/মীন) বা উচ্চ রাশিতে (কর্কট) থাকলে। জ্ঞান, আধ্যাত্মিক কর্তৃত্ব প্রদান করে।',
    conditions: [
      {
        text: 'Jupiter is in a kendra house (1st, 4th, 7th, or 10th)',
        textHi: 'बृहस्पति केन्द्र भाव (1, 4, 7 या 10) में हो',
        textTa: 'வியாழன் கேந்திர வீட்டில் (1, 4, 7, அல்லது 10) இருக்க வேண்டும்',
        textBn: 'বৃহস্পতি কেন্দ্র ঘরে (১, ৪, ৭, বা ১০) থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Jupiter is in own sign (Sagittarius ♐ / Pisces ♓) or exaltation (Cancer ♋)',
        textHi: 'बृहस्पति स्वराशि (धनु ♐ / मीन ♓) या उच्च (कर्क ♋) में हो',
        textTa: 'வியாழன் சொந்த ராசியில் (தனுசு / மீனம்) அல்லது உச்சத்தில் (கடகம்) இருக்க வேண்டும்',
        textBn: 'বৃহস্পতি নিজ রাশিতে (ধনু / মীন) অথবা উচ্চ রাশিতে (কর্কট) থাকতে হবে',
        triggeredByStep: [0],
      },
    ],
    planets: [{ planetId: 4, house: 4, fromLagna: true }],
    frequency: '~6% of charts',
    frequencyHi: '~6% कुण्डलियों में',
    accentColor: '#f0c030',
  },

  // ── Mahapurusha: Malavya ─────────────────────────────────────────────────
  {
    id: 'malavya',
    name: 'Malavya Yoga',
    nameHi: 'मालव्य योग',
    nameTa: 'மாலவ்ய யோகம்',
    nameBn: 'মালব্য যোগ',
    category: 'mahapurusha',
    classical: 'BPHS Ch.34 v.4',
    description: 'Venus occupies a kendra in its own sign (Taurus/Libra) or exaltation (Pisces). Confers beauty, artistic talent, luxuries, and charm.',
    descriptionHi: 'शुक्र केन्द्र में स्वराशि (वृष/तुला) या उच्च (मीन) में हो। सौन्दर्य, कला, विलासिता और आकर्षण देता है।',
    descriptionTa: 'சுக்கிரன் கேந்திரத்தில் சொந்த ராசியில் (ரிஷபம்/துலாம்) அல்லது உச்சத்தில் (மீனம்) இருக்கும்போது. அழகு, கலை, ஆடம்பரம் வழங்கும்.',
    descriptionBn: 'শুক্র কেন্দ্রে নিজ রাশিতে (বৃষ/তুলা) বা উচ্চ রাশিতে (মীন) থাকলে। সৌন্দর্য, শিল্পকলা, বিলাসিতা প্রদান করে।',
    conditions: [
      {
        text: 'Venus is in a kendra house (1st, 4th, 7th, or 10th)',
        textHi: 'शुक्र केन्द्र भाव में हो',
        textTa: 'சுக்கிரன் கேந்திர வீட்டில் இருக்க வேண்டும்',
        textBn: 'শুক্র কেন্দ্র ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Venus is in Taurus ♉, Libra ♎ (own), or Pisces ♓ (exaltation)',
        textHi: 'शुक्र वृष ♉, तुला ♎ या मीन ♓ में हो',
        textTa: 'சுக்கிரன் ரிஷபம் ♉, துலாம் ♎, அல்லது மீனம் ♓-ல் இருக்க வேண்டும்',
        textBn: 'শুক্র বৃষ ♉, তুলা ♎ বা মীন ♓ রাশিতে থাকতে হবে',
        triggeredByStep: [0],
      },
    ],
    planets: [{ planetId: 5, house: 7, fromLagna: true }],
    frequency: '~9% of charts',
    frequencyHi: '~9% कुण्डलियों में',
    accentColor: '#f080c0',
  },

  // ── Mahapurusha: Ruchaka ─────────────────────────────────────────────────
  {
    id: 'ruchaka',
    name: 'Ruchaka Yoga',
    nameHi: 'रुचक योग',
    nameTa: 'ருசக யோகம்',
    nameBn: 'রুচক যোগ',
    category: 'mahapurusha',
    classical: 'BPHS Ch.34 v.1',
    description: 'Mars occupies a kendra in its own sign (Aries/Scorpio) or exaltation (Capricorn). Gives courage, military strength, physical vitality, and leadership.',
    descriptionHi: 'मंगल केन्द्र में स्वराशि (मेष/वृश्चिक) या उच्च (मकर) में हो। साहस, सैन्यशक्ति, शारीरिक ऊर्जा और नेतृत्व देता है।',
    descriptionTa: 'செவ்வாய் கேந்திரத்தில் சொந்த ராசியில் (மேஷம்/விருச்சிகம்) அல்லது உச்சத்தில் (மகரம்) இருக்கும்போது. தைரியம், படைவீரம் வழங்கும்.',
    descriptionBn: 'মঙ্গল কেন্দ্রে নিজ রাশিতে (মেষ/বৃশ্চিক) বা উচ্চ রাশিতে (মকর) থাকলে। সাহস, সামরিক শক্তি, শারীরিক শক্তি প্রদান করে।',
    conditions: [
      {
        text: 'Mars is in a kendra house (1st, 4th, 7th, or 10th)',
        textHi: 'मंगल केन्द्र भाव में हो',
        textTa: 'செவ்வாய் கேந்திர வீட்டில் இருக்க வேண்டும்',
        textBn: 'মঙ্গল কেন্দ্র ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Mars is in Aries ♈, Scorpio ♏ (own), or Capricorn ♑ (exaltation)',
        textHi: 'मंगल मेष ♈, वृश्चिक ♏ या मकर ♑ में हो',
        textTa: 'செவ்வாய் மேஷம் ♈, விருச்சிகம் ♏, அல்லது மகரம் ♑-ல் இருக்க வேண்டும்',
        textBn: 'মঙ্গল মেষ ♈, বৃশ্চিক ♏ বা মকর ♑ রাশিতে থাকতে হবে',
        triggeredByStep: [0],
      },
    ],
    planets: [{ planetId: 2, house: 10, fromLagna: true }],
    frequency: '~5% of charts',
    frequencyHi: '~5% कुण्डलियों में',
    accentColor: '#e84040',
  },

  // ── Mahapurusha: Bhadra ──────────────────────────────────────────────────
  {
    id: 'bhadra',
    name: 'Bhadra Yoga',
    nameHi: 'भद्र योग',
    nameTa: 'பத்ர யோகம்',
    nameBn: 'ভদ্র যোগ',
    category: 'mahapurusha',
    classical: 'BPHS Ch.34 v.2',
    description: 'Mercury occupies a kendra in its own sign (Gemini/Virgo) or exaltation (Virgo). Bestows intelligence, oratory skill, business acumen, and literary talent.',
    descriptionHi: 'बुध केन्द्र में स्वराशि (मिथुन/कन्या) या उच्च (कन्या) में हो। बुद्धि, वाकपटुता और व्यापार कुशलता देता है।',
    descriptionTa: 'புதன் கேந்திரத்தில் சொந்த ராசியில் (மிதுனம்/கன்னி) அல்லது உச்சத்தில் (கன்னி) இருக்கும்போது. அறிவாற்றல், சொல்வன்மை வழங்கும்.',
    descriptionBn: 'বুধ কেন্দ্রে নিজ রাশিতে (মিথুন/কন্যা) বা উচ্চ রাশিতে (কন্যা) থাকলে। বুদ্ধিমত্তা, বক্তৃতা দক্ষতা প্রদান করে।',
    conditions: [
      {
        text: 'Mercury is in a kendra house (1st, 4th, 7th, or 10th)',
        textHi: 'बुध केन्द्र भाव में हो',
        textTa: 'புதன் கேந்திர வீட்டில் இருக்க வேண்டும்',
        textBn: 'বুধ কেন্দ্র ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Mercury is in Gemini ♊ or Virgo ♍ (own/exaltation)',
        textHi: 'बुध मिथुन ♊ या कन्या ♍ में हो',
        textTa: 'புதன் மிதுனம் ♊ அல்லது கன்னி ♍-ல் இருக்க வேண்டும்',
        textBn: 'বুধ মিথুন ♊ বা কন্যা ♍ রাশিতে থাকতে হবে',
        triggeredByStep: [0],
      },
    ],
    planets: [{ planetId: 3, house: 1, fromLagna: true }],
    frequency: '~10% of charts',
    frequencyHi: '~10% कुण्डलियों में',
    accentColor: '#50d890',
  },

  // ── Mahapurusha: Shasha ──────────────────────────────────────────────────
  {
    id: 'shasha',
    name: 'Shasha Yoga',
    nameHi: 'शश योग',
    nameTa: 'சசா யோகம்',
    nameBn: 'শশ যোগ',
    category: 'mahapurusha',
    classical: 'BPHS Ch.34 v.5',
    description: 'Saturn occupies a kendra in its own sign (Capricorn/Aquarius) or exaltation (Libra). Gives discipline, endurance, political power, and mastery over large organizations.',
    descriptionHi: 'शनि केन्द्र में स्वराशि (मकर/कुम्भ) या उच्च (तुला) में हो। अनुशासन, सहनशीलता और राजनीतिक शक्ति देता है।',
    descriptionTa: 'சனி கேந்திரத்தில் சொந்த ராசியில் (மகரம்/கும்பம்) அல்லது உச்சத்தில் (துலாம்) இருக்கும்போது. ஒழுக்கம், நீடித்த சக்தி வழங்கும்.',
    descriptionBn: 'শনি কেন্দ্রে নিজ রাশিতে (মকর/কুম্ভ) বা উচ্চ রাশিতে (তুলা) থাকলে। শৃঙ্খলা, সহনশীলতা, রাজনৈতিক ক্ষমতা প্রদান করে।',
    conditions: [
      {
        text: 'Saturn is in a kendra house (1st, 4th, 7th, or 10th)',
        textHi: 'शनि केन्द्र भाव में हो',
        textTa: 'சனி கேந்திர வீட்டில் இருக்க வேண்டும்',
        textBn: 'শনি কেন্দ্র ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Saturn is in Capricorn ♑, Aquarius ♒ (own), or Libra ♎ (exaltation)',
        textHi: 'शनि मकर ♑, कुम्भ ♒ या तुला ♎ में हो',
        textTa: 'சனி மகரம் ♑, கும்பம் ♒, அல்லது துலாம் ♎-ல் இருக்க வேண்டும்',
        textBn: 'শনি মকর ♑, কুম্ভ ♒ বা তুলা ♎ রাশিতে থাকতে হবে',
        triggeredByStep: [0],
      },
    ],
    planets: [{ planetId: 6, house: 7, fromLagna: true }],
    frequency: '~8% of charts',
    frequencyHi: '~8% कुण्डलियों में',
    accentColor: '#8080d0',
  },

  // ── Lunar: Gajakesari ────────────────────────────────────────────────────
  {
    id: 'gajakesari',
    name: 'Gajakesari Yoga',
    nameHi: 'गजकेसरी योग',
    nameTa: 'கஜகேசரி யோகம்',
    nameBn: 'গজকেসরী যোগ',
    category: 'lunar',
    classical: 'Phaladeepika Ch.6 v.1',
    description: 'Jupiter occupies a kendra from the Moon (houses 1, 4, 7, or 10 counted from Moon). Bestows fame, wealth, and the intelligence of an elephant (gaja) combined with the strength of a lion (kesari).',
    descriptionHi: 'बृहस्पति चन्द्र से केन्द्र (चन्द्र से 1, 4, 7 या 10वें भाव) में हो। हाथी जैसी बुद्धि और सिंह जैसी शक्ति — प्रसिद्धि और धन देता है।',
    descriptionTa: 'வியாழன் சந்திரனிடமிருந்து கேந்திரத்தில் (1, 4, 7, அல்லது 10ஆம் வீட்டில்) இருக்கும்போது. யானையின் அறிவும் சிங்கத்தின் வலிமையும் கொடுக்கும்.',
    descriptionBn: 'বৃহস্পতি চাঁদ থেকে কেন্দ্রে (১, ৪, ৭, বা ১০ নম্বর ঘরে) থাকলে। হাতির মতো বুদ্ধি ও সিংহের মতো শক্তি — খ্যাতি ও সম্পদ প্রদান করে।',
    conditions: [
      {
        text: 'Moon is placed in any house (acts as reference point)',
        textHi: 'चन्द्र किसी भी भाव में हो (सन्दर्भ बिन्दु)',
        textTa: 'சந்திரன் எந்த வீட்டிலும் இருக்கலாம் (குறிப்பு புள்ளி)',
        textBn: 'চাঁদ যেকোনো ঘরে থাকতে পারে (রেফারেন্স পয়েন্ট)',
        triggeredByStep: [0],
      },
      {
        text: 'Jupiter is in a kendra from the Moon (4th, 7th, or 10th from Moon)',
        textHi: 'बृहस्पति चन्द्र से केन्द्र (चन्द्र से 4, 7 या 10वें) में हो',
        textTa: 'வியாழன் சந்திரனிடமிருந்து கேந்திரத்தில் (4, 7, அல்லது 10ஆம் இடத்தில்) இருக்க வேண்டும்',
        textBn: 'বৃহস্পতি চাঁদ থেকে কেন্দ্রে (৪র্থ, ৭ম বা ১০ম) থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 4, house: 7, fromLagna: true },
    ],
    frequency: '~25% of charts',
    frequencyHi: '~25% कुण्डलियों में',
    accentColor: '#80b8f0',
  },

  // ── Lunar: Chandra-Mangala ───────────────────────────────────────────────
  {
    id: 'chandra_mangala',
    name: 'Chandra-Mangala Yoga',
    nameHi: 'चन्द्र-मंगल योग',
    nameTa: 'சந்திர-மங்கள யோகம்',
    nameBn: 'চন্দ্র-মঙ্গল যোগ',
    category: 'lunar',
    classical: 'Brihat Parashara Hora Shastra Ch.36',
    description: 'Moon and Mars are conjunct in the same house. Gives energy, drive, emotional intensity, commercial instinct, and wealth through trade or business.',
    descriptionHi: 'चन्द्र और मंगल एक ही भाव में युति करें। ऊर्जा, व्यापारिक बुद्धि और व्यवसाय से धन देता है।',
    descriptionTa: 'சந்திரன் மற்றும் செவ்வாய் ஒரே வீட்டில் இணைந்திருக்கும்போது. ஆற்றல், உந்துதல், வணிகச் சாதுர்யம் வழங்கும்.',
    descriptionBn: 'চাঁদ ও মঙ্গল একই ঘরে যুক্ত থাকলে। শক্তি, আবেগ, বাণিজ্যিক বুদ্ধি এবং ব্যবসায় সম্পদ প্রদান করে।',
    conditions: [
      {
        text: 'Moon is placed in a house',
        textHi: 'चन्द्र किसी भाव में हो',
        textTa: 'சந்திரன் ஒரு வீட்டில் இருக்க வேண்டும்',
        textBn: 'চাঁদ একটি ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Mars is conjunct Moon in the same house',
        textHi: 'मंगल चन्द्र के साथ उसी भाव में हो',
        textTa: 'செவ்வாய் சந்திரனுடன் அதே வீட்டில் இருக்க வேண்டும்',
        textBn: 'মঙ্গল চাঁদের সাথে একই ঘরে থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 1, house: 5, fromLagna: true },
      { planetId: 2, house: 5, fromLagna: true },
    ],
    frequency: '~8% of charts',
    frequencyHi: '~8% कुण्डलियों में',
    accentColor: '#80b8f0',
  },

  // ── Lunar: Sunaphaa ──────────────────────────────────────────────────────
  {
    id: 'sunafa',
    name: 'Sunaphaa Yoga',
    nameHi: 'सुनफा योग',
    nameTa: 'சுனபா யோகம்',
    nameBn: 'সুনফা যোগ',
    category: 'lunar',
    classical: 'Phaladeepika Ch.6 v.3',
    description: 'A planet other than Sun occupies the 2nd house from the Moon. Indicates self-made wealth, intelligence, and good social standing.',
    descriptionHi: 'सूर्य के अतिरिक्त कोई ग्रह चन्द्र से दूसरे भाव में हो। स्वअर्जित धन, बुद्धि और सामाजिक प्रतिष्ठा देता है।',
    descriptionTa: 'சூரியன் தவிர வேறொரு கிரகம் சந்திரனிலிருந்து 2ஆம் வீட்டில் இருக்கும்போது. சுய-ஈட்டிய செல்வம், அறிவாற்றல் வழங்கும்.',
    descriptionBn: 'সূর্য ছাড়া অন্য কোনো গ্রহ চাঁদ থেকে ২য় ঘরে থাকলে। নিজের উপার্জিত সম্পদ, বুদ্ধিমত্তা প্রদান করে।',
    conditions: [
      {
        text: 'Moon is placed in any house',
        textHi: 'चन्द्र किसी भाव में हो',
        textTa: 'சந்திரன் எந்த வீட்டிலும் இருக்கலாம்',
        textBn: 'চাঁদ যেকোনো ঘরে থাকতে পারে',
        triggeredByStep: [0],
      },
      {
        text: 'A planet (not Sun) occupies the 2nd house from Moon',
        textHi: 'सूर्य को छोड़कर कोई ग्रह चन्द्र से 2वें भाव में हो',
        textTa: 'சூரியன் தவிர வேறொரு கிரகம் சந்திரனிலிருந்து 2ஆம் வீட்டில் இருக்க வேண்டும்',
        textBn: 'সূর্য বাদে অন্য গ্রহ চাঁদ থেকে ২য় ঘরে থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 1, house: 6, fromLagna: true },
      { planetId: 4, house: 7, fromLagna: true },
    ],
    frequency: '~30% of charts',
    frequencyHi: '~30% कुण्डलियों में',
    accentColor: '#80b8f0',
  },

  // ── Raja: Dharma-Karmadhipati ────────────────────────────────────────────
  {
    id: 'dharma_karma',
    name: 'Dharma-Karmadhipati Yoga',
    nameHi: 'धर्म-कर्माधिपति योग',
    nameTa: 'தர்ம-கர்மாதிபதி யோகம்',
    nameBn: 'ধর্ম-কর্মাধিপতি যোগ',
    category: 'raja',
    classical: 'BPHS Ch.34 v.15',
    description: 'The lords of the 9th house (dharma, fortune) and 10th house (karma, career) are conjunct or exchange signs. One of the most powerful raja yogas for career success and authority.',
    descriptionHi: '9वें (धर्म, भाग्य) और 10वें (कर्म, व्यवसाय) भाव के स्वामी एक साथ हों या परिवर्तन योग बने। करियर और अधिकार के लिए सबसे शक्तिशाली राज योगों में से एक।',
    descriptionTa: '9ஆம் (தர்மம்) மற்றும் 10ஆம் (கர்மம்) வீட்டின் அதிபர்கள் இணைந்தால் அல்லது இடம் மாறினால். தொழில் வெற்றிக்கான சக்திவாய்ந்த ராஜ யோகம்.',
    descriptionBn: '৯ম (ধর্ম) ও ১০ম (কর্ম) ঘরের স্বামীরা একসাথে থাকলে বা রাশি বিনিময় করলে। কর্মজীবনের সাফল্যের জন্য সবচেয়ে শক্তিশালী রাজ যোগ।',
    conditions: [
      {
        text: '9th house lord is placed in a house',
        textHi: '9वें भाव का स्वामी किसी भाव में हो',
        textTa: '9ஆம் வீட்டின் அதிபர் ஒரு வீட்டில் இருக்க வேண்டும்',
        textBn: '৯ম ঘরের স্বামী একটি ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: '10th house lord is conjunct the 9th house lord',
        textHi: '10वें भाव का स्वामी 9वें के स्वामी के साथ युत हो',
        textTa: '10ஆம் வீட்டின் அதிபர் 9ஆம் வீட்டின் அதிபருடன் இணைந்திருக்க வேண்டும்',
        textBn: '১০ম ঘরের স্বামী ৯ম ঘরের স্বামীর সাথে একত্রে থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    // Represent with Sun (9th lord) + Jupiter (10th lord) conjunct in 10th
    planets: [
      { planetId: 0, house: 10, fromLagna: true },
      { planetId: 4, house: 10, fromLagna: true },
    ],
    frequency: '~5% of charts',
    frequencyHi: '~5% कुण्डलियों में',
    accentColor: '#d4a853',
  },

  // ── Raja: Kendra-Trikona ─────────────────────────────────────────────────
  {
    id: 'kendra_trikona',
    name: 'Kendra-Trikona Raja Yoga',
    nameHi: 'केन्द्र-त्रिकोण राज योग',
    nameTa: 'கேந்திர-திரிகோண ராஜ யோகம்',
    nameBn: 'কেন্দ্র-ত্রিকোণ রাজ যোগ',
    category: 'raja',
    classical: 'BPHS Ch.34 v.7',
    description: 'A kendra lord (1st, 4th, 7th, 10th) and a trikona lord (1st, 5th, 9th) are conjunct or mutually aspect each other. Powerful combination for authority, success, and prosperity.',
    descriptionHi: 'केन्द्र (1, 4, 7, 10) का स्वामी और त्रिकोण (1, 5, 9) का स्वामी युत हों या परस्पर दृष्टि करें। अधिकार, सफलता और समृद्धि का शक्तिशाली योग।',
    descriptionTa: 'கேந்திர (1, 4, 7, 10) அதிபர் மற்றும் திரிகோண (1, 5, 9) அதிபர் இணைந்தால் அல்லது பரஸ்பர பார்வை செய்தால். அதிகாரம், வெற்றி, செழிப்பு யோகம்.',
    descriptionBn: 'কেন্দ্র (১, ৪, ৭, ১০) স্বামী ও ত্রিকোণ (১, ৫, ৯) স্বামী একসাথে থাকলে বা পরস্পর দৃষ্টি করলে। ক্ষমতা, সাফল্য ও সমৃদ্ধির শক্তিশালী যোগ।',
    conditions: [
      {
        text: 'A kendra lord (of 1st, 4th, 7th, or 10th house) is placed',
        textHi: 'केन्द्र भाव (1, 4, 7 या 10) का स्वामी स्थित हो',
        textTa: 'கேந்திர வீட்டின் (1, 4, 7, அல்லது 10) அதிபர் நிலை கொண்டிருக்க வேண்டும்',
        textBn: 'কেন্দ্র ঘরের (১, ৪, ৭ বা ১০) স্বামী থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'A trikona lord (of 1st, 5th, or 9th house) joins the kendra lord',
        textHi: 'त्रिकोण भाव (1, 5 या 9) का स्वामी केन्द्र स्वामी से युत हो',
        textTa: 'திரிகோண வீட்டின் (1, 5, அல்லது 9) அதிபர் கேந்திர அதிபரோடு சேர வேண்டும்',
        textBn: 'ত্রিকোণ ঘরের (১, ৫ বা ৯) স্বামী কেন্দ্র স্বামীর সাথে যুক্ত হতে হবে',
        triggeredByStep: [1],
      },
    ],
    // Jupiter (kendra lord) + Moon (trikona lord) in the 4th
    planets: [
      { planetId: 4, house: 4, fromLagna: true },
      { planetId: 1, house: 9, fromLagna: true },
    ],
    frequency: '~12% of charts',
    frequencyHi: '~12% कुण्डलियों में',
    accentColor: '#d4a853',
  },

  // ── Dhana: Dhana Yoga (2nd+11th lords in kendra) ─────────────────────────
  {
    id: 'dhana_kendra',
    name: 'Dhana Yoga',
    nameHi: 'धन योग',
    nameTa: 'தன யோகம்',
    nameBn: 'ধন যোগ',
    category: 'dhana',
    classical: 'BPHS Ch.36 v.2',
    description: 'Lords of the 2nd house (wealth) and 11th house (income/gains) are conjunct in a kendra. Indicates strong potential for accumulated wealth and steady income.',
    descriptionHi: '2वें (धन) और 11वें (आय/लाभ) भाव के स्वामी केन्द्र में एक साथ हों। संचित धन और स्थिर आय का बलवान संकेत।',
    descriptionTa: '2ஆம் (செல்வம்) மற்றும் 11ஆம் (வருமானம்/லாபம்) வீட்டு அதிபர்கள் கேந்திரத்தில் இணைந்திருக்கும்போது. குவிந்த செல்வம் மற்றும் நிலையான வருமானம்.',
    descriptionBn: '২য় (সম্পদ) ও ১১শ (আয়/লাভ) ঘরের স্বামীরা কেন্দ্রে একসাথে থাকলে। সঞ্চিত সম্পদ ও স্থির আয়ের শক্তিশালী সংকেত।',
    conditions: [
      {
        text: '2nd house lord is placed in a kendra (1st, 4th, 7th, or 10th)',
        textHi: '2वें भाव का स्वामी केन्द्र में हो',
        textTa: '2ஆம் வீட்டு அதிபர் கேந்திரத்தில் இருக்க வேண்டும்',
        textBn: '২য় ঘরের স্বামী কেন্দ্রে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: '11th house lord is conjunct the 2nd house lord in the kendra',
        textHi: '11वें भाव का स्वामी 2वें के स्वामी के साथ केन्द्र में युत हो',
        textTa: '11ஆம் வீட்டு அதிபர் 2ஆம் வீட்டு அதிபருடன் கேந்திரத்தில் இணைந்திருக்க வேண்டும்',
        textBn: '১১শ ঘরের স্বামী ২য় ঘরের স্বামীর সাথে কেন্দ্রে যুক্ত থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 5, house: 10, fromLagna: true },
      { planetId: 3, house: 10, fromLagna: true },
    ],
    frequency: '~7% of charts',
    frequencyHi: '~7% कुण्डलियों में',
    accentColor: '#40c880',
  },

  // ── Dhana: Lakshmi Yoga ──────────────────────────────────────────────────
  {
    id: 'lakshmi',
    name: 'Lakshmi Yoga',
    nameHi: 'लक्ष्मी योग',
    nameTa: 'லக்ஷ்மி யோகம்',
    nameBn: 'লক্ষ্মী যোগ',
    category: 'dhana',
    classical: 'BPHS Ch.36 v.4',
    description: 'The 9th house lord is strong and placed in a kendra or trikona in own/exaltation sign. Venus (natural significator of Lakshmi) is also strong. Bestows extraordinary wealth and good fortune.',
    descriptionHi: '9वें भाव का स्वामी बली हो और स्वराशि/उच्च में केन्द्र या त्रिकोण में हो। शुक्र भी बली हो। असाधारण धन और भाग्य देता है।',
    descriptionTa: '9ஆம் வீட்டு அதிபர் வலுவாக, சொந்த/உச்ச ராசியில் கேந்திரம் அல்லது திரிகோணத்தில் இருக்கும்போது. சுக்கிரனும் வலுவாக இருக்க வேண்டும். அசாதாரண செல்வம் வழங்கும்.',
    descriptionBn: '৯ম ঘরের স্বামী শক্তিশালী এবং নিজ/উচ্চ রাশিতে কেন্দ্র বা ত্রিকোণে থাকলে। শুক্রও শক্তিশালী হতে হবে। অসাধারণ সম্পদ ও সৌভাগ্য প্রদান করে।',
    conditions: [
      {
        text: "Venus (Lakshmi's natural significator) is strong in a kendra",
        textHi: 'शुक्र (लक्ष्मी का नैसर्गिक कारक) केन्द्र में बली हो',
        textTa: 'சுக்கிரன் (லக்ஷ்மியின் ஜாதக காரகம்) கேந்திரத்தில் வலுவாக இருக்க வேண்டும்',
        textBn: 'শুক্র (লক্ষ্মীর স্বাভাবিক কারক) কেন্দ্রে শক্তিশালী থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: '9th house lord is in own/exaltation sign in kendra or trikona',
        textHi: '9वें भाव का स्वामी स्वराशि/उच्च में केन्द्र या त्रिकोण में हो',
        textTa: '9ஆம் வீட்டு அதிபர் சொந்த/உச்ச ராசியில் கேந்திரம் அல்லது திரிகோணத்தில் இருக்க வேண்டும்',
        textBn: '৯ম ঘরের স্বামী নিজ/উচ্চ রাশিতে কেন্দ্র বা ত্রিকোণে থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 5, house: 4, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
    ],
    frequency: '~3% of charts',
    frequencyHi: '~3% कुण्डलियों में',
    accentColor: '#40c880',
  },

  // ── Dosha: Kaal Sarp ─────────────────────────────────────────────────────
  {
    id: 'kaal_sarp',
    name: 'Kaal Sarp Dosha',
    nameHi: 'काल सर्प दोष',
    nameTa: 'கால சர்ப தோஷம்',
    nameBn: 'কাল সর্প দোষ',
    category: 'dosha',
    classical: 'Manasagari / Saravali',
    description: 'All seven planets (Sun through Saturn) fall between Rahu and Ketu on one side of the nodal axis. Creates obstacles, delays, and karmic intensity, but also deep spiritual focus when elevated.',
    descriptionHi: 'सातों ग्रह (सूर्य से शनि) राहु-केतु के बीच एक ही ओर हों। बाधाएं, विलम्ब और कर्मिक तीव्रता — उच्च स्तर पर आध्यात्मिक गहराई भी।',
    descriptionTa: 'ஏழு கிரகங்களும் (சூரியன் முதல் சனி வரை) ராகு-கேது இடையே ஒரு பக்கத்தில் இருக்கும்போது. தடைகள், தாமதங்கள், ஆன்மீக ஆழம்.',
    descriptionBn: 'সাতটি গ্রহ (সূর্য থেকে শনি) রাহু-কেতুর মাঝে একপাশে থাকলে। বাধা, বিলম্ব, কর্মিক তীব্রতা — উন্নত স্তরে আধ্যাত্মিক গভীরতা।',
    conditions: [
      {
        text: 'Rahu and Ketu are placed (they are always 180° apart)',
        textHi: 'राहु और केतु स्थित हों (वे सदा 180° विपरीत होते हैं)',
        textTa: 'ராகு மற்றும் கேது நிலை கொண்டிருக்க வேண்டும் (அவை எப்போதும் 180° எதிரில்)',
        textBn: 'রাহু ও কেতু স্থাপিত থাকতে হবে (তারা সর্বদা ১৮০° বিপরীত)',
        triggeredByStep: [0, 1],
      },
      {
        text: 'All planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) fall between Rahu and Ketu on one side',
        textHi: 'सभी ग्रह (सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि) राहु-केतु के बीच एक ओर हों',
        textTa: 'அனைத்து கிரகங்களும் (சூரியன், சந்திரன், செவ்வாய், புதன், வியாழன், சுக்கிரன், சனி) ராகு-கேதுவுக்கு இடையே ஒரு பக்கத்தில் இருக்க வேண்டும்',
        textBn: 'সকল গ্রহ (সূর্য, চাঁদ, মঙ্গল, বুধ, বৃহস্পতি, শুক্র, শনি) রাহু-কেতুর মাঝে একদিকে থাকতে হবে',
        triggeredByStep: [2, 3, 4, 5, 6, 7, 8],
      },
    ],
    planets: [
      { planetId: 7, house:  2, fromLagna: true },
      { planetId: 8, house:  8, fromLagna: true },
      { planetId: 0, house:  3, fromLagna: true },
      { planetId: 1, house:  4, fromLagna: true },
      { planetId: 2, house:  5, fromLagna: true },
      { planetId: 3, house:  6, fromLagna: true },
      { planetId: 4, house:  6, fromLagna: true },
      { planetId: 5, house:  7, fromLagna: true },
      { planetId: 6, house:  7, fromLagna: true },
    ],
    frequency: '~5% of charts',
    frequencyHi: '~5% कुण्डलियों में',
    accentColor: '#e85050',
  },

  // ── Dosha: Mangal Dosha ──────────────────────────────────────────────────
  {
    id: 'mangal_dosha',
    name: 'Mangal Dosha',
    nameHi: 'मंगल दोष',
    nameTa: 'மங்கள தோஷம்',
    nameBn: 'মঙ্গল দোষ',
    category: 'dosha',
    classical: 'BPHS Ch.73 v.5',
    description: 'Mars is placed in the 1st, 4th, 7th, 8th, or 12th house from Lagna (or Moon or Venus). Traditionally considered to create friction in marriage; modern interpretation: intense energy requiring channeling.',
    descriptionHi: 'मंगल लग्न (या चन्द्र या शुक्र) से 1, 4, 7, 8 या 12वें भाव में हो। विवाह में तनाव — आधुनिक व्याख्या: उर्जा को सही दिशा देने की आवश्यकता।',
    descriptionTa: 'செவ்வாய் லக்னத்திலிருந்து (அல்லது சந்திரன் அல்லது சுக்கிரனிலிருந்து) 1, 4, 7, 8, அல்லது 12ஆம் வீட்டில் இருக்கும்போது. திருமண வாழ்க்கையில் சவால்கள்.',
    descriptionBn: 'মঙ্গল লগ্ন (বা চাঁদ বা শুক্র) থেকে ১, ৪, ৭, ৮ বা ১২শ ঘরে থাকলে। বিবাহে উত্তেজনা — আধুনিক ব্যাখ্যা: শক্তি চ্যানেলিং প্রয়োজন।',
    conditions: [
      {
        text: 'Mars is placed in the 1st, 4th, 7th, 8th, or 12th house from Lagna',
        textHi: 'मंगल लग्न से 1, 4, 7, 8 या 12वें भाव में हो',
        textTa: 'செவ்வாய் லக்னத்திலிருந்து 1, 4, 7, 8, அல்லது 12ஆம் வீட்டில் இருக்க வேண்டும்',
        textBn: 'মঙ্গল লগ্ন থেকে ১, ৪, ৭, ৮ বা ১২শ ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'No cancellation factors (Mars in own sign, or benefics with Mars, etc.)',
        textHi: 'कोई रद्दीकरण कारक न हो (मंगल स्वराशि में न हो, शुभ ग्रह साथ न हों)',
        textTa: 'நீக்கும் காரணிகள் இல்லாமல் (செவ்வாய் சொந்த ராசியில் இல்லாமல் இருக்க வேண்டும்)',
        textBn: 'বাতিলকারী কারণ না থাকলে (মঙ্গল নিজ রাশিতে না থাকলে)',
        triggeredByStep: [0],
      },
    ],
    planets: [{ planetId: 2, house: 7, fromLagna: true }],
    frequency: '~50% of charts',
    frequencyHi: '~50% कुण्डलियों में',
    accentColor: '#e85050',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
export function getYogasByCategory(category: YogaCategory): YogaAnimation[] {
  return YOGA_ANIMATIONS.filter(y => y.category === category);
}

export function getYogaById(id: string): YogaAnimation | undefined {
  return YOGA_ANIMATIONS.find(y => y.id === id);
}
