'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/23-3.json';

const META: ModuleMeta = {
  id: 'mod_23_3', phase: 10, topic: 'Prediction', moduleNumber: '23.3',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/23-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/23-4' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/23-5' },
    { label: L.crossRefs[3].label as Record<string, string>, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q23_3_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q23_3_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q23_3_03', type: 'true_false',
    question: L.questions[2].question as Record<string, string>,
    correctAnswer: 3,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q23_3_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 3,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q23_3_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q23_3_06', type: 'true_false',
    question: L.questions[5].question as Record<string, string>,
    correctAnswer: 1,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q23_3_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q23_3_08', type: 'true_false',
    question: L.questions[7].question as Record<string, string>,
    correctAnswer: 1,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q23_3_09', type: 'mcq',
    question: L.questions[8].question as Record<string, string>,
    options: L.questions[8].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q23_3_10', type: 'mcq',
    question: L.questions[9].question as Record<string, string>,
    options: L.questions[9].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ─── Page 1: Sarvatobhadra Chakra ─────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'सर्वतोभद्र चक्र — सर्वशुभ ग्रिड' : 'Sarvatobhadra Chakra — The All-Auspicious Grid'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सर्वतोभद्र चक्र वैदिक ज्योतिष में सबसे परिष्कृत भविष्यवाणी उपकरणों में से एक है। यह 9×9 ग्रिड (81 कोष्ठ) है जो पाँच प्रणालियों को एक साथ मैप करती है: संस्कृत स्वर, संस्कृत व्यंजन, 27 नक्षत्र, 30 तिथियाँ और 7 वार। इन सभी को एक आरेख में रखकर, यह वेध (अवरोध) विश्लेषण के माध्यम से छिपे सम्बन्ध प्रकट करती है।</> : <>The Sarvatobhadra Chakra is one of the most sophisticated predictive tools in Vedic astrology. It is a 9x9 grid (81 cells) that maps together five systems: Sanskrit vowels, Sanskrit consonants, the 27 nakshatras, the 30 tithis, and the 7 varas (weekdays). By placing all these in a single diagram, it reveals hidden connections through Vedha (obstruction) analysis.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'How Vedha Works', hi: 'वेध कैसे काम करता है', sa: 'वेधः कथं कार्यं करोति' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>प्रत्येक नक्षत्र 9×9 ग्रिड में एक विशिष्ट स्थान रखता है। जब कोई गोचर पाप ग्रह (शनि, मंगल, राहु, केतु, या सूर्य) ऐसे नक्षत्र में होता है जो आपके जन्म नक्षत्र के साथ पंक्ति या स्तम्भ साझा करता है, तो यह वेध — &quot;छेदन&quot; या अवरोध बनाता है। यह उस नक्षत्र से जुड़े जीवन क्षेत्रों में बाधाएँ और चुनौतियाँ दर्शाता है।</> : <>Each nakshatra occupies a specific position in the 9x9 grid. When a transiting malefic planet (Saturn, Mars, Rahu, Ketu, or Sun) occupies a nakshatra that shares a row or column with your birth nakshatra, it creates a Vedha — a &quot;piercing&quot; or obstruction. This indicates obstacles and challenges in the life areas connected to that nakshatra.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Benefic Vedha', hi: 'शुभ वेध', sa: 'शुभवेधः' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>जब बृहस्पति, शुक्र, चन्द्र (शुक्ल पक्ष), या बुध (अपीड़ित) ऐसे नक्षत्र से गोचर करता है जो आपके जन्म नक्षत्र पर वेध बनाता है, तो प्रभाव सकारात्मक होता है — सहायता, अवसर और शुभ विकास। वही ज्यामितीय सम्बन्ध जो पाप ग्रहों से चुनौती दर्शाता है, शुभ ग्रहों से आशीर्वाद दर्शाता है।</> : <>When Jupiter, Venus, Moon (waxing), or Mercury (unafflicted) transits a nakshatra creating vedha on your birth nakshatra, the effect is positive — support, opportunity, and auspicious developments. The same geometric relationship that shows challenge from malefics shows blessing from benefics.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Name Connection', hi: 'नाम सम्बन्ध', sa: 'नामसम्बन्धः' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>ग्रिड में संस्कृत स्वरों और व्यंजनों का समावेश आपके नाम के प्रथम अक्षर (नामाक्षर) को विशिष्ट नक्षत्रों से जोड़ता है। इसका अर्थ है कि सटीक जन्म समय के बिना भी, सर्वतोभद्र चक्र के माध्यम से व्यक्ति के नाम का उपयोग गोचर भविष्यवाणियों के लिए किया जा सकता है — नाम अपना स्वयं का आकाशीय हस्ताक्षर वहन करता है।</> : <>The inclusion of Sanskrit vowels and consonants in the grid connects your name&apos;s first syllable (Nama-akshar) to specific nakshatras. This means even without a precise birth time, a person&apos;s name can be used for transit predictions through the Sarvatobhadra Chakra — the name carries its own celestial signature.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Etymology', hi: 'व्युत्पत्ति', sa: 'व्युत्पत्तिः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>&quot;सर्वतोभद्र&quot; का अर्थ है &quot;सभी दिशाओं से शुभ&quot; — ग्रिड किसी भी दिशा (ऊपर, नीचे, बाएँ, दाएँ, तिरछे) से पढ़ने के लिए डिज़ाइन की गई है। यह बहु-दिशात्मक पठन क्षमता इसे प्रतीत होने वाले असम्बन्धित ज्योतिषीय कारकों के बीच छिपे सम्बन्धों की पहचान के लिए अद्वितीय रूप से शक्तिशाली बनाती है।</> : <>&quot;Sarvatobhadra&quot; means &quot;auspicious from all sides&quot; — the grid is designed to be read from any direction (top, bottom, left, right, diagonal). This multi-directional reading capability makes it uniquely powerful for identifying hidden relationships between seemingly unrelated astrological factors.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Kota Chakra ──────────────────────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'कोटा चक्र — किलेबन्द आरेख' : 'Kota Chakra — The Fortified Diagram'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कोटा चक्र ग्रहीय गोचरों को एक किले पर आक्रमण करती (या रक्षा करती) सेना के रूप में दृश्य बनाता है। आपका जन्म नक्षत्र आपको चार संकेन्द्रित परतों में से एक में रखता है। इन परतों से गोचर करते ग्रह आपके व्यक्तिगत केन्द्र की ओर आती या पीछे हटती शक्तियों का प्रतिनिधित्व करते हैं।</> : <>The Kota Chakra visualizes planetary transits as an army approaching (or defending) a fort. Your birth nakshatra places you in one of four concentric layers. Planets transiting through these layers represent forces approaching or receding from your personal center.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{tl({ en: 'The Four Layers', hi: 'चार परतें', sa: 'चतस्रः परतयः' }, locale)}</p>
            <div className="text-text-secondary text-xs mt-2 space-y-2">{isHi ? <><p><strong className="text-gold-light">स्तम्भ (खम्भा/अन्तरतम):</strong> आपका व्यक्तिगत केन्द्र — पहचान, स्वास्थ्य, जीवनशक्ति। यहाँ ग्रह सीधे प्रभावित करते हैं। स्तम्भ में पाप ग्रह = प्रत्यक्ष व्यक्तिगत संकट। शुभ ग्रह = प्रत्यक्ष व्यक्तिगत आशीर्वाद और रक्षा।</p>
              <p><strong className="text-gold-light">मध्य (बीच):</strong> आपका तात्कालिक वातावरण — परिवार, निकट सम्बन्ध, दैनिक जीवन। यहाँ गोचर आपके अन्तरंग वृत्त और भावनात्मक संसार को प्रभावित करते हैं।</p>
              <p><strong className="text-gold-light">प्राकार (दीवार):</strong> आपकी रक्षात्मक संरचनाएँ — सामाजिक सहायता, व्यावसायिक नेटवर्क, समुदाय। शुभ ग्रह यहाँ आपकी रक्षा मजबूत करते हैं; पाप ग्रह उसे तोड़ते हैं।</p>
              <p><strong className="text-gold-light">बाह्य (बाहरी):</strong> बाहरी परिस्थितियाँ — समाज, राजनीति, विश्व घटनाएँ। ये वातावरण के माध्यम से अप्रत्यक्ष रूप से प्रभावित करती हैं।</p></> : <><p><strong className="text-gold-light">Stambha (Pillar/Innermost):</strong> Your personal core — identity, health, vitality. Planets here hit you directly. A malefic in Stambha = direct personal crisis. A benefic = direct personal blessing and protection.</p>
              <p><strong className="text-gold-light">Madhya (Middle):</strong> Your immediate environment — family, close relationships, daily life. Transits here affect your inner circle and emotional world.</p>
              <p><strong className="text-gold-light">Praakara (Wall):</strong> Your protective structures — social support, professional network, community. Benefics here strengthen your defenses; malefics breach them.</p>
              <p><strong className="text-gold-light">Bahya (Outer):</strong> External circumstances — society, politics, world events. These affect you indirectly through the environment.</p></>}</div>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Reading the Movement', hi: 'गति का पठन', sa: 'गतेः पाठनम्' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>कोटा चक्र व्याख्या की कुंजी गति की दिशा है। भीतर जाता पाप ग्रह (बाह्य → प्राकार → मध्य → स्तम्भ) = बढ़ती चुनौती, जैसे शत्रु किले की दीवारें तोड़ रहा हो। बाहर जाता पाप ग्रह = चुनौती घट रही है। भीतर जाता शुभ ग्रह = बढ़ता आशीर्वाद, जैसे सुदृढ़ीकरण केन्द्र पर पहुँच रहा हो।</> : <>The key to Kota Chakra interpretation is direction of movement. A malefic moving inward (Bahya → Praakara → Madhya → Stambha) = increasing challenge, like an enemy breaching fort walls. A malefic moving outward = challenge receding. A benefic moving inward = increasing blessings, like reinforcements arriving at the center.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-light text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Fort Metaphor', hi: 'किला रूपक', sa: 'दुर्गरूपकम्' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>किला रूपक गहराई से सहज है: स्तम्भ राजा का कक्ष है, मध्य आन्तरिक प्रांगण है, प्राकार किले की दीवार है, और बाह्य बाहर का भूमि है। शुभ ग्रह मित्र हैं; पाप ग्रह आक्रमणकारी। आपके &quot;किले&quot; (आपकी कुण्डली की समग्र शुभ शक्ति) की ताकत निर्धारित करती है कि आप घेराबन्दी का कितनी अच्छी तरह सामना करते हैं।</> : <>The fort metaphor is deeply intuitive: Stambha is the king&apos;s chamber, Madhya is the inner courtyard, Praakara is the fortress wall, and Bahya is the land outside. Benefic planets are allies; malefic planets are invaders. The strength of your &quot;fort&quot; (your chart&apos;s overall benefic strength) determines how well you withstand the siege.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Surya-Kalanala Chakra & Practical Application ────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'सूर्य-कालानल चक्र और व्यावहारिक अनुप्रयोग' : 'Surya-Kalanala Chakra & Practical Application'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्य-कालानल चक्र मासिक समय भविष्यवाणियों के लिए विशेष रूप से डिज़ाइन किया गया &quot;अग्नि-चक्र&quot; आरेख है। यह प्रत्येक नक्षत्र से सूर्य के गोचर को ट्रैक करता है और पहचानता है कि प्रत्येक सौर मास में कौन से जन्म नक्षत्र प्रभावित होते हैं।</> : <>The Surya-Kalanala Chakra is a &quot;fire-wheel&quot; diagram specifically designed for monthly timing predictions. It tracks the Sun&apos;s transit through each nakshatra and identifies which birth nakshatras are affected during each solar month.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Monthly Prediction Method', hi: 'मासिक भविष्यवाणी विधि', sa: 'मासिकभविष्यवाणीपद्धतिः' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>सूर्य प्रत्येक ~13.3 दिनों में लगभग एक नक्षत्र का गोचर करता है। जैसे-जैसे यह प्रत्येक नक्षत्र से गुजरता है, सूर्य-कालानल चक्र पहचानता है कि कौन से अन्य नक्षत्र वेध प्राप्त करते हैं। यदि सूर्य ऐसे नक्षत्र से गोचर करता है जो आपके जन्म नक्षत्र पर वेध बनाता है, तो वह ~13-दिन की अवधि सौर चुनौतियाँ — अधिकार के मुद्दे, स्वास्थ्य चिन्ता, या अहं संघर्ष लाती है।</> : <>The Sun transits approximately one nakshatra every ~13.3 days. As it moves through each nakshatra, the Surya-Kalanala Chakra identifies which other nakshatras receive vedha. If the Sun transits a nakshatra that creates vedha on your birth nakshatra, that ~13-day period brings solar challenges — authority issues, health concerns, or ego conflicts.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Combining All Three Chakras', hi: 'तीनों चक्रों का संयोजन', sa: 'त्रयाणां चक्राणां संयोजनम्' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>विशेषज्ञ ज्योतिषी तीनों चक्र प्रणालियों का एक साथ उपयोग करते हैं: सर्वतोभद्र व्यापक वेध विश्लेषण (नाम-आधारित भविष्यवाणियों सहित) के लिए, कोटा चक्र ग्रहीय प्रभाव की गहराई और दिशा समझने के लिए, और सूर्य-कालानल सटीक मासिक समय के लिए। जब तीनों एक साथ चुनौती दर्शाते हैं, तो भविष्यवाणी बहुत मजबूत मानी जाती है।</> : <>Expert astrologers use all three chakra systems together: Sarvatobhadra for comprehensive vedha analysis (including name-based predictions), Kota Chakra for understanding the depth and direction of planetary impact, and Surya-Kalanala for precise monthly timing. When all three indicate challenge simultaneously, the prediction is considered very strong.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Automated Vedha Computation', hi: 'स्वचालित वेध गणना', sa: 'स्वचालितवेधगणनम्' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>हमारा इंजन प्रत्येक नक्षत्र जोड़ी के लिए सर्वतोभद्र चक्र से सभी वेध सम्बन्धों की पूर्व-गणना करता है। आपका जन्म नक्षत्र दिए जाने पर, यह तुरन्त पहचानता है कि कौन से वर्तमान और आगामी ग्रहीय गोचर वेध बनाते हैं — पाप (बाधाएँ) और शुभ (सहायता) दोनों। यह मैन्युअल ग्रिड पठन की आवश्यकता समाप्त करता है और इन प्राचीन तकनीकों को सभी के लिए सुलभ बनाता है।</> : <>Our engine pre-computes all vedha relationships from the Sarvatobhadra Chakra for every nakshatra pair. Given your birth nakshatra, it instantly identifies which current and upcoming planetary transits create vedha — both malefic (obstacles) and benefic (support). This removes the need for manual grid reading and makes these ancient techniques accessible to everyone.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Why These Systems Matter', hi: 'ये प्रणालियाँ क्यों महत्वपूर्ण हैं', sa: 'एते तन्त्राः किमर्थं महत्त्वपूर्णाः सन्ति' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चक्र प्रणालियाँ मानक भाव-आधारित गोचर विश्लेषण से भिन्न दृष्टिकोण प्रदान करती हैं। वे नक्षत्र स्तर पर केन्द्रित हैं — भविष्यवाणी का एक सूक्ष्मतर स्तर। जबकि भाव गोचर बताते हैं कि कौन सा जीवन क्षेत्र सक्रिय है, चक्र प्रणालियाँ प्रभाव की तीव्रता, दिशा और गुणवत्ता बताती हैं। दशा विश्लेषण के साथ मिलकर, वे वैदिक ज्योतिष में सबसे सम्पूर्ण भविष्यवाणी उपकरण-समूह बनाती हैं।</> : <>Chakra systems provide a different lens than standard house-based transit analysis. They focus on the nakshatra level — a finer grain of prediction. While house transits tell you which life area is activated, chakra systems tell you the intensity, direction, and quality of the impact. Together with dasha analysis, they form the most complete predictive toolkit in Vedic astrology.</>}</p>
      </section>
    </div>
  );
}

export default function Module23_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
