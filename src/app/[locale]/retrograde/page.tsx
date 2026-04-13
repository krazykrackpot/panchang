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
  2: { en: 'Mars combust weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', hi: 'मंगल अस्त साहस, पहल और शारीरिक ऊर्जा को कमजोर करता है। संघर्ष से बचें। भाई-बहनों को कठिनाई हो सकती है।', sa: 'मंगल अस्त साहस, पहल और शारीरिक ऊर्जा को कमजोर करता है। संघर्ष से बचें। भाई-बहनों को कठिनाई हो सकती है।', mai: 'मंगल अस्त साहस, पहल और शारीरिक ऊर्जा को कमजोर करता है। संघर्ष से बचें। भाई-बहनों को कठिनाई हो सकती है।', mr: 'मंगल अस्त साहस, पहल और शारीरिक ऊर्जा को कमजोर करता है। संघर्ष से बचें। भाई-बहनों को कठिनाई हो सकती है।', ta: 'Mars combust weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', te: 'Mars combust weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', bn: 'Mars combust weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', kn: 'Mars combust weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.', gu: 'Mars combust weakens courage, initiative, and physical vitality. Avoid conflicts — you lack the fire to win them. Brothers/siblings may face difficulties.' },
  3: { en: 'Mercury combust clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', hi: 'बुध अस्त बुद्धि को धुँधला करता है, संवाद बाधित करता है। परीक्षा, वार्ता या महत्वपूर्ण पत्राचार के लिए अनुकूल नहीं।', sa: 'बुध अस्त बुद्धि को धुँधला करता है, संवाद बाधित करता है। परीक्षा, वार्ता या महत्वपूर्ण पत्राचार के लिए अनुकूल नहीं।', mai: 'बुध अस्त बुद्धि को धुँधला करता है, संवाद बाधित करता है। परीक्षा, वार्ता या महत्वपूर्ण पत्राचार के लिए अनुकूल नहीं।', mr: 'बुध अस्त बुद्धि को धुँधला करता है, संवाद बाधित करता है। परीक्षा, वार्ता या महत्वपूर्ण पत्राचार के लिए अनुकूल नहीं।', ta: 'Mercury combust clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', te: 'Mercury combust clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', bn: 'Mercury combust clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', kn: 'Mercury combust clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.', gu: 'Mercury combust clouds intellect, disrupts communication, and weakens analytical ability. Not ideal for exams, negotiations, or important correspondence.' },
  4: { en: 'Jupiter combust diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', hi: 'गुरु अस्त ज्ञान, सौभाग्य और गुरु मार्गदर्शन कम करता है। आध्यात्मिक अभ्यास खोखला लगता है। वित्तीय निर्णय प्रभावित।', sa: 'गुरु अस्त ज्ञान, सौभाग्य और गुरु मार्गदर्शन कम करता है। आध्यात्मिक अभ्यास खोखला लगता है। वित्तीय निर्णय प्रभावित।', mai: 'गुरु अस्त ज्ञान, सौभाग्य और गुरु मार्गदर्शन कम करता है। आध्यात्मिक अभ्यास खोखला लगता है। वित्तीय निर्णय प्रभावित।', mr: 'गुरु अस्त ज्ञान, सौभाग्य और गुरु मार्गदर्शन कम करता है। आध्यात्मिक अभ्यास खोखला लगता है। वित्तीय निर्णय प्रभावित।', ta: 'Jupiter combust diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', te: 'Jupiter combust diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', bn: 'Jupiter combust diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', kn: 'Jupiter combust diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.', gu: 'Jupiter combust diminishes wisdom, good fortune, and the guidance of teachers. Spiritual practices feel hollow. Financial judgment is impaired.' },
  5: { en: 'Venus combust dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', hi: 'शुक्र अस्त सुख, प्रेम, सृजनशीलता और विलासिता को सुखा देता है। संबंध असंतोषजनक लगते हैं।', sa: 'शुक्र अस्त सुख, प्रेम, सृजनशीलता और विलासिता को सुखा देता है। संबंध असंतोषजनक लगते हैं।', mai: 'शुक्र अस्त सुख, प्रेम, सृजनशीलता और विलासिता को सुखा देता है। संबंध असंतोषजनक लगते हैं।', mr: 'शुक्र अस्त सुख, प्रेम, सृजनशीलता और विलासिता को सुखा देता है। संबंध असंतोषजनक लगते हैं।', ta: 'Venus combust dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', te: 'Venus combust dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', bn: 'Venus combust dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', kn: 'Venus combust dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.', gu: 'Venus combust dries up pleasure, romance, creativity, and luxury. Relationships feel unsatisfying. Artistic inspiration wanes.' },
  6: { en: 'Saturn combust weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', hi: 'शनि अस्त अनुशासन, दीर्घकालिक योजना और संरचनात्मक स्थिरता को कमजोर करता है।', sa: 'शनि अस्त अनुशासन, दीर्घकालिक योजना और संरचनात्मक स्थिरता को कमजोर करता है।', mai: 'शनि अस्त अनुशासन, दीर्घकालिक योजना और संरचनात्मक स्थिरता को कमजोर करता है।', mr: 'शनि अस्त अनुशासन, दीर्घकालिक योजना और संरचनात्मक स्थिरता को कमजोर करता है।', ta: 'Saturn combust weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', te: 'Saturn combust weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', bn: 'Saturn combust weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', kn: 'Saturn combust weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.', gu: 'Saturn combust weakens discipline, long-term planning, and structural stability. Commitments feel burdensome. Authority figures are unsupportive.' },
};

// ─── House transit interpretation from Moon sign ─────────────────────────────

const HOUSE_RETRO_EFFECT: Record<number, LocaleText> = {
  1: { en: 'Transiting your 1st house — affects health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', hi: 'आपके प्रथम भाव में गोचर — स्वास्थ्य, आत्म-छवि और व्यक्तिगत पहल प्रभावित। शरीर का विशेष ध्यान रखें।', sa: 'आपके प्रथम भाव में गोचर — स्वास्थ्य, आत्म-छवि और व्यक्तिगत पहल प्रभावित। शरीर का विशेष ध्यान रखें।', mai: 'आपके प्रथम भाव में गोचर — स्वास्थ्य, आत्म-छवि और व्यक्तिगत पहल प्रभावित। शरीर का विशेष ध्यान रखें।', mr: 'आपके प्रथम भाव में गोचर — स्वास्थ्य, आत्म-छवि और व्यक्तिगत पहल प्रभावित। शरीर का विशेष ध्यान रखें।', ta: 'Transiting your 1st house — affects health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', te: 'Transiting your 1st house — affects health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', bn: 'Transiting your 1st house — affects health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', kn: 'Transiting your 1st house — affects health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.', gu: 'Transiting your 1st house — affects health, self-image, and personal initiatives. Take extra care of your body and avoid impulsive decisions.' },
  2: { en: 'Transiting your 2nd house — affects finances, family harmony, and speech. Avoid major purchases and be careful with words.', hi: 'आपके द्वितीय भाव में — वित्त, पारिवारिक सद्भाव और वाणी प्रभावित। बड़ी खरीदारी से बचें।', sa: 'आपके द्वितीय भाव में — वित्त, पारिवारिक सद्भाव और वाणी प्रभावित। बड़ी खरीदारी से बचें।', mai: 'आपके द्वितीय भाव में — वित्त, पारिवारिक सद्भाव और वाणी प्रभावित। बड़ी खरीदारी से बचें।', mr: 'आपके द्वितीय भाव में — वित्त, पारिवारिक सद्भाव और वाणी प्रभावित। बड़ी खरीदारी से बचें।', ta: 'Transiting your 2nd house — affects finances, family harmony, and speech. Avoid major purchases and be careful with words.', te: 'Transiting your 2nd house — affects finances, family harmony, and speech. Avoid major purchases and be careful with words.', bn: 'Transiting your 2nd house — affects finances, family harmony, and speech. Avoid major purchases and be careful with words.', kn: 'Transiting your 2nd house — affects finances, family harmony, and speech. Avoid major purchases and be careful with words.', gu: 'Transiting your 2nd house — affects finances, family harmony, and speech. Avoid major purchases and be careful with words.' },
  3: { en: 'Transiting your 3rd house — affects courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', hi: 'आपके तृतीय भाव में — साहस, भाई-बहन, छोटी यात्रा प्रभावित। संदेश विलंबित या गलत समझे जा सकते हैं।', sa: 'आपके तृतीय भाव में — साहस, भाई-बहन, छोटी यात्रा प्रभावित। संदेश विलंबित या गलत समझे जा सकते हैं।', mai: 'आपके तृतीय भाव में — साहस, भाई-बहन, छोटी यात्रा प्रभावित। संदेश विलंबित या गलत समझे जा सकते हैं।', mr: 'आपके तृतीय भाव में — साहस, भाई-बहन, छोटी यात्रा प्रभावित। संदेश विलंबित या गलत समझे जा सकते हैं।', ta: 'Transiting your 3rd house — affects courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', te: 'Transiting your 3rd house — affects courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', bn: 'Transiting your 3rd house — affects courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', kn: 'Transiting your 3rd house — affects courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.', gu: 'Transiting your 3rd house — affects courage, siblings, short travel, and communication. Messages may be delayed or misunderstood.' },
  4: { en: 'Transiting your 4th house — affects home, mother, emotional peace, and property. Domestic disruptions possible. Avoid property transactions.', hi: 'आपके चतुर्थ भाव में — घर, माता, मानसिक शांति प्रभावित। घरेलू बाधाएँ संभव। संपत्ति लेनदेन से बचें।', sa: 'आपके चतुर्थ भाव में — घर, माता, मानसिक शांति प्रभावित। घरेलू बाधाएँ संभव। संपत्ति लेनदेन से बचें।', mai: 'आपके चतुर्थ भाव में — घर, माता, मानसिक शांति प्रभावित। घरेलू बाधाएँ संभव। संपत्ति लेनदेन से बचें।', mr: 'आपके चतुर्थ भाव में — घर, माता, मानसिक शांति प्रभावित। घरेलू बाधाएँ संभव। संपत्ति लेनदेन से बचें।', ta: 'Transiting your 4th house — affects home, mother, emotional peace, and property. Domestic disruptions possible. Avoid property transactions.', te: 'Transiting your 4th house — affects home, mother, emotional peace, and property. Domestic disruptions possible. Avoid property transactions.', bn: 'Transiting your 4th house — affects home, mother, emotional peace, and property. Domestic disruptions possible. Avoid property transactions.', kn: 'Transiting your 4th house — affects home, mother, emotional peace, and property. Domestic disruptions possible. Avoid property transactions.', gu: 'Transiting your 4th house — affects home, mother, emotional peace, and property. Domestic disruptions possible. Avoid property transactions.' },
  5: { en: 'Transiting your 5th house — affects children, romance, creativity, and speculation. Past lovers may reappear. Avoid risky investments.', hi: 'आपके पंचम भाव में — संतान, प्रेम, सृजनशीलता प्रभावित। पुराने प्रेमी फिर प्रकट हो सकते हैं। जोखिम भरे निवेश से बचें।', sa: 'आपके पंचम भाव में — संतान, प्रेम, सृजनशीलता प्रभावित। पुराने प्रेमी फिर प्रकट हो सकते हैं। जोखिम भरे निवेश से बचें।', mai: 'आपके पंचम भाव में — संतान, प्रेम, सृजनशीलता प्रभावित। पुराने प्रेमी फिर प्रकट हो सकते हैं। जोखिम भरे निवेश से बचें।', mr: 'आपके पंचम भाव में — संतान, प्रेम, सृजनशीलता प्रभावित। पुराने प्रेमी फिर प्रकट हो सकते हैं। जोखिम भरे निवेश से बचें।', ta: 'Transiting your 5th house — affects children, romance, creativity, and speculation. Past lovers may reappear. Avoid risky investments.', te: 'Transiting your 5th house — affects children, romance, creativity, and speculation. Past lovers may reappear. Avoid risky investments.', bn: 'Transiting your 5th house — affects children, romance, creativity, and speculation. Past lovers may reappear. Avoid risky investments.', kn: 'Transiting your 5th house — affects children, romance, creativity, and speculation. Past lovers may reappear. Avoid risky investments.', gu: 'Transiting your 5th house — affects children, romance, creativity, and speculation. Past lovers may reappear. Avoid risky investments.' },
  6: { en: 'Transiting your 6th house — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.', hi: 'आपके षष्ठ भाव में — वास्तव में अनुकूल! शत्रु कमजोर, ऋण समाधान, स्वास्थ्य समस्याएँ उपचार हेतु सतह पर।', sa: 'आपके षष्ठ भाव में — वास्तव में अनुकूल! शत्रु कमजोर, ऋण समाधान, स्वास्थ्य समस्याएँ उपचार हेतु सतह पर।', mai: 'आपके षष्ठ भाव में — वास्तव में अनुकूल! शत्रु कमजोर, ऋण समाधान, स्वास्थ्य समस्याएँ उपचार हेतु सतह पर।', mr: 'आपके षष्ठ भाव में — वास्तव में अनुकूल! शत्रु कमजोर, ऋण समाधान, स्वास्थ्य समस्याएँ उपचार हेतु सतह पर।', ta: 'Transiting your 6th house — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.', te: 'Transiting your 6th house — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.', bn: 'Transiting your 6th house — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.', kn: 'Transiting your 6th house — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.', gu: 'Transiting your 6th house — actually favorable! Enemies weaken, debts can be resolved, health issues surface for healing.' },
  7: { en: 'Transiting your 7th house — affects marriage, partnerships, and contracts. Existing relationships are tested. Avoid new partnerships.', hi: 'आपके सप्तम भाव में — विवाह, साझेदारी और अनुबंध प्रभावित। मौजूदा संबंध परखे जाते हैं। नई साझेदारी से बचें।', sa: 'आपके सप्तम भाव में — विवाह, साझेदारी और अनुबंध प्रभावित। मौजूदा संबंध परखे जाते हैं। नई साझेदारी से बचें।', mai: 'आपके सप्तम भाव में — विवाह, साझेदारी और अनुबंध प्रभावित। मौजूदा संबंध परखे जाते हैं। नई साझेदारी से बचें।', mr: 'आपके सप्तम भाव में — विवाह, साझेदारी और अनुबंध प्रभावित। मौजूदा संबंध परखे जाते हैं। नई साझेदारी से बचें।', ta: 'Transiting your 7th house — affects marriage, partnerships, and contracts. Existing relationships are tested. Avoid new partnerships.', te: 'Transiting your 7th house — affects marriage, partnerships, and contracts. Existing relationships are tested. Avoid new partnerships.', bn: 'Transiting your 7th house — affects marriage, partnerships, and contracts. Existing relationships are tested. Avoid new partnerships.', kn: 'Transiting your 7th house — affects marriage, partnerships, and contracts. Existing relationships are tested. Avoid new partnerships.', gu: 'Transiting your 7th house — affects marriage, partnerships, and contracts. Existing relationships are tested. Avoid new partnerships.' },
  8: { en: 'Transiting your 8th house — affects longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', hi: 'आपके अष्टम भाव में — दीर्घायु, गुप्त मामले प्रभावित। पुराने रहस्य सतह पर। संयुक्त वित्त में सावधानी।', sa: 'आपके अष्टम भाव में — दीर्घायु, गुप्त मामले प्रभावित। पुराने रहस्य सतह पर। संयुक्त वित्त में सावधानी।', mai: 'आपके अष्टम भाव में — दीर्घायु, गुप्त मामले प्रभावित। पुराने रहस्य सतह पर। संयुक्त वित्त में सावधानी।', mr: 'आपके अष्टम भाव में — दीर्घायु, गुप्त मामले प्रभावित। पुराने रहस्य सतह पर। संयुक्त वित्त में सावधानी।', ta: 'Transiting your 8th house — affects longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', te: 'Transiting your 8th house — affects longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', bn: 'Transiting your 8th house — affects longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', kn: 'Transiting your 8th house — affects longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.', gu: 'Transiting your 8th house — affects longevity, hidden matters, and transformation. Old secrets surface. Be cautious with joint finances.' },
  9: { en: 'Transiting your 9th house — affects luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', hi: 'आपके नवम भाव में — भाग्य, पिता, उच्च शिक्षा प्रभावित। यात्रा योजनाएँ बदल सकती हैं। विश्वासों का पुनर्मूल्यांकन करें।', sa: 'आपके नवम भाव में — भाग्य, पिता, उच्च शिक्षा प्रभावित। यात्रा योजनाएँ बदल सकती हैं। विश्वासों का पुनर्मूल्यांकन करें।', mai: 'आपके नवम भाव में — भाग्य, पिता, उच्च शिक्षा प्रभावित। यात्रा योजनाएँ बदल सकती हैं। विश्वासों का पुनर्मूल्यांकन करें।', mr: 'आपके नवम भाव में — भाग्य, पिता, उच्च शिक्षा प्रभावित। यात्रा योजनाएँ बदल सकती हैं। विश्वासों का पुनर्मूल्यांकन करें।', ta: 'Transiting your 9th house — affects luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', te: 'Transiting your 9th house — affects luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', bn: 'Transiting your 9th house — affects luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', kn: 'Transiting your 9th house — affects luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.', gu: 'Transiting your 9th house — affects luck, father, higher learning, and long travel. Travel plans may change. Reassess beliefs.' },
  10: { en: 'Transiting your 10th house — affects career, reputation, and authority. Professional setbacks or delays. Don\'t start new ventures.', hi: 'आपके दशम भाव में — करियर, प्रतिष्ठा प्रभावित। पेशेवर बाधाएँ या विलंब। नया उद्यम शुरू न करें।' },
  11: { en: 'Transiting your 11th house — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', hi: 'आपके एकादश भाव में — सामान्यतः अनुकूल। पुराने मित्रों से पुनः जुड़ें। विलंबित लाभ प्राप्त।', sa: 'आपके एकादश भाव में — सामान्यतः अनुकूल। पुराने मित्रों से पुनः जुड़ें। विलंबित लाभ प्राप्त।', mai: 'आपके एकादश भाव में — सामान्यतः अनुकूल। पुराने मित्रों से पुनः जुड़ें। विलंबित लाभ प्राप्त।', mr: 'आपके एकादश भाव में — सामान्यतः अनुकूल। पुराने मित्रों से पुनः जुड़ें। विलंबित लाभ प्राप्त।', ta: 'Transiting your 11th house — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', te: 'Transiting your 11th house — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', bn: 'Transiting your 11th house — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', kn: 'Transiting your 11th house — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.', gu: 'Transiting your 11th house — generally favorable. Reconnect with old friends. Delayed gains arrive. Social circle restructures.' },
  12: { en: 'Transiting your 12th house — affects expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.', hi: 'आपके द्वादश भाव में — व्यय, नींद, विदेशी संपर्क प्रभावित। छिपे व्यय सतह पर। आध्यात्मिक एकान्त के लिए अच्छा।', sa: 'आपके द्वादश भाव में — व्यय, नींद, विदेशी संपर्क प्रभावित। छिपे व्यय सतह पर। आध्यात्मिक एकान्त के लिए अच्छा।', mai: 'आपके द्वादश भाव में — व्यय, नींद, विदेशी संपर्क प्रभावित। छिपे व्यय सतह पर। आध्यात्मिक एकान्त के लिए अच्छा।', mr: 'आपके द्वादश भाव में — व्यय, नींद, विदेशी संपर्क प्रभावित। छिपे व्यय सतह पर। आध्यात्मिक एकान्त के लिए अच्छा।', ta: 'Transiting your 12th house — affects expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.', te: 'Transiting your 12th house — affects expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.', bn: 'Transiting your 12th house — affects expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.', kn: 'Transiting your 12th house — affects expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.', gu: 'Transiting your 12th house — affects expenses, sleep, and foreign connections. Hidden expenses surface. Good for spiritual retreat.' },
};

// House effects for combustion — weakened planet energy in each house
const HOUSE_COMBUST_EFFECT: Record<number, LocaleText> = {
  1: { en: 'Combust planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', hi: 'अस्त ग्रह प्रथम भाव कमजोर — कम ऊर्जा, स्वास्थ्य समस्याएँ, आत्मविश्वास में कमी।', sa: 'अस्त ग्रह प्रथम भाव कमजोर — कम ऊर्जा, स्वास्थ्य समस्याएँ, आत्मविश्वास में कमी।', mai: 'अस्त ग्रह प्रथम भाव कमजोर — कम ऊर्जा, स्वास्थ्य समस्याएँ, आत्मविश्वास में कमी।', mr: 'अस्त ग्रह प्रथम भाव कमजोर — कम ऊर्जा, स्वास्थ्य समस्याएँ, आत्मविश्वास में कमी।', ta: 'Combust planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', te: 'Combust planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', bn: 'Combust planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', kn: 'Combust planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.', gu: 'Combust planet weakens 1st house — low energy, health issues, diminished self-confidence. Take it easy.' },
  2: { en: 'Combust planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', hi: 'द्वितीय भाव कमजोर — वित्तीय निर्णय प्रभावित, पारिवारिक संवाद तनावपूर्ण।', sa: 'द्वितीय भाव कमजोर — वित्तीय निर्णय प्रभावित, पारिवारिक संवाद तनावपूर्ण।', mai: 'द्वितीय भाव कमजोर — वित्तीय निर्णय प्रभावित, पारिवारिक संवाद तनावपूर्ण।', mr: 'द्वितीय भाव कमजोर — वित्तीय निर्णय प्रभावित, पारिवारिक संवाद तनावपूर्ण।', ta: 'Combust planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', te: 'Combust planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', bn: 'Combust planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', kn: 'Combust planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.', gu: 'Combust planet weakens 2nd house — financial judgment impaired, family communication strained, speech lacks impact.' },
  3: { en: 'Combust planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', hi: 'तृतीय भाव में — साहस कम, संवाद प्रयास विफल, भाई-बहनों को सहायता की आवश्यकता।', sa: 'तृतीय भाव में — साहस कम, संवाद प्रयास विफल, भाई-बहनों को सहायता की आवश्यकता।', mai: 'तृतीय भाव में — साहस कम, संवाद प्रयास विफल, भाई-बहनों को सहायता की आवश्यकता।', mr: 'तृतीय भाव में — साहस कम, संवाद प्रयास विफल, भाई-बहनों को सहायता की आवश्यकता।', ta: 'Combust planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', te: 'Combust planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', bn: 'Combust planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', kn: 'Combust planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.', gu: 'Combust planet in 3rd house — courage diminished, communication efforts fall flat, siblings may need support.' },
  4: { en: 'Combust planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', hi: 'चतुर्थ भाव कमजोर — घरेलू सुख बाधित, माता को स्वास्थ्य समस्या, संपत्ति मामले रुके।', sa: 'चतुर्थ भाव कमजोर — घरेलू सुख बाधित, माता को स्वास्थ्य समस्या, संपत्ति मामले रुके।', mai: 'चतुर्थ भाव कमजोर — घरेलू सुख बाधित, माता को स्वास्थ्य समस्या, संपत्ति मामले रुके।', mr: 'चतुर्थ भाव कमजोर — घरेलू सुख बाधित, माता को स्वास्थ्य समस्या, संपत्ति मामले रुके।', ta: 'Combust planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', te: 'Combust planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', bn: 'Combust planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', kn: 'Combust planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.', gu: 'Combust planet weakens 4th house — domestic comfort disrupted, mother may face health issues, property matters stall.' },
  5: { en: 'Combust planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', hi: 'पंचम भाव में — सृजनात्मक अवरोध, प्रेम में चिंगारी कम, संतान अस्वस्थ, सट्टे से बचें।', sa: 'पंचम भाव में — सृजनात्मक अवरोध, प्रेम में चिंगारी कम, संतान अस्वस्थ, सट्टे से बचें।', mai: 'पंचम भाव में — सृजनात्मक अवरोध, प्रेम में चिंगारी कम, संतान अस्वस्थ, सट्टे से बचें।', mr: 'पंचम भाव में — सृजनात्मक अवरोध, प्रेम में चिंगारी कम, संतान अस्वस्थ, सट्टे से बचें।', ta: 'Combust planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', te: 'Combust planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', bn: 'Combust planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', kn: 'Combust planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.', gu: 'Combust planet in 5th house — creative blocks, romance loses spark, children may be unwell, avoid speculation.' },
  6: { en: 'Combust planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', hi: 'षष्ठ भाव में — विरोधाभासी रूप से सहायक! शत्रु भी कमजोर। लेकिन स्वास्थ्य सतर्कता आवश्यक।', sa: 'षष्ठ भाव में — विरोधाभासी रूप से सहायक! शत्रु भी कमजोर। लेकिन स्वास्थ्य सतर्कता आवश्यक।', mai: 'षष्ठ भाव में — विरोधाभासी रूप से सहायक! शत्रु भी कमजोर। लेकिन स्वास्थ्य सतर्कता आवश्यक।', mr: 'षष्ठ भाव में — विरोधाभासी रूप से सहायक! शत्रु भी कमजोर। लेकिन स्वास्थ्य सतर्कता आवश्यक।', ta: 'Combust planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', te: 'Combust planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', bn: 'Combust planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', kn: 'Combust planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.', gu: 'Combust planet in 6th house — paradoxically helpful! Enemies are weakened too. But health vigilance needed.' },
  7: { en: 'Combust planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', hi: 'सप्तम भाव कमजोर — साथी दूर महसूस, वार्ता में ऊर्जा की कमी, नए अनुबंध से बचें।', sa: 'सप्तम भाव कमजोर — साथी दूर महसूस, वार्ता में ऊर्जा की कमी, नए अनुबंध से बचें।', mai: 'सप्तम भाव कमजोर — साथी दूर महसूस, वार्ता में ऊर्जा की कमी, नए अनुबंध से बचें।', mr: 'सप्तम भाव कमजोर — साथी दूर महसूस, वार्ता में ऊर्जा की कमी, नए अनुबंध से बचें।', ta: 'Combust planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', te: 'Combust planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', bn: 'Combust planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', kn: 'Combust planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.', gu: 'Combust planet weakens 7th house — partner feels distant, negotiations lack energy, avoid new contracts.' },
  8: { en: 'Combust planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', hi: 'अष्टम भाव में — छिपी कमजोरियाँ सतह पर। संयुक्त वित्त और बीमा में सावधानी।', sa: 'अष्टम भाव में — छिपी कमजोरियाँ सतह पर। संयुक्त वित्त और बीमा में सावधानी।', mai: 'अष्टम भाव में — छिपी कमजोरियाँ सतह पर। संयुक्त वित्त और बीमा में सावधानी।', mr: 'अष्टम भाव में — छिपी कमजोरियाँ सतह पर। संयुक्त वित्त और बीमा में सावधानी।', ta: 'Combust planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', te: 'Combust planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', bn: 'Combust planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', kn: 'Combust planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.', gu: 'Combust planet in 8th house — hidden vulnerabilities surface. Be careful with joint finances and insurance matters.' },
  9: { en: 'Combust planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', hi: 'नवम भाव में — भाग्य मंद, गुरु मार्गदर्शन अनुपलब्ध, लंबी यात्रा समस्याग्रस्त।', sa: 'नवम भाव में — भाग्य मंद, गुरु मार्गदर्शन अनुपलब्ध, लंबी यात्रा समस्याग्रस्त।', mai: 'नवम भाव में — भाग्य मंद, गुरु मार्गदर्शन अनुपलब्ध, लंबी यात्रा समस्याग्रस्त।', mr: 'नवम भाव में — भाग्य मंद, गुरु मार्गदर्शन अनुपलब्ध, लंबी यात्रा समस्याग्रस्त।', ta: 'Combust planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', te: 'Combust planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', bn: 'Combust planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', kn: 'Combust planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.', gu: 'Combust planet in 9th house — luck feels muted, guru guidance unavailable, long-distance travel problematic.' },
  10: { en: 'Combust planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', hi: 'दशम भाव कमजोर — करियर गति रुकी, अधिकारी असहायक, सार्वजनिक छवि मंद।', sa: 'दशम भाव कमजोर — करियर गति रुकी, अधिकारी असहायक, सार्वजनिक छवि मंद।', mai: 'दशम भाव कमजोर — करियर गति रुकी, अधिकारी असहायक, सार्वजनिक छवि मंद।', mr: 'दशम भाव कमजोर — करियर गति रुकी, अधिकारी असहायक, सार्वजनिक छवि मंद।', ta: 'Combust planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', te: 'Combust planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', bn: 'Combust planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', kn: 'Combust planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.', gu: 'Combust planet weakens 10th house — career momentum stalls, authority figures unsupportive, public image dims.' },
  11: { en: 'Combust planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', hi: 'एकादश भाव में — लाभ विलंबित, सामाजिक संपर्क उदासीन, बड़े भाई-बहनों को कठिनाई।', sa: 'एकादश भाव में — लाभ विलंबित, सामाजिक संपर्क उदासीन, बड़े भाई-बहनों को कठिनाई।', mai: 'एकादश भाव में — लाभ विलंबित, सामाजिक संपर्क उदासीन, बड़े भाई-बहनों को कठिनाई।', mr: 'एकादश भाव में — लाभ विलंबित, सामाजिक संपर्क उदासीन, बड़े भाई-बहनों को कठिनाई।', ta: 'Combust planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', te: 'Combust planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', bn: 'Combust planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', kn: 'Combust planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.', gu: 'Combust planet in 11th house — gains delayed, social connections feel lukewarm, elder siblings face difficulties.' },
  12: { en: 'Combust planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', hi: 'द्वादश भाव में — व्यय बढ़ा, नींद खराब, विदेशी संपर्क कमजोर। त्याग के लिए अच्छा।', sa: 'द्वादश भाव में — व्यय बढ़ा, नींद खराब, विदेशी संपर्क कमजोर। त्याग के लिए अच्छा।', mai: 'द्वादश भाव में — व्यय बढ़ा, नींद खराब, विदेशी संपर्क कमजोर। त्याग के लिए अच्छा।', mr: 'द्वादश भाव में — व्यय बढ़ा, नींद खराब, विदेशी संपर्क कमजोर। त्याग के लिए अच्छा।', ta: 'Combust planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', te: 'Combust planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', bn: 'Combust planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', kn: 'Combust planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.', gu: 'Combust planet in 12th house — expenses increase, sleep quality poor, foreign connections weaken. Good for letting go.' },
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
    return d.toLocaleDateString(!isDevanagariLocale(locale) ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'short' });
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
            {!isDevanagariLocale(locale) ? 'Retrograde & Combustion' : 'वक्री एवं अस्त'}
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
                  {!isDevanagariLocale(locale) ? 'Current Cosmic Weather' : 'वर्तमान ब्रह्मांडीय मौसम'}
                </h3>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>{!isDevanagariLocale(locale) ? `Moon in ${moonName?.en}` : `चन्द्र ${moonName?.hi} में`}</span>
                  <span className="text-gold-primary/20">|</span>
                  <span className={`font-bold ${toneColor === 'emerald' ? 'text-emerald-400' : toneColor === 'red' ? 'text-red-400' : 'text-amber-400'}`}>
                    {totalActive === 0
                      ? (!isDevanagariLocale(locale) ? 'All Clear' : 'सब स्पष्ट')
                      : `${totalActive} ${!isDevanagariLocale(locale) ? 'Active' : 'सक्रिय'}`}
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
                    <div className="text-red-400 text-xs font-bold uppercase">{!isDevanagariLocale(locale) ? 'Retrograde' : 'वक्री'}</div>
                    {hasBirthData && <div className="text-text-secondary/70 text-xs mt-1">{!isDevanagariLocale(locale) ? `${getHouseFromMoon(birthRashi, r.startSign)}${['st','nd','rd'][getHouseFromMoon(birthRashi, r.startSign)-1]||'th'} house` : `${getHouseFromMoon(birthRashi, r.startSign)}वाँ भाव`}</div>}
                  </div>
                ))}
                {activeCombusts.map(c => (
                  <div key={`c-${c.planetId}`} className="rounded-lg p-3 border border-orange-500/20 bg-orange-500/5 text-center">
                    <div className="text-xs font-bold mb-1" style={{ color: c.planetColor }}>{tl(c.planetName, locale)}</div>
                    <div className="text-orange-400 text-xs font-bold uppercase">{!isDevanagariLocale(locale) ? 'Combust' : 'अस्त'}</div>
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
              {!isDevanagariLocale(locale) ? 'Generate Kundali' : 'कुंडली बनाएँ'}
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
          {!isDevanagariLocale(locale) ? `Retrograde (${retroPeriods.length})` : `वक्री (${retroPeriods.length})`}
        </button>
        <button
          onClick={() => setTab('combustion')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'combustion' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
          }`}
        >
          {!isDevanagariLocale(locale) ? `Combustion (${combustEvents.length})` : `अस्त (${combustEvents.length})`}
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
              {!isDevanagariLocale(locale) ? `${year} Retrograde & Combustion Timeline` : `${year} वक्री और अस्त समयरेखा`}
            </h3>
            <p className="text-text-secondary/50 text-xs mb-4">
              {!isDevanagariLocale(locale) ? 'Red = retrograde, Orange = combust. Hover for dates.' : 'लाल = वक्री, नारंगी = अस्त।'}
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
              <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-red-500/70" /><span className="text-gray-500">{!isDevanagariLocale(locale) ? 'Retrograde' : 'वक्री'}</span></span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-orange-500/60" /><span className="text-gray-500">{!isDevanagariLocale(locale) ? 'Combust' : 'अस्त'}</span></span>
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
              {!isDevanagariLocale(locale) ? 'No retrograde periods found.' : 'कोई वक्री अवधि नहीं मिली।'}
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
                          {!isDevanagariLocale(locale) ? 'RETROGRADE' : 'वक्री'}
                        </span>
                        {active && (
                          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-amber-500/15 border border-amber-500/25 rounded-full text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            {!isDevanagariLocale(locale) ? 'ACTIVE NOW' : 'अभी सक्रिय'}
                          </span>
                        )}
                      </div>

                      {/* Dates & signs */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-gold-light font-mono text-sm font-bold">{formatDate(p.startDate)}</span>
                        <span className="text-gold-dark">→</span>
                        <span className="text-gold-light font-mono text-sm font-bold">{formatDate(p.endDate)}</span>
                        <span className="text-text-secondary/65 text-xs">({p.durationDays} {!isDevanagariLocale(locale) ? 'days' : 'दिन'})</span>
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
                              {!isDevanagariLocale(locale) ? `For you — ${house}${['st','nd','rd'][house-1] || 'th'} house from Moon` : `आपके लिए — चन्द्र से ${house}वाँ भाव`}
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
                              <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold">{!isDevanagariLocale(locale) ? 'Do' : 'करें'}</span>
                            </div>
                            <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{t2(meaning.dos)}</p>
                          </div>
                          <div className="rounded-lg p-3 bg-red-500/5 border border-red-500/15">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              <span className="text-red-400 text-xs uppercase tracking-wider font-bold">{!isDevanagariLocale(locale) ? "Don't" : 'न करें'}</span>
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
              {!isDevanagariLocale(locale) ? 'No combustion events found.' : 'कोई अस्त घटना नहीं मिली।'}
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
                        {!isDevanagariLocale(locale) ? 'COMBUST' : 'अस्त'}
                      </span>
                      {active && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-amber-500/15 border border-amber-500/25 rounded-full text-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {!isDevanagariLocale(locale) ? 'ACTIVE NOW' : 'अभी सक्रिय'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm flex-wrap">
                      <span className="text-gold-light font-mono font-bold">{formatDate(e.startDate)}</span>
                      <span className="text-gold-dark">→</span>
                      <span className="text-gold-light font-mono font-bold">{formatDate(e.endDate)}</span>
                      <span className="text-text-secondary/65 text-xs">({e.durationDays} {!isDevanagariLocale(locale) ? 'days' : 'दिन'})</span>
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
                            {!isDevanagariLocale(locale) ? `For you — ${house}${['st','nd','rd'][house-1] || 'th'} house from Moon` : `आपके लिए — चन्द्र से ${house}वाँ भाव`}
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
