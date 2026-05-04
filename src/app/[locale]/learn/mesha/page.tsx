'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import ClassicalReference from '@/components/learn/ClassicalReference';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import { Link } from '@/lib/i18n/navigation';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

// ─── Multilingual helper ───────────────────────────────────────────────
type ML = Record<string, string>;
function useML(locale: string) {
  return (obj: ML) => obj[locale] || obj.en || '';
}

// ─── Sanskrit Terms ────────────────────────────────────────────────────
const TERMS = [
  { devanagari: 'मेष', transliteration: 'Mesha', meaning: { en: 'The Ram — first sign of the zodiac, symbol of initiative and new beginnings', hi: 'मेष — राशि चक्र का प्रथम चिह्न, पहल और नवारम्भ का प्रतीक' } },
  { devanagari: 'अग्नि तत्त्व', transliteration: 'Agni Tattva', meaning: { en: 'Fire element — the transformative, energetic principle governing Mesha', hi: 'अग्नि तत्त्व — मेष को संचालित करने वाला रूपान्तरकारी, ऊर्जावान सिद्धान्त' } },
  { devanagari: 'चर राशि', transliteration: 'Chara Rashi', meaning: { en: 'Cardinal/movable sign — initiates action, begins new cycles', hi: 'चर राशि — कर्म आरम्भ करने वाली, नवीन चक्र प्रारम्भ करने वाली' } },
  { devanagari: 'कुज क्षेत्र', transliteration: 'Kuja Kshetra', meaning: { en: 'Domain of Mars — Mesha is the diurnal home and moolatrikona of Mars', hi: 'कुज का क्षेत्र — मेष मंगल का दिवसीय गृह और मूलत्रिकोण' } },
  { devanagari: 'क्षत्रिय', transliteration: 'Kshatriya', meaning: { en: 'The warrior class — Mesha embodies the protective, courageous warrior archetype', hi: 'क्षत्रिय वर्ण — मेष रक्षक, साहसी योद्धा का मूलरूप' } },
  { devanagari: 'उच्च सूर्य', transliteration: 'Uchcha Surya', meaning: { en: 'Exalted Sun — the Sun reaches its highest dignity at 10° Mesha', hi: 'उच्च सूर्य — सूर्य 10° मेष पर अपनी सर्वोच्च गरिमा पाता है' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Fire (Agni)', hi: 'अग्नि तत्त्व' },
  modality: { en: 'Cardinal (Chara)', hi: 'चर (Cardinal)' },
  gender: { en: 'Masculine (Purusha)', hi: 'पुरुष (पुल्लिंग)' },
  ruler: { en: 'Mars (Mangal)', hi: 'मंगल (कुज)' },
  symbol: { en: 'The Ram', hi: 'मेष (मेंढ़ा)' },
  degreeRange: { en: '0° to 30° of the zodiac', hi: 'राशि चक्र का 0° से 30°' },
  direction: { en: 'East (Purva)', hi: 'पूर्व दिशा' },
  season: { en: 'Vasanta (Spring)', hi: 'वसन्त ऋतु' },
  color: { en: 'Blood red / Scarlet', hi: 'रक्त लाल / सिन्दूरी' },
  bodyPart: { en: 'Head, face, brain, upper jaw', hi: 'मस्तक, मुख, मस्तिष्क, ऊपरी जबड़ा' },
  caste: { en: 'Kshatriya (Warrior)', hi: 'क्षत्रिय' },
  nature: { en: 'Krura (Cruel/Aggressive)', hi: 'क्रूर (आक्रामक)' },
};

// ─── Nakshatras in Mesha ───────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Ashwini', hi: 'अश्विनी' },
    range: { en: '0° - 13°20\' Mesha', hi: '0° - 13°20\' मेष' },
    ruler: { en: 'Ketu', hi: 'केतु' },
    deity: { en: 'Ashwini Kumaras (Divine Physicians)', hi: 'अश्विनी कुमार (दैवीय चिकित्सक)' },
    qualities: { en: 'Speed, healing, new beginnings, horse-like swiftness. The twins who heal — this nakshatra gives natural medical talent, rapid recovery from illness, and the ability to start fresh. People born here are quick-witted, charming, and always on the move. They are the sprinters of the zodiac, excelling at initiating but sometimes lacking follow-through.', hi: 'गति, चिकित्सा, नवारम्भ, अश्व सदृश तीव्रता। चिकित्सक जुड़वाँ — यह नक्षत्र स्वाभाविक चिकित्सा प्रतिभा, शीघ्र रोग मुक्ति और पुनः आरम्भ की क्षमता देता है। यहाँ जन्मे लोग तीक्ष्ण बुद्धि, आकर्षक और सदा गतिशील होते हैं।' },
  },
  {
    name: { en: 'Bharani', hi: 'भरणी' },
    range: { en: '13°20\' - 26°40\' Mesha', hi: '13°20\' - 26°40\' मेष' },
    ruler: { en: 'Venus', hi: 'शुक्र' },
    deity: { en: 'Yama (God of Death and Dharma)', hi: 'यम (मृत्यु और धर्म के देवता)' },
    qualities: { en: 'Restraint, transformation, sexuality, bearing the unbearable. Ruled by Venus in Mars\'s sign — the eternal tension between desire and duty. Bharani natives carry heavy responsibilities with grace. They understand life-death cycles deeply and are drawn to taboo subjects. Tremendous creative and procreative energy. They can be intensely sexual, fiercely protective of family, and relentless workers.', hi: 'संयम, रूपान्तरण, कामुकता, असहनीय को सहना। मंगल की राशि में शुक्र शासित — इच्छा और कर्तव्य का शाश्वत तनाव। भरणी जातक भारी उत्तरदायित्व गरिमा से वहन करते हैं। जीवन-मृत्यु चक्र की गहन समझ। अपार सृजनात्मक और प्रजनन ऊर्जा।' },
  },
  {
    name: { en: 'Krittika (Pada 1)', hi: 'कृत्तिका (पाद 1)' },
    range: { en: '26°40\' - 30° Mesha', hi: '26°40\' - 30° मेष' },
    ruler: { en: 'Sun', hi: 'सूर्य' },
    deity: { en: 'Agni (God of Fire)', hi: 'अग्नि देव' },
    qualities: { en: 'Cutting, purification, nourishment through fire, sharp intelligence. Only the first pada falls in Mesha, combining Mars\'s initiative with the Sun\'s authority. This is the sharpest, most incisive portion of Aries — the blade that cuts through illusion. Natives have penetrating eyes, commanding presence, and an ability to see through deception. They can be harshly critical but always truthful.', hi: 'छेदन, शुद्धिकरण, अग्नि द्वारा पोषण, तीक्ष्ण बुद्धि। केवल प्रथम पाद मेष में — मंगल की पहल और सूर्य का अधिकार। मेष का सबसे तीक्ष्ण, सबसे प्रखर भाग — भ्रम को काटने वाली धार। भेदक दृष्टि, आधिकारिक उपस्थिति।' },
  },
];

// ─── Planetary Dignities ───────────────────────────────────────────────
const PLANETARY_DIGNITIES = {
  exalted: [
    { planet: { en: 'Sun (Surya)', hi: 'सूर्य' }, degree: { en: '10° Mesha', hi: '10° मेष' }, effect: { en: 'The king on his throne — maximum authority, vitality, and leadership. The Sun\'s exaltation in Aries makes this the most powerful placement for solar energy. The native radiates confidence, commands respect naturally, and possesses exceptional willpower. Government positions, leadership roles, and positions of authority come easily.', hi: 'सिंहासन पर राजा — अधिकतम अधिकार, प्राणशक्ति और नेतृत्व। मेष में सूर्य का उच्च सौर ऊर्जा के लिए सर्वाधिक शक्तिशाली स्थिति। जातक आत्मविश्वास बिखेरता है, स्वाभाविक सम्मान प्राप्त करता है।' } },
  ],
  debilitated: [
    { planet: { en: 'Saturn (Shani)', hi: 'शनि' }, degree: { en: '20° Mesha', hi: '20° मेष' }, effect: { en: 'The slow, methodical planet in the sign of impulsive speed — Saturn struggles here. Discipline and patience are weakened. The native may start many projects but lack the endurance to finish them. Authority figures may be unreliable. Delays and frustrations arise from premature action. However, Neecha Bhanga Raja Yoga can transform this into exceptional achievement through overcoming adversity.', hi: 'आवेगी गति की राशि में धीमा, व्यवस्थित ग्रह — शनि यहाँ संघर्ष करता है। अनुशासन और धैर्य दुर्बल। जातक अनेक कार्य आरम्भ करे किन्तु पूर्ण करने की सहनशक्ति की कमी। नीच भंग राज योग प्रतिकूलता पर विजय से असाधारण उपलब्धि।' } },
  ],
  ownSign: [
    { planet: { en: 'Mars (Mangal)', hi: 'मंगल' }, range: { en: '0° - 30° (full sign, moolatrikona 0°-12°)', hi: '0° - 30° (पूर्ण राशि, मूलत्रिकोण 0°-12°)' }, effect: { en: 'The warrior in his own fortress. Mars rules Mesha and has moolatrikona here from 0° to 12°. In this range Mars gives disciplined aggression, strategic courage, and natural command. The native is a born leader with physical vitality, competitive drive, and the courage to act first. From 12° to 30° Mars is still in own sign but with slightly less focused martial energy.', hi: 'योद्धा अपने दुर्ग में। मंगल मेष का स्वामी है और 0° से 12° मूलत्रिकोण। इस सीमा में मंगल अनुशासित आक्रामकता, रणनीतिक साहस और स्वाभाविक आदेश देता है। जातक जन्मजात नेता — शारीरिक प्राणशक्ति और प्रतिस्पर्धी प्रेरणा।' } },
  ],
};

// ─── Each Planet in Mesha ──────────────────────────────────────────────
const PLANETS_IN_SIGN: { planet: ML; dignity: string; effect: ML }[] = [
  {
    planet: { en: 'Sun (Surya)', hi: 'सूर्य' },
    dignity: 'Exalted (10°)',
    effect: { en: 'The Sun is exalted in Aries — this is the king ascending his throne at the dawn of the zodiac. Maximum confidence, vitality, and natural authority. The native radiates leadership without effort, possesses iron willpower, and often rises to positions of power in government, military, or corporate hierarchies. Physical constitution is robust with strong bones and excellent recovery from illness. The father is typically a strong, authoritative figure. Can be imperious, domineering, and intolerant of weakness in others. The 10° degree point is where solar energy reaches its absolute peak — natives born with Sun at exactly this degree often have a destiny tied to public leadership.', hi: 'सूर्य मेष में उच्च — राशि चक्र के प्रारम्भ में सिंहासनारूढ़ राजा। अधिकतम आत्मविश्वास, प्राणशक्ति और स्वाभाविक अधिकार। जातक बिना प्रयास नेतृत्व बिखेरता है, लौह संकल्प शक्ति रखता है। शासन, सेना या निगम पदानुक्रम में सत्ता के पदों पर आसीन। शारीरिक संरचना सुदृढ़। पिता प्रायः सशक्त, आधिकारिक व्यक्तित्व। 10° अंश पर सौर ऊर्जा चरम — इस अंश पर जन्मे जातकों का भाग्य प्रायः सार्वजनिक नेतृत्व से जुड़ा।' },
  },
  {
    planet: { en: 'Moon (Chandra)', hi: 'चन्द्रमा' },
    dignity: 'Neutral',
    effect: { en: 'The Moon in Mars\'s fiery sign produces emotionally impulsive, instinctively courageous natives. Feelings are expressed immediately and with intensity — anger flares fast but also subsides quickly. The mother may have a martial or independent character. Emotional needs center on action, independence, and being first. The native dislikes waiting and processes emotions through physical activity. Excellent emotional resilience — they bounce back from setbacks faster than any other Moon sign. Can be emotionally selfish, impatient with others\' feelings, and prone to making decisions based on adrenaline rather than reflection.', hi: 'मंगल की अग्नि राशि में चन्द्रमा भावनात्मक रूप से आवेगी, सहज साहसी जातक बनाता है। भावनाएँ तुरन्त और तीव्रता से व्यक्त — क्रोध शीघ्र भड़कता और शान्त भी होता है। माता का स्वभाव स्वतन्त्र या योद्धा सदृश। भावनात्मक आवश्यकताएँ कर्म, स्वतन्त्रता और अग्रणी रहने पर केन्द्रित। असाधारण भावनात्मक लचीलापन — किसी भी अन्य चन्द्र राशि से शीघ्र सामान्य।' },
  },
  {
    planet: { en: 'Mars (Mangal)', hi: 'मंगल' },
    dignity: 'Own sign / Moolatrikona (0°-12°)',
    effect: { en: 'Mars in its own sign and moolatrikona is the warrior in his fortress — maximum energy, initiative, courage, and competitive drive. The native is a natural leader who thrives in crisis, makes quick decisions, and possesses remarkable physical strength and fearlessness. The 0°-12° moolatrikona range gives the purest martial expression: disciplined aggression rather than blind rage. Beyond 12° the energy is still strong but less focused. Excellent for military careers, entrepreneurship, surgery, sports, and any field requiring raw courage. Can be impulsive, aggressive, and accident-prone when Mars is afflicted here.', hi: 'मंगल स्वराशि और मूलत्रिकोण में योद्धा अपने दुर्ग में — अधिकतम ऊर्जा, पहल, साहस और प्रतिस्पर्धी प्रेरणा। जातक स्वाभाविक नेता जो संकट में फलता-फूलता है। 0°-12° मूलत्रिकोण सबसे शुद्ध सैनिक अभिव्यक्ति: अन्धे क्रोध के बजाय अनुशासित आक्रामकता। सेना, उद्यमिता, शल्य चिकित्सा, खेल के लिए उत्कृष्ट। पीड़ित मंगल आवेगी और दुर्घटनाग्रस्त।' },
  },
  {
    planet: { en: 'Mercury (Budha)', hi: 'बुध' },
    dignity: 'Enemy\'s sign',
    effect: { en: 'Mercury in Mars\'s sign produces rapid, aggressive thinking — the mind works like a tactical computer rather than a philosophical contemplator. Speech is direct, blunt, and sometimes cutting. The native excels at quick calculations, competitive debates, and technical problem-solving but may lack patience for deep, nuanced analysis. Writing style is punchy and action-oriented. Siblings may be competitive or combative. Good for military intelligence, sports commentary, technical sales, and emergency medicine. The analytical planet in an impulsive sign can create mental restlessness and a tendency to jump to conclusions.', hi: 'मंगल की राशि में बुध तीव्र, आक्रामक चिन्तन — मस्तिष्क दार्शनिक चिन्तक के बजाय सामरिक संगणक। वाणी प्रत्यक्ष, स्पष्ट, कभी-कभी तीक्ष्ण। शीघ्र गणना, प्रतिस्पर्धी वाद-विवाद और तकनीकी समस्या-समाधान में उत्कृष्ट। गहन विश्लेषण के लिए धैर्य की कमी। सैन्य गुप्तचर, खेल टीकाकार, तकनीकी विक्रय के लिए शुभ।' },
  },
  {
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु (बृहस्पति)' },
    dignity: 'Neutral',
    effect: { en: 'Jupiter in Aries combines wisdom with initiative — the guru who acts rather than merely teaches. The native has strong moral convictions and the courage to defend them publicly. Religious or philosophical beliefs are held passionately, sometimes dogmatically. Teaching style is energetic and inspiring rather than patient and methodical. Excellent for religious leadership, motivational speaking, and pioneering educational reforms. Children may be born with strong, independent characters. Wealth comes through bold ventures rather than steady accumulation. The expansive planet in an initiating sign produces people who start movements, found institutions, and champion new philosophies.', hi: 'मेष में गुरु ज्ञान और पहल का संयोग — कर्मशील गुरु जो केवल शिक्षा नहीं देता बल्कि कर्म करता है। सशक्त नैतिक विश्वास और सार्वजनिक रक्षा का साहस। धार्मिक या दार्शनिक मान्यताएँ उत्कट, कभी-कभी हठधर्मी। धार्मिक नेतृत्व, प्रेरक वक्तृत्व और अग्रणी शैक्षिक सुधारों के लिए उत्कृष्ट। धन साहसिक उद्यमों से।' },
  },
  {
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र' },
    dignity: 'Neutral',
    effect: { en: 'Venus in Mars\'s sign creates passionate, aggressive romance — love is pursued like a conquest. The native falls in love quickly and intensely, with physical attraction being the primary driver. Artistic expression has a bold, fiery quality — action painting, passionate music, dynamic dance. Marriage may come early or impulsively. The native values independence in relationships and may struggle with the compromises partnership requires. Wealth is earned through competitive creative fields — fashion, sports entertainment, luxury goods marketing. Can indicate a spouse with martial or athletic qualities. Beauty is seen in strength and vitality rather than delicate refinement.', hi: 'मंगल की राशि में शुक्र उत्कट, आक्रामक प्रेम — प्रेम विजय की भाँति। जातक शीघ्र और तीव्रता से प्रेम करता है। कलात्मक अभिव्यक्ति साहसी, अग्निमय — कर्मशील चित्रकला, भावुक संगीत। विवाह शीघ्र या आवेगी। सम्बन्धों में स्वतन्त्रता मूल्यवान। प्रतिस्पर्धी सृजनात्मक क्षेत्रों से धन अर्जन।' },
  },
  {
    planet: { en: 'Saturn (Shani)', hi: 'शनि' },
    dignity: 'Debilitated (20°)',
    effect: { en: 'Saturn is debilitated in Aries — the slow, methodical planet in the sign of impulsive speed. Discipline, patience, and long-term planning are weakened. The native starts many projects with enthusiasm but struggles to sustain effort through the tedious middle phases. Authority structures may feel oppressive, leading to rebellion against bosses, institutions, and tradition. Bones and joints, especially in the head and face, may be weak. However, Neecha Bhanga Raja Yoga — when the debilitation is cancelled by specific planetary configurations — can transform this weakness into extraordinary achievement through overcoming adversity. The native who masters Saturn in Aries becomes unstoppable because they have learned both speed and endurance.', hi: 'शनि मेष में नीच — आवेगी गति की राशि में धीमा, व्यवस्थित ग्रह। अनुशासन, धैर्य और दीर्घकालिक योजना दुर्बल। जातक उत्साह से अनेक कार्य आरम्भ किन्तु मध्य चरण में सहनशक्ति की कमी। अधिकार संरचनाएँ दमनकारी — विद्रोह। नीच भंग राज योग प्रतिकूलता पर विजय से असाधारण उपलब्धि। शनि पर विजय पाने वाला अजेय।' },
  },
  {
    planet: { en: 'Rahu', hi: 'राहु' },
    dignity: 'Neutral',
    effect: { en: 'Rahu in Aries amplifies the desire for independence, pioneering achievement, and individual glory. The native is obsessively driven to be first — first in line, first to market, first to discover. This placement creates innovators, trailblazers, and sometimes reckless risk-takers. The shadow planet in the sign of the self produces an insatiable hunger for identity and recognition. Past-life karma involves learning to assert individuality without trampling others. Can create identity confusion — the native may constantly reinvent themselves. Excellent for technology startups, independent research, and any field where being a pioneer is rewarded. Ketu in Libra (the axis partner) suggests releasing attachment to others\' approval.', hi: 'मेष में राहु स्वतन्त्रता, अग्रणी उपलब्धि और व्यक्तिगत गौरव की इच्छा बढ़ाता है। जातक प्रथम होने के लिए जुनूनी — नवप्रवर्तक, पथप्रदर्शक। छाया ग्रह आत्म की राशि में पहचान और मान्यता की अतृप्त भूख। पूर्वजन्म कर्म — दूसरों को कुचले बिना व्यक्तित्व स्थापित करना। प्रौद्योगिकी स्टार्टअप और स्वतन्त्र शोध के लिए उत्कृष्ट।' },
  },
  {
    planet: { en: 'Ketu', hi: 'केतु' },
    dignity: 'Neutral',
    effect: { en: 'Ketu in Aries indicates past-life mastery of independence, courage, and self-assertion — the soul has already been the warrior and now seeks to release ego-driven action. The native may feel disconnected from personal ambition, uncertain about their identity, and strangely detached from competitive situations that should excite them. Physical energy may be erratic — bursts of incredible courage followed by withdrawal. Headaches, brain fog, and injuries to the head are possible. Spiritually, this is a powerful placement for dissolving the ego through selfless action. The native serves best when they stop trying to be first and instead channel Mars energy into service. Rahu in Libra (the axis partner) pulls them toward partnership and cooperation as the growth direction.', hi: 'मेष में केतु पूर्वजन्म में स्वतन्त्रता, साहस और आत्मदावे में निपुणता — आत्मा पहले ही योद्धा रह चुकी। जातक व्यक्तिगत महत्त्वाकांक्षा से विलग, पहचान अनिश्चित। शारीरिक ऊर्जा अनियमित — अविश्वसनीय साहस के बाद वापसी। आध्यात्मिक रूप से शक्तिशाली — निःस्वार्थ कर्म से अहंकार विलयन। तुला में राहु साझेदारी और सहयोग की ओर विकास।' },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY = {
  appearance: { en: 'Classical texts describe Mesha natives as having a medium build with a tendency toward muscular or wiry physique. The face is often angular with prominent brows, a strong jawline, and piercing eyes. The forehead may bear scars or marks. Complexion tends toward ruddy or coppery. Movement is quick and decisive — they walk fast, gesture emphatically, and carry themselves with confident energy. Hair may be reddish-tinted or coarse in texture.', hi: 'शास्त्रीय ग्रन्थ मेष जातकों को मध्यम काया, पेशीय या तन्तुमय शरीर वाला बताते हैं। चेहरा प्रायः कोणीय — उभरी भौंहें, सशक्त जबड़ा, भेदक नेत्र। ललाट पर चिह्न या निशान सम्भव। वर्ण ताम्र या रक्ताभ। चाल तीव्र और निर्णायक — तेज़ चलना, सशक्त संकेत, आत्मविश्वासपूर्ण ऊर्जा।' },
  strengths: { en: 'Courage, initiative, natural leadership, physical vitality, honesty, competitive spirit, decisiveness, resilience, pioneering instinct, protective nature, ability to act under pressure, infectious enthusiasm, and an unwavering commitment to their chosen path. Mesha natives are the first to volunteer in emergencies and the last to surrender in adversity.', hi: 'साहस, पहल, स्वाभाविक नेतृत्व, शारीरिक प्राणशक्ति, ईमानदारी, प्रतिस्पर्धी भावना, निर्णायकता, लचीलापन, अग्रणी सहज प्रवृत्ति, रक्षात्मक स्वभाव, दबाव में कार्य करने की क्षमता। मेष जातक आपातकाल में प्रथम स्वयंसेवक और प्रतिकूलता में अन्तिम समर्पण करने वाले।' },
  weaknesses: { en: 'Impatience, impulsiveness, short temper, tendency to start but not finish, arrogance, insensitivity to others\' feelings, recklessness, inability to take orders, ego-driven decisions, burnout from overexertion, and difficulty with teamwork when they cannot lead. They may alienate allies through bluntness and struggle with the patience required for long-term relationships.', hi: 'अधैर्य, आवेग, शीघ्र क्रोध, आरम्भ किन्तु समापन न करना, अहंकार, दूसरों की भावनाओं के प्रति असंवेदनशीलता, लापरवाही, आदेश न मानना, अहंकार-चालित निर्णय, अत्यधिक परिश्रम से थकान, और नेतृत्व न मिलने पर सहकार्य में कठिनाई।' },
  temperament: { en: 'Pitta-dominant (fire-water). Hot-headed, passionate, driven by internal fire. Anger rises quickly like a flame but also burns out fast — Mesha natives rarely hold grudges (unlike Scorpio Mars). They need physical outlets for their energy: exercise, competitive sports, adventurous travel, or hands-on work. Sedentary lifestyles make them irritable and destructive. When channeled properly, their temperament is that of a heroic protector; when misdirected, it becomes the reckless destroyer.', hi: 'पित्त प्रधान (अग्नि-जल)। उग्र स्वभाव, भावुक, आन्तरिक अग्नि से प्रेरित। क्रोध ज्वाला सदृश शीघ्र उठता और शीघ्र शान्त — मेष जातक प्रायः शत्रुता नहीं रखते। शारीरिक माध्यम आवश्यक: व्यायाम, प्रतिस्पर्धी खेल, साहसिक यात्रा। बैठाऊ जीवनशैली चिड़चिड़ा और विनाशकारी बनाती है।' },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER = {
  suited: { en: 'Military and defense, surgery and emergency medicine, law enforcement and firefighting, professional sports and athletics, engineering (especially mechanical and civil), entrepreneurship and startup founding, metalwork and manufacturing, real estate development, adventure tourism, martial arts instruction, motivational speaking, crisis management consulting, automotive industry, and political leadership requiring bold decision-making.', hi: 'सेना और रक्षा, शल्य चिकित्सा और आपातकालीन चिकित्सा, विधि प्रवर्तन और अग्निशमन, व्यावसायिक खेल, अभियान्त्रिकी (विशेषतः यान्त्रिक और सिविल), उद्यमिता, धातुकर्म, भूसम्पत्ति विकास, साहसिक पर्यटन, युद्ध कला, प्रेरक वक्तृत्व, संकट प्रबन्धन, वाहन उद्योग।' },
  workStyle: { en: 'Mesha natives work best with autonomy and urgency. They excel in crisis situations where quick decisions save lives or money. They are natural project launchers but may need strong finishers on their team. Open-plan offices drain them — they need their own territory. They prefer to lead or work independently rather than follow. Deadlines energize rather than stress them. They are the executives who show up at 5 AM, the surgeons who stay for the extra case, and the entrepreneurs who bet everything on their vision.', hi: 'मेष जातक स्वायत्तता और तात्कालिकता में सर्वोत्तम कार्य करते हैं। संकट स्थितियों में उत्कृष्ट जहाँ शीघ्र निर्णय जीवन या धन बचाते हैं। स्वाभाविक परियोजना प्रारम्भक। नेतृत्व या स्वतन्त्र कार्य प्राथमिकता। समय सीमा ऊर्जा देती है, तनाव नहीं।' },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: [
    { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, reason: { en: 'Fire-fire combination with natural trine harmony. Both signs are proud, dynamic, and courageous. Leo\'s fixed loyalty complements Aries\' cardinal initiative. Together they are a power couple — Aries starts the venture, Leo sustains it with regal determination. The Sun-Mars friendship ensures mutual respect and admiration.', hi: 'अग्नि-अग्नि संयोग त्रिकोण सामंजस्य। दोनों गर्वीले, गतिशील और साहसी। सिंह की स्थिर निष्ठा मेष की पहल का पूरक। सूर्य-मंगल मैत्री परस्पर सम्मान सुनिश्चित।' } },
    { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, reason: { en: 'Another fire trine — adventure, philosophy, and shared love of freedom. Sagittarius expands Aries\' vision from personal conquest to universal truth. Jupiter-Mars compatibility brings courage guided by wisdom. Both signs hate restrictions and love physical activity. The relationship is energetic, optimistic, and growth-oriented.', hi: 'अग्नि त्रिकोण — साहस, दर्शन और स्वतन्त्रता का साझा प्रेम। धनु मेष की दृष्टि व्यक्तिगत विजय से सार्वभौमिक सत्य तक विस्तृत। गुरु-मंगल अनुकूलता ज्ञान से निर्देशित साहस। ऊर्जावान, आशावादी सम्बन्ध।' } },
  ],
  challenging: [
    { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, reason: { en: 'Cardinal square tension — both want to lead but in opposite ways. Aries leads through action, Cancer through emotional influence. Aries\' bluntness wounds Cancer\'s sensitivity. Cancer\'s moodiness frustrates Aries\' need for forward movement. Mars is debilitated in Cancer, suggesting fundamental discomfort. However, when mature, this pair provides both protection (Cancer) and provision (Aries) for the family.', hi: 'चर वर्ग तनाव — दोनों नेतृत्व चाहते हैं किन्तु विपरीत ढंग से। मेष कर्म से, कर्क भावनात्मक प्रभाव से। मेष की स्पष्टवादिता कर्क की संवेदनशीलता को आहत। कर्क में मंगल नीच — मूलभूत असुविधा। परिपक्व होने पर रक्षा और प्रावधान दोनों।' } },
    { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, reason: { en: 'Cardinal square from the other side — both are ambitious but clash on method. Aries wants fast results, Capricorn insists on proper process. Saturn (Capricorn\'s ruler) is debilitated in Aries, while Mars is exalted in Capricorn — a complex exchange. Professional rivalry can poison personal relationships. When they unite, however, their combined strategic (Capricorn) and tactical (Aries) strengths make them formidable.', hi: 'दूसरी ओर से चर वर्ग — दोनों महत्त्वाकांक्षी किन्तु विधि पर संघर्ष। मेष शीघ्र परिणाम, मकर उचित प्रक्रिया। शनि मेष में नीच, मंगल मकर में उच्च — जटिल विनिमय। एकजुट होने पर रणनीतिक और सामरिक शक्ति अद्वितीय।' } },
  ],
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES = {
  deity: { en: 'Lord Hanuman and Lord Kartikeya (Skanda/Murugan) are the primary deities for Mesha natives. Hanuman embodies the perfect channeling of Mars energy — supreme physical strength directed by devotion and selfless service. Kartikeya, the commander of the divine army and son of Shiva, represents disciplined martial energy used for dharmic purposes.', hi: 'हनुमान जी और कार्तिकेय (स्कन्द/मुरुगन) मेष जातकों के प्रमुख देवता। हनुमान मंगल ऊर्जा का आदर्श संचालन — भक्ति और निःस्वार्थ सेवा द्वारा निर्देशित सर्वोच्च शारीरिक बल। कार्तिकेय दिव्य सेना के सेनापति — धार्मिक उद्देश्यों के लिए अनुशासित सैनिक ऊर्जा।' },
  mantra: { en: 'The Mars beej mantra "Om Kraam Kreem Kraum Sah Bhaumaya Namah" should be chanted 7,000 times during Mars hora on Tuesdays. For daily practice, chant 108 times. The Hanuman Chalisa recited on Tuesdays and Saturdays pacifies afflicted Mars and strengthens beneficial Mars.', hi: 'मंगल बीज मन्त्र "ॐ क्रां क्रीं क्रौं सः भौमाय नमः" मंगलवार को मंगल होरा में 7,000 बार जपें। दैनिक अभ्यास में 108 बार। हनुमान चालीसा मंगलवार और शनिवार को पढ़ने से पीड़ित मंगल शान्त और शुभ मंगल सशक्त।' },
  practices: { en: 'Wear red coral (Moonga) on the ring finger of the right hand in gold or copper setting on a Tuesday during Mars hora — only if prescribed by a qualified Jyotishi. Donate red lentils (masoor dal), red cloth, copper vessels, or jaggery on Tuesdays. Fasting on Tuesdays strengthens Mars. Plant red flowers, especially red hibiscus, and offer them to Hanuman. Regular physical exercise and martial arts practice naturally channel excess Mars energy.', hi: 'मूँगा (लाल प्रवाल) दाहिने हाथ की अनामिका में स्वर्ण या ताम्र जड़ित मंगलवार को मंगल होरा में धारण — केवल योग्य ज्योतिषी के निर्देश पर। मंगलवार को मसूर दाल, लाल वस्त्र, ताम्र पात्र दान। मंगलवार व्रत मंगल सशक्त करता है। लाल पुष्प विशेषतः लाल गुड़हल हनुमान को अर्पित।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: { en: 'In Vedic cosmology, Mesha (the Ram) holds a profound symbolic position as the first sign — the primordial spark of creation. The golden ram of Greek mythology has parallels in Vedic tradition where the ram (mesha) is associated with Agni, the fire god, and represents the first impulse of consciousness to manifest in the material world. The vernal equinox — when the Sun enters Aries — was historically the beginning of the astronomical year in the Sidereal system, marking the moment when light conquers darkness and the creative force of the universe reasserts itself after the dissolution of winter.', hi: 'वैदिक ब्रह्माण्ड विज्ञान में मेष (मेंढ़ा) प्रथम राशि के रूप में गहन प्रतीकात्मक स्थान रखता है — सृष्टि की आदि चिंगारी। मेष अग्नि देव से सम्बद्ध और भौतिक जगत में चेतना के प्रथम आवेग का प्रतिनिधित्व। वसन्त विषुव — जब सूर्य मेष में प्रवेश — ऐतिहासिक रूप से खगोलीय वर्ष का प्रारम्भ, जब प्रकाश अन्धकार पर विजय पाता है।' },
  symbolism: { en: 'The ram charges headfirst into obstacles — this is the fundamental Mesha nature. The horns represent both weapons of offense and the crown of leadership. In Vedic sacrificial tradition, the ram was offered to Agni, symbolizing the surrender of ego-driven impulse to divine fire for purification. Mesha natives carry this dual symbolism: they are both the force that breaks through barriers and the offering that transforms base energy into spiritual fire. The lesson of Mesha is that courage without wisdom becomes mere aggression, but courage guided by dharma becomes the noblest human quality.', hi: 'मेंढ़ा बाधाओं पर सबसे पहले सिर से प्रहार करता है — यह मूलभूत मेष स्वभाव। सींग आक्रमण के हथियार और नेतृत्व का मुकुट। वैदिक यज्ञ परम्परा में मेष अग्नि को अर्पित — अहंकार-प्रेरित आवेग का दिव्य अग्नि में समर्पण। मेष का पाठ: बिना ज्ञान साहस केवल आक्रामकता, किन्तु धर्म से निर्देशित साहस सर्वोत्तम मानवीय गुण।' },
};

// ─── Cross Links ───────────────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/mangal' as const, label: { en: 'Mars (Mangal) — Ruler of Mesha', hi: 'मंगल — मेष का स्वामी' } },
  { href: '/learn/vrishabha' as const, label: { en: 'Vrishabha (Taurus) — Next Sign', hi: 'वृषभ — अगली राशि' } },
  { href: '/learn/rashis' as const, label: { en: 'All 12 Rashis Overview', hi: 'सभी 12 राशियों का अवलोकन' } },
  { href: '/learn/nakshatras' as const, label: { en: 'Nakshatras — Lunar Mansions', hi: 'नक्षत्र — चन्द्र भवन' } },
  { href: '/learn/surya' as const, label: { en: 'Sun (Surya) — Exalted in Mesha', hi: 'सूर्य — मेष में उच्च' } },
  { href: '/learn/shani' as const, label: { en: 'Saturn (Shani) — Debilitated in Mesha', hi: 'शनि — मेष में नीच' } },
  { href: '/learn/mangal-dosha' as const, label: { en: 'Manglik Dosha Explained', hi: 'मांगलिक दोष विस्तार से' } },
  { href: '/learn/compatibility' as const, label: { en: 'Compatibility & Matching', hi: 'अनुकूलता और मिलान' } },
  { href: '/learn/planet-in-house' as const, label: { en: 'Planets in Houses', hi: 'भावों में ग्रह' } },
  { href: '/learn/remedies' as const, label: { en: 'Vedic Remedies Guide', hi: 'वैदिक उपाय मार्गदर्शिका' } },
];

// ═══════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════
export default function MeshaPage() {
  const locale = useLocale();
  const ml = useML(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);

  let sectionNum = 0;
  const next = () => ++sectionNum;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="text-8xl mb-4">&#9800;</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-2" style={hf}>
          {ml({ en: 'Mesha', hi: 'मेष' })}
        </h1>
        <p className="text-xl text-text-secondary mb-1" style={bf}>
          {ml({ en: 'Aries — The Ram', hi: 'मेष — मेंढ़ा' })}
        </p>
        <p className="text-text-secondary/80 italic text-sm max-w-xl mx-auto mb-6" style={bf}>
          {ml({ en: 'The first spark of creation, the primal fire that says "I am" — Mesha is where the zodiac begins and where courage is born.', hi: 'सृष्टि की प्रथम चिंगारी, आदि अग्नि जो कहती है "मैं हूँ" — मेष जहाँ राशि चक्र आरम्भ और साहस जन्म लेता है।' })}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            {ml({ en: 'Fire Element', hi: 'अग्नि तत्त्व' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            {ml({ en: 'Cardinal / Chara', hi: 'चर राशि' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            {ml({ en: 'Ruler: Mars', hi: 'स्वामी: मंगल' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            {ml({ en: '0° – 30°', hi: '0° – 30°' })}
          </span>
        </div>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {TERMS.map((t) => (
          <SanskritTermCard
            key={t.transliteration}
            term={ml(t.meaning)}
            transliteration={t.transliteration}
            meaning={ml(t.meaning)}
            devanagari={t.devanagari}
          />
        ))}
      </div>

      {/* ── 1. Overview & Characteristics ── */}
      <LessonSection number={next()} title={ml({ en: 'Overview & Characteristics', hi: 'अवलोकन एवं विशेषताएँ' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mesha (Aries) is the first sign of the sidereal zodiac, spanning 0° to 30°. As the initiator of the entire zodiacal cycle, it carries the raw energy of beginnings — the spark before the flame, the seed before the tree. Ruled by Mars, the planet of courage and action, Mesha embodies the warrior archetype in its purest form. This is not the strategist (Capricorn) or the covert operative (Scorpio) — this is the warrior who charges headfirst into battle, leading from the front.', hi: 'मेष सायन राशि चक्र की प्रथम राशि है, 0° से 30° तक फैली। सम्पूर्ण राशि चक्र की आरम्भक के रूप में यह प्रारम्भ की कच्ची ऊर्जा वहन करती है — ज्वाला से पूर्व की चिंगारी, वृक्ष से पूर्व का बीज। मंगल शासित मेष योद्धा मूलरूप का शुद्धतम स्वरूप। यह रणनीतिकार या गुप्तचर नहीं — यह योद्धा है जो अग्रिम पंक्ति से सिर झुकाकर युद्ध में आगे बढ़ता है।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
          {Object.entries(SIGN_OVERVIEW).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3 text-center">
              <div className="text-text-secondary/60 text-xs uppercase tracking-wide mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="text-text-primary text-sm font-medium" style={bf}>{ml(val)}</div>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Swarupa (Sign Descriptions)" />
      </LessonSection>

      {/* ── 2. Personality & Temperament ── */}
      <LessonSection number={next()} title={ml({ en: 'Personality & Temperament', hi: 'व्यक्तित्व एवं स्वभाव' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Classical Physical Description', hi: 'शास्त्रीय शारीरिक वर्णन' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PERSONALITY.appearance)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Temperament', hi: 'स्वभाव' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PERSONALITY.temperament)}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4">
              <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strengths', hi: 'शक्तियाँ' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PERSONALITY.strengths)}</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-4">
              <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weaknesses', hi: 'दुर्बलताएँ' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PERSONALITY.weaknesses)}</p>
            </div>
          </div>
        </div>
        <ClassicalReference shortName="JP" chapter="Ch. 2 — Rashi Characteristics" />
      </LessonSection>

      {/* ── 3. Nakshatras in This Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Mesha', hi: 'मेष के नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Three nakshatras occupy Mesha, each coloring the Aries energy differently. Ashwini brings speed and healing, Bharani adds depth and transformative power, and Krittika\'s first pada contributes the purifying fire of the Sun.', hi: 'तीन नक्षत्र मेष में विराजमान, प्रत्येक मेष ऊर्जा को भिन्न रंग देता है। अश्विनी गति और चिकित्सा, भरणी गहनता और रूपान्तरकारी शक्ति, कृत्तिका का प्रथम पाद सूर्य की शुद्धिकारी अग्नि।' })}</p>
        <div className="space-y-4">
          {NAKSHATRAS_IN_SIGN.map((n) => (
            <div key={ml(n.name)} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="text-gold-light font-bold" style={hf}>{ml(n.name)}</h4>
                <span className="text-xs text-text-secondary/70 bg-bg-primary/50 px-2 py-0.5 rounded">{ml(n.range)}</span>
              </div>
              <div className="flex flex-wrap gap-3 mb-2 text-xs">
                <span className="text-text-secondary">{ml({ en: 'Ruler:', hi: 'स्वामी:' })} <span className="text-gold-primary">{ml(n.ruler)}</span></span>
                <span className="text-text-secondary">{ml({ en: 'Deity:', hi: 'देवता:' })} <span className="text-gold-primary">{ml(n.deity)}</span></span>
              </div>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.qualities)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Mesha', hi: 'मेष में ग्रहों की गरिमा' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Every sign is a battleground of planetary dignities — some planets thrive here while others struggle. In Mesha, the Sun reaches its exaltation (the king enthroned), Saturn falls to debilitation (discipline without patience), and Mars stands in its own domain as the undisputed lord.', hi: 'प्रत्येक राशि ग्रहों की गरिमा का रणक्षेत्र — कुछ ग्रह यहाँ फलते-फूलते हैं, अन्य संघर्ष करते हैं। मेष में सूर्य उच्च पर (सिंहासनारूढ़ राजा), शनि नीच पर (धैर्य बिना अनुशासन), और मंगल स्वक्षेत्र में निर्विवाद स्वामी।' })}</p>

        {/* Exalted */}
        <h4 className="text-emerald-400 font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Exalted Here', hi: 'यहाँ उच्च' })}</h4>
        {PLANETARY_DIGNITIES.exalted.map((p) => (
          <div key={ml(p.planet)} className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{ml(p.degree)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}

        {/* Debilitated */}
        <h4 className="text-red-400 font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Debilitated Here', hi: 'यहाँ नीच' })}</h4>
        {PLANETARY_DIGNITIES.debilitated.map((p) => (
          <div key={ml(p.planet)} className="bg-red-500/5 border border-red-500/15 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">{ml(p.degree)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}

        {/* Own Sign */}
        <h4 className="text-gold-primary font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Own Sign / Moolatrikona', hi: 'स्वराशि / मूलत्रिकोण' })}</h4>
        {PLANETARY_DIGNITIES.ownSign.map((p) => (
          <div key={ml(p.planet)} className="bg-gold-primary/5 border border-gold-primary/15 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className="text-xs text-gold-primary bg-gold-primary/10 px-2 py-0.5 rounded-full">{ml(p.range)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18-21 — Uccha, Neecha, Moolatrikona" />
      </LessonSection>

      {/* ── 5. Each Planet in Mesha ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Mesha', hi: 'मेष में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'How each of the nine Vedic planets (Navagraha) behaves when placed in Mesha in a birth chart. The sign colors the planet\'s expression — Mars energy infuses every planet with initiative, courage, and impulsive action.', hi: 'जन्म कुण्डली में मेष में स्थित प्रत्येक नवग्रह का व्यवहार। राशि ग्रह की अभिव्यक्ति को रंग देती है — मंगल ऊर्जा प्रत्येक ग्रह में पहल, साहस और आवेगी कर्म भरती है।' })}</p>
        <div className="space-y-4">
          {PLANETS_IN_SIGN.map((p) => (
            <div key={ml(p.planet)} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="text-gold-light font-bold" style={hf}>{ml(p.planet)}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  p.dignity.includes('Exalted') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  p.dignity.includes('Debilitated') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  p.dignity.includes('Own') ? 'bg-gold-primary/10 border-gold-primary/30 text-gold-primary' :
                  'bg-bg-primary/50 border-gold-primary/15 text-text-secondary'
                }`}>{p.dignity}</span>
              </div>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="PD" chapter="Ch. 3-5 — Graha in Rashi Effects" />
      </LessonSection>

      {/* ── 6. Career & Professional Life ── */}
      <LessonSection number={next()} title={ml({ en: 'Career & Professional Life', hi: 'करियर एवं व्यावसायिक जीवन' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Suited Professions', hi: 'उपयुक्त व्यवसाय' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(CAREER.suited)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Work Style', hi: 'कार्य शैली' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(CAREER.workStyle)}</p>
          </div>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'A Mesha native in the wrong career — say a slow bureaucratic desk job with no autonomy — will become destructively frustrated. The Mars energy must have an outlet. If work does not provide it, the energy leaks into domestic conflict, road rage, or self-destructive habits.', hi: 'गलत करियर में मेष जातक — मान लीजिए बिना स्वायत्तता का धीमा नौकरशाही डेस्क कार्य — विनाशकारी रूप से निराश होगा। मंगल ऊर्जा को माध्यम चाहिए। यदि कार्य नहीं देता तो ऊर्जा घरेलू संघर्ष या आत्म-विनाशकारी आदतों में निकलती है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 7. Compatibility ── */}
      <LessonSection number={next()} title={ml({ en: 'Compatibility', hi: 'अनुकूलता' })}>
        <h4 className="text-emerald-400 font-bold text-sm mb-3" style={hf}>{ml({ en: 'Best Matches', hi: 'सर्वोत्तम मेल' })}</h4>
        {COMPATIBILITY.best.map((c) => (
          <div key={ml(c.sign)} className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4 mb-3">
            <span className="text-gold-light font-bold text-sm" style={hf}>{ml(c.sign)}</span>
            <p className="text-text-primary text-sm leading-relaxed mt-1" style={bf}>{ml(c.reason)}</p>
          </div>
        ))}
        <h4 className="text-amber-400 font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Challenging Matches', hi: 'चुनौतीपूर्ण मेल' })}</h4>
        {COMPATIBILITY.challenging.map((c) => (
          <div key={ml(c.sign)} className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-4 mb-3">
            <span className="text-gold-light font-bold text-sm" style={hf}>{ml(c.sign)}</span>
            <p className="text-text-primary text-sm leading-relaxed mt-1" style={bf}>{ml(c.reason)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 8. Remedies & Worship ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies & Worship', hi: 'उपाय एवं उपासना' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Presiding Deity', hi: 'अधिष्ठाता देवता' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES.deity)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Mantra', hi: 'मन्त्र' })}</h4>
            <p className="text-gold-primary text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
              ॐ क्रां क्रीं क्रौं सः भौमाय नमः
            </p>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES.mantra)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Practical Remedies', hi: 'व्यावहारिक उपाय' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES.practices)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 79 — Graha Shanti (Planetary Remedies)" />
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Symbolism', hi: 'पौराणिक कथा एवं प्रतीकवाद' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Cosmic Ram', hi: 'ब्रह्माण्डीय मेष' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Symbolism', hi: 'प्रतीकवाद' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.symbolism)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Mesha (Aries) is the first sign — ruled by Mars, element fire, cardinal modality. It represents raw initiative, courage, and the primal impulse to act.', hi: 'मेष प्रथम राशि — मंगल शासित, अग्नि तत्त्व, चर स्वभाव। कच्ची पहल, साहस और कर्म का आदि आवेग।' }),
        ml({ en: 'Sun is exalted at 10° (maximum authority), Saturn is debilitated at 20° (discipline weakened), Mars has own sign + moolatrikona 0°-12°.', hi: 'सूर्य 10° पर उच्च (अधिकतम अधिकार), शनि 20° पर नीच (अनुशासन दुर्बल), मंगल स्वराशि + मूलत्रिकोण 0°-12°।' }),
        ml({ en: 'Three nakshatras: Ashwini (0°-13°20\', Ketu), Bharani (13°20\'-26°40\', Venus), Krittika pada 1 (26°40\'-30°, Sun).', hi: 'तीन नक्षत्र: अश्विनी (0°-13°20\', केतु), भरणी (13°20\'-26°40\', शुक्र), कृत्तिका पाद 1 (26°40\'-30°, सूर्य)।' }),
        ml({ en: 'Best compatibility with Leo and Sagittarius (fire trines). Career strength in military, surgery, sports, entrepreneurship, and crisis leadership.', hi: 'सिंह और धनु से सर्वोत्तम अनुकूलता (अग्नि त्रिकोण)। सेना, शल्य चिकित्सा, खेल, उद्यमिता और संकट नेतृत्व में करियर शक्ति।' }),
      ]} />

      {/* ── Cross-links ── */}
      <div className="mt-12 border-t border-gold-primary/10 pt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4">{ml({ en: 'Explore Further', hi: 'और जानें' })}</h3>
        <div className="flex flex-wrap gap-2">
          {CROSS_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-sm rounded-lg border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-colors" style={bf}>
              {ml(link.label)}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
