import type { PujaVidhi } from './types';

export const AHOI_ASHTAMI_PUJA: PujaVidhi = {
  festivalSlug: 'ahoi-ashtami',
  category: 'vrat',
  deity: { en: 'Ahoi Mata', hi: 'अहोई माता', sa: 'अहोईमाता' },

  samagri: [
    { name: { en: 'Ahoi image (wall painting or printed image)', hi: 'अहोई चित्र (दीवार पर चित्रकारी या मुद्रित चित्र)', sa: 'अहोईचित्रम् (भित्तिचित्रं मुद्रितचित्रं वा)' }, essential: true, note: { en: 'Draw or paste an image of Ahoi Mata (a mother goddess with her children) and a porcupine (syahi) on the wall', hi: 'दीवार पर अहोई माता (माँ देवी अपने बच्चों सहित) और साही (स्याही) का चित्र बनाएँ या चिपकाएँ', sa: 'भित्तौ अहोईमातुः (मातृदेव्याः सबालकायाः) शल्यकस्य (स्याहेः) च चित्रं रचयेत् योजयेत् वा' } },
    { name: { en: 'Water pot (kalash)', hi: 'जल कलश', sa: 'जलकलशः' }, essential: true },
    { name: { en: 'Star-watching thread (taga/dhaga)', hi: 'तारा देखने का धागा (तागा)', sa: 'ताराणां दर्शनार्थं सूत्रम्' }, essential: true, note: { en: 'A thread with which to perform the star-sighting ritual in the evening', hi: 'सायंकाल तारा दर्शन अनुष्ठान के लिए धागा', sa: 'सायं ताराणां दर्शनानुष्ठानार्थं सूत्रम्' } },
    { name: { en: 'Rice (akshat)', hi: 'अक्षत (चावल)', sa: 'अक्षताः' }, category: 'puja_items' },
    { name: { en: 'Turmeric and kumkum', hi: 'हल्दी और कुमकुम', sa: 'हरिद्रा कुङ्कुमं च' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items' },
    { name: { en: 'Puri and halwa (for naivedya)', hi: 'पूरी और हलवा (नैवेद्य के लिए)', sa: 'पूरिका हल्वा च (नैवेद्यार्थम्)' }, category: 'food' },
    { name: { en: 'Fruits', hi: 'फल', sa: 'फलानि' }, category: 'food' },
    { name: { en: 'Coins (for offering)', hi: 'सिक्के (अर्पण के लिए)', sa: 'नाणकानि (अर्पणार्थम्)' }, category: 'other' },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Ahoi Ashtami falls on Kartik Krishna Ashtami (8th day of waning moon in Kartik month), four days before Diwali. The puja is performed in the evening during Pradosh Kaal. The fast is broken after star sighting in the evening (not moonrise).',
    hi: 'अहोई अष्टमी कार्तिक कृष्ण अष्टमी (कार्तिक माह में घटते चन्द्रमा का 8वाँ दिन) को, दीवाली से चार दिन पहले पड़ती है। पूजा सायंकाल प्रदोष काल में होती है। व्रत सायंकाल तारा दर्शन (चन्द्रोदय नहीं) के बाद तोड़ा जाता है।',
    sa: 'अहोईअष्टमी कार्तिककृष्णाष्टम्यां (कार्तिकमासे अपक्षयचन्द्रस्य अष्टमे दिने) दीपावल्याः चतुर्दिनं प्राक् भवति। पूजा सायं प्रदोषकाले क्रियते। सायं ताराणां दर्शनानन्तरम् (न चन्द्रोदये) व्रतं भङ्गयते।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this sacred Kartik Krishna Ashtami, I undertake the Ahoi Ashtami vrat and worship of Ahoi Mata for the long life, health, and well-being of my children.',
    hi: 'इस पवित्र कार्तिक कृष्ण अष्टमी पर, अपने बच्चों की दीर्घायु, स्वास्थ्य और कल्याण के लिए, मैं अहोई माता की पूजा और अहोई अष्टमी व्रत का संकल्प करती हूँ।',
    sa: 'अस्यां पवित्रायां कार्तिककृष्णाष्टम्यां स्वसन्तानानां दीर्घायुः स्वास्थ्यकल्याणार्थं च अहोईमातुः पूजनम् अहोईअष्टमीव्रतं च अहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Morning — Fast Begins', hi: 'प्रातः — व्रत आरम्भ', sa: 'प्रातः — व्रतारम्भः' },
      description: {
        en: 'Wake before sunrise and take a purifying bath. The fast begins at sunrise. Resolve to observe the Ahoi Ashtami vrat for your children\'s welfare. Only water is permitted during the day.',
        hi: 'सूर्योदय से पहले उठें और शुद्धि स्नान करें। व्रत सूर्योदय से शुरू होता है। अपने बच्चों के कल्याण के लिए अहोई अष्टमी व्रत का संकल्प लें। दिन में केवल जल पीने की अनुमति है।',
        sa: 'सूर्योदयात् प्राक् उत्तिष्ठेत् शुद्धिस्नानं कुर्यात्। व्रतं सूर्योदयात् आरभते। सन्तानानां कल्याणार्थम् अहोईअष्टमीव्रतसङ्कल्पं कुर्यात्। दिवा केवलं जलं पातुं शक्यते।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '15 min',
    },
    {
      step: 2,
      title: { en: 'Drawing/Setting Up the Ahoi Image', hi: 'अहोई चित्र बनाना/लगाना', sa: 'अहोईचित्ररचनम्/स्थापनम्' },
      description: {
        en: 'Draw or paste the image of Ahoi Mata on the wall, facing north or east. The image typically shows Ahoi Mata surrounded by her seven sons and a porcupine (syahi). Apply kumkum and haldi dots around the image.',
        hi: 'दीवार पर उत्तर या पूर्व दिशा में अहोई माता का चित्र बनाएँ या चिपकाएँ। चित्र में प्रायः अहोई माता अपने सात पुत्रों और एक साही (स्याही) से घिरी होती हैं। चित्र के चारों ओर कुमकुम और हल्दी की बिन्दियाँ लगाएँ।',
        sa: 'भित्तौ उत्तरं पूर्वं वा अभिमुखम् अहोईमातुः चित्रं रचयेत् योजयेत् वा। चित्रे प्रायः अहोईमाता सप्तपुत्रैः शल्यकेन (स्याहिना) च परिवृता। चित्रं परितः कुङ्कुमहरिद्राबिन्दून् योजयेत्।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '15 min',
    },
    {
      step: 3,
      title: { en: 'Evening — Sankalpa & Puja', hi: 'सायं — संकल्प एवं पूजा', sa: 'सायम् — सङ्कल्पः पूजा च' },
      description: {
        en: 'In the evening (Pradosh Kaal), take a fresh bath. Sit before the Ahoi image on the wall. Light a ghee diya and incense. Place the water pot before the image. Take the formal sankalpa for the vrat.',
        hi: 'सायंकाल (प्रदोष काल) में पुनः स्नान करें। दीवार पर बने अहोई चित्र के सामने बैठें। घी का दीपक और अगरबत्ती जलाएँ। चित्र के सामने जल कलश रखें। व्रत के लिए विधिवत् संकल्प लें।',
        sa: 'सायं (प्रदोषकाले) पुनः स्नानं कुर्यात्। भित्तौ अहोईचित्रस्य पुरतः उपविशेत्। घृतदीपं धूपं च प्रज्वालयेत्। चित्रस्य पुरतः जलकलशं स्थापयेत्। व्रतार्थं सङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
      duration: '10 min',
    },
    {
      step: 4,
      title: { en: 'Ahoi Mata Worship', hi: 'अहोई माता पूजन', sa: 'अहोईमातृपूजनम्' },
      description: {
        en: 'Offer kumkum, turmeric, akshat, and flowers to the Ahoi image. Tie the star-watching thread (taga) near the image. Offer coins and fruits. Sprinkle water from the kalash on the image.',
        hi: 'अहोई चित्र पर कुमकुम, हल्दी, अक्षत और फूल अर्पित करें। तारा देखने का धागा (तागा) चित्र के पास बाँधें। सिक्के और फल अर्पित करें। कलश से जल छिड़कें।',
        sa: 'अहोईचित्रे कुङ्कुमं हरिद्रां अक्षतान् पुष्पाणि च अर्पयेत्। ताराणां दर्शनसूत्रं चित्रसमीपे बध्नीयात्। नाणकानि फलानि च अर्पयेत्। कलशात् जलं चित्रे सिञ्चेत्।',
      },
      essential: true,
      stepType: 'offering',
      duration: '15 min',
    },
    {
      step: 5,
      title: { en: 'Ahoi Katha', hi: 'अहोई कथा', sa: 'अहोईकथा' },
      description: {
        en: 'Read or listen to the Ahoi Ashtami Vrat Katha. The story tells of a woman who accidentally killed a porcupine\'s baby while digging clay, after which her seven sons died. Through sincere penance and worship of Ahoi Mata, her sons were restored to life.',
        hi: 'अहोई अष्टमी व्रत कथा पढ़ें या सुनें। कथा बताती है कि एक स्त्री ने मिट्टी खोदते समय गलती से साही के बच्चे को मार दिया, जिसके बाद उसके सात पुत्र मर गए। अहोई माता की सच्ची तपस्या और पूजा से उसके पुत्र पुनर्जीवित हो गए।',
        sa: 'अहोईअष्टमीव्रतकथां पठेत् श्रृणुयात् वा। कथायां एका स्त्री मृत्तिकां खनन्ती प्रमादात् शल्यकशिशुं हतवती, ततः तस्याः सप्तपुत्राः मृताः। अहोईमातुः सच्चतपःपूजनेन तस्याः पुत्राः पुनर्जीविताः।',
      },
      essential: true,
      stepType: 'meditation',
      duration: '15 min',
    },
    {
      step: 6,
      title: { en: 'Ahoi Mata Mantra', hi: 'अहोई माता मन्त्र', sa: 'अहोईमातृमन्त्रः' },
      description: {
        en: 'Chant the Ahoi Mata mantra while praying for the welfare, long life, and prosperity of your children. Offer akshat to the image with each chant.',
        hi: 'अपने बच्चों के कल्याण, दीर्घायु और समृद्धि की प्रार्थना करते हुए अहोई माता मन्त्र जपें। प्रत्येक जप के साथ चित्र पर अक्षत अर्पित करें।',
        sa: 'सन्तानानां कल्याणदीर्घायुसमृद्ध्यर्थं प्रार्थयमाना अहोईमातृमन्त्रं जपेत्। प्रतिजपे चित्रे अक्षतान् अर्पयेत्।',
      },
      mantraRef: 'ahoi-mata-mantra',
      essential: true,
      stepType: 'mantra',
      duration: '15 min',
    },
    {
      step: 7,
      title: { en: 'Star Sighting & Parana', hi: 'तारा दर्शन एवं पारण', sa: 'ताराणां दर्शनं पारणं च' },
      description: {
        en: 'After the puja, go outdoors and look at the sky. Sight the stars through the thread (taga). Once stars are visible, pour water from the kalash while looking at the stars. Break the fast by first drinking water, then eating puri-halwa prasad. Some traditions wait for moonrise instead of stars.',
        hi: 'पूजा के बाद बाहर जाएँ और आकाश देखें। धागे (तागे) से तारे देखें। तारे दिखने पर तारों को देखते हुए कलश से जल ढालें। पहले जल पीकर, फिर पूरी-हलवा प्रसाद खाकर व्रत तोड़ें। कुछ परम्पराओं में तारों के बजाय चन्द्रोदय की प्रतीक्षा करते हैं।',
        sa: 'पूजानन्तरं बहिर्गत्वा आकाशं पश्येत्। सूत्रेण (तागेन) ताराणि दृश्येत्। ताराणि दृश्यानि चेत् ताराणि पश्यन् कलशात् जलं सिञ्चेत्। प्रथमं जलं पीत्वा ततः पूरिकाहल्वाप्रसादं भक्षयित्वा व्रतं भङ्गयेत्। कासुचित् परम्परासु ताराणां स्थाने चन्द्रोदयं प्रतीक्षन्ते।',
      },
      essential: true,
      stepType: 'conclusion',
      duration: '15 min',
    },
  ],

  mantras: [
    {
      id: 'ahoi-mata-mantra',
      name: { en: 'Ahoi Mata Mantra', hi: 'अहोई माता मन्त्र', sa: 'अहोईमातृमन्त्रः' },
      devanagari: 'ॐ अहोई माता तू सबकी माता, सब सन्तान को सुखदाता। पूत-पौत्र बढ़ाय दे, मैया अहोई माता॥',
      iast: 'oṃ ahoi mātā tū sabakī mātā, saba santāna ko sukhadātā | pūta-pautra baḍhāya de, maiyā ahoi mātā ||',
      meaning: {
        en: 'Om, Ahoi Mata, you are the mother of all, the giver of happiness to all children. Increase my sons and grandsons, O Mother Ahoi Mata.',
        hi: 'ॐ, अहोई माता, तू सबकी माता, सब सन्तान को सुख देने वाली। पुत्र-पौत्र बढ़ा दे, मैया अहोई माता।',
        sa: 'ॐ, अहोईमातः, त्वं सर्वेषां माता, सर्वसन्तानसुखदात्री। पुत्रपौत्रान् वर्धय, हे मातः अहोईमातः।',
      },
      japaCount: 21,
      usage: {
        en: 'Chant 21 times during the evening puja while offering akshat to the Ahoi image. This is the central prayer of the vrat.',
        hi: 'सायं पूजा के दौरान अहोई चित्र पर अक्षत अर्पित करते हुए 21 बार जपें। यह व्रत की केन्द्रीय प्रार्थना है।',
        sa: 'सायंपूजायां अहोईचित्रे अक्षतान् अर्पयन् २१ वारं जपेत्। एषा व्रतस्य केन्द्रीया प्रार्थना।',
      },
    },
  ],

  naivedya: {
    en: 'Offer puri, halwa, and seasonal fruits. Some traditions also offer kheer and chana. The prasad is consumed by the mother after breaking the fast, and shared with the children.',
    hi: 'पूरी, हलवा और मौसमी फल अर्पित करें। कुछ परम्पराओं में खीर और चना भी अर्पित करते हैं। व्रत तोड़ने के बाद माँ प्रसाद खाती हैं और बच्चों में बाँटती हैं।',
    sa: 'पूरिकां हल्वां ऋतुफलानि च अर्पयेत्। कासुचित् परम्परासु क्षीरान्नं चणकान् अपि अर्पयन्ति। व्रतभङ्गनानन्तरं माता प्रसादं भक्षयति सन्तानेभ्यश्च वितरति।',
  },

  precautions: [
    {
      en: 'This vrat is observed only by mothers — for the welfare of their children. Childless women may observe it for the blessing of progeny.',
      hi: 'यह व्रत केवल माताएँ रखती हैं — अपने बच्चों के कल्याण के लिए। नि:सन्तान स्त्रियाँ सन्तान प्राप्ति के लिए रख सकती हैं।',
      sa: 'एतद्व्रतं केवलं मातृभिः पाल्यते — सन्तानकल्याणार्थम्। अपुत्राः सन्तानप्राप्त्यर्थं पालयितुम् अर्हन्ति।',
    },
    {
      en: 'Do not eat anything containing iron (from iron utensils) on this day, as iron is associated with weapons that harm.',
      hi: 'इस दिन लोहे (लोहे के बर्तनों) से बनी कोई वस्तु न खाएँ, क्योंकि लोहा हानिकारक हथियारों से जुड़ा है।',
      sa: 'अस्मिन् दिने लोहपात्रजं किमपि न भक्षयेत्, यतो लौहम् हिंसकशस्त्रैः सम्बद्धम्।',
    },
    {
      en: 'Do not do any digging or excavation work on this day — the katha warns against harming creatures living underground.',
      hi: 'इस दिन खुदाई या उत्खनन का कोई कार्य न करें — कथा भूमिगत जीवों को हानि पहुँचाने से चेतावनी देती है।',
      sa: 'अस्मिन् दिने खननं उत्खननं वा न कुर्यात् — कथा भूमिगतप्राणिहिंसातः सावधानयति।',
    },
  ],

  phala: {
    en: 'Ahoi Ashtami vrat ensures the long life, good health, and prosperity of one\'s children and grandchildren. The Bhavishya Purana states that a mother who observes this vrat with devotion will never face the grief of losing a child. Her progeny will flourish through generations.',
    hi: 'अहोई अष्टमी व्रत सन्तान और पौत्रों की दीर्घायु, अच्छे स्वास्थ्य और समृद्धि सुनिश्चित करता है। भविष्य पुराण के अनुसार जो माता भक्तिपूर्वक यह व्रत रखती है उसे कभी सन्तान खोने का दुःख नहीं सहना पड़ता। उसकी सन्तान पीढ़ी-दर-पीढ़ी पलती-बढ़ती है।',
    sa: 'अहोईअष्टमीव्रतं सन्तानानां पौत्राणां च दीर्घायुः सुस्वास्थ्यं समृद्धिं च सुनिश्चितं करोति। भविष्यपुराणे उक्तं या माता भक्त्या एतद्व्रतं पालयति सा कदापि सन्तानवियोगदुःखं न सम्मुखीकरोति। तस्याः सन्ततिः पीढीषु प्रवर्धते।',
  },

  parana: {
    type: 'moonrise',
    description: {
      en: 'Break fast after star sighting in the evening',
      hi: 'सायं तारा दर्शन के बाद पारण',
      sa: 'सायं ताराणां दर्शनानन्तरं पारणम्',
    },
  },
};
