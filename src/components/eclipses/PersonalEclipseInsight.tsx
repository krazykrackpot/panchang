'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Locale , LocaleText} from '@/types/panchang';
import type { PlanetPosition, DashaEntry } from '@/types/kundali';
import { useAuthStore } from '@/stores/auth-store';
import { useChartsStore } from '@/stores/charts-store';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

interface EclipseInfo {
  date: string;
  type: 'solar' | 'lunar';
  node: 'rahu' | 'ketu';
  eclipseLongitude: number; // sidereal longitude of the eclipse (Sun for solar, Moon for lunar)
}

interface KundaliData {
  ascendant: { sign: number };
  planets: PlanetPosition[];
  dashas: DashaEntry[];
}

interface PersonalInsight {
  dashAlert: string | null;       // Current dasha relevance
  natalContacts: string[];        // Planets within 3° of eclipse
  houseAffected: { house: number; meaning: string };
  nakshatraLink: string | null;   // Nakshatra lord = dasha lord match
  transitAspects: string[];       // Saturn/Jupiter/Mars aspecting eclipse degree
  overallIntensity: 'high' | 'moderate' | 'low';
}

const HOUSE_MEANINGS: Record<number, LocaleText> = {
  1:  { en: 'Self, health, personality, physical body', hi: 'स्व, स्वास्थ्य, व्यक्तित्व, शरीर', sa: 'आत्मा, स्वास्थ्यम्, व्यक्तित्वम्, शरीरम्', mai: 'अपन, स्वास्थ्य, व्यक्तित्व, शरीर', mr: 'स्वतः, आरोग्य, व्यक्तिमत्त्व, शरीर', ta: 'தான், ஆரோக்யம், ஆளுமை, உடல்', te: 'ఆత్మ, ఆరోగ్యం, వ్యక్తిత్వం, శరీరం', bn: 'আত্ম, স্বাস্থ্য, ব্যক্তিত্ব, শরীর', kn: 'ಆತ್ಮ, ಆರೋಗ್ಯ, ವ್ಯಕ್ತಿತ್ವ, ಶರೀರ', gu: 'સ્વ, સ્વાસ્થ્ય, વ્યક્તિત્વ, શરીર' },
  2:  { en: 'Wealth, family, speech, food habits', hi: 'धन, परिवार, वाणी, भोजन', sa: 'धनम्, कुटुम्बम्, वाक्, आहारः', mai: 'धन, परिवार, वाणी, भोजन', mr: 'धन, कुटुंब, वाणी, आहार', ta: 'செல்வம், குடும்பம், வாக்கு, உணவு', te: 'ధనం, కుటుంబం, వాక్కు, ఆహారం', bn: 'ধন, পরিবার, বাক্, আহার', kn: 'ಧನ, ಕುಟುಂಬ, ವಾಣಿ, ಆಹಾರ', gu: 'ધન, કુટુંબ, વાણી, ભોજન' },
  3:  { en: 'Courage, siblings, communication, short travels', hi: 'साहस, भाई-बहन, संवाद, लघु यात्रा', sa: 'शौर्यम्, सहोदराः, सम्भाषणम्, लघुयात्रा', mai: 'साहस, भाय-बहिन, संवाद, छोट यात्रा', mr: 'धाडस, भावंडे, संवाद, लहान प्रवास', ta: 'தைரியம், உடன்பிறப்புகள், தகவல், குறு பயணம்', te: 'ధైర్యం, తోబుట్టువులు, సంభాషణ, చిన్న ప్రయాణాలు', bn: 'সাহস, ভাইবোন, যোগাযোগ, ছোট ভ্রমণ', kn: 'ಧೈರ್ಯ, ಸೋದರರು, ಸಂವಹನ, ಸಣ್ಣ ಪ್ರಯಾಣ', gu: 'સાહસ, ભાઈ-બહેન, સંવાદ, ટૂંકી મુસાફરી' },
  4:  { en: 'Home, mother, emotional peace, property', hi: 'घर, माता, मानसिक शान्ति, सम्पत्ति', sa: 'गृहम्, माता, मानसिकशान्तिः, सम्पत्तिः', mai: 'घर, माय, मानसिक शान्ति, सम्पत्ति', mr: 'घर, आई, मानसिक शांती, मालमत्ता', ta: 'வீடு, தாய், மன அமைதி, சொத்து', te: 'ఇల్లు, తల్లి, మానసిక శాంతి, ఆస్తి', bn: 'গৃহ, মাতা, মানসিক শান্তি, সম্পত্তি', kn: 'ಮನೆ, ತಾಯಿ, ಮಾನಸಿಕ ಶಾಂತಿ, ಆಸ್ತಿ', gu: 'ઘર, માતા, માનસિક શાંતિ, સંપત્તિ' },
  5:  { en: 'Children, education, creativity, past-life merit', hi: 'सन्तान, शिक्षा, रचनात्मकता, पूर्व पुण्य', sa: 'सन्तानम्, शिक्षा, सृजनशीलता, पूर्वपुण्यम्', mai: 'सन्तान, शिक्षा, रचनात्मकता, पूर्वजन्म पुण्य', mr: 'संतती, शिक्षण, सर्जनशीलता, पूर्वपुण्य', ta: 'குழந்தைகள், கல்வி, படைப்பாற்றல், முற்பிறவி புண்ணியம்', te: 'సంతానం, విద్య, సృజనాత్మకత, పూర్వజన్మ పుణ్యం', bn: 'সন্তান, শিক্ষা, সৃজনশীলতা, পূর্বজন্ম পুণ্য', kn: 'ಮಕ್ಕಳು, ಶಿಕ್ಷಣ, ಸೃಜನಶೀಲತೆ, ಪೂರ್ವಪುಣ್ಯ', gu: 'સંતાન, શિક્ષા, સર્જનાત્મકતા, પૂર્વ પુણ્ય' },
  6:  { en: 'Enemies, disease, debts, daily work', hi: 'शत्रु, रोग, ऋण, दैनिक कार्य', sa: 'शत्रवः, रोगः, ऋणम्, दैनिककार्यम्', mai: 'शत्रु, रोग, ऋण, दैनिक कार्य', mr: 'शत्रू, रोग, कर्ज, दैनंदिन काम', ta: 'பகைவர், நோய், கடன், தினசரி வேலை', te: 'శత్రువులు, వ్యాధి, అప్పులు, నిత్య కార్యం', bn: 'শত্রু, রোগ, ঋণ, দৈনিক কর্ম', kn: 'ಶತ್ರುಗಳು, ರೋಗ, ಋಣ, ದೈನಿಕ ಕೆಲಸ', gu: 'શત્રુ, રોગ, ઋણ, દૈનિક કાર્ય' },
  7:  { en: 'Marriage, partnerships, business, public image', hi: 'विवाह, साझेदारी, व्यापार, सार्वजनिक छवि', sa: 'विवाहः, साझेदारी, वाणिज्यम्, लोकप्रतिष्ठा', mai: 'विवाह, साझेदारी, व्यापार, सार्वजनिक छवि', mr: 'विवाह, भागीदारी, व्यापार, सार्वजनिक प्रतिमा', ta: 'திருமணம், கூட்டாண்மை, வணிகம், பொது அங்கீகாரம்', te: 'వివాహం, భాగస్వామ్యం, వ్యాపారం, ప్రజా ప్రతిష్ఠ', bn: 'বিবাহ, অংশীদারিত্ব, ব্যবসা, জনমানস প্রতিমূর্তি', kn: 'ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ, ವ್ಯಾಪಾರ, ಸಾರ್ವಜನಿಕ ಚಿತ್ರಣ', gu: 'લગ્ન, ભાગીદારી, વ્યાપાર, જાહેર છબી' },
  8:  { en: 'Transformation, longevity, occult, sudden events', hi: 'परिवर्तन, आयु, गुप्त, अचानक घटनाएं', sa: 'रूपान्तरणम्, दीर्घायुः, गुप्तम्, आकस्मिकघटनाः', mai: 'परिवर्तन, आयु, गुप्त, अचानक घटना', mr: 'परिवर्तन, दीर्घायुष्य, गूढ, अचानक घटना', ta: 'மாற்றம், நீண்ட ஆயுள், மறைவான, திடீர் நிகழ்வுகள்', te: 'రూపాంతరం, దీర్ఘాయువు, గూఢం, ఆకస్మిక సంఘటనలు', bn: 'রূপান্তর, দীর্ঘায়ু, গোপন, আকস্মিক ঘটনা', kn: 'ರೂಪಾಂತರ, ದೀರ್ಘಾಯುಷ್ಯ, ಗೂಢ, ಆಕಸ್ಮಿಕ ಘಟನೆಗಳು', gu: 'પરિવર્તન, દીર્ઘ આયુષ્ય, ગૂઢ, અચાનક ઘટનાઓ' },
  9:  { en: 'Fortune, dharma, guru, father, long journeys', hi: 'भाग्य, धर्म, गुरु, पिता, लम्बी यात्रा', sa: 'भाग्यम्, धर्मः, गुरुः, पिता, दीर्घयात्रा', mai: 'भाग्य, धर्म, गुरु, पिता, लम्बा यात्रा', mr: 'भाग्य, धर्म, गुरू, पिता, दीर्घ प्रवास', ta: 'அதிர்ஷ்டம், தர்மம், குரு, தந்தை, நீண்ட பயணங்கள்', te: 'భాగ్యం, ధర్మం, గురువు, తండ్రి, దూర ప్రయాణాలు', bn: 'ভাগ্য, ধর্ম, গুরু, পিতা, দীর্ঘ যাত্রা', kn: 'ಭಾಗ್ಯ, ಧರ್ಮ, ಗುರು, ತಂದೆ, ದೀರ್ಘ ಪ್ರಯಾಣ', gu: 'ભાગ્ય, ધર્મ, ગુરુ, પિતા, લાંબી મુસાફરી' },
  10: { en: 'Career, reputation, authority, public status', hi: 'कैरियर, प्रतिष्ठा, अधिकार, सार्वजनिक स्थिति', sa: 'वृत्तिः, प्रतिष्ठा, अधिकारः, लोकस्थितिः', mai: 'कैरियर, प्रतिष्ठा, अधिकार, सार्वजनिक स्थिति', mr: 'करियर, प्रतिष्ठा, अधिकार, सार्वजनिक स्थान', ta: 'தொழில், புகழ், அதிகாரம், பொது நிலை', te: 'వృత్తి, ప్రతిష్ఠ, అధికారం, ప్రజా స్థితి', bn: 'কর্মজীবন, সুনাম, কর্তৃত্ব, সামাজিক মর্যাদা', kn: 'ವೃತ್ತಿ, ಖ್ಯಾತಿ, ಅಧಿಕಾರ, ಸಾರ್ವಜನಿಕ ಸ್ಥಾನ', gu: 'કારકિર્દી, પ્રતિષ્ઠા, અધિકાર, જાહેર સ્થાન' },
  11: { en: 'Gains, income, friendships, wish fulfillment', hi: 'लाभ, आय, मित्रता, इच्छापूर्ति', sa: 'लाभः, आयः, मित्रता, इच्छापूर्तिः', mai: 'लाभ, आय, मित्रता, इच्छापूर्ति', mr: 'लाभ, उत्पन्न, मैत्री, इच्छापूर्ती', ta: 'லாபம், வருமானம், நட்பு, விருப்ப நிறைவேற்றம்', te: 'లాభం, ఆదాయం, స్నేహం, కోరిక నెరవేర్పు', bn: 'লাভ, আয়, বন্ধুত্ব, ইচ্ছাপূর্তি', kn: 'ಲಾಭ, ಆದಾಯ, ಸ್ನೇಹ, ಇಚ್ಛಾಪೂರ್ತಿ', gu: 'લાભ, આવક, મિત્રતા, ઇચ્છાપૂર્તિ' },
  12: { en: 'Expenses, moksha, foreign lands, isolation', hi: 'व्यय, मोक्ष, विदेश, एकान्त', sa: 'व्ययः, मोक्षः, विदेशः, एकान्तम्', mai: 'व्यय, मोक्ष, विदेश, एकान्त', mr: 'खर्च, मोक्ष, परदेश, एकांत', ta: 'செலவு, மோட்சம், வெளிநாடு, தனிமை', te: 'ఖర్చు, మోక్షం, విదేశం, ఏకాంతం', bn: 'ব্যয়, মোক্ষ, বিদেশ, নির্জনতা', kn: 'ವ್ಯಯ, ಮೋಕ್ಷ, ವಿದೇಶ, ಏಕಾಂತ', gu: 'ખર્ચ, મોક્ષ, વિદેશ, એકાંત' },
};

const PLANET_NAMES: Record<number, LocaleText> = {
  0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' },
  1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', mai: 'चन्द्र', mr: 'चंद्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' },
  2: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', mai: 'मंगल', mr: 'मंगळ', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' },
  3: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', mai: 'बृहस्पति', mr: 'गुरू', ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' },
  5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' },
  6: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', mai: 'शनि', mr: 'शनी', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' },
  7: { en: 'Rahu', hi: 'राहु', sa: 'राहुः', mai: 'राहु', mr: 'राहू', ta: 'ராகு', te: 'రాహువు', bn: 'রাহু', kn: 'ರಾಹು', gu: 'રાહુ' },
  8: { en: 'Ketu', hi: 'केतु', sa: 'केतुः', mai: 'केतु', mr: 'केतू', ta: 'கேது', te: 'కేతువు', bn: 'কেতু', kn: 'ಕೇತು', gu: 'કેતુ' },
};

const CONTACT_EFFECTS: Record<number, LocaleText> = {
  0: { en: 'career/authority disruption, father\'s health', hi: 'कैरियर/अधिकार व्यवधान, पिता का स्वास्थ्य' },
  1: { en: 'emotional upheaval, mother\'s health, mental restlessness', hi: 'भावनात्मक उथल-पुथल, माता का स्वास्थ्य, मानसिक अशान्ति' },
  2: { en: 'energy conflicts, property disputes, sibling issues', hi: 'ऊर्जा संघर्ष, सम्पत्ति विवाद, भाई-बहन मुद्दे', sa: 'ऊर्जासंघर्षः, सम्पत्तिविवादः, सहोदरविषयाः', mai: 'ऊर्जा संघर्ष, सम्पत्ति विवाद, भाय-बहिन मामला', mr: 'ऊर्जा संघर्ष, मालमत्ता वाद, भावंडांचे प्रश्न', ta: 'சக்தி மோதல், சொத்து தகராறு, உடன்பிறப்பு பிரச்சினை', te: 'శక్తి సంఘర్షణ, ఆస్తి వివాదాలు, తోబుట్టువుల సమస్యలు', bn: 'শক্তি সংঘাত, সম্পত্তি বিরোধ, ভাইবোনের সমস্যা', kn: 'ಶಕ್ತಿ ಘರ್ಷಣೆ, ಆಸ್ತಿ ವಿವಾದ, ಸೋದರರ ಸಮಸ್ಯೆ', gu: 'ઊર્જા સંઘર્ષ, મિલકત વિવાદ, ભાઈ-બહેનના પ્રશ્નો' },
  3: { en: 'communication breakdown, business disruption, intellect shift', hi: 'संवाद विच्छेद, व्यापार व्यवधान, बुद्धि परिवर्तन', sa: 'सम्भाषणविच्छेदः, वाणिज्यव्यवधानम्, बुद्धिपरिवर्तनम्', mai: 'संवाद टूटनाय, व्यापार व्यवधान, बुद्धि परिवर्तन', mr: 'संवाद खंडित, व्यापार अडथळा, बुद्धी बदल', ta: 'தகவல் தடங்கல், வணிக இடையூறு, அறிவு மாற்றம்', te: 'సంభాషణ విచ్ఛేదం, వ్యాపార అంతరాయం, బుద్ధి మార్పు', bn: 'যোগাযোগ বিচ্ছেদ, ব্যবসা বাধা, বুদ্ধি পরিবর্তন', kn: 'ಸಂವಹನ ವಿಘ್ನ, ವ್ಯಾಪಾರ ಅಡಚಣೆ, ಬುದ್ಧಿ ಬದಲಾವಣೆ', gu: 'સંવાદ વિચ્છેદ, વ્યાપાર વિક્ષેપ, બુદ્ધિ પરિવર્તન' },
  4: { en: 'wisdom expansion or guru issues, children matters, education shift', hi: 'ज्ञान विस्तार या गुरु मुद्दे, सन्तान, शिक्षा परिवर्तन', sa: 'ज्ञानविस्तारः वा गुरुविषयाः, सन्तानविषयाः, शिक्षापरिवर्तनम्', mai: 'ज्ञान विस्तार या गुरु मामला, सन्तान, शिक्षा बदलाव', mr: 'ज्ञान विस्तार वा गुरू समस्या, संतती, शिक्षण बदल', ta: 'ஞான விரிவாக்கம் அல்லது குரு பிரச்சினை, குழந்தை விஷயம், கல்வி மாற்றம்', te: 'జ్ఞాన విస్తరణ లేదా గురు సమస్యలు, సంతాన విషయాలు, విద్యా మార్పు', bn: 'জ্ঞান বিস্তার বা গুরু সমস্যা, সন্তান বিষয়, শিক্ষা পরিবর্তন', kn: 'ಜ್ಞಾನ ವಿಸ್ತಾರ ಅಥವಾ ಗುರು ಸಮಸ್ಯೆ, ಮಕ್ಕಳ ವಿಷಯ, ಶಿಕ್ಷಣ ಬದಲಾವಣೆ', gu: 'જ્ઞાન વિસ્તાર અથવા ગુરુ સમસ્યા, સંતાન, શિક્ષા પરિવર્તન' },
  5: { en: 'relationship transformation, luxury/comfort changes, creative shift', hi: 'सम्बन्ध परिवर्तन, विलास/सुख परिवर्तन, रचनात्मक मोड़', sa: 'सम्बन्धरूपान्तरणम्, विलासपरिवर्तनम्, सृजनशीलतायाः मोड़ः', mai: 'सम्बन्ध परिवर्तन, विलास/सुख बदलाव, रचनात्मक मोड़', mr: 'नाते बदल, विलास/सुख बदल, सर्जनशील वळण', ta: 'உறவு மாற்றம், ஆடம்பர/வசதி மாற்றம், படைப்பாற்றல் திருப்பம்', te: 'సంబంధ రూపాంతరం, విలాస/సుఖ మార్పులు, సృజనాత్మక మలుపు', bn: 'সম্পর্কের রূপান্তর, বিলাস/সুখ পরিবর্তন, সৃজনশীল মোড়', kn: 'ಸಂಬಂಧ ರೂಪಾಂತರ, ವಿಲಾಸ/ಸುಖ ಬದಲಾವಣೆ, ಸೃಜನಶೀಲ ತಿರುವು', gu: 'સંબંધ પરિવર્તન, વૈભવ/સુખ ફેરફાર, સર્જનાત્મક વળાંક' },
  6: { en: 'structural collapse forcing rebuilding, discipline tested, chronic health', hi: 'ढाँचागत पतन जो पुनर्निर्माण बाध्य करे, अनुशासन परीक्षा, दीर्घकालिक स्वास्थ्य', sa: 'संरचनापतनं पुनर्निर्माणाय बाध्यकारि, अनुशासनपरीक्षा, दीर्घकालिकस्वास्थ्यम्', mai: 'ढाँचागत पतन जे पुनर्निर्माण बाध्य करय, अनुशासन परीक्षा, दीर्घकालिक स्वास्थ्य', mr: 'रचना कोसळणे व पुनर्बांधणी, शिस्त परीक्षा, दीर्घकालीन आरोग्य', ta: 'கட்டமைப்பு சரிவு மறுகட்டமைப்பை கட்டாயப்படுத்துதல், ஒழுக்கம் சோதனை, நீண்டகால உடல்நலம்', te: 'నిర్మాణ కుప్పకూలడం పునర్నిర్మాణం బలవంతం, క్రమశిక్షణ పరీక్ష, దీర్ఘకాలిక ఆరోగ్యం', bn: 'কাঠামো ভেঙে পুনর্নির্মাণ বাধ্য, শৃঙ্খলার পরীক্ষা, দীর্ঘমেয়াদী স্বাস্থ্য', kn: 'ರಚನೆ ಕುಸಿತ ಪುನರ್ನಿರ್ಮಾಣಕ್ಕೆ ಒತ್ತಾಯ, ಶಿಸ್ತು ಪರೀಕ್ಷೆ, ದೀರ್ಘಕಾಲಿಕ ಆರೋಗ್ಯ', gu: 'માળખાકીય પતન પુનર્નિર્માણ ફરજિયાત, શિસ્ત કસોટી, લાંબાગાળાનું સ્વાસ્થ્ય' },
  7: { en: 'obsessive new direction, foreign connection activated, desires amplified', hi: 'जुनूनी नई दिशा, विदेशी सम्बन्ध सक्रिय, इच्छाएं प्रबल', sa: 'आसक्तिपूर्णा नवदिशा, वैदेशिकसम्बन्धः सक्रियः, इच्छाः प्रबलाः', mai: 'जुनूनी नव दिशा, विदेशी सम्बन्ध सक्रिय, इच्छा प्रबल', mr: 'जुनूनी नवी दिशा, विदेशी संबंध सक्रिय, इच्छा प्रबळ', ta: 'வெறித்தனமான புதிய திசை, வெளிநாட்டு தொடர்பு செயல்படுதல், ஆசைகள் பெருகுதல்', te: 'మొండి కొత్త దిశ, విదేశ సంబంధం సక్రియం, కోరికలు తీవ్రం', bn: 'আবেশপূর্ণ নতুন দিশা, বিদেশী সংযোগ সক্রিয়, ইচ্ছা প্রবল', kn: 'ವ್ಯಾಮೋಹಿತ ಹೊಸ ದಿಕ್ಕು, ವಿದೇಶಿ ಸಂಪರ್ಕ ಸಕ್ರಿಯ, ಇಚ್ಛೆಗಳು ಪ್ರಬಲ', gu: 'જુનૂની નવી દિશા, વિદેશી સંબંધ સક્રિય, ઇચ્છાઓ પ્રબળ' },
  8: { en: 'past-life karmic acceleration, sudden spiritual detachment', hi: 'पूर्वजन्म कार्मिक त्वरण, अचानक आध्यात्मिक वैराग्य', sa: 'पूर्वजन्मकार्मिकत्वरणम्, आकस्मिकम् आध्यात्मिकवैराग्यम्', mai: 'पूर्वजन्म कार्मिक त्वरण, अचानक आध्यात्मिक वैराग्य', mr: 'पूर्वजन्म कार्मिक गती, अचानक आध्यात्मिक वैराग्य', ta: 'முற்பிறவி வினை துரிதம், திடீர் ஆன்மீக பற்றின்மை', te: 'పూర్వజన్మ కర్మ త్వరణం, ఆకస్మిక ఆధ్యాత్మిక వైరాగ్యం', bn: 'পূর্বজন্ম কর্মফল ত্বরণ, আকস্মিক আধ্যাত্মিক বৈরাগ্য', kn: 'ಪೂರ್ವಜನ್ಮ ಕರ್ಮ ತ್ವರಣ, ಆಕಸ್ಮಿಕ ಆಧ್ಯಾತ್ಮಿಕ ವೈರಾಗ್ಯ', gu: 'પૂર્વજન્મ કાર્મિક ત્વરણ, અચાનક આધ્યાત્મિક વૈરાગ્ય' },
};

function computePersonalInsight(eclipse: EclipseInfo, kundali: KundaliData, locale: Locale): PersonalInsight {
  const isHi = isDevanagariLocale(locale);
  const now = new Date();

  // 1. Which house does the eclipse fall in?
  const eclipseSign = Math.floor(eclipse.eclipseLongitude / 30) + 1;
  const ascSign = kundali.ascendant.sign;
  const house = ((eclipseSign - ascSign + 12) % 12) + 1;
  const houseMeaning = HOUSE_MEANINGS[house] || HOUSE_MEANINGS[1];

  // 2. Current Mahadasha + Antardasha
  const mahadashas = kundali.dashas.filter(d => d.level === 'maha');
  const currentMaha = mahadashas.find(d => new Date(d.startDate) <= now && new Date(d.endDate) >= now);
  const currentAntar = currentMaha?.subPeriods?.find(d => new Date(d.startDate) <= now && new Date(d.endDate) >= now);

  let dashAlert: string | null = null;
  if (currentMaha) {
    const mahaPlanet = currentMaha.planet.toLowerCase();
    const relevantPlanets = eclipse.type === 'solar'
      ? ['sun', 'ketu', 'rahu']
      : ['moon', 'ketu', 'rahu'];

    if (relevantPlanets.includes(mahaPlanet)) {
      const pName = isHi ? currentMaha.planetName.hi : currentMaha.planetName.en;
      dashAlert = isHi
        ? `⚠ आप ${pName} महादशा में हैं — यह ग्रहण आपके लिए अत्यन्त प्रभावशाली होगा!`
        : `⚠ You are in ${pName} Mahadasha — this eclipse will be especially powerful for you!`;
    } else if (currentAntar) {
      const antarPlanet = currentAntar.planet.toLowerCase();
      if (relevantPlanets.includes(antarPlanet)) {
        const pName = isHi ? currentAntar.planetName.hi : currentAntar.planetName.en;
        dashAlert = isHi
          ? `${pName} अन्तर्दशा चल रही है — इस ग्रहण का मध्यम प्रभाव अपेक्षित`
          : `${pName} Antardasha is active — moderate impact expected from this eclipse`;
      }
    }
  }

  // 3. Natal planet contacts (within 3° of eclipse degree)
  const natalContacts: string[] = [];
  for (const p of kundali.planets) {
    const diff = Math.abs(p.longitude - eclipse.eclipseLongitude);
    const minDiff = Math.min(diff, 360 - diff);
    if (minDiff < 3) {
      const pName = isHi ? PLANET_NAMES[p.planet.id]?.hi : PLANET_NAMES[p.planet.id]?.en;
      const effect = isHi ? CONTACT_EFFECTS[p.planet.id]?.hi : CONTACT_EFFECTS[p.planet.id]?.en;
      natalContacts.push(isHi
        ? `🎯 ग्रहण आपके जन्म ${pName} के ${minDiff.toFixed(1)}° भीतर — ${effect}`
        : `🎯 Eclipse within ${minDiff.toFixed(1)}° of your natal ${pName} — ${effect}`
      );
    }
  }

  // 4. Nakshatra lord match with dasha lord
  let nakshatraLink: string | null = null;
  if (currentMaha) {
    // Eclipse nakshatra from longitude
    const nakNum = Math.floor(eclipse.eclipseLongitude / (360 / 27)) + 1;
    // Nakshatra lords cycle: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury (repeat 3x)
    const NAK_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const nakLord = NAK_LORDS[(nakNum - 1) % 9];
    if (currentMaha.planet.toLowerCase() === nakLord.toLowerCase()) {
      nakshatraLink = isHi
        ? `⚡ ग्रहण नक्षत्र स्वामी (${nakLord}) = आपका महादशा स्वामी — अत्यन्त प्रबल प्रभाव!`
        : `⚡ Eclipse nakshatra lord (${nakLord}) = your Mahadasha lord — enormously amplified effect!`;
    }
  }

  // 5. Transit interactions — Saturn, Jupiter, Mars aspecting the eclipse degree
  // Vedic aspects: all planets aspect 7th (180°). Special: Mars 4th+8th, Jupiter 5th+9th, Saturn 3rd+10th
  const transitAspects: string[] = [];

  // Check if natal slow-moving planets (Saturn, Jupiter, Mars, Rahu, Ketu)
  // aspect the eclipse degree via Vedic drishti. These natal positions represent
  // the person's karmic blueprint — when an eclipse activates an aspected degree,
  // that planet's significations are triggered.
  const eclSignForAspect = Math.floor(eclipse.eclipseLongitude / 30) + 1;

  for (const p of kundali.planets) {
    const pSign = Math.floor(p.longitude / 30) + 1;
    const signDiff = ((eclSignForAspect - pSign + 12) % 12); // houses away

    // Check Vedic aspects
    let aspects = false;
    let aspectType = '';

    // All planets: 7th aspect (opposition)
    if (signDiff === 6) { aspects = true; aspectType = '7th aspect (opposition)'; }

    // Mars special: 4th and 8th
    if (p.planet.id === 2 && (signDiff === 3 || signDiff === 7)) {
      aspects = true;
      aspectType = signDiff === 3 ? '4th aspect' : '8th aspect';
    }

    // Jupiter special: 5th and 9th
    if (p.planet.id === 4 && (signDiff === 4 || signDiff === 8)) {
      aspects = true;
      aspectType = signDiff === 4 ? '5th aspect (trine)' : '9th aspect (trine)';
    }

    // Saturn special: 3rd and 10th
    if (p.planet.id === 6 && (signDiff === 2 || signDiff === 9)) {
      aspects = true;
      aspectType = signDiff === 2 ? '3rd aspect' : '10th aspect';
    }

    // Also check conjunction (same sign)
    if (signDiff === 0 && p.planet.id !== 0 && p.planet.id !== 1) {
      // Already caught by natal contacts if within 3°, but sign-level conjunction is worth noting
      const diff = Math.abs(p.longitude - eclipse.eclipseLongitude);
      const minDiff = Math.min(diff, 360 - diff);
      if (minDiff >= 3 && minDiff < 15) {
        aspects = true;
        aspectType = 'conjunction (same sign)';
      }
    }

    if (aspects && [2, 4, 6, 7, 8].includes(p.planet.id)) {
      const pName = isHi ? PLANET_NAMES[p.planet.id]?.hi : PLANET_NAMES[p.planet.id]?.en;

      // Detailed, plain-language implications based on planet + node + aspect
      let headline = '';
      let detail = '';

      if (p.planet.id === 6) { // Saturn
        if (eclipse.node === 'ketu') {
          headline = isHi ? 'शनि + केतु ग्रहण = अधिकतम कार्मिक दबाव' : 'Saturn + Ketu eclipse = maximum karmic pressure';
          detail = isHi
            ? 'आपके जन्म शनि की दृष्टि इस ग्रहण पर है। शनि अनुशासन, कठोर परिश्रम और कर्म-फल का ग्रह है। जब केतु (वैराग्य) के ग्रहण पर शनि दृष्टि डाले, तो जीवन के पुराने ढाँचे — कैरियर, सम्बन्ध, आदतें — टूट सकते हैं ताकि कुछ बेहतर बन सके। यह कठिन लगता है, पर यह शुद्धिकरण है। इस अवधि में बड़े निर्णय लेने से बचें — 6 माह बाद स्पष्टता आएगी।'
            : 'Your birth Saturn is casting its aspect on this eclipse point. Saturn is the planet of discipline, hard work, and karmic consequences. When Saturn aspects a Ketu eclipse, life\'s old structures — career arrangements, relationships, habits — may break down so something better can be built. This feels hard, but it\'s purification. Avoid major life decisions during this period — clarity comes 6 months later.';
        } else {
          headline = isHi ? 'शनि + राहु ग्रहण = दीर्घकालिक ढाँचागत परिवर्तन' : 'Saturn + Rahu eclipse = long-term structural change';
          detail = isHi
            ? 'शनि की दृष्टि इस राहु ग्रहण पर धैर्य की परीक्षा है। आपके जीवन में कोई व्यवस्था जो अब काम नहीं करती — कैरियर, वित्त, रहने की जगह — धीरे-धीरे बदलेगी। यह अचानक नहीं टूटता (जैसे केतु ग्रहण), बल्कि 1-2 वर्षों में धीमा परिवर्तन आता है। अनुशासन और व्यावहारिकता आपके सबसे बड़े सहयोगी हैं।'
            : 'Saturn\'s aspect on this Rahu eclipse is a test of patience. Some arrangement in your life that\'s no longer working — career, finances, living situation — will shift gradually. Unlike a Ketu eclipse (which breaks things suddenly), this is a slow 1-2 year restructuring. Discipline and practicality are your biggest allies.';
        }
      } else if (p.planet.id === 4) { // Jupiter
        if (eclipse.node === 'ketu') {
          headline = isHi ? 'बृहस्पति + केतु ग्रहण = आध्यात्मिक सफलता' : 'Jupiter + Ketu eclipse = spiritual breakthrough';
          detail = isHi
            ? 'बृहस्पति ज्ञान, गुरु और विस्तार का ग्रह है। जब बृहस्पति की दृष्टि केतु (मोक्ष) के ग्रहण पर पड़े, तो यह सबसे शुभ आध्यात्मिक संयोग है। किसी शिक्षक, पुस्तक, या अनुभव से गहन ज्ञान प्राप्त हो सकता है। ध्यान, तीर्थ यात्रा, या शास्त्र अध्ययन इस समय अत्यन्त फलदायी होंगे।'
            : 'Jupiter is the planet of wisdom, gurus, and expansion. When Jupiter aspects a Ketu (moksha) eclipse, it\'s one of the most auspicious spiritual combinations. You may receive profound wisdom from a teacher, book, or experience. Meditation, pilgrimage, or scripture study during this period will be extraordinarily fruitful.';
        } else {
          headline = isHi ? 'बृहस्पति + राहु ग्रहण = ज्ञान बनाम भ्रम' : 'Jupiter + Rahu eclipse = wisdom vs illusion';
          detail = isHi
            ? 'बृहस्पति ज्ञान चाहता है, राहु भ्रम फैलाता है। इस संयोग में बड़े-बड़े वादे और अवसर आ सकते हैं जो वास्तव में जितने दिखते हैं उतने अच्छे नहीं। विवेक से काम लें — हर चमकती चीज़ सोना नहीं। शिक्षा और धार्मिक मामलों में सावधानी बरतें।'
            : 'Jupiter wants wisdom, Rahu creates illusion. This combination may bring grand-sounding opportunities and promises that aren\'t as good as they appear. Use discernment — not everything that glitters is gold. Be cautious in educational and religious matters.';
        }
      } else if (p.planet.id === 2) { // Mars
        headline = isHi ? 'मंगल दृष्टि = अचानक ऊर्जा विस्फोट' : 'Mars aspect = sudden energy burst';
        detail = isHi
          ? 'मंगल साहस, ऊर्जा और कभी-कभी आक्रामकता का ग्रह है। जब मंगल की दृष्टि ग्रहण पर हो, तो अचानक कार्रवाई, टकराव, या निर्णय लेने का दबाव आ सकता है। ऊर्जा को सकारात्मक दिशा में लगाएं — व्यायाम, नए प्रोजेक्ट शुरू करना, या साहसिक कदम। क्रोध और आवेगपूर्ण निर्णयों से सावधान रहें।'
          : 'Mars is the planet of courage, energy, and sometimes aggression. When Mars aspects an eclipse, expect sudden pressure to act, confrontations, or forced decisions. Channel this energy positively — exercise, launch new projects, take bold steps. Be careful of anger and impulsive decisions.';
      } else if (p.planet.id === 7) { // Rahu
        headline = isHi ? 'राहु दृष्टि = इच्छाएं और जुनून तीव्र' : 'Rahu aspect = desires and obsessions intensify';
        detail = isHi
          ? 'आपके जन्म राहु की दृष्टि इस ग्रहण पर है। राहु अतृप्त इच्छा का ग्रह है — जो चीज़ आप सबसे ज़्यादा चाहते हैं, उसकी तीव्रता बढ़ेगी। यह समय बड़े वित्तीय निर्णय, नई साझेदारी, या जीवन-बदलने वाले कदमों के लिए अच्छा नहीं — भ्रम की सम्भावना अधिक है। 3-6 माह प्रतीक्षा करें।'
          : 'Your birth Rahu is casting its aspect on this eclipse. Rahu is the planet of insatiable desire — whatever you want most will feel more intense. This is NOT a good time for major financial decisions, new partnerships, or life-changing moves — the risk of illusion is high. Wait 3-6 months for clarity.';
      } else if (p.planet.id === 8) { // Ketu
        headline = isHi ? 'केतु दृष्टि = वैराग्य और आन्तरिक शुद्धि' : 'Ketu aspect = detachment and inner purification';
        detail = isHi
          ? 'आपके जन्म केतु की दृष्टि इस ग्रहण पर है। केतु आध्यात्मिक वैराग्य और पूर्वजन्म कर्म का ग्रह है। इस अवधि में आप ऐसी चीज़ों से अचानक उदासीन हो सकते हैं जो पहले बहुत महत्वपूर्ण लगती थीं — कैरियर, सम्पत्ति, सम्बन्ध। यह भयावह लग सकता है, पर यह आत्मा का शुद्धिकरण है। ध्यान और आत्मचिन्तन के लिए उत्तम समय।'
          : 'Your birth Ketu is casting its aspect on this eclipse. Ketu is the planet of spiritual detachment and past-life karma. During this period, you may suddenly become indifferent to things that previously felt very important — career ambitions, possessions, relationships. This can feel alarming, but it\'s the soul\'s purification process. Excellent time for meditation and self-reflection.';
      }

      transitAspects.push(isHi
        ? `🔥 ${headline}\n${detail}`
        : `🔥 ${headline}\n${detail}`
      );
    }
  }

  // 6. Overall intensity — now includes transit aspects
  const factors = (dashAlert ? 1 : 0) + natalContacts.length + (nakshatraLink ? 1 : 0) + transitAspects.length;
  const overallIntensity: PersonalInsight['overallIntensity'] =
    factors >= 3 ? 'high' : factors >= 1 ? 'moderate' : 'low';

  return {
    dashAlert,
    natalContacts,
    houseAffected: { house, meaning: isHi ? houseMeaning.hi || "" : houseMeaning.en },
    nakshatraLink,
    transitAspects,
    overallIntensity,
  };
}

export default function PersonalEclipseInsight({
  eclipseDate,
  eclipseType,
  eclipseNode,
  eclipseLongitude,
  locale,
}: {
  eclipseDate: string;
  eclipseType: 'solar' | 'lunar';
  eclipseNode: 'rahu' | 'ketu';
  eclipseLongitude: number;
  locale: Locale;
}) {
  const isHi = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);

  const { user } = useAuthStore();
  const { charts, fetchCharts } = useChartsStore();
  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Try sessionStorage first (fast, already computed from kundali page)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = sessionStorage.getItem('kundali_last_result');
      if (cached) {
        const { kundali: k } = JSON.parse(cached);
        if (k?.planets && k?.ascendant && k?.dashas) {
          setKundali(k as KundaliData);
          return;
        }
      }
    } catch { /* ignore */ }

    // 2. If logged in, fetch saved charts to find primary
    if (user?.id && charts.length === 0) {
      fetchCharts();
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. If we have a primary chart but no kundali, compute it via API
  useEffect(() => {
    if (kundali || loading) return;
    const primary = charts.find(c => c.is_primary) || charts[0];
    if (!primary?.birth_data) return;

    setLoading(true);
    const bd = primary.birth_data;
    fetch('/api/kundali', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: bd.date, time: bd.time,
        lat: bd.lat, lng: bd.lng,
        timezone: bd.timezone, ayanamsha: bd.ayanamsha || 'lahiri',
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data?.planets && data?.ascendant && data?.dashas) {
          setKundali(data as KundaliData);
          // Cache for other eclipses in same session
          try { sessionStorage.setItem('kundali_last_result', JSON.stringify({ kundali: data })); } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [charts, kundali, loading]);

  const insight = useMemo(() => {
    if (!kundali) return null;
    return computePersonalInsight(
      { date: eclipseDate, type: eclipseType, node: eclipseNode, eclipseLongitude },
      kundali,
      locale,
    );
  }, [kundali, eclipseDate, eclipseType, eclipseNode, eclipseLongitude, locale]);

  if (loading) {
    return (
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 p-4 text-center">
        <span className="text-text-secondary/50 text-xs">{isHi ? '🔮 आपकी कुण्डली लोड हो रही है...' : '🔮 Loading your chart...'}</span>
      </div>
    );
  }

  if (!kundali || !insight) return null;

  const intensityColor = insight.overallIntensity === 'high' ? 'text-red-400' : insight.overallIntensity === 'moderate' ? 'text-amber-400' : 'text-emerald-400';
  const intensityBorder = insight.overallIntensity === 'high' ? 'border-red-500/20' : insight.overallIntensity === 'moderate' ? 'border-amber-500/20' : 'border-emerald-500/20';
  const intensityLabel = {
    high: { en: 'HIGH IMPACT', hi: 'उच्च प्रभाव', sa: 'उच्च प्रभाव', mai: 'उच्च प्रभाव', mr: 'उच्च प्रभाव', ta: 'உயர் தாக்கம்', te: 'అధిక ప్రభావం', bn: 'উচ্চ প্রভাব', kn: 'ಹೆಚ್ಚಿನ ಪ್ರಭಾವ', gu: 'ઉચ્ચ પ્રભાવ' },
    moderate: { en: 'MODERATE IMPACT', hi: 'मध्यम प्रभाव', sa: 'मध्यम प्रभाव', mai: 'मध्यम प्रभाव', mr: 'मध्यम प्रभाव', ta: 'மிதமான தாக்கம்', te: 'మోస్తరు ప్రభావం', bn: 'মাঝারি প্রভাব', kn: 'ಮಧ್ಯಮ ಪ್ರಭಾವ', gu: 'મધ્યમ પ્રભાવ' },
    low: { en: 'LOW IMPACT', hi: 'न्यून प्रभाव', sa: 'न्यून प्रभाव', mai: 'न्यून प्रभाव', mr: 'न्यून प्रभाव', ta: 'குறைந்த தாக்கம்', te: 'తక్కువ ప్రభావం', bn: 'নিম্ন প্রভাব', kn: 'ಕಡಿಮೆ ಪ್ರಭಾವ', gu: 'ઓછો પ્રભાવ' },
  }[insight.overallIntensity];

  return (
    <div className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border ${intensityBorder} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
          {isHi ? '🔮 आपकी कुण्डली के लिए' : '🔮 For Your Chart'}
        </h4>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${intensityBorder} ${intensityColor}`}>
          {isHi ? intensityLabel.hi : intensityLabel.en}
        </span>
      </div>

      <div className="space-y-3 text-xs leading-relaxed" style={bodyFont}>
        {/* House affected */}
        <div className="flex items-start gap-2">
          <span className="text-gold-primary text-sm shrink-0">🏠</span>
          <div>
            <span className="text-gold-light font-semibold">
              {isHi ? `${insight.houseAffected.house}वाँ भाव प्रभावित` : `Falls in your ${insight.houseAffected.house}${ordinal(insight.houseAffected.house)} House`}
            </span>
            <span className="text-text-secondary/60"> — {insight.houseAffected.meaning}</span>
          </div>
        </div>

        {/* Dasha alert */}
        {insight.dashAlert && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
            <span className="text-red-400 text-sm shrink-0">⏰</span>
            <span className="text-red-300/90">{insight.dashAlert}</span>
          </div>
        )}

        {/* Natal contacts */}
        {insight.natalContacts.map((c, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <span className="text-amber-300/90">{c}</span>
          </div>
        ))}

        {/* Nakshatra link */}
        {insight.nakshatraLink && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/10">
            <span className="text-violet-300/90">{insight.nakshatraLink}</span>
          </div>
        )}

        {/* Transit aspects — natal Saturn/Jupiter/Mars/Rahu/Ketu aspecting eclipse */}
        {insight.transitAspects.map((t, i) => {
          const [headline, ...detailParts] = t.split('\n');
          const detail = detailParts.join(' ');
          return (
            <div key={i} className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 space-y-1.5">
              <div className="text-red-300/90 font-semibold text-xs">{headline}</div>
              {detail && <p className="text-text-secondary/70 text-xs leading-relaxed">{detail}</p>}
            </div>
          );
        })}

        {/* Low impact note */}
        {insight.overallIntensity === 'low' && !insight.dashAlert && insight.natalContacts.length === 0 && insight.transitAspects.length === 0 && (
          <p className="text-emerald-400/60 text-xs">
            {isHi
              ? '✓ इस ग्रहण का आपकी कुण्डली पर न्यूनतम प्रत्यक्ष प्रभाव — कोई ग्रह 3° के भीतर नहीं, कोई दृष्टि नहीं, सम्बन्धित दशा नहीं।'
              : '✓ Minimal direct impact on your chart — no planets within 3°, no aspects to eclipse, no relevant dasha active.'}
          </p>
        )}
      </div>
    </div>
  );
}

function ordinal(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}
