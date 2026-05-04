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
  { devanagari: 'केतु', transliteration: 'Ketu', meaning: { en: 'The banner / comet — the descending (south) lunar node', hi: 'ध्वज / धूमकेतु — चन्द्र का अवरोही (दक्षिण) पात' } },
  { devanagari: 'छायाग्रह', transliteration: 'Chhaaya Graha', meaning: { en: 'Shadow planet — no physical body', hi: 'छाया ग्रह — कोई भौतिक शरीर नहीं' } },
  { devanagari: 'मोक्षकारक', transliteration: 'Mokshakaraka', meaning: { en: 'Significator of spiritual liberation', hi: 'मोक्ष का कारक' } },
  { devanagari: 'ध्वज', transliteration: 'Dhvaja', meaning: { en: 'The flag / banner — symbol of past-life merit', hi: 'ध्वज — पूर्व जन्म के पुण्य का प्रतीक' } },
  { devanagari: 'शिखी', transliteration: 'Shikhi', meaning: { en: 'The crested one — the headless body with a tail', hi: 'शिखी — बिना सिर का शरीर जिसकी पूँछ है' } },
  { devanagari: 'विरागी', transliteration: 'Viragi', meaning: { en: 'The detached one — renunciation personified', hi: 'विरागी — वैराग्य का रूप' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Scorpio (Vrishchika) per Parashari tradition; Sagittarius (Dhanu) per some Jaimini scholars. Deepest exaltation at 20° Scorpio.', hi: 'पराशरी परम्परा में वृश्चिक; कुछ जैमिनी विद्वानों के अनुसार धनु। वृश्चिक 20° पर परम उच्च।' },
  debilitation: { en: 'Taurus (Vrishabha) per Parashari tradition; Gemini (Mithuna) per some. Deepest debilitation at 20° Taurus.', hi: 'पराशरी परम्परा में वृषभ; कुछ के अनुसार मिथुन। वृषभ 20° पर परम नीच।' },
  ownSign: { en: 'No classical own sign — but functions like Mars. Co-rules Scorpio (Vrishchika) per some modern traditions.', hi: 'शास्त्रीय रूप से कोई स्वराशि नहीं — किन्तु मंगल की भाँति कार्य करता है। कुछ आधुनिक परम्पराओं में वृश्चिक का सह-स्वामी।' },
  moolatrikona: { en: 'Sagittarius (Dhanu) per some authorities — debated among classical texts', hi: 'कुछ आचार्यों के अनुसार धनु — शास्त्रीय ग्रन्थों में विवादित' },
  friends: { en: 'Mars, Venus, Saturn', hi: 'मंगल, शुक्र, शनि' },
  enemies: { en: 'Sun, Moon', hi: 'सूर्य, चन्द्र' },
  neutral: { en: 'Jupiter, Mercury', hi: 'गुरु, बुध' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Maternal grandfather, ascetics, monks, sages, mystics, healers, veterinarians', hi: 'नाना (मातामह), तपस्वी, सन्यासी, ऋषि, रहस्यवादी, चिकित्सक, पशु चिकित्सक' },
  bodyParts: { en: 'Abdomen (no head), skin, nervous system, spine, feet, intestines', hi: 'उदर (सिर नहीं), त्वचा, तन्त्रिका तन्त्र, रीढ़, पैर, आँतें' },
  professions: { en: 'Spirituality, astrology, healing, surgery, computer programming, mathematics, research, monastic life', hi: 'आध्यात्मिकता, ज्योतिष, चिकित्सा, शल्य, कम्प्यूटर प्रोग्रामिंग, गणित, शोध, सन्यास जीवन' },
  materials: { en: 'Cat\'s Eye (Lehsunia/Vaidurya), mixed metals, dog, flag, sesame, blanket', hi: 'लहसुनिया (वैदूर्य), मिश्रित धातु, कुत्ता, ध्वज, तिल, कम्बल' },
  direction: { en: 'North-West (Vayuvya)', hi: 'उत्तर-पश्चिम (वायव्य)' },
  day: { en: 'Tuesday (shared with Mars)', hi: 'मंगलवार (मंगल के साथ साझा)' },
  color: { en: 'Smoky grey / Ash', hi: 'धूम्र धूसर / भस्म वर्ण' },
  season: { en: 'No specific season — operates outside natural cycles', hi: 'कोई विशेष ऋतु नहीं — प्राकृतिक चक्रों से बाहर कार्य करता है' },
  taste: { en: 'Pungent / Sharp', hi: 'तीक्ष्ण / कटु' },
  guna: { en: 'Tamas (but with Sattvic potential for moksha)', hi: 'तमस् (किन्तु मोक्ष के लिए सात्विक सम्भावना)' },
  element: { en: 'Fire (Agni) — purifying, not destructive', hi: 'अग्नि तत्त्व — शुद्धिकारक, विनाशकारी नहीं' },
  gender: { en: 'Neuter / Eunuch (per BPHS)', hi: 'नपुंसक (BPHS के अनुसार)' },
  nature: { en: 'Malefic (Krura Graha) — but the most spiritual of all planets. Detaches from whatever it touches.', hi: 'पापी (क्रूर ग्रह) — किन्तु सभी ग्रहों में सबसे आध्यात्मिक। जो छूता है उससे वैराग्य देता है।' },
};

// ─── Ketu in 12 Signs ─────────────────────────────────────────────────
const KETU_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: 'Neutral',
    effect: { en: 'Ketu in Aries (Rahu in Libra) — past-life mastery of independence, courage, and self-assertion. The native instinctively knows how to lead and fight but finds no satisfaction in it. Mars-ruled sign gives Ketu fierce spiritual intensity. Detachment from ego and personal identity. The native may appear warrior-like but is internally seeking peace through partnership (Rahu in Libra). Excellent for martial arts masters, surgeons, and spiritual warriors who fight inner battles rather than outer ones.', hi: 'केतु मेष में (राहु तुला में) — स्वतन्त्रता, साहस और आत्म-स्थापना में पूर्व जन्म की निपुणता। जातक स्वाभाविक रूप से नेतृत्व जानता है किन्तु उसमें सन्तुष्टि नहीं पाता। मंगल-शासित राशि केतु को तीव्र आध्यात्मिक तीक्ष्णता देती है। अहंकार और व्यक्तिगत पहचान से वैराग्य।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: 'Debilitated',
    effect: { en: 'Ketu is debilitated in Taurus (Rahu in Scorpio) — past-life expertise in material accumulation and sensory pleasure, but total disinterest now. The native may neglect finances, ignore physical comforts, and be careless about food and possessions. Venus-ruled sign clashes with Ketu\'s ascetic nature. Can indicate loss of family wealth, detachment from ancestral property, or indifference to appearance. The soul has "been there, done that" with material life — now craves transformation (Rahu in Scorpio).', hi: 'केतु वृषभ में नीच है (राहु वृश्चिक में) — भौतिक संचय और इन्द्रिय सुख में पूर्व जन्म की विशेषज्ञता, किन्तु अब पूर्ण उदासीनता। वित्त की उपेक्षा, भौतिक सुखों की अनदेखी। शुक्र-शासित राशि केतु के तपस्वी स्वभाव से टकराती है। पारिवारिक धन का नाश संभव।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: 'Neutral',
    effect: { en: 'Ketu in Gemini (Rahu in Sagittarius) — past-life mastery of communication, intellect, and information processing. The native intuitively grasps complex information but has no desire to communicate or network. Mercury-ruled sign gives Ketu razor-sharp analytical ability that operates below conscious awareness. Excellent for mathematicians, programmers, and silent researchers. May have speech impediments or choose silence deliberately. The soul now seeks higher truth (Rahu in Sagittarius) rather than data.', hi: 'केतु मिथुन में (राहु धनु में) — संवाद, बुद्धि और सूचना प्रसंस्करण में पूर्व जन्म की निपुणता। जातक जटिल सूचना सहज ग्रहण करता है किन्तु संवाद की इच्छा नहीं। बुध-शासित राशि चेतन स्तर से नीचे तीक्ष्ण विश्लेषणात्मक क्षमता देती है। गणितज्ञों और शोधकर्ताओं के लिए उत्कृष्ट।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: 'Neutral',
    effect: { en: 'Ketu in Cancer (Rahu in Capricorn) — past-life comfort with emotional nurturing, family, and domestic security. The native may appear emotionally detached, distant from mother, or indifferent to home. Moon-ruled sign makes this emotionally complex — feelings exist but the native doesn\'t engage with them. Can indicate leaving homeland, emotional stoicism, or difficulty expressing vulnerability. The soul now craves worldly achievement (Rahu in Capricorn). Excellent for counselors who help others with emotions they themselves have transcended.', hi: 'केतु कर्क में (राहु मकर में) — भावनात्मक पोषण, परिवार और घरेलू सुरक्षा में पूर्व जन्म का सुख। जातक भावनात्मक रूप से विरक्त, माता से दूर, या घर के प्रति उदासीन। चन्द्र-शासित राशि भावनात्मक रूप से जटिल बनाती है। मातृभूमि छोड़ना संभव।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: 'Neutral',
    effect: { en: 'Ketu in Leo (Rahu in Aquarius) — past-life mastery of personal power, creative expression, and royal authority. The native instinctively commands attention but is uncomfortable with fame and spotlight. Sun-ruled sign creates tension — Ketu dissolves the very ego that Leo demands. Can indicate detachment from children, creative blocks, or indifference to personal recognition. The soul now seeks collective service (Rahu in Aquarius). Produces selfless leaders, anonymous philanthropists, and those who serve without seeking credit.', hi: 'केतु सिंह में (राहु कुम्भ में) — व्यक्तिगत शक्ति, सृजनात्मक अभिव्यक्ति और राजसी अधिकार में पूर्व जन्म की निपुणता। जातक सहज ध्यान आकर्षित करता है किन्तु प्रसिद्धि से असहज। सूर्य-शासित राशि तनाव बनाती है — केतु वही अहंकार विलीन करता है जो सिंह माँगता है।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: 'Neutral',
    effect: { en: 'Ketu in Virgo (Rahu in Pisces) — past-life expertise in analysis, service, health, and practical perfection. The native has an intuitive grasp of systems, diagnostics, and detail work but finds no satisfaction in analytical pursuits. Mercury-ruled sign gives Ketu a sharp but detached intellect. Can indicate neglect of health routines, indifference to diet, or unconventional healing abilities. The soul now seeks spiritual transcendence (Rahu in Pisces). Excellent for intuitive healers, acupuncturists, and those who diagnose through sixth sense.', hi: 'केतु कन्या में (राहु मीन में) — विश्लेषण, सेवा, स्वास्थ्य और व्यावहारिक पूर्णता में पूर्व जन्म की विशेषज्ञता। प्रणालियों और विवरणों की सहज समझ किन्तु विश्लेषणात्मक कार्यों में सन्तुष्टि नहीं। सहज चिकित्सकों और छठी इन्द्रिय से निदान करने वालों के लिए उत्कृष्ट।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: 'Neutral',
    effect: { en: 'Ketu in Libra (Rahu in Aries) — past-life mastery of partnerships, diplomacy, and social harmony. The native instinctively understands relationships but is detached from the need for partnership. Venus-ruled sign gives Ketu aesthetic sensitivity without attachment to beauty. Can indicate disinterest in marriage, breakdowns in partnerships, or unconventional relationship structures. The soul now craves independent self-discovery (Rahu in Aries). Produces mediators who resolve conflicts without personal investment.', hi: 'केतु तुला में (राहु मेष में) — साझेदारी, राजनय और सामाजिक सामंजस्य में पूर्व जन्म की निपुणता। जातक सहज रूप से सम्बन्ध समझता है किन्तु साझेदारी की आवश्यकता से विरक्त। विवाह में अरुचि या अपरम्परागत सम्बन्ध संरचनाएँ। मध्यस्थों को जन्म देता है।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: 'Exalted',
    effect: { en: 'Ketu is exalted in Scorpio (Rahu in Taurus) — the most powerful spiritual placement. Past-life mastery of occult knowledge, transformation, and hidden realms. The native has deep intuitive access to kundalini energy, tantra, and mystical states. Mars-ruled sign gives Ketu fierce detachment — able to let go of anything, including life itself. Extraordinary for spiritual practice, meditation, psychic abilities, and past-life recall. Can indicate near-death experiences or profound transformations. Moksha is very accessible from this placement.', hi: 'केतु वृश्चिक में उच्च है (राहु वृषभ में) — सबसे शक्तिशाली आध्यात्मिक स्थिति। गूढ़ ज्ञान, परिवर्तन और छिपे लोकों में पूर्व जन्म की निपुणता। कुण्डलिनी ऊर्जा, तन्त्र और रहस्यमय अवस्थाओं तक गहन सहज पहुँच। आध्यात्मिक साधना और ध्यान के लिए असाधारण। मोक्ष इस स्थिति से अत्यन्त सुलभ।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Friendly',
    effect: { en: 'Ketu in Sagittarius (Rahu in Gemini) — past-life mastery of philosophy, dharma, higher education, and spiritual teaching. The native intuitively grasps philosophical truths without formal study. Jupiter-ruled sign gives Ketu access to wisdom, but the native may reject organized religion. Can indicate detachment from father, gurus, or traditional learning. Past lives as teachers, priests, or philosophers. The soul now seeks practical knowledge and communication skills (Rahu in Gemini). Produces silent sages and accidental philosophers.', hi: 'केतु धनु में (राहु मिथुन में) — दर्शन, धर्म, उच्च शिक्षा और आध्यात्मिक शिक्षण में पूर्व जन्म की निपुणता। जातक बिना औपचारिक अध्ययन दार्शनिक सत्य सहज ग्रहण करता है। गुरु-शासित राशि ज्ञान तक पहुँच देती है किन्तु संगठित धर्म का अस्वीकार संभव।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: 'Neutral',
    effect: { en: 'Ketu in Capricorn (Rahu in Cancer) — past-life mastery of worldly ambition, organizational power, and institutional authority. The native instinctively understands power structures but is detached from career ambition. Saturn-ruled sign gives Ketu disciplined detachment — able to walk away from positions of power without regret. Can indicate leaving successful careers for spiritual pursuit, or holding authority without attachment. The soul now craves emotional connection (Rahu in Cancer). Produces renunciants who were once kings.', hi: 'केतु मकर में (राहु कर्क में) — सांसारिक महत्वाकांक्षा, संगठनात्मक शक्ति और संस्थागत अधिकार में पूर्व जन्म की निपुणता। जातक सहज रूप से शक्ति संरचना समझता है किन्तु करियर महत्वाकांक्षा से विरक्त। सफल करियर छोड़कर आध्यात्मिक खोज संभव।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: 'Neutral',
    effect: { en: 'Ketu in Aquarius (Rahu in Leo) — past-life mastery of collective service, humanitarian causes, and technological innovation. The native instinctively understands networks and group dynamics but is detached from social belonging. Saturn-ruled sign gives Ketu systematic spiritual practice. Can indicate withdrawal from social groups, disinterest in technology despite understanding it, or serving causes without seeking membership. The soul now craves personal creative expression (Rahu in Leo). Produces anonymous benefactors and solitary innovators.', hi: 'केतु कुम्भ में (राहु सिंह में) — सामूहिक सेवा, मानवतावादी कार्यों और प्रौद्योगिकी नवाचार में पूर्व जन्म की निपुणता। जातक नेटवर्क और सामूहिक गतिशीलता सहज समझता है किन्तु सामाजिक सम्बद्धता से विरक्त। गुमनाम परोपकारी और एकान्त नवप्रवर्तक बनाता है।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Friendly',
    effect: { en: 'Ketu in Pisces (Rahu in Virgo) — past-life mastery of spirituality, mysticism, and transcendence. This is one of the most naturally spiritual placements. The native has deep intuitive access to meditation, compassion, and universal consciousness. Jupiter-ruled water sign dissolves Ketu\'s already detached nature into cosmic oneness. Can indicate psychic abilities, vivid dreams, astral travel, and natural samadhi states. The soul now seeks practical mastery of the material world (Rahu in Virgo). Must guard against spiritual bypassing and escapism.', hi: 'केतु मीन में (राहु कन्या में) — आध्यात्मिकता, रहस्यवाद और अतिक्रमण में पूर्व जन्म की निपुणता। सबसे स्वाभाविक आध्यात्मिक स्थितियों में एक। ध्यान, करुणा और सार्वभौमिक चेतना तक गहन सहज पहुँच। अतींद्रिय क्षमताएँ, सजीव स्वप्न और प्राकृतिक समाधि अवस्थाएँ संभव।' } },
];

// ─── Ketu in 12 Houses ────────────────────────────────────────────────
const KETU_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'Ketu in the ascendant creates a mysterious, otherworldly personality. The native may appear detached, spiritual, or eccentric. Physical appearance can be unusual — thin, ascetic, or marked in some way. Strong intuition and psychic sensitivity but difficulty relating to material world. Rahu in 7th drives the native toward partnerships and worldly connections. Can indicate past-life spiritual attainment. Excellent for healers, astrologers, and spiritual counselors. May struggle with personal identity and self-assertion.', hi: 'लग्न में केतु रहस्यमय, अलौकिक व्यक्तित्व बनाता है। जातक विरक्त, आध्यात्मिक या विलक्षण दिख सकता है। शारीरिक रूप असामान्य। प्रबल अन्तर्ज्ञान और अतींद्रिय संवेदनशीलता। 7वें में राहु साझेदारी की ओर प्रेरित करता है। चिकित्सकों और ज्योतिषियों के लिए उत्कृष्ट।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Ketu in the 2nd creates detachment from family wealth, speech, and material accumulation. The native may speak in riddles, have an unusual voice, or practice deliberate silence. Family lineage may be disrupted or unconventional. Eating habits can be ascetic or erratic. Past-life expertise with finances means the native has an intuitive sense of value but no desire to accumulate. Rahu in 8th drives toward hidden knowledge and transformation. Can indicate loss of family wealth or voluntary renunciation of inheritance.', hi: '2nd भाव में केतु पारिवारिक धन, वाणी और भौतिक संचय से वैराग्य बनाता है। जातक पहेलियों में बोल सकता है, असामान्य स्वर, या जानबूझकर मौन। आहार तपस्वी या अनियमित। 8वें में राहु गुप्त ज्ञान और परिवर्तन की ओर। पारिवारिक धन का नाश या स्वैच्छिक त्याग।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Ketu in the 3rd gives past-life courage and communication mastery but present-life detachment from these. The native may be exceptionally brave when needed but doesn\'t seek adventure. Writing ability exists but may remain unexpressed. Relationship with siblings can be distant or complicated. Rahu in 9th drives toward higher education, foreign travel, and spiritual seeking. Good for contemplative writers, spiritual journalists, and those who communicate profound truths in few words.', hi: '3rd भाव में केतु पूर्व जन्म का साहस और संवाद निपुणता देता है किन्तु वर्तमान में इनसे वैराग्य। जातक आवश्यकता पड़ने पर असाधारण बहादुर किन्तु साहसिक कार्य नहीं खोजता। भाई-बहनों से दूर। 9वें में राहु उच्च शिक्षा और विदेश यात्रा की ओर।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'Ketu in the 4th detaches from domestic comfort, homeland, and mother. The native may leave their birthplace early, live in austere conditions by choice, or feel emotionally disconnected from family. Mother may be spiritual, absent, or unusual in some way. Property matters may bring unexpected changes. Rahu in 10th drives intense career ambition and public recognition. Produces wandering monks, digital nomads, and leaders who sacrifice home life for professional achievement. Inner peace comes from detachment, not possession.', hi: '4th भाव में केतु घरेलू सुख, मातृभूमि और माता से वैराग्य। जातक जन्मभूमि शीघ्र छोड़ सकता है, स्वेच्छा से कठिन परिस्थितियों में रह सकता है। माता आध्यात्मिक या अनुपस्थित। 10वें में राहु तीव्र करियर महत्वाकांक्षा। भ्रमणशील सन्यासी और डिजिटल घुमक्कड़ बनाता है।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Ketu in the 5th creates detachment from children, romance, and speculative ventures. Intelligence is intuitive rather than analytical — the native "knows" without knowing how. Past-life spiritual practice gives strong mantra siddhi and meditation ability. Children may be fewer, spiritually inclined, or come through unusual circumstances. Romance may feel flat or purposeless. Rahu in 11th drives toward large networks and material gains. Excellent for astrologers, meditators, and those who teach through silence rather than lectures.', hi: '5th भाव में केतु सन्तान, प्रेम और सट्टे से वैराग्य। बुद्धि विश्लेषणात्मक नहीं बल्कि सहज — जातक "जानता है" बिना जाने कैसे। पूर्व जन्म की साधना से प्रबल मन्त्र सिद्धि और ध्यान क्षमता। 11वें में राहु बड़े नेटवर्क और भौतिक लाभ की ओर।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'Ketu in the 6th is a powerful placement — enemies and diseases dissolve through past-life merit. The native has natural immunity to conflicts and obstacles. Can indicate spiritual protection from accidents and adversaries. Health issues may be mysterious or psychosomatic. Excellent for healers who cure through unconventional methods. Rahu in 12th drives toward foreign lands and spiritual retreat. This placement gives victory over the material world\'s challenges through detachment rather than combat. One of Ketu\'s best house placements.', hi: '6th भाव में केतु शक्तिशाली स्थिति — शत्रु और रोग पूर्व जन्म के पुण्य से विलीन। संघर्षों और बाधाओं से प्राकृतिक प्रतिरक्षा। दुर्घटनाओं से आध्यात्मिक सुरक्षा। अपरम्परागत विधियों से चिकित्सा करने वालों के लिए उत्कृष्ट। 12वें में राहु विदेश और आध्यात्मिक एकान्त की ओर।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'Ketu in the 7th creates detachment from partnerships, marriage, and business alliances. The native may marry late, have an unconventional marriage, or remain single by choice. The spouse may be spiritual, ascetic, or foreign. Business partnerships may dissolve unexpectedly. Rahu in 1st gives a magnetic, ambitious personality that craves personal achievement. Produces spiritual teachers who counsel others on relationships they themselves have transcended. Must learn to balance personal ambition with partnership commitment.', hi: '7th भाव में केतु साझेदारी, विवाह और व्यावसायिक गठबन्धन से वैराग्य। जातक विलम्ब से विवाह कर सकता है या स्वेच्छा से अविवाहित। जीवनसाथी आध्यात्मिक या विदेशी। 1st में राहु चुम्बकीय, महत्वाकांक्षी व्यक्तित्व। आध्यात्मिक शिक्षक बनाता है।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'Ketu in the 8th is deeply transformative — the native has past-life familiarity with death, rebirth, and hidden knowledge. Intuitive access to occult sciences, astrology, kundalini, and tantra. Can indicate sudden spiritual awakenings, near-death experiences, or past-life memories. Longevity is usually good — Ketu protects in the house of death through detachment. Rahu in 2nd drives accumulation of wealth and speech mastery. Produces natural psychics, past-life regression therapists, and researchers into consciousness.', hi: '8th भाव में केतु गहन परिवर्तनकारी — मृत्यु, पुनर्जन्म और गुप्त ज्ञान से पूर्व जन्म का परिचय। गूढ़ विज्ञान, ज्योतिष, कुण्डलिनी और तन्त्र तक सहज पहुँच। अचानक आध्यात्मिक जागृति या पूर्व जन्म स्मृतियाँ। 2nd में राहु धन संचय की ओर। प्राकृतिक अतींद्रिय और चेतना शोधकर्ता।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'Ketu in the 9th creates detachment from organized religion, formal philosophy, and the father figure. The native has past-life spiritual wisdom but may reject traditional religious structures. Father may be absent, spiritual, or unconventional. Higher education may be disrupted or pursued unconventionally. Rahu in 3rd drives toward communication, media, and short-distance travel. Produces independent spiritual seekers, unorthodox philosophers, and those who find God outside temples. Pilgrimage is internal rather than external.', hi: '9th भाव में केतु संगठित धर्म, औपचारिक दर्शन और पिता से वैराग्य। पूर्व जन्म का आध्यात्मिक ज्ञान किन्तु पारम्परिक धार्मिक संरचनाओं का अस्वीकार। पिता अनुपस्थित या अपरम्परागत। 3rd में राहु संवाद और मीडिया की ओर। स्वतन्त्र आध्यात्मिक साधक और अपरम्परागत दार्शनिक।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'Ketu in the 10th detaches from conventional career ambition and public recognition. The native has past-life authority and professional mastery but finds no satisfaction in career achievement. Reputation may be unpredictable — alternating between fame and obscurity. Can indicate walking away from successful careers for spiritual pursuit. Rahu in 4th drives toward emotional security and property. Produces monks who were once administrators, or professionals who work without attachment to outcome. Career may involve healing, astrology, or spiritual counseling.', hi: '10th भाव में केतु पारम्परिक करियर महत्वाकांक्षा और सार्वजनिक मान्यता से वैराग्य। पूर्व जन्म का अधिकार और व्यावसायिक निपुणता किन्तु करियर उपलब्धि में सन्तुष्टि नहीं। सफल करियर छोड़कर आध्यात्मिक खोज। 4th में राहु भावनात्मक सुरक्षा की ओर।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Ketu in the 11th detaches from large gains, social networks, and the fulfillment of desires. The native may earn well but feel indifferent to accumulation. Friendships may be few but deeply spiritual. Elder siblings may be detached or absent. Rahu in 5th drives creative expression, romance, and speculation. Produces philanthropists who give away wealth without attachment, or spiritual communities where members serve without personal gain. Income may come from spiritual or healing work.', hi: '11th भाव में केतु बड़े लाभ, सामाजिक नेटवर्क और इच्छा पूर्ति से वैराग्य। जातक अच्छी कमाई कर सकता है किन्तु संचय के प्रति उदासीन। मित्रता कम किन्तु गहन आध्यात्मिक। 5th में राहु सृजनात्मक अभिव्यक्ति की ओर। परोपकारी जो बिना आसक्ति धन देते हैं।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'Ketu in the 12th is the ultimate moksha placement — the planet of liberation in the house of liberation. The native has powerful access to meditation, dreams, astral travel, and spiritual dimensions. Past-life spiritual practice is so strong that enlightenment may come naturally. Can indicate life in ashrams, hospitals, or foreign monasteries. Sleep may be unusual — vivid dreams, astral experiences, or very little need for sleep. Rahu in 6th gives power to overcome worldly obstacles. This placement has produced many saints, mystics, and enlightened beings throughout history.', hi: '12th भाव में केतु परम मोक्ष स्थिति — मुक्ति का ग्रह मुक्ति के भाव में। ध्यान, स्वप्न, सूक्ष्म यात्रा और आध्यात्मिक आयामों तक शक्तिशाली पहुँच। पूर्व जन्म की साधना इतनी प्रबल कि ज्ञान स्वाभाविक रूप से आ सकता है। आश्रमों या विदेशी मठों में जीवन। 6th में राहु सांसारिक बाधाओं पर विजय। इतिहास में अनेक सन्तों और रहस्यवादियों ने यह स्थिति धारण की है।' } },
];

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 7,
  overview: {
    en: 'Ketu\'s Vimshottari Mahadasha lasts 7 years — relatively short but intensely transformative. This period strips away what the soul no longer needs. Material attachments, relationships, career positions, or belief systems that have served their purpose will dissolve — willingly or unwillingly. The native is forced to confront what truly matters. Spiritual growth accelerates dramatically. Events during Ketu dasha often feel fated, sudden, and beyond personal control. The person who exits Ketu dasha is fundamentally different from the one who entered it — lighter, freer, and more focused on essence over form.',
    hi: 'केतु की विंशोत्तरी महादशा 7 वर्ष चलती है — अपेक्षाकृत छोटी किन्तु अत्यन्त परिवर्तनकारी। यह अवधि वह छीन लेती है जिसकी आत्मा को अब आवश्यकता नहीं। भौतिक आसक्तियाँ, सम्बन्ध, करियर पद या विश्वास प्रणालियाँ जिन्होंने अपना उद्देश्य पूरा कर लिया — विलीन होंगे। आध्यात्मिक विकास नाटकीय रूप से त्वरित होता है। केतु दशा से निकलने वाला व्यक्ति प्रवेश करने वाले से मौलिक रूप से भिन्न होता है।',
  },
  strongResult: {
    en: 'If Ketu is well-placed (exalted, in friendly sign, or in moksha houses 4/8/12): Spiritual awakening, deep meditation experiences, past-life recall, liberation from karmic debts, success in research and occult sciences, healing abilities manifest, recognition as a spiritual authority.',
    hi: 'यदि केतु सुस्थित है (उच्च, मित्र राशि, या मोक्ष भाव 4/8/12 में): आध्यात्मिक जागृति, गहन ध्यान अनुभव, पूर्व जन्म स्मृति, कार्मिक ऋणों से मुक्ति, शोध और गूढ़ विज्ञान में सफलता, चिकित्सा क्षमताएँ प्रकट, आध्यात्मिक अधिकार की मान्यता।',
  },
  weakResult: {
    en: 'If Ketu is afflicted (debilitated, with malefics, or in dusthana without benefic aspect): Sudden losses, accidents, mysterious illnesses, spiritual confusion, isolation, separation from family, suicidal thoughts, skin diseases, surgery, dog bites, and aimless wandering.',
    hi: 'यदि केतु पीड़ित है (नीच, पापी ग्रहों के साथ, या शुभ दृष्टि बिना दुस्थान में): अचानक हानि, दुर्घटनाएँ, रहस्यमय बीमारियाँ, आध्यात्मिक भ्रम, एकान्त, परिवार से अलगाव, त्वचा रोग, शल्य, कुत्ते का काटना, और लक्ष्यहीन भटकना।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः', transliteration: 'Om Sraam Sreem Sraum Sah Ketave Namah', count: '17,000 or 7,000 times in 40 days', en: 'The Ketu Beej Mantra — chant during dawn or dusk, preferably on Tuesdays or Saturdays. Use a rudraksha mala for counting.', hi: 'केतु बीज मन्त्र — प्रातः या सन्ध्या में जाप करें, अधिमानतः मंगलवार या शनिवार को। गणना के लिए रुद्राक्ष माला का प्रयोग करें।' },
  gemstone: { en: 'Cat\'s Eye (Lehsunia / Vaidurya) — set in silver or gold, worn on the middle finger or ring finger of the right hand on a Tuesday during Ketu-ruled nakshatra (Ashwini, Magha, Moola). Minimum 3 carats. Must touch the skin. WARNING: Cat\'s Eye is extremely powerful — results manifest very quickly, both good and bad. Only wear after thorough chart analysis.', hi: 'लहसुनिया (वैदूर्य) — रजत या स्वर्ण में जड़ित, मंगलवार को केतु-शासित नक्षत्र (अश्विनी, मघा, मूल) में दाहिने हाथ की मध्यमा या अनामिका में धारण करें। न्यूनतम 3 कैरेट। चेतावनी: लहसुनिया अत्यन्त शक्तिशाली — परिणाम बहुत शीघ्र प्रकट, शुभ और अशुभ दोनों।' },
  charity: { en: 'Donate sesame seeds, blankets, mixed-grain bread, dog food, and grey/ash-colored items on Tuesdays. Feed stray dogs — Ketu is the lord of dogs. Donate to spiritual institutions, monasteries, and meditation centers.', hi: 'मंगलवार को तिल, कम्बल, मिश्रित अनाज की रोटी, कुत्तों का भोजन और धूसर वस्तुएँ दान करें। आवारा कुत्तों को खिलाएँ — केतु कुत्तों का स्वामी है। आध्यात्मिक संस्थाओं और ध्यान केन्द्रों को दान करें।' },
  fasting: { en: 'Tuesday or Saturday fasting. Some traditions prescribe fasting on Ganesh Chaturthi (Ketu is associated with Ganesha — the headless one finds kinship with the elephant-headed one). Abstain from non-vegetarian food on fasting days.', hi: 'मंगलवार या शनिवार का उपवास। कुछ परम्पराओं में गणेश चतुर्थी का उपवास (केतु गणेश से सम्बन्धित — बिना सिर वाले को गजमुख से सम्बन्ध)। उपवास के दिन माँसाहार वर्जित।' },
  worship: { en: 'Worship Lord Ganesha — the elephant-headed God has deep affinity with Ketu. Recite Ketu Kavach or Ganesha Atharvashirsha. Perform Nag Puja (serpent worship). The most powerful remedy: regular meditation practice — Ketu IS the planet of meditation; sitting in silence aligns you with Ketu\'s highest vibration. Visit Ketu temples during eclipses.', hi: 'भगवान गणेश की पूजा करें — गजानन का केतु से गहरा सम्बन्ध। केतु कवच या गणेश अथर्वशीर्ष का पाठ। नाग पूजा करें। सबसे शक्तिशाली उपाय: नियमित ध्यान अभ्यास — केतु ध्यान का ग्रह है; मौन में बैठना केतु की उच्चतम कम्पन से जोड़ता है।' },
  yantra: { en: 'Ketu Yantra — a 3x3 magic square with Ketu-specific numerical arrangement. Install on a silver plate or bhojpatra, worship on Tuesdays. Keep in the prayer room or meditation space. Combine with a dhvaja (flag) — Ketu\'s symbol.', hi: 'केतु यन्त्र — केतु-विशिष्ट संख्यात्मक व्यवस्था का 3x3 जादुई वर्ग। रजत पत्र या भोजपत्र पर स्थापित करें, मंगलवार को पूजन। पूजा कक्ष या ध्यान स्थान में रखें। ध्वज के साथ — केतु का प्रतीक।' },
  dietary: { en: 'Ketu responds to simple, sattvic (pure) foods. Feed stray dogs — this is the single most recommended Ketu remedy across all Jyotish traditions. Ketu is the lord of dogs, and caring for them directly aligns with Ketu\'s energy of unconditional loyalty and service without ego. Sesame seeds (til), mixed grains, and ash gourd are Ketu foods. Avoid highly processed or artificial foods during Ketu dasha. Fasting with simple foods (fruits, grains) on Tuesdays or during Ganesh Chaturthi strengthens Ketu\'s spiritual dimension. Kusha grass water (used in Vedic rituals) is a traditional Ketu purification practice.', hi: 'केतु सरल, सात्विक (शुद्ध) खाद्य पदार्थों से प्रतिक्रिया करता है। आवारा कुत्तों को खिलाएँ — यह सभी ज्योतिष परम्पराओं में सबसे अनुशंसित केतु उपाय। केतु कुत्तों का स्वामी, उनकी देखभाल केतु की बिना अहंकार सेवा ऊर्जा से सीधे जुड़ती है। तिल, मिश्रित अनाज और पेठा केतु खाद्य। केतु दशा में अत्यधिक प्रसंस्कृत भोजन से बचें। मंगलवार या गणेश चतुर्थी का उपवास केतु के आध्यात्मिक आयाम को मजबूत करता है।' },
  behavioral: { en: 'Ketu\'s most powerful behavioral remedy is meditation — sitting in silence for even 15-20 minutes daily aligns you directly with Ketu\'s highest vibration. Other behavioral practices: fly a flag (dhvaja) at your home or workplace — Ketu\'s symbol is the flag, representing spiritual victory. Practice non-attachment in daily life: donate regularly, help without expecting recognition, and release outcomes. Spend time with dogs and animals. Visit ancient temples, ruins, and archaeological sites — Ketu resonates with the past. Avoid excessive screen time and social media (these amplify Rahu, Ketu\'s opposite). Walk in nature, practice breath awareness, and cultivate the ability to be comfortable with silence and solitude.', hi: 'केतु का सबसे शक्तिशाली व्यावहारिक उपाय ध्यान है — दैनिक 15-20 मिनट मौन में बैठना केतु की उच्चतम कम्पन से सीधे जोड़ता है। अन्य: घर या कार्यस्थल पर ध्वज लगाएँ — केतु का प्रतीक। दैनिक जीवन में अनासक्ति का अभ्यास: नियमित दान, मान्यता की अपेक्षा बिना सहायता। कुत्तों और जानवरों के साथ समय बिताएँ। प्राचीन मन्दिर और पुरातात्विक स्थल देखें। अत्यधिक स्क्रीन समय से बचें। प्रकृति में चलें और मौन में सहजता विकसित करें।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'Ketu is the headless body of the demon Svarbhanu, severed by Vishnu\'s Sudarshana Chakra during the Samudra Manthan. While Rahu (the head) eternally chases the luminaries in hunger, Ketu (the body) wanders without direction, without desire, without purpose — and therein lies its spiritual power. Having lost its head, Ketu cannot think, plan, or desire in the ordinary sense. It operates through intuition, instinct, and past-life memory. The headless wanderer is free from the prison of the mind — this is why Ketu is the Mokshakaraka, the significator of liberation. The very wound that created Ketu also freed it.',
    hi: 'केतु दैत्य स्वर्भानु का बिना सिर का शरीर है, समुद्र मन्थन में विष्णु के सुदर्शन चक्र से कटा। जबकि राहु (सिर) भूख में शाश्वत रूप से ज्योतियों का पीछा करता है, केतु (शरीर) बिना दिशा, बिना इच्छा, बिना उद्देश्य भटकता है — और इसी में इसकी आध्यात्मिक शक्ति है। अपना सिर खो देने से केतु सामान्य अर्थ में सोच, योजना या इच्छा नहीं कर सकता। यह अन्तर्ज्ञान और पूर्व जन्म स्मृति से कार्य करता है। बिना सिर का भटकने वाला मन के बन्धन से मुक्त है — इसीलिए केतु मोक्षकारक है।',
  },
  temples: {
    en: 'Major Ketu temples: Keezhaperumpallam Naganathaswamy Temple (Tamil Nadu) — the primary Ketu worship temple among the Navagraha temples; Srikalahasti Temple (Andhra Pradesh) — where Rahu-Ketu dosha puja is performed; the Trimbakeshwar Temple (Maharashtra) — known for Kaal Sarpa Dosha remediation. Ketu is also worshipped in conjunction with Ganesha temples, as both share the headless/elephant-head symbolism of transcending the mind.',
    hi: 'प्रमुख केतु मन्दिर: कीझपेरुम्पल्लम् नागनाथस्वामी मन्दिर (तमिलनाडु) — नवग्रह मन्दिरों में प्रमुख केतु पूजा स्थल; श्रीकालहस्ती मन्दिर (आन्ध्र प्रदेश) — राहु-केतु दोष पूजा; त्र्यम्बकेश्वर मन्दिर (महाराष्ट्र) — काल सर्प दोष उपचार। केतु की पूजा गणेश मन्दिरों में भी होती है, क्योंकि दोनों मन के अतिक्रमण का प्रतीक साझा करते हैं।',
  },
  keyHymn: {
    en: 'The Ketu Kavach from the Skanda Purana begins: "Chitravarnah Shirah Paatu Bhaalaam Dhoomrasamadyutih" — "May the multi-colored one protect my head, may the smoke-lustred one guard my forehead." The Ketu Gayatri is also recited: "Om Ashvadhvajaya Vidmahe, Shoola Hastaya Dhimahi, Tanno Ketuh Prachodayat" — "We meditate upon the flag-bearing one, we contemplate the trident-holder; may Ketu illuminate our intellect."',
    hi: 'स्कन्द पुराण का केतु कवच प्रारम्भ: "चित्रवर्णः शिरः पातु भालां धूम्रसमद्युतिः" — "चित्रवर्ण मेरे सिर की रक्षा करे, धूम्रद्युति मेरे ललाट की।" केतु गायत्री भी पढ़ी जाती है: "ॐ अश्वध्वजाय विद्महे, शूलहस्ताय धीमहि, तन्नो केतुः प्रचोदयात्" — "हम ध्वजधारी का ध्यान करते हैं, त्रिशूलधारी का चिन्तन; केतु हमारी बुद्धि प्रेरित करे।"',
  },
  headlessSymbolism: {
    en: 'The headless body of Ketu carries profound spiritual symbolism. The head represents the thinking mind — ego, planning, desire, identity, and the constant chatter of consciousness. By losing its head, Ketu is freed from all of these. It operates through the body\'s wisdom — instinct, intuition, muscle memory, and the accumulated experience of countless incarnations. This is why Ketu natives often "know" things without being able to explain how. Ketu\'s headlessness is not a curse but a liberation — the mind is the primary obstacle to enlightenment, and Ketu has transcended it. Every meditation tradition teaches the same truth: silence the mind, and liberation follows. Ketu is already there.',
    hi: 'केतु का बिना सिर का शरीर गहन आध्यात्मिक प्रतीक है। सिर सोचने वाले मन का प्रतिनिधि — अहंकार, योजना, इच्छा, पहचान और चेतना की निरन्तर बातचीत। सिर खो देने से केतु इन सबसे मुक्त है। यह शरीर के ज्ञान से कार्य करता है — सहज ज्ञान, अन्तर्ज्ञान और अनगिनत अवतारों का संचित अनुभव। इसीलिए केतु जातक प्रायः बिना बता सके "जानते" हैं। केतु का बिना सिर होना शाप नहीं मुक्ति है — मन ज्ञान की प्रमुख बाधा है और केतु ने इसे पार किया है।',
  },
  ganeshaConnection: {
    en: 'The connection between Ketu and Lord Ganesha is one of the deepest in Vedic astrology. Ganesha lost his original head when Shiva severed it, then received an elephant head — just as Svarbhanu lost his head and became two beings (Rahu and Ketu). Both Ganesha and Ketu represent transcendence of the human mind through apparent loss. Ganesha is the remover of obstacles (Vighnaharta) — and Ketu, as the planet of detachment, removes the greatest obstacle of all: attachment itself. Worshipping Ganesha during Ketu periods is considered the most natural and effective remedy because both deities share the same cosmic principle: what appears as loss or limitation is actually the gateway to liberation.',
    hi: 'केतु और भगवान गणेश का सम्बन्ध वैदिक ज्योतिष में सबसे गहरे में एक है। गणेश ने अपना मूल सिर खोया जब शिव ने काटा, फिर गज सिर प्राप्त किया — जैसे स्वर्भानु ने सिर खोया और दो सत्ता बना। गणेश और केतु दोनों स्पष्ट हानि से मानव मन के अतिक्रमण का प्रतिनिधित्व करते हैं। गणेश विघ्नहर्ता — और केतु, वैराग्य का ग्रह, सबसे बड़ी बाधा दूर करता है: आसक्ति ही। केतु काल में गणेश पूजा सबसे स्वाभाविक और प्रभावी उपाय क्योंकि दोनों एक ही ब्रह्माण्डीय सिद्धान्त साझा करते हैं।',
  },
  liberationThroughSuffering: {
    en: 'Ketu\'s path to liberation runs through suffering — not cruel suffering, but the productive suffering of letting go. Every attachment the soul releases creates space for deeper awareness. Ketu doesn\'t destroy — it completes. What feels like loss during Ketu periods is actually the completion of a karmic cycle. The relationship that ends during Ketu dasha has served its purpose. The career that dissolves has taught its lessons. The health crisis forces attention to what truly matters. This is why Ketu is simultaneously the most feared and the most revered planet in spiritual astrology — it gives the one thing every soul ultimately wants (liberation), through the one thing every ego resists (surrender).',
    hi: 'केतु का मुक्ति मार्ग पीड़ा से गुजरता है — क्रूर पीड़ा नहीं, बल्कि त्याग की उत्पादक पीड़ा। हर आसक्ति जो आत्मा छोड़ती है गहन जागरूकता के लिए स्थान बनाती है। केतु नष्ट नहीं करता — पूर्ण करता है। केतु काल में जो हानि लगती है वास्तव में कार्मिक चक्र की पूर्णता है। केतु दशा में समाप्त सम्बन्ध ने अपना उद्देश्य पूरा किया। विलीन करियर ने सबक सिखाया। केतु वह एक चीज देता है जो हर आत्मा अन्ततः चाहती है (मुक्ति), उस एक चीज से जिसका हर अहंकार विरोध करता है (समर्पण)।',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Ketu detaches from what Sun represents — ego dissolves, identity fragments. Sun-Ketu conjunction can bring spiritual awakening but worldly difficulties with father, government, and authority. The native may have a crisis of identity that ultimately leads to self-realization.', hi: 'केतु सूर्य के प्रतिनिधित्व से वैराग्य — अहंकार विलीन, पहचान खण्डित। सूर्य-केतु युति आध्यात्मिक जागृति किन्तु पिता, सरकार और अधिकार से कठिनाइयाँ। पहचान का संकट जो अन्ततः आत्म-साक्षात्कार की ओर ले जाता है।' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Ketu-Moon conjunction creates emotional numbness, detachment from feelings, and difficulty connecting with the inner world. Mother may be absent or spiritual. But also gives exceptional meditation ability — the mind that doesn\'t cling to emotions enters silence naturally. Chandala Yoga variant.', hi: 'केतु-चन्द्र युति भावनात्मक शून्यता, भावनाओं से वैराग्य। माता अनुपस्थित या आध्यात्मिक। किन्तु असाधारण ध्यान क्षमता भी — भावनाओं से न चिपकने वाला मन स्वाभाविक रूप से मौन में प्रवेश करता है।' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Ketu with Mars creates fierce spiritual warriors — intense determination applied to spiritual practice. Past-life martial skill. Can indicate surgery, accidents through fire, or military-like spiritual discipline. Both Mars and Ketu are fiery — together they can destroy obstacles to moksha with volcanic force.', hi: 'केतु मंगल के साथ तीव्र आध्यात्मिक योद्धा बनाता है — आध्यात्मिक साधना में तीव्र दृढ़ संकल्प। पूर्व जन्म का सैन्य कौशल। शल्य या अग्नि से दुर्घटना। दोनों अग्निमय — मोक्ष की बाधाओं को ज्वालामुखी बल से नष्ट करते हैं।' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Ketu with Mercury creates detachment from rational thinking — the native operates on intuition rather than logic. Speech may be unusual or sparse. Can indicate disinterest in formal education but extraordinary mathematical or programming ability. The analytical mind is transcended, not destroyed.', hi: 'केतु बुध के साथ तर्कसंगत सोच से वैराग्य — तर्क नहीं अन्तर्ज्ञान से कार्य। वाणी असामान्य या विरल। औपचारिक शिक्षा में अरुचि किन्तु असाधारण गणितीय क्षमता। विश्लेषणात्मक मन का अतिक्रमण, विनाश नहीं।' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Ketu with Jupiter can indicate a past-life guru — spiritual wisdom comes naturally. But may also create confusion between genuine spirituality and escapism. The native may reject formal religion while being deeply spiritual. Can produce great astrologers and silent masters. Jupiter\'s expansion meets Ketu\'s dissolution — wisdom through letting go.', hi: 'केतु गुरु के साथ पूर्व जन्म का गुरु — आध्यात्मिक ज्ञान स्वाभाविक। किन्तु वास्तविक आध्यात्मिकता और पलायनवाद में भ्रम भी। औपचारिक धर्म का अस्वीकार किन्तु गहन आध्यात्मिकता। महान ज्योतिषी और मौन गुरु बनाता है।' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Ketu with Venus detaches from romance, luxury, and sensory pleasure. The native may be indifferent to beauty despite creating beautiful things. Relationships may feel unfulfilling. But also gives exceptional artistic ability — art created without ego attachment becomes transcendent. Past-life aesthetic mastery.', hi: 'केतु शुक्र के साथ प्रेम, विलास और इन्द्रिय सुख से वैराग्य। सुन्दर चीजें बनाने के बावजूद सौन्दर्य के प्रति उदासीन। सम्बन्ध अतृप्त। किन्तु असाधारण कलात्मक क्षमता — अहंकार बिना कला अतिक्रान्त बनती है।' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Ketu-Saturn conjunction creates extreme asceticism, renunciation, and disciplined spiritual practice. Both are planets of detachment — together they strip life to its essentials. Can indicate poverty by choice, monastic life, or working in prisons/hospitals. Past-life karmic debt related to duty and service. This is the combination of the renunciant.', hi: 'केतु-शनि युति अत्यधिक तपस्या, त्याग और अनुशासित आध्यात्मिक साधना बनाती है। दोनों वैराग्य के ग्रह — साथ में जीवन को मूल तत्वों तक सीमित करते हैं। स्वेच्छा से दरिद्रता, सन्यास जीवन। त्यागी का संयोग।' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, relation: { en: 'Axis partner', hi: 'धुरी साझीदार' }, note: { en: 'Ketu and Rahu are always exactly 180° apart — the eternal axis of desire (Rahu) and detachment (Ketu). Where Rahu obsessively craves, Ketu effortlessly releases. Together they define the soul\'s journey from past mastery toward future growth. The transit of this axis through your chart activates the deepest karmic transformations.', hi: 'केतु और राहु सदा ठीक 180° पर — इच्छा (राहु) और वैराग्य (केतु) की शाश्वत धुरी। जहाँ राहु जुनूनी रूप से चाहता है, केतु सहज त्यागता है। साथ में पूर्व निपुणता से भविष्य विकास की ओर आत्मा की यात्रा परिभाषित करते हैं।' } },
];

// ─── Astronomical Profile ─────────────────────────────────────────────
const ASTRONOMICAL = {
  nodalCycle: { en: 'Ketu, as the south (descending) lunar node, completes the same 18.61-year cycle as Rahu — they are always exactly 180 degrees apart. When Rahu enters Aries, Ketu simultaneously enters Libra. This astronomical fact is the basis for the Rahu-Ketu axis that dominates karmic analysis in Jyotish. Ketu spends approximately 18 months in each sign before moving to the previous sign (retrograde motion). The nodal cycle was known to ancient Indian astronomers as the Metonic-adjacent cycle and was used to predict eclipses with remarkable accuracy.', hi: 'केतु, दक्षिण (अवरोही) चन्द्र पात के रूप में, राहु के समान 18.61 वर्ष का चक्र पूरा करता है — वे सदा ठीक 180 अंश पर हैं। जब राहु मेष में प्रवेश करता है, केतु एक साथ तुला में प्रवेश करता है। यह खगोलीय तथ्य ज्योतिष में कार्मिक विश्लेषण पर हावी राहु-केतु धुरी का आधार है। प्रत्येक राशि में लगभग 18 महीने बिताता है।' },
  alwaysRetrograde: { en: 'Like Rahu, Ketu is always retrograde in the Mean Node system. In the True Node system, Ketu briefly moves direct for short periods, but its dominant motion is perpetually backward through the zodiac. This retrograde nature perfectly symbolizes Ketu\'s spiritual function: looking backward — toward past lives, past mastery, and the accumulated wisdom of previous incarnations. While Rahu\'s retrograde motion represents karmic hunger reaching into the past, Ketu\'s retrograde represents karmic completion — the soul\'s backward glance at what it has already mastered, before moving forward.', hi: 'राहु की तरह, केतु मध्य पात प्रणाली में सदा वक्री है। सत्य पात प्रणाली में केतु संक्षेप में मार्गी होता है, किन्तु इसकी प्रमुख गति शाश्वत पश्चगामी है। यह वक्री स्वभाव केतु के आध्यात्मिक कार्य को पूर्णतः प्रतीकित करता है: पीछे देखना — पूर्व जन्मों, पूर्व निपुणता और पिछले अवतारों के संचित ज्ञान की ओर।' },
  eclipseRole: { en: 'While Rahu causes eclipses at the ascending node (north), Ketu causes eclipses at the descending node (south). A solar eclipse occurs at Ketu when the Moon passes between the Sun and Earth near the descending node. A lunar eclipse occurs at Ketu when the Earth\'s shadow falls on the Moon near the descending node. Ketu eclipses are associated in Jyotish with spiritual awakening, endings, and the dissolution of what no longer serves the soul — while Rahu eclipses are associated with new beginnings and obsessive desire. The eclipse season at Ketu is the time when past-life karmas surface for final resolution.', hi: 'जबकि राहु आरोही पात (उत्तर) पर ग्रहण करता है, केतु अवरोही पात (दक्षिण) पर ग्रहण करता है। केतु पर सूर्यग्रहण तब होता है जब चन्द्र अवरोही पात के निकट सूर्य और पृथ्वी के बीच गुजरता है। केतु ग्रहण ज्योतिष में आध्यात्मिक जागृति, अन्त और जो आत्मा की सेवा नहीं करता उसके विलय से सम्बन्धित। केतु पर ग्रहण ऋतु पूर्व जन्म कर्मों के अन्तिम समाधान का समय।' },
  meanVsTrue: { en: 'The Mean Node vs. True Node distinction applies equally to Ketu (which is always 180 degrees from Rahu). Mean Ketu moves at a constant average rate of about 0.053 degrees/day retrograde. True Ketu oscillates around this mean, occasionally appearing to move direct for a few days. The difference between Mean and True Ketu can be up to 1.5 degrees. For spiritual interpretation, many classical astrologers prefer the Mean Node because its consistent retrograde motion better represents Ketu\'s nature of steady, unwavering detachment. For predictive timing, the True Node may give slightly more accurate results for eclipse predictions.', hi: 'मध्य पात बनाम सत्य पात विभेद केतु (जो सदा राहु से 180 अंश) पर समान लागू। मध्य केतु लगभग 0.053 अंश/दिन वक्री की स्थिर औसत गति से चलता है। सत्य केतु इस मध्य के चारों ओर दोलन करता है। अन्तर 1.5 अंश तक। आध्यात्मिक व्याख्या के लिए अनेक शास्त्रीय ज्योतिषी मध्य पात पसन्द करते हैं। भविष्यवाणी समय के लिए सत्य पात अधिक सटीक।' },
};

// ─── Notable Yogas ────────────────────────────────────────────────────
const NOTABLE_YOGAS = [
  { name: { en: 'Kala Sarpa Yoga (Ketu variant)', hi: 'काल सर्प योग (केतु रूप)' },
    condition: { en: 'All seven visible planets hemmed on the Ketu side of the nodal axis — all planets between Ketu and Rahu (moving in zodiacal order). The direction matters: if planets are concentrated on the Ketu side, the yoga has a more spiritual, internalized quality.', hi: 'सभी सात दृश्य ग्रह पात धुरी के केतु पक्ष में घिरे — राशिक्रम में केतु और राहु के बीच। दिशा महत्वपूर्ण: यदि ग्रह केतु पक्ष में केन्द्रित, योग अधिक आध्यात्मिक, आन्तरिक गुणवत्ता रखता है।' },
    effect: { en: 'When all planets are on the Ketu side of the axis, the soul\'s energy is directed inward — toward spiritual transformation, past-life resolution, and detachment from worldly pursuits. This variant (sometimes called "Kala Amrita Yoga" by some modern astrologers) tends to produce introspective, spiritually-oriented lives rather than the dramatic external swings of Rahu-side Kala Sarpa. The native may feel pulled between worldly obligations and an overwhelming urge to renounce. Remedies include Kaal Sarpa puja and regular meditation practice. Frequency: approximately 3-5% of charts.', hi: 'जब सभी ग्रह धुरी के केतु पक्ष में, आत्मा की ऊर्जा अन्तर्मुखी — आध्यात्मिक परिवर्तन, पूर्व जन्म समाधान और सांसारिक कार्यों से वैराग्य की ओर। यह रूप आत्मनिरीक्षी, आध्यात्मिक-उन्मुख जीवन उत्पन्न करता है। जातक सांसारिक दायित्व और त्याग की प्रबल इच्छा के बीच खिंचा महसूस कर सकता है। आवृत्ति: लगभग 3-5%।' } },
  { name: { en: 'Ganesha Yoga (Ketu + Jupiter)', hi: 'गणेश योग (केतु + गुरु)' },
    condition: { en: 'Ketu conjunct Jupiter in a kendra or trikona house, especially in watery or spiritual signs (Cancer, Scorpio, Pisces). Also considered when Ketu is in Jupiter\'s sign (Sagittarius or Pisces) with Jupiter\'s aspect.', hi: 'केतु गुरु से केन्द्र या त्रिकोण भाव में युत, विशेषकर जलीय या आध्यात्मिक राशियों (कर्क, वृश्चिक, मीन) में। केतु गुरु की राशि (धनु या मीन) में गुरु की दृष्टि के साथ भी।' },
    effect: { en: 'Named after Lord Ganesha — who shares Ketu\'s headless symbolism (Ganesha lost his original head and received an elephant head). This yoga grants exceptional spiritual wisdom, intuitive intelligence, and the ability to remove obstacles through inner knowing rather than force. The native may be drawn to Ganesha worship spontaneously. Past-life spiritual merit manifests as natural philosophical depth and an ability to guide others through their darkest passages. Produces silent wisdom teachers and spiritual counselors with genuine insight. Frequency: approximately 5-7% of charts.', hi: 'भगवान गणेश के नाम पर — जो केतु का बिना सिर का प्रतीक साझा करते हैं (गणेश ने अपना मूल सिर खोया और गज सिर प्राप्त किया)। असाधारण आध्यात्मिक ज्ञान, सहज बुद्धि और बल से नहीं बल्कि आन्तरिक ज्ञान से बाधाओं को दूर करने की क्षमता। जातक स्वतः गणेश पूजा की ओर आकर्षित। मौन ज्ञान शिक्षक और वास्तविक अन्तर्दृष्टि वाले आध्यात्मिक परामर्शदाता। आवृत्ति: लगभग 5-7%।' } },
  { name: { en: 'Moksha Yoga Conditions', hi: 'मोक्ष योग स्थितियाँ' },
    condition: { en: 'Ketu in the 12th house (especially in Pisces, Scorpio, or Cancer), OR Ketu conjunct the 12th lord, OR Ketu in the 4th/8th house with Jupiter\'s aspect, OR Ketu in exaltation (Scorpio) in any moksha house.', hi: 'केतु 12वें भाव में (विशेषकर मीन, वृश्चिक, या कर्क), या केतु 12वें भावेश से युत, या केतु 4/8वें भाव में गुरु दृष्टि के साथ, या केतु उच्च (वृश्चिक) में किसी मोक्ष भाव में।' },
    effect: { en: 'These conditions create the classical Moksha Yoga — the yoga of spiritual liberation. The native has strong past-life spiritual practice and is naturally drawn to meditation, renunciation, and transcendence. Life events may systematically strip away attachments until only the essential remains. Dreams are vivid and often prophetic. The native may experience spontaneous samadhi, past-life recall, or encounters with spiritual masters. Not every person with Moksha Yoga achieves liberation — free will and conscious practice are still required — but the potential and the pull are unmistakable. Many saints throughout history had these configurations.', hi: 'ये स्थितियाँ शास्त्रीय मोक्ष योग बनाती हैं — आध्यात्मिक मुक्ति का योग। प्रबल पूर्व जन्म आध्यात्मिक साधना और ध्यान, त्याग और अतिक्रमण की ओर स्वाभाविक आकर्षण। जीवन घटनाएँ व्यवस्थित रूप से आसक्तियाँ छीन सकती हैं। स्वतः समाधि, पूर्व जन्म स्मृति, या आध्यात्मिक गुरुओं से मिलन। हर मोक्ष योग वाला मुक्ति प्राप्त नहीं करता — स्वतन्त्र इच्छा और सचेत साधना अभी भी आवश्यक — किन्तु सम्भावना और खिंचाव अमिट।' } },
  { name: { en: 'Pishacha Yoga (Ketu + Moon, afflicted)', hi: 'पिशाच योग (केतु + चन्द्र, पीड़ित)' },
    condition: { en: 'Ketu conjunct Moon with additional malefic influence (Mars or Saturn aspect/conjunction), especially in the 1st, 4th, 8th, or 12th house without any benefic relief.', hi: 'केतु चन्द्र से युत अतिरिक्त पापी प्रभाव (मंगल या शनि दृष्टि/युति) के साथ, विशेषकर 1, 4, 8 या 12वें भाव में बिना शुभ राहत।' },
    effect: { en: 'Creates severe emotional detachment, psychological disturbances, and difficulty connecting with reality. The native may experience depersonalization, dissociation, or feel like they are watching their own life from outside. In extreme cases, it can indicate mental health challenges that require professional support. However, even this difficult yoga has a silver lining — the complete detachment from emotional reactivity can, when properly guided, become the foundation for genuine spiritual awakening. The cure mirrors the disease: what dissolves the ego can also liberate the soul. Frequency: approximately 3% of charts in its severe form.', hi: 'गम्भीर भावनात्मक वैराग्य, मनोवैज्ञानिक गड़बड़ी और वास्तविकता से जुड़ने में कठिनाई। जातक अवैयक्तिकरण, विघटन अनुभव कर सकता है। चरम स्थिति में मानसिक स्वास्थ्य चुनौतियाँ। किन्तु इस कठिन योग में भी उम्मीद — भावनात्मक प्रतिक्रियाशीलता से पूर्ण वैराग्य, उचित मार्गदर्शन से, वास्तविक आध्यात्मिक जागृति का आधार बन सकता है। गम्भीर रूप में आवृत्ति: लगभग 3%।' } },
];

// ─── Practical Application ────────────────────────────────────────────
const PRACTICAL = {
  ketuDasha: {
    en: 'Ketu Mahadasha (7 years) is the shortest major dasha but among the most intense. It strips away whatever the soul no longer needs — careers that have run their course dissolve, relationships built on illusion end, and health issues force attention to the body. Survival strategy: (1) Do not resist the dissolution — fighting Ketu only prolongs suffering. (2) Lean into spiritual practice — meditation, yoga, and introspection are Ketu\'s natural domain. (3) Expect confusion about direction — Ketu removes the signposts; trust your intuition. (4) Health: watch for mysterious symptoms, skin issues, and digestive problems. (5) The Ketu-Ketu antardasha (first 5 months) and Ketu-Venus antardasha (last 14 months) are often the most challenging sub-periods. (6) Keep a journal — Ketu dasha insights often make sense only in retrospect.',
    hi: 'केतु महादशा (7 वर्ष) सबसे छोटी प्रमुख दशा किन्तु सबसे तीव्र में। आत्मा को जो अनावश्यक वह छीन लेती है — समाप्त हो चुके करियर विलीन, भ्रम पर बने सम्बन्ध समाप्त। उत्तरजीविता: (1) विलय का विरोध न करें। (2) आध्यात्मिक साधना में डूबें — ध्यान और योग केतु का क्षेत्र। (3) दिशा में भ्रम अपेक्षित। (4) स्वास्थ्य: रहस्यमय लक्षण, त्वचा और पाचन देखें। (5) केतु-केतु और केतु-शुक्र अन्तर्दशा सबसे चुनौतीपूर्ण। (6) डायरी रखें।',
  },
  mokshaIndicators: {
    en: 'Moksha indicators in a chart are dominated by Ketu\'s placement and condition. Strongest moksha potential: Ketu in 12th house (especially Pisces), Ketu exalted in Scorpio in a moksha house, Ketu conjunct Jupiter with spiritual sign placement, Ketu in the 4th or 8th with Jupiter\'s aspect, and strong 12th house with Ketu\'s involvement. Supporting factors: Saturn and Ketu in mutual aspect, Moon-Ketu conjunction resolved through meditation practice, and Ketu\'s dispositor being Jupiter or a spiritual planet. Moksha doesn\'t mean leaving the world — it means living in the world without being trapped by it. Many householders achieve moksha while fulfilling their worldly duties; the key is internal detachment, not external renunciation.',
    hi: 'कुण्डली में मोक्ष संकेतकों में केतु की स्थिति प्रमुख। सबसे प्रबल मोक्ष सम्भावना: 12वें भाव में केतु (विशेषकर मीन), वृश्चिक में उच्च मोक्ष भाव में, गुरु से युत, 4 या 8वें भाव में गुरु दृष्टि। सहायक कारक: शनि-केतु पारस्परिक दृष्टि, ध्यान से समाधान चन्द्र-केतु युति। मोक्ष संसार छोड़ना नहीं — संसार में रहकर उसमें फँसे बिना जीना। अनेक गृहस्थ सांसारिक कर्तव्य निभाते हुए मोक्ष प्राप्त करते हैं।',
  },
  misconceptions: {
    en: 'The most common misconception about Ketu is that it is "only spiritual" and has no practical value. In reality, Ketu gives extraordinary technical skills — programming, mathematics, surgery, and precision work all thrive under Ketu\'s influence because Ketu operates through intuition and pattern recognition rather than conscious analysis. Many tech entrepreneurs have strong Ketu placements. The second misconception: "Ketu always causes loss." Ketu causes detachment, not necessarily loss. The native may have wealth but feel indifferent to it, or hold a position of power but derive no satisfaction from it. The third misconception: "Ketu makes you a monk." Most people with strong Ketu live normal lives — they simply bring a layer of detachment and intuitive wisdom to everything they do.',
    hi: 'केतु के बारे में सबसे आम भ्रान्ति कि यह "केवल आध्यात्मिक" है और कोई व्यावहारिक मूल्य नहीं। वास्तव में केतु असाधारण तकनीकी कौशल देता है — प्रोग्रामिंग, गणित, शल्य और सटीक कार्य। अनेक तकनीकी उद्यमियों में प्रबल केतु। दूसरी भ्रान्ति: "केतु सदा हानि करता है।" केतु वैराग्य देता है, हानि नहीं। तीसरी भ्रान्ति: "केतु सन्यासी बनाता है।" अधिकांश प्रबल केतु वाले सामान्य जीवन जीते हैं — बस सब में वैराग्य और सहज ज्ञान की परत लाते हैं।',
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/rahu', label: { en: 'Rahu — The North Node', hi: 'राहु — उत्तर पात' } },
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/doshas', label: { en: 'Doshas in Kundali', hi: 'कुण्डली में दोष' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
  { href: '/learn/transit-guide', label: { en: 'Transit Guide', hi: 'गोचर मार्गदर्शिका' } },
  { href: '/learn/mangal', label: { en: 'Mangal — Mars', hi: 'मंगल' } },
  { href: '/learn/surya', label: { en: 'Surya — The Sun', hi: 'सूर्य' } },
  { href: '/learn/shani', label: { en: 'Shani — Saturn', hi: 'शनि' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function KetuPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-ketu/15 border border-graha-ketu/30 mb-4">
          <span className="text-4xl">&#9739;</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Ketu — The South Lunar Node', hi: 'केतु — दक्षिण चन्द्र पात' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The shadow planet of detachment, moksha, and past-life wisdom. Mokshakaraka — the headless wanderer who liberates the soul from the prison of desire. Always retrograde, always dissolving, always pointing toward liberation.', hi: 'वैराग्य, मोक्ष और पूर्व जन्म ज्ञान का छाया ग्रह। मोक्षकारक — बिना सिर का भटकने वाला जो आत्मा को इच्छा के बन्धन से मुक्त करता है। सदा वक्री, सदा विलीन करता, सदा मुक्ति की ओर इंगित।' })}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-graha-ketu/10 border border-graha-ketu/20 text-sm text-text-secondary">
          {ml({ en: 'Always Retrograde | Chhaya Graha (Shadow Planet) | Mokshakaraka', hi: 'सदा वक्री | छाया ग्रह | मोक्षकारक' })}
        </div>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Overview & Nature ── */}
      <LessonSection number={next()} title={ml({ en: 'Overview & Nature', hi: 'परिचय एवं स्वभाव' })}>
        <p style={bf}>{ml({ en: 'Ketu is the other Chhaya Graha (shadow planet) — the descending (south) lunar node, the point where the Moon\'s orbit crosses below the ecliptic. Like Rahu, it has no physical body. But while Rahu is the head without a body (all desire, no contentment), Ketu is the body without a head (no desire, pure instinct). Ketu is the great detacher — whatever sign, house, or planet it touches, it strips away attachment. Where Rahu amplifies obsessively, Ketu dissolves effortlessly. Ketu represents past-life mastery, inherited skills, and spiritual wisdom that the soul has already earned. It is the Mokshakaraka — the significator of liberation — because liberation requires releasing everything the ego clings to.', hi: 'केतु अन्य छाया ग्रह है — अवरोही (दक्षिण) चन्द्र पात, वह बिन्दु जहाँ चन्द्र की कक्षा क्रान्तिवृत्त से नीचे जाती है। राहु की तरह इसका कोई भौतिक शरीर नहीं। किन्तु जबकि राहु बिना शरीर का सिर है (सारी इच्छा, कोई सन्तुष्टि नहीं), केतु बिना सिर का शरीर है (कोई इच्छा नहीं, शुद्ध सहज ज्ञान)। केतु महान वैरागी है — जिस राशि, भाव या ग्रह को छूता है, आसक्ति छीन लेता है। केतु मोक्षकारक है क्योंकि मुक्ति के लिए अहंकार जो पकड़ता है वह सब छोड़ना आवश्यक है।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGNIFICATIONS).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-graha-ketu/15 p-3">
              <span className="text-graha-ketu text-xs uppercase tracking-wider">{key}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Visheshaphala (Shadow Planets)" />
      </LessonSection>

      {/* ── 2. Astronomical Profile ── */}
      <LessonSection number={next()} title={ml({ en: 'Astronomical Profile', hi: 'खगोलीय परिचय' })}>
        <div className="space-y-4">
          {Object.entries(ASTRONOMICAL).map(([key, val]) => (
            <div key={key} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-4">
              <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{key === 'nodalCycle' ? ml({ en: '18.6-Year Nodal Cycle', hi: '18.6 वर्ष का पात चक्र' }) : key === 'alwaysRetrograde' ? ml({ en: 'Always Retrograde — Looking Backward', hi: 'सदा वक्री — पीछे देखना' }) : key === 'eclipseRole' ? ml({ en: 'Eclipse Role — The Descending Node', hi: 'ग्रहण भूमिका — अवरोही पात' }) : ml({ en: 'Mean Node vs. True Node', hi: 'मध्य पात बनाम सत्य पात' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="Surya Siddhanta" chapter="Ch. 2 — Motions of Lunar Nodes" />
      </LessonSection>

      {/* ── 3. Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Dignities & Strength', hi: 'गरिमा एवं बल' })}>
        <p style={bf}>{ml({ en: 'Like Rahu, Ketu\'s dignities are debated. The Parashari tradition places Ketu\'s exaltation in Scorpio (exactly opposite to Rahu\'s exaltation in Taurus) and debilitation in Taurus (opposite to Rahu\'s debilitation in Scorpio). This makes astronomical sense — the nodes are always opposite each other. Ketu functions like Mars — it is fierce, sudden, and transformative when active, and withdrawn, intuitive, and mystical when passive. Ketu is ALWAYS retrograde — this perpetual backward motion reflects its nature of looking toward the past, toward what has already been mastered.', hi: 'राहु की तरह, केतु की गरिमाएँ विवादित हैं। पराशरी परम्परा केतु का उच्च वृश्चिक में (राहु के वृषभ उच्च के ठीक विपरीत) और नीच वृषभ में (राहु के वृश्चिक नीच के विपरीत)। यह खगोलीय रूप से उचित है — पात सदा विपरीत होते हैं। केतु मंगल की भाँति कार्य करता है। केतु सदा वक्री है — यह शाश्वत पश्चगामी गति अतीत की ओर देखने की प्रकृति दर्शाती है।' })}</p>
        <div className="space-y-2 mt-4">
          {Object.entries(DIGNITIES).map(([key, val]) => (
            <div key={key} className="flex items-start gap-3 bg-bg-primary/50 rounded-lg border border-graha-ketu/15 p-3">
              <span className="text-graha-ketu text-sm font-bold min-w-[120px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-text-primary text-sm" style={bf}>{ml(val)}</span>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Uccha-Neecha of Chhaya Grahas" author="Maharishi Parashara" />
      </LessonSection>

      {/* ── 3. Ketu vs. Rahu — The Complementary Forces ── */}
      <LessonSection number={next()} title={ml({ en: 'Ketu vs. Rahu — The Complementary Forces', hi: 'केतु बनाम राहु — परस्पर पूरक शक्तियाँ' })}>
        <p style={bf}>{ml({ en: 'Understanding Ketu requires understanding its relationship with Rahu. They are two halves of a single cosmic being — separated but forever linked. Every quality of Ketu is the mirror image of Rahu:', hi: 'केतु को समझने के लिए राहु के साथ इसके सम्बन्ध को समझना आवश्यक है। वे एक ब्रह्माण्डीय सत्ता के दो भाग हैं — अलग किन्तु सदा जुड़े। केतु का प्रत्येक गुण राहु का दर्पण प्रतिबिम्ब है:' })}</p>
        <div className="grid grid-cols-1 gap-3 mt-4">
          {[
            { rahu: { en: 'Rahu = Head (mind, desire, hunger)', hi: 'राहु = सिर (मन, इच्छा, भूख)' }, ketu: { en: 'Ketu = Body (instinct, experience, memory)', hi: 'केतु = शरीर (सहज ज्ञान, अनुभव, स्मृति)' } },
            { rahu: { en: 'Rahu amplifies — obsessive expansion', hi: 'राहु बढ़ाता है — जुनूनी विस्तार' }, ketu: { en: 'Ketu dissolves — effortless release', hi: 'केतु विलीन करता है — सहज मुक्ति' } },
            { rahu: { en: 'Rahu = Future desire, what the soul craves', hi: 'राहु = भविष्य इच्छा, आत्मा की लालसा' }, ketu: { en: 'Ketu = Past mastery, what the soul has already done', hi: 'केतु = अतीत निपुणता, आत्मा ने जो पहले ही किया' } },
            { rahu: { en: 'Rahu functions like Saturn (discipline, strategy)', hi: 'राहु शनि जैसा (अनुशासन, रणनीति)' }, ketu: { en: 'Ketu functions like Mars (fierce, sudden, intuitive)', hi: 'केतु मंगल जैसा (तीव्र, अचानक, सहज)' } },
            { rahu: { en: 'Rahu = Material world mastery', hi: 'राहु = भौतिक संसार निपुणता' }, ketu: { en: 'Ketu = Spiritual world mastery', hi: 'केतु = आध्यात्मिक संसार निपुणता' } },
            { rahu: { en: 'Rahu = Eclipse of the ego (Grahan Yoga)', hi: 'राहु = अहंकार का ग्रहण (ग्रहण योग)' }, ketu: { en: 'Ketu = Dissolution of the ego (Moksha)', hi: 'केतु = अहंकार का विलय (मोक्ष)' } },
          ].map((pair, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <div className="bg-graha-rahu/8 border border-graha-rahu/15 rounded-lg p-3">
                <p className="text-text-primary text-sm" style={bf}>{ml(pair.rahu)}</p>
              </div>
              <div className="bg-graha-ketu/8 border border-graha-ketu/15 rounded-lg p-3">
                <p className="text-text-primary text-sm" style={bf}>{ml(pair.ketu)}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={bf} className="mt-4 text-text-secondary text-sm">{ml({ en: 'The nodal axis transits through the zodiac in approximately 18.6 years, spending about 18 months in each sign pair. Ketu always shows where you are coming FROM; Rahu shows where you are going TO. The spiritual challenge is to honor past mastery (Ketu) without clinging to it, while embracing new growth (Rahu) without being consumed by it.', hi: 'पात धुरी लगभग 18.6 वर्षों में राशिचक्र से गुजरती है। केतु सदा दिखाता है आप कहाँ से आ रहे हैं; राहु दिखाता है कहाँ जा रहे हैं। आध्यात्मिक चुनौती: अतीत निपुणता (केतु) का सम्मान करना बिना चिपके, नई वृद्धि (राहु) को अपनाना बिना उसमें खो जाए।' })}</p>
        <ClassicalReference shortName="BPHS" chapter="Ch. 26 — Rahu-Ketu Dasha Phala" />
      </LessonSection>

      {/* ── 4. Ketu in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Ketu in the Twelve Signs', hi: 'बारह राशियों में केतु' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Ketu\'s sign placement shows the area of past-life mastery — skills and qualities the soul has already perfected. The native will have natural, effortless ability in Ketu\'s domain but feel no excitement or fulfillment from exercising it. The spiritual lesson: use past mastery as a foundation, not a destination. Every Ketu sign entry includes its Rahu counterpart because the axis must always be read as a whole.', hi: 'केतु की राशि स्थिति पूर्व जन्म की निपुणता दिखाती है — कौशल और गुण जो आत्मा ने पहले ही सिद्ध किये। जातक केतु के क्षेत्र में स्वाभाविक, सहज क्षमता रखेगा किन्तु उसके प्रयोग में कोई उत्साह या तृप्ति नहीं। आध्यात्मिक पाठ: अतीत निपुणता को आधार बनाएँ, गन्तव्य नहीं।' })}</p>
        {KETU_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(s.sign)}</span>
              {s.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  s.dignity === 'Exalted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  s.dignity === 'Debilitated' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  'bg-graha-ketu/10 border-graha-ketu/30 text-graha-ketu'
                }`}>{s.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(s.effect)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 5. Ketu in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Ketu in the Twelve Houses', hi: 'बारह भावों में केतु' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Ketu\'s house placement shows which area of life has past-life mastery and present-life detachment. The native excels naturally in Ketu\'s house domain but finds no motivation to pursue it. Ketu in Moksha houses (4th, 8th, 12th) is especially powerful for spiritual liberation. In Upachaya houses (3rd, 6th, 10th, 11th), past-life merit destroys obstacles. In Kendra houses, the detachment energy creates visible life changes.', hi: 'केतु का भाव स्थिति दिखाता है किस जीवन क्षेत्र में पूर्व जन्म की निपुणता और वर्तमान में वैराग्य है। मोक्ष भावों (4, 8, 12) में केतु आध्यात्मिक मुक्ति के लिए विशेष शक्तिशाली। उपचय भावों (3, 6, 10, 11) में पूर्व पुण्य बाधाओं का नाश करता है।' })}</p>
        {KETU_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-ketu/15 border border-graha-ketu/30 flex items-center justify-center text-graha-ketu text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Shadow Planets in Houses)" />
      </LessonSection>

      {/* ── 6. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Ketu Mahadasha (7 Years)', hi: 'केतु महादशा (7 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Ketu Dasha', hi: 'बलवान केतु दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongResult)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Ketu Dasha', hi: 'दुर्बल केतु दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakResult)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 8. Notable Yogas ── */}
      <LessonSection number={next()} title={ml({ en: 'Notable Ketu Yogas', hi: 'केतु के प्रमुख योग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Ketu participates in yogas that range from the most feared (Pishacha, Kala Sarpa) to the most liberating (Moksha Yoga, Ganesha Yoga). Understanding these reveals whether Ketu functions as a doorway to spiritual liberation or a source of confusion and loss in your chart.', hi: 'केतु सबसे भयंकर (पिशाच, काल सर्प) से लेकर सबसे मुक्तिदायक (मोक्ष योग, गणेश योग) तक के योगों में भाग लेता है। इन्हें समझना प्रकट करता है कि केतु आपकी कुण्डली में आध्यात्मिक मुक्ति का द्वार या भ्रम और हानि का स्रोत है।' })}</p>
        <div className="space-y-4">
          {NOTABLE_YOGAS.map((yoga, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/25 via-[#1a1040]/30 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-5">
              <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(yoga.name)}</h4>
              <p className="text-graha-ketu text-xs mb-2" style={bf}>{ml(yoga.condition)}</p>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(yoga.effect)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 26 — Ketu Yoga Effects" />
      </LessonSection>

      {/* ── 9. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application — Ketu Periods', hi: 'व्यावहारिक अनुप्रयोग — केतु काल' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Ketu\'s 7-year dasha and 18-month transits are among the most spiritually potent periods in Jyotish. Understanding how to navigate Ketu Mahadasha, identify moksha potential, and work with Ketu\'s detaching energy is essential knowledge.', hi: 'केतु की 7-वर्षीय दशा और 18 महीने के गोचर ज्योतिष में सबसे आध्यात्मिक रूप से शक्तिशाली अवधियों में हैं। केतु महादशा कैसे नेविगेट करें, मोक्ष सम्भावना पहचानें और केतु की वैराग्य ऊर्जा के साथ कैसे कार्य करें — आवश्यक ज्ञान है।' })}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-5">
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Ketu Mahadasha — Spiritual Transformation', hi: 'केतु महादशा — आध्यात्मिक परिवर्तन' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.ketuDasha)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-5">
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Moksha Indicators in Your Chart', hi: 'आपकी कुण्डली में मोक्ष संकेतक' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.mokshaIndicators)}</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Common Misconceptions — Ketu is NOT Only Spiritual', hi: 'सामान्य भ्रान्तियाँ — केतु केवल आध्यात्मिक नहीं' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.misconceptions)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 10. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Ketu acts as a detacher for any planet it conjoins — stripping away the planet\'s material significations while amplifying its spiritual potential. A planet conjunct Ketu loses worldly effectiveness but gains mystical depth. Ketu\'s conjunctions are sudden, unexpected, and often feel like fate rather than choice.', hi: 'केतु किसी भी ग्रह के साथ युत होने पर वैरागी का कार्य करता है — ग्रह के भौतिक कारकत्व छीनता है किन्तु आध्यात्मिक सम्भावना बढ़ाता है। केतु से युत ग्रह सांसारिक प्रभावशीलता खो देता है किन्तु रहस्यमय गहराई प्राप्त करता है।' })}</p>
        <div className="space-y-3">
          {RELATIONSHIPS.map((r, i) => (
            <div key={i} className="bg-bg-primary/50 rounded-lg border border-graha-ketu/15 p-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-gold-light font-bold text-sm" style={hf}>{ml(r.planet)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  ml(r.relation).includes('Friend') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  ml(r.relation).includes('Enemy') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  ml(r.relation).includes('Axis') ? 'bg-graha-ketu/10 border-graha-ketu/30 text-graha-ketu' :
                  'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>{ml(r.relation)}</span>
              </div>
              <p className="text-text-secondary text-sm" style={bf}>{ml(r.note)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.23-26 — Naisargika Maitri (Shadow Planets)" />
      </LessonSection>

      {/* ── 8. Remedies ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies for Ketu', hi: 'केतु के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Ketu remedies are prescribed when Ketu is afflicting important houses, creating confusion, or during a turbulent Ketu Mahadasha. Important: Cat\'s Eye (Lehsunia) is extremely powerful — results manifest within days, both positive and negative. Never wear without thorough chart analysis. For most people, worship and meditation are safer and more aligned with Ketu\'s spiritual nature.', hi: 'केतु के उपाय तब निर्धारित किये जाते हैं जब केतु महत्वपूर्ण भावों को पीड़ित कर रहा हो, भ्रम उत्पन्न कर रहा हो, या अशान्त केतु महादशा चल रही हो। महत्वपूर्ण: लहसुनिया अत्यन्त शक्तिशाली — परिणाम दिनों में प्रकट। पूर्ण कुण्डली विश्लेषण बिना कभी न धारण करें। अधिकांश लोगों के लिए पूजा और ध्यान अधिक सुरक्षित।' })}</p>

        {/* Mantra */}
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-graha-ketu/20 rounded-xl p-5 mb-4">
          <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Beej Mantra', hi: 'बीज मन्त्र' })}</h4>
          <p className="text-graha-ketu text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{REMEDIES.mantra.text}</p>
          <p className="text-text-secondary text-xs italic mb-2">{REMEDIES.mantra.transliteration}</p>
          <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES.mantra)}</p>
          <p className="text-text-secondary text-xs mt-1">{ml({ en: `Count: ${REMEDIES.mantra.count}`, hi: `जाप: ${REMEDIES.mantra.count}` })}</p>
        </div>

        {/* Other remedies */}
        {[
          { key: 'gemstone', title: { en: 'Gemstone — Cat\'s Eye (Lehsunia)', hi: 'रत्न — लहसुनिया (वैदूर्य)' } },
          { key: 'charity', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', title: { en: 'Worship & Meditation', hi: 'पूजा एवं ध्यान' } },
          { key: 'yantra', title: { en: 'Ketu Yantra', hi: 'केतु यन्त्र' } },
          { key: 'dietary', title: { en: 'Dietary Remedies (Ahara)', hi: 'आहार उपाय' } },
          { key: 'behavioral', title: { en: 'Behavioral Remedies (Achara)', hi: 'आचार उपाय' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-graha-ketu/15 p-4 mb-3">
            <h4 className="text-graha-ketu font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'The most powerful Ketu remedy is meditation itself. Ketu IS the planet of silence, stillness, and inner seeing. When you sit in meditation, you align directly with Ketu\'s highest vibration. Unlike Rahu remedies (which redirect energy), Ketu remedies work by surrendering — letting go of control, accepting impermanence, and finding peace in the unknown. Feed stray dogs, serve without expectation, and practice stillness daily.', hi: 'सबसे शक्तिशाली केतु उपाय ध्यान ही है। केतु मौन, स्थिरता और आन्तरिक दृष्टि का ग्रह है। जब आप ध्यान में बैठते हैं, केतु की उच्चतम कम्पन से सीधे जुड़ते हैं। राहु उपायों (जो ऊर्जा पुनर्निर्देशित करते हैं) के विपरीत, केतु उपाय समर्पण से काम करते हैं — नियन्त्रण छोड़ना, अनित्यता स्वीकारना और अज्ञात में शान्ति पाना।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Worship', hi: 'पौराणिक कथा एवं उपासना' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Headless Wanderer — Origin of Ketu', hi: 'बिना सिर का भटकने वाला — केतु की उत्पत्ति' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.origin)}</p>
          </div>
          <div>
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Ketu Kavach & Gayatri', hi: 'केतु कवच एवं गायत्री' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.keyHymn)}</p>
          </div>
          <div>
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Headless Body — Deeper Symbolism', hi: 'बिना सिर का शरीर — गहन प्रतीकवाद' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.headlessSymbolism)}</p>
          </div>
          <div>
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Ganesha Connection', hi: 'गणेश सम्बन्ध' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.ganeshaConnection)}</p>
          </div>
          <div>
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Liberation Through Suffering', hi: 'पीड़ा से मुक्ति' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.liberationThroughSuffering)}</p>
          </div>
          <div>
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples', hi: 'पवित्र मन्दिर' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
        </div>
        <ClassicalReference shortName="Skanda Purana" chapter="Ketu Kavach" />
      </LessonSection>

      {/* ── 13. Ketu and Spiritual Practice ── */}
      <LessonSection number={next()} title={ml({ en: 'Ketu and Spiritual Practice', hi: 'केतु और आध्यात्मिक साधना' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Ketu is the ultimate spiritual planet — its energy IS the energy of meditation, detachment, and transcendence. Understanding how Ketu manifests in spiritual practice helps practitioners work with rather than against its powerful dissolution energy.', hi: 'केतु परम आध्यात्मिक ग्रह है — इसकी ऊर्जा ध्यान, वैराग्य और अतिक्रमण की ही ऊर्जा है। आध्यात्मिक साधना में केतु कैसे प्रकट होता है यह समझना साधकों को इसकी शक्तिशाली विलय ऊर्जा के विरुद्ध नहीं बल्कि साथ कार्य करने में सहायता करता है।' })}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-4">
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Ketu and Meditation', hi: 'केतु और ध्यान' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({ en: 'Every meditation tradition — Zen, Vipassana, Advaita, Tibetan, Sufi — is a Ketu practice. The goal of meditation is exactly what Ketu does naturally: silence the thinking mind, dissolve the ego\'s grip on identity, and rest in pure awareness beyond thought. People with strong Ketu placements (Ketu in the 1st, 5th, 8th, 9th, or 12th house) often have natural meditation ability — they can drop into silence easily. During Ketu dasha, meditation practice deepens significantly, sometimes producing spontaneous breakthrough experiences (samadhi, kundalini awakening, or past-life recall). The most practical Ketu remedy IS meditation — 20 minutes of daily silence aligns you with Ketu\'s highest vibration better than any gemstone or ritual.', hi: 'हर ध्यान परम्परा — ज़ेन, विपश्यना, अद्वैत, तिब्बती, सूफी — केतु साधना है। ध्यान का लक्ष्य ठीक वही जो केतु स्वाभाविक रूप से करता है: सोचने वाले मन को शान्त करना, अहंकार की पकड़ विलीन करना, विचार से परे शुद्ध जागरूकता में विश्राम। प्रबल केतु स्थिति (1, 5, 8, 9, 12वें भाव) वालों में प्रायः स्वाभाविक ध्यान क्षमता। केतु दशा में ध्यान साधना महत्वपूर्ण रूप से गहरी। 20 मिनट दैनिक मौन किसी भी रत्न या अनुष्ठान से बेहतर केतु की उच्चतम कम्पन से जोड़ता है।' })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-4">
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Past-Life Memory and Ketu', hi: 'पूर्व जन्म स्मृति और केतु' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({ en: 'Ketu is the primary indicator of past-life memories and carry-over abilities. People with strong Ketu placements often report: (1) Inexplicable skills that appear without training — child prodigies, natural healers, and intuitive mathematicians. (2) Strong aversions or attractions to specific places, cultures, or time periods. (3) Recurring dreams set in unfamiliar historical settings. (4) A sense of "having been here before" in certain life situations. (5) Phobias that have no origin in the current life (often related to the cause of death in a previous incarnation). Ketu in the 12th house is the strongest indicator of accessible past-life memories. Ketu in the 8th house indicates past-life familiarity with occult sciences and death transitions.', hi: 'केतु पूर्व जन्म स्मृतियों और हस्तान्तरित क्षमताओं का प्रमुख संकेतक। प्रबल केतु वाले प्रायः अनुभव करते हैं: (1) बिना प्रशिक्षण अवर्णनीय कौशल — बाल प्रतिभा, स्वाभाविक चिकित्सक। (2) विशेष स्थानों या संस्कृतियों के प्रति प्रबल आकर्षण या विरक्ति। (3) अपरिचित ऐतिहासिक परिवेश में बारम्बार स्वप्न। (4) विशेष स्थितियों में "पहले यहाँ आ चुके हैं" की भावना। (5) वर्तमान जीवन में मूल रहित भय। 12वें भाव में केतु सुलभ पूर्व जन्म स्मृतियों का सबसे प्रबल संकेतक।' })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-4">
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Ketu and Kundalini', hi: 'केतु और कुण्डलिनी' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({ en: 'Ketu has a deep connection with Kundalini energy — the coiled serpent power that lies dormant at the base of the spine. Ketu\'s symbol includes the serpent body (Svarbhanu was serpentine), and its energy is associated with the upward movement of consciousness from the material to the spiritual. Ketu in the 8th house or conjunct Mars in fiery signs can trigger spontaneous kundalini experiences — sudden rushes of energy, heat along the spine, and altered states of consciousness. These experiences are powerful but must be guided by an experienced teacher. Uncontrolled kundalini awakening during Ketu dasha can cause physical symptoms (heat, tingling, insomnia) and psychological disorientation. The remedy: ground the energy through physical practice (yoga asana, walking in nature) and seek qualified guidance.', hi: 'केतु का कुण्डलिनी ऊर्जा से गहरा सम्बन्ध — रीढ़ की तली पर सुप्त कुण्डलित सर्प शक्ति। केतु का प्रतीक सर्प शरीर सम्मिलित (स्वर्भानु सर्पीय)। 8वें भाव में केतु या अग्नि राशियों में मंगल से युत स्वतः कुण्डलिनी अनुभव ला सकता है — अचानक ऊर्जा प्रवाह, रीढ़ में ताप, परिवर्तित चेतना अवस्थाएँ। ये शक्तिशाली किन्तु अनुभवी शिक्षक के मार्गदर्शन आवश्यक। अनियन्त्रित कुण्डलिनी जागृति शारीरिक लक्षण और मनोवैज्ञानिक भटकाव कर सकती है। उपाय: शारीरिक अभ्यास से ऊर्जा को भूमि दें।' })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-4">
            <h4 className="text-graha-ketu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Technical Skills and Ketu', hi: 'तकनीकी कौशल और केतु' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({ en: 'Despite being "the spiritual planet," Ketu gives exceptional technical ability — particularly in fields requiring pattern recognition, precision, and intuitive leaps rather than step-by-step analysis. Programming, mathematics, surgery, music (especially percussion and rhythm), and martial arts all fall under Ketu\'s domain. The reason: these skills operate through the body\'s intelligence and intuitive pattern-matching rather than conscious calculation. A skilled programmer doesn\'t think through every line — they "feel" the code. A surgeon\'s hands "know" where to cut. This body-intelligence is pure Ketu — skill without the interference of the thinking mind. Many tech entrepreneurs and mathematical prodigies have Ketu in the 3rd, 5th, or 10th house.', hi: '"आध्यात्मिक ग्रह" होने के बावजूद केतु असाधारण तकनीकी क्षमता देता है — विशेषकर पैटर्न पहचान, सटीकता और सहज छलांग चाहने वाले क्षेत्रों में। प्रोग्रामिंग, गणित, शल्य, संगीत (विशेषकर ताल) और मार्शल आर्ट सब केतु के अधीन। कारण: ये कौशल चेतन गणना नहीं बल्कि शरीर की बुद्धि और सहज पैटर्न-मिलान से कार्य करते हैं। कुशल प्रोग्रामर हर पंक्ति नहीं सोचता — कोड "महसूस" करता है। यह शरीर-बुद्धि शुद्ध केतु — सोचने वाले मन के हस्तक्षेप बिना कौशल।' })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Ketu is the Mokshakaraka — the significator of liberation. Always retrograde, always detaching, always pointing toward the past.', hi: 'केतु मोक्षकारक है — मुक्ति का कारक। सदा वक्री, सदा वैरागी, सदा अतीत की ओर इंगित।' }),
        ml({ en: 'Exalted in Scorpio, debilitated in Taurus (Parashari). Functions like Mars. No classical own sign — co-rules Scorpio per some.', hi: 'वृश्चिक में उच्च, वृषभ में नीच (पराशरी)। मंगल की भाँति कार्य करता है। शास्त्रीय स्वराशि नहीं — कुछ के अनुसार वृश्चिक का सह-स्वामी।' }),
        ml({ en: 'Friends: Mars, Venus, Saturn. Enemies: Sun, Moon. Ketu detaches from whatever planet it conjoins — stripping material power, amplifying spiritual depth.', hi: 'मित्र: मंगल, शुक्र, शनि। शत्रु: सूर्य, चन्द्र। केतु जिस ग्रह से युत — भौतिक शक्ति छीनता है, आध्यात्मिक गहराई बढ़ाता है।' }),
        ml({ en: 'Mahadasha: 7 years. Best in moksha houses (4/8/12). Remedy: Cat\'s Eye (with extreme caution), Ganesha worship, meditation, feeding dogs.', hi: 'महादशा: 7 वर्ष। मोक्ष भावों (4/8/12) में सर्वोत्तम। उपाय: लहसुनिया (अत्यधिक सावधानी से), गणेश पूजा, ध्यान, कुत्तों को भोजन।' }),
      ]} />

      {/* ── 14. Ketu's Nakshatras ── */}
      <LessonSection number={next()} title={ml({ en: "Ketu's Nakshatras — Ashwini, Magha, Moola", hi: 'केतु के नक्षत्र — अश्विनी, मघा, मूल' })}>
        <p style={bf} className="mb-4">{ml({
          en: 'Ketu rules three nakshatras that share a common theme: destruction of the old to create space for the new. These are among the most powerful and transformative nakshatras in the zodiac. People born with Moon or Ascendant in these nakshatras carry Ketu\'s energy strongly.',
          hi: 'केतु तीन नक्षत्र शासित करता है जो एक साझा विषय रखते हैं: नए के लिए स्थान बनाने को पुराने का विनाश। ये राशिचक्र के सबसे शक्तिशाली और परिवर्तनकारी नक्षत्रों में हैं। इन नक्षत्रों में चन्द्र या लग्न से जन्मे केतु की ऊर्जा प्रबलता से वहन करते हैं।'
        })}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>
              {ml({ en: 'Ashwini (0°-13°20\' Aries) — The Healers', hi: 'अश्विनी (0°-13°20\' मेष) — चिकित्सक' })}
            </h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({
              en: 'The first nakshatra of the zodiac — ruled by Ketu and lorded by the Ashwini Kumaras (divine physicians). This nakshatra gives miraculous healing ability, speed, and the power to initiate new beginnings. Ashwini natives are natural healers — whether through medicine, energy work, or simply their presence. They move fast, think fast, and heal fast. The Ketu connection gives intuitive diagnostic ability — they "sense" what is wrong without elaborate tests. Career paths: medicine, emergency services, alternative healing, veterinary work, and speed-based professions (racing, courier). Shadow: impatience, inability to slow down, and healing others while neglecting self.',
              hi: 'राशिचक्र का प्रथम नक्षत्र — केतु-शासित और अश्विनी कुमारों (दिव्य चिकित्सक) द्वारा अधिपत्य। चमत्कारी चिकित्सा क्षमता, गति और नई शुरुआत की शक्ति। अश्विनी जातक स्वाभाविक चिकित्सक — चिकित्सा, ऊर्जा कार्य या मात्र उपस्थिति से। केतु सम्बन्ध सहज निदान क्षमता। करियर: चिकित्सा, आपातकालीन सेवा, वैकल्पिक चिकित्सा, पशु चिकित्सा। छाया: अधीरता, धीमा न हो पाना।'
            })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>
              {ml({ en: 'Magha (0°-13°20\' Leo) — The Ancestors', hi: 'मघा (0°-13°20\' सिंह) — पितृगण' })}
            </h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({
              en: 'Magha means "the mighty" — ruled by Ketu and lorded by the Pitris (ancestral spirits). This nakshatra connects directly to royal lineage, past-life authority, and ancestral karma. Magha natives carry an innate regal bearing — they command respect without demanding it. Strong connection to family tradition, heritage, and the wisdom of ancestors. The throne is their natural seat. However, Ketu\'s influence creates detachment from this very authority — the native may walk away from inherited power to seek deeper purpose. Career paths: politics, administration, museum/heritage work, genealogy, and positions of traditional authority. Shadow: pride in lineage without personal merit, ancestor worship without spiritual understanding.',
              hi: 'मघा अर्थात "महान" — केतु-शासित और पितृगणों (पूर्वजों की आत्माओं) द्वारा अधिपत्य। राजसी वंश, पूर्व जन्म अधिकार और पैतृक कर्म से सीधा सम्बन्ध। मघा जातक जन्मजात राजसी आभा वहन — बिना माँगे सम्मान प्राप्त। पारिवारिक परम्परा और पूर्वजों के ज्ञान से प्रबल सम्बन्ध। किन्तु केतु का प्रभाव इसी अधिकार से वैराग्य — विरासत शक्ति छोड़कर गहन उद्देश्य खोज सकता है। करियर: राजनीति, प्रशासन, विरासत कार्य।'
            })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-ketu/12 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>
              {ml({ en: 'Moola (0°-13°20\' Sagittarius) — The Root Destroyer', hi: 'मूल (0°-13°20\' धनु) — मूल विनाशक' })}
            </h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({
              en: 'Moola means "the root" — ruled by Ketu and lorded by Nirrti (goddess of destruction and dissolution). This is the most intense of Ketu\'s nakshatras — it destroys to the root so that something entirely new can grow. Moola natives often experience dramatic early-life upheavals (family disruptions, relocation, identity crises) that strip away false foundations. They are researchers, investigators, and seekers who dig until they find the absolute truth. Nothing surface-level satisfies them. Career paths: research, archaeology, philosophy, psychology, surgery, and any work that requires getting to the bottom of things. Shadow: destructive tendencies, inability to build after tearing down, and nihilism. Moola must remember that destruction without construction is mere chaos.',
              hi: 'मूल अर्थात "जड़" — केतु-शासित और निऋति (विनाश और विलय की देवी) द्वारा अधिपत्य। केतु के नक्षत्रों में सबसे तीव्र — जड़ तक नष्ट करता है ताकि पूर्णतः नया उग सके। मूल जातक प्रायः नाटकीय प्रारम्भिक उथल-पुथल अनुभव करते हैं जो झूठी नींव छीन लेते हैं। शोधकर्ता और साधक जो परम सत्य तक खोदते हैं। कोई सतही चीज सन्तुष्ट नहीं करती। करियर: शोध, पुरातत्व, दर्शन, मनोविज्ञान, शल्य। छाया: विनाशक प्रवृत्ति, तोड़ने के बाद न बना पाना।'
            })}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Nakshatra Characteristics" />
      </LessonSection>

      {/* ── Quick Reference Table ── */}
      <div className="mt-12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-graha-ketu/15 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-sm mb-4" style={hf}>
          {ml({ en: 'Ketu Quick Reference', hi: 'केतु त्वरित सन्दर्भ' })}
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Nodal Cycle', hi: 'पात चक्र' })}</span>
            <span className="text-text-primary" style={bf}>18.61 {ml({ en: 'years', hi: 'वर्ष' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Dasha Duration', hi: 'दशा अवधि' })}</span>
            <span className="text-text-primary" style={bf}>7 {ml({ en: 'years', hi: 'वर्ष' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Motion', hi: 'गति' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Always Retrograde', hi: 'सदा वक्री' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Sign Duration', hi: 'राशि अवधि' })}</span>
            <span className="text-text-primary" style={bf}>~18 {ml({ en: 'months/sign', hi: 'माह/राशि' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Exaltation', hi: 'उच्च' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Scorpio 20°', hi: 'वृश्चिक 20°' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Debilitation', hi: 'नीच' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Taurus 20°', hi: 'वृषभ 20°' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Gemstone', hi: 'रत्न' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: "Cat's Eye (Lehsunia)", hi: 'लहसुनिया' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Day', hi: 'दिन' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Tuesday', hi: 'मंगलवार' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Best Houses', hi: 'सर्वोत्तम भाव' })}</span>
            <span className="text-text-primary" style={bf}>3, 6, 8, 12</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Functions Like', hi: 'जैसा कार्य करता है' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Mars', hi: 'मंगल' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Nakshatra Lordship', hi: 'नक्षत्र स्वामित्व' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Ashwini, Magha, Moola', hi: 'अश्विनी, मघा, मूल' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Deity', hi: 'देवता' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Lord Ganesha', hi: 'भगवान गणेश' })}</span>
          </div>
        </div>
      </div>

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
