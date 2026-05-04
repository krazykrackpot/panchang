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
  { devanagari: 'गुरु', transliteration: 'Guru', meaning: { en: 'The great teacher — dispeller of darkness', hi: 'महान गुरु — अन्धकार का नाशक' } },
  { devanagari: 'बृहस्पति', transliteration: 'Brihaspati', meaning: { en: 'Lord of sacred speech (prayer)', hi: 'वाचस्पति — पवित्र वाणी के स्वामी' } },
  { devanagari: 'देवगुरु', transliteration: 'Devaguru', meaning: { en: 'Preceptor of the gods', hi: 'देवताओं के गुरु' } },
  { devanagari: 'धर्मकारक', transliteration: 'Dharmakāraka', meaning: { en: 'Significator of righteousness', hi: 'धर्म का कारक' } },
  { devanagari: 'पुत्रकारक', transliteration: 'Putrakāraka', meaning: { en: 'Significator of children', hi: 'सन्तान का कारक' } },
  { devanagari: 'जीव', transliteration: 'Jīva', meaning: { en: 'The life force, the living principle', hi: 'जीवनशक्ति, प्राणतत्त्व' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Cancer (Karka) — deepest exaltation at 5°', hi: 'कर्क — 5° पर परम उच्च' },
  debilitation: { en: 'Capricorn (Makara) — deepest debilitation at 5°', hi: 'मकर — 5° पर परम नीच' },
  ownSign: { en: 'Sagittarius (Dhanu) & Pisces (Meena)', hi: 'धनु एवं मीन' },
  moolatrikona: { en: 'Sagittarius 0°–10°', hi: 'धनु 0°–10°' },
  friends: { en: 'Sun, Moon, Mars', hi: 'सूर्य, चन्द्र, मंगल' },
  enemies: { en: 'Mercury, Venus', hi: 'बुध, शुक्र' },
  neutral: { en: 'Saturn', hi: 'शनि' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Guru, teacher, priest, judge, elder, husband (for women), children, advisor', hi: 'गुरु, शिक्षक, पुरोहित, न्यायाधीश, वृद्ध, पति (स्त्री के लिए), सन्तान, सलाहकार' },
  bodyParts: { en: 'Liver, fat tissue, hips, thighs, arterial system, pancreas, gallbladder', hi: 'यकृत, वसा ऊतक, कूल्हे, जाँघें, धमनी तन्त्र, अग्न्याशय, पित्ताशय' },
  professions: { en: 'Teaching, law, priesthood, banking, consultancy, philosophy, judiciary, ministry', hi: 'शिक्षण, विधि, पुरोहिती, बैंकिंग, परामर्श, दर्शन, न्यायपालिका, मन्त्रित्व' },
  materials: { en: 'Gold, topaz, yellow sapphire (Pukhraj), turmeric, saffron, sandalwood, ghee', hi: 'स्वर्ण, पुखराज, हल्दी, केसर, चन्दन, घी' },
  direction: { en: 'North-East (Ishanya)', hi: 'ईशान (उत्तर-पूर्व)' },
  day: { en: 'Thursday (Guruvara / Brihaspativara)', hi: 'गुरुवार / बृहस्पतिवार' },
  color: { en: 'Yellow / Golden', hi: 'पीला / स्वर्ण वर्ण' },
  season: { en: 'Hemanta (Pre-winter)', hi: 'हेमन्त ऋतु' },
  taste: { en: 'Sweet (Madhura)', hi: 'मधुर' },
  guna: { en: 'Sattva', hi: 'सत्त्व' },
  element: { en: 'Ether / Space (Akasha)', hi: 'आकाश तत्त्व' },
  gender: { en: 'Masculine', hi: 'पुल्लिंग' },
  nature: { en: 'Natural Benefic (Shubha Graha) — the greatest benefic among all planets', hi: 'स्वाभाविक शुभ ग्रह — सभी ग्रहों में सबसे बड़ा शुभ' },
};

// ─── Jupiter in 12 Signs ──────────────────────────────────────────────
const JUPITER_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: "Friend's sign",
    effect: { en: 'Jupiter in Mars\'s fire sign creates a dynamic spiritual warrior. The native possesses strong moral convictions backed by decisive action. Excellent for teaching, preaching, and leading dharmic causes. Natural enthusiasm for philosophy and higher learning. Can be overly righteous or preachy if unchecked. Children are likely to be courageous and independent. This placement produces inspiring leaders who combine wisdom with bold initiative — think of a guru who leads from the front rather than the armchair.', hi: 'मंगल की अग्नि राशि में गुरु एक गतिशील आध्यात्मिक योद्धा बनाता है। जातक में दृढ़ नैतिक विश्वास होता है जो निर्णायक कर्म से समर्थित है। शिक्षण, प्रवचन और धार्मिक कार्यों के नेतृत्व के लिए उत्कृष्ट। दर्शन और उच्च शिक्षा के प्रति स्वाभाविक उत्साह। अनियन्त्रित होने पर अत्यधिक धर्मोपदेशक हो सकता है।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: "Enemy's sign",
    effect: { en: 'Jupiter in Venus\'s earth sign brings wisdom to material matters. The native accumulates wealth steadily and enjoys the finer things in life with a philosophical perspective. A natural banker, financial advisor, or art collector. Speech is sweet and persuasive. However, Jupiter here can become overly attached to comfort and possessions, losing its spiritual edge. The challenge is to use abundance as a tool for dharma rather than an end in itself. Good for family life and culinary arts.', hi: 'शुक्र की पृथ्वी राशि में गुरु भौतिक मामलों में ज्ञान लाता है। जातक स्थिर रूप से धन संचय करता है और दार्शनिक दृष्टिकोण से जीवन की श्रेष्ठ वस्तुओं का आनन्द लेता है। स्वाभाविक बैंकर, वित्तीय सलाहकार। वाणी मधुर और प्रभावशाली। किन्तु सुख-सुविधा से अत्यधिक आसक्ति हो सकती है।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: "Enemy's sign",
    effect: { en: 'Jupiter in Mercury\'s air sign creates a brilliant communicator and intellectual teacher. The native can explain complex philosophical concepts in simple, engaging language. Prolific writer, translator, or media personality. However, wisdom may become superficial — knowledge of many things without depth in any. The mind is restless, always seeking new information. Can excel in publishing, journalism, and comparative religion. Multiple sources of income through intellectual work.', hi: 'बुध की वायु राशि में गुरु एक प्रतिभाशाली संवादक और बौद्धिक शिक्षक बनाता है। जातक जटिल दार्शनिक अवधारणाओं को सरल भाषा में समझा सकता है। विपुल लेखक, अनुवादक। किन्तु ज्ञान सतही हो सकता है — कई विषयों का ज्ञान किन्तु किसी में गहराई नहीं। प्रकाशन और पत्रकारिता में श्रेष्ठ।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: 'Exalted',
    effect: { en: 'Jupiter is exalted here — the greatest benefic in the sign of the nurturing Moon. This is the pinnacle of Jupiterian energy: boundless compassion, deep intuitive wisdom, and natural ability to guide and protect others. The native becomes a true guru figure — one who nourishes souls. Exceptional emotional intelligence. Wealth flows naturally. Children bring immense joy. The 5° point is the deepest exaltation. This placement produces saints, great teachers, and philanthropists. Family life is rich and spiritually fulfilling. The mother is often a deeply wise person.', hi: 'गुरु यहाँ उच्च है — पोषक चन्द्र की राशि में सबसे बड़ा शुभ ग्रह। यह गुरु ऊर्जा का शिखर है: असीम करुणा, गहन अन्तर्ज्ञान, और दूसरों का मार्गदर्शन करने की स्वाभाविक क्षमता। जातक सच्चा गुरु बनता है। असाधारण भावनात्मक बुद्धि। धन स्वाभाविक रूप से आता है। सन्तान अपार आनन्द देती है। 5° पर परम उच्च। यह स्थिति सन्त, महान शिक्षक और परोपकारी उत्पन्न करती है।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: "Friend's sign",
    effect: { en: 'Jupiter in the Sun\'s royal sign creates a magnificent, generous, and dignified personality. The native teaches and leads with charisma and authority. Strong moral courage to stand for truth in public. Excellent for politics, administration, and high-level advisory roles. The guru becomes the king\'s counselor. Children may be talented and distinguished. Creative expression carries a philosophical depth. Can become pompous or overly dramatic if afflicted. Religious and spiritual life is lived openly, not privately.', hi: 'सूर्य की राजसी राशि में गुरु एक भव्य, उदार और गरिमापूर्ण व्यक्तित्व बनाता है। जातक करिश्मे और अधिकार के साथ शिक्षण और नेतृत्व करता है। सार्वजनिक रूप से सत्य के लिए खड़े होने का नैतिक साहस। राजनीति, प्रशासन और उच्च-स्तरीय सलाहकार भूमिकाओं के लिए उत्कृष्ट। सन्तान प्रतिभाशाली और विशिष्ट हो सकती है।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: "Enemy's sign",
    effect: { en: 'Jupiter in Mercury\'s analytical earth sign produces a meticulous scholar. Wisdom is expressed through precision, service, and practical application. Excellent for research, medicine (especially Ayurveda), and detailed scriptural study. The native may become a health-conscious teacher or a medical practitioner with spiritual depth. However, Jupiter\'s expansive nature is constrained by Virgo\'s love of detail — the big picture can get lost in minutiae. Criticism may replace compassion. Children may come late or require extra care.', hi: 'बुध की विश्लेषणात्मक पृथ्वी राशि में गुरु एक सूक्ष्म विद्वान बनाता है। ज्ञान सूक्ष्मता, सेवा और व्यावहारिक अनुप्रयोग से अभिव्यक्त होता है। शोध, चिकित्सा (विशेषकर आयुर्वेद) और विस्तृत शास्त्र अध्ययन के लिए उत्कृष्ट। किन्तु गुरु का विस्तारशील स्वभाव कन्या की विस्तार-प्रियता से बाधित होता है। आलोचना करुणा का स्थान ले सकती है।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: "Enemy's sign",
    effect: { en: 'Jupiter in Venus\'s air sign brings wisdom to partnerships and social harmony. The native seeks justice, fairness, and balance in all things. Excellent for law, diplomacy, and mediation. Marriage partner is often educated and cultured. However, Jupiter\'s moral absolutism conflicts with Libra\'s desire to please everyone. Indecisiveness in matters of dharma. Can produce skilled negotiators, marriage counselors, and international lawyers. Artistic taste is refined and expansive — collecting beautiful things with philosophical discernment.', hi: 'शुक्र की वायु राशि में गुरु साझेदारियों और सामाजिक सामंजस्य में ज्ञान लाता है। जातक सभी बातों में न्याय, निष्पक्षता और सन्तुलन चाहता है। विधि, कूटनीति और मध्यस्थता के लिए उत्कृष्ट। विवाह साथी प्रायः शिक्षित और संस्कृत। किन्तु गुरु का नैतिक पूर्णतावाद तुला की सबको प्रसन्न करने की इच्छा से टकराता है।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: "Friend's sign",
    effect: { en: 'Jupiter in Mars\'s water sign creates a deeply transformative spiritual seeker. The native dives into the occult, tantra, and hidden knowledge with insatiable curiosity. Powerful healer and psychologist. Research into ancient texts and esoteric sciences comes naturally. Inheritance and sudden gains through legacy. Jupiter here brings light into the darkest places — the guru who understands suffering because they have walked through it. Can be secretive about their spiritual knowledge. Excellent for surgery, psychiatry, and investigative research.', hi: 'मंगल की जल राशि में गुरु एक गहन परिवर्तनकारी आध्यात्मिक साधक बनाता है। जातक गूढ़, तन्त्र और गुप्त ज्ञान में अतृप्त जिज्ञासा से डूबता है। शक्तिशाली चिकित्सक और मनोवैज्ञानिक। प्राचीन ग्रन्थों और गूढ़ विज्ञान में शोध स्वाभाविक। विरासत और अचानक लाभ। गुरु यहाँ अन्धकारतम स्थानों में प्रकाश लाता है।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Own sign (Moolatrikona)',
    effect: { en: 'Jupiter in its own fire sign — the archer hitting the cosmic target. This is Jupiter at its most natural: philosophical, optimistic, truthful, and expansive. The native is a born teacher, preacher, and moral authority. Higher education, law, religion, and international affairs are natural domains. The first 10° is Moolatrikona — even stronger than own-sign dignity. Long-distance travel for dharmic purposes. Multiple children who excel in education. The guru who inspires entire communities. Can be dogmatic or overconfident in beliefs.', hi: 'गुरु अपनी अग्नि राशि में — अपने सबसे स्वाभाविक रूप में: दार्शनिक, आशावादी, सत्यनिष्ठ और विस्तारशील। जातक जन्मजात शिक्षक, प्रवचनकर्ता और नैतिक प्राधिकारी है। उच्च शिक्षा, विधि, धर्म और अन्तर्राष्ट्रीय मामले स्वाभाविक क्षेत्र। प्रथम 10° मूलत्रिकोण — स्वराशि से भी बलवान। धार्मिक उद्देश्यों हेतु दीर्घ यात्रा। सम्पूर्ण समुदायों को प्रेरित करने वाला गुरु।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: 'Debilitated',
    effect: { en: 'Jupiter is debilitated here — the guru forced into corporate servitude. Saturn\'s pragmatic earth sign constrains Jupiter\'s expansiveness. Faith is tested by harsh realities. The native may be wise about practical matters but spiritually dry. Children face delays or difficulties. However, Neecha Bhanga (cancellation) is common and can produce exceptionally practical spiritual leaders — gurus who build institutions rather than just preach. The 5° point is the deepest fall. Material success may come at the cost of inner fulfillment. Can produce skilled financial managers who understand karmic accounting.', hi: 'गुरु यहाँ नीच है — शनि की व्यावहारिक पृथ्वी राशि गुरु के विस्तार को बाधित करती है। कठोर यथार्थ से विश्वास की परीक्षा। जातक व्यावहारिक मामलों में बुद्धिमान किन्तु आध्यात्मिक रूप से शुष्क हो सकता है। सन्तान में विलम्ब। तथापि नीच भंग सामान्य है और असाधारण व्यावहारिक आध्यात्मिक नेता उत्पन्न कर सकता है। 5° पर सबसे गहरी नीचता।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: 'Neutral',
    effect: { en: 'Jupiter in Saturn\'s air sign brings a humanitarian, progressive approach to wisdom. The native teaches through social networks, technology, and collective movements. Unconventional spiritual beliefs. Interest in astrology, futurism, and social reform. Can produce revolutionary thinkers, tech-savvy teachers, and community organizers. Large social circles with diverse philosophical leanings. Children may be independent and unconventional. Scientific temperament applied to spiritual questions. The guru of the digital age.', hi: 'शनि की वायु राशि में गुरु ज्ञान के प्रति मानवतावादी, प्रगतिशील दृष्टिकोण लाता है। जातक सामाजिक नेटवर्क, प्रौद्योगिकी और सामूहिक आन्दोलनों से शिक्षण करता है। अपरम्परागत आध्यात्मिक विश्वास। ज्योतिष, भविष्यवाद और सामाजिक सुधार में रुचि। क्रान्तिकारी विचारक और समुदाय संगठक उत्पन्न कर सकता है।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Own sign',
    effect: { en: 'Jupiter in its own water sign — the sage in the ashram. This is Jupiter\'s most spiritual and compassionate placement. The native possesses deep intuitive wisdom, boundless empathy, and natural healing ability. Excellent for spiritual teaching, music, art therapy, and charitable work. Dreams carry prophetic significance. Connection to ancient wisdom traditions is strong. Children are spiritually inclined. Can produce mystics, saints, and great charitable leaders. The danger is escapism — Jupiter\'s optimism in Pisces can become avoidance of practical reality.', hi: 'गुरु अपनी जल राशि में — आश्रम में ऋषि। यह गुरु की सबसे आध्यात्मिक और करुणामय स्थिति है। जातक में गहन अन्तर्ज्ञान, असीम सहानुभूति और स्वाभाविक उपचार क्षमता। आध्यात्मिक शिक्षण, संगीत, कला चिकित्सा और दानकर्म के लिए उत्कृष्ट। स्वप्न भविष्यसूचक। प्राचीन ज्ञान परम्पराओं से गहरा सम्बन्ध। रहस्यवादी, सन्त उत्पन्न कर सकता है।' } },
];

// ─── Jupiter in 12 Houses ─────────────────────────────────────────────
const JUPITER_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'One of the most auspicious placements in all of Jyotish. The native is wise, optimistic, generous, and naturally commands respect. Physical body tends to be large or well-built. Strong moral compass guides all actions. Teachers, priests, and mentors are drawn to the native from childhood. Can produce overconfidence or weight gain. Jupiter aspects the 5th (children, intelligence), 7th (marriage), and 9th (dharma) from here — blessing all three areas simultaneously. This is the hallmark of a blessed life.', hi: 'सम्पूर्ण ज्योतिष में सबसे शुभ स्थितियों में। जातक बुद्धिमान, आशावादी, उदार और स्वाभाविक रूप से सम्मान प्राप्त करता है। शारीरिक संरचना बड़ी या सुदृढ़। प्रबल नैतिक दिशा सभी कार्यों का मार्गदर्शन करती है। गुरु यहाँ से 5वें, 7वें और 9वें भाव को देखता है — तीनों क्षेत्रों को एक साथ आशीर्वाद।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Wealth through knowledge, teaching, and moral authority. Sweet and persuasive speech that commands respect. The native earns through education, consultancy, banking, or religious institutions. Family values are strong and traditional. Multiple sources of income. Can accumulate gold, precious stones, and luxury items. Food preferences tend toward sweet and rich. This placement blesses family lineage with prosperity. Speech carries wisdom — when this person speaks, others listen and believe.', hi: 'ज्ञान, शिक्षण और नैतिक अधिकार से धन। मधुर और प्रभावशाली वाणी। शिक्षा, परामर्श, बैंकिंग या धार्मिक संस्थाओं से कमाई। पारिवारिक मूल्य दृढ़ और पारम्परिक। आय के अनेक स्रोत। स्वर्ण, रत्न और विलासिता का संचय। वाणी में ज्ञान — जब यह व्यक्ति बोलता है, लोग सुनते और विश्वास करते हैं।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Jupiter in the 3rd gives intellectual courage and skill in communication. The native is a natural writer, publisher, or media personality with a philosophical bent. Younger siblings may be prosperous. Short journeys bring knowledge and opportunity. However, the 3rd is an upachaya (growth) house — Jupiter\'s beneficence grows with age here. Can produce religious authors, scriptural commentators, and spiritual bloggers. Hands are skilled in sacred arts. Initiative in dharmic matters is strong.', hi: 'तृतीय भाव में गुरु बौद्धिक साहस और संवाद कौशल देता है। जातक दार्शनिक दृष्टिकोण वाला स्वाभाविक लेखक, प्रकाशक। छोटे भाई-बहन समृद्ध हो सकते हैं। लघु यात्राएँ ज्ञान और अवसर लाती हैं। 3rd उपचय भाव है — गुरु की शुभता आयु के साथ बढ़ती है। धार्मिक लेखक और शास्त्र भाष्यकार उत्पन्न कर सकता है।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'Blessed home life, comfortable vehicles, and a spiritually enriching domestic environment. The mother is wise and religious. The native owns large properties or estates. Academic achievements are strong — Jupiter blesses formal education here. Emotional security is rooted in dharmic values. Can indicate a home library, a personal temple, or a teaching studio. The heart is at peace. This is a Kendra placement — Jupiter here forms one of the most powerful Gajakesari conditions (if Moon is also angular). Late life is prosperous and serene.', hi: 'आशीर्वादित गृहस्थ जीवन, आरामदायक वाहन और आध्यात्मिक रूप से समृद्ध घरेलू वातावरण। माता बुद्धिमान और धार्मिक। बड़ी सम्पत्तियों का स्वामी। शैक्षणिक उपलब्धियाँ प्रबल। भावनात्मक सुरक्षा धार्मिक मूल्यों में निहित। केन्द्र स्थिति — शक्तिशाली गजकेसरी योग सम्भव। जीवन का उत्तरार्ध समृद्ध और शान्त।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Exceptional intelligence, creative brilliance, and blessed children. This is Jupiter\'s joy — the house of Purva Punya (past-life merit). The native has strong mantra siddhi and spiritual intuition. Speculative gains through wisdom rather than gambling. Romance carries a dharmic quality — partners are educated and cultured. Government recognition for intellectual or spiritual contributions. This placement often indicates a past life of significant spiritual practice. Children are wise and bring pride to the family. Excellent for teaching, counseling, and advisory roles.', hi: 'असाधारण बुद्धि, सृजनात्मक प्रतिभा और आशीर्वादित सन्तान। यह गुरु का आनन्द है — पूर्व पुण्य का भाव। जातक में प्रबल मन्त्र सिद्धि और आध्यात्मिक अन्तर्ज्ञान। बुद्धि से सट्टा लाभ। प्रेम में धार्मिक गुण। बौद्धिक या आध्यात्मिक योगदान के लिए सरकारी मान्यता। सन्तान बुद्धिमान और परिवार का गौरव।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'Mixed results — Jupiter in a dusthana creates a generous person who attracts enemies through success. The native overcomes obstacles through wisdom and moral authority rather than force. Excellent for medicine, law, and service-oriented professions. Can indicate weight gain, liver issues, or excess in diet. Enemies are eventually defeated but not without prolonged struggle. Legal matters tend to resolve favorably. The native may work in charitable organizations or healing institutions. Jupiter\'s aspect on the 10th from here benefits career, while the 12th aspect blesses spiritual growth.', hi: 'मिश्रित फल — दुस्थान में गुरु ऐसा उदार व्यक्ति बनाता है जो सफलता से शत्रु आकर्षित करता है। बल से नहीं बल्कि ज्ञान और नैतिक अधिकार से बाधाओं पर विजय। चिकित्सा, विधि और सेवा-उन्मुख व्यवसायों के लिए उत्कृष्ट। वज़न वृद्धि, यकृत समस्या या आहार में अतिरेक सम्भव। शत्रु अन्ततः पराजित। कानूनी मामले अनुकूल।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'The spouse is wise, educated, generous, and possibly from a priestly or academic family. Marriage brings expansion — in wealth, wisdom, and social standing. The native gains through partnerships and collaboration. Business partnerships with ethical, knowledge-oriented people succeed. Can indicate multiple marriages or a spouse who is larger-than-life in personality. Jupiter\'s aspect on the Lagna from here blesses the native\'s body and personality. Diplomatic and fair in all dealings. International connections through marriage or business.', hi: 'जीवनसाथी बुद्धिमान, शिक्षित, उदार, सम्भवतः पुरोहित या शैक्षणिक परिवार से। विवाह विस्तार लाता है — धन, ज्ञान और सामाजिक प्रतिष्ठा में। साझेदारियों और सहयोग से लाभ। गुरु यहाँ से लग्न को देखता है — जातक के शरीर और व्यक्तित्व को आशीर्वाद। सभी व्यवहारों में कूटनीतिक और निष्पक्ष।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'Jupiter blesses longevity and provides protection in crises. The native has deep interest in occult sciences, tantra, and hidden knowledge. Inheritance and insurance gains are indicated. Transformative spiritual experiences — near-death moments that awaken profound wisdom. Can indicate the spouse\'s wealth. However, Jupiter in the 8th can create financial ups and downs and unexpected changes in fortune. Sexual energy is channeled toward spiritual practice. Research into ancient texts and esoteric traditions. The guru who has seen the other side.', hi: 'गुरु दीर्घायु का आशीर्वाद देता है और संकटों में सुरक्षा प्रदान करता है। गूढ़ विज्ञान, तन्त्र और गुप्त ज्ञान में गहरी रुचि। विरासत और बीमा से लाभ। परिवर्तनकारी आध्यात्मिक अनुभव। किन्तु 8वें भाव में गुरु आर्थिक उतार-चढ़ाव और भाग्य में अप्रत्याशित परिवर्तन ला सकता है। प्राचीन ग्रन्थों और गूढ़ परम्पराओं में शोध।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'The most auspicious house for the most auspicious planet — Jupiter in the 9th is a cosmic blessing. The native is deeply dharmic, fortunate, and blessed by teachers and gurus. Father is wise, prosperous, and often a guiding force. Higher education leads to prestigious positions. Long-distance travel brings wisdom and wealth. Pilgrimage transforms consciousness. This placement often indicates a spiritual lineage or a family tradition of learning. Luck supports all righteous endeavors. Bhagya (fortune) is at its peak. The native becomes a guru in their own right.', hi: 'सबसे शुभ ग्रह के लिए सबसे शुभ भाव — 9वें भाव में गुरु दैवी आशीर्वाद है। जातक गहन धार्मिक, भाग्यशाली और गुरुओं द्वारा आशीर्वादित। पिता बुद्धिमान, समृद्ध और मार्गदर्शक। उच्च शिक्षा प्रतिष्ठित पदों की ओर। दीर्घ यात्रा ज्ञान और धन लाती है। तीर्थयात्रा चेतना को रूपान्तरित करती है। भाग्य अपने शिखर पर।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'Powerful career in education, law, religion, finance, or government advisory. The native achieves fame and social recognition through dharmic action. Employers and authorities favor the native. This is a Kendra placement where Jupiter forms Hamsa Yoga (one of the five Mahapurusha Yogas) if in own sign or exalted. Public reputation is that of a wise, honest, and principled person. Can reach the highest positions in religious, legal, or educational institutions. Father\'s career influences the native\'s path. Global recognition for wisdom and moral leadership.', hi: 'शिक्षा, विधि, धर्म, वित्त या सरकारी सलाहकार में शक्तिशाली करियर। धार्मिक कार्य से यश और सामाजिक मान्यता। नियोक्ता और अधिकारी अनुकूल। यह केन्द्र स्थिति है जहाँ गुरु हंस योग (पाँच महापुरुष योगों में एक) बनाता है। बुद्धिमान, ईमानदार और सिद्धान्तवादी की सार्वजनिक प्रतिष्ठा। उच्चतम पदों तक पहुँच सम्भव।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Excellent for wealth accumulation and fulfillment of desires. Large income from multiple sources. Powerful and influential friends who support the native\'s ambitions. Elder siblings are prosperous and helpful. Social network includes teachers, scholars, and religious leaders. Gains through education, law, and religious institutions. This is an upachaya house — Jupiter\'s results improve with age. Community leadership and philanthropic activities bring satisfaction. The native\'s wishes are fulfilled through dharmic means.', hi: 'धन संचय और इच्छा पूर्ति के लिए उत्कृष्ट। अनेक स्रोतों से बड़ी आय। शक्तिशाली और प्रभावशाली मित्र। बड़े भाई-बहन समृद्ध और सहायक। सामाजिक नेटवर्क में शिक्षक, विद्वान और धार्मिक नेता। यह उपचय भाव है — गुरु के फल आयु के साथ सुधरते हैं। समुदाय नेतृत्व और परोपकारी गतिविधियाँ सन्तोष देती हैं।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'Jupiter in the 12th is paradoxically one of the best placements for spiritual life and moksha. The native spends generously on charity, pilgrimage, and spiritual retreat. Foreign travel and residence in distant lands bring wisdom. Expenses are on auspicious causes — temples, ashrams, hospitals. This placement indicates a strong past-life connection to spiritual practice. Dreams are vivid and prophetic. Bedroom comforts are excellent (Jupiter\'s aspect on the 4th). Financial outflow is constant but the native never faces poverty. The soul yearns for liberation.', hi: '12वें भाव में गुरु विरोधाभासी रूप से आध्यात्मिक जीवन और मोक्ष के लिए सर्वश्रेष्ठ स्थितियों में। दान, तीर्थयात्रा और आध्यात्मिक साधना पर उदारता से खर्च। विदेश यात्रा और दूर देशों में निवास ज्ञान लाता है। शुभ कार्यों पर व्यय — मन्दिर, आश्रम, अस्पताल। स्वप्न सजीव और भविष्यसूचक। आत्मा मोक्ष की आकांक्षी।' } },
];

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 16,
  overview: {
    en: 'The Jupiter Mahadasha lasts 16 years — a long, expansive period that can define the most productive decades of a person\'s life. This is the period when wisdom, dharma, wealth, and children become central themes. Relationships with gurus, teachers, and mentors intensify. Educational pursuits, travel, legal matters, and religious activities come into focus. The native\'s faith is tested and strengthened. Marriage and children often arrive during this period for those of appropriate age. Financial growth through ethical means is the hallmark of a well-placed Jupiter dasha.',
    hi: 'गुरु महादशा 16 वर्ष चलती है — एक लम्बी, विस्तारशील अवधि जो व्यक्ति के सबसे उत्पादक दशकों को परिभाषित कर सकती है। यह वह समय है जब ज्ञान, धर्म, धन और सन्तान केन्द्रीय विषय बनते हैं। गुरुओं, शिक्षकों और मार्गदर्शकों के साथ सम्बन्ध तीव्र होते हैं। शैक्षणिक कार्य, यात्रा, कानूनी मामले और धार्मिक गतिविधियाँ केन्द्र में आती हैं। नैतिक साधनों से आर्थिक वृद्धि सुस्थित गुरु दशा की पहचान है।',
  },
  strongResult: {
    en: 'If Jupiter is well-placed (own sign, exalted, or in a kendra/trikona): Marriage, birth of children, higher education, promotion, wealth accumulation, spiritual initiation, pilgrimage, recognition as a teacher or advisor, victory in legal matters, purchase of property, harmonious family life, international travel for noble purposes.',
    hi: 'यदि गुरु सुस्थित है (स्वराशि, उच्च, या केन्द्र/त्रिकोण में): विवाह, सन्तान जन्म, उच्च शिक्षा, पदोन्नति, धन संचय, आध्यात्मिक दीक्षा, तीर्थयात्रा, शिक्षक या सलाहकार के रूप में मान्यता, कानूनी विजय, सम्पत्ति क्रय, सामंजस्यपूर्ण पारिवारिक जीवन।',
  },
  weakResult: {
    en: 'If Jupiter is afflicted (debilitated, combust, or in dusthana): Debt, legal problems, conflict with teachers or religious figures, liver and weight issues, problems with children, broken promises, excessive spending, unfulfilled spiritual aspirations, strained relationship with spouse, tax problems, false accusations from authority figures.',
    hi: 'यदि गुरु पीड़ित है (नीच, अस्त, या दुस्थान में): ऋण, कानूनी समस्याएँ, गुरुओं या धार्मिक व्यक्तियों से संघर्ष, यकृत और वज़न समस्याएँ, सन्तान से कठिनाइयाँ, टूटे वादे, अत्यधिक खर्च, अपूर्ण आध्यात्मिक आकांक्षाएँ, जीवनसाथी से तनाव।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', transliteration: 'Om Graam Greem Graum Sah Gurave Namah', count: '19,000 or 16,000 times in 40 days', en: 'The Guru Beej Mantra — chant on Thursdays facing north-east, preferably in the morning wearing yellow clothes', hi: 'गुरु बीज मन्त्र — गुरुवार को उत्तर-पूर्व की ओर मुख करके, प्रातः पीले वस्त्र पहनकर जाप करें' },
  gemstone: { en: 'Yellow Sapphire (Pukhraj) — set in gold, worn on the index finger of the right hand on a Thursday during Shukla Paksha in Jupiter\'s Hora. Minimum 3 carats. Must touch the skin. Alternatives: Yellow Topaz or Citrine for those who cannot afford sapphire.', hi: 'पुखराज — स्वर्ण में जड़ित, गुरुवार को शुक्ल पक्ष में गुरु की होरा में दाहिने हाथ की तर्जनी में धारण करें। न्यूनतम 3 कैरेट। त्वचा को स्पर्श करना चाहिए। विकल्प: पीला पुखराज या सिट्रीन।' },
  charity: { en: 'Donate yellow clothes, turmeric, chana dal (Bengal gram), bananas, jaggery, books, and gold on Thursdays. Feed Brahmins or teachers. Sponsor education for poor children.', hi: 'गुरुवार को पीले वस्त्र, हल्दी, चना दाल, केला, गुड़, पुस्तकें और स्वर्ण दान करें। ब्राह्मणों या शिक्षकों को भोजन कराएँ। गरीब बच्चों की शिक्षा प्रायोजित करें।' },
  fasting: { en: 'Thursday fasting — eat only one meal of yellow foods (dal, banana, turmeric rice). Some traditions recommend full fast until sunset.', hi: 'गुरुवार का उपवास — केवल एक भोजन पीले खाद्य पदार्थों का (दाल, केला, हल्दी चावल)। कुछ परम्पराएँ सूर्यास्त तक पूर्ण उपवास की सलाह देती हैं।' },
  worship: { en: 'Visit Brihaspati or Vishnu temples on Thursdays. Recite Vishnu Sahasranama or Guru Stotra. Offer yellow flowers, ghee lamp, and banana to the deity. Water a Peepal tree on Thursday mornings.', hi: 'गुरुवार को बृहस्पति या विष्णु मन्दिर जाएँ। विष्णु सहस्रनाम या गुरु स्तोत्र का पाठ करें। देवता को पीले पुष्प, घी का दीपक और केला अर्पित करें। गुरुवार प्रातः पीपल वृक्ष को जल दें।' },
  yantra: { en: 'Guru Yantra — a 4×4 magic square with a sum of 34 in each row/column. Install on a gold or brass plate, worship on Thursdays.', hi: 'गुरु यन्त्र — 4×4 जादुई वर्ग जिसमें प्रत्येक पंक्ति/स्तम्भ का योग 34 है। स्वर्ण या पीतल पत्र पर स्थापित करें, गुरुवार को पूजन करें।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'Brihaspati is the son of Sage Angirasa and Surupa. He is the Guru of the Devas — the divine teacher who guides the gods in their eternal struggle against the Asuras. His wife is Tara (star), and their son is Budha (Mercury) — though Puranic accounts describe Tara\'s abduction by Chandra (Moon) leading to the great war of the Devas. Brihaspati\'s wisdom restored order. He is identified with the planet Jupiter, which the Indians tracked for millennia, noting its 12-year orbit that matches the 12-sign zodiac — one sign per year. In the Rigveda, Brihaspati is the lord of sacred speech (Brahmanaspati), the power of prayer made manifest.',
    hi: 'बृहस्पति ऋषि अंगिरा और सुरूपा के पुत्र हैं। वे देवगुरु हैं — देवताओं को असुरों के विरुद्ध शाश्वत संघर्ष में मार्गदर्शन करने वाले दिव्य शिक्षक। उनकी पत्नी तारा (नक्षत्र) हैं, और उनका पुत्र बुध (बुध ग्रह) है — यद्यपि पौराणिक वृत्तान्त चन्द्र द्वारा तारा के अपहरण और देवताओं के महायुद्ध का वर्णन करते हैं। बृहस्पति की बुद्धि ने व्यवस्था पुनर्स्थापित की। ऋग्वेद में बृहस्पति पवित्र वाणी के स्वामी (ब्रह्मणस्पति) हैं।',
  },
  temples: {
    en: 'Major Brihaspati temples: Thiru Irundheeswarar Temple (Thiruchendur, Tamil Nadu) — one of the Navagraha temples where Jupiter is specifically worshipped; Kanaka Durga Temple, Vijayawada — Thursday worship here is considered powerful for Jupiter remedies; Dakshineswar Kali Temple (Kolkata) — associated with Guru tattva through Ramakrishna Paramahamsa; Peepal trees everywhere — the sacred fig tree is Jupiter\'s plant, and watering it on Thursdays is the simplest Guru remedy.',
    hi: 'प्रमुख बृहस्पति मन्दिर: तिरु इरुन्दीश्वरर मन्दिर (तिरुचेन्दुर, तमिलनाडु) — नवग्रह मन्दिरों में जहाँ गुरु की विशेष पूजा; कनक दुर्गा मन्दिर, विजयवाड़ा — यहाँ गुरुवार की पूजा गुरु उपाय के लिए शक्तिशाली; दक्षिणेश्वर काली मन्दिर (कोलकाता) — रामकृष्ण परमहंस के माध्यम से गुरु तत्त्व से सम्बद्ध; पीपल वृक्ष — पवित्र वट वृक्ष गुरु का पौधा, गुरुवार को जल देना सरलतम उपाय।',
  },
  stotra: {
    en: 'The Guru Stotra from the Navagraha Stotram: "Devanam cha Rishinam cha Gurum Kanchana Sannibham, Buddhi Bhutam Trilokesham tam Namami Brihaspatim." Meaning: "I salute Jupiter, the guru of gods and sages, who shines like gold, who is the embodiment of intellect, and who is the lord of the three worlds." Also important: the Brihaspati Gayatri — "Om Angeerasaya Vidmahe, Divya Dehaya Dheemahi, Tanno Jeeva Prachodayat."',
    hi: 'नवग्रह स्तोत्रम् से गुरु स्तोत्र: "देवानां च ऋषीणां च गुरुं काञ्चनसन्निभम्, बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम्।" अर्थ: "मैं बृहस्पति को नमन करता हूँ जो देवताओं और ऋषियों के गुरु हैं, जो स्वर्ण के समान चमकते हैं, जो बुद्धि के मूर्तरूप हैं, और जो तीनों लोकों के स्वामी हैं।" बृहस्पति गायत्री: "ॐ आंगीरसाय विद्महे दिव्यदेहाय धीमहि तन्नो जीवः प्रचोदयात्।"',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Guru and king — dharma illuminated by authority. Their conjunction creates powerful Raja Yogas. Sun gives Jupiter the platform to teach; Jupiter gives Sun the wisdom to rule justly.', hi: 'गुरु और राजा — अधिकार से प्रकाशित धर्म। इनकी युति शक्तिशाली राज योग बनाती है। सूर्य गुरु को शिक्षण का मंच देता है; गुरु सूर्य को न्यायपूर्ण शासन का ज्ञान।' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Gajakesari Yoga — when Jupiter and Moon are in mutual kendras. The guru blesses the mind with optimism, faith, and emotional intelligence. This is one of the most celebrated yogas in Jyotish, producing prosperous and respected individuals.', hi: 'गजकेसरी योग — जब गुरु और चन्द्र परस्पर केन्द्र में। गुरु मन को आशावाद, श्रद्धा और भावनात्मक बुद्धि का आशीर्वाद। ज्योतिष में सबसे प्रसिद्ध योगों में — समृद्ध और सम्मानित व्यक्ति उत्पन्न करता है।' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Dharma protected by courage. Their conjunction produces righteous warriors — people who fight for justice. Excellent for law enforcement, military chaplains, and activist leaders. Mars gives Jupiter the energy to act on its convictions.', hi: 'साहस द्वारा सुरक्षित धर्म। इनकी युति धर्मयोद्धा उत्पन्न करती है — न्याय के लिए लड़ने वाले। विधि प्रवर्तन, सैन्य पुरोहित और कार्यकर्ता नेताओं के लिए उत्कृष्ट। मंगल गुरु को अपने विश्वासों पर कार्य करने की ऊर्जा देता है।' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Wisdom vs. cleverness — the guru vs. the merchant. Jupiter teaches universal truth; Mercury trades in information. Their conjunction can produce brilliant scholars (knowledge + communication) or confused thinkers (faith undermined by analysis). The Saraswati Yoga requires both to be well-placed.', hi: 'ज्ञान बनाम चतुराई — गुरु बनाम व्यापारी। गुरु सार्वभौम सत्य सिखाता है; बुध सूचना का व्यापार करता है। इनकी युति प्रतिभाशाली विद्वान या भ्रमित विचारक उत्पन्न कर सकती है। सरस्वती योग के लिए दोनों का सुस्थित होना आवश्यक।' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Guru vs. Asura Guru — Brihaspati and Shukracharya are eternal rivals in mythology. Jupiter seeks spiritual wealth; Venus seeks material pleasure. Their conjunction creates tension between dharma and kama. However, when harmonized, it can produce great art with spiritual depth — beauty that serves a higher purpose.', hi: 'देवगुरु बनाम असुरगुरु — बृहस्पति और शुक्राचार्य पौराणिक कथाओं में शाश्वत प्रतिद्वन्द्वी। गुरु आध्यात्मिक धन चाहता है; शुक्र भौतिक सुख। इनकी युति धर्म और काम के बीच तनाव। किन्तु सामंजस्य होने पर आध्यात्मिक गहराई वाली महान कला — उच्च उद्देश्य की सेवा में सौन्दर्य।' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Jupiter is neutral toward Saturn, but Saturn considers Jupiter neutral too. Their relationship is complex — Jupiter expands, Saturn contracts. Together they produce disciplined wisdom, structured spiritual practice, and karmic accountability. The 60-year Samvatsara cycle is their orbital resonance. Jupiter-Saturn conjunctions mark major societal shifts every ~20 years.', hi: 'गुरु शनि के प्रति सम है, और शनि भी गुरु को सम मानता है। इनका सम्बन्ध जटिल है — गुरु विस्तार करता है, शनि संकुचित। साथ मिलकर अनुशासित ज्ञान, संरचित आध्यात्मिक साधना और कार्मिक जवाबदेही उत्पन्न करते हैं। 60-वर्षीय सम्वत्सर चक्र इनकी कक्षीय अनुनाद है।' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Guru Chandal Yoga — Jupiter-Rahu conjunction. The guru is corrupted by illusion. Can produce unorthodox spiritual teachers, false gurus, or brilliant innovators who break religious conventions. The native may question traditional beliefs productively or destructively. Foreign travel for religious purposes.', hi: 'गुरु चाण्डाल योग — गुरु-राहु युति। गुरु माया से दूषित। अपरम्परागत आध्यात्मिक शिक्षक, झूठे गुरु, या धार्मिक परम्पराओं को तोड़ने वाले प्रतिभाशाली नवप्रवर्तक। जातक पारम्परिक विश्वासों पर रचनात्मक या विनाशकारी रूप से प्रश्न कर सकता है।' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Ketu strips Jupiter of its attachment to formal religion and institutional spirituality. The result can be profound — a native who transcends organized religion to find direct spiritual experience. Past-life spiritual merit manifests. Moksha karaka meets Moksha karaka. Can also produce spiritual confusion or rejection of all belief systems.', hi: 'केतु गुरु की औपचारिक धर्म और संस्थागत आध्यात्मिकता से आसक्ति छीन लेता है। परिणाम गहन हो सकता है — संगठित धर्म से परे प्रत्यक्ष आध्यात्मिक अनुभव। पूर्वजन्म का आध्यात्मिक पुण्य प्रकट। मोक्ष कारक मोक्ष कारक से मिलता है।' } },
];

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/surya', label: { en: 'Surya — The Sun', hi: 'सूर्य' } },
  { href: '/learn/shukra', label: { en: 'Shukra — Venus', hi: 'शुक्र' } },
  { href: '/learn/shani', label: { en: 'Shani — Saturn', hi: 'शनि' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Kundali', hi: 'कुण्डली में योग' } },
  { href: '/learn/shadbala', label: { en: 'Shadbala Strength', hi: 'षड्बल' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
  { href: '/learn/combustion', label: { en: 'Planetary Combustion', hi: 'ग्रह अस्त' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function GuruPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-jupiter/15 border border-graha-jupiter/30 mb-4">
          <span className="text-4xl">&#9795;</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Guru — Jupiter', hi: 'गुरु — बृहस्पति' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'Devaguru — preceptor of the gods, the great benefic, significator of wisdom, dharma, children, and wealth in Vedic astrology.', hi: 'देवगुरु — देवताओं के गुरु, महाशुभ ग्रह, वैदिक ज्योतिष में ज्ञान, धर्म, सन्तान और धन का कारक।' })}
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
        <p style={bf}>{ml({ en: 'Guru (Jupiter) is the greatest natural benefic in Vedic astrology — the Devaguru who dispels ignorance and bestows wisdom. He represents dharma (righteousness), viveka (discrimination between right and wrong), and the expansion of consciousness. As the largest planet in the solar system, Jupiter\'s astrological influence is similarly expansive — he magnifies everything he touches. In a birth chart, Jupiter\'s placement reveals where the native will find wisdom, prosperity, and divine grace. He is the Putrakaraka (significator of children), Dhanakaraka (co-significator of wealth), and Dharmakaraka (significator of righteousness). Without Jupiter\'s blessings, no material or spiritual success is complete.', hi: 'गुरु (बृहस्पति) वैदिक ज्योतिष में सबसे बड़ा स्वाभाविक शुभ ग्रह है — देवगुरु जो अज्ञान को दूर करता है और ज्ञान प्रदान करता है। वह धर्म, विवेक (सही और गलत के बीच भेद) और चेतना के विस्तार का प्रतिनिधित्व करता है। सौर मण्डल के सबसे बड़े ग्रह के रूप में, गुरु का ज्योतिषीय प्रभाव भी उतना ही विस्तारशील है — वह जो छूता है उसे बढ़ाता है। जन्म कुण्डली में गुरु की स्थिति प्रकट करती है कि जातक को ज्ञान, समृद्धि और दैवी कृपा कहाँ मिलेगी।' })}</p>
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
        <p style={bf}>{ml({ en: 'Jupiter\'s dignity determines whether its immense beneficence flows freely or is obstructed. Exalted in Cancer at 5°, Jupiter combines nurturing compassion with expansive wisdom — the perfect guru. Debilitated in Capricorn at 5°, the guru is forced into materialistic pragmatism, and faith becomes a commodity rather than a conviction. In its own signs (Sagittarius and Pisces), Jupiter is the king in his court — free to teach, guide, and bless without hindrance.', hi: 'गुरु की गरिमा यह निर्धारित करती है कि इसकी अपार शुभता स्वतन्त्र रूप से बहती है या बाधित होती है। कर्क में 5° पर उच्च, गुरु पोषक करुणा को विस्तारशील ज्ञान से जोड़ता है — आदर्श गुरु। मकर में 5° पर नीच, गुरु भौतिकवादी व्यावहारिकता में विवश, और श्रद्धा विश्वास के बजाय वस्तु बन जाती है।' })}</p>
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

      {/* ── 3. Jupiter in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Jupiter in the Twelve Signs', hi: 'बारह राशियों में गुरु' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Jupiter transits one sign approximately every 12-13 months, making its sign placement a generational influence shared by peers born in the same year. However, its house placement (determined by the ascendant) is unique to each individual. The sign colors the quality of Jupiter\'s wisdom — fiery signs produce action-oriented teachers, earth signs produce practical advisors, air signs produce intellectual communicators, and water signs produce intuitive healers.', hi: 'गुरु लगभग हर 12-13 माह में एक राशि का भ्रमण करता है, जिससे इसकी राशि स्थिति एक ही वर्ष में जन्मे समकक्षों द्वारा साझा पीढ़ीगत प्रभाव है। तथापि, इसकी भाव स्थिति (लग्न द्वारा निर्धारित) प्रत्येक व्यक्ति के लिए अद्वितीय है। राशि गुरु के ज्ञान की गुणवत्ता को रंगती है।' })}</p>
        {JUPITER_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-jupiter/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(s.sign)}</span>
              {s.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  s.dignity === 'Exalted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  s.dignity === 'Debilitated' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  s.dignity.includes('Own sign') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{s.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(s.effect)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 4. Jupiter in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Jupiter in the Twelve Houses', hi: 'बारह भावों में गुरु' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Jupiter\'s special aspect (5th, 7th, and 9th from itself) means that wherever it sits, it blesses three additional houses. This is why Jupiter is called the "great protector" — even from difficult houses (6th, 8th, 12th), its aspects can uplift the native. In Kendras (1, 4, 7, 10), Jupiter forms the foundation for Hamsa Yoga. In Trikonas (1, 5, 9), it amplifies dharma and fortune.', hi: 'गुरु की विशेष दृष्टि (अपने से 5वें, 7वें और 9वें भाव पर) का अर्थ है कि यह जहाँ भी बैठता है, तीन अतिरिक्त भावों को आशीर्वाद देता है। इसीलिए गुरु को "महारक्षक" कहा जाता है — कठिन भावों (6, 8, 12) से भी इसकी दृष्टि जातक को ऊपर उठा सकती है। केन्द्रों में हंस योग का आधार। त्रिकोणों में धर्म और भाग्य की वृद्धि।' })}</p>
        {JUPITER_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-jupiter/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-jupiter/15 border border-graha-jupiter/30 flex items-center justify-center text-graha-jupiter text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Planets in Houses)" />
      </LessonSection>

      {/* ── 5. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Guru Mahadasha (16 Years)', hi: 'गुरु महादशा (16 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Jupiter Dasha', hi: 'बलवान गुरु दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongResult)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Jupiter Dasha', hi: 'दुर्बल गुरु दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakResult)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 6. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Jupiter\'s friendships and enmities shape some of the most important yogas in Jyotish. Jupiter-Sun creates Raja Yogas, Jupiter-Moon creates Gajakesari, Jupiter-Mars creates Dharma-Karmadhipati combinations. The Jupiter-Venus enmity (Devaguru vs Asura Guru) and Jupiter-Mercury tension create the most nuanced results in chart interpretation.', hi: 'गुरु की मैत्री और शत्रुता ज्योतिष के कुछ सबसे महत्त्वपूर्ण योगों को आकार देती है। गुरु-सूर्य राज योग बनाता है, गुरु-चन्द्र गजकेसरी, गुरु-मंगल धर्म-कर्माधिपति संयोग। गुरु-शुक्र शत्रुता (देवगुरु बनाम असुर गुरु) और गुरु-बुध तनाव कुण्डली व्याख्या में सबसे सूक्ष्म परिणाम देते हैं।' })}</p>
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
      <LessonSection number={next()} title={ml({ en: 'Remedies for Jupiter', hi: 'गुरु के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Remedies are prescribed when Jupiter is weak, afflicted, or poorly placed in the birth chart. A strong Jupiter generally does not need remedies — and wearing Yellow Sapphire with a strong Jupiter can cause excess (weight gain, overconfidence, liver issues). Consult a qualified Jyotishi before wearing gemstones.', hi: 'उपाय तब निर्धारित किये जाते हैं जब गुरु दुर्बल, पीड़ित या कुण्डली में अशुभ स्थान पर हो। बलवान गुरु को प्रायः उपाय की आवश्यकता नहीं — और बलवान गुरु के साथ पुखराज पहनना अतिरेक (वज़न वृद्धि, अति-आत्मविश्वास, यकृत समस्या) कर सकता है। रत्न धारण से पूर्व योग्य ज्योतिषी से परामर्श करें।' })}</p>

        {/* Mantra */}
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-graha-jupiter/15 rounded-xl p-5 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Beej Mantra', hi: 'बीज मन्त्र' })}</h4>
          <p className="text-gold-primary text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{REMEDIES.mantra.text}</p>
          <p className="text-text-secondary text-xs italic mb-2">{REMEDIES.mantra.transliteration}</p>
          <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES.mantra)}</p>
          <p className="text-text-secondary text-xs mt-1">{ml({ en: `Count: ${REMEDIES.mantra.count}`, hi: `जाप: ${REMEDIES.mantra.count}` })}</p>
        </div>

        {/* Other remedies */}
        {[
          { key: 'gemstone', title: { en: 'Gemstone — Yellow Sapphire (Pukhraj)', hi: 'रत्न — पुखराज' } },
          { key: 'charity', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', title: { en: 'Worship & Puja', hi: 'पूजा एवं उपासना' } },
          { key: 'yantra', title: { en: 'Guru Yantra', hi: 'गुरु यन्त्र' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-3">
            <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'Jupiter remedies work best when combined with genuine learning, teaching others, respecting elders and gurus, maintaining ethical conduct, and practicing generosity. The deepest Guru remedy is to become a teacher yourself — share your knowledge freely.', hi: 'गुरु के उपाय सच्चे अध्ययन, दूसरों को शिक्षण, बुजुर्गों और गुरुओं का सम्मान, नैतिक आचरण और उदारता के अभ्यास के साथ सबसे अच्छे काम करते हैं। सबसे गहरा गुरु उपाय स्वयं शिक्षक बनना है — अपना ज्ञान मुक्त रूप से साझा करें।' })}
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
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Guru Stotra & Gayatri', hi: 'गुरु स्तोत्र एवं गायत्री' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.stotra)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples & Peepal Tree', hi: 'पवित्र मन्दिर एवं पीपल वृक्ष' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Characteristics" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Jupiter is the greatest benefic — significator of wisdom, dharma, children, and wealth. Its placement reveals where divine grace operates in your life.', hi: 'गुरु सबसे बड़ा शुभ ग्रह है — ज्ञान, धर्म, सन्तान और धन का कारक। इसकी स्थिति प्रकट करती है कि दैवी कृपा जीवन में कहाँ कार्य करती है।' }),
        ml({ en: 'Exalted in Cancer (5°), debilitated in Capricorn (5°). Own signs: Sagittarius & Pisces. Moolatrikona: Sagittarius 0°-10°.', hi: 'कर्क 5° में उच्च, मकर 5° में नीच। स्वराशि: धनु एवं मीन। मूलत्रिकोण: धनु 0°-10°।' }),
        ml({ en: 'Friends: Sun, Moon, Mars. Enemies: Mercury, Venus. Neutral: Saturn. The Jupiter-Venus enmity (Devaguru vs Asura Guru) is mythologically significant.', hi: 'मित्र: सूर्य, चन्द्र, मंगल। शत्रु: बुध, शुक्र। सम: शनि। गुरु-शुक्र शत्रुता (देवगुरु बनाम असुर गुरु) पौराणिक रूप से महत्त्वपूर्ण।' }),
        ml({ en: 'Mahadasha: 16 years. Remedy: Yellow Sapphire, Thursday fasting, Peepal tree worship, Vishnu Sahasranama, chana dal charity.', hi: 'महादशा: 16 वर्ष। उपाय: पुखराज, गुरुवार उपवास, पीपल पूजा, विष्णु सहस्रनाम, चना दाल दान।' }),
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
