/**
 * Muhurta type definitions for dedicated landing pages.
 * Each type corresponds to a high-volume seasonal search query.
 */

export interface MuhurtaTypeFAQ {
  question: { en: string; hi: string; sa: string };
  answer: { en: string; hi: string; sa: string };
}

export interface MuhurtaTypeDate {
  date: string; // ISO date string
  label: { en: string; hi: string; sa: string };
}

export interface MuhurtaTypeInfo {
  slug: string;
  /** Activity ID used by muhurta-ai API */
  activityId: string;
  name: { en: string; hi: string; sa: string };
  subtitle: { en: string; hi: string; sa: string };
  description: { en: string; hi: string; sa: string };
  icon: string; // Lucide icon name
  /** Traditional rules and guidance */
  guidance: { en: string[]; hi: string[]; sa: string[] };
  /** Upcoming auspicious dates in 2026 */
  dates2026: MuhurtaTypeDate[];
  faqs: MuhurtaTypeFAQ[];
  /** Slugs of related muhurta types */
  related: string[];
  /** SEO keywords */
  keywords: string[];
}

export const MUHURTA_TYPES: MuhurtaTypeInfo[] = [
  // ─── 1. Wedding ──────────────────────────────────────────────
  {
    slug: 'wedding',
    activityId: 'marriage',
    name: { en: 'Wedding Muhurat', hi: 'शुभ विवाह मुहूर्त', sa: 'शुभविवाहमुहूर्तम्' },
    subtitle: { en: 'Vivah Muhurat', hi: 'विवाह मुहूर्त', sa: 'विवाहमुहूर्तम्' },
    description: {
      en: 'Find the most auspicious dates and times for your wedding in 2026. Our Muhurta engine analyzes Panchang elements, planetary transits, and traditional Vivah Muhurat rules to recommend the best wedding dates.',
      hi: '2026 में अपने विवाह के लिए सबसे शुभ तिथि और समय खोजें। हमारा मुहूर्त इंजन पंचांग तत्वों, ग्रह गोचर और पारम्परिक विवाह मुहूर्त नियमों का विश्लेषण करता है।',
      sa: '२०२६ वर्षे स्वविवाहस्य कृते शुभतमां तिथिं समयं च अन्विष्यतु। अस्माकं मुहूर्तयन्त्रं पञ्चाङ्गतत्त्वानि ग्रहगोचरं पारम्परिकविवाहमुहूर्तनियमांश्च विश्लेषयति।',
    },
    icon: 'Heart',
    guidance: {
      en: [
        'Marriages are traditionally avoided during Pitru Paksha, Chaturmas (Ashadha to Kartik), and solar/lunar eclipses.',
        'The best nakshatras for marriage include Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada, and Revati.',
        'Shukla Paksha (waxing moon) is preferred for weddings. Tithis like Dwitiya, Tritiya, Panchami, Saptami, Ekadashi, and Trayodashi are considered auspicious.',
        'Monday, Wednesday, Thursday, and Friday are the most favorable weekdays for marriage.',
        'Jupiter and Venus should not be combust (too close to the Sun) on the wedding day.',
      ],
      hi: [
        'पितृ पक्ष, चातुर्मास (आषाढ़ से कार्तिक), और सूर्य/चन्द्र ग्रहण के दौरान विवाह परम्परागत रूप से वर्जित हैं।',
        'विवाह के लिए सर्वोत्तम नक्षत्रों में रोहिणी, मृगशिरा, मघा, उत्तर फाल्गुनी, हस्त, स्वाती, अनुराधा, मूल, उत्तराषाढ़ा, उत्तर भाद्रपद और रेवती शामिल हैं।',
        'विवाह के लिए शुक्ल पक्ष (बढ़ता चन्द्रमा) अधिक शुभ माना जाता है। द्वितीया, तृतीया, पंचमी, सप्तमी, एकादशी और त्रयोदशी तिथियां शुभ हैं।',
        'सोमवार, बुधवार, गुरुवार और शुक्रवार विवाह के लिए सबसे अनुकूल वार हैं।',
        'विवाह के दिन गुरु और शुक्र अस्त (सूर्य के अत्यधिक निकट) नहीं होने चाहिए।',
      ],
      sa: [
        'पितृपक्षे चातुर्मासे (आषाढमासात् कार्तिकपर्यन्तम्) सूर्यचन्द्रग्रहणकाले च विवाहाः पारम्परिकरूपेण वर्ज्याः।',
        'विवाहाय उत्तमनक्षत्राणि — रोहिणी मृगशिरा मघा उत्तरफाल्गुनी हस्तं स्वाती अनुराधा मूलम् उत्तराषाढा उत्तरभाद्रपदं रेवती च।',
        'विवाहाय शुक्लपक्षः श्रेष्ठः। द्वितीया तृतीया पञ्चमी सप्तमी एकादशी त्रयोदशी च शुभतिथयः।',
        'सोमवासरः बुधवासरः गुरुवासरः शुक्रवासरश्च विवाहाय अत्यन्तानुकूलाः।',
        'विवाहदिने गुरुशुक्रौ अस्तौ (सूर्यस्य अत्यन्तसमीपे) न भवेताम्।',
      ],
    },
    dates2026: [
      { date: '2026-04-26', label: { en: 'Apr 26 (Sun) — Vaishakh Shukla Trayodashi, Hasta Nakshatra', hi: '26 अप्रैल (रवि) — वैशाख शुक्ल त्रयोदशी, हस्त नक्षत्र', sa: '२६ एप्रिल् (रविः) — वैशाखशुक्लत्रयोदशी हस्तनक्षत्रम्' } },
      { date: '2026-05-04', label: { en: 'May 4 (Mon) — Vaishakh Shukla Saptami, Rohini Nakshatra', hi: '4 मई (सोम) — वैशाख शुक्ल सप्तमी, रोहिणी नक्षत्र', sa: '४ मई (सोमः) — वैशाखशुक्लसप्तमी रोहिणीनक्षत्रम्' } },
      { date: '2026-05-18', label: { en: 'May 18 (Mon) — Jyeshtha Shukla Panchami, Uttara Phalguni', hi: '18 मई (सोम) — ज्येष्ठ शुक्ल पंचमी, उत्तर फाल्गुनी', sa: '१८ मई (सोमः) — ज्येष्ठशुक्लपञ्चमी उत्तरफाल्गुनी' } },
      { date: '2026-06-08', label: { en: 'Jun 8 (Mon) — Jyeshtha Shukla Ekadashi, Anuradha Nakshatra', hi: '8 जून (सोम) — ज्येष्ठ शुक्ल एकादशी, अनुराधा नक्षत्र', sa: '८ जून् (सोमः) — ज्येष्ठशुक्लएकादशी अनुराधानक्षत्रम्' } },
      { date: '2026-11-18', label: { en: 'Nov 18 (Wed) — Kartik Shukla Trayodashi, Revati Nakshatra', hi: '18 नवम्बर (बुध) — कार्तिक शुक्ल त्रयोदशी, रेवती नक्षत्र', sa: '१८ नवम्बर् (बुधः) — कार्तिकशुक्लत्रयोदशी रेवतीनक्षत्रम्' } },
      { date: '2026-11-25', label: { en: 'Nov 25 (Wed) — Margashirsha Shukla Panchami, Mrigashira', hi: '25 नवम्बर (बुध) — मार्गशीर्ष शुक्ल पंचमी, मृगशिरा', sa: '२५ नवम्बर् (बुधः) — मार्गशीर्षशुक्लपञ्चमी मृगशिरा' } },
      { date: '2026-12-02', label: { en: 'Dec 2 (Wed) — Margashirsha Shukla Dwadashi, Uttara Phalguni', hi: '2 दिसम्बर (बुध) — मार्गशीर्ष शुक्ल द्वादशी, उत्तर फाल्गुनी', sa: '२ दिसम्बर् (बुधः) — मार्गशीर्षशुक्लद्वादशी उत्तरफाल्गुनी' } },
    ],
    faqs: [
      {
        question: { en: 'What is the best month for a wedding in 2026?', hi: '2026 में विवाह के लिए सबसे अच्छा महीना कौन सा है?', sa: '२०२६ वर्षे विवाहाय कोऽस्ति उत्तमो मासः?' },
        answer: { en: 'In 2026, the most auspicious months for weddings are Vaishakh (April-May), Jyeshtha (May-June) before Chaturmas begins, and Kartik-Margashirsha (November-December) after Chaturmas ends. The period from mid-July to mid-November (Chaturmas) is traditionally avoided for weddings.', hi: '2026 में विवाह के लिए सबसे शुभ महीने वैशाख (अप्रैल-मई), चातुर्मास से पहले ज्येष्ठ (मई-जून), और चातुर्मास के बाद कार्तिक-मार्गशीर्ष (नवम्बर-दिसम्बर) हैं। जुलाई मध्य से नवम्बर मध्य (चातुर्मास) में विवाह परम्परागत रूप से वर्जित है।', sa: '२०२६ वर्षे विवाहाय शुभतमाः मासाः वैशाखः (एप्रिल्-मई) चातुर्मासात् पूर्वं ज्येष्ठः (मई-जून्) चातुर्मासानन्तरं कार्तिकमार्गशीर्षौ (नवम्बर्-दिसम्बर्) च। जुलैमध्यात् नवम्बरमध्यपर्यन्तं (चातुर्मासः) विवाहाः पारम्परिकरूपेण वर्ज्याः।' },
      },
      {
        question: { en: 'Which nakshatras are auspicious for marriage?', hi: 'विवाह के लिए कौन से नक्षत्र शुभ हैं?', sa: 'विवाहाय कानि नक्षत्राणि शुभानि?' },
        answer: { en: 'The most auspicious nakshatras for marriage are: Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula (debated), Uttara Ashadha, Uttara Bhadrapada, and Revati. These nakshatras are considered "Vivah Yogya" (suitable for marriage) in classical texts.', hi: 'विवाह के लिए सबसे शुभ नक्षत्र हैं: रोहिणी, मृगशिरा, मघा, उत्तर फाल्गुनी, हस्त, स्वाती, अनुराधा, मूल (विवादित), उत्तराषाढ़ा, उत्तर भाद्रपद और रेवती। ये नक्षत्र शास्त्रों में "विवाह योग्य" माने जाते हैं।', sa: 'विवाहाय शुभतमानि नक्षत्राणि — रोहिणी मृगशिरा मघा उत्तरफाल्गुनी हस्तं स्वाती अनुराधा मूलम् उत्तराषाढा उत्तरभाद्रपदं रेवती च। एतानि शास्त्रेषु "विवाहयोग्यानि" इति मन्यन्ते।' },
      },
      {
        question: { en: 'Can marriages be performed during Chaturmas?', hi: 'क्या चातुर्मास में विवाह हो सकता है?', sa: 'चातुर्मासे विवाहः कर्तुं शक्यते किम्?' },
        answer: { en: 'Traditionally, Chaturmas (the 4-month period from Ashadha Shukla Ekadashi to Kartik Shukla Ekadashi, roughly mid-July to mid-November) is considered inauspicious for marriages. However, some communities perform marriages during specific windows within Chaturmas. Consult a knowledgeable priest for your tradition.', hi: 'परम्परागत रूप से चातुर्मास (आषाढ़ शुक्ल एकादशी से कार्तिक शुक्ल एकादशी तक, लगभग जुलाई मध्य से नवम्बर मध्य) विवाह के लिए अशुभ माना जाता है। हालांकि, कुछ समुदाय चातुर्मास में विशेष अवधियों में विवाह करते हैं।', sa: 'पारम्परिकरूपेण चातुर्मासः (आषाढशुक्लैकादश्याः कार्तिकशुक्लैकादशीपर्यन्तम्) विवाहाय अशुभः मन्यते। तथापि केचन समुदायाः चातुर्मासे विशिष्टावधिषु विवाहान् कुर्वन्ति।' },
      },
      {
        question: { en: 'Why should Jupiter and Venus not be combust during a wedding?', hi: 'विवाह में गुरु और शुक्र अस्त क्यों नहीं होने चाहिए?', sa: 'विवाहे गुरुशुक्रौ कथमस्तौ न भवेताम्?' },
        answer: { en: 'Jupiter (Guru) represents wisdom, dharma, and marital harmony, while Venus (Shukra) governs love, beauty, and conjugal happiness. When these planets are combust (too close to the Sun), their benefic influence is considered weakened. Classical texts specifically warn against performing marriages when either planet is combust, as it may affect marital bliss.', hi: 'गुरु ज्ञान, धर्म और वैवाहिक सौहार्द का प्रतिनिधित्व करता है, जबकि शुक्र प्रेम, सौन्दर्य और दाम्पत्य सुख का शासक है। जब ये ग्रह अस्त होते हैं, तो उनका शुभ प्रभाव कमजोर माना जाता है।', sa: 'गुरुः ज्ञानं धर्मं वैवाहिकसौहार्दं च प्रतिनिधत्ते, शुक्रश्च प्रेमसौन्दर्यदाम्पत्यसुखानां शासकः। यदा एतौ ग्रहावस्तौ भवतः तदा तयोः शुभप्रभावः दुर्बलः मन्यते।' },
      },
    ],
    related: ['griha-pravesh', 'naming-ceremony', 'engagement'],
    keywords: ['wedding muhurat 2026', 'vivah muhurat', 'shadi ka muhurat', 'marriage muhurat dates', 'shubh vivah muhurat 2026', 'wedding dates 2026 hindu'],
  },

  // ─── 2. Griha Pravesh ────────────────────────────────────────
  {
    slug: 'griha-pravesh',
    activityId: 'griha_pravesh',
    name: { en: 'Griha Pravesh Muhurat', hi: 'गृह प्रवेश मुहूर्त', sa: 'गृहप्रवेशमुहूर्तम्' },
    subtitle: { en: 'Housewarming Muhurat', hi: 'गृह प्रवेश शुभ मुहूर्त', sa: 'गृहप्रवेशशुभमुहूर्तम्' },
    description: {
      en: 'Find the most auspicious dates for Griha Pravesh (housewarming ceremony) in 2026. Ensure prosperity and happiness in your new home with the right Vastu-aligned muhurat.',
      hi: '2026 में गृह प्रवेश (गृहप्रवेश समारोह) के लिए सबसे शुभ तिथियां खोजें। सही वास्तु-अनुकूल मुहूर्त से अपने नए घर में समृद्धि और सुख सुनिश्चित करें।',
      sa: '२०२६ वर्षे गृहप्रवेशस्य कृते शुभतमां तिथिं अन्विष्यतु। उचितवास्तुअनुकूलमुहूर्तेन नवगृहे समृद्धिं सुखं च सुनिश्चितं कुर्यात्।',
    },
    icon: 'Home',
    guidance: {
      en: [
        'Griha Pravesh should be performed during Uttarayan (Sun in northern hemisphere, roughly Jan-Jul) for best results.',
        'Avoid Griha Pravesh during Adhik Maas (intercalary month), Pitru Paksha, and eclipse periods.',
        'Fixed nakshatras (Rohini, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada) are ideal for housewarming.',
        'The ceremony should begin during daytime, preferably in the morning hours with auspicious Choghadiya.',
        'If the house is newly built, it is called "Apoorva Griha Pravesh." If returning after renovation, it is "Sapoorva." If re-entering after calamity, it is "Dwandva."',
      ],
      hi: [
        'सर्वोत्तम परिणामों के लिए गृह प्रवेश उत्तरायण (सूर्य उत्तरी गोलार्ध में, लगभग जनवरी-जुलाई) के दौरान करना चाहिए।',
        'अधिक मास, पितृ पक्ष और ग्रहण काल में गृह प्रवेश से बचें।',
        'स्थिर नक्षत्र (रोहिणी, उत्तर फाल्गुनी, उत्तराषाढ़ा, उत्तर भाद्रपद) गृह प्रवेश के लिए आदर्श हैं।',
        'समारोह दिन में, अधिमानतः प्रातः काल में शुभ चौघड़िया के दौरान आरम्भ होना चाहिए।',
        'यदि घर नवनिर्मित है तो यह "अपूर्व गृह प्रवेश" कहलाता है। नवीनीकरण के बाद "सपूर्व" और विपत्ति के बाद "द्वन्द्व" कहलाता है।',
      ],
      sa: [
        'उत्तमफलाय गृहप्रवेशः उत्तरायणे (सूर्यः उत्तरगोलार्धे, प्रायः जनवरी-जुलै) कर्तव्यः।',
        'अधिकमासे पितृपक्षे ग्रहणकाले च गृहप्रवेशं वर्जयेत्।',
        'स्थिरनक्षत्राणि (रोहिणी उत्तरफाल्गुनी उत्तराषाढा उत्तरभाद्रपदम्) गृहप्रवेशाय आदर्शाणि।',
        'समारोहः दिवसे प्रातःकाले शुभचौघड़ियायां आरभेत।',
        'यदि गृहं नवनिर्मितं तदा "अपूर्वगृहप्रवेशः" इति कथ्यते। नवीनीकरणानन्तरं "सपूर्वः" विपत्त्यनन्तरं "द्वन्द्वः" इति च।',
      ],
    },
    dates2026: [
      { date: '2026-04-16', label: { en: 'Apr 16 (Thu) — Vaishakh Shukla Tritiya, Rohini Nakshatra', hi: '16 अप्रैल (गुरु) — वैशाख शुक्ल तृतीया, रोहिणी नक्षत्र', sa: '१६ एप्रिल् (गुरुः) — वैशाखशुक्लतृतीया रोहिणीनक्षत्रम्' } },
      { date: '2026-05-07', label: { en: 'May 7 (Thu) — Vaishakh Shukla Dashami, Uttara Phalguni', hi: '7 मई (गुरु) — वैशाख शुक्ल दशमी, उत्तर फाल्गुनी', sa: '७ मई (गुरुः) — वैशाखशुक्लदशमी उत्तरफाल्गुनी' } },
      { date: '2026-05-21', label: { en: 'May 21 (Thu) — Jyeshtha Shukla Ashtami, Uttara Ashadha', hi: '21 मई (गुरु) — ज्येष्ठ शुक्ल अष्टमी, उत्तराषाढ़ा', sa: '२१ मई (गुरुः) — ज्येष्ठशुक्लाष्टमी उत्तराषाढा' } },
      { date: '2026-06-11', label: { en: 'Jun 11 (Thu) — Jyeshtha Shukla Chaturdashi, Uttara Bhadrapada', hi: '11 जून (गुरु) — ज्येष्ठ शुक्ल चतुर्दशी, उत्तर भाद्रपद', sa: '११ जून् (गुरुः) — ज्येष्ठशुक्लचतुर्दशी उत्तरभाद्रपदम्' } },
      { date: '2026-11-19', label: { en: 'Nov 19 (Thu) — Kartik Shukla Chaturdashi, Rohini', hi: '19 नवम्बर (गुरु) — कार्तिक शुक्ल चतुर्दशी, रोहिणी', sa: '१९ नवम्बर् (गुरुः) — कार्तिकशुक्लचतुर्दशी रोहिणी' } },
      { date: '2026-12-10', label: { en: 'Dec 10 (Thu) — Margashirsha Shukla Dashami, Uttara Phalguni', hi: '10 दिसम्बर (गुरु) — मार्गशीर्ष शुक्ल दशमी, उत्तर फाल्गुनी', sa: '१० दिसम्बर् (गुरुः) — मार्गशीर्षशुक्लदशमी उत्तरफाल्गुनी' } },
    ],
    faqs: [
      {
        question: { en: 'What are the three types of Griha Pravesh?', hi: 'गृह प्रवेश के तीन प्रकार कौन से हैं?', sa: 'गृहप्रवेशस्य त्रयः प्रकाराः के सन्ति?' },
        answer: { en: 'There are three types: (1) Apoorva — entering a newly constructed house for the first time; (2) Sapoorva — re-entering after renovation or returning from a long journey; (3) Dwandva — re-entering after a disaster like fire or flood. Each type has specific muhurat requirements.', hi: 'तीन प्रकार हैं: (1) अपूर्व — नवनिर्मित घर में पहली बार प्रवेश; (2) सपूर्व — नवीनीकरण या लम्बी यात्रा से वापसी के बाद; (3) द्वन्द्व — आग या बाढ़ जैसी आपदा के बाद पुनः प्रवेश।', sa: 'त्रयः प्रकाराः सन्ति: (१) अपूर्वः — नवनिर्मितगृहे प्रथमप्रवेशः; (२) सपूर्वः — नवीनीकरणानन्तरं पुनःप्रवेशः; (३) द्वन्द्वः — विपत्त्यनन्तरं पुनःप्रवेशः।' },
      },
      {
        question: { en: 'Is Griha Pravesh allowed during Chaturmas?', hi: 'क्या चातुर्मास में गृह प्रवेश किया जा सकता है?', sa: 'चातुर्मासे गृहप्रवेशः कर्तुं शक्यते किम्?' },
        answer: { en: 'Most traditions advise against Griha Pravesh during Chaturmas (mid-July to mid-November). However, Sapoorva and Dwandva types may be performed during this period with proper muhurat. For Apoorva (new house), it is best to wait until after Chaturmas.', hi: 'अधिकांश परम्पराएं चातुर्मास में गृह प्रवेश के विरुद्ध सलाह देती हैं। हालांकि, सपूर्व और द्वन्द्व प्रकार उचित मुहूर्त के साथ इस अवधि में किए जा सकते हैं।', sa: 'अधिकांशपरम्पराः चातुर्मासे गृहप्रवेशं विरुन्धन्ति। तथापि सपूर्वद्वन्द्वप्रकारौ उचितमुहूर्तेन अस्मिन् काले कर्तुं शक्येते।' },
      },
      {
        question: { en: 'What Puja is performed during Griha Pravesh?', hi: 'गृह प्रवेश में कौन सी पूजा की जाती है?', sa: 'गृहप्रवेशे का पूजा क्रियते?' },
        answer: { en: 'The typical Griha Pravesh ceremony includes: Ganapati Puja, Vastu Puja (to appease Vastu Purusha), Navagraha Puja, Havan (fire ceremony), and boiling milk in the new kitchen as a symbol of abundance. The family enters with the right foot first.', hi: 'सामान्य गृह प्रवेश समारोह में शामिल हैं: गणपति पूजा, वास्तु पूजा, नवग्रह पूजा, हवन और नई रसोई में दूध उबालना (समृद्धि का प्रतीक)। परिवार दाहिने पैर से प्रवेश करता है।', sa: 'सामान्यगृहप्रवेशसमारोहे अन्तर्भवन्ति — गणपतिपूजा वास्तुपूजा नवग्रहपूजा हवनं नवपाकशालायां दुग्धोत्तापनं (समृद्धेः प्रतीकम्) च। कुटुम्बं दक्षिणपादेन प्रविशति।' },
      },
    ],
    related: ['property-purchase', 'wedding', 'business-start'],
    keywords: ['griha pravesh muhurat 2026', 'housewarming muhurat', 'griha pravesh dates', 'new house muhurat', 'griha pravesh vidhi', 'shubh griha pravesh muhurat'],
  },

  // ─── 3. Vehicle Purchase ─────────────────────────────────────
  {
    slug: 'vehicle-purchase',
    activityId: 'vehicle',
    name: { en: 'Vehicle Purchase Muhurat', hi: 'वाहन खरीद मुहूर्त', sa: 'वाहनक्रयमुहूर्तम्' },
    subtitle: { en: 'Vahan Kharid Muhurat', hi: 'गाड़ी खरीदने का शुभ मुहूर्त', sa: 'वाहनक्रयशुभमुहूर्तम्' },
    description: {
      en: 'Find auspicious dates for buying a new car, bike, or vehicle in 2026. Vedic astrology considers specific planetary alignments and nakshatras for safe and prosperous vehicle ownership.',
      hi: '2026 में नई कार, बाइक या वाहन खरीदने के लिए शुभ तिथियां खोजें। वैदिक ज्योतिष सुरक्षित और समृद्ध वाहन स्वामित्व के लिए विशिष्ट ग्रह स्थितियों और नक्षत्रों को ध्यान में रखता है।',
      sa: '२०२६ वर्षे नववाहनक्रयस्य कृते शुभतिथीः अन्विष्यतु। वैदिकज्योतिषं सुरक्षितसमृद्धवाहनस्वामित्वाय विशिष्टग्रहस्थितीः नक्षत्राणि च विचारयति।',
    },
    icon: 'Car',
    guidance: {
      en: [
        'Ashwini, Mrigashira, Pushya, Hasta, Anuradha, and Revati nakshatras are considered best for vehicle purchase.',
        'Avoid purchasing vehicles during Rahu Kaal, Yamaganda, and Gulika Kaal on the chosen day.',
        'Shukla Paksha is preferred. Tithis like Dwitiya, Tritiya, Panchami, Saptami, Dashami, and Trayodashi are favorable.',
        'Wednesday and Friday are traditionally considered the best days for vehicle purchases.',
        'The vehicle should first be driven towards the East or North direction for an auspicious start.',
      ],
      hi: [
        'अश्विनी, मृगशिरा, पुष्य, हस्त, अनुराधा और रेवती नक्षत्र वाहन खरीद के लिए सर्वोत्तम माने जाते हैं।',
        'चुने हुए दिन राहु काल, यमगण्ड और गुलिक काल में वाहन खरीदने से बचें।',
        'शुक्ल पक्ष को प्राथमिकता दी जाती है। द्वितीया, तृतीया, पंचमी, सप्तमी, दशमी और त्रयोदशी तिथियां अनुकूल हैं।',
        'बुधवार और शुक्रवार पारम्परिक रूप से वाहन खरीद के लिए सबसे अच्छे दिन माने जाते हैं।',
        'शुभ आरम्भ के लिए वाहन को पहले पूर्व या उत्तर दिशा में चलाना चाहिए।',
      ],
      sa: [
        'अश्विनी मृगशिरा पुष्यं हस्तम् अनुराधा रेवती च नक्षत्राणि वाहनक्रयाय उत्तमानि मन्यन्ते।',
        'चयनिते दिने राहुकाले यमगण्डे गुलिककाले च वाहनक्रयं वर्जयेत्।',
        'शुक्लपक्षः श्रेष्ठः। द्वितीया तृतीया पञ्चमी सप्तमी दशमी त्रयोदशी च अनुकूलतिथयः।',
        'बुधवासरः शुक्रवासरश्च वाहनक्रयाय पारम्परिकरूपेण उत्तमौ मन्येते।',
        'शुभारम्भाय वाहनं प्रथमं पूर्वदिशि उत्तरदिशि वा चालनीयम्।',
      ],
    },
    dates2026: [
      { date: '2026-04-15', label: { en: 'Apr 15 (Wed) — Pushya Nakshatra, Shukla Dwitiya', hi: '15 अप्रैल (बुध) — पुष्य नक्षत्र, शुक्ल द्वितीया', sa: '१५ एप्रिल् (बुधः) — पुष्यनक्षत्रं शुक्लद्वितीया' } },
      { date: '2026-05-13', label: { en: 'May 13 (Wed) — Pushya Nakshatra, Shukla Panchami', hi: '13 मई (बुध) — पुष्य नक्षत्र, शुक्ल पंचमी', sa: '१३ मई (बुधः) — पुष्यनक्षत्रं शुक्लपञ्चमी' } },
      { date: '2026-06-05', label: { en: 'Jun 5 (Fri) — Hasta Nakshatra, Shukla Dashami', hi: '5 जून (शुक्र) — हस्त नक्षत्र, शुक्ल दशमी', sa: '५ जून् (शुक्रः) — हस्तनक्षत्रं शुक्लदशमी' } },
      { date: '2026-09-18', label: { en: 'Sep 18 (Fri) — Revati Nakshatra, Shukla Saptami', hi: '18 सितम्बर (शुक्र) — रेवती नक्षत्र, शुक्ल सप्तमी', sa: '१८ सितम्बर् (शुक्रः) — रेवतीनक्षत्रं शुक्लसप्तमी' } },
      { date: '2026-11-11', label: { en: 'Nov 11 (Wed) — Ashwini Nakshatra, Shukla Saptami', hi: '11 नवम्बर (बुध) — अश्विनी नक्षत्र, शुक्ल सप्तमी', sa: '११ नवम्बर् (बुधः) — अश्विनीनक्षत्रं शुक्लसप्तमी' } },
      { date: '2026-12-04', label: { en: 'Dec 4 (Fri) — Mrigashira Nakshatra, Shukla Trayodashi', hi: '4 दिसम्बर (शुक्र) — मृगशिरा नक्षत्र, शुक्ल त्रयोदशी', sa: '४ दिसम्बर् (शुक्रः) — मृगशिरानक्षत्रं शुक्लत्रयोदशी' } },
    ],
    faqs: [
      {
        question: { en: 'Which day is best for buying a new car?', hi: 'नई कार खरीदने के लिए कौन सा दिन सबसे अच्छा है?', sa: 'नववाहनक्रयाय कः दिनः श्रेष्ठः?' },
        answer: { en: 'Wednesday (ruled by Mercury, the planet of commerce) and Friday (ruled by Venus, the planet of luxury) are traditionally the best days for vehicle purchase. Thursday is also favorable for expensive vehicles. Avoid Saturday and Tuesday.', hi: 'बुधवार (बुध ग्रह, वाणिज्य का ग्रह) और शुक्रवार (शुक्र ग्रह, विलासिता का ग्रह) पारम्परिक रूप से वाहन खरीद के लिए सबसे अच्छे दिन हैं। शनिवार और मंगलवार से बचें।', sa: 'बुधवासरः (बुधग्रहः वाणिज्यस्य ग्रहः) शुक्रवासरश्च (शुक्रग्रहः विलासितायाः ग्रहः) वाहनक्रयाय पारम्परिकरूपेण उत्तमौ। शनिमङ्गलवासरौ वर्जयेत्।' },
      },
      {
        question: { en: 'Should I check Rahu Kaal before buying a vehicle?', hi: 'क्या वाहन खरीदने से पहले राहु काल देखना चाहिए?', sa: 'वाहनक्रयात् पूर्वं राहुकालं पश्येत् किम्?' },
        answer: { en: 'Yes, it is strongly recommended to avoid taking delivery of a vehicle during Rahu Kaal, Yamaganda Kaal, or Gulika Kaal. These inauspicious periods are believed to bring mechanical troubles and accidents. Check our Rahu Kaal page for today\'s timings.', hi: 'हां, राहु काल, यमगण्ड काल या गुलिक काल में वाहन की डिलीवरी लेने से बचना अत्यन्त अनुशंसित है। इन अशुभ अवधियों में यान्त्रिक समस्याएं और दुर्घटनाएं हो सकती हैं।', sa: 'आम्, राहुकाले यमगण्डकाले गुलिककाले वा वाहनस्य प्राप्तिं वर्जयितुम् अत्यन्तम् अनुशंसितम्। एतेषु अशुभकालेषु यान्त्रिकदोषाः दुर्घटनाश्च भवितुम् अर्हन्ति।' },
      },
      {
        question: { en: 'What Puja should be done for a new vehicle?', hi: 'नए वाहन के लिए कौन सी पूजा करनी चाहिए?', sa: 'नववाहनाय का पूजा कर्तव्या?' },
        answer: { en: 'A Ganapati Puja followed by vehicle Puja (Vaahan Puja) is traditionally performed. This includes breaking a coconut in front of the vehicle, applying tilak, placing lemons under the wheels, and circling the vehicle with incense. Many also perform a brief Navagraha prayer.', hi: 'परम्परागत रूप से गणपति पूजा और उसके बाद वाहन पूजा की जाती है। इसमें वाहन के सामने नारियल फोड़ना, तिलक लगाना, पहियों के नीचे नींबू रखना और अगरबत्ती से वाहन की परिक्रमा शामिल है।', sa: 'पारम्परिकरूपेण गणपतिपूजा वाहनपूजा च क्रियते। अत्र वाहनस्य पुरतः नारिकेलभञ्जनं तिलकलेपनं चक्रयोः अधः निम्बूस्थापनं धूपेन परिक्रमणं च अन्तर्भवति।' },
      },
    ],
    related: ['travel', 'property-purchase', 'business-start'],
    keywords: ['vehicle purchase muhurat 2026', 'car buying muhurat', 'vahan kharid muhurat', 'new car muhurat', 'bike purchase muhurat', 'gadi kharidne ka muhurat'],
  },

  // ─── 4. Business Start ───────────────────────────────────────
  {
    slug: 'business-start',
    activityId: 'business',
    name: { en: 'Business Start Muhurat', hi: 'व्यापार आरम्भ मुहूर्त', sa: 'व्यापारारम्भमुहूर्तम्' },
    subtitle: { en: 'Vyapar Aarambh Muhurat', hi: 'नया व्यापार शुरू करने का मुहूर्त', sa: 'नवव्यापारारम्भमुहूर्तम्' },
    description: {
      en: 'Find the best auspicious dates to start a new business, open a shop, or launch a venture in 2026. Align your enterprise with favorable planetary energies for success and prosperity.',
      hi: '2026 में नया व्यापार शुरू करने, दुकान खोलने या उद्यम प्रारम्भ करने के लिए सबसे शुभ तिथियां खोजें।',
      sa: '२०२६ वर्षे नवव्यापारारम्भाय आपणोद्घाटनाय उद्यमप्रारम्भाय वा शुभतमां तिथिं अन्विष्यतु।',
    },
    icon: 'Briefcase',
    guidance: {
      en: [
        'Pushya Nakshatra is considered the single most auspicious nakshatra for starting a business — "Pushya Snaanam" is a famous principle.',
        'Ashwini, Rohini, Mrigashira, Punarvasu, Hasta, Anuradha, and Revati are also favorable nakshatras.',
        'Wednesday (Mercury — commerce), Thursday (Jupiter — wisdom), and Friday (Venus — wealth) are the best weekdays.',
        'Avoid starting a business during Pitru Paksha, eclipses, or when Mercury is retrograde.',
        'Lagna (ascendant) at the time of inauguration should be in a fixed or dual sign for stability.',
      ],
      hi: [
        'व्यापार शुरू करने के लिए पुष्य नक्षत्र सबसे शुभ माना जाता है — "पुष्य स्नानम्" एक प्रसिद्ध सिद्धान्त है।',
        'अश्विनी, रोहिणी, मृगशिरा, पुनर्वसु, हस्त, अनुराधा और रेवती भी अनुकूल नक्षत्र हैं।',
        'बुधवार (बुध — वाणिज्य), गुरुवार (गुरु — ज्ञान) और शुक्रवार (शुक्र — धन) सबसे अच्छे वार हैं।',
        'पितृ पक्ष, ग्रहण या बुध वक्री के दौरान व्यापार शुरू करने से बचें।',
        'उद्घाटन के समय लग्न स्थिर या द्विस्वभाव राशि में होना चाहिए।',
      ],
      sa: [
        'व्यापारारम्भाय पुष्यनक्षत्रम् एकमेव शुभतमं मन्यते — "पुष्यस्नानम्" इति प्रसिद्धः सिद्धान्तः।',
        'अश्विनी रोहिणी मृगशिरा पुनर्वसु हस्तम् अनुराधा रेवती च अनुकूलनक्षत्राणि।',
        'बुधवासरः (बुधः — वाणिज्यम्) गुरुवासरः (गुरुः — ज्ञानम्) शुक्रवासरश्च (शुक्रः — धनम्) उत्तमवासराः।',
        'पितृपक्षे ग्रहणे बुधवक्रीकाले च व्यापारारम्भं वर्जयेत्।',
        'उद्घाटनसमये लग्नं स्थिरराशौ द्विस्वभावराशौ वा भवेत्।',
      ],
    },
    dates2026: [
      { date: '2026-04-15', label: { en: 'Apr 15 (Wed) — Pushya Nakshatra, Shukla Tritiya', hi: '15 अप्रैल (बुध) — पुष्य नक्षत्र, शुक्ल तृतीया', sa: '१५ एप्रिल् (बुधः) — पुष्यनक्षत्रं शुक्लतृतीया' } },
      { date: '2026-05-13', label: { en: 'May 13 (Wed) — Pushya Nakshatra, Jyeshtha month', hi: '13 मई (बुध) — पुष्य नक्षत्र, ज्येष्ठ मास', sa: '१३ मई (बुधः) — पुष्यनक्षत्रं ज्येष्ठमासः' } },
      { date: '2026-06-10', label: { en: 'Jun 10 (Wed) — Pushya Nakshatra, Shukla Dashami', hi: '10 जून (बुध) — पुष्य नक्षत्र, शुक्ल दशमी', sa: '१० जून् (बुधः) — पुष्यनक्षत्रं शुक्लदशमी' } },
      { date: '2026-09-17', label: { en: 'Sep 17 (Thu) — Hasta Nakshatra, Shukla Saptami', hi: '17 सितम्बर (गुरु) — हस्त नक्षत्र, शुक्ल सप्तमी', sa: '१७ सितम्बर् (गुरुः) — हस्तनक्षत्रं शुक्लसप्तमी' } },
      { date: '2026-11-12', label: { en: 'Nov 12 (Thu) — Rohini Nakshatra, Shukla Dashami', hi: '12 नवम्बर (गुरु) — रोहिणी नक्षत्र, शुक्ल दशमी', sa: '१२ नवम्बर् (गुरुः) — रोहिणीनक्षत्रं शुक्लदशमी' } },
      { date: '2026-12-03', label: { en: 'Dec 3 (Thu) — Punarvasu Nakshatra, Shukla Dwadashi', hi: '3 दिसम्बर (गुरु) — पुनर्वसु नक्षत्र, शुक्ल द्वादशी', sa: '३ दिसम्बर् (गुरुः) — पुनर्वसुनक्षत्रं शुक्लद्वादशी' } },
    ],
    faqs: [
      {
        question: { en: 'Why is Pushya Nakshatra special for starting a business?', hi: 'व्यापार शुरू करने के लिए पुष्य नक्षत्र विशेष क्यों है?', sa: 'व्यापारारम्भाय पुष्यनक्षत्रं किमर्थं विशिष्टम्?' },
        answer: { en: 'Pushya is ruled by Brihaspati (Jupiter), the planet of wisdom, expansion, and prosperity. Its name means "nourisher." It is the most universally recommended nakshatra for all commercial activities, inaugurations, and investments. Even if other factors are slightly unfavorable, Pushya\'s presence significantly uplifts the muhurat.', hi: 'पुष्य बृहस्पति (गुरु) द्वारा शासित है, जो ज्ञान, विस्तार और समृद्धि का ग्रह है। इसका नाम "पोषक" है। यह सभी व्यावसायिक गतिविधियों, उद्घाटन और निवेश के लिए सबसे सार्वभौमिक रूप से अनुशंसित नक्षत्र है।', sa: 'पुष्यं बृहस्पतिशासितं ज्ञानविस्तारसमृद्धीनां ग्रहेण। तस्य नाम "पोषकः" इति। सर्वासां वाणिज्यगतिविधीनाम् उद्घाटनानां निवेशानां च कृते सार्वभौमरूपेण अनुशंसितं नक्षत्रम्।' },
      },
      {
        question: { en: 'Should I avoid starting a business when Mercury is retrograde?', hi: 'क्या बुध वक्री होने पर व्यापार शुरू करने से बचना चाहिए?', sa: 'बुधवक्रीकाले व्यापारारम्भं वर्जयेत् किम्?' },
        answer: { en: 'Mercury governs commerce, contracts, and communication. When retrograde, these areas may face disruptions. Traditional Vedic astrology recommends avoiding new business launches during Mercury retrograde. However, reviewing existing business plans or resuming paused ventures can be done.', hi: 'बुध वाणिज्य, अनुबन्ध और सम्प्रेषण का शासक है। वक्री होने पर इन क्षेत्रों में बाधाएं आ सकती हैं। पारम्परिक वैदिक ज्योतिष बुध वक्री में नया व्यापार शुरू करने से बचने की सलाह देता है।', sa: 'बुधः वाणिज्यस्य अनुबन्धानां सम्प्रेषणस्य च शासकः। वक्रीकाले एतेषु क्षेत्रेषु बाधाः भवितुम् अर्हन्ति। पारम्परिकवैदिकज्योतिषं बुधवक्रीकाले नवव्यापारारम्भं वर्जयितुम् अनुशंसति।' },
      },
      {
        question: { en: 'What time of day is best for a business inauguration?', hi: 'व्यापार उद्घाटन के लिए दिन का कौन सा समय सबसे अच्छा है?', sa: 'व्यापारोद्घाटनाय दिनस्य कः कालः श्रेष्ठः?' },
        answer: { en: 'Morning hours (between 9 AM and 12 PM) are generally considered best for business inaugurations. The Abhijit Muhurta (approximately 48 minutes around local noon) is universally auspicious. Ensure the chosen time falls during a favorable Choghadiya (Amrit, Shubh, or Labh).', hi: 'प्रातः काल (9 बजे से 12 बजे के बीच) व्यापार उद्घाटन के लिए सामान्यतः सर्वोत्तम माना जाता है। अभिजित मुहूर्त (स्थानीय मध्याह्न के आसपास लगभग 48 मिनट) सार्वभौमिक रूप से शुभ है।', sa: 'प्रातःकालः (नवमहोरातः द्वादशहोरापर्यन्तम्) व्यापारोद्घाटनाय सामान्यतः उत्तमः मन्यते। अभिजित्मुहूर्तं (स्थानीयमध्याह्नस्य समीपे प्रायः ४८ निमेषाः) सार्वभौमशुभम्।' },
      },
    ],
    related: ['property-purchase', 'vehicle-purchase', 'travel'],
    keywords: ['business start muhurat 2026', 'vyapar muhurat', 'shop opening muhurat', 'new business muhurat', 'dukan kholne ka muhurat', 'office inauguration muhurat'],
  },

  // ─── 5. Naming Ceremony ──────────────────────────────────────
  {
    slug: 'naming-ceremony',
    activityId: 'namakarana',
    name: { en: 'Naming Ceremony Muhurat', hi: 'नामकरण मुहूर्त', sa: 'नामकरणमुहूर्तम्' },
    subtitle: { en: 'Namkaran Muhurat', hi: 'नामकरण संस्कार मुहूर्त', sa: 'नामकरणसंस्कारमुहूर्तम्' },
    description: {
      en: 'Find the most auspicious date for your baby\'s naming ceremony (Namkaran Sanskar) in 2026. The name chosen based on birth nakshatra syllables carries lifelong significance in Vedic tradition.',
      hi: '2026 में अपने शिशु के नामकरण संस्कार के लिए सबसे शुभ तिथि खोजें। जन्म नक्षत्र के अक्षरों पर आधारित नाम वैदिक परम्परा में आजीवन महत्व रखता है।',
      sa: '२०२६ वर्षे स्वशिशोः नामकरणसंस्कारस्य कृते शुभतमां तिथिं अन्विष्यतु। जन्मनक्षत्राक्षराधारितं नाम वैदिकपरम्परायाम् आजीवनमहत्त्वं वहति।',
    },
    icon: 'Baby',
    guidance: {
      en: [
        'Namkaran is traditionally performed on the 11th or 12th day after birth, though it can be done up to the first birthday.',
        'Ashwini, Rohini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, and Revati are auspicious nakshatras.',
        'The first syllable of the name should ideally match the birth nakshatra\'s designated syllables.',
        'Monday, Wednesday, Thursday, and Friday are favorable weekdays.',
        'The ceremony should be performed during Shukla Paksha for the most auspicious results.',
      ],
      hi: [
        'नामकरण पारम्परिक रूप से जन्म के 11वें या 12वें दिन किया जाता है, हालांकि यह पहले जन्मदिन तक किया जा सकता है।',
        'अश्विनी, रोहिणी, मृगशिरा, पुनर्वसु, पुष्य, हस्त, स्वाती, अनुराधा, श्रवण और रेवती शुभ नक्षत्र हैं।',
        'नाम का पहला अक्षर जन्म नक्षत्र के निर्धारित अक्षरों से मिलना चाहिए।',
        'सोमवार, बुधवार, गुरुवार और शुक्रवार अनुकूल वार हैं।',
        'सबसे शुभ परिणामों के लिए शुक्ल पक्ष में समारोह करना चाहिए।',
      ],
      sa: [
        'नामकरणं पारम्परिकरूपेण जन्मनः एकादशे द्वादशे वा दिने क्रियते, तथापि प्रथमजन्मदिनपर्यन्तं कर्तुं शक्यते।',
        'अश्विनी रोहिणी मृगशिरा पुनर्वसु पुष्यं हस्तं स्वाती अनुराधा श्रवणं रेवती च शुभनक्षत्राणि।',
        'नाम्नः प्रथमाक्षरं जन्मनक्षत्रस्य निर्दिष्टाक्षरैः सह मिलेत्।',
        'सोमबुधगुरुशुक्रवासराः अनुकूलाः।',
        'शुभतमफलाय शुक्लपक्षे संस्कारः कर्तव्यः।',
      ],
    },
    dates2026: [
      { date: '2026-04-20', label: { en: 'Apr 20 (Mon) — Shukla Saptami, Punarvasu Nakshatra', hi: '20 अप्रैल (सोम) — शुक्ल सप्तमी, पुनर्वसु नक्षत्र', sa: '२० एप्रिल् (सोमः) — शुक्लसप्तमी पुनर्वसुनक्षत्रम्' } },
      { date: '2026-05-06', label: { en: 'May 6 (Wed) — Shukla Dashami, Hasta Nakshatra', hi: '6 मई (बुध) — शुक्ल दशमी, हस्त नक्षत्र', sa: '६ मई (बुधः) — शुक्लदशमी हस्तनक्षत्रम्' } },
      { date: '2026-06-04', label: { en: 'Jun 4 (Thu) — Shukla Navami, Shravana Nakshatra', hi: '4 जून (गुरु) — शुक्ल नवमी, श्रवण नक्षत्र', sa: '४ जून् (गुरुः) — शुक्लनवमी श्रवणनक्षत्रम्' } },
      { date: '2026-09-21', label: { en: 'Sep 21 (Mon) — Shukla Dashami, Rohini Nakshatra', hi: '21 सितम्बर (सोम) — शुक्ल दशमी, रोहिणी नक्षत्र', sa: '२१ सितम्बर् (सोमः) — शुक्लदशमी रोहिणीनक्षत्रम्' } },
      { date: '2026-11-16', label: { en: 'Nov 16 (Mon) — Shukla Ekadashi, Anuradha Nakshatra', hi: '16 नवम्बर (सोम) — शुक्ल एकादशी, अनुराधा नक्षत्र', sa: '१६ नवम्बर् (सोमः) — शुक्लएकादशी अनुराधानक्षत्रम्' } },
    ],
    faqs: [
      {
        question: { en: 'When should the Namkaran ceremony be performed?', hi: 'नामकरण संस्कार कब करना चाहिए?', sa: 'नामकरणसंस्कारः कदा कर्तव्यः?' },
        answer: { en: 'According to Grihya Sutras, Namkaran should be performed on the 10th, 11th, or 12th day after birth, or on any auspicious day within the first year. Some families prefer the 12th day for practical reasons. The ceremony can also be combined with the 1st birthday celebration.', hi: 'गृह्य सूत्रों के अनुसार नामकरण जन्म के 10वें, 11वें या 12वें दिन, या पहले वर्ष के भीतर किसी शुभ दिन पर करना चाहिए। कुछ परिवार व्यावहारिक कारणों से 12वें दिन को प्राथमिकता देते हैं।', sa: 'गृह्यसूत्राणाम् अनुसारं नामकरणं जन्मनः दशमे एकादशे द्वादशे वा दिने अथवा प्रथमवर्षस्य अन्तः कस्मिंश्चित् शुभदिने कर्तव्यम्।' },
      },
      {
        question: { en: 'How is the baby\'s name chosen based on Nakshatra?', hi: 'नक्षत्र के आधार पर बच्चे का नाम कैसे चुना जाता है?', sa: 'नक्षत्राधारेण शिशोः नाम कथं चीयते?' },
        answer: { en: 'Each nakshatra has specific syllables assigned to its four padas (quarters). The baby\'s birth nakshatra and pada determine the starting syllable of the name. For example, Ashwini\'s syllables are Chu, Che, Cho, La. Use our Baby Names tool to find names matching your birth nakshatra.', hi: 'प्रत्येक नक्षत्र के चार पदों को विशिष्ट अक्षर निर्दिष्ट हैं। शिशु का जन्म नक्षत्र और पद नाम का आरम्भिक अक्षर निर्धारित करता है। हमारे बेबी नेम्स टूल से अपने जन्म नक्षत्र के अनुसार नाम खोजें।', sa: 'प्रत्येकनक्षत्रस्य चतुर्षु पदेषु विशिष्टाक्षराणि निर्दिष्टानि। शिशोः जन्मनक्षत्रं पदं च नाम्नः आरम्भाक्षरं निर्धारयतः। अस्माकं शिशुनामसाधनेन स्वजन्मनक्षत्रानुसारं नाम अन्विष्यतु।' },
      },
    ],
    related: ['annaprashan', 'mundan', 'upanayana'],
    keywords: ['naming ceremony muhurat 2026', 'namkaran muhurat', 'baby naming muhurat', 'namkaran sanskar date', 'namkaran vidhi', 'baby name ceremony date'],
  },

  // ─── 6. Property Purchase ────────────────────────────────────
  {
    slug: 'property-purchase',
    activityId: 'property',
    name: { en: 'Property Purchase Muhurat', hi: 'भूमि/गृह क्रय मुहूर्त', sa: 'भूमिगृहक्रयमुहूर्तम्' },
    subtitle: { en: 'Bhumi Kray Muhurat', hi: 'जमीन खरीदने का शुभ मुहूर्त', sa: 'भूमिक्रयशुभमुहूर्तम्' },
    description: {
      en: 'Find auspicious dates for buying land, house, or property in 2026. Property registration and purchase benefit greatly from favorable muhurat timing aligned with Vedic principles.',
      hi: '2026 में जमीन, मकान या सम्पत्ति खरीदने के लिए शुभ तिथियां खोजें। सम्पत्ति पंजीकरण और खरीद वैदिक सिद्धान्तों के अनुरूप अनुकूल मुहूर्त से अत्यन्त लाभान्वित होते हैं।',
      sa: '२०२६ वर्षे भूमिगृहसम्पत्तिक्रयस्य कृते शुभतिथीः अन्विष्यतु।',
    },
    icon: 'Building',
    guidance: {
      en: [
        'Fixed nakshatras (Rohini, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada) are best for property transactions.',
        'Thursday (Jupiter — expansion) is the most favorable day for property registration.',
        'Avoid property transactions during Pitru Paksha, Adhik Maas, and eclipse periods.',
        'Shukla Paksha tithis, especially Dwitiya, Tritiya, Panchami, and Dashami, are auspicious.',
        'Check that Saturn is not aspecting the 4th house (house of property) in your natal chart on the chosen day.',
      ],
      hi: [
        'स्थिर नक्षत्र (रोहिणी, उत्तर फाल्गुनी, उत्तराषाढ़ा, उत्तर भाद्रपद) सम्पत्ति लेनदेन के लिए सबसे अच्छे हैं।',
        'गुरुवार (गुरु — विस्तार) सम्पत्ति पंजीकरण के लिए सबसे अनुकूल दिन है।',
        'पितृ पक्ष, अधिक मास और ग्रहण काल में सम्पत्ति लेनदेन से बचें।',
        'शुक्ल पक्ष की तिथियां, विशेषकर द्वितीया, तृतीया, पंचमी और दशमी शुभ हैं।',
        'सुनिश्चित करें कि चुने हुए दिन शनि आपकी जन्म कुण्डली में चतुर्थ भाव पर दृष्टि नहीं डाल रहा।',
      ],
      sa: [
        'स्थिरनक्षत्राणि (रोहिणी उत्तरफाल्गुनी उत्तराषाढा उत्तरभाद्रपदम्) सम्पत्तिव्यवहारेषु उत्तमानि।',
        'गुरुवासरः (गुरुः — विस्तारः) सम्पत्तिपञ्जीकरणाय अत्यन्तानुकूलः।',
        'पितृपक्षे अधिकमासे ग्रहणकाले च सम्पत्तिव्यवहारान् वर्जयेत्।',
        'शुक्लपक्षतिथयः विशेषतः द्वितीया तृतीया पञ्चमी दशमी च शुभाः।',
        'चयनितदिने शनिः जन्मकुण्डल्यां चतुर्थभावं न पश्येत् इति सुनिश्चितं कुर्यात्।',
      ],
    },
    dates2026: [
      { date: '2026-04-16', label: { en: 'Apr 16 (Thu) — Rohini Nakshatra, Shukla Tritiya', hi: '16 अप्रैल (गुरु) — रोहिणी नक्षत्र, शुक्ल तृतीया', sa: '१६ एप्रिल् (गुरुः) — रोहिणीनक्षत्रं शुक्लतृतीया' } },
      { date: '2026-05-07', label: { en: 'May 7 (Thu) — Uttara Phalguni, Shukla Dashami', hi: '7 मई (गुरु) — उत्तर फाल्गुनी, शुक्ल दशमी', sa: '७ मई (गुरुः) — उत्तरफाल्गुनी शुक्लदशमी' } },
      { date: '2026-06-11', label: { en: 'Jun 11 (Thu) — Uttara Bhadrapada, Shukla Chaturdashi', hi: '11 जून (गुरु) — उत्तर भाद्रपद, शुक्ल चतुर्दशी', sa: '११ जून् (गुरुः) — उत्तरभाद्रपदं शुक्लचतुर्दशी' } },
      { date: '2026-09-24', label: { en: 'Sep 24 (Thu) — Uttara Ashadha, Shukla Trayodashi', hi: '24 सितम्बर (गुरु) — उत्तराषाढ़ा, शुक्ल त्रयोदशी', sa: '२४ सितम्बर् (गुरुः) — उत्तराषाढा शुक्लत्रयोदशी' } },
      { date: '2026-11-19', label: { en: 'Nov 19 (Thu) — Rohini Nakshatra, Kartik Shukla', hi: '19 नवम्बर (गुरु) — रोहिणी नक्षत्र, कार्तिक शुक्ल', sa: '१९ नवम्बर् (गुरुः) — रोहिणीनक्षत्रं कार्तिकशुक्लम्' } },
      { date: '2026-12-10', label: { en: 'Dec 10 (Thu) — Uttara Phalguni, Margashirsha Shukla', hi: '10 दिसम्बर (गुरु) — उत्तर फाल्गुनी, मार्गशीर्ष शुक्ल', sa: '१० दिसम्बर् (गुरुः) — उत्तरफाल्गुनी मार्गशीर्षशुक्लम्' } },
    ],
    faqs: [
      {
        question: { en: 'Which day is best for property registration?', hi: 'सम्पत्ति पंजीकरण के लिए कौन सा दिन सबसे अच्छा है?', sa: 'सम्पत्तिपञ्जीकरणाय कः दिनः श्रेष्ठः?' },
        answer: { en: 'Thursday (Jupiter\'s day) is considered the most auspicious for property registration and land purchase. Wednesday and Friday are also favorable. Avoid Saturday (Saturn — delays) and Tuesday (Mars — disputes).', hi: 'गुरुवार सम्पत्ति पंजीकरण और भूमि खरीद के लिए सबसे शुभ माना जाता है। बुधवार और शुक्रवार भी अनुकूल हैं। शनिवार (शनि — विलम्ब) और मंगलवार (मंगल — विवाद) से बचें।', sa: 'गुरुवासरः सम्पत्तिपञ्जीकरणाय भूमिक्रयाय च शुभतमः मन्यते। शनिवासरं (शनिः — विलम्बः) मङ्गलवासरं (मङ्गलः — विवादः) च वर्जयेत्।' },
      },
      {
        question: { en: 'Should plot shape matter when buying land?', hi: 'क्या जमीन खरीदते समय भूखण्ड का आकार मायने रखता है?', sa: 'भूमिक्रये भूखण्डस्य आकारः किं महत्त्वं वहति?' },
        answer: { en: 'Yes, Vastu Shastra strongly considers plot shape. Square and rectangular plots are considered auspicious. Irregular shapes, T-shaped, or triangular plots are generally avoided. The plot should ideally be higher in the southwest and lower in the northeast.', hi: 'हां, वास्तु शास्त्र भूखण्ड के आकार को अत्यन्त महत्वपूर्ण मानता है। वर्गाकार और आयताकार भूखण्ड शुभ माने जाते हैं। अनियमित आकार, T-आकार या त्रिकोणीय भूखण्ड सामान्यतः वर्जित हैं।', sa: 'आम्, वास्तुशास्त्रं भूखण्डस्य आकारम् अत्यन्तमहत्त्वेन विचारयति। चतुरस्रायताकारभूखण्डौ शुभौ मन्येते। अनियमिताकाराः त्रिकोणभूखण्डाश्च सामान्यतः वर्ज्याः।' },
      },
    ],
    related: ['griha-pravesh', 'business-start', 'vehicle-purchase'],
    keywords: ['property purchase muhurat 2026', 'land purchase muhurat', 'bhumi kray muhurat', 'jamin kharidne ka muhurat', 'plot registration muhurat', 'property registration date'],
  },

  // ─── 7. Mundan ───────────────────────────────────────────────
  {
    slug: 'mundan',
    activityId: 'mundan',
    name: { en: 'Mundan Muhurat', hi: 'मुंडन मुहूर्त', sa: 'मुण्डनमुहूर्तम्' },
    subtitle: { en: 'First Haircut Ceremony', hi: 'मुंडन संस्कार मुहूर्त', sa: 'मुण्डनसंस्कारमुहूर्तम्' },
    description: {
      en: 'Find the best auspicious date for your child\'s Mundan (Chudakarana) ceremony in 2026. This important Vedic sanskar marks the first haircut and is performed for health, longevity, and purification.',
      hi: '2026 में अपने बच्चे के मुंडन (चूड़ाकरण) संस्कार के लिए सबसे शुभ तिथि खोजें। यह महत्वपूर्ण वैदिक संस्कार स्वास्थ्य, दीर्घायु और शुद्धि के लिए किया जाता है।',
      sa: '२०२६ वर्षे स्वशिशोः मुण्डनस्य (चूडाकरणस्य) कृते शुभतमां तिथिं अन्विष्यतु।',
    },
    icon: 'Scissors',
    guidance: {
      en: [
        'Mundan is traditionally performed in the 1st, 3rd, 5th, or 7th year of a child\'s life (odd years).',
        'Ashwini, Mrigashira, Pushya, Hasta, Swati, Punarvasu, Shravana, and Revati are favorable nakshatras.',
        'Monday, Wednesday, Thursday, and Friday are the best weekdays for Mundan.',
        'The ceremony should be done during Shukla Paksha, preferably in the first half of the day.',
        'Avoid Mundan during the child\'s birth month (as per Hindu calendar), Pitru Paksha, and eclipse periods.',
      ],
      hi: [
        'मुंडन पारम्परिक रूप से बच्चे के 1ले, 3रे, 5वें या 7वें वर्ष में (विषम वर्ष) किया जाता है।',
        'अश्विनी, मृगशिरा, पुष्य, हस्त, स्वाती, पुनर्वसु, श्रवण और रेवती अनुकूल नक्षत्र हैं।',
        'सोमवार, बुधवार, गुरुवार और शुक्रवार मुंडन के लिए सबसे अच्छे वार हैं।',
        'संस्कार शुक्ल पक्ष में, अधिमानतः दिन के पहले भाग में करना चाहिए।',
        'बच्चे के जन्म मास (हिन्दू पंचांग अनुसार), पितृ पक्ष और ग्रहण काल में मुंडन से बचें।',
      ],
      sa: [
        'मुण्डनं पारम्परिकरूपेण शिशोः प्रथमे तृतीये पञ्चमे सप्तमे वा वर्षे (विषमवर्षे) क्रियते।',
        'अश्विनी मृगशिरा पुष्यं हस्तं स्वाती पुनर्वसु श्रवणं रेवती च अनुकूलनक्षत्राणि।',
        'सोमबुधगुरुशुक्रवासराः मुण्डनाय उत्तमाः।',
        'संस्कारः शुक्लपक्षे दिनस्य पूर्वार्धे कर्तव्यः।',
        'शिशोः जन्ममासे पितृपक्षे ग्रहणकाले च मुण्डनं वर्जयेत्।',
      ],
    },
    dates2026: [
      { date: '2026-04-20', label: { en: 'Apr 20 (Mon) — Shukla Saptami, Punarvasu Nakshatra', hi: '20 अप्रैल (सोम) — शुक्ल सप्तमी, पुनर्वसु नक्षत्र', sa: '२० एप्रिल् (सोमः) — शुक्लसप्तमी पुनर्वसुनक्षत्रम्' } },
      { date: '2026-05-06', label: { en: 'May 6 (Wed) — Shukla Navami, Hasta Nakshatra', hi: '6 मई (बुध) — शुक्ल नवमी, हस्त नक्षत्र', sa: '६ मई (बुधः) — शुक्लनवमी हस्तनक्षत्रम्' } },
      { date: '2026-06-01', label: { en: 'Jun 1 (Mon) — Shukla Saptami, Swati Nakshatra', hi: '1 जून (सोम) — शुक्ल सप्तमी, स्वाती नक्षत्र', sa: '१ जून् (सोमः) — शुक्लसप्तमी स्वातीनक्षत्रम्' } },
      { date: '2026-09-16', label: { en: 'Sep 16 (Wed) — Shukla Panchami, Pushya Nakshatra', hi: '16 सितम्बर (बुध) — शुक्ल पंचमी, पुष्य नक्षत्र', sa: '१६ सितम्बर् (बुधः) — शुक्लपञ्चमी पुष्यनक्षत्रम्' } },
      { date: '2026-11-20', label: { en: 'Nov 20 (Fri) — Shukla Dashami, Mrigashira Nakshatra', hi: '20 नवम्बर (शुक्र) — शुक्ल दशमी, मृगशिरा नक्षत्र', sa: '२० नवम्बर् (शुक्रः) — शुक्लदशमी मृगशिरानक्षत्रम्' } },
    ],
    faqs: [
      {
        question: { en: 'At what age should Mundan be performed?', hi: 'मुंडन किस उम्र में करना चाहिए?', sa: 'मुण्डनं कस्मिन् वयसि कर्तव्यम्?' },
        answer: { en: 'According to Vedic tradition, Mundan should be performed in odd years — the 1st, 3rd, 5th, or 7th year. The most common is the 1st or 3rd year. It should ideally be completed before the child turns 7. Some regional traditions have specific preferences.', hi: 'वैदिक परम्परा के अनुसार मुंडन विषम वर्षों में — 1ले, 3रे, 5वें या 7वें वर्ष में करना चाहिए। सबसे सामान्य 1ला या 3रा वर्ष है। बच्चे के 7 वर्ष से पहले पूरा होना चाहिए।', sa: 'वैदिकपरम्परानुसारं मुण्डनं विषमवर्षेषु — प्रथमे तृतीये पञ्चमे सप्तमे वा वर्षे कर्तव्यम्। सर्वसामान्यं प्रथमं तृतीयं वा वर्षम्।' },
      },
      {
        question: { en: 'Where should Mundan be performed?', hi: 'मुंडन कहां करना चाहिए?', sa: 'मुण्डनं कुत्र कर्तव्यम्?' },
        answer: { en: 'Traditionally, Mundan is performed at a temple or at home. Many families choose to perform it at Tirupati, Varanasi, Ujjain, or other pilgrimage sites. The hair is often offered to the deity or immersed in a sacred river.', hi: 'पारम्परिक रूप से मुंडन मन्दिर या घर पर किया जाता है। कई परिवार तिरुपति, वाराणसी, उज्जैन या अन्य तीर्थ स्थलों पर करवाते हैं। बाल अक्सर देवता को अर्पित या पवित्र नदी में प्रवाहित किए जाते हैं।', sa: 'पारम्परिकरूपेण मुण्डनं मन्दिरे गृहे वा क्रियते। बहवः कुटुम्बाः तिरुपतौ वाराणस्यां उज्जयिन्यां वा कर्तुं वृणते। केशाः देवताय अर्प्यन्ते पवित्रनद्यां वा प्रवाहयन्ति।' },
      },
    ],
    related: ['naming-ceremony', 'annaprashan', 'upanayana'],
    keywords: ['mundan muhurat 2026', 'mundan sanskar date', 'chudakarana muhurat', 'first haircut muhurat', 'baby mundan date', 'mundan ceremony date'],
  },

  // ─── 8. Annaprashan ──────────────────────────────────────────
  {
    slug: 'annaprashan',
    activityId: 'namakarana', // closest available activity
    name: { en: 'Annaprashan Muhurat', hi: 'अन्नप्राशन मुहूर्त', sa: 'अन्नप्राशनमुहूर्तम्' },
    subtitle: { en: 'First Feeding Ceremony', hi: 'अन्नप्राशन संस्कार मुहूर्त', sa: 'अन्नप्राशनसंस्कारमुहूर्तम्' },
    description: {
      en: 'Find auspicious dates for Annaprashan (first rice feeding) ceremony in 2026. This Vedic sanskar marks the baby\'s transition from milk to solid food and is a joyous family celebration.',
      hi: '2026 में अन्नप्राशन (पहला अन्न) संस्कार के लिए शुभ तिथियां खोजें। यह वैदिक संस्कार शिशु के दूध से ठोस आहार की ओर संक्रमण को चिह्नित करता है।',
      sa: '२०२६ वर्षे अन्नप्राशनसंस्कारस्य कृते शुभतिथीः अन्विष्यतु। एषः वैदिकसंस्कारः शिशोः दुग्धात् स्थिराहाराय संक्रमणं सूचयति।',
    },
    icon: 'UtensilsCrossed',
    guidance: {
      en: [
        'Annaprashan is typically performed in the 6th, 7th, or 8th month for boys, and the 5th, 7th, or 9th month for girls.',
        'Ashwini, Rohini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, and Revati are favorable nakshatras.',
        'Monday, Wednesday, Thursday, and Friday are the recommended weekdays.',
        'The ceremony should be performed during Shukla Paksha, ideally during Amrit or Shubh Choghadiya.',
        'The first food offered is usually rice mixed with ghee, often sweetened with honey or sugar.',
      ],
      hi: [
        'अन्नप्राशन आमतौर पर लड़कों के लिए 6वें, 7वें या 8वें महीने में और लड़कियों के लिए 5वें, 7वें या 9वें महीने में किया जाता है।',
        'अश्विनी, रोहिणी, मृगशिरा, पुनर्वसु, पुष्य, हस्त, स्वाती, अनुराधा, श्रवण और रेवती अनुकूल नक्षत्र हैं।',
        'सोमवार, बुधवार, गुरुवार और शुक्रवार अनुशंसित वार हैं।',
        'संस्कार शुक्ल पक्ष में, आदर्शतः अमृत या शुभ चौघड़िया में करना चाहिए।',
        'पहला भोजन आमतौर पर घी मिला चावल होता है, अक्सर शहद या चीनी से मीठा किया जाता है।',
      ],
      sa: [
        'अन्नप्राशनं सामान्यतः बालकानां षष्ठे सप्तमे अष्टमे वा मासे बालिकानां पञ्चमे सप्तमे नवमे वा मासे क्रियते।',
        'अश्विनी रोहिणी मृगशिरा पुनर्वसु पुष्यं हस्तं स्वाती अनुराधा श्रवणं रेवती च अनुकूलनक्षत्राणि।',
        'सोमबुधगुरुशुक्रवासराः अनुशंसिताः।',
        'संस्कारः शुक्लपक्षे अमृतशुभचौघड़ियायां कर्तव्यः।',
        'प्रथमं भोजनं सामान्यतः घृतमिश्रितान्नं मधुना शर्करया वा मधुरीकृतम्।',
      ],
    },
    dates2026: [
      { date: '2026-04-22', label: { en: 'Apr 22 (Wed) — Shukla Dashami, Hasta Nakshatra', hi: '22 अप्रैल (बुध) — शुक्ल दशमी, हस्त नक्षत्र', sa: '२२ एप्रिल् (बुधः) — शुक्लदशमी हस्तनक्षत्रम्' } },
      { date: '2026-05-04', label: { en: 'May 4 (Mon) — Shukla Saptami, Rohini Nakshatra', hi: '4 मई (सोम) — शुक्ल सप्तमी, रोहिणी नक्षत्र', sa: '४ मई (सोमः) — शुक्लसप्तमी रोहिणीनक्षत्रम्' } },
      { date: '2026-06-01', label: { en: 'Jun 1 (Mon) — Shukla Saptami, Swati Nakshatra', hi: '1 जून (सोम) — शुक्ल सप्तमी, स्वाती नक्षत्र', sa: '१ जून् (सोमः) — शुक्लसप्तमी स्वातीनक्षत्रम्' } },
      { date: '2026-09-21', label: { en: 'Sep 21 (Mon) — Shukla Dashami, Rohini Nakshatra', hi: '21 सितम्बर (सोम) — शुक्ल दशमी, रोहिणी नक्षत्र', sa: '२१ सितम्बर् (सोमः) — शुक्लदशमी रोहिणीनक्षत्रम्' } },
      { date: '2026-11-18', label: { en: 'Nov 18 (Wed) — Shukla Trayodashi, Revati Nakshatra', hi: '18 नवम्बर (बुध) — शुक्ल त्रयोदशी, रेवती नक्षत्र', sa: '१८ नवम्बर् (बुधः) — शुक्लत्रयोदशी रेवतीनक्षत्रम्' } },
    ],
    faqs: [
      {
        question: { en: 'At what age is Annaprashan performed?', hi: 'अन्नप्राशन किस उम्र में किया जाता है?', sa: 'अन्नप्राशनं कस्मिन् वयसि क्रियते?' },
        answer: { en: 'Annaprashan is performed between 5-9 months of age. For boys, the 6th or 8th month is preferred (even months). For girls, the 5th, 7th, or 9th month is preferred (odd months). Modern pediatric advice to introduce solids around 6 months aligns well with this tradition.', hi: 'अन्नप्राशन 5-9 महीने की उम्र के बीच किया जाता है। लड़कों के लिए 6वां या 8वां महीना (सम माह) और लड़कियों के लिए 5वां, 7वां या 9वां महीना (विषम माह) पसन्द किया जाता है।', sa: 'अन्नप्राशनं ५-९ मासवयसि क्रियते। बालकानां षष्ठो अष्टमो वा मासः (सममासः) बालिकानां पञ्चमः सप्तमो नवमो वा मासः (विषममासः) श्रेष्ठः।' },
      },
      {
        question: { en: 'What food is given during Annaprashan?', hi: 'अन्नप्राशन में कौन सा भोजन दिया जाता है?', sa: 'अन्नप्राशने किं भोजनं दीयते?' },
        answer: { en: 'The traditional first food is rice (anna) cooked with ghee, often mixed with a small amount of honey and gold dust (symbolic). In Bengali tradition, the baby is offered rice payesh (kheer). In South India, it may be rice with dal. The food is first offered to the deity, then fed to the child by the maternal uncle.', hi: 'पारम्परिक पहला भोजन घी में पका चावल (अन्न) है, अक्सर थोड़ा शहद और स्वर्ण धूलि (प्रतीकात्मक) मिलाई जाती है। बंगाली परम्परा में बच्चे को चावल की पायसम दी जाती है। बच्चे को पहले मामा खिलाते हैं।', sa: 'पारम्परिकं प्रथमभोजनं घृतेन पक्वम् अन्नम् (तण्डुलम्) अस्ति, प्रायः मधुना स्वर्णधूल्या (प्रतीकात्मकम्) च मिश्रितम्। शिशवे प्रथमं मातुलः भोजनं ददाति।' },
      },
    ],
    related: ['naming-ceremony', 'mundan', 'upanayana'],
    keywords: ['annaprashan muhurat 2026', 'first feeding ceremony date', 'annaprashan sanskar', 'rice ceremony muhurat', 'anna prashan date', 'annaprasana muhurat'],
  },

  // ─── 9. Upanayana ────────────────────────────────────────────
  {
    slug: 'upanayana',
    activityId: 'upanayana',
    name: { en: 'Upanayana Muhurat', hi: 'उपनयन मुहूर्त', sa: 'उपनयनमुहूर्तम्' },
    subtitle: { en: 'Thread Ceremony (Janeu)', hi: 'जनेऊ संस्कार मुहूर्त', sa: 'उपनयनसंस्कारमुहूर्तम्' },
    description: {
      en: 'Find auspicious dates for Upanayana (sacred thread ceremony / Janeu) in 2026. This important Vedic sanskar initiates the child into Vedic study and marks their spiritual second birth.',
      hi: '2026 में उपनयन (पवित्र जनेऊ संस्कार) के लिए शुभ तिथियां खोजें। यह महत्वपूर्ण वैदिक संस्कार बच्चे को वैदिक अध्ययन में दीक्षित करता है।',
      sa: '२०२६ वर्षे उपनयनस्य (पवित्रयज्ञोपवीतसंस्कारस्य) कृते शुभतिथीः अन्विष्यतु। एषः महत्त्वपूर्णः वैदिकसंस्कारः बालं वेदाध्ययने दीक्षयति।',
    },
    icon: 'GraduationCap',
    guidance: {
      en: [
        'Upanayana is traditionally performed between ages 7-16, ideally before the onset of puberty.',
        'The months of Magha, Phalguna, Chaitra, and Vaishakha are considered most auspicious.',
        'Hasta, Chitra, Swati, Pushya, Dhanishtha, Shravana, and Revati nakshatras are favorable.',
        'Monday, Wednesday, Thursday, and Friday are the preferred weekdays.',
        'Jupiter and Venus must not be combust, and the ceremony should not be during Chaturmas.',
      ],
      hi: [
        'उपनयन पारम्परिक रूप से 7-16 वर्ष की उम्र में, आदर्शतः यौवनारम्भ से पहले किया जाता है।',
        'माघ, फाल्गुन, चैत्र और वैशाख मास सबसे शुभ माने जाते हैं।',
        'हस्त, चित्रा, स्वाती, पुष्य, धनिष्ठा, श्रवण और रेवती अनुकूल नक्षत्र हैं।',
        'सोमवार, बुधवार, गुरुवार और शुक्रवार पसन्दीदा वार हैं।',
        'गुरु और शुक्र अस्त नहीं होने चाहिए, और संस्कार चातुर्मास में नहीं होना चाहिए।',
      ],
      sa: [
        'उपनयनं पारम्परिकरूपेण ७-१६ वर्षवयसि, आदर्शतः यौवनारम्भात् पूर्वं क्रियते।',
        'माघफाल्गुनचैत्रवैशाखमासाः शुभतमाः मन्यन्ते।',
        'हस्तं चित्रा स्वाती पुष्यं धनिष्ठा श्रवणं रेवती च अनुकूलनक्षत्राणि।',
        'सोमबुधगुरुशुक्रवासराः अभीष्टाः।',
        'गुरुशुक्रौ अस्तौ न भवेताम्, संस्कारश्च चातुर्मासे न कर्तव्यः।',
      ],
    },
    dates2026: [
      { date: '2026-04-15', label: { en: 'Apr 15 (Wed) — Vaishakh Shukla, Pushya Nakshatra', hi: '15 अप्रैल (बुध) — वैशाख शुक्ल, पुष्य नक्षत्र', sa: '१५ एप्रिल् (बुधः) — वैशाखशुक्लम् पुष्यनक्षत्रम्' } },
      { date: '2026-04-22', label: { en: 'Apr 22 (Wed) — Vaishakh Shukla Dashami, Hasta', hi: '22 अप्रैल (बुध) — वैशाख शुक्ल दशमी, हस्त', sa: '२२ एप्रिल् (बुधः) — वैशाखशुक्लदशमी हस्तम्' } },
      { date: '2026-05-06', label: { en: 'May 6 (Wed) — Jyeshtha Shukla, Hasta Nakshatra', hi: '6 मई (बुध) — ज्येष्ठ शुक्ल, हस्त नक्षत्र', sa: '६ मई (बुधः) — ज्येष्ठशुक्लम् हस्तनक्षत्रम्' } },
      { date: '2026-05-20', label: { en: 'May 20 (Wed) — Jyeshtha Shukla Saptami, Shravana', hi: '20 मई (बुध) — ज्येष्ठ शुक्ल सप्तमी, श्रवण', sa: '२० मई (बुधः) — ज्येष्ठशुक्लसप्तमी श्रवणम्' } },
      { date: '2026-06-04', label: { en: 'Jun 4 (Thu) — Ashadha Shukla, Swati Nakshatra', hi: '4 जून (गुरु) — आषाढ़ शुक्ल, स्वाती नक्षत्र', sa: '४ जून् (गुरुः) — आषाढशुक्लम् स्वातीनक्षत्रम्' } },
    ],
    faqs: [
      {
        question: { en: 'What is the significance of the sacred thread?', hi: 'जनेऊ (यज्ञोपवीत) का क्या महत्व है?', sa: 'यज्ञोपवीतस्य किं महत्त्वम्?' },
        answer: { en: 'The sacred thread (Yajnopavita) has three strands symbolizing the three Vedas (Rig, Yajur, Sama), or alternatively Brahma-Vishnu-Maheshwara. It represents the commitment to learning, discipline, and spiritual growth. The ceremony is considered a "second birth" (Dwija), marking the child\'s formal entry into Vedic education.', hi: 'पवित्र जनेऊ (यज्ञोपवीत) के तीन धागे तीन वेदों (ऋग्, यजुर्, साम) या ब्रह्मा-विष्णु-महेश्वर का प्रतीक हैं। यह ज्ञान, अनुशासन और आध्यात्मिक विकास की प्रतिबद्धता दर्शाता है। संस्कार को "द्विजन्म" (द्विज) माना जाता है।', sa: 'यज्ञोपवीतस्य त्रयो गुणाः त्रीन् वेदान् (ऋक् यजुः सामन्) अथवा ब्रह्मविष्णुमहेश्वरान् सूचयन्ति। एषः ज्ञानानुशासनाध्यात्मिकविकासप्रतिबद्धतां दर्शयति। संस्कारः "द्विजन्म" (द्विजः) इति मन्यते।' },
      },
      {
        question: { en: 'At what age should Upanayana be performed?', hi: 'उपनयन किस उम्र में करना चाहिए?', sa: 'उपनयनं कस्मिन् वयसि कर्तव्यम्?' },
        answer: { en: 'The ideal age varies by Varna: Brahmins at 7-8 years, Kshatriyas at 11-12, and Vaishyas at 12-13. Modern practice commonly performs it between 7-12 years. The ceremony should ideally be completed before the age of 16.', hi: 'आदर्श आयु वर्ण के अनुसार भिन्न होती है: ब्राह्मण 7-8 वर्ष, क्षत्रिय 11-12, वैश्य 12-13। आधुनिक प्रचलन में 7-12 वर्ष की आयु में किया जाता है। संस्कार आदर्शतः 16 वर्ष से पहले पूरा होना चाहिए।', sa: 'आदर्शवयः वर्णानुसारं भिद्यते — ब्राह्मणाः ७-८ वर्षे, क्षत्रियाः ११-१२, वैश्याः १२-१३। आधुनिकप्रचलने ७-१२ वर्षवयसि क्रियते। संस्कारः १६ वर्षात् पूर्वं सम्पन्नः भवेत्।' },
      },
    ],
    related: ['mundan', 'naming-ceremony', 'wedding'],
    keywords: ['upanayana muhurat 2026', 'thread ceremony muhurat', 'janeu sanskar date', 'sacred thread ceremony', 'upanayana sanskar', 'yajnopavita muhurat'],
  },

  // ─── 10. Travel ──────────────────────────────────────────────
  {
    slug: 'travel',
    activityId: 'travel',
    name: { en: 'Travel Muhurat', hi: 'यात्रा मुहूर्त', sa: 'यात्रामुहूर्तम्' },
    subtitle: { en: 'Yatra Muhurat', hi: 'यात्रा का शुभ मुहूर्त', sa: 'यात्रायाः शुभमुहूर्तम्' },
    description: {
      en: 'Find the best auspicious times for starting a journey in 2026. Whether it is a business trip, pilgrimage, or relocation, Vedic astrology offers guidance on the safest and most favorable travel times.',
      hi: '2026 में यात्रा आरम्भ करने के लिए सबसे शुभ समय खोजें। व्यापारिक यात्रा, तीर्थयात्रा या स्थानांतरण, वैदिक ज्योतिष सुरक्षित और अनुकूल यात्रा समय का मार्गदर्शन करता है।',
      sa: '२०२६ वर्षे यात्रारम्भस्य कृते शुभतमं समयम् अन्विष्यतु। वाणिज्ययात्रा तीर्थयात्रा स्थानान्तरणं वा, वैदिकज्योतिषं सुरक्षितानुकूलयात्रासमयस्य मार्गदर्शनं करोति।',
    },
    icon: 'Plane',
    guidance: {
      en: [
        'Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Anuradha, Shravana, Dhanishtha, and Revati are favorable nakshatras for travel.',
        'Monday, Wednesday, Thursday, and Friday are the best weekdays for beginning a journey.',
        'Avoid starting travel during Rahu Kaal, Yamaganda Kaal, and Varjyam periods.',
        'Check Nivas Shool (directional defect) — certain directions are inauspicious on specific weekdays.',
        'The direction of first travel after leaving home should be auspicious. East and North are generally favorable.',
      ],
      hi: [
        'अश्विनी, मृगशिरा, पुनर्वसु, पुष्य, हस्त, अनुराधा, श्रवण, धनिष्ठा और रेवती यात्रा के लिए अनुकूल नक्षत्र हैं।',
        'सोमवार, बुधवार, गुरुवार और शुक्रवार यात्रा आरम्भ के लिए सबसे अच्छे वार हैं।',
        'राहु काल, यमगण्ड काल और वर्ज्यम् अवधि में यात्रा शुरू करने से बचें।',
        'निवास शूल (दिशा दोष) जांचें — विशिष्ट वारों पर कुछ दिशाएं अशुभ होती हैं।',
        'घर से निकलने के बाद पहली यात्रा की दिशा शुभ होनी चाहिए। पूर्व और उत्तर सामान्यतः अनुकूल हैं।',
      ],
      sa: [
        'अश्विनी मृगशिरा पुनर्वसु पुष्यं हस्तम् अनुराधा श्रवणं धनिष्ठा रेवती च यात्रायै अनुकूलनक्षत्राणि।',
        'सोमबुधगुरुशुक्रवासराः यात्रारम्भाय उत्तमाः।',
        'राहुकाले यमगण्डकाले वर्ज्यमवधौ च यात्रारम्भं वर्जयेत्।',
        'निवासशूलं (दिशादोषम्) परीक्षतु — विशिष्टवासरेषु केचन दिशाः अशुभाः भवन्ति।',
        'गृहात् निर्गमनानन्तरं प्रथमयात्रायाः दिक् शुभा भवेत्। पूर्वोत्तरदिशौ सामान्यतः अनुकूले।',
      ],
    },
    dates2026: [
      { date: '2026-04-15', label: { en: 'Apr 15 (Wed) — Pushya Nakshatra, Shukla Paksha', hi: '15 अप्रैल (बुध) — पुष्य नक्षत्र, शुक्ल पक्ष', sa: '१५ एप्रिल् (बुधः) — पुष्यनक्षत्रं शुक्लपक्षः' } },
      { date: '2026-05-08', label: { en: 'May 8 (Fri) — Hasta Nakshatra, Shukla Ekadashi', hi: '8 मई (शुक्र) — हस्त नक्षत्र, शुक्ल एकादशी', sa: '८ मई (शुक्रः) — हस्तनक्षत्रं शुक्लएकादशी' } },
      { date: '2026-06-05', label: { en: 'Jun 5 (Fri) — Shravana Nakshatra, Shukla Dashami', hi: '5 जून (शुक्र) — श्रवण नक्षत्र, शुक्ल दशमी', sa: '५ जून् (शुक्रः) — श्रवणनक्षत्रं शुक्लदशमी' } },
      { date: '2026-09-14', label: { en: 'Sep 14 (Mon) — Ashwini Nakshatra, Shukla Tritiya', hi: '14 सितम्बर (सोम) — अश्विनी नक्षत्र, शुक्ल तृतीया', sa: '१४ सितम्बर् (सोमः) — अश्विनीनक्षत्रं शुक्लतृतीया' } },
      { date: '2026-11-12', label: { en: 'Nov 12 (Thu) — Mrigashira Nakshatra, Shukla Dashami', hi: '12 नवम्बर (गुरु) — मृगशिरा नक्षत्र, शुक्ल दशमी', sa: '१२ नवम्बर् (गुरुः) — मृगशिरानक्षत्रं शुक्लदशमी' } },
      { date: '2026-12-09', label: { en: 'Dec 9 (Wed) — Anuradha Nakshatra, Shukla Navami', hi: '9 दिसम्बर (बुध) — अनुराधा नक्षत्र, शुक्ल नवमी', sa: '९ दिसम्बर् (बुधः) — अनुराधानक्षत्रं शुक्लनवमी' } },
    ],
    faqs: [
      {
        question: { en: 'What is Nivas Shool and how does it affect travel?', hi: 'निवास शूल क्या है और यात्रा पर कैसे प्रभाव डालता है?', sa: 'निवासशूलं किम् अस्ति यात्रां कथं प्रभावयति?' },
        answer: { en: 'Nivas Shool is a directional defect based on the weekday. For example, traveling East on Saturday, South on Thursday, or West on Sunday is considered inauspicious. Check our Nivas Shool calculator to find safe directions for your travel day.', hi: 'निवास शूल वार पर आधारित दिशा दोष है। उदाहरण के लिए, शनिवार को पूर्व, गुरुवार को दक्षिण, या रविवार को पश्चिम की ओर यात्रा अशुभ मानी जाती है। अपने यात्रा दिन की सुरक्षित दिशाओं के लिए हमारा निवास शूल गणक देखें।', sa: 'निवासशूलं वासरानुसारं दिशादोषः। यथा शनिवासरे पूर्वं गुरुवासरे दक्षिणं रविवासरे पश्चिमं यात्रा अशुभा मन्यते। स्वयात्रादिनस्य सुरक्षितदिशार्थं अस्माकं निवासशूलगणकं पश्यतु।' },
      },
      {
        question: { en: 'Should I avoid travel during Rahu Kaal?', hi: 'क्या राहु काल में यात्रा से बचना चाहिए?', sa: 'राहुकाले यात्रां वर्जयेत् किम्?' },
        answer: { en: 'Yes, starting a journey during Rahu Kaal is strongly discouraged in Vedic tradition. Rahu Kaal lasts approximately 1.5 hours each day and is considered inauspicious for all new beginnings. However, if you are already traveling, there is no need to stop during Rahu Kaal.', hi: 'हां, वैदिक परम्परा में राहु काल में यात्रा शुरू करना अत्यन्त हतोत्साहित है। राहु काल प्रतिदिन लगभग 1.5 घंटे का होता है और सभी नए कार्यों के लिए अशुभ माना जाता है। हालांकि, यदि आप पहले से यात्रा कर रहे हैं तो राहु काल में रुकने की आवश्यकता नहीं।', sa: 'आम्, वैदिकपरम्परायां राहुकाले यात्रारम्भः अत्यन्तं निवार्यते। राहुकालः प्रतिदिनं प्रायः सार्धहोरापरिमितः सर्वेषां नवकार्याणां कृते अशुभः मन्यते। तथापि यदि पूर्वमेव यात्रायां स्थः तदा राहुकाले स्थातुं नावश्यकम्।' },
      },
      {
        question: { en: 'Which direction should I face when starting a journey?', hi: 'यात्रा शुरू करते समय किस दिशा में मुख होना चाहिए?', sa: 'यात्रारम्भे कां दिशं प्रति मुखं कर्तव्यम्?' },
        answer: { en: 'East (the direction of sunrise) and North (the direction of divine grace) are universally considered auspicious for beginning a journey. Some traditions also recommend stepping out of the house with the right foot first. The specific auspicious direction can vary by weekday — check our Nivas Shool tool.', hi: 'पूर्व (सूर्योदय की दिशा) और उत्तर (दिव्य कृपा की दिशा) यात्रा आरम्भ के लिए सार्वभौमिक रूप से शुभ माने जाते हैं। कुछ परम्पराएं दाहिने पैर से घर से बाहर निकलने की भी सलाह देती हैं।', sa: 'पूर्वदिक् (सूर्योदयदिक्) उत्तरदिक् (दिव्यकृपादिक्) च यात्रारम्भाय सार्वभौमरूपेण शुभे मन्येते। केचन परम्पराः दक्षिणपादेन गृहात् निर्गमनमपि अनुशंसन्ति।' },
      },
    ],
    related: ['vehicle-purchase', 'business-start', 'griha-pravesh'],
    keywords: ['travel muhurat 2026', 'yatra muhurat', 'journey muhurat', 'safe travel time', 'yatra ka shubh muhurat', 'travel start time astrology'],
  },
];

/** Get a muhurta type by slug, or undefined if not found. */
export function getMuhurtaType(slug: string): MuhurtaTypeInfo | undefined {
  return MUHURTA_TYPES.find(t => t.slug === slug);
}

/** Get all muhurta type slugs. */
export function getMuhurtaTypeSlugs(): string[] {
  return MUHURTA_TYPES.map(t => t.slug);
}
