'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_10_1', phase: 3, topic: 'Vargas', moduleNumber: '10.1',
  title: { en: 'Varga Charts — Divisional Analysis', hi: 'वर्ग कुण्डली — विभागीय विश्लेषण' },
  subtitle: {
    en: 'The rashi chart is the trunk of the tree — varga charts are its branches, each revealing a specific life domain',
    hi: 'राशि कुण्डली वृक्ष का तना है — वर्ग कुण्डलियाँ उसकी शाखाएँ हैं, प्रत्येक एक विशिष्ट जीवन क्षेत्र को प्रकट करती है',
  },
  estimatedMinutes: 16,
  crossRefs: [
    { label: { en: 'Module 10-2: Navamsha Deep Dive', hi: 'मॉड्यूल 10-2: नवांश विस्तार' }, href: '/learn/modules/10-2' },
    { label: { en: 'Module 10-3: Dasamsha & Other Vargas', hi: 'मॉड्यूल 10-3: दशांश एवं अन्य वर्ग' }, href: '/learn/modules/10-3' },
    { label: { en: 'Vargas Reference', hi: 'वर्ग सन्दर्भ' }, href: '/learn/vargas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q10_1_01', type: 'mcq',
    question: {
      en: 'Which divisional chart is specifically used to analyze marriage, dharma, and the inner nature of planets?',
      hi: 'कौन सी विभागीय कुण्डली विशेष रूप से विवाह, धर्म और ग्रहों के आन्तरिक स्वभाव के विश्लेषण में प्रयुक्त होती है?',
    },
    options: [
      { en: 'D10 — Dasamsha', hi: 'D10 — दशांश' },
      { en: 'D9 — Navamsha', hi: 'D9 — नवांश' },
      { en: 'D7 — Saptamsha', hi: 'D7 — सप्तांश' },
      { en: 'D12 — Dwadashamsha', hi: 'D12 — द्वादशांश' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Navamsha (D9) is the single most important divisional chart. It reveals the inner strength of planets, governs marriage/partnerships, and shows dharmic orientation. It is sometimes called "the chart behind the chart."',
      hi: 'नवांश (D9) सबसे महत्त्वपूर्ण विभागीय कुण्डली है। यह ग्रहों की आन्तरिक शक्ति, विवाह/साझेदारी और धार्मिक प्रवृत्ति को प्रकट करती है। इसे कभी-कभी "कुण्डली के पीछे की कुण्डली" कहा जाता है।',
    },
  },
  {
    id: 'q10_1_02', type: 'mcq',
    question: {
      en: 'How many divisional charts comprise the Shodasvarga system?',
      hi: 'षोडशवर्ग पद्धति में कितनी विभागीय कुण्डलियाँ होती हैं?',
    },
    options: [
      { en: '7', hi: '7' },
      { en: '12', hi: '12' },
      { en: '16', hi: '16' },
      { en: '20', hi: '20' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Shodasvarga system comprises 16 divisional charts: D1 (Rashi), D2 (Hora), D3 (Drekkana), D4 (Chaturthamsha), D7 (Saptamsha), D9 (Navamsha), D10 (Dasamsha), D12 (Dwadashamsha), D16 (Shodashamsha), D20 (Vimshamsha), D24 (Chaturvimshamsha), D27 (Saptavimshamsha), D30 (Trimshamsha), D40 (Khavedamsha), D45 (Akshavedamsha), and D60 (Shashtiamsha).',
      hi: 'षोडशवर्ग पद्धति में 16 विभागीय कुण्डलियाँ हैं: D1 (राशि), D2 (होरा), D3 (द्रेक्काण), D4 (चतुर्थांश), D7 (सप्तांश), D9 (नवांश), D10 (दशांश), D12 (द्वादशांश), D16 (षोडशांश), D20 (विंशांश), D24 (चतुर्विंशांश), D27 (सप्तविंशांश), D30 (त्रिंशांश), D40 (खवेदांश), D45 (अक्षवेदांश) और D60 (षष्ट्यंश)।',
    },
  },
  {
    id: 'q10_1_03', type: 'true_false',
    question: {
      en: 'A planet that is strong in D1 (rashi chart) will always give good results regardless of its placement in divisional charts.',
      hi: 'जो ग्रह D1 (राशि कुण्डली) में बलवान हो, वह विभागीय कुण्डलियों में अपने स्थान से निरपेक्ष सदैव शुभ फल देगा।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. A planet strong in D1 but weak in the relevant varga will give mixed results. For example, Venus exalted in D1 but debilitated in D9 suggests that romantic relationships appear promising externally but face deep inner challenges. Both charts must be read together.',
      hi: 'असत्य। D1 में बलवान परन्तु सम्बन्धित वर्ग में दुर्बल ग्रह मिश्रित फल देता है। उदाहरणार्थ, D1 में उच्च का शुक्र परन्तु D9 में नीच — बाहर से सम्बन्ध आशाजनक दिखें पर भीतर से गहरी चुनौतियाँ हों। दोनों कुण्डलियाँ साथ पढ़नी चाहिए।',
    },
  },
  {
    id: 'q10_1_04', type: 'mcq',
    question: {
      en: 'The D10 (Dasamsha) chart is primarily used to analyze which life area?',
      hi: 'D10 (दशांश) कुण्डली मुख्य रूप से किस जीवन क्षेत्र के विश्लेषण में प्रयुक्त होती है?',
    },
    options: [
      { en: 'Children and progeny', hi: 'सन्तान और वंश' },
      { en: 'Parents and ancestry', hi: 'माता-पिता और पूर्वज' },
      { en: 'Career, profession, and public standing', hi: 'व्यवसाय, पेशा और सामाजिक प्रतिष्ठा' },
      { en: 'Spiritual progress and moksha', hi: 'आध्यात्मिक प्रगति और मोक्ष' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Dasamsha (D10) is the career chart. It reveals the nature of one\'s profession, career trajectory, achievements in the public sphere, and professional reputation. The 10th house of D10 is especially critical.',
      hi: 'दशांश (D10) व्यवसाय कुण्डली है। यह व्यक्ति के पेशे की प्रकृति, व्यावसायिक दिशा, सार्वजनिक क्षेत्र में उपलब्धियाँ और व्यावसायिक प्रतिष्ठा को प्रकट करती है। D10 का दसवाँ भाव विशेष रूप से महत्त्वपूर्ण है।',
    },
  },
  {
    id: 'q10_1_05', type: 'mcq',
    question: {
      en: 'What does "Vargottama" mean in Jyotish?',
      hi: 'ज्योतिष में "वर्गोत्तम" का क्या अर्थ है?',
    },
    options: [
      { en: 'A planet in its exaltation sign', hi: 'उच्च राशि में स्थित ग्रह' },
      { en: 'A planet occupying the same sign in both D1 and D9', hi: 'D1 और D9 दोनों में एक ही राशि में स्थित ग्रह' },
      { en: 'A planet in retrograde motion', hi: 'वक्री गति में ग्रह' },
      { en: 'A planet conjunct its dispositor', hi: 'अपने राशि स्वामी के साथ युत ग्रह' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Vargottama means a planet is placed in the same sign in both the Rashi (D1) and Navamsha (D9) charts. This is considered very powerful — the planet\'s outer expression and inner nature are aligned, giving it the strength equivalent to being in its own sign.',
      hi: 'वर्गोत्तम का अर्थ है कि ग्रह राशि (D1) और नवांश (D9) दोनों कुण्डलियों में एक ही राशि में स्थित है। यह अत्यन्त बलवान माना जाता है — ग्रह की बाह्य अभिव्यक्ति और आन्तरिक प्रकृति एकरूप होती है, जो स्वराशि बल के समतुल्य शक्ति देती है।',
    },
  },
  {
    id: 'q10_1_06', type: 'true_false',
    question: {
      en: 'The D7 (Saptamsha) chart is used to analyze career and professional life.',
      hi: 'D7 (सप्तांश) कुण्डली का उपयोग व्यवसाय और पेशेवर जीवन के विश्लेषण में होता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The D7 (Saptamsha) chart is used for children and progeny. Career analysis uses D10 (Dasamsha). Each varga has a specific life domain — mixing them up leads to incorrect predictions.',
      hi: 'असत्य। D7 (सप्तांश) कुण्डली सन्तान एवं वंश के लिए प्रयुक्त होती है। व्यवसाय विश्लेषण D10 (दशांश) से किया जाता है। प्रत्येक वर्ग का एक विशिष्ट जीवन क्षेत्र है — उनमें भ्रम करने से गलत भविष्यवाणी होती है।',
    },
  },
  {
    id: 'q10_1_07', type: 'mcq',
    question: {
      en: 'In the Shodasvarga Vimshopaka strength system, which varga receives the highest weightage?',
      hi: 'षोडशवर्ग विंशोपक बल पद्धति में किस वर्ग को सर्वाधिक भारांक मिलता है?',
    },
    options: [
      { en: 'D9 (Navamsha) — 3 points', hi: 'D9 (नवांश) — 3 अंक' },
      { en: 'D1 (Rashi) — 3.5 points', hi: 'D1 (राशि) — 3.5 अंक' },
      { en: 'D60 (Shashtiamsha) — 4 points', hi: 'D60 (षष्ट्यंश) — 4 अंक' },
      { en: 'D10 (Dasamsha) — 3 points', hi: 'D10 (दशांश) — 3 अंक' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'In the Shodasvarga scheme, D60 (Shashtiamsha) receives the highest weightage of 4 points out of 20. This subtle chart (divisions of 0.5 degrees) is considered the most refined indicator of karmic merit. D1 and D9 each receive 3.5 and 3 points respectively.',
      hi: 'षोडशवर्ग योजना में D60 (षष्ट्यंश) को 20 में से सर्वाधिक 4 अंक का भारांक मिलता है। यह सूक्ष्म कुण्डली (0.5 अंश के विभाग) कार्मिक पुण्य का सबसे परिष्कृत सूचक मानी जाती है। D1 और D9 को क्रमशः 3.5 और 3 अंक मिलते हैं।',
    },
  },
  {
    id: 'q10_1_08', type: 'mcq',
    question: {
      en: 'The D12 (Dwadashamsha) chart is primarily used to analyze:',
      hi: 'D12 (द्वादशांश) कुण्डली मुख्यतः किसके विश्लेषण में प्रयुक्त होती है?',
    },
    options: [
      { en: 'Vehicles and conveyances', hi: 'वाहन और यातायात साधन' },
      { en: 'Parents, ancestry, and inherited karma', hi: 'माता-पिता, पूर्वज और विरासत में मिला कर्म' },
      { en: 'Spouse and partnerships', hi: 'पति/पत्नी और साझेदारी' },
      { en: 'Education and learning', hi: 'शिक्षा और विद्या' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Dwadashamsha (D12) is the chart of parents and lineage. The 4th house of D12 represents the mother, the 9th house represents the father. It is used to understand parental relationships and inherited karmic patterns.',
      hi: 'द्वादशांश (D12) माता-पिता और वंश की कुण्डली है। D12 का चतुर्थ भाव माता का और नवम भाव पिता का प्रतिनिधित्व करता है। इसका उपयोग माता-पिता से सम्बन्ध और विरासत में मिले कार्मिक प्रतिरूपों को समझने में होता है।',
    },
  },
  {
    id: 'q10_1_09', type: 'true_false',
    question: {
      en: 'The Navamsha is sometimes called "the chart behind the chart" because it reveals the hidden, inner dimensions of planetary placements.',
      hi: 'नवांश को कभी-कभी "कुण्डली के पीछे की कुण्डली" कहा जाता है क्योंकि यह ग्रह स्थितियों के छिपे आन्तरिक आयामों को प्रकट करती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The rashi chart (D1) shows the outer, manifest reality — what people see. The Navamsha (D9) shows the inner truth — the real strength, the deeper motivations, and the soul-level patterns. A planet might look strong in D1 but be compromised in D9, and vice versa.',
      hi: 'सत्य। राशि कुण्डली (D1) बाह्य, प्रकट वास्तविकता दिखाती है — जो लोग देखते हैं। नवांश (D9) आन्तरिक सत्य दिखाती है — वास्तविक बल, गहरी प्रेरणाएँ और आत्मा-स्तरीय प्रतिरूप। कोई ग्रह D1 में बलवान दिख सकता है पर D9 में दुर्बल हो, और इसके विपरीत भी।',
    },
  },
  {
    id: 'q10_1_10', type: 'mcq',
    question: {
      en: 'What is Vimshopaka Bala?',
      hi: 'विंशोपक बल क्या है?',
    },
    options: [
      { en: 'The strength of a planet based on its speed of motion', hi: 'गति के आधार पर ग्रह का बल' },
      { en: 'A composite strength score derived from a planet\'s dignity across multiple varga charts', hi: 'अनेक वर्ग कुण्डलियों में ग्रह की गरिमा से प्राप्त समग्र बल अंक' },
      { en: 'The strength of a planet based on its distance from the Sun', hi: 'सूर्य से दूरी के आधार पर ग्रह का बल' },
      { en: 'The number of benefic aspects a planet receives', hi: 'ग्रह पर पड़ने वाली शुभ दृष्टियों की संख्या' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Vimshopaka Bala is a 20-point composite strength score. It evaluates a planet\'s sign placement (own, exalted, friendly, enemy, debilitated) across all 16 vargas of the Shodasvarga system, applying specific weightage to each chart. A score above 15 is excellent; below 5 is very weak.',
      hi: 'विंशोपक बल 20 अंकों का समग्र बल मापदण्ड है। यह षोडशवर्ग पद्धति की सभी 16 वर्ग कुण्डलियों में ग्रह की राशि स्थिति (स्वगृह, उच्च, मित्र, शत्रु, नीच) का मूल्यांकन करता है, प्रत्येक कुण्डली को विशिष्ट भारांक देकर। 15 से अधिक अंक उत्कृष्ट और 5 से कम अत्यन्त दुर्बल माना जाता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          What Are Divisional Charts?
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The rashi chart (D1) is the complete sky map at birth — it shows where every planet sits in the zodiac. But trying to read every life question from one chart is like trying to diagnose every illness with a single blood test. Vedic Jyotish solves this by creating <span className="text-gold-light font-medium">varga charts</span> (divisional charts), each a mathematically derived sub-chart that zooms into a specific life domain.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Think of the rashi chart as the trunk of a great tree. The vargas are its branches — each one growing from the same trunk but reaching into different territory. The <span className="text-gold-light font-medium">Navamsha (D9)</span> branch reveals marriage and dharma. The <span className="text-gold-light font-medium">Dasamsha (D10)</span> branch shows career. The <span className="text-gold-light font-medium">Saptamsha (D7)</span> branch governs children. The <span className="text-gold-light font-medium">Dwadashamsha (D12)</span> branch illuminates parents and lineage.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Each varga is created by dividing every 30-degree sign into equal parts and mapping those parts to new signs following specific rules laid down by Parashara. A planet at 15 degrees Aries occupies one sign in D1, potentially a different sign in D9, yet another in D10 — each placement revealing a different facet of the same planet's influence.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">The Core Divisional Charts</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { code: 'D1', name: 'Rashi', nameHi: 'राशि', domain: 'Overall life, physical body', domainHi: 'सम्पूर्ण जीवन, शारीरिक देह' },
            { code: 'D2', name: 'Hora', nameHi: 'होरा', domain: 'Wealth and financial resources', domainHi: 'धन और वित्तीय संसाधन' },
            { code: 'D3', name: 'Drekkana', nameHi: 'द्रेक्काण', domain: 'Siblings and courage', domainHi: 'भाई-बहन और साहस' },
            { code: 'D7', name: 'Saptamsha', nameHi: 'सप्तांश', domain: 'Children and progeny', domainHi: 'सन्तान और वंश' },
            { code: 'D9', name: 'Navamsha', nameHi: 'नवांश', domain: 'Marriage, dharma, inner self', domainHi: 'विवाह, धर्म, आन्तरिक स्वरूप' },
            { code: 'D10', name: 'Dasamsha', nameHi: 'दशांश', domain: 'Career and profession', domainHi: 'व्यवसाय और पेशा' },
            { code: 'D12', name: 'Dwadashamsha', nameHi: 'द्वादशांश', domain: 'Parents and ancestry', domainHi: 'माता-पिता और पूर्वज' },
            { code: 'D60', name: 'Shashtiamsha', nameHi: 'षष्ट्यंश', domain: 'Past-life karma (subtle)', domainHi: 'पूर्वजन्म कर्म (सूक्ष्म)' },
          ].map(v => (
            <div key={v.code} className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
              <span className="text-gold-light font-mono font-bold text-xs">{v.code}</span>
              <span className="text-text-secondary text-xs ml-2">{isHi ? v.nameHi : v.name}</span>
              <p className="text-text-secondary/70 text-xs mt-1">{isHi ? v.domainHi : v.domain}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          The Shodasvarga — 16 Charts and Their Weights
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Parashara prescribes the <span className="text-gold-light font-medium">Shodasvarga</span> system — a set of 16 divisional charts that together give a comprehensive portrait of any horoscope. Each chart divides signs into progressively finer portions: D1 uses the full 30 degrees, D9 uses 3°20' divisions, and D60 uses razor-thin 0.5° slices. The finer the division, the more precise the birth time must be — even a few minutes' error can shift a D60 placement entirely.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The <span className="text-gold-light font-medium">Vimshopaka Bala</span> (20-point strength) system assigns specific weights to each varga. In the Shodasvarga scheme: D1 gets 3.5 points, D2 gets 1, D3 gets 1, D4 gets 0.5, D7 gets 0.5, D9 gets 3, D10 gets 0.5, D12 gets 0.5, D16 gets 2, D20 gets 0.5, D24 gets 0.5, D27 gets 0.5, D30 gets 1, D40 gets 0.5, D45 gets 0.5, and D60 gets 4 — totaling 20 points. Notice that D60 has the highest weight, reflecting its karmic significance.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          A planet is evaluated in each varga for its dignity — is it in its own sign, exalted, in a friendly sign, neutral, enemy, or debilitated? Each status yields a fraction of that varga's maximum points. A planet scoring 15+ out of 20 in Vimshopaka is exceptionally strong; below 5 is severely compromised regardless of its D1 placement.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Practical Example: Strong in D1, Weak in D9</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> Jupiter is exalted in Cancer in D1 (rashi chart) — this looks magnificent. The native appears wise, generous, and spiritually inclined. But in D9, Jupiter falls in Capricorn (its debilitation sign).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Result:</span> The outer display of wisdom is impressive, but the inner dharmic conviction is weak. The person may preach values they don't truly follow. In marriage (D9's primary domain), Jupiter's debilitation suggests challenges with faith, trust, and the quality of guidance from the spouse or guru.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Key Lesson:</span> Never judge a planet by D1 alone. The rashi chart shows the surface — the Navamsha reveals what lies beneath.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">The Navamsha — "The Chart Behind the Chart"</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Among all 16 vargas, the Navamsha (D9) holds a special status. No serious Jyotish reading is complete without it. While D1 shows your outer circumstances — the life you live in the world — D9 reveals your inner reality: your true strength, your dharmic path, and the quality of your closest partnerships.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Classical texts state that the D9 is so important that if D1 and D9 give contradictory results, the D9 should be given more weight for matters of marriage and dharma. Many astrologers read D1 and D9 side by side as a standard practice, only consulting other vargas for specific questions (D10 for career, D7 for children, etc.).
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Reading the Navamsha — Vargottama and Pushkara
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          A planet's <span className="text-gold-light font-medium">Navamsha sign</span> reveals its inner nature, while the rashi sign shows the outer expression. Mars in Aries (D1) appears bold and assertive outwardly; if Mars is in Cancer in D9, the inner nature is actually emotional, protective, and home-oriented. The outer warrior, the inner nurturer — this is the depth vargas provide.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Vargottama</span> — when a planet occupies the same sign in both D1 and D9 — is considered exceptionally powerful. The outer expression and inner nature are perfectly aligned: what you see is what you get. Vargottama planets act with the strength of being in their own sign. A Vargottama Lagna (ascendant) is especially auspicious, giving the native a strong, coherent personality.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Pushkara Navamsha</span> refers to specific Navamsha positions that are inherently nourishing and auspicious. These occur at particular degrees within each sign and always fall in signs ruled by benefics (Jupiter, Venus, Moon, Mercury). A planet in Pushkara Navamsha receives a boost of natural beneficence — like a tree planted in fertile soil.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">When Does Vargottama Occur?</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Vargottama occurs in the first 3°20' of cardinal signs (Aries, Cancer, Libra, Capricorn), the middle 3°20' of fixed signs (Taurus, Leo, Scorpio, Aquarius), and the last 3°20' of dual signs (Gemini, Virgo, Sagittarius, Pisces). Any planet or the Lagna falling in these specific degree ranges will be in the same sign in both D1 and D9.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Marriage Timing with D9:</span> The Dasha of the Navamsha Lagna lord, the 7th lord of D9, or planets in the 7th house of D9 frequently trigger marriage. When the same planet is activated in both D1 dasha and D9 signification, the event becomes highly likely. This is why D9 is indispensable for relationship predictions.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara in BPHS (Chapter 6-7) provides the complete rules for all 16 vargas. He states: "The wise should examine the Shodasvarga positions of all planets to determine their true strength." Varahamihira in Brihat Jataka and Mantreshwara in Phaladeepika further elaborate the interpretation of divisional charts, especially the Navamsha, calling it the "fruit-giving chart" (phala-suchaka).
        </p>
      </section>
    </div>
  );
}

export default function Module10_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
