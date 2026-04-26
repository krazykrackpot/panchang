'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/21-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_21_1', phase: 8, topic: 'Varshaphal', moduleNumber: '21.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'Tajika aspects are unique to Varshaphal — Ithasala (applying aspect) means the event will happen; Easarapha (separating) means it already passed.',
          'Nakta (transferred aspect via a third planet) can save a failed Ithasala — the middleman planet carries the promise forward.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Tajika: The Perso-Arabic Layer of Indian Astrology', hi: 'ताजिक: भारतीय ज्योतिष की फारसी-अरबी परत', sa: 'ताजिकम्: भारतीयज्योतिषस्य फारसी-अरबी-स्तरः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ताजिक वार्षिक कुण्डली (वर्षफल) की एक पद्धति है जो लगभग 12वीं शताब्दी ई. में फारसी-अरबी विद्वत् आदान-प्रदान द्वारा भारतीय ज्योतिष में समाहित हुई। &quot;ताजिक&quot; शब्द &quot;ताजिक&quot; (फारसी) से व्युत्पन्न है, और यह पद्धति दृष्टियों के लिए पाराशरी परम्परा से मूलभूत रूप से भिन्न दृष्टिकोण लाती है। जहाँ पाराशरी ज्योतिष स्थिर दृष्टियों का उपयोग करता है — सप्तम भाव की प्रतियोग दृष्टि सदैव पूर्ण-बल है, पंचम/नवम त्रिकोण दृष्टियाँ सदैव प्रभावी हैं — वहीं ताजिक अंश-आधारित कक्षाओं के साथ आवेदक और पृथक्करण दृष्टियों का उपयोग करता है।</>
            : <>Tajika is a system of annual horoscopy (Varshaphal) that was absorbed into Indian astrology around the 12th century CE through Perso-Arabic scholarly exchanges. The word &quot;Tajika&quot; derives from &quot;Tajik&quot; (Persian), and the system brings a fundamentally different approach to aspects than the Parashari tradition. While Parashari astrology uses fixed aspects — the 7th house opposition is always full-strength, the 5th/9th trine aspects are always operative — Tajika uses APPLYING and SEPARATING aspects with degree-based orbs, much like the Western horary tradition from which it partly derives.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The key question Tajika answers is: &quot;Will the event promised in the annual chart actually come to pass THIS YEAR?&quot; Five Tajika yogas provide the answer: Ithasala (application — yes, it will happen), Easarapha (separation — opportunity passed), Nakta (transfer of light — event via intermediary), Yamaya (prohibition — event blocked by a third planet), and Manaoo (no application — event will not happen). These yogas transform the static annual chart into a dynamic prediction of what will and will not manifest.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>ताजिक पर मूलभूत भारतीय ग्रन्थ नीलकण्ठ दैवज्ञ (16वीं शताब्दी ई.) की &quot;ताजिक नीलकण्ठी&quot; है, जिसने भारतीय श्रोताओं के लिए ताजिक योगों को व्यवस्थित रूप से प्रस्तुत किया। इससे पहले, समरसिंह का &quot;कर्मप्रकाश&quot; (13वीं शताब्दी) ताजिक सिद्धान्तों को सम्मिलित करने वाली प्रथम भारतीय कृतियों में था। इस पद्धति का अरबी &quot;अल-काबिसी&quot; और टॉलेमी एवं डोरोथियस में पाए जाने वाले हेलेनिस्टिक &quot;आवेदन और पृथक्करण&quot; सिद्धान्तों से साम्य है। शताब्दियों में भारतीय ज्योतिषियों ने पाराशरी ग्रह कारकत्व और विंशोत्तरी दशा ढाँचे को बनाए रखते हुए इन तकनीकों को पूर्णतः आत्मसात कर लिया।</>
            : <>The foundational Indian text on Tajika is the &quot;Tajika Neelakanthi&quot; by Neelakantha Daivagnya (16th century CE), which systematically presented the Tajika yogas for an Indian audience. Earlier, Samarasimha&apos;s &quot;Karmaprakasha&quot; (13th century) was among the first Indian works to incorporate Tajika principles. The system has parallels to the Arabic &quot;al-Qabisi&quot; and the Hellenistic &quot;application and separation&quot; doctrines found in Ptolemy and Dorotheus. Over centuries, Indian astrologers fully assimilated these techniques while maintaining the Parashari planetary significations and Vimshottari dasha framework.</>}
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
          {tl({ en: 'The Five Tajika Yogas', hi: 'पाँच ताजिक योग', sa: 'पञ्च ताजिकयोगाः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>इत्थशाल (आवेदन):</strong> सबसे अनुकूल योग। एक तेज़ ग्रह दृष्टि की पारस्परिक कक्षा में धीमे ग्रह की ओर बढ़ रहा है। तेज़ ग्रह का अंश धीमे ग्रह से कम होना चाहिए (समान या दृष्टि राशियों में)। जब दो कारक ग्रहों के बीच इत्थशाल बनता है, तो वे जिस घटना का वादा करते हैं वह वर्ष में अवश्य प्रकट होगी। जितना निकट आवेदन, उतनी शीघ्र घटना।</>
            : <><strong>Ithasala (Application):</strong> The most favorable yoga. A faster planet is approaching a slower planet within their mutual orb of aspect. The faster planet must be at a LOWER degree than the slower planet (in the same or aspecting signs). When Ithasala forms between two significator planets, the event they promise WILL manifest during the year. The closer the application, the sooner the event.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>ईषराफ (पृथक्करण):</strong> इत्थशाल का विपरीत। दो ग्रह अपनी यथार्थ दृष्टि पार कर चुके हैं और अब दूर जा रहे हैं। तेज़ ग्रह का अंश धीमे ग्रह से अधिक है। इसका अर्थ है कि घटना सम्भव थी — अवसर था — किन्तु अब बीत चुका। छूटे अवसर, वे मुलाकातें जो लगभग हुईं किन्तु नहीं हुईं।</>
            : <><strong>Easarapha (Separation):</strong> The opposite of Ithasala. The two planets have already passed their exact aspect and are now moving apart. The faster planet is at a HIGHER degree than the slower planet. This means the event was possible — the window existed — but has now passed. Opportunities lost, meetings that almost happened but didn&apos;t.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><strong>नक्त (प्रकाश स्थानान्तरण):</strong> जब दो कारक ग्रह परस्पर प्रत्यक्ष दृष्टि नहीं बना सकते, एक तृतीय ग्रह मध्यस्थ बनता है — वह एक से पृथक होकर दूसरे पर आवेदन करता है, &quot;प्रकाश स्थानान्तरित&quot; करता है। घटना होती है किन्तु मध्यस्थ या अप्रत्याशित माध्यम से। <strong>यमया (निषेध):</strong> एक तीसरा ग्रह दो आवेदक ग्रहों के बीच आकर इत्थशाल को पूर्ण होने से रोकता है। <strong>मनऊ (अस्वीकृति):</strong> कोई भी ग्रह दूसरे पर आवेदन नहीं करता — कोई घटना प्रकट नहीं होती।</>
            : <><strong>Nakta (Transfer of Light):</strong> When two significator planets cannot directly aspect each other, a third planet acts as intermediary — it separates from one and applies to the other, &quot;transferring the light.&quot; The event happens but through a mediator or unexpected channel. <strong>Yamaya (Prohibition):</strong> A third planet interposes between two applying planets, blocking the Ithasala before it perfects. <strong>Manaoo (Refusal):</strong> Neither planet applies to the other — no event manifests.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">वर्षफल कुण्डली:</span> वर्ष स्वामी शुक्र 10 अंश वृषभ पर, गुरु 15 अंश वृषभ पर। शुक्र लगभग 1 अंश/दिन, गुरु लगभग 0.08 अंश/दिन — शुक्र तेज़ है। शुक्र कम अंश (10) पर है और गुरु (15) पर आवेदन कर रहा है। अन्तर = 5 अंश, मानक कक्षा में। यह स्पष्ट इत्थशाल है। गुरु भाव स्वामित्व द्वारा जिसका कारक है वह घटना अवश्य प्रकट होगी। यदि गुरु वार्षिक कुण्डली में दशम भाव का स्वामी है, तो करियर उन्नति वादित है। यदि शनि 12 अंश वृषभ पर होता, तो बीच में आकर → यमया → करियर उन्नति अवरुद्ध या विलम्बित।</>
            : <><span className="text-gold-light font-medium">Varshaphal chart:</span> Year lord Venus at 10 degrees Taurus, Jupiter at 15 degrees Taurus. Venus moves approximately 1 degree/day, Jupiter about 0.08 degrees/day — Venus is faster. Venus is at the lower degree (10) and applying to Jupiter (15). Gap = 5 degrees, within standard orb. This forms a clear Ithasala. The event Jupiter signifies by house lordship WILL manifest. If Jupiter rules the 10th house in the annual chart, career advancement is promised. If Saturn were at 12 degrees Taurus, it would interpose → Yamaya → career advancement blocked or delayed.</>}
        </p>
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
          {tl({ en: 'Applying Tajika in Varshaphal Analysis', hi: 'वर्षफल विश्लेषण में ताजिक का अनुप्रयोग', sa: 'वर्षफलविश्लेषणे ताजिकस्य प्रयोगः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'In practice, the astrologer examines the Varshaphal (annual return) chart and identifies which Tajika yogas form between the year lord (Varsheshvara) and other planets. The year lord is the planet with the highest strength in the annual chart, often determined by the Pancha-vargiya Bala (five-fold strength). Events promised by the year lord are the most significant for the year. If the year lord forms Ithasala with the 7th lord → marriage/partnership year. Ithasala with 10th lord → career year. Easarapha with 5th lord → educational opportunity missed.', hi: 'व्यवहार में, ज्योतिषी वर्षफल (वार्षिक प्रत्यावर्तन) कुण्डली की जाँच करता है और पहचानता है कि वर्ष स्वामी (वर्षेश्वर) और अन्य ग्रहों के बीच कौन-से ताजिक योग बनते हैं। वर्ष स्वामी वार्षिक कुण्डली में सर्वोच्च बल वाला ग्रह है, प्रायः पंचवर्गीय बल द्वारा निर्धारित। वर्ष स्वामी द्वारा वादित घटनाएँ वर्ष की सर्वाधिक महत्त्वपूर्ण हैं। यदि वर्ष स्वामी सप्तम स्वामी से इत्थशाल बनाता है → विवाह/साझेदारी वर्ष। दशम स्वामी से इत्थशाल → करियर वर्ष। पंचम स्वामी से ईषराफ → शैक्षिक अवसर छूटा।', sa: 'व्यवहार में, ज्योतिषी वर्षफल (वार्षिक प्रत्यावर्तन) कुण्डली की जाँच करता है और पहचानता है कि वर्ष स्वामी (वर्षेश्वर) और अन्य ग्रहों के बीच कौन-से ताजिक योग बनते हैं। वर्ष स्वामी वार्षिक कुण्डली में सर्वोच्च बल वाला ग्रह है, प्रायः पंचवर्गीय बल द्वारा निर्धारित। वर्ष स्वामी द्वारा वादित घटनाएँ वर्ष की सर्वाधिक महत्त्वपूर्ण हैं। यदि वर्ष स्वामी सप्तम स्वामी से इत्थशाल बनाता है → विवाह/साझेदारी वर्ष। दशम स्वामी से इत्थशाल → करियर वर्ष। पंचम स्वामी से ईषराफ → शैक्षिक अवसर छूटा।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The timing within the year is refined using Mudda Dasha (Module 21-3). The Tajika yoga tells you IF the event will happen; the Mudda Dasha tells you WHICH MONTH. Together with Sahams (Module 21-2), this creates a comprehensive annual prediction framework that goes far beyond what a natal chart alone can provide.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;ताजिक दृष्टियाँ पाराशरी दृष्टियों को प्रतिस्थापित करती हैं।&quot; ऐसा नहीं है। ताजिक दृष्टियों का उपयोग केवल वर्षफल (वार्षिक कुण्डली) ढाँचे में होता है। जन्म कुण्डली के लिए पाराशरी दृष्टियाँ (सप्तम पूर्ण, पंचम/नवम त्रिकोण, मंगल/गुरु/शनि की विशेष दृष्टियाँ) मानक बनी रहती हैं। ताजिक और पाराशरी पूरक पद्धतियाँ हैं जो भिन्न कुण्डली प्रकारों — क्रमशः वार्षिक और जन्म — पर लागू होती हैं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Tajika aspects replace Parashari aspects.&quot; They do not. Tajika aspects are used ONLY within the Varshaphal (annual chart) framework. For the natal chart, Parashari aspects (7th full, 5th/9th trine, special aspects of Mars/Jupiter/Saturn) remain the standard. Tajika and Parashari are complementary systems applied to different chart types — annual and natal respectively.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>ताजिक योग वार्षिक भविष्यवाणियों के लिए विशेष रूप से मूल्यवान हैं — भारतीय ज्योतिष में सबसे सामान्य परामर्श अनुरोध। ग्राहक प्रायः अमूर्त आजीवन प्रश्नों के बजाय &quot;इस वर्ष क्या होगा?&quot; पूछते हैं। हमारा वर्षफल उपकरण स्वचालित रूप से वार्षिक कुण्डली में प्रत्येक ग्रह युग्म के बीच सभी ताजिक योगों की गणना करता है, इत्थशाल संरचनाओं (जो घटनाएँ होंगी) और ईषराफ संरचनाओं (छूटे अवसर) को उजागर करता है। यह उपयोगकर्ताओं को शास्त्रीय ताजिक पद्धति पर आधारित तत्काल वार्षिक पूर्वानुमान देता है।</>
            : <>Tajika yogas are particularly valued for annual predictions — the most common consultation request in Indian astrology. Clients typically ask &quot;What will happen THIS year?&quot; rather than abstract lifetime questions. Our Varshaphal tool automatically computes all Tajika yogas between every planet pair in the annual chart, highlighting Ithasala formations (events that WILL happen) and Easarapha formations (missed opportunities). This gives users an immediate year-ahead forecast grounded in classical Tajika methodology.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module21_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
