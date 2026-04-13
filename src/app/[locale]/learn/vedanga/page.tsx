'use client';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/vedanga.json';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, BookOpen, Star, Sparkles, Globe, Route } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const VEDANGAS = [
  { name: 'Shiksha', nameHi: 'शिक्षा', meaning: { en: 'Phonetics', hi: 'उच्चारण विद्या', sa: 'उच्चारण विद्या', mai: 'उच्चारण विद्या', mr: 'उच्चारण विद्या', ta: 'ஒலியியல்', te: 'శబ్దశాస్త్రం', bn: 'ধ্বনিবিদ্যা', kn: 'ಧ್ವನಿಶಾಸ್ತ್ರ', gu: 'ધ્વનિશાસ્ત્ર' }, icon: '1' },
  { name: 'Kalpa', nameHi: 'कल्प', meaning: { en: 'Ritual procedure', hi: 'अनुष्ठान विधि', sa: 'अनुष्ठान विधि', mai: 'अनुष्ठान विधि', mr: 'अनुष्ठान विधि', ta: 'சடங்கு முறை', te: 'తంత్ర విధానం', bn: 'আচার প্রক্রিয়া', kn: 'ವಿಧಿ ಪ್ರಕ್ರಿಯೆ', gu: 'વિધિ પ્રક્રિયા' }, icon: '2' },
  { name: 'Vyakarana', nameHi: 'व्याकरण', meaning: { en: 'Grammar', hi: 'व्याकरण', sa: 'व्याकरण', mai: 'व्याकरण', mr: 'व्याकरण', ta: 'இலக்கணம்', te: 'వ్యాకరణం', bn: 'ব্যাকরণ', kn: 'ವ್ಯಾಕರಣ', gu: 'વ્યાકરણ' }, icon: '3' },
  { name: 'Nirukta', nameHi: 'निरुक्त', meaning: { en: 'Etymology', hi: 'शब्द व्युत्पत्ति', sa: 'शब्द व्युत्पत्ति', mai: 'शब्द व्युत्पत्ति', mr: 'शब्द व्युत्पत्ति', ta: 'நிருக்தம்', te: 'నిరుక్తం', bn: 'নিরুক্ত', kn: 'ನಿರುಕ್ತ', gu: 'નિરુક્ત' }, icon: '4' },
  { name: 'Chhandas', nameHi: 'छन्दस्', meaning: { en: 'Metre', hi: 'छन्द शास्त्र', sa: 'छन्द शास्त्र', mai: 'छन्द शास्त्र', mr: 'छन्द शास्त्र', ta: 'சந்தஸ்', te: 'ఛందస్సు', bn: 'ছন্দ', kn: 'ಛಂದಸ್ಸು', gu: 'છંદ' }, icon: '5' },
  { name: 'Jyotisha', nameHi: 'ज्योतिष', meaning: { en: 'Astronomy', hi: 'खगोल विद्या', sa: 'खगोल विद्या', mai: 'खगोल विद्या', mr: 'खगोल विद्या', ta: 'வானியல்', te: 'ఖగోళశాస్త్రం', bn: 'জ্যোতির্বিদ্যা', kn: 'ಖಗೋಳಶಾಸ್ತ್ರ', gu: 'ખગોળશાસ્ત્ર' }, icon: '6', highlight: true },
];

interface Astronomer {
  name: string;
  nameHi: string;
  era: string;
  color: string;
  border: string;
  achievements: LocaleText[];
  quote?: Record<string, string>;
}

const ASTRONOMERS: Astronomer[] = [
  {
    name: 'Aryabhata', nameHi: 'आर्यभट', era: '476 CE',
    color: 'from-emerald-500/20 to-emerald-900/10', border: 'border-emerald-500/25',
    achievements: [
      { en: 'Declared Earth rotates on its axis — 1,044 years before Copernicus', hi: 'घोषणा की कि पृथ्वी अपनी धुरी पर घूमती है — कॉपरनिकस से 1,044 वर्ष पूर्व', sa: 'घोषणा की कि पृथ्वी अपनी धुरी पर घूमती है — कॉपरनिकस से 1,044 वर्ष पूर्व', mai: 'घोषणा की कि पृथ्वी अपनी धुरी पर घूमती है — कॉपरनिकस से 1,044 वर्ष पूर्व', mr: 'घोषणा की कि पृथ्वी अपनी धुरी पर घूमती है — कॉपरनिकस से 1,044 वर्ष पूर्व', ta: 'Declared Earth rotates on its axis — 1,044 years before Copernicus', te: 'Declared Earth rotates on its axis — 1,044 years before Copernicus', bn: 'Declared Earth rotates on its axis — 1,044 years before Copernicus', kn: 'Declared Earth rotates on its axis — 1,044 years before Copernicus', gu: 'Declared Earth rotates on its axis — 1,044 years before Copernicus' },
      { en: 'Calculated Earth\'s circumference to 99.8% accuracy (39,736 km vs 40,075 km)', hi: 'पृथ्वी की परिधि 99.8% सटीकता से आँकी (39,736 km बनाम 40,075 km)' },
      { en: 'Created the first sine tables (ardha-jya) — the word "sine" IS Sanskrit', hi: 'प्रथम ज्या सारणी बनाई (अर्ध-ज्या) — "sine" शब्द संस्कृत से ही आया है', sa: 'प्रथम ज्या सारणी बनाई (अर्ध-ज्या) — "sine" शब्द संस्कृत से ही आया है', mai: 'प्रथम ज्या सारणी बनाई (अर्ध-ज्या) — "sine" शब्द संस्कृत से ही आया है', mr: 'प्रथम ज्या सारणी बनाई (अर्ध-ज्या) — "sine" शब्द संस्कृत से ही आया है', ta: 'Created the first sine tables (ardha-jya) — the word "sine" IS Sanskrit', te: 'Created the first sine tables (ardha-jya) — the word "sine" IS Sanskrit', bn: 'Created the first sine tables (ardha-jya) — the word "sine" IS Sanskrit', kn: 'Created the first sine tables (ardha-jya) — the word "sine" IS Sanskrit', gu: 'Created the first sine tables (ardha-jya) — the word "sine" IS Sanskrit' },
      { en: 'Pi = 3.1416 — most accurate ancient value. Wrote Aryabhatiya at age 23.', hi: 'पाई = 3.1416 — प्राचीन विश्व का सबसे सटीक मान। 23 वर्ष की आयु में आर्यभटीय लिखी।', sa: 'पाई = 3.1416 — प्राचीन विश्व का सबसे सटीक मान। 23 वर्ष की आयु में आर्यभटीय लिखी।', mai: 'पाई = 3.1416 — प्राचीन विश्व का सबसे सटीक मान। 23 वर्ष की आयु में आर्यभटीय लिखी।', mr: 'पाई = 3.1416 — प्राचीन विश्व का सबसे सटीक मान। 23 वर्ष की आयु में आर्यभटीय लिखी।', ta: 'Pi = 3.1416 — most accurate ancient value. Wrote Aryabhatiya at age 23.', te: 'Pi = 3.1416 — most accurate ancient value. Wrote Aryabhatiya at age 23.', bn: 'Pi = 3.1416 — most accurate ancient value. Wrote Aryabhatiya at age 23.', kn: 'Pi = 3.1416 — most accurate ancient value. Wrote Aryabhatiya at age 23.', gu: 'Pi = 3.1416 — most accurate ancient value. Wrote Aryabhatiya at age 23.' },
      { en: 'First to explain eclipses as Earth\'s shadow on the Moon — not Rahu swallowing the luminaries.', hi: 'ग्रहण को पृथ्वी की छाया के रूप में समझाने वाले पहले व्यक्ति — राहु द्वारा ग्रास नहीं।' },
    ],
    quote: { en: '"As a man in a boat sees stationary objects moving backward, so the stationary stars are seen as moving westward."', hi: '"जैसे नाव में बैठा व्यक्ति स्थिर वस्तुओं को पीछे जाते देखता है, वैसे ही स्थिर तारे पश्चिम की ओर गतिमान दिखते हैं।"', sa: '"जैसे नाव में बैठा व्यक्ति स्थिर वस्तुओं को पीछे जाते देखता है, वैसे ही स्थिर तारे पश्चिम की ओर गतिमान दिखते हैं।"', mai: '"जैसे नाव में बैठा व्यक्ति स्थिर वस्तुओं को पीछे जाते देखता है, वैसे ही स्थिर तारे पश्चिम की ओर गतिमान दिखते हैं।"', mr: '"जैसे नाव में बैठा व्यक्ति स्थिर वस्तुओं को पीछे जाते देखता है, वैसे ही स्थिर तारे पश्चिम की ओर गतिमान दिखते हैं।"', ta: '"As a man in a boat sees stationary objects moving backward, so the stationary stars are seen as moving westward."', te: '"As a man in a boat sees stationary objects moving backward, so the stationary stars are seen as moving westward."', bn: '"As a man in a boat sees stationary objects moving backward, so the stationary stars are seen as moving westward."', kn: '"As a man in a boat sees stationary objects moving backward, so the stationary stars are seen as moving westward."', gu: '"As a man in a boat sees stationary objects moving backward, so the stationary stars are seen as moving westward."' },
  },
  {
    name: 'Varahamihira', nameHi: 'वराहमिहिर', era: '505 CE',
    color: 'from-amber-500/20 to-amber-900/10', border: 'border-amber-500/25',
    achievements: [
      { en: 'Pancha Siddhantika — compared and synthesized 5 astronomical systems', hi: 'पञ्चसिद्धान्तिका — 5 खगोलीय प्रणालियों की तुलना और संश्लेषण', sa: 'पञ्चसिद्धान्तिका — 5 खगोलीय प्रणालियों की तुलना और संश्लेषण', mai: 'पञ्चसिद्धान्तिका — 5 खगोलीय प्रणालियों की तुलना और संश्लेषण', mr: 'पञ्चसिद्धान्तिका — 5 खगोलीय प्रणालियों की तुलना और संश्लेषण', ta: 'Pancha Siddhantika — compared and synthesized 5 astronomical systems', te: 'Pancha Siddhantika — compared and synthesized 5 astronomical systems', bn: 'Pancha Siddhantika — compared and synthesized 5 astronomical systems', kn: 'Pancha Siddhantika — compared and synthesized 5 astronomical systems', gu: 'Pancha Siddhantika — compared and synthesized 5 astronomical systems' },
      { en: 'Brihat Samhita — an encyclopedia covering astronomy, weather, architecture, gems, agriculture', hi: 'बृहत्संहिता — खगोल, मौसम, वास्तु, रत्न, कृषि का विश्वकोश', sa: 'बृहत्संहिता — खगोल, मौसम, वास्तु, रत्न, कृषि का विश्वकोश', mai: 'बृहत्संहिता — खगोल, मौसम, वास्तु, रत्न, कृषि का विश्वकोश', mr: 'बृहत्संहिता — खगोल, मौसम, वास्तु, रत्न, कृषि का विश्वकोश', ta: 'Brihat Samhita — an encyclopedia covering astronomy, weather, architecture, gems, agriculture', te: 'Brihat Samhita — an encyclopedia covering astronomy, weather, architecture, gems, agriculture', bn: 'Brihat Samhita — an encyclopedia covering astronomy, weather, architecture, gems, agriculture', kn: 'Brihat Samhita — an encyclopedia covering astronomy, weather, architecture, gems, agriculture', gu: 'Brihat Samhita — an encyclopedia covering astronomy, weather, architecture, gems, agriculture' },
      { en: 'Brihat Jataka — the foundational text of predictive Jyotish still studied today', hi: 'बृहज्जातक — भविष्यवाणी ज्योतिष का मूल ग्रन्थ जो आज भी अध्ययन किया जाता है', sa: 'बृहज्जातक — भविष्यवाणी ज्योतिष का मूल ग्रन्थ जो आज भी अध्ययन किया जाता है', mai: 'बृहज्जातक — भविष्यवाणी ज्योतिष का मूल ग्रन्थ जो आज भी अध्ययन किया जाता है', mr: 'बृहज्जातक — भविष्यवाणी ज्योतिष का मूल ग्रन्थ जो आज भी अध्ययन किया जाता है', ta: 'Brihat Jataka — the foundational text of predictive Jyotish still studied today', te: 'Brihat Jataka — the foundational text of predictive Jyotish still studied today', bn: 'Brihat Jataka — the foundational text of predictive Jyotish still studied today', kn: 'Brihat Jataka — the foundational text of predictive Jyotish still studied today', gu: 'Brihat Jataka — the foundational text of predictive Jyotish still studied today' },
      { en: 'Called "the Indian Ptolemy" — but his breadth exceeded Ptolemy\'s', hi: '"भारतीय टॉलमी" कहे गए — किन्तु उनका विस्तार टॉलमी से अधिक था' },
    ],
  },
  {
    name: 'Brahmagupta', nameHi: 'ब्रह्मगुप्त', era: '598 CE',
    color: 'from-blue-500/20 to-blue-900/10', border: 'border-blue-500/25',
    achievements: [
      { en: 'First in human history to define rules for zero: a + 0 = a, a x 0 = 0', hi: 'मानव इतिहास में पहली बार शून्य के नियम परिभाषित किए: a + 0 = a, a x 0 = 0', sa: 'मानव इतिहास में पहली बार शून्य के नियम परिभाषित किए: a + 0 = a, a x 0 = 0', mai: 'मानव इतिहास में पहली बार शून्य के नियम परिभाषित किए: a + 0 = a, a x 0 = 0', mr: 'मानव इतिहास में पहली बार शून्य के नियम परिभाषित किए: a + 0 = a, a x 0 = 0', ta: 'First in human history to define rules for zero: a + 0 = a, a x 0 = 0', te: 'First in human history to define rules for zero: a + 0 = a, a x 0 = 0', bn: 'First in human history to define rules for zero: a + 0 = a, a x 0 = 0', kn: 'First in human history to define rules for zero: a + 0 = a, a x 0 = 0', gu: 'First in human history to define rules for zero: a + 0 = a, a x 0 = 0' },
      { en: 'Defined negative numbers and their arithmetic — Europe wouldn\'t accept these for 1,000 years', hi: 'ऋण संख्याओं और उनके अंकगणित को परिभाषित किया — यूरोप ने 1,000 वर्षों तक इन्हें स्वीकार नहीं किया' },
      { en: 'Brahmasphutasiddhanta (628 CE) — calculated lunar and solar eclipse durations', hi: 'ब्राह्मस्फुटसिद्धान्त (628 ई.) — चन्द्र और सूर्य ग्रहण की अवधि गणना', sa: 'ब्राह्मस्फुटसिद्धान्त (628 ई.) — चन्द्र और सूर्य ग्रहण की अवधि गणना', mai: 'ब्राह्मस्फुटसिद्धान्त (628 ई.) — चन्द्र और सूर्य ग्रहण की अवधि गणना', mr: 'ब्राह्मस्फुटसिद्धान्त (628 ई.) — चन्द्र और सूर्य ग्रहण की अवधि गणना', ta: 'Brahmasphutasiddhanta (628 CE) — calculated lunar and solar eclipse durations', te: 'Brahmasphutasiddhanta (628 CE) — calculated lunar and solar eclipse durations', bn: 'Brahmasphutasiddhanta (628 CE) — calculated lunar and solar eclipse durations', kn: 'Brahmasphutasiddhanta (628 CE) — calculated lunar and solar eclipse durations', gu: 'Brahmasphutasiddhanta (628 CE) — calculated lunar and solar eclipse durations' },
      { en: 'His work reached Baghdad, becoming the foundation for Al-Khwarizmi\'s algebra', hi: 'उनका कार्य बग़दाद पहुँचा, अल-ख़्वारिज़्मी के बीजगणित का आधार बना' },
    ],
    quote: { en: '"Bodies fall towards the Earth as it is in the nature of the Earth to attract bodies, just as it is the nature of water to flow."', hi: '"वस्तुएँ पृथ्वी की ओर गिरती हैं क्योंकि पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना है, जैसे जल का स्वभाव बहना है।"', sa: '"वस्तुएँ पृथ्वी की ओर गिरती हैं क्योंकि पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना है, जैसे जल का स्वभाव बहना है।"', mai: '"वस्तुएँ पृथ्वी की ओर गिरती हैं क्योंकि पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना है, जैसे जल का स्वभाव बहना है।"', mr: '"वस्तुएँ पृथ्वी की ओर गिरती हैं क्योंकि पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना है, जैसे जल का स्वभाव बहना है।"', ta: '"Bodies fall towards the Earth as it is in the nature of the Earth to attract bodies, just as it is the nature of water to flow."', te: '"Bodies fall towards the Earth as it is in the nature of the Earth to attract bodies, just as it is the nature of water to flow."', bn: '"Bodies fall towards the Earth as it is in the nature of the Earth to attract bodies, just as it is the nature of water to flow."', kn: '"Bodies fall towards the Earth as it is in the nature of the Earth to attract bodies, just as it is the nature of water to flow."', gu: '"Bodies fall towards the Earth as it is in the nature of the Earth to attract bodies, just as it is the nature of water to flow."' },
  },
  {
    name: 'Bhaskara I', nameHi: 'भास्कर प्रथम', era: '600 CE',
    color: 'from-violet-500/20 to-violet-900/10', border: 'border-violet-500/25',
    achievements: [
      { en: 'First to use the decimal number system in a scientific manuscript', hi: 'वैज्ञानिक पाण्डुलिपि में दशमलव संख्या पद्धति का प्रथम प्रयोग', sa: 'वैज्ञानिक पाण्डुलिपि में दशमलव संख्या पद्धति का प्रथम प्रयोग', mai: 'वैज्ञानिक पाण्डुलिपि में दशमलव संख्या पद्धति का प्रथम प्रयोग', mr: 'वैज्ञानिक पाण्डुलिपि में दशमलव संख्या पद्धति का प्रथम प्रयोग', ta: 'First to use the decimal number system in a scientific manuscript', te: 'First to use the decimal number system in a scientific manuscript', bn: 'First to use the decimal number system in a scientific manuscript', kn: 'First to use the decimal number system in a scientific manuscript', gu: 'First to use the decimal number system in a scientific manuscript' },
      { en: 'Wrote the earliest known commentary on Aryabhata\'s work', hi: 'आर्यभट के कार्य पर ज्ञात सबसे प्राचीन भाष्य लिखा' },
      { en: 'Remarkable rational approximation for the sine function', hi: 'ज्या फलन का उल्लेखनीय परिमेय सन्निकटन', sa: 'ज्या फलन का उल्लेखनीय परिमेय सन्निकटन', mai: 'ज्या फलन का उल्लेखनीय परिमेय सन्निकटन', mr: 'ज्या फलन का उल्लेखनीय परिमेय सन्निकटन', ta: 'Remarkable rational approximation for the sine function', te: 'Remarkable rational approximation for the sine function', bn: 'Remarkable rational approximation for the sine function', kn: 'Remarkable rational approximation for the sine function', gu: 'Remarkable rational approximation for the sine function' },
    ],
  },
  {
    name: 'Bhaskaracharya II', nameHi: 'भास्कराचार्य', era: '1150 CE',
    color: 'from-rose-500/20 to-rose-900/10', border: 'border-rose-500/25',
    achievements: [
      { en: 'Siddhanta Shiromani — contained calculus-like concepts (derivatives, differentials) 500 years before Newton', hi: 'सिद्धान्त शिरोमणि — न्यूटन से 500 वर्ष पहले कलनशास्त्र जैसी अवधारणाएँ', sa: 'सिद्धान्त शिरोमणि — न्यूटन से 500 वर्ष पहले कलनशास्त्र जैसी अवधारणाएँ', mai: 'सिद्धान्त शिरोमणि — न्यूटन से 500 वर्ष पहले कलनशास्त्र जैसी अवधारणाएँ', mr: 'सिद्धान्त शिरोमणि — न्यूटन से 500 वर्ष पहले कलनशास्त्र जैसी अवधारणाएँ', ta: 'Siddhanta Shiromani — contained calculus-like concepts (derivatives, differentials) 500 years before Newton', te: 'Siddhanta Shiromani — contained calculus-like concepts (derivatives, differentials) 500 years before Newton', bn: 'Siddhanta Shiromani — contained calculus-like concepts (derivatives, differentials) 500 years before Newton', kn: 'Siddhanta Shiromani — contained calculus-like concepts (derivatives, differentials) 500 years before Newton', gu: 'Siddhanta Shiromani — contained calculus-like concepts (derivatives, differentials) 500 years before Newton' },
      { en: 'Calculated the sidereal year as 365.2588 days — accurate to 3.5 minutes', hi: 'नाक्षत्रिक वर्ष 365.2588 दिन आँका — 3.5 मिनट तक सटीक', sa: 'नाक्षत्रिक वर्ष 365.2588 दिन आँका — 3.5 मिनट तक सटीक', mai: 'नाक्षत्रिक वर्ष 365.2588 दिन आँका — 3.5 मिनट तक सटीक', mr: 'नाक्षत्रिक वर्ष 365.2588 दिन आँका — 3.5 मिनट तक सटीक', ta: 'Calculated the sidereal year as 365.2588 days — accurate to 3.5 minutes', te: 'Calculated the sidereal year as 365.2588 days — accurate to 3.5 minutes', bn: 'Calculated the sidereal year as 365.2588 days — accurate to 3.5 minutes', kn: 'Calculated the sidereal year as 365.2588 days — accurate to 3.5 minutes', gu: 'Calculated the sidereal year as 365.2588 days — accurate to 3.5 minutes' },
      { en: 'Described gravitational attraction: "objects fall to Earth due to Earth\'s attractive force"', hi: 'गुरुत्वाकर्षण का वर्णन: "वस्तुएँ पृथ्वी के आकर्षण बल से गिरती हैं"' },
      { en: 'His Lilavati (mathematics) and Bijaganita (algebra) — named after his daughter', hi: 'लीलावती (गणित) और बीजगणित — अपनी पुत्री के नाम पर', sa: 'लीलावती (गणित) और बीजगणित — अपनी पुत्री के नाम पर', mai: 'लीलावती (गणित) और बीजगणित — अपनी पुत्री के नाम पर', mr: 'लीलावती (गणित) और बीजगणित — अपनी पुत्री के नाम पर', ta: 'His Lilavati (mathematics) and Bijaganita (algebra) — named after his daughter', te: 'His Lilavati (mathematics) and Bijaganita (algebra) — named after his daughter', bn: 'His Lilavati (mathematics) and Bijaganita (algebra) — named after his daughter', kn: 'His Lilavati (mathematics) and Bijaganita (algebra) — named after his daughter', gu: 'His Lilavati (mathematics) and Bijaganita (algebra) — named after his daughter' },
    ],
  },
  {
    name: 'Madhava of Sangamagrama', nameHi: 'माधव सङ्गमग्राम', era: '1340 CE',
    color: 'from-teal-500/20 to-teal-900/10', border: 'border-teal-500/25',
    achievements: [
      { en: 'Founded the Kerala School of mathematics — 300 years before European calculus', hi: 'केरल गणित सम्प्रदाय की स्थापना — यूरोपीय कलनशास्त्र से 300 वर्ष पूर्व', sa: 'केरल गणित सम्प्रदाय की स्थापना — यूरोपीय कलनशास्त्र से 300 वर्ष पूर्व', mai: 'केरल गणित सम्प्रदाय की स्थापना — यूरोपीय कलनशास्त्र से 300 वर्ष पूर्व', mr: 'केरल गणित सम्प्रदाय की स्थापना — यूरोपीय कलनशास्त्र से 300 वर्ष पूर्व', ta: 'Founded the Kerala School of mathematics — 300 years before European calculus', te: 'Founded the Kerala School of mathematics — 300 years before European calculus', bn: 'Founded the Kerala School of mathematics — 300 years before European calculus', kn: 'Founded the Kerala School of mathematics — 300 years before European calculus', gu: 'Founded the Kerala School of mathematics — 300 years before European calculus' },
      { en: 'Discovered infinite series for pi, sine, cosine, and arctangent', hi: 'पाई, ज्या, कोज्या और प्रतिलोम स्पर्शज्या के अनन्त श्रेणी की खोज', sa: 'पाई, ज्या, कोज्या और प्रतिलोम स्पर्शज्या के अनन्त श्रेणी की खोज', mai: 'पाई, ज्या, कोज्या और प्रतिलोम स्पर्शज्या के अनन्त श्रेणी की खोज', mr: 'पाई, ज्या, कोज्या और प्रतिलोम स्पर्शज्या के अनन्त श्रेणी की खोज', ta: 'Discovered infinite series for pi, sine, cosine, and arctangent', te: 'Discovered infinite series for pi, sine, cosine, and arctangent', bn: 'Discovered infinite series for pi, sine, cosine, and arctangent', kn: 'Discovered infinite series for pi, sine, cosine, and arctangent', gu: 'Discovered infinite series for pi, sine, cosine, and arctangent' },
      { en: 'His pi series: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (known in Europe as Leibniz series, 1670s)', hi: 'उनकी पाई श्रेणी: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (यूरोप में लाइबनित्स श्रेणी, 1670 दशक)', sa: 'उनकी पाई श्रेणी: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (यूरोप में लाइबनित्स श्रेणी, 1670 दशक)', mai: 'उनकी पाई श्रेणी: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (यूरोप में लाइबनित्स श्रेणी, 1670 दशक)', mr: 'उनकी पाई श्रेणी: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (यूरोप में लाइबनित्स श्रेणी, 1670 दशक)', ta: 'His pi series: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (known in Europe as Leibniz series, 1670s)', te: 'His pi series: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (known in Europe as Leibniz series, 1670s)', bn: 'His pi series: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (known in Europe as Leibniz series, 1670s)', kn: 'His pi series: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (known in Europe as Leibniz series, 1670s)', gu: 'His pi series: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ... (known in Europe as Leibniz series, 1670s)' },
      { en: 'Taylor series expansions — three centuries before Brook Taylor', hi: 'टेलर श्रेणी प्रसार — ब्रुक टेलर से तीन शताब्दी पहले', sa: 'टेलर श्रेणी प्रसार — ब्रुक टेलर से तीन शताब्दी पहले', mai: 'टेलर श्रेणी प्रसार — ब्रुक टेलर से तीन शताब्दी पहले', mr: 'टेलर श्रेणी प्रसार — ब्रुक टेलर से तीन शताब्दी पहले', ta: 'Taylor series expansions — three centuries before Brook Taylor', te: 'Taylor series expansions — three centuries before Brook Taylor', bn: 'Taylor series expansions — three centuries before Brook Taylor', kn: 'Taylor series expansions — three centuries before Brook Taylor', gu: 'Taylor series expansions — three centuries before Brook Taylor' },
    ],
  },
  {
    name: 'Nilakantha Somayaji', nameHi: 'नीलकण्ठ सोमयाजी', era: '1444 CE',
    color: 'from-cyan-500/20 to-cyan-900/10', border: 'border-cyan-500/25',
    achievements: [
      { en: 'Tantrasangraha (1501 CE) — semi-heliocentric model: all planets orbit the Sun, Sun orbits Earth', hi: 'तन्त्रसंग्रह (1501 ई.) — अर्ध-सूर्यकेन्द्रित मॉडल: सभी ग्रह सूर्य की, सूर्य पृथ्वी की परिक्रमा', sa: 'तन्त्रसंग्रह (1501 ई.) — अर्ध-सूर्यकेन्द्रित मॉडल: सभी ग्रह सूर्य की, सूर्य पृथ्वी की परिक्रमा', mai: 'तन्त्रसंग्रह (1501 ई.) — अर्ध-सूर्यकेन्द्रित मॉडल: सभी ग्रह सूर्य की, सूर्य पृथ्वी की परिक्रमा', mr: 'तन्त्रसंग्रह (1501 ई.) — अर्ध-सूर्यकेन्द्रित मॉडल: सभी ग्रह सूर्य की, सूर्य पृथ्वी की परिक्रमा', ta: 'Tantrasangraha (1501 CE) — semi-heliocentric model: all planets orbit the Sun, Sun orbits Earth', te: 'Tantrasangraha (1501 CE) — semi-heliocentric model: all planets orbit the Sun, Sun orbits Earth', bn: 'Tantrasangraha (1501 CE) — semi-heliocentric model: all planets orbit the Sun, Sun orbits Earth', kn: 'Tantrasangraha (1501 CE) — semi-heliocentric model: all planets orbit the Sun, Sun orbits Earth', gu: 'Tantrasangraha (1501 CE) — semi-heliocentric model: all planets orbit the Sun, Sun orbits Earth' },
      { en: 'Nearly identical to Tycho Brahe\'s model — but 87 years earlier', hi: 'टाइको ब्राहे के मॉडल से लगभग समरूप — किन्तु 87 वर्ष पहले' },
      { en: 'Improved Madhava\'s series with faster-converging correction terms', hi: 'माधव की श्रेणी को तीव्र अभिसरण सुधार पदों से बेहतर बनाया' },
    ],
  },
];

const TIMELINE = [
  { year: '~1500 BCE', text: { en: 'Rigveda', hi: 'ऋग्वेद', sa: 'ऋग्वेद', mai: 'ऋग्वेद', mr: 'ऋग्वेद', ta: 'ரிக்வேதம்', te: 'ఋగ్వేదం', bn: 'ঋগ্বেদ', kn: 'ಋಗ್ವೇದ', gu: 'ઋગ્વેદ' }, detail: { en: 'Earliest nakshatra references', hi: 'सबसे प्राचीन नक्षत्र सन्दर्भ', sa: 'सबसे प्राचीन नक्षत्र सन्दर्भ', mai: 'सबसे प्राचीन नक्षत्र सन्दर्भ', mr: 'सबसे प्राचीन नक्षत्र सन्दर्भ', ta: 'Earliest nakshatra references', te: 'Earliest nakshatra references', bn: 'Earliest nakshatra references', kn: 'Earliest nakshatra references', gu: 'Earliest nakshatra references' }, color: 'bg-yellow-500' },
  { year: '~1400 BCE', text: { en: 'Vedanga Jyotisha', hi: 'वेदाङ्ग ज्योतिष', sa: 'वेदाङ्ग ज्योतिष', mai: 'वेदाङ्ग ज्योतिष', mr: 'वेदाङ्ग ज्योतिष', ta: 'வேதாங்க ஜோதிடம்', te: 'వేదాంగ జ్యోతిషం', bn: 'বেদাঙ্গ জ্যোতিষ', kn: 'ವೇದಾಂಗ ಜ್ಯೋತಿಷ', gu: 'વેદાંગ જ્યોતિષ' }, detail: { en: 'First astronomical text', hi: 'प्रथम खगोलीय ग्रन्थ', sa: 'प्रथम खगोलीय ग्रन्थ', mai: 'प्रथम खगोलीय ग्रन्थ', mr: 'प्रथम खगोलीय ग्रन्थ', ta: 'First astronomical text', te: 'First astronomical text', bn: 'First astronomical text', kn: 'First astronomical text', gu: 'First astronomical text' }, color: 'bg-amber-500' },
  { year: '~400 CE', text: { en: 'Surya Siddhanta', hi: 'सूर्य सिद्धान्त', sa: 'सूर्य सिद्धान्त', mai: 'सूर्य सिद्धान्त', mr: 'सूर्य सिद्धान्त', ta: 'சூர்ய சித்தாந்தம்', te: 'సూర్య సిద్ధాంతం', bn: 'সূর্য সিদ্ধান্ত', kn: 'ಸೂರ್ಯ ಸಿದ್ಧಾಂತ', gu: 'સૂર્ય સિદ્ધાંત' }, detail: { en: 'Comprehensive planetary theory', hi: 'व्यापक ग्रहीय सिद्धान्त', sa: 'व्यापक ग्रहीय सिद्धान्त', mai: 'व्यापक ग्रहीय सिद्धान्त', mr: 'व्यापक ग्रहीय सिद्धान्त', ta: 'Comprehensive planetary theory', te: 'Comprehensive planetary theory', bn: 'Comprehensive planetary theory', kn: 'Comprehensive planetary theory', gu: 'Comprehensive planetary theory' }, color: 'bg-orange-500' },
  { year: '499 CE', text: { en: 'Aryabhatiya', hi: 'आर्यभटीय', sa: 'आर्यभटीय', mai: 'आर्यभटीय', mr: 'आर्यभटीय', ta: 'ஆர்யபடீயம்', te: 'ఆర్యభటీయం', bn: 'আর্যভটীয়', kn: 'ಆರ್ಯಭಟೀಯ', gu: 'આર્યભટીય' }, detail: { en: 'Revolutionary calculations', hi: 'क्रान्तिकारी गणनाएँ', sa: 'क्रान्तिकारी गणनाएँ', mai: 'क्रान्तिकारी गणनाएँ', mr: 'क्रान्तिकारी गणनाएँ', ta: 'Revolutionary calculations', te: 'Revolutionary calculations', bn: 'Revolutionary calculations', kn: 'Revolutionary calculations', gu: 'Revolutionary calculations' }, color: 'bg-emerald-500' },
  { year: '505 CE', text: { en: 'Pancha Siddhantika', hi: 'पञ्चसिद्धान्तिका', sa: 'पञ्चसिद्धान्तिका', mai: 'पञ्चसिद्धान्तिका', mr: 'पञ्चसिद्धान्तिका', ta: 'பஞ்ச சித்தாந்திகா', te: 'పంచ సిద్ధాంతికా', bn: 'পঞ্চ সিদ্ধান্তিকা', kn: 'ಪಂಚ ಸಿದ್ಧಾಂತಿಕಾ', gu: 'પંચ સિદ્ધાંતિકા' }, detail: { en: 'Comparison of 5 systems', hi: '5 प्रणालियों की तुलना', sa: '5 प्रणालियों की तुलना', mai: '5 प्रणालियों की तुलना', mr: '5 प्रणालियों की तुलना', ta: 'Comparison of 5 systems', te: 'Comparison of 5 systems', bn: 'Comparison of 5 systems', kn: 'Comparison of 5 systems', gu: 'Comparison of 5 systems' }, color: 'bg-amber-400' },
  { year: '628 CE', text: { en: 'Brahmasphutasiddhanta', hi: 'ब्राह्मस्फुटसिद्धान्त', sa: 'ब्राह्मस्फुटसिद्धान्त', mai: 'ब्राह्मस्फुटसिद्धान्त', mr: 'ब्राह्मस्फुटसिद्धान्त', ta: 'பிரம்மஸ்புடசித்தாந்தம்', te: 'బ్రహ్మస్ఫుటసిద్ధాంతం', bn: 'ব্রহ্মস্ফুটসিদ্ধান্ত', kn: 'ಬ್ರಹ್ಮಸ್ಫುಟಸಿದ್ಧಾಂತ', gu: 'બ્રહ્મસ્ફુટસિદ્ધાંત' }, detail: { en: 'Zero, algebra, astronomy', hi: 'शून्य, बीजगणित, खगोल', sa: 'शून्य, बीजगणित, खगोल', mai: 'शून्य, बीजगणित, खगोल', mr: 'शून्य, बीजगणित, खगोल', ta: 'Zero, algebra, astronomy', te: 'Zero, algebra, astronomy', bn: 'Zero, algebra, astronomy', kn: 'Zero, algebra, astronomy', gu: 'Zero, algebra, astronomy' }, color: 'bg-blue-500' },
  { year: '1150 CE', text: { en: 'Siddhanta Shiromani', hi: 'सिद्धान्त शिरोमणि', sa: 'सिद्धान्त शिरोमणि', mai: 'सिद्धान्त शिरोमणि', mr: 'सिद्धान्त शिरोमणि', ta: 'சித்தாந்த சிரோமணி', te: 'సిద్ధాంత శిరోమణి', bn: 'সিদ্ধান্ত শিরোমণি', kn: 'ಸಿದ್ಧಾಂತ ಶಿರೋಮಣಿ', gu: 'સિદ્ધાંત શિરોમણિ' }, detail: { en: 'Advanced calculus-like methods', hi: 'उन्नत कलनशास्त्र जैसी विधियाँ', sa: 'उन्नत कलनशास्त्र जैसी विधियाँ', mai: 'उन्नत कलनशास्त्र जैसी विधियाँ', mr: 'उन्नत कलनशास्त्र जैसी विधियाँ', ta: 'Advanced calculus-like methods', te: 'Advanced calculus-like methods', bn: 'Advanced calculus-like methods', kn: 'Advanced calculus-like methods', gu: 'Advanced calculus-like methods' }, color: 'bg-rose-500' },
  { year: '1501 CE', text: { en: 'Tantrasangraha', hi: 'तन्त्रसंग्रह', sa: 'तन्त्रसंग्रह', mai: 'तन्त्रसंग्रह', mr: 'तन्त्रसंग्रह', ta: 'தந்த்ரசங்க்ரகம்', te: 'తంత్రసంగ్రహం', bn: 'তন্ত্রসংগ্রহ', kn: 'ತಂತ್ರಸಂಗ್ರಹ', gu: 'તંત્રસંગ્રહ' }, detail: { en: 'Kerala School breakthroughs', hi: 'केरल सम्प्रदाय की सफलताएँ', sa: 'केरल सम्प्रदाय की सफलताएँ', mai: 'केरल सम्प्रदाय की सफलताएँ', mr: 'केरल सम्प्रदाय की सफलताएँ', ta: 'கேரள பள்ளி கண்டுபிடிப்புகள்', te: 'కేరళ పాఠశాల ఆవిష్కరణలు', bn: 'কেরল স্কুলের আবিষ্কার', kn: 'ಕೇರಳ ಶಾಲೆಯ ಆವಿಷ್ಕಾರಗಳು', gu: 'કેરળ શાળાની શોધો' }, color: 'bg-cyan-500' },
];

const PRIORITY_TABLE = [
  { concept: { en: 'Earth rotates on axis', hi: 'पृथ्वी धुरी पर घूमती है', sa: 'पृथ्वी धुरी पर घूमती है', mai: 'पृथ्वी धुरी पर घूमती है', mr: 'पृथ्वी धुरी पर घूमती है', ta: 'Earth rotates on axis', te: 'Earth rotates on axis', bn: 'Earth rotates on axis', kn: 'Earth rotates on axis', gu: 'Earth rotates on axis' }, india: 'Aryabhata, 499 CE', west: 'Copernicus, 1543 CE', gap: '1,044 yrs' },
  { concept: { en: 'Earth\'s circumference (99.8%)', hi: 'पृथ्वी की परिधि (99.8%)' }, india: 'Aryabhata, 499 CE', west: 'Eratosthenes, 240 BCE', gap: 'Parallel' },
  { concept: { en: 'Sine function', hi: 'ज्या (Sine) फलन', sa: 'ज्या (Sine) फलन', mai: 'ज्या (Sine) फलन', mr: 'ज्या (Sine) फलन', ta: 'சைன் செயல்பாடு', te: 'సైన్ ఫంక్షన్', bn: 'সাইন ফাংশন', kn: 'ಸೈನ್ ಫಂಕ್ಷನ್', gu: 'સાઇન ફંક્શન' }, india: 'Aryabhata, 499 CE', west: 'Latin sinus via Arabic', gap: 'Origin' },
  { concept: { en: 'Zero as a number', hi: 'शून्य एक संख्या के रूप में', sa: 'शून्य एक संख्या के रूप में', mai: 'शून्य एक संख्या के रूप में', mr: 'शून्य एक संख्या के रूप में', ta: 'பூஜ்ஜியம் ஒரு எண்ணாக', te: 'శూన్యం ఒక సంఖ్యగా', bn: 'শূন্য একটি সংখ্যা হিসেবে', kn: 'ಶೂನ್ಯ ಒಂದು ಸಂಖ್ಯೆಯಾಗಿ', gu: 'શૂન્ય એક સંખ્યા તરીકે' }, india: 'Brahmagupta, 628 CE', west: 'Europe via Al-Khwarizmi, ~825 CE', gap: '~200 yrs' },
  { concept: { en: 'Infinite series for pi', hi: 'पाई की अनन्त श्रेणी', sa: 'पाई की अनन्त श्रेणी', mai: 'पाई की अनन्त श्रेणी', mr: 'पाई की अनन्त श्रेणी', ta: 'பை-க்கான அனந்த தொடர்', te: 'పై కోసం అనంత శ్రేణి', bn: 'পাই-এর জন্য অসীম শ্রেণী', kn: 'ಪೈ ಗಾಗಿ ಅನಂತ ಸರಣಿ', gu: 'પાઈ માટે અનંત શ્રેણી' }, india: 'Madhava, ~1400 CE', west: 'Gregory-Leibniz, ~1670 CE', gap: '270 yrs' },
  { concept: { en: 'Negative numbers', hi: 'ऋण संख्याएँ', sa: 'ऋण संख्याएँ', mai: 'ऋण संख्याएँ', mr: 'ऋण संख्याएँ', ta: 'குறை எண்கள்', te: 'ఋణ సంఖ్యలు', bn: 'ঋণাত্মক সংখ্যা', kn: 'ಋಣಾತ್ಮಕ ಸಂಖ್ಯೆಗಳು', gu: 'ઋણ સંખ્યાઓ' }, india: 'Brahmagupta, 628 CE', west: 'Europe, ~1200s CE', gap: '~600 yrs' },
  { concept: { en: 'Gravity concept', hi: 'गुरुत्वाकर्षण अवधारणा', sa: 'गुरुत्वाकर्षण अवधारणा', mai: 'गुरुत्वाकर्षण अवधारणा', mr: 'गुरुत्वाकर्षण अवधारणा', ta: 'புவியீர்ப்பு கருத்து', te: 'గురుత్వాకర్షణ భావన', bn: 'মাধ্যাকর্ষণ ধারণা', kn: 'ಗುರುತ್ವಾಕರ್ಷಣೆ ಪರಿಕಲ್ಪನೆ', gu: 'ગુરુત્વાકર્ષણ ખ્યાલ' }, india: 'Brahmagupta, 628 CE', west: 'Newton, 1687 CE', gap: '1,059 yrs' },
  { concept: { en: 'Calculus concepts', hi: 'कलनशास्त्र अवधारणाएँ', sa: 'कलनशास्त्र अवधारणाएँ', mai: 'कलनशास्त्र अवधारणाएँ', mr: 'कलनशास्त्र अवधारणाएँ', ta: 'கால்குலஸ் கருத்துகள்', te: 'కాలిక్యులస్ భావనలు', bn: 'ক্যালকুলাস ধারণা', kn: 'ಕ್ಯಾಲ್ಕುಲಸ್ ಪರಿಕಲ್ಪನೆಗಳು', gu: 'કેલ્ક્યુલસ ખ્યાલો' }, india: 'Madhava, ~1400 CE', west: 'Newton/Leibniz, ~1680 CE', gap: '~280 yrs' },
  { concept: { en: 'Semi-heliocentric model', hi: 'अर्ध-सूर्यकेन्द्रित मॉडल', sa: 'अर्ध-सूर्यकेन्द्रित मॉडल', mai: 'अर्ध-सूर्यकेन्द्रित मॉडल', mr: 'अर्ध-सूर्यकेन्द्रित मॉडल', ta: 'Semi-heliocentric model', te: 'Semi-heliocentric model', bn: 'Semi-heliocentric model', kn: 'Semi-heliocentric model', gu: 'Semi-heliocentric model' }, india: 'Nilakantha, ~1500 CE', west: 'Copernicus, 1543 CE', gap: '~40 yrs' },
  { concept: { en: 'Decimal system', hi: 'दशमलव प्रणाली', sa: 'दशमलव प्रणाली', mai: 'दशमलव प्रणाली', mr: 'दशमलव प्रणाली', ta: 'தசம எண் முறை', te: 'దశాంశ పద్ధతి', bn: 'দশমিক পদ্ধতি', kn: 'ದಶಮಾಂಶ ಪದ್ಧತಿ', gu: 'દશાંશ પદ્ધતિ' }, india: 'Bhaskara I, ~600 CE', west: 'Fibonacci, 1202 CE', gap: '~600 yrs' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function VedangaPage() {
  const locale = useLocale() as Locale;
  const hi = isDevanagariLocale(locale);
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Hero */}
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 mb-4">
          <BookOpen className="w-4 h-4 text-gold-primary" />
          <span className="text-xs text-gold-light font-medium tracking-wider uppercase">{hi ? 'भारतीय खगोल विरासत' : 'Indian Astronomy Heritage'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gold-gradient leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h1>
        <p className="mt-4 text-text-secondary/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">{t('subtitle')}</p>
      </motion.header>

      <div className="space-y-6">
        {/* ═══ SECTION 1: Vedanga Jyotisha ═══ */}
        <LessonSection number={1} title={t('s1Title')} variant="highlight">
          <p className="text-text-secondary/80 text-sm leading-relaxed">
            {hi
              ? 'वेदाङ्ग = "वेद का अंग।" ज्योतिष छः वेदाङ्गों में से एक है — और इसे सबसे श्रेष्ठ माना गया है।'
              : 'Vedanga means "limb of the Veda." Jyotisha is one of the six Vedangas — and it was considered the most exalted.'}
          </p>

          {/* Six Vedangas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {VEDANGAS.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-lg p-3 border ${v.highlight ? 'border-gold-primary/40 bg-gold-primary/[0.08] ring-1 ring-gold-primary/20' : 'border-white/[0.06] bg-white/[0.02]'}`}
              >
                <div className="text-xs text-text-secondary/65 mb-1">{v.icon}/6</div>
                <div className={`font-bold text-sm ${v.highlight ? 'text-gold-primary' : 'text-gold-light'}`}>
                  {v.name} <span className="text-text-secondary/65 font-normal" style={{ fontFamily: 'var(--font-devanagari-body)' }}>({v.nameHi})</span>
                </div>
                <div className="text-xs text-text-secondary/75 mt-0.5">{lt(v.meaning as LocaleText, locale)}</div>
              </motion.div>
            ))}
          </div>

          {/* Key verse */}
          <motion.blockquote
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 border-l-4 border-gold-primary/40 pl-5 py-3"
          >
            <p className="text-gold-light/90 italic text-sm leading-relaxed">
              {hi
                ? '"जैसे मयूर के शीश पर शिखा, जैसे नाग के फन पर मणि, वैसे ही वेदाङ्गों के शीर्ष पर ज्योतिष विराजमान है।"'
                : '"Like the crest on the head of a peacock, like the gem on the hood of a cobra, Jyotisha stands at the head of the Vedangas."'}
            </p>
            <footer className="text-gold-primary/50 text-xs mt-2 font-semibold">
              {hi ? '— वेदाङ्ग ज्योतिष 1.35' : '— Vedanga Jyotisha 1.35'}
            </footer>
          </motion.blockquote>

          <div className="mt-5 space-y-3">
            <p className="text-text-secondary/80 text-sm leading-relaxed">
              {hi
                ? 'लगध (~1400 ई.पू., कुछ विद्वान ~500 ई.पू. मानते हैं) को इसका रचयिता माना जाता है। इसमें 5-वर्षीय युग चक्र, अयनान्त अवलोकन, और अधिमास नियम हैं।'
                : 'Attributed to Lagadha (~1400 BCE, some scholars date to ~500 BCE). Contains a 5-year Yuga cycle, solstice observations, and intercalary month rules.'}
            </p>
            <div className="flex items-start gap-3 bg-amber-500/[0.06] border border-amber-500/15 rounded-lg p-4">
              <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary/70 leading-relaxed">
                {hi
                  ? 'यह "ज्योतिष" (फलित ज्योतिष) नहीं है — यह शुद्ध प्रेक्षणात्मक खगोल विज्ञान है, जो यज्ञ और अनुष्ठान के सही समय निर्धारण के लिए विकसित हुआ।'
                  : 'This is NOT "astrology" in the predictive sense — it is pure observational astronomy, developed for the precise timing of Vedic rituals and yajnas.'}
              </p>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 2: Great Astronomers ═══ */}
        <LessonSection number={2} title={t('s2Title')}>
          <p className="text-text-secondary/70 text-sm mb-4">
            {hi
              ? 'इन प्रतिभाओं ने न केवल भारतीय विज्ञान को, बल्कि सम्पूर्ण मानव ज्ञान को आकार दिया।'
              : 'These minds shaped not only Indian science, but all of human knowledge.'}
          </p>
          <div className="space-y-4">
            {ASTRONOMERS.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`rounded-xl border ${a.border} bg-gradient-to-br ${a.color} p-5`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-gold-light font-bold text-base sm:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                      {a.name}
                    </h4>
                    <span className="text-text-secondary/65 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{a.nameHi}</span>
                  </div>
                  <span className="text-xs font-mono text-gold-primary/70 bg-gold-primary/10 px-2.5 py-1 rounded-full">{a.era}</span>
                </div>
                <ul className="space-y-2">
                  {a.achievements.map((ach, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-primary/50 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-text-secondary/80 leading-relaxed">{lt(ach, locale)}</span>
                    </li>
                  ))}
                </ul>
                {a.quote && (
                  <blockquote className="mt-3 border-l-2 border-gold-primary/25 pl-3 py-1">
                    <p className="text-xs italic text-gold-light/70 leading-relaxed">{lt(a.quote as LocaleText, locale)}</p>
                  </blockquote>
                )}
              </motion.div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 3: Timeline ═══ */}
        <LessonSection number={3} title={t('s3Title')} variant="highlight">
          <div className="relative pl-6 sm:pl-8">
            {/* Vertical line */}
            <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-primary/40 via-gold-primary/20 to-transparent" />
            <div className="space-y-5">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className={`absolute -left-[18px] sm:-left-[22px] top-1.5 w-3 h-3 rounded-full ${item.color} ring-2 ring-[#0a0e27]`} />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-xs font-mono text-gold-primary/80 font-bold min-w-[90px]">{item.year}</span>
                    <span className="text-sm font-semibold text-gold-light">{lt(item.text as LocaleText, locale)}</span>
                    <span className="text-xs text-text-secondary/70 hidden sm:inline">—</span>
                    <span className="text-xs text-text-secondary/75">{lt(item.detail as LocaleText, locale)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-text-secondary/70 text-xs mt-6 italic text-center">
            {hi ? '3,000 वर्षों का निरन्तर खगोलीय अन्वेषण — विश्व में अद्वितीय।' : '3,000 years of continuous astronomical investigation — unmatched anywhere in the world.'}
          </p>
        </LessonSection>

        {/* ═══ SECTION 4: India Knew First ═══ */}
        <LessonSection number={4} title={t('s4Title')}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-2 text-gold-primary/70 font-semibold">{hi ? 'अवधारणा' : 'Concept'}</th>
                  <th className="text-left py-2 px-2 text-amber-400/70 font-semibold">{hi ? 'भारत' : 'India'}</th>
                  <th className="text-left py-2 px-2 text-blue-400/70 font-semibold">{hi ? 'पश्चिम' : 'West'}</th>
                  <th className="text-right py-2 px-2 text-emerald-400/70 font-semibold">{hi ? 'अन्तर' : 'Gap'}</th>
                </tr>
              </thead>
              <tbody>
                {PRIORITY_TABLE.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="border-b border-white/[0.04] hover:bg-gold-primary/[0.03] transition-colors"
                  >
                    <td className="py-2.5 px-2 text-gold-light font-medium">{lt(row.concept as LocaleText, locale)}</td>
                    <td className="py-2.5 px-2 text-amber-300/80">{row.india}</td>
                    <td className="py-2.5 px-2 text-text-secondary/75">{row.west}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-emerald-400/80">{row.gap}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sine etymology highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-xl border border-gold-primary/20 bg-gradient-to-r from-gold-primary/[0.06] to-transparent p-5 text-center"
          >
            <Globe className="w-6 h-6 text-gold-primary/60 mx-auto mb-2" />
            <p className="text-sm text-gold-light/90 font-medium max-w-lg mx-auto leading-relaxed">
              {hi
                ? 'शब्द यात्रा: अर्ध-ज्या → ज्या → अरबी "जीब" → लैटिन "sinus" → अंग्रेज़ी "sine"। हर बार जब कोई "sine" कहता है, वह संस्कृत बोल रहा है।'
                : 'Word journey: ardha-jya \u2192 jya \u2192 Arabic "jiba" \u2192 Latin "sinus" \u2192 English "sine." Every time anyone says "sine," they are speaking Sanskrit.'}
            </p>
          </motion.div>
        </LessonSection>

        {/* ═══ SECTION 5: Transmission Chain ═══ */}
        <LessonSection number={5} title={t('s5Title')}>
          <p className="text-text-secondary/70 text-sm mb-5 leading-relaxed">
            {hi
              ? 'भारतीय गणित और खगोल विज्ञान अरब विद्वानों के माध्यम से यूरोप तक कैसे पहुँचा — यह ज्ञान की सबसे महत्वपूर्ण यात्रा है।'
              : 'How Indian mathematics and astronomy reached Europe through Arab scholars — one of the most consequential knowledge transfers in human history.'}
          </p>

          {/* Flow diagram */}
          <div className="flex flex-col items-center gap-0">
            {[
              {
                icon: <Sparkles className="w-5 h-5 text-amber-400" />,
                title: { en: 'Indian Mathematicians', hi: 'भारतीय गणितज्ञ', sa: 'भारतीय गणितज्ञ', mai: 'भारतीय गणितज्ञ', mr: 'भारतीय गणितज्ञ', ta: 'இந்திய கணிதவியலாளர்கள்', te: 'భారతీయ గణితశాస్త్రజ్ఞులు', bn: 'ভারতীয় গণিতবিদগণ', kn: 'ಭಾರತೀಯ ಗಣಿತಜ್ಞರು', gu: 'ભારતીય ગણિતશાસ્ત્રીઓ' },
                detail: { en: 'Aryabhata, Brahmagupta, Bhaskara — decimal system, zero, algebra, trigonometry, astronomy', hi: 'आर्यभट, ब्रह्मगुप्त, भास्कर — दशमलव, शून्य, बीजगणित, त्रिकोणमिति, खगोल', sa: 'आर्यभट, ब्रह्मगुप्त, भास्कर — दशमलव, शून्य, बीजगणित, त्रिकोणमिति, खगोल', mai: 'आर्यभट, ब्रह्मगुप्त, भास्कर — दशमलव, शून्य, बीजगणित, त्रिकोणमिति, खगोल', mr: 'आर्यभट, ब्रह्मगुप्त, भास्कर — दशमलव, शून्य, बीजगणित, त्रिकोणमिति, खगोल', ta: 'Aryabhata, Brahmagupta, Bhaskara — decimal system, zero, algebra, trigonometry, astronomy', te: 'Aryabhata, Brahmagupta, Bhaskara — decimal system, zero, algebra, trigonometry, astronomy', bn: 'Aryabhata, Brahmagupta, Bhaskara — decimal system, zero, algebra, trigonometry, astronomy', kn: 'Aryabhata, Brahmagupta, Bhaskara — decimal system, zero, algebra, trigonometry, astronomy', gu: 'Aryabhata, Brahmagupta, Bhaskara — decimal system, zero, algebra, trigonometry, astronomy' },
                color: 'border-amber-500/30 bg-amber-500/[0.06]',
              },
              {
                icon: <Route className="w-5 h-5 text-emerald-400" />,
                title: { en: 'Arabic Scholars (8th-11th c.)', hi: 'अरब विद्वान (8वीं-11वीं सदी)', sa: 'अरब विद्वान (8वीं-11वीं सदी)', mai: 'अरब विद्वान (8वीं-11वीं सदी)', mr: 'अरब विद्वान (8वीं-11वीं सदी)', ta: 'அரபு அறிஞர்கள் (8-11 நூற்.)', te: 'అరబ్బు పండితులు (8-11 శ.)', bn: 'আরব পণ্ডিতগণ (৮ম-১১শ শ.)', kn: 'ಅರಬ್ ವಿದ್ವಾಂಸರು (8-11 ಶ.)', gu: 'અરબી વિદ્વાનો (8-11 સદી)' },
                detail: { en: 'Al-Khwarizmi learned from Indian texts — his name gave us "algorithm." Al-Biruni (1030 CE) traveled to India, wrote Tarikh al-Hind.', hi: 'अल-ख़्वारिज़्मी ने भारतीय ग्रन्थों से सीखा — उनके नाम से "algorithm" बना। अल-बिरूनी (1030 ई.) ने भारत यात्रा की, तारीख़-उल-हिन्द लिखी।', sa: 'अल-ख़्वारिज़्मी ने भारतीय ग्रन्थों से सीखा — उनके नाम से "algorithm" बना। अल-बिरूनी (1030 ई.) ने भारत यात्रा की, तारीख़-उल-हिन्द लिखी।', mai: 'अल-ख़्वारिज़्मी ने भारतीय ग्रन्थों से सीखा — उनके नाम से "algorithm" बना। अल-बिरूनी (1030 ई.) ने भारत यात्रा की, तारीख़-उल-हिन्द लिखी।', mr: 'अल-ख़्वारिज़्मी ने भारतीय ग्रन्थों से सीखा — उनके नाम से "algorithm" बना। अल-बिरूनी (1030 ई.) ने भारत यात्रा की, तारीख़-उल-हिन्द लिखी।', ta: 'Al-Khwarizmi learned from Indian texts — his name gave us "algorithm." Al-Biruni (1030 CE) traveled to India, wrote Tarikh al-Hind.', te: 'Al-Khwarizmi learned from Indian texts — his name gave us "algorithm." Al-Biruni (1030 CE) traveled to India, wrote Tarikh al-Hind.', bn: 'Al-Khwarizmi learned from Indian texts — his name gave us "algorithm." Al-Biruni (1030 CE) traveled to India, wrote Tarikh al-Hind.', kn: 'Al-Khwarizmi learned from Indian texts — his name gave us "algorithm." Al-Biruni (1030 CE) traveled to India, wrote Tarikh al-Hind.', gu: 'Al-Khwarizmi learned from Indian texts — his name gave us "algorithm." Al-Biruni (1030 CE) traveled to India, wrote Tarikh al-Hind.' },
                color: 'border-emerald-500/30 bg-emerald-500/[0.06]',
              },
              {
                icon: <Globe className="w-5 h-5 text-blue-400" />,
                title: { en: 'Medieval Europe (12th-13th c.)', hi: 'मध्यकालीन यूरोप (12वीं-13वीं सदी)', sa: 'मध्यकालीन यूरोप (12वीं-13वीं सदी)', mai: 'मध्यकालीन यूरोप (12वीं-13वीं सदी)', mr: 'मध्यकालीन यूरोप (12वीं-13वीं सदी)', ta: 'மத்தியகால ஐரோப்பா (12-13 நூற்.)', te: 'మధ్యయుగ యూరప్ (12-13 శ.)', bn: 'মধ্যযুগীয় ইউরোপ (১২-১৩শ শ.)', kn: 'ಮಧ್ಯಯುಗೀಯ ಯುರೋಪ್ (12-13 ಶ.)', gu: 'મધ્યયુગીન યુરોપ (12-13 સદી)' },
                detail: { en: 'Fibonacci\'s Liber Abaci (1202) introduced "Arabic" numerals — which were Indian numerals transmitted via Arabia. Europe finally abandoned Roman numerals.', hi: 'फ़िबोनाची की लिबेर अबाची (1202) ने "अरबी" अंक प्रस्तुत किए — जो वास्तव में अरब के माध्यम से आए भारतीय अंक थे।' },
                color: 'border-blue-500/30 bg-blue-500/[0.06]',
              },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="w-full">
                {i > 0 && (
                  <div className="flex justify-center py-2">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-gold-primary/40 to-gold-primary/10" />
                  </div>
                )}
                <div className={`rounded-xl border ${step.color} p-4 sm:p-5`}>
                  <div className="flex items-center gap-3 mb-2">
                    {step.icon}
                    <h4 className="font-bold text-sm sm:text-base text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>{lt(step.title as LocaleText, locale)}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary/75 leading-relaxed pl-8">{lt(step.detail as LocaleText, locale)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 rounded-xl border border-gold-primary/20 bg-gradient-to-r from-gold-primary/[0.06] to-transparent p-5"
          >
            <p className="text-sm text-gold-light/90 font-medium text-center leading-relaxed">
              {hi
                ? '"Arabic numerals" = भारतीय अंक जो अरब के रास्ते गए। "Algorithm" = अल-ख़्वारिज़्मी = जिन्होंने भारतीय गणितज्ञों से सीखा। आधुनिक गणित की नींव भारत में रखी गई।'
                : '"Arabic numerals" are Indian numerals transmitted via Arabia. "Algorithm" comes from Al-Khwarizmi — who learned from Indian mathematicians. The foundations of modern mathematics were laid in India.'}
            </p>
          </motion.div>
        </LessonSection>

        {/* ═══ SANSKRIT TERMS ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <h3 className="text-xl font-bold text-gold-gradient mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {hi ? 'संस्कृत शब्दावली' : 'Sanskrit Terminology'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <SanskritTermCard term="Vedanga" devanagari="वेदाङ्ग" transliteration="Vedanga" meaning={hi ? 'वेद का अंग' : 'Limb of the Veda'} />
            <SanskritTermCard term="Jyotisha" devanagari="ज्योतिष" transliteration="Jyotisha" meaning={hi ? 'प्रकाश/खगोल विद्या' : 'Light / Astronomy'} />
            <SanskritTermCard term="Siddhanta" devanagari="सिद्धान्त" transliteration="Siddhanta" meaning={hi ? 'सिद्ध सिद्धान्त' : 'Established doctrine'} />
            <SanskritTermCard term="Jya" devanagari="ज्या" transliteration="Jya" meaning={hi ? 'ज्या (Sine)' : 'Bowstring (Sine)'} />
            <SanskritTermCard term="Kuttaka" devanagari="कुट्टक" transliteration="Kuttaka" meaning={hi ? 'चूर्णक (एल्गोरिथ्म)' : 'Pulverizer (algorithm)'} />
            <SanskritTermCard term="Ayanamsha" devanagari="अयनांश" transliteration="Ayanamsha" meaning={hi ? 'अयन का अंश' : 'Precession offset'} />
          </div>
        </motion.section>

        {/* ═══ NAVIGATION ═══ */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6"
        >
          <h3 className="text-gold-light font-semibold text-sm uppercase tracking-wider mb-4">{t('exploreMore')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/learn/observatories' as const, label: { en: 'Jantar Mantar — Stone Observatories', hi: 'जन्तर मन्तर — पाषाण वेधशालाएँ', sa: 'जन्तर मन्तर — पाषाण वेधशालाएँ', mai: 'जन्तर मन्तर — पाषाण वेधशालाएँ', mr: 'जन्तर मन्तर — पाषाण वेधशालाएँ', ta: 'ஜந்தர் மந்தர் — கல் வான்காணகங்கள்', te: 'జంతర్ మంతర్ — రాతి వేధశాలలు', bn: 'যন্তর মন্তর — পাথরের মানমন্দির', kn: 'ಜಂತರ್ ಮಂತರ್ — ಕಲ್ಲಿನ ವೀಕ್ಷಣಾಲಯಗಳು', gu: 'જંતર મંતર — પથ્થરના વેધશાળાઓ' } },
              { href: '/learn/cosmology' as const, label: { en: 'Hindu Cosmological Time Scales', hi: 'हिन्दू ब्रह्माण्डीय कालमान', sa: 'हिन्दू ब्रह्माण्डीय कालमान', mai: 'हिन्दू ब्रह्माण्डीय कालमान', mr: 'हिन्दू ब्रह्माण्डीय कालमान', ta: 'இந்து பிரபஞ்ச கால அளவுகள்', te: 'హిందూ విశ్వ కాల ప్రమాణాలు', bn: 'হিন্দু মহাজাগতিক সময় মাপকাঠি', kn: 'ಹಿಂದೂ ವಿಶ್ವ ಕಾಲ ಮಾನಗಳು', gu: 'હિંદુ બ્રહ્માંડ સમય માપદંડો' } },
              { href: '/learn/classical-texts' as const, label: { en: 'Classical Astronomical Texts', hi: 'शास्त्रीय खगोलीय ग्रन्थ', sa: 'शास्त्रीय खगोलीय ग्रन्थ', mai: 'शास्त्रीय खगोलीय ग्रन्थ', mr: 'शास्त्रीय खगोलीय ग्रन्थ', ta: 'பாரம்பரிய வானியல் நூல்கள்', te: 'శాస్త్రీయ ఖగోళ గ్రంథాలు', bn: 'প্রাচীন জ্যোতির্বিদ্যা গ্রন্থ', kn: 'ಶಾಸ್ತ್ರೀಯ ಖಗೋಳ ಗ್ರಂಥಗಳು', gu: 'શાસ્ત્રીય ખગોળ ગ્રંથો' } },
              { href: '/learn/calculations' as const, label: { en: 'How We Calculate', hi: 'हम कैसे गणना करते हैं', sa: 'हम कैसे गणना करते हैं', mai: 'हम कैसे गणना करते हैं', mr: 'हम कैसे गणना करते हैं', ta: 'நாங்கள் எவ்வாறு கணக்கிடுகிறோம்', te: 'మేము ఎలా లెక్కిస్తాము', bn: 'আমরা কীভাবে গণনা করি', kn: 'ನಾವು ಹೇಗೆ ಲೆಕ್ಕ ಮಾಡುತ್ತೇವೆ', gu: 'અમે કેવી રીતે ગણતરી કરીએ છીએ' } },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center justify-between bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg px-4 py-3 hover:border-gold-primary/30 hover:bg-gold-primary/[0.04] transition-all group"
              >
                <span className="text-sm text-text-secondary group-hover:text-gold-light transition-colors">{lt(link.label as LocaleText, locale)}</span>
                <ArrowRight className="w-4 h-4 text-gold-primary/40 group-hover:text-gold-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.05]">
            <Link href="/learn" className="text-sm text-text-secondary/75 hover:text-gold-light transition-colors">
              &larr; {t('backToLearn')}
            </Link>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}
