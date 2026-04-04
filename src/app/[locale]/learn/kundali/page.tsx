'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import HouseHighlightChart from '@/components/learn/HouseHighlightChart';
import ExampleKundaliChart from '@/components/learn/ExampleKundaliChart';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ─── Trilingual Labels ─── */
const L = {
  title: { en: 'How a Kundali is Made', hi: 'कुण्डली कैसे बनती है', sa: 'कुण्डली कथं रच्यते' },
  subtitle: {
    en: 'A complete step-by-step walkthrough — from birth data to finished chart — using a worked example',
    hi: 'एक सम्पूर्ण चरणबद्ध मार्गदर्शिका — जन्म विवरण से पूर्ण कुण्डली तक — एक उदाहरण के साथ',
    sa: 'सम्पूर्णं सोपानमार्गदर्शनम् — जन्मविवरणात् पूर्णकुण्डलीपर्यन्तम् — उदाहरणसहितम्',
  },

  // Overview
  overviewTitle: { en: 'What is a Kundali?', hi: 'कुण्डली क्या है?', sa: 'कुण्डली का?' },
  overviewText: {
    en: 'A Kundali (Janam Patri / birth chart) is a map of the sky at the exact moment and place of your birth. It captures which zodiac signs and planets occupied which houses, forming a unique cosmic fingerprint. Every element — the rising sign (Lagna), the nine Grahas, the 12 Bhavas, the Dashas — flows from three simple inputs: date, time, and place of birth. This page walks through every step of how we turn those three inputs into a complete chart.',
    hi: 'कुण्डली (जन्म पत्री) आपके जन्म के ठीक उस क्षण और स्थान पर आकाश का नक्शा है। यह दर्शाती है कि कौन सी राशियाँ और ग्रह किन भावों में थे। प्रत्येक तत्व — लग्न, नौ ग्रह, 12 भाव, दशाएँ — तीन सरल आदानों से उत्पन्न होते हैं: जन्म तिथि, समय और स्थान। यह पृष्ठ प्रत्येक चरण का मार्गदर्शन करता है।',
    sa: 'कुण्डली जन्मक्षणे स्थाने च आकाशस्य मानचित्रम्। सर्वं तत्त्वं — लग्नं, नवग्रहाः, द्वादशभावाः — त्रिभिः आदानैः जायते: जन्मतिथिः, समयः, स्थानं च।',
  },

  // Example birth
  exampleTitle: { en: 'Our Worked Example', hi: 'हमारा उदाहरण', sa: 'अस्माकम् उदाहरणम्' },
  exampleText: {
    en: 'We will follow one example birth through every step to show how abstract numbers become a living chart:',
    hi: 'हम एक उदाहरण जन्म को प्रत्येक चरण में अनुसरण करेंगे ताकि दिखा सकें कि कैसे संख्याएँ एक जीवित कुण्डली बनती हैं:',
    sa: 'वयम् एकं जन्मोदाहरणं प्रत्येकसोपाने अनुसरिष्यामः:',
  },

  // Step 1: Birth Data
  s1Title: { en: 'Step 1: The Three Inputs', hi: 'चरण 1: तीन आवश्यक आदान', sa: 'सोपानम् 1: त्रीणि आवश्यकानि' },
  s1Text: {
    en: 'Every Kundali begins with exactly three pieces of information. Each determines a different aspect of the chart:',
    hi: 'प्रत्येक कुण्डली ठीक तीन सूचनाओं से शुरू होती है। प्रत्येक कुण्डली के एक भिन्न पहलू को निर्धारित करती है:',
    sa: 'प्रत्येका कुण्डली तिसृभिः सूचनाभिः आरभ्यते:',
  },
  s1Date: {
    en: 'Date of Birth — determines where the Sun and planets are in the zodiac. The Sun moves ~1° per day, so even one day changes your chart.',
    hi: 'जन्म तिथि — सूर्य और ग्रह राशिचक्र में कहाँ हैं यह निर्धारित करती है। सूर्य प्रतिदिन ~1° चलता है।',
    sa: 'जन्मतिथिः — सूर्यः ग्रहाः च राशिचक्रे कुत्र सन्ति इति निर्धारयति।',
  },
  s1Time: {
    en: 'Time of Birth — determines the Lagna (ascendant). The rising sign changes every ~2 hours, so accuracy to the minute matters. A 4-minute error can shift the Navamsha division.',
    hi: 'जन्म समय — लग्न (उदय राशि) निर्धारित करता है। उदय राशि हर ~2 घण्टे बदलती है, इसलिए मिनट तक की सटीकता महत्वपूर्ण है।',
    sa: 'जन्मसमयः — लग्नं निर्धारयति। उदयराशिः प्रत्येकं ~2 होरासु परिवर्तते।',
  },
  s1Place: {
    en: 'Place of Birth — provides the geographic latitude and longitude. Latitude affects which sign rises, and longitude converts clock time to the exact local solar time.',
    hi: 'जन्म स्थान — भौगोलिक अक्षांश और देशान्तर प्रदान करता है। अक्षांश प्रभावित करता है कौन सी राशि उदित होती है।',
    sa: 'जन्मस्थानम् — भौगोलिकं अक्षांशं देशान्तरं च ददाति।',
  },

  // Step 2: Time Conversion
  s2Title: { en: 'Step 2: Converting Time', hi: 'चरण 2: समय रूपान्तरण', sa: 'सोपानम् 2: समयपरिवर्तनम्' },
  s2Text: {
    en: 'Astronomical calculations require Universal Time (UT), not local clock time. We also need the Julian Day Number — a continuous day count used by astronomers since 4713 BCE.',
    hi: 'खगोलीय गणनाओं के लिए सार्वभौमिक समय (UT) आवश्यक है, स्थानीय घड़ी का समय नहीं। हमें जूलियन दिन संख्या भी चाहिए — खगोलशास्त्रियों द्वारा प्रयुक्त निरन्तर दिन गणना।',
    sa: 'खगोलीयगणनार्थं सार्वभौमिकसमयः (UT) आवश्यकः, न स्थानीयसमयः।',
  },

  // Step 3: Sidereal Time
  s3Title: { en: 'Step 3: Local Sidereal Time (LST)', hi: 'चरण 3: स्थानीय नाक्षत्रिक समय (LST)', sa: 'सोपानम् 3: स्थानीयनाक्षत्रिकसमयः' },
  s3Text: {
    en: 'Sidereal time measures the Earth\'s rotation relative to the stars (not the Sun). It tells us which part of the zodiac is directly overhead right now. The LST at your birth location and time is the key to finding your Lagna.',
    hi: 'नाक्षत्रिक समय पृथ्वी के घूर्णन को तारों (सूर्य नहीं) के सापेक्ष मापता है। यह बताता है कि राशिचक्र का कौन सा भाग अभी ठीक ऊपर है। आपके जन्म स्थान और समय पर LST लग्न ज्ञात करने की कुंजी है।',
    sa: 'नाक्षत्रिकसमयः पृथिव्याः भ्रमणं ताराणां सापेक्षं (न सूर्यस्य) मापयति।',
  },

  // Step 4: Lagna
  s4Title: { en: 'Step 4: Finding the Lagna', hi: 'चरण 4: लग्न ज्ञात करना', sa: 'सोपानम् 4: लग्नज्ञानम्' },
  s4Text: {
    en: 'The Lagna (ascendant) is the zodiac sign rising on the eastern horizon at the moment of birth. It becomes the 1st house and anchors the entire chart. The Lagna degree is calculated from LST and geographic latitude using spherical trigonometry.',
    hi: 'लग्न (उदय राशि) जन्म के क्षण पूर्वी क्षितिज पर उदित होने वाली राशि है। यह प्रथम भाव बन जाती है और सम्पूर्ण कुण्डली की नींव रखती है।',
    sa: 'लग्नं जन्मक्षणे पूर्वक्षितिजे उदयमाना राशिः। एषा प्रथमभावः भवति सम्पूर्णकुण्डल्याः आधारं करोति च।',
  },

  // Step 5: Ayanamsha
  s5Title: { en: 'Step 5: Ayanamsha — Tropical to Sidereal', hi: 'चरण 5: अयनांश — उष्णकटिबन्धीय से नाक्षत्रिक', sa: 'सोपानम् 5: अयनांशः' },
  s5Text: {
    en: 'Our astronomical algorithms (Meeus) give tropical longitudes — positions relative to the spring equinox. But Vedic astrology uses sidereal longitudes — positions relative to the fixed stars. The difference is the Ayanamsha, currently ~24°. We subtract it from every calculated position.',
    hi: 'हमारे खगोलीय एल्गोरिथ्म उष्णकटिबन्धीय देशान्तर देते हैं — वसन्त विषुव के सापेक्ष स्थिति। लेकिन वैदिक ज्योतिष नाक्षत्रिक देशान्तर का उपयोग करता है — स्थिर तारों के सापेक्ष। अन्तर अयनांश है, वर्तमान में ~24°।',
    sa: 'अस्माकं खगोलीयगणितानि उष्णकटिबन्धीयदेशान्तरं ददति। वैदिकज्योतिषं नाक्षत्रिकदेशान्तरं प्रयुङ्क्ते। भेदः अयनांशः, इदानीं ~24°।',
  },

  // Step 6: Planet Positions
  s6Title: { en: 'Step 6: Planet Positions', hi: 'चरण 6: ग्रह स्थिति', sa: 'सोपानम् 6: ग्रहस्थितिः' },
  s6Text: {
    en: 'Using the Julian Day, we calculate the sidereal longitude of each of the nine Grahas. The Sun and Moon use Meeus algorithms; Mars through Saturn use planetary perturbation models. Rahu and Ketu (lunar nodes) are derived from the Moon\'s orbital plane. Each planet lands in a specific Rashi (sign) and Nakshatra (lunar mansion).',
    hi: 'जूलियन दिन का उपयोग करके, हम नौ ग्रहों में से प्रत्येक का नाक्षत्रिक देशान्तर गणना करते हैं। सूर्य और चन्द्र Meeus एल्गोरिथ्म का उपयोग करते हैं। प्रत्येक ग्रह एक विशिष्ट राशि और नक्षत्र में आता है।',
    sa: 'जूलियनदिनं प्रयुज्य, वयं नवग्रहाणां प्रत्येकस्य नाक्षत्रिकदेशान्तरं गणयामः।',
  },

  // Step 7: House Mapping
  s7Title: { en: 'Step 7: Mapping Planets to Houses', hi: 'चरण 7: ग्रहों को भावों में रखना', sa: 'सोपानम् 7: ग्रहाणां भावेषु स्थापनम्' },
  s7Text: {
    en: 'In the Whole-Sign house system (standard Vedic), the Lagna\'s Rashi becomes the entire 1st house. The next Rashi becomes the 2nd house, and so on around the zodiac. To place a planet, we simply count how many signs it is from the Lagna sign.',
    hi: 'पूर्ण-राशि भाव पद्धति (मानक वैदिक) में, लग्न की राशि सम्पूर्ण प्रथम भाव बन जाती है। अगली राशि द्वितीय भाव बनती है, इत्यादि। ग्रह को रखने के लिए, हम गिनते हैं कि वह लग्न राशि से कितनी राशियाँ दूर है।',
    sa: 'पूर्णराशिभावपद्धत्यां, लग्नस्य राशिः सकला प्रथमभावः भवति। अग्रिमा राशिः द्वितीयभावः, एवम् अग्रे।',
  },

  // Step 8: The Chart
  s8Title: { en: 'Step 8: Drawing the Chart', hi: 'चरण 8: कुण्डली का चित्रण', sa: 'सोपानम् 8: कुण्डल्याः चित्रणम्' },
  s8Text: {
    en: 'The North Indian chart is a diamond grid where house positions are fixed — House 1 is always at the top. The Rashi names rotate based on the Lagna. Here is our completed example chart with all planets placed:',
    hi: 'उत्तर भारतीय कुण्डली एक हीरे के आकार की जाली है जहाँ भाव स्थितियाँ स्थिर हैं — भाव 1 सदा शीर्ष पर है। राशि नाम लग्न के आधार पर घूमते हैं। यहाँ सभी ग्रहों सहित हमारी पूर्ण उदाहरण कुण्डली है:',
    sa: 'उत्तरभारतीयकुण्डली हीराकारजाला यत्र भावस्थानानि स्थिराणि — भावः 1 सदा शीर्षे। यत्र सर्वे ग्रहाः स्थापिताः सा पूर्णोदाहरणकुण्डली:',
  },

  // Step 9: Planet Dignity
  s9Title: { en: 'Step 9: Planet Dignity & Strength', hi: 'चरण 9: ग्रह गरिमा और बल', sa: 'सोपानम् 9: ग्रहगरिमा बलं च' },
  s9Text: {
    en: 'Not all planet placements are equal. Each Graha has signs where it is strongest (Uccha/exalted), weakest (Neecha/debilitated), or comfortable (Swa Rashi/own sign). A debilitated planet gives diminished results; an exalted one amplifies them. Combustion (Asta) occurs when a planet is too close to the Sun.',
    hi: 'सभी ग्रह स्थितियाँ समान नहीं हैं। प्रत्येक ग्रह की ऐसी राशियाँ हैं जहाँ वह सबसे शक्तिशाली (उच्च), सबसे कमज़ोर (नीच), या सहज (स्वराशि) होता है। नीच ग्रह कम परिणाम देता है; उच्च ग्रह उन्हें बढ़ाता है।',
    sa: 'सर्वाणि ग्रहस्थानानि न समानि। प्रत्येकस्य ग्रहस्य उच्चं, नीचं, स्वराशिः च अस्ति।',
  },

  // Step 10: Aspects & Lordships
  s10Title: { en: 'Step 10: Aspects & House Lordships', hi: 'चरण 10: दृष्टि और भाव स्वामित्व', sa: 'सोपानम् 10: दृष्टिः भावस्वामित्वं च' },
  s10Text: {
    en: 'Every planet casts Drishti (aspect) on other houses. All planets have a 7th-house aspect (opposite). Mars additionally aspects the 4th and 8th; Jupiter the 5th and 9th; Saturn the 3rd and 10th. Each planet also lords over (owns) specific houses based on its rulership signs. The lord of a house carries that house\'s significations wherever it sits.',
    hi: 'प्रत्येक ग्रह अन्य भावों पर दृष्टि डालता है। सभी ग्रहों की 7वें भाव पर दृष्टि होती है। मंगल की 4 और 8 पर, गुरु की 5 और 9 पर, शनि की 3 और 10 पर अतिरिक्त दृष्टि होती है। प्रत्येक ग्रह अपनी स्वामित्व राशियों के आधार पर विशिष्ट भावों का स्वामी होता है।',
    sa: 'प्रत्येकः ग्रहः अन्यभावेषु दृष्टिं क्षिपति। सर्वग्रहाणां 7 भावे दृष्टिः। मङ्गलस्य 4, 8; गुरोः 5, 9; शनेः 3, 10 अतिरिक्तदृष्टिः।',
  },

  // Step 11: Dashas
  s11Title: { en: 'Step 11: Dashas — The Timing System', hi: 'चरण 11: दशा — समय प्रणाली', sa: 'सोपानम् 11: दशाः — कालप्रणालिः' },
  s11Text: {
    en: 'The Vimshottari Dasha system divides life into planetary periods based on the Moon\'s Nakshatra at birth. The Nakshatra lord becomes the first Maha Dasha lord, and the Moon\'s progress through that Nakshatra determines how much of that period remains at birth. This creates a unique timeline for each person.',
    hi: 'विंशोत्तरी दशा प्रणाली जन्म के समय चन्द्र के नक्षत्र के आधार पर जीवन को ग्रह अवधियों में विभाजित करती है। नक्षत्र स्वामी प्रथम महादशा स्वामी बनता है। यह प्रत्येक व्यक्ति के लिए एक अद्वितीय समयरेखा बनाता है।',
    sa: 'विंशोत्तरीदशापद्धतिः जन्मसमये चन्द्रनक्षत्रस्य आधारेण जीवनं ग्रहकालखण्डेषु विभजति।',
  },

  // Step 12: Yogas & Doshas
  s12Title: { en: 'Step 12: Yogas & Doshas', hi: 'चरण 12: योग और दोष', sa: 'सोपानम् 12: योगाः दोषाः च' },
  s12Text: {
    en: 'Yogas are special planetary combinations that indicate specific life patterns — wealth (Dhana Yoga), wisdom (Budhaditya Yoga), power (Raja Yoga), or spiritual inclination (Sanyasa Yoga). Doshas are afflictions: Mangal Dosha (Mars in certain houses), Kaal Sarpa (all planets between Rahu-Ketu), and Pitru Dosha (Sun afflicted). Our engine checks for 11 yogas and 3 doshas automatically.',
    hi: 'योग विशेष ग्रह संयोजन हैं जो विशिष्ट जीवन प्रतिमानों को इंगित करते हैं — धन (धन योग), ज्ञान (बुधादित्य योग), शक्ति (राजयोग)। दोष कठिनाइयाँ हैं: मंगल दोष, काल सर्प दोष, पितृ दोष। हमारा इंजन 11 योगों और 3 दोषों की स्वचालित जाँच करता है।',
    sa: 'योगाः विशेषग्रहसंयोजनानि — धनयोगः, बुधादित्ययोगः, राजयोगः। दोषाः कठिनतायाः — मङ्गलदोषः, कालसर्पदोषः, पितृदोषः।',
  },

  // Step 13: Reading the Chart
  s13Title: { en: 'Putting It All Together', hi: 'सब कुछ एक साथ', sa: 'सर्वं समाहृत्य' },
  s13Text: {
    en: 'A Kundali reading weaves all these layers: the Lagna reveals personality, planet placements show life areas, dignity shows strength, aspects create connections, lordships link houses, Dashas provide timing, and Yogas/Doshas flag special patterns. No single factor is read in isolation — it is the interplay of all elements that forms the complete picture.',
    hi: 'कुण्डली पठन इन सभी परतों को बुनता है: लग्न व्यक्तित्व प्रकट करता है, ग्रह स्थितियाँ जीवन क्षेत्र दिखाती हैं, गरिमा बल दिखाती है, दृष्टि सम्बन्ध बनाती है, स्वामित्व भावों को जोड़ता है, दशाएँ समय प्रदान करती हैं, और योग/दोष विशेष प्रतिमान इंगित करते हैं।',
    sa: 'कुण्डलीपठनं सर्वाणि एतानि स्तराणि समावेशयति। एकमपि तत्त्वं पृथक् न पठ्यते — सर्वेषां तत्त्वानां परस्परक्रीडा सम्पूर्णचित्रं रचयति।',
  },

  deeper: { en: 'Dive Deeper', hi: 'और गहराई में', sa: 'गहनतरम्' },
  tryIt: { en: 'Generate Your Kundali Now', hi: 'अभी अपनी कुण्डली बनाएँ', sa: 'इदानीं स्वकुण्डलीं रचयतु' },
};

/* ─── Data for Steps ─── */

// Step 6: Planet positions table for the example
const EXAMPLE_PLANETS = [
  { id: 'Su', name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, tropical: '142.3°', sidereal: '118.5°', rashi: { en: 'Cancer (Karka)', hi: 'कर्क', sa: 'कर्कः' }, nak: { en: 'Ashlesha', hi: 'आश्लेषा', sa: 'आश्लेषा' }, color: '#f59e0b' },
  { id: 'Mo', name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, tropical: '276.8°', sidereal: '253.0°', rashi: { en: 'Sagittarius (Dhanu)', hi: 'धनु', sa: 'धनुः' }, nak: { en: 'P. Ashadha', hi: 'पूर्वाषाढ़ा', sa: 'पूर्वाषाढा' }, color: '#e2e8f0' },
  { id: 'Ma', name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, tropical: '195.1°', sidereal: '171.3°', rashi: { en: 'Virgo (Kanya)', hi: 'कन्या', sa: 'कन्या' }, nak: { en: 'U. Phalguni', hi: 'उत्तर फाल्गुनी', sa: 'उत्तरफाल्गुनी' }, color: '#ef4444' },
  { id: 'Me', name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, tropical: '155.9°', sidereal: '132.1°', rashi: { en: 'Leo (Simha)', hi: 'सिंह', sa: 'सिंहः' }, nak: { en: 'P. Phalguni', hi: 'पूर्व फाल्गुनी', sa: 'पूर्वफाल्गुनी' }, color: '#22c55e' },
  { id: 'Ju', name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, tropical: '240.6°', sidereal: '216.8°', rashi: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक', sa: 'वृश्चिकः' }, nak: { en: 'Vishakha', hi: 'विशाखा', sa: 'विशाखा' }, color: '#f0d48a' },
  { id: 'Ve', name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, tropical: '148.2°', sidereal: '124.4°', rashi: { en: 'Leo (Simha)', hi: 'सिंह', sa: 'सिंहः' }, nak: { en: 'Magha', hi: 'मघा', sa: 'मघा' }, color: '#ec4899' },
  { id: 'Sa', name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, tropical: '336.4°', sidereal: '312.6°', rashi: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ', sa: 'कुम्भः' }, nak: { en: 'Shatabhisha', hi: 'शतभिषा', sa: 'शतभिषा' }, color: '#3b82f6' },
  { id: 'Ra', name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, tropical: '207.5°', sidereal: '183.7°', rashi: { en: 'Libra (Tula)', hi: 'तुला', sa: 'तुला' }, nak: { en: 'Swati', hi: 'स्वाति', sa: 'स्वाती' }, color: '#8b5cf6' },
  { id: 'Ke', name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, tropical: '27.5°', sidereal: '3.7°', rashi: { en: 'Aries (Mesha)', hi: 'मेष', sa: 'मेषः' }, nak: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, color: '#9ca3af' },
];

// Step 7: House mapping for the example (Tula Lagna)
const EXAMPLE_HOUSES = [
  { house: 1, rashi: { en: 'Libra (Tula)', hi: 'तुला', sa: 'तुला' }, planets: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' } },
  { house: 2, rashi: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक', sa: 'वृश्चिकः' }, planets: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' } },
  { house: 3, rashi: { en: 'Sagittarius (Dhanu)', hi: 'धनु', sa: 'धनुः' }, planets: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' } },
  { house: 4, rashi: { en: 'Capricorn (Makara)', hi: 'मकर', sa: 'मकरः' }, planets: { en: '—', hi: '—', sa: '—' } },
  { house: 5, rashi: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ', sa: 'कुम्भः' }, planets: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' } },
  { house: 6, rashi: { en: 'Pisces (Meena)', hi: 'मीन', sa: 'मीनः' }, planets: { en: '—', hi: '—', sa: '—' } },
  { house: 7, rashi: { en: 'Aries (Mesha)', hi: 'मेष', sa: 'मेषः' }, planets: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' } },
  { house: 8, rashi: { en: 'Taurus (Vrishabha)', hi: 'वृषभ', sa: 'वृषभः' }, planets: { en: '—', hi: '—', sa: '—' } },
  { house: 9, rashi: { en: 'Gemini (Mithuna)', hi: 'मिथुन', sa: 'मिथुनम्' }, planets: { en: '—', hi: '—', sa: '—' } },
  { house: 10, rashi: { en: 'Cancer (Karka)', hi: 'कर्क', sa: 'कर्कः' }, planets: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' } },
  { house: 11, rashi: { en: 'Leo (Simha)', hi: 'सिंह', sa: 'सिंहः' }, planets: { en: 'Mercury, Venus', hi: 'बुध, शुक्र', sa: 'बुधः, शुक्रः' } },
  { house: 12, rashi: { en: 'Virgo (Kanya)', hi: 'कन्या', sa: 'कन्या' }, planets: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' } },
];

// Step 9: Dignity examples for the chart
const DIGNITY_EXAMPLES = [
  { planet: { en: 'Jupiter in Scorpio', hi: 'वृश्चिक में गुरु', sa: 'वृश्चिके गुरुः' }, status: { en: 'Neutral (friendly sign)', hi: 'तटस्थ (मित्र राशि)', sa: 'तटस्थः (मित्रराशिः)' }, color: '#f0d48a' },
  { planet: { en: 'Saturn in Aquarius', hi: 'कुम्भ में शनि', sa: 'कुम्भे शनिः' }, status: { en: 'Own Sign (Swa Rashi) — strong', hi: 'स्वराशि — बलवान', sa: 'स्वराशिः — बलवान्' }, color: '#34d399' },
  { planet: { en: 'Mars in Virgo', hi: 'कन्या में मंगल', sa: 'कन्यायां मङ्गलः' }, status: { en: 'Enemy sign — weakened', hi: 'शत्रु राशि — दुर्बल', sa: 'शत्रुराशिः — दुर्बलः' }, color: '#f87171' },
  { planet: { en: 'Sun in Cancer', hi: 'कर्क में सूर्य', sa: 'कर्के सूर्यः' }, status: { en: 'Friendly sign (Moon\'s sign)', hi: 'मित्र राशि (चन्द्र की राशि)', sa: 'मित्रराशिः (चन्द्रस्य राशिः)' }, color: '#fbbf24' },
];

// Cross-link cards
const DEEPER_LINKS = [
  { href: '/learn/bhavas', label: { en: 'The 12 Houses', hi: '12 भाव', sa: 'द्वादशभावाः' }, desc: { en: 'Deep dive into each house\'s significations', hi: 'प्रत्येक भाव के संकेतों में गहराई', sa: 'प्रत्येकभावसङ्केतेषु गहनम्' } },
  { href: '/learn/grahas', label: { en: 'The 9 Grahas', hi: '9 ग्रह', sa: 'नवग्रहाः' }, desc: { en: 'Planets, their natures, and rulerships', hi: 'ग्रह, उनके स्वभाव, और स्वामित्व', sa: 'ग्रहाः, तेषां स्वभावाः, स्वामित्वं च' } },
  { href: '/learn/vargas', label: { en: 'Divisional Charts', hi: 'विभागीय कुण्डलियाँ', sa: 'विभागकुण्डल्यः' }, desc: { en: '16 Shodasvarga charts — D9, D10, and beyond', hi: '16 षोडशवर्ग — D9, D10, और आगे', sa: '16 षोडशवर्गाः — D9, D10, अग्रे च' } },
  { href: '/learn/dashas', label: { en: 'Dashas', hi: 'दशाएँ', sa: 'दशाः' }, desc: { en: 'The Vimshottari planetary period system', hi: 'विंशोत्तरी ग्रह अवधि प्रणाली', sa: 'विंशोत्तरीग्रहकालखण्डपद्धतिः' } },
  { href: '/learn/nakshatras', label: { en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्राणि' }, desc: { en: '27 lunar mansions and their meanings', hi: '27 चान्द्रगृह और उनके अर्थ', sa: '27 चान्द्रगृहाणि तेषाम् अर्थाः च' } },
  { href: '/learn/gochar', label: { en: 'Gochar (Transits)', hi: 'गोचर', sa: 'गोचरः' }, desc: { en: 'Current planet movements and predictions', hi: 'वर्तमान ग्रह गति और भविष्यवाणी', sa: 'वर्तमानग्रहगतिः भविष्यवाणी च' } },
  { href: '/learn/calculations', label: { en: 'The Math', hi: 'गणित', sa: 'गणितम्' }, desc: { en: 'Algorithms behind our calculations', hi: 'हमारी गणनाओं के पीछे के एल्गोरिथ्म', sa: 'अस्माकं गणनानां गणितानि' } },
];

/* ─── Page Component ─── */
export default function LearnKundaliPage() {
  const locale = useLocale() as Locale;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary">{L.subtitle[locale]}</p>
      </div>

      {/* Key Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Kundali" devanagari="कुण्डली" transliteration="Kuṇḍalī" meaning="Birth chart / Horoscope" />
        <SanskritTermCard term="Lagna" devanagari="लग्न" transliteration="Lagna" meaning="Ascendant (Rising Sign)" />
        <SanskritTermCard term="Graha" devanagari="ग्रह" transliteration="Graha" meaning="Planet (that which seizes)" />
        <SanskritTermCard term="Bhava" devanagari="भाव" transliteration="Bhāva" meaning="House (life area)" />
      </div>

      {/* ─── Overview ─── */}
      <LessonSection title={L.overviewTitle[locale]}>
        <p>{L.overviewText[locale]}</p>
      </LessonSection>

      {/* ─── Example Introduction ─── */}
      <LessonSection title={L.exampleTitle[locale]} variant="highlight">
        <p>{L.exampleText[locale]}</p>
        <div className="mt-4 p-5 rounded-xl bg-gold-primary/5 border border-gold-primary/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{locale === 'en' ? 'Date' : 'तिथि'}</div>
              <div className="text-gold-light font-bold text-lg">15 Aug 1995</div>
            </div>
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{locale === 'en' ? 'Time' : 'समय'}</div>
              <div className="text-gold-light font-bold text-lg">10:30 AM IST</div>
            </div>
            <div>
              <div className="text-gold-primary text-xs uppercase tracking-widest mb-1">{locale === 'en' ? 'Place' : 'स्थान'}</div>
              <div className="text-gold-light font-bold text-lg">{locale === 'en' ? 'New Delhi' : 'नई दिल्ली'}</div>
            </div>
          </div>
          <div className="text-center mt-3 text-text-secondary/50 font-mono text-xs">
            28.6139°N, 77.2090°E
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 1: Birth Data ─── */}
      <LessonSection number={1} title={L.s1Title[locale]}>
        <p>{L.s1Text[locale]}</p>
        <div className="mt-4 space-y-3">
          {[
            { label: { en: 'Date of Birth', hi: 'जन्म तिथि', sa: 'जन्मतिथिः' }, text: L.s1Date, icon: '1' },
            { label: { en: 'Time of Birth', hi: 'जन्म समय', sa: 'जन्मसमयः' }, text: L.s1Time, icon: '2' },
            { label: { en: 'Place of Birth', hi: 'जन्म स्थान', sa: 'जन्मस्थानम्' }, text: L.s1Place, icon: '3' },
          ].map((item) => (
            <div key={item.icon} className="flex gap-4 p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
              <span className="w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold flex-shrink-0">
                {item.icon}
              </span>
              <div>
                <div className="text-gold-light font-semibold text-sm mb-1">{item.label[locale]}</div>
                <p className="text-text-secondary text-sm">{item.text[locale]}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── STEP 2: Time Conversion ─── */}
      <LessonSection number={2} title={L.s2Title[locale]}>
        <p>{L.s2Text[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{locale === 'en' ? 'For our example:' : 'हमारे उदाहरण के लिए:'}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">IST = UTC + 5:30</p>
            <p className="text-gold-light/80 font-mono text-xs">10:30 AM IST = 05:00 AM UT</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">Date: 15 Aug 1995, UT 05:00</p>
            <p className="text-gold-light/80 font-mono text-xs">JD = 2449945.708  <span className="text-gold-light/40">// Julian Day Number</span></p>
            <p className="text-gold-light/80 font-mono text-xs">T = -0.0439  <span className="text-gold-light/40">// centuries from J2000.0</span></p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 3: Sidereal Time ─── */}
      <LessonSection number={3} title={L.s3Title[locale]}>
        <p>{L.s3Text[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{locale === 'en' ? 'For our example:' : 'हमारे उदाहरण के लिए:'}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">GST (Greenwich Sidereal Time) at 0h UT = 21h 33m</p>
            <p className="text-gold-light/80 font-mono text-xs">Correction for 05:00 UT = +5h 01m  <span className="text-gold-light/40">// sidereal day is 3m 56s shorter</span></p>
            <p className="text-gold-light/80 font-mono text-xs">GST at 05:00 UT = 2h 34m</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">LST = GST + Longitude/15</p>
            <p className="text-gold-light/80 font-mono text-xs">LST = 2h 34m + 77.209°/15 = 2h 34m + 5h 09m</p>
            <p className="text-gold-light/80 font-mono text-xs font-bold text-gold-light">LST = 7h 43m  <span className="text-gold-light/40">// = 115.7°</span></p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 4: Lagna ─── */}
      <LessonSection
        number={4}
        title={L.s4Title[locale]}
        illustration={
          <HouseHighlightChart
            highlightHouses={[1]}
            highlightColor="#d4a853"
            size={220}
            showAllNumbers
            label="House 1 (Lagna) highlighted in the North Indian chart"
          />
        }
      >
        <p>{L.s4Text[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{locale === 'en' ? 'For our example:' : 'हमारे उदाहरण के लिए:'}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">Lagna° = atan2(sin(LST), cos(LST)·cos(ε) - tan(φ)·sin(ε))</p>
            <p className="text-gold-light/80 font-mono text-xs">where ε = 23.44° (obliquity), φ = 28.61° (Delhi latitude)</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">Tropical Lagna ≈ 207.5°  <span className="text-gold-light/40">// Scorpio in tropical</span></p>
            <p className="text-gold-light/80 font-mono text-xs">Ayanamsha (1995) ≈ 23.8°</p>
            <p className="text-gold-light/80 font-mono text-xs font-bold text-gold-light">Sidereal Lagna ≈ 183.7° = <span className="text-emerald-400">Tula (Libra)</span> 3°42&apos;</p>
          </div>
          <p className="text-text-secondary/60 text-xs mt-3 italic">
            {locale === 'en'
              ? 'Tula (Libra) rising means Venus-ruled personality: diplomatic, artistic, relationship-oriented.'
              : 'तुला लग्न अर्थात् शुक्र-शासित व्यक्तित्व: कूटनीतिक, कलात्मक, सम्बन्ध-उन्मुख।'}
          </p>
        </div>
      </LessonSection>

      {/* ─── STEP 5: Ayanamsha ─── */}
      <LessonSection number={5} title={L.s5Title[locale]}>
        <p>{L.s5Text[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">Lahiri Ayanamsha ≈ 23.85° + 1.397° × T</p>
            <p className="text-gold-light/80 font-mono text-xs">For 1995 (T ≈ -0.044): Ayanamsha ≈ 23.79°</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">Sidereal position = Tropical position - 23.79°</p>
          </div>
          <p className="text-text-secondary/60 text-xs mt-3 italic">
            {locale === 'en'
              ? 'This is why your "Western sign" and "Vedic sign" usually differ by about one sign.'
              : 'इसीलिए आपकी "पश्चिमी राशि" और "वैदिक राशि" प्रायः लगभग एक राशि भिन्न होती हैं।'}
          </p>
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/calculations" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {locale === 'en' ? 'See full mathematical derivation' : 'पूर्ण गणितीय व्युत्पत्ति देखें'} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 6: Planet Positions ─── */}
      <LessonSection number={6} title={L.s6Title[locale]}>
        <p>{L.s6Text[locale]}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{locale === 'en' ? 'Graha' : 'ग्रह'}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{locale === 'en' ? 'Sidereal°' : 'नाक्ष°'}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{locale === 'en' ? 'Rashi' : 'राशि'}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs hidden sm:table-cell">{locale === 'en' ? 'Nakshatra' : 'नक्षत्र'}</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_PLANETS.map((p) => (
                <tr key={p.id} className="border-b border-gold-primary/5">
                  <td className="py-2 text-xs font-semibold" style={{ color: p.color }}>{p.name[locale]}</td>
                  <td className="py-2 text-gold-light/70 font-mono text-xs">{p.sidereal}</td>
                  <td className="py-2 text-text-secondary text-xs">{p.rashi[locale]}</td>
                  <td className="py-2 text-text-secondary/60 text-xs hidden sm:table-cell" style={locale !== 'en' ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{p.nak[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/grahas" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {locale === 'en' ? 'Learn about all 9 Grahas' : 'सभी 9 ग्रहों के बारे में जानें'} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 7: House Mapping ─── */}
      <LessonSection number={7} title={L.s7Title[locale]}>
        <p>{L.s7Text[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{locale === 'en' ? 'Formula:' : 'सूत्र:'}</p>
          <p className="text-gold-light/80 font-mono text-xs">House = (Planet_Rashi_Number - Lagna_Rashi_Number + 12) % 12 + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? 'Example: Sun in Cancer (4), Lagna in Libra (7) → (4 - 7 + 12) % 12 + 1 = 10th house'
              : 'उदाहरण: सूर्य कर्क (4) में, लग्न तुला (7) → (4 - 7 + 12) % 12 + 1 = 10वाँ भाव'}
          </p>
        </div>

        {/* House mapping table */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {EXAMPLE_HOUSES.map((h) => (
            <div
              key={h.house}
              className={`rounded-lg p-3 border ${h.planets[locale] !== '—' ? 'border-gold-primary/20 bg-gold-primary/5' : 'border-gold-primary/5 bg-bg-primary/30'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-light text-xs font-bold">{h.house}</span>
                <span className="text-text-secondary/60 text-xs">{h.rashi[locale]}</span>
              </div>
              <div className={`text-xs font-semibold ${h.planets[locale] !== '—' ? 'text-gold-light' : 'text-text-secondary/30'}`}>
                {h.planets[locale]}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/bhavas" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {locale === 'en' ? 'Deep dive into all 12 houses' : 'सभी 12 भावों का विस्तृत अध्ययन'} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 8: The Chart ─── */}
      <LessonSection
        number={8}
        title={L.s8Title[locale]}
        variant="highlight"
        illustration={<ExampleKundaliChart size={380} />}
      >
        <p>{L.s8Text[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{locale === 'en' ? 'Reading the chart:' : 'कुण्डली पढ़ना:'}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{locale === 'en' ? '- Top diamond (House 1) = Lagna → Tula (Libra) with Rahu' : '- शीर्ष हीरा (भाव 1) = लग्न → तुला, राहु सहित'}</p>
            <p>{locale === 'en' ? '- Houses run counter-clockwise from the top' : '- भाव शीर्ष से वामावर्त चलते हैं'}</p>
            <p>{locale === 'en' ? '- Rashi names label each house; planets shown at center' : '- राशि नाम प्रत्येक भाव में; ग्रह केन्द्र में दिखाए गए'}</p>
            <p>{locale === 'en' ? '- Sun in 10th (career) = strong public presence' : '- सूर्य 10वें भाव (कर्म) में = शक्तिशाली सार्वजनिक उपस्थिति'}</p>
            <p>{locale === 'en' ? '- Moon in 3rd (communication) = expressive mind' : '- चन्द्र 3रे भाव (संवाद) में = अभिव्यक्तिशील मन'}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 9: Dignity ─── */}
      <LessonSection number={9} title={L.s9Title[locale]}>
        <p>{L.s9Text[locale]}</p>
        <div className="mt-4 space-y-2">
          {DIGNITY_EXAMPLES.map((d) => (
            <div key={d.planet.en} className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/5">
              <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <div className="flex-1">
                <span className="text-gold-light text-sm font-semibold">{d.planet[locale]}</span>
                <span className="text-text-secondary/60 text-sm"> — </span>
                <span className="text-sm" style={{ color: d.color }}>{d.status[locale]}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{locale === 'en' ? 'Dignity Hierarchy:' : 'गरिमा क्रम:'}</p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Exalted (Uccha) > Own Sign (Swa) > Friendly (Mitra) > Neutral > Enemy (Shatru) > Debilitated (Neecha)'
              : 'उच्च > स्वराशि > मित्र > तटस्थ > शत्रु > नीच'}
          </p>
        </div>
      </LessonSection>

      {/* ─── STEP 10: Aspects ─── */}
      <LessonSection number={10} title={L.s10Title[locale]}>
        <p>{L.s10Text[locale]}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { planet: { en: 'All Planets', hi: 'सभी ग्रह', sa: 'सर्वे ग्रहाः' }, aspect: { en: '7th house from their position', hi: 'अपनी स्थिति से 7वें भाव पर', sa: 'स्वस्थानात् सप्तमभावे' }, color: '#d4a853' },
            { planet: { en: 'Mars (special)', hi: 'मंगल (विशेष)', sa: 'मङ्गलः (विशेषः)' }, aspect: { en: '+ 4th and 8th houses', hi: '+ 4वें और 8वें भाव पर', sa: '+ चतुर्थाष्टमभावयोः' }, color: '#ef4444' },
            { planet: { en: 'Jupiter (special)', hi: 'गुरु (विशेष)', sa: 'गुरुः (विशेषः)' }, aspect: { en: '+ 5th and 9th houses', hi: '+ 5वें और 9वें भाव पर', sa: '+ पञ्चमनवमभावयोः' }, color: '#f0d48a' },
            { planet: { en: 'Saturn (special)', hi: 'शनि (विशेष)', sa: 'शनिः (विशेषः)' }, aspect: { en: '+ 3rd and 10th houses', hi: '+ 3रे और 10वें भाव पर', sa: '+ तृतीयदशमभावयोः' }, color: '#3b82f6' },
          ].map((a) => (
            <div key={a.planet.en} className="rounded-lg p-3 border border-gold-primary/10 bg-bg-primary/30">
              <div className="text-sm font-semibold mb-1" style={{ color: a.color }}>{a.planet[locale]}</div>
              <div className="text-text-secondary text-xs">{a.aspect[locale]}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{locale === 'en' ? 'In our example:' : 'हमारे उदाहरण में:'}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{locale === 'en' ? 'Jupiter in 2nd aspects 8th → protects longevity house' : 'गुरु 2रे भाव में → 8वें भाव पर दृष्टि → आयु भाव की रक्षा'}</p>
            <p>{locale === 'en' ? 'Saturn in 5th aspects 7th, 11th, 2nd → discipline in marriage, gains, speech' : 'शनि 5वें भाव में → 7, 11, 2 पर दृष्टि → विवाह, लाभ, वाणी में अनुशासन'}</p>
            <p>{locale === 'en' ? 'Sun in 10th aspects 4th → career impacts home life' : 'सूर्य 10वें में → 4वें पर दृष्टि → कर्म गृह जीवन प्रभावित करता है'}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 11: Dashas ─── */}
      <LessonSection number={11} title={L.s11Title[locale]}>
        <p>{L.s11Text[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{locale === 'en' ? 'In our example:' : 'हमारे उदाहरण में:'}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">{locale === 'en' ? 'Moon at 253.0° sidereal → Purva Ashadha Nakshatra' : 'चन्द्र 253.0° नाक्षत्रिक → पूर्वाषाढ़ा नक्षत्र'}</p>
            <p className="text-gold-light/80 font-mono text-xs">{locale === 'en' ? 'P. Ashadha lord = Venus → born in Venus Maha Dasha' : 'पूर्वाषाढ़ा स्वामी = शुक्र → शुक्र महादशा में जन्म'}</p>
            <p className="text-gold-light/80 font-mono text-xs">{locale === 'en' ? 'Venus Maha Dasha = 20 years total' : 'शुक्र महादशा = कुल 20 वर्ष'}</p>
            <p className="text-gold-light/80 font-mono text-xs mt-2">{locale === 'en' ? 'Moon progress through P. Ashadha:' : 'पूर्वाषाढ़ा में चन्द्र की प्रगति:'}</p>
            <p className="text-gold-light/80 font-mono text-xs">{locale === 'en' ? 'P. Ashadha span: 253°20\' to 266°40\' (13°20\')' : 'पूर्वाषाढ़ा: 253°20\' से 266°40\' (13°20\')'}</p>
            <p className="text-gold-light/80 font-mono text-xs">{locale === 'en' ? 'Moon at 253.0° → near the start → ~19.6 years of Venus remain' : 'चन्द्र 253.0° → प्रारम्भ के निकट → शुक्र के ~19.6 वर्ष शेष'}</p>
            <p className="text-gold-light/60 font-mono text-xs mt-2">{locale === 'en' ? 'After Venus: Sun (6y) → Moon (10y) → Mars (7y) → ...' : 'शुक्र के बाद: सूर्य (6 वर्ष) → चन्द्र (10 वर्ष) → मंगल (7 वर्ष) → ...'}</p>
          </div>
        </div>
        <div className="mt-3 text-right">
          <Link href="/learn/dashas" className="text-gold-primary hover:text-gold-light text-xs transition-colors">
            {locale === 'en' ? 'Complete Dasha system explained' : 'सम्पूर्ण दशा प्रणाली की व्याख्या'} →
          </Link>
        </div>
      </LessonSection>

      {/* ─── STEP 12: Yogas & Doshas ─── */}
      <LessonSection number={12} title={L.s12Title[locale]}>
        <p>{L.s12Text[locale]}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg p-4 border border-emerald-400/20 bg-emerald-400/5">
            <h4 className="text-emerald-400 font-bold text-sm mb-2">{locale === 'en' ? 'Yogas (Auspicious Combos)' : 'योग (शुभ संयोग)'}</h4>
            <ul className="space-y-1 text-text-secondary text-xs">
              <li>{locale === 'en' ? 'Budhaditya Yoga — Mercury + Sun in same house (11th)' : 'बुधादित्य योग — बुध + सूर्य (यहाँ 10-11 में)'}</li>
              <li>{locale === 'en' ? 'Gajakesari Yoga — Jupiter in Kendra from Moon' : 'गजकेसरी योग — चन्द्र से केन्द्र में गुरु'}</li>
              <li>{locale === 'en' ? 'Dhana Yoga — lord of 2nd in good placement' : 'धन योग — 2 भाव का स्वामी शुभ स्थान में'}</li>
            </ul>
          </div>
          <div className="rounded-lg p-4 border border-red-400/20 bg-red-400/5">
            <h4 className="text-red-400 font-bold text-sm mb-2">{locale === 'en' ? 'Doshas (Afflictions)' : 'दोष (कठिनाइयाँ)'}</h4>
            <ul className="space-y-1 text-text-secondary text-xs">
              <li>{locale === 'en' ? 'Mangal Dosha — Mars in 1, 2, 4, 7, 8, or 12 from Lagna' : 'मंगल दोष — लग्न से 1, 2, 4, 7, 8, 12 में मंगल'}</li>
              <li>{locale === 'en' ? 'Kaal Sarpa — all planets between Rahu-Ketu axis' : 'काल सर्प — राहु-केतु अक्ष के बीच सभी ग्रह'}</li>
              <li>{locale === 'en' ? 'Pitru Dosha — Sun afflicted by malefics' : 'पितृ दोष — सूर्य पाप ग्रहों से पीड़ित'}</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{locale === 'en' ? 'In our example:' : 'हमारे उदाहरण में:'}</p>
          <div className="space-y-1 text-gold-light/70 font-mono text-xs">
            <p>{locale === 'en' ? 'Mars in 12th from Lagna → Mangal Dosha is present' : 'लग्न से 12वें भाव में मंगल → मंगल दोष उपस्थित'}</p>
            <p>{locale === 'en' ? 'Mercury + Venus in Leo (11th) → Dhana Yoga (gains house)' : 'बुध + शुक्र सिंह (11वाँ) में → धन योग (लाभ भाव)'}</p>
            <p>{locale === 'en' ? 'Saturn in own sign Aquarius → strong 5th house (intelligence)' : 'शनि स्वराशि कुम्भ में → शक्तिशाली 5वाँ भाव (बुद्धि)'}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── STEP 13: Synthesis ─── */}
      <LessonSection title={L.s13Title[locale]} variant="highlight">
        <p>{L.s13Text[locale]}</p>

        {/* Summary pipeline */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            { en: 'Birth Data', hi: 'जन्म विवरण' },
            { en: 'Time → JD', hi: 'समय → JD' },
            { en: 'LST', hi: 'LST' },
            { en: 'Lagna', hi: 'लग्न' },
            { en: 'Planets', hi: 'ग्रह' },
            { en: 'Houses', hi: 'भाव' },
            { en: 'Chart', hi: 'कुण्डली' },
            { en: 'Dignity', hi: 'गरिमा' },
            { en: 'Aspects', hi: 'दृष्टि' },
            { en: 'Dashas', hi: 'दशा' },
            { en: 'Yogas', hi: 'योग' },
          ].map((step, i, arr) => (
            <span key={step.en} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gold-primary/10 border border-gold-primary/20 text-gold-light">
                {locale === 'en' ? step.en : step.hi}
              </span>
              {i < arr.length - 1 && <span className="text-gold-primary/40 text-xs">→</span>}
            </span>
          ))}
        </div>
      </LessonSection>

      {/* ─── Deeper Links ─── */}
      <div className="mt-8 mb-6">
        <h3 className="text-xl font-bold text-gold-gradient mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.deeper[locale]}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEEPER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 border border-gold-primary/10 hover:border-gold-primary/30 transition-colors group"
            >
              <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">{link.label[locale]}</div>
              <p className="text-text-secondary/60 text-xs mt-1">{link.desc[locale]}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/25 transition-colors font-semibold"
        >
          {L.tryIt[locale]} →
        </Link>
      </div>
    </div>
  );
}
