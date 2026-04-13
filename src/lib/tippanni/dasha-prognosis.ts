import type { LocaleText } from '@/types/panchang';
/**
 * Dasha Prognosis Engine — layered text generation for divisional chart analysis
 * Combines planet nature, domain affinity, and house effects for ~1500 unique combinations
 * Reference: BPHS, Phaladeepika, Jataka Parijata, Saravali
 */

type Bi = LocaleText;

// ─── Layer 1: Planet Dasha Lord Nature ──────────────────────────────────────

const PLANET_DASHA_NATURE: Record<number, Bi> = {
  0: {
    en: 'Sun periods activate authority, self-expression, government dealings, father-related matters, and vitality. The Sun illuminates whichever domain it touches, bringing clarity but also scrutiny and heat.',
    hi: 'सूर्य काल अधिकार, आत्म-अभिव्यक्ति, सरकारी कार्य, पिता-संबंधी विषय और जीवन शक्ति सक्रिय करता है। सूर्य जिस क्षेत्र को स्पर्श करता है उसे प्रकाशित करता है।',
  },
  1: {
    en: 'Moon periods bring emotional processing, public dealings, mother-related themes, nurturing activities, and fluctuation. The Moon\'s influence makes this domain more sensitive to moods and public perception.',
    hi: 'चन्द्र काल भावनात्मक प्रक्रिया, जनसंपर्क, मातृ-विषय, पोषण गतिविधियां और उतार-चढ़ाव लाता है। चन्द्र प्रभाव इस क्षेत्र को मनोदशा और जन धारणा के प्रति संवेदनशील बनाता है।',
  },
  2: {
    en: 'Mars periods ignite action, competition, courage, and conflict. Energy levels surge but so does impatience. Mars demands bold moves and rewards initiative, but rash decisions can backfire. Physical vitality and drive are heightened.',
    hi: 'मंगल काल कर्म, प्रतिस्पर्धा, साहस और संघर्ष को प्रज्वलित करता है। ऊर्जा बढ़ती है पर अधैर्य भी। मंगल साहसिक कदमों की मांग करता है और पहल को पुरस्कृत करता है, परंतु जल्दबाजी हानिकारक हो सकती है।',
  },
  3: {
    en: 'Mercury periods activate intellect, communication, commerce, analytical thinking, and learning. This is a time for negotiation, writing, education, and diversifying income streams. Adaptability is key.',
    hi: 'बुध काल बुद्धि, संवाद, वाणिज्य, विश्लेषणात्मक चिंतन और शिक्षा को सक्रिय करता है। यह बातचीत, लेखन, शिक्षा और आय विविधीकरण का समय है। अनुकूलता कुंजी है।',
  },
  4: {
    en: 'Jupiter periods bring expansion, wisdom, dharmic growth, teaching, and grace. This is generally the most benevolent period, bringing opportunities for learning, spiritual growth, and increase in fortune. Children and guru-related matters come into focus.',
    hi: 'गुरु काल विस्तार, ज्ञान, धार्मिक विकास, शिक्षण और कृपा लाता है। यह सामान्यतः सबसे शुभ काल है, शिक्षा, आध्यात्मिक विकास और भाग्य वृद्धि के अवसर लाता है। संतान और गुरु-संबंधी विषय केन्द्र में।',
  },
  5: {
    en: 'Venus periods bring relationships, creativity, luxury, partnerships, and artistic expression. Material comforts increase, romantic relationships intensify, and aesthetic sensibilities are heightened. Diplomatic skills are rewarded.',
    hi: 'शुक्र काल संबंध, रचनात्मकता, विलासिता, साझेदारी और कलात्मक अभिव्यक्ति लाता है। भौतिक सुख बढ़ते हैं, रोमांटिक संबंध गहराते हैं, और सौंदर्य संवेदना तीव्र होती है।',
  },
  6: {
    en: 'Saturn periods demand discipline, patience, and hard work. Results come slowly but are enduring. This period tests commitment and rewards perseverance. Karmic debts may surface for resolution. Structure and responsibility define this time.',
    hi: 'शनि काल अनुशासन, धैर्य और कठिन परिश्रम की मांग करता है। परिणाम धीरे आते हैं पर स्थायी होते हैं। यह काल प्रतिबद्धता की परीक्षा लेता है और दृढ़ता को पुरस्कृत करता है। कार्मिक ऋण समाधान के लिए सामने आ सकते हैं।',
  },
  7: {
    en: 'Rahu periods create intense desire, unconventional approaches, foreign connections, and obsessive focus. Sudden opportunities and unexpected turns are hallmarks. Technology, foreign lands, and breaking social norms feature prominently.',
    hi: 'राहु काल तीव्र इच्छा, अपरंपरागत दृष्टिकोण, विदेशी संबंध और जुनूनी ध्यान उत्पन्न करता है। अचानक अवसर और अप्रत्याशित मोड़ इसकी पहचान हैं। प्रौद्योगिकी, विदेश और सामाजिक मानदंडों का उल्लंघन प्रमुख।',
  },
  8: {
    en: 'Ketu periods bring spiritual insight, detachment, and dissolution of material attachments. Past life karma surfaces strongly. This is a time for inward focus, meditation, and letting go of what no longer serves growth.',
    hi: 'केतु काल आध्यात्मिक अंतर्दृष्टि, वैराग्य और भौतिक आसक्तियों का विघटन लाता है। पूर्वजन्म कर्म प्रबलता से सामने आता है। यह अंतर्मुखी ध्यान और जो विकास में सहायक नहीं उसे छोड़ने का समय है।',
  },
};

// ─── Layer 2: Planet-Domain Affinity (notable karaka relationships) ─────────

const PLANET_DOMAIN_AFFINITY: Record<string, Record<number, Bi>> = {
  D9: {
    5: {
      en: 'Venus is the natural karaka of marriage and D9 — this is an exceptionally potent combination for romantic and marital developments.',
      hi: 'शुक्र विवाह और D9 का प्राकृतिक कारक है — यह रोमांटिक और वैवाहिक विकास के लिए असाधारण रूप से शक्तिशाली संयोग है।',
    },
    4: {
      en: 'Jupiter as karaka of dharma activates the highest potential of D9 — spiritual marriage, dharmic partnerships, and blessed unions.',
      hi: 'गुरु धर्म के कारक के रूप में D9 की सर्वोच्च क्षमता सक्रिय करता है — आध्यात्मिक विवाह, धार्मिक साझेदारी और शुभ बंधन।',
    },
    7: {
      en: 'Rahu in D9 brings unconventional partnerships — inter-cultural marriage, sudden romantic encounters, and breaking traditional relationship norms.',
      hi: 'राहु D9 में अपरंपरागत साझेदारी लाता है — अंतर-सांस्कृतिक विवाह, अचानक रोमांटिक मुलाकात और पारंपरिक संबंध मानदंडों का उल्लंघन।',
    },
  },
  D10: {
    0: {
      en: 'Sun is the natural significator of authority and career — its period in D10 amplifies professional ambition, government dealings, and leadership roles.',
      hi: 'सूर्य अधिकार और करियर का प्राकृतिक कारक है — D10 में इसका काल व्यावसायिक महत्वाकांक्षा, सरकारी कार्य और नेतृत्व भूमिकाओं को बढ़ाता है।',
    },
    6: {
      en: 'Saturn as the planet of labor and D10 as career chart — this combination demands hard work but guarantees enduring professional achievements.',
      hi: 'शनि श्रम का ग्रह और D10 करियर चार्ट — यह संयोग कठिन परिश्रम की मांग करता है पर स्थायी व्यावसायिक उपलब्धियों की गारंटी देता है।',
    },
    2: {
      en: 'Mars brings competitive fire to D10 — expect aggressive career moves, rivalry with colleagues, and bold professional risks.',
      hi: 'मंगल D10 में प्रतिस्पर्धात्मक अग्नि लाता है — आक्रामक करियर कदम, सहकर्मियों से प्रतिद्वंद्विता और साहसिक व्यावसायिक जोखिम अपेक्षित।',
    },
    4: {
      en: 'Jupiter in D10 brings wisdom to career decisions — promotions through merit, ethical business expansion, and respect from superiors.',
      hi: 'गुरु D10 में करियर निर्णयों में बुद्धिमत्ता लाता है — योग्यता से पदोन्नति, नैतिक व्यावसायिक विस्तार और वरिष्ठों से सम्मान।',
    },
    3: {
      en: 'Mercury in D10 activates communication-based careers — writing, trading, consulting, and intellectual professions gain momentum.',
      hi: 'बुध D10 में संवाद-आधारित करियर सक्रिय करता है — लेखन, व्यापार, परामर्श और बौद्धिक व्यवसायों में गति आती है।',
    },
  },
  D7: {
    4: {
      en: 'Jupiter is the putra karaka (significator of children) — its period in D7 is the strongest indicator of progeny-related developments.',
      hi: 'गुरु पुत्र कारक है — D7 में इसका काल संतान-संबंधी विकास का सबसे सशक्त सूचक है।',
    },
    1: {
      en: 'Moon as the nourishing planet in D7 activates emotional bonding with children, fertility, and maternal instincts.',
      hi: 'चन्द्र पोषण ग्रह के रूप में D7 में संतान से भावनात्मक बंधन, प्रजनन क्षमता और मातृ सहज ज्ञान सक्रिय करता है।',
    },
    5: {
      en: 'Venus in D7 brings joy through children, creative expression in parenting, and harmonious family expansion.',
      hi: 'शुक्र D7 में संतान से आनंद, पालन-पोषण में रचनात्मक अभिव्यक्ति और सामंजस्यपूर्ण पारिवारिक विस्तार लाता है।',
    },
  },
  D2: {
    5: {
      en: 'Venus governs luxury and D2 governs wealth — financial prosperity through artistic, creative, or relationship-driven income is highlighted.',
      hi: 'शुक्र विलासिता का स्वामी और D2 धन का — कलात्मक, रचनात्मक या संबंध-आधारित आय से वित्तीय समृद्धि प्रमुख है।',
    },
    4: {
      en: 'Jupiter expands wealth in D2 — ethical earning, investment growth, and financial wisdom prevail.',
      hi: 'गुरु D2 में धन का विस्तार करता है — नैतिक कमाई, निवेश वृद्धि और वित्तीय बुद्धिमत्ता प्रबल।',
    },
    6: {
      en: 'Saturn in D2 builds wealth slowly through sustained effort — expect delayed but lasting financial security through disciplined saving.',
      hi: 'शनि D2 में निरंतर प्रयास से धीरे-धीरे धन निर्माण करता है — अनुशासित बचत से विलंबित पर स्थायी वित्तीय सुरक्षा अपेक्षित।',
    },
    7: {
      en: 'Rahu in D2 creates sudden wealth gains through unconventional means — technology, foreign income, and speculative ventures.',
      hi: 'राहु D2 में अपरंपरागत साधनों से अचानक धन लाभ उत्पन्न करता है — प्रौद्योगिकी, विदेशी आय और सट्टा उपक्रम।',
    },
  },
  D20: {
    8: {
      en: 'Ketu is the moksha karaka in D20 — this is the most powerful combination for genuine spiritual breakthroughs.',
      hi: 'केतु D20 में मोक्ष कारक है — यह वास्तविक आध्यात्मिक सफलता के लिए सबसे शक्तिशाली संयोग है।',
    },
    4: {
      en: 'Jupiter as the guru planet in the spiritual chart D20 — expect deep spiritual learning, initiation, and progress in meditation.',
      hi: 'गुरु आध्यात्मिक चार्ट D20 में गुरु ग्रह के रूप में — गहन आध्यात्मिक शिक्षा, दीक्षा और ध्यान में प्रगति अपेक्षित।',
    },
    0: {
      en: 'Sun in D20 illuminates the spiritual path — connection with divine authority, temple worship, and solar meditation practices.',
      hi: 'सूर्य D20 में आध्यात्मिक मार्ग को प्रकाशित करता है — दिव्य सत्ता से संबंध, मंदिर पूजा और सूर्य ध्यान साधना।',
    },
    1: {
      en: 'Moon in D20 deepens devotional practices — bhakti, emotional surrender to the divine, and intuitive spiritual experiences.',
      hi: 'चन्द्र D20 में भक्ति साधना को गहरा करता है — भक्ति, ईश्वर के प्रति भावनात्मक समर्पण और सहज आध्यात्मिक अनुभव।',
    },
  },
  D24: {
    3: {
      en: 'Mercury is the planet of education in D24 — intellectual achievements, degrees, publications, and learning breakthroughs are strongly indicated.',
      hi: 'बुध D24 में शिक्षा का ग्रह है — बौद्धिक उपलब्धियां, उपाधियां, प्रकाशन और शिक्षा में सफलता प्रबलता से संकेतित।',
    },
    4: {
      en: 'Jupiter in D24 bestows higher learning — advanced degrees, philosophical wisdom, and teaching abilities are strongly activated.',
      hi: 'गुरु D24 में उच्च शिक्षा प्रदान करता है — उन्नत उपाधियां, दार्शनिक ज्ञान और शिक्षण क्षमता प्रबलता से सक्रिय।',
    },
    7: {
      en: 'Rahu in D24 drives unconventional learning — foreign education, technology-based skills, and breaking academic boundaries.',
      hi: 'राहु D24 में अपरंपरागत शिक्षा की ओर प्रेरित करता है — विदेशी शिक्षा, प्रौद्योगिकी-आधारित कौशल और शैक्षणिक सीमाओं का उल्लंघन।',
    },
  },
  D12: {
    1: {
      en: 'Moon represents the mother in D12 — maternal relationships, family nurturing, and ancestral connections are deeply activated.',
      hi: 'चन्द्र D12 में माता का प्रतिनिधित्व करता है — मातृ संबंध, पारिवारिक पोषण और पूर्वज संबंध गहराई से सक्रिय।',
    },
    0: {
      en: 'Sun represents the father in D12 — paternal relationships, legacy issues, and inherited authority come into focus.',
      hi: 'सूर्य D12 में पिता का प्रतिनिधित्व करता है — पितृ संबंध, विरासत के मुद्दे और विरासत में मिला अधिकार केंद्र में।',
    },
    6: {
      en: 'Saturn in D12 reveals karmic debts toward parents — responsibilities toward aging parents and ancestral obligations surface.',
      hi: 'शनि D12 में माता-पिता के प्रति कार्मिक ऋण दर्शाता है — वृद्ध माता-पिता और पूर्वज दायित्वों की जिम्मेदारी सामने आती है।',
    },
  },
  D4: {
    5: {
      en: 'Venus in D4 brings comfort, beautiful properties, and luxurious living conditions.',
      hi: 'शुक्र D4 में सुख, सुंदर संपत्ति और विलासितापूर्ण जीवन स्थिति लाता है।',
    },
    2: {
      en: 'Mars in D4 can indicate disputes over property but also courage to acquire new real estate.',
      hi: 'मंगल D4 में संपत्ति विवाद का संकेत दे सकता है पर नई अचल संपत्ति अर्जित करने का साहस भी।',
    },
    4: {
      en: 'Jupiter in D4 blesses with ancestral property, fortunate real estate deals, and a spiritually charged home.',
      hi: 'गुरु D4 में पैतृक संपत्ति, भाग्यशाली रियल एस्टेट सौदे और आध्यात्मिक रूप से ऊर्जावान गृह का आशीर्वाद देता है।',
    },
  },
  D16: {
    5: {
      en: 'Venus as the planet of luxury in D16 — acquisition of vehicles, comforts, and aesthetic pleasures.',
      hi: 'शुक्र D16 में विलासिता का ग्रह — वाहन, सुख-सुविधा और सौंदर्य आनंद की प्राप्ति।',
    },
    2: {
      en: 'Mars in D16 indicates powerful vehicles, mechanical aptitude, and adventurous use of conveyances.',
      hi: 'मंगल D16 में शक्तिशाली वाहन, यांत्रिक योग्यता और साहसिक वाहन उपयोग दर्शाता है।',
    },
  },
  D3: {
    2: {
      en: 'Mars is the natural significator of courage and D3 governs siblings and initiative — expect bold moves and activation of sibling relationships.',
      hi: 'मंगल साहस का प्राकृतिक कारक है और D3 सहोदर और पहल को नियंत्रित करता है — साहसिक कदम और सहोदर संबंधों की सक्रियता अपेक्षित।',
    },
    3: {
      en: 'Mercury in D3 enhances communication with siblings, short travels, and artistic self-expression through writing or media.',
      hi: 'बुध D3 में सहोदरों से संवाद, लघु यात्रा और लेखन या मीडिया के माध्यम से कलात्मक आत्म-अभिव्यक्ति बढ़ाता है।',
    },
  },
  D6: {
    2: {
      en: 'Mars is the fighter in the chart of enemies and disease — victory over opponents, successful surgeries, and competitive triumph.',
      hi: 'मंगल शत्रु और रोग के चार्ट में योद्धा है — विरोधियों पर विजय, सफल शल्य चिकित्सा और प्रतिस्पर्धात्मक विजय।',
    },
    6: {
      en: 'Saturn in D6 creates chronic but manageable challenges — persistent health issues require lifestyle discipline.',
      hi: 'शनि D6 में दीर्घकालिक पर प्रबंधनीय चुनौतियां उत्पन्न करता है — स्थायी स्वास्थ्य समस्याओं के लिए जीवनशैली अनुशासन आवश्यक।',
    },
    4: {
      en: 'Jupiter in D6 protects against disease and enemies — divine grace neutralizes adversaries and promotes recovery.',
      hi: 'गुरु D6 में रोग और शत्रुओं से रक्षा करता है — दैवीय कृपा विरोधियों को निष्प्रभ करती है और स्वस्थता को बढ़ावा देती है।',
    },
  },
  D8: {
    6: {
      en: 'Saturn as the ayushkaraka in D8 — longevity questions, insurance matters, and deep karmic processing.',
      hi: 'शनि D8 में आयुष्कारक के रूप में — दीर्घायु प्रश्न, बीमा मामले और गहन कार्मिक प्रसंस्करण।',
    },
    2: {
      en: 'Mars in D8 indicates sudden transformations, surgical interventions, and intense regenerative experiences.',
      hi: 'मंगल D8 में अचानक परिवर्तन, शल्य हस्तक्षेप और तीव्र पुनर्जनन अनुभव दर्शाता है।',
    },
  },
  D30: {
    7: {
      en: 'Rahu in D30 can expose the native to deception, hidden enemies, and unexpected troubles — heightened vigilance required.',
      hi: 'राहु D30 में जातक को छल, छिपे शत्रुओं और अप्रत्याशित कष्टों के प्रति उजागर कर सकता है — अतिरिक्त सतर्कता आवश्यक।',
    },
    6: {
      en: 'Saturn in D30 reveals karmic suffering that requires patient endurance — the path through hardship builds unshakable character.',
      hi: 'शनि D30 में कार्मिक कष्ट दर्शाता है जिसके लिए धैर्यपूर्ण सहनशीलता आवश्यक — कठिनाई का मार्ग अटल चरित्र बनाता है।',
    },
  },
  D60: {
    4: {
      en: 'Jupiter in D60 confirms overall karmic merit — past life blessings manifest in multiple life areas.',
      hi: 'गुरु D60 में समग्र कार्मिक पुण्य की पुष्टि करता है — पूर्वजन्म के आशीर्वाद जीवन के अनेक क्षेत्रों में प्रकट।',
    },
    6: {
      en: 'Saturn in D60 indicates past life karmic debts requiring patient resolution — the lessons are demanding but transformative.',
      hi: 'शनि D60 में पूर्वजन्म कार्मिक ऋण दर्शाता है जिसके लिए धैर्यपूर्ण समाधान आवश्यक — पाठ कठिन पर परिवर्तनकारी हैं।',
    },
    8: {
      en: 'Ketu in D60 shows culmination of past life spiritual efforts — mystical experiences, sudden liberation from karmic bonds.',
      hi: 'केतु D60 में पूर्वजन्म आध्यात्मिक प्रयासों की परिणति दर्शाता है — रहस्यमय अनुभव, कार्मिक बंधनों से अचानक मुक्ति।',
    },
  },
  D1: {
    0: {
      en: 'Sun as dasha lord in D1 brings the self into sharp focus — leadership, health, and personal identity undergo significant transformation.',
      hi: 'सूर्य D1 में दशा स्वामी के रूप में आत्म को तीव्र केंद्र में लाता है — नेतृत्व, स्वास्थ्य और व्यक्तिगत पहचान में महत्वपूर्ण परिवर्तन।',
    },
    1: {
      en: 'Moon as dasha lord in D1 makes emotions, mental health, and public image central themes — expect changes in residence, travel, and emotional landscape.',
      hi: 'चन्द्र D1 में दशा स्वामी के रूप में भावनाओं, मानसिक स्वास्थ्य और सार्वजनिक छवि को केंद्रीय विषय बनाता है।',
    },
  },
  BC: {
    0: {
      en: 'Sun in Bhav Chalit activating true house positions — the actual influence on authority and career is revealed beyond sign-based placement.',
      hi: 'सूर्य भाव चलित में वास्तविक भाव स्थिति सक्रिय करता है — अधिकार और करियर पर वास्तविक प्रभाव राशि-आधारित स्थिति से परे।',
    },
  },
  D5: {
    0: {
      en: 'Sun in D5 activates fame, recognition, and the fruition of past meritorious deeds — public honor and dignity are highlighted.',
      hi: 'सूर्य D5 में यश, मान्यता और पूर्व पुण्य कर्मों का फल सक्रिय करता है — सार्वजनिक सम्मान और प्रतिष्ठा प्रमुख।',
    },
    4: {
      en: 'Jupiter in D5 maximizes spiritual merit — divine blessings, fame through wisdom, and recognition of dharmic living.',
      hi: 'गुरु D5 में आध्यात्मिक पुण्य को अधिकतम करता है — दिव्य आशीर्वाद, ज्ञान से यश और धार्मिक जीवन की मान्यता।',
    },
  },
  D27: {
    2: {
      en: 'Mars in D27 maximizes physical strength, athletic ability, and fighting stamina — peak vitality period.',
      hi: 'मंगल D27 में शारीरिक बल, खेल क्षमता और लड़ाकू सहनशक्ति को अधिकतम करता है — चरम ओज काल।',
    },
    0: {
      en: 'Sun in D27 energizes core vitality and willpower — physical health and inner strength peak during this period.',
      hi: 'सूर्य D27 में मूल ओज और इच्छाशक्ति को ऊर्जा देता है — इस काल में शारीरिक स्वास्थ्य और आंतरिक बल चरम पर।',
    },
  },
};

// ─── Layer 3: House-in-Domain Effects ───────────────────────────────────────

type DomainCategory = 'career' | 'relationship' | 'children' | 'wealth' | 'spiritual' | 'health' | 'education' | 'family' | 'karma';

const CHART_CATEGORY: Record<string, DomainCategory> = {
  D1: 'career', D10: 'career', BC: 'career',
  D9: 'relationship',
  D7: 'children',
  D2: 'wealth', D4: 'wealth', D16: 'wealth',
  D20: 'spiritual', D60: 'spiritual',
  D6: 'health', D8: 'health', D27: 'health',
  D24: 'education',
  D3: 'family', D12: 'family',
  D5: 'karma', D30: 'karma', D40: 'karma', D45: 'karma',
};

const HOUSE_IN_DOMAIN: Record<DomainCategory, Record<number, Bi>> = {
  career: {
    1: {
      en: 'Placed in the 1st house, the dasha lord drives personal branding and self-made professional success — your identity becomes inseparable from your vocation.',
      hi: 'प्रथम भाव में स्थित दशा स्वामी व्यक्तिगत ब्रांडिंग और स्व-निर्मित व्यावसायिक सफलता को प्रेरित करता है — आपकी पहचान आपके व्यवसाय से अभिन्न हो जाती है।',
    },
    2: {
      en: 'In the 2nd house, the focus shifts to income from profession and financial rewards — salary negotiations, raises, and accumulating wealth through career become central.',
      hi: 'द्वितीय भाव में ध्यान व्यवसाय से आय और वित्तीय पुरस्कारों पर केंद्रित होता है — वेतन वार्ता, वृद्धि और करियर से धन संचय केंद्रीय।',
    },
    3: {
      en: 'The 3rd house placement activates business communications, short-term projects, and entrepreneurial courage — writing, marketing, and sales efforts bear fruit.',
      hi: 'तृतीय भाव में स्थिति व्यावसायिक संवाद, अल्पकालिक परियोजनाएं और उद्यमशीलता सक्रिय करती है — लेखन, विपणन और बिक्री प्रयास फलदायी।',
    },
    4: {
      en: 'The 4th house brings work-from-home opportunities, real estate careers, and a deep sense of inner job satisfaction — emotional fulfillment through profession.',
      hi: 'चतुर्थ भाव घर से कार्य के अवसर, रियल एस्टेट करियर और गहरी आंतरिक कार्य संतुष्टि लाता है — व्यवसाय से भावनात्मक पूर्णता।',
    },
    5: {
      en: 'In the 5th house, creative professions, speculative business ventures, and advisory or consulting roles come alive — intelligence drives career growth.',
      hi: 'पंचम भाव में रचनात्मक व्यवसाय, सट्टा व्यापार उपक्रम और सलाहकार भूमिकाएं जीवंत होती हैं — बुद्धि करियर वृद्धि को चालित करती है।',
    },
    6: {
      en: 'The 6th house placement means competition, litigation practice, and service industry excellence — overcoming professional rivals and daily work discipline define this period.',
      hi: 'षष्ठ भाव में स्थिति का अर्थ प्रतिस्पर्धा, मुकदमा प्रथा और सेवा उद्योग उत्कृष्टता — व्यावसायिक प्रतिद्वंद्वियों पर विजय और दैनिक कार्य अनुशासन इस काल की पहचान।',
    },
    7: {
      en: 'From the 7th house, business partnerships, client-facing roles, and collaborative ventures take precedence — success comes through others.',
      hi: 'सप्तम भाव से व्यापार साझेदारी, ग्राहक-सामना भूमिकाएं और सहयोगी उपक्रम प्राथमिकता लेते हैं — सफलता दूसरों के माध्यम से।',
    },
    8: {
      en: 'The 8th house drives research-oriented careers, transformative professional experiences, and work in insurance, occult, or investigative fields.',
      hi: 'अष्टम भाव अनुसंधान-उन्मुख करियर, परिवर्तनकारी व्यावसायिक अनुभव और बीमा, गूढ़ या जांच क्षेत्रों में कार्य को प्रेरित करता है।',
    },
    9: {
      en: 'In the 9th house, international career opportunities, academia, publishing, and legal professions flourish — fortune favors the bold and the learned.',
      hi: 'नवम भाव में अंतरराष्ट्रीय करियर अवसर, शिक्षा जगत, प्रकाशन और कानूनी व्यवसाय फलते-फूलते हैं — भाग्य साहसी और विद्वान का साथ देता है।',
    },
    10: {
      en: 'The 10th house is the zenith of career achievement — peak authority, public office, executive roles, and maximum professional visibility define this transit.',
      hi: 'दशम भाव करियर उपलब्धि का शिखर है — चरम अधिकार, सार्वजनिक पद, कार्यकारी भूमिका और अधिकतम व्यावसायिक दृश्यता इस गोचर की पहचान।',
    },
    11: {
      en: 'From the 11th house, networking gains, corporate profits, and large-scale professional success materialize — ambitions crystallize into tangible achievements.',
      hi: 'एकादश भाव से नेटवर्किंग लाभ, कॉर्पोरेट मुनाफा और बड़े पैमाने पर व्यावसायिक सफलता साकार — महत्वाकांक्षाएं ठोस उपलब्धियों में परिणत।',
    },
    12: {
      en: 'The 12th house indicates foreign employment, behind-the-scenes work, or a significant career transition — endings precede new professional beginnings.',
      hi: 'द्वादश भाव विदेशी रोजगार, पर्दे के पीछे कार्य या महत्वपूर्ण करियर संक्रमण दर्शाता है — अंत नई व्यावसायिक शुरुआत से पहले।',
    },
  },
  relationship: {
    1: {
      en: 'In the 1st house, self-focus within relationships intensifies — personal growth through the partner, and the partner reflecting your own nature back to you.',
      hi: 'प्रथम भाव में संबंधों में आत्म-केंद्रितता तीव्र होती है — साथी के माध्यम से व्यक्तिगत विकास और साथी आपके स्वभाव का दर्पण बनता है।',
    },
    2: {
      en: 'The 2nd house activates family finances through partnership, shared resources, and the partner\'s contribution to household wealth.',
      hi: 'द्वितीय भाव साझेदारी से पारिवारिक वित्त, साझा संसाधन और गृहस्थी धन में साथी का योगदान सक्रिय करता है।',
    },
    3: {
      en: 'From the 3rd house, communication within the relationship becomes central — short travels together, and expressing needs and desires with courage.',
      hi: 'तृतीय भाव से संबंध में संवाद केंद्रीय बनता है — साथ में छोटी यात्रा, और साहस से आवश्यकताओं और इच्छाओं की अभिव्यक्ति।',
    },
    4: {
      en: 'The 4th house brings domestic harmony, emotional bonding, and establishing a shared home — comfort and security in the relationship.',
      hi: 'चतुर्थ भाव घरेलू सामंजस्य, भावनात्मक बंधन और साझा गृह स्थापना लाता है — संबंध में सुख और सुरक्षा।',
    },
    5: {
      en: 'In the 5th house, romantic love blossoms, creative partnerships thrive, and the joy of romance infuses the relationship with playful energy.',
      hi: 'पंचम भाव में रोमांटिक प्रेम खिलता है, रचनात्मक साझेदारी फलती है, और रोमांस का आनंद संबंध में खेलपूर्ण ऊर्जा भरता है।',
    },
    6: {
      en: 'The 6th house brings challenges — disagreements, health issues affecting partnership, and the need for service and adjustment within the relationship.',
      hi: 'षष्ठ भाव चुनौतियां लाता है — असहमति, साझेदारी प्रभावित करने वाली स्वास्थ्य समस्याएं, और संबंध में सेवा और समायोजन की आवश्यकता।',
    },
    7: {
      en: 'The 7th house is the direct marriage and partnership activation zone — new relationships, deepening of existing bonds, and formal commitments are strongly indicated.',
      hi: 'सप्तम भाव विवाह और साझेदारी का प्रत्यक्ष सक्रियण क्षेत्र है — नए संबंध, विद्यमान बंधनों का गहरा होना और औपचारिक प्रतिबद्धता प्रबलता से संकेतित।',
    },
    8: {
      en: 'From the 8th house, deep intimacy, transformative relationship experiences, and processing of shared emotional baggage take center stage.',
      hi: 'अष्टम भाव से गहरी अंतरंगता, परिवर्तनकारी संबंध अनुभव और साझा भावनात्मक बोझ का प्रसंस्करण केंद्र में।',
    },
    9: {
      en: 'The 9th house brings long journeys with the partner, philosophical alignment in marriage, and dharmic growth through the relationship.',
      hi: 'नवम भाव साथी के साथ लंबी यात्रा, विवाह में दार्शनिक सामंजस्य और संबंध के माध्यम से धार्मिक विकास लाता है।',
    },
    10: {
      en: 'In the 10th house, the relationship becomes publicly visible — power couples, professional partnerships, and social status through marriage.',
      hi: 'दशम भाव में संबंध सार्वजनिक रूप से दृश्यमान होता है — शक्ति युगल, व्यावसायिक साझेदारी और विवाह से सामाजिक प्रतिष्ठा।',
    },
    11: {
      en: 'The 11th house fulfills relationship aspirations — wishes regarding partnership materialize, social circles expand, and friendship deepens within marriage.',
      hi: 'एकादश भाव संबंध आकांक्षाओं को पूर्ण करता है — साझेदारी की इच्छाएं साकार, सामाजिक दायरा विस्तृत और विवाह में मित्रता गहरी।',
    },
    12: {
      en: 'The 12th house indicates secret relationships, spiritual union transcending the physical, or dissolution and letting go in partnerships.',
      hi: 'द्वादश भाव गुप्त संबंध, भौतिक से परे आध्यात्मिक मिलन, या साझेदारी में विघटन और त्याग दर्शाता है।',
    },
  },
  children: {
    1: {
      en: 'In the 1st house, parental identity becomes central — your sense of self transforms through the experience of parenthood and nurturing.',
      hi: 'प्रथम भाव में अभिभावक पहचान केंद्रीय बनती है — अभिभावकत्व और पोषण के अनुभव से आपकी आत्म-भावना रूपांतरित।',
    },
    2: {
      en: 'The 2nd house connects children to family wealth — investments for children\'s future, education expenses, and family financial planning.',
      hi: 'द्वितीय भाव संतान को पारिवारिक धन से जोड़ता है — संतान के भविष्य के लिए निवेश, शिक्षा व्यय और पारिवारिक वित्तीय योजना।',
    },
    3: {
      en: 'From the 3rd house, siblings\' role in children\'s lives and short-term efforts for progeny matters become active.',
      hi: 'तृतीय भाव से संतान जीवन में सहोदरों की भूमिका और संतान विषयों में अल्पकालिक प्रयास सक्रिय।',
    },
    4: {
      en: 'The 4th house brings emotional bonding with children, a nurturing home environment, and maternal happiness through progeny.',
      hi: 'चतुर्थ भाव संतान से भावनात्मक बंधन, पोषणकारी गृह वातावरण और संतान से मातृ सुख लाता है।',
    },
    5: {
      en: 'In the 5th house — the natural house of children — conception, birth, creative expression through children, and the joy of progeny are powerfully activated.',
      hi: 'पंचम भाव — संतान का स्वाभाविक भाव — में गर्भधारण, जन्म, संतान से रचनात्मक अभिव्यक्ति और संतान सुख शक्तिशाली रूप से सक्रिय।',
    },
    6: {
      en: 'The 6th house can bring health concerns regarding children or challenges in conceiving — discipline and medical support may be needed.',
      hi: 'षष्ठ भाव संतान स्वास्थ्य चिंता या गर्भधारण में बाधा ला सकता है — अनुशासन और चिकित्सा सहायता आवश्यक हो सकती है।',
    },
    7: {
      en: 'From the 7th house, the partner\'s role in childbearing and decisions about progeny become prominent — joint parenting decisions.',
      hi: 'सप्तम भाव से संतान उत्पत्ति में साथी की भूमिका और संतान निर्णय प्रमुख — संयुक्त अभिभावक निर्णय।',
    },
    8: {
      en: 'The 8th house brings transformative experiences through children — adoption possibilities, difficult pregnancies, or deep karmic bonds with offspring.',
      hi: 'अष्टम भाव संतान से परिवर्तनकारी अनुभव लाता है — गोद लेने की संभावना, कठिन गर्भावस्था या संतान से गहरे कार्मिक बंधन।',
    },
    9: {
      en: 'In the 9th house, children bring fortune and dharmic growth — blessed progeny, children\'s higher education, and spiritual legacy through offspring.',
      hi: 'नवम भाव में संतान भाग्य और धार्मिक विकास लाती है — आशीर्वादित संतान, संतान की उच्च शिक्षा और संतान से आध्यात्मिक विरासत।',
    },
    10: {
      en: 'The 10th house connects children to career — working parents, children following in professional footsteps, and public recognition through progeny.',
      hi: 'दशम भाव संतान को करियर से जोड़ता है — कामकाजी अभिभावक, संतान व्यावसायिक पदचिन्हों पर, और संतान से सार्वजनिक मान्यता।',
    },
    11: {
      en: 'From the 11th house, wishes regarding children are fulfilled — gains through children, elder children\'s success, and expanding family network.',
      hi: 'एकादश भाव से संतान की इच्छाएं पूर्ण — संतान से लाभ, ज्येष्ठ संतान की सफलता और पारिवारिक नेटवर्क का विस्तार।',
    },
    12: {
      en: 'The 12th house indicates children settling abroad, expenses related to children, or spiritual detachment in parental role.',
      hi: 'द्वादश भाव संतान का विदेश बसना, संतान-संबंधी व्यय या अभिभावक भूमिका में आध्यात्मिक वैराग्य दर्शाता है।',
    },
  },
  wealth: {
    1: {
      en: 'In the 1st house, wealth comes through personal effort and self-initiative — you are the primary engine of your financial growth.',
      hi: 'प्रथम भाव में धन व्यक्तिगत प्रयास और आत्म-पहल से आता है — आप अपनी वित्तीय वृद्धि के प्राथमिक इंजन हैं।',
    },
    2: {
      en: 'The 2nd house is the natural house of accumulated wealth — savings grow, family finances stabilize, and valuable assets are acquired.',
      hi: 'द्वितीय भाव संचित धन का स्वाभाविक भाव है — बचत बढ़ती है, पारिवारिक वित्त स्थिर और मूल्यवान संपत्ति अर्जित।',
    },
    3: {
      en: 'From the 3rd house, wealth comes through communication, writing, short trades, and entrepreneurial hustle.',
      hi: 'तृतीय भाव से धन संवाद, लेखन, लघु व्यापार और उद्यमशीलता से आता है।',
    },
    4: {
      en: 'The 4th house brings wealth through real estate, landed property, vehicles, and maternal inheritance.',
      hi: 'चतुर्थ भाव रियल एस्टेट, भूमि संपत्ति, वाहन और मातृ विरासत से धन लाता है।',
    },
    5: {
      en: 'In the 5th house, speculative gains, stock market profits, creative income, and returns from past investments are activated.',
      hi: 'पंचम भाव में सट्टा लाभ, शेयर बाजार मुनाफा, रचनात्मक आय और पूर्व निवेश से प्रतिफल सक्रिय।',
    },
    6: {
      en: 'The 6th house means wealth through service, overcoming financial obstacles, and debt management — income through competitive industries.',
      hi: 'षष्ठ भाव का अर्थ सेवा से धन, वित्तीय बाधाओं पर विजय और ऋण प्रबंधन — प्रतिस्पर्धी उद्योगों से आय।',
    },
    7: {
      en: 'From the 7th house, wealth flows through partnerships, spouse\'s income, and business collaborations.',
      hi: 'सप्तम भाव से धन साझेदारी, पत्नी/पति की आय और व्यापार सहयोग से प्रवाहित।',
    },
    8: {
      en: 'The 8th house brings sudden financial changes — inheritance, insurance payouts, tax benefits, but also unexpected expenses.',
      hi: 'अष्टम भाव अचानक वित्तीय परिवर्तन लाता है — विरासत, बीमा भुगतान, कर लाभ, पर अप्रत्याशित व्यय भी।',
    },
    9: {
      en: 'In the 9th house, fortune smiles on finances — lucky gains, father\'s wealth, income from abroad or higher education.',
      hi: 'नवम भाव में भाग्य वित्त पर मुस्कुराता है — भाग्यशाली लाभ, पिता का धन, विदेश या उच्च शिक्षा से आय।',
    },
    10: {
      en: 'The 10th house means wealth through career achievement, professional recognition leading to financial rewards, and government-related income.',
      hi: 'दशम भाव का अर्थ करियर उपलब्धि से धन, व्यावसायिक मान्यता से वित्तीय पुरस्कार और सरकार-संबंधी आय।',
    },
    11: {
      en: 'From the 11th house — the house of gains — maximum financial benefit, networking profits, and realization of material aspirations.',
      hi: 'एकादश भाव — लाभ भाव — से अधिकतम वित्तीय लाभ, नेटवर्किंग मुनाफा और भौतिक आकांक्षाओं की पूर्ति।',
    },
    12: {
      en: 'The 12th house indicates expenditure, foreign investments, loss followed by regeneration, and spending on spiritual or charitable causes.',
      hi: 'द्वादश भाव व्यय, विदेशी निवेश, हानि के बाद पुनर्जनन और आध्यात्मिक या परोपकारी कार्यों पर खर्च दर्शाता है।',
    },
  },
  spiritual: {
    1: {
      en: 'In the 1st house, spiritual identity awakens — the native becomes visibly drawn to spiritual practices, and the aura reflects inner transformation.',
      hi: 'प्रथम भाव में आध्यात्मिक पहचान जागृत — जातक दृश्य रूप से आध्यात्मिक साधनाओं की ओर आकर्षित, और आभा आंतरिक परिवर्तन प्रतिबिंबित।',
    },
    2: {
      en: 'The 2nd house connects spiritual growth to sacred speech — mantra practice, chanting, and the power of spoken word in devotion.',
      hi: 'द्वितीय भाव आध्यात्मिक विकास को पवित्र वाणी से जोड़ता है — मंत्र साधना, जप और भक्ति में उच्चारित शब्द की शक्ति।',
    },
    3: {
      en: 'From the 3rd house, spiritual courage manifests — pilgrimage, writing about spiritual experiences, and communicating wisdom to others.',
      hi: 'तृतीय भाव से आध्यात्मिक साहस प्रकट — तीर्थयात्रा, आध्यात्मिक अनुभवों का लेखन और दूसरों को ज्ञान संप्रेषण।',
    },
    4: {
      en: 'The 4th house deepens inner peace — home becomes a sacred space, meditation reaches the heart, and emotional devotion intensifies.',
      hi: 'चतुर्थ भाव आंतरिक शांति को गहरा करता है — गृह पवित्र स्थान बनता है, ध्यान हृदय तक पहुंचता है और भावनात्मक भक्ति तीव्र।',
    },
    5: {
      en: 'In the 5th house, spiritual intelligence and past-life merit activate — mantra siddhi, divine inspiration, and creative devotion flourish.',
      hi: 'पंचम भाव में आध्यात्मिक बुद्धि और पूर्वजन्म पुण्य सक्रिय — मंत्र सिद्धि, दिव्य प्रेरणा और रचनात्मक भक्ति फलती है।',
    },
    6: {
      en: 'The 6th house brings spiritual challenges — obstacles in sadhana, battles with inner demons, but ultimate victory through disciplined practice.',
      hi: 'षष्ठ भाव आध्यात्मिक चुनौतियां लाता है — साधना में बाधाएं, आंतरिक राक्षसों से युद्ध, पर अनुशासित अभ्यास से अंतिम विजय।',
    },
    7: {
      en: 'From the 7th house, the spiritual partner or guru appears — divine relationships, devotional partnerships, and spiritual companionship.',
      hi: 'सप्तम भाव से आध्यात्मिक साथी या गुरु प्रकट — दिव्य संबंध, भक्ति साझेदारी और आध्यात्मिक सहचर्य।',
    },
    8: {
      en: 'The 8th house triggers profound spiritual transformation — kundalini awakening, mystical experiences, and penetrating hidden truths.',
      hi: 'अष्टम भाव गहन आध्यात्मिक परिवर्तन उत्प्रेरित — कुंडलिनी जागरण, रहस्यमय अनुभव और गूढ़ सत्य की खोज।',
    },
    9: {
      en: 'In the 9th house, dharmic expansion peaks — guru connection, pilgrimage, scriptural study, and grace from the divine lineage.',
      hi: 'नवम भाव में धार्मिक विस्तार चरम — गुरु संबंध, तीर्थयात्रा, शास्त्र अध्ययन और दिव्य परंपरा से कृपा।',
    },
    10: {
      en: 'The 10th house makes spiritual practice visible — public spiritual roles, teaching dharma, and becoming a beacon of wisdom in society.',
      hi: 'दशम भाव आध्यात्मिक साधना को दृश्यमान बनाता है — सार्वजनिक आध्यात्मिक भूमिका, धर्म शिक्षण और समाज में ज्ञान का दीपक।',
    },
    11: {
      en: 'From the 11th house, spiritual aspirations manifest — sangha (community), shared spiritual goals, and gains from devotional activities.',
      hi: 'एकादश भाव से आध्यात्मिक आकांक्षाएं साकार — संघ, साझा आध्यात्मिक लक्ष्य और भक्ति गतिविधियों से लाभ।',
    },
    12: {
      en: 'The 12th house is moksha sthana — liberation, deep meditation, dissolution of ego, and ultimate spiritual surrender define this placement.',
      hi: 'द्वादश भाव मोक्ष स्थान है — मुक्ति, गहन ध्यान, अहंकार विघटन और परम आध्यात्मिक समर्पण इस स्थिति की पहचान।',
    },
  },
  health: {
    1: {
      en: 'In the 1st house, the body and constitution come into direct focus — vitality fluctuates, and personal health becomes a primary theme.',
      hi: 'प्रथम भाव में शरीर और संरचना प्रत्यक्ष केंद्र में — ओज में उतार-चढ़ाव और व्यक्तिगत स्वास्थ्य प्राथमिक विषय।',
    },
    2: {
      en: 'The 2nd house affects oral health, diet, and intake — food habits, speech-related issues, and right eye health may need attention.',
      hi: 'द्वितीय भाव मुख स्वास्थ्य, आहार और सेवन को प्रभावित — खान-पान की आदतें, वाणी-संबंधी समस्याएं और दाहिनी आंख को ध्यान की आवश्यकता।',
    },
    3: {
      en: 'From the 3rd house, arms, shoulders, and nervous energy are affected — courage for medical procedures and short-term health improvement efforts.',
      hi: 'तृतीय भाव से भुजाएं, कंधे और तंत्रिका ऊर्जा प्रभावित — चिकित्सा प्रक्रियाओं का साहस और अल्पकालिक स्वास्थ्य सुधार प्रयास।',
    },
    4: {
      en: 'The 4th house governs chest, heart, and emotional wellbeing — mental health, cardiac care, and finding inner peace become essential.',
      hi: 'चतुर्थ भाव छाती, हृदय और भावनात्मक स्वास्थ्य को नियंत्रित — मानसिक स्वास्थ्य, हृदय देखभाल और आंतरिक शांति आवश्यक।',
    },
    5: {
      en: 'In the 5th house, stomach, digestive system, and reproductive health are highlighted — creative healing and positive mental attitude aid recovery.',
      hi: 'पंचम भाव में पेट, पाचन तंत्र और प्रजनन स्वास्थ्य प्रमुख — रचनात्मक उपचार और सकारात्मक मानसिक दृष्टिकोण स्वस्थता में सहायक।',
    },
    6: {
      en: 'The 6th house is the primary disease house — chronic conditions surface, but also the power to fight and overcome them through discipline.',
      hi: 'षष्ठ भाव प्राथमिक रोग भाव है — दीर्घकालिक रोग सामने आते हैं, पर अनुशासन से लड़ने और जीतने की शक्ति भी।',
    },
    7: {
      en: 'From the 7th house, reproductive health and partner-related health matters arise — collaborative healing and medical partnerships.',
      hi: 'सप्तम भाव से प्रजनन स्वास्थ्य और साथी-संबंधी स्वास्थ्य विषय उठते हैं — सहयोगी उपचार और चिकित्सा साझेदारी।',
    },
    8: {
      en: 'The 8th house triggers sudden health events, surgeries, and deep regeneration — transformative healing but also vulnerability to acute conditions.',
      hi: 'अष्टम भाव अचानक स्वास्थ्य घटनाएं, शल्य चिकित्सा और गहन पुनर्जनन उत्प्रेरित — परिवर्तनकारी उपचार पर तीव्र रोग प्रवणता भी।',
    },
    9: {
      en: 'In the 9th house, fortune protects health — divine grace aids recovery, Ayurvedic and traditional healing methods prove beneficial.',
      hi: 'नवम भाव में भाग्य स्वास्थ्य की रक्षा करता है — दैवीय कृपा स्वस्थता में सहायक, आयुर्वेदिक और पारंपरिक उपचार लाभकारी।',
    },
    10: {
      en: 'The 10th house connects health to career — overwork stress, occupational health issues, but also recognition in medical or healing professions.',
      hi: 'दशम भाव स्वास्थ्य को करियर से जोड़ता है — अत्यधिक कार्य तनाव, व्यावसायिक स्वास्थ्य समस्याएं, पर चिकित्सा व्यवसाय में मान्यता भी।',
    },
    11: {
      en: 'From the 11th house, health improvements materialize — recovery from long-standing conditions, health gains through social support networks.',
      hi: 'एकादश भाव से स्वास्थ्य सुधार साकार — दीर्घकालिक रोगों से स्वस्थता, सामाजिक सहायता नेटवर्क से स्वास्थ्य लाभ।',
    },
    12: {
      en: 'The 12th house indicates hospitalization, foreign medical treatment, or chronic conditions requiring isolation — rest and retreat aid healing.',
      hi: 'द्वादश भाव अस्पताल में भर्ती, विदेशी चिकित्सा या एकांत आवश्यक दीर्घकालिक रोग दर्शाता है — विश्राम और एकांत उपचार में सहायक।',
    },
  },
  education: {
    1: {
      en: 'In the 1st house, intellectual identity sharpens — self-directed learning, personal academic ambition, and a scholarly persona emerge.',
      hi: 'प्रथम भाव में बौद्धिक पहचान तीव्र — स्व-निर्देशित शिक्षा, व्यक्तिगत शैक्षणिक महत्वाकांक्षा और विद्वत व्यक्तित्व उभरता है।',
    },
    2: {
      en: 'The 2nd house connects education to earning — knowledge becomes income, speech and language skills improve, and academic investments pay off.',
      hi: 'द्वितीय भाव शिक्षा को कमाई से जोड़ता है — ज्ञान आय बनता है, भाषा कौशल सुधरता है और शैक्षणिक निवेश फलदायी।',
    },
    3: {
      en: 'From the 3rd house, writing, publishing, and practical learning skills activate — workshops, seminars, and hands-on training excel.',
      hi: 'तृतीय भाव से लेखन, प्रकाशन और व्यावहारिक शिक्षा कौशल सक्रिय — कार्यशाला, सेमिनार और व्यावहारिक प्रशिक्षण उत्कृष्ट।',
    },
    4: {
      en: 'The 4th house governs formal education — degrees, institutional learning, academic comfort, and establishing a foundation of knowledge.',
      hi: 'चतुर्थ भाव औपचारिक शिक्षा को नियंत्रित — उपाधियां, संस्थागत शिक्षा, शैक्षणिक सुख और ज्ञान की नींव स्थापना।',
    },
    5: {
      en: 'In the 5th house, creative intelligence peaks — research breakthroughs, original thinking, and mentoring or advisory academic roles flourish.',
      hi: 'पंचम भाव में रचनात्मक बुद्धि चरम — अनुसंधान सफलता, मौलिक चिंतन और परामर्श या सलाहकार शैक्षणिक भूमिकाएं फलती हैं।',
    },
    6: {
      en: 'The 6th house brings academic competition — entrance exams, competitive scholarships, and overcoming learning obstacles through perseverance.',
      hi: 'षष्ठ भाव शैक्षणिक प्रतिस्पर्धा लाता है — प्रवेश परीक्षा, प्रतिस्पर्धी छात्रवृत्ति और दृढ़ता से सीखने की बाधाओं पर विजय।',
    },
    7: {
      en: 'From the 7th house, collaborative learning thrives — study partnerships, academic mentors, and education through dialogue and debate.',
      hi: 'सप्तम भाव से सहयोगी शिक्षा फलती है — अध्ययन साझेदारी, शैक्षणिक परामर्शदाता और संवाद-विवाद से शिक्षा।',
    },
    8: {
      en: 'The 8th house deepens into research — occult studies, psychology, transformative learning experiences, and uncovering hidden knowledge.',
      hi: 'अष्टम भाव अनुसंधान में गहराई — गूढ़ अध्ययन, मनोविज्ञान, परिवर्तनकारी शिक्षा अनुभव और छिपे ज्ञान की खोज।',
    },
    9: {
      en: 'In the 9th house, higher education excels — university degrees, philosophical studies, foreign education, and guru-guided learning.',
      hi: 'नवम भाव में उच्च शिक्षा उत्कृष्ट — विश्वविद्यालय उपाधियां, दार्शनिक अध्ययन, विदेशी शिक्षा और गुरु-निर्देशित शिक्षण।',
    },
    10: {
      en: 'The 10th house connects education to professional mastery — vocational training, professional certifications, and academic reputation building.',
      hi: 'दशम भाव शिक्षा को व्यावसायिक निपुणता से जोड़ता है — व्यावसायिक प्रशिक्षण, पेशेवर प्रमाणन और शैक्षणिक प्रतिष्ठा निर्माण।',
    },
    11: {
      en: 'From the 11th house, academic aspirations are fulfilled — scholarships, alumni networks, and gains from educational endeavors materialize.',
      hi: 'एकादश भाव से शैक्षणिक आकांक्षाएं पूर्ण — छात्रवृत्ति, पूर्व छात्र नेटवर्क और शैक्षणिक प्रयासों से लाभ साकार।',
    },
    12: {
      en: 'The 12th house indicates foreign education, online learning, or retreat-based studies — knowledge gained in solitude proves profound.',
      hi: 'द्वादश भाव विदेशी शिक्षा, ऑनलाइन शिक्षण या एकांत अध्ययन दर्शाता है — एकांत में प्राप्त ज्ञान गहन सिद्ध।',
    },
  },
  family: {
    1: {
      en: 'In the 1st house, personal identity intertwines with family legacy — you become the face and representative of your lineage.',
      hi: 'प्रथम भाव में व्यक्तिगत पहचान पारिवारिक विरासत से गुंथती है — आप अपने वंश का चेहरा और प्रतिनिधि बनते हैं।',
    },
    2: {
      en: 'The 2nd house activates family wealth and traditions — ancestral resources, family meals, and preserving cultural heritage.',
      hi: 'द्वितीय भाव पारिवारिक धन और परंपराएं सक्रिय — पूर्वज संसाधन, पारिवारिक भोज और सांस्कृतिक विरासत का संरक्षण।',
    },
    3: {
      en: 'From the 3rd house, sibling dynamics take center stage — support, rivalry, joint ventures, and family communication patterns.',
      hi: 'तृतीय भाव से सहोदर गतिशीलता केंद्र में — सहायता, प्रतिद्वंद्विता, संयुक्त उपक्रम और पारिवारिक संवाद प्रतिरूप।',
    },
    4: {
      en: 'The 4th house deepens home and maternal bonds — renovations, family gatherings, and emotional healing within the household.',
      hi: 'चतुर्थ भाव गृह और मातृ बंधन को गहरा करता है — नवीनीकरण, पारिवारिक समागम और गृह में भावनात्मक उपचार।',
    },
    5: {
      en: 'In the 5th house, creative family traditions, children\'s role in family dynamics, and joyful family celebrations come alive.',
      hi: 'पंचम भाव में रचनात्मक पारिवारिक परंपराएं, पारिवारिक गतिशीलता में संतान की भूमिका और आनंदमय पारिवारिक उत्सव जीवंत।',
    },
    6: {
      en: 'The 6th house brings family conflicts — disputes over property, health issues of family members, and karmic debts within the clan.',
      hi: 'षष्ठ भाव पारिवारिक संघर्ष लाता है — संपत्ति विवाद, परिवार सदस्यों की स्वास्थ्य समस्याएं और कुल में कार्मिक ऋण।',
    },
    7: {
      en: 'From the 7th house, marital family (in-laws) relationships activate — balancing birth family and married family dynamics.',
      hi: 'सप्तम भाव से ससुराल संबंध सक्रिय — जन्म परिवार और विवाहित परिवार गतिशीलता का संतुलन।',
    },
    8: {
      en: 'The 8th house triggers family secrets, inheritance disputes, and transformative experiences within the family structure.',
      hi: 'अष्टम भाव पारिवारिक रहस्य, विरासत विवाद और पारिवारिक ढांचे में परिवर्तनकारी अनुभव उत्प्रेरित।',
    },
    9: {
      en: 'In the 9th house, paternal lineage, family dharma, and ancestral blessings become prominent — elders guide and protect.',
      hi: 'नवम भाव में पितृ वंश, पारिवारिक धर्म और पूर्वज आशीर्वाद प्रमुख — बड़े-बूढ़े मार्गदर्शन और रक्षा करते हैं।',
    },
    10: {
      en: 'The 10th house connects family to public standing — family reputation, carrying forward the family name, and familial authority.',
      hi: 'दशम भाव परिवार को सार्वजनिक प्रतिष्ठा से जोड़ता है — पारिवारिक प्रतिष्ठा, कुल नाम आगे बढ़ाना और पारिवारिक अधिकार।',
    },
    11: {
      en: 'From the 11th house, family network expands — reunions, community connections, and collective family aspirations are realized.',
      hi: 'एकादश भाव से पारिवारिक नेटवर्क विस्तृत — पुनर्मिलन, सामुदायिक संबंध और सामूहिक पारिवारिक आकांक्षाएं साकार।',
    },
    12: {
      en: 'The 12th house indicates separation from family, foreign settlement away from kin, or spiritual renunciation of familial bonds.',
      hi: 'द्वादश भाव परिवार से विछोह, परिजनों से दूर विदेशी बसावट या पारिवारिक बंधनों का आध्यात्मिक त्याग दर्शाता है।',
    },
  },
  karma: {
    1: {
      en: 'In the 1st house, karmic identity crystallizes — past life patterns directly shape present personality, demanding conscious self-awareness.',
      hi: 'प्रथम भाव में कार्मिक पहचान सुस्पष्ट — पूर्वजन्म प्रारूप सीधे वर्तमान व्यक्तित्व को आकार देते हैं, सचेत आत्म-जागरूकता अनिवार्य।',
    },
    2: {
      en: 'The 2nd house reveals karmic wealth patterns — debts and blessings related to speech, family resources, and accumulated merit from past lives.',
      hi: 'द्वितीय भाव कार्मिक धन प्रारूप दर्शाता है — वाणी, पारिवारिक संसाधन और पूर्वजन्म संचित पुण्य से संबंधित ऋण और आशीर्वाद।',
    },
    3: {
      en: 'From the 3rd house, karmic patterns related to courage, siblings, and self-initiative are activated — past life skill sets re-emerge.',
      hi: 'तृतीय भाव से साहस, सहोदर और आत्म-पहल से संबंधित कार्मिक प्रारूप सक्रिय — पूर्वजन्म कौशल पुनः उभरते हैं।',
    },
    4: {
      en: 'The 4th house processes karmic debts related to home, mother, and emotional security — ancestral property karma surfaces.',
      hi: 'चतुर्थ भाव गृह, माता और भावनात्मक सुरक्षा से संबंधित कार्मिक ऋण प्रसंस्कृत — पूर्वज संपत्ति कर्म सामने आता है।',
    },
    5: {
      en: 'In the 5th house, poorva punya (past merit) activates — the fruits of past life spiritual practice, creativity, and devotion manifest now.',
      hi: 'पंचम भाव में पूर्व पुण्य सक्रिय — पूर्वजन्म आध्यात्मिक साधना, रचनात्मकता और भक्ति के फल अब प्रकट।',
    },
    6: {
      en: 'The 6th house reveals karmic enemies and karmic disease — past life conflicts resurface demanding resolution through service and discipline.',
      hi: 'षष्ठ भाव कार्मिक शत्रु और कार्मिक रोग दर्शाता है — पूर्वजन्म संघर्ष सेवा और अनुशासन से समाधान की मांग करते हुए पुनः सामने।',
    },
    7: {
      en: 'From the 7th house, karmic partnerships and relationship debts activate — souls from past lives reconnect for unfinished emotional business.',
      hi: 'सप्तम भाव से कार्मिक साझेदारी और संबंध ऋण सक्रिय — पूर्वजन्म की आत्माएं अधूरे भावनात्मक कार्य के लिए पुनः मिलती हैं।',
    },
    8: {
      en: 'The 8th house is deep karmic processing — transformation, death-rebirth cycles in consciousness, and resolution of the heaviest karmic debts.',
      hi: 'अष्टम भाव गहन कार्मिक प्रसंस्करण — परिवर्तन, चेतना में मृत्यु-पुनर्जन्म चक्र और सबसे भारी कार्मिक ऋणों का समाधान।',
    },
    9: {
      en: 'In the 9th house, dharmic karma ripens — past life religious merit, guru blessings, and fortunate karmic destiny activate fully.',
      hi: 'नवम भाव में धार्मिक कर्म पकता है — पूर्वजन्म धार्मिक पुण्य, गुरु आशीर्वाद और भाग्यशाली कार्मिक नियति पूर्ण सक्रिय।',
    },
    10: {
      en: 'The 10th house manifests karmic duty — your soul\'s purpose in this lifetime becomes clear through professional and public responsibilities.',
      hi: 'दशम भाव कार्मिक कर्तव्य प्रकट — इस जीवनकाल में आपकी आत्मा का उद्देश्य व्यावसायिक और सार्वजनिक जिम्मेदारियों से स्पष्ट।',
    },
    11: {
      en: 'From the 11th house, karmic aspirations and collective karma bear fruit — community service, network of souls, and shared destinies.',
      hi: 'एकादश भाव से कार्मिक आकांक्षाएं और सामूहिक कर्म फलित — सामुदायिक सेवा, आत्माओं का नेटवर्क और साझा नियति।',
    },
    12: {
      en: 'The 12th house is the final karmic dissolution — moksha potential, releasing accumulated karmic baggage, and transcending the cycle of birth and death.',
      hi: 'द्वादश भाव अंतिम कार्मिक विघटन — मोक्ष संभावना, संचित कार्मिक बोझ का त्याग और जन्म-मृत्यु चक्र से मुक्ति।',
    },
  },
};

// Generic house effects (fallback for unknown chart domains)
const GENERIC_HOUSE: Record<number, Bi> = {
  1: {
    en: 'Placed in the 1st house, the dasha lord directly impacts the self, physical body, and personal initiative in this domain.',
    hi: 'प्रथम भाव में स्थित दशा स्वामी इस क्षेत्र में आत्म, शरीर और व्यक्तिगत पहल को सीधे प्रभावित करता है।',
  },
  2: {
    en: 'In the 2nd house, wealth, speech, family resources, and accumulated value in this domain are activated.',
    hi: 'द्वितीय भाव में इस क्षेत्र का धन, वाणी, पारिवारिक संसाधन और संचित मूल्य सक्रिय।',
  },
  3: {
    en: 'From the 3rd house, courage, communication, siblings, and short-term initiatives in this domain come to life.',
    hi: 'तृतीय भाव से इस क्षेत्र में साहस, संवाद, सहोदर और अल्पकालिक पहल जीवंत।',
  },
  4: {
    en: 'The 4th house brings emotional depth, inner comfort, and foundational stability to this domain.',
    hi: 'चतुर्थ भाव इस क्षेत्र में भावनात्मक गहराई, आंतरिक सुख और मूलभूत स्थिरता लाता है।',
  },
  5: {
    en: 'In the 5th house, creative intelligence, past merit, and speculative gains in this domain are highlighted.',
    hi: 'पंचम भाव में इस क्षेत्र की रचनात्मक बुद्धि, पूर्व पुण्य और सट्टा लाभ प्रमुख।',
  },
  6: {
    en: 'The 6th house brings challenges, competition, and the need for disciplined effort to overcome obstacles in this domain.',
    hi: 'षष्ठ भाव इस क्षेत्र में चुनौतियां, प्रतिस्पर्धा और बाधाओं पर विजय के लिए अनुशासित प्रयास की आवश्यकता लाता है।',
  },
  7: {
    en: 'From the 7th house, partnerships, collaborations, and other people\'s contributions shape this domain significantly.',
    hi: 'सप्तम भाव से साझेदारी, सहयोग और अन्य लोगों का योगदान इस क्षेत्र को महत्वपूर्ण रूप से आकार देता है।',
  },
  8: {
    en: 'The 8th house triggers transformation, sudden changes, and deep research in this domain — nothing remains superficial.',
    hi: 'अष्टम भाव इस क्षेत्र में परिवर्तन, अचानक बदलाव और गहन अनुसंधान उत्प्रेरित — कुछ भी सतही नहीं रहता।',
  },
  9: {
    en: 'In the 9th house, fortune, dharma, and higher wisdom bless this domain — luck and merit combine for positive outcomes.',
    hi: 'नवम भाव में भाग्य, धर्म और उच्च ज्ञान इस क्षेत्र को आशीर्वाद — भाग्य और पुण्य सकारात्मक परिणामों के लिए मिलते हैं।',
  },
  10: {
    en: 'The 10th house brings this domain into public visibility — maximum effort, authority, and achievement define the period.',
    hi: 'दशम भाव इस क्षेत्र को सार्वजनिक दृश्यता में लाता है — अधिकतम प्रयास, अधिकार और उपलब्धि काल की पहचान।',
  },
  11: {
    en: 'From the 11th house, aspirations in this domain manifest as tangible gains — networking and collective effort yield rewards.',
    hi: 'एकादश भाव से इस क्षेत्र की आकांक्षाएं ठोस लाभ में प्रकट — नेटवर्किंग और सामूहिक प्रयास पुरस्कार देते हैं।',
  },
  12: {
    en: 'The 12th house indicates endings, foreign connections, and spiritual dimensions of this domain — letting go enables renewal.',
    hi: 'द्वादश भाव इस क्षेत्र की समाप्ति, विदेशी संबंध और आध्यात्मिक आयाम दर्शाता है — त्याग नवीनीकरण सक्षम करता है।',
  },
};

// ─── Layer 4: Combining everything ─────────────────────────────────────────

function getHouseEffect(chartKey: string, house: number): Bi {
  const category = CHART_CATEGORY[chartKey];
  if (category && HOUSE_IN_DOMAIN[category]) {
    const effect = HOUSE_IN_DOMAIN[category][house];
    if (effect) return effect;
  }
  return GENERIC_HOUSE[house] || GENERIC_HOUSE[1];
}

function getAffinity(chartKey: string, planetId: number): Bi | null {
  const chartAffinities = PLANET_DOMAIN_AFFINITY[chartKey];
  if (chartAffinities) {
    return chartAffinities[planetId] || null;
  }
  return null;
}

function ordinalEn(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  return n + (s[(n - 20) % 10] || s[n] || s[0]);
}

function ordinalHi(n: number): string {
  return `${n}वें`;
}

export function generateDashaPrognosis(params: {
  chartKey: string;
  domainEn: string;
  domainHi: string;
  mahaPlanetId: number;
  mahaPlanetNameEn: string;
  mahaPlanetNameHi: string;
  mahaHouse: number | undefined;
  antarPlanetId: number;
  antarPlanetNameEn: string;
  antarPlanetNameHi: string;
  antarHouse: number | undefined;
  antarEndDate: string | undefined;
  ascendantSign: number;
  beneficsInKendra: number;
  maleficsInDusthana: number;
}): LocaleText {
  const {
    chartKey, domainEn, domainHi,
    mahaPlanetId, mahaPlanetNameEn, mahaPlanetNameHi, mahaHouse,
    antarPlanetId, antarPlanetNameEn, antarPlanetNameHi, antarHouse,
    antarEndDate, beneficsInKendra, maleficsInDusthana,
  } = params;

  const enParts: string[] = [];
  const hiParts: string[] = [];

  // 1. Dasha period introduction
  enParts.push(
    `Currently running ${mahaPlanetNameEn} Maha Dasha — ${antarPlanetNameEn} Antar Dasha in the ${chartKey} chart (${domainEn}).`
  );
  hiParts.push(
    `वर्तमान में ${chartKey} चार्ट (${domainHi}) में ${mahaPlanetNameHi} महादशा — ${antarPlanetNameHi} अंतर्दशा चल रही है।`
  );

  // 2. Planet dasha nature (Maha lord)
  const mahaNature = PLANET_DASHA_NATURE[mahaPlanetId];
  if (mahaNature) {
    // Take just the first sentence to keep it concise
    const enFirst = mahaNature.en.split('. ')[0] + '.';
    const hiFirst = mahaNature.hi!.split('। ')[0] + '।';
    enParts.push(enFirst);
    hiParts.push(hiFirst);
  }

  // 3. Special note: planet-domain affinity (Maha lord)
  const mahaAffinity = getAffinity(chartKey, mahaPlanetId);
  if (mahaAffinity) {
    enParts.push(`Special note: ${mahaAffinity.en}`);
    hiParts.push(`विशेष: ${mahaAffinity.hi}`);
  }

  // 4. House-in-domain effect (Maha lord)
  if (mahaHouse !== undefined && mahaHouse >= 1 && mahaHouse <= 12) {
    const mahaEffect = getHouseEffect(chartKey, mahaHouse);
    enParts.push(
      `${mahaPlanetNameEn} occupies the ${ordinalEn(mahaHouse)} house of ${chartKey}: ${mahaEffect.en.charAt(0).toLowerCase() + mahaEffect.en.slice(1)}`
    );
    hiParts.push(
      `${mahaPlanetNameHi} ${chartKey} के ${ordinalHi(mahaHouse)} भाव में: ${mahaEffect.hi}`
    );
  } else {
    enParts.push(
      `${mahaPlanetNameEn} is not placed in ${chartKey}, so its influence operates indirectly through aspect and lordship — the effects are subtle but still relevant to ${domainEn.toLowerCase()}.`
    );
    hiParts.push(
      `${mahaPlanetNameHi} ${chartKey} में स्थित नहीं है, इसलिए इसका प्रभाव दृष्टि और स्वामित्व के माध्यम से अप्रत्यक्ष रूप से कार्य करता है — प्रभाव सूक्ष्म पर ${domainHi} के लिए प्रासंगिक।`
    );
  }

  // 5. Antar dasha lord house-in-domain
  if (antarPlanetId !== mahaPlanetId) {
    if (antarHouse !== undefined && antarHouse >= 1 && antarHouse <= 12) {
      const antarEffect = getHouseEffect(chartKey, antarHouse);
      // Use a different sentence structure for antar dasha to avoid repetition
      enParts.push(
        `The sub-period lord ${antarPlanetNameEn} in the ${ordinalEn(antarHouse)} house refines this further: ${antarEffect.en.charAt(0).toLowerCase() + antarEffect.en.slice(1)}`
      );
      hiParts.push(
        `अंतर्दशा स्वामी ${antarPlanetNameHi} ${ordinalHi(antarHouse)} भाव में इसे और परिष्कृत करता है: ${antarEffect.hi}`
      );
    } else {
      enParts.push(
        `Sub-period lord ${antarPlanetNameEn} is absent from ${chartKey}, modulating results through aspect rather than direct presence.`
      );
      hiParts.push(
        `अंतर्दशा स्वामी ${antarPlanetNameHi} ${chartKey} में अनुपस्थित, प्रत्यक्ष उपस्थिति के बजाय दृष्टि से परिणामों को प्रभावित करता है।`
      );
    }

    // Check antar dasha affinity too
    const antarAffinity = getAffinity(chartKey, antarPlanetId);
    if (antarAffinity && !mahaAffinity) {
      enParts.push(`Notably: ${antarAffinity.en}`);
      hiParts.push(`उल्लेखनीय: ${antarAffinity.hi}`);
    }
  }

  // 6. Contextual notes (chart strength)
  if (beneficsInKendra >= 2) {
    enParts.push(
      `With ${beneficsInKendra} benefics in kendra houses of ${chartKey}, there is strong foundational support — positive outcomes are well-protected.`
    );
    hiParts.push(
      `${chartKey} के केंद्र भावों में ${beneficsInKendra} शुभ ग्रहों के साथ, मजबूत मूलभूत सहायता है — सकारात्मक परिणाम सुरक्षित।`
    );
  } else if (maleficsInDusthana >= 2) {
    enParts.push(
      `With ${maleficsInDusthana} malefics in dusthana houses of ${chartKey}, negative forces are contained — challenges exist but are manageable through awareness.`
    );
    hiParts.push(
      `${chartKey} के दुःस्थान भावों में ${maleficsInDusthana} पाप ग्रहों के साथ, नकारात्मक शक्तियां नियंत्रित — चुनौतियां हैं पर जागरूकता से प्रबंधनीय।`
    );
  } else if (beneficsInKendra === 0) {
    enParts.push(
      `The absence of benefics in kendra houses of ${chartKey} suggests that extra effort and conscious planning are needed to harness this dasha\'s potential.`
    );
    hiParts.push(
      `${chartKey} के केंद्र भावों में शुभ ग्रहों की अनुपस्थिति सुझाव देती है कि इस दशा की क्षमता का उपयोग करने के लिए अतिरिक्त प्रयास और सचेत योजना आवश्यक।`
    );
  }

  // 7. Timing (antar end date)
  if (antarEndDate) {
    enParts.push(
      `This ${antarPlanetNameEn} sub-period runs until ${antarEndDate} — plan key decisions within this window.`
    );
    hiParts.push(
      `यह ${antarPlanetNameHi} अंतर्दशा ${antarEndDate} तक चलेगी — इस अवधि में महत्वपूर्ण निर्णय योजनाबद्ध करें।`
    );
  }

  return {
    en: enParts.join(' '),
    hi: hiParts.join(' '),
  };
}
