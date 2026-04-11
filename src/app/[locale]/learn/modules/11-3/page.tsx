'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_11_3', phase: 3, topic: 'Dashas', moduleNumber: '11.3',
  title: { en: 'Dasha Interpretation & Transit Overlay', hi: 'दशा व्याख्या एवं गोचर आच्छादन' },
  subtitle: {
    en: 'The double transit theory, dasha sandhi turbulence, and practical chart reading with combined dasha-transit analysis',
    hi: 'द्वि-गोचर सिद्धान्त, दशा सन्धि अस्थिरता, और संयुक्त दशा-गोचर विश्लेषण के साथ व्यावहारिक कुण्डली पठन',
  },
  estimatedMinutes: 17,
  crossRefs: [
    { label: { en: 'Module 11-1: Vimshottari Dasha', hi: 'मॉड्यूल 11-1: विंशोत्तरी दशा' }, href: '/learn/modules/11-1' },
    { label: { en: 'Module 11-2: Yogini & Char Dasha', hi: 'मॉड्यूल 11-2: योगिनी एवं चर दशा' }, href: '/learn/modules/11-2' },
    { label: { en: 'Transits (Gochar)', hi: 'गोचर' }, href: '/learn/gochar' },
    { label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएँ' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q11_3_01', type: 'mcq',
    question: {
      en: 'What does the "double transit" theory require for a major life event to manifest?',
      hi: '"द्वि-गोचर" सिद्धान्त किसी प्रमुख जीवन घटना के प्रकट होने के लिए क्या आवश्यक बताता है?',
    },
    options: [
      { en: 'Only a favorable dasha period', hi: 'केवल अनुकूल दशा काल' },
      { en: 'Only favorable transits of Jupiter and Saturn', hi: 'केवल गुरु और शनि के अनुकूल गोचर' },
      { en: 'Both dasha support AND transit trigger from Jupiter/Saturn', hi: 'दशा समर्थन और गुरु/शनि से गोचर ट्रिगर दोनों' },
      { en: 'Three or more planets transiting the same sign', hi: 'तीन या अधिक ग्रहों का एक ही राशि में गोचर' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The double transit theory states that a life event requires two conditions: (1) the dasha must promise and support the event, and (2) Jupiter AND Saturn must both transit key houses (by aspect or occupation) to trigger it. The dasha opens the door; the double transit pushes you through it.',
      hi: 'द्वि-गोचर सिद्धान्त कहता है कि किसी जीवन घटना के लिए दो शर्तें आवश्यक हैं: (1) दशा को घटना का वचन और समर्थन देना चाहिए, और (2) गुरु और शनि दोनों को प्रमुख भावों पर गोचर (दृष्टि या स्थिति से) करना चाहिए। दशा द्वार खोलती है; द्वि-गोचर आपको उसमें से धकेलता है।',
    },
  },
  {
    id: 'q11_3_02', type: 'mcq',
    question: {
      en: 'In the double transit theory, which two planets must BOTH influence a house for an event to trigger?',
      hi: 'द्वि-गोचर सिद्धान्त में किसी घटना के ट्रिगर के लिए किन दो ग्रहों को भाव को प्रभावित करना आवश्यक है?',
    },
    options: [
      { en: 'Sun and Moon', hi: 'सूर्य और चन्द्र' },
      { en: 'Mars and Venus', hi: 'मंगल और शुक्र' },
      { en: 'Jupiter and Saturn', hi: 'गुरु और शनि' },
      { en: 'Rahu and Ketu', hi: 'राहु और केतु' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Jupiter and Saturn are the two slow-moving planets that form the "double transit" pair. Jupiter transits a sign for ~1 year, Saturn for ~2.5 years. When both simultaneously influence (by transit or aspect) the house relevant to an event, and the dasha also supports it, the event manifests.',
      hi: 'गुरु और शनि दो मन्द-गति ग्रह हैं जो "द्वि-गोचर" जोड़ी बनाते हैं। गुरु एक राशि में ~1 वर्ष, शनि ~2.5 वर्ष गोचर करता है। जब दोनों एक साथ किसी घटना से सम्बन्धित भाव को (गोचर या दृष्टि से) प्रभावित करें, और दशा भी समर्थन करे, तो घटना प्रकट होती है।',
    },
  },
  {
    id: 'q11_3_03', type: 'true_false',
    question: {
      en: 'Dasha sandhi is the smooth, effortless transition between two Mahadashas.',
      hi: 'दशा सन्धि दो महादशाओं के बीच का सहज, अनायास संक्रमण है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Dasha sandhi refers to the turbulent transition zone between two Mahadashas. The last portion of the outgoing dasha and the first portion of the incoming dasha create a period of uncertainty, mixed signals, and adjustment. It is typically experienced as 6 months of instability on either side of the transition.',
      hi: 'असत्य। दशा सन्धि दो महादशाओं के बीच के अशान्त संक्रमण क्षेत्र को कहते हैं। निवर्तमान दशा का अन्तिम भाग और आगामी दशा का प्रथम भाग अनिश्चितता, मिश्रित संकेतों और समायोजन का काल बनाते हैं। यह सामान्यतः संक्रमण के दोनों ओर 6 मास की अस्थिरता के रूप में अनुभव होता है।',
    },
  },
  {
    id: 'q11_3_04', type: 'mcq',
    question: {
      en: 'How long is the typical dasha sandhi turbulence period on each side of a Mahadasha transition?',
      hi: 'महादशा संक्रमण के प्रत्येक ओर सामान्य दशा सन्धि अशान्ति काल कितना लम्बा होता है?',
    },
    options: [
      { en: 'About 1 week', hi: 'लगभग 1 सप्ताह' },
      { en: 'About 1 month', hi: 'लगभग 1 मास' },
      { en: 'About 6 months', hi: 'लगभग 6 मास' },
      { en: 'About 2 years', hi: 'लगभग 2 वर्ष' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The sandhi period is approximately 6 months before and 6 months after the Mahadasha transition. During this ~1 year window, the native experiences the winding down of old themes and the uncertain emergence of new ones. Major decisions are generally avoided during sandhi.',
      hi: 'सन्धि काल महादशा संक्रमण से लगभग 6 मास पहले और 6 मास बाद का होता है। इस ~1 वर्ष की खिड़की में जातक पुराने विषयों का अवसान और नये विषयों का अनिश्चित उदय अनुभव करता है। सन्धि काल में प्रायः बड़े निर्णय टाले जाते हैं।',
    },
  },
  {
    id: 'q11_3_05', type: 'mcq',
    question: {
      en: 'When reading a dasha practically, what THREE things should you identify about the Mahadasha planet?',
      hi: 'दशा का व्यावहारिक पठन करते समय महादशा ग्रह के बारे में कौन-सी तीन बातें पहचाननी चाहिए?',
    },
    options: [
      { en: 'Name, mythology, gemstone', hi: 'नाम, पौराणिक कथा, रत्न' },
      { en: 'House placement, sign/dignity, house lordship', hi: 'भाव स्थिति, राशि/बल, भावेशत्व' },
      { en: 'Color, direction, day of the week', hi: 'रंग, दिशा, सप्ताह का दिन' },
      { en: 'Speed, retrograde status, combustion', hi: 'गति, वक्री स्थिति, अस्तत्व' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The three essentials are: (1) Which house does the planet sit in? (2) What sign is it in — is it exalted, debilitated, in own sign, or in a friend/enemy sign? (3) Which houses does it rule (lordship)? These three factors determine what the dasha will deliver.',
      hi: 'तीन आवश्यक तत्त्व हैं: (1) ग्रह किस भाव में बैठा है? (2) वह किस राशि में है — उच्च, नीच, स्वराशि, या मित्र/शत्रु राशि? (3) वह किन भावों का स्वामी है (भावेशत्व)? ये तीन कारक निर्धारित करते हैं कि दशा क्या फल देगी।',
    },
  },
  {
    id: 'q11_3_06', type: 'true_false',
    question: {
      en: 'A favorable dasha alone is sufficient to produce a major positive event, even without supporting transits.',
      hi: 'अनुकूल दशा अकेले ही प्रमुख शुभ घटना उत्पन्न करने के लिए पर्याप्त है, बिना सहायक गोचर के भी।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. According to the double transit theory, both conditions must be met. The dasha creates the potential (the "promise"), but Jupiter and Saturn transiting the relevant house provide the "trigger." Without the transit trigger, the dasha promise remains latent — like a seed without water.',
      hi: 'असत्य। द्वि-गोचर सिद्धान्त के अनुसार दोनों शर्तें पूरी होनी चाहिए। दशा सम्भावना ("वचन") बनाती है, किन्तु सम्बन्धित भाव पर गुरु और शनि का गोचर "ट्रिगर" प्रदान करता है। गोचर ट्रिगर के बिना दशा का वचन अव्यक्त रहता है — जैसे बिना जल के बीज।',
    },
  },
  {
    id: 'q11_3_07', type: 'mcq',
    question: {
      en: 'In the example: Venus dasha (marriage possible) + Jupiter transiting 7th house = marriage year. What role does Jupiter\'s transit play?',
      hi: 'उदाहरण में: शुक्र दशा (विवाह सम्भव) + गुरु का 7वें भाव पर गोचर = विवाह वर्ष। गुरु के गोचर की क्या भूमिका है?',
    },
    options: [
      { en: 'It replaces the dasha entirely', hi: 'यह दशा को पूर्णतया प्रतिस्थापित करता है' },
      { en: 'It acts as the trigger that activates the dasha promise', hi: 'यह ट्रिगर का कार्य करता है जो दशा के वचन को सक्रिय करता है' },
      { en: 'It has no real effect', hi: 'इसका कोई वास्तविक प्रभाव नहीं' },
      { en: 'It only matters if Saturn is also in the 7th', hi: 'यह तभी महत्त्वपूर्ण है जब शनि भी 7वें में हो' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jupiter\'s transit through the 7th house acts as the timing trigger. Venus dasha establishes the "promise" of marriage. Jupiter transiting the 7th house (or aspecting it) activates that promise in the specific year. Saturn must also influence the 7th by transit or aspect to complete the double transit.',
      hi: 'गुरु का 7वें भाव पर गोचर समय ट्रिगर का कार्य करता है। शुक्र दशा विवाह का "वचन" स्थापित करती है। गुरु का 7वें भाव पर गोचर (या दृष्टि) उस वचन को विशिष्ट वर्ष में सक्रिय करता है। द्वि-गोचर पूर्ण करने के लिए शनि को भी गोचर या दृष्टि से 7वें को प्रभावित करना चाहिए।',
    },
  },
  {
    id: 'q11_3_08', type: 'mcq',
    question: {
      en: 'What is the relationship between the Antardasha planet and the Mahadasha planet in interpretation?',
      hi: 'व्याख्या में अन्तर्दशा ग्रह और महादशा ग्रह के बीच क्या सम्बन्ध है?',
    },
    options: [
      { en: 'They always conflict', hi: 'वे सदा संघर्ष करते हैं' },
      { en: 'The Antardasha planet colors and modifies the Mahadasha theme', hi: 'अन्तर्दशा ग्रह महादशा विषय को रंगता और संशोधित करता है' },
      { en: 'Only the Antardasha matters during its period', hi: 'अपने काल में केवल अन्तर्दशा महत्त्वपूर्ण है' },
      { en: 'Their relationship is irrelevant', hi: 'उनका सम्बन्ध अप्रासंगिक है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Antardasha planet is a "guest" within the Mahadasha "host." It colors and modifies the dominant theme. If the two planets are natural friends (e.g., Jupiter-Moon), the period is harmonious. If they are enemies (e.g., Sun-Saturn), the period brings tension between their significations.',
      hi: 'अन्तर्दशा ग्रह महादशा "मेज़बान" के भीतर "अतिथि" है। यह प्रधान विषय को रंगता और संशोधित करता है। यदि दोनों ग्रह नैसर्गिक मित्र हैं (जैसे गुरु-चन्द्र), तो काल सामंजस्यपूर्ण है। यदि शत्रु हैं (जैसे सूर्य-शनि), तो काल उनके कारकत्वों के बीच तनाव लाता है।',
    },
  },
  {
    id: 'q11_3_09', type: 'true_false',
    question: {
      en: 'During dasha sandhi, it is advisable to make major life decisions such as changing careers or getting married.',
      hi: 'दशा सन्धि के दौरान कैरियर बदलना या विवाह करना जैसे बड़े जीवन निर्णय लेना उचित है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Dasha sandhi is a period of transition and instability. The outgoing planetary influence is fading while the incoming one has not yet fully established itself. Traditional advice is to avoid major irreversible decisions during sandhi and instead focus on reflection, preparation, and inner adjustment.',
      hi: 'असत्य। दशा सन्धि संक्रमण और अस्थिरता का काल है। निवर्तमान ग्रह का प्रभाव क्षीण हो रहा है जबकि आगामी ग्रह अभी पूर्णतया स्थापित नहीं हुआ। परम्परागत सलाह है कि सन्धि में बड़े अपरिवर्तनीय निर्णय टालें और चिन्तन, तैयारी तथा आन्तरिक समायोजन पर ध्यान दें।',
    },
  },
  {
    id: 'q11_3_10', type: 'mcq',
    question: {
      en: 'A person is in Saturn Mahadasha. Saturn sits in the 10th house in Libra (exalted) and rules the 4th and 5th houses. What can they expect?',
      hi: 'एक व्यक्ति शनि महादशा में है। शनि 10वें भाव में तुला राशि (उच्च) में बैठा है और 4 तथा 5वें भावों का स्वामी है। वे क्या अपेक्षा कर सकते हैं?',
    },
    options: [
      { en: 'Severe difficulties — Saturn is always malefic', hi: 'गम्भीर कठिनाइयाँ — शनि सदा पापी है' },
      { en: 'Career success, authority, property gains, academic achievement', hi: 'कैरियर सफलता, अधिकार, सम्पत्ति लाभ, शैक्षिक उपलब्धि' },
      { en: 'Only spiritual growth', hi: 'केवल आध्यात्मिक विकास' },
      { en: 'Nothing — exalted planets give no results', hi: 'कुछ नहीं — उच्च ग्रह कोई फल नहीं देते' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Saturn exalted in the 10th (career house) is one of the best placements possible — it creates Shasha Mahapurusha Yoga. Ruling the 4th (property, comfort) and 5th (intelligence, children), Saturn dasha would bring career authority, property acquisition, and academic or creative success. Never judge a planet by name alone.',
      hi: 'शनि 10वें (कर्म भाव) में उच्च सर्वोत्तम स्थितियों में से एक है — यह शश महापुरुष योग बनाता है। 4वें (सम्पत्ति, सुख) और 5वें (बुद्धि, सन्तान) का स्वामी होकर, शनि दशा कैरियर अधिकार, सम्पत्ति अर्जन और शैक्षिक/सृजनात्मक सफलता लाएगी। कभी ग्रह का आकलन केवल नाम से न करें।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'द्वि-गोचर सिद्धान्त' : 'The Double Transit Theory'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>भविष्यवाणी ज्योतिष में सर्वाधिक महत्त्वपूर्ण सिद्धान्त &quot;द्वि-गोचर&quot; (dwi-gochar) सिद्धान्त है। कोई घटना केवल इसलिए नहीं होती कि दशा अनुकूल है। न ही केवल इसलिए कि गोचर अनुकूल हैं। दोनों को एक साथ सम्मिलित होना आवश्यक है। दशा सम्भावना बनाती है — सम्भावना की खिड़की खोलती है। सम्बन्धित भाव पर गुरु और शनि का गोचर ट्रिगर प्रदान करता है — वह विशिष्ट वर्ष जब घटना वास्तव में प्रकट होती है। यह सिद्धान्त बी.वी. रमण द्वारा प्रतिपादित किया गया और अब ज्योतिष के सभी सम्प्रदायों में सर्वमान्य है।</> : <>The single most important principle in predictive Jyotish is the &quot;double transit&quot; (dwi-gochar) theory. An event does NOT happen simply because the dasha supports it. Nor does it happen simply because transits are favorable. Both must align simultaneously. The dasha creates the potential — it opens a window of possibility. The transit of Jupiter and Saturn over the relevant house provides the trigger — the specific year the event actually manifests. This principle was articulated by B.V. Raman and is now universally accepted across all schools of Jyotish.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>व्यवहार में यह कैसे कार्य करता है: मान लीजिए कोई शुक्र महादशा में है और शुक्र सप्तमेश (विवाह) है। इसका अर्थ है इस 20 वर्षीय खिड़की में विवाह का &quot;वचन&quot; है। किन्तु कौन-सा विशिष्ट वर्ष? देखें कि गुरु कब 7वें भाव पर गोचर करता है (या 1, 3, 5, 9 या 11वें से दृष्टि डालता है) और शनि भी एक साथ 7वें भाव पर गोचर या दृष्टि डालता है। दोनों शर्तों का आच्छादन वाला वर्ष वह है जब विवाह वास्तव में होता है। गुरु ~12 वर्षों में राशिचक्र पार करता है; शनि ~30 वर्षों में। किसी विशिष्ट भाव पर उनका आच्छादन अपेक्षाकृत दुर्लभ है, इसीलिए अनुकूल दशाओं में भी घटनाएँ निरन्तर नहीं होतीं।</> : <>How it works in practice: Suppose someone is in Venus Mahadasha and Venus is the 7th lord (marriage). This means marriage is &quot;promised&quot; during this 20-year window. But which specific year? Look for when Jupiter transits the 7th house (or aspects it from the 1st, 3rd, 5th, 9th, or 11th) AND Saturn also transits or aspects the 7th house simultaneously. The year both conditions overlap is when the marriage actually happens. Jupiter cycles through the zodiac in ~12 years; Saturn in ~30 years. Their overlap on a specific house is relatively rare, which is why events don&apos;t happen continuously even in favorable dashas.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'गुरु और शनि ही क्यों?' : 'Why Jupiter and Saturn?'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>गुरु और शनि इसलिए चुने जाते हैं क्योंकि ये सबसे धीमी गति के दृश्य ग्रह हैं, क्रमशः 1 वर्ष और 2.5 वर्ष प्रति राशि व्यतीत करते हैं। इनके गोचर व्यापक समय-खिड़कियाँ बनाते हैं जो दशा के वचन को विशिष्ट वर्ष तक संकीर्ण करती हैं। तीव्र ग्रह (चन्द्र, बुध, शुक्र) प्रमुख घटनाओं के समय चिह्न के लिए बहुत शीघ्र गति करते हैं। गुरु दिव्य कृपा, विस्तार और अवसर का प्रतिनिधित्व करता है। शनि कर्म, अनुशासन और ठोस अभिव्यक्ति का। साथ मिलकर ये किसी भी घटना के लिए आवश्यक दो शक्तियों का प्रतिनिधित्व करते हैं: आशीर्वाद (गुरु) और कर्म (शनि)।</> : <>Jupiter and Saturn are chosen because they are the slowest-moving visible planets, spending 1 year and 2.5 years per sign respectively. Their transits create broad time windows that narrow the dasha promise to a specific year. Faster planets (Moon, Mercury, Venus) move too quickly to be useful as timing markers for major events. Jupiter represents divine grace, expansion, and opportunity. Saturn represents karma, discipline, and concrete manifestation. Together they represent the two forces needed for any event: the blessing (Jupiter) and the karma (Saturn).</>}</p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'दशा सन्धि — अशान्त संक्रमण' : 'Dasha Sandhi — The Turbulent Transition'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दशा सन्धि (सन्धि स्थल) दो महादशाओं के बीच का संक्रमण क्षेत्र है — व्यक्ति के जीवन के सबसे संवेदनशील कालों में से एक। &quot;सन्धि&quot; शब्द का अर्थ जंक्शन या मिलन बिन्दु है। निवर्तमान महादशा के अन्तिम ~6 मास और आगामी के प्रथम ~6 मास में जातक जीवन विषयों में मूलभूत परिवर्तन अनुभव करता है। पुराना ग्रह प्रभाव क्षीण हो रहा है किन्तु समाप्त नहीं हुआ; नया उभर रहा है किन्तु अभी स्थापित नहीं। यह अनिश्चितता, भ्रम और कभी-कभी अशान्ति उत्पन्न करता है।</> : <>Dasha sandhi (junction) is the transition zone between two Mahadashas — one of the most sensitive periods in a person&apos;s life. The term &quot;sandhi&quot; means junction or meeting point. During the last ~6 months of an outgoing Mahadasha and the first ~6 months of an incoming one, the native experiences a fundamental shift in life themes. The old planetary influence is waning but not gone; the new one is emerging but not yet established. This creates uncertainty, confusion, and sometimes turbulence.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>उदाहरणार्थ, गुरु महादशा (विस्तार, आशावाद, शिक्षण, धर्म) से शनि महादशा (प्रतिबन्ध, अनुशासन, कठोर श्रम, कर्म) में संक्रमण सम्भव सबसे नाटकीय परिवर्तनों में से एक है। व्यक्ति को लग सकता है कि उसकी पूर्व सहायता प्रणालियाँ विलीन हो रही हैं, अवसर अचानक सिकुड़ रहे हैं, और एक नई, अधिक कठोर वास्तविकता आकार ले रही है। यह &quot;बुरा&quot; नहीं है — यह आवश्यक पुनर्संशोधन है। राहु और गुरु के बीच सन्धि गतिशीलता उलट देती है: जुनूनी सांसारिक अनुसरण से दार्शनिक स्पष्टता की ओर।</> : <>For example, the transition from Jupiter Mahadasha (expansion, optimism, teaching, dharma) to Saturn Mahadasha (restriction, discipline, hard work, karma) is one of the most dramatic shifts possible. A person may feel their previous support systems dissolving, opportunities suddenly contracting, and a new, more austere reality taking shape. This is not &quot;bad&quot; — it is a necessary recalibration. The sandhi between Rahu and Jupiter reverses the dynamic: from obsessive worldly pursuit to philosophical clarity.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सन्धि काल का संचालन' : 'Navigating Sandhi Periods'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">जागरूकता:</span> केवल यह जानना कि सन्धि आ रही है, चिन्ता कम करता है। सटीक महादशा संक्रमण तिथि पहले से चिह्नित करें और मानें कि पहले और बाद के 6 मास अस्थिर अनुभव होंगे। यह स्वाभाविक और अस्थायी है।</> : <><span className="text-gold-light font-medium">Awareness:</span> Simply knowing a sandhi is approaching reduces anxiety. Mark the exact Mahadasha transition date in advance and recognize that the 6 months before and after will feel unsettled. This is natural and temporary.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">बड़े निर्णय टालें:</span> यदि सम्भव हो तो सन्धि काल में अपरिवर्तनीय निर्णय (विवाह, बड़ा निवेश, कैरियर परिवर्तन) न लें। नई दशा के स्थापित होने की प्रतीक्षा करें — सामान्यतः नई महादशा में प्रवेश के 3-6 मास बाद।</> : <><span className="text-gold-light font-medium">Avoid major commitments:</span> Do not make irreversible decisions (marriage, major investment, career change) during sandhi if possible. Wait for the new dasha to establish itself — typically 3-6 months into the new Mahadasha.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;दशा सन्धि सदा विपत्ति लाती है।&quot; सत्य नहीं। दो शुभ दशाओं के बीच सन्धि (जैसे गुरु से बुध, जब दोनों शुभ स्थित हों) केवल पुनर्संशोधन काल जैसा अनुभव हो सकता है — संकट नहीं, हल्की बेचैनी। गम्भीरता इस पर निर्भर करती है कि दोनों महादशा स्वामी स्वभाव और स्थिति में कितने भिन्न हैं, और वे परस्पर मित्र हैं या शत्रु।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Dasha sandhi always brings disaster.&quot; Not true. The sandhi between two benefic dashas (e.g., Jupiter to Mercury for a chart where both are well-placed) can simply feel like a period of recalibration — mild restlessness rather than crisis. The severity depends on how different the two Mahadasha lords are in nature and placement, and whether they are mutual friends or enemies.</>}</p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'व्यावहारिक दशा पठन — एक व्यवस्थित विधि' : 'Practical Dasha Reading — A Systematic Method'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दशा पठन में व्यवस्थित चार-चरण प्रक्रिया आवश्यक है। चरण 1: महादशा ग्रह की कुण्डली स्थिति पहचानें। वह किस भाव में बैठा है? किस राशि में है (बल — उच्च, स्व, मित्र, शत्रु, नीच)? किन भावों का स्वामी है? 10वें भाव में स्वराशि में बैठा ग्रह जो 4 और 5वें भावों का स्वामी है, अपनी महादशा में कैरियर अधिकार (10वाँ), सम्पत्ति/सुख (4वाँ), और बुद्धि/सन्तान (5वाँ) देगा।</> : <>Reading a dasha requires a systematic four-step process. Step 1: Identify the Mahadasha planet&apos;s chart position. Where does it sit (house)? What sign is it in (dignity — exalted, own, friend, enemy, debilitated)? What houses does it rule? A planet sitting in the 10th house in its own sign, ruling the 4th and 5th houses, will give career authority (10th), property/comfort (4th), and intelligence/children (5th) during its Mahadasha.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चरण 2: अन्तर्दशा ग्रह का महादशा स्वामी से सम्बन्ध आँकें। क्या वे नैसर्गिक मित्र हैं (गुरु-चन्द्र, सूर्य-मंगल) या शत्रु (सूर्य-शनि, मंगल-बुध)? क्या अन्तर्दशा ग्रह शुभ स्थित है या पीड़ित? चरण 3: सक्रिय भाव पहचानें — वे जहाँ ये ग्रह बैठे हैं और जिनके स्वामी हैं दोनों। चरण 4: गोचर जाँचें — क्या गुरु और शनि इस विशिष्ट अन्तर्दशा खिड़की में सम्बन्धित भावों को समर्थन दे रहे हैं? जब चारों कारक सम्मिलित हों, विश्वास के साथ भविष्यवाणी करें।</> : <>Step 2: Assess the Antardasha planet&apos;s relationship to the Mahadasha lord. Are they natural friends (Jupiter-Moon, Sun-Mars) or enemies (Sun-Saturn, Mars-Mercury)? Is the Antardasha planet well-placed or afflicted? Step 3: Identify the activated houses — both where these planets sit AND what they rule. Step 4: Check transits — are Jupiter and Saturn supporting the relevant houses during this specific Antardasha window? When all four factors align, predict with confidence.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}</h4>
        <ExampleChart
          ascendant={2}
          planets={{ 6: [6], 9: [5] }}
          title={isHi ? 'वृषभ लग्न — शनि उच्च षष्ठ में, शुक्र नवम में' : 'Taurus Lagna — Saturn exalted in 6th, Venus in 9th'}
          highlight={[6, 9]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Chart:</span> Taurus ascendant. Saturn (yogakaraka, ruling 9th and 10th) is exalted in Libra in the 6th house. Current period: Saturn Mahadasha / Venus Antardasha (Venus rules 1st and 6th, sits in 9th). Transit: Jupiter entering Taurus (1st house) in 2026, Saturn in Pisces (11th house) aspecting 1st, 5th, 8th.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">कुण्डली:</span> वृषभ लग्न। शनि (योगकारक, 9 और 10वें का स्वामी) तुला में 6वें भाव में उच्च। वर्तमान काल: शनि महादशा / शुक्र अन्तर्दशा (शुक्र 1 और 6वें का स्वामी, 9वें में स्थित)। गोचर: गुरु 2026 में वृषभ (1ला भाव) प्रवेश, शनि मीन (11वाँ भाव) से 1, 5, 8वें पर दृष्टि। विश्लेषण: शनि MD कैरियर (दशमेश) और भाग्य (नवमेश) सक्रिय करता है। 6वें में होने पर भी उच्च शनि शत्रुओं को पराजित करता है। शुक्र AD व्यक्तिगत पहचान (लग्नेश) लाता है। 1ले भाव पर द्वि-गोचर = 2026 में व्यक्तिगत रूपान्तरण और मान्यता।</> : <><span className="text-gold-light font-medium">Analysis:</span> Saturn MD activates career (10th lord) and fortune (9th lord). Despite sitting in the 6th (enemies, service), exalted Saturn here defeats enemies and excels in service-oriented careers. Venus AD brings personal identity (1st lord) into focus with service/health (6th lord). Jupiter transiting the 1st triggers personal advancement; Saturn aspecting the 1st confirms it. Double transit on the 1st house = personal transformation and recognition in 2026.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'हमारे ऐप में' : 'In Our App'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा कुण्डली इंजन पूर्ण विंशोत्तरी दशा तालिका बनाता है और वर्तमान चल रही महादशा एवं अन्तर्दशा पहचानता है। टिप्पणी (व्याख्यात्मक भाष्य) खण्ड महादशा ग्रह के भाव, राशि और भावेशत्व का विश्लेषण करता है, अन्तर्दशा सम्बन्ध आँकता है, और वर्तमान गुरु-शनि गोचर से तुलना करता है। गोचर पृष्ठ वास्तविक समय में ग्रह स्थितियाँ दिखाता है, जिससे आपकी कुण्डली के किसी भी भाव के लिए द्वि-गोचर शर्तें सत्यापित करना सरल है।</> : <>Our Kundali engine generates the complete Vimshottari dasha table and identifies the current running Mahadasha and Antardasha. The Tippanni (interpretive commentary) section analyzes the Mahadasha planet&apos;s house, sign, and lordship, the Antardasha relationship, and cross-references with current Jupiter and Saturn transits. The Transits page shows real-time planetary positions, making it easy to verify double transit conditions for any house in your chart.</>}</p>
      </section>
    </div>
  );
}

export default function Module11_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
