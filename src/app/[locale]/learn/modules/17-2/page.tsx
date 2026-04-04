'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_17_2', phase: 5, topic: 'Muhurta', moduleNumber: '17.2',
  title: {
    en: 'Muhurta for Marriage (Vivah)',
    hi: 'विवाह मुहूर्त',
  },
  subtitle: {
    en: 'The most complex Muhurta selection — suitable nakshatras, lagna requirements, Venus/Jupiter conditions, and seasonal restrictions',
    hi: 'सर्वाधिक जटिल मुहूर्त चयन — उपयुक्त नक्षत्र, लग्न आवश्यकताएँ, शुक्र/बृहस्पति की स्थिति, और ऋतु प्रतिबन्ध',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 17-1: The Science of Timing', hi: 'मॉड्यूल 17-1: समय निर्धारण का विज्ञान' }, href: '/learn/modules/17-1' },
    { label: { en: 'Module 17-3: Muhurta for Property & Travel', hi: 'मॉड्यूल 17-3: सम्पत्ति एवं यात्रा मुहूर्त' }, href: '/learn/modules/17-3' },
    { label: { en: 'Module 17-4: Muhurta for Education & Naming', hi: 'मॉड्यूल 17-4: शिक्षा एवं नामकरण मुहूर्त' }, href: '/learn/modules/17-4' },
    { label: { en: 'Muhurta AI Tool', hi: 'मुहूर्त AI उपकरण' }, href: '/muhurta-ai' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q17_2_01', type: 'mcq',
    question: {
      en: 'Which of the following is a Shubha nakshatra suitable for marriage?',
      hi: 'निम्नलिखित में से कौन-सा शुभ नक्षत्र विवाह के लिए उपयुक्त है?',
    },
    options: [
      { en: 'Ardra', hi: 'आर्द्रा' },
      { en: 'Rohini', hi: 'रोहिणी' },
      { en: 'Ashlesha', hi: 'आश्लेषा' },
      { en: 'Bharani', hi: 'भरणी' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Rohini is one of the most auspicious nakshatras for marriage. The full list includes: Rohini, Mrigashira, Uttara Phalguni, Hasta, Swati, Anuradha, Uttara Ashadha, Uttarabhadrapada, and Revati. These are Dhruva (fixed) or Mridu (soft) nakshatras.',
      hi: 'रोहिणी विवाह के लिए सर्वाधिक शुभ नक्षत्रों में से एक है। पूर्ण सूची: रोहिणी, मृगशिरा, उत्तरा फाल्गुनी, हस्त, स्वाति, अनुराधा, उत्तरा आषाढ़ा, उत्तरा भाद्रपद और रेवती। ये ध्रुव या मृदु नक्षत्र हैं।',
    },
  },
  {
    id: 'q17_2_02', type: 'mcq',
    question: {
      en: 'Which house lagnas are considered ideal for the marriage Muhurta chart?',
      hi: 'विवाह मुहूर्त कुण्डली के लिए कौन-से भाव लग्न आदर्श माने जाते हैं?',
    },
    options: [
      { en: '6th, 8th, or 12th', hi: '6वाँ, 8वाँ, या 12वाँ' },
      { en: '2nd, 7th, or 11th', hi: '2रा, 7वाँ, या 11वाँ' },
      { en: '3rd or 9th only', hi: 'केवल 3रा या 9वाँ' },
      { en: 'Any house is equally good', hi: 'कोई भी भाव समान रूप से अच्छा है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 2nd house (family, wealth), 7th house (partnership, marriage itself), and 11th house (gains, fulfilment of desires) are the ideal lagnas for marriage. The lagna lord of the Muhurta chart should be strong and well-placed.',
      hi: '2रा भाव (परिवार, धन), 7वाँ भाव (साझेदारी, विवाह स्वयं), और 11वाँ भाव (लाभ, इच्छाओं की पूर्ति) विवाह के लिए आदर्श लग्न हैं। मुहूर्त कुण्डली का लग्नेश बलवान और सुस्थित होना चाहिए।',
    },
  },
  {
    id: 'q17_2_03', type: 'true_false',
    question: {
      en: 'Venus being combust (too close to the Sun) is acceptable in a marriage Muhurta.',
      hi: 'विवाह मुहूर्त में शुक्र का अस्त (सूर्य के अत्यधिक निकट) होना स्वीकार्य है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Venus (the karaka/significator of marriage) must NOT be combust during a marriage Muhurta. Combust Venus means the planet of love, harmony, and partnership is overpowered by the Sun\'s energy, which is considered highly inauspicious for marital happiness.',
      hi: 'असत्य। शुक्र (विवाह का कारक) विवाह मुहूर्त में अस्त नहीं होना चाहिए। अस्त शुक्र का अर्थ है कि प्रेम, सामंजस्य और साझेदारी का ग्रह सूर्य की ऊर्जा से अभिभूत है, जो वैवाहिक सुख के लिए अत्यन्त अशुभ माना जाता है।',
    },
  },
  {
    id: 'q17_2_04', type: 'mcq',
    question: {
      en: 'Which Karana must be specifically avoided in marriage Muhurta?',
      hi: 'विवाह मुहूर्त में कौन-सा करण विशेष रूप से वर्जित है?',
    },
    options: [
      { en: 'Bava', hi: 'बव' },
      { en: 'Balava', hi: 'बालव' },
      { en: 'Vishti (Bhadra)', hi: 'विष्टि (भद्रा)' },
      { en: 'Kaulava', hi: 'कौलव' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Vishti (also called Bhadra) karana is the most inauspicious karana and must be strictly avoided for marriage. It occurs 4 times in each lunar month. Rikta tithis (4th, 9th, 14th) are also avoided as they are considered "empty."',
      hi: 'विष्टि (भद्रा भी कहलाता है) करण सर्वाधिक अशुभ करण है और विवाह में कड़ाई से वर्जित है। यह प्रत्येक चान्द्र मास में 4 बार आता है। रिक्ता तिथियाँ (चतुर्थी, नवमी, चतुर्दशी) भी वर्जित हैं क्योंकि ये "रिक्त" मानी जाती हैं।',
    },
  },
  {
    id: 'q17_2_05', type: 'mcq',
    question: {
      en: 'Why is Shukla Paksha (waxing Moon) preferred for marriage?',
      hi: 'विवाह के लिए शुक्ल पक्ष (बढ़ता चन्द्रमा) क्यों प्राथमिक है?',
    },
    options: [
      { en: 'The Moon is invisible during Shukla Paksha', hi: 'शुक्ल पक्ष में चन्द्रमा अदृश्य होता है' },
      { en: 'Waxing Moon symbolizes growth, prosperity, and increasing happiness', hi: 'बढ़ता चन्द्रमा वृद्धि, समृद्धि और बढ़ते सुख का प्रतीक है' },
      { en: 'It is merely a tradition with no astrological basis', hi: 'यह मात्र एक परम्परा है जिसका कोई ज्योतिषीय आधार नहीं' },
      { en: 'The Sun is stronger during this phase', hi: 'इस चरण में सूर्य अधिक बलवान होता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Waxing Moon (Shukla Paksha) symbolizes growth and increasing brightness — a metaphor for the marriage growing in happiness. Additionally, the Moon is stronger during Shukla Paksha (greater Paksha Bala), ensuring emotional stability at the start of married life.',
      hi: 'शुक्ल पक्ष (बढ़ता चन्द्रमा) वृद्धि और बढ़ती चमक का प्रतीक है — विवाह में बढ़ते सुख का रूपक। साथ ही, शुक्ल पक्ष में चन्द्रमा बलवान होता है (अधिक पक्ष बल), जो वैवाहिक जीवन के आरम्भ में भावनात्मक स्थिरता सुनिश्चित करता है।',
    },
  },
  {
    id: 'q17_2_06', type: 'true_false',
    question: {
      en: 'Marriages can be performed during Pitru Paksha (the fortnight of ancestor worship).',
      hi: 'पितृ पक्ष (पूर्वज पूजा का पखवाड़ा) के दौरान विवाह सम्पन्न किए जा सकते हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Pitru Paksha (the dark fortnight of Bhadrapada/Ashwin month) is dedicated to ancestor worship and shraddha ceremonies. All auspicious activities including marriage are strictly prohibited during this period. Eclipses (within 7 days) and Chaturmas also restrict marriage.',
      hi: 'असत्य। पितृ पक्ष (भाद्रपद/आश्विन मास का कृष्ण पक्ष) पूर्वज पूजा और श्राद्ध कर्मों के लिए समर्पित है। इस अवधि में विवाह सहित सभी शुभ कार्य कड़ाई से वर्जित हैं। ग्रहण (7 दिनों के भीतर) और चातुर्मास भी विवाह प्रतिबन्धित करते हैं।',
    },
  },
  {
    id: 'q17_2_07', type: 'mcq',
    question: {
      en: 'Jupiter\'s role in a marriage Muhurta chart ideally is:',
      hi: 'विवाह मुहूर्त कुण्डली में बृहस्पति की आदर्श भूमिका है:',
    },
    options: [
      { en: 'Jupiter should be in the 8th house', hi: 'बृहस्पति 8वें भाव में होना चाहिए' },
      { en: 'Jupiter should aspect the lagna or 7th house', hi: 'बृहस्पति को लग्न या 7वें भाव पर दृष्टि डालनी चाहिए' },
      { en: 'Jupiter\'s position is irrelevant for marriage', hi: 'विवाह के लिए बृहस्पति की स्थिति अप्रासंगिक है' },
      { en: 'Jupiter should be combust', hi: 'बृहस्पति अस्त होना चाहिए' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jupiter (Guru) is the planet of blessings, expansion, and dharma. Its aspect on the lagna or 7th house of the marriage Muhurta chart brings divine grace, mutual respect, and dharmic foundation to the marriage. Jupiter in kendras is also highly favourable.',
      hi: 'बृहस्पति (गुरु) आशीर्वाद, विस्तार और धर्म का ग्रह है। विवाह मुहूर्त कुण्डली के लग्न या 7वें भाव पर इसकी दृष्टि दिव्य कृपा, पारस्परिक सम्मान और धार्मिक आधार लाती है। केन्द्रों में बृहस्पति भी अत्यन्त शुभ है।',
    },
  },
  {
    id: 'q17_2_08', type: 'mcq',
    question: {
      en: 'What is Chaturmas in the context of marriage restrictions?',
      hi: 'विवाह प्रतिबन्धों के सन्दर्भ में चातुर्मास क्या है?',
    },
    options: [
      { en: 'A 4-day festival', hi: '4 दिन का उत्सव' },
      { en: 'The 4 months of Vishnu\'s sleep (roughly July-November)', hi: 'विष्णु की निद्रा के 4 मास (लगभग जुलाई-नवम्बर)' },
      { en: 'A special type of muhurta', hi: 'एक विशेष प्रकार का मुहूर्त' },
      { en: 'The 4 eclipse seasons', hi: '4 ग्रहण ऋतुएँ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Chaturmas (literally "four months") is the period from Devshayani Ekadashi (Ashadha) to Prabodhini Ekadashi (Kartik), roughly July to November. Lord Vishnu is believed to be in cosmic sleep. Many traditions restrict marriages during this period, though practices vary by region.',
      hi: 'चातुर्मास (शाब्दिक अर्थ "चार मास") देवशयनी एकादशी (आषाढ़) से प्रबोधिनी एकादशी (कार्तिक) तक की अवधि है, लगभग जुलाई से नवम्बर। भगवान विष्णु को ब्रह्माण्डीय निद्रा में माना जाता है। अनेक परम्पराएँ इस अवधि में विवाह प्रतिबन्धित करती हैं।',
    },
  },
  {
    id: 'q17_2_09', type: 'true_false',
    question: {
      en: 'No malefic planet should occupy the 8th house of the marriage Muhurta chart.',
      hi: 'विवाह मुहूर्त कुण्डली के 8वें भाव में कोई पापी ग्रह नहीं होना चाहिए।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The 8th house represents longevity of the marriage and hidden challenges. Malefic planets (Saturn, Mars, Rahu, Ketu) in the 8th house of the Muhurta chart indicate potential for serious marital difficulties, secrets, or premature end to the union.',
      hi: 'सत्य। 8वाँ भाव विवाह की दीर्घायु और छिपी चुनौतियों का प्रतिनिधित्व करता है। मुहूर्त कुण्डली के 8वें भाव में पापी ग्रह (शनि, मंगल, राहु, केतु) गम्भीर वैवाहिक कठिनाइयों, रहस्यों, या बन्धन के अकाल अन्त की सम्भावना दर्शाते हैं।',
    },
  },
  {
    id: 'q17_2_10', type: 'mcq',
    question: {
      en: 'North and South Indian traditions primarily differ on marriage during:',
      hi: 'उत्तर और दक्षिण भारतीय परम्पराएँ मुख्यतः किस दौरान विवाह पर भिन्न हैं?',
    },
    options: [
      { en: 'Shukla Paksha', hi: 'शुक्ल पक्ष' },
      { en: 'Adhika Masa (intercalary month)', hi: 'अधिक मास (अधिमास)' },
      { en: 'Pushya nakshatra', hi: 'पुष्य नक्षत्र' },
      { en: 'Wednesday', hi: 'बुधवार' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The most significant regional difference is about Adhika Masa (the intercalary/extra month that occurs about every 3 years). North Indian tradition generally prohibits marriages during Adhika Masa, while some South Indian traditions permit them. The final decision often rests with the family pandit.',
      hi: 'सबसे महत्वपूर्ण क्षेत्रीय अन्तर अधिक मास (अधिमास जो लगभग प्रत्येक 3 वर्षों में आता है) के बारे में है। उत्तर भारतीय परम्परा सामान्यतः अधिक मास में विवाह वर्जित करती है, जबकि कुछ दक्षिण भारतीय परम्पराएँ इसकी अनुमति देती हैं।',
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
          Marriage Muhurta — The Most Complex Selection
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Marriage (Vivah) Muhurta is considered the most complex Muhurta to select because it must satisfy the maximum number of conditions simultaneously. Unlike a business Muhurta (where a few good factors suffice), a marriage Muhurta must check nakshatra suitability, tithi quality, karana, yoga, lagna strength, planetary positions (especially Venus and Jupiter), and seasonal restrictions — all at once.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The preferred nakshatras for marriage are those classified as Dhruva (fixed, stable) or Mridu (soft, gentle): Rohini, Mrigashira, Uttara Phalguni, Hasta, Swati, Anuradha, Uttara Ashadha, Uttarabhadrapada, and Revati. These nakshatras confer stability, gentleness, and growth — qualities essential for a lasting marriage.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Absolutely avoided: Vishti (Bhadra) karana, Rikta tithis (4th, 9th, 14th), Vyatipata/Vaidhriti yoga, Rahu Kaal during the ceremony. The wedding ceremony (particularly the Saptapadi/seven steps) should ideally occur during the auspicious window, not just the reception or formal registration.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">The Nine Marriage Nakshatras</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Rohini (stability, beauty), Mrigashira (gentleness, seeking), Uttara Phalguni (patronage, lasting bonds), Hasta (skill, craftsmanship in relationships), Swati (independence with harmony), Anuradha (devotion, friendship), Uttara Ashadha (final victory, commitment), Uttarabhadrapada (depth, wisdom), Revati (nourishment, completion). Each carries a specific energy that blesses the marriage in its own way.
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
          Lagna and Planetary Requirements
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The lagna (ascendant) of the marriage Muhurta chart is its backbone. The 2nd, 7th, or 11th house lagnas are ideal: 2nd for family and wealth, 7th for the partnership itself, 11th for the fulfilment of desires. The 7th lord in the Muhurta chart should be strong — not debilitated, combust, or in a dusthana (6th, 8th, 12th).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Venus is the karaka (significator) of marriage and must NOT be combust — meaning it should not be within approximately 10 degrees of the Sun. Combust Venus signifies weakened love, harmony, and attraction. Jupiter aspecting the lagna or 7th house is highly beneficial, bringing blessings, wisdom, and dharmic conduct to the marriage. Benefic planets in kendras (1st, 4th, 7th, 10th) strengthen the overall chart.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Moon should be waxing (Shukla Paksha preferred) for emotional growth and happiness. No malefic in the 8th house — Saturn, Mars, Rahu, or Ketu there indicates hidden challenges, secrets, or threats to the marriage&rsquo;s longevity. Eclipses should not have occurred within the preceding 7 days.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Planetary Checklist</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Venus:</span> Not combust. Not debilitated. Ideally in own/exaltation sign or in kendra.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Jupiter:</span> Aspecting lagna or 7th house. Not debilitated. In kendra or trikona.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Moon:</span> Waxing (Shukla Paksha). Not in 8th or 12th house. Good Paksha Bala.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">7th Lord:</span> Strong, not combust, not in dusthana. Well-aspected.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">8th House:</span> Free from malefics (Saturn, Mars, Rahu, Ketu).</p>
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
          Seasonal Restrictions and Regional Variations
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Several periods are universally prohibited for marriage: Pitru Paksha (the fortnight of ancestor worship in Bhadrapada/Ashwin), during or within 7 days of a solar or lunar eclipse, and generally during Amavasya (new moon). Chaturmas — the four months of Vishnu&rsquo;s cosmic sleep from Devshayani Ekadashi to Prabodhini Ekadashi (roughly July-November) — restricts marriages in many traditions, though this varies regionally.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The most significant regional difference concerns Adhika Masa (the intercalary month occurring about every 32-33 months). North Indian traditions generally prohibit marriages during Adhika Masa, while some South Indian traditions, particularly in Tamil Nadu and Karnataka, may permit them. The Kshaya Masa (rare dropped month) is universally prohibited for all auspicious activities.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The pandit&rsquo;s role in finalizing the exact lagna is crucial. Even after the family identifies a suitable date based on Panchang elements and seasonal restrictions, the pandit selects the precise 2-hour lagna window within that day. This fine-tuning — considering the lagna chart, hora, and the couple&rsquo;s individual charts — is the final and most personalized step of Muhurta selection.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Restricted Periods</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Pitru Paksha:</span> Krishna Paksha of Bhadrapada — devoted to ancestors. No auspicious work.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Eclipses:</span> Avoid marriage within 7 days before or after any eclipse.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Chaturmas:</span> July-November (varies by tradition). Some regions strictly prohibit, others are flexible.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Adhika Masa:</span> North India generally prohibits; South India varies. Consult family pandit.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">The Pandit&rsquo;s Final Step</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our Muhurta AI tool identifies candidate dates and time windows that satisfy the Panchang, planetary, and seasonal requirements. But the final selection — especially for marriage — traditionally involves a pandit who considers the specific couple&rsquo;s charts, family traditions, and regional customs. The tool narrows hundreds of potential times to a shortlist; the pandit makes the final human judgment.
        </p>
      </section>
    </div>
  );
}

export default function Module17_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
