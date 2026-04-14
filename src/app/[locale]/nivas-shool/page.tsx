'use client';

import type { LocaleText } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Compass, ArrowRight, AlertTriangle, Star, Flame, Moon } from 'lucide-react';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const t = (obj: LocaleText, locale: string) => tl(obj, locale);

// ─── Inline multilingual labels ──────────────────────────────────────────────
const L = {
  title: { en: 'Nivas & Shool', hi: 'निवास और शूल', sa: 'निवासः शूलश्च', ta: 'நிவாஸ் & சூல்', te: 'నివాస్ & శూల్', bn: 'নিবাস ও শূল', kn: 'ನಿವಾಸ ಮತ್ತು ಶೂಲ', mr: 'निवास आणि शूल', gu: 'નિવાસ અને શૂળ', mai: 'निवास आ शूल' },
  subtitle: {
    en: 'The Cosmic Abodes & Directional Thorns — Traditional indicators of auspice, movement, and elemental alignment',
    hi: 'ब्रह्मांडीय निवास और दिशा शूल — शुभता, गति और तात्विक संरेखण के पारंपरिक संकेतक',
    sa: 'ब्रह्माण्डीय निवासाः दिशाशूलश्च — शुभतायाः गत्याः तात्विकसंरेखणस्य च पारंपरिकसंकेताः',
    ta: 'அண்ட இருப்பிடங்கள் & திசை முள் — நற்பலன், பயணம் மற்றும் தாத்வீக சீரமைப்பின் பாரம்பரிய குறிகாட்டிகள்',
    te: 'విశ్వ నివాసాలు & దిశా శూలం — శుభత్వం, గమనం మరియు తత్వ సమన్వయం యొక్క సాంప్రదాయిక సూచికలు',
    bn: 'মহাজাগতিক নিবাস ও দিক শূল — শুভতা, গতি ও তাত্ত্বিক সমন্বয়ের প্রথাগত সূচক',
    kn: 'ವಿಶ್ವ ನಿವಾಸಗಳು & ದಿಕ್ಕು ಶೂಲ — ಶುಭತ್ವ, ಚಲನೆ ಮತ್ತು ತಾತ್ವಿಕ ಹೊಂದಾಣಿಕೆಯ ಸಾಂಪ್ರದಾಯಿಕ ಸೂಚಕಗಳು',
    mr: 'ब्रह्मांडीय निवास आणि दिशा शूल — शुभता, गती आणि तात्विक संरेखणाचे पारंपरिक संकेतक',
    gu: 'બ્રહ્માંડીય નિવાસ અને દિશા શૂળ — શુભતા, ગતિ અને તાત્ત્વિક ગોઠવણીના પરંપરાગત સંકેતક',
    mai: 'ब्रह्मांडीय निवास आ दिशा शूल — शुभता, गति आ तात्विक संरेखणक पारंपरिक संकेतक',
  },

  dishashool: { en: 'Disha Shool', hi: 'दिशा शूल', sa: 'दिशाशूलम्', ta: 'திசை சூலம்', te: 'దిశా శూలం', bn: 'দিশা শূল', kn: 'ದಿಶಾ ಶೂಲ', mr: 'दिशा शूल', gu: 'દિશા શૂળ', mai: 'दिशा शूल' },
  dishashoolDesc: {
    en: 'Disha Shool (दिशा + शूल = Direction + Thorn) is a traditional guideline that designates one cardinal direction as inauspicious for travel or initiating new journeys on each weekday. Originating in ancient Muhurta texts, it is believed that the planetary lord of the weekday casts a sharp "thorn" in a specific direction — travel toward that direction without remedy risks delays, accidents, or failure. Disha Shool does NOT apply to unavoidable daily commutes or essential travel, only to new ventures, pilgrimages, or auspicious journeys.',
    hi: 'दिशा शूल (दिशा + शूल = दिशा + काँटा) एक पारंपरिक दिशा-निर्देश है जो प्रत्येक वार को यात्रा या नई यात्राएं शुरू करने के लिए एक दिशा को अशुभ बताता है। प्राचीन मुहूर्त ग्रंथों में उद्भव, ऐसा माना जाता है कि वार के ग्रह स्वामी एक विशिष्ट दिशा में तीव्र "शूल" फेंकते हैं — बिना उपाय के उस दिशा में यात्रा में देरी, दुर्घटनाएं या विफलता का जोखिम होता है।',
    sa: 'दिशाशूलम् (दिशा + शूल = दिशा + कण्टकः) एकः पारंपरिको निर्देशः यः प्रत्येकं वारे यात्रायाः नवयात्राणाम् आरम्भाय एकां दिशां अशुभां निर्दिशति।',
    ta: 'திசை சூலம் (திசை + சூலம் = திசை + முள்) ஒவ்வொரு வாரத்தின் ஒரு திசையை பயணத்திற்கு அசுபமாக குறிக்கும் பாரம்பரிய வழிகாட்டுதல் ஆகும்.',
    te: 'దిశా శూలం (దిశ + శూలం = దిక్కు + ముల్లు) ప్రతి వారంలో ఒక దిక్కును ప్రయాణానికి అశుభంగా గుర్తించే సాంప్రదాయిక మార్గదర్శకం.',
    bn: 'দিশা শূল (দিশা + শূল = দিক + কাঁটা) প্রতিটি বারে যাত্রা বা নতুন কাজ শুরু করতে একটি দিককে অশুভ বলে চিহ্নিত করে।',
    kn: 'ದಿಶಾ ಶೂಲ (ದಿಕ್ಕು + ಶೂಲ = ದಿಕ್ಕು + ಮುಳ್ಳು) ಪ್ರತಿ ವಾರದಲ್ಲಿ ಒಂದು ದಿಕ್ಕನ್ನು ಪ್ರಯಾಣಕ್ಕೆ ಅಶುಭವೆಂದು ಗುರುತಿಸುವ ಸಾಂಪ್ರದಾಯಿಕ ಮಾರ್ಗದರ್ಶನ.',
    mr: 'दिशा शूल (दिशा + शूल = दिशा + काटा) एक पारंपरिक मार्गदर्शक आहे जे प्रत्येक वारी एका दिशेला प्रवासासाठी अशुभ मानते.',
    gu: 'દિશા શૂળ (દિશા + શૂળ = દિશા + કાંટો) દર વારે એક દિશાને મુસાફરી માટે અશુભ ગણવાનું પરંપરાગત માર્ગદર્શન છે.',
    mai: 'दिशा शूल (दिशा + शूल = दिशा + काँट) एगो पारंपरिक दिशा-निर्देश अछि जे प्रत्येक वारकेँ एक दिशाकेँ यात्राक लेल अशुभ बतबैत अछि।',
  },
  remedyTitle: { en: 'Universal Remedy', hi: 'सार्वभौमिक उपाय', sa: 'सार्वभौमिक उपायः', ta: 'பொது பரிகாரம்', te: 'సార్వభౌమ పరిహారం', bn: 'সার্বজনীন প্রতিকার', kn: 'ಸಾರ್ವತ್ರಿಕ ಪರಿಹಾರ', mr: 'सार्वभौमिक उपाय', gu: 'સાર્વભૌમિક ઉપાય', mai: 'सार्वभौमिक उपाय' },
  remedyDesc: {
    en: 'Consume the designated food item before departing in the shool direction. This pacifies the planetary thorn and renders the journey safe.',
    hi: 'शूल दिशा में प्रस्थान से पहले निर्धारित खाद्य पदार्थ का सेवन करें। यह ग्रह शूल को शांत करता है और यात्रा को सुरक्षित बनाता है।',
    sa: 'शूलदिशायां प्रस्थानात् पूर्वं निर्दिष्टं खाद्यं भक्षयेत्।',
    ta: 'சூல் திசையில் புறப்படும் முன் குறிப்பிட்ட உணவை உட்கொள்ளுங்கள்.',
    te: 'శూల దిశలో బయలుదేరడానికి ముందు నిర్ణీత ఆహారాన్ని తీసుకోండి.',
    bn: 'শূল দিকে যাত্রা শুরুর আগে নির্ধারিত খাদ্য গ্রহণ করুন।',
    kn: 'ಶೂಲ ದಿಕ್ಕಿನಲ್ಲಿ ಹೊರಡುವ ಮೊದಲು ನಿರ್ದಿಷ್ಟ ಆಹಾರವನ್ನು ಸೇವಿಸಿ.',
    mr: 'शूल दिशेत निघण्यापूर्वी निर्धारित खाद्यपदार्थाचे सेवन करा.',
    gu: 'શૂળ દિશામાં પ્રસ્થાન પહેલાં નિર્ધારિત ખાદ્ય વસ્તુનું સેવન કરો.',
    mai: 'शूल दिशा मे प्रस्थानसँ पहिने निर्धारित खाद्य पदार्थक सेवन करू।',
  },

  shivaVaas: { en: 'Shiva Vaas', hi: 'शिव वास', sa: 'शिवावासः', ta: 'சிவ வாசம்', te: 'శివ వాసం', bn: 'শিব বাস', kn: 'ಶಿವ ವಾಸ', mr: 'शिव वास', gu: 'શિવ વાસ', mai: 'शिव वास' },
  shivaVaasDesc: {
    en: 'Shiva Vaas (Abode of Shiva) describes which of the five cosmic abodes Lord Shiva resides in on a given day, determined by the Tithi (lunar day). Shiva constantly moves between these five states — his location indicates the cosmic energy available for worship, rituals, and daily activities. On auspicious abodes, Shiva is easily pleased; on Shamshan, he is in his Rudra (fierce) form and may be hard to propitiate.',
    hi: 'शिव वास (शिव का निवास) बताता है कि भगवान शिव किसी दिन तिथि के अनुसार पाँच ब्रह्मांडीय निवासों में से किसमें रहते हैं। शिव इन पाँच अवस्थाओं के बीच निरंतर गतिमान रहते हैं — उनका स्थान पूजा, अनुष्ठान और दैनिक गतिविधियों के लिए उपलब्ध ब्रह्मांडीय ऊर्जा को दर्शाता है।',
    sa: 'शिवावासः (शिवस्य निवासः) वर्णयति यत् भगवान् शिवः कस्यां तिथौ पञ्चसु ब्रह्माण्डीय निवासेषु कुत्र वसति।',
    ta: 'சிவ வாசம் (சிவனின் இருப்பிடம்) ஒரு நாளில் திதியின் அடிப்படையில் சிவன் ஐந்து அண்ட இருப்பிடங்களில் எதில் வசிக்கிறார் என்பதை விவரிக்கிறது.',
    te: 'శివ వాసం (శివుని నివాసం) ఒక రోజున తిథి ఆధారంగా శివుడు ఐదు విశ్వ నివాసాలలో ఎక్కడ ఉంటాడో వివరిస్తుంది.',
    bn: 'শিব বাস (শিবের নিবাস) তিথির ভিত্তিতে শিব পাঁচটি মহাজাগতিক নিবাসের কোনটিতে থাকেন তা বর্ণনা করে।',
    kn: 'ಶಿವ ವಾಸ (ಶಿವನ ನಿವಾಸ) ತಿಥಿಯ ಆಧಾರದ ಮೇಲೆ ಶಿವನು ಐದು ವಿಶ್ವ ನಿವಾಸಗಳಲ್ಲಿ ಎಲ್ಲಿ ವಾಸಿಸುತ್ತಾನೆ ಎಂಬುದನ್ನು ವಿವರಿಸುತ್ತದೆ.',
    mr: 'शिव वास (शिवाचा निवास) तिथीनुसार भगवान शिव पाच ब्रह्मांडीय निवासांपैकी कोणत्या ठिकाणी राहतात हे सांगते.',
    gu: 'શિવ વાસ (શિવનું નિવાસ) તિથિના આધારે ભગવાન શિવ પાંચ બ્રહ્માંડીય નિવાસોમાંથી ક્યાં રહે છે તે દર્શાવે છે.',
    mai: 'शिव वास (शिवक निवास) बतबैत अछि जे भगवान शिव कोनो दिन तिथिक अनुसार पाँच ब्रह्मांडीय निवासमे सँ कतय रहैत छथि।',
  },

  agniVaas: { en: 'Agni Vaas', hi: 'अग्नि वास', sa: 'अग्निवासः', ta: 'அக்னி வாசம்', te: 'అగ్ని వాసం', bn: 'অগ্নি বাস', kn: 'ಅಗ್ನಿ ವಾಸ', mr: 'अग्नि वास', gu: 'અગ્નિ વાસ', mai: 'अग्नि वास' },
  agniVaasDesc: {
    en: 'Agni Vaas (Abode of the Cosmic Fire) describes the elemental plane where the cosmic fire deity (Agni) resides on each weekday. This directly impacts the efficacy of fire-based rituals: Homa, Yajna, Agnihotra, and Deepa worship. When Agni is in Akash (Sky) or Prithvi (Earth), fire rituals are highly productive. In Patala (netherworld), they should be avoided or performed with special precautions.',
    hi: 'अग्नि वास (ब्रह्मांडीय अग्नि का निवास) प्रत्येक वार को अग्नि देवता के तात्विक आयाम का वर्णन करता है। यह अग्नि-आधारित अनुष्ठानों — होम, यज्ञ, अग्निहोत्र और दीप पूजा — की प्रभावशीलता पर सीधा प्रभाव डालता है।',
    sa: 'अग्निवासः (ब्रह्माण्डीय अग्नेः निवासः) प्रत्येकं वारे अग्नेः तात्विकस्तरं वर्णयति। होम-यज्ञ-अग्निहोत्रादि अनुष्ठानानां प्रभावे इदं प्रत्यक्षं प्रभवति।',
    ta: 'அக்னி வாசம் (அண்ட அக்னியின் இருப்பிடம்) ஒவ்வொரு வாரத்தில் அக்னி தேவதையின் தாத்வீக தளத்தை விவரிக்கிறது.',
    te: 'అగ్ని వాసం (విశ్వ అగ్ని నివాసం) ప్రతి వారంలో అగ్ని దేవత యొక్క తాత్వికస్థాయిని వివరిస్తుంది.',
    bn: 'অগ্নি বাস (মহাজাগতিক অগ্নির নিবাস) প্রতিটি বারে অগ্নি দেবতার তাত্ত্বিক আয়ামের বর্ণনা করে।',
    kn: 'ಅಗ್ನಿ ವಾಸ (ವಿಶ್ವ ಅಗ್ನಿಯ ನಿವಾಸ) ಪ್ರತಿ ವಾರದಲ್ಲಿ ಅಗ್ನಿ ದೇವತೆಯ ತಾತ್ವಿಕ ಮಟ್ಟವನ್ನು ವಿವರಿಸುತ್ತದೆ.',
    mr: 'अग्नि वास (ब्रह्मांडीय अग्नीचा निवास) प्रत्येक वारी अग्निदेवतेच्या तात्विक आयामाचे वर्णन करते.',
    gu: 'અગ્નિ વાસ (બ્રહ્માંડીય અગ્નિનું નિવાસ) દર વારે અગ્નિ દેવતાના તાત્ત્વિક આયામનું વર્ણન કરે છે.',
    mai: 'अग्नि वास (ब्रह्मांडीय अग्निक निवास) प्रत्येक वारकेँ अग्नि देवताक तात्विक आयामक वर्णन करैत अछि।',
  },

  chandraVaas: { en: 'Chandra Vaas', hi: 'चंद्र वास', sa: 'चन्द्रावासः', ta: 'சந்திர வாசம்', te: 'చంద్ర వాసం', bn: 'চন্দ্র বাস', kn: 'ಚಂದ್ರ ವಾಸ', mr: 'चंद्र वास', gu: 'ચંદ્ર વાસ', mai: 'चंद्र वास' },
  chandraVaasDesc: {
    en: 'Chandra Vaas (Abode of the Moon) is determined by which pada (quarter) of the current Nakshatra the Moon occupies. Each Nakshatra is divided into 4 padas; the Moon traverses each pada in approximately 3–4 hours. The pada determines the Moon\'s "abode" and its quality for auspicious activities. Deva (celestial) pada is most auspicious; Rakshasa (demonic) pada should be avoided for sacred rites.',
    hi: 'चंद्र वास (चंद्रमा का निवास) वर्तमान नक्षत्र के किस पाद (चतुर्थांश) में चंद्रमा स्थित है, इससे निर्धारित होता है। प्रत्येक नक्षत्र को 4 पादों में विभाजित किया गया है; चंद्रमा प्रत्येक पाद को लगभग 3-4 घंटे में पार करता है।',
    sa: 'चन्द्रावासः वर्तमाननक्षत्रस्य कस्मिन् पादे (चतुर्थांशे) चन्द्रः वर्तते इत्यनेन निर्धार्यते।',
    ta: 'சந்திர வாசம் (சந்திரனின் இருப்பிடம்) தற்போதைய நட்சத்திரத்தின் எந்த பாதத்தில் சந்திரன் இருக்கிறார் என்பதன் மூலம் தீர்மானிக்கப்படுகிறது.',
    te: 'చంద్ర వాసం (చంద్రుని నివాసం) ప్రస్తుత నక్షత్రం యొక్క ఏ పాదంలో చంద్రుడు ఉన్నాడనే దాని ద్వారా నిర్ణయించబడుతుంది.',
    bn: 'চন্দ্র বাস (চন্দ্রের নিবাস) বর্তমান নক্ষত্রের কোন পাদে চন্দ্র অবস্থান করছে তা দ্বারা নির্ধারিত হয়।',
    kn: 'ಚಂದ್ರ ವಾಸ (ಚಂದ್ರನ ನಿವಾಸ) ಪ್ರಸ್ತುತ ನಕ್ಷತ್ರದ ಯಾವ ಪಾದದಲ್ಲಿ ಚಂದ್ರನು ಇದ್ದಾನೆ ಎಂಬುದರಿಂದ ನಿರ್ಧರಿಸಲ್ಪಡುತ್ತದೆ.',
    mr: 'चंद्र वास (चंद्राचा निवास) सध्याच्या नक्षत्राच्या कोणत्या पादात चंद्र आहे यावरून ठरतो.',
    gu: 'ચંદ્ર વાસ (ચંદ્રનું નિવાસ) વર્તમાન નક્ષત્રના કયા પાદમાં ચંદ્ર સ્થિત છે તેનાથી નિર્ધારિત થાય છે.',
    mai: 'चंद्र वास (चंद्रमाक निवास) वर्तमान नक्षत्रक कोन पाद मे चंद्रमा स्थित अछि, एहिसँ निर्धारित होइत अछि।',
  },

  rahuVaas: { en: 'Rahu Vaas', hi: 'राहु वास', sa: 'राहोः वासः', ta: 'ராகு வாசம்', te: 'రాహు వాసం', bn: 'রাহু বাস', kn: 'ರಾಹು ವಾಸ', mr: 'राहु वास', gu: 'રાહુ વાસ', mai: 'राहु वास' },
  rahuVaasDesc: {
    en: 'Rahu Vaas indicates the direction in which Rahu (the north lunar node) faces on each weekday. Rahu\'s gaze is inauspicious for travel and construction. This is closely related to Disha Shool — on some days they coincide, amplifying the inauspice of that direction. Rahu Vaas is particularly important in Tamil and Kerala astrological traditions.',
    hi: 'राहु वास प्रत्येक वार को राहु (उत्तरी चंद्र नोड) किस दिशा में मुख किए हुए है, यह बताता है। राहु की दृष्टि यात्रा और निर्माण के लिए अशुभ है। यह दिशा शूल से निकटता से संबंधित है।',
    sa: 'राहोः वासः प्रत्येकं वारे राहुः (उत्तरचन्द्रनोडः) कां दिशं मुखं करोति इति वर्णयति।',
    ta: 'ராகு வாசம் ஒவ்வொரு வாரத்திலும் ராகு எந்த திசையை நோக்கி இருக்கிறார் என்பதை குறிக்கிறது.',
    te: 'రాహు వాసం ప్రతి వారంలో రాహువు ఏ దిశలో ముఖం చేస్తాడో సూచిస్తుంది.',
    bn: 'রাহু বাস প্রতিটি বারে রাহু কোন দিকে মুখ করে আছে তা নির্দেশ করে।',
    kn: 'ರಾಹು ವಾಸ ಪ್ರತಿ ವಾರದಲ್ಲಿ ರಾಹುವು ಯಾವ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡಿದ್ದಾನೆ ಎಂಬುದನ್ನು ಸೂಚಿಸುತ್ತದೆ.',
    mr: 'राहु वास प्रत्येक वारी राहु कोणत्या दिशेला तोंड करून आहे ते दर्शवतो.',
    gu: 'રાહુ વાસ દર વારે રાહુ કઈ દિશામાં મુખ કરે છે તે દર્શાવે છે.',
    mai: 'राहु वास प्रत्येक वारकेँ राहु कोन दिशा मे मुख कएने अछि, ई बतबैत अछि।',
  },

  textualBasis: { en: 'Textual Basis', hi: 'शास्त्रीय आधार', sa: 'शास्त्रीयाधारः', ta: 'நூல் அடிப்படை', te: 'శాస్త్రీయ ఆధారం', bn: 'শাস্ত্রীয় ভিত্তি', kn: 'ಶಾಸ್ತ್ರೀಯ ಆಧಾರ', mr: 'शास्त्रीय आधार', gu: 'શાસ્ત્રીય આધાર', mai: 'शास्त्रीय आधार' },
  practicalNote: { en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग', sa: 'व्यावहारिकः प्रयोगः', ta: 'நடைமுறை பயன்பாடு', te: 'ఆచరణాత్మక అనువర్తనం', bn: 'ব্যবহারিক প্রয়োগ', kn: 'ಪ್ರಾಯೋಗಿಕ ಅನ್ವಯ', mr: 'व्यावहारिक उपयोग', gu: 'વ્યાવહારિક ઉપયોગ', mai: 'व्यावहारिक अनुप्रयोग' },
  backToPanchang: { en: '← Back to Panchang', hi: '← पञ्चाङ्ग पर वापस', sa: '← पञ्चाङ्गं प्रति', ta: '← பஞ்சாங்கம் பக்கம்', te: '← పంచాంగం వైపు', bn: '← পঞ্চাঙ্গে ফিরুন', kn: '← ಪಂಚಾಂಗಕ್ಕೆ ಹಿಂತಿರುಗಿ', mr: '← पंचांगावर परत', gu: '← પંચાંગ પર પાછા', mai: '← पञ्चाङ्ग पर वापस' },
  auspicious: { en: 'Auspicious', hi: 'शुभ', sa: 'शुभम्', ta: 'சுபம்', te: 'శుభం', bn: 'শুভ', kn: 'ಶುಭ', mr: 'शुभ', gu: 'શુભ', mai: 'शुभ' },
  inauspicious: { en: 'Inauspicious', hi: 'अशुभ', sa: 'अशुभम्', ta: 'அசுபம்', te: 'అశుభం', bn: 'অশুভ', kn: 'ಅಶುಭ', mr: 'अशुभ', gu: 'અશુભ', mai: 'अशुभ' },
  neutral: { en: 'Neutral', hi: 'तटस्थ', sa: 'तटस्थम्', ta: 'நடுநிலை', te: 'తటస్థ', bn: 'নিরপেক্ষ', kn: 'ತಟಸ್ಥ', mr: 'तटस्थ', gu: 'તટસ્થ', mai: 'तटस्थ' },
  mixed: { en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रितम्', ta: 'கலப்பு', te: 'మిశ్రమ', bn: 'মিশ্র', kn: 'ಮಿಶ್ರ', mr: 'मिश्र', gu: 'મિશ્ર', mai: 'मिश्रित' },
  remedy: { en: 'Remedy', hi: 'उपाय', sa: 'उपायः', ta: 'பரிகாரம்', te: 'పరిహారం', bn: 'প্রতিকার', kn: 'ಪರಿಹಾರ', mr: 'उपाय', gu: 'ઉપાય', mai: 'उपाय' },
  weekday: { en: 'Weekday', hi: 'वार', sa: 'वारः', ta: 'கிழமை', te: 'వారం', bn: 'বার', kn: 'ವಾರ', mr: 'वार', gu: 'વાર', mai: 'वार' },
  direction: { en: 'Direction', hi: 'दिशा', sa: 'दिशा', ta: 'திசை', te: 'దిశ', bn: 'দিশা', kn: 'ದಿಕ್ಕು', mr: 'दिशा', gu: 'દિશા', mai: 'दिशा' },
  planet: { en: 'Ruling Planet', hi: 'अधिपति ग्रह', sa: 'अधिपतिग्रहः', ta: 'ஆளும் கிரகம்', te: 'అధిపతి గ్రహం', bn: 'অধিপতি গ্রহ', kn: 'ಅಧಿಪತಿ ಗ್ರಹ', mr: 'अधिपती ग्रह', gu: 'અધિપતિ ગ્રહ', mai: 'अधिपति ग्रह' },
  tithi: { en: 'Tithi', hi: 'तिथि', sa: 'तिथिः', ta: 'திதி', te: 'తిథి', bn: 'তিথি', kn: 'ತಿಥಿ', mr: 'तिथी', gu: 'તિથિ', mai: 'तिथि' },
  abode: { en: 'Abode', hi: 'निवास', sa: 'निवासः', ta: 'இருப்பிடம்', te: 'నివాసం', bn: 'নিবাস', kn: 'ನಿವಾಸ', mr: 'निवास', gu: 'નિવાસ', mai: 'निवास' },
  nature: { en: 'Nature', hi: 'प्रकृति', sa: 'प्रकृतिः', ta: 'தன்மை', te: 'ప్రకృతి', bn: 'প্রকৃতি', kn: 'ಪ್ರಕೃತಿ', mr: 'प्रकृती', gu: 'પ્રકૃતિ', mai: 'प्रकृति' },
  activities: { en: 'Activities', hi: 'गतिविधियाँ', sa: 'कार्याणि', ta: 'செயல்பாடுகள்', te: 'కార్యకలాపాలు', bn: 'কার্যকলাপ', kn: 'ಚಟುವಟಿಕೆಗಳು', mr: 'उपक्रम', gu: 'પ્રવૃત્તિઓ', mai: 'गतिविधि सभ' },
  pada: { en: 'Nakshatra Pada', hi: 'नक्षत्र पाद', sa: 'नक्षत्रपादः', ta: 'நட்சத்திர பாதம்', te: 'నక్షత్ర పాదం', bn: 'নক্ষত্র পাদ', kn: 'ನಕ್ಷತ್ರ ಪಾದ', mr: 'नक्षत्र पाद', gu: 'નક્ષત્ર પાદ', mai: 'नक्षत्र पाद' },
  plane: { en: 'Elemental Plane', hi: 'तात्विक स्तर', sa: 'तात्विकस्तरः', ta: 'பஞ்சபூத தளம்', te: 'తాత్వికస్థాయి', bn: 'তাত্ত্বিক স্তর', kn: 'ತಾತ್ವಿಕ ಮಟ್ಟ', mr: 'तात्विक स्तर', gu: 'તાત્ત્વિક સ્તર', mai: 'तात्विक स्तर' },
  significance: { en: 'Significance', hi: 'महत्व', sa: 'महत्त्वम्', ta: 'முக்கியத்துவம்', te: 'ప్రాముఖ్యత', bn: 'তাৎপর্য', kn: 'ಮಹತ್ವ', mr: 'महत्त्व', gu: 'મહત્ત્વ', mai: 'महत्व' },
  // Summary table & CTA labels
  comparativeSummary: { en: 'Comparative Summary', hi: 'तुलनात्मक सारांश', sa: 'तुलनात्मकसारांशः', ta: 'ஒப்பீட்டு சுருக்கம்', te: 'తులనాత్మక సారాంశం', bn: 'তুলনামূলক সারসংক্ষেপ', kn: 'ತುಲನಾತ್ಮಕ ಸಾರಾಂಶ', mr: 'तुलनात्मक सारांश', gu: 'તુલનાત્મક સારાંશ', mai: 'तुलनात्मक सारांश' },
  comparativeSubtitle: { en: 'All five Nivas & Shool indicators at a glance', hi: 'पाँचों निवास/शूल संकेतकों का एक नजर में अवलोकन', sa: 'पञ्चसंकेतकानाम् एकदृष्ट्या अवलोकनम्', ta: 'ஐந்து நிவாஸ் & சூல் குறிகாட்டிகளின் ஒரு பார்வை', te: 'ఐదు నివాస్ & శూల్ సూచికల ఒక చూపులో', bn: 'পাঁচটি নিবাস ও শূল সূচকের এক নজরে', kn: 'ಐದು ನಿವಾಸ ಮತ್ತು ಶೂಲ ಸೂಚಕಗಳ ಒಂದು ನೋಟ', mr: 'पाचही निवास/शूल संकेतकांचा एका दृष्टिक्षेपात आढावा', gu: 'પાંચેય નિવાસ/શૂળ સંકેતકોનો એક નજરમાં', mai: 'पाँचो निवास/शूल संकेतकक एक नजरि मे अवलोकन' },
  indicator: { en: 'Indicator', hi: 'संकेतक', sa: 'संकेतकः', ta: 'குறிகாட்டி', te: 'సూచిక', bn: 'সূচক', kn: 'ಸೂಚಕ', mr: 'संकेतक', gu: 'સંકેતક', mai: 'संकेतक' },
  determinedBy: { en: 'Determined By', hi: 'निर्धारक', sa: 'निर्धारकम्', ta: 'நிர்ணயிப்பது', te: 'నిర్ణయించేది', bn: 'নির্ধারক', kn: 'ನಿರ್ಧಾರಕ', mr: 'निर्धारक', gu: 'નિર્ધારક', mai: 'निर्धारक' },
  cycle: { en: 'Cycle', hi: 'चक्र', sa: 'चक्रम्', ta: 'சுழற்சி', te: 'చక్రం', bn: 'চক্র', kn: 'ಚಕ್ರ', mr: 'चक्र', gu: 'ચક્ર', mai: 'चक्र' },
  primaryUse: { en: 'Primary Use', hi: 'प्रमुख उपयोग', sa: 'प्रमुखोपयोगः', ta: 'முதன்மை பயன்பாடு', te: 'ప్రధాన ఉపయోగం', bn: 'প্রধান ব্যবহার', kn: 'ಪ್ರಮುಖ ಬಳಕೆ', mr: 'प्रमुख वापर', gu: 'પ્રમુખ ઉપયોગ', mai: 'प्रमुख उपयोग' },
  viewTodayNivas: { en: "View Today's Live Nivas", hi: 'आज का निवास देखें', sa: 'अद्य निवासं पश्यत', ta: "இன்றைய நிவாஸ் பாருங்கள்", te: 'ఈరోజు నివాసం చూడండి', bn: 'আজকের নিবাস দেখুন', kn: 'ಇಂದಿನ ನಿವಾಸ ನೋಡಿ', mr: 'आजचा निवास पाहा', gu: 'આજનું નિવાસ જુઓ', mai: 'आइक निवास देखू' },
  ctaDesc: {
    en: 'Our daily Panchang calculates Shiva Vaas, Agni Vaas, Chandra Vaas, and Disha Shool in real-time based on your location.',
    hi: 'हमारा दैनिक पञ्चाङ्ग आपकी लोकेशन के आधार पर शिव वास, अग्नि वास, चंद्र वास और दिशा शूल सब रियल-टाइम में दिखाता है।',
    sa: 'अस्माकं दैनिकं पञ्चाङ्गं भवतः स्थानस्य आधारेण सर्वं यथासमयं गणयति।',
    ta: 'எமது தினசரி பஞ்சாங்கம் உங்கள் இருப்பிடத்தின் அடிப்படையில் அனைத்தையும் நிகழ்நேரத்தில் கணிக்கிறது.',
    te: 'మా రోజువారీ పంచాంగం మీ స్థానం ఆధారంగా అన్నీ నిజ-సమయంలో గణిస్తుంది.',
    bn: 'আমাদের দৈনিক পঞ্চাঙ্গ আপনার অবস্থানের ভিত্তিতে সব রিয়েল-টাইমে গণনা করে।',
    kn: 'ನಮ್ಮ ದೈನಿಕ ಪಂಚಾಂಗ ನಿಮ್ಮ ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ಎಲ್ಲವನ್ನೂ ನೈಜ-ಸಮಯದಲ್ಲಿ ಲೆಕ್ಕ ಹಾಕುತ್ತದೆ.',
    mr: 'आमचे दैनिक पंचांग तुमच्या स्थानाच्या आधारे सर्व रिअल-टाइम मध्ये दाखवते.',
    gu: 'અમારું દૈનિક પંચાંગ તમારા સ્થાનના આધારે બધું રિયલ-ટાઇમમાં ગણે છે.',
    mai: 'हमर दैनिक पञ्चाङ्ग अहाँक लोकेशनक आधार पर सभ रियल-टाइम मे देखबैत अछि।',
  },
  openPanchang: { en: 'Open Panchang', hi: 'पञ्चाङ्ग खोलें', sa: 'पञ्चाङ्गम् उद्घाटयत', ta: 'பஞ்சாங்கம் திறக்கவும்', te: 'పంచాంగం తెరవండి', bn: 'পঞ্চাঙ্গ খুলুন', kn: 'ಪಂಚಾಂಗ ತೆರೆಯಿರಿ', mr: 'पंचांग उघडा', gu: 'પંચાંગ ખોલો', mai: 'पञ्चाङ्ग खोलू' },
};

// ─── Data tables ────────────────────────────────────────────────────────────
// Data objects use en/hi/sa — the t() helper falls back to hi for Devanagari locales (mr/mai),
// and to en for non-Devanagari locales (ta/te/bn/kn/gu) when a key is missing.

const DISHA_SHOOL = [
  {
    day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः', ta: 'ஞாயிறு', te: 'ఆదివారం', bn: 'রবিবার', kn: 'ಭಾನುವಾರ', mr: 'रविवार', gu: 'રવિવાર', mai: 'रविवार' },
    planet: { en: 'Sun (Surya)', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', mr: 'सूर्य', gu: 'સૂર્ય', mai: 'सूर्य' },
    direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमम्', ta: 'மேற்கு', te: 'పశ్చిమం', bn: 'পশ্চিম', kn: 'ಪಶ್ಚಿಮ', mr: 'पश्चिम', gu: 'પશ્ચિમ', mai: 'पश्चिम' },
    directionHi: 'प',
    color: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    remedy: { en: 'Eat jaggery (gur) before traveling West', hi: 'पश्चिम दिशा में यात्रा से पहले गुड़ खाएं', sa: 'पश्चिमं यात्रात् पूर्वं गुडं भक्षयेत्', ta: 'மேற்கு நோக்கி பயணிக்கும் முன் வெல்லம் சாப்பிடுங்கள்', te: 'పశ్చిమంగా ప్రయాణం ముందు బెల్లం తినండి', bn: 'পশ্চিমে যাত্রার আগে গুড় খান', kn: 'ಪಶ್ಚಿಮಕ್ಕೆ ಪ್ರಯಾಣಿಸುವ ಮೊದಲು ಬೆಲ್ಲ ತಿನ್ನಿ', mr: 'पश्चिम दिशेला प्रवासापूर्वी गूळ खा', gu: 'પશ્ચિમ દિશામાં મુસાફરી પહેલાં ગોળ ખાઓ', mai: 'पश्चिम दिशा मे यात्रासँ पहिने गुड़ खाउ' },
    nature: 'inauspicious',
    note: { en: 'The Sun, facing West at sunset, is in a weakened position', hi: 'सूर्यास्त के समय पश्चिम की ओर मुख करके सूर्य कमजोर स्थिति में होते हैं', sa: '' },
  },
  {
    day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः', ta: 'திங்கள்', te: 'సోమవారం', bn: 'সোমবার', kn: 'ಸೋಮವಾರ', mr: 'सोमवार', gu: 'સોમવાર', mai: 'सोमवार' },
    planet: { en: 'Moon (Chandra)', hi: 'चंद्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', mr: 'चंद्र', gu: 'ચંદ્ર', mai: 'चंद्र' },
    direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्', ta: 'கிழக்கு', te: 'తూర్పు', bn: 'পূর্ব', kn: 'ಪೂರ್ವ', mr: 'पूर्व', gu: 'પૂર્વ', mai: 'पूर्व' },
    directionHi: 'पू',
    color: 'text-blue-300',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    remedy: { en: 'Eat curd/yogurt before traveling East', hi: 'पूर्व दिशा में यात्रा से पहले दही खाएं', sa: 'पूर्वं यात्रात् पूर्वं दध्नः भक्षयेत्', ta: 'கிழக்கு நோக்கி பயணிக்கும் முன் தயிர் சாப்பிடுங்கள்', te: 'తూర్పుగా ప్రయాణం ముందు పెరుగు తినండి', bn: 'পূর্বে যাত্রার আগে দই খান', kn: 'ಪೂರ್ವಕ್ಕೆ ಪ್ರಯಾಣಿಸುವ ಮೊದಲು ಮೊಸರು ತಿನ್ನಿ', mr: 'पूर्व दिशेला प्रवासापूर्वी दही खा', gu: 'પૂર્વ દિશામાં મુસાફરી પહેલાં દહીં ખાઓ', mai: 'पूर्व दिशा मे यात्रासँ पहिने दही खाउ' },
    nature: 'inauspicious',
    note: { en: 'Moon faces East — its gaze blocks auspicious entry into the rising Sun\'s domain', hi: 'चंद्रमा पूर्व की ओर मुख करता है — उसकी दृष्टि उदीयमान सूर्य के क्षेत्र में शुभ प्रवेश को अवरुद्ध करती है', sa: '' },
  },
  {
    day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः', ta: 'செவ்வாய்', te: 'మంగళవారం', bn: 'মঙ্গলবার', kn: 'ಮಂಗಳವಾರ', mr: 'मंगळवार', gu: 'મંગળવાર', mai: 'मंगलवार' },
    planet: { en: 'Mars (Mangal)', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', mr: 'मंगळ', gu: 'મંગળ', mai: 'मंगल' },
    direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरम्', ta: 'வடக்கு', te: 'ఉత్తరం', bn: 'উত্তর', kn: 'ಉತ್ತರ', mr: 'उत्तर', gu: 'ઉત્તર', mai: 'उत्तर' },
    directionHi: 'उ',
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    remedy: { en: 'Eat sugar/mishri before traveling North', hi: 'उत्तर दिशा में यात्रा से पहले मिश्री खाएं', sa: 'उत्तरं यात्रात् पूर्वं मिश्रिकां भक्षयेत्', ta: 'வடக்கு நோக்கி பயணிக்கும் முன் சர்க்கரை சாப்பிடுங்கள்', te: 'ఉత్తరంగా ప్రయాణం ముందు పంచదార తినండి', bn: 'উত্তরে যাত্রার আগে মিছরি খান', kn: 'ಉತ್ತರಕ್ಕೆ ಪ್ರಯಾಣಿಸುವ ಮೊದಲು ಸಕ್ಕರೆ ತಿನ್ನಿ', mr: 'उत्तर दिशेला प्रवासापूर्वी खडीसाखर खा', gu: 'ઉત્તર દિશામાં મુસાફરી પહેલાં મિશ્રી ખાઓ', mai: 'उत्तर दिशा मे यात्रासँ पहिने मिश्री खाउ' },
    nature: 'inauspicious',
    note: { en: 'Mars is aggressive — its northern shool brings conflict and obstacles', hi: 'मंगल आक्रामक है — इसका उत्तरी शूल संघर्ष और बाधाएं लाता है', sa: '' },
  },
  {
    day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', ta: 'புதன்', te: 'బుధవారం', bn: 'বুধবার', kn: 'ಬುಧವಾರ', mr: 'बुधवार', gu: 'બુધવાર', mai: 'बुधवार' },
    planet: { en: 'Mercury (Budha)', hi: 'बुध', sa: 'बुधः', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', mr: 'बुध', gu: 'બુધ', mai: 'बुध' },
    direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरम्', ta: 'வடக்கு', te: 'ఉత్తరం', bn: 'উত্তর', kn: 'ಉತ್ತರ', mr: 'उत्तर', gu: 'ઉત્તર', mai: 'उत्तर' },
    directionHi: 'उ',
    color: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    remedy: { en: 'Eat green vegetables/herbs before traveling North', hi: 'उत्तर दिशा में यात्रा से पहले हरी सब्जियाँ खाएं', sa: 'उत्तरं यात्रात् पूर्वं शाकं भक्षयेत्', ta: 'வடக்கு நோக்கி பயணிக்கும் முன் பச்சை காய்கறிகள் சாப்பிடுங்கள்', te: 'ఉత్తరంగా ప్రయాణం ముందు పచ్చి కూరగాయలు తినండి', bn: 'উত্তরে যাত্রার আগে সবুজ শাকসবজি খান', kn: 'ಉತ್ತಕ್ಕೆ ಪ್ರಯಾಣಿಸುವ ಮೊದಲು ಹಸಿರು ತರಕಾರಿ ತಿನ್ನಿ', mr: 'उत्तर दिशेला प्रवासापूर्वी हिरव्या भाज्या खा', gu: 'ઉત્તર દિશામાં મુસાફરી પહેલાં લીલાં શાકભાજી ખાઓ', mai: 'उत्तर दिशा मे यात्रासँ पहिने हरियर सब्जी खाउ' },
    nature: 'inauspicious',
    note: { en: 'North (Kubera\'s domain) is blocked by Mercury on Wednesday — financial ventures are especially affected', hi: 'बुधवार को बुध द्वारा उत्तर (कुबेर का क्षेत्र) अवरुद्ध है', sa: '' },
  },
  {
    day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः', ta: 'வியாழன்', te: 'గురువారం', bn: 'বৃহস্পতিবার', kn: 'ಗುರುವಾರ', mr: 'गुरुवार', gu: 'ગુરુવાર', mai: 'गुरुवार' },
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु', sa: 'गुरुः', ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', mr: 'गुरु', gu: 'ગુરુ', mai: 'गुरु' },
    direction: { en: 'South', hi: 'दक्षिण', sa: 'दक्षिणम्', ta: 'தெற்கு', te: 'దక్షిణం', bn: 'দক্ষিণ', kn: 'ದಕ್ಷಿಣ', mr: 'दक्षिण', gu: 'દક્ષિણ', mai: 'दक्षिण' },
    directionHi: 'द',
    color: 'text-yellow-300',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/5',
    remedy: { en: 'Eat Bengal gram (chana dal) before traveling South', hi: 'दक्षिण दिशा में यात्रा से पहले चना दाल खाएं', sa: 'दक्षिणं यात्रात् पूर्वं चणकं भक्षयेत्', ta: 'தெற்கு நோக்கி பயணிக்கும் முன் கடலைப்பருப்பு சாப்பிடுங்கள்', te: 'దక్షిణంగా ప్రయాణం ముందు శనగపప్పు తినండి', bn: 'দক্ষিণে যাত্রার আগে ছোলার ডাল খান', kn: 'ದಕ್ಷಿಣಕ್ಕೆ ಪ್ರಯಾಣಿಸುವ ಮೊದಲು ಕಡಲೆ ಬೇಳೆ ತಿನ್ನಿ', mr: 'दक्षिण दिशेला प्रवासापूर्वी चणा डाळ खा', gu: 'દક્ષિણ દિશામાં મુસાફરી પહેલાં ચણા દાળ ખાઓ', mai: 'दक्षिण दिशा मे यात्रासँ पहिने चना दाल खाउ' },
    nature: 'inauspicious',
    note: { en: 'South is Yama\'s realm — Jupiter\'s shool there compounds the inauspice of travel toward death\'s domain', hi: 'दक्षिण यम का क्षेत्र है — वहाँ गुरु का शूल मृत्यु के क्षेत्र की ओर यात्रा की अशुभता को बढ़ाता है', sa: '' },
  },
  {
    day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः', ta: 'வெள்ளி', te: 'శుక్రవారం', bn: 'শুক্রবার', kn: 'ಶುಕ್ರವಾರ', mr: 'शुक्रवार', gu: 'શુક્રવાર', mai: 'शुक्रवार' },
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', mr: 'शुक्र', gu: 'શુક્ર', mai: 'शुक्र' },
    direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमम्', ta: 'மேற்கு', te: 'పశ్చిమం', bn: 'পশ্চিম', kn: 'ಪಶ್ಚಿಮ', mr: 'पश्चिम', gu: 'પશ્ચિમ', mai: 'पश्चिम' },
    directionHi: 'प',
    color: 'text-pink-300',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/5',
    remedy: { en: 'Eat white sesame seeds (til) before traveling West', hi: 'पश्चिम दिशा में यात्रा से पहले सफेद तिल खाएं', sa: 'पश्चिमं यात्रात् पूर्वं तिलान् भक्षयेत्', ta: 'மேற்கு நோக்கி பயணிக்கும் முன் வெள்ளை எள் சாப்பிடுங்கள்', te: 'పశ్చిమంగా ప్రయాణం ముందు తెల్ల నువ్వులు తినండి', bn: 'পশ্চিমে যাত্রার আগে সাদা তিল খান', kn: 'ಪಶ್ಚಿಮಕ್ಕೆ ಪ್ರಯಾಣಿಸುವ ಮೊದಲು ಬಿಳಿ ಎಳ್ಳು ತಿನ್ನಿ', mr: 'पश्चिम दिशेला प्रवासापूर्वी पांढरे तीळ खा', gu: 'પશ્ચિમ દિશામાં મુસાફરી પહેલાં સફેદ તલ ખાઓ', mai: 'पश्चिम दिशा मे यात्रासँ पहिने उजड़ तिल खाउ' },
    nature: 'inauspicious',
    note: { en: 'Venus\'s western shool is milder than others — often waived for short journeys', hi: 'शुक्र का पश्चिमी शूल अन्य की तुलना में हल्का है', sa: '' },
  },
  {
    day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः', ta: 'சனி', te: 'శనివారం', bn: 'শনিবার', kn: 'ಶನಿವಾರ', mr: 'शनिवार', gu: 'શનિવાર', mai: 'शनिवार' },
    planet: { en: 'Saturn (Shani)', hi: 'शनि', sa: 'शनिः', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', mr: 'शनी', gu: 'શનિ', mai: 'शनि' },
    direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्', ta: 'கிழக்கு', te: 'తూర్పు', bn: 'পূর্ব', kn: 'ಪೂರ್ವ', mr: 'पूर्व', gu: 'પૂર્વ', mai: 'पूर्व' },
    directionHi: 'पू',
    color: 'text-slate-300',
    border: 'border-slate-500/30',
    bg: 'bg-slate-500/5',
    remedy: { en: 'Eat sesame oil-cooked food or urad dal before traveling East', hi: 'पूर्व दिशा में यात्रा से पहले तिल के तेल में पका खाना या उड़द दाल खाएं', sa: 'पूर्वं यात्रात् पूर्वं तैलपक्वान्नं उड्डदलं वा भक्षयेत्', ta: 'கிழக்கு நோக்கி பயணிக்கும் முன் நல்லெண்ணெய் உணவு சாப்பிடுங்கள்', te: 'తూర్పుగా ప్రయాణం ముందు నువ్వుల నూనె ఆహారం తినండి', bn: 'পূর্বে যাত্রার আগে তিলের তেলের রান্না বা উড়দ ডাল খান', kn: 'ಪೂರ್ವಕ್ಕೆ ಪ್ರಯಾಣಿಸುವ ಮೊದಲು ಎಳ್ಳೆಣ್ಣೆ ಆಹಾರ ತಿನ್ನಿ', mr: 'पूर्व दिशेला प्रवासापूर्वी तिळाच्या तेलातील जेवण किंवा उडीद डाळ खा', gu: 'પૂર્વ દિશામાં મુસાફરી પહેલાં તલના તેલનું ભોજન અથવા અડદ દાળ ખાઓ', mai: 'पूर्व दिशा मे यात्रासँ पहिने तिलक तेल मे पकाओल खाना वा उड़द दाल खाउ' },
    nature: 'inauspicious',
    note: { en: 'Saturn\'s eastward shool is considered the most severe — new ventures eastward on Saturday face heavy delays', hi: 'शनि का पूर्वी शूल सबसे गंभीर माना जाता है', sa: '' },
  },
];

const SHIVA_VAAS = [
  {
    tithis: [1, 6, 11],
    name: { en: 'Kailash (Kailash Parvat)', hi: 'कैलाश (कैलाश पर्वत)', sa: 'कैलाशः' },
    nature: 'auspicious',
    color: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/8',
    icon: '🏔',
    desc: {
      en: 'Shiva resides in his divine abode atop Kailash with Parvati. He is serene, benevolent, and easily pleased. Best time for Shiva puja, abhishek, and auspicious activities.',
      hi: 'शिव अपने दिव्य निवास कैलाश शिखर पर पार्वती के साथ रहते हैं। वे शांत, दयालु और सहज प्रसन्न होने वाले हैं। शिव पूजा, अभिषेक और शुभ कार्यों का सर्वोत्तम समय।',
      sa: 'शिवः पार्वत्या सह कैलाशे दिव्यावासे निवसति। शिवपूजायाः अभिषेकस्य च सर्वोत्तमः कालः।',
    },
    activities: {
      en: 'Shiva puja, abhishek, marriage, business launch, pilgrimages',
      hi: 'शिव पूजा, अभिषेक, विवाह, व्यापार आरंभ, तीर्थयात्रा',
      sa: 'शिवपूजा, अभिषेकः, विवाहः, वाणिज्यारम्भः',
    },
  },
  {
    tithis: [2, 7, 12],
    name: { en: 'Shamshan (Cremation Ground)', hi: 'श्मशान (श्मशान भूमि)', sa: 'श्मशानम्' },
    nature: 'inauspicious',
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    icon: '💀',
    desc: {
      en: 'Shiva dwells in the cremation ground in his Rudra/Bhairava form, smeared with ash, surrounded by spirits. He is fierce and difficult to appease. Auspicious activities should be avoided; Tantric rites may be performed by adepts.',
      hi: 'शिव श्मशान भूमि में राख लिपे, आत्माओं से घिरे अपने रुद्र/भैरव रूप में निवास करते हैं। वे उग्र और प्रसन्न करने में कठिन हैं। शुभ कार्यों से बचना चाहिए।',
      sa: 'शिवः श्मशाने भस्मलिप्तः प्रेतैः परिवृतः रुद्ररूपेण निवसति।',
    },
    activities: {
      en: 'Avoid auspicious events; suitable for Shiva\'s Rudra form worship, ancestral rites',
      hi: 'शुभ कार्य वर्जित; शिव के रुद्र रूप की पूजा, पित्र कार्य',
      sa: 'शुभकार्यं वर्जयेत्; रुद्रपूजा, पित्रकार्यम्',
    },
  },
  {
    tithis: [3, 8, 13],
    name: { en: "Gauri's Abode (Parvati's Home)", hi: 'गौरी निवास (पार्वती का घर)', sa: 'गौर्याः निवासः' },
    nature: 'auspicious',
    color: 'text-pink-300',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/5',
    icon: '🌸',
    desc: {
      en: "Shiva visits Parvati/Gauri's home — a state of domestic bliss and harmonious union. Good for activities related to marriage, family, home, and matters of Venus.",
      hi: 'शिव पार्वती/गौरी के घर में मिलने जाते हैं — गृहस्थ आनंद और सामंजस्यपूर्ण मिलन की अवस्था। विवाह, परिवार, घर और शुक्र संबंधी विषयों के लिए अच्छा।',
      sa: 'शिवः गौर्याः गृहे मिलति — गार्हस्थ्यानन्दस्य सामंजस्यस्य च स्थितिः।',
    },
    activities: {
      en: 'Marriage, family rituals, home purchase/construction, Gauri puja',
      hi: 'विवाह, पारिवारिक अनुष्ठान, घर खरीद/निर्माण, गौरी पूजा',
      sa: 'विवाहः, पारिवारिकानुष्ठानम्, गृहक्रय-निर्माणम्',
    },
  },
  {
    tithis: [4, 9, 14],
    name: { en: 'Playing (Krida)', hi: 'क्रीड़ा (खेल)', sa: 'क्रीडा' },
    nature: 'neutral',
    color: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    icon: '🎭',
    desc: {
      en: "Shiva is at play (Leela) — dancing the Tandava, absorbed in cosmic sport. His attention is divided; he may or may not respond to prayers readily. Mixed results for activities.",
      hi: 'शिव खेल (लीला) में हैं — तांडव नृत्य करते, ब्रह्मांडीय खेल में लीन। उनका ध्यान बँटा हुआ है; वे प्रार्थनाओं का उत्तर दे भी सकते हैं और नहीं भी। गतिविधियों के लिए मिश्रित परिणाम।',
      sa: 'शिवः क्रीडायां तान्डवे च लीनः — ब्रह्माण्डीयक्रीडायाम् अभिरतः।',
    },
    activities: {
      en: 'Moderate activities; avoid critical ventures. Arts, music, dance are well-supported.',
      hi: 'मध्यम गतिविधियाँ; महत्वपूर्ण उपक्रमों से बचें। कला, संगीत, नृत्य अच्छे हैं।',
      sa: 'मध्यमकार्याणि; महत्त्वपूर्णान् उपक्रमान् वर्जयेत्।',
    },
  },
  {
    tithis: [5, 10, 15, 30],
    name: { en: 'Samadhi (Deep Meditation)', hi: 'समाधि (गहरा ध्यान)', sa: 'समाधिः' },
    nature: 'mixed',
    color: 'text-violet-300',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
    icon: '🧘',
    desc: {
      en: 'Shiva is in deep Samadhi — Unmoved, beyond the phenomenal world. He is neither easily approached nor displeased. This state is considered sacred for meditation and spiritual practice, but mundane activities may not receive divine support.',
      hi: 'शिव गहरी समाधि में हैं — अचल, भौतिक संसार से परे। उनसे न सहज निकट जाया जा सकता है, न वे आसानी से नाराज होते हैं। यह अवस्था ध्यान और आध्यात्मिक साधना के लिए पवित्र मानी जाती है।',
      sa: 'शिवः गहनसमाधौ अस्ति — अचलः, सांसारिकजगतः परे। ध्यानाय आध्यात्मिकसाधनायै च पवित्रः।',
    },
    activities: {
      en: 'Meditation, japa, spiritual practice, fasting. Avoid worldly ventures.',
      hi: 'ध्यान, जप, आध्यात्मिक साधना, उपवास। सांसारिक उपक्रमों से बचें।',
      sa: 'ध्यानम्, जपः, आध्यात्मिकसाधना। सांसारिकोपक्रमान् वर्जयेत्।',
    },
  },
];

const AGNI_VAAS = [
  {
    days: [0, 4], // Sun, Thu
    dayNames: { en: 'Sunday, Thursday', hi: 'रविवार, गुरुवार', sa: 'रविवासरः, गुरुवासरः', ta: 'ஞாயிறு, வியாழன்', te: 'ఆదివారం, గురువారం', bn: 'রবিবার, বৃহস্পতিবার', kn: 'ಭಾನುವಾರ, ಗುರುವಾರ', mr: 'रविवार, गुरुवार', gu: 'રવિવાર, ગુરુવાર', mai: 'रविवार, गुरुवार' },
    plane: { en: 'Akash (Sky)', hi: 'आकाश', sa: 'आकाशः', ta: 'ஆகாயம்', te: 'ఆకాశం', bn: 'আকাশ', kn: 'ಆಕಾಶ', mr: 'आकाश', gu: 'આકાશ', mai: 'आकाश' },
    symbol: '☁',
    color: 'text-sky-300',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/5',
    nature: 'auspicious',
    desc: {
      en: 'Agni resides in the celestial sky. Fire rituals performed now are carried directly to the devatas. Homa and Yajna are highly effective. The smoke and offerings rise unimpeded to the heavens.',
      hi: 'अग्नि दिव्य आकाश में निवास करती है। अभी किए गए अग्नि अनुष्ठान सीधे देवताओं तक पहुँचते हैं। होम और यज्ञ अत्यंत प्रभावी हैं।',
      sa: 'अग्निः दिव्याकाशे निवसति। अग्निकार्याणि सुफलानि।',
    },
  },
  {
    days: [1, 5], // Mon, Fri
    dayNames: { en: 'Monday, Friday', hi: 'सोमवार, शुक्रवार', sa: 'सोमवासरः, शुक्रवासरः', ta: 'திங்கள், வெள்ளி', te: 'సోమవారం, శుక్రవారం', bn: 'সোমবার, শুক্রবার', kn: 'ಸೋಮವಾರ, ಶುಕ್ರವಾರ', mr: 'सोमवार, शुक्रवार', gu: 'સોમવાર, શુક્રવાર', mai: 'सोमवार, शुक्रवार' },
    plane: { en: 'Prithvi (Earth)', hi: 'पृथ्वी', sa: 'पृथ्वी', ta: 'பிருதிவி (பூமி)', te: 'పృథ్వి (భూమి)', bn: 'পৃথিবী', kn: 'ಪೃಥ್ವಿ (ಭೂಮಿ)', mr: 'पृथ्वी', gu: 'પૃથ્વી', mai: 'पृथ्वी' },
    symbol: '🌍',
    color: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    nature: 'auspicious',
    desc: {
      en: 'Agni is grounded in the earth plane. Fire rituals nourish the land and its people. Agriculture blessings, prosperity rituals, and Griha Pravesh fire ceremonies are especially powerful.',
      hi: 'अग्नि पृथ्वी तल में स्थित है। अग्नि अनुष्ठान भूमि और उसके लोगों को पोषित करते हैं। कृषि आशीर्वाद, समृद्धि अनुष्ठान और गृह प्रवेश अग्नि समारोह विशेष रूप से शक्तिशाली हैं।',
      sa: 'अग्निः पृथ्वीतले अस्ति। कृषिवरदाने समृद्धिकार्ये गृहप्रवेशे च विशेषफलप्रदा।',
    },
  },
  {
    days: [2, 6], // Tue, Sat
    dayNames: { en: 'Tuesday, Saturday', hi: 'मंगलवार, शनिवार', sa: 'मङ्गलवासरः, शनिवासरः', ta: 'செவ்வாய், சனி', te: 'మంగళవారం, శనివారం', bn: 'মঙ্গলবার, শনিবার', kn: 'ಮಂಗಳವಾರ, ಶನಿವಾರ', mr: 'मंगळवार, शनिवार', gu: 'મંગળવાર, શનિવાર', mai: 'मंगलवार, शनिवार' },
    plane: { en: 'Patala (Netherworld)', hi: 'पाताल (पातालवास)', sa: 'पातालम्', ta: 'பாதாளம்', te: 'పాతాళం', bn: 'পাতাল', kn: 'ಪಾತಾಳ', mr: 'पाताळ', gu: 'પાતાળ', mai: 'पाताल' },
    symbol: '🔻',
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    nature: 'inauspicious',
    desc: {
      en: 'Agni descends to the netherworld. Fire rituals performed now may have reversed or weakened effects — the offerings do not easily reach the devatas. Major Yajnas should be postponed. Simple Deepa (lamp) worship is permitted.',
      hi: 'अग्नि पाताल में उतर जाती है। अभी किए गए अग्नि अनुष्ठानों के उलटे या कमजोर प्रभाव हो सकते हैं। बड़े यज्ञ स्थगित करने चाहिए।',
      sa: 'अग्निः पातालं गच्छति। अग्निकार्यं विपरीतफलदम्। यज्ञं स्थगयेत्।',
    },
  },
  {
    days: [3], // Wed
    dayNames: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', ta: 'புதன்', te: 'బుధవారం', bn: 'বুধবার', kn: 'ಬುಧವಾರ', mr: 'बुधवार', gu: 'બુધવાર', mai: 'बुधवार' },
    plane: { en: 'Jal (Water)', hi: 'जल', sa: 'जलम्', ta: 'ஜலம் (நீர்)', te: 'జలం (నీరు)', bn: 'জল', kn: 'ಜಲ (ನೀರು)', mr: 'जल', gu: 'જળ', mai: 'जल' },
    symbol: '💧',
    color: 'text-blue-300',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    nature: 'mixed',
    desc: {
      en: 'Agni is submerged in water — a paradoxical state where fire and water coexist (Vadavagni — the submarine fire in Hindu cosmology). Rituals involving both fire and water (abhishek following homa) are uniquely powerful on Wednesdays.',
      hi: 'अग्नि जल में समाई है — एक विरोधाभासी अवस्था जहाँ अग्नि और जल सह-अस्तित्व में हैं (वडवाग्नि — हिंदू ब्रह्माण्ड विज्ञान में समुद्री अग्नि)।',
      sa: 'अग्निः जले निमग्ना — वडवाग्निरूपेण। होमाभिषेकसंयुक्तानि कार्याणि विशेषशक्तिमन्ति।',
    },
  },
];

const CHANDRA_VAAS = [
  {
    pada: 1,
    name: { en: 'Deva (Celestial)', hi: 'देव (दैवीय)', sa: 'देवः', ta: 'தேவ (தெய்வீக)', te: 'దేవ (దైవిక)', bn: 'দেব (দৈবীয়)', kn: 'ದೇವ (ದೈವಿಕ)', mr: 'देव (दैवी)', gu: 'દેવ (દૈવીય)', mai: 'देव (दैवीय)' },
    color: 'text-gold-light',
    border: 'border-gold-primary/30',
    bg: 'bg-gold-primary/5',
    nature: 'auspicious',
    symbol: '✦',
    desc: {
      en: 'Moon is in the celestial abode. Divine energy flows freely. Prayers are answered with ease. This is the most auspicious pada for all sacred activities.',
      hi: 'चंद्रमा दिव्य निवास में है। दिव्य ऊर्जा स्वतंत्र रूप से प्रवाहित होती है। प्रार्थनाएं आसानी से सुनी जाती हैं।',
      sa: 'चन्द्रः दिव्यनिवासे। दिव्यशक्तिः स्वतन्त्रा प्रवहति। सर्वसाधनाय शुभः।',
    },
    activities: { en: 'All auspicious work, puja, sacred ceremonies, spiritual practice', hi: 'सभी शुभ कार्य, पूजा, पवित्र समारोह, आध्यात्मिक साधना', sa: 'सर्वशुभकार्यम्' },
  },
  {
    pada: 2,
    name: { en: 'Nara (Human)', hi: 'नर (मानव)', sa: 'नरः', ta: 'நர (மனித)', te: 'నర (మానవ)', bn: 'নর (মানব)', kn: 'ನರ (ಮಾನವ)', mr: 'नर (मानव)', gu: 'નર (માનવ)', mai: 'नर (मानव)' },
    color: 'text-blue-300',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    nature: 'neutral',
    symbol: '◈',
    desc: {
      en: 'Moon is in the human abode — the plane of ordinary human activity. Results are as you would expect — neither divinely elevated nor particularly hindered. Good for worldly tasks.',
      hi: 'चंद्रमा मानव निवास में है — साधारण मानवीय गतिविधि का तल। परिणाम सामान्य हैं — न दिव्य रूप से उन्नत, न विशेष रूप से बाधित।',
      sa: 'चन्द्रः नरावासे — सामान्यमानवीयकार्यस्य तले। फलानि सामान्यानि।',
    },
    activities: { en: 'Daily work, business, social activities, learning', hi: 'दैनिक कार्य, व्यापार, सामाजिक गतिविधियाँ, शिक्षा', sa: 'दैनिककार्यम्, वाणिज्यः' },
  },
  {
    pada: 3,
    name: { en: 'Pashava (Animal)', hi: 'पशव (पशु)', sa: 'पशवः', ta: 'பசவ (விலங்கு)', te: 'పశవ (పశు)', bn: 'পশব (পশু)', kn: 'ಪಶವ (ಪ್ರಾಣಿ)', mr: 'पशव (पशू)', gu: 'પશવ (પશુ)', mai: 'पशव (पशु)' },
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    nature: 'mixed',
    symbol: '◉',
    desc: {
      en: 'Moon is in the animal abode — instinctual, reactive, less refined energy. Actions taken now may be driven by impulse. Avoid important decisions; good for physical work and agriculture.',
      hi: 'चंद्रमा पशु निवास में है — सहज, प्रतिक्रियाशील, कम परिष्कृत ऊर्जा। महत्वपूर्ण निर्णयों से बचें; शारीरिक कार्य और कृषि के लिए अच्छा।',
      sa: 'चन्द्रः पशावासे — आवेगात्मकं कार्यं वर्जयेत्।',
    },
    activities: { en: 'Physical labor, farming, avoid important decisions or sacred rites', hi: 'शारीरिक श्रम, खेती, महत्वपूर्ण निर्णयों या पवित्र अनुष्ठानों से बचें', sa: 'शारीरिककार्यम्, कृषिः' },
  },
  {
    pada: 4,
    name: { en: 'Rakshasa (Demonic)', hi: 'राक्षस (असुर)', sa: 'राक्षसः', ta: 'ராட்சசம் (அசுர)', te: 'రాక్షస (అసుర)', bn: 'রাক্ষস (অসুর)', kn: 'ರಾಕ್ಷಸ (ಅಸುರ)', mr: 'राक्षस (असुर)', gu: 'રાક્ષસ (અસુર)', mai: 'राक्षस (असुर)' },
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    nature: 'inauspicious',
    symbol: '▼',
    desc: {
      en: 'Moon is in the demonic abode — turbulent, obstructive energy. Activities initiated now face opposition, deception, or hidden enemies. Most auspicious works should be avoided. Protective mantras and Hanuman worship mitigate the effects.',
      hi: 'चंद्रमा राक्षस निवास में है — उथल-पुथल, अवरोधक ऊर्जा। अब शुरू की गई गतिविधियों को विरोध, धोखे या छिपे दुश्मनों का सामना करना पड़ता है।',
      sa: 'चन्द्रः राक्षसावासे — अशान्तः अवरोधकश्च। शुभकार्यं वर्जयेत्।',
    },
    activities: { en: 'Avoid all sacred and auspicious activities; protective rites may be performed', hi: 'सभी पवित्र और शुभ गतिविधियों से बचें; सुरक्षात्मक अनुष्ठान किए जा सकते हैं', sa: 'सर्वशुभकार्यं वर्जयेत्' },
  },
];

const RAHU_VAAS = [
  { day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः', ta: 'ஞாயிறு', te: 'ఆదివారం', bn: 'রবিবার', kn: 'ಭಾನುವಾರ', mr: 'रविवार', gu: 'રવિવાર', mai: 'रविवार' }, direction: { en: 'Southwest', hi: 'नैऋत्य', sa: 'नैऋत्यम्', ta: 'தென்மேற்கு', te: 'నైఋతి', bn: 'নৈঋত্য', kn: 'ನೈಋತ್ಯ', mr: 'नैऋत्य', gu: 'નૈઋત્ય', mai: 'नैऋत्य' }, color: 'text-amber-300' },
  { day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः', ta: 'திங்கள்', te: 'సోమవారం', bn: 'সোমবার', kn: 'ಸೋಮವಾರ', mr: 'सोमवार', gu: 'સોમવાર', mai: 'सोमवार' }, direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्', ta: 'கிழக்கு', te: 'తూర్పు', bn: 'পূর্ব', kn: 'ಪೂರ್ವ', mr: 'पूर्व', gu: 'પૂર્વ', mai: 'पूर्व' }, color: 'text-blue-300' },
  { day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः', ta: 'செவ்வாய்', te: 'మంగళవారం', bn: 'মঙ্গলবার', kn: 'ಮಂಗಳವಾರ', mr: 'मंगळवार', gu: 'મંગળવાર', mai: 'मंगलवार' }, direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरम्', ta: 'வடக்கு', te: 'ఉత్తరం', bn: 'উত্তর', kn: 'ಉತ್ತರ', mr: 'उत्तर', gu: 'ઉત્તર', mai: 'उत्तर' }, color: 'text-red-400' },
  { day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', ta: 'புதன்', te: 'బుధవారం', bn: 'বুধবার', kn: 'ಬುಧವಾರ', mr: 'बुधवार', gu: 'બુધવાર', mai: 'बुधवार' }, direction: { en: 'Northwest', hi: 'वायव्य', sa: 'वायव्यम्', ta: 'வடமேற்கு', te: 'వాయవ్యం', bn: 'বায়ব্য', kn: 'ವಾಯವ್ಯ', mr: 'वायव्य', gu: 'વાયવ્ય', mai: 'वायव्य' }, color: 'text-emerald-300' },
  { day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः', ta: 'வியாழன்', te: 'గురువారం', bn: 'বৃহস্পতিবার', kn: 'ಗುರುವಾರ', mr: 'गुरुवार', gu: 'ગુરુવાર', mai: 'गुरुवार' }, direction: { en: 'Southeast', hi: 'आग्नेय', sa: 'आग्नेयम्', ta: 'தென்கிழக்கு', te: 'ఆగ్నేయం', bn: 'আগ্নেয়', kn: 'ಆಗ್ನೇಯ', mr: 'आग्नेय', gu: 'આગ્નેય', mai: 'आग्नेय' }, color: 'text-yellow-300' },
  { day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः', ta: 'வெள்ளி', te: 'శుక్రవారం', bn: 'শুক্রবার', kn: 'ಶುಕ್ರವಾರ', mr: 'शुक्रवार', gu: 'શુક્રવાર', mai: 'शुक्रवार' }, direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमम्', ta: 'மேற்கு', te: 'పశ్చిమం', bn: 'পশ্চিম', kn: 'ಪಶ್ಚಿಮ', mr: 'पश्चिम', gu: 'પશ્ચિમ', mai: 'पश्चिम' }, color: 'text-pink-300' },
  { day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः', ta: 'சனி', te: 'శనివారం', bn: 'শনিবার', kn: 'ಶನಿವಾರ', mr: 'शनिवार', gu: 'શનિવાર', mai: 'शनिवार' }, direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्', ta: 'கிழக்கு', te: 'తూర్పు', bn: 'পূর্ব', kn: 'ಪೂರ್ವ', mr: 'पूर्व', gu: 'પૂર્વ', mai: 'पूर्व' }, color: 'text-slate-300' },
];

// ─── Summary table data (localized) ──────────────────────────────────────────
const SUMMARY_ROWS = [
  { name: L.dishashool, det: { en: 'Weekday (Vara)', hi: 'वार', sa: 'वारः' }, cycle: { en: '7-day', hi: '7 दिन', sa: '7 दिनम्' }, use: { en: 'Travel direction avoidance', hi: 'यात्रा दिशा निवारण', sa: 'यात्रादिशानिवारणम्' } },
  { name: L.shivaVaas, det: { en: 'Tithi (Lunar day)', hi: 'तिथि', sa: 'तिथिः' }, cycle: { en: '15 tithis × 2', hi: '15 तिथि × 2', sa: '15 तिथयः × 2' }, use: { en: 'Shiva puja & auspicious timing', hi: 'शिव पूजा व शुभ समय', sa: 'शिवपूजा शुभसमयश्च' } },
  { name: L.agniVaas, det: { en: 'Weekday (Vara)', hi: 'वार', sa: 'वारः' }, cycle: { en: '7-day', hi: '7 दिन', sa: '7 दिनम्' }, use: { en: 'Fire ritual (Homa/Yajna) scheduling', hi: 'अग्नि अनुष्ठान (होम/यज्ञ) समयन', sa: 'होमयज्ञसमयनम्' } },
  { name: L.chandraVaas, det: { en: 'Nakshatra pada', hi: 'नक्षत्र पाद', sa: 'नक्षत्रपादः' }, cycle: { en: '~3-4 hrs', hi: '~3-4 घंटे', sa: '~3-4 होरा' }, use: { en: 'Moment-to-moment activity quality', hi: 'क्षण-क्षण गतिविधि गुणवत्ता', sa: 'प्रतिक्षणं कार्यगुणः' } },
  { name: L.rahuVaas, det: { en: 'Weekday (Vara)', hi: 'वार', sa: 'वारः' }, cycle: { en: '7-day', hi: '7 दिन', sa: '7 दिनम्' }, use: { en: 'Construction & land inauspice', hi: 'निर्माण व भूमि अशुभता', sa: 'निर्माणभूम्यशुभता' } },
];

// ─── Small helpers ──────────────────────────────────────────────────────────
const NatureBadge = ({ nature, locale }: { nature: string; locale: string }) => {
  const map: Record<string, { label: LocaleText; cls: string }> = {
    auspicious: { label: L.auspicious, cls: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' },
    inauspicious: { label: L.inauspicious, cls: 'bg-red-500/15 text-red-400 border border-red-500/25' },
    neutral: { label: L.neutral, cls: 'bg-blue-500/15 text-blue-300 border border-blue-500/25' },
    mixed: { label: L.mixed, cls: 'bg-amber-500/15 text-amber-300 border border-amber-500/25' },
  };
  const { label, cls } = map[nature] ?? map.neutral;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{t(label, locale)}</span>;
};

const SectionHeader = ({ icon, title, subtitle, locale }: { icon: React.ReactNode; title: LocaleText; subtitle: LocaleText; locale: string }) => (
  <div className="text-center mb-10">
    <div className="flex justify-center mb-3">{icon}</div>
    <h2 className="text-3xl font-bold text-gold-gradient mb-2">{t(title, locale)}</h2>
    <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">{t(subtitle, locale)}</p>
  </div>
);

// ─── Main page ───────────────────────────────────────────────────────────────
export default function NivasShoolPage() {
  const locale = useLocale();
  const isDev = isDevanagariLocale(locale);

  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1235] to-bg-primary" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #d4a85340 0%, transparent 60%), radial-gradient(circle at 70% 30%, #6366f130 0%, transparent 50%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gold-primary/10 border border-gold-primary/20">
                <Compass className="w-12 h-12 text-gold-primary" />
              </div>
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-gold-gradient mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {t(L.title, locale)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            {t(L.subtitle, locale)}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8">
            <Link href="/panchang" className="text-sm text-gold-primary/70 hover:text-gold-primary transition-colors">
              {t(L.backToPanchang, locale)}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick nav */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { href: '#disha-shool', label: L.dishashool, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-300' },
            { href: '#shiva-vaas', label: L.shivaVaas, icon: <Star className="w-4 h-4" />, color: 'text-violet-300' },
            { href: '#agni-vaas', label: L.agniVaas, icon: <Flame className="w-4 h-4" />, color: 'text-orange-400' },
            { href: '#chandra-vaas', label: L.chandraVaas, icon: <Moon className="w-4 h-4" />, color: 'text-blue-300' },
            { href: '#rahu-vaas', label: L.rahuVaas, icon: <Compass className="w-4 h-4" />, color: 'text-red-400' },
          ].map((item) => (
            <a key={item.href} href={item.href}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10 hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-all text-sm font-medium">
              <span className={item.color}>{item.icon}</span>
              <span className={item.color}>{t(item.label, locale)}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── DISHA SHOOL ─────────────────────────────────────────────────────── */}
      <section id="disha-shool" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"><AlertTriangle className="w-8 h-8 text-amber-300" /></div>}
          title={L.dishashool}
          subtitle={L.dishashoolDesc}
          locale={locale}
        />

        {/* Remedy box */}
        <div className="mb-8 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 mt-0.5"><Star className="w-4 h-4 text-emerald-300" /></div>
            <div>
              <div className="text-emerald-300 font-semibold text-sm mb-1">{t(L.remedyTitle, locale)}</div>
              <div className="text-text-secondary text-sm leading-relaxed">{t(L.remedyDesc, locale)}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {DISHA_SHOOL.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`p-5 rounded-2xl border ${row.border} ${row.bg} relative overflow-hidden`}>
              <div className="absolute top-3 right-4 text-6xl font-black opacity-5 leading-none">{row.directionHi}</div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className={`text-lg font-bold ${row.color}`}>{t(row.day, locale)}</div>
                  <div className="text-text-tertiary text-xs">{t(row.planet, locale)}</div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black ${row.color}`}>{t(row.direction, locale)}</div>
                  <NatureBadge nature={row.nature} locale={locale} />
                </div>
              </div>
              <div className="text-text-secondary text-xs mb-3 leading-relaxed">{t(row.note, locale)}</div>
              <div className={`p-3 rounded-xl border ${row.border} bg-black/20`}>
                <div className="text-xs text-text-tertiary mb-0.5">{t(L.remedy, locale)}</div>
                <div className={`text-sm font-medium ${row.color}`}>{t(row.remedy, locale)}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Textual basis */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <div className="text-gold-primary font-semibold mb-2 text-sm">{t(L.textualBasis, locale)}</div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: "Disha Shool is documented in classical Muhurta texts including Muhurta Chintamani, Muhurta Martanda, and Jyotir Nibandha. The underlying principle holds that each weekday\'s ruling planet casts its drishti (directional gaze) toward a specific cardinal point, rendering that direction sharp (thorn-like) for new journeys initiated on that day. The remedy (eating specific food) invokes the elemental and planetary energies to neutralize the obstruction.", hi: "दिशा शूल का उल्लेख मुहूर्त चिंतामणि, मुहूर्त मार्तण्ड और ज्योतिर्निबंध जैसे प्राचीन ग्रंथों में मिलता है। इसका आधार यह सिद्धांत है कि प्रत्येक वार का ग्रह स्वामी एक विशिष्ट दिशा में अपनी दृष्टि (दृष्टि शक्ति) डालता है, जिससे वह दिशा उस दिन के लिए तीक्ष्ण (कंटकयुक्त) हो जाती है।", sa: "दिशा शूल का उल्लेख मुहूर्त चिंतामणि, मुहूर्त मार्तण्ड और ज्योतिर्निबंध जैसे प्राचीन ग्रंथों में मिलता है। इसका आधार यह सिद्धांत है कि प्रत्येक वार का ग्रह स्वामी एक विशिष्ट दिशा में अपनी दृष्टि (दृष्टि शक्ति) डालता है, जिससे वह दिशा उस दिन के लिए तीक्ष्ण (कंटकयुक्त) हो जाती है।" }, locale)}
          </p>
        </div>
      </section>

      {/* ── SHIVA VAAS ──────────────────────────────────────────────────────── */}
      <section id="shiva-vaas" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20"><Star className="w-8 h-8 text-violet-300" /></div>}
          title={L.shivaVaas}
          subtitle={L.shivaVaasDesc}
          locale={locale}
        />

        <div className="space-y-4">
          {SHIVA_VAAS.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`p-6 rounded-2xl border ${row.border} ${row.bg}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex items-center gap-3 md:w-56 shrink-0">
                  <div className="text-3xl">{row.icon}</div>
                  <div>
                    <div className={`font-bold ${row.color}`}>{t(row.name, locale)}</div>
                    <div className="text-text-tertiary text-xs mt-0.5">
                      {t(L.tithi, locale)}: {row.tithis.join(', ')}
                    </div>
                    <div className="mt-1"><NatureBadge nature={row.nature} locale={locale} /></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">{t(row.desc, locale)}</p>
                  <div className={`p-3 rounded-xl border ${row.border} bg-black/20`}>
                    <div className="text-xs text-text-tertiary mb-0.5">{t(L.activities, locale)}</div>
                    <div className={`text-sm ${row.color}`}>{t(row.activities, locale)}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <div className="text-gold-primary font-semibold mb-2 text-sm">{t(L.practicalNote, locale)}</div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: 'Shiva Vaas is primarily used when planning Shiva puja, abhishek, Shivalinga pratishtha, and Tantric rites. Even in Shamshan and Krida Vaas, Shiva worship itself can be performed — the restriction is on other auspicious worldly activities. Samadhi Vaas is particularly favored by spiritual seekers for deep meditation and japa. The tithi-based system repeats across both Shukla Paksha (waxing) and Krishna Paksha (waning), with Purnima/Amavasya both counted as Tithi 15/30.', hi: 'शिव वास का उपयोग मुख्यतः शिव पूजा, अभिषेक, शिवलिंग प्रतिष्ठा और तंत्र अनुष्ठानों की योजना बनाने में होता है। श्मशान और क्रीड़ा वासों में भी भगवान शिव की पूजा की जा सकती है, लेकिन अन्य शुभ कार्यों से बचना चाहिए। समाधि वास आध्यात्मिक साधकों के लिए सर्वोत्तम है।', sa: 'शिव वास का उपयोग मुख्यतः शिव पूजा, अभिषेक, शिवलिंग प्रतिष्ठा और तंत्र अनुष्ठानों की योजना बनाने में होता है। श्मशान और क्रीड़ा वासों में भी भगवान शिव की पूजा की जा सकती है, लेकिन अन्य शुभ कार्यों से बचना चाहिए। समाधि वास आध्यात्मिक साधकों के लिए सर्वोत्तम है।' }, locale)}
          </p>
        </div>
      </section>

      {/* ── AGNI VAAS ───────────────────────────────────────────────────────── */}
      <section id="agni-vaas" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20"><Flame className="w-8 h-8 text-orange-400" /></div>}
          title={L.agniVaas}
          subtitle={L.agniVaasDesc}
          locale={locale}
        />

        <div className="grid md:grid-cols-2 gap-5">
          {AGNI_VAAS.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`p-6 rounded-2xl border ${row.border} ${row.bg}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className={`text-2xl mb-2`}>{row.symbol}</div>
                  <div className={`text-lg font-bold ${row.color}`}>{t(row.plane, locale)}</div>
                  <div className="text-text-tertiary text-xs">{t(row.dayNames, locale)}</div>
                </div>
                <NatureBadge nature={row.nature} locale={locale} />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{t(row.desc, locale)}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <div className="text-gold-primary font-semibold mb-2 text-sm">{t(L.textualBasis, locale)}</div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: 'Agni Vaas appears in Grhya Sutras and the Agni Purana in the context of planning fire ceremonies. It is especially critical for the Pancha Mahayajnas — the five great sacrifices. When Agni is in Akash, Soma-yagas (moon-related fire rituals) are especially potent. The Patala placement is associated with the underground fire Vadavagni, which in mythology periodically threatens to consume the oceans.', hi: 'अग्नि वास का वर्णन ग्रह्य सूत्रों और अग्नि पुराण में मिलता है। यह विशेष रूप से पंच महायज्ञों — ब्रह्म यज्ञ, देव यज्ञ, पितृ यज्ञ, भूत यज्ञ और नर यज्ञ — की योजना में महत्वपूर्ण है। अग्नि के आकाश वास में सोम-यागों का विशेष महत्व है।', sa: 'अग्नि वास का वर्णन ग्रह्य सूत्रों और अग्नि पुराण में मिलता है। यह विशेष रूप से पंच महायज्ञों — ब्रह्म यज्ञ, देव यज्ञ, पितृ यज्ञ, भूत यज्ञ और नर यज्ञ — की योजना में महत्वपूर्ण है। अग्नि के आकाश वास में सोम-यागों का विशेष महत्व है।' }, locale)}
          </p>
        </div>
      </section>

      {/* ── CHANDRA VAAS ────────────────────────────────────────────────────── */}
      <section id="chandra-vaas" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"><Moon className="w-8 h-8 text-blue-300" /></div>}
          title={L.chandraVaas}
          subtitle={L.chandraVaasDesc}
          locale={locale}
        />

        {/* Pada explanation */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: "Each Nakshatra spans 13°20′ of arc, divided into 4 padas (each 3°20′). In the Navamsha chart, each pada maps to a different sign. For Chandra Vaas purposes: Pada 1 = Deva, Pada 2 = Nara, Pada 3 = Pashava, Pada 4 = Rakshasa. The Moon spends approximately 3–4 hours in each pada. To know the current Chandra Vaas, check the live Panchang which calculates the Moon\'s precise longitude and its pada.", hi: "प्रत्येक नक्षत्र 13°20′ चाप का होता है, जिसे 4 पादों में बाँटा गया है (प्रत्येक 3°20′)। नवांश कुंडली में प्रत्येक पाद एक अलग राशि को दर्शाता है। चंद्र वास के संदर्भ में, पाद 1 = देव, पाद 2 = नर, पाद 3 = पशव, पाद 4 = राक्षस। चंद्रमा प्रत्येक पाद में लगभग 3-4 घंटे रहता है।", sa: "प्रत्येक नक्षत्र 13°20′ चाप का होता है, जिसे 4 पादों में बाँटा गया है (प्रत्येक 3°20′)। नवांश कुंडली में प्रत्येक पाद एक अलग राशि को दर्शाता है। चंद्र वास के संदर्भ में, पाद 1 = देव, पाद 2 = नर, पाद 3 = पशव, पाद 4 = राक्षस। चंद्रमा प्रत्येक पाद में लगभग 3-4 घंटे रहता है।" }, locale)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {CHANDRA_VAAS.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`p-6 rounded-2xl border ${row.border} ${row.bg}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-black ${row.color}`}>{row.symbol}</div>
                  <div>
                    <div className={`font-bold ${row.color}`}>{t(row.name, locale)}</div>
                    <div className="text-text-tertiary text-xs">{t(L.pada, locale)} {row.pada}</div>
                  </div>
                </div>
                <NatureBadge nature={row.nature} locale={locale} />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">{t(row.desc, locale)}</p>
              <div className={`p-3 rounded-xl border ${row.border} bg-black/20`}>
                <div className="text-xs text-text-tertiary mb-0.5">{t(L.activities, locale)}</div>
                <div className={`text-sm ${row.color}`}>{t(row.activities, locale)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── RAHU VAAS ───────────────────────────────────────────────────────── */}
      <section id="rahu-vaas" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"><Compass className="w-8 h-8 text-red-400" /></div>}
          title={L.rahuVaas}
          subtitle={L.rahuVaasDesc}
          locale={locale}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {RAHU_VAAS.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-center">
              <div className={`text-base font-bold ${row.color} mb-1`}>{t(row.day, locale)}</div>
              <div className="text-text-secondary text-lg font-black">{t(row.direction, locale)}</div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <div className="text-gold-primary font-semibold mb-2 text-sm">{t(L.practicalNote, locale)}</div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: "Rahu Vaas is particularly emphasized in South Indian (Tamil and Kerala) astrological traditions. It complements Disha Shool — while Disha Shool measures the direct planetary gaze, Rahu Vaas indicates the projection direction of the shadow planet Rahu. Avoid land purchase, foundation laying, and long-term construction in Rahu\'s direction. When Rahu Vaas coincides with Disha Shool in the same direction, that direction is doubly inauspicious for the entire day.", hi: "राहु वास मुख्य रूप से दक्षिण भारतीय (तमिल और केरल) ज्योतिष परंपराओं में उपयोग किया जाता है। यह दिशा शूल का पूरक है — जहाँ दिशा शूल ग्रह के प्रत्यक्ष प्रभाव को मापता है, वहीं राहु वास छाया ग्रह राहु की प्रक्षेपण दिशा को दर्शाता है। राहु वास दिशा में भूमि खरीद, नींव खुदाई और दीर्घकालिक निर्माण कार्य से बचने की सलाह दी जाती है।", sa: "राहु वास मुख्य रूप से दक्षिण भारतीय (तमिल और केरल) ज्योतिष परंपराओं में उपयोग किया जाता है। यह दिशा शूल का पूरक है — जहाँ दिशा शूल ग्रह के प्रत्यक्ष प्रभाव को मापता है, वहीं राहु वास छाया ग्रह राहु की प्रक्षेपण दिशा को दर्शाता है। राहु वास दिशा में भूमि खरीद, नींव खुदाई और दीर्घकालिक निर्माण कार्य से बचने की सलाह दी जाती है।" }, locale)}
          </p>
        </div>
      </section>

      {/* Summary comparison table */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gold-gradient mb-2">
            {t(L.comparativeSummary, locale)}
          </h2>
          <p className="text-text-secondary text-sm">
            {t(L.comparativeSubtitle, locale)}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.indicator, locale)}</th>
                <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.determinedBy, locale)}</th>
                <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.cycle, locale)}</th>
                <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.primaryUse, locale)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {SUMMARY_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-gold-primary/3 transition-colors">
                  <td className="py-3 px-4 text-gold-light font-medium">{t(row.name, locale)}</td>
                  <td className="py-3 px-4 text-text-secondary">{t(row.det, locale)}</td>
                  <td className="py-3 px-4 text-text-secondary">{t(row.cycle, locale)}</td>
                  <td className="py-3 px-4 text-text-secondary">{t(row.use, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-gold-primary/10 to-violet-500/5 border border-gold-primary/20">
          <h3 className="text-xl font-bold text-gold-gradient mb-3">
            {t(L.viewTodayNivas, locale)}
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            {t(L.ctaDesc, locale)}
          </p>
          <Link href="/panchang"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors">
            {t(L.openPanchang, locale)}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
