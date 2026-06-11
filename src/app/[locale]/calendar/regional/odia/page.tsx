import { tl } from '@/lib/utils/trilingual';
import { setRequestLocale } from 'next-intl/server';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';
import { engineDate as ed, nextUpcoming, todayInIst } from '@/lib/seo/regional-faq-dates';
import { pickRegionalChrome as RC } from '@/lib/content/regional-chrome-labels';

const LABELS = {
  title: {
    en: 'Odia Calendar (Panji) 2026-2027',
    hi: 'ओड़िआ कैलेंडर (पंजी) 2026-2027',
    sa: 'ओड़िआपञ्जी 2026-2027',
    ta: 'ஒடியா நாள்காட்டி (பஞ்சி) 2026-2027',
    bn: 'ওড়িয়া ক্যালেন্ডার (পঞ্জি) 2026-2027',
    mai: "ओडिया पञ्चाङ्ग (पञ्जी) २०२६-२०२७",
    mr: "ओडिया कॅलेंडर (पंजी) २०२६-२०२७",
    te: "ఒడియా పంచాంగం (పన్జీ) 2026-2027",
    kn: "ಒಡಿಯಾ ಪಂಚಾಂಗ (ಪಂಜಿ) ೨೦೨೬-೨೦೨೭",
    gu: "ઓડિયા કેલેન્ડર (પંજી) ૨૦૨૬-૨૦૨૭",
  },
  titleOdia: {
    en: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
    hi: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
    sa: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
    ta: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
    bn: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
    mai: "ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭",
    mr: "ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭",
    te: "ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭",
    kn: "ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭",
    gu: "ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭",
  },
  intro: {
    en: 'The Odia calendar, known as the "Panji" (ପଞ୍ଜି), is the traditional solar calendar of the Odia-speaking people of Odisha and neighbouring regions. Rooted in the Surya Siddhanta astronomical system, the Panji governs all religious observances, agricultural cycles, and festival timings for over 50 million Odia speakers worldwide. Unlike the lunisolar calendars of North India, the Odia calendar is fundamentally solar: each month begins when the Sun transits into a new zodiac sign (Sankranti), making Sankranti dates the cornerstone of the entire system. The Odia era, known as Amli or Onkia, counts from the year the Ganga dynasty established rule over Odisha. The Panji is published annually by traditional almanac publishers and remains the authoritative reference for temple rituals at the Jagannath Temple in Puri, the most important Hindu shrine in eastern India. The current Odia year is 1435 Amli (beginning Pana Sankranti, 14 April 2026).',
    hi: 'ओड़िआ कैलेंडर, जिसे "पंजी" (ପଞ୍ଜି) कहा जाता है, ओडिशा और पड़ोसी क्षेत्रों के ओड़िआ भाषी लोगों का पारम्परिक सौर कैलेंडर है।',
    sa: 'ओड्रपञ्जी ओड्रभाषिणां पारम्परिकं सौरपञ्चाङ्गम्।',
    ta: 'ஒடியா நாள்காட்டி, "பஞ்சி" (ପଞ୍ଜି) என அறியப்படுவது, ஒடிசா மற்றும் அண்டை பகுதிகளின் ஒடியா மொழி பேசும் மக்களின் பாரம்பரிய சூரிய நாள்காட்டி ஆகும்.',
    bn: 'ওড়িয়া ক্যালেন্ডার, যা "পঞ্জি" (ପଞ୍ଜି) নামে পরিচিত, ওড়িশা এবং প্রতিবেশী অঞ্চলের ওড়িয়াভাষী মানুষদের ঐতিহ্যবাহী সৌর ক্যালেন্ডার।',
    mai: "ओडिया पञ्चाङ्ग, जेकरा \"पञ्जी\" (ପଞ୍ଜି) क नाम सँ जानल जाइत अछि, ओ ओडिशा आ पड़ोसी क्षेत्रक ओडिया-भाषी लोकक परम्परागत सौर पञ्चाङ्ग अछि। सूर्य सिद्धान्त ज्योतिषीय प्रणाली पर आधारित ई पञ्जी, विश्वभरि ५ करोड़ सँ बेसी ओडिया भाषी लोकक लेल सभ धार्मिक अनुष्ठान, कृषि चक्र आ पर्वक समय केँ निर्धारित करैत अछि। उत्तर भारतक चान्द्र-सौर पञ्चाङ्गक विपरीत, ओडिया पञ्चाङ्ग मूल रूप सँ सौर अछि: प्रत्येक मास तखन शुरू होइत अछि जखन सूर्य एकटा नव राशि (संक्रान्ति) मे प्रवेश करैत अछि, जाहि सँ संक्रान्ति तिथि सभटा प्रणालीक आधारशिला बनि जाइत अछि। ओडिया युग, जेकरा अम्ली वा ओनकिया क नाम सँ जानल जाइत अछि, ओहि वर्ष सँ गणना कएल जाइत अछि जखन गंगा राजवंश ओडिशा पर शासन स्थापित केलक। ई पञ्जी परम्परागत पञ्चाङ्ग प्रकाशक द्वारा प्रतिवर्ष प्रकाशित कएल जाइत अछि आ पूर्वी भारतक सभसँ महत्वपूर्ण हिन्दू तीर्थ, पुरीक जगन्नाथ मन्दिर मे मन्दिरक अनुष्ठानक लेल आधिकारिक सन्दर्भ बनल अछि। वर्तमान ओडिया वर्ष १४३५ अम्ली अछि (पाना संक्रान्ति, १४ अप्रैल २०२६ सँ शुरू)।",
    mr: "ओडिया कॅलेंडर, ज्याला 'पंजी' (ପଞ୍ଜି) म्हणून ओळखले जाते, हे ओडिशा आणि शेजारील प्रदेशांतील ओडिया भाषिक लोकांचे पारंपरिक सौर कॅलेंडर आहे. सूर्य सिद्धांत खगोलशास्त्रीय प्रणालीवर आधारित असलेली ही पंजी जगभरातील ५० दशलक्षाहून अधिक ओडिया भाषकांसाठी सर्व धार्मिक विधी, कृषी चक्र आणि सणांच्या वेळा निश्चित करते. उत्तर भारतातील चांद्र-सौर कॅलेंडरच्या विपरीत, ओडिया कॅलेंडर मूलतः सौर आहे: प्रत्येक महिना सूर्य एका नवीन राशीत (संक्रांती) प्रवेश करतो तेव्हा सुरू होतो, ज्यामुळे संक्रांतीच्या तारखा संपूर्ण प्रणालीचा आधारस्तंभ बनतात. ओडिया युग, ज्याला अम्ली किंवा ओनकिया म्हणून ओळखले जाते, ते गंगा राजघराण्याने ओडिशावर राज्य स्थापन केल्याच्या वर्षापासून मोजले जाते. पंजी पारंपरिक पंचांग प्रकाशकांद्वारे दरवर्षी प्रकाशित केली जाते आणि पूर्व भारतातील सर्वात महत्त्वाचे हिंदू तीर्थक्षेत्र असलेल्या पुरी येथील जगन्नाथ मंदिरातील धार्मिक विधींसाठी अधिकृत संदर्भ म्हणून वापरली जाते. सध्याचे ओडिया वर्ष १४३५ अम्ली आहे (पाना संक्रांती, १४ एप्रिल २०२६ पासून सुरू).",
    te: "ఒడియా క్యాలెండర్, \"పన్జీ\" (ପଞ୍ଜି) అని పిలువబడుతుంది, ఒడిశా మరియు పొరుగు ప్రాంతాలలోని ఒడియా మాట్లాడే ప్రజల సాంప్రదాయ సౌర క్యాలెండర్. సూర్య సిద్ధాంత ఖగోళ వ్యవస్థలో పాతుకుపోయింది, పన్జీ ప్రపంచవ్యాప్తంగా 50 మిలియన్లకు పైగా ఒడియా మాట్లాడేవారికి అన్ని మతపరమైన ఆచారాలు, వ్యవసాయ చక్రాలు మరియు పండుగల సమయాలను నియంత్రిస్తుంది. ఉత్తర భారతదేశంలోని చాంద్రమాన క్యాలెండర్‌ల వలె కాకుండా, ఒడియా క్యాలెండర్ ప్రధానంగా సౌర క్యాలెండర్: ప్రతి నెల సూర్యుడు కొత్త రాశిలోకి ప్రవేశించినప్పుడు (సంక్రాంతి) ప్రారంభమవుతుంది, సంక్రాంతి తేదీలు మొత్తం వ్యవస్థకు మూలస్తంభంగా మారతాయి. అమ్లి లేదా ఒంకియా అని పిలువబడే ఒడియా శకం, గంగా రాజవంశం ఒడిశాపై పాలనను స్థాపించిన సంవత్సరం నుండి లెక్కించబడుతుంది. పన్జీని సాంప్రదాయ పంచాంగ ప్రచురణకర్తలు ఏటా ప్రచురిస్తారు మరియు తూర్పు భారతదేశంలోని అత్యంత ముఖ్యమైన హిందూ పుణ్యక్షేత్రమైన పూరిలోని జగన్నాథ దేవాలయంలోని ఆలయ ఆచారాలకు అధికారిక సూచనగా మిగిలి ఉంది. ప్రస్తుత ఒడియా సంవత్సరం 1435 అమ్లి (పానా సంక్రాంతి, ఏప్రిల్ 14, 2026న ప్రారంభమవుతుంది).",
    kn: "ಒಡಿಯಾ ಕ್ಯಾಲೆಂಡರ್, ಇದನ್ನು \"ಪಂಜಿ\" (ପଞ୍ଜି) ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ, ಇದು ಒಡಿಶಾ ಮತ್ತು ನೆರೆಯ ಪ್ರದೇಶಗಳ ಒಡಿಯಾ ಭಾಷೆ ಮಾತನಾಡುವ ಜನರ ಸಾಂಪ್ರದಾಯಿಕ ಸೌರ ಕ್ಯಾಲೆಂಡರ್ ಆಗಿದೆ. ಸೂರ್ಯ ಸಿದ್ಧಾಂತ ಖಗೋಳ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ಬೇರೂರಿದೆ, ಪಂಜಿಯು ವಿಶ್ವದಾದ್ಯಂತ ೫೦ ದಶಲಕ್ಷಕ್ಕೂ ಹೆಚ್ಚು ಒಡಿಯಾ ಭಾಷಿಕರಿಗೆ ಎಲ್ಲಾ ಧಾರ್ಮಿಕ ಆಚರಣೆಗಳು, ಕೃಷಿ ಚಕ್ರಗಳು ಮತ್ತು ಹಬ್ಬಗಳ ಸಮಯವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ. ಉತ್ತರ ಭಾರತದ ಚಂದ್ರ-ಸೌರ ಕ್ಯಾಲೆಂಡರ್‌ಗಳಿಗಿಂತ ಭಿನ್ನವಾಗಿ, ಒಡಿಯಾ ಕ್ಯಾಲೆಂಡರ್ ಮೂಲಭೂತವಾಗಿ ಸೌರವಾಗಿದೆ: ಪ್ರತಿ ತಿಂಗಳು ಸೂರ್ಯನು ಹೊಸ ರಾಶಿಚಕ್ರ ಚಿಹ್ನೆಗೆ (ಸಂಕ್ರಾಂತಿ) ಪ್ರವೇಶಿಸಿದಾಗ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ, ಸಂಕ್ರಾಂತಿ ದಿನಾಂಕಗಳನ್ನು ಇಡೀ ವ್ಯವಸ್ಥೆಯ ಮೂಲಾಧಾರವನ್ನಾಗಿ ಮಾಡುತ್ತದೆ. ಅಮ್ಲಿ ಅಥವಾ ಒಂಕಿಯಾ ಎಂದು ಕರೆಯಲ್ಪಡುವ ಒಡಿಯಾ ಯುಗವು ಗಂಗಾ ರಾಜವಂಶವು ಒಡಿಶಾದಲ್ಲಿ ಆಳ್ವಿಕೆಯನ್ನು ಸ್ಥಾಪಿಸಿದ ವರ್ಷದಿಂದ ಎಣಿಕೆ ಮಾಡುತ್ತದೆ. ಪಂಜಿಯನ್ನು ಸಾಂಪ್ರದಾಯಿಕ ಪಂಚಾಂಗ ಪ್ರಕಾಶಕರು ವಾರ್ಷಿಕವಾಗಿ ಪ್ರಕಟಿಸುತ್ತಾರೆ ಮತ್ತು ಪೂರ್ವ ಭಾರತದ ಪ್ರಮುಖ ಹಿಂದೂ ದೇವಾಲಯವಾದ ಪುರಿಯ ಜಗನ್ನಾಥ ದೇವಾಲಯದಲ್ಲಿನ ದೇವಾಲಯದ ಆಚರಣೆಗಳಿಗೆ ಅಧಿಕೃತ ಉಲ್ಲೇಖವಾಗಿ ಉಳಿದಿದೆ. ಪ್ರಸ್ತುತ ಒಡಿಯಾ ವರ್ಷವು ೧೪೩೫ ಅಮ್ಲಿ (ಪಾನ ಸಂಕ್ರಾಂತಿ, ೧೪ ಏಪ್ರಿಲ್ ೨೦೨೬ ರಂದು ಪ್ರಾರಂಭವಾಗುತ್ತದೆ).",
    gu: "ઓડિયા કેલેન્ડર, જેને \"પંજી\" (ପଞ୍ଜି) તરીકે ઓળખવામાં આવે છે, તે ઓડિશા અને પડોશી પ્રદેશોના ઓડિયા ભાષી લોકોનું પરંપરાગત સૌર કેલેન્ડર છે. સૂર્ય સિદ્ધાંત ખગોળીય પ્રણાલીમાં મૂળ ધરાવતું, પંજી વિશ્વભરના ૫૦ મિલિયનથી વધુ ઓડિયા ભાષીઓ માટે તમામ ધાર્મિક વિધિઓ, કૃષિ ચક્ર અને તહેવારોના સમયનું સંચાલન કરે છે. ઉત્તર ભારતના ચાંદ્ર-સૌર કેલેન્ડરથી વિપરીત, ઓડિયા કેલેન્ડર મૂળભૂત રીતે સૌર છે: દરેક મહિનો ત્યારે શરૂ થાય છે જ્યારે સૂર્ય એક નવી રાશિમાં (સંક્રાંતિ) પ્રવેશ કરે છે, જે સંક્રાંતિની તારીખોને સમગ્ર પ્રણાલીનો આધારસ્તંભ બનાવે છે. ઓડિયા યુગ, જેને અમલી અથવા ઓંકિયા તરીકે ઓળખવામાં આવે છે, તે ગંગા રાજવંશે ઓડિશા પર શાસન સ્થાપિત કર્યું તે વર્ષથી ગણાય છે. પંજી પરંપરાગત પંચાંગ પ્રકાશકો દ્વારા વાર્ષિક ધોરણે પ્રકાશિત થાય છે અને પૂર્વ ભારતના સૌથી મહત્વપૂર્ણ હિંદુ તીર્થસ્થાન, પુરીના જગન્નાથ મંદિરમાં મંદિરની વિધિઓ માટે અધિકૃત સંદર્ભ તરીકે રહે છે. વર્તમાન ઓડિયા વર્ષ ૧૪૩૫ અમલી છે (પાન સંક્રાંતિ, ૧૪ એપ્રિલ ૨૦૨૬ થી શરૂ થાય છે).",
  },
  monthsTitle: {
    en: 'The 12 Odia Months (ବାର ମାସ)',
    hi: '12 ओड़िआ मास (ବାର ମାସ)',
    sa: '१२ ओड्रमासाः',
    ta: '12 ஒடியா மாதங்கள்',
    bn: '১২টি ওড়িয়া মাস',
    mai: "१२ ओडिया मास (बारह मास)",
    mr: "१२ ओडिया महिने (ବାର ମାସ)",
    te: "12 ఒడియా నెలలు (బార మాస)",
    kn: "೧೨ ಒಡಿಯಾ ತಿಂಗಳುಗಳು (ବାର ಮಾସ)",
    gu: "૧૨ ઓડિયા મહિના (ବାର ମାସ)",
  },
  monthsIntro: {
    en: 'The Odia calendar follows the Surya Siddhanta solar system, where each month begins on the Sankranti (the day the Sun enters a new zodiac sign). Month lengths vary between 29 and 32 days depending on the Sun\'s apparent speed through each sign.',
    hi: 'ओड़िआ कैलेंडर सूर्य सिद्धान्त सौर प्रणाली का अनुसरण करता है।',
    sa: 'ओड्रपञ्चाङ्गं सूर्यसिद्धान्तसौरपद्धतिम् अनुसरति।',
    ta: 'ஒடியா நாள்காட்டி சூரிய சித்தாந்த சூரிய முறையைப் பின்பற்றுகிறது.',
    bn: 'ওড়িয়া ক্যালেন্ডার সূর্য সিদ্ধান্ত সৌর পদ্ধতি অনুসরণ করে।',
    mai: "ओडिया पञ्चाङ्ग सूर्य सिद्धान्त सौर प्रणालीक पालन करैत अछि, जतय प्रत्येक मास संक्रान्ति (जाहि दिन सूर्य एकटा नव राशि मे प्रवेश करैत अछि) सँ शुरू होइत अछि। मासक अवधि २९ सँ ३२ दिनक बीच भिन्न होइत अछि, जे सूर्यक प्रत्येक राशि मे आभासी गति पर निर्भर करैत अछि।",
    mr: "ओडिया कॅलेंडर सूर्य सिद्धांत सौर प्रणालीचे अनुसरण करते, जिथे प्रत्येक महिना संक्रांतीला (सूर्य नवीन राशीत प्रवेश करतो तो दिवस) सुरू होतो. प्रत्येक राशीतून सूर्याच्या भासमान गतीनुसार महिन्यांची लांबी २९ ते ३२ दिवसांपर्यंत बदलते.",
    te: "ఒడియా క్యాలెండర్ సూర్య సిద్ధాంత సౌర వ్యవస్థను అనుసరిస్తుంది, ఇక్కడ ప్రతి నెల సంక్రాంతి (సూర్యుడు కొత్త రాశిలోకి ప్రవేశించే రోజు) నాడు ప్రారంభమవుతుంది. ప్రతి రాశిలో సూర్యుని కనిపించే వేగం ఆధారంగా నెలల నిడివి 29 నుండి 32 రోజుల మధ్య మారుతుంది.",
    kn: "ಒಡಿಯಾ ಕ್ಯಾಲೆಂಡರ್ ಸೂರ್ಯ ಸಿದ್ಧಾಂತ ಸೌರ ವ್ಯವಸ್ಥೆಯನ್ನು ಅನುಸರಿಸುತ್ತದೆ, ಇಲ್ಲಿ ಪ್ರತಿ ತಿಂಗಳು ಸಂಕ್ರಾಂತಿಯಂದು (ಸೂರ್ಯನು ಹೊಸ ರಾಶಿಚಕ್ರ ಚಿಹ್ನೆಗೆ ಪ್ರವೇಶಿಸುವ ದಿನ) ಪ್ರಾರಂಭವಾಗುತ್ತದೆ. ಪ್ರತಿ ರಾಶಿಚಕ್ರ ಚಿಹ್ನೆಯ ಮೂಲಕ ಸೂರ್ಯನ ಸ್ಪಷ್ಟ ವೇಗವನ್ನು ಅವಲಂಬಿಸಿ ತಿಂಗಳ ಅವಧಿಗಳು ೨೯ ರಿಂದ ೩೨ ದಿನಗಳ ನಡುವೆ ಬದಲಾಗುತ್ತವೆ.",
    gu: "ઓડિયા કેલેન્ડર સૂર્ય સિદ્ધાંત સૌર પ્રણાલીને અનુસરે છે, જ્યાં દરેક મહિનો સંક્રાંતિના દિવસે (જે દિવસે સૂર્ય નવી રાશિમાં પ્રવેશ કરે છે) શરૂ થાય છે. દરેક રાશિમાં સૂર્યની દેખીતી ગતિના આધારે મહિનાની લંબાઈ ૨૯ થી ૩૨ દિવસની વચ્ચે બદલાય છે.",
  },
  rathYatraTitle: {
    en: 'Rath Yatra  –  The Chariot Festival of Lord Jagannath',
    hi: 'रथ यात्रा  –  भगवान जगन्नाथ का रथ महोत्सव',
    sa: 'रथयात्रा  –  जगन्नाथस्य रथमहोत्सवः',
    ta: 'ரத யாத்திரை  –  ஜகன்னாத் ரத திருவிழா',
    bn: 'রথযাত্রা  –  জগন্নাথের রথ মহোৎসব',
    mai: "रथ यात्रा – भगवान जगन्नाथक रथ पर्व",
    mr: "रथयात्रा – भगवान जगन्नाथाचा रथोत्सव",
    te: "రథయాత్ర – జగన్నాథుని రథోత్సవం",
    kn: "ರಥ ಯಾತ್ರೆ – ಭಗವಾನ್ ಜಗನ್ನಾಥನ ರಥೋತ್ಸವ",
    gu: "રથયાત્રા – ભગવાન જગન્નાથનો રથ ઉત્સવ",
  },
  rathYatraText: {
    en: 'The Rath Yatra of Puri is the most iconic festival of Odisha and one of the oldest chariot processions in the world, drawing millions of devotees annually. Rath Yatra 2026 falls on Monday, 29 June, with Bahuda Yatra on Tuesday, 7 July, and Suna Besha on Wednesday, 8 July.',
    hi: 'पुरी की रथ यात्रा ओडिशा का सबसे प्रतिष्ठित त्योहार है। रथ यात्रा 2026 सोमवार, 29 जून को पड़ती है।',
    sa: 'पुरीनगरस्य रथयात्रा ओड्रदेशस्य सर्वश्रेष्ठं पर्वम्।',
    ta: 'புரி ரத யாத்திரை ஒடிசாவின் மிகச் சிறந்த திருவிழாவும் உலகின் மிகப் பழமையான ரத ஊர்வலங்களில் ஒன்றுமாகும்.',
    bn: 'পুরীর রথযাত্রা ওড়িশার সবচেয়ে প্রতিষ্ঠিত উৎসব।',
    mai: "पुरीक रथ यात्रा ओडिशाक सभसँ प्रतिष्ठित पर्व आ विश्वक सभसँ पुरान रथ यात्रा मे सँ एक अछि, जे प्रतिवर्ष लाखो भक्त केँ आकर्षित करैत अछि। रथ यात्रा २०२६ सोमदिन, २९ जून केँ पड़त, जाहि मे बाहुड़ा यात्रा मंगलदिन, ७ जुलाई केँ आ सुना बेशा बुधदिन, ८ जुलाई केँ अछि।",
    mr: "पुरीची रथयात्रा हा ओडिशाचा सर्वात प्रतिष्ठित उत्सव आहे आणि जगातील सर्वात जुन्या रथयात्रांपैकी एक आहे, ज्यात दरवर्षी लाखो भाविक सहभागी होतात. २०२६ ची रथयात्रा सोमवार, २९ जून रोजी आहे, तर बाहुडा यात्रा मंगळवार, ७ जुलै रोजी आणि सुना बेशा बुधवार, ८ जुलै रोजी आहे.",
    te: "పూరి రథయాత్ర ఒడిశాలోని అత్యంత ప్రసిద్ధ పండుగ మరియు ప్రపంచంలోని పురాతన రథయాత్రలలో ఒకటి, ఏటా మిలియన్ల మంది భక్తులను ఆకర్షిస్తుంది. 2026 రథయాత్ర జూన్ 29, సోమవారం నాడు వస్తుంది, బహుదా యాత్ర జూలై 7, మంగళవారం నాడు మరియు సునా బేషా జూలై 8, బుధవారం నాడు.",
    kn: "ಪುರಿಯ ರಥ ಯಾತ್ರೆಯು ಒಡಿಶಾದ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ಹಬ್ಬವಾಗಿದೆ ಮತ್ತು ವಿಶ್ವದ ಅತ್ಯಂತ ಹಳೆಯ ರಥ ಮೆರವಣಿಗೆಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ, ಇದು ವಾರ್ಷಿಕವಾಗಿ ಲಕ್ಷಾಂತರ ಭಕ್ತರನ್ನು ಆಕರ್ಷಿಸುತ್ತದೆ. ೨೦೨೬ ರ ರಥ ಯಾತ್ರೆಯು ಸೋಮವಾರ, ಜೂನ್ ೨೯ ರಂದು ಬರುತ್ತದೆ, ಬಹುದಾ ಯಾತ್ರೆಯು ಮಂಗಳವಾರ, ಜುಲೈ ೭ ರಂದು ಮತ್ತು ಸುನಾ ಬೇಶಾ ಬುಧವಾರ, ಜುಲೈ ೮ ರಂದು ಇರುತ್ತದೆ.",
    gu: "પુરીની રથયાત્રા ઓડિશાનો સૌથી પ્રતિકાત્મક તહેવાર છે અને વિશ્વની સૌથી જૂની રથયાત્રાઓમાંની એક છે, જે વાર્ષિક લાખો ભક્તોને આકર્ષે છે. રથયાત્રા ૨૦૨૬ સોમવાર, ૨૯ જૂનના રોજ છે, જેમાં બહુડા યાત્રા મંગળવાર, ૭ જુલાઈના રોજ અને સુના બેસા બુધવાર, ૮ જુલાઈના રોજ છે.",
  },
  rajaParbaTitle: {
    en: 'Raja Parba  –  Celebrating the Earth\'s Fertility',
    hi: 'रज पर्व  –  पृथ्वी की उर्वरता का उत्सव',
    sa: 'रजपर्व  –  पृथिव्याः उर्वरतोत्सवः',
    ta: 'ராஜா பர்பா  –  பூமியின் கருவுறுதல் கொண்டாட்டம்',
    bn: 'রাজা পর্ব  –  পৃথিবীর উর্বরতার উৎসব',
    mai: "राजा पर्व – पृथ्वीक उर्वरताक उत्सव",
    mr: "राजा पर्व – पृथ्वीच्या सुपीकतेचा उत्सव",
    te: "రాజా పర్బ – భూమి యొక్క సంతానోత్పత్తిని జరుపుకోవడం",
    kn: "ರಾಜ ಪರ್ಬ – ಭೂಮಿಯ ಫಲವತ್ತತೆಯನ್ನು ಆಚರಿಸುವುದು",
    gu: "રાજા પર્બ – પૃથ્વીની ફળદ્રુપતાની ઉજવણી",
  },
  rajaParbaText: {
    en: 'Raja Parba (ରଜ ପର୍ବ) is a unique three-day festival celebrated exclusively in Odisha, honouring the earth\'s annual cycle of fertility. Raja Parba 2026 falls on Sunday, 14 June to Tuesday, 16 June.',
    hi: 'रज पर्व (ରଜ ପର୍ବ) ओडिशा में विशेष रूप से मनाया जाने वाला एक अनूठा तीन-दिवसीय त्योहार है। रज पर्व 2026 रविवार 14 जून से मंगलवार 16 जून तक पड़ता है।',
    sa: 'रजपर्व (ରଜ ପର୍ବ) ओड्रदेशे विशिष्टम् त्रिदिवसीयं पर्वम्।',
    ta: 'ராஜா பர்பா (ରଜ ପର୍ବ) ஒடிசாவில் மட்டுமே கொண்டாடப்படும் தனித்துவமான மூன்று நாள் திருவிழா.',
    bn: 'রাজা পর্ব (ରଜ ପର୍ବ) ওড়িশায় বিশেষভাবে পালিত একটি অনন্য তিন দিনের উৎসব।',
    mai: "राजा पर्व (ରଜ ପର୍ବ) एकटा अनुपम तीन दिवसीय पर्व अछि जे विशेष रूप सँ ओडिशा मे मनाओल जाइत अछि, जे पृथ्वीक वार्षिक उर्वरता चक्रक सम्मान करैत अछि। राजा पर्व २०२६ रविदिन, १४ जून सँ मंगलदिन, १६ जून धरि पड़त।",
    mr: "राजा पर्व (ରଜ ପର୍ବ) हा ओडिशा मध्येच साजरा केला जाणारा एक अनोखा तीन दिवसांचा उत्सव आहे, जो पृथ्वीच्या वार्षिक सुपीकतेच्या चक्राचा सन्मान करतो. २०२६ चे राजा पर्व रविवार, १४ जून ते मंगळवार, १६ जून या कालावधीत आहे.",
    te: "రాజా పర్బ (ରଜ ପର୍ବ) ఒడిశాలో ప్రత్యేకంగా జరుపుకునే ఒక ప్రత్యేకమైన మూడు రోజుల పండుగ, భూమి యొక్క వార్షిక సంతానోత్పత్తి చక్రాన్ని గౌరవిస్తుంది. 2026 రాజా పర్బ జూన్ 14, ఆదివారం నుండి జూన్ 16, మంగళవారం వరకు వస్తుంది.",
    kn: "ರಾಜ ಪರ್ಬ (ରଜ ପର୍ବ) ಒಡಿಶಾದಲ್ಲಿ ಮಾತ್ರ ಆಚರಿಸಲಾಗುವ ಒಂದು ವಿಶಿಷ್ಟ ಮೂರು ದಿನಗಳ ಹಬ್ಬವಾಗಿದೆ, ಇದು ಭೂಮಿಯ ವಾರ್ಷಿಕ ಫಲವತ್ತತೆಯ ಚಕ್ರವನ್ನು ಗೌರವಿಸುತ್ತದೆ. ೨೦೨೬ ರ ರಾಜ ಪರ್ಬವು ಭಾನುವಾರ, ಜೂನ್ ೧೪ ರಿಂದ ಮಂಗಳವಾರ, ಜೂನ್ ೧೬ ರವರೆಗೆ ಬರುತ್ತದೆ.",
    gu: "રાજા પર્બ (ରଜ ପର୍ବ) એ ઓડિશામાં જ ઉજવાતો એક અનોખો ત્રણ દિવસીય તહેવાર છે, જે પૃથ્વીના વાર્ષિક ફળદ્રુપતા ચક્રનું સન્માન કરે છે. રાજા પર્બ ૨૦૨૬ રવિવાર, ૧૪ જૂન થી મંગળવાર, ૧૬ જૂન સુધી છે.",
  },
  calendarCharTitle: {
    en: 'How the Odia Calendar Works',
    hi: 'ओड़िआ कैलेंडर कैसे काम करता है',
    sa: 'ओड्रपञ्जी कथं कार्यं करोति',
    ta: 'ஒடியா நாள்காட்டி எவ்வாறு செயல்படுகிறது',
    bn: 'ওড়িয়া ক্যালেন্ডার কীভাবে কাজ করে',
    mai: "ओडिया पञ्चाङ्ग कोना काज करैत अछि",
    mr: "ओडिया कॅलेंडर कसे कार्य करते",
    te: "ఒడియా క్యాలెండర్ ఎలా పనిచేస్తుంది",
    kn: "ಒಡಿಯಾ ಕ್ಯಾಲೆಂಡರ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    gu: "ઓડિયા કેલેન્ડર કેવી રીતે કાર્ય કરે છે",
  },
  calendarCharText: {
    en: 'The Odia calendar is a sidereal solar calendar based on the Surya Siddhanta. Each month begins on the Sankranti — the day the Sun enters a new rashi (zodiac sign). The Jagannath Temple in Puri follows the Panji exclusively for determining the dates of all 13 major annual festivals.',
    hi: 'ओड़िआ कैलेंडर सूर्य सिद्धान्त पर आधारित एक नाक्षत्र सौर कैलेंडर है। प्रत्येक मास संक्रान्ति पर आरम्भ होता है।',
    sa: 'ओड्रपञ्चाङ्गं सूर्यसिद्धान्ते आधारितं नाक्षत्रसौरपञ्चाङ्गम्।',
    ta: 'ஒடியா நாள்காட்டி சூரிய சித்தாந்தத்தின் அடிப்படையிலான நாட்சத்திர சூரிய நாள்காட்டி ஆகும்.',
    bn: 'ওড়িয়া ক্যালেন্ডার সূর্য সিদ্ধান্তের উপর ভিত্তি করে একটি নাক্ষত্রিক সৌর ক্যালেন্ডার।',
    mai: "ओडिया पञ्चाङ्ग सूर्य सिद्धान्त पर आधारित एकटा निरयण सौर पञ्चाङ्ग अछि। प्रत्येक मास संक्रान्ति सँ शुरू होइत अछि — जाहि दिन सूर्य एकटा नव राशि मे प्रवेश करैत अछि। पुरीक जगन्नाथ मन्दिर सभ १३ प्रमुख वार्षिक पर्वक तिथि निर्धारित करबाक लेल विशेष रूप सँ पञ्जीक पालन करैत अछि।",
    mr: "ओडिया कॅलेंडर हे सूर्य सिद्धांतावर आधारित एक नाक्षत्र सौर कॅलेंडर आहे. प्रत्येक महिना संक्रांतीला सुरू होतो — ज्या दिवशी सूर्य नवीन राशीत (रास) प्रवेश करतो. पुरी येथील जगन्नाथ मंदिर १३ प्रमुख वार्षिक उत्सवांच्या तारखा निश्चित करण्यासाठी केवळ पंजीचे अनुसरण करते.",
    te: "ఒడియా క్యాలెండర్ సూర్య సిద్ధాంతం ఆధారంగా ఒక నక్షత్ర సౌర క్యాలెండర్. ప్రతి నెల సంక్రాంతి నాడు ప్రారంభమవుతుంది — సూర్యుడు కొత్త రాశిలోకి ప్రవేశించే రోజు. పూరిలోని జగన్నాథ దేవాలయం 13 ప్రధాన వార్షిక పండుగల తేదీలను నిర్ణయించడానికి పన్జీని ప్రత్యేకంగా అనుసరిస్తుంది.",
    kn: "ಒಡಿಯಾ ಕ್ಯಾಲೆಂಡರ್ ಸೂರ್ಯ ಸಿದ್ಧಾಂತವನ್ನು ಆಧರಿಸಿದ ಒಂದು ಸಿದ್ಧಾಂತ ಸೌರ ಕ್ಯಾಲೆಂಡರ್ ಆಗಿದೆ. ಪ್ರತಿ ತಿಂಗಳು ಸಂಕ್ರಾಂತಿಯಂದು ಪ್ರಾರಂಭವಾಗುತ್ತದೆ — ಸೂರ್ಯನು ಹೊಸ ರಾಶಿಗೆ (ರಾಶಿಚಕ್ರ ಚಿಹ್ನೆ) ಪ್ರವೇಶಿಸುವ ದಿನ. ಪುರಿಯ ಜಗನ್ನಾಥ ದೇವಾಲಯವು ಎಲ್ಲಾ ೧೩ ಪ್ರಮುಖ ವಾರ್ಷಿಕ ಹಬ್ಬಗಳ ದಿನಾಂಕಗಳನ್ನು ನಿರ್ಧರಿಸಲು ಪಂಜಿಯನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ಅನುಸರಿಸುತ್ತದೆ.",
    gu: "ઓડિયા કેલેન્ડર સૂર્ય સિદ્ધાંત પર આધારિત એક નિરયન સૌર કેલેન્ડર છે. દરેક મહિનો સંક્રાંતિના દિવસે શરૂ થાય છે — જે દિવસે સૂર્ય નવી રાશિમાં પ્રવેશ કરે છે. પુરીમાં આવેલું જગન્નાથ મંદિર તેના તમામ ૧૩ મુખ્ય વાર્ષિક તહેવારોની તારીખો નક્કી કરવા માટે ફક્ત પંજીને જ અનુસરે છે.",
  },
  festivalsTitle: {
    en: 'Major Odia Festivals 2026 — Dates, Tithi & Nakshatra',
    hi: 'प्रमुख ओड़िआ त्योहार 2026 — तिथियां, तिथि और नक्षत्र',
    sa: 'प्रमुखोड्रपर्वाणि 2026',
    ta: 'முக்கிய ஒடியா திருவிழாக்கள் 2026',
    bn: 'প্রধান ওড়িয়া উৎসব 2026',
    mai: "प्रमुख ओडिया पर्व २०२६ — तिथि आ नक्षत्र",
    mr: "प्रमुख ओडिया उत्सव २०२६ — तारखा, तिथी आणि नक्षत्र",
    te: "2026 ప్రధాన ఒడియా పండుగలు — తేదీలు, తిథి & నక్షత్రం",
    kn: "ಪ್ರಮುಖ ಒಡಿಯಾ ಹಬ್ಬಗಳು ೨೦೨೬ — ದಿನಾಂಕಗಳು, ತಿಥಿ ಮತ್ತು ನಕ್ಷತ್ರ",
    gu: "મુખ્ય ઓડિયા તહેવારો ૨૦૨૬ — તારીખો, તિથિ અને નક્ષત્ર",
  },
  festivals2027Title: {
    en: 'Major Odia Festivals 2027 — Dates, Tithi & Nakshatra',
    hi: 'प्रमुख ओड़िआ त्योहार 2027 — तिथियां, तिथि और नक्षत्र',
    sa: 'प्रमुखोड्रपर्वाणि 2027',
    ta: 'முக்கிய ஒடியா திருவிழாக்கள் 2027',
    bn: 'প্রধান ওড়িয়া উৎসব 2027',
    mai: "प्रमुख ओडिया पर्व २०२७ — तिथि आ नक्षत्र",
    mr: "प्रमुख ओडिया उत्सव २०२७ — तारखा, तिथी आणि नक्षत्र",
    te: "2027 ప్రధాన ఒడియా పండుగలు — తేదీలు, తిథి & నక్షత్రం",
    kn: "ಪ್ರಮುಖ ಒಡಿಯಾ ಹಬ್ಬಗಳು ೨೦೨೭ — ದಿನಾಂಕಗಳು, ತಿಥಿ ಮತ್ತು ನಕ್ಷತ್ರ",
    gu: "મુખ્ય ઓડિયા તહેવારો ૨૦૨૭ — તારીખો, તિથિ અને નક્ષત્ર",
  },
  relatedTitle: {
    en: 'Related Regional Calendars & Festivals',
    hi: 'सम्बन्धित क्षेत्रीय कैलेंडर और त्योहार',
    sa: 'सम्बद्धक्षेत्रीयपञ्चाङ्गानि पर्वाणि च',
    ta: 'தொடர்புடைய பிராந்திய நாள்காட்டிகள் & திருவிழாக்கள்',
    bn: 'সম্পর্কিত আঞ্চলিক ক্যালেন্ডার ও উৎসব',
    mai: "सम्बन्धित क्षेत्रीय पञ्चाङ्ग आ पर्व",
    mr: "संबंधित प्रादेशिक कॅलेंडर आणि उत्सव",
    te: "సంబంధిత ప్రాంతీయ క్యాలెండర్‌లు & పండుగలు",
    kn: "ಸಂಬಂಧಿತ ಪ್ರಾದೇಶಿಕ ಕ್ಯಾಲೆಂಡರ್‌ಗಳು ಮತ್ತು ಹಬ್ಬಗಳು",
    gu: "સંબંધિત પ્રાદેશિક કેલેન્ડર અને તહેવારો",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 12 Odia Solar Months — Surya Siddhanta based
// Each month begins on Sankranti (Sun's entry into the next rashi)
// Approximate Gregorian dates; exact dates shift ±1 day per year
// ═══════════════════════════════════════════════════════════════════════════

const ODIA_MONTHS = [
  { name: 'Baisakha', odia: 'ବୈଶାଖ', gregorian: 'Apr 14 – May 14', days: '30–31', rashi: 'Mesha (Aries)', nameHi: 'बैशाख' },
  { name: 'Jyestha', odia: 'ଜ୍ୟେଷ୍ଠ', gregorian: 'May 15 – Jun 14', days: '31–32', rashi: 'Vrishabha (Taurus)', nameHi: 'ज्येष्ठ' },
  { name: 'Asadha', odia: 'ଆଷାଢ଼', gregorian: 'Jun 15 – Jul 16', days: '31–32', rashi: 'Mithuna (Gemini)', nameHi: 'आषाढ़' },
  { name: 'Srabana', odia: 'ଶ୍ରାବଣ', gregorian: 'Jul 17 – Aug 16', days: '31–32', rashi: 'Karka (Cancer)', nameHi: 'श्रावण' },
  { name: 'Bhadra', odia: 'ଭାଦ୍ର', gregorian: 'Aug 17 – Sep 16', days: '31', rashi: 'Simha (Leo)', nameHi: 'भाद्र' },
  { name: 'Aswina', odia: 'ଆଶ୍ୱିନ', gregorian: 'Sep 17 – Oct 17', days: '30–31', rashi: 'Kanya (Virgo)', nameHi: 'आश्विन' },
  { name: 'Kartika', odia: 'କାର୍ତ୍ତିକ', gregorian: 'Oct 18 – Nov 16', days: '29–30', rashi: 'Tula (Libra)', nameHi: 'कार्तिक' },
  { name: 'Margasira', odia: 'ମାର୍ଗଶିର', gregorian: 'Nov 17 – Dec 15', days: '29–30', rashi: 'Vrischika (Scorpio)', nameHi: 'मार्गशीर्ष' },
  { name: 'Pausa', odia: 'ପୌଷ', gregorian: 'Dec 16 – Jan 13', days: '29–30', rashi: 'Dhanu (Sagittarius)', nameHi: 'पौष' },
  { name: 'Magha', odia: 'ମାଘ', gregorian: 'Jan 14 – Feb 12', days: '29–30', rashi: 'Makara (Capricorn)', nameHi: 'माघ' },
  { name: 'Phalguna', odia: 'ଫାଲ୍ଗୁନ', gregorian: 'Feb 13 – Mar 14', days: '29–30', rashi: 'Kumbha (Aquarius)', nameHi: 'फाल्गुन' },
  { name: 'Chaitra', odia: 'ଚୈତ୍ର', gregorian: 'Mar 15 – Apr 13', days: '30–31', rashi: 'Meena (Pisces)', nameHi: 'चैत्र' },
];

// ═══════════════════════════════════════════════════════════════════════════
// Odia Festival Dates — engine-driven, NEXT upcoming occurrence only.
// Computed for Bhubaneswar / Puri (IST canonical).
// ═══════════════════════════════════════════════════════════════════════════
interface OdiaFestival { en: string; hi: string; or: string; engineKey: string; tithi: string }
const ODIA_FESTIVALS: OdiaFestival[] = [
  { en: 'Makar Sankranti',                       hi: 'मकर संक्रान्ति',                        or: 'ମକର ସଂକ୍ରାନ୍ତି',                     engineKey: 'Makar Sankranti',                  tithi: 'Pausha (Solar — Capricorn ingress)' },
  { en: 'Saraswati Puja (Vasant Panchami)',      hi: 'सरस्वती पूजा (वसन्त पंचमी)',          or: 'ସରସ୍ୱତୀ ପୂଜା (ବସନ୍ତ ପଞ୍ଚମୀ)',         engineKey: 'Vasant Panchami',                  tithi: 'Magha Shukla Panchami' },
  { en: 'Maha Shivaratri',                       hi: 'महा शिवरात्रि',                         or: 'ମହା ଶିବରାତ୍ରୀ',                       engineKey: 'Maha Shivaratri',                  tithi: 'Phalguna Krishna Chaturdashi' },
  { en: 'Dola Purnima / Holi',                   hi: 'दोल पूर्णिमा / होली',                  or: 'ଦୋଳ ପୂର୍ଣ୍ଣିମା / ହୋଲି',             engineKey: 'Holi',                              tithi: 'Phalguna Purnima' },
  { en: 'Pana Sankranti (Odia New Year)',        hi: 'पणा संक्रान्ति (ओड़िया नव वर्ष)',     or: 'ପଣା ସଂକ୍ରାନ୍ତି (ମହା ବିଷୁବ ସଂକ୍ରାନ୍ତି)', engineKey: 'Pana Sankranti',                   tithi: 'Mesha Sankranti (Solar)' },
  { en: 'Akshaya Tritiya (Chandan Yatra begins)', hi: 'अक्षय तृतीया (चन्दन यात्रा आरम्भ)',  or: 'ଅକ୍ଷୟ ତୃତୀୟା (ଚନ୍ଦନ ଯାତ୍ରା ଆରମ୍ଭ)',  engineKey: 'Akshaya Tritiya',                  tithi: 'Vaishakha Shukla Tritiya' },
  { en: 'Raja Parba (Mithuna Sankranti)',         hi: 'रज पर्व (मिथुन संक्रान्ति)',           or: 'ରଜ ପର୍ବ (ମିଥୁନ ସଂକ୍ରାନ୍ତି)',          engineKey: 'Raja Parba',                       tithi: 'Mithuna Sankranti (3-day window)' },
  { en: 'Snana Purnima (Jagannath Bath)',        hi: 'स्नान पूर्णिमा (जगन्नाथ स्नान)',       or: 'ସ୍ନାନ ପୂର୍ଣ୍ଣିମା (ଜଗନ୍ନାଥ ସ୍ନାନ)',  engineKey: 'Snana Purnima',                    tithi: 'Jyeshtha Purnima' },
  { en: 'Jagannath Rath Yatra (Puri)',           hi: 'जगन्नाथ रथ यात्रा (पुरी)',             or: 'ଜଗନ୍ନାଥ ରଥଯାତ୍ରା (ପୁରୀ)',           engineKey: 'Jagannath Rath Yatra',             tithi: 'Ashadha Shukla Dwitiya' },
  { en: 'Bahuda Yatra (Return Rath Yatra)',      hi: 'बहुदा यात्रा (वापसी रथ यात्रा)',       or: 'ବାହୁଡ଼ା ଯାତ୍ରା',                       engineKey: 'Bahuda Yatra',                     tithi: 'Ashadha Shukla Dashami' },
  { en: 'Suna Besha (Golden Attire)',            hi: 'सुना बेश (स्वर्ण वेश)',                  or: 'ସୁନା ବେଶ',                            engineKey: 'Suna Besha',                       tithi: 'Ashadha Shukla Ekadashi' },
  { en: 'Niladri Bije',                          hi: 'नीलाद्रि बिजे',                          or: 'ନୀଳାଦ୍ରି ବିଜେ',                       engineKey: 'Niladri Bije',                     tithi: 'Ashadha Shukla Trayodashi' },
  { en: 'Janmashtami',                           hi: 'जन्माष्टमी',                             or: 'ଜନ୍ମାଷ୍ଟମୀ',                          engineKey: 'Janmashtami',                      tithi: 'Bhadrapada Krishna Ashtami' },
  { en: 'Ganesh Chaturthi',                      hi: 'गणेश चतुर्थी',                          or: 'ଗଣେଶ ଚତୁର୍ଥୀ',                        engineKey: 'Ganesh Chaturthi',                 tithi: 'Bhadrapada Shukla Chaturthi' },
  { en: 'Mahalaya',                              hi: 'महालया',                                 or: 'ମହାଳୟା',                              engineKey: 'Mahalaya (Sarva Pitru Amavasya)',  tithi: 'Bhadrapada Amavasya' },
  { en: 'Durga Puja (Maha Ashtami)',             hi: 'दुर्गा पूजा (महा अष्टमी)',             or: 'ଦୁର୍ଗା ପୂଜା (ମହା ଅଷ୍ଟମୀ)',           engineKey: 'Durga Puja Ashtami',               tithi: 'Ashwin Shukla Ashtami' },
  { en: 'Vijayadashami',                         hi: 'विजयादशमी',                              or: 'ବିଜୟଦଶମୀ',                            engineKey: 'Sindoor Khela / Vijaya Dashami',   tithi: 'Ashwin Shukla Dashami' },
  { en: 'Kumar Purnima',                         hi: 'कुमार पूर्णिमा',                         or: 'କୁମାର ପୂର୍ଣ୍ଣିମା',                    engineKey: 'Sharad Purnima',                   tithi: 'Ashwin Purnima' },
  { en: 'Diwali (Kali Puja)',                    hi: 'दीवाली (काली पूजा)',                  or: 'ଦୀପାବଳୀ (କାଳୀ ପୂଜା)',                engineKey: 'Diwali',                            tithi: 'Kartik Krishna Amavasya' },
  { en: 'Kartik Purnima',                        hi: 'कार्तिक पूर्णिमा',                     or: 'କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା',                engineKey: 'Kartik Purnima',                   tithi: 'Kartik Purnima' },
  { en: 'Prathamastami',                         hi: 'प्रथमाष्टमी',                            or: 'ପ୍ରଥମାଷ୍ଟମୀ',                          engineKey: 'Prathamastami',                    tithi: 'Margashira Krishna Ashtami' },
];

// FAQ data for structured data
const FAQ_DATA = [
  {
    q: { en: 'When is Rath Yatra 2026?', hi: 'रथ यात्रा 2026 कब है?' },
    a: {
      en: `Rath Yatra 2026 (Puri, Odisha) falls on ${ed(2026,'Jagannath Rath Yatra','en')}, on Ashadha Shukla Dwitiya. The grand chariot procession takes place in Puri. The Return Rath Yatra (Bahuda Yatra) is on ${ed(2026,'Bahuda Yatra','en')}.`,
      hi: `रथ यात्रा 2026 (पुरी, ओड़िशा) ${ed(2026,'Jagannath Rath Yatra','hi')} को आषाढ़ शुक्ल द्वितीया पर पड़ती है। बहुदा यात्रा ${ed(2026,'Bahuda Yatra','hi')} को है।`,
    },
  },
  {
    q: { en: 'What is Pana Sankranti?', hi: 'पना संक्रान्ति क्या है?' },
    a: { en: 'Pana Sankranti, also known as Maha Vishuba Sankranti, falls on 14 April every year and marks the Odia New Year. It is the day the Sun enters Mesha rashi (Aries).', hi: 'पना संक्रान्ति प्रतिवर्ष 14 अप्रैल को पड़ती है और ओड़िआ नव वर्ष का प्रतीक है।' },
  },
  {
    q: { en: 'How does the Odia calendar work?', hi: 'ओड़िआ कैलेंडर कैसे काम करता है?' },
    a: { en: 'The Odia calendar (Panji) is a sidereal solar calendar based on the Surya Siddhanta. Each month begins on Sankranti, the day the Sun enters a new zodiac sign. Month lengths vary from 29 to 32 days.', hi: 'ओड़िआ कैलेंडर (पंजी) सूर्य सिद्धान्त पर आधारित एक नाक्षत्र सौर कैलेंडर है। प्रत्येक मास संक्रान्ति पर आरम्भ होता है।' },
  },
  {
    q: { en: 'When is Raja Parba?', hi: 'रज पर्व कब है?' },
    // Raja Parba is not currently enumerated in festival-generator.ts.
    // Description without a specific year-date until an engine entry
    // is added — pinned to Mithuna Sankranti (Sun's entry into Mithuna)
    // which is mid-June (typically 14-16 June). To restore a specific
    // year date, add Raja Parba to festival-defs.ts first.
    a: { en: 'Raja Parba is a three-day Odia agrarian festival celebrating Mother Earth (Bhumi Devi). The three days are Pahili Raja (day before Mithuna Sankranti), Raja Sankranti / Mithuna Sankranti (the main day, when the Sun enters Mithuna rashi — typically around 14-15 June), and Basi Raja (day after Mithuna Sankranti).', hi: 'रज पर्व मिथुन संक्रान्ति (सूर्य का मिथुन राशि में प्रवेश, सामान्यत: मध्य जून) के आसपास तीन दिनों तक मनाया जाने वाला ओड़िआ कृषि पर्व है। तीन दिन: पहिली रजा (मिथुन संक्रान्ति से एक दिन पहले), रजा संक्रान्ति (मुख्य दिन), बसी रजा (अगले दिन)।' },
  },
  {
    q: { en: 'What is the current Odia year?', hi: 'वर्तमान ओड़िआ वर्ष क्या है?' },
    a: { en: 'The current Odia year is 1435 Amli (from 14 April 2026 to 13 April 2027). The Amli era began around 592 CE under the Ganga dynasty of Odisha.', hi: 'वर्तमान ओड़िआ वर्ष 1435 अम्ली है (14 अप्रैल 2026 से 13 अप्रैल 2027)।' },
  },
];

const RELATED_LINKS = [
  { href: 'calendar/regional/bengali', en: 'Bengali Calendar (Panjika)', hi: 'बंगाली कैलेंडर (पंजिका)' },
  { href: 'calendar/regional/tamil', en: 'Tamil Calendar (Panchangam)', hi: 'तमिल कैलेंडर (पंचांगम्)' },
  { href: 'calendar/regional/telugu', en: 'Telugu Calendar (Panchangam)', hi: 'तेलुगू कैलेंडर (पंचांगम्)' },
  { href: 'calendar', en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026' },
  { href: 'panchang', en: 'Daily Panchang', hi: 'दैनिक पंचांग' },
];

// ── Rath Yatra 22-day chronology ──
const RATH_YATRA_STAGES: Array<{ stage: string; tithi: string; desc: string }> = [
  { stage: 'Snana Yatra', tithi: 'Jyeshtha Purnima', desc: 'The three deities are brought out from the temple and bathed with 108 pots of consecrated water.' },
  { stage: 'Anavasara / Anasara', tithi: '15 days following Snana Yatra', desc: 'The deities, said to have caught a fever after the bath, are placed in seclusion. Substitute icons are worshipped during this window.' },
  { stage: 'Gundicha Marjana', tithi: 'Ashadha Shukla Pratipada', desc: 'The ritual cleaning of the Gundicha Temple to prepare for the deities’ arrival.' },
  { stage: 'Rath Yatra proper', tithi: 'Ashadha Shukla Dvitiya', desc: 'The deities ride in procession on three chariots from the Jagannath Temple to the Gundicha Temple, roughly 3 km away.' },
  { stage: 'Bahuda Yatra', tithi: 'Ashadha Shukla Dashami', desc: 'The homeward journey to the main temple.' },
  { stage: 'Suna Besha', tithi: 'Ashadha Shukla Ekadashi', desc: 'The “golden attire” darshan: the deities appear on the chariots adorned with more than 200 kg of gold ornaments.' },
  { stage: 'Niladri Bije', tithi: 'Ashadha Shukla Trayodashi', desc: 'The final ritual in which the deities re-enter the sanctum sanctorum.' },
];

// ── Three chariots ──
const RATH_YATRA_CHARIOTS: Array<{ name: string; deity: string; size: string; cloth: string }> = [
  { name: 'Nandighosa', deity: 'Lord Jagannath', size: '45 ft tall · 16 wheels of 7 ft diameter', cloth: 'red and yellow' },
  { name: 'Taladhwaja', deity: 'Lord Balabhadra', size: '44 ft tall · 14 wheels', cloth: 'red and blue · flies a palm-tree (tala) standard' },
  { name: 'Darpadalana / Devadalana', deity: 'Devi Subhadra', size: '43 ft tall · 12 wheels', cloth: 'name means “trampler of pride”' },
];

// ── Odia cultural calendar 2025–2030 ──
// Gregorian dates are resolved at render time via the engine for years where
// `engine` is set; 2025 carries a precomputed reference row.
const ODIA_TABLE: Array<{ year: number; pana: string | null; rath: string | null; raja: string | null; utkaliya: string }> = [
  { year: 2025, pana: '14 Apr 2025', rath: '27 Jun 2025', raja: '15 Jun 2025', utkaliya: '1434' },
  { year: 2026, pana: null, rath: null, raja: null, utkaliya: '1435' },
  { year: 2027, pana: null, rath: null, raja: null, utkaliya: '1436' },
  { year: 2028, pana: null, rath: null, raja: null, utkaliya: '1437' },
  { year: 2029, pana: null, rath: null, raja: null, utkaliya: '1438' },
  { year: 2030, pana: null, rath: null, raja: null, utkaliya: '1439' },
];

export default async function OdiaCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const isHi = isDevanagariLocale(loc);
  const L = (key: keyof typeof LABELS) => tl(LABELS[key] as LocaleText, loc);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2" style={hf}>
            {L('title')}
          </h1>
          <p className="text-amber-400/70 text-lg mb-4">{L('titleOdia')}</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
            {L('intro')}
          </p>
        </div>

        {/* 12 Odia Months Table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('monthsTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {L('monthsIntro')}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colMonth', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">ଓଡ଼ିଆ</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colRashi', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colGregorian', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'दिन' : 'Days'}</th>
                </tr>
              </thead>
              <tbody>
                {ODIA_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.odia}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{m.rashi}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.gregorian}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-center">{m.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pana Sankranti + Odia solar calendar */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Pana Sankranti and the Odia Solar Calendar', hi: 'पना संक्रान्ति और ओड़िया सौर कैलेंडर' }, locale)}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              The Odia Panji is a <strong>sidereal solar calendar</strong> with a lunisolar overlay for religious observance. The Odia year opens on <strong>Maha Bishuba Sankranti</strong>, also called Pana Sankranti or Mesha Sankranti — the day the Sun enters sidereal Mesha (Aries) at the spring equinox point. The term <em>Bishuba / Vishuba</em> derives from the Sanskrit root <em>viṣu</em> (“equally, balanced”) and in astronomical usage denotes the equinox. The festival falls on 13 or 14 April each year on the Gregorian calendar and marks the start of the solar month of Mesha.
            </p>
            <p>
              The Odia calendar is a hybrid: the <strong>civic / month-counting frame is sidereal solar</strong> — months change at Sankranti, and the year length tracks the tropical-to-sidereal drift via the Lahiri ayanamsa convention. <strong>Religious observance uses Purnimanta lunar phasing</strong> — tithi-anchored festivals (Janmashtami, Ekadashis, Shivaratri) fall on dates computed against the full-moon-ending lunar month.
            </p>
            <p>
              This is structurally different from Bengal, whose Panjika is primarily solar and uses Amanta lunar phasing where lunar overlay is needed; the same tithi can fall on slightly different observance days in the two systems even when the Sankranti anchor agrees.
            </p>
            <p>
              The Odia calendar has been carried by an additional, regional <strong>Utkaliya era</strong> said to have begun in 592 CE on Bhadra Shukla Dvadashi — the day on which the legendary king Indradyumna is recorded as having installed the Neela Madhava (Jagannath) icon at Puri. The Utkaliya year appears in old Odia almanac headers alongside the Shaka and Vikram years.
            </p>
          </div>
        </section>

        {/* Rath Yatra 22-day chronology */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Rath Yatra — The 22-Day Puri Chronology', hi: 'रथ यात्रा — 22-दिवसीय पुरी क्रम' }, locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            The Jagannath Rath Yatra at Puri is the only festival in the Hindu world in which the principal deities of a major temple leave their sanctum and travel publicly. The festival is not a single day; it is a 22-day arc that begins with the deities’ ceremonial bath and ends with their final re-entry into the temple.
          </p>
          <div className="space-y-3">
            {RATH_YATRA_STAGES.map((s) => (
              <div key={s.stage} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1.5">
                  <span className="text-gold-light font-semibold text-sm">{s.stage}</span>
                  <span className="text-amber-400/70 text-xs">{s.tithi}</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mt-4">
            <strong>The three chariots</strong> have distinct names, sizes, and symbolism, attested in the Madala Panji:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12 mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Chariot</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Deity</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Size</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Cloth / standard</th>
                </tr>
              </thead>
              <tbody>
                {RATH_YATRA_CHARIOTS.map((c, i) => (
                  <tr key={c.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-gold-light font-semibold">{c.name}</td>
                    <td className="px-4 py-2.5 text-text-primary">{c.deity}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{c.size}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{c.cloth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Raja Parba */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-amber-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Raja Parba — The Menstruation Festival of Bhumi Devi', hi: 'राजा पर्व — भूमि देवी का ऋतु-काल पर्व' }, locale)}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              Raja Parba (also called Mithuna Sankranti) is a three- to four-day festival held in mid-June, in which the goddess Bhumi Devi (Mother Earth, consort of Vishnu) is said to undergo her annual menstruation. It is one of the few major festivals in the Hindu world that ritually centres a goddess’s menstrual cycle — and during it, all agricultural operations are suspended in observance of the Earth’s rest.
            </p>
            <p>
              The stages: <strong>Pahili Raja</strong> — the day before Raja Sankranti; preparation, oil-bath, and decoration of swings. <strong>Raja Sankranti / Mithuna Sankranti</strong> — the central day; the Sun enters sidereal Mithuna; women and unmarried girls wear new clothes, swing on flower-decorated rope swings hung from trees, and refrain from any work that would touch the earth. <strong>Basi Raja / Bhumi Daha</strong> — the third day; the festival’s last day of explicit rest. <strong>Vasumati Snana</strong> — the ceremonial bath of Bhumi Devi, performed with grinding stones (a domestic symbol of the goddess) being anointed with sandalwood paste and turmeric.
            </p>
            <p>
              Etymologically, <em>Raja</em> derives from Sanskrit <em>rajas</em> (“menstruation”); a menstruating woman is a <em>rajasvala</em>. The festival is explicitly framed as a celebration of female fertility, of the unmarried daughters of the household as potential mothers, and of the agricultural Earth’s right to rest. Over 100 regional varieties of paan and dozens of pithas (rice-flour preparations) are eaten across the three days. The festival has no exact parallel in any other Indian regional calendar.
            </p>
          </div>
        </section>

        {/* Madala Panji and Odia scholarship */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'The Madala Panji and Odia Calendrical Scholarship', hi: 'मदला पंजी और ओड़िया पंचांग विद्वत्ता' }, locale)}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              The Madala Panji is a palm-leaf chronicle preserved at the Jagannath Temple, recording temple administration, royal lineages of Odisha, and major historical events from ancient epochs to the early nineteenth century. The chronicle was traditionally inscribed on Vijaya Dashami (the tenth day of Ashwin Shukla Paksha) every year by the Karanas — the temple’s official scribes.
            </p>
            <p>
              Scholarly opinion on its origin is divided. Some dating attributes the tradition to King <strong>Anantavarman Chodaganga Dev (r. 1078–1150)</strong> of the Eastern Ganga dynasty, who is said to have created 24 families of Karanas to preserve temple records, of which five were entrusted with the Madala Panji itself. Other scholars date the manuscript’s earliest surviving compilations to the sixteenth century under Ramachandra Deva I of the Bhoi dynasty.
            </p>
            <p>
              <strong>Pathani Samanta (1835–1904)</strong>, also known as Samanta Chandra Sekhar, was a self-taught astronomer from the princely state of Khandapara, who refined planetary calculations and eclipse predictions using naked-eye observation and instruments built from bamboo and wood. His treatise <em>Siddhanta Darpana</em>, written on palm leaves and completed by 1869 (published 1899 with patronage from the kings of Athmallik and Mayurbhanj), runs to over 2,500 Sanskrit verses. He was awarded the title Mahamahopadhyay by the British government in 1893 for a successful eclipse prediction.
            </p>
          </div>
        </section>

        {/* Odia cultural calendar 2025–2030 */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Odia Cultural Calendar 2025–2030', hi: 'ओड़िया सांस्कृतिक कैलेंडर 2025–2030' }, locale)}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Year</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Pana Sankranti</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Rath Yatra</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Raja Sankranti</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Utkaliya Era</th>
                </tr>
              </thead>
              <tbody>
                {ODIA_TABLE.map((y, i) => {
                  const pana = y.pana ?? ed(y.year, 'Pana Sankranti (Odia New Year)', locale);
                  const rath = y.rath ?? ed(y.year, 'Jagannath Rath Yatra', locale);
                  const raja = y.raja ?? ed(y.year, 'Raja Parba (Mithuna Sankranti)', locale);
                  return (
                    <tr key={y.year} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                      <td className="px-4 py-2.5 text-text-primary font-medium">{y.year}</td>
                      <td className="px-4 py-2.5 text-amber-400/80 text-xs">{pana}</td>
                      <td className="px-4 py-2.5 text-amber-400/80 text-xs">{rath}</td>
                      <td className="px-4 py-2.5 text-amber-400/80 text-xs">{raja}</td>
                      <td className="px-4 py-2.5 text-text-secondary">{y.utkaliya}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Upcoming Odia Festival Dates — engine-driven */}
        {(() => {
          const nowIso = todayInIst();
          const upcoming = ODIA_FESTIVALS
            .map((f) => {
              const hit = nextUpcoming(f.engineKey, locale, nowIso);
              return hit ? { f, iso: hit.iso, display: hit.display } : null;
            })
            .filter((x): x is { f: OdiaFestival; iso: string; display: string } => x !== null)
            .sort((a, b) => a.iso.localeCompare(b.iso));
          return (
            <section>
              <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
                {L('festivalsTitle')}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                {isHi
                  ? 'भुवनेश्वर/पुरी सन्दर्भ के साथ प्रमुख ओड़िआ त्योहारों की आगामी तिथियां। रथ यात्रा, दुर्गा पूजा, कुमार पूर्णिमा, दीवाली — सभी तिथियां पंचांगम् engine से गणित और स्वतः अद्यतित।'
                  : 'Upcoming dates for major Odia festivals with tithi (lunar day), computed for Bhubaneswar/Puri. Includes Rath Yatra (Puri), Bahuda Yatra, Durga Puja, Kumar Purnima, Diwali, Kartik Purnima, and other observances from the Odia Panchang. Dates auto-update daily from our panchang engine — never stale.'}
              </p>
              <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colFestival', locale)}</th>
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colDate', locale)}</th>
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colTithi', locale)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map(({ f, iso, display }, i) => (
                      <tr key={`${f.en}-${iso}`} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                        <td className="px-4 py-2.5 text-text-primary font-medium">{isHi ? f.hi : f.en}</td>
                        <td className="px-4 py-2.5 text-amber-400/80">{display}</td>
                        <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })()}

        {/* Rath Yatra Deep Dive */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('rathYatraTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('rathYatraText')}
          </p>
        </section>

        {/* Raja Parba Deep Dive */}
        <section className="bg-gradient-to-br from-red-900/10 via-bg-secondary/40 to-bg-primary border border-red-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('rajaParbaTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('rajaParbaText')}
          </p>
        </section>

        {/* How the Odia Calendar Works */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('calendarCharTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('calendarCharText')}
          </p>
        </section>

        {/* Amli Era Explanation */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isHi ? 'अम्ली संवत् — ओड़िआ वर्ष गणना' : 'The Amli Era — Odia Year Numbering'}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              {isHi
                ? 'अम्ली संवत् (ओंकिआ या विलायती भी कहा जाता है) लगभग 592 ई. से गणना की जाती है। वर्तमान ओड़िआ वर्ष 1435 अम्ली (14 अप्रैल 2026 से 13 अप्रैल 2027) है।'
                : 'The Amli era (also called Onkia or Vilayati) counts from approximately 592 CE, when the Ganga dynasty established rule over Odisha. The current Odia year is 1435 Amli (14 April 2026 to 13 April 2027).'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-lg mb-1">1435</div>
                <div className="text-text-secondary text-xs">{isHi ? 'अम्ली (14 अप्रैल 2026 – 13 अप्रैल 2027)' : 'Amli (14 Apr 2026 – 13 Apr 2027)'}</div>
              </div>
              <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-lg mb-1">1436</div>
                <div className="text-text-secondary text-xs">{isHi ? 'अम्ली (14 अप्रैल 2027 – 13 अप्रैल 2028)' : 'Amli (14 Apr 2027 – 13 Apr 2028)'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* History & Significance */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isHi ? 'ओड़िआ कैलेंडर का इतिहास और महत्व' : 'History & Significance of the Odia Calendar'}
          </h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              {isHi
                ? 'ओड़िआ पंजी का इतिहास गंग राजवंश (11वीं-15वीं शताब्दी) से जुड़ा है, जिन्होंने पुरी के जगन्नाथ मन्दिर का निर्माण करवाया। आज भी जगन्नाथ मन्दिर के "पंजी पण्डित" प्रतिवर्ष सूर्य सिद्धान्त के अनुसार नई पंजी की गणना करते हैं।'
                : 'The history of the Odia Panji is intimately linked to the Ganga dynasty (11th-15th century CE), who built the Jagannath Temple at Puri. To this day, the "Panji Pandits" of the Jagannath Temple compute a fresh Panji each year following Surya Siddhanta methods, determining the exact dates for all 13 major annual festivals.'}
            </p>
            <p>
              {isHi
                ? 'ओड़िआ कैलेंडर ओडिशा के कृषि जीवन का अभिन्न अंग भी है। प्रत्येक संक्रान्ति कृषि कार्यों के लिए एक मील का पत्थर है।'
                : 'The Odia calendar is also integral to Odisha\'s agricultural life. Each Sankranti serves as a milestone for farming activities: Pana Sankranti for summer sowing, Mithuna Sankranti for monsoon preparation, and Makar Sankranti for the winter harvest festival.'}
            </p>
            <p>
              {isHi
                ? 'ओड़िआ कैलेंडर भारत के उन अन्तिम प्रमुख कैलेंडरों में से एक है जो पूर्णतः खगोलीय आधार पर चलता है।'
                : 'A distinctive feature of the Odia calendar is that it remains one of the last major Indian calendars to operate on a purely astronomical basis — the Panji does not fix month lengths but determines them afresh each year from the Sun\'s actual transit times.'}
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {isHi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <details key={faq.q.en} className="group bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-5 py-4 text-gold-light font-medium text-sm flex items-center justify-between hover:border-gold-primary/30">
                  <span>{isHi ? faq.q.hi : faq.q.en}</span>
                  <span className="ml-3 text-gold-primary/50 group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-gold-primary/8 pt-3">
                  {isHi ? faq.a.hi : faq.a.en}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* JSON-LD FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ_DATA.map((faq) => ({
                '@type': 'Question',
                name: faq.q.en,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.a.en,
                },
              })),
            }),
          }}
        />

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {L('relatedTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RELATED_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/${link.href}`}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isHi ? link.hi : link.en}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
