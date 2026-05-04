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
  { devanagari: 'मिथुन', transliteration: 'Mithuna', meaning: { en: 'The Twins — the third sign, symbol of duality, communication, and intellectual curiosity', hi: 'मिथुन — तृतीय राशि, द्वैत, संवाद और बौद्धिक जिज्ञासा का प्रतीक' } },
  { devanagari: 'वायु तत्त्व', transliteration: 'Vayu Tattva', meaning: { en: 'Air element — the breath of thought, movement of ideas, the connecting principle', hi: 'वायु तत्त्व — विचार की श्वास, विचारों की गति, सम्बन्ध स्थापित करने वाला सिद्धान्त' } },
  { devanagari: 'द्विस्वभाव', transliteration: 'Dwiswabhava', meaning: { en: 'Dual/mutable sign — adaptable, changeable, bridging two worlds', hi: 'द्विस्वभाव राशि — अनुकूलनीय, परिवर्तनशील, दो लोकों को जोड़ने वाली' } },
  { devanagari: 'बुध क्षेत्र', transliteration: 'Budha Kshetra', meaning: { en: 'Domain of Mercury — Mithuna is Mercury\'s diurnal home and own sign', hi: 'बुध का क्षेत्र — मिथुन बुध का दिवसीय गृह और स्वराशि' } },
  { devanagari: 'मैथुन', transliteration: 'Maithuna', meaning: { en: 'The coupling, the union of opposites — the root meaning behind the Twins symbol', hi: 'मैथुन — विपरीतों का मिलन, जुड़वाँ प्रतीक का मूल अर्थ' } },
  { devanagari: 'वाक् शक्ति', transliteration: 'Vak Shakti', meaning: { en: 'Power of speech — Mithuna governs all forms of verbal and written communication', hi: 'वाक् शक्ति — मिथुन सभी प्रकार के मौखिक और लिखित संवाद का शासक' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Air (Vayu)', hi: 'वायु तत्त्व' },
  modality: { en: 'Mutable (Dwiswabhava)', hi: 'द्विस्वभाव (Mutable)' },
  gender: { en: 'Masculine (Purusha)', hi: 'पुरुष (पुल्लिंग)' },
  ruler: { en: 'Mercury (Budha)', hi: 'बुध' },
  symbol: { en: 'The Twins (couple)', hi: 'मिथुन (जुड़वाँ / युगल)' },
  degreeRange: { en: '60° to 90° of the zodiac', hi: 'राशि चक्र का 60° से 90°' },
  direction: { en: 'West (Paschima)', hi: 'पश्चिम दिशा' },
  season: { en: 'Grishma (Summer — early)', hi: 'ग्रीष्म ऋतु (प्रारम्भिक)' },
  color: { en: 'Green / Parrot green', hi: 'हरा / तोते जैसा हरा' },
  bodyPart: { en: 'Arms, shoulders, hands, lungs, nervous system', hi: 'भुजाएँ, कन्धे, हाथ, फेफड़े, तन्त्रिका तन्त्र' },
  caste: { en: 'Shudra (Service/Artisan)', hi: 'शूद्र (सेवा/शिल्पकार)' },
  nature: { en: 'Saumya (Gentle/Benefic)', hi: 'सौम्य (शान्त/शुभ)' },
};

// ─── Nakshatras in Mithuna ─────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Mrigashira (Padas 3-4)', hi: 'मृगशिरा (पाद 3-4)' },
    range: { en: '60° - 66°40\' (0°-6°40\' Mithuna)', hi: '60° - 66°40\' (0°-6°40\' मिथुन)' },
    ruler: { en: 'Mars', hi: 'मंगल' },
    deity: { en: 'Soma (Moon God / Sacred Plant)', hi: 'सोम (चन्द्र देव / पवित्र वनस्पति)' },
    qualities: { en: 'The searching deer enters the intellectual realm — Mrigashira\'s Gemini padas combine Mars\'s active pursuit with Mercury\'s analytical mind. The native searches through ideas, conversations, and books rather than physical landscapes. Restless intellectual curiosity that flits from subject to subject. Excellent for academic research, investigative journalism, and competitive debate. The quest is mental rather than material — they seek the perfect argument, the definitive explanation, the undiscovered connection. Can scatter energy across too many intellectual projects.', hi: 'खोजी मृग बौद्धिक क्षेत्र में — मिथुन में मृगशिरा मंगल की सक्रिय खोज और बुध के विश्लेषणात्मक मन का संयोग। जातक विचारों, वार्ताओं और पुस्तकों में खोजता है। अस्थिर बौद्धिक जिज्ञासा विषय से विषय पर। शोध, खोजी पत्रकारिता और प्रतिस्पर्धी वाद-विवाद के लिए उत्कृष्ट।' },
  },
  {
    name: { en: 'Ardra', hi: 'आर्द्रा' },
    range: { en: '66°40\' - 80° (6°40\'-20° Mithuna)', hi: '66°40\' - 80° (6°40\'-20° मिथुन)' },
    ruler: { en: 'Rahu', hi: 'राहु' },
    deity: { en: 'Rudra (Storm God / Fierce form of Shiva)', hi: 'रुद्र (तूफ़ान के देवता / शिव का उग्र रूप)' },
    qualities: { en: 'The storm that clears the air — Ardra is the most intense nakshatra in Gemini, bringing Rahu\'s obsessive energy and Rudra\'s transformative destruction into the intellectual sign. The native has a sharp, sometimes cruel wit that tears apart illusions and pretensions. Exceptional talent for technology, software, electrical engineering, and any field where destroying old paradigms creates new possibilities. Emotional storms arise suddenly and pass quickly. The "tear drop" symbol suggests suffering that leads to clarity — these natives often achieve their greatest breakthroughs after their greatest crises. Can be sarcastic, cynical, and emotionally volatile.', hi: 'वायु को शुद्ध करने वाला तूफ़ान — आर्द्रा मिथुन का सबसे तीव्र नक्षत्र, बौद्धिक राशि में राहु की जुनूनी ऊर्जा और रुद्र का रूपान्तरकारी विनाश। तीक्ष्ण, कभी-कभी क्रूर बुद्धि जो भ्रम और दिखावे को चीरती है। प्रौद्योगिकी, सॉफ़्टवेयर, विद्युत अभियान्त्रिकी में असाधारण प्रतिभा। "अश्रु बिन्दु" प्रतीक — कष्ट से स्पष्टता।' },
  },
  {
    name: { en: 'Punarvasu (Padas 1-3)', hi: 'पुनर्वसु (पाद 1-3)' },
    range: { en: '80° - 90° (20°-30° Mithuna)', hi: '80° - 90° (20°-30° मिथुन)' },
    ruler: { en: 'Jupiter', hi: 'गुरु (बृहस्पति)' },
    deity: { en: 'Aditi (Mother of the Gods / Cosmic Mother)', hi: 'अदिति (देवमाता / ब्रह्माण्डीय माता)' },
    qualities: { en: 'Return to the light — Punarvasu means "return of the light" or "restoration." After Ardra\'s storm, this nakshatra brings renewal, optimism, and the return of intellectual clarity. Jupiter\'s wisdom in Mercury\'s sign creates a teaching-learning energy that is both intellectually curious and philosophically grounded. The native bounces back from setbacks with remarkable resilience. Good for teaching, publishing, counseling, and any work that involves transmitting knowledge. Aditi as mother-goddess suggests generosity of spirit and an inclusive worldview. Can be overly optimistic, preachy, and spread thin across too many charitable commitments.', hi: 'प्रकाश की वापसी — पुनर्वसु का अर्थ "प्रकाश की वापसी" या "पुनर्स्थापन।" आर्द्रा के तूफ़ान के बाद नवीकरण, आशावाद और बौद्धिक स्पष्टता। बुध की राशि में गुरु की बुद्धि — बौद्धिक जिज्ञासा और दार्शनिक आधार। अद्भुत लचीलेपन से विपत्तियों से उबरना। शिक्षण, प्रकाशन, परामर्श के लिए शुभ। अदिति देवमाता — उदार आत्मा।' },
  },
];

// ─── Planetary Dignities ───────────────────────────────────────────────
const PLANETARY_DIGNITIES = {
  exalted: [
    { planet: { en: 'Rahu (per some schools)', hi: 'राहु (कुछ सम्प्रदायों के अनुसार)' }, degree: { en: 'Mithuna (debated)', hi: 'मिथुन (विवादित)' }, effect: { en: 'Some classical authorities place Rahu\'s exaltation in Gemini rather than Taurus. The reasoning: Rahu\'s obsessive, boundary-breaking energy finds its most effective expression in the sign of communication and information. In the modern age, this manifests as mastery of technology, media manipulation, viral content creation, and information warfare. Rahu in Gemini amplifies Mercury\'s intelligence to genius levels but can also produce compulsive lying, information overload, and the inability to distinguish truth from noise.', hi: 'कुछ शास्त्रीय प्राधिकारी राहु का उच्च मिथुन में मानते हैं। तर्क: संवाद और सूचना की राशि में राहु की सीमा-तोड़ ऊर्जा सबसे प्रभावी। आधुनिक युग में प्रौद्योगिकी, मीडिया, वायरल सामग्री और सूचना युद्ध। बुध की बुद्धि प्रतिभा स्तर तक किन्तु बाध्यकारी मिथ्या और सूचना अधिभार भी।' } },
  ],
  debilitated: [
    { planet: { en: 'Ketu (per some schools)', hi: 'केतु (कुछ सम्प्रदायों के अनुसार)' }, degree: { en: 'Mithuna (debated)', hi: 'मिथुन (विवादित)' }, effect: { en: 'If Rahu is exalted in Gemini, Ketu is debilitated here. The headless planet of intuition and detachment in the sign of rational analysis and communication — Ketu struggles to express its wordless knowing through Mercury\'s verbal framework. The native may have difficulty articulating deep spiritual insights, or may reject intellectual pursuits entirely in favor of mystical experience. Speech can be hesitant, cryptic, or prone to sudden silence. However, Ketu in Gemini can produce remarkable telepathic ability, non-verbal communication skills, and insight that transcends language.', hi: 'यदि राहु मिथुन में उच्च तो केतु यहाँ नीच। तर्कसंगत विश्लेषण की राशि में अन्तर्ज्ञान और वैराग्य का शिरहीन ग्रह — केतु बुध के शाब्दिक ढाँचे में अपना शब्दातीत ज्ञान व्यक्त करने में कठिनाई। गहन आध्यात्मिक अन्तर्दृष्टि को व्यक्त करने में कठिनाई। वाणी संकोची, रहस्यमय।' } },
  ],
  ownSign: [
    { planet: { en: 'Mercury (Budha)', hi: 'बुध' }, range: { en: '60° - 90° (full sign)', hi: '60° - 90° (पूर्ण राशि)' }, effect: { en: 'Mercury rules Gemini and is fully at home here — the messenger god in his own palace. This is Mercury at its most quick, versatile, and communicative. The native processes information at extraordinary speed, juggles multiple conversations and projects simultaneously, and has an almost supernatural ability to make connections between disparate ideas. Mercury\'s moolatrikona is in Virgo (not Gemini), so while this is own sign, the analytical depth is somewhat less than Mercury in Virgo. What Gemini Mercury excels at is breadth: knowing a little about everything, connecting people and ideas, and translating complex concepts into accessible language.', hi: 'बुध मिथुन का स्वामी और पूर्णतः स्वगृह में — दूत देव अपने महल में। सबसे तीव्र, बहुमुखी और संवादी बुध। असाधारण गति से सूचना प्रसंस्करण, एक साथ अनेक वार्ता और परियोजनाएँ। बुध का मूलत्रिकोण कन्या में (मिथुन नहीं), अतः विश्लेषणात्मक गहनता कुछ कम। मिथुन बुध विस्तार में उत्कृष्ट: सब कुछ जानना, लोगों और विचारों को जोड़ना।' } },
  ],
};

// ─── Each Planet in Mithuna ────────────────────────────────────────────
const PLANETS_IN_SIGN: { planet: ML; dignity: string; effect: ML }[] = [
  {
    planet: { en: 'Sun (Surya)', hi: 'सूर्य' },
    dignity: 'Neutral',
    effect: { en: 'The Sun in Mercury\'s air sign — the king who rules through communication rather than force. Authority is expressed through knowledge, eloquence, and the ability to articulate vision. The native excels at public speaking, policy articulation, and intellectual leadership. The father may be educated, communicative, or connected to media/publishing. Government roles in education, media regulation, or diplomatic service suit this placement. The solar ego attaches to being the smartest person in the room. Can be intellectually arrogant, superficially brilliant, and unable to commit to one path. The vital force is dispersed across too many interests.', hi: 'बुध की वायु राशि में सूर्य — बल नहीं संवाद से शासन करने वाला राजा। ज्ञान, वाक्पटुता और दृष्टि व्यक्त करने की क्षमता से अधिकार। लोक वक्तृत्व, नीति निरूपण और बौद्धिक नेतृत्व में उत्कृष्ट। पिता शिक्षित, संवादी या मीडिया/प्रकाशन से सम्बद्ध। शिक्षा, मीडिया या कूटनीति में शासकीय भूमिका।' },
  },
  {
    planet: { en: 'Moon (Chandra)', hi: 'चन्द्रमा' },
    dignity: 'Enemy\'s sign',
    effect: { en: 'The Moon in Mercury\'s sign produces a mind that processes emotions through analysis and verbalization. The native talks about feelings rather than simply feeling them — therapy, journaling, and conversation are emotional processing tools. Mood changes are frequent and rapid — the Gemini Moon is famously mercurial. The mother may be youthful, communicative, and intellectually curious. Emotional needs center on mental stimulation, social connection, and variety. Boredom is the greatest enemy of emotional wellbeing. Excellent for writers, journalists, comedians, and therapists. Can be emotionally superficial, using cleverness to avoid deeper feelings.', hi: 'बुध की राशि में चन्द्रमा — विश्लेषण और शब्दों से भावनाओं को प्रसंस्कृत करने वाला मन। जातक भावनाओं के बारे में बात करता है बजाय केवल अनुभव करने के। मनोदशा बार-बार और तेज़ी से बदलती — मिथुन चन्द्र प्रसिद्ध रूप से अस्थिर। माता युवा, संवादी और बौद्धिक रूप से जिज्ञासु। लेखक, पत्रकार, हास्यकार के लिए उत्कृष्ट।' },
  },
  {
    planet: { en: 'Mars (Mangal)', hi: 'मंगल' },
    dignity: 'Enemy\'s sign',
    effect: { en: 'Mars in Mercury\'s sign — the sword meets the pen. Aggressive communication, sharp debating skills, and a mind that attacks problems analytically rather than physically. The native is a formidable arguer who weaponizes words. Excellent for law, investigative journalism, technical writing, competitive academics, and surgical precision in communication. Physical energy is scattered across many projects simultaneously. Sibling relationships may be competitive or combative. Can be sarcastic, argumentative, and mentally restless. The hands are extraordinarily skilled — good for surgery, mechanical work, and precision crafts that require both Mars force and Mercury dexterity.', hi: 'बुध की राशि में मंगल — तलवार और कलम का मिलन। आक्रामक संवाद, तीक्ष्ण वाद-विवाद कौशल। शब्दों को हथियार बनाने वाला। विधि, खोजी पत्रकारिता, तकनीकी लेखन और प्रतिस्पर्धी शिक्षा के लिए उत्कृष्ट। भाई-बहन सम्बन्ध प्रतिस्पर्धी। हाथ असाधारण कुशल — शल्य चिकित्सा और सूक्ष्म शिल्प के लिए।' },
  },
  {
    planet: { en: 'Mercury (Budha)', hi: 'बुध' },
    dignity: 'Own sign',
    effect: { en: 'Mercury in its own sign is the communicator par excellence — the messenger god delivering messages at the speed of thought. Information processing is lightning-fast: the native reads quickly, speaks fluently, learns new languages easily, and makes connections between seemingly unrelated ideas. This is the placement of polyglots, polymath hobbyists, journalists, traders, and comedians. The mind never rests — even in sleep it processes, sorts, and reorganizes. Multiple simultaneous interests are managed with apparent effortlessness. Can be superficial, unable to commit to depth, and prone to treating life as an intellectual game rather than an emotional experience. The native may know everything but feel nothing.', hi: 'बुध स्वराशि में श्रेष्ठ संवादक — विचार की गति से सन्देश पहुँचाने वाला दूत देव। सूचना प्रसंस्करण बिजली-तीव्र: तेज़ पढ़ना, धाराप्रवाह बोलना, सरलता से भाषाएँ सीखना। बहुभाषी, बहुआयामी शौकीन, पत्रकार, व्यापारी और हास्यकार। मन कभी विश्राम नहीं करता। सतही हो सकता है — सब कुछ जाने किन्तु कुछ अनुभव न करे।' },
  },
  {
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु (बृहस्पति)' },
    dignity: 'Detriment (enemy\'s sign)',
    effect: { en: 'Jupiter in Mercury\'s sign — the guru who teaches through words rather than silence, through information rather than contemplation. Knowledge is broad but may lack the depth that Jupiter craves. The native collects qualifications, reads voraciously, and teaches enthusiastically but may struggle with the silence and stillness that true wisdom requires. Excellent for academic publishing, encyclopedia writing, educational technology, and media-based teaching. Children may be intellectually gifted but physically restless. Can produce spiritual materialism — collecting spiritual knowledge like stamps rather than living it. When balanced, creates brilliant communicators of profound truth.', hi: 'बुध की राशि में गुरु — मौन नहीं शब्दों से, चिन्तन नहीं सूचना से शिक्षा देने वाला गुरु। ज्ञान विस्तृत किन्तु गहनता की कमी। उपाधियाँ संग्रह, उत्साहपूर्वक पढ़ना और शिक्षण। शैक्षिक प्रकाशन, विश्वकोश लेखन, शैक्षिक प्रौद्योगिकी के लिए उत्कृष्ट। आध्यात्मिक भौतिकवाद — ज्ञान संग्रह बिना जीवन में उतारे।' },
  },
  {
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र' },
    dignity: 'Neutral',
    effect: { en: 'Venus in Mercury\'s sign — beauty expressed through words, wit, and intellectual charm. The native seduces through conversation, writes love poetry, and finds beauty in ideas and language. Relationships begin through intellectual connection — shared books, debates that become flirtation, and minds that dance before bodies do. Excellent for fashion writing, art criticism, literary fiction, lyrical songwriting, and any creative field that combines aesthetic sensitivity with verbal skill. Can be flirtatious, emotionally superficial in romance, and more interested in the idea of love than its messy reality. Two or more relationships may run simultaneously.', hi: 'बुध की राशि में शुक्र — शब्दों, बुद्धि और बौद्धिक आकर्षण से व्यक्त सौन्दर्य। वार्ता से मोहित, प्रेम कविता, विचारों और भाषा में सौन्दर्य। बौद्धिक सम्बन्ध से शुरुआत — साझा पुस्तकें, वाद-विवाद से प्रणय। फ़ैशन लेखन, कला समीक्षा, साहित्यिक कथा, गीत लेखन के लिए उत्कृष्ट। प्रणय में सतही सम्भव।' },
  },
  {
    planet: { en: 'Saturn (Shani)', hi: 'शनि' },
    dignity: 'Neutral',
    effect: { en: 'Saturn in Mercury\'s sign — disciplined, structured thinking that organizes information systematically. The native thinks slowly but thoroughly, writes precisely, and communicates with careful deliberation. Excellent for technical documentation, legal drafting, academic research that requires years of patient investigation, and archival work. The mind is serious, sometimes pessimistic, and inclined toward dark or melancholic subjects. Siblings may be older in spirit, burdened, or estranged. Hands may develop arthritis or repetitive strain. Can produce writers who labor over every sentence but produce works of lasting precision. Fear of being misunderstood can create social anxiety.', hi: 'बुध की राशि में शनि — सूचना को व्यवस्थित रूप से संगठित करने वाली अनुशासित, संरचित सोच। जातक धीरे किन्तु गहनता से विचार, सटीक लेखन। तकनीकी प्रलेखन, विधिक प्रारूपण, शैक्षिक शोध के लिए उत्कृष्ट। मन गम्भीर, कभी-कभी निराशावादी। लेखक जो प्रत्येक वाक्य पर श्रम करें किन्तु स्थायी सटीकता के ग्रन्थ रचें।' },
  },
  {
    planet: { en: 'Rahu', hi: 'राहु' },
    dignity: 'Exalted (per some schools)',
    effect: { en: 'Rahu in Gemini amplifies Mercury\'s communicative intelligence to obsessive, boundary-breaking levels. The native is driven to master information systems, decode hidden patterns, and communicate in ways that disrupt conventional understanding. In the modern era, this produces hackers, viral content creators, media manipulators, technology entrepreneurs, and AI researchers who push the boundaries of machine intelligence. The shadow planet in the sign of communication can create compulsive talking, information addiction, and the weaponization of knowledge. When elevated, produces geniuses who revolutionize how humanity communicates — printing press inventors, internet pioneers, social media visionaries.', hi: 'मिथुन में राहु बुध की संवादी बुद्धि को जुनूनी, सीमा-तोड़ स्तर तक बढ़ाता है। सूचना प्रणालियों में निपुणता, छिपे प्रतिरूपों को डिकोड करने की प्रेरणा। आधुनिक युग में हैकर, वायरल सामग्री निर्माता, प्रौद्योगिकी उद्यमी, AI शोधकर्ता। ज्ञान का हथियारीकरण सम्भव। उन्नत होने पर मानवता के संवाद में क्रान्ति लाने वाली प्रतिभा।' },
  },
  {
    planet: { en: 'Ketu', hi: 'केतु' },
    dignity: 'Debilitated (per some schools)',
    effect: { en: 'Ketu in Gemini indicates past-life mastery of communication, intellect, and verbal skill — the soul has already been the writer, the speaker, the teacher. In this life, the native may feel strangely disinterested in intellectual pursuits despite evident talent. Words feel inadequate; conversation seems shallow; books fail to satisfy. The growth direction (Rahu in Sagittarius) pulls toward direct experience of truth rather than reading about it — pilgrimage over philosophy, meditation over debate. Can produce absent-minded professors, people who speak in riddles, or spiritual seekers who have abandoned the mind\'s games entirely. When integrated, creates wisdom teachers who communicate truth beyond words.', hi: 'मिथुन में केतु पूर्वजन्म में संवाद, बुद्धि और वाक् कौशल में निपुणता — आत्मा पहले ही लेखक, वक्ता, शिक्षक रह चुकी। बौद्धिक प्रयासों में विचित्र उदासीनता प्रतिभा के बावजूद। शब्द अपर्याप्त; वार्ता सतही। विकास दिशा (धनु में राहु) — पढ़ने के बजाय सत्य का प्रत्यक्ष अनुभव। एकीकृत होने पर शब्दों से परे सत्य संवाद करने वाले ज्ञान शिक्षक।' },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY = {
  appearance: { en: 'Classical texts describe Mithuna natives as having a tall, lean frame with long limbs and expressive hands that gesture constantly during speech. The face is typically oval or elongated with bright, darting eyes that miss nothing. Features are often youthful well into middle age — they age slowly and maintain a boyish or girlish charm. The complexion may have a greenish or fair undertone. Movement is quick and light — they walk with a spring in their step and change direction easily. The overall impression is of restless intelligence: a mind visible through the body.', hi: 'शास्त्रीय ग्रन्थ मिथुन जातकों को लम्बी, दुबली काया — लम्बे अंग और बोलते समय निरन्तर संकेत करने वाले अभिव्यंजक हाथ। चेहरा अण्डाकार या लम्बा — चमकदार, तीव्र नेत्र जो कुछ नहीं चूकते। रूप प्रायः मध्य आयु तक युवा। वर्ण हरित या गोरा। चाल तीव्र और हलकी — अस्थिर बुद्धि का समग्र प्रभाव।' },
  strengths: { en: 'Intellectual versatility, communication skills, quick learning, adaptability, wit and humor, networking ability, language talent, journalistic instinct, teaching aptitude, ability to see both sides of every argument, youthful energy, curiosity that never dies, and the rare gift of making complex ideas accessible to anyone.', hi: 'बौद्धिक बहुमुखी प्रतिभा, संवाद कौशल, शीघ्र सीखना, अनुकूलनशीलता, बुद्धि और हास्य, नेटवर्किंग, भाषा प्रतिभा, पत्रकारिता सहज प्रवृत्ति, शिक्षण योग्यता, प्रत्येक तर्क के दोनों पक्ष देखने की क्षमता, युवा ऊर्जा, अमर जिज्ञासा।' },
  weaknesses: { en: 'Superficiality, inability to commit to one path, nervous anxiety, gossip tendency, inconsistency, emotional detachment masking as rationality, restlessness, tendency to lie or exaggerate for effect, scattered energy, difficulty with silence and solitude, using humor to deflect serious issues, and treating relationships as intellectual experiments rather than emotional commitments.', hi: 'सतहीपन, एक मार्ग पर प्रतिबद्धता की अक्षमता, तन्त्रिका चिन्ता, गपशप प्रवृत्ति, असंगति, तर्कसंगतता के मुखौटे में भावनात्मक वैराग्य, अस्थिरता, प्रभाव के लिए मिथ्या या अतिशयोक्ति, बिखरी ऊर्जा, मौन और एकान्त में कठिनाई।' },
  temperament: { en: 'Vata-dominant (air-ether). Light, quick, changeable, and prone to anxiety when imbalanced. The mind moves faster than the body can follow — Gemini natives often feel they are living in multiple realities simultaneously. They need constant mental stimulation: conversation, reading, puzzles, debates, and new environments. Routine deadens them; variety revives them. The remedy for Vata imbalance is grounding: warm food, regular sleep, physical exercise (especially yoga), and committed relationships that provide emotional anchor. Without grounding, the Gemini native becomes a leaf in the wind — brilliant but directionless.', hi: 'वात प्रधान (वायु-आकाश)। हलका, तीव्र, परिवर्तनशील, असन्तुलन में चिन्ता-प्रवण। मन शरीर से तेज़ — मिथुन जातक प्रायः एक साथ अनेक वास्तविकताओं में जीने का अनुभव। निरन्तर मानसिक उत्तेजना: वार्ता, पठन, पहेली, वाद-विवाद। दिनचर्या मारती है; विविधता पुनर्जीवित। भूमिकारक उपचार: गरम भोजन, नियमित निद्रा, योग, प्रतिबद्ध सम्बन्ध।' },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER = {
  suited: { en: 'Journalism, writing, and publishing, media and broadcasting, teaching and education, translation and interpretation, marketing and advertising, public relations, information technology, telecommunications, trading and brokerage, travel and tourism, comedy and entertainment, diplomatic service, library and information science, linguistics and philology, social media management, and podcasting.', hi: 'पत्रकारिता, लेखन और प्रकाशन, मीडिया और प्रसारण, शिक्षण और शिक्षा, अनुवाद और दुभाषिया, विपणन और विज्ञापन, जनसम्पर्क, सूचना प्रौद्योगिकी, दूरसंचार, व्यापार और दलाली, यात्रा और पर्यटन, हास्य और मनोरंजन, कूटनीतिक सेवा, भाषाविज्ञान, सोशल मीडिया।' },
  workStyle: { en: 'Mithuna natives need variety, social interaction, and intellectual challenge in their work. They excel in open, collaborative environments where ideas flow freely and roles are flexible. They hate being confined to one task — the ideal Gemini job involves multiple responsibilities, frequent communication, and constantly learning new things. They are brilliant at brainstorming and presentation but may struggle with follow-through on long-term projects. Paired with a detail-oriented partner (Virgo energy), they become unstoppable: they generate the ideas, the partner executes them. Remote work suits them if it involves diverse collaboration; isolation without conversation is torture.', hi: 'मिथुन जातकों को कार्य में विविधता, सामाजिक सम्पर्क और बौद्धिक चुनौती चाहिए। खुले, सहयोगात्मक वातावरण में उत्कृष्ट। एक कार्य तक सीमित रहना असहनीय — आदर्श मिथुन कार्य अनेक उत्तरदायित्व, बारम्बार संवाद। विचार-मन्थन और प्रस्तुति में प्रतिभाशाली किन्तु दीर्घकालिक अनुवर्तन में कठिनाई।' },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: [
    { sign: { en: 'Libra (Tula)', hi: 'तुला' }, reason: { en: 'Air-air trine harmony — shared love of communication, aesthetics, and social engagement. Libra\'s diplomatic grace complements Gemini\'s quick wit. Venus-Mercury friendship ensures creative and intellectual compatibility. Both signs avoid emotional heaviness, preferring lightness and elegance. The relationship is conversational, culturally rich, and socially active. Can lack emotional depth if neither pushes past the surface.', hi: 'वायु-वायु त्रिकोण — संवाद, सौन्दर्य और सामाजिक सहभागिता का साझा प्रेम। तुला की कूटनीतिक शालीनता मिथुन की तीव्र बुद्धि की पूरक। शुक्र-बुध मैत्री। सम्बन्ध वार्तालापी, सांस्कृतिक रूप से समृद्ध। दोनों सतह से परे न जाएँ तो भावनात्मक गहनता की कमी।' } },
    { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, reason: { en: 'Air trine with innovative edge — both signs value intellect, social networks, and progressive thinking. Aquarius gives Gemini\'s scattered ideas a social mission; Gemini gives Aquarius\'s abstract ideals practical communication strategies. Both value independence in relationships. Together they create intellectual movements, social media empires, and innovative organizations. Can be emotionally detached — both partners may need to consciously cultivate vulnerability.', hi: 'नवोन्मेषी वायु त्रिकोण — दोनों बुद्धि, सामाजिक नेटवर्क और प्रगतिशील विचार। कुम्भ मिथुन के बिखरे विचारों को सामाजिक मिशन; मिथुन कुम्भ के अमूर्त आदर्शों को व्यावहारिक संवाद। बौद्धिक आन्दोलन और नवोन्मेषी संगठन। भावनात्मक रूप से विलग — संवेदनशीलता का सचेत विकास आवश्यक।' } },
  ],
  challenging: [
    { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, reason: { en: 'Both ruled by Mercury but expressing opposite tendencies — Gemini scatters, Virgo focuses; Gemini generalizes, Virgo specializes. Square tension creates constant friction over standards: Virgo finds Gemini sloppy, Gemini finds Virgo rigid. Both overthink but in different directions. However, they share Mercury\'s intelligence and when they stop criticizing each other, they form the most intellectually productive partnership in the zodiac. They literally complete each other\'s Mercury.', hi: 'दोनों बुध शासित किन्तु विपरीत प्रवृत्तियाँ — मिथुन बिखेरता, कन्या केन्द्रित; मिथुन सामान्यीकरण, कन्या विशेषज्ञ। वर्ग तनाव मानकों पर। कन्या मिथुन को लापरवाह, मिथुन कन्या को कठोर मानता। आलोचना छोड़ने पर राशि चक्र की सबसे बौद्धिक रूप से उत्पादक साझेदारी।' } },
    { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, reason: { en: 'Mutable square — both are changeable but in incompatible ways. Gemini changes through the mind (new ideas, new conversations); Pisces changes through emotion (new feelings, new dreams). Gemini finds Pisces illogical and emotionally overwhelming; Pisces finds Gemini cold and superficial. Mercury-Jupiter tension between analysis and faith, between proof and trust. However, this pairing can produce extraordinary creative partnerships — Gemini provides the words, Pisces provides the feeling.', hi: 'द्विस्वभाव वर्ग — दोनों परिवर्तनशील किन्तु असंगत ढंग से। मिथुन मन से (नये विचार), मीन भावना से (नयी अनुभूतियाँ)। मिथुन मीन को अतार्किक, मीन मिथुन को शीतल और सतही। बुध-गुरु तनाव — विश्लेषण और आस्था। असाधारण सृजनात्मक साझेदारी सम्भव — मिथुन शब्द, मीन अनुभूति।' } },
  ],
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES = {
  deity: { en: 'Lord Vishnu and Goddess Saraswati are the primary deities for Mithuna natives. Vishnu as the preserver represents Mercury\'s connecting, maintaining function — the god who sustains the universe through cosmic intelligence. Saraswati, the goddess of knowledge, speech, music, and learning, is the perfect embodiment of Gemini\'s highest potential: wisdom expressed through beautiful communication.', hi: 'भगवान विष्णु और देवी सरस्वती मिथुन जातकों के प्रमुख देवता। विष्णु संरक्षक — बुध के जोड़ने, बनाये रखने का कार्य, ब्रह्माण्डीय बुद्धि से विश्व का पालन। सरस्वती ज्ञान, वाणी, संगीत और विद्या की देवी — मिथुन की सर्वोच्च सम्भावना: सुन्दर संवाद में व्यक्त ज्ञान।' },
  mantra: { en: 'The Mercury beej mantra "Om Braam Breem Braum Sah Budhaya Namah" should be chanted 4,000 times during Mercury hora on Wednesdays. For daily practice, chant 108 times. The Saraswati Vandana or Saraswati Stotra recited on Wednesdays enhances all Mercury-related abilities: speech, writing, learning, and analytical thinking.', hi: 'बुध बीज मन्त्र "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः" बुधवार को बुध होरा में 4,000 बार। दैनिक अभ्यास में 108 बार। सरस्वती वन्दना या सरस्वती स्तोत्र बुधवार को — सभी बुध-सम्बन्धित क्षमताएँ: वाणी, लेखन, विद्या, विश्लेषणात्मक चिन्तन।' },
  practices: { en: 'Wear emerald (Panna) on the little finger of the right hand in gold setting on a Wednesday during Mercury hora — only if prescribed by a qualified Jyotishi. Donate green moong dal, green vegetables, green cloth, or books on Wednesdays. Fasting on Wednesdays strengthens Mercury. Offer green flowers to Vishnu or Saraswati. Maintain a regular reading practice, learn a new language, or practice calligraphy — Mercury is strengthened by disciplined intellectual activity. Keep a journal to channel Mercury\'s verbal energy constructively.', hi: 'पन्ना दाहिने हाथ की कनिष्ठिका में स्वर्ण जड़ित बुधवार को बुध होरा में — केवल योग्य ज्योतिषी के निर्देश पर। बुधवार को हरी मूँग दाल, हरी सब्ज़ियाँ, हरा वस्त्र या पुस्तकें दान। बुधवार व्रत बुध सशक्त। विष्णु या सरस्वती को हरे पुष्प। नियमित पठन, नई भाषा सीखना, सुलेख अभ्यास।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: { en: 'The Twins of Mithuna carry profound symbolism across multiple traditions. In Vedic thought, the concept of Mithuna (coupling) represents the fundamental duality of creation: Purusha and Prakriti, consciousness and nature, the unmanifest and the manifest. Every act of creation requires this coupling — the mind (Purusha) must unite with matter (Prakriti) for anything to exist. The Ashwini Kumaras (divine twins) are sometimes associated with Gemini, representing the healing power that comes from uniting opposites. Mercury (Budha) was born from the union of Chandra (Moon) and Tara (Jupiter\'s wife), making him a child of transgression who bridges the gap between emotional and intellectual wisdom.', hi: 'मिथुन के जुड़वाँ अनेक परम्पराओं में गहन प्रतीकवाद। वैदिक विचार में मिथुन (युगल) सृष्टि की मूलभूत द्वैतता: पुरुष और प्रकृति, चेतना और प्रकृति। प्रत्येक सृजन कर्म इस युगल की माँग — मन (पुरुष) पदार्थ (प्रकृति) से मिले। बुध चन्द्र और तारा (गुरु पत्नी) के मिलन से जन्मा — भावनात्मक और बौद्धिक ज्ञान का सेतु।' },
  symbolism: { en: 'The Twins face each other — this is Gemini\'s essential nature. One twin looks outward (social communication), the other looks inward (self-reflection). The sign asks the eternal question: who am I, and who is the other? Every conversation is an attempt to answer this question, every relationship a mirror in which the self is explored. The dual nature of Gemini is not a flaw but a gift: the ability to hold two opposing truths simultaneously, to see both sides of every argument, and to translate between worlds that cannot otherwise communicate. The shadow side is fragmentation — when the two twins cannot agree, the native feels split apart, unable to commit to either identity.', hi: 'जुड़वाँ एक-दूसरे को देखते हैं — यह मिथुन का मूल स्वभाव। एक बाहर देखता है (सामाजिक संवाद), दूसरा भीतर (आत्मनिरीक्षण)। शाश्वत प्रश्न: मैं कौन हूँ, और दूसरा कौन? प्रत्येक वार्ता इस प्रश्न का उत्तर खोजने का प्रयास। मिथुन का द्वैत दोष नहीं वरदान: एक साथ दो विपरीत सत्य धारण, प्रत्येक तर्क के दोनों पक्ष देखना।' },
};

// ─── Cross Links ───────────────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/budha' as const, label: { en: 'Mercury (Budha) — Ruler of Mithuna', hi: 'बुध — मिथुन का स्वामी' } },
  { href: '/learn/vrishabha' as const, label: { en: 'Vrishabha (Taurus) — Previous Sign', hi: 'वृषभ — पिछली राशि' } },
  { href: '/learn/karka' as const, label: { en: 'Karka (Cancer) — Next Sign', hi: 'कर्क — अगली राशि' } },
  { href: '/learn/rashis' as const, label: { en: 'All 12 Rashis Overview', hi: 'सभी 12 राशियों का अवलोकन' } },
  { href: '/learn/nakshatras' as const, label: { en: 'Nakshatras — Lunar Mansions', hi: 'नक्षत्र — चन्द्र भवन' } },
  { href: '/learn/rahu' as const, label: { en: 'Rahu — Ardra\'s Nakshatra Lord', hi: 'राहु — आर्द्रा का नक्षत्र स्वामी' } },
  { href: '/learn/compatibility' as const, label: { en: 'Compatibility & Matching', hi: 'अनुकूलता और मिलान' } },
  { href: '/learn/planet-in-house' as const, label: { en: 'Planets in Houses', hi: 'भावों में ग्रह' } },
  { href: '/learn/remedies' as const, label: { en: 'Vedic Remedies Guide', hi: 'वैदिक उपाय मार्गदर्शिका' } },
  { href: '/learn/career' as const, label: { en: 'Career in Jyotish', hi: 'ज्योतिष में करियर' } },
];

// ═══════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════
export default function MithunaPage() {
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
        <div className="text-8xl mb-4">&#9802;</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-2" style={hf}>
          {ml({ en: 'Mithuna', hi: 'मिथुन' })}
        </h1>
        <p className="text-xl text-text-secondary mb-1" style={bf}>
          {ml({ en: 'Gemini — The Twins', hi: 'मिथुन — जुड़वाँ' })}
        </p>
        <p className="text-text-secondary/80 italic text-sm max-w-xl mx-auto mb-6" style={bf}>
          {ml({ en: 'The sign where thought becomes speech and speech becomes connection — Mithuna is the bridge between minds, the breath that carries meaning.', hi: 'राशि जहाँ विचार वाणी बनता और वाणी सम्बन्ध — मिथुन मनों के बीच का सेतु, अर्थ वहन करने वाली श्वास।' })}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {ml({ en: 'Air Element', hi: 'वायु तत्त्व' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {ml({ en: 'Mutable / Dwiswabhava', hi: 'द्विस्वभाव राशि' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {ml({ en: 'Ruler: Mercury', hi: 'स्वामी: बुध' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {ml({ en: '60° – 90°', hi: '60° – 90°' })}
          </span>
        </div>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {TERMS.map((t) => (
          <SanskritTermCard key={t.transliteration} term={ml(t.meaning)} transliteration={t.transliteration} meaning={ml(t.meaning)} devanagari={t.devanagari} />
        ))}
      </div>

      {/* ── 1. Overview & Characteristics ── */}
      <LessonSection number={next()} title={ml({ en: 'Overview & Characteristics', hi: 'अवलोकन एवं विशेषताएँ' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mithuna (Gemini) is the third sign of the sidereal zodiac, spanning 60° to 90°. After the fire of Aries and the earth of Taurus, Gemini introduces the element of air — thought, communication, and connection. Ruled by Mercury (Budha), the planet of intellect, speech, and commerce, Mithuna is the sign where consciousness becomes communicable. It is the bridge between the internal world of thought and the external world of social exchange. The symbol of the Twins reflects its fundamental duality: the ability to hold two perspectives simultaneously and to move between worlds.', hi: 'मिथुन सायन राशि चक्र की तृतीय राशि है, 60° से 90° तक। मेष की अग्नि और वृषभ की पृथ्वी के बाद मिथुन वायु तत्त्व प्रस्तुत करता है — विचार, संवाद और सम्बन्ध। बुध शासित — बुद्धि, वाणी और वाणिज्य का ग्रह। मिथुन वह राशि जहाँ चेतना संवाद योग्य बनती है — विचार के आन्तरिक जगत और सामाजिक आदान-प्रदान के बाह्य जगत का सेतु।' })}</p>
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

      {/* ── 3. Nakshatras ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Mithuna', hi: 'मिथुन के नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Three nakshatras span Mithuna. Mrigashira\'s later padas bring curious seeking, Ardra delivers transformative storms of insight, and Punarvasu\'s first three padas offer renewal and optimistic wisdom.', hi: 'तीन नक्षत्र मिथुन में। मृगशिरा के बाद के पाद जिज्ञासु खोज, आर्द्रा अन्तर्दृष्टि के रूपान्तरकारी तूफ़ान, पुनर्वसु के प्रथम तीन पाद नवीकरण और आशावादी ज्ञान।' })}</p>
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
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Mithuna', hi: 'मिथुन में ग्रहों की गरिमा' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mithuna\'s dignity landscape is dominated by Mercury\'s own-sign status. The exaltation and debilitation of Rahu/Ketu here is debated among classical authorities — some place them in Gemini, others in Taurus/Scorpio. No traditional planet has its exaltation or debilitation in Gemini.', hi: 'मिथुन की गरिमा में बुध का स्वराशि प्रमुख। राहु/केतु का उच्च-नीच यहाँ शास्त्रीय प्राधिकारियों में विवादित — कुछ मिथुन में, अन्य वृषभ/वृश्चिक में। कोई पारम्परिक ग्रह मिथुन में उच्च या नीच नहीं।' })}</p>

        <h4 className="text-emerald-400 font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Exalted Here (Debated)', hi: 'यहाँ उच्च (विवादित)' })}</h4>
        {PLANETARY_DIGNITIES.exalted.map((p) => (
          <div key={ml(p.planet)} className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{ml(p.degree)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}

        <h4 className="text-red-400 font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Debilitated Here (Debated)', hi: 'यहाँ नीच (विवादित)' })}</h4>
        {PLANETARY_DIGNITIES.debilitated.map((p) => (
          <div key={ml(p.planet)} className="bg-red-500/5 border border-red-500/15 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">{ml(p.degree)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}

        <h4 className="text-gold-primary font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Own Sign', hi: 'स्वराशि' })}</h4>
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

      {/* ── 5. Each Planet in Mithuna ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Mithuna', hi: 'मिथुन में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'How each of the nine Vedic planets behaves when placed in Mithuna. Mercury\'s airy, intellectual energy colors every planet with curiosity, verbal expression, and mental restlessness.', hi: 'मिथुन में स्थित प्रत्येक नवग्रह का व्यवहार। बुध की वायुमय, बौद्धिक ऊर्जा प्रत्येक ग्रह को जिज्ञासा, शाब्दिक अभिव्यक्ति और मानसिक अस्थिरता से रंगती है।' })}</p>
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

      {/* ── 6. Career ── */}
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
          {ml({ en: 'A Mithuna native in a silent, solitary job with no human interaction — such as solo data entry or isolated research with no collaboration — will become depressed and mentally stagnant. They need to talk, teach, write, and connect. Their genius emerges in conversation, not in isolation.', hi: 'बिना मानवीय सम्पर्क वाले मूक, एकान्त कार्य में मिथुन जातक — जैसे अकेला डेटा प्रविष्टि — अवसादग्रस्त और मानसिक रूप से स्थिर। उन्हें बात करना, सिखाना, लिखना और जुड़ना चाहिए। प्रतिभा वार्ता में प्रकट, एकान्त में नहीं।' })}
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
              ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः
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
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Sacred Twins', hi: 'पवित्र जुड़वाँ' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Symbolism', hi: 'प्रतीकवाद' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.symbolism)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 10. Health & Body ── */}
      <LessonSection number={next()} title={ml({ en: 'Health & Body', hi: 'स्वास्थ्य एवं शरीर' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Mithuna governs the arms, shoulders, hands, lungs, bronchial tubes, and the nervous system. As an air sign ruled by Mercury, Gemini natives are especially vulnerable to respiratory conditions — asthma, bronchitis, allergies — and disorders of the nervous system including anxiety, insomnia, and restless mind syndrome. The hands and arms are prone to repetitive strain injuries, carpal tunnel, and shoulder tension from mental overwork. When Mercury is strong, the native enjoys quick reflexes, nimble fingers, excellent hand-eye coordination, and a youthful appearance well into middle age. A weak or afflicted Mercury manifests as speech disorders, chronic cough, nervous exhaustion, and skin conditions like eczema on the hands and arms. Ayurvedically, Mithuna is predominantly Vata — the air constitution that gives quickness of mind but also tendency toward dryness, irregular digestion, and nervous depletion. Dietary recommendations emphasize warm, grounding, oily foods: ghee-based preparations, root vegetables, warm soups, and regular meal timing to counter Vata\'s natural irregularity. Raw, cold, and dry foods aggravate the constitution. Exercise should engage both body and mind — racquet sports, dance, martial arts, and pranayama are ideal. Mental health requires deliberate rest periods — Gemini\'s mind never stops unless consciously trained through meditation, yoga nidra, or nature walks without screens.', hi: 'मिथुन भुजाओं, कन्धों, हाथों, फेफड़ों, श्वासनली और तन्त्रिका तन्त्र का शासक है। बुध शासित वायु राशि होने से मिथुन जातक श्वसन रोगों — दमा, ब्रोंकाइटिस, एलर्जी — और तन्त्रिका तन्त्र विकारों जैसे चिन्ता, अनिद्रा और बेचैन मन से विशेष संवेदनशील हैं। हाथ और भुजाएँ दोहराव तनाव चोट, कार्पल टनल और मानसिक अतिकार्य से कन्धे तनाव के प्रति प्रवण। बली बुध में त्वरित प्रतिक्रिया, फुर्तीली उँगलियाँ, उत्कृष्ट समन्वय और युवा दिखावट। दुर्बल बुध वाक् विकार, पुरानी खाँसी, स्नायविक थकान और हाथों पर एक्ज़िमा दे सकता है। आयुर्वेदिक रूप से मिथुन प्रधानतः वात प्रकृति — वायु संविधान जो मानसिक तीव्रता देता है किन्तु शुष्कता, अनियमित पाचन और स्नायविक क्षय की प्रवृत्ति भी। आहार में ऊष्ण, भूमिकारक, स्निग्ध पदार्थ — घी, कन्दमूल, गरम सूप और नियमित भोजन समय अनुशंसित। कच्चे, शीतल और शुष्क पदार्थ वात बढ़ाते हैं। व्यायाम शरीर और मन दोनों को संलग्न करे — रैकेट खेल, नृत्य, मार्शल आर्ट्स और प्राणायाम। मानसिक स्वास्थ्य हेतु जानबूझकर विश्राम — ध्यान, योग निद्रा या प्रकृति भ्रमण।' })}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Vulnerable Areas', hi: 'संवेदनशील अंग' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Arms, shoulders, hands, lungs, bronchial tubes, nervous system, skin (hands/arms)', hi: 'भुजाएँ, कन्धे, हाथ, फेफड़े, श्वासनली, तन्त्रिका तन्त्र, त्वचा (हाथ/भुजाएँ)' })}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Ayurvedic Constitution', hi: 'आयुर्वेदिक प्रकृति' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Vata dominant. Favour warm, oily, grounding foods. Avoid raw, cold, dry foods. Regular meal timing and deliberate rest essential to prevent nervous exhaustion.', hi: 'वात प्रधान। ऊष्ण, स्निग्ध, भूमिकारक आहार अनुकूल। कच्चे, शीतल, शुष्क पदार्थ वर्जित। स्नायविक थकान रोकने हेतु नियमित भोजन समय और जानबूझकर विश्राम अनिवार्य।' })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 11. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Understanding Mithuna in chart interpretation means recognizing where Mercury\'s airy, communicative, dual-natured energy operates in the native\'s life. The sign\'s placement reveals where adaptability is a strength and where inconsistency becomes a weakness.', hi: 'कुण्डली व्याख्या में मिथुन को समझने का अर्थ है पहचानना कि बुध की वायव, संवादी, द्विस्वभावी ऊर्जा जातक के जीवन में कहाँ कार्य करती है। राशि का स्थान बताता है कि अनुकूलनशीलता कहाँ शक्ति है और असंगति कहाँ दुर्बलता।' })}</p>
        <div className="space-y-3">
          {[
            { title: { en: 'If Mithuna is your Lagna', hi: 'यदि मिथुन आपका लग्न है' }, content: { en: 'Mercury becomes your lagna lord, making communication, learning, and intellectual networking the axis of your identity. Mrigashira lagna (Mars nakshatra in Mercury\'s sign) creates a curious, research-oriented personality with restless seeking. Ardra lagna (Rahu nakshatra) produces intense, transformative thinkers who experience storms before breakthroughs. Punarvasu lagna (Jupiter nakshatra) brings a teaching-oriented, optimistic personality that bounces back from setbacks. Mercury as lagna lord must be assessed carefully — retrograde Mercury paradoxically strengthens inner intellectual life while complicating external communication.', hi: 'बुध लग्नेश बनता है — संवाद, अध्ययन और बौद्धिक नेटवर्किंग पहचान का अक्ष। मृगशिरा लग्न (मंगल नक्षत्र) जिज्ञासु, शोध-उन्मुख व्यक्तित्व। आर्द्रा लग्न (राहु नक्षत्र) तीव्र, रूपान्तरकारी विचारक। पुनर्वसु लग्न (गुरु नक्षत्र) शिक्षण-उन्मुख, आशावादी व्यक्तित्व। वक्री बुध विरोधाभासी रूप से आन्तरिक बौद्धिक जीवन मजबूत करता है जबकि बाह्य संवाद जटिल।' } },
            { title: { en: 'If Mithuna is your Moon sign', hi: 'यदि मिथुन आपकी चन्द्र राशि है' }, content: { en: 'The mind is quicksilver — fast, curious, multi-tracking, and perpetually hungry for new information. Emotions are processed intellectually rather than viscerally. This placement creates excellent writers, journalists, and communicators but can make emotional depth difficult. The native may talk about feelings rather than feel them. Ardra Moon produces emotionally intense experiences that the mind struggles to contain — tears of rage and joy alike. Punarvasu Moon creates emotional resilience — the ability to find meaning and hope even in difficult circumstances.', hi: 'मन पारे जैसा — तीव्र, जिज्ञासु, बहु-ट्रैकिंग और सदा नई जानकारी का भूखा। भावनाएँ बौद्धिक रूप से संसाधित होती हैं। उत्कृष्ट लेखक, पत्रकार और संवादक बनाता है किन्तु भावनात्मक गहराई कठिन। आर्द्रा चन्द्र तीव्र भावनात्मक अनुभव — क्रोध और आनन्द दोनों के आँसू। पुनर्वसु चन्द्र भावनात्मक लचीलापन — कठिन परिस्थितियों में भी अर्थ और आशा।' } },
            { title: { en: 'Mithuna in divisional charts', hi: 'विभागीय कुण्डलियों में मिथुन' }, content: { en: 'In Navamsha (D9), Mithuna indicates a spouse who is communicative, intellectual, possibly younger in spirit, and connected to media, teaching, or commerce. In Dashamsha (D10), it suggests careers in journalism, IT, telecommunications, marketing, education, or any field requiring verbal dexterity and information processing.', hi: 'नवांश (D9) में मिथुन जीवनसाथी को इंगित करता है जो संवादी, बुद्धिमान, सम्भवतः मानसिक रूप से युवा और मीडिया, शिक्षण या वाणिज्य से जुड़ा। दशमांश (D10) में पत्रकारिता, IT, दूरसंचार, विपणन, शिक्षा या मौखिक कुशलता और सूचना प्रसंस्करण वाले किसी क्षेत्र में करियर।' } },
            { title: { en: 'Common misconceptions', hi: 'सामान्य भ्रान्तियाँ' }, content: { en: 'Misconception: Gemini is superficial. Reality: Gemini processes breadth before depth — they survey the landscape before choosing where to dig. Misconception: Gemini is two-faced. Reality: Gemini sees multiple valid perspectives simultaneously — this is not dishonesty but genuine cognitive complexity. Misconception: Gemini cannot commit. Reality: Gemini commits fully once intellectually convinced — but demands ongoing mental stimulation within commitment. Misconception: Gemini is all talk. Reality: Mercury rules commerce and craft — Gemini natives are skilled with their hands and can translate ideas into tangible products.', hi: 'भ्रान्ति: मिथुन सतही है। सत्य: मिथुन गहराई से पहले विस्तार संसाधित करता है। भ्रान्ति: मिथुन दोमुँहा है। सत्य: मिथुन एक साथ अनेक वैध दृष्टिकोण देखता है — यह बेईमानी नहीं वास्तविक संज्ञानात्मक जटिलता है। भ्रान्ति: मिथुन प्रतिबद्ध नहीं हो सकता। सत्य: बौद्धिक रूप से आश्वस्त होने पर पूर्ण प्रतिबद्धता। भ्रान्ति: मिथुन केवल बात। सत्य: बुध वाणिज्य और शिल्प का शासक — मिथुन जातक हाथों से कुशल और विचारों को मूर्त उत्पादों में बदल सकते हैं।' } },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml(item.title)}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(item.content)}</p>
            </div>
          ))}
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Reading Mithuna in a chart reveals where the native\'s curiosity, adaptability, and communicative intelligence express most naturally. The house where Gemini falls is where you gather information, make connections, and need intellectual freedom — but also where scattered energy must be deliberately focused to produce lasting results.', hi: 'कुण्डली में मिथुन पढ़ना बताता है कि जातक की जिज्ञासा, अनुकूलनशीलता और संवादी बुद्धि कहाँ सबसे स्वाभाविक रूप से अभिव्यक्त होती है। जिस भाव में मिथुन पड़ता है वहाँ आप जानकारी एकत्र करते हैं, सम्बन्ध बनाते हैं और बौद्धिक स्वतन्त्रता चाहते हैं — किन्तु बिखरी ऊर्जा को जानबूझकर केन्द्रित करना आवश्यक।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 12. Mithuna as House Cusp ── */}
      <LessonSection number={next()} title={ml({ en: 'Mithuna as House Cusp', hi: 'भाव शिखर के रूप में मिथुन' })}>
        <p style={bf} className="mb-3">{ml({ en: 'When Mithuna falls on different house cusps, it brings Mercury\'s airy, intellectual, and communicative energy to that life area. Here is how Gemini colours each house:', hi: 'जब मिथुन विभिन्न भाव शिखरों पर पड़ता है, तो वह उस जीवन क्षेत्र में बुध की वायव, बौद्धिक और संवादी ऊर्जा लाता है। यहाँ मिथुन प्रत्येक भाव को कैसे रंगता है:' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { house: '1st', effect: { en: 'Mercury-ruled personality — quick-witted, communicative, youthful appearance. Dual nature may create internal contradictions. Natural networker and information gatherer.', hi: 'बुध शासित व्यक्तित्व — तीव्रबुद्धि, संवादी, युवा दिखावट। द्वैत प्रकृति आन्तरिक विरोधाभास। स्वाभाविक नेटवर्कर और सूचना संग्राहक।' } },
            { house: '2nd', effect: { en: 'Wealth through communication, writing, or trade. Multiple income sources. Persuasive speech. Family values centered on education and intellectual development.', hi: 'संवाद, लेखन या व्यापार से धन। अनेक आय स्रोत। प्रेरक वाणी। शिक्षा और बौद्धिक विकास केन्द्रित पारिवारिक मूल्य।' } },
            { house: '3rd', effect: { en: 'Gemini in its natural house — exceptional communication skills. Strong sibling bonds. Love of short travel and learning. Writing, blogging, and media talent amplified.', hi: 'मिथुन अपने स्वाभाविक भाव में — असाधारण संवाद कौशल। मजबूत भाई-बहन बन्धन। लघु यात्रा और अध्ययन प्रेम। लेखन, ब्लॉगिंग और मीडिया प्रतिभा।' } },
            { house: '4th', effect: { en: 'Intellectually stimulating home environment. Many books and learning materials at home. May change residences frequently. Mother is communicative and educated.', hi: 'बौद्धिक रूप से उत्तेजक गृह वातावरण। घर में अनेक पुस्तकें। बार-बार निवास परिवर्तन सम्भव। माता संवादी और शिक्षित।' } },
            { house: '5th', effect: { en: 'Creative intelligence in writing, drama, and word-play. Romance through intellectual connection. Children may be communicative and curious. Success in media and education ventures.', hi: 'लेखन, नाटक और शब्द-क्रीड़ा में सृजनात्मक बुद्धि। बौद्धिक सम्बन्ध से प्रेम। सन्तान संवादी और जिज्ञासु। मीडिया और शिक्षा उद्यमों में सफलता।' } },
            { house: '6th', effect: { en: 'Health issues related to lungs, arms, and nervous system. Service in communication or information fields. Defeats enemies through wit and persuasion rather than force.', hi: 'फेफड़े, भुजाओं और तन्त्रिका तन्त्र सम्बन्धी स्वास्थ्य। संवाद या सूचना क्षेत्रों में सेवा। बुद्धि और प्रेरणा से शत्रुओं को पराजित।' } },
            { house: '7th', effect: { en: 'Spouse is intellectual, communicative, possibly younger. Business partnerships in media, trade, or education. Marriage requires constant mental stimulation to thrive.', hi: 'जीवनसाथी बुद्धिमान, संवादी, सम्भवतः मानसिक रूप से युवा। मीडिया, व्यापार या शिक्षा में व्यावसायिक साझेदारी। विवाह में निरन्तर मानसिक उत्तेजना आवश्यक।' } },
            { house: '8th', effect: { en: 'Research into hidden knowledge and occult sciences. Gains through spouse\'s communication skills. Transformation through information and learning. Interest in psychology and investigative work.', hi: 'गूढ़ ज्ञान और गुप्त विज्ञानों में शोध। जीवनसाथी के संवाद कौशल से लाभ। सूचना और अध्ययन से रूपान्तरण। मनोविज्ञान और अन्वेषण में रुचि।' } },
            { house: '9th', effect: { en: 'Fortune through teaching, publishing, and intellectual pursuits. Father is learned and communicative. Dharma expressed through sharing knowledge. Multiple short pilgrimages over single long journeys.', hi: 'शिक्षण, प्रकाशन और बौद्धिक साधनाओं से भाग्य। पिता विद्वान और संवादी। ज्ञान बाँटकर धर्म अभिव्यक्ति। एक लम्बी यात्रा के बजाय अनेक लघु तीर्थयात्राएँ।' } },
            { house: '10th', effect: { en: 'Career in media, journalism, IT, teaching, marketing, or trade. Professional versatility — may have multiple career paths simultaneously. Public speaking and writing define professional identity.', hi: 'मीडिया, पत्रकारिता, IT, शिक्षण, विपणन या व्यापार में करियर। व्यावसायिक बहुमुखता — एक साथ अनेक करियर पथ। सार्वजनिक भाषण और लेखन व्यावसायिक पहचान।' } },
            { house: '11th', effect: { en: 'Gains through networking, social media, and intellectual communities. Friends are communicative and diverse. Aspirations involve spreading ideas and building information platforms.', hi: 'नेटवर्किंग, सोशल मीडिया और बौद्धिक समुदायों से लाभ। मित्र संवादी और विविध। विचार फैलाने और सूचना मंच बनाने की आकांक्षाएँ।' } },
            { house: '12th', effect: { en: 'Expenditure on books, travel, and education. Foreign connections through communication. Meditation and spiritual practice through mantra and scriptural study. Active dream life and subconscious processing.', hi: 'पुस्तकों, यात्रा और शिक्षा पर व्यय। संवाद से विदेशी सम्बन्ध। मन्त्र और शास्त्र अध्ययन से ध्यान और आध्यात्मिक साधना। सक्रिय स्वप्न जीवन।' } },
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
        ml({ en: 'Mithuna (Gemini) is the third sign — ruled by Mercury, element air, mutable modality. It represents communication, intellectual curiosity, and the power of connecting minds.', hi: 'मिथुन तृतीय राशि — बुध शासित, वायु तत्त्व, द्विस्वभाव। संवाद, बौद्धिक जिज्ञासा और मनों को जोड़ने की शक्ति।' }),
        ml({ en: 'Mercury owns the sign. Rahu may be exalted here and Ketu debilitated (debated among authorities). No classical planet has standard exaltation/debilitation in Gemini.', hi: 'बुध स्वामी। राहु यहाँ उच्च और केतु नीच हो सकता है (विवादित)। कोई शास्त्रीय ग्रह मिथुन में मानक उच्च/नीच नहीं।' }),
        ml({ en: 'Three nakshatras: Mrigashira padas 3-4 (60°-66°40\', Mars), Ardra (66°40\'-80°, Rahu), Punarvasu padas 1-3 (80°-90°, Jupiter).', hi: 'तीन नक्षत्र: मृगशिरा पाद 3-4 (60°-66°40\', मंगल), आर्द्रा (66°40\'-80°, राहु), पुनर्वसु पाद 1-3 (80°-90°, गुरु)।' }),
        ml({ en: 'Best compatibility with Libra and Aquarius (air trines). Career strength in journalism, teaching, IT, media, marketing, and all communication fields.', hi: 'तुला और कुम्भ से सर्वोत्तम अनुकूलता (वायु त्रिकोण)। पत्रकारिता, शिक्षण, IT, मीडिया, विपणन और सभी संवाद क्षेत्रों में करियर शक्ति।' }),
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
