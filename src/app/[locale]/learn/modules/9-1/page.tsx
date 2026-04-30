'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/9-1.json';

const META: ModuleMeta = {
  id: 'mod_9_1', phase: 3, topic: 'Kundali', moduleNumber: '9.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
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
          {tl({ en: 'What is a Kundali?', hi: 'कुण्डली क्या है?', sa: 'कुण्डली क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कुण्डली (जन्म पत्रिका) आपके जन्म के सटीक क्षण और स्थान पर आकाश का एक सटीक नक्शा है। कल्पना कीजिए कि जन्म के क्षण में आप बाहर खड़े होकर क्षितिज से क्षितिज तक पूरे आकाश का चित्र खींच रहे हैं — कुण्डली उसी चित्र का ज्यामितीय रूपांतरण है।</> : <>A Kundali (also called Janma Patrika or birth chart) is a precise map of the sky frozen at the exact moment and location of your birth. Imagine stepping outside the instant you were born and photographing the entire dome of the sky from horizon to horizon — the Kundali is that photograph rendered as a geometric diagram.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कुण्डली में तीन मूलभूत तत्व होते हैं: <strong className="text-gold-light">12 भाव</strong> जो जीवन के क्षेत्र दर्शाते हैं, <strong className="text-gold-light">12 राशियाँ</strong> जो पृष्ठभूमि प्रदान करती हैं, और <strong className="text-gold-light">9 ग्रह</strong> — सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु और केतु — जो इनमें स्थापित होते हैं। लग्न (जन्म के समय पूर्वी क्षितिज पर उदय होने वाली राशि) पूरी संरचना का आधार है।</> : <>The chart contains three fundamental components: <strong className="text-gold-light">12 Houses (Bhavas)</strong> representing life areas, <strong className="text-gold-light">12 Signs (Rashis)</strong> providing the backdrop, and <strong className="text-gold-light">9 Planets (Grahas)</strong> — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu — placed within them. The Ascendant (Lagna), the sign rising on the eastern horizon at birth, anchors the entire structure and determines which house is which.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कुण्डली को समझने की कुंजी: ग्रह &quot;क्या&quot; (ऊर्जा का प्रकार), राशि &quot;कैसे&quot; (अभिव्यक्ति की शैली), और भाव &quot;कहाँ&quot; (जीवन का क्षेत्र) बताता है। उदाहरण: मंगल (साहस) + मकर (अनुशासित) + 10वें भाव (कैरियर) = एक अनुशासित, महत्वाकांक्षी पेशेवर जो नेतृत्व में उत्कृष्ट होता है।</> : <>The key to understanding a Kundali: planets tell you &quot;what&quot; (type of energy), signs tell you &quot;how&quot; (style of expression), and houses tell you &quot;where&quot; (life area). Example: Mars (courage) + Capricorn (disciplined) + 10th house (career) = a disciplined, ambitious professional who excels in leadership.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>कुण्डली निर्माण BPHS अध्याय 2-5 में वर्णित है। वराहमिहिर की बृहत् जातक (छठी शताब्दी) ने गणना विधियों को परिष्कृत किया।</> : <>Kundali construction is codified in BPHS Chapters 2-5. Varahamihira&apos;s Brihat Jataka (6th century CE) refined the computational methods.</>}</p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Chart Styles: North vs South Indian', hi: 'कुण्डली शैलियाँ: उत्तर बनाम दक्षिण', sa: 'कुण्डली शैलियाँ: उत्तर बनाम दक्षिण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <><strong className="text-gold-light">उत्तर भारतीय (हीरा)</strong>: 12 भाव स्थिर, राशियाँ घूमती हैं। शीर्ष हीरा सदैव लग्न। भाव संबंध एक नज़र में दिखते हैं।</> : <><strong className="text-gold-light">North Indian (Diamond)</strong>: The 12 houses are fixed in a diamond pattern. The top diamond is always the 1st house (Lagna). Signs rotate. This style makes it easy to see house relationships at a glance.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <><strong className="text-gold-light">दक्षिण भारतीय (ग्रिड)</strong>: 4x4 ग्रिड जहाँ राशियाँ स्थायी, भाव लग्न के अनुसार घूमते हैं। विभिन्न कुण्डलियों में ग्रहों की राशि स्थिति तुलना करना सरल।</> : <><strong className="text-gold-light">South Indian (Grid)</strong>: A 4x4 grid where signs are permanently fixed — Pisces always top-left. Houses rotate based on Lagna. This makes it easy to track planets through signs across different charts.</>}</p>
      </section>
    </div>
  );
}

/* Page 2: The Lagna (Ascendant) */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Lagna (Ascendant) — The Chart&apos;s Foundation', hi: 'लग्न — कुण्डली की नींव', sa: 'लग्न — कुण्डली की नींव' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>लग्न पूरी कुण्डली का सबसे महत्वपूर्ण बिन्दु है। यह राशिचक्र का वह सटीक अंश है जो जन्म के क्षण और स्थान पर पूर्वी क्षितिज पर उदय हो रहा था। लग्न प्रथम भाव निर्धारित करता है, और शेष सभी भाव इससे आगे बढ़ते हैं।</> : <>The Lagna is the most important single point in the entire Kundali. It is the exact degree of the zodiac sign that was rising on the eastern horizon at the moment and place of birth. The Lagna determines the 1st house, and all other houses cascade from it.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चूँकि पृथ्वी 24 घंटों में 360 अंश घूमती है, लग्न लगभग <strong className="text-gold-light">हर 4 मिनट में 1 अंश</strong> बढ़ता है। एक नई राशि लगभग हर 2 घंटे में उदय होती है। इसीलिए जन्म समय में कुछ मिनटों की त्रुटि भी कुण्डली को काफ़ी बदल सकती है।</> : <>Because the Earth rotates 360 degrees in 24 hours, the Lagna moves at roughly <strong className="text-gold-light">1 degree every 4 minutes</strong>. A new sign rises approximately every 2 hours (varying by latitude). This is why even a few minutes of birth time error can significantly alter the chart.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>लग्न की सटीकता इतनी महत्वपूर्ण है कि वैदिक ज्योतिष में <strong className="text-gold-light">जन्म समय शोधन</strong> (Birth Time Rectification) एक पूर्ण विषय है। ज्ञात जीवन घटनाओं (विवाह, सन्तान, करियर परिवर्तन) को दशा और गोचर से मिलाकर सही जन्म समय (और इस प्रकार सही लग्न) का निर्धारण किया जाता है।</> : <>The Lagna&apos;s precision is so critical that <strong className="text-gold-light">Birth Time Rectification</strong> is an entire sub-discipline in Vedic astrology. Known life events (marriage, children, career changes) are matched against dasha periods and transits to determine the exact birth time (and therefore the correct Lagna). Even a difference of 5-10 minutes can shift the Lagna degree enough to change divisional charts like the Navamsha (D-9).</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> दिल्ली में सुबह 6:15 बजे जन्मे बच्चे का सिंह लग्न होगा। प्रथम भाव सिंह, सप्तम कुम्भ (विवाह), दशम वृषभ (कर्म)। 20 मिनट बाद 6:35 बजे जन्मे बच्चे का लग्न अंश बदलता है — अभी भी सिंह, लेकिन वर्ग कुण्डलियों पर प्रभाव। 2 घंटे बाद? कन्या लग्न — पूरी भाव संरचना बदल जाती है।</> : <><span className="text-gold-light font-medium">Example:</span> A child born at 6:15 AM in Delhi has Leo (Simha) rising. 1st house is Leo, 7th is Aquarius (marriage), 10th is Taurus (career). Born 20 minutes later at 6:35 AM, the Lagna shifts about 5 degrees — still Leo, but divisional charts (Navamsha, Dashamsha) may differ. Born 2 hours later? Now Virgo rises, and the entire house structure reshuffles.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रांतियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;मेरी सूर्य राशि ही मेरी कुण्डली है।&quot; वैदिक ज्योतिष में सूर्य राशि दर्जनों कारकों में से केवल एक है। लग्न सूर्य राशि से कहीं अधिक निर्णायक है।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;My Sun sign IS my chart.&quot; In Vedic astrology, the Sun sign is just one of dozens of factors. The Lagna is far more defining.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;वैदिक और पश्चिमी राशि एक ही है।&quot; वैदिक ज्योतिष निरयण (सायन से ~24° पीछे) राशिचक्र का उपयोग करता है। आपकी पश्चिमी सूर्य राशि और वैदिक सूर्य राशि अक्सर भिन्न होती है।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;Vedic and Western signs are the same.&quot; Vedic astrology uses the sidereal zodiac (shifted ~24 degrees from tropical). Your Western Sun sign and Vedic Sun sign are often different.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;जन्म समय अनुमानित ठीक है।&quot; 15-20 मिनट की त्रुटि लग्न अंश और वर्ग कुण्डलियाँ बदल सकती है।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;An approximate birth time is fine.&quot; A 15-20 minute error can change the Lagna degree and divisional charts entirely. Hospital records, not family memory, are the gold standard.</>}</p>
      </section>
    </div>
  );
}

/* Page 3: Reading the Chart */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Planets in Houses and Signs', hi: 'भावों और राशियों में ग्रह', sa: 'भावों और राशियों में ग्रह' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रत्येक ग्रह एक विशिष्ट भाव और राशि में एक साथ स्थित होता है। <strong className="text-gold-light">भाव</strong> बताता है कि जीवन का कौन सा क्षेत्र प्रभावित है। <strong className="text-gold-light">राशि</strong> बताती है कि ग्रह कैसे अभिव्यक्त होता है। ग्रह स्वयं बताता है कि कौन सी ऊर्जा कार्यरत है।</> : <>Each planet occupies a specific house and sign simultaneously. The <strong className="text-gold-light">house</strong> tells you the life area affected. The <strong className="text-gold-light">sign</strong> tells you how the planet expresses itself. The planet itself tells you what energy is at work.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <><strong className="text-gold-light">युति</strong> तब होती है जब दो या अधिक ग्रह एक ही राशि में हों। <strong className="text-gold-light">दृष्टि</strong> प्रभाव की रेखाएँ हैं — सभी ग्रह 7वें भाव को देखते हैं, मंगल 4वें और 8वें, बृहस्पति 5वें और 9वें, शनि 3वें और 10वें को भी देखता है। <strong className="text-gold-light">भाव स्वामित्व</strong> — प्रत्येक भाव का स्वामी उसमें स्थित राशि का शासक ग्रह है।</> : <><strong className="text-gold-light">Conjunction</strong> occurs when two or more planets occupy the same sign. <strong className="text-gold-light">Aspects (Drishti)</strong> are lines of influence — all planets aspect the 7th, Mars also aspects 4th and 8th, Jupiter 5th and 9th, Saturn 3rd and 10th. <strong className="text-gold-light">House lordship</strong> — each house is owned by the planet ruling the sign in it.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example: Chart Walkthrough', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 10: [2], 2: [4] }} title={tl({ en: 'Aries Lagna — Mars in 10th, Jupiter in 2nd', hi: 'मेष लग्न — मंगल दशम में, बृहस्पति द्वितीय में', sa: 'मेष लग्न — मंगल दशम में, बृहस्पति द्वितीय में' }, locale)} highlight={[10, 2]} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> मेष लग्न। मंगल दशम भाव (मकर — उच्च) में = आत्म कर्म की ओर अधिकतम शक्ति से। बृहस्पति द्वितीय से 9वीं दृष्टि दशम पर = <strong className="text-gold-light">राजयोग</strong> (त्रिकोण स्वामी केन्द्र पर)। कैरियर सफलता धर्म और ज्ञान से जुड़ जाती है।</> : <><span className="text-gold-light font-medium">Example:</span> Aries Lagna. Mars in the 10th (Capricorn — exaltation) = the self directed toward career with maximum strength. Jupiter in the 2nd aspecting the 10th with its 9th aspect = <strong className="text-gold-light">Raja Yoga</strong> (Trikona lord aspecting a Kendra). Career success comes with dharma and wisdom attached.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रांतियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;8वें भाव में ग्रह सदैव बुरा है।&quot; वास्तविकता: 8वाँ भाव रूपान्तरण, गुप्त ज्ञान और विरासत से भी जुड़ा है। बृहस्पति 8वें में दीर्घायु और आध्यात्मिक अन्तर्दृष्टि दे सकता है।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;A planet in the 8th house is always bad.&quot; Reality: the 8th house also represents transformation, hidden knowledge, and inheritance. Jupiter in the 8th can give longevity and spiritual insight. Context matters.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;अधिक ग्रह = अधिक शक्तिशाली भाव।&quot; वास्तविकता: कई ग्रह एक भाव में हों तो ऊर्जाएँ टकरा सकती हैं। गुणवत्ता मात्रा से अधिक महत्वपूर्ण है।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;More planets = more powerful house.&quot; Reality: multiple planets in one house can create conflicting energies. Quality (dignity, lordship) matters more than quantity.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा ऐप मीअस एल्गोरिदम से कुण्डली बनाता है — सूर्य 0.01° और चन्द्र 0.5° तक सटीक। आप उत्तर भारतीय प्रारूप में कुण्डली देख सकते हैं और AI-जनित टिप्पणी प्राप्त कर सकते हैं। मॉड्यूल 9.2 में भाव वर्गीकरण और 9.3 में ग्रह गरिमा (उच्च/नीच) विस्तार से समझाये गये हैं।</> : <>Our app generates your Kundali using Meeus algorithms — accurate to 0.01 degrees for the Sun and 0.5 degrees for the Moon. You can view your chart in North Indian format and receive AI-generated tippanni commentary. See Module 9.2 for house classifications and yogas, and Module 9.3 for planetary dignities (exaltation/debilitation).</>}</p>
      </section>
    </div>
  );
}

export default function Module9_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
