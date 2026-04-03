import type { PujaVidhi } from './types';

export const KARVA_CHAUTH_PUJA: PujaVidhi = {
  festivalSlug: 'karva-chauth',
  category: 'vrat',
  deity: { en: 'Shiva-Parvati & Karva Mata', hi: 'शिव-पार्वती एवं करवा माता', sa: 'शिवपार्वती करवामाता च' },

  samagri: [
    { name: { en: 'Karva (small earthen pot with lid)', hi: 'करवा (ढक्कनदार छोटा मिट्टी का बर्तन)', sa: 'करवा (सकपाटं लघुमृत्पात्रम्)' }, note: { en: 'The namesake item — fill with water and offer to the moon', hi: 'इसी से व्रत का नाम है — जल भरकर चन्द्रमा को अर्पित करें', sa: 'अस्मात् व्रतस्य नाम — जलपूर्णं चन्द्राय अर्पयेत्' }, category: 'vessels', essential: true },
    { name: { en: 'Chalni (sieve/strainer)', hi: 'छलनी', sa: 'चालनी' }, note: { en: 'For sighting the moon and husband\'s face', hi: 'चन्द्रमा और पति का चेहरा देखने के लिए', sa: 'चन्द्रं पतिमुखं च दर्शनार्थम्' }, category: 'other', essential: true },
    { name: { en: 'Diya (earthen lamp with ghee/oil)', hi: 'दीया (घी/तेल का मिट्टी का दीपक)', sa: 'दीपः (घृत/तैलमृद्दीपः)' }, category: 'puja_items', essential: true },
    { name: { en: 'Henna/Mehendi', hi: 'मेहँदी', sa: 'मेन्धिका' }, category: 'other', essential: false },
    { name: { en: 'Bangles (red/green)', hi: 'चूड़ियाँ (लाल/हरी)', sa: 'कङ्कणानि (रक्तहरितानि)' }, category: 'clothing', essential: false },
    { name: { en: 'Sindoor (vermilion)', hi: 'सिन्दूर', sa: 'सिन्दूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Sweets (mathri, namkeen, laddoo)', hi: 'मिठाई (मठरी, नमकीन, लड्डू)', sa: 'मिष्टान्नानि (मठरी, लड्डुकम्)' }, category: 'food', essential: true },
    { name: { en: 'Fruits (apple, pomegranate, banana)', hi: 'फल (सेब, अनार, केला)', sa: 'फलानि (सेवफलम्, दाडिमम्, कदलीफलम्)' }, category: 'food', essential: true },
    { name: { en: 'Water (for arghya to moon)', hi: 'जल (चन्द्रमा को अर्घ्य के लिए)', sa: 'जलम् (चन्द्रार्घ्यार्थम्)' }, category: 'other', essential: true },
    { name: { en: 'Aarti thali (plate with diya, kumkum, akshat, flowers)', hi: 'आरती की थाली (दीपक, कुमकुम, अक्षत, फूल सहित)', sa: 'आरात्रिकपात्रम् (दीपकुङ्कुमाक्षतपुष्पसहितम्)' }, category: 'vessels', essential: true },
    { name: { en: 'Karva Chauth Katha book', hi: 'करवा चौथ कथा पुस्तक', sa: 'करवाचौथकथापुस्तकम्' }, category: 'vessels', essential: true },
    { name: { en: 'Gaur Mata idol (clay image of Parvati)', hi: 'गौर माता की मूर्ति (पार्वती की मिट्टी की मूर्ति)', sa: 'गौरीमातुः मूर्तिः (पार्वत्याः मृन्मूर्तिः)' }, category: 'puja_items', essential: true },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Karva Chauth falls on Krishna Paksha Chaturthi (4th day of waning moon) in Kartik month. The fast-breaking is tied to moonrise — the fast cannot be broken until the moon is sighted through the sieve. Moonrise time varies by location and must be computed.',
    hi: 'करवा चौथ कार्तिक माह की कृष्ण पक्ष चतुर्थी (घटते चन्द्रमा का चौथा दिन) को पड़ता है। उपवास तोड़ना चन्द्रोदय से जुड़ा है — छलनी से चन्द्रमा के दर्शन होने तक उपवास नहीं तोड़ा जा सकता। चन्द्रोदय का समय स्थानानुसार भिन्न होता है।',
    sa: 'करवाचौथं कार्तिकमासस्य कृष्णपक्षचतुर्थ्यां (अपक्षयचन्द्रस्य चतुर्थे दिने) भवति। व्रतभङ्गनं चन्द्रोदयेन सम्बद्धम् — चालन्या चन्द्रदर्शनं यावत् व्रतं न भङ्गनीयम्। चन्द्रोदयकालः स्थानानुसारं भिद्यते।',
  },

  sankalpa: {
    en: 'On this sacred Karva Chauth, I observe this nirjala vrat for the long life, health, and prosperity of my husband. I worship Shiva-Parvati and Karva Mata with devotion, praying that my husband be blessed with a hundred years of life.',
    hi: 'इस पवित्र करवा चौथ पर, अपने पति की दीर्घायु, स्वास्थ्य और समृद्धि के लिए मैं यह निर्जला व्रत रखती हूँ। मैं भक्तिपूर्वक शिव-पार्वती और करवा माता की पूजा करती हूँ, प्रार्थना करती हूँ कि मेरे पति शतायु हों।',
    sa: 'अस्मिन् पवित्रे करवाचौथे स्वपत्युः दीर्घायुःस्वास्थ्यसमृद्ध्यर्थम् इदं निर्जलव्रतम् आचरामि। भक्त्या शिवपार्वतीकरवामातापूजनं करोमि, प्रार्थये मम पतिः शतायुः भवेत्।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Pre-Dawn Sargi Meal', hi: 'प्रातःकाल सरगी भोजन', sa: 'प्रभातपूर्वसर्गीभोजनम्' },
      description: {
        en: 'Before sunrise (typically 4-5 AM), the mother-in-law provides the sargi — a pre-fast meal containing sweets (mathri, feni), fruits, dry fruits, milk, and vermicelli (seviyan). The wife eats this meal before dawn as it will be the last food and water until moonrise. This is a gesture of love from the mother-in-law.',
        hi: 'सूर्योदय से पहले (सामान्यतः सुबह 4-5 बजे) सास सरगी देती हैं — व्रत पूर्व भोजन जिसमें मिठाई (मठरी, फेनी), फल, मेवे, दूध और सेवइयाँ होती हैं। पत्नी यह भोजन भोर से पहले खाती हैं क्योंकि चन्द्रोदय तक यह अन्तिम भोजन और जल होगा। यह सास का स्नेह भरा भाव है।',
        sa: 'सूर्योदयात् प्राक् (प्रायः प्रभातचतुर्थपञ्चमवादने) श्वश्रूः सर्गीं ददाति — व्रतपूर्वभोजनं यत्र मिष्टान्नानि, फलानि, शुष्कफलानि, क्षीरं, सेवइयाः च। पत्नी एतत् भोजनं प्रभातात् प्राक् भक्षयति यतः चन्द्रोदयपर्यन्तम् एतत् अन्तिमम् अन्नजलम्। एषा श्वश्र्वाः स्नेहभावना।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Nirjala Fast — Full Day', hi: 'निर्जला उपवास — पूरा दिन', sa: 'निर्जलव्रतम् — सर्वं दिनम्' },
      description: {
        en: 'After sargi, observe a strict nirjala (without water) fast for the entire day. No food, no water, not even a single drop — until the moon is sighted in the evening. Spend the day in prayer, getting dressed in bridal attire, and applying mehendi. Married women typically wear their wedding outfit or festive clothes, complete with bangles, sindoor, and jewelry.',
        hi: 'सरगी के बाद पूरे दिन कठोर निर्जला (बिना जल) उपवास रखें। कोई भोजन नहीं, कोई जल नहीं, एक बूँद भी नहीं — शाम को चन्द्र दर्शन तक। दिन प्रार्थना, दुल्हन जैसा श्रृंगार और मेहँदी लगाने में बिताएँ। विवाहित महिलाएँ सामान्यतः अपनी शादी की पोशाक या उत्सव के वस्त्र, चूड़ियाँ, सिन्दूर और आभूषण पहनती हैं।',
        sa: 'सर्ग्यनन्तरं सर्वं दिनं कठोरं निर्जलव्रतम् (जलं विना) आचरेत्। न अन्नम्, न जलम्, एकम् अपि बिन्दुं न — सायं चन्द्रदर्शनपर्यन्तम्। दिनं प्रार्थनायां वधूवत् श्रृङ्गारे मेन्धिकालेपने च यापयेत्। विवाहिताः स्त्रियः प्रायः विवाहवस्त्रं कङ्कणानि सिन्दूरम् आभूषणानि च धारयन्ति।',
      },
      duration: 'Full day',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Evening Puja with Women', hi: 'सायं महिलाओं के साथ पूजा', sa: 'सायं स्त्रीभिः सह पूजनम्' },
      description: {
        en: 'In the evening (before moonrise), gather with other married women. Set up the Gaur Mata (Parvati) idol. Arrange the aarti thali with diya, kumkum, akshat, and flowers. All women sit in a circle around the Gaur Mata image. The eldest or most experienced woman leads the puja.',
        hi: 'शाम को (चन्द्रोदय से पहले) अन्य विवाहित महिलाओं के साथ एकत्रित हों। गौर माता (पार्वती) की मूर्ति स्थापित करें। दीपक, कुमकुम, अक्षत और फूलों के साथ आरती की थाली सजाएँ। सभी महिलाएँ गौर माता की मूर्ति के चारों ओर गोलाकार बैठें। सबसे बड़ी या अनुभवी महिला पूजा का नेतृत्व करें।',
        sa: 'सायंकाले (चन्द्रोदयात् प्राक्) अन्याभिः विवाहिताभिः स्त्रीभिः सह मिलेत्। गौरीमातुः (पार्वत्याः) मूर्तिं स्थापयेत्। दीपकुङ्कुमाक्षतपुष्पैः आरात्रिकपात्रं सज्जयेत्। सर्वाः स्त्रियः गौरीमातुः मूर्तिं परितः वृत्ताकारम् उपविशेयुः। ज्येष्ठा अनुभवशालिनी वा स्त्री पूजां नयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Karva Chauth Katha', hi: 'करवा चौथ कथा', sa: 'करवाचौथकथा' },
      description: {
        en: 'Listen to the Karva Chauth Katha — the story of Queen Veervati who accidentally broke her Karva Chauth fast and her husband died, but through her devotion and penance, she pleased Yama and restored her husband\'s life. While the katha is being read, pass the aarti thali from one woman to the next in the circle. Each woman rotates it 7 times before passing it on.',
        hi: 'करवा चौथ कथा सुनें — रानी वीरवती की कहानी जिसने गलती से करवा चौथ का व्रत तोड़ दिया और उसके पति की मृत्यु हो गई, किन्तु अपनी भक्ति और तपस्या से उसने यमराज को प्रसन्न किया और पति को जीवित किया। कथा पढ़ते समय आरती की थाली एक महिला से दूसरी को गोलाकार में दें। प्रत्येक महिला इसे 7 बार घुमाकर आगे दें।',
        sa: 'करवाचौथकथां शृणुयात् — वीरवतीराज्ञ्याः कथा या भ्रमेण करवाचौथव्रतं भङ्क्त्वा पतिमरणम् अनुभवति, किन्तु स्वभक्त्या तपसा च यमं प्रसाद्य पतिं पुनर्जीवयति। कथापठनकाले आरात्रिकपात्रं एकस्याः स्त्रियाः अपरां प्रति वृत्ते प्रसारयेत्। प्रत्येका स्त्री सप्तवारं भ्रामयित्वा प्रसारयेत्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 5,
      title: { en: 'Wait for Moonrise', hi: 'चन्द्रोदय की प्रतीक्षा', sa: 'चन्द्रोदयप्रतीक्षा' },
      description: {
        en: 'After the katha and puja, wait patiently for the moon to rise. The moonrise time on Karva Chauth typically falls between 8 PM and 10 PM depending on location and year. Keep the karva filled with water, the sieve, and the aarti thali ready. The husband should also be present and dressed well.',
        hi: 'कथा और पूजा के बाद धैर्यपूर्वक चन्द्रोदय की प्रतीक्षा करें। करवा चौथ पर चन्द्रोदय का समय स्थान और वर्ष के अनुसार प्रायः रात 8 से 10 बजे के बीच होता है। करवा जल से भरा, छलनी और आरती की थाली तैयार रखें। पति भी उपस्थित और सुसज्जित हों।',
        sa: 'कथापूजानन्तरं धैर्येण चन्द्रोदयं प्रतीक्षेत्। करवाचौथे चन्द्रोदयकालः स्थानवर्षानुसारं प्रायः रात्रौ अष्टमवादनात् दशमवादनपर्यन्तं भवति। करवां जलपूर्णां, चालनीं, आरात्रिकपात्रं च सज्जं रक्षेत्। पतिः अपि उपस्थितः सुसज्जः च स्यात्।',
      },
      duration: 'Variable',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 6,
      title: { en: 'Sight Moon Through Sieve', hi: 'छलनी से चन्द्र दर्शन', sa: 'चालन्या चन्द्रदर्शनम्' },
      description: {
        en: 'When the moon appears, take the sieve (chalni) and look at the moon through it. This filters the moonlight through a screen, symbolizing that the wife sees the world through her devotion. Hold the diya on the aarti thali behind the sieve so the moon is framed by its light.',
        hi: 'जब चन्द्रमा दिखे, छलनी लेकर उसके आर-पार चन्द्रमा को देखें। यह चन्द्र प्रकाश को छानता है, यह प्रतीक है कि पत्नी संसार को अपनी भक्ति से देखती है। छलनी के पीछे आरती की थाली पर दीपक रखें ताकि चन्द्रमा उसकी ज्योति से घिरा दिखे।',
        sa: 'यदा चन्द्रः दृश्यते, चालनीं गृहीत्वा तस्याः आर-पारं चन्द्रं पश्येत्। एतत् चन्द्रप्रकाशं चालयति, प्रतीकं यत् पत्नी संसारं स्वभक्त्या पश्यति। चालन्याः पृष्ठतः आरात्रिकपात्रे दीपं स्थापयेत् यथा चन्द्रः तज्ज्योतिषा परिवेष्टितः दृश्यते।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'See Husband\'s Face Through Sieve', hi: 'छलनी से पति का मुख दर्शन', sa: 'चालन्या पतिमुखदर्शनम्' },
      description: {
        en: 'Immediately after sighting the moon through the sieve, turn the sieve toward your husband and look at his face through it. This is the most emotionally significant moment of Karva Chauth — the wife sees her husband\'s face framed by the sieve, blessing him with long life. The husband should stand facing the wife with a gentle smile.',
        hi: 'छलनी से चन्द्रमा देखने के तुरन्त बाद, छलनी अपने पति की ओर मोड़ें और उसके आर-पार पति का मुख देखें। यह करवा चौथ का सबसे भावुक क्षण है — पत्नी छलनी से पति का मुख देखती है, दीर्घायु का आशीर्वाद देती है। पति मुस्कराते हुए पत्नी के सामने खड़े हों।',
        sa: 'चालन्या चन्द्रदर्शनानन्तरं तत्क्षणं चालनीं पत्युः दिशि परिवर्तयेत् तस्याः आर-पारं पतिमुखं पश्येत्। एतत् करवाचौथस्य सर्वभावुकतमः क्षणः — पत्नी चालन्या पतिमुखं दृष्ट्वा दीर्घायुषम् आशिषति। पतिः सस्मितं पत्न्याः पुरतः तिष्ठेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Husband Offers Water — Fast Breaking', hi: 'पति जल अर्पित करें — उपवास समाप्ति', sa: 'पतिः जलम् अर्पयति — व्रतभङ्गनम्' },
      description: {
        en: 'The husband takes water from the karva and offers it to the wife to drink — this officially breaks the nirjala fast. He then offers her the first bite of food (sweet or fruit). This act symbolizes the husband\'s care and gratitude for her sacrifice. After this, the wife can eat a full meal. Offer arghya (water) from the karva to the moon as thanksgiving.',
        hi: 'पति करवे से जल लेकर पत्नी को पिलाएँ — इससे विधिवत् निर्जला उपवास समाप्त होता है। फिर पत्नी को पहला निवाला (मिठाई या फल) खिलाएँ। यह क्रिया पति की देखभाल और पत्नी के त्याग के प्रति कृतज्ञता का प्रतीक है। इसके बाद पत्नी पूर्ण भोजन कर सकती हैं। धन्यवाद स्वरूप करवे से चन्द्रमा को अर्घ्य (जल) अर्पित करें।',
        sa: 'पतिः करवातः जलं गृहीत्वा पत्न्यै पातुं ददाति — एतेन विधिवत् निर्जलव्रतं भज्यते। ततः पत्न्यै प्रथमं ग्रासं (मिष्टान्नं फलं वा) ददाति। एषा क्रिया पत्युः परिचर्यां पत्न्याः त्यागाय कृतज्ञतां च प्रतीकयति। अनन्तरं पत्नी पूर्णभोजनं कर्तुं शक्नोति। धन्यवादरूपेण करवातः चन्द्राय अर्घ्यं (जलम्) अर्पयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'karva-chauth-prayer',
      name: { en: 'Karva Chauth Vrat Mantra', hi: 'करवा चौथ व्रत मन्त्र', sa: 'करवाचौथव्रतमन्त्रः' },
      devanagari: 'करवा चौथ का व्रत मैं करती हूँ, सुहाग मेरा अमर रहे।\nईश्वर से यही माँगती हूँ, मेरे पति की उम्र लम्बी हो।',
      iast: 'karavā cautha kā vrata maĩ karatī hū̃, suhāga merā amara rahe |\nīśvara se yahī māṅgatī hū̃, mere pati kī umra lambī ho |',
      meaning: {
        en: 'I observe the Karva Chauth fast, may my marital bond be eternal. I pray to God that my husband\'s life be long.',
        hi: 'मैं करवा चौथ का व्रत रखती हूँ, मेरा सुहाग अमर रहे। ईश्वर से यही प्रार्थना है कि मेरे पति दीर्घायु हों।',
        sa: 'करवाचौथव्रतम् आचरामि, मम सौभाग्यम् अमरं भवतु। ईश्वरात् इदमेव याचे, मम पत्युः आयुः दीर्घं भवतु।',
      },
      usage: {
        en: 'Recite during the evening puja while passing the aarti thali. All women recite together in unison.',
        hi: 'सायं पूजा में आरती की थाली घुमाते समय पढ़ें। सभी महिलाएँ एक साथ मिलकर बोलें।',
        sa: 'सायंपूजायाम् आरात्रिकपात्रं भ्रामयन्त्यः पठेयुः। सर्वाः स्त्रियः एकत्र मिलित्वा वदेयुः।',
      },
    },
    {
      id: 'gauri-shankar-prayer',
      name: { en: 'Gauri-Shankar Prayer', hi: 'गौरी-शंकर प्रार्थना', sa: 'गौरीशङ्करप्रार्थना' },
      devanagari: 'ॐ गौर्यै नमः। ॐ शङ्कराय नमः।\nनमः पार्वतीपतये हर हर महादेव।',
      iast: 'oṃ gauryai namaḥ | oṃ śaṅkarāya namaḥ |\nnamaḥ pārvatīpataye hara hara mahādeva |',
      meaning: {
        en: 'Om, salutations to Goddess Gauri. Om, salutations to Lord Shankar. Salutations to the husband of Parvati, Hara Hara Mahadeva.',
        hi: 'ॐ, देवी गौरी को नमन। ॐ, भगवान शंकर को नमन। पार्वतीपति को नमन, हर हर महादेव।',
        sa: 'ॐ, गौर्यै नमः। ॐ, शङ्कराय नमः। पार्वतीपतये नमः, हर हर महादेव।',
      },
      usage: {
        en: 'Chant while worshipping the Gaur Mata (Parvati) idol during the evening puja. Shiva-Parvati represent the ideal married couple.',
        hi: 'सायं पूजा में गौर माता (पार्वती) की मूर्ति की पूजा करते समय जपें। शिव-पार्वती आदर्श दम्पति का प्रतीक हैं।',
        sa: 'सायंपूजायां गौरीमातुः (पार्वत्याः) मूर्तिपूजनकाले जपेत्। शिवपार्वती आदर्शदम्पत्योः प्रतीकम्।',
      },
    },
    {
      id: 'chandra-arghya',
      name: { en: 'Chandra Arghya Mantra (Moon Offering)', hi: 'चन्द्र अर्घ्य मन्त्र', sa: 'चन्द्रार्घ्यमन्त्रः' },
      devanagari: 'ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि। तन्नो चन्द्रः प्रचोदयात्॥',
      iast: 'oṃ kṣīraputrāya vidmahe amṛtatattvāya dhīmahi | tanno candraḥ pracodayāt ||',
      meaning: {
        en: 'Om, we meditate upon the son of the milky ocean (Chandra), we contemplate the essence of immortality. May the Moon inspire and illuminate us.',
        hi: 'ॐ, हम क्षीरसागर के पुत्र (चन्द्र) का ध्यान करते हैं, अमृत तत्व का चिन्तन करते हैं। चन्द्रमा हमें प्रेरित और प्रकाशित करें।',
        sa: 'ॐ, क्षीरसागरपुत्रं (चन्द्रं) विद्मः, अमृततत्त्वं ध्यायामः। चन्द्रः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Chant while offering arghya (water) from the karva to the moon at the time of sighting. This is the Chandra Gayatri mantra.',
        hi: 'चन्द्र दर्शन के समय करवे से चन्द्रमा को अर्घ्य (जल) अर्पित करते हुए जपें। यह चन्द्र गायत्री मन्त्र है।',
        sa: 'चन्द्रदर्शनकाले करवातः चन्द्राय अर्घ्यं (जलम्) अर्पयन्ती जपेत्। एषः चन्द्रगायत्रीमन्त्रः।',
      },
    },
  ],

  aarti: {
    name: { en: 'Karva Chauth Aarti', hi: 'करवा चौथ आरती', sa: 'करवाचौथारात्रिकम्' },
    devanagari: `करवा चौथ की आरती, सब मिल कर गाओ।
शिव गौरा की जोड़ी को, भोग सभी लगाओ॥
करवा चौथ की आरती॥

ज्यों गौरा ने शिव को पाया, कठोर तप करके।
सब नारी को सुहाग मिले, यह व्रत रख करके॥
करवा चौथ की आरती॥

आओ सब मिलकर करें, करवा चौथ की पूजा।
पति की लम्बी उम्र हो, और न कोई दूजा॥
करवा चौथ की आरती॥`,
    iast: `karavā cautha kī āratī, saba mila kara gāo |
śiva gaurā kī joḍī ko, bhoga sabhī lagāo ||
karavā cautha kī āratī ||

jyõ gaurā ne śiva ko pāyā, kaṭhora tapa karake |
saba nārī ko suhāga mile, yaha vrata rakha karake ||
karavā cautha kī āratī ||

āo saba milakara karẽ, karavā cautha kī pūjā |
pati kī lambī umra ho, aura na koī dūjā ||
karavā cautha kī āratī ||`,
  },

  naivedya: {
    en: 'Offer sweets (laddoo, mathri, gujiya), fruits, and milk to Gaur Mata. After breaking the fast, the traditional Karva Chauth dinner includes rich foods — puri, halwa, dal, and special sweets prepared by the mother-in-law.',
    hi: 'गौर माता को मिठाई (लड्डू, मठरी, गुझिया), फल और दूध अर्पित करें। उपवास तोड़ने के बाद पारम्परिक करवा चौथ का भोजन समृद्ध होता है — पूरी, हलवा, दाल, और सास द्वारा बनाई गई विशेष मिठाइयाँ।',
    sa: 'गौरीमात्रे मिष्टान्नानि (लड्डुकम्, मठरी, गुझिया), फलानि, क्षीरं च अर्पयेत्। व्रतभङ्गनानन्तरं पारम्परिकं करवाचौथभोजनं समृद्धम् — पूरी, पाकः, दालम्, श्वश्र्वा निर्मितानि विशेषमिष्टान्नानि।',
  },

  precautions: [
    {
      en: 'STRICTLY nirjala — not even a single drop of water is permitted from sunrise to moonrise. This is a non-negotiable rule of Karva Chauth.',
      hi: 'पूर्णतः निर्जला — सूर्योदय से चन्द्रोदय तक एक बूँद जल भी नहीं लेना। यह करवा चौथ का अटल नियम है।',
      sa: 'सम्पूर्णं निर्जलम् — सूर्योदयात् चन्द्रोदयपर्यन्तं जलस्य एकम् अपि बिन्दुं न स्वीकरणीयम्। एषः करवाचौथस्य अटलः नियमः।',
    },
    {
      en: 'MUST sight the moon through the sieve (chalni) before breaking the fast. If the moon is hidden by clouds, wait until it becomes visible. Do not break fast based on moonrise time alone.',
      hi: 'उपवास तोड़ने से पहले छलनी से चन्द्रमा के दर्शन अनिवार्य हैं। यदि बादलों से चन्द्रमा छिपा हो, तो दिखने तक प्रतीक्षा करें। केवल चन्द्रोदय के समय के आधार पर उपवास न तोड़ें।',
      sa: 'व्रतभङ्गनात् प्राक् चालन्या चन्द्रदर्शनम् अनिवार्यम्। यदि मेघैः चन्द्रः आवृतः, दृश्यं यावत् प्रतीक्षेत्। केवलं चन्द्रोदयकालेन व्रतं न भञ्जयेत्।',
    },
    {
      en: 'MUST see husband\'s face through the sieve after seeing the moon. The sequence is: moon through sieve, then husband through sieve, then husband gives water.',
      hi: 'चन्द्रमा देखने के बाद छलनी से पति का मुख अवश्य देखें। क्रम है: छलनी से चन्द्रमा, फिर छलनी से पति का मुख, फिर पति जल दें।',
      sa: 'चन्द्रदर्शनानन्तरं चालन्या पतिमुखं अवश्यं पश्येत्। क्रमः: चालन्या चन्द्रम्, ततः चालन्या पतिमुखम्, ततः पतिः जलं ददाति।',
    },
    {
      en: 'This vrat is only for married women whose husbands are alive. Unmarried women and widows do not observe this vrat. Some regions allow unmarried women to observe it for their future husbands.',
      hi: 'यह व्रत केवल उन विवाहित महिलाओं के लिए है जिनके पति जीवित हैं। अविवाहित और विधवा महिलाएँ यह व्रत नहीं रखतीं। कुछ क्षेत्रों में अविवाहित महिलाएँ अपने भावी पति के लिए रख सकती हैं।',
      sa: 'इदं व्रतं केवलं विवाहिताभिः स्त्रीभिः यासां पतयः जीवन्ति ताभिरेव कर्तव्यम्। अविवाहिताः विधवाः च इदं व्रतं न कुर्वन्ति। केषुचित् प्रदेशेषु अविवाहिताः भावीपत्यर्थम् आचरन्ति।',
    },
  ],

  parana: {
    type: 'moonrise' as const,
    description: {
      en: 'Break fast after sighting moon through sieve, then husband\'s face',
      hi: 'छलनी से चन्द्रमा देखने के बाद, फिर पति का चेहरा देखकर व्रत खोलें',
      sa: 'चालन्या चन्द्रं दृष्ट्वा ततः पतिमुखं विलोक्य व्रतं भञ्जेत्',
    },
  },

  phala: {
    en: 'Karva Chauth vrat grants the husband a long and healthy life, strengthens the marital bond, and brings good fortune to the household. The Brahma Vaivarta Purana states that Parvati herself observed this vrat for Shiva, and women who observe it with devotion receive the blessings of Gauri and the longevity of their husbands like that of Shiva — eternal.',
    hi: 'करवा चौथ व्रत पति को दीर्घ और स्वस्थ जीवन प्रदान करता है, वैवाहिक बन्धन को मज़बूत करता है, और घर में सौभाग्य लाता है। ब्रह्मवैवर्त पुराण के अनुसार स्वयं पार्वती ने शिव के लिए यह व्रत रखा था, और जो महिलाएँ भक्तिपूर्वक इसे करती हैं उन्हें गौरी का आशीर्वाद और शिव जैसी — शाश्वत — पति की दीर्घायु प्राप्त होती है।',
    sa: 'करवाचौथव्रतं पतये दीर्घं स्वस्थं जीवनं ददाति, वैवाहिकबन्धनं दृढयति, गृहे सौभाग्यं च आनयति। ब्रह्मवैवर्तपुराणे उक्तं स्वयं पार्वती शिवार्थम् इदं व्रतम् आचरत्, भक्त्या आचरन्त्यः स्त्रियः गौर्याः आशीर्वादं शिववत् — शाश्वतां — पतिदीर्घायुषं च प्राप्नुवन्ति।',
  },
};
