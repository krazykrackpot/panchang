'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_18_4', phase: 5, topic: 'Strength', moduleNumber: '18.4',
  title: {
    en: 'Avasthas — Planetary States & Moods',
    hi: 'अवस्थाएँ — ग्रहों की दशाएँ एवं भाव',
  },
  subtitle: {
    en: 'Bala-Panchaka (5 age states), Deeptadi (9 dignity states), and Lajjitadi (6 complex states from BPHS) — how planetary "mood" shapes the quality of results',
    hi: 'बाल-पञ्चक (5 आयु अवस्थाएँ), दीप्तादि (9 गरिमा अवस्थाएँ), और लज्जितादि (BPHS की 6 जटिल अवस्थाएँ) — ग्रह का "भाव" परिणामों की गुणवत्ता कैसे निर्धारित करता है',
  },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: 'Module 18-1: Shadbala Overview', hi: 'मॉड्यूल 18-1: षड्बल अवलोकन' }, href: '/learn/modules/18-1' },
    { label: { en: 'Module 18-5: Vimshopaka Bala', hi: 'मॉड्यूल 18-5: विंशोपक बल' }, href: '/learn/modules/18-5' },
    { label: { en: 'Kundali Tool', hi: 'कुण्डली उपकरण' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q18_4_01', type: 'mcq',
    question: {
      en: 'In the Bala-Panchaka system, which avastha gives the strongest results?',
      hi: 'बाल-पञ्चक पद्धति में कौन-सी अवस्था सर्वाधिक बलवान परिणाम देती है?',
    },
    options: [
      { en: 'Bala (infant)', hi: 'बाल (शिशु)' },
      { en: 'Kumara (youth)', hi: 'कुमार (युवा)' },
      { en: 'Yuva (prime)', hi: 'युवा (प्रौढ़)' },
      { en: 'Vriddha (old)', hi: 'वृद्ध (वृद्ध)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Yuva (prime, 12-18° in odd signs) represents a planet at its peak vitality and capacity. Like a person in the prime of life, the planet delivers its strongest and most productive results in this state.',
      hi: 'युवा (प्रौढ़, विषम राशियों में 12-18°) ग्रह की चरम जीवनशक्ति और क्षमता को दर्शाता है। जीवन के प्रौढ़ काल में व्यक्ति की भाँति, ग्रह इस अवस्था में अपने सर्वाधिक बलवान और उत्पादक परिणाम देता है।',
    },
  },
  {
    id: 'q18_4_02', type: 'mcq',
    question: {
      en: 'A planet at 3° of Aries (an odd sign) is in which Bala-Panchaka avastha?',
      hi: 'मेष (विषम राशि) में 3° पर स्थित ग्रह किस बाल-पञ्चक अवस्था में है?',
    },
    options: [
      { en: 'Yuva (prime)', hi: 'युवा (प्रौढ़)' },
      { en: 'Bala (infant)', hi: 'बाल (शिशु)' },
      { en: 'Kumara (youth)', hi: 'कुमार (युवा)' },
      { en: 'Mrita (dead)', hi: 'मृत (मृत)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'In odd signs, Bala (infant) spans 0-6°. A planet at 3° of Aries falls squarely in the Bala range. Like a newborn, the planet has potential but delivers immature or undeveloped results — promises much but fulfils only partially.',
      hi: 'विषम राशियों में, बाल (शिशु) 0-6° के बीच होती है। मेष में 3° पर स्थित ग्रह बाल सीमा में आता है। नवजात शिशु की भाँति, ग्रह में क्षमता होती है परन्तु अपरिपक्व या अविकसित परिणाम देता है।',
    },
  },
  {
    id: 'q18_4_03', type: 'true_false',
    question: {
      en: 'In even signs, the Bala-Panchaka degree ranges are reversed compared to odd signs.',
      hi: 'सम राशियों में, बाल-पञ्चक अंश सीमाएँ विषम राशियों की तुलना में उलटी होती हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. In odd signs, Bala is 0-6° and Mrita is 24-30°. In even signs, the order reverses: Mrita is 0-6° and Bala is 24-30°. This reflects the Vedic principle of alternation — odd and even signs mirror each other in many astrological rules.',
      hi: 'सत्य। विषम राशियों में, बाल 0-6° और मृत 24-30° होती है। सम राशियों में, क्रम उलट जाता है: मृत 0-6° और बाल 24-30° होती है। यह वैदिक प्रत्यावर्तन सिद्धान्त को दर्शाता है — विषम और सम राशियाँ कई ज्योतिषीय नियमों में एक-दूसरे को प्रतिबिम्बित करती हैं।',
    },
  },
  {
    id: 'q18_4_04', type: 'mcq',
    question: {
      en: 'In the Deeptadi system, what is the state of an exalted planet?',
      hi: 'दीप्तादि पद्धति में, उच्च ग्रह की अवस्था क्या होती है?',
    },
    options: [
      { en: 'Swastha (content)', hi: 'स्वस्थ (सन्तुष्ट)' },
      { en: 'Deepta (brilliant)', hi: 'दीप्त (उज्ज्वल)' },
      { en: 'Shakta (powerful)', hi: 'शक्त (शक्तिशाली)' },
      { en: 'Mudita (happy)', hi: 'मुदित (प्रसन्न)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Deepta means "blazing" or "brilliant." An exalted planet is in its highest state of dignity and shines with maximum luminosity. It delivers results with confidence, visibility, and authority — like a king on his throne.',
      hi: 'दीप्त का अर्थ है "प्रज्वलित" या "उज्ज्वल।" उच्च ग्रह अपनी सर्वोच्च गरिमा अवस्था में होता है और अधिकतम दीप्ति के साथ चमकता है। यह आत्मविश्वास, दृश्यता और अधिकार के साथ परिणाम देता है — जैसे सिंहासन पर बैठा राजा।',
    },
  },
  {
    id: 'q18_4_05', type: 'mcq',
    question: {
      en: 'Which Deeptadi avastha describes a retrograde planet?',
      hi: 'कौन-सी दीप्तादि अवस्था वक्री ग्रह का वर्णन करती है?',
    },
    options: [
      { en: 'Vikala (disabled)', hi: 'विकल (अशक्त)' },
      { en: 'Dina (miserable)', hi: 'दीन (दुःखी)' },
      { en: 'Shakta (powerful)', hi: 'शक्त (शक्तिशाली)' },
      { en: 'Bhita (fearful)', hi: 'भीत (भयभीत)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Shakta means "empowered." A retrograde planet is considered powerful in Vedic astrology because retrogression indicates the planet is closest to Earth, intensifying its influence. This is counterintuitive to beginners who assume "backward" means weak.',
      hi: 'शक्त का अर्थ है "सशक्त।" वैदिक ज्योतिष में वक्री ग्रह को शक्तिशाली माना जाता है क्योंकि वक्रता यह दर्शाती है कि ग्रह पृथ्वी के सबसे निकट है, जो इसके प्रभाव को तीव्र करता है। यह उन नवशिक्षार्थियों के लिए प्रतिकूल है जो मानते हैं कि "पीछे जाना" अर्थात् दुर्बल।',
    },
  },
  {
    id: 'q18_4_06', type: 'mcq',
    question: {
      en: 'A combust planet (too close to the Sun) is in which Deeptadi state?',
      hi: 'अस्त ग्रह (सूर्य के अत्यन्त निकट) किस दीप्तादि अवस्था में होता है?',
    },
    options: [
      { en: 'Khala (wicked)', hi: 'खल (दुष्ट)' },
      { en: 'Bhita (fearful)', hi: 'भीत (भयभीत)' },
      { en: 'Vikala (disabled)', hi: 'विकल (अशक्त)' },
      { en: 'Dina (miserable)', hi: 'दीन (दुःखी)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Vikala means "disabled" or "crippled." Combustion occurs when a planet is too close to the Sun and its light is overwhelmed. The planet cannot express itself independently — its significations are subsumed by the Sun\'s overpowering brilliance, rendering it functionally impaired.',
      hi: 'विकल का अर्थ है "अशक्त" या "पंगु।" दहन तब होता है जब ग्रह सूर्य के अत्यन्त निकट होता है और उसका प्रकाश दब जाता है। ग्रह स्वतन्त्र रूप से अभिव्यक्त नहीं हो पाता — उसके कारकत्व सूर्य की अत्यधिक दीप्ति में विलीन हो जाते हैं।',
    },
  },
  {
    id: 'q18_4_07', type: 'mcq',
    question: {
      en: 'In the Lajjitadi system, Garvita (proud) applies when a planet is:',
      hi: 'लज्जितादि पद्धति में, गर्वित (गौरवान्वित) तब लागू होता है जब ग्रह:',
    },
    options: [
      { en: 'In its enemy\'s sign', hi: 'शत्रु की राशि में हो' },
      { en: 'In exaltation or moolatrikona', hi: 'उच्च या मूलत्रिकोण में हो' },
      { en: 'In a watery sign aspected by an enemy', hi: 'जलीय राशि में शत्रु की दृष्टि से हो' },
      { en: 'In the 5th house with Rahu', hi: '5वें भाव में राहु के साथ हो' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Garvita (proud) describes a planet in exaltation or moolatrikona — positions of high dignity. The planet is confident and delivers results with pride and authority. This is the most favorable Lajjitadi state, producing excellent outcomes for the houses it rules and occupies.',
      hi: 'गर्वित (गौरवान्वित) उच्च या मूलत्रिकोण में स्थित ग्रह का वर्णन करता है — उच्च गरिमा के स्थान। ग्रह आत्मविश्वासी होता है और गर्व तथा अधिकार के साथ परिणाम देता है। यह सबसे अनुकूल लज्जितादि अवस्था है।',
    },
  },
  {
    id: 'q18_4_08', type: 'mcq',
    question: {
      en: 'Lajjita (ashamed) occurs when a planet in the 5th house is conjoined with:',
      hi: 'लज्जित (लज्जा) तब होती है जब 5वें भाव का ग्रह किनके साथ युति में हो:',
    },
    options: [
      { en: 'Jupiter and Venus', hi: 'बृहस्पति और शुक्र' },
      { en: 'Moon and Mercury', hi: 'चन्द्रमा और बुध' },
      { en: 'Rahu/Ketu, Saturn, or Mars', hi: 'राहु/केतु, शनि, या मंगल' },
      { en: 'Sun only', hi: 'केवल सूर्य' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Lajjita (ashamed) occurs when a planet in the 5th house (creativity, children, intelligence) is conjoined with natural malefics — Rahu, Ketu, Saturn, or Mars. The planet feels "embarrassed" and cannot deliver its 5th-house significations properly, leading to struggles with progeny, education, or creative expression.',
      hi: 'लज्जित (लज्जा) तब होती है जब 5वें भाव (सृजनशीलता, सन्तान, बुद्धि) का ग्रह प्राकृतिक पापियों — राहु, केतु, शनि, या मंगल — के साथ युति में हो। ग्रह "लज्जित" अनुभव करता है और अपने 5वें भाव के कारकत्व ठीक से नहीं दे पाता।',
    },
  },
  {
    id: 'q18_4_09', type: 'true_false',
    question: {
      en: 'Trushita (thirsty) applies to a planet in a watery sign that is aspected by an enemy planet.',
      hi: 'तृषित (प्यासा) जलीय राशि में स्थित उस ग्रह पर लागू होता है जिस पर शत्रु ग्रह की दृष्टि हो।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Trushita (thirsty) describes a planet placed in a watery sign (Cancer, Scorpio, Pisces) that is also aspected by an enemy planet. The planet is "parched" — surrounded by emotional or intuitive energy (water) but unable to drink because of hostile influence. Results come with chronic dissatisfaction.',
      hi: 'सत्य। तृषित (प्यासा) जलीय राशि (कर्क, वृश्चिक, मीन) में स्थित उस ग्रह का वर्णन करता है जिस पर शत्रु ग्रह की दृष्टि भी हो। ग्रह "प्यासा" है — भावनात्मक या अन्तर्ज्ञानात्मक ऊर्जा (जल) से घिरा परन्तु शत्रुतापूर्ण प्रभाव के कारण पी नहीं पाता। परिणाम दीर्घकालिक असन्तोष के साथ आते हैं।',
    },
  },
  {
    id: 'q18_4_10', type: 'mcq',
    question: {
      en: 'How many distinct avastha systems are covered in classical Jyotish texts?',
      hi: 'शास्त्रीय ज्योतिष ग्रन्थों में कितनी भिन्न अवस्था पद्धतियाँ वर्णित हैं?',
    },
    options: [
      { en: 'One — only Deeptadi', hi: 'एक — केवल दीप्तादि' },
      { en: 'Two — Bala-Panchaka and Deeptadi', hi: 'दो — बाल-पञ्चक और दीप्तादि' },
      { en: 'Three — Bala-Panchaka, Deeptadi, and Lajjitadi', hi: 'तीन — बाल-पञ्चक, दीप्तादि, और लज्जितादि' },
      { en: 'Five — one for each element', hi: 'पाँच — प्रत्येक तत्व के लिए एक' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Three major avastha systems are described: Bala-Panchaka (5 age-based states by degree), Deeptadi (9 dignity-based states), and Lajjitadi (6 complex conditional states from BPHS). Each system evaluates the planet from a different angle, and all three together give a comprehensive picture of the planet\'s "mood."',
      hi: 'तीन प्रमुख अवस्था पद्धतियाँ वर्णित हैं: बाल-पञ्चक (अंश-आधारित 5 आयु अवस्थाएँ), दीप्तादि (गरिमा-आधारित 9 अवस्थाएँ), और लज्जितादि (BPHS की 6 जटिल सशर्त अवस्थाएँ)। प्रत्येक पद्धति ग्रह का भिन्न दृष्टिकोण से मूल्यांकन करती है।',
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
          Bala-Panchaka — The Five Age States
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Every planet occupies a specific degree within its sign (0-30&deg;), and this degree determines its &ldquo;age&rdquo; — a metaphor for how effectively it can deliver results. The Bala-Panchaka (&ldquo;five-fold age&rdquo;) system assigns one of five life stages to every planet based on where its degree falls within the sign.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius): <strong className="text-gold-light">Bala</strong> (infant) = 0-6&deg;, <strong className="text-gold-light">Kumara</strong> (youth) = 6-12&deg;, <strong className="text-gold-light">Yuva</strong> (prime) = 12-18&deg;, <strong className="text-gold-light">Vriddha</strong> (old) = 18-24&deg;, <strong className="text-gold-light">Mrita</strong> (dead) = 24-30&deg;. In even signs, the order reverses completely: Mrita at 0-6&deg; through Bala at 24-30&deg;.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-gold-light">Yuva is the strongest.</strong> A planet at 15&deg; of an odd sign is at its peak — like a person in the prime of life, fully capable of producing results. Bala (infant) shows potential that hasn&rsquo;t matured yet. Mrita (dead) indicates the planet&rsquo;s significations are effectively inert — present in the chart but unable to deliver. Kumara and Vriddha fall in between with moderate capacity.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Bala-Panchaka system appears in Brihat Parashara Hora Shastra (BPHS), chapter 45. Parashara uses the human lifecycle metaphor deliberately: just as a child cannot do an adult&rsquo;s work and an elderly person lacks youthful vigour, a planet&rsquo;s degree within its sign determines its functional capacity. The reversal in even signs reflects the Vedic principle of alternation (vishama-sama) that pervades Indian astronomical thinking.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Worked Example</h4>
        <ExampleChart
          ascendant={5}
          planets={{ 1: [4] }}
          title="Leo Lagna — Jupiter at 15° Leo (Yuva Avastha)"
          highlight={[1]}
        />
        <p className="text-text-secondary text-xs leading-relaxed">
          Jupiter at 15&deg; Leo (odd sign): degree falls in 12-18&deg; range = Yuva (prime). This Jupiter is at full strength by age-state. Now consider Jupiter at 15&deg; Virgo (even sign): in even signs the ranges reverse, so 12-18&deg; = Vriddha (old). Same degree, different sign type, completely different avastha. Always check whether the sign is odd or even first.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Many beginners confuse Bala-Panchaka with Shadbala or assume that a Mrita planet is &ldquo;dead&rdquo; in the sense of producing no results at all. In practice, Mrita means the planet&rsquo;s results are severely diminished and delayed — not that they vanish entirely. A well-dignified planet in Mrita avastha (e.g., exalted but at 28&deg; of an odd sign) still delivers, just with less vigour and more struggle than the same planet in Yuva.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Software-generated charts typically show planetary degrees but rarely flag the Bala-Panchaka state automatically. Knowing this system lets you instantly assess any planet&rsquo;s &ldquo;vitality&rdquo; from the degree alone — no special calculation needed. It is one of the fastest assessments an astrologer can make: glance at the degree, check odd/even sign, and you know the planet&rsquo;s age-state in seconds.
        </p>
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
          Deeptadi Avasthas — Nine States of Dignity
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Where Bala-Panchaka measures age (degree), Deeptadi measures &ldquo;dignity context&rdquo; — what kind of sign or condition the planet finds itself in. There are nine Deeptadi states, each named for the planet&rsquo;s emotional or functional condition:
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Deepta</strong> (brilliant) — exalted, maximum dignity. <strong className="text-gold-light">Swastha</strong> (content) — in own sign, comfortable and self-sufficient. <strong className="text-gold-light">Mudita</strong> (happy) — in a friend&rsquo;s sign, well-supported. <strong className="text-gold-light">Shanta</strong> (peaceful) — in a benefic varga/subdivision, quietly favourable. <strong className="text-gold-light">Shakta</strong> (powerful) — retrograde, intensified influence due to proximity to Earth.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-red-400">Dina</strong> (miserable) — in an enemy&rsquo;s sign, uncomfortable and weakened. <strong className="text-red-400">Vikala</strong> (disabled) — combust (too close to the Sun), unable to function independently. <strong className="text-red-400">Khala</strong> (wicked) — debilitated, producing distorted or harmful results. <strong className="text-red-400">Bhita</strong> (fearful) — in planetary war (graha yuddha), anxious and unstable.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Deeptadi system is described in BPHS and elaborated by Varahamihira in Brihat Jataka. The nine states form a hierarchy from Deepta (best) to Bhita (most troubled). Unlike Bala-Panchaka which is purely mathematical, Deeptadi requires knowing the planet&rsquo;s dignity (exalted, own sign, friend&rsquo;s sign, etc.) as well as special conditions like combustion, retrogression, and planetary war.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Worked Example</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [2] }}
          title="Aries Lagna — Mars at 28° Capricorn (10th) — Deepta + Bala"
          highlight={[10]}
        />
        <p className="text-text-secondary text-xs leading-relaxed">
          Mars at 28&deg; Capricorn: Mars is exalted in Capricorn, so its Deeptadi state is Deepta (brilliant). But check the Bala-Panchaka: Capricorn is an even sign, so 24-30&deg; = Bala (infant). This Mars is dignified but young — powerful in quality but immature in delivery. This is exactly why multiple avastha systems exist: they capture different dimensions of a planet&rsquo;s condition that a single system would miss.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Shakta (retrograde = powerful) surprises many students who expect retrogression to weaken a planet. In Western astrology, retrograde often carries negative connotations. In Vedic astrology, retrogression is a source of strength — the planet is physically closest to Earth and its energy is most concentrated. However, &ldquo;powerful&rdquo; does not mean &ldquo;benefic&rdquo;: a retrograde malefic is powerfully malefic.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Deeptadi framework gives practitioners a quick emotional vocabulary for planets. Instead of saying &ldquo;Venus is in its enemy sign,&rdquo; you say &ldquo;Venus is Dina (miserable)&rdquo; — which immediately conveys both the technical condition and the quality of results. This language is especially useful in client consultations where vivid metaphors communicate more effectively than technical jargon.
        </p>
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
          Lajjitadi Avasthas — Six Complex States from BPHS
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Lajjitadi system is the most nuanced of the three. These six states depend not just on sign placement but on house position, conjunctions, and aspects — making them context-dependent and chart-specific. They describe the &ldquo;quality&rdquo; of a planet&rsquo;s output with remarkable psychological precision.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Lajjita</strong> (ashamed) — planet in the 5th house conjoined with Rahu, Ketu, Saturn, or Mars. The creative/intellectual house is compromised by malefic company, producing shame or embarrassment in matters of children, romance, or education. <strong className="text-gold-light">Garvita</strong> (proud) — planet in exaltation or moolatrikona, delivering results with confidence and authority. <strong className="text-gold-light">Kshudhita</strong> (hungry) — planet in an enemy sign or aspected by an enemy, starved of resources and producing results marked by want.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-gold-light">Trushita</strong> (thirsty) — planet in a watery sign (Cancer, Scorpio, Pisces) aspected by an enemy, producing emotional craving and chronic dissatisfaction. <strong className="text-gold-light">Mudita</strong> (delighted) — planet in a friend&rsquo;s sign conjoined with Jupiter, producing joyful and expansive results. <strong className="text-gold-light">Kshobhita</strong> (agitated) — planet conjoined with the Sun and aspected by a malefic, producing restless, disturbed results with inner conflict.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara devotes significant attention to Lajjitadi avasthas in BPHS, treating them as predictive tools for the &ldquo;flavour&rdquo; of results. While Bala-Panchaka tells you how much a planet delivers and Deeptadi tells you the planet&rsquo;s inherent dignity, Lajjitadi tells you the emotional texture — whether results come with pride, shame, hunger, thirst, delight, or agitation. This three-layered approach is uniquely Parashari.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Worked Example</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 4: [5, 4] }}
          title="Aries Lagna — Venus + Jupiter in Cancer (4th) — Mudita"
          highlight={[4]}
        />
        <p className="text-text-secondary text-xs leading-relaxed">
          Venus in Cancer (a friend&rsquo;s sign for Venus) conjoined with Jupiter: this is Mudita (delighted). Venus is happy, well-supported, and Jupiter&rsquo;s benefic presence amplifies the joy. If this Venus rules the 7th house, relationships come with genuine happiness and mutual growth. Now consider Venus in Cancer conjoined with Saturn instead, aspected by Mars — the friend&rsquo;s sign advantage is overshadowed, and Venus becomes Kshudhita (hungry): relationships feel starved of warmth despite potential.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          A frequent error is applying Lajjitadi states mechanically without considering the full chart. A planet can technically satisfy the conditions for Lajjita (in 5th with Rahu) but if Rahu is very well-disposed (in a friendly sign, aspected by Jupiter), the &ldquo;shame&rdquo; effect is greatly reduced. Lajjitadi states describe tendencies, not absolutes — they must be weighed alongside other strength measures like Shadbala and Vimshopaka.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Lajjitadi avasthas are gaining renewed interest among modern Jyotish practitioners because they bridge the gap between technical chart analysis and psychological astrology. The six emotional states (ashamed, proud, hungry, thirsty, delighted, agitated) map remarkably well to how people actually experience planetary periods. During a Lajjita planet&rsquo;s dasha, the native often literally feels embarrassed about the areas that planet governs — a level of experiential prediction that purely mathematical systems cannot capture.
        </p>
      </section>
    </div>
  );
}

export default function Module18_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
