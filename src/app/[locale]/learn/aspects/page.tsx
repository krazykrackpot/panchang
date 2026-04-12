'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Eye, Target, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual Labels ──────────────────────────────────────────── */
const L = {
  title: { en: 'Planetary Aspects (Graha Drishti)', hi: 'ग्रह दृष्टि (Planetary Aspects)', sa: 'ग्रहदृष्टिः' , ta: 'கிரக பார்வை (கிரக திருஷ்டி)' },
  subtitle: {
    en: 'In Vedic astrology, planets cast their gaze (Drishti) on other houses and planets, influencing them from a distance. Every planet has a full 7th-house aspect, while Mars, Jupiter, and Saturn possess additional special aspects that make them uniquely powerful.',
    hi: 'वैदिक ज्योतिष में ग्रह अन्य भावों और ग्रहों पर अपनी दृष्टि डालते हैं, दूर से उन्हें प्रभावित करते हैं। प्रत्येक ग्रह की 7वें भाव पर पूर्ण दृष्टि होती है, जबकि मंगल, बृहस्पति और शनि की अतिरिक्त विशेष दृष्टियाँ होती हैं।',
    sa: 'ज्योतिषे ग्रहाः अन्यभावान् ग्रहांश्च दृष्ट्या प्रभावयन्ति। प्रत्येकग्रहस्य सप्तमभावे पूर्णदृष्टिः, मङ्गलबृहस्पतिशनीनां विशेषदृष्टयः अपि सन्ति।'
  },

  whatTitle: { en: 'What are Aspects (Drishti)?', hi: 'दृष्टि (Aspects) क्या है?', sa: 'दृष्टिः का?' },
  whatContent: {
    en: 'The Sanskrit word "Drishti" literally means "sight" or "gaze." In Jyotish, every planet looks at (aspects) the 7th house from its position — this is the opposition aspect, shared by all nine grahas. This is the fundamental rule: wherever a planet sits, it influences the house directly opposite.',
    hi: '"दृष्टि" शब्द का शाब्दिक अर्थ "देखना" या "नज़र" है। ज्योतिष में प्रत्येक ग्रह अपनी स्थिति से 7वें भाव को देखता है — यह प्रतिपक्ष दृष्टि है, जो सभी नौ ग्रहों में समान है। यह मूल नियम है: ग्रह जहाँ बैठा हो, वह सामने वाले भाव को प्रभावित करता है।',
    sa: '"दृष्टिः" इति शब्दस्य शाब्दिकार्थः "दर्शनम्" इति। ज्योतिषे प्रत्येकः ग्रहः स्वस्थानात् सप्तमभावं पश्यति — इयं प्रतिपक्षदृष्टिः सर्वेषु नवग्रहेषु समाना।'
  },
  whatContent2: {
    en: 'But three planets break this rule with additional special aspects: Mars also aspects the 4th and 8th houses, Jupiter also aspects the 5th and 9th houses (the trines), and Saturn also aspects the 3rd and 10th houses. These special aspects dramatically increase these planets\' sphere of influence — Saturn, for example, controls four houses from any position (3rd, 7th, 10th from placement, plus the house it occupies).',
    hi: 'किन्तु तीन ग्रह इस नियम से परे अतिरिक्त विशेष दृष्टियाँ रखते हैं: मंगल 4वें और 8वें भाव को भी देखता है, बृहस्पति 5वें और 9वें भाव (त्रिकोण) को भी देखता है, और शनि 3रे और 10वें भाव को भी देखता है। ये विशेष दृष्टियाँ इन ग्रहों के प्रभाव क्षेत्र को नाटकीय रूप से बढ़ाती हैं।',
    sa: 'किन्तु त्रयः ग्रहाः अतिरिक्तविशेषदृष्टीः धारयन्ति: मङ्गलः 4-8 भावौ, बृहस्पतिः 5-9 भावौ (त्रिकोणौ), शनिः 3-10 भावौ अपि पश्यति।'
  },
  whatContent3: {
    en: 'Aspect = influence. The nature of the influence depends entirely on which planet is casting the aspect. Jupiter\'s aspect is benevolent — it protects, expands, and blesses whatever it gazes upon. Saturn\'s aspect is restrictive — it delays, disciplines, and forces maturity. Mars\'s aspect is aggressive — it energizes, creates conflict, but also gives courage. Rahu and Ketu aspect like Jupiter (5th, 7th, 9th) according to Parashari principles, but their influence is shadowy and obsessive.',
    hi: 'दृष्टि = प्रभाव। प्रभाव की प्रकृति पूर्णतः इस बात पर निर्भर है कि कौन सा ग्रह दृष्टि डाल रहा है। बृहस्पति की दृष्टि शुभ है — वह रक्षा, विस्तार और आशीर्वाद देती है। शनि की दृष्टि प्रतिबन्धात्मक है — वह विलम्ब, अनुशासन और परिपक्वता लाती है। मंगल की दृष्टि आक्रामक है — वह ऊर्जा, संघर्ष और साहस देती है।',
    sa: 'दृष्टिः = प्रभावः। बृहस्पतेः दृष्टिः शुभा — रक्षति विस्तारयति आशिषं ददाति। शनेः दृष्टिः प्रतिबन्धात्मिका। मङ्गलस्य दृष्टिः आक्रामिका।'
  },

  diagramTitle: { en: 'Interactive Aspect Diagram', hi: 'संवादात्मक दृष्टि आरेख', sa: 'संवादात्मकदृष्ट्यारेखः' },
  diagramHint: { en: 'Select a planet below to see its aspects on the 12-house wheel', hi: 'नीचे ग्रह चुनें और 12 भाव चक्र पर उसकी दृष्टि देखें', sa: 'अधः ग्रहं चिनुत भावचक्रे दृष्टिं द्रष्टुम्' },
  placedIn: { en: 'Placed in House 1', hi: 'भाव 1 में स्थित', sa: 'भावे 1 स्थितः' },

  rulesTitle: { en: 'Aspect Rules & Strength', hi: 'दृष्टि नियम एवं बल', sa: 'दृष्टिनियमाः बलं च' },
  planet: { en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' },
  aspects: { en: 'Aspects', hi: 'दृष्टियाँ', sa: 'दृष्टयः' },
  full: { en: 'Full (100%)', hi: 'पूर्ण (100%)', sa: 'पूर्णम् (100%)' },
  threeQ: { en: '3/4 (75%)', hi: '3/4 (75%)', sa: '3/4 (75%)' },
  half: { en: '1/2 (50%)', hi: '1/2 (50%)', sa: '1/2 (50%)' },
  quarter: { en: '1/4 (25%)', hi: '1/4 (25%)', sa: '1/4 (25%)' },

  effectTitle: { en: 'What Each Planet\'s Aspect Does', hi: 'प्रत्येक ग्रह की दृष्टि का प्रभाव', sa: 'प्रत्येकग्रहदृष्टेः फलम्' },
  jupiterEffect: {
    en: 'Jupiter\'s Aspect — Expansion, protection, wisdom, and growth. Jupiter\'s gaze on any house blesses that house\'s significations. It brings teachers, opportunity, dharmic guidance, and optimism. Jupiter aspecting the 7th house protects marriage; aspecting the 5th blesses children and creativity; aspecting the 2nd enriches wealth and family.',
    hi: 'बृहस्पति की दृष्टि — विस्तार, रक्षा, ज्ञान और वृद्धि। बृहस्पति की किसी भी भाव पर दृष्टि उस भाव के कारकत्व को आशीर्वाद देती है। यह गुरु, अवसर, धार्मिक मार्गदर्शन और आशावाद लाती है।',
    sa: 'बृहस्पतेः दृष्टिः — विस्तारः, रक्षा, ज्ञानम्, वृद्धिश्च। बृहस्पतिदृष्टिः भावकारकत्वानि आशिषा पूरयति।'
  },
  saturnEffect: {
    en: 'Saturn\'s Aspect — Restriction, discipline, delay, maturity, and karmic lessons. Saturn\'s gaze slows things down but builds lasting structures. It forces responsibility, patience, and hard work. Saturn aspecting the 7th house delays marriage but gives a mature, stable spouse; aspecting the 1st makes the native serious and hardworking; aspecting the 10th demands sustained career effort.',
    hi: 'शनि की दृष्टि — प्रतिबन्ध, अनुशासन, विलम्ब, परिपक्वता और कार्मिक पाठ। शनि की दृष्टि गति धीमी करती है किन्तु स्थायी संरचना बनाती है। यह उत्तरदायित्व, धैर्य और कठोर परिश्रम की माँग करती है।',
    sa: 'शनेः दृष्टिः — प्रतिबन्धः, अनुशासनम्, विलम्बः, परिपक्वता, कार्मिकपाठाश्च।'
  },
  marsEffect: {
    en: 'Mars\'s Aspect — Energy, aggression, courage, conflict, and the risk of surgery or accidents. Mars\'s gaze on a house energizes it but can also create friction and competition. Mars aspecting the 7th house makes marriage passionate but conflictual (this is one form of Mangal Dosha from aspect). Mars aspecting the 10th drives ambitious career pursuits but can cause workplace conflicts.',
    hi: 'मंगल की दृष्टि — ऊर्जा, आक्रामकता, साहस, संघर्ष और शल्यक्रिया/दुर्घटना का जोखिम। मंगल की दृष्टि भाव को ऊर्जावान बनाती है किन्तु घर्षण और प्रतिस्पर्धा भी उत्पन्न कर सकती है।',
    sa: 'मङ्गलस्य दृष्टिः — ऊर्जा, आक्रामकता, शौर्यम्, संघर्षः, शल्यचिकित्साजोखिमं च।'
  },
  rahuEffect: {
    en: 'Rahu\'s Aspect — Obsession, unconventional growth, foreign influence, and amplification. Rahu\'s gaze creates an insatiable desire for the aspected house\'s significations. It brings foreign connections, technological innovations, and unconventional approaches, but also confusion, deception, and materialism. Rahu aspecting the 7th can bring a spouse from a different culture.',
    hi: 'राहु की दृष्टि — आसक्ति, अपरम्परागत वृद्धि, विदेशी प्रभाव और प्रवर्धन। राहु की दृष्टि दृष्ट भाव के कारकत्वों की अतृप्त इच्छा उत्पन्न करती है। यह विदेशी सम्बन्ध और अपरम्परागत दृष्टिकोण लाती है।',
    sa: 'राहोः दृष्टिः — आसक्तिः, अपरम्परागतवृद्धिः, विदेशप्रभावः, प्रवर्धनं च।'
  },
  othersEffect: {
    en: 'Sun, Moon, Mercury, Venus — These planets cast only the standard 7th-house aspect (opposition). Sun\'s aspect brings authority and ego; Moon\'s brings emotional connection and nurturing; Mercury\'s brings communication and intellect; Venus\'s brings love, beauty, and comfort. Their influence is limited to opposition, making them less dominant in aspect analysis compared to Mars, Jupiter, and Saturn.',
    hi: 'सूर्य, चन्द्र, बुध, शुक्र — ये ग्रह केवल मानक 7वें भाव की दृष्टि (प्रतिपक्ष) डालते हैं। सूर्य की दृष्टि अधिकार और अहंकार लाती है; चन्द्र की भावनात्मक सम्बन्ध; बुध की संवाद और बुद्धि; शुक्र की प्रेम, सौन्दर्य और सुख।',
    sa: 'सूर्यचन्द्रबुधशुक्राः केवलं सप्तमभावदृष्टिं पातयन्ति।'
  },

  combosTitle: { en: 'Key Aspect Combinations', hi: 'प्रमुख दृष्टि संयोग', sa: 'प्रमुखदृष्टिसंयोगाः' },
  mathTitle: { en: 'How Our Engine Computes Aspects', hi: 'हमारा इंजन दृष्टि कैसे गणना करता है', sa: 'अस्माकं यन्त्रं दृष्टिं कथं गणयति' },
  mathContent: {
    en: 'Our Panchang engine computes aspects using precise degree-based calculations, not just house-based approximations. The actual aspect strength depends on the angular distance between two planets. A planet at 15 degrees Aries aspecting a planet at 15 degrees Libra (exact 180 degrees apart) gets full 100% aspect strength. As the orb widens, strength diminishes proportionally. We use the Tajika system for fractional aspects: full strength (Purna Drishti) at exact aspect angles, 3/4 strength (Deha Drishti) within a moderate orb, 1/2 strength (Ardha Drishti) at wider orbs, and 1/4 strength (Pada Drishti) at the edge of the orb. Special aspects of Mars (4th, 8th), Jupiter (5th, 9th), and Saturn (3rd, 10th) use the same degree-based precision.',
    hi: 'हमारा पंचांग इंजन दृष्टि की गणना सटीक अंश-आधारित पद्धति से करता है, केवल भाव-आधारित अनुमान से नहीं। वास्तविक दृष्टि बल दो ग्रहों के बीच कोणीय दूरी पर निर्भर करता है। मेष 15 अंश पर स्थित ग्रह की तुला 15 अंश पर स्थित ग्रह पर (ठीक 180 अंश दूर) पूर्ण 100% दृष्टि बल होता है। हम ताजिक पद्धति का उपयोग करते हैं: पूर्ण दृष्टि, देह दृष्टि (3/4), अर्ध दृष्टि (1/2), और पद दृष्टि (1/4)।',
    sa: 'अस्माकं पञ्चाङ्गयन्त्रं दृष्टेः गणनां सूक्ष्मांशाधारितपद्धत्या करोति। पूर्णदृष्टिः, देहदृष्टिः (3/4), अर्धदृष्टिः (1/2), पददृष्टिः (1/4) च।'
  },

  relatedTitle: { en: 'Continue Learning', hi: 'आगे पढ़ें', sa: 'अग्रे पठत' },
};

/* ── Planet data for diagram ─────────────────────────────────────── */
const PLANETS = [
  { id: 'jupiter', name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' }, color: '#facc15', aspects: [5, 7, 9], label: 'Guru' },
  { id: 'mars', name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, color: '#ef4444', aspects: [4, 7, 8], label: 'Mangal' },
  { id: 'saturn', name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, color: '#60a5fa', aspects: [3, 7, 10], label: 'Shani' },
  { id: 'rahu', name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, color: '#a78bfa', aspects: [5, 7, 9], label: 'Rahu' },
  { id: 'ketu', name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, color: '#c084fc', aspects: [5, 7, 9], label: 'Ketu' },
  { id: 'sun', name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, color: '#d4a853', aspects: [7], label: 'Surya' },
  { id: 'moon', name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, color: '#e2e8f0', aspects: [7], label: 'Chandra' },
  { id: 'mercury', name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, color: '#34d399', aspects: [7], label: 'Budha' },
  { id: 'venus', name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, color: '#f0abfc', aspects: [7], label: 'Shukra' },
];

/* Aspect strength table data */
const ASPECT_RULES = [
  { planet: { en: 'All planets', hi: 'सभी ग्रह', sa: 'सर्वे ग्रहाः' }, aspects: '7th', full: '7th', threeQ: '\u2014', half: '\u2014', quarter: '\u2014' },
  { planet: { en: 'Mars (special)', hi: 'मंगल (विशेष)', sa: 'मङ्गलः (विशेषः)' }, aspects: '4th, 8th', full: '8th', threeQ: '4th', half: '\u2014', quarter: '\u2014' },
  { planet: { en: 'Jupiter (special)', hi: 'बृहस्पति (विशेष)', sa: 'बृहस्पतिः (विशेषः)' }, aspects: '5th, 9th', full: '5th, 9th', threeQ: '\u2014', half: '\u2014', quarter: '\u2014' },
  { planet: { en: 'Saturn (special)', hi: 'शनि (विशेष)', sa: 'शनिः (विशेषः)' }, aspects: '3rd, 10th', full: '10th', threeQ: '3rd', half: '\u2014', quarter: '\u2014' },
];

/* Key combos */
const KEY_COMBOS = [
  { combo: { en: 'Jupiter aspecting 7th house', hi: 'बृहस्पति की 7वें भाव पर दृष्टि', sa: 'बृहस्पतेः सप्तमभावे दृष्टिः' },
    effect: { en: 'Marriage protected, good spouse, harmonious partnership. One of the best aspects for marital happiness.', hi: 'विवाह सुरक्षित, अच्छा जीवनसाथी, सामंजस्यपूर्ण सम्बन्ध। वैवाहिक सुख के लिए सर्वोत्तम दृष्टियों में से एक।', sa: 'विवाहरक्षितः, सुजीवनसहचरः, सामञ्जस्यपूर्णसम्बन्धः।' },
    nature: 'benefic' },
  { combo: { en: 'Saturn aspecting 7th house', hi: 'शनि की 7वें भाव पर दृष्टि', sa: 'शनेः सप्तमभावे दृष्टिः' },
    effect: { en: 'Delayed marriage, older or mature spouse. Partnership demands patience and responsibility. Marriage improves with age.', hi: 'विवाह में विलम्ब, वयस्क या परिपक्व जीवनसाथी। सम्बन्ध में धैर्य और उत्तरदायित्व की माँग। आयु के साथ विवाह सुधरता है।', sa: 'विवाहविलम्बः, वयस्कः परिपक्वः वा जीवनसहचरः।' },
    nature: 'malefic' },
  { combo: { en: 'Mars aspecting 7th house', hi: 'मंगल की 7वें भाव पर दृष्टि', sa: 'मङ्गलस्य सप्तमभावे दृष्टिः' },
    effect: { en: 'Passionate but conflictual marriage (Mangal Dosha from aspect). Spouse is energetic and assertive. Needs outlet for aggression.', hi: 'जोशपूर्ण किन्तु संघर्षपूर्ण विवाह (दृष्टि से मांगलिक दोष)। जीवनसाथी ऊर्जावान और दृढ़। आक्रामकता के लिए निकास आवश्यक।', sa: 'उत्साहपूर्णं किन्तु संघर्षपूर्णं विवाहम् (दृष्ट्या मङ्गलदोषः)।' },
    nature: 'malefic' },
  { combo: { en: 'Jupiter aspecting Moon', hi: 'बृहस्पति की चन्द्र पर दृष्टि', sa: 'बृहस्पतेः चन्द्रे दृष्टिः' },
    effect: { en: 'Gaja Kesari potential — emotional wisdom, optimism, generosity. The mind is blessed with philosophical depth and contentment.', hi: 'गज केसरी की सम्भावना — भावनात्मक ज्ञान, आशावाद, उदारता। मन दार्शनिक गहराई और सन्तोष से आशीर्वादित।', sa: 'गजकेसरीसम्भावना — भावनात्मकज्ञानम्, आशावादः, औदार्यम्।' },
    nature: 'benefic' },
  { combo: { en: 'Saturn aspecting Moon', hi: 'शनि की चन्द्र पर दृष्टि', sa: 'शनेः चन्द्रे दृष्टिः' },
    effect: { en: 'Emotional restriction, discipline, and potential for depression (Visha Yoga tendency). The mind becomes serious, brooding, and prone to worry. However, it also gives deep focus and emotional resilience over time.', hi: 'भावनात्मक प्रतिबन्ध, अनुशासन और अवसाद की सम्भावना (विष योग प्रवृत्ति)। मन गम्भीर और चिन्ताग्रस्त होता है, किन्तु गहन एकाग्रता और भावनात्मक दृढ़ता भी देता है।', sa: 'भावनात्मकप्रतिबन्धः, अनुशासनम्, अवसादसम्भावना च (विषयोगप्रवृत्तिः)।' },
    nature: 'malefic' },
  { combo: { en: 'Mars aspecting Saturn', hi: 'मंगल की शनि पर दृष्टि', sa: 'मङ्गलस्य शनौ दृष्टिः' },
    effect: { en: 'Friction, frustration, accident-prone periods. Fire (Mars) meets ice (Saturn) — creates intense tension. Can manifest as muscular-skeletal issues, workplace conflicts, or engineering/military excellence when channelled.', hi: 'घर्षण, निराशा, दुर्घटना-प्रवण काल। अग्नि (मंगल) और हिम (शनि) का मिलन — तीव्र तनाव। सही दिशा में अभियान्त्रिकी/सैन्य उत्कृष्टता में परिवर्तित हो सकता है।', sa: 'घर्षणम्, निराशा, दुर्घटनाप्रवणकालः। अग्निः (मङ्गलः) हिमेन (शनिना) सह — तीव्रतनावः।' },
    nature: 'malefic' },
];

const RELATED_LINKS = [
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएं', sa: 'स्वकुण्डलीं रचयत' } },
  { href: '/learn/grahas', label: { en: 'Learn: The Nine Planets', hi: 'पढ़ें: नवग्रह', sa: 'पठत: नवग्रहाः' } },
  { href: '/learn/bhavas', label: { en: 'Learn: The 12 Houses', hi: 'पढ़ें: 12 भाव', sa: 'पठत: 12 भावाः' } },
];

/* ── SVG Aspect Wheel ─────────────────────────────────────────── */
function AspectWheel({ selectedPlanet, locale }: { selectedPlanet: typeof PLANETS[0] | null; locale: Locale }) {
  const cx = 200, cy = 200, r = 160, innerR = 120;
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);

  // Position each house label around the circle (house 1 at top, clockwise)
  const housePos = (house: number) => {
    const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
    return {
      x: cx + (r + 22) * Math.cos(angle),
      y: cy + (r + 22) * Math.sin(angle),
    };
  };

  // Inner point for aspect lines
  const innerPos = (house: number) => {
    const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
    return {
      x: cx + innerR * Math.cos(angle),
      y: cy + innerR * Math.sin(angle),
    };
  };

  // Segment boundaries
  const segmentPath = (house: number) => {
    const startAngle = ((house - 1.5) * 30 - 90) * (Math.PI / 180);
    const endAngle = ((house - 0.5) * 30 - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);
    return `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 0 0 ${ix1} ${iy1}`;
  };

  const sourceHouse = 1; // Planet always placed in house 1 for demo
  const from = innerPos(sourceHouse);

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[400px] mx-auto">
      <defs>
        <radialGradient id="wheelBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1f4e" />
          <stop offset="100%" stopColor="#0a0e27" />
        </radialGradient>
        <filter id="aspectGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill="url(#wheelBg)" stroke="#d4a85333" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#d4a85322" strokeWidth="1" />

      {/* Segments */}
      {houses.map((h) => {
        const isSource = selectedPlanet && h === sourceHouse;
        const isAspected = selectedPlanet && selectedPlanet.aspects.includes(h);
        let fillColor = 'transparent';
        if (isSource) fillColor = selectedPlanet.color + '30';
        else if (isAspected) fillColor = selectedPlanet.color + '18';
        return (
          <path key={h} d={segmentPath(h)} fill={fillColor} stroke="#d4a85320" strokeWidth="0.5" />
        );
      })}

      {/* Dividing lines */}
      {houses.map((h) => {
        const angle = ((h - 1.5) * 30 - 90) * (Math.PI / 180);
        const ox = cx + r * Math.cos(angle);
        const oy = cy + r * Math.sin(angle);
        const ix = cx + innerR * Math.cos(angle);
        const iy = cy + innerR * Math.sin(angle);
        return <line key={h} x1={ix} y1={iy} x2={ox} y2={oy} stroke="#d4a85325" strokeWidth="0.5" />;
      })}

      {/* Aspect lines */}
      {selectedPlanet && selectedPlanet.aspects.map((targetHouse) => {
        const to = innerPos(targetHouse);
        return (
          <line
            key={targetHouse}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke={selectedPlanet.color}
            strokeWidth="2.5"
            strokeDasharray={targetHouse === 7 ? 'none' : '6 3'}
            opacity="0.85"
            filter="url(#aspectGlow)"
          />
        );
      })}

      {/* House labels */}
      {houses.map((h) => {
        const pos = housePos(h);
        const isAspected = selectedPlanet && selectedPlanet.aspects.includes(h);
        const isSource = selectedPlanet && h === sourceHouse;
        return (
          <text
            key={h} x={pos.x} y={pos.y}
            textAnchor="middle" dominantBaseline="central"
            className="text-xs font-bold"
            fill={isSource ? (selectedPlanet?.color || '#d4a853') : isAspected ? (selectedPlanet?.color || '#d4a853') : '#8b8fa3'}
          >
            {h}
          </text>
        );
      })}

      {/* Source planet marker */}
      {selectedPlanet && (
        <>
          <circle
            cx={innerPos(sourceHouse).x} cy={innerPos(sourceHouse).y}
            r="10" fill={selectedPlanet.color + '40'} stroke={selectedPlanet.color} strokeWidth="1.5"
          />
          <text
            x={innerPos(sourceHouse).x} y={innerPos(sourceHouse).y}
            textAnchor="middle" dominantBaseline="central"
            className="text-xs font-bold" fill={selectedPlanet.color}
          >
            {selectedPlanet.label.substring(0, 2)}
          </text>
        </>
      )}

      {/* Aspect target markers */}
      {selectedPlanet && selectedPlanet.aspects.map((targetHouse) => {
        const pos = innerPos(targetHouse);
        return (
          <circle key={targetHouse}
            cx={pos.x} cy={pos.y} r="5"
            fill={selectedPlanet.color + '50'} stroke={selectedPlanet.color} strokeWidth="1"
          />
        );
      })}

      {/* Center text */}
      {!selectedPlanet && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          className="text-xs" fill="#8b8fa3">
          {locale === 'en' || String(locale) === 'ta' ? 'Select a planet' : locale === 'hi' ? 'ग्रह चुनें' : 'ग्रहं चिनुत'}
        </text>
      )}
      {selectedPlanet && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          className="text-xs font-bold" fill={selectedPlanet.color}>
          {selectedPlanet.name[locale]}
        </text>
      )}
    </svg>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function AspectsPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const [selected, setSelected] = useState<typeof PLANETS[0] | null>(PLANETS[0]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {((L.title as Record<string, string>)[locale] ?? L.title.en)}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl" style={bodyFont}>
          {((L.subtitle as Record<string, string>)[locale] ?? L.subtitle.en)}
        </p>
      </div>

      {/* Section 1: What are Aspects */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-6 h-6 text-gold-light" />
          <h3 className="text-gold-gradient text-xl font-bold" style={headingFont}>{((L.whatTitle as Record<string, string>)[locale] ?? L.whatTitle.en)}</h3>
        </div>
        <div className="space-y-3" style={bodyFont}>
          <p className="text-text-secondary text-sm leading-relaxed">{((L.whatContent as Record<string, string>)[locale] ?? L.whatContent.en)}</p>
          <p className="text-text-secondary text-sm leading-relaxed">{((L.whatContent2 as Record<string, string>)[locale] ?? L.whatContent2.en)}</p>
          <p className="text-text-secondary text-sm leading-relaxed">{((L.whatContent3 as Record<string, string>)[locale] ?? L.whatContent3.en)}</p>
        </div>
      </motion.div>

      {/* Interactive Aspect Diagram */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-2" style={headingFont}>{((L.diagramTitle as Record<string, string>)[locale] ?? L.diagramTitle.en)}</h3>
        <p className="text-text-secondary text-xs mb-4" style={bodyFont}>{((L.diagramHint as Record<string, string>)[locale] ?? L.diagramHint.en)}</p>

        {/* Planet selector buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PLANETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(selected?.id === p.id ? null : p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                selected?.id === p.id
                  ? 'border-current bg-white/5 scale-105'
                  : 'border-white/10 hover:border-white/25 bg-white/2'
              }`}
              style={{ color: p.color }}
            >
              {p.name[locale]}
            </button>
          ))}
        </div>

        <AspectWheel selectedPlanet={selected} locale={locale} />

        {selected && (
          <div className="mt-4 text-center">
            <p className="text-xs text-text-secondary" style={bodyFont}>
              <span style={{ color: selected.color }} className="font-bold">{selected.name[locale]}</span>
              {' '}{((L.placedIn as Record<string, string>)[locale] ?? L.placedIn.en)}
              {' \u2192 '}{locale === 'en' || String(locale) === 'ta' ? 'Aspects houses' : locale === 'hi' ? 'दृष्टि भाव' : 'दृष्टिभावाः'}{': '}
              <span style={{ color: selected.color }} className="font-bold">
                {selected.aspects.join(', ')}
              </span>
            </p>
          </div>
        )}
      </motion.div>

      {/* Section 2: Aspect Rules Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-gold-light" />
          <h3 className="text-gold-gradient text-xl font-bold" style={headingFont}>{((L.rulesTitle as Record<string, string>)[locale] ?? L.rulesTitle.en)}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="py-2 px-3 text-left text-gold-light font-bold" style={headingFont}>{((L.planet as Record<string, string>)[locale] ?? L.planet.en)}</th>
                <th className="py-2 px-3 text-left text-gold-light font-bold" style={headingFont}>{((L.aspects as Record<string, string>)[locale] ?? L.aspects.en)}</th>
                <th className="py-2 px-3 text-center text-emerald-400 font-bold">{((L.full as Record<string, string>)[locale] ?? L.full.en)}</th>
                <th className="py-2 px-3 text-center text-yellow-400 font-bold">{((L.threeQ as Record<string, string>)[locale] ?? L.threeQ.en)}</th>
                <th className="py-2 px-3 text-center text-orange-400 font-bold">{((L.half as Record<string, string>)[locale] ?? L.half.en)}</th>
                <th className="py-2 px-3 text-center text-red-400 font-bold">{((L.quarter as Record<string, string>)[locale] ?? L.quarter.en)}</th>
              </tr>
            </thead>
            <tbody>
              {ASPECT_RULES.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2.5 px-3 text-text-primary font-medium" style={bodyFont}>{row.planet[locale]}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{row.aspects}</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">{row.full}</td>
                  <td className="py-2.5 px-3 text-center text-yellow-400">{row.threeQ}</td>
                  <td className="py-2.5 px-3 text-center text-orange-400">{row.half}</td>
                  <td className="py-2.5 px-3 text-center text-red-400">{row.quarter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Section 3: What Each Planet's Aspect Does */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-5" style={headingFont}>{((L.effectTitle as Record<string, string>)[locale] ?? L.effectTitle.en)}</h3>
        <div className="space-y-4" style={bodyFont}>
          {[
            { label: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' }, color: '#facc15', text: L.jupiterEffect },
            { label: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, color: '#60a5fa', text: L.saturnEffect },
            { label: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, color: '#ef4444', text: L.marsEffect },
            { label: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, color: '#a78bfa', text: L.rahuEffect },
            { label: { en: 'Sun / Moon / Mercury / Venus', hi: 'सूर्य / चन्द्र / बुध / शुक्र', sa: 'सूर्य / चन्द्र / बुध / शुक्र' }, color: '#d4a853', text: L.othersEffect },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-white/5 p-4 bg-white/2">
              <h4 className="text-sm font-bold mb-2" style={{ color: item.color, ...headingFont }}>
                {item.label[locale]}
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed">{item.text[locale]}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 4: Key Aspect Combinations */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-5" style={headingFont}>{((L.combosTitle as Record<string, string>)[locale] ?? L.combosTitle.en)}</h3>
        <div className="space-y-3">
          {KEY_COMBOS.map((combo, i) => (
            <div key={i}
              className={`rounded-xl p-4 border ${
                combo.nature === 'benefic' ? 'border-emerald-500/15 bg-emerald-500/3' : 'border-red-500/10 bg-red-500/3'
              }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${combo.nature === 'benefic' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <h4 className="text-sm font-bold text-text-primary" style={headingFont}>{combo.combo[locale]}</h4>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed ml-4" style={bodyFont}>
                {combo.effect[locale]}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 5: Math / Engine */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-violet-400/15 bg-violet-400/3">
        <h3 className="text-violet-300 text-lg font-bold mb-3" style={headingFont}>{((L.mathTitle as Record<string, string>)[locale] ?? L.mathTitle.en)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>{((L.mathContent as Record<string, string>)[locale] ?? L.mathContent.en)}</p>
      </motion.div>

      {/* Related Links */}
      <div>
        <h3 className="text-gold-gradient text-lg font-bold mb-4" style={headingFont}>{((L.relatedTitle as Record<string, string>)[locale] ?? L.relatedTitle.en)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RELATED_LINKS.map((link, i) => (
            <Link key={i} href={link.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 hover:border-gold-primary/30 transition-colors flex items-center justify-between group">
              <span className="text-sm text-text-primary font-medium" style={bodyFont}>{link.label[locale]}</span>
              <ArrowRight className="w-4 h-4 text-gold-primary/50 group-hover:text-gold-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
