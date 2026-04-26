'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/21-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_21_2', phase: 8, topic: 'Varshaphal', moduleNumber: '21.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 12,
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
          'Sahams are sensitive points calculated from three factors (like Arabic Parts) — Punya Saham for fortune, Vidya for education, Karma for career.',
          'The Saham\'s house position and its lord\'s strength in the Varshaphal chart indicate whether that life theme will flourish in the year.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Are Sahams?', hi: 'सहम क्या हैं?', sa: 'सहम क्या हैं?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सहम (&quot;अरबी भाग&quot; या &quot;लॉट&quot; भी कहे जाते हैं) राशिचक्र में गणितीय रूप से गणित संवेदनशील बिन्दु हैं जो विशिष्ट जीवन क्षेत्रों के कारकत्व को एक अंश में केन्द्रित करते हैं। प्रत्येक सहम एक सरल सूत्र से गणित होता है: सहम = बिन्दु_A + बिन्दु_B - बिन्दु_C, जहाँ तीन बिन्दु प्रायः ग्रह या लग्न हैं। राशिचक्र में परिणामी अंश वार्षिक कुण्डली में उस जीवन क्षेत्र का शक्तिशाली सूचक बन जाता है।</>
            : <>Sahams (also called &quot;Arabic Parts&quot; or &quot;Lots&quot;) are mathematically computed sensitive points in the zodiac that concentrate the signification of specific life areas into a single degree. Each Saham is calculated using a simple formula: Saham = Point_A + Point_B - Point_C, where the three points are typically planets or the Ascendant. The resulting degree in the zodiac becomes a powerful indicator for that life area in the annual chart.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The most important Sahams are: Punya Saham (fortune) = Moon + Sun - Lagna; Vidya Saham (education) = Jupiter + Mercury - Lagna; Karma Saham (career) = Saturn + Sun - Lagna; Yashas Saham (fame) = Jupiter + Sun - Lagna; Mitra Saham (friendship) = Jupiter + Moon - Lagna; Vivaha Saham (marriage) = Venus + Saturn - Lagna; Putra Saham (children) = Jupiter + Moon - Lagna; Roga Saham (disease) = Saturn + Mars - Lagna; and Mrityu Saham (death/transformation) = Saturn + Moon - Lagna. Approximately 16 Sahams are standard in Tajika practice.', hi: 'सबसे महत्त्वपूर्ण सहम हैं: पुण्य सहम (भाग्य) = चन्द्र + सूर्य - लग्न; विद्या सहम (शिक्षा) = गुरु + बुध - लग्न; कर्म सहम (करियर) = शनि + सूर्य - लग्न; यशस सहम (यश) = गुरु + सूर्य - लग्न; मित्र सहम (मित्रता) = गुरु + चन्द्र - लग्न; विवाह सहम = शुक्र + शनि - लग्न; पुत्र सहम (सन्तान) = गुरु + चन्द्र - लग्न; रोग सहम (रोग) = शनि + मंगल - लग्न; और मृत्यु सहम (मृत्यु/रूपान्तरण) = शनि + चन्द्र - लग्न। ताजिक अभ्यास में लगभग 16 सहम मानक हैं।', sa: 'सबसे महत्त्वपूर्ण सहम हैं: पुण्य सहम (भाग्य) = चन्द्र + सूर्य - लग्न; विद्या सहम (शिक्षा) = गुरु + बुध - लग्न; कर्म सहम (करियर) = शनि + सूर्य - लग्न; यशस सहम (यश) = गुरु + सूर्य - लग्न; मित्र सहम (मित्रता) = गुरु + चन्द्र - लग्न; विवाह सहम = शुक्र + शनि - लग्न; पुत्र सहम (सन्तान) = गुरु + चन्द्र - लग्न; रोग सहम (रोग) = शनि + मंगल - लग्न; और मृत्यु सहम (मृत्यु/रूपान्तरण) = शनि + चन्द्र - लग्न। ताजिक अभ्यास में लगभग 16 सहम मानक हैं।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>सहम हेलेनिस्टिक &quot;लॉट&quot; (ग्रीक: &quot;क्लेरोस&quot;) से व्युत्पन्न हैं, जिनमें सबसे प्रसिद्ध लॉट ऑफ फॉर्च्यून (टाइखे) है। ये अरबी मध्यस्थों द्वारा भारतीय ज्योतिष में आए — अरबी &quot;सहम&quot; (बहुवचन: सुहम) का अर्थ &quot;तीर&quot; या &quot;भाग&quot; है। ताजिक नीलकण्ठी और समरसिंह के कर्मप्रकाश जैसे ग्रन्थ भारतीय अनुकूलनों का विवरण देते हैं। यद्यपि सूत्र अपने अरबी/हेलेनिस्टिक मूल से समान हैं, भारतीय ज्योतिषी इन्हें भाव, स्वामित्व और दशाओं के वैदिक ढाँचे में व्याख्यायित करते हैं।</>
            : <>Sahams derive from the Hellenistic &quot;Lots&quot; (Greek: &quot;Kleros&quot;), the most famous being the Lot of Fortune (Tyche). They entered Indian astrology through Arabic intermediaries — the Arabic &quot;Sahm&quot; (plural: Suham) means &quot;arrow&quot; or &quot;lot.&quot; Texts like Tajika Neelakanthi and Samarasimha&apos;s Karmaprakasha detail the Indian adaptations. While the formulas are identical to their Arabic/Hellenistic originals, Indian astrologers interpret them within the Vedic framework of houses, lordships, and dashas.</>}
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
          {tl({ en: 'Computing and Interpreting Sahams', hi: 'सहम गणना और व्याख्या', sa: 'सहम गणना और व्याख्या' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सहम की व्याख्या के लिए, पहले सूत्र से उसकी राशिचक्रीय स्थिति गणित करें, फिर विश्लेषण करें: (1) सहम किस भाव में पड़ता है? यह दिखाता है कि सहम का कारकत्व किस जीवन क्षेत्र से प्रकट होगा। पुण्य सहम दशम में = करियर द्वारा भाग्य; सप्तम में = साझेदारी द्वारा भाग्य। (2) सहम किस राशि में है? राशि स्वामी &quot;सहम स्वामी&quot; बनता है और उसका बल, मर्यादा और ताजिक योग परिणाम निर्धारित करते हैं। (3) क्या वर्ष स्वामी सहम स्वामी से इत्थशाल बनाता है? यदि हाँ, तो सहम का वादा इस वर्ष प्रकट होगा।</>
            : <>To interpret a Saham, first compute its zodiacal position using the formula, then analyze: (1) Which HOUSE does the Saham fall in? This shows the life area through which the Saham&apos;s signification manifests. Punya Saham in the 10th = fortune through career; in the 7th = fortune through partnership. (2) Which SIGN is the Saham in? The sign lord becomes the &quot;Saham lord&quot; and its strength, dignity, and Tajika yogas determine the outcome. (3) Does the year lord form Ithasala with the Saham lord? If yes, the Saham&apos;s promise will manifest this year.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For health concerns, Mrityu Saham is examined cautiously. If the year lord forms Ithasala with the Mrityu Saham lord, it warrants attention to health — but does NOT automatically predict death. The natal chart must show corresponding vulnerability (dasha of maraka planets, afflicted 8th house) for any serious concern. In most cases, Mrityu Saham activation indicates transformative endings, lifestyle changes, or metaphorical &quot;death&quot; of a phase of life.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">पुण्य सहम गणना:</span> वर्षफल कुण्डली में — चन्द्र 120 अंश (0 अंश सिंह), सूर्य 45 अंश (15 अंश वृषभ), लग्न 90 अंश (0 अंश कर्क)। पुण्य सहम = 120 + 45 - 90 = 75 अंश = 15 अंश मिथुन। पुण्य सहम मिथुन में द्वादश भाव में पड़ता है। राशि स्वामी = बुध। व्याख्या: भाग्य द्वादश भाव कारकत्वों — विदेशी सम्बन्ध, आध्यात्मिक साधना, या पर्दे के पीछे कार्य — द्वारा आता है। यदि बुध (सहम स्वामी) बलवान है और वर्ष स्वामी बुध से इत्थशाल बनाता है → विदेशी आय या आध्यात्मिक विकास द्वारा भाग्यशाली वर्ष।</>
            : <><span className="text-gold-light font-medium">Computing Punya Saham:</span> In the Varshaphal chart — Moon at 120 degrees (0 degrees Leo), Sun at 45 degrees (15 degrees Taurus), Lagna at 90 degrees (0 degrees Cancer). Punya Saham = 120 + 45 - 90 = 75 degrees = 15 degrees Gemini. Punya Saham falls in Gemini in the 12th house. Sign lord = Mercury. Interpretation: fortune comes through 12th house significations — foreign connections, spiritual pursuits, or behind-the-scenes work. If Mercury (Saham lord) is strong and the year lord forms Ithasala with Mercury → a fortunate year via foreign income or spiritual growth.</>}
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
          {tl({ en: 'Key Sahams Reference', hi: 'प्रमुख सहम सन्दर्भ', sa: 'प्रमुख सहम सन्दर्भ' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Here are the most important Sahams with their formulas and interpretive focus: Punya (Moon+Sun-Lagna) for general fortune and luck. Vidya (Jupiter+Mercury-Lagna) for education, exams, and learning. Yashas (Jupiter+Sun-Lagna) for fame, reputation, and public recognition. Mitra (Jupiter+Moon-Lagna) for friendships and social connections. Karma (Saturn+Sun-Lagna) for career, profession, and authority. Roga (Saturn+Mars-Lagna) for disease and health issues. Vivaha (Venus+Saturn-Lagna) for marriage and romantic partnerships. Putra (Jupiter+Moon-Lagna) for children and progeny. Mrityu (Saturn+Moon-Lagna) for death, transformation, and endings.', hi: 'सबसे महत्त्वपूर्ण सहम उनके सूत्रों और व्याख्या केन्द्र सहित: पुण्य (चन्द्र+सूर्य-लग्न) सामान्य भाग्य और सौभाग्य हेतु। विद्या (गुरु+बुध-लग्न) शिक्षा, परीक्षा और विद्या हेतु। यशस (गुरु+सूर्य-लग्न) यश, प्रतिष्ठा और सार्वजनिक मान्यता हेतु। मित्र (गुरु+चन्द्र-लग्न) मित्रता और सामाजिक सम्बन्ध हेतु। कर्म (शनि+सूर्य-लग्न) करियर, व्यवसाय और अधिकार हेतु। रोग (शनि+मंगल-लग्न) रोग और स्वास्थ्य समस्याओं हेतु। विवाह (शुक्र+शनि-लग्न) विवाह और प्रणय साझेदारी हेतु। पुत्र (गुरु+चन्द्र-लग्न) सन्तान हेतु। मृत्यु (शनि+चन्द्र-लग्न) मृत्यु, रूपान्तरण और समाप्तियों हेतु।', sa: 'सबसे महत्त्वपूर्ण सहम उनके सूत्रों और व्याख्या केन्द्र सहित: पुण्य (चन्द्र+सूर्य-लग्न) सामान्य भाग्य और सौभाग्य हेतु। विद्या (गुरु+बुध-लग्न) शिक्षा, परीक्षा और विद्या हेतु। यशस (गुरु+सूर्य-लग्न) यश, प्रतिष्ठा और सार्वजनिक मान्यता हेतु। मित्र (गुरु+चन्द्र-लग्न) मित्रता और सामाजिक सम्बन्ध हेतु। कर्म (शनि+सूर्य-लग्न) करियर, व्यवसाय और अधिकार हेतु। रोग (शनि+मंगल-लग्न) रोग और स्वास्थ्य समस्याओं हेतु। विवाह (शुक्र+शनि-लग्न) विवाह और प्रणय साझेदारी हेतु। पुत्र (गुरु+चन्द्र-लग्न) सन्तान हेतु। मृत्यु (शनि+चन्द्र-लग्न) मृत्यु, रूपान्तरण और समाप्तियों हेतु।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;सहम गुरुत्वाकर्षण प्रभाव वाले वास्तविक खगोलीय पिण्ड हैं।&quot; सहम विशुद्ध गणितीय संरचनाएँ हैं — इनका कोई भौतिक अस्तित्व, कोई द्रव्यमान, कोई गुरुत्वाकर्षण नहीं। ये अमूर्त बिन्दु हैं जो तीन कुण्डली कारकों के प्रतीकात्मक सम्बन्ध को एक संवेदनशील अंश में केन्द्रित करते हैं। इन्हें खगोलीय वस्तुओं के बजाय &quot;ज्योतिषीय सदिश&quot; समझें।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Sahams are real celestial bodies with gravitational influence.&quot; Sahams are purely mathematical constructs — they have no physical existence, no mass, no gravitational pull. They are abstract points that concentrate the symbolic relationship between three chart factors into a single sensitive degree. Think of them as &quot;astrological vectors&quot; rather than celestial objects.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>हमारा वर्षफल पृष्ठ वार्षिक कुण्डली से स्वचालित रूप से सभी सहम गणित करता है, उनकी राशिचक्रीय स्थितियाँ, भाव स्थान और राशि स्वामी प्रदर्शित करता है। उपकरण यह भी विश्लेषण करता है कि वर्ष स्वामी प्रत्येक सहम स्वामी से ताजिक योग (इत्थशाल/ईषराफ) बनाता है या नहीं, जिससे उपयोगकर्ताओं को तत्काल चित्र मिलता है कि वर्ष में कौन-से जीवन क्षेत्र &quot;सक्रिय&quot; हैं। यह स्वचालन सहम विश्लेषण को सबके लिए सुलभ बनाता है — पहले केवल 5 सहम मैनुअली गणित करने में भी काफी अंकगणितीय प्रयास लगता था।</>
            : <>Our Varshaphal page computes all Sahams automatically from the annual chart, displaying their zodiacal positions, house placements, and sign lords. The tool also analyzes whether the year lord forms Tajika yogas (Ithasala/Easarapha) with each Saham lord, giving users an immediate picture of which life areas are &quot;activated&quot; for the year. This automation makes Saham analysis accessible to everyone — previously, computing even 5 Sahams manually required significant arithmetic effort.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module21_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
