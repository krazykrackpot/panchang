'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_23_5', phase: 10, topic: 'Prediction', moduleNumber: '23.5',
  title: { en: 'Prashna Yogas — Horary Combinations', hi: 'प्रश्न योग — होरारी संयोजन' },
  subtitle: { en: 'Specific planetary combinations that give immediate yes/no answers to questions', hi: 'विशिष्ट ग्रहीय संयोजन जो प्रश्नों के तत्काल हाँ/नहीं उत्तर देते हैं' },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: 'Module 23.3: Chakra Systems', hi: 'मॉड्यूल 23.3: चक्र प्रणालियाँ' }, href: '/learn/modules/23-3' },
    { label: { en: 'Module 23.4: Sphutas & Sensitive Points', hi: 'मॉड्यूल 23.4: स्फुट और संवेदनशील बिन्दु' }, href: '/learn/modules/23-4' },
    { label: { en: 'Module 15.3: Prashna Fundamentals', hi: 'मॉड्यूल 15.3: प्रश्न मूलभूत तत्व' }, href: '/learn/modules/15-3' },
    { label: { en: 'Prashna Tool', hi: 'प्रश्न उपकरण' }, href: '/prashna' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q23_5_01', type: 'mcq',
    question: { en: 'In Prashna (horary) astrology, when is the chart cast?', hi: 'प्रश्न (होरारी) ज्योतिष में कुण्डली कब बनाई जाती है?' },
    options: [
      { en: 'At the time of birth', hi: 'जन्म के समय' },
      { en: 'At the time the question is asked', hi: 'प्रश्न पूछे जाने के समय' },
      { en: 'At sunrise on the day of the question', hi: 'प्रश्न के दिन सूर्योदय पर' },
      { en: 'At the time of the next Full Moon', hi: 'अगली पूर्णिमा के समय' },
    ],
    correctAnswer: 1,
    explanation: { en: 'A Prashna chart is cast at the exact moment when the question is asked (or when it arrives to the astrologer). The principle is that the cosmic configuration at the moment of the question contains the answer — the universe reflects the querent\'s concern at that precise instant.', hi: 'प्रश्न कुण्डली ठीक उस क्षण बनाई जाती है जब प्रश्न पूछा जाता है (या जब वह ज्योतिषी तक पहुँचता है)। सिद्धान्त यह है कि प्रश्न के क्षण की ब्रह्माण्डीय विन्यास उत्तर समाहित करती है — ब्रह्माण्ड उस सटीक क्षण जिज्ञासु की चिन्ता को प्रतिबिम्बित करता है।' },
  },
  {
    id: 'q23_5_02', type: 'mcq',
    question: { en: 'What does "Mook Prashna" mean?', hi: '"मूक प्रश्न" का क्या अर्थ है?' },
    options: [
      { en: 'A question asked in writing', hi: 'लिखित में पूछा गया प्रश्न' },
      { en: 'A silent/unspoken question — the chart at consultation IS the question', hi: 'मौन/अनकहा प्रश्न — परामर्श के समय की कुण्डली ही प्रश्न है' },
      { en: 'A question about a mute person', hi: 'एक गूँगे व्यक्ति के बारे में प्रश्न' },
      { en: 'A repeated question', hi: 'दोहराया गया प्रश्न' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Mook Prashna ("silent question") means the querent doesn\'t need to verbally state their question. The chart cast at the moment of consultation already contains the question AND its answer. The astrologer reads the chart to determine both what the person is asking about and what the outcome will be.', hi: 'मूक प्रश्न ("मौन प्रश्न") का अर्थ है कि जिज्ञासु को मौखिक रूप से प्रश्न बताने की आवश्यकता नहीं। परामर्श के क्षण की कुण्डली पहले से प्रश्न और उसका उत्तर दोनों समाहित करती है। ज्योतिषी कुण्डली पढ़कर निर्धारित करता है कि व्यक्ति किस बारे में पूछ रहा है और परिणाम क्या होगा।' },
  },
  {
    id: 'q23_5_03', type: 'mcq',
    question: { en: 'In a Prashna chart, the 1st house represents:', hi: 'प्रश्न कुण्डली में, प्रथम भाव किसका प्रतिनिधित्व करता है?' },
    options: [
      { en: 'The subject of the question', hi: 'प्रश्न का विषय' },
      { en: 'The querent (person asking)', hi: 'जिज्ञासु (पूछने वाला व्यक्ति)' },
      { en: 'The astrologer', hi: 'ज्योतिषी' },
      { en: 'The timing of the event', hi: 'घटना का समय' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The 1st house (Lagna) always represents the querent — the person asking the question. The 7th house represents the subject of inquiry or the "other party." The relevant house per question type also matters: 10th for career questions, 7th for marriage, 5th for children, etc.', hi: 'प्रथम भाव (लग्न) सदैव जिज्ञासु — प्रश्न पूछने वाले व्यक्ति का प्रतिनिधित्व करता है। सप्तम भाव पूछताछ के विषय या "दूसरे पक्ष" का प्रतिनिधित्व करता है। प्रश्न प्रकार के अनुसार सम्बन्धित भाव भी महत्वपूर्ण है: कैरियर प्रश्नों के लिए दशम, विवाह के लिए सप्तम, संतान के लिए पंचम आदि।' },
  },
  {
    id: 'q23_5_04', type: 'true_false',
    question: { en: 'Moon in a Kendra or Trikona from Lagna in a Prashna chart indicates a positive outcome.', hi: 'प्रश्न कुण्डली में लग्न से केन्द्र या त्रिकोण में चन्द्रमा सकारात्मक परिणाम दर्शाता है।' },
    correctAnswer: true,
    explanation: { en: 'The Moon in a Kendra (1, 4, 7, 10) or Trikona (1, 5, 9) from the Lagna is a strongly favorable yoga in Prashna. The Moon represents the querent\'s mind and the flow of events. Its placement in these auspicious houses indicates that circumstances are aligned for a positive outcome.', hi: 'लग्न से केन्द्र (1, 4, 7, 10) या त्रिकोण (1, 5, 9) में चन्द्रमा प्रश्न में अत्यन्त अनुकूल योग है। चन्द्रमा जिज्ञासु के मन और घटनाओं के प्रवाह का प्रतिनिधित्व करता है। इन शुभ भावों में इसकी स्थिति दर्शाती है कि परिस्थितियाँ सकारात्मक परिणाम के लिए संरेखित हैं।' },
  },
  {
    id: 'q23_5_05', type: 'mcq',
    question: { en: 'What does "Lagna lord in the 7th house" indicate in a Prashna chart?', hi: 'प्रश्न कुण्डली में "लग्न स्वामी सप्तम भाव में" क्या दर्शाता है?' },
    options: [
      { en: 'The querent will face obstacles', hi: 'जिज्ञासु को बाधाओं का सामना होगा' },
      { en: 'The querent will get what they seek', hi: 'जिज्ञासु को वह मिलेगा जो वे खोज रहे हैं' },
      { en: 'The question is invalid', hi: 'प्रश्न अमान्य है' },
      { en: 'The timing is not right', hi: 'समय सही नहीं है' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Lagna lord (representing the querent) going to the 7th house (the subject of inquiry/desired outcome) shows the querent is moving toward what they seek. It\'s one of the strongest favorable yogas — the person\'s energy and destiny are directed toward the desired object.', hi: 'लग्न स्वामी (जिज्ञासु का प्रतिनिधि) सप्तम भाव (पूछताछ का विषय/वांछित परिणाम) में जाना दर्शाता है कि जिज्ञासु जो खोज रहा है उसकी ओर बढ़ रहा है। यह सबसे मजबूत अनुकूल योगों में से एक है — व्यक्ति की ऊर्जा और भाग्य वांछित वस्तु की ओर निर्देशित हैं।' },
  },
  {
    id: 'q23_5_06', type: 'mcq',
    question: { en: 'What does "Moon void of course" indicate in Prashna?', hi: 'प्रश्न में "चन्द्र शून्य पथ" क्या दर्शाता है?' },
    options: [
      { en: 'A very positive outcome', hi: 'अत्यन्त सकारात्मक परिणाम' },
      { en: 'A delayed but eventual success', hi: 'विलम्बित लेकिन अन्ततः सफलता' },
      { en: 'No outcome — the matter will not materialize', hi: 'कोई परिणाम नहीं — मामला साकार नहीं होगा' },
      { en: 'A change of plans', hi: 'योजनाओं में परिवर्तन' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Moon "void of course" means the Moon makes no applying aspect to any planet before leaving its current sign. In Prashna, this indicates nothing will come of the matter — no outcome, no resolution. The question fizzles out without a definitive result.', hi: 'चन्द्र "शून्य पथ" का अर्थ है कि चन्द्रमा अपनी वर्तमान राशि छोड़ने से पहले किसी भी ग्रह से कोई आगामी दृष्टि नहीं बनाता। प्रश्न में, यह दर्शाता है कि मामले से कुछ नहीं होगा — कोई परिणाम नहीं, कोई समाधान नहीं। प्रश्न बिना निश्चित परिणाम के समाप्त हो जाता है।' },
  },
  {
    id: 'q23_5_07', type: 'true_false',
    question: { en: 'Malefics in the 7th house of a Prashna chart indicate that the subject of inquiry is problematic.', hi: 'प्रश्न कुण्डली के सप्तम भाव में पाप ग्रह दर्शाते हैं कि पूछताछ का विषय समस्याग्रस्त है।' },
    correctAnswer: true,
    explanation: { en: 'The 7th house in Prashna represents the subject being asked about. Malefic planets (Saturn, Mars, Rahu, Ketu) here indicate the subject is flawed, problematic, or brings difficulties. For a marriage question: the partner has issues. For a business deal: the deal is risky.', hi: 'प्रश्न में सप्तम भाव पूछे जा रहे विषय का प्रतिनिधित्व करता है। यहाँ पाप ग्रह (शनि, मंगल, राहु, केतु) दर्शाते हैं कि विषय दोषपूर्ण, समस्याग्रस्त है, या कठिनाइयाँ लाता है। विवाह प्रश्न के लिए: साथी में समस्याएँ हैं। व्यापार सौदे के लिए: सौदा जोखिमभरा है।' },
  },
  {
    id: 'q23_5_08', type: 'mcq',
    question: { en: 'What do "applying aspects" between the Lagna lord and relevant house lord indicate?', hi: 'लग्न स्वामी और सम्बन्धित भाव स्वामी के बीच "आगामी दृष्टि" क्या दर्शाती है?' },
    options: [
      { en: 'The event has already passed', hi: 'घटना पहले ही बीत चुकी है' },
      { en: 'The event will happen', hi: 'घटना होगी' },
      { en: 'The event will never happen', hi: 'घटना कभी नहीं होगी' },
      { en: 'The question is unclear', hi: 'प्रश्न अस्पष्ट है' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Applying aspects (where a faster planet moves toward an exact aspect with a slower one) indicate that the event is approaching — it WILL happen. The closer the aspect to exact, the sooner the event. Separating aspects (the aspect has already been exact) indicate the opportunity has passed.', hi: 'आगामी दृष्टि (जहाँ तीव्र ग्रह धीमे ग्रह के साथ सटीक दृष्टि की ओर बढ़ रहा है) दर्शाती है कि घटना निकट आ रही है — यह होगी। दृष्टि जितनी सटीक के निकट, घटना उतनी शीघ्र। वियोजी दृष्टि (दृष्टि पहले ही सटीक हो चुकी है) दर्शाती है कि अवसर बीत चुका है।' },
  },
  {
    id: 'q23_5_09', type: 'true_false',
    question: { en: 'A combust Lagna lord in a Prashna chart indicates the querent is in a strong position.', hi: 'प्रश्न कुण्डली में अस्त लग्न स्वामी दर्शाता है कि जिज्ञासु मजबूत स्थिति में है।' },
    correctAnswer: false,
    explanation: { en: 'A combust Lagna lord means the querent (represented by the Lagna lord) is weakened, overwhelmed, or unable to act effectively. The Sun\'s overpowering light "burns" the querent\'s capacity. This is an unfavorable indication — the person lacks the strength to achieve their desired outcome.', hi: 'अस्त लग्न स्वामी का अर्थ है कि जिज्ञासु (लग्न स्वामी द्वारा प्रतिनिधित्व) दुर्बल, अभिभूत, या प्रभावी ढंग से कार्य करने में असमर्थ है। सूर्य का अत्यधिक प्रकाश जिज्ञासु की क्षमता को "जला" देता है। यह प्रतिकूल संकेत है — व्यक्ति में अपना वांछित परिणाम प्राप्त करने की शक्ति नहीं है।' },
  },
  {
    id: 'q23_5_10', type: 'mcq',
    question: { en: 'Our Prashna page evaluates horary yogas and assigns a verdict. What is the primary output?', hi: 'हमारा प्रश्न पृष्ठ होरारी योगों का मूल्यांकन करता है और निर्णय देता है। प्राथमिक आउटपुट क्या है?' },
    options: [
      { en: 'Only a birth chart', hi: 'केवल जन्म कुण्डली' },
      { en: 'A detailed natal analysis', hi: 'विस्तृत जन्मकालीन विश्लेषण' },
      { en: 'An automatic yes/no verdict with supporting yoga analysis', hi: 'सहायक योग विश्लेषण के साथ स्वचालित हाँ/नहीं निर्णय' },
      { en: 'Only transit predictions', hi: 'केवल गोचर भविष्यवाणियाँ' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Our Prashna page casts a chart for the moment of the question, evaluates all major Prashna yogas (Moon placement, Lagna lord position, benefic/malefic configurations, applying/separating aspects), and delivers an automatic verdict with detailed supporting analysis explaining why the outcome is favorable or unfavorable.', hi: 'हमारा प्रश्न पृष्ठ प्रश्न के क्षण की कुण्डली बनाता है, सभी प्रमुख प्रश्न योगों (चन्द्र स्थिति, लग्न स्वामी स्थान, शुभ/पाप विन्यास, आगामी/वियोजी दृष्टि) का मूल्यांकन करता है, और विस्तृत सहायक विश्लेषण के साथ स्वचालित निर्णय देता है जो बताता है कि परिणाम अनुकूल या प्रतिकूल क्यों है।' },
  },
];

/* ─── Page 1: Prashna Fundamentals ─────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'प्रश्न योग — ब्रह्माण्ड से तत्काल उत्तर' : 'Prashna Yogas — Instant Answers from the Cosmos'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रश्न (होरारी) ज्योतिष ज्योतिष की वह शाखा है जो जन्म के क्षण के बजाय प्रश्न पूछे जाने के क्षण की कुण्डली बनाती है। मूल सिद्धान्त गहन है: किसी भी क्षण का ब्रह्माण्ड उसकी चिन्ताओं और भाग्य को प्रतिबिम्बित करता है जो उससे सम्बद्ध हो रहा है। प्रश्न और उसका उत्तर पूछने के क्षण आकाश में अन्तर्निहित हैं।</> : <>Prashna (horary) astrology is the branch of Jyotish that casts a chart for the moment a question is asked, rather than for the moment of birth. The underlying principle is profound: the cosmos at any given moment reflects the concerns and destiny of whoever is engaging with it. The question and its answer are embedded in the sky at the moment of asking.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'मूक प्रश्न — मौन प्रश्न' : 'Mook Prashna — The Silent Question'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>मूक प्रश्न में, जिज्ञासु को अपना प्रश्न मौखिक रूप से बताने की भी आवश्यकता नहीं। परामर्श के क्षण की कुण्डली प्रश्न और उत्तर दोनों समाहित करती है। ज्योतिषी कुण्डली पढ़कर निर्धारित करता है कि व्यक्ति किस बारे में चिन्तित है (भाव सक्रियण और ग्रहीय विन्यास से) और परिणाम क्या होगा।</> : <>In Mook Prashna, the querent doesn&apos;t even need to state their question verbally. The chart at the moment of consultation contains both the question and the answer. The astrologer reads the chart to determine what the person is concerned about (from house activations and planetary configurations) and what the outcome will be.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'प्रश्न में प्रमुख भाव' : 'Key Houses in Prashna'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>प्रथम भाव = जिज्ञासु (पूछने वाला)। सप्तम भाव = पूछताछ का विषय, &quot;दूसरा पक्ष,&quot; या वांछित परिणाम। फिर विशिष्ट प्रश्न प्रकार का सम्बन्धित भाव: कैरियर के लिए दशम, विवाह/साझेदारी के लिए सप्तम, संतान/शिक्षा के लिए पंचम, सम्पत्ति/माता के लिए चतुर्थ, धन के लिए द्वितीय, स्वास्थ्य/शत्रुओं के लिए षष्ठ, लाभ के लिए एकादश, हानि/विदेश यात्रा के लिए द्वादश।</> : <>1st house = the querent (person asking). 7th house = the subject of inquiry, the &quot;other party,&quot; or the desired outcome. Then the relevant house for the specific question type: 10th for career, 7th for marriage/partnership, 5th for children/education, 4th for property/mother, 2nd for wealth, 6th for health/enemies, 11th for gains, 12th for losses/foreign travel.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'आगामी बनाम वियोजी दृष्टि' : 'Applying vs. Separating Aspects'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>प्रश्न में सबसे महत्वपूर्ण समय संकेतक: आगामी दृष्टि (तीव्र ग्रह धीमे ग्रह के साथ सटीक दृष्टि की ओर बढ़ रहा है) दर्शाती है कि घटना निकट आ रही है और होगी। वियोजी दृष्टि (दृष्टि पहले ही सटीक हो चुकी और अलग हो रही) दर्शाती है कि अवसर बीत चुका है। आगमन का ओर्ब बताता है कि घटना कितनी शीघ्र होगी।</> : <>The most critical timing indicator in Prashna: applying aspects (a faster planet moving toward an exact aspect with a slower one) indicate the event IS approaching and WILL happen. Separating aspects (the aspect already exact and moving apart) indicate the opportunity HAS PASSED. The orb of application tells how soon the event will occur.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रश्न कब उपयोग करें' : 'When to Use Prashna'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>प्रश्न आदर्श है जब: जन्म समय अज्ञात या अनिश्चित हो, प्रश्न किसी विशिष्ट घटना के बारे में हाँ/नहीं उत्तर वाला हो, समय तत्काल हो और आपको शीघ्र मार्गदर्शन चाहिए, या जब आप जन्म कुण्डली विश्लेषण की पुष्टि करना चाहें। यह ठोस प्रश्नों के लिए सर्वोत्तम काम करता है: &quot;क्या मुझे यह नौकरी मिलेगी?&quot;, &quot;क्या मुझे इस सम्पत्ति में निवेश करना चाहिए?&quot;, &quot;क्या विवाह होगा?&quot;</> : <>Prashna is ideal when: birth time is unknown or imprecise, the question is about a specific event with a yes/no answer, timing is urgent and you need immediate guidance, or when you want to confirm what a natal chart analysis suggests. It works best for concrete questions: &quot;Will I get this job?&quot;, &quot;Should I invest in this property?&quot;, &quot;Will the marriage happen?&quot;</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Favorable Yogas ──────────────────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'अनुकूल प्रश्न योग' : 'Favorable Prashna Yogas'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ये विशिष्ट ग्रहीय संयोजन हैं जो जिज्ञासु के प्रश्न का सकारात्मक उत्तर दर्शाते हैं। इनमें से जितने अधिक एक साथ उपस्थित हों, सकारात्मक संकेत उतना मजबूत। एक अकेला अनुकूल योग सुझावात्मक है; एक साथ अनेक निर्णायक हैं।</> : <>These are the specific planetary combinations that indicate a positive answer to the querent&apos;s question. The more of these present simultaneously, the stronger the positive indication. A single favorable yoga is suggestive; multiple together are conclusive.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-emerald-500/10">
            <p className="text-emerald-300 font-bold text-sm">{isHi ? 'केन्द्र/त्रिकोण में चन्द्र' : 'Moon in Kendra/Trikona'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>प्रश्न लग्न से 1, 4, 5, 7, 9, या 10 भावों में चन्द्रमा पहली और सबसे महत्वपूर्ण जाँच है। सुस्थित चन्द्रमा दर्शाता है कि घटनाओं का प्रवाह सकारात्मक परिणाम का समर्थन करता है। चन्द्रमा जिज्ञासु के मन और परिस्थितियों की गति का प्रतिनिधित्व करता है। शुक्ल पक्ष का चन्द्रमा इस योग को और मजबूत करता है।</> : <>Moon in houses 1, 4, 5, 7, 9, or 10 from the Prashna Lagna is the first and most important check. A well-placed Moon indicates that the flow of events supports a positive outcome. The Moon represents the mind of the querent and the momentum of circumstances. Waxing Moon (Shukla Paksha) strengthens this yoga further.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-emerald-500/10">
            <p className="text-emerald-300 font-bold text-sm">{isHi ? 'लग्न स्वामी सप्तम में' : 'Lagna Lord in the 7th'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>लग्न स्वामी का सप्तम भाव में जाना दर्शाता है कि जिज्ञासु वांछित परिणाम की ओर निर्देशित है। यह सबसे मजबूत सकारात्मक संकेतकों में से एक है। यदि सप्तम स्वामी भी बलवान और सुस्थित है, तो परिणाम पारस्परिक रूप से लाभकारी है। यदि लग्न स्वामी और सप्तम स्वामी की आगामी दृष्टि है, तो मिलन आसन्न है।</> : <>The Lagna lord moving to the 7th house shows the querent is directed toward the desired outcome. This is one of the strongest positive indicators. If the 7th lord is also strong and well-placed, the outcome is mutually beneficial. If the Lagna lord and 7th lord have an applying aspect, the coming together is imminent.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-emerald-500/10">
            <p className="text-emerald-300 font-bold text-sm">{isHi ? 'केन्द्रों में शुभ ग्रह' : 'Benefics in Kendras'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>बृहस्पति, शुक्र, शुक्ल पक्ष का चन्द्रमा, या अपीड़ित बुध कोणीय भावों (1, 4, 7, 10) में प्रश्न के लिए अनुकूल वातावरण बनाता है। केन्द्रों में शुभ ग्रह स्थिति को स्थिर करते हैं और सकारात्मक परिणामों का समर्थन करते हैं। जितने अधिक शुभ ग्रह कोणों में, समग्र चित्र उतना अनुकूल।</> : <>Jupiter, Venus, waxing Moon, or unafflicted Mercury in the angular houses (1, 4, 7, 10) creates a favorable environment for the question. Benefics in Kendras stabilize the situation and support positive outcomes. The more benefics in angles, the more favorable the overall picture.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-emerald-500/10">
            <p className="text-emerald-300 font-bold text-sm">{isHi ? 'अनुकूल नक्षत्र में चन्द्र' : 'Moon in Favorable Nakshatra'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>स्थिर नक्षत्र में चन्द्र = स्थिर, स्थायी परिणाम। चर नक्षत्र में चन्द्र = शीघ्र परिणाम। देव नक्षत्र में चन्द्र = आशीर्वादित परिणाम। मृत्यु नक्षत्रों जैसे भरणी या अश्लेषा में चन्द्र = सावधानी आवश्यक। नक्षत्र गुणवत्ता परिणाम की प्रकृति और समय को रंगती है।</> : <>Moon in a &quot;fixed&quot; (Sthira) nakshatra = stable, lasting outcome. Moon in a &quot;moveable&quot; (Chara) nakshatra = quick result. Moon in a Deva (divine) nakshatra = blessed outcome. Moon in Mrityu (death) nakshatras like Bharani or Ashlesha = caution needed. The nakshatra quality colors the nature and timing of the result.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-light text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रश्न से समय' : 'Timing from Prashna'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>आगामी दृष्टि का अंश समय बताता है: यदि लग्न स्वामी 5° ओर्ब पर सप्तम स्वामी की ओर आ रहा है, तो घटना 5 दिन/सप्ताह/महीने में हो सकती है (इकाई राशि प्रकार पर निर्भर — चर = दिन, स्थिर = महीने, द्विस्वभाव = सप्ताह)। तीव्र ग्रह (चन्द्र, बुध) शीघ्र परिणाम दर्शाते हैं; मन्द ग्रह (शनि, बृहस्पति) लम्बी प्रतीक्षा।</> : <>The degree of the applying aspect tells timing: if the Lagna lord applies to the 7th lord at 5° orb, the event may happen in 5 days/weeks/months (the unit depends on the sign type — cardinal = days, fixed = months, mutable = weeks). Fast-moving planets (Moon, Mercury) indicate quick results; slow planets (Saturn, Jupiter) indicate longer waits.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Unfavorable Yogas & Our Engine ────────────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'प्रतिकूल प्रश्न योग' : 'Unfavorable Prashna Yogas'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ये संयोजन बाधाओं, अस्वीकृति, या नकारात्मक परिणामों को दर्शाते हैं। इन्हें समझना अनुकूल योगों को जानने जितना ही महत्वपूर्ण है — वे चेतावनी संकेतों के रूप में कार्य करते हैं जो जिज्ञासु को खराब निर्णयों से बचाते हैं।</> : <>These combinations indicate obstacles, denial, or negative outcomes. Understanding them is as important as knowing the favorable yogas — they serve as warning signals that protect the querent from poor decisions.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{isHi ? 'चन्द्र शून्य पथ' : 'Moon Void of Course'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>जब चन्द्रमा अपनी वर्तमान राशि छोड़ने से पहले किसी भी ग्रह से कोई आगामी दृष्टि नहीं बनाता, तो यह &quot;शून्य पथ&quot; है। यह &quot;कुछ नहीं होगा&quot; का सबसे मजबूत संकेतक है — मामला साकार नहीं होगा, समाप्त हो जाएगा, या कोई निश्चित निष्कर्ष नहीं होगा। उपक्रम के साथ आगे न बढ़ें।</> : <>When the Moon makes no applying aspect to any planet before leaving its current sign, it is &quot;void of course.&quot; This is the strongest indicator of &quot;nothing will happen&quot; — the matter will not materialize, fizzle out, or come to no definitive conclusion. Do not proceed with the venture.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{isHi ? 'लग्न स्वामी दुःस्थान में' : 'Lagna Lord in Dusthana'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>लग्न स्वामी 6ठे (संघर्ष/रोग), 8वें (बाधा/हानि), या 12वें (खर्च/एकान्त) भाव में जिज्ञासु के महत्वपूर्ण बाधाओं का सामना दर्शाता है। व्यक्ति की ऊर्जा उपलब्धि के बजाय संघर्ष (6ठा), छिपे खतरों (8वाँ), या हानि (12वाँ) की ओर निर्देशित है।</> : <>Lagna lord in the 6th (conflict/disease), 8th (obstacles/losses), or 12th (expenses/isolation) house indicates the querent faces significant obstacles. The person&apos;s energy is directed toward struggle (6th), hidden dangers (8th), or losses (12th) rather than achievement.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{isHi ? 'सप्तम में पाप ग्रह' : 'Malefics in 7th'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>सप्तम भाव में शनि, मंगल, राहु, या केतु दर्शाता है कि पूछताछ का विषय स्वाभाविक रूप से समस्याग्रस्त है। विवाह के लिए: साथी में गम्भीर समस्याएँ हैं। व्यापार के लिए: सौदा जोखिमभरा या कपटपूर्ण है। किसी भी प्रश्न के लिए: जो आप खोज रहे हैं उसमें छिपी समस्याएँ हैं।</> : <>Saturn, Mars, Rahu, or Ketu in the 7th house indicates the subject of inquiry is inherently problematic. For marriage: the partner has serious issues. For business: the deal is risky or fraudulent. For any question: what you&apos;re seeking carries hidden problems.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{isHi ? 'वियोजी दृष्टि और अस्त लग्न स्वामी' : 'Separating Aspects & Combust Lagna Lord'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>लग्न स्वामी और सम्बन्धित भाव स्वामी के बीच वियोजी दृष्टि दर्शाती है कि अवसर पहले ही बीत चुका है — आपने इसे खो दिया। अस्त लग्न स्वामी का अर्थ है कि जिज्ञासु दुर्बल है, परिस्थितियों से अभिभूत है, या प्रभावी ढंग से कार्य करने में असमर्थ है। दोनों प्रतिकूल परिणाम के मजबूत संकेतक हैं।</> : <>Separating aspects between the Lagna lord and the relevant house lord indicate the opportunity has already passed — you missed it. Combust Lagna lord means the querent is weakened, overwhelmed by circumstances, or unable to act effectively. Both are strong indicators of an unfavorable outcome.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'हमारा प्रश्न इंजन' : 'Our Prashna Engine'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा प्रश्न पृष्ठ इन सभी योगों का स्वचालित मूल्यांकन करता है। जब आप प्रश्न प्रस्तुत करते हैं, इंजन: 1) सटीक क्षण की कुण्डली बनाता है। 2) चन्द्र स्थिति, कला और नक्षत्र जाँचता है। 3) लग्न स्वामी स्थान और गरिमा का मूल्यांकन करता है। 4) केन्द्रों में शुभ/पाप स्थिति पहचानता है। 5) आगामी और वियोजी दृष्टि का विश्लेषण करता है। 6) प्रमुख ग्रहों के अस्त की जाँच करता है। 7) सभी कारकों का समर्थक और विरोधी योगों की विस्तृत व्याख्या के साथ स्वचालित निर्णय (अनुकूल/प्रतिकूल/तटस्थ) में संश्लेषण करता है।</> : <>Our Prashna page evaluates all these yogas automatically. When you submit a question, the engine: 1) Casts the chart for the exact moment. 2) Checks Moon placement, phase, and nakshatra. 3) Evaluates Lagna lord position and dignity. 4) Identifies benefic/malefic placements in Kendras. 5) Analyzes applying and separating aspects. 6) Checks for combustion of key planets. 7) Synthesizes all factors into an automatic verdict (favorable/unfavorable/neutral) with detailed explanation of supporting and opposing yogas.</>}</p>
      </section>
    </div>
  );
}

export default function Module23_5Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
