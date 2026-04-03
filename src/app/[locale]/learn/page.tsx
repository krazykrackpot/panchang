'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { BookOpen, ChevronRight, Clock, Star, CheckCircle } from 'lucide-react';
import type { Locale } from '@/types/panchang';

// ── Full 50-module curriculum ──────────────────────────────────
const PHASES = [
  { phase: 0, label: { en: 'Pre-Foundation', hi: 'पूर्व-आधार', sa: 'पूर्वाधारः' }, color: 'gold', accent: 'border-gold-primary/20 bg-gold-primary/5', badge: 'bg-gold-primary/20 text-gold-light', topics: [
    { topic: { en: 'Getting Started', hi: 'आरम्भ', sa: 'आरम्भः' }, modules: [
      { id: '0-1', title: { en: 'What is Jyotish? (And What It Isn\'t)', hi: 'ज्योतिष क्या है? (और क्या नहीं है)', sa: 'ज्योतिषं किम्? (किं न च)' } },
      { id: '0-2', title: { en: 'The Hindu Calendar — Why It\'s Different', hi: 'हिन्दू पंचांग — यह अलग क्यों है', sa: 'हिन्दूपञ्चाङ्गम् — कथं भिन्नम्' } },
      { id: '0-3', title: { en: 'Your Cosmic Address — Sun, Moon, Nakshatra', hi: 'आपका ब्रह्माण्डीय पता — सूर्य, चन्द्र, नक्षत्र', sa: 'भवतः ब्रह्माण्डीयसङ्केतः' } },
      { id: '0-4', title: { en: 'Reading Today\'s Panchang', hi: 'आज का पंचांग पढ़ना', sa: 'अद्यपञ्चाङ्गपठनम्' } },
      { id: '0-5', title: { en: 'What is a Kundali (Birth Chart)?', hi: 'कुण्डली क्या है?', sa: 'कुण्डली किम्?' } },
    ]},
  ]},
  { phase: 1, label: { en: 'The Sky', hi: 'आकाश', sa: 'आकाशः' }, color: 'blue', accent: 'border-blue-500/20 bg-blue-500/5', badge: 'bg-blue-500/20 text-blue-300', topics: [
    { topic: { en: 'Foundations', hi: 'आधार', sa: 'आधारः' }, modules: [
      { id: '1-1', title: { en: 'The Night Sky & Ecliptic', hi: 'रात्रि आकाश एवं क्रान्तिवृत्त', sa: 'रात्र्याकाशः क्रान्तिवृत्तं च' } },
      { id: '1-2', title: { en: 'Measuring the Sky — Degrees & Signs', hi: 'आकाश मापन — अंश एवं राशि', sa: 'आकाशमापनम् — अंशाः राशयश्च' } },
      { id: '1-3', title: { en: 'Fixed Stars vs Moving Planets', hi: 'स्थिर तारे बनाम गतिशील ग्रह', sa: 'स्थिरतारकाः गतिशीलग्रहाश्च' } },
    ]},
    { topic: { en: 'Grahas (Planets)', hi: 'ग्रह', sa: 'ग्रहाः' }, modules: [
      { id: '2-1', title: { en: 'Nine Grahas — Nature & Karakatva', hi: 'नवग्रह — प्रकृति एवं कारकत्व', sa: 'नवग्रहाः — प्रकृतिः कारकत्वं च' } },
      { id: '2-2', title: { en: 'Planetary Friendship Matrix', hi: 'ग्रह मित्रता सारणी', sa: 'ग्रहमैत्रीसारणी' } },
      { id: '2-3', title: { en: 'Dignities — Exaltation & Debilitation', hi: 'ग्रह गरिमा — उच्च एवं नीच', sa: 'ग्रहगरिमा — उच्चनीचम्' } },
      { id: '2-4', title: { en: 'Retrograde, Combustion & Graha Yuddha', hi: 'वक्री, अस्त एवं ग्रह युद्ध', sa: 'वक्री, अस्तं, ग्रहयुद्धं च' } },
    ]},
    { topic: { en: 'Rashis (Signs)', hi: 'राशियाँ', sa: 'राशयः' }, modules: [
      { id: '3-1', title: { en: "The 12 Rashis — Parashara's Description", hi: '12 राशियाँ — पराशर वर्णन', sa: '12 राशयः — पाराशरवर्णनम्' } },
      { id: '3-2', title: { en: 'Qualities & Elements', hi: 'गुण एवं तत्व', sa: 'गुणाः तत्त्वानि च' } },
      { id: '3-3', title: { en: 'Sign Lordship & Moolatrikona', hi: 'राशि स्वामित्व एवं मूलत्रिकोण', sa: 'राशिस्वामित्वं मूलत्रिकोणं च' } },
    ]},
    { topic: { en: 'Ayanamsha', hi: 'अयनांश', sa: 'अयनांशः' }, modules: [
      { id: '4-1', title: { en: 'Precession — Why the Sky Shifts', hi: 'अयनगति — आकाश क्यों बदलता', sa: 'अयनगतिः — आकाशः कथं परिवर्तते' } },
      { id: '4-2', title: { en: 'Ayanamsha Systems Compared', hi: 'अयनांश पद्धतियों की तुलना', sa: 'अयनांशपद्धतीनां तुलना' } },
      { id: '4-3', title: { en: 'Tropical vs Sidereal Debate', hi: 'सायन बनाम निरयन वाद', sa: 'सायननिरयनवादः' } },
    ]},
  ]},
  { phase: 2, label: { en: 'The Panchang', hi: 'पञ्चाङ्ग', sa: 'पञ्चाङ्गम्' }, color: 'amber', accent: 'border-amber-500/20 bg-amber-500/5', badge: 'bg-amber-500/20 text-amber-300', topics: [
    { topic: { en: 'Tithi (Lunar Day)', hi: 'तिथि', sa: 'तिथिः' }, modules: [
      { id: '5-1', title: { en: 'The Lunar Day — 12° Segments', hi: 'तिथि — 12° खण्ड', sa: 'तिथिः — 12° खण्डाः' } },
      { id: '5-2', title: { en: 'Paksha — Shukla & Krishna', hi: 'पक्ष — शुक्ल एवं कृष्ण', sa: 'पक्षः — शुक्लकृष्णौ' } },
      { id: '5-3', title: { en: 'Parana, Kshaya & Vriddhi Tithis', hi: 'पारण, क्षय एवं वृद्धि तिथि', sa: 'पारणं, क्षयवृद्धितिथयः' } },
    ]},
    { topic: { en: 'Nakshatra (Stars)', hi: 'नक्षत्र', sa: 'नक्षत्राणि' }, modules: [
      { id: '6-1', title: { en: '27 Lunar Mansions', hi: '27 चन्द्र गृह', sa: '27 चन्द्रगृहाणि' } },
      { id: '6-2', title: { en: '108 Padas — The Navamsha Link', hi: '108 पाद — नवांश सम्बन्ध', sa: '108 पादाः — नवांशसम्बन्धः' } },
      { id: '6-3', title: { en: 'Compatibility (Melapaka)', hi: 'अनुकूलता (मेलापक)', sa: 'अनुकूलता (मेलापकम्)' } },
      { id: '6-4', title: { en: 'Nakshatra Lords & Dasha Connection', hi: 'नक्षत्र स्वामी एवं दशा सम्बन्ध', sa: 'नक्षत्रस्वामिनः दशासम्बन्धश्च' } },
    ]},
    { topic: { en: 'Yoga, Karana & Vara', hi: 'योग, करण, वार', sa: 'योगः, करणं, वारः' }, modules: [
      { id: '7-1', title: { en: 'Yoga — Sun + Moon Sum', hi: 'योग — सूर्य + चन्द्र योग', sa: 'योगः — सूर्यचन्द्रयोगः' } },
      { id: '7-2', title: { en: 'Karana — The Half-Tithi', hi: 'करण — अर्ध तिथि', sa: 'करणम् — अर्धतिथिः' } },
      { id: '7-3', title: { en: 'Vara & the Hora System', hi: 'वार एवं होरा पद्धति', sa: 'वारः होरापद्धतिश्च' } },
    ]},
    { topic: { en: 'Integration', hi: 'एकीकरण', sa: 'एकीकरणम्' }, modules: [
      { id: '8-1', title: { en: 'Five Limbs Together — Reading a Panchang', hi: 'पाँचों अंग — पञ्चाङ्ग पढ़ना', sa: 'पञ्चाङ्गानि — पञ्चाङ्गपठनम्' } },
    ]},
  ]},
  { phase: 3, label: { en: 'The Chart', hi: 'कुण्डली', sa: 'कुण्डली' }, color: 'emerald', accent: 'border-emerald-500/20 bg-emerald-500/5', badge: 'bg-emerald-500/20 text-emerald-300', topics: [
    { topic: { en: 'Kundali Basics', hi: 'कुण्डली मूल', sa: 'कुण्डलीमूलम्' }, modules: [
      { id: '9-1', title: { en: 'What is a Birth Chart?', hi: 'जन्म कुण्डली क्या है?', sa: 'जन्मकुण्डली किम्?' } },
      { id: '9-2', title: { en: 'Houses (Bhavas) — 12 Life Areas', hi: 'भाव — 12 जीवन क्षेत्र', sa: 'भावाः — 12 जीवनक्षेत्राणि' } },
      { id: '9-3', title: { en: 'Planetary Dignities in the Chart', hi: 'कुण्डली में ग्रह गरिमा', sa: 'कुण्डल्यां ग्रहगरिमा' } },
      { id: '9-4', title: { en: 'Chart Interpretation Framework', hi: 'कुण्डली व्याख्या ढाँचा', sa: 'कुण्डलीव्याख्याढाञ्चः' } },
    ]},
    { topic: { en: 'Divisional Charts', hi: 'वर्ग कुण्डली', sa: 'वर्गकुण्डल्यः' }, modules: [
      { id: '10-1', title: { en: 'Varga Charts — Why & How', hi: 'वर्ग कुण्डली — क्यों एवं कैसे', sa: 'वर्गकुण्डल्यः — कथं किमर्थं च' } },
      { id: '10-2', title: { en: 'Navamsha (D9) Deep Dive', hi: 'नवांश (D9) विस्तृत', sa: 'नवांशः (D9) विस्तृतम्' } },
      { id: '10-3', title: { en: 'Dasamsha, Saptamsha & More', hi: 'दशमांश, सप्तमांश आदि', sa: 'दशमांशः, सप्तमांशः इत्यादि' } },
    ]},
    { topic: { en: 'Dashas (Timing)', hi: 'दशा (समय)', sa: 'दशाः (समयः)' }, modules: [
      { id: '11-1', title: { en: 'Vimshottari — The 120-Year Cycle', hi: 'विंशोत्तरी — 120 वर्ष चक्र', sa: 'विंशोत्तरी — 120 वर्षचक्रम्' } },
      { id: '11-2', title: { en: 'Yogini & Char Dasha', hi: 'योगिनी एवं चर दशा', sa: 'योगिनी चरदशा च' } },
      { id: '11-3', title: { en: 'Dasha-Transit Overlay', hi: 'दशा-गोचर सम्मिश्रण', sa: 'दशागोचरसम्मिश्रणम्' } },
    ]},
    { topic: { en: 'Transits (Gochar)', hi: 'गोचर', sa: 'गोचरः' }, modules: [
      { id: '12-1', title: { en: 'How Transits Work', hi: 'गोचर कैसे काम करता', sa: 'गोचरः कथं कार्यं करोति' } },
      { id: '12-2', title: { en: 'Sade Sati — Saturn\'s 7.5 Years', hi: 'साढ़े साती', sa: 'साढेसाती' } },
      { id: '12-3', title: { en: 'Jupiter & Rahu-Ketu Transit', hi: 'गुरु एवं राहु-केतु गोचर', sa: 'गुरुराहुकेतुगोचरः' } },
    ]},
  ]},
  { phase: 4, label: { en: 'Applied Jyotish', hi: 'व्यावहारिक ज्योतिष', sa: 'व्यावहारिकज्योतिषम्' }, color: 'pink', accent: 'border-pink-500/20 bg-pink-500/5', badge: 'bg-pink-500/20 text-pink-300', topics: [
    { topic: { en: 'Yogas & Doshas', hi: 'योग एवं दोष', sa: 'योगाः दोषाश्च' }, modules: [
      { id: '13-1', title: { en: 'Planetary Yogas — Raja, Dhana, Arishta', hi: 'ग्रह योग — राज, धन, अरिष्ट', sa: 'ग्रहयोगाः — राज, धन, अरिष्ट' } },
      { id: '13-2', title: { en: 'Wealth & Health Yogas', hi: 'धन एवं स्वास्थ्य योग', sa: 'धनस्वास्थ्ययोगाः' } },
      { id: '13-3', title: { en: 'Dosha Detection & Cancellation', hi: 'दोष पहचान एवं शमन', sa: 'दोषपहचानम् शमनं च' } },
    ]},
    { topic: { en: 'Compatibility', hi: 'अनुकूलता', sa: 'अनुकूलता' }, modules: [
      { id: '14-1', title: { en: 'Kundali Milan — 8-Factor Matching', hi: 'कुण्डली मिलान — अष्ट कूट', sa: 'कुण्डलीमेलनम् — अष्टकूटम्' } },
      { id: '14-2', title: { en: 'Mangal Dosha in Marriage', hi: 'विवाह में मंगल दोष', sa: 'विवाहे मङ्गलदोषः' } },
      { id: '14-3', title: { en: 'Timing Marriage Events', hi: 'विवाह समय निर्धारण', sa: 'विवाहसमयनिर्धारणम्' } },
    ]},
    { topic: { en: 'Remedies & Advanced', hi: 'उपाय एवं उन्नत', sa: 'उपायाः उन्नतं च' }, modules: [
      { id: '15-1', title: { en: 'Gemstones (Ratna Shastra)', hi: 'रत्न शास्त्र', sa: 'रत्नशास्त्रम्' } },
      { id: '15-2', title: { en: 'Mantras, Pujas & Charity', hi: 'मंत्र, पूजा एवं दान', sa: 'मन्त्राः, पूजाः, दानं च' } },
      { id: '15-3', title: { en: 'Prashna — Horary Astrology', hi: 'प्रश्न ज्योतिष', sa: 'प्रश्नज्योतिषम्' } },
      { id: '15-4', title: { en: 'Varshaphal & KP System', hi: 'वर्षफल एवं KP पद्धति', sa: 'वर्षफलं KP पद्धतिश्च' } },
    ]},
    { topic: { en: 'Classical Texts', hi: 'शास्त्रीय ग्रन्थ', sa: 'शास्त्रीयग्रन्थाः' }, modules: [
      { id: '16-1', title: { en: 'Brihat Parashara Hora Shastra', hi: 'बृहत् पराशर होरा शास्त्र', sa: 'बृहत्पाराशरहोराशास्त्रम्' } },
      { id: '16-2', title: { en: 'Phaladeepika & Jataka Parijata', hi: 'फलदीपिका एवं जातक पारिजात', sa: 'फलदीपिका जातकपारिजातश्च' } },
      { id: '16-3', title: { en: 'Surya Siddhanta & Mathematics', hi: 'सूर्य सिद्धान्त एवं गणित', sa: 'सूर्यसिद्धान्तः गणितं च' } },
    ]},
    { topic: { en: 'Muhurta Mastery', hi: 'मुहूर्त विशेषज्ञता', sa: 'मुहूर्तवैशेषिकम्' }, modules: [
      { id: '17-1', title: { en: 'The Science of Timing', hi: 'समय विज्ञान', sa: 'समयविज्ञानम्' } },
      { id: '17-2', title: { en: 'Marriage Muhurta', hi: 'विवाह मुहूर्त', sa: 'विवाहमुहूर्तम्' } },
      { id: '17-3', title: { en: 'Property & Travel', hi: 'गृह एवं यात्रा', sa: 'गृहं यात्रा च' } },
      { id: '17-4', title: { en: 'Education & Naming', hi: 'शिक्षा एवं नामकरण', sa: 'शिक्षा नामकरणं च' } },
    ]},
  ]},
  { phase: 5, label: { en: 'Strength & Dignity', hi: 'बल एवं गरिमा', sa: 'बलं गरिमा च' }, color: 'violet', accent: 'border-violet-500/20 bg-violet-500/5', badge: 'bg-violet-500/20 text-violet-300', topics: [
    { topic: { en: 'Planetary Strength', hi: 'ग्रह बल', sa: 'ग्रहबलम्' }, modules: [
      { id: '18-1', title: { en: 'Shadbala — 6-Fold Strength', hi: 'षड्बल — छह प्रकार का बल', sa: 'षड्बलम्' } },
      { id: '18-2', title: { en: 'Bhavabala — House Strength', hi: 'भावबल — भाव शक्ति', sa: 'भावबलम्' } },
      { id: '18-3', title: { en: 'Ashtakavarga — Bindu Scoring', hi: 'अष्टकवर्ग — बिन्दु अंक', sa: 'अष्टकवर्गः' } },
      { id: '18-4', title: { en: 'Avasthas — Planetary States', hi: 'अवस्थाएँ — ग्रह दशाएँ', sa: 'अवस्थाः' } },
      { id: '18-5', title: { en: 'Vimshopaka — 20-Point Varga Strength', hi: 'विंशोपक बल', sa: 'विंशोपकबलम्' } },
    ]},
  ]},
  { phase: 6, label: { en: 'Jaimini System', hi: 'जैमिनी पद्धति', sa: 'जैमिनीपद्धतिः' }, color: 'cyan', accent: 'border-cyan-500/20 bg-cyan-500/5', badge: 'bg-cyan-500/20 text-cyan-300', topics: [
    { topic: { en: 'Jaimini Astrology', hi: 'जैमिनी ज्योतिष', sa: 'जैमिनीज्योतिषम्' }, modules: [
      { id: '19-1', title: { en: 'Chara Karakas — 7 Variable Significators', hi: 'चर कारक', sa: 'चरकारकाः' } },
      { id: '19-2', title: { en: 'Rashi Drishti — Sign-Based Aspects', hi: 'राशि दृष्टि', sa: 'राशिदृष्टिः' } },
      { id: '19-3', title: { en: 'Argala — Intervention System', hi: 'अर्गला — हस्तक्षेप पद्धति', sa: 'अर्गला' } },
      { id: '19-4', title: { en: 'Special Lagnas — Hora, Ghati, Varnada', hi: 'विशेष लग्न', sa: 'विशेषलग्नानि' } },
    ]},
  ]},
  { phase: 7, label: { en: 'KP System', hi: 'केपी पद्धति', sa: 'केपी पद्धतिः' }, color: 'orange', accent: 'border-orange-500/20 bg-orange-500/5', badge: 'bg-orange-500/20 text-orange-300', topics: [
    { topic: { en: 'Krishnamurti Paddhati', hi: 'कृष्णमूर्ति पद्धति', sa: 'कृष्णमूर्तिपद्धतिः' }, modules: [
      { id: '20-1', title: { en: 'Placidus Houses', hi: 'प्लेसिडस भाव', sa: 'प्लेसिडसभावाः' } },
      { id: '20-2', title: { en: '249 Sub-Lord Table', hi: '249 उप-स्वामी तालिका', sa: '249 उपस्वामिसारणी' } },
      { id: '20-3', title: { en: 'Significators — 4-Level System', hi: 'कारक — चतुर्स्तर', sa: 'कारकाः — चतुर्स्तराः' } },
      { id: '20-4', title: { en: 'Ruling Planets — Timing Method', hi: 'शासक ग्रह — समय विधि', sa: 'शासकग्रहाः — समयविधिः' } },
    ]},
  ]},
  { phase: 8, label: { en: 'Varshaphal & Tajika', hi: 'वर्षफल एवं ताजिक', sa: 'वर्षफलं ताजिकं च' }, color: 'rose', accent: 'border-rose-500/20 bg-rose-500/5', badge: 'bg-rose-500/20 text-rose-300', topics: [
    { topic: { en: 'Annual Horoscopy', hi: 'वार्षिक ज्योतिष', sa: 'वार्षिकज्योतिषम्' }, modules: [
      { id: '21-1', title: { en: 'Tajika Aspects', hi: 'ताजिक दृष्टि', sa: 'ताजिकदृष्टिः' } },
      { id: '21-2', title: { en: 'Sahams — Sensitive Points', hi: 'सहम — संवेदनशील बिन्दु', sa: 'सहमाः' } },
      { id: '21-3', title: { en: 'Mudda Dasha', hi: 'मुद्दा दशा', sa: 'मुद्दादशा' } },
      { id: '21-4', title: { en: 'Tithi Pravesha — Birthday Chart', hi: 'तिथि प्रवेश', sa: 'तिथिप्रवेशः' } },
    ]},
  ]},
  { phase: 9, label: { en: 'Computational Astronomy', hi: 'गणनात्मक खगोल', sa: 'गणनात्मकखगोलम्' }, color: 'sky', accent: 'border-sky-500/20 bg-sky-500/5', badge: 'bg-sky-500/20 text-sky-300', topics: [
    { topic: { en: 'How Our Engine Works', hi: 'हमारा इंजन कैसे काम करता', sa: 'अस्माकं यन्त्रं कथं कार्यं करोति' }, modules: [
      { id: '22-1', title: { en: 'Julian Day — Universal Clock', hi: 'जूलियन दिन', sa: 'जूलियनदिनम्' } },
      { id: '22-2', title: { en: 'Finding the Sun — Meeus Algorithm', hi: 'सूर्य खोज — Meeus गणित', sa: 'सूर्यान्वेषणम्' } },
      { id: '22-3', title: { en: 'Finding the Moon — 60 Sine Terms', hi: 'चन्द्र खोज — 60 ज्या पद', sa: 'चन्द्रान्वेषणम्' } },
      { id: '22-4', title: { en: 'Sunrise — 2-Pass Algorithm', hi: 'सूर्योदय — द्विचरणीय गणना', sa: 'सूर्योदयगणना' } },
      { id: '22-5', title: { en: 'Moonrise — Parallax & Binary Search', hi: 'चन्द्रोदय — लम्बन एवं द्विभाजन', sa: 'चन्द्रोदयगणना' } },
      { id: '22-6', title: { en: 'Equation of Time', hi: 'समय समीकरण', sa: 'समयसमीकरणम्' } },
    ]},
  ]},
  { phase: 10, label: { en: 'Predictive Techniques', hi: 'भविष्यवाणी तकनीक', sa: 'भविष्यवाणीतन्त्रम्' }, color: 'fuchsia', accent: 'border-fuchsia-500/20 bg-fuchsia-500/5', badge: 'bg-fuchsia-500/20 text-fuchsia-300', topics: [
    { topic: { en: 'Advanced Prediction', hi: 'उन्नत भविष्यवाणी', sa: 'उन्नतभविष्यवाणी' }, modules: [
      { id: '23-1', title: { en: 'Eclipse Prediction', hi: 'ग्रहण भविष्यवाणी', sa: 'ग्रहणभविष्यवाणी' } },
      { id: '23-2', title: { en: 'Retrograde & Combustion', hi: 'वक्री एवं अस्त', sa: 'वक्री अस्तं च' } },
      { id: '23-3', title: { en: 'Chakra Systems', hi: 'चक्र पद्धतियाँ', sa: 'चक्रपद्धतयः' } },
      { id: '23-4', title: { en: 'Sphutas — Yogi & Avayogi', hi: 'स्फुट — योगी एवं अवयोगी', sa: 'स्फुटाः' } },
      { id: '23-5', title: { en: 'Prashna Yogas', hi: 'प्रश्न योग', sa: 'प्रश्नयोगाः' } },
    ]},
    { topic: { en: 'Nakshatra Deep Dives', hi: 'नक्षत्र गहन अध्ययन', sa: 'नक्षत्रगहनाध्ययनम्' }, modules: [
      { id: '24-1', title: { en: 'Ganda Mula Nakshatras', hi: 'गण्ड मूल नक्षत्र', sa: 'गण्डमूलनक्षत्राणि' } },
    ]},
  ]},
];

const STATS = { modules: 89, questions: 890, minutes: 1124, phases: 11 };

export default function LearnPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const L = {
    en: {
      heroTitle: 'Learn Vedic Astrology',
      heroSub: 'A structured, interactive course — from first principles to advanced predictive techniques',
      startCourse: 'Start Course',
      continueLearning: 'Continue Learning',
      stats: { modules: 'Modules', questions: 'Questions', minutes: 'Minutes', phases: 'Phases' },
      phaseLabel: 'Phase',
      freeForever: 'Free forever. No account needed.',
      refTitle: 'Reference Library',
      refSub: 'Quick-access deep dives into specific topics — use alongside the course or independently',
    },
    hi: {
      heroTitle: 'वैदिक ज्योतिष सीखें',
      heroSub: 'एक व्यवस्थित, इंटरैक्टिव पाठ्यक्रम — मूल सिद्धांतों से उन्नत भविष्यवाणी तकनीकों तक',
      startCourse: 'पाठ्यक्रम शुरू करें',
      continueLearning: 'आगे पढ़ें',
      stats: { modules: 'मॉड्यूल', questions: 'प्रश्न', minutes: 'मिनट', phases: 'चरण' },
      phaseLabel: 'चरण',
      freeForever: 'सदा नि:शुल्क। खाते की आवश्यकता नहीं।',
      refTitle: 'संदर्भ पुस्तकालय',
      refSub: 'विशिष्ट विषयों पर त्वरित गहन अध्ययन — पाठ्यक्रम के साथ या स्वतंत्र रूप से',
    },
    sa: {
      heroTitle: 'वैदिकज्योतिषं पठतु',
      heroSub: 'व्यवस्थितं, अन्तरक्रियात्मकं पाठ्यक्रमम् — मूलसिद्धान्तेभ्यः उन्नतभविष्यवाणीपर्यन्तम्',
      startCourse: 'पाठ्यक्रमम् आरभतु',
      continueLearning: 'पठनं चालयतु',
      stats: { modules: 'मॉड्यूलाः', questions: 'प्रश्नाः', minutes: 'निमेषाः', phases: 'चरणाणि' },
      phaseLabel: 'चरणम्',
      freeForever: 'सदा नि:शुल्कम्। खातस्य आवश्यकता नास्ति।',
      refTitle: 'सन्दर्भपुस्तकालयः',
      refSub: 'विशिष्टविषयेषु त्वरितगहनाध्ययनम्',
    },
  };
  const l = L[locale] || L.en;

  // Reference pages (quick-access, shown below the course)
  const REFS = [
    { name: { en: 'Grahas', hi: 'ग्रह', sa: 'ग्रहाः' }, href: '/learn/grahas' },
    { name: { en: 'Rashis', hi: 'राशियाँ', sa: 'राशयः' }, href: '/learn/rashis' },
    { name: { en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्राणि' }, href: '/learn/nakshatras' },
    { name: { en: 'Tithis', hi: 'तिथियाँ', sa: 'तिथयः' }, href: '/learn/tithis' },
    { name: { en: 'Yogas', hi: 'योग', sa: 'योगाः' }, href: '/learn/yogas' },
    { name: { en: 'Karanas', hi: 'करण', sa: 'करणानि' }, href: '/learn/karanas' },
    { name: { en: 'Muhurtas', hi: 'मुहूर्त', sa: 'मुहूर्ताः' }, href: '/learn/muhurtas' },
    { name: { en: 'Kundali', hi: 'कुण्डली', sa: 'कुण्डली' }, href: '/learn/kundali' },
    { name: { en: 'Vargas', hi: 'वर्ग', sa: 'वर्गाः' }, href: '/learn/vargas' },
    { name: { en: 'Dashas', hi: 'दशाएँ', sa: 'दशाः' }, href: '/learn/dashas' },
    { name: { en: 'Transits', hi: 'गोचर', sa: 'गोचरः' }, href: '/learn/gochar' },
    { name: { en: 'Matching', hi: 'मिलान', sa: 'मेलनम्' }, href: '/learn/matching' },
    { name: { en: 'Doshas', hi: 'दोष', sa: 'दोषाः' }, href: '/learn/doshas' },
    { name: { en: 'Ayanamsha', hi: 'अयनांश', sa: 'अयनांशः' }, href: '/learn/ayanamsha' },
    { name: { en: 'Lagna', hi: 'लग्न', sa: 'लग्नम्' }, href: '/learn/lagna' },
    { name: { en: 'Classical Texts', hi: 'शास्त्रीय ग्रंथ', sa: 'शास्त्रीयग्रन्थाः' }, href: '/learn/classical-texts' },
    { name: { en: 'Calculations', hi: 'गणना', sa: 'गणनापद्धतिः' }, href: '/learn/calculations' },
    { name: { en: 'Advanced', hi: 'उन्नत', sa: 'उन्नतम्' }, href: '/learn/advanced' },
  ];

  return (
    <div>
      {/* ── Hero Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-gold-primary/20 bg-gradient-to-br from-[#0f1535] via-[#0a0e27] to-[#1a0f2e] p-8 sm:p-10 mb-10"
      >
        {/* Decorative background circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gold-primary" />
            <span className="text-gold-primary text-xs uppercase tracking-widest font-bold">
              {locale === 'en' ? 'Interactive Course' : locale === 'hi' ? 'इंटरैक्टिव पाठ्यक्रम' : 'अन्तरक्रियात्मकपाठ्यक्रमम्'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={hf}>
            <span className="text-gold-gradient">{l.heroTitle}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mb-8" style={bf}>{l.heroSub}</p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { val: STATS.modules, label: l.stats.modules, icon: BookOpen },
              { val: STATS.questions, label: l.stats.questions, icon: CheckCircle },
              { val: `~${STATS.minutes}`, label: l.stats.minutes, icon: Clock },
              { val: STATS.phases, label: l.stats.phases, icon: Star },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className="w-4 h-4 text-gold-dark" />
                <span className="text-gold-light font-bold text-lg">{s.val}</span>
                <span className="text-text-secondary text-sm">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/learn/modules/1-1"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-primary text-bg-primary font-bold text-base hover:bg-gold-light transition-colors"
              style={hf}
            >
              {l.startCourse}
              <ChevronRight className="w-5 h-5" />
            </Link>
            <span className="text-text-secondary/60 text-sm">{l.freeForever}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Full Curriculum ── */}
      <div className="space-y-8 mb-16">
        {PHASES.map((phase, pi) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: pi * 0.05 }}
          >
            {/* Phase header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light font-bold text-sm">
                {phase.phase}
              </span>
              <div>
                <span className="text-text-secondary/60 text-xs uppercase tracking-wider">{l.phaseLabel} {phase.phase}</span>
                <h2 className="text-xl font-bold text-gold-light -mt-0.5" style={hf}>{phase.label[locale]}</h2>
              </div>
            </div>

            {/* Topics and modules */}
            <div className="ml-5 border-l-2 border-gold-primary/10 pl-6 space-y-4">
              {phase.topics.map((topic) => (
                <div key={topic.topic.en} className={`rounded-xl border ${phase.accent} overflow-hidden`}>
                  <div className="px-4 py-2 border-b border-gold-primary/5">
                    <span className="text-gold-dark text-[10px] uppercase tracking-widest font-bold" style={bf}>
                      {topic.topic[locale]}
                    </span>
                  </div>
                  <div className="divide-y divide-gold-primary/5">
                    {topic.modules.map((mod) => (
                      <Link
                        key={mod.id}
                        href={`/learn/modules/${mod.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${phase.badge}`}>
                            {mod.id.replace('-', '.')}
                          </span>
                          <span className="text-text-primary text-sm group-hover:text-gold-light transition-colors" style={bf}>
                            {mod.title[locale]}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-gold-primary transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Interactive Labs ── */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
            &#9881;
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gold-gradient" style={hf}>
              {locale === 'en' ? 'Interactive Labs' : locale === 'hi' ? 'इंटरैक्टिव प्रयोगशाला' : 'अन्तरक्रियात्मकप्रयोगशाला'}
            </h2>
            <p className="text-text-secondary text-sm" style={bf}>
              {locale === 'en' ? 'Input your data, watch the engine calculate step by step' : locale === 'hi' ? 'अपना डेटा दें, इंजन को चरणबद्ध गणना करते देखें' : 'स्वदत्तांशं दत्तवान् यन्त्रस्य क्रमशः गणनां पश्यतु'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/learn/labs/panchang', title: { en: 'Compute Your Panchang', hi: 'अपना पंचांग गणना करें', sa: 'स्वपञ्चाङ्गं गणयतु' }, desc: { en: 'Date → JD → Sun/Moon → Tithi, Nakshatra, Yoga', hi: 'तिथि → जूलियन दिन → सूर्य/चन्द्र → तिथि, नक्षत्र, योग', sa: 'तिथिः → JD → सूर्यचन्द्रौ → तिथिनक्षत्रयोगाः' }, color: 'amber' },
            { href: '/learn/labs/moon', title: { en: 'Trace Your Moon', hi: 'अपना चन्द्र खोजें', sa: 'स्वचन्द्रम् अन्विष्यतु' }, desc: { en: '60 sine terms → Moon longitude → Rashi & Nakshatra', hi: '60 ज्या पद → चन्द्र देशान्तर → राशि एवं नक्षत्र', sa: '60 ज्यापदानि → चन्द्रदेशान्तरः → राशिनक्षत्रम्' }, color: 'indigo' },
            { href: '/learn/labs/dasha', title: { en: 'Your Dasha Timeline', hi: 'आपकी दशा समयरेखा', sa: 'भवतः दशासमयरेखा' }, desc: { en: 'Birth Moon → Nakshatra → 120-year Vimshottari timeline', hi: 'जन्म चन्द्र → नक्षत्र → 120 वर्षीय विंशोत्तरी', sa: 'जन्मचन्द्रः → नक्षत्रम् → 120 वर्षीयविंशोत्तरी' }, color: 'violet' },
            { href: '/learn/labs/shadbala', title: { en: 'Shadbala Breakdown', hi: 'षड्बल विश्लेषण', sa: 'षड्बलविश्लेषणम्' }, desc: { en: '6 strengths per planet — find your chart\'s captain', hi: 'प्रति ग्रह 6 शक्तियाँ — अपनी कुण्डली का कप्तान खोजें', sa: 'प्रतिग्रहं 6 शक्तयः — कुण्डल्याः सेनापतिं अन्विष्यतु' }, color: 'emerald' },
            { href: '/learn/labs/kp', title: { en: 'KP Sub-Lord Lookup', hi: 'केपी उप-स्वामी खोज', sa: 'केपी उपस्वामिखोजः' }, desc: { en: 'Degree → Sign Lord → Star Lord → Sub Lord', hi: 'अंश → राशि स्वामी → नक्षत्र स्वामी → उप-स्वामी', sa: 'अंशः → राशिस्वामी → नक्षत्रस्वामी → उपस्वामी' }, color: 'cyan' },
          ].map(lab => (
            <Link key={lab.href} href={lab.href}
              className={`glass-card rounded-xl p-4 border border-${lab.color}-500/20 bg-${lab.color}-500/5 hover:border-${lab.color}-500/40 transition-all group`}>
              <h3 className={`text-${lab.color}-300 font-bold text-sm mb-1 group-hover:text-${lab.color}-200`} style={bf}>{lab.title[locale]}</h3>
              <p className="text-text-secondary/70 text-xs" style={bf}>{lab.desc[locale]}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Reference Library ── */}
      <div>
        <h2 className="text-2xl font-bold text-gold-gradient mb-2" style={hf}>{l.refTitle}</h2>
        <p className="text-text-secondary text-sm mb-6" style={bf}>{l.refSub}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {REFS.map(ref => (
            <Link
              key={ref.href}
              href={ref.href}
              className="glass-card rounded-lg px-3 py-2.5 text-center text-sm text-text-secondary hover:text-gold-light hover:border-gold-primary/20 transition-colors border border-transparent"
              style={bf}
            >
              {ref.name[locale]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
