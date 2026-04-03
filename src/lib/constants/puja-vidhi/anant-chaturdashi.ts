import type { PujaVidhi } from './types';

export const ANANT_CHATURDASHI_PUJA: PujaVidhi = {
  festivalSlug: 'anant-chaturdashi',
  category: 'festival',
  deity: { en: 'Vishnu (Anant / Infinite form) & Ganesha', hi: 'विष्णु (अनन्त स्वरूप) एवं गणेश', sa: 'विष्णुः (अनन्तस्वरूपः) गणेशश्च' },

  samagri: [
    { name: { en: 'Anant Sutra (14-knot sacred thread)', hi: 'अनन्त सूत्र (14 गाँठों वाला पवित्र धागा)', sa: 'अनन्तसूत्रम् (चतुर्दशग्रन्थियुक्तम्)' }, note: { en: 'Thread dyed with turmeric or saffron, with 14 knots', hi: 'हल्दी या केसर से रंगा हुआ धागा, 14 गाँठों वाला', sa: 'हरिद्रया कुङ्कुमेन वा रञ्जितं सूत्रं चतुर्दशग्रन्थियुक्तम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Darbha grass', hi: 'दूर्वा/कुश घास', sa: 'दर्भाः' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Flowers (lotus preferred)', hi: 'फूल (कमल श्रेष्ठ)', sa: 'पुष्पाणि (पद्मं श्रेष्ठम्)' }, category: 'flowers', essential: true },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, quantity: '1', category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Fruits (14 types if possible)', hi: 'फल (यदि सम्भव हो तो 14 प्रकार के)', sa: 'फलानि (चतुर्दशप्रकारकाणि यदि शक्यम्)' }, category: 'food', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Modak / Laddoo (for Ganesh)', hi: 'मोदक / लड्डू (गणेश हेतु)', sa: 'मोदकानि (गणेशार्थम्)' }, category: 'food', essential: true },
    { name: { en: 'Water pot for visarjan', hi: 'विसर्जन के लिए जल पात्र', sa: 'विसर्जनार्थं जलपात्रम्' }, category: 'vessels', essential: true },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Anant Chaturdashi puja is performed on Bhadrapada Shukla Chaturdashi during Madhyahna (midday). Ganesh Visarjan can be done anytime during the day but is traditionally performed in the evening.',
    hi: 'अनन्त चतुर्दशी पूजा भाद्रपद शुक्ल चतुर्दशी को मध्याह्न में की जाती है। गणेश विसर्जन दिन में कभी भी किया जा सकता है परन्तु परम्परागत रूप से सायंकाल में किया जाता है।',
    sa: 'अनन्तचतुर्दशीपूजा भाद्रपदशुक्लचतुर्दश्यां मध्याह्ने क्रियते। गणेशविसर्जनं दिवसे कदापि कर्तुं शक्यते परन्तु परम्परया सायङ्काले क्रियते।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this auspicious Bhadrapada Shukla Chaturdashi, I perform this Anant Chaturdashi Vrat and puja to worship Lord Vishnu in His infinite (Anant) form, for the attainment of eternal prosperity, removal of all obstacles, and liberation. I also bid farewell to Lord Ganesha with devotion and gratitude.',
    hi: 'इस शुभ भाद्रपद शुक्ल चतुर्दशी पर, शाश्वत समृद्धि की प्राप्ति, समस्त विघ्नों के निवारण और मोक्ष हेतु, भगवान विष्णु के अनन्त स्वरूप की पूजा के लिए मैं यह अनन्त चतुर्दशी व्रत एवं पूजा करता/करती हूँ। भक्ति और कृतज्ञता सहित भगवान गणेश को भी विदा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे भाद्रपदशुक्लचतुर्दश्यां शाश्वतसमृद्धिप्राप्त्यर्थं सर्वविघ्ननिवारणार्थं मोक्षार्थं च श्रीविष्णोः अनन्तस्वरूपस्य पूजनार्थम् अनन्तचतुर्दशीव्रतपूजनमहं करिष्ये। भक्त्या कृतज्ञतया च श्रीगणेशं विदापयामि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Preparation & Setup', hi: 'तैयारी एवं स्थापना', sa: 'सज्जता स्थापना च' },
      description: {
        en: 'Rise early and bathe. Clean the puja area. Prepare the Anant Sutra: take a cotton thread, dye it with turmeric or saffron, and tie 14 knots while chanting Vishnu\'s name. Place a Vishnu image or idol on the altar.',
        hi: 'प्रातः उठें और स्नान करें। पूजा स्थल साफ करें। अनन्त सूत्र तैयार करें: सूती धागा लें, हल्दी या केसर से रंगें, और विष्णु नाम का जाप करते हुए 14 गाँठें बाँधें। वेदी पर विष्णु का चित्र या मूर्ति स्थापित करें।',
        sa: 'प्रभाते उत्थाय स्नायात्। पूजास्थलं शोधयेत्। अनन्तसूत्रं सज्जयेत्: कार्पाससूत्रं गृहीत्वा हरिद्रया कुङ्कुमेन वा रञ्जयेत्, विष्णुनामजपेन चतुर्दशग्रन्थीः बध्नीयात्। वेद्यां विष्णोः चित्रं प्रतिमां वा स्थापयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Anant Vrat Katha', hi: 'अनन्त व्रत कथा', sa: 'अनन्तव्रतकथा' },
      description: {
        en: 'Listen to or recite the Anant Chaturdashi Vrat Katha, which narrates the story of Lord Krishna advising Yudhishthira to observe this vrat, and the tale of King Sumanta and Queen Sushila who regained their lost prosperity through this vrat.',
        hi: 'अनन्त चतुर्दशी व्रत कथा सुनें या पढ़ें, जिसमें भगवान कृष्ण द्वारा युधिष्ठिर को यह व्रत करने का उपदेश और राजा सुमन्त तथा रानी सुशीला की कथा है, जिन्होंने इस व्रत से अपनी खोई हुई समृद्धि पुनः प्राप्त की।',
        sa: 'अनन्तचतुर्दशीव्रतकथां शृणुयात् पठेत् वा, यत्र श्रीकृष्णेन युधिष्ठिराय एतद्व्रतस्य उपदेशः राज्ञः सुमन्तस्य राज्ञ्याः सुशीलायाश्च कथा च वर्णिता, ये एतद्व्रतेन स्वां नष्टसमृद्धिं पुनः प्राप्तवन्तौ।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 3,
      title: { en: 'Anant Sutra Puja', hi: 'अनन्त सूत्र पूजा', sa: 'अनन्तसूत्रपूजनम्' },
      description: {
        en: 'Worship the 14-knot Anant Sutra by applying sandalwood paste, kumkum, and akshat to it. Offer flowers and incense. The 14 knots represent the 14 lokas (worlds) sustained by Lord Vishnu in His infinite form.',
        hi: 'अनन्त सूत्र (14 गाँठों वाले) की पूजा चन्दन, कुमकुम और अक्षत लगाकर करें। फूल और अगरबत्ती अर्पित करें। 14 गाँठें भगवान विष्णु के अनन्त स्वरूप द्वारा धारित 14 लोकों का प्रतिनिधित्व करती हैं।',
        sa: 'चतुर्दशग्रन्थियुक्तस्य अनन्तसूत्रस्य चन्दनं कुङ्कुमम् अक्षतांश्च लेपयित्वा पूजयेत्। पुष्पाणि धूपं चार्पयेत्। चतुर्दशग्रन्थयः श्रीविष्णोः अनन्तस्वरूपेण धृतानां चतुर्दशलोकानां प्रतिनिधयः।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Tying the Anant Sutra', hi: 'अनन्त सूत्र बाँधना', sa: 'अनन्तसूत्रबन्धनम्' },
      description: {
        en: 'Tie the sacred Anant Sutra on the right wrist (men) or left wrist (women) while chanting the Anant mantra. This thread is worn for 14 days and then immersed in water. It symbolizes the devotee\'s bond with the infinite Lord.',
        hi: 'अनन्त मन्त्र का जाप करते हुए पवित्र अनन्त सूत्र दाहिने हाथ की कलाई (पुरुष) या बाएँ हाथ की कलाई (स्त्री) पर बाँधें। यह धागा 14 दिन पहना जाता है और फिर जल में विसर्जित किया जाता है। यह भक्त के अनन्त भगवान से बन्धन का प्रतीक है।',
        sa: 'अनन्तमन्त्रजपेन पवित्रम् अनन्तसूत्रं दक्षिणमणिबन्धे (पुंसां) वाममणिबन्धे (स्त्रीणां) वा बध्नीयात्। एतत् सूत्रं चतुर्दशदिनानि धार्यते ततो जले विसृज्यते। एतद् भक्तस्य अनन्तभगवता सह बन्धनस्य प्रतीकम्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Ganesh Visarjan Preparation', hi: 'गणेश विसर्जन की तैयारी', sa: 'गणेशविसर्जनसज्जा' },
      description: {
        en: 'Perform final aarti of Lord Ganesha. Offer modak and sweets. Apply kumkum tilak to the idol. Pray for Ganesha\'s return next year. Chant "Ganapati Bappa Morya, Pudchya Varshi Lavkar Ya" (O Lord Ganesha, come again early next year).',
        hi: 'भगवान गणेश की अन्तिम आरती करें। मोदक और मिठाई अर्पित करें। मूर्ति पर कुमकुम तिलक लगाएँ। अगले वर्ष गणेश जी के पुनरागमन की प्रार्थना करें। "गणपति बप्पा मोरया, पुढच्या वर्षी लवकर या" का जयकारा करें।',
        sa: 'श्रीगणेशस्य अन्तिमाम् आरतिं कुर्यात्। मोदकानि मिष्टान्नानि चार्पयेत्। प्रतिमायां कुङ्कुमतिलकं कुर्यात्। आगामिवर्षे गणेशस्य पुनरागमनाय प्रार्थयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Ganesh Visarjan (Immersion)', hi: 'गणेश विसर्जन (जलमग्न)', sa: 'गणेशविसर्जनम् (जलनिमज्जनम्)' },
      description: {
        en: 'Take the Ganesha idol in a procession with music, chanting, and dancing to a water body (river, lake, sea, or a prepared tank). Immerse the idol gently with devotion. Use eco-friendly idols and minimize water pollution. After visarjan, return home and do not look back.',
        hi: 'गणेश मूर्ति को संगीत, जयकारों और नृत्य के साथ शोभायात्रा में जल स्रोत (नदी, झील, सागर या तैयार टंकी) तक ले जाएँ। भक्तिपूर्वक मूर्ति को धीरे से विसर्जित करें। पर्यावरण अनुकूल मूर्तियों का प्रयोग करें। विसर्जन के बाद पीछे मुड़कर न देखें।',
        sa: 'गणेशप्रतिमां सङ्गीतजयकारनृत्ययुक्तया शोभायात्रया जलाशयं (नदीं सरोवरं समुद्रं वा सज्जितकुण्डं) प्रति नयेत्। भक्त्या मन्दं प्रतिमां जले निमज्जयेत्। पर्यावरणानुकूलप्रतिमाः उपयोजयेत्। विसर्जनानन्तरं पृष्ठतो न पश्येत्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'anant-vishnu',
      name: { en: 'Anant Vishnu Mantra', hi: 'अनन्त विष्णु मन्त्र', sa: 'अनन्तविष्णुमन्त्रः' },
      devanagari: 'ॐ नमो भगवते वासुदेवाय\nअनन्ताय सहस्रशीर्षाय\nक्षीरोदशायिने नमः॥',
      iast: 'oṃ namo bhagavate vāsudevāya\nanantāya sahasraśīrṣāya\nkṣīrodaśāyine namaḥ ||',
      meaning: {
        en: 'Obeisance to Lord Vasudeva, the infinite one with a thousand heads, who reclines on the ocean of milk.',
        hi: 'भगवान वासुदेव को नमस्कार, जो अनन्त हैं, सहस्र शीर्ष वाले हैं, जो क्षीरसागर पर शयन करते हैं।',
        sa: 'भगवते वासुदेवाय नमः, यः अनन्तः सहस्रशीर्षः क्षीरोदधौ शेते।',
      },
      japaCount: 14,
      usage: { en: 'Chant 14 times while tying each knot of the Anant Sutra', hi: 'अनन्त सूत्र की प्रत्येक गाँठ बाँधते समय 14 बार जपें', sa: 'अनन्तसूत्रस्य प्रतिग्रन्थिबन्धनकाले चतुर्दशवारं जपेत्' },
    },
    {
      id: 'anant-ganesh-visarjan',
      name: { en: 'Ganesh Visarjan Mantra', hi: 'गणेश विसर्जन मन्त्र', sa: 'गणेशविसर्जनमन्त्रः' },
      devanagari: 'यान्तु देवगणाः सर्वे पूजामादाय मामकीम्।\nइष्टकामसमृद्ध्यर्थं पुनरागमनाय च॥',
      iast: 'yāntu devagaṇāḥ sarve pūjāmādāya māmakīm |\niṣṭakāmasamṛddhyarthaṃ punarāgamanāya ca ||',
      meaning: {
        en: 'May all the divine hosts depart, accepting my worship, for the fulfilment of desires and prosperity, and may they return again.',
        hi: 'सभी देवगण मेरी पूजा स्वीकार कर जाएँ, इच्छाओं और समृद्धि की पूर्ति के लिए, और पुनः आगमन करें।',
        sa: 'सर्वे देवगणाः मामकीं पूजामादाय गच्छन्तु, इष्टकामसमृद्ध्यर्थं पुनरागमनाय च।',
      },
      japaCount: 1,
      usage: { en: 'Recite at the time of Ganesh idol immersion', hi: 'गणेश मूर्ति विसर्जन के समय पाठ करें', sa: 'गणेशप्रतिमाविसर्जनकाले पठेत्' },
    },
  ],

  visarjan: {
    en: 'The Ganesh idol is immersed in water with full devotion and festive farewell. The Anant Sutra is worn for 14 days and then immersed in flowing water. Both immersions symbolize the return of the divine to the universal consciousness.',
    hi: 'गणेश मूर्ति का पूर्ण भक्ति और उत्सवपूर्ण विदाई के साथ जल में विसर्जन किया जाता है। अनन्त सूत्र 14 दिन पहनकर बहते जल में विसर्जित किया जाता है। दोनों विसर्जन दिव्यता की सार्वभौमिक चेतना में वापसी का प्रतीक हैं।',
    sa: 'गणेशप्रतिमा पूर्णभक्त्या उत्सवपूर्णविदायेन जले विसृज्यते। अनन्तसूत्रं चतुर्दशदिनानि धृत्वा प्रवाहजले विसृज्यते। उभे विसर्जने दैवत्वस्य सार्वभौमचैतन्ये प्रत्यागमनस्य प्रतीके।',
  },

  naivedya: {
    en: 'Offer 14 types of fruits representing the 14 lokas, along with modak and laddoo for Lord Ganesha. Kheer (rice pudding), seasonal fruits, and sweets are offered to Lord Anant (Vishnu).',
    hi: '14 लोकों का प्रतिनिधित्व करते हुए 14 प्रकार के फल अर्पित करें, साथ ही भगवान गणेश के लिए मोदक और लड्डू। भगवान अनन्त (विष्णु) को खीर, मौसमी फल और मिठाई अर्पित करें।',
    sa: 'चतुर्दशलोकानां प्रतिनिधित्वेन चतुर्दशप्रकारकफलानि अर्पयेत्, श्रीगणेशाय मोदकानि लड्डूकानि च। श्रीअनन्ताय (विष्णवे) क्षीरान्नं ऋतुफलानि मिष्टान्नानि चार्पयेत्।',
  },

  precautions: [
    {
      en: 'Use eco-friendly Ganesha idols made of natural clay. Avoid Plaster-of-Paris idols that pollute water bodies.',
      hi: 'प्राकृतिक मिट्टी से बनी पर्यावरण अनुकूल गणेश मूर्तियों का उपयोग करें। प्लास्टर ऑफ पेरिस की मूर्तियों से बचें जो जल स्रोतों को प्रदूषित करती हैं।',
      sa: 'प्राकृतिकमृत्तिकानिर्मिताः पर्यावरणानुकूलगणेशप्रतिमाः उपयोजयेत्। जलाशयप्रदूषणकारिणीः चूर्णप्रतिमाः वर्जयेत्।',
    },
    {
      en: 'The Anant Sutra must be tied with full devotion and the 14 knots made carefully. Do not break the thread once tied.',
      hi: 'अनन्त सूत्र पूर्ण भक्ति से बाँधें और 14 गाँठें सावधानी से लगाएँ। एक बार बाँधने के बाद धागा न तोड़ें।',
      sa: 'अनन्तसूत्रं पूर्णभक्त्या बध्नीयात् चतुर्दशग्रन्थीः सावधानेन कुर्यात्। एकवारं बद्धं सूत्रं न छिन्द्यात्।',
    },
    {
      en: 'If performing vrat, maintain strict fast and avoid tamasic food. The vrat is observed for 14 consecutive years for full phala.',
      hi: 'यदि व्रत कर रहे हैं तो कड़ा उपवास रखें और तामसिक भोजन से बचें। पूर्ण फल के लिए व्रत लगातार 14 वर्षों तक रखा जाता है।',
      sa: 'यदि व्रतं करोति तर्हि कठोरम् उपवासं पालयेत् तामसिकाहारं वर्जयेत्। पूर्णफलाय व्रतं चतुर्दशवर्षाणि निरन्तरं पाल्यते।',
    },
  ],

  phala: {
    en: 'Anant Chaturdashi bestows infinite (anant) blessings of Lord Vishnu. The 14-year vrat grants unending prosperity, removal of poverty and suffering, and ultimately moksha. The Ganesh Visarjan teaches the spiritual lesson of non-attachment — welcoming the divine with joy and releasing with equal grace.',
    hi: 'अनन्त चतुर्दशी भगवान विष्णु का अनन्त (असीम) आशीर्वाद प्रदान करती है। 14 वर्ष का व्रत अनन्त समृद्धि, दरिद्रता और दुःख का निवारण, और अन्ततः मोक्ष प्रदान करता है। गणेश विसर्जन वैराग्य का आध्यात्मिक पाठ सिखाता है — दिव्यता का हर्षपूर्वक स्वागत और समान कृपा से विदाई।',
    sa: 'अनन्तचतुर्दशी श्रीविष्णोः अनन्तम् (असीमम्) आशीर्वादं ददाति। चतुर्दशवर्षव्रतं अनन्तसमृद्धिं दारिद्र्यदुःखनिवारणं मोक्षं च ददाति। गणेशविसर्जनं वैराग्यस्य आध्यात्मिकशिक्षां ददाति — दैवत्वस्य हर्षपूर्वकं स्वागतं समानकृपया विदापनं च।',
  },
};
