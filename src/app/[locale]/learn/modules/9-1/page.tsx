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

      {/* 12 Houses Table */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The 12 Houses (Bhavas) and Their Meanings', hi: '12 भाव और उनके अर्थ', sa: '12 भाव और उनके अर्थ' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रत्येक भाव जीवन के एक विशिष्ट क्षेत्र को नियन्त्रित करता है। लग्न (उदय राशि) प्रथम भाव बनता है, और शेष भाव राशिचक्र क्रम में आगे बढ़ते हैं।</> : <>Each house governs a specific domain of life. The Lagna (rising sign) becomes the 1st house, and the remaining houses proceed in zodiacal order from there.</>}</p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary text-xs py-2 pr-2">#</th>
                <th className="text-left text-gold-light text-xs py-2 pr-3">{isHi ? 'संस्कृत नाम' : 'Sanskrit Name'}</th>
                <th className="text-left text-text-tertiary text-xs py-2">{isHi ? 'जीवन क्षेत्र' : 'Life Area'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary text-xs">
              {[
                { n: 1, sa: 'Tanu', en: 'Self, personality, physical body, vitality', hi: 'व्यक्तित्व, शरीर, जीवन शक्ति' },
                { n: 2, sa: 'Dhana', en: 'Wealth, family, speech, food, early education', hi: 'धन, परिवार, वाणी, भोजन, प्रारम्भिक शिक्षा' },
                { n: 3, sa: 'Sahaja', en: 'Siblings, courage, short journeys, communication', hi: 'भाई-बहन, साहस, लघु यात्राएँ, संवाद' },
                { n: 4, sa: 'Sukha', en: 'Mother, home, property, vehicles, inner peace', hi: 'माता, गृह, सम्पत्ति, वाहन, मानसिक शान्ति' },
                { n: 5, sa: 'Putra', en: 'Children, intelligence, creativity, romance, past merit', hi: 'सन्तान, बुद्धि, सृजनशीलता, प्रेम, पूर्व पुण्य' },
                { n: 6, sa: 'Shatru', en: 'Enemies, disease, debts, daily work, service', hi: 'शत्रु, रोग, ऋण, दैनिक कार्य, सेवा' },
                { n: 7, sa: 'Kalatra', en: 'Marriage, partnerships, business, public dealings', hi: 'विवाह, साझेदारी, व्यापार, सार्वजनिक व्यवहार' },
                { n: 8, sa: 'Ayu', en: 'Longevity, transformation, hidden matters, inheritance', hi: 'आयु, रूपान्तरण, गुप्त विषय, विरासत' },
                { n: 9, sa: 'Dharma', en: 'Fortune, father, guru, higher education, long journeys', hi: 'भाग्य, पिता, गुरु, उच्च शिक्षा, दीर्घ यात्राएँ' },
                { n: 10, sa: 'Karma', en: 'Career, reputation, authority, public status', hi: 'कर्म, प्रतिष्ठा, अधिकार, सार्वजनिक पद' },
                { n: 11, sa: 'Labha', en: 'Gains, income, elder siblings, social networks, desires', hi: 'लाभ, आय, बड़े भाई-बहन, सामाजिक नेटवर्क, इच्छाएँ' },
                { n: 12, sa: 'Vyaya', en: 'Losses, expenses, foreign lands, moksha, sleep', hi: 'हानि, व्यय, विदेश, मोक्ष, निद्रा' },
              ].map(h => (
                <tr key={h.n} className="border-b border-white/5">
                  <td className="py-1.5 pr-2 text-gold-light font-medium">{h.n}</td>
                  <td className="py-1.5 pr-3 text-gold-dark">{h.sa}</td>
                  <td className="py-1.5">{isHi ? h.hi : h.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How Lagna determines houses */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'How the Lagna Determines House Assignment', hi: 'लग्न भाव निर्धारण कैसे करता है', sa: 'लग्न भाव निर्धारण कैसे करता है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>यदि जन्म के समय पूर्वी क्षितिज पर <strong className="text-gold-light">वृषभ</strong> उदय हो रहा है, तो वृषभ प्रथम भाव बनता है। तब मिथुन = 2रा भाव, कर्क = 3रा, सिंह = 4था... और इसी क्रम में। इसका अर्थ है कि <strong className="text-gold-light">समान राशि भिन्न लग्नों के लिए भिन्न भावों का शासक होती है</strong>। यही कारण है कि दो व्यक्ति जिनका सूर्य एक ही राशि में हो, पर लग्न भिन्न हो — उनके जीवनानुभव बहुत भिन्न हो सकते हैं।</> : <>If <strong className="text-gold-light">Taurus</strong> was rising on the eastern horizon at the moment of birth, Taurus becomes the 1st house. Then Gemini = 2nd house, Cancer = 3rd, Leo = 4th, and so on around the zodiac. This means <strong className="text-gold-light">the same sign rules different houses for different Lagnas</strong>. This is why two people with the Sun in the same sign but different Lagnas can have vastly different life experiences — the Sun&apos;s house placement changes everything.</>}</p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Chart Styles: North vs South Indian', hi: 'कुण्डली शैलियाँ: उत्तर बनाम दक्षिण', sa: 'कुण्डली शैलियाँ: उत्तर बनाम दक्षिण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <><strong className="text-gold-light">उत्तर भारतीय (हीरा)</strong>: 12 भाव स्थिर, राशियाँ घूमती हैं। शीर्ष हीरा सदैव लग्न। भाव संबंध एक नज़र में दिखते हैं। भारत के उत्तरी राज्यों (उत्तर प्रदेश, बिहार, राजस्थान, दिल्ली) में प्रचलित। भावों को गिनने में सबसे सहज — शीर्ष हीरे से वामावर्त (anti-clockwise) गिनें।</> : <><strong className="text-gold-light">North Indian (Diamond)</strong>: The 12 houses are fixed in a diamond pattern. The top diamond is always the 1st house (Lagna). Signs rotate based on the Ascendant. This style makes it easy to see house relationships at a glance — count anti-clockwise from the top diamond. Prevalent in UP, Bihar, Rajasthan, and Delhi.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <><strong className="text-gold-light">दक्षिण भारतीय (ग्रिड)</strong>: 4x4 ग्रिड जहाँ राशियाँ स्थायी (मीन सदैव ऊपरी बायें), भाव लग्न के अनुसार घूमते हैं। विभिन्न कुण्डलियों में ग्रहों की राशि स्थिति तुलना करना सरल। तमिलनाडु, कर्नाटक, आन्ध्र प्रदेश और केरल में प्रचलित। गोचर विश्लेषण हेतु सर्वोत्तम क्योंकि ग्रहों की राशि स्थिति तुरन्त दिखती है।</> : <><strong className="text-gold-light">South Indian (Grid)</strong>: A 4x4 grid where signs are permanently fixed — Pisces always top-left, Aries below it. Houses rotate based on Lagna. This makes it easy to track planets through signs across different charts. Prevalent in Tamil Nadu, Karnataka, Andhra Pradesh, and Kerala. Best for transit analysis since planetary sign positions are immediately visible.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दोनों शैलियाँ <strong className="text-gold-light">समान खगोलीय डेटा</strong> प्रदर्शित करती हैं — अन्तर केवल दृश्य प्रस्तुति में है। कोई एक दूसरे से &quot;बेहतर&quot; नहीं — पसन्द क्षेत्रीय परम्परा और व्यक्तिगत रुचि पर निर्भर करती है।</> : <>Both styles display <strong className="text-gold-light">identical astronomical data</strong> — the difference is purely visual. Neither is &quot;better&quot; — preference depends on regional tradition and personal taste.</>}</p>
      </section>

      {/* Worked example */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example: House Assignment', hi: 'कार्यान्वित उदाहरण: भाव निर्धारण', sa: 'कार्यान्वित उदाहरण: भाव निर्धारण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">स्थिति:</span> मुम्बई में सुबह 10:30 बजे जन्म। इस समय और स्थान पर <strong className="text-gold-light">कर्क राशि</strong> (Cancer) पूर्वी क्षितिज पर उदय हो रही है।</> : <><span className="text-gold-light font-medium">Scenario:</span> Born at 10:30 AM in Mumbai. At this time and location, <strong className="text-gold-light">Cancer (Karka)</strong> is rising on the eastern horizon.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भाव निर्धारण:</span> कर्क = 1ला भाव (स्वयं)। सिंह = 2रा (धन)। कन्या = 3रा (भाई-बहन)। तुला = 4था (माता/गृह)। वृश्चिक = 5वाँ (सन्तान)। धनु = 6ठा (स्वास्थ्य)। मकर = 7वाँ (विवाह)। कुम्भ = 8वाँ (रूपान्तरण)। मीन = 9वाँ (भाग्य)। मेष = 10वाँ (कर्म)। वृषभ = 11वाँ (लाभ)। मिथुन = 12वाँ (व्यय)।</> : <><span className="text-gold-light font-medium">House assignment:</span> Cancer = 1st (self). Leo = 2nd (wealth). Virgo = 3rd (siblings). Libra = 4th (mother/home). Scorpio = 5th (children). Sagittarius = 6th (health). Capricorn = 7th (marriage). Aquarius = 8th (transformation). Pisces = 9th (fortune). Aries = 10th (career). Taurus = 11th (gains). Gemini = 12th (expenses).</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-gold-light font-medium">निहितार्थ:</span> चन्द्रमा (कर्क का स्वामी) लग्नेश बन जाता है — इस व्यक्ति के लिए चन्द्रमा सर्वाधिक महत्वपूर्ण ग्रह है। शनि (मकर का स्वामी) 7वें भाव का शासक है — विवाह शनि की स्थिति और दशा से प्रभावित होगा।</> : <><span className="text-gold-light font-medium">Implication:</span> Moon (ruler of Cancer) becomes the Lagna lord — the most important planet for this native. Saturn (ruler of Capricorn) rules the 7th house — marriage is influenced by Saturn&apos;s placement and dasha periods.</>}</p>
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

      {/* House Classification */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'House Classifications', hi: 'भाव वर्गीकरण', sa: 'भाव वर्गीकरण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>भावों को चार प्रमुख समूहों में वर्गीकृत किया जाता है, और प्रत्येक समूह का अपना विशेष महत्व है:</> : <>Houses are classified into four major groups, each with distinct significance:</>}</p>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'केन्द्र (1, 4, 7, 10):' : 'Kendras (1, 4, 7, 10):'}</span> {isHi ? 'जीवन के चार स्तम्भ — स्वयं, गृह, साझेदारी, कैरियर। ग्रह यहाँ सर्वाधिक शक्तिशाली होते हैं।' : 'The four pillars of life — self, home, partnerships, career. Planets here are most powerful in expression.'}</p>
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'त्रिकोण (1, 5, 9):' : 'Trikonas (1, 5, 9):'}</span> {isHi ? 'धर्म और भाग्य के भाव — पुण्य, सृजनात्मकता और दैवी कृपा। केन्द्र-त्रिकोण संबंध राजयोग बनाते हैं।' : 'Houses of dharma and fortune — merit, creativity, and divine grace. Kendra-Trikona lord connections create Raja Yogas.'}</p>
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'उपचय (3, 6, 10, 11):' : 'Upachaya (3, 6, 10, 11):'}</span> {isHi ? 'समय के साथ सुधरने वाले भाव। पाप ग्रह (मंगल, शनि) यहाँ शुभ फल देते हैं।' : 'Houses that improve with time and effort. Malefic planets (Mars, Saturn) give good results here.'}</p>
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-red-400 font-medium">{isHi ? 'दुःस्थान (6, 8, 12):' : 'Dusthanas (6, 8, 12):'}</span> {isHi ? 'कठिनाइयों के भाव — शत्रु, रोग, हानि। शुभ ग्रह यहाँ कमज़ोर होते हैं, पर रूपान्तरण भी सम्भव।' : 'Houses of difficulty — enemies, disease, losses. Benefic planets weaken here, but transformation is also possible.'}</p>
        </div>
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
