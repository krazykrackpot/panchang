'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_17_3', phase: 5, topic: 'Muhurta', moduleNumber: '17.3',
  title: {
    en: 'Muhurta for Property & Travel',
    hi: 'सम्पत्ति एवं यात्रा मुहूर्त',
  },
  subtitle: {
    en: 'Griha Pravesh, vehicle purchase, and travel muhurta — Bhoomi Dosha, Disha Shool, Tara Bala, and Chandrabala',
    hi: 'गृह प्रवेश, वाहन क्रय और यात्रा मुहूर्त — भूमि दोष, दिशा शूल, तारा बल और चन्द्र बल',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 17-1: The Science of Timing', hi: 'मॉड्यूल 17-1: समय निर्धारण का विज्ञान' }, href: '/learn/modules/17-1' },
    { label: { en: 'Module 17-2: Muhurta for Marriage', hi: 'मॉड्यूल 17-2: विवाह मुहूर्त' }, href: '/learn/modules/17-2' },
    { label: { en: 'Module 17-4: Muhurta for Education & Naming', hi: 'मॉड्यूल 17-4: शिक्षा एवं नामकरण मुहूर्त' }, href: '/learn/modules/17-4' },
    { label: { en: 'Muhurta AI Tool', hi: 'मुहूर्त AI उपकरण' }, href: '/muhurta-ai' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q17_3_01', type: 'mcq',
    question: {
      en: 'Which nakshatras are specifically recommended for Griha Pravesh (house entry)?',
      hi: 'गृह प्रवेश के लिए कौन-से नक्षत्र विशेष रूप से अनुशंसित हैं?',
    },
    options: [
      { en: 'Ardra, Ashlesha, Bharani', hi: 'आर्द्रा, आश्लेषा, भरणी' },
      { en: 'Dhanishtha, Uttara Phalguni, Uttarabhadrapada, Rohini', hi: 'धनिष्ठा, उत्तरा फाल्गुनी, उत्तरा भाद्रपद, रोहिणी' },
      { en: 'Mula, Jyeshtha, Ashwini', hi: 'मूल, ज्येष्ठा, अश्विनी' },
      { en: 'Any nakshatra is acceptable', hi: 'कोई भी नक्षत्र स्वीकार्य है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Dhanishtha, Uttara Phalguni, Uttarabhadrapada, and Rohini are the primary nakshatras for Griha Pravesh. These are Dhruva (fixed/stable) nakshatras — ideal for permanent works like entering a new home. Stability in the home is the key quality sought.',
      hi: 'धनिष्ठा, उत्तरा फाल्गुनी, उत्तरा भाद्रपद और रोहिणी गृह प्रवेश के प्राथमिक नक्षत्र हैं। ये ध्रुव (स्थिर) नक्षत्र हैं — नए घर में प्रवेश जैसे स्थायी कार्यों के लिए आदर्श।',
    },
  },
  {
    id: 'q17_3_02', type: 'mcq',
    question: {
      en: 'For Griha Pravesh, in which houses from the natal Moon should the transit Moon ideally be?',
      hi: 'गृह प्रवेश के लिए गोचर चन्द्रमा जन्म चन्द्रमा से आदर्श रूप से किन भावों में होना चाहिए?',
    },
    options: [
      { en: 'Only in the 1st house', hi: 'केवल 1ले भाव में' },
      { en: '2nd, 4th, 6th, 7th, 9th, 10th, or 11th from natal Moon', hi: 'जन्म चन्द्र से 2, 4, 6, 7, 9, 10, या 11वें भाव में' },
      { en: '8th and 12th from natal Moon', hi: 'जन्म चन्द्र से 8वें और 12वें भाव में' },
      { en: 'Moon position does not matter', hi: 'चन्द्रमा की स्थिति महत्वपूर्ण नहीं है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'For Griha Pravesh, the transit Moon should be in the 2nd, 4th, 6th, 7th, 9th, 10th, or 11th house from the natal Moon. This is the Chandrabala (Moon strength) requirement. Moon in the 1st, 3rd, 5th, 8th, or 12th from natal Moon is unfavourable.',
      hi: 'गृह प्रवेश के लिए गोचर चन्द्रमा जन्म चन्द्रमा से 2, 4, 6, 7, 9, 10, या 11वें भाव में होना चाहिए। यह चन्द्र बल की आवश्यकता है। जन्म चन्द्र से 1, 3, 5, 8, या 12वें भाव में चन्द्रमा अनुकूल नहीं है।',
    },
  },
  {
    id: 'q17_3_03', type: 'true_false',
    question: {
      en: 'Bhoomi Dosha is a directional defect based on the month and direction of the house entrance.',
      hi: 'भूमि दोष मास और घर के प्रवेश द्वार की दिशा पर आधारित एक दिशात्मक दोष है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Bhoomi Dosha considers which direction is inauspicious based on the current month. For example, if the defected direction falls on the entrance direction of the house, the Griha Pravesh should be postponed. This is a unique factor specific to property-related muhurtas.',
      hi: 'सत्य। भूमि दोष वर्तमान मास के आधार पर कौन-सी दिशा अशुभ है, इसका विचार करता है। उदाहरणार्थ, यदि दोषपूर्ण दिशा घर के प्रवेश द्वार की दिशा पर पड़ती है, तो गृह प्रवेश स्थगित किया जाना चाहिए।',
    },
  },
  {
    id: 'q17_3_04', type: 'mcq',
    question: {
      en: 'Which days of the week are recommended for Griha Pravesh?',
      hi: 'गृह प्रवेश के लिए सप्ताह के कौन-से दिन अनुशंसित हैं?',
    },
    options: [
      { en: 'Saturday and Tuesday', hi: 'शनिवार और मंगलवार' },
      { en: 'Monday, Wednesday, Thursday, Friday', hi: 'सोमवार, बुधवार, गुरुवार, शुक्रवार' },
      { en: 'Only Sunday', hi: 'केवल रविवार' },
      { en: 'Any day is equally suitable', hi: 'कोई भी दिन समान रूप से उपयुक्त है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Monday (Moon — emotional comfort), Wednesday (Mercury — communication), Thursday (Jupiter — blessings, growth), and Friday (Venus — luxury, beauty) are preferred for Griha Pravesh. Saturday (Saturn — delays) and Tuesday (Mars — conflict) are generally avoided for house entry.',
      hi: 'सोमवार (चन्द्र — भावनात्मक सुख), बुधवार (बुध — संवाद), गुरुवार (बृहस्पति — आशीर्वाद), और शुक्रवार (शुक्र — विलासिता) गृह प्रवेश के लिए प्राथमिक हैं। शनिवार (शनि — विलम्ब) और मंगलवार (मंगल — संघर्ष) सामान्यतः टाले जाते हैं।',
    },
  },
  {
    id: 'q17_3_05', type: 'mcq',
    question: {
      en: 'For vehicle purchase muhurta, which house should be strong in the lagna chart?',
      hi: 'वाहन क्रय मुहूर्त में लग्न कुण्डली में कौन-सा भाव बलवान होना चाहिए?',
    },
    options: [
      { en: '7th house', hi: '7वाँ भाव' },
      { en: '4th house', hi: '4वाँ भाव' },
      { en: '12th house', hi: '12वाँ भाव' },
      { en: '6th house', hi: '6वाँ भाव' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 4th house represents vehicles, conveyances, and material comforts. A strong 4th house with benefic planets (or a benefic aspect) in the vehicle purchase muhurta chart ensures the vehicle brings comfort, safety, and no major issues.',
      hi: '4वाँ भाव वाहनों, सवारियों और भौतिक सुखों का प्रतिनिधित्व करता है। वाहन क्रय मुहूर्त कुण्डली में शुभ ग्रहों या शुभ दृष्टि के साथ बलवान 4वाँ भाव सुनिश्चित करता है कि वाहन सुख, सुरक्षा और कोई बड़ी समस्या न लाए।',
    },
  },
  {
    id: 'q17_3_06', type: 'true_false',
    question: {
      en: 'Tuesday is considered significant for vehicle purchase because Mars rules vehicles and machinery.',
      hi: 'वाहन क्रय के लिए मंगलवार महत्वपूर्ण माना जाता है क्योंकि मंगल वाहनों और यन्त्रों का स्वामी है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Mars is the karaka (significator) for vehicles, machinery, and engineering. Tuesday (Mars\'s day) can be favourable for vehicle purchase when Mars is well-placed. However, Mars should not be debilitated or afflicted in the muhurta chart.',
      hi: 'सत्य। मंगल वाहनों, यन्त्रों और अभियान्त्रिकी का कारक है। मंगलवार (मंगल का दिन) वाहन क्रय के लिए अनुकूल हो सकता है जब मंगल सुस्थित हो। परन्तु मंगल मुहूर्त कुण्डली में नीच या पीड़ित नहीं होना चाहिए।',
    },
  },
  {
    id: 'q17_3_07', type: 'mcq',
    question: {
      en: 'What is Disha Shool in the context of travel muhurta?',
      hi: 'यात्रा मुहूर्त के सन्दर्भ में दिशा शूल क्या है?',
    },
    options: [
      { en: 'A type of yoga combination', hi: 'एक प्रकार का योग संयोजन' },
      { en: 'A directional defect based on the weekday — certain directions are inauspicious on specific days', hi: 'वार पर आधारित दिशात्मक दोष — विशिष्ट दिनों में कुछ दिशाएँ अशुभ हैं' },
      { en: 'A planetary dasha transition', hi: 'ग्रह दशा संक्रमण' },
      { en: 'A type of eclipse', hi: 'एक प्रकार का ग्रहण' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Disha Shool assigns inauspicious travel directions by weekday: Sunday = West, Monday = East, Tuesday = North, Wednesday = None (all safe), Thursday = South, Friday = West, Saturday = East. Travel in the Shool direction should be avoided or a remedial detour taken.',
      hi: 'दिशा शूल वार के अनुसार अशुभ यात्रा दिशाएँ निर्दिष्ट करता है: रविवार = पश्चिम, सोमवार = पूर्व, मंगलवार = उत्तर, बुधवार = कोई नहीं, गुरुवार = दक्षिण, शुक्रवार = पश्चिम, शनिवार = पूर्व। शूल दिशा में यात्रा से बचना चाहिए।',
    },
  },
  {
    id: 'q17_3_08', type: 'mcq',
    question: {
      en: 'Tara Bala for travel is calculated from:',
      hi: 'यात्रा के लिए तारा बल की गणना किससे होती है?',
    },
    options: [
      { en: 'The Sun\'s current position', hi: 'सूर्य की वर्तमान स्थिति' },
      { en: 'The birth nakshatra of the traveller', hi: 'यात्री के जन्म नक्षत्र से' },
      { en: 'The lagna at departure time', hi: 'प्रस्थान समय का लग्न' },
      { en: 'The nakshatra of the destination city', hi: 'गन्तव्य नगर का नक्षत्र' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Tara Bala is calculated by counting from the traveller\'s birth nakshatra to the current transit nakshatra and dividing by 9. Certain remainders (1=Janma, 3=Vipat, 5=Pratyari, 7=Vadha) are inauspicious, while others (2=Sampat, 4=Kshema, 6=Sadhaka, 8=Mitra, 9=Ati-Mitra) are favourable.',
      hi: 'तारा बल यात्री के जन्म नक्षत्र से वर्तमान गोचर नक्षत्र तक गिनकर 9 से भाग देकर गणना होता है। कुछ शेषफल (1=जन्म, 3=विपत्, 5=प्रत्यरि, 7=वध) अशुभ हैं, जबकि अन्य (2=सम्पत्, 4=क्षेम, 6=साधक, 8=मित्र, 9=अतिमित्र) शुभ हैं।',
    },
  },
  {
    id: 'q17_3_09', type: 'true_false',
    question: {
      en: 'For short trips, only Disha Shool avoidance is needed, while long journeys require Tara Bala and Chandrabala as well.',
      hi: 'छोटी यात्राओं के लिए केवल दिशा शूल से बचाव आवश्यक है, जबकि लम्बी यात्राओं में तारा बल और चन्द्र बल भी आवश्यक हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Short local trips primarily need Disha Shool avoidance. Long journeys (interstate, international) should check all three: Disha Shool (directional safety), Tara Bala (star strength from birth nakshatra), and Chandrabala (Moon\'s position from natal Moon). All three must be favourable for important long-distance travel.',
      hi: 'सत्य। छोटी स्थानीय यात्राओं में मुख्यतः दिशा शूल से बचाव आवश्यक है। लम्बी यात्राओं (अन्तर्राज्यीय, अन्तर्राष्ट्रीय) में तीनों की जाँच होनी चाहिए: दिशा शूल, तारा बल और चन्द्र बल। महत्वपूर्ण लम्बी यात्रा के लिए तीनों अनुकूल होने चाहिएँ।',
    },
  },
  {
    id: 'q17_3_10', type: 'mcq',
    question: {
      en: 'Which nakshatras are recommended for vehicle purchase?',
      hi: 'वाहन क्रय के लिए कौन-से नक्षत्र अनुशंसित हैं?',
    },
    options: [
      { en: 'Mula, Ardra, Ashlesha', hi: 'मूल, आर्द्रा, आश्लेषा' },
      { en: 'Ashwini, Rohini, Pushya, Hasta, Chitra', hi: 'अश्विनी, रोहिणी, पुष्य, हस्त, चित्रा' },
      { en: 'Bharani, Krittika, Vishakha', hi: 'भरणी, कृत्तिका, विशाखा' },
      { en: 'Only Revati', hi: 'केवल रेवती' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Ashwini (swift, connected to horses/transport), Rohini (stability, beauty), Pushya (most auspicious for purchases), Hasta (skill, hands-on), and Chitra (beauty, craftsmanship) are the ideal nakshatras for vehicle purchase. Pushya is considered the best nakshatra for any purchase.',
      hi: 'अश्विनी (शीघ्र, घोड़ों/परिवहन से जुड़ा), रोहिणी (स्थिरता, सौन्दर्य), पुष्य (क्रय के लिए सर्वाधिक शुभ), हस्त (कौशल), और चित्रा (सौन्दर्य, शिल्पकला) वाहन क्रय के लिए आदर्श नक्षत्र हैं। पुष्य किसी भी क्रय के लिए सर्वश्रेष्ठ नक्षत्र माना जाता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Griha Pravesh — Entering a New Home
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Griha Pravesh (house entry) is one of the 16 Samskaras (life ceremonies) in Hindu tradition. The moment you first enter your new home creates an inception chart for your life in that dwelling — affecting health, wealth, relationships, and overall prosperity for as long as you live there.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The strongest 4th house in the Muhurta chart is essential — this is the house of property, home, and material comforts. The Moon should be in the 2nd, 4th, 6th, 7th, 9th, 10th, or 11th from the natal Moon (Chandrabala). The recommended nakshatras are the Dhruva (fixed) group: Dhanishtha, Uttara Phalguni, Uttarabhadrapada, and Rohini — all conferring stability and permanence.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Monday, Wednesday, Thursday, and Friday are the preferred weekdays. A unique factor for Griha Pravesh is Bhoomi Dosha — a directional defect based on the month and the direction of the house entrance. If the current month&rsquo;s inauspicious direction matches your entrance direction, the Griha Pravesh should be deferred. This factor does not apply to other types of Muhurta.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Bhoomi Dosha — The Directional Defect</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Bhoomi Dosha divides the year into directional periods. During certain months, entering from certain directions is considered inauspicious — it is believed to bring illness, financial loss, or domestic discord. The remedy is either to wait for the direction to clear (usually a month) or to perform a specific Vastu Shanti puja before entry. Our Muhurta tool automatically flags Bhoomi Dosha when evaluating Griha Pravesh candidates.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Vehicle Purchase Muhurta
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          A vehicle is a significant purchase with safety implications, making the Muhurta important. The 4th house should be strong in the lagna chart — benefic planets in or aspecting the 4th house. The lagna lord should not be debilitated, combust, or in the 8th house (which represents accidents and sudden problems).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Tuesday holds special significance because Mars (ruler of Tuesday) is the karaka for vehicles, machinery, and engineering. When Mars is well-placed (in own sign, exalted, or in a kendra), Tuesday becomes a strong day for vehicle purchase. However, Mars debilitated or in the 8th house makes Tuesday unfavourable.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The ideal nakshatras for vehicle purchase are: Ashwini (the divine horsemen — connected to transport), Rohini (stability and beauty), Pushya (the most auspicious nakshatra for any purchase — nourishment and growth), Hasta (skillful hands, craftsmanship), and Chitra (beauty, artistry). Avoid Vishti karana, Moon in the 8th or 12th house, and debilitated lagna lord.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Vehicle Purchase Checklist</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">4th House:</span> Strong, with benefic influence. No malefics in the 4th or 8th.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Nakshatra:</span> Ashwini, Rohini, Pushya, Hasta, or Chitra preferred.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Day:</span> Tuesday (Mars strong), Thursday (Jupiter), or Friday (Venus for luxury).</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Avoid:</span> Vishti karana, Moon in 8th/12th, debilitated lagna lord.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Mars:</span> Should be well-placed — own sign, exalted, or in kendra. Not in 8th house.</p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Travel Muhurta — Disha Shool, Tara Bala, Chandrabala
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Travel Muhurta involves three unique factors not used in other Muhurta types. The most critical is Disha Shool — a directional defect that assigns an inauspicious direction to each weekday. Sunday: West. Monday: East. Tuesday: North. Wednesday: safe in all directions. Thursday: South. Friday: West. Saturday: East. Travelling in the Shool direction is believed to bring obstacles, delays, or harm.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Tara Bala (star strength) is calculated from the traveller&rsquo;s birth nakshatra. Count from birth nakshatra to the current transit nakshatra, divide by 9. The remainder indicates the tara: 1 (Janma — avoid), 2 (Sampat — wealth), 3 (Vipat — danger), 4 (Kshema — well-being), 5 (Pratyari — obstacle), 6 (Sadhaka — achievement), 7 (Vadha — death — avoid), 8 (Mitra — friend), 9 (Ati-Mitra — best friend). Taras 1, 3, 5, 7 are unfavourable; 2, 4, 6, 8, 9 are favourable.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Chandrabala checks the transit Moon&rsquo;s position relative to the natal Moon. For travel, Moon in the 3rd, 6th, 10th, or 11th from natal Moon is excellent. Moon in the 8th is the worst (danger, accidents). For short trips, only Disha Shool avoidance is necessary. For long journeys — interstate, international, or by air — all three factors (Disha Shool, Tara Bala, Chandrabala) should be favourable.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Disha Shool Quick Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Sunday:</span> West inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Monday:</span> East inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Tuesday:</span> North inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Wednesday:</span> All directions safe</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Thursday:</span> South inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Friday:</span> West inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Saturday:</span> East inauspicious</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Remedial Detour</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          If travel in the Disha Shool direction is unavoidable, the traditional remedy is a detour: first travel a short distance in a non-Shool direction (even a few kilometres), pause briefly (offering a prayer), then redirect toward the destination. This symbolically &ldquo;breaks&rdquo; the initial directional defect. Wednesday is the safest day for travel in any direction as it has no Disha Shool.
        </p>
      </section>
    </div>
  );
}

export default function Module17_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
