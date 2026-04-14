'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertTriangle, Shield, Zap } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { dateToJD, sunLongitude, toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';
import { Link } from '@/lib/i18n/navigation';
import type { Locale , LocaleText} from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface RetroPeriod {
  planetId: number;
  planetName: LocaleText;
  planetColor: string;
  startDate: string;
  endDate: string;
  startSign: number;
  startSignName: LocaleText;
  endSign: number;
  endSignName: LocaleText;
  durationDays: number;
}

interface CombustEvent {
  planetId: number;
  planetName: LocaleText;
  planetColor: string;
  startDate: string;
  endDate: string;
  durationDays: number;
}

// ─── Retrograde interpretations by planet ────────────────────────────────────

const RETRO_MEANING: Record<number, { general: LocaleText; dos: LocaleText; donts: LocaleText }> = {
  // Mercury (3)
  3: {
    general: {
      en: 'Mercury retrograde disrupts communication, technology, travel, and contracts. Misunderstandings multiply, emails go astray, devices malfunction, and travel plans face delays. Mercury rules information flow — when it reverses, that flow gets turbulent.',
      hi: 'बुध वक्री संचार, तकनीक, यात्रा और अनुबंधों को बाधित करता है। गलतफहमियाँ बढ़ती हैं, ईमेल भटक जाते हैं, उपकरण खराब होते हैं और यात्रा योजनाएँ विलंबित होती हैं।',
    },
    dos: {
      en: 'Review old projects, reconnect with old contacts, revise documents, back up data, double-check all communications, slow down and reflect.',
      hi: 'पुरानी परियोजनाओं की समीक्षा करें, पुराने संपर्कों से जुड़ें, दस्तावेज़ों को संशोधित करें, डेटा बैकअप लें, सभी संवाद दोबारा जाँचें।',
    },
    donts: {
      en: 'Avoid signing contracts, launching products, buying electronics, starting new ventures, or making major decisions based on incomplete information.',
      hi: 'अनुबंध पर हस्ताक्षर, उत्पाद लॉन्च, इलेक्ट्रॉनिक्स खरीदना, नया उद्यम शुरू करना, या अपूर्ण जानकारी पर बड़े निर्णय लेने से बचें।',
    },
  },
  // Venus (5)
  5: {
    general: {
      en: 'Venus retrograde turns the heart inward. Past lovers resurface, relationships are re-evaluated, and what you value shifts. Beauty, art, and luxury feel unsatisfying. This is a period to reassess what truly matters in love and money — not to start new romances or make expensive purchases.',
      hi: 'शुक्र वक्री हृदय को अंतर्मुखी बनाता है। पुराने प्रेमी फिर से प्रकट होते हैं, संबंधों का पुनर्मूल्यांकन होता है। सौंदर्य, कला और विलासिता असंतोषजनक लगती है।',
    },
    dos: {
      en: 'Revisit creative projects, reconnect with your aesthetic values, journal about what you truly desire in relationships, practice self-love.',
      hi: 'सृजनात्मक परियोजनाओं पर लौटें, अपने सौंदर्य मूल्यों से पुनः जुड़ें, संबंधों में अपनी सच्ची इच्छा पर चिंतन करें।',
    },
    donts: {
      en: 'Avoid starting new relationships, getting married, cosmetic procedures, luxury purchases, or drastic changes to appearance.',
      hi: 'नए संबंध शुरू करना, विवाह, सौंदर्य प्रक्रियाएँ, विलासिता खरीदारी, या दिखावट में भारी बदलाव से बचें।',
    },
  },
  // Mars (2)
  2: {
    general: {
      en: 'Mars retrograde saps initiative and redirects anger inward. Projects stall, conflicts simmer without resolution, and physical energy dips. Actions taken during Mars retrograde often need to be redone later. This is a time to strategize, not charge ahead.',
      hi: 'मंगल वक्री पहल को कमजोर करता है और क्रोध को अंदर की ओर मोड़ता है। परियोजनाएँ रुकती हैं, संघर्ष बिना समाधान के सुलगते हैं, और शारीरिक ऊर्जा घटती है।',
    },
    dos: {
      en: 'Review ongoing projects, refine strategy before acting, channel energy into planning and internal work, maintain fitness routines gently.',
      hi: 'चल रही परियोजनाओं की समीक्षा करें, कार्य से पहले रणनीति परिष्कृत करें, ऊर्जा को योजना में लगाएँ, व्यायाम कोमलता से करें।',
    },
    donts: {
      en: 'Avoid starting lawsuits, initiating conflicts, surgery (if elective), buying vehicles/property, or beginning aggressive campaigns.',
      hi: 'मुकदमे, संघर्ष शुरू करना, वैकल्पिक शल्यचिकित्सा, वाहन/संपत्ति खरीदना, या आक्रामक अभियान शुरू करने से बचें।',
    },
  },
  // Jupiter (4)
  4: {
    general: {
      en: 'Jupiter retrograde turns wisdom inward. External growth slows so inner growth can accelerate. Teachers and gurus may disappoint. Financial expansion stalls. But this is the best time for spiritual study, philosophical reflection, and developing your own inner wisdom rather than relying on external authorities.',
      hi: 'गुरु वक्री ज्ञान को अंतर्मुखी बनाता है। बाह्य विकास धीमा होता है ताकि आंतरिक विकास तेज हो सके। गुरु और शिक्षक निराश कर सकते हैं। लेकिन यह आध्यात्मिक अध्ययन और दार्शनिक चिंतन का सर्वोत्तम समय है।',
    },
    dos: {
      en: 'Deepen spiritual practice, study philosophy, revisit old teachings, reassess your beliefs, mentor yourself, complete pending education.',
      hi: 'आध्यात्मिक अभ्यास गहन करें, दर्शन का अध्ययन करें, पुरानी शिक्षाओं पर लौटें, अपने विश्वासों का पुनर्मूल्यांकन करें।',
    },
    donts: {
      en: 'Avoid starting new educational programs, long-distance travel for growth, major investments, legal proceedings, or religious ceremonies.',
      hi: 'नए शैक्षिक कार्यक्रम, विकास हेतु लंबी यात्रा, बड़े निवेश, कानूनी कार्यवाही, या धार्मिक समारोह शुरू करने से बचें।',
    },
  },
  // Saturn (6)
  6: {
    general: {
      en: 'Saturn retrograde eases external pressure but increases internal reckoning. Karma that was delayed now surfaces for processing. Structures and commitments are tested from within. Authority figures may become unreliable. This is a time to take responsibility for your own discipline rather than having it imposed externally.',
      hi: 'शनि वक्री बाहरी दबाव कम करता है लेकिन आंतरिक लेखा-जोखा बढ़ाता है। विलंबित कर्म अब सतह पर आता है। संरचनाएँ और प्रतिबद्धताएँ भीतर से परखी जाती हैं।',
    },
    dos: {
      en: 'Restructure habits, reassess career commitments, clear karmic debts, practice discipline voluntarily, complete pending responsibilities.',
      hi: 'आदतों का पुनर्गठन, करियर प्रतिबद्धताओं का पुनर्मूल्यांकन, कार्मिक ऋण चुकाएँ, स्वेच्छा से अनुशासन अभ्यास करें।',
    },
    donts: {
      en: 'Avoid starting new long-term commitments, changing career, real estate transactions, or defying legitimate authority figures.',
      hi: 'नई दीर्घकालिक प्रतिबद्धताएँ, करियर बदलना, अचल संपत्ति लेनदेन, या वैध अधिकारियों की अवज्ञा से बचें।',
    },
  },
};

// Combustion meaning by planet
const COMBUST_MEANING: Record<number, LocaleText> = {
  2: { en: 'Mars combust weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', hi: 'मंगल अस्त साहस, पहल और शारीरिक ऊर्जा को कमजोर करता है। संघर्ष से बचें। भाई-बहनों को कठिनाई हो सकती है।', sa: 'मंगल अस्त साहस, पहल च शारीरिक ऊर्जा को कमजोर करता अस्ति। संघर्ष तः वर्जयन्तु। भाई-बहनों को कठिनाई हो सकती अस्ति।', mai: 'मंगल अस्त साहस, पहल आ शारीरिक ऊर्जा केँ कमजोर करता अछि। संघर्ष सँ बचें। भाई-बहनों केँ कठिनाई हो सकती अछि।', mr: 'मंगल अस्त साहस, पहल आणि शारीरिक ऊर्जा ला कमजोर करता आहे. संघर्ष पासून टाळा। भाई-बहनों ला कठिनाई हो सकती आहे.', ta: 'செவ்வாய் அஸ்தமனம் weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', te: 'కుజ అస్తంగతం weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', bn: 'মঙ্গল অস্ত weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', kn: 'ಕುಜ ಅಸ್ತ weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', gu: 'મંગળ અસ્ત weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.' },
  3: { en: 'Mercury combust clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', hi: 'बुध अस्त बुद्धि को धुँधला करता है, संवाद बाधित करता है। परीक्षा, वार्ता या महत्वपूर्ण पत्राचार के लिए अनुकूल नहीं।', sa: 'बुध अस्त बुद्धि को धुँधला करता है, संवाद बाधित करता अस्ति। परीक्षा, वार्ता या महत्वपूर्ण पत्राचार के लिए अनुकूल नहीं।', mai: 'बुध अस्त बुद्धि केँ धुँधला करता है, संवाद बाधित करता अछि। परीक्षा, वार्ता अथवा महत्वपूर्ण पत्राचार के लिए अनुकूल नहीं।', mr: 'बुध अस्त बुद्धि ला धुँधला करता है, संवाद बाधित करता आहे. परीक्षा, वार्ता किंवा महत्वपूर्ण पत्राचार के लिए अनुकूल नहीं।', ta: 'புதன் அஸ்தமனம் clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', te: 'బుధ అస్తంగతం clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', bn: 'বুধ অস্ত clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', kn: 'ಬುಧ ಅಸ್ತ clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', gu: 'બુધ અસ્ત clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.' },
  4: { en: 'Jupiter combust diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', hi: 'गुरु अस्त ज्ञान, सौभाग्य और गुरु मार्गदर्शन कम करता है। आध्यात्मिक अभ्यास खोखला लगता है। वित्तीय निर्णय प्रभावित।', sa: 'गुरु अस्त ज्ञानम्, सौभाग्य च गुरु मार्गदर्शन कम करता अस्ति। आध्यात्मिक अभ्यास खोखला लगता अस्ति। वित्तीय निर्णय प्रभावःित।', mai: 'गुरु अस्त ज्ञान, सौभाग्य आ गुरु मार्गदर्शन कम करता अछि। आध्यात्मिक अभ्यास खोखला लगता अछि। वित्तीय निर्णय प्रभावित।', mr: 'गुरु अस्त ज्ञान, सौभाग्य आणि गुरु मार्गदर्शन कम करता आहे. आध्यात्मिक अभ्यास खोखला लगता आहे. वित्तीय निर्णय प्रभावित।', ta: 'குரு அஸ்தமனம் diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', te: 'గురు అస్తంగతం diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', bn: 'বৃহস্পতি অস্ত diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', kn: 'ಗುರು ಅಸ್ತ diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', gu: 'ગુરુ અસ્ત diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.' },
  5: { en: 'Venus combust dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', hi: 'शुक्र अस्त सुख, प्रेम, सृजनशीलता और विलासिता को सुखा देता है। संबंध असंतोषजनक लगते हैं।', sa: 'शुक्र अस्त सुख, प्रेम, सृजनशीलता च विलासिता को सुखा देता अस्ति। संबंध असंतोषजनक लगते सन्ति।', mai: 'शुक्र अस्त सुख, प्रेम, सृजनशीलता आ विलासिता केँ सुखा देता अछि। संबंध असंतोषजनक लगते अछि।', mr: 'शुक्र अस्त सुख, प्रेम, सृजनशीलता आणि विलासिता ला सुखा देता आहे. संबंध असंतोषजनक लगते आहेत.', ta: 'சுக்ரன் அஸ்தமனம் dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', te: 'శుక్ర అస్తంగతం dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', bn: 'শুক্র অস্ত dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', kn: 'ಶುಕ್ರ ಅಸ್ತ dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', gu: 'શુક્ર અસ્ત dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.' },
  6: { en: 'Saturn combust weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', hi: 'शनि अस्त अनुशासन, दीर्घकालिक योजना और संरचनात्मक स्थिरता को कमजोर करता है।', sa: 'शनि अस्त अनुशासन, दीर्घकालिक योजना च संरचनात्मक स्थिरता को कमजोर करता अस्ति।', mai: 'शनि अस्त अनुशासन, दीर्घकालिक योजना आ संरचनात्मक स्थिरता केँ कमजोर करता अछि।', mr: 'शनि अस्त अनुशासन, दीर्घकालिक योजना आणि संरचनात्मक स्थिरता ला कमजोर करता आहे.', ta: 'சனி அஸ்தமனம் weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', te: 'శని అస్తంగతం weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', bn: 'শনি অস্ত weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', kn: 'ಶನಿ ಅಸ್ತ weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', gu: 'શનિ અસ્ત weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.' },
};

// ─── House transit interpretation from Moon sign ─────────────────────────────

const HOUSE_RETRO_EFFECT: Record<number, LocaleText> = {
  1: { en: 'Transiting your 1st house — affects health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', hi: 'आपके प्रथम भाव में गोचर — स्वास्थ्य, आत्म-छवि और व्यक्तिगत पहल प्रभावित। शरीर का विशेष ध्यान रखें।', sa: 'भवतः प्रथम भावः में गोचर — स्वास्थ्य, आत्म-छवि च व्यक्तिगत पहल प्रभावःित। शरीर का विशेष ध्यान रखें।', mai: 'अहाँक प्रथम भाव मे गोचर — स्वास्थ्य, आत्म-छवि आ व्यक्तिगत पहल प्रभावित। शरीर का विशेष ध्यान रखें।', mr: 'तुमच्या प्रथम भाव मध्ये गोचर — स्वास्थ्य, आत्म-छवि आणि व्यक्तिगत पहल प्रभावित। शरीर का विशेष ध्यान रखें।', ta: 'உங்கள் 1ஆம் வீட்டில் கோசாரம் — பாதிக்கிறது: health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', te: 'మీ 1వ భావంలో సంచారం — ప్రభావితం: health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', bn: 'আপনার 1ম ভাবে গোচর — প্রভাবিত করে: health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', kn: 'ನಿಮ್ಮ 1ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — ಪ್ರಭಾವಿಸುತ್ತದೆ: health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', gu: 'તમારા 1મા ભાવમાં ગોચર — અસર કરે છે: health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.' },
  2: { en: 'Transiting your 2nd house — affects finances, family harmony, and speech. Avoid major purchases and be careful with words.', hi: 'आपके द्वितीय भाव में — वित्त, पारिवारिक सद्भाव और वाणी प्रभावित। बड़ी खरीदारी से बचें।', sa: 'भवतः द्वितीय भावः में — वित्त, पारिवारिक सद्भावः च वाणी प्रभावःित। बड़ी खरीदारी तः वर्जयन्तु।', mai: 'अहाँक द्वितीय भाव मे — वित्त, पारिवारिक सद्भाव आ वाणी प्रभावित। बड़ी खरीदारी सँ बचें।', mr: 'तुमच्या द्वितीय भाव मध्ये — वित्त, पारिवारिक सद्भाव आणि वाणी प्रभावित। बड़ी खरीदारी पासून टाळा।', ta: 'உங்கள் 2ஆம் வீட்டில் கோசாரம் — பாதிக்கிறது: finances, family harmony, and speech. தவிர்க்கவும்: major purchases and be careful with words.', te: 'మీ 2వ భావంలో సంచారం — ప్రభావితం: finances, family harmony, and speech. నివారించండి: major purchases and be careful with words.', bn: 'আপনার 2ম ভাবে গোচর — প্রভাবিত করে: finances, family harmony, and speech. এড়িয়ে চলুন: major purchases and be careful with words.', kn: 'ನಿಮ್ಮ 2ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — ಪ್ರಭಾವಿಸುತ್ತದೆ: finances, family harmony, and speech. ತಪ್ಪಿಸಿ: major purchases and be careful with words.', gu: 'તમારા 2મા ભાવમાં ગોચર — અસર કરે છે: finances, family harmony, and speech. ટાળો: major purchases and be careful with words.' },
  3: { en: 'Transiting your 3rd house — affects courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', hi: 'आपके तृतीय भाव में — साहस, भाई-बहन, छोटी यात्रा प्रभावित। संदेश विलंबित या गलत समझे जा सकते हैं।', sa: 'भवतः तृतीय भावः में — साहस, भाई-बहन, छोटी यात्रा प्रभावःित। संदेश विलंबित या गलत समझे जा सकते सन्ति।', mai: 'अहाँक तृतीय भाव मे — साहस, भाई-बहन, छोटी यात्रा प्रभावित। संदेश विलंबित अथवा गलत समझे जा सकते अछि।', mr: 'तुमच्या तृतीय भाव मध्ये — साहस, भाई-बहन, छोटी यात्रा प्रभावित। संदेश विलंबित किंवा गलत समझे जा सकते आहेत.', ta: 'உங்கள் 3ஆம் வீட்டில் கோசாரம் — பாதிக்கிறது: courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', te: 'మీ 3వ భావంలో సంచారం — ప్రభావితం: courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', bn: 'আপনার 3ম ভাবে গোচর — প্রভাবিত করে: courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', kn: 'ನಿಮ್ಮ 3ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — ಪ್ರಭಾವಿಸುತ್ತದೆ: courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', gu: 'તમારા 3મા ભાવમાં ગોચર — અસર કરે છે: courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.' },
  4: { en: 'Transiting your 4th house — affects home, mother, emotional peace, and property. Domestic disruptions possible. Avoid property transactions.', hi: 'आपके चतुर्थ भाव में — घर, माता, मानसिक शांति प्रभावित। घरेलू बाधाएँ संभव। संपत्ति लेनदेन से बचें।', sa: 'भवतः चतुर्थ भावः में — घर, माता, मानसिक शांति प्रभावःित। घरेलू बाधाएँ संभव। संपत्ति लेनदेन तः वर्जयन्तु।', mai: 'अहाँक चतुर्थ भाव मे — घर, माता, मानसिक शांति प्रभावित। घरेलू बाधाएँ संभव। संपत्ति लेनदेन सँ बचें।', mr: 'तुमच्या चतुर्थ भाव मध्ये — घर, माता, मानसिक शांति प्रभावित। घरेलू बाधाएँ संभव। संपत्ति लेनदेन पासून टाळा।', ta: 'உங்கள் 4ஆம் வீட்டில் கோசாரம் — பாதிக்கிறது: home, mother, emotional peace, and property. Domestic disruptions possible. தவிர்க்கவும்: property transactions.', te: 'మీ 4వ భావంలో సంచారం — ప్రభావితం: home, mother, emotional peace, and property. Domestic disruptions possible. నివారించండి: property transactions.', bn: 'আপনার 4ম ভাবে গোচর — প্রভাবিত করে: home, mother, emotional peace, and property. Domestic disruptions possible. এড়িয়ে চলুন: property transactions.', kn: 'ನಿಮ್ಮ 4ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — ಪ್ರಭಾವಿಸುತ್ತದೆ: home, mother, emotional peace, and property. Domestic disruptions possible. ತಪ್ಪಿಸಿ: property transactions.', gu: 'તમારા 4મા ભાવમાં ગોચર — અસર કરે છે: home, mother, emotional peace, and property. Domestic disruptions possible. ટાળો: property transactions.' },
  5: { en: 'Transiting your 5th house — affects children, romance, creativity, and speculation. Past lovers may reappear. Avoid risky investments.', hi: 'आपके पंचम भाव में — संतान, प्रेम, सृजनशीलता प्रभावित। पुराने प्रेमी फिर प्रकट हो सकते हैं। जोखिम भरे निवेश से बचें।', sa: 'भवतः पंचम भावः में — संतान, प्रेम, सृजनशीलता प्रभावःित। पुराने प्रेमी फिर प्रकट हो सकते सन्ति। जोखिम भरे निवेश तः वर्जयन्तु।', mai: 'अहाँक पंचम भाव मे — संतान, प्रेम, सृजनशीलता प्रभावित। पुराने प्रेमी फिर प्रकट हो सकते अछि। जोखिम भरे निवेश सँ बचें।', mr: 'तुमच्या पंचम भाव मध्ये — संतान, प्रेम, सृजनशीलता प्रभावित। पुराने प्रेमी फिर प्रकट हो सकते आहेत. जोखिम भरे निवेश पासून टाळा।', ta: 'உங்கள் 5ஆம் வீட்டில் கோசாரம் — பாதிக்கிறது: children, romance, creativity, and speculation. Past lovers may reappear. தவிர்க்கவும்: risky investments.', te: 'మీ 5వ భావంలో సంచారం — ప్రభావితం: children, romance, creativity, and speculation. Past lovers may reappear. నివారించండి: risky investments.', bn: 'আপনার 5ম ভাবে গোচর — প্রভাবিত করে: children, romance, creativity, and speculation. Past lovers may reappear. এড়িয়ে চলুন: risky investments.', kn: 'ನಿಮ್ಮ 5ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — ಪ್ರಭಾವಿಸುತ್ತದೆ: children, romance, creativity, and speculation. Past lovers may reappear. ತಪ್ಪಿಸಿ: risky investments.', gu: 'તમારા 5મા ભાવમાં ગોચર — અસર કરે છે: children, romance, creativity, and speculation. Past lovers may reappear. ટાળો: risky investments.' },
  6: { en: 'Transiting your 6th house — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.', hi: 'आपके षष्ठ भाव में — वास्तव में अनुकूल! शत्रु कमजोर, ऋण समाधान, स्वास्थ्य समस्याएँ उपचार हेतु सतह पर।', sa: 'भवतः षष्ठ भावः में — वास्तव में अनुकूल! शत्रु कमजोर, ऋण समाधान, स्वास्थ्य समस्याएँ उपचार हेतु सतह पर।', mai: 'अहाँक षष्ठ भाव मे — वास्तव मे अनुकूल! शत्रु कमजोर, ऋण समाधान, स्वास्थ्य समस्याएँ उपचार हेतु सतह पर।', mr: 'तुमच्या षष्ठ भाव मध्ये — वास्तव मध्ये अनुकूल! शत्रु कमजोर, ऋण समाधान, स्वास्थ्य समस्याएँ उपचार हेतु सतह पर।', ta: 'உங்கள் 6ஆம் வீட்டில் கோசாரம் — உண்மையில் சாதகம்! Enemies weaken, debts can be resolved, health issues surface for healing.', te: 'మీ 6వ భావంలో సంచారం — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.', bn: 'আপনার 6ম ভাবে গোচর — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.', kn: 'ನಿಮ್ಮ 6ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.', gu: 'તમારા 6મા ભાવમાં ગોચર — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.' },
  7: { en: 'Transiting your 7th house — affects marriage, partnerships, and contracts. Existing relationships are tested. Avoid new partnerships.', hi: 'आपके सप्तम भाव में — विवाह, साझेदारी और अनुबंध प्रभावित। मौजूदा संबंध परखे जाते हैं। नई साझेदारी से बचें।', sa: 'भवतः सप्तम भावः में — विवाहः, साझेदारी च अनुबंध प्रभावःित। मौजूदा संबंध परखे जाते सन्ति। नई साझेदारी तः वर्जयन्तु।', mai: 'अहाँक सप्तम भाव मे — विवाह, साझेदारी आ अनुबंध प्रभावित। मौजूदा संबंध परखे जाते अछि। नई साझेदारी सँ बचें।', mr: 'तुमच्या सप्तम भाव मध्ये — विवाह, साझेदारी आणि अनुबंध प्रभावित। मौजूदा संबंध परखे जाते आहेत. नई साझेदारी पासून टाळा।', ta: 'உங்கள் 7ஆம் வீட்டில் கோசாரம் — பாதிக்கிறது: marriage, partnerships, and contracts. Existing relationships are tested. தவிர்க்கவும்: new partnerships.', te: 'మీ 7వ భావంలో సంచారం — ప్రభావితం: marriage, partnerships, and contracts. Existing relationships are tested. నివారించండి: new partnerships.', bn: 'আপনার 7ম ভাবে গোচর — প্রভাবিত করে: marriage, partnerships, and contracts. Existing relationships are tested. এড়িয়ে চলুন: new partnerships.', kn: 'ನಿಮ್ಮ 7ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — ಪ್ರಭಾವಿಸುತ್ತದೆ: marriage, partnerships, and contracts. Existing relationships are tested. ತಪ್ಪಿಸಿ: new partnerships.', gu: 'તમારા 7મા ભાવમાં ગોચર — અસર કરે છે: marriage, partnerships, and contracts. Existing relationships are tested. ટાળો: new partnerships.' },
  8: { en: 'Transiting your 8th house — affects longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', hi: 'आपके अष्टम भाव में — दीर्घायु, गुप्त मामले प्रभावित। पुराने रहस्य सतह पर। संयुक्त वित्त में सावधानी।', sa: 'भवतः अष्टम भावः में — दीर्घायु, गुप्त मामले प्रभावःित। पुराने रहस्य सतह पर। संयुक्त वित्त में सावधानी।', mai: 'अहाँक अष्टम भाव मे — दीर्घायु, गुप्त मामले प्रभावित। पुराने रहस्य सतह पर। संयुक्त वित्त मे सावधानी।', mr: 'तुमच्या अष्टम भाव मध्ये — दीर्घायु, गुप्त मामले प्रभावित। पुराने रहस्य सतह पर। संयुक्त वित्त मध्ये सावधानी।', ta: 'உங்கள் 8ஆம் வீட்டில் கோசாரம் — பாதிக்கிறது: longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', te: 'మీ 8వ భావంలో సంచారం — ప్రభావితం: longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', bn: 'আপনার 8ম ভাবে গোচর — প্রভাবিত করে: longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', kn: 'ನಿಮ್ಮ 8ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — ಪ್ರಭಾವಿಸುತ್ತದೆ: longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', gu: 'તમારા 8મા ભાવમાં ગોચર — અસર કરે છે: longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.' },
  9: { en: 'Transiting your 9th house — affects luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', hi: 'आपके नवम भाव में — भाग्य, पिता, उच्च शिक्षा प्रभावित। यात्रा योजनाएँ बदल सकती हैं। विश्वासों का पुनर्मूल्यांकन करें।', sa: 'भवतः नवम भावः में — भाग्य, पिता, उच्च शिक्षा प्रभावःित। यात्रा योजनाएँ बदल सकती सन्ति। विश्वासों का पुनर्मूल्यांकन कुर्वन्तु।', mai: 'अहाँक नवम भाव मे — भाग्य, पिता, उच्च शिक्षा प्रभावित। यात्रा योजनाएँ बदल सकती अछि। विश्वासों का पुनर्मूल्यांकन करें।', mr: 'तुमच्या नवम भाव मध्ये — भाग्य, पिता, उच्च शिक्षा प्रभावित। यात्रा योजनाएँ बदल सकती आहेत. विश्वासों का पुनर्मूल्यांकन करा।', ta: 'உங்கள் 9ஆம் வீட்டில் கோசாரம் — பாதிக்கிறது: luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', te: 'మీ 9వ భావంలో సంచారం — ప్రభావితం: luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', bn: 'আপনার 9ম ভাবে গোচর — প্রভাবিত করে: luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', kn: 'ನಿಮ್ಮ 9ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — ಪ್ರಭಾವಿಸುತ್ತದೆ: luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', gu: 'તમારા 9મા ભાવમાં ગોચર — અસર કરે છે: luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.' },
  10: { en: 'Transiting your 10th house — affects career, reputation, and authority. Professional setbacks or delays. Don\'t start new ventures.', hi: 'आपके दशम भाव में — करियर, प्रतिष्ठा प्रभावित। पेशेवर बाधाएँ या विलंब। नया उद्यम शुरू न करें।' },
  11: { en: 'Transiting your 11th house — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', hi: 'आपके एकादश भाव में — सामान्यतः अनुकूल। पुराने मित्रों से पुनः जुड़ें। विलंबित लाभ प्राप्त।', sa: 'भवतः एकादश भावः में — सामान्यतः अनुकूल। पुराने मित्रों तः पुनः जुड़ें। विलंबित लाभ प्राप्त।', mai: 'अहाँक एकादश भाव मे — सामान्यतः अनुकूल। पुराने मित्रों सँ पुनः जुड़ें। विलंबित लाभ प्राप्त।', mr: 'तुमच्या एकादश भाव मध्ये — सामान्यतः अनुकूल। पुराने मित्रों पासून पुनः जुड़ें। विलंबित लाभ प्राप्त।', ta: 'உங்கள் 11ஆம் வீட்டில் கோசாரம் — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', te: 'మీ 11వ భావంలో సంచారం — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', bn: 'আপনার 11ম ভাবে গোচর — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', kn: 'ನಿಮ್ಮ 11ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', gu: 'તમારા 11મા ભાવમાં ગોચર — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.' },
  12: { en: 'Transiting your 12th house — affects expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.', hi: 'आपके द्वादश भाव में — व्यय, नींद, विदेशी संपर्क प्रभावित। छिपे व्यय सतह पर। आध्यात्मिक एकान्त के लिए अच्छा।', sa: 'भवतः द्वादश भावः में — व्यय, नींद, विदेशी संपर्क प्रभावःित। छिपे व्यय सतह पर। आध्यात्मिक एकान्त के लिए अच्छा।', mai: 'अहाँक द्वादश भाव मे — व्यय, नींद, विदेशी संपर्क प्रभावित। छिपे व्यय सतह पर। आध्यात्मिक एकान्त के लिए अच्छा।', mr: 'तुमच्या द्वादश भाव मध्ये — व्यय, नींद, विदेशी संपर्क प्रभावित। छिपे व्यय सतह पर। आध्यात्मिक एकान्त के लिए अच्छा।', ta: 'உங்கள் 12ஆம் வீட்டில் கோசாரம் — பாதிக்கிறது: expenses, sleep, and foreign connections. Hidden expenses surface. நல்லது: spiritual retreat.', te: 'మీ 12వ భావంలో సంచారం — ప్రభావితం: expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.', bn: 'আপনার 12ম ভাবে গোচর — প্রভাবিত করে: expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.', kn: 'ನಿಮ್ಮ 12ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ — ಪ್ರಭಾವಿಸುತ್ತದೆ: expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.', gu: 'તમારા 12મા ભાવમાં ગોચર — અસર કરે છે: expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.' },
};

// House effects for combustion — weakened planet energy in each house
const HOUSE_COMBUST_EFFECT: Record<number, LocaleText> = {
  1: { en: 'Combust planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', hi: 'अस्त ग्रह प्रथम भाव कमजोर — कम ऊर्जा, स्वास्थ्य समस्याएँ, आत्मविश्वास में कमी।', sa: 'अस्त ग्रह प्रथम भावः कमजोर — कम ऊर्जा, स्वास्थ्य समस्याएँ, आत्मविश्वास में कमी।', mai: 'अस्त ग्रह प्रथम भाव कमजोर — कम ऊर्जा, स्वास्थ्य समस्याएँ, आत्मविश्वास मे कमी।', mr: 'अस्त ग्रह प्रथम भाव कमजोर — कम ऊर्जा, स्वास्थ्य समस्याएँ, आत्मविश्वास मध्ये कमी।', ta: 'அஸ்தமனம் planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', te: 'అస్తంగతం planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', bn: 'অস্ত planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', kn: 'ಅಸ್ತ planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', gu: 'અસ્ત planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.' },
  2: { en: 'Combust planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', hi: 'द्वितीय भाव कमजोर — वित्तीय निर्णय प्रभावित, पारिवारिक संवाद तनावपूर्ण।', sa: 'द्वितीय भावः कमजोर — वित्तीय निर्णय प्रभावःित, पारिवारिक संवाद तनावपूर्ण।', mai: 'द्वितीय भाव कमजोर — वित्तीय निर्णय प्रभावित, पारिवारिक संवाद तनावपूर्ण।', mr: 'द्वितीय भाव कमजोर — वित्तीय निर्णय प्रभावित, पारिवारिक संवाद तनावपूर्ण।', ta: 'அஸ்தமனம் planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', te: 'అస్తంగతం planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', bn: 'অস্ত planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', kn: 'ಅಸ್ತ planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', gu: 'અસ્ત planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.' },
  3: { en: 'Combust planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', hi: 'तृतीय भाव में — साहस कम, संवाद प्रयास विफल, भाई-बहनों को सहायता की आवश्यकता।', sa: 'तृतीय भावः में — साहस कम, संवाद प्रयास विफल, भाई-बहनों को सहायता की आवश्यकता।', mai: 'तृतीय भाव मे — साहस कम, संवाद प्रयास विफल, भाई-बहनों केँ सहायता की आवश्यकता।', mr: 'तृतीय भाव मध्ये — साहस कम, संवाद प्रयास विफल, भाई-बहनों ला सहायता की आवश्यकता।', ta: 'அஸ்தமனம் planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', te: 'అస్తంగతం planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', bn: 'অস্ত planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', kn: 'ಅಸ್ತ planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', gu: 'અસ્ત planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.' },
  4: { en: 'Combust planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', hi: 'चतुर्थ भाव कमजोर — घरेलू सुख बाधित, माता को स्वास्थ्य समस्या, संपत्ति मामले रुके।', sa: 'चतुर्थ भावः कमजोर — घरेलू सुख बाधित, माता को स्वास्थ्य समस्या, संपत्ति मामले रुके।', mai: 'चतुर्थ भाव कमजोर — घरेलू सुख बाधित, माता केँ स्वास्थ्य समस्या, संपत्ति मामले रुके।', mr: 'चतुर्थ भाव कमजोर — घरेलू सुख बाधित, माता ला स्वास्थ्य समस्या, संपत्ति मामले रुके।', ta: 'அஸ்தமனம் planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', te: 'అస్తంగతం planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', bn: 'অস্ত planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', kn: 'ಅಸ್ತ planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', gu: 'અસ્ત planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.' },
  5: { en: 'Combust planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', hi: 'पंचम भाव में — सृजनात्मक अवरोध, प्रेम में चिंगारी कम, संतान अस्वस्थ, सट्टे से बचें।', sa: 'पंचम भावः में — सृजनात्मक अवरोध, प्रेम में चिंगारी कम, संतान अस्वस्थ, सट्टे तः वर्जयन्तु।', mai: 'पंचम भाव मे — सृजनात्मक अवरोध, प्रेम मे चिंगारी कम, संतान अस्वस्थ, सट्टे सँ बचें।', mr: 'पंचम भाव मध्ये — सृजनात्मक अवरोध, प्रेम मध्ये चिंगारी कम, संतान अस्वस्थ, सट्टे पासून टाळा।', ta: 'அஸ்தமனம் planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', te: 'అస్తంగతం planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', bn: 'অস্ত planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', kn: 'ಅಸ್ತ planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', gu: 'અસ્ત planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.' },
  6: { en: 'Combust planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', hi: 'षष्ठ भाव में — विरोधाभासी रूप से सहायक! शत्रु भी कमजोर। लेकिन स्वास्थ्य सतर्कता आवश्यक।', sa: 'षष्ठ भावः में — विरोधाभासी रूप तः सहायक! शत्रु भी कमजोर। परन्तु स्वास्थ्य सतर्कता आवश्यक।', mai: 'षष्ठ भाव मे — विरोधाभासी रूप सँ सहायक! शत्रु भी कमजोर। मुदा स्वास्थ्य सतर्कता आवश्यक।', mr: 'षष्ठ भाव मध्ये — विरोधाभासी रूप पासून सहायक! शत्रु भी कमजोर। परंतु स्वास्थ्य सतर्कता आवश्यक।', ta: 'அஸ்தமனம் planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', te: 'అస్తంగతం planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', bn: 'অস্ত planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', kn: 'ಅಸ್ತ planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', gu: 'અસ્ત planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.' },
  7: { en: 'Combust planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', hi: 'सप्तम भाव कमजोर — साथी दूर महसूस, वार्ता में ऊर्जा की कमी, नए अनुबंध से बचें।', sa: 'सप्तम भावः कमजोर — साथी दूर महसूस, वार्ता में ऊर्जा की कमी, नए अनुबंध तः वर्जयन्तु।', mai: 'सप्तम भाव कमजोर — साथी दूर महसूस, वार्ता मे ऊर्जा की कमी, नए अनुबंध सँ बचें।', mr: 'सप्तम भाव कमजोर — साथी दूर महसूस, वार्ता मध्ये ऊर्जा की कमी, नए अनुबंध पासून टाळा।', ta: 'அஸ்தமனம் planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', te: 'అస్తంగతం planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', bn: 'অস্ত planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', kn: 'ಅಸ್ತ planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', gu: 'અસ્ત planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.' },
  8: { en: 'Combust planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', hi: 'अष्टम भाव में — छिपी कमजोरियाँ सतह पर। संयुक्त वित्त और बीमा में सावधानी।', sa: 'अष्टम भावः में — छिपी कमजोरियाँ सतह पर। संयुक्त वित्त च बीमा में सावधानी।', mai: 'अष्टम भाव मे — छिपी कमजोरियाँ सतह पर। संयुक्त वित्त आ बीमा मे सावधानी।', mr: 'अष्टम भाव मध्ये — छिपी कमजोरियाँ सतह पर। संयुक्त वित्त आणि बीमा मध्ये सावधानी।', ta: 'அஸ்தமனம் planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', te: 'అస్తంగతం planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', bn: 'অস্ত planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', kn: 'ಅಸ್ತ planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', gu: 'અસ્ત planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.' },
  9: { en: 'Combust planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', hi: 'नवम भाव में — भाग्य मंद, गुरु मार्गदर्शन अनुपलब्ध, लंबी यात्रा समस्याग्रस्त।', sa: 'नवम भावः में — भाग्य मंद, गुरु मार्गदर्शन अनुपलब्ध, लंबी यात्रा समस्याग्रस्त।', mai: 'नवम भाव मे — भाग्य मंद, गुरु मार्गदर्शन अनुपलब्ध, लंबी यात्रा समस्याग्रस्त।', mr: 'नवम भाव मध्ये — भाग्य मंद, गुरु मार्गदर्शन अनुपलब्ध, लंबी यात्रा समस्याग्रस्त।', ta: 'அஸ்தமனம் planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', te: 'అస్తంగతం planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', bn: 'অস্ত planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', kn: 'ಅಸ್ತ planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', gu: 'અસ્ત planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.' },
  10: { en: 'Combust planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', hi: 'दशम भाव कमजोर — करियर गति रुकी, अधिकारी असहायक, सार्वजनिक छवि मंद।', sa: 'दशम भावः कमजोर — करियर गति रुकी, अधिकारी असहायक, सार्वजनिक छवि मंद।', mai: 'दशम भाव कमजोर — करियर गति रुकी, अधिकारी असहायक, सार्वजनिक छवि मंद।', mr: 'दशम भाव कमजोर — करियर गति रुकी, अधिकारी असहायक, सार्वजनिक छवि मंद।', ta: 'அஸ்தமனம் planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', te: 'అస్తంగతం planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', bn: 'অস্ত planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', kn: 'ಅಸ್ತ planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', gu: 'અસ્ત planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.' },
  11: { en: 'Combust planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', hi: 'एकादश भाव में — लाभ विलंबित, सामाजिक संपर्क उदासीन, बड़े भाई-बहनों को कठिनाई।', sa: 'एकादश भावः में — लाभ विलंबित, सामाजिक संपर्क उदासीन, बड़े भाई-बहनों को कठिनाई।', mai: 'एकादश भाव मे — लाभ विलंबित, सामाजिक संपर्क उदासीन, बड़े भाई-बहनों केँ कठिनाई।', mr: 'एकादश भाव मध्ये — लाभ विलंबित, सामाजिक संपर्क उदासीन, बड़े भाई-बहनों ला कठिनाई।', ta: 'அஸ்தமனம் planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', te: 'అస్తంగతం planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', bn: 'অস্ত planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', kn: 'ಅಸ್ತ planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', gu: 'અસ્ત planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.' },
  12: { en: 'Combust planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', hi: 'द्वादश भाव में — व्यय बढ़ा, नींद खराब, विदेशी संपर्क कमजोर। त्याग के लिए अच्छा।', sa: 'द्वादश भावः में — व्यय बढ़ा, नींद खराब, विदेशी संपर्क कमजोर। त्याग के लिए अच्छा।', mai: 'द्वादश भाव मे — व्यय बढ़ा, नींद खराब, विदेशी संपर्क कमजोर। त्याग के लिए अच्छा।', mr: 'द्वादश भाव मध्ये — व्यय बढ़ा, नींद खराब, विदेशी संपर्क कमजोर। त्याग के लिए अच्छा।', ta: 'அஸ்தமனம் planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', te: 'అస్తంగతం planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', bn: 'অস্ত planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', kn: 'ಅಸ್ತ planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', gu: 'અસ્ત planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.' },
};

function getHouseFromMoon(moonSign: number, transitSign: number): number {
  return ((transitSign - moonSign + 12) % 12) + 1;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RetrogradePage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const t2 = (obj: LocaleText): string => !isDevanagariLocale(locale) ? obj.en : obj.hi || "";

  const [year, setYear] = useState(new Date().getFullYear());
  const [retroPeriods, setRetroPeriods] = useState<RetroPeriod[]>([]);
  const [combustEvents, setCombustEvents] = useState<CombustEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'retrograde' | 'combustion'>('retrograde');

  const { birthRashi, isSet: hasBirthData } = useBirthDataStore();

  useEffect(() => { useBirthDataStore.getState().loadFromStorage(); }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/retrograde?year=${year}`).then(r => r.json()),
      fetch(`/api/combustion?year=${year}`).then(r => r.json()),
    ]).then(([retro, combust]) => {
      setRetroPeriods(retro.periods || []);
      setCombustEvents(combust.events || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [year]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'sa-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', kn: 'kn-IN', gu: 'gu-IN', mai: 'mai-IN', mr: 'mr-IN' }, locale), { day: 'numeric', month: 'short' });
  };

  // Check if a period is currently active
  const isActive = (start: string, end: string) => {
    const now = new Date();
    return now >= new Date(start + 'T00:00:00') && now <= new Date(end + 'T23:59:59');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">
            {tl({ en: 'Retrograde & Combustion', hi: 'वक्री एवं अस्त', sa: 'वक्रता च अस्तङ्गमः', ta: 'வக்கிரம் மற்றும் அஸ்தமனம்', te: 'వక్రత మరియు అస్తమయం', bn: 'বক্রী ও অস্তাচল', kn: 'ವಕ್ರ ಮತ್ತು ಅಸ್ತ', gu: 'વક્રી અને અસ્ત', mai: 'वक्री आ अस्त', mr: 'वक्री आणि अस्त' }, locale)}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed" style={bodyFont}>
          {locale === 'en'
            ? 'When planets reverse their apparent motion (retrograde) or get too close to the Sun (combust), their significations turn inward, weaken, or become unpredictable. Track these periods and understand how they affect your life.'
            : 'जब ग्रह अपनी दिशा उलटते हैं (वक्री) या सूर्य के बहुत निकट आते हैं (अस्त), उनके फल अंतर्मुखी, कमजोर या अप्रत्याशित हो जाते हैं। इन अवधियों को ट्रैक करें और समझें कि ये आपके जीवन को कैसे प्रभावित करती हैं।'}
        </p>
      </motion.div>

      {/* Personalized Synthesis */}
      {hasBirthData && !loading ? (() => {
        const moonName = RASHIS[birthRashi - 1]?.name;
        const now = new Date();

        // Currently active retrogrades
        const activeRetros = retroPeriods.filter(p =>
          now >= new Date(p.startDate + 'T00:00:00') && now <= new Date(p.endDate + 'T23:59:59')
        );
        const activeCombusts = combustEvents.filter(e =>
          now >= new Date(e.startDate + 'T00:00:00') && now <= new Date(e.endDate + 'T23:59:59')
        );

        // Next upcoming retrograde
        const upcoming = retroPeriods.find(p => new Date(p.startDate + 'T00:00:00') > now);

        const totalActive = activeRetros.length + activeCombusts.length;
        const toneColor = totalActive === 0 ? 'emerald' : totalActive <= 2 ? 'amber' : 'red';

        // Build narrative
        const parts_en: string[] = [];
        const parts_hi: string[] = [];

        if (activeRetros.length === 0 && activeCombusts.length === 0) {
          parts_en.push('No planets are currently retrograde or combust — a clear sky for new initiatives.');
          parts_hi.push('वर्तमान में कोई ग्रह वक्री या अस्त नहीं — नई पहल के लिए स्वच्छ आकाश।');
          if (upcoming) {
            parts_en.push(`The next retrograde is ${upcoming.planetName.en} starting ${formatDate(upcoming.startDate)}.`);
            parts_hi.push(`अगला वक्री ${upcoming.planetName.hi} है, ${formatDate(upcoming.startDate)} से।`);
          }
        } else {
          if (activeRetros.length > 0) {
            const names = activeRetros.map(r => r.planetName.en).join(', ');
            const namesHi = activeRetros.map(r => r.planetName.hi).join(', ');
            parts_en.push(`${activeRetros.length} planet${activeRetros.length > 1 ? 's' : ''} currently retrograde: ${names}.`);
            parts_hi.push(`${activeRetros.length} ग्रह वर्तमान में वक्री: ${namesHi}।`);

            // House-level synthesis
            const housesHit = activeRetros.map(r => ({
              name: r.planetName,
              house: getHouseFromMoon(birthRashi, r.startSign),
              color: r.planetColor,
            }));

            const sensitiveHouses = housesHit.filter(h => [1, 4, 7, 10].includes(h.house));
            if (sensitiveHouses.length > 0) {
              const houseList = sensitiveHouses.map(h => `${h.name.en} in your ${h.house}${['st','nd','rd'][h.house-1]||'th'}`).join(', ');
              parts_en.push(`Key impact: ${houseList} — angular houses are stressed, handle with care.`);
              const houseListHi = sensitiveHouses.map(h => `${h.name.hi} ${h.house}वें भाव में`).join(', ');
              parts_hi.push(`मुख्य प्रभाव: ${houseListHi} — केन्द्र भाव तनावग्रस्त, सावधानी से निपटें।`);
            }

            const favorableHouses = housesHit.filter(h => [3, 6, 11].includes(h.house));
            if (favorableHouses.length > 0) {
              parts_en.push(`${favorableHouses.map(h => h.name.en).join(' and ')} ${favorableHouses.length > 1 ? 'are' : 'is'} retrograde in favorable upachaya house${favorableHouses.length > 1 ? 's' : ''} — actually beneficial for competition and overcoming obstacles.`);
              parts_hi.push(`${favorableHouses.map(h => h.name.hi).join(' और ')} अनुकूल उपचय भाव में वक्री — प्रतिस्पर्धा और बाधा निवारण के लिए लाभकारी।`);
            }
          }

          if (activeCombusts.length > 0) {
            const names = activeCombusts.map(c => c.planetName.en).join(', ');
            const namesHi = activeCombusts.map(c => c.planetName.hi).join(', ');
            parts_en.push(`${names} ${activeCombusts.length > 1 ? 'are' : 'is'} combust — ${activeCombusts.length > 1 ? 'their' : 'its'} significations are weakened by solar proximity.`);
            parts_hi.push(`${namesHi} अस्त — सूर्य निकटता से ${activeCombusts.length > 1 ? 'इनके' : 'इसके'} फल कमजोर।`);
          }
        }

        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-6 border-2 mb-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] ${
              toneColor === 'emerald' ? 'border-emerald-500/30' : toneColor === 'red' ? 'border-red-500/30' : 'border-amber-500/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                toneColor === 'emerald' ? 'bg-emerald-500/15' : toneColor === 'red' ? 'bg-red-500/15' : 'bg-amber-500/15'
              }`}>
                {totalActive === 0 ? '☀' : totalActive <= 2 ? '◐' : '⚡'}
              </div>
              <div>
                <h3 className="text-gold-light font-bold text-lg" style={headingFont}>
                  {tl({ en: 'Current Cosmic Weather', hi: 'वर्तमान ब्रह्मांडीय मौसम', sa: 'वर्तमानः ब्रह्माण्डीयः वातावरणः', ta: 'தற்போதைய பிரபஞ்ச நிலை', te: 'ప్రస్తుత విశ్వ వాతావరణం', bn: 'বর্তমান মহাজাগতিক আবহাওয়া', kn: 'ಪ್ರಸ್ತುತ ಬ್ರಹ್ಮಾಂಡೀಯ ವಾತಾವರಣ', gu: 'વર્તમાન બ્રહ્માંડીય હવામાન', mai: 'वर्तमान ब्रह्माण्डीय मौसम', mr: 'सध्याचे खगोलीय वातावरण' }, locale)}
                </h3>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>{tl({ en: 'Moon in ${moonName?.en}', hi: 'चन्द्र ${moonName?.hi} में', sa: 'चन्द्र ${moonName?.hi} में', ta: 'Moon in ${moonName?.en}', te: 'Moon in ${moonName?.en}', bn: 'Moon in ${moonName?.en}', kn: 'Moon in ${moonName?.en}', gu: 'Moon in ${moonName?.en}', mai: 'चन्द्र ${moonName?.hi} में', mr: 'चन्द्र ${moonName?.hi} में' }, locale)}</span>
                  <span className="text-gold-primary/20">|</span>
                  <span className={`font-bold ${toneColor === 'emerald' ? 'text-emerald-400' : toneColor === 'red' ? 'text-red-400' : 'text-amber-400'}`}>
                    {totalActive === 0
                      ? (tl({ en: 'All Clear', hi: 'सब स्पष्ट', sa: 'सर्वं स्वच्छम्', ta: 'அனைத்தும் தெளிவு', te: 'అన్నీ స్పష్టంగా ఉన్నాయి', bn: 'সব পরিষ্কার', kn: 'ಎಲ್ಲವೂ ಸ್ಪಷ್ಟ', gu: 'સ્પષ્ટ', mai: 'सभ स्पष्ट अछि', mr: 'सर्व स्पष्ट' }, locale))
                      : `${totalActive} ${tl({ en: 'Active', hi: 'सक्रिय', sa: 'सक्रियः', ta: 'செயலில்', te: 'క్రియాశీలం', bn: 'সক্রিয়', kn: 'ಸಕ್ರಿಯ', gu: 'સક્રિય', mai: 'सक्रिय', mr: 'सक्रिय' }, locale)}`}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-text-primary text-sm leading-relaxed mb-4" style={bodyFont}>
              {!isDevanagariLocale(locale) ? parts_en.join(' ') : parts_hi.join(' ')}
            </p>

            {/* Active events grid */}
            {totalActive > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeRetros.map(r => (
                  <div key={`r-${r.planetId}`} className="rounded-lg p-3 border border-red-500/20 bg-red-500/5 text-center">
                    <div className="text-xs font-bold mb-1" style={{ color: r.planetColor }}>{tl(r.planetName, locale)}</div>
                    <div className="text-red-400 text-xs font-bold uppercase">{tl({ en: 'Retrograde', hi: 'वक्री', sa: 'वक्रगतिः', ta: 'வக்கிரம்', te: 'వక్రగతి', bn: 'বক্রী', kn: 'ವಕ್ರಗತಿ', gu: 'વક્રી', mai: 'वक्री', mr: 'वक्री' }, locale)}</div>
                    {hasBirthData && <div className="text-text-secondary/70 text-xs mt-1">{tl({ en: '${getHouseFromMoon(birthRashi, r.startSign)}${[\'st\',\'nd\',\'rd\'][getHouseFromMoon(birthRashi, r.startSign)-1]||\'th\'} house', hi: '${getHouseFromMoon(birthRashi, r.startSign)}वाँ भाव', sa: '${getHouseFromMoon(birthRashi, r.startSign)}वाँ भाव', ta: '${getHouseFromMoon(birthRashi, r.startSign)}${[\'st\',\'nd\',\'rd\'][getHouseFromMoon(birthRashi, r.startSign)-1]||\'th\'} house', te: '${getHouseFromMoon(birthRashi, r.startSign)}${[\'st\',\'nd\',\'rd\'][getHouseFromMoon(birthRashi, r.startSign)-1]||\'th\'} house', bn: '${getHouseFromMoon(birthRashi, r.startSign)}${[\'st\',\'nd\',\'rd\'][getHouseFromMoon(birthRashi, r.startSign)-1]||\'th\'} house', kn: '${getHouseFromMoon(birthRashi, r.startSign)}${[\'st\',\'nd\',\'rd\'][getHouseFromMoon(birthRashi, r.startSign)-1]||\'th\'} house', gu: '${getHouseFromMoon(birthRashi, r.startSign)}${[\'st\',\'nd\',\'rd\'][getHouseFromMoon(birthRashi, r.startSign)-1]||\'th\'} house', mai: '${getHouseFromMoon(birthRashi, r.startSign)}वाँ भाव', mr: '${getHouseFromMoon(birthRashi, r.startSign)}वाँ भाव' }, locale)}</div>}
                  </div>
                ))}
                {activeCombusts.map(c => (
                  <div key={`c-${c.planetId}`} className="rounded-lg p-3 border border-orange-500/20 bg-orange-500/5 text-center">
                    <div className="text-xs font-bold mb-1" style={{ color: c.planetColor }}>{tl(c.planetName, locale)}</div>
                    <div className="text-orange-400 text-xs font-bold uppercase">{tl({ en: 'Combust', hi: 'अस्त', sa: 'अस्तङ्गतः', ta: 'அஸ்தமனம்', te: 'అస్తమయం', bn: 'অস্তগত', kn: 'ಅಸ್ತಂಗತ', gu: 'અસ્ત', mai: 'अस्त', mr: 'अस्त' }, locale)}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      })() : !hasBirthData ? (
        <div className="rounded-xl p-4 bg-gold-primary/5 border border-gold-primary/15 mb-8 text-center">
          <p className="text-text-secondary text-sm" style={bodyFont}>
            {locale === 'en'
              ? 'Generate a Kundali to see personalized analysis of how retrogrades and combustions affect your specific houses.'
              : 'वक्री और अस्त आपके विशिष्ट भावों को कैसे प्रभावित करते हैं, इसका व्यक्तिगत विश्लेषण देखने के लिए कुंडली बनाएँ।'}
            {' '}
            <Link href="/kundali" className="text-gold-primary hover:text-gold-light font-bold underline">
              {tl({ en: 'Generate Kundali', hi: 'कुंडली बनाएँ', sa: 'कुण्डलीं रचयतु', ta: 'ஜாதகம் உருவாக்கு', te: 'కుండలి రూపొందించండి', bn: 'কুণ্ডলী তৈরি করুন', kn: 'ಕುಂಡಲಿ ರಚಿಸಿ', gu: 'કુંડળી બનાવો', mai: 'कुण्डली बनाउ', mr: 'कुंडली तयार करा' }, locale)}
            </Link>
          </p>
        </div>
      ) : null}

      {/* Year selector */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-4xl font-bold text-gold-gradient" style={headingFont}>{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* Tab toggle */}
      <div className="flex justify-center gap-3 mb-10">
        <button
          onClick={() => setTab('retrograde')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'retrograde' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
          }`}
        >
          {tl({ en: 'Retrograde (${retroPeriods.length})', hi: 'वक्री (${retroPeriods.length})', sa: 'वक्री (${retroPeriods.length})', ta: 'Retrograde (${retroPeriods.length})', te: 'Retrograde (${retroPeriods.length})', bn: 'Retrograde (${retroPeriods.length})', kn: 'Retrograde (${retroPeriods.length})', gu: 'Retrograde (${retroPeriods.length})', mai: 'वक्री (${retroPeriods.length})', mr: 'वक्री (${retroPeriods.length})' }, locale)}
        </button>
        <button
          onClick={() => setTab('combustion')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'combustion' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
          }`}
        >
          {tl({ en: 'Combustion (${combustEvents.length})', hi: 'अस्त (${combustEvents.length})', sa: 'अस्त (${combustEvents.length})', ta: 'Combustion (${combustEvents.length})', te: 'Combustion (${combustEvents.length})', bn: 'Combustion (${combustEvents.length})', kn: 'Combustion (${combustEvents.length})', gu: 'Combustion (${combustEvents.length})', mai: 'अस्त (${combustEvents.length})', mr: 'अस्त (${combustEvents.length})' }, locale)}
        </button>
      </div>

      {/* ── VISUAL TIMELINE ── */}
      {!loading && (retroPeriods.length > 0 || combustEvents.length > 0) && (() => {
        const allEvents = [
          ...retroPeriods.map(p => ({ ...p, type: 'retro' as const })),
          ...combustEvents.map(e => ({ ...e, type: 'combust' as const })),
        ];
        const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const yearStart = new Date(year, 0, 1).getTime();
        const yearEnd = new Date(year, 11, 31).getTime();
        const totalMs = yearEnd - yearStart;
        const toPercent = (dateStr: string) => {
          const t = new Date(dateStr + 'T00:00:00').getTime();
          return Math.max(0, Math.min(100, ((t - yearStart) / totalMs) * 100));
        };
        const nowPct = toPercent(new Date().toISOString().slice(0, 10));

        // Group by planet
        const PLANET_ORDER = [6, 4, 2, 5, 3]; // Saturn, Jupiter, Mars, Venus, Mercury
        const PLANET_LABELS: Record<number, string> = { 6: 'Saturn', 4: 'Jupiter', 2: 'Mars', 5: 'Venus', 3: 'Mercury' };
        const PLANET_LABELS_HI: Record<number, string> = { 6: 'शनि', 4: 'बृहस्पति', 2: 'मंगल', 5: 'शुक्र', 3: 'बुध' };

        return (
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 mb-8">
            <h3 className="text-gold-light text-sm font-bold mb-1">
              {tl({ en: '${year} Retrograde & Combustion Timeline', hi: '${year} वक्री और अस्त समयरेखा', sa: '${year} वक्री और अस्त समयरेखा', ta: '${year} Retrograde & Combustion Timeline', te: '${year} Retrograde & Combustion Timeline', bn: '${year} Retrograde & Combustion Timeline', kn: '${year} Retrograde & Combustion Timeline', gu: '${year} Retrograde & Combustion Timeline', mai: '${year} वक्री और अस्त समयरेखा', mr: '${year} वक्री और अस्त समयरेखा' }, locale)}
            </h3>
            <p className="text-text-secondary/50 text-xs mb-4">
              {tl({ en: 'Red = retrograde, Orange = combust. Hover for dates.', hi: 'लाल = वक्री, नारंगी = अस्त।', sa: 'रक्तम् = वक्रगतिः, नारङ्गम् = अस्तङ्गतः। दिनाङ्कार्थं माउसं नयतु।', ta: 'சிவப்பு = வக்கிரம், ஆரஞ்சு = அஸ்தமனம். தேதிகளுக்கு மேலே செல்லுங்கள்.', te: 'ఎరుపు = వక్రగతి, నారింజ = అస్తమయం. తేదీలకు హోవర్ చేయండి.', bn: 'লাল = বক্রী, কমলা = অস্তগত। তারিখের জন্য হোভার করুন।', kn: 'ಕೆಂಪು = ವಕ್ರ, ಕಿತ್ತಳೆ = ಅಸ್ತ. ದಿನಾಂಕಗಳಿಗೆ ಹোভರ್ ಮಾಡಿ.', gu: 'લાલ = વક્રી, નારંગી = અસ્ત. તારીખ માટે હૉવર કરો.', mai: 'लाल = वक्री, नारंगी = अस्त। तिथिक लेल होवर करू।', mr: 'लाल = वक्री, नारंगी = अस्त. तारखांसाठी होव्हर करा.' }, locale)}
            </p>

            {/* Month axis */}
            <div className="relative h-5 mb-1 ml-16 sm:ml-20">
              {MONTHS.map((m, i) => (
                <span key={m} className="absolute text-[9px] text-gray-600 font-mono" style={{ left: `${(i / 12) * 100}%` }}>
                  {m}
                </span>
              ))}
            </div>

            {/* Planet swim lanes */}
            <div className="space-y-2">
              {PLANET_ORDER.map(pid => {
                const events = allEvents.filter(e => e.planetId === pid);
                if (events.length === 0) return null;
                const graha = GRAHAS[pid];
                return (
                  <div key={pid} className="flex items-center gap-0">
                    <div className="w-16 sm:w-20 shrink-0 text-right pr-2">
                      <span className="text-[10px] font-bold" style={{ color: graha?.color || '#888' }}>
                        {!isDevanagariLocale(locale) ? PLANET_LABELS[pid] : PLANET_LABELS_HI[pid]}
                      </span>
                    </div>
                    <div className="flex-1 relative h-7 bg-bg-tertiary/15 rounded-md overflow-hidden">
                      {/* Month grid lines */}
                      {MONTHS.map((_, i) => (
                        <div key={i} className="absolute top-0 bottom-0 border-l border-white/[0.04]" style={{ left: `${(i / 12) * 100}%` }} />
                      ))}
                      {/* Event bars */}
                      {events.map((ev, idx) => {
                        const left = toPercent(ev.startDate);
                        const right = toPercent(ev.endDate);
                        const width = Math.max(right - left, 1);
                        const isRetro = ev.type === 'retro';
                        const isNowActive = (() => {
                          const now = new Date();
                          return now >= new Date(ev.startDate + 'T00:00:00') && now <= new Date(ev.endDate + 'T23:59:59');
                        })();
                        return (
                          <div
                            key={idx}
                            className={`absolute top-1 bottom-1 rounded-sm cursor-default group/bar transition-colors ${
                              isRetro ? 'bg-red-500/70 hover:bg-red-500/90' : 'bg-orange-500/60 hover:bg-orange-500/80'
                            } ${isNowActive ? 'ring-1 ring-white/30' : ''}`}
                            style={{ left: `${left}%`, width: `${width}%` }}
                            title={`${ev.planetName.en} ${isRetro ? 'Retrograde' : 'Combust'}: ${ev.startDate} to ${ev.endDate}`}
                          >
                            {width > 6 && (
                              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/80 truncate px-0.5">
                                {isRetro ? 'R' : 'C'}
                              </span>
                            )}
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/bar:block z-10 pointer-events-none">
                              <div className="bg-bg-primary/95 border border-gold-primary/20 rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
                                <span className={`text-[9px] font-bold ${isRetro ? 'text-red-400' : 'text-orange-400'}`}>
                                  {isRetro ? 'Retrograde' : 'Combust'}
                                </span>
                                <span className="text-[9px] text-gray-400 ml-1">{ev.startDate} → {ev.endDate}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* NOW marker */}
                      {year === new Date().getFullYear() && (
                        <div className="absolute top-0 bottom-0 w-px bg-gold-primary/80" style={{ left: `${nowPct}%` }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 ml-16 sm:ml-20 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-red-500/70" /><span className="text-gray-500">{tl({ en: 'Retrograde', hi: 'वक्री', sa: 'वक्रगतिः', ta: 'வக்கிரம்', te: 'వక్రగతి', bn: 'বক্রী', kn: 'ವಕ್ರಗತಿ', gu: 'વક્રી', mai: 'वक्री', mr: 'वक्री' }, locale)}</span></span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-orange-500/60" /><span className="text-gray-500">{tl({ en: 'Combust', hi: 'अस्त', sa: 'अस्तङ्गतः', ta: 'அஸ்தமனம்', te: 'అస్తమయం', bn: 'অস্তগত', kn: 'ಅಸ್ತಂಗತ', gu: 'અસ્ત', mai: 'अस्त', mr: 'अस्त' }, locale)}</span></span>
              {year === new Date().getFullYear() && <span className="flex items-center gap-1"><span className="w-px h-3 bg-gold-primary/80" /><span className="text-gold-primary/70">NOW</span></span>}
            </div>
          </div>
        );
      })()}

      <GoldDivider />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : tab === 'retrograde' ? (
        <div className="space-y-5 my-10">
          {retroPeriods.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              {tl({ en: 'No retrograde periods found.', hi: 'कोई वक्री अवधि नहीं मिली।', sa: 'कापि वक्रगति-अवधिः न प्राप्ता।', ta: 'வக்கிர காலங்கள் எதுவும் இல்லை.', te: 'వక్రగతి కాలాలు ఏమీ కనుగొనబడలేదు.', bn: 'কোনো বক্রী সময়কাল পাওয়া যায়নি।', kn: 'ಯಾವುದೇ ವಕ್ರಗತಿ ಅವಧಿ ಕಂಡುಬಂದಿಲ್ಲ.', gu: 'કોઈ વક્રી સમયગાળો મળ્યો નથી.', mai: 'कोनो वक्री अवधि नहि भेटल।', mr: 'कोणताही वक्री कालावधी आढळला नाही.' }, locale)}
            </div>
          ) : retroPeriods.map((p, i) => {
            const active = isActive(p.startDate, p.endDate);
            const meaning = RETRO_MEANING[p.planetId];
            const house = hasBirthData ? getHouseFromMoon(birthRashi, p.startSign) : 0;
            const houseEffect = house ? HOUSE_RETRO_EFFECT[house] : null;

            return (
              <motion.div
                key={`${p.startDate}-${p.planetId}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.06, 0.5) }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border rounded-2xl overflow-hidden ${active ? 'border-red-500/40 ring-1 ring-red-500/20' : 'border-gold-primary/12'}`}
              >
                {/* Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <GrahaIconById id={p.planetId} size={48} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-lg font-bold" style={{ color: p.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
                          {tl(p.planetName, locale)}
                        </span>
                        <span className="text-red-400 text-xs font-bold px-2 py-0.5 bg-red-500/15 border border-red-500/25 rounded-full">
                          {tl({ en: 'RETROGRADE', hi: 'वक्री', sa: 'वक्रगतिः', ta: 'வக்கிரம்', te: 'వక్రగతి', bn: 'বক্রী', kn: 'ವಕ್ರಗತಿ', gu: 'વક્રી', mai: 'वक्री', mr: 'वक्री' }, locale)}
                        </span>
                        {active && (
                          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-amber-500/15 border border-amber-500/25 rounded-full text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            {tl({ en: 'ACTIVE NOW', hi: 'अभी सक्रिय', sa: 'इदानीं सक्रियः', ta: 'இப்போது செயலில்', te: 'ఇప్పుడు క్రియాశీలం', bn: 'এখন সক্রিয়', kn: 'ಈಗ ಸಕ್ರಿಯ', gu: 'હાલ સક્રિય', mai: 'अखन सक्रिय अछि', mr: 'आत्ता सक्रिय' }, locale)}
                          </span>
                        )}
                      </div>

                      {/* Dates & signs */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-gold-light font-mono text-sm font-bold">{formatDate(p.startDate)}</span>
                        <span className="text-gold-dark">→</span>
                        <span className="text-gold-light font-mono text-sm font-bold">{formatDate(p.endDate)}</span>
                        <span className="text-text-secondary/65 text-xs">({p.durationDays} {tl({ en: 'days', hi: 'दिन', sa: 'दिनानि', ta: 'நாட்கள்', te: 'రోజులు', bn: 'দিন', kn: 'ದಿನಗಳು', gu: 'દિવસ', mai: 'दिन', mr: 'दिवस' }, locale)})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-3">
                        <RashiIconById id={p.startSign} size={16} />
                        <span className="text-text-secondary" style={bodyFont}>{tl(p.startSignName, locale)}</span>
                        <span className="text-gold-dark">→</span>
                        <RashiIconById id={p.endSign} size={16} />
                        <span className="text-text-primary font-semibold" style={bodyFont}>{tl(p.endSignName, locale)}</span>
                      </div>

                      {/* General meaning */}
                      {meaning && (
                        <p className="text-text-secondary text-sm leading-relaxed mb-3" style={bodyFont}>
                          {t2(meaning.general)}
                        </p>
                      )}

                      {/* Personalized house effect */}
                      {hasBirthData && houseEffect && (
                        <div className="rounded-xl p-4 bg-bg-primary/50 border border-gold-primary/15 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-gold-primary" />
                            <span className="text-gold-primary text-xs uppercase tracking-wider font-bold">
                              {tl({ en: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', hi: 'आपके लिए — चन्द्र से ${house}वाँ भाव', sa: 'आपके लिए — चन्द्र से ${house}वाँ भाव', ta: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', te: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', bn: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', kn: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', gu: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', mai: 'आपके लिए — चन्द्र से ${house}वाँ भाव', mr: 'आपके लिए — चन्द्र से ${house}वाँ भाव' }, locale)}
                            </span>
                          </div>
                          <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                            {t2(houseEffect)}
                          </p>
                        </div>
                      )}

                      {/* Do's and Don'ts */}
                      {meaning && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-lg p-3 bg-emerald-500/5 border border-emerald-500/15">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Shield className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold">{tl({ en: 'Do', hi: 'करें', sa: 'करें', ta: 'Do', te: 'Do', bn: 'Do', kn: 'Do', gu: 'Do', mai: 'करें', mr: 'करें' }, locale)}</span>
                            </div>
                            <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{t2(meaning.dos)}</p>
                          </div>
                          <div className="rounded-lg p-3 bg-red-500/5 border border-red-500/15">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              <span className="text-red-400 text-xs uppercase tracking-wider font-bold">{tl({ en: `Don't`, hi: 'न करें', sa: 'न करें', ta: `Don't`, te: `Don't`, bn: `Don't`, kn: `Don't`, gu: `Don't`, mai: 'न करें', mr: 'न करें' }, locale)}</span>
                            </div>
                            <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{t2(meaning.donts)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Combustion tab */
        <div className="space-y-4 my-10">
          {combustEvents.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              {tl({ en: 'No combustion events found.', hi: 'कोई अस्त घटना नहीं मिली।', sa: 'काऽपि अस्तङ्गम-घटना न प्राप्ता।', ta: 'அஸ்தமன நிகழ்வுகள் எதுவும் இல்லை.', te: 'అస్తమయ సంఘటనలు ఏమీ కనుగొనబడలేదు.', bn: 'কোনো অস্তাচল ঘটনা পাওয়া যায়নি।', kn: 'ಯಾವುದೇ ಅಸ್ತ ಘಟನೆ ಕಂಡುಬಂದಿಲ್ಲ.', gu: 'કોઈ અસ્ત ઘટના મળી નથી.', mai: 'कोनो अस्त घटना नहि भेटल।', mr: 'कोणतीही अस्त घटना आढळली नाही.' }, locale)}
            </div>
          ) : combustEvents.map((e, i) => {
            const active = isActive(e.startDate, e.endDate);
            const meaning = COMBUST_MEANING[e.planetId];

            // Compute Sun's sign at midpoint of combustion for house calculation
            const midDate = new Date(e.startDate + 'T00:00:00');
            const midJd = dateToJD(midDate.getFullYear(), midDate.getMonth() + 1, midDate.getDate(), 12);
            const sunSign = getRashiNumber(toSidereal(sunLongitude(midJd), midJd));
            const house = hasBirthData ? getHouseFromMoon(birthRashi, sunSign) : 0;
            const houseEffect = house ? HOUSE_COMBUST_EFFECT[house] : null;
            const sunSignName = RASHIS[sunSign - 1]?.name;

            return (
              <motion.div
                key={`${e.startDate}-${e.planetId}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border rounded-2xl overflow-hidden ${active ? 'border-orange-500/40 ring-1 ring-orange-500/20' : 'border-gold-primary/12'}`}
              >
                <div className="p-5">
                <div className="flex items-start gap-4">
                  <GrahaIconById id={e.planetId} size={44} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-lg" style={{ color: e.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
                        {tl(e.planetName, locale)}
                      </span>
                      <span className="text-orange-400 text-xs font-bold px-2 py-0.5 bg-orange-500/15 border border-orange-500/25 rounded-full">
                        {tl({ en: 'COMBUST', hi: 'अस्त', sa: 'अस्तङ्गतः', ta: 'அஸ்தமனம்', te: 'అస్తమయం', bn: 'অস্তগত', kn: 'ಅಸ್ತ', gu: 'અસ્ત', mai: 'अस्त', mr: 'अस्त' }, locale)}
                      </span>
                      {active && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-amber-500/15 border border-amber-500/25 rounded-full text-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {tl({ en: 'ACTIVE NOW', hi: 'अभी सक्रिय', sa: 'इदानीं सक्रियः', ta: 'இப்போது செயலில்', te: 'ఇప్పుడు క్రియాశీలం', bn: 'এখন সক্রিয়', kn: 'ಈಗ ಸಕ್ರಿಯ', gu: 'હાલ સક્રિય', mai: 'अखन सक्रिय अछि', mr: 'आत्ता सक्रिय' }, locale)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm flex-wrap">
                      <span className="text-gold-light font-mono font-bold">{formatDate(e.startDate)}</span>
                      <span className="text-gold-dark">→</span>
                      <span className="text-gold-light font-mono font-bold">{formatDate(e.endDate)}</span>
                      <span className="text-text-secondary/65 text-xs">({e.durationDays} {tl({ en: 'days', hi: 'दिन', sa: 'दिनानि', ta: 'நாட்கள்', te: 'రోజులు', bn: 'দিন', kn: 'ದಿನಗಳು', gu: 'દિવસ', mai: 'दिन', mr: 'दिवस' }, locale)})</span>
                      {sunSignName && (
                        <>
                          <span className="text-gold-primary/20">|</span>
                          <RashiIconById id={sunSign} size={14} />
                          <span className="text-text-secondary text-xs" style={bodyFont}>{tl(sunSignName, locale)}</span>
                        </>
                      )}
                    </div>
                    {meaning ? (
                      <p className="text-text-secondary text-sm leading-relaxed mb-3" style={bodyFont}>
                        {t2(meaning)}
                      </p>
                    ) : (
                      <p className="text-text-secondary/70 text-sm leading-relaxed mb-3" style={bodyFont}>
                        {locale === 'en'
                          ? `${e.planetName.en} is too close to the Sun and loses its independent strength. Its significations — ${e.planetId === 2 ? 'courage, energy, siblings' : e.planetId === 3 ? 'intellect, communication, trade' : e.planetId === 4 ? 'wisdom, fortune, teachers' : e.planetId === 5 ? 'love, beauty, creativity' : e.planetId === 6 ? 'discipline, structure, career' : 'its natural qualities'} — are overpowered by the Sun's blazing energy.`
                          : `${e.planetName.hi} सूर्य के बहुत निकट है और अपनी स्वतंत्र शक्ति खो देता है। इसके फल सूर्य की तीव्र ऊर्जा से दब जाते हैं।`}
                      </p>
                    )}

                    {/* Personalized house effect */}
                    {hasBirthData && houseEffect && (
                      <div className="rounded-xl p-4 bg-bg-primary/50 border border-gold-primary/15">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-orange-400 text-xs uppercase tracking-wider font-bold">
                            {tl({ en: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', hi: 'आपके लिए — चन्द्र से ${house}वाँ भाव', sa: 'आपके लिए — चन्द्र से ${house}वाँ भाव', ta: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', te: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', bn: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', kn: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', gu: 'For you — ${house}${[\'st\',\'nd\',\'rd\'][house-1] || \'th\'} house from Moon', mai: 'आपके लिए — चन्द्र से ${house}वाँ भाव', mr: 'आपके लिए — चन्द्र से ${house}वाँ भाव' }, locale)}
                          </span>
                        </div>
                        <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                          {t2(houseEffect)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
