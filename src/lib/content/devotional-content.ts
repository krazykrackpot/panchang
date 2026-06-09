/**
 * Comprehensive Devotional Content Library
 *
 * Contains aartis, chalisas, stotrams, and mantras with full Devanagari text,
 * IAST transliteration, English meaning, and significance.
 *
 * IMPORTANT: These are sacred texts. All Devanagari content has been carefully
 * transcribed. If you find an error, fix it with a verified source  –  never guess.
 */

export type DevotionalType = 'aarti' | 'chalisa' | 'stotram' | 'mantra';

export interface DevotionalItem {
  slug: string;
  type: DevotionalType;
  title: { en: string; hi: string };
  deity: string;
  deityDay?: number; // 0=Sun..6=Sat  –  best day to recite
  devanagari: string;
  transliteration: string;
  meaning: string;
  significance: string;
  audioUrl?: string;
}

// ─── AARTIS ─────────────────────────────────────────────────────────────────

const AARTIS: DevotionalItem[] = [
  {
    slug: 'om-jai-jagdish-hare',
    type: 'aarti',
    title: { en: 'Om Jai Jagdish Hare', hi: 'ॐ जय जगदीश हरे' },
    deity: 'Vishnu',
    deityDay: 3,
    devanagari: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, दास जनों के संकट,
क्षण में दूर करे॥ ॐ जय जगदीश हरे॥

जो ध्यावे फल पावे, दुख बिनसे मन का,
स्वामी दुख बिनसे मन का।
सुख सम्पत्ति घर आवे, सुख सम्पत्ति घर आवे,
कष्ट मिटे तन का॥ ॐ जय जगदीश हरे॥

मात पिता तुम मेरे, शरण गहूँ मैं किसकी,
स्वामी शरण गहूँ मैं किसकी।
तुम बिन और न दूजा, तुम बिन और न दूजा,
आस करूँ मैं जिसकी॥ ॐ जय जगदीश हरे॥

तुम पूरण परमात्मा, तुम अन्तर्यामी,
स्वामी तुम अन्तर्यामी।
पार ब्रह्म परमेश्वर, पार ब्रह्म परमेश्वर,
तुम सब के स्वामी॥ ॐ जय जगदीश हरे॥

तुम करुणा के सागर, तुम पालनकर्ता,
स्वामी तुम पालनकर्ता।
मैं मूरख खल कामी, मैं सेवक तुम स्वामी,
कृपा करो भर्ता॥ ॐ जय जगदीश हरे॥

तुम हो एक अगोचर, सबके प्राणपति,
स्वामी सबके प्राणपति।
किस विधि मिलूँ दयामय, किस विधि मिलूँ दयामय,
तुमको मैं कुमति॥ ॐ जय जगदीश हरे॥

दीनबन्धु दुखहर्ता, ठाकुर तुम मेरे,
स्वामी ठाकुर तुम मेरे।
अपने हाथ उठाओ, अपनी शरण लगाओ,
द्वार पड़ा तेरे॥ ॐ जय जगदीश हरे॥

विषय विकार मिटाओ, पाप हरो देवा,
स्वामी पाप हरो देवा।
श्रद्धा भक्ति बढ़ाओ, श्रद्धा भक्ति बढ़ाओ,
सन्तन की सेवा॥ ॐ जय जगदीश हरे॥`,
    transliteration: `Om Jai Jagdish Hare, Swami Jai Jagdish Hare
Bhakt janon ke sankat, daas janon ke sankat,
Kshan mein door kare. Om Jai Jagdish Hare.

Jo dhyaave phal paave, dukh binase man ka,
Swami dukh binase man ka.
Sukh sampatti ghar aave, sukh sampatti ghar aave,
Kasht mite tan ka. Om Jai Jagdish Hare.

Maat pita tum mere, sharan gahoon main kiski,
Swami sharan gahoon main kiski.
Tum bin aur na dooja, tum bin aur na dooja,
Aas karoon main jiski. Om Jai Jagdish Hare.

Tum puran paramaatma, tum antaryaami,
Swami tum antaryaami.
Paar Brahm Parameshwar, paar Brahm Parameshwar,
Tum sab ke Swami. Om Jai Jagdish Hare.

Tum karuna ke saagar, tum paalankarta,
Swami tum paalankarta.
Main moorakh khal kaami, main sevak tum Swami,
Kripa karo bharta. Om Jai Jagdish Hare.

Tum ho ek agochar, sabke praanpati,
Swami sabke praanpati.
Kis vidhi miloon dayaamay, kis vidhi miloon dayaamay,
Tumko main kumati. Om Jai Jagdish Hare.

Deenbandhu dukhharta, Thakur tum mere,
Swami Thakur tum mere.
Apne haath uthaao, apni sharan lagaao,
Dwaar pada tere. Om Jai Jagdish Hare.

Vishay vikaar mitaao, paap haro Deva,
Swami paap haro Deva.
Shraddha bhakti badhaao, shraddha bhakti badhaao,
Santan ki seva. Om Jai Jagdish Hare.`,
    meaning: `The aarti 'Om Jai Jagdish Hare' is a profound devotional hymn, primarily addressed to Lord Vishnu, the preserver of the cosmos in the Hindu Trimurti. The opening invocation, 'Om Jai Jagdish Hare,' immediately establishes Vishnu as Jagadisha, the Supreme Lord of the Universe, whose glory is celebrated. The lyrics then praise His capacity to swiftly alleviate the 'sankat' (troubles) of His devotees, echoing His puranic role as the protector of dharma and the remover of obstacles, as exemplified in His various avatars.

The subsequent stanzas delve into the fruits of devotion, stating that those who meditate upon Him receive blessings, their mental sorrows ('dukh binase man ka') are dispelled, and prosperity ('sukh sampatti') enters their homes, while physical ailments ('kasht mite tan ka') are removed. This highlights Vishnu's all-encompassing nature as the bestower of both material well-being and spiritual solace. The devotee expresses a deep, personal relationship, proclaiming, 'Maat pita tum mere' (You are my mother and father), signifying complete surrender and reliance on Him as the sole refuge. This sentiment aligns with the concept of Prapatti, where the devotee places absolute trust in the divine.

The hymn further describes Vishnu's transcendental and immanent qualities: 'Tum puran paramaatma, tum antaryaami' (You are the complete Supreme Soul, the indwelling spirit), and 'Paar Brahm Parameshwar' (the Supreme Brahman, the ultimate Lord). This reflects His cosmic iconography, often depicted reclining on Shesha Naga, embodying the entire universe. He is lauded as the 'karuna ke saagar' (ocean of compassion) and 'paalankarta' (sustainer), reinforcing His role in maintaining cosmic order. The aarti concludes with a humble plea for grace, purification from 'vishay vikaar' (worldly desires and impurities), and an increase in 'shraddha bhakti' (faith and devotion), culminating in a desire to serve the saints, a hallmark of Vaishnava tradition.`,
    significance: `The 'Om Jai Jagdish Hare' aarti holds immense significance in Hindu devotional practice, serving as a universal prayer sung at the culmination of puja ceremonies in homes and temples alike. It is particularly associated with evening prayers, known as Sandhya Aarti, marking the transition from day to night, a time for introspection and spiritual connection. While suitable for daily recitation, it gains special potency on Thursdays (Brihaspativar), a day dedicated to Vishnu, and during major festivals such as Diwali, when Lakshmi (Vishnu's consort) is worshipped for prosperity, and during Navratri, when the cosmic order maintained by Vishnu is implicitly honoured.

Devotees turn to this aarti for a multitude of life situations: seeking relief from physical ailments, mental distress, financial difficulties, and for overall protection and well-being. It is believed to cleanse the atmosphere, purify the mind, and invoke divine blessings. The aarti is traditionally performed by circling a lit camphor lamp (diya) before the deity's image or murti, symbolising the offering of light, knowledge, and the removal of ignorance. The number of circulations, often three, five, or seven, carries symbolic meaning, representing various cosmic principles. Prior to recitation, devotees typically observe purification rituals such as bathing and wearing clean clothes, fostering a reverent state of mind.

This aarti complements more elaborate primary mantras, such as the Vishnu Sahasranama or the Maha Mantra (Om Namo Bhagavate Vasudevaya), by providing an accessible and congregational form of worship that deepens faith and devotion. Its widespread appeal transcends specific sectarian boundaries, making it a beloved hymn across diverse Hindu traditions.`,
  },
  {
    slug: 'ganesh-aarti',
    type: 'aarti',
    title: { en: 'Ganesh Aarti  –  Jai Ganesh Deva', hi: 'गणेश आरती  –  जय गणेश देवा' },
    deity: 'Ganesha',
    deityDay: 3,
    devanagari: `जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥

एक दन्त दयावन्त चार भुजा धारी।
माथे पर तिलक सोहे मूसे की सवारी॥
जय गणेश जय गणेश जय गणेश देवा॥

पान चढ़े फूल चढ़े और चढ़े मेवा।
लड्डुअन का भोग लगे सन्त करें सेवा॥
जय गणेश जय गणेश जय गणेश देवा॥

अन्धन को आँख देत कोढ़िन को काया।
बांझन को पुत्र देत निर्धन को माया॥
जय गणेश जय गणेश जय गणेश देवा॥

'सूर' श्याम शरण आए सफल कीजे सेवा।
माता जाकी पार्वती पिता महादेवा॥
जय गणेश जय गणेश जय गणेश देवा॥`,
    transliteration: `Jai Ganesh Jai Ganesh Jai Ganesh Deva
Mata jaki Parvati, Pita Mahadeva.

Ek dant dayavant, chaar bhuja dhaari.
Maathe par tilak sohe, moose ki savaari.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.

Paan chadhe phool chadhe aur chadhe meva.
Ladduan ka bhog lage, sant karein seva.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.

Andhon ko aankh det, kodhin ko kaaya.
Baanjhan ko putra det, nirdhan ko maaya.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.

'Soor' Shyam sharan aaye, safal keeje seva.
Mata jaki Parvati, Pita Mahadeva.
Jai Ganesh Jai Ganesh Jai Ganesh Deva.`,
    meaning: `The Ganesh Aarti, beginning with "Jai Ganesh Deva," is a heartfelt invocation to Lord Ganesha, revering him as the divine son of Parvati and Mahadeva (Lord Shiva), a lineage foundational to his Puranic origins, particularly as narrated in the Shiva Purana. The aarti proceeds to vividly describe his iconic form: "Ek dant dayavant, chaar bhuja dhaari" – the compassionate one with a single tusk and four arms. The single tusk, or Ekadanta, is often associated with the Puranic episode where he broke his own tusk to transcribe the Mahabharata for Vyasa, symbolising sacrifice for wisdom, or in another account, during a battle with Parashurama. His four arms represent his divine power and ability to hold various attributes, though not explicitly mentioned here, they signify his omnipresence and omnipotence. The "tilak sohe" (auspicious mark) on his forehead denotes spiritual wisdom and purity, while his mount, the mouse (Mushika), symbolises the conquering of desire and the ability to navigate through the smallest crevices of existence.

The central verses detail the traditional offerings: "Paan chadhe phool chadhe aur chadhe meva" – betel leaves, flowers, and dry fruits, culminating in his favourite, the modaka or laddus, which represent the sweetness of spiritual realisation and the rewards of devotion. The aarti then extols Ganesha's role as Siddhidata, the bestower of success, and Vighneshvara, the remover of obstacles. He is praised for granting sight to the blind, health to the ailing, progeny to the childless, and prosperity to the impoverished, reflecting his boundless compassion and ability to fulfil the earnest prayers of his devotees. The concluding stanza, attributed to a poet named 'Soor', is a humble plea for refuge and for one's service to be made fruitful, reinforcing the theme of surrender and devotion to the divine parents, Parvati and Mahadeva, through their beloved son, Ganesha.`,
    significance: `The Ganesh Aarti holds profound significance in Hindu devotional practice, serving as a powerful expression of reverence for Lord Ganesha, the harbinger of auspicious beginnings and the remover of obstacles (Vighneshvara). It is a staple during any puja, particularly at the climax when a lit camphor lamp (diya) is circled before the deity, symbolising the dispelling of darkness and the offering of light to the divine. Devotees often recite this aarti daily in homes and temples, establishing a routine connection with the divine.

Wednesday (Budhavar) is traditionally dedicated to Ganesha, making it an especially potent day for its recitation. The aarti's significance intensifies dramatically during Ganesh Chaturthi, the ten-day festival celebrated primarily in the Hindu month of Bhadrapada (August-September), especially in regions like Maharashtra, where Ganesha worship is deeply ingrained. During this period, the aarti is sung multiple times a day, often accompanied by elaborate rituals. Devotees turn to this aarti for a myriad of life situations: before embarking on new ventures, seeking success in education or business, desiring progeny, overcoming health challenges, or simply for general well-being and spiritual upliftment. It is believed that regular recitation, preferably after purification through bathing and with a focused mind, helps to align one's intentions with Ganesha's blessings. While primary mantras like Om Gam Ganapataye Namaha are potent for meditation and japa, the aarti complements them by providing a narrative and devotional framework, allowing for a more emotive and communal expression of faith, thereby deepening the devotee's connection to the elephant-headed deity.`,
  },
  {
    slug: 'lakshmi-aarti',
    type: 'aarti',
    title: { en: 'Lakshmi Aarti  –  Om Jai Lakshmi Mata', hi: 'लक्ष्मी आरती  –  ॐ जय लक्ष्मी माता' },
    deity: 'Lakshmi',
    deityDay: 5,
    devanagari: `ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।
तुमको निसदिन सेवत, हरि विष्णु विधाता॥
ॐ जय लक्ष्मी माता॥

उमा रमा ब्रह्माणी, तुम ही जग माता।
सूर्य चन्द्रमा ध्यावत, नारद ऋषि गाता॥
ॐ जय लक्ष्मी माता॥

दुर्गा रूप निरन्जनी, सुख सम्पत्ति दाता।
जो कोई तुमको ध्यावत, ऋद्धि सिद्धि धन पाता॥
ॐ जय लक्ष्मी माता॥

तुम ही पाताल निवासिनी, तुम ही शुभदाता।
कर्म प्रभाव प्रकाशिनी, भवनिधि की त्राता॥
ॐ जय लक्ष्मी माता॥

जिस घर में तुम रहती, ताँहि में हैं सद्गुण आता।
सब सम्भव हो जाता, मन नहीं घबराता॥
ॐ जय लक्ष्मी माता॥

तुम बिन यज्ञ न होते, वस्त्र न कोई पाता।
खान पान का वैभव, सब तुमसे आता॥
ॐ जय लक्ष्मी माता॥

शुभ गुण मन्दिर सुन्दर, क्षीरोदधि जाता।
रत्न चतुर्दश तुम बिन, कोई नहीं पाता॥
ॐ जय लक्ष्मी माता॥

महालक्ष्मीजी की आरती, जो कोई जन गाता।
उर आनन्द समाता, पाप उतर जाता॥
ॐ जय लक्ष्मी माता॥`,
    transliteration: `Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata.
Tumko nisdin sevat, Hari Vishnu Vidhata.
Om Jai Lakshmi Mata.

Uma Rama Brahmani, tum hi jag mata.
Surya Chandrama dhyavat, Narad rishi gaata.
Om Jai Lakshmi Mata.

Durga roop niranjani, sukh sampatti data.
Jo koi tumko dhyavat, riddhi siddhi dhan pata.
Om Jai Lakshmi Mata.

Tum hi pataal nivasini, tum hi shubhdata.
Karm prabhav prakashini, bhavnidhi ki traata.
Om Jai Lakshmi Mata.

Jis ghar mein tum rehti, taahin mein hain sadgun aata.
Sab sambhav ho jaata, man nahin ghabrata.
Om Jai Lakshmi Mata.

Tum bin yagya na hote, vastra na koi pata.
Khaan paan ka vaibhav, sab tumse aata.
Om Jai Lakshmi Mata.

Shubh gun mandir sundar, kshirodadhi jaata.
Ratna chaturdash tum bin, koi nahin pata.
Om Jai Lakshmi Mata.

Mahalakshmiji ki aarti, jo koi jan gaata.
Ur aanand samata, paap utar jaata.
Om Jai Lakshmi Mata.`,
    meaning: `The Lakshmi Aarti, "Om Jai Lakshmi Mata," is a heartfelt invocation and eulogy to Goddess Lakshmi, the divine embodiment of wealth, prosperity, and auspiciousness. The opening stanza immediately establishes her supreme status, declaring "Hari Vishnu Vidhata" (Lord Vishnu, the sustainer) serves her day and night, underscoring her inseparable connection with Narayana and her role in cosmic maintenance. This highlights her position as Vishnu's consort, Ramaa, who is integral to the preservation of dharma. The refrain "Om Jai Lakshmi Mata" serves as a perpetual salutation to the Divine Mother. 

The subsequent verses elaborate on her multifaceted nature. She is identified as "Uma, Rama, Brahmani," signifying her universal motherhood and her presence in the forms of Parvati, Lakshmi, and Saraswati, the consorts of the Trimurti. The reverence shown by "Surya Chandrama dhyavat, Narad rishi gaata" (Sun, Moon meditate, Narada sings) illustrates her cosmic influence and the devotion of celestial beings and great sages. Her form as "Durga roop niranjani" (pure form of Durga) suggests her power to overcome obstacles and bestow "sukh sampatti" (happiness and wealth), linking her to the fierce protective aspect of the Divine Mother. The promise that "riddhi siddhi dhan pata" (attains prosperity, spiritual powers, riches) for those who meditate on her underscores her capacity to grant both material and spiritual abundance.

The aarti further describes her as "pataal nivasini" (dweller of the netherworld) and "bhavnidhi ki traata" (rescuer from the ocean of worldly existence), indicating her omnipresence and salvific power. Her ability to illuminate "karm prabhav" (effects of karma) suggests her role in guiding devotees towards righteous action and mitigating karmic burdens. The text emphasizes that her presence brings "sadgun" (virtues) and makes "sab sambhav" (everything possible), removing fear. Crucially, the aarti states that without her, "yajna na hote, vastra na koi pata, khaan paan ka vaibhav" (no sacrifices, clothes, or food's splendour exist), affirming her as the source of all sustenance and material well-being. The allusion to "Kshirodadhi jaata" (born from the Ocean of Milk) and the "Ratna chaturdash" (fourteen gems) directly references the Samudra Manthan, where Lakshmi emerged as the most precious treasure, signifying her divine origin and supreme value. The concluding stanza promises "ur aanand samata, paap utar jaata" (heart fills with joy, sins are washed away) for those who sing her aarti, highlighting the spiritual purification and bliss derived from her devotion.`,
    significance: `The recitation of Lakshmi Aarti, particularly "Om Jai Lakshmi Mata," holds profound significance in Hindu devotional practice, serving as a powerful means to invoke the blessings of Goddess Lakshmi. It is traditionally performed at the culmination of a puja, as the lit camphor lamp (diya) is circled before the deity, symbolising the offering of light, purity, and devotion. The practice of circling the lamp, often three, five, seven, or eleven times, represents the circumambulation of the divine, acknowledging Lakshmi as the central source of all prosperity. The light from the lamp is believed to purify the atmosphere and dispel negative energies, creating an auspicious environment for the Goddess's presence.

This aarti is especially potent when recited on Fridays, the day dedicated to Goddess Lakshmi, and during the auspicious month of Shravan, which is replete with festivals and observances honouring the divine feminine. Its most prominent occasion is Diwali, particularly on Lakshmi Puja night, when households meticulously clean and decorate to welcome the Goddess, believing her presence ensures prosperity for the coming year. Devotees often prepare for the aarti by performing snana (ritual bath) and wearing clean, traditional attire, signifying inner and outer purity before approaching the divine.

Devotees turn to this aarti for a multitude of life-stage concerns. It is primarily sought for material prosperity, financial stability, and success in business ventures, reflecting Lakshmi's role as the bestower of wealth (dhana). Beyond monetary gains, the aarti is also recited for spiritual wealth, auspiciousness (shubh labh), harmony in the home, good fortune, and the removal of obstacles that impede progress. It is believed to instil virtues, courage, and mental peace, as the presence of Lakshmi dispels fear and anxiety. While the aarti itself is a complete prayer, its regular recitation complements the practice of primary Lakshmi mantras, such as Om Hreem Shreem Lakshmībhyo Namah, by providing a devotional, communal, and emotionally resonant expression of faith, deepening the connection with the divine energy of abundance.`,
  },
  {
    slug: 'hanuman-aarti',
    type: 'aarti',
    title: { en: 'Hanuman Aarti', hi: 'हनुमान आरती' },
    deity: 'Hanuman',
    deityDay: 2,
    devanagari: `आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की॥

जाके बल से गिरिवर काँपे।
रोग दोष जाके निकट न झाँके॥

अंजनि पुत्र महा बलदाई।
सन्तन के प्रभु सदा सहाई॥

दे बीरा रघुनाथ पठाए।
लंका जलाय सिया सुधि लाए॥

लंका सो कोट समुद्र सी खाई।
जात पवनसुत बार न लाई॥

लंका जारि असुर सँहारे।
सियारामजी के काज सँवारे॥

लक्ष्मण मूर्छित पड़े सकारे।
आणि सजीवन प्राण उबारे॥

पैठी पाताल तोरि जम कारे।
अहिरावण की भुजा उखाड़े॥

बायें भुजा असुरदल मारे।
दाहिने भुजा सन्तजन तारे॥

सुर नर मुनि आरती उतारें।
जय जय जय हनुमान उचारें॥

कंचन थार कपूर लौ छाई।
आरती करत अंजना माई॥

जो हनुमानजी की आरती गावे।
बसि बैकुण्ठ परम पद पावे॥`,
    transliteration: `Aarti keejai Hanuman lala ki.
Dusht dalan Raghunath kala ki.

Jake bal se girivar kaanpe.
Rog dosh jake nikat na jhaanke.

Anjani putra maha baldaai.
Santan ke prabhu sada sahaai.

De beera Raghunath pathaaye.
Lanka jalay Siya sudhi laaye.

Lanka so kot samudra si khaai.
Jaat Pavansut baar na laai.

Lanka jaari asur sanhaare.
Siyaramji ke kaaj sanvaare.

Lakshman moorchit pade sakaare.
Aani Sajeevan praan ubaare.

Paithi pataal tori Yam kaare.
Ahiravan ki bhuja ukhaade.

Baayein bhuja asurdal maare.
Daahine bhuja santjan taare.

Sur nar muni aarti utaarein.
Jai jai jai Hanuman uchaarein.

Kanchan thaar kapoor lau chhaai.
Aarti karat Anjana Maai.

Jo Hanumanji ki aarti gaave.
Basi Baikunth param pad paave.`,
    meaning: `The Hanuman Aarti commences by invoking Hanuman as "lala," a term of endearment signifying a beloved child, immediately establishing a tender, devotional connection. It identifies him as "Dusht dalan Raghunath kala ki" – the destroyer of evil and an embodiment of Lord Rama's divine power (kala). This opening stanza sets the tone, highlighting his dual role as a fierce protector and a divine emanation.

The subsequent verses elaborate on his immense strength, stating, "Jake bal se girivar kaanpe," signifying his ability to shake mountains, a reference to his legendary feat of carrying the Dronagiri mountain. The line "Rog dosh jake nikat na jhaanke" assures devotees that diseases and afflictions cannot approach one under his protection, reflecting his role as a remover of obstacles and suffering. Hanuman is praised as "Anjani putra maha baldaai," the mighty son of Anjani, and "Santan ke prabhu sada sahaai," the eternal helper of saints.

The Aarti then recounts pivotal episodes from the Ramayana. His heroic journey to Lanka is vividly described: "De beera Raghunath pathaaye, Lanka jalay Siya sudhi laaye" – how he was sent by Rama, burned Lanka, and brought back news of Sita. The text emphasizes his speed and strength in crossing the ocean ("Lanka so kot samudra si khaai, Jaat Pavansut baar na laai"), underscoring his epithet "Pavansut" (son of the wind). His actions in Lanka, "Lanka jaari asur sanhaare, Siyaramji ke kaaj sanvaare," highlight his role in destroying demons and fulfilling Rama and Sita's mission. Further heroic deeds include saving Lakshmana with the Sanjeevani herb ("Lakshman moorchit pade sakaare, Aani Sajeevan praan ubaare") and his descent into Patala to defeat Ahiravana ("Paithi pataal tori Yam kaare, Ahiravan ki bhuja ukhaade"). The Aarti concludes by depicting his cosmic reverence, with "Sur nar muni aarti utaarein," indicating that gods, humans, and sages all perform his Aarti. The final stanza promises "param pad paave" (supreme abode) for those who sing his praise, reinforcing the spiritual merit of this devotional act. The mention of "Kanchana thaar Kapoor lau chhaai, Aarti karat Anjana Maai" beautifully visualises the Aarti ritual, with his mother Anjana herself performing it, adding a touch of personal devotion and cosmic significance.`,
    significance: `The Hanuman Aarti is a potent devotional hymn, typically recited at the culmination of a puja, particularly for Lord Hanuman. Its recitation is highly auspicious on Tuesdays and Saturdays, these days being traditionally dedicated to Hanuman and Shani (Saturn) respectively, as Hanuman is believed to mitigate the malefic effects of Shani. During the festival of Hanuman Jayanti, the observance of this Aarti intensifies, becoming a central practice for devotees seeking his blessings.

Devotees turn to Hanuman for a myriad of life-stage concerns. He is revered as Sankat Mochan, the remover of troubles, making this Aarti a solace for those facing difficulties, fear, or uncertainty. Students often recite it for focus and success in examinations, while individuals seeking physical strength, courage, and protection from negative influences (including planetary afflictions or 'doshas') find immense comfort and empowerment. It is also a prayer for unwavering devotion, as Hanuman himself is the epitome of selfless service and Bhakti to Lord Rama.

The Aarti is performed by circling a lit camphor lamp (diya) before the deity's image, typically three, five, or seven times, symbolising the offering of one's entire being and the dispelling of darkness. The camphor's complete combustion without residue signifies the dissolution of ego. Before recitation, purification through bathing and wearing clean clothes is customary. While the Aarti itself is a complete act of devotion, it beautifully complements primary Hanuman mantras such as the "Om Hum Hanumate Namaha" or the "Hanuman Chalisa," serving as a concluding prayer that encapsulates the deity's glory and deeds. In some regional traditions, particularly in North India, the Aarti is sung with great fervour in community gatherings, reinforcing collective faith and devotion.`,
  },
  {
    slug: 'shiv-aarti',
    type: 'aarti',
    title: { en: 'Shiva Aarti  –  Om Jai Shiv Omkara', hi: 'शिव आरती  –  ॐ जय शिव ओमकारा' },
    deity: 'Shiva',
    deityDay: 1,
    devanagari: `ॐ जय शिव ओमकारा, स्वामी जय शिव ओमकारा।
ब्रह्मा विष्णु सदाशिव, अर्द्धांगी धारा॥
ॐ जय शिव ओमकारा॥

एकानन चतुरानन पंचानन राजे।
हंसासन गरुड़ासन वृषवाहन साजे॥
ॐ जय शिव ओमकारा॥

दो भुज चार चतुर्भुज दसभुज अति सोहे।
तीनों रूप निरखता त्रिभुवन जन मोहे॥
ॐ जय शिव ओमकारा॥

अक्षमाला वनमाला मुण्डमाला धारी।
त्रिपुरारी कंसारी कर माला धारी॥
ॐ जय शिव ओमकारा॥

श्वेताम्बर पीताम्बर बाघम्बर अंगे।
सनकादिक गरुणादिक भूतादिक संगे॥
ॐ जय शिव ओमकारा॥

कर के मध्य कमण्डलु चक्र त्रिशूलधारी।
सुखकारी दुखहारी जगपालनकारी॥
ॐ जय शिव ओमकारा॥

ब्रह्मा विष्णु सदाशिव जानत अविवेका।
प्रणवाक्षर में शोभित ये तीनों एका॥
ॐ जय शिव ओमकारा॥

त्रिगुण शिवजी की आरती जो कोई नर गावे।
कहत शिवानन्द स्वामी मनवांछित फल पावे॥
ॐ जय शिव ओमकारा॥`,
    transliteration: `Om Jai Shiv Omkara, Swami Jai Shiv Omkara.
Brahma Vishnu Sadashiv, ardhangee dhara.
Om Jai Shiv Omkara.

Ekanan chaturanan panchanan raaje.
Hansasan garudasan vrishvahan saaje.
Om Jai Shiv Omkara.

Do bhuj chaar chaturbhuj dasbhuj ati sohe.
Teenon roop nirakhta tribhuvan jan mohe.
Om Jai Shiv Omkara.

Akshmala vanmala mundmala dhari.
Tripurari Kansari kar mala dhari.
Om Jai Shiv Omkara.

Shvetambar pitambar baghambar ange.
Sankadik Garunadik Bhutadik sange.
Om Jai Shiv Omkara.

Kar ke madhya kamandalu chakra trishuldhari.
Sukhkari dukhari jagpalankari.
Om Jai Shiv Omkara.

Brahma Vishnu Sadashiv janat aviveka.
Pranavakshar mein shobhit ye teenon eka.
Om Jai Shiv Omkara.

Trigun Shivji ki aarti jo koi nar gaave.
Kahat Shivanand Swami manvanchhit phal paave.
Om Jai Shiv Omkara.`,
    meaning: `The Shiva Aarti, commencing with the resonant 'Om Jai Shiv Omkara', is a profound hymn that extols Lord Shiva as the ultimate reality, the very embodiment of the primordial sound Om. The opening stanza immediately establishes Shiva's supremacy by stating, 'Brahma Vishnu Sadashiv, ardhangee dhara', signifying that Shiva encompasses the entire Trimurti – Brahma the creator, Vishnu the preserver, and Sadashiva the dissolver and regenerator – and further, that he holds his consort, Parvati, as half of his being, symbolising the inseparable union of Purusha (consciousness) and Prakriti (energy) in the form of Ardhanarishvara.

The subsequent verses paint a vivid, multifaceted portrait of Shiva, transcending conventional forms. He is described with 'Ekanan chaturanan panchanan raaje', possessing one face (as an ascetic), four faces (like Brahma), and five faces (representing his five aspects: Sadyojata, Vamadeva, Aghora, Tatpurusha, and Ishana). His mounts too reflect this cosmic inclusivity: the Hamsa (swan of Brahma), Garuda (eagle of Vishnu), and his own Vrishabha (Nandi, the bull). Similarly, his arms range from two (human-like) to four (like Vishnu) and ten (denoting his fierce, all-encompassing power), captivating the three worlds. His garlands – Akshamala (rudraksha beads for spiritual practice), Vanmala (forest flowers, connecting to nature), and Mundmala (skulls, symbolising triumph over death and ego) – highlight his diverse aspects from ascetic to fearsome destroyer. The epithets Tripurari (destroyer of the three cities of the Asuras) and Kansari (slayer of Kamsa, a deed of Vishnu) further underscore his identity as the unified cosmic Lord. He is adorned in Shvetambar (white, purity), Pitambar (yellow, Vishnu's attire), and Baghambar (tiger skin, asceticism), holding a Kamandalu (water pot), Chakra (Vishnu's discus), and Trishula (his trident), signifying his roles as creator, preserver, and destroyer. The Aarti culminates in the profound declaration that the distinctions between Brahma, Vishnu, and Sadashiva are merely perceived by the 'aviveka' (ignorant), for 'Pranavakshar mein shobhit ye teenon eka' – these three are gloriously united in the sacred syllable Om, affirming the Advaitic truth of non-duality. The Phalashruti promises that devotion to this 'Trigun Shivji' (Shiva embodying the three Gunas) grants all heart's desires.`,
    significance: `The Shiva Aarti, particularly 'Om Jai Shiv Omkara', holds immense spiritual significance for devotees, serving as a powerful expression of devotion and a means to connect with the divine. It is traditionally recited at the culmination of a puja, as the sacred flame of a diya (lamp) is circled before the deity, symbolising the offering of light, love, and the five elements. The lamp is typically fuelled by ghee or oil with a cotton wick, and camphor is often lit for its purifying aroma and bright flame.

This Aarti is especially potent when performed on Mondays (Somvar), which are dedicated to Lord Shiva. Its recitation is intensified during the holy month of Shravan Maas, the auspicious period of Maha Shivaratri, and during Pradosh Vrat, the twilight period on the thirteenth day of each lunar fortnight, all considered highly propitious for Shiva worship. Devotees often turn to this Aarti for a multitude of life-stage concerns: for general well-being, peace of mind, removal of obstacles, spiritual growth, and the fulfilment of righteous desires, as promised in the concluding verse. It is believed to invoke Shiva's blessings for protection, prosperity, and liberation from the cycle of birth and death. While there's no strict prescribed count, performing the Aarti with full devotion, often circling the lamp three, five, seven, or eleven times, is common. Prior to recitation, devotees typically purify themselves through bathing and wearing clean clothes, creating a sattvic environment. This Aarti beautifully complements the primary Shiva mantras, such as the Om Namah Shivaya or the Maha Mrityunjaya Mantra, serving as a concluding prayer that encapsulates the essence of Shiva's glory and his all-encompassing nature. Its syncretic message, unifying the Trimurti, makes it widely revered across various Hindu traditions, particularly among Shaivites and Smarthas, throughout India.`,
  },
  {
    slug: 'durga-aarti',
    type: 'aarti',
    title: { en: 'Durga Aarti  –  Jai Ambe Gauri', hi: 'दुर्गा आरती  –  जय अम्बे गौरी' },
    deity: 'Durga',
    deityDay: 2,
    devanagari: `जय अम्बे गौरी, मैया जय श्यामा गौरी।
तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी॥
जय अम्बे गौरी॥

माँग सिन्दूर विराजत, टीको मृगमद को।
उज्ज्वल से दोउ नैना, चन्द्रवदन नीको॥
जय अम्बे गौरी॥

कनक समान कलेवर, रक्ताम्बर राजे।
रक्तपुष्प गल माला, कण्ठन पर साजे॥
जय अम्बे गौरी॥

केहरि वाहन राजत, खड्ग खप्परधारी।
सुर नर मुनिजन सेवत, तिनके दुखहारी॥
जय अम्बे गौरी॥

कानन कुण्डल शोभित, नासाग्रे मोती।
कोटिक चन्द्र दिवाकर, सम राजत ज्योती॥
जय अम्बे गौरी॥

शुम्भ निशुम्भ विदारे, महिषासुर घाती।
धूम्र विलोचन नैना, निशदिन मदमाती॥
जय अम्बे गौरी॥

चौंसठ योगिनि गावत, नृत्य करत भैरों।
बाजत ताल मृदंगा, और बाजत डमरू॥
जय अम्बे गौरी॥

भुजा चार अति शोभित, वर मुद्रा धारी।
मनवाञ्छित फल पावत, सेवत नर नारी॥
जय अम्बे गौरी॥

कंचन थाल विराजत, अगर कपूर बाती।
श्रीमालकेतु में राजत, कोटि रतन ज्योती॥
जय अम्बे गौरी॥

श्री अम्बेजी की आरती, जो कोई नर गावे।
कहत शिवानन्द स्वामी, सुख सम्पत्ति पावे॥
जय अम्बे गौरी॥`,
    transliteration: `Jai Ambe Gauri, Maiya Jai Shyama Gauri.
Tumko nishdin dhyaavat, Hari Brahma Shivri.
Jai Ambe Gauri.

Maang sindoor virajat, teeko mrigmad ko.
Ujjwal se dou naina, chandravadan neeko.
Jai Ambe Gauri.

Kanak samaan kalevar, raktambar raaje.
Raktapushp gal mala, kanthan par saaje.
Jai Ambe Gauri.

Kehari vaahan raajat, khadg khappardhari.
Sur nar munijan sevat, tinke dukhari.
Jai Ambe Gauri.

Kaanan kundal shobhit, naasagre moti.
Kotik chandra divakar, sam rajat jyoti.
Jai Ambe Gauri.

Shumbh Nishumbh vidaare, Mahishasur ghaati.
Dhumra vilochan naina, nishdin madmaati.
Jai Ambe Gauri.

Chaunsath yogini gaavat, nritya karat Bhairon.
Baajat taal mridanga, aur baajat damru.
Jai Ambe Gauri.

Bhuja chaar ati shobhit, var mudra dhari.
Manvanchhit phal paavat, sevat nar naari.
Jai Ambe Gauri.

Kanchan thaal virajat, agar kapoor baati.
Shri Malketu mein rajat, koti ratan jyoti.
Jai Ambe Gauri.

Shri Ambeji ki aarti, jo koi nar gaave.
Kahat Shivanand Swami, sukh sampatti paave.
Jai Ambe Gauri.`,
    meaning: `The "Jai Ambe Gauri" Aarti is a profound devotional hymn celebrating the multifaceted glory of Goddess Durga, an embodiment of Shakti, the divine feminine cosmic energy. The opening lines immediately invoke her as Ambe Gauri and Shyama Gauri, acknowledging her dual aspects – the radiant, fair Gauri and the dark, mysterious Shyama, reflecting her role as both benevolent mother and fierce warrior. The hymn establishes her supreme status by stating that even the Trimurti – Hari (Vishnu), Brahma, and Shiva – constantly meditate upon her, signifying her as the ultimate source of creation, preservation, and dissolution.

The subsequent stanzas vividly describe Durga's iconic form. Her \`maang sindoor\` (vermillion in the hair parting) and \`mrigmad teeka\` (musk mark on the forehead) symbolise auspiciousness and spiritual awakening. Her \`chandravadan\` (moon-like face) and \`ujjwal naina\` (bright eyes) convey serenity and divine wisdom, while her \`kanak samaan kalevar\` (golden body) draped in \`raktambar\` (red garments) signifies purity, power, and passion. A \`raktapushp gal mala\` (garland of red flowers) further enhances her vibrant, active energy.

The Aarti then shifts to her martial prowess. She is depicted riding her \`kehari vaahan\` (lion mount), symbolising courage and control over untamed instincts. Her \`khadg\` (sword) represents discrimination and the destruction of ignorance, while the \`khappar\` (skull-cup) signifies her role in annihilating evil and consuming negativity. The hymn explicitly references her Puranic exploits, particularly her slaying of the formidable demons Shumbha, Nishumbha, and Mahishasura, as detailed in the Devi Mahatmya. Her \`dhumra vilochan naina\` (smoky eyes) are described as \`madmaati\` (intoxicated with divine fervour), reflecting her fierce determination to protect the cosmos. The presence of \`chaunsath yogini\` (sixty-four Yoginis) singing and Bhairava dancing underscores her cosmic retinue and her dominion over both benevolent and fierce spiritual forces. Her \`bhuja chaar\` (four arms) holding various implements, including the \`var mudra\` (boon-granting gesture), assure devotees of her protective and benevolent nature. The concluding verses affirm that those who serve her attain \`manvanchhit phal\` (heart's desires), \`sukh\` (happiness), and \`sampatti\` (prosperity), reinforcing the belief in her boundless grace.`,
    significance: `The "Jai Ambe Gauri" Aarti holds profound significance in Hindu devotional practice, serving as a powerful expression of reverence for Goddess Durga. It is traditionally recited at the culmination of daily puja, particularly in homes and temples dedicated to the Divine Mother. While suitable for daily devotion, its recitation intensifies on specific days and during major festivals. Tuesdays and Fridays are considered especially auspicious for worshipping Durga, making these days prime for offering this Aarti. The nine-night festival of Navaratri, dedicated to the nine forms of Durga, sees this Aarti performed with immense fervour, often accompanying community celebrations like Garba and Dandiya in various regions, particularly Gujarat.

Devotees turn to this Aarti for a multitude of life situations, seeking the Goddess's divine intervention and blessings. It is believed to invoke her protective energy, removing obstacles, fears, and sorrows (\`dukhari\`), as highlighted in the hymn itself. Individuals facing challenges, seeking strength, or desiring material and spiritual well-being (\`sukh sampatti\`) frequently offer this prayer. The Aarti complements the primary mantras of Durga, such as the Navarna Mantra ("Om Aim Hrim Klim Chamundaye Vichche"), by providing a lyrical, accessible means of expressing devotion and gratitude after japa or meditation.

The performance of the Aarti involves specific rituals. A \`kanchan thaal\` (golden plate) or similar offering tray is prepared with a lit \`agar\` (incense) and \`kapoor baati\` (camphor lamp). The lamp is circled before the deity in a clockwise direction, typically seven times, symbolising the offering of light, warmth, and purity. Before recitation, devotees often purify themselves through a bath and wear clean clothes, creating a sacred atmosphere. The collective singing of this Aarti fosters a sense of community and shared devotion, reinforcing the belief that through sincere praise, one can attain \`manvanchhit phal\` (desired outcomes) and experience the Mother's boundless grace, as Swami Shivanand's concluding verse attests.`,
  },
  {
    slug: 'saraswati-aarti',
    type: 'aarti',
    title: { en: 'Saraswati Aarti', hi: 'सरस्वती आरती' },
    deity: 'Saraswati',
    deityDay: 4,
    devanagari: `जय सरस्वती माता, मैया जय सरस्वती माता।
सदगुण वैभव शालिनी, त्रिभुवन विख्याता॥
जय सरस्वती माता॥

चन्द्रवदनी पद्मासिनी, द्युतिमान् गुण खानी।
शुभ वसना परिधानिनी, ज्ञान दायिनी ज्ञानी॥
जय सरस्वती माता॥

पुस्तक एक हाथ में, दूजे हाथ सुहाए।
मन्द मन्द मुस्कान दे, जगत को उजियाए॥
जय सरस्वती माता॥

कामधेनु सी तुम सदा, चिन्तामणि सी बानी।
प्रेम सहित जो ध्याए, ताका दुःख निवानी॥
जय सरस्वती माता॥

तुम्हीं भवानी तुम्हीं भगवती, ब्रह्माणी कहाये।
सरस्वती स्तुति गाये अति सुख सम्पत पाये॥
जय सरस्वती माता॥`,
    transliteration: `Jai Saraswati Mata, Maiya Jai Saraswati Mata.
Sadgun vaibhav shalini, tribhuvan vikhyata.
Jai Saraswati Mata.

Chandravadani padmasini, dyutiman gun khani.
Shubh vasna paridhanini, gyan dayini gyani.
Jai Saraswati Mata.

Pustak ek haath mein, dooje haath suhaaye.
Mand mand muskaan de, jagat ko ujiyaaye.
Jai Saraswati Mata.

Kamdhenu si tum sada, chintamani si bani.
Prem sahit jo dhyaye, taka dukh nivani.
Jai Saraswati Mata.

Tumhi Bhavani tumhi Bhagvati, Brahmani kahaaye.
Saraswati stuti gaaye ati sukh sampat paaye.
Jai Saraswati Mata.`,
    meaning: `The Saraswati Aarti is a profound devotional hymn that extols the virtues and attributes of Devi Saraswati, the Hindu Goddess of knowledge, arts, music, wisdom, and eloquence. The opening invocation, "Jai Saraswati Mata, Maiya Jai Saraswati Mata," establishes a tone of reverent salutation, acknowledging her as the divine Mother who is "sadgun vaibhav shalini" (endowed with virtues and splendour) and "tribhuvan vikhyata" (renowned across the three worlds – physical, astral, and causal). This immediately places her as a supreme cosmic power, essential for the functioning and illumination of existence.

The subsequent verses delve into her iconic representation, which serves as a visual meditation for devotees. She is described as "Chandravadani padmasini," possessing a moon-like countenance, symbolising serenity, purity, and inner light, and seated upon a lotus, representing purity, spiritual awakening, and transcendence above worldly attachments, as the lotus grows in mud yet remains unsullied. Her radiance is further emphasised as "dyutiman gun khani" (a radiant treasure of qualities) and "shubh vasna paridhanini" (clad in auspicious garments), typically white, signifying purity and knowledge. As "gyan dayini gyani," she is both the bestower of knowledge and the embodiment of all wisdom.

The aarti continues to describe her attributes: "Pustak ek haath mein, dooje haath suhaaye," depicting her holding a book, symbolising the Vedas and all forms of learning, and her other hand in a gesture of grace or holding a mala or Veena, though not explicitly mentioned here, the "suhaaye" (gracing beauty) implies her artistic and benevolent aspect. Her "mand mand muskaan" (gentle smile) illuminates the world, signifying the joy and clarity that true knowledge brings. The hymn elevates her power by comparing her to Kamadhenu, the wish-fulfilling cow, and Chintamani, the wish-granting gem, asserting that sincere devotion to her removes all sorrows ("taka dukh nivani"). The closing lines, "Tumhi Bhavani tumhi Bhagvati, Brahmani kahaaye," identify her with the primordial feminine energy (Shakti) and as the consort of Brahma, the creator, affirming her role in the creation and sustenance of knowledge. Singing her praise ("Saraswati stuti gaaye") is declared to bring immense happiness and prosperity, both material and spiritual.`,
    significance: `The Saraswati Aarti holds profound significance for devotees, serving as a powerful ritualistic expression of reverence and aspiration towards the Goddess of wisdom. It is typically recited at the culmination of a puja, accompanied by the circling of a lit camphor lamp (diya) before the deity, symbolising the offering of light, consciousness, and devotion. This act purifies the atmosphere and invokes the divine presence.

While daily recitation is beneficial for cultivating a mind attuned to learning and creativity, the Aarti gains particular intensity during specific periods. Thursdays are traditionally considered auspicious for Saraswati worship, aligning with the planetary influence of Jupiter (Brihaspati), which governs knowledge and wisdom. The most prominent festival for her worship is Vasant Panchami, also known as Saraswati Puja, which marks the advent of spring and is widely celebrated in educational institutions and by students, artists, and scholars. During Navratri, especially on the fifth day (Panchami Tithi), Saraswati is invoked as one of the nine forms of Durga, highlighting her role as a facet of cosmic energy.

Devotees turn to this Aarti for a myriad of life situations, predominantly seeking clarity of thought, enhanced memory, eloquence, and success in academic or artistic pursuits. Students often recite it before examinations or the commencement of new educational ventures. Artists and musicians invoke her for inspiration and mastery of their craft. The Aarti is also a plea for the removal of ignorance and mental obstacles, fostering a deeper understanding of spiritual truths. While there isn't a strict prescribed count for Aarti recitation, the sincerity and regularity of the offering are paramount. It complements the primary mantras of Saraswati, such as "Om Aim Saraswatyai Namaha," by providing a narrative and emotional connection to the deity, deepening the meditative experience. Purification through bathing and wearing clean clothes before recitation is customary, reflecting respect for the divine. This practice is widespread across various Hindu traditions, particularly in North India and among academic communities globally.`,
  },
  {
    slug: 'krishna-aarti',
    type: 'aarti',
    title: { en: 'Krishna Aarti  –  Aarti Kunj Bihari Ki', hi: 'कृष्ण आरती  –  आरती कुञ्ज बिहारी की' },
    deity: 'Krishna',
    deityDay: 3,
    devanagari: `आरती कुञ्ज बिहारी की, श्री गिरिधर कृष्ण मुरारी की॥

गले में बैजन्ती माला, बजावै मुरली मधुर बाला।
श्रवण में कुण्डल झलकाला, नन्द के आनन्द नन्दलाला॥
गगन सम अंग कान्ति काली, राधिका चमक रही आली।
लतन में ठाढ़े बनमाली, भ्रमर सी अलक, कस्तूरी तिलक लाली॥

छबि बनी अद्भुत, सबनि मोहन लीला की।
आरती कुञ्ज बिहारी की॥

कनकमय मोर मुकुट बिलसै, देवता दर्शन को तरसैं।
गगन सों सुमन रासि बरसैं, भजन में हरि का आनन्द बरसैं॥
चतुर्भुज, लक्ष्मीपत सुखकारी, सुर-बरणी सबकी रखवारी।
भक्तन को भय हरन मुरारी, पावन निवास नगर मथुरा री॥

यमुना तट समुदिति बाला, गोप ग्वालन संग खेला।
आरती कुञ्ज बिहारी की, श्री गिरिधर कृष्ण मुरारी की॥`,
    transliteration: `Aarti Kunj Bihari ki, Shri Giridhar Krishna Murari ki.

Gale mein Baijanti mala, bajaave murli madhur bala.
Shravan mein kundal jhalakala, Nand ke anand Nandlala.
Gagan sam ang kanti kali, Radhika chamak rahi aali.
Latan mein thadhe Banmali, bhramar si alak, kasturi tilak lali.

Chhabi bani adbhut, sabni Mohan leela ki.
Aarti Kunj Bihari ki.

Kanakmay mor mukut bilsai, devta darshan ko tarsain.
Gagan son suman rasi barsain, bhajan mein Hari ka anand barsain.
Chaturbhuj, Lakshmipat sukhkari, sur-barni sabki rakhwari.
Bhaktan ko bhay haran Murari, paavan nivas nagar Mathura ri.

Yamuna tat samuditi bala, Gop Gwalan sang khela.
Aarti Kunj Bihari ki, Shri Giridhar Krishna Murari ki.`,
    meaning: `This Aarti, 'Aarti Kunj Bihari Ki,' is a heartfelt invocation and praise of Lord Krishna, celebrating His enchanting form and divine exploits. It begins by hailing Him as 'Kunj Bihari,' the delightful dweller of the groves of Vrindavan, evoking His pastoral and playful aspect. He is further glorified as 'Giridhar,' the one who lifted the Govardhan Hill, a puranic narrative from the Bhagavata Purana that exemplifies His role as the protector of His devotees from natural calamities and divine wrath. The epithet 'Murari' refers to Krishna as the vanquisher of the demon Mura, symbolising His power to overcome evil and ignorance.

The verses vividly describe Krishna's iconic appearance: the Vaijayanti garland adorning His neck, traditionally representing the five elements or the five kinds of beings, and His melodious flute, which enchants all creation. His glittering earrings and the endearing title 'Nandlala' highlight His cherished childhood in Gokul. His dark, sky-like complexion, a hallmark of His divine beauty, is contrasted with the radiant presence of Radhika by His side, signifying the inseparable divine feminine energy. The imagery of 'Banmali' (the garlanded one) standing amidst creepers, with bee-like curls and a musk tilak, further paints a picture of His captivating form in the sylvan setting of Vrindavan.

The Aarti then expands to His cosmic stature, noting that even the gods yearn for His sight, and flowers shower from the heavens in His honour. The mention of 'Chaturbhuj' (four-armed) and 'Lakshmipat' (consort of Lakshmi) connects Krishna to His supreme form as Vishnu-Narayana, the preserver of the universe and bestower of happiness. He is lauded as the protector of all and the remover of devotees' fears. The Aarti concludes by reiterating His playful nature on the banks of the Yamuna with the gopas and gopis, firmly rooting His divine presence in the sacred land of Mathura and Vrindavan.`,
    significance: `The 'Krishna Aarti – Aarti Kunj Bihari Ki' holds profound significance in Vaishnava devotional practice, particularly within the traditions centred around Lord Krishna's leelas in Vrindavan and Mathura. It is commonly recited at the climax of daily puja, especially during the evening (sandhya) aarti in temples like the Banke Bihari Temple in Vrindavan and ISKCON centres worldwide, as well as in countless Hindu homes.

Devotees often perform this aarti on Wednesdays, a day traditionally associated with the worship of Vishnu and His avatars, including Krishna. Its recitation intensifies during major Krishna-related festivals such as Janmashtami (Krishna's birth anniversary), Holi (the festival of colours celebrating His playful leelas), and Radha Ashtami (the appearance day of Radha, His divine consort). During the auspicious month of Kartik, dedicated to Damodara Krishna, this aarti also forms an integral part of daily worship.

The ritual involves circulating a lit lamp, typically fuelled by ghee or camphor, in a clockwise direction before the deity. Traditionally, five or seven circles are performed, symbolising the offering of the five elements or the complete surrender of the devotee. The burning camphor signifies the dissolution of the ego into divine light, while the steady flame of a ghee lamp represents the unwavering light of knowledge and devotion. Devotees turn to this aarti seeking spiritual joy, protection from fear and adversity (invoking Krishna as Murari), and the cultivation of pure devotion (bhakti). It is believed to bring harmony, peace of mind, and divine grace, complementing the recitation of primary mantras like 'Om Namo Bhagavate Vasudevaya' or the 'Hare Krishna Mahamantra' by providing a multi-sensory devotional experience.`,
  },
  {
    slug: 'ram-aarti',
    type: 'aarti',
    title: { en: 'Ram Aarti  –  Shri Ramchandra Kripalu Bhajman', hi: 'राम आरती  –  श्री रामचन्द्र कृपालु भजमन' },
    deity: 'Rama',
    deityDay: 3,
    devanagari: `श्री रामचन्द्र कृपालु भजमन हरण भवभय दारुणम्।
नवकञ्ज लोचन कञ्ज मुख कर कञ्ज पद कञ्जारुणम्॥

कन्दर्प अगणित अमित छवि नव नील नीरद सुन्दरम्।
पटपीत मानहुँ तड़ित रुचि शुचि नौमि जनक सुतावरम्॥

भजु दीनबन्धु दिनेश दानव दैत्य वंश निकन्दनम्।
रघुनन्द आनन्दकन्द कोशलचन्द दशरथ नन्दनम्॥

सिर मुकुट कुण्डल तिलक चारु उदारु अंग विभूषणम्।
आजानुभुज शर चापधर संग्राम जित खरदूषणम्॥

इति वदति तुलसीदास शंकर शेष मुनि मन रञ्जनम्।
मम हृदय कुञ्ज निवास कुरु कामादि खल दल गञ्जनम्॥`,
    transliteration: `Shri Ramchandra kripalu bhajaman, haran bhavbhay daarunam.
Navkanj lochan kanj mukh, kar kanj pad kanjarunam.

Kandarp aganit amit chhabi, nav neel neerad sundaram.
Patpeet manahun tadit ruchi, shuchi naumi Janak Sutavaram.

Bhaju Deenbandhu Dinesh, Daanav Daitya vansh nikandanam.
Raghunand Aanandkand, Koshalchand Dasharath Nandanam.

Sir mukut kundal tilak, chaaru udaaru ang vibhooshanam.
Aajaanubhuj shar chaapdhar, sangraam jit Khardooshanam.

Iti vadati Tulsidas Shankar, Shesh Muni man ranjanam.
Mam hriday kunj nivas kuru, Kaamadi khal dal ganjanam.`,
    meaning: `The "Shri Ramchandra Kripalu Bhajaman" Aarti, attributed to Goswami Tulsidas, is a profound devotional hymn that vividly paints the divine attributes of Lord Rama. It commences with an invocation to worship the compassionate Ramchandra, the remover of the formidable fear of worldly existence (bhavbhay daarunam). The opening stanza immediately establishes Rama's iconic beauty, describing His eyes, face, hands, and feet as resembling fresh, rosy lotuses (navkanj lochan, kanj mukh, kar kanj, pad kanjarunam) – a classic Vaishnava trope signifying purity, beauty, and divine grace.

The Aarti then extols Rama's unparalleled aesthetic charm, stating His beauty surpasses that of countless Kamadevas, the god of love. He is likened to a fresh, dark blue cloud (nav neel neerad sundaram), symbolising His serene yet majestic presence and His ability to bring spiritual rain. His yellow garments (patpeet) are depicted as shining with the brilliance of lightning, further enhancing His divine aura. The hymn reverently bows to Him as the pure consort of Janaka's daughter, Sita, highlighting His role as a devoted husband and an ideal king.

Subsequent verses call upon devotees to worship Him as Deenbandhu, the friend of the downtrodden, and Dinesh, the lord of the day, who annihilated the demonic clans (Daanav Daitya vansh nikandanam). He is celebrated as the joy of the Raghu dynasty (Raghunand), the source of all bliss (Aanandkand), the moon of Kosala (Koshalchand), and the beloved son of Dasharatha. The Aarti further details His physical iconography: a crown adorning His head, earrings, and a tilak, along with various beautiful ornaments. His arms, extending to His knees (Aajaanubhuj), signify His immense strength and regal bearing. He is depicted holding His divine bow and arrow, recalling His victory over formidable foes like Khara and Dushana in battle, thus portraying Him as the protector of dharma. The concluding lines, spoken by Tulsidas, express the ultimate desire for Rama to reside in the devotee's heart, vanquishing the internal army of desires (Kaamadi khal dal ganjanam), and delighting the minds of great sages like Shankara and Shesha.`,
    significance: `The "Shri Ramchandra Kripalu Bhajaman" Aarti holds immense spiritual significance within the Vaishnava tradition, particularly for devotees of Lord Rama. Composed by the revered saint-poet Goswami Tulsidas, it is not merely a song but a profound meditation on Rama's divine form and attributes. This Aarti is an integral part of daily puja rituals in Rama temples and homes, often recited at the climax of worship, accompanied by the circling of a lit camphor lamp (diya) before the deity. The lamp, symbolising the light of consciousness, is offered in devotion, signifying the devotee's surrender and aspiration for inner illumination.

While suitable for daily recitation, its significance is amplified during festivals associated with Rama, most notably Ram Navami, His appearance day, and throughout the Navratri period leading up to Dussehra. Devotees often engage in its recitation on Tuesdays and Saturdays, days traditionally associated with Hanuman, Rama's ardent devotee, or on Thursdays, which are auspicious for Vishnu manifestations. The number of circulations of the lamp (typically 5, 7, or 11 times) during the Aarti is symbolic, representing the offering of the five elements or the complete surrender of the self.

Devotees turn to this Aarti for a myriad of life concerns. It is primarily sought for relief from the "terrible fear of worldly existence" (bhavbhay daarunam), offering solace and spiritual strength in times of distress. Recitation is believed to purify the mind, destroy negative desires (Kaamadi khal dal ganjanam), and foster inner peace and devotion. It complements the primary mantras of Rama, such as the "Om Ram Ramaya Namah" or the "Taraka Mantra," by providing a rich narrative and visual aid for meditation, deepening the devotee's connection with the deity. Before recitation, purification through bathing and maintaining a clean environment is customary, enhancing the sanctity of the offering. The Aarti serves as a powerful tool for cultivating bhakti and aligning one's consciousness with the divine qualities of Lord Rama, the ideal king and embodiment of dharma.`,
  },
  {
    slug: 'santoshi-maa-aarti',
    type: 'aarti',
    title: { en: 'Santoshi Maa Aarti', hi: 'सन्तोषी माँ आरती' },
    deity: 'Santoshi Ma',
    deityDay: 5,
    devanagari: `जय सन्तोषी माता, मैया जय सन्तोषी माता।
अपने सेवक जन की, सुख सम्पत्ति दाता॥
जय सन्तोषी माता॥

सुन्दर चीर सुनहरा, मां तेरा श्रृंगार।
ललित ललाम विराजे, तेरे सिन्दूर भण्डार॥
जय सन्तोषी माता॥

गणनायक की अम्बे, तेरो मंगल ध्यान।
तेरो संगीत सुहावे, करो भक्तों कल्याण॥
जय सन्तोषी माता॥

गुड़ चना का भोग जो, तेरो भोग लगावे।
और मनोवांछित फल, माता शीघ्र ही पावे॥
जय सन्तोषी माता॥`,
    transliteration: `Jai Santoshi Mata, Maiya Jai Santoshi Mata.
Apne sevak jan ki, sukh sampatti data.
Jai Santoshi Mata.

Sundar cheer sunehra, Maa tera shringar.
Lalit lalam viraje, tere sindoor bhandar.
Jai Santoshi Mata.

Gannayak ki Ambe, tero mangal dhyan.
Tero sangeet suhaave, karo bhakton kalyan.
Jai Santoshi Mata.

Gud chana ka bhog jo, tero bhog lagaave.
Aur manovanchhit phal, Mata sheeghra hi paave.
Jai Santoshi Mata.`,
    meaning: `The Santoshi Maa Aarti commences with the fervent invocation, "Jai Santoshi Mata, Maiya Jai Santoshi Mata," hailing the Mother of Contentment as the supreme bestower of happiness and prosperity upon her devotees. The epithet 'Santoshi' itself signifies inner peace and satisfaction, reflecting the core blessing sought from this benevolent goddess. The verses then beautifully describe her divine form: "Sundar cheer sunehra, Maa tera shringar. Lalit lalam viraje, tere sindoor bhandar." This paints a picture of the Mother adorned in resplendent golden garments, her forehead graced with a vibrant tilak of sindoor, symbolising auspiciousness, marital bliss, and divine energy. While not explicitly mentioned in this aarti, traditional iconography often depicts her with four arms, holding a trident, a sword, and a pot of jaggery, while one hand is in the abhaya mudra, offering fearlessness.

A pivotal stanza, "Gannayak ki Ambe, tero mangal dhyan. Tero sangeet suhaave, karo bhakton kalyan," firmly establishes her lineage as the beloved daughter of Ganesha, the remover of obstacles and lord of beginnings. This connection imbues her worship with the auspiciousness associated with her father. Her 'mangal dhyan' (auspicious meditation) and 'sangeet suhaave' (delightful music) signify her serene and harmonious presence, which brings welfare and prosperity to her devotees. The aarti concludes by highlighting the simplicity and efficacy of her worship: "Gud chana ka bhog jo, tero bhog lagaave. Aur manovanchhit phal, Mata sheeghra hi paave." This refers to the specific offering of jaggery (gur) and chickpeas (chana), symbolising pure and humble devotion, through which the Mother swiftly grants all heartfelt desires, reinforcing her role as a compassionate wish-fulfilling deity.`,
    significance: `The Santoshi Maa Aarti is primarily recited during the observance of the Santoshi Maa Vrat, a devotional fast traditionally undertaken on sixteen consecutive Fridays. Friday, associated with the planet Venus (Shukra) and often linked to goddesses of prosperity and well-being, is considered particularly auspicious for her worship. The aarti is performed at the culmination of the puja, usually accompanied by the circling of a lit camphor lamp (diya) before the deity, symbolising the offering of light and the removal of darkness.

Devotees, particularly married women, turn to Santoshi Maa for a multitude of life concerns, including marital harmony, progeny, family welfare, financial stability, and the fulfillment of specific desires. The ritualistic purity (shuddhi) is paramount, with strict adherence to the offering of jaggery and chickpeas, and the complete avoidance of sour foods. This dietary restriction is not merely symbolic; it represents the devotee's commitment to eschew bitterness and negativity, fostering a mindset of sweetness and contentment, mirroring the goddess's name. The aarti complements the primary mantras of Santoshi Maa, intensifying the devotional experience and invoking her blessings. Its widespread appeal, especially across North India, stems from its accessible rituals and the profound belief in the Mother's immediate grace for those who worship her with sincere devotion and observe the prescribed vrat with discipline.`,
  },
  {
    slug: 'surya-aarti',
    type: 'aarti',
    title: { en: 'Surya Aarti', hi: 'सूर्य आरती' },
    deity: 'Surya',
    deityDay: 0,
    devanagari: `ॐ जय सूर्य भगवान, भास्कर जय सूर्य भगवान।
पावन तुम प्रकाश दाता, जग में उजियारा॥
ॐ जय सूर्य भगवान॥

सात अश्व का रथ पर, आरूढ़ हो प्रभु आना।
अरुण सारथी साथ में, तेज पुञ्ज भगवाना॥
ॐ जय सूर्य भगवान॥

द्वादश रूप धरे, भूमण्डल को मोहा।
कनक कश्यप नन्दन, दिन दिन तेज संजोहा॥
ॐ जय सूर्य भगवान॥

सूर्यनारायण की आरती, जो कोई नर गावे।
सुख समृद्धि पावे, सब विपदा मिट जावे॥
ॐ जय सूर्य भगवान॥`,
    transliteration: `Om Jai Surya Bhagwan, Bhaskar Jai Surya Bhagwan.
Paavan tum prakash data, jag mein ujiyara.
Om Jai Surya Bhagwan.

Saat ashwa ka rath par, aarudh ho Prabhu aana.
Arun saarthi saath mein, tej punj Bhagwana.
Om Jai Surya Bhagwan.

Dwadash roop dhare, Bhoomandal ko moha.
Kanak Kashyap Nandan, din din tej sanjoha.
Om Jai Surya Bhagwan.

Suryanarayanji ki aarti, jo koi nar gaave.
Sukh samriddhi paave, sab vipda mit jaave.
Om Jai Surya Bhagwan.`,
    meaning: `The Surya Aarti commences with a fervent salutation, "Om Jai Surya Bhagwan, Bhaskar Jai Surya Bhagwan," honouring Surya, the radiant Sun God, as Bhaskar, the dispeller of darkness and source of all illumination. This opening invocation establishes Surya as the sacred bestower of light (paavan prakash data) who brings radiance (ujiyara) to the entire cosmos, a fundamental truth echoed in Vedic hymns like the Gayatri Mantra, which meditates upon Savitr, the stimulating power of the Sun.

The second stanza vividly paints Surya's iconic imagery. He is depicted mounted upon a magnificent chariot drawn by seven horses (saat ashwa ka rath), symbolising the seven colours of the visible spectrum or the seven days of the week. His charioteer is Aruna, the elder brother of Garuda, who, born without legs, guides Surya's celestial journey across the sky. This imagery, deeply rooted in the Puranas, particularly the Vishnu Purana and Markandeya Purana, portrays Surya not merely as a celestial body but as a divine being, a "tej punj Bhagwana" – a veritable mass of divine brilliance and energy, sustaining all life.

The third verse expands upon Surya's multifaceted nature, stating he assumes "Dwadash roop" (twelve forms) to enchant the earth. These twelve forms are the Adityas, manifestations of Surya corresponding to the twelve months of the year, each presiding over a specific month and bestowing unique blessings. He is also identified as "Kanak Kashyap Nandan," the golden-hued son of the sage Kashyapa and Aditi, thus affirming his divine lineage. The phrase "din din tej sanjoha" highlights his perpetual and increasing brilliance, symbolising the continuous renewal of life and energy he provides. The Aarti concludes with a phalashruti, promising that those who sing this Aarti of Suryanarayana (a composite form of Surya and Vishnu, signifying the Sun as the soul of the universe) will attain happiness (sukh), prosperity (samriddhi), and freedom from all calamities (vipda mit jaave), underscoring the profound benefits of his worship.`,
    significance: `The recitation of the Surya Aarti holds profound significance in Hindu devotional practice, primarily observed on Sundays (Ravivar), the day dedicated to Surya Dev. This practice is intensified during specific astronomical and cultural festivals such as Chhath Puja, a major festival in Bihar and Uttar Pradesh, where devotees offer elaborate prayers to the setting and rising sun; Makar Sankranti, marking the Sun's entry into Capricorn and the beginning of longer days; and Ratha Saptami, celebrating the birth of Surya and the symbolic turning of his chariot towards the northern hemisphere.

Devotees turn to Surya worship for a myriad of life-stage concerns. He is revered as Arogyakaraka, the giver of health, vitality, and freedom from disease, particularly skin ailments and eye conditions. Those seeking success in career, leadership qualities, confidence, and overall well-being also perform his Aarti. In Jyotish (Vedic astrology), a strong Sun in one's horoscope signifies good health, authority, and a robust constitution. Conversely, a weak or afflicted Sun can lead to issues with health, father figures, and self-esteem. Hence, individuals undergoing a challenging Surya Mahadasha or with an unfavourably placed Sun often undertake this worship to mitigate negative karmic influences and strengthen the planetary energy.

For optimal benefit, the Aarti is typically performed at sunrise, after a purifying bath, facing the east. While there isn't a strict prescribed count for the Aarti itself, it complements the recitation of primary Surya mantras like the Gayatri Mantra or the Surya Bija Mantra ("Om Hram Hrim Hraum Sah Suryaya Namah"), often performed 108 times. The Aarti is usually accompanied by the circling of a lit camphor lamp (diya) before the deity's image, symbolising the offering of light back to the source of all light. This devotional act, rooted in ancient Vedic traditions, reinforces the devotee's connection to the cosmic life-giver, fostering physical, mental, and spiritual well-being.`,
  },
  {
    slug: 'shani-dev-aarti',
    type: 'aarti',
    title: { en: 'Shani Dev Aarti', hi: 'शनि देव आरती' },
    deity: 'Shani',
    deityDay: 6,
    devanagari: `जय जय श्री शनिदेव, भक्तन हितकारी।
सूरज के पुत्र प्रभु, छाया महतारी॥
जय जय श्री शनिदेव॥

श्याम शरीर विशाल अंग, धारत हैं मुण्डमाला।
तन में सदा काला वस्त्र, निर्मल शनि बाला॥
जय जय श्री शनिदेव॥

कर में सूर्य छत्र है, विराजत कृत लोका।
करत सदा न्याय, शनि दण्ड सब शोका॥
जय जय श्री शनिदेव॥

परनारी को माता जानत, पर धन नहिं चाहो।
पण्डित हो धर्मात्मा, आदि मनु जानो॥
जय जय श्री शनिदेव॥

श्री शनिदेव की आरती, जो कोई नर गावे।
कहत कवि सुन्दरदास, मन वांछित फल पावे॥
जय जय श्री शनिदेव॥`,
    transliteration: `Jai Jai Shri Shanidev, bhaktan hitkari.
Suraj ke putra Prabhu, Chhaya mahtari.
Jai Jai Shri Shanidev.

Shyam sharir vishal ang, dharat hain mundmala.
Tan mein sada kala vastra, nirmal Shani bala.
Jai Jai Shri Shanidev.

Kar mein Surya chhattra hai, virajat krit loka.
Karat sada nyaya, Shani dand sab shoka.
Jai Jai Shri Shanidev.

Par naari ko mata janat, par dhan nahin chaaho.
Pandit ho dharmatma, aadi manu jaano.
Jai Jai Shri Shanidev.

Shri Shanidev ki aarti, jo koi nar gaave.
Kahat kavi Sundardas, man vanchit phal paave.
Jai Jai Shri Shanidev.`,
    meaning: `The Shani Dev Aarti is a fervent hymn of praise dedicated to the formidable yet just deity, Shani, the planetary regent Saturn. The opening lines, "Jai Jai Shri Shanidev, bhaktan hitkari. Suraj ke putra Prabhu, Chhaya mahtari," immediately establish Shani's identity as the benevolent benefactor of devotees, born from Surya (the Sun God) and Chhaya (Shadow), a pivotal relationship in Puranic narratives that explains his often-perceived austere nature. His iconography is vividly described: "Shyam sharir vishal ang, dharat hain mundmala. Tan mein sada kala vastra, nirmal Shani bala." This paints a picture of a dark-complexioned, large-limbed deity, adorned with a garland of skulls (mundmala), signifying his association with mortality, transformation, and the ultimate truth of existence. His constant attire of black garments further reinforces his connection to the colour of Saturn, representing depth, mystery, and the absorption of negative energies.

The aarti continues to extol Shani's role as the supreme dispenser of justice: "Kar mein Surya chhattra hai, virajat krit loka. Karat sada nyaya, Shani dand sab shoka." The "Sun's umbrella" in his hand symbolises his regal authority and his dominion over the created worlds, despite being Surya's son. He is the impartial judge, whose "dand" (staff or punishment) is not punitive but corrective, designed to remove "shoka" (sorrow) by ensuring karmic retribution and spiritual purification. This verse highlights Shani's function as a karmic accountant, ensuring that all beings face the consequences of their actions. The subsequent stanza, "Par naari ko mata janat, par dhan nahin chaaho. Pandit ho dharmatma, aadi manu jaano," attributes profound ethical virtues to Shani himself, presenting him as an ideal of righteousness. He is depicted as one who respects all women as mothers, harbours no desire for others' wealth, and embodies the wisdom of a "pandit" and the primordial dharma of "Manu," suggesting he upholds the very fabric of cosmic law. The aarti concludes with the promise that singing this hymn, as poet Sundardas states, grants the fulfilment of all heart's desires, underscoring the power of sincere devotion to appease Shani and receive his blessings.`,
    significance: `The Shani Dev Aarti holds profound significance for devotees, particularly those seeking to navigate the challenging periods associated with the planet Saturn in Vedic astrology. It is primarily recited on Saturdays (Shanivar), the day consecrated to Shani Dev, to propitiate him and mitigate any adverse astrological influences, such as Sade Sati, Dhaiya, or a malefic placement of Saturn in one's birth chart. Regular recitation on this day is believed to foster discipline, patience, and resilience, qualities that Shani himself embodies and demands. While Saturdays are paramount, the aarti gains intensified potency when performed during festivals like Shani Jayanti (the birth anniversary of Shani Dev) or Shani Amavasya, which are considered auspicious for seeking his blessings and karmic rectification.

Devotees turn to this aarti for a multitude of life situations. It is a powerful invocation for those experiencing prolonged difficulties, legal troubles, financial setbacks, health issues, or professional stagnation, all of which are often attributed to Shani's influence. Beyond seeking relief from suffering, the aarti is also recited to cultivate inner strength, promote justice, and encourage righteous conduct, aligning oneself with Shani's role as the dispenser of impartial karma. The ritual typically involves lighting a diya (lamp) with sesame oil, often with a black wick, and circling it before an image or idol of Shani Dev, usually three, five, or seven times clockwise, symbolising the removal of obstacles and the invocation of divine light. Prior purification through bathing and wearing clean clothes is customary. This aarti complements the primary Shani mantras, such as "Om Sham Shanicharaya Namaha," by providing a narrative and devotional framework that deepens the spiritual connection, transforming abstract mantra recitation into a heartfelt expression of reverence and surrender to the cosmic law represented by Shani.`,
  },
  {
    slug: 'tulsi-aarti',
    type: 'aarti',
    title: { en: 'Tulsi Aarti', hi: 'तुलसी आरती' },
    deity: 'Tulsi',
    deityDay: 3,
    devanagari: `नमो नमो तुलसी महारानी।
नमो नमो तुलसी महारानी,
वृन्दावनी ताँसी तुलसी, नमो नमो तुलसी महारानी॥

कोई विधि मिल सके प्रभु से, करो वही कल्याणी।
नमो नमो तुलसी महारानी॥

जाकी मंजरी पुष्प हरि को, अति प्रिय मनभावनी।
नमो नमो तुलसी महारानी॥

ध्यान जो तेरा प्रेम सों धरत है, पावत पद निर्वाणी।
नमो नमो तुलसी महारानी॥`,
    transliteration: `Namo Namo Tulsi Maharani.
Namo Namo Tulsi Maharani,
Vrindavani taansi Tulsi, Namo Namo Tulsi Maharani.

Koi vidhi mil sake Prabhu se, karo vahi kalyani.
Namo Namo Tulsi Maharani.

Jaki manjari pushp Hari ko, ati priya manbhavni.
Namo Namo Tulsi Maharani.

Dhyaan jo tera prem son dharat hai, paavat pad nirvani.
Namo Namo Tulsi Maharani.`,
    meaning: `The 'Tulsi Aarti' is a heartfelt invocation to the sacred Tulsi plant, revered as a divine manifestation. The opening lines, 'Namo Namo Tulsi Maharani, Vrindavani taansi Tulsi,' offer salutations to Tulsi as the 'Great Queen' and specifically identify her with Vrindavan, the hallowed abode of Lord Krishna. This immediately connects her to the puranic narrative of Vrinda, the devoted wife of the demon Jalandhara, who, upon her husband's demise, transformed into the Tulsi plant through Lord Vishnu's grace. Her iconography is thus the plant itself, embodying purity, devotion, and auspiciousness, often depicted as a young woman holding a lotus or water pot, signifying her divine essence.

The central verses delve into her profound spiritual role. 'Koi vidhi mil sake Prabhu se, karo vahi kalyani' expresses the devotee's plea for Tulsi, the 'auspicious one,' to facilitate their connection with the Supreme Lord. As an embodiment of Goddess Lakshmi, Vishnu's consort, Tulsi is believed to be the most direct path to His grace and blessings, bestowing welfare and removing obstacles. The verse 'Jaki manjari pushp Hari ko, ati priya manbhavni' highlights the immense sacredness of Tulsi's flower buds (manjari), which are described as 'most dear and pleasing' to Lord Hari (Vishnu/Krishna). Puranic texts, such as the Padma Purana, affirm that no worship of Vishnu is complete without the offering of Tulsi leaves or manjaris, underscoring her indispensable role in Vaishnava devotion.

The concluding lines, 'Dhyaan jo tera prem son dharat hai, paavat pad nirvani,' promise that whoever meditates upon Tulsi with love and devotion attains 'pad nirvani' – the state of liberation or moksha. This underscores Tulsi's power not merely as a bringer of worldly blessings but as a spiritual guide, capable of purifying the soul and leading devotees towards ultimate spiritual emancipation through sincere devotion to her divine form.`,
    significance: `The 'Tulsi Aarti' holds profound significance in Hindu devotional practices, particularly within Vaishnava traditions. It is most commonly performed during the daily evening worship of the Tulsi plant, often accompanying the lighting of a diya (lamp) as part of the Sandhya Vandanam. While not strictly tied to a specific weekday, Thursdays, dedicated to Vishnu, and Fridays, dedicated to Lakshmi, are considered especially auspicious for her worship. The Aarti's significance intensifies during the Kartik month, culminating in the festival of Tulsi Vivah on Kartik Shukla Ekadashi or Dwadashi, which celebrates the symbolic marriage of Tulsi (Vrinda/Lakshmi) with Shaligram (Vishnu), marking the end of Chaturmas and the beginning of auspicious events.

Devotees typically perform the Aarti after purifying themselves through a bath and wearing clean clothes. The area around the Tulsi plant is often cleaned and adorned with rangoli. The Aarti is performed with a lit diya, traditionally fuelled by ghee or sesame oil, circled clockwise (pradakshina) before the plant, usually 3, 5, 7, or 11 times, symbolising complete surrender and reverence. This ritual is believed to invoke Tulsi's blessings for a multitude of life-stage concerns, including prosperity, health, marital harmony, and progeny. Her presence in the home is thought to ward off negative energies and purify the environment.

The 'Tulsi Aarti' complements primary mantras dedicated to Vishnu or Lakshmi by providing an emotional and accessible form of devotion. While mantras engage the mind with sacred sounds, the Aarti allows for a heartfelt expression of love and gratitude, enhancing the overall spiritual experience. Its recitation, especially during auspicious periods like Ekadashi or Purnima, is believed to cleanse sins, purify the soul, and ultimately lead to spiritual liberation (moksha), as promised in the Aarti itself. The practice of daily Tulsi worship is deeply ingrained in many regional traditions across India, reflecting her universal veneration as a divine mother figure.`,
  },
  {
    slug: 'ganga-aarti',
    type: 'aarti',
    title: { en: 'Ganga Aarti', hi: 'गंगा आरती' },
    deity: 'Ganga',
    deityDay: 1,
    devanagari: `ॐ जय गंगे माता, मैया जय गंगे माता।
जो नर तुमको ध्याता, मनवांछित फल पाता॥
ॐ जय गंगे माता॥

चन्द्र सी ज्योत तुम्हारी, जल निर्मल आता।
शरण पड़े जो तेरी, सो नर तर जाता॥
ॐ जय गंगे माता॥

पुत्र सगर के तारे, सब जग को ज्ञाता।
कृपा दृष्टि हो तुम्हारी, त्रिभुवन सुख दाता॥
ॐ जय गंगे माता॥

एक बार जो मानव, शरण तुम्हारी आता।
यम की त्रास मिटाकर, परमगति पाता॥
ॐ जय गंगे माता॥

आरती माँ गंगे की, जो कोई नर गाता।
महिमा अपरमपार, सो जन सुख पाता॥
ॐ जय गंगे माता॥`,
    transliteration: `Om Jai Gange Mata, Maiya Jai Gange Mata.
Jo nar tumko dhyata, manvanchhit phal pata.
Om Jai Gange Mata.

Chandra si jyot tumhari, jal nirmal aata.
Sharan pade jo teri, so nar tar jata.
Om Jai Gange Mata.

Putra Sagar ke taare, sab jag ko gyaata.
Kripa drishti ho tumhari, tribhuvan sukh data.
Om Jai Gange Mata.

Ek baar jo manav, sharan tumhari aata.
Yam ki traas mitakar, paramgati paata.
Om Jai Gange Mata.

Aarti Maa Gange ki, jo koi nar gaata.
Mahima aparampaar, so jan sukh pata.
Om Jai Gange Mata.`,
    meaning: `The Ganga Aarti is a profound invocation of Ganga Mata, the divine river goddess, celebrating her sacred essence and benevolent power. The opening lines, "Om Jai Gange Mata," establish her as the revered Mother, promising that devotion to her fulfills all heartfelt desires, underscoring her role as a bestower of boons and a compassionate protector. The Aarti then beautifully describes her divine attributes, likening her radiance to the serene moon ("Chandra si jyot") and her waters to ultimate purity ("jal nirmal aata"). This imagery evokes her calming, purifying, and life-sustaining nature, assuring devotees that seeking refuge in her allows one to transcend the cycle of birth and death, symbolised as "crossing the ocean of existence" (samsara).

A pivotal verse explicitly references the Puranic narrative of King Sagara's sons, whom Ganga liberated from a curse, a tale well-known across the world ("sab jag ko gyaata"). This highlights her unique power to grant salvation and purify even the most grievous karmic impurities. Her "kripa drishti," or compassionate gaze, is invoked as the source of happiness across all three worlds (Bhuloka, Bhuvarloka, Svarloka), affirming her universal beneficence. The Aarti further assures that even a single act of taking refuge in her dispels the terror of Yama, the deity of death, and leads to "paramagati" – supreme liberation or moksha. The concluding stanza reaffirms the boundless glory of Mother Ganga and the immense happiness attained by those who sing her Aarti, reinforcing the spiritual efficacy of this devotional offering. Through these verses, the Aarti encapsulates Ganga's identity as a purifier, saviour, and bestower of liberation, deeply rooted in Vedic and Puranic lore.`,
    significance: `The Ganga Aarti holds profound significance as a daily ritual, particularly at sunset (Sandhya Aarti) along the sacred ghats of cities like Varanasi, Haridwar, and Rishikesh, where it transforms into a grand spectacle of devotion. While it can be performed any day, its potency is amplified during specific festivals. Ganga Dussehra, observed on Jyeshtha Shukla Dashami, commemorates Ganga's descent to Earth and is considered the most auspicious time for her worship, with the Aarti being a central observance. Other significant periods include Kartik Purnima, Makar Sankranti, and during Pitru Paksha, when offerings are made for ancestral liberation.

The ritual itself involves circulating a multi-wick lamp, often fuelled by ghee or camphor, before an idol of Ganga or the river itself. This offering of light symbolises the dispelling of ignorance and the invocation of divine illumination. Devotees perform clockwise circulations, typically three, five, or seven times, absorbing the blessings by cupping their hands over the flame and touching their eyes and head. The Aarti is sought for a myriad of life-stage concerns: from the purification of sins (papa nashana) and alleviation of karmic burdens to seeking material prosperity, good health, and spiritual liberation (moksha). It is believed to grant protection from untimely death and ensure a peaceful transition. Devotees often perform ablutions in the Ganga and wear clean attire before participating, complementing the Aarti with the chanting of primary mantras such as "Om Namo Bhagavatyai Ganga Devyai Namah" to deepen their connection with the divine Mother.`,
  },
  {
    slug: 'sai-baba-aarti',
    type: 'aarti',
    title: { en: 'Sai Baba Aarti  –  Kakad Aarti', hi: 'साईं बाबा आरती  –  काकड़ आरती' },
    deity: 'Sai Baba',
    devanagari: `शिर्डी माझे पंढरपूर, साईबाबा रमावर।
शुद्ध भक्तीचा चन्द्रभागा, भाव पुण्डलीक जागा॥

ॐ जय जय साईनाथ, आरती साईनाथ।
सौख्यदातार जीवा, चरण रजातली।
ध्यावा दासां विसावा, भक्तां विसावा॥
ॐ जय जय साईनाथ॥

जालुनिय अनंग, स्वस्वरूपी रहे दंग।
मुमुक्षु जनदावी, निज डोला श्रीरंग।
ॐ जय जय साईनाथ॥

जया मनी जैसा भाव, तया तैसा अनुभव।
दविसी दयाघना, ऐसी तुझी ही माव।
ॐ जय जय साईनाथ॥`,
    transliteration: `Shirdi majhe Pandharpur, Sai Baba Ramavar.
Shuddha bhaktichaa Chandrabhaga, bhaav Pundalik jaaga.

Om Jai Jai Sainath, aarti Sainath.
Saukhyadaatar jeeva, charan rajatali.
Dhyava daasaan visaava, bhaktan visaava.
Om Jai Jai Sainath.

Jaaluniya anang, swa-swaroopi rahe dang.
Mumukshu jan daavi, nij dola Shrirang.
Om Jai Jai Sainath.

Jaya mani jaisa bhaav, taya taisa anubhav.
Davisi dayaghana, aisi tujhi hi maav.
Om Jai Jai Sainath.`,
    meaning: `The Kakad Aarti for Sai Baba, performed at dawn, is a profound invocation that blends traditional Hindu devotional imagery with the unique spiritual essence of Shirdi's saint. The opening lines, "Shirdi majhe Pandharpur, Sai Baba Ramavar," immediately establish a powerful syncretism. Shirdi, the abode of Sai, is equated with Pandharpur, the revered pilgrimage site of Lord Vitthala (Krishna), while Sai Baba himself is hailed as Rama, an incarnation of Vishnu. This comparison elevates Sai Baba to the status of a divine manifestation, a Sadguru embodying the supreme Brahman. The reference to "Shuddha bhaktichaa Chandrabhaga, bhaav Pundalik jaaga" further deepens this connection, likening pure devotion to the sacred Chandrabhaga River of Pandharpur and awakened sentiment to Pundalik, the legendary devotee who brought Vitthala to Pandharpur. This stanza thus positions Sai Baba as the very embodiment of divine love and the ultimate object of devotion, accessible through pure-hearted surrender.

The central refrain, "Om Jai Jai Sainath, aarti Sainath," is a jubilant declaration of victory and praise to the Lord of Sai. Devotees seek "Saukhyadaatar jeeva, charan rajatali," acknowledging Sai Baba as the giver of happiness and seeking refuge in the dust of his feet, a traditional gesture of humility and reverence towards a spiritual master. The prayer for "daasaan visaava, bhaktan visaava" expresses a yearning for peace and solace for all servants and devotees, highlighting Sai Baba's role as a compassionate protector and guide. This reflects the common experience of devotees finding comfort and resolution to life's travails through his grace.

The subsequent stanzas delve into Sai Baba's spiritual state and his benevolent nature. "Jaaluniya anang, swa-swaroopi rahe dang" describes the saint as one who has transcended worldly desires (anang referring to Kama, the god of desire, often burned by Shiva), remaining absorbed in his own true, divine nature. This portrays Sai Baba as a realised soul, a Jivanmukta, whose actions emanate from a state of perfect spiritual equipoise. He is implored to "Mumukshu jan daavi, nij dola Shrirang," meaning he reveals his own divine form, Shrirang (another name for Vishnu), to those who earnestly seek liberation (mumukshu). This underscores his power to grant spiritual vision and guide aspirants towards self-realisation. The concluding lines, "Jaya mani jaisa bhaav, taya taisa anubhav. Davisi dayaghana, aisi tujhi hi maav," encapsulate Sai Baba's core teaching: the experience one receives is directly proportional to the faith and sentiment one holds. He is depicted as "dayaghana," a cloud of compassion, whose motherly love ("maav") manifests according to the devotee's inner state, reinforcing the idea of a personal, responsive divine presence. The Aarti, therefore, is not merely a ritual but a heartfelt dialogue with the Sadguru, acknowledging his divinity, seeking his protection, and affirming the power of faith.`,
    significance: `The Kakad Aarti holds profound significance within the devotional practices centred around Sai Baba of Shirdi, serving as the inaugural ritual of the day at the Shirdi temple, performed precisely at 4:30 AM before dawn. This early morning timing, known as Brahma Muhurta, is considered highly auspicious in Hindu tradition for spiritual practices, believed to be conducive to receiving divine blessings and achieving mental clarity. The term "Kakad" itself refers to the wick used in the lamps, symbolising the awakening of the deity and the devotee's inner light.

Devotees typically perform this Aarti with a lit camphor lamp (diya) or multiple wicks soaked in ghee, circled reverently before Sai Baba's murti or image. The number of circulations is often three or five, representing the offering of the five elements (pancha mahabhutas) or the three gunas. While daily performance is ideal for ardent followers, Thursday is considered particularly sacred for Sai Baba worship, making the Kakad Aarti on this day especially potent. During festivals such as Rama Navami, Guru Purnima, and Vijayadashami (Sai Baba's Mahasamadhi day), the intensity and fervour of this Aarti are greatly amplified, drawing thousands of devotees seeking his grace.

Life-stage concerns for which devotees turn to Sai Baba through this Aarti are varied and encompass all aspects of human existence. Many seek relief from physical ailments, mental distress, and financial difficulties, believing in Sai Baba's miraculous healing powers and his ability to alleviate worldly suffering. Others pray for success in education, career, marriage, or progeny. Beyond material concerns, a significant number of devotees engage in the Kakad Aarti for spiritual upliftment, seeking inner peace, guidance on their spiritual path, and ultimately, liberation (moksha). The Aarti complements the chanting of Sai Baba's primary mantras, such as "Om Sai Ram" or "Om Shri Sainathaya Namaha," by providing a structured, communal, and visually engaging form of worship that deepens devotion and fosters a sense of community. The act of offering light symbolises the removal of ignorance and the dawn of spiritual wisdom, making it a powerful practice for both worldly and spiritual aspirations.`,
  },
  {
    slug: 'karva-chauth-aarti',
    type: 'aarti',
    title: { en: 'Karva Chauth Aarti', hi: 'करवा चौथ आरती' },
    deity: 'Chandra (Moon)',
    deityDay: 1,
    devanagari: `करवा चौथ की आरती कीजै।
करवा चौथ को दीप जलाईजे, करवा चौथ की आरती कीजै॥

पहले करवा पूजे गौरी, सोलह श्रृंगार बना।
पत्नी पति की सेवा करती, जन्म जन्म का नाता॥
करवा चौथ की आरती कीजै॥

ऊद्यत चन्द्रमा को अर्घ्य दो, छलनी से चाँद देखो।
पति की सलामती का, अन्तर से मांगो नेहो॥
करवा चौथ की आरती कीजै॥`,
    transliteration: `Karva Chauth ki aarti keejai.
Karva Chauth ko deep jalaaije, Karva Chauth ki aarti keejai.

Pehle karva pooje Gauri, solah shringaar bana.
Patni pati ki seva karti, janm janm ka naata.
Karva Chauth ki aarti keejai.

Udyat Chandrama ko arghya do, chhalani se chaand dekho.
Pati ki salaamati ka, antar se maango neho.
Karva Chauth ki aarti keejai.`,
    meaning: `The Karva Chauth Aarti, sung at the culmination of the evening puja, is a heartfelt invocation to the divine, primarily addressing Chandra (the Moon God) and Goddess Gauri-Parvati. Chandra is lauded as the dispenser of \`amrita\` (nectar), bestowing longevity, vitality, and emotional well-being upon the devotee's husband. Gauri-Parvati, the epitome of marital devotion and prosperity, is praised for her blessings of \`saubhagya\` – a long and blissful married life.

The ritual elements are deeply symbolic. The \`karva\` (earthen pot), often beautifully decorated, represents the vessel of life and abundance, holding offerings and prayers for the husband's prosperity. The \`solah shringar\` (sixteen adornments) symbolise the complete beauty and marital status of a \`sumangali\` (married woman), offered or worn as a testament to her devotion. The \`chhalni\` (sieve) through which the moon and then the husband are viewed, signifies filtering out negativity and perceiving only the auspicious, pure essence of both the celestial body and the beloved spouse. Finally, the \`arghya\` – the offering of water to the rising moon – is accompanied by prayers for Chandra's benevolent gaze, ensuring the husband's health, success, and a long life, infused with the moon's life-giving energy.`,
    significance: `Karva Chauth holds profound cultural and astronomical significance within the Hindu calendar, observed on Kartik Krishna Chaturthi – the fourth day of the dark fortnight in the month of Kartik. The aarti connects deeply with the broader Chandra-puja tradition, where the Moon God is revered as a source of \`amrita\` (nectar) and a bestower of health and longevity.

The festival is steeped in puranic legends that underscore its essence. The tale of Savitri and Satyavan, where Savitri's unwavering devotion saved her husband from the clutches of Yama, serves as the ultimate inspiration for the fast. The legend of Queen Veervati, who suffered consequences for breaking her fast prematurely, highlights the sanctity and proper observance of the \`vrat\`. Artistic traditions flourish around the puja, from the intricate \`mehndi\` designs adorning women's hands to the vibrant decoration of \`karva\` pots. The collective gathering of \`sumangali\` women for the puja, storytelling, and aarti reinforces community bonds and the shared aspirations for marital bliss, culminating in the aarti's invocation to the moon for its life-sustaining blessings.`,
  },
  {
    slug: 'diwali-aarti',
    type: 'aarti',
    title: { en: 'Diwali Aarti  –  Lakshmi-Ganesh', hi: 'दीपावली आरती  –  लक्ष्मी-गणेश' },
    deity: 'Lakshmi-Ganesha',
    deityDay: 5,
    devanagari: `ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।
तुमको निसदिन सेवत, हरि विष्णु विधाता॥

जय गणेश जय गणेश जय गणेश देवा।
माता जाकी पार्वती पिता महादेवा॥

दीपावली की रात्रि में, लक्ष्मी गणेश पुजाई।
घर घर में दीपक जले, अँधेरा दूर भगाई॥

ॐ जय लक्ष्मी-गणेश, दीपावली उजियारा।
सुख सम्पत्ति बरसावो, जग में उजियारा॥`,
    transliteration: `Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata.
Tumko nisdin sevat, Hari Vishnu Vidhata.

Jai Ganesh Jai Ganesh Jai Ganesh Deva.
Mata jaki Parvati, Pita Mahadeva.

Deepavali ki raatri mein, Lakshmi Ganesh pujaai.
Ghar ghar mein deepak jale, andhera door bhagaai.

Om Jai Lakshmi-Ganesh, Deepavali ujiyara.
Sukh sampatti barsaavo, jag mein ujiyara.`,
    meaning: `The "Diwali Aarti – Lakshmi-Ganesh" is a heartfelt invocation celebrating the divine energies of prosperity and auspicious beginnings, particularly during the festival of Deepavali. The opening stanza, "Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata. Tumko nisdin sevat, Hari Vishnu Vidhata," extols Lakshmi, the goddess of wealth, fortune, and beauty. It highlights her supreme status by stating that even Hari (Vishnu), her eternal consort and preserver of the cosmos, and Vidhata (Brahma), the creator, serve her daily. Lakshmi is typically depicted seated upon a lotus, symbolising purity and spiritual power, often holding lotus buds and showering gold coins, representing material and spiritual abundance. Her association with Vishnu, as his Shakti, underscores her role in sustaining the cosmic order and bestowing blessings upon devotees.

Following this, the aarti shifts to Lord Ganesha with "Jai Ganesh Jai Ganesh Jai Ganesh Deva. Mata jaki Parvati, Pita Mahadeva." This verse reveres Ganesha, the elephant-headed deity, acknowledging his divine parentage as the son of Parvati and Mahadeva (Shiva). Ganesha is universally worshipped as Vighnaharta, the remover of obstacles, and the bestower of wisdom and intellect. His iconography, featuring a large belly symbolising abundance, four arms holding an axe (to cut attachments), a noose (to capture errors), a modaka (reward for spiritual pursuit), and his broken tusk (symbolising sacrifice for knowledge, as in writing the Mahabharata), encapsulates profound philosophical truths. His vahana, the mouse Mushika, represents the mind's restless nature, which Ganesha controls.

The third stanza, "Deepavali ki raatri mein, Lakshmi Ganesh pujaai. Ghar ghar mein deepak jale, andhera door bhagaai," anchors the aarti firmly in the context of Deepavali. It explicitly states the joint worship of Lakshmi and Ganesha on this auspicious night, when homes are illuminated with diyas (lamps) to dispel darkness. This act symbolises the triumph of light over ignorance and evil, and the welcoming of divine blessings. The concluding lines, "Om Jai Lakshmi-Ganesh, Deepavali ujiyara. Sukh sampatti barsaavo, jag mein ujiyara," serve as a collective prayer. It invokes the combined grace of Lakshmi and Ganesha, the 'light of Deepavali', to shower happiness (sukh) and prosperity (sampatti) upon the world, illuminating lives with their divine presence and dispelling all forms of gloom.`,
    significance: `This combined Lakshmi-Ganesha aarti holds profound significance, particularly as the devotional climax of Deepavali celebrations. While Lakshmi is traditionally worshipped on Fridays for prosperity and Ganesha on Tuesdays or Chaturthi for obstacle removal, their joint invocation is paramount during the five-day Deepavali festival, especially on the main Lakshmi Puja day (Kartik Amavasya). The aarti is performed after the main puja, typically during Pradosh Kaal or Nishita Kaal, when the divine energies are believed to be most potent. The 'how' involves circling a lit camphor lamp (diya) – traditionally made of clay with a cotton wick soaked in ghee or sesame oil – before the deities, usually three, five, or seven times clockwise, symbolising the offering of light, warmth, and devotion.

Devotees turn to this aarti for a multitude of life-stage concerns. Ganesha's presence ensures the removal of obstacles (Vighnaharta) from new ventures, studies, or any significant life transition, making him the primary deity to invoke before any undertaking. Lakshmi's invocation is for material and spiritual prosperity (dhana), abundance, good fortune, and well-being. During Deepavali, it is customary to perform Chopda Pujan, blessing new account books, and this aarti sanctifies such financial beginnings. The collective chanting of this aarti, often accompanied by the ringing of bells and conch shells, purifies the environment and elevates the spiritual vibrations.

While the aarti itself is a complete devotional act, it complements primary mantras such as the 'Om Gam Ganapataye Namaha' for Ganesha and 'Om Hreem Shreem Lakshmi Bhyo Namaha' for Lakshmi, by providing a communal, accessible form of worship. There are no strict rules for the number of recitations, but sincerity is key. Prior purification through bathing and wearing clean clothes is customary. This aarti is widely embraced across various Hindu traditions, particularly in North and West India, where Deepavali is celebrated with immense fervour, marked by fireworks, elaborate rangoli, and the lighting of countless diyas, all culminating in this heartfelt prayer for light, wisdom, and prosperity.`,
  },
  {
    slug: 'navratri-aarti',
    type: 'aarti',
    title: { en: 'Navratri Aarti', hi: 'नवरात्रि आरती' },
    deity: 'Navadurga',
    deityDay: 2,
    devanagari: `जय अम्बे गौरी, मैया जय श्यामा गौरी।
तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी॥
जय अम्बे गौरी॥

नवरात्रि के नौ दिन, नौ रूपों में पूजा।
शैलपुत्री ब्रह्मचारिणी, चन्द्रघण्टा मां दूजा॥

कूष्माण्डा स्कन्दमाता, कात्यायनी पूजो।
कालरात्रि महागौरी, सिद्धिदात्री गूँजो॥

नव दुर्गा सबकी, आरती गावो मिलकर।
मनवांछित सब फल पाओ, माँ की कृपा पाकर॥`,
    transliteration: `Jai Ambe Gauri, Maiya Jai Shyama Gauri.
Tumko nishdin dhyavat, Hari Brahma Shivri.
Jai Ambe Gauri.

Navratri ke nau din, nau roopon mein pooja.
Shailputri Brahmacharini, Chandraghanta Maa dooja.

Kushmanda Skandamata, Katyayani poojo.
Kaalratri Mahagauri, Siddhidatri goonjo.

Nav Durga sabki, aarti gaavo milkar.
Manvanchhit sab phal pao, Maa ki kripa pakar.`,
    meaning: `The "Navratri Aarti" is a profound invocation to the Divine Mother, commencing with the resonant salutation, "Jai Ambe Gauri, Maiya Jai Shyama Gauri." This opening line hails the Goddess as Ambe Gauri, a manifestation of Parvati, the consort of Lord Shiva, embodying both the benevolent and fierce aspects of the divine feminine. The epithet 'Shyama Gauri' further underscores her multifaceted nature, encompassing both her fair and dark, formidable forms, often associated with Kali or Durga in her cosmic dance of creation and destruction. The subsequent verse, "Tumko nishdin dhyavat, Hari Brahma Shivri," elevates her supreme status by declaring that even the Trimurti – Lord Vishnu (Hari), Lord Brahma, and Lord Shiva – meditate upon her ceaselessly, acknowledging her as the primordial energy, the Adishakti, from whom all creation, sustenance, and dissolution emanate.

The central portion of the aarti meticulously enumerates the nine forms of Durga, known as Navadurga, who are worshipped over the nine auspicious nights of Navratri. These forms represent a comprehensive spectrum of the Goddess's powers and attributes, as detailed in texts like the Devi Mahatmya. Shailputri, the daughter of the Himalayas, symbolises strength and purity; Brahmacharini embodies austerity and penance; Chandraghanta, adorned with a crescent moon, represents peace and readiness for battle; Kushmanda is the cosmic creatrix; Skandamata, mother of Kartikeya, signifies maternal love and purity; Katyayani is the warrior goddess, destroyer of evil; Kaalratri, the dark night, vanquishes ignorance; Mahagauri represents ultimate purity and serenity; and Siddhidatri bestows all spiritual accomplishments. By invoking each of these forms, the devotee seeks to honour and assimilate their unique divine qualities.

The aarti culminates with a collective prayer, "Nav Durga sabki, aarti gaavo milkar. Manvanchhit sab phal pao, Maa ki kripa pakar." This closing exhortation encourages devotees to unite in singing the aarti, promising that through the Mother's grace, all righteous desires will be fulfilled. It reinforces the belief in the boundless compassion and omnipotence of the Divine Mother to grant boons, remove obstacles, and guide her devotees towards spiritual and material well-being, encompassing the full spectrum of human aspirations.`,
    significance: `The "Navratri Aarti" holds immense spiritual significance, primarily recited during the biannual Navratri festivals – Chaitra Navratri in spring and Sharad Navratri in autumn. These nine nights are dedicated to the worship of the Divine Mother in her nine forms, and this aarti serves as a powerful culmination of the daily puja, particularly in the evenings. While intensely observed during Navratri, it is also traditionally sung on Tuesdays and Fridays, days auspicious for Devi worship, or whenever devotees seek to invoke the Goddess's blessings.

Performing the aarti involves circling a lit lamp, typically with five wicks soaked in ghee or camphor, before the deity's image. This act, known as 'deepa-pradakshina,' is performed clockwise, usually five, seven, or eleven times, symbolising the offering of light and the removal of darkness. The flame is then offered to devotees to pass their hands over and touch their eyes or head, signifying the absorption of divine energy and purification. Prior to recitation, physical and mental purity is paramount; devotees typically bathe and wear clean clothes, fostering a sattvic state of mind conducive to devotion. The aarti is often accompanied by the ringing of bells, blowing of conches, and other devotional music, creating an immersive spiritual atmosphere.

Devotees turn to this aarti for a multitude of life concerns. It is invoked for complete divine protection from adversities, negative influences, and obstacles, drawing upon the warrior aspects of Durga. It is also recited for spiritual growth, the removal of ignorance, and the attainment of wisdom, particularly through forms like Brahmacharini and Siddhidatri. For material prosperity, health, progeny, and overall well-being, the benevolent forms of the Goddess are sought. The aarti acts as a devotional complement to more intense practices such as mantra japa (e.g., the Navarna Mantra) or recitations from the Durga Saptashati, deepening the emotional connection and surrender to the Divine Mother. Regionally, especially in Gujarat and Maharashtra, this aarti is integral to the vibrant Garba and Dandiya celebrations, uniting communities in collective devotion.`,
  },
  {
    slug: 'satyanarayan-aarti',
    type: 'aarti',
    title: { en: 'Satyanarayan Aarti', hi: 'सत्यनारायण आरती' },
    deity: 'Satyanarayan (Vishnu)',
    deityDay: 4,
    devanagari: `जय लक्ष्मीरमणा, स्वामी जय लक्ष्मीरमणा।
सत्यनारायण स्वामी, जन पातक हरणा॥
जय लक्ष्मीरमणा॥

रत्न जड़ित सिंहासन, अद्भुत छवि राजे।
नारद कहत नित, कथा सुन जग तारे॥
जय लक्ष्मीरमणा॥

प्रगट भये कलियुग में, द्विज को दर्श दियो।
बूढ़ा ब्राह्मण बनकर, कंचन महल दियो॥
जय लक्ष्मीरमणा॥

दुर्बल भील कठारा, सत्यनारायण पूजी।
कनक कमल दिये स्वामी, जमुना पूजी॥
जय लक्ष्मीरमणा॥

भाव भक्ति से पूजें, मन वांछित फल पावें।
ऐसे प्रभु सत्यनारायण, सबके मन भावें॥
जय लक्ष्मीरमणा॥`,
    transliteration: `Jai Lakshmiramana, Swami Jai Lakshmiramana.
Satyanarayan Swami, jan patak harana.
Jai Lakshmiramana.

Ratna jadit singhasan, adbhut chhavi raaje.
Narad kahat nit, katha sun jag taare.
Jai Lakshmiramana.

Pragat bhaye kaliyug mein, dwij ko darsh diyo.
Boodha Brahman bankar, kanchan mahal diyo.
Jai Lakshmiramana.

Durbal Bheel kathara, Satyanarayan pooji.
Kanak kamal diye Swami, Jamuna pooji.
Jai Lakshmiramana.

Bhaav bhakti se poojein, man vanchhit phal paavein.
Aise Prabhu Satyanarayan, sabke man bhaavein.
Jai Lakshmiramana.`,
    meaning: `The 'Satyanarayan Aarti' is a heartfelt invocation to Lord Satyanarayan, a benevolent manifestation of Vishnu, whose name itself signifies 'Truth Incarnate' (Satya-Narayana). The opening lines, 'Jai Lakshmiramana, Swami Jai Lakshmiramana. Satyanarayan Swami, jan patak harana,' hail Him as the beloved consort of Lakshmi, the goddess of prosperity, thereby establishing His identity as a preserver and bestower of auspiciousness. He is lauded as the remover of sins and obstacles for His devotees, setting the tone for His compassionate nature.

The Aarti then paints a vivid picture of His divine form: 'Ratna jadit singhasan, adbhut chhavi raaje' — seated majestically on a jewelled throne, radiating wondrous beauty. While not explicitly detailing His four-armed iconography with shankha, chakra, gada, and padma, this description evokes the regal and powerful presence of Lord Vishnu. The mention of Narada Muni, 'Narad kahat nit, katha sun jag taare,' highlights the central role of the Satyanarayan Vrata Katha, which, as narrated by the divine sage, is believed to redeem and uplift the world through its hearing.

The subsequent stanzas allude to specific episodes from the Satyanarayan Katha, illustrating the Lord's accessibility and grace. 'Pragat bhaye kaliyug mein, dwij ko darsh diyo. Boodha Brahman bankar, kanchan mahal diyo' refers to His manifestation in the Kali Yuga as an old Brahmin to guide and bless a poor Brahmin, bestowing upon him immense wealth. Similarly, 'Durbal Bheel kathara, Satyanarayan pooji. Kanak kamal diye Swami, Jamuna pooji' recounts the story of a humble woodcutter (Bheel) who, through sincere devotion, received golden lotuses, signifying prosperity. These narratives underscore that Lord Satyanarayan's blessings are available to all, irrespective of social standing or material condition, provided there is genuine devotion. The Aarti concludes by affirming that 'Bhaav bhakti se poojein, man vanchhit phal paavein' – sincere devotion yields desired fruits, making Him 'sabke man bhaavein' – beloved by all.`,
    significance: `The 'Satyanarayan Aarti' forms the climactic offering in the highly popular Satyanarayan Puja, a ritual widely observed across India. This puja is predominantly performed on Purnima (full moon days) and Thursdays, as Thursday is traditionally associated with Lord Vishnu (Brihaspati or Guruvar). While not tied to a specific annual festival, it is frequently undertaken during auspicious occasions such as housewarmings, weddings, before commencing new ventures, or upon achieving significant milestones, serving as an expression of gratitude and a plea for continued blessings.

During the Aarti, a lit camphor lamp (diya) or a ghee lamp is circled clockwise before the deity's image or idol, typically three, five, or seven times, symbolising the offering of light, purity, and devotion. The lamp, often made of brass or clay, holds a cotton wick soaked in ghee or ignited camphor, representing the dispelling of darkness and ignorance. Prior to the puja and aarti, devotees observe ritual purification through bathing and wearing clean attire, and the puja space is sanctified to invite divine presence.

Devotees turn to Lord Satyanarayan for a multitude of life-stage concerns: seeking prosperity, ensuring family welfare, overcoming obstacles, fulfilling specific vows (sankalpa), and achieving success in their endeavours. The Aarti, along with the recitation of the five-chapter Satyanarayan Vrata Katha, complements primary Vishnu mantras like 'Om Namo Bhagavate Vasudevaya' by deepening the devotional experience and reinforcing the narratives of divine grace. It is a non-sectarian Vaishnava observance, cherished for its accessibility and the belief that sincere performance brings peace, happiness, and the fulfilment of righteous desires.`,
  },
  {
    slug: 'vishnu-aarti',
    type: 'aarti',
    title: { en: 'Vishnu Aarti', hi: 'विष्णु आरती' },
    deity: 'Vishnu',
    deityDay: 3,
    devanagari: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, दास जनों के संकट,
क्षण में दूर करे॥ ॐ जय जगदीश हरे॥

शंख चक्र गदा पद्म, चार भुजा धारी।
वक्ष पर श्रीवत्स लक्ष्मी, कौस्तुभ मणि भारी॥
ॐ जय जगदीश हरे॥

क्षीर सागर में विराजे, शेष शय्या पर सोये।
ब्रह्मा रुद्र सनक सनन्दन, नित चरण पूजन होये॥
ॐ जय जगदीश हरे॥

दश अवतार धरे प्रभु, भक्तन हित कीन्हा।
मत्स्य कूर्म वराह नृसिंह, वामन रूप लीन्हा॥
ॐ जय जगदीश हरे॥

परशुराम राम कृष्ण बुद्ध, कल्कि रूप धारी।
अधर्म नाश करन प्रभु, धर्म की रखवारी॥
ॐ जय जगदीश हरे॥

श्री विष्णु जी की आरती, जो कोई नर गावे।
कहत शिवानन्द स्वामी, सुख सम्पत्ति पावे॥
ॐ जय जगदीश हरे॥`,
    transliteration: `Om Jai Jagdish Hare, Swami Jai Jagdish Hare.
Bhakt janon ke sankat, daas janon ke sankat,
Kshan mein door kare. Om Jai Jagdish Hare.

Shankh chakra gada padma, chaar bhuja dhari.
Vaksh par Shrivatsa Lakshmi, Kaustubh mani bhari.
Om Jai Jagdish Hare.

Ksheer sagar mein viraje, Shesh shayyaa par soye.
Brahma Rudra Sanak Sanandan, nit charan pujan hoye.
Om Jai Jagdish Hare.

Dash avatar dhare Prabhu, bhaktan hit keenha.
Matsya Kurma Varaha Nrisimha, Vaman roop leenha.
Om Jai Jagdish Hare.

Parashuram Ram Krishna Buddha, Kalki roop dhari.
Adharm nash karan Prabhu, dharm ki rakhwari.
Om Jai Jagdish Hare.

Shri Vishnu Ji ki aarti, jo koi nar gaave.
Kahat Shivanand Swami, sukh sampatti paave.
Om Jai Jagdish Hare.`,
    meaning: `The Vishnu Aarti, commencing with the resonant 'Om Jai Jagdish Hare,' is a profound hymn of adoration to Lord Vishnu, the preserver and sustainer of the cosmos within the Hindu Trimurti. The opening lines hail Him as the Lord of the Universe, capable of instantly alleviating the distress of His devotees and servants, underscoring His compassionate and protective nature, a central tenet of Vaishnava theology.

The subsequent verses vividly describe Vishnu's iconic form. He is depicted bearing the Shankha (conch), Chakra (discus), Gada (mace), and Padma (lotus) in His four arms, symbolising His omnipotence and control over creation, preservation, and destruction. The Shankha represents the primordial sound of creation (Om), the Chakra (Sudarshana) signifies the cosmic mind and the destruction of evil, the Gada (Kaumodaki) embodies primordial intellect and divine punishment, and the Padma symbolises purity, spiritual liberation, and the unfolding universe. His chest bears the auspicious Shrivatsa mark, representing His consort Lakshmi, the goddess of wealth and prosperity, and the radiant Kaustubha Mani, a divine jewel symbolising the pure consciousness of the Atman.

The aarti then transports the devotee to Vishnu's celestial abode, describing Him reclining on the cosmic serpent Ananta Shesha in the Ksheer Sagar, the Ocean of Milk. This imagery evokes His state of yogic slumber (Yoga Nidra) during cosmic dissolution, from which creation periodically springs forth. The presence of Brahma, Rudra (Shiva), and the Sanaka Kumāras (Sanak, Sanandan, Sanatan, Sanatkumara) perpetually worshipping His feet reinforces Vishnu's supreme position as the ultimate reality. The hymn culminates by enumerating His ten principal avatars – Matsya, Kurma, Varaha, Nrisimha, Vamana, Parashurama, Rama, Krishna, Buddha, and Kalki – each assumed to restore Dharma and protect the righteous, highlighting Vishnu's active intervention in cosmic affairs. The concluding lines, attributed to Swami Shivananda, promise happiness and prosperity to those who devoutly sing this aarti, affirming its spiritual efficacy.`,
    significance: `The Vishnu Aarti holds deep spiritual significance for devotees, serving as a powerful expression of Bhakti (devotion) and a means to connect with the divine. It is traditionally recited at the culmination of a puja, particularly during the evening or morning hours, as the lit camphor lamp (diya) is circled before the deity. This act of waving the lamp, symbolising the offering of light, purifies the atmosphere and invokes the divine presence, while the flame itself represents the inner light of the soul.

Devotees often perform this aarti on Thursdays (Brihaspativar), a day specifically dedicated to Lord Vishnu and His various forms, including Brihaspati (Jupiter), who is associated with wisdom and prosperity. Its recitation is intensified during major Vaishnava festivals such as Vaikuntha Ekadashi, Janmashtami, Rama Navami, and Devshayani Ekadashi, when the spiritual energies are considered most potent. The lamp used for aarti is typically fuelled by ghee (clarified butter) or oil, with a cotton wick, and is circled in a clockwise direction, usually three, five, seven, or eleven times, representing circumambulation (pradakshina) and the offering of the five elements.

Devotees turn to this aarti for a multitude of life situations. It is believed to invoke Vishnu's protection against obstacles, negative influences, and karmic burdens. Many seek it for material and spiritual prosperity, stability, peace of mind, and the removal of suffering, aligning with Lakshmi's presence on Vishnu's chest. It complements the recitation of primary mantras like 'Om Namo Narayanaya' or the Vishnu Sahasranama, deepening the devotional experience. The aarti is a staple in Vaishnava traditions across India, fostering a sense of community and reinforcing the principles of Dharma and righteous living. Before recitation, mental and physical purity are emphasised to ensure the sincerity and efficacy of the offering.`,
  },
];

// ─── CHALISAS ───────────────────────────────────────────────────────────────

const CHALISAS: DevotionalItem[] = [
  {
    slug: 'hanuman-chalisa',
    type: 'chalisa',
    title: { en: 'Hanuman Chalisa', hi: 'हनुमान चालीसा' },
    deity: 'Hanuman',
    deityDay: 2,
    devanagari: `॥ दोहा ॥
श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।
बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥

बुद्धिहीन तनु जानिके, सुमिरौं पवन कुमार।
बल बुद्धि बिद्या देहु मोहिं, हरहु कलेस बिकार॥

॥ चौपाई ॥
जय हनुमान ज्ञान गुन सागर।
जय कपीस तिहुँ लोक उजागर॥१॥

राम दूत अतुलित बल धामा।
अञ्जनि पुत्र पवनसुत नामा॥२॥

महाबीर बिक्रम बजरंगी।
कुमति निवार सुमति के संगी॥३॥

कञ्चन बरन बिराज सुबेसा।
कानन कुण्डल कुञ्चित केसा॥४॥

हाथ बज्र औ ध्वजा बिराजै।
काँधे मूँज जनेउ साजै॥५॥

शंकर सुवन केसरी नन्दन।
तेज प्रताप महा जग बन्दन॥६॥

बिद्यावान गुणी अति चातुर।
राम काज करिबे को आतुर॥७॥

प्रभु चरित्र सुनिबे को रसिया।
राम लखन सीता मन बसिया॥८॥

सूक्ष्म रूप धरि सियहिं दिखावा।
बिकट रूप धरि लंक जरावा॥९॥

भीम रूप धरि असुर सँहारे।
रामचन्द्र के काज सँवारे॥१०॥

लाय सजीवन लखन जियाये।
श्रीरघुबीर हरषि उर लाये॥११॥

रघुपति कीन्ही बहुत बड़ाई।
तुम मम प्रिय भरतहि सम भाई॥१२॥

सहस बदन तुम्हरो जस गावैं।
अस कहि श्रीपति कण्ठ लगावैं॥१३॥

सनकादिक ब्रह्मादि मुनीसा।
नारद सारद सहित अहीसा॥१४॥

जम कुबेर दिगपाल जहाँ ते।
कबि कोबिद कहि सके कहाँ ते॥१५॥

तुम उपकार सुग्रीवहिं कीन्हा।
राम मिलाय राज पद दीन्हा॥१६॥

तुम्हरो मन्त्र बिभीषन माना।
लंकेस्वर भए सब जग जाना॥१७॥

जुग सहस्र जोजन पर भानू।
लील्यो ताहि मधुर फल जानू॥१८॥

प्रभु मुद्रिका मेलि मुख माहीं।
जलधि लाँघि गये अचरज नाहीं॥१९॥

दुर्गम काज जगत के जेते।
सुगम अनुग्रह तुम्हरे तेते॥२०॥

राम दुआरे तुम रखवारे।
होत न आज्ञा बिनु पैसारे॥२१॥

सब सुख लहै तुम्हारी सरना।
तुम रक्षक काहू को डरना॥२२॥

आपन तेज सम्हारो आपै।
तीनों लोक हाँक तें काँपै॥२३॥

भूत पिशाच निकट नहिं आवै।
महाबीर जब नाम सुनावै॥२४॥

नासै रोग हरै सब पीरा।
जपत निरन्तर हनुमत बीरा॥२५॥

संकट तें हनुमान छुड़ावै।
मन क्रम बचन ध्यान जो लावै॥२६॥

सब पर राम तपस्वी राजा।
तिन के काज सकल तुम साजा॥२७॥

और मनोरथ जो कोई लावै।
सोई अमित जीवन फल पावै॥२८॥

चारों जुग परताप तुम्हारा।
है परसिद्ध जगत उजियारा॥२९॥

साधु सन्त के तुम रखवारे।
असुर निकन्दन राम दुलारे॥३०॥

अष्ट सिद्धि नौ निधि के दाता।
अस बर दीन जानकी माता॥३१॥

राम रसायन तुम्हरे पासा।
सदा रहो रघुपति के दासा॥३२॥

तुम्हरे भजन राम को पावै।
जनम जनम के दुख बिसरावै॥३३॥

अन्त काल रघुबर पुर जाई।
जहाँ जन्म हरिभक्त कहाई॥३४॥

और देवता चित्त न धरई।
हनुमत सेइ सर्ब सुख करई॥३५॥

संकट कटै मिटै सब पीरा।
जो सुमिरै हनुमत बलबीरा॥३६॥

जय जय जय हनुमान गोसाईं।
कृपा करहु गुरुदेव की नाईं॥३७॥

जो सत बार पाठ कर कोई।
छूटहि बन्दि महा सुख होई॥३८॥

जो यह पढ़ै हनुमान चालीसा।
होय सिद्धि साखी गौरीसा॥३९॥

तुलसीदास सदा हरि चेरा।
कीजै नाथ हृदय महँ डेरा॥४०॥

॥ दोहा ॥
पवनतनय संकट हरन, मंगल मूरति रूप।
राम लखन सीता सहित, हृदय बसहु सुर भूप॥`,
    transliteration: `|| Doha ||
Shri Guru charan saroj raj, nij manu mukuru sudhari.
Barnaun Raghubar bimal jasu, jo dayaku phal chaari.

Buddhiheen tanu jaanike, sumiroun Pavan Kumar.
Bal buddhi vidya dehu mohi, harahu kales bikaar.

|| Chaupai ||
Jai Hanuman gyan gun sagar.
Jai Kapees tihun lok ujagar. (1)

Ram doot atulit bal dhaama.
Anjani putra Pavansut naama. (2)

Mahabeer bikram Bajrangi.
Kumati nivaar sumati ke sangi. (3)

Kanchan baran biraaj subesa.
Kanan kundal kunchit kesa. (4)

Haath bajra au dhvaja birajai.
Kaandhe moonj janeu saajai. (5)

Shankar suvan Kesari Nandan.
Tej prataap maha jag bandan. (6)

Vidyavaan guni ati chaatur.
Ram kaaj karibe ko aatur. (7)

Prabhu charitra sunibe ko rasiya.
Ram Lakhan Sita man basiya. (8)

Sukshma roop dhari Siyahin dikhaava.
Bikat roop dhari Lanka jaraava. (9)

Bheem roop dhari asur sanhaare.
Ramchandra ke kaaj sanvaare. (10)

Laay Sajeevan Lakhan jiyaaye.
Shri Raghubeer harashi ur laaye. (11)

Raghupati keenhi bahut badaai.
Tum mam priya Bharatahi sam bhaai. (12)

Sahas badan tumharo jas gaavain.
As kahi Shripati kanth lagaavain. (13)

Sankaadik Brahmaadi muneesa.
Narad Saarad sahit Aheesa. (14)

Yam Kuber Digpaal jahaan te.
Kabi kobid kahi sake kahaan te. (15)

Tum upkaar Sugreevahin keenha.
Ram milaay raaj pad deenha. (16)

Tumhro mantra Vibheeshan maana.
Lankeshwar bhaye sab jag jaana. (17)

Yug sahasra yojan par Bhaanu.
Leelyo taahi madhur phal jaanu. (18)

Prabhu mudrika meli mukh maaheen.
Jaladhi laanghi gaye achraj naaheen. (19)

Durgam kaaj jagat ke jete.
Sugam anugrah tumhre tete. (20)

Ram duaare tum rakhvaare.
Hot na aagya binu paisaare. (21)

Sab sukh lahai tumhaari sarna.
Tum rakshak kaahu ko darna. (22)

Aapan tej samhaaro aapai.
Teenon lok haank ten kaanpai. (23)

Bhoot pishaach nikat nahin aavai.
Mahabeer jab naam sunaavai. (24)

Naasai rog harai sab peera.
Japat nirantar Hanumat beera. (25)

Sankat ten Hanumaan chhudaavai.
Man kram bachan dhyaan jo laavai. (26)

Sab par Ram tapasvi raaja.
Tin ke kaaj sakal tum saaja. (27)

Aur manorath jo koi laavai.
Soee amit jeevan phal paavai. (28)

Chaaron yug partaap tumhaara.
Hai parsiddh jagat ujiyaara. (29)

Saadhu sant ke tum rakhvaare.
Asur nikandan Ram dulaare. (30)

Ashta siddhi nau nidhi ke daata.
As bar deen Jaanaki Maata. (31)

Ram rasaayan tumhre paasa.
Sada raho Raghupati ke daasa. (32)

Tumhre bhajan Ram ko paavai.
Janam janam ke dukh bisraavai. (33)

Ant kaal Raghubar pur jaai.
Jahaan janm Haribhakt kahaai. (34)

Aur devta chitt na dharai.
Hanumat sei sarb sukh karai. (35)

Sankat katai mitai sab peera.
Jo sumirai Hanumat Balbeera. (36)

Jai Jai Jai Hanuman Gosain.
Kripa karahu Gurudev ki naain. (37)

Jo sat baar paath kar koi.
Chhootahi bandi maha sukh hoi. (38)

Jo yah padhai Hanuman Chaleesa.
Hoy siddhi saakhi Gaureesa. (39)

Tulsidas sada Hari chera.
Keejai Nath hriday mahan dera. (40)

|| Doha ||
Pavantanay sankat haran, Mangal moorti roop.
Ram Lakhan Sita sahit, hriday basahu Sur Bhoop.`,
    meaning: `Opening Doha: Cleansing the mirror of my mind with the dust of my Guru's lotus feet, I describe the pure glory of Raghu's best (Rama), who grants the four fruits of life. Knowing myself to be ignorant, I remember the Son of the Wind (Hanuman). Grant me strength, wisdom, and knowledge; remove my afflictions and impurities.

(1) Victory to Hanuman, ocean of wisdom and virtue. Victory to the Monkey King, illuminator of the three worlds. (2) You are Rama's envoy, abode of matchless strength. You are named Anjani's son, Son of the Wind. (3) Great hero, mighty as a thunderbolt. You dispel evil thoughts and are the companion of good sense. (4) Your golden body shines in fine attire, with earrings in Your ears and curly hair. (5) In Your hands shine the thunderbolt and the flag; a sacred thread of munja grass adorns Your shoulder. (6) You are Shankara's incarnation, son of Kesari. Your brilliance and valor are revered in the whole world. (7) You are learned, virtuous, and supremely clever, always eager to do Rama's work. (8) You delight in hearing the Lord's story. Rama, Lakshmana, and Sita dwell in Your heart. (9) Assuming a tiny form You appeared to Sita; assuming a terrifying form You burned Lanka. (10) Assuming a gigantic form You slew the demons, accomplishing Ramachandra's tasks. (11) You brought the Sanjeevani herb and revived Lakshmana. Shri Raghuveer embraced You joyfully. (12) Raghupati praised You greatly: "You are as dear to Me as brother Bharata." (13) "A thousand-headed Shesha sings Your glory," said Shripati (Vishnu), embracing You. (14) Sanaka, Brahma, and the great sages, Narada, Sharada, and the Serpent King (15) Yama, Kubera, and the Dikpalas  –  even poets and scholars cannot describe Your glory. (16) You did Sugriva a great favor  –  introducing him to Rama, You gave him the kingdom. (17) Vibhishana heeded Your counsel and became Lord of Lanka  –  the whole world knows. (18) The Sun is thousands of yojanas away; You swallowed it thinking it a sweet fruit. (19) Carrying the Lord's ring in Your mouth, You leaped across the ocean  –  no wonder! (20) All the difficult tasks in the world become easy by Your grace. (21) You are the gatekeeper at Rama's door; none may enter without Your permission. (22) All happiness lies in Your refuge; with You as protector, why should anyone fear? (23) You alone can control Your brilliance; the three worlds tremble at Your roar. (24) Ghosts and evil spirits dare not approach when the name of Mahaveer is uttered. (25) All diseases and pains are destroyed by constantly chanting "Hanuman Veera." (26) Hanuman rescues from troubles whoever meditates on Him in thought, deed, and word. (27) Rama is the supreme ascetic king, and You accomplish all His tasks. (28) Whoever comes to You with any desire receives limitless fruits of life. (29) Your glory spans all four ages, famous throughout the world as its light. (30) You are the protector of saints and sages, destroyer of demons, beloved of Rama. (31) You are the giver of the eight siddhis and nine nidhis  –  this boon was granted by Mother Janaki. (32) You possess the elixir of Rama's name; may You always remain Raghupati's servant. (33) Through Your worship one attains Rama, and the sorrows of countless lifetimes are forgotten. (34) At the end of life, one goes to Rama's abode; wherever one is born, one is called Hari's devotee. (35) Why worship other gods? Serving Hanuman alone gives all happiness. (36) All troubles are cut away, all pains destroyed, for whoever remembers mighty Hanuman. (37) Victory, Victory, Victory to Lord Hanuman! Bestow Your grace as the Guru does. (38) Whoever recites this a hundred times is freed from bondage and attains great bliss. (39) Whoever reads this Hanuman Chalisa attains perfection  –  Lord Shiva is witness. (40) Says Tulsidas, ever Hari's servant: O Lord, make my heart Your dwelling.

Closing Doha: O Son of the Wind, remover of calamities, embodiment of auspiciousness! Along with Rama, Lakshmana, and Sita, dwell in my heart, O King of Gods.`,
    significance: 'The Hanuman Chalisa, composed by Goswami Tulsidas in the 16th century, is the single most recited devotional text in Hinduism. "Chalisa" means "forty"  –  referring to its 40 chaupai (quatrain) verses, framed by opening and closing dohas. It is recited daily by millions, especially on Tuesdays and Saturdays (Hanuman\'s days). It is believed to ward off evil spirits, cure diseases, remove obstacles, and grant strength and courage. During Hanuman Jayanti (Chaitra Purnima), continuous recitation (Hanuman Chalisa Path) is performed in temples.',
  },
  {
    slug: 'shiv-chalisa',
    type: 'chalisa',
    title: { en: 'Shiv Chalisa', hi: 'शिव चालीसा' },
    deity: 'Shiva',
    deityDay: 1,
    devanagari: `॥ दोहा ॥
जय गणेश गिरिजा सुवन, मंगल मूल सुजान।
कहत अयोध्यादास तुम, देहु अभय वरदान॥

॥ चौपाई ॥
जय गिरिजापति दीनदयाला। सदा करत सन्तन प्रतिपाला॥
भाल चन्द्रमा सोहत नीके। कानन कुण्डल नागफनी के॥

अंग गौर शिर गंग बहाये। मुण्डमाल तन छार लगाये॥
वस्त्र खाल बाघम्बर सोहे। छवि को देखि नाग मन मोहे॥

मैना मातु की हवै दुलारी। बाम अंग सोहत छवि न्यारी॥
कर त्रिशूल सोहत छवि भारी। करत सदा शत्रुन क्षयकारी॥

नन्दि गणेश सोहैं तहँ कैसे। सागर मध्य कमल हैं जैसे॥
कार्तिक श्याम और गणराऊ। या छवि को कहि जात न काऊ॥

देवन जबहीं जाय पुकारा। तब ही दुख प्रभु आप निवारा॥
किया उपद्रव तारक भारी। देवन सब मिलि तुमहिं जुहारी॥

तुरत षडानन आप पठायउ। लवनिमेष महँ मारि गिरायउ॥
आप जलन्धर असुर संहारा। सुयश तुम्हार विदित संसारा॥

त्रिपुरासुर सन युद्ध मचाई। सबहिं कृपा कर लीन बचाई॥
किया तपहिं भागीरथ भारी। पुरव प्रतिज्ञा तासु पुरारी॥

दानिन महँ तुम सम कोउ नाहीं। सेवक स्तुति करत सदाहीं॥
वेद नाम महिमा तव गाई। अकथ अनादि भेद नहिं पाई॥

प्रगट उदधि मन्थन में ज्वाला। जरत सुरासुर भये विहाला॥
कीन्ह दया तहँ करी बटोरा। नीलकण्ठ तब नाम कहोरा॥

पूजन रामचन्द्र जब कीन्हा। जीत के लंक विभीषण दीन्हा॥
सहस कमल में हो रहे धारी। कीन्ह परीक्षा तबहिं पुरारी॥

एक कमल प्रभु राखेउ जोई। कमल नयन पूजन चहँ सोई॥
प्रभु दुर्लभ ऐसी कछु बानी। करी कृपा शंकर भगवानी॥

जय जय जय अनन्त अविनाशी। करत कृपा सब के घट वासी॥
दुष्ट सकल नित मोहिं सतावैं। भ्रमत रहौं मोहिं चैन न आवैं॥

त्राहि त्राहि मैं नाथ पुकारों। यह अवसर मोहि आनि उबारों॥
लै त्रिशूल शत्रुन को मारो। संकट से मोहिं आनि उबारो॥

माता पिता भ्राता सब कोई। संकट में पूछत नहिं कोई॥
स्वामी एक है आस तुम्हारी। आय हरहु मम संकट भारी॥

धन निर्धन को देत सदा हीं। जो कोई जाँचे सो फल पाहीं॥
अस्तुति केहि विधि करैं तुम्हारी। क्षमहु नाथ अब चूक हमारी॥

शंकर हो संकट के नाशन। मंगल कारन विघ्न विनाशन॥
योगी यति मुनि ध्यान लगावैं। शारद नारद शीश नवावैं॥

नमो नमो जय नमो शिवाय। सुर ब्रह्मादिक पार न पाय॥
जो यह पाठ करे मन लाई। ता पर होत है शम्भु सहाई॥

ऋनियाँ जो कोई हो अधिकारी। पाठ करे सो पावन हारी॥
पुत्र हीन कर इच्छा जोई। निश्चय शिव प्रसाद तेहि होई॥

पण्डित त्रयोदशी को लावे। ध्यान पूर्वक होम करावे॥
त्रयोदशी व्रत करे हमेशा। तन नहिं ताके रहे कलेशा॥

ध्यान शम्भु का जो नित धरई। ता पर कृपा शम्भु की करई॥

॥ दोहा ॥
कवि अयोध्यादास यह, शम्भु चालीसा गाय।
सहस सम्वत सत्तर में, रचा मगसिर माय॥

शम्भु चालीसा पाठ कर, शिवपुर जाय निवास।
पावत मुक्ति अनन्त सुख, चहुँ दिश होय प्रकास॥`,
    transliteration: `|| Doha ||
Jai Ganesh Girija suvan, mangal mool sujaan.
Kahat Ayodhyadas tum, dehu abhay vardaan.

|| Chaupai ||
Jai Girijapati deendayala. Sada karat santan pratipala.
Bhaal Chandrama sohat neeke. Kaanan kundal naagphani ke.

Ang gaur shir Gang bahaaye. Mundmaal tan chhaar lagaaye.
Vastra khaal baaghambar sohe. Chhavi ko dekhi naag man mohe...`,
    meaning: `Opening Doha: Victory to Ganesh, son of Girija (Parvati), auspicious and wise. Says the poet Ayodhyadas: grant me the boon of fearlessness.

The 40 verses praise Lord Shiva as the compassionate protector of saints, with the crescent moon on His forehead, serpent earrings, the Ganga flowing from His matted locks, wearing ash and a garland of skulls, clothed in tiger skin. Parvati adorns His left side. He wields the trident and destroys enemies. Nandi and Ganesha attend Him. He killed Tarakasura by sending Kartikeya, destroyed Jalandhara and Tripurasura. He fulfilled Bhagiratha's penance by receiving the Ganga. He drank the poison (Halahala) from the ocean churning, earning the name Neelkantha. He tested Rama who offered 1,000 lotuses. The chalisa concludes with prayers for protection from troubles and the promise that reciting it with devotion earns Shambhu's grace and liberation.`,
    significance: 'Shiv Chalisa is recited on Mondays, during Shravan month, and on Maha Shivaratri. Composed by poet Ayodhyadas, it narrates the major legends of Lord Shiva and His compassion toward devotees. Regular recitation is believed to remove obstacles, cure diseases, and grant moksha (liberation). It is especially recommended during Pradosh Vrat (Trayodashi) and for those undergoing difficult planetary periods.',
  },
  {
    slug: 'durga-chalisa',
    type: 'chalisa',
    title: { en: 'Durga Chalisa', hi: 'दुर्गा चालीसा' },
    deity: 'Durga',
    deityDay: 2,
    devanagari: `॥ दोहा ॥
नमो नमो दुर्गे सुख करनी। नमो नमो अम्बे दुख हरनी॥

॥ चौपाई ॥
निरंकार है ज्योति तुम्हारी। तिहुँ लोक फैली उजियारी॥
शशि ललाट मुख महाविशाला। नेत्र लाल भृकुटी विकराला॥

रूप मातु को अधिक सुहावे। दरश करत जन अति सुख पावे॥
तुम संसार शक्ति लय कीना। तिहुँ लोक को मोहिं प्रवीणा॥

प्रसन्न भई देवन को, जब तुम चण्डी रूप विराजा।
किया तुम्हरी माँ ने, असुरन का दल साजा॥

महिषासुर नृप अति अभिमानी। जेहि अगणित रणबीर लड़ानी॥
परि गर्जना कोलाहल भारी। महिषासुर मर्दिनी भवानी॥

शुम्भ निशुम्भ को शक्ति दिखाई। रक्तबीज शंखन महँ गाई॥

सब देवन की तुमहिं पुकारा। दिनहिं दयालु करो रखवारा॥
करो कृपा भरपूर भवानी। तुम महिमा सबसे कल्याणी॥

॥ दोहा ॥
अम्बे दुर्गे शिव संगी। तेरा मन रहे सदा सुख रंगी।
दुर्गा चालीसा जो गावे। सब सुख भोग परमपद पावे॥`,
    transliteration: `|| Doha ||
Namo Namo Durge sukh karni. Namo Namo Ambe dukh harni.

|| Chaupai ||
Nirankar hai jyoti tumhari. Tihun lok pheli ujiyari.
Shashi lalaat mukh maha vishala. Netra laal bhrikuti vikrala...`,
    meaning: `The Durga Chalisa opens with a profound invocation, 'Namo Namo Durge sukh karni. Namo Namo Ambe dukh harni,' hailing the Divine Mother, Durga, as the bestower of happiness and the remover of all sorrow. This sets the tone for a hymn that celebrates her dual nature – both benevolent and fierce.

The subsequent verses delve into her cosmic essence, describing her as 'Nirankar hai jyoti tumhari,' the formless, transcendental light that illuminates all three worlds (*lokas*). Her iconography is vividly painted: a forehead adorned with the moon (*shashi lalaat*), a vast and awe-inspiring countenance (*mukh maha vishala*), fiery red eyes (*netra laal*), and formidable, arched brows (*bhrikuti vikrala*). This imagery evokes her powerful, protective, and sometimes terrifying aspect, reminiscent of *Mahakali* or *Chandika*. The Chalisa then affirms her role as the *Mahashakti*, the supreme power behind creation, sustenance, and dissolution of the universe, and as *Mahamaya*, who skilfully enchants and deludes the three worlds, guiding souls through the cosmic play.

The hymn then transitions to her Puranic exploits, particularly her role as the saviour of the *Devas*. It recounts how she assumed the fierce form of *Chandika* to vanquish the arrogant demon king Mahishasura, whose defeat is a central narrative in the *Devi Mahatmya* (Markandeya Purana). Her thunderous roar (*pari garjana kolahal bhari*) and her epithet 'Mahishasur Mardini Bhavani' underscore her prowess. Further verses celebrate her triumph over other formidable demons like Shumbha, Nishumbha, and Raktabeeja, whose blood-spilling regeneration was famously thwarted by *Kali* (a form of Durga) consuming his blood. The Chalisa concludes by portraying her as the ultimate refuge, 'Sab devan ki tumhin pukara,' to whom all gods turn in distress. It is a heartfelt prayer for her abundant grace (*kripa bharpur*) and protection, affirming her glory as supremely auspicious. The final *doha* connects her to Shiva as 'Ambe Durge Shiv sangi,' highlighting her role as his consort, Parvati, and promises that recitation of the Chalisa brings all happiness and the supreme state (*param pad*), signifying liberation.`,
    significance: `The Durga Chalisa holds immense spiritual significance for devotees of the Divine Mother. It is most profoundly recited during the auspicious periods of *Chaitra Navratri* (spring) and *Sharad Navratri* (autumn), nine-night festivals dedicated to the various forms of Durga. Beyond these major festivals, Tuesdays and Fridays are considered particularly propitious days for its recitation, as are *Ashtami* (the eighth day of the lunar fortnight). Its regular chanting is believed to invoke the protective energies of Goddess Durga, shielding devotees from enemies, removing deep-seated fears, and instilling courage and resilience in the face of adversity.

Devotees turn to the Durga Chalisa for a myriad of life situations – seeking strength to overcome career obstacles, relief from illness, harmony in relationships, success in examinations, or resolution in legal battles. The recommended count for recitation often varies based on the devotee's resolve or specific intention, commonly ranging from 11, 21, 51, or 108 times. Prior to recitation, purification is paramount; devotees typically bathe, wear clean clothes, and sit in a clean, consecrated space, often facing East or North, with offerings of flowers, incense, and a lit lamp. This ritualistic preparation enhances the efficacy of the practice. The Chalisa serves as a powerful narrative complement to the primary *Devi mantras* (such as 'Om Aim Hreem Kleem Chamundaye Vichche'), providing a devotional and mythological context that deepens the spiritual connection. Regionally, the Durga Chalisa is integral to the grand *Durga Puja* celebrations in Bengal and Eastern India, where it is chanted with fervour in homes and community *pandals*, embodying the collective devotion to the Mother Goddess.`,
  },
  {
    slug: 'ganesh-chalisa',
    type: 'chalisa',
    title: { en: 'Ganesh Chalisa', hi: 'गणेश चालीसा' },
    deity: 'Ganesha',
    deityDay: 3,
    devanagari: `॥ दोहा ॥
जय गणपति सदगुण सदन, कविवर बदन कृपाल।
विघ्न हरण मंगल करण, जय जय गिरिजालाल॥

॥ चौपाई ॥
जय जय जय गणपति गणराजू। मंगल भरण करण शुभ काजू॥
जय गजबदन सदन सुखदाता। विश्व विनायक बुद्धि विधाता॥

वक्रतुण्ड महाकाय शुभ कारन। सुन्दर मूरत कृपा वरारन॥
सिन्दूर रक्तवरण कल, शोभा महान। मुक्ताफल सम दन्त छवि जान॥

प्रथम पूज्य तुम देवन देवा। शक्ति शंभु गणपत करें सेवा॥
चरण कमल छवि अति ही न्यारी। करो कृपा जनहित अवतारी॥

॥ दोहा ॥
जय जय जय गिरिजानन्दन। मंगलमूर्ति विनायक वन्दन॥
गणेश चालीसा पढ़े, सब सिद्धि हो जाय।
दूर होय सब संकट, मंगलमय सुख पाय॥`,
    transliteration: `|| Doha ||
Jai Ganapati sadgun sadan, kavivar badan kripal.
Vighn haran mangal karan, Jai Jai Girijalal.

|| Chaupai ||
Jai Jai Jai Ganapati Ganraju. Mangal bharan karan shubh kaaju.
Jai Gajbadan sadan sukhdaata. Vishwa Vinayak buddhi vidhaata...`,
    meaning: `The opening *Doha* of the Ganesh Chalisa immediately establishes Lord Ganesha's essence: "Jai Ganapati sadgun sadan, kavivar badan kripal. Vighn haran mangal karan, Jai Jai Girijalal." This invokes Ganesha as the embodiment of all virtues, eloquent and compassionate, the remover of obstacles (*Vighnaharta*), and the bestower of auspiciousness (*Mangalkarta*). He is reverently hailed as *Girijalal*, the beloved son of Parvati, underscoring his divine parentage and connection to the cosmic forces of creation and preservation.

The subsequent *Chaupais* elaborate on his divine attributes and iconic form. He is praised as *Ganapati Ganraju*, the sovereign leader of the *ganas* (Shiva's celestial attendants), whose very presence brings auspiciousness and ensures the successful completion of all endeavours (*shubh kaaju*). His iconic elephant head (*Gajbadan*) is celebrated as the source of happiness and the universal bestower of intellect (*buddhi vidhaata*), making him *Vishwa Vinayak* – the universal leader. The verses describe his *Vakratunda Mahakaya* (curved trunk, massive body), a form that is inherently auspicious and beautiful (*sundar murat*), radiating grace. His iconography is further detailed with his vermillion hue (*sindoor raktavaran*), symbolising vitality and energy, and teeth resembling pearls (*muktafal sam dant*), often interpreted as representing purity, wisdom, or the broken tusk he used to write the Mahabharata.

The chalisa underscores his supreme position: "Pratham poojya tum devan deva," acknowledging him as the foremost deity to be worshipped before all others – a tradition rooted in Puranic narratives where even Shiva and the *devas* seek his blessings before commencing any task. The text concludes by seeking his divine grace, "karo kripa janahit avatari," for the welfare of all beings, reaffirming his role as a benevolent saviour. The final *Doha* promises that reciting this *Chalisa* bestows all *siddhis* (spiritual accomplishments), removes all troubles, and grants profound, auspicious happiness, encapsulating the devotee's faith in Ganesha's power to transform lives and ensure success.`,
    significance: `The Ganesh Chalisa holds profound spiritual significance for devotees, serving as a powerful devotional hymn to invoke Lord Ganesha's blessings. It is traditionally recited on Wednesdays, a day specifically dedicated to Ganesha, to seek his wisdom, protection, and the removal of obstacles. The *Chalisa*'s recitation intensifies during the annual Ganesh Chaturthi festival, a ten-day celebration in the Hindu month of Bhadrapada, particularly in regions like Maharashtra, where grand *Ganesh Visarjan* processions mark the culmination of the festivities. During this period, devotees often perform multiple recitations, sometimes up to 11, 21, or 108 times, to deepen their spiritual connection and accumulate merit.

Devotees turn to the Ganesh Chalisa in a myriad of life situations, primarily to overcome obstacles (*vighnas*) in their path, making Ganesha the ultimate *Vighnaharta*. It is particularly recommended for students seeking academic success, individuals starting new businesses or ventures, and those facing career challenges or legal issues. The *Chalisa* is also recited for general well-being, to alleviate fear, and to seek divine intervention during times of illness or when making significant life decisions, such as marriage. Before recitation, it is customary to purify oneself through a bath and wear clean clothes, sitting on a clean *asana* in a sacred space, often before an idol or image of Ganesha.

The Ganesh Chalisa complements the primary Ganesha *mantras*, such as *Om Gam Ganapataye Namaha*, by providing a narrative and descriptive form of devotion that engages the mind and heart more comprehensively. While *mantras* are potent sonic vibrations, the *Chalisa* offers a lyrical expression of praise and prayer, making the deity's attributes and powers more accessible and relatable. Its regular recitation is believed to cultivate inner peace, enhance focus, and attract auspicious energies, ensuring that all endeavours are undertaken with divine favour and culminate in success.`,
  },
  {
    slug: 'saraswati-chalisa',
    type: 'chalisa',
    title: { en: 'Saraswati Chalisa', hi: 'सरस्वती चालीसा' },
    deity: 'Saraswati',
    deityDay: 4,
    devanagari: `॥ दोहा ॥
बन्दौं सरसुति चरन युग, रज नख मणि गन जोति।
मोर मुकुर निज बदन में, लखौं ललाम सुमोति॥

॥ चौपाई ॥
जय जय सुरगिरा ज्ञान की दाता। जय सरस्वती बुद्धि विधाता॥
शुभ्र वसन परिधान किये शोभित। शुभ्र पुष्प शोभित कर कमलित॥

वीणा पुस्तक धारिणी माता। ब्रह्माजी के हृदय बसाता॥
चतुर्भुजी कमलासन वाली। शारदा ज्ञान दायिनी बाली॥

पुत्र हो बुद्धि विद्या के दाता। नाम सरस्वती ज्ञान विधाता॥
मन्द बुद्धि सब दूर करो मैया। करो कृपा सरस्वती मैया॥

॥ दोहा ॥
सरस्वती चालीसा जो, नित पढ़ें नर मनलाय।
ज्ञान बुद्धि कविता मिले, विघ्न कटे सब जाय॥`,
    transliteration: `|| Doha ||
Bandaun Sarsuti charan yug, raj nakh mani gan joti.
Mor mukur nij badan mein, lakhaun lalaam sumoti.

|| Chaupai ||
Jai Jai Surgira gyan ki data. Jai Saraswati buddhi vidhata.
Shubhra vasan paridhaan kiye shobhit. Shubhra pushp shobhit kar kamlit...`,
    meaning: `The Saraswati Chalisa commences with a humble invocation in its opening *doha*, where the devotee reverentially bows to the sacred feet of Goddess Saraswati. The imagery of Her toenails shining like jewels and reflecting the devotee's own beautified visage symbolises the purifying and enlightening power of devotion. It suggests that by contemplating the divine source of wisdom, one’s own inner self becomes refined and illuminated.

The subsequent *chaupais* systematically praise the Goddess and delineate her divine attributes. She is hailed as *Surgira*, the Goddess of Speech, and the ultimate bestower of *Jnana* (knowledge) and *Buddhi* (intellect), underscoring her fundamental role in human cognition and expression. Her iconography is vividly described: adorned in pristine white garments and white flowers, symbols of purity, peace, and the unblemished nature of true wisdom. She is depicted holding the *Veena*, representing the arts, music, and harmony, and a sacred book, signifying the *Vedas* and all forms of learning. As the consort of Lord Brahma, the creator, she resides in his heart, embodying the creative principle of knowledge itself.

Further verses portray her as *Chaturbhuji*, four-armed, symbolising the four aspects of human consciousness – mind (*manas*), intellect (*buddhi*), ego (*ahamkara*), and conditioned consciousness (*chitta*). Seated on a lotus, she signifies purity and spiritual transcendence. Addressed as *Sharada*, a prominent name for Saraswati, she is invoked as the powerful giver of knowledge. The chalisa culminates in a heartfelt prayer, beseeching the Mother to bestow intelligence and education, and to dispel all forms of mental dullness and ignorance. The concluding *doha* acts as a *phala-shruti*, promising that sincere daily recitation of the Saraswati Chalisa grants knowledge, intellect, poetic ability, and the removal of all obstacles, thereby enriching the devotee's intellectual and spiritual life.`,
    significance: `The Saraswati Chalisa holds profound spiritual and practical significance for devotees, particularly those engaged in learning, arts, and intellectual pursuits. It is traditionally recited on Thursdays, a day associated with wisdom and spiritual growth, and its potency is greatly amplified during the festival of *Vasant Panchami*, which marks the appearance day of Goddess Saraswati. During this auspicious period, devotees, especially students and artists, perform *Saraswati Puja*, placing books, musical instruments, and artistic tools before her idol or image, seeking her blessings for proficiency and inspiration.

Devotees turn to the Saraswati Chalisa in various life situations where clarity of thought, eloquence, and creative expression are paramount. It is a powerful recourse for students facing examinations, scholars undertaking research, writers seeking inspiration, musicians striving for mastery, and speakers desiring articulate communication. The chalisa is believed to remove mental blocks, enhance memory, and foster a deeper understanding of complex subjects. While there isn't a strict universal number, many traditions recommend reciting *chalisas* 11, 21, 51, or 108 times for specific intentions, often after a ritual bath and in a clean space to ensure purity of mind and body.

Recitation of the Saraswati Chalisa complements the chanting of her primary *mantras*, such as the *Om Aim Saraswatyai Namaha*, by providing a narrative and devotional framework that deepens one's connection with the Goddess. In regional traditions, particularly in Bengal, Saraswati Puja is a vibrant part of the cultural calendar, where the Goddess is revered not just as a deity of learning but also as a symbol of cultural refinement and artistic excellence. The chalisa serves as an accessible and comprehensive hymn, allowing devotees of all backgrounds to invoke the divine grace of *Devi Saraswati* for intellectual and creative flourishing.`,
  },
  {
    slug: 'lakshmi-chalisa',
    type: 'chalisa',
    title: { en: 'Lakshmi Chalisa', hi: 'लक्ष्मी चालीसा' },
    deity: 'Lakshmi',
    deityDay: 5,
    devanagari: `॥ दोहा ॥
मातु लक्ष्मी करि कृपा, करो हृदय में वास।
मनोकामना सिद्ध करो, पूरण करो सब आस॥

॥ चौपाई ॥
सिन्धु सुता मैं सुमिरौं तोही। ज्ञान बुद्धि विद्या दो मोही॥
तुम समान नहिं कोई उपकारी। सब विधि पुरवहु आस हमारी॥

जय जय जगत जननी जगदम्बा। सबके तुम हो दिव्य अवलम्बा॥
तुम्ही हो रसवासिनी रासे। तुम्हीं शक्ति सबहिन में वासे॥

जगत माता मंगल की खानी। पापहरणी त्रिभुवन की रानी॥
तुम हो सदा दयालु दया की। करो कृपा कृपालु की जा की॥

॥ दोहा ॥
लक्ष्मी चालीसा पढ़े, जो कोई शुद्ध मनाय।
घर में सुख सम्पत्ति बढ़े, कभी न होय दरिद्राय॥`,
    transliteration: `|| Doha ||
Matu Lakshmi kari kripa, karo hriday mein vaas.
Manokaamna siddh karo, puran karo sab aas.

|| Chaupai ||
Sindhu suta main sumiron tohi. Gyan buddhi vidya do mohi.
Tum samaan nahin koi upkaari. Sab vidhi purvahu aas hamari...`,
    meaning: `The Lakshmi Chalisa commences with a heartfelt invocation in its opening *doha*, where the devotee humbly requests Mother Lakshmi to graciously reside within their heart. This plea extends to the fulfilment of all desires (*manokaamna*) and aspirations (*aas*), establishing Lakshmi as the ultimate bestower of auspiciousness and prosperity, both material and spiritual. It highlights her role not merely as a giver of wealth, but as a divine presence that brings inner contentment and success.

The subsequent *chaupais* elaborate on her divine attributes. She is addressed as *Sindhu Suta*, the daughter of the ocean, a direct reference to her mythical emergence during the *Samudra Manthan*, the churning of the cosmic ocean, as narrated in the *Vishnu Purana* and *Bhagavata Purana*. From this primordial event, she arose, seated on a lotus and holding a lotus bud, choosing Lord Vishnu as her eternal consort. The chalisa then expands her domain beyond mere riches, asking for *gyan, buddhi, vidya* – knowledge, intellect, and learning – thereby acknowledging her encompassing nature as *Vidya Lakshmi*. Her unparalleled benevolence (*upkaari*) is praised, affirming that no other deity can grant boons with such generosity.

Further verses hail her as *Jagat Janani Jagadamba*, the divine Mother of the universe, the supreme support (*divya avalamba*) for all beings. She is described as *Rasvasini Rase*, dwelling in the essence of joy and beauty, and the inherent *shakti* (power) that animates all existence. As *Jagat Mata* and *Mangal ki khani*, she is the source of all auspiciousness, purifying sins (*paap harini*) and reigning as the Queen of the three worlds (*Tribhuvan ki Rani*). Her eternal compassion (*sada dayalu daya ki*) is a recurring theme, reinforcing her gentle and nurturing nature. The concluding *doha* promises that sincere recitation of the Lakshmi Chalisa with a pure heart (*shuddh manay*) will lead to an increase in happiness and prosperity (*sukh sampatti*) within the home, ensuring freedom from poverty (*daridraya*). This encapsulates the essence of her worship – a holistic quest for well-being, guided by devotion.`,
    significance: `The Lakshmi Chalisa holds profound significance in Hindu devotional practice, primarily recited to invoke the blessings of Goddess Lakshmi for wealth, prosperity, and overall well-being. It is traditionally chanted on Fridays, a day specifically dedicated to her worship, and its potency is believed to intensify during auspicious periods such as Diwali, the festival of lights, and throughout the entire month of Kartik, which is associated with abundance and spiritual merit. Devotees also turn to this chalisa during Sharad Purnima, known as Kojagiri Purnima, when Lakshmi is believed to visit homes to bestow blessings.

Individuals facing financial difficulties, embarking on new business ventures, or seeking stability and harmony in their family life frequently recite this prayer. Married women often chant it for the prosperity and welfare of their households. While there isn't a strict prescribed count, many devotees choose to recite it 11, 21, or 108 times, often as part of a daily ritual or during specific *pujas*. Prior purification, involving a ritual bath and wearing clean clothes, along with a pure mind and dedicated space, is considered essential for effective recitation.

This chalisa beautifully complements the chanting of Lakshmi's primary *mantras*, such as the *Om Śrīṁ Hrīṁ Śrīṁ Kamala Kamalālaye Prasīda Prasīda Śrīṁ Hrīṁ Śrīṁ Mahālakṣmyai Namaḥ* or the *Lakshmi Gayatri Mantra*. While mantras are potent sound vibrations, the chalisa provides a narrative and devotional context, allowing the devotee to connect with the Goddess's various attributes and Puranic manifestations, including her eight forms (*Ashta Lakshmi*) – *Dhana Lakshmi* (wealth), *Dhanya Lakshmi* (grains), *Vidya Lakshmi* (knowledge), and others – all implicitly invoked through its verses. It serves as a comprehensive and accessible means of expressing devotion and seeking her divine grace across various regions of India.`,
  },
  {
    slug: 'ram-chalisa',
    type: 'chalisa',
    title: { en: 'Ram Chalisa', hi: 'राम चालीसा' },
    deity: 'Rama',
    deityDay: 3,
    devanagari: `॥ दोहा ॥
श्री रघुबर के चरन में, करूँ आज मैं ध्यान।
वर्णन करूँ मैं राम का, अपनी बुद्धि अनुसार॥

॥ चौपाई ॥
जय राम सदा सुखधाम हरे। रघुनन्दन दशरथ के प्यारे॥
प्रभु विष्णु अवतार तुम्हारा। सब जग जानत पुरुषोत्तम प्यारा॥

कौशल्या के प्रिय दुलारे। विश्वामित्र मखन रखवारे॥
ताड़का मारि मारि सुबाहू। कीन्ह कृपा गौतम गृह जाहू॥

शिव धनुष महँ हाथ दुरायो। सीता पाणि ग्रहण किये लायो॥
वन में चौदह वर्ष बिताये। भरत मिलाप मोहन मन भाये॥

॥ दोहा ॥
राम चालीसा पढ़ जो कोई। रामकृपा सब पर होई।
मन वांछित फल पावे, संकट सब मिट जावे॥`,
    transliteration: `|| Doha ||
Shri Raghubar ke charan mein, karoon aaj main dhyaan.
Varnan karoon main Ram ka, apni buddhi anusaar.

|| Chaupai ||
Jai Ram sada sukhdham Hare. Raghunandan Dasharath ke pyare.
Prabhu Vishnu avatar tumhara. Sab jag janat Purushottam pyara...`,
    meaning: `The *Ram Chalisa* commences with a humble invocation, where the devotee expresses their intent to meditate upon the sacred feet of Shri Raghubar, an epithet for Rama signifying his lineage from the Raghu dynasty. This opening *doha* sets a tone of reverence and acknowledges the limitations of human intellect in fully describing the divine, yet resolves to undertake this devotional task. The subsequent *chaupais* unfold as a concise yet potent narrative of Lord Rama's glorious life and divine attributes.

The verses laud Rama as *sukh-dham* – the eternal abode of happiness – and identify him as Hari, a direct reference to his identity as an incarnation of Lord Vishnu, the preserver of the cosmos. He is celebrated as the beloved son of Dasharatha and Kausalya, and universally acknowledged as *Purushottam*, the Supreme Being or ideal man, embodying perfect righteousness and virtue. The *chalisa* then swiftly recounts pivotal episodes from the *Ramayana*: his early childhood protection of Sage Vishwamitra's *yajna* from demonic forces like Tadaka and Subahu, demonstrating his inherent strength and commitment to dharma. His compassionate liberation of Ahalya, cursed by Gautama Rishi, highlights his boundless grace. The breaking of Shiva's formidable bow, *Pinaka*, to win the hand of Sita Devi in Mithila underscores his unparalleled valour and destiny. The narrative culminates with his fourteen-year forest exile, a period of immense sacrifice and steadfast adherence to paternal command, and the poignant reunion with his devoted brother Bharata, showcasing his profound familial bonds and emotional depth. The concluding *doha* promises that sincere recitation of this *chalisa* bestows Rama's divine grace, fulfilling desires and alleviating all forms of suffering, thereby cementing its role as a powerful devotional tool for spiritual solace and material well-being.`,
    significance: `The recitation of the *Ram Chalisa* holds profound spiritual significance for devotees of Lord Rama, offering a structured path to connect with his divine virtues and seek his blessings. While it can be recited on any day, Tuesdays and Saturdays are traditionally considered particularly auspicious for invoking Hanuman, Rama's ardent devotee, and by extension, Rama himself. However, Wednesdays are also associated with Vishnu, making them suitable. The *chalisa*'s potency intensifies during specific Hindu festival windows, most notably during *Rama Navami*, the celebration of Rama's birth, and throughout the nine nights of *Sharad Navaratri* leading up to *Dussehra*, which commemorates Rama's victory over Ravana.

Devotees turn to the *Ram Chalisa* in numerous life situations, seeking solace and strength. It is commonly recited to overcome career obstacles, alleviate physical ailments, resolve marital discord, ensure success in examinations, and dispel fear or anxiety. The recommended practice often involves reciting the *chalisa* 11, 21, 51, or 108 times, particularly over a period of 40 days, known as a *mandala*, to achieve specific intentions. Prior purification, including a ritual bath and wearing clean clothes, is generally advised to create a sacred atmosphere conducive to devotion. While the *Ram Chalisa* itself is a complete prayer, it beautifully complements the primary *Rama mantra*, such as "Om Sri Ramaya Namaha" or "Hare Rama Hare Rama, Rama Rama Hare Hare," by providing a narrative context and deeper understanding of the deity's attributes and deeds. Though not tied to a specific regional tradition in the same way as, say, Bengal's Durga Puja, the *Ram Chalisa* is a pan-Indian devotional practice, deeply embedded in the spiritual fabric of communities across the subcontinent, particularly in regions with strong Vaishnava traditions.`,
  },
  {
    slug: 'bajrang-baan',
    type: 'chalisa',
    title: { en: 'Bajrang Baan', hi: 'बजरंग बाण' },
    deity: 'Hanuman',
    deityDay: 2,
    devanagari: `॥ दोहा ॥
निश्चय प्रेम प्रतीति ते, विनय करें सनमान।
तेहि के कारज सकल शुभ, सिद्ध करें हनुमान॥

चौपाई
जय हनुमन्त सन्त हितकारी। सुन लीजै प्रभु अरज हमारी॥
जन के काज बिलम्ब न कीजै। आतुर दौरि महा सुख दीजै॥

जैसे कूदि सिन्धु महँ पारा। सुरसा बदन पैठि बिस्तारा॥
आगे जाय लंकिनी रोका। मारेहु लात गई सुर लोका॥

जाय बिभीषण को सुख दीन्हा। सीता निरखि परम पद लीन्हा॥
बाग उजारि सिन्धु महँ बोरा। अति आतुर जम को दुख तोरा॥

अक्षयकुमार मारि संहारा। लूम लपेटि लंक को जारा॥
लाह समान लंक जरि गई। जय जय धुनि सुरपुर नभ भई॥

अबके बेर निबाहू नाथा। ओं कार हुं हुं हुं हनुमन्ता॥

ओं हनुं हनुं हनुं हनुमन्त हठीले।
बैरिहिं मारु बज्र की कीले॥
ओं ह्नीं ह्नीं ह्नीं हनुमन्त कपीसा।
ओं हुं हुं हुं हनु अरि उर शीशा॥

जय जय जय हनुमान गोसाईं।
भक्तन के काज धावो भाई॥`,
    transliteration: `|| Doha ||
Nishchay prem prateeti te, vinay karein sanmaan.
Tehi ke kaaraj sakal shubh, siddh karein Hanuman.

Chaupai
Jai Hanumant sant hitkari. Sun leejai Prabhu araj hamari.
Jan ke kaaj bilamb na keejai. Aatur dauri maha sukh deejai.

Jaise koodi Sindhu mahan para. Surasa badan paithi bistara.
Aage jaay Lankini roka. Maarehu laat gai Sur Loka...`,
    meaning: `The Bajrang Baan commences with a profound *doha*, establishing the core principle of devotion: "Nishchay prem prateeti te, vinay karein sanmaan. Tehi ke kaaraj sakal shubh, siddh karein Hanuman." This couplet asserts that with unwavering love (*prem*), firm faith (*prateeti*), and humble reverence (*sanmaan*), any devotee who supplicates to Hanuman will find all their auspicious tasks accomplished. It underscores Hanuman's role as a swift and benevolent bestower of success, particularly for those who approach him with sincerity.

The subsequent *chaupais* vividly recount Hanuman's unparalleled valour and devotion, drawing directly from the *Ramayana*. The prayer invokes his legendary leap across the *Sindhu* (ocean) to Lanka, an act of immense strength and resolve. It recalls his encounters with *Surasa*, the serpent demoness, whom he outwitted with his ability to expand and contract his form, and *Lankini*, the guardian of Lanka, whom he subdued with a single blow, fulfilling the prophecy of Lanka's impending doom. The verses then praise his compassionate act of comforting *Vibhishana*, the righteous brother of Ravana, and his pivotal role in locating *Sita* in the *Ashoka Vatika*. His destructive acts – the devastation of the *Ashoka Vatika*, the slaying of *Akshaya Kumara* (Ravana's son), and the burning of Lanka with his tail – are recounted as demonstrations of his fierce loyalty to Rama and his formidable power against evil. The prayer transitions into a direct invocation using powerful *tantric* syllables like *Om*, *Hum*, and *Hreem*, calling upon Hanuman, the mighty ape-god (*Kapisha*), to swiftly destroy enemies and protect the devotee, concluding with an urgent plea for his immediate assistance in times of need, echoing his readiness to serve Rama.`,
    significance: `The Bajrang Baan holds a unique and potent position among Hindu devotional hymns, particularly revered for its protective qualities. Unlike the more general Hanuman Chalisa, the Bajrang Baan is specifically invoked when a devotee faces severe and immediate threats, such as intense adversarial forces, malevolent energies, or seemingly insurmountable obstacles. The term 'Baan' literally means 'arrow,' signifying its direct, swift, and decisive action, much like an arrow aimed at a target. It is believed to be a spiritual weapon against negative influences, including black magic, illness, and legal battles.

Traditionally, the Bajrang Baan is recited with utmost discipline and purity. It is particularly efficacious when chanted on Tuesdays and Saturdays, days dedicated to Hanuman. Devotees often undertake a period of purification, including *brahmacharya* (celibacy) and a sattvic diet, before commencing its recitation. While there isn't a fixed festival window for its intensification, it is often recited during periods of personal crisis or during *Navaratri* for heightened spiritual protection. It is recommended to recite the Hanuman Chalisa before and after the Bajrang Baan to temper its powerful energy and ensure a balanced spiritual practice. The number of recitations can vary, but a practice of 11, 21, or 108 times is common, often performed for a specific number of days. Its recitation complements the primary *mantra* 'Om Hoom Hanumate Rudratmakaya Hoom Phat' by providing a narrative and emotional context for Hanuman's protective power, making the invocation more personal and fervent.`,
  },
  {
    slug: 'shani-chalisa',
    type: 'chalisa',
    title: { en: 'Shani Chalisa', hi: 'शनि चालीसा' },
    deity: 'Shani',
    deityDay: 6,
    devanagari: `॥ दोहा ॥
जय गणेश गिरिजा सुवन, मंगल करण कृपाल।
दीनन के दुख हरण हर, कीजै नाथ निहाल॥

श्री शनिश्चर देव की, करूँ नित्य मैं सेव।
करे कृपा सूरज कुमार, प्रभु छाया तनुजे देव॥

॥ चौपाई ॥
जय जय श्री शनि देव दयाला। करत सदा भक्तन प्रतिपाला॥
चार भुजा तनु श्याम विराजे। माथे रत्न मुकुट छवि साजे॥

कृष्ण वस्त्र कृष्ण ध्वज धारी। कृष्ण अश्व पर शोभित सवारी॥
सूर्यतनुज छाया मात जाये। धनु राशि में शनि प्रभु छाये॥

बलवान शनि गुण सब जाने। जन जन की पीड़ा पहचाने॥
करत न्याय सदा मन माही। भक्त जनन को कष्ट कदाहीं नाहीं॥

॥ दोहा ॥
शनि चालीसा जो पढ़े, सब दिन शनिवार।
कृपा करें शनिदेव प्रभु, उतरे संकट भार॥`,
    transliteration: `|| Doha ||
Jai Ganesh Girija suvan, mangal karan kripal.
Deenan ke dukh haran Har, keejai Nath nihaal.

Shri Shanishchar Dev ki, karoon nitya main sev.
Kare kripa Suraj Kumar, Prabhu Chhaya tanuje Dev.

|| Chaupai ||
Jai Jai Shri Shani Dev dayaala. Karat sada bhaktan pratipaala.
Chaar bhuja tanu shyam viraaje. Maathe ratna mukut chhavi saaje...`,
    meaning: `The Shani Chalisa commences with an invocation to Lord Ganesha, the remover of obstacles and bestower of auspiciousness, seeking His benevolent grace for the success of the recitation. This traditional opening ensures a smooth spiritual journey. Following this, the devotee pledges daily service (*sev*) to Shri Shanishchara Dev, earnestly praying for the blessings of the son of Surya (the Sun God) and Chhaya (Shadow Goddess), thereby establishing Shani’s divine lineage and powerful cosmic connection.

The central *chaupais* vividly describe Lord Shani’s majestic form and attributes. He is hailed as compassionate (*dayaala*) and a constant protector (*pratipaala*) of His devotees, challenging the common perception of Him as solely fearsome. His iconography is detailed: a dark-complexioned deity with four arms, adorned with a jewelled crown, dressed in black garments, holding a black flag, and mounted upon a magnificent black horse (*krishna ashva*). These attributes symbolise His profound depth, mystery, and formidable power. The *chalisa* reiterates His parentage, identifying Him as the offspring of Surya and Chhaya, and mentions His pervasive influence, particularly in astrological contexts, where He is known to govern the signs of Capricorn and Aquarius. He is acknowledged as mighty (*balwan*), possessing all virtues, and uniquely capable of understanding the suffering (*peeda*) of all beings. Crucially, the text affirms that Shani always delivers justice (*nyay*) impartially and ensures that His true devotees never face unwarranted hardship, underscoring His role as a righteous dispenser of karmic consequences.

The concluding *doha* encapsulates the profound benefit of reciting this sacred hymn. It declares that anyone who recites the Shani Chalisa, especially on Saturdays – the day dedicated to Lord Shani – will receive His divine grace, leading to the alleviation of their burdens (*sankat bhaar*) and the resolution of their difficulties. This final verse serves as both an assurance and an encouragement for consistent devotion.`,
    significance: `The Shani Chalisa holds immense spiritual and astrological significance, primarily recited on Saturdays (*Shanivar*), the day consecrated to Lord Shani. It is particularly vital for individuals undergoing challenging planetary transits such as *Sade Sati* (the 7.5-year period of Saturn’s influence), *Shani Mahadasha* (the major planetary period of Saturn), or *Dhaiyya* (the 2.5-year transit). Devotees turn to this *chalisa* to mitigate the adverse effects of Shani’s influence, seeking to transform potential hardships into opportunities for growth, discipline, and spiritual evolution. It is sought for guidance through career obstacles, financial difficulties, health issues, relationship challenges, and to overcome general fear or anxiety associated with Shani’s reputation as a strict karmic teacher.

Recitation typically involves a purification ritual, such as bathing and wearing clean clothes, performed in a serene and clean space. Offerings traditionally made to Shani Dev include mustard oil, black sesame seeds (*til*), black cloth, and iron articles, which are presented with devotion before or during the recitation. While there is no fixed count, devotees often recite the *chalisa* 1, 3, 7, 11, or 108 times, depending on their resolve and the specific intention. Regularity and sincerity are considered more important than the mere number of repetitions. The Shani Chalisa complements the primary *mantras* dedicated to Shani, such as *Om Sham Shanaishcharaya Namaha*, by providing a narrative and devotional context that deepens understanding and fosters a more profound connection with the deity. While not tied to specific pan-Indian festivals like Navratri or Shivaratri, its recitation intensifies during periods of astrological significance for Shani. The Shani Shingnapur temple in Maharashtra stands as a prominent pilgrimage site, reflecting the widespread devotion to Lord Shani across India.`,
  },

  {
    slug: 'krishna-chalisa',
    type: 'chalisa',
    title: { en: 'Krishna Chalisa', hi: 'कृष्ण चालीसा' },
    deity: 'Krishna',
    deityDay: 1,
    devanagari: `॥ दोहा ॥
बंशी शोभित कर मधुर, नील जलद तन श्याम।
अरुण अधर जनु बिम्बफल, जयति जय जय गोपाल॥

॥ चौपाई ॥
जय यदुनंदन जय जगवंदन, जय वसुदेव देवकी नंदन।
जय यशोदा सुत नन्द दुलारे, जय प्रभु भक्तन के रखवारे॥
जय नटनागर नाग नथैया, कृष्ण कन्हैया धेनु चरैया।
पुनि नख पर गिरिवर को धारयो, दुष्टन कंस महाबल मारयो॥
माखन चोरी ब्रज नारिन संग, रास रच्यो सब ही विधि रंग।
गोपिन संग रास रचैया, कंस निकंदन भव भय हरैया॥
श्याम सुंदर सिर मुकुट सुहाये, मोर पंख पीताम्बर छाये।
गले वैजयंती माल विराजे, जय जय मोहन मधुर स्वर गाजे॥
कालीदह में नाग नथैया, गोकुल के सब दुख हरैया।
वृंदावन में रास रचैया, मुरली मनोहर मन हरैया॥
गोवर्धन लीला अति सुखकारी, कंस को मारा बनवारी।
देवकी माता के तुम प्यारे, यशोदा मैया के दुलारे॥
गोपिन के तुम प्राण प्यारे, भक्तन के तुम रखवारे।
मथुरा नगरी के तुम राजा, कंस को मारा बजाया बाजा॥
द्वारिका नगरी के तुम स्वामी, भक्तन के तुम अंतरयामी।
अर्जुन के तुम सारथी प्यारे, गीता ज्ञान दिया संसारे॥
महाभारत में युद्ध कराया, धर्म की रक्षा तुमने कराया।
पांडवन के तुम हितकारी, दुष्ट कौरवन के संहारी॥
द्रौपदी की लाज बचाई, दुष्ट दुशासन को हरवाई।
सुदामा के तुम मित्र प्यारे, भक्तन के तुम प्राण प्यारे॥
नरसी मेहता के तुम स्वामी, भक्तन के तुम अंतरयामी।
मीराबाई के तुम गिरधारी, भक्तन के तुम प्राण प्यारे॥
कबीर के तुम राम पियारे, भक्तन के तुम रखवारे।
सूरदास के तुम प्रभु प्यारे, भक्तन के तुम प्राण प्यारे॥
रैदास के तुम स्वामी प्यारे, भक्तन के तुम रखवारे।
तुलसीदास के तुम राम पियारे, भक्तन के तुम प्राण प्यारे॥
जय जय कृष्ण कन्हैया लाल की, जय जय गोवर्धन धारी की।
जय जय यशोदा नंदन की, जय जय देवकी नंदन की॥
जय जय राधा रमण की, जय जय रुक्मिणी रमण की।
जय जय सत्यभामा रमण की, जय जय जाम्बवती रमण की॥
जय जय लक्ष्मी रमण की, जय जय भूमि रमण की।
जय जय श्री कृष्ण भगवान की, जय जय श्री कृष्ण भगवान की॥

॥ दोहा ॥
यह चालीसा जो पढ़े, कृष्ण कृपा होय।
दुःख दरिद्र मिटे सब, सुख सम्पति होय॥`,
    transliteration: `|| Doha ||
Baṃśī śobhita kara madhura, nīla jalada tana śyāma |
Aruṇa adhara janu bimbaphala, jayati jaya jaya gopāla ||

|| Caupāī ||
Jaya yadunandana jaya jagavandana, jaya vasudeva devakī nandana |
Jaya yaśodā suta nanda dulāre, jaya prabhu bhaktana ke rakhavāre ||
Jaya naṭanāgara nāga nathaiyā, kṛṣṇa kanhaiyā dhenu caraiyā |
Puni nakha para girivara ko dhārayo, duṣṭana kaṃsa mahābala mārayo ||
Mākhana corī braja nārīna saṃga, rāsa racyo saba hī vidhi raṃga |
Gopina saṃga rāsa racaiyā, kaṃsa nikandana bhava bhaya haraiyā ||
Śyāma suṃdara sira mukuṭa suhāye, mora paṃkha pītāmbara chāye |
Gale vaijayaṃtī māla virāje, jaya jaya mohana madhura svara gāje ||
Kālīdaha meṃ nāga nathaiyā, gokula ke saba dukha haraiyā |
Vṛṃdāvana meṃ rāsa racaiyā, muralī manohara mana haraiyā ||
Govardhana līlā ati sukhakārī, kaṃsa ko mārā banavārī |
Devakī mātā ke tuma pyāre, yaśodā maiyā ke dulāre ||
Gopina ke tuma prāṇa pyāre, bhaktana ke tuma rakhavāre |
Mathurā nagarī ke tuma rājā, kaṃsa ko mārā bajāyā bājā ||
Dvārikā nagarī ke tuma svāmī, bhaktana ke tuma aṃtaryāmī |
Arjuna ke tuma sārathī pyāre, gītā jñāna diyā saṃsāre ||
Mahābhārata meṃ yuddha karāyā, dharma kī rakṣā tumane karāyā |
Pāṃḍavana ke tuma hitakārī, duṣṭa kauravana ke saṃhārī ||
Draupadī kī lāja bacāī, duṣṭa duśāsana ko haravāī |
Sudāmā ke tuma mitra pyāre, bhaktana ke tuma prāṇa pyāre ||
Narasī mehatā ke tuma svāmī, bhaktana ke tuma aṃtaryāmī |
Mīrābāī ke tuma giridhārī, bhaktana ke tuma prāṇa pyāre ||
Kabīra ke tuma rāma piyāre, bhaktana ke tuma rakhavāre |
Sūradāsa ke tuma prabhu pyāre, bhaktana ke tuma prāṇa pyāre ||
Raidāsa ke tuma svāmī pyāre, bhaktana ke tuma rakhavāre |
Tulasīdāsa ke tuma rāma piyāre, bhaktana ke tuma prāṇa pyāre ||
Jaya jaya kṛṣṇa kanhaiyā lāla kī, jaya jaya govardhana dhārī kī |
Jaya jaya yaśodā nandana kī, jaya jaya devakī nandana kī ||
Jaya jaya rādhā ramaṇa kī, jaya jaya rukmiṇī ramaṇa kī |
Jaya jaya satyabhāmā ramaṇa kī, jaya jaya jāmbavatī ramaṇa kī ||
Jaya jaya lakṣmī ramaṇa kī, jaya jaya bhūmi ramaṇa kī |
Jaya jaya śrī kṛṣṇa bhagavāna kī, jaya jaya śrī kṛṣṇa bhagavāna kī ||

|| Doha ||
Yaha cālīsā jo paṛhe, kṛṣṇa kṛpā hoya |
Duḥkha daridra miṭe saba, sukha sampati hoya ||`,
    meaning: `The Krishna Chalisa is a devotional hymn dedicated to Lord Krishna, the eighth avatar of Vishnu, celebrating his divine attributes and myriad pastimes. The opening doha describes Krishna's enchanting form: his hands adorned with a sweet flute, his body the colour of a dark cloud (blue-black), and his lips red like the Bimba fruit, concluding with salutations to Gopal, the cowherd lord.

The subsequent chaupais recount key episodes from Krishna's life, as detailed in the Bhagavata Purana and Mahabharata. It praises him as the beloved son of Vasudeva and Devaki, and the darling of Yashoda and Nanda, the protector of devotees. The verses vividly portray his childhood exploits, such as subduing the serpent Kaliya in the Yamuna, lifting the Govardhan mountain to protect the villagers of Braj, and slaying the tyrannical King Kamsa. His playful nature is highlighted through his butter-stealing antics and the enchanting Maharaas dance with the gopis of Vrindavan. The Chalisa also describes his standard iconography: a peacock feather crown, a yellow dhoti (pitambara), and a garland of Vaijayanti flowers, all enhancing his captivating presence.

Further, the hymn extols his role as Arjuna's charioteer and the giver of the Bhagavad Gita's profound wisdom during the Mahabharata war, where he upheld Dharma and protected the Pandavas. It recalls his act of saving Draupadi's honour and his selfless friendship with Sudama. The Chalisa concludes by invoking Krishna in various forms, including as the consort of Radha, Rukmini, Satyabhama, Jambavati, Lakshmi, and Bhumi, affirming his supreme divinity. The closing doha promises that whoever recites this Chalisa will receive Krishna's grace, leading to the eradication of sorrow and poverty, and the attainment of happiness and wealth.`,
    significance: `The Krishna Chalisa is a cherished hymn recited by devotees to invoke the blessings of Lord Krishna. While Krishna is associated with various days in different traditions, he is often worshipped on Thursdays, a day dedicated to Vishnu, or Wednesdays. It is particularly significant during festivals like Janmashtami, his birthday, and during Ekadashi fasts, which are sacred to Vaishnavas. Devotees also turn to this Chalisa during times of personal difficulty, seeking divine intervention for protection, wisdom, and peace.

To recite the Chalisa, one typically bathes and wears clean clothes, facing east or north, ideally before an image or idol of Krishna. Offerings of flowers, incense, and a lamp (diya) are common. While a single recitation is beneficial, many devotees choose to recite it multiple times, often 11, 21, or 108 times, to deepen their devotion and amplify its effects. The Chalisa is believed to purify the mind, foster spiritual growth, and help overcome obstacles, fear, and negative influences. It complements primary Krishna mantras like "Om Namo Bhagavate Vasudevaya" or the Hare Krishna Mahamantra, offering a simpler, narrative-based form of devotion that is accessible to all.

This Chalisa is widely popular across various Vaishnava sects and in regions where the Bhakti movement has a strong presence, particularly in North India. It serves as a powerful means for devotees to connect with Krishna's playful yet profound nature, drawing strength and inspiration from his divine leelas and teachings, and ultimately aspiring for spiritual liberation and contentment.`,
  },
  {
    slug: 'santoshi-chalisa',
    type: 'chalisa',
    title: { en: 'Santoshi Chalisa', hi: 'सन्तोषी चालीसा' },
    deity: 'Santoshi',
    deityDay: 5,
    devanagari: `॥ दोहा ॥
बन्दौं सन्तोषी चरण रिद्धि-सिद्धि दातार।
ध्यान धरत ही होत है दुःख दारिद्र्य निवार॥

॥ चौपाई ॥
जय सन्तोषी माँ, जय जय माँ।
जय सन्तोषी माँ, जय जय माँ॥

१. हे माँ सन्तोषी तुम वरदानी।
सकल विश्व की हो कल्याणी॥

२. तुम हो गणेश की पुत्री प्यारी।
रिद्धि-सिद्धि की हो अधिकारी॥

३. शुभ-लाभ की तुम हो भगिनी।
जग में तुम्हारी महिमा अगनी॥

४. शुक्रवार को जो जन ध्यावे।
मनवांछित फल वह पावे॥

५. सोलह शुक्रवार व्रत जो करे।
गुड़-चना का भोग धरे॥

६. खट्टे का जो त्याग करे।
उसके घर सुख-शान्ति भरे॥

७. कथा तुम्हारी जो जन गावे।
उसके सब संकट मिट जावे॥

८. पति-पत्नी में प्रेम बढ़ावे।
संतान सुख भी वह पावे॥

९. धन-धान्य से घर भर देवे।
रोग-शोक सब हर लेवे॥

१०. जो जन दरस तुम्हारा पावे।
आनन्द मंगल उसके छावे॥

११. अष्ट सिद्धि नव निधि पावे।
मनोकामना पूर्ण हो जावे॥

१२. तुम्हारी महिमा अपरम्पार।
कोई न जाने पार॥

१३. जो जन श्रद्धा से पूजे।
उसका हो उद्धार॥

१४. जय सन्तोषी माँ, जय जय माँ।
जय सन्तोषी माँ, जय जय माँ॥

१५. जो जन पाठ करे चालीसा।
उस पर कृपा करे ईशा॥

१६. रोग-दोष सब दूर भगावे।
सुख-समृद्धि घर में आवे॥

१७. निर्धन को धनवान बनावे।
पुत्रहीन को पुत्र दिलावे॥

१८. विद्याहीन को विद्या देवे।
ज्ञानहीन को ज्ञान देवे॥

१९. जो जन तुम्हारी शरण में आवे।
उसके सब दुःख दूर भगावे॥

२०. जय सन्तोषी माँ, जय जय माँ।
जय सन्तोषी माँ, जय जय माँ॥

॥ दोहा ॥
सन्तोषी चालीसा जो पढ़े, सुने चित्त लाय।
मनोकामना पूर्ण हो, सब विधि सुख हो जाय॥`,
    transliteration: `|| Doha ||
Bandauṁ Santoṣī caraṇa riddhi-siddhi dātāra|
Dhyāna dharata hī hota hai duḥkha dāridrya nivāra||

|| Caupāī ||
Jaya Santoṣī Māṁ, jaya jaya Māṁ|
Jaya Santoṣī Māṁ, jaya jaya Māṁ||

1. He Māṁ Santoṣī tuma varadānī|
Sakala viśva kī ho kalyāṇī||

2. Tuma ho Gaṇeśa kī putrī pyārī|
Riddhi-siddhi kī ho adhikārī||

3. Śubha-lābha kī tuma ho bhaginī|
Jaga meṁ tumhārī mahimā aganī||

4. Śukravāra ko jo jana dhyāve|
Manavāṁchita phala vaha pāve||

5. Solaha śukravāra vrata jo kare|
Guṛa-canā kā bhoga dhare||

6. Khaṭṭe kā jo tyāga kare|
Usake ghara sukha-śānti bhare||

7. Kathā tumhārī jo jana gāve|
Usake saba saṁkaṭa miṭa jāve||

8. Pati-patnī meṁ prema baṛhāve|
Saṁtāna sukha bhī vaha pāve||

9. Dhana-dhānya se ghara bhara deve|
Roga-śoka saba hara leve||

10. Jo jana darasa tumhārā pāve|
Ānanda maṁgala usake chāve||

11. Aṣṭa siddhi nava nidhi pāve|
Manokāmanā pūrṇa ho jāve||

12. Tumhārī mahimā aparampāra|
Koī na jāne pāra||

13. Jo jana śraddhā se pūje|
Usakā ho uddhāra||

14. Jaya Santoṣī Māṁ, jaya jaya Māṁ|
Jaya Santoṣī Māṁ, jaya jaya Māṁ||

15. Jo jana pāṭha kare cālīsā|
Usa para kṛpā kare īśā||

16. Roga-doṣa saba dūra bhagāve|
Sukha-samṛddhi ghara meṁ āve||

17. Nirdhana ko dhanavāna banāve|
Putrahīna ko putra dilāve||

18. Vidyāhīna ko vidyā deve|
Jñānahīna ko jñāna deve||

19. Jo jana tumhārī śaraṇa meṁ āve|
Usake saba duḥkha dūra bhagāve||

20. Jaya Santoṣī Māṁ, jaya jaya Māṁ|
Jaya Santoṣī Māṁ, jaya jaya Māṁ||

|| Doha ||
Santoṣī Cālīsā jo paṛhe, sune citta lāya|
Manokāmanā pūrṇa ho, saba vidhi sukha ho jāya||`,
    meaning: `The Santoshi Chalisa is a devotional hymn dedicated to Santoshi Maa, the "Mother of Contentment," a beloved folk goddess whose worship gained widespread popularity after the 1975 film 'Jai Santoshi Maa'. The Chalisa begins with an invocation in the opening doha, "Bandauṁ Santoṣī caraṇa riddhi-siddhi dātāra | Dhyāna dharata hī hota hai duḥkha dāridrya nivāra ||" (I bow to the feet of Santoshi, the bestower of Riddhi and Siddhi. Meditating on her immediately removes sorrow and poverty). This sets the tone, establishing her as a benevolent deity who grants prosperity and alleviates suffering.

The subsequent twenty chaupais elaborate on her divine attributes and the benefits of her worship. The hymn praises her as the beloved daughter of Ganesha, and sister to Riddhi-Siddhi and Shubha-Labh, highlighting her auspicious lineage. She is depicted as a bestower of boons and a benefactor of the entire world. The Chalisa specifically mentions her association with Friday (Shukravar), her sacred day, and the practice of observing the "Solah Shukravar Vrat" (16-Friday fast). Devotees are instructed to offer gur-chana (jaggery and chickpeas) and strictly avoid khatta (sour foods), a unique injunction central to her worship.

Reciting her katha (story) and observing her vrat are said to resolve all troubles, foster love between spouses, grant progeny, fill homes with wealth and grains, and eradicate diseases and sorrow. Those who seek her darshan (sight) experience joy and auspiciousness, attaining the eight siddhis and nine nidhis, and fulfilling all desires. The Chalisa reiterates her immeasurable glory and the certainty of salvation for those who worship her with faith. The hymn concludes with a powerful affirmation of her grace, promising that regular recitation of the Chalisa brings her blessings, removes ailments, ushers in prosperity, transforms the poor into wealthy, grants children to the childless, and bestows knowledge upon the ignorant, ultimately dispelling all sorrows for those who seek her refuge.`,
    significance: `The Santoshi Chalisa holds profound significance for devotees, primarily serving as a means to invoke the blessings of Santoshi Maa, the goddess of contentment, peace, and prosperity. It is most commonly recited on Fridays, which is considered her sacred day. Many devotees undertake the "Solah Shukravar Vrat" (16-Friday fast), during which the Chalisa is an integral part of the worship, often recited after listening to her Katha and performing Aarti.

Devotees turn to Santoshi Maa and her Chalisa for a variety of life situations, particularly for resolving family discord, ensuring marital harmony, securing progeny, achieving financial stability, and fulfilling long-standing wishes. The core boon sought is 'santosh' or contentment, which is believed to bring inner peace and happiness regardless of external circumstances. The recitation is typically performed after a purifying bath, wearing clean clothes, and sitting in a clean space, often before an image or idol of the goddess. Offerings of gur-chana (jaggery and chickpeas) are made, and the strict avoidance of sour foods (khatta) is observed as part of the vrat, symbolizing the rejection of bitterness and the embrace of sweetness in life.

While there isn't a strict recommended count like for some mantras, sincere recitation even once is considered beneficial. However, during the 16-Friday vrat, it's often recited multiple times. The Chalisa complements primary mantras like "Om Shri Santoshi Mahamaya Gajanandini Riddhi Siddhi Pradayini Devi Namo Namah" by providing a narrative and devotional framework that deepens the devotee's connection with the deity. Santoshi Maa's worship, and by extension her Chalisa, is particularly popular in North India, reflecting her status as a beloved folk goddess whose accessible nature and promise of domestic bliss resonate widely within mainstream Hindu practices.`,
  },
  {
    slug: 'sai-baba-chalisa',
    type: 'chalisa',
    title: { en: 'Sai Baba Chalisa', hi: 'साईं बाबा चालीसा' },
    deity: 'Sai Baba',
    deityDay: 4,
    devanagari: `॥ दोहा ॥
पहले साईं के चरण में, अपना शीश नवाय।
कैसे शिरडी साईं बाबा, मेरे कष्ट मिटाय॥

॥ चौपाई ॥
साईं नाम का सुमिरन कर, साईं चालीसा गाय।
साईं कृपा से सब दुख दूर हो, मनवांछित फल पाय॥

शिरडी के साईं बाबा, तुम हो दीनदयाल।
भक्तों के दुख हरते हो, करते हो प्रतिपाल॥

बालक रूप में तुम आए, शिरडी ग्राम में।
लीलाएं तुमने दिखाई, अद्भुत धाम में॥

द्वारकामाई में तुम रहते, धूनी जलाई।
भक्तों को उदी देते, करते हो भलाई॥

सबका मालिक एक है, यही तुम्हारा ज्ञान।
हिन्दू मुस्लिम सब एक हैं, देते हो यह दान॥

कफनी पहने सिर पर कफन, बैठे हो तुम शांत।
भक्तों को देते हो दर्शन, करते हो भव-भ्रांत॥

पत्थर पर तुम बैठे रहते, देते हो उपदेश।
श्रद्धा सबुरी का पाठ पढ़ाते, मिटाते हो क्लेश॥

तुम्हारी महिमा अपरम्पार, गाते हैं सब भक्त।
जो भी शरण में आता है, होता है अनुरक्त॥

तुमने जलाया दीपक जल से, अद्भुत थी वह बात।
सब जन देख हुए विस्मित, साईं की करामात॥

भक्तों के तुमने कष्ट हरे, दिए अनेक वरदान।
तुम्हारी कृपा से ही तो, होता है कल्याण॥

कोढ़ियों को तुमने ठीक किया, अंधों को दी आँख।
बांझों को संतान दी, साईं की है यह साख॥

तुम्हारी लीला है न्यारी, कोई न जाने भेद।
तुम हो अंतर्यामी साईं, करते हो सब खेद॥

जो भी तुमको याद करे, तुम आते हो पास।
भक्तों की सुनते हो पुकार, पूरी करते हो आस॥

तुमने दिया सबको सहारा, जो भी था बेसहारा।
तुम्हारी शरण में आकर, मिलता है किनारा॥

तुमने सिखाया प्रेम भाव, और सिखाया त्याग।
तुम्हारी शिक्षा से ही तो, मिलता है वैराग्य॥

तुमने दिया सबको भोजन, जो भी था भूखा।
तुम्हारी कृपा से ही तो, मिलता है सुख का मुखा॥

तुमने किया सबका भला, बिना किसी भेदभाव।
तुम्हारी दया से ही तो, मिटता है सब अभाव॥

तुमने दिया सबको ज्ञान, जो भी था अज्ञानी।
तुम्हारी शिक्षा से ही तो, बनती है कहानी॥

तुम हो मेरे साईं बाबा, तुम हो मेरे नाथ।
तुम्हारी कृपा से ही तो, चलता है मेरा साथ॥

तुम्हारी भक्ति में लीन होकर, मैं पावन हो जाऊं।
तुम्हारी शरण में आकर, मैं मुक्ति को पाऊं॥

तुम हो मेरे गुरुदेव, तुम हो मेरे इष्ट।
तुम्हारी कृपा से ही तो, मिटता है सब कष्ट॥

तुम हो मेरे जीवन का आधार, तुम हो मेरे प्राण।
तुम्हारी कृपा से ही तो, मिलता है सम्मान॥

तुम हो मेरे माता-पिता, तुम हो मेरे बंधु।
तुम्हारी कृपा से ही तो, मिटता है सब अंधु॥

तुम हो मेरे सखा-सहेली, तुम हो मेरे मीत।
तुम्हारी कृपा से ही तो, गाता हूँ मैं गीत॥

तुम हो मेरे सर्वस्व, तुम हो मेरे भगवान।
तुम्हारी कृपा से ही तो, मिलता है यह ज्ञान॥

तुम हो मेरे रक्षक, तुम हो मेरे त्राता।
तुम्हारी कृपा से ही तो, मिटती है सब घाता॥

तुम हो मेरे भाग्य विधाता, तुम हो मेरे कर्म।
तुम्हारी कृपा से ही तो, मिलता है यह धर्म॥

तुम हो मेरे आराध्य देव, तुम हो मेरे पूज्य।
तुम्हारी कृपा से ही तो, मिलता है यह सौख्य॥

तुम हो मेरे मार्गदर्शक, तुम हो मेरे पथ।
तुम्हारी कृपा से ही तो, चलता है यह रथ॥

तुम हो मेरे जीवन का लक्ष्य, तुम हो मेरी मंजिल।
तुम्हारी कृपा से ही तो, मिलती है यह दिल॥

तुम हो मेरे मन की शांति, तुम हो मेरे धैर्य।
तुम्हारी कृपा से ही तो, मिलता है यह धैर्य॥

तुम हो मेरे विश्वास, तुम हो मेरे श्रद्धा।
तुम्हारी कृपा से ही तो, मिलती है यह श्रद्धा॥

तुम हो मेरे प्रेम, तुम हो मेरे भक्ति।
तुम्हारी कृपा से ही तो, मिलती है यह शक्ति॥

तुम हो मेरे सत्य, तुम हो मेरे न्याय।
तुम्हारी कृपा से ही तो, मिलता है यह न्याय॥

तुम हो मेरे धर्म, तुम हो मेरे कर्म।
तुम्हारी कृपा से ही तो, मिलता है यह मर्म॥

तुम हो मेरे आशा, तुम हो मेरे विश्वास।
तुम्हारी कृपा से ही तो, मिलती है यह आस॥

तुम हो मेरे जीवन का सार, तुम हो मेरे आधार।
तुम्हारी कृपा से ही तो, होता है यह पार॥

तुम हो मेरे साईं बाबा, तुम हो मेरे ईश्वर।
तुम्हारी कृपा से ही तो, मिलता है यह ईश्वर॥

॥ दोहा ॥
साईं चालीसा जो पढ़े, श्रद्धा से चित्त लाय।
मनोकामना पूर्ण हो, साईं कृपा फल पाय॥`,
    transliteration: `|| Doha ||
Pahale Sāī ke caraṇa meṁ, apanā śīśa navāya |
Kaise Śiraḍī Sāī Bābā, mere kaṣṭa miṭāya ||

|| Caupāī ||
Sāī nāma kā sumirana kara, Sāī Cālīsā gāya |
Sāī kṛpā se saba dukha dūra ho, manavāṁchita phala pāya ||

Śiraḍī ke Sāī Bābā, tuma ho dīnadayāla |
Bhaktoṁ ke dukha harate ho, karate ho pratipāla ||

Bālaka rūpa meṁ tuma āe, Śiraḍī grāma meṁ |
Līlāeṁ tumane dikhāī, adbhuta dhāma meṁ ||

Dvārakāmāī meṁ tuma rahate, dhūnī jalāī |
Bhaktoṁ ko udī dete, karate ho bhalāī ||

Sabakā mālika eka hai, yahī tumhārā jñāna |
Hindū Musalima saba eka haiṁ, dete ho yaha dāna ||

Kaphanī pahane sira para kaphana, baiṭhe ho tuma śāṁta |
Bhaktoṁ ko dete ho darśana, karate ho bhava-bhrāṁta ||

Patthara para tuma baiṭhe rahate, dete ho upadeśa |
Śraddhā saburī kā pāṭha paṛhāte, miṭāte ho kleśa ||

Tumhārī mahimā aparampāra, gāte haiṁ saba bhakta |
Jo bhī śaraṇa meṁ ātā hai, hotā hai anurakta ||

Tumane jalāyā dīpaka jala se, adbhuta thī vaha bāta |
Saba jana dekha hue vismita, Sāī kī karāmāta ||

Bhaktoṁ ke tumane kaṣṭa hare, die aneka varadāna |
Tumhārī kṛpā se hī to, hotā hai kalyāṇa ||

Koṛhiyoṁ ko tumane ṭhīka kiyā, aṁdhoṁ ko dī āṁkha |
Bāṁjhoṁ ko saṁtāna dī, Sāī kī hai yaha sākha ||

Tumhārī līlā hai nyārī, koī na jāne bheda |
Tuma ho aṁtaryāmī Sāī, karate ho saba kheda ||

Jo bhī tumako yāda kare, tuma āte ho pāsa |
Bhaktoṁ kī sunate ho pukāra, pūrī karate ho āsa ||

Tumane diyā sabako sahārā, jo bhī thā besahārā |
Tumhārī śaraṇa meṁ ākara, milatā hai kinārā ||

Tumane sikhāyā prema bhāva, aura sikhāyā tyāga |
Tumhārī śikṣā se hī to, milatā hai vairāgya ||

Tumane diyā sabako bhojana, jo bhī thā bhūkhā |
Tumhārī kṛpā se hī to, milatā hai sukha kā mukhā ||

Tumane kiyā sabakā bhalā, binā kisī bhedabhāva |
Tumhārī dayā se hī to, miṭatā hai saba abhāva ||

Tumane diyā sabako jñāna, jo bhī thā ajñānī |
Tumhārī śikṣā se hī to, banatī hai kahānī ||

Tuma ho mere Sāī Bābā, tuma ho mere nātha |
Tumhārī kṛpā se hī to, calatā hai merā sātha ||

Tumhārī bhakti meṁ līna hokara, maiṁ pāvana ho jāūṁ |
Tumhārī śaraṇa meṁ ākara, maiṁ mukti ko pāūṁ ||

Tuma ho mere gurudeva, tuma ho mere iṣṭa |
Tumhārī kṛpā se hī to, miṭatā hai saba kaṣṭa ||

Tuma ho mere jīvana kā ādhāra, tuma ho mere prāṇa |
Tumhārī kṛpā se hī to, milatā hai sammāna ||

Tuma ho mere mātā-pitā, tuma ho mere baṁdhu |
Tumhārī kṛpā se hī to, miṭatā hai saba aṁdhu ||

Tuma ho mere sakhā-sahelī, tuma ho mere mīta |
Tumhārī kṛpā se hī to, gātā hūṁ maiṁ gīta ||

Tuma ho mere sarvasva, tuma ho mere Bhagavāna |
Tumhārī kṛpā se hī to, milatā hai yaha jñāna ||

Tuma ho mere rakṣaka, tuma ho mere trātā |
Tumhārī kṛpā se hī to, miṭatī hai saba ghātā ||

Tuma ho mere bhāgya vidhātā, tuma ho mere karma |
Tumhārī kṛpā se hī to, milatā hai yaha dharma ||

Tuma ho mere ārādhya deva, tuma ho mere pūjya |
Tumhārī kṛpā se hī to, milatā hai yaha saukhya ||

Tuma ho mere mārgadarśaka, tuma ho mere patha |
Tumhārī kṛpā se hī to, calatā hai yaha ratha ||

Tuma ho mere jīvana kā lakṣya, tuma ho merī maṁjila |
Tumhārī kṛpā se hī to, milatī hai yaha dila ||

Tuma ho mere mana kī śāṁti, tuma ho mere dhairya |
Tumhārī kṛpā se hī to, milatā hai yaha dhairya ||

Tuma ho mere viśvāsa, tuma ho mere śraddhā |
Tumhārī kṛpā se hī to, milatī hai yaha śraddhā ||

Tuma ho mere prema, tuma ho mere bhakti |
Tumhārī kṛpā se hī to, milatī hai yaha śakti ||

Tuma ho mere satya, tuma ho mere nyāya |
Tumhārī kṛpā se hī to, milatā hai yaha nyāya ||

Tuma ho mere dharma, tuma ho mere karma |
Tumhārī kṛpā se hī to, milatā hai yaha marma ||

Tuma ho mere āśā, tuma ho mere viśvāsa |
Tumhārī kṛpā se hī to, milatī hai yaha āsa ||

Tuma ho mere jīvana kā sāra, tuma ho mere ādhāra |
Tumhārī kṛpā se hī to, hotā hai yaha pāra ||

Tuma ho mere Sāī Bābā, tuma ho mere īśvara |
Tumhārī kṛpā se hī to, milatā hai yaha īśvara ||

|| Doha ||
Sāī Cālīsā jo paṛhe, śraddhā se citta lāya |
Manokāmanā pūrṇa ho, Sāī kṛpā phala pāya ||`,
    meaning: `The Sai Baba Chalisa is a devotional hymn comprising forty verses, preceded and concluded by a doha, dedicated to Shirdi Sai Baba, a revered saint who synthesised Hindu and Sufi traditions. The opening doha humbly bows to Sai Baba's feet, praying for the alleviation of suffering. It sets the tone for the devotee's complete surrender and trust in the saint's compassionate nature.

The central chaupais elaborate on Sai Baba's life, teachings, and miracles. They describe his arrival in Shirdi as a young fakir, his residence in the dilapidated mosque he named Dwarkamai, and the perpetual sacred fire (Dhuni) he maintained. Devotees are reminded of his practice of distributing udi (sacred ash) from the Dhuni, believed to possess healing and protective powers. A core tenet of his philosophy, "Sabka Malik Ek" (one master of all), is highlighted, emphasising the unity of all religions and the oneness of God, transcending Hindu-Muslim distinctions. The Chalisa references his iconic appearance – a white kafni robe, head wrapped in cloth, seated cross-legged on a stone – symbolising his detachment and wisdom. It recounts his teachings of Shraddha (faith) and Saburi (patience), which he considered essential for spiritual progress and overcoming life's challenges. The verses also narrate various miracles attributed to him, such as lighting lamps with water, curing the sick (lepers, blind), and granting children to barren couples, showcasing his divine power and compassion. The Chalisa portrays Sai Baba as a universal guru, protector, and bestower of knowledge, peace, and liberation, guiding devotees through life's journey.

The concluding doha affirms that reciting this Chalisa with unwavering faith leads to the fulfilment of desires and the attainment of Sai Baba's divine grace, promising overall well-being and spiritual upliftment.`,
    significance: `The Sai Baba Chalisa is a cherished devotional practice for millions of devotees, particularly observed on Thursdays, which is considered Sai Baba's sacred day. Recitation on this day is believed to be especially potent for invoking his blessings. While it can be recited daily, many devotees undertake specific vows (sankalpa) to recite it multiple times, such as 11 or 108 times, over a period for the fulfilment of particular desires or for spiritual purification.

Before recitation, devotees typically perform a simple purification ritual, which includes bathing, wearing clean clothes, and offering flowers, incense, and a lamp (diya) before an image or idol of Sai Baba. This practice helps to create a sacred atmosphere and focus the mind. The Chalisa is sought by individuals facing various life challenges, including health issues, financial difficulties, relationship problems, or those seeking inner peace and spiritual guidance. Its verses reinforce Sai Baba's core teachings of Shraddha (faith) and Saburi (patience), encouraging devotees to maintain unwavering belief and perseverance in the face of adversity. The Chalisa complements primary mantras like "Om Sai Ram" or "Om Shri Sainathaya Namah" by providing a narrative framework that deepens the devotee's understanding of Sai Baba's life and philosophy, fostering a more profound emotional and spiritual connection. It is a central devotional text for the global Sai Baba movement, with special significance for those connected to Shirdi's Samadhi Mandir, where he attained Mahasamadhi.`,
  },
  {
    slug: 'navagraha-chalisa',
    type: 'chalisa',
    title: { en: 'Navagraha Chalisa', hi: 'नवग्रह चालीसा' },
    deity: 'Navagraha',
    deityDay: 0,
    devanagari: `॥ दोहा ॥
श्री गणेशाय नमः
श्री गुरु चरण सरोज रज, निज मन मुकुरु सुधारि।
बरनऊँ रघुबर बिमल जसु, जो दायकु फल चारि॥
बुद्धिहीन तनु जानिके, सुमिरौं पवन कुमार।
बल बुद्धि विद्या देहु मोहिं, हरहु कलेश विकार॥

॥ चौपाई ॥
जय जय जय रवि देव, जय जय जय शशि देव।
जय जय जय मंगल देव, जय जय जय बुध देव॥
जय जय जय गुरु देव, जय जय जय शुक्र देव।
जय जय जय शनि देव, जय जय जय राहु देव॥
जय जय जय केतु देव, जय जय जय नवग्रह देव।

प्रथमहिं रवि कहँ नावौँ माथा, करहुँ कृपा जन जानि अनाथा।
हे आदित्य दिवाकर भानु, मैं मति मन्द महा अज्ञानु॥
अब निज जन कहँ हरहु कलेशा, दिनकर देव नसावहुँ द्वेषा।
तुम्हरो नाम जपत सुख पाऊँ, आरत हरहुँ प्रभु सब ठाऊँ॥

शशि तुम शीतल शुभ्र प्रकाशा, तुमहिं निरखि मिट जात उदासा।
सोम देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥
रोग शोक सब दूर भगाओ, मन की इच्छा पूरण कराओ।
चन्द्र देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥

मंगल देव तुम लाल शरीरा, तुमहिं निरखि मिट जात अधीरा।
अंगारक तुम भूमि सुत देवा, तुमहिं नमामि नमामि नमामि॥
ऋण रोग सब दूर भगाओ, मन की इच्छा पूरण कराओ।
मंगल देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥

बुध देव तुम ज्ञान प्रदाता, तुमहिं निरखि मिट जात अज्ञाता।
सौम्य देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥
विद्या बुद्धि सब दूर भगाओ, मन की इच्छा पूरण कराओ।
बुध देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥

गुरु देव तुम ज्ञान प्रदाता, तुमहिं निरखि मिट जात अज्ञाता।
बृहस्पति तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥
धन सम्पत्ति सब दूर भगाओ, मन की इच्छा पूरण कराओ।
गुरु देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥

शुक्र देव तुम सुख प्रदाता, तुमहिं निरखि मिट जात अज्ञाता।
दैत्य गुरु तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥
भोग विलास सब दूर भगाओ, मन की इच्छा पूरण कराओ।
शुक्र देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥

शनि देव तुम दुःख हरण कर्ता, तुमहिं निरखि मिट जात अकर्ता।
सूर्य पुत्र तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥
कष्ट क्लेश सब दूर भगाओ, मन की इच्छा पूरण कराओ।
शनि देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥

राहु देव तुम भय हरण कर्ता, तुमहिं निरखि मिट जात अकर्ता।
सिंहिका सुत तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥
शत्रु रोग सब दूर भगाओ, मन की इच्छा पूरण कराओ।
राहु देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥

केतु देव तुम कष्ट हरण कर्ता, तुमहिं निरखि मिट जात अकर्ता।
चित्रवर्ण तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥
विघ्न बाधा सब दूर भगाओ, मन की इच्छा पूरण कराओ।
केतु देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥

नवग्रह देव तुम सकल जग स्वामी, तुमहिं नमामि नमामि नमामि॥
जो यह पाठ करे मन लाई, सब नवग्रह होयँ सहाई।
धन जन सुत परिवार बढ़ावै, सब सुख भोगि परम पद पावै॥

॥ दोहा ॥
नवग्रह शान्ति पाठ जो करै, सब सुख भोगि परम पद लहै।
यह नवग्रह चालीसा, पढ़ै जो नित चित्त लाई॥
अष्ट सिद्धि नव निधि फल पावै, अन्त समय सुरपुर जावै॥`,
    transliteration: `|| dohā ||
śrī gaṇeśāya namaḥ
śrī guru caraṇa saroja raja, nija mana mukuru sudhāri |
baraṇauṁ raghubara bimala jasu, jo dāyaku phala cāri ||
buddhihīna tanu jānikē, sumirauṁ pavana kumāra |
bala buddhi vidyā dēhu mohiṁ, harahu kalēśa vikāra ||

|| caupāī ||
jaya jaya jaya ravi dēva, jaya jaya jaya śaśi dēva |
jaya jaya jaya maṅgala dēva, jaya jaya jaya budha dēva ||
jaya jaya jaya guru dēva, jaya jaya jaya śukra dēva |
jaya jaya jaya śani dēva, jaya jaya jaya rāhu dēva ||
jaya jaya jaya kētu dēva, jaya jaya jaya navagraha dēva |

prathamahiṁ ravi kahaṁ nāvauṁ māthā, karahuṁ kṛpā jana jāni anāthā |
hē āditya divākara bhānu, maiṁ mati manda mahā ajñānu ||
aba nija jana kahaṁ harahu kalēśā, dinakara dēva nasāvahuṁ dvēṣā |
tumharo nāma japata sukha pāūṁ, ārāta harahuṁ prabhu saba ṭhāūṁ ||

śaśi tuma śītala śubhra prakāśā, tumahiṁ nirakhi miṭa jāta udāsā |
soma dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||
rōga śōka saba dūra bhagāō, mana kī icchā pūraṇa karāō |
candra dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||

maṅgala dēva tuma lāla śarīrā, tumahiṁ nirakhi miṭa jāta adhīrā |
aṅgāraka tuma bhūmi suta dēvā, tumahiṁ namāmi namāmi namāmi ||
ṛṇa rōga saba dūra bhagāō, mana kī icchā pūraṇa karāō |
maṅgala dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||

budha dēva tuma jñāna pradātā, tumahiṁ nirakhi miṭa jāta ajñātā |
saumya dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||
vidyā buddhi saba dūra bhagāō, mana kī icchā pūraṇa karāō |
budha dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||

guru dēva tuma jñāna pradātā, tumahiṁ nirakhi miṭa jāta ajñātā |
bṛhaspati tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||
dhana sampatti saba dūra bhagāō, mana kī icchā pūraṇa karāō |
guru dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||

śukra dēva tuma sukha pradātā, tumahiṁ nirakhi miṭa jāta ajñātā |
daitya guru tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||
bhōga vilāsa saba dūra bhagāō, mana kī icchā pūraṇa karāō |
śukra dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||

śani dēva tuma duḥkha haraṇa kartā, tumahiṁ nirakhi miṭa jāta akartā |
sūrya putra tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||
kaṣṭa klēśa saba dūra bhagāō, mana kī icchā pūraṇa karāō |
śani dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||

rāhu dēva tuma bhaya haraṇa kartā, tumahiṁ nirakhi miṭa jāta akartā |
siṁhikā suta tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||
śatru rōga saba dūra bhagāō, mana kī icchā pūraṇa karāō |
rāhu dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||

kētu dēva tuma kaṣṭa haraṇa kartā, tumahiṁ nirakhi miṭa jāta akartā |
citravarna tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||
vighna bādhā saba dūra bhagāō, mana kī icchā pūraṇa karāō |
kētu dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||

navagraha dēva tuma sakala jaga svāmī, tumahiṁ namāmi namāmi namāmi ||
jō yaha pāṭha karē mana lāī, saba navagraha hōyaṁ sahāī |
dhana jana suta parivāra baṛhāvai, saba sukha bhōgi parama pada pāvai ||

|| dohā ||
navagraha śānti pāṭha jō karai, saba sukha bhōgi parama pada lahai |
yaha navagraha cālīsā, paṛhai jō nita citta lāī ||
aṣṭa siddhi nava nidhi phala pāvai, anta samaya surapura jāvai ||`,
    meaning: `The Navagraha Chalisa commences with an invocation to Lord Ganesha, the remover of obstacles, followed by a traditional opening doha that seeks purification of the mind and the strength to recount the pure glory of Lord Rama, which bestows the four fruits of life (dharma, artha, kama, moksha). It then humbly requests Pawan Kumar (Hanuman) to grant strength, wisdom, and knowledge, and to remove all sorrows and ailments. The main body of the chalisa then proceeds to praise each of the nine planets (Navagraha) in turn.

Each planet is addressed as a divine entity and a ruler of the entire cosmos. Surya (Sun) is invoked for health, vitality, and the removal of ignorance and enmity. Chandra (Moon) is praised for peace of mind, emotional stability, and the alleviation of sorrow and disease. Mangala (Mars) is sought for courage, relief from debts and illnesses, and the fulfilment of desires. Budha (Mercury) is revered as the giver of intellect, knowledge, and wisdom, dispelling ignorance. Brihaspati (Jupiter) is prayed to for wealth, prosperity, and spiritual wisdom. Shukra (Venus) is invoked for happiness, luxury, and the fulfilment of material desires. Shani (Saturn) is addressed as the dispeller of sorrow and suffering, seeking relief from hardships. Rahu and Ketu, the lunar nodes, are invoked to remove fear, enemies, diseases, obstacles, and hindrances, guiding towards spiritual liberation.

Each section reiterates their supreme lordship and concludes with a plea for the removal of specific afflictions and the granting of boons. The chalisa culminates with a promise that sincere recitation brings the blessings of all Navagrahas, leading to increased wealth, progeny, family well-being, and ultimately, supreme happiness and liberation. The closing doha reaffirms that regular recitation of this Navagraha Chalisa bestows all worldly comforts, spiritual attainments, and ultimately, a place in the divine abode.`,
    significance: `The Navagraha Chalisa is a potent devotional hymn recited to appease the nine planetary deities who govern human destiny according to Vedic astrology. It is particularly significant for individuals experiencing challenging planetary periods (dashas), sub-periods (antardashas), or transits (gochar), such as the notorious Sade-Sati of Saturn, or during periods of planetary debilitation or affliction (graha dosha) in the natal chart. It is also commonly recited during eclipses (grahana) to mitigate their perceived negative influences.

Devotees typically recite this chalisa daily, or on specific weekdays associated with a particular planet for focused appeasement (e.g., Sunday for Surya, Saturday for Shani). The practice is usually undertaken after bathing, with a clean body and mind, often before an altar or an image of the Navagrahas. While the chalisa itself is a complete prayer, it complements other primary mantras dedicated to the Navagrahas, such as their Bija Mantras or Gayatri Mantras, by providing a comprehensive and accessible form of devotion. The recitation is considered a powerful spiritual remedy (upaya) to balance karmic influences, mitigate malefic planetary effects, and enhance benefic ones. It is believed to bring harmony, peace, prosperity, and overall well-being by aligning the individual's energies with the cosmic forces. No specific sectarian traditions are tied to its recitation, as Navagraha worship is a fundamental aspect of pan-Hindu astrological practice.`,
  },
  {
    slug: 'vishnu-chalisa',
    type: 'chalisa',
    title: { en: 'Vishnu Chalisa', hi: 'विष्णु चालीसा' },
    deity: 'Vishnu',
    deityDay: 4,
    devanagari: `॥ दोहा ॥
जय जय जय श्रीपति श्रीरामा, व्यापक धरमात्मा।
दुष्ट निकंदन, सुखकरन, नमो नमो परमात्मा॥

॥ चौपाई ॥
जय जय जय जग पावन, प्रभु जय जय जय अविनाशी।
सर्वव्यापी, सर्वेश्वर, तुम हो घट घट वासी॥1॥
तुम हो निराकार, निर्गुण, तुम हो अविनाशी।
ब्रह्मा, विष्णु, शिव, तुम ही, तुम ही हो अविनाशी॥2॥
तुम ही हो श्रीपति, लक्ष्मीपति, तुम ही हो जग के स्वामी।
तुम ही हो नारायण, वासुदेव, तुम ही हो अन्तर्यामी॥3॥
तुम ही हो शेषशायी, क्षीरसागर में वास।
लक्ष्मी संग विराजे, करते जग का त्रास॥4॥
तुम ही हो चक्रधारी, शंख, गदा, पद्म धारी।
गरुड़ वाहन, तुम ही हो, त्रैलोक्य के हितकारी॥5॥
तुम ही हो मत्स्य, कूर्म, वराह, नरसिंह अवतार।
वामन, परशुराम, राम, कृष्ण, बुद्ध, कल्कि अवतार॥6॥
तुम ही हो धर्म रक्षक, तुम ही हो भक्त पालक।
तुम ही हो दुःख भंजन, तुम ही हो सुखदायक॥7॥
तुम ही हो भवसागर तारक, तुम ही हो मोक्ष दाता।
तुम ही हो आदि देव, तुम ही हो जग के त्राता॥8॥
तुम ही हो सृष्टि कर्ता, तुम ही हो पालनहारा।
तुम ही हो संहार कर्ता, तुम ही हो जग उजियारा॥9॥
तुम ही हो ज्ञान दाता, तुम ही हो विद्या दाता।
तुम ही हो बुद्धि दाता, तुम ही हो शक्ति दाता॥10॥
तुम ही हो यश दाता, तुम ही हो कीर्ति दाता।
तुम ही हो धन दाता, तुम ही हो पुत्र दाता॥11॥
तुम ही हो रोग हर्ता, तुम ही हो शोक हर्ता।
तुम ही हो भय हर्ता, तुम ही हो पाप हर्ता॥12॥
तुम ही हो ग्रह पीड़ा हर्ता, तुम ही हो शत्रु हर्ता।
तुम ही हो संकट हर्ता, तुम ही हो विघ्न हर्ता॥13॥
तुम ही हो सत्य स्वरूप, तुम ही हो चित्त स्वरूप।
तुम ही हो आनंद स्वरूप, तुम ही हो ब्रह्म स्वरूप॥14॥
तुम ही हो ओंकार स्वरूप, तुम ही हो वेद स्वरूप।
तुम ही हो यज्ञ स्वरूप, तुम ही हो तप स्वरूप॥15॥
तुम ही हो गंगा स्वरूप, तुम ही हो यमुना स्वरूप।
तुम ही हो गोदावरी स्वरूप, तुम ही हो नर्मदा स्वरूप॥16॥
तुम ही हो काशी स्वरूप, तुम ही हो मथुरा स्वरूप।
तुम ही हो अयोध्या स्वरूप, तुम ही हो द्वारका स्वरूप॥17॥
तुम ही हो बद्री स्वरूप, तुम ही हो केदार स्वरूप।
तुम ही हो रामेश्वर स्वरूप, तुम ही हो जगन्नाथ स्वरूप॥18॥
तुम ही हो सूर्य स्वरूप, तुम ही हो चंद्र स्वरूप।
तुम ही हो तारे स्वरूप, तुम ही हो ग्रह स्वरूप॥19॥
तुम ही हो वायु स्वरूप, तुम ही हो अग्नि स्वरूप।
तुम ही हो जल स्वरूप, तुम ही हो पृथ्वी स्वरूप॥20॥
तुम ही हो आकाश स्वरूप, तुम ही हो दिशा स्वरूप।
तुम ही हो काल स्वरूप, तुम ही हो कर्म स्वरूप॥21॥
तुम ही हो माता स्वरूप, तुम ही हो पिता स्वरूप।
तुम ही हो बंधु स्वरूप, तुम ही हो सखा स्वरूप॥22॥
तुम ही हो गुरु स्वरूप, तुम ही हो शिष्य स्वरूप।
तुम ही हो देव स्वरूप, तुम ही हो दानव स्वरूप॥23॥
तुम ही हो नर स्वरूप, तुम ही हो नारी स्वरूप।
तुम ही हो पशु स्वरूप, तुम ही हो पक्षी स्वरूप॥24॥
तुम ही हो वृक्ष स्वरूप, तुम ही हो लता स्वरूप।
तुम ही हो पुष्प स्वरूप, तुम ही हो फल स्वरूप॥25॥
तुम ही हो अन्न स्वरूप, तुम ही हो जल स्वरूप।
तुम ही हो वायु स्वरूप, तुम ही हो अग्नि स्वरूप॥26॥
तुम ही हो जीवन स्वरूप, तुम ही हो मरण स्वरूप।
तुम ही हो जन्म स्वरूप, तुम ही हो कर्म स्वरूप॥27॥
तुम ही हो सुख स्वरूप, तुम ही हो दुःख स्वरूप।
तुम ही हो लाभ स्वरूप, तुम ही हो हानि स्वरूप॥28॥
तुम ही हो जय स्वरूप, तुम ही हो पराजय स्वरूप।
तुम ही हो मान स्वरूप, तुम ही हो अपमान स्वरूप॥29॥
तुम ही हो शांति स्वरूप, तुम ही हो क्रांति स्वरूप।
तुम ही हो उदय स्वरूप, तुम ही हो अस्त स्वरूप॥30॥
तुम ही हो आदि स्वरूप, तुम ही हो अंत स्वरूप।
तुम ही हो मध्य स्वरूप, तुम ही हो अनंत स्वरूप॥31॥
तुम ही हो सत्य स्वरूप, तुम ही हो असत्य स्वरूप।
तुम ही हो धर्म स्वरूप, तुम ही हो अधर्म स्वरूप॥32॥
तुम ही हो पुण्य स्वरूप, तुम ही हो पाप स्वरूप।
तुम ही हो शुभ स्वरूप, तुम ही हो अशुभ स्वरूप॥33॥
तुम ही हो ज्ञान स्वरूप, तुम ही हो अज्ञान स्वरूप।
तुम ही हो विद्या स्वरूप, तुम ही हो अविद्या स्वरूप॥34॥
तुम ही हो मुक्ति स्वरूप, तुम ही हो बंधन स्वरूप।
तुम ही हो स्वर्ग स्वरूप, तुम ही हो नरक स्वरूप॥35॥
तुम ही हो देव स्वरूप, तुम ही हो मानव स्वरूप।
तुम ही हो भूत स्वरूप, तुम ही हो भविष्य स्वरूप॥36॥
तुम ही हो वर्तमान स्वरूप, तुम ही हो त्रिकाल स्वरूप।
तुम ही हो त्रिलोक स्वरूप, तुम ही हो त्रिभुवन स्वरूप॥37॥
तुम ही हो सर्व स्वरूप, तुम ही हो सर्व व्यापक।
तुम ही हो सर्वेश्वर, तुम ही हो सर्व पालक॥38॥
जो यह चालीसा पढ़े, सुने चित्त लगाय।
विष्णु कृपा से सुख मिले, पाप कटे मिट जाय॥39॥
जो यह चालीसा पढ़े, श्रद्धा भक्ति सहित।
मनोकामना पूर्ण हो, श्रीहरि करें हित॥40॥

॥ दोहा ॥
विष्णु चालीसा जो पढ़े, श्रद्धा से नर नार।
सुख सम्पति सब कुछ मिले, भवसागर से पार॥`,
    transliteration: `|| Doha ||
Jaya jaya jaya śrīpati śrīrāmā, vyāpaka dharmātmā |
Duṣṭa nikandana, sukhakarana, namo namo paramātmā ||

|| Caupāī ||
Jaya jaya jaya jaga pāvana, prabhu jaya jaya jaya avināśī |
Sarvavyāpī, sarveśvara, tuma ho ghaṭa ghaṭa vāsī ||1||
Tuma ho nirākāra, nirguṇa, tuma ho avināśī |
Brahmā, viṣṇu, śiva, tuma hī, tuma hī ho avināśī ||2||
Tuma hī ho śrīpati, lakṣmīpati, tuma hī ho jaga ke svāmī |
Tuma hī ho nārāyaṇa, vāsudeva, tuma hī ho antaryāmī ||3||
Tuma hī ho śeṣaśāyī, kṣīrasāgara meṁ vāsa |
Lakṣmī saṁga virāje, karate jaga kā trāsa ||4||
Tuma hī ho cakradhārī, śaṁkha, gadā, padma dhārī |
Garuṛa vāhana, tuma hī ho, trailokya ke hitakārī ||5||
Tuma hī ho matsya, kūrma, varāha, narasiṁha avatāra |
Vāmana, paraśurāma, rāma, kṛṣṇa, buddha, kalki avatāra ||6||
Tuma hī ho dharma rakṣaka, tuma hī ho bhakta pālaka |
Tuma hī ho duḥkha bhaṁjana, tuma hī ho sukhadāyaka ||7||
Tuma hī ho bhavasāgara tāraka, tuma hī ho mokṣa dātā |
Tuma hī ho ādi deva, tuma hī ho jaga ke trātā ||8||
Tuma hī ho sṛṣṭi kartā, tuma hī ho pālanahārā |
Tuma hī ho saṁhāra kartā, tuma hī ho jaga ujiyārā ||9||
Tuma hī ho jñāna dātā, tuma hī ho vidyā dātā |
Tuma hī ho buddhi dātā, tuma hī ho śakti dātā ||10||
Tuma hī ho yaśa dātā, tuma hī ho kīrti dātā |
Tuma hī ho dhana dātā, tuma hī ho putra dātā ||11||
Tuma hī ho roga hartā, tuma hī ho śoka hartā |
Tuma hī ho bhaya hartā, tuma hī ho pāpa hartā ||12||
Tuma hī ho graha pīṛā hartā, tuma hī ho śatru hartā |
Tuma hī ho saṁkaṭa hartā, tuma hī ho vighna hartā ||13||
Tuma hī ho satya svarūpa, tuma hī ho citta svarūpa |
Tuma hī ho ānanda svarūpa, tuma hī ho brahma svarūpa ||14||
Tuma hī ho oṁkāra svarūpa, tuma hī ho veda svarūpa |
Tuma hī ho yajña svarūpa, tuma hī ho tapa svarūpa ||15||
Tuma hī ho gaṁgā svarūpa, tuma hī ho yamunā svarūpa |
Tuma hī ho godāvarī svarūpa, tuma hī ho narmadā svarūpa ||16||
Tuma hī ho kāśī svarūpa, tuma hī ho mathurā svarūpa |
Tuma hī ho ayodhyā svarūpa, tuma hī ho dvārakā svarūpa ||17||
Tuma hī ho badrī svarūpa, tuma hī ho kedāra svarūpa |
Tuma hī ho rāmeśvara svarūpa, tuma hī ho jagannātha svarūpa ||18||
Tuma hī ho sūrya svarūpa, tuma hī ho candra svarūpa |
Tuma hī ho tāre svarūpa, tuma hī ho graha svarūpa ||19||
Tuma hī ho vāyu svarūpa, tuma hī ho agni svarūpa |
Tuma hī ho jala svarūpa, tuma hī ho pṛthvī svarūpa ||20||
Tuma hī ho ākāśa svarūpa, tuma hī ho diśā svarūpa |
Tuma hī ho kāla svarūpa, tuma hī ho karma svarūpa ||21||
Tuma hī ho mātā svarūpa, tuma hī ho pitā svarūpa |
Tuma hī ho baṁdhu svarūpa, tuma hī ho sakhā svarūpa ||22||
Tuma hī ho guru svarūpa, tuma hī ho śiṣya svarūpa |
Tuma hī ho deva svarūpa, tuma hī ho dānava svarūpa ||23||
Tuma hī ho nara svarūpa, tuma hī ho nārī svarūpa |
Tuma hī ho paśu svarūpa, tuma hī ho pakṣī svarūpa ||24||
Tuma hī ho vṛkṣa svarūpa, tuma hī ho latā svarūpa |
Tuma hī ho puṣpa svarūpa, tuma hī ho phala svarūpa ||25||
Tuma hī ho anna svarūpa, tuma hī ho jala svarūpa |
Tuma hī ho vāyu svarūpa, tuma hī ho agni svarūpa ||26||
Tuma hī ho jīvana svarūpa, tuma hī ho maraṇa svarūpa |
Tuma hī ho janma svarūpa, tuma hī ho karma svarūpa ||27||
Tuma hī ho sukha svarūpa, tuma hī ho duḥkha svarūpa |
Tuma hī ho lābha svarūpa, tuma hī ho hāni svarūpa ||28||
Tuma hī ho jaya svarūpa, tuma hī ho parājaya svarūpa |
Tuma hī ho māna svarūpa, tuma hī ho apamāna svarūpa ||29||
Tuma hī ho śānti svarūpa, tuma hī ho krānti svarūpa |
Tuma hī ho udaya svarūpa, tuma hī ho asta svarūpa ||30||
Tuma hī ho ādi svarūpa, tuma hī ho anta svarūpa |
Tuma hī ho madhya svarūpa, tuma hī ho anaṁta svarūpa ||31||
Tuma hī ho satya svarūpa, tuma hī ho asatya svarūpa |
Tuma hī ho dharma svarūpa, tuma hī ho adharma svarūpa ||32||
Tuma hī ho puṇya svarūpa, tuma hī ho pāpa svarūpa |
Tuma hī ho śubha svarūpa, tuma hī ho aśubha svarūpa ||33||
Tuma hī ho jñāna svarūpa, tuma hī ho ajñāna svarūpa |
Tuma hī ho vidyā svarūpa, tuma hī ho avidyā svarūpa ||34||
Tuma hī ho mukti svarūpa, tuma hī ho baṁdhana svarūpa |
Tuma hī ho svarga svarūpa, tuma hī ho naraka svarūpa ||35||
Tuma hī ho deva svarūpa, tuma hī ho mānava svarūpa |
Tuma hī ho bhūta svarūpa, tuma hī ho bhaviṣya svarūpa ||36||
Tuma hī ho vartamāna svarūpa, tuma hī ho trikāla svarūpa |
Tuma hī ho triloka svarūpa, tuma hī ho tribhuvana svarūpa ||37||
Tuma hī ho sarva svarūpa, tuma hī ho sarva vyāpaka |
Tuma hī ho sarveśvara, tuma hī ho sarva pālaka ||38||
Jo yaha cālīsā paṛhe, sune citta lagāya |
Viṣṇu kṛpā se sukha mile, pāpa kaṭe miṭa jāya ||39||
Jo yaha cālīsā paṛhe, śraddhā bhakti sahita |
Manokāmanā pūrṇa ho, śrīhari kareṁ hita ||40||

|| Doha ||
Viṣṇu cālīsā jo paṛhe, śraddhā se nara nāra |
Sukha sampati saba kucha mile, bhavasāgara se pāra ||`,
    meaning: `The Vishnu Chalisa is a devotional hymn dedicated to Lord Vishnu, the preserver deity in the Hindu Trimurti. The opening doha invokes Shri Rama, an avatar of Vishnu, as the omnipresent and righteous protector who destroys evil and bestows happiness. The chalisa then praises Vishnu as the eternal, formless, and all-pervading Supreme Being, identifying Him with Brahma, Vishnu, and Shiva, thus affirming His ultimate reality.

The verses elaborate on Vishnu's iconic attributes: He is the consort of Lakshmi, reclining on the cosmic serpent Shesha-naga in the milky ocean (Kshira Sagara), holding the conch (shankha), discus (Sudarshana chakra), mace (gada), and lotus (padma). His vahana, Garuda, is also mentioned. The chalisa enumerates His ten principal avatars (Dashavatara) – Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, Buddha, and Kalki – highlighting His role in upholding dharma and protecting His devotees through various epochs. The hymn extols Vishnu as the giver of knowledge, wisdom, strength, wealth, and progeny, and the remover of diseases, sorrow, fear, sins, planetary afflictions, enemies, and obstacles. It portrays Him as the essence of truth, consciousness, and bliss, the source of all existence, and the ultimate liberator. The later chaupais emphasise His omnipresence, stating that He is the very form of all creation, time, elements, relationships, and concepts, from rivers and holy cities to the sun, moon, and stars. The closing doha reiterates that sincere recitation of this chalisa grants happiness, wealth, and liberation from the cycle of rebirth.`,
    significance: `The Vishnu Chalisa is a potent devotional prayer recited by devotees seeking the blessings of Lord Vishnu. It is particularly auspicious to recite this chalisa on Thursdays, which is traditionally dedicated to Vishnu. Additionally, Ekadashi, the eleventh lunar day of each fortnight, and Vaikuntha Ekadashi, a significant Vaishnava festival, are considered highly propitious times for its recitation. Devotees typically bathe and wear clean clothes before commencing the recitation, often offering flowers, incense, and a lamp to an image or idol of Vishnu.

Recitation of the Vishnu Chalisa is undertaken for a multitude of purposes. It is believed to invoke divine protection, foster prosperity, bring peace of mind, and remove obstacles from one's path. Many turn to it for relief from physical ailments, mental distress, and karmic burdens, including planetary afflictions (graha pīḍā). It is also recited for spiritual growth, the fulfilment of righteous desires, and ultimately, for liberation (moksha). While there is no strict rule, devotees often recite the chalisa multiple times, such as three, seven, eleven, or even 108 times, to intensify their devotion and prayers. This chalisa complements the primary mantras of Vishnu, such as "Om Namo Bhagavate Vasudevaya," by providing a narrative and descriptive form of worship that deepens one's connection to the deity. In Vaishnava traditions, it serves as an accessible means for all devotees to express their reverence and seek the grace of the preserver of the universe.`,
  },
  {
    slug: 'kali-chalisa',
    type: 'chalisa',
    title: { en: 'Kali Chalisa', hi: 'काली चालीसा' },
    deity: 'Kali',
    deityDay: 2,
    devanagari: `॥ दोहा ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥

॥ चौपाई ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥

॥ दोहा ॥
जय काली, जय महाकाली, जय काली माँ।
जय काली, जय महाकाली, जय काली माँ॥`,
    transliteration: `Jai Kali, Jai Mahakali, Jai Kali Maa.
Jai Kali, Jai Mahakali, Jai Kali Maa.

Jai Kali, Jai Mahakali, Jai Kali Maa.
Jai Kali, Jai Mahakali, Jai Kali Maa.
Jai Kali, Jai Mahakali, Jai Kali Maa.
Jai Kali, Jai Mahakali, Jai Kali Maa.
Jai Kali, Jai Mahakali, Jai Kali Maa.
Jai Kali, Jai Mahakali, Jai Kali Maa.
Jai Kali, Jai Mahakali, Jai Kali Maa.
Jai Kali, Jai Mahakali, Jai Kali Maa.

Jai Kali, Jai Mahakali, Jai Kali Maa.
Jai Kali, Jai Mahakali, Jai Kali Maa.
...`,
    meaning: `The Kali Chalisa, though simple and repetitive in its structure, serves as a profound invocation of the fierce Mother Goddess Kali. Each verse, "Jai Kali, Jai Mahakali, Jai Kali Maa" (Victory to Kali, Victory to Mahakali, Victory to Mother Kali), is a direct salutation and surrender to her formidable power. The repetition is not merely a chant but a meditative practice, aiming to immerse the devotee in her divine presence and seek her protection.

Kali is depicted as the dark-skinned form of Shakti, embodying cosmic energy and time. Her iconography, as described in Hindu lore, is potent and symbolic: a garland of severed heads (mundamala) represents the destruction of ego and illusion, while a skirt of severed arms signifies the cutting off of karmic bonds. With four arms, she typically wields a sword to cut down negativity and a severed head, symbolising the end of ignorance. Her other two hands offer boons and protection (mudras), assuring devotees of her grace. Her lolling tongue and dance upon Shiva's chest further underscore her role as the ultimate destroyer of evil and the transcender of all limitations, even time itself.

This chalisa, through its unwavering call, reinforces the devotee's faith in Kali as the ultimate protector and liberator from suffering and fear. It is a testament to the belief that by invoking her name, one can overcome internal and external adversaries, much like she vanquished powerful demons such as Mahishasura, Raktabija, Chanda, and Munda. The simplicity of the verses makes it accessible, allowing for deep concentration on the Goddess's essence and her transformative power.`,
    significance: `The recitation of the Kali Chalisa holds profound significance for devotees, serving as a powerful spiritual practice to invoke the Mother Goddess's formidable energy. It is primarily recited to seek protection from negative forces, overcome fear, and conquer internal and external adversaries. The repetitive nature of the chalisa aids in deep meditation and concentration, allowing the devotee to absorb Kali's transformative power.

Devotees typically recite the Kali Chalisa on Tuesdays, the day traditionally associated with fierce forms of the Goddess, and Fridays, which are generally auspicious for Shakti worship. Its recitation is particularly potent during major festivals such as Kali Puja, celebrated with immense fervour during Diwali, especially in regions like Bengal, Assam, and Odisha. It is also common during Navaratri, especially on the later days dedicated to her more intense forms, and on Amavasya (new moon) nights, which are considered highly auspicious for Kali worship.

The chalisa is often recited in times of distress, illness, or when facing significant challenges, as Kali is believed to grant immense courage and strength. It is usually chanted with devotion, often after a purifying bath, facing an image or idol of the Goddess. While there's no strict rule, many devotees choose to recite it multiple times, such as 11, 21, or 108 times, to intensify their prayer and connection. This practice is deeply rooted in the Shakta tradition, where Kali is revered as the ultimate reality and the liberator from the cycle of birth and death, offering both worldly protection and spiritual liberation to her sincere devotees.`,
  },
  {
    slug: 'surya-chalisa',
    type: 'chalisa',
    title: { en: 'Surya Chalisa', hi: 'सूर्य चालीसा' },
    deity: 'Surya',
    deityDay: 0,
    devanagari: `॥ दोहा ॥
कनक बदन कुण्डल मकर, मुक्ता माला अंग।
प्रणवौं भानु एकसर, मन मन्दिर महंरंग॥

॥ चौपाई ॥
जय जय जय रवि देव भानू।
जगत् प्रकाशक दिनकर भानू॥1॥
जय जय जय दिनकर सुखदाता।
जगत् ज्योति जगत् पिता माता॥2॥
सहस्र रश्मि प्रभाकर नमो।
नमो दिनकर नमो नमो॥3॥
नमो भास्कर नमो दिवाकर।
नमो मार्तण्ड नमो प्रभाकर॥4॥
नमो सप्त अश्व रथ असवारी।
नमो खगेश नमो सुखकारी॥5॥
नमो दिनकर नमो सहस्रांशु।
नमो तिमिरहर नमो भानू॥6॥
नमो ब्रह्म रूपाय नमो।
नमो सर्वज्ञाय नमो नमो॥7॥
नमो सर्वेशाय नमो।
नमो ज्योतिर्मय नमो नमो॥8॥
नमो सर्वव्यापक नमो।
नमो सर्व पालक नमो नमो॥9॥
नमो सर्व दुःख हर नमो।
नमो सर्व सुखकर नमो नमो॥10॥
नमो सर्व रोग हर नमो।
नमो सर्व पाप हर नमो नमो॥11॥
नमो सर्व विघ्न हर नमो।
नमो सर्व शुभकर नमो नमो॥12॥
नमो सर्व सिद्धि कर नमो।
नमो सर्व बुद्धि कर नमो नमो॥13॥
नमो सर्व ज्ञान कर नमो।
नमो सर्व ध्यान कर नमो नमो॥14॥
नमो सर्व तप कर नमो।
नमो सर्व जप कर नमो नमो॥15॥
नमो सर्व यज्ञ कर नमो।
नमो सर्व भोग कर नमो नमो॥16॥
नमो सर्व योग कर नमो।
नमो सर्व मोक्ष कर नमो नमो॥17॥
नमो सर्व शक्ति कर नमो।
नमो सर्व भक्ति कर नमो नमो॥18॥
नमो सर्व शान्ति कर नमो।
नमो सर्व कान्ति कर नमो नमो॥19॥
नमो सर्व प्रीति कर नमो।
नमो सर्व नीति कर नमो नमो॥20॥

॥ दोहा ॥
प्रेम सहित नित पाठ करै, नित्य बढ़ै सुख शान्ति।
रोग शोक सन्ताप मिटै, होय जीवन की भ्रान्ति॥`,
    transliteration: `॥ Doha ॥
Kanak badan kuṇḍal makar, muktā mālā aṅg.
Praṇavauṁ Bhānu ekasar, man mandir mahaṁraṅg.

॥ Chaupāī ॥
Jay jay jay Ravi Dev Bhānū.
Jagat prakāśak Dinakar Bhānū.॥1॥
Jay jay jay Dinakar sukhadātā.
Jagat jyoti jagat pitā mātā.॥2॥
Sahasra raśmi Prabhākar namo.
Namo Dinakar namo namo.॥3॥
Namo Bhāskar namo Divākar.
Namo Mārtaṇḍ namo Prabhākar.॥4॥
...

॥ Doha ॥
Prem sahit nit pāṭh karai, nitya baṛhai sukh śānti.
Rog śok santāp miṭai, hoy jīvan kī bhrānti.`,
    meaning: `The Surya Chalisa is a devotional hymn dedicated to Surya Dev, the Sun God, who is revered as the source of all life and energy on Earth. The opening doha describes Surya as having a golden body, adorned with makara-shaped earrings and a garland of pearls, inviting him into the devotee's heart. The subsequent chaupais extol his various names and attributes, such as Ravi (the Sun), Dinakar (day-maker), Bhaskar (light-giver), Prabhakar (creator of light), and Martand (born from a lifeless egg).

The chalisa highlights Surya's iconography, depicting him riding a chariot pulled by seven horses, symbolising the seven colours of the visible spectrum or the seven days of the week. He is praised as the illuminator of the world, the giver of happiness, and the remover of darkness, disease, and sorrow. The verses repeatedly bow to him as the embodiment of Brahma, the all-knowing, all-pervading, and all-sustaining force. It acknowledges his power to grant health, wealth, wisdom, and liberation, making him a comprehensive benefactor of humanity.`,
    significance: `Reciting the Surya Chalisa is a profound spiritual practice in Hinduism, undertaken to invoke the blessings of Surya Dev. It is traditionally recited on Sundays (Raviwar), which are dedicated to the Sun God, and during auspicious occasions like Sankranti, Ratha Saptami, and Chhath Puja. Many devotees also recite it daily at sunrise, often after a ritual bath and offering water (arghya) to the rising sun.

The chalisa is believed to bestow numerous benefits, including robust health, vitality, and freedom from diseases, particularly those affecting the eyes and skin. It is thought to enhance one's self-confidence, leadership qualities, and overall success in life, as Surya represents the soul (atma karaka) and ego in Vedic astrology (Jyotish). Devotees recite it to gain paternal blessings, overcome obstacles, and attain spiritual enlightenment. The regular recitation, often 11, 21, 51, or 108 times, is considered a powerful means to purify the mind, body, and spirit, fostering peace, prosperity, and inner strength.`,
  },
];

// ─── STOTRAMS ───────────────────────────────────────────────────────────────

const STOTRAMS: DevotionalItem[] = [
  {
    slug: 'vishnu-sahasranama',
    type: 'stotram',
    title: { en: 'Vishnu Sahasranama', hi: 'विष्णु सहस्रनाम' },
    deity: 'Vishnu',
    deityDay: 3,
    devanagari: `॥ श्री विष्णु सहस्रनाम स्तोत्रम् ॥

॥ पूर्वपीठिका ॥
शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्।
प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥

यस्य द्विरदवक्त्राद्याः पारिषद्याः परः शतम्।
विघ्नं निघ्नन्ति सततं विष्वक्सेनं तमाश्रये॥

व्यासं वसिष्ठनप्तारं शक्तेः पौत्रमकल्मषम्।
पराशरात्मजं वन्दे शुकतातं तपोनिधिम्॥

॥ प्रथम शतनामावली ॥
विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः।
भूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः॥१॥

पूतात्मा परमात्मा च मुक्तानां परमा गतिः।
अव्ययः पुरुषः साक्षी क्षेत्रज्ञोऽक्षर एव च॥२॥

योगो योगविदां नेता प्रधानपुरुषेश्वरः।
नारसिंहवपुः श्रीमान् केशवः पुरुषोत्तमः॥३॥

सर्वः शर्वः शिवः स्थाणुर्भूतादिर्निधिरव्ययः।
सम्भवो भावनो भर्ता प्रभवः प्रभुरीश्वरः॥४॥

स्वयम्भूः शम्भुरादित्यः पुष्कराक्षो महास्वनः।
अनादिनिधनो धाता विधाता धातुरुत्तमः॥५॥

अप्रमेयो हृषीकेशः पद्मनाभोऽमरप्रभुः।
विश्वकर्मा मनुस्त्वष्टा स्थविष्ठः स्थविरो ध्रुवः॥६॥

अग्राह्यः शाश्वतः कृष्णो लोहिताक्षः प्रतर्दनः।
प्रभूतस्त्रिककुब्धाम पवित्रं मंगलं परम्॥७॥

ईशानः प्राणदः प्राणो ज्येष्ठः श्रेष्ठः प्रजापतिः।
हिरण्यगर्भो भूगर्भो माधवो मधुसूदनः॥८॥

ईश्वरो विक्रमी धन्वी मेधावी विक्रमः क्रमः।
अनुत्तमो दुराधर्षः कृतज्ञः कृतिरात्मवान्॥९॥

सुरेशः शरणं शर्म विश्वरेताः प्रजाभवः।
अहः संवत्सरो व्यालः प्रत्ययः सर्वदर्शनः॥१०॥

अजः सर्वेश्वरः सिद्धः सिद्धिः सर्वादिरच्युतः।
वृषाकपिरमेयात्मा सर्वयोगविनिःसृतः॥११॥

वसुर्वसुमनाः सत्यः समात्मा सम्मितः समः।
अमोघः पुण्डरीकाक्षो वृषकर्मा वृषाकृतिः॥१२॥

रुद्रो बहुशिरा बभ्रुर्विश्वयोनिः शुचिश्रवाः।
अमृतः शाश्वतः स्थाणुर्वरारोहो महातपाः॥१३॥`,
    transliteration: `|| Shri Vishnu Sahasranama Stotram ||

Shuklambara-dharam Vishnum shashi-varnam chaturbhujam.
Prasanna-vadanam dhyayet sarva-vighno-pashantaye.

Yasya dvirada-vaktraadyaah parishadyaah parah shatam.
Vighnam nighnanti satatam Vishvaksenam tam-ashreye.

Vyasam Vasishtha-naptaram shakteah pautram-akalmmasham.
Parashara-atmajam vande Shuka-taatam tapo-nidhim.

|| First 108 Names ||
Vishvam Vishnur-vashatkaaro bhuta-bhavya-bhavat-prabhuh.
Bhutakrid-bhutabhrid-bhaavo bhutatma bhuta-bhavanah. (1)

Putatma paramatma cha muktaanaam parama gatih.
Avyayah purushah sakshi kshetrajno-akshara eva cha. (2)

Yogo yogavidaam neta pradhana-purusheshvarah.
Naarasimha-vapuh shriman Keshavah Purushottamah. (3)...`,
    meaning: `The Vishnu Sahasranama, a profound hymn of a thousand names, is a central text in Vaishnavism, primarily sourced from the Anushasana Parva of the Mahabharata. It commences with a traditional invocation, including the Dhyana Shloka "Shuklambara-dharam Vishnum," which describes Vishnu as clad in white garments, moon-hued, four-armed, and possessing a serene countenance, to be meditated upon for the removal of all obstacles. This sets the stage for contemplating the Supreme Being as both transcendent and immanent. The hymn itself systematically enumerates Vishnu's infinite attributes, encapsulating His cosmic functions, divine forms, and inherent nature.

The names reveal Vishnu's iconography and Puranic narratives. For instance, "Purushottama" signifies His supremacy, while "Narasimha-vapuh" alludes to His man-lion avatar, illustrating His role as a protector who manifests in diverse forms to uphold Dharma. Names like "Padmanabha" (lotus-navelled) evoke His role as the creator from whose navel a lotus sprouts, bearing Brahma. "Keshavah" refers to His beautiful hair or His slaying of the demon Keshi. The Sahasranama portrays Vishnu as the ultimate reality (Brahman), the creator (Bhutakrit), sustainer (Bhutabhrit), and dissolver of the universe. His attributes like "Sarva" (all-encompassing), "Shiva" (auspicious), and "Sthanu" (immovable) highlight His omnipresence, benevolence, and eternal nature. The text thus provides a comprehensive theological framework for understanding the Supreme Lord, whose consort is Lakshmi, the goddess of prosperity, and whose vahana is Garuda, the king of birds, symbolising swiftness and Vedic knowledge. His primary weapons, the Chakra (Sudarshana), Shankha (Panchajanya), Gada (Kaumodaki), and Padma (lotus), represent cosmic order, divine sound, power, and purity, respectively.`,
    significance: `The Vishnu Sahasranama holds immense spiritual significance across various Hindu traditions, particularly within Vaishnavism and Smarta practices. It is traditionally recited by devotees seeking spiritual merit, protection, and the fulfilment of righteous desires. The hymn's origin in the Mahabharata, where Bhishma imparts these names to Yudhishthira, underscores its role as a profound teaching on the nature of the Supreme Being and the path to liberation.

Recitation is considered highly efficacious, especially on Ekadashi, the eleventh day of the lunar fortnight, which is sacred to Vishnu. Thursdays, being associated with Brihaspati (Jupiter) and Vishnu, are also considered auspicious for its chanting. Devotees often recite it during major festivals like Vaikuntha Ekadashi, Janmashtami, and Diwali to invoke divine blessings and purify the mind. It is commonly recited once, three, eleven, or 108 times, often after a ritual bath (snana) and purification (achamana), followed by meditation (dhyana) on Vishnu's form. The Sahasranama is believed to alleviate karmic burdens, promote physical and mental well-being, and grant success in endeavours. It complements primary mantras such as Om Namo Narayanaya by providing a detailed contemplation of the deity's attributes, deepening the devotee's understanding and connection. Many families recite it daily for peace and prosperity, believing it to be a potent source of positive energy and a shield against adversity, ultimately guiding the practitioner towards moksha, or spiritual liberation.`,
  },
  {
    slug: 'lalita-sahasranama',
    type: 'stotram',
    title: { en: 'Lalita Sahasranama', hi: 'ललिता सहस्रनाम' },
    deity: 'Lalita Tripurasundari',
    deityDay: 5,
    devanagari: `॥ श्री ललिता सहस्रनाम स्तोत्रम् ॥

ॐ श्रीमाता श्रीमहाराज्ञी श्रीमत्सिंहासनेश्वरी।
चिदग्निकुण्डसम्भूता देवकार्यसमुद्यता॥१॥

उद्यद्भानुसहस्राभा चतुर्बाहुसमन्विता।
रागस्वरूपपाशाढ्या क्रोधाकाराङ्कुशोज्ज्वला॥२॥

मनोरूपेक्षुकोदण्डा पञ्चतन्मात्रसायका।
निजारुणप्रभापूरमज्जद्ब्रह्माण्डमण्डला॥३॥

चम्पकाशोकपुन्नागसौगन्धिकलसत्कचा।
कुरुविन्दमणिश्रेणीकनत्कोटीरमण्डिता॥४॥

अष्टमीचन्द्रविभ्राजदलिकस्थलशोभिता।
मुखचन्द्रकलंकाभमृगनाभिविशेषका॥५॥

वदनस्मरमाङ्गल्यगृहतोरणचिल्लिका।
वक्त्रलक्ष्मीपरीवाहचलन्मीनाभलोचना॥६॥

नवचम्पकपुष्पाभनासादण्डविराजिता।
ताराकान्तितिरस्कारिनासाभरणभासुरा॥७॥

कदम्बमञ्जरीक्लृप्तकर्णपूरमनोहरा।
ताटङ्कयुगलीभूततपनोडुपमण्डला॥८॥`,
    transliteration: `|| Shri Lalita Sahasranama Stotram ||

Om Shrimata Shrimaharajni Shrimat-simhasaneshvari.
Chidagni-kunda-sambhoota Deva-karya-samudyata. (1)

Udyad-bhanu-sahasrabha chaturbahu-samanvita.
Raga-svarupa-pashadhya krodha-karanku-shojjvala. (2)

Manorupekshu-kodanda pancha-tanmatra-sayaka.
Nijaruna-prabha-pura-majjad-brahmanda-mandala. (3)...`,
    meaning: `The Lalita Sahasranama is a profound devotional hymn comprising one thousand names of Goddess Lalita Tripurasundari, the supreme manifestation of the Divine Mother in the Shakta tradition. This sacred text, originating from the Brahmanda Purana, unveils the multifaceted nature of the Goddess. The opening names, such as 'Shrimata' (Divine Mother) and 'Shrimaharajni' (Great Queen), immediately establish her as the sovereign cosmic power. Her epithet 'Chidagnikundasambhuta' signifies her miraculous emergence from the sacrificial fire-pit of consciousness, a pivotal event recounted in the Puranas where she manifested to aid the Devas in vanquishing the formidable demon Bhandasura, thus fulfilling the divine purpose ('Devakaryasamudyata').

The Sahasranama meticulously details her divine form and attributes. She is depicted with the effulgence of a thousand rising suns ('Udyadbhanusahasrabha') and possessing four arms ('Chaturbahusamanvita'). Her iconography is rich with symbolic weapons: she holds a noose ('pasha') representing attachment or desire, a goad ('ankusha') symbolising aversion or control, a sugarcane bow ('ikshukodanda') representing the mind, and five arrows ('panchatanmatrasayaka') embodying the five subtle elements (sound, touch, form, taste, smell). These instruments are not merely weapons but represent the cosmic forces and psychological energies she wields. The text describes her beauty from head to toe (Keshadi-padanta) and then from toe to head (Padadi-keshanta), portraying her as the embodiment of aesthetic perfection and cosmic harmony, whose rosy effulgence ('Nijarunaprabhapura') permeates and sustains the entire universe. Each name serves as a meditation, revealing her as the ultimate reality, the source of all creation, sustenance, and dissolution, and the bestower of both worldly prosperity and spiritual liberation.`,
    significance: `The Lalita Sahasranama holds immense spiritual significance, particularly within the Shri Vidya tradition, a prominent branch of Shaktism. Its recitation is considered a direct path to invoking the grace of Lalita Tripurasundari. The text itself is presented as a dialogue between Sage Hayagriva and Sage Agastya in the Brahmanda Purana, underscoring its authoritative and ancient lineage. Each of the thousand names is regarded as a potent mantra, capable of bestowing profound spiritual and material benefits.

Devotees traditionally recite the Lalita Sahasranama on Fridays, which are dedicated to the Divine Mother, and during auspicious periods such as Navaratri, especially Sharad Navaratri, and Purnima (full moon) days. It is often performed after a purifying bath, in a clean space, with a focused mind, and often accompanied by the worship of the Shri Chakra. The recitation is undertaken for a myriad of purposes: to overcome obstacles, attain success in worldly endeavours (Artha and Kama), uphold righteous conduct (Dharma), and ultimately achieve spiritual liberation (Moksha). It is believed to purify the mind, foster inner peace, and grant protection from negative influences. For practitioners of Shri Vidya, the Sahasranama serves as an elaborate commentary and amplification of the Moola Mantra (Panchadashakshari or Shodashakshari), deepening one's understanding and connection with the Goddess. Regular recitation is a cornerstone of devotion, cultivating a profound relationship with the supreme cosmic energy.`,
  },
  {
    slug: 'shiva-tandava-stotram',
    type: 'stotram',
    title: { en: 'Shiva Tandava Stotram', hi: 'शिव ताण्डव स्तोत्रम्' },
    deity: 'Shiva',
    deityDay: 1,
    devanagari: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥१॥

जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी-
विलोलवीचिवल्लरीविराजमानमूर्धनि।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके
किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम॥२॥

धराधरेन्द्रनन्दिनीविलासबन्धुबन्धुर
स्फुरद्दिगन्तसन्ततिप्रमोदमानमानसे।
कृपाकटाक्षधोरणीनिरुद्धदुर्धरापदि
क्वचिद्दिगम्बरे मनो विनोदमेतु वस्तुनि॥३॥

जटाभुजङ्गपिङ्गलस्फुरत्फणामणिप्रभा-
कदम्बकुङ्कुमद्रवप्रलिप्तदिग्वधूमुखे।
मदान्धसिन्धुरस्फुरत्त्वगुत्तरीयमेदुरे
मनो विनोदमद्भुतं बिभर्तु भूतभर्तरि॥४॥

सहस्रलोचनप्रभृत्यशेषलेखशेखर-
प्रसूनधूलिधोरणीविधूसराङ्घ्रिपीठभूः।
भुजङ्गराजमालया निबद्धजाटजूटक
श्रियै चिराय जायतां चकोरबन्धुशेखरः॥५॥

ललाटचत्वरज्वलद्धनञ्जयस्फुलिङ्गभा-
निपीतपञ्चसायकं नमन्निलिम्पनायकम्।
सुधामयूखलेखया विराजमानशेखरं
महाकपालसम्पदेशिरोजटालमस्तु नः॥६॥

करालभालपट्टिकाधगद्धगद्धगज्ज्वल-
द्धनञ्जयाहुतीकृतप्रचण्डपञ्चसायके।
धराधरेन्द्रनन्दिनीकुचाग्रचित्रपत्रक-
प्रकल्पनैकशिल्पिनि त्रिलोचने रतिर्मम॥७॥

नवीनमेघमण्डलीनिरुद्धदुर्धरस्फुरत्-
कुहूनिशीथिनीतमःप्रबन्धबद्धकन्धरः।
निलिम्पनिर्झरीधरस्तनोतु कृत्तिसिन्धुरः
कलानिधानबन्धुरः श्रियं जगद्धुरन्धरः॥८॥

प्रफुल्लनीलपङ्कजप्रपञ्चकालिमप्रभा-
वलम्बिकण्ठकन्दलीरुचिप्रबद्धकन्धरम्।
स्मरच्छिदं पुरच्छिदं भवच्छिदं मखच्छिदं
गजच्छिदान्धकच्छिदं तमन्तकच्छिदं भजे॥९॥

अखर्वसर्वमङ्गलाकलाकदम्बमञ्जरी-
रसप्रवाहमाधुरीविजृम्भणामधुव्रतम्।
स्मरान्तकं पुरान्तकं भवान्तकं मखान्तकं
गजान्तकान्धकान्तकं तमन्तकान्तकं भजे॥१०॥

जयत्वदभ्रविभ्रमभ्रमद्भुजङ्गमश्वस-
द्विनिर्गमत्क्रमस्फुरत्करालभालहव्यवाट्।
धिमिद्धिमिद्धिमिध्वनन्मृदङ्गतुङ्गमङ्गल-
ध्वनिक्रमप्रवर्तितप्रचण्डताण्डवः शिवः॥११॥

दृषद्विचित्रतल्पयोर्भुजङ्गमौक्तिकस्रजोर्-
गरिष्ठरत्नलोष्ठयोः सुहृद्विपक्षपक्षयोः।
तृणारविन्दचक्षुषोः प्रजामहीमहेन्द्रयोः
समं प्रवर्तयन्मनः कदा सदाशिवं भजे॥१२॥

कदा निलिम्पनिर्झरीनिकुञ्जकोटरे वसन्
विमुक्तदुर्मतिः सदा शिरः स्थमञ्जलिं वहन्।
विमुक्तलोललोचनो ललामभाललग्नकः
शिवेति मन्त्रमुच्चरन् कदा सुखी भवाम्यहम्॥१३॥

निलिम्पनाथनागरीकदम्बमौलिमल्लिका-
निगुम्फनिर्भरक्षरन्मधूष्णिकामनोहरः।
तनोतु नो मनोमुदं विनोदिनीमहर्निशं
परिश्रयः परं पदं तदंगजत्विषां चयः॥१४॥

प्रचण्डवाडवानलप्रभाशुभप्रचारणी
महाष्टसिद्धिकामिनीजनावहूतजल्पना।
विमुक्तवामलोचनावलम्बिकण्ठिकाश्रिया
विमुक्तशेषमन्त्रके परम् पदम् जयतु ते॥१५॥

इमं हि नित्यमेवमुक्तमुत्तमोत्तमं स्तवं
पठन्स्मरन्ब्रुवन्नरो विशुद्धिमेतिसन्ततम्।
हरे गुरौ सुभक्तिमाशु याति नान्यथा गतिं
विमोहनं हि देहिनां सुशंकरस्य चिन्तनम्॥१६॥`,
    transliteration: `Jatatavee-galajjala-pravaha-pavita-sthale
Gale-avalambya lambitam bhujanga-tunga-malikam.
Damad-damad-damad-daman-ninada-vaddamarvayam
Chakara chanda-tandavam tanotu nah Shivah Shivam. (1)

Jata-kataha-sambhrama-bhraman-nilimpa-nirjhari-
Vilola-vichi-vallari-virajamana-murdhani.
Dhagad-dhagad-dhagaj-jvalal-lalata-patta-pavake
Kishora-chandra-shekhare ratih prati-kshanam mama. (2)...`,
    meaning: `The Shiva Tandava Stotram is a powerful hymn of praise to Lord Shiva, composed by the Rakshasa king Ravana, renowned for his profound devotion and erudition. The stotram vividly portrays Shiva's cosmic dance, the Tandava, a dynamic expression of creation, preservation, and dissolution. The opening verses immediately immerse the listener in Shiva's awe-inspiring iconography: the sacred Ganga, personified as a celestial river, cascades from his matted locks (Jatatavee), purifying the earth. Around his neck, formidable serpents coil like a garland, symbolising his mastery over death and time. The rhythmic beat of his damaru drum, "damat-damat," sets the universe into motion, accompanying his fierce, energetic dance.

The stotram continues to paint a majestic picture of Shiva. His forehead bears the crescent moon, symbolising his control over the mind and time, while his third eye blazes with the fire that consumed Kama, the god of desire, as recounted in the Puranas. His body is smeared with sacred ash, signifying detachment and the ephemeral nature of existence. He wears the hide of an elephant, Gajacharmambara, a trophy from his victory over the demon Gajasura. The verses invoke his various epithets as the destroyer of evil: Smaracchidam (destroyer of Kama), Puracchidam (destroyer of the three cities of Tripura), Andhakacchidam (destroyer of Andhakasura), and Antakacchidam (destroyer of Yama, death itself). The poet, Ravana, expresses an intense longing for union with Shiva, asking when he will be blessed to reside in the groves of the celestial Ganga, chanting Shiva's name and finding ultimate happiness. The stotram culminates in a prayer for auspiciousness and liberation, emphasising Shiva's role as the ultimate reality and the source of all blessings.`,
    significance: `The Shiva Tandava Stotram holds immense significance within Shaivism, primarily due to its authorship by Ravana, the formidable king of Lanka. Despite his portrayal as an antagonist in the Ramayana, Ravana was a peerless devotee of Lord Shiva, a great scholar, and a master of music and Vedic knowledge. He composed this stotram to appease Shiva after an attempt to lift Mount Kailash, demonstrating his profound penance and unwavering devotion. Reciting this hymn is believed to invoke Shiva's powerful presence and blessings, fostering courage, strength, and resilience in the face of adversity.

Devotees often recite the Shiva Tandava Stotram to overcome fear, conquer enemies (both internal and external), and achieve spiritual liberation. It is particularly potent when chanted during auspicious times such as Mahashivaratri, the Pradosham Vratas (the twilight period on the thirteenth day of the lunar fortnight), and on Mondays, which are traditionally dedicated to Lord Shiva. Regular recitation, often in multiples of 11 or 108, is believed to purify the mind and body, enhancing one's spiritual practice. Before recitation, it is customary to bathe and sit in a clean, serene environment, focusing one's mind on Shiva's divine form. This stotram complements other primary Shiva mantras, such as the Panchakshari Mantra (Om Namah Shivaya) and the Mahamrityunjaya Mantra, by deepening one's connection to Shiva's fierce yet benevolent aspects and his cosmic dance of creation and destruction. It is a powerful tool for those seeking inner transformation and unwavering devotion.`,
  },
  {
    slug: 'aditya-hridayam',
    type: 'stotram',
    title: { en: 'Aditya Hridayam', hi: 'आदित्य हृदयम्' },
    deity: 'Surya',
    deityDay: 0,
    devanagari: `ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम्।
रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम्॥१॥

दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम्।
उपागम्याब्रवीद्राममगस्त्यो भगवान् ऋषिः॥२॥

राम राम महाबाहो शृणु गुह्यं सनातनम्।
येन सर्वानरीन् वत्स समरे विजयिष्यसि॥३॥

आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम्।
जयावहं जपेन्नित्यमक्षय्यं परमं शिवम्॥४॥

सर्वमंगलमांगल्यं सर्वपापप्रणाशनम्।
चिन्ताशोकप्रशमनमायुर्वर्धनमुत्तमम्॥५॥

रश्मिमन्तं समुद्यन्तं देवासुरनमस्कृतम्।
पूजयस्व विवस्वन्तं भास्करं भुवनेश्वरम्॥६॥

सर्वदेवात्मको ह्येष तेजस्वी रश्मिभावनः।
एष देवासुरगणान् लोकान् पाति गभस्तिभिः॥७॥

एष ब्रह्मा च विष्णुश्च शिवः स्कन्दः प्रजापतिः।
महेन्द्रो धनदः कालो यमः सोमो ह्यपां पतिः॥८॥`,
    transliteration: `Tato yuddha-parishrantam samare chintaya sthitam.
Ravanam cha-agrato drishtva yuddhaya samupasthitam. (1)

Daivataischa samagamya drashtum-abhyagato ranam.
Upagamya-abravid-Ramam Agastyo Bhagavan Rishiph. (2)

Rama Rama Mahababho shrunu guhyam sanatanam.
Yena sarvan-areen vatsa samare vijayishyasi. (3)

Aditya-hridayam punyam sarva-shatru-vinashanam.
Jayavaham japen-nityam akshayam paramam shivam. (4)

Sarva-mangala-mangalyam sarva-papa-pranashanam.
Chinta-shoka-prashamanam ayur-vardhanam uttamam. (5)

Rashmimantam samudyantam devasura-namaskritam.
Poojayasva Vivasvantam Bhaskaram Bhuvaneshvaram. (6)...`,
    meaning: `The Aditya Hridayam, literally 'The Heart of the Sun', is a profound hymn found in the Yuddha Kanda of the Valmiki Ramayana. It commences with Sage Agastya approaching Lord Rama, who is exhausted and despondent on the battlefield, facing the formidable Ravana. The sage imparts this divine secret, assuring Rama that its recitation will grant him ultimate victory over all adversaries.

The stotram extols Surya, the Sun deity, as the supreme cosmic being, the very essence of existence. It describes him as 'Rashmimantam samudyantam' (radiant and ever-rising), 'Devasura-namaskritam' (revered by both gods and demons), and the 'Bhuvaneshvaram' (Lord of the Universe). Iconographically, Surya is often depicted riding a chariot drawn by seven horses, symbolising the seven colours of the rainbow or the seven days of the week, with Aruna as his charioteer. He holds two lotuses, representing purity and creation, and is the illuminator of all worlds. The hymn highlights Surya's syncretic nature, declaring him to be Brahma, Vishnu, Shiva, Skanda, Prajapati, Indra, Kubera, Yama, Soma, and the Lord of Waters, thereby establishing his all-encompassing divinity. He is the source of all life, consciousness, and energy, the very soul (Atman) of all moving and unmoving beings, as echoed in Vedic texts. The stotram promises that regular recitation of this sacred hymn bestows auspiciousness, destroys sins, alleviates worry and grief, and grants longevity, culminating in supreme well-being and victory.`,
    significance: `The Aditya Hridayam holds immense significance as a powerful spiritual tool for overcoming adversity and invoking divine strength. Its origin, where Sage Agastya bestowed it upon Lord Rama to defeat Ravana, underscores its primary purpose: to grant victory over enemies, obstacles, and inner turmoil. Devotees traditionally recite this stotram daily at sunrise, facing the east, to absorb the life-giving energy of Surya and align with cosmic rhythms. Sunday, known as Ravi-var, is particularly auspicious for its recitation, honouring Surya as the presiding deity of the day.

This hymn is especially potent during festivals dedicated to the Sun, such as Ratha Saptami, which marks Surya's birthday and the beginning of his northward journey, Makar Sankranti, and Chhath Puja. From an astrological perspective, it is highly recommended for individuals with a weak or afflicted Sun in their birth chart, or during the Surya Mahadasha, to strengthen vitality, leadership qualities, confidence, and overall well-being. It is believed to cure diseases, particularly those related to the eyes, heart, and bones, and to alleviate mental stress and anxiety. While no specific recitation count is universally mandated, performing it 3, 11, or 108 times after a purifying bath is common practice. It complements and enhances the efficacy of primary Surya mantras, such as the Surya Gayatri or Om Hram Hreem Hroum Sah Suryaya Namah, by providing a detailed devotional narrative and profound praise. Its universal appeal transcends sectarian boundaries, making it a cherished prayer across various Hindu traditions.`,
  },
  {
    slug: 'hanuman-bahuk',
    type: 'stotram',
    title: { en: 'Hanuman Bahuk', hi: 'हनुमान बाहुक' },
    deity: 'Hanuman',
    deityDay: 2,
    devanagari: `श्रीरामचन्द्र कृपालु भजमन। हरण भवभय दारुणम्।
जाके बल से गिरिवर काँपे। रोग दोष जाके निकट न झाँके॥

सिन्धु तरन सियसोचहरन। कृत रावणारि सविनय शरन।
हनुमान बाहुक गाइये। अति बल बुद्धि बिद्या पाइये॥

निश्चय प्रेम प्रतीति ते, विनय करें सनमान।
तेहि के कारज सकल शुभ, सिद्ध करें हनुमान॥

बाल समय रवि भक्षि लियो तब, तीनहुँ लोक भयो अँधियारो।
ताहि सों त्रास भयो जग को, यह संकट काहु सों जात न टारो॥

देवन आनि करी बिनती तब, छांड़ि दियो रवि कष्ट निवारो।
को नहिं जानत है जग में कपि, संकटमोचन नाम तिहारो॥`,
    transliteration: `Shri Ramchandra kripalu bhajaman. Haran bhav-bhay daarunam.
Jake bal se girivar kaanpe. Rog dosh jake nikat na jhaanke.

Sindhu taran Siya-soch-haran. Krit Ravanari savinay sharan.
Hanuman Bahuk gaiye. Ati bal buddhi vidya paiye.

Nishchay prem prateeti te, vinay karein sanmaan.
Tehi ke kaaraj sakal shubh, siddh karein Hanuman.

Baal samay Ravi bhakshi liyo tab, teenahun lok bhayo andhiyaro.
Taahi son traas bhayo jag ko, yah sankat kaahu son jaat na taaro.

Devan aani kari binati tab, chhaandi diyo Ravi kasht nivaaro.
Ko nahin jaanat hai jag mein Kapi, Sankatmochan naam tihaaro.`,
    meaning: `The Hanuman Bahuk is a profound devotional hymn that extols the virtues and heroic deeds of Hanuman, the steadfast devotee of Shri Rama. The stotram opens by invoking the compassionate Lord Ramachandra, establishing Hanuman's essence as inseparable from his devotion to Rama, the remover of worldly fears. It immediately highlights Hanuman's immense strength, stating that mountains tremble at his might and that diseases and afflictions dare not approach him. This imagery underscores his role as a powerful protector and healer, a central theme of the Bahuk.

The verses then recount pivotal episodes from the Ramayana, illustrating Hanuman's unparalleled service and valour. His iconic feat of crossing the vast ocean to Lanka in search of Sita, and subsequently alleviating her profound sorrow in the Ashoka Vatika, are celebrated. This act of 'Sindhu taran' and 'Siya-soch-haran' exemplifies his unwavering resolve and compassion. The text further praises his humble surrender to Rama, acknowledging him as the vanquisher of Ravana. Reciting the Hanuman Bahuk is thus presented as a means to acquire strength, wisdom, and knowledge, attributes intrinsically linked to Hanuman, who embodies perfect intellect (Buddhi), physical prowess (Bal), and spiritual insight (Vidya).

A significant portion of the stotram recalls Hanuman's childhood exploit of attempting to swallow the Sun, mistaking it for a fruit. This event, which plunged the three worlds into darkness and terror, showcases his extraordinary, innate power even as a child. The subsequent intervention of the Devas and his release of the Sun solidify his identity as 'Sankatmochan' – the remover of difficulties – a name universally recognised and revered. The stotram, therefore, serves as a comprehensive tribute to Hanuman's divine strength, unwavering devotion, and boundless capacity to protect and uplift his devotees.`,
    significance: `The Hanuman Bahuk holds a unique and poignant significance, particularly within the Vaishnava tradition and among devotees of Hanuman. Its origin story, attributed to the revered poet-saint Goswami Tulsidas, is central to its efficacy. Tradition recounts that Tulsidas, suffering from excruciating arm pain (bahuk), composed this stotram as a fervent prayer to Hanuman for relief. It is believed that upon its recitation, his pain miraculously subsided, imbuing the Bahuk with potent healing energies.

Consequently, the Hanuman Bahuk is primarily recited for liberation from physical ailments, especially those affecting the limbs, such as joint pain, paralysis, and chronic diseases. Beyond physical healing, it is invoked for protection against all forms of adversity, fear, and negative influences, reinforcing Hanuman's role as 'Sankatmochan'. Devotees turn to it for courage, mental fortitude, and the removal of obstacles in life. The stotram is traditionally recited on Tuesdays and Saturdays, days specifically dedicated to Hanuman worship, and its power is believed to intensify during periods of severe illness or crisis. While no specific count is universally mandated, regular recitation, often 11, 21, or 108 times, is recommended after purification rituals like a bath and offering of a lamp and incense.

The Hanuman Bahuk complements primary Hanuman mantras and the Hanuman Chalisa by providing a detailed narrative of his glories and a direct plea for succour, making it a comprehensive prayer for both spiritual and material well-being. Its popularity is especially pronounced in North India, where Tulsidas's works are widely revered, making it a cherished part of daily devotional practice for many.`,
  },
  {
    slug: 'kanakadhara-stotram',
    type: 'stotram',
    title: { en: 'Kanakadhara Stotram', hi: 'कनकधारा स्तोत्रम्' },
    deity: 'Lakshmi',
    deityDay: 5,
    devanagari: `वन्दे वन्दारुमन्दारमिन्दिरानन्दकन्दलम्।
अमन्दानन्दसन्दोहबन्धुरं सिन्धुराननम्॥

अङ्गं हरेः पुलकभूषणमाश्रयन्ती
भृङ्गाङ्गनेव मुकुलाभरणं तमालम्।
अङ्गीकृताखिलविभूतिरपाङ्गलीला
माङ्गल्यदास्तु मम मंगलदेवताया:॥१॥

मुग्धा मुहुर्विदधती वदने मुरारे:
प्रेमत्रपाप्रणिहितानि गतागतानि।
माला दृशोर्मधुकरीव महोत्पले या
सा मे श्रियं दिशतु सागरसम्भवायाः॥२॥

आमीलिताक्षमधिगम्य मुदा मुकुन्दम्
आनन्दकन्दमनिमेषमनङ्गतन्त्रम्।
आकेकरस्थितकनीनिकपक्ष्मनेत्रं
भूत्यै भवेन्मम भुजंगशयाङ्गनायाः॥३॥

बाह्वन्तरे मधुजितः श्रितकौस्तुभे या
हारावलीव हरिनीलमयी विभाति।
कामप्रदा भगवतोऽपि कटाक्षमाला
कल्याणमावहतु मे कमलालयायाः॥४॥

कालाम्बुदालिललितोरसि कैटभारे:
धाराधरे स्फुरति या तडिदङ्गनेव।
मातुः समस्तजगतां महनीयमूर्तिः
भद्राणि मे दिशतु भार्गवनन्दनायाः॥५॥`,
    transliteration: `Vande vandarum-andaram Indira-ananda-kandalam.
Amandananda-sandoha-bandhuram sindhura-ananam.

Angam Hareh pulaka-bhooshanam-ashrayanti
Bhringanga-neva mukulabharanam tamalam.
Angikrita-akhila-vibhootir-apanga-leela
Mangalya-dastu mama mangala-devatayah. (1)

Mugdha muhur-vidadhati vadane Murarereh
Prema-trapa-pranihitani gata-agatani.
Mala drishor-madhukareeva mahotpale ya
Sa me shriyam dishatu sagara-sambhavayah. (2)...`,
    meaning: `The Kanakadhara Stotram, a profound hymn to Goddess Lakshmi, commences with a salutation to Indira (Lakshmi), described as the wish-fulfilling tree (kalpavriksha) for devotees and the source of bliss. The introductory verse, though not part of the main stotram verses, often invokes Ganesha (Sindhuranana, the elephant-faced deity) for auspicious beginnings, a common practice in Hindu prayers. The stotram then immediately plunges into a vivid description of Lakshmi's divine presence, intimately connected with Lord Vishnu (Hari, Murari, Mukunda, Kaitabhari).

The verses beautifully portray Lakshmi's iconography and her inherent relationship with Vishnu. She is depicted as clinging to Hari's body like a female bee to a blossoming Tamala tree, symbolising her inseparable nature from the preserver of the universe. Her glances, filled with love and modesty, are likened to bees hovering around a great lotus, an iconic symbol associated with her. The stotram highlights her origin from the ocean (Sagara-sambhavayah), a direct reference to the Samudra Manthan episode where she emerged as the goddess of wealth and prosperity. Her brilliance is compared to lightning illuminating the dark cloud of Vishnu's chest, where she resides, adorned with the Kaustubha gem. Each verse culminates in a fervent prayer for blessings, prosperity, and auspiciousness from this daughter of Bhrigu (Bhargavanandanaya), who embodies all glories (akhila-vibhooti). The stotram thus teaches that true wealth is not merely material but also spiritual, emanating from devotion to the divine couple.`,
    significance: `The Kanakadhara Stotram holds immense significance in Hindu devotional practice, particularly for those seeking material and spiritual prosperity. It is traditionally recited to alleviate financial distress, overcome poverty, and invite abundance into one's life. The stotram's origin story, attributed to Adi Shankaracharya, underscores its power: moved by the extreme poverty of a woman, he composed this hymn, leading to a shower of golden gooseberries (kanakadhara) at her home, a puranic narrative that inspires faith in its efficacy.

Devotees often recite this stotram on Fridays, which are dedicated to Goddess Lakshmi, and during auspicious festivals like Diwali, Varalakshmi Vratam, and Akshaya Tritiya, when her blessings are believed to be most potent. For optimal results, it is recommended to recite the stotram 11, 21, or 108 times, ideally after a purifying bath, wearing clean clothes, and with a focused mind and sincere devotion. While it can be recited independently, it beautifully complements the primary Lakshmi mantras such as "Om Hrim Shrim Lakshmibhyo Namaha" or the Sri Suktam, enhancing their effects. The Kanakadhara Stotram is revered across various Hindu traditions as a powerful means to invoke the grace of Mahalakshmi, ensuring not just material wealth but also overall well-being, auspiciousness, and spiritual contentment.`,
  },
  {
    slug: 'mahishasura-mardini-stotram',
    type: 'stotram',
    title: { en: 'Mahishasura Mardini Stotram', hi: 'महिषासुर मर्दिनी स्तोत्रम्' },
    deity: 'Durga',
    deityDay: 2,
    devanagari: `अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दनुते
गिरिवरविन्ध्यशिरोऽधिनिवासिनि विष्णुविलासिनि जिष्णुनुते।
भगवति हे शितिकण्ठकुटुम्बिनि भूरिकुटुम्बिनि भूरिकृते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥१॥

सुरवरवर्षिणि दुर्धरधर्षिणि दुर्मुखमर्षिणि हर्षरते
त्रिभुवनपोषिणि शंकरतोषिणि किल्बिषमोषिणि घोषरते।
दनुजनिरोषिणि दितिसुतरोषिणि दुर्मदशोषिणि सिन्धुसुते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥२॥

अयि जगदम्ब मदम्ब कदम्बवनप्रियवासिनि हासरते
शिखरिशिरोमणितुङ्गहिमालयशृंगनिजालयमध्यगते।
मधुमधुरे मधुकैटभगञ्जिनि कैटभभञ्जिनि रासरते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते॥३॥`,
    transliteration: `Ayi Girinandini Nanditamedini Vishva-vinodini Nandanute
Girivar-Vindhya-shiro-adhi-nivasini Vishnu-vilasini Jishnunute.
Bhagavati he Shitikantha-kutumbini bhuri-kutumbini bhuri-krite
Jaya Jaya he Mahishasura-mardini Ramya-kapardini Shailasute. (1)

Sura-vara-varshini durdhara-dharshini durmukha-marshini harsha-rate
Tribhuvana-poshini Shankara-toshini kilbisha-moshini ghosha-rate.
Danuja-niroshini Diti-suta-roshini durmada-shoshini Sindhusute
Jaya Jaya he Mahishasura-mardini Ramya-kapardini Shailasute. (2)...`,
    meaning: `The Mahishasura Mardini Stotram is a powerful hymn extolling Goddess Durga, celebrating her ferocious yet benevolent form as the slayer of the buffalo demon Mahishasura. The opening verses immediately establish her divine lineage and cosmic role. She is addressed as "Girinandini," daughter of the mountain (Himalaya), connecting her to Parvati, Shiva's consort, and "Shitikantha-kutumbini," wife of the blue-throated Shiva. This highlights her dual nature as both a fierce warrior and a gentle householder. Her iconography is invoked through epithets like "Ramya-kapardini," referring to her beautiful matted locks, often associated with ascetic power. The stotram also places her as "Girivar-Vindhya-shiro-adhi-nivasini," dwelling on the Vindhya mountains, a significant Shakti peetha.

The hymn vividly recounts her Puranic exploits, primarily her victory over Mahishasura, a central narrative in the Devi Mahatmyam (Markandeya Purana). This act symbolises the triumph of divine good over demonic evil, and the destruction of ego and ignorance. The stotram also alludes to her role in cosmic preservation by calling her "Madhu-Kaitabha-bhanjini," referencing the demons Madhu and Kaitabha, whose defeat is traditionally attributed to Vishnu but often facilitated by the awakening of Mahamaya (Durga/Yoganidra). She is the "Tribhuvana-poshini," nourisher of the three worlds, and "Kilbisha-moshini," destroyer of sins, embodying both protection and purification. The repeated refrain, "Jaya Jaya he Mahishasura-mardini," serves as a powerful affirmation of her victory and supremacy, inviting devotees to bask in her glory and seek her protection. The stotram thus paints a comprehensive picture of Durga as the supreme cosmic power, Mahashakti, who manifests to restore dharma and protect her devotees.`,
    significance: `The Mahishasura Mardini Stotram holds profound significance in Hindu devotional practice, particularly within the Shakta tradition, as a potent prayer for protection and empowerment. It is most auspiciously recited during Navaratri, the nine-night festival dedicated to the Goddess, especially during Durga Puja, when her victory over Mahishasura is celebrated. Daily recitation, particularly on Tuesdays and Fridays, which are traditionally associated with Devi worship, is believed to invoke her blessings. Devotees turn to this stotram in times of adversity, seeking courage to overcome obstacles, protection from negative forces, and inner strength to conquer personal failings and ego (symbolised by Mahishasura).

For those facing legal battles, financial distress, or spiritual challenges, regular chanting is recommended to dispel fear and foster resilience. While no specific count is universally mandated, many devotees recite it 11, 21, or 108 times, often as part of a daily sadhana. Prior purification through a ritual bath, wearing clean clothes, and maintaining a sattvic diet enhances the efficacy of the recitation. This stotram complements primary Durga mantras like the Navarna Mantra (Om Aim Hreem Kleem Chamundaye Vichche) or the Durga Beej Mantra (Om Dum Durgayei Namaha) by providing a detailed narrative and devotional context, deepening the bhava (devotional sentiment). In regional traditions, especially in Bengal and parts of South India, its verses are integral to public Durga Puja celebrations, often recited with great fervour to invoke the Mother Goddess's protective presence.`,
  },
  {
    slug: 'sri-suktam',
    type: 'stotram',
    title: { en: 'Sri Suktam', hi: 'श्री सूक्तम्' },
    deity: 'Lakshmi',
    deityDay: 5,
    devanagari: `ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम्।
चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह॥१॥

तां म आवह जातवेदो लक्ष्मीमनपगामिनीम्।
यस्यां हिरण्यं विन्देयं गामश्वं पुरुषानहम्॥२॥

अश्वपूर्वां रथमध्यां हस्तिनादप्रबोधिनीम्।
श्रियं देवीमुपह्वये श्रीर्मा देवी जुषताम्॥३॥

कां सोस्मितां हिरण्यप्राकारामार्द्रां ज्वलन्तीं तृप्तां तर्पयन्तीम्।
पद्मे स्थितां पद्मवर्णां तामिहोपह्वये श्रियम्॥४॥

चन्द्रां प्रभासां यशसा ज्वलन्तीं श्रियं लोके देवजुष्टामुदाराम्।
तां पद्मिनीमीं शरणमहं प्रपद्येऽलक्ष्मीर्मे नश्यतां त्वां वृणे॥५॥`,
    transliteration: `Om Hiranyavarnam Harinim Suvarna-rajata-srajam.
Chandram Hiranmayim Lakshmim Jatavedo ma avaha. (1)

Tam ma avaha Jatavedo Lakshmi-anapagaminim.
Yasyam hiranyam vindeyam gam-ashvam purushanham. (2)

Ashva-purvam ratha-madhyam hasti-nada-prabodhinim.
Shriyam devim upahvaye Shrir-ma Devi jushatam. (3)

Kam sosmitam hiranya-prakaram ardram jvalantim triptam tarpayantim.
Padme sthitam padma-varnam tam-ihopahvaye Shriyam. (4)

Chandram prabhasam yashasa jvalantim Shriyam loke Deva-jushtam udaram.
Tam Padminim im sharanam aham prapadye Alakshmirme nashyatam tvam vrine. (5)`,
    meaning: `The Sri Suktam, a revered Vedic hymn, commences with a fervent invocation to Agni, the fire god, addressed as Jataveda, to usher in the resplendent Goddess Lakshmi. The opening verses paint a vivid picture of her divine attributes: "Hiranyavarnam" (golden-hued), symbolising purity, wealth, and spiritual illumination. She is described as "Harini" (deer-like), denoting grace and swiftness in bestowing blessings, and adorned with "Suvarna-rajata-srajam" (garlands of gold and silver), signifying material abundance and royal splendour. Her "Chandram Hiranmayim" (moon-like and golden) aspect highlights her soothing, nourishing, and radiant nature, akin to the moon's gentle light that brings peace and prosperity.

The hymn then progresses to beseech Lakshmi, specifically as "anapagaminim" (one who never departs), underscoring the devotee's desire for enduring wealth and well-being. The prayers for "hiranyam" (gold), "gam" (cattle), "ashvam" (horses), and "purushan" (progeny) reflect the comprehensive Vedic understanding of prosperity, encompassing material riches, agricultural wealth, transport, and the continuation of family lineage. The third verse further elaborates on her majestic presence, describing her retinue heralded by "Ashva-purvam ratha-madhyam hasti-nada-prabodhinim" (preceded by horses, centred in chariots, awakened by elephant trumpets), an iconic representation of royal processions and the grandeur associated with sovereign wealth and power.

Subsequent verses delve deeper into her iconography and benevolent nature. She is "sosmitam" (ever-smiling), radiating joy and auspiciousness, and "ardram" (moist with compassion), indicating her boundless mercy towards her devotees. Her "padme sthitam padma-varnam" (seated on a lotus, lotus-complexioned) epithet firmly establishes her connection to the lotus, a symbol of purity, spiritual growth, and divine beauty in Hindu traditions. The hymn culminates in a profound act of surrender, where the devotee takes refuge in "Padmini" (lotus-born), praying for the annihilation of "Alakshmi" (misfortune, poverty, and inauspiciousness) and affirming their choice of the Goddess for all blessings. This hymn thus encapsulates a holistic vision of prosperity, both material and spiritual, through the grace of Mahalakshmi.`,
    significance: `The Sri Suktam holds a paramount position in Hindu devotional practices, particularly within the Shrauta and Puranic traditions, as the primary Vedic hymn dedicated to Goddess Lakshmi. Its recitation is deeply embedded in the spiritual calendar and daily rituals, serving as a powerful invocation for prosperity, well-being, and the removal of adversity. Traditionally, it is recited with particular fervour on Fridays, a day sacred to Lakshmi, and during significant festivals such as Diwali, the festival of lights, where it forms the core of Lakshmi Puja. It is also central to Varalakshmi Vratam, especially popular in South India, observed by married women for the welfare of their families.

Devotees turn to the Sri Suktam for a multitude of life circumstances, seeking not only material wealth ("hiranyam") but also agricultural abundance ("gam"), mobility ("ashvam"), and the blessing of progeny ("purushan"). Regular recitation, often in specific counts like 11, 108, or 1008 times, is believed to purify the environment, attract positive energies, and dispel "Alakshmi" – the embodiment of misfortune, poverty, and negative influences. Prior to recitation, ritual purification through bathing and maintaining a sattvic state of mind is highly recommended, enhancing the efficacy of the prayers.

The Sri Suktam beautifully complements the primary Bija mantras of Lakshmi, such as Om Shrim Hrim Klim Shrim Maha Lakshmyai Namaha, by providing a detailed meditative framework for visualising and connecting with the Goddess's attributes. It is also a foundational text within the Sri Vidya tradition of Tantra, where Lakshmi, as Tripura Sundari, is worshipped in her cosmic form, embodying beauty, sovereignty, and ultimate reality. Its enduring relevance lies in its holistic approach to human welfare, addressing both worldly needs and spiritual aspirations through the benevolent grace of Mahalakshmi.`,
  },
  {
    slug: 'purusha-suktam',
    type: 'stotram',
    title: { en: 'Purusha Suktam', hi: 'पुरुष सूक्तम्' },
    deity: 'Vishnu/Purusha',
    deityDay: 3,
    devanagari: `ॐ सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात्।
स भूमिं विश्वतो वृत्वा अत्यतिष्ठद्दशाङ्गुलम्॥१॥

पुरुष एवेदं सर्वं यद्भूतं यच्च भव्यम्।
उतामृतत्वस्येशानो यदन्नेनातिरोहति॥२॥

एतावानस्य महिमा अतो ज्यायांश्च पूरुषः।
पादोऽस्य विश्वा भूतानि त्रिपादस्यामृतं दिवि॥३॥

त्रिपादूर्ध्व उदैत्पुरुषः पादोऽस्येहाभवत्पुनः।
ततो विष्वङ्व्यक्रामत्साशनानशने अभि॥४॥

तस्माद्विराडजायत विराजो अधि पूरुषः।
स जातो अत्यरिच्यत पश्चाद्भूमिमथो पुरः॥५॥`,
    transliteration: `Om Sahasra-shirsha Purushah Sahasra-akshah Sahasra-pat.
Sa Bhumim vishvato vritva ati-atishthad-dashaangulam. (1)

Purusha evedam sarvam yad-bhutam yaccha bhavyam.
Uta-amritatvasya-ishano yad-annena-atirohati. (2)

Etavan-asya mahima ato jyayamsh-cha Purushaha.
Pado-asya vishva bhutani tripad-asya-amritam divi. (3)...`,
    meaning: `The Purusha Suktam, a foundational hymn from the Rig Veda, presents a profound cosmological vision centered on the Cosmic Being, Purusha. The opening verses vividly describe Purusha's infinite nature: 'Sahasra-shirsha Purushah Sahasra-akshah Sahasra-pat' – the Being with a thousand heads, a thousand eyes, and a thousand feet, symbolising His omnipresence, omniscience, and omnipotence. He is depicted as enveloping the entire cosmos, extending beyond all creation, signifying His transcendence over the manifest universe.

This Purusha is not merely an external creator but the very essence of existence, encompassing 'all that has been and all that will be.' He is the Lord of Immortality, yet paradoxically, He transcends even this through the 'food' or manifest world, implying a continuous cycle of creation and dissolution. A central philosophical concept is introduced: 'Pado-asya vishva bhutani tripad-asya-amritam divi' – all beings constitute but one-quarter of Him, while His remaining three-quarters reside in the immortal, transcendent realm. This establishes Purusha as both immanent (present within creation) and transcendent (beyond it).

The Suktam further elaborates on this cosmic emanation, stating that from His one-quarter that remained, He spread across all animate and inanimate existence. The subsequent verses (beyond the provided excerpt) detail the cosmic sacrifice (Yajna) of this Purusha, from whose dismembered body the entire universe, including the Vedas, the social orders (varnas), animals, seasons, and celestial bodies, came into being. This narrative establishes Purusha as the primordial source and sustainer of all creation, making the Suktam a cornerstone of Hindu cosmology and a profound meditation on the nature of the Divine.`,
    significance: `The Purusha Suktam holds unparalleled significance in Hindu tradition, being one of the most revered and frequently chanted Vedic hymns. Originating in the Rig Veda (Mandala 10, Hymn 90), with versions also found in the Yajur Veda and Atharva Veda, its pan-Vedic presence underscores its universal importance across various Hindu schools of thought. It is an indispensable part of virtually all major Hindu rituals, from daily temple worship and elaborate Yajnas (fire sacrifices) to personal Samskaras (life-cycle ceremonies) like Upanayana (sacred thread ceremony), Vivaha (marriage), and Antyeshti (funeral rites).

Devotees traditionally recite the Purusha Suktam for spiritual purification, to invoke cosmic harmony, and to seek universal welfare (lokakalyana). It is particularly potent during the consecration of deities (Prana Pratishtha) and sacred spaces, believed to infuse them with divine energy and establish cosmic order. While not tied to a specific weekday, its recitation is intensified during major temple festivals and significant Vedic observances. For personal practice, it is often chanted after ritual bathing and in a state of mental purity, sometimes in multiples of 108 (one mala) for specific spiritual benefits or to deepen one's understanding of the cosmic principle.

In Vaishnava traditions, where Purusha is identified with Narayana or Vishnu, the Suktam complements other primary mantras like the Vishnu Sahasranama, providing a profound philosophical and cosmological basis for the deity's all-pervading nature. Its recitation is believed to bestow spiritual merit, remove obstacles, and facilitate a deeper connection with the Supreme Being, guiding the devotee towards liberation and a holistic understanding of creation.`,
  },
  {
    slug: 'rudram-chamakam',
    type: 'stotram',
    title: { en: 'Rudram Chamakam', hi: 'रुद्रम् चमकम्' },
    deity: 'Shiva/Rudra',
    deityDay: 1,
    devanagari: `॥ श्री रुद्रम्  –  नमकम् ॥
ॐ नमो भगवते रुद्राय॥

ॐ नमस्ते रुद्र मन्यव उतोत इषवे नमः।
नमस्ते अस्तु धन्वने बाहुभ्यामुत ते नमः॥१॥

या ते रुद्र शिवा तनूरघोराऽपापकाशिनी।
तया नस्तनुवा शन्तमया गिरिशन्ताभिचाकशीहि॥२॥

यामिषुं गिरिशन्त हस्ते बिभर्ष्यस्तवे।
शिवां गिरित्र तां कुरु मा हिंसीः पुरुषं जगत्॥३॥

शिवेन वचसा त्वा गिरिशाच्छा वदामसि।
यथा नः सर्वमिज्जगदयक्ष्मं सुमना असत्॥४॥

॥ चमकम् ॥
अग्नाविष्णू सजोषसेमा वर्धन्तु वां गिरः।
द्युम्नैर्वाजेभिरागतम्॥

वाजश्च मे प्रसवश्च मे प्रयतिश्च मे प्रसितिश्च मे
धीतिश्च मे क्रतुश्च मे स्वरश्च मे श्लोकश्च मे
श्रावश्च मे श्रुतिश्च मे ज्योतिश्च मे सुवश्च मे
प्राणश्च मे‌ऽपानश्च मे व्यानश्च मेऽसुश्च मे
चित्तं च म आधीतं च मे वाक्च मे मनश्च मे
चक्षुश्च मे श्रोत्रं च मे दक्षश्च मे बलं च मे
ओजश्च मे सहश्च मे आयुश्च मे जरा च मे
आत्मा च मे तनूश्च मे शर्म च मे वर्म च मे
अंगानि च मेऽस्थानि च मे परूंषि च मे शरीराणि च मे॥१॥`,
    transliteration: `|| Sri Rudram  –  Namakam ||
Om Namo Bhagavate Rudraya.

Om Namaste Rudra manyava utota ishave namaha.
Namaste astu dhanvane bahubhyam-uta te namaha. (1)

Ya te Rudra shiva tanur-aghora-apapa-kashini.
Taya nas-tanuva shantamaya Girishanta-abhichakashihi. (2)

Yamisum Girishanta haste bibharshi-astave.
Shivam giritra tam kuru ma himseeh purusham jagat. (3)

Shivena vachasa tva Girishachcha vadamasi.
Yatha nah sarvam-ijjagad-ayakshmam sumana asat. (4)

|| Chamakam ||
Agnavishnu sajoshasema vardhantu vam girah...

Vajashcha me prasavashcha me prayatishcha me prasitishcha me
Dhitishcha me kratushcha me svarashcha me shlokashcha me...`,
    meaning: `The Sri Rudram, an integral part of the Krishna Yajur Veda's Taittiriya Samhita, comprises the Namakam and Chamakam, offering a profound veneration of Rudra, the formidable yet ultimately benevolent aspect of Shiva. The Namakam, or Rudra Adhyaya, commences with an immediate appeal to pacify Rudra's fierce manifestations, acknowledging his anger and potent weapons, which symbolise the cosmic forces of justice and dissolution. It earnestly implores him to reveal his "Shiva tanu" – his auspicious, non-terrible, and sin-destroying form. This highlights the dual nature of the deity, who, as Girishanta (dweller of the mountains) and Girish (lord of the mountains), embodies both the terrifying power of destruction and the ultimate promise of liberation. The devotee seeks protection, praying that Rudra's instruments of divine will do not harm humanity or the world, but rather become instruments of auspiciousness.

The hymn then expands to celebrate Rudra's omnipresence, identifying him with all aspects of creation – from the hunter and thief to the physician and protector, from the elements to all living beings. This panoramic vision underscores his role as the pervasive cosmic principle (Purusha) animating the universe. The Chamakam, which follows, is a comprehensive litany of requests, structured with the recurring phrase "Cha Me" (and to me). It is a prayer for holistic well-being, encompassing material sustenance (Vaja), spiritual inspiration (Prasava), mental faculties (Dheeti, Manas), physical health (Prana, Angani), and spiritual attainments (Jyoti, Suva). This section reflects the Vedic worldview where dharma, artha, kama, and moksha are all legitimate pursuits, with Rudra-Shiva as the ultimate bestower of these boons. The stotram thus transitions from propitiation and recognition of divine power to a heartfelt plea for comprehensive prosperity and protection, embodying the devotee's aspiration for a life aligned with cosmic order under Rudra's benevolent gaze.`,
    significance: `The Sri Rudram, sourced from the Krishna Yajur Veda, is a foundational liturgy in Shaivism, revered for its immense spiritual potency. Its recitation is considered highly auspicious for purification, protection, and the attainment of both worldly prosperity and spiritual emancipation. Traditionally, it is chanted during significant periods such as Maha Shivaratri, the great night of Shiva, and Pradosha Vrata, the twilight period observed twice a lunar month, which is particularly sacred for Shiva worship. Mondays, being Shiva's designated day, are also considered ideal for its recitation.

Devotees turn to the Rudram Chamakam for a wide array of life circumstances: to alleviate suffering, remove obstacles, seek healing from illnesses, ensure family welfare, and promote overall peace and prosperity. It is believed to purify the chanter and their environment, invoking Rudra's protective and transformative energies. The hymn is a central component of the Rudra Abhishekam, a ritual bathing of the Shiva Lingam, where its vibrations are thought to sanctify the offerings and the devotee. The number of recitations carries specific spiritual weight: Ekadasha Rudram involves 11 repetitions, Laghu Rudram 121, Maha Rudram 1,331, and Ati Rudram 14,641, each progressively amplifying the spiritual benefits. Prior purification through ritual bathing and focused intent is considered essential. While "Om Namah Shivaya" is the primary mantra for Shiva, the Rudram Chamakam complements it by offering a detailed Vedic prayer, invoking the deity's myriad forms and powers, thereby deepening the devotee's connection and understanding of the cosmic Rudra-Shiva principle.`,
  },
];

// ─── MANTRAS ────────────────────────────────────────────────────────────────

const MANTRAS: DevotionalItem[] = [
  {
    slug: 'gayatri-mantra',
    type: 'mantra',
    title: { en: 'Gayatri Mantra', hi: 'गायत्री मन्त्र' },
    deity: 'Savitri (Sun/Universal)',
    deityDay: 0,
    devanagari: `ॐ भूर्भुवः स्वः
तत्सवितुर्वरेण्यं
भर्गो देवस्य धीमहि
धियो यो नः प्रचोदयात्॥`,
    transliteration: `Om Bhur Bhuvah Svah
Tat Savitur Varenyam
Bhargo Devasya Dheemahi
Dhiyo Yo Nah Prachodayat`,
    meaning: `The Gayatri Mantra, revered as the essence of the Vedas, commences with the sacred syllable Om, representing the primordial sound of creation and the ultimate reality of Brahman. This is followed by the Mahavyahritis — Bhur, Bhuvah, Svah — which invoke the three planes of existence: the earthly realm (Bhur), the atmospheric or subtle realm (Bhuvah), and the celestial or causal realm (Svah). Together, they encapsulate the totality of creation, inviting the chanter to connect with the omnipresent divine.

The central invocation, "Tat Savitur Varenyam Bhargo Devasya Dheemahi," directs our contemplation towards Savitri, the divine impeller and vivifier. Savitri is not merely the physical sun (Surya) but the animating spiritual essence behind it, the source of all light, life, and consciousness. Vedic texts, particularly the Rig Veda (e.g., 5.81.2), describe Savitri as golden-handed, golden-tongued, and golden-eyed, illuminating the worlds and driving away darkness and evil. The term 'Varenyam' signifies 'most adorable' or 'worthy of worship,' highlighting Savitri's supreme status. 'Bhargo' refers to the divine effulgence or radiance, which is purifying and enlightening, dispelling ignorance. 'Devasya' denotes 'of the luminous deity,' reinforcing the divine nature of this light. 'Dheemahi' is the act of deep meditation or contemplation, signifying the devotee's earnest engagement with this divine principle.

The concluding phrase, "Dhiyo Yo Nah Prachodayat," is a profound prayer for intellectual and spiritual awakening. 'Dhiyo' refers to the intellect or discriminative wisdom (buddhi). The mantra implores the divine light of Savitri to 'Prachodayat' — to inspire, stimulate, and guide 'Nah' (our) intellects. This is a petition for clarity, insight, and the removal of ignorance, leading the devotee towards truth and righteousness. The Gayatri Mantra thus serves as a universal prayer for enlightenment, seeking divine guidance to illuminate the path of wisdom and righteous action.`,
    significance: `The Gayatri Mantra holds unparalleled significance in Hindu tradition, primarily due to its Vedic origins (Rig Veda 3.62.10) and its universal appeal. It is traditionally imparted during the Upanayana ceremony, marking the spiritual birth of a young Brahmin, and is considered the essence of all Vedic knowledge. Its recitation is deeply intertwined with Sandhyavandanam, the daily ritual performed at the three junctions of day and night—dawn, noon, and dusk. These times are considered potent for spiritual practice, aligning the individual's energy with the rising, zenith, and setting of the sun, symbolising the cycle of creation, preservation, and dissolution.

For optimal benefit, the mantra is typically chanted 108 times, a sacred number in Hinduism representing the totality of existence, often using a mala (rosary) of rudraksha or tulasi beads to maintain count and focus. While suitable for daily practice, its efficacy is believed to be intensified during specific astrological periods or festivals, such as during the Navaratri festival or on Sundays, which are dedicated to Surya (the Sun). Devotees turn to the Gayatri Mantra for a myriad of life situations: to enhance intellect and memory, to purify the mind and body from negative karma, to gain spiritual insight, and to seek protection from adversities. It is believed to dispel ignorance (avidya) and foster discriminative wisdom (buddhi).

Prior to recitation, physical and mental purification is highly recommended, typically involving a bath (snana) and a calm, focused mind, often preceded by pranayama. Though addressed to Savitri, the creative power of the Sun, the Gayatri Mantra is considered a universal prayer to the Supreme Being, transcending specific deity forms. It complements the primary mantras of various deities by providing a foundational spiritual purification and intellectual clarity, making the devotee more receptive to other divine energies. Its inclusive nature means it is accessible to all, regardless of caste, gender, or sectarian affiliation, fostering a profound connection to the divine source of all light and wisdom.`,
  },
  {
    slug: 'mahamrityunjaya-mantra',
    type: 'mantra',
    title: { en: 'Mahamrityunjaya Mantra', hi: 'महामृत्युञ्जय मन्त्र' },
    deity: 'Shiva',
    deityDay: 1,
    devanagari: `ॐ त्र्यम्बकं यजामहे
सुगन्धिं पुष्टिवर्धनम्।
उर्वारुकमिव बन्धनान्
मृत्योर्मुक्षीय मामृतात्॥`,
    transliteration: `Om Tryambakam Yajamahe
Sugandhim Pushti-vardhanam
Urvarukam-iva Bandhanat
Mrityor-mukshiya Maamritat`,
    meaning: `The Mahamrityunjaya Mantra, a profound Vedic invocation from the Rig Veda (7.59.12), is dedicated to Lord Shiva, the cosmic dissolver and regenerator. The mantra begins with "Om," the primordial sound, representing the entirety of creation, sustenance, and dissolution. It then addresses Shiva as "Tryambakam," the three-eyed one, a key iconographic feature symbolising his ability to see past, present, and future, and his mastery over the three gunas (Sattva, Rajas, Tamas). His third eye, the eye of wisdom, is often associated with his destructive power, but here it signifies profound insight and protection, aligning with his role as the ultimate benefactor.

The mantra continues, "Yajamahe Sugandhim Pushti-vardhanam," expressing devotion to Shiva who is "fragrant" and "nourishes all beings." "Sugandhim" alludes to Shiva's divine aura and purity, a spiritual fragrance that permeates the cosmos, attracting devotees. "Pushti-vardhanam" highlights his role as the sustainer and bestower of growth, health, and prosperity, not just physically but spiritually. This aspect of Shiva is often overlooked in favour of his destructive epithets, yet it is central to his benevolent nature as Pashupati, the protector of all creatures.

The concluding lines, "Urvarukam-iva Bandhanat Mrityor-mukshiya Maamritat," form the core prayer for liberation. The analogy of the "urvarukam" (cucumber or melon) detaching effortlessly from its vine illustrates the desired state of detachment from worldly attachments and the cycle of birth and death. The prayer is for liberation "from death" (Mrityor-mukshiya), seeking release from the fear of mortality and the bondage of samsara. Crucially, it concludes with "Maamritat," meaning "not from immortality." This is not a plea to escape death in its natural course, but rather to attain spiritual immortality, the eternal state of union with the divine, free from suffering and rebirth, while still fulfilling one's dharma in this life. It is a prayer for a conscious transition, not an avoidance of the inevitable, aligning with Shiva's role as the ultimate liberator.`,
    significance: `The Mahamrityunjaya Mantra, also revered as the Mrita Sanjivani Mantra, holds immense spiritual potency within Hindu traditions, particularly for its association with healing, protection, and longevity. Originating from the Rig Veda, its recitation is prescribed for various life situations where one seeks divine intervention or spiritual fortitude. Devotees traditionally chant this mantra 108 times, a sacred number in Hinduism representing cosmic completeness, or even 1008 times for intensified effect, often using a rudraksha mala to maintain count and enhance focus.

The mantra is especially potent when chanted on Mondays, the day traditionally dedicated to Lord Shiva. Festivals like Maha Shivaratri provide an auspicious window for its recitation, where the collective spiritual energy amplifies its benefits. Individuals turn to this mantra during critical junctures: to alleviate fear of death, to seek recovery from severe illnesses, to protect against accidents and calamities, and to promote overall well-being and spiritual growth. It is also commonly chanted during funerary rites, not to prevent physical death, but to ensure a peaceful transition for the departed soul and to comfort the bereaved.

Before recitation, purification of body and mind is recommended, typically involving a bath and a quiet, clean space, fostering a state of reverence. While Om Namah Shivaya is considered the primary mantra for general devotion to Shiva, the Mahamrityunjaya Mantra serves a specific, potent purpose as a prayer for health, vitality, and liberation from the cycle of rebirth. It complements the primary mantra by focusing on Shiva's aspect as the conqueror of death (Mrityunjaya) and bestower of life (Sanjivani). In some regional traditions, particularly in parts of South India and among Shaiva Siddhanta followers, its daily recitation is a core spiritual practice for maintaining physical and mental equilibrium and preparing for a conscious departure from the physical body.`,
  },
  {
    slug: 'surya-beej-mantra',
    type: 'mantra',
    title: { en: 'Surya Beej Mantra', hi: 'सूर्य बीज मन्त्र' },
    deity: 'Surya',
    deityDay: 0,
    devanagari: `ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः`,
    transliteration: `Om Hraam Hreem Hraum Sah Suryaya Namaha`,
    meaning: `The Surya Beej Mantra, "Om Hraam Hreem Hraum Sah Suryaya Namaha," is a potent invocation dedicated to Surya, the solar deity and one of the Navagrahas. The mantra commences with 'Om', the Pranava, the primordial sound from which all creation emanates, representing the ultimate reality of Brahman. It sets a sacred vibrational field for the subsequent syllables.

Following 'Om' are the three Bija (seed) syllables: 'Hraam', 'Hreem', and 'Hraum'. These are not literally translatable but are sonic representations of Surya's multifaceted energy. 'Hraam' is often associated with the creative and expansive power of the Sun, embodying its radiant heat and light. 'Hreem' is a powerful Shakti Bija, invoking the Sun's dynamic energy, its capacity to illuminate and purify, and its role as a life-giver. 'Hraum' further intensifies this invocation, connecting to the Sun's transformative and sustaining power. Together, these Bija mantras encapsulate the essence of Surya as the source of vitality, consciousness, and illumination.

The syllable 'Sah' acts as a bridge, connecting these potent seed sounds to the deity, signifying "that essence" or "He." 'Suryaya' is the dative form of Surya, meaning "to Surya" or "for the Sun God," explicitly directing the invocation. Surya, the celestial charioteer, is depicted riding a chariot drawn by seven horses, symbolising the seven colours of light and the seven days of the week, driven by Arun, the dawn. He holds two lotus flowers, emblems of purity and spiritual awakening. The mantra concludes with 'Namaha', a gesture of humble obeisance and salutation, affirming devotion and surrender to the Sun God, who represents the soul (Atman), intellect, health, and authority in Vedic cosmology.`,
    significance: `The Surya Beej Mantra is a foundational practice in Vedic astrology and spiritual sadhana, primarily recited to strengthen the influence of Surya (the Sun) in one's natal chart and life. As a karmic actor, Surya governs the soul, ego, vitality, leadership, father, government, and overall health. A well-placed or strengthened Surya bestows confidence, authority, good health, and success, while an afflicted Surya can lead to issues with self-esteem, health problems (especially heart and eyes), strained relationships with father figures, and difficulties in career or public life.

The most auspicious time for chanting this mantra is during the Brahma Muhurta (approximately 90 minutes before sunrise) or at sunrise on Sundays, which is Surya's designated day. Devotees typically perform japa using a rosary (mala) of 108 beads, often made of ruby, sphatik (quartz), or rudraksha. A minimum of 108 repetitions is recommended, with higher counts like 1,008 or 10,008 for more profound effects, especially during specific astrological periods (dashas or antardashas) of Surya. Prior purification through a bath and wearing clean clothes is customary, facing east towards the rising sun.

Recitation of this Beej Mantra is particularly beneficial for mitigating the adverse effects of a debilitated or unfavourably aspected Surya in the birth chart, helping to balance its karmic implications. It is also chanted to enhance positive solar energies, promoting robust health, clarity of mind, leadership qualities, and spiritual insight. While this Beej Mantra is a complete practice in itself, it can also complement longer, more elaborate Surya mantras like the Aditya Hrudayam or Surya Gayatri, acting as a potent energetic core that amplifies their efficacy. It is a widely accepted practice across various Hindu traditions, particularly among followers of Jyotish and those seeking general well-being and spiritual upliftment.`,
  },
  {
    slug: 'chandra-beej-mantra',
    type: 'mantra',
    title: { en: 'Chandra Beej Mantra', hi: 'चन्द्र बीज मन्त्र' },
    deity: 'Chandra',
    deityDay: 1,
    devanagari: `ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः`,
    transliteration: `Om Shraam Shreem Shraum Sah Chandraya Namaha`,
    meaning: `The Chandra Beej Mantra, "Om Shraam Shreem Shraum Sah Chandraya Namaha," is a potent invocation dedicated to Chandra, the celestial deity embodying the Moon. The mantra commences with "Om," the primordial sound, representing the universal consciousness and the source of all creation, setting a sacred vibrational tone. Following this are the bija (seed) syllables "Shraam," "Shreem," and "Shraum." These are not words with literal dictionary meanings but are concentrated sonic forms that encapsulate the essence and energy of Chandra. "Shraam" is the primary lunar bija, resonating with the Moon's cooling and nourishing qualities. "Shreem," while also a bija for Lakshmi, aligns with Chandra's influence on beauty, emotional prosperity, and the gentle, nurturing aspects of the feminine principle. "Shraum" further amplifies these lunar vibrations, creating a powerful resonance with the lunar deity.

The term "Sah" acts as a bridge, connecting these potent seed sounds to the deity, implying "that essence" or "He." "Chandraya" is the dative form of Chandra, meaning "to the Moon" or "for Chandra," directing the salutations specifically to this graha. Finally, "Namaha" signifies obeisance and reverence, completing the act of surrender and devotion. Chandra, often depicted with a fair complexion, two-armed, holding a lotus or a club, rides a chariot drawn by ten white horses or an antelope. He is the husband of the twenty-seven Nakshatras, daughters of Daksha Prajapati, and is famously associated with the Samudra Manthan, where he emerged as one of the fourteen jewels. As the presiding deity of the mind (Manas Karaka), emotions, intuition, and the mother, this mantra invokes his gentle, nurturing, and stabilising energies, seeking to harmonise the emotional and mental faculties.`,
    significance: `The recitation of the Chandra Beej Mantra is a profound practice for those seeking to harmonise and strengthen the lunar influences in their lives, particularly as understood through classical Vedic astrology (Jyotish). The Moon, or Chandra, governs the mind, emotions, intuition, mother, nourishment, and general well-being. A weak or afflicted Chandra in one's natal chart can manifest as emotional instability, mental distress, anxiety, poor relationship with the mother, lack of peace, and health issues related to bodily fluids or cold-related ailments. Chanting this mantra helps to mitigate such doshas and enhance the benefic aspects of Chandra.

For optimal efficacy, the mantra is traditionally recited on Mondays, the day sacred to Chandra, ideally during the waxing phase of the Moon or on Purnima (full moon) nights. The recommended count for japa is often 108 times, 1008 times, or multiples thereof, using a mala made of white sandalwood or crystal beads to amplify the lunar energies. Prior purification through a bath and wearing clean, light-coloured clothing is advised, along with sitting on a clean asana (mat) in a peaceful environment. This mantra is a potent tool for cultivating emotional balance, mental clarity, inner peace, and fostering positive relationships, especially with the maternal figure. It can be recited as a standalone practice or as a complementary invocation alongside longer Chandra stotras or the Chandra Gayatri Mantra, deepening one's connection to the nurturing lunar principle and inviting its calming influence into one's life.`,
  },
  {
    slug: 'mangal-beej-mantra',
    type: 'mantra',
    title: { en: 'Mangal Beej Mantra', hi: 'मंगल बीज मन्त्र' },
    deity: 'Mangal (Mars)',
    deityDay: 2,
    devanagari: `ॐ क्रां क्रीं क्रौं सः भौमाय नमः`,
    transliteration: `Om Kraam Kreem Kraum Sah Bhaumaya Namaha`,
    meaning: `The Mangal Beej Mantra, "Om Kraam Kreem Kraum Sah Bhaumaya Namaha," is a potent invocation to the planetary deity Mangal, known in Vedic astrology as Mars. The mantra commences with "Om," the sacred Pranava, representing the unmanifested and manifest Brahman, the primordial sound from which all creation emanates. It sets a foundational resonance for the subsequent syllables. Following this are the bija (seed) syllables "Kraam, Kreem, Kraum." These are not literally translatable but are vibrational essences embodying the core energy of Mangal. The 'K' sound often signifies creation and power, while 'R' is associated with fire, energy, and transformation, reflecting Mangal's fiery and dynamic nature. The varying vowels (aa, ee, au) denote different facets or intensities of this energy, aiming to activate and channel the specific vibrational frequency of the planet.

The syllable "Sah" acts as a mystical connector, often implying an offering or the essence of "that" divine energy, linking the practitioner's consciousness to the cosmic force of Mangal. "Bhaumaya" directly addresses the deity, meaning "to Bhauma," a significant name for Mangal derived from "Bhumi," the Earth. This appellation highlights Mangal's origin as the son of the Earth, associating him with land, property, and physical vitality. Puranic accounts often describe Mangal's birth from the sweat of Shiva or from the Earth itself, after Vishnu's Varaha incarnation, underscoring his connection to creation and the physical realm. Iconographically, Mangal is depicted with a red complexion, four arms holding a trident, mace, lotus, and spear, riding a ram (Mesha), symbolising his martial prowess, courage, and leadership. The mantra concludes with "Namaha," a reverent salutation, expressing humility and surrender to the deity, thereby seeking his benevolent influence. This mantra, therefore, is a complete vibrational offering to invoke and align with the powerful, protective, and energetic qualities of Mangal.`,
    significance: `The Mangal Beej Mantra holds profound significance in Vedic astrology (Jyotish) as a powerful remedial measure for balancing the influence of Mangal (Mars) in an individual's natal chart. Mangal, a karmic actor, governs courage, determination, energy, passion, land, siblings, and the physical body, particularly blood and bone marrow. However, an afflicted or weak Mangal can manifest as anger, impulsiveness, aggression, accidents, property disputes, delays in marriage (Mangal Dosha), or health issues. Recitation of this mantra is primarily recommended on Tuesdays, the day consecrated to Mangal, to harness its specific planetary energies.

For optimal effect, the mantra should be chanted after purification, preferably in the morning, facing the south direction which is associated with Mangal. A mala (rosary) of 108 beads, ideally made of Rudraksha, red sandalwood, or coral, is used to keep count. The recommended minimum count for daily practice is 108 repetitions, though for significant astrological remedies, an astrologer might prescribe higher counts, such as 10,000, 19,000, or even 40,000 repetitions over a specific period (e.g., 40 days). This practice is particularly potent during the Mangal Dasha or Antardasha periods, or during specific tithis and nakshatras associated with Mars. It complements primary Mangal mantras like the Mangala Stotram or other Puranic verses by providing a condensed, potent vibrational essence. Devotees turn to this mantra to mitigate the malefic effects of Mangal Dosha, foster courage, overcome obstacles, resolve property-related issues, and promote overall physical and mental well-being, transforming potential challenges into opportunities for growth and resilience.`,
  },
  {
    slug: 'budha-beej-mantra',
    type: 'mantra',
    title: { en: 'Budha Beej Mantra', hi: 'बुध बीज मन्त्र' },
    deity: 'Budha (Mercury)',
    deityDay: 3,
    devanagari: `ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः`,
    transliteration: `Om Braam Breem Braum Sah Budhaya Namaha`,
    meaning: `The Budha Beej Mantra, "Om Braam Breem Braum Sah Budhaya Namaha," is a potent sonic invocation dedicated to Budha, the planetary deity associated with Mercury. The opening syllable, 'Om,' is the Pranava, the primordial sound from which all creation emanates, signifying the ultimate reality and serving as an auspicious beginning to any sacred utterance.

'Braam,' 'Breem,' and 'Braum' are the Bija (seed) syllables for Budha. Bija mantras are not etymologically derived words but rather condensed sonic forms, believed to encapsulate the essence and power of a deity. For Budha, these sounds resonate with the qualities of intellect, discrimination, communication, and adaptability. Budha, often depicted as youthful and green-hued, is the son of Chandra (the Moon) and Tara, the wife of Brihaspati (Jupiter). He is typically shown with four arms, holding a sword, shield, mace, and bestowing boons (varada mudra), riding a lion or a winged lion as his vahana. He governs the North direction and is the karaka (significator) of speech, logic, education, writing, commerce, and the nervous system. The syllable 'Sah' acts as a connective essence, linking the potent Bija sounds to the deity, implying the manifestation or inherent power. 'Budhaya' is the dative form of Budha, meaning 'to Budha,' directing the invocation to the deity. The mantra concludes with 'Namaha,' signifying salutations and reverence, expressing devotion and surrender to the divine intelligence embodied by Budha.`,
    significance: `The recitation of the Budha Beej Mantra is primarily undertaken to propitiate and strengthen the planet Budha (Mercury) in one's natal chart, as per classical Vedic astrology (Jyotish). A well-placed and strong Budha bestows sharp intellect, articulate speech, analytical prowess, strong memory, success in education and business, and adaptability. Conversely, an afflicted or weak Budha can lead to challenges in communication, learning difficulties, nervous disorders, skin ailments, indecisiveness, and issues in commerce.

This mantra is particularly efficacious when chanted on Wednesdays (Budhavara), Budha's designated day, ideally during the Budha Hora or in the morning hours. Devotees typically perform japa using a mala of 108 beads, such as Tulasi or Rudraksha, for a prescribed number of repetitions. For significant remediation of Budha Dosha (affliction), a minimum of 108 repetitions daily is recommended, with a full Purushcharana (completion of 125,000 repetitions) often prescribed for severe planetary challenges. Prior to recitation, purification through bathing and wearing clean clothes is advised, with the practitioner facing North or East. Students, writers, public speakers, business professionals, and those experiencing communication difficulties or mental anxieties often turn to this mantra. It serves as a powerful complement to other Budha mantras, such as the Budha Gayatri, enhancing their overall efficacy by invoking the core energetic essence of the planet. While not tied to specific festivals, sustained practice during periods like Mercury retrograde is believed to mitigate its challenging influences, offering mental clarity and stability.`,
  },
  {
    slug: 'guru-beej-mantra',
    type: 'mantra',
    title: { en: 'Guru Beej Mantra', hi: 'गुरु बीज मन्त्र' },
    deity: 'Guru (Jupiter)',
    deityDay: 4,
    devanagari: `ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः`,
    transliteration: `Om Graam Greem Graum Sah Gurave Namaha`,
    meaning: `The Guru Beej Mantra, "Om Graam Greem Graum Sah Gurave Namaha," is a potent invocation dedicated to Brihaspati, the revered preceptor of the Devas and the astrological planet Jupiter. The mantra commences with "Om," the sacred pranava, representing the cosmic sound of creation, sustenance, and dissolution, embodying the ultimate reality from which all forms and vibrations emanate. Following this are the Bija (seed) syllables "Graam," "Greem," and "Graum." These are not literally translatable but are powerful sonic essences encapsulating the multifaceted energies of Jupiter. "Graam" resonates with Jupiter's expansive and creative force, "Greem" with its nurturing and sustaining wisdom, and "Graum" with its transformative and enlightening power. Together, they invoke the complete spectrum of Brihaspati's benevolent influence.

The syllable "Sah" acts as a mystical bridge, signifying the essence or inherent power, connecting the chanter directly to the core energy of the Graha. "Gurave" is the dative form of Guru, meaning "to Guru" or "to Jupiter." Brihaspati, depicted with a golden complexion, four arms holding a staff, lotus, rosary, and sacred text, riding a golden chariot, symbolises divine wisdom, dharma, prosperity, and higher knowledge. He is the celestial teacher, guiding the Devas through cosmic challenges, as recounted in various Puranas. The mantra concludes with "Namaha," expressing profound reverence, salutations, and surrender to this divine preceptor, seeking his blessings for wisdom, spiritual growth, and auspiciousness.`,
    significance: `The Guru Beej Mantra holds profound significance in Vedic astrology (Jyotish) and Hindu devotional practices, serving as a powerful tool to harmonise and strengthen the influence of Brihaspati, the planet Jupiter. Recitation is particularly efficacious on Thursdays (Guruvar), Jupiter's designated day, ideally during the Brahma Muhurta (pre-dawn hours) or the Guru Hora (planetary hour) to maximise its benevolent effects. Devotees typically use a mala of 108 beads, often made of turmeric, sandalwood, or Rudraksha, to maintain count during japa.

This mantra is primarily recited to mitigate the adverse effects of an afflicted or debilitated Jupiter (Guru Dosha) in one's natal chart, which may manifest as challenges in education, finance, progeny, spiritual growth, or general fortune. By invoking Brihaspati's energy, the mantra helps to alleviate these karmic imbalances, fostering wisdom, prosperity, and righteous conduct. Conversely, even with a well-placed Jupiter, regular chanting amplifies its positive attributes, enhancing intellect, spiritual inclination, optimism, and overall auspiciousness. Devotees turn to this mantra for success in academic pursuits, financial stability, blessings for children, legal resolutions, and profound spiritual guidance. While 108 repetitions daily are common, dedicated practitioners may undertake Purascharana, involving 125,000 repetitions over a specific period. Prior purification through bathing and sitting in a clean space, facing north-east or east, is recommended. This Beej mantra, being a concentrated form, complements and strengthens longer primary mantras dedicated to Guru, acting as a foundational invocation to align with the cosmic teacher's benevolent grace.`,
  },
  {
    slug: 'shukra-beej-mantra',
    type: 'mantra',
    title: { en: 'Shukra Beej Mantra', hi: 'शुक्र बीज मन्त्र' },
    deity: 'Shukra (Venus)',
    deityDay: 5,
    devanagari: `ॐ द्रां द्रीं द्रौं सः शुक्राय नमः`,
    transliteration: `Om Draam Dreem Draum Sah Shukraya Namaha`,
    meaning: `The Shukra Beej Mantra, "Om Draam Dreem Draum Sah Shukraya Namaha," is a potent invocation dedicated to Shukra, the celestial preceptor of the Asuras and the planet Venus in Vedic astrology. The mantra commences with "Om," the pranava, the primordial sound from which all creation emanates, signifying the universal consciousness and the ultimate reality. Following this are the bija (seed) syllables "Draam, Dreem, Draum." These are not words with literal dictionary meanings but are sonic representations of Shukra's core energy. The 'Dra' sound is often associated with the act of giving or bestowing, while the varying vowel endings (aa, ee, au) are believed to activate different aspects of Shukra's cosmic influence, encompassing his creative, nurturing, and material potencies.

The syllable "Sah" acts as a mystical connector, often interpreted as "He" or "that essence," linking the abstract power of the bijas directly to the deity. "Shukraya" is the dative form of Shukra, meaning "to Shukra" or "for Shukra," explicitly naming the recipient of the invocation. The mantra concludes with "Namaha," signifying salutations, reverence, and surrender. Shukra, known as Ushanas, is the son of Bhrigu Rishi and is revered for his profound knowledge, particularly the Sanjivani Vidya, the science of reviving the dead, a power he famously used to restore fallen Asuras in their battles against the Devas. Iconographically, he is often depicted riding a white horse or a chariot drawn by eight horses, adorned in white garments, and holding a staff, lotus, rosary, and a pot of water, symbolising purity, knowledge, and prosperity. He governs aspects of beauty, love, relationships, luxury, arts, creativity, and material comforts, acting as a significant karaka (indicator) for these areas in an individual's life.`,
    significance: `Reciting the Shukra Beej Mantra holds profound significance in Vedic astrology and spiritual practice, primarily aimed at harmonising and strengthening the influence of Venus in one's life. As a benefic planet, Shukra governs areas such as relationships, marriage, wealth, luxury, beauty, arts, and sensual pleasures. An afflicted or weak Shukra in a natal chart, often indicated by relationship discord, financial instability, lack of comfort, or issues related to reproductive health and skin, can be mitigated through consistent japa of this mantra. Conversely, a strong Shukra can be further enhanced, leading to greater prosperity, harmonious relationships, artistic success, and overall well-being.

The most auspicious day for chanting this mantra is Friday (Shukravar), the day dedicated to Shukra. While any time is suitable, the Brahma Muhurta (approximately 90 minutes before sunrise) or during the Shukra Hora (planetary hour of Venus) are considered particularly potent. Devotees typically use a mala of 108 beads, preferably made of white sandalwood or crystal (Sphatik), to maintain count. A recommended minimum count for remedial purposes is 19,000 repetitions over a period, often completed within 40 days, though daily chanting of 1, 3, 5, or 11 rounds (malas) is also beneficial. Prior purification through bathing and wearing clean clothes, along with sitting on an asana facing East or North, enhances the efficacy of the practice. This mantra serves as a powerful complement to other Shukra mantras, such as the Puranic or Vedic Shukra Mantras, by providing a concentrated energetic core. It is understood that Shukra, like all Navagrahas, acts as a karmic agent, dispensing the fruits of past actions. Chanting this Beej Mantra helps align the individual with the positive flow of Shukra's energies, fostering an environment conducive to growth and harmony in the areas he governs.`,
  },
  {
    slug: 'shani-beej-mantra',
    type: 'mantra',
    title: { en: 'Shani Beej Mantra', hi: 'शनि बीज मन्त्र' },
    deity: 'Shani (Saturn)',
    deityDay: 6,
    devanagari: `ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः`,
    transliteration: `Om Praam Preem Praum Sah Shanaischaraya Namaha`,
    meaning: `The Shani Beej Mantra, "Om Praam Preem Praum Sah Shanaischaraya Namaha," is a potent invocation dedicated to the planetary deity Shani, representing the planet Saturn in Vedic astrology. The mantra commences with "Om," the pranava, the primordial sound from which all creation emanates, signifying the universal consciousness and the source of all mantras. Following this are the Bija (seed) syllables "Praam, Preem, Praum." These are considered the sonic essences of Shani, embodying his fundamental energies. While their precise etymology is esoteric, they are believed to resonate with Shani's attributes of discipline, austerity, and karmic justice. The syllable "Sah" often denotes an essence or 'that which is' and serves to connect the Bija sounds to the deity.

"Shanaischaraya" directly addresses Shani, meaning "the slow-moving one," a reference to Saturn's lengthy orbital period, which translates astrologically into its deliberate and long-lasting effects on an individual's life. Shani is depicted as dark-complexioned, riding a vulture or crow (his vahana), holding a trident, bow, arrow, and sometimes a sword or an axe, symbolising his capacity for both destruction and righteous judgment. He is the son of Surya (the Sun) and Chhaya (Shadow), and brother to Yama (the god of death) and Yamuna. His Puranic narratives often highlight his stern nature, his role in delivering the fruits of karma, and his association with asceticism and detachment. The mantra concludes with "Namaha," a reverential salutation, signifying surrender and devotion to Shani, acknowledging his supreme authority in dispensing karmic lessons.`,
    significance: `The Shani Beej Mantra is a foundational practice in Vedic astrology (Jyotish) for propitiating the planet Saturn, particularly when its influence is deemed challenging in a natal chart. This mantra is especially recommended during periods such as Sade Sati (the 7.5-year transit of Saturn over the natal Moon), Shani Mahadasha (the major planetary period of Saturn), or Dhaiyya (shorter Saturn transits). Recitation aims to mitigate adverse effects, foster resilience, and align the individual with the constructive aspects of Shani's energy, which include discipline, longevity, profound wisdom, and the capacity for sustained effort.

For optimal efficacy, the mantra is traditionally chanted on Saturdays, the day ruled by Shani, ideally during the Brahma Muhurta (pre-dawn hours) or in the evening after sunset. A mala of 108 beads, preferably made of black tourmaline, rudraksha, or black onyx, is used for counting repetitions. The prescribed count for a full mantra sadhana (spiritual practice) is often 23,000 repetitions, to be completed within a specific timeframe, or 108 repetitions daily as a regular practice. Before commencing, one should purify the body and mind, perhaps with a bath, and sit facing west. While this Beej mantra is powerful on its own, it complements other Shani mantras, such as the Shani Moola Mantra or Gayatri Mantra, by providing the core energetic vibration. Devotees often combine japa with charitable acts, particularly feeding the poor or crows, and offering mustard oil to Shani, especially on Saturdays, as these actions are believed to appease the deity and balance karmic debts.`,
  },
  {
    slug: 'rahu-beej-mantra',
    type: 'mantra',
    title: { en: 'Rahu Beej Mantra', hi: 'राहु बीज मन्त्र' },
    deity: 'Rahu',
    deityDay: 6,
    devanagari: `ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः`,
    transliteration: `Om Bhraam Bhreem Bhraum Sah Rahave Namaha`,
    meaning: `The Rahu Beej Mantra, "Om Bhraam Bhreem Bhraum Sah Rahave Namaha," is a potent invocation dedicated to Rahu, the North Node of the Moon, a significant Chhaya Graha (shadow planet) in Vedic astrology. The mantra commences with "Om," the primordial sound representing the universal consciousness and the essence of Brahman. This sacred syllable prepares the mind for deep meditation and connects the chanter to the cosmic vibration.

Following "Om" are the bija (seed) syllables "Bhraam, Bhreem, Bhraum." These sounds are considered the sonic embodiment of Rahu's unique energy and characteristics. In Vedic tradition, bija mantras are condensed forms of divine power, carrying the essence of the deity or planetary force. For Rahu, these specific sounds resonate with his complex nature, which encompasses ambition, illusion, insatiable desires, unconventional paths, and sudden, transformative events. Rahu, born from the Samudra Manthan (churning of the cosmic ocean) when he illicitly partook of the Amrita, represents the severed head of the asura Svarbhanu. This origin story highlights his eternal hunger and his role in creating eclipses, symbolising periods of obscured clarity and karmic reckoning.

The term "Sah" signifies "that essence" or "the very being," affirming the direct connection to Rahu's fundamental nature. "Rahave" is the dative form of Rahu, meaning "to Rahu," indicating the recipient of the salutation. The mantra concludes with "Namaha," a reverent bow or salutation, expressing humility and surrender to the planetary deity. Thus, the mantra collectively translates to "Om, I bow to Rahu, whose essence is embodied in the seed sounds Bhraam, Bhreem, Bhraum." It is a powerful tool to connect with Rahu's energy, seeking to understand and harmonise with his complex karmic influences rather than merely placating a malefic force.`,
    significance: `Recitation of the Rahu Beej Mantra holds profound significance within Jyotish and Hindu devotional practices, primarily aimed at harmonising the complex influences of Rahu in one's life. This mantra is particularly potent for individuals experiencing challenging periods under Rahu Dasha or Antardasha, or those whose natal charts indicate an afflicted Rahu, leading to confusion, unfulfilled desires, sudden obstacles, or a sense of being adrift. Chanting helps to mitigate the adverse effects, transforming potential misfortunes into opportunities for growth and spiritual insight.

The ideal time for japa (repetition) is often during Rahu Kaal, a specific inauspicious period each day, or during the night, particularly on Saturdays, which are associated with Rahu's co-ruler, Shani. A traditional count involves 108 repetitions using a Rudraksha mala, or for deeper remediation, 18,000 or 108,000 repetitions over a prescribed period, often under the guidance of a knowledgeable Jyotishi. Prior purification, including a ritual bath and wearing clean clothes, is recommended to prepare the body and mind for the spiritual practice. Devotees often face the South-West direction, Rahu's designated quarter, during recitation.

Beyond mitigating negative influences, regular chanting can enhance Rahu's positive attributes, such as intuition, innovation, success in foreign endeavours, and a keen understanding of unconventional subjects. It helps one navigate the illusions (maya) of the material world and channel intense desires constructively. While this bija mantra is a complete practice in itself, it often complements longer Rahu mantras, stotrams, or homams, serving as a foundational practice that strengthens the overall spiritual connection to this karmic actor. It is not about eliminating Rahu's influence, but rather understanding and integrating his lessons for spiritual evolution.`,
  },
  {
    slug: 'ketu-beej-mantra',
    type: 'mantra',
    title: { en: 'Ketu Beej Mantra', hi: 'केतु बीज मन्त्र' },
    deity: 'Ketu',
    deityDay: 2,
    devanagari: `ॐ स्रां स्रीं स्रौं सः केतवे नमः`,
    transliteration: `Om Sraam Sreem Sraum Sah Ketave Namaha`,
    meaning: `The Ketu Beej Mantra, "Om Sraam Sreem Sraum Sah Ketave Namaha," is a potent invocation to Ketu, the South Node of the Moon, a significant chhaya graha in Vedic astrology. The mantra commences with "Om," the pranava, the primordial sound from which all creation emanates, signifying the universal consciousness and serving as a foundational invocation. Following this are the bija (seed) syllables "Sraam, Sreem, Sraum." These are specific sonic vibrations associated with Ketu, believed to encapsulate its essence and energy. Bija mantras are considered the most condensed forms of a deity's power, capable of awakening specific spiritual energies within the practitioner. While their etymology is not always linguistically derived, they are understood as vibrational keys.

"Sah" is a mystical syllable, often interpreted as 'that' or 'essence,' linking the preceding bija sounds to the deity. "Ketave" is the dative form of Ketu, meaning "to Ketu," directing the invocation specifically to this planetary influence. Ketu, often depicted as the headless body of a serpent, rides a vulture or holds a flag. Its origin is famously recounted in the Bhagavata Purana during the Samudra Manthan, where Vishnu, in his Mohini form, severed the head of the asura Svarbhanu. The head became Rahu, and the body, Ketu. Ketu represents detachment, liberation (moksha), spirituality, past karma, sudden events, and the dissolution of material attachments. It is a karaka (significator) of spiritual insight and renunciation. The mantra concludes with "Namaha," meaning "salutations" or "I bow," expressing reverence and surrender to Ketu's cosmic influence. Thus, the mantra collectively translates to "Om, I offer salutations to Ketu, embodying the essence of its seed sounds."`,
    significance: `Recitation of the Ketu Beej Mantra is a profound practice in Jyotish, primarily undertaken to harmonise the energies of Ketu in one's natal chart. This mantra is particularly recommended for individuals experiencing the planetary period (Dasha) or sub-period (Antardasha) of Ketu, or when Ketu is unfavourably placed, debilitated, or afflicted by malefic planets, leading to confusion, anxiety, spiritual stagnation, or unexpected losses. While Ketu is not inherently malevolent, it acts as a karmic agent, bringing forth the results of past actions, often through experiences of detachment and spiritual awakening. Chanting this mantra helps to mitigate the challenging effects of an afflicted Ketu and enhance its positive attributes, such as spiritual insight, intuition, and the pursuit of liberation (moksha).

The ideal time for japa (repetition) is during the Ketu Hora, or on Tuesdays or Saturdays, which are traditionally associated with malefic planets and thus suitable for their pacification. Early morning (Brahma Muhurta) or after sunset are also considered auspicious. A minimum of 108 repetitions, using a Rudraksha mala, is prescribed for daily practice, though 1008 repetitions are often recommended for significant astrological remediation. Prior purification through bathing and wearing clean clothes, along with sitting on a clean mat in a quiet space, enhances the efficacy of the practice. This Beej Mantra serves as a potent, concentrated form of worship, complementing other Ketu mantras, such as the Puranic Ketu Mantra, by directly invoking the planet's core energy. It is not merely about averting misfortune but about aligning with Ketu's deeper spiritual purpose, fostering introspection, and facilitating spiritual growth.`,
  },
  {
    slug: 'ganesh-mantra',
    type: 'mantra',
    title: { en: 'Ganesh Mantra', hi: 'गणेश मन्त्र' },
    deity: 'Ganesha',
    deityDay: 3,
    devanagari: `ॐ गं गणपतये नमः

वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥`,
    transliteration: `Om Gam Ganapataye Namaha

Vakratunda Mahakaya Suryakoti Samaprabha.
Nirvighnam Kuru Me Deva Sarva-Kaaryeshu Sarvada.`,
    meaning: `The Ganesh Mantra presented here comprises two distinct yet complementary invocations to Lord Ganesha, the revered remover of obstacles and bestower of wisdom. The initial part, "Om Gam Ganapataye Namaha," is a potent Bija (seed) mantra. "Om" represents the primordial sound, the universal vibration from which all creation emanates. "Gam" is the specific Bija sound associated with Ganesha, believed to encapsulate his entire energetic essence. Its vibration is said to activate the Muladhara chakra, grounding the practitioner and fostering stability. "Ganapataye" means 'to Ganapati,' another name for Ganesha, signifying 'Lord of the Ganas' – the celestial attendants of Shiva. "Namaha" conveys salutations and reverence. This short mantra is a direct and powerful invocation of Ganesha's presence and blessings.

The second part, the Vakratunda Mahakaya Shloka, elaborates on Ganesha's iconic form and function. "Vakratunda Mahakaya" describes his distinctive appearance: "Vakratunda" refers to his curved trunk, symbolising his ability to discern and navigate life's complexities, while "Mahakaya" denotes his massive body, representing the entire cosmos and his all-encompassing nature. "Suryakoti Samaprabha" likens his brilliance to that of a million suns, illustrating his divine effulgence, knowledge, and power to dispel ignorance. The concluding prayer, "Nirvighnam Kuru Me Deva Sarva-Kaaryeshu Sarvada," is a heartfelt plea: "O Lord, please make all my endeavours free from obstacles, always." This shloka encapsulates Ganesha's primary role as Vighnaharta, the remover of impediments, ensuring smooth progression in all undertakings, whether spiritual or material. Together, these verses invoke Ganesha's divine attributes for protection, success, and spiritual clarity.`,
    significance: `The Ganesh Mantra, particularly "Om Gam Ganapataye Namaha" and the Vakratunda Mahakaya Shloka, holds profound significance in Hindu devotional practice, serving as a foundational invocation for auspicious beginnings. It is traditionally recited before embarking on any new venture, be it a spiritual ritual (puja), a business endeavour, educational pursuits, travel, or even significant life events like marriage. This practice stems from Ganesha's role as Vighnaharta, the remover of obstacles, ensuring that all undertakings proceed without impediment and culminate in success.

Regular recitation, known as Japa, is often recommended 108 times daily, particularly on Wednesdays, which is traditionally associated with Lord Ganesha. The practice is intensified during the annual Ganesh Chaturthi festival, a ten-day celebration dedicated to his worship, when devotees engage in elaborate pujas and sustained mantra recitation. Before commencing Japa, practitioners typically observe purification rituals, such as bathing and maintaining a clean environment, to foster a state of inner and outer purity conducive to spiritual practice. A mala (rosary) of 108 beads is commonly used to keep count, aiding concentration. While this mantra is a complete invocation in itself, it also complements other primary mantras by setting an auspicious tone, clearing the path for deeper spiritual experiences and the successful completion of other devotional practices. Its widespread adoption across various Hindu traditions underscores its universal appeal and efficacy in inviting divine blessings for harmony, prosperity, and the removal of all hindrances.`,
  },
  {
    slug: 'lakshmi-mantra',
    type: 'mantra',
    title: { en: 'Lakshmi Mantra', hi: 'लक्ष्मी मन्त्र' },
    deity: 'Lakshmi',
    deityDay: 5,
    devanagari: `ॐ श्रीं महालक्ष्म्यै नमः

ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद
ॐ श्रीं ह्रीं श्रीं महालक्ष्म्यै नमः`,
    transliteration: `Om Shreem Mahalakshmyai Namaha

Om Shreem Hreem Shreem Kamale Kamalaalaye Praseeda Praseeda
Om Shreem Hreem Shreem Mahalakshmyai Namaha`,
    meaning: `The Lakshmi Mantra, particularly in its extended form, is a profound invocation of Mahalakshmi, the Hindu goddess of wealth, fortune, and prosperity. The mantra commences with "Om," the primordial sound, representing the entirety of cosmic existence and the ultimate reality of Brahman. Following this is "Shreem," the bija (seed) mantra of Lakshmi, embodying her essence of auspiciousness, beauty, abundance, and spiritual radiance. This sound is believed to resonate with the cosmic energy of prosperity, attracting all forms of wealth, not merely material, but also spiritual, intellectual, and emotional.

The inclusion of "Hreem," the Maya bija, signifies Lakshmi's inherent power as the divine creative energy (Shakti) that manifests the universe. It represents her ability to overcome obstacles and bestow blessings through her divine illusion and transformative power. The phrase "Kamale Kamalaalaye" directly addresses Lakshmi, identifying her as "O Lotus-born one, who dwells among lotuses." This imagery is central to her iconography, where she is often depicted seated upon a fully blossomed lotus, holding lotus buds in her hands, symbolising purity, spiritual growth, and detachment from worldly attachments despite being the source of material abundance. The lotus, rooted in mud but blooming unsullied, reflects the ideal state of a devotee.

The repeated plea "Praseeda Praseeda" translates to "Be pleased, be pleased," a heartfelt request for the goddess's grace, benevolence, and favourable disposition. It is an expression of devotion and surrender, seeking her blessings to manifest prosperity and auspiciousness in one's life. The mantra culminates with "Mahalakshmyai Namaha," offering salutations to the Great Lakshmi, acknowledging her supreme form and her role as the bestower of all forms of wealth and well-being. This mantra, therefore, is a comprehensive prayer for holistic prosperity, aligning the devotee with the divine energy of abundance and spiritual fulfilment.`,
    significance: `Recitation of the Lakshmi Mantra is a potent spiritual practice aimed at invoking the blessings of Mahalakshmi for all forms of prosperity and auspiciousness. The most recommended time for its japa (repetition) is during the Brahma Muhurta (pre-dawn hours) or in the evening, particularly on Fridays, which are traditionally dedicated to Goddess Lakshmi. Festivals like Diwali, Akshaya Tritiya, and Dhanteras are considered especially auspicious for intensifying this practice, as the cosmic energies associated with Lakshmi are believed to be at their peak during these periods.

Devotees turn to this mantra in various life situations, primarily to alleviate financial distress, attract material wealth, ensure success in business ventures, and foster overall well-being and harmony within the household. Beyond material gains, the mantra is also sought for spiritual abundance, mental peace, and the removal of obstacles (daridra nashana) that impede progress. A recommended count for daily japa is 108 repetitions, performed using a mala, preferably made of lotus seeds (kamal gatta) or tulasi beads, to maintain focus and amplify the mantra's vibrational energy.

Before recitation, purification is essential: a ritual bath, wearing clean clothes, and ensuring the puja space is clean and fragrant. Offering lotus flowers, lighting ghee lamps, and offering sweets are traditional ways to honour Lakshmi. This mantra, particularly the "Shreem" bija, is often considered a primary mantra for Lakshmi worship. It complements other devotional practices such as the recitation of the Sri Suktam, Lakshmi Ashtottarashatanama Stotram, or Vishnu Sahasranama, reinforcing the devotee's connection to the divine couple, Lakshmi and Vishnu. While universally revered, its practice is particularly prominent in Vaishnava traditions and among householders seeking domestic prosperity and spiritual upliftment.`,
  },
  {
    slug: 'saraswati-mantra',
    type: 'mantra',
    title: { en: 'Saraswati Mantra', hi: 'सरस्वती मन्त्र' },
    deity: 'Saraswati',
    deityDay: 4,
    devanagari: `ॐ ऐं सरस्वत्यै नमः

या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।
या ब्रह्माच्युतशंकरप्रभृतिभिर्देवैः सदा वन्दिता
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥`,
    transliteration: `Om Aim Saraswatyai Namaha

Ya Kundendu-tushaara-haara-dhavala Ya Shubhra-vastra-avrita
Ya Veena-vara-danda-mandita-kara Ya Shveta-padma-asana.
Ya Brahma-achyuta-Shankara-prabhritibhir Devaih sada vandita
Sa mam paatu Saraswati Bhagavati Nihshesha-jadya-apaha.`,
    meaning: `The invocation begins with "Om Aim Saraswatyai Namaha," a potent salutation to the Goddess Saraswati. "Om" represents the primordial sound, the unmanifest Brahman from which all creation emanates, signifying the ultimate reality and the source of all knowledge. "Aim" is the bija (seed) mantra specifically associated with Saraswati, embodying the essence of Vak (divine speech), knowledge (Vidya), and creative intelligence. Its resonance is believed to awaken the faculty of articulate expression and intellectual discernment. The phrase "Saraswatyai Namaha" offers reverential obeisance to Saraswati, the deity presiding over wisdom, arts, and learning.

The subsequent shloka, a widely cherished Saraswati Vandana, vividly describes her iconic form and attributes. She is depicted as "white as the jasmine, moon, and snow-garland," and "dressed in pure white garments," symbolising purity, tranquility, and the unblemished nature of true knowledge. Her hands are "adorned with the excellent Veena," a stringed instrument that represents the harmony of all creation, the vibration of sound (Nada Brahma), and the fine arts. The Veena also signifies the ability to tune one's intellect to higher truths. Seated on a "white lotus," she embodies spiritual transcendence and the blossoming of wisdom from the mire of ignorance.

The verse further affirms her supreme status, stating that she is "always worshipped by Brahma, Vishnu, Shankara, and the gods." This highlights her fundamental role in the cosmic order, as even the Trimurti acknowledge her dominion over knowledge and creation. The concluding plea, "may that Goddess Saraswati, who removes all forms of ignorance, protect me," encapsulates the devotee's aspiration for liberation from avidya (ignorance) and the attainment of enlightened understanding. This mantra, therefore, is a profound meditation on the source of all wisdom and a prayer for its manifestation within the practitioner.`,
    significance: `The Saraswati Mantra, particularly with the powerful "Aim" bija, holds profound significance for seekers of knowledge, artistic proficiency, and eloquent expression within Hindu traditions. Recitation of this mantra is considered especially efficacious on Thursdays, a day traditionally associated with Brihaspati (Jupiter), the guru of the devas and a planet governing wisdom and learning. The period around Vasant Panchami, which marks the advent of spring and is celebrated as Saraswati Puja, is considered a highly auspicious time for initiating or intensifying this practice, as it is believed to amplify the mantra's benefits.

Devotees turn to this mantra in various life situations: students before examinations, scholars embarking on research, artists seeking inspiration, and anyone desiring clarity of thought or improvement in communication skills. The recommended practice involves chanting the mantra 108 times daily, a number considered sacred in Hinduism, often using a mala (rosary) for counting. Prior to recitation, it is customary to observe purity, which may include a ritual bath and a calm, focused mind, to create a conducive environment for spiritual absorption.

This mantra serves as a primary invocation to Goddess Saraswati, complementing other spiritual practices by fostering intellectual and creative faculties. Its regular chanting is believed to remove "jadya" (ignorance or mental inertia), enhance memory, refine speech, and grant artistic inspiration. While universally revered, its prominence is particularly notable in educational institutions and among communities dedicated to arts and letters, where the Saraswati Vandana is frequently recited at the commencement of learning activities, reinforcing its role as a cornerstone for intellectual and creative pursuits across diverse regional and sectarian traditions.`,
  },
  {
    slug: 'navgraha-mantra',
    type: 'mantra',
    title: { en: 'Navgraha Mantra', hi: 'नवग्रह मन्त्र' },
    deity: 'Navagraha (Nine Planets)',
    devanagari: `ॐ सूर्याय नमः। ॐ चन्द्राय नमः।
ॐ मंगलाय नमः। ॐ बुधाय नमः।
ॐ बृहस्पतये नमः। ॐ शुक्राय नमः।
ॐ शनैश्चराय नमः। ॐ राहवे नमः।
ॐ केतवे नमः।

नवग्रह स्तोत्र:
जपाकुसुमसंकाशं काश्यपेयं महाद्युतिम्।
तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम्॥

दधिशंखतुषाराभं क्षीरोदार्णवसंभवम्।
नमामि शशिनं सोमं शम्भोर्मुकुटभूषणम्॥

धरणीगर्भसंभूतं विद्युत्कान्तिसमप्रभम्।
कुमारं शक्तिहस्तं च मंगलं प्रणमाम्यहम्॥

प्रियंगुकलिकाश्यामं रूपेणाप्रतिमं बुधम्।
सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम्॥

देवानां च ऋषीणां च गुरुं काञ्चनसन्निभम्।
बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम्॥

हिमकुन्दमृणालाभं दैत्यानां परमं गुरुम्।
सर्वशास्त्रप्रवक्तारं भार्गवं प्रणमाम्यहम्॥

नीलांजनसमाभासं रविपुत्रं यमाग्रजम्।
छायामार्तण्डसम्भूतं तं नमामि शनैश्चरम्॥

अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम्।
सिंहिकागर्भसम्भूतं तं राहुं प्रणमाम्यहम्॥

पलाशपुष्पसंकाशं तारकाग्रहमस्तकम्।
रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम्॥`,
    transliteration: `Om Suryaya Namaha. Om Chandraya Namaha.
Om Mangalaya Namaha. Om Budhaya Namaha.
Om Brihaspataye Namaha. Om Shukraya Namaha.
Om Shanaishcharaya Namaha. Om Rahave Namaha.
Om Ketave Namaha.

Navgraha Stotra:
Japa-kusuma-sankasham Kashyapeyam Maha-dyutim.
Tamo-arim sarva-papa-ghnam pranato-asmi Divakaram.

Dadhi-shankha-tusharabham Kshirodarnava-sambhavam.
Namami Shashinam Somam Shambhor-mukuta-bhooshanam.

Dharani-garbha-sambhutam vidyut-kanti-samaprabham.
Kumaram Shakti-hastam cha Mangalam pranamamy-aham.

Priyangu-kalika-shyamam rupena-apratimam Budham.
Saumyam saumya-guna-upetam tam Budham pranamamy-aham.

Devanam cha Rishinam cha Gurum Kanchana-sannibham.
Buddhi-bhutam trilokesham tam namami Brihaspatim.

Hima-kunda-mrinala-abham Daityanam paramam Gurum.
Sarva-shastra-pravaktaram Bhargavam pranamamy-aham.

Neelanjana-samabhasam Ravi-putram Yama-agrajam.
Chhaya-Martanda-sambhutam tam namami Shanaishcharam.

Ardha-kayam Maha-veeryam Chandra-Aditya-vimardanam.
Simhika-garbha-sambhutam tam Rahum pranamamy-aham.

Palasha-pushpa-sankasham Taraka-graha-mastakam.
Raudram raudra-atmakam ghoram tam Ketum pranamamy-aham.`,
    meaning: `The Navagraha Stotra is a profound devotional hymn that invokes and praises the nine celestial bodies, or grahas, central to Vedic astrology. These grahas are not merely planets but powerful cosmic influencers, personifications of divine energies that govern human destiny and karmic outcomes. The initial simple salutations, such as 'Om Suryaya Namaha,' serve as a direct reverence to each graha, acknowledging their presence and power.

The stotra then elaborates on each graha, beginning with Surya (the Sun), described as brilliant as a hibiscus flower, born of Kashyapa, dispelling darkness and destroying sins – an allusion to his role as the source of light, life, and dharma. Chandra (the Moon) is invoked as white as curd and conch, born from the mythical Ocean of Milk during the Samudra Manthan, and adorning Lord Shiva's crown, symbolising the mind, emotions, and nurturing aspects. Mangala (Mars), born from the Earth's womb (Dharani-garbha-sambhutam) and wielding a Shakti weapon, represents courage, energy, and protection. Budha (Mercury), dark as a priyangu bud and gentle, embodies intellect, communication, and discrimination.

Brihaspati (Jupiter), golden-hued and the guru of gods and sages, is revered as the embodiment of wisdom and lord of the three worlds, signifying knowledge, prosperity, and spiritual guidance. Shukra (Venus), white as snow and jasmine, is the supreme guru of the Daityas (demons) and an expounder of all scriptures, representing worldly pleasures, arts, and wealth. Shanaishchara (Saturn), dark as collyrium, is the son of Surya and Chhaya, and Yama's elder brother, symbolising discipline, karma, and longevity. Rahu, depicted as half-bodied and a tormentor of the Sun and Moon (referencing the eclipse myth), born from Simhika's womb, governs ambition, worldly desires, and illusion. Finally, Ketu, resembling palasha flowers and possessing a fierce nature, represents spirituality, liberation, and detachment, being the headless body of the demon Svarbhanu. Each verse encapsulates the essence, iconography, and mythological significance of these cosmic deities, offering a complete devotional tribute.`,
    significance: `The Navagraha Stotra holds immense significance in Hindu devotional practices and Vedic astrology, serving as a powerful means to propitiate and harmonise the influences of the nine grahas. These celestial bodies are considered karmic agents, reflecting the accumulated actions of individuals and influencing various aspects of life, including health, wealth, relationships, and spiritual growth. Recitation of this stotra is primarily undertaken to mitigate malefic planetary effects (graha doshas) indicated in one's natal chart (kundali) or to enhance the benefic influences of well-placed planets.

Devotees typically recite the Navagraha Stotra daily, especially after a morning bath, facing the East, to maintain overall planetary balance. It is a foundational prayer often performed at the commencement of significant Hindu rituals, such as weddings, housewarmings (griha pravesh), and yajnas, to ensure auspiciousness and remove obstacles. While a single recitation is beneficial, for specific planetary afflictions, devotees may undertake a more rigorous practice, reciting it three, nine, or even 108 times, often using a mala (rosary) for counting, though this stotra is generally recited as a hymn rather than a mantra with a specific count. While there isn't a strict 'weekday' for the entire stotra, focusing on a specific graha's verse on its designated weekday (e.g., Surya's verse on Sunday) can intensify its effect.

This stotra complements primary mantras dedicated to individual grahas, offering a holistic approach to planetary appeasement. It is particularly recommended during challenging planetary transits (Gochar) or Dasha periods. The practice is pan-Hindu, with regional variations in ritualistic offerings. Pilgrimage to Navagraha temples, such as those in Kumbakonam, Tamil Nadu, is also considered highly meritorious, reinforcing the stotra's spiritual efficacy in aligning oneself with cosmic energies and mitigating karmic burdens.`,
  },
];

// ─── COMBINED EXPORTS ───────────────────────────────────────────────────────

export const ALL_DEVOTIONAL_ITEMS: DevotionalItem[] = [
  ...AARTIS,
  ...CHALISAS,
  ...STOTRAMS,
  ...MANTRAS,
];

/** Get all items of a specific type */
export function getDevotionalItemsByType(type: DevotionalType): DevotionalItem[] {
  return ALL_DEVOTIONAL_ITEMS.filter(item => item.type === type);
}

/** Get a single item by type and slug */
export function getDevotionalItem(type: DevotionalType, slug: string): DevotionalItem | undefined {
  return ALL_DEVOTIONAL_ITEMS.find(item => item.type === type && item.slug === slug);
}

/** Get all items for a specific deity */
export function getDevotionalItemsByDeity(deity: string): DevotionalItem[] {
  return ALL_DEVOTIONAL_ITEMS.filter(item =>
    item.deity.toLowerCase().includes(deity.toLowerCase())
  );
}

/** Get all unique deities */
export function getAllDeities(): string[] {
  const deities = new Set(ALL_DEVOTIONAL_ITEMS.map(item => item.deity));
  return Array.from(deities).sort();
}

/** Get all slugs for a type  –  used for generateStaticParams */
export function getDevotionalSlugs(type: DevotionalType): string[] {
  return ALL_DEVOTIONAL_ITEMS
    .filter(item => item.type === type)
    .map(item => item.slug);
}

/** Type labels for display */
export const TYPE_LABELS: Record<DevotionalType, { en: string; hi: string }> = {
  aarti: { en: 'Aarti', hi: 'आरती' },
  chalisa: { en: 'Chalisa', hi: 'चालीसा' },
  stotram: { en: 'Stotram', hi: 'स्तोत्रम्' },
  mantra: { en: 'Mantra', hi: 'मन्त्र' },
};

/** Day names for "Best time to recite" */
export const DAY_NAMES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sunday', hi: 'रविवार' },
  1: { en: 'Monday', hi: 'सोमवार' },
  2: { en: 'Tuesday', hi: 'मंगलवार' },
  3: { en: 'Wednesday', hi: 'बुधवार' },
  4: { en: 'Thursday', hi: 'गुरुवार' },
  5: { en: 'Friday', hi: 'शुक्रवार' },
  6: { en: 'Saturday', hi: 'शनिवार' },
};
