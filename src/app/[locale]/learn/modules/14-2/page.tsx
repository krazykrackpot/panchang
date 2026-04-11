'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_14_2', phase: 4, topic: 'Compatibility', moduleNumber: '14.2',
  title: { en: 'Mangal Dosha in Marriage', hi: 'विवाह में मंगल दोष' },
  subtitle: {
    en: 'Mars in houses 1, 2, 4, 7, 8, 12 from Lagna/Moon/Venus — its real impact, cancellations, and modern perspective',
    hi: 'लग्न/चन्द्र/शुक्र से भाव 1, 2, 4, 7, 8, 12 में मंगल — वास्तविक प्रभाव, निरस्तीकरण, और आधुनिक दृष्टिकोण',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 14-1: Kundali Milan', hi: 'मॉड्यूल 14-1: कुण्डली मिलान' }, href: '/learn/modules/14-1' },
    { label: { en: 'Module 14-3: Timing Marriage Events', hi: 'मॉड्यूल 14-3: विवाह समय निर्धारण' }, href: '/learn/modules/14-3' },
    { label: { en: 'Doshas Deep Dive', hi: 'दोष विस्तार' }, href: '/learn/doshas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q14_2_01', type: 'mcq',
    question: {
      en: 'From which reference points is Mangal Dosha traditionally checked?',
      hi: 'मंगल दोष पारम्परिक रूप से किन सन्दर्भ बिन्दुओं से जाँचा जाता है?',
    },
    options: [
      { en: 'Only from Lagna (Ascendant)', hi: 'केवल लग्न से' },
      { en: 'From Lagna, Moon, and Venus', hi: 'लग्न, चन्द्र, और शुक्र से' },
      { en: 'Only from Moon', hi: 'केवल चन्द्र से' },
      { en: 'From Sun and Jupiter', hi: 'सूर्य और बृहस्पति से' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The North Indian tradition checks Mars placement from Lagna, Moon, and Venus. If Mars occupies houses 1, 2, 4, 7, 8, or 12 from ANY of these three, Mangal Dosha is present. The South Indian tradition typically checks only from Lagna.',
      hi: 'उत्तर भारतीय परम्परा लग्न, चन्द्र, और शुक्र से मंगल की स्थिति जाँचती है। यदि मंगल इन तीनों में से किसी से भी भाव 1, 2, 4, 7, 8, या 12 में हो, तो मंगल दोष है। दक्षिण भारतीय परम्परा सामान्यतः केवल लग्न से जाँचती है।',
    },
  },
  {
    id: 'q14_2_02', type: 'mcq',
    question: {
      en: 'Approximately what percentage of charts have some form of Mangal Dosha?',
      hi: 'लगभग कितने प्रतिशत कुण्डलियों में किसी प्रकार का मंगल दोष होता है?',
    },
    options: [
      { en: 'About 10%', hi: 'लगभग 10%' },
      { en: 'About 25%', hi: 'लगभग 25%' },
      { en: 'About 40%', hi: 'लगभग 40%' },
      { en: 'About 75%', hi: 'लगभग 75%' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'When checking from all three reference points (Lagna, Moon, Venus) across 6 houses each, roughly 40% of all charts show some form of Mangal Dosha. This high frequency itself suggests that the dosha should be evaluated carefully rather than feared blindly.',
      hi: 'तीनों सन्दर्भ बिन्दुओं (लग्न, चन्द्र, शुक्र) से प्रत्येक 6 भावों में जाँचने पर, लगभग 40% कुण्डलियों में किसी प्रकार का मंगल दोष दिखता है। यह उच्च आवृत्ति स्वयं सुझाती है कि दोष का मूल्यांकन सावधानी से होना चाहिए, न कि अन्धा भय।',
    },
  },
  {
    id: 'q14_2_03', type: 'true_false',
    question: {
      en: 'Mangal Dosha is automatically cancelled if Mars is in its own sign (Aries or Scorpio) in the dosha house.',
      hi: 'यदि दोष भाव में मंगल अपनी स्वयं की राशि (मेष या वृश्चिक) में हो तो मंगल दोष स्वतः निरस्त हो जाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Mars in its own sign (Aries or Scorpio) is one of the 6 classical cancellation conditions. A planet in its own sign is "at home" and behaves constructively — Mars here gives courage and assertiveness rather than destructive aggression.',
      hi: 'सत्य। अपनी स्वयं की राशि (मेष या वृश्चिक) में मंगल 6 शास्त्रीय निरस्तीकरण शर्तों में से एक है। अपनी राशि में ग्रह "अपने घर में" होता है और रचनात्मक रूप से कार्य करता है — यहाँ मंगल विनाशकारी आक्रामकता के बजाय साहस और दृढ़ता प्रदान करता है।',
    },
  },
  {
    id: 'q14_2_04', type: 'mcq',
    question: {
      en: 'What happens when both partners have Mangal Dosha?',
      hi: 'जब दोनों साथियों को मंगल दोष हो तो क्या होता है?',
    },
    options: [
      { en: 'The dosha doubles in severity', hi: 'दोष की गम्भीरता दोगुनी हो जाती है' },
      { en: 'It cancels out — mutual Mangal Dosha is considered a cancellation', hi: 'यह निरस्त हो जाता है — पारस्परिक मंगल दोष निरस्तीकरण माना जाता है' },
      { en: 'Only the male partner\'s dosha counts', hi: 'केवल पुरुष साथी का दोष गिना जाता है' },
      { en: 'The marriage must happen on Tuesday', hi: 'विवाह मंगलवार को होना चाहिए' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'When both partners have Mangal Dosha, it is mutually cancelled — "two negatives make a positive." Both carry similar Mars energy, so neither overwhelms the other. This is the most common and widely accepted cancellation.',
      hi: 'जब दोनों साथियों को मंगल दोष हो, तो यह पारस्परिक रूप से निरस्त हो जाता है — "दो ऋणात्मक मिलकर धनात्मक बनाते हैं।" दोनों में समान मंगल ऊर्जा होती है, अतः कोई भी दूसरे पर हावी नहीं होता। यह सबसे सामान्य और व्यापक रूप से स्वीकृत निरस्तीकरण है।',
    },
  },
  {
    id: 'q14_2_05', type: 'mcq',
    question: {
      en: 'Which of these is NOT a classical cancellation condition for Mangal Dosha?',
      hi: 'इनमें से कौन मंगल दोष की शास्त्रीय निरस्तीकरण शर्त नहीं है?',
    },
    options: [
      { en: 'Mars in Capricorn (exalted)', hi: 'मकर में मंगल (उच्च)' },
      { en: 'Jupiter aspects the dosha house', hi: 'बृहस्पति की दोष भाव पर दृष्टि' },
      { en: 'Mercury is retrograde in the chart', hi: 'कुण्डली में बुध वक्री है' },
      { en: 'Partner also has Mangal Dosha', hi: 'साथी को भी मंगल दोष है' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Mercury retrograde has no connection to Mangal Dosha cancellation. The classical cancellations are: Mars in own sign, Mars exalted (Capricorn), Jupiter aspect on dosha house, mutual dosha (both partners), Mars in specific nakshatras, and Venus/Jupiter in 7th.',
      hi: 'बुध वक्री का मंगल दोष निरस्तीकरण से कोई सम्बन्ध नहीं है। शास्त्रीय निरस्तीकरण हैं: स्वराशि में मंगल, उच्च मंगल (मकर), दोष भाव पर बृहस्पति दृष्टि, पारस्परिक दोष (दोनों साथी), विशिष्ट नक्षत्रों में मंगल, और सप्तम में शुक्र/बृहस्पति।',
    },
  },
  {
    id: 'q14_2_06', type: 'true_false',
    question: {
      en: 'The South Indian tradition checks Mangal Dosha from Lagna, Moon, and Venus — same as the North Indian tradition.',
      hi: 'दक्षिण भारतीय परम्परा मंगल दोष को लग्न, चन्द्र, और शुक्र से जाँचती है — उत्तर भारतीय परम्परा के समान।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The South Indian tradition typically checks Mangal Dosha only from Lagna (Ascendant). The triple-reference-point system (Lagna + Moon + Venus) is primarily a North Indian practice, which results in a wider net and higher detection rate.',
      hi: 'असत्य। दक्षिण भारतीय परम्परा सामान्यतः मंगल दोष केवल लग्न से जाँचती है। त्रि-सन्दर्भ-बिन्दु पद्धति (लग्न + चन्द्र + शुक्र) मुख्य रूप से उत्तर भारतीय प्रथा है, जिसके परिणामस्वरूप व्यापक जाल और उच्चतर पता लगाने की दर होती है।',
    },
  },
  {
    id: 'q14_2_07', type: 'mcq',
    question: {
      en: 'What does Mangal Dosha actually indicate about a person\'s personality?',
      hi: 'मंगल दोष वास्तव में व्यक्ति के व्यक्तित्व के बारे में क्या दर्शाता है?',
    },
    options: [
      { en: 'The person is cursed and will harm their spouse', hi: 'व्यक्ति शापित है और अपने जीवनसाथी को हानि पहुँचाएगा' },
      { en: 'Assertive personality with passion and potential for arguments', hi: 'जुनून और वाद-विवाद की सम्भावना सहित दृढ़ व्यक्तित्व' },
      { en: 'The person should never marry', hi: 'व्यक्ति को कभी विवाह नहीं करना चाहिए' },
      { en: 'No personality significance — purely medical', hi: 'कोई व्यक्तित्व महत्व नहीं — पूर्णतया चिकित्सीय' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mars represents energy, assertiveness, courage, and passion. In marriage-related houses, this manifests as a strong-willed, passionate personality who may be prone to arguments and dominance. This is an energy to channel, not a curse to fear.',
      hi: 'मंगल ऊर्जा, दृढ़ता, साहस, और जुनून का प्रतिनिधित्व करता है। विवाह-सम्बन्धी भावों में यह दृढ़ इच्छाशक्ति वाले, उत्साही व्यक्तित्व के रूप में प्रकट होता है जो वाद-विवाद और प्रभुत्व की प्रवृत्ति रख सकता है। यह दिशा देने योग्य ऊर्जा है, न कि भय करने योग्य शाप।',
    },
  },
  {
    id: 'q14_2_08', type: 'mcq',
    question: {
      en: 'What is Kumbha Vivah?',
      hi: 'कुम्भ विवाह क्या है?',
    },
    options: [
      { en: 'A marriage ceremony performed during Kumbh Mela', hi: 'कुम्भ मेला के दौरान की जाने वाली विवाह उपचार' },
      { en: 'A symbolic marriage to a clay pot or tree to neutralize Mars dosha', hi: 'मंगल दोष निष्प्रभाव करने के लिए मिट्टी के घड़े या वृक्ष से प्रतीकात्मक विवाह' },
      { en: 'A type of Vedic wedding ceremony', hi: 'एक प्रकार का वैदिक विवाह संस्कार' },
      { en: 'Marriage in Aquarius (Kumbha) season', hi: 'कुम्भ ऋतु में विवाह' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Kumbha Vivah is a ritual where the Manglik person symbolically "marries" a clay pot (kumbha), a peepal tree, or a Vishnu idol before the actual marriage. This is believed to "exhaust" the Mars dosha energy on the symbolic spouse, protecting the real one.',
      hi: 'कुम्भ विवाह एक अनुष्ठान है जिसमें मांगलिक व्यक्ति वास्तविक विवाह से पूर्व प्रतीकात्मक रूप से मिट्टी के घड़े (कुम्भ), पीपल के वृक्ष, या विष्णु प्रतिमा से "विवाह" करता है। माना जाता है कि यह प्रतीकात्मक जीवनसाथी पर मंगल दोष ऊर्जा "समाप्त" कर देता है, वास्तविक जीवनसाथी की रक्षा करता है।',
    },
  },
  {
    id: 'q14_2_09', type: 'true_false',
    question: {
      en: 'Wearing red coral (Moonga) is universally recommended for all people with Mangal Dosha.',
      hi: 'मूँगा (लाल प्रवाल) पहनना सभी मंगल दोष वाले व्यक्तियों के लिए सार्वभौमिक रूप से अनुशंसित है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Red coral strengthens Mars, which can be counterproductive if Mars is already too strong or a functional malefic for that ascendant. Gemstone recommendations must be based on the complete chart — for some lagnas, strengthening Mars makes the dosha worse, not better.',
      hi: 'असत्य। मूँगा मंगल को शक्तिशाली बनाता है, जो प्रतिकूल हो सकता है यदि मंगल पहले से अत्यधिक शक्तिशाली हो या उस लग्न के लिए कार्यकारी पापी हो। रत्न सिफारिशें सम्पूर्ण कुण्डली पर आधारित होनी चाहिए — कुछ लग्नों के लिए, मंगल को शक्तिशाली बनाना दोष को बेहतर नहीं, बदतर बनाता है।',
    },
  },
  {
    id: 'q14_2_10', type: 'mcq',
    question: {
      en: 'Mars in which house from Lagna is considered the MOST severe form of Mangal Dosha?',
      hi: 'लग्न से किस भाव में मंगल को मंगल दोष का सर्वाधिक गम्भीर रूप माना जाता है?',
    },
    options: [
      { en: '1st house (Lagna itself)', hi: 'प्रथम भाव (लग्न स्वयं)' },
      { en: '7th house (house of marriage)', hi: 'सप्तम भाव (विवाह का भाव)' },
      { en: '8th house (house of longevity/transformation)', hi: 'अष्टम भाव (दीर्घायु/रूपान्तरण का भाव)' },
      { en: '12th house (house of losses)', hi: 'द्वादश भाव (हानि का भाव)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Mars in the 8th house is traditionally the most severe Mangal Dosha because the 8th rules longevity, and Mars (a violent planet) there was historically linked to spouse\'s life span. Mars in the 7th (direct marriage house) is the next most severe.',
      hi: 'अष्टम भाव में मंगल पारम्परिक रूप से सबसे गम्भीर मंगल दोष है क्योंकि अष्टम दीर्घायु का शासक है, और वहाँ मंगल (एक हिंसक ग्रह) ऐतिहासिक रूप से जीवनसाथी के जीवनकाल से जोड़ा गया था। सप्तम (प्रत्यक्ष विवाह भाव) में मंगल अगला सबसे गम्भीर है।',
    },
  },
];

/* ─── Page 1: What is Mangal Dosha ─── */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Mangal Dosha — Mars in Marriage Houses
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Mangal Dosha (also called Kuja Dosha or being &ldquo;Manglik&rdquo;) occurs when Mars occupies the <strong className="text-gold-light">1st, 2nd, 4th, 7th, 8th, or 12th house</strong> from the Lagna (Ascendant), Moon, or Venus. Each placement affects marriage differently: Mars in 7th directly impacts the spouse relationship, Mars in 8th threatens longevity/transformation, Mars in 4th disrupts domestic peace, Mars in 1st creates an aggressive temperament, Mars in 2nd affects family harmony, and Mars in 12th impacts bedroom compatibility and expenses.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Traditionally, Mangal Dosha has been one of the most feared factors in Indian marriage matching. Families would reject otherwise excellent proposals if one chart showed Mars in these positions. The fear centers on an ancient belief that a Manglik person&apos;s Mars energy could endanger the spouse&apos;s health or life span, particularly when Mars occupies the 7th or 8th house.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-gold-light">The reality is far more nuanced.</strong> When checking from all three reference points (Lagna, Moon, Venus) across 6 houses, roughly 40% of all charts show some form of Mangal Dosha. If 40% of the population were truly &ldquo;cursed,&rdquo; the institution of marriage would barely function. What Mars actually indicates is <em>passion, assertiveness, and conflict energy</em> — qualities that need channeling, not suppression.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Why These 6 Houses?</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">1st House (Lagna):</span> Self/personality — Mars here creates an aggressive, domineering temperament that can overwhelm a partner.</p>
          <p><span className="text-gold-light font-semibold">2nd House (Dhana):</span> Family/speech — Mars here causes harsh speech, family conflicts, and financial impulsiveness.</p>
          <p><span className="text-gold-light font-semibold">4th House (Sukha):</span> Home/peace — Mars here disrupts domestic harmony, causes frequent relocations, and property disputes.</p>
          <p><span className="text-gold-light font-semibold">7th House (Kalatra):</span> Spouse/marriage — Mars here directly impacts the marriage partner, causing arguments and power struggles.</p>
          <p><span className="text-gold-light font-semibold">8th House (Ayur):</span> Longevity/secrets — Mars here is the most feared placement, traditionally linked to danger to the spouse&apos;s life span.</p>
          <p><span className="text-gold-light font-semibold">12th House (Vyaya):</span> Losses/bedroom — Mars here causes sexual incompatibility, excessive expenses, and emotional distance.</p>
        </div>
      </section>
    </div>
  );
}

/* ─── Page 2: Cancellation Conditions ─── */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          The 6 Classical Cancellation Conditions
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Not every Mars placement in these houses creates an active dosha. Classical texts describe specific conditions under which Mangal Dosha is cancelled (neutralized). Understanding these cancellations is essential — many charts that appear &ldquo;Manglik&rdquo; on surface scanning are actually free of active dosha when evaluated properly.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Cancellation Conditions</h4>
        <div className="space-y-3 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">1. Mars in Own Sign (Aries/Scorpio):</span> A planet in its own sign is dignified and behaves constructively. Mars in Aries (1st or 8th for certain lagnas) or Scorpio gives courage, leadership, and focused energy rather than destructive aggression. The &ldquo;fire&rdquo; is controlled.</p>
          <p><span className="text-gold-light font-semibold">2. Mars in Capricorn (Exalted):</span> Exalted Mars is disciplined, strategic Mars. In Capricorn, Mars&apos;s energy is channeled into ambition and achievement. This is a powerful cancellation — exalted Mars actually strengthens the chart considerably.</p>
          <p><span className="text-gold-light font-semibold">3. Jupiter Aspect on Dosha House:</span> Jupiter&apos;s aspect (5th, 7th, or 9th from Jupiter) on the house where Mars creates dosha neutralizes the malefic effect. Jupiter is the great benefic — its gaze calms Mars&apos;s aggression and brings wisdom to the marriage dynamics.</p>
          <p><span className="text-gold-light font-semibold">4. Mutual Cancellation (Both Partners Manglik):</span> When both partners have Mangal Dosha, the energies balance. Two assertive, passionate people in a relationship often find equilibrium. This is the most commonly cited and universally accepted cancellation.</p>
          <p><span className="text-gold-light font-semibold">5. Mars in Specific Nakshatras:</span> Certain nakshatras modify Mars&apos;s behaviour even in dosha houses. Mars in Jupiter-ruled nakshatras (Punarvasu, Vishakha, Purva Bhadrapada) or in the nakshatras of benefic planets is considered mitigated.</p>
          <p><span className="text-gold-light font-semibold">6. Venus/Jupiter in 7th House:</span> A strong benefic (Venus or Jupiter) occupying the 7th house in either chart provides natural protection to the marriage. The benefic presence counterbalances Mars&apos;s martial energy with grace and wisdom.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">South Indian vs North Indian Approach</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The South Indian tradition is considerably more conservative — it checks Mangal Dosha <strong className="text-blue-300">only from Lagna</strong>, not from Moon or Venus. This dramatically reduces the detection rate. A chart that is &ldquo;double Manglik&rdquo; by North Indian standards (Mars dosha from both Lagna and Moon) might be completely clear by South Indian assessment. Neither tradition is &ldquo;wrong&rdquo; — they represent different interpretive frameworks, and the practitioner should specify which system they follow.
        </p>
      </section>
    </div>
  );
}

/* ─── Page 3: Modern Perspective & Remedies ─── */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Modern Perspective and Remedies
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Modern jyotish practitioners view Mangal Dosha through a psychological lens rather than a fatalistic one. Mars in marriage houses indicates an <strong className="text-gold-light">assertive, passionate personality</strong> with a higher-than-average potential for arguments, dominance struggles, and impulsive decisions in relationships. This energy is not inherently destructive — many highly successful marriages involve one or both Manglik partners who channel that Mars energy into shared goals, physical activity, and passionate partnership.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The key insight is this: Mars dosha describes an energy pattern, not a destiny. A Manglik person who is self-aware, communicative, and willing to manage conflict constructively can have an excellent marriage. The dosha becomes problematic primarily when the person is unaware of their own assertive tendencies and when the partner is particularly passive or conflict-averse.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Traditional Remedies</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Kumbha Vivah:</span> A symbolic marriage to a clay pot (kumbha), peepal tree, or Vishnu idol performed before the actual wedding. The first &ldquo;marriage&rdquo; absorbs the Mars energy, and the pot is then immersed in water. This is the most well-known remedy and is considered highly effective in traditional practice.</p>
          <p><span className="text-gold-light font-semibold">Mangal Puja on Tuesdays:</span> Regular worship of Mars (Mangal) on Tuesdays, including recitation of Mangal mantras, offering red items (kumkum, red flowers, red lentils) at a Hanuman temple. The discipline of weekly observance channels Mars energy into devotion.</p>
          <p><span className="text-gold-light font-semibold">Red Coral (Moonga):</span> Wearing red coral on the ring finger in gold or copper — but ONLY after complete chart analysis. If Mars is a functional malefic for the lagna (e.g., for Virgo or Gemini ascendant), strengthening Mars can be counterproductive. Always consult a qualified jyotishi before wearing any planetary gemstone.</p>
          <p><span className="text-gold-light font-semibold">Charity and Fasting:</span> Donating red items on Tuesdays (red lentils, jaggery, copper vessels). Fasting on Tuesdays (Mangalvar Vrat) is also traditional. These practices sublimate Mars energy into spiritual discipline and compassion.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">When Both Partners Have Dosha</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The principle of mutual cancellation is beautifully logical: two equally assertive people in a relationship create balance through equal footing. Neither partner overwhelms the other. The Mars energy, instead of being one-sided (one person always pushing, the other always retreating), becomes a shared dynamic of passion, healthy competition, and mutual respect for boundaries.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          In practice, couples where both partners are Manglik often report high passion, intense but quickly-resolved arguments, and a deep physical connection. The relationship is rarely boring — which is Mars&apos;s gift. The traditional wisdom of &ldquo;two negatives making a positive&rdquo; is, in this case, psychologically sound.
        </p>
      </section>
    </div>
  );
}

export default function Module14_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
