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
  { devanagari: 'बुध', transliteration: 'Budha', meaning: { en: 'The awakened one — Mercury, planet of intellect', hi: 'बुध — जागृत, बुद्धि का ग्रह' } },
  { devanagari: 'वाक्कारक', transliteration: 'Vākkāraka', meaning: { en: 'Significator of speech and communication', hi: 'वाणी और संवाद का कारक' } },
  { devanagari: 'सौम्य', transliteration: 'Saumya', meaning: { en: 'The gentle one, son of Moon (Soma)', hi: 'सौम्य — चन्द्र (सोम) का पुत्र' } },
  { devanagari: 'कुमार', transliteration: 'Kumāra', meaning: { en: 'The prince, the youthful one', hi: 'राजकुमार, युवा' } },
  { devanagari: 'ज्ञानकारक', transliteration: 'Jñānakāraka', meaning: { en: 'Significator of knowledge and learning', hi: 'ज्ञान और विद्या का कारक' } },
  { devanagari: 'विद्याधिपति', transliteration: 'Vidyādhipati', meaning: { en: 'Lord of learning and scholarship', hi: 'विद्या और विद्वत्ता के स्वामी' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Virgo (Kanya) — deepest exaltation at 15°', hi: 'कन्या — 15° पर परम उच्च' },
  debilitation: { en: 'Pisces (Meena) — deepest debilitation at 15°', hi: 'मीन — 15° पर परम नीच' },
  ownSign: { en: 'Gemini (Mithuna) & Virgo (Kanya)', hi: 'मिथुन एवं कन्या' },
  moolatrikona: { en: 'Virgo 16°–20°', hi: 'कन्या 16°–20°' },
  friends: { en: 'Sun, Venus', hi: 'सूर्य, शुक्र' },
  enemies: { en: 'Moon', hi: 'चन्द्र' },
  neutral: { en: 'Mars, Jupiter, Saturn', hi: 'मंगल, गुरु, शनि' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Maternal uncle, prince, merchant, student, accountant, astrologer, scribe', hi: 'मामा, राजकुमार, व्यापारी, विद्यार्थी, लेखाकार, ज्योतिषी, लिपिक' },
  bodyParts: { en: 'Nervous system, skin, lungs, intestines, tongue, hands, vocal cords', hi: 'तन्त्रिका तन्त्र, त्वचा, फेफड़े, आँतें, जिह्वा, हाथ, स्वर तन्तु' },
  professions: { en: 'Writing, accounting, teaching, commerce, IT, astrology, translation, law, media', hi: 'लेखन, लेखा, शिक्षण, वाणिज्य, आईटी, ज्योतिष, अनुवाद, विधि, मीडिया' },
  materials: { en: 'Emerald (Panna), green cloth, moong dal, camphor, brass, books, turmeric', hi: 'पन्ना, हरा वस्त्र, मूँग दाल, कपूर, पीतल, पुस्तकें, हल्दी' },
  direction: { en: 'North (Uttara)', hi: 'उत्तर' },
  day: { en: 'Wednesday (Budhavara)', hi: 'बुधवार' },
  color: { en: 'Green / emerald', hi: 'हरा / पन्ना रंग' },
  season: { en: 'Sharad (Autumn)', hi: 'शरद ऋतु' },
  taste: { en: 'Mixed / all six tastes', hi: 'मिश्रित / षड्रस' },
  guna: { en: 'Rajas', hi: 'रजस्' },
  element: { en: 'Earth (Prithvi)', hi: 'पृथ्वी तत्त्व' },
  gender: { en: 'Neutral (Napumsaka — neither masculine nor feminine)', hi: 'नपुंसक लिंग (न पुरुष न स्त्री)' },
  nature: { en: 'Benefic when alone or with benefics, malefic with malefics (dual nature)', hi: 'शुभों के साथ शुभ, पापियों के साथ पापी (द्वैत स्वभाव)' },
};

// ─── Mercury in 12 Signs ──────────────────────────────────────────────
const MERCURY_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: 'Neutral',
    effect: { en: 'Mercury in Mars\'s fire sign — the mind thinks at the speed of impulse. Quick wit, sharp communication, and a debating style that attacks rather than analyzes. Excellent for competitive exams, sales, journalism under pressure, and military intelligence. The native speaks boldly and sometimes recklessly. Ideas come in bursts but may lack follow-through. Handwriting is fast and messy. Good for programming sprints, crisis communication, and any intellectual work requiring speed over depth. Can be verbally aggressive and mentally impatient.', hi: 'मंगल की अग्नि राशि में बुध — मन आवेग की गति से सोचता है। तीक्ष्ण बुद्धि, तीव्र संवाद और आक्रामक वाद-विवाद शैली। प्रतिस्पर्धी परीक्षा, बिक्री और दबाव में पत्रकारिता के लिए उत्कृष्ट। विचार तेजी से आते हैं किन्तु अनुसरण की कमी। मौखिक रूप से आक्रामक और मानसिक रूप से अधीर।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: 'Friend\'s sign',
    effect: { en: 'Mercury in Venus\'s earth sign — the mind thinks in terms of value, beauty, and practical outcomes. Slow but thorough analysis. The native has a pleasant, melodious speaking voice and a talent for music, poetry, and financial planning. Excellent for banking, art dealing, luxury marketing, and agricultural science. Memory is strong and reliable. Ideas are expressed with aesthetic grace. Can be mentally stubborn and resistant to new information that threatens existing valuations. Business acumen combines intellectual clarity with material instinct.', hi: 'शुक्र की पृथ्वी राशि में बुध — मन मूल्य, सौन्दर्य और व्यावहारिक परिणामों में सोचता है। धीमा किन्तु गहन विश्लेषण। मधुर वाणी और संगीत, कविता, वित्तीय नियोजन में प्रतिभा। बैंकिंग, कला व्यापार और विलासिता विपणन के लिए उत्कृष्ट। स्मृति सशक्त और विश्वसनीय।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: 'Own sign',
    effect: { en: 'Mercury in its own air sign — the intellect at its most versatile and communicative. The native is a natural polymath who absorbs information from multiple sources simultaneously. Exceptional skill in writing, teaching, translation, coding, and any form of information processing. Can carry on multiple conversations, manage several projects, and switch between languages effortlessly. The mind never stops — insomnia from mental hyperactivity is common. Can be superficial, gossipy, and intellectually restless. This placement produces brilliant journalists, programmers, linguists, and traders.', hi: 'बुध अपनी वायु राशि में — बुद्धि अपनी सबसे बहुमुखी और संवादात्मक। जातक स्वाभाविक बहुज्ञ जो एक साथ कई स्रोतों से जानकारी आत्मसात करता है। लेखन, शिक्षण, अनुवाद, कोडिंग में असाधारण कौशल। मन कभी नहीं रुकता — मानसिक अतिसक्रियता से अनिद्रा। उत्कृष्ट पत्रकार, प्रोग्रामर और भाषाविद।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: 'Enemy\'s sign',
    effect: { en: 'Mercury in Moon\'s water sign — intellect colored by emotion and intuition. The native thinks through feelings rather than pure logic. Excellent memory for emotional events but may struggle with abstract reasoning. Good for writing fiction, poetry, psychology, and family-oriented businesses. The mind absorbs the moods of the environment — productivity rises and falls with emotional state. Can be mentally insecure, seeking constant intellectual validation. Excellent for counseling, childcare education, and culinary arts where emotional intelligence matters more than cold analysis.', hi: 'चन्द्र की जल राशि में बुध — भावना और अन्तर्ज्ञान से रंगित बुद्धि। जातक भावनाओं से सोचता है, शुद्ध तर्क से नहीं। भावनात्मक घटनाओं की उत्कृष्ट स्मृति। कथा लेखन, कविता, मनोविज्ञान और पारिवारिक व्यवसाय के लिए शुभ। मन वातावरण की मनोदशा आत्मसात करता है।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: 'Friend\'s sign',
    effect: { en: 'Mercury in the Sun\'s sign — the intellect serves authority and seeks recognition. The native communicates with confidence, drama, and regal eloquence. Excellent for public speaking, political speechwriting, creative direction, and executive communication. Ideas are presented with flair and theatrical impact. The mind thinks in terms of grand narratives rather than small details. Can be intellectually arrogant, dismissing others\' ideas without consideration. Good for entertainment industry, advertising, and any role where communication must inspire and command attention.', hi: 'सूर्य की राशि में बुध — बुद्धि अधिकार की सेवा करती है और मान्यता चाहती है। आत्मविश्वास, नाटकीयता और राजसी वाक्पटुता से संवाद। सार्वजनिक भाषण, राजनीतिक भाषण लेखन और सृजनात्मक निर्देशन के लिए उत्कृष्ट। बड़ी कथाओं में सोचता है, छोटे विवरणों में नहीं।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: 'Exalted / Own sign',
    effect: { en: 'Mercury is both exalted and in its own earth sign — the apex of intellectual power. The mind is analytically brilliant, methodically precise, and devastatingly thorough. The deepest exaltation at 15° produces people who see every detail, every flaw, every opportunity for improvement. Exceptional for scientific research, medicine, accounting, programming, quality assurance, and any field requiring perfect accuracy. The native can process vast amounts of data and extract meaningful patterns. Can be paralyzing perfectionist, hypochondriac, and mentally exhausting to others through constant critique. This is Mercury at its absolute finest — the divine accountant.', hi: 'बुध उच्च और स्वराशि दोनों में — बौद्धिक शक्ति का शिखर। मन विश्लेषणात्मक रूप से प्रतिभाशाली, व्यवस्थित रूप से सटीक। 15° पर परम उच्च — हर विवरण, हर दोष, हर सुधार का अवसर देखता है। वैज्ञानिक शोध, चिकित्सा, लेखा, प्रोग्रामिंग के लिए असाधारण। दिव्य लेखाकार।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: 'Friend\'s sign',
    effect: { en: 'Mercury in Venus\'s air sign — the intellect of the diplomat, the negotiator, and the judge. Communication is balanced, fair, and aesthetically pleasing. The native excels at seeing all sides of an argument and articulating compromises. Excellent for law, mediation, art criticism, design, and social media management. Writing style is elegant and persuasive rather than forceful. Can be indecisive, spending too long analyzing options instead of choosing. Business partnerships thrive on intellectual complementarity. This placement produces exceptional contract lawyers, diplomats, and interior designers.', hi: 'शुक्र की वायु राशि में बुध — कूटनीतिज्ञ, वार्ताकार और न्यायाधीश की बुद्धि। संवाद सन्तुलित, निष्पक्ष और सौन्दर्यपूर्ण। तर्क के सभी पक्ष देखने और समझौते व्यक्त करने में उत्कृष्ट। विधि, मध्यस्थता, कला आलोचना और डिज़ाइन के लिए उत्कृष्ट। अनिर्णयात्मक हो सकता है।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: 'Neutral',
    effect: { en: 'Mercury in Mars\'s water sign — the detective mind. The intellect penetrates below surfaces, uncovering hidden truths, secret motives, and buried information. Exceptional for forensic science, psychology, occult research, investigative journalism, and intelligence analysis. The native never takes anything at face value. Speech can be cutting, sarcastic, and weaponized. Secrets are both collected and guarded with equal intensity. Can be paranoid, manipulative through information control, and mentally obsessive. Research skills are unmatched — this Mercury finds what others cannot.', hi: 'मंगल की जल राशि में बुध — जासूसी मन। बुद्धि सतह के नीचे भेदती है, छिपे सत्य और गुप्त उद्देश्य उजागर करती है। फोरेंसिक विज्ञान, मनोविज्ञान, गूढ़ शोध और खोजी पत्रकारिता के लिए असाधारण। वाणी तीखी, व्यंग्यात्मक और हथियार जैसी। शोध कौशल अद्वितीय।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Neutral',
    effect: { en: 'Mercury in Jupiter\'s fire sign — the intellectual philosopher. The mind thinks in big-picture terms — grand theories, moral frameworks, and sweeping narratives. Excellent for teaching philosophy, writing religious texts, academic publishing, and cross-cultural communication. The native is a gifted storyteller who connects ideas across disciplines. Can be intellectually overconfident, making broad generalizations without sufficient evidence. Details bore this Mercury — it would rather debate the meaning of life than balance a checkbook. Excellent for higher education, international law, and religious scholarship.', hi: 'गुरु की अग्नि राशि में बुध — बौद्धिक दार्शनिक। मन बड़े चित्र में सोचता है — भव्य सिद्धान्त, नैतिक ढाँचे। दर्शन शिक्षण, धार्मिक ग्रन्थ लेखन और अन्तर-सांस्कृतिक संवाद के लिए उत्कृष्ट। विवरण ऊबाते हैं — जीवन का अर्थ बहस करना पसन्द। उच्च शिक्षा और धार्मिक विद्वत्ता के लिए उत्तम।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: 'Neutral',
    effect: { en: 'Mercury in Saturn\'s earth sign — the mind of the administrator, the planner, and the long-term strategist. Thinking is methodical, practical, and focused on tangible outcomes. Communication is formal, measured, and authoritative. Excellent for corporate management, government administration, architecture, and structural engineering. The native builds intellectual frameworks that last for decades. Speech may be sparse but carries weight. Can be mentally rigid, pessimistic, and slow to adopt new ideas. Education may be delayed but the knowledge acquired is retained permanently.', hi: 'शनि की पृथ्वी राशि में बुध — प्रशासक, नियोजक और दीर्घकालिक रणनीतिकार का मन। सोच व्यवस्थित, व्यावहारिक और मूर्त परिणामों पर केन्द्रित। संवाद औपचारिक और आधिकारिक। कॉर्पोरेट प्रबन्धन, सरकारी प्रशासन और वास्तुकला के लिए उत्कृष्ट। मानसिक रूप से कठोर हो सकता है।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: 'Neutral',
    effect: { en: 'Mercury in Saturn\'s air sign — the mind of the inventor, the futurist, and the systems thinker. Intellectual energy is directed toward innovation, technology, and solving humanity\'s problems. The native thinks in networks, algorithms, and distributed systems. Excellent for software engineering, scientific research, social science, and futurism. Communication style is unconventional and may be ahead of its time. Can be intellectually eccentric, stubborn about unconventional ideas, and emotionally disconnected from the human impact of their innovations. This Mercury builds the systems the world will use tomorrow.', hi: 'शनि की वायु राशि में बुध — आविष्कारक, भविष्यवादी और प्रणाली चिन्तक का मन। नवाचार, प्रौद्योगिकी और मानवता की समस्याओं के समाधान की ओर। नेटवर्क, एल्गोरिदम और वितरित प्रणालियों में सोचता है। सॉफ्टवेयर अभियान्त्रिकी और वैज्ञानिक शोध के लिए उत्कृष्ट।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Debilitated',
    effect: { en: 'Mercury is debilitated here — the rational mind dissolves in the ocean of imagination, intuition, and spiritual vision. Logical analysis is weakened but creative, artistic, and spiritual intelligence soars. The deepest fall at 15° means the analytical faculty is most challenged when drowning in emotional and imaginative currents. However, Neecha Bhanga produces visionary poets, musicians, filmmakers, and spiritual teachers who communicate truth through beauty rather than logic. The native may struggle with practical details, organization, and mathematical precision. This is the placement of divine inspiration — Mercury as the channel for messages from beyond.', hi: 'बुध यहाँ नीच — तर्कशील मन कल्पना, अन्तर्ज्ञान और आध्यात्मिक दृष्टि के सागर में विलीन। तार्किक विश्लेषण दुर्बल किन्तु सृजनात्मक और आध्यात्मिक बुद्धि ऊँची। 15° पर परम नीच। नीच भंग दूरदर्शी कवि, संगीतकार और आध्यात्मिक शिक्षक बनाता है जो तर्क से नहीं सौन्दर्य से सत्य व्यक्त करते हैं।' } },
];

// ─── Mercury in 12 Houses ──────────────────────────────────────────────
const MERCURY_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'The native is intellectually sharp, youthful in appearance, and communicative by nature. Mercury in the ascendant gives a lean, agile physique and a face that appears younger than actual age. Quick learner, adaptable, and skilled with hands. The personality is defined by intelligence, curiosity, and verbal dexterity. May appear nervous or restless. Budhaditya Yoga is formed if Sun is also present — highly auspicious for intelligence and career. Can be indecisive and overly analytical about personal identity. Excellent for writers, teachers, and communicators who make their intellect their brand.', hi: 'जातक बौद्धिक रूप से तीक्ष्ण, दिखने में युवा और स्वभाव से संवादशील। लग्न में बुध दुबली, फुर्तीली काया और वास्तविक आयु से छोटा दिखने वाला चेहरा। शीघ्र शिक्षार्थी और हाथों में कुशल। बुधादित्य योग अत्यन्त शुभ। लेखकों और शिक्षकों के लिए उत्कृष्ट।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Wealth through intellect, communication, and commerce. The voice is articulate, persuasive, and suited for teaching, singing, or sales. The native earns from multiple sources — writing, trading, consulting, and intellectual property. Family values emphasize education and learning. Excellent at managing finances through careful analysis. Can indicate proficiency in multiple languages. Food preferences are varied and the native enjoys discussing cuisine. Financial success comes through intellectual ventures rather than physical labor. Right eye may have sharp vision.', hi: 'बुद्धि, संवाद और वाणिज्य से धन। वाणी स्पष्ट, प्रेरक और शिक्षण या बिक्री के लिए उपयुक्त। लेखन, व्यापार, परामर्श से कमाई। पारिवारिक मूल्य शिक्षा पर जोर। कई भाषाओं में दक्षता संभव। बौद्धिक उद्यमों से वित्तीय सफलता।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Mercury is naturally strong in the 3rd house — the house of communication, siblings, and short journeys. The native is an exceptional writer, speaker, and communicator. Siblings may be intellectual or involved in commerce/media. Courage comes through intellect rather than physical strength. Excellent for journalism, blogging, social media, local politics, and neighborhood businesses. The hands are extraordinarily skilled — good for programming, instrument playing, and craftsmanship. Short trips are frequent and mentally stimulating. The native processes the world primarily through reading, conversation, and observation.', hi: 'तृतीय भाव में बुध स्वाभाविक रूप से सशक्त — संवाद, भाई-बहन और लघु यात्रा का भाव। असाधारण लेखक, वक्ता और संवादकर्ता। भाई-बहन बौद्धिक या वाणिज्य/मीडिया में। पत्रकारिता, ब्लॉगिंग और सोशल मीडिया के लिए उत्कृष्ट। हाथ असाधारण रूप से कुशल।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'The home is a place of learning — filled with books, computers, and intellectual activity. Education in early life is strong. The native may own multiple properties through clever dealing. Mother is likely educated, communicative, and intellectually influential. Mental peace comes through study and research. Vehicles may be frequently changed. Can indicate multiple residences or working from home in intellectual professions. The native\'s emotional security is tied to their intellectual environment — a stimulating home equals a happy mind. Good for home-based teaching, writing, and IT work.', hi: 'घर शिक्षा का स्थान — पुस्तकों, कम्प्यूटरों और बौद्धिक गतिविधि से भरा। प्रारम्भिक शिक्षा सशक्त। चतुर सौदेबाजी से कई सम्पत्तियाँ संभव। माता शिक्षित और बौद्धिक रूप से प्रभावशाली। अध्ययन और शोध से मानसिक शान्ति। गृह-आधारित शिक्षण और आईटी कार्य के लिए शुभ।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Brilliant creative intelligence — the mind excels at speculation, strategy, and artistic creation. Children are likely to be intelligent, communicative, and academically gifted. Romance is cerebral — the native falls in love through conversation and intellectual connection. Excellent for stock trading, game design, writing fiction, and educational content creation. Mantra siddhi through Mercury-related mantras (Budha Beej, Vishnu Sahasranama). The native\'s creativity is expressed through words, ideas, and intellectual innovation rather than visual arts or physical performance.', hi: 'प्रतिभाशाली सृजनात्मक बुद्धि — सट्टा, रणनीति और कलात्मक सृजन में उत्कृष्ट। संतान बुद्धिमान और शैक्षिक रूप से प्रतिभाशाली। रोमांस बौद्धिक — संवाद से प्रेम। शेयर व्यापार, गेम डिज़ाइन और कथा लेखन के लिए उत्कृष्ट। बुध-सम्बन्धी मन्त्र सिद्धि।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'Mercury defeats enemies through intelligence rather than force. Excellent for legal battles, competitive exams, medical diagnostics, and any profession requiring analytical problem-solving under adversity. The native outsmarts opponents. Can indicate maternal uncle\'s health challenges. Nervous system disorders, skin problems, and intestinal issues may arise if Mercury is afflicted. Service professions involving communication — medical transcription, legal documentation, insurance claims — suit this placement well. The native is skilled at finding flaws in others\' arguments.', hi: 'बुध बल से नहीं बुद्धि से शत्रुओं को पराजित करता है। कानूनी लड़ाइयों, प्रतिस्पर्धी परीक्षाओं और चिकित्सा निदान के लिए उत्कृष्ट। जातक प्रतिद्वन्द्वियों को बुद्धि से मात देता है। तन्त्रिका तन्त्र विकार और त्वचा समस्याएँ सम्भव। दूसरों के तर्कों में दोष खोजने में कुशल।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'The spouse is intellectual, communicative, younger-looking, and possibly involved in business, teaching, or writing. Marriage is a meeting of minds — intellectual compatibility matters more than physical attraction. Business partnerships thrive when Mercury is here — excellent for consulting firms, trading companies, and educational ventures. The native negotiates skillfully in both personal and professional relationships. Can indicate multiple marriages or relationships if Mercury is afflicted. Foreign business connections bring success.', hi: 'जीवनसाथी बौद्धिक, संवादशील, दिखने में युवा। विवाह मन का मिलन — बौद्धिक अनुकूलता भौतिक आकर्षण से अधिक महत्त्वपूर्ण। व्यापारिक साझेदारी फलती-फूलती है — परामर्श, व्यापार और शैक्षिक उद्यमों के लिए उत्कृष्ट। कुशल वार्ताकार। विदेशी व्यापार सम्पर्क सफलता देते हैं।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'The mind penetrates mysteries — excellent for research, occult studies, psychology, forensic accounting, and inheritance law. The native uncovers what others hide. Can indicate longevity through medical knowledge and health awareness. Nervous system may be vulnerable. Speech may reveal others\' secrets unintentionally. Inheritance through intelligence — inheriting intellectual property, business knowledge, or academic credentials from the family. Interest in tantra, astrology, and the mechanics of death and transformation. This Mercury thinks about what everyone else avoids.', hi: 'मन रहस्यों में प्रवेश करता है — शोध, गूढ़ अध्ययन, मनोविज्ञान और फोरेंसिक लेखा के लिए उत्कृष्ट। जातक दूसरों के छिपाये को उजागर करता है। चिकित्सा ज्ञान से दीर्घायु। तन्त्रिका तन्त्र कमजोर हो सकता है। तन्त्र, ज्योतिष और मृत्यु के यान्त्रिकी में रुचि।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'The intellectual pilgrim — Mercury channels analytical ability toward philosophy, law, and higher education. The native is a gifted teacher, writer of religious or philosophical texts, and translator of ancient wisdom into modern language. Father may be educated, communicative, or involved in commerce. Foreign education and international connections bring intellectual growth. This placement produces professors, legal scholars, published authors, and religious commentators. Luck comes through knowledge — the more the native studies, the more fortunate they become. Can be dogmatic about intellectual positions.', hi: 'बौद्धिक तीर्थयात्री — दर्शन, विधि और उच्च शिक्षा की ओर विश्लेषणात्मक क्षमता। प्रतिभाशाली शिक्षक और प्राचीन ज्ञान के आधुनिक अनुवादक। पिता शिक्षित या वाणिज्य में। विदेशी शिक्षा से बौद्धिक विकास। प्रोफेसर, कानूनी विद्वान और प्रकाशित लेखक बनाता है। ज्ञान से भाग्य।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'Career success through intelligence, communication, and multiple skills. The native may hold multiple professional roles simultaneously or change careers several times — each time through intellectual adaptation. Excellent for IT, media, publishing, consulting, and any information-driven industry. Government clerical or administrative positions if Mercury is with Sun. The native is known professionally for their intelligence, adaptability, and communication skills. Can become a public intellectual, media personality, or industry analyst. Career reputation depends on intellectual credibility.', hi: 'बुद्धि, संवाद और बहुविध कौशल से करियर सफलता। एक साथ कई व्यावसायिक भूमिकाएँ या कई बार करियर परिवर्तन — बौद्धिक अनुकूलन से। आईटी, मीडिया, प्रकाशन और परामर्श के लिए उत्कृष्ट। सूर्य के साथ हो तो सरकारी प्रशासनिक पद। बौद्धिक विश्वसनीयता पर प्रतिष्ठा।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Wealth through intellectual networks, technology, and group endeavors. The native\'s social circle includes educated, communicative, and commercially minded people. Elder siblings may be intellectual or in business. Income from multiple intellectual sources — writing royalties, consulting fees, software, and educational products. Desires are achieved through strategic thinking and the right connections. Excellent for tech startups, educational enterprises, and media companies. Financial gains through information — the native profits from knowing what others don\'t.', hi: 'बौद्धिक नेटवर्क, प्रौद्योगिकी और समूह प्रयासों से धन। शिक्षित और वाणिज्यिक मित्र मण्डल। बड़े भाई-बहन बौद्धिक या व्यवसाय में। लेखन रॉयल्टी, परामर्श शुल्क, सॉफ्टवेयर से कई बौद्धिक स्रोतों से आय। टेक स्टार्टअप और शैक्षिक उद्यमों के लिए उत्कृष्ट।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'Mercury here operates behind the scenes — the mind processes information subconsciously, through dreams, and in isolation. Excellent for research in enclosed environments (labs, libraries, hospitals), writing in solitude, and foreign-language studies. The native may work in foreign countries or for foreign companies in intellectual roles. Expenditure on education, books, and travel for learning. Can indicate speech disorders or communication difficulties in early life. Meditation and introspection sharpen the intellect. When well-placed, produces brilliant researchers, writers of spiritual texts, and translators who bridge cultures from behind the scenes.', hi: 'बुध यहाँ पर्दे के पीछे कार्य करता है — मन अवचेतन रूप से, स्वप्नों और एकान्त में जानकारी संसाधित करता है। प्रयोगशालाओं, पुस्तकालयों में शोध, एकान्त में लेखन और विदेशी भाषा अध्ययन के लिए उत्कृष्ट। शिक्षा और यात्रा पर व्यय। ध्यान और आत्मनिरीक्षण बुद्धि को तीक्ष्ण करते हैं।' } },
];

// ─── Astronomical Profile ──────────────────────────────────────────────
const ASTRONOMICAL = {
  orbitalPeriod: { en: 'Orbital period: 87.97 days — the fastest planet in the solar system. Mercury completes over 4 orbits for every one of Earth\'s, making it the most restless and changeable graha.', hi: 'कक्षीय अवधि: 87.97 दिन — सौरमण्डल का सबसे तेज़ ग्रह। बुध पृथ्वी की एक परिक्रमा में 4 से अधिक परिक्रमाएँ पूरी करता है, जिससे यह सबसे अस्थिर और परिवर्तनशील ग्रह है।' },
  dailyMotion: { en: 'Average daily motion: ~1.38° per day (varies 0.5°–2.2° due to eccentric orbit). This rapid motion means Mercury changes sign roughly every 14–30 days, spending variable time in each sign depending on retrograde cycles.', hi: 'औसत दैनिक गति: ~1.38° प्रतिदिन (विलक्षण कक्षा के कारण 0.5°–2.2° तक भिन्न)। इस तीव्र गति का अर्थ है बुध लगभग हर 14-30 दिनों में राशि बदलता है।' },
  synodicPeriod: { en: 'Synodic period: 115.88 days — the interval between successive inferior conjunctions with the Sun. This cycle determines when Mercury becomes visible as a morning or evening star, and governs the rhythm of its retrograde periods.', hi: 'सिनॉडिक अवधि: 115.88 दिन — सूर्य के साथ क्रमिक अधोयुतियों के बीच का अन्तराल। यह चक्र निर्धारित करता है कि बुध प्रातः या सायं तारे के रूप में कब दिखता है, और इसकी वक्री अवधियों की लय को नियन्त्रित करता है।' },
  retrograde: { en: 'Retrograde frequency: 3–4 times per year, lasting 20–24 days each. Mercury retrograde is the most talked-about planetary phenomenon in popular astrology. During retrograde, communication breakdowns, travel delays, technology glitches, and contract errors are classically indicated. In the birth chart, natal Mercury retrograde (present in ~20% of charts) suggests an internalized intellect — the native processes information deeply before speaking and may have been a late talker in childhood.', hi: 'वक्री आवृत्ति: वर्ष में 3-4 बार, प्रत्येक बार 20-24 दिन। बुध वक्री लोकप्रिय ज्योतिष में सबसे चर्चित ग्रह घटना है। वक्री काल में संवाद भंग, यात्रा विलम्ब, प्रौद्योगिकी त्रुटियाँ और अनुबन्ध दोष शास्त्रीय रूप से सूचित। जन्मजात बुध वक्री (~20% कुण्डलियों में) आन्तरिक बुद्धि सूचित करता है।' },
  combustion: { en: 'Combustion: Mercury is the most frequently combust planet because it never strays more than 28° from the Sun. Combustion occurs within ~14° (direct) or ~12° (retrograde) of the Sun. A combust Mercury loses independent thinking — the native\'s intellect becomes subservient to ego and authority. Budhaditya Yoga requires Mercury to be close to Sun but NOT combust — the narrow window between ~12° and ~17° is where this yoga operates most powerfully.', hi: 'अस्त: बुध सबसे अधिक बार अस्त होने वाला ग्रह है क्योंकि यह सूर्य से कभी 28° से अधिक दूर नहीं जाता। अस्त ~14° (मार्गी) या ~12° (वक्री) के भीतर होता है। अस्त बुध स्वतन्त्र चिन्तन खो देता है। बुधादित्य योग के लिए बुध सूर्य के निकट किन्तु अस्त नहीं होना चाहिए — ~12° और ~17° के बीच का संकीर्ण क्षेत्र सबसे शक्तिशाली।' },
  astronomicalSignificance: { en: 'Astronomical vs. astrological significance: Mercury\'s tiny size (smallest planet) belies its astrological importance. Astronomically, Mercury has the most eccentric orbit of any planet (e=0.206), the greatest temperature range (-180°C to +430°C), and no atmosphere. These physical extremes mirror Mercury\'s astrological nature — maximum adaptability, extreme duality (benefic/malefic), and inability to hold its own identity without influence from other planets.', hi: 'खगोलीय बनाम ज्योतिषीय महत्त्व: बुध का छोटा आकार (सबसे छोटा ग्रह) इसके ज्योतिषीय महत्त्व को छुपाता है। खगोलीय रूप से, बुध की सबसे विलक्षण कक्षा (e=0.206), सबसे बड़ा तापमान परास (-180°C से +430°C) और कोई वायुमण्डल नहीं। ये भौतिक चरम बुध की ज्योतिषीय प्रकृति को प्रतिबिम्बित करते हैं — अधिकतम अनुकूलनशीलता और चरम द्वैत।' },
};

// ─── Notable Yogas ────────────────────────────────────────────────────
const NOTABLE_YOGAS = [
  { name: { en: 'Budhaditya Yoga', hi: 'बुधादित्य योग' },
    condition: { en: 'Mercury conjunct Sun in the same sign, with Mercury NOT combust (ideally 12°–17° from Sun). Both should be in a kendra or trikona for full strength.', hi: 'बुध और सूर्य एक ही राशि में, बुध अस्त नहीं (आदर्श रूप से सूर्य से 12°-17°)। पूर्ण बल के लिए दोनों केन्द्र या त्रिकोण में।' },
    effect: { en: 'The native possesses sharp intelligence illuminated by purpose and authority. Produces educated professionals, government communicators, public intellectuals, and leaders who combine analytical skill with executive decision-making. This is the most common yoga in Jyotish — present in roughly 1 in 3 charts — but its strength varies enormously based on house placement and combustion status.', hi: 'जातक में उद्देश्य और अधिकार से प्रकाशित तीक्ष्ण बुद्धि। शिक्षित पेशेवर, सरकारी संवादक, सार्वजनिक बुद्धिजीवी उत्पन्न करता है। ज्योतिष में सबसे सामान्य योग — लगभग 3 में 1 कुण्डली में — किन्तु बल भाव स्थिति और अस्त स्थिति पर बहुत भिन्न।' },
    strength: { en: 'Strongest in 1st, 4th, 5th, 9th, 10th houses. Weak or ineffective if Mercury is combust, debilitated, or in 6th/8th/12th houses.', hi: '1, 4, 5, 9, 10 भावों में सबसे बलवान। बुध अस्त, नीच या 6/8/12 भावों में हो तो दुर्बल या अप्रभावी।' } },
  { name: { en: 'Bhadra Yoga (Mahapurusha)', hi: 'भद्र योग (महापुरुष)' },
    condition: { en: 'Mercury in a kendra (1st, 4th, 7th, or 10th house) in its own sign (Gemini/Virgo) or exalted (Virgo). This is one of the five Mahapurusha Yogas.', hi: 'बुध केन्द्र (1, 4, 7, 10 भाव) में स्वराशि (मिथुन/कन्या) या उच्च (कन्या) में। यह पाँच महापुरुष योगों में एक है।' },
    effect: { en: 'The native has a strong, well-built body with a commanding intellectual presence. Exceptional memory, oratory skill, and scholarship. The person becomes famous through intelligence, writing, or commerce. Long life and respected social position. Classical texts describe the Bhadra native as having a face like a lion and the gait of an elephant — confident intellectual authority.', hi: 'जातक का सशक्त, सुगठित शरीर और प्रभावशाली बौद्धिक उपस्थिति। असाधारण स्मृति, वाक्चातुर्य और विद्वत्ता। बुद्धि, लेखन या वाणिज्य से प्रसिद्धि। दीर्घ जीवन और सम्मानित सामाजिक स्थिति। शास्त्रीय ग्रन्थ भद्र जातक को सिंह जैसे मुख और हाथी जैसी चाल वाला बताते हैं।' },
    strength: { en: 'Strongest in Lagna (1st) and 10th house. Weakened if Mercury is combust or aspected by malefics.', hi: 'लग्न (1st) और दशम भाव में सबसे बलवान। बुध अस्त या पापग्रहों की दृष्टि में हो तो दुर्बल।' } },
  { name: { en: 'Saraswati Yoga', hi: 'सरस्वती योग' },
    condition: { en: 'Mercury, Jupiter, and Venus all placed in kendras, trikonas, or the 2nd house from the ascendant. All three should be in strong dignity.', hi: 'बुध, गुरु और शुक्र सभी केन्द्र, त्रिकोण या लग्न से दूसरे भाव में। तीनों की गरिमा बलवान होनी चाहिए।' },
    effect: { en: 'Unparalleled scholarship, literary genius, and mastery of multiple arts and sciences. The native becomes renowned as a scholar, teacher, or author. Produces university professors, encyclopedia-level polymaths, and literary prize winners. The name Saraswati (goddess of learning) reflects the yoga\'s essence: the native becomes a vessel for knowledge itself.', hi: 'अद्वितीय विद्वत्ता, साहित्यिक प्रतिभा और विविध कला-विज्ञान में दक्षता। विद्वान, शिक्षक या लेखक के रूप में विख्यात। विश्वविद्यालय प्रोफेसर, विश्वकोश-स्तरीय बहुज्ञ और साहित्यिक पुरस्कार विजेता उत्पन्न करता है।' },
    strength: { en: 'Requires all three planets in good dignity. If any one is debilitated or combust, the yoga weakens significantly.', hi: 'तीनों ग्रहों की अच्छी गरिमा आवश्यक। यदि कोई एक नीच या अस्त हो तो योग बहुत दुर्बल।' } },
  { name: { en: 'Nipuna Yoga (Budha-Chandra)', hi: 'निपुण योग (बुध-चन्द्र)' },
    condition: { en: 'Mercury and Moon conjunct in a kendra or trikona, especially in signs favorable to both (Gemini, Virgo, or Taurus).', hi: 'बुध और चन्द्र केन्द्र या त्रिकोण में युत, विशेषकर दोनों के अनुकूल राशियों (मिथुन, कन्या या वृषभ) में।' },
    effect: { en: 'The native combines emotional intelligence with analytical precision — the ability to read people and situations with uncanny accuracy. Excellent for psychology, counseling, creative writing, and any field where empathy must combine with intellect. Despite Mercury-Moon enmity, when well-placed this conjunction produces exceptional communicators who bridge heart and mind.', hi: 'भावनात्मक बुद्धि और विश्लेषणात्मक सूक्ष्मता का संयोजन — लोगों और स्थितियों को अद्भुत सटीकता से पढ़ने की क्षमता। मनोविज्ञान, परामर्श और सृजनात्मक लेखन के लिए उत्कृष्ट। बुध-चन्द्र शत्रुता के बावजूद, सुस्थित होने पर असाधारण संवादक उत्पन्न।' },
    strength: { en: 'Strong when Moon is waxing (Shukla Paksha) and Mercury is not combust. Weak when Moon is waning or Mercury is debilitated.', hi: 'चन्द्र शुक्ल पक्ष में हो और बुध अस्त न हो तो बलवान। चन्द्र कृष्ण पक्ष में या बुध नीच हो तो दुर्बल।' } },
  { name: { en: 'Dhana Yoga (Mercury-based)', hi: 'धन योग (बुध आधारित)' },
    condition: { en: 'Mercury as lord of 2nd or 11th house, placed in a kendra or trikona, conjunct or aspected by benefics (Jupiter or Venus). Or Mercury forming mutual aspect with the lord of 2nd/11th.', hi: 'बुध 2 या 11 भाव का स्वामी, केन्द्र या त्रिकोण में, शुभ ग्रहों (गुरु या शुक्र) की युति या दृष्टि। या बुध 2/11 भाव स्वामी से परस्पर दृष्टि।' },
    effect: { en: 'Wealth through intellectual pursuits — writing royalties, consulting fees, software products, educational content, trading profits, and information arbitrage. This is the yoga of the modern knowledge economy. The native earns by knowing what others don\'t and communicating it effectively. Multiple income streams from different intellectual activities simultaneously.', hi: 'बौद्धिक कार्यों से धन — लेखन रॉयल्टी, परामर्श शुल्क, सॉफ्टवेयर, शैक्षिक सामग्री, व्यापार लाभ और सूचना मध्यस्थता। आधुनिक ज्ञान अर्थव्यवस्था का योग। जातक दूसरों से अधिक जानकर और प्रभावी संवाद से कमाता है।' },
    strength: { en: 'Strongest when Mercury is in its own sign or exalted and unafflicted by malefics. Rahu conjunction amplifies but adds ethical risks.', hi: 'बुध स्वराशि या उच्च में और पापग्रहों से अपीड़ित हो तो सबसे बलवान। राहु युति बढ़ाती है किन्तु नैतिक जोखिम जोड़ती है।' } },
];

// ─── Practical Application ────────────────────────────────────────────
const PRACTICAL = {
  assessStrength: {
    en: 'To assess Mercury\'s strength in your chart, check these factors in order of importance: (1) Sign placement — own sign (Gemini/Virgo) or exalted (Virgo) is best; debilitated (Pisces) is weakest. (2) House placement — kendras and trikonas are strong; 6th/8th/12th are challenging. (3) Combustion — if Mercury is within 14° of the Sun, its independent significations are weakened. (4) Aspects — benefic aspects (Jupiter, Venus) strengthen; malefic aspects (Saturn, Mars, Rahu) can distort. (5) Retrograde status — natal retrograde Mercury is not inherently weak but processes information differently. (6) Nakshatra lord — the nakshatra dispositor colors Mercury\'s expression significantly.',
    hi: 'अपनी कुण्डली में बुध के बल का आकलन करने के लिए, महत्त्व क्रम में जाँचें: (1) राशि — स्वराशि (मिथुन/कन्या) या उच्च (कन्या) सर्वोत्तम; नीच (मीन) दुर्बलतम। (2) भाव — केन्द्र और त्रिकोण बलवान; 6/8/12 चुनौतीपूर्ण। (3) अस्त — सूर्य से 14° के भीतर बुध हो तो स्वतन्त्र कारकत्व दुर्बल। (4) दृष्टि — शुभ दृष्टि बलवान करती है; पापी दृष्टि विकृत कर सकती है। (5) वक्री — जन्मजात वक्री बुध स्वतः दुर्बल नहीं किन्तु भिन्न रूप से संसाधित करता है। (6) नक्षत्र स्वामी — बुध की अभिव्यक्ति को महत्त्वपूर्ण रूप से रंगता है।',
  },
  strongIndicators: {
    en: 'Signs of a strong Mercury: Quick learner, excellent memory, articulate speech, skill with languages, good handwriting, mathematical aptitude, commercial acumen, youthful appearance, adaptable personality, curiosity about diverse subjects, good sense of humor, and the ability to multitask without losing quality.',
    hi: 'बलवान बुध के संकेत: शीघ्र शिक्षार्थी, उत्कृष्ट स्मृति, स्पष्ट वाणी, भाषाओं में कौशल, अच्छी लिखावट, गणितीय योग्यता, वाणिज्यिक कौशल, युवा दिखावट, अनुकूलनशील व्यक्तित्व, विविध विषयों में जिज्ञासा, अच्छी हास्य बोध, गुणवत्ता खोये बिना बहुकार्य करने की क्षमता।',
  },
  weakIndicators: {
    en: 'Signs of a weak Mercury: Speech impediments or communication difficulties, poor memory, inability to concentrate, chronic nervousness or anxiety, skin disorders, lung problems, difficulty with mathematics or languages, poor handwriting, indecisiveness, chronic lying or exaggeration, and trouble processing written information.',
    hi: 'दुर्बल बुध के संकेत: वाक् दोष या संवाद कठिनाई, कमज़ोर स्मृति, एकाग्रता की अक्षमता, दीर्घकालिक घबराहट या चिन्ता, त्वचा विकार, फेफड़ों की समस्या, गणित या भाषा में कठिनाई, खराब लिखावट, अनिर्णय, दीर्घकालिक झूठ या अतिशयोक्ति, लिखित जानकारी संसाधित करने में कठिनाई।',
  },
  whenToRemediate: {
    en: 'Seek Mercury remedies when: Mercury dasha is running and you experience communication breakdowns, business failures, or nervous health issues. When Mercury is combust in your natal chart and you struggle with independent thinking. When transiting Mercury retrograde repeatedly causes disruptions in your work. When you notice chronic indecisiveness or inability to commit to a single career path. Mercury remedies are MOST effective when combined with active intellectual engagement — reading, writing, learning a new skill, or studying a new language.',
    hi: 'बुध उपाय कब करें: बुध दशा चल रही हो और संवाद भंग, व्यापार विफलता या तन्त्रिका स्वास्थ्य समस्याएँ अनुभव हों। जब बुध कुण्डली में अस्त हो और स्वतन्त्र चिन्तन में कठिनाई। जब गोचर बुध वक्री बार-बार कार्य में व्यवधान। जब दीर्घकालिक अनिर्णय या एक करियर पथ पर प्रतिबद्ध होने की अक्षमता। बुध उपाय सक्रिय बौद्धिक संलग्नता — पठन, लेखन, नया कौशल सीखना — के साथ सबसे प्रभावी।',
  },
  misconceptions: {
    en: 'Common misconceptions: (1) "Mercury retrograde ruins everything" — natal retrograde Mercury is NOT a curse; it simply internalizes the intellect. Many brilliant thinkers have retrograde Mercury. (2) "Budhaditya Yoga makes you a genius" — only when Mercury is NOT combust. A combust Mercury with Sun actually weakens independent thinking. (3) "Mercury is always benefic" — Mercury is benefic ONLY when associated with benefics. With malefics, Mercury becomes malefic. This dual nature is unique to Mercury. (4) "Wearing Emerald is always good for Mercury" — Emerald amplifies Mercury\'s energy, including nervous tension. For already anxious people, it can worsen anxiety.',
    hi: 'सामान्य भ्रान्तियाँ: (1) "बुध वक्री सब बिगाड़ता है" — जन्मजात वक्री बुध श्राप नहीं; यह बुद्धि को आन्तरिक करता है। (2) "बुधादित्य योग प्रतिभाशाली बनाता है" — केवल जब बुध अस्त नहीं। अस्त बुध स्वतन्त्र चिन्तन दुर्बल करता है। (3) "बुध सदा शुभ है" — बुध शुभों के साथ ही शुभ; पापियों के साथ पापी। (4) "पन्ना पहनना सदा अच्छा" — पन्ना बुध ऊर्जा बढ़ाता है, तन्त्रिका तनाव सहित। पहले से चिन्तित लोगों में चिन्ता बढ़ा सकता है।',
  },
  budhadityaDetail: {
    en: 'Budhaditya Yoga — when it actually works: This yoga is present in roughly 33% of all charts because Mercury never strays far from the Sun. But it only delivers its full promise under specific conditions: (a) Mercury must be 12°–17° from the Sun — close enough for conjunction but not combust. (b) Mercury should be in a strong sign (Gemini, Virgo, or a friendly sign). (c) The conjunction should be in a kendra (1, 4, 7, 10) or trikona (1, 5, 9) for maximum career benefit. (d) Mercury should not be retrograde at the time of conjunction. When ALL these conditions are met, Budhaditya produces genuinely exceptional intelligence and career success through intellectual authority.',
    hi: 'बुधादित्य योग — वास्तव में कब काम करता है: यह योग लगभग 33% कुण्डलियों में होता है क्योंकि बुध सूर्य से कभी बहुत दूर नहीं जाता। किन्तु पूर्ण फल विशिष्ट शर्तों में ही: (क) बुध सूर्य से 12°-17° — युति के लिए पर्याप्त निकट किन्तु अस्त नहीं। (ख) बलवान राशि (मिथुन, कन्या या मित्र राशि)। (ग) केन्द्र या त्रिकोण में। (घ) युति के समय बुध वक्री न हो। सभी शर्तें पूरी होने पर बुधादित्य वास्तव में असाधारण बुद्धि और करियर सफलता देता है।',
  },
};

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 17,
  overview: {
    en: 'Budha Mahadasha lasts 17 years — the longest after Venus (20) and Saturn (19), making it one of the most significant periods in a native\'s life. During these 17 years, intellect, communication, education, commerce, and relationships with siblings and maternal uncle come into sharp focus. This is the ideal period for academic pursuits, business expansion, writing careers, and developing multiple income streams through intellectual work. Mercury\'s adaptable nature means this dasha can manifest very differently depending on Mercury\'s sign, house, and aspects — ranging from extraordinary commercial success to chronic nervous disorders.',
    hi: 'बुध महादशा 17 वर्ष चलती है — शुक्र (20) और शनि (19) के बाद सबसे लम्बी, जीवन की सबसे महत्त्वपूर्ण अवधियों में से एक। इन 17 वर्षों में बुद्धि, संवाद, शिक्षा, वाणिज्य और भाई-बहन व मामा सम्बन्ध स्पष्ट होते हैं। शैक्षिक उपलब्धियों, व्यापार विस्तार और लेखन करियर के लिए आदर्श अवधि।',
  },
  strongMercury: {
    en: 'If Mercury is well-placed (own sign, exalted, or in kendra/trikona): Academic degrees and certifications, business expansion into multiple ventures, published writing, successful commerce and trade, intellectual recognition, skilled craftsmanship, technological innovation, strong communication networks, and profitable investments in education or information technology.',
    hi: 'यदि बुध सुस्थित (स्वराशि, उच्च, या केन्द्र/त्रिकोण में): शैक्षिक उपाधियाँ, बहुविध उद्यमों में व्यापार विस्तार, प्रकाशित लेखन, सफल वाणिज्य, बौद्धिक मान्यता, कुशल शिल्पकारी, तकनीकी नवाचार, शिक्षा या आईटी में लाभदायक निवेश।',
  },
  weakMercury: {
    en: 'If Mercury is afflicted (debilitated, combust, or with malefics): Nervous disorders, skin diseases, speech impediments, failed business ventures, fraud or deception, academic setbacks, sibling conflicts, problems with maternal uncle, chronic anxiety, and communication breakdowns in relationships. Mercury combust by Sun (within ~14° for direct, ~12° for retrograde) weakens independent thinking.',
    hi: 'यदि बुध पीड़ित (नीच, अस्त, या पापग्रहों के साथ): तन्त्रिका विकार, त्वचा रोग, वाक् दोष, व्यापारिक विफलता, धोखा, शैक्षिक पिछड़ापन, भाई-बहन संघर्ष, मामा से समस्या, दीर्घकालिक चिन्ता। सूर्य से अस्त (~14° के भीतर) स्वतन्त्र चिन्तन दुर्बल करता है।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', transliteration: 'Om Braam Breem Braum Sah Budhaya Namah', count: '9,000 times in 40 days', en: 'The Budha Beej Mantra — chant facing north on Wednesdays, preferably during Mercury hora or at sunrise', hi: 'बुध बीज मन्त्र — बुधवार को उत्तर दिशा में मुख करके जाप करें, बुध होरा या सूर्योदय के समय सर्वोत्तम' },
  gemstone: { en: 'Emerald (Panna) — set in gold, worn on the little finger or ring finger of the right hand on a Wednesday during Shukla Paksha. Minimum 3 carats. Must touch the skin. Never wear with Red Coral (Mars\'s stone) as Mercury and Mars are enemies. Peridot can be used as a more affordable substitute.', hi: 'पन्ना — स्वर्ण में जड़ित, बुधवार को शुक्ल पक्ष में दाहिने हाथ की कनिष्ठिका या अनामिका में धारण करें। न्यूनतम 3 कैरेट। मूँगे (मंगल का रत्न) के साथ कभी न पहनें। पेरिडॉट सस्ता विकल्प।' },
  charity: { en: 'Donate green moong dal, green cloth, emerald-colored items, books, stationery, or educational materials on Wednesdays. Support children\'s education or literacy programs. Feed green grass to cows.', hi: 'बुधवार को हरी मूँग दाल, हरा वस्त्र, पन्ना रंग की वस्तुएँ, पुस्तकें, लेखन सामग्री या शैक्षिक सामग्री दान करें। बच्चों की शिक्षा या साक्षरता कार्यक्रमों का समर्थन। गायों को हरा चारा खिलाएँ।' },
  fasting: { en: 'Wednesday fasting — consume only green vegetables, moong dal, and milk products. Some traditions recommend fasting with recitation of Vishnu Sahasranama, as Vishnu is Mercury\'s presiding deity.', hi: 'बुधवार का उपवास — केवल हरी सब्जियाँ, मूँग दाल और दुग्ध उत्पाद। कुछ परम्पराओं में विष्णु सहस्रनाम पाठ के साथ उपवास, क्योंकि विष्णु बुध के अधिष्ठाता देवता हैं।' },
  worship: { en: 'Worship Lord Vishnu on Wednesdays — recite Vishnu Sahasranama or Budha Kavacham. Offer green flowers, tulsi leaves, and green fruits. Visit Navagraha temples. Keep a small potted plant of Tulsi (holy basil) at home as Mercury loves greenery and growth.', hi: 'बुधवार को भगवान विष्णु की पूजा — विष्णु सहस्रनाम या बुध कवचम् का पाठ। हरे पुष्प, तुलसी पत्र और हरे फल अर्पित करें। नवग्रह मन्दिर जाएँ। घर में तुलसी का छोटा पौधा रखें।' },
  yantra: { en: 'Budha Yantra — a 3×3 magic square with a sum of 24 in each row/column. Install on a brass plate (Mercury\'s metal), worship on Wednesdays. Place in the north direction of the study room or office.', hi: 'बुध यन्त्र — 3×3 जादुई वर्ग जिसमें प्रत्येक पंक्ति/स्तम्भ का योग 24 है। पीतल (बुध की धातु) के पत्र पर स्थापित करें, बुधवार को पूजन करें। अध्ययन कक्ष या कार्यालय की उत्तर दिशा में रखें।' },
  dietary: { en: 'Dietary remedies: Green moong dal (the primary Mercury food), green leafy vegetables, green grapes, cucumber, celery, mint, coriander, and green tea. Avoid excess red meat during Mercury dasha. Mercury governs the nervous system — omega-3 fatty acids (walnuts, flaxseed) support Mercury\'s significations physiologically. Wednesday meals should emphasize green foods. Avoid eating in haste or while working — Mercury appreciates mindful consumption of food.', hi: 'आहार उपाय: हरी मूँग दाल (प्राथमिक बुध भोजन), हरी पत्तेदार सब्जियाँ, हरे अंगूर, खीरा, अजवाइन, पुदीना, धनिया और हरी चाय। बुध दशा में अत्यधिक लाल माँस से बचें। बुध तन्त्रिका तन्त्र शासित करता है — ओमेगा-3 (अखरोट, अलसी) बुध के कारकत्व को शारीरिक रूप से सहायता। बुधवार का भोजन हरे खाद्य पदार्थों पर जोर दे।' },
  colorTherapy: { en: 'Color therapy: Wear green on Wednesdays — emerald green, leaf green, or forest green. The study room or workspace should have green accents — a green desk lamp, green plants, or green-tinted walls. Avoid wearing green during Mercury retrograde if you are already experiencing Mercury-related problems (it amplifies both positive and negative). Green aventurine can be kept on the work desk as a subtle Mercury energizer.', hi: 'रंग चिकित्सा: बुधवार को हरा पहनें — पन्ना हरा, पत्ती हरा या वन हरा। अध्ययन कक्ष या कार्यस्थल में हरे रंग — हरा डेस्क लैम्प, हरे पौधे या हरे रंग की दीवारें। बुध वक्री में बुध-सम्बन्धित समस्या अनुभव करने पर हरा पहनने से बचें। कार्य डेस्क पर हरा एवेंचुरिन रखा जा सकता है।' },
  behavioral: { en: 'Behavioral remedies (most powerful for Mercury): Read daily for at least 30 minutes — books, not social media. Learn a new language or skill every year. Keep a journal — writing is the most direct Mercury activation. Solve puzzles, play chess, or engage in strategic games. Maintain honest, clear communication — lying weakens Mercury more than any malefic aspect. Teach someone what you know. Organize your workspace and digital files. Practice pranayama (Nadi Shodhana — alternate nostril breathing specifically strengthens Mercury). Avoid gossip and trivial conversation.', hi: 'व्यवहारिक उपाय (बुध के लिए सबसे शक्तिशाली): प्रतिदिन कम से कम 30 मिनट पठन — पुस्तकें, सोशल मीडिया नहीं। हर वर्ष नई भाषा या कौशल सीखें। पत्रिका रखें — लेखन सबसे प्रत्यक्ष बुध सक्रियकरण। पहेलियाँ सुलझाएँ, शतरंज खेलें। ईमानदार, स्पष्ट संवाद बनाये रखें — झूठ बुध को किसी पापी दृष्टि से अधिक दुर्बल करता है। नाड़ी शोधन प्राणायाम बुध को विशेष बलवान करता है। गपशप और तुच्छ बातचीत से बचें।' },
  timing: { en: 'Timing for mantra recitation: Wednesday during Mercury Hora (calculate based on sunrise — Mercury Hora is the first hour after sunrise on Wednesdays). Early morning (4:30-6:00 AM) when the mind is fresh is ideal. Face north while chanting. The 40-day period (mandala) should ideally begin on a Wednesday during Shukla Paksha when Mercury is not retrograde. If Mercury is in Gemini, Virgo, or Taurus in transit, remedies are especially effective.', hi: 'मन्त्र जाप का समय: बुधवार को बुध होरा में (सूर्योदय से गणना — बुधवार को सूर्योदय के बाद पहली होरा बुध की)। प्रातः (4:30-6:00 बजे) जब मन ताज़ा हो, आदर्श। जाप करते समय उत्तर दिशा। 40-दिवसीय अवधि (मण्डल) आदर्श रूप से शुक्ल पक्ष में बुधवार से शुरू जब बुध वक्री न हो। गोचर में बुध मिथुन, कन्या या वृषभ में हो तो उपाय विशेष प्रभावी।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'Budha (Mercury) was born from the union of Chandra (Moon) and Tara (the wife of Brihaspati/Jupiter). When Chandra abducted Tara, a cosmic war erupted between the Devas (led by Brihaspati) and Chandra\'s allies. Brahma intervened and returned Tara to Brihaspati, but she was already pregnant. The child born was Budha — so brilliant that both Chandra and Brihaspati claimed fatherhood. Tara revealed Chandra was the father. This mythological origin explains Mercury\'s complex relationships: enmity with Moon (abandoned by his father) and enmity with Jupiter (born from the abduction of Jupiter\'s wife). It also explains why Mercury is called Saumya (son of Soma/Moon).',
    hi: 'बुध (मर्करी) चन्द्र (सोम) और तारा (बृहस्पति की पत्नी) के मिलन से उत्पन्न हुए। जब चन्द्र ने तारा का अपहरण किया, देवताओं (बृहस्पति के नेतृत्व में) और चन्द्र के मित्रों के बीच ब्रह्मांडीय युद्ध छिड़ गया। ब्रह्मा ने हस्तक्षेप कर तारा को बृहस्पति को लौटाया, किन्तु वह गर्भवती थी। जन्मा बालक बुध — इतना तेजस्वी कि चन्द्र और बृहस्पति दोनों ने पितृत्व का दावा किया। तारा ने बताया चन्द्र पिता है।',
  },
  temples: {
    en: 'Major Budha temples: Thiruvenkadu (Tamil Nadu) — the Navagraha temple dedicated to Mercury, where the deity is called Swetharanyeswarar. This temple is considered the most powerful for Mercury remedies in South India. Budha Graha Temple in Brahmapuri (Maharashtra) is another significant center. Various Vishnu temples serve as Mercury remedy locations since Vishnu is the presiding deity of Budha. The Ranganathaswamy Temple (Srirangam) and Tirupati Balaji are especially recommended during Mercury dasha.',
    hi: 'प्रमुख बुध मन्दिर: तिरुवेंकाडु (तमिलनाडु) — बुध को समर्पित नवग्रह मन्दिर, जहाँ देवता श्वेतारण्येश्वर कहलाते हैं। दक्षिण भारत में बुध उपाय के लिए सबसे शक्तिशाली। ब्रह्मपुरी (महाराष्ट्र) में बुध ग्रह मन्दिर। विष्णु मन्दिर बुध उपाय स्थल — रंगनाथस्वामी मन्दिर (श्रीरंगम) और तिरुपति बालाजी बुध दशा में विशेष अनुशंसित।',
  },
  stotra: {
    en: 'The Budha Kavacham from Skanda Purana is the primary protective hymn. The Navagraha Stotra verse for Mercury: "Priyangukalikashyamam Rupenaaprotimam Budham, Saumyam Saumyagunopetam Tam Budham Pranamaamyaham" — "I bow to Mercury, dark as the priyangu flower bud, incomparable in form, gentle and endowed with gentle qualities." The Vishnu Sahasranama (1000 names of Vishnu) is the most comprehensive Mercury remedy text, as each name activates different aspects of Mercury\'s intellectual and communicative power.',
    hi: 'स्कन्द पुराण से बुध कवचम् प्राथमिक सुरक्षात्मक स्तुति है। नवग्रह स्तोत्र का बुध श्लोक: "प्रियंगुकलिकाश्यामं रूपेणाप्रतिमं बुधम्, सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम्" — "प्रियंगु कलिका के समान श्याम, रूप में अद्वितीय, सौम्य और सौम्य गुणों से युक्त बुध को प्रणाम।" विष्णु सहस्रनाम सबसे व्यापक बुध उपाय ग्रन्थ।',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Budhaditya Yoga — the most common and beneficial conjunction in Jyotish. When Mercury is within 12° of Sun (but not combust within ~14°), the intellect is illuminated by the soul\'s purpose. Produces educated professionals, government communicators, and public intellectuals. Mercury combust loses independent thinking — the native merely echoes authority.', hi: 'बुधादित्य योग — ज्योतिष में सबसे सामान्य और लाभकारी युति। सूर्य के 12° के भीतर बुध (किन्तु ~14° में अस्त नहीं) — बुद्धि आत्मा के उद्देश्य से प्रकाशित। अस्त बुध स्वतन्त्र चिन्तन खो देता है।' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Mercury considers Moon an enemy despite being Moon\'s son — the eternal conflict between intellect and emotion. Moon-Mercury conjunction creates tension between feeling and thinking. Can produce anxiety, overthinking, and emotional confusion. However, when well-aspected, creates excellent psychologists, counselors, and writers who bridge heart and mind.', hi: 'बुध चन्द्र को शत्रु मानता है, चन्द्र का पुत्र होते हुए भी — बुद्धि और भावना का शाश्वत संघर्ष। चन्द्र-बुध युति अनुभव और विचार के बीच तनाव। चिन्ता और अतिविचार। तथापि सुदृष्ट होने पर उत्कृष्ट मनोवैज्ञानिक और लेखक।' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Intellect versus action — Mars acts while Mercury analyzes. Their conjunction can produce skilled surgeons, forensic scientists, and military strategists. But also verbal aggression, intellectual bullying, and destructive debate. Mercury receives Mars as neutral but Mars considers Mercury an enemy — the warrior distrusts the diplomat.', hi: 'बुद्धि बनाम कर्म — मंगल कार्य करता है जबकि बुध विश्लेषण। युति कुशल शल्य चिकित्सक और सैन्य रणनीतिकार बना सकती है। मौखिक आक्रामकता भी। बुध मंगल को सम मानता है किन्तु मंगल बुध को शत्रु — योद्धा कूटनीतिज्ञ पर अविश्वास करता है।' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Scholar and guru — Mercury\'s analytical precision meets Jupiter\'s expansive wisdom. Can produce extraordinary teachers, philosophers, and legal scholars. However, Jupiter considers Mercury an enemy (rooted in the Tara-Chandra myth), creating an asymmetric relationship. Saraswati Yoga (Mercury-Jupiter-Venus in kendras/trikonas) produces unparalleled scholarship.', hi: 'विद्वान और गुरु — बुध की विश्लेषणात्मक सूक्ष्मता और गुरु का विशाल ज्ञान। असाधारण शिक्षक और दार्शनिक बना सकता है। गुरु बुध को शत्रु मानता है (तारा-चन्द्र कथा)। सरस्वती योग अद्वितीय विद्वत्ता देता है।' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Commerce and art united — Mercury-Venus conjunction creates elegant communication, artistic writing, and commercial creativity. Produces graphic designers, advertising professionals, fashion writers, and luxury marketers. Both planets are friends and their combination is harmonious. Can indicate skilled musicians who also understand music theory and business.', hi: 'वाणिज्य और कला एकजुट — बुध-शुक्र युति सुरुचिपूर्ण संवाद, कलात्मक लेखन और वाणिज्यिक सृजनात्मकता। ग्राफिक डिज़ाइनर, विज्ञापन पेशेवर और फैशन लेखक। दोनों मित्र ग्रह — सामंजस्यपूर्ण संयोजन।' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Discipline meets intellect — Mercury-Saturn conjunction creates methodical, structured thinking and exceptional concentration. Produces serious scholars, researchers, and administrators. Can indicate delayed education or speech difficulties in early life, but later mastery. The native thinks slowly but accurately. Good for accounting, architecture, and any field requiring sustained intellectual discipline over decades.', hi: 'अनुशासन और बुद्धि — बुध-शनि युति व्यवस्थित, संरचित सोच और असाधारण एकाग्रता। गम्भीर विद्वान, शोधकर्ता और प्रशासक। शिक्षा में विलम्ब किन्तु बाद में दक्षता। धीमी किन्तु सटीक सोच। लेखा और वास्तुकला के लिए शुभ।' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Mercury-Rahu conjunction amplifies intellectual capacity but adds obsession, deception risk, and unconventional thinking. Can produce tech geniuses, hackers, foreign language experts, and master manipulators. The native thinks outside every box — sometimes brilliantly, sometimes dangerously. Strong placement for software engineering, cryptography, and cross-cultural communication.', hi: 'बुध-राहु युति बौद्धिक क्षमता प्रवर्धित किन्तु जुनून और धोखे का जोखिम। टेक प्रतिभा, हैकर, विदेशी भाषा विशेषज्ञ और निपुण रणनीतिकार। हर सीमा के बाहर सोचता है। सॉफ्टवेयर अभियान्त्रिकी और क्रिप्टोग्राफी के लिए सशक्त।' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Mercury-Ketu conjunction creates an intuitive but disconnected intellect. The native may have unusual intellectual gifts — savant-like abilities in mathematics, languages, or pattern recognition — but struggle with practical communication. Past-life intellectual karma manifests as innate knowledge. Strong for astrology, metaphysics, and abstract mathematics. Can indicate speech peculiarities or eccentric communication style.', hi: 'बुध-केतु युति अन्तर्ज्ञानी किन्तु विच्छिन्न बुद्धि। असामान्य बौद्धिक उपहार — गणित, भाषा या पैटर्न पहचान में विशेष योग्यता। पूर्वजन्म की बौद्धिक कर्मफल। ज्योतिष, तत्त्वमीमांसा और अमूर्त गणित के लिए सशक्त। वाक् विशेषताएँ सम्भव।' } },
];

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/surya', label: { en: 'Surya — The Sun', hi: 'सूर्य' } },
  { href: '/learn/chandra', label: { en: 'Chandra — The Moon', hi: 'चन्द्र' } },
  { href: '/learn/mangal', label: { en: 'Mangal — Mars', hi: 'मंगल' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/combustion', label: { en: 'Planetary Combustion', hi: 'ग्रह अस्त' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Jyotish', hi: 'ज्योतिष में योग' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function BudhaPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-mercury/15 border border-graha-mercury/30 mb-4">
          <span className="text-4xl">☿</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Budha — Mercury', hi: 'बुध — बुध ग्रह' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'Vakkaraka — the significator of speech and intellect, the prince of planets, the master of commerce and communication in Vedic astrology.', hi: 'वाक्कारक — वाणी और बुद्धि का कारक, ग्रहों का राजकुमार, वैदिक ज्योतिष में वाणिज्य और संवाद का स्वामी।' })}
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
        <p style={bf}>{ml({ en: 'Budha is the prince (Kumara) of the Navagrahas, the intellect (Buddhi) of the Kaal Purusha, and the planet that governs all forms of communication, commerce, and rational thought. He is unique among the Navagrahas as a truly dual-natured planet — he becomes benefic with benefics and malefic with malefics, reflecting the nature of intellect itself, which can be used for creation or destruction. He represents the maternal uncle, merchants, students, and scribes. Mercury governs the nervous system, speech, mathematical ability, and the capacity to learn, adapt, and exchange information. In the modern world, Mercury rules technology, coding, social media, and the entire information economy.', hi: 'बुध नवग्रहों का राजकुमार (कुमार), काल पुरुष की बुद्धि, और संवाद, वाणिज्य और तर्कशील विचार के सभी रूपों का शासक है। वह नवग्रहों में अद्वितीय है — शुभों के साथ शुभ, पापियों के साथ पापी। वह मामा, व्यापारी, विद्यार्थी और लिपिक का प्रतिनिधित्व करता है। बुध तन्त्रिका तन्त्र, वाणी, गणित और सीखने की क्षमता का शासन करता है।' })}</p>
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

      {/* ── 2. Astronomical Profile ── */}
      <LessonSection number={next()} title={ml({ en: 'Astronomical Profile', hi: 'खगोलीय परिचय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Understanding Mercury\'s astronomical behavior reveals why it behaves the way it does in Jyotish — the fastest orbit, most frequent retrograde, and closest proximity to the Sun all have direct astrological consequences.', hi: 'बुध के खगोलीय व्यवहार को समझने से पता चलता है कि यह ज्योतिष में जैसा व्यवहार करता है वैसा क्यों — सबसे तेज़ कक्षा, सबसे बार-बार वक्री और सूर्य से निकटतम — सभी के प्रत्यक्ष ज्योतिषीय परिणाम हैं।' })}</p>
        <div className="space-y-3">
          {Object.entries(ASTRONOMICAL).map(([key, val]) => (
            <div key={key} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="Surya Siddhanta" chapter="Mercury Orbital Parameters" />
      </LessonSection>

      {/* ── 3. Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Dignities & Strength', hi: 'गरिमा एवं बल' })}>
        <p style={bf}>{ml({ en: 'Mercury\'s dignity determines whether the intellect operates at peak precision or drowns in confusion. In Virgo at 15°, Mercury is exalted — the analytical mind achieves perfection, processing information with flawless accuracy. In Pisces at 15°, Mercury is debilitated — rational thought dissolves in imagination and intuition, which can be either visionary or delusional. Mercury uniquely has its exaltation and own sign in the same sign (Virgo), meaning the 16°-20° range (moolatrikona) is where Mercury expresses its purest analytical nature.', hi: 'बुध की गरिमा यह निर्धारित करती है कि बुद्धि चरम सूक्ष्मता पर काम करती है या भ्रम में डूबती है। कन्या 15° में बुध उच्च — विश्लेषणात्मक मन सूचना को दोषरहित सटीकता से संसाधित करता है। मीन 15° में नीच — तर्कशील विचार कल्पना में विलीन। बुध की उच्च और स्वराशि एक ही राशि (कन्या) में — अद्वितीय।' })}</p>
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

      {/* ── 4. Mercury in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Mercury in the Twelve Signs', hi: 'बारह राशियों में बुध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mercury\'s sign placement determines the style of thinking, communication, and learning. In air signs (Gemini, Libra, Aquarius), Mercury is most communicative and social. In earth signs (Taurus, Virgo, Capricorn), Mercury is practical and detail-oriented. In fire signs (Aries, Leo, Sagittarius), Mercury thinks boldly but impulsively. In water signs (Cancer, Scorpio, Pisces), Mercury thinks through intuition and emotion rather than pure logic.', hi: 'बुध की राशि स्थिति सोच, संवाद और सीखने की शैली निर्धारित करती है। वायु राशियों में सबसे संवादशील। पृथ्वी राशियों में व्यावहारिक और विवरण-उन्मुख। अग्नि राशियों में साहसिक किन्तु आवेगी। जल राशियों में अन्तर्ज्ञान और भावना से।' })}</p>
        {MERCURY_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(s.sign)}</span>
              {s.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  s.dignity.includes('Exalted') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  s.dignity === 'Debilitated' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  s.dignity === 'Own sign' || s.dignity.includes('Own sign') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  s.dignity.includes('Friend') ? 'bg-gold-primary/10 border-gold-primary/30 text-gold-light' :
                  s.dignity.includes('Enemy') ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{s.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(s.effect)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 5. Mercury in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Mercury in the Twelve Houses', hi: 'बारह भावों में बुध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The house placement determines the life domain where Mercury\'s intellectual energy concentrates. Mercury is naturally strong in the 1st and 10th houses for career and personality. In the 3rd house (communication), Mercury finds its most natural expression. Bhavartha Ratnakara notes that Mercury in kendras gives sharp intelligence, in trikonas gives scholarly wisdom, and in upachayas improves commercial acumen with age.', hi: 'भाव स्थिति यह निर्धारित करती है कि बुध की बौद्धिक ऊर्जा जीवन के किस क्षेत्र में केन्द्रित होती है। करियर और व्यक्तित्व के लिए पहले और दशम भाव में स्वाभाविक रूप से सशक्त। तृतीय भाव (संवाद) में सबसे स्वाभाविक अभिव्यक्ति। केन्द्रों में तीक्ष्ण बुद्धि, त्रिकोणों में विद्वत्ता।' })}</p>
        {MERCURY_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-mercury/15 border border-graha-mercury/30 flex items-center justify-center text-graha-mercury text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Planets in Houses)" />
      </LessonSection>

      {/* ── 6. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Budha Mahadasha (17 Years)', hi: 'बुध महादशा (17 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Mercury Dasha', hi: 'बलवान बुध दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongMercury)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Mercury Dasha', hi: 'दुर्बल बुध दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakMercury)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 7. Notable Yogas ── */}
      <LessonSection number={next()} title={ml({ en: 'Notable Yogas Involving Mercury', hi: 'बुध से सम्बन्धित प्रमुख योग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mercury participates in several important yogas that can dramatically elevate or distort the native\'s intellectual and commercial potential. Understanding these yogas helps distinguish a chart with strong Mercury influence from one where Mercury merely occupies a position.', hi: 'बुध कई महत्त्वपूर्ण योगों में भाग लेता है जो जातक की बौद्धिक और वाणिज्यिक क्षमता को नाटकीय रूप से ऊँचा या विकृत कर सकते हैं। इन योगों को समझने से बलवान बुध प्रभाव वाली कुण्डली और केवल स्थान भरने वाले बुध में अन्तर स्पष्ट होता है।' })}</p>
        {NOTABLE_YOGAS.map((yoga, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/25 via-[#1a1040]/30 to-[#0a0e27] border border-graha-mercury/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-base mb-2" style={hf}>{ml(yoga.name)}</h4>
            <div className="space-y-2">
              <div>
                <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{ml({ en: 'Condition', hi: 'शर्त' })}</span>
                <p className="text-text-primary text-sm mt-1" style={bf}>{ml(yoga.condition)}</p>
              </div>
              <div>
                <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{ml({ en: 'Effect', hi: 'फल' })}</span>
                <p className="text-text-primary text-sm mt-1" style={bf}>{ml(yoga.effect)}</p>
              </div>
              <div>
                <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{ml({ en: 'Strength Assessment', hi: 'बल आकलन' })}</span>
                <p className="text-text-secondary text-sm mt-1" style={bf}>{ml(yoga.strength)}</p>
              </div>
            </div>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 34-36 — Yoga Adhyaya" />
      </LessonSection>

      {/* ── 8. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Knowing Mercury\'s theoretical significations is only the first step. The real skill lies in assessing Mercury\'s functional strength in an individual chart and translating that assessment into actionable life guidance.', hi: 'बुध के सैद्धान्तिक कारकत्व जानना केवल पहला कदम है। वास्तविक कौशल व्यक्तिगत कुण्डली में बुध के कार्यात्मक बल का आकलन और उसे क्रियाशील जीवन मार्गदर्शन में रूपान्तरित करना है।' })}</p>

        <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-5 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'How to Assess Mercury\'s Strength', hi: 'बुध के बल का आकलन कैसे करें' })}</h4>
          <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.assessStrength)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Mercury Indicators', hi: 'बलवान बुध के संकेत' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PRACTICAL.strongIndicators)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Mercury Indicators', hi: 'दुर्बल बुध के संकेत' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PRACTICAL.weakIndicators)}</p>
          </div>
        </div>

        <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'When to Seek Remedies', hi: 'उपाय कब करें' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(PRACTICAL.whenToRemediate)}</p>
        </div>

        <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(PRACTICAL.misconceptions)}</p>
        </div>

        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-graha-mercury/15 rounded-xl p-5">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Budhaditya Yoga — Deep Dive', hi: 'बुधादित्य योग — गहन विश्लेषण' })}</h4>
          <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.budhadityaDetail)}</p>
        </div>
      </LessonSection>

      {/* ── 9. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mercury\'s relationships reveal the intellect\'s alliances and conflicts. His friendship with Sun (Budhaditya Yoga) and Venus (commercial artistry) forms the axis of communicative power. His enmity with Moon reflects the deep tension between rational analysis and emotional intuition. Mercury\'s dual nature means he takes on the character of whichever planet he associates with — making his conjunctions uniquely variable in their effects.', hi: 'बुध के सम्बन्ध बुद्धि के गठबन्धन और संघर्ष प्रकट करते हैं। सूर्य (बुधादित्य योग) और शुक्र (वाणिज्यिक कलात्मकता) से मैत्री संवादात्मक शक्ति की धुरी। चन्द्र से शत्रुता तर्कशील विश्लेषण और भावनात्मक अन्तर्ज्ञान के गहरे तनाव का प्रतिबिम्ब। बुध का द्वैत स्वभाव उसकी युतियों को अद्वितीय रूप से परिवर्तनशील बनाता है।' })}</p>
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

      {/* ── 10. Remedies ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies for Mercury', hi: 'बुध के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Remedies are prescribed when Mercury is weak, combust, debilitated, or afflicted by malefics. A strong Mercury thrives when the native engages in continuous learning, reading, writing, and intellectual stimulation. The best Mercury remedy is education itself. Consult a qualified Jyotishi before wearing gemstones — an incorrectly prescribed Emerald can amplify nervous anxiety and overthinking.', hi: 'उपाय तब निर्धारित किये जाते हैं जब बुध दुर्बल, अस्त, नीच या पापग्रहों से पीड़ित हो। बलवान बुध निरन्तर शिक्षा, पठन, लेखन और बौद्धिक उत्तेजना से फलता-फूलता है। सबसे अच्छा बुध उपाय स्वयं शिक्षा है। रत्न धारण से पूर्व ज्योतिषी से परामर्श अनिवार्य।' })}</p>

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
          { key: 'gemstone', title: { en: 'Gemstone — Emerald (Panna)', hi: 'रत्न — पन्ना' } },
          { key: 'charity', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', title: { en: 'Worship — Vishnu', hi: 'पूजा — विष्णु' } },
          { key: 'yantra', title: { en: 'Budha Yantra', hi: 'बुध यन्त्र' } },
          { key: 'dietary', title: { en: 'Dietary Recommendations', hi: 'आहार अनुशंसाएँ' } },
          { key: 'colorTherapy', title: { en: 'Color Therapy', hi: 'रंग चिकित्सा' } },
          { key: 'behavioral', title: { en: 'Behavioral Remedies', hi: 'व्यवहारिक उपाय' } },
          { key: 'timing', title: { en: 'Optimal Timing for Mantra', hi: 'मन्त्र जाप का उत्तम समय' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-3">
            <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'Mercury remedies work best when combined with intellectual discipline: reading daily, learning a new skill or language, maintaining a journal, engaging in structured conversation, and keeping the mind sharp through puzzles, mathematics, or strategic games. A dull mind weakens Mercury more than any malefic aspect.', hi: 'बुध उपाय बौद्धिक अनुशासन के साथ सबसे अच्छे काम करते हैं: दैनिक पठन, नया कौशल या भाषा सीखना, पत्रिका बनाना, संरचित संवाद, पहेलियों या रणनीतिक खेलों से मन को तीक्ष्ण रखना। मन्द मन बुध को किसी पापग्रह दृष्टि से अधिक दुर्बल करता है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 11. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Worship', hi: 'पौराणिक कथा एवं उपासना' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Origin Story', hi: 'उत्पत्ति कथा' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.origin)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Budha Stotra & Kavacham', hi: 'बुध स्तोत्र एवं कवचम्' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.stotra)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples', hi: 'पवित्र मन्दिर' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
        </div>
        <ClassicalReference shortName="Skanda Purana" chapter="Budha Kavacham" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Mercury is Vakkaraka — the speech significator. Its placement reveals your intellectual style, communication ability, and commercial aptitude.', hi: 'बुध वाक्कारक है — इसकी स्थिति आपकी बौद्धिक शैली, संवाद क्षमता और वाणिज्यिक योग्यता प्रकट करती है।' }),
        ml({ en: 'Exalted in Virgo (15°), debilitated in Pisces (15°). Own signs Gemini & Virgo. Moolatrikona Virgo 16°-20°.', hi: 'कन्या 15° में उच्च, मीन 15° में नीच। स्वराशि मिथुन और कन्या। मूलत्रिकोण कन्या 16°-20°।' }),
        ml({ en: 'Friends: Sun, Venus. Enemy: Moon. Mercury is the only truly dual-natured planet — benefic with benefics, malefic with malefics.', hi: 'मित्र: सूर्य, शुक्र। शत्रु: चन्द्र। बुध एकमात्र वास्तविक द्वैत स्वभाव ग्रह — शुभों के साथ शुभ, पापियों के साथ पापी।' }),
        ml({ en: 'Mahadasha: 17 years. Remedy: Emerald, green moong/books charity, Wednesday fasting, Vishnu Sahasranama.', hi: 'महादशा: 17 वर्ष। उपाय: पन्ना, मूँग/पुस्तकें दान, बुधवार व्रत, विष्णु सहस्रनाम।' }),
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
