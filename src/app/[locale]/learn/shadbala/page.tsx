'use client';

import { tl } from '@/lib/utils/trilingual';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Compass, Clock, RotateCcw, Sun, Eye, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt as ltFn } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LT from '@/messages/learn/shadbala.json';

/* Simple labels migrated to src/messages/learn/shadbala.json — accessed via LT + tj() */
/* Array data kept inline since it contains mixed data + translations */
const L = {
  sthanaSubParts: [
    { name: { en: 'Uccha Bala', hi: 'उच्च बल', sa: 'उच्चबलम्' }, desc: { en: 'Exaltation strength. Maximum at exact exaltation degree, zero at debilitation degree. Linear interpolation between. Sun peaks at 10° Aries, Moon at 3° Taurus, etc.', hi: 'उच्च शक्ति। सटीक उच्च अंश पर अधिकतम, नीच अंश पर शून्य। सूर्य 10° मेष पर, चन्द्र 3° वृषभ पर चरम।', sa: 'उच्चशक्तिः। उच्चांशे अधिकतमम्, नीचांशे शून्यम्।' } },
    { name: { en: 'Saptavargaja Bala', hi: 'सप्तवर्गज बल', sa: 'सप्तवर्गजबलम्' }, desc: { en: 'Strength from 7 divisional charts (Rashi, Hora, Drekkana, Saptamsha, Navamsha, Dwadashamsha, Trimshamsha). In each varga, the planet can be in own sign, exaltation, moolatrikona, or friendly sign — each level adds points.', hi: '7 वर्ग कुण्डलियों से बल (राशि, होरा, द्रेक्काण, सप्तमांश, नवमांश, द्वादशांश, त्रिंशांश)। प्रत्येक वर्ग में स्वराशि, उच्च, मूलत्रिकोण या मित्र राशि से अंक मिलते हैं।', sa: '7 वर्गकुण्डलीभ्यः बलम्।' } },
    { name: { en: 'Ojha-Yugma Bala', hi: 'ओज-युग्म बल', sa: 'ओजयुग्मबलम्' }, desc: { en: 'Odd-even sign strength. Moon and Venus gain strength in even signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces). Other planets gain in odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius).', hi: 'विषम-सम राशि बल। चन्द्र और शुक्र सम राशियों में बलवान। अन्य ग्रह विषम राशियों में बलवान।', sa: 'विषमसमराशिबलम्। चन्द्रशुक्रौ समराशिषु बलिनौ।' } },
    { name: { en: 'Kendradi Bala', hi: 'केन्द्रादि बल', sa: 'केन्द्रादिबलम्' }, desc: { en: 'Angular house strength. Planets in Kendras (1,4,7,10) get 60 Shashtiamshas, in Panapharas (2,5,8,11) get 30, in Apoklimas (3,6,9,12) get 15. Kendra placement is inherently powerful.', hi: 'केन्द्र भाव बल। केन्द्र (1,4,7,10) में 60 षष्ट्यंश, पणफर (2,5,8,11) में 30, आपोक्लिम (3,6,9,12) में 15।', sa: 'केन्द्रभावबलम्। केन्द्रे 60, पणफरे 30, आपोक्लिमे 15 षष्ट्यंशाः।' } },
    { name: { en: 'Drekkana Bala', hi: 'द्रेक्काण बल', sa: 'द्रेक्काणबलम्' }, desc: { en: 'Decanate strength. Male planets (Sun, Mars, Jupiter) gain in the 1st drekkana (0°-10°), neutral planets (Mercury, Saturn) in the 2nd (10°-20°), female planets (Moon, Venus) in the 3rd (20°-30°).', hi: 'द्रेक्काण बल। पुरुष ग्रह (सूर्य, मंगल, गुरु) प्रथम, तटस्थ (बुध, शनि) द्वितीय, स्त्री (चन्द्र, शुक्र) तृतीय द्रेक्काण में बलवान।', sa: 'पुंग्रहाः प्रथमे, तटस्थाः द्वितीये, स्त्रीग्रहाः तृतीये द्रेक्काणे बलिनः।' } },
  ],
  naisargikaValues: [
    { planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, value: 60.0 },
    { planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, value: 51.4 },
    { planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, value: 42.9 },
    { planet: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, value: 34.3 },
    { planet: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, value: 25.7 },
    { planet: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, value: 17.1 },
    { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, value: 8.6 },
  ],
  thresholds: [
    { planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' }, rupas: 5.0, shashtiamshas: 300 },
    { planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', mai: 'चन्द्र', mr: 'चंद्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' }, rupas: 6.0, shashtiamshas: 360 },
    { planet: { en: 'Mars', hi: 'मंगल', sa: 'कुजः', mai: 'मंगल', mr: 'मंगळ', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, rupas: 5.0, shashtiamshas: 300 },
    { planet: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' }, rupas: 7.0, shashtiamshas: 420 },
    { planet: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः', mai: 'गुरु', mr: 'गुरु', ta: 'வியாழன்', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' }, rupas: 6.5, shashtiamshas: 390 },
    { planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' }, rupas: 5.5, shashtiamshas: 330 },
    { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', mai: 'शनि', mr: 'शनी', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, rupas: 5.0, shashtiamshas: 300 },
  ],
  planetEffects: [
    { planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' }, strong: { en: 'Confidence, authority, government favor, strong father, leadership roles, good health/vitality, fame', hi: 'आत्मविश्वास, अधिकार, सरकारी कृपा, बलवान पिता, नेतृत्व, अच्छा स्वास्थ्य, यश', sa: 'आत्मविश्वास, अधिकार, सरकारी कृपा, बलवान पिता, नेतृत्व, अच्छा स्वास्थ्य, यश', mai: 'आत्मविश्वास, अधिकार, सरकारी कृपा, बलवान पिता, नेतृत्व, अच्छा स्वास्थ्य, यश', mr: 'आत्मविश्वास, अधिकार, सरकारी कृपा, बलवान पिता, नेतृत्व, अच्छा स्वास्थ्य, यश', ta: 'Confidence, authority, government favor, strong father, leadership roles, good health/vitality, fame', te: 'Confidence, authority, government favor, strong father, leadership roles, good health/vitality, fame', bn: 'Confidence, authority, government favor, strong father, leadership roles, good health/vitality, fame', kn: 'Confidence, authority, government favor, strong father, leadership roles, good health/vitality, fame', gu: 'Confidence, authority, government favor, strong father, leadership roles, good health/vitality, fame' }, weak: { en: 'Low self-esteem, trouble with authority, weak eyesight, heart issues, absent/weak father figure, career stagnation', hi: 'कम आत्मविश्वास, अधिकारियों से कठिनाई, कमजोर दृष्टि, हृदय समस्या, पिता से दूरी, करियर ठहराव', sa: 'कम आत्मविश्वास, अधिकारियों से कठिनाई, कमजोर दृष्टि, हृदय समस्या, पिता से दूरी, करियर ठहराव', mai: 'कम आत्मविश्वास, अधिकारियों से कठिनाई, कमजोर दृष्टि, हृदय समस्या, पिता से दूरी, करियर ठहराव', mr: 'कम आत्मविश्वास, अधिकारियों से कठिनाई, कमजोर दृष्टि, हृदय समस्या, पिता से दूरी, करियर ठहराव', ta: 'Low self-esteem, trouble with authority, weak eyesight, heart issues, absent/weak father figure, career stagnation', te: 'Low self-esteem, trouble with authority, weak eyesight, heart issues, absent/weak father figure, career stagnation', bn: 'Low self-esteem, trouble with authority, weak eyesight, heart issues, absent/weak father figure, career stagnation', kn: 'Low self-esteem, trouble with authority, weak eyesight, heart issues, absent/weak father figure, career stagnation', gu: 'Low self-esteem, trouble with authority, weak eyesight, heart issues, absent/weak father figure, career stagnation' } },
    { planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', mai: 'चन्द्र', mr: 'चंद्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' }, strong: { en: 'Emotional stability, good memory, public popularity, nurturing mother, wealth from liquids/travel, peaceful mind', hi: 'भावनात्मक स्थिरता, अच्छी स्मृति, जन लोकप्रियता, स्नेही माता, शान्त मन', sa: 'भावनात्मक स्थिरता, अच्छी स्मृति, जन लोकप्रियता, स्नेही माता, शान्त मन', mai: 'भावनात्मक स्थिरता, अच्छी स्मृति, जन लोकप्रियता, स्नेही माता, शान्त मन', mr: 'भावनात्मक स्थिरता, अच्छी स्मृति, जन लोकप्रियता, स्नेही माता, शान्त मन', ta: 'Emotional stability, good memory, public popularity, nurturing mother, wealth from liquids/travel, peaceful mind', te: 'Emotional stability, good memory, public popularity, nurturing mother, wealth from liquids/travel, peaceful mind', bn: 'Emotional stability, good memory, public popularity, nurturing mother, wealth from liquids/travel, peaceful mind', kn: 'Emotional stability, good memory, public popularity, nurturing mother, wealth from liquids/travel, peaceful mind', gu: 'Emotional stability, good memory, public popularity, nurturing mother, wealth from liquids/travel, peaceful mind' }, weak: { en: 'Anxiety, depression, insomnia, weak mother, fluid retention, indecisiveness, mental restlessness', hi: 'चिंता, अवसाद, अनिद्रा, माता कमजोर, अनिर्णय, मानसिक अशान्ति', sa: 'चिंता, अवसाद, अनिद्रा, माता कमजोर, अनिर्णय, मानसिक अशान्ति', mai: 'चिंता, अवसाद, अनिद्रा, माता कमजोर, अनिर्णय, मानसिक अशान्ति', mr: 'चिंता, अवसाद, अनिद्रा, माता कमजोर, अनिर्णय, मानसिक अशान्ति', ta: 'Anxiety, depression, insomnia, weak mother, fluid retention, indecisiveness, mental restlessness', te: 'Anxiety, depression, insomnia, weak mother, fluid retention, indecisiveness, mental restlessness', bn: 'Anxiety, depression, insomnia, weak mother, fluid retention, indecisiveness, mental restlessness', kn: 'Anxiety, depression, insomnia, weak mother, fluid retention, indecisiveness, mental restlessness', gu: 'Anxiety, depression, insomnia, weak mother, fluid retention, indecisiveness, mental restlessness' } },
    { planet: { en: 'Mars', hi: 'मंगल', sa: 'कुजः', mai: 'मंगल', mr: 'मंगळ', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, strong: { en: 'Courage, athletic ability, property ownership, engineering skill, strong siblings, sharp logical mind', hi: 'साहस, खेल क्षमता, भूमि सम्पत्ति, अभियान्त्रिकी, बलवान भाई-बहन, तीक्ष्ण तर्क', sa: 'साहस, खेल क्षमता, भूमि सम्पत्ति, अभियान्त्रिकी, बलवान भाई-बहन, तीक्ष्ण तर्क', mai: 'साहस, खेल क्षमता, भूमि सम्पत्ति, अभियान्त्रिकी, बलवान भाई-बहन, तीक्ष्ण तर्क', mr: 'साहस, खेल क्षमता, भूमि सम्पत्ति, अभियान्त्रिकी, बलवान भाई-बहन, तीक्ष्ण तर्क', ta: 'Courage, athletic ability, property ownership, engineering skill, strong siblings, sharp logical mind', te: 'Courage, athletic ability, property ownership, engineering skill, strong siblings, sharp logical mind', bn: 'Courage, athletic ability, property ownership, engineering skill, strong siblings, sharp logical mind', kn: 'Courage, athletic ability, property ownership, engineering skill, strong siblings, sharp logical mind', gu: 'Courage, athletic ability, property ownership, engineering skill, strong siblings, sharp logical mind' }, weak: { en: 'Accidents, blood disorders, sibling conflict, property disputes, lack of courage, surgical issues, anger management problems', hi: 'दुर्घटना, रक्त विकार, भाई-बहन से संघर्ष, सम्पत्ति विवाद, साहस की कमी, क्रोध', sa: 'दुर्घटना, रक्त विकार, भाई-बहन से संघर्ष, सम्पत्ति विवाद, साहस की कमी, क्रोध', mai: 'दुर्घटना, रक्त विकार, भाई-बहन से संघर्ष, सम्पत्ति विवाद, साहस की कमी, क्रोध', mr: 'दुर्घटना, रक्त विकार, भाई-बहन से संघर्ष, सम्पत्ति विवाद, साहस की कमी, क्रोध', ta: 'விபத்துகள், இரத்தக் கோளாறுகள், உடன்பிறப்பு மோதல், சொத்து தகராறுகள், தைரியமின்மை, அறுவை சிக்கல்கள், கோப மேலாண்மை பிரச்சனைகள்', te: 'ప్రమాదాలు, రక్త వ్యాధులు, తోబుట్టువుల ఘర్షణ, ఆస్తి వివాదాలు, ధైర్యం లేకపోవడం, శస్త్రచికిత్స సమస్యలు, కోపం నియంత్రణ సమస్యలు', bn: 'দুর্ঘটনা, রক্তের রোগ, ভাইবোনের দ্বন্দ্ব, সম্পত্তি বিবাদ, সাহসের অভাব, অস্ত্রোপচার সমস্যা, রাগ নিয়ন্ত্রণ সমস্যা', kn: 'ಅಪಘಾತಗಳು, ರಕ್ತ ವಿಕಾರಗಳು, ಒಡಹುಟ್ಟಿದವರ ಘರ್ಷಣೆ, ಆಸ್ತಿ ವಿವಾದಗಳು, ಧೈರ್ಯದ ಕೊರತೆ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಸಮಸ್ಯೆಗಳು, ಕೋಪ ನಿರ್ವಹಣೆ ಸಮಸ್ಯೆಗಳು', gu: 'અકસ્માત, રક્ત રોગ, ભાઈ-બહેનનો ઝઘડો, મિલકત વિવાદ, હિંમતનો અભાવ, શસ્ત્રક્રિયા સમસ્યાઓ, ક્રોધ નિયંત્રણ સમસ્યાઓ' } },
    { planet: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' }, strong: { en: 'Sharp intellect, business acumen, excellent communication, writing talent, mathematical ability, adaptability', hi: 'तीक्ष्ण बुद्धि, व्यापार कुशलता, उत्कृष्ट संवाद, लेखन, गणित, अनुकूलनशीलता', sa: 'तीक्ष्ण बुद्धि, व्यापार कुशलता, उत्कृष्ट संवाद, लेखन, गणित, अनुकूलनशीलता', mai: 'तीक्ष्ण बुद्धि, व्यापार कुशलता, उत्कृष्ट संवाद, लेखन, गणित, अनुकूलनशीलता', mr: 'तीक्ष्ण बुद्धि, व्यापार कुशलता, उत्कृष्ट संवाद, लेखन, गणित, अनुकूलनशीलता', ta: 'Sharp intellect, business acumen, excellent communication, writing talent, mathematical ability, adaptability', te: 'Sharp intellect, business acumen, excellent communication, writing talent, mathematical ability, adaptability', bn: 'Sharp intellect, business acumen, excellent communication, writing talent, mathematical ability, adaptability', kn: 'Sharp intellect, business acumen, excellent communication, writing talent, mathematical ability, adaptability', gu: 'Sharp intellect, business acumen, excellent communication, writing talent, mathematical ability, adaptability' }, weak: { en: 'Speech difficulties, learning challenges, nervous disorders, skin issues, poor business decisions, communication breakdowns', hi: 'वाक् दोष, अधिगम कठिनाई, तंत्रिका विकार, त्वचा रोग, खराब व्यापारिक निर्णय', sa: 'वाक् दोष, अधिगम कठिनाई, तंत्रिका विकार, त्वचा रोग, खराब व्यापारिक निर्णय', mai: 'वाक् दोष, अधिगम कठिनाई, तंत्रिका विकार, त्वचा रोग, खराब व्यापारिक निर्णय', mr: 'वाक् दोष, अधिगम कठिनाई, तंत्रिका विकार, त्वचा रोग, खराब व्यापारिक निर्णय', ta: 'Speech difficulties, learning challenges, nervous disorders, skin issues, poor business decisions, communication breakdowns', te: 'Speech difficulties, learning challenges, nervous disorders, skin issues, poor business decisions, communication breakdowns', bn: 'Speech difficulties, learning challenges, nervous disorders, skin issues, poor business decisions, communication breakdowns', kn: 'Speech difficulties, learning challenges, nervous disorders, skin issues, poor business decisions, communication breakdowns', gu: 'Speech difficulties, learning challenges, nervous disorders, skin issues, poor business decisions, communication breakdowns' } },
    { planet: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः', mai: 'गुरु', mr: 'गुरु', ta: 'வியாழன்', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' }, strong: { en: 'Wisdom, wealth expansion, good children, spiritual growth, teaching ability, liver health, respect in society', hi: 'ज्ञान, धन वृद्धि, श्रेष्ठ संतान, आध्यात्मिक विकास, शिक्षण, समाज में सम्मान', sa: 'ज्ञान, धन वृद्धि, श्रेष्ठ संतान, आध्यात्मिक विकास, शिक्षण, समाज में सम्मान', mai: 'ज्ञान, धन वृद्धि, श्रेष्ठ संतान, आध्यात्मिक विकास, शिक्षण, समाज में सम्मान', mr: 'ज्ञान, धन वृद्धि, श्रेष्ठ संतान, आध्यात्मिक विकास, शिक्षण, समाज में सम्मान', ta: 'Wisdom, wealth expansion, good children, spiritual growth, teaching ability, liver health, respect in society', te: 'Wisdom, wealth expansion, good children, spiritual growth, teaching ability, liver health, respect in society', bn: 'Wisdom, wealth expansion, good children, spiritual growth, teaching ability, liver health, respect in society', kn: 'Wisdom, wealth expansion, good children, spiritual growth, teaching ability, liver health, respect in society', gu: 'Wisdom, wealth expansion, good children, spiritual growth, teaching ability, liver health, respect in society' }, weak: { en: 'Financial losses, children\'s problems, liver/fat issues, bad advice from gurus, lack of faith, legal troubles', hi: 'आर्थिक हानि, सन्तान समस्या, यकृत/मोटापा, गलत गुरु, श्रद्धा की कमी, कानूनी परेशानी' } },
    { planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' }, strong: { en: 'Marital happiness, artistic talent, luxury, beauty, vehicles, strong reproductive health, charisma', hi: 'वैवाहिक सुख, कला प्रतिभा, विलासिता, सौन्दर्य, वाहन, प्रजनन स्वास्थ्य, आकर्षण', sa: 'वैवाहिक सुख, कला प्रतिभा, विलासिता, सौन्दर्य, वाहन, प्रजनन स्वास्थ्य, आकर्षण', mai: 'वैवाहिक सुख, कला प्रतिभा, विलासिता, सौन्दर्य, वाहन, प्रजनन स्वास्थ्य, आकर्षण', mr: 'वैवाहिक सुख, कला प्रतिभा, विलासिता, सौन्दर्य, वाहन, प्रजनन स्वास्थ्य, आकर्षण', ta: 'Marital happiness, artistic talent, luxury, beauty, vehicles, strong reproductive health, charisma', te: 'Marital happiness, artistic talent, luxury, beauty, vehicles, strong reproductive health, charisma', bn: 'Marital happiness, artistic talent, luxury, beauty, vehicles, strong reproductive health, charisma', kn: 'Marital happiness, artistic talent, luxury, beauty, vehicles, strong reproductive health, charisma', gu: 'Marital happiness, artistic talent, luxury, beauty, vehicles, strong reproductive health, charisma' }, weak: { en: 'Relationship failures, lack of refinement, reproductive issues, diabetes, kidney problems, no vehicles/comforts', hi: 'सम्बन्ध विफलता, परिष्कार की कमी, प्रजनन समस्या, मधुमेह, वृक्क रोग, सुख-सुविधा कम', sa: 'सम्बन्ध विफलता, परिष्कार की कमी, प्रजनन समस्या, मधुमेह, वृक्क रोग, सुख-सुविधा कम', mai: 'सम्बन्ध विफलता, परिष्कार की कमी, प्रजनन समस्या, मधुमेह, वृक्क रोग, सुख-सुविधा कम', mr: 'सम्बन्ध विफलता, परिष्कार की कमी, प्रजनन समस्या, मधुमेह, वृक्क रोग, सुख-सुविधा कम', ta: 'Relationship failures, lack of refinement, reproductive issues, diabetes, kidney problems, no vehicles/comforts', te: 'Relationship failures, lack of refinement, reproductive issues, diabetes, kidney problems, no vehicles/comforts', bn: 'Relationship failures, lack of refinement, reproductive issues, diabetes, kidney problems, no vehicles/comforts', kn: 'Relationship failures, lack of refinement, reproductive issues, diabetes, kidney problems, no vehicles/comforts', gu: 'Relationship failures, lack of refinement, reproductive issues, diabetes, kidney problems, no vehicles/comforts' } },
    { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', mai: 'शनि', mr: 'शनी', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, strong: { en: 'Discipline, longevity, wealth from masses, political power, mining/oil gains, servant loyalty, patience', hi: 'अनुशासन, दीर्घायु, जनता से धन, राजनीतिक शक्ति, खनन/तेल लाभ, सेवक निष्ठा, धैर्य', sa: 'अनुशासन, दीर्घायु, जनता से धन, राजनीतिक शक्ति, खनन/तेल लाभ, सेवक निष्ठा, धैर्य', mai: 'अनुशासन, दीर्घायु, जनता से धन, राजनीतिक शक्ति, खनन/तेल लाभ, सेवक निष्ठा, धैर्य', mr: 'अनुशासन, दीर्घायु, जनता से धन, राजनीतिक शक्ति, खनन/तेल लाभ, सेवक निष्ठा, धैर्य', ta: 'Discipline, longevity, wealth from masses, political power, mining/oil gains, servant loyalty, patience', te: 'Discipline, longevity, wealth from masses, political power, mining/oil gains, servant loyalty, patience', bn: 'Discipline, longevity, wealth from masses, political power, mining/oil gains, servant loyalty, patience', kn: 'Discipline, longevity, wealth from masses, political power, mining/oil gains, servant loyalty, patience', gu: 'Discipline, longevity, wealth from masses, political power, mining/oil gains, servant loyalty, patience' }, weak: { en: 'Chronic diseases, delays, poverty, legal problems, depression, bone/joint issues, loneliness, career setbacks', hi: 'दीर्घकालीन रोग, विलम्ब, दरिद्रता, कानूनी समस्या, अवसाद, हड्डी/जोड़ दर्द, अकेलापन', sa: 'दीर्घकालीन रोग, विलम्ब, दरिद्रता, कानूनी समस्या, अवसाद, हड्डी/जोड़ दर्द, अकेलापन', mai: 'दीर्घकालीन रोग, विलम्ब, दरिद्रता, कानूनी समस्या, अवसाद, हड्डी/जोड़ दर्द, अकेलापन', mr: 'दीर्घकालीन रोग, विलम्ब, दरिद्रता, कानूनी समस्या, अवसाद, हड्डी/जोड़ दर्द, अकेलापन', ta: 'Chronic diseases, delays, poverty, legal problems, depression, bone/joint issues, loneliness, career setbacks', te: 'Chronic diseases, delays, poverty, legal problems, depression, bone/joint issues, loneliness, career setbacks', bn: 'Chronic diseases, delays, poverty, legal problems, depression, bone/joint issues, loneliness, career setbacks', kn: 'Chronic diseases, delays, poverty, legal problems, depression, bone/joint issues, loneliness, career setbacks', gu: 'Chronic diseases, delays, poverty, legal problems, depression, bone/joint issues, loneliness, career setbacks' } },
  ],

  formulaTitle: { en: 'The Shadbala Ratio', hi: 'षड्बल अनुपात', sa: 'षड्बलानुपातः' },
  formulaDesc: {
    en: 'The most useful number for comparison is the Shadbala Ratio: actual Shadbala divided by required Shadbala. A ratio above 1.0 means the planet meets its threshold. The highest ratio planet is the chart\'s strongest performer. Example: if Jupiter has 450 Shashtiamshas and needs 390, its ratio is 450/390 = 1.15 — adequately strong. If Saturn has 250 and needs 300, its ratio is 0.83 — weak and in need of remedial support.',
    hi: 'तुलना के लिए सबसे उपयोगी संख्या षड्बल अनुपात है: वास्तविक षड्बल / आवश्यक षड्बल। 1.0 से ऊपर अनुपात = ग्रह सीमा पूरी करता है। उच्चतम अनुपात ग्रह = सबसे प्रबल प्रदर्शक। उदाहरण: गुरु 450 षष्ट्यंश, आवश्यक 390 → अनुपात 1.15 — पर्याप्त। शनि 250, आवश्यक 300 → 0.83 — दुर्बल।',
    sa: 'तुलनार्थं षड्बलानुपातः उपयोगितमः — वास्तविकषड्बलम् / आवश्यकषड्बलम्।',
  },

  linksTitle: { en: 'Continue Learning', hi: 'आगे पढ़ें', sa: 'अग्रे पठत' },
};

const COMPONENT_ICONS = [Zap, Compass, Clock, RotateCcw, Sun, Eye];
const COMPONENT_COLORS = ['text-amber-400', 'text-emerald-400', 'text-blue-400', 'text-violet-400', 'text-orange-400', 'text-cyan-400'];

const DIG_BALA_TABLE = [
  { planet: { en: 'Jupiter & Mercury', hi: 'गुरु व बुध', sa: 'गुरु व बुध', mai: 'गुरु व बुध', mr: 'गुरु व बुध', ta: 'வியாழன் & புதன்', te: 'గురువు & బుధుడు', bn: 'বৃহস্পতি ও বুধ', kn: 'ಗುರು ಮತ್ತು ಬುಧ', gu: 'ગુરુ અને બુધ' }, direction: { en: 'East (1st House)', hi: 'पूर्व (1ला भाव)', sa: 'पूर्व (1ला भाव)', mai: 'पूर्व (1ला भाव)', mr: 'पूर्व (1ला भाव)', ta: 'East (1st House)', te: 'East (1st House)', bn: 'East (1st House)', kn: 'East (1st House)', gu: 'East (1st House)' }, logic: { en: 'Wisdom rises with the dawn', hi: 'ज्ञान प्रातःकाल उदित होता है', sa: 'ज्ञान प्रातःकाल उदित होता है', mai: 'ज्ञान प्रातःकाल उदित होता है', mr: 'ज्ञान प्रातःकाल उदित होता है', ta: 'Wisdom rises with the dawn', te: 'Wisdom rises with the dawn', bn: 'Wisdom rises with the dawn', kn: 'Wisdom rises with the dawn', gu: 'Wisdom rises with the dawn' } },
  { planet: { en: 'Sun & Mars', hi: 'सूर्य व मंगल', sa: 'सूर्य व मंगल', mai: 'सूर्य व मंगल', mr: 'सूर्य व मंगल', ta: 'சூரியன் & செவ்வாய்', te: 'సూర్యుడు & కుజుడు', bn: 'সূর্য ও মঙ্গল', kn: 'ಸೂರ್ಯ ಮತ್ತು ಮಂಗಳ', gu: 'સૂર્ય અને મંગળ' }, direction: { en: 'South (10th House)', hi: 'दक्षिण (10वाँ भाव)', sa: 'दक्षिण (10वाँ भाव)', mai: 'दक्षिण (10वाँ भाव)', mr: 'दक्षिण (10वाँ भाव)', ta: 'South (10th House)', te: 'South (10th House)', bn: 'South (10th House)', kn: 'South (10th House)', gu: 'South (10th House)' }, logic: { en: 'Fire blazes at zenith', hi: 'अग्नि मध्याह्न में प्रज्वलित', sa: 'अग्नि मध्याह्न में प्रज्वलित', mai: 'अग्नि मध्याह्न में प्रज्वलित', mr: 'अग्नि मध्याह्न में प्रज्वलित', ta: 'Fire blazes at zenith', te: 'Fire blazes at zenith', bn: 'Fire blazes at zenith', kn: 'Fire blazes at zenith', gu: 'Fire blazes at zenith' } },
  { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', mai: 'शनि', mr: 'शनी', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, direction: { en: 'West (7th House)', hi: 'पश्चिम (7वाँ भाव)', sa: 'पश्चिम (7वाँ भाव)', mai: 'पश्चिम (7वाँ भाव)', mr: 'पश्चिम (7वाँ भाव)', ta: 'West (7th House)', te: 'West (7th House)', bn: 'West (7th House)', kn: 'West (7th House)', gu: 'West (7th House)' }, logic: { en: 'Endurance tested at sunset', hi: 'सूर्यास्त पर धैर्य की परीक्षा', sa: 'सूर्यास्त पर धैर्य की परीक्षा', mai: 'सूर्यास्त पर धैर्य की परीक्षा', mr: 'सूर्यास्त पर धैर्य की परीक्षा', ta: 'Endurance tested at sunset', te: 'Endurance tested at sunset', bn: 'Endurance tested at sunset', kn: 'Endurance tested at sunset', gu: 'Endurance tested at sunset' } },
  { planet: { en: 'Moon & Venus', hi: 'चन्द्र व शुक्र', sa: 'चन्द्र व शुक्र', mai: 'चन्द्र व शुक्र', mr: 'चन्द्र व शुक्र', ta: 'சந்திரன் & சுக்கிரன்', te: 'చంద్రుడు & శుక్రుడు', bn: 'চন্দ্র ও শুক্র', kn: 'ಚಂದ್ರ ಮತ್ತು ಶುಕ್ರ', gu: 'ચંદ્ર અને શુક્ર' }, direction: { en: 'North (4th House)', hi: 'उत्तर (4था भाव)', sa: 'उत्तर (4था भाव)', mai: 'उत्तर (4था भाव)', mr: 'उत्तर (4था भाव)', ta: 'North (4th House)', te: 'North (4th House)', bn: 'North (4th House)', kn: 'North (4th House)', gu: 'North (4th House)' }, logic: { en: 'Comfort rests at nadir', hi: 'सुख नादिर पर विश्राम करता है', sa: 'सुख नादिर पर विश्राम करता है', mai: 'सुख नादिर पर विश्राम करता है', mr: 'सुख नादिर पर विश्राम करता है', ta: 'Comfort rests at nadir', te: 'Comfort rests at nadir', bn: 'Comfort rests at nadir', kn: 'Comfort rests at nadir', gu: 'Comfort rests at nadir' } },
];

export default function LearnShadbalaPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const t = (obj: LocaleText | Record<string, string>) => tl(obj, locale);
  const tj = (key: string) => ltFn((LT as unknown as Record<string, LocaleText>)[key], locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedBala, setExpandedBala] = useState<number | null>(0);
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

  const balas = [
    { titleKey: 'sthanaTitle', descKey: 'sthanaDesc', icon: COMPONENT_ICONS[0], color: COMPONENT_COLORS[0] },
    { titleKey: 'digTitle', descKey: 'digDesc', icon: COMPONENT_ICONS[1], color: COMPONENT_COLORS[1] },
    { titleKey: 'kalaTitle', descKey: 'kalaDesc', icon: COMPONENT_ICONS[2], color: COMPONENT_COLORS[2] },
    { titleKey: 'cheshtaTitle', descKey: 'cheshtaDesc', icon: COMPONENT_ICONS[3], color: COMPONENT_COLORS[3] },
    { titleKey: 'naisargikaTitle', descKey: 'naisargikaDesc', icon: COMPONENT_ICONS[4], color: COMPONENT_COLORS[4] },
    { titleKey: 'drigTitle', descKey: 'drigDesc', icon: COMPONENT_ICONS[5], color: COMPONENT_COLORS[5] },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>{tj('title')}</h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">{tj('subtitle')}</p>
      </motion.div>

      {/* ═══ What is Shadbala ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{tj('whatTitle')}</h2>
        <p className="text-text-secondary leading-relaxed">{tj('whatP1')}</p>
        <p className="text-text-secondary leading-relaxed">{tj('whatP2')}</p>
        <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Total Shadbala = Sthana + Dig + Kala + Cheshta + Naisargika + Drig</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Unit: Shashtiamshas (1/60 Rupa) | 1 Rupa = 60 Shashtiamshas</p>
        </div>
      </motion.section>

      {/* ═══ The 6 Components ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{tj('sixTitle')}</h2>
        {balas.map((bala, i) => {
          const Icon = bala.icon;
          const isExpanded = expandedBala === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedBala(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${bala.color}`} />
                  <span className={`font-bold text-lg ${bala.color}`} style={headingFont}>{tj(bala.titleKey)}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-6 space-y-4 border-t border-gold-primary/10 pt-4">
                      <p className="text-text-secondary leading-relaxed">{tj(bala.descKey)}</p>

                      {/* Sthana sub-parts */}
                      {i === 0 && (
                        <div className="space-y-3">
                          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold">{tj('subParts')}</h4>
                          {L.sthanaSubParts.map((sub, j) => (
                            <div key={j} className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
                              <div className="text-gold-light font-bold text-sm mb-1">{t(sub.name)}</div>
                              <div className="text-text-secondary text-xs leading-relaxed">{t(sub.desc)}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Dig Bala table */}
                      {i === 1 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-gold-dark text-xs uppercase tracking-widest">
                                <th className="text-left py-2 px-3">{tj('planet')}</th>
                                <th className="text-left py-2 px-3">{tj('strongDirection')}</th>
                                <th className="text-left py-2 px-3">{tj('logic')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {DIG_BALA_TABLE.map((row, j) => (
                                <tr key={j} className="border-t border-gold-primary/8">
                                  <td className="py-2 px-3 text-gold-light font-medium">{t(row.planet)}</td>
                                  <td className="py-2 px-3 text-text-secondary">{t(row.direction)}</td>
                                  <td className="py-2 px-3 text-text-secondary/70 italic">{t(row.logic)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Naisargika values */}
                      {i === 4 && (
                        <div className="flex flex-wrap gap-3">
                          {L.naisargikaValues.map((nv, j) => (
                            <div key={j} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
                              <span className="text-gold-light font-bold text-sm">{t(nv.planet)}</span>
                              <span className="text-text-secondary text-xs">{nv.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ Minimum Thresholds ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{tj('thresholdTitle')}</h2>
        <p className="text-text-secondary text-sm leading-relaxed">{tj('thresholdDesc')}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/15">
                <th className="text-left py-3 px-4">{tj('planet')}</th>
                <th className="text-center py-3 px-4">{tj('minRupas')}</th>
                <th className="text-center py-3 px-4">{'Shashtiamshas'}</th>
                <th className="text-center py-3 px-4">{tj('difficulty')}</th>
              </tr>
            </thead>
            <tbody>
              {L.thresholds.map((th, i) => (
                <tr key={i} className="border-t border-gold-primary/8">
                  <td className="py-2 px-4 text-gold-light font-medium">{t(th.planet)}</td>
                  <td className="py-2 px-4 text-center text-text-secondary">{th.rupas}</td>
                  <td className="py-2 px-4 text-center text-text-secondary">{th.shashtiamshas}</td>
                  <td className="py-2 px-4 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${th.rupas >= 6.5 ? 'bg-red-500/10 text-red-400' : th.rupas >= 6 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {th.rupas >= 6.5 ? (tj('hard')) : th.rupas >= 6 ? (tj('medium')) : (tj('easier'))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══ Shadbala Ratio ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{tj('formulaTitle')}</h2>
        <p className="text-text-secondary leading-relaxed">{tj('formulaDesc')}</p>
        <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Shadbala Ratio = Actual Shadbala / Required Shadbala</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">&gt; 1.0 = Adequate | &gt; 1.5 = Strong | &gt; 2.0 = Exceptional | &lt; 1.0 = Weak</p>
        </div>
      </motion.section>

      {/* ═══ Reading Your Shadbala ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{tj('readingTitle')}</h2>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
          <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-emerald-400 font-bold text-sm mb-1">{tj('strongestPlanet')}</div>
            <p className="text-text-secondary text-sm leading-relaxed">{tj('readingP1')}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-amber-400 font-bold text-sm mb-1">{tj('weakestPlanet')}</div>
            <p className="text-text-secondary text-sm leading-relaxed">{tj('readingP2')}</p>
          </div>
        </div>
      </motion.section>

      {/* ═══ Practical Implications per Planet ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{tj('practicalTitle')}</h2>
        {L.planetEffects.map((pe) => {
          const isExp = expandedPlanet === pe.planet.en;
          return (
            <div key={pe.planet.en} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedPlanet(isExp ? null : pe.planet.en)}
                className="w-full flex items-center justify-between px-6 py-3 hover:bg-gold-primary/5 transition-colors">
                <span className="text-gold-light font-bold" style={headingFont}>{t(pe.planet)}</span>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isExp ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-5 space-y-3 border-t border-gold-primary/10 pt-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
                        <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-1">{tj('whenStrong')}</div>
                        <div className="text-text-secondary text-sm leading-relaxed">{t(pe.strong)}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
                        <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-1">{tj('whenWeak')}</div>
                        <div className="text-text-secondary text-sm leading-relaxed">{t(pe.weak)}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ Links ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{tj('linksTitle')}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं', sa: 'कुण्डली बनाएं', mai: 'कुण्डली बनाएं', mr: 'कुण्डली बनाएं', ta: 'குண்டலி உருவாக்கு', te: 'కుండలి తయారు చేయండి', bn: 'কুণ্ডলী তৈরি করুন', kn: 'ಕುಂಡಲಿ ರಚಿಸಿ', gu: 'કુંડળી બનાવો' } },
            { href: '/learn/modules/18-1', label: { en: 'Module 18-1: Shadbala Deep Dive', hi: 'मॉड्यूल 18-1: षड्बल विस्तार', sa: 'मॉड्यूल 18-1: षड्बल विस्तार', mai: 'मॉड्यूल 18-1: षड्बल विस्तार', mr: 'मॉड्यूल 18-1: षड्बल विस्तार', ta: 'தொகுதி 18-1: ஷட்பலம் ஆழ்ந்த ஆய்வு', te: 'మాడ్యూల్ 18-1: షడ్బల లోతైన అధ్యయనం', bn: 'মডিউল 18-1: ষড়বল গভীর অধ্যয়ন', kn: 'ಮಾಡ್ಯೂಲ್ 18-1: ಷಡ್ಬಲ ಆಳವಾದ ಅಧ್ಯಯನ', gu: 'મોડ્યુલ 18-1: ષડબલ ઊંડો અભ્યાસ' } },
            { href: '/learn/bhavabala', label: { en: 'Bhavabala (House Strength)', hi: 'भावबल (भाव शक्ति)', sa: 'भावबल (भाव शक्ति)', mai: 'भावबल (भाव शक्ति)', mr: 'भावबल (भाव शक्ति)', ta: 'பாவபலம் (வீட்டு வலிமை)', te: 'భావబలం (భావ శక్తి)', bn: 'ভাববল (ভাবের শক্তি)', kn: 'ಭಾವಬಲ (ಭಾವ ಶಕ್ತಿ)', gu: 'ભાવબળ (ભાવ શક્તિ)' } },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {t(link.label)} &rarr;
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
