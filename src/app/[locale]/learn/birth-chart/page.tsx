'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/birth-chart.json';

// ─── Trilingual Labels ────────────────────────────────────────────────────────
const L = {
  title: {
    en: 'Understanding Your Birth Chart (Kundali)',
    hi: 'अपनी जन्म कुण्डली को समझें',
    ta: 'உங்கள் ஜாதகத்தை புரிந்துகொள்ளுங்கள் (குண்டலி)',
  },
  subtitle: {
    en: 'A complete beginner\'s guide to reading the map of your sky at birth',
    hi: 'जन्म के समय आपके आकाश के नक्शे को पढ़ने की सम्पूर्ण शुरुआती मार्गदर्शिका',
  },

  whatTitle: { en: 'What is a Birth Chart?', hi: 'जन्म कुण्डली क्या है?', sa: 'जन्म कुण्डली क्या है?', mai: 'जन्म कुण्डली क्या है?', mr: 'जन्म कुण्डली क्या है?', ta: 'What is a Birth Chart?', te: 'What is a Birth Chart?', bn: 'What is a Birth Chart?', kn: 'What is a Birth Chart?', gu: 'What is a Birth Chart?' },
  whatP1: {
    en: 'A birth chart — known as Kundali (कुण्डली), Janam Patri (जन्म पत्री), or Janma Kundali — is a snapshot of the entire sky at the exact moment you were born, as seen from your birthplace. It maps where the Sun, Moon, and all visible planets were positioned against the backdrop of the 12 zodiac signs.',
    hi: 'जन्म कुण्डली — जिसे जन्म पत्री या जन्म कुण्डली भी कहते हैं — आपके जन्म के सटीक क्षण में सम्पूर्ण आकाश का एक चित्र है, जैसा आपके जन्म स्थान से दिखता था। यह दर्शाता है कि सूर्य, चन्द्रमा और सभी दृश्य ग्रह 12 राशियों की पृष्ठभूमि में कहाँ स्थित थे।',
  },
  whatP2: {
    en: 'Think of it as your cosmic DNA — a unique celestial fingerprint that no one else on Earth shares (unless they were born at the same second, in the same hospital room). This chart becomes the foundation for all Vedic astrological analysis: personality, career, relationships, health, timing of events, and spiritual growth.',
    hi: 'इसे अपना ब्रह्मांडीय DNA समझें — एक अद्वितीय खगोलीय उंगली का निशान जो पृथ्वी पर किसी और का नहीं है। यह कुण्डली सभी वैदिक ज्योतिषीय विश्लेषण की नींव बनती है: व्यक्तित्व, कैरियर, सम्बन्ध, स्वास्थ्य, घटनाओं का समय और आध्यात्मिक विकास।',
  },
  whatP3: {
    en: 'Unlike Western astrology\'s focus on Sun signs ("I\'m a Leo"), Vedic astrology examines the ENTIRE chart — all 9 planets, 12 houses, 12 signs, 27 nakshatras, and their complex interrelationships. Your Sun sign is just one small piece of a vast puzzle.',
    hi: 'पश्चिमी ज्योतिष के सूर्य राशि पर ध्यान ("मैं सिंह हूँ") के विपरीत, वैदिक ज्योतिष सम्पूर्ण कुण्डली की जाँच करता है — सभी 9 ग्रह, 12 भाव, 12 राशियाँ, 27 नक्षत्र और उनके जटिल अन्तर्सम्बन्ध।',
  },

  whyTimeTitle: { en: 'Why Birth Time and Place Matter', hi: 'जन्म समय और स्थान क्यों मायने रखते हैं', sa: 'जन्म समय और स्थान क्यों मायने रखते हैं', mai: 'जन्म समय और स्थान क्यों मायने रखते हैं', mr: 'जन्म समय और स्थान क्यों मायने रखते हैं', ta: 'Why Birth Time and Place Matter', te: 'Why Birth Time and Place Matter', bn: 'Why Birth Time and Place Matter', kn: 'Why Birth Time and Place Matter', gu: 'Why Birth Time and Place Matter' },
  whyTimeP1: {
    en: 'The birth chart\'s most sensitive element is the Ascendant (Lagna) — the zodiac sign rising on the eastern horizon at the moment of birth. The Ascendant changes roughly every 2 hours, which means two babies born 3 hours apart in the same city will have completely different charts.',
    hi: 'जन्म कुण्डली का सबसे संवेदनशील तत्व लग्न है — जन्म के क्षण में पूर्वी क्षितिज पर उदय होने वाली राशि। लग्न लगभग हर 2 घंटे में बदलता है, इसलिए एक ही शहर में 3 घंटे के अन्तर से जन्मे दो बच्चों की कुण्डलियाँ पूर्णतः भिन्न होंगी।',
  },
  whyTimeP2: {
    en: 'The Ascendant determines which house each planet falls in, which in turn determines which life areas each planet affects. A difference of even 5-10 minutes can shift planets between houses, changing the entire interpretation. This is why Vedic astrologers insist on precise birth time.',
    hi: 'लग्न निर्धारित करता है कि कौन सा ग्रह किस भाव में पड़ता है, जो बदले में निर्धारित करता है कि प्रत्येक ग्रह कौन सा जीवन क्षेत्र प्रभावित करता है। 5-10 मिनट का अन्तर भी ग्रहों को भावों के बीच खिसका सकता है। इसीलिए वैदिक ज्योतिषी सटीक जन्म समय पर ज़ोर देते हैं।',
  },
  whyTimeP3: {
    en: 'Birth PLACE matters because the sky looks different from different longitudes and latitudes. The same moment in time produces a different Ascendant in New York vs Mumbai vs Tokyo. The location determines local sidereal time, which sets the Ascendant degree.',
    hi: 'जन्म स्थान इसलिए मायने रखता है क्योंकि विभिन्न अक्षांशों और देशांतरों से आकाश अलग दिखता है। समय का वही क्षण न्यूयॉर्क, मुम्बई और टोक्यो में भिन्न लग्न उत्पन्न करता है। स्थान स्थानीय नाक्षत्र काल निर्धारित करता है, जो लग्न अंश तय करता है।',
  },
  whyTimeTable: [
    { factor: { en: 'Birth Time', hi: 'जन्म समय', sa: 'जन्म समय', mai: 'जन्म समय', mr: 'जन्म समय', ta: 'Birth Time', te: 'Birth Time', bn: 'Birth Time', kn: 'Birth Time', gu: 'Birth Time' }, changes: { en: 'Ascendant (every ~2 hrs), Moon nakshatra pada (every ~3 hrs), Dasha balance', hi: 'लग्न (~2 घंटे), चन्द्र नक्षत्र पाद (~3 घंटे), दशा शेष', sa: 'लग्न (~2 घंटे), चन्द्र नक्षत्र पाद (~3 घंटे), दशा शेष', mai: 'लग्न (~2 घंटे), चन्द्र नक्षत्र पाद (~3 घंटे), दशा शेष', mr: 'लग्न (~2 घंटे), चन्द्र नक्षत्र पाद (~3 घंटे), दशा शेष', ta: 'Ascendant (every ~2 hrs), Moon nakshatra pada (every ~3 hrs), Dasha balance', te: 'Ascendant (every ~2 hrs), Moon nakshatra pada (every ~3 hrs), Dasha balance', bn: 'Ascendant (every ~2 hrs), Moon nakshatra pada (every ~3 hrs), Dasha balance', kn: 'Ascendant (every ~2 hrs), Moon nakshatra pada (every ~3 hrs), Dasha balance', gu: 'Ascendant (every ~2 hrs), Moon nakshatra pada (every ~3 hrs), Dasha balance' } },
    { factor: { en: 'Birth Place', hi: 'जन्म स्थान', sa: 'जन्म स्थान', mai: 'जन्म स्थान', mr: 'जन्म स्थान', ta: 'Birth Place', te: 'Birth Place', bn: 'Birth Place', kn: 'Birth Place', gu: 'Birth Place' }, changes: { en: 'Ascendant degree, house cusps, sunrise/sunset timing, all house placements', hi: 'लग्न अंश, भाव शिखर, सूर्योदय/अस्त, सभी भाव स्थितियाँ', sa: 'लग्न अंश, भाव शिखर, सूर्योदय/अस्त, सभी भाव स्थितियाँ', mai: 'लग्न अंश, भाव शिखर, सूर्योदय/अस्त, सभी भाव स्थितियाँ', mr: 'लग्न अंश, भाव शिखर, सूर्योदय/अस्त, सभी भाव स्थितियाँ', ta: 'Ascendant degree, house cusps, sunrise/sunset timing, all house placements', te: 'Ascendant degree, house cusps, sunrise/sunset timing, all house placements', bn: 'Ascendant degree, house cusps, sunrise/sunset timing, all house placements', kn: 'Ascendant degree, house cusps, sunrise/sunset timing, all house placements', gu: 'Ascendant degree, house cusps, sunrise/sunset timing, all house placements' } },
    { factor: { en: 'Birth Date', hi: 'जन्म तिथि', sa: 'जन्म तिथि', mai: 'जन्म तिथि', mr: 'जन्म तिथि', ta: 'Birth Date', te: 'Birth Date', bn: 'Birth Date', kn: 'Birth Date', gu: 'Birth Date' }, changes: { en: 'All planet positions, nakshatras, yogas, tithi — everything', hi: 'सभी ग्रह स्थितियाँ, नक्षत्र, योग, तिथि — सब कुछ', sa: 'सभी ग्रह स्थितियाँ, नक्षत्र, योग, तिथि — सब कुछ', mai: 'सभी ग्रह स्थितियाँ, नक्षत्र, योग, तिथि — सब कुछ', mr: 'सभी ग्रह स्थितियाँ, नक्षत्र, योग, तिथि — सब कुछ', ta: 'All planet positions, nakshatras, yogas, tithi — everything', te: 'All planet positions, nakshatras, yogas, tithi — everything', bn: 'All planet positions, nakshatras, yogas, tithi — everything', kn: 'All planet positions, nakshatras, yogas, tithi — everything', gu: 'All planet positions, nakshatras, yogas, tithi — everything' } },
  ],

  housesTitle: { en: 'The 12 Houses — Areas of Your Life', hi: '12 भाव — आपके जीवन के क्षेत्र', sa: '12 भाव — आपके जीवन के क्षेत्र', mai: '12 भाव — आपके जीवन के क्षेत्र', mr: '12 भाव — आपके जीवन के क्षेत्र', ta: 'The 12 Houses — Areas of Your Life', te: 'The 12 Houses — Areas of Your Life', bn: 'The 12 Houses — Areas of Your Life', kn: 'The 12 Houses — Areas of Your Life', gu: 'The 12 Houses — Areas of Your Life' },
  housesIntro: {
    en: 'The birth chart is divided into 12 sectors called Houses (Bhavas). Each house governs specific aspects of life. Think of them as 12 rooms in the mansion of your existence — each room has a theme:',
    hi: 'जन्म कुण्डली 12 खण्डों में विभाजित है जिन्हें भाव कहते हैं। प्रत्येक भाव जीवन के विशिष्ट पहलुओं को नियंत्रित करता है। इन्हें अपने अस्तित्व के महल के 12 कमरे समझें — प्रत्येक कमरे का एक विषय है:',
  },
  houses: [
    { num: 1, name: { en: 'Tanu (Self)', hi: 'तनु (स्वयं)', sa: 'तनु (स्वयं)', mai: 'तनु (स्वयं)', mr: 'तनु (स्वयं)', ta: 'Tanu (Self)', te: 'Tanu (Self)', bn: 'Tanu (Self)', kn: 'Tanu (Self)', gu: 'Tanu (Self)' }, area: { en: 'Physical body, personality, appearance, overall vitality, first impressions', hi: 'शरीर, व्यक्तित्व, रूप, जीवनशक्ति, प्रथम प्रभाव', sa: 'शरीर, व्यक्तित्व, रूप, जीवनशक्ति, प्रथम प्रभाव', mai: 'शरीर, व्यक्तित्व, रूप, जीवनशक्ति, प्रथम प्रभाव', mr: 'शरीर, व्यक्तित्व, रूप, जीवनशक्ति, प्रथम प्रभाव', ta: 'Physical body, personality, appearance, overall vitality, first impressions', te: 'Physical body, personality, appearance, overall vitality, first impressions', bn: 'Physical body, personality, appearance, overall vitality, first impressions', kn: 'Physical body, personality, appearance, overall vitality, first impressions', gu: 'Physical body, personality, appearance, overall vitality, first impressions' }, tag: { en: 'Kendra + Trikona', hi: 'केन्द्र + त्रिकोण', sa: 'केन्द्र + त्रिकोण', mai: 'केन्द्र + त्रिकोण', mr: 'केन्द्र + त्रिकोण', ta: 'Kendra + Trikona', te: 'Kendra + Trikona', bn: 'Kendra + Trikona', kn: 'Kendra + Trikona', gu: 'Kendra + Trikona' } },
    { num: 2, name: { en: 'Dhana (Wealth)', hi: 'धन', sa: 'धन', mai: 'धन', mr: 'धन', ta: 'Dhana (Wealth)', te: 'Dhana (Wealth)', bn: 'Dhana (Wealth)', kn: 'Dhana (Wealth)', gu: 'Dhana (Wealth)' }, area: { en: 'Family wealth, speech, food habits, early education, face, right eye', hi: 'पारिवारिक धन, वाणी, भोजन, प्रारम्भिक शिक्षा, मुख', sa: 'पारिवारिक धन, वाणी, भोजन, प्रारम्भिक शिक्षा, मुख', mai: 'पारिवारिक धन, वाणी, भोजन, प्रारम्भिक शिक्षा, मुख', mr: 'पारिवारिक धन, वाणी, भोजन, प्रारम्भिक शिक्षा, मुख', ta: 'Family wealth, speech, food habits, early education, face, right eye', te: 'Family wealth, speech, food habits, early education, face, right eye', bn: 'Family wealth, speech, food habits, early education, face, right eye', kn: 'Family wealth, speech, food habits, early education, face, right eye', gu: 'Family wealth, speech, food habits, early education, face, right eye' }, tag: { en: 'Maraka', hi: 'मारक', sa: 'मारक', mai: 'मारक', mr: 'मारक', ta: 'Maraka', te: 'Maraka', bn: 'Maraka', kn: 'Maraka', gu: 'Maraka' } },
    { num: 3, name: { en: 'Sahaja (Courage)', hi: 'सहज (साहस)', sa: 'सहज (साहस)', mai: 'सहज (साहस)', mr: 'सहज (साहस)', ta: 'Sahaja (Courage)', te: 'Sahaja (Courage)', bn: 'Sahaja (Courage)', kn: 'Sahaja (Courage)', gu: 'Sahaja (Courage)' }, area: { en: 'Siblings, courage, communication, short travels, hobbies, hands/arms', hi: 'भाई-बहन, साहस, संवाद, छोटी यात्राएँ, शौक', sa: 'भाई-बहन, साहस, संवाद, छोटी यात्राएँ, शौक', mai: 'भाई-बहन, साहस, संवाद, छोटी यात्राएँ, शौक', mr: 'भाई-बहन, साहस, संवाद, छोटी यात्राएँ, शौक', ta: 'Siblings, courage, communication, short travels, hobbies, hands/arms', te: 'Siblings, courage, communication, short travels, hobbies, hands/arms', bn: 'Siblings, courage, communication, short travels, hobbies, hands/arms', kn: 'Siblings, courage, communication, short travels, hobbies, hands/arms', gu: 'Siblings, courage, communication, short travels, hobbies, hands/arms' }, tag: { en: 'Upachaya', hi: 'उपचय', sa: 'उपचय', mai: 'उपचय', mr: 'उपचय', ta: 'Upachaya', te: 'Upachaya', bn: 'Upachaya', kn: 'Upachaya', gu: 'Upachaya' } },
    { num: 4, name: { en: 'Bandhu (Home)', hi: 'बन्धु (घर)', sa: 'बन्धु (घर)', mai: 'बन्धु (घर)', mr: 'बन्धु (घर)', ta: 'Bandhu (Home)', te: 'Bandhu (Home)', bn: 'Bandhu (Home)', kn: 'Bandhu (Home)', gu: 'Bandhu (Home)' }, area: { en: 'Mother, home, property, vehicles, inner peace, formal education', hi: 'माता, घर, सम्पत्ति, वाहन, आन्तरिक शान्ति, शिक्षा', sa: 'माता, घर, सम्पत्ति, वाहन, आन्तरिक शान्ति, शिक्षा', mai: 'माता, घर, सम्पत्ति, वाहन, आन्तरिक शान्ति, शिक्षा', mr: 'माता, घर, सम्पत्ति, वाहन, आन्तरिक शान्ति, शिक्षा', ta: 'Mother, home, property, vehicles, inner peace, formal education', te: 'Mother, home, property, vehicles, inner peace, formal education', bn: 'Mother, home, property, vehicles, inner peace, formal education', kn: 'Mother, home, property, vehicles, inner peace, formal education', gu: 'Mother, home, property, vehicles, inner peace, formal education' }, tag: { en: 'Kendra', hi: 'केन्द्र', sa: 'केन्द्र', mai: 'केन्द्र', mr: 'केन्द्र', ta: 'Kendra', te: 'Kendra', bn: 'Kendra', kn: 'Kendra', gu: 'Kendra' } },
    { num: 5, name: { en: 'Putra (Children)', hi: 'पुत्र (सन्तान)', sa: 'पुत्र (सन्तान)', mai: 'पुत्र (सन्तान)', mr: 'पुत्र (सन्तान)', ta: 'Putra (Children)', te: 'Putra (Children)', bn: 'Putra (Children)', kn: 'Putra (Children)', gu: 'Putra (Children)' }, area: { en: 'Children, intelligence, creativity, romance, past-life merit, speculation', hi: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वजन्म पुण्य', sa: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वजन्म पुण्य', mai: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वजन्म पुण्य', mr: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वजन्म पुण्य', ta: 'Children, intelligence, creativity, romance, past-life merit, speculation', te: 'Children, intelligence, creativity, romance, past-life merit, speculation', bn: 'Children, intelligence, creativity, romance, past-life merit, speculation', kn: 'Children, intelligence, creativity, romance, past-life merit, speculation', gu: 'Children, intelligence, creativity, romance, past-life merit, speculation' }, tag: { en: 'Trikona', hi: 'त्रिकोण', sa: 'त्रिकोण', mai: 'त्रिकोण', mr: 'त्रिकोण', ta: 'Trikona', te: 'Trikona', bn: 'Trikona', kn: 'Trikona', gu: 'Trikona' } },
    { num: 6, name: { en: 'Ripu (Enemies)', hi: 'रिपु (शत्रु)', sa: 'रिपु (शत्रु)', mai: 'रिपु (शत्रु)', mr: 'रिपु (शत्रु)', ta: 'Ripu (Enemies)', te: 'Ripu (Enemies)', bn: 'Ripu (Enemies)', kn: 'Ripu (Enemies)', gu: 'Ripu (Enemies)' }, area: { en: 'Enemies, disease, debts, daily work/service, litigation, maternal uncle', hi: 'शत्रु, रोग, ऋण, दैनिक कार्य/सेवा, मुकदमे', sa: 'शत्रु, रोग, ऋण, दैनिक कार्य/सेवा, मुकदमे', mai: 'शत्रु, रोग, ऋण, दैनिक कार्य/सेवा, मुकदमे', mr: 'शत्रु, रोग, ऋण, दैनिक कार्य/सेवा, मुकदमे', ta: 'Enemies, disease, debts, daily work/service, litigation, maternal uncle', te: 'Enemies, disease, debts, daily work/service, litigation, maternal uncle', bn: 'Enemies, disease, debts, daily work/service, litigation, maternal uncle', kn: 'Enemies, disease, debts, daily work/service, litigation, maternal uncle', gu: 'Enemies, disease, debts, daily work/service, litigation, maternal uncle' }, tag: { en: 'Dusthana + Upachaya', hi: 'दुःस्थान + उपचय', sa: 'दुःस्थान + उपचय', mai: 'दुःस्थान + उपचय', mr: 'दुःस्थान + उपचय', ta: 'Dusthana + Upachaya', te: 'Dusthana + Upachaya', bn: 'Dusthana + Upachaya', kn: 'Dusthana + Upachaya', gu: 'Dusthana + Upachaya' } },
    { num: 7, name: { en: 'Yuvati (Marriage)', hi: 'युवती (विवाह)', sa: 'युवती (विवाह)', mai: 'युवती (विवाह)', mr: 'युवती (विवाह)', ta: 'Yuvati (Marriage)', te: 'Yuvati (Marriage)', bn: 'Yuvati (Marriage)', kn: 'Yuvati (Marriage)', gu: 'Yuvati (Marriage)' }, area: { en: 'Spouse, marriage, partnerships, business deals, public dealings', hi: 'जीवनसाथी, विवाह, साझेदारी, व्यापारिक सौदे', sa: 'जीवनसाथी, विवाह, साझेदारी, व्यापारिक सौदे', mai: 'जीवनसाथी, विवाह, साझेदारी, व्यापारिक सौदे', mr: 'जीवनसाथी, विवाह, साझेदारी, व्यापारिक सौदे', ta: 'Spouse, marriage, partnerships, business deals, public dealings', te: 'Spouse, marriage, partnerships, business deals, public dealings', bn: 'Spouse, marriage, partnerships, business deals, public dealings', kn: 'Spouse, marriage, partnerships, business deals, public dealings', gu: 'Spouse, marriage, partnerships, business deals, public dealings' }, tag: { en: 'Kendra + Maraka', hi: 'केन्द्र + मारक', sa: 'केन्द्र + मारक', mai: 'केन्द्र + मारक', mr: 'केन्द्र + मारक', ta: 'Kendra + Maraka', te: 'Kendra + Maraka', bn: 'Kendra + Maraka', kn: 'Kendra + Maraka', gu: 'Kendra + Maraka' } },
    { num: 8, name: { en: 'Randhra (Transformation)', hi: 'रन्ध्र (परिवर्तन)', sa: 'रन्ध्र (परिवर्तन)', mai: 'रन्ध्र (परिवर्तन)', mr: 'रन्ध्र (परिवर्तन)', ta: 'Randhra (Transformation)', te: 'Randhra (Transformation)', bn: 'Randhra (Transformation)', kn: 'Randhra (Transformation)', gu: 'Randhra (Transformation)' }, area: { en: 'Longevity, sudden events, inheritance, occult, research, in-laws', hi: 'दीर्घायु, अचानक घटनाएँ, विरासत, गुप्त विद्या, ससुराल', sa: 'दीर्घायु, अचानक घटनाएँ, विरासत, गुप्त विद्या, ससुराल', mai: 'दीर्घायु, अचानक घटनाएँ, विरासत, गुप्त विद्या, ससुराल', mr: 'दीर्घायु, अचानक घटनाएँ, विरासत, गुप्त विद्या, ससुराल', ta: 'Longevity, sudden events, inheritance, occult, research, in-laws', te: 'Longevity, sudden events, inheritance, occult, research, in-laws', bn: 'Longevity, sudden events, inheritance, occult, research, in-laws', kn: 'Longevity, sudden events, inheritance, occult, research, in-laws', gu: 'Longevity, sudden events, inheritance, occult, research, in-laws' }, tag: { en: 'Dusthana', hi: 'दुःस्थान', sa: 'दुःस्थान', mai: 'दुःस्थान', mr: 'दुःस्थान', ta: 'Dusthana', te: 'Dusthana', bn: 'Dusthana', kn: 'Dusthana', gu: 'Dusthana' } },
    { num: 9, name: { en: 'Dharma (Fortune)', hi: 'धर्म (भाग्य)', sa: 'धर्म (भाग्य)', mai: 'धर्म (भाग्य)', mr: 'धर्म (भाग्य)', ta: 'Dharma (Fortune)', te: 'Dharma (Fortune)', bn: 'Dharma (Fortune)', kn: 'Dharma (Fortune)', gu: 'Dharma (Fortune)' }, area: { en: 'Father, luck, higher education, guru, pilgrimage, philosophy, law', hi: 'पिता, भाग्य, उच्च शिक्षा, गुरु, तीर्थयात्रा, दर्शन', sa: 'पिता, भाग्य, उच्च शिक्षा, गुरु, तीर्थयात्रा, दर्शन', mai: 'पिता, भाग्य, उच्च शिक्षा, गुरु, तीर्थयात्रा, दर्शन', mr: 'पिता, भाग्य, उच्च शिक्षा, गुरु, तीर्थयात्रा, दर्शन', ta: 'Father, luck, higher education, guru, pilgrimage, philosophy, law', te: 'Father, luck, higher education, guru, pilgrimage, philosophy, law', bn: 'Father, luck, higher education, guru, pilgrimage, philosophy, law', kn: 'Father, luck, higher education, guru, pilgrimage, philosophy, law', gu: 'Father, luck, higher education, guru, pilgrimage, philosophy, law' }, tag: { en: 'Trikona', hi: 'त्रिकोण', sa: 'त्रिकोण', mai: 'त्रिकोण', mr: 'त्रिकोण', ta: 'Trikona', te: 'Trikona', bn: 'Trikona', kn: 'Trikona', gu: 'Trikona' } },
    { num: 10, name: { en: 'Karma (Career)', hi: 'कर्म (कैरियर)', sa: 'कर्म (कैरियर)', mai: 'कर्म (कैरियर)', mr: 'कर्म (कैरियर)', ta: 'Karma (Career)', te: 'Karma (Career)', bn: 'Karma (Career)', kn: 'Karma (Career)', gu: 'Karma (Career)' }, area: { en: 'Career, status, authority, fame, government, public reputation', hi: 'कैरियर, प्रतिष्ठा, अधिकार, यश, सरकार', sa: 'कैरियर, प्रतिष्ठा, अधिकार, यश, सरकार', mai: 'कैरियर, प्रतिष्ठा, अधिकार, यश, सरकार', mr: 'कैरियर, प्रतिष्ठा, अधिकार, यश, सरकार', ta: 'Career, status, authority, fame, government, public reputation', te: 'Career, status, authority, fame, government, public reputation', bn: 'Career, status, authority, fame, government, public reputation', kn: 'Career, status, authority, fame, government, public reputation', gu: 'Career, status, authority, fame, government, public reputation' }, tag: { en: 'Kendra + Upachaya', hi: 'केन्द्र + उपचय', sa: 'केन्द्र + उपचय', mai: 'केन्द्र + उपचय', mr: 'केन्द्र + उपचय', ta: 'Kendra + Upachaya', te: 'Kendra + Upachaya', bn: 'Kendra + Upachaya', kn: 'Kendra + Upachaya', gu: 'Kendra + Upachaya' } },
    { num: 11, name: { en: 'Labha (Gains)', hi: 'लाभ', sa: 'लाभ', mai: 'लाभ', mr: 'लाभ', ta: 'Labha (Gains)', te: 'Labha (Gains)', bn: 'Labha (Gains)', kn: 'Labha (Gains)', gu: 'Labha (Gains)' }, area: { en: 'Income, gains, elder siblings, friends, wishes fulfilled, networking', hi: 'आय, लाभ, बड़े भाई-बहन, मित्र, इच्छापूर्ति', sa: 'आय, लाभ, बड़े भाई-बहन, मित्र, इच्छापूर्ति', mai: 'आय, लाभ, बड़े भाई-बहन, मित्र, इच्छापूर्ति', mr: 'आय, लाभ, बड़े भाई-बहन, मित्र, इच्छापूर्ति', ta: 'Income, gains, elder siblings, friends, wishes fulfilled, networking', te: 'Income, gains, elder siblings, friends, wishes fulfilled, networking', bn: 'Income, gains, elder siblings, friends, wishes fulfilled, networking', kn: 'Income, gains, elder siblings, friends, wishes fulfilled, networking', gu: 'Income, gains, elder siblings, friends, wishes fulfilled, networking' }, tag: { en: 'Upachaya', hi: 'उपचय', sa: 'उपचय', mai: 'उपचय', mr: 'उपचय', ta: 'Upachaya', te: 'Upachaya', bn: 'Upachaya', kn: 'Upachaya', gu: 'Upachaya' } },
    { num: 12, name: { en: 'Vyaya (Loss)', hi: 'व्यय (हानि)', sa: 'व्यय (हानि)', mai: 'व्यय (हानि)', mr: 'व्यय (हानि)', ta: 'Vyaya (Loss)', te: 'Vyaya (Loss)', bn: 'Vyaya (Loss)', kn: 'Vyaya (Loss)', gu: 'Vyaya (Loss)' }, area: { en: 'Expenses, foreign lands, liberation (moksha), isolation, sleep, spiritual practice', hi: 'व्यय, विदेश, मोक्ष, एकान्त, नींद, आध्यात्मिक साधना', sa: 'व्यय, विदेश, मोक्ष, एकान्त, नींद, आध्यात्मिक साधना', mai: 'व्यय, विदेश, मोक्ष, एकान्त, नींद, आध्यात्मिक साधना', mr: 'व्यय, विदेश, मोक्ष, एकान्त, नींद, आध्यात्मिक साधना', ta: 'Expenses, foreign lands, liberation (moksha), isolation, sleep, spiritual practice', te: 'Expenses, foreign lands, liberation (moksha), isolation, sleep, spiritual practice', bn: 'Expenses, foreign lands, liberation (moksha), isolation, sleep, spiritual practice', kn: 'Expenses, foreign lands, liberation (moksha), isolation, sleep, spiritual practice', gu: 'Expenses, foreign lands, liberation (moksha), isolation, sleep, spiritual practice' }, tag: { en: 'Dusthana', hi: 'दुःस्थान', sa: 'दुःस्थान', mai: 'दुःस्थान', mr: 'दुःस्थान', ta: 'Dusthana', te: 'Dusthana', bn: 'Dusthana', kn: 'Dusthana', gu: 'Dusthana' } },
  ],
  housesClassification: {
    en: 'Houses are classified into: Kendra (1,4,7,10) — pillars of life; Trikona (1,5,9) — blessings and fortune; Dusthana (6,8,12) — challenges and transformation; Upachaya (3,6,10,11) — improve with age; Maraka (2,7) — related to health turning points.',
    hi: 'भावों का वर्गीकरण: केन्द्र (1,4,7,10) — जीवन के स्तम्भ; त्रिकोण (1,5,9) — आशीर्वाद और भाग्य; दुःस्थान (6,8,12) — चुनौतियाँ; उपचय (3,6,10,11) — आयु के साथ सुधरते हैं; मारक (2,7) — स्वास्थ्य मोड़।',
  },

  planetsTitle: { en: 'The 9 Planets (Navagraha)', hi: '9 ग्रह (नवग्रह)', sa: '9 ग्रह (नवग्रह)', mai: '9 ग्रह (नवग्रह)', mr: '9 ग्रह (नवग्रह)', ta: 'The 9 Planets (Navagraha)', te: 'The 9 Planets (Navagraha)', bn: 'The 9 Planets (Navagraha)', kn: 'The 9 Planets (Navagraha)', gu: 'The 9 Planets (Navagraha)' },
  planetsIntro: {
    en: 'Vedic astrology works with 9 celestial bodies called Grahas. Unlike Western astrology, it includes Rahu and Ketu (the Moon\'s nodes) and excludes Uranus, Neptune, and Pluto. Each planet represents a force or energy in your life:',
    hi: 'वैदिक ज्योतिष 9 खगोलीय पिण्डों के साथ काम करता है जिन्हें ग्रह कहते हैं। पश्चिमी ज्योतिष के विपरीत, इसमें राहु और केतु (चन्द्र के पात) शामिल हैं। प्रत्येक ग्रह आपके जीवन में एक शक्ति का प्रतिनिधित्व करता है:',
  },
  planets: [
    { name: { en: 'Sun (Surya)', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'Sun (Surya)', te: 'Sun (Surya)', bn: 'Sun (Surya)', kn: 'Sun (Surya)', gu: 'Sun (Surya)' }, rules: { en: 'Soul, ego, authority, father, government, vitality, confidence', hi: 'आत्मा, अहंकार, अधिकार, पिता, सरकार, जीवनशक्ति', sa: 'आत्मा, अहंकार, अधिकार, पिता, सरकार, जीवनशक्ति', mai: 'आत्मा, अहंकार, अधिकार, पिता, सरकार, जीवनशक्ति', mr: 'आत्मा, अहंकार, अधिकार, पिता, सरकार, जीवनशक्ति', ta: 'Soul, ego, authority, father, government, vitality, confidence', te: 'Soul, ego, authority, father, government, vitality, confidence', bn: 'Soul, ego, authority, father, government, vitality, confidence', kn: 'Soul, ego, authority, father, government, vitality, confidence', gu: 'Soul, ego, authority, father, government, vitality, confidence' }, years: '6' },
    { name: { en: 'Moon (Chandra)', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'Moon (Chandra)', te: 'Moon (Chandra)', bn: 'Moon (Chandra)', kn: 'Moon (Chandra)', gu: 'Moon (Chandra)' }, rules: { en: 'Mind, emotions, mother, instincts, public perception, nurturing', hi: 'मन, भावनाएं, माता, प्रवृत्तियाँ, जनधारणा', sa: 'मन, भावनाएं, माता, प्रवृत्तियाँ, जनधारणा', mai: 'मन, भावनाएं, माता, प्रवृत्तियाँ, जनधारणा', mr: 'मन, भावनाएं, माता, प्रवृत्तियाँ, जनधारणा', ta: 'Mind, emotions, mother, instincts, public perception, nurturing', te: 'Mind, emotions, mother, instincts, public perception, nurturing', bn: 'Mind, emotions, mother, instincts, public perception, nurturing', kn: 'Mind, emotions, mother, instincts, public perception, nurturing', gu: 'Mind, emotions, mother, instincts, public perception, nurturing' }, years: '10' },
    { name: { en: 'Mars (Mangal)', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'Mars (Mangal)', te: 'Mars (Mangal)', bn: 'Mars (Mangal)', kn: 'Mars (Mangal)', gu: 'Mars (Mangal)' }, rules: { en: 'Energy, courage, property, siblings, surgery, competition, anger', hi: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्यक्रिया, प्रतिस्पर्धा', sa: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्यक्रिया, प्रतिस्पर्धा', mai: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्यक्रिया, प्रतिस्पर्धा', mr: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्यक्रिया, प्रतिस्पर्धा', ta: 'Energy, courage, property, siblings, surgery, competition, anger', te: 'Energy, courage, property, siblings, surgery, competition, anger', bn: 'Energy, courage, property, siblings, surgery, competition, anger', kn: 'Energy, courage, property, siblings, surgery, competition, anger', gu: 'Energy, courage, property, siblings, surgery, competition, anger' }, years: '7' },
    { name: { en: 'Mercury (Budh)', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'Mercury (Budh)', te: 'Mercury (Budh)', bn: 'Mercury (Budh)', kn: 'Mercury (Budh)', gu: 'Mercury (Budh)' }, rules: { en: 'Intelligence, communication, business, humor, adaptability, skin', hi: 'बुद्धि, संवाद, व्यापार, विनोद, अनुकूलनशीलता', sa: 'बुद्धि, संवाद, व्यापार, विनोद, अनुकूलनशीलता', mai: 'बुद्धि, संवाद, व्यापार, विनोद, अनुकूलनशीलता', mr: 'बुद्धि, संवाद, व्यापार, विनोद, अनुकूलनशीलता', ta: 'Intelligence, communication, business, humor, adaptability, skin', te: 'Intelligence, communication, business, humor, adaptability, skin', bn: 'Intelligence, communication, business, humor, adaptability, skin', kn: 'Intelligence, communication, business, humor, adaptability, skin', gu: 'Intelligence, communication, business, humor, adaptability, skin' }, years: '17' },
    { name: { en: 'Jupiter (Guru)', hi: 'गुरु (बृहस्पति)', sa: 'गुरु (बृहस्पति)', mai: 'गुरु (बृहस्पति)', mr: 'गुरु (बृहस्पति)', ta: 'Jupiter (Guru)', te: 'Jupiter (Guru)', bn: 'Jupiter (Guru)', kn: 'Jupiter (Guru)', gu: 'Jupiter (Guru)' }, rules: { en: 'Wisdom, children, wealth, dharma, expansion, teaching, optimism', hi: 'ज्ञान, सन्तान, धन, धर्म, विस्तार, शिक्षण', sa: 'ज्ञान, सन्तान, धन, धर्म, विस्तार, शिक्षण', mai: 'ज्ञान, सन्तान, धन, धर्म, विस्तार, शिक्षण', mr: 'ज्ञान, सन्तान, धन, धर्म, विस्तार, शिक्षण', ta: 'Wisdom, children, wealth, dharma, expansion, teaching, optimism', te: 'Wisdom, children, wealth, dharma, expansion, teaching, optimism', bn: 'Wisdom, children, wealth, dharma, expansion, teaching, optimism', kn: 'Wisdom, children, wealth, dharma, expansion, teaching, optimism', gu: 'Wisdom, children, wealth, dharma, expansion, teaching, optimism' }, years: '16' },
    { name: { en: 'Venus (Shukra)', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'Venus (Shukra)', te: 'Venus (Shukra)', bn: 'Venus (Shukra)', kn: 'Venus (Shukra)', gu: 'Venus (Shukra)' }, rules: { en: 'Love, marriage, luxury, arts, beauty, vehicles, sensual pleasure', hi: 'प्रेम, विवाह, विलास, कला, सौन्दर्य, वाहन', sa: 'प्रेम, विवाह, विलास, कला, सौन्दर्य, वाहन', mai: 'प्रेम, विवाह, विलास, कला, सौन्दर्य, वाहन', mr: 'प्रेम, विवाह, विलास, कला, सौन्दर्य, वाहन', ta: 'Love, marriage, luxury, arts, beauty, vehicles, sensual pleasure', te: 'Love, marriage, luxury, arts, beauty, vehicles, sensual pleasure', bn: 'Love, marriage, luxury, arts, beauty, vehicles, sensual pleasure', kn: 'Love, marriage, luxury, arts, beauty, vehicles, sensual pleasure', gu: 'Love, marriage, luxury, arts, beauty, vehicles, sensual pleasure' }, years: '20' },
    { name: { en: 'Saturn (Shani)', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'Saturn (Shani)', te: 'Saturn (Shani)', bn: 'Saturn (Shani)', kn: 'Saturn (Shani)', gu: 'Saturn (Shani)' }, rules: { en: 'Discipline, karma, hard work, delays, longevity, democracy, servants', hi: 'अनुशासन, कर्म, परिश्रम, विलम्ब, दीर्घायु', sa: 'अनुशासन, कर्म, परिश्रम, विलम्ब, दीर्घायु', mai: 'अनुशासन, कर्म, परिश्रम, विलम्ब, दीर्घायु', mr: 'अनुशासन, कर्म, परिश्रम, विलम्ब, दीर्घायु', ta: 'Discipline, karma, hard work, delays, longevity, democracy, servants', te: 'Discipline, karma, hard work, delays, longevity, democracy, servants', bn: 'Discipline, karma, hard work, delays, longevity, democracy, servants', kn: 'Discipline, karma, hard work, delays, longevity, democracy, servants', gu: 'Discipline, karma, hard work, delays, longevity, democracy, servants' }, years: '19' },
    { name: { en: 'Rahu', hi: 'राहु', sa: 'राहु', mai: 'राहु', mr: 'राहु', ta: 'Rahu', te: 'Rahu', bn: 'Rahu', kn: 'Rahu', gu: 'Rahu' }, rules: { en: 'Ambition, obsession, foreign, technology, illusion, unconventional', hi: 'महत्वाकांक्षा, जुनून, विदेश, तकनीक, भ्रम', sa: 'महत्वाकांक्षा, जुनून, विदेश, तकनीक, भ्रम', mai: 'महत्वाकांक्षा, जुनून, विदेश, तकनीक, भ्रम', mr: 'महत्वाकांक्षा, जुनून, विदेश, तकनीक, भ्रम', ta: 'Ambition, obsession, foreign, technology, illusion, unconventional', te: 'Ambition, obsession, foreign, technology, illusion, unconventional', bn: 'Ambition, obsession, foreign, technology, illusion, unconventional', kn: 'Ambition, obsession, foreign, technology, illusion, unconventional', gu: 'Ambition, obsession, foreign, technology, illusion, unconventional' }, years: '18' },
    { name: { en: 'Ketu', hi: 'केतु', sa: 'केतु', mai: 'केतु', mr: 'केतु', ta: 'Ketu', te: 'Ketu', bn: 'Ketu', kn: 'Ketu', gu: 'Ketu' }, rules: { en: 'Spirituality, detachment, liberation, past lives, sudden insight', hi: 'आध्यात्मिकता, वैराग्य, मोक्ष, पूर्वजन्म, अचानक अन्तर्दृष्टि', sa: 'आध्यात्मिकता, वैराग्य, मोक्ष, पूर्वजन्म, अचानक अन्तर्दृष्टि', mai: 'आध्यात्मिकता, वैराग्य, मोक्ष, पूर्वजन्म, अचानक अन्तर्दृष्टि', mr: 'आध्यात्मिकता, वैराग्य, मोक्ष, पूर्वजन्म, अचानक अन्तर्दृष्टि', ta: 'Spirituality, detachment, liberation, past lives, sudden insight', te: 'Spirituality, detachment, liberation, past lives, sudden insight', bn: 'Spirituality, detachment, liberation, past lives, sudden insight', kn: 'Spirituality, detachment, liberation, past lives, sudden insight', gu: 'Spirituality, detachment, liberation, past lives, sudden insight' }, years: '7' },
  ],

  signsTitle: { en: 'The 12 Signs (Rashis)', hi: '12 राशियाँ', sa: '12 राशियाँ', mai: '12 राशियाँ', mr: '12 राशियाँ', ta: 'The 12 Signs (Rashis)', te: 'The 12 Signs (Rashis)', bn: 'The 12 Signs (Rashis)', kn: 'The 12 Signs (Rashis)', gu: 'The 12 Signs (Rashis)' },
  signsIntro: {
    en: 'The 12 zodiac signs color HOW a planet expresses itself. A planet is like an actor; the sign is the costume and personality it wears. Mars in Aries is bold and direct; Mars in Cancer is emotionally driven and protective. The sign modifies the planet\'s expression but doesn\'t change its fundamental nature.',
    hi: '12 राशियाँ यह रंगती हैं कि ग्रह कैसे अभिव्यक्त होता है। ग्रह एक अभिनेता की तरह है; राशि वह वेशभूषा और व्यक्तित्व है जो वह पहनता है। मेष में मंगल साहसी और प्रत्यक्ष है; कर्क में मंगल भावनात्मक और रक्षात्मक है।',
  },
  signsP2: {
    en: 'Each sign has a ruling planet (lord), an element (fire/earth/air/water), and a quality (movable/fixed/dual). A planet in its own sign or exaltation sign is comfortable and gives excellent results. A planet in its debilitation sign struggles and needs support from other factors.',
    hi: 'प्रत्येक राशि का एक स्वामी ग्रह, एक तत्व (अग्नि/पृथ्वी/वायु/जल) और एक गुण (चर/स्थिर/द्विस्वभाव) होता है। अपनी या उच्च राशि में ग्रह सहज होता है और उत्कृष्ट परिणाम देता है। नीच राशि में ग्रह संघर्ष करता है।',
  },
  signs: [
    { num: 1, name: { en: 'Aries (Mesha)', hi: 'मेष', sa: 'मेष', mai: 'मेष', mr: 'मेष', ta: 'Aries (Mesha)', te: 'Aries (Mesha)', bn: 'Aries (Mesha)', kn: 'Aries (Mesha)', gu: 'Aries (Mesha)' }, lord: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'Mars', te: 'Mars', bn: 'Mars', kn: 'Mars', gu: 'Mars' }, element: { en: 'Fire', hi: 'अग्नि', sa: 'अग्नि', mai: 'अग्नि', mr: 'अग्नि', ta: 'Fire', te: 'Fire', bn: 'Fire', kn: 'Fire', gu: 'Fire' }, quality: { en: 'Movable', hi: 'चर', sa: 'चर', mai: 'चर', mr: 'चर', ta: 'Movable', te: 'Movable', bn: 'Movable', kn: 'Movable', gu: 'Movable' } },
    { num: 2, name: { en: 'Taurus (Vrishabha)', hi: 'वृषभ', sa: 'वृषभ', mai: 'वृषभ', mr: 'वृषभ', ta: 'Taurus (Vrishabha)', te: 'Taurus (Vrishabha)', bn: 'Taurus (Vrishabha)', kn: 'Taurus (Vrishabha)', gu: 'Taurus (Vrishabha)' }, lord: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'Venus', te: 'Venus', bn: 'Venus', kn: 'Venus', gu: 'Venus' }, element: { en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी', mai: 'पृथ्वी', mr: 'पृथ्वी', ta: 'Earth', te: 'Earth', bn: 'Earth', kn: 'Earth', gu: 'Earth' }, quality: { en: 'Fixed', hi: 'स्थिर', sa: 'स्थिर', mai: 'स्थिर', mr: 'स्थिर', ta: 'Fixed', te: 'Fixed', bn: 'Fixed', kn: 'Fixed', gu: 'Fixed' } },
    { num: 3, name: { en: 'Gemini (Mithuna)', hi: 'मिथुन', sa: 'मिथुन', mai: 'मिथुन', mr: 'मिथुन', ta: 'Gemini (Mithuna)', te: 'Gemini (Mithuna)', bn: 'Gemini (Mithuna)', kn: 'Gemini (Mithuna)', gu: 'Gemini (Mithuna)' }, lord: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'Mercury', te: 'Mercury', bn: 'Mercury', kn: 'Mercury', gu: 'Mercury' }, element: { en: 'Air', hi: 'वायु', sa: 'वायु', mai: 'वायु', mr: 'वायु', ta: 'Air', te: 'Air', bn: 'Air', kn: 'Air', gu: 'Air' }, quality: { en: 'Dual', hi: 'द्विस्वभाव', sa: 'द्विस्वभाव', mai: 'द्विस्वभाव', mr: 'द्विस्वभाव', ta: 'Dual', te: 'Dual', bn: 'Dual', kn: 'Dual', gu: 'Dual' } },
    { num: 4, name: { en: 'Cancer (Karka)', hi: 'कर्क', sa: 'कर्क', mai: 'कर्क', mr: 'कर्क', ta: 'Cancer (Karka)', te: 'Cancer (Karka)', bn: 'Cancer (Karka)', kn: 'Cancer (Karka)', gu: 'Cancer (Karka)' }, lord: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'Moon', te: 'Moon', bn: 'Moon', kn: 'Moon', gu: 'Moon' }, element: { en: 'Water', hi: 'जल', sa: 'जल', mai: 'जल', mr: 'जल', ta: 'Water', te: 'Water', bn: 'Water', kn: 'Water', gu: 'Water' }, quality: { en: 'Movable', hi: 'चर', sa: 'चर', mai: 'चर', mr: 'चर', ta: 'Movable', te: 'Movable', bn: 'Movable', kn: 'Movable', gu: 'Movable' } },
    { num: 5, name: { en: 'Leo (Simha)', hi: 'सिंह', sa: 'सिंह', mai: 'सिंह', mr: 'सिंह', ta: 'Leo (Simha)', te: 'Leo (Simha)', bn: 'Leo (Simha)', kn: 'Leo (Simha)', gu: 'Leo (Simha)' }, lord: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'Sun', te: 'Sun', bn: 'Sun', kn: 'Sun', gu: 'Sun' }, element: { en: 'Fire', hi: 'अग्नि', sa: 'अग्नि', mai: 'अग्नि', mr: 'अग्नि', ta: 'Fire', te: 'Fire', bn: 'Fire', kn: 'Fire', gu: 'Fire' }, quality: { en: 'Fixed', hi: 'स्थिर', sa: 'स्थिर', mai: 'स्थिर', mr: 'स्थिर', ta: 'Fixed', te: 'Fixed', bn: 'Fixed', kn: 'Fixed', gu: 'Fixed' } },
    { num: 6, name: { en: 'Virgo (Kanya)', hi: 'कन्या', sa: 'कन्या', mai: 'कन्या', mr: 'कन्या', ta: 'Virgo (Kanya)', te: 'Virgo (Kanya)', bn: 'Virgo (Kanya)', kn: 'Virgo (Kanya)', gu: 'Virgo (Kanya)' }, lord: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'Mercury', te: 'Mercury', bn: 'Mercury', kn: 'Mercury', gu: 'Mercury' }, element: { en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी', mai: 'पृथ्वी', mr: 'पृथ्वी', ta: 'Earth', te: 'Earth', bn: 'Earth', kn: 'Earth', gu: 'Earth' }, quality: { en: 'Dual', hi: 'द्विस्वभाव', sa: 'द्विस्वभाव', mai: 'द्विस्वभाव', mr: 'द्विस्वभाव', ta: 'Dual', te: 'Dual', bn: 'Dual', kn: 'Dual', gu: 'Dual' } },
    { num: 7, name: { en: 'Libra (Tula)', hi: 'तुला', sa: 'तुला', mai: 'तुला', mr: 'तुला', ta: 'Libra (Tula)', te: 'Libra (Tula)', bn: 'Libra (Tula)', kn: 'Libra (Tula)', gu: 'Libra (Tula)' }, lord: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'Venus', te: 'Venus', bn: 'Venus', kn: 'Venus', gu: 'Venus' }, element: { en: 'Air', hi: 'वायु', sa: 'वायु', mai: 'वायु', mr: 'वायु', ta: 'Air', te: 'Air', bn: 'Air', kn: 'Air', gu: 'Air' }, quality: { en: 'Movable', hi: 'चर', sa: 'चर', mai: 'चर', mr: 'चर', ta: 'Movable', te: 'Movable', bn: 'Movable', kn: 'Movable', gu: 'Movable' } },
    { num: 8, name: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक', sa: 'वृश्चिक', mai: 'वृश्चिक', mr: 'वृश्चिक', ta: 'Scorpio (Vrishchika)', te: 'Scorpio (Vrishchika)', bn: 'Scorpio (Vrishchika)', kn: 'Scorpio (Vrishchika)', gu: 'Scorpio (Vrishchika)' }, lord: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'Mars', te: 'Mars', bn: 'Mars', kn: 'Mars', gu: 'Mars' }, element: { en: 'Water', hi: 'जल', sa: 'जल', mai: 'जल', mr: 'जल', ta: 'Water', te: 'Water', bn: 'Water', kn: 'Water', gu: 'Water' }, quality: { en: 'Fixed', hi: 'स्थिर', sa: 'स्थिर', mai: 'स्थिर', mr: 'स्थिर', ta: 'Fixed', te: 'Fixed', bn: 'Fixed', kn: 'Fixed', gu: 'Fixed' } },
    { num: 9, name: { en: 'Sagittarius (Dhanu)', hi: 'धनु', sa: 'धनु', mai: 'धनु', mr: 'धनु', ta: 'Sagittarius (Dhanu)', te: 'Sagittarius (Dhanu)', bn: 'Sagittarius (Dhanu)', kn: 'Sagittarius (Dhanu)', gu: 'Sagittarius (Dhanu)' }, lord: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु', mai: 'गुरु', mr: 'गुरु', ta: 'Jupiter', te: 'Jupiter', bn: 'Jupiter', kn: 'Jupiter', gu: 'Jupiter' }, element: { en: 'Fire', hi: 'अग्नि', sa: 'अग्नि', mai: 'अग्नि', mr: 'अग्नि', ta: 'Fire', te: 'Fire', bn: 'Fire', kn: 'Fire', gu: 'Fire' }, quality: { en: 'Dual', hi: 'द्विस्वभाव', sa: 'द्विस्वभाव', mai: 'द्विस्वभाव', mr: 'द्विस्वभाव', ta: 'Dual', te: 'Dual', bn: 'Dual', kn: 'Dual', gu: 'Dual' } },
    { num: 10, name: { en: 'Capricorn (Makara)', hi: 'मकर', sa: 'मकर', mai: 'मकर', mr: 'मकर', ta: 'Capricorn (Makara)', te: 'Capricorn (Makara)', bn: 'Capricorn (Makara)', kn: 'Capricorn (Makara)', gu: 'Capricorn (Makara)' }, lord: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'Saturn', te: 'Saturn', bn: 'Saturn', kn: 'Saturn', gu: 'Saturn' }, element: { en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी', mai: 'पृथ्वी', mr: 'पृथ्वी', ta: 'Earth', te: 'Earth', bn: 'Earth', kn: 'Earth', gu: 'Earth' }, quality: { en: 'Movable', hi: 'चर', sa: 'चर', mai: 'चर', mr: 'चर', ta: 'Movable', te: 'Movable', bn: 'Movable', kn: 'Movable', gu: 'Movable' } },
    { num: 11, name: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ', sa: 'कुम्भ', mai: 'कुम्भ', mr: 'कुम्भ', ta: 'Aquarius (Kumbha)', te: 'Aquarius (Kumbha)', bn: 'Aquarius (Kumbha)', kn: 'Aquarius (Kumbha)', gu: 'Aquarius (Kumbha)' }, lord: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'Saturn', te: 'Saturn', bn: 'Saturn', kn: 'Saturn', gu: 'Saturn' }, element: { en: 'Air', hi: 'वायु', sa: 'वायु', mai: 'वायु', mr: 'वायु', ta: 'Air', te: 'Air', bn: 'Air', kn: 'Air', gu: 'Air' }, quality: { en: 'Fixed', hi: 'स्थिर', sa: 'स्थिर', mai: 'स्थिर', mr: 'स्थिर', ta: 'Fixed', te: 'Fixed', bn: 'Fixed', kn: 'Fixed', gu: 'Fixed' } },
    { num: 12, name: { en: 'Pisces (Meena)', hi: 'मीन', sa: 'मीन', mai: 'मीन', mr: 'मीन', ta: 'Pisces (Meena)', te: 'Pisces (Meena)', bn: 'Pisces (Meena)', kn: 'Pisces (Meena)', gu: 'Pisces (Meena)' }, lord: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु', mai: 'गुरु', mr: 'गुरु', ta: 'Jupiter', te: 'Jupiter', bn: 'Jupiter', kn: 'Jupiter', gu: 'Jupiter' }, element: { en: 'Water', hi: 'जल', sa: 'जल', mai: 'जल', mr: 'जल', ta: 'Water', te: 'Water', bn: 'Water', kn: 'Water', gu: 'Water' }, quality: { en: 'Dual', hi: 'द्विस्वभाव', sa: 'द्विस्वभाव', mai: 'द्विस्वभाव', mr: 'द्विस्वभाव', ta: 'Dual', te: 'Dual', bn: 'Dual', kn: 'Dual', gu: 'Dual' } },
  ],

  howToReadTitle: { en: 'How to Read Your Chart — Step by Step', hi: 'अपनी कुण्डली कैसे पढ़ें — चरण दर चरण', sa: 'अपनी कुण्डली कैसे पढ़ें — चरण दर चरण', mai: 'अपनी कुण्डली कैसे पढ़ें — चरण दर चरण', mr: 'अपनी कुण्डली कैसे पढ़ें — चरण दर चरण', ta: 'How to Read Your Chart — Step by Step', te: 'How to Read Your Chart — Step by Step', bn: 'How to Read Your Chart — Step by Step', kn: 'How to Read Your Chart — Step by Step', gu: 'How to Read Your Chart — Step by Step' },
  howToReadIntro: {
    en: 'Reading a birth chart can seem overwhelming at first. Here is a systematic approach that Vedic astrologers follow, from the most important element to the least:',
    hi: 'जन्म कुण्डली पढ़ना पहले भारी लग सकता है। यहाँ एक व्यवस्थित दृष्टिकोण है जो वैदिक ज्योतिषी अनुसरण करते हैं:',
  },
  readSteps: [
    {
      step: { en: 'Step 1: The Ascendant (Lagna)', hi: 'चरण 1: लग्न', sa: 'चरण 1: लग्न', mai: 'चरण 1: लग्न', mr: 'चरण 1: लग्न', ta: 'Step 1: The Ascendant (Lagna)', te: 'Step 1: The Ascendant (Lagna)', bn: 'Step 1: The Ascendant (Lagna)', kn: 'Step 1: The Ascendant (Lagna)', gu: 'Step 1: The Ascendant (Lagna)' },
      detail: {
        en: 'Find your Ascendant sign — this is the sign occupying the 1st house. It is the MOST important single point in your chart. It determines your physical constitution, natural temperament, and how you present yourself to the world. The Ascendant lord (the planet ruling your Ascendant sign) is your chart ruler — its condition colors your entire life.',
        hi: 'अपनी लग्न राशि खोजें — यह प्रथम भाव में बैठी राशि है। यह आपकी कुण्डली का सबसे महत्वपूर्ण एकल बिन्दु है। यह आपकी शारीरिक संरचना, स्वाभाविक स्वभाव और आप दुनिया को कैसे दिखते हैं — निर्धारित करता है। लग्नेश सम्पूर्ण जीवन को रंगता है।',
      },
    },
    {
      step: { en: 'Step 2: The Moon (Mind)', hi: 'चरण 2: चन्द्रमा (मन)', sa: 'चरण 2: चन्द्रमा (मन)', mai: 'चरण 2: चन्द्रमा (मन)', mr: 'चरण 2: चन्द्रमा (मन)', ta: 'Step 2: The Moon (Mind)', te: 'Step 2: The Moon (Mind)', bn: 'Step 2: The Moon (Mind)', kn: 'Step 2: The Moon (Mind)', gu: 'Step 2: The Moon (Mind)' },
      detail: {
        en: 'Find your Moon sign and house. The Moon represents your mind, emotions, and instinctive reactions. Your Moon nakshatra determines your Vimshottari Dasha starting point — the timing system of your entire life. A strong Moon in a good house gives emotional stability; an afflicted Moon indicates areas where emotional work is needed.',
        hi: 'अपनी चन्द्र राशि और भाव खोजें। चन्द्रमा मन, भावनाओं और सहज प्रतिक्रियाओं का प्रतिनिधित्व करता है। चन्द्र नक्षत्र विंशोत्तरी दशा का प्रारम्भ बिन्दु निर्धारित करता है — आपके सम्पूर्ण जीवन की समय प्रणाली। बलवान चन्द्र भावनात्मक स्थिरता देता है।',
      },
    },
    {
      step: { en: 'Step 3: The Sun (Soul)', hi: 'चरण 3: सूर्य (आत्मा)', sa: 'चरण 3: सूर्य (आत्मा)', mai: 'चरण 3: सूर्य (आत्मा)', mr: 'चरण 3: सूर्य (आत्मा)', ta: 'Step 3: The Sun (Soul)', te: 'Step 3: The Sun (Soul)', bn: 'Step 3: The Sun (Soul)', kn: 'Step 3: The Sun (Soul)', gu: 'Step 3: The Sun (Soul)' },
      detail: {
        en: 'The Sun represents your soul\'s purpose, authority, confidence, and relationship with your father. While Western astrology makes the Sun sign primary, in Vedic astrology the Sun is one of 9 players. Still, its house placement reveals where you seek recognition and where you project authority.',
        hi: 'सूर्य आत्मा के उद्देश्य, अधिकार, आत्मविश्वास और पिता के साथ सम्बन्ध को दर्शाता है। वैदिक ज्योतिष में सूर्य 9 खिलाड़ियों में से एक है। फिर भी, इसकी भाव स्थिति बताती है कि आप कहाँ मान्यता चाहते हैं।',
      },
    },
    {
      step: { en: 'Step 4: Benefics and Malefics', hi: 'चरण 4: शुभ और पाप ग्रह', sa: 'चरण 4: शुभ और पाप ग्रह', mai: 'चरण 4: शुभ और पाप ग्रह', mr: 'चरण 4: शुभ और पाप ग्रह', ta: 'Step 4: Benefics and Malefics', te: 'Step 4: Benefics and Malefics', bn: 'Step 4: Benefics and Malefics', kn: 'Step 4: Benefics and Malefics', gu: 'Step 4: Benefics and Malefics' },
      detail: {
        en: 'Identify which planets are natural benefics (Jupiter, Venus, well-associated Mercury, waxing Moon) and natural malefics (Saturn, Mars, Rahu, Ketu, Sun, waning Moon). Then determine FUNCTIONAL benefics and malefics based on house lordship for your specific Ascendant. A natural malefic can become a functional benefic and vice versa — this is key to accurate reading.',
        hi: 'पहचानें कि कौन से ग्रह प्राकृतिक शुभ (गुरु, शुक्र, अच्छा बुध, बढ़ता चन्द्र) और प्राकृतिक पाप (शनि, मंगल, राहु, केतु, सूर्य, घटता चन्द्र) हैं। फिर अपने विशिष्ट लग्न के लिए कार्यात्मक शुभ और पाप निर्धारित करें।',
      },
    },
    {
      step: { en: 'Step 5: Yogas and Doshas', hi: 'चरण 5: योग और दोष', sa: 'चरण 5: योग और दोष', mai: 'चरण 5: योग और दोष', mr: 'चरण 5: योग और दोष', ta: 'Step 5: Yogas and Doshas', te: 'Step 5: Yogas and Doshas', bn: 'Step 5: Yogas and Doshas', kn: 'Step 5: Yogas and Doshas', gu: 'Step 5: Yogas and Doshas' },
      detail: {
        en: 'Look for special planetary combinations (Yogas) that amplify or modify results — Raja Yoga (power), Dhana Yoga (wealth), Gajakesari (fame), and challenging combinations like Kala Sarpa or Manglik Dosha. These are the "bonus features" installed at birth that shape major life themes.',
        hi: 'विशेष ग्रह संयोगों (योगों) की खोज करें जो परिणामों को बढ़ाते या संशोधित करते हैं — राज योग (शक्ति), धन योग (धन), गजकेसरी (प्रतिष्ठा) और चुनौतीपूर्ण संयोग जैसे काल सर्प या मांगलिक दोष।',
      },
    },
    {
      step: { en: 'Step 6: Dashas (Timing)', hi: 'चरण 6: दशा (समय)', sa: 'चरण 6: दशा (समय)', mai: 'चरण 6: दशा (समय)', mr: 'चरण 6: दशा (समय)', ta: 'Step 6: Dashas (Timing)', te: 'Step 6: Dashas (Timing)', bn: 'Step 6: Dashas (Timing)', kn: 'Step 6: Dashas (Timing)', gu: 'Step 6: Dashas (Timing)' },
      detail: {
        en: 'Finally, check which Dasha period you are currently running. The Dasha planet activates its own houses and the houses it aspects. A benefic planet\'s Dasha brings its positive themes to the foreground; a malefic\'s Dasha brings challenges but also growth opportunities in its domain.',
        hi: 'अन्त में देखें कि वर्तमान में कौन सी दशा चल रही है। दशा ग्रह अपने भावों और दृष्टि वाले भावों को सक्रिय करता है। शुभ ग्रह की दशा उसके सकारात्मक विषय लाती है; पाप ग्रह की दशा चुनौतियाँ लेकिन विकास के अवसर भी लाती है।',
      },
    },
  ],

  chartStylesTitle: { en: 'North Indian vs South Indian Chart Styles', hi: 'उत्तर भारतीय बनाम दक्षिण भारतीय कुण्डली शैली', sa: 'उत्तर भारतीय बनाम दक्षिण भारतीय कुण्डली शैली', mai: 'उत्तर भारतीय बनाम दक्षिण भारतीय कुण्डली शैली', mr: 'उत्तर भारतीय बनाम दक्षिण भारतीय कुण्डली शैली', ta: 'North Indian vs South Indian Chart Styles', te: 'North Indian vs South Indian Chart Styles', bn: 'North Indian vs South Indian Chart Styles', kn: 'North Indian vs South Indian Chart Styles', gu: 'North Indian vs South Indian Chart Styles' },
  chartStylesP1: {
    en: 'There are two main ways to draw a Vedic birth chart. Both contain the SAME information — they are just different visual formats, like writing the same paragraph in two different fonts.',
    hi: 'वैदिक जन्म कुण्डली बनाने के दो मुख्य तरीके हैं। दोनों में समान जानकारी होती है — ये केवल अलग-अलग दृश्य प्रारूप हैं।',
  },
  northStyle: {
    title: { en: 'North Indian (Diamond)', hi: 'उत्तर भारतीय (हीरा)', sa: 'उत्तर भारतीय (हीरा)', mai: 'उत्तर भारतीय (हीरा)', mr: 'उत्तर भारतीय (हीरा)', ta: 'North Indian (Diamond)', te: 'North Indian (Diamond)', bn: 'North Indian (Diamond)', kn: 'North Indian (Diamond)', gu: 'North Indian (Diamond)' },
    p1: {
      en: 'The diamond-shaped chart used in North India, Nepal, and most Hindi-speaking regions. Houses are FIXED in position (the 1st house is always the top diamond), and signs rotate based on the Ascendant. The Ascendant sign is written in the top diamond, and subsequent signs follow counterclockwise.',
      hi: 'हीरे के आकार की कुण्डली जो उत्तर भारत, नेपाल और अधिकांश हिन्दी भाषी क्षेत्रों में प्रयुक्त होती है। भाव स्थान पर स्थिर हैं (प्रथम भाव सदैव शीर्ष हीरा है) और राशियाँ लग्न के अनुसार घूमती हैं।',
    },
    p2: {
      en: 'Advantage: You always know which house is which at a glance. Disadvantage: You need to figure out which sign occupies each house.',
      hi: 'लाभ: आप एक नज़र में जानते हैं कौन सा भाव कहाँ है। हानि: आपको पता लगाना होगा कि कौन सी राशि किस भाव में है।',
    },
  },
  southStyle: {
    title: { en: 'South Indian (Grid)', hi: 'दक्षिण भारतीय (ग्रिड)', sa: 'दक्षिण भारतीय (ग्रिड)', mai: 'दक्षिण भारतीय (ग्रिड)', mr: 'दक्षिण भारतीय (ग्रिड)', ta: 'South Indian (Grid)', te: 'South Indian (Grid)', bn: 'South Indian (Grid)', kn: 'South Indian (Grid)', gu: 'South Indian (Grid)' },
    p1: {
      en: 'The grid-shaped chart used in South India, Kerala, Karnataka, Tamil Nadu, and Andhra Pradesh. Signs are FIXED in position (Aries is always in the same cell), and the Ascendant is marked with a diagonal line. Houses follow from wherever the Ascendant sign falls.',
      hi: 'ग्रिड आकार की कुण्डली जो दक्षिण भारत, केरल, कर्नाटक, तमिलनाडु और आन्ध्र प्रदेश में प्रयुक्त होती है। राशियाँ स्थान पर स्थिर हैं (मेष सदैव एक ही सेल में) और लग्न तिरछी रेखा से चिह्नित होता है।',
    },
    p2: {
      en: 'Advantage: You always know which sign is where. Disadvantage: You need to count to figure out which house is which.',
      hi: 'लाभ: आप सदैव जानते हैं कौन सी राशि कहाँ है। हानि: आपको भाव गिनने होते हैं।',
    },
  },

  degreesTitle: { en: 'What the Degree Numbers Mean', hi: 'अंश संख्याओं का अर्थ', sa: 'अंश संख्याओं का अर्थ', mai: 'अंश संख्याओं का अर्थ', mr: 'अंश संख्याओं का अर्थ', ta: 'What the Degree Numbers Mean', te: 'What the Degree Numbers Mean', bn: 'What the Degree Numbers Mean', kn: 'What the Degree Numbers Mean', gu: 'What the Degree Numbers Mean' },
  degreesP1: {
    en: 'Each planet in your chart has a degree value (e.g., "Sun 15°42\' Leo"). This tells you the planet\'s exact position within its sign. A sign spans 30 degrees (0° to 29°59\'). The degree matters for several reasons:',
    hi: 'आपकी कुण्डली में प्रत्येक ग्रह का एक अंश मान होता है (जैसे "सूर्य 15°42\' सिंह")। यह बताता है कि ग्रह अपनी राशि में ठीक कहाँ है। एक राशि 30 अंश (0° से 29°59\') फैली होती है। अंश कई कारणों से मायने रखता है:',
  },
  degreeReasons: [
    {
      reason: { en: 'Nakshatra and Pada', hi: 'नक्षत्र और पाद', sa: 'नक्षत्र और पाद', mai: 'नक्षत्र और पाद', mr: 'नक्षत्र और पाद', ta: 'Nakshatra and Pada', te: 'Nakshatra and Pada', bn: 'Nakshatra and Pada', kn: 'Nakshatra and Pada', gu: 'Nakshatra and Pada' },
      detail: {
        en: 'The degree determines which of the 27 nakshatras the planet falls in, and which of its 4 padas (quarters). Each pada is 3°20\'. The Moon\'s nakshatra pada determines your Dasha starting point. Different padas of the same nakshatra give subtly different results.',
        hi: 'अंश निर्धारित करता है कि ग्रह 27 नक्षत्रों में से किसमें और उसके 4 पादों (चतुर्थांश) में से किसमें पड़ता है। प्रत्येक पाद 3°20\' का है। चन्द्र का नक्षत्र पाद आपकी दशा प्रारम्भ बिन्दु निर्धारित करता है।',
      },
    },
    {
      reason: { en: 'Exaltation Exactness', hi: 'उच्चता की सटीकता', sa: 'उच्चता की सटीकता', mai: 'उच्चता की सटीकता', mr: 'उच्चता की सटीकता', ta: 'Exaltation Exactness', te: 'Exaltation Exactness', bn: 'Exaltation Exactness', kn: 'Exaltation Exactness', gu: 'Exaltation Exactness' },
      detail: {
        en: 'Each planet has a specific degree of peak exaltation (e.g., Sun at 10° Aries). The closer a planet is to its exact exaltation degree, the stronger it is. Conversely, near its debilitation degree, it is weakest.',
        hi: 'प्रत्येक ग्रह का एक विशिष्ट उच्च अंश है (जैसे सूर्य 10° मेष)। ग्रह अपने सटीक उच्च अंश के जितना निकट, उतना बलवान। इसके विपरीत, नीच अंश के निकट सबसे कमज़ोर।',
      },
    },
    {
      reason: { en: 'Combustion', hi: 'अस्तत्व', sa: 'अस्तत्व', mai: 'अस्तत्व', mr: 'अस्तत्व', ta: 'Combustion', te: 'Combustion', bn: 'Combustion', kn: 'Combustion', gu: 'Combustion' },
      detail: {
        en: 'A planet within certain degrees of the Sun becomes "combust" (asta) — its light is overwhelmed by the Sun. Different planets have different combustion thresholds: Moon 12°, Mars 17°, Mercury 14° (12° if retrograde), Jupiter 11°, Venus 10° (8° if retrograde), Saturn 15°.',
        hi: 'सूर्य से कुछ अंशों के भीतर ग्रह "अस्त" हो जाता है — उसका प्रकाश सूर्य से दब जाता है। विभिन्न ग्रहों की अस्तत्व सीमाएँ भिन्न हैं: चन्द्र 12°, मंगल 17°, बुध 14°, गुरु 11°, शुक्र 10°, शनि 15°।',
      },
    },
    {
      reason: { en: 'Divisional Charts', hi: 'वर्ग कुण्डलियाँ', sa: 'वर्ग कुण्डलियाँ', mai: 'वर्ग कुण्डलियाँ', mr: 'वर्ग कुण्डलियाँ', ta: 'Divisional Charts', te: 'Divisional Charts', bn: 'Divisional Charts', kn: 'Divisional Charts', gu: 'Divisional Charts' },
      detail: {
        en: 'The degree determines where a planet falls in all divisional charts (Navamsha, Dashamsha, etc.). A planet at 5° of a sign will appear in a completely different Navamsha position than a planet at 25° of the same sign. This is why exact degrees are critical for advanced analysis.',
        hi: 'अंश निर्धारित करता है कि ग्रह सभी वर्ग कुण्डलियों (नवांश, दशमांश आदि) में कहाँ पड़ता है। एक राशि में 5° का ग्रह 25° के ग्रह से पूर्णतः भिन्न नवांश स्थिति में होगा।',
      },
    },
  ],

  nakshatrasTitle: { en: 'The 27 Nakshatras — The Lunar Mansions', hi: '27 नक्षत्र — चन्द्र भवन', sa: '27 नक्षत्र — चन्द्र भवन', mai: '27 नक्षत्र — चन्द्र भवन', mr: '27 नक्षत्र — चन्द्र भवन', ta: 'The 27 Nakshatras — The Lunar Mansions', te: 'The 27 Nakshatras — The Lunar Mansions', bn: 'The 27 Nakshatras — The Lunar Mansions', kn: 'The 27 Nakshatras — The Lunar Mansions', gu: 'The 27 Nakshatras — The Lunar Mansions' },
  nakshatrasP1: {
    en: 'Beyond the 12 signs, Vedic astrology uses a finer division of the zodiac into 27 Nakshatras (lunar mansions). Each nakshatra spans 13°20\' and has a unique personality, ruling deity, symbol, and planetary lord. The Moon\'s nakshatra at birth is one of the most important data points in your chart:',
    hi: '12 राशियों से परे, वैदिक ज्योतिष राशिचक्र को 27 नक्षत्रों (चन्द्र भवन) में सूक्ष्म विभाजन करता है। प्रत्येक नक्षत्र 13°20\' फैला है और इसका एक अद्वितीय व्यक्तित्व, अधिष्ठात्र देवता, प्रतीक और ग्रह स्वामी है। जन्म के समय चन्द्र का नक्षत्र आपकी कुण्डली के सबसे महत्वपूर्ण डेटा बिन्दुओं में से एक है:',
  },
  nakshatraPoints: [
    { point: { en: 'Your Moon nakshatra determines your Vimshottari Dasha starting point — the master timing system of your entire life', hi: 'आपका चन्द्र नक्षत्र विंशोत्तरी दशा प्रारम्भ बिन्दु निर्धारित करता है — आपके सम्पूर्ण जीवन की मास्टर समय प्रणाली', sa: 'आपका चन्द्र नक्षत्र विंशोत्तरी दशा प्रारम्भ बिन्दु निर्धारित करता है — आपके सम्पूर्ण जीवन की मास्टर समय प्रणाली', mai: 'आपका चन्द्र नक्षत्र विंशोत्तरी दशा प्रारम्भ बिन्दु निर्धारित करता है — आपके सम्पूर्ण जीवन की मास्टर समय प्रणाली', mr: 'आपका चन्द्र नक्षत्र विंशोत्तरी दशा प्रारम्भ बिन्दु निर्धारित करता है — आपके सम्पूर्ण जीवन की मास्टर समय प्रणाली', ta: 'Your Moon nakshatra determines your Vimshottari Dasha starting point — the master timing system of your entire life', te: 'Your Moon nakshatra determines your Vimshottari Dasha starting point — the master timing system of your entire life', bn: 'Your Moon nakshatra determines your Vimshottari Dasha starting point — the master timing system of your entire life', kn: 'Your Moon nakshatra determines your Vimshottari Dasha starting point — the master timing system of your entire life', gu: 'Your Moon nakshatra determines your Vimshottari Dasha starting point — the master timing system of your entire life' } },
    { point: { en: 'Each nakshatra has 4 padas (quarters) of 3°20\' each, which determine the starting syllable for baby naming (Namakarana)', hi: 'प्रत्येक नक्षत्र के 4 पाद (चतुर्थांश) 3°20\' के हैं, जो शिशु नामकरण का प्रारम्भिक अक्षर निर्धारित करते हैं' } },
    { point: { en: 'Your nakshatra lord becomes a key planet — if its Dasha runs during your productive years, it significantly shapes your life', hi: 'आपका नक्षत्र स्वामी प्रमुख ग्रह बनता है — यदि उसकी दशा आपके उत्पादक वर्षों में चले तो जीवन को महत्वपूर्ण रूप से आकार देता है', sa: 'आपका नक्षत्र स्वामी प्रमुख ग्रह बनता है — यदि उसकी दशा आपके उत्पादक वर्षों में चले तो जीवन को महत्वपूर्ण रूप से आकार देता है', mai: 'आपका नक्षत्र स्वामी प्रमुख ग्रह बनता है — यदि उसकी दशा आपके उत्पादक वर्षों में चले तो जीवन को महत्वपूर्ण रूप से आकार देता है', mr: 'आपका नक्षत्र स्वामी प्रमुख ग्रह बनता है — यदि उसकी दशा आपके उत्पादक वर्षों में चले तो जीवन को महत्वपूर्ण रूप से आकार देता है', ta: 'Your nakshatra lord becomes a key planet — if its Dasha runs during your productive years, it significantly shapes your life', te: 'Your nakshatra lord becomes a key planet — if its Dasha runs during your productive years, it significantly shapes your life', bn: 'Your nakshatra lord becomes a key planet — if its Dasha runs during your productive years, it significantly shapes your life', kn: 'Your nakshatra lord becomes a key planet — if its Dasha runs during your productive years, it significantly shapes your life', gu: 'Your nakshatra lord becomes a key planet — if its Dasha runs during your productive years, it significantly shapes your life' } },
    { point: { en: 'Nakshatras add psychological depth that signs alone cannot provide — two people with Moon in the same sign but different nakshatras can have very different temperaments', hi: 'नक्षत्र मनोवैज्ञानिक गहराई जोड़ते हैं जो केवल राशियाँ प्रदान नहीं कर सकतीं — एक ही राशि में चन्द्र पर भिन्न नक्षत्रों वाले दो लोगों का स्वभाव बहुत भिन्न हो सकता है', sa: 'नक्षत्र मनोवैज्ञानिक गहराई जोड़ते हैं जो केवल राशियाँ प्रदान नहीं कर सकतीं — एक ही राशि में चन्द्र पर भिन्न नक्षत्रों वाले दो लोगों का स्वभाव बहुत भिन्न हो सकता है', mai: 'नक्षत्र मनोवैज्ञानिक गहराई जोड़ते हैं जो केवल राशियाँ प्रदान नहीं कर सकतीं — एक ही राशि में चन्द्र पर भिन्न नक्षत्रों वाले दो लोगों का स्वभाव बहुत भिन्न हो सकता है', mr: 'नक्षत्र मनोवैज्ञानिक गहराई जोड़ते हैं जो केवल राशियाँ प्रदान नहीं कर सकतीं — एक ही राशि में चन्द्र पर भिन्न नक्षत्रों वाले दो लोगों का स्वभाव बहुत भिन्न हो सकता है', ta: 'Nakshatras add psychological depth that signs alone cannot provide — two people with Moon in the same sign but different nakshatras can have very different temperaments', te: 'Nakshatras add psychological depth that signs alone cannot provide — two people with Moon in the same sign but different nakshatras can have very different temperaments', bn: 'Nakshatras add psychological depth that signs alone cannot provide — two people with Moon in the same sign but different nakshatras can have very different temperaments', kn: 'Nakshatras add psychological depth that signs alone cannot provide — two people with Moon in the same sign but different nakshatras can have very different temperaments', gu: 'Nakshatras add psychological depth that signs alone cannot provide — two people with Moon in the same sign but different nakshatras can have very different temperaments' } },
    { point: { en: 'Compatibility matching (Guna Milan) heavily relies on nakshatra — matching gana, nadi, yoni, and other factors from both nakshatras', hi: 'मिलान (गुण मिलान) नक्षत्र पर बहुत निर्भर करता है — दोनों नक्षत्रों से गण, नाड़ी, योनि और अन्य कारकों का मिलान', sa: 'मिलान (गुण मिलान) नक्षत्र पर बहुत निर्भर करता है — दोनों नक्षत्रों से गण, नाड़ी, योनि और अन्य कारकों का मिलान', mai: 'मिलान (गुण मिलान) नक्षत्र पर बहुत निर्भर करता है — दोनों नक्षत्रों से गण, नाड़ी, योनि और अन्य कारकों का मिलान', mr: 'मिलान (गुण मिलान) नक्षत्र पर बहुत निर्भर करता है — दोनों नक्षत्रों से गण, नाड़ी, योनि और अन्य कारकों का मिलान', ta: 'Compatibility matching (Guna Milan) heavily relies on nakshatra — matching gana, nadi, yoni, and other factors from both nakshatras', te: 'Compatibility matching (Guna Milan) heavily relies on nakshatra — matching gana, nadi, yoni, and other factors from both nakshatras', bn: 'Compatibility matching (Guna Milan) heavily relies on nakshatra — matching gana, nadi, yoni, and other factors from both nakshatras', kn: 'Compatibility matching (Guna Milan) heavily relies on nakshatra — matching gana, nadi, yoni, and other factors from both nakshatras', gu: 'Compatibility matching (Guna Milan) heavily relies on nakshatra — matching gana, nadi, yoni, and other factors from both nakshatras' } },
  ],

  importantConcepts: { en: 'Key Concepts to Remember', hi: 'याद रखने के लिए प्रमुख अवधारणाएँ', sa: 'याद रखने के लिए प्रमुख अवधारणाएँ', mai: 'याद रखने के लिए प्रमुख अवधारणाएँ', mr: 'याद रखने के लिए प्रमुख अवधारणाएँ', ta: 'Key Concepts to Remember', te: 'Key Concepts to Remember', bn: 'Key Concepts to Remember', kn: 'Key Concepts to Remember', gu: 'Key Concepts to Remember' },
  concepts: [
    { concept: { en: 'Functional vs Natural Benefics/Malefics', hi: 'कार्यात्मक बनाम प्राकृतिक शुभ/पाप', sa: 'कार्यात्मक बनाम प्राकृतिक शुभ/पाप', mai: 'कार्यात्मक बनाम प्राकृतिक शुभ/पाप', mr: 'कार्यात्मक बनाम प्राकृतिक शुभ/पाप', ta: 'Functional vs Natural Benefics/Malefics', te: 'Functional vs Natural Benefics/Malefics', bn: 'Functional vs Natural Benefics/Malefics', kn: 'Functional vs Natural Benefics/Malefics', gu: 'Functional vs Natural Benefics/Malefics' }, detail: { en: 'Jupiter is a natural benefic, but if it rules the 6th and 3rd houses for your Ascendant (Libra rising), it becomes a functional malefic. Conversely, Saturn (natural malefic) becomes a functional benefic for Taurus and Libra Ascendants. Always assess from your specific Ascendant.', hi: 'गुरु प्राकृतिक शुभ है, लेकिन यदि यह आपके लग्न के लिए 6वें और 3रे भाव का स्वामी है (तुला लग्न), तो यह कार्यात्मक पाप बनता है। इसके विपरीत, शनि (प्राकृतिक पाप) वृषभ और तुला लग्न के लिए कार्यात्मक शुभ बनता है।', sa: 'गुरु प्राकृतिक शुभ है, लेकिन यदि यह आपके लग्न के लिए 6वें और 3रे भाव का स्वामी है (तुला लग्न), तो यह कार्यात्मक पाप बनता है। इसके विपरीत, शनि (प्राकृतिक पाप) वृषभ और तुला लग्न के लिए कार्यात्मक शुभ बनता है।', mai: 'गुरु प्राकृतिक शुभ है, लेकिन यदि यह आपके लग्न के लिए 6वें और 3रे भाव का स्वामी है (तुला लग्न), तो यह कार्यात्मक पाप बनता है। इसके विपरीत, शनि (प्राकृतिक पाप) वृषभ और तुला लग्न के लिए कार्यात्मक शुभ बनता है।', mr: 'गुरु प्राकृतिक शुभ है, लेकिन यदि यह आपके लग्न के लिए 6वें और 3रे भाव का स्वामी है (तुला लग्न), तो यह कार्यात्मक पाप बनता है। इसके विपरीत, शनि (प्राकृतिक पाप) वृषभ और तुला लग्न के लिए कार्यात्मक शुभ बनता है।', ta: 'Jupiter is a natural benefic, but if it rules the 6th and 3rd houses for your Ascendant (Libra rising), it becomes a functional malefic. Conversely, Saturn (natural malefic) becomes a functional benefic for Taurus and Libra Ascendants. Always assess from your specific Ascendant.', te: 'Jupiter is a natural benefic, but if it rules the 6th and 3rd houses for your Ascendant (Libra rising), it becomes a functional malefic. Conversely, Saturn (natural malefic) becomes a functional benefic for Taurus and Libra Ascendants. Always assess from your specific Ascendant.', bn: 'Jupiter is a natural benefic, but if it rules the 6th and 3rd houses for your Ascendant (Libra rising), it becomes a functional malefic. Conversely, Saturn (natural malefic) becomes a functional benefic for Taurus and Libra Ascendants. Always assess from your specific Ascendant.', kn: 'Jupiter is a natural benefic, but if it rules the 6th and 3rd houses for your Ascendant (Libra rising), it becomes a functional malefic. Conversely, Saturn (natural malefic) becomes a functional benefic for Taurus and Libra Ascendants. Always assess from your specific Ascendant.', gu: 'Jupiter is a natural benefic, but if it rules the 6th and 3rd houses for your Ascendant (Libra rising), it becomes a functional malefic. Conversely, Saturn (natural malefic) becomes a functional benefic for Taurus and Libra Ascendants. Always assess from your specific Ascendant.' } },
    { concept: { en: 'Yogakaraka — The Best Planet for Your Chart', hi: 'योगकारक — आपकी कुण्डली का सर्वश्रेष्ठ ग्रह', sa: 'योगकारक — आपकी कुण्डली का सर्वश्रेष्ठ ग्रह', mai: 'योगकारक — आपकी कुण्डली का सर्वश्रेष्ठ ग्रह', mr: 'योगकारक — आपकी कुण्डली का सर्वश्रेष्ठ ग्रह', ta: 'Yogakaraka — The Best Planet for Your Chart', te: 'Yogakaraka — The Best Planet for Your Chart', bn: 'Yogakaraka — The Best Planet for Your Chart', kn: 'Yogakaraka — The Best Planet for Your Chart', gu: 'Yogakaraka — The Best Planet for Your Chart' }, detail: { en: 'A Yogakaraka is a planet that rules both a Kendra (1/4/7/10) and a Trikona (1/5/9) house for your Ascendant. Example: Saturn is Yogakaraka for Taurus and Libra Ascendants (rules 9th+10th and 4th+5th respectively). Its Dasha typically brings the best results in the chart.', hi: 'योगकारक वह ग्रह है जो आपके लग्न के लिए केन्द्र (1/4/7/10) और त्रिकोण (1/5/9) दोनों का स्वामी है। उदाहरण: शनि वृषभ और तुला लग्न के लिए योगकारक है। इसकी दशा आमतौर पर सर्वोत्तम परिणाम देती है।', sa: 'योगकारक वह ग्रह है जो आपके लग्न के लिए केन्द्र (1/4/7/10) और त्रिकोण (1/5/9) दोनों का स्वामी है। उदाहरण: शनि वृषभ और तुला लग्न के लिए योगकारक है। इसकी दशा आमतौर पर सर्वोत्तम परिणाम देती है।', mai: 'योगकारक वह ग्रह है जो आपके लग्न के लिए केन्द्र (1/4/7/10) और त्रिकोण (1/5/9) दोनों का स्वामी है। उदाहरण: शनि वृषभ और तुला लग्न के लिए योगकारक है। इसकी दशा आमतौर पर सर्वोत्तम परिणाम देती है।', mr: 'योगकारक वह ग्रह है जो आपके लग्न के लिए केन्द्र (1/4/7/10) और त्रिकोण (1/5/9) दोनों का स्वामी है। उदाहरण: शनि वृषभ और तुला लग्न के लिए योगकारक है। इसकी दशा आमतौर पर सर्वोत्तम परिणाम देती है।', ta: 'A Yogakaraka is a planet that rules both a Kendra (1/4/7/10) and a Trikona (1/5/9) house for your Ascendant. Example: Saturn is Yogakaraka for Taurus and Libra Ascendants (rules 9th+10th and 4th+5th respectively). Its Dasha typically brings the best results in the chart.', te: 'A Yogakaraka is a planet that rules both a Kendra (1/4/7/10) and a Trikona (1/5/9) house for your Ascendant. Example: Saturn is Yogakaraka for Taurus and Libra Ascendants (rules 9th+10th and 4th+5th respectively). Its Dasha typically brings the best results in the chart.', bn: 'A Yogakaraka is a planet that rules both a Kendra (1/4/7/10) and a Trikona (1/5/9) house for your Ascendant. Example: Saturn is Yogakaraka for Taurus and Libra Ascendants (rules 9th+10th and 4th+5th respectively). Its Dasha typically brings the best results in the chart.', kn: 'A Yogakaraka is a planet that rules both a Kendra (1/4/7/10) and a Trikona (1/5/9) house for your Ascendant. Example: Saturn is Yogakaraka for Taurus and Libra Ascendants (rules 9th+10th and 4th+5th respectively). Its Dasha typically brings the best results in the chart.', gu: 'A Yogakaraka is a planet that rules both a Kendra (1/4/7/10) and a Trikona (1/5/9) house for your Ascendant. Example: Saturn is Yogakaraka for Taurus and Libra Ascendants (rules 9th+10th and 4th+5th respectively). Its Dasha typically brings the best results in the chart.' } },
    { concept: { en: 'House Lordship — The Backbone of Interpretation', hi: 'भाव स्वामित्व — व्याख्या की रीढ़', sa: 'भाव स्वामित्व — व्याख्या की रीढ़', mai: 'भाव स्वामित्व — व्याख्या की रीढ़', mr: 'भाव स्वामित्व — व्याख्या की रीढ़', ta: 'House Lordship — The Backbone of Interpretation', te: 'House Lordship — The Backbone of Interpretation', bn: 'House Lordship — The Backbone of Interpretation', kn: 'House Lordship — The Backbone of Interpretation', gu: 'House Lordship — The Backbone of Interpretation' }, detail: { en: 'A planet\'s behavior depends more on which houses it RULES than on its natural nature. Mars rules the 9th and 4th for Leo Ascendant — making it a powerful benefic despite being a natural malefic. House lordship is the single most important concept for accurate chart reading.', hi: 'ग्रह का व्यवहार उसकी प्राकृतिक प्रकृति से अधिक इस पर निर्भर करता है कि वह किन भावों का स्वामी है। मंगल सिंह लग्न के लिए 9वें और 4थे का स्वामी है — प्राकृतिक पाप होते हुए भी शक्तिशाली शुभ। भाव स्वामित्व सटीक कुण्डली पठन की सबसे महत्वपूर्ण अवधारणा है।' } },
    { concept: { en: 'Aspects (Drishti) — Planets Influence from Afar', hi: 'दृष्टि — ग्रह दूर से प्रभावित करते हैं', sa: 'दृष्टि — ग्रह दूर से प्रभावित करते हैं', mai: 'दृष्टि — ग्रह दूर से प्रभावित करते हैं', mr: 'दृष्टि — ग्रह दूर से प्रभावित करते हैं', ta: 'Aspects (Drishti) — Planets Influence from Afar', te: 'Aspects (Drishti) — Planets Influence from Afar', bn: 'Aspects (Drishti) — Planets Influence from Afar', kn: 'Aspects (Drishti) — Planets Influence from Afar', gu: 'Aspects (Drishti) — Planets Influence from Afar' }, detail: { en: 'In Vedic astrology, all planets aspect the 7th house from their position. Additionally, Mars has special aspects on 4th and 8th houses, Jupiter on 5th and 9th, Saturn on 3rd and 10th. These aspects significantly modify house results even without physical occupation.', hi: 'वैदिक ज्योतिष में सभी ग्रह अपनी स्थिति से 7वें भाव पर दृष्टि डालते हैं। इसके अतिरिक्त, मंगल 4वें और 8वें पर, गुरु 5वें और 9वें पर, शनि 3रे और 10वें पर विशेष दृष्टि डालते हैं। ये दृष्टियाँ बिना भौतिक उपस्थिति के भी भाव परिणामों को महत्वपूर्ण रूप से संशोधित करती हैं।', sa: 'वैदिक ज्योतिष में सभी ग्रह अपनी स्थिति से 7वें भाव पर दृष्टि डालते हैं। इसके अतिरिक्त, मंगल 4वें और 8वें पर, गुरु 5वें और 9वें पर, शनि 3रे और 10वें पर विशेष दृष्टि डालते हैं। ये दृष्टियाँ बिना भौतिक उपस्थिति के भी भाव परिणामों को महत्वपूर्ण रूप से संशोधित करती हैं।', mai: 'वैदिक ज्योतिष में सभी ग्रह अपनी स्थिति से 7वें भाव पर दृष्टि डालते हैं। इसके अतिरिक्त, मंगल 4वें और 8वें पर, गुरु 5वें और 9वें पर, शनि 3रे और 10वें पर विशेष दृष्टि डालते हैं। ये दृष्टियाँ बिना भौतिक उपस्थिति के भी भाव परिणामों को महत्वपूर्ण रूप से संशोधित करती हैं।', mr: 'वैदिक ज्योतिष में सभी ग्रह अपनी स्थिति से 7वें भाव पर दृष्टि डालते हैं। इसके अतिरिक्त, मंगल 4वें और 8वें पर, गुरु 5वें और 9वें पर, शनि 3रे और 10वें पर विशेष दृष्टि डालते हैं। ये दृष्टियाँ बिना भौतिक उपस्थिति के भी भाव परिणामों को महत्वपूर्ण रूप से संशोधित करती हैं।', ta: 'In Vedic astrology, all planets aspect the 7th house from their position. Additionally, Mars has special aspects on 4th and 8th houses, Jupiter on 5th and 9th, Saturn on 3rd and 10th. These aspects significantly modify house results even without physical occupation.', te: 'In Vedic astrology, all planets aspect the 7th house from their position. Additionally, Mars has special aspects on 4th and 8th houses, Jupiter on 5th and 9th, Saturn on 3rd and 10th. These aspects significantly modify house results even without physical occupation.', bn: 'In Vedic astrology, all planets aspect the 7th house from their position. Additionally, Mars has special aspects on 4th and 8th houses, Jupiter on 5th and 9th, Saturn on 3rd and 10th. These aspects significantly modify house results even without physical occupation.', kn: 'In Vedic astrology, all planets aspect the 7th house from their position. Additionally, Mars has special aspects on 4th and 8th houses, Jupiter on 5th and 9th, Saturn on 3rd and 10th. These aspects significantly modify house results even without physical occupation.', gu: 'In Vedic astrology, all planets aspect the 7th house from their position. Additionally, Mars has special aspects on 4th and 8th houses, Jupiter on 5th and 9th, Saturn on 3rd and 10th. These aspects significantly modify house results even without physical occupation.' } },
    { concept: { en: 'Combustion — When the Sun Overwhelms', hi: 'अस्तत्व — जब सूर्य दबाता है', sa: 'अस्तत्व — जब सूर्य दबाता है', mai: 'अस्तत्व — जब सूर्य दबाता है', mr: 'अस्तत्व — जब सूर्य दबाता है', ta: 'Combustion — When the Sun Overwhelms', te: 'Combustion — When the Sun Overwhelms', bn: 'Combustion — When the Sun Overwhelms', kn: 'Combustion — When the Sun Overwhelms', gu: 'Combustion — When the Sun Overwhelms' }, detail: { en: 'When a planet comes too close to the Sun in degrees, it becomes "combust" — its light is absorbed by the Sun\'s brilliance. A combust planet loses some ability to deliver results, especially in matters of confidence and visibility. The closer to the Sun, the stronger the combustion effect.', hi: 'जब कोई ग्रह अंशों में सूर्य के बहुत निकट आता है तो वह "अस्त" हो जाता है — उसका प्रकाश सूर्य की तेजस्विता में विलीन हो जाता है। अस्त ग्रह परिणाम देने की कुछ क्षमता खो देता है, विशेषकर आत्मविश्वास और दृश्यता के मामलों में।' } },
  ],

  misconceptionsTitle: { en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ', mai: 'सामान्य भ्रान्तियाँ', mr: 'सामान्य भ्रान्तियाँ', ta: 'Common Misconceptions', te: 'Common Misconceptions', bn: 'Common Misconceptions', kn: 'Common Misconceptions', gu: 'Common Misconceptions' },
  misconceptions: [
    {
      myth: { en: '"My chart is bad"', hi: '"मेरी कुण्डली खराब है"', sa: '"मेरी कुण्डली खराब है"', mai: '"मेरी कुण्डली खराब है"', mr: '"मेरी कुण्डली खराब है"', ta: '"My chart is bad"', te: '"My chart is bad"', bn: '"My chart is bad"', kn: '"My chart is bad"', gu: '"My chart is bad"' },
      truth: {
        en: 'No chart is inherently "bad." Every chart has strengths and challenges. A chart with Saturn in the 1st house isn\'t cursed — it indicates a person who grows through discipline and perseverance, often achieving great things later in life. The "worst" placements often produce the most remarkable people because they develop resilience.',
        hi: 'कोई कुण्डली स्वाभाविक रूप से "खराब" नहीं होती। हर कुण्डली में शक्तियाँ और चुनौतियाँ हैं। प्रथम भाव में शनि अभिशाप नहीं — यह अनुशासन से बढ़ने वाले व्यक्ति को दर्शाता है। "सबसे बुरी" स्थितियाँ अक्सर सबसे उल्लेखनीय लोग बनाती हैं क्योंकि वे लचीलापन विकसित करते हैं।',
      },
    },
    {
      myth: { en: '"Rahu/Ketu are always malefic"', hi: '"राहु/केतु सदैव अशुभ हैं"', sa: '"राहु/केतु सदैव अशुभ हैं"', mai: '"राहु/केतु सदैव अशुभ हैं"', mr: '"राहु/केतु सदैव अशुभ हैं"', ta: '"Rahu/Ketu are always malefic"', te: '"Rahu/Ketu are always malefic"', bn: '"Rahu/Ketu are always malefic"', kn: '"Rahu/Ketu are always malefic"', gu: '"Rahu/Ketu are always malefic"' },
      truth: {
        en: 'Rahu and Ketu are shadow planets that amplify whatever they touch. In favorable houses with friendly sign lords, they can give extraordinary results — sudden wealth, foreign success, technological breakthroughs. Many billionaires and tech founders have strong Rahu.',
        hi: 'राहु और केतु छाया ग्रह हैं जो जो भी स्पर्श करें उसे बढ़ाते हैं। अनुकूल भावों में मित्र राशि स्वामी के साथ वे असाधारण परिणाम दे सकते हैं — अचानक धन, विदेशी सफलता। कई अरबपतियों का राहु बलवान है।',
      },
    },
    {
      myth: { en: '"Debilitated planets are useless"', hi: '"नीच ग्रह बेकार हैं"', sa: '"नीच ग्रह बेकार हैं"', mai: '"नीच ग्रह बेकार हैं"', mr: '"नीच ग्रह बेकार हैं"', ta: '"Debilitated planets are useless"', te: '"Debilitated planets are useless"', bn: '"Debilitated planets are useless"', kn: '"Debilitated planets are useless"', gu: '"Debilitated planets are useless"' },
      truth: {
        en: 'A debilitated planet CAN become extremely powerful through Neecha Bhanga Raja Yoga (cancellation of debilitation). If the debilitation lord is in a kendra or the exaltation lord aspects the debilitated planet, weakness transforms into extraordinary strength. Some of the most successful people have debilitated planets that found Neecha Bhanga.',
        hi: 'एक नीच ग्रह नीच भंग राज योग से अत्यन्त शक्तिशाली बन सकता है। यदि नीच राशि स्वामी केन्द्र में है या उच्च स्वामी दृष्टि देता है, तो कमज़ोरी असाधारण शक्ति बन जाती है।',
      },
    },
    {
      myth: { en: '"Mars in 7th house means divorce"', hi: '"सप्तम भाव में मंगल = तलाक"', sa: '"सप्तम भाव में मंगल = तलाक"', mai: '"सप्तम भाव में मंगल = तलाक"', mr: '"सप्तम भाव में मंगल = तलाक"', ta: '"Mars in 7th house means divorce"', te: '"Mars in 7th house means divorce"', bn: '"Mars in 7th house means divorce"', kn: '"Mars in 7th house means divorce"', gu: '"Mars in 7th house means divorce"' },
      truth: {
        en: 'Mars in the 7th house (Manglik Dosha) is one of the most exaggerated fears in astrology. It indicates a passionate, assertive partner — not divorce. The dosha is cancelled by many factors: Jupiter\'s aspect, both partners being Manglik, Mars in its own sign, after age 28, and more. Context matters far more than the placement alone.',
        hi: 'सप्तम भाव में मंगल (मांगलिक दोष) ज्योतिष में सबसे बढ़ा-चढ़ा कर बताई जाने वाली भय है। यह उत्साही, दृढ़ जीवनसाथी दर्शाता है — तलाक नहीं। दोष कई कारकों से रद्द होता है: गुरु दृष्टि, दोनों मांगलिक, स्वराशि, 28 वर्ष बाद आदि।',
      },
    },
    {
      myth: { en: '"The chart determines everything — free will doesn\'t exist"', hi: '"कुण्डली सब कुछ तय करती है — स्वतंत्र इच्छा नहीं"' },
      truth: {
        en: 'The chart shows tendencies, propensities, and timing — NOT fixed fates. Think of it as a weather forecast: knowing rain is likely helps you carry an umbrella, but doesn\'t force you to walk in the rain. Vedic astrology explicitly teaches that Purushartha (human effort) can modify Prarabdha (destined karma). Dashas show WHEN themes activate, not what you MUST do about them.',
        hi: 'कुण्डली प्रवृत्तियाँ, झुकाव और समय दिखाती है — निश्चित भाग्य नहीं। इसे मौसम पूर्वानुमान समझें: बारिश की सम्भावना जानने से छाता ले जाते हैं, पर बारिश में चलने के लिए मजबूर नहीं करती। वैदिक ज्योतिष स्पष्ट सिखाता है कि पुरुषार्थ प्रारब्ध को संशोधित कर सकता है।',
      },
    },
  ],

  practicalTitle: { en: 'Practical First Steps After Getting Your Chart', hi: 'कुण्डली प्राप्त करने के बाद व्यावहारिक पहले कदम', sa: 'कुण्डली प्राप्त करने के बाद व्यावहारिक पहले कदम', mai: 'कुण्डली प्राप्त करने के बाद व्यावहारिक पहले कदम', mr: 'कुण्डली प्राप्त करने के बाद व्यावहारिक पहले कदम', ta: 'Practical First Steps After Getting Your Chart', te: 'Practical First Steps After Getting Your Chart', bn: 'Practical First Steps After Getting Your Chart', kn: 'Practical First Steps After Getting Your Chart', gu: 'Practical First Steps After Getting Your Chart' },
  practicalSteps: [
    { step: { en: 'Generate your chart on our Kundali page — you need accurate birth date, time (to the minute), and place', hi: 'हमारे कुण्डली पृष्ठ पर अपना चार्ट बनाएं — आपको सटीक जन्म तिथि, समय (मिनट तक) और स्थान चाहिए', sa: 'हमारे कुण्डली पृष्ठ पर अपना चार्ट बनाएं — आपको सटीक जन्म तिथि, समय (मिनट तक) और स्थान चाहिए', mai: 'हमारे कुण्डली पृष्ठ पर अपना चार्ट बनाएं — आपको सटीक जन्म तिथि, समय (मिनट तक) और स्थान चाहिए', mr: 'हमारे कुण्डली पृष्ठ पर अपना चार्ट बनाएं — आपको सटीक जन्म तिथि, समय (मिनट तक) और स्थान चाहिए', ta: 'Generate your chart on our Kundali page — you need accurate birth date, time (to the minute), and place', te: 'Generate your chart on our Kundali page — you need accurate birth date, time (to the minute), and place', bn: 'Generate your chart on our Kundali page — you need accurate birth date, time (to the minute), and place', kn: 'Generate your chart on our Kundali page — you need accurate birth date, time (to the minute), and place', gu: 'Generate your chart on our Kundali page — you need accurate birth date, time (to the minute), and place' } },
    { step: { en: 'Read the Tippanni (interpretation) tab first — it translates the raw chart into plain language insights about your personality, career, relationships, and timing', hi: 'पहले टिप्पणी (व्याख्या) टैब पढ़ें — यह कच्ची कुण्डली को व्यक्तित्व, कैरियर, सम्बन्ध और समय के बारे में सरल भाषा में बताती है', sa: 'पहले टिप्पणी (व्याख्या) टैब पढ़ें — यह कच्ची कुण्डली को व्यक्तित्व, कैरियर, सम्बन्ध और समय के बारे में सरल भाषा में बताती है', mai: 'पहले टिप्पणी (व्याख्या) टैब पढ़ें — यह कच्ची कुण्डली को व्यक्तित्व, कैरियर, सम्बन्ध और समय के बारे में सरल भाषा में बताती है', mr: 'पहले टिप्पणी (व्याख्या) टैब पढ़ें — यह कच्ची कुण्डली को व्यक्तित्व, कैरियर, सम्बन्ध और समय के बारे में सरल भाषा में बताती है', ta: 'Read the Tippanni (interpretation) tab first — it translates the raw chart into plain language insights about your personality, career, relationships, and timing', te: 'Read the Tippanni (interpretation) tab first — it translates the raw chart into plain language insights about your personality, career, relationships, and timing', bn: 'Read the Tippanni (interpretation) tab first — it translates the raw chart into plain language insights about your personality, career, relationships, and timing', kn: 'Read the Tippanni (interpretation) tab first — it translates the raw chart into plain language insights about your personality, career, relationships, and timing', gu: 'Read the Tippanni (interpretation) tab first — it translates the raw chart into plain language insights about your personality, career, relationships, and timing' } },
    { step: { en: 'Check your current Dasha — go to the Dasha tab to see which planetary period you are currently living in, and read its implications', hi: 'अपनी वर्तमान दशा देखें — दशा टैब पर जाकर देखें कि वर्तमान में कौन सी ग्रह अवधि चल रही है और उसके निहितार्थ पढ़ें', sa: 'अपनी वर्तमान दशा देखें — दशा टैब पर जाकर देखें कि वर्तमान में कौन सी ग्रह अवधि चल रही है और उसके निहितार्थ पढ़ें', mai: 'अपनी वर्तमान दशा देखें — दशा टैब पर जाकर देखें कि वर्तमान में कौन सी ग्रह अवधि चल रही है और उसके निहितार्थ पढ़ें', mr: 'अपनी वर्तमान दशा देखें — दशा टैब पर जाकर देखें कि वर्तमान में कौन सी ग्रह अवधि चल रही है और उसके निहितार्थ पढ़ें', ta: 'Check your current Dasha — go to the Dasha tab to see which planetary period you are currently living in, and read its implications', te: 'Check your current Dasha — go to the Dasha tab to see which planetary period you are currently living in, and read its implications', bn: 'Check your current Dasha — go to the Dasha tab to see which planetary period you are currently living in, and read its implications', kn: 'Check your current Dasha — go to the Dasha tab to see which planetary period you are currently living in, and read its implications', gu: 'Check your current Dasha — go to the Dasha tab to see which planetary period you are currently living in, and read its implications' } },
    { step: { en: 'Validate with life events — compare past Dasha periods with what actually happened. If Saturn Dasha coincided with hard work and delayed rewards, your chart time is confirmed', hi: 'जीवन घटनाओं से मान्य करें — पिछली दशा अवधियों की तुलना वास्तव में हुई घटनाओं से करें। यदि शनि दशा कठिन परिश्रम और विलम्बित पुरस्कारों से मेल खाती है, तो आपका कुण्डली समय पुष्ट है', sa: 'जीवन घटनाओं से मान्य करें — पिछली दशा अवधियों की तुलना वास्तव में हुई घटनाओं से करें। यदि शनि दशा कठिन परिश्रम और विलम्बित पुरस्कारों से मेल खाती है, तो आपका कुण्डली समय पुष्ट है', mai: 'जीवन घटनाओं से मान्य करें — पिछली दशा अवधियों की तुलना वास्तव में हुई घटनाओं से करें। यदि शनि दशा कठिन परिश्रम और विलम्बित पुरस्कारों से मेल खाती है, तो आपका कुण्डली समय पुष्ट है', mr: 'जीवन घटनाओं से मान्य करें — पिछली दशा अवधियों की तुलना वास्तव में हुई घटनाओं से करें। यदि शनि दशा कठिन परिश्रम और विलम्बित पुरस्कारों से मेल खाती है, तो आपका कुण्डली समय पुष्ट है', ta: 'Validate with life events — compare past Dasha periods with what actually happened. If Saturn Dasha coincided with hard work and delayed rewards, your chart time is confirmed', te: 'Validate with life events — compare past Dasha periods with what actually happened. If Saturn Dasha coincided with hard work and delayed rewards, your chart time is confirmed', bn: 'Validate with life events — compare past Dasha periods with what actually happened. If Saturn Dasha coincided with hard work and delayed rewards, your chart time is confirmed', kn: 'Validate with life events — compare past Dasha periods with what actually happened. If Saturn Dasha coincided with hard work and delayed rewards, your chart time is confirmed', gu: 'Validate with life events — compare past Dasha periods with what actually happened. If Saturn Dasha coincided with hard work and delayed rewards, your chart time is confirmed' } },
    { step: { en: 'Explore the Yogas tab — identify which special combinations are active in your chart and what talents or challenges they indicate', hi: 'योग टैब का पता लगाएं — पहचानें कि कौन से विशेष संयोग आपकी कुण्डली में सक्रिय हैं और वे कौन सी प्रतिभाएँ या चुनौतियाँ इंगित करते हैं', sa: 'योग टैब का पता लगाएं — पहचानें कि कौन से विशेष संयोग आपकी कुण्डली में सक्रिय हैं और वे कौन सी प्रतिभाएँ या चुनौतियाँ इंगित करते हैं', mai: 'योग टैब का पता लगाएं — पहचानें कि कौन से विशेष संयोग आपकी कुण्डली में सक्रिय हैं और वे कौन सी प्रतिभाएँ या चुनौतियाँ इंगित करते हैं', mr: 'योग टैब का पता लगाएं — पहचानें कि कौन से विशेष संयोग आपकी कुण्डली में सक्रिय हैं और वे कौन सी प्रतिभाएँ या चुनौतियाँ इंगित करते हैं', ta: 'Explore the Yogas tab — identify which special combinations are active in your chart and what talents or challenges they indicate', te: 'Explore the Yogas tab — identify which special combinations are active in your chart and what talents or challenges they indicate', bn: 'Explore the Yogas tab — identify which special combinations are active in your chart and what talents or challenges they indicate', kn: 'Explore the Yogas tab — identify which special combinations are active in your chart and what talents or challenges they indicate', gu: 'Explore the Yogas tab — identify which special combinations are active in your chart and what talents or challenges they indicate' } },
  ],

  furtherTitle: { en: 'Continue Your Learning', hi: 'आगे सीखें', sa: 'आगे सीखें', mai: 'आगे सीखें', mr: 'आगे सीखें', ta: 'Continue Your Learning', te: 'Continue Your Learning', bn: 'Continue Your Learning', kn: 'Continue Your Learning', gu: 'Continue Your Learning' },
  furtherLinks: [
    { href: '/learn/kundali', label: { en: 'How a Kundali is Mathematically Constructed', hi: 'कुण्डली गणितीय रूप से कैसे बनती है', sa: 'कुण्डली गणितीय रूप से कैसे बनती है', mai: 'कुण्डली गणितीय रूप से कैसे बनती है', mr: 'कुण्डली गणितीय रूप से कैसे बनती है', ta: 'How a Kundali is Mathematically Constructed', te: 'How a Kundali is Mathematically Constructed', bn: 'How a Kundali is Mathematically Constructed', kn: 'How a Kundali is Mathematically Constructed', gu: 'How a Kundali is Mathematically Constructed' } },
    { href: '/learn/bhavas', label: { en: 'Deep Dive: The 12 Houses (Bhavas)', hi: 'गहन अध्ययन: 12 भाव', sa: 'गहन अध्ययन: 12 भाव', mai: 'गहन अध्ययन: 12 भाव', mr: 'गहन अध्ययन: 12 भाव', ta: 'Deep Dive: The 12 Houses (Bhavas)', te: 'Deep Dive: The 12 Houses (Bhavas)', bn: 'Deep Dive: The 12 Houses (Bhavas)', kn: 'Deep Dive: The 12 Houses (Bhavas)', gu: 'Deep Dive: The 12 Houses (Bhavas)' } },
    { href: '/learn/grahas', label: { en: 'Deep Dive: The 9 Planets (Grahas)', hi: 'गहन अध्ययन: 9 ग्रह', sa: 'गहन अध्ययन: 9 ग्रह', mai: 'गहन अध्ययन: 9 ग्रह', mr: 'गहन अध्ययन: 9 ग्रह', ta: 'Deep Dive: The 9 Planets (Grahas)', te: 'Deep Dive: The 9 Planets (Grahas)', bn: 'Deep Dive: The 9 Planets (Grahas)', kn: 'Deep Dive: The 9 Planets (Grahas)', gu: 'Deep Dive: The 9 Planets (Grahas)' } },
    { href: '/learn/rashis', label: { en: 'Deep Dive: The 12 Signs (Rashis)', hi: 'गहन अध्ययन: 12 राशियाँ', sa: 'गहन अध्ययन: 12 राशियाँ', mai: 'गहन अध्ययन: 12 राशियाँ', mr: 'गहन अध्ययन: 12 राशियाँ', ta: 'Deep Dive: The 12 Signs (Rashis)', te: 'Deep Dive: The 12 Signs (Rashis)', bn: 'Deep Dive: The 12 Signs (Rashis)', kn: 'Deep Dive: The 12 Signs (Rashis)', gu: 'Deep Dive: The 12 Signs (Rashis)' } },
    { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र', sa: '27 नक्षत्र', mai: '27 नक्षत्र', mr: '27 नक्षत्र', ta: 'The 27 Nakshatras', te: 'The 27 Nakshatras', bn: 'The 27 Nakshatras', kn: 'The 27 Nakshatras', gu: 'The 27 Nakshatras' } },
    { href: '/learn/dashas', label: { en: 'Understanding Dashas (Life Timing)', hi: 'दशा (जीवन समय) को समझें', sa: 'दशा (जीवन समय) को समझें', mai: 'दशा (जीवन समय) को समझें', mr: 'दशा (जीवन समय) को समझें', ta: 'Understanding Dashas (Life Timing)', te: 'Understanding Dashas (Life Timing)', bn: 'Understanding Dashas (Life Timing)', kn: 'Understanding Dashas (Life Timing)', gu: 'Understanding Dashas (Life Timing)' } },
    { href: '/learn/yogas', label: { en: 'Yogas: Special Planetary Combinations', hi: 'योग: विशेष ग्रह संयोग', sa: 'योग: विशेष ग्रह संयोग', mai: 'योग: विशेष ग्रह संयोग', mr: 'योग: विशेष ग्रह संयोग', ta: 'Yogas: Special Planetary Combinations', te: 'Yogas: Special Planetary Combinations', bn: 'Yogas: Special Planetary Combinations', kn: 'Yogas: Special Planetary Combinations', gu: 'Yogas: Special Planetary Combinations' } },
    { href: '/learn/tippanni', label: { en: 'Tippanni: Your Chart Interpretation Guide', hi: 'टिप्पणी: कुण्डली व्याख्या मार्गदर्शिका', sa: 'टिप्पणी: कुण्डली व्याख्या मार्गदर्शिका', mai: 'टिप्पणी: कुण्डली व्याख्या मार्गदर्शिका', mr: 'टिप्पणी: कुण्डली व्याख्या मार्गदर्शिका', ta: 'Tippanni: Your Chart Interpretation Guide', te: 'Tippanni: Your Chart Interpretation Guide', bn: 'Tippanni: Your Chart Interpretation Guide', kn: 'Tippanni: Your Chart Interpretation Guide', gu: 'Tippanni: Your Chart Interpretation Guide' } },
  ],
};

export default function BirthChartPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((LJ as unknown as Record<string, LocaleText>)[key], locale);
  const l = (obj: Record<string, string> | { en: string; [k: string]: string | undefined }) => lt(obj as LocaleText, locale);
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-2">
      {/* Hero */}
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {t('title')}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
      </header>

      {/* 1. What is a birth chart */}
      <LessonSection number={1} title={t('whatTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('whatP1')}</p>
          <p>{t('whatP2')}</p>
          <p>{t('whatP3')}</p>
        </div>
      </LessonSection>

      {/* 2. Why time and place matter */}
      <LessonSection number={2} title={t('whyTimeTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('whyTimeP1')}</p>
          <p>{t('whyTimeP2')}</p>
          <p>{t('whyTimeP3')}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs mt-4">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left text-gold-light py-2 px-3">{isHi ? 'कारक' : 'Factor'}</th>
                  <th className="text-left text-gold-light py-2 px-3">{isHi ? 'क्या बदलता है' : 'What it Changes'}</th>
                </tr>
              </thead>
              <tbody>
                {L.whyTimeTable.map((row, i) => (
                  <tr key={i} className="border-b border-gold-primary/8">
                    <td className="py-2 px-3 text-gold-primary font-semibold">{l(row.factor)}</td>
                    <td className="py-2 px-3 text-text-secondary">{l(row.changes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </LessonSection>

      {/* 3. The 12 houses */}
      <LessonSection number={3} title={t('housesTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('housesIntro')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {L.houses.map((h) => (
              <div key={h.num} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center text-gold-light text-xs font-bold">
                    {h.num}
                  </span>
                  <span className="text-gold-light font-semibold text-sm">{l(h.name)}</span>
                  <span className="text-text-secondary/50 text-xs ml-auto">{l(h.tag)}</span>
                </div>
                <p className="text-text-secondary text-xs ml-8">{l(h.area)}</p>
              </div>
            ))}
          </div>

          <p className="text-text-secondary/70 text-xs mt-3 p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
            {t('housesClassification')}
          </p>

          <p className="text-xs">
            <Link href="/learn/bhavas" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'भावों का गहन अध्ययन →' : 'Deep dive into the 12 houses →'}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 4. The 9 planets */}
      <LessonSection number={4} title={t('planetsTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('planetsIntro')}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs mt-2">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left text-gold-light py-2 px-3">{isHi ? 'ग्रह' : 'Planet'}</th>
                  <th className="text-left text-gold-light py-2 px-3">{isHi ? 'शासन करता है' : 'Governs'}</th>
                  <th className="text-center text-gold-light py-2 px-3">{isHi ? 'दशा वर्ष' : 'Dasha Yrs'}</th>
                </tr>
              </thead>
              <tbody>
                {L.planets.map((p, i) => (
                  <tr key={i} className="border-b border-gold-primary/8">
                    <td className="py-2 px-3 text-gold-primary font-semibold whitespace-nowrap">{l(p.name)}</td>
                    <td className="py-2 px-3 text-text-secondary">{l(p.rules)}</td>
                    <td className="py-2 px-3 text-center text-gold-light">{p.years}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs">
            <Link href="/learn/grahas" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'ग्रहों का गहन अध्ययन →' : 'Deep dive into the 9 planets →'}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 5. The 12 signs */}
      <LessonSection number={5} title={t('signsTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('signsIntro')}</p>
          <p>{t('signsP2')}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs mt-2">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-center text-gold-light py-2 px-2">#</th>
                  <th className="text-left text-gold-light py-2 px-3">{isHi ? 'राशि' : 'Sign'}</th>
                  <th className="text-left text-gold-light py-2 px-3">{isHi ? 'स्वामी' : 'Lord'}</th>
                  <th className="text-left text-gold-light py-2 px-3">{isHi ? 'तत्व' : 'Element'}</th>
                  <th className="text-left text-gold-light py-2 px-3">{isHi ? 'गुण' : 'Quality'}</th>
                </tr>
              </thead>
              <tbody>
                {L.signs.map((s) => (
                  <tr key={s.num} className="border-b border-gold-primary/8">
                    <td className="py-1.5 px-2 text-center text-gold-primary/60">{s.num}</td>
                    <td className="py-1.5 px-3 text-gold-primary font-semibold">{l(s.name)}</td>
                    <td className="py-1.5 px-3 text-text-secondary">{l(s.lord)}</td>
                    <td className="py-1.5 px-3 text-text-secondary">{l(s.element)}</td>
                    <td className="py-1.5 px-3 text-text-secondary">{l(s.quality)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs">
            <Link href="/learn/rashis" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'राशियों का गहन अध्ययन →' : 'Deep dive into the 12 signs →'}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 6. How to read */}
      <LessonSection number={6} title={t('howToReadTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('howToReadIntro')}</p>

          <div className="space-y-4 mt-4">
            {L.readSteps.map((s, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                  {l(s.step)}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">{l(s.detail)}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 7. Chart styles */}
      <LessonSection number={7} title={t('chartStylesTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('chartStylesP1')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                {t('northStyle_title')}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed mb-2">{t('northStyle_p1')}</p>
              <p className="text-text-secondary/70 text-xs">{t('northStyle_p2')}</p>
            </div>
            <div className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                {t('southStyle_title')}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed mb-2">{t('southStyle_p1')}</p>
              <p className="text-text-secondary/70 text-xs">{t('southStyle_p2')}</p>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* 8. Degrees */}
      <LessonSection number={8} title={t('degreesTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('degreesP1')}</p>

          <div className="space-y-3 mt-4">
            {L.degreeReasons.map((d, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-3">
                <h4 className="text-gold-light font-semibold text-xs mb-1">{l(d.reason)}</h4>
                <p className="text-text-secondary text-xs leading-relaxed">{l(d.detail)}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 9. Nakshatras */}
      <LessonSection number={9} title={t('nakshatrasTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('nakshatrasP1')}</p>
          <ul className="space-y-2 mt-3">
            {L.nakshatraPoints.map((n, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="text-gold-primary shrink-0 mt-0.5">&#x2022;</span>
                <span className="text-text-secondary">{l(n.point)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs">
            <Link href="/learn/nakshatras" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? '27 नक्षत्रों का गहन अध्ययन →' : 'Deep dive into the 27 Nakshatras →'}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 10. Key Concepts */}
      <LessonSection number={10} title={t('importantConcepts')}>
        <div className="space-y-3">
          {L.concepts.map((c, i) => (
            <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                {l(c.concept)}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">{l(c.detail)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 11. Misconceptions */}
      <LessonSection number={11} title={t('misconceptionsTitle')}>
        <div className="space-y-4">
          {L.misconceptions.map((m, i) => (
            <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
              <h4 className="text-red-400/80 font-bold text-sm mb-2">{l(m.myth)}</h4>
              <p className="text-text-secondary text-xs leading-relaxed">{l(m.truth)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 12. Practical first steps */}
      <LessonSection number={12} title={t('practicalTitle')}>
        <div className="space-y-3">
          {L.practicalSteps.map((s, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
              <span className="text-gold-primary font-bold text-xs shrink-0 mt-0.5">{i + 1}.</span>
              <p className="text-text-secondary text-xs leading-relaxed">{l(s.step)}</p>
            </div>
          ))}
          <div className="mt-4 text-center">
            <Link
              href="/kundali"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light text-sm font-semibold hover:bg-gold-primary/25 transition-all"
            >
              {isHi ? 'अपनी कुण्डली बनाएं →' : 'Generate Your Kundali →'}
            </Link>
          </div>
        </div>
      </LessonSection>

      {/* Further learning */}
      <LessonSection title={t('furtherTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {L.furtherLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-gold-primary/70 hover:text-gold-light transition-colors text-sm p-2 rounded-lg hover:bg-gold-primary/5"
            >
              {l(link.label)} →
            </Link>
          ))}
        </div>
      </LessonSection>
    </article>
  );
}
