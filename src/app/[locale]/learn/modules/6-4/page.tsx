'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/6-4.json';

const META: ModuleMeta = {
  id: 'mod_6_4', phase: 2, topic: 'Nakshatra', moduleNumber: '6.4',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'विंशोत्तरी पद्धति में नक्षत्र स्वामी' : 'Nakshatra Lords in the Vimshottari Scheme'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Each of the 27 nakshatras is assigned a planetary lord according to the Vimshottari dasha system. The 9 planets cycle in a fixed order: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury. This sequence repeats 3 times to cover all 27 nakshatras (9 x 3 = 27). Thus Ketu rules the 1st (Ashwini), 10th (Magha), and 19th (Mula) nakshatras; Venus rules the 2nd (Bharani), 11th (Purva Phalguni), and 20th (Purva Ashadha); Sun rules the 3rd (Krittika), 12th (Uttara Phalguni), and 21st (Uttara Ashadha); and so on for all nine planets.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          27 नक्षत्रों में से प्रत्येक को विंशोत्तरी दशा पद्धति के अनुसार एक ग्रह स्वामी नियत है। 9 ग्रह एक निश्चित क्रम में चक्रित होते हैं: केतु, शुक्र, सूर्य, चन्द्र, मंगल, राहु, बृहस्पति, शनि, बुध। यह अनुक्रम सभी 27 नक्षत्रों को आवृत करने हेतु 3 बार दोहराता है (9 x 3 = 27)। अतः केतु 1ले (अश्विनी), 10वें (मघा) और 19वें (मूल) नक्षत्रों का शासक है; शुक्र 2रे (भरणी), 11वें (पूर्वा फाल्गुनी) और 20वें (पूर्वाषाढ़ा) का; सूर्य 3रे (कृत्तिका), 12वें (उत्तरा फाल्गुनी) और 21वें (उत्तराषाढ़ा) का; इसी प्रकार सभी नौ ग्रहों के लिए।
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The ruling planet of the Moon&apos;s nakshatra at birth determines which Mahadasha (major planetary period) is active at the moment of birth. This is the fundamental link between the nakshatra system and the dasha timing system — without knowing the birth nakshatra, you cannot calculate the dasha sequence. For example, a person born with Moon in Hasta (13th nakshatra) has Moon as the lord (the 4th in the cycle: Ketu=1, Venus=2, Sun=3, Moon=4). Therefore Moon Mahadasha is running at birth.', hi: 'जन्म पर चन्द्रमा के नक्षत्र का स्वामी ग्रह निर्धारित करता है कि जन्म के क्षण कौन-सी महादशा सक्रिय है। यह नक्षत्र पद्धति और दशा समय पद्धति के बीच मूलभूत सम्बन्ध है — जन्म नक्षत्र जाने बिना दशा अनुक्रम गणित नहीं हो सकता। उदाहरणार्थ, हस्त (13वें नक्षत्र) में चन्द्रमा वाले व्यक्ति का स्वामी चन्द्र है (चक्र में 4था: केतु=1, शुक्र=2, सूर्य=3, चन्द्र=4)। अतः जन्म पर चन्द्र महादशा चल रही होती है।', sa: 'जन्म पर चन्द्रमा के नक्षत्र का स्वामी ग्रह निर्धारित करता है कि जन्म के क्षण कौन-सी महादशा सक्रिय है। यह नक्षत्र पद्धति और दशा समय पद्धति के बीच मूलभूत सम्बन्ध है — जन्म नक्षत्र जाने बिना दशा अनुक्रम गणित नहीं हो सकता। उदाहरणार्थ, हस्त (13वें नक्षत्र) में चन्द्रमा वाले व्यक्ति का स्वामी चन्द्र है (चक्र में 4था: केतु=1, शुक्र=2, सूर्य=3, चन्द्र=4)। अतः जन्म पर चन्द्र महादशा चल रही होती है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीय उत्पत्ति' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The Vimshottari dasha system is attributed to Sage Parashara and is detailed extensively in the Brihat Parashara Hora Shastra (BPHS). It is by far the most widely used dasha system among the 40+ described in classical texts. Parashara states that among all dasha systems, Vimshottari is most applicable in the current Kali Yuga. The assignment of planets to nakshatras and the specific year durations (7, 20, 6, 10, 7, 18, 16, 19, 17) are considered divinely revealed, not empirically derived.', hi: 'विंशोत्तरी दशा पद्धति महर्षि पराशर को श्रेय दी जाती है और बृहत् पाराशर होरा शास्त्र (BPHS) में विस्तृत रूप से वर्णित है। शास्त्रीय ग्रन्थों में वर्णित 40 से अधिक दशा पद्धतियों में यह सर्वाधिक प्रचलित है। पराशर कहते हैं कि सभी दशा पद्धतियों में विंशोत्तरी वर्तमान कलियुग में सर्वाधिक लागू है। नक्षत्रों को ग्रहों का नियतन और विशिष्ट वर्ष अवधि (7, 20, 6, 10, 7, 18, 16, 19, 17) दैवीय रूप से प्रकट मानी जाती हैं, अनुभवजन्य नहीं।', sa: 'विंशोत्तरी दशा पद्धति महर्षि पराशर को श्रेय दी जाती है और बृहत् पाराशर होरा शास्त्र (BPHS) में विस्तृत रूप से वर्णित है। शास्त्रीय ग्रन्थों में वर्णित 40 से अधिक दशा पद्धतियों में यह सर्वाधिक प्रचलित है। पराशर कहते हैं कि सभी दशा पद्धतियों में विंशोत्तरी वर्तमान कलियुग में सर्वाधिक लागू है। नक्षत्रों को ग्रहों का नियतन और विशिष्ट वर्ष अवधि (7, 20, 6, 10, 7, 18, 16, 19, 17) दैवीय रूप से प्रकट मानी जाती हैं, अनुभवजन्य नहीं।' }, locale)}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'शेष दशा सन्तुलन की गणना' : 'Calculating Remaining Dasha Balance'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi ? <>जन्म के क्षण चन्द्रमा शायद ही कभी नक्षत्र के ठीक आरम्भ पर होता है। वह सामान्यतः नक्षत्र का कुछ भाग पार कर चुका होता है, जिसका अर्थ है कि सम्बन्धित महादशा का उतना अंश पहले ही &quot;बीत चुका&quot; है। शेष सन्तुलन वह है जो जातक वास्तव में जन्म से अनुभव करता है। गणना सरल है:</> : <>At the moment of birth, the Moon is rarely at the exact start of a nakshatra. It has usually traversed some portion of the nakshatra, which means that much of the corresponding Mahadasha has already &quot;elapsed&quot; (conceptually consumed). The remaining balance is what the native actually experiences from birth. The calculation is straightforward:</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Step 1: Find the Moon&apos;s position within its nakshatra. Position = Moon_longitude - (nakshatra_start). Step 2: Calculate the fraction elapsed. Fraction = Position / 13.333°. Step 3: Remaining fraction = 1 - Fraction. Step 4: Remaining dasha years = Mahadasha_total_years x Remaining_fraction.', hi: 'चरण 1: नक्षत्र में चन्द्रमा की स्थिति ज्ञात करें। स्थिति = चन्द्र_भोगांश - (नक्षत्र_आरम्भ)। चरण 2: बीता हुआ अंश गणित करें। अंश = स्थिति / 13.333°। चरण 3: शेष अंश = 1 - अंश। चरण 4: शेष दशा वर्ष = महादशा_कुल_वर्ष x शेष_अंश।', sa: 'चरण 1: नक्षत्र में चन्द्रमा की स्थिति ज्ञात करें। स्थिति = चन्द्र_भोगांश - (नक्षत्र_आरम्भ)। चरण 2: बीता हुआ अंश गणित करें। अंश = स्थिति / 13.333°। चरण 3: शेष अंश = 1 - अंश। चरण 4: शेष दशा वर्ष = महादशा_कुल_वर्ष x शेष_अंश।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Examples', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> जन्म चन्द्रमा 167.3° हस्त (चन्द्र-शासित, 160° से आरम्भ) में। हस्त में स्थिति = 167.3 - 160 = 7.3°। बीता हुआ अंश = 7.3 / 13.333 = 0.5475 = 54.75%। चन्द्र दशा कुल = 10 वर्ष। शेष = 10 x (1 - 0.5475) = 10 x 0.4525 = 4.525 वर्ष ≈ 4 वर्ष, 6 माह, 9 दिन।</> : <><span className="text-gold-light font-medium">Example:</span> Birth Moon at 167.3° in Hasta (Moon-ruled, starting at 160°). Position within Hasta = 167.3 - 160 = 7.3°. Fraction elapsed = 7.3 / 13.333 = 0.5475 = 54.75%. Moon dasha total = 10 years. Remaining = 10 x (1 - 0.5475) = 10 x 0.4525 = 4.525 years ≈ 4 years, 6 months, 9 days.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">पूर्ण अनुक्रम:</span> चन्द्र दशा के शेष 4.53 वर्षों के बाद जातक मंगल दशा (7 वर्ष) में प्रवेश करता है, फिर राहु (18 वर्ष), बृहस्पति (16 वर्ष), शनि (19 वर्ष), बुध (17 वर्ष), केतु (7 वर्ष), शुक्र (20 वर्ष), सूर्य (6 वर्ष), और फिर पुनः चन्द्र (10 वर्ष)। यह चक्र इसी निश्चित क्रम में सम्पूर्ण जीवन भर चलता है।</> : <><span className="text-gold-light font-medium">Full sequence:</span> After the remaining 4.53 years of Moon dasha, the native enters Mars dasha (7 years), then Rahu (18 years), Jupiter (16 years), Saturn (19 years), Mercury (17 years), Ketu (7 years), Venus (20 years), Sun (6 years), and then Moon again (10 years). The cycle continues in this fixed order for the entire life.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;जन्म नक्षत्र का दशा स्वामी कुण्डली का सबसे महत्त्वपूर्ण ग्रह है।&quot; जन्म दशा स्वामी केवल इंगित करता है कि आप किस ग्रह अवधि में जन्मे — इसका अर्थ यह नहीं कि वह ग्रह कुण्डली का सबसे प्रबल या प्रभावशाली है। नक्षत्र के अन्तिम मिनटों में जन्मे व्यक्ति के पास उस दशा के कुछ ही दिन शेष हो सकते हैं, और वह अपने प्रारम्भिक जीवन का अधिकांश भाग अगले ग्रह के प्रभाव में व्यतीत करता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The dasha lord of your birth nakshatra is the most important planet in your chart.&quot; The birth dasha lord simply indicates which planetary period you&apos;re born into — it does not necessarily mean that planet is the chart&apos;s strongest or most dominant influence. A person born in the last minutes of a nakshatra might have only days of that dasha remaining, spending most of their early life under the next planet&apos;s influence instead.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Accurate dasha balance calculation requires knowing the Moon&apos;s longitude to high precision. Even a 0.5° error in the Moon&apos;s position can shift the dasha balance by several months. Our application uses the Meeus lunar algorithm, achieving Moon longitude accuracy within ~0.5° — sufficient for dasha calculations within a few days of accuracy. For critical cases, the exact birth time (to the minute) is essential.', hi: 'सटीक दशा सन्तुलन गणना के लिए चन्द्रमा का भोगांश उच्च परिशुद्धता तक ज्ञात होना आवश्यक है। चन्द्रमा की स्थिति में 0.5° की त्रुटि भी दशा सन्तुलन को कई महीनों तक विचलित कर सकती है। हमारा अनुप्रयोग मीयस चन्द्र एल्गोरिदम का उपयोग करता है, जो ~0.5° के भीतर चन्द्र भोगांश सटीकता प्राप्त करता है — कुछ दिनों की सटीकता के भीतर दशा गणना के लिए पर्याप्त। गम्भीर मामलों में, मिनट तक का सटीक जन्म समय आवश्यक है।', sa: 'सटीक दशा सन्तुलन गणना के लिए चन्द्रमा का भोगांश उच्च परिशुद्धता तक ज्ञात होना आवश्यक है। चन्द्रमा की स्थिति में 0.5° की त्रुटि भी दशा सन्तुलन को कई महीनों तक विचलित कर सकती है। हमारा अनुप्रयोग मीयस चन्द्र एल्गोरिदम का उपयोग करता है, जो ~0.5° के भीतर चन्द्र भोगांश सटीकता प्राप्त करता है — कुछ दिनों की सटीकता के भीतर दशा गणना के लिए पर्याप्त। गम्भीर मामलों में, मिनट तक का सटीक जन्म समय आवश्यक है।' }, locale)}
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
          {tl({ en: 'The 120-Year Vimshottari Cycle', hi: '120-वर्षीय विंशोत्तरी चक्र', sa: '120-वर्षीय विंशोत्तरी चक्र' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The name &quot;Vimshottari&quot; literally means &quot;of 120&quot; (vimshat = 20, uttara = above/beyond, interpreted as 6 x 20 = 120). The total cycle spans exactly 120 years, computed as the sum of all 9 Mahadasha periods: Ketu (7 years) + Venus (20 years) + Sun (6 years) + Moon (10 years) + Mars (7 years) + Rahu (18 years) + Jupiter (16 years) + Saturn (19 years) + Mercury (17 years) = 120 years. This was conceived as the maximum possible human lifespan in the Vedic tradition, ensuring the dasha system covers an entire life without repetition.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          &quot;विंशोत्तरी&quot; नाम का शाब्दिक अर्थ &quot;120 का&quot; है (विंशत् = 20, उत्तर = ऊपर/परे, व्याख्या 6 x 20 = 120)। कुल चक्र ठीक 120 वर्षों का है, जो सभी 9 महादशा अवधियों का योग है: केतु (7 वर्ष) + शुक्र (20 वर्ष) + सूर्य (6 वर्ष) + चन्द्र (10 वर्ष) + मंगल (7 वर्ष) + राहु (18 वर्ष) + बृहस्पति (16 वर्ष) + शनि (19 वर्ष) + बुध (17 वर्ष) = 120 वर्ष। वैदिक परम्परा में इसे सम्भावित अधिकतम मानव आयु के रूप में कल्पित किया गया, जिससे दशा पद्धति बिना आवृत्ति के सम्पूर्ण जीवन को आवृत करे।
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Why are the individual dasha durations what they are? Classical commentators offer several explanations. One elegant relationship: the dasha years are roughly proportional to the planet&apos;s relative orbital period or perceived influence. Venus and Saturn, the slowest classical planets with the most sustained influence, get the longest periods (20 and 19). Sun, the fastest apparent mover, gets the shortest (6). Rahu and Ketu, the shadow planets with 18-year eclipse cycles, get 18 and 7 respectively. However, no single astronomical formula perfectly explains all 9 values — they are treated as received wisdom.', hi: 'व्यक्तिगत दशा अवधियाँ ऐसी क्यों हैं? शास्त्रीय टीकाकार कई व्याख्याएँ देते हैं। एक सुन्दर सम्बन्ध: दशा वर्ष ग्रह की सापेक्ष कक्षा अवधि या अनुभूत प्रभाव के मोटे तौर पर समानुपातिक हैं। शुक्र और शनि, सबसे मन्द शास्त्रीय ग्रह जिनका सबसे दीर्घकालिक प्रभाव है, सबसे लम्बी अवधि (20 और 19) पाते हैं। सूर्य, सबसे तीव्र दृश्य गतिशील, सबसे छोटी (6) पाता है। राहु और केतु, 18-वर्षीय ग्रहण चक्र वाले छाया ग्रह, क्रमशः 18 और 7 पाते हैं। तथापि, कोई एकल खगोलीय सूत्र सभी 9 मानों की पूर्ण व्याख्या नहीं करता — इन्हें प्राप्त ज्ञान के रूप में स्वीकार किया जाता है।', sa: 'व्यक्तिगत दशा अवधियाँ ऐसी क्यों हैं? शास्त्रीय टीकाकार कई व्याख्याएँ देते हैं। एक सुन्दर सम्बन्ध: दशा वर्ष ग्रह की सापेक्ष कक्षा अवधि या अनुभूत प्रभाव के मोटे तौर पर समानुपातिक हैं। शुक्र और शनि, सबसे मन्द शास्त्रीय ग्रह जिनका सबसे दीर्घकालिक प्रभाव है, सबसे लम्बी अवधि (20 और 19) पाते हैं। सूर्य, सबसे तीव्र दृश्य गतिशील, सबसे छोटी (6) पाता है। राहु और केतु, 18-वर्षीय ग्रहण चक्र वाले छाया ग्रह, क्रमशः 18 और 7 पाते हैं। तथापि, कोई एकल खगोलीय सूत्र सभी 9 मानों की पूर्ण व्याख्या नहीं करता — इन्हें प्राप्त ज्ञान के रूप में स्वीकार किया जाता है।' }, locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'नक्षत्र-स्वामी चक्र प्रारूप' : 'The Nakshatra-Lord Cycle Pattern'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The 9-planet sequence (Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury) repeats 3 times across the 27 nakshatras. This creates a beautiful symmetry: the first cycle covers Ashwini through Ashlesha (nakshatras 1-9, spanning Aries through Cancer), the second covers Magha through Jyeshtha (10-18, Leo through Scorpio), and the third covers Mula through Revati (19-27, Sagittarius through Pisces). Each round of 9 nakshatras spans exactly 120° of the zodiac (9 x 13.333° = 120°), which is one-third of the circle.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          9-ग्रह अनुक्रम (केतु, शुक्र, सूर्य, चन्द्र, मंगल, राहु, बृहस्पति, शनि, बुध) 27 नक्षत्रों में 3 बार दोहराता है। यह एक सुन्दर सममिति बनाता है: प्रथम चक्र अश्विनी से आश्लेषा (नक्षत्र 1-9, मेष से कर्क) तक, द्वितीय मघा से ज्येष्ठा (10-18, सिंह से वृश्चिक) तक, और तृतीय मूल से रेवती (19-27, धनु से मीन) तक। 9 नक्षत्रों का प्रत्येक आवर्तन राशिचक्र के ठीक 120° (9 x 13.333° = 120°) में फैला है, जो वृत्त का एक-तिहाई है।
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Examples', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">पूर्ण दशा समयरेखा:</span> 167.3° (हस्त, चन्द्र-शासित) पर चन्द्रमा में जन्मा व्यक्ति। शेष चन्द्र दशा: 4.53 वर्ष (आयु 0 से ~4.5)। मंगल: 7 वर्ष (आयु ~4.5 से ~11.5)। राहु: 18 वर्ष (आयु ~11.5 से ~29.5)। बृहस्पति: 16 वर्ष (आयु ~29.5 से ~45.5)। शनि: 19 वर्ष (आयु ~45.5 से ~64.5)। बुध: 17 वर्ष (आयु ~64.5 से ~81.5)। केतु: 7 वर्ष (आयु ~81.5 से ~88.5)। शुक्र: 20 वर्ष (आयु ~88.5 से ~108.5)। सूर्य: 6 वर्ष (आयु ~108.5 से ~114.5)। फिर पुनः चन्द्र 120-वर्षीय चक्र पूर्ण करने हेतु।</> : <><span className="text-gold-light font-medium">Complete dasha timeline:</span> Person born with Moon at 167.3° (Hasta, Moon-ruled). Remaining Moon dasha: 4.53 years (age 0 to ~4.5). Mars: 7 years (age ~4.5 to ~11.5). Rahu: 18 years (age ~11.5 to ~29.5). Jupiter: 16 years (age ~29.5 to ~45.5). Saturn: 19 years (age ~45.5 to ~64.5). Mercury: 17 years (age ~64.5 to ~81.5). Ketu: 7 years (age ~81.5 to ~88.5). Venus: 20 years (age ~88.5 to ~108.5). Sun: 6 years (age ~108.5 to ~114.5). Then Moon again to complete the 120-year cycle.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;शनि महादशा (19 वर्ष) सदैव भयानक और सूर्य महादशा (6 वर्ष) सदैव शुभ होती है।&quot; किसी भी दशा की गुणवत्ता पूर्णतया व्यक्तिगत जन्म कुण्डली में ग्रह की स्थिति, गरिमा, दृष्टि और स्वामित्व पर निर्भर करती है। सुस्थित शनि अपनी 19-वर्षीय अवधि में अपार व्यावसायिक सफलता दे सकता है, जबकि दुर्बल सूर्य 6 वर्षों में अहं संघर्ष और स्वास्थ्य समस्याएँ ला सकता है। कोई दशा स्वाभाविक रूप से शुभ या अशुभ नहीं — कुण्डली का सन्दर्भ ही सब कुछ है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Saturn Mahadasha (19 years) is always terrible and Sun Mahadasha (6 years) is always good.&quot; The quality of any dasha depends entirely on the planet&apos;s placement, dignity, aspects, and lordship in the individual birth chart. A well-placed Saturn can give tremendous career success during its 19-year period, while a poorly placed Sun can bring ego conflicts and health issues during its 6 years. No dasha is inherently good or bad — chart context is everything.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <>विंशोत्तरी दशा पद्धति वैदिक ज्योतिष में प्राथमिक फलादेश समय उपकरण बनी हुई है। व्यावसायिक परामर्श अनिवार्य रूप से &quot;आपकी कौन-सी दशा चल रही है?&quot; से आरम्भ होता है। हमारा कुण्डली उपकरण जन्म चन्द्रमा की नक्षत्र स्थिति से सम्पूर्ण दशा-अन्तर्दशा-प्रत्यन्तर्दशा पदानुक्रम गणित करता है, एक व्यापक जीवन समयरेखा प्रदान करता है। इस समयरेखा की सटीकता सीधे जन्म चन्द्र भोगांश की परिशुद्धता पर निर्भर है, जो हमारा मीयस-आधारित इंजन ~0.5° के भीतर गणित करता है।</> : <>The Vimshottari dasha system remains the primary predictive timing tool in Vedic astrology. Professional consultations invariably begin with &quot;What dasha are you running?&quot; Our Kundali tool computes the complete dasha-antardasha-pratyantardasha hierarchy from the birth Moon&apos;s nakshatra position, providing a comprehensive life timeline. The accuracy of this timeline depends directly on the precision of the birth Moon longitude, which our Meeus-based engine computes to within ~0.5°.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module6_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
