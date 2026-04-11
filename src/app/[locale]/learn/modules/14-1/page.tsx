'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_14_1', phase: 4, topic: 'Compatibility', moduleNumber: '14.1',
  title: { en: 'Compatibility Matching — Kundali Milan', hi: 'कुण्डली मिलान — वैवाहिक अनुकूलता' },
  subtitle: {
    en: 'Ashta Kuta (8 factors, 36 points) and Dashakuta (10 factors) — two classical systems for evaluating marriage compatibility from Moon nakshatras',
    hi: 'अष्ट कूट (8 कारक, 36 अंक) और दशकूट (10 कारक) — चन्द्र नक्षत्रों से वैवाहिक अनुकूलता मूल्यांकन की दो शास्त्रीय पद्धतियाँ',
  },
  estimatedMinutes: 16,
  crossRefs: [
    { label: { en: 'Module 14-2: Mangal Dosha in Marriage', hi: 'मॉड्यूल 14-2: विवाह में मंगल दोष' }, href: '/learn/modules/14-2' },
    { label: { en: 'Module 14-3: Timing Marriage Events', hi: 'मॉड्यूल 14-3: विवाह समय निर्धारण' }, href: '/learn/modules/14-3' },
    { label: { en: 'Matching Deep Dive', hi: 'मिलान विस्तार' }, href: '/learn/matching' },
    { label: { en: 'Kundali Matching Tool', hi: 'कुण्डली मिलान उपकरण' }, href: '/matching' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q14_1_01', type: 'mcq',
    question: {
      en: 'What is the maximum possible score in the Ashta Kuta system?',
      hi: 'अष्ट कूट पद्धति में अधिकतम सम्भव अंक कितने हैं?',
    },
    options: [
      { en: '18 points', hi: '18 अंक' },
      { en: '36 points', hi: '36 अंक' },
      { en: '32 points', hi: '32 अंक' },
      { en: '40 points', hi: '40 अंक' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 8 kutas contribute 1+2+3+4+5+6+7+8 = 36 maximum points. Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), Nadi (8).',
      hi: '8 कूटों का योग 1+2+3+4+5+6+7+8 = 36 अधिकतम अंक होता है। वर्ण (1), वश्य (2), तारा (3), योनि (4), ग्रह मैत्री (5), गण (6), भकूट (7), नाड़ी (8)।',
    },
  },
  {
    id: 'q14_1_02', type: 'mcq',
    question: {
      en: 'What is the generally accepted minimum threshold for a compatible match?',
      hi: 'अनुकूल मिलान के लिए सामान्यतः स्वीकृत न्यूनतम सीमा क्या है?',
    },
    options: [
      { en: '12 out of 36', hi: '36 में से 12' },
      { en: '18 out of 36', hi: '36 में से 18' },
      { en: '24 out of 36', hi: '36 में से 24' },
      { en: '30 out of 36', hi: '36 में से 30' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '18/36 (50%) is the traditional minimum. Below 18 is generally discouraged. 18-24 is acceptable, 24-32 is good, and 32+ is excellent. However, the score alone is not sufficient — specific dosha checks matter more.',
      hi: '18/36 (50%) पारम्परिक न्यूनतम है। 18 से कम सामान्यतः निरुत्साहित किया जाता है। 18-24 स्वीकार्य, 24-32 अच्छा, और 32+ उत्तम है। परन्तु केवल अंक पर्याप्त नहीं — विशिष्ट दोष जाँच अधिक महत्वपूर्ण है।',
    },
  },
  {
    id: 'q14_1_03', type: 'true_false',
    question: {
      en: 'The Ashta Kuta system uses only the Moon nakshatra of both individuals — no other planetary positions are considered.',
      hi: 'अष्ट कूट पद्धति केवल दोनों व्यक्तियों के चन्द्र नक्षत्र का उपयोग करती है — किसी अन्य ग्रह स्थिति पर विचार नहीं होता।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Ashta Kuta is entirely Moon-nakshatra based. This is both its strength (simplicity) and its limitation — it ignores Venus, 7th house, and overall chart strength, which is why experienced astrologers look beyond just the Kuta score.',
      hi: 'सत्य। अष्ट कूट पूर्णतया चन्द्र-नक्षत्र आधारित है। यह इसकी शक्ति (सरलता) और सीमा दोनों है — यह शुक्र, सप्तम भाव, और समग्र कुण्डली बल की उपेक्षा करती है, इसलिए अनुभवी ज्योतिषी कूट अंकों से परे देखते हैं।',
    },
  },
  {
    id: 'q14_1_04', type: 'mcq',
    question: {
      en: 'Which kuta carries the highest point value (8 points) and is considered most critical?',
      hi: 'किस कूट का सर्वाधिक अंक मूल्य (8 अंक) है और सबसे महत्वपूर्ण माना जाता है?',
    },
    options: [
      { en: 'Bhakoot (7th lord compatibility)', hi: 'भकूट (सप्तमेश अनुकूलता)' },
      { en: 'Nadi (genetic/health compatibility)', hi: 'नाड़ी (आनुवंशिक/स्वास्थ्य अनुकूलता)' },
      { en: 'Gana (temperament)', hi: 'गण (स्वभाव)' },
      { en: 'Yoni (physical compatibility)', hi: 'योनि (शारीरिक अनुकूलता)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Nadi kuta (8 points) is the highest-weighted factor. It assesses constitutional compatibility — Aadi (Vata), Madhya (Pitta), and Antya (Kapha). Same nadi scores 0 and is called Nadi Dosha, traditionally considered very serious.',
      hi: 'नाड़ी कूट (8 अंक) सर्वाधिक भारित कारक है। यह शारीरिक संरचना अनुकूलता का आकलन करता है — आदि (वात), मध्य (पित्त), और अन्त्य (कफ)। समान नाड़ी में 0 अंक मिलते हैं जिसे नाड़ी दोष कहते हैं, जिसे पारम्परिक रूप से अत्यन्त गम्भीर माना जाता है।',
    },
  },
  {
    id: 'q14_1_05', type: 'mcq',
    question: {
      en: 'How does the South Indian Dashakuta system differ from the North Indian Ashta Kuta?',
      hi: 'दक्षिण भारतीय दशकूट पद्धति उत्तर भारतीय अष्ट कूट से कैसे भिन्न है?',
    },
    options: [
      { en: 'It uses Sun signs instead of Moon nakshatras', hi: 'यह चन्द्र नक्षत्रों के स्थान पर सूर्य राशियों का उपयोग करती है' },
      { en: 'It uses 10 factors instead of 8, with different weighting', hi: 'यह 8 के स्थान पर 10 कारकों का उपयोग करती है, भिन्न भार के साथ' },
      { en: 'It requires exact birth time while Ashta Kuta does not', hi: 'इसमें सटीक जन्म समय आवश्यक है जबकि अष्ट कूट में नहीं' },
      { en: 'It only checks Nadi and Bhakoot', hi: 'यह केवल नाड़ी और भकूट की जाँच करती है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Dashakuta adds 2 additional factors (Mahendra and Vedha) to the 8 kutas, with a different maximum score. The weighting priorities also differ — South Indian tradition places more emphasis on Rajju (longevity of spouse) which is not part of Ashta Kuta.',
      hi: 'दशकूट 8 कूटों में 2 अतिरिक्त कारक (महेन्द्र और वेध) जोड़ती है, भिन्न अधिकतम अंक के साथ। भार प्राथमिकताएँ भी भिन्न हैं — दक्षिण भारतीय परम्परा रज्जु (पति/पत्नी की दीर्घायु) पर अधिक बल देती है जो अष्ट कूट का भाग नहीं है।',
    },
  },
  {
    id: 'q14_1_06', type: 'true_false',
    question: {
      en: 'A couple scoring 32/36 on Ashta Kuta is guaranteed a happy marriage.',
      hi: '32/36 अष्ट कूट अंक प्राप्त करने वाले जोड़े का सुखी विवाह सुनिश्चित है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. High Kuta score is favorable but not a guarantee. A couple with 32 points but severely afflicted 7th houses, weak Venus, or misaligned dashas can face serious challenges. Conversely, 18-point couples with strong 7th lords and good Venus can be very happy.',
      hi: 'असत्य। उच्च कूट अंक अनुकूल है परन्तु गारण्टी नहीं। 32 अंक वाले जोड़े जिनके सप्तम भाव गम्भीर रूप से पीड़ित हों, शुक्र दुर्बल हो, या दशाएँ असंरेखित हों, गम्भीर चुनौतियों का सामना कर सकते हैं। इसके विपरीत, 18 अंक वाले जोड़े जिनके सप्तमेश बली और शुक्र शुभ हो, बहुत सुखी हो सकते हैं।',
    },
  },
  {
    id: 'q14_1_07', type: 'mcq',
    question: {
      en: 'What does the Bhakoot kuta (7 points) primarily assess?',
      hi: 'भकूट कूट (7 अंक) मुख्य रूप से किसका आकलन करता है?',
    },
    options: [
      { en: 'Physical attraction between partners', hi: 'साथियों के मध्य शारीरिक आकर्षण' },
      { en: 'Financial prosperity and emotional harmony of the couple', hi: 'दम्पती की आर्थिक समृद्धि और भावनात्मक सामंजस्य' },
      { en: 'Number of children the couple will have', hi: 'दम्पती को कितनी सन्तान होगी' },
      { en: 'Career compatibility', hi: 'व्यावसायिक अनुकूलता' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Bhakoot kuta (7 points) checks the Moon sign relationship (2/12, 6/8, 5/9 etc.) between partners. The 6/8 and 2/12 combinations score 0 (Bhakoot Dosha) indicating potential for financial stress and emotional disconnect.',
      hi: 'भकूट कूट (7 अंक) साथियों के मध्य चन्द्र राशि सम्बन्ध (2/12, 6/8, 5/9 आदि) की जाँच करता है। 6/8 और 2/12 संयोजनों में 0 अंक मिलते हैं (भकूट दोष) जो आर्थिक तनाव और भावनात्मक विच्छेद की सम्भावना दर्शाता है।',
    },
  },
  {
    id: 'q14_1_08', type: 'mcq',
    question: {
      en: 'Which chart factor can override a low Kuta score and still indicate a successful marriage?',
      hi: 'कौन-सा कुण्डली कारक कम कूट अंक को अधिभावी कर सकता है और फिर भी सफल विवाह दर्शा सकता है?',
    },
    options: [
      { en: 'Strong 7th house lord in a kendra with good dignity', hi: 'केन्द्र में उच्च गरिमा सहित बली सप्तमेश' },
      { en: 'Sun in the 10th house', hi: 'दशम भाव में सूर्य' },
      { en: 'Mercury retrograde', hi: 'बुध वक्री' },
      { en: 'Rahu in the 1st house', hi: 'प्रथम भाव में राहु' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'A strong 7th house lord (the house of marriage) in a kendra with good dignity is a powerful indicator of marital happiness regardless of the Kuta score. Venus dignity and Navamsha compatibility are also crucial override factors.',
      hi: 'केन्द्र में उच्च गरिमा सहित बली सप्तमेश (विवाह का भाव) कूट अंक की परवाह किए बिना वैवाहिक सुख का शक्तिशाली संकेत है। शुक्र की गरिमा और नवांश अनुकूलता भी महत्वपूर्ण अधिभावी कारक हैं।',
    },
  },
  {
    id: 'q14_1_09', type: 'true_false',
    question: {
      en: 'Navamsha (D-9) compatibility between two charts is more important than Rashi chart Kuta matching for predicting marital quality.',
      hi: 'वैवाहिक गुणवत्ता की भविष्यवाणी के लिए दो कुण्डलियों के मध्य नवांश (डी-9) अनुकूलता राशि कुण्डली कूट मिलान से अधिक महत्वपूर्ण है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The Navamsha (D-9) is called the "marriage chart" and reveals the deeper quality of partnerships. Many experienced jyotishis consider Navamsha compatibility — especially Navamsha lagna lord placement and Venus dignity in D-9 — more revealing than the Kuta score.',
      hi: 'सत्य। नवांश (डी-9) को "विवाह कुण्डली" कहा जाता है और यह साझेदारी की गहरी गुणवत्ता प्रकट करता है। अनेक अनुभवी ज्योतिषी नवांश अनुकूलता — विशेषकर नवांश लग्नेश स्थिति और डी-9 में शुक्र गरिमा — को कूट अंक से अधिक प्रकट करने वाला मानते हैं।',
    },
  },
  {
    id: 'q14_1_10', type: 'mcq',
    question: {
      en: 'What is the correct first step in the Kundali Milan process?',
      hi: 'कुण्डली मिलान प्रक्रिया में सही प्रथम चरण क्या है?',
    },
    options: [
      { en: 'Check Mars dosha immediately', hi: 'तुरन्त मंगल दोष जाँचें' },
      { en: 'Determine both Moon nakshatras and compute all 8 kutas', hi: 'दोनों के चन्द्र नक्षत्र ज्ञात करें और सभी 8 कूटों की गणना करें' },
      { en: 'Compare Sun signs', hi: 'सूर्य राशियों की तुलना करें' },
      { en: 'Read both horoscopes aloud to family', hi: 'दोनों जन्मपत्रिकाएँ परिवार को पढ़कर सुनाएँ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Step 1: Get both Moon nakshatras from their birth charts. Step 2: Compute all 8 kutas. Step 3: Check for Nadi/Bhakoot dosha specifically. Step 4: Examine Mars dosha. Step 5: Assess overall chart strength (7th house, Venus, Navamsha).',
      hi: 'चरण 1: दोनों की जन्म कुण्डलियों से चन्द्र नक्षत्र प्राप्त करें। चरण 2: सभी 8 कूटों की गणना करें। चरण 3: विशेष रूप से नाड़ी/भकूट दोष की जाँच करें। चरण 4: मंगल दोष की जाँच करें। चरण 5: समग्र कुण्डली बल का आकलन करें (सप्तम भाव, शुक्र, नवांश)।',
    },
  },
];

/* ─── Page 1: What is Kundali Milan ─── */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Kundali Milan: Matching Two Birth Charts
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Kundali Milan is the Vedic practice of comparing two birth charts to evaluate marriage compatibility. Unlike Western compatibility which often focuses on Sun sign elements, Kundali Milan is built entirely on the Moon — specifically the Moon nakshatra of each person. The Moon represents the mind (manas), emotions, and daily temperament, making it the most relevant graha for intimacy and cohabitation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          There are two major classical systems. The <strong className="text-gold-light">Ashta Kuta</strong> (8-factor) system, dominant in North India, evaluates 8 compatibility dimensions and assigns a maximum of 36 points (1+2+3+4+5+6+7+8). The <strong className="text-gold-light">Dashakuta</strong> (10-factor) system, followed in South India, adds Mahendra and Vedha kutas with different weighting, and places special emphasis on Rajju (longevity of spouse) which is considered non-negotiable.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The conventional minimum is <strong className="text-gold-light">18 out of 36</strong> (50%). Below this, the match is traditionally discouraged. Scores of 24+ are considered good, and 32+ excellent. However — and this is critical — the total score alone never tells the whole story. A match with 30 points but Nadi Dosha (0/8 on the most critical kuta) is often rejected, while 20 points with full Nadi and Bhakoot can be perfectly viable.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">The 8 Kutas at a Glance</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">1. Varna (1 pt)</span> — Spiritual/ego compatibility. Brahmin, Kshatriya, Vaishya, Shudra classification by nakshatra.</p>
          <p><span className="text-gold-light font-semibold">2. Vashya (2 pts)</span> — Dominance/attraction. Which sign "controls" the other. Mutual vashya is ideal.</p>
          <p><span className="text-gold-light font-semibold">3. Tara (3 pts)</span> — Destiny compatibility. Count from bride to groom nakshatra, mod 9. Certain remainders are auspicious.</p>
          <p><span className="text-gold-light font-semibold">4. Yoni (4 pts)</span> — Physical/sexual compatibility. Each nakshatra has an animal symbol; matching checks natural affinity.</p>
          <p><span className="text-gold-light font-semibold">5. Graha Maitri (5 pts)</span> — Planetary friendship between Moon sign lords. Friends score full, enemies score zero.</p>
          <p><span className="text-gold-light font-semibold">6. Gana (6 pts)</span> — Temperament: Deva (gentle), Manushya (moderate), Rakshasa (intense). Same gana is best.</p>
          <p><span className="text-gold-light font-semibold">7. Bhakoot (7 pts)</span> — Moon sign relationship (2/12, 6/8 = dosha). Affects finances and emotional bond.</p>
          <p><span className="text-gold-light font-semibold">8. Nadi (8 pts)</span> — Constitutional type: Aadi (Vata), Madhya (Pitta), Antya (Kapha). Same = 0 = Nadi Dosha.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Why Matching Alone Does Not Guarantee Success</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Ashta Kuta uses only the Moon nakshatra — it knows nothing about the 7th house, Venus strength, dasha alignment, or Navamsha compatibility. Think of it as checking blood group compatibility before surgery — necessary but not sufficient. Two people can score 34/36 yet have Mars afflicting each other&apos;s 7th houses, Venus debilitated in both charts, and misaligned Mahadasha periods. The Kuta score opens the door; the full chart analysis determines whether to walk through it.
        </p>
      </section>
    </div>
  );
}

/* ─── Page 2: Beyond Guna Milan — Chart Override Factors ─── */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Beyond Guna Milan — Chart Factors That Override Points
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Experienced jyotishis never stop at the Kuta score. After computing the 8 kutas, they examine the full birth charts of both individuals for factors that can elevate a mediocre score or undermine an excellent one. The most important override factors involve the <strong className="text-gold-light">7th house</strong> (marriage), <strong className="text-gold-light">Venus</strong> (love, harmony), <strong className="text-gold-light">Navamsha</strong> (D-9, the marriage divisional chart), and <strong className="text-gold-light">Dasha alignment</strong>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          A couple with only 18 points but both having their 7th lord in a kendra (1, 4, 7, 10) in its own sign or exalted, with Venus well-placed in both charts and harmonious Navamsha lagnas, can be far happier than a 32-point couple where both have Saturn aspecting the 7th house, debilitated Venus, and mismatched dashas running during the early marriage years.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Key Override Factors</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">7th House Lord Strength:</span> The 7th lord in a kendra or trikona in good dignity (own sign, exalted, or in a friendly sign) is the single strongest indicator of marital happiness. If both partners have strong 7th lords, the marriage has a solid foundation regardless of the Kuta score.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Venus Dignity:</span> Venus is the natural karaka (significator) of marriage, love, and harmony. Venus in own sign (Taurus/Libra), exalted (Pisces), or well-aspected by Jupiter gives the native an innate capacity for partnership. Debilitated Venus (Virgo) or Venus conjunct malefics weakens relationship capacity.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Navamsha (D-9) Compatibility:</span> The D-9 chart is specifically the "marriage and dharma" chart. Compare the Navamsha lagnas — if they are in friendly signs, or if the Navamsha lagna lords are in mutual kendras, the partnership runs deep. Also check Venus placement in both D-9 charts.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Dasha Sandhi Alignment:</span> If one partner is running Rahu Mahadasha (restlessness, unconventional desires) while the other runs Saturn Mahadasha (restriction, discipline), the energetic mismatch creates friction. Ideally, both should be in dashas that support partnership — Venus, Jupiter, or the 7th lord dasha periods.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Worked Example</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Case A — High Score, Troubled Marriage:</span> Groom&apos;s Moon in Rohini, Bride&apos;s Moon in Hasta. Kuta score: 30/36 (excellent). But: Groom has Saturn in 7th aspecting Venus, Mars in 8th (severe Mangal Dosha). Bride has 7th lord debilitated in 12th, Rahu-Ketu across 1-7 axis. Despite the stellar Kuta score, both charts independently show marital difficulty.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Case B — Modest Score, Happy Marriage:</span> Kuta score: 20/36 (just acceptable). But: Both have Jupiter aspecting their 7th houses, Venus in own sign, 7th lords in kendras, and both running Jupiter Mahadasha during early marriage. The chart-level strengths compensate handsomely for the lower Kuta alignment.
        </p>
      </section>
    </div>
  );
}

/* ─── Page 3: The Matching Process Step by Step ─── */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          The Matching Process — Step by Step
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          A thorough Kundali Milan follows a structured sequence. Skipping steps or relying only on the numerical score is the most common mistake in modern matching. Here is the classical process as practiced by experienced jyotishis:
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">The 5-Step Process</h4>
        <div className="space-y-3 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Step 1 — Moon Nakshatra Identification:</span> From each person&apos;s birth chart, identify the exact Moon nakshatra and pada. This requires accurate birth time (at least within 2 hours for nakshatra accuracy, within 15 minutes for pada accuracy). The nakshatra pada also determines the Navamsha lagna, so precision matters.</p>
          <p><span className="text-gold-light font-semibold">Step 2 — Compute All 8 Kutas:</span> Systematically calculate each kuta from the two Moon nakshatras. Record each sub-score individually — the breakdown matters as much as the total. Pay special attention to Nadi (8 pts), Bhakoot (7 pts), and Gana (6 pts) which together account for 21 of 36 possible points.</p>
          <p><span className="text-gold-light font-semibold">Step 3 — Specific Dosha Check:</span> Even if the total is above 18, check specifically for Nadi Dosha (0/8) and Bhakoot Dosha (0/7). These two doshas have specific exceptions and cancellations. Nadi Dosha is cancelled if both Moon signs are the same. Bhakoot Dosha is cancelled by the lords of both Moon signs being friends or the same planet.</p>
          <p><span className="text-gold-light font-semibold">Step 4 — Mars Dosha (Manglik) Check:</span> Independently check both charts for Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, and Venus. If one partner has Mangal Dosha and the other does not, this is traditionally a serious concern — covered in detail in Module 14-2.</p>
          <p><span className="text-gold-light font-semibold">Step 5 — Full Chart Assessment:</span> Evaluate 7th house lord strength, Venus placement, Navamsha compatibility, and current/upcoming dasha periods for both charts. This is where a human jyotishi adds the most value — no automated system can fully replicate the holistic judgment of an experienced practitioner.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">When to Consult a Jyotishi vs. Relying on Automated Scoring</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Automated tools are sufficient when:</span> The score is clearly high (28+) with no Nadi or Bhakoot dosha, no Mangal Dosha mismatch, and both charts appear generally well-placed. In this case, the match is likely favorable and detailed analysis is confirmatory rather than diagnostic.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Consult a jyotishi when:</span> The score is borderline (18-24), or when specific doshas appear (Nadi 0, Bhakoot 0, Manglik mismatch), or when one partner has challenging placements (7th lord in dusthana, Saturn/Rahu in 7th). A skilled practitioner can assess cancellation conditions, dasha timing, and remedial options that no algorithm can fully evaluate.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Pitfalls</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The biggest modern pitfall is treating the Kuta score like a credit score — reducing a complex multi-dimensional assessment to a single number. Families sometimes reject excellent matches because the score is 22 instead of 28, while accepting problematic ones that happen to score 30. Remember: the 8 kutas use only the Moon nakshatra. They say nothing about the ascendant, planetary yogas, dasha periods, or the hundreds of other factors that shape a life. Use the Kuta score as a screening tool, not a verdict.
        </p>
      </section>
    </div>
  );
}

export default function Module14_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
