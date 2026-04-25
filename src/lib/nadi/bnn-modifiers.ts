/**
 * BNN Modifier Texts
 *
 * Instead of 10,000+ individual modifiers (planet × sign × aspect), we use
 * a template system of per-aspecting-planet modifiers that describe how each
 * planet's influence layers onto ANY base prediction.
 *
 * Usage:
 *   ASPECT_MODIFIERS[aspectingPlanetId]    → add to reading when aspectingPlanetId aspects subjectPlanetId
 *   CONJUNCTION_MODIFIERS[conjunctId]      → add to reading when planets are conjunct
 *   RETROGRADE_MODIFIERS[planetId]         → add to reading when planet is retrograde
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

export const ASPECT_MODIFIERS: Record<number, { en: string; hi: string }> = {
  0: {
    en: 'An aspect from the Sun illuminates this planet with royal authority and the support of government, fathers, and leaders. Confidence and public recognition amplify this planet\'s significations, but ego attachment can also inflate their shadow side.',
    hi: 'सूर्य की दृष्टि इस ग्रह को शाही अधिकार और सरकार, पिता और नेताओं के समर्थन से प्रकाशित करती है। आत्मविश्वास और सार्वजनिक पहचान इस ग्रह की कारकत्व को बढ़ाती है।',
  },
  1: {
    en: 'The Moon\'s aspect brings emotional sensitivity, intuitive intelligence, and the influence of the public and maternal figures to this planet\'s themes. The mind becomes deeply involved in these areas; popularity can be gained but emotional fluctuation in the signified domain is also likely.',
    hi: 'चन्द्रमा की दृष्टि इस ग्रह के विषयों में भावनात्मक संवेदनशीलता, अंतर्ज्ञान बुद्धि और जन-प्रतिनिधि और मातृ व्यक्तित्वों का प्रभाव लाती है। लोकप्रियता अर्जित की जा सकती है।',
  },
  2: {
    en: 'Mars\' aspect injects energy, courage, and competitive drive into this planet\'s domain. Initiatives are taken boldly; results come faster but conflict, impatience, or accidents related to the signified areas are also possible. Channelling this energy into disciplined action yields exceptional results.',
    hi: 'मंगल की दृष्टि इस ग्रह के क्षेत्र में ऊर्जा, साहस और प्रतिस्पर्धी प्रेरणा डालती है। पहल साहसपूर्वक की जाती है; परिणाम तेजी से आते हैं लेकिन संघर्ष या आवेग भी संभव है।',
  },
  3: {
    en: 'Mercury\'s aspect brings intelligence, commercial acumen, and communicative clarity to this planet\'s domain. Intellectual engagement, business opportunities, and skill development in the signified area are amplified. Writing, speaking, or educational pursuits related to these themes are especially favoured.',
    hi: 'बुध की दृष्टि इस ग्रह के क्षेत्र में बुद्धि, वाणिज्यिक कुशाग्रता और संचार स्पष्टता लाती है। संकेतित क्षेत्र में बौद्धिक जुड़ाव और व्यापारिक अवसर बढ़े हैं।',
  },
  4: {
    en: 'Jupiter\'s aspect is a classical blessing — it expands, protects, and bestows wisdom upon this planet\'s significations. Prosperity, children, dharma, and the grace of teachers uplift the themes indicated. This aspect is the strongest positive modifier in the BNN system.',
    hi: 'बृहस्पति की दृष्टि एक शास्त्रीय आशीर्वाद है — यह इस ग्रह की कारकत्व का विस्तार, रक्षा और ज्ञान प्रदान करती है। समृद्धि, संतान, धर्म और शिक्षकों की कृपा संकेतित विषयों को ऊँचा उठाती है।',
  },
  5: {
    en: 'Venus\' aspect brings beauty, harmony, and material pleasure to this planet\'s domain. Partnership opportunities, creative expression, and sensory enjoyment are amplified. Marriage and relationship themes interweave with the signified areas; luxury and aesthetic refinement grace these life domains.',
    hi: 'शुक्र की दृष्टि इस ग्रह के क्षेत्र में सौंदर्य, सामंजस्य और भौतिक आनंद लाती है। साझेदारी के अवसर, रचनात्मक अभिव्यक्ति और संवेदी आनंद बढ़े हैं।',
  },
  6: {
    en: 'Saturn\'s aspect introduces discipline, delay, and long-term karmic weight to this planet\'s significations. Efforts in the indicated domain require sustained patience; early obstacles give way to durable achievement. The native earns what is signified here slowly but keeps it permanently.',
    hi: 'शनि की दृष्टि इस ग्रह की कारकत्व में अनुशासन, विलंब और दीर्घकालिक कार्मिक भार का परिचय देती है। संकेतित क्षेत्र में प्रयासों के लिए निरंतर धैर्य की आवश्यकता होती है।',
  },
  7: {
    en: 'Rahu\'s aspect amplifies the signified themes with obsessive intensity, unconventional energy, and foreign or technological influence. Sudden gains and sudden disruptions are both possible. The native pursues the indicated areas with unusual drive; illusions and over-amplification require conscious monitoring.',
    hi: 'राहु की दृष्टि जुनूनी तीव्रता, अपरंपरागत ऊर्जा और विदेशी या तकनीकी प्रभाव के साथ संकेतित विषयों को बढ़ाती है। अचानक लाभ और अचानक व्यवधान दोनों संभव हैं।',
  },
  8: {
    en: 'Ketu\'s aspect introduces spiritual detachment, past-life karmic resonance, and subtle dissolution of the signified themes. What is indicated here may feel effortless yet somehow hollow. Spiritual gifts in these areas are real; the path to fulfilment involves offering these domains in service rather than personal attachment.',
    hi: 'केतु की दृष्टि संकेतित विषयों में आध्यात्मिक अनासक्ति, पूर्व जीवन कार्मिक अनुनाद और सूक्ष्म विसर्जन का परिचय देती है। इन क्षेत्रों में आध्यात्मिक उपहार वास्तविक हैं।',
  },
};

export const CONJUNCTION_MODIFIERS: Record<number, { en: string; hi: string }> = {
  0: {
    en: 'Conjunction with the Sun: the planet is brought into close contact with solar authority, government, and paternal influence. If within 8°, combustion weakens the planet\'s independent expression while amplifying royal, official, or public connections.',
    hi: 'सूर्य के साथ युति: ग्रह को सौर अधिकार, सरकार और पैतृक प्रभाव के करीबी संपर्क में लाती है। 8° के भीतर होने पर दहन स्वतंत्र अभिव्यक्ति को कमजोर करता है।',
  },
  1: {
    en: 'Conjunction with the Moon: the planet gains emotional depth and public appeal. The mind is heavily involved in the signified areas; the native\'s thoughts return to these themes habitually. Mother and the public reinforce the planet\'s themes in life.',
    hi: 'चन्द्रमा के साथ युति: ग्रह को भावनात्मक गहराई और सार्वजनिक आकर्षण मिलता है। मन संकेतित क्षेत्रों में गहराई से शामिल है। माँ और जनता ग्रह के विषयों को जीवन में प्रबलित करती है।',
  },
  2: {
    en: 'Conjunction with Mars: energy, competition, and courage amplify the signified domain. The planet is activated with Martian fire — swifter action, bolder outcomes, but also conflict and the need for conscious discipline to prevent aggression.',
    hi: 'मंगल के साथ युति: ऊर्जा, प्रतिस्पर्धा और साहस संकेतित क्षेत्र को बढ़ाता है। ग्रह मंगल की अग्नि से सक्रिय होता है — त्वरित क्रिया, साहसी परिणाम, लेकिन संघर्ष भी।',
  },
  3: {
    en: 'Conjunction with Mercury: intelligence, skill, and commercial awareness infuse the planet\'s themes. Communication and learning around the signified matters are enhanced. A Budh-Aditya yoga (with Sun) brings particular recognition for intellect in these areas.',
    hi: 'बुध के साथ युति: बुद्धि, कौशल और वाणिज्यिक जागरूकता ग्रह के विषयों में व्याप्त होती है। संकेतित विषयों के आसपास संचार और सीखना बढ़ा है।',
  },
  4: {
    en: 'Conjunction with Jupiter: the most auspicious conjunction possible. Wisdom, dharma, and the grace of the divine teacher uplift all significations. Prosperity, expansion, and spiritual support flow naturally through the areas indicated. This is a Guru-yoga configuration in BNN tradition.',
    hi: 'बृहस्पति के साथ युति: सबसे शुभ युति संभव। ज्ञान, धर्म और दिव्य शिक्षक की कृपा सभी कारकत्वों को ऊँचा उठाती है। संकेतित क्षेत्रों के माध्यम से समृद्धि और विस्तार स्वाभाविक रूप से प्रवाहित होता है।',
  },
  5: {
    en: 'Conjunction with Venus: beauty, pleasure, and relationship themes infuse the planet\'s domain. The signified areas gain a quality of grace, harmony, and artistic refinement. Marriage and artistic matters closely intertwine with the planet\'s life significations.',
    hi: 'शुक्र के साथ युति: सौंदर्य, आनंद और संबंध विषय ग्रह के क्षेत्र में व्याप्त होते हैं। संकेतित क्षेत्र कृपा, सामंजस्य और कलात्मक परिष्करण का गुण प्राप्त करते हैं।',
  },
  6: {
    en: 'Conjunction with Saturn: discipline, delay, and karmic weight condition the planet\'s expression. The signified areas require sustained effort and patience. Early difficulties or restrictions give way to durable mastery in later years. This conjunction ages well — eventual rewards are lasting.',
    hi: 'शनि के साथ युति: अनुशासन, विलंब और कार्मिक भार ग्रह की अभिव्यक्ति को प्रभावित करता है। संकेतित क्षेत्रों में निरंतर प्रयास और धैर्य की आवश्यकता है। प्रारंभिक कठिनाइयाँ बाद के वर्षों में स्थायी महारत को जन्म देती हैं।',
  },
  7: {
    en: 'Conjunction with Rahu: the planet is amplified with shadow-node intensity — obsessive focus, sudden amplification, and unconventional expression dominate. Foreign or technological dimensions are added. The signified areas become areas of intense worldly involvement; illusions may surround them until the native develops discernment.',
    hi: 'राहु के साथ युति: ग्रह छाया-नोड तीव्रता के साथ बढ़ाया जाता है। संकेतित क्षेत्र तीव्र सांसारिक भागीदारी के क्षेत्र बन जाते हैं। भ्रम तब तक उन्हें घेर सकते हैं जब तक मूल्यांकन विकसित न हो।',
  },
  8: {
    en: 'Conjunction with Ketu: the planet receives the south-node\'s gift of detachment, past-life mastery, and spiritual depth. The signified areas are handled with a quality of effortlessness that can border on indifference. Past-life gifts in these domains exist; the challenge is to engage them fully rather than transcend prematurely.',
    hi: 'केतु के साथ युति: ग्रह को दक्षिण-नोड का अनासक्ति, पूर्व जीवन महारत और आध्यात्मिक गहराई का उपहार मिलता है। इन क्षेत्रों में पूर्व जीवन उपहार हैं; चुनौती उन्हें समय से पहले पार करने के बजाय पूरी तरह शामिल करना है।',
  },
};

export const RETROGRADE_MODIFIERS: Record<number, { en: string; hi: string }> = {
  1: {
    en: 'A retrograde Moon is unusual and indicates a heightened internalisation of emotional experience. The native processes feelings more deeply than they express outwardly. There is a tendency toward introspection, revisiting the past, and intense relationship with the mother and feminine principles.',
    hi: 'वक्री चन्द्रमा असामान्य है और भावनात्मक अनुभव के बढ़े हुए आन्तरिकीकरण का संकेत देता है। भावनाएँ बाहरी रूप से व्यक्त करने की बजाय गहराई से संसाधित की जाती हैं।',
  },
  2: {
    en: 'Retrograde Mars turns the planet\'s energy inward — drive, ambition, and courage are intensely internalised. The native reflects deeply before acting; frustration builds when action is blocked. Courage takes time to find external expression but becomes formidably focused once released.',
    hi: 'वक्री मंगल ग्रह की ऊर्जा को अंदर की ओर मोड़ता है — प्रेरणा, महत्वाकांक्षा और साहस गहराई से आन्तरिक होते हैं। क्रिया अवरुद्ध होने पर निराशा बनती है।',
  },
  3: {
    en: 'Retrograde Mercury deepens intellectual processing — the native thinks things through many times before communicating. This can produce exceptional analytical depth or chronic indecision. Writing produced in solitude is often more powerful than spontaneous speech. Revisiting and refining ideas is this Mercury\'s superpower.',
    hi: 'वक्री बुध बौद्धिक प्रसंस्करण को गहरा करता है — संचार से पहले चीजों को कई बार सोचा जाता है। एकांत में लिखना प्रायः सहज भाषण से अधिक शक्तिशाली होता है।',
  },
  4: {
    en: 'Retrograde Jupiter turns wisdom inward, creating a philosophical depth that resists external dogma. The native is a thinker who arrives at dharma through personal inner work rather than tradition. Children and teachers may arrive later in life. Spiritual wisdom deepens significantly in the second half of life.',
    hi: 'वक्री बृहस्पति ज्ञान को अंदर की ओर मोड़ता है, एक दार्शनिक गहराई बनाता है जो बाहरी हठधर्मिता का प्रतिरोध करती है। धर्म परंपरा के बजाय व्यक्तिगत आंतरिक कार्य के माध्यम से पाया जाता है।',
  },
  5: {
    en: 'Retrograde Venus deepens and internalises romantic and aesthetic experience. The native may idealise love or revisit past relationships emotionally. Artistic expression tends toward the personal, introspective, and emotionally dense. Marriage relationships carry complex, multi-layered histories that reward patient understanding.',
    hi: 'वक्री शुक्र रोमांटिक और सौंदर्यात्मक अनुभव को गहरा और आन्तरिक करता है। प्रेम को आदर्श बनाने या भावनात्मक रूप से पिछले संबंधों को दोबारा देखने की प्रवृत्ति हो सकती है।',
  },
  6: {
    en: 'Retrograde Saturn intensifies the planet\'s lessons by internalising karmic pressure. The native carries the weight of past-life obligations prominently in the psyche. Discipline, structure, and responsibility are themes the native grapples with deeply and personally. Karmic debts from past lives are repaid deliberately and consciously.',
    hi: 'वक्री शनि कार्मिक दबाव को आन्तरिक करके ग्रह के पाठों को तीव्र करता है। अनुशासन, संरचना और जिम्मेदारी ऐसे विषय हैं जिनसे गहराई से जूझा जाता है। पूर्व जनमों के कार्मिक ऋण जानबूझकर और सचेत रूप से चुकाए जाते हैं।',
  },
  7: {
    en: 'Retrograde Rahu is uncommon and suggests an intensified karmic pull toward the Rahu-sign themes that plays out with unusual inner urgency. The native\'s obsessions are more internalised, creating a powerful internal drive toward the indicated life areas. Foreign or unconventional influences come from within the psyche as much as from outside.',
    hi: 'वक्री राहु असामान्य है और राहु-राशि विषयों की ओर तीव्र कार्मिक खिंचाव का सुझाव देता है। देशी के जुनून अधिक आन्तरिक होते हैं।',
  },
  8: {
    en: 'Retrograde Ketu deepens the south node\'s spiritual themes — past-life mastery becomes more consciously accessible. The native has an unusual ability to tap into very deep spiritual resources but may also face more intense karmic processing in the life areas Ketu occupies.',
    hi: 'वक्री केतु दक्षिण नोड के आध्यात्मिक विषयों को गहरा करता है — पूर्व जीवन महारत अधिक सचेत रूप से सुलभ हो जाती है। बहुत गहरे आध्यात्मिक संसाधनों में टैप करने की असामान्य क्षमता होती है।',
  },
};
