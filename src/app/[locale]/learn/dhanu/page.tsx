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
  { devanagari: 'धनु', transliteration: 'Dhanu', meaning: { en: 'Bow — the sign of the celestial archer', hi: 'धनुष — दिव्य धनुर्धर की राशि' } },
  { devanagari: 'धन्विन्', transliteration: 'Dhanvin', meaning: { en: 'The archer, one who wields the bow', hi: 'धनुर्धर, धनुष धारण करने वाला' } },
  { devanagari: 'चाप', transliteration: 'Chāpa', meaning: { en: 'Arc or bow — alternative name for this sign', hi: 'चाप या धनुष — इस राशि का वैकल्पिक नाम' } },
  { devanagari: 'गुरुक्षेत्र', transliteration: 'Gurukṣetra', meaning: { en: 'Field of Jupiter — domain of the great teacher', hi: 'गुरु का क्षेत्र — महान शिक्षक का स्थान' } },
  { devanagari: 'धर्मराशि', transliteration: 'Dharmarāśi', meaning: { en: 'Sign of dharma, righteousness, and cosmic law', hi: 'धर्म, नीति और ब्रह्मांडीय विधि की राशि' } },
  { devanagari: 'अग्निराशि', transliteration: 'Agnirāśi', meaning: { en: 'Fire sign — the last of the fire triplicity', hi: 'अग्नि राशि — अग्नि त्रिक की अंतिम राशि' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Fire (Agni Tattva)', hi: 'अग्नि तत्त्व' },
  modality: { en: 'Mutable (Dvisvabhava — dual-natured)', hi: 'द्विस्वभाव (उभय — दोहरे स्वभाव वाला)' },
  gender: { en: 'Masculine (Purusha)', hi: 'पुल्लिंग (पुरुष)' },
  ruler: { en: 'Jupiter (Guru/Brihaspati)', hi: 'गुरु (बृहस्पति)' },
  symbol: { en: 'The Archer / Centaur with bow ♐', hi: 'धनुर्धर / धनुष सहित अश्वमानव ♐' },
  degreeRange: { en: '240° to 270° of the zodiac', hi: 'राशिचक्र के 240° से 270°' },
  direction: { en: 'East (Purva)', hi: 'पूर्व दिशा' },
  season: { en: 'Hemanta Ritu (Late Autumn / Pre-Winter)', hi: 'हेमन्त ऋतु (शरद के बाद / शीत से पहले)' },
  color: { en: 'Yellow / Tawny gold', hi: 'पीला / सुनहरा भूरा' },
  bodyPart: { en: 'Hips, thighs, liver, sciatic nerve', hi: 'कूल्हे, जाँघें, यकृत, कटि स्नायु' },
};

// ─── Nakshatras in Dhanu ───────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Moola (Mula)', hi: 'मूल' },
    range: { en: '240°00\' to 253°20\' (all 4 padas in Dhanu)', hi: '240°00\' से 253°20\' (सभी 4 पद धनु में)' },
    lord: { en: 'Ketu', hi: 'केतु' },
    nature: { en: 'Moola means "root" — the nakshatra of uprooting, destruction of old structures, and penetrating to the foundation. Ketu\'s rulership gives spiritual depth and detachment from material concerns. Natives may face early life upheavals that ultimately redirect them toward deeper purpose. Research, investigation, medicine (especially root-cause diagnosis), and spiritual seeking are natural domains. The Moola native tears down what is false to reach what is true.', hi: 'मूल का अर्थ है "जड़" — उखाड़ने, पुरानी संरचनाओं के विनाश और नींव तक पहुँचने का नक्षत्र। केतु का स्वामित्व आध्यात्मिक गहराई और भौतिक विरक्ति देता है। जातक को प्रारम्भिक जीवन में उथल-पुथल हो सकती है जो अंततः गहन उद्देश्य की ओर निर्देशित करती है। शोध, अन्वेषण, चिकित्सा और आध्यात्मिक खोज स्वाभाविक क्षेत्र हैं।' },
  },
  {
    name: { en: 'Purva Ashadha', hi: 'पूर्वाषाढ़ा' },
    range: { en: '253°20\' to 266°40\' (all 4 padas in Dhanu)', hi: '253°20\' से 266°40\' (सभी 4 पद धनु में)' },
    lord: { en: 'Venus (Shukra)', hi: 'शुक्र' },
    nature: { en: 'Purva Ashadha means "the former invincible one" — the nakshatra of early victory and unshakeable conviction. Venus\'s rulership brings artistic talent, charisma, and a love of philosophy combined with beauty. The native possesses a magnetic personality and deep persuasive power. Water is a strong symbol — purification, renewal, and the unstoppable force of flowing conviction. Debate, preaching, diplomacy, and artistic performance flourish here.', hi: 'पूर्वाषाढ़ा का अर्थ है "पूर्व का अजेय" — प्रारम्भिक विजय और अटल विश्वास का नक्षत्र। शुक्र का स्वामित्व कलात्मक प्रतिभा, आकर्षण और सौन्दर्य सहित दर्शन का प्रेम देता है। जातक में चुम्बकीय व्यक्तित्व और गहन प्रेरक शक्ति होती है। जल शुद्धिकरण, नवीनीकरण और अप्रतिरोध्य प्रवाह का प्रतीक है।' },
  },
  {
    name: { en: 'Uttara Ashadha (pada 1)', hi: 'उत्तराषाढ़ा (पद 1)' },
    range: { en: '266°40\' to 270°00\' (pada 1 only in Dhanu)', hi: '266°40\' से 270°00\' (केवल पद 1 धनु में)' },
    lord: { en: 'Sun (Surya)', hi: 'सूर्य' },
    nature: { en: 'Uttara Ashadha means "the latter invincible one" — final, decisive victory that is permanent and unchallengeable. Sun\'s rulership gives authority, leadership, and universal acclaim. Only pada 1 falls in Sagittarius (Dhanu navamsha), bringing the most expansive and philosophical expression. The native becomes an unchallenged authority in their field — a leader whose victory comes through righteousness, not force. Government, law, and religious leadership are natural callings.', hi: 'उत्तराषाढ़ा का अर्थ है "उत्तर का अजेय" — अंतिम, निर्णायक विजय जो स्थायी और अचूक है। सूर्य का स्वामित्व अधिकार, नेतृत्व और सार्वभौमिक मान्यता देता है। केवल पद 1 धनु में आता है, सबसे विस्तृत और दार्शनिक अभिव्यक्ति। जातक अपने क्षेत्र में निर्विवाद प्राधिकार बनता है।' },
  },
];

// ─── Planetary Dignities in Dhanu ──────────────────────────────────────
const PLANETARY_DIGNITIES_HERE = {
  rulerAndOwn: { en: 'Jupiter (Guru) — own sign and moolatrikona 0°-10°. Jupiter is in its full glory here, expressing wisdom, generosity, dharma, and expansive vision without any constraint.', hi: 'गुरु (बृहस्पति) — स्वराशि और मूलत्रिकोण 0°-10°। गुरु यहाँ पूर्ण वैभव में है, ज्ञान, उदारता, धर्म और विस्तृत दृष्टि बिना किसी बाधा के व्यक्त करता है।' },
  exalted: { en: 'Ketu is considered exalted in Sagittarius by Parashari tradition. The headless node achieves spiritual transcendence in Jupiter\'s dharmic fire sign — liberation through philosophical surrender.', hi: 'परसरीय परम्परा में केतु धनु में उच्च माना जाता है। शिरहीन छाया ग्रह गुरु की धर्म अग्नि राशि में आध्यात्मिक उत्कर्ष प्राप्त करता है — दार्शनिक समर्पण से मोक्ष।' },
  debilitated: { en: 'No planet has its debilitation point in Sagittarius. This is fitting — the sign of dharma does not weaken any planet, though some struggle with its expansive demands.', hi: 'किसी ग्रह का नीच बिन्दु धनु में नहीं है। यह उचित है — धर्म की राशि किसी ग्रह को दुर्बल नहीं करती, हालाँकि कुछ इसकी विस्तृत माँगों से जूझते हैं।' },
  moolatrikona: { en: 'Jupiter\'s moolatrikona spans 0° to 10° of Sagittarius — the purest expression of Jupiterian wisdom, where the guru teaches from direct realization rather than book learning.', hi: 'गुरु का मूलत्रिकोण धनु के 0° से 10° तक है — गुरु ज्ञान की शुद्धतम अभिव्यक्ति, जहाँ गुरु पुस्तक ज्ञान के बजाय प्रत्यक्ष अनुभव से शिक्षा देता है।' },
};

// ─── Each Planet in Dhanu ──────────────────────────────────────────────
const EACH_PLANET_IN_SIGN: { planet: ML; effect: ML; dignity: string }[] = [
  {
    planet: { en: 'Sun (Surya)', hi: 'सूर्य' },
    dignity: 'Friend\'s sign',
    effect: {
      en: 'Sun in Sagittarius creates a noble, righteous, and philosophically minded individual. The soul (Atma) expresses itself through higher learning, teaching, law, and religious or spiritual leadership. The native commands respect through moral authority rather than force. Travel to sacred places and foreign lands is a hallmark. The father may be a teacher, priest, or person of principle. Strong convictions, sometimes bordering on dogmatism, characterize this placement. Government service in education, judiciary, or diplomacy suits well.',
      hi: 'धनु में सूर्य एक उदात्त, धर्मनिष्ठ और दार्शनिक व्यक्ति बनाता है। आत्मा उच्च शिक्षा, अध्यापन, विधि और आध्यात्मिक नेतृत्व से अभिव्यक्त होती है। जातक बल के बजाय नैतिक अधिकार से सम्मान प्राप्त करता है। पवित्र स्थानों और विदेश की यात्रा विशिष्ट है। पिता शिक्षक, पुजारी या सिद्धान्तवादी हो सकते हैं।'
    },
  },
  {
    planet: { en: 'Moon (Chandra)', hi: 'चन्द्र' },
    dignity: 'Neutral',
    effect: {
      en: 'Moon in Sagittarius produces an optimistic, adventurous, and philosophically inclined mind. Emotions are expressed through grand gestures, generous acts, and a love of freedom. The native dislikes emotional confinement and thrives in wide-open spaces — both physical and intellectual. The mother may be religious, well-traveled, or highly educated. Emotional security comes from belief systems, teaching, and connection to higher purpose rather than material accumulation. Can be emotionally restless, always seeking the next horizon.',
      hi: 'धनु में चन्द्र आशावादी, साहसिक और दार्शनिक प्रवृत्ति का मन बनाता है। भावनाएँ विशाल संकेतों, उदार कृत्यों और स्वतन्त्रता के प्रेम से व्यक्त होती हैं। जातक भावनात्मक बन्धन से विमुख होता है। माता धार्मिक, बहुभ्रमित या उच्च शिक्षित हो सकती है। भावनात्मक सुरक्षा विश्वास प्रणालियों और उच्च उद्देश्य से आती है।'
    },
  },
  {
    planet: { en: 'Mars (Mangal)', hi: 'मंगल' },
    dignity: 'Friend\'s sign',
    effect: {
      en: 'Mars in Sagittarius creates the dharmic warrior — courage directed by moral principle and philosophical conviction. This is the crusader, the fighter for truth and justice. Physical energy is abundant and loves outdoor adventure, sports, and long-distance travel. Military officers with ethical codes, sports coaches, adventure guides, and religious leaders who lead through action all thrive with this placement. The native fights for higher ideals, not personal gain. Can become fanatical, self-righteous, and preachy about beliefs when unchecked.',
      hi: 'धनु में मंगल धार्मिक योद्धा बनाता है — नैतिक सिद्धान्त और दार्शनिक विश्वास से निर्देशित साहस। यह सत्य और न्याय का सेनानी है। शारीरिक ऊर्जा प्रचुर है और बाहरी साहस, खेल और दीर्घ यात्रा से प्रेम। नैतिक सैन्य अधिकारी, खेल प्रशिक्षक और कर्मठ धार्मिक नेता इस स्थिति में फलते-फूलते हैं। कट्टरता और आत्म-धार्मिकता सम्भव।'
    },
  },
  {
    planet: { en: 'Mercury (Budha)', hi: 'बुध' },
    dignity: 'Neutral',
    effect: {
      en: 'Mercury in Sagittarius expands the intellect beyond analytical detail into big-picture thinking. The native grasps abstract concepts, philosophical frameworks, and cross-cultural ideas with ease. Communication is enthusiastic, expansive, and sometimes exaggerated. Writing and teaching on philosophical, religious, or legal subjects come naturally. However, Mercury\'s precision can be lost in Jupiter\'s expansiveness — attention to detail may suffer. Publishing, international law, comparative religion, and academic lecturing are excellent career paths.',
      hi: 'धनु में बुध बुद्धि को विश्लेषणात्मक विस्तार से बड़ी तस्वीर की ओर विस्तृत करता है। जातक अमूर्त अवधारणाओं, दार्शनिक ढाँचों और अन्तर-सांस्कृतिक विचारों को सहजता से समझता है। संवाद उत्साही और विस्तृत है। दार्शनिक, धार्मिक या कानूनी विषयों पर लेखन और शिक्षण स्वाभाविक। विवरण पर ध्यान कम हो सकता है।'
    },
  },
  {
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु' },
    dignity: 'Own sign / Moolatrikona (0°-10°)',
    effect: {
      en: 'Jupiter in its own sign and moolatrikona is the guru on his throne — wisdom, generosity, dharma, and spiritual authority at their purest. The native is a natural teacher, counselor, and moral compass for their community. Philosophical depth is extraordinary, and the native\'s optimism and faith inspire others. This placement bestows good fortune, protection through merit, and the capacity to guide others on their spiritual path. Can become overindulgent, moralistic, or preachy. The 0°-10° moolatrikona range produces the highest expression — direct experiential wisdom.',
      hi: 'गुरु अपनी स्वराशि और मूलत्रिकोण में राजसिंहासन पर गुरु है — ज्ञान, उदारता, धर्म और आध्यात्मिक अधिकार अपनी शुद्धतम अवस्था में। जातक स्वाभाविक शिक्षक, परामर्शदाता और समुदाय का नैतिक दिशासूचक है। दार्शनिक गहराई असाधारण है। 0°-10° मूलत्रिकोण उच्चतम अभिव्यक्ति — प्रत्यक्ष अनुभवात्मक ज्ञान।'
    },
  },
  {
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र' },
    dignity: 'Neutral',
    effect: {
      en: 'Venus in Sagittarius seeks love through shared beliefs, philosophical connection, and adventurous experience rather than sensual comfort alone. The native is attracted to partners from different cultures, religions, or educational backgrounds. Artistic expression has a grand, expansive quality — epic storytelling, large-scale productions, and art that serves a philosophical purpose. Marriage may involve someone from a foreign land or different faith tradition. Luxury preferences lean toward travel, education, and cultural experiences over material possessions.',
      hi: 'धनु में शुक्र साझा विश्वासों, दार्शनिक जुड़ाव और साहसिक अनुभव से प्रेम खोजता है। जातक भिन्न संस्कृतियों, धर्मों या शैक्षिक पृष्ठभूमि के साथियों की ओर आकर्षित होता है। कलात्मक अभिव्यक्ति विशाल और विस्तृत — महाकाव्य कथा और दार्शनिक उद्देश्य की कला। विवाह विदेशी या भिन्न परम्परा के व्यक्ति से सम्भव।'
    },
  },
  {
    planet: { en: 'Saturn (Shani)', hi: 'शनि' },
    dignity: 'Neutral',
    effect: {
      en: 'Saturn in Sagittarius creates a serious, disciplined approach to philosophy, religion, and higher learning. The native earns wisdom through hardship, patience, and sustained effort over many years. Teaching comes late in life but carries immense authority. Religious practice is austere rather than celebratory — pilgrimage undertaken on foot, study continued through poverty, principles maintained through persecution. Can produce rigid dogmatism or, at its best, unshakeable moral integrity. Academic careers, judicial service, and monastic life suit this placement.',
      hi: 'धनु में शनि दर्शन, धर्म और उच्च शिक्षा के प्रति गम्भीर, अनुशासित दृष्टिकोण बनाता है। जातक कठिनाई, धैर्य और वर्षों के निरन्तर प्रयास से ज्ञान अर्जित करता है। शिक्षण जीवन में देर से आता है किन्तु अपार अधिकार रखता है। धार्मिक अभ्यास उत्सवी के बजाय तपस्वी — पैदल तीर्थयात्रा, गरीबी में अध्ययन।'
    },
  },
  {
    planet: { en: 'Rahu', hi: 'राहु' },
    dignity: 'Neutral',
    effect: {
      en: 'Rahu in Sagittarius creates an insatiable hunger for knowledge, truth, and philosophical meaning — but through unconventional, unorthodox, or foreign channels. The native may convert to a different religion, pursue esoteric philosophies, or become obsessed with ideologies outside their birth culture. Academic fraud, religious deception, or spiritual materialism are shadow expressions. At its best, Rahu here produces visionary thinkers who synthesize multiple traditions into revolutionary worldviews. Foreign universities and multicultural spiritual communities are natural habitats.',
      hi: 'धनु में राहु ज्ञान, सत्य और दार्शनिक अर्थ की अतृप्त भूख — किन्तु अपरम्परागत या विदेशी माध्यमों से। जातक भिन्न धर्म अपना सकता है या जन्म संस्कृति से बाहर की विचारधाराओं से ग्रस्त हो सकता है। छाया अभिव्यक्ति: शैक्षणिक धोखा, धार्मिक प्रवंचना। सर्वोत्तम रूप में अनेक परम्पराओं को मिलाने वाले दूरदर्शी विचारक।'
    },
  },
  {
    planet: { en: 'Ketu', hi: 'केतु' },
    dignity: 'Exalted (Parashari)',
    effect: {
      en: 'Ketu achieves exaltation in Sagittarius — the headless node finds its highest purpose in Jupiter\'s dharmic fire. The native possesses deep, intuitive spiritual wisdom that transcends book learning. Past-life spiritual merit manifests as natural detachment from dogma while retaining its essence. The native may be a born mystic, healer, or sage who understands truth without needing to intellectualize it. Can produce disillusionment with organized religion while deepening authentic spirituality. Meditation, moksha-oriented practices, and non-dual philosophy come naturally.',
      hi: 'केतु धनु में उच्च प्राप्त करता है — शिरहीन छाया ग्रह को गुरु की धर्म अग्नि में उच्चतम उद्देश्य मिलता है। जातक में गहन अन्तर्ज्ञानी आध्यात्मिक ज्ञान जो पुस्तक ज्ञान से परे है। पूर्व जन्म का आध्यात्मिक पुण्य स्वाभाविक विरक्ति के रूप में प्रकट। जन्मजात रहस्यवादी, चिकित्सक या ऋषि। ध्यान, मोक्ष-उन्मुख साधना और अद्वैत दर्शन स्वाभाविक।'
    },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY_TRAITS = {
  strengths: {
    en: 'Optimistic and visionary — sees the grand design where others see only fragments. Generous to a fault, sharing knowledge, resources, and time freely. Natural teacher and philosopher who inspires others through lived example rather than mere words. Adventurous spirit that embraces foreign cultures, long journeys, and unknown territories. Honest and direct in communication — values truth over diplomacy. Strong moral compass guided by dharma. Resilient faith that sustains through adversity.',
    hi: 'आशावादी और दूरदर्शी — जहाँ अन्य केवल टुकड़े देखते हैं वहाँ विशाल रचना देखता है। अत्यधिक उदार, ज्ञान, संसाधन और समय स्वतन्त्र रूप से बाँटता है। स्वाभाविक शिक्षक और दार्शनिक जो शब्दों से नहीं बल्कि जीवित उदाहरण से प्रेरित करता है। साहसिक भावना जो विदेशी संस्कृतियों और अज्ञात क्षेत्रों को अपनाती है। ईमानदार और प्रत्यक्ष संवाद। धर्म द्वारा निर्देशित सशक्त नैतिक दिशासूचक।'
  },
  weaknesses: {
    en: 'Restless and commitment-averse — the constant search for the next horizon can prevent deep roots. Self-righteous and preachy when convinced of their moral superiority. Exaggeration and over-promising are endemic — the Sagittarian vision is always larger than reality can deliver. Tactless honesty that wounds without intending to. Careless with details, finances, and practical responsibilities. Can be dogmatic, fanatical, or blindly faithful to ideologies that deserve scrutiny.',
    hi: 'अस्थिर और प्रतिबद्धता-विमुख — अगले क्षितिज की निरन्तर खोज गहरी जड़ों को रोकती है। नैतिक श्रेष्ठता के विश्वास में आत्म-धार्मिक और उपदेशक। अतिशयोक्ति और अत्यधिक वादे स्थानिक — धनु की दृष्टि सदा वास्तविकता से बड़ी। अनजाने में घायल करने वाली कुशलताहीन ईमानदारी। विवरण, वित्त और व्यावहारिक जिम्मेदारियों में लापरवाह।'
  },
  temperament: {
    en: 'The Sagittarian temperament is sanguine and choleric — warm-blooded, enthusiastic, and quick to ignite with passion for a cause. Pitta dominates the constitution, supported by Vata\'s restless movement. The native oscillates between intense engagement with the world and philosophical withdrawal for reflection. Anger flares quickly but dissipates just as fast — Sagittarians rarely hold grudges. Their fundamental orientation is toward growth, expansion, and upward movement. They are the eternal students and eternal teachers of the zodiac.',
    hi: 'धनु का स्वभाव आशावादी और उत्साही है — गरम रक्त, उत्साही और किसी कारण के लिए जुनून से शीघ्र प्रज्वलित। पित्त प्रधान संरचना, वात की अस्थिर गति से समर्थित। जातक संसार से तीव्र संलग्नता और चिन्तन के लिए दार्शनिक एकान्त के बीच झूलता है। क्रोध शीघ्र भड़कता है किन्तु उतनी ही तेजी से शान्त — धनु शायद ही कभी द्वेष रखता है।'
  },
  appearance: {
    en: 'Typically tall with a well-proportioned, athletic frame — especially strong thighs and hips. The upper body may lean forward as if perpetually walking toward a destination. Forehead is broad and open, suggesting a mind that thinks in wide arcs. Eyes are bright and alert with an exploratory quality. Gait is long-strided and purposeful. Complexion tends toward warmth. The overall impression is of someone ready to depart for a journey at any moment.',
    hi: 'प्रायः लम्बा, सुगठित खिलाड़ी काया — विशेषकर मजबूत जाँघें और कूल्हे। ऊपरी शरीर आगे झुका हुआ जैसे सतत गन्तव्य की ओर चल रहा हो। माथा चौड़ा और खुला, विस्तृत चिन्तन का सुझाव। आँखें चमकदार और सतर्क। चाल लम्बी और उद्देश्यपूर्ण। रंगत गरम भाव की ओर। समग्र छवि: किसी भी क्षण यात्रा पर निकलने को तैयार।'
  },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER_TENDENCIES = {
  suited: {
    en: 'University professor, philosopher, theologian, religious leader, judge, lawyer (especially international law), diplomat, foreign service officer, travel writer, adventure guide, publisher, equestrian, archer, sports coach, motivational speaker, cultural ambassador, NGO director, pilgrimage organizer, interfaith dialogue facilitator',
    hi: 'विश्वविद्यालय प्रोफेसर, दार्शनिक, धर्मशास्त्री, धार्मिक नेता, न्यायाधीश, वकील (विशेषकर अन्तर्राष्ट्रीय विधि), राजनयिक, विदेश सेवा अधिकारी, यात्रा लेखक, साहसिक मार्गदर्शक, प्रकाशक, अश्वारोही, धनुर्विद, खेल प्रशिक्षक, प्रेरक वक्ता, सांस्कृतिक राजदूत, एनजीओ निदेशक'
  },
  nature: {
    en: 'Sagittarius natives excel in careers that combine intellectual depth with physical or geographical breadth. They need roles that allow growth, travel, and philosophical engagement — confined desk jobs wither their spirit. The ideal Dhanu career involves teaching what they have learned through direct experience, leading others toward higher understanding, and connecting diverse cultures or knowledge systems.',
    hi: 'धनु जातक ऐसे करियर में उत्कृष्ट होते हैं जो बौद्धिक गहराई को भौतिक या भौगोलिक विस्तार से जोड़ते हैं। उन्हें ऐसी भूमिकाएँ चाहिए जो विकास, यात्रा और दार्शनिक संलग्नता की अनुमति दें — सीमित डेस्क कार्य उनकी आत्मा को मुरझा देता है। आदर्श धनु करियर में प्रत्यक्ष अनुभव से सीखे हुए का शिक्षण शामिल है।'
  },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: {
    en: 'Aries (Mesha) — fellow fire sign that matches Sagittarius\'s energy and enthusiasm. Leo (Simha) — shared fire element creates mutual admiration and grand adventures. Libra (Tula) — air feeds fire; philosophical and aesthetic harmony. Aquarius (Kumbha) — shared idealism and love of freedom creates a progressive, unconventional partnership.',
    hi: 'मेष — सह-अग्नि राशि जो धनु की ऊर्जा और उत्साह से मेल खाती है। सिंह — साझा अग्नि तत्त्व परस्पर प्रशंसा और भव्य साहस। तुला — वायु अग्नि को पोषित करती है; दार्शनिक और सौन्दर्य सामंजस्य। कुम्भ — साझा आदर्शवाद और स्वतन्त्रता प्रेम।'
  },
  challenging: {
    en: 'Virgo (Kanya) — Mercury\'s detail-oriented earth sign frustrates Sagittarius\'s big-picture thinking; constant tension between precision and expansion. Pisces (Meena) — despite shared Jupiter rulership, the emotional depth of Pisces can feel claustrophobic to the freedom-loving Archer. Cancer (Karka) — the Crab\'s need for domestic security clashes with Sagittarius\'s wanderlust.',
    hi: 'कन्या — बुध की विस्तार-विरोधी पृथ्वी राशि धनु की बड़ी तस्वीर सोच को निराश करती है। मीन — साझा गुरु स्वामित्व के बावजूद भावनात्मक गहराई स्वतन्त्रता-प्रिय धनुर्धर को घुटन दे सकती है। कर्क — घरेलू सुरक्षा की आवश्यकता धनु की भ्रमण-लालसा से टकराती है।'
  },
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES_AND_WORSHIP = {
  deity: {
    en: 'Lord Vishnu in his Vamana (dwarf) avatara — the fifth incarnation who conquered the three worlds with three steps. Dakshinamurthy (Shiva as the south-facing silent teacher) is also worshipped for Sagittarian wisdom. Jupiter is the guru of the devas, so worship of one\'s own guru (teacher) is considered the highest remedy.',
    hi: 'भगवान विष्णु वामन अवतार में — पाँचवाँ अवतार जिसने तीन पगों में तीन लोक जीते। दक्षिणामूर्ति (दक्षिणमुखी मौन शिक्षक शिव) भी धनु ज्ञान के लिए पूजित। गुरु देवगुरु है, इसलिए अपने गुरु की पूजा सर्वोत्तम उपाय।'
  },
  practices: {
    en: 'Recite Guru Beej Mantra: "Om Graam Greem Graum Sah Gurave Namah" — 19,000 times in 40 days. Wear Yellow Sapphire (Pukhraj) in gold on the index finger on Thursday during Shukla Paksha. Donate yellow cloth, turmeric, gram dal, bananas, and books on Thursdays. Fast on Thursdays consuming only one meal of yellow foods. Offer water to a Peepal tree on Thursdays. Study scriptures and share knowledge freely — this is the most natural remedy for Sagittarius.',
    hi: 'गुरु बीज मन्त्र: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः" — 40 दिनों में 19,000 जाप। पुखराज स्वर्ण में गुरुवार शुक्ल पक्ष में तर्जनी में धारण। गुरुवार को पीला वस्त्र, हल्दी, चना दाल, केला और पुस्तकें दान। गुरुवार को पीपल वृक्ष को जल अर्पण। शास्त्र अध्ययन और ज्ञान मुक्त रूप से बाँटना — धनु का सबसे स्वाभाविक उपाय।'
  },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: {
    en: 'The celestial archer of Sagittarius is identified with the centaur Chiron in Greco-Indian synthesis, but in Vedic tradition, the archer represents Dhanurveda — the science of archery that is itself a branch of the Vedas. The bow (dhanu) symbolizes the span between earth and heaven, with the arrow representing the focused intention that bridges the mortal and divine realms. In the Mahabharata, the great archer Arjuna — taught by Dronacharya and blessed by Shiva (Pashupatastra) — embodies the Sagittarian ideal: supreme skill guided by dharmic purpose. Sagittarius is the natural ninth sign, ruling the ninth house of dharma in the Kala Purusha — the cosmic being whose body maps the zodiac. The ninth house governs father, guru, fortune, pilgrimage, and higher law — all domains where the Archer excels.',
    hi: 'धनु का दिव्य धनुर्धर वैदिक परम्परा में धनुर्वेद का प्रतिनिधित्व करता है — वेदों की एक शाखा जो धनुर्विद्या का विज्ञान है। धनुष पृथ्वी और स्वर्ग के बीच विस्तार का प्रतीक है, बाण केन्द्रित संकल्प जो मर्त्य और दिव्य लोकों को जोड़ता है। महाभारत में महान धनुर्धर अर्जुन — द्रोणाचार्य द्वारा शिक्षित और शिव (पाशुपतास्त्र) द्वारा कृपापात्र — धनु आदर्श का मूर्तिमान रूप: धर्म उद्देश्य से निर्देशित सर्वोच्च कौशल। धनु स्वाभाविक नवम राशि है, काल पुरुष में धर्म भाव का शासक — पिता, गुरु, भाग्य, तीर्थ और उच्च विधि के क्षेत्र।'
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/rashis', label: { en: 'All Twelve Rashis', hi: 'सभी बारह राशियाँ' } },
  { href: '/learn/guru', label: { en: 'Guru (Jupiter) — Ruler of Dhanu', hi: 'गुरु (बृहस्पति) — धनु का स्वामी' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/makara', label: { en: 'Makara (Capricorn) — Next Sign', hi: 'मकर — अगली राशि' } },
  { href: '/learn/vrischika', label: { en: 'Vrischika (Scorpio) — Previous Sign', hi: 'वृश्चिक — पिछली राशि' } },
  { href: '/learn/meena', label: { en: 'Meena (Pisces) — Other Jupiter Sign', hi: 'मीन — गुरु की अन्य राशि' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Jyotish', hi: 'ज्योतिष में योग' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function DhanuPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 mb-4">
          <span className="text-4xl">♐</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Dhanu — Sagittarius', hi: 'धनु राशि — धनुर्धर' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The ninth sign of the zodiac — Jupiter\'s fiery domain of dharma, philosophy, higher learning, and the eternal quest for truth across all horizons.', hi: 'राशिचक्र की नवम राशि — गुरु का अग्निमय क्षेत्र, धर्म, दर्शन, उच्च शिक्षा और सभी क्षितिजों पर सत्य की शाश्वत खोज।' })}
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
        <p style={bf}>{ml({ en: 'Dhanu (Sagittarius) is the ninth sign of the zodiac, spanning 240° to 270°. Ruled by Jupiter (Guru), it is the last of the fire triplicity and carries the mutable (dvisvabhava) quality — combining fire\'s passionate energy with adaptable, dual-natured flexibility. The Archer symbolizes the human quest to transcend physical limitations through knowledge, faith, and moral purpose. As the natural ruler of the ninth house (Dharma Bhava), Sagittarius governs higher education, long-distance travel, religious institutions, the father, the guru, and one\'s relationship with cosmic law. It is the sign where raw fire becomes philosophical illumination.', hi: 'धनु राशिचक्र की नवम राशि है, 240° से 270° तक। गुरु (बृहस्पति) द्वारा शासित, यह अग्नि त्रिक की अंतिम और द्विस्वभाव (उभय) गुण वाली राशि है — अग्नि की उत्कट ऊर्जा को अनुकूलनीय लचीलेपन के साथ जोड़ती है। धनुर्धर ज्ञान, विश्वास और नैतिक उद्देश्य से भौतिक सीमाओं को पार करने की मानवीय खोज का प्रतीक है। नवम भाव (धर्म भाव) के स्वाभाविक शासक के रूप में, धनु उच्च शिक्षा, दीर्घ यात्रा, धार्मिक संस्थाओं, पिता, गुरु और ब्रह्मांडीय विधि से सम्बन्ध शासित करता है।' })}</p>
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
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Dhanu', hi: 'धनु में नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Sagittarius contains three nakshatras whose lords — Ketu, Venus, and Sun — create a remarkable progression: from spiritual uprooting (Moola/Ketu), through artistic conviction (Purva Ashadha/Venus), to sovereign authority (Uttara Ashadha/Sun). This sequence mirrors the Sagittarian journey from questioning to certainty to leadership.', hi: 'धनु में तीन नक्षत्र हैं जिनके स्वामी — केतु, शुक्र और सूर्य — एक उल्लेखनीय क्रम बनाते हैं: आध्यात्मिक उन्मूलन (मूल/केतु) से कलात्मक विश्वास (पूर्वाषाढ़ा/शुक्र) से सार्वभौम अधिकार (उत्तराषाढ़ा/सूर्य) तक।' })}</p>
        {NAKSHATRAS_IN_SIGN.map((n, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(n.name)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">{ml(n.lord)}</span>
            </div>
            <p className="text-text-secondary text-xs mb-2">{ml(n.range)}</p>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.nature)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Nakshatra Vibhaga" />
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Dhanu', hi: 'धनु में ग्रह गरिमा' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Sagittarius is Jupiter\'s home and moolatrikona sign. Uniquely, no planet is debilitated here — the sign of dharma provides a supportive field for all planetary energies. Ketu finds its exaltation in this sign per Parashari tradition, achieving spiritual transcendence through philosophical fire.', hi: 'धनु गुरु की स्वराशि और मूलत्रिकोण है। विशेष रूप से, कोई ग्रह यहाँ नीच नहीं — धर्म की राशि सभी ग्रह ऊर्जाओं के लिए सहायक क्षेत्र प्रदान करती है। परसरीय परम्परा में केतु यहाँ उच्च प्राप्त करता है।' })}</p>
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

      {/* ── 5. Each Planet in Dhanu ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Sagittarius', hi: 'धनु में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Each planet expresses itself uniquely through Jupiter\'s expansive fire sign. Fire planets (Sun, Mars) find natural expression here; intellectual planets (Mercury) gain breadth but lose precision; receptive planets (Moon, Venus) find their emotions colored by philosophical seeking and wanderlust.', hi: 'प्रत्येक ग्रह गुरु की विस्तृत अग्नि राशि से अनूठे ढंग से अभिव्यक्त होता है। अग्नि ग्रह (सूर्य, मंगल) को स्वाभाविक अभिव्यक्ति मिलती है; बौद्धिक ग्रह (बुध) को विस्तार मिलता है किन्तु सूक्ष्मता खोती है; ग्राही ग्रह (चन्द्र, शुक्र) की भावनाएँ दार्शनिक खोज और भ्रमण-लालसा से रंगित होती हैं।' })}</p>
        {EACH_PLANET_IN_SIGN.map((p, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              {p.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  p.dignity.includes('Exalted') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  p.dignity.includes('Own') || p.dignity.includes('Moolatrikona') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  p.dignity.includes('Friend') ? 'bg-gold-primary/10 border-gold-primary/30 text-gold-light' :
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
          {ml({ en: 'The Sagittarian career flourishes when the native can teach, travel, and grow simultaneously. A career that offers only money without meaning will never satisfy this sign — they need to feel that their work contributes to the expansion of human understanding.', hi: 'धनु करियर तब फलता-फूलता है जब जातक एक साथ पढ़ा सकता है, यात्रा कर सकता है और बढ़ सकता है। केवल धन बिना अर्थ का करियर इस राशि को कभी सन्तुष्ट नहीं करेगा — उन्हें अनुभव चाहिए कि उनका कार्य मानवीय समझ के विस्तार में योगदान देता है।' })}
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
          {ml({ en: 'The most powerful remedy for Sagittarius is the act of teaching and sharing knowledge. Jupiter, the ruler, is the guru of the devas — his energy is activated through the generosity of wisdom. When a Dhanu native teaches freely, studies deeply, and undertakes pilgrimages with genuine seeking, they align with the sign\'s highest purpose.', hi: 'धनु का सबसे शक्तिशाली उपाय शिक्षण और ज्ञान बाँटने का कर्म है। स्वामी गुरु देवगुरु है — उसकी ऊर्जा ज्ञान की उदारता से सक्रिय होती है। जब धनु जातक मुक्त रूप से पढ़ाता है, गहन अध्ययन करता है और सच्ची खोज के साथ तीर्थयात्रा करता है, तो वह राशि के उच्चतम उद्देश्य से जुड़ जाता है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Symbolism', hi: 'पौराणिक कथा एवं प्रतीकवाद' })}>
        <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Characteristics" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Dhanu (Sagittarius) is the ninth sign — fire element, mutable quality, ruled by Jupiter. Spans 240°-270° of the zodiac.', hi: 'धनु नवम राशि — अग्नि तत्त्व, द्विस्वभाव, गुरु द्वारा शासित। राशिचक्र के 240°-270°।' }),
        ml({ en: 'Jupiter\'s own sign and moolatrikona (0°-10°). Ketu is exalted here (Parashari). No planet is debilitated in Sagittarius.', hi: 'गुरु की स्वराशि और मूलत्रिकोण (0°-10°)। केतु यहाँ उच्च (परसरीय)। कोई ग्रह धनु में नीच नहीं।' }),
        ml({ en: 'Three nakshatras: Moola (Ketu), Purva Ashadha (Venus), Uttara Ashadha pada 1 (Sun). Body: hips, thighs, liver.', hi: 'तीन नक्षत्र: मूल (केतु), पूर्वाषाढ़ा (शुक्र), उत्तराषाढ़ा पद 1 (सूर्य)। शरीर: कूल्हे, जाँघें, यकृत।' }),
        ml({ en: 'Remedy: Yellow Sapphire, Thursday fasting, Vishnu/Dakshinamurthy worship. The greatest remedy is teaching and sharing knowledge freely.', hi: 'उपाय: पुखराज, गुरुवार व्रत, विष्णु/दक्षिणामूर्ति पूजा। सबसे बड़ा उपाय ज्ञान का मुक्त शिक्षण और बाँटना।' }),
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
