import type { LocaleText } from '@/types/panchang';
'use client';

import { useMemo, useState } from 'react';
import type { PlanetPosition, DashaEntry } from '@/types/kundali';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { PlanetAvasthas } from '@/lib/kundali/avasthas';
import HouseVisual, { HouseBadge } from './HouseVisual';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { GRAHAS } from '@/lib/constants/grahas';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ─── Planet metadata ────────────────────────────────────────────────────────

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_NAMES_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'राहु', 'केतु'];

function pName(id: number, isHi: boolean): string {
  return isHi ? (PLANET_NAMES_HI[id] ?? `Planet ${id}`) : (PLANET_NAMES_EN[id] ?? `Planet ${id}`);
}

const PLANET_THEMES: Record<number, { strong: string; weak: string; strongHi: string; weakHi: string }> = {
  0: {
    strong: 'Authority, career recognition, father\'s support',
    weak: 'Career struggles, lack of recognition, father issues',
    strongHi: 'अधिकार, करियर में मान्यता, पिता का सहयोग',
    weakHi: 'करियर में कठिनाई, मान्यता की कमी, पिता से समस्या',
  },
  1: {
    strong: 'Emotional stability, good public image, mother\'s support',
    weak: 'Anxiety, emotional turbulence, mother\'s health concerns',
    strongHi: 'भावनात्मक स्थिरता, अच्छी सार्वजनिक छवि, माता का सहयोग',
    weakHi: 'चिंता, भावनात्मक अस्थिरता, माता के स्वास्थ्य की चिंता',
  },
  2: {
    strong: 'Courage, property gains, technical ability',
    weak: 'Lack of initiative, property disputes, accident-prone',
    strongHi: 'साहस, संपत्ति लाभ, तकनीकी क्षमता',
    weakHi: 'पहल की कमी, संपत्ति विवाद, दुर्घटना की संभावना',
  },
  3: {
    strong: 'Business acumen, communication skills, analytical mind',
    weak: 'Indecision, communication problems, skin issues',
    strongHi: 'व्यापार कौशल, संवाद कला, विश्लेषणात्मक बुद्धि',
    weakHi: 'अनिर्णय, संवाद में समस्या, त्वचा रोग',
  },
  4: {
    strong: 'Wisdom, children, spiritual growth, wealth',
    weak: 'Bad advice, delayed children, lack of faith',
    strongHi: 'ज्ञान, संतान, आध्यात्मिक विकास, धन',
    weakHi: 'गलत सलाह, संतान में विलम्ब, श्रद्धा की कमी',
  },
  5: {
    strong: 'Happy marriage, luxury, artistic talent',
    weak: 'Relationship issues, lack of comfort, kidney problems',
    strongHi: 'सुखी विवाह, विलासिता, कलात्मक प्रतिभा',
    weakHi: 'संबंधों में समस्या, सुख की कमी, गुर्दे की समस्या',
  },
  6: {
    strong: 'Discipline, longevity, career stability',
    weak: 'Chronic problems, delays, bone/joint issues',
    strongHi: 'अनुशासन, दीर्घायु, करियर स्थिरता',
    weakHi: 'दीर्घकालिक समस्याएं, विलम्ब, हड्डी/जोड़ों की समस्या',
  },
};

const PLANET_REMEDIES: Record<number, { en: string; hi: string; whyEn: string; whyHi: string }> = {
  0: { en: 'Offer water to Sun at sunrise, recite Aditya Hridayam, wear Ruby', hi: 'सूर्य को जल अर्पित करें, आदित्य हृदयम का पाठ करें, माणिक्य धारण करें', whyEn: 'Ruby resonates with Sun\'s red-spectrum energy, amplifying confidence and vitality. Sunrise water offering aligns you with Sun\'s daily cycle.', whyHi: 'माणिक्य सूर्य की लाल-स्पेक्ट्रम ऊर्जा से गुंजित होता है, आत्मविश्वास और जीवनशक्ति बढ़ाता है। सूर्योदय जलार्पण सूर्य के दैनिक चक्र से जोड़ता है।' },
  1: { en: 'Wear Pearl, Monday fasting, recite Chandra mantra, serve mother', hi: 'मोती धारण करें, सोमवार व्रत, चन्द्र मंत्र, माता की सेवा', whyEn: 'Pearl forms from the ocean under moonlight, carrying lunar energy. Serving mother strengthens Moon\'s signification (nurturing, emotional security).', whyHi: 'मोती चन्द्र प्रकाश में समुद्र से बनता है, चन्द्र ऊर्जा धारण करता है। माता की सेवा चन्द्र के कारकत्व (पोषण, भावनात्मक सुरक्षा) को मजबूत करती है।' },
  2: { en: 'Wear Red Coral, Hanuman Chalisa on Tuesday, donate jaggery', hi: 'मूंगा धारण करें, मंगलवार को हनुमान चालीसा, गुड़ दान करें', whyEn: 'Red Coral is formed from living organisms under the sea — it carries Mars\'s raw life-force energy. Hanuman embodies Mars\'s courage and protective strength.', whyHi: 'लाल मूंगा समुद्र में जीवित जीवों से बनता है — मंगल की कच्ची जीवन-शक्ति ऊर्जा। हनुमान मंगल के साहस और रक्षा बल के प्रतीक हैं।' },
  3: { en: 'Wear Emerald, recite Vishnu Sahasranama, feed green moong', hi: 'पन्ना धारण करें, विष्णु सहस्रनाम, हरी मूंग दान करें', whyEn: 'Emerald\'s green frequency matches Mercury\'s wavelength, enhancing communication and intellect. Green offerings resonate with Mercury\'s color signature.', whyHi: 'पन्ने की हरी आवृत्ति बुध की तरंगदैर्घ्य से मेल खाती है, संचार और बुद्धि बढ़ाती है। हरे दान बुध के रंग से गुंजित होते हैं।' },
  4: { en: 'Wear Yellow Sapphire, Thursday fasting, recite Guru Stotra', hi: 'पुखराज धारण करें, गुरुवार व्रत, गुरु स्तोत्र का पाठ', whyEn: 'Yellow Sapphire channels Jupiter\'s golden-yellow frequency — wisdom, expansion, and prosperity. Thursday (Guruvar) is Jupiter\'s day; fasting purifies its energy channel.', whyHi: 'पुखराज बृहस्पति की स्वर्ण-पीली आवृत्ति प्रसारित करता है — ज्ञान, विस्तार और समृद्धि। गुरुवार बृहस्पति का दिन; व्रत उसकी ऊर्जा शुद्ध करता है।' },
  5: { en: 'Wear Diamond/White Sapphire, Friday puja, recite Lakshmi Stotra', hi: 'हीरा/श्वेत पुखराज धारण करें, शुक्रवार पूजा, लक्ष्मी स्तोत्र', whyEn: 'Diamond refracts all light frequencies, matching Venus\'s all-embracing aesthetic nature. Lakshmi is Venus\'s presiding deity (beauty, love, prosperity).', whyHi: 'हीरा सभी प्रकाश आवृत्तियों को अपवर्तित करता है, शुक्र के सर्वसमावेशी सौन्दर्य से मेल। लक्ष्मी शुक्र की अधिष्ठात्री देवी हैं (सौन्दर्य, प्रेम, समृद्धि)।' },
  6: { en: 'Wear Blue Sapphire (with caution), Saturday charity, feed crows', hi: 'नीलम (सावधानी से) धारण करें, शनिवार दान, कौवों को खिलाएं', whyEn: 'Blue Sapphire resonates with Saturn\'s deep blue energy — discipline and endurance. Feeding crows honors Saturn\'s vahana (vehicle); charity on Saturday earns Saturn\'s grace.', whyHi: 'नीलम शनि की गहरी नीली ऊर्जा से गुंजित — अनुशासन और धैर्य। कौवों को खिलाना शनि के वाहन का सम्मान; शनिवार दान शनि की कृपा अर्जित करता है।' },
};

// ─── Per-planet dasha forecasts ─────────────────────────────────────────────

const PLANET_DASHA_FORECAST: Record<number, {
  strongEn: string; strongHi: string;
  adequateEn: string; adequateHi: string;
  weakEn: string; weakHi: string;
  actionEn: string; actionHi: string;
}> = {
  0: {
    strongEn: 'Career breakthroughs, government recognition, leadership roles. Authority figures support you.',
    strongHi: 'करियर में उन्नति, सरकारी मान्यता, नेतृत्व भूमिकाएं। अधिकारी आपका समर्थन करते हैं।',
    adequateEn: 'Steady career growth, father relationships improve, vitality is reliable.',
    adequateHi: 'करियर में स्थिर प्रगति, पिता संबंध सुधरते हैं, स्वास्थ्य विश्वसनीय।',
    weakEn: 'Career setbacks likely, eye/heart health needs attention. Avoid conflicts with authority figures.',
    weakHi: 'करियर में बाधा संभव, नेत्र/हृदय स्वास्थ्य पर ध्यान दें। अधिकारियों से विवाद से बचें।',
    actionEn: 'Apply for promotions, take on leadership roles, strengthen relationship with father.',
    actionHi: 'पदोन्नति के लिए आवेदन करें, नेतृत्व भूमिकाएं लें, पिता से संबंध सुधारें।',
  },
  1: {
    strongEn: 'Emotional peace, public popularity, mother relationship flourishes. Best period for public-facing work.',
    strongHi: 'भावनात्मक शांति, लोकप्रियता, माता से अच्छे संबंध। जनसेवा के लिए उत्तम काल।',
    adequateEn: 'Emotional stability, modest public recognition, family life pleasant.',
    adequateHi: 'भावनात्मक स्थिरता, मध्यम सार्वजनिक मान्यता, पारिवारिक जीवन सुखद।',
    weakEn: 'Mental fluctuations, sleep issues, mother\'s health may be a concern. Avoid major decisions in emotional states.',
    weakHi: 'मानसिक उतार-चढ़ाव, नींद की समस्या, माता के स्वास्थ्य की चिंता। भावनात्मक स्थिति में बड़े निर्णय न लें।',
    actionEn: 'Launch public ventures, nurture close relationships, work with the public or media.',
    actionHi: 'सार्वजनिक उद्यम शुरू करें, करीबी रिश्तों को पोषित करें, जनसेवा/मीडिया में कार्य करें।',
  },
  2: {
    strongEn: 'Property acquisition, physical achievement, courage rewarded. Siblings and allies are supportive.',
    strongHi: 'संपत्ति अर्जन, शारीरिक उपलब्धि, साहस पुरस्कृत। भाई-बहन और सहयोगी सहायक।',
    adequateEn: 'Energy and initiative carry you forward in concrete, material goals.',
    adequateHi: 'ऊर्जा और पहल ठोस, भौतिक लक्ष्यों में मदद करती है।',
    weakEn: 'Injury risk, property disputes, temper issues. Avoid impulsive decisions and risky physical activities.',
    weakHi: 'चोट का खतरा, संपत्ति विवाद, क्रोध की समस्या। आवेगी निर्णयों और जोखिम भरी गतिविधियों से बचें।',
    actionEn: 'Buy property, start a fitness regimen, take bold but calculated risks.',
    actionHi: 'संपत्ति खरीदें, फिटनेस शुरू करें, साहसिक लेकिन सोचे-समझे जोखिम लें।',
  },
  3: {
    strongEn: 'Business success, communication wins, education thrives. Writing, media, and analytical work excel.',
    strongHi: 'व्यापार सफलता, संवाद में जीत, शिक्षा फलती है। लेखन, मीडिया और विश्लेषणात्मक कार्य श्रेष्ठ।',
    adequateEn: 'Good for studies, business deals, networking, and intellectual pursuits.',
    adequateHi: 'अध्ययन, व्यापार सौदों, नेटवर्किंग और बौद्धिक कार्यों के लिए अच्छा।',
    weakEn: 'Miscommunication, nervous system sensitivity, indecision. Double-check all agreements before signing.',
    weakHi: 'संवाद में गलतफहमी, तंत्रिका तंत्र की संवेदनशीलता। हस्ताक्षर से पहले सभी समझौतों की जांच करें।',
    actionEn: 'Start studies, sign contracts, launch media or writing projects, network actively.',
    actionHi: 'अध्ययन शुरू करें, अनुबंध हस्ताक्षर करें, लेखन/मीडिया परियोजनाएं शुरू करें।',
  },
  4: {
    strongEn: 'Wisdom grows, wealth expands, children succeed. Excellent judgment and spiritual advancement. Best period for higher education and investment.',
    strongHi: 'ज्ञान बढ़ता है, धन का विस्तार, संतान की सफलता। उत्कृष्ट निर्णय और आध्यात्मिक उन्नति। उच्च शिक्षा और निवेश के लिए उत्तम।',
    adequateEn: 'Growth and expansion in key life areas. Guidance and good fortune come when needed.',
    adequateHi: 'जीवन के प्रमुख क्षेत्रों में विकास। जरूरत पड़ने पर मार्गदर्शन और सौभाग्य मिलता है।',
    weakEn: 'Poor advice leads to costly mistakes, financial misjudgments, children may face challenges. Consult trusted mentors before major decisions.',
    weakHi: 'खराब सलाह से महंगी गलतियां, आर्थिक गलत निर्णय, संतान को चुनौतियां। बड़े निर्णयों से पहले विश्वसनीय गुरुओं से परामर्श करें।',
    actionEn: 'Invest for the long term, pursue higher education, have children, find a guru or mentor.',
    actionHi: 'दीर्घकालिक निवेश करें, उच्च शिक्षा लें, संतान प्राप्ति, गुरु की खोज करें।',
  },
  5: {
    strongEn: 'Happy marriage or relationship, artistic success, financial gains from beauty/art/luxury. Life feels pleasurable.',
    strongHi: 'सुखी विवाह/रिश्ता, कलात्मक सफलता, सौंदर्य/कला/विलास से आर्थिक लाभ। जीवन आनंदपूर्ण।',
    adequateEn: 'Relationships are pleasant, creative projects succeed moderately, comforts increase.',
    adequateHi: 'रिश्ते सुखद, रचनात्मक परियोजनाएं मध्यम सफलता, सुख-सुविधाएं बढ़ती हैं।',
    weakEn: 'Relationship friction, kidney or reproductive health needs monitoring, overspending risk. Be deliberate in romantic decisions.',
    weakHi: 'रिश्तों में तनाव, गुर्दे/प्रजनन स्वास्थ्य की निगरानी, अत्यधिक खर्च का खतरा।',
    actionEn: 'Get married, launch creative ventures, invest in beauty or luxury sector, deepen artistic practice.',
    actionHi: 'विवाह करें, रचनात्मक उद्यम शुरू करें, सौंदर्य/विलास क्षेत्र में निवेश करें।',
  },
  6: {
    strongEn: 'Career stability, disciplined wealth building, longevity confirmed. Hard work is consistently rewarded.',
    strongHi: 'करियर स्थिरता, अनुशासित धन निर्माण, दीर्घायु सिद्ध। परिश्रम का फल निरंतर मिलता है।',
    adequateEn: 'Slow but steady progress. Discipline and persistence reliably pay off.',
    adequateHi: 'धीमी लेकिन स्थिर प्रगति। अनुशासन और दृढ़ता विश्वसनीय रूप से फलदायक।',
    weakEn: 'Delays, chronic health issues (joints, bones, teeth), career obstacles. Extra patience and persistence are essential.',
    weakHi: 'विलम्ब, दीर्घकालिक स्वास्थ्य समस्याएं (जोड़/हड्डी/दांत), करियर में बाधाएं। अतिरिक्त धैर्य और दृढ़ता आवश्यक।',
    actionEn: 'Build long-term assets, establish daily routines, take on serious responsibilities, do inner work.',
    actionHi: 'दीर्घकालिक संपत्ति बनाएं, दिनचर्या स्थापित करें, गंभीर जिम्मेदारियां लें, आत्मिक कार्य करें।',
  },
};

const RAHU_KETU_FORECAST: Record<number, LocaleText> = {
  7: {
    en: 'Unusual opportunities, foreign connections, sudden gains or disruptions. Ambition peaks — but verify carefully before acting. Excellent for unconventional paths.',
    hi: 'असामान्य अवसर, विदेशी संपर्क, अचानक लाभ या व्यवधान। महत्वाकांक्षा चरम पर — कार्य से पहले सावधानी से जांचें।',
  },
  8: {
    en: 'Detachment, spiritual insight, past-life patterns surfacing. Career may feel directionless but inner wisdom and intuition grow strongly.',
    hi: 'विरक्ति, आध्यात्मिक अंतर्दृष्टि, पूर्व जन्म के संस्कार उभरते हैं। करियर अनिश्चित लेकिन आंतरिक ज्ञान और अंतर्ज्ञान बढ़ता है।',
  },
};

// ─── House significations ────────────────────────────────────────────────────

const HOUSE_SIGNIFICATIONS: Record<number, { en: string; hi: string; remedy_en: string; remedy_hi: string }> = {
  1: { en: 'Self, personality, health, vitality', hi: 'आत्म, व्यक्तित्व, स्वास्थ्य', remedy_en: 'Strengthen lagna lord, Sun worship', remedy_hi: 'लग्नेश को बलवान करें, सूर्य उपासना' },
  2: { en: 'Wealth, family, speech, food habits', hi: 'धन, परिवार, वाणी, भोजन', remedy_en: 'Donate food, strengthen 2nd lord', remedy_hi: 'अन्न दान, द्वितीयेश को बलवान करें' },
  3: { en: 'Courage, siblings, short travel, efforts', hi: 'साहस, भाई-बहन, छोटी यात्रा', remedy_en: 'Mars remedies, regular exercise', remedy_hi: 'मंगल उपाय, नियमित व्यायाम' },
  4: { en: 'Mother, home, vehicles, inner peace', hi: 'माता, घर, वाहन, मानसिक शांति', remedy_en: 'Moon remedies, serve mother, plant trees', remedy_hi: 'चन्द्र उपाय, माता की सेवा, वृक्ष लगाएं' },
  5: { en: 'Children, education, intellect, romance', hi: 'संतान, शिक्षा, बुद्धि, प्रेम', remedy_en: 'Jupiter remedies, Saraswati puja', remedy_hi: 'गुरु उपाय, सरस्वती पूजा' },
  6: { en: 'Enemies, disease, debts, daily work', hi: 'शत्रु, रोग, ऋण, दैनिक कार्य', remedy_en: 'Mars/Saturn remedies, Hanuman worship', remedy_hi: 'मंगल/शनि उपाय, हनुमान उपासना' },
  7: { en: 'Marriage, partnerships, public dealings', hi: 'विवाह, साझेदारी, सार्वजनिक व्यवहार', remedy_en: 'Venus remedies, Gauri puja for marriage', remedy_hi: 'शुक्र उपाय, विवाह हेतु गौरी पूजा' },
  8: { en: 'Longevity, transformation, hidden matters', hi: 'आयु, रूपांतरण, गुप्त विषय', remedy_en: 'Mahamrityunjaya mantra, donate black items on Saturday', remedy_hi: 'महामृत्युंजय मंत्र, शनिवार काले वस्तुओं का दान' },
  9: { en: 'Fortune, father, dharma, higher education', hi: 'भाग्य, पिता, धर्म, उच्च शिक्षा', remedy_en: 'Jupiter remedies, pilgrimage, serve guru', remedy_hi: 'गुरु उपाय, तीर्थयात्रा, गुरु सेवा' },
  10: { en: 'Career, reputation, authority, karma', hi: 'करियर, प्रतिष्ठा, अधिकार, कर्म', remedy_en: 'Sun + Saturn remedies, Shani Stotra', remedy_hi: 'सूर्य + शनि उपाय, शनि स्तोत्र' },
  11: { en: 'Gains, income, elder siblings, desires', hi: 'लाभ, आय, बड़े भाई-बहन, इच्छाएं', remedy_en: 'Jupiter remedies, donate on Thursdays', remedy_hi: 'गुरु उपाय, गुरुवार दान' },
  12: { en: 'Losses, expenses, foreign travel, moksha', hi: 'हानि, खर्च, विदेश यात्रा, मोक्ष', remedy_en: 'Ketu remedies, meditation, spiritual practice', remedy_hi: 'केतु उपाय, ध्यान, आध्यात्मिक साधना' },
};

// ─── Yoga remedies table ─────────────────────────────────────────────────────

const COMMON_YOGA_REMEDIES = [
  { yoga: 'Kemadruma', issue: 'Loneliness, isolation', issueHi: 'अकेलापन, एकांत', remedy: 'Strengthen Moon — pearl, Monday fasting', remedyHi: 'चन्द्र बलवान करें — मोती, सोमवार व्रत' },
  { yoga: 'Mangal Dosha', issue: 'Marital conflict', issueHi: 'वैवाहिक विवाद', remedy: 'Mars remedies — red coral, Hanuman worship', remedyHi: 'मंगल उपाय — मूंगा, हनुमान पूजा' },
  { yoga: 'Kala Sarpa', issue: 'Career blocks', issueHi: 'करियर में बाधा', remedy: 'Rahu-Ketu remedies — Nag puja, Saturday charity', remedyHi: 'राहु-केतु उपाय — नाग पूजा, शनिवार दान' },
  { yoga: 'Guru Chandal', issue: 'Poor judgment', issueHi: 'खराब निर्णय', remedy: 'Jupiter remedies — yellow sapphire, Thursday puja', remedyHi: 'गुरु उपाय — पुखराज, गुरुवार पूजा' },
  { yoga: 'Daridra', issue: 'Financial struggle', issueHi: 'आर्थिक कठिनाई', remedy: '2nd/11th lord remedies, charity on Saturdays', remedyHi: '२/११ भावेश उपाय, शनिवार दान' },
];

// ─── Avastha quick reference ─────────────────────────────────────────────────

const AVASTHA_REFERENCE = [
  { state: 'Bala (infant)', meaning: 'Planet learning', good: 'Neutral', effect: 'Delayed but growing results', meaningHi: 'ग्रह सीख रहा है', effectHi: 'विलम्बित लेकिन बढ़ते परिणाम' },
  { state: 'Kumara (youth)', meaning: 'Planet developing', good: 'Good', effect: 'Moderate, improving results', meaningHi: 'ग्रह विकसित हो रहा', effectHi: 'मध्यम, सुधरते परिणाम' },
  { state: 'Yuva (prime)', meaning: 'Planet at peak', good: 'Best', effect: 'Full, strong results', meaningHi: 'ग्रह चरम पर', effectHi: 'पूर्ण, बलवान परिणाम' },
  { state: 'Vriddha (old)', meaning: 'Planet declining', good: 'Weak', effect: 'Diminishing results', meaningHi: 'ग्रह क्षीण हो रहा', effectHi: 'घटते परिणाम' },
  { state: 'Mrita (dead)', meaning: 'Planet exhausted', good: 'Worst', effect: 'Very weak or denied results', meaningHi: 'ग्रह थका हुआ', effectHi: 'बहुत कमजोर या अस्वीकृत परिणाम' },
  { state: 'Deepta (shining)', meaning: 'Exalted', good: 'Best', effect: 'Brilliant, effortless results', meaningHi: 'उच्च', effectHi: 'शानदार, सहज परिणाम' },
  { state: 'Swastha (content)', meaning: 'Own sign', good: 'Great', effect: 'Natural, comfortable results', meaningHi: 'स्वराशि', effectHi: 'स्वाभाविक, आरामदायक परिणाम' },
  { state: 'Mudita (happy)', meaning: 'Friend\'s sign', good: 'Good', effect: 'Cooperative results', meaningHi: 'मित्र राशि', effectHi: 'सहयोगात्मक परिणाम' },
  { state: 'Lajjita (ashamed)', meaning: '5th house with malefics', good: 'Bad', effect: 'Results with embarrassment', meaningHi: '5वें भाव में पाप ग्रह के साथ', effectHi: 'शर्मिंदगी के साथ परिणाम' },
  { state: 'Garvita (proud)', meaning: 'Exalted/moolatrikona', good: 'Best', effect: 'Confident, grand results', meaningHi: 'उच्च/मूलत्रिकोण', effectHi: 'आत्मविश्वासपूर्ण, भव्य परिणाम' },
  { state: 'Kshobhita (agitated)', meaning: 'With Sun + malefic aspect', good: 'Bad', effect: 'Results with stress', meaningHi: 'सूर्य + पाप दृष्टि के साथ', effectHi: 'तनाव के साथ परिणाम' },
  { state: 'Vikala (afflicted)', meaning: 'Debilitated or combust', good: 'Worst', effect: 'Erratic, blocked, or distorted results', meaningHi: 'नीच या अस्तंगत', effectHi: 'अनियमित, अवरुद्ध या विकृत परिणाम' },
];

// ─── Shared UI helpers ──────────────────────────────────────────────────────

function SectionCard({ children, border = 'border-sky-500/15', className = '' }: { children: React.ReactNode; border?: string; className?: string }) {
  return (
    <div className={`rounded-xl border ${border} bg-white/[0.03] backdrop-blur-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-lg font-semibold text-[#d4a853] mb-3">{children}</h4>;
}

function InfoParagraph({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-text-primary leading-relaxed mb-4">{children}</p>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SHADBALA INTERPRETATION
// ═══════════════════════════════════════════════════════════════════════════════

const PLANET_ALL_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const TIER_COLORS = { strong: '#22c55e', adequate: '#d4a853', weak: '#f59e0b', node: '#8b5cf6' } as const;

interface ShadbalaInterpretationProps {
  shadbala: ShadBalaComplete[];
  planets: PlanetPosition[];
  dashas: DashaEntry[];
  locale: string;
}

export function ShadbalaInterpretation({ shadbala, planets, dashas, locale }: ShadbalaInterpretationProps) {
  const isHi = isDevanagariLocale(locale);

  const sorted = useMemo(() => [...shadbala].sort((a, b) => b.rupas - a.rupas), [shadbala]);
  const strongest = sorted[0];
  const weakPlanets = sorted.filter(p => p.strengthRatio < 1.0);
  const mahadashas = useMemo(() => dashas.filter(d => d.level === 'maha'), [dashas]);

  const now = useMemo(() => new Date(), []);

  // Build lookup: English planet name → shadbala entry
  const shadByName = useMemo(() => {
    const map: Record<string, ShadBalaComplete | undefined> = {};
    sorted.forEach(sb => { const n = PLANET_NAMES_EN[sb.planetId]; if (n) map[n] = sb; });
    return map;
  }, [sorted]);

  function getDashaStrength(d: DashaEntry): { tier: 'strong' | 'adequate' | 'weak' | 'node'; rupas: number } {
    const name = d.planetName?.en || d.planet;
    const sb = shadByName[name];
    if (!sb) return { tier: 'node', rupas: 0 };
    if (sb.strengthRatio >= 1.5) return { tier: 'strong', rupas: sb.rupas };
    if (sb.strengthRatio >= 1.0) return { tier: 'adequate', rupas: sb.rupas };
    return { tier: 'weak', rupas: sb.rupas };
  }

  const TIER_LABELS = {
    strong: isHi ? 'बलवान' : 'Strong',
    adequate: isHi ? 'पर्याप्त' : 'Adequate',
    weak: isHi ? 'कमज़ोर' : 'Weak',
    node: isHi ? 'छाया ग्रह' : 'Shadow Planet',
  };

  const currentDasha = mahadashas.find(d => new Date(d.startDate) <= now && new Date(d.endDate) >= now);
  const upcomingStrong = mahadashas.filter(d => new Date(d.startDate) > now && getDashaStrength(d).tier === 'strong');
  const upcomingWeak = mahadashas.filter(d => new Date(d.startDate) > now && getDashaStrength(d).tier === 'weak');

  // Timeline bar geometry
  const firstStart = mahadashas.length ? new Date(mahadashas[0].startDate).getTime() : now.getTime();
  const lastEnd = mahadashas.length ? new Date(mahadashas[mahadashas.length - 1].endDate).getTime() : now.getTime() + 1;
  const totalMs = lastEnd - firstStart || 1;
  const nowOffset = Math.max(0, Math.min(100, (now.getTime() - firstStart) / totalMs * 100));

  function getDashaForecast(d: DashaEntry, tier: 'strong' | 'adequate' | 'weak' | 'node'): string {
    const name = d.planetName?.en || d.planet;
    const id = PLANET_ALL_NAMES.indexOf(name);
    if (tier === 'node') return isHi ? (RAHU_KETU_FORECAST[id]?.hi ?? '') : (RAHU_KETU_FORECAST[id]?.en ?? '');
    const f = PLANET_DASHA_FORECAST[id];
    if (!f) return '';
    if (tier === 'strong') return isHi ? f.strongHi : f.strongEn;
    if (tier === 'adequate') return isHi ? f.adequateHi : f.adequateEn;
    return isHi ? f.weakHi : f.weakEn;
  }

  function getDashaAction(d: DashaEntry): string {
    const name = d.planetName?.en || d.planet;
    const id = PLANET_ALL_NAMES.indexOf(name);
    return isHi ? (PLANET_DASHA_FORECAST[id]?.actionHi ?? '') : (PLANET_DASHA_FORECAST[id]?.actionEn ?? '');
  }

  if (!sorted.length) return null;

  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-gold-primary text-xs uppercase tracking-wider font-bold border-b border-gold-primary/20 pb-2">
        {isHi ? 'षड्बल — आपके लिए इसका अर्थ' : 'Shadbala — What It Means For You'}
      </h3>

      {/* Current period */}
      {currentDasha && (() => {
        const { tier, rupas } = getDashaStrength(currentDasha);
        const name = currentDasha.planetName?.en || currentDasha.planet;
        const displayName = isHi ? (currentDasha.planetName?.hi || name) : name;
        const endYear = new Date(currentDasha.endDate).getFullYear();
        const forecast = getDashaForecast(currentDasha, tier);
        const action = getDashaAction(currentDasha);
        const tierColor = tier === 'strong' ? 'text-green-400' : tier === 'weak' ? 'text-amber-400' : tier === 'node' ? 'text-purple-400' : 'text-gold-light';
        return (
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-4">
            <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-2">
              {isHi ? 'आपका अभी का दशा काल' : 'Your Current Dasha Period'}
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TIER_COLORS[tier] }} />
              <span className="text-gold-light font-semibold text-sm">{displayName} {isHi ? 'महादशा' : 'Mahadasha'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full bg-white/5 font-medium ${tierColor}`}>
                {TIER_LABELS[tier]}{rupas > 0 ? ` · ${rupas.toFixed(2)} R` : ''}
              </span>
              <span className="text-text-secondary text-xs">→ {endYear}</span>
            </div>
            {forecast && <p className="text-text-secondary text-sm leading-relaxed">{forecast}</p>}
            {action && (
              <p className="text-gold-primary/80 text-xs mt-2 italic">
                {isHi ? 'अभी करें: ' : 'Best actions now: '}{action}
              </p>
            )}
          </div>
        );
      })()}

      {/* Life Dasha Timeline */}
      {mahadashas.length > 0 && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4">
          <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-3">
            {isHi ? 'जीवन दशा समयरेखा' : 'Life Dasha Timeline'}
          </div>

          {/* Proportional bar */}
          <div className="relative h-5 rounded-lg overflow-hidden flex mb-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {mahadashas.map((d, i) => {
              const start = new Date(d.startDate).getTime();
              const end = new Date(d.endDate).getTime();
              const width = (end - start) / totalMs * 100;
              const { tier } = getDashaStrength(d);
              const isPast = end < now.getTime();
              const isCurrent = start <= now.getTime() && end >= now.getTime();
              return (
                <div key={i} title={`${d.planetName?.en || d.planet}: ${new Date(d.startDate).getFullYear()}–${new Date(d.endDate).getFullYear()}`}
                  style={{ width: `${width}%`, backgroundColor: TIER_COLORS[tier], opacity: isPast ? 0.25 : isCurrent ? 1 : 0.65 }}
                  className="h-full shrink-0"
                />
              );
            })}
            {/* Now marker */}
            <div className="absolute top-0 bottom-0 w-px bg-white/90" style={{ left: `${nowOffset}%` }} />
          </div>

          {/* Legend */}
          <div className="flex gap-3 flex-wrap mt-2 mb-3">
            {(['strong', 'adequate', 'weak', 'node'] as const).map(t => (
              <div key={t} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: TIER_COLORS[t] }} />
                <span className="text-text-secondary text-xs">{TIER_LABELS[t]}</span>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <div className="w-px h-3.5 bg-white/70" />
              <span className="text-text-secondary text-xs">{isHi ? 'अभी' : 'Now'}</span>
            </div>
          </div>

          {/* Period rows */}
          <div className="space-y-1.5">
            {mahadashas.map((d, i) => {
              const { tier, rupas } = getDashaStrength(d);
              const name = d.planetName?.en || d.planet;
              const displayName = isHi ? (d.planetName?.hi || name) : name;
              const startY = new Date(d.startDate).getFullYear();
              const endY = new Date(d.endDate).getFullYear();
              const isPast = new Date(d.endDate) < now;
              const isCurrent = new Date(d.startDate) <= now && new Date(d.endDate) >= now;
              const forecast = getDashaForecast(d, tier);
              const tierColor = tier === 'strong' ? 'text-green-400' : tier === 'weak' ? 'text-amber-400' : tier === 'node' ? 'text-purple-400' : 'text-gold-light';
              return (
                <div key={i} className={`rounded-lg px-3 py-2 ${isCurrent ? 'bg-gold-primary/8 border border-gold-primary/20' : 'bg-white/[0.02]'} ${isPast ? 'opacity-35' : ''}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: TIER_COLORS[tier] }} />
                    <span className={`font-medium text-sm ${isCurrent ? 'text-gold-light' : 'text-text-secondary'}`}>{displayName}</span>
                    <span className="text-text-secondary/70 text-xs">{startY}–{endY}</span>
                    {isCurrent && (
                      <span className="text-xs bg-gold-primary/20 text-gold-light px-1.5 py-0.5 rounded-full font-medium">{isHi ? 'अभी' : 'Now'}</span>
                    )}
                    <span className={`text-xs ml-auto ${tierColor}`}>
                      {TIER_LABELS[tier]}{rupas > 0 ? ` · ${rupas.toFixed(1)}R` : ''}
                    </span>
                  </div>
                  {!isPast && forecast && (
                    <p className="text-text-secondary/75 text-xs mt-1 pl-4 leading-relaxed">{forecast}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chart Captain */}
      {strongest && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-4">
          <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-2">
            {isHi ? 'आपकी कुंडली का सेनापति' : 'Your Chart Captain'}
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
              <span className="text-green-400 font-bold text-sm">1</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-gold-light font-semibold text-sm">{pName(strongest.planetId, isHi)}</span>
                <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full font-medium">{strongest.rupas.toFixed(2)} Rupas</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-2">
                {isHi
                  ? `${pName(strongest.planetId, true)} आपकी सर्वाधिक बलवान ग्रह है। इसके विषय — ${PLANET_THEMES[strongest.planetId]?.strongHi ?? ''} — आपके जीवन पर प्रभुत्व रखते हैं।`
                  : `${pName(strongest.planetId, false)} is your most powerful planet. Its themes — ${PLANET_THEMES[strongest.planetId]?.strong ?? ''} — run through your life most powerfully.`}
              </p>
              {PLANET_DASHA_FORECAST[strongest.planetId] && (
                <p className="text-gold-primary/80 text-xs italic">
                  {isHi ? 'इसकी महादशा में: ' : 'During its Mahadasha: '}
                  {isHi ? PLANET_DASHA_FORECAST[strongest.planetId].strongHi : PLANET_DASHA_FORECAST[strongest.planetId].strongEn}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming turning points */}
      {(upcomingStrong.length > 0 || upcomingWeak.length > 0) && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4">
          <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-3">
            {isHi ? 'आने वाले महत्वपूर्ण काल' : 'Upcoming Key Periods'}
          </div>
          <div className="space-y-2">
            {upcomingStrong.slice(0, 2).map((d, i) => {
              const name = d.planetName?.en || d.planet;
              const displayName = isHi ? (d.planetName?.hi || name) : name;
              const id = PLANET_ALL_NAMES.indexOf(name);
              const startY = new Date(d.startDate).getFullYear();
              const endY = new Date(d.endDate).getFullYear();
              return (
                <div key={`s${i}`} className="flex items-start gap-2 p-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-green-400 font-medium text-sm">{displayName} ({startY}–{endY})</span>
                    <span className="text-text-secondary text-xs ml-2">{isHi ? '— सुनहरा काल' : '— Golden period'}</span>
                    {PLANET_DASHA_FORECAST[id] && (
                      <p className="text-text-secondary/75 text-xs mt-0.5">
                        {isHi ? PLANET_DASHA_FORECAST[id].actionHi : PLANET_DASHA_FORECAST[id].actionEn}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {upcomingWeak.slice(0, 2).map((d, i) => {
              const name = d.planetName?.en || d.planet;
              const displayName = isHi ? (d.planetName?.hi || name) : name;
              const id = PLANET_ALL_NAMES.indexOf(name);
              const startY = new Date(d.startDate).getFullYear();
              const endY = new Date(d.endDate).getFullYear();
              return (
                <div key={`w${i}`} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-amber-400 font-medium text-sm">{displayName} ({startY}–{endY})</span>
                    <span className="text-text-secondary text-xs ml-2">{isHi ? '— सावधान रहें' : '— Proceed with care'}</span>
                    {PLANET_REMEDIES[id] && (
                      <p className="text-text-secondary/75 text-xs mt-0.5">
                        {isHi ? `उपाय: ${PLANET_REMEDIES[id].hi}` : `Remedy: ${PLANET_REMEDIES[id].en}`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Planets needing support */}
      {weakPlanets.length > 0 && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4">
          <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-3">
            {isHi ? 'सहायता चाहिए' : 'Planets Needing Support'}
          </div>
          <div className="space-y-2">
            {weakPlanets.map(wp => {
              const matchName = PLANET_NAMES_EN[wp.planetId];
              const dashaForPlanet = mahadashas.find(d => (d.planetName?.en || d.planet) === matchName);
              const dashaDates = dashaForPlanet
                ? ` (${new Date(dashaForPlanet.startDate).getFullYear()}–${new Date(dashaForPlanet.endDate).getFullYear()})`
                : '';
              return (
                <div key={wp.planetId} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-400 font-semibold text-sm">{pName(wp.planetId, isHi)}</span>
                    <span className="text-amber-400/60 text-xs">{wp.rupas.toFixed(2)} Rupas{dashaDates}</span>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed mb-1.5">
                    {isHi ? PLANET_THEMES[wp.planetId]?.weakHi : PLANET_THEMES[wp.planetId]?.weak}
                  </p>
                  <p className="text-gold-primary/70 text-xs italic">
                    {isHi ? 'उपाय: ' : 'Remedy: '}{isHi ? PLANET_REMEDIES[wp.planetId]?.hi : PLANET_REMEDIES[wp.planetId]?.en}
                  </p>
                  {PLANET_REMEDIES[wp.planetId]?.whyEn && (
                    <p className="text-text-secondary/50 text-xs mt-1">
                      {isHi ? `क्यों: ${PLANET_REMEDIES[wp.planetId].whyHi}` : `Why: ${PLANET_REMEDIES[wp.planetId].whyEn}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Combined Strength Ranking + Ratio chart */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-gold-primary text-xs uppercase tracking-wider font-bold">
            {isHi ? 'बल क्रमांकन — अनुपात सहित' : 'Strength Ranking & Ratio'}
          </div>
          <div className="text-text-secondary/65 text-xs font-mono">
            {isHi ? 'न्यूनतम = 1.0' : 'Min. = 1.0'}
          </div>
        </div>
        {/* Legend */}
        <div className="flex gap-3 mb-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />{isHi ? 'प्रबल ≥1.5×' : 'Strong ≥1.5× min'}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{isHi ? 'पर्याप्त ≥1.0×' : 'Adequate ≥1.0× min'}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />{isHi ? 'दुर्बल <1.0×' : 'Weak <1.0× min'}</span>
          <span className="text-text-tertiary/40 ml-1">{isHi ? '(BPHS अ.27)' : '(BPHS Ch.27)'}</span>
        </div>
        <div className="space-y-3">
          {sorted.map((sb, i) => {
            const tier = sb.strengthRatio >= 1.5 ? 'strong' : sb.strengthRatio >= 1.0 ? 'adequate' : 'weak';
            const barColor = tier === 'strong' ? '#4ade80' : tier === 'adequate' ? '#d4a853' : '#f87171';
            // Bar represents ratio capped at 2.0 so 1.0 = 50%
            const ratioBarW = Math.min(100, (sb.strengthRatio / 2.0) * 100);
            const themes = PLANET_THEMES[sb.planetId];
            const implication = tier !== 'weak'
              ? (isHi ? themes?.strongHi : themes?.strong)
              : (isHi ? themes?.weakHi : themes?.weak);
            return (
              <div key={sb.planetId}>
                <div className="flex items-center gap-2">
                  <span className="w-4 text-center text-[10px] text-text-secondary/65 font-mono flex-shrink-0">{i + 1}</span>
                  <span className="w-16 font-semibold text-sm flex-shrink-0" style={{ color: barColor }}>
                    {pName(sb.planetId, isHi)}
                  </span>
                  {/* Bar with 1.0 threshold at 50% */}
                  <div className="flex-1 relative h-2 bg-white/5 rounded-full overflow-visible">
                    <div className="h-full rounded-full" style={{ width: `${ratioBarW}%`, backgroundColor: barColor, opacity: 0.85 }} />
                    {/* 1.0 line at exactly 50% */}
                    <div className="absolute top-0 bottom-0 w-px bg-white/30" style={{ left: '50%' }} />
                  </div>
                  <span className="text-[11px] font-mono flex-shrink-0 w-10 text-right" style={{ color: barColor }}>{sb.strengthRatio.toFixed(2)}</span>
                  <span className="text-[10px] text-text-secondary/65 font-mono flex-shrink-0 w-12 text-right">{sb.rupas.toFixed(2)}R</span>
                </div>
                {implication && (
                  <p className="text-text-secondary/70 text-xs pl-6 mt-0.5 leading-relaxed">{implication}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. YOGAS INTERPRETATION
// ═══════════════════════════════════════════════════════════════════════════════

interface YogasInterpretationProps {
  yogas: YogaComplete[];
  locale: string;
}

export function YogasInterpretation({ yogas, locale }: YogasInterpretationProps) {
  const isHi = isDevanagariLocale(locale);

  const present = yogas.filter(y => y.present);
  const auspicious = present.filter(y => y.isAuspicious);
  const inauspicious = present.filter(y => !y.isAuspicious);
  const mixed = present.filter(y => y.category === 'other');

  if (!present.length) return null;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'योग विश्लेषण' : 'Yogas Interpretation'}
      </h3>

      {/* Summary */}
      <SectionCard>
        <SectionHeading>{isHi ? 'सारांश' : 'Summary'}</SectionHeading>
        <InfoParagraph>
          {isHi
            ? `आपकी कुंडली में ${present.length} योग पाए गए: ${auspicious.length} शुभ, ${inauspicious.length} अशुभ, ${mixed.length} मिश्रित।`
            : `Your chart has ${present.length} yogas detected: ${auspicious.length} auspicious, ${inauspicious.length} inauspicious, ${mixed.length} mixed.`}
        </InfoParagraph>
      </SectionCard>

      {/* Auspicious Yogas */}
      {auspicious.length > 0 && (
        <SectionCard border="border-emerald-500/15">
          <SectionHeading>{isHi ? 'शुभ योग' : 'Top Auspicious Yogas'}</SectionHeading>
          <div className="space-y-4">
            {auspicious.map(y => (
              <div key={y.id} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-emerald-400 text-sm">{isHi ? y.name.hi : y.name.en}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    y.strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                    y.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {y.strength}
                  </span>
                </div>
                <p className="text-xs text-text-primary leading-relaxed mb-1">
                  <span className="text-text-secondary/60">{isHi ? 'आपके लिए अर्थ: ' : 'What it means for you: '}</span>
                  {isHi ? y.description.hi : y.description.en}
                </p>
                <p className="text-xs text-text-secondary">
                  <span className="text-text-secondary/60">{isHi ? 'निर्माण नियम: ' : 'Formation: '}</span>
                  {isHi ? y.formationRule.hi : y.formationRule.en}
                </p>
                <p className="text-xs text-sky-400 mt-1">
                  {isHi
                    ? 'अधिकतम लाभ हेतु: इसके निर्माणकारी ग्रह की दशा में सक्रिय होता है। उस अवधि में सकारात्मक कार्य करें।'
                    : 'How to maximize: This yoga activates most during the Mahadasha of its forming planets. Take positive action during those periods.'}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Inauspicious Yogas */}
      {inauspicious.length > 0 && (
        <SectionCard border="border-amber-500/15">
          <SectionHeading>{isHi ? 'अशुभ योग एवं उपाय' : 'Inauspicious Yogas & What To Do'}</SectionHeading>
          <div className="space-y-4">
            {inauspicious.map(y => (
              <div key={y.id} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-amber-400 text-sm">{isHi ? y.name.hi : y.name.en}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    y.strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                    y.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {y.strength}
                  </span>
                </div>
                <p className="text-xs text-text-primary leading-relaxed mb-1">
                  <span className="text-text-secondary/60">{isHi ? 'संकेत: ' : 'What this indicates: '}</span>
                  {isHi ? y.description.hi : y.description.en}
                </p>
                <p className="text-xs text-emerald-400/80 italic mb-1">
                  {isHi
                    ? 'यह कोई श्राप नहीं है — यह एक कार्मिक प्रारूप है जिस पर कार्य किया जा सकता है।'
                    : 'This is NOT a curse — it\'s a karmic pattern that can be worked with.'}
                </p>
                <p className="text-xs text-text-secondary">
                  <span className="text-text-secondary/60">{isHi ? 'निर्माण: ' : 'Formation: '}</span>
                  {isHi ? y.formationRule.hi : y.formationRule.en}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Common Yoga Remedies Table */}
      <SectionCard border="border-emerald-500/15">
        <SectionHeading>{isHi ? 'सामान्य योग उपाय' : 'Common Yoga Remedies'}</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-2 text-text-secondary font-medium">{isHi ? 'योग' : 'Yoga'}</th>
                <th className="text-left py-2 px-2 text-text-secondary font-medium">{isHi ? 'समस्या' : 'Issue'}</th>
                <th className="text-left py-2 px-2 text-text-secondary font-medium">{isHi ? 'उपाय' : 'Remedy'}</th>
              </tr>
            </thead>
            <tbody>
              {COMMON_YOGA_REMEDIES.map(r => (
                <tr key={r.yoga} className="border-b border-white/5">
                  <td className="py-2 px-2 text-[#d4a853] font-medium">{r.yoga}</td>
                  <td className="py-2 px-2 text-text-primary">{isHi ? r.issueHi : r.issue}</td>
                  <td className="py-2 px-2 text-emerald-400/80">{isHi ? r.remedyHi : r.remedy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. AVASTHAS INTERPRETATION
// ═══════════════════════════════════════════════════════════════════════════════

interface AvasthasInterpretationProps {
  avasthas: PlanetAvasthas[];
  planets: PlanetPosition[];
  locale: string;
}

export function AvasthasInterpretation({ avasthas, planets: _planets, locale }: AvasthasInterpretationProps) {
  const isHi = isDevanagariLocale(locale);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showHowChange, setShowHowChange] = useState(false);

  if (!avasthas.length) return null;

  // Planet domain keywords for synthesis text
  const PLANET_DOMAIN: Record<number, { en: string }> = {
    0: { en: 'career, authority, father, soul-purpose' },
    1: { en: 'emotions, mind, mother, public perception' },
    2: { en: 'courage, energy, property, siblings' },
    3: { en: 'intellect, communication, business, education' },
    4: { en: 'wisdom, children, wealth, spirituality' },
    5: { en: 'relationships, beauty, creativity, pleasure' },
    6: { en: 'discipline, longevity, service, karma' },
    7: { en: 'ambition, foreign connections, unusual gains/losses' },
    8: { en: 'detachment, past karma, intuition, liberation' },
  };

  // Baladi state implications per planet — uses av.baladi.state as key
  const BALADI_PLANET: Record<string, Record<number, string>> = {
    bala: {
      0: 'Career and authority are still forming — recognition is coming but requires patience. Father relationship is developing.',
      1: 'Emotions and mind are unsteady, learning to regulate — moods fluctuate but grow more stable with time.',
      2: 'Courage and initiative are forming — bursts of energy exist but sustained drive is still being built.',
      3: 'Intellect is sharp but inconsistent — great ideas arrive, but follow-through is still developing.',
      4: 'Wisdom and prosperity are in early stages — good judgment is forming, guidance comes intermittently.',
      5: 'Relationships and pleasures are new territory — attraction is there but lasting partnerships are still forming.',
      6: 'Discipline is being learned — routines help but consistency is not yet established. Career is on a building track.',
      7: 'Ambition is waking up — unconventional opportunities arise but direction is not yet clear.',
      8: 'Spiritual intuition is awakening — past-life patterns are just beginning to surface.',
    },
    kumara: {
      0: 'Career is steadily building toward recognition. Authority is growing; father is a constructive presence.',
      1: 'Emotional intelligence is developing well — mind is more stable, mother is a positive influence.',
      2: 'Courage and physical energy are solid — property goals and sibling relationships are constructive.',
      3: 'Communication and business skills are developing well — good for studies, deals, writing, and analysis.',
      4: 'Wisdom is expanding meaningfully — children, wealth, and spiritual practice show positive momentum.',
      5: 'Relationships are developing with real depth — creative projects are gaining traction.',
      6: 'Discipline is becoming a genuine strength — career and health both show steady, reliable improvement.',
      7: 'Ambition is channeling constructively — foreign or unconventional opportunities are within reach.',
      8: 'Spiritual depth is building — intuition is growing more reliable, karmic lessons are being integrated.',
    },
    yuva: {
      0: 'Career and authority are at peak potential — recognition flows naturally. Father brings blessings and support.',
      1: 'Emotional and mental wellbeing are excellent — strong public image, mother is very supportive.',
      2: 'Courage and energy are at maximum — property, siblings, and physical vitality all thrive.',
      3: 'Intellect and communication fire on all cylinders — business, education, and writing all excel.',
      4: 'Wisdom and prosperity at peak — excellent period for children, wealth accumulation, and spiritual growth.',
      5: 'Relationships and pleasures are deeply fulfilling — creativity shines and partnerships genuinely flourish.',
      6: 'Discipline and karma are fully rewarding — career is solid, health is reliable, longevity is favored.',
      7: 'Ambition is at full force — foreign ventures and unconventional paths open wide.',
      8: 'Spiritual insights are powerful and clear — intuition is sharp and karmic purposes are understood.',
    },
    vriddha: {
      0: 'Career and authority are waning — still functional but peak has passed. Father may need care or attention.',
      1: 'Emotional sensitivity is high — the mind tires easily. Mother\'s health or wellbeing may need attention.',
      2: 'Energy and courage are fading — avoid reckless physical risks. Property and sibling matters can drag.',
      3: 'Communication and intellect are slowing — good ideas come but execution is harder. Review agreements carefully.',
      4: 'Wisdom is rich but material prosperity is declining — avoid overleveraging. Children benefit from independence.',
      5: 'Relationship energy is dimming — creativity still flows but pleasure-seeking needs moderation.',
      6: 'Discipline is still present but tiring — avoid overwork. Joint, bone, and dental health deserve attention.',
      7: 'Ambition is fading — past opportunities feel better than present ones. Consolidate rather than expand.',
      8: 'Spiritual detachment is deepening naturally — this is not a loss but a shift toward inner orientation.',
    },
    mrita: {
      0: 'Career and authority feel blocked or denied — recognition may be withdrawn. Father relationship is strained. Targeted remedies are essential.',
      1: 'Emotional turbulence is significant — anxiety, depression risk, or a mother\'s serious health concern. Moon remedies are needed.',
      2: 'Courage and energy are very depleted — accident risk, property loss, sibling conflict possible. Extra caution required.',
      3: 'Intellect and communication are severely hampered — poor decisions, misunderstandings likely. Avoid signing major agreements.',
      4: 'Wisdom and prosperity are blocked — financial misjudgments, poor advice, children may face hardship. Seek trusted counsel.',
      5: 'Relationship and pleasure energies are suppressed — relationship dissolution risk, creative blocks. Deep Venus remedies are needed.',
      6: 'Discipline and karma are exhausted — serious career obstacles, chronic health issues possible. Rest and patient rebuilding required.',
      7: 'Ambition backfires — foreign ventures or unconventional risks tend toward losses. Extreme caution with speculation.',
      8: 'Spiritual confusion or past-karma weight is heavy — escapism and isolation risk. Consistent spiritual practice is the remedy.',
    },
  };

  // Jagradadi state: planet-specific % output meaning
  const JAGRADADI_PLANET: Record<string, Record<number, string>> = {
    jagrat: {
      0: 'Fully delivering career recognition and authority — what your Sun promises in your chart is arriving completely.',
      1: 'Emotions and intuition are sharp and reliable — full mental and emotional output, responsive and clear.',
      2: 'Physical energy, courage, and initiative are at 100% — this is the time for bold, decisive action.',
      3: 'Intellect and communication are at maximum clarity — best window for negotiations, studies, and decisions.',
      4: 'Wisdom and good fortune are fully active — Jupiter\'s blessings flow without obstruction.',
      5: 'Relationships and pleasures are fully alive — partnerships are at their most rewarding and generative.',
      6: 'Discipline and karma are fully delivering — consistent efforts are paying off completely and visibly.',
      7: 'Ambition and unusual opportunities are fully awake — foreign or unconventional paths genuinely deliver.',
      8: 'Spiritual insight and detachment are clear and reliable — past-karma lessons are fully conscious.',
    },
    swapna: {
      0: 'Career and authority at ~50% — opportunities exist but aren\'t fully materializing. You sense the potential but it stays just out of reach.',
      1: 'Emotions are half-aware — you feel things deeply but can\'t always act on them. Mind drifts between clarity and fog.',
      2: 'Courage is present in your mind but doesn\'t always translate into action. Energy comes in waves rather than sustained flow.',
      3: 'Good ideas arrive but execution is inconsistent. About half of your intellectual potential is expressing.',
      4: 'Wisdom is present but only partially guiding decisions. Luck comes and goes without a clear pattern.',
      5: 'Relationship potential exists but isn\'t fully actualized — creative ideas start but often stay half-finished.',
      6: 'Discipline is inconsistent — good days and bad days alternate. Karma pays back at roughly half rate.',
      7: 'Ambition is dreaming but not executing — opportunities appear but feel just out of reach.',
      8: 'Spiritual awareness flickers — glimpses of insight but not sustained clarity. Dedicated meditation helps enormously.',
    },
    sushupta: {
      0: 'Career and authority are deeply suppressed — only ~25% of what your Sun promises arrives. Recognition feels inexplicably blocked.',
      1: 'Emotional and mental energies are deeply inward — depression risk, difficulty connecting. The mind is asleep to its own potential.',
      2: 'Courage and physical drive are very low — passivity, conflict avoidance, property matters stall without apparent reason.',
      3: 'Intellect and communication are muted — decisions feel foggy, words don\'t come easily, mental clarity is hard to sustain.',
      4: 'Wisdom and prosperity are locked away — good fortune doesn\'t arrive despite clear potential. Effort feels unrewarded.',
      5: 'Relationship fulfillment is deeply blocked — loneliness, unfulfilled desires, creativity unexpressed despite genuine talent.',
      6: 'Discipline and karma are in deep freeze — career stagnates and health routines are very hard to maintain consistently.',
      7: 'Ambitions are dormant — nothing unusual manifests; life feels static and ordinary despite the inner drive.',
      8: 'Spiritual connection feels absent — no intuition, no guidance, feeling lost. Seeking a teacher or lineage is very helpful.',
    },
  };

  // Deeptadi visual tags
  const DEEPTA_TAG: Record<string, { label: string; color: string; meaning: string }> = {
    deepta:   { label: 'Shining', color: 'bg-yellow-500/20 text-yellow-200', meaning: 'Exalted — peak luminosity, delivering brilliantly' },
    swastha:  { label: 'Stable', color: 'bg-emerald-500/20 text-emerald-300', meaning: 'Own sign — comfortable, reliable, natural results' },
    mudita:   { label: 'Happy', color: 'bg-sky-500/20 text-sky-300', meaning: 'Friend\'s sign — cooperative, warm, willing' },
    shanta:   { label: 'Calm', color: 'bg-teal-500/20 text-teal-300', meaning: 'Great friend\'s sign — steady and peaceful output' },
    dina:     { label: 'Dim', color: 'bg-orange-500/20 text-orange-300', meaning: 'Enemy sign — reduced output, needs supportive transits' },
    dukhita:  { label: 'Sad', color: 'bg-amber-500/20 text-amber-400', meaning: 'Defeated in planetary war — results come with struggle' },
    vikala:   { label: 'Afflicted', color: 'bg-red-500/20 text-red-300', meaning: 'Debilitated or combust — distorted, erratic, blocked results' },
    khala:    { label: 'Harsh', color: 'bg-rose-500/20 text-rose-300', meaning: 'Retrograde in enemy sign — results arrive forcefully or abruptly' },
  };

  // Lajjitadi visual tags
  const LAJJITA_TAG: Record<string, { label: string; color: string; meaning: string }> = {
    lajjita:   { label: 'Ashamed', color: 'bg-red-500/20 text-red-300', meaning: 'In 5th house with Rahu/Ketu/Saturn — uncomfortable, blocked delivery' },
    garvita:   { label: 'Proud', color: 'bg-yellow-500/20 text-yellow-200', meaning: 'Exalted or Moolatrikona — delivers with full confidence' },
    kshudita:  { label: 'Hungry', color: 'bg-amber-500/20 text-amber-300', meaning: 'With enemy planet — insatiable, restless, craving output' },
    trushita:  { label: 'Thirsty', color: 'bg-orange-500/20 text-orange-300', meaning: 'With watery planet in enemy sign — craving, persistent effort needed' },
    mudita:    { label: 'Happy', color: 'bg-emerald-500/20 text-emerald-300', meaning: 'With friendly planet — warm, cooperative, willing delivery' },
    kshobhita: { label: 'Agitated', color: 'bg-purple-500/20 text-purple-300', meaning: 'With Sun + malefic aspect — volatile, stressed, unpredictable results' },
  };

  // Shayanadi visual tags
  const SHAYANA_TAG: Record<string, { label: string; color: string; meaning: string }> = {
    nidraa:     { label: 'Sleeping', color: 'bg-indigo-500/20 text-indigo-300', meaning: 'Deeply inactive — needs activation through effort or remedies' },
    gamana:     { label: 'Moving', color: 'bg-sky-500/20 text-sky-300', meaning: 'Actively in motion — pursuing results with energy' },
    agama:      { label: 'Returning', color: 'bg-teal-500/20 text-teal-300', meaning: 'Retrograde echo — results come back around, second chances' },
    bhojana:    { label: 'Nourishing', color: 'bg-emerald-500/20 text-emerald-300', meaning: 'Absorbing resources — building strength, receiving phase' },
    kautuka:    { label: 'Curious', color: 'bg-lime-500/20 text-lime-300', meaning: 'Playful — results arrive in unexpected, light-touch ways' },
    upavesha:   { label: 'Settled', color: 'bg-amber-500/20 text-amber-300', meaning: 'Seated and stable — consistent but not dynamic results' },
    netrapani:  { label: 'Watchful', color: 'bg-cyan-500/20 text-cyan-300', meaning: 'Alert and observing — results come through patience and strategy' },
  };

  // Per-planet synthesis paragraph
  function getSynthesis(av: PlanetAvasthas): string {
    const bState = av.baladi.state;
    const jState = av.jagradadi.state;
    const dState = av.deeptadi.state;
    const lState = av.lajjitadi.state;
    const domain = PLANET_DOMAIN[av.planetId]?.en ?? 'this planet\'s domain';
    const name = PLANET_NAMES_EN[av.planetId] ?? `Planet ${av.planetId}`;

    const isStrong = bState === 'yuva' || bState === 'kumara';
    const isWeak = bState === 'mrita' || bState === 'vriddha';
    const isAwake = jState === 'jagrat';
    const isSleeping = jState === 'sushupta';
    const isShining = ['deepta', 'swastha', 'mudita', 'shanta'].includes(dState);
    const isAfflicted = dState === 'vikala' || dState === 'khala';
    const isHappy = lState === 'garvita' || lState === 'mudita';
    const isDistressed = lState === 'lajjita' || lState === 'kshobhita' || lState === 'kshudita';

    if (isStrong && isAwake && isShining && isHappy) {
      return `Your ${name} is in an exceptionally powerful configuration — at its age-peak, fully awake, luminously placed, and emotionally content. Everything connected to ${domain} is primed to deliver its finest results. Actively invest in this planet's themes now.`;
    }
    if (isWeak && isSleeping && isAfflicted) {
      return `Your ${name} is under significant multi-layered pressure — declining in age-strength, dormant in output, and luminously afflicted. The domain of ${domain} requires conscious remediation and patient rebuilding. This is not permanent — states shift meaningfully with dashas and transits.`;
    }
    if (isStrong && isSleeping) {
      return `Interesting tension: your ${name} has real age-strength (${bState}) but is dormant in output (Sushupta — ~25%). Like a powerful engine in sleep mode. The right dasha activation, or targeted remedies, can unlock significant results in ${domain} that are clearly present but not yet manifesting.`;
    }
    if (isWeak && isAwake) {
      return `Your ${name} is fully awake (Jagrat) but declining in age-strength (${bState}). It is visibly trying to deliver — you may see genuine effort without proportionate reward in ${domain}. Targeted remedies to support this planet's energy will sustain its output through this phase.`;
    }
    if (isAfflicted && isDistressed) {
      return `Your ${name} faces a double challenge: luminous affliction (${dState}) and emotional distress (${lState}). Results in ${domain} may arrive with complications or through difficult circumstances. Working on the specific affliction — combustion, debilitation, or planetary war — can bring meaningful and lasting improvement.`;
    }
    const strengthWord = isStrong ? 'solid age-strength' : isWeak ? 'reduced age-strength' : 'moderate age-strength';
    const awakenessWord = isAwake ? 'is fully awake' : isSleeping ? 'is in deep sleep mode (~25% output)' : 'is partially awake (~50% output)';
    const moodWord = isHappy ? 'is emotionally content' : isDistressed ? 'is emotionally stressed' : 'is emotionally neutral';
    return `Your ${name} carries ${strengthWord}, ${awakenessWord}, and ${moodWord}. In the domain of ${domain}, expect ${isStrong && isAwake ? 'reliable, meaningful' : isWeak || isSleeping ? 'inconsistent or reduced' : 'moderate'} results. ${isDistressed ? 'Mantra and charitable acts for this planet will help ease the emotional strain.' : ''}`;
  }

  // Activation guidance for weak/sleeping planets
  const HOW_TO_ACTIVATE: Record<string, string> = {
    sushupta: 'Activate from deep sleep: (1) Daily mantra for this planet — even 7–10 minutes creates a "wake signal" over weeks. (2) Entering this planet\'s own Mahadasha or Antardasha naturally stirs it. (3) Neecha Bhanga rules — if debilitation is cancelled, Sushupti lifts substantially. (4) Jupiter transiting this planet\'s natal degree (conjunction or trine) gives a 1–2 month temporary awakening. (5) The right gemstone worn consistently acts as a long-duration activation.',
    swapna: 'Elevate from half-awake: (1) Strengthen the sign lord (Bhava lord) — improving the "container" the planet operates in raises output. (2) Reduce opposing malefic influence through that planet\'s remedies. (3) Consistent aligned action in this planet\'s domain — actively working in its themes slowly lifts Swapna toward Jagrat.',
    mrita: 'For a blocked Mrita planet: (1) Remedies are most essential — Mantra japa, gemstone, fasting on this planet\'s day, donating its associated items. (2) During its Mahadasha: life will push you to confront this domain — cooperate actively. (3) Neecha Bhanga check: if the debilitation lord is angular or the dispositor is exalted, the block is partially lifted even if fixed in the chart. (4) The Mrita state is natally fixed, but dashas and supportive transits can substantially revive it.',
    vriddha: 'Sustaining a Vriddha planet: (1) Work with what remains — Vriddha still delivers, just with more effort. (2) Avoid overextending in this domain. (3) Dashas of this planet can temporarily revive Vriddha energy toward its former peak. (4) Rest and consolidation preserve output better than forcing.',
  };

  const HOW_CHANGE_SECTIONS = [
    {
      title: 'Baladi (Age) — When Does It Change?',
      body: 'Baladi states are fixed in the NATAL chart by the planet\'s degree within its sign: Bala (0°–6°), Kumara (6°–12°), Yuva (12°–18°), Vriddha (18°–24°), Mrita (24°–30°). These never change in your birth chart.\n\nIn TRANSITS, however, a moving planet cycles through all 5 states every 30° (one sign). Watch when a transiting planet enters the Yuva zone (12°–18°) in a key house — that window is when it delivers its strongest transiting results.',
    },
    {
      title: 'Jagradadi (Wakefulness) — How Does a Planet Wake Up?',
      body: 'Natal Sushupti is fixed — it does not automatically become Jagrat with time. What can shift it:\n\n1. Neecha Bhanga — see the dedicated section below for the full explanation.\n\n2. Dasha Activation: The planet\'s own Mahadasha or a strong Antardasha naturally stirs even a sleeping planet.\n\n3. Jupiter Transit: When Jupiter transits the natal degree of a Sushupta planet by conjunction or trine, it grants 1–2 months of temporary wakefulness.\n\n4. Daily Remedies: Mantra practice, gemstone, fasting on the planet\'s day — the "alarm clocks" of Jyotish. They do not change the natal state permanently but measurably increase the planet\'s tendency to express.\n\n5. Eclipse Activation: A solar or lunar eclipse near the natal planet\'s degree can trigger a sudden, often dramatic, temporary awakening.',
    },
    {
      title: 'Neecha Bhanga — Debilitation Cancellation Explained',
      body: 'WHAT IS DEBILITATION?\nEvery planet has one sign where it is most uncomfortable — its debilitation (Neecha) sign. In that sign the planet\'s significations are weakest, often producing blocked, frustrated, or erratic results in its life domain. This maps to Vikala in Deeptadi and Sushupta in Jagradadi.\n\nDEBILITATION SIGNS (the uncomfortable sign for each planet):\n• Sun → Libra (Tula). Sign of partnerships — Sun\'s individuality is suppressed.\n• Moon → Scorpio (Vrischika). Sign of depth and secrets — Moon\'s need for comfort and openness is stifled.\n• Mars → Cancer (Karka). Sign of nurturing — Mars\'s drive and directness are smothered.\n• Mercury → Pisces (Meena). Sign of intuition/dissolving — Mercury\'s analytical precision loses its edge.\n• Jupiter → Capricorn (Makara). Sign of hard structure — Jupiter\'s expansive wisdom feels constrained.\n• Venus → Virgo (Kanya). Sign of criticism/service — Venus\'s love of beauty and pleasure is uncomfortable.\n• Saturn → Aries (Mesha). Sign of impulsive beginnings — Saturn\'s patience and discipline are undermined.\n\nWHAT IS NEECHA BHANGA?\nNeecha Bhanga literally means "cancellation of debilitation." When certain conditions are present in the birth chart, the debilitation is neutralised — and the planet often goes on to give exceptionally strong results, sometimes even stronger than an unafflicted planet. Think of it like someone who overcame a profound struggle: they develop a depth of strength that someone who never struggled simply doesn\'t have.\n\nTHE 5 CLASSIC CANCELLATION RULES (any ONE is sufficient):\n\nRule 1 — The dispositor is in a kendra:\nThe "dispositor" is the lord of the sign the debilitated planet sits in. If that lord is placed in houses 1, 4, 7, or 10 (the kendras — angular houses) from the Lagna or from the Moon, debilitation is cancelled.\nExample: Mars is debilitated in Cancer. The lord of Cancer is Moon. If Moon is in the 1st, 4th, 7th, or 10th house → Neecha Bhanga for Mars.\n\nRule 2 — The exaltation lord is in a kendra:\nEvery planet has an exaltation sign (where it is strongest). The lord of that exaltation sign, if placed in a kendra (1/4/7/10) from Lagna or Moon, cancels the debilitation.\nExample: Mars is exalted in Capricorn. The lord of Capricorn is Saturn. If Saturn is in a kendra → Neecha Bhanga for Mars.\n\nRule 3 — Exalted in the Navamsha chart:\nEven if a planet is debilitated in the Rashi (birth) chart, if it falls in its own exaltation sign in the Navamsha (D9) chart, the debilitation is significantly weakened and the planet is considered to give good results in the latter half of life.\n\nRule 4 — Aspected by its exaltation lord:\nIf the planet that would be the lord of the debilitated planet\'s exaltation sign aspects the debilitated planet directly, it lends its strength and cancels the debilitation.\n\nRule 5 — Exaltation lord and dispositor are in mutual kendra:\nIf the lord of the exaltation sign and the lord of the debilitation sign are in the 1st, 4th, 7th, or 10th house from EACH OTHER (mutual kendra), debilitation is cancelled.\n\nEXALTATION SIGNS (for applying Rules 2 & 4):\n• Sun exalted in Aries → lord of Aries is Mars\n• Moon exalted in Taurus → lord of Taurus is Venus\n• Mars exalted in Capricorn → lord of Capricorn is Saturn\n• Mercury exalted in Virgo → lord of Virgo is Mercury (itself)\n• Jupiter exalted in Cancer → lord of Cancer is Moon\n• Venus exalted in Pisces → lord of Pisces is Jupiter\n• Saturn exalted in Libra → lord of Libra is Venus\n\nWHAT HAPPENS AFTER CANCELLATION?\nA planet with confirmed Neecha Bhanga does NOT simply become average. It frequently becomes one of the most powerful planets in the chart — its struggle with debilitation creates a deep reservoir of resilience in those life areas. The themes of that planet (career, relationships, courage, etc.) often become central to the person\'s story and ultimate strength.\n\nIMPORTANT: Multiple Neecha Bhanga rules applying simultaneously makes the cancellation stronger. Zero rules = full debilitation remains.',
    },
    {
      title: 'Deeptadi (Luminosity) — When Does Vikala Clear?',
      body: 'Combust Vikala: Combustion is caused by proximity to the Sun. Orbs are: Moon ±12°, Mars ±17°, Mercury ±14° (retrograde ±12°), Jupiter ±11°, Venus ±10° (retrograde ±8°), Saturn ±15°. Natal combustion is fixed. Remedy: Sun strengthening (Surya Namaskar + Gayatri mantra) reduces the burning quality without eliminating it.\n\nDebilitation Vikala: Fixed natally unless Neecha Bhanga applies. Apply the three cancellation tests above.\n\nRetrograde → Shakta: A retrograde planet in enemy/debilitation carries Khala or Vikala. When it stations direct in transit near its natal degree, a brief Shakta (powerful) window opens — a period of unusual strength in that planet\'s domain.',
    },
    {
      title: 'Lajjitadi (Emotional State) — What Lifts the Distress?',
      body: 'Lajjita (ashamed — 5th house with Rahu/Ketu/Saturn): Jupiter transiting the 5th house for ~1 year gradually relieves this. Ganesha puja (for Rahu) or Hanuman worship (for Saturn) helps directly.\n\nKshobhita (agitated — with Sun and a malefic aspect): Two things ease this: (a) the malefic\'s transiting aspect shifts as planets move, or (b) Sun strengthening via Surya Namaskar + Gayatri reduces the combative tension.\n\nMudita (happy — in friend\'s sign): Maintained while no strong malefic transit conjuncts or opposes. Jupiter aspecting this planet sustains Mudita.\n\nGarvita (proud — exalted or moolatrikona): The strongest state — very stable, needs no special help. In transit it shifts when the planet leaves the exaltation zone.',
    },
    {
      title: 'Shayanadi (Activity) — The Planet\'s Journey Through Its Sign',
      body: 'Shayanadi maps the planet\'s activity pattern by position within its sign: roughly Nidraa (sleeping) in the first degrees, settling and becoming watchful through the middle, Gamana (actively moving) around the 12°–18° zone, and various states toward the sign end.\n\nIn the natal chart, Shayanadi is fixed. In transits, the most active delivery window for any transiting planet is when it passes through the Gamana zone (12°–18°) in a key house.\n\nFor a natal Nidraa planet: remedies during its Mahadasha help the planet "complete its journey" in terms of result-delivery. Entering the sign\'s active zone in a progressed or Tajaka chart can also trigger results.',
    },
  ];

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'अवस्था विश्लेषण' : 'Avasthas — Planetary State Analysis'}
      </h3>

      {/* Intro */}
      <SectionCard>
        <SectionHeading>{isHi ? 'अवस्था क्या हैं?' : 'What are Avasthas?'}</SectionHeading>
        <InfoParagraph>
          {isHi
            ? 'अवस्थाएं बताती हैं कि प्रत्येक ग्रह किस मनोदशा और गुणवत्ता के साथ अपने परिणाम देता है। पांच प्रणालियां एक साथ काम करती हैं — बलादि (आयु-शक्ति), जाग्रदादि (जागरूकता), दीप्तादि (चमक), लज्जितादि (भावनात्मक स्थिति), और शयनादि (गतिविधि) — और मिलकर बताती हैं कि ग्रह वास्तव में आपके जीवन में कैसा प्रदर्शन कर रहा है।'
            : 'Avasthas describe the MOOD and QUALITY with which each planet delivers its results. Five separate systems operate simultaneously — Baladi (age-strength), Jagradadi (wakefulness), Deeptadi (luminosity), Lajjitadi (emotional state), and Shayanadi (activity pattern) — together revealing exactly how each planet is actually performing in your life. Click any planet to see the full breakdown.'}
        </InfoParagraph>
      </SectionCard>

      {/* Per-planet accordion cards */}
      <div className="space-y-2">
        {avasthas.map((av, idx) => {
          const planetName = pName(av.planetId, isHi);
          const bState = av.baladi.state;
          const jState = av.jagradadi.state;
          const dState = av.deeptadi.state;
          const lState = av.lajjitadi.state;
          const sState = av.shayanadi.state;

          const baladiText = BALADI_PLANET[bState]?.[av.planetId] ?? `${bState} state — in an age-transition zone`;
          const jagraText = JAGRADADI_PLANET[jState]?.[av.planetId] ?? `${jState} state — moderate output level`;
          const deepTag = DEEPTA_TAG[dState] ?? { label: dState, color: 'bg-gray-500/20 text-text-primary', meaning: 'Neutral luminosity state' };
          const lajTag = LAJJITA_TAG[lState] ?? { label: lState, color: 'bg-gray-500/20 text-text-primary', meaning: 'Neutral emotional state' };
          const shayTag = SHAYANA_TAG[sState] ?? { label: sState, color: 'bg-gray-500/20 text-text-primary', meaning: 'Activity state in its sign-cycle' };

          const avgStrength = (av.baladi.strength + av.deeptadi.luminosity) / 2;
          const isOpen = expanded === idx;
          const needsActivation = jState === 'sushupta' || bState === 'mrita' || bState === 'vriddha';

          const borderColor = avgStrength >= 65
            ? 'border-emerald-500/20'
            : avgStrength >= 35
            ? 'border-sky-500/20'
            : 'border-amber-500/20';

          return (
            <div key={av.planetId} className={`rounded-xl border ${borderColor} bg-white/[0.025] overflow-hidden`}>
              {/* Header row — always visible */}
              <button
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(isOpen ? null : idx)}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-[#d4a853] text-sm min-w-[60px]">{planetName}</span>
                  <span className="text-text-secondary/60 text-xs hidden sm:inline">{PLANET_DOMAIN[av.planetId]?.en}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    jState === 'jagrat' ? 'bg-emerald-500/20 text-emerald-300' :
                    jState === 'swapna' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {jState === 'jagrat' ? '100%' : jState === 'swapna' ? '50%' : '25%'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    bState === 'yuva' ? 'bg-emerald-500/20 text-emerald-300' :
                    bState === 'kumara' ? 'bg-sky-500/20 text-sky-300' :
                    bState === 'bala' ? 'bg-teal-500/20 text-teal-300' :
                    bState === 'mrita' ? 'bg-red-500/20 text-red-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {av.baladi.name.en}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${deepTag.color}`}>{deepTag.label}</span>
                  <span className="text-text-secondary/60 text-xs ml-1">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/[0.05]">
                  {/* Synthesis */}
                  <p className="text-xs text-gray-200 leading-relaxed bg-white/[0.04] p-3 rounded-lg mt-3 italic border border-white/[0.06]">
                    {getSynthesis(av)}
                  </p>

                  {/* Baladi */}
                  <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        bState === 'yuva' ? 'bg-emerald-500/20 text-emerald-300' :
                        bState === 'kumara' ? 'bg-sky-500/20 text-sky-300' :
                        bState === 'bala' ? 'bg-teal-500/20 text-teal-300' :
                        bState === 'mrita' ? 'bg-red-500/20 text-red-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        Baladi: {av.baladi.name.en}
                      </span>
                      <span className="text-text-secondary/60 text-xs">Age-strength: {Math.round(av.baladi.strength)}%</span>
                    </div>
                    <p className="text-xs text-text-primary leading-relaxed">{baladiText}</p>
                  </div>

                  {/* Jagradadi */}
                  <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        jState === 'jagrat' ? 'bg-emerald-500/20 text-emerald-300' :
                        jState === 'swapna' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        Jagradadi: {av.jagradadi.name.en}
                      </span>
                      <span className="text-text-secondary/60 text-xs">
                        ~{av.jagradadi.quality === 'full' ? '100' : av.jagradadi.quality === 'half' ? '50' : '25'}% output
                      </span>
                    </div>
                    <p className="text-xs text-text-primary leading-relaxed">{jagraText}</p>
                  </div>

                  {/* Deeptadi + Lajjitadi + Shayanadi */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                      <div className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-1.5 ${deepTag.color}`}>
                        Deeptadi: {deepTag.label}
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{deepTag.meaning}</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                      <div className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-1.5 ${lajTag.color}`}>
                        Lajjitadi: {lajTag.label}
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{lajTag.meaning}</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                      <div className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-1.5 ${shayTag.color}`}>
                        Shayanadi: {shayTag.label}
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{shayTag.meaning}</p>
                    </div>
                  </div>

                  {/* Activation guidance for weak/sleeping planets */}
                  {needsActivation && (
                    <div className="text-xs text-emerald-400/90 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 leading-relaxed">
                      <span className="font-semibold text-emerald-300">How to activate: </span>
                      {HOW_TO_ACTIVATE[jState === 'sushupta' ? 'sushupta' : bState === 'mrita' ? 'mrita' : 'vriddha']}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* How States Change accordion */}
      <div className="rounded-xl border border-[#d4a853]/20 bg-white/[0.02] overflow-hidden">
        <button
          className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
          onClick={() => setShowHowChange(v => !v)}
        >
          <span className="font-semibold text-[#d4a853] text-sm">
            {isHi ? 'अवस्थाएं कैसे बदलती हैं?' : 'How Do Avasthas Change?'}
          </span>
          <span className="text-text-secondary/60 text-xs">{showHowChange ? '▲ Close' : '▼ Expand'}</span>
        </button>
        {showHowChange && (
          <div className="px-4 pb-4 space-y-3 border-t border-white/[0.05]">
            {HOW_CHANGE_SECTIONS.map((s, i) => (
              <div key={i} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 mt-3">
                <p className="text-xs font-semibold text-[#f0d48a] mb-2">{s.title}</p>
                <p className="text-xs text-text-primary leading-relaxed whitespace-pre-line">{s.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. BHAVABALA INTERPRETATION
// ═══════════════════════════════════════════════════════════════════════════════

interface BhavabalaInterpretationProps {
  bhavabala: BhavaBalaResult[];
  locale: string;
}

export function BhavabalaInterpretation({ bhavabala, locale }: BhavabalaInterpretationProps) {
  const isHi = isDevanagariLocale(locale);

  const sorted = useMemo(() => {
    return [...bhavabala].sort((a, b) => b.total - a.total);
  }, [bhavabala]);

  if (!sorted.length) return null;

  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const strongSig = HOUSE_SIGNIFICATIONS[strongest.bhava];
  const weakSig = HOUSE_SIGNIFICATIONS[weakest.bhava];

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'भावबल विश्लेषण' : 'Bhavabala Interpretation'}
      </h3>

      {/* Strongest house */}
      <SectionCard border="border-emerald-500/15">
        <SectionHeading>{isHi ? 'सबसे बलवान जीवन क्षेत्र' : 'Strongest Life Area'}</SectionHeading>
        <div className="flex items-start gap-4">
          <HouseVisual highlight={strongest.bhava} color="emerald" size="md" label={isHi ? 'बलवान' : 'Strong'} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HouseBadge house={strongest.bhava} locale={locale} color="emerald" />
              <span className="text-emerald-300 text-xs font-bold">{strongest.total.toFixed(1)} {isHi ? 'अंक' : 'pts'}</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {isHi
                ? `आपका सबसे बलवान भाव ${strongest.bhava}वां भाव है (${strongSig?.hi ?? ''})। यही वह क्षेत्र है जहां जीवन सबसे सहज रूप से आता है। इस भाव से जुड़े कार्यों में आपको स्वाभाविक सफलता मिलती है।`
                : `Your strongest house is House ${strongest.bhava} (${strongSig?.en ?? ''}). This is where life comes most easily to you. Activities related to this house bring natural success with less effort.`}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Weakest house */}
      <SectionCard border="border-amber-500/15">
        <SectionHeading>{isHi ? 'सबसे कमजोर जीवन क्षेत्र' : 'Weakest Life Area'}</SectionHeading>
        <div className="flex items-start gap-4">
          <HouseVisual highlight={weakest.bhava} color="amber" size="md" label={isHi ? 'कमजोर' : 'Weak'} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HouseBadge house={weakest.bhava} locale={locale} color="amber" />
              <span className="text-amber-300 text-xs font-bold">{weakest.total.toFixed(1)} {isHi ? 'अंक' : 'pts'}</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              {isHi
                ? `आपका सबसे कमजोर भाव ${weakest.bhava}वां भाव है (${weakSig?.hi ?? ''})। इस क्षेत्र में सचेत प्रयास की आवश्यकता है।`
                : `Your weakest house is House ${weakest.bhava} (${weakSig?.en ?? ''}). This area needs conscious effort.`}
            </p>
            <p className="text-xs text-emerald-400 mt-1">
              {isHi ? 'उपाय: ' : 'Remedies: '}
              {isHi ? weakSig?.remedy_hi : weakSig?.remedy_en}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Combined House Strength — horizontal bar chart ranked by strength */}
      <SectionCard border="border-sky-500/15">
        <SectionHeading>{isHi ? 'भाव बल रैंकिंग' : 'House Strength'}</SectionHeading>
        <p className="text-xs text-text-secondary mb-4">
          {isHi ? 'हरा = बलवान, पीला = मध्यम, लाल = कमजोर' : 'Green = strong, Amber = moderate, Red = weak'}
        </p>
        <div className="space-y-1.5">
          {sorted.map((bh, i) => {
            const sig = HOUSE_SIGNIFICATIONS[bh.bhava];
            const max = sorted[0].total;
            const pct = max > 0 ? bh.total / max : 0;
            const barColor = pct >= 0.7 ? 'bg-emerald-500' : pct >= 0.4 ? 'bg-amber-500' : 'bg-red-500';
            const textColor = pct >= 0.7 ? 'text-emerald-400' : pct >= 0.4 ? 'text-amber-400' : 'text-red-400';
            const glowColor = pct >= 0.7 ? 'shadow-emerald-500/20' : pct >= 0.4 ? 'shadow-amber-500/20' : 'shadow-red-500/20';
            return (
              <div key={bh.bhava} className="group flex items-center gap-2">
                {/* Rank */}
                <span className="w-5 text-right text-xs text-gray-600 font-mono tabular-nums">{i + 1}</span>
                {/* House label */}
                <span className={`w-8 text-right font-bold text-sm ${textColor}`}>H{bh.bhava}</span>
                {/* Signification */}
                <span className="w-20 sm:w-24 text-xs text-text-secondary truncate">{isHi ? sig?.hi : sig?.en}</span>
                {/* Bar */}
                <div className="flex-1 h-5 bg-bg-tertiary/30 rounded-md overflow-hidden relative">
                  <div
                    className={`h-full rounded-md ${barColor} shadow-sm ${glowColor} transition-all duration-500`}
                    style={{ width: `${Math.max(pct * 100, 3)}%` }}
                  />
                  {/* Score inside bar if wide enough, otherwise outside */}
                  <span className={`absolute right-2 top-0 h-full flex items-center text-xs font-mono font-bold ${pct >= 0.3 ? 'text-white/90' : textColor}`}>
                    {bh.total.toFixed(0)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. PLANETS INTERPRETATION — Beginner-friendly chart overview
// ═══════════════════════════════════════════════════════════════════════════════

const LAGNA_SKETCHES: Record<number, LocaleText> = {
  1:  { en: 'Bold, independent, action-oriented leader', hi: 'साहसी, स्वतंत्र, कर्मप्रधान नेता', sa: 'साहसी, स्वतंत्र, कर्मप्रधान नेता', mai: 'साहसी, स्वतंत्र, कर्मप्रधान नेता', mr: 'साहसी, स्वतंत्र, कर्मप्रधान नेता', ta: 'தைரியமான, சுதந்திரமான, செயல்முனைப்பான தலைவர்', te: 'ధైర్యవంతుడు, స్వతంత్రుడు, కార్యశీలి నాయకుడు', bn: 'সাহসী, স্বাধীন, কর্মমুখী নেতা', kn: 'ಧೈರ್ಯಶಾಲಿ, ಸ್ವತಂತ್ರ, ಕ್ರಿಯಾಶೀಲ ನಾಯಕ', gu: 'હિંમતવાન, સ્વતંત્ર, ક્રિયાશીલ નેતા' },
  2:  { en: 'Stable, patient, values comfort and security', hi: 'स्थिर, धैर्यवान, सुख और सुरक्षा को महत्व देने वाले', sa: 'स्थिर, धैर्यवान, सुख और सुरक्षा को महत्व देने वाले', mai: 'स्थिर, धैर्यवान, सुख और सुरक्षा को महत्व देने वाले', mr: 'स्थिर, धैर्यवान, सुख और सुरक्षा को महत्व देने वाले', ta: 'நிலையான, பொறுமையான, சுகம் மற்றும் பாதுகாப்பை மதிக்கும்', te: 'స్థిరమైన, ఓపికగల, సుఖం మరియు భద్రతను విలువచేసే', bn: 'স্থির, ধৈর্যশীল, সুখ ও নিরাপত্তার মূল্যদাতা', kn: 'ಸ್ಥಿರ, ತಾಳ್ಮೆಯ, ಸುಖ ಮತ್ತು ಭದ್ರತೆಗೆ ಮಹತ್ವ', gu: 'સ્થિર, ધૈર્યવાન, સુખ અને સુરક્ષાને મહત્ત્વ આપનાર' },
  3:  { en: 'Curious, communicative, intellectually agile', hi: 'जिज्ञासु, संवादशील, बौद्धिक रूप से चुस्त', sa: 'जिज्ञासु, संवादशील, बौद्धिक रूप से चुस्त', mai: 'जिज्ञासु, संवादशील, बौद्धिक रूप से चुस्त', mr: 'जिज्ञासु, संवादशील, बौद्धिक रूप से चुस्त', ta: 'ஆர்வமுள்ள, தொடர்பு திறன், அறிவார்ந்த சுறுசுறுப்பு', te: 'ఆసక్తిగల, సంభాషణశీలి, మేధావి', bn: 'কৌতূহলী, যোগাযোগশীল, মেধাবী', kn: 'ಕುತೂಹಲಿ, ಸಂವಾದಶೀಲ, ಬೌದ್ಧಿಕ ಚುರುಕು', gu: 'જિજ્ઞાસુ, વાતચીત-કુશળ, બૌદ્ધિક રીતે ચપળ' },
  4:  { en: 'Nurturing, emotionally deep, home-oriented', hi: 'पोषणकर्ता, भावनात्मक रूप से गहरे, गृह-केंद्रित', sa: 'पोषणकर्ता, भावनात्मक रूप से गहरे, गृह-केंद्रित', mai: 'पोषणकर्ता, भावनात्मक रूप से गहरे, गृह-केंद्रित', mr: 'पोषणकर्ता, भावनात्मक रूप से गहरे, गृह-केंद्रित', ta: 'பராமரிக்கும், உணர்வு ஆழமான, வீடு சார்ந்த', te: 'పోషించే, భావోద్వేగ గాఢత, గృహ కేంద్రిత', bn: 'পরিচর্যাকারী, আবেগে গভীর, গৃহকেন্দ্রিক', kn: 'ಪೋಷಿಸುವ, ಭಾವನಾತ್ಮಕವಾಗಿ ಆಳವಾದ, ಗೃಹಕೇಂದ್ರಿತ', gu: 'પોષક, ભાવનાત્મક રીતે ઊંડા, ઘરકેન્દ્રી' },
  5:  { en: 'Charismatic, confident, creative, seeks recognition', hi: 'करिश्माई, आत्मविश्वासी, रचनात्मक, मान्यता के इच्छुक', sa: 'करिश्माई, आत्मविश्वासी, रचनात्मक, मान्यता के इच्छुक', mai: 'करिश्माई, आत्मविश्वासी, रचनात्मक, मान्यता के इच्छुक', mr: 'करिश्माई, आत्मविश्वासी, रचनात्मक, मान्यता के इच्छुक', ta: 'கவர்ச்சிமிக்க, தன்னம்பிக்கை, படைப்பாற்றல், அங்கீகாரம் தேடும்', te: 'ఆకర్షణీయ, ఆత్మవిశ్వాసం, సృజనాత్మక, గుర్తింపు కోరే', bn: 'আকর্ষণীয়, আত্মবিশ্বাসী, সৃজনশীল, স্বীকৃতি প্রত্যাশী', kn: 'ಆಕರ್ಷಕ, ಆತ್ಮವಿಶ್ವಾಸಿ, ಸೃಜನಶೀಲ, ಮಾನ್ಯತೆ ಬಯಸುವ', gu: 'આકર્ષક, આત્મવિશ્વાસી, સર્જનાત્મક, માન્યતા ઇચ્છુક' },
  6:  { en: 'Analytical, detail-oriented, service-minded', hi: 'विश्लेषणात्मक, विस्तार-उन्मुख, सेवा-भावी', sa: 'विश्लेषणात्मक, विस्तार-उन्मुख, सेवा-भावी', mai: 'विश्लेषणात्मक, विस्तार-उन्मुख, सेवा-भावी', mr: 'विश्लेषणात्मक, विस्तार-उन्मुख, सेवा-भावी', ta: 'பகுப்பாய்வு, விரிவான கவனம், சேவை மனப்பான்மை', te: 'విశ్లేషణాత్మక, వివరాలపై దృష్టి, సేవాభావం', bn: 'বিশ্লেষণাত্মক, বিস্তারিত-মুখী, সেবা-মনস্ক', kn: 'ವಿಶ್ಲೇಷಣಾತ್ಮಕ, ವಿವರ-ಕೇಂದ್ರಿತ, ಸೇವಾ-ಮನಸ್ಕ', gu: 'વિશ્લેષણાત્મક, વિગત-લક્ષી, સેવા-ભાવી' },
  7:  { en: 'Diplomatic, relationship-focused, aesthetic sense', hi: 'कूटनीतिक, संबंध-केंद्रित, सौंदर्य बोध', sa: 'कूटनीतिक, संबंध-केंद्रित, सौंदर्य बोध', mai: 'कूटनीतिक, संबंध-केंद्रित, सौंदर्य बोध', mr: 'कूटनीतिक, संबंध-केंद्रित, सौंदर्य बोध', ta: 'இராஜதந்திர, உறவு-மையம், அழகியல் உணர்வு', te: 'దౌత్యనైపుణ్యం, సంబంధ-కేంద్రిత, సౌందర్య భావం', bn: 'কূটনৈতিক, সম্পর্ক-কেন্দ্রিক, সৌন্দর্যবোধ', kn: 'ರಾಜತಾಂತ್ರಿಕ, ಸಂಬಂಧ-ಕೇಂದ್ರಿತ, ಸೌಂದರ್ಯ ಪ್ರಜ್ಞೆ', gu: 'કુટનીતિજ્ઞ, સંબંધ-કેન્દ્રી, સૌંદર્ય બોધ' },
  8:  { en: 'Intense, transformative, deep researcher', hi: 'तीव्र, परिवर्तनकारी, गहन शोधकर्ता', sa: 'तीव्र, परिवर्तनकारी, गहन शोधकर्ता', mai: 'तीव्र, परिवर्तनकारी, गहन शोधकर्ता', mr: 'तीव्र, परिवर्तनकारी, गहन शोधकर्ता', ta: 'தீவிரமான, மாற்றமளிக்கும், ஆழ்ந்த ஆராய்ச்சியாளர்', te: 'తీవ్రమైన, పరివర్తనాత్మక, లోతైన పరిశోధకుడు', bn: 'তীব্র, রূপান্তরকারী, গভীর গবেষক', kn: 'ತೀವ್ರ, ಪರಿವರ್ತನಾಶೀಲ, ಆಳವಾದ ಸಂಶೋಧಕ', gu: 'તીવ્ર, પરિવર્તનકારી, ઊંડા સંશોધક' },
  9:  { en: 'Adventurous, philosophical, freedom-loving', hi: 'साहसिक, दार्शनिक, स्वतंत्रता-प्रेमी', sa: 'साहसिक, दार्शनिक, स्वतंत्रता-प्रेमी', mai: 'साहसिक, दार्शनिक, स्वतंत्रता-प्रेमी', mr: 'साहसिक, दार्शनिक, स्वतंत्रता-प्रेमी', ta: 'சாகசமான, தத்துவ சிந்தனை, சுதந்திரம் விரும்பும்', te: 'సాహసి, తాత్విక, స్వాతంత్ర్య ప్రేమి', bn: 'দুঃসাহসী, দার্শনিক, স্বাধীনতাপ্রেমী', kn: 'ಸಾಹಸಿ, ತಾತ್ವಿಕ, ಸ್ವಾತಂತ್ರ್ಯಪ್ರಿಯ', gu: 'સાહસિક, દાર્શનિક, સ્વતંત્રતાપ્રેમી' },
  10: { en: 'Disciplined, ambitious, practical, career-focused', hi: 'अनुशासित, महत्वाकांक्षी, व्यावहारिक, करियर-केंद्रित', sa: 'अनुशासित, महत्वाकांक्षी, व्यावहारिक, करियर-केंद्रित', mai: 'अनुशासित, महत्वाकांक्षी, व्यावहारिक, करियर-केंद्रित', mr: 'अनुशासित, महत्वाकांक्षी, व्यावहारिक, करियर-केंद्रित', ta: 'ஒழுக்கமான, லட்சியவாதி, நடைமுறை, தொழில்-மையம்', te: 'క్రమశిక్షణ, ఆశయవాది, ఆచరణాత్మక, వృత్తి-కేంద్రిత', bn: 'শৃঙ্খলাবদ্ধ, উচ্চাকাঙ্ক্ষী, বাস্তববাদী, কর্মজীবন-কেন্দ্রিক', kn: 'ಶಿಸ್ತಿನ, ಮಹತ್ವಾಕಾಂಕ್ಷಿ, ವ್ಯಾವಹಾರಿಕ, ವೃತ್ತಿ-ಕೇಂದ್ರಿತ', gu: 'શિસ્તબદ્ધ, મહત્ત્વાકાંક્ષી, વ્યવહારુ, કારકિર્દી-કેન્દ્રી' },
  11: { en: 'Innovative, humanitarian, independent thinker', hi: 'नवोन्मेषी, मानवतावादी, स्वतंत्र विचारक', sa: 'नवोन्मेषी, मानवतावादी, स्वतंत्र विचारक', mai: 'नवोन्मेषी, मानवतावादी, स्वतंत्र विचारक', mr: 'नवोन्मेषी, मानवतावादी, स्वतंत्र विचारक', ta: 'புத்தாக்கமான, மனிதநேயம், சுதந்திர சிந்தனையாளர்', te: 'నవకల్పన, మానవతావాది, స్వతంత్ర ఆలోచనాపరుడు', bn: 'উদ্ভাবনী, মানবতাবাদী, স্বাধীন চিন্তক', kn: 'ನವೀನ, ಮಾನವತಾವಾದಿ, ಸ್ವತಂತ್ರ ಚಿಂತಕ', gu: 'નવીન, માનવતાવાદી, સ્વતંત્ર વિચારક' },
  12: { en: 'Intuitive, spiritual, compassionate, creative', hi: 'अंतर्ज्ञानी, आध्यात्मिक, करुणामय, रचनात्मक', sa: 'अंतर्ज्ञानी, आध्यात्मिक, करुणामय, रचनात्मक', mai: 'अंतर्ज्ञानी, आध्यात्मिक, करुणामय, रचनात्मक', mr: 'अंतर्ज्ञानी, आध्यात्मिक, करुणामय, रचनात्मक', ta: 'உள்ளுணர்வு, ஆன்மிக, கருணை, படைப்பாற்றல்', te: 'అంతర్ దృష్టి, ఆధ్యాత్మిక, కరుణ, సృజనాత్మక', bn: 'অন্তর্দৃষ্টিশীল, আধ্যাত্মিক, করুণাময়, সৃজনশীল', kn: 'ಅಂತರ್ಜ್ಞಾನಿ, ಆಧ್ಯಾತ್ಮಿಕ, ಕರುಣಾಮಯ, ಸೃಜನಶೀಲ', gu: 'અંતર્જ્ઞાની, આધ્યાત્મિક, કરુણાશીલ, સર્જનાત્મક' },
};

// Separate sketches for Moon sign — emphasise inner emotional experience,
// not outer personality projection (those belong to Lagna).
const MOON_SKETCHES: Record<number, LocaleText> = {
  1:  { en: 'You feel best when taking action and leading. Emotions run hot and fast — you need movement to stay grounded.', hi: 'कार्य और नेतृत्व में आपको भावनात्मक शांति मिलती है। भावनाएं तीव्र और त्वरित होती हैं।', sa: 'कार्य और नेतृत्व में आपको भावनात्मक शांति मिलती है। भावनाएं तीव्र और त्वरित होती हैं।', mai: 'कार्य और नेतृत्व में आपको भावनात्मक शांति मिलती है। भावनाएं तीव्र और त्वरित होती हैं।', mr: 'कार्य और नेतृत्व में आपको भावनात्मक शांति मिलती है। भावनाएं तीव्र और त्वरित होती हैं।', ta: 'செயல்படும்போதும் தலைமை தாங்கும்போதும் நீங்கள் சிறப்பாக உணர்கிறீர்கள். உணர்ச்சிகள் சூடாகவும் வேகமாகவும் ஓடும் — நிலைத்திருக்க உங்களுக்கு இயக்கம் தேவை.', te: 'చర్య తీసుకుంటున్నప్పుడు మరియు నాయకత్వం వహిస్తున్నప్పుడు మీకు బాగుంటుంది. భావోద్వేగాలు తీవ్రంగా మరియు వేగంగా నడుస్తాయి — స్థిరంగా ఉండటానికి మీకు చలనం అవసరం.', bn: 'কর্ম ও নেতৃত্বে আপনি সেরা অনুভব করেন। আবেগ তীব্র ও দ্রুত চলে — স্থির থাকতে চলাচল প্রয়োজন।', kn: 'ಕ್ರಿಯೆ ಮತ್ತು ನಾಯಕತ್ವದಲ್ಲಿ ನೀವು ಉತ್ತಮವಾಗಿ ಅನುಭವಿಸುತ್ತೀರಿ. ಭಾವನೆಗಳು ಬಿಸಿ ಮತ್ತು ವೇಗವಾಗಿ ಓಡುತ್ತವೆ — ಸ್ಥಿರವಾಗಿರಲು ನಿಮಗೆ ಚಲನೆ ಬೇಕು.', gu: 'ક્રિયા અને નેતૃત્વમાં તમે શ્રેષ્ઠ અનુભવો છો. લાગણીઓ તીવ્ર અને ઝડપી ચાલે છે — સ્થિર રહેવા માટે ગતિ જરૂરી.' },
  2:  { en: 'You find comfort in stability, familiar surroundings, and sensory pleasure. Security is an emotional need.', hi: 'स्थिरता, परिचित वातावरण और इंद्रिय सुख में आपको सुकून मिलता है। सुरक्षा भावनात्मक आवश्यकता है।', sa: 'स्थिरता, परिचित वातावरण और इंद्रिय सुख में आपको सुकून मिलता है। सुरक्षा भावनात्मक आवश्यकता है।', mai: 'स्थिरता, परिचित वातावरण और इंद्रिय सुख में आपको सुकून मिलता है। सुरक्षा भावनात्मक आवश्यकता है।', mr: 'स्थिरता, परिचित वातावरण और इंद्रिय सुख में आपको सुकून मिलता है। सुरक्षा भावनात्मक आवश्यकता है।', ta: 'நிலைத்தன்மை, பரிச்சயமான சூழல் மற்றும் புலன் இன்பத்தில் நீங்கள் ஆறுதல் காண்கிறீர்கள். பாதுகாப்பு ஒரு உணர்ச்சித் தேவை.', te: 'స్థిరత్వం, సుపరిచిత పరిసరాలు మరియు ఇంద్రియ ఆనందంలో మీరు సౌకర్యం పొందుతారు. భద్రత ఒక భావోద్వేగ అవసరం.', bn: 'স্থিতিশীলতা, পরিচিত পরিবেশ ও ইন্দ্রিয় সুখে আপনি স্বস্তি পান। নিরাপত্তা একটি আবেগজ চাহিদা।', kn: 'ಸ್ಥಿರತೆ, ಪರಿಚಿತ ಸುತ್ತಮುತ್ತಲಿನ ಪರಿಸರ ಮತ್ತು ಇಂದ್ರಿಯ ಸುಖದಲ್ಲಿ ನೀವು ಸಮಾಧಾನ ಪಡೆಯುತ್ತೀರಿ. ಭದ್ರತೆ ಒಂದು ಭಾವನಾತ್ಮಕ ಅಗತ್ಯ.', gu: 'સ્થિરતા, પરિચિત વાતાવરણ અને ઇન્દ્રિય સુખમાં તમને આરામ મળે છે. સુરક્ષા એક ભાવનાત્મક જરૂરિયાત છે.' },
  3:  { en: 'Your mood lifts when you\'re learning, talking, or writing. Mental stimulation is emotional nourishment for you.', hi: 'सीखने, बोलने या लिखने से आपका मन प्रसन्न होता है। मानसिक उत्तेजना आपका भावनात्मक पोषण है।' },
  4:  { en: 'Home, family, and belonging are your emotional bedrock. You feel deeply and need a safe space to recharge.', hi: 'घर, परिवार और अपनेपन की भावना आपका आधार है। आप गहराई से महसूस करते हैं।', sa: 'घर, परिवार और अपनेपन की भावना आपका आधार है। आप गहराई से महसूस करते हैं।', mai: 'घर, परिवार और अपनेपन की भावना आपका आधार है। आप गहराई से महसूस करते हैं।', mr: 'घर, परिवार और अपनेपन की भावना आपका आधार है। आप गहराई से महसूस करते हैं।', ta: 'வீடு, குடும்பம் மற்றும் சொந்தம் உங்கள் உணர்ச்சிப் பாறை. நீங்கள் ஆழமாக உணர்கிறீர்கள், மீண்டும் ஊக்கமளிக்க ஒரு பாதுகாப்பான இடம் தேவை.', te: 'ఇల్లు, కుటుంబం మరియు చెందుట మీ భావోద్వేగ పునాది. మీరు లోతుగా అనుభవిస్తారు, రీఛార్జ్ అవ్వడానికి సురక్షిత స్థలం అవసరం.', bn: 'গৃহ, পরিবার ও অন্তর্ভুক্তি আপনার আবেগের ভিত্তি। আপনি গভীরভাবে অনুভব করেন, পুনরুজ্জীবিত হতে নিরাপদ স্থান প্রয়োজন।', kn: 'ಮನೆ, ಕುಟುಂಬ ಮತ್ತು ಸೇರ್ಪಡೆ ನಿಮ್ಮ ಭಾವನಾತ್ಮಕ ತಳಹದಿ. ನೀವು ಆಳವಾಗಿ ಅನುಭವಿಸುತ್ತೀರಿ, ರೀಚಾರ್ಜ್ ಮಾಡಲು ಸುರಕ್ಷಿತ ಸ್ಥಳ ಬೇಕು.', gu: 'ઘર, કુટુંબ અને અપનાપન તમારો ભાવનાત્મક આધાર. તમે ઊંડી અનુભૂતિ કરો છો, રિચાર્જ થવા સુરક્ષિત જગ્યા જોઈએ.' },
  5:  { en: 'You need joy, play, and creative expression to feel alive. Recognition and love fuel your emotional wellbeing.', hi: 'आनंद, खेल और रचनात्मकता आपको जीवंत रखती है। मान्यता और प्रेम भावनात्मक शक्ति देते हैं।', sa: 'आनंद, खेल और रचनात्मकता आपको जीवंत रखती है। मान्यता और प्रेम भावनात्मक शक्ति देते हैं।', mai: 'आनंद, खेल और रचनात्मकता आपको जीवंत रखती है। मान्यता और प्रेम भावनात्मक शक्ति देते हैं।', mr: 'आनंद, खेल और रचनात्मकता आपको जीवंत रखती है। मान्यता और प्रेम भावनात्मक शक्ति देते हैं।', ta: 'உயிரோடு உணர நீங்கள் மகிழ்ச்சி, விளையாட்டு மற்றும் படைப்பாற்றல் வெளிப்பாடு தேவை. அங்கீகாரமும் அன்பும் உங்கள் உணர்ச்சி நலனை ஊக்குவிக்கின்றன.', te: 'సజీవంగా అనుభవించడానికి మీకు ఆనందం, ఆట మరియు సృజనాత్మక వ్యక్తీకరణ అవసరం. గుర్తింపు మరియు ప్రేమ మీ భావోద్వేగ సంక్షేమాన్ని ఇంధనంగా మారుస్తాయి.', bn: 'জীবন্ত অনুভব করতে আনন্দ, খেলা ও সৃজনশীল প্রকাশ প্রয়োজন। স্বীকৃতি ও ভালোবাসা আপনার আবেগজ সুস্থতার জ্বালানি।', kn: 'ಜೀವಂತವಾಗಿ ಅನುಭವಿಸಲು ನಿಮಗೆ ಸಂತೋಷ, ಆಟ ಮತ್ತು ಸೃಜನಾತ್ಮಕ ಅಭಿವ್ಯಕ್ತಿ ಬೇಕು. ಮನ್ನಣೆ ಮತ್ತು ಪ್ರೀತಿ ನಿಮ್ಮ ಭಾವನಾತ್ಮಕ ಯೋಗಕ್ಷೇಮಕ್ಕೆ ಇಂಧನ.', gu: 'જીવંત અનુભવ માટે આનંદ, રમત અને સર્જનાત્મક અભિવ્યક્તિ જરૂરી. માન્યતા અને પ્રેમ તમારી ભાવનાત્મક સુખાકારીનું બળતણ.' },
  6:  { en: 'You feel settled when things are orderly and you\'re being useful. Helping others calms your inner world.', hi: 'व्यवस्था और उपयोगिता से आपको सुकून मिलता है। दूसरों की मदद करना आंतरिक शांति देता है।' },
  7:  { en: 'Harmony, connection, and partnership are emotional necessities. Conflict unsettles you deeply.', hi: 'सौहार्द, जुड़ाव और साझेदारी भावनात्मक आवश्यकताएं हैं। संघर्ष आपको गहराई से अस्थिर करता है।', sa: 'सौहार्द, जुड़ाव और साझेदारी भावनात्मक आवश्यकताएं हैं। संघर्ष आपको गहराई से अस्थिर करता है।', mai: 'सौहार्द, जुड़ाव और साझेदारी भावनात्मक आवश्यकताएं हैं। संघर्ष आपको गहराई से अस्थिर करता है।', mr: 'सौहार्द, जुड़ाव और साझेदारी भावनात्मक आवश्यकताएं हैं। संघर्ष आपको गहराई से अस्थिर करता है।', ta: 'சமநிலை, தொடர்பு மற்றும் கூட்டு உணர்ச்சி அவசியங்கள். மோதல் உங்களை ஆழமாக கலக்குகிறது.', te: 'సామరస్యం, అనుబంధం మరియు భాగస్వామ్యం భావోద్వేగ అవసరాలు. సంఘర్షణ మిమ్మల్ని లోతుగా కలవరపెడుతుంది.', bn: 'সামঞ্জস্য, সংযোগ ও অংশীদারিত্ব আবেগজ অপরিহার্যতা। দ্বন্দ্ব আপনাকে গভীরভাবে বিচলিত করে।', kn: 'ಸಾಮರಸ್ಯ, ಸಂಪರ್ಕ ಮತ್ತು ಪಾಲುದಾರಿಕೆ ಭಾವನಾತ್ಮಕ ಅಗತ್ಯಗಳು. ಸಂಘರ್ಷ ನಿಮ್ಮನ್ನು ಆಳವಾಗಿ ಕಳವಳಗೊಳಿಸುತ್ತದೆ.', gu: 'સુમેળ, જોડાણ અને ભાગીદારી ભાવનાત્મક આવશ્યકતા. સંઘર્ષ તમને ઊંડેથી વિચલિત કરે છે.' },
  8:  { en: 'Emotions run intense and private. You feel things at a depth others rarely reach. Trust is everything.', hi: 'भावनाएं तीव्र और निजी होती हैं। आप उस गहराई तक महसूस करते हैं जो दूसरे शायद ही छू पाएं।', sa: 'भावनाएं तीव्र और निजी होती हैं। आप उस गहराई तक महसूस करते हैं जो दूसरे शायद ही छू पाएं।', mai: 'भावनाएं तीव्र और निजी होती हैं। आप उस गहराई तक महसूस करते हैं जो दूसरे शायद ही छू पाएं।', mr: 'भावनाएं तीव्र और निजी होती हैं। आप उस गहराई तक महसूस करते हैं जो दूसरे शायद ही छू पाएं।', ta: 'உணர்ச்சிகள் தீவிரமாகவும் தனிப்பட்டதாகவும் இருக்கும். மற்றவர்கள் அரிதாகவே அடையும் ஆழத்தில் நீங்கள் உணர்கிறீர்கள். நம்பிக்கை எல்லாமே.', te: 'భావోద్వేగాలు తీవ్రంగా మరియు ప్రైవేట్‌గా నడుస్తాయి. ఇతరులు అరుదుగా చేరుకునే లోతులో మీరు అనుభవిస్తారు. నమ్మకం సర్వస్వం.', bn: 'আবেগ তীব্র ও ব্যক্তিগত। অন্যরা যে গভীরতায় খুব কমই পৌঁছায় সেখানে আপনি অনুভব করেন। বিশ্বাসই সব।', kn: 'ಭಾವನೆಗಳು ತೀವ್ರ ಮತ್ತು ಖಾಸಗಿ. ಇತರರು ಅಪರೂಪವಾಗಿ ತಲುಪುವ ಆಳದಲ್ಲಿ ನೀವು ಅನುಭವಿಸುತ್ತೀರಿ. ವಿಶ್ವಾಸವೇ ಸರ್ವಸ್ವ.', gu: 'લાગણીઓ તીવ્ર અને ખાનગી. અન્ય ભાગ્યે જ પહોંચે તેવી ઊંડાઈમાં તમે અનુભવો છો. વિશ્વાસ જ સર્વસ્વ.' },
  9:  { en: 'Freedom, meaning, and exploration lift your spirit. You need purpose and philosophical grounding to feel secure.', hi: 'स्वतंत्रता, अर्थ और अन्वेषण आपकी आत्मा को ऊँचा उठाता है। उद्देश्य और दर्शन से भावनात्मक सुरक्षा मिलती है।', sa: 'स्वतंत्रता, अर्थ और अन्वेषण आपकी आत्मा को ऊँचा उठाता है। उद्देश्य और दर्शन से भावनात्मक सुरक्षा मिलती है।', mai: 'स्वतंत्रता, अर्थ और अन्वेषण आपकी आत्मा को ऊँचा उठाता है। उद्देश्य और दर्शन से भावनात्मक सुरक्षा मिलती है।', mr: 'स्वतंत्रता, अर्थ और अन्वेषण आपकी आत्मा को ऊँचा उठाता है। उद्देश्य और दर्शन से भावनात्मक सुरक्षा मिलती है।', ta: 'சுதந்திரம், அர்த்தம் மற்றும் ஆய்வு உங்கள் ஆன்மாவை உயர்த்துகின்றன. பாதுகாப்பாக உணர உங்களுக்கு நோக்கமும் தத்துவ அடித்தளமும் தேவை.', te: 'స్వేచ్ఛ, అర్థం మరియు అన్వేషణ మీ ఆత్మను ఉన్నతీకరిస్తాయి. సురక్షితంగా అనుభవించడానికి మీకు ఉద్దేశ్యం మరియు తాత్విక పునాది అవసరం.', bn: 'স্বাধীনতা, অর্থ ও অন্বেষণ আপনার আত্মাকে উন্নীত করে। নিরাপদ অনুভব করতে উদ্দেশ্য ও দার্শনিক ভিত্তি প্রয়োজন।', kn: 'ಸ್ವಾತಂತ್ರ್ಯ, ಅರ್ಥ ಮತ್ತು ಅನ್ವೇಷಣೆ ನಿಮ್ಮ ಆತ್ಮವನ್ನು ಎತ್ತುತ್ತದೆ. ಸುರಕ್ಷಿತವಾಗಿ ಅನುಭವಿಸಲು ಉದ್ದೇಶ ಮತ್ತು ತಾತ್ವಿಕ ಅಡಿಪಾಯ ಬೇಕು.', gu: 'સ્વતંત્રતા, અર્થ અને શોધ તમારી આત્માને ઉન્નત કરે છે. સુરક્ષિત અનુભવ માટે ઉદ્દેશ અને દાર્શનિક આધાર જરૂરી.' },
  10: { en: 'Achievement and respect nourish you emotionally. You feel secure when you have structure and a clear direction.', hi: 'उपलब्धि और सम्मान भावनात्मक पोषण देते हैं। संरचना और स्पष्ट दिशा से सुरक्षा महसूस होती है।', sa: 'उपलब्धि और सम्मान भावनात्मक पोषण देते हैं। संरचना और स्पष्ट दिशा से सुरक्षा महसूस होती है।', mai: 'उपलब्धि और सम्मान भावनात्मक पोषण देते हैं। संरचना और स्पष्ट दिशा से सुरक्षा महसूस होती है।', mr: 'उपलब्धि और सम्मान भावनात्मक पोषण देते हैं। संरचना और स्पष्ट दिशा से सुरक्षा महसूस होती है।', ta: 'சாதனையும் மரியாதையும் உங்களை உணர்ச்சி ரீதியாக வளர்க்கின்றன. கட்டமைப்பும் தெளிவான திசையும் இருக்கும்போது நீங்கள் பாதுகாப்பாக உணர்கிறீர்கள்.', te: 'సాధన మరియు గౌరవం మిమ్మల్ని భావోద్వేగపరంగా పోషిస్తాయి. నిర్మాణం మరియు స్పష్టమైన దిశ ఉన్నప్పుడు మీరు సురక్షితంగా అనుభవిస్తారు.', bn: 'অর্জন ও সম্মান আপনাকে আবেগের দিক থেকে পুষ্ট করে। কাঠামো ও স্পষ্ট দিশা থাকলে নিরাপদ অনুভব করেন।', kn: 'ಸಾಧನೆ ಮತ್ತು ಗೌರವ ನಿಮ್ಮನ್ನು ಭಾವನಾತ್ಮಕವಾಗಿ ಪೋಷಿಸುತ್ತದೆ. ರಚನೆ ಮತ್ತು ಸ್ಪಷ್ಟ ದಿಕ್ಕು ಇದ್ದಾಗ ಸುರಕ್ಷಿತ ಅನುಭವ.', gu: 'સિદ્ધિ અને સન્માન તમને ભાવનાત્મક રીતે પોષે છે. માળખું અને સ્પષ્ટ દિશા હોય ત્યારે સુરક્ષિત અનુભવ.' },
  11: { en: 'Belonging to a community and working for a larger cause gives you deep emotional satisfaction. You need intellectual freedom to feel at peace.', hi: 'समुदाय से जुड़ाव और बड़े उद्देश्य के लिए कार्य भावनात्मक संतुष्टि देता है। मानसिक स्वतंत्रता शांति के लिए आवश्यक है।', sa: 'समुदाय से जुड़ाव और बड़े उद्देश्य के लिए कार्य भावनात्मक संतुष्टि देता है। मानसिक स्वतंत्रता शांति के लिए आवश्यक है।', mai: 'समुदाय से जुड़ाव और बड़े उद्देश्य के लिए कार्य भावनात्मक संतुष्टि देता है। मानसिक स्वतंत्रता शांति के लिए आवश्यक है।', mr: 'समुदाय से जुड़ाव और बड़े उद्देश्य के लिए कार्य भावनात्मक संतुष्टि देता है। मानसिक स्वतंत्रता शांति के लिए आवश्यक है।', ta: 'ஒரு சமூகத்தில் சேர்ந்து பெரிய நோக்கத்திற்காக உழைப்பது உங்களுக்கு ஆழ்ந்த உணர்ச்சி திருப்தி தருகிறது. அமைதியாக உணர உங்களுக்கு அறிவுசார் சுதந்திரம் தேவை.', te: 'సమాజంలో భాగమై పెద్ద ఉద్దేశ్యం కోసం పనిచేయడం మీకు లోతైన భావోద్వేగ సంతృప్తి ఇస్తుంది. ప్రశాంతంగా అనుభవించడానికి మీకు మేధోపరమైన స్వేచ్ఛ అవసరం.', bn: 'সম্প্রদায়ের অংশ হয়ে বৃহৎ উদ্দেশ্যে কাজ করা গভীর আবেগজ তৃপ্তি দেয়। শান্তি অনুভব করতে বুদ্ধিবৃত্তিক স্বাধীনতা প্রয়োজন।', kn: 'ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ ದೊಡ್ಡ ಉದ್ದೇಶಕ್ಕಾಗಿ ಕೆಲಸ ಮಾಡುವುದು ಆಳವಾದ ಭಾವನಾತ್ಮಕ ತೃಪ್ತಿ ನೀಡುತ್ತದೆ. ಶಾಂತಿ ಅನುಭವಿಸಲು ಬೌದ್ಧಿಕ ಸ್ವಾತಂತ್ರ್ಯ ಬೇಕು.', gu: 'સમુદાયનો ભાગ બની મોટા ઉદ્દેશ માટે કામ કરવું ઊંડી ભાવનાત્મક સંતોષ આપે છે. શાંતિ અનુભવ માટે બૌદ્ધિક સ્વતંત્રતા જરૂરી.' },
  12: { en: 'Solitude, spirituality, and quiet restoration replenish you. You feel most like yourself when the noise of the world fades.', hi: 'एकांत, आध्यात्मिकता और शांत विश्राम आपको पुनर्जीवित करता है। दुनिया का शोर शांत होने पर आप स्वयं को पाते हैं।', sa: 'एकांत, आध्यात्मिकता और शांत विश्राम आपको पुनर्जीवित करता है। दुनिया का शोर शांत होने पर आप स्वयं को पाते हैं।', mai: 'एकांत, आध्यात्मिकता और शांत विश्राम आपको पुनर्जीवित करता है। दुनिया का शोर शांत होने पर आप स्वयं को पाते हैं।', mr: 'एकांत, आध्यात्मिकता और शांत विश्राम आपको पुनर्जीवित करता है। दुनिया का शोर शांत होने पर आप स्वयं को पाते हैं।', ta: 'தனிமை, ஆன்மிகம் மற்றும் அமைதியான மறுசீரமைப்பு உங்களை நிரப்புகின்றன. உலகின் சத்தம் மறையும்போது நீங்கள் உங்களாகவே மிகவும் உணர்கிறீர்கள்.', te: 'ఏకాంతం, ఆధ్యాత్మికత మరియు నిశ్శబ్ద పునరుద్ధరణ మిమ్మల్ని నింపుతాయి. ప్రపంచ శబ్దం మసకబారినప్పుడు మీరు నిజమైన మీరుగా అనుభవిస్తారు.', bn: 'নির্জনতা, আধ্যাত্মিকতা ও নীরব পুনরুদ্ধার আপনাকে পূর্ণ করে। জগতের কোলাহল মিলিয়ে গেলে আপনি সবচেয়ে বেশি নিজেকে অনুভব করেন।', kn: 'ಏಕಾಂತ, ಅಧ್ಯಾತ್ಮಿಕತೆ ಮತ್ತು ಮೌನ ಪುನರುಜ್ಜೀವನ ನಿಮ್ಮನ್ನು ಭರ್ತಿ ಮಾಡುತ್ತದೆ. ಜಗತ್ತಿನ ಶಬ್ದ ಮಸುಕಾದಾಗ ನೀವು ಅತ್ಯಂತ ನಿಮ್ಮಂತೆ ಅನುಭವಿಸುತ್ತೀರಿ.', gu: 'એકાંત, આધ્યાત્મિકતા અને શાંત પુનઃસ્થાપન તમને ભરી દે છે. જગતનો ઘોંઘાટ ઓસરે ત્યારે તમે સૌથી વધુ તમારા જેવા અનુભવો છો.' },
};

const RASHI_NAMES_EN = ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const RASHI_NAMES_HI = ['', 'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];

const PLANET_NAMES_FULL_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_NAMES_FULL_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'राहु', 'केतु'];

function pNameFull(id: number, isHi: boolean): string {
  return isHi ? (PLANET_NAMES_FULL_HI[id] ?? `ग्रह ${id}`) : (PLANET_NAMES_FULL_EN[id] ?? `Planet ${id}`);
}

interface PlanetsInterpretationProps {
  planets: PlanetPosition[];
  ascendant: { sign: number; signName: LocaleText };
  locale: string;
}

export function PlanetsInterpretation({ planets, ascendant, locale }: PlanetsInterpretationProps) {
  const isHi = isDevanagariLocale(locale);

  const moonPlanet = planets.find(p => p.planet.id === 1);
  const exalted = planets.filter(p => p.isExalted);
  const debilitated = planets.filter(p => p.isDebilitated);
  const retrograde = planets.filter(p => p.isRetrograde);
  const ownSign = planets.filter(p => p.isOwnSign);
  const combust = planets.filter(p => p.isCombust);

  const lagnaSketch = LAGNA_SKETCHES[ascendant.sign];
  const lagnaName = isHi ? ascendant.signName.hi : ascendant.signName.en;

  const moonSketch = moonPlanet ? MOON_SKETCHES[moonPlanet.sign] : undefined;
  const moonNameEn = moonPlanet ? (RASHI_NAMES_EN[moonPlanet.sign] ?? moonPlanet.signName.en) : '';
  const moonNameHi = moonPlanet ? (RASHI_NAMES_HI[moonPlanet.sign] ?? moonPlanet.signName.hi) : '';

  // Overall takeaway: tone based on dignities
  const strongCount = exalted.length + ownSign.length;
  const weakCount = debilitated.length + combust.length;
  const overallTone = strongCount >= 2 ? 'strong' : weakCount >= 2 ? 'mixed' : 'balanced';
  const overallTakeaway = {
    strong: {
      en: `With ${strongCount} planet${strongCount > 1 ? 's' : ''} in strength, your chart has significant natural advantages. Focus on leveraging these dignified planets — they are your key allies for growth.`,
      hi: `${strongCount} ग्रह${strongCount > 1 ? '' : ''} बलवान होने से आपकी कुंडली में प्राकृतिक अनुकूलताएं हैं। इन बलवान ग्रहों का उपयोग करें।`,
    },
    mixed: {
      en: `Your chart shows both strengths and challenges. The dignified planets provide a solid foundation — work with them consciously while being mindful of the areas where challenged planets operate.`,
      hi: `आपकी कुंडली में शक्तियां और चुनौतियां दोनों हैं। बलवान ग्रह ठोस आधार देते हैं — उनके साथ सचेत रूप से कार्य करें।`,
    },
    balanced: {
      en: `A balanced chart — no extreme strengths or weaknesses. Your planets work through effort and intent. Consistent action and awareness will unlock their full potential.`,
      hi: `एक संतुलित कुंडली — न अत्यधिक शक्तियां, न अत्यधिक चुनौतियां। ग्रह प्रयास और इरादे से काम करते हैं।`,
    },
  }[overallTone];

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2">
        {isHi ? 'ग्रह विश्लेषण' : 'Planets Interpretation'}
      </h3>

      {/* Intro — clarifies this is birth chart data */}
      <SectionCard>
        <SectionHeading>{isHi ? 'आपकी जन्म कुंडली एक नज़र में' : 'Your Birth Chart at a Glance'}</SectionHeading>
        <InfoParagraph>
          {isHi
            ? 'यह आपके जन्म के क्षण आकाश में ग्रहों की स्थिति है — एक स्थायी स्नैपशॉट जो आपके जन्म के समय तय हुआ था। यह वर्तमान ग्रह स्थिति नहीं है।'
            : 'This shows where the planets were at the exact moment of your birth — a permanent snapshot fixed at that instant. These are your natal (birth) positions, not the current sky.'}
        </InfoParagraph>
      </SectionCard>

      {/* Overall Takeaway */}
      <SectionCard border="border-[#d4a853]/20" className="bg-[#d4a853]/5">
        <SectionHeading>{isHi ? 'समग्र सारांश' : 'Overall Takeaway'}</SectionHeading>
        <p className="text-sm text-gray-200 leading-relaxed">
          {isHi ? overallTakeaway.hi : overallTakeaway.en}
        </p>
      </SectionCard>

      {/* Lagna */}
      <SectionCard border="border-emerald-500/15">
        <SectionHeading>{isHi ? 'लग्न (उदय राशि)' : 'Lagna (Ascendant)'}</SectionHeading>
        <p className="text-sm text-gray-200 leading-relaxed">
          {isHi
            ? `आपका लग्न ${lagnaName} है। यह आपकी "उदय राशि" है — दुनिया आपको बाहर से ऐसे देखती है। ${lagnaSketch?.hi ?? ''}`
            : `Your Lagna is ${lagnaName}. This is your rising sign — your outer self, how the world perceives you. ${lagnaSketch?.en ?? ''}`}
        </p>
      </SectionCard>

      {/* Moon Sign */}
      {moonPlanet && (
        <SectionCard border="border-sky-500/15">
          <SectionHeading>{isHi ? 'चन्द्र राशि (मन)' : 'Moon Sign (Rashi)'}</SectionHeading>
          <p className="text-sm text-gray-200 leading-relaxed">
            {isHi
              ? `आपका चन्द्रमा ${moonNameHi} राशि में है। यह आपका आंतरिक स्वभाव है — आपकी भावनाएं, मानसिक आवश्यकताएं और वह जो आपको भीतर से सुकून देता है। ${moonSketch?.hi ?? ''}`
              : `Your Moon is in ${moonNameEn}. This is your inner world — your emotional needs, instinctive reactions, and what truly gives you comfort beneath the surface. ${moonSketch?.en ?? ''}`}
          </p>
        </SectionCard>
      )}

      {/* Key Dignities */}
      {(exalted.length > 0 || debilitated.length > 0 || retrograde.length > 0 || ownSign.length > 0) && (
        <SectionCard border="border-sky-500/15">
          <SectionHeading>{isHi ? 'प्रमुख गरिमाएं' : 'Key Dignities'}</SectionHeading>
          <div className="space-y-3">
            {exalted.map(p => (
              <div key={`ex-${p.planet.id}`} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-emerald-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` उच्च है — अत्यंत बलवान। ${pNameFull(p.planet.id, true)} के कारकत्वों से उत्कृष्ट परिणाम अपेक्षित हैं।`
                    : ` is exalted — extremely strong. Expect excellent results from ${pNameFull(p.planet.id, false)}'s significations.`}
                </p>
              </div>
            ))}
            {debilitated.map(p => (
              <div key={`deb-${p.planet.id}`} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-amber-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` नीच है — चुनौतीपूर्ण। ${pNameFull(p.planet.id, true)} के विषयों में बाधाएं आ सकती हैं। नीच भंग (निरस्तीकरण) की जांच करें।`
                    : ` is debilitated — challenged. ${pNameFull(p.planet.id, false)}'s themes may face obstacles. Check for Neecha Bhanga (cancellation).`}
                </p>
              </div>
            ))}
            {ownSign.map(p => (
              <div key={`own-${p.planet.id}`} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-emerald-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` अपनी ही राशि में है — सहज और स्वाभाविक। मजबूत, विश्वसनीय परिणाम।`
                    : ` is in its own sign — comfortable and natural. Strong, reliable results.`}
                </p>
              </div>
            ))}
            {retrograde.map(p => (
              <div key={`ret-${p.planet.id}`} className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-sky-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` वक्री है — आंतरिक ऊर्जा। परिणाम पुनर्विचार, पुनरावलोकन और गहन प्रयास से आते हैं।`
                    : ` is retrograde — internalized energy. Results come through revisiting, rethinking, and deeper effort.`}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Combustion warning */}
      {combust.length > 0 && (
        <SectionCard border="border-amber-500/15">
          <SectionHeading>{isHi ? 'अस्त ग्रह चेतावनी' : 'Combustion Warning'}</SectionHeading>
          <div className="space-y-2">
            {combust.map(p => (
              <div key={`comb-${p.planet.id}`} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-semibold text-amber-400">{pNameFull(p.planet.id, isHi)}</span>
                  {isHi
                    ? ` सूर्य के बहुत निकट है (अस्त) — इसके कारकत्व सूर्य की छाया में आ सकते हैं।`
                    : ` is too close to the Sun (combust) — its significations may be overshadowed.`}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. DASHA INTERPRETATION — Current life chapter
// ═══════════════════════════════════════════════════════════════════════════════

const MAHADASHA_THEMES: Record<string, LocaleText> = {
  Ketu:    { en: 'Spiritual growth, detachment from material pursuits, past karma resolving. You may feel restless or disconnected. Embrace meditation, spiritual practices, and letting go.', hi: 'आध्यात्मिक विकास, भौतिक सुखों से वैराग्य, पिछले कर्मों का फल। आप बेचैन या अलग-थलग महसूस कर सकते हैं। ध्यान, आध्यात्मिक साधना और त्याग को अपनाएं।', sa: 'आध्यात्मिकः विकासः, भौतिकसुखेभ्यः वैराग्यम्, पूर्वकर्मणां फलम्। वैचल्यम् अनुभवामि इति भवेत्। ध्यानं, आध्यात्मिकसाधनां च स्वीकुर्वन्तु।', mai: 'आध्यात्मिक विकास, भौतिक सुखों सँ वैराग्य, पिछला कर्मक फल। अहाँ बेचैन अथवा अलग-थलग अनुभव कय सकैत छी। ध्यान, आध्यात्मिक साधना आ त्याग केँ अपनाउ।', mr: 'आध्यात्मिक विकास, भौतिक सुखांपासून वैराग्य, मागील कर्मांचे फळ। तुम्ही अस्वस्थ किंवा एकटे वाटू शकता. ध्यान, आध्यात्मिक साधना आणि त्याग स्वीकारा।', ta: 'ஆன்மிக வளர்ச்சி, பொருள் தேடலில் இருந்து பற்றின்மை, முன்வினை தீர்வு. நீங்கள் அமைதியின்மை அல்லது துண்டிக்கப்பட்டதாக உணரலாம். தியானம், ஆன்மிக பயிற்சிகள் மற்றும் விடுவதைத் தழுவுங்கள்.', te: 'ఆధ్యాత్మిక వృద్ధి, భౌతిక లక్ష్యాల నుండి వైరాగ్యం, పూర్వకర్మ పరిష్కారం. అశాంతి లేదా అనుసంధానం కోల్పోయినట్లు అనిపించవచ్చు. ధ్యానం, ఆధ్యాత్మిక సాధనలను స్వీకరించండి.', bn: 'আধ্যাত্মিক বিকাশ, বৈষয়িক থেকে বৈরাগ্য, পূর্বকর্ম সমাধান। অস্থিরতা বা বিচ্ছিন্নতা অনুভব হতে পারে। ধ্যান, আধ্যাত্মিক সাধনা ও ত্যাগ গ্রহণ করুন।', kn: 'ಅಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ, ಭೌತಿಕ ಅನ್ವೇಷಣೆಯಿಂದ ವೈರಾಗ್ಯ, ಪೂರ್ವಕರ್ಮ ಪರಿಹಾರ. ಅಶಾಂತಿ ಅಥವಾ ಸಂಪರ್ಕ ಕಡಿತ ಅನುಭವವಾಗಬಹುದು. ಧ್ಯಾನ, ಅಧ್ಯಾತ್ಮಿಕ ಅಭ್ಯಾಸಗಳನ್ನು ಸ್ವೀಕರಿಸಿ.', gu: 'આધ્યાત્મિક વિકાસ, ભૌતિક શોધથી વૈરાગ્ય, પૂર્વકર્મ નિવારણ. બેચેની કે વિખૂટાપણું અનુભવ થઈ શકે. ધ્યાન, આધ્યાત્મિક સાધના અને છોડવું સ્વીકારો.' },
  Venus:   { en: 'Relationships, marriage, luxury, creativity flourish. This is a time for partnerships, artistic pursuits, and enjoying life\'s comforts. Invest in relationships.', hi: 'संबंध, विवाह, विलासिता, रचनात्मकता फलती-फूलती है। यह साझेदारी, कलात्मक कार्यों और जीवन के सुखों का समय है। संबंधों में निवेश करें।' },
  Sun:     { en: 'Career recognition, authority, leadership. Father-related matters prominent. Focus on your public role and professional growth.', hi: 'करियर में मान्यता, अधिकार, नेतृत्व। पिता से संबंधित मामले प्रमुख। अपनी सार्वजनिक भूमिका और पेशेवर विकास पर ध्यान दें।', sa: 'वृत्तौ मान्यता, अधिकारः, नेतृत्वम्। पितृसम्बन्धिताः विषयाः प्रमुखाः। स्वस्य सार्वजनिकभूमिकायां च व्यावसायिकविकासे ध्यानं दातव्यम्।', mai: 'कैरियर मे मान्यता, अधिकार, नेतृत्व। पिता सँ संबंधित मामला प्रमुख। अपन सार्वजनिक भूमिका आ पेशेवर विकास पर ध्यान दिअ।', mr: 'करिअरमध्ये मान्यता, अधिकार, नेतृत्व। वडिलांशी संबंधित बाबी प्रमुख। तुमच्या सार्वजनिक भूमिका आणि व्यावसायिक विकासावर लक्ष केंद्रित करा।', ta: 'தொழில் அங்கீகாரம், அதிகாரம், தலைமை. தந்தை தொடர்பான விஷயங்கள் முக்கியம். உங்கள் பொது பாத்திரம் மற்றும் தொழில்முறை வளர்ச்சியில் கவனம் செலுத்துங்கள்.', te: 'వృత్తి గుర్తింపు, అధికారం, నాయకత్వం. తండ్రి సంబంధిత విషయాలు ప్రముఖం. మీ బహిరంగ పాత్ర మరియు వృత్తిపరమైన వృద్ధిపై దృష్టి పెట్టండి.', bn: 'কর্মজীবন স্বীকৃতি, কর্তৃত্ব, নেতৃত্ব। পিতা সংক্রান্ত বিষয় প্রধান। আপনার জনভূমিকা ও পেশাদার বৃদ্ধিতে মনোযোগ দিন।', kn: 'ವೃತ್ತಿ ಮನ್ನಣೆ, ಅಧಿಕಾರ, ನಾಯಕತ್ವ. ತಂದೆ ಸಂಬಂಧಿ ವಿಷಯಗಳು ಪ್ರಮುಖ. ನಿಮ್ಮ ಸಾರ್ವಜನಿಕ ಪಾತ್ರ ಮತ್ತು ವೃತ್ತಿಪರ ಬೆಳವಣಿಗೆಯ ಮೇಲೆ ಗಮನ ಕೊಡಿ.', gu: 'કારકિર્દી માન્યતા, સત્તા, નેતૃત્વ. પિતા સંબંધિત બાબતો મહત્ત્વપૂર્ણ. તમારી જાહેર ભૂમિકા અને વ્યાવસાયિક વિકાસ પર ધ્યાન આપો.' },
  Moon:    { en: 'Emotional depth, mother\'s influence, travel, public image. Nurture your mental health, connect with family, explore new places.', hi: 'भावनात्मक गहराई, माता का प्रभाव, यात्रा, सार्वजनिक छवि। मानसिक स्वास्थ्य का ध्यान रखें, परिवार से जुड़ें, नए स्थानों की खोज करें।' },
  Mars:    { en: 'Action, property, courage, technical pursuits. Energy is high. Good for real estate, sports, engineering. Watch for conflicts and impatience.', hi: 'कार्यवाही, संपत्ति, साहस, तकनीकी कार्य। ऊर्जा उच्च है। अचल संपत्ति, खेल, इंजीनियरिंग के लिए अच्छा। संघर्ष और अधीरता से बचें।', sa: 'कार्यवाही, सम्पत्तिः, शौर्यं, तकनीकीकार्यम्। ऊर्जा उच्चा। अचलसम्पत्तिः, क्रीडा, यन्त्रविज्ञानं कृते उत्तमम्। संघर्षात् अधैर्यात् च वर्जयन्तु।', mai: 'कार्यवाही, संपत्ति, साहस, तकनीकी कार्य। ऊर्जा उच्च अछि। अचल संपत्ति, खेल, इंजीनियरिंग के लेल नीक। संघर्ष आ अधीरता सँ बचू।', mr: 'कृती, संपत्ती, धाडस, तांत्रिक काम। ऊर्जा उच्च आहे। स्थावर मालमत्ता, खेळ, अभियांत्रिकीसाठी चांगले। संघर्ष आणि अधीरतापासून दूर राहा।', ta: 'செயல், சொத்து, தைரியம், தொழில்நுட்ப முயற்சிகள். ஆற்றல் அதிகம். ரியல் எஸ்டேட், விளையாட்டு, பொறியியலுக்கு நல்லது. மோதல்கள் மற்றும் பொறுமையின்மையை கவனியுங்கள்.', te: 'చర్య, ఆస్తి, ధైర్యం, సాంకేతిక కార్యక్రమాలు. శక్తి ఎక్కువ. రియల్ ఎస్టేట్, క్రీడలు, ఇంజినీరింగ్‌కు మంచిది. సంఘర్షణలు మరియు అసహనాన్ని జాగ్రత్తగా చూడండి.', bn: 'কর্ম, সম্পত্তি, সাহস, প্রযুক্তিগত কাজ। শক্তি উচ্চ। রিয়েল এস্টেট, খেলাধুলা, ইঞ্জিনিয়ারিংয়ের জন্য ভালো। দ্বন্দ্ব ও অধৈর্যের দিকে নজর রাখুন।', kn: 'ಕ್ರಿಯೆ, ಆಸ್ತಿ, ಧೈರ್ಯ, ತಾಂತ್ರಿಕ ಅನ್ವೇಷಣೆ. ಶಕ್ತಿ ಹೆಚ್ಚು. ರಿಯಲ್ ಎಸ್ಟೇಟ್, ಕ್ರೀಡೆ, ಎಂಜಿನಿಯರಿಂಗ್‌ಗೆ ಒಳ್ಳೆಯದು. ಘರ್ಷಣೆ ಮತ್ತು ಅಸಹನೆ ಗಮನಿಸಿ.', gu: 'ક્રિયા, સંપત્તિ, સાહસ, ટેકનિકલ પ્રવૃત્તિ. ઉર્જા ઊંચી. રિયલ એસ્ટેટ, રમતગમત, એન્જિનિયરિંગ માટે સારું. સંઘર્ષ અને અધીરાઈથી સાવધ.' },
  Rahu:    { en: 'Unconventional growth, foreign connections, technology, ambition. Life may feel chaotic but opportunities abound. Embrace change, avoid shortcuts.', hi: 'अपरंपरागत विकास, विदेशी संबंध, प्रौद्योगिकी, महत्वाकांक्षा। जीवन अराजक लग सकता है लेकिन अवसर प्रचुर हैं। परिवर्तन अपनाएं, शॉर्टकट से बचें।', sa: 'अपरम्परागतः विकासः, विदेशसम्बन्धाः, प्रौद्योगिकी, महत्त्वाकाङ्क्षा। जीवनं अराजकं प्रतीयते किन्तु अवसराः प्रचुराः। परिवर्तनं स्वीकुर्वन्तु।', mai: 'अपरंपरागत विकास, विदेशी संबंध, प्रौद्योगिकी, महत्वाकांक्षा। जीवन अराजक लागि सकैत अछि मुदा अवसर प्रचुर अछि। परिवर्तन अपनाउ, शॉर्टकट सँ बचू।', mr: 'अपारंपरिक विकास, परदेशी संबंध, तंत्रज्ञान, महत्त्वाकांक्षा। जीवन अस्ताव्यस्त वाटू शकते पण संधी भरपूर आहेत। बदल स्वीकारा, शॉर्टकट टाळा।', ta: 'வழக்கத்திற்கு மாறான வளர்ச்சி, வெளிநாட்டு தொடர்புகள், தொழில்நுட்பம், லட்சியம். வாழ்க்கை குழப்பமாக உணரலாம் ஆனால் வாய்ப்புகள் நிறைந்துள்ளன. மாற்றத்தை ஏற்றுக்கொள்ளுங்கள், குறுக்கு வழிகளைத் தவிர்க்கவும்.', te: 'అసాంప్రదాయ వృద్ధి, విదేశీ సంబంధాలు, సాంకేతికత, ఆకాంక్ష. జీవితం అస్తవ్యస్తంగా అనిపించవచ్చు కానీ అవకాశాలు పుష్కలం. మార్పును స్వీకరించండి, దగ్గరదారులు నివారించండి.', bn: 'অপ্রচলিত বৃদ্ধি, বিদেশ সংযোগ, প্রযুক্তি, উচ্চাকাঙ্ক্ষা। জীবন বিশৃঙ্খল মনে হতে পারে কিন্তু সুযোগ প্রচুর। পরিবর্তন গ্রহণ করুন, শর্টকাট এড়িয়ে চলুন।', kn: 'ಅಸಾಂಪ್ರದಾಯಿಕ ಬೆಳವಣಿಗೆ, ವಿದೇಶ ಸಂಪರ್ಕ, ತಂತ್ರಜ್ಞಾನ, ಮಹತ್ವಾಕಾಂಕ್ಷೆ. ಜೀವನ ಗೊಂದಲಮಯವಾಗಿ ಅನಿಸಬಹುದು ಆದರೆ ಅವಕಾಶಗಳು ಹೇರಳ. ಬದಲಾವಣೆ ಸ್ವೀಕರಿಸಿ, ಶಾರ್ಟ್‌ಕಟ್ ತಪ್ಪಿಸಿ.', gu: 'અપરંપરાગત વિકાસ, વિદેશ સંપર્ક, ટેક્નોલોજી, મહત્ત્વાકાંક્ષા. જીવન અરાજક લાગી શકે પણ તકો પુષ્કળ. ફેરફાર સ્વીકારો, શોર્ટકટ ટાળો.' },
  Jupiter: { en: 'Wisdom, education, children, spiritual growth, wealth. The most benevolent period. Teach, learn, expand. Good for higher studies and dharma.', hi: 'ज्ञान, शिक्षा, संतान, आध्यात्मिक विकास, धन। सबसे शुभ काल। पढ़ाएं, सीखें, विस्तार करें। उच्च शिक्षा और धर्म के लिए उत्तम।', sa: 'ज्ञानम्, शिक्षा, सन्तानाः, आध्यात्मिकविकासः, धनम्। सर्वशुभकालः। पाठयन्तु, शिक्षन्तु, विस्तारयन्तु। उच्चशिक्षायै धर्माय च उत्तमम्।', mai: 'ज्ञान, शिक्षा, संतान, आध्यात्मिक विकास, धन। सबसँ शुभ काल। पढ़ाउ, सीखू, विस्तार करू। उच्च शिक्षा आ धर्म के लेल उत्तम।', mr: 'ज्ञान, शिक्षण, संतती, आध्यात्मिक विकास, धन। सर्वात शुभ काळ। शिकवा, शिका, विस्तार करा। उच्च शिक्षण आणि धर्मासाठी उत्तम।', ta: 'ஞானம், கல்வி, குழந்தைகள், ஆன்மிக வளர்ச்சி, செல்வம். மிகவும் நன்மை தரும் காலம். கற்பியுங்கள், கற்றுக்கொள்ளுங்கள், விரிவடையுங்கள். உயர்கல்வி மற்றும் தர்மத்திற்கு நல்லது.', te: 'జ్ఞానం, విద్య, సంతానం, ఆధ్యాత్మిక వృద్ధి, సంపద. అత్యంత శుభప్రదమైన కాలం. బోధించండి, నేర్చుకోండి, విస్తరించండి. ఉన్నత విద్య మరియు ధర్మానికి మంచిది.', bn: 'জ্ঞান, শিক্ষা, সন্তান, আধ্যাত্মিক বিকাশ, সম্পদ। সবচেয়ে শুভ কাল। শেখান, শিখুন, প্রসারিত হন। উচ্চশিক্ষা ও ধর্মের জন্য ভালো।', kn: 'ಜ್ಞಾನ, ಶಿಕ್ಷಣ, ಮಕ್ಕಳು, ಅಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ, ಸಂಪತ್ತು. ಅತ್ಯಂತ ಶುಭಕರ ಅವಧಿ. ಕಲಿಸಿ, ಕಲಿಯಿರಿ, ವಿಸ್ತರಿಸಿ. ಉನ್ನತ ಅಧ್ಯಯನ ಮತ್ತು ಧರ್ಮಕ್ಕೆ ಒಳ್ಳೆಯದು.', gu: 'જ્ઞાન, શિક્ષણ, સંતાન, આધ્યાત્મિક વિકાસ, સંપત્તિ. સૌથી શુભ કાળ. શીખવો, શીખો, વિસ્તાર કરો. ઉચ્ચ અભ્યાસ અને ધર્મ માટે સારું.' },
  Saturn:  { en: 'Discipline, hard work, career building, responsibility. Slow but lasting results. Build structures, face karma, earn respect through effort.', hi: 'अनुशासन, कठिन परिश्रम, करियर निर्माण, जिम्मेदारी। धीमे लेकिन स्थायी परिणाम। संरचनाएं बनाएं, कर्म का सामना करें, प्रयास से सम्मान अर्जित करें।', sa: 'अनुशासनम्, कठिनः परिश्रमः, वृत्तिनिर्माणम्, उत्तरदायित्वम्। मन्दं किन्तु स्थायिफलम्। संरचनाः निर्मान्तु, कर्मणः सम्मुखं गच्छन्तु, प्रयत्नेन सम्मानम् अर्जयन्तु।', mai: 'अनुशासन, कठिन परिश्रम, कैरियर निर्माण, जिम्मेदारी। धीमे मुदा स्थायी परिणाम। संरचना बनाउ, कर्मक सामना करू, प्रयास सँ सम्मान अर्जित करू।', mr: 'शिस्त, कठोर परिश्रम, करिअर निर्माण, जबाबदारी। हळू पण टिकाऊ परिणाम। रचना तयार करा, कर्माला सामोरे जा, प्रयत्नांनी सन्मान मिळवा।', ta: 'ஒழுக்கம், கடின உழைப்பு, தொழில் கட்டுமானம், பொறுப்பு. மெதுவான ஆனால் நீடித்த பலன்கள். கட்டமைப்புகளை உருவாக்குங்கள், கர்மத்தை எதிர்கொள்ளுங்கள், முயற்சியால் மரியாதை பெறுங்கள்.', te: 'క్రమశిక్షణ, కఠోర శ్రమ, వృత్తి నిర్మాణం, బాధ్యత. నెమ్మదిగా కానీ శాశ్వతమైన ఫలితాలు. నిర్మాణాలు చేయండి, కర్మను ఎదుర్కోండి, ప్రయత్నం ద్వారా గౌరవం సంపాదించండి.', bn: 'শৃঙ্খলা, কঠোর পরিশ্রম, কর্মজীবন গঠন, দায়িত্ব। ধীর কিন্তু স্থায়ী ফলাফল। কাঠামো তৈরি করুন, কর্মফলের মুখোমুখি হন, প্রচেষ্টায় সম্মান অর্জন করুন।', kn: 'ಶಿಸ್ತು, ಕಠಿಣ ಪರಿಶ್ರಮ, ವೃತ್ತಿ ನಿರ್ಮಾಣ, ಹೊಣೆಗಾರಿಕೆ. ನಿಧಾನ ಆದರೆ ಶಾಶ್ವತ ಫಲಿತಾಂಶ. ರಚನೆಗಳನ್ನು ನಿರ್ಮಿಸಿ, ಕರ್ಮವನ್ನು ಎದುರಿಸಿ, ಪ್ರಯತ್ನದಿಂದ ಗೌರವ ಗಳಿಸಿ.', gu: 'શિસ્ત, સખત મહેનત, કારકિર્દી નિર્માણ, જવાબદારી. ધીમા પણ ટકાઉ પરિણામ. માળખા બનાવો, કર્મનો સામનો કરો, પ્રયત્નથી સન્માન મેળવો.' },
  Mercury: { en: 'Business, communication, intellect, skills. Start ventures, write, network. Good for education, commerce, and analytical work.', hi: 'व्यापार, संवाद, बुद्धि, कौशल। उद्यम शुरू करें, लिखें, नेटवर्क बनाएं। शिक्षा, वाणिज्य और विश्लेषणात्मक कार्य के लिए अच्छा।', sa: 'वाणिज्यम्, संवादः, बुद्धिः, कौशलम्। उद्यमं प्रारभन्तु, लिखन्तु, जालं निर्मान्तु। शिक्षायै, वाणिज्याय, विश्लेषणात्मककार्याय च उत्तमम्।', mai: 'व्यापार, संवाद, बुद्धि, कौशल। उद्यम शुरू करू, लिखू, नेटवर्क बनाउ। शिक्षा, वाणिज्य आ विश्लेषणात्मक कार्य के लेल नीक।', mr: 'व्यापार, संवाद, बुद्धी, कौशल्य। उद्योग सुरू करा, लिहा, नेटवर्क तयार करा। शिक्षण, वाणिज्य आणि विश्लेषणात्मक कामासाठी चांगले।', ta: 'வணிகம், தகவல்தொடர்பு, புத்திசாலித்தனம், திறன்கள். முயற்சிகளைத் தொடங்குங்கள், எழுதுங்கள், நெட்வொர்க் செய்யுங்கள். கல்வி, வர்த்தகம் மற்றும் பகுப்பாய்வு பணிக்கு நல்லது.', te: 'వ్యాపారం, సంభాషణ, బుద్ధి, నైపుణ్యాలు. వ్యాపారాలు ప్రారంభించండి, రాయండి, నెట్‌వర్క్ చేయండి. విద్య, వాణిజ్యం మరియు విశ్లేషణాత్మక పనికి మంచిది.', bn: 'ব্যবসা, যোগাযোগ, বুদ্ধি, দক্ষতা। উদ্যোগ শুরু করুন, লিখুন, নেটওয়ার্ক করুন। শিক্ষা, বাণিজ্য ও বিশ্লেষণমূলক কাজের জন্য ভালো।', kn: 'ವ್ಯಾಪಾರ, ಸಂವಹನ, ಬುದ್ಧಿ, ಕೌಶಲ. ಉದ್ಯಮ ಪ್ರಾರಂಭಿಸಿ, ಬರೆಯಿರಿ, ಸಂಪರ್ಕ ಬೆಳೆಸಿ. ಶಿಕ್ಷಣ, ವಾಣಿಜ್ಯ ಮತ್ತು ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಕೆಲಸಕ್ಕೆ ಒಳ್ಳೆಯದು.', gu: 'વ્યાપાર, સંવાદ, બુદ્ધિ, કૌશલ્ય. ઉદ્યમ શરૂ કરો, લખો, નેટવર્ક કરો. શિક્ષણ, વાણિજ્ય અને વિશ્લેષણાત્મક કામ માટે સારું.' },
};

const DASHA_DURATIONS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

interface DashaInterpretationProps {
  dashas: any[];
  planets: PlanetPosition[];
  locale: string;
}

export function DashaInterpretation({ dashas, planets, locale }: DashaInterpretationProps) {
  const isHi = isDevanagariLocale(locale);

  const { currentMaha, currentAntar, nextMaha } = useMemo(() => {
    const now = new Date();
    let maha: any = null;
    let antar: any = null;
    let next: any = null;

    for (let i = 0; i < dashas.length; i++) {
      const d = dashas[i];
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      if (now >= start && now <= end) {
        maha = d;
        if (d.subPeriods && Array.isArray(d.subPeriods)) {
          for (const sub of d.subPeriods) {
            const sStart = new Date(sub.startDate);
            const sEnd = new Date(sub.endDate);
            if (now >= sStart && now <= sEnd) {
              antar = sub;
              break;
            }
          }
        }
        if (i + 1 < dashas.length) {
          next = dashas[i + 1];
        }
        break;
      }
    }
    return { currentMaha: maha, currentAntar: antar, nextMaha: next };
  }, [dashas]);

  if (!currentMaha) return null;

  const mahaPlanet = currentMaha.planet || (isHi ? currentMaha.planetName?.hi : currentMaha.planetName?.en) || 'Unknown';
  const mahaTheme = MAHADASHA_THEMES[mahaPlanet];
  const mahaDuration = DASHA_DURATIONS[mahaPlanet] ?? '?';

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isHi ? 'hi-IN' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  const NAME_TO_ID: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8 };
  const mahaPlanetId = NAME_TO_ID[mahaPlanet] ?? 0;
  const mahaGraha = GRAHAS[mahaPlanetId];
  const antarPlanet = currentAntar ? (currentAntar.planet || currentAntar.planetName?.en || 'Unknown') : '';
  const antarPlanetId = NAME_TO_ID[antarPlanet] ?? 0;
  const antarGraha = GRAHAS[antarPlanetId];
  const antarTheme = currentAntar ? MAHADASHA_THEMES[antarPlanet] : null;

  return (
    <div className="space-y-4 mt-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-3 border-b border-gold-primary/15">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-primary/20 to-gold-dark/10 border border-gold-primary/25 flex items-center justify-center">
          <GrahaIconById id={mahaPlanetId} size={28} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gold-light">{isHi ? 'दशा विश्लेषण' : 'Dasha Interpretation'}</h3>
          <p className="text-text-secondary/50 text-xs">{isHi ? 'आपका वर्तमान ग्रह काल' : 'Your current planetary period'}</p>
        </div>
      </div>

      {/* Current Mahadasha — mega card */}
      <div className="rounded-xl p-5 border-2 border-gold-primary/20 bg-gradient-to-r from-gold-primary/8 via-transparent to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: mahaGraha?.color || '#d4a853' }} />
          <span className="text-gold-light font-bold text-lg">
            {isHi ? `${mahaPlanet} महादशा` : `${mahaPlanet} Mahadasha`}
          </span>
          <span className="text-text-secondary/60 text-xs ml-auto">{formatDate(currentMaha.startDate)} — {formatDate(currentMaha.endDate)}</span>
        </div>
        <p className="text-sm text-gray-200/80 leading-relaxed mb-2">
          {isHi
            ? `${mahaDuration} वर्षों की अवधि जो ${mahaPlanet} के विषयों से प्रभावित है।`
            : `A ${mahaDuration}-year period dominated by ${mahaPlanet}'s themes.`}
        </p>
        {mahaTheme && (
          <p className="text-sm text-text-primary/80 leading-relaxed">
            {isHi ? mahaTheme.hi : mahaTheme.en}
          </p>
        )}
      </div>

      {/* Current Antardasha */}
      {currentAntar && (
        <div className="rounded-xl p-4 border border-white/5 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] ml-2 sm:ml-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center bg-bg-primary/50">
              <GrahaIconById id={antarPlanetId} size={18} />
            </div>
            <div>
              <span className="font-semibold text-sm" style={{ color: antarGraha?.color || '#e6e2d8' }}>
                {isHi ? `${mahaPlanet}-${antarPlanet} अन्तर्दशा` : `${mahaPlanet}-${antarPlanet} Antardasha`}
              </span>
              <p className="text-text-secondary/50 text-[10px]">{formatDate(currentAntar.startDate)} — {formatDate(currentAntar.endDate)}</p>
            </div>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed ml-11">
            {isHi
              ? `${mahaPlanet} के व्यापक विषयों में ${antarPlanet} की ऊर्जा मिलती है${antarTheme ? `: ${antarTheme.hi!.split('.')[0]}.` : '।'}`
              : `${antarPlanet}'s energy blends with ${mahaPlanet}'s broader themes${antarTheme ? `: ${antarTheme.en.split('.')[0]}.` : '.'}`}
          </p>
        </div>
      )}

      {/* Next Transition */}
      {nextMaha && (() => {
        const nextPlanet = nextMaha.planet || nextMaha.planetName?.en || 'Unknown';
        const nextId = NAME_TO_ID[nextPlanet] ?? 0;
        return (
          <div className="rounded-xl p-4 border border-indigo-500/15 bg-indigo-500/5 ml-2 sm:ml-4">
            <div className="flex items-center gap-2 mb-2">
              <GrahaIconById id={nextId} size={16} />
              <span className="text-indigo-400 text-xs uppercase tracking-wider font-bold">{isHi ? 'अगला परिवर्तन' : 'Next Transition'}</span>
              <span className="w-4 h-px bg-indigo-500/30 flex-1" />
            </div>
            <p className="text-text-secondary/80 text-sm">
              {isHi
                ? `${nextPlanet} महादशा ${formatDate(nextMaha.startDate)} से शुरू होगी। जीवन के विषयों में बदलाव के लिए तैयार रहें।`
                : `${nextPlanet} Mahadasha starts on ${formatDate(nextMaha.startDate)}. Prepare for a shift in life themes.`}
            </p>
          </div>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. JAIMINI INTERPRETATION — Soul's purpose via Chara Karakas
// ═══════════════════════════════════════════════════════════════════════════════

interface AKTheme { desire: LocaleText; lessons: LocaleText; shadow: LocaleText; karma: LocaleText; }

const AK_THEMES: Record<string, AKTheme> = {
  Sun: {
    desire: { en: 'Your soul seeks recognition, authentic self-expression, and the right to lead — not from ego, but from dharma. The soul longs to shine as itself without apology.', hi: 'आपकी आत्मा मान्यता, प्रामाणिक अभिव्यक्ति और नेतृत्व की इच्छा रखती है — अहंकार से नहीं, धर्म से।', sa: 'भवतः आत्मा मान्यतां, प्रामाणिकीम् अभिव्यक्तिं नेतृत्वं च इच्छति — अहङ्कारात् न, धर्मतः।', mai: 'अहाँक आत्मा मान्यता, प्रामाणिक अभिव्यक्ति आ नेतृत्व चाहैत अछि — अहंकार सँ नहि, धर्म सँ।', mr: 'तुमचा आत्मा मान्यता, प्रामाणिक आत्मअभिव्यक्ती आणि नेतृत्वाचा हक्क शोधतो — अहंकारातून नाही, धर्मातून।', ta: 'உங்கள் ஆன்மா அங்கீகாரம், உண்மையான சுய வெளிப்பாடு மற்றும் தலைமை தாங்கும் உரிமையைத் தேடுகிறது — அகங்காரத்தால் அல்ல, தர்மத்தால். ஆன்மா மன்னிப்பு கேட்காமல் தானாகவே ஒளிர விரும்புகிறது.', te: 'మీ ఆత్మ గుర్తింపు, ప్రామాణిక స్వీయ వ్యక్తీకరణ మరియు నడిపించే హక్కును కోరుతుంది — అహంకారం నుండి కాదు, ధర్మం నుండి.', bn: 'আপনার আত্মা স্বীকৃতি, প্রকৃত আত্মপ্রকাশ এবং নেতৃত্বের অধিকার খোঁজে — অহং থেকে নয়, ধর্ম থেকে।', kn: 'ನಿಮ್ಮ ಆತ್ಮ ಮನ್ನಣೆ, ಅಧಿಕೃತ ಸ್ವಯಂ ಅಭಿವ್ಯಕ್ತಿ ಮತ್ತು ನಡೆಸುವ ಹಕ್ಕನ್ನು ಬಯಸುತ್ತದೆ — ಅಹಂಕಾರದಿಂದ ಅಲ್ಲ, ಧರ್ಮದಿಂದ.', gu: 'તમારી આત્મા માન્યતા, સાચી આત્મ-અભિવ્યક્તિ અને દોરવણીનો અધિકાર શોધે — અહંકારથી નહીં, ધર્મથી.' },
    lessons: { en: 'Develop authority through service, not dominance. True recognition comes from what you give, not what you claim. You are here to become a centre of light that others voluntarily orbit — because of your warmth, not your demands.', hi: 'सेवा के माध्यम से अधिकार विकसित करें। सच्ची मान्यता देने से आती है। दूसरे आपकी उष्णता के कारण आपकी ओर आकर्षित हों, आपकी माँग के कारण नहीं।', sa: 'सेवया अधिकारं विकसयन्तु। सत्या मान्यता दानात् आगच्छति। अन्ये भवतः ऊष्मणा कारणात् आकृष्टाः भवन्तु, न तु आग्रहात्।', mai: 'सेवाक माध्यम सँ अधिकार विकसित करू। सच्ची मान्यता देबा सँ आबैत अछि। दोसर अहाँक उष्णता सँ आकर्षित हुअय, माँग सँ नहि।', mr: 'सेवेच्या माध्यमातून अधिकार विकसित करा। खरी मान्यता देण्यातून येते। इतरांनी तुमच्या उबदारपणामुळे तुमच्याकडे आकर्षित व्हावे, मागणीमुळे नाही।', ta: 'ஆதிக்கத்தால் அல்ல, சேவையால் அதிகாரத்தை வளர்த்துக்கொள்ளுங்கள். உண்மையான அங்கீகாரம் நீங்கள் கொடுப்பதிலிருந்து வருகிறது, நீங்கள் கோருவதிலிருந்து அல்ல.', te: 'ఆధిపత్యం ద్వారా కాదు, సేవ ద్వారా అధికారాన్ని అభివృద్ధి చేయండి. నిజమైన గుర్తింపు మీరు ఇచ్చేదాని నుండి వస్తుంది.', bn: 'আধিপত্য নয়, সেবার মাধ্যমে কর্তৃত্ব গড়ে তুলুন। প্রকৃত স্বীকৃতি আপনি যা দেন তা থেকে আসে।', kn: 'ಪ್ರಾಬಲ್ಯದಿಂದ ಅಲ್ಲ, ಸೇವೆಯ ಮೂಲಕ ಅಧಿಕಾರ ಬೆಳೆಸಿ. ನಿಜವಾದ ಮನ್ನಣೆ ನೀವು ನೀಡುವುದರಿಂದ ಬರುತ್ತದೆ.', gu: 'વર્ચસ્વથી નહીં, સેવાથી સત્તા વિકસાવો. સાચી માન્યતા તમે જે આપો છો તેમાંથી આવે છે.' },
    shadow: { en: 'Pride, need for constant validation, and rage when ignored. The solar soul can confuse self-worth with the applause of others — and collapse when that applause stops.', hi: 'अहंकार, निरन्तर मान्यता की आवश्यकता और उपेक्षा पर क्रोध। सौर आत्मा आत्म-मूल्य को सराहना से भ्रमित कर सकती है।', sa: 'अहङ्कारः, निरन्तरमान्यतायाः आवश्यकता उपेक्षायां च क्रोधः। सौरा आत्मा आत्ममूल्यं प्रशंसया भ्रमयितुं शक्नोति।', mai: 'अहंकार, निरंतर मान्यताक जरूरत आ उपेक्षा पर क्रोध। सौर आत्मा आत्म-मूल्य केँ सराहना सँ भ्रमित कय सकैत अछि।', mr: 'अहंकार, सतत मान्यतेची गरज आणि दुर्लक्षित केल्यावर राग। सौर आत्मा आत्ममूल्याची इतरांच्या टाळ्यांशी गल्लत करू शकतो।', ta: 'கர்வம், தொடர்ச்சியான சரிபார்ப்பின் தேவை, புறக்கணிக்கப்படும்போது கோபம். சூரிய ஆன்மா சுய மதிப்பை மற்றவர்களின் கைத்தட்டலுடன் குழப்பிக்கொள்ளலாம்.', te: 'గర్వం, నిరంతర ధృవీకరణ అవసరం, విస్మరించినప్పుడు ఆగ్రహం. సూర్య ఆత్మ స్వీయ విలువను ఇతరుల చప్పట్లతో గందరగోళం చేయవచ్చు.', bn: 'অহংকার, ক্রমাগত স্বীকৃতির প্রয়োজন, উপেক্ষিত হলে ক্রোধ। সৌর আত্মা আত্মমর্যাদাকে অন্যের করতালির সাথে গুলিয়ে ফেলতে পারে।', kn: 'ಹೆಮ್ಮೆ, ನಿರಂತರ ಮಾನ್ಯತೆಯ ಅಗತ್ಯ, ನಿರ್ಲಕ್ಷಿಸಿದಾಗ ಕೋಪ. ಸೌರ ಆತ್ಮ ಸ್ವಯಂ ಮೌಲ್ಯವನ್ನು ಇತರರ ಚಪ್ಪಾಳೆಯೊಂದಿಗೆ ಗೊಂದಲಗೊಳಿಸಬಹುದು.', gu: 'ગર્વ, સતત માન્યતાની જરૂર, અવગણના થાય ત્યારે ક્રોધ. સૂર્ય આત્મા સ્વ-મૂલ્યને બીજાની તાળીઓ સાથે ગૂંચવી શકે.' },
    karma: { en: 'In past lives you served — or were forced to serve — and your will was suppressed. This life you must reclaim your sovereignty, but wield it righteously. Be the king who serves the kingdom, not the king who IS the kingdom.', hi: 'पिछले जन्मों में आत्मा की इच्छा को दबाया गया था। इस जीवन में अपनी सम्प्रभुता पुनः प्राप्त करनी है, पर धर्मपूर्वक।', sa: 'पूर्वजन्मेषु आत्मनः इच्छा दमिता आसीत्। अस्मिन् जीवने स्वस्य साम्राज्यं पुनः प्राप्तव्यम्, किन्तु धर्मेण।', mai: 'पिछला जन्म मे आत्माक इच्छा केँ दबाएल गेल छल। ई जीवन मे अपन सम्प्रभुता पुनः प्राप्त करबाक अछि, मुदा धर्मपूर्वक।', mr: 'मागील जन्मांत आत्म्याची इच्छा दडपली गेली होती। या जीवनात आपले सार्वभौमत्व पुन्हा मिळवायचे आहे, पण धर्मानुसार।', ta: 'முற்பிறவிகளில் நீங்கள் சேவை செய்தீர்கள் — அல்லது சேவை செய்ய கட்டாயப்படுத்தப்பட்டீர்கள் — உங்கள் விருப்பம் அடக்கப்பட்டது. இந்த வாழ்க்கையில் உங்கள் இறையாண்மையை மீட்டெடுக்க வேண்டும், ஆனால் நீதியாகப் பயன்படுத்த வேண்டும்.', te: 'గత జన్మలలో మీరు సేవ చేశారు — లేదా సేవ చేయమని బలవంతం చేయబడ్డారు — మీ సంకల్పం అణచివేయబడింది. ఈ జీవితంలో మీ సార్వభౌమత్వాన్ని తిరిగి పొందాలి, కానీ ధర్మబద్ధంగా ఉపయోగించాలి.', bn: 'পূর্বজন্মে আপনি সেবা করেছেন — বা সেবা করতে বাধ্য হয়েছেন — এবং আপনার ইচ্ছা দমিত ছিল। এই জীবনে আপনাকে আপনার সার্বভৌমত্ব পুনরুদ্ধার করতে হবে, কিন্তু ধার্মিকভাবে ব্যবহার করতে হবে।', kn: 'ಹಿಂದಿನ ಜನ್ಮಗಳಲ್ಲಿ ನೀವು ಸೇವೆ ಮಾಡಿದಿರಿ — ಅಥವಾ ಸೇವೆ ಮಾಡಲು ಒತ್ತಾಯಿಸಲ್ಪಟ್ಟಿರಿ — ನಿಮ್ಮ ಇಚ್ಛೆ ಅಡಗಿತ್ತು. ಈ ಜೀವನದಲ್ಲಿ ನಿಮ್ಮ ಸಾರ್ವಭೌಮತ್ವವನ್ನು ಮರಳಿ ಪಡೆಯಬೇಕು, ಆದರೆ ಧಾರ್ಮಿಕವಾಗಿ ಬಳಸಬೇಕು.', gu: 'ગત જન્મોમાં તમે સેવા કરી — અથવા સેવા કરવા મજબૂર થયા — અને તમારી ઇચ્છા દબાવાઈ. આ જીવનમાં તમારે તમારી સાર્વભૌમત્વ પાછી મેળવવી જોઈએ, પણ ન્યાયી રીતે વાપરવી.' },
  },
  Moon: {
    desire: { en: 'Your soul seeks emotional depth, true belonging, and the safety of unconditional love. It longs to nurture and be nurtured — to feel genuinely at home in the world.', hi: 'आपकी आत्मा भावनात्मक गहराई, सच्चे अपनेपन और बिना शर्त प्रेम की सुरक्षा चाहती है।', sa: 'भवतः आत्मा भावनात्मकं गाम्भीर्यं, सत्यं स्वकीयत्वं निःशर्तप्रेम्णः च सुरक्षां इच्छति।', mai: 'अहाँक आत्मा भावनात्मक गहराई, सच्चा अपनापन आ बिना शर्त प्रेमक सुरक्षा चाहैत अछि।', mr: 'तुमचा आत्मा भावनिक खोली, खरे आपलेपण आणि बिनशर्त प्रेमाची सुरक्षा शोधतो।', ta: 'உங்கள் ஆன்மா உணர்ச்சி ஆழம், உண்மையான சொந்தம் மற்றும் நிபந்தனையற்ற அன்பின் பாதுகாப்பைத் தேடுகிறது. வளர்க்கவும் வளர்க்கப்படவும் ஏங்குகிறது.', te: 'మీ ఆత్మ భావోద్వేగ లోతు, నిజమైన చెందుట మరియు షరతులు లేని ప్రేమ భద్రతను కోరుతుంది. పోషించడానికి మరియు పోషించబడటానికి ఆరాటపడుతుంది.', bn: 'আপনার আত্মা আবেগজ গভীরতা, প্রকৃত অন্তর্ভুক্তি এবং নিঃশর্ত ভালোবাসার নিরাপত্তা খোঁজে। লালন করতে ও লালিত হতে আকাঙ্ক্ষা করে।', kn: 'ನಿಮ್ಮ ಆತ್ಮ ಭಾವನಾತ್ಮಕ ಆಳ, ನಿಜವಾದ ಸೇರ್ಪಡೆ ಮತ್ತು ಬೇಷರತ್ತಾದ ಪ್ರೀತಿಯ ಸುರಕ್ಷತೆ ಬಯಸುತ್ತದೆ. ಪೋಷಿಸಲು ಮತ್ತು ಪೋಷಿಸಲ್ಪಡಲು ಹಾತೊರೆಯುತ್ತದೆ.', gu: 'તમારી આત્મા ભાવનાત્મક ઊંડાઈ, સાચું અપનાપન અને બિનશરતી પ્રેમની સુરક્ષા શોધે. પાલન કરવા અને પાલિત થવા ઝંખે.' },
    lessons: { en: 'Nurture others without losing yourself in the process. The Moon AK must master emotional boundaries — giving care from fullness, not from fear of loss. Detachment from outcomes is the key spiritual lesson.', hi: 'दूसरों का पोषण करते हुए स्वयं को न खोएं। डर से नहीं, परिपूर्णता से देना सीखें।', sa: 'परेषां पोषणे स्वयं मा विनाशयन्तु। भयात् न, परिपूर्णतया दानं शिक्षन्तु।', mai: 'दोसरक पोषण करैत अपन आप केँ नहि खोउ। डर सँ नहि, परिपूर्णता सँ देब सीखू।', mr: 'इतरांचे पोषण करताना स्वतःला हरवू नका। भीतीतून नाही, परिपूर्णतेतून देणे शिका।', ta: 'செயல்பாட்டில் உங்களை இழக்காமல் மற்றவர்களை வளர்க்கவும். சந்திர AK உணர்ச்சி எல்லைகளை கற்றுக்கொள்ள வேண்டும் — இழப்பின் பயத்தால் அல்ல, நிறைவிலிருந்து பராமரிப்பு அளிக்கவும்.', te: 'ప్రక్రియలో మిమ్మల్ని కోల్పోకుండా ఇతరులను పోషించండి. చంద్ర AK భావోద్వేగ సరిహద్దులను నేర్చుకోవాలి — నష్టపోయే భయం నుండి కాదు, సంపూర్ణత నుండి సంరక్షణ ఇవ్వాలి.', bn: 'প্রক্রিয়ায় নিজেকে না হারিয়ে অন্যদের লালন করুন। চন্দ্র AK কে আবেগজ সীমানা আয়ত্ত করতে হবে — ক্ষতির ভয় থেকে নয়, পূর্ণতা থেকে যত্ন দিন।', kn: 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ನಿಮ್ಮನ್ನು ಕಳೆದುಕೊಳ್ಳದೆ ಇತರರನ್ನು ಪೋಷಿಸಿ. ಚಂದ್ರ AK ಭಾವನಾತ್ಮಕ ಗಡಿಗಳನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳಬೇಕು — ನಷ್ಟದ ಭಯದಿಂದ ಅಲ್ಲ, ಪೂರ್ಣತೆಯಿಂದ ಆರೈಕೆ ನೀಡಿ.', gu: 'પ્રક્રિયામાં તમારી જાતને ગુમાવ્યા વિના બીજાનું પાલન કરો. ચંદ્ર AK ભાવનાત્મક સીમાઓ શીખવી જોઈએ — ગુમાવવાના ડરથી નહીં, પૂર્ણતાથી સંભાળ આપો.' },
    shadow: { en: 'Emotional neediness, clinging, fear of abandonment, and mood cycles that pull others in then push them away. The lunar soul can become a tide that drowns those it loves most.', hi: 'भावनात्मक निर्भरता, चिपकना और परित्याग का भय। चन्द्र आत्मा उन्हें डुबो सकती है जिन्हें वह प्रेम करती है।', sa: 'भावनात्मक निर्भरता, चिपकना और परित्याग का भय। चन्द्र आत्मा उन्हें डुबो सकती है जिन्हें वह प्रेम करती है।', mai: 'भावनात्मक निर्भरता, चिपकना और परित्याग का भय। चन्द्र आत्मा उन्हें डुबो सकती है जिन्हें वह प्रेम करती है।', mr: 'भावनात्मक निर्भरता, चिपकना और परित्याग का भय। चन्द्र आत्मा उन्हें डुबो सकती है जिन्हें वह प्रेम करती है।', ta: 'உணர்ச்சிப் பற்றாக்குறை, ஒட்டிக்கொள்ளுதல், கைவிடப்படும் பயம், மற்றும் மற்றவர்களை இழுத்துவிட்டு பின் தள்ளும் மனநிலை சுழற்சிகள்.', te: 'భావోద్వేగ అవసరం, అంటిపెట్టుకోవడం, విడిచిపెట్టే భయం, మరియు ఇతరులను లోపలికి లాగి తర్వాత దూరం నెట్టే మానసిక చక్రాలు.', bn: 'আবেগজ নির্ভরশীলতা, আঁকড়ে ধরা, পরিত্যাগের ভয়, এবং অন্যদের কাছে টেনে আবার দূরে ঠেলে দেওয়ার মেজাজ চক্র।', kn: 'ಭಾವನಾತ್ಮಕ ಅಗತ್ಯ, ಅಂಟಿಕೊಳ್ಳುವಿಕೆ, ಕೈಬಿಡುವ ಭಯ, ಮತ್ತು ಇತರರನ್ನು ಒಳಗೆ ಎಳೆದು ನಂತರ ದೂರ ತಳ್ಳುವ ಮನಸ್ಥಿತಿ ಚಕ್ರಗಳು.', gu: 'ભાવનાત્મક જરૂરિયાત, ચોંટી રહેવું, છોડી દેવાનો ડર, અને બીજાને ખેંચીને પછી દૂર ધકેલવાના મૂડ ચક્ર.' },
    karma: { en: 'This soul has known great emotional loss — separation from home, mother, or beloveds. The karma is to become the mother: hold space for others, create emotional safety, and master the mind\'s tides through equanimity.', hi: 'इस आत्मा ने भावनात्मक हानि जानी है। कर्म है माँ बनना — दूसरों के लिए भावनात्मक सुरक्षा बनाना और मन को साधना।' },
  },
  Mars: {
    desire: { en: 'Your soul seeks courage — the ability to act righteously in the face of opposition, protect the innocent, and conquer internal and external enemies. The Martian soul came here to fight its most important war.', hi: 'आपकी आत्मा साहस चाहती है — विरोध के सामने धर्मपूर्वक कार्य करने और निर्दोषों की रक्षा करने की क्षमता।', sa: 'आपकी आत्मा साहस चाहती है — विरोध के सामने धर्मपूर्वक कार्य करने और निर्दोषों की रक्षा करने की क्षमता।', mai: 'आपकी आत्मा साहस चाहती है — विरोध के सामने धर्मपूर्वक कार्य करने और निर्दोषों की रक्षा करने की क्षमता।', mr: 'आपकी आत्मा साहस चाहती है — विरोध के सामने धर्मपूर्वक कार्य करने और निर्दोषों की रक्षा करने की क्षमता।', ta: 'Your soul seeks courage — the ability to act righteously in the face of opposition, protect the innocent, and conquer internal and external enemies. The Martian soul came here to fight its most important war.', te: 'Your soul seeks courage — the ability to act righteously in the face of opposition, protect the innocent, and conquer internal and external enemies. The Martian soul came here to fight its most important war.', bn: 'Your soul seeks courage — the ability to act righteously in the face of opposition, protect the innocent, and conquer internal and external enemies. The Martian soul came here to fight its most important war.', kn: 'Your soul seeks courage — the ability to act righteously in the face of opposition, protect the innocent, and conquer internal and external enemies. The Martian soul came here to fight its most important war.', gu: 'Your soul seeks courage — the ability to act righteously in the face of opposition, protect the innocent, and conquer internal and external enemies. The Martian soul came here to fight its most important war.' },
    lessons: { en: 'Channel aggression into disciplined, dharmic action. The soul left battles unfinished in past lives — either avoiding conflict when it should have fought, or fighting the wrong wars for wrong reasons. This life demands you learn the difference.', hi: 'आक्रमण को अनुशासित धार्मिक कार्य में बदलें। सही और गलत लड़ाई के बीच अन्तर सीखना आवश्यक है।', sa: 'आक्रमण को अनुशासित धार्मिक कार्य में बदलें। सही और गलत लड़ाई के बीच अन्तर सीखना आवश्यक है।', mai: 'आक्रमण को अनुशासित धार्मिक कार्य में बदलें। सही और गलत लड़ाई के बीच अन्तर सीखना आवश्यक है।', mr: 'आक्रमण को अनुशासित धार्मिक कार्य में बदलें। सही और गलत लड़ाई के बीच अन्तर सीखना आवश्यक है।', ta: 'Channel aggression into disciplined, dharmic action. The soul left battles unfinished in past lives — either avoiding conflict when it should have fought, or fighting the wrong wars for wrong reasons. This life demands you learn the difference.', te: 'Channel aggression into disciplined, dharmic action. The soul left battles unfinished in past lives — either avoiding conflict when it should have fought, or fighting the wrong wars for wrong reasons. This life demands you learn the difference.', bn: 'Channel aggression into disciplined, dharmic action. The soul left battles unfinished in past lives — either avoiding conflict when it should have fought, or fighting the wrong wars for wrong reasons. This life demands you learn the difference.', kn: 'Channel aggression into disciplined, dharmic action. The soul left battles unfinished in past lives — either avoiding conflict when it should have fought, or fighting the wrong wars for wrong reasons. This life demands you learn the difference.', gu: 'Channel aggression into disciplined, dharmic action. The soul left battles unfinished in past lives — either avoiding conflict when it should have fought, or fighting the wrong wars for wrong reasons. This life demands you learn the difference.' },
    shadow: { en: 'Impulsive anger, recklessness, and the addiction to conflict. The Mars AK soul can mistake aggression for strength — fighting for ego\'s pleasure rather than dharma\'s necessity.', hi: 'आवेगशील क्रोध और संघर्ष की लत। मंगल आत्मा आक्रमण को शक्ति समझ सकती है।' },
    karma: { en: 'A warrior soul returning to learn when to draw the sword and when to sheathe it. The karma involves protection and service — guarding, building, or healing. Courage must become compassion.', hi: 'एक योद्धा आत्मा जो सीखने आई है कब तलवार उठानी है। साहस को करुणा बनना है।', sa: 'एक योद्धा आत्मा जो सीखने आई है कब तलवार उठानी है। साहस को करुणा बनना है।', mai: 'एक योद्धा आत्मा जो सीखने आई है कब तलवार उठानी है। साहस को करुणा बनना है।', mr: 'एक योद्धा आत्मा जो सीखने आई है कब तलवार उठानी है। साहस को करुणा बनना है।', ta: 'A warrior soul returning to learn when to draw the sword and when to sheathe it. The karma involves protection and service — guarding, building, or healing. Courage must become compassion.', te: 'A warrior soul returning to learn when to draw the sword and when to sheathe it. The karma involves protection and service — guarding, building, or healing. Courage must become compassion.', bn: 'A warrior soul returning to learn when to draw the sword and when to sheathe it. The karma involves protection and service — guarding, building, or healing. Courage must become compassion.', kn: 'A warrior soul returning to learn when to draw the sword and when to sheathe it. The karma involves protection and service — guarding, building, or healing. Courage must become compassion.', gu: 'A warrior soul returning to learn when to draw the sword and when to sheathe it. The karma involves protection and service — guarding, building, or healing. Courage must become compassion.' },
  },
  Mercury: {
    desire: { en: 'Your soul seeks mastery of the mind — the power to understand, communicate, and transmit knowledge in ways that transform others. It longs to find the words that change the world.', hi: 'आपकी आत्मा मन की महारत चाहती है — ज्ञान को इस प्रकार संप्रेषित करने की शक्ति जो दूसरों को बदल दे।', sa: 'आपकी आत्मा मन की महारत चाहती है — ज्ञान को इस प्रकार संप्रेषित करने की शक्ति जो दूसरों को बदल दे।', mai: 'आपकी आत्मा मन की महारत चाहती है — ज्ञान को इस प्रकार संप्रेषित करने की शक्ति जो दूसरों को बदल दे।', mr: 'आपकी आत्मा मन की महारत चाहती है — ज्ञान को इस प्रकार संप्रेषित करने की शक्ति जो दूसरों को बदल दे।', ta: 'Your soul seeks mastery of the mind — the power to understand, communicate, and transmit knowledge in ways that transform others. It longs to find the words that change the world.', te: 'Your soul seeks mastery of the mind — the power to understand, communicate, and transmit knowledge in ways that transform others. It longs to find the words that change the world.', bn: 'Your soul seeks mastery of the mind — the power to understand, communicate, and transmit knowledge in ways that transform others. It longs to find the words that change the world.', kn: 'Your soul seeks mastery of the mind — the power to understand, communicate, and transmit knowledge in ways that transform others. It longs to find the words that change the world.', gu: 'Your soul seeks mastery of the mind — the power to understand, communicate, and transmit knowledge in ways that transform others. It longs to find the words that change the world.' },
    lessons: { en: 'Depth over breadth. The Mercury AK soul scatters brilliance across too many pursuits and achieves mastery in none. Go deep — study one subject until it reveals its hidden roots, then teach what you have truly understood, not merely memorized.', hi: 'विस्तार से गहराई श्रेयस्कर है। किसी एक विषय में गहरे जाएं, फिर जो वास्तव में समझा है उसे सिखाएं।', sa: 'विस्तार से गहराई श्रेयस्कर है। किसी एक विषय में गहरे जाएं, फिर जो वास्तव में समझा है उसे सिखाएं।', mai: 'विस्तार से गहराई श्रेयस्कर है। किसी एक विषय में गहरे जाएं, फिर जो वास्तव में समझा है उसे सिखाएं।', mr: 'विस्तार से गहराई श्रेयस्कर है। किसी एक विषय में गहरे जाएं, फिर जो वास्तव में समझा है उसे सिखाएं।', ta: 'Depth over breadth. The Mercury AK soul scatters brilliance across too many pursuits and achieves mastery in none. Go deep — study one subject until it reveals its hidden roots, then teach what you have truly understood, not merely memorized.', te: 'Depth over breadth. The Mercury AK soul scatters brilliance across too many pursuits and achieves mastery in none. Go deep — study one subject until it reveals its hidden roots, then teach what you have truly understood, not merely memorized.', bn: 'Depth over breadth. The Mercury AK soul scatters brilliance across too many pursuits and achieves mastery in none. Go deep — study one subject until it reveals its hidden roots, then teach what you have truly understood, not merely memorized.', kn: 'Depth over breadth. The Mercury AK soul scatters brilliance across too many pursuits and achieves mastery in none. Go deep — study one subject until it reveals its hidden roots, then teach what you have truly understood, not merely memorized.', gu: 'Depth over breadth. The Mercury AK soul scatters brilliance across too many pursuits and achieves mastery in none. Go deep — study one subject until it reveals its hidden roots, then teach what you have truly understood, not merely memorized.' },
    shadow: { en: 'Superficiality, cleverness masquerading as wisdom, intellectual arrogance, and the manipulation of truth through words. The mercurial soul can become a sophist rather than a sage.', hi: 'सतहीपन और शब्दों के माध्यम से सत्य का हेरफेर। बुध आत्मा ज्ञानी नहीं बल्कि वाग्मी बन सकती है।', sa: 'सतहीपन और शब्दों के माध्यम से सत्य का हेरफेर। बुध आत्मा ज्ञानी नहीं बल्कि वाग्मी बन सकती है।', mai: 'सतहीपन और शब्दों के माध्यम से सत्य का हेरफेर। बुध आत्मा ज्ञानी नहीं बल्कि वाग्मी बन सकती है।', mr: 'सतहीपन और शब्दों के माध्यम से सत्य का हेरफेर। बुध आत्मा ज्ञानी नहीं बल्कि वाग्मी बन सकती है।', ta: 'Superficiality, cleverness masquerading as wisdom, intellectual arrogance, and the manipulation of truth through words. The mercurial soul can become a sophist rather than a sage.', te: 'Superficiality, cleverness masquerading as wisdom, intellectual arrogance, and the manipulation of truth through words. The mercurial soul can become a sophist rather than a sage.', bn: 'Superficiality, cleverness masquerading as wisdom, intellectual arrogance, and the manipulation of truth through words. The mercurial soul can become a sophist rather than a sage.', kn: 'Superficiality, cleverness masquerading as wisdom, intellectual arrogance, and the manipulation of truth through words. The mercurial soul can become a sophist rather than a sage.', gu: 'Superficiality, cleverness masquerading as wisdom, intellectual arrogance, and the manipulation of truth through words. The mercurial soul can become a sophist rather than a sage.' },
    karma: { en: 'A learner across many lifetimes who collected knowledge without integration. This life calls for synthesis — gathering all you have learned into a coherent teaching and sharing it generously. The pen, the voice, or the code is your tool of karma.', hi: 'कई जन्मों में ज्ञान बिना एकीकरण के एकत्र किया। इस जीवन में उसका संश्लेषण और उदारता से साझा करना ही कर्म है।', sa: 'कई जन्मों में ज्ञान बिना एकीकरण के एकत्र किया। इस जीवन में उसका संश्लेषण और उदारता से साझा करना ही कर्म है।', mai: 'कई जन्मों में ज्ञान बिना एकीकरण के एकत्र किया। इस जीवन में उसका संश्लेषण और उदारता से साझा करना ही कर्म है।', mr: 'कई जन्मों में ज्ञान बिना एकीकरण के एकत्र किया। इस जीवन में उसका संश्लेषण और उदारता से साझा करना ही कर्म है।', ta: 'A learner across many lifetimes who collected knowledge without integration. This life calls for synthesis — gathering all you have learned into a coherent teaching and sharing it generously. The pen, the voice, or the code is your tool of karma.', te: 'A learner across many lifetimes who collected knowledge without integration. This life calls for synthesis — gathering all you have learned into a coherent teaching and sharing it generously. The pen, the voice, or the code is your tool of karma.', bn: 'A learner across many lifetimes who collected knowledge without integration. This life calls for synthesis — gathering all you have learned into a coherent teaching and sharing it generously. The pen, the voice, or the code is your tool of karma.', kn: 'A learner across many lifetimes who collected knowledge without integration. This life calls for synthesis — gathering all you have learned into a coherent teaching and sharing it generously. The pen, the voice, or the code is your tool of karma.', gu: 'A learner across many lifetimes who collected knowledge without integration. This life calls for synthesis — gathering all you have learned into a coherent teaching and sharing it generously. The pen, the voice, or the code is your tool of karma.' },
  },
  Jupiter: {
    desire: { en: 'Your soul seeks wisdom — not merely knowledge — and the role of guide, teacher, or guru to those who are lost. Jupiter as Atmakaraka is the most dharmic placement: the soul came here to uphold truth and expand others\' horizons.', hi: 'आपकी आत्मा ज्ञान — केवल जानकारी नहीं — और मार्गदर्शक, शिक्षक या गुरु की भूमिका चाहती है। गुरु आत्मकारक सबसे धार्मिक स्थान है।' },
    lessons: { en: 'Distinguish between preaching and truly guiding. The Jupiter AK soul can confuse accumulating students with achieving wisdom. Real dharma is not proclaimed — it is lived. The lesson is humility: the real guru knows how much they don\'t know. Righteousness must never become self-righteousness.', hi: 'उपदेश देने और वास्तव में मार्गदर्शन करने में अन्तर करें। वास्तविक गुरु जानता है कि वह कितना नहीं जानता।' },
    shadow: { en: 'Spiritual pride, dogmatism, over-expansion, and inflating the ego through "teaching." The Jupiter AK soul\'s greatest trap is believing they have arrived — when the path is still long.', hi: 'आध्यात्मिक अहंकार और कट्टरता। गुरु आत्मकारक का सबसे बड़ा जाल यह विश्वास है कि वे पहुँच गए हैं।' },
    karma: { en: 'This soul was a seeker in past lives who gained wisdom but kept it for themselves, or used it improperly. The karma is to become a true Brahmin in the original sense — one who radiates dharma through their very being. You are meant to be a light that other lights come to rekindle themselves from.', hi: 'पूर्व जन्मों में ज्ञान प्राप्त किया पर अपने पास रखा। कर्म है सच्चा ब्राह्मण बनना — जो अपने अस्तित्व से धर्म विकीर्ण करे।', sa: 'पूर्व जन्मों में ज्ञान प्राप्त किया पर अपने पास रखा। कर्म है सच्चा ब्राह्मण बनना — जो अपने अस्तित्व से धर्म विकीर्ण करे।', mai: 'पूर्व जन्मों में ज्ञान प्राप्त किया पर अपने पास रखा। कर्म है सच्चा ब्राह्मण बनना — जो अपने अस्तित्व से धर्म विकीर्ण करे।', mr: 'पूर्व जन्मों में ज्ञान प्राप्त किया पर अपने पास रखा। कर्म है सच्चा ब्राह्मण बनना — जो अपने अस्तित्व से धर्म विकीर्ण करे।', ta: 'This soul was a seeker in past lives who gained wisdom but kept it for themselves, or used it improperly. The karma is to become a true Brahmin in the original sense — one who radiates dharma through their very being. You are meant to be a light that other lights come to rekindle themselves from.', te: 'This soul was a seeker in past lives who gained wisdom but kept it for themselves, or used it improperly. The karma is to become a true Brahmin in the original sense — one who radiates dharma through their very being. You are meant to be a light that other lights come to rekindle themselves from.', bn: 'This soul was a seeker in past lives who gained wisdom but kept it for themselves, or used it improperly. The karma is to become a true Brahmin in the original sense — one who radiates dharma through their very being. You are meant to be a light that other lights come to rekindle themselves from.', kn: 'This soul was a seeker in past lives who gained wisdom but kept it for themselves, or used it improperly. The karma is to become a true Brahmin in the original sense — one who radiates dharma through their very being. You are meant to be a light that other lights come to rekindle themselves from.', gu: 'This soul was a seeker in past lives who gained wisdom but kept it for themselves, or used it improperly. The karma is to become a true Brahmin in the original sense — one who radiates dharma through their very being. You are meant to be a light that other lights come to rekindle themselves from.' },
  },
  Venus: {
    desire: { en: 'Your soul seeks beauty, love, and profound connection — the experience of the divine through aesthetics, relationship, and the senses. It came here to create and to love, not merely to be loved.', hi: 'आपकी आत्मा सौन्दर्य, प्रेम और गहरे सम्बन्ध — सौन्दर्यशास्त्र और इन्द्रियों के माध्यम से दिव्यता का अनुभव — चाहती है।', sa: 'आपकी आत्मा सौन्दर्य, प्रेम और गहरे सम्बन्ध — सौन्दर्यशास्त्र और इन्द्रियों के माध्यम से दिव्यता का अनुभव — चाहती है।', mai: 'आपकी आत्मा सौन्दर्य, प्रेम और गहरे सम्बन्ध — सौन्दर्यशास्त्र और इन्द्रियों के माध्यम से दिव्यता का अनुभव — चाहती है।', mr: 'आपकी आत्मा सौन्दर्य, प्रेम और गहरे सम्बन्ध — सौन्दर्यशास्त्र और इन्द्रियों के माध्यम से दिव्यता का अनुभव — चाहती है।', ta: 'Your soul seeks beauty, love, and profound connection — the experience of the divine through aesthetics, relationship, and the senses. It came here to create and to love, not merely to be loved.', te: 'Your soul seeks beauty, love, and profound connection — the experience of the divine through aesthetics, relationship, and the senses. It came here to create and to love, not merely to be loved.', bn: 'Your soul seeks beauty, love, and profound connection — the experience of the divine through aesthetics, relationship, and the senses. It came here to create and to love, not merely to be loved.', kn: 'Your soul seeks beauty, love, and profound connection — the experience of the divine through aesthetics, relationship, and the senses. It came here to create and to love, not merely to be loved.', gu: 'Your soul seeks beauty, love, and profound connection — the experience of the divine through aesthetics, relationship, and the senses. It came here to create and to love, not merely to be loved.' },
    lessons: { en: 'Love without attachment and create without craving recognition. The Venus AK soul must learn that real beauty is discovered, not manufactured, and real love is unconditional, not transactional. The spiritual test is to move from Venusian pleasure to Venusian grace.', hi: 'आसक्ति के बिना प्रेम करें। वास्तविक सौन्दर्य खोजा जाता है, निर्मित नहीं। शुक्र के आनन्द से शुक्र की कृपा की ओर बढ़ें।', sa: 'आसक्ति के बिना प्रेम करें। वास्तविक सौन्दर्य खोजा जाता है, निर्मित नहीं। शुक्र के आनन्द से शुक्र की कृपा की ओर बढ़ें।', mai: 'आसक्ति के बिना प्रेम करें। वास्तविक सौन्दर्य खोजा जाता है, निर्मित नहीं। शुक्र के आनन्द से शुक्र की कृपा की ओर बढ़ें।', mr: 'आसक्ति के बिना प्रेम करें। वास्तविक सौन्दर्य खोजा जाता है, निर्मित नहीं। शुक्र के आनन्द से शुक्र की कृपा की ओर बढ़ें।', ta: 'Love without attachment and create without craving recognition. The Venus AK soul must learn that real beauty is discovered, not manufactured, and real love is unconditional, not transactional. The spiritual test is to move from Venusian pleasure to Venusian grace.', te: 'Love without attachment and create without craving recognition. The Venus AK soul must learn that real beauty is discovered, not manufactured, and real love is unconditional, not transactional. The spiritual test is to move from Venusian pleasure to Venusian grace.', bn: 'Love without attachment and create without craving recognition. The Venus AK soul must learn that real beauty is discovered, not manufactured, and real love is unconditional, not transactional. The spiritual test is to move from Venusian pleasure to Venusian grace.', kn: 'Love without attachment and create without craving recognition. The Venus AK soul must learn that real beauty is discovered, not manufactured, and real love is unconditional, not transactional. The spiritual test is to move from Venusian pleasure to Venusian grace.', gu: 'Love without attachment and create without craving recognition. The Venus AK soul must learn that real beauty is discovered, not manufactured, and real love is unconditional, not transactional. The spiritual test is to move from Venusian pleasure to Venusian grace.' },
    shadow: { en: 'Vanity, attachment to comfort and luxury, fear of ugliness and pain, codependency, and the use of beauty or charm for manipulation.', hi: 'घमंड, विलासिता से आसक्ति, कुरूपता का भय, सहनिर्भरता और आकर्षण का हेरफेर के लिए उपयोग।', sa: 'घमंड, विलासिता से आसक्ति, कुरूपता का भय, सहनिर्भरता और आकर्षण का हेरफेर के लिए उपयोग।', mai: 'घमंड, विलासिता से आसक्ति, कुरूपता का भय, सहनिर्भरता और आकर्षण का हेरफेर के लिए उपयोग।', mr: 'घमंड, विलासिता से आसक्ति, कुरूपता का भय, सहनिर्भरता और आकर्षण का हेरफेर के लिए उपयोग।', ta: 'Vanity, attachment to comfort and luxury, fear of ugliness and pain, codependency, and the use of beauty or charm for manipulation.', te: 'Vanity, attachment to comfort and luxury, fear of ugliness and pain, codependency, and the use of beauty or charm for manipulation.', bn: 'Vanity, attachment to comfort and luxury, fear of ugliness and pain, codependency, and the use of beauty or charm for manipulation.', kn: 'Vanity, attachment to comfort and luxury, fear of ugliness and pain, codependency, and the use of beauty or charm for manipulation.', gu: 'Vanity, attachment to comfort and luxury, fear of ugliness and pain, codependency, and the use of beauty or charm for manipulation.' },
    karma: { en: 'A soul that has moved through many relationships seeking completion in another. The karma is the recognition that beauty is not found in another person — it is found within. This life calls for the creation of art, beauty, or relationship structures that outlast you.', hi: 'एक आत्मा जो पूर्णता की खोज में कई सम्बन्धों से गुज़री है। कर्म है यह जानना कि सौन्दर्य स्वयं के भीतर है।', sa: 'एक आत्मा जो पूर्णता की खोज में कई सम्बन्धों से गुज़री है। कर्म है यह जानना कि सौन्दर्य स्वयं के भीतर है।', mai: 'एक आत्मा जो पूर्णता की खोज में कई सम्बन्धों से गुज़री है। कर्म है यह जानना कि सौन्दर्य स्वयं के भीतर है।', mr: 'एक आत्मा जो पूर्णता की खोज में कई सम्बन्धों से गुज़री है। कर्म है यह जानना कि सौन्दर्य स्वयं के भीतर है।', ta: 'A soul that has moved through many relationships seeking completion in another. The karma is the recognition that beauty is not found in another person — it is found within. This life calls for the creation of art, beauty, or relationship structures that outlast you.', te: 'A soul that has moved through many relationships seeking completion in another. The karma is the recognition that beauty is not found in another person — it is found within. This life calls for the creation of art, beauty, or relationship structures that outlast you.', bn: 'A soul that has moved through many relationships seeking completion in another. The karma is the recognition that beauty is not found in another person — it is found within. This life calls for the creation of art, beauty, or relationship structures that outlast you.', kn: 'A soul that has moved through many relationships seeking completion in another. The karma is the recognition that beauty is not found in another person — it is found within. This life calls for the creation of art, beauty, or relationship structures that outlast you.', gu: 'A soul that has moved through many relationships seeking completion in another. The karma is the recognition that beauty is not found in another person — it is found within. This life calls for the creation of art, beauty, or relationship structures that outlast you.' },
  },
  Saturn: {
    desire: { en: 'Your soul seeks justice, lasting achievement, and the fulfillment of karmic debt through disciplined service. The Saturn soul came here to master time — to build things that endure and serve causes greater than the self.', hi: 'आपकी आत्मा न्याय, स्थायी उपलब्धि और अनुशासित सेवा से कार्मिक ऋण की पूर्ति चाहती है।', sa: 'आपकी आत्मा न्याय, स्थायी उपलब्धि और अनुशासित सेवा से कार्मिक ऋण की पूर्ति चाहती है।', mai: 'आपकी आत्मा न्याय, स्थायी उपलब्धि और अनुशासित सेवा से कार्मिक ऋण की पूर्ति चाहती है।', mr: 'आपकी आत्मा न्याय, स्थायी उपलब्धि और अनुशासित सेवा से कार्मिक ऋण की पूर्ति चाहती है।', ta: 'Your soul seeks justice, lasting achievement, and the fulfillment of karmic debt through disciplined service. The Saturn soul came here to master time — to build things that endure and serve causes greater than the self.', te: 'Your soul seeks justice, lasting achievement, and the fulfillment of karmic debt through disciplined service. The Saturn soul came here to master time — to build things that endure and serve causes greater than the self.', bn: 'Your soul seeks justice, lasting achievement, and the fulfillment of karmic debt through disciplined service. The Saturn soul came here to master time — to build things that endure and serve causes greater than the self.', kn: 'Your soul seeks justice, lasting achievement, and the fulfillment of karmic debt through disciplined service. The Saturn soul came here to master time — to build things that endure and serve causes greater than the self.', gu: 'Your soul seeks justice, lasting achievement, and the fulfillment of karmic debt through disciplined service. The Saturn soul came here to master time — to build things that endure and serve causes greater than the self.' },
    lessons: { en: 'Embrace limitation as a teacher, not an enemy. Discipline is a spiritual practice, suffering can be alchemized into strength, and serving the margins of society — the old, the poor, the forgotten — is a high dharma.', hi: 'सीमा को शत्रु नहीं, गुरु मानें। अनुशासन आध्यात्मिक अभ्यास है। समाज के हाशिये पर सेवा उच्च धर्म है।', sa: 'सीमा को शत्रु नहीं, गुरु मानें। अनुशासन आध्यात्मिक अभ्यास है। समाज के हाशिये पर सेवा उच्च धर्म है।', mai: 'सीमा को शत्रु नहीं, गुरु मानें। अनुशासन आध्यात्मिक अभ्यास है। समाज के हाशिये पर सेवा उच्च धर्म है।', mr: 'सीमा को शत्रु नहीं, गुरु मानें। अनुशासन आध्यात्मिक अभ्यास है। समाज के हाशिये पर सेवा उच्च धर्म है।', ta: 'Embrace limitation as a teacher, not an enemy. Discipline is a spiritual practice, suffering can be alchemized into strength, and serving the margins of society — the old, the poor, the forgotten — is a high dharma.', te: 'Embrace limitation as a teacher, not an enemy. Discipline is a spiritual practice, suffering can be alchemized into strength, and serving the margins of society — the old, the poor, the forgotten — is a high dharma.', bn: 'Embrace limitation as a teacher, not an enemy. Discipline is a spiritual practice, suffering can be alchemized into strength, and serving the margins of society — the old, the poor, the forgotten — is a high dharma.', kn: 'Embrace limitation as a teacher, not an enemy. Discipline is a spiritual practice, suffering can be alchemized into strength, and serving the margins of society — the old, the poor, the forgotten — is a high dharma.', gu: 'Embrace limitation as a teacher, not an enemy. Discipline is a spiritual practice, suffering can be alchemized into strength, and serving the margins of society — the old, the poor, the forgotten — is a high dharma.' },
    shadow: { en: 'Pessimism, harsh self-judgment, excessive austerity, bitterness toward life, and the belief that suffering is the only teacher. The Saturn soul risks becoming so disciplined it forgets how to live.', hi: 'निराशावाद, कठोर आत्म-निर्णय और जीवन के प्रति कड़वाहट। शनि आत्मा इतनी अनुशासित हो सकती है कि जीना भूल जाए।', sa: 'निराशावाद, कठोर आत्म-निर्णय और जीवन के प्रति कड़वाहट। शनि आत्मा इतनी अनुशासित हो सकती है कि जीना भूल जाए।', mai: 'निराशावाद, कठोर आत्म-निर्णय और जीवन के प्रति कड़वाहट। शनि आत्मा इतनी अनुशासित हो सकती है कि जीना भूल जाए।', mr: 'निराशावाद, कठोर आत्म-निर्णय और जीवन के प्रति कड़वाहट। शनि आत्मा इतनी अनुशासित हो सकती है कि जीना भूल जाए।', ta: 'Pessimism, harsh self-judgment, excessive austerity, bitterness toward life, and the belief that suffering is the only teacher. The Saturn soul risks becoming so disciplined it forgets how to live.', te: 'Pessimism, harsh self-judgment, excessive austerity, bitterness toward life, and the belief that suffering is the only teacher. The Saturn soul risks becoming so disciplined it forgets how to live.', bn: 'Pessimism, harsh self-judgment, excessive austerity, bitterness toward life, and the belief that suffering is the only teacher. The Saturn soul risks becoming so disciplined it forgets how to live.', kn: 'Pessimism, harsh self-judgment, excessive austerity, bitterness toward life, and the belief that suffering is the only teacher. The Saturn soul risks becoming so disciplined it forgets how to live.', gu: 'Pessimism, harsh self-judgment, excessive austerity, bitterness toward life, and the belief that suffering is the only teacher. The Saturn soul risks becoming so disciplined it forgets how to live.' },
    karma: { en: 'This soul carries heavy karmic loads — debts of neglect, exploitation of workers, or the abuse of authority. The mission is karmic rectification: serve those you once ignored, and build structures of justice that protect others long after you are gone.', hi: 'इस आत्मा पर भारी कार्मिक बोझ है। मिशन है कार्मिक सुधार और न्याय की ऐसी संरचनाएं बनाना जो आपके बाद भी दूसरों की रक्षा करें।', sa: 'इस आत्मा पर भारी कार्मिक बोझ है। मिशन है कार्मिक सुधार और न्याय की ऐसी संरचनाएं बनाना जो आपके बाद भी दूसरों की रक्षा करें।', mai: 'इस आत्मा पर भारी कार्मिक बोझ है। मिशन है कार्मिक सुधार और न्याय की ऐसी संरचनाएं बनाना जो आपके बाद भी दूसरों की रक्षा करें।', mr: 'इस आत्मा पर भारी कार्मिक बोझ है। मिशन है कार्मिक सुधार और न्याय की ऐसी संरचनाएं बनाना जो आपके बाद भी दूसरों की रक्षा करें।', ta: 'This soul carries heavy karmic loads — debts of neglect, exploitation of workers, or the abuse of authority. The mission is karmic rectification: serve those you once ignored, and build structures of justice that protect others long after you are gone.', te: 'This soul carries heavy karmic loads — debts of neglect, exploitation of workers, or the abuse of authority. The mission is karmic rectification: serve those you once ignored, and build structures of justice that protect others long after you are gone.', bn: 'This soul carries heavy karmic loads — debts of neglect, exploitation of workers, or the abuse of authority. The mission is karmic rectification: serve those you once ignored, and build structures of justice that protect others long after you are gone.', kn: 'This soul carries heavy karmic loads — debts of neglect, exploitation of workers, or the abuse of authority. The mission is karmic rectification: serve those you once ignored, and build structures of justice that protect others long after you are gone.', gu: 'This soul carries heavy karmic loads — debts of neglect, exploitation of workers, or the abuse of authority. The mission is karmic rectification: serve those you once ignored, and build structures of justice that protect others long after you are gone.' },
  },
};

interface AMKTheme { fields: LocaleText; style: LocaleText; }
const AMK_THEMES: Record<string, AMKTheme> = {
  Sun:     { fields: { en: 'Government, administration, politics, corporate leadership, film/media, or any role requiring authority and public visibility.', hi: 'सरकार, प्रशासन, राजनीति, कॉर्पोरेट नेतृत्व, फिल्म/मीडिया, या अधिकार और सार्वजनिक दृश्यता वाली भूमिका।', sa: 'सरकार, प्रशासन, राजनीति, कॉर्पोरेट नेतृत्व, फिल्म/मीडिया, या अधिकार और सार्वजनिक दृश्यता वाली भूमिका।', mai: 'सरकार, प्रशासन, राजनीति, कॉर्पोरेट नेतृत्व, फिल्म/मीडिया, या अधिकार और सार्वजनिक दृश्यता वाली भूमिका।', mr: 'सरकार, प्रशासन, राजनीति, कॉर्पोरेट नेतृत्व, फिल्म/मीडिया, या अधिकार और सार्वजनिक दृश्यता वाली भूमिका।', ta: 'Government, administration, politics, corporate leadership, film/media, or any role requiring authority and public visibility.', te: 'Government, administration, politics, corporate leadership, film/media, or any role requiring authority and public visibility.', bn: 'Government, administration, politics, corporate leadership, film/media, or any role requiring authority and public visibility.', kn: 'Government, administration, politics, corporate leadership, film/media, or any role requiring authority and public visibility.', gu: 'Government, administration, politics, corporate leadership, film/media, or any role requiring authority and public visibility.' }, style: { en: 'You work best in leadership roles where your name and identity are on the line. Solar AMK people rarely thrive as anonymous contributors — they need a stage and the satisfaction of being the one who leads.', hi: 'आप नेतृत्व भूमिकाओं में सर्वश्रेष्ठ कार्य करते हैं जहाँ आपकी पहचान दाँव पर हो।', sa: 'आप नेतृत्व भूमिकाओं में सर्वश्रेष्ठ कार्य करते हैं जहाँ आपकी पहचान दाँव पर हो।', mai: 'आप नेतृत्व भूमिकाओं में सर्वश्रेष्ठ कार्य करते हैं जहाँ आपकी पहचान दाँव पर हो।', mr: 'आप नेतृत्व भूमिकाओं में सर्वश्रेष्ठ कार्य करते हैं जहाँ आपकी पहचान दाँव पर हो।', ta: 'You work best in leadership roles where your name and identity are on the line. Solar AMK people rarely thrive as anonymous contributors — they need a stage and the satisfaction of being the one who leads.', te: 'You work best in leadership roles where your name and identity are on the line. Solar AMK people rarely thrive as anonymous contributors — they need a stage and the satisfaction of being the one who leads.', bn: 'You work best in leadership roles where your name and identity are on the line. Solar AMK people rarely thrive as anonymous contributors — they need a stage and the satisfaction of being the one who leads.', kn: 'You work best in leadership roles where your name and identity are on the line. Solar AMK people rarely thrive as anonymous contributors — they need a stage and the satisfaction of being the one who leads.', gu: 'You work best in leadership roles where your name and identity are on the line. Solar AMK people rarely thrive as anonymous contributors — they need a stage and the satisfaction of being the one who leads.' } },
  Moon:    { fields: { en: 'Healthcare, psychology, food, hospitality, public relations, education, caregiving, or any profession serving human comfort and emotional needs.', hi: 'स्वास्थ्य सेवा, मनोविज्ञान, भोजन, आतिथ्य, जनसम्पर्क, शिक्षा, देखभाल।', sa: 'स्वास्थ्य सेवा, मनोविज्ञान, भोजन, आतिथ्य, जनसम्पर्क, शिक्षा, देखभाल।', mai: 'स्वास्थ्य सेवा, मनोविज्ञान, भोजन, आतिथ्य, जनसम्पर्क, शिक्षा, देखभाल।', mr: 'स्वास्थ्य सेवा, मनोविज्ञान, भोजन, आतिथ्य, जनसम्पर्क, शिक्षा, देखभाल।', ta: 'Healthcare, psychology, food, hospitality, public relations, education, caregiving, or any profession serving human comfort and emotional needs.', te: 'Healthcare, psychology, food, hospitality, public relations, education, caregiving, or any profession serving human comfort and emotional needs.', bn: 'Healthcare, psychology, food, hospitality, public relations, education, caregiving, or any profession serving human comfort and emotional needs.', kn: 'Healthcare, psychology, food, hospitality, public relations, education, caregiving, or any profession serving human comfort and emotional needs.', gu: 'Healthcare, psychology, food, hospitality, public relations, education, caregiving, or any profession serving human comfort and emotional needs.' }, style: { en: 'Career success comes through empathy and public trust. You are most effective when working with people\'s innermost needs. Success often involves the public or masses in some way — your reputation is your professional currency.', hi: 'सहानुभूति और जनविश्वास के माध्यम से सफलता। आप लोगों की सबसे गहरी जरूरतों के साथ काम करने में सबसे प्रभावी हैं।' } },
  Mars:    { fields: { en: 'Military, police, surgery, engineering, real estate, construction, competitive sports, entrepreneurship, or any field demanding physical action and decisive risk-taking.', hi: 'सेना, पुलिस, शल्य चिकित्सा, इंजीनियरिंग, अचल सम्पत्ति, निर्माण, प्रतिस्पर्धी खेल, उद्यमिता।', sa: 'सेना, पुलिस, शल्य चिकित्सा, इंजीनियरिंग, अचल सम्पत्ति, निर्माण, प्रतिस्पर्धी खेल, उद्यमिता।', mai: 'सेना, पुलिस, शल्य चिकित्सा, इंजीनियरिंग, अचल सम्पत्ति, निर्माण, प्रतिस्पर्धी खेल, उद्यमिता।', mr: 'सेना, पुलिस, शल्य चिकित्सा, इंजीनियरिंग, अचल सम्पत्ति, निर्माण, प्रतिस्पर्धी खेल, उद्यमिता।', ta: 'Military, police, surgery, engineering, real estate, construction, competitive sports, entrepreneurship, or any field demanding physical action and decisive risk-taking.', te: 'Military, police, surgery, engineering, real estate, construction, competitive sports, entrepreneurship, or any field demanding physical action and decisive risk-taking.', bn: 'Military, police, surgery, engineering, real estate, construction, competitive sports, entrepreneurship, or any field demanding physical action and decisive risk-taking.', kn: 'Military, police, surgery, engineering, real estate, construction, competitive sports, entrepreneurship, or any field demanding physical action and decisive risk-taking.', gu: 'Military, police, surgery, engineering, real estate, construction, competitive sports, entrepreneurship, or any field demanding physical action and decisive risk-taking.' }, style: { en: 'You are built to initiate, compete, and conquer. Career should involve tangible results and the satisfaction of winning. Desk work without stakes depletes you — you need a field where something real is on the line.', hi: 'आप शुरुआत करने, प्रतिस्पर्धा और जीतने के लिए बने हैं। ठोस परिणाम और वास्तविक दाँव आपको ऊर्जावान बनाते हैं।', sa: 'आप शुरुआत करने, प्रतिस्पर्धा और जीतने के लिए बने हैं। ठोस परिणाम और वास्तविक दाँव आपको ऊर्जावान बनाते हैं।', mai: 'आप शुरुआत करने, प्रतिस्पर्धा और जीतने के लिए बने हैं। ठोस परिणाम और वास्तविक दाँव आपको ऊर्जावान बनाते हैं।', mr: 'आप शुरुआत करने, प्रतिस्पर्धा और जीतने के लिए बने हैं। ठोस परिणाम और वास्तविक दाँव आपको ऊर्जावान बनाते हैं।', ta: 'You are built to initiate, compete, and conquer. Career should involve tangible results and the satisfaction of winning. Desk work without stakes depletes you — you need a field where something real is on the line.', te: 'You are built to initiate, compete, and conquer. Career should involve tangible results and the satisfaction of winning. Desk work without stakes depletes you — you need a field where something real is on the line.', bn: 'You are built to initiate, compete, and conquer. Career should involve tangible results and the satisfaction of winning. Desk work without stakes depletes you — you need a field where something real is on the line.', kn: 'You are built to initiate, compete, and conquer. Career should involve tangible results and the satisfaction of winning. Desk work without stakes depletes you — you need a field where something real is on the line.', gu: 'You are built to initiate, compete, and conquer. Career should involve tangible results and the satisfaction of winning. Desk work without stakes depletes you — you need a field where something real is on the line.' } },
  Mercury: { fields: { en: 'Writing, journalism, IT, software, finance, trading, teaching, law, consulting, research, or any profession centred on information, analysis, and the intellect.', hi: 'लेखन, पत्रकारिता, आईटी, सॉफ्टवेयर, वित्त, व्यापार, शिक्षण, कानून, परामर्श, शोध।', sa: 'लेखन, पत्रकारिता, आईटी, सॉफ्टवेयर, वित्त, व्यापार, शिक्षण, कानून, परामर्श, शोध।', mai: 'लेखन, पत्रकारिता, आईटी, सॉफ्टवेयर, वित्त, व्यापार, शिक्षण, कानून, परामर्श, शोध।', mr: 'लेखन, पत्रकारिता, आईटी, सॉफ्टवेयर, वित्त, व्यापार, शिक्षण, कानून, परामर्श, शोध।', ta: 'Writing, journalism, IT, software, finance, trading, teaching, law, consulting, research, or any profession centred on information, analysis, and the intellect.', te: 'Writing, journalism, IT, software, finance, trading, teaching, law, consulting, research, or any profession centred on information, analysis, and the intellect.', bn: 'Writing, journalism, IT, software, finance, trading, teaching, law, consulting, research, or any profession centred on information, analysis, and the intellect.', kn: 'Writing, journalism, IT, software, finance, trading, teaching, law, consulting, research, or any profession centred on information, analysis, and the intellect.', gu: 'Writing, journalism, IT, software, finance, trading, teaching, law, consulting, research, or any profession centred on information, analysis, and the intellect.' }, style: { en: 'You succeed through intelligence and communication. Multiple skills and simultaneous ventures are natural. The mind is your greatest professional asset — keep it fed, challenged, and well-expressed. Monotonous work is poison.', hi: 'बुद्धि और संवाद के माध्यम से सफलता। मन आपकी सबसे बड़ी व्यावसायिक सम्पत्ति है — उसे पोषित और चुनौतीपूर्ण बनाए रखें।', sa: 'बुद्धि और संवाद के माध्यम से सफलता। मन आपकी सबसे बड़ी व्यावसायिक सम्पत्ति है — उसे पोषित और चुनौतीपूर्ण बनाए रखें।', mai: 'बुद्धि और संवाद के माध्यम से सफलता। मन आपकी सबसे बड़ी व्यावसायिक सम्पत्ति है — उसे पोषित और चुनौतीपूर्ण बनाए रखें।', mr: 'बुद्धि और संवाद के माध्यम से सफलता। मन आपकी सबसे बड़ी व्यावसायिक सम्पत्ति है — उसे पोषित और चुनौतीपूर्ण बनाए रखें।', ta: 'You succeed through intelligence and communication. Multiple skills and simultaneous ventures are natural. The mind is your greatest professional asset — keep it fed, challenged, and well-expressed. Monotonous work is poison.', te: 'You succeed through intelligence and communication. Multiple skills and simultaneous ventures are natural. The mind is your greatest professional asset — keep it fed, challenged, and well-expressed. Monotonous work is poison.', bn: 'You succeed through intelligence and communication. Multiple skills and simultaneous ventures are natural. The mind is your greatest professional asset — keep it fed, challenged, and well-expressed. Monotonous work is poison.', kn: 'You succeed through intelligence and communication. Multiple skills and simultaneous ventures are natural. The mind is your greatest professional asset — keep it fed, challenged, and well-expressed. Monotonous work is poison.', gu: 'You succeed through intelligence and communication. Multiple skills and simultaneous ventures are natural. The mind is your greatest professional asset — keep it fed, challenged, and well-expressed. Monotonous work is poison.' } },
  Jupiter: { fields: { en: 'Teaching, law, judiciary, counseling, astrology, philosophy, publishing, priesthood, or any role requiring wisdom, ethical guidance, and the expansion of others\' understanding.', hi: 'शिक्षण, कानून, न्यायपालिका, परामर्श, ज्योतिष, दर्शन, प्रकाशन, पुरोहित।' }, style: { en: 'Your greatest professional tool is trust and wisdom. People come to you not for services but for guidance. Career thrives when you embrace the role of mentor — the one who expands others, not just informs them. Over-extending into too many roles dilutes your power.', hi: 'आपका सबसे बड़ा उपकरण विश्वास और ज्ञान है। करियर तब फलता-फूलता है जब आप संरक्षक की भूमिका अपनाते हैं।', sa: 'आपका सबसे बड़ा उपकरण विश्वास और ज्ञान है। करियर तब फलता-फूलता है जब आप संरक्षक की भूमिका अपनाते हैं।', mai: 'आपका सबसे बड़ा उपकरण विश्वास और ज्ञान है। करियर तब फलता-फूलता है जब आप संरक्षक की भूमिका अपनाते हैं।', mr: 'आपका सबसे बड़ा उपकरण विश्वास और ज्ञान है। करियर तब फलता-फूलता है जब आप संरक्षक की भूमिका अपनाते हैं।', ta: 'Your greatest professional tool is trust and wisdom. People come to you not for services but for guidance. Career thrives when you embrace the role of mentor — the one who expands others, not just informs them. Over-extending into too many roles dilutes your power.', te: 'Your greatest professional tool is trust and wisdom. People come to you not for services but for guidance. Career thrives when you embrace the role of mentor — the one who expands others, not just informs them. Over-extending into too many roles dilutes your power.', bn: 'Your greatest professional tool is trust and wisdom. People come to you not for services but for guidance. Career thrives when you embrace the role of mentor — the one who expands others, not just informs them. Over-extending into too many roles dilutes your power.', kn: 'Your greatest professional tool is trust and wisdom. People come to you not for services but for guidance. Career thrives when you embrace the role of mentor — the one who expands others, not just informs them. Over-extending into too many roles dilutes your power.', gu: 'Your greatest professional tool is trust and wisdom. People come to you not for services but for guidance. Career thrives when you embrace the role of mentor — the one who expands others, not just informs them. Over-extending into too many roles dilutes your power.' } },
  Venus:   { fields: { en: 'Fine arts, music, cinema, fashion, luxury goods, hospitality, interior design, beauty, diplomacy, or any profession requiring aesthetic sense and refined taste.', hi: 'ललित कला, संगीत, सिनेमा, फैशन, विलासिता, आतिथ्य, आन्तरिक सज्जा, सौन्दर्य उद्योग, कूटनीति।', sa: 'ललित कला, संगीत, सिनेमा, फैशन, विलासिता, आतिथ्य, आन्तरिक सज्जा, सौन्दर्य उद्योग, कूटनीति।', mai: 'ललित कला, संगीत, सिनेमा, फैशन, विलासिता, आतिथ्य, आन्तरिक सज्जा, सौन्दर्य उद्योग, कूटनीति।', mr: 'ललित कला, संगीत, सिनेमा, फैशन, विलासिता, आतिथ्य, आन्तरिक सज्जा, सौन्दर्य उद्योग, कूटनीति।', ta: 'Fine arts, music, cinema, fashion, luxury goods, hospitality, interior design, beauty, diplomacy, or any profession requiring aesthetic sense and refined taste.', te: 'Fine arts, music, cinema, fashion, luxury goods, hospitality, interior design, beauty, diplomacy, or any profession requiring aesthetic sense and refined taste.', bn: 'Fine arts, music, cinema, fashion, luxury goods, hospitality, interior design, beauty, diplomacy, or any profession requiring aesthetic sense and refined taste.', kn: 'Fine arts, music, cinema, fashion, luxury goods, hospitality, interior design, beauty, diplomacy, or any profession requiring aesthetic sense and refined taste.', gu: 'Fine arts, music, cinema, fashion, luxury goods, hospitality, interior design, beauty, diplomacy, or any profession requiring aesthetic sense and refined taste.' }, style: { en: 'You work best in environments that are beautiful, harmonious, and relationship-rich. Professional energy thrives through collaboration, aesthetics, and sensory excellence. Conflict-heavy environments deplete you quickly — you need grace around you to work at your best.', hi: 'आप सुन्दर, सामंजस्यपूर्ण वातावरण में सर्वश्रेष्ठ काम करते हैं। सहयोग और सौन्दर्यशास्त्र से पेशेवर ऊर्जा बढ़ती है।', sa: 'आप सुन्दर, सामंजस्यपूर्ण वातावरण में सर्वश्रेष्ठ काम करते हैं। सहयोग और सौन्दर्यशास्त्र से पेशेवर ऊर्जा बढ़ती है।', mai: 'आप सुन्दर, सामंजस्यपूर्ण वातावरण में सर्वश्रेष्ठ काम करते हैं। सहयोग और सौन्दर्यशास्त्र से पेशेवर ऊर्जा बढ़ती है।', mr: 'आप सुन्दर, सामंजस्यपूर्ण वातावरण में सर्वश्रेष्ठ काम करते हैं। सहयोग और सौन्दर्यशास्त्र से पेशेवर ऊर्जा बढ़ती है।', ta: 'You work best in environments that are beautiful, harmonious, and relationship-rich. Professional energy thrives through collaboration, aesthetics, and sensory excellence. Conflict-heavy environments deplete you quickly — you need grace around you to work at your best.', te: 'You work best in environments that are beautiful, harmonious, and relationship-rich. Professional energy thrives through collaboration, aesthetics, and sensory excellence. Conflict-heavy environments deplete you quickly — you need grace around you to work at your best.', bn: 'You work best in environments that are beautiful, harmonious, and relationship-rich. Professional energy thrives through collaboration, aesthetics, and sensory excellence. Conflict-heavy environments deplete you quickly — you need grace around you to work at your best.', kn: 'You work best in environments that are beautiful, harmonious, and relationship-rich. Professional energy thrives through collaboration, aesthetics, and sensory excellence. Conflict-heavy environments deplete you quickly — you need grace around you to work at your best.', gu: 'You work best in environments that are beautiful, harmonious, and relationship-rich. Professional energy thrives through collaboration, aesthetics, and sensory excellence. Conflict-heavy environments deplete you quickly — you need grace around you to work at your best.' } },
  Saturn:  { fields: { en: 'Law, social work, government, labor sectors, agriculture, mining, construction, urban planning, healthcare for the elderly or poor, or any slow-building, high-integrity profession.', hi: 'कानून, समाज सेवा, सरकार, श्रम क्षेत्र, कृषि, खनन, निर्माण, वृद्धों/गरीबों की स्वास्थ्य सेवा।', sa: 'कानून, समाज सेवा, सरकार, श्रम क्षेत्र, कृषि, खनन, निर्माण, वृद्धों/गरीबों की स्वास्थ्य सेवा।', mai: 'कानून, समाज सेवा, सरकार, श्रम क्षेत्र, कृषि, खनन, निर्माण, वृद्धों/गरीबों की स्वास्थ्य सेवा।', mr: 'कानून, समाज सेवा, सरकार, श्रम क्षेत्र, कृषि, खनन, निर्माण, वृद्धों/गरीबों की स्वास्थ्य सेवा।', ta: 'Law, social work, government, labor sectors, agriculture, mining, construction, urban planning, healthcare for the elderly or poor, or any slow-building, high-integrity profession.', te: 'Law, social work, government, labor sectors, agriculture, mining, construction, urban planning, healthcare for the elderly or poor, or any slow-building, high-integrity profession.', bn: 'Law, social work, government, labor sectors, agriculture, mining, construction, urban planning, healthcare for the elderly or poor, or any slow-building, high-integrity profession.', kn: 'Law, social work, government, labor sectors, agriculture, mining, construction, urban planning, healthcare for the elderly or poor, or any slow-building, high-integrity profession.', gu: 'Law, social work, government, labor sectors, agriculture, mining, construction, urban planning, healthcare for the elderly or poor, or any slow-building, high-integrity profession.' }, style: { en: 'You are built for the long game. Career success comes slowly but is rock-solid when it arrives. You excel in professions that others abandon — because you have patience, discipline, and the ability to serve without recognition. The less glamorous the work, often the better you perform.', hi: 'आप लम्बी दौड़ के लिए बने हैं। करियर की सफलता धीरे आती है पर अटल होती है। आप वहाँ उत्कृष्ट हैं जहाँ दूसरे हार मानते हैं।', sa: 'आप लम्बी दौड़ के लिए बने हैं। करियर की सफलता धीरे आती है पर अटल होती है। आप वहाँ उत्कृष्ट हैं जहाँ दूसरे हार मानते हैं।', mai: 'आप लम्बी दौड़ के लिए बने हैं। करियर की सफलता धीरे आती है पर अटल होती है। आप वहाँ उत्कृष्ट हैं जहाँ दूसरे हार मानते हैं।', mr: 'आप लम्बी दौड़ के लिए बने हैं। करियर की सफलता धीरे आती है पर अटल होती है। आप वहाँ उत्कृष्ट हैं जहाँ दूसरे हार मानते हैं।', ta: 'You are built for the long game. Career success comes slowly but is rock-solid when it arrives. You excel in professions that others abandon — because you have patience, discipline, and the ability to serve without recognition. The less glamorous the work, often the better you perform.', te: 'You are built for the long game. Career success comes slowly but is rock-solid when it arrives. You excel in professions that others abandon — because you have patience, discipline, and the ability to serve without recognition. The less glamorous the work, often the better you perform.', bn: 'You are built for the long game. Career success comes slowly but is rock-solid when it arrives. You excel in professions that others abandon — because you have patience, discipline, and the ability to serve without recognition. The less glamorous the work, often the better you perform.', kn: 'You are built for the long game. Career success comes slowly but is rock-solid when it arrives. You excel in professions that others abandon — because you have patience, discipline, and the ability to serve without recognition. The less glamorous the work, often the better you perform.', gu: 'You are built for the long game. Career success comes slowly but is rock-solid when it arrives. You excel in professions that others abandon — because you have patience, discipline, and the ability to serve without recognition. The less glamorous the work, often the better you perform.' } },
};

interface DKTheme { nature: LocaleText; dynamic: LocaleText; }
const DK_THEMES: Record<string, DKTheme> = {
  Sun:     { nature: { en: 'Authoritative, proud, career-driven, and dignified. Your partner has a strong identity and needs recognition. They may be drawn to leadership, carry a solar radiance, and struggle with being second.', hi: 'अधिकारपूर्ण, गर्वित, करियर-उन्मुख और प्रतिष्ठित। साथी की पहचान मजबूत है, उन्हें मान्यता चाहिए।', sa: 'अधिकारपूर्ण, गर्वित, करियर-उन्मुख और प्रतिष्ठित। साथी की पहचान मजबूत है, उन्हें मान्यता चाहिए।', mai: 'अधिकारपूर्ण, गर्वित, करियर-उन्मुख और प्रतिष्ठित। साथी की पहचान मजबूत है, उन्हें मान्यता चाहिए।', mr: 'अधिकारपूर्ण, गर्वित, करियर-उन्मुख और प्रतिष्ठित। साथी की पहचान मजबूत है, उन्हें मान्यता चाहिए।', ta: 'Authoritative, proud, career-driven, and dignified. Your partner has a strong identity and needs recognition. They may be drawn to leadership, carry a solar radiance, and struggle with being second.', te: 'Authoritative, proud, career-driven, and dignified. Your partner has a strong identity and needs recognition. They may be drawn to leadership, carry a solar radiance, and struggle with being second.', bn: 'Authoritative, proud, career-driven, and dignified. Your partner has a strong identity and needs recognition. They may be drawn to leadership, carry a solar radiance, and struggle with being second.', kn: 'Authoritative, proud, career-driven, and dignified. Your partner has a strong identity and needs recognition. They may be drawn to leadership, carry a solar radiance, and struggle with being second.', gu: 'Authoritative, proud, career-driven, and dignified. Your partner has a strong identity and needs recognition. They may be drawn to leadership, carry a solar radiance, and struggle with being second.' }, dynamic: { en: 'Power balance is crucial. Two suns create friction unless roles are clearly defined. The relationship thrives when both have their own domain of authority — and the wisdom to respect each other\'s.', hi: 'शक्ति सन्तुलन महत्वपूर्ण है। दोनों की अलग-अलग अधिकार-भूमिकाएँ होनी चाहिए।' } },
  Moon:    { nature: { en: 'Nurturing, emotionally sensitive, family-oriented, and deeply caring. Your partner feels deeply and gives deeply — but also needs consistent emotional reassurance and security.', hi: 'पोषणकारी, भावनात्मक रूप से संवेदनशील, पारिवारिक। साथी गहराई से महसूस और देते हैं।', sa: 'पोषणकारी, भावनात्मक रूप से संवेदनशील, पारिवारिक। साथी गहराई से महसूस और देते हैं।', mai: 'पोषणकारी, भावनात्मक रूप से संवेदनशील, पारिवारिक। साथी गहराई से महसूस और देते हैं।', mr: 'पोषणकारी, भावनात्मक रूप से संवेदनशील, पारिवारिक। साथी गहराई से महसूस और देते हैं।', ta: 'Nurturing, emotionally sensitive, family-oriented, and deeply caring. Your partner feels deeply and gives deeply — but also needs consistent emotional reassurance and security.', te: 'Nurturing, emotionally sensitive, family-oriented, and deeply caring. Your partner feels deeply and gives deeply — but also needs consistent emotional reassurance and security.', bn: 'Nurturing, emotionally sensitive, family-oriented, and deeply caring. Your partner feels deeply and gives deeply — but also needs consistent emotional reassurance and security.', kn: 'Nurturing, emotionally sensitive, family-oriented, and deeply caring. Your partner feels deeply and gives deeply — but also needs consistent emotional reassurance and security.', gu: 'Nurturing, emotionally sensitive, family-oriented, and deeply caring. Your partner feels deeply and gives deeply — but also needs consistent emotional reassurance and security.' }, dynamic: { en: 'This partnership runs on emotional currency. Feeling seen, safe, and cared for matters more than logic or achievement. Home, family, and shared roots anchor the bond. Neglect emotional maintenance at your peril.', hi: 'यह साझेदारी भावनात्मक मुद्रा पर चलती है। देखा-सुना महसूस करना तर्क से अधिक मायने रखता है।', sa: 'यह साझेदारी भावनात्मक मुद्रा पर चलती है। देखा-सुना महसूस करना तर्क से अधिक मायने रखता है।', mai: 'यह साझेदारी भावनात्मक मुद्रा पर चलती है। देखा-सुना महसूस करना तर्क से अधिक मायने रखता है।', mr: 'यह साझेदारी भावनात्मक मुद्रा पर चलती है। देखा-सुना महसूस करना तर्क से अधिक मायने रखता है।', ta: 'This partnership runs on emotional currency. Feeling seen, safe, and cared for matters more than logic or achievement. Home, family, and shared roots anchor the bond. Neglect emotional maintenance at your peril.', te: 'This partnership runs on emotional currency. Feeling seen, safe, and cared for matters more than logic or achievement. Home, family, and shared roots anchor the bond. Neglect emotional maintenance at your peril.', bn: 'This partnership runs on emotional currency. Feeling seen, safe, and cared for matters more than logic or achievement. Home, family, and shared roots anchor the bond. Neglect emotional maintenance at your peril.', kn: 'This partnership runs on emotional currency. Feeling seen, safe, and cared for matters more than logic or achievement. Home, family, and shared roots anchor the bond. Neglect emotional maintenance at your peril.', gu: 'This partnership runs on emotional currency. Feeling seen, safe, and cared for matters more than logic or achievement. Home, family, and shared roots anchor the bond. Neglect emotional maintenance at your peril.' } },
  Mars:    { nature: { en: 'Energetic, assertive, physically driven, and passionately expressive. Your partner acts first and thinks later, brings intense vitality to the relationship, and may have a short fuse.', hi: 'ऊर्जावान, मुखर, शारीरिक रूप से सक्रिय। साथी पहले कार्य करते हैं, बाद में सोचते हैं।', sa: 'ऊर्जावान, मुखर, शारीरिक रूप से सक्रिय। साथी पहले कार्य करते हैं, बाद में सोचते हैं।', mai: 'ऊर्जावान, मुखर, शारीरिक रूप से सक्रिय। साथी पहले कार्य करते हैं, बाद में सोचते हैं।', mr: 'ऊर्जावान, मुखर, शारीरिक रूप से सक्रिय। साथी पहले कार्य करते हैं, बाद में सोचते हैं।', ta: 'Energetic, assertive, physically driven, and passionately expressive. Your partner acts first and thinks later, brings intense vitality to the relationship, and may have a short fuse.', te: 'Energetic, assertive, physically driven, and passionately expressive. Your partner acts first and thinks later, brings intense vitality to the relationship, and may have a short fuse.', bn: 'Energetic, assertive, physically driven, and passionately expressive. Your partner acts first and thinks later, brings intense vitality to the relationship, and may have a short fuse.', kn: 'Energetic, assertive, physically driven, and passionately expressive. Your partner acts first and thinks later, brings intense vitality to the relationship, and may have a short fuse.', gu: 'Energetic, assertive, physically driven, and passionately expressive. Your partner acts first and thinks later, brings intense vitality to the relationship, and may have a short fuse.' }, dynamic: { en: 'This is a high-energy partnership. There will be friction, passion, and intensity. It needs physical vitality and healthy competition to stay alive. Monotony kills it. Conflict, handled maturely, makes it stronger.', hi: 'यह उच्च-ऊर्जा साझेदारी है। घर्षण और जुनून होगा। शारीरिक जीवन्तता से सम्बन्ध जीवित रहता है।', sa: 'यह उच्च-ऊर्जा साझेदारी है। घर्षण और जुनून होगा। शारीरिक जीवन्तता से सम्बन्ध जीवित रहता है।', mai: 'यह उच्च-ऊर्जा साझेदारी है। घर्षण और जुनून होगा। शारीरिक जीवन्तता से सम्बन्ध जीवित रहता है।', mr: 'यह उच्च-ऊर्जा साझेदारी है। घर्षण और जुनून होगा। शारीरिक जीवन्तता से सम्बन्ध जीवित रहता है।', ta: 'This is a high-energy partnership. There will be friction, passion, and intensity. It needs physical vitality and healthy competition to stay alive. Monotony kills it. Conflict, handled maturely, makes it stronger.', te: 'This is a high-energy partnership. There will be friction, passion, and intensity. It needs physical vitality and healthy competition to stay alive. Monotony kills it. Conflict, handled maturely, makes it stronger.', bn: 'This is a high-energy partnership. There will be friction, passion, and intensity. It needs physical vitality and healthy competition to stay alive. Monotony kills it. Conflict, handled maturely, makes it stronger.', kn: 'This is a high-energy partnership. There will be friction, passion, and intensity. It needs physical vitality and healthy competition to stay alive. Monotony kills it. Conflict, handled maturely, makes it stronger.', gu: 'This is a high-energy partnership. There will be friction, passion, and intensity. It needs physical vitality and healthy competition to stay alive. Monotony kills it. Conflict, handled maturely, makes it stronger.' } },
  Mercury: { nature: { en: 'Intellectually sharp, communicative, playful, and youthful in spirit. Your partner engages through ideas and conversation. They may be versatile, restless, and need mental stimulation constantly.', hi: 'बौद्धिक रूप से तेज, संवादशील, चुलबुले। साथी विचारों और बातचीत से जुड़ते हैं।', sa: 'बौद्धिक रूप से तेज, संवादशील, चुलबुले। साथी विचारों और बातचीत से जुड़ते हैं।', mai: 'बौद्धिक रूप से तेज, संवादशील, चुलबुले। साथी विचारों और बातचीत से जुड़ते हैं।', mr: 'बौद्धिक रूप से तेज, संवादशील, चुलबुले। साथी विचारों और बातचीत से जुड़ते हैं।', ta: 'Intellectually sharp, communicative, playful, and youthful in spirit. Your partner engages through ideas and conversation. They may be versatile, restless, and need mental stimulation constantly.', te: 'Intellectually sharp, communicative, playful, and youthful in spirit. Your partner engages through ideas and conversation. They may be versatile, restless, and need mental stimulation constantly.', bn: 'Intellectually sharp, communicative, playful, and youthful in spirit. Your partner engages through ideas and conversation. They may be versatile, restless, and need mental stimulation constantly.', kn: 'Intellectually sharp, communicative, playful, and youthful in spirit. Your partner engages through ideas and conversation. They may be versatile, restless, and need mental stimulation constantly.', gu: 'Intellectually sharp, communicative, playful, and youthful in spirit. Your partner engages through ideas and conversation. They may be versatile, restless, and need mental stimulation constantly.' }, dynamic: { en: 'Communication is everything. A partner who doesn\'t talk, think, or grow intellectually will not hold your attention long. The relationship feeds on wit, debate, and shared curiosity — it must keep learning together.', hi: 'संवाद सब कुछ है। बुद्धि और साझा जिज्ञासा से सम्बन्ध पोषित होता है।' } },
  Jupiter: { nature: { en: 'Wise, generous, philosophical, and morally grounded. Your partner has a teacher quality — they guide and expand you. They may be religious or spiritual, well-educated, and known for their integrity.', hi: 'बुद्धिमान, उदार, दार्शनिक और नैतिक। आपके साथी में गुरु का गुण है।', sa: 'बुद्धिमान, उदार, दार्शनिक और नैतिक। आपके साथी में गुरु का गुण है।', mai: 'बुद्धिमान, उदार, दार्शनिक और नैतिक। आपके साथी में गुरु का गुण है।', mr: 'बुद्धिमान, उदार, दार्शनिक और नैतिक। आपके साथी में गुरु का गुण है।', ta: 'Wise, generous, philosophical, and morally grounded. Your partner has a teacher quality — they guide and expand you. They may be religious or spiritual, well-educated, and known for their integrity.', te: 'Wise, generous, philosophical, and morally grounded. Your partner has a teacher quality — they guide and expand you. They may be religious or spiritual, well-educated, and known for their integrity.', bn: 'Wise, generous, philosophical, and morally grounded. Your partner has a teacher quality — they guide and expand you. They may be religious or spiritual, well-educated, and known for their integrity.', kn: 'Wise, generous, philosophical, and morally grounded. Your partner has a teacher quality — they guide and expand you. They may be religious or spiritual, well-educated, and known for their integrity.', gu: 'Wise, generous, philosophical, and morally grounded. Your partner has a teacher quality — they guide and expand you. They may be religious or spiritual, well-educated, and known for their integrity.' }, dynamic: { en: 'This partnership is built on wisdom, shared values, and mutual growth. There\'s a teacher-student dynamic — in the best sense: both make each other wiser. Shared dharma and life philosophy are the foundation. Without shared values, the bond has no centre.', hi: 'यह साझेदारी ज्ञान और साझा मूल्यों पर बनी है। साझा धर्म इसकी नींव है।' } },
  Venus:   { nature: { en: 'Beautiful (inner or outer), artistic, pleasure-loving, and relationship-centred. Your partner brings grace, aesthetic sensibility, and social charm. They value comfort and harmony intensely and may avoid all conflict.', hi: 'सुन्दर, कलात्मक, सुख-प्रेमी। साथी जीवन में सौन्दर्यशास्त्र और सामाजिक आकर्षण लाते हैं।', sa: 'सुन्दर, कलात्मक, सुख-प्रेमी। साथी जीवन में सौन्दर्यशास्त्र और सामाजिक आकर्षण लाते हैं।', mai: 'सुन्दर, कलात्मक, सुख-प्रेमी। साथी जीवन में सौन्दर्यशास्त्र और सामाजिक आकर्षण लाते हैं।', mr: 'सुन्दर, कलात्मक, सुख-प्रेमी। साथी जीवन में सौन्दर्यशास्त्र और सामाजिक आकर्षण लाते हैं।', ta: 'Beautiful (inner or outer), artistic, pleasure-loving, and relationship-centred. Your partner brings grace, aesthetic sensibility, and social charm. They value comfort and harmony intensely and may avoid all conflict.', te: 'Beautiful (inner or outer), artistic, pleasure-loving, and relationship-centred. Your partner brings grace, aesthetic sensibility, and social charm. They value comfort and harmony intensely and may avoid all conflict.', bn: 'Beautiful (inner or outer), artistic, pleasure-loving, and relationship-centred. Your partner brings grace, aesthetic sensibility, and social charm. They value comfort and harmony intensely and may avoid all conflict.', kn: 'Beautiful (inner or outer), artistic, pleasure-loving, and relationship-centred. Your partner brings grace, aesthetic sensibility, and social charm. They value comfort and harmony intensely and may avoid all conflict.', gu: 'Beautiful (inner or outer), artistic, pleasure-loving, and relationship-centred. Your partner brings grace, aesthetic sensibility, and social charm. They value comfort and harmony intensely and may avoid all conflict.' }, dynamic: { en: 'This is a deeply romantic partnership that values beauty, pleasure, and harmony. Conflict and ugliness are handled poorly — the bond needs to be maintained with affection, aesthetic nourishment, and consistent tenderness.', hi: 'यह गहरी रोमांटिक साझेदारी है जो सौन्दर्य और सामंजस्य को महत्व देती है।', sa: 'यह गहरी रोमांटिक साझेदारी है जो सौन्दर्य और सामंजस्य को महत्व देती है।', mai: 'यह गहरी रोमांटिक साझेदारी है जो सौन्दर्य और सामंजस्य को महत्व देती है।', mr: 'यह गहरी रोमांटिक साझेदारी है जो सौन्दर्य और सामंजस्य को महत्व देती है।', ta: 'This is a deeply romantic partnership that values beauty, pleasure, and harmony. Conflict and ugliness are handled poorly — the bond needs to be maintained with affection, aesthetic nourishment, and consistent tenderness.', te: 'This is a deeply romantic partnership that values beauty, pleasure, and harmony. Conflict and ugliness are handled poorly — the bond needs to be maintained with affection, aesthetic nourishment, and consistent tenderness.', bn: 'This is a deeply romantic partnership that values beauty, pleasure, and harmony. Conflict and ugliness are handled poorly — the bond needs to be maintained with affection, aesthetic nourishment, and consistent tenderness.', kn: 'This is a deeply romantic partnership that values beauty, pleasure, and harmony. Conflict and ugliness are handled poorly — the bond needs to be maintained with affection, aesthetic nourishment, and consistent tenderness.', gu: 'This is a deeply romantic partnership that values beauty, pleasure, and harmony. Conflict and ugliness are handled poorly — the bond needs to be maintained with affection, aesthetic nourishment, and consistent tenderness.' } },
  Saturn:  { nature: { en: 'Mature, responsible, disciplined, and deeply committed. Your partner may be older, more serious, or someone who has been tested by life. They bring stability, loyalty, and a long-term perspective that other partners may lack.', hi: 'परिपक्व, जिम्मेदार, अनुशासित। साथी बड़े, अधिक गम्भीर, या जीवन से परखे हुए हो सकते हैं।', sa: 'परिपक्व, जिम्मेदार, अनुशासित। साथी बड़े, अधिक गम्भीर, या जीवन से परखे हुए हो सकते हैं।', mai: 'परिपक्व, जिम्मेदार, अनुशासित। साथी बड़े, अधिक गम्भीर, या जीवन से परखे हुए हो सकते हैं।', mr: 'परिपक्व, जिम्मेदार, अनुशासित। साथी बड़े, अधिक गम्भीर, या जीवन से परखे हुए हो सकते हैं।', ta: 'Mature, responsible, disciplined, and deeply committed. Your partner may be older, more serious, or someone who has been tested by life. They bring stability, loyalty, and a long-term perspective that other partners may lack.', te: 'Mature, responsible, disciplined, and deeply committed. Your partner may be older, more serious, or someone who has been tested by life. They bring stability, loyalty, and a long-term perspective that other partners may lack.', bn: 'Mature, responsible, disciplined, and deeply committed. Your partner may be older, more serious, or someone who has been tested by life. They bring stability, loyalty, and a long-term perspective that other partners may lack.', kn: 'Mature, responsible, disciplined, and deeply committed. Your partner may be older, more serious, or someone who has been tested by life. They bring stability, loyalty, and a long-term perspective that other partners may lack.', gu: 'Mature, responsible, disciplined, and deeply committed. Your partner may be older, more serious, or someone who has been tested by life. They bring stability, loyalty, and a long-term perspective that other partners may lack.' }, dynamic: { en: 'This partnership is built for the long haul, not the honeymoon. It deepens with time, shared challenge, and struggle. Romance may be understated, but loyalty and reliability run bone-deep. Do not mistake slowness for coldness — Saturn love is proven over decades, not days.', hi: 'यह साझेदारी लम्बे समय के लिए बनी है। धीरेपन को ठंडक मत समझें — शनि का प्रेम दशकों में सिद्ध होता है।', sa: 'यह साझेदारी लम्बे समय के लिए बनी है। धीरेपन को ठंडक मत समझें — शनि का प्रेम दशकों में सिद्ध होता है।', mai: 'यह साझेदारी लम्बे समय के लिए बनी है। धीरेपन को ठंडक मत समझें — शनि का प्रेम दशकों में सिद्ध होता है।', mr: 'यह साझेदारी लम्बे समय के लिए बनी है। धीरेपन को ठंडक मत समझें — शनि का प्रेम दशकों में सिद्ध होता है।', ta: 'This partnership is built for the long haul, not the honeymoon. It deepens with time, shared challenge, and struggle. Romance may be understated, but loyalty and reliability run bone-deep. Do not mistake slowness for coldness — Saturn love is proven over decades, not days.', te: 'This partnership is built for the long haul, not the honeymoon. It deepens with time, shared challenge, and struggle. Romance may be understated, but loyalty and reliability run bone-deep. Do not mistake slowness for coldness — Saturn love is proven over decades, not days.', bn: 'This partnership is built for the long haul, not the honeymoon. It deepens with time, shared challenge, and struggle. Romance may be understated, but loyalty and reliability run bone-deep. Do not mistake slowness for coldness — Saturn love is proven over decades, not days.', kn: 'This partnership is built for the long haul, not the honeymoon. It deepens with time, shared challenge, and struggle. Romance may be understated, but loyalty and reliability run bone-deep. Do not mistake slowness for coldness — Saturn love is proven over decades, not days.', gu: 'This partnership is built for the long haul, not the honeymoon. It deepens with time, shared challenge, and struggle. Romance may be understated, but loyalty and reliability run bone-deep. Do not mistake slowness for coldness — Saturn love is proven over decades, not days.' } },
};

interface JaiminiInterpretationProps {
  jaimini: any;
  locale: string;
}

export function JaiminiInterpretation({ jaimini, locale }: JaiminiInterpretationProps) {
  const isHi = isDevanagariLocale(locale);
  const L = isHi ? 'hi' : 'en';

  if (!jaimini) return null;

  const karakas = jaimini.charaKarakas || jaimini.karakas || [];
  const findKaraka = (role: string) => {
    if (Array.isArray(karakas)) {
      return karakas.find((k: any) => k.karaka === role || k.role === role || k.type === role);
    }
    return karakas[role] ?? null;
  };

  const atmakaraka = findKaraka('Atmakaraka') || findKaraka('AK');
  const amatyakaraka = findKaraka('Amatyakaraka') || findKaraka('AmK');
  const darakaraka = findKaraka('Darakaraka') || findKaraka('DK');

  // Always use EN name as the theme lookup key; display name uses locale
  const getPlanetKey = (karaka: any): string => {
    if (!karaka) return '';
    if (karaka.planetName) return karaka.planetName.en;
    if (typeof karaka.planet === 'string') return karaka.planet;
    return '';
  };

  const getPlanetDisplay = (karaka: any): string => {
    if (!karaka) return isHi ? 'अज्ञात' : 'Unknown';
    if (karaka.planetName) return isHi ? (karaka.planetName.hi || karaka.planetName.en) : karaka.planetName.en;
    if (typeof karaka.planet === 'string') return karaka.planet;
    return isHi ? 'अज्ञात' : 'Unknown';
  };

  const akKey = getPlanetKey(atmakaraka);
  const amkKey = getPlanetKey(amatyakaraka);
  const dkKey = getPlanetKey(darakaraka);

  const akDisplay = getPlanetDisplay(atmakaraka);
  const amkDisplay = getPlanetDisplay(amatyakaraka);
  const dkDisplay = getPlanetDisplay(darakaraka);

  const ak = AK_THEMES[akKey];
  const amk = AMK_THEMES[amkKey];
  const dk = DK_THEMES[dkKey];

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-gold-primary text-xs uppercase tracking-wider font-bold border-b border-gold-primary/20 pb-2">
        {isHi ? 'जैमिनी विश्लेषण' : 'Jaimini Interpretation'}
      </h3>

      {/* ── Atmakaraka ── */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/25 p-4 space-y-3">
        <div>
          <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-1">
            {isHi ? 'आत्मकारक — आत्मा का राजा' : 'Atmakaraka — King of the Soul'}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? `आपका आत्मकारक ${akDisplay} है — कुंडली में सर्वाधिक अंश वाला ग्रह और आत्मा का मुख्य प्रतिनिधि। सभी अन्य कारक इसी की सेवा में हैं।`
              : `Your Atmakaraka is ${akDisplay} — the planet with the highest degree in your chart and the ruler of your soul. Every other karaka serves this planet's agenda.`}
          </p>
        </div>

        {ak && (
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/20 px-3 py-2">
              <div className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                {isHi ? 'आत्मा की इच्छा' : "Soul's Desire"}
              </div>
              <p className="text-emerald-100/80 text-sm leading-relaxed">{ak.desire[L]}</p>
            </div>
            <div className="rounded-lg bg-sky-500/8 border border-sky-500/20 px-3 py-2">
              <div className="text-sky-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                {isHi ? 'जीवन-पाठ' : 'Life Lessons'}
              </div>
              <p className="text-sky-100/80 text-sm leading-relaxed">{ak.lessons[L]}</p>
            </div>
            <div className="rounded-lg bg-rose-500/8 border border-rose-500/20 px-3 py-2">
              <div className="text-rose-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                {isHi ? 'छाया / जाल' : 'Shadow / Trap'}
              </div>
              <p className="text-rose-100/80 text-sm leading-relaxed">{ak.shadow[L]}</p>
            </div>
            <div className="rounded-lg bg-amber-500/8 border border-amber-500/20 px-3 py-2">
              <div className="text-amber-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                {isHi ? 'कर्म-मिशन' : 'Karmic Mission'}
              </div>
              <p className="text-amber-100/80 text-sm leading-relaxed">{ak.karma[L]}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Amatyakaraka ── */}
      <div className="rounded-xl bg-gradient-to-br from-[#1b3a2d]/40 via-[#0f2018]/50 to-[#0a0e27] border border-emerald-500/20 p-4 space-y-3">
        <div>
          <div className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-1">
            {isHi ? 'अमात्यकारक — करियर-कारक' : 'Amatyakaraka — Career Significator'}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? `आपका अमात्यकारक ${amkDisplay} है। यह उन क्षेत्रों और कार्यशैली को दर्शाता है जिनमें आत्मा का कार्य सबसे अच्छे से प्रकट होता है।`
              : `Your Amatyakaraka is ${amkDisplay}. This reveals the fields and working style through which your soul's mission best expresses itself.`}
          </p>
        </div>

        {amk && (
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/20 px-3 py-2">
              <div className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                {isHi ? 'क्षेत्र' : 'Fields'}
              </div>
              <p className="text-emerald-100/80 text-sm leading-relaxed">{amk.fields[L]}</p>
            </div>
            <div className="rounded-lg bg-teal-500/8 border border-teal-500/20 px-3 py-2">
              <div className="text-teal-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                {isHi ? 'कार्यशैली' : 'Working Style'}
              </div>
              <p className="text-teal-100/80 text-sm leading-relaxed">{amk.style[L]}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Darakaraka ── */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b40]/40 via-[#1a0f28]/50 to-[#0a0e27] border border-purple-500/20 p-4 space-y-3">
        <div>
          <div className="text-purple-400 text-xs uppercase tracking-wider font-bold mb-1">
            {isHi ? 'दारकारक — जीवनसाथी-कारक' : 'Darakaraka — Spouse Significator'}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? `आपका दारकारक ${dkDisplay} है — सबसे कम अंश वाला ग्रह। यह आपके जीवनसाथी के स्वभाव और सम्बन्ध की गतिशीलता को दर्शाता है।`
              : `Your Darakaraka is ${dkDisplay} — the planet with the lowest degree. This reveals the nature of your spouse and the dynamic of your primary partnership.`}
          </p>
        </div>

        {dk && (
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-lg bg-purple-500/8 border border-purple-500/20 px-3 py-2">
              <div className="text-purple-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                {isHi ? 'साथी का स्वभाव' : "Partner's Nature"}
              </div>
              <p className="text-purple-100/80 text-sm leading-relaxed">{dk.nature[L]}</p>
            </div>
            <div className="rounded-lg bg-pink-500/8 border border-pink-500/20 px-3 py-2">
              <div className="text-pink-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                {isHi ? 'सम्बन्ध-गतिशीलता' : 'Partnership Dynamic'}
              </div>
              <p className="text-pink-100/80 text-sm leading-relaxed">{dk.dynamic[L]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
