'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_18_2', phase: 5, topic: 'Strength', moduleNumber: '18.2',
  title: {
    en: 'Bhavabala — House Strength',
    hi: 'भावबल — भाव शक्ति',
  },
  subtitle: {
    en: 'How house strength is computed from the lord\'s Shadbala, directional dignity, and aspects received — revealing which life areas flourish naturally and which require effort',
    hi: 'भाव स्वामी के षड्बल, दिशात्मक गरिमा और प्राप्त दृष्टियों से भाव शक्ति की गणना — कौन-से जीवन क्षेत्र स्वाभाविक रूप से फलते हैं और किनमें प्रयास आवश्यक है',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 18-1: Shadbala — Planetary Strength', hi: 'मॉड्यूल 18-1: षड्बल — ग्रह शक्ति' }, href: '/learn/modules/18-1' },
    { label: { en: 'Module 18-3: Ashtakavarga — Bindu Scoring', hi: 'मॉड्यूल 18-3: अष्टकवर्ग — बिन्दु अंकन' }, href: '/learn/modules/18-3' },
    { label: { en: 'Kundali Tool', hi: 'कुण्डली उपकरण' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q18_2_01', type: 'mcq',
    question: {
      en: 'What are the three components of Bhavabala?',
      hi: 'भावबल के तीन घटक क्या हैं?',
    },
    options: [
      { en: 'Uccha, Dig, Kala', hi: 'उच्च, दिक्, काल' },
      { en: 'Bhavadhipati Bala, Bhava Dig Bala, Bhava Drishti Bala', hi: 'भावाधिपति बल, भाव दिग्बल, भाव दृष्टि बल' },
      { en: 'Sthana, Cheshta, Naisargika', hi: 'स्थान, चेष्टा, नैसर्गिक' },
      { en: 'Rashi, Nakshatra, Navamsha', hi: 'राशि, नक्षत्र, नवमांश' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Bhavabala consists of three components: Bhavadhipati Bala (strength contributed by the house lord\'s Shadbala), Bhava Dig Bala (inherent directional strength of the house), and Bhava Drishti Bala (net strength from planetary aspects received by the house).',
      hi: 'भावबल के तीन घटक हैं: भावाधिपति बल (भाव स्वामी के षड्बल से प्राप्त शक्ति), भाव दिग्बल (भाव की अन्तर्निहित दिशात्मक शक्ति), और भाव दृष्टि बल (भाव को प्राप्त ग्रह दृष्टियों से शुद्ध शक्ति)।',
    },
  },
  {
    id: 'q18_2_02', type: 'true_false',
    question: {
      en: 'A house with a weak lord but strong benefic aspects can still function well according to Bhavabala.',
      hi: 'भावबल के अनुसार दुर्बल स्वामी पर प्रबल शुभ दृष्टि वाला भाव भी अच्छा कार्य कर सकता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Bhavabala is a composite score. If Bhavadhipati Bala is low (weak lord) but Bhava Drishti Bala is high (Jupiter\'s full aspect on the house, for example), the total Bhavabala can still be adequate. The three components compensate for each other.',
      hi: 'सत्य। भावबल एक समग्र अंक है। यदि भावाधिपति बल कम है (दुर्बल स्वामी) पर भाव दृष्टि बल उच्च है (जैसे बृहस्पति की पूर्ण दृष्टि), तो कुल भावबल पर्याप्त हो सकता है। तीनों घटक एक-दूसरे की क्षतिपूर्ति करते हैं।',
    },
  },
  {
    id: 'q18_2_03', type: 'mcq',
    question: {
      en: 'In Bhava Dig Bala, which houses are considered inherently strongest?',
      hi: 'भाव दिग्बल में कौन-से भाव अन्तर्निहित रूप से सबसे बलवान माने जाते हैं?',
    },
    options: [
      { en: '3rd and 6th houses', hi: 'तृतीय और षष्ठ भाव' },
      { en: '1st and 7th houses (kendra axis)', hi: 'प्रथम और सप्तम भाव (केन्द्र अक्ष)' },
      { en: '8th and 12th houses', hi: 'अष्टम और द्वादश भाव' },
      { en: '2nd and 11th houses', hi: 'द्वितीय और एकादश भाव' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 1st and 7th houses (the primary kendra axis) carry the highest inherent Bhava Dig Bala. The logic mirrors Dig Bala for planets: angular houses (1st, 4th, 7th, 10th) are inherently powerful, with the 1st/7th axis being strongest.',
      hi: 'प्रथम और सप्तम भाव (प्राथमिक केन्द्र अक्ष) सर्वाधिक अन्तर्निहित भाव दिग्बल रखते हैं। तर्क ग्रहों के दिग्बल जैसा है: केन्द्र भाव (1, 4, 7, 10) अन्तर्निहित रूप से शक्तिशाली हैं, 1/7 अक्ष सबसे बलवान।',
    },
  },
  {
    id: 'q18_2_04', type: 'mcq',
    question: {
      en: 'How is Bhavadhipati Bala calculated?',
      hi: 'भावाधिपति बल की गणना कैसे की जाती है?',
    },
    options: [
      { en: 'It equals the house lord\'s total Shadbala multiplied by a proportionality factor', hi: 'यह भाव स्वामी के कुल षड्बल को आनुपातिकता गुणक से गुणा करके प्राप्त होता है' },
      { en: 'It is always 60 shashtiamsas for every house', hi: 'यह प्रत्येक भाव के लिए सदैव 60 षष्ट्यंश होता है' },
      { en: 'It depends only on the house lord\'s sign placement', hi: 'यह केवल भाव स्वामी की राशि स्थिति पर निर्भर करता है' },
      { en: 'It is the average of all planets in the house', hi: 'यह भाव में सभी ग्रहों का औसत है' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Bhavadhipati Bala is derived from the house lord\'s total Shadbala score, scaled by a proportionality factor. A strong lord (high Shadbala) directly strengthens the house it rules. This is why Shadbala must be computed first before Bhavabala.',
      hi: 'भावाधिपति बल भाव स्वामी के कुल षड्बल अंक से प्राप्त होता है, आनुपातिकता गुणक द्वारा मापित। बलवान स्वामी (उच्च षड्बल) सीधे उस भाव को बलवान बनाता है जिसका वह स्वामी है। इसीलिए भावबल से पहले षड्बल की गणना आवश्यक है।',
    },
  },
  {
    id: 'q18_2_05', type: 'true_false',
    question: {
      en: 'Jupiter\'s full aspect on a house adds approximately 60 shashtiamsas to Bhava Drishti Bala.',
      hi: 'भाव पर बृहस्पति की पूर्ण दृष्टि भाव दृष्टि बल में लगभग 60 षष्ट्यंश जोड़ती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Jupiter is the greatest benefic, and its full aspect (5th, 7th, or 9th from its position) contributes approximately +60 shashtiamsas to the house\'s Drishti Bala. This is why Jupiter\'s aspect is considered the most protective influence on any house.',
      hi: 'सत्य। बृहस्पति सबसे बड़ा शुभ ग्रह है, और इसकी पूर्ण दृष्टि (अपनी स्थिति से 5वीं, 7वीं या 9वीं) भाव के दृष्टि बल में लगभग +60 षष्ट्यंश योगदान करती है। इसीलिए बृहस्पति की दृष्टि किसी भी भाव पर सबसे रक्षात्मक प्रभाव मानी जाती है।',
    },
  },
  {
    id: 'q18_2_06', type: 'mcq',
    question: {
      en: 'The strongest Bhava in a chart indicates:',
      hi: 'कुण्डली में सबसे बलवान भाव इंगित करता है:',
    },
    options: [
      { en: 'The life area that will cause the most problems', hi: 'वह जीवन क्षेत्र जो सबसे अधिक समस्याएँ देगा' },
      { en: 'The life area of greatest natural success and ease', hi: 'सबसे अधिक स्वाभाविक सफलता और सहजता का जीवन क्षेत्र' },
      { en: 'The planet that is most malefic', hi: 'सबसे पापी ग्रह' },
      { en: 'Nothing meaningful without dasha analysis', hi: 'दशा विश्लेषण के बिना कुछ भी अर्थपूर्ण नहीं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The house with the highest Bhavabala represents the life area where the native experiences the greatest natural success and least resistance. A strong 10th house = easy career progress; a strong 7th house = natural relationship harmony.',
      hi: 'सर्वाधिक भावबल वाला भाव उस जीवन क्षेत्र को दर्शाता है जहाँ जातक सबसे अधिक स्वाभाविक सफलता और न्यूनतम प्रतिरोध अनुभव करता है। बलवान दशम भाव = सहज करियर प्रगति; बलवान सप्तम भाव = स्वाभाविक सम्बन्ध सामंजस्य।',
    },
  },
  {
    id: 'q18_2_07', type: 'mcq',
    question: {
      en: 'Saturn\'s full aspect on a house affects Bhava Drishti Bala by:',
      hi: 'भाव पर शनि की पूर्ण दृष्टि भाव दृष्टि बल को कैसे प्रभावित करती है?',
    },
    options: [
      { en: 'Adding +60 shashtiamsas', hi: '+60 षष्ट्यंश जोड़कर' },
      { en: 'Subtracting approximately 60 shashtiamsas', hi: 'लगभग 60 षष्ट्यंश घटाकर' },
      { en: 'No effect at all', hi: 'कोई प्रभाव नहीं' },
      { en: 'Doubling the house strength', hi: 'भाव शक्ति दोगुनी करके' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Saturn is a natural malefic, so its full aspect subtracts approximately 60 shashtiamsas from the house\'s Drishti Bala. This is why Saturn\'s aspect on the 7th house is associated with delays in marriage, and on the 5th house with challenges in children.',
      hi: 'शनि प्राकृतिक पापी ग्रह है, अतः इसकी पूर्ण दृष्टि भाव के दृष्टि बल से लगभग 60 षष्ट्यंश घटाती है। इसीलिए सप्तम भाव पर शनि की दृष्टि विवाह में विलम्ब से और पंचम पर सन्तान में चुनौतियों से जुड़ी है।',
    },
  },
  {
    id: 'q18_2_08', type: 'true_false',
    question: {
      en: 'Two charts with the same lagna will always have identical Bhavabala distributions.',
      hi: 'एक ही लग्न वाली दो कुण्डलियों में सदैव समान भावबल वितरण होगा।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Even with the same lagna, different planetary positions mean different Shadbala for each lord (affecting Bhavadhipati Bala) and different aspects on each house (affecting Drishti Bala). Same lagna, vastly different Bhavabala patterns, creating completely different life experiences.',
      hi: 'असत्य। एक ही लग्न होने पर भी, भिन्न ग्रह स्थितियाँ प्रत्येक स्वामी के लिए भिन्न षड्बल (भावाधिपति बल प्रभावित) और प्रत्येक भाव पर भिन्न दृष्टियाँ (दृष्टि बल प्रभावित) देती हैं। एक ही लग्न, अत्यन्त भिन्न भावबल प्रतिरूप, पूर्णतया भिन्न जीवन अनुभव।',
    },
  },
  {
    id: 'q18_2_09', type: 'mcq',
    question: {
      en: 'For analyzing marriage prospects, which house\'s Bhavabala is most relevant?',
      hi: 'विवाह सम्भावनाओं के विश्लेषण के लिए किस भाव का भावबल सबसे प्रासंगिक है?',
    },
    options: [
      { en: '5th house', hi: 'पंचम भाव' },
      { en: '7th house', hi: 'सप्तम भाव' },
      { en: '10th house', hi: 'दशम भाव' },
      { en: '12th house', hi: 'द्वादश भाव' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 7th house governs marriage and partnerships. Its Bhavabala reveals whether marriage comes easily (high strength) or with delay and challenges (low strength). The 7th lord\'s Shadbala, benefic aspects on the 7th, and the 7th house Dig Bala all contribute.',
      hi: 'सप्तम भाव विवाह और साझेदारी का शासक है। इसका भावबल दर्शाता है कि विवाह सहज होगा (उच्च शक्ति) या विलम्ब और चुनौतियों सहित (कम शक्ति)। सप्तमेश का षड्बल, सप्तम पर शुभ दृष्टि, और सप्तम भाव दिग्बल सभी योगदान करते हैं।',
    },
  },
  {
    id: 'q18_2_10', type: 'mcq',
    question: {
      en: 'How does Bhavabala help prioritize dasha predictions?',
      hi: 'भावबल दशा भविष्यवाणियों को प्राथमिकता देने में कैसे सहायता करता है?',
    },
    options: [
      { en: 'It replaces dasha analysis entirely', hi: 'यह दशा विश्लेषण को पूरी तरह प्रतिस्थापित करता है' },
      { en: 'Stronger houses manifest their significations more prominently during relevant dashas', hi: 'बलवान भाव सम्बन्धित दशाओं में अपने कारकत्वों को अधिक प्रमुखता से प्रकट करते हैं' },
      { en: 'It only affects Ketu dasha', hi: 'यह केवल केतु दशा को प्रभावित करता है' },
      { en: 'Bhavabala and dasha are completely unrelated', hi: 'भावबल और दशा पूर्णतया असम्बद्ध हैं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'During the dasha of a house lord, that house\'s significations become active. A house with high Bhavabala will manifest its themes positively and prominently during its lord\'s dasha. Low Bhavabala houses produce muted or challenging results even in favorable dashas.',
      hi: 'भाव स्वामी की दशा में उस भाव के कारकत्व सक्रिय होते हैं। उच्च भावबल वाला भाव अपने स्वामी की दशा में सकारात्मक और प्रमुख रूप से प्रकट होता है। कम भावबल वाले भाव अनुकूल दशाओं में भी मन्द या चुनौतीपूर्ण परिणाम देते हैं।',
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
          {isHi ? 'भाव शक्ति बनाम ग्रह शक्ति' : 'House Strength vs. Planet Strength'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>षड्बल बताता है कि ग्रह कितना बलवान है। परन्तु ज्योतिष में बारह भाव जीवन के बारह क्षेत्रों का प्रतिनिधित्व करते हैं &mdash; स्वयं, धन, भाई, सुख, सन्तान, शत्रु, विवाह, आयु, भाग्य, कर्म, लाभ और मोक्ष। कोई भाव बलवान हो सकता है भले ही उसका स्वामी मध्यम हो, या दुर्बल हो सकता है शक्तिशाली स्वामी होने पर भी, क्योंकि भाव शक्ति तीन स्वतन्त्र कारकों का समग्र है।</>
            : <>Shadbala tells us how strong a planet is. But in Jyotish, the twelve houses (bhavas) represent the twelve domains of life &mdash; self, wealth, siblings, happiness, children, enemies, marriage, longevity, fortune, career, gains, and liberation. A house can be strong even if its lord is middling, or weak despite having a powerful lord, because house strength is a composite of three independent factors.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>भावबल</strong> = <strong>भावाधिपति बल</strong> (स्वामी का षड्बल योगदान) + <strong>भाव दिग्बल</strong> (भाव की अन्तर्निहित स्थिति शक्ति) + <strong>भाव दृष्टि बल</strong> (भाव को प्राप्त शुद्ध दृष्टियाँ)। दुर्बल स्वामी पर प्रबल शुभ दृष्टि (जैसे सप्तम पर बृहस्पति दृष्टि) वाला भाव भी अच्छा कार्य कर सकता है। इसके विपरीत, उत्कृष्ट षड्बल वाले स्वामी का भाव जो शनि और मंगल की दृष्टि प्राप्त करता है, कम प्रदर्शन कर सकता है।</>
            : <><strong>Bhavabala</strong> = <strong>Bhavadhipati Bala</strong> (lord&apos;s Shadbala contribution) + <strong>Bhava Dig Bala</strong> (inherent positional strength of the house) + <strong>Bhava Drishti Bala</strong> (net aspects received by the house). A house with a weak lord but strong benefic aspects (Jupiter aspecting the 7th, for example) can still function well. Conversely, a house whose lord has excellent Shadbala but receives Saturn&apos;s and Mars&apos;s aspects may underperform.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उद्गम' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>भावबल BPHS (बृहत् पाराशर होरा शास्त्र) में षड्बल के स्वाभाविक विस्तार के रूप में परिभाषित है। पराशर ने पहचाना कि केवल ग्रह शक्ति जानना अपर्याप्त है &mdash; ज्योतिषी को यह भी जानना चाहिए कि कौन-से जीवन क्षेत्र बलवान या दुर्बल हैं। त्रिपक्षीय सूत्र (स्वामी बल + स्थिति गरिमा + दृष्टि प्रभाव) उन तीन तरीकों को सुन्दर रूप से पकड़ता है जिनसे भाव शक्ति प्राप्त कर सकता है।</>
            : <>Bhavabala is defined in BPHS (Brihat Parashara Hora Shastra) as a natural extension of Shadbala. Parashara recognized that knowing planetary strength alone is insufficient &mdash; the astrologer must also know which life domains are strong or weak. The tripartite formula (lord strength + positional dignity + aspectual influence) elegantly captures the three ways a house can derive power, mirroring the holistic approach of Vedic philosophy.</>}
        </p>
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
          {isHi ? 'प्रत्येक घटक की गणना' : 'Computing Each Component'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>भावाधिपति बल:</strong> स्वामी के कुल षड्बल को आनुपातिकता गुणक से मापकर भाव में उसका योगदान निकाला जाता है। यदि सप्तमेश (जैसे शुक्र) का कुल षड्बल 400 षष्ट्यंश है, तो उसका भावाधिपति योगदान आनुपातिक रूप से उच्च है। यदि वही स्वामी केवल 200 अंकित है, तो भाव कमजोर नींव से आरम्भ होता है।</>
            : <><strong>Bhavadhipati Bala:</strong> The lord&apos;s total Shadbala is scaled by a proportionality factor to derive its contribution to the house. If the 7th lord (Venus, for example) has a total Shadbala of 400 shashtiamsas, its Bhavadhipati contribution is proportionally high. If the same lord scores only 200, the house starts with a weaker foundation.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>भाव दिग्बल:</strong> भावों की अन्तर्निहित स्थिति शक्ति होती है। प्रथम और सप्तम भाव (क्षितिज अक्ष) अन्तर्निहित रूप से सबसे बलवान हैं। चतुर्थ और दशम (याम्योत्तर अक्ष) उसके बाद। दुःस्थान भाव (6, 8, 12) की अन्तर्निहित दिग्बल सबसे कम है। यह एक स्थिर संरचनात्मक घटक है जो कुण्डलियों में नहीं बदलता।</>
            : <><strong>Bhava Dig Bala:</strong> Houses have inherent positional strength. The 1st and 7th houses (the horizon axis) are inherently strongest. The 4th and 10th (meridian axis) follow. The dusthana houses (6th, 8th, 12th) have the lowest inherent Dig Bala. This is a fixed structural component that does not change between charts.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यरत उदाहरण: विवाह हेतु सप्तम भाव' : 'Worked Example: 7th House for Marriage'}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 12: [5], 5: [4], 3: [6] }}
          title={isHi ? 'मेष लग्न — शुक्र मीन में (12वें), बृहस्पति 5वें में, शनि 3रे में' : 'Aries Lagna — Venus in Pisces (12th), Jupiter in 5th, Saturn in 3rd'}
          highlight={[7, 12]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Chart: Aries Lagna, 7th lord Venus in Pisces (exalted), Jupiter aspects the 7th house, Saturn also aspects the 7th.</span>
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">Bhavadhipati Bala: Venus (exalted, strong Shadbala ~420) contributes high lord strength &mdash; approximately 70 shashtiamsas scaled.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">Bhava Dig Bala: 7th house = horizon axis = inherently strong &mdash; approximately 50 shashtiamsas.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">Bhava Drishti Bala: Jupiter full aspect = +60, Saturn full aspect = -60, net = 0 shashtiamsas.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2 font-medium">
          {isHi
            ? <><span className="text-gold-light">कुल सप्तम भावबल: ~120 षष्ट्यंश।</span> मध्यम-से-अच्छा। विवाह बलवान स्वामी द्वारा समर्थित है, पर बृहस्पति की सुरक्षा के बावजूद शनि की दृष्टि कुछ विलम्ब कर सकती है।</>
            : <>Total 7th Bhavabala: ~120 shashtiamsas. Moderate-to-good. Marriage is supported by the strong lord, but Saturn&apos;s aspect may cause some delays despite Jupiter&apos;s protection.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'सामान्य भ्रम' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>एक सामान्य त्रुटि भाव शक्ति को उसमें स्थित ग्रहों की संख्या से समकक्ष करना है। तीन ग्रहों वाला भाव स्वतः उस रिक्त भाव से बलवान नहीं है जिसके स्वामी का उत्कृष्ट षड्बल हो और बृहस्पति की दृष्टि प्राप्त हो। अधिभोग भाव में सक्रियता बनाता है, पर भावबल भाव की सकारात्मक परिणाम देने की अन्तर्निहित क्षमता मापता है। पापी ग्रहों से भरा भाव वास्तव में सुदृष्ट रिक्त भाव से कम भावबल रख सकता है।</>
            : <>A frequent error is equating house strength with the number of planets occupying it. A house with three planets in it is not automatically stronger than an empty house whose lord has excellent Shadbala and receives Jupiter&apos;s aspect. Occupancy creates activity in a house, but Bhavabala measures the house&apos;s inherent capacity to deliver positive results. An overcrowded house with malefic occupants can actually have lower Bhavabala than a well-aspected empty house.</>}
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
          {isHi ? 'व्यावहारिक व्याख्या' : 'Practical Interpretation'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>कुण्डली का सबसे बलवान भाव सबसे अधिक स्वाभाविक सफलता के जीवन क्षेत्र को दर्शाता है &mdash; वह क्षेत्र जहाँ कार्य न्यूनतम प्रतिरोध से प्रवाहित होते हैं। यदि दशम भाव अग्रणी है तो करियर सहज आता है। यदि द्वितीय भाव सबसे बलवान है तो धन संचय स्वाभाविक है। सबसे दुर्बल भाव इंगित करता है कि जातक को कहाँ सबसे अधिक सचेत प्रयास और उपचारात्मक उपाय (मन्त्र, रत्न, दान) करने चाहिए।</>
            : <>The strongest Bhava in a chart reveals the life area of greatest natural success &mdash; the domain where things flow with minimal resistance. If the 10th house leads, career comes easily. If the 2nd house is strongest, wealth accumulation is natural. The weakest Bhava indicates where the native must invest the most conscious effort and where remedial measures (mantras, gemstones, charitable acts) can have the greatest impact.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>एक ही लग्न की दो कुण्डलियों की तुलना इसे शक्तिशाली रूप से दर्शाती है। व्यक्ति A (मेष लग्न) का सप्तम भाव बलवान (उच्च शुक्र स्वामी, बृहस्पति दृष्टि) और दशम दुर्बल (नीच शनि स्वामी, शुभ दृष्टि नहीं) हो सकता है। व्यक्ति B (भी मेष लग्न) इसका विपरीत दिखा सकता है। एक ही लग्न, विवाह बनाम करियर में पूर्णतया भिन्न जीवन अनुभव, सब भावबल वितरण द्वारा व्याख्यायित।</>
            : <>Comparing two charts with the same lagna illustrates this powerfully. Person A (Aries lagna) may have a strong 7th house (exalted Venus as lord, Jupiter aspecting) and a weak 10th (Saturn debilitated as lord, no benefic aspects). Person B (also Aries lagna) may show the reverse. Same lagna, completely different life experiences in marriage versus career, all explained by Bhavabala distribution.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>भावबल कुण्डली व्याख्या को अस्पष्ट सामान्यीकरण (&ldquo;आपका सप्तम भाव ठीक है&rdquo;) से सटीक परिमाणित मूल्यांकन (&ldquo;आपका सप्तम भाव 142 षष्ट्यंश अंकित है, 12 भावों में तीसरे स्थान पर&rdquo;) में बदलता है। हमारा ऐप कुण्डली बल टैब में षड्बल के साथ भावबल की गणना करता है, जिससे उपयोगकर्ता शीघ्र अपने सबसे बलवान और दुर्बल जीवन क्षेत्रों की पहचान कर सकते हैं। यह अधिक लक्षित टिप्पणी विवरण को शक्ति देता है।</>
            : <>Bhavabala transforms Kundali interpretation from vague generalizations (&ldquo;your 7th house is okay&rdquo;) into precise quantified assessments (&ldquo;your 7th house scores 142 shashtiamsas, ranking 3rd among your 12 houses&rdquo;). Our app computes Bhavabala alongside Shadbala in the Kundali strength tab, allowing users to quickly identify their strongest and weakest life domains. This powers more targeted Tippanni commentary &mdash; instead of covering all 12 houses equally, the narrative prioritizes the houses that matter most in a particular chart.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module18_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
