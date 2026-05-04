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
  { devanagari: 'मकर', transliteration: 'Makara', meaning: { en: 'The mythical sea-creature — crocodile, sea-goat, or water dragon', hi: 'पौराणिक जलचर — मगरमच्छ, समुद्री बकरा या जल सर्प' } },
  { devanagari: 'मृग', transliteration: 'Mṛga', meaning: { en: 'Deer or antelope — alternative symbol of this sign', hi: 'मृग या हिरण — इस राशि का वैकल्पिक प्रतीक' } },
  { devanagari: 'शनिक्षेत्र', transliteration: 'Śanikṣetra', meaning: { en: 'Field of Saturn — the first domain of the taskmaster', hi: 'शनि का क्षेत्र — कर्मदाता का प्रथम स्थान' } },
  { devanagari: 'कर्मभूमि', transliteration: 'Karmabhūmi', meaning: { en: 'The field of action — where effort determines destiny', hi: 'कर्म की भूमि — जहाँ प्रयास भाग्य निर्धारित करता है' } },
  { devanagari: 'पृथ्वीराशि', transliteration: 'Pṛthvīrāśi', meaning: { en: 'Earth sign — the most grounded and practical element', hi: 'पृथ्वी राशि — सबसे भूमिगत और व्यावहारिक तत्त्व' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Earth (Prithvi Tattva)', hi: 'पृथ्वी तत्त्व' },
  modality: { en: 'Cardinal (Chara — moveable, initiating)', hi: 'चर (गतिशील, आरम्भकारी)' },
  gender: { en: 'Feminine (Stri)', hi: 'स्त्रीलिंग (स्त्री)' },
  ruler: { en: 'Saturn (Shani)', hi: 'शनि' },
  symbol: { en: 'The Crocodile / Sea-Goat ♑', hi: 'मगरमच्छ / समुद्री बकरा ♑' },
  degreeRange: { en: '270° to 300° of the zodiac', hi: 'राशिचक्र के 270° से 300°' },
  direction: { en: 'South (Dakshina)', hi: 'दक्षिण दिशा' },
  season: { en: 'Shishira Ritu (Winter / Cold season)', hi: 'शिशिर ऋतु (शीत काल)' },
  color: { en: 'Black / Dark blue / Variegated', hi: 'काला / गहरा नीला / चित्रित' },
  bodyPart: { en: 'Knees, bones, joints, skeletal system, skin', hi: 'घुटने, हड्डियाँ, जोड़, कंकाल तन्त्र, त्वचा' },
};

// ─── Nakshatras in Makara ──────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Uttara Ashadha (padas 2-4)', hi: 'उत्तराषाढ़ा (पद 2-4)' },
    range: { en: '270°00\' to 280°00\' (padas 2-4 in Makara)', hi: '270°00\' से 280°00\' (पद 2-4 मकर में)' },
    lord: { en: 'Sun (Surya)', hi: 'सूर्य' },
    nature: { en: 'Uttara Ashadha means "the latter invincible one" — permanent, unchallengeable victory through righteous means. The Sun\'s rulership combined with Saturn\'s sign creates authority earned through discipline and service rather than inheritance. Padas 2-4 fall in Makara, Kumbha, and Meena navamshas respectively, adding earthy pragmatism to the Sun\'s regal nature. Government leadership, judicial authority, and administrative excellence emerge from this combination. The native achieves late but lasting triumph.', hi: 'उत्तराषाढ़ा का अर्थ है "उत्तर का अजेय" — धार्मिक माध्यमों से स्थायी, निर्विवाद विजय। सूर्य का स्वामित्व शनि की राशि के साथ अनुशासन और सेवा से अर्जित अधिकार बनाता है। पद 2-4 मकर, कुम्भ और मीन नवांशों में, सूर्य की राजसी प्रकृति में पृथ्वी की व्यावहारिकता। सरकारी नेतृत्व, न्यायिक अधिकार और प्रशासनिक उत्कृष्टता। जातक देर से किन्तु स्थायी विजय प्राप्त करता है।' },
  },
  {
    name: { en: 'Shravana', hi: 'श्रवण' },
    range: { en: '280°00\' to 293°20\' (all 4 padas in Makara)', hi: '280°00\' से 293°20\' (सभी 4 पद मकर में)' },
    lord: { en: 'Moon (Chandra)', hi: 'चन्द्र' },
    nature: { en: 'Shravana means "hearing" — the nakshatra of listening, learning, and transmitting knowledge through the oral tradition. The Moon\'s nurturing quality in Saturn\'s disciplined sign creates wise counselors who hear deeply before they speak. Lord Vishnu\'s footsteps (the three strides of Vamana) are the presiding symbol. This nakshatra produces scholars, diplomats, journalists, and leaders who succeed through understanding others\' needs. The native rises through organizational skill, careful listening, and patient networking.', hi: 'श्रवण का अर्थ है "सुनना" — श्रवण, ज्ञानार्जन और मौखिक परम्परा से ज्ञान संचरण का नक्षत्र। शनि की अनुशासित राशि में चन्द्र का पोषण गुण ज्ञानी परामर्शदाता बनाता है जो बोलने से पहले गहराई से सुनते हैं। भगवान विष्णु के पद (वामन के तीन विक्रम) अधिष्ठात्री प्रतीक। विद्वान, राजनयिक, पत्रकार और नेता जो दूसरों की आवश्यकताओं को समझकर सफल होते हैं।' },
  },
  {
    name: { en: 'Dhanishtha (padas 1-2)', hi: 'धनिष्ठा (पद 1-2)' },
    range: { en: '293°20\' to 300°00\' (padas 1-2 in Makara)', hi: '293°20\' से 300°00\' (पद 1-2 मकर में)' },
    lord: { en: 'Mars (Mangal)', hi: 'मंगल' },
    nature: { en: 'Dhanishtha means "the wealthiest" or "most famous" — the nakshatra of material abundance and musical talent. Mars\'s fiery rulership in Saturn\'s earthy sign creates driven ambition channeled through disciplined effort. The mridanga (drum) is its symbol, connecting to rhythm, timing, and the martial arts of percussion. Property, real estate, and organizational wealth accumulate here. Padas 1-2 in Makara produce the most practically ambitious expression — empire builders who construct lasting material foundations.', hi: 'धनिष्ठा का अर्थ है "सबसे धनवान" या "सबसे प्रसिद्ध" — भौतिक समृद्धि और संगीत प्रतिभा का नक्षत्र। शनि की पृथ्वी राशि में मंगल का अग्नि स्वामित्व अनुशासित प्रयास से महत्वाकांक्षा। मृदंग (ढोल) इसका प्रतीक, लय, समय और ताल की युद्ध कला। सम्पत्ति और संगठनात्मक धन। पद 1-2 मकर में सबसे व्यावहारिक महत्वाकांक्षी अभिव्यक्ति — स्थायी भौतिक नींव के निर्माता।' },
  },
];

// ─── Planetary Dignities in Makara ─────────────────────────────────────
const PLANETARY_DIGNITIES_HERE = {
  rulerAndOwn: { en: 'Saturn (Shani) — own sign (first of two, the other being Aquarius). Saturn governs with full authority here, expressing discipline, structure, time-consciousness, and karmic accountability in their most concrete form.', hi: 'शनि — स्वराशि (दो में से पहली, दूसरी कुम्भ)। शनि यहाँ पूर्ण अधिकार से शासन करता है, अनुशासन, संरचना, समय-चेतना और कर्म उत्तरदायित्व अपने सबसे ठोस रूप में।' },
  exalted: { en: 'Mars (Mangal) is exalted in Capricorn with deepest exaltation at 28°. The warrior achieves maximum effectiveness through strategic discipline, patient planning, and organized execution — aggression tempered by Saturn\'s structural wisdom.', hi: 'मंगल मकर में उच्च है, 28° पर परम उच्च। योद्धा रणनीतिक अनुशासन, धैर्यपूर्ण योजना और संगठित क्रियान्वयन से अधिकतम प्रभावशीलता प्राप्त करता है — शनि की संरचनात्मक बुद्धि से संयमित आक्रामकता।' },
  debilitated: { en: 'Jupiter (Guru) is debilitated in Capricorn with deepest debilitation at 5°. The expansive, generous guru is constrained by Saturn\'s rigid structure — wisdom becomes dry scholasticism, generosity is checked by calculation, and faith is tested by material reality.', hi: 'गुरु (बृहस्पति) मकर में नीच है, 5° पर परम नीच। विस्तृत, उदार गुरु शनि की कठोर संरचना से बाधित — ज्ञान शुष्क पाण्डित्य बनता है, उदारता गणना से रुकती है, विश्वास भौतिक वास्तविकता से परीक्षित।' },
  moolatrikona: { en: 'Saturn\'s moolatrikona is in Aquarius (0°-20°), not Capricorn. In Makara, Saturn is in its own sign but not at its purest moolatrikona expression. Here Saturn is the administrator and builder; in Aquarius it becomes the visionary reformer.', hi: 'शनि का मूलत्रिकोण कुम्भ (0°-20°) में है, मकर में नहीं। मकर में शनि स्वराशि में है किन्तु शुद्धतम मूलत्रिकोण अभिव्यक्ति में नहीं। यहाँ शनि प्रशासक और निर्माता है; कुम्भ में यह दूरदर्शी सुधारक बनता है।' },
};

// ─── Each Planet in Makara ─────────────────────────────────────────────
const EACH_PLANET_IN_SIGN: { planet: ML; effect: ML; dignity: string }[] = [
  {
    planet: { en: 'Sun (Surya)', hi: 'सूर्य' },
    dignity: 'Enemy\'s sign',
    effect: {
      en: 'Sun in Capricorn places the king in the domain of his adversary Saturn. Authority is earned through labor, not birthright. The native achieves leadership through demonstrated competence, long service, and organizational skill rather than charisma. Government careers follow a slow, steady climb. The father may be hardworking but emotionally distant. Self-esteem depends on achievement and position. This is the Sun of winter — diminished warmth but strong structural light. Constitutional challenges may affect bones, joints, or vitality in later years.',
      hi: 'मकर में सूर्य राजा को प्रतिद्वन्द्वी शनि के क्षेत्र में रखता है। अधिकार जन्म से नहीं, श्रम से अर्जित। जातक आकर्षण से नहीं बल्कि दक्षता, दीर्घ सेवा और संगठनात्मक कौशल से नेतृत्व प्राप्त करता है। सरकारी करियर धीमी, स्थिर चढ़ाई। पिता मेहनती किन्तु भावनात्मक रूप से दूर। आत्मसम्मान उपलब्धि और पद पर निर्भर।'
    },
  },
  {
    planet: { en: 'Moon (Chandra)', hi: 'चन्द्र' },
    dignity: 'Neutral',
    effect: {
      en: 'Moon in Capricorn creates a serious, reserved emotional nature. The native processes feelings through practical action rather than emotional expression — they show love through duty, reliability, and material provision rather than words or gestures. Ambition is emotionally driven but expressed through professional channels. The mother may be disciplined, hardworking, or emotionally reserved. Emotional security comes from career achievement, social status, and material stability. Depression and melancholy can arise when the native feels their efforts go unrecognized.',
      hi: 'मकर में चन्द्र गम्भीर, संयमित भावनात्मक स्वभाव बनाता है। जातक भावनात्मक अभिव्यक्ति के बजाय व्यावहारिक कर्म से भावनाओं को संसाधित करता है — कर्तव्य, विश्वसनीयता और भौतिक प्रावधान से प्रेम दर्शाता है। माता अनुशासित, मेहनती या भावनात्मक रूप से संयमित। भावनात्मक सुरक्षा करियर उपलब्धि और भौतिक स्थिरता से।'
    },
  },
  {
    planet: { en: 'Mars (Mangal)', hi: 'मंगल' },
    dignity: 'Exalted (28°)',
    effect: {
      en: 'Mars achieves its highest expression in Capricorn — the general who wins through strategy, discipline, and inexhaustible patience. This is Mars at its most effective: controlled aggression, calculated risk-taking, and relentless perseverance toward long-term goals. The native rises to the top through sheer determination and organizational brilliance. Government positions, corporate leadership, military command, and engineering mastery come naturally. At 28° (deepest exaltation), the native plans for decades and executes with surgical precision. Physical endurance is legendary. Can be ruthlessly ambitious and emotionally cold in pursuit of goals.',
      hi: 'मंगल मकर में उच्चतम अभिव्यक्ति प्राप्त करता है — रणनीति, अनुशासन और अक्षय धैर्य से विजय पाने वाला सेनापति। सबसे प्रभावी मंगल: नियन्त्रित आक्रामकता, परिकलित जोखिम और दीर्घकालिक लक्ष्यों के प्रति अथक दृढ़ता। 28° पर (परम उच्च) दशकों की योजना और शल्य सूक्ष्मता से क्रियान्वयन। शारीरिक सहनशक्ति अभूतपूर्व। लक्ष्य प्राप्ति में निर्दय महत्वाकांक्षी और भावनात्मक रूप से शीतल।'
    },
  },
  {
    planet: { en: 'Mercury (Budha)', hi: 'बुध' },
    dignity: 'Friend\'s sign',
    effect: {
      en: 'Mercury in Capricorn produces a methodical, practical, and business-oriented intellect. Communication is precise, economical, and purposeful — no wasted words. The native excels in accounting, administration, technical documentation, and any field requiring systematic thinking. Academic pursuits are undertaken for career advancement rather than pure curiosity. Writing style is structured and authoritative. Business acumen is strong, with a talent for long-term planning and contract negotiation. The native prefers proven systems over experimental approaches.',
      hi: 'मकर में बुध व्यवस्थित, व्यावहारिक और व्यापार-उन्मुख बुद्धि बनाता है। संवाद सूक्ष्म, मितव्ययी और उद्देश्यपूर्ण — कोई व्यर्थ शब्द नहीं। लेखा, प्रशासन, तकनीकी प्रलेखन और व्यवस्थित चिन्तन में उत्कृष्ट। शैक्षिक उपक्रम शुद्ध जिज्ञासा के बजाय करियर उन्नति के लिए। व्यापार कौशल सशक्त, दीर्घकालिक योजना और अनुबन्ध वार्ता में प्रतिभा।'
    },
  },
  {
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु' },
    dignity: 'Debilitated (5°)',
    effect: {
      en: 'Jupiter is debilitated in Capricorn — the generous, expansive guru constrained by Saturn\'s rigid material demands. Wisdom becomes overly practical, losing its philosophical breadth. Faith is tested by hardship, and the native may oscillate between spiritual aspiration and material cynicism. Teaching comes through structured institutions rather than inspired revelation. However, Neecha Bhanga (cancellation of debilitation) is common here — Saturn as the sign lord in a kendra can lift Jupiter into effective pragmatic wisdom. Financial advisory, corporate training, and institutional religious leadership can work well.',
      hi: 'गुरु मकर में नीच — उदार, विस्तृत गुरु शनि की कठोर भौतिक माँगों से बाधित। ज्ञान अत्यधिक व्यावहारिक, दार्शनिक विस्तार खोता है। विश्वास कठिनाई से परीक्षित। शिक्षण प्रेरित प्रकाशन के बजाय संरचित संस्थानों से। किन्तु नीच भंग सामान्य — केन्द्र में शनि गुरु को प्रभावी व्यावहारिक ज्ञान में उठा सकता है। वित्तीय सलाह और संस्थागत धार्मिक नेतृत्व उपयुक्त।'
    },
  },
  {
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र' },
    dignity: 'Friend\'s sign',
    effect: {
      en: 'Venus in Capricorn brings a mature, status-conscious approach to love and aesthetics. The native values loyalty, reliability, and social standing in a partner over romantic passion. Artistic expression is classical, structured, and enduring — architecture, sculpture, and traditional music rather than avant-garde experimentation. Marriage may be delayed but is approached with serious commitment. The native attracts wealth through patience, strategic investment, and leveraging social connections. Beauty is appreciated in its most refined, lasting forms.',
      hi: 'मकर में शुक्र प्रेम और सौन्दर्य के प्रति परिपक्व, प्रतिष्ठा-सचेत दृष्टिकोण। जातक रोमांटिक उत्कट के बजाय वफादारी, विश्वसनीयता और सामाजिक प्रतिष्ठा को महत्व देता है। कलात्मक अभिव्यक्ति शास्त्रीय, संरचित और स्थायी — वास्तुकला, मूर्तिकला और परम्परागत संगीत। विवाह विलम्बित किन्तु गम्भीर प्रतिबद्धता। धैर्य और रणनीतिक निवेश से धन आकर्षित।'
    },
  },
  {
    planet: { en: 'Saturn (Shani)', hi: 'शनि' },
    dignity: 'Own sign',
    effect: {
      en: 'Saturn in its own sign Capricorn is the master administrator — the planet of karma and time operating with full authority in its domain of structure and discipline. The native builds slowly, endures hardship without complaint, and creates institutions that outlast their creator. Career success comes late but is permanent and unassailable. The native commands through competence and experience, not charisma. Physical endurance is exceptional but the body ages visibly under Saturn\'s weight. Bones, joints, and skin require extra care. Government, law, construction, agriculture, and any field requiring decades of sustained effort suit perfectly.',
      hi: 'शनि अपनी स्वराशि मकर में मास्टर प्रशासक — कर्म और समय का ग्रह अपने अनुशासन और संरचना के क्षेत्र में पूर्ण अधिकार से। जातक धीरे बनाता है, बिना शिकायत कठिनाई सहता है, और संस्थाएँ बनाता है जो निर्माता से अधिक टिकती हैं। करियर सफलता देर से किन्तु स्थायी। योग्यता और अनुभव से शासन। हड्डियाँ, जोड़ और त्वचा को अतिरिक्त देखभाल चाहिए।'
    },
  },
  {
    planet: { en: 'Rahu', hi: 'राहु' },
    dignity: 'Neutral',
    effect: {
      en: 'Rahu in Capricorn amplifies ambition, status-seeking, and the drive for worldly power through unconventional or innovative methods. The native may rise rapidly through political manipulation, technological disruption of traditional industries, or leveraging foreign connections for domestic power. Corporate politics, government lobbying, and strategic alliance-building are natural skills. Shadow expression: corruption, abuse of authority, and social climbing without substance. At its best, Rahu here produces visionary administrators who modernize ancient institutions.',
      hi: 'मकर में राहु महत्वाकांक्षा, प्रतिष्ठा-खोज और अपरम्परागत या नवीन तरीकों से सांसारिक शक्ति की ललक को प्रवर्धित करता है। जातक राजनीतिक चालाकी, परम्परागत उद्योगों के तकनीकी विघटन या विदेशी सम्पर्कों से शीघ्र उठ सकता है। छाया अभिव्यक्ति: भ्रष्टाचार, अधिकार का दुरुपयोग। सर्वोत्तम रूप में प्राचीन संस्थानों का आधुनिकीकरण करने वाले दूरदर्शी प्रशासक।'
    },
  },
  {
    planet: { en: 'Ketu', hi: 'केतु' },
    dignity: 'Neutral',
    effect: {
      en: 'Ketu in Capricorn brings past-life mastery of worldly structures, administration, and material achievement — creating a current-life disinterest in career ambition and social status. The native has natural organizational skill but lacks the drive to exploit it for personal gain. May abandon successful careers for spiritual pursuit. Corporate executives who become monks, politicians who retreat to ashrams, and builders who seek emptiness exemplify this placement. The challenge is integrating worldly competence with spiritual detachment rather than abandoning one for the other.',
      hi: 'मकर में केतु पूर्व जन्म में सांसारिक संरचनाओं, प्रशासन और भौतिक उपलब्धि की महारत — वर्तमान जन्म में करियर महत्वाकांक्षा और सामाजिक प्रतिष्ठा में अनिच्छा। जातक में स्वाभाविक संगठनात्मक कौशल किन्तु व्यक्तिगत लाभ के लिए उपयोग की ललक की कमी। सफल करियर छोड़कर आध्यात्मिक साधना। चुनौती: सांसारिक योग्यता को आध्यात्मिक विरक्ति के साथ एकीकृत करना।'
    },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY_TRAITS = {
  strengths: {
    en: 'Disciplined and methodical — the most reliable sign of the zodiac. Patient beyond measure, capable of sustaining effort across decades where others quit in months. Organizational genius that builds systems, institutions, and structures designed to outlast their creator. Pragmatic wisdom that separates real opportunity from fantasy. Dry, understated humor that reveals deep intelligence. Natural authority that commands respect without demanding it. Financial prudence that builds lasting wealth through compound effort.',
    hi: 'अनुशासित और व्यवस्थित — राशिचक्र की सबसे विश्वसनीय राशि। अपार धैर्य, दशकों तक प्रयास बनाए रखने में सक्षम जहाँ अन्य महीनों में छोड़ देते हैं। संगठनात्मक प्रतिभा जो प्रणालियाँ और संस्थाएँ बनाती है। वास्तविक अवसर को कल्पना से अलग करने वाला व्यावहारिक ज्ञान। शुष्क, संयमित हास्य जो गहन बुद्धि प्रकट करता है। स्वाभाविक अधिकार। वित्तीय विवेक।'
  },
  weaknesses: {
    en: 'Emotionally rigid and sometimes cold — difficulty expressing vulnerability or accepting help. Pessimistic tendency to see obstacles before opportunities. Workaholic nature that sacrifices relationships, health, and joy for career advancement. Social climbing and status consciousness can override genuine human connection. Fear of failure produces excessive caution that misses opportunities. Can be controlling, miserly, and judgmental toward those they perceive as lazy or undisciplined. Depression and isolation in later years if warmth has been chronically neglected.',
    hi: 'भावनात्मक रूप से कठोर और कभी-कभी शीतल — असुरक्षा व्यक्त करने या सहायता स्वीकार करने में कठिनाई। अवसरों से पहले बाधाएँ देखने की निराशावादी प्रवृत्ति। करियर उन्नति के लिए सम्बन्ध, स्वास्थ्य और आनन्द का बलिदान। सामाजिक प्रतिष्ठा चेतना वास्तविक मानवीय जुड़ाव को दबा सकती है। विफलता का भय अत्यधिक सावधानी उत्पन्न करता है। नियन्त्रक, कंजूस और आलोचनात्मक हो सकता है।'
  },
  temperament: {
    en: 'The Capricorn temperament is melancholic and phlegmatic — cool, dry, and deeply introspective. Vata dominates the constitution with Kapha as secondary, producing a thin-to-medium frame that tends toward dryness and cold. Emotions run deep but are expressed rarely and with great restraint. The native thinks in timescales of years and decades, not days and weeks. Ambition is the driving force, but it is ambition of the patient, structural kind — building foundations that will support generations. They age in reverse: serious and old in youth, increasingly relaxed and even playful in maturity.',
    hi: 'मकर का स्वभाव उदास और कफप्रधान — शीतल, शुष्क और गहन आत्मनिरीक्षक। वात प्रधान संरचना कफ सहित, पतली-से-मध्यम काया शुष्कता और शीत की ओर। भावनाएँ गहरी किन्तु दुर्लभ और अत्यधिक संयम से व्यक्त। जातक वर्षों और दशकों में सोचता है, दिनों और सप्ताहों में नहीं। महत्वाकांक्षा प्रेरक शक्ति — पीढ़ियों को सहारा देने वाली नींव। वे उल्टे बूढ़े होते हैं: युवावस्था में गम्भीर, परिपक्वता में तेजी से सहज।'
  },
  appearance: {
    en: 'Often lean and angular with prominent bone structure — high cheekbones, strong jaw, and defined joints. Medium to tall height with a frame that appears older than its years in youth. The body carries itself with upright dignity. Knees may be bony or prone to issues. Skin tends toward dryness. Eyes are serious, calculating, and deep-set. The overall impression is of someone who has earned every inch of their presence through sustained effort. With age, the native often becomes more physically attractive as their features settle into distinguished maturity.',
    hi: 'प्रायः पतला और कोणीय, प्रमुख हड्डी संरचना — ऊँची गाल की हड्डियाँ, मजबूत जबड़ा और स्पष्ट जोड़। मध्यम से लम्बी ऊँचाई, काया युवावस्था में अपनी आयु से अधिक दिखती है। शरीर सीधी गरिमा से चलता है। घुटने हड्डीदार या समस्या-प्रवण। त्वचा शुष्कता की ओर। आँखें गम्भीर, गणनात्मक और गहरी। आयु के साथ अक्सर अधिक आकर्षक — विशिष्ट परिपक्वता।'
  },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER_TENDENCIES = {
  suited: {
    en: 'Government administrator, civil servant, corporate executive, chartered accountant, architect, civil engineer, structural engineer, judge, magistrate, mining engineer, geologist, orthopedic surgeon, dermatologist, real estate developer, land surveyor, archaeologist, museum curator, traditional craftsman, stone mason, watch maker, farmer (large-scale), dairy industrialist, cold storage operator',
    hi: 'सरकारी प्रशासक, सिविल सेवक, कॉर्पोरेट कार्यकारी, चार्टर्ड अकाउंटेंट, वास्तुकार, सिविल इंजीनियर, न्यायाधीश, मजिस्ट्रेट, खनन इंजीनियर, भूविज्ञानी, हड्डी रोग विशेषज्ञ, त्वचा रोग विशेषज्ञ, भूसम्पत्ति विकासक, भूमि सर्वेक्षक, पुरातत्वविद, संग्रहालय संरक्षक, किसान (बड़े पैमाने), डेयरी उद्योगपति'
  },
  nature: {
    en: 'Capricorn natives are built for careers that require long-term commitment, structural thinking, and the patience to climb hierarchies over decades. They are the executives, administrators, and institution-builders of the zodiac. The ideal Makara career has a clear hierarchy, measurable milestones, and increasing responsibility over time. They dislike ambiguity, disorganization, and roles that depend on charm or creativity without structure.',
    hi: 'मकर जातक ऐसे करियर के लिए बने हैं जिनमें दीर्घकालिक प्रतिबद्धता, संरचनात्मक चिन्तन और दशकों में पदानुक्रम चढ़ने का धैर्य चाहिए। वे राशिचक्र के कार्यकारी, प्रशासक और संस्था-निर्माता हैं। आदर्श मकर करियर में स्पष्ट पदानुक्रम, मापनीय मील के पत्थर और समय के साथ बढ़ती जिम्मेदारी है।'
  },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: {
    en: 'Taurus (Vrishabha) — fellow earth sign that shares Capricorn\'s practical values, patience, and appreciation for material stability. Virgo (Kanya) — earth-sign harmony with shared attention to detail and work ethic. Scorpio (Vrischika) — deep mutual respect for intensity, loyalty, and strategic thinking. Pisces (Meena) — opposite sign that provides the emotional and spiritual depth Capricorn needs.',
    hi: 'वृषभ — सह-पृथ्वी राशि जो मकर के व्यावहारिक मूल्यों, धैर्य और भौतिक स्थिरता की प्रशंसा साझा करती है। कन्या — विस्तार पर ध्यान और कार्य नीति में पृथ्वी-राशि सामंजस्य। वृश्चिक — तीव्रता, वफादारी और रणनीतिक चिन्तन का गहन परस्पर सम्मान। मीन — विपरीत राशि जो भावनात्मक और आध्यात्मिक गहराई प्रदान करती है।'
  },
  challenging: {
    en: 'Aries (Mesha) — the Ram\'s impulsive fire clashes with Capricorn\'s cautious earth; different speeds of operation create friction. Cancer (Karka) — the axis of opposition; the Crab\'s emotional needs feel suffocating to career-focused Capricorn. Libra (Tula) — both are cardinal signs, creating power struggles over direction and decision-making.',
    hi: 'मेष — मेष की आवेगी अग्नि मकर की सावधान पृथ्वी से टकराती है; भिन्न गति घर्षण पैदा करती है। कर्क — विपरीत अक्ष; भावनात्मक आवश्यकताएँ करियर-केन्द्रित मकर को घुटन। तुला — दोनों चर राशियाँ, दिशा और निर्णय पर शक्ति संघर्ष।'
  },
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES_AND_WORSHIP = {
  deity: {
    en: 'Lord Shani Dev — the planet Saturn is worshipped directly as a deity. Hanuman worship is also prescribed for Saturn-related afflictions, as Hanuman freed Shani from Ravana\'s prison. Shiva as Mahakala (Lord of Time) is the philosophical deity of Capricorn — time, death, and transformation as cosmic principles. Lord Ayyappa (Dharma Shasta) is also associated with Saturn\'s disciplined, renunciant energy.',
    hi: 'भगवान शनि देव — शनि ग्रह सीधे देवता के रूप में पूजित। शनि सम्बन्धी पीड़ा के लिए हनुमान पूजा भी विहित, क्योंकि हनुमान ने शनि को रावण के बन्धन से मुक्त किया। महाकाल शिव मकर के दार्शनिक देवता — समय, मृत्यु और परिवर्तन ब्रह्मांडीय सिद्धान्त। भगवान अय्यप्पा (धर्म शास्ता) भी शनि की अनुशासित ऊर्जा से सम्बद्ध।'
  },
  practices: {
    en: 'Recite Shani Beej Mantra: "Om Praam Preem Praum Sah Shanaischaraya Namah" — 23,000 times in 40 days. Wear Blue Sapphire (Neelam) in silver or iron on the middle finger on Saturday during Shukla Paksha — but ONLY after careful horoscope analysis as Neelam can give adverse results if Saturn is unfavorable. Donate black sesame seeds, black cloth, iron implements, mustard oil, and urad dal on Saturdays. Fast on Saturdays. Visit Shani temples, especially Shani Shingnapur (Maharashtra) or Thirunallar (Tamil Nadu). Serve the elderly, disabled, and destitute — this is the most powerful Saturn remedy.',
    hi: 'शनि बीज मन्त्र: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः" — 40 दिनों में 23,000 जाप। नीलम चाँदी या लोहे में शनिवार शुक्ल पक्ष में मध्यमा में — केवल सावधान कुण्डली विश्लेषण के बाद। शनिवार को काला तिल, काला वस्त्र, लोहे के उपकरण, सरसों तेल और उड़द दाल दान। शनि मन्दिर, विशेषकर शनि शिंगणापुर या तिरुनल्लार। वृद्ध, विकलांग और निराश्रित की सेवा — सबसे शक्तिशाली शनि उपाय।'
  },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: {
    en: 'The Makara is one of the most enigmatic creatures of Hindu mythology — variously depicted as a crocodile, a sea-dragon with an elephant\'s trunk, or a sea-goat with a fish tail. In Vedic cosmology, the Makara guards the threshold between the earthly and celestial waters, serving as the vahana (vehicle) of Ganga Devi and Varuna (lord of the cosmic ocean). The entry of the Sun into Makara (Makar Sankranti) marks the northward journey of the Sun (Uttarayana), the most auspicious half of the year — the gateway from darkness to increasing light. This astronomical event is one of the most celebrated festivals in India. The Makara\'s hybrid nature — part earth creature, part sea creature — reflects Capricorn\'s dual quality: grounded ambition reaching toward transcendent achievement. In temple architecture, the Makara torana (archway) marks the threshold between mundane and sacred space, just as the sign marks the transition from the descending to the ascending arc of the Sun.',
    hi: 'मकर हिन्दू पौराणिक कथाओं के सबसे रहस्यमय प्राणियों में — मगरमच्छ, हाथी की सूँड वाला जल-सर्प या मछली पूँछ वाला समुद्री बकरा। वैदिक ब्रह्मांड विज्ञान में मकर पार्थिव और दिव्य जल के बीच की दहलीज का रक्षक, गंगा देवी और वरुण का वाहन। मकर में सूर्य प्रवेश (मकर संक्रान्ति) सूर्य की उत्तरायण यात्रा — वर्ष का सबसे शुभ अर्ध, अन्धकार से बढ़ते प्रकाश का द्वार। भारत के सबसे मनाये जाने वाले उत्सवों में। मकर की संकर प्रकृति — अंशतः भूचर, अंशतः जलचर — मकर राशि के दोहरे गुण को दर्शाती है: भूमिगत महत्वाकांक्षा पारलौकिक उपलब्धि की ओर। मन्दिर वास्तुकला में मकर तोरण लौकिक और पवित्र स्थान की दहलीज — जैसे यह राशि सूर्य के अवरोही से आरोही चाप में संक्रमण।'
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/rashis', label: { en: 'All Twelve Rashis', hi: 'सभी बारह राशियाँ' } },
  { href: '/learn/shani', label: { en: 'Shani (Saturn) — Ruler of Makara', hi: 'शनि — मकर का स्वामी' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/kumbha', label: { en: 'Kumbha (Aquarius) — Next Sign', hi: 'कुम्भ — अगली राशि' } },
  { href: '/learn/dhanu', label: { en: 'Dhanu (Sagittarius) — Previous Sign', hi: 'धनु — पिछली राशि' } },
  { href: '/learn/mangal', label: { en: 'Mangal (Mars) — Exalted in Makara', hi: 'मंगल — मकर में उच्च' } },
  { href: '/learn/guru', label: { en: 'Guru (Jupiter) — Debilitated in Makara', hi: 'गुरु — मकर में नीच' } },
  { href: '/learn/sade-sati', label: { en: 'Sade Sati — Saturn\'s Transit', hi: 'साढ़ेसाती — शनि का गोचर' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Jyotish', hi: 'ज्योतिष में योग' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function MakaraPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
          <span className="text-4xl">♑</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Makara — Capricorn', hi: 'मकर राशि — मगरमच्छ' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The tenth sign of the zodiac — Saturn\'s earthy fortress of discipline, ambition, structure, and the patient mastery of time itself.', hi: 'राशिचक्र की दशम राशि — शनि का पार्थिव दुर्ग, अनुशासन, महत्वाकांक्षा, संरचना और स्वयं समय पर धैर्यपूर्ण महारत।' })}
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
        <p style={bf}>{ml({ en: 'Makara (Capricorn) is the tenth sign of the zodiac, spanning 270° to 300°. Ruled by Saturn (Shani), it is the cardinal earth sign — the most structurally ambitious sign in the zodiac. While Aries initiates through fire, Cancer through emotion, and Libra through relationship, Capricorn initiates through structure, organization, and the establishment of enduring systems. It is the natural ruler of the tenth house (Karma Bhava), governing career, public reputation, authority, government, and one\'s contribution to society. The Makara native builds for eternity — slowly, methodically, and with an awareness of time that no other sign possesses.', hi: 'मकर राशिचक्र की दशम राशि है, 270° से 300° तक। शनि द्वारा शासित, यह चर पृथ्वी राशि है — राशिचक्र की सबसे संरचनात्मक रूप से महत्वाकांक्षी राशि। दशम भाव (कर्म भाव) का स्वाभाविक शासक, करियर, सार्वजनिक प्रतिष्ठा, अधिकार, सरकार और समाज में योगदान शासित करता है। मकर जातक अनन्तकाल के लिए बनाता है — धीरे, व्यवस्थित और समय की चेतना के साथ जो किसी अन्य राशि में नहीं।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGN_OVERVIEW).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-dark text-xs uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Svaroopa (Nature of Signs)" />
      </LessonSection>

      {/* ── 2. Personality Traits ── */}
      <LessonSection number={next()} title={ml({ en: 'Personality & Temperament', hi: 'व्यक्तित्व एवं स्वभाव' })}>
        <div className="space-y-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strengths', hi: 'शक्तियाँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.strengths)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weaknesses', hi: 'दुर्बलताएँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.weaknesses)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Temperament & Constitution', hi: 'स्वभाव एवं संरचना' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.temperament)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Physical Appearance', hi: 'शारीरिक रूप' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.appearance)}</p>
          </div>
        </div>
        <ClassicalReference shortName="PD" chapter="Ch. 2 — Rashi Adhyaya" />
      </LessonSection>

      {/* ── 3. Nakshatras ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Makara', hi: 'मकर में नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Capricorn contains parts of three nakshatras whose lords — Sun, Moon, and Mars — form an interesting progression: sovereign authority (Uttara Ashadha/Sun), intuitive listening (Shravana/Moon), and ambitious wealth-building (Dhanishtha/Mars). Together they create the Capricornian journey from righteous leadership through patient observation to material abundance.', hi: 'मकर में तीन नक्षत्रों के अंश जिनके स्वामी — सूर्य, चन्द्र और मंगल — एक रोचक क्रम बनाते हैं: सार्वभौम अधिकार (उत्तराषाढ़ा/सूर्य), अन्तर्ज्ञानी श्रवण (श्रवण/चन्द्र) और महत्वाकांक्षी धन-निर्माण (धनिष्ठा/मंगल)।' })}</p>
        {NAKSHATRAS_IN_SIGN.map((n, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(n.name)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">{ml(n.lord)}</span>
            </div>
            <p className="text-text-secondary text-xs mb-2">{ml(n.range)}</p>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.nature)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Nakshatra Vibhaga" />
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Makara', hi: 'मकर में ग्रह गरिमा' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Capricorn is one of the most significant signs for planetary dignity — it hosts Mars\'s exaltation (28°) and Jupiter\'s debilitation (5°). This duality reveals the sign\'s nature: raw discipline and strategic patience are rewarded (Mars exalted), while unearned optimism and unchecked expansion are humbled (Jupiter debilitated). Saturn rules with full ownership here.', hi: 'मकर ग्रह गरिमा के लिए सबसे महत्वपूर्ण राशियों में — मंगल का उच्च (28°) और गुरु का नीच (5°)। यह द्वैत राशि की प्रकृति प्रकट करता है: कच्चा अनुशासन और रणनीतिक धैर्य पुरस्कृत (मंगल उच्च), जबकि अनर्जित आशावाद और अनियन्त्रित विस्तार विनम्र (गुरु नीच)।' })}</p>
        <div className="space-y-3">
          {Object.entries(PLANETARY_DIGNITIES_HERE).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-primary text-sm font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha-Adi" />
      </LessonSection>

      {/* ── 5. Each Planet in Makara ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Capricorn', hi: 'मकर में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Saturn\'s earthy domain rewards discipline and punishes carelessness. Planets in Capricorn must earn their results through sustained effort — nothing comes easily, but what is achieved here endures. Fire planets (Sun, Mars) are either channeled into organizational brilliance or frustrated by structural constraints.', hi: 'शनि का पार्थिव क्षेत्र अनुशासन को पुरस्कृत और लापरवाही को दण्डित करता है। मकर में ग्रहों को निरन्तर प्रयास से परिणाम अर्जित करने होते हैं — कुछ सहजता से नहीं आता, किन्तु जो प्राप्त होता है वह स्थायी है।' })}</p>
        {EACH_PLANET_IN_SIGN.map((p, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              {p.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  p.dignity.includes('Exalted') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  p.dignity.includes('Debilitated') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  p.dignity.includes('Own') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  p.dignity.includes('Friend') ? 'bg-gold-primary/10 border-gold-primary/30 text-gold-light' :
                  p.dignity.includes('Enemy') ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{p.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala" />
      </LessonSection>

      {/* ── 6. Career Tendencies ── */}
      <LessonSection number={next()} title={ml({ en: 'Career & Professional Life', hi: 'करियर एवं व्यावसायिक जीवन' })}>
        <p style={bf}>{ml(CAREER_TENDENCIES.nature)}</p>
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Suited Professions', hi: 'उपयुक्त व्यवसाय' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(CAREER_TENDENCIES.suited)}</p>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'The Capricorn career is a marathon, not a sprint. Success comes late — often after 35 — but it is built on foundations so solid that it cannot be taken away. The Saturn-ruled native must resist the temptation to compare themselves with faster signs in youth, trusting that compound effort over decades produces results no amount of talent can match.', hi: 'मकर करियर मैराथन है, स्प्रिंट नहीं। सफलता देर से आती है — प्रायः 35 के बाद — किन्तु इतनी ठोस नींव पर कि छीनी नहीं जा सकती। शनि-शासित जातक को युवावस्था में तेज राशियों से तुलना के प्रलोभन का विरोध करना चाहिए, विश्वास रखते हुए कि दशकों का संयुक्त प्रयास ऐसे परिणाम देता है जो कोई प्रतिभा नहीं दे सकती।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 7. Compatibility ── */}
      <LessonSection number={next()} title={ml({ en: 'Compatibility & Relationships', hi: 'अनुकूलता एवं सम्बन्ध' })}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Best Matches', hi: 'सर्वोत्तम जोड़ियाँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.best)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Challenging Matches', hi: 'चुनौतीपूर्ण जोड़ियाँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.challenging)}</p>
          </div>
        </div>
        <ClassicalReference shortName="JP" chapter="Ch. 19 — Vivaha (Marriage)" />
      </LessonSection>

      {/* ── 8. Remedies & Worship ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies & Worship', hi: 'उपाय एवं उपासना' })}>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Presiding Deity', hi: 'अधिष्ठात्री देवता' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.deity)}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Practices & Remedial Measures', hi: 'साधना एवं उपचारात्मक उपाय' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.practices)}</p>
          </div>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Saturn\'s most powerful remedy is service — selfless work for those who have less. When a Capricorn native serves the elderly, feeds the poor, or supports the disabled, they align with Saturn\'s deepest teaching: that true authority comes from responsibility, not privilege. Every act of service lightens the karmic load that Saturn places on this sign.', hi: 'शनि का सबसे शक्तिशाली उपाय सेवा है — जिनके पास कम है उनके लिए निःस्वार्थ कार्य। जब मकर जातक वृद्धों की सेवा करता है, गरीबों को भोजन कराता है या विकलांगों का सहारा बनता है, तो वह शनि की गहनतम शिक्षा से जुड़ता है: सच्चा अधिकार जिम्मेदारी से आता है, विशेषाधिकार से नहीं।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Symbolism', hi: 'पौराणिक कथा एवं प्रतीकवाद' })}>
        <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
        <ClassicalReference shortName="BS" chapter="Brihat Samhita — Makara Descriptions" />
      </LessonSection>

      {/* ── 10. Health & Body ── */}
      <LessonSection number={next()} title={ml({ en: 'Health & Body', hi: 'स्वास्थ्य एवं शरीर' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Makara governs the knees, bones, joints, teeth, skin, and the skeletal system as a whole. As an earth sign ruled by Saturn, Capricorn natives are susceptible to chronic, structural health issues that develop slowly over time — arthritis, osteoporosis, dental problems, and degenerative joint diseases are signature challenges. The knees are the primary point of vulnerability, both literally and symbolically — Capricorn bends the knee to no one, but the knees themselves bear the weight of that ambition. Skin conditions — dryness, psoriasis, eczema, and premature ageing — reflect Saturn\'s dry, cold nature. When Saturn is strong and well-placed, the native possesses remarkable endurance and longevity — Capricorn natives may start with a weak constitution but grow stronger with age, the reverse of most signs. Saturn gives slow but steady health improvement over time, and many Capricorn-dominant individuals are healthier and more vital in their 50s than their 20s. A weak or afflicted Saturn manifests as early-onset joint problems, chronic back pain, weak teeth and bones (calcium deficiency), depression (Saturn\'s cold darkness turning inward), and a general sense of physical heaviness and rigidity. Ayurvedically, Makara is predominantly Vata — the cold, dry, airy constitution that creates the brittleness and stiffness characteristic of Saturn\'s influence. Dietary recommendations emphasize warm, oily, nourishing foods that lubricate joints and strengthen bones: sesame oil, ghee, warm milk with turmeric and ashwagandha, calcium-rich foods (til/sesame, ragi, dairy), and warming spices like ginger and cinnamon. Cold, dry, and raw foods aggravate Vata dramatically. Exercise should focus on joint mobility and bone strength — weight-bearing exercises, yoga (especially warrior poses and standing balances that strengthen knees), walking, and swimming for low-impact joint movement. Avoid high-impact activities that stress the knees. Mentally, Makara natives are prone to depression, pessimism, excessive self-criticism, and workaholism that ignores physical limits — regular scheduled rest (not earned but mandated), connection with light-hearted friends, and exposure to sunlight and warmth are therapeutic necessities, not luxuries.', hi: 'मकर घुटनों, हड्डियों, जोड़ों, दाँतों, त्वचा और समग्र कंकाल तन्त्र का शासक है। शनि शासित पृथ्वी राशि होने से मकर जातक पुरानी, संरचनात्मक स्वास्थ्य समस्याओं के प्रति संवेदनशील जो समय के साथ धीरे विकसित — गठिया, ऑस्टियोपोरोसिस, दन्त समस्याएँ और अपक्षयी जोड़ रोग। घुटने प्राथमिक भेद्य बिन्दु। त्वचा — शुष्कता, सोरायसिस, एक्ज़िमा और समयपूर्व वृद्धता — शनि की शुष्क, शीतल प्रकृति। बली शनि में उल्लेखनीय सहनशक्ति और दीर्घायु — मकर जातक कमज़ोर संरचना से शुरू किन्तु उम्र के साथ मजबूत, अधिकांश राशियों का उलट। दुर्बल शनि — प्रारम्भिक जोड़ समस्याएँ, पुराना पीठ दर्द, कमज़ोर दाँत और हड्डियाँ, अवसाद और शारीरिक भारीपन। आयुर्वेदिक रूप से मकर प्रधानतः वात — शीतल, शुष्क, वायव संविधान। आहार में ऊष्ण, स्निग्ध, पोषक — तिल तेल, घी, हल्दी-अश्वगन्धा दूध, कैल्शियम-समृद्ध (तिल, रागी, दुग्ध) और अदरक, दालचीनी। शीतल, शुष्क, कच्चे पदार्थ वात नाटकीय रूप से बढ़ाते हैं। व्यायाम जोड़ गतिशीलता और हड्डी शक्ति — भार वहन व्यायाम, योग (विशेषकर वीरासन और खड़े सन्तुलन), पैदल, तैराकी। घुटनों पर दबाव डालने वाली तीव्र गतिविधियाँ वर्जित। मानसिक रूप से अवसाद, निराशावाद, अत्यधिक आत्म-आलोचना और शारीरिक सीमाओं की उपेक्षा करने वाला कार्यव्यसन — नियमित निर्धारित विश्राम, हल्के-फुल्के मित्रों का संग और सूर्य प्रकाश तथा ऊष्णता चिकित्सकीय आवश्यकताएँ।' })}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Vulnerable Areas', hi: 'संवेदनशील अंग' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Knees, bones, joints, teeth, skin, skeletal system, cartilage, nails', hi: 'घुटने, हड्डियाँ, जोड़, दाँत, त्वचा, कंकाल तन्त्र, उपास्थि, नाखून' })}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Ayurvedic Constitution', hi: 'आयुर्वेदिक प्रकृति' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Vata dominant (cold, dry). Favour warm, oily, bone-nourishing foods. Avoid cold, dry, raw items. Weight-bearing exercise for bone strength. Warmth and sunlight therapeutically essential.', hi: 'वात प्रधान (शीतल, शुष्क)। ऊष्ण, स्निग्ध, हड्डी-पोषक आहार अनुकूल। शीतल, शुष्क, कच्चे पदार्थ वर्जित। हड्डी शक्ति हेतु भार वहन व्यायाम। ऊष्णता और सूर्य प्रकाश चिकित्सकीय रूप से अनिवार्य।' })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 11. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Understanding Makara in chart interpretation means identifying where Saturn\'s disciplined, structural, and time-tested energy operates in the native\'s life. Where Capricorn falls reveals where you must build through sustained effort, where patience yields authority, and where the fear of failure can become either a motivating force or a paralysing one.', hi: 'कुण्डली व्याख्या में मकर को समझने का अर्थ है पहचानना कि शनि की अनुशासित, संरचनात्मक और समय-परीक्षित ऊर्जा जातक के जीवन में कहाँ कार्य करती है। मकर जहाँ पड़ता है वहाँ सतत प्रयास से निर्माण, धैर्य से अधिकार, और विफलता का भय प्रेरक शक्ति या पक्षाघात बनता है।' })}</p>
        <div className="space-y-3">
          {[
            { title: { en: 'If Makara is your Lagna', hi: 'यदि मकर आपका लग्न है' }, content: { en: 'Saturn becomes your lagna lord, making discipline, ambition, structured achievement, and karmic responsibility the central axis of your life. Uttara Ashadha padas 2-4 (Sun nakshatra) creates a personality that earns authority through righteous service and patient merit — late bloomers who eventually become pillars of their institutions. Shravana lagna (Moon nakshatra) produces a listening, learning personality that absorbs knowledge systematically before acting — these are the strategic thinkers and patient planners. Dhanishtha padas 1-2 (Mars nakshatra) adds martial energy to Saturn\'s structure — creating builders, engineers, and ambitious achievers who combine patience with drive. Saturn as lagna lord improves with age — Capricorn rising individuals often say their life truly began after 30.', hi: 'शनि लग्नेश बनता है — अनुशासन, महत्वाकांक्षा, संरचित उपलब्धि और कार्मिक जिम्मेदारी जीवन का केन्द्रीय अक्ष। उत्तराषाढ़ा पद 2-4 (सूर्य नक्षत्र) धार्मिक सेवा और धैर्य से अधिकार अर्जित — देर से खिलने वाले जो अन्ततः संस्थानों के स्तम्भ। श्रवण लग्न (चन्द्र नक्षत्र) सुनने, सीखने वाला व्यक्तित्व — रणनीतिक विचारक और धैर्यवान योजनाकार। धनिष्ठा पद 1-2 (मंगल नक्षत्र) शनि की संरचना में मार्शल ऊर्जा। शनि लग्नेश उम्र के साथ सुधरता है — मकर लग्न प्रायः कहते हैं जीवन 30 के बाद शुरू हुआ।' } },
            { title: { en: 'If Makara is your Moon sign', hi: 'यदि मकर आपकी चन्द्र राशि है' }, content: { en: 'The mind is serious, disciplined, and oriented toward long-term goals rather than immediate gratification. Emotions are controlled, contained, and expressed only after careful consideration. This placement creates excellent strategists and administrators but can make emotional vulnerability difficult — Capricorn Moon natives often appear cold because they have learned that showing weakness invites exploitation. Shravana Moon is the most emotionally perceptive of the three nakshatras — the ability to listen deeply and absorb information creates a wise, quietly powerful mind. Dhanishtha Moon adds rhythmic, musical emotional expression — emotions processed through beat, pattern, and physical movement.', hi: 'मन गम्भीर, अनुशासित और तात्कालिक सन्तुष्टि के बजाय दीर्घकालीन लक्ष्यों की ओर उन्मुख। भावनाएँ नियन्त्रित, संयमित और सावधान विचार के बाद ही व्यक्त। उत्कृष्ट रणनीतिकार और प्रशासक किन्तु भावनात्मक भेद्यता कठिन। श्रवण चन्द्र तीन नक्षत्रों में सबसे भावनात्मक रूप से अवलोकनशील — गहराई से सुनने और जानकारी अवशोषित करने की क्षमता। धनिष्ठा चन्द्र लयबद्ध, संगीतमय भावनात्मक अभिव्यक्ति।' } },
            { title: { en: 'Makara in divisional charts', hi: 'विभागीय कुण्डलियों में मकर' }, content: { en: 'In Navamsha (D9), Makara indicates a spouse who is disciplined, ambitious, practical, and possibly older or more mature. Marriage may come late but is built to last. In Dashamsha (D10), it suggests careers in government administration, engineering, construction, mining, agriculture, or any field requiring long-term structural building and patient authority.', hi: 'नवांश (D9) में मकर जीवनसाथी को इंगित करता है जो अनुशासित, महत्वाकांक्षी, व्यावहारिक और सम्भवतः बड़ी उम्र या अधिक परिपक्व। विवाह देर से किन्तु स्थायी। दशमांश (D10) में सरकारी प्रशासन, अभियान्त्रिकी, निर्माण, खनन, कृषि या दीर्घकालीन संरचनात्मक निर्माण और धैर्यपूर्ण अधिकार वाले क्षेत्र में करियर।' } },
            { title: { en: 'Common misconceptions', hi: 'सामान्य भ्रान्तियाँ' }, content: { en: 'Misconception: Capricorn is cold and unfeeling. Reality: Capricorn feels deeply but expresses care through providing structure, security, and material support — building a house is an act of love more enduring than a poem. Misconception: Capricorn is only about career. Reality: Capricorn applies its discipline to whatever it values — family, art, or spirituality can be pursued with equal Saturnine dedication. Misconception: Capricorn is boring. Reality: Capricorn is the sign where Mars is exalted — there is tremendous fire and ambition beneath the serious exterior. Misconception: Capricorn ages badly. Reality: Capricorn ages beautifully — Saturn\'s influence reverses the usual pattern, giving increasing vitality, authority, and even physical attractiveness with age.', hi: 'भ्रान्ति: मकर शीतल और भावहीन है। सत्य: मकर गहराई से अनुभव करता है किन्तु संरचना, सुरक्षा और भौतिक सहायता प्रदान कर देखभाल व्यक्त — घर बनाना कविता से अधिक स्थायी प्रेम कृत्य। भ्रान्ति: मकर केवल करियर। सत्य: मकर अपना अनुशासन जिसे महत्व देता है उस पर लागू — परिवार, कला या अध्यात्म। भ्रान्ति: मकर उबाऊ है। सत्य: मकर वह राशि जहाँ मंगल उच्च — गम्भीर बाहरी के नीचे जबरदस्त अग्नि और महत्वाकांक्षा। भ्रान्ति: मकर बुरी तरह बूढ़ा होता है। सत्य: मकर सुन्दर बूढ़ा होता है — शनि उम्र के साथ बढ़ती जीवनी शक्ति, अधिकार और आकर्षण देता है।' } },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml(item.title)}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(item.content)}</p>
            </div>
          ))}
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Reading Makara in a chart reveals where the native must build with patience, endure with discipline, and earn authority through time-tested effort. The house where Capricorn falls is where shortcuts will always fail, where Saturn demands real work before granting real rewards, and where the native\'s greatest achievements await — but only after the dues are fully paid.', hi: 'कुण्डली में मकर पढ़ना बताता है कि जातक को कहाँ धैर्य से बनाना, अनुशासन से सहना और समय-परीक्षित प्रयास से अधिकार अर्जित करना है। जिस भाव में मकर पड़ता है वहाँ शॉर्टकट सदा विफल, शनि वास्तविक पुरस्कार देने से पहले वास्तविक कार्य माँगता है, और जातक की सबसे बड़ी उपलब्धियाँ प्रतीक्षा करती हैं — किन्तु बकाया पूर्णतः चुकाने के बाद ही।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 12. Makara as House Cusp ── */}
      <LessonSection number={next()} title={ml({ en: 'Makara as House Cusp', hi: 'भाव शिखर के रूप में मकर' })}>
        <p style={bf} className="mb-3">{ml({ en: 'When Makara falls on different house cusps, it brings Saturn\'s disciplined, structural, and enduring energy to that life domain. Here is how Capricorn colours each house:', hi: 'जब मकर विभिन्न भाव शिखरों पर पड़ता है, तो वह उस जीवन क्षेत्र में शनि की अनुशासित, संरचनात्मक और स्थायी ऊर्जा लाता है। यहाँ मकर प्रत्येक भाव को कैसे रंगता है:' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { house: '1st', effect: { en: 'Saturn-ruled personality — serious, disciplined, lean build, mature beyond years. Natural authority that increases with age. Responsibility defines the life path from an early age.', hi: 'शनि शासित व्यक्तित्व — गम्भीर, अनुशासित, दुबली काया, उम्र से अधिक परिपक्व। उम्र के साथ बढ़ता स्वाभाविक अधिकार। प्रारम्भिक उम्र से जिम्मेदारी जीवन पथ परिभाषित।' } },
            { house: '2nd', effect: { en: 'Wealth through slow, disciplined accumulation. Conservative financial management. Measured, authoritative speech. Family traditions and ancestral responsibilities weigh heavily.', hi: 'धीमे, अनुशासित संचय से धन। रूढ़िवादी वित्तीय प्रबन्धन। संयमित, अधिकारपूर्ण वाणी। पारिवारिक परम्पराएँ और पैतृक जिम्मेदारियाँ भारी।' } },
            { house: '3rd', effect: { en: 'Structured, formal communication style. Technical writing and documentation skills. Delayed but responsible sibling relationships. Short travels for work and duty rather than pleasure.', hi: 'संरचित, औपचारिक संवाद शैली। तकनीकी लेखन और प्रलेखन कौशल। विलम्बित किन्तु जिम्मेदार भाई-बहन सम्बन्ध। आनन्द के बजाय कार्य और कर्तव्य हेतु लघु यात्राएँ।' } },
            { house: '4th', effect: { en: 'Structured, austere home. Heavy responsibilities from mother or regarding property. Real estate gains through patience and long-term investment. Emotional security through achievement and status.', hi: 'संरचित, तपस्वी गृह। माता या सम्पत्ति से भारी जिम्मेदारियाँ। धैर्य और दीर्घकालीन निवेश से भूसम्पत्ति लाभ। उपलब्धि और प्रतिष्ठा से भावनात्मक सुरक्षा।' } },
            { house: '5th', effect: { en: 'Creative expression through disciplined craft and technical mastery. Delayed romance or serious approach to love. Children may come late but bring deep responsibility. Speculation avoided in favour of calculated investment.', hi: 'अनुशासित शिल्प और तकनीकी कुशलता से सृजनात्मक अभिव्यक्ति। विलम्बित प्रेम या प्रेम में गम्भीर दृष्टिकोण। सन्तान देर से किन्तु गहरी जिम्मेदारी। सट्टे के बजाय गणनात्मक निवेश।' } },
            { house: '6th', effect: { en: 'Bone, joint, and knee health concerns. Chronic but manageable diseases. Powerful work ethic in service roles. Defeats enemies through outlasting them — Saturn\'s patience as weapon.', hi: 'हड्डी, जोड़ और घुटने स्वास्थ्य चिन्ताएँ। पुराने किन्तु प्रबन्धनीय रोग। सेवा भूमिकाओं में शक्तिशाली कार्य नैतिकता। शत्रुओं से अधिक टिककर पराजय — शनि का धैर्य अस्त्र।' } },
            { house: '7th', effect: { en: 'Spouse is disciplined, mature, possibly older. Marriage is delayed but enduring when it comes. Business partnerships require clear structure and defined responsibilities. Loyalty over romance.', hi: 'जीवनसाथी अनुशासित, परिपक्व, सम्भवतः बड़ी उम्र। विवाह विलम्बित किन्तु आने पर स्थायी। व्यापारिक साझेदारी में स्पष्ट संरचना और परिभाषित जिम्मेदारियाँ। प्रेम से ऊपर वफादारी।' } },
            { house: '8th', effect: { en: 'Long life through Saturn\'s endurance. Slow, difficult transformations that yield permanent results. Inheritance delayed or comes with heavy responsibilities. Deep interest in traditional occult systems.', hi: 'शनि की सहनशक्ति से दीर्घायु। धीमे, कठिन रूपान्तरण जो स्थायी परिणाम। विलम्बित या भारी जिम्मेदारियों वाली विरासत। पारम्परिक गूढ़ प्रणालियों में गहरी रुचि।' } },
            { house: '9th', effect: { en: 'Dharma expressed through structured practice and institutional religion. Father is disciplined and possibly stern. Fortune through patient effort and traditional knowledge. Pilgrimage as duty rather than adventure.', hi: 'संरचित साधना और संस्थागत धर्म से धर्म। पिता अनुशासित और सम्भवतः कठोर। धैर्यपूर्ण प्रयास और पारम्परिक ज्ञान से भाग्य। साहस के बजाय कर्तव्य के रूप में तीर्थयात्रा।' } },
            { house: '10th', effect: { en: 'Capricorn in its natural house — exceptional career drive and administrative capacity. Born for leadership through earned authority. Government, engineering, construction, mining, or institutional management. Slow, steady rise to the top.', hi: 'मकर अपने स्वाभाविक भाव में — असाधारण करियर प्रेरणा और प्रशासनिक क्षमता। अर्जित अधिकार से नेतृत्व के लिए जन्मा। सरकार, अभियान्त्रिकी, निर्माण, खनन या संस्थागत प्रबन्धन। धीमी, स्थिर शिखर तक चढ़ाई।' } },
            { house: '11th', effect: { en: 'Gains through institutional, governmental, and established networks. Friends are mature, disciplined, and few but reliable. Aspirations involve building lasting structures and leaving a legacy.', hi: 'संस्थागत, सरकारी और स्थापित नेटवर्क से लाभ। मित्र परिपक्व, अनुशासित और कम किन्तु विश्वसनीय। स्थायी संरचनाएँ बनाने और विरासत छोड़ने की आकांक्षाएँ।' } },
            { house: '12th', effect: { en: 'Expenditure on duties and structural responsibilities. Foreign residence for career advancement. Spiritual growth through sustained ascetic practice and renunciation. Solitude as productive rather than lonely.', hi: 'कर्तव्यों और संरचनात्मक जिम्मेदारियों पर व्यय। करियर उन्नति हेतु विदेशी निवास। सतत तपस्या और त्याग से आध्यात्मिक विकास। एकान्त उत्पादक — अकेलापन नहीं।' } },
          ].map((item, i) => (
            <div key={i} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-light font-bold text-sm" style={hf}>{item.house} House</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(item.effect)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Makara (Capricorn) is the tenth sign — earth element, cardinal quality, ruled by Saturn. Spans 270°-300° of the zodiac.', hi: 'मकर दशम राशि — पृथ्वी तत्त्व, चर गुण, शनि द्वारा शासित। राशिचक्र के 270°-300°।' }),
        ml({ en: 'Mars is exalted at 28°. Jupiter is debilitated at 5°. Saturn is in its own sign. Body: knees, bones, joints, skin.', hi: 'मंगल 28° पर उच्च। गुरु 5° पर नीच। शनि स्वराशि में। शरीर: घुटने, हड्डियाँ, जोड़, त्वचा।' }),
        ml({ en: 'Three nakshatras: Uttara Ashadha padas 2-4 (Sun), Shravana (Moon), Dhanishtha padas 1-2 (Mars).', hi: 'तीन नक्षत्र: उत्तराषाढ़ा पद 2-4 (सूर्य), श्रवण (चन्द्र), धनिष्ठा पद 1-2 (मंगल)।' }),
        ml({ en: 'Remedy: Blue Sapphire (with caution), Saturday fasting, Shani Dev worship, service to the elderly and destitute.', hi: 'उपाय: नीलम (सावधानी से), शनिवार व्रत, शनि देव पूजा, वृद्ध और निराश्रित की सेवा।' }),
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
