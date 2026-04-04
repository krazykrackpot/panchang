'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_15_1', phase: 4, topic: 'Remedial Measures', moduleNumber: '15.1',
  title: { en: 'Remedial Measures — Gemstones (Ratna Shastra)', hi: 'उपचार — रत्न शास्त्र' },
  subtitle: {
    en: 'Each planet has a primary gemstone that amplifies its energy — but wearing the wrong one can cause harm',
    hi: 'प्रत्येक ग्रह का एक प्राथमिक रत्न है जो उसकी ऊर्जा को प्रवर्धित करता है — परन्तु गलत रत्न धारण करना हानिकारक हो सकता है',
  },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 15-2: Mantras & Pujas', hi: 'मॉड्यूल 15-2: मन्त्र एवं पूजा' }, href: '/learn/modules/15-2' },
    { label: { en: 'Module 15-3: Prashna Astrology', hi: 'मॉड्यूल 15-3: प्रश्न ज्योतिष' }, href: '/learn/modules/15-3' },
    { label: { en: 'Module 15-4: Varshaphal & KP', hi: 'मॉड्यूल 15-4: वर्षफल एवं के.पी.' }, href: '/learn/modules/15-4' },
    { label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q15_1_01', type: 'mcq',
    question: {
      en: 'Which gemstone is associated with the Sun (Surya)?',
      hi: 'सूर्य से कौन-सा रत्न सम्बन्धित है?',
    },
    options: [
      { en: 'Pearl (Moti)', hi: 'मोती' },
      { en: 'Ruby (Manikya)', hi: 'माणिक्य' },
      { en: 'Emerald (Panna)', hi: 'पन्ना' },
      { en: 'Diamond (Heera)', hi: 'हीरा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Ruby (Manikya) is the primary gemstone for the Sun. It enhances vitality, authority, and self-confidence. It should be set in gold and worn on the ring finger on a Sunday during Surya Hora.',
      hi: 'माणिक्य (रूबी) सूर्य का प्राथमिक रत्न है। यह जीवनशक्ति, अधिकार और आत्मविश्वास को बढ़ाता है। इसे स्वर्ण में जड़कर रविवार को सूर्य होरा में अनामिका में धारण करना चाहिए।',
    },
  },
  {
    id: 'q15_1_02', type: 'mcq',
    question: {
      en: 'Why should you NEVER wear a gemstone for a functional malefic planet in your chart?',
      hi: 'अपनी कुण्डली में कार्यात्मक पापी ग्रह का रत्न क्यों नहीं पहनना चाहिए?',
    },
    options: [
      { en: 'Because malefic planets have no gemstones', hi: 'क्योंकि पापी ग्रहों के कोई रत्न नहीं होते' },
      { en: 'Because it amplifies the harmful energy of a planet that rules bad houses for your lagna', hi: 'क्योंकि यह आपके लग्न के लिए अशुभ भावों के स्वामी ग्रह की हानिकारक ऊर्जा को प्रवर्धित करता है' },
      { en: 'Because gemstones only work for benefic planets', hi: 'क्योंकि रत्न केवल शुभ ग्रहों के लिए कार्य करते हैं' },
      { en: 'Because it is too expensive', hi: 'क्योंकि यह बहुत महँगा है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A gemstone strengthens the planet it represents. If that planet is a functional malefic (rules 6th, 8th, or 12th houses for your lagna), strengthening it amplifies obstacles, losses, or illness. This is the cardinal rule of Ratna Shastra.',
      hi: 'रत्न उस ग्रह को सशक्त करता है जिसका वह प्रतिनिधित्व करता है। यदि वह ग्रह कार्यात्मक पापी है (आपके लग्न के लिए 6, 8 या 12वें भाव का स्वामी), तो उसे सशक्त करना बाधाओं, हानियों या रोगों को बढ़ाता है। यह रत्न शास्त्र का मूल नियम है।',
    },
  },
  {
    id: 'q15_1_03', type: 'true_false',
    question: {
      en: 'Blue Sapphire (Neelam) for Saturn is considered so powerful that a 7-day trial period is traditionally recommended before committing to wear it permanently.',
      hi: 'शनि के लिए नीलम इतना शक्तिशाली माना जाता है कि स्थायी रूप से धारण करने से पहले पारम्परिक रूप से 7 दिनों की परीक्षण अवधि की सिफ़ारिश की जाती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Blue Sapphire (Neelam) is known for its rapid and intense effects. Tradition recommends keeping it under your pillow or tying it to your arm for 7 days to observe whether it brings positive or negative experiences before wearing it in a ring.',
      hi: 'सत्य। नीलम अपने त्वरित और तीव्र प्रभावों के लिए जाना जाता है। परम्परा अनुशंसा करती है कि अँगूठी में पहनने से पहले 7 दिनों तक इसे तकिये के नीचे रखें या भुजा पर बाँधें और देखें कि यह सकारात्मक या नकारात्मक अनुभव लाता है।',
    },
  },
  {
    id: 'q15_1_04', type: 'mcq',
    question: {
      en: 'Which gemstone is prescribed for Jupiter (Guru)?',
      hi: 'गुरु (बृहस्पति) के लिए कौन-सा रत्न निर्धारित है?',
    },
    options: [
      { en: 'Red Coral (Moonga)', hi: 'मूँगा' },
      { en: 'Cat\'s Eye (Lehsunia)', hi: 'लहसुनिया' },
      { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज' },
      { en: 'Hessonite (Gomed)', hi: 'गोमेद' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Yellow Sapphire (Pukhraj) is Jupiter\'s gemstone. It is set in gold, worn on the index finger on Thursday during Guru Hora. Minimum recommended weight is 3 carats for noticeable effect.',
      hi: 'पुखराज (यलो सैफायर) बृहस्पति का रत्न है। इसे स्वर्ण में जड़कर गुरुवार को गुरु होरा में तर्जनी में पहना जाता है। ध्यान देने योग्य प्रभाव के लिए न्यूनतम 3 कैरट की सिफ़ारिश की जाती है।',
    },
  },
  {
    id: 'q15_1_05', type: 'mcq',
    question: {
      en: 'What is the primary strategy when selecting a gemstone — which planet should you strengthen?',
      hi: 'रत्न चयन की प्राथमिक रणनीति क्या है — किस ग्रह को सशक्त करना चाहिए?',
    },
    options: [
      { en: 'Always strengthen the weakest planet', hi: 'सदैव सबसे कमज़ोर ग्रह को सशक्त करें' },
      { en: 'Strengthen the lagna lord or yogakaraka planet', hi: 'लग्नेश या योगकारक ग्रह को सशक्त करें' },
      { en: 'Always wear your Moon sign birthstone', hi: 'सदैव अपनी चन्द्र राशि का जन्म-रत्न पहनें' },
      { en: 'Wear gems for all nine planets simultaneously', hi: 'सभी नौ ग्रहों के रत्न एक साथ पहनें' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The best strategy is to strengthen a planet that is both a functional benefic (lagna lord, yogakaraka, or trine/kendra lord) and somewhat weak in the chart. This gives it the boost it needs to deliver positive results.',
      hi: 'सर्वोत्तम रणनीति उस ग्रह को सशक्त करना है जो कार्यात्मक शुभ (लग्नेश, योगकारक, या त्रिकोण/केन्द्र स्वामी) हो और कुण्डली में कुछ दुर्बल हो। इससे उसे सकारात्मक फल देने के लिए आवश्यक बल प्राप्त होता है।',
    },
  },
  {
    id: 'q15_1_06', type: 'true_false',
    question: {
      en: 'The Navaratna (nine-gem pendant) is considered safe because it balances all nine planetary energies simultaneously.',
      hi: 'नवरत्न (नौ रत्नों का पेंडेंट) सुरक्षित माना जाता है क्योंकि यह सभी नौ ग्रहों की ऊर्जाओं को एक साथ सन्तुलित करता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The Navaratna pendant contains all 9 planetary gems in a specific arrangement, creating a balance rather than amplifying any single planet. It is considered a safer alternative when chart-specific prescription is uncertain.',
      hi: 'सत्य। नवरत्न पेंडेंट में सभी 9 ग्रहों के रत्न एक विशिष्ट व्यवस्था में होते हैं, जो किसी एक ग्रह को प्रवर्धित करने के बजाय सन्तुलन बनाते हैं। जब कुण्डली-विशिष्ट निर्धारण अनिश्चित हो तो यह एक सुरक्षित विकल्प माना जाता है।',
    },
  },
  {
    id: 'q15_1_07', type: 'mcq',
    question: {
      en: 'Which metal and finger are prescribed for wearing Red Coral (Moonga) for Mars?',
      hi: 'मंगल के लिए मूँगा किस धातु और उँगली में पहनना चाहिए?',
    },
    options: [
      { en: 'Silver, little finger', hi: 'चाँदी, कनिष्ठिका' },
      { en: 'Gold or copper, ring finger', hi: 'स्वर्ण या ताँबा, अनामिका' },
      { en: 'Platinum, index finger', hi: 'प्लैटिनम, तर्जनी' },
      { en: 'Iron, middle finger', hi: 'लोहा, मध्यमा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Red Coral should be set in gold or copper (Mars-friendly metals) and worn on the ring finger on Tuesday during Mangal Hora. The minimum recommended weight is 5-7 carats.',
      hi: 'मूँगा को स्वर्ण या ताँबे (मंगल-अनुकूल धातु) में जड़कर मंगलवार को मंगल होरा में अनामिका में पहनना चाहिए। न्यूनतम अनुशंसित भार 5-7 कैरट है।',
    },
  },
  {
    id: 'q15_1_08', type: 'mcq',
    question: {
      en: 'What is the minimum carat weight generally recommended for a gemstone to have astrological effect?',
      hi: 'ज्योतिषीय प्रभाव के लिए रत्न का सामान्यतः न्यूनतम कितने कैरट भार अनुशंसित है?',
    },
    options: [
      { en: '0.5 carats', hi: '0.5 कैरट' },
      { en: '2-3 carats (varies by stone)', hi: '2-3 कैरट (रत्न के अनुसार भिन्न)' },
      { en: '10 carats minimum', hi: 'न्यूनतम 10 कैरट' },
      { en: 'Weight does not matter', hi: 'भार का कोई महत्त्व नहीं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Most traditions recommend a minimum of 2-3 carats for precious stones (Ruby, Emerald, Blue Sapphire, Yellow Sapphire, Diamond) and 5-7 carats for semi-precious stones (Pearl, Red Coral, Hessonite, Cat\'s Eye). Below this, the effect is considered negligible.',
      hi: 'अधिकांश परम्पराएँ बहुमूल्य रत्नों (माणिक्य, पन्ना, नीलम, पुखराज, हीरा) के लिए न्यूनतम 2-3 कैरट और उप-बहुमूल्य रत्नों (मोती, मूँगा, गोमेद, लहसुनिया) के लिए 5-7 कैरट की सिफ़ारिश करती हैं। इससे कम में प्रभाव नगण्य माना जाता है।',
    },
  },
  {
    id: 'q15_1_09', type: 'true_false',
    question: {
      en: 'Wearing your Western "birthstone" based on calendar month is the same as Vedic gemstone prescription based on the birth chart.',
      hi: 'कैलेंडर माह के अनुसार पश्चिमी "जन्म-रत्न" पहनना कुण्डली पर आधारित वैदिक रत्न निर्धारण के समान है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Western birthstones are based on calendar months and have no connection to planetary positions in your chart. Vedic gemstone prescription requires analyzing the entire birth chart — lagna, house lordships, functional benefic/malefic status, and planetary strength.',
      hi: 'असत्य। पश्चिमी जन्म-रत्न कैलेंडर माह पर आधारित हैं और आपकी कुण्डली में ग्रह स्थितियों से इनका कोई सम्बन्ध नहीं। वैदिक रत्न निर्धारण के लिए सम्पूर्ण जन्म कुण्डली — लग्न, भाव स्वामित्व, कार्यात्मक शुभ/अशुभ स्थिति और ग्रह बल — का विश्लेषण आवश्यक है।',
    },
  },
  {
    id: 'q15_1_10', type: 'mcq',
    question: {
      en: 'Which gemstones represent Rahu and Ketu respectively?',
      hi: 'राहु और केतु के रत्न क्रमशः कौन-से हैं?',
    },
    options: [
      { en: 'Diamond and Pearl', hi: 'हीरा और मोती' },
      { en: 'Blue Sapphire and Red Coral', hi: 'नीलम और मूँगा' },
      { en: 'Hessonite (Gomed) and Cat\'s Eye (Lehsunia)', hi: 'गोमेद और लहसुनिया' },
      { en: 'Emerald and Yellow Sapphire', hi: 'पन्ना और पुखराज' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Rahu\'s gemstone is Hessonite (Gomed), a honey-colored garnet. Ketu\'s gemstone is Cat\'s Eye (Lehsunia/Vaidurya), known for its chatoyancy — a luminous band that moves across the stone. Both are set in silver or panchdhatu.',
      hi: 'राहु का रत्न गोमेद (हेसोनाइट) है, एक मधु-वर्णी गार्नेट। केतु का रत्न लहसुनिया (वैदूर्य/कैट्स आई) है, जो अपनी चमकीली पट्टी के लिए जाना जाता है जो रत्न पर गतिमान होती है। दोनों को चाँदी या पंचधातु में जड़ा जाता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'रत्न शास्त्र — रत्नों का विज्ञान' : 'Ratna Shastra — The Science of Gemstones'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'रत्न शास्त्र ज्योतिष उपचारों की सबसे लोकप्रिय शाखाओं में से एक है। मूल सिद्धान्त सरल है: नौ ग्रहों में से प्रत्येक एक विशिष्ट रत्न से अनुनादित होता है, और उस रत्न को त्वचा के सम्पर्क में पहनने से धारक के जीवन में उस ग्रह की ऊर्जा प्रवर्धित होती है। यह केवल अलंकार नहीं है — यह जन्म कुण्डली की ग्रह गतिकी में एक जानबूझकर किया गया हस्तक्षेप है।'
            : 'Ratna Shastra (gem science) is one of the most popular branches of Jyotish remedial measures. The core principle is straightforward: each of the nine grahas (planets) resonates with a specific gemstone, and wearing that gemstone in contact with the skin amplifies the planet\u2019s energy in the wearer\u2019s life. This is not merely ornamental — it is a deliberate intervention in the planetary dynamics of one\u2019s birth chart.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'नौ ग्रह-रत्न सम्बन्ध हैं: सूर्य = माणिक्य (रूबी), चन्द्र = मोती (पर्ल), मंगल = मूँगा (रेड कोरल), बुध = पन्ना (एमरल्ड), गुरु = पुखराज (यलो सैफायर), शुक्र = हीरा (डायमंड), शनि = नीलम (ब्लू सैफायर), राहु = गोमेद (हेसोनाइट), और केतु = लहसुनिया (कैट्स आई)। प्रत्येक रत्न अपने ग्रह से जुड़ी ब्रह्माण्डीय ऊर्जा की विशिष्ट तरंगदैर्ध्य को ग्रहण और संचारित करता है। रत्न एक एंटीना की भाँति कार्य करता है — यह ऊर्जा उत्पन्न नहीं करता बल्कि जो पहले से विद्यमान है उसे केन्द्रित और संचालित करता है।'
            : 'The nine planet-gem correspondences are: Sun = Ruby (Manikya), Moon = Pearl (Moti), Mars = Red Coral (Moonga), Mercury = Emerald (Panna), Jupiter = Yellow Sapphire (Pukhraj), Venus = Diamond (Heera), Saturn = Blue Sapphire (Neelam), Rahu = Hessonite (Gomed), and Ketu = Cat\u2019s Eye (Lehsunia). Each gemstone captures and transmits the specific wavelength of cosmic energy associated with its planet. The gem acts as an antenna — it does not generate energy but focuses and channels what is already present.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'नौ रत्न एक दृष्टि में' : 'The Nine Gems at a Glance'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'रत्न प्राकृतिक, अनुपचारित और प्रमुख दोषों (दरारें, समावेशन, धुँधलापन) से मुक्त होना चाहिए। दोषपूर्ण रत्न बिना रत्न से भी बदतर है — यह विकृत ऊर्जा संचारित करता है। रत्न को त्वचा को स्पर्श करना चाहिए (ओपन-बैक सेटिंग) ताकि इसके कम्पन सीधे शरीर से सम्पर्क करें। कृत्रिम या प्रयोगशाला-निर्मित रत्न ज्योतिष परम्परा में प्रभावी नहीं माने जाते, क्योंकि उनमें वह प्राकृतिक क्रिस्टलीकरण प्रक्रिया नहीं होती जो ग्रहीय अनुनाद को संकेतित करती है।'
            : 'The gemstone must be natural, untreated, and free of major flaws (cracks, inclusions, cloudiness). A flawed gemstone is worse than no gemstone — it transmits distorted energy. The gem must touch the skin (open-back setting) so that its vibrations make direct contact with the body. Synthetic or lab-created stones are not considered effective in Jyotish tradition, as they lack the natural crystallization process that is believed to encode planetary resonance.'}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कब पहनें और कब न पहनें' : 'When to Wear and When NOT to Wear'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'रत्न शास्त्र का मूल नियम: कार्यात्मक पापी ग्रह का रत्न कभी न पहनें। जो ग्रह आपके लग्न से 6, 8 या 12वें भाव का स्वामी हो, वह अपनी प्राकृतिक शुभता की परवाह किए बिना कार्यात्मक पापी बन जाता है। उदाहरणार्थ, बृहस्पति प्राकृतिक शुभ है, परन्तु वृषभ लग्न के लिए यह 8वें और 11वें भाव का स्वामी है — पुखराज पहनने से 8वें भाव की समस्याएँ (दुर्घटनाएँ, दीर्घकालिक रोग, आकस्मिक हानि) प्रवर्धित होंगी। किसी भी रत्न निर्धारण से पहले विशिष्ट लग्न से भाव स्वामित्व का विश्लेषण अनिवार्य है।'
            : 'The cardinal rule of Ratna Shastra: never wear a gemstone for a functional malefic planet. A planet that lords over the 6th, 8th, or 12th house from your lagna becomes a functional malefic regardless of its natural benefic status. For example, Jupiter is a natural benefic, but for Taurus lagna it rules the 8th and 11th houses — wearing Yellow Sapphire would amplify 8th-house problems (accidents, chronic illness, sudden losses). You must always analyze house lordships from the specific lagna before prescribing any gem.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'रत्नों के लिए सर्वोत्तम उम्मीदवार हैं: (1) लग्नेश — सदैव कार्यात्मक शुभ, इसे सशक्त करना समग्र स्वास्थ्य, आत्मविश्वास और जीवन दिशा में सुधार करता है; (2) योगकारक — वह ग्रह जो एक साथ केन्द्र और त्रिकोण का स्वामी हो, उस लग्न का सबसे शुभ ग्रह; (3) प्रबल त्रिकोण स्वामी (5वाँ और 9वाँ) — ये भाग्य, विद्या और सन्तान लाते हैं। उन ग्रहों को प्राथमिकता दें जो कार्यात्मक शुभ हों परन्तु दुर्बल स्थिति में हों (नीच, अस्त, दुस्थान में) — इन्हें रत्न सहायता से सर्वाधिक लाभ होता है।'
            : 'The best candidates for gemstones are: (1) the Lagna Lord — always a functional benefic, strengthening it improves overall health, confidence, and life direction; (2) the Yogakaraka — a planet that simultaneously lords a kendra and a trikona, the most auspicious planet for that lagna; (3) strong trine lords (5th and 9th) — they bring fortune, wisdom, and children. Prioritize planets that are functional benefics but placed in weak positions (debilitated, combust, in dusthana) — these benefit most from gemstone support.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'ग्रह-रत्न-धातु-उँगली सन्दर्भ' : 'Planet-Gem-Metal-Finger Reference'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <><span className="text-gold-light font-medium">सूर्य:</span> माणिक्य, स्वर्ण, अनामिका, रविवार। <span className="text-gold-light font-medium">चन्द्र:</span> मोती, चाँदी, कनिष्ठिका, सोमवार। <span className="text-gold-light font-medium">मंगल:</span> मूँगा, स्वर्ण/ताँबा, अनामिका, मंगलवार। <span className="text-gold-light font-medium">बुध:</span> पन्ना, स्वर्ण, कनिष्ठिका, बुधवार। <span className="text-gold-light font-medium">गुरु:</span> पुखराज, स्वर्ण, तर्जनी, गुरुवार।</>

            : <><span className="text-gold-light font-medium">Sun:</span> Ruby, Gold, Ring finger, Sunday. <span className="text-gold-light font-medium">Moon:</span> Pearl, Silver, Little finger, Monday. <span className="text-gold-light font-medium">Mars:</span> Red Coral, Gold/Copper, Ring finger, Tuesday. <span className="text-gold-light font-medium">Mercury:</span> Emerald, Gold, Little finger, Wednesday. <span className="text-gold-light font-medium">Jupiter:</span> Yellow Sapphire, Gold, Index finger, Thursday.</>}

        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Venus:</span> Diamond, Platinum/Silver, Middle/Ring finger, Friday. <span className="text-gold-light font-medium">Saturn:</span> Blue Sapphire, Silver/Panchdhatu, Middle finger, Saturday. <span className="text-gold-light font-medium">Rahu:</span> Hessonite, Silver/Panchdhatu, Middle finger, Saturday. <span className="text-gold-light font-medium">Ketu:</span> Cat&apos;s Eye, Silver/Panchdhatu, Little/Ring finger, Tuesday/Saturday. Blue Sapphire requires a 7-day trial period. Minimum weight: 2-3 carats for precious, 5-7 carats for semi-precious.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'नीलम चेतावनी' : 'Blue Sapphire Warning'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Blue Sapphire (Neelam) is the most powerful and potentially dangerous gemstone in Jyotish. Saturn&apos;s energy is intense, karmic, and unforgiving. If Blue Sapphire suits your chart, results can be spectacularly positive — rapid financial gains, career breakthroughs, obstacles dissolving overnight. But if it doesn&apos;t suit you, the consequences are equally dramatic — accidents, losses, depression, or sudden downturns within days of wearing it.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          नीलम ज्योतिष में सबसे शक्तिशाली और सम्भावित रूप से खतरनाक रत्न है। शनि की ऊर्जा तीव्र, कार्मिक और अक्षम्य है। यदि नीलम आपकी कुण्डली के अनुकूल है, तो परिणाम आश्चर्यजनक रूप से सकारात्मक हो सकते हैं — तीव्र आर्थिक लाभ, कैरियर में सफलता, बाधाओं का रातोंरात समाधान। परन्तु यदि यह अनुकूल नहीं है, तो परिणाम उतने ही नाटकीय हैं — पहनने के कुछ दिनों में दुर्घटनाएँ, हानि, अवसाद, या अचानक पतन। इसलिए 7 दिनों की परीक्षण अवधि अनिवार्य है।
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'महा-विवाद — क्या रत्न वास्तव में कार्य करते हैं?' : 'The Great Debate — Do Gemstones Actually Work?'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>रत्नों की प्रभावकारिता ज्योतिष में सबसे विवादित विषय है। सन्देहवादी इस ओर इंगित करते हैं कि आपकी उँगली पर क्रिस्टल ग्रहीय ऊर्जाओं को कैसे प्रभावित कर सकता है, इसकी कोई वैज्ञानिक रूप से स्थापित प्रक्रिया नहीं है। प्लेसीबो परिकल्पना सुझाती है कि श्रद्धापूर्वक रत्न धारण करने की क्रिया मनोवैज्ञानिक आत्मविश्वास उत्पन्न करती है, जो बदले में व्यवहार और परिणाम बदलती है — एक स्व-पूर्ण भविष्यवाणी। यह कोई तुच्छ व्याख्या नहीं है; प्लेसीबो प्रभाव चिकित्सा में सबसे शक्तिशाली बलों में से एक है।</>

            : <>The efficacy of gemstones is the most debated topic in Jyotish. Skeptics point to the absence of any scientifically established mechanism by which a crystal on your finger could influence planetary energies. The placebo hypothesis suggests that the act of wearing a gemstone with faith creates psychological confidence, which in turn changes behavior and outcomes — a self-fulfilling prophecy. This is not a trivial explanation; the placebo effect is one of the most powerful forces in medicine.</>}

        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>पारम्परिक वैदिक दृष्टिकोण मानता है कि रत्न ग्रहीय अनुनाद के माध्यम से कार्य करते हैं — प्रत्येक क्रिस्टल अपने शासक ग्रह के अनुरूप आवृत्ति पर कम्पन करता है, उस ग्रहीय प्रभाव को प्रवर्धित या संशोधित करता है। समर्थक गरुड़ पुराण और रत्न परीक्षा ग्रन्थों को प्रामाणिक स्रोत के रूप में उद्धृत करते हैं। कुछ आधुनिक समर्थक क्रोमोथेरेपी (रंग चिकित्सा) या क्रिस्टलों के पीज़ोइलेक्ट्रिक गुणों का आह्वान करते हैं, यद्यपि ये व्याख्याएँ मुख्यधारा विज्ञान से बाहर रहती हैं।</>

            : <>The traditional Vedic view holds that gems work through planetary resonance — each crystal vibrates at a frequency that corresponds to its ruling planet, amplifying or modulating that planetary influence. Proponents cite the Garuda Purana and Ratna Pariksha texts as authorities. Some modern proponents invoke chromotherapy (color healing) or piezoelectric properties of crystals, though these explanations remain outside mainstream science.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'नवरत्न विकल्प' : 'The Navaratna Alternative'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <>नवरत्न (नौ रत्नों का पेंडेंट या अँगूठी) सभी नौ ग्रहीय रत्नों को एक मण्डल पैटर्न में व्यवस्थित करता है जिसमें माणिक्य (सूर्य का प्रतिनिधि) केन्द्र में होता है और शेष आठ अपने ग्रहीय क्रम में चारों ओर। तर्क यह है कि सभी नौ को सम्मिलित करने से कोई एक ग्रह अत्यधिक प्रवर्धित नहीं होता — बल्कि समग्र ब्रह्माण्डीय सामंजस्य प्राप्त होता है। यह उनके लिए सबसे सुरक्षित विकल्प माना जाता है जो गलत ग्रह को सशक्त करने के जोखिम के बिना रत्न-आधारित उपचार चाहते हैं।</>

            : <>The Navaratna (nine-gem pendant or ring) arranges all nine planetary gemstones in a mandala pattern with Ruby at the center (representing the Sun) surrounded by the remaining eight in their planetary order. The logic is that by including all nine, no single planet is excessively amplified — instead, overall cosmic harmony is achieved. This is considered the safest option for those who want gem-based remedies without the risk of strengthening a wrong planet.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'गलत रत्न हानिकारक क्यों' : 'Why a Wrong Gemstone Can Cause Harm'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <>कल्पना करें शनि आपके लग्न के लिए कार्यात्मक पापी है, 8वें भाव का स्वामी। नीलम पहनने से शनि के फलादेश प्रवर्धित होते हैं — परन्तु 8वाँ भाव दीर्घकालिक रोग, दुर्घटनाओं और आकस्मिक परिवर्तनों का शासक है। आपने वास्तव में उस चैनल की ध्वनि बढ़ा दी जो बेसुरा संगीत बजा रहा था। इसी प्रकार, जब शुक्र 6वें भाव (ऋण, शत्रु, रोग) का स्वामी हो तो हीरा पहनना उन्हीं समस्याओं को सशक्त करता है। रत्न आपका इरादा नहीं जानता; यह केवल ग्रह को प्रवर्धित करता है। इसीलिए कुण्डली-विशिष्ट निर्धारण सामान्य "अपना जन्म-रत्न पहनें" सलाह से सदैव श्रेष्ठ है।</>

            : <>Imagine Saturn is a functional malefic for your lagna, ruling the 8th house. Wearing Blue Sapphire amplifies Saturn&apos;s significations — but the 8th house governs chronic disease, accidents, and sudden transformations. You have effectively boosted the volume on a channel that was playing dissonant music. Similarly, wearing Diamond when Venus rules the 6th house (debts, enemies, illness) strengthens those very problems. The gemstone does not know your intention; it simply amplifies the planet.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य से ऊपर कुण्डली-विशिष्ट' : 'Chart-Specific Over Generic'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The most important takeaway from Ratna Shastra: gemstone prescription must be chart-specific. Generic advice like &quot;Sagittarius people should wear Yellow Sapphire&quot; is dangerously oversimplified. The same Jupiter that blesses one chart can devastate another depending on house lordships from the lagna. Always consult a competent astrologer who analyzes your full birth chart — lagna, planetary dignities, dasha periods, and transits — before investing in a gemstone. Our Kundali tool provides the foundation for this analysis.
        </p>
      </section>
    </div>
  );
}

export default function Module15_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
