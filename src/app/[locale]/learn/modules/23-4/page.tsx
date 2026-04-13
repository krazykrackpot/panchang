'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/23-4.json';

const META: ModuleMeta = {
  id: 'mod_23_4', phase: 10, topic: 'Prediction', moduleNumber: '23.4',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/23-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/23-3' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/23-5' },
    { label: L.crossRefs[3].label as Record<string, string>, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q23_4_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q23_4_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q23_4_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q23_4_04', type: 'true_false',
    question: L.questions[3].question as Record<string, string>,
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q23_4_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q23_4_06', type: 'true_false',
    question: L.questions[5].question as Record<string, string>,
    correctAnswer: 1,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q23_4_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q23_4_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q23_4_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 2,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q23_4_10', type: 'mcq',
    question: L.questions[9].question as Record<string, string>,
    options: L.questions[9].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ─── Page 1: Yogi Point & Yogi Planet ─────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'योगी बिन्दु — आपकी कुण्डली का सबसे भाग्यशाली अंश' : 'Yogi Point — The Luckiest Degree in Your Chart'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>स्फुट गणना किए गए संवेदनशील बिन्दु हैं — राशिचक्र में अदृश्य स्थितियाँ जो शक्तिशाली ज्योतिषीय महत्व रखती हैं। ग्रहों के विपरीत, इनका कोई भौतिक शरीर नहीं है, लेकिन ज्योतिष अभ्यास की शताब्दियों में इनके प्रभाव सुप्रलेखित हैं। योगी बिन्दु जीवन की सबसे शुभ अवधियों की पहचान के लिए सबसे महत्वपूर्ण स्फुट है।</> : <>Sphutas are calculated sensitive points — invisible positions in the zodiac that carry powerful astrological significance. Unlike planets, they have no physical body, but their effects are well-documented across centuries of Jyotish practice. The Yogi Point is the most important sphuta for identifying life&apos;s most auspicious periods.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'गणना सूत्र' : 'Calculation Formula'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>योगी बिन्दु = सूर्य देशान्तर + चन्द्र देशान्तर + 93°20&apos;। 93°20&apos; स्थिरांक पुष्य नक्षत्र के आरम्भ से विस्तार दर्शाता है। यदि परिणाम 360° से अधिक हो तो 360° घटाएँ। जिस नक्षत्र में यह बिन्दु पड़ता है वह योगी नक्षत्र है। उस नक्षत्र का स्वामी योगी ग्रह बनता है — आपकी कुण्डली का एकमात्र सबसे शुभ ग्रह।</> : <>Yogi Point = Sun longitude + Moon longitude + 93°20&apos;. The 93°20&apos; constant represents the span from the beginning of Pushya nakshatra. If the result exceeds 360°, subtract 360°. The nakshatra where this point falls is the Yogi Nakshatra. The lord of that nakshatra becomes the Yogi Planet — the single most auspicious planet in your chart.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'योगी ग्रह का महत्व' : 'Yogi Planet Significance'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>योगी ग्रह की महादशा या अन्तर्दशा के दौरान, जातक अपनी सबसे भाग्यशाली अवधियाँ अनुभव करता है। कैरियर सफलता, आर्थिक लाभ, आध्यात्मिक विकास और व्यक्तिगत परिपूर्णता अधिक सहजता से प्रवाहित होती है। जब गोचर भी योगी बिन्दु को सक्रिय करते हैं (जैसे बृहस्पति उस पर से गुजरता है), तो सकारात्मक प्रभाव कई गुना बढ़ जाते हैं।</> : <>During the Yogi Planet&apos;s Maha Dasha or Antar Dasha, the native experiences their most fortunate periods. Career breakthroughs, financial gains, spiritual growth, and personal fulfillment flow more easily. When transits also activate the Yogi Point (e.g., Jupiter crossing it), the positive effects are amplified manifold.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'द्वैत योगी' : 'Duplicate Yogi'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>यदि योगी ग्रह कोई अन्य महत्वपूर्ण भूमिका भी रखता है — लग्न स्वामी, आत्मकारक, केन्द्र या त्रिकोण का स्वामी, या योगकारक ग्रह — तो यह &quot;द्वैत योगी&quot; बनता है। यह अत्यन्त शक्तिशाली है। ऐसे ग्रह की दशा जातक के जीवन की परिभाषित अवधि होगी, जो सबसे बड़ी उपलब्धियाँ और सबसे महत्वपूर्ण सकारात्मक परिवर्तन लाएगी।</> : <>If the Yogi Planet also holds another important role — Lagna lord, Atmakaraka, lord of a Kendra or Trikona, or a yoga-forming planet — it becomes a &quot;Duplicate Yogi.&quot; This is extremely powerful. Such a planet&apos;s dasha will be the defining period of the native&apos;s life, bringing the greatest achievements and most significant positive transformations.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'व्यावहारिक उदाहरण' : 'Practical Example'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>यदि आपका योगी बिन्दु पुष्य नक्षत्र (93°20&apos; - 106°40&apos;) में पड़ता है, तो योगी ग्रह शनि (पुष्य का स्वामी) है। शनि की महादशा में आप सबसे उत्पादक अवधि अनुभव करते हैं — संरचित विकास, अनुशासन से कैरियर उन्नति, और स्थायी उपलब्धियाँ। यदि शनि आपका दशम स्वामी (कैरियर) भी है, तो प्रभाव दोगुना शक्तिशाली है।</> : <>If your Yogi Point falls in Pushya nakshatra (93°20&apos; - 106°40&apos;), the Yogi Planet is Saturn (Pushya&apos;s lord). During Saturn&apos;s Maha Dasha, you experience your most productive period — structured growth, career advancement through discipline, and lasting achievements. If Saturn is also your 10th lord (career), the effect is doubly powerful.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Avayogi Point ────────────────────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'अवयोगी — बाधा ग्रह' : 'Avayogi — The Obstacle Planet'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>अवयोगी बिन्दु योगी बिन्दु का छाया प्रतिरूप है। योगी बिन्दु से 186°40&apos; दूर स्थित, यह उस नक्षत्र और ग्रह की पहचान करता है जो सबसे बड़ी बाधाएँ और चुनौतियाँ लाते हैं। योगी और अवयोगी दोनों को समझना आपके सर्वोत्तम और सबसे कठिन समय की पूरी तस्वीर देता है।</> : <>The Avayogi Point is the shadow counterpart of the Yogi Point. Located 186°40&apos; away from the Yogi Point, it identifies the nakshatra and planet that bring the greatest obstacles and challenges. Understanding both the Yogi and Avayogi gives you a complete picture of your best and worst timing.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{isHi ? 'अवयोगी गणना' : 'Avayogi Calculation'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>अवयोगी बिन्दु = योगी बिन्दु + 186°40&apos;। 186°40&apos; = 180° (राशिचक्र का विपरीत पक्ष) + 6°40&apos; (आधा नक्षत्र)। इस बिन्दु पर का नक्षत्र अवयोगी नक्षत्र है, और उसका स्वामी अवयोगी ग्रह है। इस ग्रह की दशाएँ और गोचर सबसे बड़ा प्रतिरोध और कठिनाई लाते हैं।</> : <>Avayogi Point = Yogi Point + 186°40&apos;. The 186°40&apos; is 180° (opposite side of zodiac) + 6°40&apos; (half a nakshatra). The nakshatra at this point is the Avayogi Nakshatra, and its lord is the Avayogi Planet. This planet&apos;s dashas and transits bring the greatest resistance and difficulty.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{isHi ? 'मिश्रित चुनौती' : 'Compounded Challenge'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>जब अवयोगी ग्रह की दशा प्रतिकूल गोचरों के साथ मेल खाती है — साढ़ेसाती (शनि जन्म चन्द्र पर), संवेदनशील बिन्दुओं पर ग्रहण सक्रियण, या अन्य चुनौतीपूर्ण विन्यास — तो कठिनाई बढ़ जाती है। यह ओवरलैप जीवन की सबसे चुनौतीपूर्ण अवधियाँ बनाता है। इन ओवरलैप की जागरूकता सक्रिय उपचारात्मक उपायों की अनुमति देती है।</> : <>When the Avayogi Planet&apos;s dasha overlaps with unfavorable transits — Sade Sati (Saturn over natal Moon), eclipse activations on sensitive points, or other challenging configurations — the difficulty compounds. This overlap creates the most challenging periods in life. Awareness of these overlaps allows for proactive remedial measures.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'योगी-अवयोगी सन्तुलन' : 'Yogi-Avayogi Balance'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>योगी और अवयोगी प्रणाली एक ध्रुवता प्रदान करती है — हर कुण्डली का एक सबसे शुभ और एक सबसे कम शुभ ग्रह होता है। यदि अवयोगी ग्रह कुण्डली के लिए कार्यात्मक शुभ भी है (जैसे त्रिकोण स्वामी), तो इसका नकारात्मक प्रभाव कुछ हद तक कम होता है। यदि यह पहले से कार्यात्मक पाप है (दुःस्थान स्वामी), तो इसकी अवयोगी स्थिति कठिनाई को बढ़ाती है।</> : <>The Yogi and Avayogi system provides a polarity — every chart has a most auspicious and least auspicious planet. If the Avayogi Planet is also a functional benefic for the chart (e.g., a trikona lord), its negative effect is somewhat mitigated. If it is already a functional malefic (dusthana lord), its Avayogi status amplifies the difficulty.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-light text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'समय रणनीति' : 'Timing Strategy'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>अपने योगी और अवयोगी ग्रहों को जानने से रणनीतिक जीवन योजना सम्भव होती है: प्रमुख उपक्रम योगी ग्रह की दशा में शुरू करें, और अवयोगी ग्रह की दशा का उपयोग आत्मनिरीक्षण, उपचारात्मक कार्य, और लम्बित दायित्वों को पूरा करने के लिए करें, नये शुरू करने के बजाय। यह ज्योतिष में सबसे सरल लेकिन सबसे प्रभावी समय उपकरणों में से एक है।</> : <>Knowing your Yogi and Avayogi planets allows strategic life planning: initiate major ventures during the Yogi Planet&apos;s dasha, and use the Avayogi Planet&apos;s dasha for introspection, remedial work, and completing pending obligations rather than starting new ones. This is one of the simplest yet most effective timing tools in Jyotish.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Bhrigu Bindu & Our Engine ────────────────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'भृगु बिन्दु — घटना सक्रियण बिन्दु' : 'Bhrigu Bindu — The Event Trigger Point'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पौराणिक ऋषि भृगु (भृगु संहिता के लेखक) के नाम पर, भृगु बिन्दु राहु और चन्द्रमा का मध्य बिन्दु है। यह प्रतीत होने वाली सरल गणना वैदिक ज्योतिष में सबसे विश्वसनीय घटना-समय संकेतकों में से एक उत्पन्न करती है। इस बिन्दु पर प्रमुख गोचर लगातार महत्वपूर्ण जीवन घटनाओं से सहसम्बन्ध रखते हैं।</> : <>Named after the legendary sage Bhrigu (author of Bhrigu Samhita), the Bhrigu Bindu is the midpoint between Rahu and the Moon. This seemingly simple calculation produces one of the most reliable event-timing indicators in Vedic astrology. Major transits over this point consistently correlate with significant life events.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'गणना' : 'Calculation'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>भृगु बिन्दु = (राहु का देशान्तर + चन्द्र का देशान्तर) / 2। लघु चाप मध्य बिन्दु का उपयोग करें। उदाहरण: यदि राहु 120° पर और चन्द्र 240° पर है, तो मध्य बिन्दु 180° है (0° नहीं)। यह बिन्दु एक विशिष्ट राशि, भाव और नक्षत्र में पड़ता है — जो सभी रंग देते हैं कि सक्रिय होने पर घटनाएँ कैसे प्रकट होती हैं।</> : <>Bhrigu Bindu = (Rahu&apos;s longitude + Moon&apos;s longitude) / 2. Use the shorter arc midpoint. For example, if Rahu is at 120° and Moon at 240°, the midpoint is 180° (not 0°). This point falls in a specific sign, house, and nakshatra — all of which color how events manifest when it is activated.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-emerald-500/10">
            <p className="text-emerald-300 font-bold text-sm">{isHi ? 'बृहस्पति गोचर = सकारात्मक घटना' : 'Jupiter Transit = Positive Event'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>जब बृहस्पति (महान शुभ ग्रह) भृगु बिन्दु से गोचर करता है, यह एक महत्वपूर्ण सकारात्मक घटना सक्रिय करता है — विवाह, सन्तान जन्म, पदोन्नति, आर्थिक लाभ, या आध्यात्मिक जागरण। विशिष्ट प्रकृति भाव और राशि पर निर्भर करती है। बृहस्पति को राशिचक्र पूरा करने में ~12 वर्ष लगते हैं, इसलिए यह प्रत्येक दशक में लगभग एक बार भृगु बिन्दु को पार करता है — प्रत्येक पार एक ऐतिहासिक घटना बनाता है।</> : <>When Jupiter (the great benefic) transits over the Bhrigu Bindu, it triggers a significant positive event — marriage, childbirth, promotion, financial windfall, or spiritual awakening. The specific nature depends on the house and sign. Jupiter takes ~12 years to complete the zodiac, so it crosses the Bhrigu Bindu roughly once per decade — making each crossing a landmark event.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{isHi ? 'शनि गोचर = बड़ी चुनौती' : 'Saturn Transit = Major Challenge'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>शनि का भृगु बिन्दु से गोचर एक बड़ी परीक्षा लाता है — कैरियर असफलता, स्वास्थ्य चुनौती, सम्बन्ध तनाव, या आर्थिक प्रतिबन्ध। शनि को राशिचक्र पार करने में ~29.5 वर्ष लगते हैं, इसलिए यह गोचर जीवन में लगभग दो या तीन बार होता है। जागरूकता तैयारी की अनुमति देती है: शनि के आने से पहले भृगु बिन्दु जिस भाव में पड़ता है उसे मजबूत करें।</> : <>Saturn transiting the Bhrigu Bindu brings a major test — career setback, health challenge, relationship strain, or financial restriction. Saturn takes ~29.5 years to traverse the zodiac, so this transit happens roughly twice or thrice in a lifetime. Awareness allows preparation: strengthen the house where the Bhrigu Bindu falls before Saturn arrives.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'हमारा इंजन सब गणना करता है' : 'Our Engine Computes All'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा कुण्डली इंजन जन्म डेटा से स्वचालित रूप से तीनों संवेदनशील बिन्दुओं — योगी बिन्दु (योगी नक्षत्र और ग्रह सहित), अवयोगी बिन्दु (अवयोगी ग्रह सहित), और भृगु बिन्दु — की गणना करता है। ये चार्ट विश्लेषण में प्रदर्शित होते हैं और दशा तथा गोचर भविष्यवाणियों में एकीकृत हैं, जो आपको सबसे शुभ और कम शुभ ग्रहीय अवधियों और प्रमुख घटनाओं को सक्रिय करने वाले सटीक अंशों की पूरी तस्वीर देते हैं।</> : <>Our Kundali engine computes all three sensitive points — Yogi Point (with Yogi Nakshatra and Planet), Avayogi Point (with Avayogi Planet), and Bhrigu Bindu — automatically from the birth data. These are displayed in the chart analysis and integrated into dasha and transit predictions, giving you a complete picture of your most and least auspicious planetary periods and the precise degrees that trigger major events.</>}</p>
      </section>
    </div>
  );
}

export default function Module23_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
