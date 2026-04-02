'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_14_3', phase: 4, topic: 'Compatibility', moduleNumber: '14.3',
  title: { en: 'Timing Marriage & Relationship Events', hi: 'विवाह एवं सम्बन्ध घटनाओं का समय' },
  subtitle: {
    en: 'Dasha triggers, double transits on the 7th house, delay indicators, and post-marriage predictions from the Navamsha',
    hi: 'दशा प्रेरक, सप्तम भाव पर दोहरा गोचर, विलम्ब संकेतक, और नवांश से विवाहोत्तर भविष्यवाणियाँ',
  },
  estimatedMinutes: 16,
  crossRefs: [
    { label: { en: 'Module 14-1: Kundali Milan', hi: 'मॉड्यूल 14-1: कुण्डली मिलान' }, href: '/learn/modules/14-1' },
    { label: { en: 'Module 14-2: Mangal Dosha', hi: 'मॉड्यूल 14-2: मंगल दोष' }, href: '/learn/modules/14-2' },
    { label: { en: 'Matching Deep Dive', hi: 'मिलान विस्तार' }, href: '/learn/matching' },
    { label: { en: 'Kundali Generator', hi: 'कुण्डली निर्माता' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q14_3_01', type: 'mcq',
    question: {
      en: 'What is the strongest timing trigger for marriage in Vedic astrology?',
      hi: 'वैदिक ज्योतिष में विवाह के लिए सबसे शक्तिशाली समय प्रेरक क्या है?',
    },
    options: [
      { en: 'Sun transiting the 7th house', hi: 'सूर्य का सप्तम भाव में गोचर' },
      { en: 'Double transit — Jupiter AND Saturn both influencing the 7th house simultaneously', hi: 'दोहरा गोचर — बृहस्पति और शनि दोनों एक साथ सप्तम भाव को प्रभावित करते हुए' },
      { en: 'Mercury retrograde ending', hi: 'बुध वक्री का समाप्त होना' },
      { en: 'Full Moon in the 7th house', hi: 'सप्तम भाव में पूर्णिमा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The "double transit" (Jaimini principle) is the strongest marriage trigger: Jupiter AND Saturn both transiting over or aspecting the 7th house (from Moon or Lagna) simultaneously. Jupiter provides the opportunity/blessing, Saturn provides the commitment/formalization.',
      hi: 'दोहरा गोचर (जैमिनी सिद्धान्त) सबसे शक्तिशाली विवाह प्रेरक है: बृहस्पति और शनि दोनों एक साथ सप्तम भाव (चन्द्र या लग्न से) पर गोचर या दृष्टि डालते हुए। बृहस्पति अवसर/आशीर्वाद प्रदान करता है, शनि प्रतिबद्धता/औपचारिकीकरण प्रदान करता है।',
    },
  },
  {
    id: 'q14_3_02', type: 'mcq',
    question: {
      en: 'Which dasha period is most commonly associated with marriage timing?',
      hi: 'कौन-सा दशा काल विवाह के समय से सबसे अधिक सम्बद्ध है?',
    },
    options: [
      { en: 'Saturn Mahadasha always', hi: 'शनि महादशा सदैव' },
      { en: 'Dasha of the 7th lord, Venus dasha, or Navamsha lagna lord dasha', hi: 'सप्तमेश दशा, शुक्र दशा, या नवांश लग्नेश दशा' },
      { en: 'Only Rahu Mahadasha', hi: 'केवल राहु महादशा' },
      { en: 'Mars Antardasha exclusively', hi: 'केवल मंगल अन्तर्दशा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Marriage most commonly occurs during the dasha/antardasha of the 7th house lord, Venus (natural karaka of marriage), or the Navamsha lagna lord. The antardasha level is often the precise trigger — e.g., Venus Mahadasha, 7th lord Antardasha.',
      hi: 'विवाह सबसे सामान्यतः सप्तमेश, शुक्र (विवाह का नैसर्गिक कारक), या नवांश लग्नेश की दशा/अन्तर्दशा में होता है। अन्तर्दशा स्तर प्रायः सटीक प्रेरक होता है — उदा., शुक्र महादशा, सप्तमेश अन्तर्दशा।',
    },
  },
  {
    id: 'q14_3_03', type: 'true_false',
    question: {
      en: 'Jupiter transiting the 7th house from Moon is sufficient by itself to trigger marriage.',
      hi: 'चन्द्र से सप्तम भाव में बृहस्पति का गोचर स्वयं विवाह प्रेरित करने के लिए पर्याप्त है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Jupiter transit over the 7th is a favorable condition but rarely sufficient alone. Marriage timing requires alignment of multiple factors: the dasha must support it (7th lord or Venus period), AND the transit must confirm it (preferably double transit of Jupiter + Saturn on the 7th).',
      hi: 'असत्य। सप्तम पर बृहस्पति गोचर अनुकूल स्थिति है परन्तु अकेले शायद ही पर्याप्त हो। विवाह समय में अनेक कारकों का संरेखण आवश्यक है: दशा को समर्थन करना चाहिए (सप्तमेश या शुक्र काल), और गोचर को पुष्टि करनी चाहिए (अधिमानतः सप्तम पर बृहस्पति + शनि का दोहरा गोचर)।',
    },
  },
  {
    id: 'q14_3_04', type: 'mcq',
    question: {
      en: 'Rahu in the 7th house typically indicates:',
      hi: 'सप्तम भाव में राहु सामान्यतः दर्शाता है:',
    },
    options: [
      { en: 'Early marriage before age 21', hi: '21 वर्ष से पूर्व शीघ्र विवाह' },
      { en: 'Delayed marriage, or marriage to a foreigner/person from different cultural background', hi: 'विलम्बित विवाह, या विदेशी/भिन्न सांस्कृतिक पृष्ठभूमि के व्यक्ति से विवाह' },
      { en: 'No possibility of marriage', hi: 'विवाह की कोई सम्भावना नहीं' },
      { en: 'Marriage to a childhood friend', hi: 'बचपन के मित्र से विवाह' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Rahu in 7th typically delays marriage or brings an unconventional spouse — foreign-born, different religion/culture, significantly different age. The delay usually resolves when Rahu\'s dasha/transit clears or when the person enters a favorable 7th lord dasha.',
      hi: 'सप्तम में राहु सामान्यतः विवाह में विलम्ब करता है या अपारम्परिक जीवनसाथी लाता है — विदेशी, भिन्न धर्म/संस्कृति, महत्वपूर्ण आयु अन्तर। विलम्ब सामान्यतः तब समाप्त होता है जब राहु की दशा/गोचर स्पष्ट हो या व्यक्ति अनुकूल सप्तमेश दशा में प्रवेश करे।',
    },
  },
  {
    id: 'q14_3_05', type: 'mcq',
    question: {
      en: 'Saturn\'s aspect on or transit over the 7th house typically causes:',
      hi: 'सप्तम भाव पर शनि की दृष्टि या गोचर सामान्यतः कारण बनता है:',
    },
    options: [
      { en: 'Immediate romantic opportunities', hi: 'तत्काल रोमांटिक अवसर' },
      { en: 'Delay in marriage, but eventual stability once it happens', hi: 'विवाह में विलम्ब, परन्तु होने पर अन्ततः स्थिरता' },
      { en: 'Divorce inevitably', hi: 'अनिवार्यतः तलाक' },
      { en: 'Multiple marriages', hi: 'बहुविवाह' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Saturn delays but does not deny. Its influence on the 7th house postpones marriage — often until late 20s or early 30s — but once marriage occurs under Saturn\'s influence, it tends to be stable and enduring. Saturn rewards patience and commitment.',
      hi: 'शनि विलम्ब करता है परन्तु इनकार नहीं करता। सप्तम भाव पर इसका प्रभाव विवाह को स्थगित करता है — प्रायः 20 के उत्तरार्ध या 30 के प्रारम्भ तक — परन्तु एक बार शनि के प्रभाव में विवाह होने पर, यह स्थिर और स्थायी होता है। शनि धैर्य और प्रतिबद्धता को पुरस्कृत करता है।',
    },
  },
  {
    id: 'q14_3_06', type: 'true_false',
    question: {
      en: 'The 7th lord placed in the 6th, 8th, or 12th house always prevents marriage entirely.',
      hi: 'षष्ठ, अष्टम, या द्वादश भाव में स्थित सप्तमेश सदैव विवाह को पूर्णतया रोकता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The 7th lord in dusthana (6, 8, 12) delays marriage and creates challenges in partnerships, but does not prevent it entirely. The marriage timing window shifts later, and the person may face obstacles or unconventional circumstances, but marriage remains possible especially during the 7th lord\'s own dasha period.',
      hi: 'असत्य। दुःस्थान (6, 8, 12) में सप्तमेश विवाह में विलम्ब करता है और साझेदारी में चुनौतियाँ उत्पन्न करता है, परन्तु इसे पूर्णतया नहीं रोकता। विवाह समय खिड़की बाद में खिसकती है, और व्यक्ति को बाधाओं या अपारम्परिक परिस्थितियों का सामना हो सकता है, परन्तु विवाह सम्भव रहता है विशेषकर सप्तमेश की स्वयं की दशा काल में।',
    },
  },
  {
    id: 'q14_3_07', type: 'mcq',
    question: {
      en: 'Which divisional chart is primarily used to assess spouse personality and marriage quality?',
      hi: 'जीवनसाथी के व्यक्तित्व और विवाह गुणवत्ता का आकलन करने के लिए मुख्य रूप से कौन-सी वर्ग कुण्डली उपयोग की जाती है?',
    },
    options: [
      { en: 'Dashamsha (D-10)', hi: 'दशमांश (डी-10)' },
      { en: 'Navamsha (D-9)', hi: 'नवांश (डी-9)' },
      { en: 'Saptamsha (D-7)', hi: 'सप्तमांश (डी-7)' },
      { en: 'Hora (D-2)', hi: 'होरा (डी-2)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Navamsha (D-9) is the "marriage and dharma" chart. It reveals the spouse\'s personality, the quality of the marriage bond, and the native\'s spiritual path. The 7th house of the Navamsha, its lord, and Venus placement in D-9 are key indicators of marital quality.',
      hi: 'नवांश (डी-9) "विवाह और धर्म" कुण्डली है। यह जीवनसाथी का व्यक्तित्व, विवाह बन्धन की गुणवत्ता, और जातक का आध्यात्मिक पथ प्रकट करता है। नवांश का सप्तम भाव, उसका स्वामी, और डी-9 में शुक्र स्थिति वैवाहिक गुणवत्ता के प्रमुख संकेतक हैं।',
    },
  },
  {
    id: 'q14_3_08', type: 'mcq',
    question: {
      en: 'Which house governs children timing in the birth chart?',
      hi: 'जन्म कुण्डली में सन्तान के समय का शासन कौन-सा भाव करता है?',
    },
    options: [
      { en: '2nd house', hi: 'द्वितीय भाव' },
      { en: '5th house', hi: 'पंचम भाव' },
      { en: '9th house', hi: 'नवम भाव' },
      { en: '11th house', hi: 'एकादश भाव' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 5th house (Putra Bhava) governs children, creative expression, and romance. Children timing is assessed through the 5th lord dasha, Jupiter transit over the 5th, and the Saptamsha (D-7) divisional chart. The 2nd house (family) is secondary — it shows family expansion.',
      hi: 'पंचम भाव (पुत्र भाव) सन्तान, सृजनात्मक अभिव्यक्ति, और प्रेम का शासन करता है। सन्तान समय का आकलन पंचमेश दशा, पंचम पर बृहस्पति गोचर, और सप्तमांश (डी-7) वर्ग कुण्डली द्वारा किया जाता है। द्वितीय भाव (परिवार) गौण है — यह परिवार विस्तार दर्शाता है।',
    },
  },
  {
    id: 'q14_3_09', type: 'true_false',
    question: {
      en: 'Saturn transit over natal Venus always causes divorce or separation.',
      hi: 'जन्मकालिक शुक्र पर शनि गोचर सदैव तलाक या वियोग का कारण बनता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Saturn transit over Venus creates a testing period for relationships — emotional distance, practical concerns overshadowing romance, or a reality check on the partnership. It can strengthen a solid marriage by forcing necessary conversations. Only in already-fragile relationships does it sometimes tip toward separation.',
      hi: 'असत्य। शुक्र पर शनि गोचर सम्बन्धों के लिए परीक्षा काल बनाता है — भावनात्मक दूरी, रोमांस पर व्यावहारिक चिन्ताओं का प्रभुत्व, या साझेदारी की वास्तविकता जाँच। यह आवश्यक संवादों को मजबूर कर ठोस विवाह को मजबूत कर सकता है। केवल पहले से नाजुक सम्बन्धों में यह कभी-कभी विच्छेद की ओर झुकता है।',
    },
  },
  {
    id: 'q14_3_10', type: 'mcq',
    question: {
      en: 'What is a "challenging period" in an existing marriage per Jyotish?',
      hi: 'ज्योतिष के अनुसार विद्यमान विवाह में "चुनौतीपूर्ण काल" क्या है?',
    },
    options: [
      { en: 'Any period when Mercury is retrograde', hi: 'कोई भी काल जब बुध वक्री हो' },
      { en: '7th lord dasha running through dusthana, or Saturn transiting over Venus/7th house', hi: 'दुःस्थान में सप्तमेश दशा, या शुक्र/सप्तम भाव पर शनि गोचर' },
      { en: 'When both partners are in Jupiter dasha', hi: 'जब दोनों साथी बृहस्पति दशा में हों' },
      { en: 'Full Moon days only', hi: 'केवल पूर्णिमा के दिन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 7th lord running through a dusthana (6th = conflicts, 8th = crises, 12th = separation) in its dasha, or Saturn transiting over natal Venus or the 7th house cusp, creates periods of marital stress. These are testing periods, not death sentences — awareness and remedies help navigate them.',
      hi: 'दुःस्थान (षष्ठ = संघर्ष, अष्टम = संकट, द्वादश = वियोग) में दशा काल में सप्तमेश, या जन्मकालिक शुक्र या सप्तम भाव संधि पर शनि गोचर, वैवाहिक तनाव के काल बनाते हैं। ये परीक्षा काल हैं, मृत्युदण्ड नहीं — जागरूकता और उपाय इनसे मार्गदर्शन में सहायक हैं।',
    },
  },
];

/* ─── Page 1: Marriage Timing Indicators ─── */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Marriage Timing Indicators
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          One of the most frequently asked questions in Jyotish is &ldquo;When will I get married?&rdquo; The answer lies in the convergence of two systems: <strong className="text-gold-light">Dashas</strong> (planetary periods that unfold the karma) and <strong className="text-gold-light">Transits</strong> (current planetary positions that trigger events). Marriage occurs when both the dasha and transit simultaneously activate the 7th house or its lord.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The primary dasha indicators for marriage are: the Mahadasha or Antardasha of the <strong className="text-gold-light">7th house lord</strong>, <strong className="text-gold-light">Venus</strong> (natural karaka of marriage and love), or the <strong className="text-gold-light">Navamsha Lagna lord</strong> (ruler of the D-9 marriage chart). When any of these dasha periods are running, the native&apos;s life is karmically primed for partnership events.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          On the transit side, the most powerful trigger is the <strong className="text-gold-light">double transit</strong> — Jupiter AND Saturn both influencing the 7th house (by conjunction, aspect, or transit through the sign) simultaneously. Jupiter brings the opportunity and blessing; Saturn provides the commitment, formalization, and societal recognition. When dasha alignment meets double transit on the 7th, marriage becomes highly probable within that window.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">Key Timing Combinations</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Jupiter Transit 7th from Moon/Lagna:</span> Creates a 12-month window of opportunity. Jupiter expands whatever it touches — in the 7th, it expands partnership possibilities, brings proposals, and creates auspiciousness around marriage.</p>
          <p><span className="text-gold-light font-semibold">Saturn Transit 7th or Aspecting 7th:</span> Saturn&apos;s involvement brings seriousness, commitment, and formalization. While Jupiter might bring a joyful meeting, Saturn makes it official — the engagement, the ceremony, the legal registration.</p>
          <p><span className="text-gold-light font-semibold">Venus Return/Transit:</span> Venus transiting over the natal 7th house cusp or its own natal position can trigger the precise date within a broader dasha+transit window. Venus moves quickly (about 1 sign/month), so it acts as the fine-tuning trigger.</p>
          <p><span className="text-gold-light font-semibold">Dasha-Antardasha Precision:</span> The Mahadasha sets the theme (e.g., Venus Mahadasha = relationship focus), and the Antardasha provides the specific timing. Venus-Jupiter, Jupiter-Venus, or 7th lord-Venus antardasha are classic marriage combinations.</p>
        </div>
      </section>
    </div>
  );
}

/* ─── Page 2: Delay Indicators ─── */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Delay Indicators — Why Marriage Waits
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Delayed marriage is not a defect — it is a timing pattern. Several chart factors consistently correlate with marriage occurring later than the social norm. Understanding these factors helps manage expectations and identify when the window will eventually open.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Delay Factors</h4>
        <div className="space-y-3 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Saturn Aspect on 7th House or Venus:</span> Saturn is the planet of delay, discipline, and maturation. Its 3rd, 7th, or 10th aspect falling on the 7th house or on Venus pushes marriage into the late 20s or early 30s. The upside: Saturn-delayed marriages tend to be more mature and stable once they happen.</p>
          <p><span className="text-gold-light font-semibold">7th Lord in Dusthana (6/8/12):</span> The 7th lord in the 6th house brings conflicts around partnerships, in the 8th creates hidden obstacles and transformative experiences before marriage, in the 12th may indicate a spouse from a distant place or losses through partnerships. Each has its own timing window — the 7th lord&apos;s dasha often opens the door.</p>
          <p><span className="text-gold-light font-semibold">Rahu in the 7th House:</span> Rahu here creates unconventional desires — the person may be attracted to foreigners, people from different backgrounds, or may resist the traditional marriage framework. Marriage typically happens after the Rahu dasha/antardasha completes, or during it if the partner is unconventional enough to satisfy Rahu&apos;s craving for the unusual.</p>
          <p><span className="text-gold-light font-semibold">Venus Combust or Debilitated:</span> Venus within 6 degrees of the Sun (combust) has its relationship significations burned away temporarily. Venus in Virgo (debilitated) creates excessive analysis and perfectionism in choosing a partner. Both delay marriage but through different mechanisms — combustion through lack of opportunity, debilitation through excessive selectivity.</p>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Timing Windows for Each Delay Factor</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Saturn Delays:</span> Usually resolve by early 30s, when Saturn has completed its first return (age ~29.5). After the Saturn return, the native has matured enough to handle the commitment Saturn demands.</p>
          <p><span className="text-gold-light font-semibold">Rahu Delays:</span> Clear when the Rahu dasha ends or when Rahu transit moves away from the 7th house. If Rahu Mahadasha runs in the 20s, marriage often occurs in the subsequent Jupiter or Saturn dasha.</p>
          <p><span className="text-gold-light font-semibold">7th Lord in Dusthana:</span> The 7th lord&apos;s own Mahadasha or Antardasha creates the window — even from a dusthana, the 7th lord activating itself brings marriage events. The nature may be unconventional, but the event occurs.</p>
          <p><span className="text-gold-light font-semibold">Debilitated Venus:</span> Neecha Bhanga (cancellation of debilitation) conditions or Venus dasha period can override the debilitation. Also, when Venus transits its exaltation sign (Pisces) annually, it creates a temporary activation window.</p>
        </div>
      </section>
    </div>
  );
}

/* ─── Page 3: Post-Marriage Predictions ─── */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Post-Marriage Predictions — Life After the Wedding
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Vedic astrology does not stop at predicting <em>when</em> marriage happens — it also maps the quality, challenges, and evolution of the marriage over time. The <strong className="text-gold-light">Navamsha (D-9)</strong> chart becomes the primary reference for post-marriage life, supplemented by ongoing dasha and transit analysis.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">Navamsha — The Marriage Chart</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Spouse Personality:</span> The 7th house of the Navamsha, its lord, and planets occupying it describe the spouse&apos;s character. Jupiter in Navamsha 7th indicates a wise, dharmic spouse. Venus there indicates a beautiful, artistic partner. Mars indicates a passionate, assertive one.</p>
          <p><span className="text-gold-light font-semibold">Navamsha Lagna Lord:</span> This planet&apos;s strength and placement reveals the overall quality of the marriage. Strong Navamsha lagna lord in a kendra/trikona = the marriage is a source of strength. Weak or afflicted = the marriage requires more effort and conscious work.</p>
          <p><span className="text-gold-light font-semibold">Vargottama Planets:</span> Planets that occupy the same sign in both Rashi (D-1) and Navamsha (D-9) are called Vargottama and are strengthened. A Vargottama Venus or 7th lord is an exceptionally positive sign for marriage quality.</p>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Family Expansion and Children</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">2nd House — Family Growth:</span> The 2nd house governs family expansion after marriage. Its lord&apos;s dasha and Jupiter transit over the 2nd indicate periods when the family grows — through children, in-laws moving in, or other additions to the household.</p>
          <p><span className="text-gold-light font-semibold">5th House — Children Timing:</span> The 5th house (Putra Bhava) is the primary indicator. The 5th lord&apos;s dasha, Jupiter transiting over the 5th, and the Saptamsha (D-7) chart together indicate when children are likely. Jupiter-5th lord connections in dasha and transit are the strongest conception indicators.</p>
          <p><span className="text-gold-light font-semibold">Saptamsha (D-7):</span> This divisional chart specifically governs progeny. The condition of the 5th house and its lord in the D-7 reveals the ease or difficulty of having children, and the overall relationship with offspring.</p>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Challenging Periods in Marriage</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">7th Lord Dasha in Dusthana:</span> When the 7th lord&apos;s dasha runs and it is placed in the 6th (conflicts), 8th (crises/transformation), or 12th (separation/distance), the marriage undergoes testing. This does not mean divorce — it means the marriage faces its growth edges.</p>
          <p><span className="text-gold-light font-semibold">Saturn Transit Over Venus:</span> This 2.5-year transit creates emotional coolness, practical pressures, and a &ldquo;reality check&rdquo; on the romance. Couples who communicate through this period emerge stronger; those who avoid difficult conversations may drift apart.</p>
          <p><span className="text-gold-light font-semibold">Rahu-Ketu Axis on 1-7:</span> When Rahu-Ketu transit the 1st-7th house axis (occurs every ~18 years), it creates 18 months of relationship intensity — obsessive patterns, external temptations, or fundamental questioning of the partnership. This is a transformation trigger, not necessarily a destruction signal.</p>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Remedies for Marital Harmony</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Venus Strengthening:</span> Wearing white/cream on Fridays, offering white flowers to Lakshmi, reciting Shukra mantras. If Venus is a functional benefic for the lagna, wearing a diamond or white sapphire (after chart analysis) strengthens the love and harmony signification.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">7th House Remedies:</span> Worship of the deity associated with the 7th lord. If the 7th lord is Jupiter, Brihaspati puja on Thursdays. If it is Venus, Lakshmi puja on Fridays. If it is Saturn, Shani puja on Saturdays with black sesame donations.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Couple Remedies:</span> Joint worship, visiting temples together on auspicious days, observing specific vrats (fasts) together. The act of shared spiritual practice itself strengthens the partnership bond — the remedy works on both karmic and psychological levels simultaneously.
        </p>
      </section>
    </div>
  );
}

export default function Module14_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
