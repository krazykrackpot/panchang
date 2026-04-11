'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_25_6', phase: 6, topic: 'Indian Contributions', moduleNumber: '25.6',
  title: { en: 'Fibonacci Started With Music', hi: 'फिबोनाची की शुरुआत संगीत से हुई' },
  subtitle: {
    en: 'How Indian musicians discovered the Fibonacci sequence 1,000 years before Fibonacci — through the mathematics of rhythm and tala',
    hi: 'कैसे भारतीय संगीतज्ञों ने फिबोनाची से 1,000 वर्ष पहले ताल के गणित से फिबोनाची अनुक्रम की खोज की',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 25-1: Zero & Place Value', hi: 'मॉड्यूल 25-1: शून्य और स्थानमान' }, href: '/learn/modules/25-1' },
    { label: { en: 'Module 25-2: Decimal System', hi: 'मॉड्यूल 25-2: दशमलव प्रणाली' }, href: '/learn/modules/25-2' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_6_01', type: 'mcq',
    question: {
      en: 'Who first described the Fibonacci pattern in the context of music?',
      hi: 'संगीत के संदर्भ में फिबोनाची पैटर्न का प्रथम वर्णन किसने किया?',
    },
    options: [
      { en: 'Aryabhata', hi: 'आर्यभट' },
      { en: 'Bharata Muni', hi: 'भरत मुनि' },
      { en: 'Virahanka', hi: 'विरहांक' },
      { en: 'Hemachandra', hi: 'हेमचन्द्र' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Bharata Muni, the author of the Natyashastra, first described a pattern corresponding to the Fibonacci sequence around 200 BCE while analysing the combinations of long and short syllables in poetic meters. He observed that counting the ways to arrange syllables of duration 1 and 2 in sequences of length n naturally generates what we now call the Fibonacci numbers. This predates Fibonacci himself by over 1,300 years.',
      hi: 'नाट्यशास्त्र के रचयिता भरत मुनि ने लगभग 200 ईसा पूर्व काव्य छन्दों में लघु और गुरु अक्षरों के संयोजनों का विश्लेषण करते हुए फिबोनाची अनुक्रम के समकक्ष एक पैटर्न का प्रथम वर्णन किया। उन्होंने देखा कि n लम्बाई के अनुक्रमों में 1 और 2 मात्रा के अक्षरों को व्यवस्थित करने के तरीकों की गणना स्वाभाविक रूप से वे संख्याएँ उत्पन्न करती है जिन्हें हम आज फिबोनाची संख्याएँ कहते हैं। यह फिबोनाची से 1,300 वर्ष से अधिक पहले है।',
    },
  },
  {
    id: 'q25_6_02', type: 'mcq',
    question: {
      en: 'In which text did Bharata Muni describe the rhythmic patterns that encode the Fibonacci sequence?',
      hi: 'किस ग्रन्थ में भरत मुनि ने फिबोनाची अनुक्रम को एन्कोड करने वाले तालबद्ध पैटर्न का वर्णन किया?',
    },
    options: [
      { en: 'Arthashastra', hi: 'अर्थशास्त्र' },
      { en: 'Chandahshastra', hi: 'छन्दःशास्त्र' },
      { en: 'Natyashastra', hi: 'नाट्यशास्त्र' },
      { en: 'Aryabhatiya', hi: 'आर्यभटीय' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Natyashastra (literally "treatise on drama") is an ancient Sanskrit text on the performing arts attributed to Bharata Muni, written around 200 BCE. The text covers music, dance, drama, and poetic meter in extraordinary depth. Its chapter on prosody (meter) analyses the ways syllables of different durations can combine, and the counting of these combinations gives the Fibonacci numbers. The Natyashastra remains one of the most comprehensive ancient texts on performing arts in any civilization.',
      hi: 'नाट्यशास्त्र (शाब्दिक अर्थ "नाटक पर ग्रन्थ") भरत मुनि को आरोपित एक प्राचीन संस्कृत ग्रन्थ है जो लगभग 200 ईसा पूर्व रचा गया था। यह ग्रन्थ संगीत, नृत्य, नाटक और काव्य-छन्द को असाधारण गहराई से कवर करता है। छन्दशास्त्र पर इसका अध्याय विभिन्न मात्राओं के अक्षरों के संयोजन के तरीकों का विश्लेषण करता है, और इन संयोजनों की गणना फिबोनाची संख्याएँ देती है। नाट्यशास्त्र किसी भी सभ्यता के प्रदर्शन कला पर सबसे व्यापक प्राचीन ग्रन्थों में से एक है।',
    },
  },
  {
    id: 'q25_6_03', type: 'mcq',
    question: {
      en: 'Approximately when did Bharata Muni write the Natyashastra?',
      hi: 'भरत मुनि ने नाट्यशास्त्र लगभग कब लिखा?',
    },
    options: [
      { en: '200 CE', hi: '200 ईस्वी' },
      { en: '200 BCE', hi: '200 ईसा पूर्व' },
      { en: '500 CE', hi: '500 ईस्वी' },
      { en: '800 BCE', hi: '800 ईसा पूर्व' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Natyashastra is dated to approximately 200 BCE, though some scholars place it between 500 BCE and 200 CE. This makes the Fibonacci-related observations in its prosody section roughly 1,200–1,400 years older than Fibonacci\'s own work in the Liber Abaci (1202 CE). The exact date is debated because ancient Indian texts were often compiled over generations, but the core prosody chapters are consistently dated to the early centuries BCE.',
      hi: 'नाट्यशास्त्र को लगभग 200 ईसा पूर्व का माना जाता है, हालाँकि कुछ विद्वान इसे 500 ईसा पूर्व और 200 ईस्वी के बीच रखते हैं। इससे इसके छन्दशास्त्र खंड में फिबोनाची-संबंधित अवलोकन फिबोनाची के स्वयं के लिबेर अबासी (1202 ईस्वी) से लगभग 1,200-1,400 वर्ष पुराने हो जाते हैं। सटीक तिथि विवादित है क्योंकि प्राचीन भारतीय ग्रन्थ अक्सर पीढ़ियों में संकलित होते थे, लेकिन मूल छन्दशास्त्र अध्याय लगातार ईसा पूर्व की प्रारंभिक शताब्दियों के हैं।',
    },
  },
  {
    id: 'q25_6_04', type: 'mcq',
    question: {
      en: 'What musical concept connected to rhythm patterns gave rise to the Fibonacci numbers in Indian mathematics?',
      hi: 'किस संगीत अवधारणा ने, तालबद्ध पैटर्न से जुड़कर, भारतीय गणित में फिबोनाची संख्याओं को जन्म दिया?',
    },
    options: [
      { en: 'Raga — melodic frameworks', hi: 'राग — मेलोडिक ढाँचे' },
      { en: 'Shruti — microtonal intervals', hi: 'श्रुति — माइक्रोटोनल अंतराल' },
      { en: 'Tala — rhythmic patterns using short and long syllables', hi: 'ताल — लघु और दीर्घ अक्षरों का उपयोग करके तालबद्ध पैटर्न' },
      { en: 'Swara — the seven notes of the scale', hi: 'स्वर — सप्तक के सात स्वर' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Tala is the system of rhythmic cycles in Indian classical music. Sanskrit prosody uses two fundamental syllable durations: laghu (short, 1 beat) and guru (long, 2 beats). When counting how many ways you can fill a rhythmic line of n beats using combinations of laghus (1 beat) and gurus (2 beats), the answer is the nth Fibonacci number. For example: 1 beat = 1 way; 2 beats = 2 ways; 3 beats = 3 ways; 4 beats = 5 ways; 5 beats = 8 ways. The recursion F(n) = F(n-1) + F(n-2) emerges naturally from this musical counting problem.',
      hi: 'ताल भारतीय शास्त्रीय संगीत में लयबद्ध चक्रों की प्रणाली है। संस्कृत छन्दशास्त्र दो मूलभूत अक्षर मात्राओं का उपयोग करता है: लघु (छोटा, 1 मात्रा) और गुरु (लम्बा, 2 मात्राएँ)। जब यह गिना जाए कि लघु (1 मात्रा) और गुरु (2 मात्राएँ) के संयोजनों का उपयोग करके n मात्राओं की एक तालबद्ध पंक्ति को कितने तरीकों से भरा जा सकता है, तो उत्तर n-वीं फिबोनाची संख्या है। उदाहरण: 1 मात्रा = 1 तरीका; 2 मात्राएँ = 2 तरीके; 3 मात्राएँ = 3 तरीके; 4 मात्राएँ = 5 तरीके; 5 मात्राएँ = 8 तरीके। पुनरावृत्ति F(n) = F(n-1) + F(n-2) इस संगीत गणना समस्या से स्वाभाविक रूप से उभरती है।',
    },
  },
  {
    id: 'q25_6_05', type: 'mcq',
    question: {
      en: 'Who stated the explicit Fibonacci recurrence relation (that each number is the sum of the two before it)?',
      hi: 'स्पष्ट फिबोनाची पुनरावृत्ति संबंध (कि प्रत्येक संख्या पिछली दो का योग है) किसने बताया?',
    },
    options: [
      { en: 'Pingala', hi: 'पिंगल' },
      { en: 'Bharata Muni', hi: 'भरत मुनि' },
      { en: 'Virahanka', hi: 'विरहांक' },
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Virahanka (~600 CE) was the first to explicitly state the recurrence relation: that the number of metrical patterns of length n equals the sum of patterns of lengths n-1 and n-2. This is precisely the modern Fibonacci recurrence F(n) = F(n-1) + F(n-2). He wrote this in his commentary on Pingala\'s Chandahshastra. While Bharata Muni and Pingala had observed the pattern, Virahanka was the first to articulate the additive rule explicitly, making him the mathematician who formalized what we now call the Fibonacci recurrence.',
      hi: 'विरहांक (~600 ईस्वी) वे पहले व्यक्ति थे जिन्होंने स्पष्ट रूप से पुनरावृत्ति संबंध बताया: कि लम्बाई n के मेट्रिकल पैटर्न की संख्या लम्बाई n-1 और n-2 के पैटर्न के योग के बराबर है। यह ठीक आधुनिक फिबोनाची पुनरावृत्ति F(n) = F(n-1) + F(n-2) है। उन्होंने यह पिंगल के छन्दःशास्त्र पर अपनी टिप्पणी में लिखा। जबकि भरत मुनि और पिंगल ने पैटर्न देखा था, विरहांक पहले थे जिन्होंने योगात्मक नियम को स्पष्ट रूप से व्यक्त किया, जिससे वे वह गणितज्ञ बने जिन्होंने आज की फिबोनाची पुनरावृत्ति को औपचारिक रूप दिया।',
    },
  },
  {
    id: 'q25_6_06', type: 'mcq',
    question: {
      en: 'In approximately what century CE did Virahanka articulate the Fibonacci recurrence?',
      hi: 'विरहांक ने फिबोनाची पुनरावृत्ति को लगभग किस शताब्दी ईस्वी में व्यक्त किया?',
    },
    options: [
      { en: '2nd century CE', hi: '2री शताब्दी ईस्वी' },
      { en: '4th century CE', hi: '4थी शताब्दी ईस्वी' },
      { en: '6th century CE', hi: '6ठी शताब्दी ईस्वी' },
      { en: '10th century CE', hi: '10वीं शताब्दी ईस्वी' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Virahanka is dated to approximately the 6th century CE (around 600 CE). His work builds on Pingala\'s earlier Chandahshastra (around 300 BCE) and explicitly states the recurrence relation. This places the formal mathematical statement of the Fibonacci rule roughly 600 years before Fibonacci himself wrote Liber Abaci in 1202 CE, and about 400 years before Hemachandra (1150 CE) independently re-derived it in the context of Jain literature and poetry.',
      hi: 'विरहांक को लगभग 6ठी शताब्दी ईस्वी (लगभग 600 ईस्वी) का माना जाता है। उनका कार्य पिंगल के पहले के छन्दःशास्त्र (लगभग 300 ईसा पूर्व) पर आधारित है और स्पष्ट रूप से पुनरावृत्ति संबंध बताता है। यह फिबोनाची नियम के औपचारिक गणितीय कथन को 1202 ईस्वी में फिबोनाची के लिबेर अबासी लिखने से लगभग 600 वर्ष पहले रखता है, और हेमचन्द्र (1150 ईस्वी) से लगभग 400 वर्ष पहले जिन्होंने जैन साहित्य और कविता के संदर्भ में इसे स्वतंत्र रूप से पुनः प्राप्त किया।',
    },
  },
  {
    id: 'q25_6_07', type: 'mcq',
    question: {
      en: 'Who published results equivalent to the Fibonacci sequence 52 years before Fibonacci, and when?',
      hi: 'फिबोनाची से 52 वर्ष पहले किसने फिबोनाची अनुक्रम के समकक्ष परिणाम प्रकाशित किए, और कब?',
    },
    options: [
      { en: 'Virahanka in 600 CE', hi: 'विरहांक, 600 ईस्वी में' },
      { en: 'Brahmagupta in 628 CE', hi: 'ब्रह्मगुप्त, 628 ईस्वी में' },
      { en: 'Hemachandra in 1150 CE', hi: 'हेमचन्द्र, 1150 ईस्वी में' },
      { en: 'Aryabhata in 499 CE', hi: 'आर्यभट, 499 ईस्वी में' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Hemachandra (1089–1172 CE) published the sequence in 1150 CE — exactly 52 years before Fibonacci\'s Liber Abaci (1202 CE). Hemachandra was a prolific Jain scholar, mathematician, and poet. In his work on Jain poetic meters, he independently stated the same sequence: that the number of metrical patterns of length n is the sum of those of lengths n-1 and n-2. His work is so thorough on this topic that in India, the sequence is sometimes called the "Hemachandra sequence" rather than the Fibonacci sequence.',
      hi: 'हेमचन्द्र (1089-1172 ईस्वी) ने 1150 ईस्वी में अनुक्रम प्रकाशित किया — फिबोनाची के लिबेर अबासी (1202 ईस्वी) से ठीक 52 वर्ष पहले। हेमचन्द्र एक विपुल जैन विद्वान, गणितज्ञ और कवि थे। जैन काव्य छन्दों पर अपने कार्य में, उन्होंने स्वतंत्र रूप से वही अनुक्रम बताया: कि लम्बाई n के मेट्रिकल पैटर्न की संख्या लम्बाई n-1 और n-2 के पैटर्न का योग है। इस विषय पर उनका कार्य इतना व्यापक है कि भारत में अनुक्रम को कभी-कभी फिबोनाची अनुक्रम के बजाय "हेमचन्द्र अनुक्रम" कहा जाता है।',
    },
  },
  {
    id: 'q25_6_08', type: 'mcq',
    question: {
      en: 'How did Fibonacci learn the sequence that now bears his name?',
      hi: 'फिबोनाची ने उस अनुक्रम को कैसे सीखा जो अब उनके नाम पर है?',
    },
    options: [
      { en: 'He discovered it independently by studying rabbit populations', hi: 'उन्होंने खरगोश की आबादी का अध्ययन करके इसे स्वतंत्र रूप से खोजा' },
      { en: 'He learned it from Arab mathematicians who had translated Indian mathematical texts', hi: 'उन्होंने इसे अरब गणितज्ञों से सीखा जिन्होंने भारतीय गणितीय ग्रन्थों का अनुवाद किया था' },
      { en: 'He found it in ancient Greek texts by Euclid', hi: 'उन्होंने इसे यूक्लिड की प्राचीन ग्रीक रचनाओं में पाया' },
      { en: 'He invented it himself to solve a puzzle posed by the Holy Roman Emperor', hi: 'उन्होंने इसे पवित्र रोमन सम्राट द्वारा प्रस्तुत पहेली हल करने के लिए स्वयं आविष्कार किया' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Leonardo of Pisa (Fibonacci) spent much of his youth in North Africa, where his father was a trading post administrator. There he studied under Arab mathematicians who had access to, and had translated, Indian mathematical texts — including works on Indian numeration (the decimal place-value system), algebra, and combinatorics. The famous rabbit problem in Liber Abaci was almost certainly inspired by knowledge of Indian metrical combinatorics transmitted through the Arab-Islamic mathematical tradition, which had absorbed and built upon Indian mathematics from the 8th century CE onwards.',
      hi: 'पीसा के लियोनार्डो (फिबोनाची) ने अपनी युवावस्था का अधिकांश समय उत्तरी अफ्रीका में बिताया, जहाँ उनके पिता एक व्यापारिक पोस्ट के प्रशासक थे। वहाँ उन्होंने अरब गणितज्ञों के अधीन अध्ययन किया जिनके पास भारतीय गणितीय ग्रन्थों — भारतीय अंक प्रणाली (दशमलव स्थानमान प्रणाली), बीजगणित और संयोजनशास्त्र पर कार्यों सहित — का अनुवाद था। लिबेर अबासी में प्रसिद्ध खरगोश समस्या लगभग निश्चित रूप से अरब-इस्लामी गणितीय परम्परा के माध्यम से प्रेषित भारतीय मेट्रिकल कॉम्बिनेटरिक्स के ज्ञान से प्रेरित थी, जिसने 8वीं शताब्दी ईस्वी से भारतीय गणित को अवशोषित और उस पर निर्माण किया था।',
    },
  },
  {
    id: 'q25_6_09', type: 'true_false',
    question: {
      en: 'The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13…) appears repeatedly in natural phenomena such as flower petals, spiral shells, and plant branching.',
      hi: 'फिबोनाची अनुक्रम (1, 1, 2, 3, 5, 8, 13…) फूलों की पंखुड़ियों, घुमावदार खोलों और पौधों की शाखाओं जैसी प्राकृतिक घटनाओं में बार-बार प्रकट होता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The Fibonacci sequence appears with remarkable frequency in nature: sunflower seed spirals count 34 and 55 clockwise and counter-clockwise; daisy petals often number 13, 21, or 34; pineapple scales trace 8 and 13 spirals; nautilus shells approximate the golden spiral (which is related to the golden ratio, the limit of successive Fibonacci ratios). This prevalence in nature is related to optimal packing and growth efficiency — Fibonacci numbers arise because they represent efficient solutions to packing problems that plants and other organisms have evolved to solve.',
      hi: 'सत्य। फिबोनाची अनुक्रम प्रकृति में उल्लेखनीय आवृत्ति के साथ प्रकट होता है: सूरजमुखी के बीज के सर्पिलों में घड़ी की दिशा में और घड़ी के विपरीत 34 और 55 की गिनती होती है; डेज़ी की पंखुड़ियाँ अक्सर 13, 21, या 34 होती हैं; अनानास के तराजू 8 और 13 सर्पिल बनाते हैं; नॉटिलस के खोल सुनहरे सर्पिल के करीब होते हैं (जो सुनहरे अनुपात से संबंधित है, लगातार फिबोनाची अनुपातों की सीमा)। प्रकृति में यह व्यापकता इष्टतम पैकिंग और विकास दक्षता से संबंधित है।',
    },
  },
  {
    id: 'q25_6_10', type: 'true_false',
    question: {
      en: 'Fibonacci discovered the sequence independently, without any Indian mathematical influence.',
      hi: 'फिबोनाची ने किसी भी भारतीय गणितीय प्रभाव के बिना, स्वतंत्र रूप से अनुक्रम की खोज की।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Historical evidence strongly suggests that Fibonacci learned the sequence through Arab-Indian mathematical transmission. Fibonacci explicitly credited Indian mathematics in Liber Abaci — the book opens with praise for "the nine figures of the Indians" (the decimal numerals). He spent his formative years studying under Arab mathematicians in North Africa who had direct access to translated Indian texts. The sequence had been documented in India for at least 1,300 years before Fibonacci, with explicit recurrence formulas by Virahanka (~600 CE) and Hemachandra (1150 CE, just 52 years earlier). The independent discovery claim does not hold up to historical scrutiny.',
      hi: 'असत्य। ऐतिहासिक साक्ष्य दृढ़ता से सुझाव देते हैं कि फिबोनाची ने अरब-भारतीय गणितीय प्रेषण के माध्यम से अनुक्रम सीखा। फिबोनाची ने लिबेर अबासी में स्पष्ट रूप से भारतीय गणित का श्रेय दिया — पुस्तक "भारतीयों के नौ अंकों" (दशमलव अंकों) की प्रशंसा से खुलती है। उन्होंने उत्तरी अफ्रीका में अरब गणितज्ञों के अधीन अध्ययन करते हुए अपने प्रारम्भिक वर्ष बिताए जिनके पास अनुवादित भारतीय ग्रन्थों तक सीधी पहुँच थी। अनुक्रम फिबोनाची से कम से कम 1,300 वर्ष पहले भारत में प्रलेखित था, विरहांक (~600 ईस्वी) और हेमचन्द्र (1150 ईस्वी, महज 52 वर्ष पहले) द्वारा स्पष्ट पुनरावृत्ति सूत्रों के साथ।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Musical Origin                                         */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'एक संगीत समस्या से जन्म' : 'Born From a Music Problem'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>फिबोनाची अनुक्रम (1, 1, 2, 3, 5, 8, 13, 21…) को पश्चिम में इटालियन गणितज्ञ लियोनार्डो ऑफ पीसा (फिबोनाची) के नाम पर जाना जाता है, जिन्होंने 1202 ईस्वी में लिबेर अबासी में खरगोश की आबादी की समस्या में इसका उपयोग किया। लेकिन भारतीय संगीतशास्त्री और गणितज्ञ इसी अनुक्रम को कम से कम 1,000 वर्ष पहले — संगीत और कविता के माध्यम से — जानते थे।</>
            : <>The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21…) is named in the West after Italian mathematician Leonardo of Pisa (Fibonacci), who used it in a rabbit population problem in Liber Abaci in 1202 CE. But Indian musicologists and mathematicians knew the same sequence at least 1,000 years earlier — through the mathematics of music and poetry.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ताल और छन्द की समस्या' : 'The Tala and Meter Problem'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>संस्कृत कविता में दो प्रकार के अक्षर होते हैं: <span className="text-gold-light font-medium">लघु (L)</span> — 1 मात्रा, और <span className="text-gold-light font-medium">गुरु (G)</span> — 2 मात्राएँ। प्रश्न: n मात्राओं की एक पंक्ति को लघु और गुरु अक्षरों का उपयोग करके कितने तरीकों से भरा जा सकता है?</>
            : <>Sanskrit poetry uses two types of syllables: <span className="text-gold-light font-medium">laghu (L)</span> — 1 beat, and <span className="text-gold-light font-medium">guru (G)</span> — 2 beats. The question: how many ways can a line of n beats be filled using laghus and gurus?</>}
        </p>
        <div className="mt-3 space-y-1 font-mono text-xs">
          <p className="text-text-secondary"><span className="text-gold-light">n=1:</span> {isHi ? 'L → 1 तरीका' : 'L → 1 way'}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=2:</span> {isHi ? 'LL, G → 2 तरीके' : 'LL, G → 2 ways'}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=3:</span> {isHi ? 'LLL, LG, GL → 3 तरीके' : 'LLL, LG, GL → 3 ways'}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=4:</span> {isHi ? 'LLLL, LLG, LGL, GLL, GG → 5 तरीके' : 'LLLL, LLG, LGL, GLL, GG → 5 ways'}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=5:</span> {isHi ? '8 तरीके' : '8 ways'} &nbsp;<span className="text-gold-light">n=6:</span> {isHi ? '13 तरीके' : '13 ways'}</p>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {isHi ? 'पैटर्न: 1, 2, 3, 5, 8, 13… — यही फिबोनाची अनुक्रम है!' : 'The pattern: 1, 2, 3, 5, 8, 13… — that is the Fibonacci sequence!'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'भरत मुनि — 200 ईसा पूर्व' : 'Bharata Muni — 200 BCE'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>नाट्यशास्त्र के रचयिता भरत मुनि (लगभग 200 ईसा पूर्व) ने काव्य-छन्दों के विश्लेषण में इस पैटर्न का पहली बार वर्णन किया। उनका कार्य ताल — भारतीय शास्त्रीय संगीत की लयबद्ध चक्र प्रणाली — के साथ गहराई से जुड़ा था, जहाँ अक्षरों के संयोजन को गिनने की आवश्यकता थी। यह फिबोनाची से 1,400 वर्ष पहले था।</>
            : <>Bharata Muni (c. 200 BCE), author of the Natyashastra, first described this pattern in analysing poetic meters. His work was deeply connected to tala — the rhythmic cycle system of Indian classical music — where counting syllable combinations was a practical necessity. This was 1,400 years before Fibonacci.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — From Virahanka to Hemachandra                             */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'विरहांक से हेमचन्द्र तक' : 'From Virahanka to Hemachandra'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भरत मुनि के बाद, भारतीय गणितज्ञों की एक श्रृंखला ने इस अनुक्रम को और परिष्कृत किया। प्रत्येक ने पिछले पर निर्माण किया, अन्ततः एक स्पष्ट गणितीय सूत्र तक पहुँचा — जो फिबोनाची से बहुत पहले।</>
            : <>After Bharata Muni, a chain of Indian mathematicians refined the sequence further. Each built on the previous, eventually arriving at an explicit mathematical formula — long before Fibonacci.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'भारतीय वंश-वृक्ष' : 'The Indian Lineage'}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{isHi ? 'पिंगल (~300 ईसा पूर्व)' : 'Pingala (~300 BCE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'छन्दःशास्त्र — मेट्रिकल अनुक्रमों पर सबसे पुराना ज्ञात ग्रन्थ। पिंगल ने द्विआधारी अनुक्रमों का एक कोडिंग सिस्टम विकसित किया और मेट्रिकल पैटर्न की गणना की चर्चा की जो अनुक्रम को निहित रूप से एन्कोड करती है।' : 'Chandahshastra — the oldest known treatise on metrical sequences. Pingala developed a coding system for binary sequences and discussed the counting of metrical patterns that implicitly encodes the sequence.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{isHi ? 'भरत मुनि (~200 ईसा पूर्व)' : 'Bharata Muni (~200 BCE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'नाट्यशास्त्र — ताल पैटर्न के विश्लेषण में अनुक्रम का प्रथम स्पष्ट वर्णन। संगीत और कविता में व्यावहारिक अनुप्रयोग।' : 'Natyashastra — first explicit description of the sequence in the analysis of tala patterns. Practical applications in music and poetry.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{isHi ? 'विरहांक (~600 ईस्वी)' : 'Virahanka (~600 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'पिंगल पर टिप्पणी — स्पष्ट रूप से पुनरावृत्ति नियम बताया: F(n) = F(n-1) + F(n-2)। यह पहली बार था जब नियम को गणितीय रूप से स्पष्ट किया गया।' : 'Commentary on Pingala — explicitly stated the recurrence rule: F(n) = F(n-1) + F(n-2). This was the first time the rule was made mathematically explicit.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{isHi ? 'गोपाल (~1100 ईस्वी)' : 'Gopala (~1100 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'अनुक्रम और उसके गुणों पर विस्तारित कार्य। छन्द कविता में पैटर्न की व्यापक सूची।' : 'Extended work on the sequence and its properties. Comprehensive listing of patterns in metrical poetry.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{isHi ? 'हेमचन्द्र (1150 ईस्वी)' : 'Hemachandra (1150 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'जैन काव्य छन्दों पर व्यापक ग्रन्थ। फिबोनाची से ठीक 52 वर्ष पहले पुनरावृत्ति और अनुक्रम का पूर्ण उपचार। भारत में कभी-कभी "हेमचन्द्र अनुक्रम" कहा जाता है।' : 'Comprehensive treatise on Jain poetic meters. Full treatment of the recurrence and sequence, exactly 52 years before Fibonacci. Sometimes called the "Hemachandra sequence" in India.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'क्यों संगीत गणित पैदा करता है' : 'Why Music Generates Mathematics'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>भारतीय शास्त्रीय संगीत गणितीय रूप से सटीक है। ताल प्रणाली को अनुक्रमों, चक्रों और संयोजनों की सटीक गणना की आवश्यकता है। एक संगीतकार को यह जानने की आवश्यकता होती है कि 8-बीट चक्र में कितने अलग-अलग लय पैटर्न संभव हैं — यह ठीक वही प्रश्न है जो फिबोनाची संख्याओं की ओर ले जाता है। भारतीय परम्परा में गणित और संगीत कभी अलग नहीं थे।</>
            : <>Indian classical music is mathematically precise. The tala system requires exact counting of sequences, cycles, and combinations. A musician needs to know how many distinct rhythmic patterns are possible in an 8-beat cycle — this is precisely the question that leads to Fibonacci numbers. In the Indian tradition, mathematics and music were never separate.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Transmission to Fibonacci and Legacy                      */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अरब-भारतीय प्रेषण और विरासत' : 'Arab-Indian Transmission and Legacy'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारत से यूरोप तक ज्ञान का प्रवाह अरब-इस्लामी दुनिया से होकर गया। 8वीं शताब्दी ईस्वी से, अरब विद्वानों ने भारतीय गणितीय ग्रन्थों का बड़े पैमाने पर अनुवाद और विस्तार किया। यही वह मार्ग था जिससे होकर फिबोनाची — जिन्होंने उत्तरी अफ्रीका में अरब गणितज्ञों से सीखा — इस अनुक्रम तक पहुँचे।</>
            : <>The flow of knowledge from India to Europe passed through the Arab-Islamic world. From the 8th century CE, Arab scholars translated and expanded Indian mathematical texts on a large scale. This was the path by which Fibonacci — who learned from Arab mathematicians in North Africa — encountered the sequence.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ज्ञान का मार्ग' : 'The Path of Knowledge'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{isHi ? '200 ईसा पूर्व – 1150 ईस्वी:' : '200 BCE – 1150 CE:'}</span> {isHi ? 'भारतीय छन्दशास्त्र में अनुक्रम का विकास — भरत मुनि से हेमचन्द्र तक।' : 'Sequence developed in Indian prosody — Bharata Muni to Hemachandra.'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? '8वीं–10वीं शताब्दी ईस्वी:' : '8th–10th century CE:'}</span> {isHi ? 'अरब विद्वानों ने भारतीय गणितीय ग्रन्थों का अनुवाद किया — अल-खवारिज्मी, अल-बिरूनी। भारतीय बीजगणित, अंक प्रणाली और छन्दशास्त्र अरबी में उपलब्ध हो गए।' : 'Arab scholars translate Indian mathematical texts — Al-Khwarizmi, Al-Biruni. Indian algebra, numeral system, and prosody became available in Arabic.'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? '1170–1190 ईस्वी:' : '1170–1190 CE:'}</span> {isHi ? 'फिबोनाची का युवाकाल। उनके पिता पीसा के व्यापारिक प्रतिनिधि के रूप में बुगिया (आधुनिक अल्जीरिया) में थे। फिबोनाची ने वहाँ और बाद में भूमध्यसागरीय अरब केन्द्रों में अध्ययन किया।' : 'Fibonacci\'s youth. His father was a Pisan trading representative in Bugia (modern Algeria). Fibonacci studied there and later at Arab centres around the Mediterranean.'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? '1202 ईस्वी:' : '1202 CE:'}</span> {isHi ? 'लिबेर अबासी प्रकाशित। फिबोनाची स्पष्ट रूप से भारतीय अंक प्रणाली का श्रेय देते हैं। खरगोश समस्या अनुक्रम प्रस्तुत करती है।' : 'Liber Abaci published. Fibonacci explicitly credits the Indian numeral system. The rabbit problem presents the sequence.'}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'विरासत: क्या नाम रखा जाए?' : 'Legacy: What Shall We Call It?'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>गणित के इतिहासकार यह तेजी से स्वीकार कर रहे हैं कि अनुक्रम को "फिबोनाची अनुक्रम" के रूप में पहचाना जाना ऐतिहासिक रूप से गलत है। कुछ प्रस्ताव:</>
            : <>Historians of mathematics increasingly acknowledge that identifying the sequence as the "Fibonacci sequence" is historically inaccurate. Some proposals:</>}
        </p>
        <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
          <li>{isHi ? '"हेमचन्द्र-फिबोनाची अनुक्रम" — दोनों की भूमिका को स्वीकार करता है' : '"Hemachandra-Fibonacci sequence" — acknowledges both contributions'}</li>
          <li>{isHi ? '"विरहांक अनुक्रम" — जिसने पहले पुनरावृत्ति को स्पष्ट किया' : '"Virahanka sequence" — for who first made the recurrence explicit'}</li>
          <li>{isHi ? 'भारत में "हेमचन्द्र अनुक्रम" — सबसे हाल के पूर्ण भारतीय उपचार के लिए' : '"Hemachandra sequence" in India — for the most recent complete Indian treatment'}</li>
        </ul>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {isHi
            ? <>नाम से परे, महत्त्वपूर्ण बात यह है: भारतीय संगीत की गणितीय परम्परा ने — ताल और छन्द के माध्यम से — एक अनुक्रम की खोज की जो प्रकृति के संरचनात्मक सिद्धान्तों में दिखाई देता है, और यह खोज 1,000 वर्षों से अधिक समय के लिए यूरोप से पहले हुई।</>
            : <>Beyond the name, the important point is this: India's mathematical tradition of music — through tala and meter — discovered a sequence that appears in nature's structural principles, and this discovery preceded Europe by over 1,000 years.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module25_6Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
