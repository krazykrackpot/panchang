'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_19_2', phase: 6, topic: 'Jaimini', moduleNumber: '19.2',
  title: { en: 'Rashi Drishti — Sign-Based Aspects', hi: 'राशि दृष्टि — राशि-आधारित दृष्टियाँ' },
  subtitle: {
    en: 'Jaimini\'s aspect system where entire signs aspect entire signs — no orbs, no partial aspects, radically different from Parashari',
    hi: 'जैमिनी की दृष्टि पद्धति जहाँ सम्पूर्ण राशियाँ सम्पूर्ण राशियों को दृष्ट करती हैं — कोई ओर्ब नहीं, कोई आंशिक दृष्टि नहीं, पाराशरी से मूलतः भिन्न',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 19-1: Chara Karakas', hi: 'मॉड्यूल 19-1: चर कारक' }, href: '/learn/modules/19-1' },
    { label: { en: 'Module 19-3: Argala', hi: 'मॉड्यूल 19-3: अर्गला' }, href: '/learn/modules/19-3' },
    { label: { en: 'Module 11-2: Planetary Aspects (Parashari)', hi: 'मॉड्यूल 11-2: ग्रह दृष्टि (पाराशरी)' }, href: '/learn/modules/11-2' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q19_2_01', type: 'mcq',
    question: {
      en: 'In Jaimini\'s Rashi Drishti, which signs do movable (Chara) signs aspect?',
      hi: 'जैमिनी की राशि दृष्टि में चर राशियाँ किन राशियों को दृष्ट करती हैं?',
    },
    options: [
      { en: 'All other movable signs', hi: 'सभी अन्य चर राशियों को' },
      { en: 'All fixed signs except the adjacent one', hi: 'निकटवर्ती को छोड़कर सभी स्थिर राशियों को' },
      { en: 'All dual signs', hi: 'सभी द्विस्वभाव राशियों को' },
      { en: 'The 7th sign only', hi: 'केवल सप्तम राशि को' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Movable signs (Aries, Cancer, Libra, Capricorn) aspect all fixed signs (Taurus, Leo, Scorpio, Aquarius) except the one adjacent to them. For example, Aries aspects Leo, Scorpio, and Aquarius — but not Taurus (which is adjacent).',
      hi: 'चर राशियाँ (मेष, कर्क, तुला, मकर) सभी स्थिर राशियों (वृषभ, सिंह, वृश्चिक, कुम्भ) को दृष्ट करती हैं — निकटवर्ती को छोड़कर। उदाहरणार्थ, मेष सिंह, वृश्चिक और कुम्भ को दृष्ट करता है — किन्तु वृषभ (निकटवर्ती) को नहीं।',
    },
  },
  {
    id: 'q19_2_02', type: 'mcq',
    question: {
      en: 'Which signs do fixed (Sthira) signs aspect?',
      hi: 'स्थिर राशियाँ किन राशियों को दृष्ट करती हैं?',
    },
    options: [
      { en: 'All other fixed signs', hi: 'सभी अन्य स्थिर राशियों को' },
      { en: 'All dual signs except the adjacent one', hi: 'निकटवर्ती को छोड़कर सभी द्विस्वभाव राशियों को' },
      { en: 'All movable signs except the adjacent one', hi: 'निकटवर्ती को छोड़कर सभी चर राशियों को' },
      { en: 'Only the opposite sign', hi: 'केवल विपरीत राशि को' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Fixed signs (Taurus, Leo, Scorpio, Aquarius) aspect all movable signs (Aries, Cancer, Libra, Capricorn) except the adjacent one. For example, Taurus aspects Cancer, Libra, and Capricorn — but not Aries (adjacent).',
      hi: 'स्थिर राशियाँ (वृषभ, सिंह, वृश्चिक, कुम्भ) सभी चर राशियों (मेष, कर्क, तुला, मकर) को दृष्ट करती हैं — निकटवर्ती को छोड़कर। उदाहरणार्थ, वृषभ कर्क, तुला और मकर को दृष्ट करता है — किन्तु मेष (निकटवर्ती) को नहीं।',
    },
  },
  {
    id: 'q19_2_03', type: 'true_false',
    question: {
      en: 'In Jaimini Rashi Drishti, a planet at 1° of Aries has a weaker aspect than a planet at 29° of Aries.',
      hi: 'जैमिनी राशि दृष्टि में मेष 1° का ग्रह मेष 29° के ग्रह से कमज़ोर दृष्टि रखता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Jaimini aspects are "whole sign" — there are no orbs and no gradation based on degree. A planet at 1° of a sign has exactly the same Rashi Drishti as a planet at 29° of that sign. This is fundamentally different from Parashari aspects where orb matters.',
      hi: 'असत्य। जैमिनी दृष्टियाँ "सम्पूर्ण राशि" हैं — कोई ओर्ब नहीं और अंश पर आधारित कोई श्रेणीकरण नहीं। किसी राशि में 1° का ग्रह उसी राशि में 29° के ग्रह के बिल्कुल समान राशि दृष्टि रखता है। यह पाराशरी दृष्टियों से मूलतः भिन्न है जहाँ ओर्ब महत्त्वपूर्ण होता है।',
    },
  },
  {
    id: 'q19_2_04', type: 'mcq',
    question: {
      en: 'How do dual (Dvisabhava) signs aspect in Jaimini?',
      hi: 'जैमिनी में द्विस्वभाव राशियाँ कैसे दृष्ट करती हैं?',
    },
    options: [
      { en: 'They aspect all movable signs', hi: 'वे सभी चर राशियों को दृष्ट करती हैं' },
      { en: 'They aspect all fixed signs', hi: 'वे सभी स्थिर राशियों को दृष्ट करती हैं' },
      { en: 'They aspect each other (all other dual signs)', hi: 'वे एक-दूसरे को दृष्ट करती हैं (सभी अन्य द्विस्वभाव राशियों को)' },
      { en: 'They have no aspects', hi: 'उनकी कोई दृष्टि नहीं होती' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Dual signs (Gemini, Virgo, Sagittarius, Pisces) aspect each other. Gemini aspects Virgo, Sagittarius, and Pisces — and vice versa. This is the simplest rule: duals see duals.',
      hi: 'द्विस्वभाव राशियाँ (मिथुन, कन्या, धनु, मीन) एक-दूसरे को दृष्ट करती हैं। मिथुन कन्या, धनु और मीन को दृष्ट करता है — और इसका विपरीत भी। यह सरलतम नियम है: द्विस्वभाव द्विस्वभाव को देखते हैं।',
    },
  },
  {
    id: 'q19_2_05', type: 'true_false',
    question: {
      en: 'Jaimini Rashi Drishti should be used alongside Vimshottari Dasha for best results.',
      hi: 'सर्वोत्तम परिणामों के लिए जैमिनी राशि दृष्टि का प्रयोग विंशोत्तरी दशा के साथ करना चाहिए।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Jaimini Rashi Drishti is designed to work with Jaimini\'s own dasha systems, particularly Char Dasha (Rashi-based dashas). Vimshottari Dasha is a Parashari technique that uses Parashari aspects. Mixing the two systems without care can lead to confusion.',
      hi: 'असत्य। जैमिनी राशि दृष्टि जैमिनी की अपनी दशा पद्धतियों के साथ कार्य करने के लिए बनी है, विशेषकर चर दशा (राशि-आधारित दशा)। विंशोत्तरी दशा पाराशरी तकनीक है जो पाराशरी दृष्टियों का प्रयोग करती है। बिना सावधानी के दोनों पद्धतियों को मिलाना भ्रम पैदा कर सकता है।',
    },
  },
  {
    id: 'q19_2_06', type: 'mcq',
    question: {
      en: 'Aries is a movable sign. Which fixed sign does it NOT aspect?',
      hi: 'मेष एक चर राशि है। यह किस स्थिर राशि को दृष्ट नहीं करती?',
    },
    options: [
      { en: 'Leo', hi: 'सिंह' },
      { en: 'Scorpio', hi: 'वृश्चिक' },
      { en: 'Taurus', hi: 'वृषभ' },
      { en: 'Aquarius', hi: 'कुम्भ' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Aries (movable) aspects all fixed signs except the adjacent one. Taurus is adjacent to Aries, so Aries does NOT aspect Taurus. Aries aspects Leo, Scorpio, and Aquarius.',
      hi: 'मेष (चर) सभी स्थिर राशियों को दृष्ट करता है — निकटवर्ती को छोड़कर। वृषभ मेष से निकटवर्ती है, अतः मेष वृषभ को दृष्ट नहीं करता। मेष सिंह, वृश्चिक और कुम्भ को दृष्ट करता है।',
    },
  },
  {
    id: 'q19_2_07', type: 'mcq',
    question: {
      en: 'In Parashari astrology, Mars has special aspects on the 4th, 7th, and 8th houses. In Jaimini:',
      hi: 'पाराशरी ज्योतिष में मंगल की चौथे, सातवें और आठवें भाव पर विशेष दृष्टि है। जैमिनी में:',
    },
    options: [
      { en: 'Mars retains its special aspects', hi: 'मंगल अपनी विशेष दृष्टियाँ रखता है' },
      { en: 'Mars aspects are determined by the sign it occupies, not its own nature', hi: 'मंगल की दृष्टियाँ उसकी राशि से निर्धारित होती हैं, उसके स्वभाव से नहीं' },
      { en: 'Mars has no aspects in Jaimini', hi: 'जैमिनी में मंगल की कोई दृष्टि नहीं' },
      { en: 'Mars only aspects the 7th sign', hi: 'मंगल केवल सप्तम राशि को दृष्ट करता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'In Jaimini, individual planet aspects do not exist. Instead, the sign a planet occupies determines its aspects. Mars in Aries (movable) aspects Leo, Scorpio, and Aquarius. Mars in Taurus (fixed) aspects Cancer, Libra, and Capricorn. The sign rules, not the planet.',
      hi: 'जैमिनी में व्यक्तिगत ग्रह दृष्टि नहीं होती। इसके बजाय, ग्रह जिस राशि में है वह उसकी दृष्टियाँ निर्धारित करती है। मेष (चर) में मंगल सिंह, वृश्चिक और कुम्भ को दृष्ट करता है। वृषभ (स्थिर) में मंगल कर्क, तुला और मकर को। राशि शासन करती है, ग्रह नहीं।',
    },
  },
  {
    id: 'q19_2_08', type: 'true_false',
    question: {
      en: 'Rashi Drishti is mutual: if Aries aspects Leo, then Leo also aspects Aries.',
      hi: 'राशि दृष्टि पारस्परिक है: यदि मेष सिंह को दृष्ट करता है, तो सिंह भी मेष को दृष्ट करता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Aries (movable) aspects fixed signs including Leo. Leo (fixed) aspects movable signs including Aries. The exception rule also works mutually — Aries doesn\'t aspect Taurus, and Taurus doesn\'t aspect Aries. All Jaimini aspects are inherently mutual.',
      hi: 'सत्य। मेष (चर) स्थिर राशियों को दृष्ट करता है जिसमें सिंह सम्मिलित है। सिंह (स्थिर) चर राशियों को दृष्ट करता है जिसमें मेष सम्मिलित। अपवाद नियम भी पारस्परिक कार्य करता है — मेष वृषभ को दृष्ट नहीं करता, और वृषभ मेष को नहीं। सभी जैमिनी दृष्टियाँ स्वाभाविक रूप से पारस्परिक हैं।',
    },
  },
  {
    id: 'q19_2_09', type: 'mcq',
    question: {
      en: 'How many signs does a movable sign aspect in the Rashi Drishti system?',
      hi: 'राशि दृष्टि पद्धति में एक चर राशि कितनी राशियों को दृष्ट करती है?',
    },
    options: [
      { en: '1', hi: '1' },
      { en: '3', hi: '3' },
      { en: '4', hi: '4' },
      { en: '6', hi: '6' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A movable sign aspects 3 fixed signs (all 4 fixed signs minus the adjacent one). Similarly, a fixed sign aspects 3 movable signs, and a dual sign aspects 3 other dual signs.',
      hi: 'एक चर राशि 3 स्थिर राशियों को दृष्ट करती है (कुल 4 स्थिर राशियों में से निकटवर्ती घटाकर)। इसी प्रकार, स्थिर राशि 3 चर राशियों को, और द्विस्वभाव राशि 3 अन्य द्विस्वभाव राशियों को दृष्ट करती है।',
    },
  },
  {
    id: 'q19_2_10', type: 'mcq',
    question: {
      en: 'Saturn is in Scorpio (a fixed sign). Jupiter is in Libra (a movable sign). Do they aspect each other via Rashi Drishti?',
      hi: 'शनि वृश्चिक (स्थिर राशि) में है। बृहस्पति तुला (चर राशि) में है। क्या वे राशि दृष्टि से एक-दूसरे को दृष्ट करते हैं?',
    },
    options: [
      { en: 'Yes, mutually', hi: 'हाँ, पारस्परिक रूप से' },
      { en: 'Only Saturn aspects Jupiter, not vice versa', hi: 'केवल शनि बृहस्पति को दृष्ट करता है, उल्टा नहीं' },
      { en: 'No, because Scorpio and Libra are adjacent (exception rule)', hi: 'नहीं, क्योंकि वृश्चिक और तुला निकटवर्ती हैं (अपवाद नियम)' },
      { en: 'Only Jupiter aspects Saturn', hi: 'केवल बृहस्पति शनि को दृष्ट करता है' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'No. Scorpio (fixed) aspects all movable signs except the adjacent one. Libra is adjacent to Scorpio, so Scorpio does NOT aspect Libra. Similarly, Libra (movable) would aspect fixed signs except adjacent Scorpio. The adjacency exception blocks this aspect both ways.',
      hi: 'नहीं। वृश्चिक (स्थिर) सभी चर राशियों को दृष्ट करता है — निकटवर्ती को छोड़कर। तुला वृश्चिक से निकटवर्ती है, अतः वृश्चिक तुला को दृष्ट नहीं करता। इसी प्रकार, तुला (चर) निकटवर्ती वृश्चिक को छोड़कर स्थिर राशियों को दृष्ट करेगा। निकटता का अपवाद दोनों दिशाओं में इस दृष्टि को अवरुद्ध करता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'राशियाँ राशियों को दृष्ट करती हैं' : 'Signs Aspect Signs'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पाराशरी ज्योतिष में ग्रह अन्य ग्रहों और भावों को दृष्ट करते हैं। मंगल की विशेष चौथी, सातवीं और आठवीं दृष्टि है; बृहस्पति की पाँचवीं, सातवीं और नौवीं; शनि की तीसरी, सातवीं और दसवीं। ये ग्रह दृष्टियाँ स्वयं ग्रह में निहित हैं। जैमिनी ने इस सम्पूर्ण पद्धति को त्यागकर कुछ मूलतः भिन्न प्रस्तुत किया: <strong>राशियाँ राशियों को दृष्ट करती हैं</strong>। राशि दृष्टि में इससे कोई अन्तर नहीं पड़ता कि कौन-सा ग्रह है — महत्त्वपूर्ण यह है कि वह किस राशि में है। एक राशि के सभी ग्रह समान दृष्टियाँ साझा करते हैं।</>
            : <>In Parashari astrology, planets aspect other planets and houses. Mars has a special 4th, 7th, and 8th aspect; Jupiter has a 5th, 7th, and 9th; Saturn has a 3rd, 7th, and 10th. These planetary aspects are inherent to the planet itself. Jaimini threw out this entire system and replaced it with something radically different: <strong>signs aspect signs</strong>. In Rashi Drishti, it does not matter which planet is involved — what matters is which sign it occupies. All planets in a sign share the same aspects.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>नियम सुरुचिपूर्ण और सरल हैं। 12 राशियाँ तीन समूहों में वर्गीकृत हैं: <strong>चर</strong> — मेष, कर्क, तुला, मकर; <strong>स्थिर</strong> — वृषभ, सिंह, वृश्चिक, कुम्भ; <strong>द्विस्वभाव</strong> — मिथुन, कन्या, धनु, मीन। चर राशियाँ सभी स्थिर राशियों को दृष्ट करती हैं — निकटवर्ती को छोड़कर। स्थिर राशियाँ सभी चर राशियों को दृष्ट करती हैं — निकटवर्ती को छोड़कर। द्विस्वभाव राशियाँ एक-दूसरे को दृष्ट करती हैं।</>
            : <>The rules are elegant and simple. The 12 signs are classified into three groups: <strong>Movable (Chara)</strong> — Aries, Cancer, Libra, Capricorn; <strong>Fixed (Sthira)</strong> — Taurus, Leo, Scorpio, Aquarius; <strong>Dual (Dvisabhava)</strong> — Gemini, Virgo, Sagittarius, Pisces. Movable signs aspect all fixed signs except the adjacent one. Fixed signs aspect all movable signs except the adjacent one. Dual signs aspect each other.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'सम्पूर्ण दृष्टि सारणी' : 'Complete Aspect Table'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Aries (Movable):</span> aspects Leo, Scorpio, Aquarius (not Taurus)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Cancer (Movable):</span> aspects Taurus, Scorpio, Aquarius (not Leo)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Libra (Movable):</span> aspects Taurus, Leo, Aquarius (not Scorpio)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Capricorn (Movable):</span> aspects Taurus, Leo, Scorpio (not Aquarius)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Taurus (Fixed):</span> aspects Cancer, Libra, Capricorn (not Aries)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Leo (Fixed):</span> aspects Aries, Libra, Capricorn (not Cancer)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Scorpio (Fixed):</span> aspects Aries, Cancer, Capricorn (not Libra)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Aquarius (Fixed):</span> aspects Aries, Cancer, Libra (not Capricorn)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Dual signs:</span> Gemini, Virgo, Sagittarius, Pisces all aspect each other mutually.
        </p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'राशि दृष्टि भिन्न प्रतिरूप क्यों बनाती है' : 'Why Rashi Drishti Creates Different Patterns'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>एक कुण्डली पर विचार करें जिसमें मंगल मेष में और शुक्र वृश्चिक में है। पाराशरी में मंगल मेष से चौथे (कर्क), सातवें (तुला) और आठवें (वृश्चिक) को दृष्ट करता है — अतः मंगल वृश्चिक में शुक्र को दृष्ट करता है। शुक्र की केवल सातवीं दृष्टि वृश्चिक से वृषभ पर है — शुक्र मेष में मंगल को दृष्ट नहीं करता। सम्बन्ध एकदिशीय है। जैमिनी में, मेष (चर) सिंह, वृश्चिक और कुम्भ को दृष्ट करता है — मेष के सभी ग्रह वृश्चिक के सभी ग्रहों को दृष्ट करते हैं। वृश्चिक (स्थिर) मेष, कर्क और मकर को दृष्ट करता है — वृश्चिक के सभी ग्रह मेष के सभी ग्रहों को दृष्ट करते हैं। सम्बन्ध पारस्परिक और पूर्ण है।</>
            : <>Consider a chart with Mars in Aries and Venus in Scorpio. In Parashari astrology, Mars aspects the 4th (Cancer), 7th (Libra), and 8th (Scorpio) from Aries — so Mars aspects Venus in Scorpio. Venus has only a 7th aspect from Scorpio to Taurus — Venus does NOT aspect Mars in Aries. The relationship is one-directional. In Jaimini, Aries (movable) aspects Leo, Scorpio, and Aquarius — ALL planets in Aries aspect ALL planets in Scorpio. Scorpio (fixed) aspects Aries, Cancer, and Capricorn — ALL planets in Scorpio aspect ALL planets in Aries. The relationship is mutual and total.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          This means that Jaimini aspects create broader webs of mutual influence. Where Parashari might show a one-sided power dynamic (Mars dominates Venus through its special aspect), Jaimini shows a mutual exchange. This fundamentally changes how relationships, conflicts, and collaborations are interpreted in the chart.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित तुलना' : 'Worked Comparison'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Chart:</span> Sun and Mercury in Gemini, Mars in Virgo, Jupiter in Sagittarius, Venus in Pisces.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Parashari:</span> Mars in Virgo aspects 4th (Sagittarius = Jupiter), 7th (Pisces = Venus), 8th (Aries = empty). Jupiter in Sagittarius aspects 5th (Aries = empty), 7th (Gemini = Sun/Mercury), 9th (Leo = empty). Many relationships are one-directional.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">जैमिनी:</span> चारों राशियाँ (मिथुन, कन्या, धनु, मीन) द्विस्वभाव हैं। द्विस्वभाव राशियाँ एक-दूसरे को दृष्ट करती हैं। अतः इस कुण्डली के सभी ग्रह पारस्परिक रूप से सभी अन्य ग्रहों को दृष्ट करते हैं — एक पूर्णतया अन्तर्सम्बद्ध जाल।</>
            : <><span className="text-gold-light font-medium">Jaimini:</span> All four signs (Gemini, Virgo, Sagittarius, Pisces) are dual signs. Dual signs aspect each other. Therefore, ALL planets in this chart mutually aspect ALL other planets. Sun/Mercury see Mars, Jupiter, Venus — and all see them back. A completely interconnected web.</>}
        </p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'चर दशा के साथ व्यावहारिक अनुप्रयोग' : 'Practical Application with Char Dasha'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जैमिनी दृष्टियाँ जैमिनी की अपनी समय पद्धति के साथ कार्य करने के लिए बनी हैं — मुख्यतः चर दशा (राशि दशा भी कहलाती है)। चर दशा में प्रत्येक अवधि एक राशि (ग्रह नहीं) द्वारा शासित होती है। मेष दशा में, उदाहरणार्थ, आप मेष और राशि दृष्टि से मेष द्वारा दृष्ट सभी राशियों (सिंह, वृश्चिक, कुम्भ) के फल का मूल्यांकन करते हैं। उन दृष्ट राशियों के ग्रह मेष दशा काल को प्रभावित करेंगे। यह विंशोत्तरी + पाराशरी दृष्टियों से मूलतः भिन्न भविष्यवाणी ढाँचा बनाता है।</>
            : <>Jaimini aspects are designed to work with Jaimini&apos;s own timing system — primarily Char Dasha (also called Chara Dasha or Rashi Dasha). In Char Dasha, each period is ruled by a sign (not a planet). During the Aries dasha, for instance, you evaluate the results of Aries and all signs that Aries aspects via Rashi Drishti (Leo, Scorpio, Aquarius). Planets in those aspected signs will influence the Aries dasha period. This creates a fundamentally different predictive framework from Vimshottari + Parashari aspects.</>}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'सम्पूर्ण-राशि स्वभाव — कोई ओर्ब नहीं' : 'Whole-Sign Nature — No Orbs'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जैमिनी पद्धति का सम्भवतः सबसे मुक्तिदायक पहलू ओर्ब का उन्मूलन है। पाराशरी ज्योतिष में बहुत विवाद इस पर केन्द्रित होता है कि युति &quot;निकट&quot; है या &quot;दूर&quot;, 8° या 10° अधिकतम ओर्ब होना चाहिए। जैमिनी इसे पूर्णतया टाल देता है। मेष में 1° का ग्रह मेष में 29° के ग्रह के ठीक समान राशि दृष्टि रखता है। कोई आंशिक दृष्टि नहीं, अंश द्वारा घटती शक्ति नहीं। या तो राशि दूसरी राशि को दृष्ट करती है, या नहीं करती। यह द्विचर सरलता जैमिनी दृष्टियों को शीघ्र गणना और स्पष्ट व्याख्या योग्य बनाती है।</>
            : <>Perhaps the most liberating aspect of Jaimini&apos;s system is the elimination of orbs. In Parashari astrology, much debate centers on whether a conjunction is &quot;tight&quot; or &quot;wide&quot;, whether 8° or 10° should be the maximum orb for a planetary aspect. Jaimini sidesteps this entirely. A planet at 1° of Aries has exactly the same Rashi Drishti as a planet at 29° of Aries. There are no partial aspects, no declining strength by degree. Either a sign aspects another sign, or it does not. This binary simplicity makes Jaimini aspects fast to compute and unambiguous to interpret.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;राशि दृष्टि पाराशरी दृष्टियों का प्रतिस्थापन है।&quot; कोई भी पद्धति दूसरी का प्रतिस्थापन नहीं करती। ये भिन्न ऋषियों के समान्तर ढाँचे हैं। पाराशरी दृष्टियों का प्रयोग विंशोत्तरी दशा और पाराशरी नियमों के साथ करें। राशि दृष्टि का प्रयोग चर दशा और जैमिनी नियमों के साथ। अनेक उन्नत ज्योतिषी दोनों पद्धतियों का प्रयोग पारस्परिक सत्यापन हेतु साथ-साथ करते हैं, किन्तु एक विश्लेषण श्रृंखला में कभी मिलाते नहीं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Rashi Drishti replaces Parashari aspects.&quot; Neither system replaces the other. They are parallel frameworks from different rishis. Use Parashari aspects with Vimshottari Dasha and Parashari rules. Use Rashi Drishti with Char Dasha and Jaimini rules. Many advanced astrologers use both systems side by side for cross-validation, but never mix them within a single analytical chain.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>जैमिनी राशि दृष्टि ने 21वीं शताब्दी में पुनरुत्थान देखा है, विशेषकर के.एन. राव और संजय रथ जैसे विद्वानों के कार्य से जिन्होंने आधुनिक अभ्यासकर्ताओं के लिए जैमिनी तकनीकों को व्यवस्थित किया। राशि-आधारित दृष्टियों की सरलता उन्हें कम्प्यूटरीकृत ज्योतिष के लिए उपयुक्त बनाती है — कोई अस्पष्ट ओर्ब गणना आवश्यक नहीं। हमारा कुण्डली इंजन राशि दृष्टि सम्बन्धों की तत्काल गणना कर सकता है, पारम्परिक पाराशरी दृष्टियों के साथ एक अतिरिक्त विश्लेषणात्मक परत प्रदान करता है।</>
            : <>Jaimini Rashi Drishti has seen a revival in the 21st century, particularly through the work of scholars like K.N. Rao and Sanjay Rath who have systematized Jaimini techniques for modern practitioners. The simplicity of sign-based aspects makes them well-suited for computerized astrology — no ambiguous orb calculations needed. Our Kundali engine can compute Rashi Drishti relationships instantly, providing an additional analytical layer alongside traditional Parashari aspects.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module19_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
