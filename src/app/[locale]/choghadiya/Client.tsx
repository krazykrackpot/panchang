'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Clock, Sun, Moon, MapPin, ArrowLeft, Sparkles } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import { nowMinutesInTimezone, todayInTimezone } from '@/lib/utils/now-in-timezone';
import { computeChoghadiya } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { useLocationStore } from '@/stores/location-store';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale, ChoghadiyaSlot } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// ─── City selector list ────────────────────────────────────────
const CITY_SLUGS = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'varanasi'] as const;
const SELECTOR_CITIES = CITY_SLUGS.map(s => CITIES.find(c => c.slug === s)!).filter(Boolean);

// Static default used for the initial render — must match the server's render to avoid
// hydration mismatches. Delhi is what getDefaultCityForLocale() returns for en/hi/sa.
// We update from the user's stored location in useEffect after mount.
const DEFAULT_CITY: CityData = CITIES.find(c => c.slug === 'delhi')!;

// ─── Nature color mapping ──────────────────────────────────────
const NATURE_STYLES: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  auspicious: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300',
    text: 'text-emerald-400',
  },
  inauspicious: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-300',
    text: 'text-red-400',
  },
  neutral: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300',
    text: 'text-amber-400',
  },
};

// ─── Labels ────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Choghadiya Today',
    dayChoghadiya: 'Day Choghadiya',
    nightChoghadiya: 'Night Choghadiya',
    auspicious: 'Auspicious',
    inauspicious: 'Inauspicious',
    neutral: 'Neutral',
    whatIs: 'What is Choghadiya?',
    whatIsText: 'Choghadiya (also written Chaughadia) is a traditional Vedic time-division system used to find auspicious and inauspicious time slots throughout the day and night. The word literally means "four ghatis"  –  each Choghadiya period spans approximately 4 ghatis (about 96 minutes). There are 8 day slots (sunrise to sunset) and 8 night slots (sunset to next sunrise), giving 16 periods in total.',
    typesTitle: '7 Types of Choghadiya Explained',
    types: 'Amrit|Most auspicious  –  ideal for all good works, especially starting new ventures|Shubh|Auspicious  –  good for marriage, religious ceremonies, and important decisions|Labh|Auspicious  –  excellent for business, trade, and financial transactions|Char|Neutral  –  suitable for travel and movement, but not for starting permanent works|Rog|Inauspicious  –  associated with illness; avoid medical procedures and new health regimens|Kaal|Inauspicious  –  ruled by Saturn; avoid important beginnings, especially financial|Udveg|Inauspicious  –  associated with anxiety; avoid travel, meetings with officials',
    bestTitle: 'Best Choghadiya for Travel & Business',
    bestText: 'For travel, the Char Choghadiya is traditionally recommended as its mobile nature supports journeys. For business and financial activities, Labh (gain) and Shubh (auspicious) are preferred. The Amrit Choghadiya is considered universally auspicious for all activities. Avoid starting any important work during Rog, Kaal, or Udveg periods.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का चौघड़िया',
    dayChoghadiya: 'दिन का चौघड़िया',
    nightChoghadiya: 'रात का चौघड़िया',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    neutral: 'सामान्य',
    whatIs: 'चौघड़िया क्या है?',
    whatIsText: 'चौघड़िया (चौघाड़िया) एक पारम्परिक वैदिक समय-विभाजन प्रणाली है जिसका उपयोग दिन और रात के शुभ-अशुभ समय खण्डों को जानने के लिए किया जाता है। इस शब्द का शाब्दिक अर्थ है "चार घटी"  –  प्रत्येक चौघड़िया अवधि लगभग 4 घटी (लगभग 96 मिनट) की होती है। सूर्योदय से सूर्यास्त तक 8 दिन के और सूर्यास्त से अगले सूर्योदय तक 8 रात के, कुल 16 खण्ड होते हैं।',
    typesTitle: 'चौघड़िया के 7 प्रकार',
    types: 'अमृत|सर्वाधिक शुभ  –  सभी अच्छे कार्यों, विशेषकर नए कार्य आरम्भ के लिए उत्तम|शुभ|शुभ  –  विवाह, धार्मिक अनुष्ठान और महत्वपूर्ण निर्णयों के लिए अच्छा|लाभ|शुभ  –  व्यापार, व्यापार और वित्तीय लेनदेन के लिए उत्कृष्ट|चर|सामान्य  –  यात्रा और गमन के लिए उपयुक्त, लेकिन स्थायी कार्य शुरू करने के लिए नहीं|रोग|अशुभ  –  रोग से सम्बन्धित; चिकित्सा प्रक्रिया और नए स्वास्थ्य कार्यक्रम से बचें|काल|अशुभ  –  शनि द्वारा शासित; महत्वपूर्ण आरम्भ, विशेषकर वित्तीय, से बचें|उद्वेग|अशुभ  –  चिंता से सम्बन्धित; यात्रा, अधिकारियों से मिलने से बचें',
    bestTitle: 'यात्रा और व्यापार के लिए सर्वश्रेष्ठ चौघड़िया',
    bestText: 'यात्रा के लिए चर चौघड़िया पारम्परिक रूप से अनुशंसित है। व्यापार और वित्तीय गतिविधियों के लिए लाभ और शुभ चौघड़िया उत्तम हैं। अमृत चौघड़िया सभी कार्यों के लिए सर्वव्यापी शुभ माना जाता है। रोग, काल या उद्वेग काल में कोई भी महत्वपूर्ण कार्य शुरू न करें।',
    seeAlso: 'यह भी देखें',
  },
  sa: {
    back: 'पञ्चाङ्गम्',
    title: 'अद्य चौघड़िया',
    dayChoghadiya: 'दिवसस्य चौघड़िया',
    nightChoghadiya: 'रात्रेः चौघड़िया',
    auspicious: 'शुभम्',
    inauspicious: 'अशुभम्',
    neutral: 'सामान्यम्',
    whatIs: 'चौघड़िया किम्?',
    whatIsText: 'चौघड़िया एका पारम्परिकवैदिककालविभाजनपद्धतिः अस्ति या दिवसरात्र्योः शुभाशुभकालखण्डान् ज्ञातुं प्रयुज्यते। अस्य शब्दस्य शाब्दिकार्थः "चतस्रः घट्यः" इति  –  प्रत्येकं चौघड़ियाकालखण्डं प्रायः ४ घटीनाम् (प्रायः ९६ निमेषाणाम्) भवति।',
    typesTitle: 'चौघड़ियायाः ७ प्रकाराः',
    types: 'अमृतम्|सर्वाधिकशुभम्  –  सर्वेषां शुभकार्याणां कृते उत्तमम्|शुभम्|शुभम्  –  विवाहधार्मिकानुष्ठानमहत्त्वपूर्णनिर्णयानां कृते|लाभः|शुभम्  –  व्यापारवित्तीयलेनदेनयोः कृते उत्कृष्टम्|चरम्|सामान्यम्  –  यात्रागमनयोः कृते उपयुक्तम्|रोगः|अशुभम्  –  रोगसम्बद्धम्|कालः|अशुभम्  –  शनिशासितम्|उद्वेगः|अशुभम्  –  चिन्तासम्बद्धम्',
    bestTitle: 'यात्राव्यापारयोः कृते श्रेष्ठचौघड़िया',
    bestText: 'यात्रायै चरचौघड़िया पारम्परिकरूपेण अनुशंसितम्। व्यापारवित्तीयकार्याणां कृते लाभशुभचौघड़ियौ उत्तमौ। अमृतचौघड़िया सर्वकार्याणां कृते सर्वव्यापीशुभम्। रोगकालोद्वेगकाले महत्त्वपूर्णं कार्यम् आरभेत् मा।',
    seeAlso: 'एतदपि पश्यतु',
  },
  // The 6 blocks below were translated by Gemini 2.5 Flash on Vertex AI
  // via scripts/translate-choghadiya-labels-via-gemini.py (84 strings).
  // _meta.review_status: pending-native-review until proofread.
  mai: {
    back: 'पंचांग',
    title: 'चौघड़िया आजु',
    dayChoghadiya: 'दिनक चौघड़िया',
    nightChoghadiya: 'रातिक चौघड़िया',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    neutral: 'सामान्य',
    whatIs: 'चौघड़िया की अछि?',
    whatIsText: 'चौघड़िया (चौघड़िया सेहो लिखल जाइत अछि) एकटा पारंपरिक वैदिक समय-विभाजन प्रणाली अछि जे दिन आ राति भरि शुभ आ अशुभ समय खंड सभकेँ खोजबा लेल उपयोग कएल जाइत अछि। ई शब्दक शाब्दिक अर्थ अछि "चारि घटी" — प्रत्येक चौघड़िया काल लगभग 4 घटी (लगभग 96 मिनट) धरि रहैत अछि। सूर्योदय सँ सूर्यास्त धरि 8 दिनक खंड आ सूर्यास्त सँ अगिला सूर्योदय धरि 8 रातिक खंड होइत अछि, जकर कुल 16 कालखंड होइत अछि।',
    typesTitle: 'चौघड़ियाक 7 प्रकारक व्याख्या',
    types: 'अमृत|सबसँ शुभ — सभटा नीक काज, खास कऽ नव उद्यम शुरू करबा लेल आदर्श|शुभ|शुभ — विवाह, धार्मिक अनुष्ठान आ महत्वपूर्ण निर्णय लेल नीक|लाभ|शुभ — व्यवसाय, व्यापार आ वित्तीय लेनदेन लेल उत्कृष्ट|चर|सामान्य — यात्रा आ आवागमन लेल उपयुक्त, मुदा स्थायी काज शुरू करबा लेल नहि|रोग|अशुभ — बीमारी सँ संबंधित; चिकित्सीय प्रक्रिया आ नव स्वास्थ्य व्यवस्था सँ बचू|काल|अशुभ — शनि द्वारा शासित; महत्वपूर्ण शुरुआत सँ बचू, खास कऽ वित्तीय|उद्वेग|अशुभ — चिंता सँ संबंधित; यात्रा, अधिकारी सभ सँ भेट सँ बचू',
    bestTitle: 'यात्रा आ व्यवसाय लेल सबसँ नीक चौघड़िया',
    bestText: 'यात्रा लेल, चर चौघड़िया पारंपरिक रूप सँ अनुशंसित अछि कारण एकर गतिशील प्रकृति यात्रा सभकेँ समर्थन करैत अछि। व्यवसाय आ वित्तीय गतिविधि सभ लेल, लाभ (लाभ) आ शुभ (शुभ) केँ प्राथमिकता देल जाइत अछि। अमृत चौघड़िया केँ सभटा गतिविधि सभ लेल सार्वभौमिक रूप सँ शुभ मानल जाइत अछि। रोग, काल, वा उद्वेग काल मे कोनो महत्वपूर्ण काज शुरू करबा सँ बचू।',
    seeAlso: 'ई सेहो देखू',
  },
  mr: {
    back: 'पंचांग',
    title: 'आजचे चोघडिया',
    dayChoghadiya: 'दिवसाचे चोघडिया',
    nightChoghadiya: 'रात्रीचे चोघडिया',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    neutral: 'सामान्य',
    whatIs: 'चोघडिया म्हणजे काय?',
    whatIsText: 'चोघडिया (चौघडिया असेही लिहिले जाते) ही एक पारंपारिक वैदिक काल-विभाजन प्रणाली आहे, जी दिवस आणि रात्रभरातील शुभ आणि अशुभ वेळ शोधण्यासाठी वापरली जाते. या शब्दाचा अर्थ "चार घटिका" असा होतो — प्रत्येक चोघडिया कालावधी अंदाजे ४ घटिका (सुमारे ९६ मिनिटे) असतो. सूर्यप्रकाशात (सूर्योदयापासून सूर्यास्तापर्यंत) ८ आणि रात्रीच्या वेळी (सूर्यास्तापासून पुढील सूर्योदयापर्यंत) ८ असे एकूण १६ चोघडिया कालावधी असतात.',
    typesTitle: 'चोघडियाचे ७ प्रकार आणि त्यांचे स्पष्टीकरण',
    types: 'अमृत|सर्वात शुभ — सर्व चांगल्या कामांसाठी, विशेषतः नवीन उपक्रम सुरू करण्यासाठी आदर्श|शुभ|शुभ — विवाह, धार्मिक विधी आणि महत्त्वाच्या निर्णयांसाठी चांगले|लाभ|शुभ — व्यवसाय, व्यापार आणि आर्थिक व्यवहारांसाठी उत्कृष्ट|चर|सामान्य — प्रवास आणि हालचालींसाठी योग्य, परंतु कायमस्वरूपी कामे सुरू करण्यासाठी नाही|रोग|अशुभ — आजाराशी संबंधित; वैद्यकीय प्रक्रिया आणि नवीन आरोग्य पद्धती टाळा|काल|अशुभ — शनी ग्रहाद्वारे शासित; महत्त्वाच्या सुरुवातीची कामे, विशेषतः आर्थिक कामे टाळा|उद्वेग|अशुभ — चिंतेशी संबंधित; प्रवास, अधिकाऱ्यांसोबतच्या भेटी टाळा',
    bestTitle: 'प्रवास आणि व्यवसायासाठी सर्वोत्तम चोघडिया',
    bestText: 'प्रवासासाठी, चर चोघडिया पारंपारिकपणे शिफारसीय आहे कारण त्याचा गतिशील स्वभाव प्रवासाला अनुकूल असतो. व्यवसाय आणि आर्थिक कामांसाठी, लाभ (फायदा) आणि शुभ (शुभ) चोघडियाला प्राधान्य दिले जाते. अमृत चोघडिया सर्व कामांसाठी सार्वत्रिकपणे शुभ मानले जाते. रोग, काल किंवा उद्वेग चोघडिया काळात कोणतेही महत्त्वाचे काम सुरू करणे टाळा.',
    seeAlso: 'हे देखील पहा',
  },
  te: {
    back: 'పంచాంగం',
    title: 'ఈరోజు చోఘడియా',
    dayChoghadiya: 'పగటి చోఘడియా',
    nightChoghadiya: 'రాత్రి చోఘడియా',
    auspicious: 'శుభ',
    inauspicious: 'అశుభ',
    neutral: 'మధ్యమం',
    whatIs: 'చోఘడియా అంటే ఏమిటి?',
    whatIsText: 'చోఘడియా (చౌఘడియా అని కూడా వ్రాయబడుతుంది) అనేది పగలు మరియు రాత్రి అంతటా శుభ మరియు అశుభ సమయాలను కనుగొనడానికి ఉపయోగించే ఒక సాంప్రదాయ వైదిక కాల విభజన వ్యవస్థ. ఈ పదం అక్షరాలా "నాలుగు ఘడియలు" అని అర్థం — ప్రతి చోఘడియా కాలం సుమారు 4 ఘడియలు (సుమారు 96 నిమిషాలు) ఉంటుంది. పగటిపూట 8 విభాగాలు (సూర్యోదయం నుండి సూర్యాస్తమయం వరకు) మరియు రాత్రిపూట 8 విభాగాలు (సూర్యాస్తమయం నుండి మరుసటి సూర్యోదయం వరకు) ఉంటాయి, మొత్తం 16 విభాగాలు.',
    typesTitle: 'చోఘడియా 7 రకాలు',
    types: 'అమృత|అత్యంత శుభప్రదం — అన్ని శుభ కార్యాలకు, ముఖ్యంగా కొత్త వ్యాపారాలు ప్రారంభించడానికి అనువైనది|శుభ|శుభప్రదం — వివాహాలు, మతపరమైన వేడుకలు మరియు ముఖ్యమైన నిర్ణయాలకు మంచిది|లాభ|శుభప్రదం — వ్యాపారం, వాణిజ్యం మరియు ఆర్థిక లావాదేవీలకు అద్భుతమైనది|చర|మధ్యమం — ప్రయాణం మరియు కదలికలకు అనుకూలం, కానీ శాశ్వత పనులను ప్రారంభించడానికి కాదు|రోగ|అశుభప్రదం — అనారోగ్యంతో సంబంధం కలిగి ఉంటుంది; వైద్య విధానాలు మరియు కొత్త ఆరోగ్య నియమాలను నివారించండి|కాల|అశుభప్రదం — శనిచే పాలించబడుతుంది; ముఖ్యమైన ప్రారంభాలను, ముఖ్యంగా ఆర్థిక సంబంధమైన వాటిని నివారించండి|ఉద్వేగ|అశుభప్రదం — ఆందోళనతో సంబంధం కలిగి ఉంటుంది; ప్రయాణం, అధికారులతో సమావేశాలను నివారించండి',
    bestTitle: 'ప్రయాణం & వ్యాపారం కోసం ఉత్తమ చోఘడియా',
    bestText: 'ప్రయాణానికి, చర చోఘడియా సాంప్రదాయకంగా సిఫార్సు చేయబడింది, ఎందుకంటే దాని చలన స్వభావం ప్రయాణాలకు మద్దతు ఇస్తుంది. వ్యాపారం మరియు ఆర్థిక కార్యకలాపాలకు, లాభ (లాభం) మరియు శుభ (శుభప్రదం) చోఘడియాలు ప్రాధాన్యతనిస్తాయి. అమృత చోఘడియా అన్ని కార్యకలాపాలకు సార్వత్రిక శుభప్రదంగా పరిగణించబడుతుంది. రోగ, కాల లేదా ఉద్వేగ కాలాలలో ఎటువంటి ముఖ్యమైన పనిని ప్రారంభించకుండా ఉండండి.',
    seeAlso: 'ఇవి కూడా చూడండి',
  },
  kn: {
    back: 'ಪಂಚಾಂಗ',
    title: 'ಇಂದಿನ ಚೋಘಡಿಯಾ',
    dayChoghadiya: 'ಹಗಲಿನ ಚೋಘಡಿಯಾ',
    nightChoghadiya: 'ರಾತ್ರಿಯ ಚೋಘಡಿಯಾ',
    auspicious: 'ಶುಭ',
    inauspicious: 'ಅಶುಭ',
    neutral: 'ಸಾಮಾನ್ಯ',
    whatIs: 'ಚೋಘಡಿಯಾ ಎಂದರೇನು?',
    whatIsText: 'ಚೋಘಡಿಯಾ (ಚೌಘಡಿಯಾ ಎಂದೂ ಬರೆಯಲಾಗುತ್ತದೆ) ಹಗಲು ಮತ್ತು ರಾತ್ರಿಯಾದ್ಯಂತ ಶುಭ ಮತ್ತು ಅಶುಭ ಸಮಯದ ಸ್ಲಾಟ್‌ಗಳನ್ನು ಕಂಡುಹಿಡಿಯಲು ಬಳಸುವ ಸಾಂಪ್ರದಾಯಿಕ ವೈದಿಕ ಸಮಯ ವಿಭಜನಾ ವ್ಯವಸ್ಥೆಯಾಗಿದೆ. ಈ ಪದವು ಅಕ್ಷರಶಃ \'ನಾಲ್ಕು ಘಟಿಗಳು\' ಎಂದರ್ಥ — ಪ್ರತಿ ಚೋಘಡಿಯಾ ಅವಧಿಯು ಸುಮಾರು 4 ಘಟಿಗಳಷ್ಟು (ಸುಮಾರು 96 ನಿಮಿಷಗಳು) ಇರುತ್ತದೆ. ಒಟ್ಟು 8 ಹಗಲಿನ ಸ್ಲಾಟ್‌ಗಳು (ಸೂರ್ಯೋದಯದಿಂದ ಸೂರ್ಯಾಸ್ತದವರೆಗೆ) ಮತ್ತು 8 ರಾತ್ರಿಯ ಸ್ಲಾಟ್‌ಗಳು (ಸೂರ್ಯಾಸ್ತದಿಂದ ಮುಂದಿನ ಸೂರ್ಯೋದಯದವರೆಗೆ) ಇವೆ, ಒಟ್ಟು 16 ಅವಧಿಗಳನ್ನು ನೀಡುತ್ತದೆ.',
    typesTitle: 'ಚೋಘಡಿಯಾದ 7 ವಿಧಗಳ ವಿವರಣೆ',
    types: 'ಅಮೃತ|ಅತ್ಯಂತ ಶುಭ — ಎಲ್ಲಾ ಶುಭ ಕಾರ್ಯಗಳಿಗೆ, ವಿಶೇಷವಾಗಿ ಹೊಸ ಉದ್ಯಮಗಳನ್ನು ಪ್ರಾರಂಭಿಸಲು ಸೂಕ್ತ|ಶುಭ|ಶುಭ — ವಿವಾಹ, ಧಾರ್ಮಿಕ ಸಮಾರಂಭಗಳು ಮತ್ತು ಪ್ರಮುಖ ನಿರ್ಧಾರಗಳಿಗೆ ಉತ್ತಮ|ಲಾಭ|ಶುಭ — ವ್ಯಾಪಾರ, ವಹಿವಾಟು ಮತ್ತು ಆರ್ಥಿಕ ವ್ಯವಹಾರಗಳಿಗೆ ಅತ್ಯುತ್ತಮ|ಚರ|ಸಾಮಾನ್ಯ — ಪ್ರಯಾಣ ಮತ್ತು ಚಲನೆಗೆ ಸೂಕ್ತ, ಆದರೆ ಶಾಶ್ವತ ಕಾರ್ಯಗಳನ್ನು ಪ್ರಾರಂಭಿಸಲು ಅಲ್ಲ|ರೋಗ|ಅಶುಭ — ಅನಾರೋಗ್ಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ; ವೈದ್ಯಕೀಯ ಕಾರ್ಯವಿಧಾನಗಳು ಮತ್ತು ಹೊಸ ಆರೋಗ್ಯ ಪದ್ಧತಿಗಳನ್ನು ತಪ್ಪಿಸಿ|ಕಾಲ|ಅಶುಭ — ಶನಿಯಿಂದ ಆಳಲ್ಪಡುತ್ತದೆ; ಪ್ರಮುಖ ಆರಂಭಗಳನ್ನು, ವಿಶೇಷವಾಗಿ ಆರ್ಥಿಕ ವಿಷಯಗಳನ್ನು ತಪ್ಪಿಸಿ|ಉದ್ವೇಗ|ಅಶುಭ — ಆತಂಕಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ; ಪ್ರಯಾಣ, ಅಧಿಕಾರಿಗಳೊಂದಿಗಿನ ಸಭೆಗಳನ್ನು ತಪ್ಪಿಸಿ',
    bestTitle: 'ಪ್ರಯಾಣ ಮತ್ತು ವ್ಯಾಪಾರಕ್ಕೆ ಉತ್ತಮ ಚೋಘಡಿಯಾ',
    bestText: 'ಪ್ರಯಾಣಕ್ಕಾಗಿ, ಚರ ಚೋಘಡಿಯಾವನ್ನು ಸಾಂಪ್ರದಾಯಿಕವಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗುತ್ತದೆ, ಏಕೆಂದರೆ ಅದರ ಚಲನಶೀಲ ಸ್ವಭಾವವು ಪ್ರಯಾಣಗಳಿಗೆ ಬೆಂಬಲ ನೀಡುತ್ತದೆ. ವ್ಯಾಪಾರ ಮತ್ತು ಆರ್ಥಿಕ ಚಟುವಟಿಕೆಗಳಿಗಾಗಿ, ಲಾಭ (ಗಳಿಕೆ) ಮತ್ತು ಶುಭ (ಶುಭಕರ) ಚೋಘಡಿಯಾಗಳು ಆದ್ಯತೆಯನ್ನು ಪಡೆಯುತ್ತವೆ. ಅಮೃತ ಚೋಘಡಿಯಾವನ್ನು ಎಲ್ಲಾ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸಾರ್ವತ್ರಿಕವಾಗಿ ಶುಭವೆಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ. ರೋಗ, ಕಾಲ ಅಥವಾ ಉದ್ವೇಗ ಅವಧಿಗಳಲ್ಲಿ ಯಾವುದೇ ಪ್ರಮುಖ ಕೆಲಸವನ್ನು ಪ್ರಾರಂಭಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ.',
    seeAlso: 'ಇದನ್ನೂ ನೋಡಿ',
  },
  gu: {
    back: 'પંચાંગ',
    title: 'ચોઘડિયા આજે',
    dayChoghadiya: 'દિવસના ચોઘડિયા',
    nightChoghadiya: 'રાત્રિના ચોઘડિયા',
    auspicious: 'શુભ',
    inauspicious: 'અશુભ',
    neutral: 'સામાન્ય',
    whatIs: 'ચોઘડિયા શું છે?',
    whatIsText: 'ચોઘડિયા (ચૌઘડિયા પણ લખાય છે) એક પરંપરાગત વૈદિક સમય-વિભાજન પ્રણાલી છે જેનો ઉપયોગ દિવસ અને રાત્રિ દરમિયાન શુભ અને અશુભ સમયગાળો શોધવા માટે થાય છે. આ શબ્દનો શાબ્દિક અર્થ "ચાર ઘડી" થાય છે — દરેક ચોઘડિયાનો સમયગાળો આશરે 4 ઘડી (લગભગ 96 મિનિટ) હોય છે. સૂર્યોદયથી સૂર્યાસ્ત સુધી દિવસના 8 અને સૂર્યાસ્તથી બીજા દિવસના સૂર્યોદય સુધી રાત્રિના 8 ચોઘડિયા હોય છે, આમ કુલ 16 સમયગાળા હોય છે.',
    typesTitle: 'ચોઘડિયાના 7 પ્રકારની સમજૂતી',
    types: 'અમૃત|સૌથી શુભ — બધા સારા કાર્યો માટે આદર્શ, ખાસ કરીને નવા સાહસો શરૂ કરવા માટે|શુભ|શુભ — લગ્ન, ધાર્મિક વિધિઓ અને મહત્વપૂર્ણ નિર્ણયો માટે સારું|લાભ|શુભ — વ્યવસાય, વેપાર અને નાણાકીય વ્યવહારો માટે ઉત્તમ|ચર|સામાન્ય — મુસાફરી અને હેરફેર માટે યોગ્ય, પરંતુ કાયમી કાર્યો શરૂ કરવા માટે નહીં|રોગ|અશુભ — બીમારી સાથે સંકળાયેલ; તબીબી પ્રક્રિયાઓ અને નવા સ્વાસ્થ્ય નિયમો ટાળો|કાળ|અશુભ — શનિ દ્વારા શાસિત; મહત્વપૂર્ણ શરૂઆત ટાળો, ખાસ કરીને નાણાકીય|ઉદ્વેગ|અશુભ — ચિંતા સાથે સંકળાયેલ; મુસાફરી, અધિકારીઓ સાથેની મુલાકાતો ટાળો',
    bestTitle: 'મુસાફરી અને વ્યવસાય માટે શ્રેષ્ઠ ચોઘડિયા',
    bestText: 'મુસાફરી માટે, ચર ચોઘડિયા પરંપરાગત રીતે ભલામણ કરવામાં આવે છે કારણ કે તેનો ગતિશીલ સ્વભાવ યાત્રાઓને ટેકો આપે છે. વ્યવસાય અને નાણાકીય પ્રવૃત્તિઓ માટે, લાભ અને શુભ ચોઘડિયા પસંદ કરવામાં આવે છે. અમૃત ચોઘડિયાને તમામ પ્રવૃત્તિઓ માટે સાર્વત્રિક રીતે શુભ માનવામાં આવે છે. રોગ, કાળ અથવા ઉદ્વેગના સમયગાળા દરમિયાન કોઈપણ મહત્વપૂર્ણ કાર્ય શરૂ કરવાનું ટાળો.',
    seeAlso: 'આ પણ જુઓ',
  },
  bn: {
    back: 'পঞ্জিকা',
    title: 'আজকের চোগাড়িয়া',
    dayChoghadiya: 'দিনের চোগাড়িয়া',
    nightChoghadiya: 'রাতের চোগাড়িয়া',
    auspicious: 'শুভ',
    inauspicious: 'অশুভ',
    neutral: 'সাধারণ',
    whatIs: 'চোগাড়িয়া কী?',
    whatIsText: 'চোগাড়িয়া (চৌঘড়িয়া নামেও লেখা হয়) হল একটি ঐতিহ্যবাহী বৈদিক সময়-বিভাজন পদ্ধতি যা দিন ও রাতের শুভ ও অশুভ সময়কাল খুঁজে বের করতে ব্যবহৃত হয়। শব্দটির আক্ষরিক অর্থ হল "চার ঘটি" — প্রতিটি চোগাড়িয়া সময়কাল প্রায় ৪ ঘটি (প্রায় ৯৬ মিনিট) জুড়ে থাকে। সূর্যোদয় থেকে সূর্যাস্ত পর্যন্ত দিনের ৮টি এবং সূর্যাস্ত থেকে পরের সূর্যোদয় পর্যন্ত রাতের ৮টি সময়কাল থাকে, যা মোট ১৬টি সময়কাল।',
    typesTitle: '৭ প্রকার চোগাড়িয়া ব্যাখ্যা',
    types: 'অমৃত|সর্বোচ্চ শুভ — সমস্ত শুভ কাজ, বিশেষ করে নতুন উদ্যোগ শুরু করার জন্য আদর্শ|শুভ|শুভ — বিবাহ, ধর্মীয় অনুষ্ঠান এবং গুরুত্বপূর্ণ সিদ্ধান্তের জন্য ভালো|লাভ|শুভ — ব্যবসা, বাণিজ্য এবং আর্থিক লেনদেনের জন্য চমৎকার|চর|সাধারণ — ভ্রমণ এবং চলাচলের জন্য উপযুক্ত, তবে স্থায়ী কাজ শুরু করার জন্য নয়|রোগ|অশুভ — অসুস্থতার সাথে সম্পর্কিত; চিকিৎসা পদ্ধতি এবং নতুন স্বাস্থ্য ব্যবস্থা এড়িয়ে চলুন|কাল|অশুভ — শনি দ্বারা শাসিত; গুরুত্বপূর্ণ শুরু, বিশেষ করে আর্থিক বিষয় এড়িয়ে চলুন|উদ্বেগ|অশুভ — উদ্বেগের সাথে সম্পর্কিত; ভ্রমণ, কর্মকর্তাদের সাথে দেখা করা এড়িয়ে চলুন',
    bestTitle: 'ভ্রমণ ও ব্যবসার জন্য সেরা চোগাড়িয়া',
    bestText: 'ভ্রমণের জন্য, চর চোগাড়িয়া ঐতিহ্যগতভাবে সুপারিশ করা হয় কারণ এর গতিশীল প্রকৃতি যাত্রাকে সমর্থন করে। ব্যবসা এবং আর্থিক কার্যকলাপের জন্য, লাভ (অর্জন) এবং শুভ (শুভ) চোগাড়িয়া পছন্দনীয়। অমৃত চোগাড়িয়া সমস্ত কার্যকলাপের জন্য সর্বজনীনভাবে শুভ বলে বিবেচিত হয়। রোগ, কাল বা উদ্বেগ সময়কালে কোনো গুরুত্বপূর্ণ কাজ শুরু করা এড়িয়ে চলুন।',
    seeAlso: 'আরও দেখুন',
  },
};

// ─── Helpers ──────────────────────────────────────────────────
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// ─── Animation variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const },
  }),
};

export default function ChoghadiyaClient() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;

  // CLAUDE.md Lesson ZD — defer all rendering until after hydration.
  // The index `/choghadiya` page mounts this component below an
  // already-server-rendered SEO block (day/night tables, education).
  // This component's own rendering depends on selectedCity (which
  // hydrates from useLocationStore localStorage), `nowMin` (60s tick),
  // and date formatting (Intl ICU which can vary between Node and
  // browser). Any of these caused subtle SSR vs first-render
  // mismatches → React #418 → entire React tree died post-hydration →
  // analytics page-view events stopped firing site-wide (the 81%
  // analytics drop on 2026-05-28). Render nothing during SSR and the
  // first client render; the SEO block above this component carries
  // all crawler-visible content.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  // Static default keeps server and client initial renders identical (no hydration mismatch).
  // After mount we update from the user's stored location if available.
  const [selectedCity, setSelectedCity] = useState<CityData>(DEFAULT_CITY);

  useEffect(() => {
    const store = useLocationStore.getState();
    if (store.lat !== null && store.lng !== null) {
      setSelectedCity({
        slug: 'current',
        // URL params take priority over cached state — none here, so store wins
        name: { en: store.name || 'Current Location', hi: store.name || 'वर्तमान स्थान', sa: store.name || 'वर्तमानस्थानम्' },
        lat: store.lat,
        lng: store.lng,
        timezone: store.timezone || 'UTC',
      });
    } else {
      const localeCity = getDefaultCityForLocale(locale);
      if (localeCity) setSelectedCity(localeCity);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track current time in the LOCATION's timezone for NOW highlighting.
  // Init null so SSR + first client render produce identical HTML (no
  // NOW badge yet). The badge appears post-hydration via useEffect.
  const [nowMin, setNowMin] = useState<number | null>(null);
  useEffect(() => {
    setNowMin(nowMinutesInTimezone(selectedCity.timezone));
    const iv = setInterval(() => setNowMin(nowMinutesInTimezone(selectedCity.timezone)), 60_000);
    return () => clearInterval(iv);
  }, [selectedCity.timezone]);

  // React still evaluates the WHOLE function body (including all
  // useMemos) during SSR + the first client render — the
  // `if (!hydrated) return null` guard at the bottom only stops the
  // *render output*, not hook execution. So we still need the gates
  // below to avoid burning cycles before the user-visible mount.
  // (Original guard rationale: Gemini #273 HIGH, 2026-05-28T17:09Z.)
  const [year, month, day] = hydrated
    ? todayInTimezone(selectedCity.timezone).split('-').map(Number)
    : [1970, 1, 1];

  // Sunrise/sunset via /api/sunrise (server-side sweph) — same
  // architecture as gauri-panchang and hora. Avoids the in-browser
  // Meeus fallback that drifts ~30s from server Swiss output and used
  // to render slot end-times 1 minute off vs the SEO table above this
  // island (PR #425 follow-up). `null` is the polar non-rise signal;
  // banner only, no fabricated 6 AM fallback.
  type SunData = { sunriseUT: number; sunsetUT: number } | null;
  const [sunData, setSunData] = useState<SunData>(null);
  const [sunError, setSunError] = useState<string | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const url =
      `/api/sunrise?date=${date}` +
      `&lat=${selectedCity.lat}&lng=${selectedCity.lng}` +
      `&timezone=${encodeURIComponent(selectedCity.timezone)}`;
    setSunError(null);
    fetch(url)
      .then(r => r.json())
      .then(body => {
        if (cancelled) return;
        if (typeof body.sunriseUT !== 'number' || typeof body.sunsetUT !== 'number') {
          setSunData(null);
          setSunError('Sunrise/sunset unavailable for this location and date.');
          return;
        }
        // /api/sunrise returns sunriseUT in [0, 24) without unwrapping the
        // UT day boundary, so east-of-UTC zones (IST, etc.) get a
        // sunriseUT like 23.88 for the previous UT day with sunsetUT
        // 13.77 for the current UT day. The downstream slot generator
        // computes `dayDuration = sunsetUT - sunriseUT` and needs that
        // to be positive — without this unwrap, the day slots run
        // backwards (sunriseUT - i * |dayDuration|/8). Mirrors the same
        // fix-up done inside computePanchang at panchang-calc.ts:1129.
        const sunriseUT = body.sunriseUT;
        let sunsetUT = body.sunsetUT;
        if (sunsetUT < sunriseUT) sunsetUT += 24;
        setSunData({ sunriseUT, sunsetUT });
      })
      .catch((err: unknown) => {
        console.error('[choghadiya] /api/sunrise failed:', err);
        if (!cancelled) setSunError('Could not fetch sunrise/sunset.');
      });
    return () => { cancelled = true; };
  }, [hydrated, year, month, day, selectedCity.lat, selectedCity.lng, selectedCity.timezone]);

  const panchang = useMemo(() => {
    if (!hydrated || !sunData) return { choghadiya: [] as ChoghadiyaSlot[] };
    const tzOffset = getUTCOffsetForDate(year, month, day, selectedCity.timezone);
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    return { choghadiya: computeChoghadiya(sunData.sunriseUT, sunData.sunsetUT, weekday, tzOffset) };
  }, [hydrated, sunData, year, month, day, selectedCity.timezone]);

  // Date formatting
  const dateStr = useMemo(() => {
    const d = new Date(year, month - 1, day);
    const LOCALE_MAP: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN' };
    const loc = LOCALE_MAP[locale] || 'en-IN';
    return d.toLocaleDateString(loc, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [year, month, day, locale]);

  const slots = panchang.choghadiya || [];
  const daySlots = slots.filter((s: ChoghadiyaSlot) => s.period === 'day');
  const nightSlots = slots.filter((s: ChoghadiyaSlot) => s.period === 'night');

  const natureLabel = (nature: string) => {
    if (nature === 'auspicious') return L.auspicious;
    if (nature === 'inauspicious') return L.inauspicious;
    return L.neutral;
  };

  // Parse the types explanation
  const typeEntries = useMemo(() => {
    const parts = L.types.split('|');
    const result: { name: string; desc: string }[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      result.push({ name: parts[i], desc: parts[i + 1] || '' });
    }
    return result;
  }, [L.types]);

  const renderSlotCard = (slot: ChoghadiyaSlot, i: number) => {
    const style = NATURE_STYLES[slot.nature] || NATURE_STYLES.neutral;
    const startMin = timeToMinutes(slot.startTime);
    const endMin = timeToMinutes(slot.endTime);
    // Midnight-wrapping comparison (Lesson R). nowMin is null during
    // SSR/first render — no slot is "active" until the client clock tick.
    const isActive = nowMin !== null && (endMin < startMin
      ? nowMin >= startMin || nowMin < endMin
      : nowMin >= startMin && nowMin < endMin);
    return (
      <motion.div
        key={`${slot.period}-${i}`}
        custom={i}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className={`rounded-xl border p-4 ${style.bg} ${style.border} ${isActive ? 'ring-2 ring-gold-primary/60' : ''}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold ${style.text}`} style={headingFont}>
            {tl(slot.name, locale)}
          </h3>
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/30 text-gold-light font-bold animate-pulse" suppressHydrationWarning>
                NOW
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>
              {natureLabel(slot.nature)}
            </span>
          </div>
        </div>
        <p className="text-lg font-bold text-text-primary tracking-wide">
          {slot.startTime}  –  {slot.endTime}
        </p>
      </motion.div>
    );
  };

  // Defer all rendering until after hydration (Lesson ZD — see above).
  if (!hydrated) return null;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/choghadiya', locale)) }}
        />

        {/* Back link */}
        <Link
          href="/panchang"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          {L.back}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-gold-light mb-2"
            style={headingFont}
          >
            {L.title}
          </h2>
          <p className="text-text-secondary text-lg">{dateStr}</p>
          <p className="text-text-secondary flex items-center gap-1.5 mt-1" suppressHydrationWarning>
            <MapPin size={14} className="text-gold-primary" />
            {tl(selectedCity.name, locale)}
          </p>
        </motion.div>

        {/* City selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' as const }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {SELECTOR_CITIES.map((city) => (
            <button
              key={city.slug}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedCity.slug === city.slug
                  ? 'bg-gold-primary/20 border border-gold-primary text-gold-light'
                  : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-secondary hover:border-gold-primary/40 hover:text-text-primary'
              }`}
            >
              {tl(city.name, locale)}
            </button>
          ))}
        </motion.div>

        {/* Day Choghadiya */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Sun size={20} className="text-gold-primary" />
            {L.dayChoghadiya}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {daySlots.map((slot, i) => renderSlotCard(slot, i))}
          </div>
        </motion.section>

        {/* Night Choghadiya */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Moon size={20} className="text-gold-primary" />
            {L.nightChoghadiya}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {nightSlots.map((slot, i) => renderSlotCard(slot, i + 8))}
          </div>
        </motion.section>

        <GoldDivider />

        {/* Educational section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' as const }}
          className="space-y-8 mt-4"
        >
          {/* What is Choghadiya */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.whatIs}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
          </div>

          {/* 7 Types */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>
              <Sparkles size={18} className="inline-block mr-2 text-gold-primary -mt-0.5" />
              {L.typesTitle}
            </h2>
            <div className="space-y-3">
              {typeEntries.map((entry) => (
                <div key={entry.name} className="rounded-lg border border-white/10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4">
                  <h3 className="font-semibold text-gold-light mb-1" style={headingFont}>
                    {entry.name}
                  </h3>
                  <p className="text-text-secondary text-sm">{entry.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Best for travel/business */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.bestTitle}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.bestText}</p>
          </div>
        </motion.section>

        <RelatedLinks type="learn" links={getLearnLinksForTool('/choghadiya')} locale={locale} className="mt-8" />

        <GoldDivider className="mt-8" />

        {/* See Also */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' as const }}
          className="mt-4 mb-12"
        >
          <h2 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
            {L.seeAlso}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/rahu-kaal"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Rahu Kaal
            </Link>
            <Link
              href="/panchang"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              {L.back}
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
