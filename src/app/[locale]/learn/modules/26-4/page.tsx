'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_26_4', phase: 6, topic: 'Indian Contributions', moduleNumber: '26.4',
  title: { en: '4.32 Billion Years — Cosmic Time', hi: '4.32 अरब वर्ष — ब्रह्मांडीय समय' },
  subtitle: {
    en: 'How ancient Hindu cosmology computed a cosmic time cycle of 4.32 billion years — remarkably close to Earth\'s actual age of 4.54 billion years',
    hi: 'प्राचीन हिन्दू ब्रह्मांडविज्ञान ने 4.32 अरब वर्षों का एक ब्रह्मांडीय समय चक्र कैसे गणना किया — पृथ्वी की वास्तविक आयु 4.54 अरब वर्षों के उल्लेखनीय रूप से करीब',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 26-1: Earth Rotates', hi: 'मॉड्यूल 26-1: पृथ्वी घूमती है' }, href: '/learn/modules/26-1' },
    { label: { en: 'Module 26-2: Gravity Before Newton', hi: 'मॉड्यूल 26-2: न्यूटन से पहले गुरुत्वाकर्षण' }, href: '/learn/modules/26-2' },
    { label: { en: 'Panchang Calendar', hi: 'पञ्चाङ्ग पञ्जिका' }, href: '/calendar' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q26_4_01', type: 'mcq',
    question: {
      en: 'In Hindu cosmology, what is a Kalpa?',
      hi: 'हिन्दू ब्रह्मांडविज्ञान में, कल्प क्या है?',
    },
    options: [
      { en: 'A single year in the life of Brahma', hi: 'ब्रह्मा के जीवन में एक वर्ष' },
      { en: 'One day in the life of Brahma', hi: 'ब्रह्मा के जीवन में एक दिन' },
      { en: 'The duration of a single universe', hi: 'एक ब्रह्मांड की अवधि' },
      { en: 'The time between two Mahayugas', hi: 'दो महायुगों के बीच का समय' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A Kalpa is defined as one full day (not including the night) in the life of Brahma, the creator god. It equals 4.32 billion human years. The corresponding night of Brahma is also 4.32 billion years, making a full day-night cycle 8.64 billion years. Brahma\'s full lifespan is 100 Brahma years (each year = 360 Brahma days), totalling approximately 311 trillion human years. Hindu cosmology describes cyclic time at multiple scales, from a Kali Yuga (432,000 years) all the way up to Brahma\'s lifespan, with each cycle representing a complete cosmic epoch.',
      hi: 'कल्प को ब्रह्मा, सृष्टिकर्ता देव, के जीवन में एक पूर्ण दिन (रात को शामिल नहीं करते हुए) के रूप में परिभाषित किया गया है। यह 4.32 अरब मानव वर्षों के बराबर है। ब्रह्मा की संगत रात भी 4.32 अरब वर्ष है, जिससे एक पूर्ण दिन-रात चक्र 8.64 अरब वर्ष बनता है। ब्रह्मा का पूर्ण जीवनकाल 100 ब्रह्मा वर्ष है (प्रत्येक वर्ष = 360 ब्रह्मा दिन), कुल लगभग 311 ट्रिलियन मानव वर्ष। हिन्दू ब्रह्मांडविज्ञान कई पैमानों पर चक्रीय समय का वर्णन करता है।',
    },
  },
  {
    id: 'q26_4_02', type: 'mcq',
    question: {
      en: 'How long is one Kalpa in human years?',
      hi: 'मानव वर्षों में एक कल्प कितना लम्बा है?',
    },
    options: [
      { en: '432,000 years', hi: '432,000 वर्ष' },
      { en: '4.32 million years', hi: '4.32 मिलियन वर्ष' },
      { en: '4.32 billion years', hi: '4.32 अरब वर्ष' },
      { en: '432 billion years', hi: '432 अरब वर्ष' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'One Kalpa = 4,320,000,000 (4.32 billion) human years = 1,000 Mahayugas. This number is consistent across the major astronomical texts: Surya Siddhanta, Aryabhatiya, Brahmasphutasiddhanta, and Vishnu Purana. Compare this to Earth\'s actual age: 4.54 billion years (determined by radiometric dating of the oldest rocks and meteorites). The Kalpa is 4.32 billion years — within about 5% of Earth\'s actual age. This correspondence has fascinated modern scientists and historians of science, though the reason for this remarkable proximity is debated.',
      hi: 'एक कल्प = 4,320,000,000 (4.32 अरब) मानव वर्ष = 1,000 महायुग। यह संख्या प्रमुख खगोलीय ग्रन्थों में सुसंगत है: सूर्य सिद्धान्त, आर्यभटीय, ब्रह्मस्फुटसिद्धान्त, और विष्णु पुराण। पृथ्वी की वास्तविक आयु: 4.54 अरब वर्ष (सबसे पुरानी चट्टानों और उल्काओं के रेडियोमेट्रिक डेटिंग द्वारा निर्धारित) से तुलना करें। कल्प 4.32 अरब वर्ष है — पृथ्वी की वास्तविक आयु के लगभग 5% के भीतर। यह समझौता आधुनिक वैज्ञानिकों और विज्ञान के इतिहासकारों को आकर्षित करता है।',
    },
  },
  {
    id: 'q26_4_03', type: 'mcq',
    question: {
      en: 'How many Mahayugas make up one Kalpa?',
      hi: 'एक कल्प में कितने महायुग हैं?',
    },
    options: [
      { en: '100 Mahayugas', hi: '100 महायुग' },
      { en: '1,000 Mahayugas', hi: '1,000 महायुग' },
      { en: '10,000 Mahayugas', hi: '10,000 महायुग' },
      { en: '100,000 Mahayugas', hi: '100,000 महायुग' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'One Kalpa = 1,000 Mahayugas (also called Chaturyugas). Each Mahayuga = 4,320,000 years (4.32 million years), consisting of four Yugas: Krita/Satya Yuga (1,728,000 years), Treta Yuga (1,296,000 years), Dvapara Yuga (864,000 years), and Kali Yuga (432,000 years). The four Yugas are in the ratio 4:3:2:1. Total Mahayuga = 4,320,000 years × 1,000 Mahayugas = 4,320,000,000 (4.32 billion) years = one Kalpa. The mathematical structure is elegant: all numbers are multiples of 432,000, which is the length of the Kali Yuga.',
      hi: 'एक कल्प = 1,000 महायुग (चतुर्युग भी कहलाते हैं)। प्रत्येक महायुग = 4,320,000 वर्ष (4.32 मिलियन वर्ष), चार युगों से मिलकर: कृत/सत्य युग (1,728,000 वर्ष), त्रेता युग (1,296,000 वर्ष), द्वापर युग (864,000 वर्ष), और कलियुग (432,000 वर्ष)। चार युग 4:3:2:1 के अनुपात में हैं। कुल महायुग = 4,320,000 वर्ष × 1,000 महायुग = 4,320,000,000 (4.32 अरब) वर्ष = एक कल्प। गणितीय संरचना सुरुचिपूर्ण है: सभी संख्याएँ 432,000 के गुणज हैं।',
    },
  },
  {
    id: 'q26_4_04', type: 'mcq',
    question: {
      en: 'How long is one Mahayuga (the four-yuga cycle)?',
      hi: 'एक महायुग (चार-युग चक्र) कितना लम्बा है?',
    },
    options: [
      { en: '432,000 years', hi: '432,000 वर्ष' },
      { en: '4.32 million years', hi: '4.32 मिलियन वर्ष' },
      { en: '43.2 million years', hi: '43.2 मिलियन वर्ष' },
      { en: '432 million years', hi: '432 मिलियन वर्ष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'One Mahayuga (also called Chaturyuga = four Yugas) = 4,320,000 (4.32 million) years. Structure: Krita Yuga = 1,728,000 years; Treta Yuga = 1,296,000 years; Dvapara Yuga = 864,000 years; Kali Yuga = 432,000 years. Sum = 4,320,000 years. The base unit is 432,000 (Kali Yuga), and each older Yuga is 2×, 3×, 4× the Kali Yuga. We are currently in Kali Yuga, which began on 18 February 3102 BCE (the traditional date of Krishna\'s departure) according to the Surya Siddhanta — meaning approximately 5,127 years of the current Kali Yuga have elapsed as of 2025 CE.',
      hi: 'एक महायुग (चतुर्युग भी = चार युग) = 4,320,000 (4.32 मिलियन) वर्ष। संरचना: कृत युग = 1,728,000 वर्ष; त्रेता युग = 1,296,000 वर्ष; द्वापर युग = 864,000 वर्ष; कलियुग = 432,000 वर्ष। योग = 4,320,000 वर्ष। आधार इकाई 432,000 (कलियुग) है, और प्रत्येक पुराने युग की लम्बाई कलियुग की 2×, 3×, 4× है। हम वर्तमान में कलियुग में हैं, जो 18 फरवरी 3102 ईसा पूर्व (कृष्ण के प्रस्थान की पारंपरिक तिथि) को आरम्भ हुआ।',
    },
  },
  {
    id: 'q26_4_05', type: 'mcq',
    question: {
      en: 'What is Earth\'s actual age according to modern science?',
      hi: 'आधुनिक विज्ञान के अनुसार पृथ्वी की वास्तविक आयु क्या है?',
    },
    options: [
      { en: '4.32 billion years', hi: '4.32 अरब वर्ष' },
      { en: '4.54 billion years', hi: '4.54 अरब वर्ष' },
      { en: '6.0 billion years', hi: '6.0 अरब वर्ष' },
      { en: '13.8 billion years', hi: '13.8 अरब वर्ष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Earth\'s age is 4.54 ± 0.05 billion years, determined by radiometric dating of the oldest meteorites (carbonaceous chondrites from the early solar system) and the oldest Earth rocks. The uranium-lead dating method on zircon crystals gives the most precise values. The Hindu Kalpa is 4.32 billion years — a difference of about 0.22 billion years, or approximately 5%. The age of the entire universe (Big Bang) is approximately 13.8 billion years. The Brahma day-night cycle (8.64 billion years) is closer to the total age of Earth and the Sun (~5 billion years each).',
      hi: 'पृथ्वी की आयु 4.54 ± 0.05 अरब वर्ष है, जो सबसे पुरानी उल्काओं (प्रारम्भिक सौरमंडल से कार्बोनेसियस कॉन्ड्राइट) और सबसे पुरानी पृथ्वी की चट्टानों के रेडियोमेट्रिक डेटिंग द्वारा निर्धारित है। जिरकॉन क्रिस्टल पर यूरेनियम-सीसा डेटिंग विधि सबसे सटीक मान देती है। हिन्दू कल्प 4.32 अरब वर्ष है — लगभग 0.22 अरब वर्ष या लगभग 5% का अंतर।',
    },
  },
  {
    id: 'q26_4_06', type: 'mcq',
    question: {
      en: 'How accurate is the Hindu Kalpa (4.32 billion years) compared to Earth\'s actual age (4.54 billion years)?',
      hi: 'पृथ्वी की वास्तविक आयु (4.54 अरब वर्ष) की तुलना में हिन्दू कल्प (4.32 अरब वर्ष) कितना सटीक है?',
    },
    options: [
      { en: 'About 75% accurate', hi: 'लगभग 75% सटीक' },
      { en: 'About 85% accurate', hi: 'लगभग 85% सटीक' },
      { en: 'About 95% accurate', hi: 'लगभग 95% सटीक' },
      { en: 'About 99% accurate', hi: 'लगभग 99% सटीक' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The accuracy depends on how you frame the comparison. If comparing the Kalpa (4.32 billion years) to Earth\'s age (4.54 billion years): the Kalpa is 95.2% of Earth\'s age, or within 4.8% error. If using the Kalpa as representing a cosmic epoch (roughly comparable to the age of the solar system), the match is even better, since the Sun\'s age is approximately 4.6 billion years and the Kalpa (4.32 billion years) is within 6% of that. The value of ~95% accuracy is commonly cited. The question is whether this represents intentional cosmological knowledge or a coincidental number chosen for its elegance.',
      hi: 'सटीकता इस बात पर निर्भर करती है कि आप तुलना को कैसे तैयार करते हैं। यदि कल्प (4.32 अरब वर्ष) की पृथ्वी की आयु (4.54 अरब वर्ष) से तुलना की जाए: कल्प पृथ्वी की आयु का 95.2% है, या 4.8% त्रुटि के भीतर। ~95% सटीकता का मान आमतौर पर उद्धृत किया जाता है। प्रश्न यह है कि क्या यह जानबूझकर ब्रह्माण्डीय ज्ञान का प्रतिनिधित्व करता है या अपनी सुंदरता के लिए चुनी गई एक संयोगपूर्ण संख्या है।',
    },
  },
  {
    id: 'q26_4_07', type: 'mcq',
    question: {
      en: 'Which primary ancient text gives the Kalpa and Mahayuga numbers in most detail?',
      hi: 'कौन सा प्राथमिक प्राचीन ग्रन्थ कल्प और महायुग की संख्याओं को सबसे विस्तार से देता है?',
    },
    options: [
      { en: 'Rig Veda', hi: 'ऋग्वेद' },
      { en: 'Arthashastra', hi: 'अर्थशास्त्र' },
      { en: 'Surya Siddhanta', hi: 'सूर्य सिद्धान्त' },
      { en: 'Natyashastra', hi: 'नाट्यशास्त्र' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Surya Siddhanta is the primary astronomical text that gives the Kalpa and Mahayuga numbers with mathematical precision. It is an ancient Sanskrit text on mathematical astronomy, with the current version likely dating to around 400–500 CE (though it claims to be far older). The text gives detailed calculations: 1 Kalpa = 4,320,000,000 years = 1,000 Mahayugas = 14 Manvantaras; it also specifies the number of planetary revolutions in a Kalpa. Aryabhata\'s Aryabhatiya (499 CE) uses the same fundamental numbers with some modifications, and Brahmagupta\'s Brahmasphutasiddhanta (628 CE) also uses these values.',
      hi: 'सूर्य सिद्धान्त वह प्राथमिक खगोलीय ग्रन्थ है जो कल्प और महायुग की संख्याओं को गणितीय सटीकता के साथ देता है। यह गणितीय खगोल विज्ञान पर एक प्राचीन संस्कृत ग्रन्थ है, जिसका वर्तमान संस्करण संभवतः लगभग 400-500 ईस्वी का है (हालाँकि यह बहुत पुराना होने का दावा करता है)। ग्रन्थ विस्तृत गणनाएँ देता है: 1 कल्प = 4,320,000,000 वर्ष = 1,000 महायुग = 14 मन्वन्तर।',
    },
  },
  {
    id: 'q26_4_08', type: 'mcq',
    question: {
      en: 'Which famous scientist quoted Hindu cosmic time approvingly, saying it matched modern cosmology?',
      hi: 'किस प्रसिद्ध वैज्ञानिक ने हिन्दू ब्रह्मांडीय समय को सहमति से उद्धृत किया, यह कहते हुए कि यह आधुनिक ब्रह्मांड विज्ञान से मेल खाता है?',
    },
    options: [
      { en: 'Albert Einstein', hi: 'अल्बर्ट आइंस्टीन' },
      { en: 'Stephen Hawking', hi: 'स्टीफन हॉकिंग' },
      { en: 'Carl Sagan', hi: 'कार्ल सागन' },
      { en: 'Neil deGrasse Tyson', hi: 'नील डेग्रास टायसन' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Carl Sagan (1934–1996), the celebrated American astronomer and science communicator, quoted Hindu cosmic time approvingly in his television series Cosmos (1980) and in his book. He said: "The Hindu religion is the only one of the world\'s great faiths dedicated to the idea that the Cosmos itself undergoes an immense number of deaths and rebirths. It is the only religion in which the time scales correspond to those of modern scientific cosmology." He specifically noted that the Kalpa (4.32 billion years) is comparable to the age of the Earth and the Sun, and that Hindu cosmology is "in the right ballpark" for modern estimates.',
      hi: 'कार्ल सागन (1934-1996), प्रसिद्ध अमेरिकी खगोलशास्त्री और विज्ञान संचारक, ने अपनी टेलीविजन श्रृंखला कॉस्मोस (1980) और अपनी पुस्तक में हिन्दू ब्रह्मांडीय समय को सहमति से उद्धृत किया। उन्होंने कहा: "हिन्दू धर्म दुनिया के महान धर्मों में एकमात्र ऐसा है जो इस विचार के लिए समर्पित है कि ब्रह्मांड स्वयं असंख्य मृत्यु और पुनर्जन्म से गुज़रता है।" उन्होंने विशेष रूप से नोट किया कि कल्प (4.32 अरब वर्ष) पृथ्वी और सूर्य की आयु के तुलनीय है।',
    },
  },
  {
    id: 'q26_4_09', type: 'true_false',
    question: {
      en: 'Hindu cosmology describes cyclic creation and destruction of the universe, rather than a single linear beginning and end.',
      hi: 'हिन्दू ब्रह्मांडविज्ञान एक एकल रेखीय आरम्भ और अन्त के बजाय ब्रह्मांड की चक्रीय सृष्टि और विनाश का वर्णन करता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Hindu cosmology is fundamentally cyclic. At the end of each Kalpa (4.32 billion years), the universe undergoes a Pralaya (dissolution), after which Brahma sleeps for an equal period (the Brahma night, also 4.32 billion years), and then creates again. At the end of Brahma\'s full life (311 trillion years), a Maha Pralaya occurs, after which a new Brahma is born and the cycle begins anew. This cyclic cosmology stands in contrast to the linear cosmologies of the Abrahamic faiths (single creation event, single end time). Modern cosmology also considers cyclic models (cyclic Big Bang-Big Crunch scenarios), making Hindu cosmology particularly interesting from a scientific philosophy perspective.',
      hi: 'सत्य। हिन्दू ब्रह्मांडविज्ञान मूलभूत रूप से चक्रीय है। प्रत्येक कल्प (4.32 अरब वर्ष) के अन्त में, ब्रह्मांड एक प्रलय (विघटन) से गुज़रता है, जिसके बाद ब्रह्मा समान अवधि (ब्रह्मा रात, भी 4.32 अरब वर्ष) के लिए सोते हैं, और फिर पुनः सृजन करते हैं। यह चक्रीय ब्रह्मांडविज्ञान अब्राहमिक विश्वासों के रेखीय ब्रह्मांडविज्ञान (एकल सृजन घटना, एकल अन्त समय) के विपरीत है।',
    },
  },
  {
    id: 'q26_4_10', type: 'true_false',
    question: {
      en: 'The Kali Yuga is the longest of the four Yugas in a Mahayuga.',
      hi: 'एक महायुग में कलियुग चार युगों में सबसे लम्बा है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The Kali Yuga is the SHORTEST of the four Yugas. The four Yugas in order from longest to shortest: Krita/Satya Yuga = 1,728,000 years (4 units); Treta Yuga = 1,296,000 years (3 units); Dvapara Yuga = 864,000 years (2 units); Kali Yuga = 432,000 years (1 unit). The ratio is 4:3:2:1. Kali Yuga is the "darkest" and shortest age — an era of spiritual decline, conflict, and moral degradation in Hindu cosmology. We are currently in Kali Yuga, which began in 3102 BCE and has approximately 426,000 years remaining. The Krita Yuga (Golden Age) is four times longer than the Kali Yuga.',
      hi: 'असत्य। कलियुग चार युगों में सबसे छोटा है। सबसे लम्बे से छोटे के क्रम में चार युग: कृत/सत्य युग = 1,728,000 वर्ष (4 इकाइयाँ); त्रेता युग = 1,296,000 वर्ष (3 इकाइयाँ); द्वापर युग = 864,000 वर्ष (2 इकाइयाँ); कलियुग = 432,000 वर्ष (1 इकाई)। अनुपात 4:3:2:1 है। कलियुग सबसे "अंधकारमय" और सबसे छोटा युग है — हिन्दू ब्रह्मांडविज्ञान में आध्यात्मिक पतन, संघर्ष और नैतिक अधःपतन का युग। हम वर्तमान में कलियुग में हैं, जो 3102 ईसा पूर्व में आरम्भ हुआ और इसमें लगभग 426,000 वर्ष शेष हैं।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Yuga System and the Kalpa                             */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'ब्रह्मांडीय समय: युग प्रणाली' : 'Cosmic Time: The Yuga System'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>हिन्दू ब्रह्मांडविज्ञान में समय की कोई भी पश्चिमी अवधारणा के विपरीत एक विशाल, चक्रीय संरचना है। ब्रह्मांड अनन्त बार बनाया और नष्ट किया जाता है, प्रत्येक चक्र अरबों वर्षों तक फैला हुआ है। उल्लेखनीय रूप से, इन चक्रों की गणना आधुनिक खगोलीय पैमानों के आश्चर्यजनक रूप से करीब है।</>
            : <>Hindu cosmology envisions time as a vast, cyclic structure unlike anything in Western conception. The universe is created and destroyed an infinite number of times, each cycle spanning billions of years. Remarkably, the numbers for these cycles are astonishingly close to modern astronomical timescales.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'समय के पदानुक्रम' : 'The Hierarchy of Time'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? 'कलियुग' : 'Kali Yuga'}</span>
            <span className="font-mono">432,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? 'द्वापर युग' : 'Dvapara Yuga'}</span>
            <span className="font-mono">864,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? 'त्रेता युग' : 'Treta Yuga'}</span>
            <span className="font-mono">1,296,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? 'कृत/सत्य युग' : 'Krita/Satya Yuga'}</span>
            <span className="font-mono">1,728,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gold-primary/10">
            <span className="text-amber-400 font-semibold">{isHi ? 'महायुग (1 चतुर्युग)' : 'Mahayuga (1 Chaturyuga)'}</span>
            <span className="font-mono text-amber-400">4,320,000 {isHi ? 'वर्ष' : 'years'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gold-light font-medium">{isHi ? '1 कल्प = 1,000 महायुग' : '1 Kalpa = 1,000 Mahayugas'}</span>
            <span className="font-mono text-gold-light">4.32 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gold-primary/10">
            <span className="text-emerald-400 font-semibold">{isHi ? 'पृथ्वी की वास्तविक आयु' : 'Earth\'s actual age'}</span>
            <span className="font-mono text-emerald-400">4.54 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'मूल संख्या: 432' : 'The Base Number: 432'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>पूरी युग प्रणाली 432 पर आधारित है: कलियुग = 432,000; महायुग = 4,320,000 (432 × 10,000); कल्प = 4,320,000,000 (432 × 10,000,000)। यह संख्या, 432, भारतीय परम्परा में पवित्र है। कुछ विद्वानों ने नोट किया है कि 432,000 प्रकाश की गति (186,000 मील/सेकंड) से गुणा करने पर सौरमंडल की त्रिज्या के करीब आता है — हालाँकि यह एक विवादित संयोग है।</>
            : <>The entire Yuga system is based on 432: Kali Yuga = 432,000; Mahayuga = 4,320,000 (432 × 10,000); Kalpa = 4,320,000,000 (432 × 10,000,000). The number 432 is sacred in Indian tradition. Some scholars have noted that 432,000 multiplied by the speed of light approaches the radius of the solar system — though this is a debated coincidence.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The Cosmological Scale                                     */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'ब्रह्मांडीय पैमाना और ब्रह्मा का जीवन' : 'The Cosmological Scale and Brahma\'s Lifespan'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>कल्प से परे, हिन्दू ब्रह्मांडविज्ञान और भी बड़े समय पैमानों का वर्णन करता है — ब्रह्मा के पूरे जीवन तक पहुँचता है जो सैकड़ों ट्रिलियन वर्षों तक फैला है।</>
            : <>Beyond the Kalpa, Hindu cosmology describes even larger timescales — reaching up to Brahma's full lifespan spanning hundreds of trillions of years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ब्रह्मा का कैलेंडर' : 'Brahma\'s Calendar'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs">
          <div className="flex justify-between">
            <span>{isHi ? '1 ब्रह्मा दिन (कल्प):' : '1 Brahma day (Kalpa):'}</span>
            <span className="font-mono text-gold-light">4.32 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
          <div className="flex justify-between">
            <span>{isHi ? '1 ब्रह्मा रात:' : '1 Brahma night:'}</span>
            <span className="font-mono text-gold-light">4.32 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
          <div className="flex justify-between">
            <span>{isHi ? '1 ब्रह्मा दिन+रात:' : '1 Brahma day+night:'}</span>
            <span className="font-mono text-gold-light">8.64 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
          <div className="flex justify-between">
            <span>{isHi ? '1 ब्रह्मा वर्ष (360 दिन):' : '1 Brahma year (360 days):'}</span>
            <span className="font-mono text-gold-light">3.11 {isHi ? 'ट्रिलियन वर्ष' : 'trillion years'}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gold-primary/10">
            <span className="text-amber-400 font-semibold">{isHi ? '1 ब्रह्मा जीवन (100 वर्ष):' : '1 Brahma lifespan (100 years):'}</span>
            <span className="font-mono text-amber-400">311 {isHi ? 'ट्रिलियन वर्ष' : 'trillion years'}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gold-primary/10">
            <span className="text-emerald-400 font-semibold">{isHi ? 'ब्रह्मांड की आधुनिक आयु:' : 'Modern universe age:'}</span>
            <span className="font-mono text-emerald-400">13.8 {isHi ? 'अरब वर्ष' : 'billion years'}</span>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'चक्रीय ब्रह्मांड — एक दार्शनिक उपलब्धि' : 'Cyclic Universe — A Philosophical Achievement'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>हिन्दू ब्रह्मांडविज्ञान की सबसे गहन विशेषता इसकी चक्रीय प्रकृति है। ब्रह्मांड का कोई एकल आरम्भ नहीं है — यह अनन्त काल से बन और बिगड़ रहा है, और अनन्त काल तक बनता और बिगड़ता रहेगा।</>
            : <>The most profound feature of Hindu cosmology is its cyclic nature. The universe has no single beginning — it has been created and dissolved for infinite time past, and will continue to be created and dissolved for infinite time future.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>आधुनिक ब्रह्मांड विज्ञान के कुछ मॉडल — जैसे कि साइक्लिक ब्रह्मांड मॉडल (पॉल स्टेनहार्ट और नील ट्यूरोक) और बिग बाउंस थ्योरी — भी ब्रह्मांडीय चक्रों का प्रस्ताव करते हैं। कार्ल सागन ने 1980 में नोट किया कि हिन्दू ब्रह्मांडविज्ञान "वास्तविक ब्रह्मांड के पैमाने के अनुरूप एकमात्र धार्मिक परम्परा है।"</>
            : <>Some models in modern cosmology — such as the Cyclic Universe model (Paul Steinhardt and Neil Turok) and Big Bounce theory — also propose cosmic cycles. Carl Sagan noted in 1980 that Hindu cosmology is "the only religious tradition in which the time scales correspond to those of the real universe."</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Kali Yuga and Our Place in Cosmic Time                    */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कलियुग: ब्रह्मांडीय समय में हमारा स्थान' : 'Kali Yuga: Our Place in Cosmic Time'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>4.32 अरब वर्षों के कल्प के भीतर, हम एक विशिष्ट क्षण में हैं — कलियुग के प्रारम्भ में, जो वर्तमान महायुग का चौथा और अन्तिम युग है। यह हमें ब्रह्मांडीय घड़ी पर एक विशिष्ट स्थान देता है।</>
            : <>Within the 4.32 billion-year Kalpa, we are at a specific moment — in the early portion of the Kali Yuga, the fourth and final age of the current Mahayuga. This places us at a specific position on the cosmic clock.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'वर्तमान ब्रह्मांडीय स्थिति' : 'Current Cosmic Position'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{isHi ? 'वर्तमान ब्रह्मा दिन:' : 'Current Brahma day:'}</span> {isHi ? 'श्वेत वाराह कल्प (51वें ब्रह्मा वर्ष का पहला दिन)' : 'Shveta Varaha Kalpa (1st day of Brahma\'s 51st year)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'वर्तमान मन्वन्तर:' : 'Current Manvantara:'}</span> {isHi ? 'वैवस्वत मन्वन्तर (7वाँ में से 14 का)' : 'Vaivasvata Manvantara (7th of 14)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'वर्तमान महायुग:' : 'Current Mahayuga:'}</span> {isHi ? '28वाँ महायुग (71 में से)' : '28th Mahayuga (of 71)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'वर्तमान युग:' : 'Current Yuga:'}</span> {isHi ? 'कलियुग (शुरू 3102 ईसा पूर्व)' : 'Kali Yuga (began 3102 BCE)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'कलियुग बीता:' : 'Kali Yuga elapsed:'}</span> {isHi ? 'लगभग 5,127 वर्ष (2025 ईस्वी में)' : 'approximately 5,127 years (as of 2025 CE)'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'कलियुग शेष:' : 'Kali Yuga remaining:'}</span> {isHi ? 'लगभग 426,873 वर्ष' : 'approximately 426,873 years'}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ब्रह्मांडीय दृष्टिकोण' : 'Cosmic Perspective'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>पूरे मानव इतिहास — सभ्यता के उद्भव से आज तक, लगभग 10,000 वर्ष — कलियुग का केवल 2.3% है। कलियुग स्वयं महायुग का 1/10 है। महायुग कल्प का 1/1,000 है। एक कल्प ब्रह्मा के जीवन का 1/36,000 है।</>
            : <>All of recorded human history — from the dawn of civilization to today, roughly 10,000 years — is only 2.3% of the Kali Yuga. The Kali Yuga itself is 1/10 of a Mahayuga. A Mahayuga is 1/1,000 of a Kalpa. A Kalpa is 1/36,000 of Brahma's lifespan.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>भारतीय ब्रह्मांडविज्ञान ने मानव अस्तित्व को एक विशाल समय-दृष्टिकोण में रखा — कार्ल सागन ने इसे "ब्रह्मांडीय विनम्रता" कहा। यह दृष्टिकोण, जो आधुनिक ब्रह्मांड विज्ञान की तुलना में अरबों वर्षों के समय पैमानों का प्रस्ताव करता है, भारतीय बौद्धिक परम्परा का एक गहरा उपहार है।</>
            : <>Indian cosmology placed human existence within a vast temporal perspective — what Carl Sagan called "cosmic humility." This perspective, proposing timescales of billions of years comparable to modern cosmology, is a profound gift of the Indian intellectual tradition.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module26_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
