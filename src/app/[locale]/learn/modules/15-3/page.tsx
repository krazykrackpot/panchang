'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/15-3.json';

const META: ModuleMeta = {
  id: 'mod_15_3', phase: 4, topic: 'Prashna & Advanced', moduleNumber: '15.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
  crossRefs: (L.crossRefs as unknown as Array<{ label: ModuleMeta['title']; href: string }>).map(cr => ({ label: cr.label, href: cr.href })),
};

const QUESTIONS: ModuleQuestion[] = (L.questions as unknown as ModuleQuestion[]);

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'प्रश्न क्या है?' : 'What Is Prashna?'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>प्रश्न (शाब्दिक अर्थ &quot;सवाल&quot;) वैदिक ज्योतिष की एक शाखा है जहाँ कुण्डली जन्म के क्षण के लिए नहीं, बल्कि प्रश्नकर्ता के मन में प्रश्न उत्पन्न होने के सटीक क्षण के लिए बनाई जाती है। यह पश्चिमी होरेरी ज्योतिष का भारतीय समकक्ष है, यद्यपि वैदिक परम्परा पश्चिमी होरेरी से शताब्दियों पुरानी है। मूलभूत आधार क्रान्तिकारी है: आपको जन्म डेटा की बिल्कुल आवश्यकता नहीं। ईमानदार पूछताछ के क्षण की ब्रह्माण्डीय विन्यास अपने भीतर उत्तर का बीज धारण करती है।</>

            : <>Prashna (literally &quot;question&quot;) is a branch of Vedic Jyotish where the chart is cast not for the moment of birth, but for the exact moment a question arises in the querent&apos;s mind. This is the Indian equivalent of Western Horary astrology, though the Vedic tradition predates Western horary by centuries. The fundamental premise is revolutionary: you do not need birth data at all. The cosmic configuration at the moment of sincere inquiry contains within it the seed of the answer.</>}

        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>ईमानदारी का सिद्धान्त सर्वोपरि है। प्रश्न वास्तविक चिन्ता से स्वाभाविक रूप से उत्पन्न होना चाहिए — परीक्षण के रूप में नहीं, व्यर्थ नहीं, और बार-बार नहीं। शास्त्रीय ग्रन्थ चेतावनी देते हैं कि एक ही प्रश्न बार-बार पूछने से परिणाम क्रमशः अविश्वसनीय होते जाते हैं, क्योंकि मूल ब्रह्माण्डीय छाप तनु हो जाती है। पूछताछ के क्षण प्रश्नकर्ता की मनोदशा — उनकी चिन्ता, आशा, हताशा या शान्ति — शाब्दिक रूप से उस क्षण की ग्रहीय विन्यास पर अंकित होती है। इस दृष्टिकोण में ब्रह्माण्ड मानवीय स्थिति का वास्तविक समय में प्रत्युत्तर दे रहा है।</>

            : <>The sincerity principle is paramount. The question must arise naturally from genuine concern — not as a test, not frivolously, and not repeatedly. Classical texts warn that asking the same question multiple times yields increasingly unreliable results, because the original cosmic imprint has been diluted. The querent&apos;s state of mind at the moment of inquiry — their anxiety, hope, desperation, or calm — literally imprints on the planetary configuration of that moment. The universe, in this view, is responding to the human condition in real time.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'जब प्रश्न अपरिहार्य हो' : 'When Prashna Is Indispensable'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Prashna becomes essential in several scenarios: (1) Birth time is unknown or unreliable — a vast number of people, especially in older generations, do not have exact birth times. (2) A specific urgent question demands an immediate answer — &quot;Will this business deal succeed?&quot; &quot;Is the missing person safe?&quot; &quot;Will I get the visa?&quot; (3) Cross-verification — a skilled astrologer uses Prashna to verify findings from the natal chart. If the Prashna chart aligns with natal predictions, confidence in the reading is greatly increased. Prashna is not a replacement for natal astrology but a powerful complement.
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'प्रश्न कुण्डली का पठन' : 'Reading a Prashna Chart'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Prashna chart follows the same structural rules as a natal chart — 12 houses, planetary positions, aspects, and dignities. But the interpretive lens shifts. The Lagna (ascendant) represents the querent — their situation, resources, and current state. The 7th house represents the &quot;other&quot; — the opponent in a legal dispute, the prospective spouse in a marriage question, the business partner, or the general subject of inquiry. The relationship between the 1st and 7th house lords determines whether the matter favors the querent or the other party.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          प्रश्न कुण्डली जन्म कुण्डली के समान संरचनात्मक नियमों का पालन करती है — 12 भाव, ग्रह स्थिति, दृष्टि और गरिमा। परन्तु व्याख्यात्मक दृष्टिकोण बदलता है। लग्न प्रश्नकर्ता का प्रतिनिधित्व करता है — उनकी स्थिति, संसाधन और वर्तमान अवस्था। 7वाँ भाव &quot;अन्य&quot; का प्रतिनिधित्व करता है — कानूनी विवाद में प्रतिद्वन्द्वी, विवाह प्रश्न में भावी पति/पत्नी, व्यापारिक साझेदार, या पूछताछ का सामान्य विषय। 1ले और 7वें भाव के स्वामियों का सम्बन्ध निर्धारित करता है कि मामला प्रश्नकर्ता या दूसरे पक्ष का पक्ष लेता है।
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>चन्द्रमा प्रश्न में सबसे महत्त्वपूर्ण कारक है। चन्द्रमा प्रश्नकर्ता के मन और घटनाओं के प्रवाह का प्रतिनिधित्व करता है। इसकी स्थिति कहानी बताती है: केन्द्र या त्रिकोण में प्रबल, शुभ-दृष्ट चन्द्रमा अनुकूल परिणाम इंगित करता है। शून्य गति (void of course) चन्द्रमा (अपनी राशि छोड़ने से पहले कोई अनुप्रयुक्त दृष्टि नहीं बनाता) दृढ़ता से सुझाता है कि मामला फलीभूत नहीं होगा — बिना निश्चित परिणाम के निष्प्रभ हो जाएगा। चन्द्रमा से अन्य ग्रहों तक अनुप्रयुक्त दृष्टियाँ विकसित हो रही घटनाएँ दर्शाती हैं; पृथक्करण दृष्टियाँ पहले ही बीत चुके अवसर दर्शाती हैं।</>

            : <>The Moon is the single most critical factor in Prashna. The Moon represents the querent&apos;s mind and the flow of events. Its condition tells the story: a strong, well-aspected Moon in a kendra or trikona indicates a favorable outcome. A Moon that is void of course (making no further applying aspects before leaving its sign) strongly suggests the matter will not come to fruition — it will fizzle out with no definitive result. Applying aspects from the Moon to other planets show events that are developing; separating aspects show opportunities that have already passed.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण: &quot;क्या मुझे नौकरी मिलेगी?&quot;' : 'Worked Example: &quot;Will I Get the Job?&quot;'}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title={isHi ? 'मेष लग्न — सूर्य दशम में, चन्द्र चतुर्थ में, बृहस्पति नवम में' : 'Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th'}
          highlight={[10, 4]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <><span className="text-gold-light font-medium">स्थिति:</span> प्रश्नकर्ता के पूछने के सटीक क्षण पर कुण्डली बनाई जाती है। लग्न = प्रश्नकर्ता, 7वाँ भाव = नियोक्ता, 10वाँ भाव = कैरियर/नौकरी, 6ठा भाव = सेवा/रोजगार। यदि चन्द्रमा 10वें भाव के स्वामी से त्रिकोण दृष्टि बनाता है तो नौकरी आ रही है। यदि 1ले और 7वें भाव के स्वामी परस्पर दृष्टि या युति में हैं तो दोनों पक्ष सहमत होने के इच्छुक हैं।</>

            : <><span className="text-gold-light font-medium">Setup:</span> Chart cast at the exact moment the querent asks. Lagna = querent, 7th house = the employer, 10th house = career/job itself, 6th house = service/employment. If the Moon applies to a trine with the 10th lord, the job is coming. If the 1st lord and 7th lord are in mutual aspect or conjunction, both parties are inclined to agree.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रश्न में चेतावनी संकेत' : 'Red Flags in Prashna'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Several configurations warn against a favorable outcome: Moon void of course (no result), Moon in 6th, 8th, or 12th house (obstacles, hidden enemies, losses), malefics in the Lagna (querent faces hardship), the 7th lord stronger than the 1st lord (the other party dominates). Combustion of key significators (too close to the Sun) is also negative — the matter is &quot;burnt up&quot; or obscured. If the Lagna is in the last degrees of a sign (Gandanta or sandhya), the chart itself may be unreadable.
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'अष्टमंगल प्रश्न — केरल परम्परा' : 'Ashtamangala Prashna — The Kerala Tradition'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Ashtamangala Prashna is a unique divination system from the Kerala school of astrology that combines horary chart analysis with a symbolic object-based system. The word &quot;Ashtamangala&quot; means &quot;eight auspicious things&quot; — referring to eight sacred objects that carry deep symbolic meaning: Darpana (Mirror) — clarity, self-reflection, truth; Bhringara (Vessel/Kumbha) — abundance, nourishment; Matsya (Fish) — prosperity, fertility, freedom; Deepa (Lamp) — knowledge, illumination, divine guidance; Simhasana (Throne) — authority, power, royal support; Vrishabha (Bull) — strength, dharma, steadfastness; Dhvaja (Flag) — victory, fame, achievement; and Chamara (Fan) — service, devotion, royal comfort.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          अष्टमंगल प्रश्न केरल ज्योतिष विद्यालय की एक अनूठी भविष्यवाणी पद्धति है जो होरेरी कुण्डली विश्लेषण को प्रतीकात्मक वस्तु-आधारित प्रणाली से संयुक्त करती है। &quot;अष्टमंगल&quot; शब्द का अर्थ है &quot;आठ शुभ वस्तुएँ&quot; — आठ पवित्र वस्तुओं को सन्दर्भित करता है जो गहरा प्रतीकात्मक अर्थ रखती हैं: दर्पण — स्पष्टता, आत्म-चिन्तन, सत्य; भृंगार (कुम्भ) — प्रचुरता, पोषण; मत्स्य — समृद्धि, उर्वरता, स्वतन्त्रता; दीप — ज्ञान, प्रकाश, दिव्य मार्गदर्शन; सिंहासन — अधिकार, शक्ति, राजकीय सहायता; वृषभ — बल, धर्म, दृढ़ता; ध्वज — विजय, यश, उपलब्धि; और चामर — सेवा, भक्ति, राजकीय सुख।
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The querent provides three numbers between 1 and 108, chosen spontaneously. These numbers are processed through a mathematical system: each is divided by 8 to determine which Ashtamangala object it maps to (the remainder determines the object, with 0 mapping to the 8th). The three objects together tell a story. A combination of Deepa + Simhasana + Dhvaja might indicate illuminated authority leading to victory — an excellent sign for a career question. The objects are then cross-referenced with the Prashna chart for layered analysis.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रश्न के लिए आदर्श समय' : 'Ideal Times for Prashna'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Classical texts recommend specific auspicious times for Prashna: Brahma Muhurta (approximately 1.5 hours before sunrise) is considered the most sattvic and spiritually clear time — the mind is fresh, worldly distractions are minimal, and the cosmic field is receptive. Abhijit Muhurta (the 8th muhurta of the day, approximately 24 minutes around solar noon) is another powerful window — it is ruled by Vishnu and is considered universally auspicious. Avoid asking questions during Rahu Kalam, Yamagandam, or Gulika Kalam.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          शास्त्रीय ग्रन्थ प्रश्न के लिए विशिष्ट शुभ समय अनुशंसित करते हैं: ब्रह्म मुहूर्त (सूर्योदय से लगभग 1.5 घण्टे पहले) सबसे सात्त्विक और आध्यात्मिक रूप से स्वच्छ समय माना जाता है — मन ताज़ा है, सांसारिक विक्षेप न्यूनतम हैं, और ब्रह्माण्डीय क्षेत्र ग्रहणशील है। अभिजित मुहूर्त (दिन का 8वाँ मुहूर्त, सौर मध्याह्न के आसपास लगभग 24 मिनट) एक और शक्तिशाली अवधि है — यह विष्णु-शासित और सार्वभौमिक शुभ माना जाता है। राहु काल, यमगण्डम या गुलिक काल में प्रश्न पूछने से बचें।
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'स्वयं आज़माएँ' : 'Try It Yourself'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our Prashna tool generates a chart for the current moment, analyzing the Lagna, Moon condition, and house lords to provide guidance on your question. The Ashtamangala Prashna tool adds the eight-object symbolic layer — you provide three numbers and receive a combined chart + object analysis. Remember the sincerity principle: ask only when a genuine question weighs on your mind. The tools implement the classical rules of Prashna Marga and Krishneeya — two authoritative Kerala texts on horary astrology.
        </p>
      </section>
    </div>
  );
}

export default function Module15_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
