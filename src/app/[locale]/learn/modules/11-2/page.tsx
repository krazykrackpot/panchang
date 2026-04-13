'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/11-2.json';

const META: ModuleMeta = {
  id: 'mod_11_2', phase: 3, topic: 'Dashas', moduleNumber: '11.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs.map(cr => ({ label: cr.label as unknown as Record<string, string>, href: cr.href })),
};

const QUESTIONS = (L.questions as unknown) as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'योगिनी दशा — 36 वर्षीय चक्र' : 'Yogini Dasha — The 36-Year Cycle'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>जहाँ विंशोत्तरी पाराशरी ज्योतिष की प्राथमिक दशा पद्धति है, वहीं योगिनी दशा नाटकीय रूप से छोटे चक्र वाला एक शक्तिशाली पूरक उपकरण है। आठ योगिनियाँ — ब्रह्माण्डीय स्त्री शक्तियाँ — 36 वर्ष का काल विभाजित करती हैं: मंगला (1 वर्ष, चन्द्र), पिंगला (2 वर्ष, सूर्य), धन्या (3 वर्ष, गुरु), भ्रामरी (4 वर्ष, मंगल), भद्रिका (5 वर्ष, बुध), उल्का (6 वर्ष, शनि), सिद्धा (7 वर्ष, शुक्र), और संकटा (8 वर्ष, राहु)। योग: 1+2+3+4+5+6+7+8 = 36 वर्ष।</> : <>While Vimshottari is the primary dasha system in Parashari Jyotish, the Yogini Dasha offers a powerful complementary tool with a dramatically shorter cycle. Eight Yoginis — cosmic feminine energies — divide a 36-year span: Mangala (1 year, Moon), Pingala (2 years, Sun), Dhanya (3 years, Jupiter), Bhramari (4 years, Mars), Bhadrika (5 years, Mercury), Ulka (6 years, Saturn), Siddha (7 years, Venus), and Sankata (8 years, Rahu). The total: 1+2+3+4+5+6+7+8 = 36 years.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>विंशोत्तरी की भाँति, आरम्भिक योगिनी चन्द्रमा के जन्म नक्षत्र से निर्धारित होती है। सूत्र: नक्षत्र संख्या (अश्विनी=1, भरणी=2...) में 3 जोड़ें, 8 से भाग दें — शेषफल आरम्भिक योगिनी बताता है। चूँकि चक्र मात्र 36 वर्ष का है, यह जीवनकाल में 2-3 बार दोहराता है, विंशोत्तरी भविष्यवाणियों के सत्यापन हेतु एक भिन्न &quot;घड़ी&quot; प्रदान करता है। जहाँ विंशोत्तरी व्यापक कथा देती है, वहीं योगिनी शीघ्र, सटीक पुष्टि देती है।</> : <>Like Vimshottari, the starting Yogini is determined by the Moon&apos;s birth nakshatra. The formula: add the nakshatra number (Ashwini=1, Bharani=2...) to 3, divide by 8 — the remainder identifies the starting Yogini. Because the cycle is only 36 years, it repeats 2-3 times in a lifetime, providing a different &quot;clock&quot; against which to verify Vimshottari predictions. Where Vimshottari gives the broad narrative, Yogini gives quick, punchy confirmation.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'आठ योगिनियाँ — त्वरित सन्दर्भ' : 'The Eight Yoginis — Quick Reference'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Mangala</span> (1 yr, Moon) — Auspiciousness, new beginnings, emotional sensitivity.
          <span className="text-gold-light font-medium ml-2">Pingala</span> (2 yr, Sun) — Vitality, authority, father-related events.
          <span className="text-gold-light font-medium ml-2">Dhanya</span> (3 yr, Jupiter) — Prosperity, wisdom, expansion of fortune.
          <span className="text-gold-light font-medium ml-2">Bhramari</span> (4 yr, Mars) — Energy, conflicts, property, courage.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Bhadrika</span> (5 yr, Mercury) — Communication, trade, intelligence.
          <span className="text-gold-light font-medium ml-2">Ulka</span> (6 yr, Saturn) — Meteoric falls, hardship, karmic debts.
          <span className="text-gold-light font-medium ml-2">Siddha</span> (7 yr, Venus) — Accomplishment, relationships, luxury.
          <span className="text-gold-light font-medium ml-2">Sankata</span> (8 yr, Rahu) — Obstacles, obsession, unconventional paths.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'चर दशा (जैमिनी) — राशि-आधारित समय-निर्धारण' : 'Char Dasha (Jaimini) — Sign-Based Timing'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>महर्षि जैमिनी ने समय-निर्धारण का पूर्णतया भिन्न दृष्टिकोण विकसित किया। ग्रहों को काल निर्दिष्ट करने के बजाय, चर दशा राशियों को काल निर्दिष्ट करती है। सभी 12 राशियों को दशा की बारी मिलती है, और प्रत्येक राशि के काल की अवधि राशि और उसके स्वामी के बीच की दूरी पर निर्भर करती है। विषम राशियों के लिए राशि से स्वामी तक आगे गिनें; सम राशियों के लिए पीछे गिनें। परिणामी संख्या (1-12) उस राशि के दशा वर्ष देती है। यह प्रत्येक कुण्डली के लिए एक अद्वितीय समय-रेखा बनाता है।</> : <>Maharishi Jaimini developed an entirely different approach to timing. Instead of assigning periods to planets, Char Dasha assigns periods to signs (rashis). All 12 signs get a dasha turn, and the duration of each sign&apos;s period depends on the distance between the sign and its lord. For odd signs, count forward from the sign to its lord; for even signs, count backward. The resulting number (1-12) gives the dasha years for that sign. This creates a unique timeline for every chart.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>जब किसी विशेष राशि की चर दशा चल रही हो, पूरी राशि सक्रिय होती है — उस राशि में बैठा प्रत्येक ग्रह, वह राशि जिन भावों का प्रतिनिधित्व करती है, और उससे जुड़ा प्रत्येक जैमिनी कारक। यह चर दशा को घटना भविष्यवाणी में विशेष रूप से शक्तिशाली बनाता है। जैमिनी चर कारक (परिवर्तनशील कारक) का उपयोग करते हैं जो ग्रह अंश से निर्धारित होते हैं: कुण्डली में सर्वोच्च अंश वाला ग्रह आत्मकारक (आत्मा) बनता है, अगला अमात्यकारक (कैरियर), फिर भ्रातृकारक (भाई-बहन), मातृकारक (माता), पुत्रकारक (सन्तान), ज्ञातिकारक (शत्रु/सम्बन्धी), और दारकारक (पति/पत्नी) — न्यूनतम अंश वाला ग्रह।</> : <>When a particular sign&apos;s Char Dasha is running, the entire sign activates — every planet sitting in that sign, every house that sign represents, and every Jaimini karaka connected to it. This makes Char Dasha especially powerful for event prediction. Jaimini uses Chara Karakas (variable significators) determined by planetary degree: the planet at the highest degree in the chart becomes Atmakaraka (soul), the next is Amatyakaraka (career), then Bhratrikaraka (siblings), Matrikaraka (mother), Putrakaraka (children), Gnatikaraka (enemies/relatives), and Darakaraka (spouse) — the planet at the lowest degree.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'राशि दृष्टि — जैमिनी दृष्टि' : 'Rashi Drishti — Jaimini Aspects'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>पराशर की ग्रह दृष्टि (जहाँ शनि 3, 7 और 10वें को देखता है) के विपरीत, जैमिनी राशि-आधारित दृष्टि प्रयोग करते हैं। नियम सुन्दर हैं: चर राशियाँ (मेष, कर्क, तुला, मकर) सभी स्थिर राशियों को देखती हैं सिवाय निकटवर्ती के। स्थिर राशियाँ (वृषभ, सिंह, वृश्चिक, कुम्भ) सभी चर राशियों को देखती हैं सिवाय निकटवर्ती के। द्विस्वभाव राशियाँ (मिथुन, कन्या, धनु, मीन) एक-दूसरे को देखती हैं।</> : <>Unlike Parashara&apos;s planetary aspects (where Saturn aspects the 3rd, 7th, and 10th), Jaimini uses sign-based aspects. The rules are elegant: Movable signs (Aries, Cancer, Libra, Capricorn) aspect all Fixed signs except the one next to them. Fixed signs (Taurus, Leo, Scorpio, Aquarius) aspect all Movable signs except the one next to them. Dual signs (Gemini, Virgo, Sagittarius, Pisces) aspect each other.</>}</p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कौन-सी पद्धति कब प्रयोग करें' : 'When to Use Which System'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>तीन दशा पद्धतियाँ भिन्न उद्देश्यों की पूर्ति करती हैं और संयोजन में सर्वोत्तम कार्य करती हैं। विंशोत्तरी दशा सामान्य जीवन भविष्यवाणी की प्रधान पद्धति है — कैरियर प्रक्षेपवक्र, सम्बन्ध प्रतिरूप, स्वास्थ्य प्रवृत्तियाँ और पूर्ण जीवनकाल में आध्यात्मिक विकास। यह &quot;यह कैसा काल है?&quot; का उत्तर देने में उत्कृष्ट है क्योंकि ग्रह विषय शास्त्रीय साहित्य में समृद्ध रूप से वर्णित हैं। सभी कुण्डली पठन के लिए विंशोत्तरी को प्राथमिक भविष्यवाणी उपकरण के रूप में प्रयोग करें।</> : <>The three dasha systems serve different purposes and work best in combination. Vimshottari Dasha is the master system for general life predictions — career trajectories, relationship patterns, health trends, and spiritual evolution over the full lifespan. It excels at answering &quot;what kind of period is this?&quot; because planetary themes are richly described in classical literature. Use Vimshottari as your primary predictive tool for all chart readings.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>योगिनी दशा शीघ्र पुष्टि का कार्य करती है। इसके 36-वर्षीय चक्र का अर्थ है काल छोटे और अधिक तत्काल हैं। जब विंशोत्तरी कहे &quot;शुक्र काल — अगले 2 वर्षों में विवाह सम्भव&quot; और योगिनी की सिद्धा (शुक्र) अवधि भी उसी खिड़की में आती है, तो विश्वास नाटकीय रूप से बढ़ जाता है। योगिनी उत्तर भारतीय परम्पराओं में विशेष रूप से महत्त्वपूर्ण है और कभी-कभी अपनी कसी हुई समय-सीमाओं के कारण अल्पकालिक भविष्यवाणियों के लिए अधिक सटीक मानी जाती है।</> : <>Yogini Dasha serves as quick confirmation. Its 36-year cycle means periods are shorter and more immediate. When Vimshottari says &quot;Venus period — marriage likely in the next 2 years&quot; and Yogini&apos;s Siddha (Venus) period also falls in the same window, confidence jumps dramatically. Yogini is particularly valued in North Indian traditions and is sometimes considered more accurate for short-term predictions due to its tighter time frames.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Char Dasha excels at event-based analysis — &quot;will this specific event happen?&quot; Because it activates entire signs (with all their occupants), it is powerful for pinpointing concrete happenings: marriage (7th sign dasha), career change (10th sign dasha), foreign travel (12th sign dasha). The principle of convergent validation states: &quot;If 3 dashas agree, the event is certain.&quot; When Vimshottari, Yogini, and Char Dasha all point to the same event in the same time window, the prediction carries the highest confidence.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;केवल विंशोत्तरी प्रामाणिक है; अन्य दशा पद्धतियाँ आधुनिक आविष्कार हैं।&quot; यह पूर्णतया असत्य है। जैमिनी सूत्र (महर्षि जैमिनी, व्यास के शिष्य को समर्पित) अनेक पाराशरी टीकाओं से पूर्ववर्ती हैं। योगिनी दशा मध्यकालीन भारत के तान्त्रिक साहित्य में प्रकट होती है और शाक्त परम्परा में इसकी गहरी जड़ें हैं। तीनों पद्धतियों का प्राचीन वंशक्रम है और ये परस्पर पूरक हैं, प्रतिस्पर्धी नहीं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Only Vimshottari is authentic; other dasha systems are modern inventions.&quot; This is completely false. Jaimini Sutras (attributed to Maharishi Jaimini, a disciple of Vyasa) predate many Parashari commentaries. Yogini Dasha appears in Tantric literature from medieval India and has deep roots in the Shakta tradition. All three systems have ancient pedigrees and are mutually complementary, not competing.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'व्यवहार में अभिसारी प्रमाणीकरण' : 'Convergent Validation in Practice'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">परिदृश्य:</span> एक जातक पूछता है &quot;मेरा विवाह कब होगा?&quot; आप जाँचते हैं: विंशोत्तरी गुरु महादशा में शुक्र अन्तर्दशा जून 2027 से दिखाती है। योगिनी सिद्धा (शुक्र) काल 2026-2033 चल रहा दिखाती है। चर दशा लग्न से 7वीं राशि 2027-2029 में सक्रिय दिखाती है। तीनों पद्धतियाँ 2027-2028 पर विवाह खिड़की के रूप में अभिसरित होती हैं। यह उच्च-विश्वास भविष्यवाणी है।</> : <><span className="text-gold-light font-medium">Scenario:</span> A client asks &quot;When will I get married?&quot; You check: Vimshottari shows Venus Antardasha in Jupiter Mahadasha starting June 2027. Yogini shows Siddha (Venus) period running 2026-2033. Char Dasha shows 7th sign from lagna getting activated in 2027-2029. All three systems converge on 2027-2028 as the marriage window. This is high-confidence prediction.</>}</p>
      </section>
    </div>
  );
}

export default function Module11_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

