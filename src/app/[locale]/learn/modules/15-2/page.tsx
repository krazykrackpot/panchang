'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_15_2', phase: 4, topic: 'Remedial Measures', moduleNumber: '15.2',
  title: { en: 'Remedial Measures — Mantras & Pujas', hi: 'उपचार — मन्त्र एवं पूजा' },
  subtitle: {
    en: 'Beej mantras, Gayatri mantras, Navagraha puja, homa, and charity remedies for each planet',
    hi: 'बीज मन्त्र, गायत्री मन्त्र, नवग्रह पूजा, होम और प्रत्येक ग्रह के लिए दान उपचार',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 15-1: Gemstones', hi: 'मॉड्यूल 15-1: रत्न' }, href: '/learn/modules/15-1' },
    { label: { en: 'Module 15-3: Prashna Astrology', hi: 'मॉड्यूल 15-3: प्रश्न ज्योतिष' }, href: '/learn/modules/15-3' },
    { label: { en: 'Module 15-4: Varshaphal & KP', hi: 'मॉड्यूल 15-4: वर्षफल एवं के.पी.' }, href: '/learn/modules/15-4' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q15_2_01', type: 'mcq',
    question: {
      en: 'What is the Beej (seed) mantra for the Sun?',
      hi: 'सूर्य का बीज मन्त्र क्या है?',
    },
    options: [
      { en: 'Om Shraam Shreem Shraum Sah Chandraya Namah', hi: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः' },
      { en: 'Om Hraam Hreem Hraum Sah Suryaya Namah', hi: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः' },
      { en: 'Om Braam Breem Braum Sah Budhaya Namah', hi: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः' },
      { en: 'Om Graam Greem Graum Sah Gurave Namah', hi: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '"Om Hraam Hreem Hraum Sah Suryaya Namah" is the Beej mantra for the Sun. The syllables Hraam, Hreem, Hraum are the seed sounds that resonate with Solar energy. It should be chanted 7,000 times (or multiples of 108) on Sundays during Surya Hora.',
      hi: '"ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः" सूर्य का बीज मन्त्र है। ह्रां, ह्रीं, ह्रौं बीजाक्षर हैं जो सौर ऊर्जा से अनुनादित होते हैं। इसे रविवार को सूर्य होरा में 7,000 बार (या 108 के गुणक में) जपना चाहिए।',
    },
  },
  {
    id: 'q15_2_02', type: 'mcq',
    question: {
      en: 'How many times is a planetary mantra typically chanted in one cycle?',
      hi: 'ग्रह मन्त्र एक चक्र में सामान्यतः कितनी बार जपा जाता है?',
    },
    options: [
      { en: '21 times', hi: '21 बार' },
      { en: '108 times (one mala)', hi: '108 बार (एक माला)' },
      { en: '1000 times', hi: '1000 बार' },
      { en: 'Any random number', hi: 'कोई भी यादृच्छिक संख्या' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '108 is the sacred count in Vedic tradition — one full cycle of a japa mala (prayer bead rosary). The number 108 has deep mathematical and astronomical significance: the Sun\'s diameter is approximately 108 times the Earth\'s diameter. Planetary mantras are chanted in multiples of 108.',
      hi: '108 वैदिक परम्परा में पवित्र संख्या है — जप माला (प्रार्थना मनकों की माला) का एक पूर्ण चक्र। 108 का गहरा गणितीय और खगोलीय महत्त्व है: सूर्य का व्यास पृथ्वी के व्यास का लगभग 108 गुना है। ग्रह मन्त्रों को 108 के गुणक में जपा जाता है।',
    },
  },
  {
    id: 'q15_2_03', type: 'true_false',
    question: {
      en: 'The Sankalpa (intention) taken before a puja is considered as important as the puja ritual itself.',
      hi: 'पूजा से पहले लिया गया संकल्प (इरादा) पूजा विधि जितना ही महत्त्वपूर्ण माना जाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The Sankalpa is a formal declaration of intent that directs the energy of the ritual. Without a clear Sankalpa, the puja becomes a mechanical exercise. The sincerity and clarity of intention are believed to determine the efficacy of any remedial measure.',
      hi: 'सत्य। संकल्प इरादे की एक औपचारिक घोषणा है जो अनुष्ठान की ऊर्जा को दिशा देती है। स्पष्ट संकल्प के बिना पूजा एक यान्त्रिक क्रिया बन जाती है। इरादे की ईमानदारी और स्पष्टता किसी भी उपचार की प्रभावकारिता निर्धारित करती है।',
    },
  },
  {
    id: 'q15_2_04', type: 'mcq',
    question: {
      en: 'Which puja/homa is specifically prescribed for Saturn-related afflictions like Sade Sati?',
      hi: 'साढ़े साती जैसी शनि सम्बन्धी पीड़ाओं के लिए विशेष रूप से कौन-सी पूजा/होम निर्धारित है?',
    },
    options: [
      { en: 'Chandi Path', hi: 'चण्डी पाठ' },
      { en: 'Rudrabhishek and Shani Shingnapur puja', hi: 'रुद्राभिषेक और शनि शिंगणापुर पूजा' },
      { en: 'Satyanarayan Katha', hi: 'सत्यनारायण कथा' },
      { en: 'Hanuman Chalisa only', hi: 'केवल हनुमान चालीसा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Rudrabhishek (abhishek of Shiva Lingam with milk, water, honey) is the primary remedy for Saturn afflictions. Saturn is considered a devotee of Lord Shiva, and Shiva worship pacifies Saturn\'s harshness. Shani temples like Shingnapur are also visited for Saturn relief.',
      hi: 'रुद्राभिषेक (शिवलिंग पर दुग्ध, जल, मधु से अभिषेक) शनि पीड़ाओं का प्राथमिक उपचार है। शनि को भगवान शिव का भक्त माना जाता है, और शिव पूजा शनि की कठोरता को शान्त करती है। शनि मन्दिर जैसे शिंगणापुर भी शनि राहत के लिए दर्शनीय हैं।',
    },
  },
  {
    id: 'q15_2_05', type: 'mcq',
    question: {
      en: 'What are the charity (Daan) items associated with Saturn?',
      hi: 'शनि से सम्बन्धित दान की वस्तुएँ कौन-सी हैं?',
    },
    options: [
      { en: 'Red lentils and jaggery on Tuesday', hi: 'मंगलवार को लाल मसूर और गुड़' },
      { en: 'Mustard oil, black sesame, iron tools on Saturday', hi: 'शनिवार को सरसों का तेल, काले तिल, लोहे के उपकरण' },
      { en: 'Green moong dal and emeralds on Wednesday', hi: 'बुधवार को हरी मूँग दाल और पन्ने' },
      { en: 'White rice and pearls on Monday', hi: 'सोमवार को सफ़ेद चावल और मोती' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Saturn\'s charity items are black-colored: mustard oil, black sesame (til), black cloth, iron utensils or tools. These are donated on Saturday (Saturn\'s day) to the needy, particularly to laborers, the elderly, or the disabled — all Saturn-signified groups.',
      hi: 'शनि की दान-वस्तुएँ काले रंग की होती हैं: सरसों का तेल, काले तिल, काला वस्त्र, लोहे के बर्तन या उपकरण। ये शनिवार (शनि का दिन) को जरूरतमन्दों को, विशेषकर श्रमिकों, वृद्धों या विकलांगों — सभी शनि-सूचित वर्गों — को दान किए जाते हैं।',
    },
  },
  {
    id: 'q15_2_06', type: 'true_false',
    question: {
      en: 'Charity (Daan) remedies work by redirecting karmic energy — you give away the significations of a troublesome planet to reduce its negative grip on your life.',
      hi: 'दान उपचार कार्मिक ऊर्जा को पुनर्निर्देशित करके कार्य करते हैं — आप एक कठिन ग्रह की सूचनाओं को दान करके अपने जीवन पर उसकी नकारात्मक पकड़ कम करते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. This is the traditional rationale for Daan. By voluntarily parting with items ruled by the afflicting planet (e.g., Saturn = black items, iron), you create a symbolic release of that planet\'s karmic burden. The recipient becomes a channel through which the excess negative energy is dispersed.',
      hi: 'सत्य। यह दान का पारम्परिक तर्क है। पीड़ित ग्रह की शासित वस्तुओं (जैसे शनि = काली वस्तुएँ, लोहा) को स्वेच्छा से त्यागकर आप उस ग्रह के कार्मिक भार का प्रतीकात्मक विमोचन करते हैं। प्राप्तकर्ता एक माध्यम बनता है जिसके द्वारा अतिरिक्त नकारात्मक ऊर्जा विसर्जित होती है।',
    },
  },
  {
    id: 'q15_2_07', type: 'mcq',
    question: {
      en: 'When should a planetary mantra ideally be chanted for maximum effect?',
      hi: 'अधिकतम प्रभाव के लिए ग्रह मन्त्र आदर्श रूप से कब जपना चाहिए?',
    },
    options: [
      { en: 'Any time, it makes no difference', hi: 'कभी भी, इससे कोई अन्तर नहीं पड़ता' },
      { en: 'During that planet\'s hora on that planet\'s day', hi: 'उस ग्रह के दिन उस ग्रह की होरा में' },
      { en: 'Only during eclipses', hi: 'केवल ग्रहण के समय' },
      { en: 'Only during retrograde periods', hi: 'केवल वक्री काल में' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The ideal time is during the planet\'s hora on its own weekday: Sun mantra on Sunday during Surya Hora, Moon mantra on Monday during Chandra Hora, etc. Brahma Muhurta (1.5 hours before sunrise) is also considered universally auspicious for any japa.',
      hi: 'आदर्श समय उस ग्रह के अपने वार में उसकी होरा में है: रविवार को सूर्य होरा में सूर्य मन्त्र, सोमवार को चन्द्र होरा में चन्द्र मन्त्र, आदि। ब्रह्म मुहूर्त (सूर्योदय से 1.5 घण्टे पहले) भी किसी भी जप के लिए सार्वभौमिक रूप से शुभ माना जाता है।',
    },
  },
  {
    id: 'q15_2_08', type: 'mcq',
    question: {
      en: 'Which Homa (fire ritual) is prescribed specifically for Mars-related afflictions like Mangal Dosha?',
      hi: 'मंगल दोष जैसी मंगल सम्बन्धी पीड़ाओं के लिए विशेष रूप से कौन-सा होम (अग्नि अनुष्ठान) निर्धारित है?',
    },
    options: [
      { en: 'Navagraha Homa', hi: 'नवग्रह होम' },
      { en: 'Mangal Shanti Homa and Chandi Path', hi: 'मंगल शान्ति होम और चण्डी पाठ' },
      { en: 'Ganapati Homa', hi: 'गणपति होम' },
      { en: 'Sudarshana Homa', hi: 'सुदर्शन होम' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mangal Shanti Homa is specifically for pacifying Mars. Chandi Path (700 verses from Markandeya Purana, invoking Goddess Durga) is also prescribed because Durga is the presiding deity associated with Mars\'s fierce energy. Red items (flowers, cloth) are offered.',
      hi: 'मंगल शान्ति होम विशेष रूप से मंगल को शान्त करने के लिए है। चण्डी पाठ (मार्कण्डेय पुराण के 700 श्लोक, देवी दुर्गा का आह्वान) भी निर्धारित है क्योंकि दुर्गा मंगल की उग्र ऊर्जा से जुड़ी अधिष्ठात्री देवी हैं। लाल वस्तुएँ (पुष्प, वस्त्र) अर्पित की जाती हैं।',
    },
  },
  {
    id: 'q15_2_09', type: 'true_false',
    question: {
      en: 'Paying large sums to astrologers or priests for "special pujas" is the most effective remedy in Jyotish.',
      hi: '"विशेष पूजाओं" के लिए ज्योतिषियों या पुजारियों को बड़ी रकम देना ज्योतिष में सबसे प्रभावी उपचार है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Classical texts emphasize sincerity, self-performed japa, and genuine charity over expensive rituals. The commercialization of remedies is a legitimate controversy in modern Jyotish. Simple, consistent mantra japa done with devotion is considered more powerful than an elaborate paid ceremony done without personal involvement.',
      hi: 'असत्य। शास्त्रीय ग्रन्थ महँगे अनुष्ठानों से अधिक ईमानदारी, स्वयं किया गया जप और वास्तविक दान पर बल देते हैं। उपचारों का व्यावसायीकरण आधुनिक ज्योतिष में एक वैध विवाद है। भक्तिपूर्वक किया गया सरल, नियमित मन्त्र जप व्यक्तिगत सहभागिता के बिना किए गए विस्तृत सशुल्क अनुष्ठान से अधिक शक्तिशाली माना जाता है।',
    },
  },
  {
    id: 'q15_2_10', type: 'mcq',
    question: {
      en: 'What are the charity items for Mars, donated on Tuesday?',
      hi: 'मंगलवार को दान की जाने वाली मंगल की वस्तुएँ कौन-सी हैं?',
    },
    options: [
      { en: 'White rice, silver, milk', hi: 'सफ़ेद चावल, चाँदी, दूध' },
      { en: 'Red lentils (masoor dal), jaggery (gur), red cloth', hi: 'लाल मसूर दाल, गुड़, लाल वस्त्र' },
      { en: 'Yellow cloth, turmeric, bananas', hi: 'पीला वस्त्र, हल्दी, केले' },
      { en: 'Black sesame, mustard oil, iron', hi: 'काले तिल, सरसों का तेल, लोहा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mars\'s charity items are red-colored: red lentils (masoor dal), jaggery (gur), red cloth, copper utensils, and wheat. These are donated on Tuesday to young men, soldiers, or brothers — Mars-signified recipients.',
      hi: 'मंगल की दान-वस्तुएँ लाल रंग की होती हैं: लाल मसूर दाल, गुड़, लाल वस्त्र, ताँबे के बर्तन और गेहूँ। ये मंगलवार को युवकों, सैनिकों या भाइयों — मंगल-सूचित प्राप्तकर्ताओं — को दान की जाती हैं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'मन्त्र उपचार — पवित्र ध्वनि का विज्ञान' : 'Mantra Remedies — The Science of Sacred Sound'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>वैदिक परम्परा में ध्वनि (शब्द) को ऊर्जा का सबसे मूलभूत रूप माना जाता है — ब्रह्माण्ड स्वयं ॐ के आदिम कम्पन से रचा गया था। मन्त्र सटीक रूप से संरचित ध्वनि सूत्र हैं जो विशिष्ट ब्रह्माण्डीय आवृत्तियों से अनुनादित होते हैं। प्रत्येक ग्रह के दो प्राथमिक मन्त्र हैं: बीज मन्त्र जिसमें कुछ अक्षरों में ग्रहीय ऊर्जा का संकेन्द्रित सार होता है, और गायत्री मन्त्र जो ग्रह के देवता को सम्बोधित एक लम्बा, विस्तृत आह्वान है।</>

            : <>In Vedic tradition, sound (shabda) is considered the most fundamental form of energy — the universe itself was created from the primordial vibration of Om. Mantras are precisely structured sound formulas that resonate with specific cosmic frequencies. Each planet has two primary mantras: a Beej (seed) mantra containing the concentrated essence of the planetary energy in a few syllables, and a Gayatri mantra that is a longer, more elaborate invocation addressed to the planet&apos;s deity.</>}

        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>नौ बीज मन्त्र हैं: सूर्य — &quot;ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः&quot;; चन्द्र — &quot;ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः&quot;; मंगल — &quot;ॐ क्रां क्रीं क्रौं सः भौमाय नमः&quot;; बुध — &quot;ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः&quot;; गुरु — &quot;ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः&quot;; शुक्र — &quot;ॐ द्रां द्रीं द्रौं सः शुक्राय नमः&quot;; शनि — &quot;ॐ प्रां प्रीं प्रौं सः शनये नमः&quot;; राहु — &quot;ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः&quot;; केतु — &quot;ॐ स्रां स्रीं स्रौं सः केतवे नमः।&quot; प्रत्येक 108 के गुणक में, सम्बन्धित ग्रह के दिन और होरा में जपा जाता है।</>

            : <>The nine Beej mantras are: Sun — &quot;Om Hraam Hreem Hraum Sah Suryaya Namah&quot;; Moon — &quot;Om Shraam Shreem Shraum Sah Chandraya Namah&quot;; Mars — &quot;Om Kraam Kreem Kraum Sah Bhaumaya Namah&quot;; Mercury — &quot;Om Braam Breem Braum Sah Budhaya Namah&quot;; Jupiter — &quot;Om Graam Greem Graum Sah Gurave Namah&quot;; Venus — &quot;Om Draam Dreem Draum Sah Shukraya Namah&quot;; Saturn — &quot;Om Praam Preem Praum Sah Shanaye Namah&quot;; Rahu — &quot;Om Bhraam Bhreem Bhraum Sah Rahave Namah&quot;; Ketu — &quot;Om Sraam Sreem Sraum Sah Ketave Namah.&quot;</>}

        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'जप संख्या एवं समय' : 'Repetition Counts & Timing'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">

          {isHi

            ? <>शास्त्रीय ग्रन्थ प्रत्येक ग्रह के लिए विशिष्ट जप संख्या निर्धारित करते हैं: सूर्य — 7,000; चन्द्र — 11,000; मंगल — 10,000; बुध — 9,000; गुरु — 19,000; शुक्र — 16,000; शनि — 23,000; राहु — 18,000; केतु — 17,000। ये कुल संख्या है जो दिनों या सप्ताहों में पूर्ण की जाती है (सामान्यतः प्रति बैठक 108 के गुणक में)। आदर्श समय ब्रह्म मुहूर्त (सूर्योदय से लगभग 1.5 घण्टे पहले) या ग्रह के अपने वार में उसकी होरा है। गिनती के लिए तुलसी या रुद्राक्ष माला का प्रयोग किया जाता है।</>

            : <>Classical texts prescribe specific japa counts for each planet: Sun — 7,000; Moon — 11,000; Mars — 10,000; Mercury — 9,000; Jupiter — 19,000; Venus — 16,000; Saturn — 23,000; Rahu — 18,000; Ketu — 17,000. These are total counts to be completed over days or weeks (typically in multiples of 108 per sitting). The ideal time is Brahma Muhurta (approximately 1.5 hours before sunrise) or during the planet&apos;s own hora on its weekday. A tulsi or rudraksha mala is used for counting.</>}

        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'पूजा एवं होम उपचार' : 'Puja & Homa Remedies'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>जहाँ मन्त्र व्यक्तिगत हैं और कहीं भी जपे जा सकते हैं, पूजा और होम अधिक विस्तृत अनुष्ठानिक हस्तक्षेप हैं। नवग्रह पूजा सबसे व्यापक है — यह सभी नौ ग्रहों की एक साथ पूजा करती है, समग्र ग्रहीय सामंजस्य पुनर्स्थापित करती है। यह आदर्श है जब अनेक ग्रह पीड़ित हों या जब आप अनिश्चित हों कि किस विशिष्ट ग्रह पर ध्यान देना है। इसमें नौ रंगीन वस्त्र (नौ ग्रहों का प्रतिनिधित्व) स्थापित करना, उनके सम्बन्धित अन्न (सूर्य के लिए गेहूँ, चन्द्र के लिए चावल, मंगल के लिए लाल मसूर, आदि) रखना, और प्रत्येक ग्रह का विशिष्ट मन्त्र और अर्पण सहित आह्वान करना सम्मिलित है।</>

            : <>While mantras are personal and can be chanted anywhere, pujas and homas are more elaborate ritual interventions. The Navagraha Puja is the most comprehensive — it worships all nine planets simultaneously, restoring overall planetary harmony. This is ideal when multiple planets are afflicted or when you are unsure which specific planet needs attention. It involves installing nine colored cloths (representing the nine planets), placing their respective grains (wheat for Sun, rice for Moon, red lentil for Mars, etc.), and invoking each planet with its specific mantra and offerings.</>}

        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>लक्षित राहत के लिए विशिष्ट ग्रह पूजाएँ की जाती हैं। रुद्राभिषेक (शिवलिंग को दुग्ध, जल, मधु, दही और घी से स्नान) शनि पीड़ाओं और साढ़े साती का प्राथमिक उपचार है। शनि को शिव का भक्त माना जाता है, और शिव पूजा कठोरतम शनि काल को भी शान्त करती है। चण्डी पाठ (मार्कण्डेय पुराण की दुर्गा सप्तशती के 700 श्लोकों का पाठ) मंगल पीड़ा और मंगल दोष के लिए निर्धारित है — देवी दुर्गा की उग्र ऊर्जा मंगल से संरेखित है।</>

            : <>For targeted relief, specific planet pujas are performed. Rudrabhishek (bathing the Shiva Lingam with milk, water, honey, curd, and ghee) is the primary remedy for Saturn afflictions and Sade Sati. Saturn is considered a devotee of Shiva, and Shiva worship is believed to pacify even the harshest Saturnine periods. Chandi Path (recitation of the 700 verses of Durga Saptashati from Markandeya Purana) is prescribed for Mars afflictions and Mangal Dosha — Goddess Durga&apos;s fierce energy is aligned with Mars.</>}

        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'संकल्प की भूमिका' : 'The Role of Sankalpa'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <>प्रत्येक वैदिक अनुष्ठान संकल्प से आरम्भ होता है — इरादे की औपचारिक मौखिक घोषणा जिसमें दिनांक (तिथि, नक्षत्र, योग, करण), स्थान, कर्ता का नाम और गोत्र, तथा अनुष्ठान का विशिष्ट उद्देश्य सम्मिलित होता है। संकल्प अनुष्ठान की ऊर्जा को एक निर्धारित लक्ष्य की ओर संचालित करता है। इसके बिना पूजा बिना पते के पत्र समान है। संकल्प सामान्यतः एक निर्धारित सूत्र का अनुसरण करता है: &quot;इस दिन [तिथि], इस नक्षत्र में, इस वर्ष, मैं [नाम], [गोत्र] का, [विशिष्ट इरादे] के उद्देश्य से यह [अनुष्ठान] करता हूँ।&quot;</>

            : <>Every Vedic ritual begins with a Sankalpa — a formal verbal declaration of intent that includes the date (tithi, nakshatra, yoga, karana), location, the performer&apos;s name and gotra, and the specific purpose of the ritual. The Sankalpa channels the ritual&apos;s energy toward a defined goal. Without it, the puja is like a letter without an address. The Sankalpa typically follows a set formula: &quot;On this day [tithi], in this nakshatra, in this year, I [name], of [gotra], perform this [ritual] for the purpose of [specific intention].&quot;</>}

        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'ग्रह अनुसार मन्दिर पूजा' : 'Temple Worship by Planet'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Each planet has associated deities and temples: Sun — Surya temples (Konark, Modhera), offer red flowers; Moon — Shiva temples (Chandra is a devotee of Shiva), offer white flowers and milk; Mars — Hanuman and Kartikeya temples, offer red flowers and sindoor; Mercury — Vishnu temples, offer green items and durva grass; Jupiter — any temple (guru of devas), offer yellow flowers and turmeric; Venus — Lakshmi temples, offer white flowers and sweets; Saturn — Shani temples (Shingnapur, Thirunallar), offer mustard oil lamps; Rahu — Durga temples, offer blue flowers; Ketu — Ganesha temples, offer kusha grass. Visiting the relevant temple on the planet&apos;s weekday enhances the remedial effect.
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'दान उपचार' : 'Charity (Daan) Remedies'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Charity (Daan) is perhaps the most accessible and universally recommended remedial measure. The principle is elegant: by voluntarily giving away items associated with a troublesome planet, you symbolically release that planet&apos;s karmic grip on your life. Each planet has specific charity items, a designated day, and an ideal recipient. The items correspond to the planet&apos;s natural significations — colors, grains, metals, and materials that resonate with its energy.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          दान सम्भवतः सबसे सुलभ और सार्वभौमिक रूप से अनुशंसित उपचार है। सिद्धान्त सुन्दर है: एक कठिन ग्रह से जुड़ी वस्तुओं को स्वेच्छा से दान करके आप प्रतीकात्मक रूप से अपने जीवन पर उस ग्रह की कार्मिक पकड़ को मुक्त करते हैं। प्रत्येक ग्रह की विशिष्ट दान-वस्तुएँ, निर्धारित दिन और आदर्श प्राप्तकर्ता है। वस्तुएँ ग्रह की प्राकृतिक सूचनाओं — रंग, अन्न, धातु और सामग्री — से मेल खाती हैं जो उसकी ऊर्जा से अनुनादित होती हैं।
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>सम्पूर्ण ग्रह-दान सन्दर्भ: सूर्य (रविवार) — गेहूँ, गुड़, ताँबा, लाल वस्त्र पितृ-तुल्य या सरकारी अधिकारियों को; चन्द्र (सोमवार) — सफ़ेद चावल, दूध, चाँदी, सफ़ेद वस्त्र माताओं या वृद्ध महिलाओं को; मंगल (मंगलवार) — लाल मसूर दाल, गुड़, लाल वस्त्र, ताँबा भाइयों या सैनिकों को; बुध (बुधवार) — हरी मूँग दाल, हरा वस्त्र, पन्ना-वर्णी वस्तुएँ विद्यार्थियों या विद्वानों को; गुरु (गुरुवार) — पीली वस्तुएँ, हल्दी, केले, पीला वस्त्र ब्राह्मणों या गुरुओं को; शुक्र (शुक्रवार) — सफ़ेद वस्तुएँ, घी, चीनी, रेशम महिलाओं को; शनि (शनिवार) — सरसों का तेल, काले तिल, लोहे के उपकरण, काला वस्त्र श्रमिकों, वृद्धों या विकलांगों को; राहु (शनिवार) — नीला वस्त्र, सीसा, सरसों बहिष्कृतों को; केतु (मंगलवार) — बहुरंगी कम्बल, तिल साधुओं को।</>

            : <>The complete planet-charity reference: Sun (Sunday) — wheat, jaggery, copper, red cloth to father figures or government officials; Moon (Monday) — white rice, milk, silver, white cloth to mothers or elderly women; Mars (Tuesday) — red lentils (masoor dal), jaggery, red cloth, copper to brothers or soldiers; Mercury (Wednesday) — green moong dal, green cloth, emerald-colored items to students or scholars; Jupiter (Thursday) — yellow items, turmeric, bananas, yellow cloth to Brahmins or teachers; Venus (Friday) — white items, ghee, sugar, silk to women; Saturn (Saturday) — mustard oil, black sesame, iron tools, black cloth to laborers, the elderly, or disabled; Rahu (Saturday) — blue cloth, lead, mustard to outcasts; Ketu (Tuesday) — multicolored blanket, sesame, to sadhus.</>}

        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'विवाद — उपचारों के लिए भुगतान' : 'The Controversy — Paying for Remedies'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <>आधुनिक ज्योतिष में एक महत्त्वपूर्ण विवाद उपचारों का व्यावसायीकरण है। कुछ ज्योतिषी महँगी पूजाएँ, रत्न और अनुष्ठान निर्धारित करते हैं जो ग्राहक की कुण्डली से अधिक उनकी अपनी आय को लाभ पहुँचाते हैं। बी.पी.एच.एस. और फलदीपिका जैसे शास्त्रीय ग्रन्थ इस बात पर बल देते हैं कि सबसे शक्तिशाली उपचार वे हैं जो व्यक्तिगत ईमानदारी से किए जाएँ: नियमित स्व-जप, अपनी कमाई से वास्तविक दान, और भक्तिपूर्ण समर्पण। जातक की सहभागिता के बिना किराये के पुजारी द्वारा की गई महँगी पूजा का कार्मिक भार पूर्ण भक्ति से जपे गए सरल दैनिक मन्त्र से कहीं कम है।</>

            : <>A significant controversy in modern Jyotish is the commercialization of remedies. Some astrologers prescribe expensive pujas, gemstones, and rituals that benefit their own income more than the client&apos;s chart. Classical texts like BPHS and Phaladeepika emphasize that the most powerful remedies are those performed with personal sincerity: regular self-performed japa, genuine charity from one&apos;s own earnings, and devotional surrender. An expensive puja performed by a hired priest without the native&apos;s involvement has far less karmic weight than a simple daily mantra chanted with full devotion.</>}

        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'उपचारों का क्रम' : 'Hierarchy of Remedies'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Classical texts suggest a hierarchy of remedial effectiveness: (1) Mantra japa — the most personal and powerful, requires only time and devotion; (2) Daan (charity) — directly generates positive karma by helping others; (3) Puja and Homa — formal rituals that invoke divine intervention; (4) Gemstones — passive remedies that work continuously but amplify rather than pacify; (5) Yantra — mystical diagrams that serve as focal points for planetary energy. The best approach combines multiple levels: wear the appropriate gemstone while performing daily japa and regular charity on the relevant day. Consistency matters more than intensity — 108 mantras daily for a year outweighs a one-time elaborate homa.
        </p>
      </section>
    </div>
  );
}

export default function Module15_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
