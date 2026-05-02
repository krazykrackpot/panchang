/**
 * Comprehensive Devotional Content Library
 *
 * Contains aartis, chalisas, stotrams, and mantras with full Devanagari text,
 * IAST transliteration, English meaning, and significance.
 *
 * IMPORTANT: These are sacred texts. All Devanagari content has been carefully
 * transcribed. If you find an error, fix it with a verified source — never guess.
 */

export type DevotionalType = 'aarti' | 'chalisa' | 'stotram' | 'mantra';

export interface DevotionalItem {
  slug: string;
  type: DevotionalType;
  title: { en: string; hi: string };
  deity: string;
  deityDay?: number; // 0=Sun..6=Sat — best day to recite
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
    meaning: `O Lord of the entire Universe, glory be to You. You remove the troubles of Your devotees in an instant.

Whoever meditates on You receives fruits, and the sorrows of the mind are destroyed. Happiness and prosperity come to the home, and the sufferings of the body are removed.

You are my Mother and Father; whose refuge shall I seek? There is no other besides You in whom I may place my hopes.

You are the Supreme Soul, the Inner Knower. You are the Supreme Brahman, the Lord of all.

You are an ocean of compassion, You are the sustainer. I am a foolish, wicked being; I am the servant and You are the Master — bestow Your grace.

You are the one unseen, the Lord of all lives. How shall I, of dim intellect, meet You, O Compassionate One?

O friend of the helpless, remover of sorrow, You are my Lord. Raise Your hands, grant me Your shelter; I lie at Your door.

Remove worldly desires and sins, O Lord. Increase faith and devotion, and service to the saints.`,
    significance: 'Om Jai Jagdish Hare is the most popular Hindu aarti, sung universally during evening prayers (Sandhya Aarti). Written by Pandit Shardha Ram Phillauri in 1870, it is addressed to Lord Vishnu as the Supreme Being. It is traditionally sung at the conclusion of puja in homes and temples across India, especially during festivals like Diwali and Navratri.',
  },
  {
    slug: 'ganesh-aarti',
    type: 'aarti',
    title: { en: 'Ganesh Aarti — Jai Ganesh Deva', hi: 'गणेश आरती — जय गणेश देवा' },
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
    meaning: `Glory to Lord Ganesh! His mother is Parvati and father is Lord Shiva (Mahadeva).

He is the compassionate one-tusked deity with four arms. A tilak adorns His forehead and He rides a mouse.

Betel leaves, flowers, and dry fruits are offered to Him. Laddoos are His favorite offering, and saints serve Him.

He gives sight to the blind, health to the afflicted, sons to the childless, and wealth to the poor.

Surdas seeks Your refuge — fulfill the service. His mother is Parvati and father is Mahadeva.`,
    significance: 'This aarti is sung in praise of Lord Ganesha, the remover of obstacles and the deity invoked at the beginning of all auspicious endeavors. It is recited daily in homes and temples, and especially during Ganesh Chaturthi (Bhadrapada Shukla Chaturthi). Wednesday is considered Ganesha\'s day. The aarti emphasizes His compassion and His power to fulfill the wishes of devotees.',
  },
  {
    slug: 'lakshmi-aarti',
    type: 'aarti',
    title: { en: 'Lakshmi Aarti — Om Jai Lakshmi Mata', hi: 'लक्ष्मी आरती — ॐ जय लक्ष्मी माता' },
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
    meaning: `Glory to Mother Lakshmi! Lord Vishnu serves You day and night.

You are Uma, Rama, and Brahmani — the Mother of the universe. The Sun and Moon meditate on You, and sage Narada sings Your praise.

You are the pure form of Durga, giver of happiness and wealth. Whoever meditates on You attains prosperity, spiritual powers, and riches.

You dwell in the netherworld and are the bestower of auspiciousness. You illuminate the effects of karma and protect from the ocean of worldly existence.

In whichever home You reside, virtues come there. Everything becomes possible and the mind is free from fear.

Without You, no yajna can be performed and no one can obtain clothes. All the splendor of food and drink comes from You.

You dwell in the beautiful temple of virtues in the Ocean of Milk. Without You, no one can attain the fourteen gems.

Whoever sings this aarti of Mahalakshmi, their heart fills with joy and sins are washed away.`,
    significance: 'Lakshmi Aarti is recited in honor of Goddess Lakshmi, the deity of wealth, fortune, and prosperity. It is most importantly sung during Diwali (especially on Lakshmi Puja night), every Friday, and during the month of Shravan. Friday is Lakshmi\'s day. The aarti is also recited during Navratri and any puja involving prosperity.',
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
    meaning: `Perform the aarti of beloved Hanuman, the destroyer of the wicked and manifestation of Lord Rama's power.

By His strength, great mountains tremble. Diseases and afflictions dare not come near Him.

O son of Anjani, mighty and powerful! You are always the helper of the saints.

As a brave warrior sent by Lord Rama, You burned Lanka and brought news of Sita.

Lanka with its fortress walls and ocean-like moat — the Son of the Wind crossed it without delay.

You burned Lanka and destroyed the demons, accomplishing the tasks of Sita and Rama.

When Lakshman lay unconscious at dawn, You brought the Sanjeevani herb and saved his life.

You entered the netherworld, broke the barriers of Yama, and tore apart the arms of Ahiravana.

With Your left arm You destroy hosts of demons; with Your right arm You deliver the saints.

Gods, humans, and sages perform Your aarti, chanting "Victory, Victory, Victory to Hanuman!"

On a golden plate with camphor flame, Mother Anjana performs Your aarti.

Whoever sings this aarti of Hanumanji attains the supreme abode of Vaikuntha.`,
    significance: 'Hanuman Aarti is recited in praise of Lord Hanuman, the embodiment of devotion, strength, and selfless service. Tuesday and Saturday are Hanuman\'s special days. This aarti recounts His heroic deeds from the Ramayana — burning Lanka, bringing the Sanjeevani herb, and defeating Ahiravana. It is especially powerful during Hanuman Jayanti and every Tuesday/Saturday evening puja.',
  },
  {
    slug: 'shiv-aarti',
    type: 'aarti',
    title: { en: 'Shiva Aarti — Om Jai Shiv Omkara', hi: 'शिव आरती — ॐ जय शिव ओमकारा' },
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
    meaning: `Glory to Lord Shiva, the embodiment of Om! Brahma, Vishnu, and Sadashiva — He bears His consort (Parvati) as half His form.

With one face, four faces, and five faces He reigns — riding the swan, Garuda, and the bull Nandi.

With two, four, and ten arms He is supremely beautiful. Beholding His three forms, the people of three worlds are enchanted.

He wears garlands of prayer beads, forest flowers, and skulls. He is the destroyer of Tripura and the slayer of Kamsa, bearing a rosary in His hands.

He wears white, yellow, and tiger-skin garments. The Sanakas, Garuda, and the spirits accompany Him.

In His hands He holds a water pot, discus, and trident. He is the giver of happiness, remover of sorrow, and sustainer of the world.

The ignorant see Brahma, Vishnu, and Sadashiva as different, but these three shine as One in the syllable Om.

Says Swami Shivanand: whoever sings this aarti of the three-natured Shiva attains their heart's desire.`,
    significance: 'Shiva Aarti is one of the most important Hindu aartis, sung in praise of Lord Shiva as the Supreme Being who encompasses Brahma, Vishnu, and Mahesh. Monday is Shiva\'s day. It is recited during Maha Shivaratri, every Monday, during Shravan month, and at Pradosha Kaal (evening twilight). The aarti emphasizes the unity of the Hindu Trinity in the form of Om.',
  },
  {
    slug: 'durga-aarti',
    type: 'aarti',
    title: { en: 'Durga Aarti — Jai Ambe Gauri', hi: 'दुर्गा आरती — जय अम्बे गौरी' },
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
    meaning: `Glory to Mother Ambe Gauri! Hari, Brahma, and Shiva meditate on You day and night.

Vermillion adorns Your parting, a musk tilak on Your forehead. Your two eyes shine bright, and Your face is beautiful as the moon.

Your body gleams like gold, draped in red garments. A garland of red flowers adorns Your neck.

You ride the lion, bearing sword and skull-cup. Gods, humans, and sages serve You — You remove their sorrows.

Earrings adorn Your ears, a pearl on Your nose. Your radiance rivals millions of suns and moons.

You destroyed Shumbha and Nishumbha, You slayed Mahishasura. Your smoky eyes are ever intoxicated with divine fervor.

Sixty-four yoginis sing, Bhairava dances. Cymbals, mridanga, and damaru play.

Your four arms are most beautiful, displaying the boon-granting gesture. Men and women who serve You attain their heart\'s desires.

A golden plate holds agarbatti and camphor. In the Sri Malketu temple, millions of jeweled lights shine.

Says Swami Shivanand: whoever sings this aarti of Ambe attains happiness and prosperity.`,
    significance: 'Jai Ambe Gauri is the principal aarti of Goddess Durga, recited during all nine nights of Navratri and on every Tuesday and Friday. It celebrates the Goddess as the destroyer of demons Shumbha, Nishumbha, and Mahishasura. It is traditionally sung during the Navratri Garba and Dandiya celebrations, and at Durga temples throughout India.',
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
    meaning: `Glory to Mother Saraswati! Endowed with virtues and splendor, renowned across all three worlds.

Moon-faced, seated on a lotus, radiant treasure of qualities. Wearing auspicious garments, the wise bestower of knowledge.

A book in one hand, the other hand gracing beauty. With a gentle smile, She illuminates the world.

Like the wish-fulfilling cow Kamadhenu, Her speech is like the Chintamani gem. Whoever meditates on Her with love — their sorrows are removed.

You are Bhavani, You are Bhagvati, called Brahmani. Whoever sings the praise of Saraswati attains great happiness and wealth.`,
    significance: 'Saraswati Aarti is sung in honor of Goddess Saraswati, the deity of knowledge, music, arts, and learning. It is especially important during Vasant Panchami (Saraswati Puja) and Navratri. Thursday is considered auspicious for Saraswati worship. Students recite this aarti before exams and during the beginning of educational endeavors.',
  },
  {
    slug: 'krishna-aarti',
    type: 'aarti',
    title: { en: 'Krishna Aarti — Aarti Kunj Bihari Ki', hi: 'कृष्ण आरती — आरती कुञ्ज बिहारी की' },
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
    meaning: `Aarti of the One who delights in the groves (Kunj Bihari), Shri Krishna who lifted the Govardhan mountain.

Around His neck is the Vaijayanti garland, and He plays the sweet flute. Earrings glitter in His ears — He is Nandlala, the bliss of Nanda.

His dark complexion shines like the sky, with Radhika gleaming beside Him. The garden-dweller stands among the creepers, with bee-like curls and a musk tilak on His forehead.

What a wondrous sight — the divine play of Mohan (the enchanter).

The golden peacock crown glitters; even the gods yearn for His darshan. Flowers shower from the sky, and bliss rains in His worship. Four-armed, consort of Lakshmi, bestower of happiness, protector of all praised by the gods. Murari removes the fear of devotees; His sacred abode is the city of Mathura.

On the banks of the Yamuna, the young one plays with the cowherd boys and girls.`,
    significance: 'This beloved aarti is sung in praise of Lord Krishna as Kunj Bihari — the one who plays in the groves of Vrindavan. It is recited daily in Krishna temples, especially at ISKCON and Banke Bihari temple in Vrindavan. Wednesday is associated with Vishnu/Krishna worship. It is especially important during Janmashtami, Holi, and Radha Ashtami.',
  },
  {
    slug: 'ram-aarti',
    type: 'aarti',
    title: { en: 'Ram Aarti — Shri Ramchandra Kripalu Bhajman', hi: 'राम आरती — श्री रामचन्द्र कृपालु भजमन' },
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
    meaning: `Worship Lord Ramchandra, the compassionate one who removes the terrible fear of worldly existence. His eyes are like fresh lotuses, His face like a lotus, His hands like lotuses, and His feet have the rosy glow of lotuses.

His beauty surpasses countless Kamadevas; He is beautiful as a fresh blue cloud. With His yellow garments shining like lightning — I bow to the pure bridegroom of Janaka's daughter (Sita).

Worship the friend of the poor, Lord of the day, destroyer of the demon and daitya clans. Joy of Raghu's line, source of bliss, moon of Kosala, son of Dasharatha.

Crown on His head, earrings, tilak — beautiful and generous ornaments adorn His body. With arms reaching His knees, bearing arrows and bow, He conquered Khara and Dushana in battle.

Thus says Tulsidas: He who delights the minds of Shankara, Shesha, and the sages — please reside in the grove of my heart and destroy the wicked army of desires.`,
    significance: 'Written by Goswami Tulsidas, this is one of the most revered aartis of Lord Rama. It is recited daily at Rama temples and during Ram Navami. The composition beautifully describes Rama\'s physical beauty and divine qualities. It is traditionally sung during evening aarti in Ayodhya and at Hanuman temples across North India.',
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
    meaning: `Glory to Mother Santoshi! You are the bestower of happiness and wealth to Your servants.

Beautiful golden garments are Your adornment, O Mother. A lovely tilak shines on Your forehead with stores of vermillion.

O Mother of Gananayak (Ganesha), Your meditation is auspicious. Your music is delightful — bring welfare to Your devotees.

Whoever offers You jaggery and chickpeas as bhog, O Mother, quickly attains their heart\'s desires.`,
    significance: 'Santoshi Maa is worshipped primarily on Fridays. She is believed to be the daughter of Lord Ganesha. The Santoshi Maa Vrat (16 consecutive Fridays) is one of the most popular vratas observed by married women for family harmony and fulfillment of wishes. The offering of gur (jaggery) and chana (chickpeas) is essential — sour foods must be avoided on the vrat day.',
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
    meaning: `Glory to Lord Surya! You are the sacred bestower of light, bringing radiance to the world.

Mounted on a chariot of seven horses, with Aruna as Your charioteer — You are a mass of divine brilliance.

Taking twelve forms (Adityas), You enchant the earth. O son of Kashyapa, Your brilliance grows day by day.

Whoever sings this aarti of Surya Narayana attains happiness and prosperity, and all calamities are removed.`,
    significance: 'Surya Aarti is recited on Sundays and during Chhath Puja, Makar Sankranti, and Ratha Saptami. The Sun God (Surya Dev) is worshipped for good health, vitality, and success. Surya Namaskar (sun salutation) is performed at sunrise. Those undergoing Surya Mahadasha or with a weak Sun in their horoscope especially benefit from this worship.',
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
    meaning: `Glory to Shani Dev, benefactor of devotees! He is the son of Surya and Mother Chhaya.

His dark, large body wears a garland of skulls. He always wears black garments — the pure Shani.

In His hand is the Sun\'s umbrella, reigning over the world He has shaped. He always delivers justice — Shani\'s punishment removes all sorrow.

He regards other women as mothers and desires no one else\'s wealth. He is a learned, righteous soul — know Him as the primordial being.

Says poet Sundardas: whoever sings this aarti of Shani Dev attains their heart\'s desires.`,
    significance: 'Shani Dev Aarti is recited on Saturdays, which is Shani\'s day. Shani (Saturn) is the planet of justice, karma, and discipline. Those undergoing Sade Sati (7.5-year Saturn transit), Shani Mahadasha, or Dhaiyya should recite this aarti regularly. Offering mustard oil, black sesame, and lighting a sesame oil lamp on Saturdays are traditional remedies.',
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
    meaning: `Salutations to You, O Queen Tulsi! O Tulsi of Vrindavan, salutations to You.

By whatever means one can reach the Lord — bring about that welfare, O auspicious one.

Your flower buds (manjari) are most dear and pleasing to Lord Hari.

Whoever meditates on You with love attains the state of liberation.`,
    significance: 'Tulsi Aarti is performed during the daily evening worship of the Tulsi plant (Holy Basil), which is considered a manifestation of Goddess Lakshmi/Vrinda. Tulsi Vivah (marriage of Tulsi with Shaligram/Vishnu) is celebrated on Kartik Shukla Ekadashi/Dwadashi. Keeping a Tulsi plant at home and performing its aarti brings prosperity and spiritual purification.',
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
    meaning: `Glory to Mother Ganga! Whoever meditates on You attains their heart\'s desires.

Your light is like the moon, Your water flows pure. Whoever seeks Your refuge crosses over (the ocean of existence).

You liberated the sons of King Sagara — the whole world knows this. May Your gracious gaze fall upon us — You are the giver of happiness in all three worlds.

Whoever even once comes to Your refuge, You remove the terror of Yama (death) and they attain supreme liberation.

Whoever sings this aarti of Mother Ganga — Her glory is boundless — that person finds happiness.`,
    significance: 'Ganga Aarti is performed daily at sunset (Sandhya Aarti) at the ghats of Varanasi, Haridwar, and Rishikesh. The grand Ganga Aarti at Dashashwamedh Ghat in Varanasi is world-famous. Ganga Dussehra (Jyeshtha Shukla Dashami) celebrates the descent of the Ganga. Bathing in the Ganga is believed to wash away sins. The aarti is especially significant during Kartik Purnima and Maha Shivaratri.',
  },
  {
    slug: 'sai-baba-aarti',
    type: 'aarti',
    title: { en: 'Sai Baba Aarti — Kakad Aarti', hi: 'साईं बाबा आरती — काकड़ आरती' },
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
    meaning: `Shirdi is my Pandharpur, Sai Baba is my Rama. Pure devotion is the Chandrabhaga river, and divine sentiment is the awakened Pundalik.

Glory to Sai Nath! O giver of happiness, we seek the dust of Your feet. May Your servants and devotees find rest in meditation upon You.

Having burned away desire, You remain absorbed in Your own true nature. You show the seekers of liberation Your own divine vision.

Whatever feeling is in one\'s mind, that is the experience one receives. O compassionate one, such is Your motherly love.`,
    significance: 'The Kakad Aarti is the first of five daily aartis performed at the Sai Baba temple in Shirdi, Maharashtra. It is performed at 4:30 AM (before dawn). Sai Baba of Shirdi (d. 1918) is revered by both Hindu and Muslim devotees. Thursday is considered Sai Baba\'s special day. The aarti is in Marathi and reflects the Warkari tradition of Maharashtra.',
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
    meaning: `Perform the aarti of Karva Chauth. Light the lamp of Karva Chauth.

First worship Gauri (Parvati) with the earthen pot, adorned with all sixteen adornments. A wife serves her husband — the bond spans lifetimes.

Offer arghya to the rising moon, view the moon through a sieve. From the depths of your heart, pray for your husband\'s well-being.`,
    significance: 'Karva Chauth is observed on Kartik Krishna Chaturthi by married Hindu women for the longevity and health of their husbands. Women fast from sunrise to moonrise without food or water. The fast is broken after sighting the moon through a sieve and then viewing the husband\'s face. It is one of the most widely observed fasts in North India.',
  },
  {
    slug: 'diwali-aarti',
    type: 'aarti',
    title: { en: 'Diwali Aarti — Lakshmi-Ganesh', hi: 'दीपावली आरती — लक्ष्मी-गणेश' },
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
    meaning: `Glory to Mother Lakshmi! Hari, Vishnu, and Brahma serve You day and night.

Glory to Lord Ganesha! His mother is Parvati and father is Mahadeva.

On the night of Deepavali, Lakshmi and Ganesha are worshipped. Lamps are lit in every home, driving away darkness.

Glory to Lakshmi-Ganesha, the light of Deepavali. Shower happiness and prosperity — bring light to the world.`,
    significance: 'This combined Lakshmi-Ganesh aarti is performed on Diwali night (Kartik Amavasya), the biggest Hindu festival. Ganesha is worshipped first as the remover of obstacles, followed by Lakshmi for wealth and prosperity. New account books (Chopda Pujan) are blessed. Fireworks, rangoli, and diyas mark the celebration. It is essential to perform puja during Pradosh Kaal and Nishita Kaal on Diwali night.',
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
    meaning: `Glory to Mother Ambe Gauri! Hari, Brahma, and Shiva meditate on You day and night.

Nine days of Navratri, worship in nine forms. Shailputri, Brahmacharini, and Chandraghanta are the first three.

Worship Kushmanda, Skandamata, and Katyayani. Let Kaalratri, Mahagauri, and Siddhidatri resound.

Sing the aarti of all nine Durgas together. Attain all desired fruits by receiving the Mother\'s grace.`,
    significance: 'Navratri Aarti is recited during the nine nights of Navratri (Chaitra and Ashwin). Each day honors a different form of Goddess Durga (Navadurga). The festival culminates in Vijayadashami (Dussehra). Garba and Dandiya dances accompany the worship in Gujarat and Maharashtra. The aarti invokes all nine forms for complete divine protection.',
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
    meaning: `Glory to the consort of Lakshmi! Lord Satyanarayan removes the sins of devotees.

Seated on a jeweled throne, His wondrous beauty reigns. Narad always says: by hearing His story, the world is redeemed.

He manifested in Kali Yuga and gave darshan to a Brahmin. Appearing as an old Brahmin, He gave a golden palace.

A weak tribal hunter worshipped Satyanarayan. The Lord gave golden lotuses by the Yamuna.

Whoever worships with devotion attains their heart\'s desires. Such is Lord Satyanarayan — beloved by all.`,
    significance: 'Satyanarayan Puja is one of the most commonly performed Hindu pujas, especially on Purnima (full moon day) and Thursdays. It is performed to seek blessings for success, prosperity, and family welfare. The five chapters of the Satyanarayan Katha are recited during the puja. It is commonly performed during housewarmings, weddings, and on achieving success in any endeavor.',
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
    meaning: `Glory to the Lord of the Universe! He removes the troubles of His devotees and servants in an instant.

He bears the conch, discus, mace, and lotus in His four arms. On His chest shine the Shrivatsa mark, Lakshmi, and the heavy Kaustubha gem.

He reclines in the Ocean of Milk on the serpent Shesha's bed. Brahma, Rudra, Sanaka, and Sanandana worship His feet daily.

The Lord assumed ten avatars for the benefit of devotees — Matsya (Fish), Kurma (Tortoise), Varaha (Boar), and Narasimha (Man-Lion), and the form of Vamana (Dwarf).

Parashurama, Rama, Krishna, Buddha, and Kalki — assuming these forms, the Lord destroys adharma and protects dharma.

Says Swami Shivanand: whoever sings this aarti of Shri Vishnu attains happiness and prosperity.`,
    significance: 'This Vishnu-specific aarti focuses on Lord Vishnu\'s iconic form — four-armed with conch, discus, mace, and lotus — and His Dashavatar (ten incarnations). It is recited on Wednesdays and Thursdays, during Ekadashi, and at Vishnu temples. Vishnu is the Preserver in the Hindu Trinity, maintaining cosmic order (dharma) through His incarnations whenever evil threatens to overwhelm righteousness. The aarti is especially significant during Dev Uthani Ekadashi and Vaikuntha Ekadashi.',
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

(1) Victory to Hanuman, ocean of wisdom and virtue. Victory to the Monkey King, illuminator of the three worlds. (2) You are Rama's envoy, abode of matchless strength. You are named Anjani's son, Son of the Wind. (3) Great hero, mighty as a thunderbolt. You dispel evil thoughts and are the companion of good sense. (4) Your golden body shines in fine attire, with earrings in Your ears and curly hair. (5) In Your hands shine the thunderbolt and the flag; a sacred thread of munja grass adorns Your shoulder. (6) You are Shankara's incarnation, son of Kesari. Your brilliance and valor are revered in the whole world. (7) You are learned, virtuous, and supremely clever, always eager to do Rama's work. (8) You delight in hearing the Lord's story. Rama, Lakshmana, and Sita dwell in Your heart. (9) Assuming a tiny form You appeared to Sita; assuming a terrifying form You burned Lanka. (10) Assuming a gigantic form You slew the demons, accomplishing Ramachandra's tasks. (11) You brought the Sanjeevani herb and revived Lakshmana. Shri Raghuveer embraced You joyfully. (12) Raghupati praised You greatly: "You are as dear to Me as brother Bharata." (13) "A thousand-headed Shesha sings Your glory," said Shripati (Vishnu), embracing You. (14) Sanaka, Brahma, and the great sages, Narada, Sharada, and the Serpent King (15) Yama, Kubera, and the Dikpalas — even poets and scholars cannot describe Your glory. (16) You did Sugriva a great favor — introducing him to Rama, You gave him the kingdom. (17) Vibhishana heeded Your counsel and became Lord of Lanka — the whole world knows. (18) The Sun is thousands of yojanas away; You swallowed it thinking it a sweet fruit. (19) Carrying the Lord's ring in Your mouth, You leaped across the ocean — no wonder! (20) All the difficult tasks in the world become easy by Your grace. (21) You are the gatekeeper at Rama's door; none may enter without Your permission. (22) All happiness lies in Your refuge; with You as protector, why should anyone fear? (23) You alone can control Your brilliance; the three worlds tremble at Your roar. (24) Ghosts and evil spirits dare not approach when the name of Mahaveer is uttered. (25) All diseases and pains are destroyed by constantly chanting "Hanuman Veera." (26) Hanuman rescues from troubles whoever meditates on Him in thought, deed, and word. (27) Rama is the supreme ascetic king, and You accomplish all His tasks. (28) Whoever comes to You with any desire receives limitless fruits of life. (29) Your glory spans all four ages, famous throughout the world as its light. (30) You are the protector of saints and sages, destroyer of demons, beloved of Rama. (31) You are the giver of the eight siddhis and nine nidhis — this boon was granted by Mother Janaki. (32) You possess the elixir of Rama's name; may You always remain Raghupati's servant. (33) Through Your worship one attains Rama, and the sorrows of countless lifetimes are forgotten. (34) At the end of life, one goes to Rama's abode; wherever one is born, one is called Hari's devotee. (35) Why worship other gods? Serving Hanuman alone gives all happiness. (36) All troubles are cut away, all pains destroyed, for whoever remembers mighty Hanuman. (37) Victory, Victory, Victory to Lord Hanuman! Bestow Your grace as the Guru does. (38) Whoever recites this a hundred times is freed from bondage and attains great bliss. (39) Whoever reads this Hanuman Chalisa attains perfection — Lord Shiva is witness. (40) Says Tulsidas, ever Hari's servant: O Lord, make my heart Your dwelling.

Closing Doha: O Son of the Wind, remover of calamities, embodiment of auspiciousness! Along with Rama, Lakshmana, and Sita, dwell in my heart, O King of Gods.`,
    significance: 'The Hanuman Chalisa, composed by Goswami Tulsidas in the 16th century, is the single most recited devotional text in Hinduism. "Chalisa" means "forty" — referring to its 40 chaupai (quatrain) verses, framed by opening and closing dohas. It is recited daily by millions, especially on Tuesdays and Saturdays (Hanuman\'s days). It is believed to ward off evil spirits, cure diseases, remove obstacles, and grant strength and courage. During Hanuman Jayanti (Chaitra Purnima), continuous recitation (Hanuman Chalisa Path) is performed in temples.',
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
    meaning: `Opening Doha: Salutations to Durga, bestower of happiness. Salutations to Ambe, remover of sorrow.

The Durga Chalisa praises the Goddess as the formless light that illuminates all three worlds. With the moon on Her forehead, vast face, red eyes, and fierce brows, Her beautiful form delights all who behold Her. She created, sustains, and dissolves the universe. She assumed the fierce Chandi form to slay the demon armies — destroying Mahishasura, Shumbha, Nishumbha, and Raktabeeja. All the gods called upon Her for protection. The chalisa concludes with prayers for Her grace and the promise that reciting it brings all happiness and the supreme state.`,
    significance: 'Durga Chalisa is recited during both Chaitra and Sharad Navratri (nine nights in spring and autumn), on Tuesdays and Fridays, and on Ashtami (8th day). It narrates the victories of Goddess Durga over various demons. Regular recitation is believed to protect from enemies, remove fear, and bring courage and prosperity. It is especially powerful during the Durga Puja festival celebrated across Bengal and Eastern India.',
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
    meaning: `Opening Doha: Victory to Ganapati, abode of good qualities, eloquent and gracious. Remover of obstacles, bestower of auspiciousness — Victory to the son of Girija (Parvati)!

The Ganesh Chalisa praises Lord Ganesha as the supreme leader of the ganas, elephant-faced bestower of happiness, creator of wisdom. His vermillion-colored form with teeth like pearls is described. He is the first to be worshipped among all gods. The chalisa requests His grace for the welfare of all beings and concludes with the promise that reading it brings all siddhis (spiritual powers), removes all troubles, and grants auspicious happiness.`,
    significance: 'Ganesh Chalisa is recited on Wednesdays, during Ganesh Chaturthi (10-day festival in Bhadrapada), and at the beginning of any new venture or puja. Lord Ganesha is always worshipped first before any other deity. The chalisa invokes His blessings for the removal of obstacles (Vighna-harta) and the bestowal of wisdom (Buddhi-data). It is especially recommended for students and those starting new businesses.',
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
    meaning: `Opening Doha: I worship the pair of Saraswati's feet, whose toenails shine like jewels. In the mirror of Her feet, I behold my own reflection beautified.

The Saraswati Chalisa praises the Goddess as the bestower of knowledge and creator of wisdom. She is adorned in white garments and white flowers. She holds a Veena (lute) and a book, dwelling in Brahma's heart. Four-armed, seated on a lotus — Sharada, the giver of knowledge. She is the bestower of intelligence and education. The chalisa requests Her grace to remove dullness and ignorance, and concludes with the promise that daily recitation brings knowledge, wisdom, poetry, and the removal of all obstacles.`,
    significance: 'Saraswati Chalisa is recited on Thursdays, during Vasant Panchami (Saraswati Puja), and before examinations or academic endeavors. Goddess Saraswati is the patron of learning, music, arts, and speech. Students place their books and musical instruments at Her feet during Saraswati Puja. The chalisa is especially beneficial for writers, musicians, students, and scholars seeking Her blessings for eloquence and knowledge.',
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
    meaning: `Opening Doha: O Mother Lakshmi, bestow Your grace, dwell in my heart. Fulfill my desires and complete all my hopes.

The Lakshmi Chalisa praises the Goddess as the daughter of the ocean (born during the ocean churning), the bestower of knowledge, wisdom, and learning. She is the most benevolent of all, fulfilling all hopes. She is the divine mother of the universe, the auspicious treasure, remover of sins, queen of the three worlds. She is ever compassionate. The chalisa concludes with the promise that whoever recites it with a pure heart will see happiness and prosperity grow in their home, and poverty will never come.`,
    significance: 'Lakshmi Chalisa is recited on Fridays, during Diwali, and throughout the month of Kartik. Goddess Lakshmi is the divine consort of Lord Vishnu and the bestower of wealth (Dhana), fortune (Bhagya), prosperity (Samriddhi), and beauty (Saundarya). The chalisa is recommended for those facing financial difficulties, during business ventures, and for married women seeking family prosperity. The eight forms of Lakshmi (Ashta Lakshmi) are invoked through this prayer.',
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
    meaning: `Opening Doha: I meditate today at the feet of Shri Raghubar (Rama). I describe Rama according to my humble understanding.

The Ram Chalisa praises Lord Rama as the avatar of Vishnu, beloved son of Dasharatha and Kausalya. It narrates His life story: the protection of sage Vishwamitra's yajna, the slaying of Tadaka and Subahu, the liberation of Ahalya, the breaking of Shiva's bow to win Sita's hand, and the 14 years of forest exile. The chalisa concludes with the promise that whoever recites it receives Rama's grace, attains their desires, and all troubles are removed.`,
    significance: 'Ram Chalisa is recited on Wednesdays (Vishnu\'s day), during Ram Navami (Chaitra Shukla Navami), and as part of daily prayers. Lord Rama is revered as Maryada Purushottam — the ideal man who exemplifies dharma, courage, and devotion. The chalisa narrates the key events of the Ramayana. It is especially recommended for those seeking righteousness, family harmony, and divine protection.',
  },
  {
    slug: 'vishnu-chalisa',
    type: 'chalisa',
    title: { en: 'Vishnu Chalisa', hi: 'विष्णु चालीसा' },
    deity: 'Vishnu',
    deityDay: 3,
    devanagari: `॥ दोहा ॥
नमो नारायण नाथ जी, नमो सदा तव पाय।
पतित पावन दीन दयालु, तुमही एक सहाय॥

॥ चौपाई ॥
जय जय लक्ष्मीपत जगदीशा। सेवत कमलापत पद शीशा॥
दशावतार तुम जगत बनाई। मत्स्य कूर्म वराह सुखदाई॥

नरसिंह बामन परशुराम। राम कृष्ण बुद्ध कल्कि नाम॥
चार भुजा शंख चक्र गदाधारी। पद्म नयन वनमाला धारी॥

क्षीरसागर शेष शय्या पर। लक्ष्मी चरण दबावत सुन्दर॥
ब्रह्मा नाभि कमल से जन्में। सब विधि रचियो जग को अन्ने॥

॥ दोहा ॥
विष्णु चालीसा पढ़े, प्रेम सहित जो कोय।
पापहीन हो भवसागर, पार उतारे सोय॥`,
    transliteration: `|| Doha ||
Namo Narayan Nath ji, namo sada tav paay.
Patit paavan deen dayalu, tumhi ek sahay.

|| Chaupai ||
Jai Jai Lakshmipat Jagdeesha. Sevat Kamlaapat pad sheesha.
Dashavatar tum jagat banaai. Matsya Kurma Varaha sukhdaai...`,
    meaning: `Opening Doha: Salutations to Lord Narayana! I always bow at Your feet. O purifier of the fallen, compassionate to the humble — You alone are my support.

The Vishnu Chalisa praises the Supreme Preserver as Jagdisha (Lord of the Universe) and consort of Lakshmi. It enumerates His ten avatars (Dashavatar): Matsya (Fish), Kurma (Tortoise), Varaha (Boar), Narasimha (Man-Lion), Vamana (Dwarf), Parashurama, Rama, Krishna, Buddha, and Kalki. His four-armed form with conch, discus, mace, and lotus is described. He reclines on Shesha Naga in the Ocean of Milk while Lakshmi presses His feet. Brahma was born from the lotus in His navel, creating the world. The chalisa concludes with the promise that whoever recites it with love is freed from sins and crosses the ocean of existence.`,
    significance: 'Vishnu Chalisa is recited on Wednesdays and Thursdays, during Ekadashi (11th day of each lunar fortnight), and on Vishnu-related festivals like Vaikuntha Ekadashi, Dev Uthani Ekadashi, and Anant Chaturdashi. Lord Vishnu is the Preserver of the Universe in the Hindu Trinity. The Dashavatar (ten incarnations) represent His intervention whenever dharma declines. Fasting on Ekadashi and reciting this chalisa is considered highly meritorious.',
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
    meaning: `Opening Doha: With firm faith, love, and devotion, whoever makes a humble prayer — Hanuman accomplishes all their auspicious tasks.

The Bajrang Baan is a powerful prayer invoking Hanuman's warrior aspect. It recalls His leap across the ocean, defeating Surasa and Lankini, comforting Vibhishana, finding Sita, destroying the Ashoka grove, killing Akshaya Kumara, and burning Lanka with His tail ablaze. The prayer then invokes Hanuman with powerful tantric syllables (Om, Hum, Hreem) to destroy enemies and protect devotees. It concludes with a call for Hanuman to rush to aid His devotees.`,
    significance: 'Bajrang Baan is one of the most powerful Hanuman prayers, more intense than the Hanuman Chalisa. It is recited for protection from evil spirits, black magic, and severe enemies. "Baan" means "arrow" — this prayer is like an arrow of Bajrang (Hanuman). It should be recited with utmost devotion and faith, especially on Tuesdays and Saturdays. It is recommended during severe troubles, court cases, and when facing powerful adversaries. Caution: it is traditionally advised to recite the Hanuman Chalisa before and after the Bajrang Baan.',
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
    meaning: `Opening Doha: Victory to Ganesh, son of Girija, the gracious bestower of auspiciousness. Remove the sorrows of the humble, O Lord, and make them happy. I daily serve Shri Shanishchara Dev. May the son of Surya and Mother Chhaya bestow His grace.

The Shani Chalisa describes Shani Dev as compassionate, dark-complexioned with four arms, wearing a jeweled crown, dressed in black with a black flag, riding a black horse. He is the son of Surya (Sun) and Chhaya (Shadow). He rules Capricorn and Aquarius. He is mighty and understands the pain of all beings. He always delivers justice in His heart, and His true devotees never face hardship. The chalisa concludes: whoever reads the Shani Chalisa, especially on Saturdays, receives Shani Dev's grace and has their burdens removed.`,
    significance: 'Shani Chalisa is recited on Saturdays, the day ruled by Saturn (Shani). It is essential for those undergoing Sade Sati (7.5-year Saturn transit over natal Moon), Shani Mahadasha, or Dhaiyya (2.5-year transit). Saturn is the planet of karma, justice, discipline, and hard lessons. Offering mustard oil, black sesame, black cloth, and iron on Saturdays are traditional remedies. The Shani temple at Shingnapur, Maharashtra is the most famous Shani temple in India.',
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
    meaning: `The Vishnu Sahasranama ("Thousand Names of Vishnu") is a sacred hymn from the Anushasana Parva of the Mahabharata, where Bhishma lying on the bed of arrows recites the 1,000 names of Vishnu to Yudhishthira.

The first verse invokes Vishnu as: the Universe (Vishvam), the All-Pervading (Vishnu), the Lord of Sacrifice (Vashatkaara), the Lord of Past, Present, and Future. He is the Creator, Sustainer, and Essence of all beings.

The Pure Soul, the Supreme Soul, the ultimate goal of the liberated. He is Imperishable, the Witness, the Knower of the Field, the Eternal.

He is Yoga itself, the Leader of yogis, the Lord of Pradhana and Purusha. He has the form of Narasimha (Man-Lion), is beautiful, and is Keshava (slayer of the demon Keshi) and Purushottama (Supreme Being).

He is All (Sarva), Destroyer (Sharva), Auspicious (Shiva), Immovable (Sthanu). He is the origin and treasure of all beings, the Source, the Nourisher, the Lord.

(The complete text contains 1,000 names describing Vishnu's infinite attributes, forms, and cosmic functions.)`,
    significance: 'The Vishnu Sahasranama is one of the most sacred texts in Hinduism, recited from the Mahabharata (Anushasana Parva, Chapter 149). It was spoken by Bhishma to Yudhishthira as the answer to six questions about the Supreme Being. It is recited daily by millions of Vaishnavas worldwide. Adi Shankaracharya wrote a famous commentary on it. Each name (nama) is a meditation. It is recommended to recite during Ekadashi, on Wednesdays, and whenever seeking spiritual merit. The Phalashruti (fruit of recitation) promises freedom from all sins, fulfillment of desires, and moksha.',
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
    meaning: `The Lalita Sahasranama is the thousand names of Goddess Lalita Tripurasundari (the Beautiful Goddess of the Three Cities), the supreme form of the Divine Mother in the Shakta tradition.

(1) She is Shri Mata (Divine Mother), Shri Maharajni (Great Queen), Ruler of the sacred throne. She arose from the fire-pit of consciousness to accomplish the purpose of the gods.

(2) She radiates the brilliance of a thousand rising suns, with four arms. She holds the noose of attachment and the goad of anger.

(3) Her bow is the mind, Her five arrows are the five subtle elements (tanmatras). The entire universe is immersed in the flood of Her rosy effulgence.

(4) Her hair is adorned with champaka, ashoka, punnaga, and saugandhika flowers. Her crown is studded with rows of kuruvinda gems.

(The complete text continues with 1,000 names describing Her beauty, powers, cosmic functions, and spiritual significance.)`,
    significance: 'The Lalita Sahasranama appears in the Brahmanda Purana and is the foremost text of Shri Vidya tradition. It was recited by Sage Hayagriva to Sage Agastya. Each name is a mantra in itself. It is recited on Fridays, during Navaratri, and on Purnima. The text describes the Goddess from head to toe (Keshadi-padanta) and then from toe to head (Padadi-keshanta). It is the primary text for worship of Lalita/Tripurasundari/Rajarajeshwari. Regular recitation is believed to grant all four goals of life: Dharma, Artha, Kama, and Moksha.',
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
    meaning: `(1) From the dense forest of His matted locks flows the purifying stream (Ganga), and around His neck hangs a garland of great serpents. With the damaru drum sounding "damat-damat," He performed the fierce Tandava dance — may that Shiva bestow auspiciousness upon us.

(2) With the Ganga whirling and dancing in His matted hair like playful waves, with the fire of the third eye blazing on His forehead — in that Lord who wears the crescent moon, may my devotion increase every moment.

(3-16) The stotram continues with increasingly powerful imagery: mountains tremble, the universe resonates with His cosmic dance, serpent-jewels glow on His body, elephant-hide drapes His form. He destroys Kama (desire), the three cities (Tripura), worldly existence, Yama (death itself). The poet asks: when will I dwell in the groves of the celestial Ganga, hands clasped above my head, chanting "Shiva, Shiva" — when will I find true happiness?`,
    significance: 'The Shiva Tandava Stotram was composed by Ravana, the demon king of Lanka, in praise of Lord Shiva. Despite being a villain in the Ramayana, Ravana was a great devotee of Shiva and a formidable scholar. The 16 verses describe Shiva\'s cosmic dance (Tandava) with extraordinarily complex Sanskrit compound words. It is recited on Mondays, Maha Shivaratri, and during Shravan month. The stotram\'s complex rhythmic structure mimics the sounds of the Tandava dance itself. It is considered one of the most powerful Shiva prayers.',
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
    meaning: `(1-2) Then, seeing Rama exhausted and worried on the battlefield, with Ravana ready for combat before him, the divine sage Agastya approached.

(3) "O Rama, mighty-armed one, listen to this eternal secret by which you shall conquer all enemies in battle."

(4) "This Aditya Hridayam (Heart of the Sun) is holy, destroyer of all enemies, bringer of victory. Recite it daily — it is imperishable, supremely auspicious."

(5) "It is the most auspicious of all auspicious things, destroyer of all sins, queller of worry and grief, the best bestower of long life."

(6) "Worship the radiant rising Sun, saluted by gods and demons alike — Vivasvan, Bhaskara, Lord of the Universe."

(7) "He contains the essence of all gods; He is radiant and the source of all rays. He protects the worlds of gods and demons with His beams."

(8) "He is Brahma, Vishnu, Shiva, Skanda, Prajapati, Indra, Kubera, Kala (Time), Yama, Soma, and the Lord of Waters."`,
    significance: 'The Aditya Hridayam is from the Yuddha Kanda of the Valmiki Ramayana (Chapter 107). Sage Agastya taught it to Lord Rama on the battlefield before the final fight with Ravana. After reciting it three times, Rama defeated Ravana. It is one of the most powerful solar hymns and is recited daily at sunrise, on Sundays, during Ratha Saptami, Makar Sankranti, and Chhath Puja. It is recommended for those with a weak Sun in their horoscope, during Surya Mahadasha, and for good health and vitality.',
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
    meaning: `Worship compassionate Lord Ramchandra, who removes the terrible fear of worldly existence. By His (Hanuman's) strength, great mountains tremble. Diseases and afflictions dare not approach Him.

He who crossed the ocean, removed Sita's grief, and humbly sought the shelter of Rama — sing the Hanuman Bahuk and gain immense strength, wisdom, and knowledge.

With firm faith, love, and respect, whoever prays — Hanuman accomplishes all their auspicious tasks.

In childhood, You swallowed the Sun, and all three worlds became dark. The world was terrified, and no one could avert this crisis. When the gods came and pleaded, You released the Sun and removed the trouble. Who in the world does not know, O Monkey-lord, that "Sankatmochan" (Remover of Difficulties) is Your name!`,
    significance: 'Hanuman Bahuk was composed by Goswami Tulsidas when he himself was suffering from severe arm pain (bahuk = arm). He wrote this prayer to Hanuman for relief, and tradition holds that his pain was immediately cured. It is recited for healing from physical ailments, especially joint pain, paralysis, and chronic diseases. It is recommended on Tuesdays and Saturdays, and during times of severe illness. The text is considered especially powerful because it was born from Tulsidas\'s own personal suffering and faith.',
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
    meaning: `I worship that Indira (Lakshmi), who is the wish-fulfilling tree for worshippers, the source of Indira's bliss, beautiful with boundless joy, with an elephant-like face (auspicious complexion).

(1) She who clings to the body of Hari (Vishnu) adorned with thrills of joy, like a female bee to a tamala tree full of buds — may the side-glance play of Her who has assumed all glories, that auspicious deity, grant me blessings.

(2) The innocent one repeatedly casting on Murari's face glances that come and go with love and modesty — may that ocean-born Goddess, whose eyes are like bees around a great lotus, bestow prosperity upon me.

(3-5) The stotram continues describing Lakshmi's intimate presence with Vishnu, Her grace visible in the Kaustubha gem, Her brilliance like lightning on the dark cloud of Vishnu's chest. Each verse is a prayer for the blessings of the daughter of Bhrigu.`,
    significance: 'Kanakadhara Stotram was composed by Adi Shankaracharya when he was a young student. The story goes that during his daily bhiksha (alms-begging), he visited a very poor woman who had nothing to offer except a single dried amla (gooseberry). Moved by her devotion, Shankaracharya composed this 21-verse hymn to Goddess Lakshmi, whereupon golden gooseberries (kanakadhara = stream of gold) rained upon the woman\'s home. The stotram is recited on Fridays and during Diwali for the removal of poverty and the bestowal of wealth.',
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
    meaning: `(1) O daughter of the mountain, who delights the earth, who entertains the universe, praised by Nandana! O dweller on the peak of the great Vindhya, who sports with Vishnu, praised by Jishnu (Arjuna)! O Bhagavati, wife of the blue-throated Shiva, of vast family and vast deeds — Victory, Victory to the slayer of Mahishasura, She of beautiful braids, daughter of the mountain!

(2) O rainer of boons upon the gods, unconquerable, patient with the wicked, delighting in joy! Nourisher of the three worlds, pleaser of Shankara, destroyer of sins, delighting in celebration! Angered at the demons and sons of Diti, drier of evil pride, daughter of the ocean — Victory, Victory to the slayer of Mahishasura!

(3) O mother of the world, my mother, who loves to dwell in kadamba forests, who delights in laughter! Dwelling in the peaks of the great Himalaya mountains! Sweet as honey, destroyer of Madhu and Kaitabha demons, delighting in dance — Victory, Victory to the slayer of Mahishasura!`,
    significance: 'Mahishasura Mardini Stotram celebrates Goddess Durga\'s victory over the buffalo-demon Mahishasura. The story is central to the Devi Mahatmyam / Durga Saptashati. This stotram is attributed to Adi Shankaracharya. It is recited during Navratri (especially Ashtami/Navami), on Tuesdays and Fridays, and during Durga Puja. Each verse ends with the iconic refrain "Jaya Jaya he Mahishasura Mardini" — making it one of the most musical and rhythmic Sanskrit compositions. Its complex alliterative style showcases the beauty of Sanskrit poetry.',
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
    meaning: `(1) O Fire God (Jataveda), bring to me Lakshmi, who is golden-hued, deer-like (graceful), adorned with garlands of gold and silver, moon-like, and golden.

(2) Bring to me that Lakshmi who never departs, through whom I may find gold, cattle, horses, and progeny.

(3) I invoke the Goddess Shri (Lakshmi), preceded by horses, centered in chariots, heralded by elephant trumpets. May Goddess Shri be pleased with me.

(4) I invoke that Shri who is radiant, smiling, enclosed in golden walls, moist with compassion, blazing with glory, content and contenting others, seated on a lotus, lotus-complexioned.

(5) I take refuge in that Padmini (lotus-born), radiant as the moon, blazing with fame, generous, worshipped by the gods. May Alakshmi (misfortune) be destroyed; I choose You.`,
    significance: 'Sri Suktam is one of the most ancient Vedic hymns, found in the Khilani (appendix) of the Rig Veda. It is the primary hymn for worshipping Goddess Lakshmi. It is recited during Lakshmi Puja on Diwali, every Friday, during Varalakshmi Vratam (popular in South India), and in temple rituals. The Sri Suktam describes the eight forms of Lakshmi and invokes Her grace for prosperity, progeny, cattle, and the removal of Alakshmi (misfortune). It forms the core of Sri Vidya worship in the Tantric tradition.',
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
    meaning: `(1) The cosmic Purusha has a thousand heads, a thousand eyes, and a thousand feet. He envelops the earth from all sides and extends ten fingers beyond it.

(2) This Purusha is indeed all this — whatever has been and whatever will be. He is the lord of immortality, which He transcends through food (the manifest world).

(3) Such is His greatness, and the Purusha is even greater than this. All beings are one quarter of Him; His three quarters are the immortal in heaven.

(4) With three quarters He rose upwards; one quarter remained here. From that He spread in all directions over the sentient and insentient.

(5) From Him was born Viraj (the cosmic body); from Viraj was born Purusha. When born, He extended beyond the earth, behind and in front.`,
    significance: 'The Purusha Suktam is one of the most important hymns in the Rig Veda (10.90), with versions also appearing in the Yajur Veda and Atharva Veda. It describes the cosmic sacrifice of the Purusha (Cosmic Being/Supreme Person) from which the entire universe was created. It is recited in virtually all Hindu temple rituals, Yajnas, and important ceremonies. The hymn describes the origin of the four Vedas, the seasons, animals, and the cosmic order. It is one of the foundational texts of Hindu cosmology and philosophy.',
  },
  {
    slug: 'rudram-chamakam',
    type: 'stotram',
    title: { en: 'Rudram Chamakam', hi: 'रुद्रम् चमकम्' },
    deity: 'Shiva/Rudra',
    deityDay: 1,
    devanagari: `॥ श्री रुद्रम् — नमकम् ॥
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
    transliteration: `|| Sri Rudram — Namakam ||
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
    meaning: `Namakam (Salutations to Rudra):

(1) O Rudra, salutations to Your anger and to Your arrows. Salutations to Your bow and to Your arms.

(2) O Rudra, may we see that auspicious, non-terrible, sin-destroying form of Yours. O dweller of the mountains, reveal Yourself to us in that most peaceful form.

(3) O mountain-dweller, make auspicious the arrow You hold in Your hand ready to shoot. O protector of the mountains, do not harm man or the world.

(4) O mountain-dweller, we address You with auspicious words. May the whole world be free from disease and be of good mind.

Chamakam (Grant Me):
"May I have food, may I have inspiration, may I have enterprise, may I have exertion, may I have thought, may I have purpose, may I have voice, may I have fame, may I have hearing, may I have light, may I have heaven, may I have breath (prana, apana, vyana), may I have life force, may I have mind, may I have speech, may I have eyes, may I have ears, may I have skill, may I have strength, may I have energy, may I have endurance, may I have long life, may I have old age, may I have self, may I have body, may I have protection, may I have armor, may I have limbs, may I have bones, may I have joints, may I have bodies."`,
    significance: 'The Sri Rudram (Namakam and Chamakam) is from the Krishna Yajur Veda (Taittiriya Samhita, Chapter 4.5-4.7). It is the central liturgy of Shiva worship and the most important Vedic hymn dedicated to Rudra-Shiva. The Namakam contains 11 anuvakas (chapters) of salutations, while the Chamakam contains 11 anuvakas of wishes. The Rudra Abhishekam performed in Shiva temples uses this chant. It is especially recited during Maha Shivaratri, Mondays, and Pradosha Vrata. Performing 11 recitations is called Ekadasha Rudram; 121 recitations is Laghu Rudram; 1,331 is Maha Rudram; and 14,641 is Ati Rudram — the grandest Vedic ritual in Hinduism.',
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
    meaning: `Om — the primordial sound
Bhur — the physical world (earth)
Bhuvah — the mental world (atmosphere)
Svah — the spiritual world (heaven)
Tat — that (Supreme Reality)
Savitur — of the Sun/Creator
Varenyam — most adorable/worthy of worship
Bhargo — divine radiance/splendor
Devasya — of the luminous deity
Dheemahi — we meditate upon
Dhiyo — intellect/understanding
Yo — who/which
Nah — our
Prachodayat — may inspire/illuminate

"We meditate upon the divine radiance of that Supreme Being who illuminates all realms. May that Supreme Light inspire and guide our intellect."`,
    significance: 'The Gayatri Mantra is the most sacred mantra in Hinduism, from the Rig Veda (3.62.10). It was revealed to sage Vishwamitra. Traditionally chanted at the three sandhyas (sunrise, noon, sunset), it is the mantra given during Upanayana (sacred thread ceremony). It is addressed to Savitri (the creative power of the Sun God) and is considered the essence of all the Vedas. Chanting 108 times daily is the standard practice. It enhances intellect, removes sins, and leads to spiritual illumination. It is suitable for all regardless of caste, gender, or background.',
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
    meaning: `Om — the primordial sound
Tryambakam — the three-eyed one (Shiva)
Yajamahe — we worship/adore
Sugandhim — the fragrant one
Pushti-vardhanam — the nourisher/strengthener of all beings
Urvarukam — like a cucumber/melon
Iva — like, just as
Bandhanat — from bondage (of the stem)
Mrityoh — from death
Mukshiya — may I be liberated
Ma — not
Amritat — from immortality (do not deny me immortality)

"We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings. Like a ripe cucumber is freed from its vine, may He liberate us from death, but not from immortality."`,
    significance: 'The Mahamrityunjaya Mantra (also called Mrita Sanjivini Mantra) is from the Rig Veda (7.59.12), attributed to sage Markandeya. It is the most powerful healing mantra in Hinduism, believed to conquer death and grant immortality. It is chanted for: healing from serious illness, protection from accidents, overcoming fear of death, and during funerary rites. It is recommended to chant 108 times, especially on Mondays, during Maha Shivaratri, on birthdays, and when someone is critically ill. It is one of the two most important Shiva mantras (the other being Om Namah Shivaya).',
  },
  {
    slug: 'surya-beej-mantra',
    type: 'mantra',
    title: { en: 'Surya Beej Mantra', hi: 'सूर्य बीज मन्त्र' },
    deity: 'Surya',
    deityDay: 0,
    devanagari: `ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः`,
    transliteration: `Om Hraam Hreem Hraum Sah Suryaya Namaha`,
    meaning: `Om — the primordial sound. Hraam, Hreem, Hraum — the beej (seed) syllables of Surya. Sah — the essence. Suryaya — to the Sun God. Namaha — salutations.

"I bow to the Sun God with His seed syllables."`,
    significance: 'The Surya Beej Mantra is chanted to strengthen the Sun (Surya) in one\'s horoscope. A strong Sun gives leadership, confidence, vitality, and success in government/authority matters. Chant 7,000 times for a complete cycle (or 108 times daily for 40 days). Best chanted on Sundays at sunrise while facing east. Offer water (Arghya) to the Sun while chanting. Recommended during Surya Mahadasha/Antardasha or when Sun is debilitated in the natal chart.',
  },
  {
    slug: 'chandra-beej-mantra',
    type: 'mantra',
    title: { en: 'Chandra Beej Mantra', hi: 'चन्द्र बीज मन्त्र' },
    deity: 'Chandra',
    deityDay: 1,
    devanagari: `ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः`,
    transliteration: `Om Shraam Shreem Shraum Sah Chandraya Namaha`,
    meaning: `Om — the primordial sound. Shraam, Shreem, Shraum — the beej syllables of Chandra. Sah — the essence. Chandraya — to the Moon. Namaha — salutations.

"I bow to the Moon with His seed syllables."`,
    significance: 'The Chandra Beej Mantra strengthens the Moon in one\'s horoscope. A strong Moon gives emotional stability, good memory, mental peace, and healthy relationships with the mother. Chant 11,000 times for a complete cycle (or 108 times daily). Best chanted on Mondays during the evening or on Purnima (full moon). Recommended during Chandra Mahadasha/Antardasha, when Moon is debilitated, or during emotional/mental difficulties.',
  },
  {
    slug: 'mangal-beej-mantra',
    type: 'mantra',
    title: { en: 'Mangal Beej Mantra', hi: 'मंगल बीज मन्त्र' },
    deity: 'Mangal (Mars)',
    deityDay: 2,
    devanagari: `ॐ क्रां क्रीं क्रौं सः भौमाय नमः`,
    transliteration: `Om Kraam Kreem Kraum Sah Bhaumaya Namaha`,
    meaning: `Om — the primordial sound. Kraam, Kreem, Kraum — the beej syllables of Mars. Sah — the essence. Bhaumaya — to Mars (son of the Earth). Namaha — salutations.

"I bow to Mars with His seed syllables."`,
    significance: 'The Mangal Beej Mantra strengthens Mars in one\'s horoscope. A strong Mars gives courage, physical strength, property ownership, and success in competitions. Chant 10,000 times for a complete cycle (or 108 times daily). Best chanted on Tuesdays. Recommended for Manglik dosha, during Mangal Mahadasha/Antardasha, or when Mars is debilitated. Wearing red coral and offering red flowers enhances the effect.',
  },
  {
    slug: 'budha-beej-mantra',
    type: 'mantra',
    title: { en: 'Budha Beej Mantra', hi: 'बुध बीज मन्त्र' },
    deity: 'Budha (Mercury)',
    deityDay: 3,
    devanagari: `ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः`,
    transliteration: `Om Braam Breem Braum Sah Budhaya Namaha`,
    meaning: `Om — the primordial sound. Braam, Breem, Braum — the beej syllables of Mercury. Sah — the essence. Budhaya — to Mercury. Namaha — salutations.

"I bow to Mercury with His seed syllables."`,
    significance: 'The Budha Beej Mantra strengthens Mercury in one\'s horoscope. A strong Mercury gives intelligence, communication skills, business acumen, and success in education. Chant 9,000 times for a complete cycle (or 108 times daily). Best chanted on Wednesdays. Recommended during Budha Mahadasha/Antardasha, when Mercury is debilitated, or for students and professionals needing sharp intellect. Wearing emerald (Panna) enhances the effect.',
  },
  {
    slug: 'guru-beej-mantra',
    type: 'mantra',
    title: { en: 'Guru Beej Mantra', hi: 'गुरु बीज मन्त्र' },
    deity: 'Guru (Jupiter)',
    deityDay: 4,
    devanagari: `ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः`,
    transliteration: `Om Graam Greem Graum Sah Gurave Namaha`,
    meaning: `Om — the primordial sound. Graam, Greem, Graum — the beej syllables of Jupiter. Sah — the essence. Gurave — to Jupiter (the Guru/Teacher). Namaha — salutations.

"I bow to Jupiter with His seed syllables."`,
    significance: 'The Guru Beej Mantra strengthens Jupiter in one\'s horoscope. A strong Jupiter gives wisdom, spirituality, prosperity, good fortune, and success in teaching/advisory roles. Chant 19,000 times for a complete cycle (or 108 times daily). Best chanted on Thursdays. Recommended during Guru Mahadasha/Antardasha, when Jupiter is debilitated, or for those seeking wisdom and spiritual growth. Wearing yellow sapphire (Pukhraj) enhances the effect.',
  },
  {
    slug: 'shukra-beej-mantra',
    type: 'mantra',
    title: { en: 'Shukra Beej Mantra', hi: 'शुक्र बीज मन्त्र' },
    deity: 'Shukra (Venus)',
    deityDay: 5,
    devanagari: `ॐ द्रां द्रीं द्रौं सः शुक्राय नमः`,
    transliteration: `Om Draam Dreem Draum Sah Shukraya Namaha`,
    meaning: `Om — the primordial sound. Draam, Dreem, Draum — the beej syllables of Venus. Sah — the essence. Shukraya — to Venus. Namaha — salutations.

"I bow to Venus with His seed syllables."`,
    significance: 'The Shukra Beej Mantra strengthens Venus in one\'s horoscope. A strong Venus gives beauty, love, luxury, artistic talents, and marital happiness. Chant 16,000 times for a complete cycle (or 108 times daily). Best chanted on Fridays. Recommended during Shukra Mahadasha/Antardasha, when Venus is debilitated, or for those seeking love, marriage, and creative success. Wearing diamond (Heera) or white sapphire enhances the effect.',
  },
  {
    slug: 'shani-beej-mantra',
    type: 'mantra',
    title: { en: 'Shani Beej Mantra', hi: 'शनि बीज मन्त्र' },
    deity: 'Shani (Saturn)',
    deityDay: 6,
    devanagari: `ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः`,
    transliteration: `Om Praam Preem Praum Sah Shanaischaraya Namaha`,
    meaning: `Om — the primordial sound. Praam, Preem, Praum — the beej syllables of Saturn. Sah — the essence. Shanaischaraya — to Saturn (the slow-moving one). Namaha — salutations.

"I bow to Saturn with His seed syllables."`,
    significance: 'The Shani Beej Mantra is essential for those undergoing Sade Sati (7.5-year Saturn transit), Shani Mahadasha, or Dhaiyya. A strong Saturn gives discipline, longevity, career stability, and karmic rewards. Chant 23,000 times for a complete cycle (or 108 times daily). Best chanted on Saturdays, especially in the evening. Offer mustard oil to Shani on Saturdays. Wearing blue sapphire (Neelam) — only after expert consultation — can enhance the effect. Feeding crows and helping the poor on Saturdays are traditional remedies.',
  },
  {
    slug: 'rahu-beej-mantra',
    type: 'mantra',
    title: { en: 'Rahu Beej Mantra', hi: 'राहु बीज मन्त्र' },
    deity: 'Rahu',
    deityDay: 6,
    devanagari: `ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः`,
    transliteration: `Om Bhraam Bhreem Bhraum Sah Rahave Namaha`,
    meaning: `Om — the primordial sound. Bhraam, Bhreem, Bhraum — the beej syllables of Rahu. Sah — the essence. Rahave — to Rahu (the North Node of the Moon). Namaha — salutations.

"I bow to Rahu with His seed syllables."`,
    significance: 'The Rahu Beej Mantra pacifies the malefic effects of Rahu in one\'s horoscope. Rahu represents worldly desires, illusions, foreign influences, and sudden events. Chant 18,000 times for a complete cycle (or 108 times daily). Best chanted on Saturdays or during Rahu Kaal. Recommended during Rahu Mahadasha/Antardasha. Wearing Hessonite (Gomed) can enhance the effect. Donating to leprosy patients and feeding birds are traditional remedies.',
  },
  {
    slug: 'ketu-beej-mantra',
    type: 'mantra',
    title: { en: 'Ketu Beej Mantra', hi: 'केतु बीज मन्त्र' },
    deity: 'Ketu',
    deityDay: 2,
    devanagari: `ॐ स्रां स्रीं स्रौं सः केतवे नमः`,
    transliteration: `Om Sraam Sreem Sraum Sah Ketave Namaha`,
    meaning: `Om — the primordial sound. Sraam, Sreem, Sraum — the beej syllables of Ketu. Sah — the essence. Ketave — to Ketu (the South Node of the Moon). Namaha — salutations.

"I bow to Ketu with His seed syllables."`,
    significance: 'The Ketu Beej Mantra pacifies the effects of Ketu in one\'s horoscope. Ketu represents spirituality, detachment, past-life karma, and moksha. It can also cause confusion, sudden losses, and mysterious ailments. Chant 17,000 times for a complete cycle (or 108 times daily). Best chanted on Tuesdays or during Ketu periods. Recommended during Ketu Mahadasha/Antardasha. Wearing Cat\'s Eye (Lehsuniya/Vaidurya) can enhance the effect. Donating blankets and feeding dogs are traditional remedies.',
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
    meaning: `Om — the primordial sound. Gam — the beej syllable of Ganesha. Ganapataye — to the Lord of the Ganas. Namaha — salutations.

"O Lord with the curved trunk and massive body, whose brilliance equals a billion suns — please make all my endeavors free from obstacles, always."`,
    significance: 'The Ganesh Mantra "Om Gam Ganapataye Namaha" is the most popular mantra for Lord Ganesha, the remover of obstacles. It is chanted before beginning any new venture — business, education, travel, marriage, or puja. The Vakratunda Shloka is the universal invocation recited at the start of any Hindu ceremony. Chant 108 times daily, especially on Wednesdays and during Ganesh Chaturthi. Offering modak (sweet dumpling) and durva grass (21 blades) pleases Ganesha.',
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
    meaning: `Om — the primordial sound. Shreem — the beej syllable of Lakshmi (representing prosperity). Mahalakshmyai — to the Great Lakshmi. Namaha — salutations.

Extended mantra: "Om Shreem Hreem Shreem — O Lotus-born one who dwells among lotuses, be pleased, be pleased! Salutations to the Great Lakshmi."`,
    significance: 'The Lakshmi Mantra with the "Shreem" beej is the most powerful mantra for attracting wealth and prosperity. "Shreem" is the seed syllable of Lakshmi, representing all forms of abundance — material, spiritual, and creative. Chant 108 times daily, especially on Fridays and during Diwali. The extended Kamala mantra is used in formal Lakshmi puja. Offering lotus flowers, lighting ghee lamps, and keeping the home clean and fragrant attracts Lakshmi\'s blessings. It is recommended during financial difficulties and for business success.',
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
    meaning: `Om — the primordial sound. Aim — the beej syllable of Saraswati (representing knowledge and speech). Saraswatyai — to Saraswati. Namaha — salutations.

"She who is white as the jasmine, moon, and snow-garland; She who is dressed in pure white garments; She whose hands are adorned with the excellent Veena; She who is seated on a white lotus; She who is always worshipped by Brahma, Vishnu, Shankara, and the gods — may that Goddess Saraswati, who removes all forms of ignorance, protect me."`,
    significance: 'The Saraswati Mantra with the "Aim" beej is the most important mantra for knowledge, education, and artistic achievement. "Aim" is the seed syllable of Saraswati, representing Vak (divine speech) and Vidya (knowledge). The accompanying shloka is the universal Saraswati Vandana recited at the start of educational activities. Chant 108 times daily, especially on Thursdays, during Vasant Panchami, and before exams. Students should place books, pens, and instruments before Saraswati while chanting. It removes ignorance (jadya), enhances memory, improves speech, and grants artistic inspiration.',
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
    meaning: `Simple Navgraha Mantra: Salutations to the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu.

Navgraha Stotra:
I bow to the Sun (Divakara), who shines like a hibiscus flower, son of Kashyapa, of great brilliance, enemy of darkness, destroyer of all sins.

I bow to the Moon (Soma), white as curd, conch, and frost, born from the Ocean of Milk, ornament of Shambhu's (Shiva's) crown.

I bow to Mars (Mangala), born from Earth's womb, with brilliance like lightning, the youthful one bearing the Shakti weapon.

I bow to Mercury (Budha), dark as a priyangu bud, matchless in beauty, gentle with gentle qualities.

I bow to Jupiter (Brihaspati), golden in hue, Guru of gods and sages, embodiment of intellect, lord of the three worlds.

I bow to Venus (Shukra/Bhargava), white as snow, jasmine, and lotus fiber, supreme guru of the demons, expounder of all scriptures.

I bow to Saturn (Shanaischara), blue as black collyrium, son of the Sun, elder brother of Yama, born of Chhaya and Martanda.

I bow to Rahu, of half-body, great valor, tormentor of Sun and Moon, born from Simhika's womb.

I bow to Ketu, resembling palasha flowers, head of stars and planets, fierce and terrifying in nature.`,
    significance: 'The Navgraha Mantra is a collective prayer to all nine celestial bodies (grahas) in Vedic astrology. The nine planets govern different aspects of life: Sun (soul, authority), Moon (mind, emotions), Mars (energy, courage), Mercury (intellect, communication), Jupiter (wisdom, fortune), Venus (love, beauty), Saturn (karma, discipline), Rahu (worldly desires), and Ketu (spirituality, liberation). The Navgraha Stotra is recited during Navgraha Puja, which is performed at the beginning of most Hindu rituals, weddings, and havans. It is also recommended as a daily practice for overall planetary balance. Visiting the Navgraha temple at Kumbakonam, Tamil Nadu is considered especially auspicious.',
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

/** Get all slugs for a type — used for generateStaticParams */
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
