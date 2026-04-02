import type { PujaVidhi } from './types';

export const EKADASHI_PUJA: PujaVidhi = {
  festivalSlug: 'ekadashi',
  category: 'vrat',
  deity: { en: 'Lord Vishnu', hi: 'भगवान विष्णु', sa: 'श्रीविष्णुः' },

  samagri: [
    { name: { en: 'Vishnu idol or image', hi: 'विष्णु मूर्ति या चित्र', sa: 'विष्णुमूर्तिः अथवा चित्रम्' } },
    { name: { en: 'Tulsi leaves (holy basil)', hi: 'तुलसी के पत्ते', sa: 'तुलसीपत्राणि' }, note: { en: 'Essential — Vishnu is not worshipped without Tulsi', hi: 'अनिवार्य — तुलसी के बिना विष्णु पूजा अधूरी है', sa: 'अनिवार्यम् — तुलसीं विना विष्णुपूजा न सम्पूर्णा' } },
    { name: { en: 'Yellow flowers (marigold preferred)', hi: 'पीले फूल (गेंदे के फूल)', sa: 'पीतपुष्पाणि (स्थालपद्मानि)' } },
    { name: { en: 'Fruits (banana, pomegranate)', hi: 'फल (केला, अनार)', sa: 'फलानि (कदलीफलम्, दाडिमम्)' } },
    { name: { en: 'Panchamrit (milk, curd, ghee, honey, sugar)', hi: 'पंचामृत (दूध, दही, घी, शहद, शक्कर)', sa: 'पञ्चामृतम् (क्षीरं, दधि, घृतं, मधु, शर्करा)' } },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' } },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' } },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' } },
    { name: { en: 'Water (for abhishek and achamana)', hi: 'जल (अभिषेक और आचमन के लिए)', sa: 'जलम् (अभिषेकाचमनार्थम्)' } },
    { name: { en: 'Akshat (unbroken rice — for sankalpa only, NOT for offering)', hi: 'अक्षत (साबुत चावल — केवल संकल्प हेतु, भोग नहीं)', sa: 'अक्षताः (सङ्कल्पार्थमेव, न नैवेद्यम्)' } },
    { name: { en: 'Sandalwood paste (chandan)', hi: 'चन्दन का लेप', sa: 'चन्दनम्' } },
    { name: { en: 'Yellow cloth', hi: 'पीला कपड़ा', sa: 'पीतवस्त्रम्' } },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Ekadashi vrat begins from Dashami sunset and ends on Dwadashi after parana (fast-breaking). Puja is ideally performed in the Brahma Muhurta or morning hours on Ekadashi tithi.',
    hi: 'एकादशी व्रत दशमी के सूर्यास्त से आरम्भ होकर द्वादशी पर पारण (उपवास तोड़ने) के बाद समाप्त होता है। पूजा ब्रह्म मुहूर्त या एकादशी तिथि की प्रातःकालीन बेला में करनी चाहिए।',
    sa: 'एकादशीव्रतं दशमीसूर्यास्तात् आरभ्य द्वादश्यां पारणानन्तरं समाप्यते। पूजा ब्रह्ममुहूर्ते एकादशीतिथ्यां प्रातःकाले वा कर्तव्या।',
  },
  muhurtaWindow: { type: 'brahma_muhurta' },

  sankalpa: {
    en: 'On this sacred Ekadashi tithi, I undertake this nirjala/phalahar vrat and worship of Lord Vishnu for the destruction of sins, spiritual merit, and the attainment of Vaikuntha.',
    hi: 'इस पवित्र एकादशी तिथि पर, पापनाश, पुण्यप्राप्ति और वैकुण्ठ की प्राप्ति के लिए, मैं भगवान विष्णु का पूजन और निर्जला/फलाहार व्रत का संकल्प करता/करती हूँ।',
    sa: 'अस्यां पवित्रायां एकादश्यां तिथौ पापनाशाय पुण्यसम्पादनाय वैकुण्ठप्राप्त्यर्थं च श्रीविष्णोः पूजनं निर्जलं/फलाहारव्रतं च अहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Dashami Evening — Preparation', hi: 'दशमी सायं — तैयारी', sa: 'दशम्याः सायम् — सज्जता' },
      description: {
        en: 'On the evening of Dashami (the day before Ekadashi), eat a light sattvic dinner before sunset. Avoid heavy, tamasic food. Resolve mentally to observe the fast. Clean the puja area and arrange all samagri.',
        hi: 'दशमी (एकादशी से एक दिन पहले) की शाम को सूर्यास्त से पहले हल्का सात्विक भोजन करें। भारी, तामसिक भोजन से बचें। मानसिक रूप से व्रत का संकल्प लें। पूजा स्थल साफ करें और सभी सामग्री व्यवस्थित करें।',
        sa: 'दशम्याः सायं (एकादश्याः पूर्वदिने) सूर्यास्तात् प्राक् लघु सात्त्विकं भोजनं कुर्यात्। गुरुतामसिकाहारं त्यजेत्। मनसा व्रतसङ्कल्पं कुर्यात्। पूजास्थलं शोधयेत् सामग्रीं च सज्जयेत्।',
      },
      duration: '30 min',
    },
    {
      step: 2,
      title: { en: 'Ekadashi Morning — Bath & Sankalpa', hi: 'एकादशी प्रातः — स्नान एवं संकल्प', sa: 'एकादश्याः प्रातः — स्नानसङ्कल्पौ' },
      description: {
        en: 'Wake before sunrise. Take a purifying bath, ideally with a few drops of Ganga water. Wear clean yellow or white clothes. Sit before the altar and take the formal sankalpa by holding water and akshat in the right palm, stating the tithi, purpose, and deity.',
        hi: 'सूर्योदय से पहले उठें। शुद्धि स्नान करें, यदि सम्भव हो तो गंगाजल की कुछ बूँदें मिलाएँ। स्वच्छ पीले या सफ़ेद वस्त्र पहनें। वेदी के सामने बैठकर दाहिने हाथ में जल और अक्षत लेकर तिथि, उद्देश्य और देवता का नाम बोलकर विधिवत् संकल्प लें।',
        sa: 'सूर्योदयात् प्राक् उत्तिष्ठेत्। शुद्धिस्नानं कुर्यात्, गङ्गाजलबिन्दूनां योजनं श्रेष्ठम्। शुचिपीतश्वेतवस्त्रं धारयेत्। वेद्याः पुरतः उपविश्य दक्षिणहस्ते जलाक्षतान् गृहीत्वा तिथिप्रयोजनदेवतानामोच्चारणपूर्वकं सङ्कल्पं कुर्यात्।',
      },
      duration: '15 min',
    },
    {
      step: 3,
      title: { en: 'Vishnu Puja — Shodashopachar', hi: 'विष्णु पूजा — षोडशोपचार', sa: 'विष्णुपूजनम् — षोडशोपचारः' },
      description: {
        en: 'Perform the sixteen-step worship of Lord Vishnu: Avahana (invocation), Asana (seat), Padya (foot-wash), Arghya (water offering), Achamaniya (sipping water), Snana (bath with panchamrit and water), Vastra (yellow cloth), Yajnopavita (sacred thread), Gandha (sandalwood), Pushpa (flowers with Tulsi), Dhupa (incense), Dipa (ghee lamp), Naivedya (fruits only — no grains), Tambula (betel), Pradakshina (circumambulation), and Namaskara (prostration).',
        hi: 'भगवान विष्णु की षोडशोपचार पूजा करें: आवाहन, आसन, पाद्य, अर्घ्य, आचमनीय, स्नान (पंचामृत और जल से), वस्त्र (पीला), यज्ञोपवीत, गन्ध (चन्दन), पुष्प (तुलसी सहित), धूप, दीप (घी का), नैवेद्य (केवल फल — अन्न नहीं), ताम्बूल, प्रदक्षिणा और नमस्कार।',
        sa: 'श्रीविष्णोः षोडशोपचारपूजनं कुर्यात्: आवाहनम्, आसनम्, पाद्यम्, अर्घ्यम्, आचमनीयम्, स्नानम् (पञ्चामृतजलाभ्याम्), वस्त्रम् (पीतम्), यज्ञोपवीतम्, गन्धम् (चन्दनम्), पुष्पम् (तुलसीसहितम्), धूपम्, दीपम् (घृतदीपम्), नैवेद्यम् (फलानि एव — न अन्नम्), ताम्बूलम्, प्रदक्षिणा, नमस्कारः।',
      },
      mantraRef: 'vishnu-dvadashakshari',
      duration: '30 min',
    },
    {
      step: 4,
      title: { en: 'Tulsi Worship', hi: 'तुलसी पूजन', sa: 'तुलसीपूजनम्' },
      description: {
        en: 'Offer special worship to the Tulsi plant, which is Vishnu\'s most beloved consort (Vrinda Devi). Water the Tulsi plant, apply kumkum and turmeric at its base, offer flowers, and light a diya near the Tulsi. Circumambulate the Tulsi plant three times.',
        hi: 'तुलसी के पौधे की विशेष पूजा करें जो विष्णु की प्रियतमा (वृन्दा देवी) हैं। तुलसी को जल अर्पित करें, जड़ में कुमकुम और हल्दी लगाएँ, फूल चढ़ाएँ, और तुलसी के पास दीपक जलाएँ। तुलसी की तीन बार परिक्रमा करें।',
        sa: 'तुलसीं विशेषतः पूजयेत् — सा विष्णोः प्रियतमा वृन्दादेवी। तुलसीं जलेन सिञ्चेत्, मूले कुङ्कुमहरिद्रां लिम्पेत्, पुष्पाणि अर्पयेत्, तुलसीसमीपे दीपं प्रज्वालयेत्। तुलसीं त्रिवारं प्रदक्षिणां कुर्यात्।',
      },
      duration: '10 min',
    },
    {
      step: 5,
      title: { en: 'Vishnu Sahasranama Recitation', hi: 'विष्णु सहस्रनाम पाठ', sa: 'विष्णुसहस्रनामपाठः' },
      description: {
        en: 'Recite the Sri Vishnu Sahasranama Stotram (1000 names of Vishnu from the Mahabharata, Anushasana Parva). This is the most meritorious recitation for Ekadashi. If time does not permit, recite at least the Vishnu Ashtottara Shatanamavali (108 names).',
        hi: 'श्री विष्णु सहस्रनाम स्तोत्रम् (महाभारत, अनुशासन पर्व से विष्णु के 1000 नाम) का पाठ करें। यह एकादशी पर सबसे पुण्यदायी पाठ है। यदि समय न हो तो कम से कम विष्णु अष्टोत्तरशतनामावली (108 नाम) का पाठ करें।',
        sa: 'श्रीविष्णुसहस्रनामस्तोत्रं पठेत् (महाभारतस्य अनुशासनपर्वणः विष्णोः सहस्रनामानि)। एकादश्यां एतत् सर्वोत्तमं पुण्यपाठनम्। यदि कालाभावः तर्हि विष्णोः अष्टोत्तरशतनामावलीं (१०८ नामानि) पठेत्।',
      },
      mantraRef: 'vishnu-sahasranama-opening',
      duration: '45 min',
    },
    {
      step: 6,
      title: { en: 'Bhajan & Kirtan', hi: 'भजन एवं कीर्तन', sa: 'भजनकीर्तनम्' },
      description: {
        en: 'Sing devotional songs (bhajans) and kirtans in praise of Lord Vishnu, Krishna, or Rama. Popular choices include "Hare Krishna Maha Mantra", "Shri Ram Jai Ram", and "Achyutam Keshavam". This can be done individually or in a group.',
        hi: 'भगवान विष्णु, कृष्ण या राम की स्तुति में भजन और कीर्तन गाएँ। लोकप्रिय भजनों में "हरे कृष्ण महामन्त्र", "श्री राम जय राम", और "अच्युतम् केशवम्" शामिल हैं। यह अकेले या समूह में किया जा सकता है।',
        sa: 'श्रीविष्णोः कृष्णस्य रामस्य वा स्तुतौ भजनकीर्तनानि गायेत्। "हरे कृष्ण महामन्त्रम्", "श्रीरामजयराम", "अच्युतं केशवम्" इत्यादीनि प्रसिद्धानि। एकाकिना वा समूहेन वा कुर्यात्।',
      },
      duration: '30 min',
    },
    {
      step: 7,
      title: { en: 'Aarti', hi: 'आरती', sa: 'आरात्रिकम्' },
      description: {
        en: 'Perform the evening aarti of Lord Vishnu with the ghee lamp and camphor. Sing "Om Jai Jagdish Hare" — the universal Vishnu aarti. Ring the bell and offer the flame to all family members.',
        hi: 'घी के दीपक और कपूर से भगवान विष्णु की सायं आरती करें। "ॐ जय जगदीश हरे" — विष्णु की सार्वभौमिक आरती गाएँ। घण्टी बजाएँ और सभी परिवारजनों को ज्योति प्रदान करें।',
        sa: 'घृतदीपकर्पूराभ्यां श्रीविष्णोः सायमारात्रिकं कुर्यात्। "ॐ जय जगदीश हरे" इति विष्णोः सार्वभौमिकम् आरात्रिकं गायेत्। घण्टां वादयेत् सर्वपरिजनेभ्यः ज्योतिं प्रदर्शयेत्।',
      },
      duration: '10 min',
    },
    {
      step: 8,
      title: { en: 'Jagran — Night Vigil (Optional)', hi: 'जागरण — रात्रि जागरण (वैकल्पिक)', sa: 'जागरणम् — रात्रिजागरणम् (ऐच्छिकम्)' },
      description: {
        en: 'Stay awake through the night (jagran) listening to Vishnu katha, singing bhajans, reading the Bhagavad Gita, or meditating. This is optional but greatly enhances the merit of the vrat. Even staying awake till midnight is meritorious.',
        hi: 'विष्णु कथा सुनते, भजन गाते, भगवद्गीता पढ़ते या ध्यान करते हुए पूरी रात जागें (जागरण)। यह वैकल्पिक है किन्तु व्रत के पुण्य को बहुत बढ़ाता है। मध्यरात्रि तक जागना भी पुण्यदायी है।',
        sa: 'विष्णुकथाश्रवणभजनगायनभगवद्गीतापठनध्यानादिना सर्वां रात्रिं जागृयात् (जागरणम्)। एतद् ऐच्छिकं किन्तु व्रतपुण्यं बहु वर्धयति। अर्धरात्रिपर्यन्तं जागरणमपि पुण्यप्रदम्।',
      },
      duration: 'Overnight',
    },
    {
      step: 9,
      title: { en: 'Dwadashi Morning — Parana (Breaking the Fast)', hi: 'द्वादशी प्रातः — पारण (उपवास समाप्ति)', sa: 'द्वादशी प्रातः — पारणम् (उपवाससमाप्तिः)' },
      description: {
        en: 'On Dwadashi morning, perform morning ablutions and a brief Vishnu puja. Break the fast (parana) ONLY after sunrise and within the parana window (typically before 1/4th of the day has passed). Begin with Tulsi water, then fruits, then a light meal. Offering food to a Brahmin before eating yourself is highly meritorious.',
        hi: 'द्वादशी की सुबह प्रातःकालीन क्रिया और संक्षिप्त विष्णु पूजा करें। उपवास (पारण) केवल सूर्योदय के बाद और पारण काल (सामान्यतः दिन का पहला चौथाई भाग बीतने से पहले) में ही तोड़ें। पहले तुलसी जल, फिर फल, फिर हल्का भोजन लें। स्वयं खाने से पहले ब्राह्मण को भोजन कराना अत्यधिक पुण्यकारी है।',
        sa: 'द्वादश्यां प्रातः प्रातःकर्माणि संक्षिप्तविष्णुपूजनं च कुर्यात्। पारणं सूर्योदयानन्तरं पारणकाले एव (प्रायः दिनस्य प्रथमचतुर्थांशात् प्राक्) कुर्यात्। प्रथमं तुलसीजलम्, ततः फलानि, ततो लघुभोजनम् ग्रहणीयम्। स्वभोजनात् प्राक् ब्राह्मणभोजनं महापुण्यप्रदम्।',
      },
      duration: '20 min',
    },
  ],

  mantras: [
    {
      id: 'vishnu-dvadashakshari',
      name: { en: 'Vishnu Dvadashakshari Mantra (12-syllable)', hi: 'विष्णु द्वादशाक्षरी मन्त्र', sa: 'विष्णुद्वादशाक्षरीमन्त्रः' },
      devanagari: 'ॐ नमो भगवते वासुदेवाय',
      iast: 'oṃ namo bhagavate vāsudevāya',
      meaning: {
        en: 'Om, I bow to Lord Vasudeva (Krishna/Vishnu), the Supreme Being.',
        hi: 'ॐ, सर्वोच्च भगवान वासुदेव (कृष्ण/विष्णु) को मेरा नमन।',
        sa: 'ॐ, भगवते वासुदेवाय (कृष्णाय/विष्णवे) परमात्मने नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Primary mantra for Ekadashi. Chant 108 times during puja or throughout the day. This is the maha-mantra of Vaishnavas.',
        hi: 'एकादशी का प्रमुख मन्त्र। पूजा के दौरान या दिनभर 108 बार जपें। यह वैष्णवों का महामन्त्र है।',
        sa: 'एकादश्याः प्रधानमन्त्रः। पूजायां दिने वा १०८ वारं जपेत्। एषः वैष्णवानां महामन्त्रः।',
      },
    },
    {
      id: 'vishnu-gayatri',
      name: { en: 'Vishnu Gayatri Mantra', hi: 'विष्णु गायत्री मन्त्र', sa: 'विष्णुगायत्रीमन्त्रः' },
      devanagari: 'ॐ नारायणाय विद्महे वासुदेवाय धीमहि। तन्नो विष्णुः प्रचोदयात्॥',
      iast: 'oṃ nārāyaṇāya vidmahe vāsudevāya dhīmahi | tanno viṣṇuḥ pracodayāt ||',
      meaning: {
        en: 'Om, we meditate upon Narayana, we contemplate Vasudeva. May Lord Vishnu inspire and illuminate us.',
        hi: 'ॐ, हम नारायण का ध्यान करते हैं, वासुदेव का चिन्तन करते हैं। भगवान विष्णु हमें प्रेरित और प्रकाशित करें।',
        sa: 'ॐ, नारायणं विद्मः, वासुदेवं ध्यायामः। विष्णुः नः प्रचोदयात्।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant during the Shodashopachar puja or during meditation. Particularly powerful when recited at Brahma Muhurta on Ekadashi.',
        hi: 'षोडशोपचार पूजा या ध्यान के दौरान जपें। एकादशी के ब्रह्म मुहूर्त में जपने पर विशेष प्रभावी।',
        sa: 'षोडशोपचारपूजायां ध्यानकाले वा जपेत्। एकादश्यां ब्रह्ममुहूर्ते जपने विशेषप्रभावी।',
      },
    },
    {
      id: 'vishnu-sahasranama-opening',
      name: { en: 'Vishnu Sahasranama — Opening Verse (Dhyana Shloka)', hi: 'विष्णु सहस्रनाम — आरम्भिक श्लोक (ध्यान श्लोक)', sa: 'विष्णुसहस्रनाम — प्रारम्भश्लोकः (ध्यानश्लोकः)' },
      devanagari: 'शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्। प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥',
      iast: 'śuklāmbaradharaṃ viṣṇuṃ śaśivarṇaṃ caturbhujam | prasannavadanaṃ dhyāyet sarvavighnopaśāntaye ||',
      meaning: {
        en: 'I meditate upon Lord Vishnu, who wears white garments, who has the complexion of the moon, who has four arms, and whose face is serene — for the removal of all obstacles.',
        hi: 'श्वेत वस्त्रधारी, चन्द्रमा जैसी कान्ति वाले, चतुर्भुज, प्रसन्नमुख भगवान विष्णु का मैं ध्यान करता/करती हूँ — सभी विघ्नों की शान्ति के लिए।',
        sa: 'शुक्लवस्त्रधारिणं शशिवर्णं चतुर्भुजं प्रसन्नवदनं विष्णुं ध्यायेत् — सर्वेषां विघ्नानां शान्तये।',
      },
      usage: {
        en: 'Recite before beginning the Vishnu Sahasranama Stotram. This is the dhyana shloka that invokes the form of Vishnu in the mind.',
        hi: 'विष्णु सहस्रनाम स्तोत्र आरम्भ करने से पहले इस श्लोक का पाठ करें। यह ध्यान श्लोक है जो मन में विष्णु के स्वरूप का आवाहन करता है।',
        sa: 'विष्णुसहस्रनामस्तोत्रारम्भात् प्राक् एतत् श्लोकं पठेत्। एषः ध्यानश्लोकः मनसि विष्णुस्वरूपम् आवाहयति।',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Sri Vishnu Sahasranama Stotram', hi: 'श्री विष्णु सहस्रनाम स्तोत्रम्', sa: 'श्रीविष्णुसहस्रनामस्तोत्रम्' },
      verseCount: 142,
      duration: '45 min',
      note: {
        en: 'From Mahabharata, Anushasana Parva. The most meritorious recitation on Ekadashi. Contains 1000 names of Vishnu as narrated by Bhishma to Yudhishthira.',
        hi: 'महाभारत, अनुशासन पर्व से। एकादशी पर सबसे पुण्यदायी पाठ। इसमें भीष्म द्वारा युधिष्ठिर को बताए गए विष्णु के 1000 नाम हैं।',
        sa: 'महाभारतस्य अनुशासनपर्वणः। एकादश्यां सर्वोत्तमं पुण्यपाठनम्। भीष्मेण युधिष्ठिराय कथितानि विष्णोः सहस्रनामानि।',
      },
    },
  ],

  aarti: {
    name: { en: 'Om Jai Jagdish Hare — Vishnu Aarti', hi: 'ॐ जय जगदीश हरे — विष्णु आरती', sa: 'ॐ जय जगदीश हरे — विष्ण्वारात्रिकम्' },
    devanagari: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, दास जनों के संकट,
क्षण में दूर करे॥ ॐ जय जगदीश हरे॥

जो ध्यावे फल पावे, दुख बिनसे मन का।
स्वामी दुख बिनसे मन का।
सुख सम्पत्ति घर आवे, सुख सम्पत्ति घर आवे,
कष्ट मिटे तन का॥ ॐ जय जगदीश हरे॥

मात पिता तुम मेरे, शरण गहूँ मैं किसकी।
स्वामी शरण गहूँ मैं किसकी।
तुम बिन और न दूजा, तुम बिन और न दूजा,
आस करूँ मैं जिसकी॥ ॐ जय जगदीश हरे॥

तुम पूरण परमात्मा, तुम अन्तर्यामी।
स्वामी तुम अन्तर्यामी।
पारब्रह्म परमेश्वर, पारब्रह्म परमेश्वर,
तुम सबके स्वामी॥ ॐ जय जगदीश हरे॥

तुम करुणा के सागर, तुम पालनकर्ता।
स्वामी तुम पालनकर्ता।
मैं मूरख फलकामी, मैं सेवक तुम स्वामी,
कृपा करो भर्ता॥ ॐ जय जगदीश हरे॥

तुम हो एक अगोचर, सबके प्राणपति।
स्वामी सबके प्राणपति।
किस विध मिलूँ दयामय, किस विध मिलूँ दयामय,
तुमको मैं कुमति॥ ॐ जय जगदीश हरे॥

दीनबन्धु दुखहर्ता, ठाकुर तुम मेरे।
स्वामी ठाकुर तुम मेरे।
अपने हाथ उठाओ, अपनी शरण लगाओ,
द्वार पड़ा तेरे॥ ॐ जय जगदीश हरे॥

विषय विकार मिटाओ, पाप हरो देवा।
स्वामी पाप हरो देवा।
श्रद्धा भक्ति बढ़ाओ, श्रद्धा भक्ति बढ़ाओ,
सन्तन की सेवा॥ ॐ जय जगदीश हरे॥`,
    iast: `oṃ jaya jagadīśa hare, svāmī jaya jagadīśa hare |
bhakta janõ ke saṅkaṭa, dāsa janõ ke saṅkaṭa,
kṣaṇa mẽ dūra kare || oṃ jaya jagadīśa hare ||

jo dhyāve phala pāve, dukha binase mana kā |
svāmī dukha binase mana kā |
sukha sampatti ghara āve, sukha sampatti ghara āve,
kaṣṭa miṭe tana kā || oṃ jaya jagadīśa hare ||

māta pitā tuma mere, śaraṇa gahū̃ maĩ kisakī |
svāmī śaraṇa gahū̃ maĩ kisakī |
tuma bina aura na dūjā, tuma bina aura na dūjā,
āsa karū̃ maĩ jisakī || oṃ jaya jagadīśa hare ||

tuma pūraṇa paramātmā, tuma antaryāmī |
svāmī tuma antaryāmī |
pārabrahma parameśvara, pārabrahma parameśvara,
tuma sabake svāmī || oṃ jaya jagadīśa hare ||

tuma karuṇā ke sāgara, tuma pālanakartā |
svāmī tuma pālanakartā |
maĩ mūrakha phalakāmī, maĩ sevaka tuma svāmī,
kṛpā karo bhartā || oṃ jaya jagadīśa hare ||

tuma ho eka agocara, sabake prāṇapati |
svāmī sabake prāṇapati |
kisa vidha milū̃ dayāmaya, kisa vidha milū̃ dayāmaya,
tumako maĩ kumati || oṃ jaya jagadīśa hare ||

dīnabandhu dukhahartā, ṭhākura tuma mere |
svāmī ṭhākura tuma mere |
apane hātha uṭhāo, apanī śaraṇa lagāo,
dvāra paḍā tere || oṃ jaya jagadīśa hare ||

viṣaya vikāra miṭāo, pāpa haro devā |
svāmī pāpa haro devā |
śraddhā bhakti baḍhāo, śraddhā bhakti baḍhāo,
santana kī sevā || oṃ jaya jagadīśa hare ||`,
  },

  naivedya: {
    en: 'Offer only fruits (banana, pomegranate, apple), dry fruits, milk, and Tulsi water. Absolutely NO grains, rice, or cereals as naivedya on Ekadashi. Sabudana kheer or kuttu (buckwheat) items are acceptable for phalahar observers.',
    hi: 'केवल फल (केला, अनार, सेब), मेवे, दूध और तुलसी जल अर्पित करें। एकादशी पर नैवेद्य में अन्न, चावल या अनाज बिलकुल नहीं चढ़ाएँ। फलाहारी लोगों के लिए साबूदाना खीर या कुट्टू की वस्तुएँ स्वीकार्य हैं।',
    sa: 'केवलं फलानि (कदलीफलम्, दाडिमम्, सेवफलम्), शुष्कफलानि, क्षीरं, तुलसीजलं च अर्पयेत्। एकादश्यां नैवेद्ये अन्नं तण्डुलं धान्यं वा सर्वथा न अर्पणीयम्।',
  },

  precautions: [
    {
      en: 'NO rice on Ekadashi — this is the single most important rule. Even a grain of rice consumed negates the entire vrat\'s merit.',
      hi: 'एकादशी पर चावल नहीं खाना — यह सबसे महत्वपूर्ण नियम है। एक चावल का दाना भी खाने से पूरे व्रत का पुण्य नष्ट हो जाता है।',
      sa: 'एकादश्यां तण्डुलाः न भक्षणीयाः — एतन्नियमः सर्वप्रधानः। एकम् अपि तण्डुलकणं भक्षितं चेत् सकलव्रतपुण्यं विनश्यति।',
    },
    {
      en: 'No grains or cereals of any kind — wheat, rice, lentils, corn, etc. are all prohibited. Only phalahar (fruit diet) or nirjala (waterless) fast.',
      hi: 'किसी भी प्रकार का अन्न या अनाज — गेहूँ, चावल, दाल, मक्का आदि सब वर्जित। केवल फलाहार या निर्जला उपवास।',
      sa: 'सर्वप्रकारं धान्यम् — गोधूमाः, तण्डुलाः, मसूराः, यवनालाः इत्यादयः सर्वे निषिद्धाः। केवलं फलाहारो निर्जलव्रतं वा।',
    },
    {
      en: 'No onion, garlic, or non-vegetarian food. These are tamasic and prohibited during all vrats.',
      hi: 'प्याज, लहसुन या माँसाहार नहीं। ये तामसिक हैं और सभी व्रतों में वर्जित हैं।',
      sa: 'पलाण्डुः लशुनं मांसाहारो वा न भक्षणीयम्। एतानि तामसिकानि सर्ववर्तेषु निषिद्धानि।',
    },
    {
      en: 'Do NOT sleep during the daytime on Ekadashi. Sleeping during the day negates the merit of the vrat (Hari Bhakti Vilasa).',
      hi: 'एकादशी को दिन में नहीं सोना। दिन में सोने से व्रत का पुण्य नष्ट होता है (हरि भक्ति विलास)।',
      sa: 'एकादश्यां दिवा न स्वपेत्। दिवास्वापेन व्रतपुण्यं नश्यति (हरिभक्तिविलासः)।',
    },
    {
      en: 'Break the fast (parana) ONLY within the Dwadashi parana window — after sunrise but before the window ends. Breaking too early or too late nullifies the vrat.',
      hi: 'पारण केवल द्वादशी पारण काल में ही करें — सूर्योदय के बाद लेकिन समय सीमा समाप्त होने से पहले। बहुत जल्दी या देर से पारण करने पर व्रत का फल नहीं मिलता।',
      sa: 'पारणं द्वादशीपारणकाले एव कुर्यात् — सूर्योदयानन्तरं किन्तु कालसीमायाः प्राक्। अतिशीघ्रं अतिविलम्बं वा पारणे व्रतफलं विनश्यति।',
    },
  ],

  phala: {
    en: 'Each Ekadashi observed with devotion equals the merit of donating 1000 cows (Padma Purana). It destroys sins of past lives, purifies the soul, and grants passage to Vaikuntha (the abode of Vishnu). The observer is freed from the cycle of birth and death.',
    hi: 'प्रत्येक एकादशी का भक्तिपूर्वक पालन 1000 गायों के दान के पुण्य के बराबर है (पद्म पुराण)। यह पूर्वजन्म के पापों को नष्ट करता है, आत्मा को शुद्ध करता है, और वैकुण्ठ (विष्णु के धाम) की प्राप्ति कराता है। व्रती जन्म-मरण के चक्र से मुक्त होता है।',
    sa: 'प्रत्येकं एकादशीव्रतं भक्त्या अनुष्ठितं सहस्रगोदानपुण्यसमम् (पद्मपुराणम्)। पूर्वजन्मपापानि विनाशयति, आत्मानं शोधयति, वैकुण्ठप्राप्तिं ददाति। व्रती जन्ममरणचक्रात् मुच्यते।',
  },
};
