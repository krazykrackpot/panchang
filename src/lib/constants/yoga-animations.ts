// Yoga Formation Animator  –  animation data for key Jyotish yogas.
// Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
// Houses are 1-based (1=Lagna). fromLagna=true means house counted from Lagna;
// fromLagna=false means house counted from Moon.

export type YogaCategory = 'mahapurusha' | 'lunar' | 'raja' | 'dhana' | 'dosha' | 'nabhasa';

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
  // Ordered steps  –  planets animate to position one by one
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
  nabhasa: {
    label: { en: 'Nabhasa Yoga', hi: 'नभस योग', ta: 'நபாச யோகம்', bn: 'নভস যোগ' },
    color: '#b080e0',
    glow: 'rgba(176,128,224,0.3)',
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
    descriptionHi: 'बृहस्पति चन्द्र से केन्द्र (चन्द्र से 1, 4, 7 या 10वें भाव) में हो। हाथी जैसी बुद्धि और सिंह जैसी शक्ति  –  प्रसिद्धि और धन देता है।',
    descriptionTa: 'வியாழன் சந்திரனிடமிருந்து கேந்திரத்தில் (1, 4, 7, அல்லது 10ஆம் வீட்டில்) இருக்கும்போது. யானையின் அறிவும் சிங்கத்தின் வலிமையும் கொடுக்கும்.',
    descriptionBn: 'বৃহস্পতি চাঁদ থেকে কেন্দ্রে (১, ৪, ৭, বা ১০ নম্বর ঘরে) থাকলে। হাতির মতো বুদ্ধি ও সিংহের মতো শক্তি  –  খ্যাতি ও সম্পদ প্রদান করে।',
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
    descriptionHi: 'सातों ग्रह (सूर्य से शनि) राहु-केतु के बीच एक ही ओर हों। बाधाएं, विलम्ब और कर्मिक तीव्रता  –  उच्च स्तर पर आध्यात्मिक गहराई भी।',
    descriptionTa: 'ஏழு கிரகங்களும் (சூரியன் முதல் சனி வரை) ராகு-கேது இடையே ஒரு பக்கத்தில் இருக்கும்போது. தடைகள், தாமதங்கள், ஆன்மீக ஆழம்.',
    descriptionBn: 'সাতটি গ্রহ (সূর্য থেকে শনি) রাহু-কেতুর মাঝে একপাশে থাকলে। বাধা, বিলম্ব, কর্মিক তীব্রতা  –  উন্নত স্তরে আধ্যাত্মিক গভীরতা।',
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
    descriptionHi: 'मंगल लग्न (या चन्द्र या शुक्र) से 1, 4, 7, 8 या 12वें भाव में हो। विवाह में तनाव  –  आधुनिक व्याख्या: उर्जा को सही दिशा देने की आवश्यकता।',
    descriptionTa: 'செவ்வாய் லக்னத்திலிருந்து (அல்லது சந்திரன் அல்லது சுக்கிரனிலிருந்து) 1, 4, 7, 8, அல்லது 12ஆம் வீட்டில் இருக்கும்போது. திருமண வாழ்க்கையில் சவால்கள்.',
    descriptionBn: 'মঙ্গল লগ্ন (বা চাঁদ বা শুক্র) থেকে ১, ৪, ৭, ৮ বা ১২শ ঘরে থাকলে। বিবাহে উত্তেজনা  –  আধুনিক ব্যাখ্যা: শক্তি চ্যানেলিং প্রয়োজন।',
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

  // ── Dosha: Guru Chandal ─────────────────────────────────────────────────
  {
    id: 'guru_chandal',
    name: 'Guru Chandal Dosha',
    nameHi: 'गुरु चाण्डाल दोष',
    nameTa: 'குரு சண்டால தோஷம்',
    nameBn: 'গুরু চাণ্ডাল দোষ',
    category: 'dosha',
    classical: 'Phaladeepika / Manasagari',
    description: 'Jupiter is conjunct Rahu in the same house. Rahu\'s shadow corrupts Jupiter\'s wisdom, creating confusion in dharma, unorthodox beliefs, and trouble from misguided teachers or false gurus. Remedied when Jupiter is strong in dignity.',
    descriptionHi: 'बृहस्पति और राहु एक ही भाव में युत हों। राहु की छाया बृहस्पति के ज्ञान को दूषित करती है  –  धर्म में भ्रम, अपरम्परागत विश्वास और गलत गुरुओं से कष्ट। बृहस्पति बली हो तो दोष कम होता है।',
    descriptionTa: 'வியாழன் மற்றும் ராகு ஒரே வீட்டில் இணைந்திருக்கும்போது. ராகுவின் நிழல் வியாழனின் ஞானத்தை கெடுக்கும்  –  தர்மத்தில் குழப்பம், தவறான வழிகாட்டிகள்.',
    descriptionBn: 'বৃহস্পতি ও রাহু একই ঘরে যুক্ত থাকলে। রাহুর ছায়া বৃহস্পতির জ্ঞান দূষিত করে  –  ধর্মে বিভ্রান্তি, মিথ্যা গুরুদের থেকে সমস্যা।',
    conditions: [
      {
        text: 'Jupiter is placed in a house',
        textHi: 'बृहस्पति किसी भाव में स्थित हो',
        textTa: 'வியாழன் ஒரு வீட்டில் இருக்க வேண்டும்',
        textBn: 'বৃহস্পতি একটি ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Rahu is conjunct Jupiter in the same house',
        textHi: 'राहु बृहस्पति के साथ उसी भाव में युत हो',
        textTa: 'ராகு வியாழனுடன் அதே வீட்டில் இணைந்திருக்க வேண்டும்',
        textBn: 'রাহু বৃহস্পতির সাথে একই ঘরে যুক্ত থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 7, house: 5, fromLagna: true },
    ],
    frequency: '~8% of charts',
    frequencyHi: '~8% कुण्डलियों में',
    accentColor: '#e85050',
  },

  // ── Dosha: Pitra Dosha ──────────────────────────────────────────────────
  {
    id: 'pitra_dosha',
    name: 'Pitra Dosha',
    nameHi: 'पितृ दोष',
    nameTa: 'பித்ரு தோஷம்',
    nameBn: 'পিতৃ দোষ',
    category: 'dosha',
    classical: 'BPHS Ch.26 / Lal Kitab',
    description: 'Sun (significator of father and ancestors) is conjunct or aspected by Saturn or Rahu in the 9th house (house of father/fortune). Indicates ancestral karmic debts manifesting as obstacles in fortune, delayed success, and difficulties with father figures.',
    descriptionHi: 'सूर्य (पिता और पितरों का कारक) 9वें भाव में शनि या राहु से युत या दृष्ट हो। पैतृक कर्म ऋण  –  भाग्य में बाधा, विलम्बित सफलता और पिता से कठिनाई।',
    descriptionTa: 'சூரியன் (தந்தை மற்றும் மூதாதையரின் காரகம்) 9ஆம் வீட்டில் சனி அல்லது ராகுவுடன் இணைந்தால் அல்லது பார்வையில் இருந்தால். மூதாதையர் கர்ம கடன்கள்.',
    descriptionBn: 'সূর্য (পিতা ও পূর্বপুরুষদের কারক) ৯ম ঘরে শনি বা রাহুর সাথে যুক্ত বা দৃষ্ট হলে। পৈতৃক কর্ম ঋণ  –  ভাগ্যে বাধা, বিলম্বিত সাফল্য।',
    conditions: [
      {
        text: 'Sun is placed in the 9th house (house of father/fortune)',
        textHi: 'सूर्य 9वें भाव (पिता/भाग्य) में स्थित हो',
        textTa: 'சூரியன் 9ஆம் வீட்டில் (தந்தை/அதிர்ஷ்டம்) இருக்க வேண்டும்',
        textBn: 'সূর্য ৯ম ঘরে (পিতা/ভাগ্য) থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Saturn or Rahu is conjunct Sun in the 9th house',
        textHi: 'शनि या राहु 9वें भाव में सूर्य से युत हो',
        textTa: 'சனி அல்லது ராகு 9ஆம் வீட்டில் சூரியனுடன் இணைந்திருக்க வேண்டும்',
        textBn: 'শনি বা রাহু ৯ম ঘরে সূর্যের সাথে যুক্ত থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 0, house: 9, fromLagna: true },
      { planetId: 6, house: 9, fromLagna: true },
    ],
    frequency: '~12% of charts',
    frequencyHi: '~12% कुण्डलियों में',
    accentColor: '#e85050',
  },

  // ── Dosha: Kalatra Dosha ────────────────────────────────────────────────
  {
    id: 'kalatra_dosha',
    name: 'Kalatra Dosha',
    nameHi: 'कलत्र दोष',
    nameTa: 'களத்திர தோஷம்',
    nameBn: 'কলত্র দোষ',
    category: 'dosha',
    classical: 'BPHS Ch.20 / Saravali',
    description: 'A natural malefic (Mars, Saturn, Rahu, or Ketu) occupies the 7th house (house of spouse/marriage). Creates challenges in partnerships, delayed or troubled marriage, and friction with spouse. Severity depends on which malefic and its dignity.',
    descriptionHi: 'प्राकृतिक पापग्रह (मंगल, शनि, राहु या केतु) 7वें भाव (विवाह/साझेदारी) में हो। विवाह में विलम्ब या कठिनाई, जीवनसाथी से तनाव। गम्भीरता पापग्रह की बल पर निर्भर।',
    descriptionTa: 'இயற்கை தீய கிரகம் (செவ்வாய், சனி, ராகு அல்லது கேது) 7ஆம் வீட்டில் (திருமணம்/கூட்டாண்மை) இருக்கும்போது. திருமணத்தில் தடை, துணையுடன் சிக்கல்கள்.',
    descriptionBn: 'প্রাকৃতিক পাপগ্রহ (মঙ্গল, শনি, রাহু বা কেতু) ৭ম ঘরে (বিবাহ/সঙ্গী) থাকলে। বিবাহে বিলম্ব বা সমস্যা, সঙ্গীর সাথে উত্তেজনা।',
    conditions: [
      {
        text: 'A natural malefic (Mars, Saturn, Rahu, or Ketu) occupies the 7th house',
        textHi: 'प्राकृतिक पापग्रह (मंगल, शनि, राहु या केतु) 7वें भाव में हो',
        textTa: 'இயற்கை தீய கிரகம் (செவ்வாய், சனி, ராகு அல்லது கேது) 7ஆம் வீட்டில் இருக்க வேண்டும்',
        textBn: 'প্রাকৃতিক পাপগ্রহ (মঙ্গল, শনি, রাহু বা কেতু) ৭ম ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'No benefic aspect or conjunction cancels the malefic influence on the 7th',
        textHi: 'कोई शुभ दृष्टि या युति 7वें पर पापग्रह का प्रभाव न मिटाए',
        textTa: 'எந்த சுப பார்வையும் 7ஆம் வீட்டின் மீதான தீய செல்வாக்கை நீக்காமல் இருக்க வேண்டும்',
        textBn: 'কোনো শুভ দৃষ্টি বা যুতি ৭ম ঘরের পাপ প্রভাব নিরসন না করলে',
        triggeredByStep: [0],
      },
    ],
    planets: [{ planetId: 6, house: 7, fromLagna: true }],
    frequency: '~30% of charts',
    frequencyHi: '~30% कुण्डलियों में',
    accentColor: '#e85050',
  },
  // ── Dosha: Shrapit Dosha ─────────────────────────────────────────────────
  {
    id: 'shrapit_dosha',
    name: 'Shrapit Dosha',
    nameHi: 'शापित दोष',
    nameTa: 'சாபித தோஷம்',
    nameBn: 'শাপিত দোষ',
    category: 'dosha',
    classical: 'Manasagari',
    description: 'Saturn and Rahu are conjunct in the same house. Indicates karmic debts from past lives manifesting as chronic obstacles, delays in success, and recurring setbacks. The combined malefic energy of Saturn\'s restriction and Rahu\'s obsession intensifies suffering until remedied.',
    descriptionHi: 'शनि और राहु एक ही भाव में युत हों। पूर्वजन्म के कर्म ऋण  –  स्थायी बाधाएं, सफलता में विलम्ब और बार-बार असफलता। शनि का प्रतिबन्ध और राहु का आवेश मिलकर कष्ट बढ़ाते हैं।',
    descriptionTa: 'சனி மற்றும் ராகு ஒரே வீட்டில் இணைந்திருக்கும்போது. முற்பிறவி கர்ம கடன்கள்  –  நிலையான தடைகள், வெற்றியில் தாமதம், திரும்பத் திரும்ப தோல்விகள்.',
    descriptionBn: 'শনি ও রাহু একই ঘরে যুক্ত থাকলে। পূর্বজন্মের কর্ম ঋণ  –  স্থায়ী বাধা, সাফল্যে বিলম্ব এবং বারবার ব্যর্থতা। শনির বিধিনিষেধ ও রাহুর আবেশ মিলে কষ্ট বাড়ায়।',
    conditions: [
      {
        text: 'Saturn and Rahu are conjunct in the same house',
        textHi: 'शनि और राहु एक ही भाव में युत हों',
        textTa: 'சனி மற்றும் ராகு ஒரே வீட்டில் இணைந்திருக்க வேண்டும்',
        textBn: 'শনি ও রাহু একই ঘরে যুক্ত থাকতে হবে',
        triggeredByStep: [0, 1],
      },
    ],
    planets: [
      { planetId: 6, house: 5, fromLagna: true },
      { planetId: 7, house: 5, fromLagna: true },
    ],
    frequency: '~12% of charts',
    frequencyHi: '~12% कुण्डलियों में',
    accentColor: '#e85050',
  },

  // ── Raja: Neechabhanga Raja Yoga ────────────────────────────────────────
  {
    id: 'neechabhanga_raja',
    name: 'Neechabhanga Raja Yoga',
    nameHi: 'नीचभंग राज योग',
    nameTa: 'நீசபங்க ராஜ யோகம்',
    nameBn: 'নীচভঙ্গ রাজ যোগ',
    category: 'raja',
    classical: 'BPHS Ch.34 v.22',
    description: 'A debilitated planet receives cancellation of debilitation — the lord of the sign where it is debilitated occupies a kendra from lagna or Moon. Turns weakness into extraordinary strength, often producing greater achievement than a normally placed planet.',
    descriptionHi: 'नीच ग्रह का नीचभंग होता है  –  जिस राशि में वह नीच है उसका स्वामी लग्न या चन्द्र से केन्द्र में हो। दुर्बलता असाधारण शक्ति में बदलती है, प्रायः सामान्य स्थिति से भी बड़ी सफलता।',
    descriptionTa: 'நீசமடைந்த கிரகத்தின் நீசம் ரத்தாகும்  –  அது நீசமடையும் ராசியின் அதிபர் லக்னம் அல்லது சந்திரனிலிருந்து கேந்திரத்தில் இருக்கும்போது. பலவீனம் அசாதாரண வலிமையாக மாறும்.',
    descriptionBn: 'নীচ গ্রহের নীচভঙ্গ হয়  –  যে রাশিতে সে নীচ তার স্বামী লগ্ন বা চাঁদ থেকে কেন্দ্রে থাকলে। দুর্বলতা অসাধারণ শক্তিতে পরিণত হয়।',
    conditions: [
      {
        text: 'Planet is debilitated',
        textHi: 'ग्रह नीच राशि में हो',
        textTa: 'கிரகம் நீச ராசியில் இருக்க வேண்டும்',
        textBn: 'গ্রহ নীচ রাশিতে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Lord of debilitation sign is in a kendra from lagna',
        textHi: 'नीच राशि का स्वामी लग्न से केन्द्र में हो',
        textTa: 'நீச ராசியின் அதிபர் லக்னத்திலிருந்து கேந்திரத்தில் இருக்க வேண்டும்',
        textBn: 'নীচ রাশির স্বামী লগ্ন থেকে কেন্দ্রে থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 4, house: 7, fromLagna: true },
      { planetId: 6, house: 10, fromLagna: true },
    ],
    frequency: '~8% of charts',
    frequencyHi: '~8% कुण्डलियों में',
    accentColor: '#d4a853',
  },

  // ── Raja: Viparita Raja Yoga ────────────────────────────────────────────
  {
    id: 'viparita_raja',
    name: 'Viparita Raja Yoga',
    nameHi: 'विपरीत राज योग',
    nameTa: 'விபரீத ராஜ யோகம்',
    nameBn: 'বিপরীত রাজ যোগ',
    category: 'raja',
    classical: 'BPHS Ch.35 v.7',
    description: 'Lords of dusthana houses (6th, 8th, 12th) are placed in other dusthana houses. Adversity paradoxically becomes the source of power — enemies defeat themselves, debts resolve unexpectedly, and losses transform into gains.',
    descriptionHi: 'दुःस्थान (6, 8, 12) के स्वामी अन्य दुःस्थान में हों। विपरीत परिस्थितियां शक्ति का स्रोत बनती हैं  –  शत्रु स्वयं पराजित होते हैं, ऋण अप्रत्याशित रूप से समाप्त होते हैं।',
    descriptionTa: 'துஷ்டான வீடுகளின் (6, 8, 12) அதிபர்கள் மற்ற துஷ்டான வீடுகளில் இருக்கும்போது. பாதகம் விசித்திரமாக சக்தியின் ஆதாரமாகிறது  –  எதிரிகள் தாங்களே தோற்கின்றனர்.',
    descriptionBn: 'দুঃস্থান (৬, ৮, ১২) ঘরের স্বামীরা অন্য দুঃস্থানে থাকলে। প্রতিকূলতা শক্তির উৎস হয়ে ওঠে  –  শত্রুরা নিজেরাই পরাজিত হয়, ঋণ অপ্রত্যাশিতভাবে শেষ হয়।',
    conditions: [
      {
        text: 'Lord of 6th house placed in 8th house',
        textHi: '6वें भाव का स्वामी 8वें भाव में हो',
        textTa: '6ஆம் வீட்டின் அதிபர் 8ஆம் வீட்டில் இருக்க வேண்டும்',
        textBn: '৬ষ্ঠ ঘরের স্বামী ৮ম ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Lord of 8th house placed in 12th house',
        textHi: '8वें भाव का स्वामी 12वें भाव में हो',
        textTa: '8ஆம் வீட்டின் அதிபர் 12ஆம் வீட்டில் இருக்க வேண்டும்',
        textBn: '৮ম ঘরের স্বামী ১২শ ঘরে থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 2, house: 8, fromLagna: true },
      { planetId: 6, house: 12, fromLagna: true },
    ],
    frequency: '~5% of charts',
    frequencyHi: '~5% कुण्डलियों में',
    accentColor: '#d4a853',
  },

  // ── Raja: Chamara Yoga ──────────────────────────────────────────────────
  {
    id: 'chamara',
    name: 'Chamara Yoga',
    nameHi: 'चामर योग',
    nameTa: 'சாமர யோகம்',
    nameBn: 'চামর যোগ',
    category: 'raja',
    classical: 'Phaladeepika Ch.6',
    description: 'The lagna lord is exalted and placed in a kendra house, aspected by Jupiter. Bestows royal honour, fame, eloquence, and respect from authorities. The native commands influence effortlessly.',
    descriptionHi: 'लग्नेश उच्च राशि में केन्द्र में हो और बृहस्पति की दृष्टि हो। राजकीय सम्मान, प्रसिद्धि, वाक्पटुता और अधिकारियों से आदर देता है।',
    descriptionTa: 'லக்ன அதிபர் உச்சத்தில் கேந்திர வீட்டில் இருக்கும்போது, வியாழனின் பார்வையுடன். அரச மரியாதை, புகழ், சொல்வன்மை வழங்கும்.',
    descriptionBn: 'লগ্নেশ উচ্চ রাশিতে কেন্দ্রে থাকলে এবং বৃহস্পতির দৃষ্টি থাকলে। রাজকীয় সম্মান, খ্যাতি, বাগ্মিতা এবং কর্তৃপক্ষের শ্রদ্ধা প্রদান করে।',
    conditions: [
      {
        text: 'Lagna lord in exaltation',
        textHi: 'लग्नेश उच्च राशि में हो',
        textTa: 'லக்ன அதிபர் உச்ச ராசியில் இருக்க வேண்டும்',
        textBn: 'লগ্নেশ উচ্চ রাশিতে থাকতে হবে',
        triggeredByStep: [1],
      },
      {
        text: 'Placed in a kendra house',
        textHi: 'केन्द्र भाव में स्थित हो',
        textTa: 'கேந்திர வீட்டில் இருக்க வேண்டும்',
        textBn: 'কেন্দ্র ঘরে থাকতে হবে',
        triggeredByStep: [1],
      },
      {
        text: 'Aspected by Jupiter',
        textHi: 'बृहस्पति की दृष्टि हो',
        textTa: 'வியாழனின் பார்வை இருக்க வேண்டும்',
        textBn: 'বৃহস্পতির দৃষ্টি থাকতে হবে',
        triggeredByStep: [0],
      },
    ],
    planets: [
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 0, house: 10, fromLagna: true },
    ],
    frequency: '~3% of charts',
    frequencyHi: '~3% कुण्डलियों में',
    accentColor: '#d4a853',
  },

  // ── Lunar: Durdhara Yoga ────────────────────────────────────────────────
  {
    id: 'durdhara',
    name: 'Durdhara Yoga',
    nameHi: 'दुर्धरा योग',
    nameTa: 'துர்தரா யோகம்',
    nameBn: 'দুর্ধরা যোগ',
    category: 'lunar',
    classical: 'Phaladeepika Ch.6 v.5',
    description: 'Planets (other than Sun, Rahu, or Ketu) occupy both the 2nd and 12th houses from the Moon. The Moon is flanked on both sides, creating a powerful combination for wealth, generosity, and comfortable life.',
    descriptionHi: 'सूर्य, राहु और केतु के अतिरिक्त ग्रह चन्द्र से दूसरे और 12वें दोनों भावों में हों। चन्द्र दोनों ओर से ग्रहों द्वारा सुरक्षित  –  धन, उदारता और सुखमय जीवन।',
    descriptionTa: 'சூரியன், ராகு, கேது தவிர வேறு கிரகங்கள் சந்திரனிலிருந்து 2ஆம் மற்றும் 12ஆம் வீடுகளில் இருக்கும்போது. செல்வம், தாராளமனம் மற்றும் வசதியான வாழ்க்கை.',
    descriptionBn: 'সূর্য, রাহু ও কেতু ছাড়া গ্রহ চাঁদ থেকে ২য় ও ১২শ উভয় ঘরে থাকলে। চাঁদ দু\'দিক থেকে রক্ষিত  –  সম্পদ, উদারতা ও স্বাচ্ছন্দ্যময় জীবন।',
    conditions: [
      {
        text: 'Planet in 2nd house from Moon',
        textHi: 'चन्द्र से 2वें भाव में ग्रह हो',
        textTa: 'சந்திரனிலிருந்து 2ஆம் வீட்டில் கிரகம் இருக்க வேண்டும்',
        textBn: 'চাঁদ থেকে ২য় ঘরে গ্রহ থাকতে হবে',
        triggeredByStep: [1],
      },
      {
        text: 'Planet in 12th house from Moon',
        textHi: 'चन्द्र से 12वें भाव में ग्रह हो',
        textTa: 'சந்திரனிலிருந்து 12ஆம் வீட்டில் கிரகம் இருக்க வேண்டும்',
        textBn: 'চাঁদ থেকে ১২শ ঘরে গ্রহ থাকতে হবে',
        triggeredByStep: [2],
      },
      {
        text: 'Neither flanking planet is Sun, Rahu, or Ketu',
        textHi: 'दोनों ओर का ग्रह सूर्य, राहु या केतु न हो',
        textTa: 'இருபுறமும் உள்ள கிரகம் சூரியன், ராகு அல்லது கேது ஆக இருக்கக்கூடாது',
        textBn: 'দু\'পাশের গ্রহ সূর্য, রাহু বা কেতু হওয়া চলবে না',
        triggeredByStep: [1, 2],
      },
    ],
    planets: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 5, house: 5, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
    ],
    frequency: '~15% of charts',
    frequencyHi: '~15% कुण्डलियों में',
    accentColor: '#80b8f0',
  },

  // ── Lunar: Shakata Yoga ─────────────────────────────────────────────────
  {
    id: 'shakata',
    name: 'Shakata Yoga',
    nameHi: 'शकट योग',
    nameTa: 'சகட யோகம்',
    nameBn: 'শকট যোগ',
    category: 'lunar',
    classical: 'Phaladeepika Ch.6 v.8',
    description: 'Moon is placed in the 6th or 8th house from Jupiter. Like a cart (shakata) that rises and falls, this yoga brings fluctuating fortune — alternating periods of prosperity and adversity throughout life.',
    descriptionHi: 'चन्द्र बृहस्पति से 6वें या 8वें भाव में हो। शकट (गाड़ी) की तरह उतार-चढ़ाव  –  जीवन भर समृद्धि और विपत्ति के बारी-बारी काल।',
    descriptionTa: 'சந்திரன் வியாழனிலிருந்து 6ஆம் அல்லது 8ஆம் வீட்டில் இருக்கும்போது. வண்டி போல ஏற்ற இறக்கம்  –  வாழ்நாள் முழுவதும் செழிப்பும் கஷ்டமும் மாறி மாறி வரும்.',
    descriptionBn: 'চাঁদ বৃহস্পতি থেকে ৬ষ্ঠ বা ৮ম ঘরে থাকলে। গাড়ির মতো ওঠানামা  –  জীবনজুড়ে সমৃদ্ধি ও প্রতিকূলতার পর্যায়ক্রমিক কাল।',
    conditions: [
      {
        text: 'Moon in 6th or 8th house from Jupiter',
        textHi: 'चन्द्र बृहस्पति से 6वें या 8वें भाव में हो',
        textTa: 'சந்திரன் வியாழனிலிருந்து 6ஆம் அல்லது 8ஆம் வீட்டில் இருக்க வேண்டும்',
        textBn: 'চাঁদ বৃহস্পতি থেকে ৬ষ্ঠ বা ৮ম ঘরে থাকতে হবে',
        triggeredByStep: [0, 1],
      },
    ],
    planets: [
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 1, house: 6, fromLagna: true },
    ],
    frequency: '~20% of charts',
    frequencyHi: '~20% कुण्डलियों में',
    accentColor: '#80b8f0',
  },

  // ── Lunar: Adhi Yoga ────────────────────────────────────────────────────
  {
    id: 'adhi',
    name: 'Adhi Yoga',
    nameHi: 'अधि योग',
    nameTa: 'அதி யோகம்',
    nameBn: 'অধি যোগ',
    category: 'lunar',
    classical: 'Phaladeepika Ch.6 v.10',
    description: 'Natural benefics (Mercury, Jupiter, Venus) occupy the 6th, 7th, and 8th houses from the Moon. One of the most auspicious yogas — confers commanding position, political power, wealth, and victory over adversaries.',
    descriptionHi: 'प्राकृतिक शुभ ग्रह (बुध, बृहस्पति, शुक्र) चन्द्र से 6, 7 और 8वें भावों में हों। सबसे शुभ योगों में से एक  –  आज्ञाकारी पद, राजनीतिक शक्ति, धन और शत्रुओं पर विजय।',
    descriptionTa: 'இயற்கை சுப கிரகங்கள் (புதன், வியாழன், சுக்கிரன்) சந்திரனிலிருந்து 6, 7, 8ஆம் வீடுகளில் இருக்கும்போது. மிகச் சிறந்த யோகங்களில் ஒன்று  –  ஆணை அதிகாரம், செல்வம்.',
    descriptionBn: 'প্রাকৃতিক শুভ গ্রহ (বুধ, বৃহস্পতি, শুক্র) চাঁদ থেকে ৬, ৭ ও ৮ম ঘরে থাকলে। সবচেয়ে শুভ যোগের একটি  –  আধিপত্য, রাজনৈতিক ক্ষমতা, সম্পদ ও শত্রু-জয়।',
    conditions: [
      {
        text: 'Benefic in 6th from Moon',
        textHi: 'चन्द्र से 6वें भाव में शुभ ग्रह हो',
        textTa: 'சந்திரனிலிருந்து 6ஆம் வீட்டில் சுப கிரகம் இருக்க வேண்டும்',
        textBn: 'চাঁদ থেকে ৬ষ্ঠ ঘরে শুভ গ্রহ থাকতে হবে',
        triggeredByStep: [1],
      },
      {
        text: 'Benefic in 7th from Moon',
        textHi: 'चन्द्र से 7वें भाव में शुभ ग्रह हो',
        textTa: 'சந்திரனிலிருந்து 7ஆம் வீட்டில் சுப கிரகம் இருக்க வேண்டும்',
        textBn: 'চাঁদ থেকে ৭ম ঘরে শুভ গ্রহ থাকতে হবে',
        triggeredByStep: [2],
      },
      {
        text: 'Benefic in 8th from Moon',
        textHi: 'चन्द्र से 8वें भाव में शुभ ग्रह हो',
        textTa: 'சந்திரனிலிருந்து 8ஆம் வீட்டில் சுப கிரகம் இருக்க வேண்டும்',
        textBn: 'চাঁদ থেকে ৮ম ঘরে শুভ গ্রহ থাকতে হবে',
        triggeredByStep: [3],
      },
    ],
    planets: [
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 3, house: 6, fromLagna: true },
      { planetId: 4, house: 7, fromLagna: true },
      { planetId: 5, house: 8, fromLagna: true },
    ],
    frequency: '~5% of charts',
    frequencyHi: '~5% कुण्डलियों में',
    accentColor: '#80b8f0',
  },

  // ── Lunar: Budhaditya Yoga ──────────────────────────────────────────────
  {
    id: 'budhaditya',
    name: 'Budhaditya Yoga',
    nameHi: 'बुधादित्य योग',
    nameTa: 'புதாதித்ய யோகம்',
    nameBn: 'বুধাদিত্য যোগ',
    category: 'lunar',
    classical: 'Phaladeepika Ch.6 v.12',
    description: 'Sun and Mercury are conjunct in the same house. Since Mercury is never more than 28° from the Sun, this is astronomically common, but the yoga gains real potency only when Mercury is not combust (>14° away) and both planets are in a strong house. Bestows sharp intellect, analytical ability, and skill in communication.',
    descriptionHi: 'सूर्य और बुध एक ही भाव में युत हों। बुध सूर्य से 28° से अधिक दूर नहीं होता, अतः यह सामान्य है, किन्तु बुध अस्त न हो (>14°) और दोनों बली भाव में हों तो योग शक्तिशाली। तीक्ष्ण बुद्धि, विश्लेषण और संवाद कौशल।',
    descriptionTa: 'சூரியன் மற்றும் புதன் ஒரே வீட்டில் இணைந்திருக்கும்போது. புதன் சூரியனிடமிருந்து 28°க்கு மேல் விலகாது, எனவே இது சாதாரணம், ஆனால் புதன் அஸ்தமிக்காமல் (>14°) வலுவான வீட்டில் இருந்தால் யோகம் பலமடைகிறது. கூர்மையான அறிவாற்றல்.',
    descriptionBn: 'সূর্য ও বুধ একই ঘরে যুক্ত থাকলে। বুধ সূর্য থেকে ২৮° এর বেশি দূরে থাকে না, তাই এটি সাধারণ, কিন্তু বুধ অস্ত না হলে (>১৪°) এবং দুটি শক্তিশালী ঘরে থাকলে যোগ শক্তিশালী। তীক্ষ্ণ বুদ্ধি ও বিশ্লেষণ ক্ষমতা।',
    conditions: [
      {
        text: 'Sun is placed in a house',
        textHi: 'सूर्य किसी भाव में स्थित हो',
        textTa: 'சூரியன் ஒரு வீட்டில் இருக்க வேண்டும்',
        textBn: 'সূর্য একটি ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Mercury is conjunct Sun in the same house',
        textHi: 'बुध सूर्य के साथ उसी भाव में युत हो',
        textTa: 'புதன் சூரியனுடன் அதே வீட்டில் இணைந்திருக்க வேண்டும்',
        textBn: 'বুধ সূর্যের সাথে একই ঘরে যুক্ত থাকতে হবে',
        triggeredByStep: [1],
      },
    ],
    planets: [
      { planetId: 0, house: 10, fromLagna: true },
      { planetId: 3, house: 10, fromLagna: true },
    ],
    frequency: '~33% of charts',
    frequencyHi: '~33% कुण्डलियों में',
    accentColor: '#80b8f0',
  },

  // ── Lunar: Veshi Yoga ───────────────────────────────────────────────────
  {
    id: 'veshi',
    name: 'Veshi Yoga',
    nameHi: 'वेशी योग',
    nameTa: 'வேசி யோகம்',
    nameBn: 'বেশী যোগ',
    category: 'lunar',
    classical: 'Phaladeepika Ch.6 v.11',
    description: 'A planet other than Moon occupies the 2nd house from the Sun. Confers industriousness, good reputation, balanced temperament, and steady progress in career. The specific planet colouring the result differently.',
    descriptionHi: 'चन्द्र को छोड़कर कोई ग्रह सूर्य से दूसरे भाव में हो। परिश्रमशीलता, अच्छी प्रतिष्ठा, सन्तुलित स्वभाव और कैरियर में स्थिर प्रगति देता है।',
    descriptionTa: 'சந்திரன் தவிர வேறொரு கிரகம் சூரியனிலிருந்து 2ஆம் வீட்டில் இருக்கும்போது. கடினமான உழைப்பு, நற்பெயர், சமநிலை குணம் மற்றும் தொழிலில் நிலையான முன்னேற்றம்.',
    descriptionBn: 'চাঁদ ছাড়া অন্য গ্রহ সূর্য থেকে ২য় ঘরে থাকলে। পরিশ্রমশীলতা, সুনাম, ভারসাম্যপূর্ণ স্বভাব এবং কর্মজীবনে স্থির অগ্রগতি প্রদান করে।',
    conditions: [
      {
        text: 'Planet (not Moon) in 2nd house from Sun',
        textHi: 'चन्द्र को छोड़कर कोई ग्रह सूर्य से 2वें भाव में हो',
        textTa: 'சந்திரன் தவிர வேறொரு கிரகம் சூரியனிலிருந்து 2ஆம் வீட்டில் இருக்க வேண்டும்',
        textBn: 'চাঁদ ছাড়া অন্য গ্রহ সূর্য থেকে ২য় ঘরে থাকতে হবে',
        triggeredByStep: [0, 1],
      },
    ],
    planets: [
      { planetId: 0, house: 5, fromLagna: true },
      { planetId: 2, house: 6, fromLagna: true },
    ],
    frequency: '~30% of charts',
    frequencyHi: '~30% कुण्डलियों में',
    accentColor: '#80b8f0',
  },

  // ── Dhana: Vasumati Yoga ────────────────────────────────────────────────
  {
    id: 'vasumati',
    name: 'Vasumati Yoga',
    nameHi: 'वसुमती योग',
    nameTa: 'வசுமதி யோகம்',
    nameBn: 'বসুমতী যোগ',
    category: 'dhana',
    classical: 'BPHS Ch.36',
    description: 'Natural benefics (Jupiter, Venus, Mercury, full Moon) occupy upachaya houses (3rd, 6th, 10th, 11th) from the Moon. Bestows ever-increasing wealth, material comforts, and financial stability throughout life.',
    descriptionHi: 'प्राकृतिक शुभ ग्रह (बृहस्पति, शुक्र, बुध, पूर्ण चन्द्र) चन्द्र से उपचय भावों (3, 6, 10, 11) में हों। निरन्तर बढ़ता धन, भौतिक सुख और आर्थिक स्थिरता।',
    descriptionTa: 'இயற்கை சுப கிரகங்கள் (வியாழன், சுக்கிரன், புதன், நிறை சந்திரன்) சந்திரனிலிருந்து உபச்சய வீடுகளில் (3, 6, 10, 11) இருக்கும்போது. தொடர்ந்து வளரும் செல்வம்.',
    descriptionBn: 'প্রাকৃতিক শুভ গ্রহ (বৃহস্পতি, শুক্র, বুধ, পূর্ণ চাঁদ) চাঁদ থেকে উপচয় ঘরে (৩, ৬, ১০, ১১) থাকলে। ক্রমবর্ধমান সম্পদ, ভৌতিক সুখ ও আর্থিক স্থিতিশীলতা।',
    conditions: [
      {
        text: 'Benefic in 3rd from Moon',
        textHi: 'चन्द्र से 3रे भाव में शुभ ग्रह हो',
        textTa: 'சந்திரனிலிருந்து 3ஆம் வீட்டில் சுப கிரகம் இருக்க வேண்டும்',
        textBn: 'চাঁদ থেকে ৩য় ঘরে শুভ গ্রহ থাকতে হবে',
        triggeredByStep: [1],
      },
      {
        text: 'Benefic in 6th from Moon',
        textHi: 'चन्द्र से 6वें भाव में शुभ ग्रह हो',
        textTa: 'சந்திரனிலிருந்து 6ஆம் வீட்டில் சுப கிரகம் இருக்க வேண்டும்',
        textBn: 'চাঁদ থেকে ৬ষ্ঠ ঘরে শুভ গ্রহ থাকতে হবে',
        triggeredByStep: [2],
      },
      {
        text: 'Benefic in 10th or 11th from Moon',
        textHi: 'चन्द्र से 10वें या 11वें भाव में शुभ ग्रह हो',
        textTa: 'சந்திரனிலிருந்து 10 அல்லது 11ஆம் வீட்டில் சுப கிரகம் இருக்க வேண்டும்',
        textBn: 'চাঁদ থেকে ১০ম বা ১১শ ঘরে শুভ গ্রহ থাকতে হবে',
        triggeredByStep: [3],
      },
    ],
    planets: [
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 4, house: 3, fromLagna: true },
      { planetId: 5, house: 6, fromLagna: true },
      { planetId: 3, house: 10, fromLagna: true },
    ],
    frequency: '~5% of charts',
    frequencyHi: '~5% कुण्डलियों में',
    accentColor: '#40c880',
  },

  // ── Dhana: Amala Yoga ───────────────────────────────────────────────────
  {
    id: 'amala',
    name: 'Amala Yoga',
    nameHi: 'अमल योग',
    nameTa: 'அமல யோகம்',
    nameBn: 'অমল যোগ',
    category: 'dhana',
    classical: 'Phaladeepika Ch.6',
    description: 'A natural benefic (Jupiter, Venus, Mercury, or Moon) occupies the 10th house from lagna. The word "amala" means spotless — this yoga confers an unblemished reputation, charitable nature, and prosperity through righteous action.',
    descriptionHi: 'प्राकृतिक शुभ ग्रह (बृहस्पति, शुक्र, बुध या चन्द्र) लग्न से 10वें भाव में हो। "अमल" अर्थात निर्मल  –  निष्कलंक प्रतिष्ठा, दानशीलता और धर्मपूर्ण कार्य से समृद्धि।',
    descriptionTa: 'இயற்கை சுப கிரகம் (வியாழன், சுக்கிரன், புதன் அல்லது சந்திரன்) லக்னத்திலிருந்து 10ஆம் வீட்டில் இருக்கும்போது. "அமல" என்றால் களங்கமற்ற  –  நற்பெயர், கொடையாளி இயல்பு.',
    descriptionBn: 'প্রাকৃতিক শুভ গ্রহ (বৃহস্পতি, শুক্র, বুধ বা চাঁদ) লগ্ন থেকে ১০ম ঘরে থাকলে। "অমল" অর্থাৎ নিষ্কলঙ্ক  –  কলঙ্কহীন সুনাম, দানশীলতা ও ধর্মপূর্ণ কর্মে সমৃদ্ধি।',
    conditions: [
      {
        text: 'Natural benefic (Jupiter, Venus, Mercury, Moon) in 10th house from Lagna',
        textHi: 'प्राकृतिक शुभ ग्रह (बृहस्पति, शुक्र, बुध, चन्द्र) लग्न से 10वें भाव में हो',
        textTa: 'இயற்கை சுப கிரகம் (வியாழன், சுக்கிரன், புதன், சந்திரன்) லக்னத்திலிருந்து 10ஆம் வீட்டில் இருக்க வேண்டும்',
        textBn: 'প্রাকৃতিক শুভ গ্রহ (বৃহস্পতি, শুক্র, বুধ, চাঁদ) লগ্ন থেকে ১০ম ঘরে থাকতে হবে',
        triggeredByStep: [0],
      },
    ],
    planets: [{ planetId: 4, house: 10, fromLagna: true }],
    frequency: '~15% of charts',
    frequencyHi: '~15% कुण्डलियों में',
    accentColor: '#40c880',
  },

  // ── Nabhasa: Yupa Yoga ──────────────────────────────────────────────────
  {
    id: 'yupa',
    name: 'Yupa Yoga',
    nameHi: 'यूप योग',
    nameTa: 'யூப யோகம்',
    nameBn: 'যূপ যোগ',
    category: 'nabhasa',
    classical: 'BPHS Ch.35',
    description: 'All seven classical planets (Sun through Saturn) are confined to houses 1 through 4 — the first quadrant of the chart. Named after the sacrificial post (yupa), this yoga gives a person known for philanthropy, spiritual depth, and fame through selfless service.',
    descriptionHi: 'सातों शास्त्रीय ग्रह (सूर्य से शनि) 1 से 4 भावों  –  कुण्डली के प्रथम चतुर्थांश  –  में सीमित हों। यज्ञ स्तम्भ (यूप) के नाम पर  –  दानशीलता, आध्यात्मिक गहराई और निस्वार्थ सेवा से प्रसिद्धि।',
    descriptionTa: 'ஏழு சாஸ்திரிய கிரகங்களும் (சூரியன் முதல் சனி வரை) 1 முதல் 4 வீடுகளில்  –  ஜாதகத்தின் முதல் காலாண்டில்  –  அடங்கியிருக்கும்போது. யாக ஸ்தம்பத்தின் பெயரில்  –  கொடை, ஆன்மீக ஆழம்.',
    descriptionBn: 'সাতটি শাস্ত্রীয় গ্রহ (সূর্য থেকে শনি) ১ থেকে ৪ ঘরে  –  কুণ্ডলীর প্রথম চতুর্থাংশে  –  সীমাবদ্ধ থাকলে। যজ্ঞ স্তম্ভের (যূপ) নামে  –  দানশীলতা, আধ্যাত্মিক গভীরতা ও নিঃস্বার্থ সেবায় খ্যাতি।',
    conditions: [
      {
        text: 'All 7 classical planets in houses 1 through 4',
        textHi: 'सातों शास्त्रीय ग्रह 1 से 4 भावों में हों',
        textTa: 'ஏழு சாஸ்திரிய கிரகங்களும் 1 முதல் 4 வீடுகளில் இருக்க வேண்டும்',
        textBn: 'সাতটি শাস্ত্রীয় গ্রহ ১ থেকে ৪ ঘরে থাকতে হবে',
        triggeredByStep: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    planets: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 2, house: 2, fromLagna: true },
      { planetId: 3, house: 2, fromLagna: true },
      { planetId: 4, house: 3, fromLagna: true },
      { planetId: 5, house: 3, fromLagna: true },
      { planetId: 6, house: 4, fromLagna: true },
    ],
    frequency: '~1% of charts',
    frequencyHi: '~1% कुण्डलियों में',
    accentColor: '#b080e0',
  },

  // ── Nabhasa: Rajju Yoga ─────────────────────────────────────────────────
  {
    id: 'rajju',
    name: 'Rajju Yoga',
    nameHi: 'रज्जु योग',
    nameTa: 'ரஜ்ஜு யோகம்',
    nameBn: 'রজ্জু যোগ',
    category: 'nabhasa',
    classical: 'BPHS Ch.35',
    description: 'All seven classical planets occupy movable signs (Aries, Cancer, Libra, Capricorn — houses 1, 4, 7, 10 in the natural zodiac). Named after a rope (rajju), this rare yoga gives a love of travel, restlessness, and a life of constant movement and adventure.',
    descriptionHi: 'सातों शास्त्रीय ग्रह चर राशियों (मेष, कर्क, तुला, मकर) में हों। रस्सी (रज्जु) के नाम पर  –  यात्रा प्रेम, अस्थिरता और निरन्तर गतिशीलता एवं साहसिक जीवन।',
    descriptionTa: 'ஏழு சாஸ்திரிய கிரகங்களும் சர ராசிகளில் (மேஷம், கடகம், துலாம், மகரம்) இருக்கும்போது. கயிறின் (ரஜ்ஜு) பெயரில்  –  பயண ஆர்வம், சஞ்சலம், தொடர்ச்சியான இயக்கம்.',
    descriptionBn: 'সাতটি শাস্ত্রীয় গ্রহ চর রাশিতে (মেষ, কর্কট, তুলা, মকর) থাকলে। দড়ির (রজ্জু) নামে  –  ভ্রমণ প্রিয়, অস্থিরতা এবং ক্রমাগত গতিশীলতা ও সাহসিক জীবন।',
    conditions: [
      {
        text: 'All 7 classical planets in movable signs (Aries, Cancer, Libra, Capricorn)',
        textHi: 'सातों शास्त्रीय ग्रह चर राशियों (मेष, कर्क, तुला, मकर) में हों',
        textTa: 'ஏழு சாஸ்திரிய கிரகங்களும் சர ராசிகளில் (மேஷம், கடகம், துலாம், மகரம்) இருக்க வேண்டும்',
        textBn: 'সাতটি শাস্ত্রীয় গ্রহ চর রাশিতে (মেষ, কর্কট, তুলা, মকর) থাকতে হবে',
        triggeredByStep: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    planets: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 2, house: 7, fromLagna: true },
      { planetId: 3, house: 10, fromLagna: true },
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 5, house: 4, fromLagna: true },
      { planetId: 6, house: 7, fromLagna: true },
    ],
    frequency: '~0.5% of charts',
    frequencyHi: '~0.5% कुण्डलियों में',
    accentColor: '#b080e0',
  },

  // ── Raja: Pravrajya Yoga ────────────────────────────────────────────────
  {
    id: 'pravrajya',
    name: 'Pravrajya Yoga',
    nameHi: 'प्रव्रज्या योग',
    nameTa: 'ப்ரவ்ரஜ்யா யோகம்',
    nameBn: 'প্রব্রজ্যা যোগ',
    category: 'raja',
    classical: 'BPHS Ch.35',
    description: 'Four or more planets conjunct in a single house, with the 10th lord among them. Indicates a powerful renunciant or spiritual leader — someone who abandons worldly life for a higher calling and commands a following through asceticism or teaching.',
    descriptionHi: 'चार या अधिक ग्रह एक ही भाव में युत हों और 10वें भाव का स्वामी उनमें हो। शक्तिशाली संन्यासी या आध्यात्मिक नेता  –  सांसारिक जीवन त्यागकर उच्च उद्देश्य के लिए जीने वाला।',
    descriptionTa: 'நான்கு அல்லது அதற்கு மேற்பட்ட கிரகங்கள் ஒரே வீட்டில் இணைந்திருக்கும்போது, 10ஆம் வீட்டின் அதிபர் அவர்களில் ஒருவராக. சக்திவாய்ந்த துறவி அல்லது ஆன்மீக தலைவர்.',
    descriptionBn: 'চার বা তার বেশি গ্রহ একই ঘরে যুক্ত এবং ১০ম ঘরের স্বামী তাদের মধ্যে থাকলে। শক্তিশালী সন্ন্যাসী বা আধ্যাত্মিক নেতা  –  পার্থিব জীবন ত্যাগ করে উচ্চতর লক্ষ্যে জীবনযাপন।',
    conditions: [
      {
        text: '4 or more planets conjunct',
        textHi: '4 या अधिक ग्रह एक ही भाव में युत हों',
        textTa: '4 அல்லது அதற்கு மேற்பட்ட கிரகங்கள் ஒரே வீட்டில் இணைந்திருக்க வேண்டும்',
        textBn: '৪টি বা তার বেশি গ্রহ একই ঘরে যুক্ত থাকতে হবে',
        triggeredByStep: [0, 1, 2, 3],
      },
      {
        text: '10th lord among them',
        textHi: '10वें भाव का स्वामी उनमें से एक हो',
        textTa: '10ஆம் வீட்டின் அதிபர் அவர்களில் ஒருவராக இருக்க வேண்டும்',
        textBn: '১০ম ঘরের স্বামী তাদের মধ্যে থাকতে হবে',
        triggeredByStep: [0],
      },
    ],
    planets: [
      { planetId: 6, house: 10, fromLagna: true },
      { planetId: 4, house: 10, fromLagna: true },
      { planetId: 2, house: 10, fromLagna: true },
      { planetId: 0, house: 10, fromLagna: true },
    ],
    frequency: '~3% of charts',
    frequencyHi: '~3% कुण्डलियों में',
    accentColor: '#d4a853',
  },

  // ── Dhana: Saraswati Yoga ───────────────────────────────────────────────
  {
    id: 'saraswati',
    name: 'Saraswati Yoga',
    nameHi: 'सरस्वती योग',
    nameTa: 'சரஸ்வதி யோகம்',
    nameBn: 'সরস্বতী যোগ',
    category: 'dhana',
    classical: 'Phaladeepika Ch.6',
    description: 'Jupiter, Venus, and Mercury all occupy kendra (1, 4, 7, 10) or trikona (1, 5, 9) houses. Named after Goddess Saraswati, this yoga bestows extraordinary learning, mastery of arts and sciences, eloquence, and literary fame.',
    descriptionHi: 'बृहस्पति, शुक्र और बुध तीनों केन्द्र (1, 4, 7, 10) या त्रिकोण (1, 5, 9) भावों में हों। देवी सरस्वती के नाम पर  –  असाधारण विद्या, कला-विज्ञान में निपुणता, वाक्पटुता और साहित्यिक प्रसिद्धि।',
    descriptionTa: 'வியாழன், சுக்கிரன் மற்றும் புதன் அனைத்தும் கேந்திர (1, 4, 7, 10) அல்லது திரிகோண (1, 5, 9) வீடுகளில் இருக்கும்போது. சரஸ்வதி தேவியின் பெயரில்  –  அசாதாரண கல்வி, கலை-அறிவியல் திறன், சொல்வன்மை.',
    descriptionBn: 'বৃহস্পতি, শুক্র ও বুধ তিনটিই কেন্দ্র (১, ৪, ৭, ১০) বা ত্রিকোণ (১, ৫, ৯) ঘরে থাকলে। দেবী সরস্বতীর নামে  –  অসাধারণ বিদ্যা, শিল্প-বিজ্ঞানে দক্ষতা, বাগ্মিতা ও সাহিত্যিক খ্যাতি।',
    conditions: [
      {
        text: 'Jupiter in kendra or trikona',
        textHi: 'बृहस्पति केन्द्र या त्रिकोण में हो',
        textTa: 'வியாழன் கேந்திரம் அல்லது திரிகோணத்தில் இருக்க வேண்டும்',
        textBn: 'বৃহস্পতি কেন্দ্র বা ত্রিকোণে থাকতে হবে',
        triggeredByStep: [0],
      },
      {
        text: 'Venus in kendra or trikona',
        textHi: 'शुक्र केन्द्र या त्रिकोण में हो',
        textTa: 'சுக்கிரன் கேந்திரம் அல்லது திரிகோணத்தில் இருக்க வேண்டும்',
        textBn: 'শুক্র কেন্দ্র বা ত্রিকোণে থাকতে হবে',
        triggeredByStep: [1],
      },
      {
        text: 'Mercury in kendra or trikona',
        textHi: 'बुध केन्द्र या त्रिकोण में हो',
        textTa: 'புதன் கேந்திரம் அல்லது திரிகோணத்தில் இருக்க வேண்டும்',
        textBn: 'বুধ কেন্দ্র বা ত্রিকোণে থাকতে হবে',
        triggeredByStep: [2],
      },
    ],
    planets: [
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 5, house: 5, fromLagna: true },
      { planetId: 3, house: 9, fromLagna: true },
    ],
    frequency: '~8% of charts',
    frequencyHi: '~8% कुण्डलियों में',
    accentColor: '#40c880',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
export function getYogasByCategory(category: YogaCategory): YogaAnimation[] {
  return YOGA_ANIMATIONS.filter(y => y.category === category);
}

export function getYogaById(id: string): YogaAnimation | undefined {
  return YOGA_ANIMATIONS.find(y => y.id === id);
}
