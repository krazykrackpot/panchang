'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { authedFetch } from '@/lib/api/authed-fetch';
import BirthForm from '@/components/kundali/BirthForm';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { BirthData } from '@/types/kundali';
import type { PrakritiResult } from '@/lib/medical/prakriti';
import type { BodyRegionResult } from '@/lib/medical/body-map';
import type { HealthWindow } from '@/lib/medical/health-timeline';
import type { DiseaseProfileResult } from '@/lib/medical/disease-profile';
import type { BodyRegion } from '@/lib/medical/constants';
import type { HealthPrognosis } from '@/lib/medical/health-prognosis';
import type { Locale, LocaleText } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';

// ─── Inline labels (4 active locales: en, hi, ta, bn) ────────────────────────
const LABELS = {
  en: {
    title: 'Medical Astrology',
    subtitle: 'Prakriti · Body Map · Health Timeline · Disease Patterns',
    desc: 'Discover your Ayurvedic constitution, body vulnerability map, and health vulnerability windows from your Vedic birth chart.',
    disclaimer: 'This is traditional Vedic knowledge for self-awareness only. It is NOT medical advice. Always consult qualified healthcare professionals for any health concern.',
    generate: 'Analyse Medical Chart',
    generating: 'Analysing...',
    prakritiTitle: 'Prakriti — Ayurvedic Constitution',
    prakritiDesc: 'Your dominant doshas derived from planetary positions at birth.',
    primary: 'Primary Dosha',
    secondary: 'Secondary Dosha',
    vata: 'Vata', pitta: 'Pitta', kapha: 'Kapha',
    bodyMapTitle: 'Body Vulnerability Map',
    bodyMapDesc: 'Vulnerability score per body region based on house affliction analysis.',
    vulnerability: 'Vulnerability',
    low: 'Low', moderate: 'Moderate', high: 'High',
    factors: 'Factors',
    noFactors: 'No afflictions found',
    timelineTitle: 'Health Timeline',
    timelineDesc: 'Dasha-based health vulnerability windows for the next 10 years.',
    noWindows: 'No notable health vulnerability windows in the next 10 years.',
    diseaseTitle: 'Disease Susceptibility Profile',
    topVuln: 'Top Vulnerable Body Systems',
    sigPatterns: 'Classical Signature Patterns',
    present: 'Present in chart',
    absent: 'Not present',
    error: 'Analysis failed. Please try again.',
    prognosisTitle: 'Current Health Prognosis',
    prognosisDesc: 'Real-time health outlook based on running dasha, transits, and active doshas.',
    currentDasha: 'Running Period',
    transitAlerts: 'Transit Alerts',
    activeDosha: 'Active Doshas',
    guidance: 'Health Guidance',
    overallOutlook: 'Overall Outlook',
    toneGood: 'Favourable', toneModerate: 'Stable', toneCaution: 'Needs Attention', toneChallenging: 'Extra Care Needed',
    doLabel: 'Do', avoidLabel: 'Avoid', watchLabel: 'Watch',
    sadeSatiNote: 'Sade Sati Active',
    noAlerts: 'No major transit alerts on health houses.',
    noDoshas: 'No notable doshas affecting health.',
    summaryLabel: 'Summary',
    // ── Editorial content for AdSense ──
    editorialTitle: 'Understanding Medical Astrology (Jyotish Chikitsa)',
    editorialIntro: 'Medical Astrology, known as Jyotish Chikitsa in the Vedic tradition, is the ancient discipline that correlates planetary positions at birth with an individual\'s physical constitution and health predispositions. Rooted in texts like the Brihat Parashara Hora Shastra (BPHS) and the Charaka Samhita, this system views the horoscope not as a medical diagnosis but as a constitutional blueprint — a map of inherent strengths and vulnerabilities encoded at the moment of birth.',
    editorialDoshaTitle: 'The Three Doshas and Their Planetary Rulers',
    editorialDosha: 'Ayurveda identifies three fundamental bio-energies (doshas) that govern all physiological functions. Vata (air + ether) is ruled by Saturn and Rahu — it governs the nervous system, movement, and elimination. Pitta (fire + water) is ruled by the Sun and Mars — it governs metabolism, digestion, and transformation. Kapha (earth + water) is ruled by the Moon, Jupiter, and Venus — it governs structure, lubrication, and immunity. The relative strength of these planetary rulers in your birth chart determines your Prakriti, or innate constitutional type.',
    editorialHousesTitle: 'Health-Significant Houses: 6th, 8th, and 12th',
    editorialHouses: 'In Jyotish, the 6th house (Ari Bhava) rules disease, the immune response, and daily health habits. The 8th house (Randhra Bhava) governs chronic illness, surgical interventions, and longevity. The 12th house (Vyaya Bhava) relates to hospitalisation, convalescence, and loss of vitality. Malefic planets occupying or aspecting these houses — or their lords being weak, combust, or debilitated — indicate specific vulnerabilities. Benefic influences on the same houses, conversely, grant constitutional resilience.',
    editorialPrakritiTitle: 'Prakriti: Your Birth Chart Constitution',
    editorialPrakriti: 'The Prakriti concept bridges Jyotish and Ayurveda. Your Ascendant sign, Moon sign, and the strongest planets in your chart collectively determine whether you are predominantly Vata, Pitta, or Kapha — or a dual-dosha type. This is not a personality quiz; it is derived from precise planetary longitudes computed for your exact birth time and coordinates. A Pitta-dominant chart with Mars conjunct the Ascendant lord, for instance, predisposes toward inflammatory conditions and heat-related disorders.',
    editorialDashaTitle: 'How Dashas Activate Health Vulnerabilities',
    editorialDasha: 'Vedic astrology uses Vimshottari Dasha, a 120-year planetary period system, to time life events. When the dasha of a planet that rules or afflicts the 6th, 8th, or 12th house becomes active, latent health vulnerabilities can manifest. Saturn\'s dasha may bring joint or nervous-system issues for Vata-dominant charts; Mars\'s dasha may trigger fevers or surgical situations for Pitta types. Our engine analyses these dasha transitions for the next 10 years and flags windows of elevated health sensitivity.',
    editorialMethodTitle: 'Our Computational Approach',
    editorialMethod: 'This tool implements classical BPHS house-based analysis — not generic sun-sign predictions. It computes planetary strengths (Shadbala), house affliction scores, dasha timelines, and current transit overlays to generate a personalised health profile. Each body region is mapped to its Jyotish house (Head = 1st, Throat = 2nd, etc.), and vulnerability scores are derived from the aggregate affliction of that house. The Charaka Samhita\'s disease-classification principles inform the disease susceptibility patterns. All calculations use Lahiri Ayanamsa by default and are performed entirely in your browser — no data is sent to external servers.',
  },
  hi: {
    title: 'चिकित्सा ज्योतिष',
    subtitle: 'प्रकृति · देह मानचित्र · स्वास्थ्य समयरेखा · रोग प्रारूप',
    desc: 'अपनी जन्म कुण्डली से अपनी आयुर्वेदिक प्रकृति, देह असुरक्षा मानचित्र और स्वास्थ्य असुरक्षा काल जानें।',
    disclaimer: 'यह पारम्परिक वैदिक ज्ञान केवल आत्म-जागरूकता के लिए है। यह चिकित्सा परामर्श नहीं है। किसी भी स्वास्थ्य समस्या के लिए योग्य चिकित्सक से परामर्श लें।',
    generate: 'चिकित्सा कुण्डली विश्लेषण',
    generating: 'विश्लेषण हो रहा है...',
    prakritiTitle: 'प्रकृति — आयुर्वेदिक संरचना',
    prakritiDesc: 'जन्म के समय ग्रह स्थितियों से निर्धारित प्रमुख दोष।',
    primary: 'प्रधान दोष',
    secondary: 'गौण दोष',
    vata: 'वात', pitta: 'पित्त', kapha: 'कफ',
    bodyMapTitle: 'देह असुरक्षा मानचित्र',
    bodyMapDesc: 'भाव दोष विश्लेषण पर आधारित प्रत्येक देह क्षेत्र का असुरक्षा अंक।',
    vulnerability: 'असुरक्षा',
    low: 'कम', moderate: 'मध्यम', high: 'अधिक',
    factors: 'कारक',
    noFactors: 'कोई दोष नहीं मिला',
    timelineTitle: 'स्वास्थ्य समयरेखा',
    timelineDesc: 'अगले 10 वर्षों के दशा-आधारित स्वास्थ्य असुरक्षा काल।',
    noWindows: 'अगले 10 वर्षों में कोई उल्लेखनीय स्वास्थ्य असुरक्षा काल नहीं।',
    diseaseTitle: 'रोग संवेदनशीलता प्रोफ़ाइल',
    topVuln: 'सर्वाधिक असुरक्षित देह तंत्र',
    sigPatterns: 'शास्त्रीय रोग प्रारूप',
    present: 'कुण्डली में उपस्थित',
    absent: 'अनुपस्थित',
    error: 'विश्लेषण विफल। कृपया पुनः प्रयास करें।',
    prognosisTitle: 'वर्तमान स्वास्थ्य पूर्वानुमान',
    prognosisDesc: 'चल रही दशा, गोचर और सक्रिय दोषों पर आधारित स्वास्थ्य दृष्टिकोण।',
    currentDasha: 'चल रही दशा',
    transitAlerts: 'गोचर चेतावनी',
    activeDosha: 'सक्रिय दोष',
    guidance: 'स्वास्थ्य मार्गदर्शन',
    overallOutlook: 'समग्र दृष्टिकोण',
    toneGood: 'अनुकूल', toneModerate: 'स्थिर', toneCaution: 'ध्यान आवश्यक', toneChallenging: 'विशेष देखभाल आवश्यक',
    doLabel: 'करें', avoidLabel: 'बचें', watchLabel: 'ध्यान दें',
    sadeSatiNote: 'साढ़े साती सक्रिय',
    noAlerts: 'स्वास्थ्य भावों पर कोई प्रमुख गोचर चेतावनी नहीं।',
    noDoshas: 'स्वास्थ्य को प्रभावित करने वाले कोई उल्लेखनीय दोष नहीं।',
    summaryLabel: 'सारांश',
    // ── Editorial content for AdSense ──
    editorialTitle: 'चिकित्सा ज्योतिष (ज्योतिष चिकित्सा) को समझें',
    editorialIntro: 'चिकित्सा ज्योतिष, वैदिक परम्परा में ज्योतिष चिकित्सा के नाम से जानी जाती है, एक प्राचीन विद्या है जो जन्म के समय ग्रहों की स्थिति को व्यक्ति की शारीरिक संरचना और स्वास्थ्य प्रवृत्तियों से जोड़ती है। बृहत् पराशर होरा शास्त्र (BPHS) और चरक संहिता जैसे ग्रन्थों पर आधारित यह पद्धति कुण्डली को चिकित्सा निदान नहीं, बल्कि एक संवैधानिक खाका मानती है — जन्म के क्षण में अंकित शक्तियों और कमजोरियों का मानचित्र।',
    editorialDoshaTitle: 'तीन दोष और उनके ग्रह स्वामी',
    editorialDosha: 'आयुर्वेद तीन मूलभूत जैव-ऊर्जाओं (दोषों) की पहचान करता है। वात (वायु + आकाश) के स्वामी शनि और राहु हैं — यह तंत्रिका तंत्र, गति और उत्सर्जन को नियंत्रित करता है। पित्त (अग्नि + जल) के स्वामी सूर्य और मंगल हैं — यह चयापचय, पाचन और रूपांतरण को नियंत्रित करता है। कफ (पृथ्वी + जल) के स्वामी चन्द्र, गुरु और शुक्र हैं — यह संरचना, स्नेहन और प्रतिरक्षा को नियंत्रित करता है। आपकी जन्म कुण्डली में इन ग्रह स्वामियों की सापेक्ष शक्ति आपकी प्रकृति निर्धारित करती है।',
    editorialHousesTitle: 'स्वास्थ्य-महत्वपूर्ण भाव: छठा, आठवाँ और बारहवाँ',
    editorialHouses: 'ज्योतिष में छठा भाव (अरि भाव) रोग, प्रतिरक्षा प्रतिक्रिया और दैनिक स्वास्थ्य आदतों पर शासन करता है। आठवाँ भाव (रंध्र भाव) दीर्घकालिक रोग, शल्य चिकित्सा और आयु को नियंत्रित करता है। बारहवाँ भाव (व्यय भाव) अस्पताल में भर्ती, स्वास्थ्य-लाभ और जीवनशक्ति के क्षय से सम्बन्धित है। इन भावों में पापग्रहों की उपस्थिति या दृष्टि — या उनके स्वामियों का दुर्बल, अस्त या नीच होना — विशिष्ट कमजोरियों का संकेत देता है।',
    editorialPrakritiTitle: 'प्रकृति: आपकी जन्म कुण्डली संरचना',
    editorialPrakriti: 'प्रकृति की अवधारणा ज्योतिष और आयुर्वेद के बीच सेतु है। आपकी लग्न राशि, चन्द्र राशि और कुण्डली के सबसे शक्तिशाली ग्रह मिलकर यह निर्धारित करते हैं कि आप मुख्यतः वात, पित्त या कफ प्रकृति के हैं। यह कोई व्यक्तित्व परीक्षा नहीं है — यह आपके सटीक जन्म समय और स्थानांक के लिए गणना किए गए ग्रह देशांतर से प्राप्त होती है।',
    editorialDashaTitle: 'दशाएँ स्वास्थ्य कमजोरियों को कैसे सक्रिय करती हैं',
    editorialDasha: 'वैदिक ज्योतिष विंशोत्तरी दशा का उपयोग करता है — 120 वर्ष की ग्रह अवधि प्रणाली। जब छठे, आठवें या बारहवें भाव पर शासन करने या उन्हें पीड़ित करने वाले ग्रह की दशा सक्रिय होती है, तो छिपी स्वास्थ्य कमजोरियाँ प्रकट हो सकती हैं। शनि की दशा वात-प्रधान कुण्डलियों में जोड़ों या तंत्रिका तंत्र की समस्याएँ ला सकती है; मंगल की दशा पित्त प्रकृतियों में ज्वर या शल्य स्थितियों को सक्रिय कर सकती है।',
    editorialMethodTitle: 'हमारा गणना दृष्टिकोण',
    editorialMethod: 'यह उपकरण शास्त्रीय BPHS भाव-आधारित विश्लेषण को लागू करता है — सामान्य राशिफल भविष्यवाणियाँ नहीं। यह ग्रह बल (षड्बल), भाव पीड़ा अंक, दशा समयरेखा और वर्तमान गोचर आच्छादन की गणना करके व्यक्तिगत स्वास्थ्य प्रोफ़ाइल तैयार करता है। प्रत्येक शरीर क्षेत्र को उसके ज्योतिष भाव से मैप किया गया है (सिर = प्रथम, गला = द्वितीय, आदि)। चरक संहिता के रोग-वर्गीकरण सिद्धान्त रोग संवेदनशीलता प्रारूपों को सूचित करते हैं।',
  },
  ta: {
    title: 'மருத்துவ ஜோதிடம்',
    subtitle: 'பிரகிருதி · உடல் வரைபடம் · சுகாதார காலவரிசை · நோய் வடிவங்கள்',
    desc: 'உங்கள் வேத ஜாதகத்திலிருந்து உங்கள் ஆயுர்வேத பிரகிருதி, உடல் பாதிப்பு வரைபடம் மற்றும் சுகாதார பாதிப்பு சாளரங்களை அறிந்துகொள்ளுங்கள்.',
    disclaimer: 'இது பாரம்பரிய வேத அறிவு - சுய விழிப்புணர்வுக்காக மட்டுமே. இது மருத்துவ ஆலோசனை அல்ல. எந்தவொரு உடல்நலப் பிரச்சினைக்கும் தகுதிவாய்ந்த மருத்துவரை அணுகவும்.',
    generate: 'மருத்துவ ஜாதகம் பகுப்பாய்வு',
    generating: 'பகுப்பாய்வு செய்கிறது...',
    prakritiTitle: 'பிரகிருதி — ஆயுர்வேத அமைப்பு',
    prakritiDesc: 'பிறப்பின் போது கிரக நிலைகளிலிருந்து வரும் முக்கிய தோஷங்கள்.',
    primary: 'முதல் தோஷம்',
    secondary: 'இரண்டாம் தோஷம்',
    vata: 'வாத', pitta: 'பித்த', kapha: 'கப',
    bodyMapTitle: 'உடல் பாதிப்பு வரைபடம்',
    bodyMapDesc: 'பாவ பாதிப்பு பகுப்பாய்வின் அடிப்படையில் ஒவ்வொரு உடல் பகுதியின் பாதிப்பு மதிப்பெண்.',
    vulnerability: 'பாதிப்பு',
    low: 'குறைவு', moderate: 'மிதமான', high: 'அதிகம்',
    factors: 'காரணிகள்',
    noFactors: 'எந்த பாதிப்பும் இல்லை',
    timelineTitle: 'சுகாதார காலவரிசை',
    timelineDesc: 'அடுத்த 10 ஆண்டுகளுக்கான தசா சார்ந்த சுகாதார பாதிப்பு சாளரங்கள்.',
    noWindows: 'அடுத்த 10 ஆண்டுகளில் குறிப்பிடத்தக்க சுகாதார பாதிப்பு சாளரங்கள் இல்லை.',
    diseaseTitle: 'நோய் உணர்திறன் சுயவிவரம்',
    topVuln: 'மிகவும் பாதிக்கப்படக்கூடிய உடல் அமைப்புகள்',
    sigPatterns: 'செம்மையான நோய் வடிவங்கள்',
    present: 'ஜாதகத்தில் உள்ளது',
    absent: 'இல்லை',
    error: 'பகுப்பாய்வு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    prognosisTitle: 'தற்போதைய உடல்நல முன்கணிப்பு',
    prognosisDesc: 'தசா, கோசாரம் மற்றும் தோஷங்களின் அடிப்படையிலான உடல்நல பார்வை.',
    currentDasha: 'நடப்பு தசா',
    transitAlerts: 'கோசார எச்சரிக்கைகள்',
    activeDosha: 'செயலில் உள்ள தோஷங்கள்',
    guidance: 'உடல்நல வழிகாட்டல்',
    overallOutlook: 'ஒட்டுமொத்த பார்வை',
    toneGood: 'சாதகமான', toneModerate: 'நிலையான', toneCaution: 'கவனம் தேவை', toneChallenging: 'கூடுதல் கவனிப்பு',
    doLabel: 'செய்யுங்கள்', avoidLabel: 'தவிர்க்கவும்', watchLabel: 'கவனிக்கவும்',
    sadeSatiNote: 'சாடே சாதி செயலில்',
    noAlerts: 'சுகாதார பாவங்களில் முக்கிய கோசார எச்சரிக்கைகள் இல்லை.',
    noDoshas: 'சுகாதாரத்தை பாதிக்கும் குறிப்பிடத்தக்க தோஷங்கள் இல்லை.',
    summaryLabel: 'சுருக்கம்',
    // ── Editorial content (English fallback for Tamil) ──
    editorialTitle: 'Understanding Medical Astrology (Jyotish Chikitsa)',
    editorialIntro: 'Medical Astrology, known as Jyotish Chikitsa in the Vedic tradition, is the ancient discipline that correlates planetary positions at birth with an individual\'s physical constitution and health predispositions. Rooted in texts like the Brihat Parashara Hora Shastra (BPHS) and the Charaka Samhita, this system views the horoscope not as a medical diagnosis but as a constitutional blueprint — a map of inherent strengths and vulnerabilities encoded at the moment of birth.',
    editorialDoshaTitle: 'The Three Doshas and Their Planetary Rulers',
    editorialDosha: 'Ayurveda identifies three fundamental bio-energies (doshas) that govern all physiological functions. Vata (air + ether) is ruled by Saturn and Rahu — it governs the nervous system, movement, and elimination. Pitta (fire + water) is ruled by the Sun and Mars — it governs metabolism, digestion, and transformation. Kapha (earth + water) is ruled by the Moon, Jupiter, and Venus — it governs structure, lubrication, and immunity. The relative strength of these planetary rulers in your birth chart determines your Prakriti, or innate constitutional type.',
    editorialHousesTitle: 'Health-Significant Houses: 6th, 8th, and 12th',
    editorialHouses: 'In Jyotish, the 6th house (Ari Bhava) rules disease, the immune response, and daily health habits. The 8th house (Randhra Bhava) governs chronic illness, surgical interventions, and longevity. The 12th house (Vyaya Bhava) relates to hospitalisation, convalescence, and loss of vitality. Malefic planets occupying or aspecting these houses — or their lords being weak, combust, or debilitated — indicate specific vulnerabilities. Benefic influences on the same houses, conversely, grant constitutional resilience.',
    editorialPrakritiTitle: 'Prakriti: Your Birth Chart Constitution',
    editorialPrakriti: 'The Prakriti concept bridges Jyotish and Ayurveda. Your Ascendant sign, Moon sign, and the strongest planets in your chart collectively determine whether you are predominantly Vata, Pitta, or Kapha — or a dual-dosha type. This is not a personality quiz; it is derived from precise planetary longitudes computed for your exact birth time and coordinates. A Pitta-dominant chart with Mars conjunct the Ascendant lord, for instance, predisposes toward inflammatory conditions and heat-related disorders.',
    editorialDashaTitle: 'How Dashas Activate Health Vulnerabilities',
    editorialDasha: 'Vedic astrology uses Vimshottari Dasha, a 120-year planetary period system, to time life events. When the dasha of a planet that rules or afflicts the 6th, 8th, or 12th house becomes active, latent health vulnerabilities can manifest. Saturn\'s dasha may bring joint or nervous-system issues for Vata-dominant charts; Mars\'s dasha may trigger fevers or surgical situations for Pitta types. Our engine analyses these dasha transitions for the next 10 years and flags windows of elevated health sensitivity.',
    editorialMethodTitle: 'Our Computational Approach',
    editorialMethod: 'This tool implements classical BPHS house-based analysis — not generic sun-sign predictions. It computes planetary strengths (Shadbala), house affliction scores, dasha timelines, and current transit overlays to generate a personalised health profile. Each body region is mapped to its Jyotish house (Head = 1st, Throat = 2nd, etc.), and vulnerability scores are derived from the aggregate affliction of that house. The Charaka Samhita\'s disease-classification principles inform the disease susceptibility patterns. All calculations use Lahiri Ayanamsa by default and are performed entirely in your browser — no data is sent to external servers.',
  },
  bn: {
    title: 'চিকিৎসা জ্যোতিষ',
    subtitle: 'প্রকৃতি · দেহ মানচিত্র · স্বাস্থ্য সময়রেখা · রোগ নমুনা',
    desc: 'আপনার বৈদিক জাতক থেকে আয়ুর্বেদিক প্রকৃতি, দেহ দুর্বলতার মানচিত্র এবং স্বাস্থ্য দুর্বলতার সময়কাল জানুন।',
    disclaimer: 'এটি ঐতিহ্যবাহী বৈদিক জ্ঞান — শুধুমাত্র আত্ম-সচেতনতার জন্য। এটি চিকিৎসা পরামর্শ নয়। যেকোনো স্বাস্থ্য সমস্যার জন্য যোগ্য চিকিৎসকের পরামর্শ নিন।',
    generate: 'চিকিৎসা জাতক বিশ্লেষণ',
    generating: 'বিশ্লেষণ করা হচ্ছে...',
    prakritiTitle: 'প্রকৃতি — আয়ুর্বেদিক সংবিধান',
    prakritiDesc: 'জন্মকালীন গ্রহের অবস্থান থেকে নির্ধারিত প্রধান দোষ।',
    primary: 'প্রধান দোষ',
    secondary: 'গৌণ দোষ',
    vata: 'বাত', pitta: 'পিত্ত', kapha: 'কফ',
    bodyMapTitle: 'দেহ দুর্বলতার মানচিত্র',
    bodyMapDesc: 'ভাব দোষ বিশ্লেষণের ভিত্তিতে প্রতিটি দেহ অঞ্চলের দুর্বলতার স্কোর।',
    vulnerability: 'দুর্বলতা',
    low: 'কম', moderate: 'মাঝারি', high: 'বেশি',
    factors: 'কারণ',
    noFactors: 'কোনো দোষ পাওয়া যায়নি',
    timelineTitle: 'স্বাস্থ্য সময়রেখা',
    timelineDesc: 'পরবর্তী ১০ বছরের দশা-ভিত্তিক স্বাস্থ্য দুর্বলতার সময়কাল।',
    noWindows: 'পরবর্তী ১০ বছরে উল্লেখযোগ্য স্বাস্থ্য দুর্বলতার সময়কাল নেই।',
    diseaseTitle: 'রোগ সংবেদনশীলতা প্রোফাইল',
    topVuln: 'সবচেয়ে দুর্বল দেহ সিস্টেম',
    sigPatterns: 'শাস্ত্রীয় রোগের নমুনা',
    present: 'জাতকে বিদ্যমান',
    absent: 'অনুপস্থিত',
    error: 'বিশ্লেষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    prognosisTitle: 'বর্তমান স্বাস্থ্য পূর্বাভাস',
    prognosisDesc: 'চলমান দশা, গোচর এবং সক্রিয় দোষের উপর ভিত্তি করে স্বাস্থ্য দৃষ্টিভঙ্গি।',
    currentDasha: 'চলমান দশা',
    transitAlerts: 'গোচর সতর্কতা',
    activeDosha: 'সক্রিয় দোষ',
    guidance: 'স্বাস্থ্য নির্দেশনা',
    overallOutlook: 'সামগ্রিক দৃষ্টিভঙ্গি',
    toneGood: 'অনুকূল', toneModerate: 'স্থিতিশীল', toneCaution: 'মনোযোগ প্রয়োজন', toneChallenging: 'বিশেষ যত্ন প্রয়োজন',
    doLabel: 'করুন', avoidLabel: 'এড়িয়ে চলুন', watchLabel: 'লক্ষ্য রাখুন',
    sadeSatiNote: 'সাড়ে সাতি সক্রিয়',
    noAlerts: 'স্বাস্থ্য ভাবে কোনো বড় গোচর সতর্কতা নেই।',
    noDoshas: 'স্বাস্থ্যকে প্রভাবিত করার মতো কোনো উল্লেখযোগ্য দোষ নেই।',
    summaryLabel: 'সারসংক্ষেপ',
    // ── Editorial content (English fallback for Bengali) ──
    editorialTitle: 'Understanding Medical Astrology (Jyotish Chikitsa)',
    editorialIntro: 'Medical Astrology, known as Jyotish Chikitsa in the Vedic tradition, is the ancient discipline that correlates planetary positions at birth with an individual\'s physical constitution and health predispositions. Rooted in texts like the Brihat Parashara Hora Shastra (BPHS) and the Charaka Samhita, this system views the horoscope not as a medical diagnosis but as a constitutional blueprint — a map of inherent strengths and vulnerabilities encoded at the moment of birth.',
    editorialDoshaTitle: 'The Three Doshas and Their Planetary Rulers',
    editorialDosha: 'Ayurveda identifies three fundamental bio-energies (doshas) that govern all physiological functions. Vata (air + ether) is ruled by Saturn and Rahu — it governs the nervous system, movement, and elimination. Pitta (fire + water) is ruled by the Sun and Mars — it governs metabolism, digestion, and transformation. Kapha (earth + water) is ruled by the Moon, Jupiter, and Venus — it governs structure, lubrication, and immunity. The relative strength of these planetary rulers in your birth chart determines your Prakriti, or innate constitutional type.',
    editorialHousesTitle: 'Health-Significant Houses: 6th, 8th, and 12th',
    editorialHouses: 'In Jyotish, the 6th house (Ari Bhava) rules disease, the immune response, and daily health habits. The 8th house (Randhra Bhava) governs chronic illness, surgical interventions, and longevity. The 12th house (Vyaya Bhava) relates to hospitalisation, convalescence, and loss of vitality. Malefic planets occupying or aspecting these houses — or their lords being weak, combust, or debilitated — indicate specific vulnerabilities. Benefic influences on the same houses, conversely, grant constitutional resilience.',
    editorialPrakritiTitle: 'Prakriti: Your Birth Chart Constitution',
    editorialPrakriti: 'The Prakriti concept bridges Jyotish and Ayurveda. Your Ascendant sign, Moon sign, and the strongest planets in your chart collectively determine whether you are predominantly Vata, Pitta, or Kapha — or a dual-dosha type. This is not a personality quiz; it is derived from precise planetary longitudes computed for your exact birth time and coordinates. A Pitta-dominant chart with Mars conjunct the Ascendant lord, for instance, predisposes toward inflammatory conditions and heat-related disorders.',
    editorialDashaTitle: 'How Dashas Activate Health Vulnerabilities',
    editorialDasha: 'Vedic astrology uses Vimshottari Dasha, a 120-year planetary period system, to time life events. When the dasha of a planet that rules or afflicts the 6th, 8th, or 12th house becomes active, latent health vulnerabilities can manifest. Saturn\'s dasha may bring joint or nervous-system issues for Vata-dominant charts; Mars\'s dasha may trigger fevers or surgical situations for Pitta types. Our engine analyses these dasha transitions for the next 10 years and flags windows of elevated health sensitivity.',
    editorialMethodTitle: 'Our Computational Approach',
    editorialMethod: 'This tool implements classical BPHS house-based analysis — not generic sun-sign predictions. It computes planetary strengths (Shadbala), house affliction scores, dasha timelines, and current transit overlays to generate a personalised health profile. Each body region is mapped to its Jyotish house (Head = 1st, Throat = 2nd, etc.), and vulnerability scores are derived from the aggregate affliction of that house. The Charaka Samhita\'s disease-classification principles inform the disease susceptibility patterns. All calculations use Lahiri Ayanamsa by default and are performed entirely in your browser — no data is sent to external servers.',
  },
} as const;

type LabelLocale = keyof typeof LABELS;

function L(locale: string, key: keyof typeof LABELS.en): string {
  const loc = (LABELS[locale as LabelLocale] ? locale : 'en') as LabelLocale;
  return LABELS[loc][key] ?? LABELS.en[key];
}

// ─── API response types ───────────────────────────────────────────────────────
interface MedicalResponse {
  prakriti: PrakritiResult;
  bodyMap: (BodyRegionResult & { bodyRegion: BodyRegion })[];
  healthTimeline: HealthWindow[];
  diseaseProfile: DiseaseProfileResult;
  healthPrognosis?: HealthPrognosis;
  disclaimer: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DisclaimerBanner({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
      <span className="text-amber-400 text-lg leading-none mt-0.5">⚕</span>
      <p className="text-amber-300/90 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function VulnerabilityBar({ score, locale }: { score: number; locale: string }) {
  const color =
    score < 30 ? 'bg-emerald-500' : score < 60 ? 'bg-amber-400' : 'bg-red-500';
  const label =
    score < 30 ? L(locale, 'low') : score < 60 ? L(locale, 'moderate') : L(locale, 'high');
  const textColor =
    score < 30 ? 'text-emerald-400' : score < 60 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-medium w-16 text-right ${textColor}`}>
        {score}/100 · {label}
      </span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: HealthWindow['severity'] }) {
  const cfg = {
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span
      className={`inline-block text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${cfg[severity]}`}
    >
      {severity}
    </span>
  );
}

function DonutSegment({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-text-secondary text-sm">{label}</span>
      <span className="ml-auto text-gold-light font-bold text-sm">{value}%</span>
    </div>
  );
}

// ─── Main page component ─────────────────────────────────────────────────────
interface SavedChart {
  id: string;
  label: string;
  birth_data: { name?: string; date: string; time: string; place: string; lat: number; lng: number; timezone?: string; ayanamsha?: string; relationship?: string };
}

export default function MedicalAstrologyPage() {
  const locale = useLocale() as Locale;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MedicalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [selectedName, setSelectedName] = useState<string>('');
  const user = useAuthStore(s => s.user);
  const isDevanagari = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  // Fetch saved charts when logged in
  useEffect(() => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase
      .from('saved_charts')
      .select('id, label, birth_data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) { console.error('[medical] saved charts fetch failed:', err); return; }
        if (data && data.length > 0) setSavedCharts(data as SavedChart[]);
      });
  }, [user]);

  async function handleSubmit(birthData: BirthData) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await authedFetch('/api/medical', {
        method: 'POST',
        body: JSON.stringify(birthData),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const msg = (json as { error?: string }).error ?? L(locale, 'error');
        console.error('[medical-astrology] API error:', msg);
        setError(msg);
        return;
      }

      const data = (await res.json()) as MedicalResponse;
      setResult(data);
    } catch (err) {
      console.error('[medical-astrology] Fetch failed:', err);
      setError(L(locale, 'error'));
    } finally {
      setLoading(false);
    }
  }

  const prakriti = result?.prakriti;
  const bodyMap = result?.bodyMap ?? [];
  const healthTimeline = result?.healthTimeline ?? [];
  const diseaseProfile = result?.diseaseProfile;

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <section className="py-12 px-4 text-center border-b border-gold-primary/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gold-light mb-3">
            {L(locale, 'title')}
          </h1>
          <p className="text-text-secondary text-sm md:text-base mb-2">
            {L(locale, 'subtitle')}
          </p>
          <p className="text-text-secondary/70 text-sm max-w-2xl mx-auto">
            {L(locale, 'desc')}
          </p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* ── Editorial Introduction (SEO / AdSense content) ──────────── */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gold-light" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
            {L(locale, 'editorialTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {L(locale, 'editorialIntro')}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Doshas card */}
            <div className="p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl space-y-2">
              <h3 className="text-base font-semibold text-gold-light" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {L(locale, 'editorialDoshaTitle')}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {L(locale, 'editorialDosha')}
              </p>
            </div>

            {/* Houses card */}
            <div className="p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl space-y-2">
              <h3 className="text-base font-semibold text-gold-light" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {L(locale, 'editorialHousesTitle')}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {L(locale, 'editorialHouses')}
              </p>
            </div>

            {/* Prakriti card */}
            <div className="p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl space-y-2">
              <h3 className="text-base font-semibold text-gold-light" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {L(locale, 'editorialPrakritiTitle')}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {L(locale, 'editorialPrakriti')}
              </p>
            </div>

            {/* Dasha card */}
            <div className="p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl space-y-2">
              <h3 className="text-base font-semibold text-gold-light" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {L(locale, 'editorialDashaTitle')}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {L(locale, 'editorialDasha')}
              </p>
            </div>
          </div>

          {/* Method — full-width */}
          <div className="p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
              {L(locale, 'editorialMethodTitle')}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {L(locale, 'editorialMethod')}
            </p>
          </div>
        </section>

        {/* ── Disclaimer (always visible) ─────────────────────────────── */}
        <DisclaimerBanner text={L(locale, 'disclaimer')} />

        {/* ── Saved Charts Picker ─────────────────────────────────────── */}
        {savedCharts.length > 0 && !result && (
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
              {locale === 'hi' ? 'परिवार का सदस्य चुनें' : locale === 'ta' ? 'குடும்ப உறுப்பினரைத் தேர்ந்தெடுக்கவும்' : locale === 'bn' ? 'পরিবারের সদস্য নির্বাচন করুন' : 'Select a Family Member'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedCharts.map((c) => {
                const name = c.birth_data.name || c.label;
                const rel = c.birth_data.relationship;
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setSelectedName(name);
                      handleSubmit({
                        name,
                        date: c.birth_data.date,
                        time: c.birth_data.time,
                        place: c.birth_data.place,
                        lat: c.birth_data.lat,
                        lng: c.birth_data.lng,
                        timezone: c.birth_data.timezone || 'Asia/Kolkata',
                        ayanamsha: c.birth_data.ayanamsha || 'lahiri',
                      });
                    }}
                    className={`text-left rounded-xl border p-4 transition-all ${
                      loading && selectedName === name
                        ? 'border-gold-primary/40 bg-gold-primary/10'
                        : 'border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gold-light font-bold text-sm truncate" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                        {name}
                      </span>
                      {rel && rel !== 'self' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-medium capitalize shrink-0">
                          {rel}
                        </span>
                      )}
                      {loading && selectedName === name && (
                        <span className="ml-auto text-xs text-gold-primary animate-pulse">
                          {L(locale, 'generating')}
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary text-xs font-mono">{c.birth_data.date} | {c.birth_data.time}</p>
                    <p className="text-text-secondary/60 text-xs truncate">{c.birth_data.place}</p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Or enter new details ─────────────────────────────────────── */}
        {!result && (
          <section>
            {savedCharts.length > 0 && (
              <div className="text-center text-text-secondary text-sm mb-4 mt-2">
                {locale === 'hi' ? 'या नए विवरण दर्ज करें' : locale === 'ta' ? 'அல்லது புதிய விவரங்களை உள்ளிடவும்' : locale === 'bn' ? 'অথবা নতুন বিবরণ লিখুন' : 'Or enter new details'}
              </div>
            )}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
              <BirthForm
                onSubmit={(data) => handleSubmit(data)}
                loading={loading}
              />
            </div>
          </section>
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >

              {/* ── 1. Prakriti Card ──────────────────────────────────── */}
              {prakriti && (
                <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-gold-light mb-1">
                    {L(locale, 'prakritiTitle')}
                  </h2>
                  <p className="text-text-secondary text-sm mb-6">
                    {L(locale, 'prakritiDesc')}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Dosha bars */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-sky-300 font-medium">{L(locale, 'vata')}</span>
                          <span className="text-sky-300/70">{prakriti.percentages.vata}%</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-400 rounded-full transition-all duration-700"
                            style={{ width: `${prakriti.percentages.vata}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-orange-300 font-medium">{L(locale, 'pitta')}</span>
                          <span className="text-orange-300/70">{prakriti.percentages.pitta}%</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-400 rounded-full transition-all duration-700"
                            style={{ width: `${prakriti.percentages.pitta}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-emerald-300 font-medium">{L(locale, 'kapha')}</span>
                          <span className="text-emerald-300/70">{prakriti.percentages.kapha}%</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${prakriti.percentages.kapha}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Primary / Secondary dosha */}
                    <div className="flex flex-col justify-center gap-4">
                      <div className="p-4 bg-gold-primary/10 border border-gold-primary/20 rounded-xl">
                        <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">
                          {L(locale, 'primary')}
                        </p>
                        <p className="text-gold-light text-2xl font-bold">
                          {prakriti.primaryDosha}
                        </p>
                      </div>
                      <div className="p-4 bg-white/[0.06] border border-white/10 rounded-xl">
                        <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">
                          {L(locale, 'secondary')}
                        </p>
                        <p className="text-text-primary text-xl font-semibold">
                          {prakriti.secondaryDosha}
                        </p>
                      </div>
                      <p className="text-text-secondary/60 text-xs text-center">
                        {prakriti.prakritiType} Prakriti
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* ── 2. Body Vulnerability Map ────────────────────────── */}
              {bodyMap.length > 0 && (
                <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-gold-light mb-1">
                    {L(locale, 'bodyMapTitle')}
                  </h2>
                  <p className="text-text-secondary text-sm mb-6">
                    {L(locale, 'bodyMapDesc')}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {bodyMap.map((region) => {
                      const regionName =
                        locale === 'hi'
                          ? region.bodyRegion.hi
                          : locale === 'ta'
                          ? region.bodyRegion.ta
                          : locale === 'bn'
                          ? region.bodyRegion.bn
                          : region.bodyRegion.en;

                      return (
                        <div
                          key={region.house}
                          className="p-4 bg-bg-primary/60 border border-white/5 rounded-xl space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-text-secondary text-xs">
                                House {region.house}
                              </span>
                              <p className="text-text-primary text-sm font-medium">
                                {regionName}
                              </p>
                            </div>
                            <span className="text-text-secondary text-xs">
                              {region.vulnerability}/100
                            </span>
                          </div>
                          <VulnerabilityBar
                            score={region.vulnerability}
                            locale={locale}
                          />
                          {region.factors.length > 0 && (
                            <details className="text-xs text-text-secondary/70 mt-1">
                              <summary className="cursor-pointer hover:text-text-secondary">
                                {L(locale, 'factors')} ({region.factors.length})
                              </summary>
                              <ul className="mt-1 space-y-0.5 list-disc list-inside pl-1">
                                {region.factors.map((f, i) => (
                                  <li key={i}>{f}</li>
                                ))}
                              </ul>
                            </details>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── 3. Health Timeline ───────────────────────────────── */}
              <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gold-light mb-1">
                  {L(locale, 'timelineTitle')}
                </h2>
                <p className="text-text-secondary text-sm mb-6">
                  {L(locale, 'timelineDesc')}
                </p>

                {healthTimeline.length === 0 ? (
                  <p className="text-text-secondary/60 text-sm">
                    {L(locale, 'noWindows')}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {healthTimeline.map((w, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 bg-bg-primary/60 border border-white/5 rounded-xl"
                      >
                        <div className="flex-shrink-0">
                          <SeverityBadge severity={w.severity} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-x-3 gap-y-1 items-baseline mb-1">
                            <span className="text-text-primary text-sm font-medium">
                              {w.type}
                            </span>
                            <span className="text-text-secondary/60 text-xs">
                              {w.startDate} → {w.endDate}
                            </span>
                          </div>
                          <p className="text-text-secondary text-sm">
                            {w.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ── 4. Disease Profile ───────────────────────────────── */}
              {diseaseProfile && (
                <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-gold-light mb-6">
                    {L(locale, 'diseaseTitle')}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Top vulnerabilities */}
                    <div>
                      <h3 className="text-base font-semibold text-text-primary mb-4">
                        {L(locale, 'topVuln')}
                      </h3>
                      {diseaseProfile.topVulnerabilities.length === 0 ? (
                        <p className="text-text-secondary/60 text-sm">{L(locale, 'noFactors')}</p>
                      ) : (
                        <div className="space-y-4">
                          {diseaseProfile.topVulnerabilities.map((v, i) => (
                            <div key={i}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-primary font-medium">
                                  {v.system}
                                </span>
                                <span className="text-text-secondary">{v.score}/100</span>
                              </div>
                              <VulnerabilityBar score={v.score} locale={locale} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Signature patterns */}
                    <div>
                      <h3 className="text-base font-semibold text-text-primary mb-4">
                        {L(locale, 'sigPatterns')}
                      </h3>
                      <div className="space-y-3">
                        {diseaseProfile.signaturePatterns.map((p) => (
                          <div
                            key={p.id}
                            className={`p-3 rounded-xl border text-sm ${
                              p.present
                                ? 'bg-red-500/10 border-red-500/25'
                                : 'bg-white/3 border-white/8'
                            }`}
                          >
                            <div className="flex justify-between items-center gap-2 mb-1">
                              <span
                                className={`font-medium ${p.present ? 'text-red-300' : 'text-text-secondary'}`}
                              >
                                {p.name}
                              </span>
                              <span
                                className={`text-xs font-semibold ${p.present ? 'text-red-400' : 'text-text-secondary/50'}`}
                              >
                                {p.present ? L(locale, 'present') : L(locale, 'absent')}
                              </span>
                            </div>
                            {p.present && (
                              <p className="text-text-secondary/80 text-xs leading-relaxed">
                                {p.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ── 5. Health Prognosis ─────────────────────────────── */}
              {result?.healthPrognosis && (() => {
                const prog = result.healthPrognosis!;
                const toneCfg: Record<HealthPrognosis['overallTone'], { bg: string; text: string; border: string; label: keyof typeof LABELS.en }> = {
                  good:        { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'toneGood' },
                  moderate:    { bg: 'bg-sky-500/15',     text: 'text-sky-400',     border: 'border-sky-500/30',     label: 'toneModerate' },
                  caution:     { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30',   label: 'toneCaution' },
                  challenging: { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30',     label: 'toneChallenging' },
                };
                const tone = toneCfg[prog.overallTone];
                const recIcon: Record<string, string> = { do: '+', avoid: '!', watch: '~' };
                const recColor: Record<string, string> = { do: 'text-emerald-400', avoid: 'text-red-400', watch: 'text-amber-400' };
                const recLabelKey: Record<string, keyof typeof LABELS.en> = { do: 'doLabel', avoid: 'avoidLabel', watch: 'watchLabel' };

                return (
                  <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
                    {/* Header + tone badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gold-light mb-1">
                          {L(locale, 'prognosisTitle')}
                        </h2>
                        <p className="text-text-secondary text-sm">
                          {L(locale, 'prognosisDesc')}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${tone.bg} ${tone.text} ${tone.border}`}>
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {L(locale, tone.label)}
                      </span>
                    </div>

                    <div className="space-y-6">
                      {/* Current Dasha */}
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wider">
                          {L(locale, 'currentDasha')}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 text-xs font-semibold border border-purple-500/20">
                            {prog.currentDasha.mahadasha} Mahadasha
                          </span>
                          {prog.currentDasha.antardasha && (
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                              {prog.currentDasha.antardasha} Antardasha
                            </span>
                          )}
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {tl(prog.currentDasha.healthImplication, locale)}
                        </p>
                      </div>

                      {/* Transit Alerts */}
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wider">
                          {L(locale, 'transitAlerts')}
                        </h3>
                        {prog.transitAlerts.length === 0 ? (
                          <p className="text-text-secondary/60 text-sm">{L(locale, 'noAlerts')}</p>
                        ) : (
                          <div className="space-y-2">
                            {prog.transitAlerts.map((a, i) => {
                              const sevCfg: Record<string, string> = {
                                mild: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                                moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                                high: 'bg-red-500/20 text-red-400 border-red-500/30',
                              };
                              return (
                                <div key={i} className="flex items-start gap-3 p-3 bg-bg-primary/60 border border-white/5 rounded-xl">
                                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border shrink-0 mt-0.5 ${sevCfg[a.severity] ?? sevCfg.mild}`}>
                                    {a.severity}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-text-primary text-sm font-medium">{a.planet} &middot; H{a.house}</span>
                                    <p className="text-text-secondary text-xs mt-0.5">{tl(a.effect, locale)}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Active Doshas */}
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wider">
                          {L(locale, 'activeDosha')}
                        </h3>
                        {prog.activeDoshas.length === 0 ? (
                          <p className="text-text-secondary/60 text-sm">{L(locale, 'noDoshas')}</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {prog.activeDoshas.map((d, i) => (
                              <div key={i} className="px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                <span className="text-orange-300 text-sm font-semibold">{d.name}</span>
                                <p className="text-text-secondary text-xs mt-0.5">{tl(d.note, locale)}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Sade Sati note */}
                      {prog.sadeSatiActive && prog.sadeSatiNote && (
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                          <span className="text-indigo-300 text-sm font-bold">{L(locale, 'sadeSatiNote')}</span>
                          <p className="text-text-secondary text-sm mt-1">{tl(prog.sadeSatiNote, locale)}</p>
                        </div>
                      )}

                      {/* Recommendations */}
                      {prog.recommendations.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
                            {L(locale, 'guidance')}
                          </h3>
                          <div className="space-y-2">
                            {prog.recommendations.map((r, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-bg-primary/60 border border-white/5 rounded-xl">
                                <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${recColor[r.type] ?? 'text-text-secondary'} bg-white/[0.06] shrink-0 mt-0.5`}>
                                  {recIcon[r.type] ?? '?'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <span className={`text-xs font-bold uppercase tracking-wide ${recColor[r.type] ?? 'text-text-secondary'}`}>
                                    {L(locale, recLabelKey[r.type] ?? 'watchLabel')}
                                  </span>
                                  <p className="text-text-secondary text-sm mt-0.5">{tl(r.text, locale)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      <div className="pt-4 border-t border-white/5">
                        <h3 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wider">
                          {L(locale, 'summaryLabel')}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {tl(prog.summary, locale)}
                        </p>
                      </div>
                    </div>
                  </section>
                );
              })()}

              {/* ── Closing Disclaimer ───────────────────────────────── */}
              <DisclaimerBanner text={L(locale, 'disclaimer')} />

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
