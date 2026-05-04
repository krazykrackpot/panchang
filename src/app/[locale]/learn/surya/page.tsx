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
  { devanagari: 'सूर्य', transliteration: 'Sūrya', meaning: { en: 'The Sun — the soul of the cosmos', hi: 'सूर्य — ब्रह्माण्ड की आत्मा' } },
  { devanagari: 'आत्मकारक', transliteration: 'Ātmakāraka', meaning: { en: 'Significator of the soul', hi: 'आत्मा का कारक' } },
  { devanagari: 'प्रत्यक्षदेव', transliteration: 'Pratyakṣadeva', meaning: { en: 'The visible God', hi: 'प्रत्यक्ष देवता' } },
  { devanagari: 'दिनकर', transliteration: 'Dinakara', meaning: { en: 'Maker of the day', hi: 'दिन का निर्माता' } },
  { devanagari: 'सविता', transliteration: 'Savitā', meaning: { en: 'The vivifier, the impeller', hi: 'प्रेरक, जीवनदाता' } },
  { devanagari: 'भानु', transliteration: 'Bhānu', meaning: { en: 'The luminous one', hi: 'प्रकाशमान' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Aries (Mesha) — deepest exaltation at 10°', hi: 'मेष — 10° पर परम उच्च' },
  debilitation: { en: 'Libra (Tula) — deepest debilitation at 10°', hi: 'तुला — 10° पर परम नीच' },
  ownSign: { en: 'Leo (Simha)', hi: 'सिंह' },
  moolatrikona: { en: 'Leo 0°–20°', hi: 'सिंह 0°–20°' },
  friends: { en: 'Moon, Mars, Jupiter', hi: 'चन्द्र, मंगल, गुरु' },
  enemies: { en: 'Venus, Saturn', hi: 'शुक्र, शनि' },
  neutral: { en: 'Mercury', hi: 'बुध' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Father, king, government authority, leader, physician', hi: 'पिता, राजा, सरकारी अधिकारी, नेता, चिकित्सक' },
  bodyParts: { en: 'Heart, bones, spine, right eye (male) / left eye (female), stomach, head', hi: 'हृदय, अस्थि, रीढ़, दायाँ नेत्र (पुरुष) / बायाँ नेत्र (स्त्री), उदर, मस्तक' },
  professions: { en: 'Government service, politics, medicine, administration, goldsmithing, temple priest', hi: 'सरकारी सेवा, राजनीति, चिकित्सा, प्रशासन, स्वर्णकारी, पुजारी' },
  materials: { en: 'Gold, copper, ruby (Manikya), wheat, saffron, red sandalwood', hi: 'स्वर्ण, ताम्र, माणिक्य, गेहूँ, केसर, रक्त चन्दन' },
  direction: { en: 'East', hi: 'पूर्व' },
  day: { en: 'Sunday (Ravivara)', hi: 'रविवार' },
  color: { en: 'Deep red / copper', hi: 'गहरा लाल / ताम्र वर्ण' },
  season: { en: 'Grishma (Summer)', hi: 'ग्रीष्म ऋतु' },
  taste: { en: 'Pungent (Katu)', hi: 'कटु (तीखा)' },
  guna: { en: 'Sattva', hi: 'सत्त्व' },
  element: { en: 'Fire (Agni)', hi: 'अग्नि तत्त्व' },
  gender: { en: 'Masculine', hi: 'पुल्लिंग' },
  nature: { en: 'Cruel / Malefic (Krura Graha) — but a natural benefic for dharma', hi: 'क्रूर ग्रह — किन्तु धर्म के लिए स्वाभाविक शुभ' },
};

// ─── Sun in 12 Signs ───────────────────────────────────────────────────
const SUN_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: 'Exalted',
    effect: { en: 'Sun is exalted here — maximum confidence, leadership ability, pioneering spirit. The native commands natural authority. Strong health, courage, and initiative. Can be domineering if afflicted. Government positions, military, or entrepreneurship come naturally. The 10° point is the deepest exaltation — kings are born with this placement.', hi: 'सूर्य यहाँ उच्च है — अधिकतम आत्मविश्वास, नेतृत्व क्षमता, अग्रणी भावना। जातक में स्वाभाविक अधिकार होता है। उत्तम स्वास्थ्य, साहस और पहल। पीड़ित होने पर दबंग हो सकता है।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: 'Neutral',
    effect: { en: 'Sun in a Venus-ruled sign creates a person who values material comfort and aesthetic beauty but may struggle with ego in relationships. Steady accumulation of wealth, love of fine arts and luxury. Fixed determination but potential stubbornness. Good for finance, agriculture, and artistic pursuits.', hi: 'शुक्र-शासित राशि में सूर्य भौतिक सुख और सौन्दर्य को महत्त्व देता है। धन का स्थिर संचय, ललित कला और विलास का प्रेम। दृढ़ संकल्प किन्तु हठी हो सकता है।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: 'Neutral',
    effect: { en: 'Sun in Mercury\'s sign gives intellectual brilliance, communication skills, and versatility. The native shines through writing, teaching, or commerce. Dual nature can scatter focus. Quick wit but may lack emotional depth. Good for journalism, education, trade, and literary work.', hi: 'बुध की राशि में सूर्य बौद्धिक प्रतिभा, संवाद कौशल और बहुमुखी प्रतिभा देता है। लेखन, शिक्षण या वाणिज्य में चमकता है। द्वैत स्वभाव ध्यान बिखेर सकता है।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: 'Friend\'s sign',
    effect: { en: 'Sun in Moon\'s sign — the soul illuminates the mind. Deep emotional intelligence, strong connection to mother and homeland. Natural nurturing authority. Can rise in government through public service. Emotional sensitivity may be both strength and vulnerability. Excellent for hospitality, social work, and psychology.', hi: 'चन्द्र की राशि में सूर्य — आत्मा मन को प्रकाशित करती है। गहरी भावनात्मक बुद्धि, माता और मातृभूमि से गहरा जुड़ाव। लोक सेवा से सरकार में उन्नति।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: 'Own sign',
    effect: { en: 'Sun in its own sign — the king on his throne. Maximum self-expression, dignity, generosity, and creative power. Natural born leaders, performers, and administrators. Regal bearing, strong willpower, and magnetic personality. Can be arrogant if unchecked. This is the most powerful placement for authority, fame, and governmental positions.', hi: 'सूर्य अपनी राशि में — राजा अपने सिंहासन पर। अधिकतम आत्माभिव्यक्ति, गरिमा, उदारता और सृजनात्मक शक्ति। स्वाभाविक नेता, कलाकार और प्रशासक।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: 'Neutral',
    effect: { en: 'Sun in Mercury\'s earth sign gives analytical precision, service orientation, and humility. The native shines through detailed work, healing professions, and practical expertise. Health consciousness is strong. Can be overly critical or perfectionist. Excellent for medicine, accounting, research, and skilled craftsmanship.', hi: 'बुध की पृथ्वी राशि में सूर्य विश्लेषणात्मक सूक्ष्मता, सेवा भाव और विनम्रता देता है। विस्तृत कार्य, चिकित्सा और व्यावहारिक विशेषज्ञता में चमकता है।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: 'Debilitated',
    effect: { en: 'Sun is debilitated here — the ego dissolves in the desire for partnership and compromise. Difficulty asserting oneself, tendency to define identity through relationships. The deepest fall at 10°. However, Neecha Bhanga (cancellation of debilitation) is common and can produce diplomats, judges, and skilled negotiators. The lesson: find inner authority without domination.', hi: 'सूर्य यहाँ नीच है — अहंकार साझेदारी और समझौते की इच्छा में विलीन हो जाता है। आत्म-स्थापना में कठिनाई। 10° पर सबसे गहरी नीचता। तथापि नीच भंग सामान्य है।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: 'Friend\'s sign',
    effect: { en: 'Sun in Mars\'s water sign — intense, transformative, and deeply perceptive. The native has X-ray vision into hidden matters. Research, occult sciences, surgery, and investigation are natural domains. Powerful regenerative ability but can be secretive and manipulative. Strong willpower that survives and thrives through crisis.', hi: 'मंगल की जल राशि में सूर्य — तीव्र, परिवर्तनकारी और गहन अन्तर्दृष्टि। छिपे विषयों में एक्स-रे दृष्टि। शोध, गूढ़ विज्ञान, शल्य चिकित्सा स्वाभाविक क्षेत्र।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Friend\'s sign',
    effect: { en: 'Sun in Jupiter\'s fire sign — the dharmic warrior. Strong moral compass, love of philosophy, higher education, and long-distance travel. Natural teachers, preachers, judges, and advisors. Optimistic and expansive but can be preachy. Excellent for law, religion, academia, and international careers.', hi: 'गुरु की अग्नि राशि में सूर्य — धार्मिक योद्धा। प्रबल नैतिक दिशा, दर्शन, उच्च शिक्षा और दीर्घ यात्रा का प्रेम। स्वाभाविक शिक्षक, उपदेशक, न्यायाधीश।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: 'Enemy\'s sign',
    effect: { en: 'Sun in Saturn\'s earth sign — authority through discipline, patience, and hard work. Slow but steady rise to power. The native earns respect through perseverance, not birthright. Government bureaucracy, large organizations, and traditional hierarchies suit this placement. Can be cold or overly ambitious.', hi: 'शनि की पृथ्वी राशि में सूर्य — अनुशासन, धैर्य और कठिन परिश्रम से अधिकार। धीमी किन्तु स्थिर उन्नति। सरकारी नौकरशाही और बड़े संगठन अनुकूल।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: 'Enemy\'s sign',
    effect: { en: 'Sun in Saturn\'s air sign — the reformer and humanitarian. Identity tied to social causes, networks, and collective progress. Unconventional leadership style. Can struggle with personal ego vs. group identity. Good for technology, social organizations, NGOs, and democratic institutions. Scientific temperament.', hi: 'शनि की वायु राशि में सूर्य — सुधारक और मानवतावादी। सामाजिक कारणों, नेटवर्क और सामूहिक प्रगति से जुड़ी पहचान। अपरम्परागत नेतृत्व शैली।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Friend\'s sign',
    effect: { en: 'Sun in Jupiter\'s water sign — the spiritual seeker. Identity dissolves into universal compassion and artistic vision. Intuitive, empathetic, and drawn to spiritual life. Can lack worldly ambition. Excellent for music, art, healing, charity, and monastic pursuits. The soul remembers its divine origin here.', hi: 'गुरु की जल राशि में सूर्य — आध्यात्मिक साधक। पहचान सार्वभौमिक करुणा और कलात्मक दृष्टि में विलीन। अन्तर्ज्ञानी, सहानुभूतिपूर्ण, आध्यात्मिक जीवन की ओर आकर्षित।' } },
];

// ─── Sun in 12 Houses ──────────────────────────────────────────────────
const SUN_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'Strong personality, leadership qualities, good health and vitality. The native is confident, authoritative, and self-driven. Can indicate government connections. If afflicted, ego problems and strained relationships with father. Physical constitution is generally robust. This is one of the best placements for worldly success — the soul shines through the body directly.', hi: 'सुदृढ़ व्यक्तित्व, नेतृत्व गुण, उत्तम स्वास्थ्य और जीवनशक्ति। आत्मविश्वासी, अधिकारपूर्ण और स्वप्रेरित। सरकारी संबंध संभव। पीड़ित होने पर अहंकार की समस्या।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Wealth through government or authority positions. Commanding speech with natural authority. The native can earn from gold, gems, or government contracts. Family pride is strong. Right eye may have issues if afflicted. Can indicate wealth from father\'s side. Speech carries weight and can influence others. Food preferences tend toward warm, spiced, and royal cuisine.', hi: 'सरकारी या अधिकार पदों से धन। अधिकारपूर्ण वाणी। स्वर्ण, रत्न या सरकारी अनुबंधों से कमाई। पारिवारिक गर्व प्रबल।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Courageous, bold communication, strong willpower. Good for writing, media, and short journeys. May dominate siblings. The native has powerful arms and initiative. Artistic and creative expression is strong. Can indicate success in publishing, advertising, or military communication roles. Younger siblings may face challenges.', hi: 'साहसी, स्पष्ट संवाद, दृढ़ इच्छाशक्ति। लेखन, मीडिया और लघु यात्रा के लिए शुभ। भाई-बहनों पर प्रभुत्व हो सकता है। शक्तिशाली भुजाएँ और पहल।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'Struggles with domestic peace and relationship with mother. The Sun burns the house of comfort — the native may live away from birthplace. However, can own property and vehicles through government connection. Internal restlessness drives achievement. The heart burns with ambition rather than contentment. Government housing or land benefits possible.', hi: 'घरेलू शान्ति और माता के साथ सम्बन्ध में कठिनाई। सूर्य सुख के भाव को जलाता है — जातक जन्मभूमि से दूर रह सकता है। तथापि सरकारी सम्पत्ति संभव।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Brilliant intelligence, creative genius, and natural authority in education. The native shines in speculative ventures, politics, and performing arts. Children may be fewer but distinguished. Romance carries a regal quality. Mantra siddhi and spiritual practices are strong. Government recognition for intellectual contributions. Can produce ministers, advisors, and creative directors.', hi: 'प्रतिभाशाली बुद्धि, सृजनात्मक प्रतिभा, शिक्षा में स्वाभाविक अधिकार। सट्टा, राजनीति और प्रदर्शन कला में चमक। संतान कम किन्तु विशिष्ट। मन्त्र सिद्धि प्रबल।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'Powerful placement — Sun destroys enemies, overcomes obstacles, and thrives in competitive environments. Excellent for law, military, medicine, and civil service. Victory in litigation and disputes. The native serves through authority. Can indicate digestive fire issues but overall strong resistance to disease. One of the best placements for a government career.', hi: 'शक्तिशाली स्थिति — सूर्य शत्रुओं का नाश करता है, बाधाओं पर विजय पाता है। विधि, सेना, चिकित्सा, सिविल सेवा के लिए उत्कृष्ट। मुकदमों में विजय।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'Sun here sets (7th is the western horizon) — the ego may overpower partnerships. Late marriage or dominating spouse dynamics. However, the partner may have a strong personality, possibly connected to government. Business partnerships with authority figures. Travel to foreign lands for work. The native must learn to share power.', hi: 'सूर्य यहाँ अस्त होता है — अहंकार साझेदारियों पर हावी हो सकता है। विलम्बित विवाह या दबंग वैवाहिक गतिशीलता। तथापि जीवनसाथी प्रबल व्यक्तित्व का।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'Hidden power, occult knowledge, and transformative experiences. The native may have a complicated relationship with father or authority. Inheritance is possible but may come through struggle. Interest in research, occult sciences, and mysteries. Health issues related to heart, bones, or eyes may arise. Government secrets or classified work. Life transforms through crises.', hi: 'गुप्त शक्ति, गूढ़ ज्ञान, परिवर्तनकारी अनुभव। पिता या अधिकार के साथ जटिल सम्बन्ध। विरासत संभव किन्तु संघर्ष से। शोध और रहस्य में रुचि।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'Extremely auspicious — the soul aligned with dharma. Father is usually prominent and successful. Strong moral compass, love of philosophy, law, and religion. Long-distance travel for pilgrimage or education. The native becomes a guru figure. Government support for religious or educational activities. This placement can produce judges, professors, and spiritual leaders. Luck is strong.', hi: 'अत्यन्त शुभ — आत्मा धर्म के साथ एकरूप। पिता प्रायः प्रतिष्ठित और सफल। दर्शन, विधि और धर्म का प्रेम। तीर्थयात्रा या शिक्षा हेतु दीर्घ यात्रा। भाग्य प्रबल।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'The most powerful angular placement — Sun is Digbali (directional strength) here. Commanding career, fame, and public recognition. Government positions at the highest levels. The native\'s profession defines their identity. Strong relationship with authority and father. Can become a public figure, administrator, or political leader. Honors and awards are likely.', hi: 'सबसे शक्तिशाली केन्द्र स्थिति — सूर्य यहाँ दिग्बली। प्रभावशाली करियर, यश और सार्वजनिक मान्यता। उच्चतम स्तर पर सरकारी पद। पद व्यक्ति की पहचान बनाता है।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Excellent for wealth and fulfillment of desires. Large income, powerful social network, and influential friends. Elder siblings may be prominent. Gains through government, speculation, or large organizations. The native achieves their ambitions. Can indicate political connections and community leadership. Financial success comes through authority and recognition.', hi: 'धन और इच्छा पूर्ति के लिए उत्कृष्ट। बड़ी आय, शक्तिशाली सामाजिक नेटवर्क, प्रभावशाली मित्र। सरकार, सट्टा या बड़े संगठनों से लाभ। महत्वाकांक्षा पूर्ण होती है।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'Sun here loses its outward fire — the ego dissolves into spiritual seeking, foreign lands, and isolation. Can indicate government expenses, travel abroad for work, or imprisonment in extreme cases. The native\'s authority operates behind the scenes. Hospitals, ashrams, research labs, and foreign postings are indicated. Spiritual enlightenment through surrender of ego. Left eye may be affected.', hi: 'सूर्य यहाँ बाह्य अग्नि खो देता है — अहंकार आध्यात्मिक खोज, विदेश और एकान्त में विलीन। सरकारी खर्च, विदेश यात्रा या कारावास। पर्दे के पीछे अधिकार।' } },
];

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 6,
  overview: {
    en: 'The Sun\'s Vimshottari Mahadasha lasts 6 years — the shortest of all planetary periods. Despite its brevity, it is one of the most transformative. During this period, the native\'s relationship with authority, father, government, and personal identity come into sharp focus. Career advancement or setbacks in government are likely. Health of the heart and eyes may need attention. The soul\'s true purpose becomes visible.',
    hi: 'सूर्य की विंशोत्तरी महादशा 6 वर्ष चलती है — सभी ग्रह काल में सबसे छोटी। संक्षिप्त होने के बावजूद, यह सबसे परिवर्तनकारी में से एक है। इस अवधि में अधिकार, पिता, सरकार और व्यक्तिगत पहचान के साथ सम्बन्ध स्पष्ट होते हैं।',
  },
  strongSun: {
    en: 'If Sun is well-placed (own sign, exalted, or in a kendra/trikona): Promotion, government recognition, father\'s support, health improvement, spiritual clarity, leadership opportunities, land or property from government.',
    hi: 'यदि सूर्य सुस्थित है (स्वराशि, उच्च, या केन्द्र/त्रिकोण में): पदोन्नति, सरकारी मान्यता, पिता का सहयोग, स्वास्थ्य सुधार, आध्यात्मिक स्पष्टता, नेतृत्व के अवसर।',
  },
  weakSun: {
    en: 'If Sun is afflicted (debilitated, combust, or in dusthana): Conflicts with authority, father\'s health issues, eye/heart problems, ego clashes at work, government penalties, loss of position.',
    hi: 'यदि सूर्य पीड़ित है (नीच, अस्त, या दुस्थान में): अधिकार से संघर्ष, पिता के स्वास्थ्य में समस्या, नेत्र/हृदय रोग, कार्यस्थल पर अहंकार टकराव, सरकारी दण्ड।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', transliteration: 'Om Hraam Hreem Hraum Sah Suryaya Namah', count: '7,000 or 6,000 times in 40 days', en: 'The Surya Beej Mantra — chant facing east at sunrise, preferably on Sundays', hi: 'सूर्य बीज मन्त्र — रविवार को सूर्योदय के समय पूर्व दिशा की ओर मुख करके जाप करें' },
  gemstone: { en: 'Ruby (Manikya) — set in gold, worn on the ring finger of the right hand on a Sunday during Shukla Paksha sunrise. Minimum 3 carats. Must touch the skin.', hi: 'माणिक्य — स्वर्ण में जड़ित, रविवार को शुक्ल पक्ष में सूर्योदय के समय दाहिने हाथ की अनामिका में धारण करें। न्यूनतम 3 कैरेट।' },
  charity: { en: 'Donate wheat, jaggery (gur), copper, red cloth, or red flowers on Sundays. Feed cows with wheat and jaggery.', hi: 'रविवार को गेहूँ, गुड़, ताम्र, लाल वस्त्र या लाल पुष्प दान करें। गायों को गेहूँ और गुड़ खिलाएँ।' },
  fasting: { en: 'Sunday fasting — eat only one meal after sunset, or consume only fruits and milk during the day.', hi: 'रविवार का उपवास — केवल सूर्यास्त के बाद एक भोजन करें, या दिन में केवल फल और दूध लें।' },
  worship: { en: 'Offer water (Arghya) to the rising Sun every morning with a copper vessel, adding red flowers and red sandalwood. Recite Aditya Hridayam Stotra. Visit Surya temples on Sundays.', hi: 'प्रतिदिन ताम्र पात्र से उदीयमान सूर्य को अर्घ्य दें, लाल पुष्प और रक्त चन्दन मिलाएँ। आदित्य हृदयम् स्तोत्र का पाठ करें। रविवार को सूर्य मन्दिर जाएँ।' },
  yantra: { en: 'Surya Yantra — a 3×3 magic square with a sum of 15 in each row/column. Install on a copper plate, worship on Sundays.', hi: 'सूर्य यन्त्र — 3×3 जादुई वर्ग जिसमें प्रत्येक पंक्ति/स्तम्भ का योग 15 है। ताम्र पत्र पर स्थापित करें, रविवार को पूजन करें।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'Surya is the son of Sage Kashyapa and Aditi, making him one of the twelve Adityas. He rides a chariot drawn by seven horses (representing the seven days and the seven colors of light) driven by Aruna, the god of dawn. His wives are Sanjna (Consciousness) and Chhaya (Shadow). When Sanjna could not bear his brilliance, she left her shadow (Chhaya) and performed tapas in the forest — this story explains the birth of Shani (Saturn) from Chhaya, and the eternal tension between Sun and Saturn in Jyotish.',
    hi: 'सूर्य ऋषि कश्यप और अदिति के पुत्र हैं, जो उन्हें बारह आदित्यों में से एक बनाता है। वे सात अश्वों (सप्त वार और सप्त वर्णों का प्रतीक) से खींचे रथ पर सवार होते हैं, जिसका सारथी अरुण (उषा देव) है। उनकी पत्नियाँ संज्ञा (चेतना) और छाया हैं। जब संज्ञा उनके तेज को सहन नहीं कर सकी, तो उसने अपनी छाया छोड़कर वन में तपस्या की — यह कथा छाया से शनि के जन्म और ज्योतिष में सूर्य-शनि के शाश्वत तनाव की व्याख्या करती है।',
  },
  temples: {
    en: 'Major Surya temples: Konark Sun Temple (Odisha) — a UNESCO World Heritage Site shaped as a massive chariot; Modhera Sun Temple (Gujarat) — designed so the first rays of the equinox sun illuminate the sanctum; Dakshinaarka Temple (Varanasi) — one of the oldest Sun temples in India; Suryanaar Kovil (Tamil Nadu) — one of the Navagraha temples.',
    hi: 'प्रमुख सूर्य मन्दिर: कोणार्क सूर्य मन्दिर (ओडिशा) — विशाल रथ आकृति का UNESCO विश्व धरोहर; मोढेरा सूर्य मन्दिर (गुजरात) — विषुव सूर्य की पहली किरणें गर्भगृह को प्रकाशित करें; दक्षिणार्क मन्दिर (वाराणसी) — भारत के सबसे प्राचीन सूर्य मन्दिरों में; सूर्यनार कोविल (तमिलनाडु) — नवग्रह मन्दिरों में एक।',
  },
  gayatri: {
    en: 'The Gayatri Mantra (Rigveda 3.62.10) is the most sacred hymn dedicated to Savita (the Sun): "Om Bhur Bhuvaḥ Swaḥ, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Naḥ Prachodayat." It means: "We meditate upon the divine light of the luminous Sun; may it illuminate our intellect."',
    hi: 'गायत्री मन्त्र (ऋग्वेद 3.62.10) सविता (सूर्य) को समर्पित सबसे पवित्र स्तुति है: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्।" अर्थ: "हम तेजस्वी सूर्य के दिव्य प्रकाश का ध्यान करते हैं; वह हमारी बुद्धि को प्रेरित करे।"',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Moon', hi: 'चन्द्र' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Father and mother — complementary luminaries. Sun gives soul, Moon gives mind.', hi: 'पिता और माता — परस्पर पूरक ज्योतियाँ। सूर्य आत्मा देता है, चन्द्र मन।' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Fire allies — courage, authority, and action reinforce each other. Sun-Mars conjunction creates Ruchaka-like power.', hi: 'अग्नि मित्र — साहस, अधिकार और कर्म एक-दूसरे को बल देते हैं।' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Guru and king — dharma and authority aligned. This is the basis of many Raja Yogas. Jupiter expands Sun\'s wisdom.', hi: 'गुरु और राजा — धर्म और अधिकार एकरूप। यह अनेक राज योगों का आधार है।' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, relation: { en: 'Neutral (Sun considers Mercury neutral; Mercury considers Sun a friend)', hi: 'सम (सूर्य बुध को सम मानता है; बुध सूर्य को मित्र)' }, note: { en: 'Often conjunct (Budha Aditya Yoga when within 12°) — intellect illuminated by soul. But Mercury combust within ~14° loses analytical independence.', hi: 'प्रायः युति (बुधादित्य योग जब 12° के भीतर) — बुद्धि आत्मा से प्रकाशित। किन्तु ~14° के भीतर अस्त बुध विश्लेषणात्मक स्वतन्त्रता खो देता है।' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'King vs. minister of pleasures — fundamental tension between duty (dharma) and desire (kama). Venus combust is very common and weakens marital/romantic significations.', hi: 'राजा बनाम भोग-विलास का मन्त्री — कर्तव्य (धर्म) और इच्छा (काम) के बीच मौलिक तनाव।' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Father and son in eternal conflict. Sun is authority; Saturn is democracy. Sun is speed; Saturn is delay. Their conjunction or opposition creates intense karmic pressure. Pitru Dosha often involves Sun-Saturn affliction.', hi: 'पिता और पुत्र शाश्वत संघर्ष में। सूर्य अधिकार है; शनि लोकतन्त्र। सूर्य गति है; शनि विलम्ब। इनका संयोग तीव्र कार्मिक दबाव बनाता है।' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Rahu eclipses the Sun — illusion obscures the soul. Grahan Yoga (Sun-Rahu conjunction) can bring sudden rise followed by fall, or fame with scandal. Father may face unusual challenges.', hi: 'राहु सूर्य को ग्रहण करता है — माया आत्मा को ढकती है। ग्रहण योग (सूर्य-राहु युति) अचानक उत्थान फिर पतन ला सकता है।' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Ketu detaches from what Sun represents — the ego surrenders. Sun-Ketu conjunction can indicate spiritual awakening but worldly difficulties, especially with father and government.', hi: 'केतु सूर्य के प्रतिनिधित्व से वैराग्य देता है — अहंकार का समर्पण। सूर्य-केतु युति आध्यात्मिक जागृति किन्तु सांसारिक कठिनाइयाँ ला सकती है।' } },
];

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/combustion', label: { en: 'Planetary Combustion', hi: 'ग्रह अस्त' } },
  { href: '/learn/shadbala', label: { en: 'Shadbala Strength', hi: 'षड्बल' } },
  { href: '/learn/doshas', label: { en: 'Doshas in Kundali', hi: 'कुण्डली में दोष' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
  { href: '/learn/chandra', label: { en: 'Chandra — The Moon', hi: 'चन्द्र' } },
  { href: '/learn/shani', label: { en: 'Shani — Saturn', hi: 'शनि' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function SuryaPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-sun/15 border border-graha-sun/30 mb-4">
          <span className="text-4xl">☉</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Surya — The Sun', hi: 'सूर्य — सूर्य देव' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'Atmakaraka — the significator of the soul, the visible God, the source of all life and authority in Vedic astrology.', hi: 'आत्मकारक — आत्मा का कारक, प्रत्यक्ष देवता, वैदिक ज्योतिष में सभी जीवन और अधिकार का स्रोत।' })}
        </p>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Overview & Nature ── */}
      <LessonSection number={next()} title={ml({ en: 'Overview & Nature', hi: 'परिचय एवं स्वभाव' })}>
        <p style={bf}>{ml({ en: 'Surya is the king of the Navagrahas, the soul (Atman) of the Kaal Purusha, and the source of all light in the horoscope. As a Krura (cruel) graha, he burns what he touches — but this burning purifies. He represents the father, government authority, vitality, and the core identity of a person. Without the Sun, no other planet can function — just as no life exists without sunlight.', hi: 'सूर्य नवग्रहों के राजा, काल पुरुष की आत्मा, और कुण्डली में सभी प्रकाश के स्रोत हैं। क्रूर ग्रह होने से वे जो छूते हैं उसे जलाते हैं — किन्तु यह दहन शुद्ध करता है। वे पिता, सरकारी अधिकार, जीवनशक्ति और व्यक्ति की मूल पहचान का प्रतिनिधित्व करते हैं।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGNIFICATIONS).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-dark text-xs uppercase tracking-wider">{key}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Visheshaphala" />
      </LessonSection>

      {/* ── 2. Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Dignities & Strength', hi: 'गरिमा एवं बल' })}>
        <p style={bf}>{ml({ en: 'A planet\'s dignity determines whether it can express its full potential or is constrained. Sun in Aries at 10° is at the peak of its power — here the soul burns brightest with courage and initiative. In Libra at 10°, the Sun struggles — the ego dissolves in the desire to please others, compromising personal authority.', hi: 'ग्रह की गरिमा यह निर्धारित करती है कि वह अपनी पूर्ण क्षमता व्यक्त कर सकता है या बाधित है। मेष में 10° पर सूर्य अपनी शक्ति के शिखर पर है। तुला में 10° पर सूर्य संघर्ष करता है।' })}</p>
        <div className="space-y-2 mt-4">
          {Object.entries(DIGNITIES).map(([key, val]) => (
            <div key={key} className="flex items-start gap-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-primary text-sm font-bold min-w-[120px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-text-primary text-sm" style={bf}>{ml(val)}</span>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha" />
      </LessonSection>

      {/* ── 3. Sun in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Sun in the Twelve Signs', hi: 'बारह राशियों में सूर्य' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The sign placement of the Sun determines the lens through which the soul expresses itself. In Western astrology this is your "Sun sign" — in Vedic astrology it\'s equally important but read alongside the Moon sign (Rashi) and Ascendant (Lagna).', hi: 'सूर्य की राशि स्थिति यह निर्धारित करती है कि आत्मा किस लेंस से स्वयं को अभिव्यक्त करती है। पाश्चात्य ज्योतिष में यह "सन साइन" है — वैदिक ज्योतिष में यह चन्द्र राशि और लग्न के साथ पढ़ा जाता है।' })}</p>
        {SUN_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(s.sign)}</span>
              {s.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  s.dignity === 'Exalted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  s.dignity === 'Debilitated' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  s.dignity === 'Own sign' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{s.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(s.effect)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 4. Sun in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Sun in the Twelve Houses', hi: 'बारह भावों में सूर्य' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The house placement determines the area of life where the Sun\'s energy concentrates. Sun in a Kendra (1st, 4th, 7th, 10th) gives strong visible authority. In a Trikona (1st, 5th, 9th) it brings dharmic purpose. In Dusthana (6th, 8th, 12th) the results are mixed — struggle leads to hidden strength.', hi: 'भाव स्थिति यह निर्धारित करती है कि सूर्य की ऊर्जा जीवन के किस क्षेत्र में केन्द्रित होती है। केन्द्र (1, 4, 7, 10) में सूर्य प्रत्यक्ष अधिकार देता है। त्रिकोण (1, 5, 9) में धार्मिक उद्देश्य। दुस्थान (6, 8, 12) में मिश्रित — संघर्ष से गुप्त शक्ति।' })}</p>
        {SUN_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-sun/15 border border-graha-sun/30 flex items-center justify-center text-graha-sun text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Planets in Houses)" />
      </LessonSection>

      {/* ── 5. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Surya Mahadasha (6 Years)', hi: 'सूर्य महादशा (6 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Sun Dasha', hi: 'बलवान सूर्य दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongSun)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Sun Dasha', hi: 'दुर्बल सूर्य दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakSun)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 6. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Surya\'s friendships and enmities define how planetary conjunctions and aspects play out. A friend\'s conjunction enhances; an enemy\'s creates friction. These relationships form the basis of Pancha Dha Maitri (five-fold friendship) used in compatibility and transit analysis.', hi: 'सूर्य की मैत्री और शत्रुता यह निर्धारित करती है कि ग्रह युति और दृष्टि कैसे प्रकट होती है। मित्र की युति वृद्धि करती है; शत्रु की घर्षण पैदा करती है। ये सम्बन्ध पंचधा मैत्री का आधार हैं।' })}</p>
        <div className="space-y-3">
          {RELATIONSHIPS.map((r, i) => (
            <div key={i} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-gold-light font-bold text-sm" style={hf}>{ml(r.planet)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  ml(r.relation).includes('Friend') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  ml(r.relation).includes('Enemy') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>{ml(r.relation)}</span>
              </div>
              <p className="text-text-secondary text-sm" style={bf}>{ml(r.note)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.23-26 — Naisargika Maitri" />
      </LessonSection>

      {/* ── 7. Remedies ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies for Sun', hi: 'सूर्य के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Remedies are prescribed when Sun is weak, afflicted, or poorly placed in the birth chart. A strong Sun generally does not need remedies. Consult a qualified Jyotishi before wearing gemstones, as an incorrectly prescribed remedy can amplify problems.', hi: 'उपाय तब निर्धारित किये जाते हैं जब सूर्य दुर्बल, पीड़ित या कुण्डली में अशुभ स्थान पर हो। बलवान सूर्य को प्रायः उपाय की आवश्यकता नहीं। रत्न धारण से पूर्व योग्य ज्योतिषी से परामर्श करें।' })}</p>

        {/* Mantra */}
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Beej Mantra', hi: 'बीज मन्त्र' })}</h4>
          <p className="text-gold-primary text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{REMEDIES.mantra.text}</p>
          <p className="text-text-secondary text-xs italic mb-2">{REMEDIES.mantra.transliteration}</p>
          <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES.mantra)}</p>
          <p className="text-text-secondary text-xs mt-1">{ml({ en: `Count: ${REMEDIES.mantra.count}`, hi: `जाप: ${REMEDIES.mantra.count}` })}</p>
        </div>

        {/* Other remedies */}
        {[
          { key: 'gemstone', icon: '💎', title: { en: 'Gemstone — Ruby (Manikya)', hi: 'रत्न — माणिक्य' } },
          { key: 'charity', icon: '🙏', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', icon: '🍽', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', icon: '🔱', title: { en: 'Worship & Arghya', hi: 'पूजा एवं अर्घ्य' } },
          { key: 'yantra', icon: '🔲', title: { en: 'Surya Yantra', hi: 'सूर्य यन्त्र' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-3">
            <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'Sun remedies work best when combined with behavioral changes: waking before sunrise, respecting father/authority figures, developing self-discipline, and serving through leadership rather than ego.', hi: 'सूर्य के उपाय व्यावहारिक परिवर्तनों के साथ सबसे अच्छे काम करते हैं: सूर्योदय से पहले जागना, पिता/अधिकार का सम्मान, आत्म-अनुशासन विकसित करना।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 8. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Worship', hi: 'पौराणिक कथा एवं उपासना' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Origin Story', hi: 'उत्पत्ति कथा' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.origin)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Gayatri Mantra', hi: 'गायत्री मन्त्र' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.gayatri)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples', hi: 'पवित्र मन्दिर' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
        </div>
        <ClassicalReference shortName="Surya Siddhanta" chapter="Astronomical foundation of solar calculations" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Sun is the Atmakaraka — the soul significator. Its placement reveals your core identity and life purpose.', hi: 'सूर्य आत्मकारक है — इसकी स्थिति आपकी मूल पहचान और जीवन उद्देश्य प्रकट करती है।' }),
        ml({ en: 'Exalted in Aries (10°), debilitated in Libra (10°). Own sign Leo. Moolatrikona Leo 0°-20°.', hi: 'मेष 10° में उच्च, तुला 10° में नीच। स्वराशि सिंह। मूलत्रिकोण सिंह 0°-20°।' }),
        ml({ en: 'Friends: Moon, Mars, Jupiter. Enemies: Venus, Saturn. The Sun-Saturn conflict is the most significant in Jyotish.', hi: 'मित्र: चन्द्र, मंगल, गुरु। शत्रु: शुक्र, शनि। सूर्य-शनि संघर्ष ज्योतिष में सबसे महत्त्वपूर्ण है।' }),
        ml({ en: 'Mahadasha: 6 years. Remedy: Ruby, wheat/jaggery charity, Arghya at sunrise, Aditya Hridayam Stotra.', hi: 'महादशा: 6 वर्ष। उपाय: माणिक्य, गेहूँ/गुड़ दान, सूर्योदय पर अर्घ्य, आदित्य हृदयम् स्तोत्र।' }),
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
