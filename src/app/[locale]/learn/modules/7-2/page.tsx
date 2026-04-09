'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_7_2', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.2',
  title: { en: 'Karana — The Half-Tithi', hi: 'करण — अर्ध-तिथि' },
  subtitle: {
    en: 'Each tithi splits into two karanas (6° of elongation each), yielding 60 karanas per lunar month from 7 movable and 4 fixed types',
    hi: 'प्रत्येक तिथि दो करणों (प्रत्येक 6° कोणीय दूरी) में विभक्त होती है, जिससे 7 चर और 4 स्थिर प्रकारों से प्रति चान्द्र मास 60 करण बनते हैं',
  },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: 'Module 7-1: Yoga', hi: 'मॉड्यूल 7-1: योग' }, href: '/learn/modules/7-1' },
    { label: { en: 'Module 7-3: Vara', hi: 'मॉड्यूल 7-3: वार' }, href: '/learn/modules/7-3' },
    { label: { en: 'Karanas Deep Dive', hi: 'करण विस्तार' }, href: '/learn/karanas' },
    { label: { en: 'Daily Karana', hi: 'दैनिक करण' }, href: '/panchang/karana' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q7_2_01', type: 'mcq',
    question: {
      en: 'A karana is defined as what fraction of a tithi?',
      hi: 'करण, तिथि का कितना भाग होता है?',
    },
    options: [
      { en: 'One-third of a tithi', hi: 'तिथि का एक-तिहाई' },
      { en: 'One-half of a tithi', hi: 'तिथि का आधा भाग' },
      { en: 'One-quarter of a tithi', hi: 'तिथि का एक-चौथाई' },
      { en: 'Two tithis combined', hi: 'दो तिथियों का संयोग' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A karana is exactly half of a tithi. Since each tithi spans 12° of Moon-Sun elongation, each karana spans 6°. Every tithi contains two karanas, giving 60 karanas in a 30-tithi lunar month.',
      hi: 'करण तिथि का ठीक आधा भाग है। चूँकि प्रत्येक तिथि चन्द्र-सूर्य कोणीय दूरी के 12° की होती है, प्रत्येक करण 6° का होता है। हर तिथि में दो करण होते हैं, जिससे 30-तिथि चान्द्र मास में 60 करण बनते हैं।',
    },
  },
  {
    id: 'q7_2_02', type: 'mcq',
    question: {
      en: 'How many Chara (movable) karanas are there?',
      hi: 'कितने चर (गतिशील) करण होते हैं?',
    },
    options: [
      { en: '4', hi: '4' },
      { en: '7', hi: '7' },
      { en: '11', hi: '11' },
      { en: '27', hi: '27' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'There are 7 Chara karanas that cycle repeatedly: Bava, Balava, Kaulava, Taitila, Gara, Vanija, and Vishti (Bhadra). They occupy slots 2 through 57 of the 60-karana month.',
      hi: '7 चर करण हैं जो बारम्बार चक्रित होते हैं: बव, बालव, कौलव, तैतिल, गर, वणिज और विष्टि (भद्र)। ये 60-करण मास के स्थान 2 से 57 तक व्याप्त हैं।',
    },
  },
  {
    id: 'q7_2_03', type: 'true_false',
    question: {
      en: 'The 4 Sthira (fixed) karanas — Shakuni, Chatushpada, Nagava, Kimstughna — appear only once each in a lunar month.',
      hi: '4 स्थिर करण — शकुनि, चतुष्पद, नागव, किंस्तुघ्न — चान्द्र मास में प्रत्येक केवल एक बार आता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The 4 fixed karanas each appear exactly once per lunar month. Kimstughna occupies the first half of Shukla Pratipada (slot 1), and Shakuni, Chatushpada, Nagava occupy the last three slots (58, 59, 60) at the end of Krishna Paksha.',
      hi: 'सत्य। 4 स्थिर करण प्रत्येक चान्द्र मास में ठीक एक बार आते हैं। किंस्तुघ्न शुक्ल प्रतिपदा के प्रथम अर्ध (स्थान 1) में, और शकुनि, चतुष्पद, नागव अन्तिम तीन स्थानों (58, 59, 60) में कृष्ण पक्ष के अन्त में आते हैं।',
    },
  },
  {
    id: 'q7_2_04', type: 'mcq',
    question: {
      en: 'Vishti (Bhadra) karana is significant because it is:',
      hi: 'विष्टि (भद्र) करण महत्वपूर्ण है क्योंकि यह है:',
    },
    options: [
      { en: 'The most auspicious karana for marriage', hi: 'विवाह हेतु सर्वाधिक शुभ करण' },
      { en: 'The most inauspicious Chara karana, occurring 8 times per month', hi: 'सर्वाधिक अशुभ चर करण, मास में 8 बार आता है' },
      { en: 'A fixed karana appearing once per month', hi: 'एक स्थिर करण जो मास में एक बार आता है' },
      { en: 'Identical to Vyatipata yoga', hi: 'व्यतीपात योग के समान' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Vishti (also called Bhadra) is the 7th Chara karana and is considered the most inauspicious. It appears 8 times in each lunar month (once in each cycle of 7, across the 56 Chara slots, though the exact count depends on placement). Auspicious activities are strongly avoided during Bhadra.',
      hi: 'विष्टि (भद्र) सातवाँ चर करण है और सर्वाधिक अशुभ माना जाता है। यह प्रत्येक चान्द्र मास में 8 बार आता है। भद्र काल में शुभ कार्य दृढ़ता से वर्जित माने जाते हैं।',
    },
  },
  {
    id: 'q7_2_05', type: 'true_false',
    question: {
      en: 'When Bhadra (Vishti) is said to be "in heaven" (Bhadra mukha), its inauspicious effects are considered reduced.',
      hi: 'जब भद्र (विष्टि) "स्वर्ग में" (भद्र मुख) कहा जाता है, तो इसके अशुभ प्रभाव कम माने जाते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Classical texts distinguish Bhadra mukha (face, in heaven) from Bhadra puchha (tail, on earth). When Bhadra is in heaven or the nether world, its malefic effects are diminished. When it is on earth (puchha), the inauspicious effects are at full strength.',
      hi: 'सत्य। शास्त्रों में भद्र मुख (स्वर्ग में) और भद्र पुच्छ (पृथ्वी पर) में भेद किया गया है। जब भद्र स्वर्ग या पाताल में होती है, तो अशुभ प्रभाव क्षीण होते हैं। पृथ्वी पर (पुच्छ) होने पर अशुभ प्रभाव पूर्ण बल से रहते हैं।',
    },
  },
  {
    id: 'q7_2_06', type: 'mcq',
    question: {
      en: 'If the Moon-Sun elongation is 179°, what is the karana index?',
      hi: 'यदि चन्द्र-सूर्य कोणीय दूरी 179° है, तो करण सूचकांक क्या होगा?',
    },
    options: [
      { en: '28', hi: '28' },
      { en: '29', hi: '29' },
      { en: '30', hi: '30' },
      { en: '14', hi: '14' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Karana index = floor(179 / 6) = floor(29.833) = 29. To find the karana name: index 0 = Kimstughna (fixed), indices 1-56 cycle through the 7 Chara karanas. For index 29: (29-1) mod 7 = 0, which maps to Bava (the 1st Chara karana).',
      hi: 'करण सूचकांक = floor(179 / 6) = floor(29.833) = 29। करण का नाम: सूचकांक 0 = किंस्तुघ्न (स्थिर), सूचकांक 1-56 में 7 चर करण चक्रित होते हैं। सूचकांक 29 के लिए: (29-1) mod 7 = 0, जो बव (प्रथम चर करण) है।',
    },
  },
  {
    id: 'q7_2_07', type: 'mcq',
    question: {
      en: 'How many total karanas exist in one complete lunar month?',
      hi: 'एक पूर्ण चान्द्र मास में कुल कितने करण होते हैं?',
    },
    options: [
      { en: '30', hi: '30' },
      { en: '54', hi: '54' },
      { en: '60', hi: '60' },
      { en: '27', hi: '27' },
    ],
    correctAnswer: 2,
    explanation: {
      en: '30 tithis × 2 karanas per tithi = 60 karanas in a lunar month. Of these, 4 are Sthira (fixed) karanas and 56 are filled by cycling through the 7 Chara karanas eight times.',
      hi: '30 तिथियाँ × 2 करण प्रति तिथि = 60 करण प्रति चान्द्र मास। इनमें 4 स्थिर करण और 56 स्थान 7 चर करणों के आठ चक्रों से भरे जाते हैं।',
    },
  },
  {
    id: 'q7_2_08', type: 'true_false',
    question: {
      en: 'Karana is the fifth and least important limb of the Panchang, often ignored in muhurta selection.',
      hi: 'करण पंचांग का पाँचवाँ और सबसे कम महत्वपूर्ण अंग है, मुहूर्त चयन में प्रायः उपेक्षित।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. While Karana is sometimes considered the least weighted of the five Panchang elements, it is NOT ignored. Vishti (Bhadra) karana in particular is a strong prohibitive factor that can veto otherwise auspicious windows. Muhurta texts explicitly warn against beginning important works during Bhadra.',
      hi: 'असत्य। यद्यपि करण को पंचांग के पाँच अंगों में कभी-कभी सबसे कम भारित माना जाता है, इसे अनदेखा नहीं किया जाता। विशेषकर विष्टि (भद्र) करण एक प्रबल निषेधात्मक कारक है जो अन्यथा शुभ खिड़कियों को भी निरस्त कर सकता है।',
    },
  },
  {
    id: 'q7_2_09', type: 'mcq',
    question: {
      en: 'Each karana spans how many degrees of Moon-Sun elongation?',
      hi: 'प्रत्येक करण चन्द्र-सूर्य कोणीय दूरी के कितने अंशों का होता है?',
    },
    options: [
      { en: '12°', hi: '12°' },
      { en: '6°', hi: '6°' },
      { en: '13°20\u2032', hi: '13°20\u2032' },
      { en: '3°', hi: '3°' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each karana spans 6° of Moon-Sun elongation. Since a tithi spans 12° and each tithi has two karanas, each karana is 12° / 2 = 6°.',
      hi: 'प्रत्येक करण चन्द्र-सूर्य कोणीय दूरी के 6° का होता है। चूँकि तिथि 12° की होती है और प्रत्येक तिथि में दो करण हैं, प्रत्येक करण 12° / 2 = 6° का होता है।',
    },
  },
  {
    id: 'q7_2_10', type: 'true_false',
    question: {
      en: 'Bava karana is considered auspicious and is suitable for initiating new business ventures.',
      hi: 'बव करण शुभ माना जाता है और नये व्यापारिक उद्यम आरम्भ करने हेतु उपयुक्त है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Bava is associated with strength and achievement. Among the 7 Chara karanas, Bava, Balava, Kaulava, and Taitila are generally considered auspicious, while Vishti (Bhadra) is inauspicious. Gara suits agriculture, and Vanija suits commerce.',
      hi: 'सत्य। बव बल और उपलब्धि से सम्बन्धित है। 7 चर करणों में बव, बालव, कौलव और तैतिल सामान्यतः शुभ माने जाते हैं, जबकि विष्टि (भद्र) अशुभ है। गर कृषि के लिए और वणिज वाणिज्य के लिए उपयुक्त है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Karana — The Half-Tithi</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">A karana is the smallest temporal unit in the Panchang system. It represents half of a tithi — 6° of Moon-Sun elongation. Since a lunar month contains 30 tithis and each tithi has two karanas, there are 60 karanas per month. Despite being the finest subdivision, the karana carries distinct astrological significance, especially when it comes to avoiding inauspicious windows.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">There are 11 named karanas in total, divided into two categories. The 7 Chara (movable) karanas cycle repeatedly through the month: Bava, Balava, Kaulava, Taitila, Gara, Vanija, and Vishti (also called Bhadra). These 7 names cycle through 8 complete rounds to fill 56 of the 60 slots. The remaining 4 are Sthira (fixed) karanas that appear only once each: Kimstughna (slot 1, first half of Shukla Pratipada), and Shakuni, Chatushpada, Nagava (slots 58, 59, 60, at the end of Krishna Amavasya).</p>
        <p className="text-text-secondary text-sm leading-relaxed">Among the Chara karanas, each has a distinct character: Bava brings strength, Balava brings auspiciousness, Kaulava friendship, Taitila worldly success, Gara agricultural prosperity, and Vanija commercial gain. Vishti (Bhadra), however, is the notorious exception — it is considered deeply inauspicious for all new beginnings.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">Karanas are described in the Surya Siddhanta and elaborated in Muhurta Chintamani and BPHS. The Vishti (Bhadra) karana receives special attention in Dharmashastra texts — the Dharmasindhu devotes an entire section to determining whether Bhadra is in its &quot;mukha&quot; (face, heavenly position) or &quot;puchha&quot; (tail, earthly position), as this distinction modulates the intensity of its malefic effects. The four-fold Sthira karana system reflects the ancient recognition that certain lunar phases at the month&apos;s edges carry unique energy.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vishti (Bhadra) — The Critical Karana</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Vishti, popularly known as Bhadra, is the seventh Chara karana and the most feared element in the karana system. It appears approximately 8 times each lunar month (once in every cycle of 7 Chara karanas across the 56 Chara slots). During Bhadra, classical texts strongly advise against starting journeys, marriages, new businesses, griha-pravesha (housewarming), and religious ceremonies.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">However, Bhadra is not uniformly malefic. The tradition distinguishes between Bhadra Mukha (face) and Bhadra Puchha (tail). When Bhadra is in Swarga (heaven) or Patala (nether world), the inauspicious effects are diminished or even neutralized. When Bhadra is on Prithvi (earth), the malefic effects are at full strength. The position depends on the specific tithi during which Vishti occurs — texts provide tables mapping each Vishti occurrence to its celestial, terrestrial, or nether position.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Certain activities are actually suited to Bhadra: antagonistic actions such as filing legal battles, breaking alliances, demolition work, or removing obstacles are considered empowered during Vishti. This reflects the Jyotish principle that no time is universally bad — the character of the time should match the character of the action.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1:</span> Moon-Sun elongation = 179°. Karana index = floor(179 / 6) = 29. Mapping: index 0 = Kimstughna (fixed). Indices 1-56 cycle through the 7 Chara karanas. For index 29: (29 - 1) mod 7 = 0, mapping to Bava (the 1st Chara karana). Bava is auspicious — suitable for new ventures.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 2:</span> Elongation = 42°. Index = floor(42 / 6) = 7. (7 - 1) mod 7 = 6, mapping to Vishti (Bhadra, the 7th Chara karana). Check the tithi: 42° / 12° = Tithi 4 (Chaturthi). During Shukla Chaturthi, Bhadra is said to be in Patala — effects diminished. Nonetheless, caution is advised.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 3:</span> Elongation = 354°. Index = floor(354 / 6) = 59. Index 59 is slot 60 (0-based 59) = Nagava (fixed karana). Nagava appears only once per month, near the end of Krishna Amavasya. It is considered neutral to mildly inauspicious.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Calculation Details and Modern Practice</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The karana calculation derives directly from the Moon-Sun elongation used for tithis. Compute the sidereal elongation (Moon longitude minus Sun longitude, normalized to 0-360°), then divide by 6° to get the karana index (0-59). The mapping to karana names follows this pattern: index 0 = Kimstughna (fixed), indices 1-56 cycle through {'{'}Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti{'}'} using (index - 1) mod 7, and indices 57-59 map to Shakuni, Chatushpada, Nagava (fixed).</p>
        <p className="text-text-secondary text-sm leading-relaxed">In our app, the karana is computed alongside the tithi from the same elongation value. Start and end times are found by determining when the elongation crosses each 6° boundary. Because the Moon&apos;s speed varies (roughly 12-15° per day), karana durations range from about 9 to 13 hours — roughly half a day, but never exactly half.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Karana is too small to matter — only Tithi and Nakshatra count.&quot; While Karana is the finest Panchang subdivision, Vishti (Bhadra) is one of the strongest prohibitive factors in muhurta selection. Ignoring it can undermine an otherwise well-chosen window.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;All Bhadra periods are equally bad.&quot; The Bhadra mukha/puchha distinction is critical. Classical texts are clear that Bhadra in heaven or Patala is far less harmful than Bhadra on earth.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;There are only 7 karanas.&quot; There are 11 named karanas in total — 7 Chara and 4 Sthira. The Sthira karanas are easily overlooked because they appear only once each per month at the edges of the cycle.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Every printed Panchang in India lists the karana alongside the other four elements. In digital muhurta engines — including our Muhurta AI — Vishti karana triggers an automatic penalty in the scoring algorithm. Wedding planners, business consultants using Jyotish, and temple priests routinely check for Bhadra before finalizing ceremony times. The karana provides the last layer of temporal refinement in the five-limb system.</p>
      </section>
    </div>
  );
}

export default function Module7_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
