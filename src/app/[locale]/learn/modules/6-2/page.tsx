'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/6-2.json';

const META: ModuleMeta = {
  id: 'mod_6_2', phase: 2, topic: 'Nakshatra', moduleNumber: '6.2',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'पाद पद्धति — 108 विभाजन' : 'The Pada System — 108 Divisions'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Each of the 27 nakshatras is subdivided into 4 equal parts called padas (quarters or feet). Each pada spans exactly 3 degrees and 20 arc-minutes (3.333... degrees), which is one-fourth of a nakshatra&apos;s 13°20&apos; span. Together, 27 nakshatras x 4 padas produce 108 divisions of the ecliptic. This number — 108 — is one of the most sacred in Hindu tradition, and its astronomical origin lies precisely in this nakshatra-pada structure.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          27 नक्षत्रों में से प्रत्येक को 4 समान भागों में विभक्त किया गया है जिन्हें पाद (चतुर्थांश या चरण) कहते हैं। प्रत्येक पाद ठीक 3 अंश 20 कला (3.333... अंश) में फैला है, जो एक नक्षत्र के 13°20&apos; विस्तार का चौथाई भाग है। मिलकर, 27 नक्षत्र x 4 पाद = क्रान्तिवृत्त के 108 विभाजन। यह संख्या — 108 — हिन्दू परम्परा में सर्वाधिक पवित्र में से एक है, और इसका खगोलीय मूल ठीक इसी नक्षत्र-पाद संरचना में है।
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The critical insight is that these 108 padas map exactly to the 108 Navamsha divisions. The Navamsha (D-9) chart, considered the most important divisional chart in Jyotish after the Rashi (D-1) chart, is derived directly from this pada structure. Each pada corresponds to a specific Navamsha sign, cycling through the 12 signs in a pattern determined by the element of the rashi the nakshatra falls in. This creates an elegant mathematical bridge between the nakshatra system and the rashi-based varga (divisional chart) system.', hi: 'मूल तथ्य यह है कि ये 108 पाद 108 नवांश विभाजनों से ठीक मेल खाते हैं। नवांश (D-9) कुण्डली, जो राशि (D-1) कुण्डली के बाद ज्योतिष में सर्वाधिक महत्त्वपूर्ण वर्ग कुण्डली मानी जाती है, सीधे इसी पाद संरचना से व्युत्पन्न होती है। प्रत्येक पाद एक विशिष्ट नवांश राशि से मेल खाता है, जो 12 राशियों में एक ऐसे क्रम से चक्रित होता है जो नक्षत्र की राशि के तत्त्व द्वारा निर्धारित होता है। यह नक्षत्र पद्धति और राशि-आधारित वर्ग पद्धति के बीच एक सुन्दर गणितीय सेतु बनाता है।', sa: 'मूल तथ्य यह है कि ये 108 पाद 108 नवांश विभाजनों से ठीक मेल खाते हैं। नवांश (D-9) कुण्डली, जो राशि (D-1) कुण्डली के बाद ज्योतिष में सर्वाधिक महत्त्वपूर्ण वर्ग कुण्डली मानी जाती है, सीधे इसी पाद संरचना से व्युत्पन्न होती है। प्रत्येक पाद एक विशिष्ट नवांश राशि से मेल खाता है, जो 12 राशियों में एक ऐसे क्रम से चक्रित होता है जो नक्षत्र की राशि के तत्त्व द्वारा निर्धारित होता है। यह नक्षत्र पद्धति और राशि-आधारित वर्ग पद्धति के बीच एक सुन्दर गणितीय सेतु बनाता है।' }, locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'पवित्र संख्या 108' : 'The Sacred Number 108'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The number 108 pervades Hindu, Buddhist, and Jain traditions. A japa mala (prayer bead necklace) has 108 beads. There are 108 Upanishads in the Muktika canon. Deities have 108 names (Ashtottara Shatanamavali). Temples often have 108 steps. The astronomical basis for this reverence is clear: 108 is the number of unique celestial positions (padas) the Moon can occupy, each carrying distinct cosmic energy. Additionally, the average distance from Earth to the Sun is approximately 108 times the Sun&apos;s diameter, and the average distance to the Moon is approximately 108 times the Moon&apos;s diameter — a remarkable astronomical coincidence that ancient astronomers may have observed.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          108 संख्या हिन्दू, बौद्ध और जैन परम्पराओं में व्याप्त है। जप माला में 108 मनके होते हैं। मुक्तिका संग्रह में 108 उपनिषद हैं। देवताओं के 108 नाम (अष्टोत्तर शतनामावली) हैं। मन्दिरों में प्रायः 108 सीढ़ियाँ होती हैं। इस श्रद्धा का खगोलीय आधार स्पष्ट है: 108 उन अद्वितीय आकाशीय स्थितियों (पादों) की संख्या है जो चन्द्रमा धारण कर सकता है, प्रत्येक विशिष्ट ब्रह्माण्डीय ऊर्जा वहन करता है। इसके अतिरिक्त, पृथ्वी से सूर्य की औसत दूरी सूर्य के व्यास की लगभग 108 गुनी है, और चन्द्रमा की औसत दूरी चन्द्रमा के व्यास की लगभग 108 गुनी है — एक उल्लेखनीय खगोलीय संयोग।
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीय उत्पत्ति' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi ? <>पाद-से-नवांश सम्बन्ध बृहत् पाराशर होरा शास्त्र (BPHS) में प्रलेखित है, जहाँ महर्षि पराशर बताते हैं कि नवांश राशि ग्रह की नक्षत्र पाद में स्थिति से कैसे निर्धारित होती है। वराहमिहिर की बृहत्जातक भी सूक्ष्म व्यक्तित्व विश्लेषण हेतु पाद पद्धति का उपयोग करती है। सूर्य सिद्धान्त प्रत्येक 13°20&apos; नक्षत्र को चार समान भागों में विभक्त करने का गणितीय ढाँचा प्रदान करता है। यह पाद पद्धति भारतीय खगोलशास्त्र में औपचारिक राशि पद्धति से पूर्ववर्ती है — पादों सहित नक्षत्र मूल निर्देशांक जालिका थे।</> : <>The pada-to-Navamsha correspondence is documented in Brihat Parashara Hora Shastra (BPHS), where Sage Parashara explains how the Navamsha sign is determined by the position of a planet within its nakshatra pada. Varahamihira&apos;s Brihat Jataka also uses the pada system for fine-grained personality analysis. The Surya Siddhanta provides the mathematical framework for dividing each 13°20&apos; nakshatra into four equal parts. This pada system predates the formal rashi (sign) system in Indian astronomy — nakshatras with padas were the original coordinate grid.</>}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'प्रत्येक पाद नक्षत्र ऊर्जा को कैसे बदलता है' : 'How Each Pada Modifies Nakshatra Energy'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The base nakshatra provides the foundational energy, but the pada (through its Navamsha sign) colors and directs that energy in specific ways. Consider Ashwini, the nakshatra of swift healing ruled by the Ashwini Kumaras. In pada 1 (Aries Navamsha), the healing energy is directed with cardinal fire — the native is a pioneering, action-oriented healer, perhaps an emergency surgeon or first responder. In pada 2 (Taurus Navamsha), the energy becomes grounded and material — this could manifest as an Ayurvedic practitioner focused on herbal medicine. In pada 3 (Gemini Navamsha), intellectual curiosity flavors the healing — a medical researcher or health communicator. In pada 4 (Cancer Navamsha), nurturing and emotional care dominate — a compassionate nurse, hospice worker, or counselor.', hi: 'मूल नक्षत्र आधारभूत ऊर्जा प्रदान करता है, किन्तु पाद (अपनी नवांश राशि द्वारा) उस ऊर्जा को विशिष्ट रूप से रंगता और निर्देशित करता है। अश्विनी पर विचार करें, अश्विनी कुमारों द्वारा शासित त्वरित चिकित्सा का नक्षत्र। पाद 1 (मेष नवांश) में चिकित्सा ऊर्जा कार्डिनल अग्नि के साथ निर्देशित होती है — जातक एक अग्रणी, क्रियाशील चिकित्सक होता है, सम्भवतः आपातकालीन शल्य चिकित्सक। पाद 2 (वृषभ नवांश) में ऊर्जा स्थिर और भौतिक होती है — यह आयुर्वेदिक चिकित्सक के रूप में प्रकट हो सकती है जो जड़ी-बूटी चिकित्सा पर केन्द्रित हो। पाद 3 (मिथुन नवांश) में बौद्धिक जिज्ञासा चिकित्सा को रंगती है — चिकित्सा शोधकर्ता या स्वास्थ्य संचारक। पाद 4 (कर्क नवांश) में पोषण और भावनात्मक देखभाल प्रधान होती है — एक करुणामय परिचारिका, धर्मशाला कार्यकर्ता, या परामर्शदाता।', sa: 'मूल नक्षत्र आधारभूत ऊर्जा प्रदान करता है, किन्तु पाद (अपनी नवांश राशि द्वारा) उस ऊर्जा को विशिष्ट रूप से रंगता और निर्देशित करता है। अश्विनी पर विचार करें, अश्विनी कुमारों द्वारा शासित त्वरित चिकित्सा का नक्षत्र। पाद 1 (मेष नवांश) में चिकित्सा ऊर्जा कार्डिनल अग्नि के साथ निर्देशित होती है — जातक एक अग्रणी, क्रियाशील चिकित्सक होता है, सम्भवतः आपातकालीन शल्य चिकित्सक। पाद 2 (वृषभ नवांश) में ऊर्जा स्थिर और भौतिक होती है — यह आयुर्वेदिक चिकित्सक के रूप में प्रकट हो सकती है जो जड़ी-बूटी चिकित्सा पर केन्द्रित हो। पाद 3 (मिथुन नवांश) में बौद्धिक जिज्ञासा चिकित्सा को रंगती है — चिकित्सा शोधकर्ता या स्वास्थ्य संचारक। पाद 4 (कर्क नवांश) में पोषण और भावनात्मक देखभाल प्रधान होती है — एक करुणामय परिचारिका, धर्मशाला कार्यकर्ता, या परामर्शदाता।' }, locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'पुष्कर नवांश — सर्वाधिक शुभ पाद' : 'Pushkara Navamshas — The Most Auspicious Padas'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Among the 108 padas, certain ones are designated as Pushkara Navamshas — extraordinarily auspicious positions where planets gain enhanced benefic power. There are 24 Pushkara Navamshas in total, falling in the Navamsha signs of Cancer, Taurus, Pisces, and Sagittarius (signs ruled by Moon, Venus, Jupiter — the natural benefics, plus Jupiter-ruled Sagittarius). Planets placed in Pushkara Navamshas in the birth chart gain a special strength that can mitigate other weaknesses. In muhurta (electional astrology), choosing a time when the Lagna or Moon falls in a Pushkara Navamsha greatly enhances the auspiciousness of the elected moment.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          108 पादों में से कुछ को पुष्कर नवांश के रूप में चिह्नित किया गया है — असाधारण रूप से शुभ स्थान जहाँ ग्रहों का शुभ बल बढ़ जाता है। कुल 24 पुष्कर नवांश हैं, जो कर्क, वृषभ, मीन और धनु (चन्द्र, शुक्र, बृहस्पति — प्राकृतिक शुभ ग्रहों और बृहस्पति-शासित धनु) की नवांश राशियों में पड़ते हैं। जन्म कुण्डली में पुष्कर नवांश में स्थित ग्रहों को एक विशेष बल प्राप्त होता है जो अन्य दुर्बलताओं को कम कर सकता है। मुहूर्त में, जब लग्न या चन्द्रमा पुष्कर नवांश में हो ऐसा समय चुनना चयनित क्षण की शुभता को अत्यधिक बढ़ाता है।
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Examples', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> दो व्यक्तियों पर विचार करें जिनका चन्द्रमा भरणी (मेष 13°20&apos;-26°40&apos;) में है। व्यक्ति A का चन्द्रमा 15° (पाद 1, सिंह नवांश) पर और व्यक्ति B का 25° (पाद 4, वृश्चिक नवांश) पर। दोनों भरणी की शुक्र-शासित, रूपान्तरकारी, यम-शासित ऊर्जा साझा करते हैं। किन्तु व्यक्ति A (सिंह नवांश) इसे राजसी अधिकार, सृजनात्मक आत्मविश्वास और नाटकीय शैली से व्यक्त करता है। व्यक्ति B (वृश्चिक नवांश) उसी ऊर्जा को गहन मनोवैज्ञानिक अन्तर्दृष्टि, तीव्रता और गुप्त रूपान्तरण द्वारा प्रवाहित करता है। समान नक्षत्र, नाटकीय रूप से भिन्न अभिव्यक्ति।</> : <><span className="text-gold-light font-medium">Example:</span> Consider two people both born with Moon in Bharani (13°20&apos;-26°40&apos; Aries). Person A has Moon at 15° (pada 1, Leo Navamsha) and Person B has Moon at 25° (pada 4, Scorpio Navamsha). Both share Bharani&apos;s Venusian, transformative, Yama-ruled energy. However, Person A (Leo Navamsha) expresses this with regal authority, creative confidence, and dramatic flair. Person B (Scorpio Navamsha) channels the same energy through deep psychological insight, intensity, and hidden transformation. Same nakshatra, dramatically different expression.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;पाद पद्धति केवल एक लघु परिशोधन है — नक्षत्र अकेला पर्याप्त है।&quot; वास्तव में, एक ही नक्षत्र किन्तु भिन्न पादों वाले दो व्यक्तियों के व्यक्तित्व, व्यावसायिक झुकाव और जीवन पथ आश्चर्यजनक रूप से भिन्न हो सकते हैं। पाद नवांश स्थान निर्धारित करता है, जो विवाह, धर्म और गहन आत्मिक उद्देश्य को समझने के लिए अत्यन्त महत्त्वपूर्ण है। व्यावसायिक ज्योतिषी सदैव पाद पर विचार करते हैं, केवल नक्षत्र पर नहीं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The pada system is just a minor refinement — the nakshatra alone is sufficient.&quot; In practice, two people with the same nakshatra but different padas can have strikingly different personalities, career inclinations, and life paths. The pada determines the Navamsha placement, which is crucial for understanding marriage, dharma, and the deeper soul-level purpose. Professional astrologers always consider the pada, not just the nakshatra.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'The Navamsha chart (D-9) is universally considered the second most important chart after the birth chart. Since each Navamsha cell maps directly to a nakshatra pada, understanding padas is essential for reading the D-9. Modern Jyotish software, including our application, computes both the nakshatra-pada and the corresponding Navamsha position for all nine planets, enabling users to analyze the deeper karmic dimensions of their chart.', hi: 'नवांश कुण्डली (D-9) को सार्वभौमिक रूप से जन्म कुण्डली के बाद दूसरी सर्वाधिक महत्त्वपूर्ण कुण्डली माना जाता है। चूँकि प्रत्येक नवांश कोष्ठ सीधे एक नक्षत्र पाद से मेल खाता है, D-9 पढ़ने के लिए पाद समझना आवश्यक है। आधुनिक ज्योतिष सॉफ्टवेयर, हमारा अनुप्रयोग सहित, सभी नौ ग्रहों के लिए नक्षत्र-पाद और सम्बन्धित नवांश स्थिति दोनों गणित करता है, जिससे उपयोगकर्ता अपनी कुण्डली के गहन कार्मिक आयामों का विश्लेषण कर सकें।', sa: 'नवांश कुण्डली (D-9) को सार्वभौमिक रूप से जन्म कुण्डली के बाद दूसरी सर्वाधिक महत्त्वपूर्ण कुण्डली माना जाता है। चूँकि प्रत्येक नवांश कोष्ठ सीधे एक नक्षत्र पाद से मेल खाता है, D-9 पढ़ने के लिए पाद समझना आवश्यक है। आधुनिक ज्योतिष सॉफ्टवेयर, हमारा अनुप्रयोग सहित, सभी नौ ग्रहों के लिए नक्षत्र-पाद और सम्बन्धित नवांश स्थिति दोनों गणित करता है, जिससे उपयोगकर्ता अपनी कुण्डली के गहन कार्मिक आयामों का विश्लेषण कर सकें।' }, locale)}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'व्यावहारिक गणना — नक्षत्र एवं पाद ज्ञात करना' : 'Practical Calculation — Finding Nakshatra & Pada'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'To determine the nakshatra and pada from a sidereal longitude, follow this algorithm. Given the Moon&apos;s sidereal longitude L (in degrees): Step 1 — Nakshatra index = floor(L / 13.333). Step 2 — Nakshatra number = index + 1 (since nakshatras are 1-based). Step 3 — Position within nakshatra = L - (index x 13.333). Step 4 — Pada = floor(position / 3.333) + 1. This gives a pada from 1 to 4.', hi: 'निरयन भोगांश से नक्षत्र और पाद निर्धारित करने के लिए यह एल्गोरिदम अपनाएँ। चन्द्रमा का निरयन भोगांश L (अंशों में) दिया गया हो: चरण 1 — नक्षत्र सूचकांक = floor(L / 13.333)। चरण 2 — नक्षत्र संख्या = सूचकांक + 1 (क्योंकि नक्षत्र 1-आधारित हैं)। चरण 3 — नक्षत्र में स्थिति = L - (सूचकांक x 13.333)। चरण 4 — पाद = floor(स्थिति / 3.333) + 1। इससे 1 से 4 तक का पाद प्राप्त होता है।', sa: 'निरयन भोगांश से नक्षत्र और पाद निर्धारित करने के लिए यह एल्गोरिदम अपनाएँ। चन्द्रमा का निरयन भोगांश L (अंशों में) दिया गया हो: चरण 1 — नक्षत्र सूचकांक = floor(L / 13.333)। चरण 2 — नक्षत्र संख्या = सूचकांक + 1 (क्योंकि नक्षत्र 1-आधारित हैं)। चरण 3 — नक्षत्र में स्थिति = L - (सूचकांक x 13.333)। चरण 4 — पाद = floor(स्थिति / 3.333) + 1। इससे 1 से 4 तक का पाद प्राप्त होता है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Examples', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण 1:</span> चन्द्रमा 167.3° पर। चरण 1: floor(167.3 / 13.333) = floor(12.548) = 12। चरण 2: नक्षत्र = 12 + 1 = 13 → हस्त (160° से 173.33° तक)। चरण 3: स्थिति = 167.3 - (12 x 13.333) = 167.3 - 160 = 7.3°। चरण 4: पाद = floor(7.3 / 3.333) + 1 = floor(2.19) + 1 = 2 + 1 = 3। परिणाम: हस्त पाद 3।</> : <><span className="text-gold-light font-medium">Example 1:</span> Moon at 167.3°. Step 1: floor(167.3 / 13.333) = floor(12.548) = 12. Step 2: Nakshatra = 12 + 1 = 13 → Hasta (spanning 160° to 173.33°). Step 3: Position = 167.3 - (12 x 13.333) = 167.3 - 160 = 7.3°. Step 4: Pada = floor(7.3 / 3.333) + 1 = floor(2.19) + 1 = 2 + 1 = 3. Result: Hasta pada 3.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण 2:</span> चन्द्रमा 280.5° पर। चरण 1: floor(280.5 / 13.333) = floor(21.038) = 21। चरण 2: नक्षत्र = 21 + 1 = 22 → श्रवण (280° से 293.33° तक)। चरण 3: स्थिति = 280.5 - (21 x 13.333) = 280.5 - 280 = 0.5°। चरण 4: पाद = floor(0.5 / 3.333) + 1 = 0 + 1 = 1। परिणाम: श्रवण पाद 1।</> : <><span className="text-gold-light font-medium">Example 2:</span> Moon at 280.5°. Step 1: floor(280.5 / 13.333) = floor(21.038) = 21. Step 2: Nakshatra = 21 + 1 = 22 → Shravana (spanning 280° to 293.33°). Step 3: Position = 280.5 - (21 x 13.333) = 280.5 - 280 = 0.5°. Step 4: Pada = floor(0.5 / 3.333) + 1 = 0 + 1 = 1. Result: Shravana pada 1.</>}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'पाद से नवांश राशि' : 'Navamsha Sign from Pada'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'To find the Navamsha sign, you need to know which rashi (sign) the pada falls in, and that rashi&apos;s element. The Navamsha cycle starting sign depends on the element: Fire signs (Aries, Leo, Sagittarius) start from Aries. Earth signs (Taurus, Virgo, Capricorn) start from Capricorn. Air signs (Gemini, Libra, Aquarius) start from Libra. Water signs (Cancer, Scorpio, Pisces) start from Cancer. Then count forward from the starting sign by the number of padas elapsed within that rashi.', hi: 'नवांश राशि ज्ञात करने के लिए, यह जानना आवश्यक है कि पाद किस राशि में पड़ता है और उस राशि का तत्त्व क्या है। नवांश चक्र की आरम्भ राशि तत्त्व पर निर्भर करती है: अग्नि राशियाँ (मेष, सिंह, धनु) मेष से आरम्भ। पृथ्वी राशियाँ (वृषभ, कन्या, मकर) मकर से। वायु राशियाँ (मिथुन, तुला, कुम्भ) तुला से। जल राशियाँ (कर्क, वृश्चिक, मीन) कर्क से। फिर उस राशि में बीते हुए पादों की संख्या द्वारा आरम्भ राशि से आगे गिनें।', sa: 'नवांश राशि ज्ञात करने के लिए, यह जानना आवश्यक है कि पाद किस राशि में पड़ता है और उस राशि का तत्त्व क्या है। नवांश चक्र की आरम्भ राशि तत्त्व पर निर्भर करती है: अग्नि राशियाँ (मेष, सिंह, धनु) मेष से आरम्भ। पृथ्वी राशियाँ (वृषभ, कन्या, मकर) मकर से। वायु राशियाँ (मिथुन, तुला, कुम्भ) तुला से। जल राशियाँ (कर्क, वृश्चिक, मीन) कर्क से। फिर उस राशि में बीते हुए पादों की संख्या द्वारा आरम्भ राशि से आगे गिनें।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For our Hasta pada 3 example: Hasta falls in Virgo (an earth sign). Earth signs start Navamsha from Capricorn. Hasta pada 3 is the 7th Navamsha within Virgo. Counting from Capricorn: Cap(1), Aqu(2), Pis(3), Ari(4), Tau(5), Gem(6), Can(7). So Hasta pada 3 = Cancer Navamsha.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;पाद की नवांश राशि सदैव नक्षत्र की राशि के समान होती है।&quot; यह गलत है। नवांश राशि प्रत्येक राशि के 9 नवांशों में सभी 12 राशियों से चक्रित होती है। केवल अग्नि राशि का प्रथम नवांश मेल खाता है। पाद की नवांश राशि प्रायः नक्षत्र की राशि से पूर्णतया भिन्न होती है, और ठीक यही इसे विश्लेषणात्मक रूप से मूल्यवान बनाता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The Navamsha sign of a pada is always the same rashi as the nakshatra.&quot; This is incorrect. The Navamsha sign cycles through all 12 signs across the 9 Navamshas within each rashi. Only the first Navamsha of a fire sign rashi happens to match. The pada&apos;s Navamsha sign is often completely different from the rashi the nakshatra falls in, which is precisely what makes it analytically valuable.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Precise pada calculation is essential for accurate Navamsha chart generation. A rounding error of even 1° near a pada boundary can place a planet in the wrong Navamsha sign, fundamentally changing the interpretation. Our application uses double-precision floating-point arithmetic for all longitude calculations, ensuring pada boundaries are computed to sub-arc-second accuracy.', hi: 'सटीक पाद गणना सही नवांश कुण्डली निर्माण के लिए अनिवार्य है। पाद सीमा के निकट 1° की पूर्णांकन त्रुटि भी ग्रह को गलत नवांश राशि में रख सकती है, जिससे व्याख्या मूलभूत रूप से बदल जाती है। हमारा अनुप्रयोग सभी भोगांश गणनाओं के लिए डबल-प्रेसिशन फ्लोटिंग-पॉइंट अंकगणित का उपयोग करता है, जिससे पाद सीमाएँ कला-सेकण्ड से भी अधिक सटीकता से गणित होती हैं।', sa: 'सटीक पाद गणना सही नवांश कुण्डली निर्माण के लिए अनिवार्य है। पाद सीमा के निकट 1° की पूर्णांकन त्रुटि भी ग्रह को गलत नवांश राशि में रख सकती है, जिससे व्याख्या मूलभूत रूप से बदल जाती है। हमारा अनुप्रयोग सभी भोगांश गणनाओं के लिए डबल-प्रेसिशन फ्लोटिंग-पॉइंट अंकगणित का उपयोग करता है, जिससे पाद सीमाएँ कला-सेकण्ड से भी अधिक सटीकता से गणित होती हैं।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module6_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
