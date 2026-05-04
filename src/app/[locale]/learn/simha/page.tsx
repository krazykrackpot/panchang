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
  { devanagari: 'सिंह', transliteration: 'Simha', meaning: { en: 'Lion — the king of beasts', hi: 'सिंह — पशुओं का राजा' } },
  { devanagari: 'सूर्य', transliteration: 'Sūrya', meaning: { en: 'The Sun — ruler of Simha', hi: 'सूर्य — सिंह का स्वामी' } },
  { devanagari: 'स्थिर', transliteration: 'Sthira', meaning: { en: 'Fixed — the modality of Simha', hi: 'स्थिर — सिंह की प्रकृति' } },
  { devanagari: 'अग्नि', transliteration: 'Agni', meaning: { en: 'Fire — the element of Simha', hi: 'अग्नि — सिंह का तत्त्व' } },
  { devanagari: 'आत्मा', transliteration: 'Ātmā', meaning: { en: 'Soul — what the Sun signifies', hi: 'आत्मा — सूर्य का कारकत्व' } },
  { devanagari: 'राजयोग', transliteration: 'Rāja Yoga', meaning: { en: 'Royal combination — Leo natives attract power', hi: 'राजयोग — सिंह जातक सत्ता आकर्षित करते हैं' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Fire (Agni Tattva)', hi: 'अग्नि तत्त्व' },
  modality: { en: 'Fixed (Sthira)', hi: 'स्थिर' },
  gender: { en: 'Masculine (Purusha)', hi: 'पुल्लिंग (पुरुष)' },
  ruler: { en: 'Sun (Surya)', hi: 'सूर्य' },
  symbol: { en: 'Lion ♌', hi: 'सिंह ♌' },
  degreeRange: { en: '120° to 150° of the zodiac', hi: 'राशिचक्र के 120° से 150°' },
  direction: { en: 'East', hi: 'पूर्व' },
  season: { en: 'Grishma (Summer)', hi: 'ग्रीष्म ऋतु' },
  color: { en: 'Golden yellow, deep orange', hi: 'स्वर्ण पीला, गहरा नारंगी' },
  bodyPart: { en: 'Heart, spine, upper back, stomach', hi: 'हृदय, रीढ़, ऊपरी पीठ, उदर' },
};

// ─── Nakshatras in Simha ───────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Magha (120° – 133°20\')', hi: 'मघा (120° – 133°20\')' },
    ruler: { en: 'Ketu', hi: 'केतु' },
    deity: { en: 'Pitris (ancestral spirits)', hi: 'पितर (पूर्वज)' },
    desc: {
      en: 'Magha is the royal nakshatra — the throne of the lion. Its natives carry ancestral karma, regal bearing, and a deep connection to lineage. Ketu as ruler gives detachment amidst authority. Magha natives are born to lead but must confront the ghosts of their ancestry. Traditional ceremonies, royal titles, and inherited positions are hallmarks. The shakti of this nakshatra is the power to leave the body (tyage kshepani shakti), connecting it to death rituals and ancestral liberation.',
      hi: 'मघा राजसी नक्षत्र है — सिंह का सिंहासन। इसके जातक पूर्वजों का कर्म, राजसी गरिमा और वंश से गहरा जुड़ाव रखते हैं। केतु स्वामी होने से अधिकार के बीच वैराग्य देता है। मघा जातक नेतृत्व के लिए जन्मे होते हैं किन्तु उन्हें अपने पूर्वजों की छाया का सामना करना होता है। पारम्परिक संस्कार, राजसी उपाधि और वंशानुगत पद इसकी विशेषताएँ हैं।',
    },
  },
  {
    name: { en: 'Purva Phalguni (133°20\' – 146°40\')', hi: 'पूर्व फाल्गुनी (133°20\' – 146°40\')' },
    ruler: { en: 'Venus', hi: 'शुक्र' },
    deity: { en: 'Bhaga (god of marital bliss and fortune)', hi: 'भग (वैवाहिक सुख और भाग्य के देव)' },
    desc: {
      en: 'Purva Phalguni is the nakshatra of pleasure, creativity, and procreation. Venus as ruler brings artistic talent, sensuality, and love of luxury to Leo\'s regal nature. These natives are magnetic, charismatic, and drawn to performance arts, celebration, and romance. The shakti is the power of creative procreation (prajanana shakti). Marriage, partnerships, and creative endeavors are central themes. A natural entertainer — the lion at the party.',
      hi: 'पूर्व फाल्गुनी आनन्द, सृजनात्मकता और सन्तानोत्पत्ति का नक्षत्र है। शुक्र स्वामी होने से सिंह की राजसी प्रकृति में कलात्मक प्रतिभा, कामुकता और विलास का प्रेम आता है। ये जातक आकर्षक, करिश्माई और प्रदर्शन कला, उत्सव और प्रेम की ओर आकर्षित होते हैं। विवाह, साझेदारी और सृजनात्मक प्रयास केन्द्रीय विषय हैं।',
    },
  },
  {
    name: { en: 'Uttara Phalguni pada 1 (146°40\' – 150°)', hi: 'उत्तर फाल्गुनी पाद 1 (146°40\' – 150°)' },
    ruler: { en: 'Sun', hi: 'सूर्य' },
    deity: { en: 'Aryaman (god of patronage and contracts)', hi: 'अर्यमन् (संरक्षण और अनुबन्ध के देव)' },
    desc: {
      en: 'Only the first pada of Uttara Phalguni falls in Leo — the remaining three belong to Virgo. Sun as nakshatra ruler in Sun\'s own sign creates double solar energy. This pada is about benevolent leadership, social contracts, and patronage. The native commands through generosity rather than force. Friendships and alliances are formed with purpose. The transition from Leo to Virgo begins here — from royal display to humble service.',
      hi: 'उत्तर फाल्गुनी का केवल पहला पाद सिंह में पड़ता है — शेष तीन कन्या में। सूर्य के स्वराशि में सूर्य शासित नक्षत्र दोहरी सौर ऊर्जा बनाता है। यह पाद उदार नेतृत्व, सामाजिक अनुबन्ध और संरक्षण के बारे में है। जातक बल से नहीं, उदारता से शासन करता है।',
    },
  },
];

// ─── Planetary Dignities Here ──────────────────────────────────────────
const PLANETARY_DIGNITIES_HERE = {
  ownSign: {
    planet: { en: 'Sun', hi: 'सूर्य' },
    desc: {
      en: 'Leo is the Sun\'s only own sign (sva-rashi). The Sun here is the king on his throne — fully comfortable, expressing its highest potential of authority, dignity, creativity, and self-expression. No other planet owns Leo, making Sun\'s sovereignty absolute. Moolatrikona zone is Leo 0°-20° (Magha through Purva Phalguni), where the Sun is even more potent than in its exaltation sign Aries.',
      hi: 'सिंह सूर्य की एकमात्र स्वराशि है। सूर्य यहाँ अपने सिंहासन पर राजा है — पूर्णतः सुखी, अधिकार, गरिमा, सृजनात्मकता और आत्माभिव्यक्ति की उच्चतम क्षमता व्यक्त करता है। मूलत्रिकोण क्षेत्र सिंह 0°-20° है जहाँ सूर्य उच्च राशि मेष से भी अधिक शक्तिशाली है।',
    },
  },
  moolatrikona: {
    planet: { en: 'Sun (0°-20° of Leo)', hi: 'सूर्य (सिंह 0°-20°)' },
    desc: {
      en: 'The moolatrikona zone of the Sun spans from 0° to 20° of Leo, covering the entire Magha nakshatra and most of Purva Phalguni. In this zone, the Sun operates with maximum administrative capacity — it is the executive in his office, fully empowered. Planets in their moolatrikona are considered stronger than in their own sign but outside the moolatrikona zone. Per BPHS Chapter 4, this is the zone where the Sun delivers its most reliable and constructive results.',
      hi: 'सूर्य का मूलत्रिकोण क्षेत्र सिंह के 0° से 20° तक फैला है, जो सम्पूर्ण मघा नक्षत्र और अधिकांश पूर्व फाल्गुनी को समेटता है। इस क्षेत्र में सूर्य अधिकतम प्रशासनिक क्षमता से कार्य करता है। बृहत् पराशर होरा शास्त्र अध्याय 4 के अनुसार यह वह क्षेत्र है जहाँ सूर्य सबसे विश्वसनीय और रचनात्मक फल देता है।',
    },
  },
  note: {
    en: 'No planet is exalted or debilitated in Leo. This makes Leo a neutral ground for all planets except the Sun, which reigns supreme here. Jupiter, Mars, and Moon are comfortable as friends of the Sun. Venus and Saturn struggle as Sun\'s enemies — Venus\'s desire for pleasure clashes with Sun\'s demand for purpose, and Saturn\'s slow democracy conflicts with Sun\'s swift monarchy.',
    hi: 'कोई भी ग्रह सिंह में उच्च या नीच नहीं है। यह सिंह को सूर्य के अतिरिक्त सभी ग्रहों के लिए तटस्थ भूमि बनाता है। गुरु, मंगल और चन्द्र सूर्य के मित्र होने से सुखी हैं। शुक्र और शनि सूर्य के शत्रु होने से संघर्ष करते हैं।',
  },
};

// ─── Each Planet in Simha ──────────────────────────────────────────────
const EACH_PLANET_IN_SIGN: { planet: ML; effect: ML; dignity: string }[] = [
  {
    planet: { en: 'Sun in Simha', hi: 'सिंह में सूर्य' }, dignity: 'Own sign / Moolatrikona',
    effect: {
      en: 'The king on his throne. Maximum self-expression, natural authority, and creative power. These natives are born leaders with magnetic personalities. Regal bearing, strong willpower, generosity, and a commanding presence. Government positions, performing arts, and administration come naturally. The heart is strong but pride can become arrogance if unchecked. Father is usually prominent and the native commands respect effortlessly.',
      hi: 'राजा अपने सिंहासन पर। अधिकतम आत्माभिव्यक्ति, स्वाभाविक अधिकार और सृजनात्मक शक्ति। ये जातक जन्मजात नेता हैं। राजसी गरिमा, दृढ़ इच्छाशक्ति, उदारता और प्रभावशाली उपस्थिति। सरकारी पद, प्रदर्शन कला और प्रशासन स्वाभाविक रूप से आते हैं। हृदय बलवान है किन्तु गर्व अहंकार बन सकता है।',
    },
  },
  {
    planet: { en: 'Moon in Simha', hi: 'सिंह में चन्द्र' }, dignity: 'Friend\'s sign',
    effect: {
      en: 'The mind illuminated by the royal flame. Moon in Leo creates emotionally expressive, dramatic, and warm individuals. They crave recognition and admiration, and their emotional well-being depends on feeling appreciated. Creative imagination is powerful — acting, music, and storytelling come naturally. The mother may have a strong, authoritative personality. Emotionally generous but can be attention-seeking. Children and romance bring deep emotional fulfillment.',
      hi: 'राजसी अग्नि से प्रकाशित मन। सिंह में चन्द्र भावनात्मक रूप से अभिव्यक्त, नाटकीय और उष्ण व्यक्ति बनाता है। उन्हें मान्यता और प्रशंसा की लालसा होती है। सृजनात्मक कल्पना शक्तिशाली है — अभिनय, संगीत और कथा-कथन स्वाभाविक हैं। माता का व्यक्तित्व प्रबल हो सकता है। संतान और प्रेम गहरी भावनात्मक तृप्ति देते हैं।',
    },
  },
  {
    planet: { en: 'Mars in Simha', hi: 'सिंह में मंगल' }, dignity: 'Friend\'s sign',
    effect: {
      en: 'The warrior serving the king — a powerful combination of courage and authority. Mars in Leo creates dynamic leaders, military commanders, and athletes. Tremendous physical energy, courage, and competitive drive. The native fights for honor and prestige, not just survival. Passion runs high in romance. Can be domineering and quick-tempered. Excellent for sports, surgery, military, police, and any field requiring bold initiative under authority.',
      hi: 'राजा की सेवा में योद्धा — साहस और अधिकार का शक्तिशाली संयोग। सिंह में मंगल गतिशील नेता, सैन्य कमाण्डर और खिलाड़ी बनाता है। अपार शारीरिक ऊर्जा, साहस और प्रतिस्पर्धी उत्साह। जातक सम्मान और प्रतिष्ठा के लिए लड़ता है। प्रेम में उत्कट। खेल, शल्य चिकित्सा, सेना के लिए उत्कृष्ट।',
    },
  },
  {
    planet: { en: 'Mercury in Simha', hi: 'सिंह में बुध' }, dignity: 'Neutral',
    effect: {
      en: 'The intellect colored by royal ambition. Mercury in Leo thinks big, communicates with authority, and expresses ideas dramatically. These are the public speakers, creative writers, and theatrical communicators. Intellect serves ego and creative vision. Can be fixed in opinions despite Mercury\'s usual flexibility. Business acumen combined with showmanship. Education and learning are tied to prestige. Good for advertising, politics, and leadership coaching.',
      hi: 'राजसी महत्वाकांक्षा से रंगी बुद्धि। सिंह में बुध बड़ा सोचता है, अधिकार से संवाद करता है और विचारों को नाटकीय ढंग से व्यक्त करता है। ये सार्वजनिक वक्ता, सृजनात्मक लेखक और नाटकीय संवादक हैं। बुध की सामान्य लचीलेपन के बावजूद विचारों में दृढ़। विज्ञापन, राजनीति और नेतृत्व प्रशिक्षण के लिए अच्छा।',
    },
  },
  {
    planet: { en: 'Jupiter in Simha', hi: 'सिंह में गुरु' }, dignity: 'Friend\'s sign',
    effect: {
      en: 'The guru advising the king — wisdom wedded to power. Jupiter in Leo creates benevolent leaders, spiritual teachers with authority, and generous philanthropists. Dharma is expressed through leadership and creative vision. Children are a source of great joy and may be distinguished. Education, philosophy, and religion carry a regal quality. This placement often produces ministers, chancellors, and directors of large institutions. Expansion of ego can be a pitfall.',
      hi: 'राजा को परामर्श देने वाला गुरु — ज्ञान और शक्ति का विवाह। सिंह में गुरु उदार नेता, अधिकारपूर्ण आध्यात्मिक गुरु और उदार परोपकारी बनाता है। धर्म नेतृत्व और सृजनात्मक दृष्टि से व्यक्त होता है। संतान महान आनन्द का स्रोत और विशिष्ट हो सकती है। बड़े संस्थानों के निदेशक बनने की सम्भावना।',
    },
  },
  {
    planet: { en: 'Venus in Simha', hi: 'सिंह में शुक्र' }, dignity: 'Enemy\'s sign',
    effect: {
      en: 'The pleasure minister at the royal court — uncomfortable under the Sun\'s intense gaze. Venus in Leo creates grand romantic gestures and a love of luxury and spectacle, but relationships suffer from ego clashes. The native expects admiration in love and may confuse attention with affection. Creative arts are expressed with flair and drama. Fashion, cinema, and glamour industries are natural fits. Marriage may face power struggles. Venus here must learn that love requires humility, not applause.',
      hi: 'राजदरबार में भोग-मन्त्री — सूर्य की तीव्र दृष्टि में असहज। सिंह में शुक्र भव्य प्रेम प्रदर्शन और विलास-वैभव का प्रेम बनाता है, किन्तु सम्बन्ध अहंकार टकराव से पीड़ित होते हैं। जातक प्रेम में प्रशंसा की अपेक्षा करता है। फैशन, सिनेमा और ग्लैमर उद्योग स्वाभाविक हैं। विवाह में सत्ता संघर्ष हो सकता है।',
    },
  },
  {
    planet: { en: 'Saturn in Simha', hi: 'सिंह में शनि' }, dignity: 'Enemy\'s sign',
    effect: {
      en: 'The democrat in the king\'s court — a fundamental conflict between authority and servitude. Saturn in Leo creates individuals who desire power but face constant delays and obstacles in achieving it. Father may be absent, distant, or oppressive. Heart and spine health require attention. Creativity is disciplined but joyless without conscious effort. Government service comes through struggle, not privilege. The lesson: true authority is earned through patient service, not inherited through birthright.',
      hi: 'राजदरबार में लोकतन्त्रवादी — अधिकार और सेवा के बीच मौलिक संघर्ष। सिंह में शनि ऐसे व्यक्ति बनाता है जो सत्ता चाहते हैं किन्तु प्राप्ति में निरन्तर विलम्ब और बाधा आती है। पिता अनुपस्थित या दूर हो सकते हैं। हृदय और रीढ़ के स्वास्थ्य पर ध्यान आवश्यक। सरकारी सेवा संघर्ष से आती है, विशेषाधिकार से नहीं।',
    },
  },
  {
    planet: { en: 'Rahu in Simha', hi: 'सिंह में राहु' }, dignity: 'Neutral',
    effect: {
      en: 'The shadow planet amplifying Leo\'s hunger for recognition. Rahu in Leo creates an obsessive desire for fame, power, and public attention. These natives may achieve sudden celebrity or political rise through unconventional means. The ego inflates beyond reality — illusions of grandeur are common. Can indicate foreign connections to authority or technology-driven leadership. Heart ailments from stress are possible. The native must distinguish genuine authority from mere showmanship.',
      hi: 'छाया ग्रह सिंह की मान्यता की भूख को बढ़ाता है। सिंह में राहु यश, सत्ता और सार्वजनिक ध्यान की जुनूनी इच्छा बनाता है। ये जातक अपरम्परागत माध्यमों से अचानक प्रसिद्धि या राजनीतिक उत्थान प्राप्त कर सकते हैं। अहंकार वास्तविकता से परे फूल जाता है। तनाव से हृदय रोग सम्भव।',
    },
  },
  {
    planet: { en: 'Ketu in Simha', hi: 'सिंह में केतु' }, dignity: 'Neutral',
    effect: {
      en: 'The headless shadow that detaches from ego — a spiritually powerful but worldly challenging placement. Ketu in Leo means the native has mastered authority in past lives and now seeks liberation from the desire for recognition. Low interest in self-promotion despite natural charisma. Father may be spiritually inclined or absent. The native serves as a channel for higher purpose rather than personal glory. Creativity is mystical and intuitive rather than performative. Heart issues or spine sensitivity possible.',
      hi: 'अहंकार से वैराग्य देने वाला शिरोहीन छाया ग्रह — आध्यात्मिक रूप से शक्तिशाली किन्तु सांसारिक दृष्टि से चुनौतीपूर्ण स्थिति। सिंह में केतु का अर्थ है जातक ने पूर्वजन्म में अधिकार पर महारत हासिल की है और अब मान्यता की इच्छा से मुक्ति चाहता है। स्वाभाविक करिश्मे के बावजूद आत्म-प्रचार में रुचि कम। सृजनात्मकता रहस्यमय और सहजज्ञान से भरी।',
    },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY_TRAITS = {
  strengths: {
    en: 'Natural leadership, magnetic charisma, generosity, creative vision, courage, loyalty, strong willpower, organizational ability, warmth, protective instinct toward loved ones, dignity in adversity, capacity to inspire others',
    hi: 'स्वाभाविक नेतृत्व, आकर्षक करिश्मा, उदारता, सृजनात्मक दृष्टि, साहस, वफादारी, दृढ़ इच्छाशक्ति, संगठन क्षमता, उष्णता, प्रियजनों के प्रति रक्षात्मक वृत्ति, विपत्ति में गरिमा, दूसरों को प्रेरित करने की क्षमता',
  },
  weaknesses: {
    en: 'Pride and arrogance, need for constant admiration, domineering behavior, stubbornness in the face of criticism, difficulty accepting subordinate roles, tendency to dramatize, vanity, inability to delegate, wounded ego creates disproportionate reactions',
    hi: 'गर्व और अहंकार, निरन्तर प्रशंसा की आवश्यकता, दबंग व्यवहार, आलोचना के प्रति हठ, अधीनस्थ भूमिका स्वीकार करने में कठिनाई, नाटकीयता की प्रवृत्ति, घमण्ड, अधिकार सौंपने में असमर्थता',
  },
  temperament: {
    en: 'Simha natives radiate warmth like the Sun itself. Their presence fills a room — they are the natural center of attention whether they seek it or not. Emotionally generous and fiercely loyal, they protect their circle with the ferocity of a lion guarding its pride. Their fixed nature makes them stable and reliable but also resistant to change. When slighted, the wounded lion roars — Leo anger is dramatic but usually short-lived. At their best, they are benevolent monarchs who uplift everyone around them.',
    hi: 'सिंह जातक सूर्य की भाँति उष्णता विकीर्ण करते हैं। उनकी उपस्थिति कमरे को भर देती है — चाहें या न चाहें, वे स्वाभाविक रूप से ध्यान का केन्द्र होते हैं। भावनात्मक रूप से उदार और उग्र रूप से वफादार, वे अपने परिवार की सिंह की भाँति रक्षा करते हैं। उनकी स्थिर प्रकृति उन्हें स्थायी और विश्वसनीय बनाती है किन्तु परिवर्तन के प्रति प्रतिरोधी भी। अपमानित होने पर घायल सिंह दहाड़ता है। अपने सर्वश्रेष्ठ रूप में वे उदार सम्राट हैं जो सबको ऊपर उठाते हैं।',
  },
  appearance: {
    en: 'Broad chest and shoulders, commanding posture, thick or mane-like hair, warm complexion, strong and prominent features, large expressive eyes, regal gait. The overall impression is one of physical power and dignity. Even in casual settings, Leo natives carry themselves with an air of authority.',
    hi: 'चौड़ी छाती और कन्धे, आज्ञाकारी मुद्रा, घने या अयाल-सदृश बाल, उष्ण वर्ण, प्रबल और प्रमुख आकृति, बड़ी अभिव्यक्तिपूर्ण आँखें, राजसी चाल। समग्र प्रभाव शारीरिक शक्ति और गरिमा का होता है।',
  },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER_TENDENCIES = {
  suited: {
    en: 'Government service and administration, politics and diplomacy, performing arts (theater, cinema, music), corporate leadership (CEO, director), military command, sports management, luxury brand management, gold and jewelry business, event management and entertainment, teaching and mentoring at senior levels, cardiology and heart surgery, architecture and grand design',
    hi: 'सरकारी सेवा और प्रशासन, राजनीति और कूटनीति, प्रदर्शन कला (रंगमंच, सिनेमा, संगीत), कॉर्पोरेट नेतृत्व (CEO, निदेशक), सैन्य कमान, खेल प्रबन्धन, विलासिता ब्राण्ड प्रबन्धन, स्वर्ण और आभूषण व्यापार, आयोजन प्रबन्धन और मनोरंजन, वरिष्ठ स्तर पर शिक्षण और मार्गदर्शन, हृदय रोग विज्ञान',
  },
  insight: {
    en: 'Leo natives thrive in positions of authority and visibility. They do not function well as anonymous cogs in a machine — they need recognition, creative freedom, and a stage. The ideal Leo career places them at the center, where their vision and charisma can inspire teams. They are generous bosses who invest in their people, but they demand loyalty and respect in return. Entrepreneurship suits them when the venture is sufficiently grand.',
    hi: 'सिंह जातक अधिकार और दृश्यता के पदों में फलते-फूलते हैं। वे एक मशीन में अनाम पुर्जे के रूप में कार्य नहीं कर सकते — उन्हें मान्यता, सृजनात्मक स्वतन्त्रता और मंच चाहिए। आदर्श सिंह करियर उन्हें केन्द्र में रखता है जहाँ उनकी दृष्टि और करिश्मा टीम को प्रेरित कर सके।',
  },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: {
    en: 'Aries (Mesha): Fellow fire sign — mutual respect, shared ambition, and dynamic partnership. Sagittarius (Dhanu): Fire with fire — philosophical connection, shared love of grandeur, and natural mutual admiration. Gemini (Mithuna): Air feeds fire — intellectual stimulation, social dynamism, and complementary skills. Libra (Tula): Opposite sign attraction — Leo provides direction, Libra provides grace and diplomacy.',
    hi: 'मेष: समान अग्नि राशि — परस्पर सम्मान, साझा महत्वाकांक्षा। धनु: अग्नि-अग्नि — दार्शनिक जुड़ाव, भव्यता का साझा प्रेम। मिथुन: वायु अग्नि को पोषित करती है — बौद्धिक उत्तेजना। तुला: विपरीत राशि आकर्षण — सिंह दिशा देता है, तुला अनुग्रह और कूटनीति।',
  },
  challenging: {
    en: 'Taurus (Vrishabha): Two fixed signs — both stubborn, neither willing to yield. Power struggles over lifestyle and values. Scorpio (Vrishchika): Fixed water drowns fixed fire — intense attraction but equally intense conflict. Control battles and emotional manipulation risks. Capricorn (Makara): Saturn\'s earth against Sun\'s fire — cold pragmatism versus warm idealism. Mutual respect is possible only through shared goals.',
    hi: 'वृषभ: दो स्थिर राशियाँ — दोनों हठी, कोई झुकने को तैयार नहीं। जीवनशैली और मूल्यों पर सत्ता संघर्ष। वृश्चिक: स्थिर जल स्थिर अग्नि को बुझाता है — तीव्र आकर्षण किन्तु समान रूप से तीव्र संघर्ष। मकर: शनि की पृथ्वी सूर्य की अग्नि के विरुद्ध — ठण्डा व्यावहारिकता बनाम उष्ण आदर्शवाद।',
  },
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES_AND_WORSHIP = {
  deity: {
    en: 'Lord Surya (the Sun God) is the primary deity for Simha Rashi. Worship of Surya strengthens the rashi lord and brings vitality, authority, and success. Lord Shiva as Rudra (the fierce form) also resonates with Leo\'s fire and courage. Goddess Durga riding the lion is the feminine expression of Leo\'s protective ferocity.',
    hi: 'सूर्य देव सिंह राशि के प्राथमिक देवता हैं। सूर्य की उपासना राशि स्वामी को बल देती है और जीवनशक्ति, अधिकार और सफलता लाती है। भगवान शिव रुद्र रूप में भी सिंह की अग्नि और साहस से गुंजायमान होते हैं। देवी दुर्गा सिंह पर सवार सिंह की रक्षात्मक उग्रता की स्त्री अभिव्यक्ति हैं।',
  },
  practices: {
    en: 'Offer Arghya (water) to the rising Sun every morning with a copper vessel. Recite Aditya Hridayam Stotra, especially on Sundays. Wear ruby (Manikya) in gold on the ring finger after consulting a Jyotishi. Donate wheat, jaggery, and red cloth on Sundays. Fast on Sundays consuming only one meal. Visit Surya temples, especially Konark and Modhera. Chant the Surya Beej Mantra: Om Hraam Hreem Hraum Sah Suryaya Namah. Practice Surya Namaskar (Sun Salutation) at sunrise.',
    hi: 'प्रतिदिन ताम्र पात्र से उदीयमान सूर्य को अर्घ्य दें। आदित्य हृदयम् स्तोत्र का पाठ करें, विशेषतः रविवार को। ज्योतिषी से परामर्श के बाद अनामिका में स्वर्ण में माणिक्य धारण करें। रविवार को गेहूँ, गुड़ और लाल वस्त्र दान करें। रविवार को एक भोजन का उपवास रखें। सूर्य मन्दिर जाएँ। सूर्य बीज मन्त्र: ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः। सूर्योदय पर सूर्य नमस्कार करें।',
  },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: {
    en: 'In Vedic mythology, the lion (Simha) is the vahana (vehicle) of Goddess Durga, symbolizing fearless protection and divine authority. The Narasimha avatar of Lord Vishnu — half-man, half-lion — appeared at twilight (neither day nor night), on a threshold (neither inside nor outside), and placed the demon Hiranyakashipu on his lap (neither earth nor sky) to slay him. This story encapsulates Leo\'s essence: the willingness to break all conventional rules to protect dharma. The lion also appears in Emperor Ashoka\'s capital at Sarnath — four lions facing the four directions, now India\'s national emblem. From the cosmic to the political, the lion is the universal symbol of sovereign authority and fearless truth.',
    hi: 'वैदिक पौराणिक कथाओं में सिंह देवी दुर्गा का वाहन है, जो निर्भय रक्षा और दिव्य अधिकार का प्रतीक है। भगवान विष्णु का नरसिंह अवतार — अर्ध-मानव, अर्ध-सिंह — गोधूलि बेला में (न दिन न रात), देहली पर (न भीतर न बाहर) प्रकट हुआ और दैत्य हिरण्यकशिपु को अपनी गोद में (न पृथ्वी न आकाश) रखकर वध किया। यह कथा सिंह के सार को समेटती है: धर्म की रक्षा के लिए सभी परम्परागत नियमों को तोड़ने की तत्परता। सिंह सम्राट अशोक के सारनाथ स्तम्भ पर भी दिखता है — चार दिशाओं की ओर मुख किये चार सिंह, अब भारत का राष्ट्रीय प्रतीक।',
  },
  vedic: {
    en: 'The Rigveda references the Sun as a lion traversing the sky — "the golden-maned lion of heaven." This cosmic lion metaphor connects Surya (the Sun) to his zodiacal domain. In the Puranas, the Sun\'s chariot is drawn by seven horses, and his rays are described as a lion\'s mane radiating in all directions. The Taittiriya Upanishad associates the heart (hridaya) with the Sun and fire — both of which are Leo\'s primary significations. The ancient seers saw the lion not as a predator but as the embodiment of tejas (radiance) and dharma (righteous authority).',
    hi: 'ऋग्वेद सूर्य को आकाश में विचरण करने वाले सिंह के रूप में सन्दर्भित करता है — "स्वर्ग का स्वर्ण-अयाल सिंह।" यह ब्रह्माण्डीय सिंह रूपक सूर्य को उसके राशि क्षेत्र से जोड़ता है। पुराणों में सूर्य का रथ सात अश्वों द्वारा खींचा जाता है और उनकी किरणें सभी दिशाओं में विकीर्ण सिंह की अयाल के रूप में वर्णित हैं। तैत्तिरीय उपनिषद हृदय को सूर्य और अग्नि से जोड़ता है — दोनों सिंह के प्राथमिक कारकत्व हैं।',
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/surya', label: { en: 'Surya — The Sun (Leo\'s Ruler)', hi: 'सूर्य — सिंह का स्वामी' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/kanya', label: { en: 'Kanya (Virgo) — Next Rashi', hi: 'कन्या — अगली राशि' } },
  { href: '/learn/karka', label: { en: 'Karka (Cancer) — Previous Rashi', hi: 'कर्क — पिछली राशि' } },
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Vedic Astrology', hi: 'वैदिक ज्योतिष में योग' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function SimhaPage() {
  const locale = useLocale();
  const ml = useML(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);

  let section = 0;
  const next = () => ++section;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/15 border border-red-500/30 mb-4">
          <span className="text-4xl">♌</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Simha — Leo', hi: 'सिंह राशि' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The fifth sign of the zodiac — the royal lion, ruled by the Sun, embodying authority, creativity, and the fire of the soul.', hi: 'राशिचक्र की पाँचवीं राशि — राजसी सिंह, सूर्य द्वारा शासित, अधिकार, सृजनात्मकता और आत्मा की अग्नि का मूर्त रूप।' })}
        </p>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Sign Overview ── */}
      <LessonSection number={next()} title={ml({ en: 'Sign Overview', hi: 'राशि परिचय' })}>
        <p style={bf}>{ml({ en: 'Simha (Leo) is the fifth sign of the zodiac, spanning 120° to 150° of the ecliptic. It is a fixed fire sign ruled by the Sun — the king of the Navagrahas. Leo is the only sign ruled by a luminary (the Sun), giving it unique characteristics: it is simultaneously creative and authoritative, warm and commanding, generous and proud. The lion symbolizes sovereign power tempered by nobility. In the natural zodiac, Leo rules the 5th house of creativity, children, intelligence, and purva punya (past-life merit).', hi: 'सिंह राशिचक्र की पाँचवीं राशि है, क्रान्तिवृत्त के 120° से 150° तक फैली। यह सूर्य — नवग्रहों के राजा — द्वारा शासित स्थिर अग्नि राशि है। सिंह एकमात्र राशि है जिसका स्वामी ज्योति (सूर्य) है, जो इसे अद्वितीय गुण देता है: एक साथ सृजनात्मक और अधिकारपूर्ण, उष्ण और आज्ञाकारी, उदार और गर्वीला। प्राकृतिक राशिचक्र में सिंह 5वें भाव पर शासन करता है — सृजनात्मकता, संतान, बुद्धि और पूर्व पुण्य का भाव।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGN_OVERVIEW).map(([key, val]) => (
            <div key={key} className="bg-red-500/5 rounded-lg border border-red-500/15 p-3">
              <span className="text-red-400 text-xs uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Svarupa (Nature of Signs)" />
      </LessonSection>

      {/* ── 2. Personality Traits ── */}
      <LessonSection number={next()} title={ml({ en: 'Personality & Temperament', hi: 'व्यक्तित्व एवं स्वभाव' })}>
        <p style={bf}>{ml(PERSONALITY_TRAITS.temperament)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strengths', hi: 'गुण' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.strengths)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weaknesses', hi: 'दुर्बलताएँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.weaknesses)}</p>
          </div>
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 mt-4">
          <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Physical Appearance', hi: 'शारीरिक स्वरूप' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.appearance)}</p>
        </div>
        <ClassicalReference shortName="PD" chapter="Ch. 2 — Rashi Characteristics" />
      </LessonSection>

      {/* ── 3. Nakshatras in Simha ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Simha', hi: 'सिंह में नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Three nakshatras occupy Leo, each coloring the sign with a distinct energy. Magha brings ancestral authority, Purva Phalguni adds creative pleasure, and the first pada of Uttara Phalguni introduces benevolent patronage. Understanding which nakshatra a planet occupies within Leo gives far more precise predictions than the sign alone.', hi: 'तीन नक्षत्र सिंह में स्थित हैं, प्रत्येक राशि को एक विशिष्ट ऊर्जा से रंगता है। मघा पैतृक अधिकार लाता है, पूर्व फाल्गुनी सृजनात्मक आनन्द जोड़ता है, और उत्तर फाल्गुनी का प्रथम पाद उदार संरक्षण का परिचय देता है।' })}</p>
        {NAKSHATRAS_IN_SIGN.map((n, i) => (
          <div key={i} className="mb-5 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(n.name)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">{ml(n.ruler)}</span>
              <span className="text-xs text-text-secondary italic">{ml(n.deity)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.desc)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Simha', hi: 'सिंह में ग्रह गरिमा' })}>
        <p style={bf} className="mb-4">{ml(PLANETARY_DIGNITIES_HERE.note)}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.ownSign.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">Own Sign</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.ownSign.desc)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.moolatrikona.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">Moolatrikona</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.moolatrikona.desc)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Moolatrikona and Own Sign Definitions" />
      </LessonSection>

      {/* ── 5. Each Planet in Simha ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Simha', hi: 'सिंह में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'A planet\'s behavior in Leo is shaped by its relationship with the Sun. Friends (Moon, Mars, Jupiter) thrive here — their energies complement the royal flame. Enemies (Venus, Saturn) struggle — their agendas conflict with the Sun\'s sovereignty. Neutral Mercury adapts but becomes fixed in expression. The shadow planets (Rahu, Ketu) amplify or dissolve Leo\'s ego-driven nature.', hi: 'सिंह में ग्रह का व्यवहार सूर्य से उसके सम्बन्ध द्वारा आकार लेता है। मित्र (चन्द्र, मंगल, गुरु) यहाँ फलते-फूलते हैं। शत्रु (शुक्र, शनि) संघर्ष करते हैं। तटस्थ बुध अनुकूल होता है किन्तु अभिव्यक्ति में स्थिर हो जाता है। छाया ग्रह (राहु, केतु) सिंह की अहंकार-प्रवृत्ति को बढ़ाते या विलीन करते हैं।' })}</p>
        {EACH_PLANET_IN_SIGN.map((p, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                p.dignity.includes('Own') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                p.dignity.includes('Friend') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                p.dignity.includes('Enemy') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
              }`}>{p.dignity}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Visheshaphala (Specific Effects of Planets)" />
      </LessonSection>

      {/* ── 6. Career ── */}
      <LessonSection number={next()} title={ml({ en: 'Career & Professional Tendencies', hi: 'करियर एवं व्यावसायिक प्रवृत्तियाँ' })}>
        <p style={bf}>{ml(CAREER_TENDENCIES.insight)}</p>
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 mt-4">
          <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Suited Professions', hi: 'उपयुक्त व्यवसाय' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(CAREER_TENDENCIES.suited)}</p>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Leo natives who work in roles without visibility or creative freedom often feel deeply unfulfilled. The path to satisfaction is not just a good salary — it is a stage where their vision matters and their leadership is acknowledged.', hi: 'सिंह जातक जो दृश्यता या सृजनात्मक स्वतन्त्रता के बिना भूमिकाओं में काम करते हैं, प्रायः गहरी अतृप्ति अनुभव करते हैं। सन्तुष्टि का मार्ग केवल अच्छा वेतन नहीं — वह मंच है जहाँ उनकी दृष्टि मायने रखती है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 7. Compatibility ── */}
      <LessonSection number={next()} title={ml({ en: 'Compatibility & Relationships', hi: 'अनुकूलता एवं सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Leo\'s compatibility is shaped by fire\'s need for fuel (air signs) and expression (fellow fire signs). Water and earth signs can provide grounding but risk extinguishing Leo\'s flame. The key to any Leo partnership: respect their need for recognition and they will be the most generous, loyal, and protective partner imaginable.', hi: 'सिंह की अनुकूलता अग्नि की ईंधन (वायु राशियाँ) और अभिव्यक्ति (अग्नि राशियाँ) की आवश्यकता से आकार लेती है। जल और पृथ्वी राशियाँ आधार दे सकती हैं किन्तु सिंह की ज्वाला बुझाने का जोखिम है।' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Best Matches', hi: 'सर्वश्रेष्ठ जोड़ी' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.best)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Challenging Matches', hi: 'चुनौतीपूर्ण जोड़ी' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.challenging)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 8. Remedies & Worship ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies & Worship', hi: 'उपाय एवं उपासना' })}>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Presiding Deity', hi: 'अधिष्ठात्र देवता' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.deity)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Recommended Practices', hi: 'अनुशंसित अभ्यास' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.practices)}</p>
          </div>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'For Simha natives, the most powerful remedy is behavioral: cultivate humility alongside authority. The Sun gives freely — its light reaches all without discrimination. Emulate this quality: lead with generosity, not ego.', hi: 'सिंह जातकों के लिए सबसे शक्तिशाली उपाय व्यावहारिक है: अधिकार के साथ विनम्रता विकसित करें। सूर्य मुक्त रूप से देता है — उसका प्रकाश बिना भेदभाव सबतक पहुँचता है। इस गुण का अनुकरण करें।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Vedic Context', hi: 'पौराणिक कथा एवं वैदिक संदर्भ' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Lion in Hindu Mythology', hi: 'हिन्दू पौराणिक कथाओं में सिंह' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Vedic & Upanishadic References', hi: 'वैदिक एवं उपनिषदीय संदर्भ' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.vedic)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Sign Characteristics and Mythology" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Simha (Leo) is the fixed fire sign ruled by the Sun — the seat of authority, creativity, and the soul\'s self-expression in the zodiac.', hi: 'सिंह सूर्य द्वारा शासित स्थिर अग्नि राशि है — राशिचक्र में अधिकार, सृजनात्मकता और आत्मा की आत्माभिव्यक्ति का स्थान।' }),
        ml({ en: 'Nakshatras: Magha (Ketu), Purva Phalguni (Venus), and Uttara Phalguni pada 1 (Sun). Each brings ancestral karma, creative pleasure, and benevolent patronage.', hi: 'नक्षत्र: मघा (केतु), पूर्व फाल्गुनी (शुक्र), उत्तर फाल्गुनी पाद 1 (सूर्य)। प्रत्येक पैतृक कर्म, सृजनात्मक आनन्द और उदार संरक्षण लाता है।' }),
        ml({ en: 'Sun is in own sign and moolatrikona here (0°-20°). No planet is exalted or debilitated in Leo. Friends (Moon, Mars, Jupiter) thrive; enemies (Venus, Saturn) struggle.', hi: 'सूर्य यहाँ स्वराशि और मूलत्रिकोण (0°-20°) में है। कोई ग्रह सिंह में उच्च या नीच नहीं। मित्र फलते हैं; शत्रु संघर्ष करते हैं।' }),
        ml({ en: 'Leo natives are born leaders with magnetic charisma but must guard against pride. Remedy: worship Surya, offer Arghya at sunrise, and cultivate humility alongside authority.', hi: 'सिंह जातक जन्मजात नेता हैं किन्तु गर्व से सावधान रहना चाहिए। उपाय: सूर्य पूजा, सूर्योदय पर अर्घ्य, और अधिकार के साथ विनम्रता विकसित करें।' }),
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
