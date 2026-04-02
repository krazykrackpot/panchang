import type { PujaVidhi } from '../types';

export const SHUKRA_SHANTI: PujaVidhi = {
  festivalSlug: 'graha-shanti-shukra',
  category: 'graha_shanti',
  deity: { en: 'Shukra (Venus)', hi: 'शुक्र देव', sa: 'शुक्रदेवः' },

  samagri: [
    { name: { en: 'Rice (white, basmati)', hi: 'चावल (सफ़ेद, बासमती)', sa: 'तण्डुलाः (श्वेताः, बासमती)' }, quantity: '1 kg', essential: true, category: 'food' },
    { name: { en: 'White cloth (silk preferred)', hi: 'सफ़ेद वस्त्र (रेशमी उत्तम)', sa: 'श्वेतवस्त्रम् (कौशेयं श्रेष्ठम्)' }, essential: true, category: 'clothing' },
    { name: { en: 'Silver item (coin or vessel)', hi: 'चाँदी की वस्तु (सिक्का या पात्र)', sa: 'रजतवस्तु (मुद्रा पात्रं वा)' }, category: 'puja_items' },
    { name: { en: 'White flowers (lotus / jasmine / tuberose)', hi: 'सफ़ेद फूल (कमल / चमेली / रजनीगन्धा)', sa: 'श्वेतपुष्पाणि (पद्मम् / मल्लिका / रजनीगन्धा)' }, essential: true, category: 'flowers' },
    { name: { en: 'Ghee (clarified butter)', hi: 'घी', sa: 'घृतम्' }, quantity: '250 g', essential: true, category: 'food' },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, essential: true, category: 'puja_items' },
    { name: { en: 'Perfume / Attar (rose or sandalwood)', hi: 'इत्र (गुलाब या चन्दन)', sa: 'सुगन्धद्रव्यम् (पाटलं चन्दनं वा)' }, category: 'puja_items' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Shukra Shanti puja is performed on Friday morning or evening. The Aparahna (afternoon) period is also auspicious. Shukravar (Friday) is Venus\'s own day.',
    hi: 'शुक्र शान्ति पूजा शुक्रवार को प्रातः या सायं करनी चाहिए। अपराह्न काल भी शुभ है। शुक्रवार शुक्र ग्रह का अपना दिन है।',
    sa: 'शुक्रशान्तिपूजा शुक्रवासरे प्रातः सायं वा कर्तव्या। अपराह्णकालोऽपि शुभः। शुक्रवासरः शुक्रग्रहस्य स्वदिनम्।',
  },

  sankalpa: {
    en: 'On this sacred Friday, I perform Shukra Graha Shanti puja to pacify Venus and seek blessings for marital happiness, artistic talent, material comfort, and beauty.',
    hi: 'इस पवित्र शुक्रवार को, मैं वैवाहिक सुख, कलात्मक प्रतिभा, भौतिक सुख-सुविधा और सौन्दर्य हेतु शुक्र ग्रह शान्ति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रशुक्रवासरे वैवाहिकसुखकलात्मकप्रतिभाभौतिकसुखसौन्दर्यार्थं शुक्रग्रहशान्तिपूजां करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Ritual Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Bathe with fragrant water (add rose petals or sandalwood). Wear clean white silk or cotton clothes. Apply sandalwood paste and a touch of perfume.',
        hi: 'सुगन्धित जल (गुलाब की पंखुड़ियाँ या चन्दन मिलाकर) से स्नान करें। स्वच्छ सफ़ेद रेशमी या सूती वस्त्र पहनें। चन्दन का लेप और हल्का इत्र लगाएँ।',
        sa: 'सुगन्धितजलेन (पाटलदलानि चन्दनं वा मिश्रय) स्नानं कुर्यात्। शुचिश्वेतकौशेयकार्पासवस्त्राणि धारयेत्। चन्दनलेपं सुगन्धं च धारयेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit facing east. Hold water with white flowers and perfume in the right palm. State your name, gotra, and intention to pacify Shukra graha.',
        hi: 'पूर्व दिशा की ओर मुख कर बैठें। दाहिने हाथ में सफ़ेद फूल और इत्र सहित जल लेकर शुक्र ग्रह शान्ति का संकल्प करें।',
        sa: 'प्राग्दिशम् अभिमुखम् उपविशेत्। दक्षिणहस्ते श्वेतपुष्पसुगन्धसहितजलं गृहीत्वा शुक्रग्रहशान्तिसङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापनम्' },
      description: {
        en: 'Fill a silver or clean steel vessel with water and ghee drops. Add white flowers and a silver coin. Place on a bed of rice grains covered with white silk cloth.',
        hi: 'चाँदी या स्वच्छ स्टील के पात्र में जल और घी की बूँदें डालें। सफ़ेद फूल और चाँदी का सिक्का डालें। सफ़ेद रेशम से ढके चावल पर रखें।',
        sa: 'रजतपात्रम् इस्पातपात्रं वा जलेन घृतबिन्दुभिश्च पूरयेत्। श्वेतपुष्पाणि रजतमुद्रां च क्षिपेत्। श्वेतकौशेयावृततण्डुलोपरि स्थापयेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Shukra Avahana (Invocation)', hi: 'शुक्र आवाहन', sa: 'शुक्रावाहनम्' },
      description: {
        en: 'Invoke Shukra Deva by lighting ghee lamp and camphor. Offer white fragrant flowers and sprinkle perfume. Recite "Om Shukraya Namah" three times.',
        hi: 'घी का दीपक और कपूर जलाकर शुक्र देव का आवाहन करें। सफ़ेद सुगन्धित फूल अर्पित करें और इत्र छिड़कें। "ॐ शुक्राय नमः" तीन बार बोलें।',
        sa: 'घृतदीपं कर्पूरं च प्रज्वाल्य शुक्रदेवम् आवाहयेत्। श्वेतसुगन्धितपुष्पाणि अर्पयेत् सुगन्धं च सिञ्चेत्। "ओं शुक्राय नमः" इति त्रिवारम् उच्चारयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Shukra Beej Mantra Japa', hi: 'शुक्र बीज मन्त्र जप', sa: 'शुक्रबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Shukra Beej Mantra 16,000 times (or 108 times minimum). Use a sphatik (crystal) or diamond mala. Meditate on a brilliant white orb of beauty and harmony.',
        hi: 'शुक्र बीज मन्त्र 16,000 बार (या न्यूनतम 108 बार) जपें। स्फटिक या हीरे की माला का उपयोग करें। सौन्दर्य और सामंजस्य के चमकीले श्वेत गोले का ध्यान करें।',
        sa: 'शुक्रबीजमन्त्रं षोडशसहस्रवारम् (अथवा न्यूनतम् अष्टोत्तरशतवारम्) जपेत्। स्फटिकवज्रमालाम् उपयुञ्जीत। सौन्दर्यसामञ्जस्यस्य दीप्तश्वेतगोलं ध्यायेत्।',
      },
      mantraRef: 'shukra-beej',
      essential: true,
      stepType: 'mantra',
      duration: '90 min',
    },
    {
      step: 6,
      title: { en: 'Homa (Fire Offering) — Optional', hi: 'होम (हवन) — वैकल्पिक', sa: 'होमः — वैकल्पिकः' },
      description: {
        en: 'If possible, perform a small homa with ghee and sandalwood sticks. Offer rice and white flowers into the fire while chanting the Shukra Gayatri.',
        hi: 'यदि सम्भव हो तो घी और चन्दन की लकड़ी से लघु होम करें। शुक्र गायत्री का जाप करते हुए चावल और सफ़ेद फूलों की आहुति दें।',
        sa: 'यदि शक्यं घृतेन चन्दनकाष्ठैश्च लघुहोमं कुर्यात्। शुक्रगायत्रीं जपन् तण्डुलान् श्वेतपुष्पाणि च अग्नौ आहुतिं दद्यात्।',
      },
      essential: false,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charitable Giving)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate rice and white cloth (preferably silk) to a married woman or the needy. Gifting cosmetics, perfume, or white items is also auspicious for Shukra shanti.',
        hi: 'सुहागिन स्त्री या ज़रूरतमन्दों को चावल और सफ़ेद वस्त्र (रेशमी उत्तम) दान करें। सौन्दर्य प्रसाधन, इत्र या सफ़ेद वस्तुएँ देना भी शुक्र शान्ति के लिए शुभ है।',
        sa: 'सुमङ्गल्यै दीनेभ्यः वा तण्डुलान् श्वेतवस्त्रं (कौशेयं श्रेष्ठम्) च दद्यात्। सौन्दर्यप्रसाधनानि सुगन्धं श्वेतवस्तूनि वा दातुम् अपि शुक्रशान्त्यर्थं शुभम्।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Final Prayer)', hi: 'प्रार्थना', sa: 'प्रार्थना' },
      description: {
        en: 'Pray to Shukra Deva and Goddess Lakshmi for marital bliss, beauty, and material comfort. Perform namaskar and distribute fragrant prasad.',
        hi: 'वैवाहिक सुख, सौन्दर्य और भौतिक सुख हेतु शुक्र देव और देवी लक्ष्मी से प्रार्थना करें। नमस्कार करें और सुगन्धित प्रसाद वितरित करें।',
        sa: 'वैवाहिकसुखसौन्दर्यभौतिकसुखार्थं शुक्रदेवं लक्ष्मीदेवीं च प्रार्थयेत्। नमस्कारं कुर्यात् सुगन्धितप्रसादं च वितरेत्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'shukra-beej',
      name: { en: 'Shukra Beej Mantra', hi: 'शुक्र बीज मन्त्र', sa: 'शुक्रबीजमन्त्रः' },
      devanagari: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
      iast: 'oṃ drāṃ drīṃ drauṃ saḥ śukrāya namaḥ',
      meaning: {
        en: 'Salutations to Venus. The seed syllables invoke Shukra\'s harmonious energy for love, beauty, artistic talent, and material prosperity.',
        hi: 'शुक्र को नमन। बीज अक्षर शुक्र की सामंजस्यपूर्ण ऊर्जा का आवाहन प्रेम, सौन्दर्य, कला और भौतिक समृद्धि हेतु करते हैं।',
        sa: 'शुक्राय नमः। बीजाक्षराणि शुक्रस्य सामञ्जस्यऊर्जां प्रेमसौन्दर्यकलाभौतिकसमृद्ध्यर्थम् आवाहयन्ति।',
      },
      japaCount: 16000,
      usage: {
        en: 'Chant 16,000 times for full Shukra shanti; 108 times daily for ongoing remedy',
        hi: 'पूर्ण शुक्र शान्ति के लिए 16,000 बार जपें; दैनिक उपाय के लिए 108 बार',
        sa: 'पूर्णशुक्रशान्त्यर्थं षोडशसहस्रवारं जपेत्; नित्योपचारार्थम् अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'shukra-gayatri',
      name: { en: 'Shukra Gayatri Mantra', hi: 'शुक्र गायत्री मन्त्र', sa: 'शुक्रगायत्रीमन्त्रः' },
      devanagari: 'ॐ अश्वध्वजाय विद्महे धनुर्हस्ताय धीमहि ।\nतन्नो शुक्रः प्रचोदयात् ॥',
      iast: 'oṃ aśvadhvajāya vidmahe dhanurhastāya dhīmahi |\ntanno śukraḥ pracodayāt ||',
      meaning: {
        en: 'We meditate on the one with the horse banner (Shukra), who holds a bow. May Venus inspire beauty, love, and creative excellence in us.',
        hi: 'हम अश्वध्वज (शुक्र) का ध्यान करते हैं, जो धनुष धारण करते हैं। शुक्र हमें सौन्दर्य, प्रेम और सृजनात्मक उत्कृष्टता की प्रेरणा दें।',
        sa: 'अश्वध्वजं (शुक्रम्) धनुर्हस्तं ध्यायामः। शुक्रः नः सौन्दर्यं प्रेम सृजनात्मकोत्कर्षं च प्रेरयतु।',
      },
      japaCount: 108,
      usage: {
        en: 'Recite during homa and as a daily prayer on Fridays for love and harmony',
        hi: 'होम के समय और शुक्रवार को प्रेम व सामंजस्य हेतु दैनिक प्रार्थना के रूप में जपें',
        sa: 'होमसमये शुक्रवासरे प्रेमसामञ्जस्यार्थं दैनिकप्रार्थनारूपेण च जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer kheer, white sweets (burfi, peda), ghee-based preparations, and fragrant fruits. Serve in a silver or white vessel.',
    hi: 'खीर, सफ़ेद मिठाई (बर्फी, पेड़ा), घी से बने पकवान और सुगन्धित फल अर्पित करें। चाँदी या सफ़ेद पात्र में रखें।',
    sa: 'पायसं श्वेतमिष्टान्नानि (बर्फी, पेडकम्) घृतनिर्मितपक्वान्नानि सुगन्धितफलानि च अर्पयेत्। रजतपात्रे श्वेतपात्रे वा स्थापयेत्।',
  },

  precautions: [
    {
      en: 'Face east during the puja. White and pastel colours are appropriate. Maintain personal grooming and cleanliness — Venus appreciates beauty and order.',
      hi: 'पूजा में पूर्व दिशा की ओर मुख करें। सफ़ेद और हल्के रंग उचित हैं। व्यक्तिगत सज्जा और स्वच्छता बनाए रखें — शुक्र सौन्दर्य और व्यवस्था को महत्व देता है।',
      sa: 'पूजायां प्राग्दिशम् अभिमुखं कुर्यात्। श्वेतमन्दवर्णाः उचिताः। व्यक्तिगतसज्जां शुचितां च पालयेत् — शुक्रः सौन्दर्यं व्यवस्थां च महत्त्वं ददाति।',
    },
    {
      en: 'Avoid harsh speech, conflicts, and disrespect towards women on Friday — these aggravate Venus afflictions.',
      hi: 'शुक्रवार को कठोर वाणी, विवाद और स्त्रियों के प्रति अनादर से बचें — ये शुक्र दोष को बढ़ाते हैं।',
      sa: 'शुक्रवासरे कठोरवाणीं विवादं स्त्रीणाम् अनादरं च वर्जयेत् — एते शुक्रदोषं वर्धयन्ति।',
    },
    {
      en: 'Wearing white clothes and using fragrances on Fridays is a simple daily Shukra remedy.',
      hi: 'शुक्रवार को सफ़ेद वस्त्र पहनना और सुगन्ध का उपयोग करना सरल दैनिक शुक्र उपाय है।',
      sa: 'शुक्रवासरे श्वेतवस्त्रधारणं सुगन्धोपयोगश्च सरलः दैनिकशुक्रोपचारः।',
    },
  ],

  phala: {
    en: 'Pacifies afflicted Venus. Bestows marital harmony, romantic relationships, artistic talent, material comfort, vehicle gains, beauty, luxury, and relief from reproductive health issues.',
    hi: 'पीड़ित शुक्र को शान्त करता है। वैवाहिक सामंजस्य, प्रेम सम्बन्ध, कलात्मक प्रतिभा, भौतिक सुख, वाहन लाभ, सौन्दर्य, विलासिता और प्रजनन स्वास्थ्य समस्याओं से राहत प्रदान करता है।',
    sa: 'पीडितशुक्रं शमयति। वैवाहिकसामञ्जस्यं प्रेमसम्बन्धान् कलात्मकप्रतिभां भौतिकसुखं वाहनलाभं सौन्दर्यं विलासं प्रजननस्वास्थ्यसमस्यानिवारणं च प्रददाति।',
  },
};
