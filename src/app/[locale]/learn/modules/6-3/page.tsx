'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_6_3', phase: 2, topic: 'Nakshatra', moduleNumber: '6.3',
  title: { en: 'Nakshatra Compatibility (Melapaka)', hi: 'नक्षत्र अनुकूलता (मेलापक)', sa: 'नक्षत्र अनुकूलता (मेलापक)', mai: 'नक्षत्र अनुकूलता (मेलापक)', mr: 'नक्षत्र अनुकूलता (मेलापक)', ta: 'Nakshatra Compatibility (Melapaka)', te: 'Nakshatra Compatibility (Melapaka)', bn: 'Nakshatra Compatibility (Melapaka)', kn: 'Nakshatra Compatibility (Melapaka)', gu: 'Nakshatra Compatibility (Melapaka)' },
  subtitle: {
    en: 'The Ashta Kuta system scores 8 compatibility factors totaling 36 points between two birth nakshatras',
    hi: 'अष्ट कूट पद्धति दो जन्म नक्षत्रों के बीच 36 अंकों की 8 अनुकूलता कारकों का मूल्यांकन करती है',
  },
  estimatedMinutes: 16,
  crossRefs: [
    { label: { en: 'Module 6-1: Nakshatra System', hi: 'मॉड्यूल 6-1: नक्षत्र पद्धति', sa: 'मॉड्यूल 6-1: नक्षत्र पद्धति', mai: 'मॉड्यूल 6-1: नक्षत्र पद्धति', mr: 'मॉड्यूल 6-1: नक्षत्र पद्धति', ta: 'Module 6-1: Nakshatra System', te: 'Module 6-1: Nakshatra System', bn: 'Module 6-1: Nakshatra System', kn: 'Module 6-1: Nakshatra System', gu: 'Module 6-1: Nakshatra System' }, href: '/learn/modules/6-1' },
    { label: { en: 'Module 6-2: Nakshatra Padas', hi: 'मॉड्यूल 6-2: नक्षत्र पाद', sa: 'मॉड्यूल 6-2: नक्षत्र पाद', mai: 'मॉड्यूल 6-2: नक्षत्र पाद', mr: 'मॉड्यूल 6-2: नक्षत्र पाद', ta: 'Module 6-2: Nakshatra Padas', te: 'Module 6-2: Nakshatra Padas', bn: 'Module 6-2: Nakshatra Padas', kn: 'Module 6-2: Nakshatra Padas', gu: 'Module 6-2: Nakshatra Padas' }, href: '/learn/modules/6-2' },
    { label: { en: 'Matching Deep Dive', hi: 'मिलान विस्तार', sa: 'मिलान विस्तार', mai: 'मिलान विस्तार', mr: 'मिलान विस्तार', ta: 'Matching Deep Dive', te: 'Matching Deep Dive', bn: 'Matching Deep Dive', kn: 'Matching Deep Dive', gu: 'Matching Deep Dive' }, href: '/learn/matching' },
    { label: { en: 'Kundali Matching Tool', hi: 'कुण्डली मिलान उपकरण', sa: 'कुण्डली मिलान उपकरण', mai: 'कुण्डली मिलान उपकरण', mr: 'कुण्डली मिलान उपकरण', ta: 'Kundali Matching Tool', te: 'Kundali Matching Tool', bn: 'Kundali Matching Tool', kn: 'Kundali Matching Tool', gu: 'Kundali Matching Tool' }, href: '/matching' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q6_3_01', type: 'mcq',
    question: {
      en: 'How many factors (kutas) are evaluated in the Ashta Kuta matching system?',
      hi: 'अष्ट कूट मिलान पद्धति में कितने कारकों (कूटों) का मूल्यांकन किया जाता है?',
    },
    options: [
      { en: '5', hi: '5', sa: '5', mai: '5', mr: '5', ta: '5', te: '5', bn: '5', kn: '5', gu: '5' },
      { en: '7', hi: '7', sa: '7', mai: '7', mr: '7', ta: '7', te: '7', bn: '7', kn: '7', gu: '7' },
      { en: '8', hi: '8', sa: '8', mai: '8', mr: '8', ta: '8', te: '8', bn: '8', kn: '8', gu: '8' },
      { en: '10', hi: '10', sa: '10', mai: '10', mr: '10', ta: '10', te: '10', bn: '10', kn: '10', gu: '10' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Ashta means "eight." The 8 kutas are: Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (3), Bhakoot (7), and Nadi (8), totaling 36 maximum points.',
      hi: 'अष्ट का अर्थ "आठ" है। 8 कूट हैं: वर्ण (1), वश्य (2), तारा (3), योनि (4), ग्रह मैत्री (5), गण (3), भकूट (7), और नाड़ी (8), कुल अधिकतम 36 अंक।',
    },
  },
  {
    id: 'q6_3_02', type: 'mcq',
    question: {
      en: 'What is the maximum total score in Ashta Kuta matching?',
      hi: 'अष्ट कूट मिलान में अधिकतम कुल अंक कितने हैं?',
    },
    options: [
      { en: '18', hi: '18', sa: '18', mai: '18', mr: '18', ta: '18', te: '18', bn: '18', kn: '18', gu: '18' },
      { en: '27', hi: '27', sa: '27', mai: '27', mr: '27', ta: '27', te: '27', bn: '27', kn: '27', gu: '27' },
      { en: '36', hi: '36', sa: '36', mai: '36', mr: '36', ta: '36', te: '36', bn: '36', kn: '36', gu: '36' },
      { en: '108', hi: '108', sa: '108', mai: '108', mr: '108', ta: '108', te: '108', bn: '108', kn: '108', gu: '108' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The maximum score is 36 points: Varna(1) + Vashya(2) + Tara(3) + Yoni(4) + Graha Maitri(5) + Gana(3) + Bhakoot(7) + Nadi(8) = 36. A minimum of 18/36 is traditionally required for compatibility.',
      hi: 'अधिकतम अंक 36 हैं: वर्ण(1) + वश्य(2) + तारा(3) + योनि(4) + ग्रह मैत्री(5) + गण(3) + भकूट(7) + नाड़ी(8) = 36। अनुकूलता के लिए पारम्परिक रूप से न्यूनतम 18/36 आवश्यक है।',
    },
  },
  {
    id: 'q6_3_03', type: 'true_false',
    question: {
      en: 'Nadi Kuta carries the highest weight (8 points) among all eight kutas.',
      hi: 'नाड़ी कूट सभी आठ कूटों में सर्वाधिक भार (8 अंक) वहन करता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Nadi is given 8 out of 36 points — the single highest factor. It assesses constitutional compatibility based on Ayurvedic doshas: Aadi (Vata), Madhya (Pitta), Antya (Kapha). Same nadi = 0 points and the dreaded Nadi Dosha.',
      hi: 'सत्य। नाड़ी को 36 में से 8 अंक दिये गये हैं — एकमात्र सर्वाधिक भारित कारक। यह आयुर्वेदिक दोषों के आधार पर प्राकृतिक अनुकूलता का मूल्यांकन करता है: आदि (वात), मध्य (पित्त), अन्त्य (कफ)। समान नाड़ी = 0 अंक और भयावह नाड़ी दोष।',
    },
  },
  {
    id: 'q6_3_04', type: 'mcq',
    question: {
      en: 'In Tara Kuta, you count from the bride\'s nakshatra to the groom\'s and divide by:',
      hi: 'तारा कूट में वधू के नक्षत्र से वर के नक्षत्र तक गिनकर किससे भाग देते हैं?',
    },
    options: [
      { en: '3', hi: '3', sa: '3', mai: '3', mr: '3', ta: '3', te: '3', bn: '3', kn: '3', gu: '3' },
      { en: '7', hi: '7', sa: '7', mai: '7', mr: '7', ta: '7', te: '7', bn: '7', kn: '7', gu: '7' },
      { en: '9', hi: '9', sa: '9', mai: '9', mr: '9', ta: '9', te: '9', bn: '9', kn: '9', gu: '9' },
      { en: '12', hi: '12', sa: '12', mai: '12', mr: '12', ta: '12', te: '12', bn: '12', kn: '12', gu: '12' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'In Tara Kuta, the count from bride\'s to groom\'s nakshatra is divided by 9. The remainder determines which of the 9 taras applies. Even-numbered taras (2,4,6,8) are favorable.',
      hi: 'तारा कूट में, वधू से वर के नक्षत्र तक की गिनती को 9 से भाग देते हैं। शेषफल निर्धारित करता है कि 9 तारों में से कौन लागू होता है। सम संख्या के तारे (2,4,6,8) अनुकूल हैं।',
    },
  },
  {
    id: 'q6_3_05', type: 'mcq',
    question: {
      en: 'What does Nadi Dosha indicate?',
      hi: 'नाड़ी दोष क्या इंगित करता है?',
    },
    options: [
      { en: 'The couple has the same birth star', hi: 'दम्पति का जन्म नक्षत्र समान है', sa: 'दम्पति का जन्म नक्षत्र समान है', mai: 'दम्पति का जन्म नक्षत्र समान है', mr: 'दम्पति का जन्म नक्षत्र समान है', ta: 'The couple has the same birth star', te: 'The couple has the same birth star', bn: 'The couple has the same birth star', kn: 'The couple has the same birth star', gu: 'The couple has the same birth star' },
      { en: 'Both partners share the same nadi (Ayurvedic constitution)', hi: 'दोनों साथियों की समान नाड़ी (आयुर्वेदिक प्रकृति) है', sa: 'दोनों साथियों की समान नाड़ी (आयुर्वेदिक प्रकृति) है', mai: 'दोनों साथियों की समान नाड़ी (आयुर्वेदिक प्रकृति) है', mr: 'दोनों साथियों की समान नाड़ी (आयुर्वेदिक प्रकृति) है', ta: 'Both partners share the same nadi (Ayurvedic constitution)', te: 'Both partners share the same nadi (Ayurvedic constitution)', bn: 'Both partners share the same nadi (Ayurvedic constitution)', kn: 'Both partners share the same nadi (Ayurvedic constitution)', gu: 'Both partners share the same nadi (Ayurvedic constitution)' },
      { en: 'The couple\'s planets are in mutual enmity', hi: 'दम्पति के ग्रह परस्पर शत्रुता में हैं' },
      { en: 'The gana of both partners is Rakshasa', hi: 'दोनों साथियों का गण राक्षस है', sa: 'दोनों साथियों का गण राक्षस है', mai: 'दोनों साथियों का गण राक्षस है', mr: 'दोनों साथियों का गण राक्षस है', ta: 'The gana of both partners is Rakshasa', te: 'The gana of both partners is Rakshasa', bn: 'The gana of both partners is Rakshasa', kn: 'The gana of both partners is Rakshasa', gu: 'The gana of both partners is Rakshasa' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Nadi Dosha occurs when both partners share the same nadi — Aadi (Vata), Madhya (Pitta), or Antya (Kapha). Same constitutional type is believed to cause health issues in offspring and lack of physical compatibility.',
      hi: 'नाड़ी दोष तब होता है जब दोनों साथियों की समान नाड़ी हो — आदि (वात), मध्य (पित्त), या अन्त्य (कफ)। समान प्राकृतिक प्रकार सन्तान में स्वास्थ्य समस्याएँ और शारीरिक अनुकूलता में कमी का कारण माना जाता है।',
    },
  },
  {
    id: 'q6_3_06', type: 'true_false',
    question: {
      en: 'The minimum score of 18/36 guarantees a successful marriage according to Vedic tradition.',
      hi: '18/36 का न्यूनतम अंक वैदिक परम्परा के अनुसार सफल विवाह की गारण्टी देता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. 18/36 is only the minimum threshold for consideration, not a guarantee. A high Kuta score with severe Nadi Dosha or Bhakoot Dosha may still be problematic. Complete compatibility analysis also requires examining planetary positions, dashas, and the full horoscope.',
      hi: 'असत्य। 18/36 केवल विचारार्थ न्यूनतम सीमा है, गारण्टी नहीं। गम्भीर नाड़ी दोष या भकूट दोष के साथ उच्च कूट अंक भी समस्याग्रस्त हो सकता है। सम्पूर्ण अनुकूलता विश्लेषण में ग्रह स्थितियों, दशाओं और पूर्ण कुण्डली की जाँच भी आवश्यक है।',
    },
  },
  {
    id: 'q6_3_07', type: 'mcq',
    question: {
      en: 'Bhakoot Kuta, carrying 7 points, primarily assesses:',
      hi: 'भकूट कूट, जो 7 अंक वहन करता है, मुख्यतः किसका मूल्यांकन करता है?',
    },
    options: [
      { en: 'Physical attraction', hi: 'शारीरिक आकर्षण', sa: 'शारीरिक आकर्षण', mai: 'शारीरिक आकर्षण', mr: 'शारीरिक आकर्षण', ta: 'Physical attraction', te: 'Physical attraction', bn: 'Physical attraction', kn: 'Physical attraction', gu: 'Physical attraction' },
      { en: 'Rashi (sign) compatibility of Moon signs', hi: 'चन्द्र राशियों की राशि अनुकूलता', sa: 'चन्द्र राशियों की राशि अनुकूलता', mai: 'चन्द्र राशियों की राशि अनुकूलता', mr: 'चन्द्र राशियों की राशि अनुकूलता', ta: 'Rashi (sign) compatibility of Moon signs', te: 'Rashi (sign) compatibility of Moon signs', bn: 'Rashi (sign) compatibility of Moon signs', kn: 'Rashi (sign) compatibility of Moon signs', gu: 'Rashi (sign) compatibility of Moon signs' },
      { en: 'Intellectual compatibility', hi: 'बौद्धिक अनुकूलता', sa: 'बौद्धिक अनुकूलता', mai: 'बौद्धिक अनुकूलता', mr: 'बौद्धिक अनुकूलता', ta: 'Intellectual compatibility', te: 'Intellectual compatibility', bn: 'Intellectual compatibility', kn: 'Intellectual compatibility', gu: 'Intellectual compatibility' },
      { en: 'Spiritual alignment', hi: 'आध्यात्मिक सामंजस्य', sa: 'आध्यात्मिक सामंजस्य', mai: 'आध्यात्मिक सामंजस्य', mr: 'आध्यात्मिक सामंजस्य', ta: 'Spiritual alignment', te: 'Spiritual alignment', bn: 'Spiritual alignment', kn: 'Spiritual alignment', gu: 'Spiritual alignment' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Bhakoot (7 points) examines the relationship between the Moon signs (rashis) of the couple. Certain rashi combinations (like 6-8 or 2-12 relationships) score 0 and indicate Bhakoot Dosha, while harmonious combinations (1-1, 5-9, 3-11) score full marks.',
      hi: 'भकूट (7 अंक) दम्पति की चन्द्र राशियों के सम्बन्ध की जाँच करता है। कुछ राशि संयोजन (जैसे 6-8 या 2-12 सम्बन्ध) 0 अंक पाते हैं और भकूट दोष इंगित करते हैं, जबकि सामंजस्यपूर्ण संयोजन (1-1, 5-9, 3-11) पूर्ण अंक प्राप्त करते हैं।',
    },
  },
  {
    id: 'q6_3_08', type: 'mcq',
    question: {
      en: 'Which Tara is considered most dangerous?',
      hi: 'कौन-सा तारा सर्वाधिक खतरनाक माना जाता है?',
    },
    options: [
      { en: 'Sampat (2nd) — wealth', hi: 'सम्पत् (2रा) — धन', sa: 'सम्पत् (2रा) — धन', mai: 'सम्पत् (2रा) — धन', mr: 'सम्पत् (2रा) — धन', ta: 'Sampat (2nd) — wealth', te: 'Sampat (2nd) — wealth', bn: 'Sampat (2nd) — wealth', kn: 'Sampat (2nd) — wealth', gu: 'Sampat (2nd) — wealth' },
      { en: 'Kshema (4th) — prosperity', hi: 'क्षेम (4था) — समृद्धि', sa: 'क्षेम (4था) — समृद्धि', mai: 'क्षेम (4था) — समृद्धि', mr: 'क्षेम (4था) — समृद्धि', ta: 'Kshema (4th) — prosperity', te: 'Kshema (4th) — prosperity', bn: 'Kshema (4th) — prosperity', kn: 'Kshema (4th) — prosperity', gu: 'Kshema (4th) — prosperity' },
      { en: 'Vadha (7th) — death', hi: 'वध (7वाँ) — मृत्यु', sa: 'वध (7वाँ) — मृत्यु', mai: 'वध (7वाँ) — मृत्यु', mr: 'वध (7वाँ) — मृत्यु', ta: 'Vadha (7th) — death', te: 'Vadha (7th) — death', bn: 'Vadha (7th) — death', kn: 'Vadha (7th) — death', gu: 'Vadha (7th) — death' },
      { en: 'Mitra (8th) — friend', hi: 'मित्र (8वाँ) — मित्र', sa: 'मित्र (8वाँ) — मित्र', mai: 'मित्र (8वाँ) — मित्र', mr: 'मित्र (8वाँ) — मित्र', ta: 'Mitra (8th) — friend', te: 'Mitra (8th) — friend', bn: 'Mitra (8th) — friend', kn: 'Mitra (8th) — friend', gu: 'Mitra (8th) — friend' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Vadha (the 7th tara, meaning "death" or "slayer") is the most inauspicious. When the count gives a remainder of 7 when divided by 9, it falls in Vadha tara, scoring 0 for Tara Kuta.',
      hi: 'वध (7वाँ तारा, अर्थ "मृत्यु" या "वधकर्ता") सर्वाधिक अशुभ है। जब गिनती 9 से भाग देने पर शेष 7 आता है, तो यह वध तारे में पड़ता है और तारा कूट में 0 अंक मिलते हैं।',
    },
  },
  {
    id: 'q6_3_09', type: 'true_false',
    question: {
      en: 'Nadi Dosha can be cancelled if certain other planetary conditions are met in the horoscope.',
      hi: 'नाड़ी दोष का निवारण हो सकता है यदि कुण्डली में कुछ अन्य ग्रह स्थितियाँ पूर्ण हों।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Classical texts specify several cancellation conditions: if both share the same rashi but different nakshatras, or the same nakshatra but different rashis, or if the rashi lords are mutual friends. These cancellations partially or fully neutralize the dosha.',
      hi: 'सत्य। शास्त्रीय ग्रन्थ कई निवारण शर्तें बताते हैं: यदि दोनों की राशि समान किन्तु नक्षत्र भिन्न हो, या नक्षत्र समान किन्तु राशि भिन्न हो, या राशि स्वामी परस्पर मित्र हों। ये निवारण दोष को आंशिक या पूर्ण रूप से निष्प्रभावी करते हैं।',
    },
  },
  {
    id: 'q6_3_10', type: 'mcq',
    question: {
      en: 'Yoni Kuta (4 points) assesses compatibility through:',
      hi: 'योनि कूट (4 अंक) किसके द्वारा अनुकूलता का मूल्यांकन करता है?',
    },
    options: [
      { en: 'Planetary friendship', hi: 'ग्रह मैत्री', sa: 'ग्रह मैत्री', mai: 'ग्रह मैत्री', mr: 'ग्रह मैत्री', ta: 'Planetary friendship', te: 'Planetary friendship', bn: 'Planetary friendship', kn: 'Planetary friendship', gu: 'Planetary friendship' },
      { en: 'Animal symbolism representing sexual and instinctual compatibility', hi: 'पशु प्रतीकवाद जो यौन और सहजवृत्तिक अनुकूलता दर्शाता है', sa: 'पशु प्रतीकवाद जो यौन और सहजवृत्तिक अनुकूलता दर्शाता है', mai: 'पशु प्रतीकवाद जो यौन और सहजवृत्तिक अनुकूलता दर्शाता है', mr: 'पशु प्रतीकवाद जो यौन और सहजवृत्तिक अनुकूलता दर्शाता है', ta: 'Animal symbolism representing sexual and instinctual compatibility', te: 'Animal symbolism representing sexual and instinctual compatibility', bn: 'Animal symbolism representing sexual and instinctual compatibility', kn: 'Animal symbolism representing sexual and instinctual compatibility', gu: 'Animal symbolism representing sexual and instinctual compatibility' },
      { en: 'Caste hierarchy', hi: 'जाति अनुक्रम', sa: 'जाति अनुक्रम', mai: 'जाति अनुक्रम', mr: 'जाति अनुक्रम', ta: 'Caste hierarchy', te: 'Caste hierarchy', bn: 'Caste hierarchy', kn: 'Caste hierarchy', gu: 'Caste hierarchy' },
      { en: 'Star count between partners', hi: 'साथियों के बीच तारा गणना', sa: 'साथियों के बीच तारा गणना', mai: 'साथियों के बीच तारा गणना', mr: 'साथियों के बीच तारा गणना', ta: 'Star count between partners', te: 'Star count between partners', bn: 'Star count between partners', kn: 'Star count between partners', gu: 'Star count between partners' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Yoni Kuta uses 14 animal pairs assigned to nakshatras. Compatible animal pairs score 4; enemy pairs (cat-rat, snake-mongoose) score 0. It represents instinctual and physical harmony.',
      hi: 'योनि कूट 14 पशु जोड़ियों का उपयोग करता है जो नक्षत्रों को नियत हैं। अनुकूल पशु जोड़ियाँ 4 अंक पाती हैं; शत्रु जोड़ियाँ (बिल्ली-चूहा, साँप-नेवला) 0 अंक। यह सहजवृत्तिक और शारीरिक सामंजस्य दर्शाता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'अष्ट कूट — आठ-कारक अनुकूलता पद्धति' : 'Ashta Kuta — The Eight-Factor Compatibility System'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'अष्ट कूट पद्धति वैदिक ज्योतिष में विवाह अनुकूलता के मूल्यांकन की सर्वाधिक प्रचलित विधि है। यह वधू और वर के चन्द्र नक्षत्रों के आधार पर 8 कारकों (कूटों) का मूल्यांकन करती है, कुल अधिकतम 36 अंक देती है। पारम्परिक रूप से, मिलान स्वीकार्य मानने के लिए न्यूनतम 18 अंक (50%) आवश्यक हैं। 8 कूट बढ़ते भार क्रम में हैं:'
            : 'The Ashta Kuta system is the most widely used method for assessing marriage compatibility in Vedic astrology. It evaluates 8 factors (kutas) based on the Moon nakshatras of the prospective bride and groom, assigning a total maximum score of 36 points. Traditionally, a minimum of 18 points (50%) is required for the match to be considered acceptable. The 8 kutas, in order of ascending weight, are:'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          1. Varna (1 point) — spiritual compatibility based on the four varnas assigned to nakshatras. 2. Vashya (2 points) — dominance/influence compatibility, indicating mutual attraction and control dynamics. 3. Tara (3 points) — star compatibility based on the count between nakshatras modulo 9. 4. Yoni (4 points) — sexual and instinctual compatibility via animal symbolism. 5. Graha Maitri (5 points) — planetary friendship between Moon-sign lords. 6. Gana (3 points) — temperament matching (Deva, Manushya, Rakshasa). 7. Bhakoot (7 points) — Moon-sign relationship (rashi lords). 8. Nadi (8 points) — constitutional/genetic compatibility via Ayurvedic nadi.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          1. वर्ण (1 अंक) — नक्षत्रों को नियत चार वर्णों पर आधारित आध्यात्मिक अनुकूलता। 2. वश्य (2 अंक) — प्रभुत्व/प्रभाव अनुकूलता, परस्पर आकर्षण और नियन्त्रण गतिशीलता। 3. तारा (3 अंक) — नक्षत्रों के बीच गणना मॉड्यूलो 9 पर आधारित तारा अनुकूलता। 4. योनि (4 अंक) — पशु प्रतीकवाद द्वारा यौन और सहजवृत्तिक अनुकूलता। 5. ग्रह मैत्री (5 अंक) — चन्द्र राशि स्वामियों के बीच ग्रह मैत्री। 6. गण (3 अंक) — स्वभाव मिलान (देव, मनुष्य, राक्षस)। 7. भकूट (7 अंक) — चन्द्र राशि सम्बन्ध (राशि स्वामी)। 8. नाड़ी (8 अंक) — आयुर्वेदिक नाड़ी द्वारा प्राकृतिक/आनुवंशिक अनुकूलता।
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'अष्ट कूट पद्धति मुहूर्त चिन्तामणि, ज्योतिष रत्नाकर और विभिन्न धर्मशास्त्र ग्रन्थों में विस्तृत है। जबकि BPHS और बृहत्जातक ग्रहीय विश्लेषण द्वारा अनुकूलता की चर्चा करते हैं, नक्षत्र-आधारित कूट पद्धति उत्तर भारतीय परम्परा में मानक विधि बन गई। दक्षिण भारतीय परम्पराएँ कभी-कभी 10 पोरुथम का भिन्न समूह प्रयोग करती हैं। कूट पद्धति की सुन्दर सरलता — जिसमें केवल जन्म नक्षत्रों की आवश्यकता है — इसे ग्रामीण ज्योतिषियों के लिए सुलभ बनाती थी जिनके पास पूर्ण कुण्डलियाँ उपलब्ध न हों।'
            : 'The Ashta Kuta system is detailed in texts like Muhurta Chintamani, Jyotish Ratnakar, and various Dharmashastra works. While BPHS and Brihat Jataka discuss compatibility through planetary analysis, the nakshatra-based Kuta system became the standard method in North Indian tradition. South Indian traditions sometimes use a different set of 10 porutham (compatibility factors). The Kuta system&apos;s elegant simplicity — requiring only the birth nakshatras — made it accessible to village astrologers who might not have full horoscopes available.'}
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'तारा कूट — तारा अनुकूलता विस्तार से' : 'Tara Kuta — Star Compatibility in Detail'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'तारा कूट (3 अंक) दो नक्षत्रों के स्थितिगत सम्बन्ध का मूल्यांकन करता है। गणना दोनों ओर से की जाती है: वधू के नक्षत्र से वर तक गिनें, और वर से वधू तक। प्रत्येक दिशा में गिनती को 9 से भाग दें और शेषफल नोट करें। शेषफल इंगित करता है कि 9 तारों में से कौन उस सम्बन्ध पर शासन करता है:'
            : 'Tara Kuta (3 points) evaluates the positional relationship between the two nakshatras. The calculation is performed both ways: count from the bride&apos;s nakshatra to the groom&apos;s, and from the groom&apos;s to the bride&apos;s. For each direction, divide the count by 9 and note the remainder. The remainder indicates which of the 9 taras governs that relationship:'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          1. Janma (birth) — neutral. 2. Sampat (wealth) — favorable. 3. Vipat (danger) — unfavorable. 4. Kshema (prosperity) — favorable. 5. Pratyari (obstacles) — unfavorable. 6. Sadhaka (achievement) — favorable. 7. Vadha (death/slayer) — highly unfavorable. 8. Mitra (friend) — favorable. 9. Atimitra/Parama Mitra (great friend) — highly favorable. The even-numbered taras (2, 4, 6, 8) are generally favorable, while odd numbers (3, 5, 7) are unfavorable, with Janma (1) and Atimitra (9) being neutral-to-positive.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          1. जन्म — तटस्थ। 2. सम्पत् (धन) — अनुकूल। 3. विपत् (विपत्ति) — प्रतिकूल। 4. क्षेम (समृद्धि) — अनुकूल। 5. प्रत्यरि (बाधाएँ) — प्रतिकूल। 6. साधक (सिद्धि) — अनुकूल। 7. वध (मृत्यु/वधकर्ता) — अत्यन्त प्रतिकूल। 8. मित्र (सखा) — अनुकूल। 9. अतिमित्र/परम मित्र — अत्यन्त अनुकूल। सम संख्या के तारे (2, 4, 6, 8) सामान्यतः अनुकूल हैं, जबकि विषम (3, 5, 7) प्रतिकूल, जन्म (1) और अतिमित्र (9) तटस्थ-से-सकारात्मक हैं।
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> वधू का नक्षत्र = रोहिणी (4था)। वर का नक्षत्र = हस्त (13वाँ)। वधू से वर तक गणना: 13 - 4 + 1 = 10। 10 mod 9 = 1 → जन्म तारा (तटस्थ)। वर से वधू तक: 4 - 13 + 27 + 1 = 19। 19 mod 9 = 1 → जन्म तारा (तटस्थ)। चूँकि दोनों दिशाओं में हानिकारक तारा नहीं, तारा कूट सन्तुष्ट है।</> : <><span className="text-gold-light font-medium">Example:</span> Bride&apos;s nakshatra = Rohini (4th). Groom&apos;s nakshatra = Hasta (13th). Count from bride to groom: 13 - 4 + 1 = 10. 10 mod 9 = 1 → Janma tara (neutral). Count from groom to bride: 4 - 13 + 27 + 1 = 19. 19 mod 9 = 1 → Janma tara (neutral). Since both directions give non-harmful taras, Tara Kuta is satisfied.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">प्रति-उदाहरण:</span> वधू = अश्विनी (1ला), वर = ज्येष्ठा (18वाँ)। गणना: 18 - 1 + 1 = 18। 18 mod 9 = 0 → 9 (अतिमित्र, अनुकूल)। विपरीत: 1 - 18 + 27 + 1 = 11। 11 mod 9 = 2 → सम्पत् (अनुकूल)। दोनों दिशाएँ अनुकूल — पूर्ण 3 अंक प्रदत्त।</> : <><span className="text-gold-light font-medium">Counter-example:</span> Bride = Ashwini (1st), Groom = Jyeshtha (18th). Count: 18 - 1 + 1 = 18. 18 mod 9 = 0 → maps to 9 (Atimitra, favorable). Reverse: 1 - 18 + 27 + 1 = 11. 11 mod 9 = 2 → Sampat (favorable). Both directions are favorable — full 3 points awarded.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;यदि तारा कूट अंक 0 है तो विवाह विनाशकारी होगा।&quot; तारा कूट 36 में से केवल 3 अंक वहन करता है। कमजोर तारा अंक की भरपाई भकूट (7), नाड़ी (8) और ग्रह मैत्री (5) के सुदृढ़ अंकों से हो सकती है। कोई भी एकल कूट पृथक् रूप से मूल्यांकित नहीं होना चाहिए — समग्र अंक और सभी 8 कूटों का प्रारूप सर्वाधिक महत्त्वपूर्ण है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;If the Tara Kuta score is 0, the marriage is doomed.&quot; Tara Kuta carries only 3 out of 36 points. A poor Tara score can be compensated by strong scores in Bhakoot (7), Nadi (8), and Graha Maitri (5). No single kuta should be evaluated in isolation — the composite score and the pattern across all 8 kutas matter most.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <>अष्ट कूट मिलान भारत भर में व्यवस्थित विवाह वार्ताओं का प्रथम चरण बना हुआ है। वैवाहिक वेबसाइट और ऐप्स &quot;गुण मिलान&quot; अंक प्रमुखता से प्रदर्शित करते हैं। हमारा कुण्डली मिलान उपकरण जन्म नक्षत्रों से सभी 8 कूटों की स्वचालित गणना करता है, व्यक्तिगत और कुल अंक प्रदर्शित करता है, दोषों को चिह्नित करता है, और पारम्परिक निवारण शर्तों की जाँच करता है।</> : <>Ashta Kuta matching remains the first step in arranged marriage negotiations across India. Matrimonial websites and apps prominently display &quot;Gun Milan&quot; scores (another name for Ashta Kuta). Our Kundali Matching tool computes all 8 kutas automatically from the birth nakshatras, displays individual and total scores, flags doshas, and checks for traditional cancellation conditions.</>}
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'नाड़ी दोष — सर्वाधिक भयावह अनुकूलता दोष' : 'Nadi Dosha — The Most Feared Incompatibility'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'नाड़ी कूट 36 में से 8 अंकों का सर्वाधिक भार वहन करता है, जो इसके अनुभूत महत्त्व को दर्शाता है। 27 नक्षत्रों को आयुर्वेदिक शारीरिक प्रकृतियों के अनुसार तीन नाड़ियों में विभक्त किया गया है: आदि नाड़ी (वात — वायु/आकाश), मध्य नाड़ी (पित्त — अग्नि/जल), और अन्त्य नाड़ी (कफ — पृथ्वी/जल)। नियतन 27 नक्षत्रों में चक्रित होता है: अश्विनी=आदि, भरणी=मध्य, कृत्तिका=अन्त्य, रोहिणी=आदि, मृगशिरा=मध्य, आर्द्रा=अन्त्य, इसी प्रकार तीन-तीन के आवर्ती समूहों में।'
            : 'Nadi Kuta carries the highest weight of 8 out of 36 points, reflecting its perceived importance. The 27 nakshatras are divided into three nadis corresponding to Ayurvedic body constitutions: Aadi Nadi (Vata — air/ether), Madhya Nadi (Pitta — fire/water), and Antya Nadi (Kapha — earth/water). The assignment cycles through the 27 nakshatras: Ashwini=Aadi, Bharani=Madhya, Krittika=Antya, Rohini=Aadi, Mrigashira=Madhya, Ardra=Antya, and so on in repeating sets of three.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'जब दोनों साथियों की समान नाड़ी हो तो 0 अंक मिलते हैं और नाड़ी दोष उत्पन्न होता है। पारम्परिक मान्यता है कि समान-नाड़ी दम्पतियों को स्वास्थ्य समस्याएँ, सन्तानोत्पत्ति में कठिनाई, या प्राकृतिक असंगतता का सामना करना पड़ता है। आयुर्वेदिक तर्क यह है कि समान प्रकृति के दो व्यक्ति एक-दूसरे के असन्तुलन को बढ़ाएँगे बजाय पूरक होने के: दो वात प्रकृति में अत्यधिक अस्थिरता, दो पित्त में अत्यधिक ताप और संघर्ष, दो कफ में अत्यधिक जड़ता।'
            : 'When both partners share the same nadi, it scores 0 points and triggers Nadi Dosha. The traditional belief is that same-nadi couples face health problems, difficulties in conceiving children, or constitutional incompatibility. The Ayurvedic logic is that two people of identical prakriti will amplify each other&apos;s imbalances rather than complement them: two Vata types would have excessive restlessness, two Pitta types excessive heat and conflict, two Kapha types excessive lethargy.'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'नाड़ी दोष निवारण शर्तें' : 'Nadi Dosha Cancellation Conditions'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'शास्त्रीय ग्रन्थ कई शर्तें प्रदान करते हैं जिनके अन्तर्गत नाड़ी दोष निरस्त या काफी कम हो जाता है: (1) यदि दोनों की राशि समान किन्तु नक्षत्र भिन्न हो — राशि समानता नाड़ी संघर्ष को अधिलंघित करती है। (2) यदि दोनों का नक्षत्र समान किन्तु राशि भिन्न हो — नक्षत्र बन्धन नाड़ी से ऊपर है। (3) यदि दोनों के राशि स्वामी परस्पर मित्र या एक ही ग्रह हों। (4) यदि नवांश स्वामी सामंजस्यपूर्ण सम्बन्ध बनाएँ। जब निवारण लागू हो, तो ज्योतिषी समान-नाड़ी स्थिति के बावजूद आंशिक या पूर्ण नाड़ी कूट अंक प्रदान कर सकता है।'
            : 'Classical texts provide several conditions under which Nadi Dosha is cancelled or significantly reduced: (1) If both have the same rashi but different nakshatras — the rashi commonality overrides the nadi conflict. (2) If both have the same nakshatra but different rashis — the nakshatra bond supersedes nadi. (3) If the rashi lords of both partners are mutual friends or the same planet. (4) If the navamsha lords create a harmonious relationship. When cancellation applies, the astrologer may award partial or full Nadi Kuta points despite the same-nadi condition.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> वधू = रोहिणी (आदि नाड़ी, वृषभ), वर = मृगशिरा (मध्य नाड़ी, वृषभ/मिथुन)। रोहिणी आदि है, मृगशिरा मध्य — भिन्न नाड़ियाँ। पूर्ण 8 अंक प्रदत्त। नाड़ी दोष नहीं।</> : <><span className="text-gold-light font-medium">Example:</span> Bride = Rohini (Aadi nadi, Taurus), Groom = Mrigashira (Madhya nadi, Taurus/Gemini). Rohini is Aadi, Mrigashira is Madhya — different nadis. Full 8 points awarded. No Nadi Dosha.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">दोष स्थिति:</span> वधू = अश्विनी (आदि नाड़ी, मेष), वर = पुनर्वसु (आदि नाड़ी, मिथुन/कर्क)। दोनों आदि — नाड़ी दोष, 0/8 अंक। तथापि, चूँकि उनकी राशियाँ भिन्न हैं और राशि स्वामी (मंगल बनाम बुध/चन्द्र) शत्रु नहीं हैं, कुछ परम्पराओं में आंशिक निवारण लागू हो सकता है।</> : <><span className="text-gold-light font-medium">Dosha case:</span> Bride = Ashwini (Aadi nadi, Aries), Groom = Punarvasu (Aadi nadi, Gemini/Cancer). Both Aadi — Nadi Dosha triggered, 0/8 points. However, since their rashis are different and rashi lords (Mars vs Mercury/Moon) are not enemies, partial cancellation may apply in some traditions.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;नाड़ी दोष विवाह को पूर्णतया रोकता है — कोई उपाय नहीं है।&quot; वास्तव में, नाड़ी दोष सबसे अधिक सामने आने वाला दोष है (यह लगभग 3 में से 1 यादृच्छिक मिलान को प्रभावित करता है), और इसके बावजूद लाखों सफल विवाह हुए हैं। निवारण शर्तें सुप्रलेखित और व्यापक रूप से स्वीकृत हैं। नाड़ी दोष को पूर्ण निषेध मानना अत्यधिक कठोर है और सन्तुलित शास्त्रीय विद्वत्ता द्वारा समर्थित नहीं है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Nadi Dosha absolutely prevents marriage — there is no remedy.&quot; In practice, Nadi Dosha is the most frequently encountered dosha (it affects roughly 1 in 3 random matches), and millions of successful marriages exist despite it. The cancellation conditions are well-documented and widely accepted. Treating Nadi Dosha as an absolute veto is overly rigid and not supported by balanced classical scholarship.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'नाड़ी दोष भारत भर में विवाह मिलान की प्राथमिक चिन्ताओं में बना हुआ है। कई परिवार केवल नाड़ी दोष के आधार पर मिलान अस्वीकार कर देते हैं, भले ही समग्र कूट अंक उच्च हो। प्रगतिशील ज्योतिषी केवल नाड़ी दोष पर मिलान अस्वीकार करने से पहले पूर्ण कुण्डली जाँच की वकालत करते हैं। हमारा मिलान उपकरण न केवल कच्चे नाड़ी अंक गणित करता है बल्कि सभी शास्त्रीय निवारण शर्तों की जाँच करता है और उन्हें स्पष्ट रूप से प्रस्तुत करता है, जिससे परिवार अधिक सूचित निर्णय ले सकें।'
            : 'Nadi Dosha remains one of the primary concerns in marriage matching across India. Many families will reject a match solely based on Nadi Dosha, even if the overall Kuta score is high. Progressive astrologers advocate examining the full horoscope before rejecting a match on Nadi Dosha alone. Our matching tool not only computes the raw Nadi score but also checks all classical cancellation conditions and presents them clearly, helping families make more informed decisions.'}
        </p>
      </section>
    </div>
  );
}

export default function Module6_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
