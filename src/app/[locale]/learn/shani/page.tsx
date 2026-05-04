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
  { devanagari: 'शनि', transliteration: 'Shani', meaning: { en: 'The slow-moving one — son of Surya and Chhaya', hi: 'धीमी गति वाला — सूर्य और छाया का पुत्र' } },
  { devanagari: 'शनैश्चर', transliteration: 'Shanaishchara', meaning: { en: 'He who moves slowly — the patient one', hi: 'जो धीरे-धीरे चलता है — धैर्यवान' } },
  { devanagari: 'कर्मकारक', transliteration: 'Karmakāraka', meaning: { en: 'Significator of karma and deeds', hi: 'कर्म और कृत्यों का कारक' } },
  { devanagari: 'आयुष्कारक', transliteration: 'Āyushkāraka', meaning: { en: 'Significator of longevity', hi: 'दीर्घायु का कारक' } },
  { devanagari: 'यम', transliteration: 'Yama', meaning: { en: 'The god of death — Saturn\'s brother, co-ruler of justice', hi: 'मृत्यु के देवता — शनि के भाई, न्याय के सह-शासक' } },
  { devanagari: 'मन्द', transliteration: 'Manda', meaning: { en: 'The slow one — unhurried, deliberate, thorough', hi: 'धीमा — अविलम्ब नहीं, सुविचारित, विस्तृत' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Libra (Tula) — deepest exaltation at 20°', hi: 'तुला — 20° पर परम उच्च' },
  debilitation: { en: 'Aries (Mesha) — deepest debilitation at 20°', hi: 'मेष — 20° पर परम नीच' },
  ownSign: { en: 'Capricorn (Makara) & Aquarius (Kumbha)', hi: 'मकर एवं कुम्भ' },
  moolatrikona: { en: 'Aquarius 0°–20°', hi: 'कुम्भ 0°–20°' },
  friends: { en: 'Mercury, Venus', hi: 'बुध, शुक्र' },
  enemies: { en: 'Sun, Moon, Mars', hi: 'सूर्य, चन्द्र, मंगल' },
  neutral: { en: 'Jupiter', hi: 'गुरु' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Servants, laborers, elderly, renunciants, beggars, chronic patients, low-caste workers, miners, oil merchants', hi: 'सेवक, मजदूर, वृद्ध, संन्यासी, भिखारी, दीर्घ रोगी, खनिक, तेल व्यापारी' },
  bodyParts: { en: 'Legs, knees, bones, teeth, nails, nervous system, joints, tendons, skin (chronic conditions)', hi: 'पैर, घुटने, अस्थि, दाँत, नाखून, तन्त्रिका तन्त्र, जोड़, कण्डरा, त्वचा (दीर्घकालिक)' },
  professions: { en: 'Mining, oil industry, agriculture, judiciary, prison administration, sanitation, construction, archaeology, mortuary', hi: 'खनन, तेल उद्योग, कृषि, न्यायपालिका, कारागार प्रशासन, स्वच्छता, निर्माण, पुरातत्व' },
  materials: { en: 'Iron, steel, blue sapphire (Neelam), oil, mustard, sesame, black cloth, leather, coal', hi: 'लोहा, इस्पात, नीलम, तेल, सरसों, तिल, काला वस्त्र, चमड़ा, कोयला' },
  direction: { en: 'West', hi: 'पश्चिम' },
  day: { en: 'Saturday (Shanivara)', hi: 'शनिवार' },
  color: { en: 'Black / Dark blue / Indigo', hi: 'काला / गहरा नीला / नील' },
  season: { en: 'Shishira (Late winter)', hi: 'शिशिर ऋतु' },
  taste: { en: 'Astringent (Kashaya)', hi: 'कषाय (कसैला)' },
  guna: { en: 'Tamas', hi: 'तमस्' },
  element: { en: 'Air (Vayu)', hi: 'वायु तत्त्व' },
  gender: { en: 'Neuter / Eunuch', hi: 'नपुंसक' },
  nature: { en: 'Natural Malefic (Krura Graha) — the most feared planet, but also the greatest teacher through discipline', hi: 'स्वाभाविक क्रूर ग्रह — सबसे भयंकर ग्रह, किन्तु अनुशासन से सबसे बड़ा शिक्षक' },
};

// ─── Saturn in 12 Signs ───────────────────────────────────────────────
const SATURN_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: 'Debilitated',
    effect: { en: 'Saturn is debilitated here — patience forced into the sign of impulsiveness. The native struggles with frustration, delayed action, and conflict between discipline and desire for immediate results. Authority is undermined by impatience. The 20° point is the deepest fall. However, Neecha Bhanga is very common and can produce warriors who combine patience with courage — generals who plan meticulously before striking. Career starts slowly but determination eventually prevails. Teeth, bones, and joints may be problematic. The lesson: speed without discipline destroys; discipline without initiative stagnates.', hi: 'शनि यहाँ नीच है — धैर्य आवेग की राशि में विवश। जातक हताशा, विलम्बित कार्य और अनुशासन तथा तत्काल परिणामों की इच्छा के बीच संघर्ष। 20° पर सबसे गहरी नीचता। तथापि नीच भंग बहुत सामान्य है और ऐसे योद्धा उत्पन्न कर सकता है जो धैर्य को साहस से जोड़ें। करियर धीमी शुरुआत किन्तु दृढ़ता अन्ततः विजयी। सबक: बिना अनुशासन गति नष्ट करती है।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: "Friend's sign",
    effect: { en: 'Saturn in Venus\'s earth sign creates slow but steady wealth accumulation through persistent effort. The native is extremely patient in financial matters — saving, investing, and building over decades rather than years. Voice may be deep, slow, and commanding. Possessions are durable and practical rather than flashy. Relationships mature slowly but last a lifetime. Agricultural work, real estate, and long-term investments succeed. Physical constitution is sturdy but may be prone to throat and neck issues. Frugal lifestyle that builds quiet prosperity.', hi: 'शुक्र की पृथ्वी राशि में शनि निरन्तर प्रयास से धीमा किन्तु स्थिर धन संचय बनाता है। जातक वित्तीय मामलों में अत्यन्त धैर्यवान — दशकों में बचत, निवेश और निर्माण। स्वर गम्भीर, धीमा और प्रभावशाली। सम्पत्ति टिकाऊ और व्यावहारिक। सम्बन्ध धीरे-धीरे परिपक्व किन्तु जीवनपर्यन्त। कृषि, अचल सम्पत्ति और दीर्घकालिक निवेश सफल।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: "Friend's sign",
    effect: { en: 'Saturn in Mercury\'s air sign creates a methodical, serious communicator. The native thinks carefully before speaking, writes with precision, and excels in structured intellectual work. Research, technical writing, and systematic analysis are natural strengths. May struggle with anxiety, overthinking, or speech impediments in youth that resolve with age. Siblings may face hardships. Excellent for careers in accounting, programming, data science, and legal documentation. The mind becomes sharper and more disciplined with time.', hi: 'बुध की वायु राशि में शनि एक व्यवस्थित, गम्भीर संवादक बनाता है। जातक बोलने से पहले सावधानी से सोचता है, सटीकता से लिखता है। शोध, तकनीकी लेखन और व्यवस्थित विश्लेषण स्वाभाविक शक्तियाँ। युवावस्था में चिन्ता या वाक् बाधा जो आयु से ठीक। लेखांकन, प्रोग्रामिंग, डेटा विज्ञान में उत्कृष्ट करियर। मन समय के साथ तीक्ष्ण।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: "Enemy's sign",
    effect: { en: 'Saturn in Moon\'s nurturing sign creates emotional restriction and difficulty expressing feelings. The native may have a cold or distant relationship with the mother. Home life feels burdensome rather than comforting. Emotional maturity comes late — the heart learns to feel through discipline rather than spontaneity. Property matters involve delays and legal issues. Can indicate depression or melancholy if badly afflicted. However, this placement produces extremely resilient people who build strong emotional foundations after early hardship. Career in real estate, construction, or institutional care.', hi: 'चन्द्र की पोषक राशि में शनि भावनात्मक प्रतिबन्ध और भावनाओं को व्यक्त करने में कठिनाई बनाता है। माता के साथ ठण्डा या दूर का सम्बन्ध सम्भव। गृह जीवन सुखद के बजाय बोझिल। भावनात्मक परिपक्वता देर से। सम्पत्ति मामलों में विलम्ब। किन्तु प्रारम्भिक कठिनाई के बाद अत्यन्त लचीले लोग बनाता है जो मजबूत भावनात्मक नींव बनाते हैं।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: "Enemy's sign",
    effect: { en: 'Saturn in the Sun\'s royal sign creates fundamental tension between humility and authority. The native may struggle with ego — wanting recognition but being forced into humble positions. Father-son conflicts are pronounced (Saturn is Sun\'s son in mythology). Heart problems, spine issues, or chronic autoimmune conditions are possible. Government careers involve struggle and delay before eventual success. Creative expression is serious, structured, and politically conscious rather than playful. Leaders who rise through hardship and discipline rather than birthright.', hi: 'सूर्य की राजसी राशि में शनि विनम्रता और अधिकार के बीच मौलिक तनाव बनाता है। अहंकार से संघर्ष — मान्यता चाहता है किन्तु विनम्र पदों में विवश। पिता-पुत्र संघर्ष प्रबल (पौराणिक कथा में शनि सूर्य का पुत्र)। हृदय, रीढ़ की समस्याएँ सम्भव। सरकारी करियर में अन्तिम सफलता से पहले संघर्ष और विलम्ब। कठिनाई और अनुशासन से उभरने वाले नेता।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: "Friend's sign",
    effect: { en: 'Saturn in Mercury\'s earth sign produces the ultimate perfectionist. Meticulous attention to detail, systematic approach to work, and extraordinary patience in precision tasks. Natural aptitude for medicine, research, quality control, and diagnostic work. The native serves diligently, often in health or service industries. Can indicate chronic digestive issues or nervous disorders. Analytical ability improves dramatically with age. This placement excels in Ayurvedic medicine, laboratory research, accounting, and any profession requiring sustained precision over years.', hi: 'बुध की पृथ्वी राशि में शनि परम पूर्णतावादी बनाता है। विस्तार पर सूक्ष्म ध्यान, कार्य का व्यवस्थित दृष्टिकोण और सटीक कार्यों में असाधारण धैर्य। चिकित्सा, शोध, गुणवत्ता नियन्त्रण और निदान में स्वाभाविक योग्यता। दीर्घकालिक पाचन या तन्त्रिका विकार सम्भव। विश्लेषणात्मक क्षमता आयु के साथ नाटकीय रूप से सुधरती है।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: 'Exalted',
    effect: { en: 'Saturn is exalted here — discipline serves justice. This is the pinnacle of Saturnian energy: fairness, impartial judgment, and structured social harmony. The native becomes a natural judge, arbitrator, or social reformer. The 20° point is the deepest exaltation. Partnerships are serious, committed, and based on mutual respect rather than passion. Career in law, diplomacy, or social justice is destined. This placement produces Supreme Court judges, human rights advocates, and architects of equitable systems. Marriage is late but exceptionally stable. Saturn here protects democratic institutions and fights structural injustice.', hi: 'शनि यहाँ उच्च है — अनुशासन न्याय की सेवा करता है। यह शनि ऊर्जा का शिखर: निष्पक्षता, तटस्थ न्याय और संरचित सामाजिक सामंजस्य। 20° पर परम उच्च। साझेदारियाँ गम्भीर, प्रतिबद्ध और पारस्परिक सम्मान पर आधारित। विधि, कूटनीति या सामाजिक न्याय में करियर। सर्वोच्च न्यायालय के न्यायाधीश, मानवाधिकार वकील उत्पन्न करता है। विवाह देर से किन्तु असाधारण स्थिर।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: "Enemy's sign",
    effect: { en: 'Saturn in Mars\'s water sign creates intense, brooding, and deeply resilient individuals. The native faces transformation through suffering — what doesn\'t kill them makes them formidable. Interest in underground activities, mining, archaeology, and hidden resources. Research into death, mortality, and existential questions. Can indicate chronic reproductive or urinary issues. Inheritance matters are complicated and delayed. This placement produces the most resilient survivors — people who rebuild after complete destruction. Psychology, surgery, and crisis management are natural careers.', hi: 'मंगल की जल राशि में शनि तीव्र, चिन्तनशील और गहरे लचीले व्यक्ति बनाता है। जातक पीड़ा से रूपान्तरण का सामना करता है। भूमिगत गतिविधियों, खनन, पुरातत्व में रुचि। मृत्यु, नश्वरता और अस्तित्व सम्बन्धी प्रश्नों में शोध। विरासत मामले जटिल और विलम्बित। सबसे लचीले उत्तरजीवी उत्पन्न करता है — पूर्ण विनाश के बाद पुनर्निर्माण करने वाले।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Neutral',
    effect: { en: 'Saturn in Jupiter\'s fire sign creates a serious, disciplined approach to philosophy, religion, and higher education. The native earns wisdom through hardship rather than inspiration. Faith is tested repeatedly before it becomes unshakeable. Higher education may involve struggle — delayed degrees, interrupted studies — but the eventual knowledge is rock-solid. Can produce monks, ascetics, and scholars who earn their authority through decades of study. Legal career with a focus on constitutional or international law. Father may face chronic challenges.', hi: 'गुरु की अग्नि राशि में शनि दर्शन, धर्म और उच्च शिक्षा के प्रति गम्भीर, अनुशासित दृष्टिकोण बनाता है। ज्ञान प्रेरणा से नहीं कठिनाई से अर्जित। श्रद्धा बार-बार परीक्षित होकर अडिग बनती है। उच्च शिक्षा में संघर्ष — विलम्बित उपाधि — किन्तु अन्तिम ज्ञान दृढ़। भिक्षु, तपस्वी और विद्वान उत्पन्न कर सकता है।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: 'Own sign',
    effect: { en: 'Saturn in its own earth sign — the master administrator on his throne. This is Saturn\'s most powerful and natural expression: ambition, discipline, strategy, and patient conquest. The native builds empires — slowly, methodically, and irreversibly. Career advancement through sheer perseverance. Institutional power, corporate leadership, and governmental authority come naturally. Physical body is lean, strong-boned, and ages well. Can be cold, calculating, and overly focused on status. This placement produces CEOs, senior bureaucrats, and institution-builders. The price of success is emotional distance.', hi: 'शनि अपनी पृथ्वी राशि में — सिंहासन पर मास्टर प्रशासक। यह शनि की सबसे शक्तिशाली और स्वाभाविक अभिव्यक्ति: महत्वाकांक्षा, अनुशासन, रणनीति और धैर्यपूर्ण विजय। जातक साम्राज्य बनाता है — धीरे-धीरे, व्यवस्थित रूप से। शुद्ध दृढ़ता से करियर उन्नति। संस्थागत शक्ति और सरकारी अधिकार स्वाभाविक। CEO, वरिष्ठ नौकरशाह और संस्था-निर्माता उत्पन्न करता है।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: 'Own sign (Moolatrikona)',
    effect: { en: 'Saturn in its own air sign — the social reformer and humanitarian. This is Saturn\'s Moolatrikona (0°-20°), even more powerful than Capricorn for intellectual and social expression. The native works for collective justice, democratic institutions, and systemic change. Technology, science, and large networks serve as tools for reform. Friends and social circles are diverse and purpose-driven. Income through large organizations, technology, or NGOs. Can be emotionally detached and ideologically rigid. This placement produces social engineers, technology leaders, and constitutional framers.', hi: 'शनि अपनी वायु राशि में — सामाजिक सुधारक और मानवतावादी। यह शनि का मूलत्रिकोण (0°-20°), बौद्धिक और सामाजिक अभिव्यक्ति के लिए मकर से भी शक्तिशाली। जातक सामूहिक न्याय, लोकतान्त्रिक संस्थाओं और व्यवस्थागत परिवर्तन के लिए कार्य करता है। प्रौद्योगिकी, विज्ञान सुधार के उपकरण। सामाजिक अभियन्ता, प्रौद्योगिकी नेता और संवैधानिक निर्माता उत्पन्न करता है।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Neutral',
    effect: { en: 'Saturn in Jupiter\'s water sign creates spiritual discipline through suffering. The native may work in hospitals, prisons, ashrams, or isolated institutions. Meditation practice is deep but earned through emotional hardship. Expenses on charitable causes. Foreign lands bring karmic encounters. Feet and lymphatic system may be vulnerable. Can indicate a life of quiet service — the monk, the hospice worker, the prison chaplain. Dreams are heavy but prophetic. Moksha is earned through sustained spiritual effort, not spontaneous awakening. Art has a melancholic, profound beauty.', hi: 'गुरु की जल राशि में शनि पीड़ा से आध्यात्मिक अनुशासन बनाता है। जातक अस्पतालों, कारागारों, आश्रमों या एकान्त संस्थानों में कार्य कर सकता है। ध्यान साधना गहन किन्तु भावनात्मक कठिनाई से अर्जित। दानधर्म पर व्यय। विदेश में कार्मिक मिलन। शान्त सेवा का जीवन। मोक्ष निरन्तर आध्यात्मिक प्रयास से अर्जित। कला में विषादपूर्ण, गहन सौन्दर्य।' } },
];

// ─── Saturn in 12 Houses ──────────────────────────────────────────────
const SATURN_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'Lean body, serious demeanor, and a life defined by discipline and self-reliance. The native looks older than their age in youth but ages gracefully. Health may be fragile early but improves with time. Strong sense of responsibility from childhood. Can indicate early hardship that builds character. Saturn aspects the 3rd (courage), 7th (marriage), and 10th (career) — all three involve delay but eventual strength. If in own sign or exalted, this forms Shasha Yoga — one of the five Mahapurusha Yogas, producing powerful administrators.', hi: 'दुबला शरीर, गम्भीर आचरण और अनुशासन तथा आत्मनिर्भरता से परिभाषित जीवन। युवावस्था में जातक आयु से अधिक दिखता है किन्तु सुन्दर ढंग से वृद्ध होता है। प्रारम्भिक स्वास्थ्य कमजोर किन्तु समय से सुधार। बचपन से उत्तरदायित्व की प्रबल भावना। शनि 3वें, 7वें और 10वें भाव को देखता है — सभी में विलम्ब किन्तु अन्तिम शक्ति। शशक योग सम्भव।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Slow wealth accumulation through persistent effort and frugal habits. Speech is measured, deep-voiced, and often harsh or blunt. The native may face financial difficulties in early life but builds solid wealth by middle age. Family life involves responsibilities and burdens. Diet tends toward simple, traditional food. Can indicate speech impediments in childhood or dental issues. Savings are substantial because spending is conservative. Wealth through agriculture, mining, real estate, or government employment. Family values emphasize duty over affection.', hi: 'निरन्तर प्रयास और मितव्ययी आदतों से धीमा धन संचय। वाणी नपी-तुली, गम्भीर और प्रायः कठोर। प्रारम्भिक जीवन में आर्थिक कठिनाइयाँ किन्तु मध्य आयु तक ठोस धन। पारिवारिक जीवन में उत्तरदायित्व और बोझ। आहार सरल, पारम्परिक। बचपन में वाक् बाधा या दन्त समस्याएँ सम्भव। बचत पर्याप्त क्योंकि खर्च रूढ़िवादी।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Strong willpower, endurance, and courage that develops through hardship. Younger siblings may face difficulties or the relationship involves burden. Communication style is serious, structured, and deliberate. Short journeys involve work rather than pleasure. The native succeeds through persistent effort in writing, media, or communication fields. Hands are strong and skilled in manual labor. This is an upachaya house — Saturn\'s challenging nature improves with age, making the native increasingly courageous and effective after 36. Military, sports requiring endurance, and structured artistic practice succeed.', hi: 'कठिनाई से विकसित दृढ़ इच्छाशक्ति, सहनशीलता और साहस। छोटे भाई-बहनों को कठिनाइयाँ या सम्बन्ध में बोझ। संवाद शैली गम्भीर, संरचित। लघु यात्राएँ सुख के बजाय कार्य। लेखन, मीडिया में निरन्तर प्रयास से सफलता। उपचय भाव — शनि का चुनौतीपूर्ण स्वभाव 36 के बाद सुधरता है, जातक को बढ़ते साहसी और प्रभावी बनाता है।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'Challenges in domestic happiness and relationship with mother. The native may lack emotional warmth at home or face property-related legal issues. Education involves struggle — interrupted schooling or difficult academic environment. Vehicles tend to be practical rather than luxurious. Inner peace comes late, through decades of emotional work. Can indicate living in old houses, government quarters, or working from home. Real estate investments eventually succeed but involve delays and legal complications. Mother may be hardworking and burdened. The native builds their own emotional security from scratch.', hi: 'घरेलू सुख और माता के साथ सम्बन्ध में चुनौतियाँ। घर में भावनात्मक गर्मी की कमी या सम्पत्ति-सम्बन्धी कानूनी समस्याएँ। शिक्षा में संघर्ष। वाहन व्यावहारिक। आन्तरिक शान्ति दशकों के भावनात्मक कार्य से देर से। पुरानी इमारतों, सरकारी आवास में रहना सम्भव। अचल सम्पत्ति निवेश अन्ततः सफल किन्तु विलम्ब और कानूनी जटिलताएँ।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Delayed children, serious intellectual approach, and discipline in creative expression. The native may have fewer children, or children come late in life. Intelligence is methodical rather than brilliant — the student who studies harder than everyone else and eventually surpasses the naturally gifted. Speculation and gambling should be strictly avoided. Romance is serious, committed, and involves age-gap or status-conscious partners. Can indicate adoption or children through medical intervention. Mantra practice requires years of disciplined repetition before siddhi manifests.', hi: 'विलम्बित सन्तान, गम्भीर बौद्धिक दृष्टिकोण और सृजनात्मक अभिव्यक्ति में अनुशासन। कम सन्तान या जीवन में देर से। बुद्धि व्यवस्थित — जो सबसे अधिक अध्ययन करता है और अन्ततः स्वाभाविक प्रतिभाशाली को पार करता है। सट्टा और जुआ से सख्त बचाव। प्रेम गम्भीर, प्रतिबद्ध। मन्त्र सिद्धि के लिए वर्षों का अनुशासित जाप।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'Excellent placement — Saturn destroys enemies through persistent effort and outlasts all opposition. The native is a tireless worker who thrives in service-oriented roles. Legal matters eventually resolve in the native\'s favor. Health may involve chronic conditions (bones, joints, skin) that are managed rather than cured. Excellent for government service, judiciary, law enforcement, and healthcare administration. Enemies are defeated through patience — Saturn simply outlives them. This is an upachaya house — results improve dramatically after 36.', hi: 'उत्कृष्ट स्थिति — शनि निरन्तर प्रयास से शत्रुओं का नाश करता है और सभी विरोध से अधिक टिकता है। अथक कार्यकर्ता जो सेवा-उन्मुख भूमिकाओं में फलता-फूलता है। कानूनी मामले अन्ततः अनुकूल। दीर्घकालिक स्वास्थ्य स्थितियाँ (अस्थि, जोड़, त्वचा)। सरकारी सेवा, न्यायपालिका के लिए उत्कृष्ट। उपचय भाव — 36 के बाद परिणाम नाटकीय रूप से सुधरते हैं।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'Marriage is delayed but serious, committed, and long-lasting when it arrives. The spouse may be older, more mature, or from a traditional/conservative background. Business partnerships require patience and formal agreements. The native earns respect in partnerships through reliability rather than charm. Can indicate an age-gap marriage or marriage for practical reasons that deepens into love over time. Saturn aspects the Lagna from here — the native appears more serious and disciplined after marriage. International business partnerships involving long-term contracts.', hi: 'विवाह विलम्बित किन्तु गम्भीर, प्रतिबद्ध और दीर्घस्थायी। जीवनसाथी वयस्क, परिपक्व या पारम्परिक पृष्ठभूमि का। व्यापारिक साझेदारियों में धैर्य और औपचारिक समझौतों की आवश्यकता। आकर्षण से नहीं विश्वसनीयता से साझेदारियों में सम्मान। आयु-अन्तर विवाह या व्यावहारिक कारणों से विवाह जो समय से प्रेम में गहरा। शनि यहाँ से लग्न को देखता है।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'Saturn as Ayushkaraka (longevity significator) in the house of longevity often grants a long life — but one marked by chronic challenges and transformative crises. The native faces their mortality early and develops profound existential maturity. Inheritance is delayed or involves legal complications. Chronic health conditions in joints, bones, or reproductive system. Interest in archaeology, mortuary science, and ancient history. Financial ups and downs through partner\'s resources. This placement produces philosophers who understand suffering deeply — the existentialists and the stoics.', hi: 'आयुष्कारक शनि आयु के भाव में प्रायः दीर्घायु देता है — किन्तु दीर्घकालिक चुनौतियों और परिवर्तनकारी संकटों से चिह्नित। जातक अपनी नश्वरता का शीघ्र सामना करता है। विरासत विलम्बित या कानूनी जटिलताओं सहित। जोड़ों, अस्थियों में दीर्घकालिक स्वास्थ्य। पुरातत्व और प्राचीन इतिहास में रुचि। पीड़ा को गहराई से समझने वाले दार्शनिक — अस्तित्ववादी और स्टोइक।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'Faith earned through doubt and suffering. The native does not receive dharma as a gift — they earn it through questioning, testing, and rebuilding their belief system from scratch. Father may face chronic hardships or be emotionally distant. Higher education is delayed or interrupted but eventually achieved with distinction. Long-distance travel involves work and hardship rather than pleasure. Can produce atheists who later become deeply spiritual through personal crisis. Legal career with a focus on justice for the underprivileged. Pilgrimage is arduous but profoundly transformative.', hi: 'सन्देह और पीड़ा से अर्जित श्रद्धा। जातक को धर्म उपहार में नहीं मिलता — प्रश्न, परीक्षा और अपनी विश्वास प्रणाली के पुनर्निर्माण से अर्जित। पिता को दीर्घकालिक कठिनाइयाँ या भावनात्मक दूरी। उच्च शिक्षा विलम्बित किन्तु अन्ततः विशिष्टता से। नास्तिक जो बाद में व्यक्तिगत संकट से गहन आध्यात्मिक। तीर्थयात्रा कठिन किन्तु गहन परिवर्तनकारी।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'Saturn is Digbali (directional strength) in the 10th — this is its most powerful angular placement. Career is the central axis of life. The native achieves high positions through decades of persistent effort. Government, judiciary, large corporations, and institutional leadership are natural domains. Professional reputation is built on reliability, discipline, and competence. Can form Shasha Yoga (Mahapurusha) if in own sign or exalted. Workaholic tendencies. The native may sacrifice personal life for professional achievement. This placement produces prime ministers, chief justices, and corporate titans.', hi: 'शनि 10वें भाव में दिग्बली — यह इसकी सबसे शक्तिशाली कोणीय स्थिति। करियर जीवन का केन्द्रीय अक्ष। दशकों के निरन्तर प्रयास से उच्च पद। सरकार, न्यायपालिका, बड़े निगम स्वाभाविक क्षेत्र। व्यावसायिक प्रतिष्ठा विश्वसनीयता, अनुशासन और योग्यता पर। शशक योग सम्भव। कार्यवाद प्रवृत्तियाँ। प्रधानमन्त्री, मुख्य न्यायाधीश और कॉर्पोरेट दिग्गज उत्पन्न करता है।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Excellent for wealth — Saturn in the 11th delivers large, consistent income through persistent effort. Gains come late but are substantial and lasting. Friends are few but loyal, older, and influential. Elder siblings may face hardships. Social network involves work colleagues and professional associations rather than casual friendships. Income through government, large organizations, technology, or institutional work. Desires are fulfilled — but slowly and through sustained effort rather than luck. This is an upachaya house — Saturn\'s results here are considered very favorable, especially after 36.', hi: 'धन के लिए उत्कृष्ट — 11वें भाव में शनि निरन्तर प्रयास से बड़ी, सुसंगत आय देता है। लाभ देर से किन्तु पर्याप्त और स्थायी। मित्र कम किन्तु वफादार, वयस्क और प्रभावशाली। सरकार, बड़े संगठनों, प्रौद्योगिकी से आय। इच्छाएँ पूर्ण — किन्तु भाग्य से नहीं निरन्तर प्रयास से। उपचय भाव — शनि के फल यहाँ बहुत अनुकूल, विशेषकर 36 के बाद।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'Expenses on chronic illness, legal matters, or institutional confinement (hospitals, prisons, ashrams). The native may work in isolation — laboratories, remote locations, or night shifts. Foreign lands involve hardship but also karmic completion. Sleep may be disturbed or insufficient. Feet and the lymphatic system are vulnerable. Spiritual practice is austere — silent meditation, fasting, and solitary retreat rather than devotional singing. Can indicate moksha through sustained suffering and renunciation. The native serves in places others avoid. Charitable giving is disciplined and systematic rather than emotional.', hi: 'दीर्घकालिक बीमारी, कानूनी मामलों या संस्थागत कारावास (अस्पताल, कारागार, आश्रम) पर व्यय। एकान्त में कार्य — प्रयोगशाला, दूरस्थ स्थान या रात्रि पाली। विदेश में कठिनाई किन्तु कार्मिक पूर्ति। नींद में बाधा। पैर और लसीका तन्त्र कमजोर। आध्यात्मिक साधना कठोर — मौन ध्यान, उपवास और एकान्त साधना। निरन्तर पीड़ा और त्याग से मोक्ष सम्भव।' } },
];

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 19,
  overview: {
    en: 'The Saturn Mahadasha lasts 19 years — the second-longest planetary period, and often the most transformative. This nearly two-decade span forces the native to confront karma, build discipline, and earn every achievement through sustained effort. Career, social status, and long-term ambitions become central. The native\'s relationship with authority, institutions, and the structure of their life is tested and rebuilt. Health challenges, especially related to bones, joints, and chronic conditions, may arise. For those with a well-placed Saturn, this can be the most productive and foundational period of life. For those with an afflicted Saturn, it can feel like 19 years of relentless challenge — but even then, the lessons are invaluable.',
    hi: 'शनि महादशा 19 वर्ष चलती है — दूसरी सबसे लम्बी ग्रह अवधि, और प्रायः सबसे परिवर्तनकारी। यह लगभग दो-दशक की अवधि जातक को कर्म का सामना करने, अनुशासन बनाने और निरन्तर प्रयास से हर उपलब्धि अर्जित करने के लिए विवश करती है। करियर, सामाजिक प्रतिष्ठा और दीर्घकालिक महत्वाकांक्षाएँ केन्द्रीय। सुस्थित शनि के लिए जीवन की सबसे उत्पादक और आधारभूत अवधि। पीड़ित शनि के लिए 19 वर्ष अथक चुनौती — किन्तु तब भी सबक अमूल्य।',
  },
  strongResult: {
    en: 'If Saturn is well-placed (own sign, exalted, or in upachaya/kendra): Career breakthrough after years of struggle, real estate acquisition, institutional leadership, government appointment, judicial authority, international recognition for sustained work, marriage stability, financial security through long-term investments, respect from community, legacy-building achievements.',
    hi: 'यदि शनि सुस्थित है (स्वराशि, उच्च, या उपचय/केन्द्र में): वर्षों के संघर्ष के बाद करियर सफलता, अचल सम्पत्ति अर्जन, संस्थागत नेतृत्व, सरकारी नियुक्ति, न्यायिक अधिकार, दीर्घकालिक कार्य के लिए अन्तर्राष्ट्रीय मान्यता, विवाह स्थिरता, दीर्घकालिक निवेश से आर्थिक सुरक्षा।',
  },
  weakResult: {
    en: 'If Saturn is afflicted (debilitated, combust, or in trikona with enemies): Chronic health issues (bones, joints, teeth, skin), career setbacks and demotions, legal troubles and imprisonment in extreme cases, depression and isolation, family burdens, financial losses through real estate or government penalties, strained relationships with authority, loss of social status.',
    hi: 'यदि शनि पीड़ित है (नीच, अस्त, या शत्रुओं के साथ त्रिकोण में): दीर्घकालिक स्वास्थ्य समस्याएँ (अस्थि, जोड़, दाँत, त्वचा), करियर में बाधा और पदावनति, कानूनी समस्याएँ, अवसाद और एकान्त, पारिवारिक बोझ, अचल सम्पत्ति या सरकारी दण्ड से आर्थिक हानि, सामाजिक प्रतिष्ठा की हानि।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', transliteration: 'Om Praam Preem Praum Sah Shanaischaraya Namah', count: '23,000 or 19,000 times in 40 days', en: 'The Shani Beej Mantra — chant on Saturdays facing west, preferably at sunset wearing dark blue or black clothes', hi: 'शनि बीज मन्त्र — शनिवार को पश्चिम की ओर मुख करके, सूर्यास्त पर गहरे नीले या काले वस्त्र पहनकर जाप करें' },
  gemstone: { en: 'Blue Sapphire (Neelam) — CAUTION: This is the most powerful and dangerous gemstone. It must be tested for 7 days before wearing permanently. Set in iron, steel, or silver (not gold), worn on the middle finger of the right hand on a Saturday during Krishna Paksha. Minimum 3 carats. Alternatives: Amethyst or Lapis Lazuli for milder effects.', hi: 'नीलम — सावधान: यह सबसे शक्तिशाली और खतरनाक रत्न है। स्थायी रूप से पहनने से पहले 7 दिन परीक्षण करें। लोहा, इस्पात या चाँदी (स्वर्ण नहीं) में जड़ित, शनिवार को कृष्ण पक्ष में दाहिने हाथ की मध्यमा में। न्यूनतम 3 कैरेट। विकल्प: अमेथिस्ट या लापिस लाजुली।' },
  charity: { en: 'Donate black clothes, iron utensils, sesame oil, mustard oil, black urad dal, leather shoes, and blankets on Saturdays. Feed crows and dogs. Serve the elderly, disabled, and underprivileged workers.', hi: 'शनिवार को काले वस्त्र, लोहे के बर्तन, तिल का तेल, सरसों का तेल, काली उड़द दाल, चमड़े के जूते और कम्बल दान करें। कौओं और कुत्तों को भोजन कराएँ। वृद्ध, विकलांग और वंचित श्रमिकों की सेवा करें।' },
  fasting: { en: 'Saturday fasting — eat only one meal of black or dark foods (urad dal, sesame, black salt). Some traditions recommend complete fasting from sunrise to sunset.', hi: 'शनिवार का उपवास — केवल एक भोजन काले या गहरे खाद्य पदार्थों का (उड़द दाल, तिल, काला नमक)। कुछ परम्पराएँ सूर्योदय से सूर्यास्त तक पूर्ण उपवास की सलाह देती हैं।' },
  worship: { en: 'Visit Shani temples or Hanuman temples on Saturdays (Hanuman is believed to have subdued Shani). Recite Shani Stotra or Hanuman Chalisa. Offer sesame oil lamp, black flowers, and iron to Shani Dev. Pour mustard oil on a Shani idol and observe your reflection in it.', hi: 'शनिवार को शनि मन्दिर या हनुमान मन्दिर जाएँ (हनुमान ने शनि को वश में किया था)। शनि स्तोत्र या हनुमान चालीसा का पाठ करें। शनि देव को तिल तेल का दीपक, काले पुष्प और लोहा अर्पित करें। शनि की मूर्ति पर सरसों का तेल चढ़ाएँ।' },
  yantra: { en: 'Shani Yantra — install on an iron plate, worship on Saturdays with sesame oil and black flowers. The Shani Yantra number is a 3×3 grid totaling 15 per row.', hi: 'शनि यन्त्र — लोहे के पत्र पर स्थापित करें, शनिवार को तिल तेल और काले पुष्प से पूजन करें। शनि यन्त्र 3×3 ग्रिड जिसमें प्रत्येक पंक्ति का योग 15 है।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'Shani is the son of Surya (Sun) and Chhaya (Shadow) — born when Sanjna, Surya\'s first wife, could not bear his brilliance and left her shadow in her place. Chhaya worshipped Shiva intensely during pregnancy, and the baby was born dark-complexioned from the heat of her tapas. When Shani first opened his eyes, his gaze fell on his father Surya and caused an eclipse — this is why Saturn\'s drishti (aspect/gaze) is considered the most powerful and feared in Jyotish. Surya initially rejected Shani, not recognizing him as his son, creating the eternal father-son tension that defines the Sun-Saturn axis in every horoscope. Shani became the embodiment of karma — the impartial judge who rewards and punishes based on deeds, not birth. He is Yama\'s brother, connecting him to death and justice.',
    hi: 'शनि सूर्य और छाया (प्रतिच्छाया) के पुत्र हैं — जब संज्ञा, सूर्य की प्रथम पत्नी, उनके तेज को सहन नहीं कर सकी और अपनी छाया छोड़ गई। छाया ने गर्भावस्था में शिव की तीव्र आराधना की, और शिशु तपस्या की गर्मी से श्यामवर्ण जन्मा। जब शनि ने पहली बार आँखें खोलीं, उनकी दृष्टि पिता सूर्य पर पड़ी और ग्रहण हुआ — इसीलिए शनि की दृष्टि ज्योतिष में सबसे शक्तिशाली और भयंकर मानी जाती है। सूर्य ने शनि को अपना पुत्र नहीं पहचाना — यही शाश्वत पिता-पुत्र तनाव हर कुण्डली में सूर्य-शनि अक्ष को परिभाषित करता है। शनि कर्म का मूर्तरूप बना — निष्पक्ष न्यायाधीश जो जन्म से नहीं कर्म से दण्ड-पुरस्कार देता है।',
  },
  temples: {
    en: 'Major Shani temples: Shani Shingnapur (Maharashtra) — where Shani Dev is worshipped as a self-manifested black stone; the village has no doors or locks, as Shani\'s justice protects everyone. Thirunallar Saniswaran Temple (Tamil Nadu) — the primary Navagraha Shani temple; pilgrims bathe in the temple tank to mitigate Sade Sati effects. Shani Dev Temple, Shanidham (Delhi-Agra highway) — major modern pilgrimage site. All Hanuman temples — Hanuman defeated Shani and is invoked as protection against Shani\'s malefic effects.',
    hi: 'प्रमुख शनि मन्दिर: शनि शिंगणापुर (महाराष्ट्र) — जहाँ शनि देव स्वयम्भू काले पत्थर के रूप में पूजित; गाँव में कोई दरवाज़ा या ताला नहीं, शनि का न्याय सबकी रक्षा करता है। तिरुनल्लार शनीश्वरन मन्दिर (तमिलनाडु) — प्राथमिक नवग्रह शनि मन्दिर; तीर्थयात्री साढ़ेसाती प्रभाव कम करने हेतु मन्दिर कुण्ड में स्नान करते हैं। शनि देव मन्दिर, शनिधाम (दिल्ली-आगरा राजमार्ग)। सभी हनुमान मन्दिर — हनुमान ने शनि को पराजित किया।',
  },
  stotra: {
    en: 'The Shani Stotra from the Navagraha Stotram: "Nilanjana Samabhasam, Ravi Putram Yamagrajam, Chhaya Martanda Sambhutam, Tam Namami Shanishcharam." Meaning: "I bow to Shani, whose complexion is like blue collyrium, who is the son of Surya, the elder brother of Yama, born of Chhaya and Surya — I salute that slow-moving one." The Dasharatha Shani Stotra — composed by King Dasharatha when Shani entered his birth star — is considered the most powerful remedy during Sade Sati.',
    hi: 'नवग्रह स्तोत्रम् से शनि स्तोत्र: "नीलाञ्जनसमाभासं रविपुत्रं यमाग्रजम्, छायामार्तण्डसम्भूतं तं नमामि शनैश्चरम्।" अर्थ: "मैं शनि को नमन करता हूँ जिनका वर्ण नीले अञ्जन के समान है, जो सूर्य के पुत्र हैं, यम के अग्रज हैं, छाया और सूर्य से उत्पन्न — उस धीमी गति वाले को नमस्कार।" दशरथ शनि स्तोत्र — राजा दशरथ द्वारा रचित जब शनि उनके जन्म नक्षत्र में प्रवेश किया — साढ़ेसाती में सबसे शक्तिशाली उपाय माना जाता है।',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Father and son in eternal conflict. Sun is authority by birthright; Saturn is authority earned through merit. Their conjunction creates Pitru Dosha and intense karmic pressure on the native\'s ego and relationship with father. Government career faces obstacles. The Sun-Saturn opposition is the most charged aspect in any chart — the axis of ego vs. humility.', hi: 'शाश्वत संघर्ष में पिता और पुत्र। सूर्य जन्मसिद्ध अधिकार; शनि योग्यता से अर्जित अधिकार। इनकी युति पितृ दोष और तीव्र कार्मिक दबाव बनाती है। सूर्य-शनि प्रतिपक्ष किसी भी कुण्डली में सबसे आवेशित दृष्टि — अहंकार बनाम विनम्रता का अक्ष।' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Saturn oppresses the mind (Moon). Sade Sati — Saturn\'s 7.5-year transit over the natal Moon — is the most feared astrological period. Can cause depression, anxiety, emotional numbness, and isolation. However, it also builds extraordinary emotional resilience. Saturn-Moon conjunction (Vish Yoga) creates a heavy mind that eventually develops profound psychological depth.', hi: 'शनि मन (चन्द्र) पर दबाव डालता है। साढ़ेसाती — जन्म चन्द्र पर शनि का 7.5-वर्षीय गोचर — सबसे भयंकर ज्योतिषीय काल। अवसाद, चिन्ता, भावनात्मक सुन्नता। किन्तु असाधारण भावनात्मक लचीलापन भी बनाता है। शनि-चन्द्र युति (विष योग) भारी मन जो अन्ततः गहन मनोवैज्ञानिक गहराई विकसित करता है।' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Discipline vs. aggression. Saturn restrains Mars\'s impulsiveness; Mars resents Saturn\'s slowness. Their conjunction creates frustrating stagnation — like driving with the brake and accelerator pressed simultaneously. Can produce accidents from impatient frustration. However, when harmonized: engineering brilliance, military discipline, and surgical precision. Construction and demolition industries.', hi: 'अनुशासन बनाम आक्रामकता। शनि मंगल की आवेगशीलता को रोकता है; मंगल शनि की धीमी गति से नाराज। इनकी युति निराशाजनक गतिरोध — ब्रेक और एक्सीलेटर साथ दबाना। किन्तु सामंजस्य होने पर: अभियान्त्रिकी प्रतिभा, सैन्य अनुशासन और शल्य सटीकता। निर्माण उद्योग।' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Analytical mind meets discipline — the perfect combination for science, mathematics, and technology. Saturn-Mercury conjunction produces systematic thinkers, programmers, and research scientists. Communication is precise and well-structured. Can excel in accounting, data analysis, and legal documentation. The mind works slowly but with extraordinary accuracy.', hi: 'विश्लेषणात्मक मन अनुशासन से मिलता है — विज्ञान, गणित और प्रौद्योगिकी के लिए आदर्श संयोग। शनि-बुध युति व्यवस्थित विचारक, प्रोग्रामर और शोध वैज्ञानिक उत्पन्न करती है। संवाद सटीक और सुसंरचित। लेखांकन, डेटा विश्लेषण में उत्कृष्ट। मन धीमा किन्तु असाधारण सटीकता से।' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Discipline meets beauty — enduring art, classical music, and timeless design. Saturn-Venus friendship produces architects, classical dancers, museum curators, and fashion houses that last generations. Marriage may be delayed but is stable and loyal. Material wealth comes through sustained creative effort. This is one of the most productive planetary friendships for building lasting cultural value.', hi: 'अनुशासन सौन्दर्य से मिलता है — चिरस्थायी कला, शास्त्रीय संगीत और कालातीत डिज़ाइन। शनि-शुक्र मैत्री वास्तुकार, शास्त्रीय नर्तक, संग्रहालय संरक्षक उत्पन्न करती है। विवाह विलम्बित किन्तु स्थिर और वफादार। स्थायी सांस्कृतिक मूल्य निर्माण के लिए सबसे उत्पादक ग्रह मैत्रियों में।' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Saturn and Jupiter together define the 60-year Samvatsara cycle — the longest meaningful astrological period. Jupiter expands; Saturn contracts. Together they create structured growth, institutional wisdom, and karmic accountability. Their conjunction every ~20 years marks major societal shifts. In a chart, they produce practical spirituality — the monk who also manages an ashram.', hi: 'शनि और गुरु मिलकर 60-वर्षीय सम्वत्सर चक्र परिभाषित करते हैं। गुरु विस्तार करता है; शनि संकुचित। साथ मिलकर संरचित विकास, संस्थागत ज्ञान और कार्मिक जवाबदेही बनाते हैं। प्रत्येक ~20 वर्ष में इनकी युति प्रमुख सामाजिक परिवर्तन चिह्नित करती है। कुण्डली में व्यावहारिक आध्यात्मिकता — आश्रम भी चलाने वाला सन्न्यासी।' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Saturn and Rahu together create Shrapit Yoga — a curse from past life that manifests as recurring obstacles, chronic delays, and karmic entanglements. The native feels stuck in cycles of frustration. However, when transcended, this combination produces unconventional disciplinarians — people who build revolutionary institutions. Technology, mining, and foreign connections are domains.', hi: 'शनि और राहु साथ श्रापित योग बनाते हैं — पूर्वजन्म का शाप जो बार-बार बाधाओं, दीर्घकालिक विलम्ब और कार्मिक उलझनों के रूप में प्रकट। जातक हताशा के चक्रों में फँसा महसूस करता है। किन्तु पार करने पर अपरम्परागत अनुशासक — क्रान्तिकारी संस्थाएँ बनाने वाले। प्रौद्योगिकी, खनन क्षेत्र।' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Saturn-Ketu conjunction creates deep detachment from material goals combined with karmic suffering. The native may experience inexplicable obstacles and spiritual crises. Can produce genuine ascetics who renounce worldly ambition through sustained hardship rather than philosophical choice. Technical skills in obsolete or niche domains. Past-life karma related to duty and service manifests.', hi: 'शनि-केतु युति भौतिक लक्ष्यों से गहरा वैराग्य कार्मिक पीड़ा के साथ बनाती है। अकथनीय बाधाएँ और आध्यात्मिक संकट। दार्शनिक चुनाव से नहीं निरन्तर कठिनाई से सांसारिक महत्वाकांक्षा का त्याग करने वाले सच्चे तपस्वी। कर्तव्य और सेवा से सम्बन्धित पूर्वजन्म कर्म प्रकट।' } },
];

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/surya', label: { en: 'Surya — The Sun', hi: 'सूर्य' } },
  { href: '/learn/guru', label: { en: 'Guru — Jupiter', hi: 'गुरु' } },
  { href: '/learn/shukra', label: { en: 'Shukra — Venus', hi: 'शुक्र' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/sade-sati', label: { en: 'Sade Sati Guide', hi: 'साढ़ेसाती मार्गदर्शिका' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Kundali', hi: 'कुण्डली में योग' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
  { href: '/learn/transit-guide', label: { en: 'Transit Analysis', hi: 'गोचर विश्लेषण' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function ShaniPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-saturn/15 border border-graha-saturn/30 mb-4">
          <span className="text-4xl">&#9796;</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Shani — Saturn', hi: 'शनि — शनि देव' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'Karmakaraka — the lord of karma, discipline, and longevity. The most feared yet most transformative planet in Vedic astrology. The cosmic judge who teaches through patience and hardship.', hi: 'कर्मकारक — कर्म, अनुशासन और दीर्घायु के स्वामी। वैदिक ज्योतिष में सबसे भयंकर किन्तु सबसे परिवर्तनकारी ग्रह। ब्रह्माण्डीय न्यायाधीश जो धैर्य और कठिनाई से सिखाता है।' })}
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
        <p style={bf}>{ml({ en: 'Shani (Saturn) is the most feared and misunderstood planet in Vedic astrology — but he is also the greatest teacher. As Karmakaraka (significator of karma), Saturn delivers the results of past actions with absolute impartiality. He does not punish for pleasure; he teaches through consequence. As Ayushkaraka (significator of longevity), he determines the length and quality of life. His orbit of ~29.5 years means he spends approximately 2.5 years in each sign — and when he transits the 12th, 1st, and 2nd from your natal Moon, you experience Sade Sati, the defining 7.5-year trial of every life. Saturn rules discipline, hard work, perseverance, and the structures that hold civilization together — law, government, institutions. Where Jupiter expands with optimism, Saturn contracts with reality. Both are necessary.', hi: 'शनि वैदिक ज्योतिष में सबसे भयंकर और गलत समझा जाने वाला ग्रह है — किन्तु वह सबसे बड़ा शिक्षक भी है। कर्मकारक के रूप में शनि पूर्ण निष्पक्षता से पूर्व कर्मों के फल देता है। वह सुख के लिए नहीं दण्डित करता; परिणाम से सिखाता है। आयुष्कारक के रूप में वह जीवन की लम्बाई और गुणवत्ता निर्धारित करता है। ~29.5 वर्ष की कक्षा का अर्थ है प्रत्येक राशि में लगभग 2.5 वर्ष — और जब वह आपके जन्म चन्द्र से 12वीं, 1ली और 2री राशि से गोचर करता है, तो आप साढ़ेसाती अनुभव करते हैं। शनि अनुशासन, कठिन परिश्रम और सभ्यता को धारण करने वाली संरचनाओं को शासित करता है।' })}</p>
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
        <p style={bf}>{ml({ en: 'Saturn\'s dignity determines whether its lessons come as structured growth or crushing hardship. Exalted in Libra at 20°, Saturn achieves its highest purpose — impartial justice, balanced authority, and disciplined fairness. Debilitated in Aries at 20°, Saturn\'s patience is broken by Mars\'s impulsiveness — the native wants results now but the universe demands they wait. In Capricorn (own sign), Saturn builds empires. In Aquarius (Moolatrikona 0°-20°), Saturn reforms societies.', hi: 'शनि की गरिमा निर्धारित करती है कि इसके सबक संरचित विकास या कठोर कठिनाई के रूप में आते हैं। तुला में 20° पर उच्च, शनि अपना उच्चतम उद्देश्य प्राप्त करता है — निष्पक्ष न्याय, सन्तुलित अधिकार। मेष में 20° पर नीच, शनि का धैर्य मंगल की आवेगशीलता से टूटता है। मकर में साम्राज्य बनाता है। कुम्भ (मूलत्रिकोण 0°-20°) में समाज सुधारता है।' })}</p>
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

      {/* ── 3. Saturn in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Saturn in the Twelve Signs', hi: 'बारह राशियों में शनि' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Saturn spends approximately 2.5 years in each sign, making its sign placement a generational marker. Everyone born within a ~2.5-year window shares the same Saturn sign. This creates generational themes — the collective karmic lessons a generation must learn. Saturn\'s house placement (from the ascendant) personalizes these lessons for each individual.', hi: 'शनि प्रत्येक राशि में लगभग 2.5 वर्ष बिताता है, जिससे इसकी राशि स्थिति एक पीढ़ीगत चिह्न बनती है। ~2.5 वर्ष के भीतर जन्मे सभी लोग एक ही शनि राशि साझा करते हैं। यह पीढ़ीगत विषय बनाता है — सामूहिक कार्मिक सबक जो एक पीढ़ी को सीखने चाहिए।' })}</p>
        {SATURN_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-saturn/10 rounded-xl p-4">
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

      {/* ── 4. Saturn in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Saturn in the Twelve Houses', hi: 'बारह भावों में शनि' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Saturn\'s special aspect (3rd, 7th, and 10th from itself) means it influences three additional houses wherever it sits. Saturn is Digbali (directional strength) in the 7th house in some traditions and in the 10th in most. In upachaya houses (3, 6, 10, 11), Saturn gives excellent results after age 36. In Kendras, Shasha Yoga (Mahapurusha) forms if Saturn is in own sign or exalted. In Dusthanas, the results require patience — decades of struggle before breakthrough.', hi: 'शनि की विशेष दृष्टि (अपने से 3रे, 7वें और 10वें भाव पर) का अर्थ है कि यह जहाँ भी बैठता है, तीन अतिरिक्त भावों को प्रभावित करता है। उपचय भावों (3, 6, 10, 11) में शनि 36 वर्ष की आयु के बाद उत्कृष्ट फल देता है। केन्द्रों में शशक योग (महापुरुष) बनता है यदि शनि स्वराशि या उच्च। दुस्थानों में सफलता से पहले दशकों का संघर्ष।' })}</p>
        {SATURN_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-saturn/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-saturn/15 border border-graha-saturn/30 flex items-center justify-center text-graha-saturn text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Planets in Houses)" />
      </LessonSection>

      {/* ── 5. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Shani Mahadasha (19 Years)', hi: 'शनि महादशा (19 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Saturn Dasha', hi: 'बलवान शनि दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongResult)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Saturn Dasha', hi: 'दुर्बल शनि दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakResult)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 6. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Saturn\'s relationships define many of the most significant yogas and doshas in Jyotish. The Sun-Saturn enmity creates Pitru Dosha. The Moon-Saturn tension triggers Sade Sati. The Mars-Saturn conflict causes accidents and frustration. But Saturn\'s friendships with Mercury (analytical precision) and Venus (enduring beauty) produce some of the most productive planetary combinations for career and art.', hi: 'शनि के सम्बन्ध ज्योतिष के कई सबसे महत्त्वपूर्ण योगों और दोषों को परिभाषित करते हैं। सूर्य-शनि शत्रुता पितृ दोष बनाती है। चन्द्र-शनि तनाव साढ़ेसाती को जन्म देता है। मंगल-शनि संघर्ष दुर्घटनाएँ। किन्तु बुध (विश्लेषणात्मक सटीकता) और शुक्र (चिरस्थायी सौन्दर्य) के साथ मैत्री करियर और कला के लिए सबसे उत्पादक ग्रह संयोग।' })}</p>
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
      <LessonSection number={next()} title={ml({ en: 'Remedies for Saturn', hi: 'शनि के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Saturn remedies are the most sought-after in Jyotish because Sade Sati affects everyone at least twice in life. CRITICAL WARNING: Blue Sapphire (Neelam) is the most powerful gemstone and must be tested for 7 days before permanent wear — if adverse events occur during the test, remove immediately. Saturn cannot be bribed or shortcut — the most effective remedy is to actually do the hard work Saturn demands: discipline, service, and patience.', hi: 'शनि उपाय ज्योतिष में सबसे अधिक माँगे जाते हैं क्योंकि साढ़ेसाती जीवन में कम से कम दो बार सभी को प्रभावित करती है। महत्त्वपूर्ण चेतावनी: नीलम सबसे शक्तिशाली रत्न है और स्थायी धारण से पहले 7 दिन परीक्षण अनिवार्य — परीक्षण में प्रतिकूल घटना हो तो तुरन्त उतारें। शनि को रिश्वत या शॉर्टकट नहीं दिया जा सकता — सबसे प्रभावी उपाय वह कठिन परिश्रम करना है जो शनि माँगता है।' })}</p>

        {/* Mantra */}
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-graha-saturn/15 rounded-xl p-5 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Beej Mantra', hi: 'बीज मन्त्र' })}</h4>
          <p className="text-gold-primary text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{REMEDIES.mantra.text}</p>
          <p className="text-text-secondary text-xs italic mb-2">{REMEDIES.mantra.transliteration}</p>
          <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES.mantra)}</p>
          <p className="text-text-secondary text-xs mt-1">{ml({ en: `Count: ${REMEDIES.mantra.count}`, hi: `जाप: ${REMEDIES.mantra.count}` })}</p>
        </div>

        {/* Other remedies */}
        {[
          { key: 'gemstone', title: { en: 'Gemstone — Blue Sapphire (Neelam)', hi: 'रत्न — नीलम' } },
          { key: 'charity', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', title: { en: 'Worship & Puja', hi: 'पूजा एवं उपासना' } },
          { key: 'yantra', title: { en: 'Shani Yantra', hi: 'शनि यन्त्र' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-3">
            <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'The most powerful Shani remedy is honest work, service to the underprivileged, and patience with life\'s difficulties. Saturn respects those who do not complain about their karma but work to transform it. Feeding crows, helping the elderly, and serving the disabled are considered the most effective practical remedies — they align you with Saturn\'s core principle: compassion for those at the bottom of the social structure.', hi: 'सबसे शक्तिशाली शनि उपाय ईमानदार कार्य, वंचितों की सेवा और जीवन की कठिनाइयों के प्रति धैर्य है। शनि उनका सम्मान करता है जो अपने कर्म की शिकायत नहीं करते बल्कि उसे बदलने का कार्य करते हैं। कौओं को खिलाना, बुजुर्गों की सहायता और विकलांगों की सेवा सबसे प्रभावी व्यावहारिक उपाय — ये आपको शनि के मूल सिद्धान्त से जोड़ते हैं: सामाजिक ढाँचे के सबसे नीचे वालों के प्रति करुणा।' })}
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
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Shani Stotra & Dasharatha Stotra', hi: 'शनि स्तोत्र एवं दशरथ स्तोत्र' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.stotra)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples', hi: 'पवित्र मन्दिर' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Characteristics" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Saturn is the Karmakaraka — significator of karma, discipline, and longevity. He teaches through patience and consequence, not punishment.', hi: 'शनि कर्मकारक है — कर्म, अनुशासन और दीर्घायु का कारक। वह दण्ड से नहीं, धैर्य और परिणाम से सिखाता है।' }),
        ml({ en: 'Exalted in Libra (20°), debilitated in Aries (20°). Own signs: Capricorn & Aquarius. Moolatrikona: Aquarius 0°-20°.', hi: 'तुला 20° में उच्च, मेष 20° में नीच। स्वराशि: मकर एवं कुम्भ। मूलत्रिकोण: कुम्भ 0°-20°।' }),
        ml({ en: 'Friends: Mercury, Venus. Enemies: Sun, Moon, Mars. Neutral: Jupiter. The Sun-Saturn enmity defines the ego-humility axis in every chart.', hi: 'मित्र: बुध, शुक्र। शत्रु: सूर्य, चन्द्र, मंगल। सम: गुरु। सूर्य-शनि शत्रुता हर कुण्डली में अहंकार-विनम्रता अक्ष परिभाषित करती है।' }),
        ml({ en: 'Mahadasha: 19 years. Remedy: Blue Sapphire (test first!), Saturday fasting, Hanuman Chalisa, sesame oil/iron charity, service to the elderly and underprivileged.', hi: 'महादशा: 19 वर्ष। उपाय: नीलम (पहले परीक्षण करें!), शनिवार उपवास, हनुमान चालीसा, तिल तेल/लोहा दान, वृद्ध और वंचितों की सेवा।' }),
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
