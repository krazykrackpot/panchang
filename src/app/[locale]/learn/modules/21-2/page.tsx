'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_21_2', phase: 8, topic: 'Varshaphal', moduleNumber: '21.2',
  title: { en: 'Sahams — Sensitive Points (Punya, Vidya, Karma)', hi: 'सहम — संवेदनशील बिन्दु (पुण्य, विद्या, कर्म)' },
  subtitle: {
    en: 'Arabic Parts adapted into Tajika — computed sensitive points that reveal fortune, education, career, and health prospects in the annual chart',
    hi: 'ताजिक में समाहित अरबी भाग — गणित संवेदनशील बिन्दु जो वार्षिक कुण्डली में भाग्य, शिक्षा, करियर और स्वास्थ्य सम्भावनाएँ प्रकट करते हैं',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 21-1: Tajika Aspects', hi: 'मॉड्यूल 21-1: ताजिक दृष्टि' }, href: '/learn/modules/21-1' },
    { label: { en: 'Module 21-3: Mudda Dasha', hi: 'मॉड्यूल 21-3: मुद्दा दशा' }, href: '/learn/modules/21-3' },
    { label: { en: 'Module 21-4: Tithi Pravesha', hi: 'मॉड्यूल 21-4: तिथि प्रवेश' }, href: '/learn/modules/21-4' },
    { label: { en: 'Varshaphal Tool', hi: 'वर्षफल उपकरण' }, href: '/varshaphal' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q21_2_01', type: 'mcq',
    question: {
      en: 'What is the general formula for computing a Saham?',
      hi: 'सहम गणना का सामान्य सूत्र क्या है?',
    },
    options: [
      { en: 'Saham = Point_A - Point_B + Point_C', hi: 'सहम = बिन्दु_A - बिन्दु_B + बिन्दु_C' },
      { en: 'Saham = Point_A + Point_B - Point_C', hi: 'सहम = बिन्दु_A + बिन्दु_B - बिन्दु_C' },
      { en: 'Saham = Point_A x Point_B / Point_C', hi: 'सहम = बिन्दु_A x बिन्दु_B / बिन्दु_C' },
      { en: 'Saham = (Point_A + Point_B) / 2', hi: 'सहम = (बिन्दु_A + बिन्दु_B) / 2' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The standard Saham formula is: Saham = Point_A + Point_B - Point_C. If the result exceeds 360 degrees, subtract 360. Different Sahams use different planet/point combinations in the formula.',
      hi: 'मानक सहम सूत्र है: सहम = बिन्दु_A + बिन्दु_B - बिन्दु_C। यदि परिणाम 360 अंश से अधिक हो, तो 360 घटाएँ। भिन्न सहम सूत्र में भिन्न ग्रह/बिन्दु संयोजनों का उपयोग करते हैं।',
    },
  },
  {
    id: 'q21_2_02', type: 'mcq',
    question: {
      en: 'What is the formula for Punya Saham (Part of Fortune)?',
      hi: 'पुण्य सहम (भाग्य भाग) का सूत्र क्या है?',
    },
    options: [
      { en: 'Sun + Moon - Lagna', hi: 'सूर्य + चन्द्र - लग्न' },
      { en: 'Moon + Sun - Lagna', hi: 'चन्द्र + सूर्य - लग्न' },
      { en: 'Jupiter + Mercury - Lagna', hi: 'गुरु + बुध - लग्न' },
      { en: 'Saturn + Sun - Lagna', hi: 'शनि + सूर्य - लग्न' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Punya Saham (Part of Fortune) = Moon + Sun - Lagna. This is the most important Saham, indicating where general fortune and luck concentrate in the annual chart.',
      hi: 'पुण्य सहम (भाग्य भाग) = चन्द्र + सूर्य - लग्न। यह सबसे महत्त्वपूर्ण सहम है, जो बताता है कि वार्षिक कुण्डली में सामान्य भाग्य और सौभाग्य कहाँ केन्द्रित हैं।',
    },
  },
  {
    id: 'q21_2_03', type: 'true_false',
    question: {
      en: 'Sahams are actual planetary bodies that can be observed in the sky.',
      hi: 'सहम वास्तविक ग्रह पिण्ड हैं जिन्हें आकाश में देखा जा सकता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Sahams are purely MATHEMATICAL sensitive points computed from the positions of planets and the Ascendant. They have no physical existence — they are abstract points in the zodiac that carry specific significations.',
      hi: 'असत्य। सहम विशुद्ध रूप से गणितीय संवेदनशील बिन्दु हैं जो ग्रहों और लग्न की स्थितियों से गणित किए जाते हैं। इनका कोई भौतिक अस्तित्व नहीं — ये राशिचक्र में अमूर्त बिन्दु हैं जो विशिष्ट कारकत्व धारण करते हैं।',
    },
  },
  {
    id: 'q21_2_04', type: 'mcq',
    question: {
      en: 'Which Saham indicates educational prospects?',
      hi: 'कौन-सा सहम शैक्षिक सम्भावनाएँ बताता है?',
    },
    options: [
      { en: 'Karma Saham', hi: 'कर्म सहम' },
      { en: 'Vivaha Saham', hi: 'विवाह सहम' },
      { en: 'Vidya Saham', hi: 'विद्या सहम' },
      { en: 'Mrityu Saham', hi: 'मृत्यु सहम' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Vidya Saham (Part of Education) = Jupiter + Mercury - Lagna. It indicates educational prospects, learning opportunities, examinations, and intellectual achievements for the year.',
      hi: 'विद्या सहम (शिक्षा भाग) = गुरु + बुध - लग्न। यह वर्ष की शैक्षिक सम्भावनाओं, विद्या अवसरों, परीक्षाओं और बौद्धिक उपलब्धियों का संकेत देता है।',
    },
  },
  {
    id: 'q21_2_05', type: 'mcq',
    question: {
      en: 'What is the formula for Karma Saham (Part of Career)?',
      hi: 'कर्म सहम (करियर भाग) का सूत्र क्या है?',
    },
    options: [
      { en: 'Moon + Sun - Lagna', hi: 'चन्द्र + सूर्य - लग्न' },
      { en: 'Jupiter + Mercury - Lagna', hi: 'गुरु + बुध - लग्न' },
      { en: 'Saturn + Sun - Lagna', hi: 'शनि + सूर्य - लग्न' },
      { en: 'Venus + Mars - Lagna', hi: 'शुक्र + मंगल - लग्न' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Karma Saham (Part of Career) = Saturn + Sun - Lagna. Saturn represents discipline and labor, Sun represents authority and position. Together they indicate career and professional standing.',
      hi: 'कर्म सहम (करियर भाग) = शनि + सूर्य - लग्न। शनि अनुशासन और श्रम का प्रतिनिधित्व करता है, सूर्य अधिकार और पद का। साथ मिलकर ये करियर और व्यावसायिक स्थिति का संकेत देते हैं।',
    },
  },
  {
    id: 'q21_2_06', type: 'true_false',
    question: {
      en: 'If Punya Saham falls in the 10th house of the annual chart, it indicates fortune through career.',
      hi: 'यदि पुण्य सहम वार्षिक कुण्डली के दशम भाव में आता है, तो यह करियर द्वारा भाग्य का संकेत देता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The house in which Punya Saham falls indicates the primary area through which fortune manifests. In the 10th house = career/public life; in the 4th = home/property; in the 7th = partnership/spouse; in the 2nd = wealth/family.',
      hi: 'सत्य। पुण्य सहम जिस भाव में पड़ता है वह प्राथमिक क्षेत्र बताता है जिसके माध्यम से भाग्य प्रकट होता है। दशम भाव में = करियर/सार्वजनिक जीवन; चतुर्थ में = गृह/सम्पत्ति; सप्तम में = साझेदारी/जीवनसाथी; द्वितीय में = धन/परिवार।',
    },
  },
  {
    id: 'q21_2_07', type: 'mcq',
    question: {
      en: 'How many Sahams are commonly used in Varshaphal analysis?',
      hi: 'वर्षफल विश्लेषण में सामान्यतः कितने सहम प्रयुक्त होते हैं?',
    },
    options: [
      { en: 'About 5', hi: 'लगभग 5' },
      { en: 'About 16', hi: 'लगभग 16' },
      { en: 'About 50', hi: 'लगभग 50' },
      { en: 'About 108', hi: 'लगभग 108' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Approximately 16 Sahams are commonly used in Varshaphal, covering fortune, education, fame, friendship, career, disease, marriage, children, death, and other major life areas.',
      hi: 'वर्षफल में लगभग 16 सहम सामान्यतः प्रयुक्त होते हैं, जो भाग्य, शिक्षा, यश, मित्रता, करियर, रोग, विवाह, सन्तान, मृत्यु और अन्य प्रमुख जीवन क्षेत्रों को आवृत करते हैं।',
    },
  },
  {
    id: 'q21_2_08', type: 'mcq',
    question: {
      en: 'What happens when the year lord forms Ithasala with the lord of Punya Saham\'s sign?',
      hi: 'जब वर्ष स्वामी पुण्य सहम की राशि के स्वामी से इत्थशाल बनाता है तब क्या होता है?',
    },
    options: [
      { en: 'An unfortunate year', hi: 'एक दुर्भाग्यपूर्ण वर्ष' },
      { en: 'A generally fortunate year', hi: 'एक सामान्यतः भाग्यशाली वर्ष' },
      { en: 'Health problems', hi: 'स्वास्थ्य समस्याएँ' },
      { en: 'No specific effect', hi: 'कोई विशिष्ट प्रभाव नहीं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'When the year lord forms Ithasala with the Punya Saham\'s sign lord, it indicates a generally fortunate year. The Ithasala (application) confirms that the fortune promised by Punya Saham will actually manifest.',
      hi: 'जब वर्ष स्वामी पुण्य सहम के राशि स्वामी से इत्थशाल बनाता है, तो यह सामान्यतः भाग्यशाली वर्ष का संकेत देता है। इत्थशाल (आवेदन) पुष्टि करता है कि पुण्य सहम द्वारा वादित भाग्य वास्तव में प्रकट होगा।',
    },
  },
  {
    id: 'q21_2_09', type: 'true_false',
    question: {
      en: 'Mrityu Saham (death point) always indicates physical death in that year.',
      hi: 'मृत्यु सहम (मृत्यु बिन्दु) सदैव उस वर्ष शारीरिक मृत्यु का संकेत देता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Mrityu Saham is used cautiously and does NOT automatically indicate death. It may indicate health concerns, transformative endings, or metaphorical "death" of a life phase. Only when combined with severe afflictions in the natal chart does it warrant serious health concern.',
      hi: 'असत्य। मृत्यु सहम सावधानीपूर्वक प्रयोग किया जाता है और स्वचालित रूप से मृत्यु का संकेत नहीं देता। यह स्वास्थ्य चिन्ताओं, परिवर्तनकारी समाप्तियों, या जीवन चरण की रूपक "मृत्यु" का संकेत दे सकता है। केवल जन्म कुण्डली में गम्भीर पीड़ाओं के साथ संयुक्त होने पर गम्भीर स्वास्थ्य चिन्ता उचित है।',
    },
  },
  {
    id: 'q21_2_10', type: 'mcq',
    question: {
      en: 'Which Saham would you examine for marriage prospects in the annual chart?',
      hi: 'वार्षिक कुण्डली में विवाह सम्भावनाओं के लिए कौन-सा सहम जाँचेंगे?',
    },
    options: [
      { en: 'Punya Saham', hi: 'पुण्य सहम' },
      { en: 'Karma Saham', hi: 'कर्म सहम' },
      { en: 'Vivaha Saham', hi: 'विवाह सहम' },
      { en: 'Vidya Saham', hi: 'विद्या सहम' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Vivaha Saham (Part of Marriage) is specifically designed to indicate marriage prospects. Its house placement, the strength of its sign lord, and Tajika yogas involving its lord all determine if marriage will happen that year.',
      hi: 'विवाह सहम (विवाह भाग) विशेष रूप से विवाह सम्भावनाओं के संकेत हेतु निर्मित है। इसका भाव स्थान, इसके राशि स्वामी का बल, और इसके स्वामी से सम्बन्धित ताजिक योग सब निर्धारित करते हैं कि उस वर्ष विवाह होगा या नहीं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'सहम क्या हैं?' : 'What Are Sahams?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सहम (&quot;अरबी भाग&quot; या &quot;लॉट&quot; भी कहे जाते हैं) राशिचक्र में गणितीय रूप से गणित संवेदनशील बिन्दु हैं जो विशिष्ट जीवन क्षेत्रों के कारकत्व को एक अंश में केन्द्रित करते हैं। प्रत्येक सहम एक सरल सूत्र से गणित होता है: सहम = बिन्दु_A + बिन्दु_B - बिन्दु_C, जहाँ तीन बिन्दु प्रायः ग्रह या लग्न हैं। राशिचक्र में परिणामी अंश वार्षिक कुण्डली में उस जीवन क्षेत्र का शक्तिशाली सूचक बन जाता है।</>
            : <>Sahams (also called &quot;Arabic Parts&quot; or &quot;Lots&quot;) are mathematically computed sensitive points in the zodiac that concentrate the signification of specific life areas into a single degree. Each Saham is calculated using a simple formula: Saham = Point_A + Point_B - Point_C, where the three points are typically planets or the Ascendant. The resulting degree in the zodiac becomes a powerful indicator for that life area in the annual chart.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'सबसे महत्त्वपूर्ण सहम हैं: पुण्य सहम (भाग्य) = चन्द्र + सूर्य - लग्न; विद्या सहम (शिक्षा) = गुरु + बुध - लग्न; कर्म सहम (करियर) = शनि + सूर्य - लग्न; यशस सहम (यश) = गुरु + सूर्य - लग्न; मित्र सहम (मित्रता) = गुरु + चन्द्र - लग्न; विवाह सहम = शुक्र + शनि - लग्न; पुत्र सहम (सन्तान) = गुरु + चन्द्र - लग्न; रोग सहम (रोग) = शनि + मंगल - लग्न; और मृत्यु सहम (मृत्यु/रूपान्तरण) = शनि + चन्द्र - लग्न। ताजिक अभ्यास में लगभग 16 सहम मानक हैं।'
            : 'The most important Sahams are: Punya Saham (fortune) = Moon + Sun - Lagna; Vidya Saham (education) = Jupiter + Mercury - Lagna; Karma Saham (career) = Saturn + Sun - Lagna; Yashas Saham (fame) = Jupiter + Sun - Lagna; Mitra Saham (friendship) = Jupiter + Moon - Lagna; Vivaha Saham (marriage) = Venus + Saturn - Lagna; Putra Saham (children) = Jupiter + Moon - Lagna; Roga Saham (disease) = Saturn + Mars - Lagna; and Mrityu Saham (death/transformation) = Saturn + Moon - Lagna. Approximately 16 Sahams are standard in Tajika practice.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>सहम हेलेनिस्टिक &quot;लॉट&quot; (ग्रीक: &quot;क्लेरोस&quot;) से व्युत्पन्न हैं, जिनमें सबसे प्रसिद्ध लॉट ऑफ फॉर्च्यून (टाइखे) है। ये अरबी मध्यस्थों द्वारा भारतीय ज्योतिष में आए — अरबी &quot;सहम&quot; (बहुवचन: सुहम) का अर्थ &quot;तीर&quot; या &quot;भाग&quot; है। ताजिक नीलकण्ठी और समरसिंह के कर्मप्रकाश जैसे ग्रन्थ भारतीय अनुकूलनों का विवरण देते हैं। यद्यपि सूत्र अपने अरबी/हेलेनिस्टिक मूल से समान हैं, भारतीय ज्योतिषी इन्हें भाव, स्वामित्व और दशाओं के वैदिक ढाँचे में व्याख्यायित करते हैं।</>
            : <>Sahams derive from the Hellenistic &quot;Lots&quot; (Greek: &quot;Kleros&quot;), the most famous being the Lot of Fortune (Tyche). They entered Indian astrology through Arabic intermediaries — the Arabic &quot;Sahm&quot; (plural: Suham) means &quot;arrow&quot; or &quot;lot.&quot; Texts like Tajika Neelakanthi and Samarasimha&apos;s Karmaprakasha detail the Indian adaptations. While the formulas are identical to their Arabic/Hellenistic originals, Indian astrologers interpret them within the Vedic framework of houses, lordships, and dashas.</>}
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'सहम गणना और व्याख्या' : 'Computing and Interpreting Sahams'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सहम की व्याख्या के लिए, पहले सूत्र से उसकी राशिचक्रीय स्थिति गणित करें, फिर विश्लेषण करें: (1) सहम किस भाव में पड़ता है? यह दिखाता है कि सहम का कारकत्व किस जीवन क्षेत्र से प्रकट होगा। पुण्य सहम दशम में = करियर द्वारा भाग्य; सप्तम में = साझेदारी द्वारा भाग्य। (2) सहम किस राशि में है? राशि स्वामी &quot;सहम स्वामी&quot; बनता है और उसका बल, मर्यादा और ताजिक योग परिणाम निर्धारित करते हैं। (3) क्या वर्ष स्वामी सहम स्वामी से इत्थशाल बनाता है? यदि हाँ, तो सहम का वादा इस वर्ष प्रकट होगा।</>
            : <>To interpret a Saham, first compute its zodiacal position using the formula, then analyze: (1) Which HOUSE does the Saham fall in? This shows the life area through which the Saham&apos;s signification manifests. Punya Saham in the 10th = fortune through career; in the 7th = fortune through partnership. (2) Which SIGN is the Saham in? The sign lord becomes the &quot;Saham lord&quot; and its strength, dignity, and Tajika yogas determine the outcome. (3) Does the year lord form Ithasala with the Saham lord? If yes, the Saham&apos;s promise will manifest this year.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For health concerns, Mrityu Saham is examined cautiously. If the year lord forms Ithasala with the Mrityu Saham lord, it warrants attention to health — but does NOT automatically predict death. The natal chart must show corresponding vulnerability (dasha of maraka planets, afflicted 8th house) for any serious concern. In most cases, Mrityu Saham activation indicates transformative endings, lifestyle changes, or metaphorical &quot;death&quot; of a phase of life.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={isHi ? 'उदाहरण कुण्डली' : 'Example Chart'} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">पुण्य सहम गणना:</span> वर्षफल कुण्डली में — चन्द्र 120 अंश (0 अंश सिंह), सूर्य 45 अंश (15 अंश वृषभ), लग्न 90 अंश (0 अंश कर्क)। पुण्य सहम = 120 + 45 - 90 = 75 अंश = 15 अंश मिथुन। पुण्य सहम मिथुन में द्वादश भाव में पड़ता है। राशि स्वामी = बुध। व्याख्या: भाग्य द्वादश भाव कारकत्वों — विदेशी सम्बन्ध, आध्यात्मिक साधना, या पर्दे के पीछे कार्य — द्वारा आता है। यदि बुध (सहम स्वामी) बलवान है और वर्ष स्वामी बुध से इत्थशाल बनाता है → विदेशी आय या आध्यात्मिक विकास द्वारा भाग्यशाली वर्ष।</>
            : <><span className="text-gold-light font-medium">Computing Punya Saham:</span> In the Varshaphal chart — Moon at 120 degrees (0 degrees Leo), Sun at 45 degrees (15 degrees Taurus), Lagna at 90 degrees (0 degrees Cancer). Punya Saham = 120 + 45 - 90 = 75 degrees = 15 degrees Gemini. Punya Saham falls in Gemini in the 12th house. Sign lord = Mercury. Interpretation: fortune comes through 12th house significations — foreign connections, spiritual pursuits, or behind-the-scenes work. If Mercury (Saham lord) is strong and the year lord forms Ithasala with Mercury → a fortunate year via foreign income or spiritual growth.</>}
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'प्रमुख सहम सन्दर्भ' : 'Key Sahams Reference'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'सबसे महत्त्वपूर्ण सहम उनके सूत्रों और व्याख्या केन्द्र सहित: पुण्य (चन्द्र+सूर्य-लग्न) सामान्य भाग्य और सौभाग्य हेतु। विद्या (गुरु+बुध-लग्न) शिक्षा, परीक्षा और विद्या हेतु। यशस (गुरु+सूर्य-लग्न) यश, प्रतिष्ठा और सार्वजनिक मान्यता हेतु। मित्र (गुरु+चन्द्र-लग्न) मित्रता और सामाजिक सम्बन्ध हेतु। कर्म (शनि+सूर्य-लग्न) करियर, व्यवसाय और अधिकार हेतु। रोग (शनि+मंगल-लग्न) रोग और स्वास्थ्य समस्याओं हेतु। विवाह (शुक्र+शनि-लग्न) विवाह और प्रणय साझेदारी हेतु। पुत्र (गुरु+चन्द्र-लग्न) सन्तान हेतु। मृत्यु (शनि+चन्द्र-लग्न) मृत्यु, रूपान्तरण और समाप्तियों हेतु।'
            : 'Here are the most important Sahams with their formulas and interpretive focus: Punya (Moon+Sun-Lagna) for general fortune and luck. Vidya (Jupiter+Mercury-Lagna) for education, exams, and learning. Yashas (Jupiter+Sun-Lagna) for fame, reputation, and public recognition. Mitra (Jupiter+Moon-Lagna) for friendships and social connections. Karma (Saturn+Sun-Lagna) for career, profession, and authority. Roga (Saturn+Mars-Lagna) for disease and health issues. Vivaha (Venus+Saturn-Lagna) for marriage and romantic partnerships. Putra (Jupiter+Moon-Lagna) for children and progeny. Mrityu (Saturn+Moon-Lagna) for death, transformation, and endings.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;सहम गुरुत्वाकर्षण प्रभाव वाले वास्तविक खगोलीय पिण्ड हैं।&quot; सहम विशुद्ध गणितीय संरचनाएँ हैं — इनका कोई भौतिक अस्तित्व, कोई द्रव्यमान, कोई गुरुत्वाकर्षण नहीं। ये अमूर्त बिन्दु हैं जो तीन कुण्डली कारकों के प्रतीकात्मक सम्बन्ध को एक संवेदनशील अंश में केन्द्रित करते हैं। इन्हें खगोलीय वस्तुओं के बजाय &quot;ज्योतिषीय सदिश&quot; समझें।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Sahams are real celestial bodies with gravitational influence.&quot; Sahams are purely mathematical constructs — they have no physical existence, no mass, no gravitational pull. They are abstract points that concentrate the symbolic relationship between three chart factors into a single sensitive degree. Think of them as &quot;astrological vectors&quot; rather than celestial objects.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>हमारा वर्षफल पृष्ठ वार्षिक कुण्डली से स्वचालित रूप से सभी सहम गणित करता है, उनकी राशिचक्रीय स्थितियाँ, भाव स्थान और राशि स्वामी प्रदर्शित करता है। उपकरण यह भी विश्लेषण करता है कि वर्ष स्वामी प्रत्येक सहम स्वामी से ताजिक योग (इत्थशाल/ईषराफ) बनाता है या नहीं, जिससे उपयोगकर्ताओं को तत्काल चित्र मिलता है कि वर्ष में कौन-से जीवन क्षेत्र &quot;सक्रिय&quot; हैं। यह स्वचालन सहम विश्लेषण को सबके लिए सुलभ बनाता है — पहले केवल 5 सहम मैनुअली गणित करने में भी काफी अंकगणितीय प्रयास लगता था।</>
            : <>Our Varshaphal page computes all Sahams automatically from the annual chart, displaying their zodiacal positions, house placements, and sign lords. The tool also analyzes whether the year lord forms Tajika yogas (Ithasala/Easarapha) with each Saham lord, giving users an immediate picture of which life areas are &quot;activated&quot; for the year. This automation makes Saham analysis accessible to everyone — previously, computing even 5 Sahams manually required significant arithmetic effort.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module21_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
