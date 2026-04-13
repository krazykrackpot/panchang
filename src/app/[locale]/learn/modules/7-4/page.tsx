'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_7_4', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.4',
  title: { en: 'Why 7 Days? — Chaldean Order & Indian Origins', hi: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', sa: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', mai: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', mr: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', ta: 'Why 7 Days? — Chaldean Order & Indian Origins', te: 'Why 7 Days? — Chaldean Order & Indian Origins', bn: 'Why 7 Days? — Chaldean Order & Indian Origins', kn: 'Why 7 Days? — Chaldean Order & Indian Origins', gu: 'Why 7 Days? — Chaldean Order & Indian Origins' },
  subtitle: {
    en: 'Hora from Ahoratra — how 7 planets ranked by orbital speed create the weekday sequence through 24 planetary hours',
    hi: 'अहोरात्र से होरा — कैसे कक्षीय गति से क्रमित 7 ग्रह 24 ग्रहीय घण्टों द्वारा वार-क्रम बनाते हैं',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Hora Deep Dive', hi: 'होरा विस्तार', sa: 'होरा विस्तार', mai: 'होरा विस्तार', mr: 'होरा विस्तार', ta: 'Hora Deep Dive', te: 'Hora Deep Dive', bn: 'Hora Deep Dive', kn: 'Hora Deep Dive', gu: 'Hora Deep Dive' }, href: '/learn/hora' },
    { label: { en: 'Vara Deep Dive', hi: 'वार विस्तार', sa: 'वार विस्तार', mai: 'वार विस्तार', mr: 'वार विस्तार', ta: 'Vara Deep Dive', te: 'Vara Deep Dive', bn: 'Vara Deep Dive', kn: 'Vara Deep Dive', gu: 'Vara Deep Dive' }, href: '/learn/vara' },
    { label: { en: 'Vedic Time', hi: 'वैदिक समय', sa: 'वैदिक समय', mai: 'वैदिक समय', mr: 'वैदिक समय', ta: 'Vedic Time', te: 'Vedic Time', bn: 'Vedic Time', kn: 'Vedic Time', gu: 'Vedic Time' }, href: '/vedic-time' },
    { label: { en: 'Module 7-3: Vara', hi: 'मॉड्यूल 7-3: वार', sa: 'मॉड्यूल 7-3: वार', mai: 'मॉड्यूल 7-3: वार', mr: 'मॉड्यूल 7-3: वार', ta: 'Module 7-3: Vara', te: 'Module 7-3: Vara', bn: 'Module 7-3: Vara', kn: 'Module 7-3: Vara', gu: 'Module 7-3: Vara' }, href: '/learn/modules/7-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q7_4_01', type: 'mcq',
    question: {
      en: 'What does the word "Hora" derive from?',
      hi: '"होरा" शब्द किससे व्युत्पन्न है?',
    },
    options: [
      { en: 'Horoscope (Greek)', hi: 'होरोस्कोप (यूनानी)', sa: 'होरोस्कोप (यूनानी)', mai: 'होरोस्कोप (यूनानी)', mr: 'होरोस्कोप (यूनानी)', ta: 'Horoscope (Greek)', te: 'Horoscope (Greek)', bn: 'Horoscope (Greek)', kn: 'Horoscope (Greek)', gu: 'Horoscope (Greek)' },
      { en: 'Ahoratra (Sanskrit)', hi: 'अहोरात्र (संस्कृत)', sa: 'अहोरात्र (संस्कृत)', mai: 'अहोरात्र (संस्कृत)', mr: 'अहोरात्र (संस्कृत)', ta: 'Ahoratra (Sanskrit)', te: 'Ahoratra (Sanskrit)', bn: 'Ahoratra (Sanskrit)', kn: 'Ahoratra (Sanskrit)', gu: 'Ahoratra (Sanskrit)' },
      { en: 'Horus (Egyptian)', hi: 'होरस (मिस्री)', sa: 'होरस (मिस्री)', mai: 'होरस (मिस्री)', mr: 'होरस (मिस्री)', ta: 'Horus (Egyptian)', te: 'Horus (Egyptian)', bn: 'Horus (Egyptian)', kn: 'Horus (Egyptian)', gu: 'Horus (Egyptian)' },
      { en: 'Hara (Shiva)', hi: 'हर (शिव)', sa: 'हर (शिव)', mai: 'हर (शिव)', mr: 'हर (शिव)', ta: 'Hara (Shiva)', te: 'Hara (Shiva)', bn: 'Hara (Shiva)', kn: 'Hara (Shiva)', gu: 'Hara (Shiva)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Hora derives from the Sanskrit "Ahoratra" — the compound of "Aha" (day) and "Ratra" (night). By dropping the first and last syllables (a- and -ratra), the middle portion "hora" remains. This etymological derivation is given in Surya Siddhanta and later commentaries.',
      hi: 'होरा संस्कृत "अहोरात्र" से व्युत्पन्न है — "अह" (दिन) और "रात्र" (रात) का समास। प्रथम और अन्तिम अक्षर (अ- और -रात्र) हटाने पर मध्य भाग "होरा" शेष रहता है। यह व्युत्पत्ति सूर्य सिद्धान्त और परवर्ती टीकाओं में दी गयी है।',
    },
  },
  {
    id: 'q7_4_02', type: 'mcq',
    question: {
      en: 'What does "Ahoratra" mean?',
      hi: '"अहोरात्र" का क्या अर्थ है?',
    },
    options: [
      { en: 'Sun and Moon', hi: 'सूर्य और चन्द्र', sa: 'सूर्य और चन्द्र', mai: 'सूर्य और चन्द्र', mr: 'सूर्य और चन्द्र', ta: 'Sun and Moon', te: 'Sun and Moon', bn: 'Sun and Moon', kn: 'Sun and Moon', gu: 'Sun and Moon' },
      { en: 'Day and Night (a full 24-hour cycle)', hi: 'दिन और रात (पूर्ण 24 घण्टे का चक्र)', sa: 'दिन और रात (पूर्ण 24 घण्टे का चक्र)', mai: 'दिन और रात (पूर्ण 24 घण्टे का चक्र)', mr: 'दिन और रात (पूर्ण 24 घण्टे का चक्र)', ta: 'Day and Night (a full 24-hour cycle)', te: 'Day and Night (a full 24-hour cycle)', bn: 'Day and Night (a full 24-hour cycle)', kn: 'Day and Night (a full 24-hour cycle)', gu: 'Day and Night (a full 24-hour cycle)' },
      { en: 'Light and Shadow', hi: 'प्रकाश और छाया', sa: 'प्रकाश और छाया', mai: 'प्रकाश और छाया', mr: 'प्रकाश और छाया', ta: 'Light and Shadow', te: 'Light and Shadow', bn: 'Light and Shadow', kn: 'Light and Shadow', gu: 'Light and Shadow' },
      { en: 'Dawn and Dusk', hi: 'उषा और सन्ध्या', sa: 'उषा और सन्ध्या', mai: 'उषा और सन्ध्या', mr: 'उषा और सन्ध्या', ta: 'Dawn and Dusk', te: 'Dawn and Dusk', bn: 'Dawn and Dusk', kn: 'Dawn and Dusk', gu: 'Dawn and Dusk' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Ahoratra is a Sanskrit compound: "Aha" (day/daylight) + "Ratra" (night). Together it denotes one complete diurnal cycle of day and night — a full 24-hour period. This is the fundamental time-unit from which the hora (1/24 of a day) is derived.',
      hi: 'अहोरात्र एक संस्कृत समास है: "अह" (दिन/दिवस) + "रात्र" (रात्रि)। मिलकर यह दिन और रात के एक पूर्ण चक्र — 24 घण्टे की अवधि — को दर्शाता है। यही वह मूल समय-इकाई है जिससे होरा (दिन का 1/24 भाग) व्युत्पन्न है।',
    },
  },
  {
    id: 'q7_4_03', type: 'mcq',
    question: {
      en: 'Which planet is the slowest (longest orbital period) in the Chaldean order?',
      hi: 'कैल्डियन क्रम में सबसे धीमा (सबसे लम्बी कक्षीय अवधि वाला) ग्रह कौन है?',
    },
    options: [
      { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'Jupiter', te: 'Jupiter', bn: 'Jupiter', kn: 'Jupiter', gu: 'Jupiter' },
      { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'Mars', te: 'Mars', bn: 'Mars', kn: 'Mars', gu: 'Mars' },
      { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'Saturn', te: 'Saturn', bn: 'Saturn', kn: 'Saturn', gu: 'Saturn' },
      { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'Sun', te: 'Sun', bn: 'Sun', kn: 'Sun', gu: 'Sun' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Saturn, with an orbital period of ~29.5 years, is the slowest of the seven classical planets. The full Chaldean order from slowest to fastest is: Saturn (~29.5 yr), Jupiter (~12 yr), Mars (~2 yr), Sun (~1 yr), Venus (~225 d), Mercury (~88 d), Moon (~27 d). This ranking was known to both Babylonian and Indian astronomers.',
      hi: 'शनि, ~29.5 वर्ष की कक्षीय अवधि के साथ, सात शास्त्रीय ग्रहों में सबसे धीमा है। धीमे से तेज़ पूर्ण कैल्डियन क्रम: शनि (~29.5 वर्ष), बृहस्पति (~12 वर्ष), मंगल (~2 वर्ष), सूर्य (~1 वर्ष), शुक्र (~225 दिन), बुध (~88 दिन), चन्द्र (~27 दिन)।',
    },
  },
  {
    id: 'q7_4_04', type: 'mcq',
    question: {
      en: 'Which planet is the fastest (shortest orbital period) in the Chaldean order?',
      hi: 'कैल्डियन क्रम में सबसे तेज़ (सबसे छोटी कक्षीय अवधि वाला) ग्रह कौन है?',
    },
    options: [
      { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'Mercury', te: 'Mercury', bn: 'Mercury', kn: 'Mercury', gu: 'Mercury' },
      { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'Venus', te: 'Venus', bn: 'Venus', kn: 'Venus', gu: 'Venus' },
      { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'Moon', te: 'Moon', bn: 'Moon', kn: 'Moon', gu: 'Moon' },
      { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'Sun', te: 'Sun', bn: 'Sun', kn: 'Sun', gu: 'Sun' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Moon, with a sidereal period of ~27.3 days, is the fastest body in the Chaldean order. It completes its orbit around the Earth far more quickly than any planet orbits the Sun. This is why the Moon sits at the bottom (fastest end) of the Chaldean sequence.',
      hi: 'चन्द्रमा, ~27.3 दिन की नाक्षत्र अवधि के साथ, कैल्डियन क्रम में सबसे तेज़ पिण्ड है। यह पृथ्वी की परिक्रमा किसी भी ग्रह की सूर्य-परिक्रमा से कहीं अधिक शीघ्रता से पूरी करता है। इसीलिए चन्द्रमा कैल्डियन अनुक्रम में सबसे नीचे (तीव्रतम छोर पर) है।',
    },
  },
  {
    id: 'q7_4_05', type: 'mcq',
    question: {
      en: 'How many horas are there in one Ahoratra (full day-night cycle)?',
      hi: 'एक अहोरात्र (पूर्ण दिन-रात चक्र) में कितनी होराएँ होती हैं?',
    },
    options: [
      { en: '7', hi: '7', sa: '7', mai: '7', mr: '7', ta: '7', te: '7', bn: '7', kn: '7', gu: '7' },
      { en: '12', hi: '12', sa: '12', mai: '12', mr: '12', ta: '12', te: '12', bn: '12', kn: '12', gu: '12' },
      { en: '24', hi: '24', sa: '24', mai: '24', mr: '24', ta: '24', te: '24', bn: '24', kn: '24', gu: '24' },
      { en: '30', hi: '30', sa: '30', mai: '30', mr: '30', ta: '30', te: '30', bn: '30', kn: '30', gu: '30' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'One Ahoratra contains exactly 24 horas, each lasting one hour. The 24 horas cycle through the 7 Chaldean planets in order (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon), repeating. Since 24 = 3 x 7 + 3, after cycling through all 24 horas, the next day begins 3 steps forward in the sequence.',
      hi: 'एक अहोरात्र में ठीक 24 होराएँ होती हैं, प्रत्येक एक घण्टे की। 24 होराएँ 7 कैल्डियन ग्रहों के क्रम (शनि, बृहस्पति, मंगल, सूर्य, शुक्र, बुध, चन्द्र) में चक्रित होती हैं। चूँकि 24 = 3 x 7 + 3, सभी 24 होराओं के बाद अगला दिन अनुक्रम में 3 स्थान आगे से आरम्भ होता है।',
    },
  },
  {
    id: 'q7_4_06', type: 'mcq',
    question: {
      en: 'What is 24 mod 7, and why does this number matter for weekdays?',
      hi: '24 mod 7 क्या है, और यह संख्या वारों के लिए क्यों महत्त्वपूर्ण है?',
    },
    options: [
      { en: '2 — it skips 2 planets each day', hi: '2 — प्रत्येक दिन 2 ग्रह छोड़ता है', sa: '2 — प्रत्येक दिन 2 ग्रह छोड़ता है', mai: '2 — प्रत्येक दिन 2 ग्रह छोड़ता है', mr: '2 — प्रत्येक दिन 2 ग्रह छोड़ता है', ta: '2 — it skips 2 planets each day', te: '2 — it skips 2 planets each day', bn: '2 — it skips 2 planets each day', kn: '2 — it skips 2 planets each day', gu: '2 — it skips 2 planets each day' },
      { en: '3 — it creates the "jump of 3" that generates the weekday sequence', hi: '3 — यह "3 का छलांग" बनाता है जो वार-क्रम उत्पन्न करता है', sa: '3 — यह "3 का छलांग" बनाता है जो वार-क्रम उत्पन्न करता है', mai: '3 — यह "3 का छलांग" बनाता है जो वार-क्रम उत्पन्न करता है', mr: '3 — यह "3 का छलांग" बनाता है जो वार-क्रम उत्पन्न करता है', ta: '3 — it creates the "jump of 3" that generates the weekday sequence', te: '3 — it creates the "jump of 3" that generates the weekday sequence', bn: '3 — it creates the "jump of 3" that generates the weekday sequence', kn: '3 — it creates the "jump of 3" that generates the weekday sequence', gu: '3 — it creates the "jump of 3" that generates the weekday sequence' },
      { en: '4 — it divides the week into halves', hi: '4 — यह सप्ताह को आधे में विभाजित करता है', sa: '4 — यह सप्ताह को आधे में विभाजित करता है', mai: '4 — यह सप्ताह को आधे में विभाजित करता है', mr: '4 — यह सप्ताह को आधे में विभाजित करता है', ta: '4 — it divides the week into halves', te: '4 — it divides the week into halves', bn: '4 — it divides the week into halves', kn: '4 — it divides the week into halves', gu: '4 — it divides the week into halves' },
      { en: '5 — it corresponds to the Panchangas', hi: '5 — यह पंचांगों से सम्बन्धित है', sa: '5 — यह पंचांगों से सम्बन्धित है', mai: '5 — यह पंचांगों से सम्बन्धित है', mr: '5 — यह पंचांगों से सम्बन्धित है', ta: '5 — it corresponds to the Panchangas', te: '5 — it corresponds to the Panchangas', bn: '5 — it corresponds to the Panchangas', kn: '5 — it corresponds to the Panchangas', gu: '5 — it corresponds to the Panchangas' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '24 mod 7 = 3. This remainder is the key to the entire weekday sequence. After 24 horas (one full day), the ruler of the next day\'s first hora is 3 positions forward in the Chaldean order. Starting from Saturn (Saturday): 3 forward = Sun (Sunday), 3 forward = Moon (Monday), 3 forward = Mars (Tuesday), and so on — producing the familiar 7-day cycle.',
      hi: '24 mod 7 = 3। यह शेषफल सम्पूर्ण वार-क्रम की कुञ्जी है। 24 होराओं (एक पूर्ण दिन) के बाद, अगले दिन की प्रथम होरा का स्वामी कैल्डियन क्रम में 3 स्थान आगे होता है। शनि (शनिवार) से: 3 आगे = सूर्य (रविवार), 3 आगे = चन्द्र (सोमवार), 3 आगे = मंगल (मंगलवार), इत्यादि — परिचित 7-दिवसीय चक्र बनता है।',
    },
  },
  {
    id: 'q7_4_07', type: 'mcq',
    question: {
      en: 'Which classical text states that "the lord of the first hora is the lord of the day"?',
      hi: 'कौन-सा शास्त्रीय ग्रन्थ कहता है कि "प्रथम होरा का स्वामी ही दिन का स्वामी है"?',
    },
    options: [
      { en: 'Rigveda', hi: 'ऋग्वेद', sa: 'ऋग्वेद', mai: 'ऋग्वेद', mr: 'ऋग्वेद', ta: 'Rigveda', te: 'Rigveda', bn: 'Rigveda', kn: 'Rigveda', gu: 'Rigveda' },
      { en: 'Brihat Samhita (Varahamihira)', hi: 'बृहत् संहिता (वराहमिहिर)', sa: 'बृहत् संहिता (वराहमिहिर)', mai: 'बृहत् संहिता (वराहमिहिर)', mr: 'बृहत् संहिता (वराहमिहिर)', ta: 'Brihat Samhita (Varahamihira)', te: 'Brihat Samhita (Varahamihira)', bn: 'Brihat Samhita (Varahamihira)', kn: 'Brihat Samhita (Varahamihira)', gu: 'Brihat Samhita (Varahamihira)' },
      { en: 'Manusmriti', hi: 'मनुस्मृति', sa: 'मनुस्मृति', mai: 'मनुस्मृति', mr: 'मनुस्मृति', ta: 'Manusmriti', te: 'Manusmriti', bn: 'Manusmriti', kn: 'Manusmriti', gu: 'Manusmriti' },
      { en: 'Ramayana', hi: 'रामायण', sa: 'रामायण', mai: 'रामायण', mr: 'रामायण', ta: 'Ramayana', te: 'Ramayana', bn: 'Ramayana', kn: 'Ramayana', gu: 'Ramayana' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Varahamihira\'s Brihat Samhita (6th century CE) explicitly describes the hora system and states that the planet ruling the first hora of a day is the lord (ruler) of that entire day. This principle — "horeshvaro dineshvarah" — is the mechanism that generates the weekday order from the Chaldean planetary sequence.',
      hi: 'वराहमिहिर की बृहत् संहिता (छठी शताब्दी ई.) होरा प्रणाली का वर्णन करती है और स्पष्ट रूप से कहती है कि किसी दिन की प्रथम होरा का ग्रह उस पूरे दिन का स्वामी होता है। यह सिद्धान्त — "होरेश्वरो दिनेश्वरः" — वह तन्त्र है जो कैल्डियन ग्रह-क्रम से वार-क्रम उत्पन्न करता है।',
    },
  },
  {
    id: 'q7_4_08', type: 'mcq',
    question: {
      en: 'What is the Sanskrit name for Saturday?',
      hi: 'शनिवार का संस्कृत नाम क्या है?',
    },
    options: [
      { en: 'Ravivara', hi: 'रविवार', sa: 'रविवार', mai: 'रविवार', mr: 'रविवार', ta: 'Ravivara', te: 'Ravivara', bn: 'Ravivara', kn: 'Ravivara', gu: 'Ravivara' },
      { en: 'Shukravara', hi: 'शुक्रवार', sa: 'शुक्रवार', mai: 'शुक्रवार', mr: 'शुक्रवार', ta: 'Shukravara', te: 'Shukravara', bn: 'Shukravara', kn: 'Shukravara', gu: 'Shukravara' },
      { en: 'Shanivara', hi: 'शनिवार', sa: 'शनिवार', mai: 'शनिवार', mr: 'शनिवार', ta: 'Shanivara', te: 'Shanivara', bn: 'Shanivara', kn: 'Shanivara', gu: 'Shanivara' },
      { en: 'Guruvara', hi: 'गुरुवार', sa: 'गुरुवार', mai: 'गुरुवार', mr: 'गुरुवार', ta: 'Guruvara', te: 'Guruvara', bn: 'Guruvara', kn: 'Guruvara', gu: 'Guruvara' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Saturday is Shanivara in Sanskrit, named after Shani (Saturn). The English "Saturday" also derives from Saturn — "Saturn\'s day." This parallel naming across Sanskrit and Latin/Germanic languages is direct evidence that both traditions independently connected Saturn to the same day via the same Hora system.',
      hi: 'शनिवार (Shanivara) शनि (Saturn) के नाम पर है। अंग्रेज़ी "Saturday" भी शनि से व्युत्पन्न है — "Saturn\'s day"। संस्कृत और लैटिन/जर्मनिक भाषाओं में यह समानान्तर नामकरण इस बात का प्रत्यक्ष प्रमाण है कि दोनों परम्पराओं ने एक ही होरा प्रणाली से शनि को एक ही दिन से जोड़ा।',
    },
  },
  {
    id: 'q7_4_09', type: 'true_false',
    question: {
      en: 'The English word "hour" likely derives from the Sanskrit "hora" (which itself comes from "Ahoratra").',
      hi: 'अंग्रेज़ी शब्द "hour" सम्भवतः संस्कृत "होरा" (जो स्वयं "अहोरात्र" से आता है) से व्युत्पन्न है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The etymological chain is: Sanskrit "Ahoratra" → "Hora" → Greek "hora" (ὥρα) → Latin "hora" → Old French "hore" → English "hour." While some scholars debate the direction of borrowing between Sanskrit and Greek, the linguistic connection is well-established. Both traditions used the concept of dividing the day into 24 planetary periods.',
      hi: 'सत्य। व्युत्पत्ति शृंखला: संस्कृत "अहोरात्र" → "होरा" → यूनानी "hora" (ὥρα) → लैटिन "hora" → पुरानी फ़्रांसीसी "hore" → अंग्रेज़ी "hour"। हालाँकि कुछ विद्वान संस्कृत और यूनानी के बीच उधार की दिशा पर बहस करते हैं, भाषाई सम्बन्ध सुस्थापित है। दोनों परम्पराओं ने दिन को 24 ग्रहीय अवधियों में विभाजित करने की अवधारणा का प्रयोग किया।',
    },
  },
  {
    id: 'q7_4_10', type: 'true_false',
    question: {
      en: 'Rahu and Ketu are part of the Chaldean 7-planet order used to generate the weekday sequence.',
      hi: 'राहु और केतु कैल्डियन 7-ग्रह क्रम का भाग हैं जो वार-क्रम उत्पन्न करता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Rahu and Ketu are lunar nodes — mathematical points where the Moon\'s orbit intersects the ecliptic. They are not visible celestial bodies and were unknown to Babylonian astronomers who established the Chaldean order. The 7-planet sequence includes only the bodies visible to the naked eye: Saturn, Jupiter, Mars, Sun, Venus, Mercury, and Moon. Rahu and Ketu are uniquely Indian additions to the Navagraha (nine planets) system.',
      hi: 'असत्य। राहु और केतु चान्द्र पात (lunar nodes) हैं — गणितीय बिन्दु जहाँ चन्द्रमा की कक्षा क्रान्तिवृत्त को काटती है। ये दृश्य खगोलीय पिण्ड नहीं हैं और बेबीलोनियाई खगोलविदों को ज्ञात नहीं थे। 7-ग्रह अनुक्रम में केवल नग्न नेत्रों से दिखने वाले पिण्ड हैं: शनि, बृहस्पति, मंगल, सूर्य, शुक्र, बुध, और चन्द्र। राहु-केतु नवग्रह प्रणाली में विशिष्ट भारतीय योगदान हैं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Hora from Ahoratra — Etymology & the Seven Visible Planets</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The Sanskrit word &quot;Ahoratra&quot; is a compound of &quot;Aha&quot; (day) and &quot;Ratra&quot; (night) — it denotes one complete cycle of daylight and darkness. By a well-attested etymological process, the first syllable (a-) and the last portion (-ratra) were dropped, yielding the middle portion: &quot;hora.&quot; This word entered Greek as &quot;hora&quot; (ὥρα), passed through Latin, and eventually became the English &quot;hour.&quot; Whether the borrowing went from India to Greece or vice versa is debated, but the linguistic kinship is undeniable.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">A hora is 1/24th of an Ahoratra — one planetary hour. Each hora is ruled by one of the seven classical &quot;planets&quot; (grahas) visible to the naked eye. These seven are ranked by their apparent orbital period as seen from Earth, from slowest to fastest: Saturn (~29.5 years), Jupiter (~12 years), Mars (~2 years), Sun (~1 year), Venus (~225 days), Mercury (~88 days), Moon (~27 days). This ranking is called the Chaldean order, after the Babylonian astronomers who first systematized it.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Crucially, Rahu and Ketu are excluded from this system. They are not visible celestial bodies — they are mathematical points (lunar nodes) where the Moon&apos;s orbital plane intersects the ecliptic. While they are central to Indian astrology as part of the Navagraha (nine planets), they play no role in the hora-weekday derivation. Only the seven bodies observable with the naked eye participate in the Chaldean sequence.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">The Chaldean Sequence</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Slowest to fastest orbital period:</p>
        <p className="text-gold-light text-sm font-medium tracking-wide text-center py-2">Saturn &rarr; Jupiter &rarr; Mars &rarr; Sun &rarr; Venus &rarr; Mercury &rarr; Moon</p>
        <p className="text-text-secondary text-xs leading-relaxed mt-2">This sequence is the seed from which the entire 7-day week grows. The ordering by speed was empirically determined by ancient observers tracking how quickly each body moved against the fixed stars. Saturn, barely crawling through the zodiac, sits at the top; the Moon, completing its cycle in under a month, sits at the bottom.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 24-Hora System & the &quot;Jump of 3&quot;</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Each Ahoratra (day-night cycle) is divided into exactly 24 horas. The first hora of any day is ruled by that day&apos;s planetary lord. Subsequent horas cycle through the Chaldean order: Saturn &rarr; Jupiter &rarr; Mars &rarr; Sun &rarr; Venus &rarr; Mercury &rarr; Moon, repeating endlessly.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The key insight is arithmetic: 24 divided by 7 gives 3 complete cycles (3 &times; 7 = 21) with a remainder of 3. That remainder — <span className="text-gold-light font-semibold">24 mod 7 = 3</span> — is the engine of the weekday sequence. After 24 horas, the next day&apos;s first hora ruler is exactly 3 steps forward in the Chaldean order from the current day&apos;s ruler.</p>
        <p className="text-text-secondary text-sm leading-relaxed">This &quot;jump of 3&quot; transforms the speed-ranked Chaldean order into the familiar weekday order. It is not arbitrary, not culturally imposed, and not mythological — it is a strict mathematical consequence of dividing 24 hours among 7 planets.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example: Saturday &rarr; Sunday &rarr; Monday &rarr; ...</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Chaldean order:</span> [0] Saturn, [1] Jupiter, [2] Mars, [3] Sun, [4] Venus, [5] Mercury, [6] Moon</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Saturday (Shanivara):</span> Day starts with Saturn (position 0). After 24 horas, jump 3 forward: position (0+3) mod 7 = 3 = <span className="text-emerald-400 font-semibold">Sun</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Sunday (Ravivara):</span> Day starts with Sun (position 3). Jump 3: (3+3) mod 7 = 6 = <span className="text-emerald-400 font-semibold">Moon</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Monday (Somavara):</span> Starts with Moon (position 6). Jump 3: (6+3) mod 7 = 2 = <span className="text-emerald-400 font-semibold">Mars</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Tuesday (Mangalavara):</span> Starts with Mars (position 2). Jump 3: (2+3) mod 7 = 5 = <span className="text-emerald-400 font-semibold">Mercury</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Wednesday (Budhavara):</span> Starts with Mercury (position 5). Jump 3: (5+3) mod 7 = 1 = <span className="text-emerald-400 font-semibold">Jupiter</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Thursday (Guruvara):</span> Starts with Jupiter (position 1). Jump 3: (1+3) mod 7 = 4 = <span className="text-emerald-400 font-semibold">Venus</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Friday (Shukravara):</span> Starts with Venus (position 4). Jump 3: (4+3) mod 7 = 0 = <span className="text-emerald-400 font-semibold">Saturn</span>. The cycle is complete!</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Sanskrit &rarr; Latin &rarr; English: Weekday Names Across Civilizations</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The seven weekday names encode the same planetary assignments across Sanskrit, Latin, and English — powerful evidence that the Hora system was a shared framework of the ancient world, not a local invention.</p>
      </section>
      <section className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-gold-primary/20">
              <th className="text-gold-light text-left py-2 px-3 font-semibold">Planet</th>
              <th className="text-gold-light text-left py-2 px-3 font-semibold">Sanskrit</th>
              <th className="text-gold-light text-left py-2 px-3 font-semibold">Latin</th>
              <th className="text-gold-light text-left py-2 px-3 font-semibold">English</th>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Sun</td><td className="py-1.5 px-3">Ravivara</td><td className="py-1.5 px-3">Dies Solis</td><td className="py-1.5 px-3">Sunday</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Moon</td><td className="py-1.5 px-3">Somavara</td><td className="py-1.5 px-3">Dies Lunae</td><td className="py-1.5 px-3">Monday</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Mars</td><td className="py-1.5 px-3">Mangalavara</td><td className="py-1.5 px-3">Dies Martis</td><td className="py-1.5 px-3">Tuesday (Tiw = Norse Mars)</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Mercury</td><td className="py-1.5 px-3">Budhavara</td><td className="py-1.5 px-3">Dies Mercurii</td><td className="py-1.5 px-3">Wednesday (Woden = Norse Mercury)</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Jupiter</td><td className="py-1.5 px-3">Guruvara</td><td className="py-1.5 px-3">Dies Jovis</td><td className="py-1.5 px-3">Thursday (Thor = Norse Jupiter)</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Venus</td><td className="py-1.5 px-3">Shukravara</td><td className="py-1.5 px-3">Dies Veneris</td><td className="py-1.5 px-3">Friday (Frigg = Norse Venus)</td></tr>
            <tr><td className="py-1.5 px-3">Saturn</td><td className="py-1.5 px-3">Shanivara</td><td className="py-1.5 px-3">Dies Saturni</td><td className="py-1.5 px-3">Saturday</td></tr>
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3 mt-4" style={{ fontFamily: 'var(--font-heading)' }}>Classical Sources</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The hora-weekday derivation appears in multiple ancient Indian texts. The <span className="text-gold-light font-medium">Surya Siddhanta</span> (likely 4th-5th century CE) describes the division of the day into 24 horas and the Chaldean ordering of planets. <span className="text-gold-light font-medium">Varahamihira&apos;s Brihat Samhita</span> (6th century CE) explicitly states the principle &quot;horeshvaro dineshvarah&quot; — the lord of the first hora is the lord of the day.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Even earlier, <span className="text-gold-light font-medium">Kautilya&apos;s Arthashastra</span> (c. 3rd century BCE) references the seven-day week and planetary time-keeping in the context of state administration, suggesting the system was well-established in India centuries before Varahamihira formalized it astronomically.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Key Takeaway</h4>
        <p className="text-text-secondary text-xs leading-relaxed">The 7-day week is not arbitrary. It is a mathematical inevitability arising from two facts: there are 7 visible &quot;wandering stars&quot; (planets), and the day is divided into 24 hours. The remainder 24 mod 7 = 3 generates the skip pattern that converts the speed-ranked Chaldean order into the weekday sequence. Sanskrit, Latin, and English weekday names all encode the same planetary assignments — testimony to a shared astronomical heritage spanning India, Babylon, Greece, and Rome.</p>
      </section>
    </div>
  );
}

export default function Module7_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
