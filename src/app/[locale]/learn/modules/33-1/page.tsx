'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/33-1.json';

const META: ModuleMeta = {
  id: 'mod_33_1', phase: 4, topic: 'Yogas & Doshas', moduleNumber: '33.1',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/15-3' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/15-4' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/32-1' },
    { label: L.crossRefs[3].label as Record<string, string>, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q33_1_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q33_1_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q33_1_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q33_1_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q33_1_05', type: 'true_false',
    question: L.questions[4].question as Record<string, string>,
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — What is Manglik Dosha?                                    */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);

  const HOUSES = [
    { house: 1, nameEn: '1st house (Lagna)', nameHi: 'प्रथम भाव (लग्न)',
      descEn: 'Mars here makes the native aggressive and dominating in relationships. The fiery energy directed at the self creates ego clashes with partners. The native may be physically imposing and quick-tempered.',
      descHi: 'यहाँ मंगल जातक को रिश्तों में आक्रामक और प्रभुत्वशाली बनाता है। स्वयं पर निर्देशित अग्नि ऊर्जा साथी के साथ अहंकार के टकराव पैदा करती है। जातक शारीरिक रूप से प्रभावशाली और क्रोधी हो सकता है।' },
    { house: 2, nameEn: '2nd house (Dhana)', nameHi: 'द्वितीय भाव (धन)',
      descEn: 'Mars here disrupts family harmony. Speech becomes harsh and arguments frequent. Family wealth may fluctuate due to impulsive financial decisions. Dietary habits may be excessive or irregular.',
      descHi: 'यहाँ मंगल पारिवारिक सद्भाव को बाधित करता है। वाणी कठोर हो जाती है और तर्क-वितर्क बार-बार होता है। आवेगपूर्ण वित्तीय निर्णयों से पारिवारिक धन में उतार-चढ़ाव हो सकता है।' },
    { house: 4, nameEn: '4th house (Sukha)', nameHi: 'चतुर्थ भाव (सुख)',
      descEn: 'Mars here affects domestic peace. The home environment becomes tense and volatile. The relationship with the mother may be strained. Property matters can lead to disputes. Frequent changes of residence are common.',
      descHi: 'यहाँ मंगल गृह शान्ति को प्रभावित करता है। घर का वातावरण तनावपूर्ण और अस्थिर हो जाता है। माता से सम्बन्ध में तनाव हो सकता है। सम्पत्ति मामलों में विवाद और निवास में बार-बार परिवर्तन सम्भव है।' },
    { house: 7, nameEn: '7th house (Kalatra)', nameHi: 'सप्तम भाव (कलत्र)',
      descEn: 'This is the MOST severe placement. Mars directly occupies the house of marriage and partnerships. It creates intense physical attraction but also conflict, control issues, domination, and potential for separation. The spouse may be argumentative or the native may be overbearing.',
      descHi: 'यह सबसे गम्भीर स्थिति है। मंगल सीधे विवाह और साझेदारी के भाव में बैठता है। यह तीव्र शारीरिक आकर्षण लेकिन संघर्ष, नियन्त्रण समस्याएँ, प्रभुत्व और विच्छेद की सम्भावना बनाता है।' },
    { house: 8, nameEn: '8th house (Randhra)', nameHi: 'अष्टम भाव (रन्ध्र)',
      descEn: 'Mars here brings sudden events in married life. Health of the spouse may be affected. Inheritance disputes are possible. This placement often creates the most anxiety because the 8th house governs longevity, hidden matters, and sudden transformations.',
      descHi: 'यहाँ मंगल वैवाहिक जीवन में अचानक घटनाएँ लाता है। जीवनसाथी का स्वास्थ्य प्रभावित हो सकता है। विरासत विवाद सम्भव हैं। यह स्थिति सबसे अधिक चिन्ता उत्पन्न करती है क्योंकि अष्टम भाव आयु और अचानक परिवर्तन को नियन्त्रित करता है।' },
    { house: 12, nameEn: '12th house (Vyaya)', nameHi: 'द्वादश भाव (व्यय)',
      descEn: 'Mars here causes expenditure-related conflicts in marriage. Sexual incompatibility may arise. Foreign settlement after marriage is possible. The native may feel emotionally distant from the spouse or seek solitude.',
      descHi: 'यहाँ मंगल विवाह में व्यय-सम्बन्धी संघर्ष का कारण बनता है। यौन असंगतता उत्पन्न हो सकती है। विवाह के बाद विदेश में बसना सम्भव है। जातक जीवनसाथी से भावनात्मक दूरी अनुभव कर सकता है।' },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Is Manglik Dosha?', hi: 'मांगलिक दोष क्या है?', sa: 'माङ्गलिकदोषः किम्?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>मंगल (कुज) ग्रह आक्रामकता, जुनून, साहस और शारीरिक ऊर्जा का प्रतिनिधित्व करता है। जब मंगल लग्न, चन्द्र, या शुक्र से कुछ विशिष्ट भावों में बैठता है, तो यह मांगलिक दोष बनाता है — जिसे कुज दोष या चेव्वई दोषम (तमिल) भी कहते हैं।</>
            : <>Mars (Mangal/Kuja) represents aggression, passion, courage, and physical energy. When Mars occupies certain houses from the Lagna (Ascendant), Moon, or Venus, it creates Mangal Dosha — also known as Kuja Dosha or Chevvai Dosham (Tamil). This is one of the most commonly checked factors in Vedic marriage compatibility.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>परम्परागत वैदिक पद्धति में विवाह से पहले मांगलिक स्थिति का मिलान अनिवार्य माना जाता है। जब एक साथी मांगलिक हो और दूसरा न हो, तो मंगल की ऊर्जा असन्तुलन पैदा करती है — मांगलिक साथी की आक्रामक/जुनूनी ऊर्जा गैर-मांगलिक साथी को अभिभूत कर सकती है। जब दोनों साथी मांगलिक हों, तो ऊर्जाएँ एक-दूसरे को सन्तुलित करती हैं।</>
            : <>Traditional Vedic practice requires matching Manglik status before marriage. When one partner is Manglik and the other is not, the Mars energy creates an imbalance — the Manglik partner&apos;s aggressive and passionate energy can overwhelm the non-Manglik partner, leading to discord. When both partners are Manglik, the energies balance each other out.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Six Manglik Houses', hi: 'छह मांगलिक भाव', sa: 'षट् माङ्गलिकभावाः' }, locale)}
        </h4>
        <div className="grid gap-3">
          {HOUSES.map(h => (
            <div key={h.house} className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-lg p-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-sm font-bold ${h.house === 7 ? 'text-red-400' : 'text-gold-light'}`}>
                  {isHi ? h.nameHi : h.nameEn}
                </span>
                {h.house === 7 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 font-semibold">
                    {tl({ en: 'MOST SEVERE', hi: 'सर्वाधिक गम्भीर', sa: 'अत्यन्तं गम्भीरम्' }, locale)}
                  </span>
                )}
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi ? h.descHi : h.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-blue-500/15 rounded-xl p-5">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Statistics', hi: 'सांख्यिकी', sa: 'सांख्यिकी' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>लगभग 50% लोगों का मंगल इन 6 भावों में से किसी एक में होता है (12 में से 6 भाव)। इसका अर्थ है कि मांगलिक दोष अत्यन्त सामान्य है — इससे अत्यधिक भय नहीं होना चाहिए। मंगल की स्थिति, बल, दृष्टि और अन्य ग्रहों का प्रभाव सब मिलकर दोष की वास्तविक तीव्रता निर्धारित करते हैं।</>
            : <>Approximately 50% of people have Mars in one of these 6 houses (6 out of 12 houses). This means Manglik Dosha is VERY common — it should not cause excessive fear. Mars&apos;s sign placement, strength, aspects from other planets, and cancellation conditions all determine the actual severity of the dosha.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Cancellation Conditions (Dosha Bhanga)                    */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);

  /* Cancellation conditions — aligned with tippanni-engine.ts (lines 499-506):
     1. Mars in own sign (Aries/Scorpio) or exalted (Capricorn) — BPHS Ch.77
     2. Jupiter aspects Mars or 7th house — BPHS Ch.77
     3. Venus in kendra (1,4,7,10) — Phala Deepika
     4. Mars in Cancer or Leo sign — BPHS
     5. Saturn aspects Mars — Lal Kitab
     6. Both partners are Manglik (mutual cancellation) — Traditional */
  const CANCELLATIONS = [
    { titleEn: 'Mars in own sign (Aries/Scorpio) or exalted (Capricorn)', titleHi: 'मंगल स्वराशि (मेष/वृश्चिक) या उच्च (मकर) में', source: 'BPHS Ch.77',
      descEn: 'Mars is comfortable and controlled in its own signs. Its aggressive energy is channeled constructively rather than destructively. An exalted Mars in Capricorn is disciplined and mature, directing energy toward achievement. This is the strongest cancellation condition.',
      descHi: 'मंगल अपनी राशियों में सहज और नियन्त्रित होता है। उसकी आक्रामक ऊर्जा विनाशकारी नहीं बल्कि रचनात्मक रूप से उपयोग होती है। मकर में उच्च मंगल अनुशासित और परिपक्व होता है। यह सबसे प्रबल निरसन शर्त है।' },
    { titleEn: 'Jupiter aspects Mars or the 7th house', titleHi: 'गुरु मंगल या 7वें भाव को देखे', source: 'BPHS Ch.77',
      descEn: 'Jupiter\'s benevolent aspect (5th, 7th, or 9th from Jupiter) calms Mars. This is considered a powerful cancellation — Jupiter\'s wisdom tempers Mars\'s aggression. When Jupiter also aspects the 7th house, the marriage house receives divine protection.',
      descHi: 'गुरु की शुभ दृष्टि (गुरु से 5, 7, या 9वीं) मंगल को शान्त करती है। यह एक शक्तिशाली निरसन माना जाता है — गुरु की बुद्धि मंगल की आक्रामकता को नियन्त्रित करती है। जब गुरु 7वें भाव को भी देखता है, तो विवाह भाव को दैवीय सुरक्षा मिलती है।' },
    { titleEn: 'Venus in kendra (1st, 4th, 7th, or 10th house)', titleHi: 'शुक्र केन्द्र में (1, 4, 7, या 10वें भाव में)', source: 'Phala Deepika',
      descEn: 'Venus is the natural significator of marriage and romance. When Venus occupies a kendra (angular) house, it is strong enough to counterbalance Mars\'s disruptive influence on married life. Venus softens Mars\'s sharp edges with harmony and romance.',
      descHi: 'शुक्र विवाह और प्रेम का नैसर्गिक कारक है। जब शुक्र केन्द्र (कोणीय) भाव में होता है, तो यह मंगल के वैवाहिक जीवन पर विघटनकारी प्रभाव को सन्तुलित कर सकता है। शुक्र सद्भाव और प्रेम से मंगल की तीक्ष्णता को शान्त करता है।' },
    { titleEn: 'Mars in Cancer or Leo sign', titleHi: 'मंगल कर्क या सिंह राशि में', source: 'BPHS',
      descEn: 'Mars in Cancer (Moon\'s sign) becomes emotionally sensitive rather than purely aggressive. Mars in Leo (Sun\'s sign) gains royal dignity and expresses its energy through leadership rather than conflict. In both cases, the martial energy is redirected.',
      descHi: 'कर्क (चन्द्र की राशि) में मंगल आक्रामक होने के बजाय भावनात्मक रूप से संवेदनशील हो जाता है। सिंह (सूर्य की राशि) में मंगल राजसी गरिमा प्राप्त करता है और अपनी ऊर्जा संघर्ष के बजाय नेतृत्व के माध्यम से व्यक्त करता है।' },
    { titleEn: 'Saturn aspects Mars', titleHi: 'शनि मंगल को देखे', source: 'Lal Kitab',
      descEn: 'Saturn\'s disciplining aspect (3rd, 7th, or 10th from Saturn) restricts Mars\'s impulsive energy. While Saturn-Mars aspects can create tension, in the context of Manglik cancellation, Saturn\'s restraint prevents Mars from causing relationship damage.',
      descHi: 'शनि की अनुशासनकारी दृष्टि (शनि से 3, 7, या 10वीं) मंगल की आवेगपूर्ण ऊर्जा को नियन्त्रित करती है। मांगलिक निरसन के सन्दर्भ में, शनि का नियन्त्रण मंगल को सम्बन्धों में हानि पहुँचाने से रोकता है।' },
    { titleEn: 'Both partners are Manglik (mutual cancellation)', titleHi: 'दोनों साथी मांगलिक (पारस्परिक निरसन)', source: 'Traditional',
      descEn: 'When both prospective partners have Manglik Dosha, the Mars energies cancel each other out — fire meets fire, creating balance rather than imbalance. This is the most common practical solution and is widely accepted across all traditions of Jyotish.',
      descHi: 'जब दोनों सम्भावित साथियों में मांगलिक दोष हो, तो मंगल की ऊर्जाएँ एक-दूसरे को सन्तुलित करती हैं — अग्नि अग्नि से मिलती है, असन्तुलन के बजाय सन्तुलन बनाती है। यह सबसे सामान्य व्यावहारिक समाधान है।' },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Cancellation Conditions (Dosha Bhanga)', hi: 'निरसन शर्तें (दोष भंग)', sa: 'दोषभङ्गशर्ताः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {isHi
            ? <>BPHS, फलदीपिका, और अन्य शास्त्रीय ग्रन्थ कई शर्तें बताते हैं जो मांगलिक दोष को निरस्त या कम करती हैं। हमारा कुण्डली विश्लेषण इंजन इन्हीं शर्तों की जाँच करता है — यदि 2 या अधिक शर्तें पूर्ण हों तो दोष "निरस्त" माना जाता है, 1 शर्त पूर्ण होने पर "आंशिक" निरसन।</>
            : <>BPHS, Phaladeepika, and other classical texts describe several conditions that cancel or mitigate Manglik Dosha. Our kundali analysis engine checks these exact conditions — if 2 or more conditions are met, the dosha is considered &quot;cancelled&quot;; if 1 condition is met, it is &quot;partially&quot; mitigated.</>}
        </p>
      </section>

      <div className="grid gap-3">
        {CANCELLATIONS.map((c, i) => (
          <div key={i} className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-lg p-4">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm">
                {i + 1}. {isHi ? c.titleHi : c.titleEn}
              </span>
              <span className="text-text-secondary text-[10px] shrink-0">{c.source}</span>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? c.descHi : c.descEn}
            </p>
          </div>
        ))}
      </div>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Important Nuance', hi: 'महत्वपूर्ण सूक्ष्मता', sa: 'महत्त्वपूर्णसूक्ष्मता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>विभिन्न परम्पराएँ मांगलिक की जाँच अलग-अलग सन्दर्भ बिन्दुओं से करती हैं — लग्न से, चन्द्र से, और शुक्र से। सबसे प्रबल मूल्यांकन तीनों पर विचार करता है। यदि मंगल लग्न से मांगलिक है पर चन्द्र और शुक्र से नहीं, तो दोष हल्का माना जाता है।</>
            : <>Different traditions assess Manglik from different reference points — from Lagna, from Moon, and from Venus. The strongest assessment considers all three. If Mars is Manglik from Lagna but NOT from Moon and Venus, the dosha is considered mild.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>कई परम्पराओं के अनुसार 28 वर्ष की आयु के बाद मांगलिक दोष स्वाभाविक रूप से कमज़ोर हो जाता है क्योंकि मंगल परिपक्व होता है। यह एक व्यापक रूप से स्वीकृत विश्वास है, हालाँकि सभी ज्योतिषी इससे सहमत नहीं हैं।</>
            : <>Many traditions hold that Manglik Dosha naturally weakens after 28 years of age as Mars matures. This is a widely held belief, though not all astrologers agree on this point.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Impact on Life and Relationships                          */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Impact on Life and Relationships', hi: 'जीवन और रिश्तों पर प्रभाव', sa: 'जीवनसम्बन्धेषु प्रभावः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>मांगलिक दोष केवल विवाह को ही नहीं बल्कि जीवन के व्यापक क्षेत्रों को प्रभावित करता है। मंगल की ऊर्जा इन भावों में रहकर स्वभाव, पारिवारिक गतिशीलता और घरेलू शान्ति को भी प्रभावित करती है।</>
            : <>Manglik Dosha does not just affect marriage — Mars&apos;s energy in these houses has broader life implications affecting temperament, family dynamics, and domestic peace.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Emotional Patterns', hi: 'भावनात्मक पैटर्न', sa: 'भावनात्मकपैटर्न' }, locale)}
        </h4>
        <ul className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <li className="flex gap-2"><span className="text-gold-primary shrink-0">&#8226;</span>
            {isHi ? 'रिश्तों में समझौता करने में कठिनाई' : 'Difficulty compromising in relationships — Mars\'s fiery nature resists yielding'}
          </li>
          <li className="flex gap-2"><span className="text-gold-primary shrink-0">&#8226;</span>
            {isHi ? 'तीव्र स्वभाव, विशेषकर घरेलू वातावरण में' : 'Quick temper, especially in domestic settings where Mars feels confined'}
          </li>
          <li className="flex gap-2"><span className="text-gold-primary shrink-0">&#8226;</span>
            {isHi ? 'स्वतन्त्रता की आवश्यकता जिसे साथी उदासीनता समझ सकता है' : 'Need for independence that partners may misinterpret as coldness or emotional distance'}
          </li>
          <li className="flex gap-2"><span className="text-gold-primary shrink-0">&#8226;</span>
            {isHi ? 'जुनूनी पर तीव्र — प्रेम साथी को अभिभूत कर सकता है' : 'Passionate but intense — love can feel overwhelming or all-consuming to partners'}
          </li>
        </ul>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Relationship Dynamics', hi: 'सम्बन्ध गतिशीलता', sa: 'सम्बन्धगतिशीलता' }, locale)}
        </h4>
        <ul className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <li className="flex gap-2"><span className="text-gold-primary shrink-0">&#8226;</span>
            {isHi ? 'शास्त्रीय ग्रन्थों के अनुसार प्रथम विवाह में चुनौतियाँ आ सकती हैं' : 'First marriage may face challenges according to classical texts'}
          </li>
          <li className="flex gap-2"><span className="text-gold-primary shrink-0">&#8226;</span>
            {isHi ? 'विवाह में विलम्ब सामान्य है — "सही मिलान" खोजने में अधिक समय लगता है' : 'Delays in marriage are common — finding the "right match" takes longer due to compatibility requirements'}
          </li>
          <li className="flex gap-2"><span className="text-gold-primary shrink-0">&#8226;</span>
            {isHi ? 'विवाह के बाद समायोजन में अधिक प्रयास की आवश्यकता होती है' : 'Post-marriage adjustments require more conscious effort from both partners'}
          </li>
          <li className="flex gap-2"><span className="text-gold-primary shrink-0">&#8226;</span>
            {isHi ? 'शारीरिक अनुकूलता आमतौर पर प्रबल होती है, पर भावनात्मक सामंजस्य में प्रयास चाहिए' : 'Physical compatibility is usually strong, but emotional harmony requires deliberate work'}
          </li>
        </ul>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Perspective', hi: 'आधुनिक दृष्टिकोण', sa: 'आधुनिकदृष्टिकोणम्' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>मंगल स्वाभाविक रूप से हानिकारक नहीं है — यह प्रेरणा, महत्वाकांक्षा और जो महत्वपूर्ण है उसके लिए लड़ने की क्षमता का प्रतिनिधित्व करता है। मंगल की ऊर्जा को करियर, खेल, या सामाजिक कार्यों में लगाने वाला मांगलिक व्यक्ति अक्सर "दोष" को "योग" (आशीर्वाद) में बदल देता है। कुंजी ऊर्जा का सचेत मार्गदर्शन है। मंगल युद्ध, प्रतिस्पर्धा, शल्य चिकित्सा, इंजीनियरिंग और नेतृत्व का ग्रह है — इन क्षेत्रों में मांगलिक व्यक्ति अक्सर उत्कृष्ट प्रदर्शन करते हैं।</>
            : <>Mars is not inherently malefic — it represents drive, ambition, and the ability to fight for what matters. A Manglik person channeling Mars energy into career, sports, or social causes often transforms the &quot;dosha&quot; into a &quot;yoga&quot; (blessing). The key is conscious channeling of energy. Mars is the planet of war, competition, surgery, engineering, and leadership — Manglik individuals often excel in these fields.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 4 — Remedies and Practical Guidance                           */
/* ------------------------------------------------------------------ */
function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Remedies and Practical Guidance', hi: 'उपाय और व्यावहारिक मार्गदर्शन', sa: 'उपायाः व्यावहारिकमार्गदर्शनं च' }, locale)}
        </h3>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Vedic Remedies', hi: 'वैदिक उपाय', sa: 'वैदिकोपायाः' }, locale)}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">
              {tl({ en: '1. Kumbh Vivah (कुम्भ विवाह)', hi: '1. कुम्भ विवाह', sa: '1. कुम्भ विवाह' }, locale)}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'वास्तविक विवाह से पहले केले के पेड़ (महिलाओं के लिए) या पीपल के पेड़ (पुरुषों के लिए) से औपचारिक विवाह। "पहला विवाह" प्रतीकात्मक रूप से पूरा हो जाता है, और वास्तविक विवाह "दूसरा" बनता है — दोष के प्रभाव से मुक्त।'
                : 'Ceremonial marriage to a banana tree (women) or peepal tree (men) before the real marriage. The "first marriage" is symbolically completed, and the real marriage becomes the "second" — free from the dosha\'s effect on the first marriage.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">
              {tl({ en: '2. Mangal Shanti Puja', hi: '2. मंगल शान्ति पूजा', sa: '2. मङ्गलशान्तिपूजा' }, locale)}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'मंगल को समर्पित विशेष हवन, मंगलवार को किया जाता है। पुजारी मंगल मन्त्रों का जाप कर मंगल की ऊर्जा को शान्त करता है।'
                : 'A specific fire ritual (havan) dedicated to Mars, performed on Tuesdays. The priest chants Mangal mantras to pacify Mars\'s aggressive energy.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">
              {tl({ en: '3. Hanuman Worship', hi: '3. हनुमान पूजा', sa: '3. हनुमत्पूजा' }, locale)}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'हनुमान को मंगल की ऊर्जा को नियन्त्रित करने वाले देवता माना जाता है। मंगलवार और शनिवार को हनुमान चालीसा का नियमित पाठ मांगलिक दोष के लिए प्रभावी उपाय है।'
                : 'Hanuman is considered the deity who controls Mars\'s energy. Regular recitation of Hanuman Chalisa, especially on Tuesdays and Saturdays, is an effective remedy for Manglik Dosha.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">
              {tl({ en: '4. Mangal Mantra', hi: '4. मंगल मन्त्र', sa: '4. मङ्गलमन्त्रः' }, locale)}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed font-mono">
              {tl({ en: '"Om Kraam Kreem Kraum Sah Bhaumaya Namah" — chanted 108 times daily', hi: '"ॐ क्रां क्रीं क्रौं सः भौमाय नमः" — प्रतिदिन 108 बार जाप', sa: '"ॐ क्रां क्रीं क्रौं सः भौमाय नमः"' }, locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">
              {tl({ en: '5. Tuesday Fasting', hi: '5. मंगलवार व्रत', sa: '5. मङ्गलवारव्रतम्' }, locale)}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'मंगल के दिन व्रत रखना, केवल एक बार भोजन करना। लाल रंग की वस्तुएँ — मसूर दाल, लाल वस्त्र, और गेहूँ — मंगलवार को मन्दिरों में दान करें।'
                : 'Observing a fast on Mars\'s day, consuming only one meal. Red items — red lentils (masoor dal), red cloth, and wheat — should be donated at temples on Tuesdays.'}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">
              {tl({ en: '6. Red Coral Gemstone (Moonga)', hi: '6. मूँगा रत्न', sa: '6. प्रवालरत्नम्' }, locale)}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'सोने में जड़ित लाल मूँगा (मूँगा) अनामिका में धारण — केवल ज्योतिषी से परामर्श के बाद, क्योंकि मंगल कुण्डली में कार्यात्मक शुभ ग्रह होना चाहिए। गलत रत्न नकारात्मक प्रभाव दे सकता है।'
                : 'Wearing red coral (Moonga) on the ring finger in gold — only after consulting an astrologer, as Mars must be a functional benefic in the chart. An inappropriate gemstone can amplify negative effects.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Practical Guidance (Modern)', hi: 'व्यावहारिक मार्गदर्शन (आधुनिक)', sa: 'व्यावहारिकमार्गदर्शनम्' }, locale)}
        </h4>
        <ul className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <li className="flex gap-2"><span className="text-emerald-400 shrink-0">&#8226;</span>
            {isHi ? 'यदि कई निरसन शर्तें पूर्ण नहीं हैं तो 28 वर्ष की आयु तक विवाह में विलम्ब पर विचार करें' : 'Delay marriage until after 28 if multiple cancellation conditions are NOT met'}
          </li>
          <li className="flex gap-2"><span className="text-emerald-400 shrink-0">&#8226;</span>
            {isHi ? 'ऐसा जीवनसाथी खोजें जो मांगलिक भी हो — यह सबसे व्यावहारिक समाधान है' : 'Seek a partner who is also Manglik — this is the most practical and widely accepted solution'}
          </li>
          <li className="flex gap-2"><span className="text-emerald-400 shrink-0">&#8226;</span>
            {isHi ? 'लग्न के अलावा चन्द्र और शुक्र से भी मिलान पर विचार करें' : 'Consider matching from Moon and Venus in addition to Lagna for a comprehensive assessment'}
          </li>
          <li className="flex gap-2"><span className="text-emerald-400 shrink-0">&#8226;</span>
            {isHi ? 'नियमित शारीरिक व्यायाम से मंगल की ऊर्जा को सकारात्मक दिशा दें' : 'Channel Mars energy through regular physical exercise — martial arts, sports, or intense workouts'}
          </li>
          <li className="flex gap-2"><span className="text-emerald-400 shrink-0">&#8226;</span>
            {isHi ? 'धैर्य और संवाद कौशल सचेत रूप से विकसित करें' : 'Practice patience and communication skills consciously — this directly counteracts Mars\'s impulsive nature'}
          </li>
          <li className="flex gap-2"><span className="text-emerald-400 shrink-0">&#8226;</span>
            {isHi ? 'मांगलिक स्थिति को विवाह की चिन्ता का कारण न बनने दें — 50% लोग मांगलिक हैं' : 'Don\'t let Manglik status create marriage anxiety — 50% of people are Manglik, and many cancellation conditions exist'}
          </li>
        </ul>
      </section>
    </div>
  );
}

export default function Module33_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}
