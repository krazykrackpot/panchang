'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/11-3.json';

const META: ModuleMeta = {
  id: 'mod_11_3', phase: 3, topic: 'Dashas', moduleNumber: '11.3',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 17,
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
          {tl({ en: 'The Double Transit Theory', hi: 'द्वि-गोचर सिद्धान्त', sa: 'द्वि-गोचर सिद्धान्त' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>भविष्यवाणी ज्योतिष में सर्वाधिक महत्त्वपूर्ण सिद्धान्त &quot;द्वि-गोचर&quot; (dwi-gochar) सिद्धान्त है। कोई घटना केवल इसलिए नहीं होती कि दशा अनुकूल है। न ही केवल इसलिए कि गोचर अनुकूल हैं। दोनों को एक साथ सम्मिलित होना आवश्यक है। दशा सम्भावना बनाती है — सम्भावना की खिड़की खोलती है। सम्बन्धित भाव पर गुरु और शनि का गोचर ट्रिगर प्रदान करता है — वह विशिष्ट वर्ष जब घटना वास्तव में प्रकट होती है। यह सिद्धान्त बी.वी. रमण द्वारा प्रतिपादित किया गया और अब ज्योतिष के सभी सम्प्रदायों में सर्वमान्य है।</> : <>The single most important principle in predictive Jyotish is the &quot;double transit&quot; (dwi-gochar) theory. An event does NOT happen simply because the dasha supports it. Nor does it happen simply because transits are favorable. Both must align simultaneously. The dasha creates the potential — it opens a window of possibility. The transit of Jupiter and Saturn over the relevant house provides the trigger — the specific year the event actually manifests. This principle was articulated by B.V. Raman and is now universally accepted across all schools of Jyotish.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>व्यवहार में यह कैसे कार्य करता है: मान लीजिए कोई शुक्र महादशा में है और शुक्र सप्तमेश (विवाह) है। इसका अर्थ है इस 20 वर्षीय खिड़की में विवाह का &quot;वचन&quot; है। किन्तु कौन-सा विशिष्ट वर्ष? देखें कि गुरु कब 7वें भाव पर गोचर करता है (या 1, 3, 5, 9 या 11वें से दृष्टि डालता है) और शनि भी एक साथ 7वें भाव पर गोचर या दृष्टि डालता है। दोनों शर्तों का आच्छादन वाला वर्ष वह है जब विवाह वास्तव में होता है। गुरु ~12 वर्षों में राशिचक्र पार करता है; शनि ~30 वर्षों में। किसी विशिष्ट भाव पर उनका आच्छादन अपेक्षाकृत दुर्लभ है, इसीलिए अनुकूल दशाओं में भी घटनाएँ निरन्तर नहीं होतीं।</> : <>How it works in practice: Suppose someone is in Venus Mahadasha and Venus is the 7th lord (marriage). This means marriage is &quot;promised&quot; during this 20-year window. But which specific year? Look for when Jupiter transits the 7th house (or aspects it from the 1st, 3rd, 5th, 9th, or 11th) AND Saturn also transits or aspects the 7th house simultaneously. The year both conditions overlap is when the marriage actually happens. Jupiter cycles through the zodiac in ~12 years; Saturn in ~30 years. Their overlap on a specific house is relatively rare, which is why events don&apos;t happen continuously even in favorable dashas.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Why Jupiter and Saturn?', hi: 'गुरु और शनि ही क्यों?', sa: 'गुरु और शनि ही क्यों?' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>गुरु और शनि इसलिए चुने जाते हैं क्योंकि ये सबसे धीमी गति के दृश्य ग्रह हैं, क्रमशः 1 वर्ष और 2.5 वर्ष प्रति राशि व्यतीत करते हैं। इनके गोचर व्यापक समय-खिड़कियाँ बनाते हैं जो दशा के वचन को विशिष्ट वर्ष तक संकीर्ण करती हैं। तीव्र ग्रह (चन्द्र, बुध, शुक्र) प्रमुख घटनाओं के समय चिह्न के लिए बहुत शीघ्र गति करते हैं। गुरु दिव्य कृपा, विस्तार और अवसर का प्रतिनिधित्व करता है। शनि कर्म, अनुशासन और ठोस अभिव्यक्ति का। साथ मिलकर ये किसी भी घटना के लिए आवश्यक दो शक्तियों का प्रतिनिधित्व करते हैं: आशीर्वाद (गुरु) और कर्म (शनि)।</> : <>Jupiter and Saturn are chosen because they are the slowest-moving visible planets, spending 1 year and 2.5 years per sign respectively. Their transits create broad time windows that narrow the dasha promise to a specific year. Faster planets (Moon, Mercury, Venus) move too quickly to be useful as timing markers for major events. Jupiter represents divine grace, expansion, and opportunity. Saturn represents karma, discipline, and concrete manifestation. Together they represent the two forces needed for any event: the blessing (Jupiter) and the karma (Saturn).</>}</p>
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
          {tl({ en: 'Dasha Sandhi — The Turbulent Transition', hi: 'दशा सन्धि — अशान्त संक्रमण', sa: 'दशा सन्धि — अशान्त संक्रमण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दशा सन्धि (सन्धि स्थल) दो महादशाओं के बीच का संक्रमण क्षेत्र है — व्यक्ति के जीवन के सबसे संवेदनशील कालों में से एक। &quot;सन्धि&quot; शब्द का अर्थ जंक्शन या मिलन बिन्दु है। निवर्तमान महादशा के अन्तिम ~6 मास और आगामी के प्रथम ~6 मास में जातक जीवन विषयों में मूलभूत परिवर्तन अनुभव करता है। पुराना ग्रह प्रभाव क्षीण हो रहा है किन्तु समाप्त नहीं हुआ; नया उभर रहा है किन्तु अभी स्थापित नहीं। यह अनिश्चितता, भ्रम और कभी-कभी अशान्ति उत्पन्न करता है।</> : <>Dasha sandhi (junction) is the transition zone between two Mahadashas — one of the most sensitive periods in a person&apos;s life. The term &quot;sandhi&quot; means junction or meeting point. During the last ~6 months of an outgoing Mahadasha and the first ~6 months of an incoming one, the native experiences a fundamental shift in life themes. The old planetary influence is waning but not gone; the new one is emerging but not yet established. This creates uncertainty, confusion, and sometimes turbulence.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>उदाहरणार्थ, गुरु महादशा (विस्तार, आशावाद, शिक्षण, धर्म) से शनि महादशा (प्रतिबन्ध, अनुशासन, कठोर श्रम, कर्म) में संक्रमण सम्भव सबसे नाटकीय परिवर्तनों में से एक है। व्यक्ति को लग सकता है कि उसकी पूर्व सहायता प्रणालियाँ विलीन हो रही हैं, अवसर अचानक सिकुड़ रहे हैं, और एक नई, अधिक कठोर वास्तविकता आकार ले रही है। यह &quot;बुरा&quot; नहीं है — यह आवश्यक पुनर्संशोधन है। राहु और गुरु के बीच सन्धि गतिशीलता उलट देती है: जुनूनी सांसारिक अनुसरण से दार्शनिक स्पष्टता की ओर।</> : <>For example, the transition from Jupiter Mahadasha (expansion, optimism, teaching, dharma) to Saturn Mahadasha (restriction, discipline, hard work, karma) is one of the most dramatic shifts possible. A person may feel their previous support systems dissolving, opportunities suddenly contracting, and a new, more austere reality taking shape. This is not &quot;bad&quot; — it is a necessary recalibration. The sandhi between Rahu and Jupiter reverses the dynamic: from obsessive worldly pursuit to philosophical clarity.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Navigating Sandhi Periods', hi: 'सन्धि काल का संचालन', sa: 'सन्धि काल का संचालन' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">जागरूकता:</span> केवल यह जानना कि सन्धि आ रही है, चिन्ता कम करता है। सटीक महादशा संक्रमण तिथि पहले से चिह्नित करें और मानें कि पहले और बाद के 6 मास अस्थिर अनुभव होंगे। यह स्वाभाविक और अस्थायी है।</> : <><span className="text-gold-light font-medium">Awareness:</span> Simply knowing a sandhi is approaching reduces anxiety. Mark the exact Mahadasha transition date in advance and recognize that the 6 months before and after will feel unsettled. This is natural and temporary.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">बड़े निर्णय टालें:</span> यदि सम्भव हो तो सन्धि काल में अपरिवर्तनीय निर्णय (विवाह, बड़ा निवेश, कैरियर परिवर्तन) न लें। नई दशा के स्थापित होने की प्रतीक्षा करें — सामान्यतः नई महादशा में प्रवेश के 3-6 मास बाद।</> : <><span className="text-gold-light font-medium">Avoid major commitments:</span> Do not make irreversible decisions (marriage, major investment, career change) during sandhi if possible. Wait for the new dasha to establish itself — typically 3-6 months into the new Mahadasha.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;दशा सन्धि सदा विपत्ति लाती है।&quot; सत्य नहीं। दो शुभ दशाओं के बीच सन्धि (जैसे गुरु से बुध, जब दोनों शुभ स्थित हों) केवल पुनर्संशोधन काल जैसा अनुभव हो सकता है — संकट नहीं, हल्की बेचैनी। गम्भीरता इस पर निर्भर करती है कि दोनों महादशा स्वामी स्वभाव और स्थिति में कितने भिन्न हैं, और वे परस्पर मित्र हैं या शत्रु।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Dasha sandhi always brings disaster.&quot; Not true. The sandhi between two benefic dashas (e.g., Jupiter to Mercury for a chart where both are well-placed) can simply feel like a period of recalibration — mild restlessness rather than crisis. The severity depends on how different the two Mahadasha lords are in nature and placement, and whether they are mutual friends or enemies.</>}</p>
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
          {tl({ en: 'Practical Dasha Reading — A Systematic Method', hi: 'व्यावहारिक दशा पठन — एक व्यवस्थित विधि', sa: 'व्यावहारिक दशा पठन — एक व्यवस्थित विधि' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दशा पठन में व्यवस्थित चार-चरण प्रक्रिया आवश्यक है। चरण 1: महादशा ग्रह की कुण्डली स्थिति पहचानें। वह किस भाव में बैठा है? किस राशि में है (बल — उच्च, स्व, मित्र, शत्रु, नीच)? किन भावों का स्वामी है? 10वें भाव में स्वराशि में बैठा ग्रह जो 4 और 5वें भावों का स्वामी है, अपनी महादशा में कैरियर अधिकार (10वाँ), सम्पत्ति/सुख (4वाँ), और बुद्धि/सन्तान (5वाँ) देगा।</> : <>Reading a dasha requires a systematic four-step process. Step 1: Identify the Mahadasha planet&apos;s chart position. Where does it sit (house)? What sign is it in (dignity — exalted, own, friend, enemy, debilitated)? What houses does it rule? A planet sitting in the 10th house in its own sign, ruling the 4th and 5th houses, will give career authority (10th), property/comfort (4th), and intelligence/children (5th) during its Mahadasha.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चरण 2: अन्तर्दशा ग्रह का महादशा स्वामी से सम्बन्ध आँकें। क्या वे नैसर्गिक मित्र हैं (गुरु-चन्द्र, सूर्य-मंगल) या शत्रु (सूर्य-शनि, मंगल-बुध)? क्या अन्तर्दशा ग्रह शुभ स्थित है या पीड़ित? चरण 3: सक्रिय भाव पहचानें — वे जहाँ ये ग्रह बैठे हैं और जिनके स्वामी हैं दोनों। चरण 4: गोचर जाँचें — क्या गुरु और शनि इस विशिष्ट अन्तर्दशा खिड़की में सम्बन्धित भावों को समर्थन दे रहे हैं? जब चारों कारक सम्मिलित हों, विश्वास के साथ भविष्यवाणी करें।</> : <>Step 2: Assess the Antardasha planet&apos;s relationship to the Mahadasha lord. Are they natural friends (Jupiter-Moon, Sun-Mars) or enemies (Sun-Saturn, Mars-Mercury)? Is the Antardasha planet well-placed or afflicted? Step 3: Identify the activated houses — both where these planets sit AND what they rule. Step 4: Check transits — are Jupiter and Saturn supporting the relevant houses during this specific Antardasha window? When all four factors align, predict with confidence.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <ExampleChart
          ascendant={2}
          planets={{ 6: [6], 9: [5] }}
          title={tl({ en: 'Taurus Lagna — Saturn exalted in 6th, Venus in 9th', hi: 'वृषभ लग्न — शनि उच्च षष्ठ में, शुक्र नवम में', sa: 'वृषभ लग्न — शनि उच्च षष्ठ में, शुक्र नवम में' }, locale)}
          highlight={[6, 9]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Chart:</span> Taurus ascendant. Saturn (yogakaraka, ruling 9th and 10th) is exalted in Libra in the 6th house. Current period: Saturn Mahadasha / Venus Antardasha (Venus rules 1st and 6th, sits in 9th). Transit: Jupiter entering Taurus (1st house) in 2026, Saturn in Pisces (11th house) aspecting 1st, 5th, 8th.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">कुण्डली:</span> वृषभ लग्न। शनि (योगकारक, 9 और 10वें का स्वामी) तुला में 6वें भाव में उच्च। वर्तमान काल: शनि महादशा / शुक्र अन्तर्दशा (शुक्र 1 और 6वें का स्वामी, 9वें में स्थित)। गोचर: गुरु 2026 में वृषभ (1ला भाव) प्रवेश, शनि मीन (11वाँ भाव) से 1, 5, 8वें पर दृष्टि। विश्लेषण: शनि MD कैरियर (दशमेश) और भाग्य (नवमेश) सक्रिय करता है। 6वें में होने पर भी उच्च शनि शत्रुओं को पराजित करता है। शुक्र AD व्यक्तिगत पहचान (लग्नेश) लाता है। 1ले भाव पर द्वि-गोचर = 2026 में व्यक्तिगत रूपान्तरण और मान्यता।</> : <><span className="text-gold-light font-medium">Analysis:</span> Saturn MD activates career (10th lord) and fortune (9th lord). Despite sitting in the 6th (enemies, service), exalted Saturn here defeats enemies and excels in service-oriented careers. Venus AD brings personal identity (1st lord) into focus with service/health (6th lord). Jupiter transiting the 1st triggers personal advancement; Saturn aspecting the 1st confirms it. Double transit on the 1st house = personal transformation and recognition in 2026.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'In Our App', hi: 'हमारे ऐप में', sa: 'हमारे ऐप में' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा कुण्डली इंजन पूर्ण विंशोत्तरी दशा तालिका बनाता है और वर्तमान चल रही महादशा एवं अन्तर्दशा पहचानता है। टिप्पणी (व्याख्यात्मक भाष्य) खण्ड महादशा ग्रह के भाव, राशि और भावेशत्व का विश्लेषण करता है, अन्तर्दशा सम्बन्ध आँकता है, और वर्तमान गुरु-शनि गोचर से तुलना करता है। गोचर पृष्ठ वास्तविक समय में ग्रह स्थितियाँ दिखाता है, जिससे आपकी कुण्डली के किसी भी भाव के लिए द्वि-गोचर शर्तें सत्यापित करना सरल है।</> : <>Our Kundali engine generates the complete Vimshottari dasha table and identifies the current running Mahadasha and Antardasha. The Tippanni (interpretive commentary) section analyzes the Mahadasha planet&apos;s house, sign, and lordship, the Antardasha relationship, and cross-references with current Jupiter and Saturn transits. The Transits page shows real-time planetary positions, making it easy to verify double transit conditions for any house in your chart.</>}</p>
      </section>
    </div>
  );
}

export default function Module11_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

