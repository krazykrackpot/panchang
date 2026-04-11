'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Music, Heart, Flame, AlertTriangle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual Labels ──────────────────────────────────────────── */
const L = {
  title: { en: 'Complete Remedial Reference', hi: 'सम्पूर्ण उपचार संदर्भ', sa: 'सम्पूर्णोपचारसन्दर्भः' },
  subtitle: {
    en: 'Vedic remedies (Upayas) are prescribed actions to strengthen weak benefic planets or pacify strong malefic ones. This reference covers gemstones, mantras, charity, fasting, colors, and deities for all nine Grahas.',
    hi: 'वैदिक उपाय (उपचार) दुर्बल शुभ ग्रहों को सशक्त करने या प्रबल पाप ग्रहों को शान्त करने के लिए निर्धारित क्रियाएँ हैं। यह संदर्भ सभी नौ ग्रहों के लिए रत्न, मंत्र, दान, उपवास, रंग और देवता की जानकारी देता है।',
    sa: 'वैदिकोपायाः दुर्बलशुभग्रहाणां सशक्तीकरणाय प्रबलपापग्रहाणां शान्त्यर्थं वा निर्दिष्टक्रियाः। अयं सन्दर्भः नवग्रहाणां रत्नमन्त्रदानादीन् ददाति।'
  },
  selectPlanet: { en: 'Select a Graha to view remedies', hi: 'उपचार देखने के लिए ग्रह चुनें', sa: 'उपचारान् द्रष्टुं ग्रहं चिनुत' },
  gemstone: { en: 'Gemstone', hi: 'रत्न', sa: 'रत्नम्' },
  substitute: { en: 'Substitutes', hi: 'विकल्प', sa: 'विकल्पाः' },
  beejMantra: { en: 'Beej Mantra', hi: 'बीज मंत्र', sa: 'बीजमन्त्रः' },
  gayatri: { en: 'Gayatri', hi: 'गायत्री', sa: 'गायत्री' },
  deity: { en: 'Deity', hi: 'देवता', sa: 'देवता' },
  day: { en: 'Day', hi: 'दिन', sa: 'वासरः' },
  color: { en: 'Color', hi: 'रंग', sa: 'वर्णः' },
  fast: { en: 'Fast', hi: 'उपवास', sa: 'उपवासः' },
  charity: { en: 'Charity (Daan)', hi: 'दान', sa: 'दानम्' },
  direction: { en: 'Direction', hi: 'दिशा', sa: 'दिशा' },
  warning: { en: 'Warning', hi: 'चेतावनी', sa: 'चेतावनी' },
  repetitions: { en: 'Repetitions', hi: 'जाप संख्या', sa: 'जपसंख्या' },

  flowchartTitle: { en: 'Remedy Selection Flowchart', hi: 'उपचार चयन प्रवाहचित्र', sa: 'उपचारचयनप्रवाहचित्रम्' },
  flowchartSubtitle: {
    en: 'Not all planets should be strengthened. The decision depends on whether the planet is a functional benefic or malefic in your chart.',
    hi: 'सभी ग्रहों को सशक्त नहीं करना चाहिए। निर्णय इस बात पर निर्भर करता है कि ग्रह आपकी कुण्डली में कार्यात्मक शुभ है या पाप।',
    sa: 'सर्वे ग्रहाः न सशक्तीकर्तव्याः। निर्णयः ग्रहस्य कार्यात्मकशुभपापत्वे निर्भरति।'
  },

  strengthenTitle: { en: 'Strengthen', hi: 'सशक्त करें', sa: 'सशक्तीकरोतु' },
  strengthenDesc: {
    en: 'Gemstone, mantra for power, favorable colors, worship deity',
    hi: 'रत्न, शक्ति मंत्र, अनुकूल रंग, देवता पूजा',
    sa: 'रत्नम्, शक्तिमन्त्रः, अनुकूलवर्णाः, देवतापूजा'
  },
  pacifyTitle: { en: 'Pacify', hi: 'शान्त करें', sa: 'शमयतु' },
  pacifyDesc: {
    en: 'Donation, fasting, mantra for peace — DO NOT wear gemstone',
    hi: 'दान, उपवास, शान्ति मंत्र — रत्न न धारण करें',
    sa: 'दानम्, उपवासः, शान्तिमन्त्रः — रत्नं न धारयेत्'
  },

  q1: { en: 'Is the planet a functional benefic?', hi: 'क्या ग्रह कार्यात्मक शुभ है?', sa: 'किं ग्रहः कार्यात्मकशुभः?' },
  q1sub: { en: '(Rules kendra/trikona: 1,4,5,7,9,10)', hi: '(केन्द्र/त्रिकोण का स्वामी: 1,4,5,7,9,10)', sa: '(केन्द्रत्रिकोणस्वामी: 1,4,5,7,9,10)' },
  q2: { en: 'Is the planet a functional malefic?', hi: 'क्या ग्रह कार्यात्मक पाप है?', sa: 'किं ग्रहः कार्यात्मकपापः?' },
  q2sub: { en: '(Rules dusthana: 6,8,12)', hi: '(दुःस्थान का स्वामी: 6,8,12)', sa: '(दुःस्थानस्वामी: 6,8,12)' },
  yes: { en: 'YES', hi: 'हाँ', sa: 'आम्' },
  no: { en: 'NO', hi: 'नहीं', sa: 'न' },

  dontWorkTitle: { en: 'When Remedies Don\'t Work', hi: 'जब उपचार काम नहीं करते', sa: 'यदा उपचाराः न कार्यं कुर्वन्ति' },
  dontWork1: {
    en: 'Wrong gemstone for a malefic planet amplifies problems instead of solving them. A strong Saturn causing delays will delay even more if you wear Blue Sapphire without proper analysis.',
    hi: 'पाप ग्रह के लिए गलत रत्न समस्याओं को हल करने के बजाय बढ़ाता है। सही विश्लेषण के बिना नीलम पहनने से विलम्बकारी शनि और अधिक विलम्ब करेगा।',
    sa: 'पापग्रहस्य कृते अशुद्धरत्नं समस्याः वर्धयति न तु समाधत्ते।'
  },
  dontWork2: {
    en: 'Generic "wear your birthstone" advice ignores the functional nature of planets in your specific chart. Your birthstone planet might rule the 6th or 8th house — strengthening it would be counterproductive.',
    hi: '"अपना जन्मरत्न पहनें" जैसी सामान्य सलाह आपकी विशिष्ट कुण्डली में ग्रहों की कार्यात्मक प्रकृति की उपेक्षा करती है। आपका जन्मरत्न ग्रह 6वें या 8वें भाव का स्वामी हो सकता है।',
    sa: '"स्वजन्मरत्नं धारयत" इति सामान्यसलाहा विशिष्टकुण्डल्यां ग्रहाणां कार्यात्मकप्रकृतिम् उपेक्षते।'
  },
  dontWork3: {
    en: 'Remedies support effort, they don\'t replace it. A Saturn remedy for career won\'t give you a promotion if you\'re not doing the work. Jyotish remedies open doors; you still have to walk through them.',
    hi: 'उपचार प्रयास का समर्थन करते हैं, उसका स्थान नहीं लेते। शनि के करियर उपचार से पदोन्नति नहीं मिलेगी यदि आप काम नहीं कर रहे। ज्योतिष उपचार दरवाज़े खोलते हैं; चलना आपको ही है।',
    sa: 'उपचाराः प्रयत्नं समर्थयन्ति, न तु प्रतिस्थापयन्ति।'
  },

  relatedTitle: { en: 'Continue Learning', hi: 'आगे पढ़ें', sa: 'अग्रे पठत' },
};

/* ── Planet Remedy Data ─────────────────────────────────────────── */
interface PlanetRemedy {
  id: string;
  name: { en: string; hi: string; sa: string };
  color: string;
  btnColor: string;
  gemstone: { en: string; hi: string; sa: string };
  gemstoneSpec: { en: string; hi: string; sa: string };
  substitute: { en: string; hi: string; sa: string };
  beejMantra: string;
  repetitions: string;
  gayatri?: string;
  deity: { en: string; hi: string; sa: string };
  day: { en: string; hi: string; sa: string };
  color_val: { en: string; hi: string; sa: string };
  fast: { en: string; hi: string; sa: string };
  charity: { en: string; hi: string; sa: string };
  direction?: { en: string; hi: string; sa: string };
  warning?: { en: string; hi: string; sa: string };
}

const PLANET_REMEDIES: PlanetRemedy[] = [
  {
    id: 'sun', name: { en: 'Sun (Surya)', hi: 'सूर्य', sa: 'सूर्यः' },
    color: '#f97316', btnColor: 'border-orange-500/40 bg-orange-500/10',
    gemstone: { en: 'Ruby (Manikya)', hi: 'माणिक्य (रूबी)', sa: 'माणिक्यम् (रूबी)' },
    gemstoneSpec: { en: '3+ carats, gold ring, ring finger, wear on Sunday at sunrise', hi: '3+ कैरेट, स्वर्ण अंगूठी, अनामिका, रविवार सूर्योदय पर धारण', sa: '3+ कैरट्, स्वर्णाङ्गुलीयकम्, अनामिकायाम्, रविवासरे सूर्योदये धारयेत्' },
    substitute: { en: 'Red Garnet, Red Spinel', hi: 'लाल गार्नेट, लाल स्पिनल', sa: 'रक्तगार्नेट्, रक्तस्पिनेल्' },
    beejMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    repetitions: '7,000',
    gayatri: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
    deity: { en: 'Surya Dev', hi: 'सूर्य देव', sa: 'सूर्यदेवः' },
    day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' },
    color_val: { en: 'Red, Orange, Saffron', hi: 'लाल, नारंगी, केसरी', sa: 'रक्तः, नारङ्गः, कुङ्कुमवर्णः' },
    fast: { en: 'Sunday — single meal, no salt', hi: 'रविवार — एक भोजन, नमक रहित', sa: 'रविवासरे — एकभोजनम्, लवणरहितम्' },
    charity: { en: 'Wheat, jaggery, red cloth, copper — to father figure, on Sunday before sunset', hi: 'गेहूँ, गुड़, लाल वस्त्र, ताम्बा — पितृ तुल्य व्यक्ति को, रविवार सूर्यास्त से पूर्व', sa: 'गोधूमः, गुडः, रक्तवस्त्रम्, ताम्रम् — पितृतुल्यव्यक्तये, रविवासरे सूर्यास्तात् पूर्वम्' },
    direction: { en: 'East', hi: 'पूर्व', sa: 'प्राची' },
  },
  {
    id: 'moon', name: { en: 'Moon (Chandra)', hi: 'चन्द्र', sa: 'चन्द्रः' },
    color: '#e2e8f0', btnColor: 'border-slate-300/40 bg-slate-300/10',
    gemstone: { en: 'Pearl (Moti)', hi: 'मोती (पर्ल)', sa: 'मुक्ता (पर्ल्)' },
    gemstoneSpec: { en: '5+ carats, silver ring, little finger, wear on Monday', hi: '5+ कैरेट, चाँदी अंगूठी, कनिष्ठा, सोमवार को धारण', sa: '5+ कैरट्, रजताङ्गुलीयकम्, कनिष्ठिकायाम्, सोमवासरे धारयेत्' },
    substitute: { en: 'Moonstone', hi: 'मूनस्टोन', sa: 'चन्द्रकान्तमणिः' },
    beejMantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
    repetitions: '11,000',
    deity: { en: 'Shiva (Soma aspect)', hi: 'शिव (सोम स्वरूप)', sa: 'शिवः (सोमस्वरूपः)' },
    day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' },
    color_val: { en: 'White, Silver', hi: 'सफ़ेद, चाँदी', sa: 'श्वेतः, रजतवर्णः' },
    fast: { en: 'Monday — milk and fruit diet', hi: 'सोमवार — दूध और फलाहार', sa: 'सोमवासरे — दुग्धफलाहारः' },
    charity: { en: 'Rice, milk, white cloth, silver — to mother figure, on Monday evening', hi: 'चावल, दूध, सफ़ेद वस्त्र, चाँदी — मातृ तुल्य व्यक्ति को, सोमवार सायं', sa: 'तण्डुलाः, दुग्धम्, श्वेतवस्त्रम्, रजतम् — मातृतुल्यव्यक्तये, सोमवासरे सायम्' },
    direction: { en: 'Northwest', hi: 'वायव्य', sa: 'वायव्यदिशा' },
  },
  {
    id: 'mars', name: { en: 'Mars (Mangal)', hi: 'मंगल', sa: 'मङ्गलः' },
    color: '#ef4444', btnColor: 'border-red-500/40 bg-red-500/10',
    gemstone: { en: 'Red Coral (Moonga)', hi: 'मूंगा (रेड कोरल)', sa: 'प्रवालम् (रक्तप्रवालम्)' },
    gemstoneSpec: { en: '6+ carats, gold or copper, ring finger, wear on Tuesday', hi: '6+ कैरेट, स्वर्ण या ताम्बा, अनामिका, मंगलवार को धारण', sa: '6+ कैरट्, स्वर्णं ताम्रं वा, अनामिकायाम्, मङ्गलवासरे धारयेत्' },
    substitute: { en: 'Red Carnelian, Red Jasper', hi: 'लाल कार्नेलियन, लाल जैस्पर', sa: 'रक्तकार्नेलियन्, रक्तजैस्पर्' },
    beejMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    repetitions: '10,000',
    deity: { en: 'Hanuman, Kartikeya', hi: 'हनुमान, कार्तिकेय', sa: 'हनुमान्, कार्तिकेयः' },
    day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' },
    color_val: { en: 'Red', hi: 'लाल', sa: 'रक्तवर्णः' },
    fast: { en: 'Tuesday — avoid non-veg, sweet foods', hi: 'मंगलवार — माँसाहार वर्जित, मीठा भोजन', sa: 'मङ्गलवासरे — मांसाहारवर्जनम्' },
    charity: { en: 'Red lentils (masoor dal), jaggery, red cloth — on Tuesday to young men', hi: 'लाल मसूर दाल, गुड़, लाल वस्त्र — मंगलवार को युवकों को', sa: 'रक्तमसूरदालम्, गुडः, रक्तवस्त्रम् — मङ्गलवासरे युवभ्यः' },
    direction: { en: 'South', hi: 'दक्षिण', sa: 'दक्षिणा' },
  },
  {
    id: 'mercury', name: { en: 'Mercury (Budha)', hi: 'बुध', sa: 'बुधः' },
    color: '#34d399', btnColor: 'border-emerald-500/40 bg-emerald-500/10',
    gemstone: { en: 'Emerald (Panna)', hi: 'पन्ना (एमरल्ड)', sa: 'मरकतम् (पन्ना)' },
    gemstoneSpec: { en: '3+ carats, gold, little finger, wear on Wednesday', hi: '3+ कैरेट, स्वर्ण, कनिष्ठा, बुधवार को धारण', sa: '3+ कैरट्, स्वर्णम्, कनिष्ठिकायाम्, बुधवासरे धारयेत्' },
    substitute: { en: 'Green Tourmaline, Peridot', hi: 'हरा टूरमलीन, पेरीडॉट', sa: 'हरिततूरमलीन्, पेरिडॉट्' },
    beejMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    repetitions: '9,000',
    deity: { en: 'Vishnu', hi: 'विष्णु', sa: 'विष्णुः' },
    day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' },
    color_val: { en: 'Green', hi: 'हरा', sa: 'हरितवर्णः' },
    fast: { en: 'Wednesday — green vegetable diet', hi: 'बुधवार — हरी सब्ज़ियों का आहार', sa: 'बुधवासरे — हरितशाकाहारः' },
    charity: { en: 'Green moong dal, green cloth — on Wednesday to students', hi: 'हरी मूंग दाल, हरा वस्त्र — बुधवार को विद्यार्थियों को', sa: 'हरितमूङ्गदालम्, हरितवस्त्रम् — बुधवासरे विद्यार्थिभ्यः' },
    direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरा' },
  },
  {
    id: 'jupiter', name: { en: 'Jupiter (Guru)', hi: 'बृहस्पति (गुरु)', sa: 'बृहस्पतिः (गुरुः)' },
    color: '#facc15', btnColor: 'border-yellow-500/40 bg-yellow-500/10',
    gemstone: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज (येलो सैफ़ायर)', sa: 'पुष्यरागः (पीतनीलम्)' },
    gemstoneSpec: { en: '3+ carats, gold, index finger, wear on Thursday', hi: '3+ कैरेट, स्वर्ण, तर्जनी, गुरुवार को धारण', sa: '3+ कैरट्, स्वर्णम्, तर्जन्याम्, गुरुवासरे धारयेत्' },
    substitute: { en: 'Yellow Topaz, Citrine', hi: 'पीला टोपाज़, सिट्रीन', sa: 'पीतटोपाज़्, सिट्रीन्' },
    beejMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    repetitions: '19,000',
    deity: { en: 'Brihaspati, Dakshinamurthy', hi: 'बृहस्पति, दक्षिणामूर्ति', sa: 'बृहस्पतिः, दक्षिणामूर्तिः' },
    day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' },
    color_val: { en: 'Yellow', hi: 'पीला', sa: 'पीतवर्णः' },
    fast: { en: 'Thursday — banana and chana dal diet', hi: 'गुरुवार — केला और चने की दाल', sa: 'गुरुवासरे — कदलीचणकदालाहारः' },
    charity: { en: 'Yellow items, turmeric, gram dal, banana — on Thursday to Brahmins/teachers', hi: 'पीली वस्तुएं, हल्दी, चने की दाल, केला — गुरुवार को ब्राह्मणों/शिक्षकों को', sa: 'पीतवस्तूनि, हरिद्रा, चणकदालम्, कदली — गुरुवासरे ब्राह्मणेभ्यः/शिक्षकेभ्यः' },
    direction: { en: 'Northeast', hi: 'ईशान', sa: 'ईशानदिशा' },
  },
  {
    id: 'venus', name: { en: 'Venus (Shukra)', hi: 'शुक्र', sa: 'शुक्रः' },
    color: '#f0abfc', btnColor: 'border-fuchsia-400/40 bg-fuchsia-400/10',
    gemstone: { en: 'Diamond (Heera)', hi: 'हीरा (डायमंड)', sa: 'वज्रम् (हीरा)' },
    gemstoneSpec: { en: '1+ carat, platinum or white gold, middle finger, wear on Friday', hi: '1+ कैरेट, प्लैटिनम या श्वेत स्वर्ण, मध्यमा, शुक्रवार को धारण', sa: '1+ कैरट्, प्लैटिनम् श्वेतस्वर्णं वा, मध्यमायाम्, शुक्रवासरे धारयेत्' },
    substitute: { en: 'White Sapphire, Zircon', hi: 'श्वेत नीलम, ज़िरकॉन', sa: 'श्वेतनीलम्, ज़िर्कॉन्' },
    beejMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    repetitions: '16,000',
    deity: { en: 'Lakshmi', hi: 'लक्ष्मी', sa: 'लक्ष्मीः' },
    day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' },
    color_val: { en: 'White, Pastel', hi: 'सफ़ेद, पेस्टल', sa: 'श्वेतः, मन्दवर्णः' },
    fast: { en: 'Friday — sweet rice or kheer diet', hi: 'शुक्रवार — मीठे चावल या खीर', sa: 'शुक्रवासरे — मधुरान्नं पायसं वा' },
    charity: { en: 'Rice, sugar, white clothes, silver — on Friday to women', hi: 'चावल, शक्कर, सफ़ेद वस्त्र, चाँदी — शुक्रवार को महिलाओं को', sa: 'तण्डुलाः, शर्करा, श्वेतवस्त्राणि, रजतम् — शुक्रवासरे स्त्रीभ्यः' },
    direction: { en: 'Southeast', hi: 'आग्नेय', sa: 'आग्नेयदिशा' },
  },
  {
    id: 'saturn', name: { en: 'Saturn (Shani)', hi: 'शनि', sa: 'शनिः' },
    color: '#60a5fa', btnColor: 'border-blue-500/40 bg-blue-500/10',
    gemstone: { en: 'Blue Sapphire (Neelam)', hi: 'नीलम (ब्लू सैफ़ायर)', sa: 'नीलम् (इन्द्रनीलम्)' },
    gemstoneSpec: { en: '3+ carats, silver or pancha-dhatu, middle finger, wear on Saturday', hi: '3+ कैरेट, चाँदी या पंचधातु, मध्यमा, शनिवार को धारण', sa: '3+ कैरट्, रजतं पञ्चधातुं वा, मध्यमायाम्, शनिवासरे धारयेत्' },
    substitute: { en: 'Amethyst, Iolite', hi: 'अमेथिस्ट, आयोलाइट', sa: 'अमेथिस्ट्, आयोलाइट्' },
    beejMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    repetitions: '23,000',
    deity: { en: 'Shani Dev, Hanuman', hi: 'शनि देव, हनुमान', sa: 'शनिदेवः, हनुमान्' },
    day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
    color_val: { en: 'Black, Dark Blue, Violet', hi: 'काला, गहरा नीला, बैंगनी', sa: 'कृष्णः, गाढनीलः, नीललोहितः' },
    fast: { en: 'Saturday — sesame and mustard oil based diet', hi: 'शनिवार — तिल और सरसों तेल आधारित भोजन', sa: 'शनिवासरे — तिलसर्षपतैलाधारितभोजनम्' },
    charity: { en: 'Mustard oil, black sesame, iron tools, black cloth — on Saturday to laborers/servants', hi: 'सरसों तेल, काले तिल, लोहे के उपकरण, काला वस्त्र — शनिवार को श्रमिकों/सेवकों को', sa: 'सर्षपतैलम्, कृष्णतिलाः, लोहोपकरणानि, कृष्णवस्त्रम् — शनिवासरे श्रमिकेभ्यः' },
    direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमा' },
    warning: {
      en: 'MUST do a 7-day trial before wearing permanently. An incompatible Blue Sapphire can cause severe harm — accidents, financial loss, health issues. Test by keeping the stone under your pillow for 7 nights. If you have nightmares or bad events, do NOT wear it.',
      hi: 'स्थायी रूप से पहनने से पहले 7 दिन का परीक्षण अनिवार्य। असंगत नीलम गम्भीर हानि पहुँचा सकता है — दुर्घटना, आर्थिक हानि, स्वास्थ्य समस्या। 7 रात तकिये के नीचे रखकर परीक्षण करें। बुरे सपने या दुर्घटना हो तो न पहनें।',
      sa: 'स्थायिधारणात् पूर्वं 7-दिवसपरीक्षणम् अनिवार्यम्। असंगतनीलं गम्भीरहानिं कर्तुं शक्नोति।'
    },
  },
  {
    id: 'rahu', name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
    color: '#a78bfa', btnColor: 'border-violet-500/40 bg-violet-500/10',
    gemstone: { en: 'Hessonite (Gomed)', hi: 'गोमेद (हेसोनाइट)', sa: 'गोमेदः (हेसोनाइट्)' },
    gemstoneSpec: { en: '5+ carats, silver, middle finger, wear on Saturday during Rahu Kaal', hi: '5+ कैरेट, चाँदी, मध्यमा, शनिवार राहु काल में धारण', sa: '5+ कैरट्, रजतम्, मध्यमायाम्, शनिवासरे राहुकाले धारयेत्' },
    substitute: { en: 'Orange Zircon', hi: 'नारंगी ज़िरकॉन', sa: 'नारङ्गज़िर्कॉन्' },
    beejMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    repetitions: '18,000',
    deity: { en: 'Durga, Saraswati', hi: 'दुर्गा, सरस्वती', sa: 'दुर्गा, सरस्वती' },
    day: { en: 'Saturday (Rahu Kaal)', hi: 'शनिवार (राहु काल)', sa: 'शनिवासरः (राहुकालः)' },
    color_val: { en: 'Grey, Smoke', hi: 'स्लेटी, धुँआ', sa: 'धूम्रवर्णः' },
    fast: { en: 'Saturday — avoid non-veg, alcohol', hi: 'शनिवार — माँसाहार, मद्य वर्जित', sa: 'शनिवासरे — मांसमद्यवर्जनम्' },
    charity: { en: 'Blue cloth, sesame, coconut — to outcasts / underprivileged, on Saturday', hi: 'नीला वस्त्र, तिल, नारियल — वंचितों/दलितों को, शनिवार', sa: 'नीलवस्त्रम्, तिलाः, नारिकेलम् — वञ्चितेभ्यः, शनिवासरे' },
  },
  {
    id: 'ketu', name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
    color: '#c084fc', btnColor: 'border-purple-400/40 bg-purple-400/10',
    gemstone: { en: 'Cat\'s Eye (Lehsunia / Vaidurya)', hi: 'लहसुनिया (कैट्स आई / वैदूर्य)', sa: 'वैदूर्यम् (लहसुनिया)' },
    gemstoneSpec: { en: '3+ carats, silver, little finger, wear on Thursday or Tuesday', hi: '3+ कैरेट, चाँदी, कनिष्ठा, गुरुवार या मंगलवार को धारण', sa: '3+ कैरट्, रजतम्, कनिष्ठिकायाम्, गुरुवासरे मङ्गलवासरे वा धारयेत्' },
    substitute: { en: 'Tiger\'s Eye', hi: 'टाइगर्स आई', sa: 'व्याघ्रनेत्रम्' },
    beejMantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    repetitions: '17,000',
    deity: { en: 'Ganesha', hi: 'गणेश', sa: 'गणेशः' },
    day: { en: 'Thursday / Tuesday', hi: 'गुरुवार / मंगलवार', sa: 'गुरुवासरः / मङ्गलवासरः' },
    color_val: { en: 'Grey, Multicolored', hi: 'स्लेटी, बहुरंगी', sa: 'धूम्रवर्णः, बहुवर्णः' },
    fast: { en: 'Tuesday or Thursday — simple vegetarian', hi: 'मंगलवार या गुरुवार — सादा शाकाहार', sa: 'मङ्गलवासरे गुरुवासरे वा — सादशाकाहारः' },
    charity: { en: 'Blanket, multi-colored cloth, seven grains — to monks / sadhus', hi: 'कम्बल, बहुरंगी वस्त्र, सप्तान्न — साधुओं/सन्यासियों को', sa: 'कम्बलम्, बहुवर्णवस्त्रम्, सप्तधान्यम् — साधुभ्यः/संन्यासिभ्यः' },
  },
];

const RELATED_LINKS = [
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएं', sa: 'स्वकुण्डलीं रचयत' } },
  { href: '/learn/doshas', label: { en: 'Learn: Doshas & Afflictions', hi: 'पढ़ें: दोष', sa: 'पठत: दोषाः' } },
  { href: '/learn/grahas', label: { en: 'Learn: The Nine Planets', hi: 'पढ़ें: नवग्रह', sa: 'पठत: नवग्रहाः' } },
];

/* ── Remedy Detail Card ───────────────────────────────────────── */
function RemedyCard({ planet, locale }: { planet: PlanetRemedy; locale: Locale }) {
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const rows: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }[] = [
    { icon: <Gem className="w-4 h-4" />, label: L.gemstone[locale], value: `${planet.gemstone[locale]} — ${planet.gemstoneSpec[locale]}` },
    ...(planet.substitute[locale] ? [{ icon: <Sparkles className="w-4 h-4" />, label: L.substitute[locale], value: planet.substitute[locale] }] : []),
    { icon: <Music className="w-4 h-4" />, label: L.beejMantra[locale], value: planet.beejMantra, highlight: true },
    { icon: <span className="text-xs font-bold w-4 text-center">#</span>, label: L.repetitions[locale], value: planet.repetitions },
    ...(planet.gayatri ? [{ icon: <Music className="w-4 h-4" />, label: L.gayatri[locale], value: planet.gayatri, highlight: true }] : []),
    { icon: <Flame className="w-4 h-4" />, label: L.deity[locale], value: planet.deity[locale] },
    { icon: <span className="text-xs">D</span>, label: L.day[locale], value: planet.day[locale] },
    { icon: <span className="w-3 h-3 rounded-full" style={{ backgroundColor: planet.color, display: 'inline-block' }} />, label: L.color[locale], value: planet.color_val[locale] },
    { icon: <span className="text-xs">V</span>, label: L.fast[locale], value: planet.fast[locale] },
    { icon: <Heart className="w-4 h-4" />, label: L.charity[locale], value: planet.charity[locale] },
    ...(planet.direction ? [{ icon: <span className="text-xs">N</span>, label: L.direction[locale], value: planet.direction[locale] }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border p-5 sm:p-6"
      style={{ borderColor: planet.color + '25', backgroundColor: planet.color + '05' }}
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: planet.color, ...headingFont }}>
        {planet.name[locale]}
      </h3>

      {/* Warning for Saturn */}
      {planet.warning && (
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/8 p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">{L.warning[locale]}</span>
            <p className="text-text-secondary text-sm leading-relaxed mt-1" style={bodyFont}>{planet.warning[locale]}</p>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {rows.map((row, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-lg p-2.5 ${
            row.highlight ? 'bg-white/3 border border-white/5' : ''
          }`}>
            <span className="text-gold-light/60 mt-0.5 flex-shrink-0">{row.icon}</span>
            <div className="min-w-0">
              <span className="text-xs uppercase tracking-wider text-text-secondary/75 block" style={bodyFont}>{row.label}</span>
              <span className={`text-sm ${row.highlight ? 'text-gold-light font-medium' : 'text-text-secondary'}`} style={bodyFont}>
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Flowchart SVG ────────────────────────────────────────────── */
function FlowchartDiagram({ locale }: { locale: Locale }) {
  const bodyFont = locale !== 'en' ? 'var(--font-devanagari-body)' : 'inherit';
  return (
    <svg viewBox="0 0 500 320" className="w-full max-w-[500px] mx-auto">
      <defs>
        <filter id="fcGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Question 1 box */}
      <rect x="100" y="10" width="300" height="50" rx="12" fill="#1a1f4e" stroke="#d4a85340" strokeWidth="1" />
      <text x="250" y="30" textAnchor="middle" fill="#d4a853" fontSize="11" fontWeight="bold" fontFamily={bodyFont}>
        {L.q1[locale]}
      </text>
      <text x="250" y="48" textAnchor="middle" fill="#8b8fa3" fontSize="9" fontFamily={bodyFont}>
        {L.q1sub[locale]}
      </text>

      {/* YES arrow left */}
      <line x1="180" y1="60" x2="100" y2="120" stroke="#34d399" strokeWidth="1.5" />
      <text x="120" y="88" fill="#34d399" fontSize="10" fontWeight="bold">{L.yes[locale]}</text>

      {/* NO arrow right */}
      <line x1="320" y1="60" x2="400" y2="120" stroke="#ef4444" strokeWidth="1.5" />
      <text x="370" y="88" fill="#ef4444" fontSize="10" fontWeight="bold">{L.no[locale]}</text>

      {/* Strengthen box (left) */}
      <rect x="15" y="120" width="170" height="70" rx="12" fill="#34d39910" stroke="#34d39940" strokeWidth="1" />
      <text x="100" y="142" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily={bodyFont}>
        {L.strengthenTitle[locale]}
      </text>
      <text x="100" y="158" textAnchor="middle" fill="#8b8fa3" fontSize="8" fontFamily={bodyFont}>
        {locale === 'en' || String(locale) === 'ta' ? 'Gemstone, mantra for power,' : locale === 'hi' ? 'रत्न, शक्ति मंत्र,' : 'रत्नम्, शक्तिमन्त्रः,'}
      </text>
      <text x="100" y="170" textAnchor="middle" fill="#8b8fa3" fontSize="8" fontFamily={bodyFont}>
        {locale === 'en' || String(locale) === 'ta' ? 'favorable colors, worship deity' : locale === 'hi' ? 'अनुकूल रंग, देवता पूजा' : 'अनुकूलवर्णाः, देवतापूजा'}
      </text>

      {/* Question 2 box (right) */}
      <rect x="315" y="120" width="170" height="50" rx="12" fill="#1a1f4e" stroke="#d4a85340" strokeWidth="1" />
      <text x="400" y="140" textAnchor="middle" fill="#d4a853" fontSize="10" fontWeight="bold" fontFamily={bodyFont}>
        {L.q2[locale]}
      </text>
      <text x="400" y="156" textAnchor="middle" fill="#8b8fa3" fontSize="8" fontFamily={bodyFont}>
        {L.q2sub[locale]}
      </text>

      {/* YES arrow from Q2 */}
      <line x1="355" y1="170" x2="300" y2="230" stroke="#ef4444" strokeWidth="1.5" />
      <text x="310" y="200" fill="#ef4444" fontSize="10" fontWeight="bold">{L.yes[locale]}</text>

      {/* NO arrow from Q2 */}
      <line x1="445" y1="170" x2="445" y2="230" stroke="#facc15" strokeWidth="1.5" />
      <text x="455" y="200" fill="#facc15" fontSize="10" fontWeight="bold">{L.no[locale]}</text>

      {/* Pacify box */}
      <rect x="200" y="230" width="195" height="70" rx="12" fill="#ef444410" stroke="#ef444440" strokeWidth="1" />
      <text x="297" y="252" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily={bodyFont}>
        {L.pacifyTitle[locale]}
      </text>
      <text x="297" y="268" textAnchor="middle" fill="#8b8fa3" fontSize="8" fontFamily={bodyFont}>
        {locale === 'en' || String(locale) === 'ta' ? 'Donation, fasting, mantra for peace' : locale === 'hi' ? 'दान, उपवास, शान्ति मंत्र' : 'दानम्, उपवासः, शान्तिमन्त्रः'}
      </text>
      <text x="297" y="280" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold" fontFamily={bodyFont}>
        {locale === 'en' || String(locale) === 'ta' ? 'DO NOT wear gemstone!' : locale === 'hi' ? 'रत्न न पहनें!' : 'रत्नं न धारयेत्!'}
      </text>

      {/* Neutral: Check context box */}
      <rect x="400" y="230" width="90" height="50" rx="10" fill="#facc1510" stroke="#facc1540" strokeWidth="1" />
      <text x="445" y="252" textAnchor="middle" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily={bodyFont}>
        {locale === 'en' || String(locale) === 'ta' ? 'Context' : locale === 'hi' ? 'सन्दर्भ' : 'सन्दर्भः'}
      </text>
      <text x="445" y="266" textAnchor="middle" fill="#8b8fa3" fontSize="7" fontFamily={bodyFont}>
        {locale === 'en' || String(locale) === 'ta' ? 'Analyze chart' : locale === 'hi' ? 'कुण्डली विश्लेषण' : 'कुण्डलीविश्लेषणम्'}
      </text>
    </svg>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function RemediesPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const [selected, setSelected] = useState<string>('sun');

  const activePlanet = PLANET_REMEDIES.find(p => p.id === selected)!;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl" style={bodyFont}>
          {L.subtitle[locale]}
        </p>
      </div>

      {/* Planet Selector + Remedy Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <p className="text-text-secondary text-xs mb-4" style={bodyFont}>{L.selectPlanet[locale]}</p>

        {/* Planet buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PLANET_REMEDIES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                selected === p.id
                  ? `${p.btnColor} scale-105 ring-1`
                  : 'border-white/10 hover:border-white/25 bg-white/2'
              }`}
              style={{ color: p.color, ...(selected === p.id ? { ringColor: p.color + '40' } : {}) }}
            >
              {p.name[locale]}
            </button>
          ))}
        </div>

        {/* Active remedy card */}
        <AnimatePresence mode="wait">
          <RemedyCard key={selected} planet={activePlanet} locale={locale} />
        </AnimatePresence>
      </motion.div>

      {/* Remedy Selection Flowchart */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="w-6 h-6 text-gold-light" />
          <h3 className="text-gold-gradient text-xl font-bold" style={headingFont}>{L.flowchartTitle[locale]}</h3>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-6" style={bodyFont}>{L.flowchartSubtitle[locale]}</p>

        <FlowchartDiagram locale={locale} />

        {/* Legend below flowchart */}
        <div className="flex flex-wrap gap-4 mt-6 text-xs justify-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-medium">{L.strengthenTitle[locale]}</span>
            <span className="text-text-secondary">= {locale === 'en' || String(locale) === 'ta' ? 'Gemstone + Mantra' : locale === 'hi' ? 'रत्न + मंत्र' : 'रत्नम् + मन्त्रः'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-red-400 font-medium">{L.pacifyTitle[locale]}</span>
            <span className="text-text-secondary">= {locale === 'en' || String(locale) === 'ta' ? 'Charity + Fasting' : locale === 'hi' ? 'दान + उपवास' : 'दानम् + उपवासः'}</span>
          </span>
        </div>
      </motion.div>

      {/* When Remedies Don't Work */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-amber-500/15 bg-amber-500/3">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <h3 className="text-amber-300 text-lg font-bold" style={headingFont}>{L.dontWorkTitle[locale]}</h3>
        </div>
        <div className="space-y-4" style={bodyFont}>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-bold">1</span>
            <p className="text-text-secondary text-sm leading-relaxed">{L.dontWork1[locale]}</p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-bold">2</span>
            <p className="text-text-secondary text-sm leading-relaxed">{L.dontWork2[locale]}</p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">3</span>
            <p className="text-text-secondary text-sm leading-relaxed">{L.dontWork3[locale]}</p>
          </div>
        </div>
      </motion.div>

      {/* Related Links */}
      <div>
        <h3 className="text-gold-gradient text-lg font-bold mb-4" style={headingFont}>{L.relatedTitle[locale]}</h3>
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
