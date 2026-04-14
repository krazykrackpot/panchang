'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/11-1.json';

const META: ModuleMeta = {
  id: 'mod_11_1', phase: 3, topic: 'Dashas', moduleNumber: '11.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 18,
  crossRefs: L.crossRefs.map(cr => ({ label: cr.label as unknown as Record<string, string>, href: cr.href })),
};

const QUESTIONS = (L.questions as unknown) as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Opening Hook */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-gold-light text-sm leading-relaxed italic">
          {tl({ en: `"Imagine knowing in advance which planet will be the dominant force in your life for the next 7, 10, or even 20 years. That's what the Vimshottari Dasha system gives you — a 120-year planetary timeline computed from a single data point: the Moon's nakshatra at your birth."`, hi: `"कल्पना कीजिए कि आप पहले से जान सकें कि अगले 7, 10, या 20 वर्षों तक कौन-सा ग्रह आपके जीवन में प्रभावी शक्ति रहेगा। विंशोत्तरी दशा पद्धति आपको यही देती है — एकमात्र डेटा बिन्दु से गणित 120 वर्षीय ग्रह समयरेखा: जन्म के समय चन्द्रमा का नक्षत्र।"`, sa: `"कल्पना कीजिए कि आप पहले से जान सकें कि अगले 7, 10, या 20 वर्षों तक कौन-सा ग्रह आपके जीवन में प्रभावी शक्ति रहेगा। विंशोत्तरी दशा पद्धति आपको यही देती है — एकमात्र डेटा बिन्दु से गणित 120 वर्षीय ग्रह समयरेखा: जन्म के समय चन्द्रमा का नक्षत्र।"` }, locale)}
        </p>
      </section>

      {/* What is Vimshottari? */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Is Vimshottari?', hi: 'विंशोत्तरी क्या है?', sa: 'विंशोत्तरी क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>वैदिक ज्योतिष में &quot;दशा&quot; एक ग्रह काल-खण्ड है — जीवन का वह कालावधि जिसमें एक ग्रह जातक के अनुभव पर प्रभुत्व रखता है। जहाँ गोचर (transits) बताता है कि ग्रह अभी कहाँ हैं, दशा बताती है कि आपके लिए किसी भी समय कौन-सा ग्रह &quot;सक्रिय&quot; है। विंशोत्तरी (&quot;विंशो&quot; = 20, &quot;उत्तरी&quot; = ऊपर/परे) = 120 वर्षों में फैली पद्धति। यह पाराशरी ज्योतिष की प्राथमिक समय-निर्धारण प्रणाली है — लगभग 95% वैदिक ज्योतिषी इसी का उपयोग करते हैं।</>
            : <>In Vedic astrology, a &quot;dasha&quot; is a planetary time period — a stretch of life during which one planet dominates the native&apos;s experience. While transits (gochar) show where planets are NOW, dashas reveal which planet is &quot;switched on&quot; for YOU at any given time. Vimshottari (&quot;Vimsho&quot; = 20, &quot;Uttari&quot; = above/beyond) = a system spanning 120 years (a mathematical multiple of 20 x 6). It is the PRIMARY timing system in Parashari Jyotish — used by approximately 95% of Vedic astrologers.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>समान कुण्डली किन्तु भिन्न जन्म नक्षत्र वाले दो व्यक्ति समान ग्रहों को पूर्णतया भिन्न क्रम में अनुभव करेंगे। इसलिए समय-आधारित भविष्यवाणी के लिए दशा विश्लेषण सर्वोपरि है। पश्चिमी ज्योतिषी कह सकता है &quot;आपका विवाह हो सकता है।&quot; दशा प्रयोग करने वाला वैदिक ज्योतिषी कह सकता है &quot;विवाह की सर्वाधिक सम्भावना शुक्र-गुरु काल में, अक्टूबर 2027 से फरवरी 2029 के बीच है।&quot; यह विशिष्टता पदानुक्रमिक उपविभाजन प्रणाली के कारण सम्भव है।</>
            : <>Two people with identical charts but different birth nakshatras will experience the same planets in completely different sequences. This is why timing predictions require dasha analysis above all else. A Western astrologer can say &quot;You might get married.&quot; A Vedic astrologer using dashas can say &quot;Marriage is most likely during Venus-Jupiter period, between October 2027 and February 2029.&quot; This specificity is possible because of the hierarchical subdivision system.</>}
        </p>
      </section>

      {/* The 9 Mahadasha Periods — Full Table */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The 9 Mahadasha Periods', hi: 'नौ महादशा काल', sa: 'नौ महादशा काल' }, locale)}
        </h3>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{tl({ en: 'Planet', hi: 'ग्रह', sa: 'ग्रह' }, locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{tl({ en: 'Sanskrit', hi: 'संस्कृत', sa: 'संस्कृत' }, locale)}</th>
                <th className="text-gold-light text-center py-2 px-2 font-semibold">{tl({ en: 'Years', hi: 'वर्ष', sa: 'वर्ष' }, locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{tl({ en: 'Nakshatras Ruled', hi: 'नक्षत्र', sa: 'नक्षत्र' }, locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{tl({ en: 'Nature', hi: 'प्रकृति', sa: 'प्रकृति' }, locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{tl({ en: 'Life Themes', hi: 'जीवन विषय', sa: 'जीवन विषय' }, locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Ketu</td>
                <td className="py-2 px-2">केतु</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">7</td>
                <td className="py-2 px-2">{tl({ en: 'Ashwini, Magha, Mula', hi: 'अश्विनी, मघा, मूल', sa: 'अश्विनी, मघा, मूल' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Spiritual disruption', hi: 'आध्यात्मिक विघटन', sa: 'आध्यात्मिक विघटन' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Detachment, past karma, sudden changes, spiritual awakening', hi: 'वैराग्य, पूर्व कर्म, अकस्मात परिवर्तन, आध्यात्मिक जागृति', sa: 'वैराग्य, पूर्व कर्म, अकस्मात परिवर्तन, आध्यात्मिक जागृति' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Venus</td>
                <td className="py-2 px-2">शुक्र</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">20</td>
                <td className="py-2 px-2">{tl({ en: 'Bharani, P.Phalguni, P.Ashadha', hi: 'भरणी, पू.फा., पू.आषा.', sa: 'भरणी, पू.फा., पू.आषा.' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Material abundance', hi: 'भौतिक प्रचुरता', sa: 'भौतिक प्रचुरता' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Marriage, luxury, arts, relationships, comfort', hi: 'विवाह, विलासिता, कला, सम्बन्ध, सुख-सुविधा', sa: 'विवाह, विलासिता, कला, सम्बन्ध, सुख-सुविधा' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Sun</td>
                <td className="py-2 px-2">सूर्य</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">6</td>
                <td className="py-2 px-2">{tl({ en: 'Krittika, U.Phalguni, U.Ashadha', hi: 'कृत्तिका, उ.फा., उ.आषा.', sa: 'कृत्तिका, उ.फा., उ.आषा.' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Authority', hi: 'अधिकार', sa: 'अधिकार' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Career recognition, father, government, leadership', hi: 'कैरियर मान्यता, पिता, सरकार, नेतृत्व', sa: 'कैरियर मान्यता, पिता, सरकार, नेतृत्व' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Moon</td>
                <td className="py-2 px-2">चन्द्र</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">10</td>
                <td className="py-2 px-2">{tl({ en: 'Rohini, Hasta, Shravana', hi: 'रोहिणी, हस्त, श्रवण', sa: 'रोहिणी, हस्त, श्रवण' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Emotional', hi: 'भावनात्मक', sa: 'भावनात्मक' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Mother, emotions, travel, public image, mind', hi: 'माता, भावनाएँ, यात्रा, लोक छवि, मन', sa: 'माता, भावनाएँ, यात्रा, लोक छवि, मन' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Mars</td>
                <td className="py-2 px-2">मंगल</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">7</td>
                <td className="py-2 px-2">{tl({ en: 'Mrigashira, Chitra, Dhanishtha', hi: 'मृगशिरा, चित्रा, धनिष्ठा', sa: 'मृगशिरा, चित्रा, धनिष्ठा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Action', hi: 'क्रिया', sa: 'क्रिया' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Property, siblings, courage, surgery, conflicts', hi: 'सम्पत्ति, भाई-बहन, साहस, शल्यक्रिया, संघर्ष', sa: 'सम्पत्ति, भाई-बहन, साहस, शल्यक्रिया, संघर्ष' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Rahu</td>
                <td className="py-2 px-2">राहु</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">18</td>
                <td className="py-2 px-2">{tl({ en: 'Ardra, Swati, Shatabhisha', hi: 'आर्द्रा, स्वाती, शतभिषा', sa: 'आर्द्रा, स्वाती, शतभिषा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Obsession', hi: 'आसक्ति', sa: 'आसक्ति' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Foreign connections, technology, unconventional success, desire', hi: 'विदेश सम्बन्ध, प्रौद्योगिकी, अपरम्परागत सफलता, इच्छा', sa: 'विदेश सम्बन्ध, प्रौद्योगिकी, अपरम्परागत सफलता, इच्छा' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Jupiter</td>
                <td className="py-2 px-2">बृहस्पति</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">16</td>
                <td className="py-2 px-2">{tl({ en: 'Punarvasu, Vishakha, P.Bhadrapada', hi: 'पुनर्वसु, विशाखा, पू.भा.', sa: 'पुनर्वसु, विशाखा, पू.भा.' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Expansion', hi: 'विस्तार', sa: 'विस्तार' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Children, education, wisdom, dharma, wealth', hi: 'सन्तान, शिक्षा, ज्ञान, धर्म, सम्पत्ति', sa: 'सन्तान, शिक्षा, ज्ञान, धर्म, सम्पत्ति' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Saturn</td>
                <td className="py-2 px-2">शनि</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">19</td>
                <td className="py-2 px-2">{tl({ en: 'Pushya, Anuradha, U.Bhadrapada', hi: 'पुष्य, अनुराधा, उ.भा.', sa: 'पुष्य, अनुराधा, उ.भा.' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Discipline', hi: 'अनुशासन', sa: 'अनुशासन' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Career grind, chronic issues, structure, karma, responsibility', hi: 'कैरियर परिश्रम, दीर्घकालिक समस्याएँ, संरचना, कर्म, उत्तरदायित्व', sa: 'कैरियर परिश्रम, दीर्घकालिक समस्याएँ, संरचना, कर्म, उत्तरदायित्व' }, locale)}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-text-primary">Mercury</td>
                <td className="py-2 px-2">बुध</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">17</td>
                <td className="py-2 px-2">{tl({ en: 'Ashlesha, Jyeshtha, Revati', hi: 'आश्लेषा, ज्येष्ठा, रेवती', sa: 'आश्लेषा, ज्येष्ठा, रेवती' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Intelligence', hi: 'बुद्धि', sa: 'बुद्धि' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Business, communication, skills, analysis, adaptability', hi: 'व्यापार, संवाद, कौशल, विश्लेषण, अनुकूलनशीलता', sa: 'व्यापार, संवाद, कौशल, विश्लेषण, अनुकूलनशीलता' }, locale)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why These Specific Years? */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Why These Specific Years?', hi: 'ये विशिष्ट वर्ष क्यों?', sa: 'ये विशिष्ट वर्ष क्यों?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>वर्ष गणनाएँ मनमानी नहीं हैं — ये नक्षत्र स्वामियों की कक्षीय अवधियों और उनके अनुमानित &quot;प्रभाव बल&quot; पर आधारित गणितीय प्रतिरूप का अनुसरण करती हैं। कुल (7+20+6+10+7+18+16+19+17 = 120) वैदिक &quot;परम आयुष्&quot; (अधिकतम मानव आयु) के बराबर है। सबसे बड़ी अवधि शुक्र (20 वर्ष) को मिलती है — सुख-सुविधा और भोग प्रधान मानव अनुभव हैं। सबसे छोटी सूर्य (6 वर्ष) को — अधिकार संक्षिप्त होता है। दूसरी सबसे बड़ी शनि (19 वर्ष) को मिलती है, क्योंकि कर्म और अनुशासन का परिपक्व होना दीर्घकाल माँगता है।</>
            : <>The year counts are NOT arbitrary — they follow a mathematical pattern based on the nakshatra lords&apos; orbital periods and their perceived &quot;strength of influence.&quot; The total (7+20+6+10+7+18+16+19+17 = 120) equals the Vedic &quot;Param Ayush&quot; (maximum ideal human lifespan). The largest period goes to Venus (20 years) — comfort and pleasure form the dominant human experience. The smallest to Sun (6 years) — authority is brief. The second-largest goes to Saturn (19 years), because karma and discipline take the longest to mature.</>}
        </p>
      </section>

      {/* The Sequence */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Sequence and Nakshatra Connection', hi: 'क्रम और नक्षत्र सम्बन्ध', sa: 'क्रम और नक्षत्र सम्बन्ध' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>क्रम सदा एक ही है: केतु &rarr; शुक्र &rarr; सूर्य &rarr; चन्द्र &rarr; मंगल &rarr; राहु &rarr; गुरु &rarr; शनि &rarr; बुध। बुध के बाद पुनः केतु से आरम्भ। यह 27 नक्षत्रों को 3-3 के समूहों में चक्रित करता है — प्रत्येक ग्रह ठीक 3 नक्षत्रों का स्वामी है। अश्विनी (1), मघा (10), मूल (19) = केतु। भरणी (2), पू.फाल्गुनी (11), पू.आषाढ़ा (20) = शुक्र। कृत्तिका (3), उ.फाल्गुनी (12), उ.आषाढ़ा (21) = सूर्य। इसी प्रकार नौवें ग्रह बुध तक — आश्लेषा (9), ज्येष्ठा (18), रेवती (27)।</>
            : <>The sequence is always: Ketu &rarr; Venus &rarr; Sun &rarr; Moon &rarr; Mars &rarr; Rahu &rarr; Jupiter &rarr; Saturn &rarr; Mercury. After Mercury, Ketu starts again. This cycles through the 27 nakshatras in groups of 3 — each planet rules exactly 3 nakshatras. Ashwini (1), Magha (10), Mula (19) = Ketu. Bharani (2), P.Phalguni (11), P.Ashadha (20) = Venus. Krittika (3), U.Phalguni (12), U.Ashadha (21) = Sun. And so on through the ninth planet Mercury — Ashlesha (9), Jyeshtha (18), Revati (27).</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ध्यान दें: तीन नक्षत्र जो एक ग्रह के अधिकार में हैं, वे समान रूप से 120-अंश अन्तराल (360/3) पर स्थित हैं। अश्विनी 0° पर, मघा 120° पर, मूल 240° पर — सभी केतु शासित। यह कोई संयोग नहीं है; यह नक्षत्र-ग्रह मानचित्रण को ज्यामितीय सामंजस्य प्रदान करता है।</>
            : <>Notice: the three nakshatras ruled by any single planet are equally spaced at 120-degree intervals (360/3). Ashwini at 0 degrees, Magha at 120 degrees, Mula at 240 degrees — all Ketu-ruled. This is no coincidence; it gives the nakshatra-planet mapping a geometric harmony that connects to the trine (trikona) principle in Jyotish.</>}
        </p>
      </section>

      {/* Classical Origin Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीय उत्पत्ति' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>विंशोत्तरी पद्धति बृहत् पराशर होराशास्त्र (BPHS), अध्याय 46 से उत्पन्न है। पराशर इसे सामान्य उपयोग के लिए सर्वाधिक उपयुक्त दशा बताते हैं — जब चन्द्रमा 0° से 360° के बीच हो (अर्थात् सदा)। पराशर 40 से अधिक दशा पद्धतियों (अष्टोत्तरी, योगिनी, आदि) का वर्णन करते हैं, किन्तु वे विशिष्ट चन्द्र स्थितियों के लिए निर्दिष्ट हैं। विंशोत्तरी कलियुग की सार्वभौमिक दशा है।</>
            : <>The Vimshottari system originates from Brihat Parashara Hora Shastra (BPHS), Chapter 46. Parashara describes it as the most suitable dasha for general use when the Moon is between 0 degrees and 360 degrees (i.e., always). Parashara describes over 40 dasha systems (Ashtottari, Yogini, etc.), but those are prescribed for specific Moon conditions. Vimshottari is the universal dasha for Kali Yuga.</>}
        </p>
      </section>

      {/* Key Fact Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Key Fact', hi: 'मुख्य तथ्य', sa: 'मुख्य तथ्य' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>विंशोत्तरी को विश्व की अन्य सभी समय-निर्धारण प्रणालियों से जो अद्वितीय बनाता है: यह भविष्यवाणी कर सकती है कि घटनाएँ कब होंगी, न कि केवल क्या हो सकता है। एक पश्चिमी ज्योतिषी कह सकता है &quot;आपका विवाह हो सकता है।&quot; दशा प्रयोग करने वाला वैदिक ज्योतिषी कह सकता है &quot;विवाह की सर्वाधिक सम्भावना शुक्र-गुरु काल में, अक्टूबर 2027 से फरवरी 2029 के बीच है।&quot; यह विशिष्टता पदानुक्रमिक उपविभाजन प्रणाली के कारण सम्भव है — जिसे अगले पृष्ठ पर विस्तार से समझाया गया है।</>
            : <>Here is what makes Vimshottari unique among all timing systems worldwide: it can predict WHEN events happen, not just what MIGHT happen. A Western astrologer can say &quot;You might get married.&quot; A Vedic astrologer using dashas can say &quot;Marriage is most likely during Venus-Jupiter period, between October 2027 and February 2029.&quot; This specificity is possible because of the hierarchical subdivision system — explained in detail on the next page.</>}
        </p>
      </section>
    </div>
  );
}

/* ───────────────────────── Page 2 ───────────────────────── */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Step 1 */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Computing Your Dasha — Step by Step', hi: 'आपकी दशा की गणना — चरण दर चरण', sa: 'आपकी दशा की गणना — चरण दर चरण' }, locale)}
        </h3>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {tl({ en: `Step 1: Find the Birth Moon\'s Nakshatra`, hi: `चरण 1: जन्म चन्द्रमा का नक्षत्र ज्ञात करें`, sa: `चरण 1: जन्म चन्द्रमा का नक्षत्र ज्ञात करें` }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>चन्द्रमा का निरयन (sidereal) भोगांश ज्ञात करें। प्रत्येक नक्षत्र 13°20&apos; (13.333°) का होता है। नक्षत्र संख्या = floor(भोगांश / 13.333) + 1। उदाहरण: चन्द्रमा 167.3° निरयन पर। floor(167.3 / 13.333) + 1 = floor(12.547) + 1 = 12 + 1 = 13 = हस्त नक्षत्र। हस्त का स्वामी चन्द्रमा है।</>
            : <>Find the Moon&apos;s sidereal (nirayana) longitude. Each nakshatra spans 13 degrees 20 minutes (13.333 degrees). Nakshatra number = floor(longitude / 13.333) + 1. Example: Moon at 167.3 degrees sidereal. floor(167.3 / 13.333) + 1 = floor(12.547) + 1 = 12 + 1 = 13 = Hasta nakshatra. Hasta is ruled by Moon.</>}
        </p>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {tl({ en: 'Step 2: Determine the Starting Mahadasha', hi: 'चरण 2: आरम्भिक महादशा निर्धारित करें', sa: 'चरण 2: आरम्भिक महादशा निर्धारित करें' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जन्म नक्षत्र का स्वामी ग्रह = जन्म पर चल रही महादशा का स्वामी। हस्त का स्वामी = चन्द्रमा। अतः जन्म पर चन्द्र महादशा चल रही है। यह सीधा और सरल है — नक्षत्र &rarr; स्वामी ग्रह &rarr; वही ग्रह की दशा।</>
            : <>The planet that rules the birth nakshatra = the Mahadasha lord running at birth. Hasta&apos;s lord = Moon. So Moon Mahadasha is running at birth. This is direct and simple — nakshatra &rarr; ruling planet &rarr; that planet&apos;s dasha.</>}
        </p>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {tl({ en: 'Step 3: Calculate the Remaining Balance', hi: 'चरण 3: शेष दशा की गणना करें', sa: 'चरण 3: शेष दशा की गणना करें' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>यह सबसे महत्त्वपूर्ण गणना है। चन्द्रमा ने नक्षत्र में कितने अंश तय किए हैं, यह ज्ञात करें। हस्त 160° से आरम्भ होता है। चन्द्रमा 167.3° पर है। तय किए अंश = 167.3 - 160 = 7.3°। कुल नक्षत्र = 13.333°। व्यतीत अनुपात = 7.3 / 13.333 = 0.5475 = 54.75%। चन्द्र की पूर्ण अवधि = 10 वर्ष। शेष = 10 x (1 - 0.5475) = 4.525 वर्ष = 4 वर्ष, 6 मास, 9 दिन। यही &quot;दशा शेष&quot; है जो हर कुण्डली में दिखता है।</>
            : <>This is the most critical calculation. Determine how many degrees the Moon has traversed within the nakshatra. Hasta starts at 160 degrees. Moon is at 167.3 degrees. Degrees traversed = 167.3 - 160 = 7.3 degrees. Total nakshatra = 13.333 degrees. Fraction consumed = 7.3 / 13.333 = 0.5475 = 54.75%. Moon&apos;s full period = 10 years. Remaining = 10 x (1 - 0.5475) = 4.525 years = 4 years, 6 months, 9 days. This is the &quot;balance of dasha&quot; shown in every Kundali.</>}
        </p>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {tl({ en: 'Step 4: Build the Full Sequence', hi: 'चरण 4: पूर्ण अनुक्रम बनाएँ', sa: 'चरण 4: पूर्ण अनुक्रम बनाएँ' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>चन्द्र दशा (4 वर्ष 6 मास 9 दिन शेष) के बाद, अगली दशाएँ क्रम में चलती हैं: मंगल (7 वर्ष), राहु (18 वर्ष), गुरु (16 वर्ष), शनि (19 वर्ष), बुध (17 वर्ष), केतु (7 वर्ष), शुक्र (20 वर्ष), सूर्य (6 वर्ष)। प्रत्येक ठीक वहाँ से आरम्भ होती है जहाँ पिछली समाप्त होती है। कोई अन्तराल नहीं, कोई ओवरलैप नहीं — 120 वर्ष पूरी तरह आच्छादित।</>
            : <>After Moon dasha (4 years 6 months 9 days remaining), the next dashas follow in fixed order: Mars (7 years), Rahu (18 years), Jupiter (16 years), Saturn (19 years), Mercury (17 years), Ketu (7 years), Venus (20 years), Sun (6 years). Each starts exactly where the previous one ends. No gaps, no overlaps — 120 years fully covered.</>}
        </p>
      </section>

      {/* The Subdivision Hierarchy */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Subdivision Hierarchy: 5 Levels Deep', hi: 'उपविभाजन पदानुक्रम: 5 स्तर', sa: 'उपविभाजन पदानुक्रम: 5 स्तर' }, locale)}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">1.</span>
            <div>
              <span className="text-text-primary font-semibold">{tl({ en: 'Mahadasha', hi: 'महादशा', sa: 'महादशा' }, locale)}</span>
              <span className="text-text-secondary"> — {tl({ en: 'Major period: 6-20 years. The broad chapter of life.', hi: 'प्रमुख काल: 6-20 वर्ष। जीवन का व्यापक अध्याय।', sa: 'प्रमुख काल: 6-20 वर्ष। जीवन का व्यापक अध्याय।' }, locale)}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">2.</span>
            <div>
              <span className="text-text-primary font-semibold">{tl({ en: 'Antardasha (Bhukti)', hi: 'अन्तर्दशा (भुक्ति)', sa: 'अन्तर्दशा (भुक्ति)' }, locale)}</span>
              <span className="text-text-secondary"> — {tl({ en: 'Sub-period: months to years. The scene within the chapter.', hi: 'उप-काल: मासों से वर्षों तक। अध्याय के भीतर दृश्य।', sa: 'उप-काल: मासों से वर्षों तक। अध्याय के भीतर दृश्य।' }, locale)}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">3.</span>
            <div>
              <span className="text-text-primary font-semibold">{tl({ en: 'Pratyantardasha', hi: 'प्रत्यन्तर्दशा', sa: 'प्रत्यन्तर्दशा' }, locale)}</span>
              <span className="text-text-secondary"> — {tl({ en: 'Sub-sub-period: weeks to months. The dialogue within the scene.', hi: 'उप-उप-काल: सप्ताहों से मासों तक। दृश्य के भीतर संवाद।', sa: 'उप-उप-काल: सप्ताहों से मासों तक। दृश्य के भीतर संवाद।' }, locale)}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">4.</span>
            <div>
              <span className="text-text-primary font-semibold">{tl({ en: 'Sookshma Dasha', hi: 'सूक्ष्म दशा', sa: 'सूक्ष्म दशा' }, locale)}</span>
              <span className="text-text-secondary"> — {tl({ en: 'Period of days. The sentence within the dialogue.', hi: 'दिनों का काल। संवाद के भीतर वाक्य।', sa: 'दिनों का काल। संवाद के भीतर वाक्य।' }, locale)}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">5.</span>
            <div>
              <span className="text-text-primary font-semibold">{tl({ en: 'Prana Dasha', hi: 'प्राण दशा', sa: 'प्राण दशा' }, locale)}</span>
              <span className="text-text-secondary"> — {tl({ en: 'Period of hours. The word within the sentence.', hi: 'घण्टों का काल। वाक्य के भीतर शब्द।', sa: 'घण्टों का काल। वाक्य के भीतर शब्द।' }, locale)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Antardasha Calculation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Antardasha Calculation Formula', hi: 'अन्तर्दशा गणना सूत्र', sa: 'अन्तर्दशा गणना सूत्र' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अन्तर्दशा अवधि = (अन्तर्दशा ग्रह के वर्ष / 120) x महादशा अवधि। 10 वर्ष की चन्द्र महादशा के भीतर: चन्द्र-चन्द्र अन्तर्दशा = (10/120) x 10 = 0.833 वर्ष = 10 मास। चन्द्र-मंगल = (7/120) x 10 = 0.583 वर्ष = 7 मास। चन्द्र-राहु = (18/120) x 10 = 1.5 वर्ष = 18 मास। ध्यान दें कि अन्तर्दशा सदा महादशा स्वामी से ही आरम्भ होती है, फिर विंशोत्तरी क्रम में आगे बढ़ती है।</>
            : <>Antardasha duration = (Antardasha planet&apos;s years / 120) x Mahadasha duration. Within a 10-year Moon Mahadasha: Moon-Moon antardasha = (10/120) x 10 = 0.833 years = 10 months. Moon-Mars = (7/120) x 10 = 0.583 years = 7 months. Moon-Rahu = (18/120) x 10 = 1.5 years = 18 months. Note that the Antardasha always begins with the Mahadasha lord itself, then proceeds through the Vimshottari sequence.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रत्यन्तर्दशा उसी सूत्र का पुनरावर्ती प्रयोग है: प्रत्यन्तर्दशा अवधि = (प्रत्यन्तर्दशा ग्रह के वर्ष / 120) x अन्तर्दशा अवधि। उदाहरण: चन्द्र-राहु अन्तर्दशा (18 मास) के भीतर, चन्द्र-राहु-गुरु प्रत्यन्तर्दशा = (16/120) x 1.5 वर्ष = 0.2 वर्ष = लगभग 73 दिन। इस प्रकार एक जन्म क्षण से दिनों की सटीकता प्राप्त होती है।</>
            : <>The Pratyantardasha uses the same formula recursively: Pratyantardasha duration = (Pratyantardasha planet&apos;s years / 120) x Antardasha duration. Example: within the Moon-Rahu antardasha (18 months), Moon-Rahu-Jupiter pratyantardasha = (16/120) x 1.5 years = 0.2 years = roughly 73 days. This is how a single birth moment generates day-level precision.</>}
        </p>
      </section>

      {/* Worked Example Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example: Delhi Birth Chart', hi: 'कार्यान्वित उदाहरण: दिल्ली जन्म कुण्डली', sa: 'कार्यान्वित उदाहरण: दिल्ली जन्म कुण्डली' }, locale)}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title={tl({ en: 'Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th', hi: 'मेष लग्न — सूर्य दशम में, चन्द्र चतुर्थ में, बृहस्पति नवम में', sa: 'मेष लग्न — सूर्य दशम में, चन्द्र चतुर्थ में, बृहस्पति नवम में' }, locale)}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">जन्म विवरण:</span> 15 जनवरी 1990, 10:30 IST, दिल्ली। चन्द्रमा 140.13° निरयन पर। नक्षत्र = floor(140.13 / 13.333) + 1 = floor(10.509) + 1 = 11 = पूर्वा फाल्गुनी। पू.फा. का स्वामी = शुक्र। अतः जन्म पर शुक्र महादशा चल रही है।</>
            : <><span className="text-gold-light font-medium">Birth details:</span> 15 January 1990, 10:30 IST, Delhi. Moon at 140.13 degrees sidereal. Nakshatra = floor(140.13 / 13.333) + 1 = floor(10.509) + 1 = 11 = Purva Phalguni. P.Phalguni&apos;s lord = Venus. So Venus Mahadasha is running at birth.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">शेष गणना:</span> पू.फा. 133.333° से आरम्भ। तय अंश = 140.13 - 133.333 = 6.797°। अनुपात = 6.797 / 13.333 = 50.98% व्यतीत। शुक्र पूर्ण = 20 वर्ष। शेष = 20 x (1 - 0.5098) = 9.804 वर्ष = 9 वर्ष 9 मास 19 दिन।</>
            : <><span className="text-gold-light font-medium">Balance calculation:</span> P.Phalguni starts at 133.333 degrees. Degrees traversed = 140.13 - 133.333 = 6.797 degrees. Fraction consumed = 6.797 / 13.333 = 50.98%. Venus full = 20 years. Remaining = 20 x (1 - 0.5098) = 9.804 years = 9 years 9 months 19 days.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {isHi
            ? <><span className="text-gold-light font-medium">पूर्ण अनुक्रम:</span> शुक्र: जन्म से ~ अक्टूबर 1999 | सूर्य: ~ अक्टूबर 1999 - अक्टूबर 2005 (6 वर्ष) | चन्द्र: ~ अक्टूबर 2005 - अक्टूबर 2015 (10 वर्ष) | मंगल: ~ अक्टूबर 2015 - अक्टूबर 2022 (7 वर्ष) | राहु: ~ अक्टूबर 2022 - अक्टूबर 2040 (18 वर्ष) | गुरु: ~ अक्टूबर 2040 - अक्टूबर 2056 (16 वर्ष) | शनि: ~ अक्टूबर 2056 - अक्टूबर 2075 (19 वर्ष) | बुध: ~ अक्टूबर 2075 - अक्टूबर 2092 (17 वर्ष) | केतु: ~ अक्टूबर 2092 - अक्टूबर 2099 (7 वर्ष)</>
            : <><span className="text-gold-light font-medium">Full sequence:</span> Venus: birth to ~Oct 1999 | Sun: ~Oct 1999 - Oct 2005 (6y) | Moon: ~Oct 2005 - Oct 2015 (10y) | Mars: ~Oct 2015 - Oct 2022 (7y) | Rahu: ~Oct 2022 - Oct 2040 (18y) | Jupiter: ~Oct 2040 - Oct 2056 (16y) | Saturn: ~Oct 2056 - Oct 2075 (19y) | Mercury: ~Oct 2075 - Oct 2092 (17y) | Ketu: ~Oct 2092 - Oct 2099 (7y)</>}
        </p>
      </section>

      {/* Mind-blown fact */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Staggering Precision', hi: 'अद्भुत सटीकता', sa: 'अद्भुत सटीकता' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>विंशोत्तरी पद्धति 9 x 9 = 81 अद्वितीय महादशा-अन्तर्दशा संयोजन उत्पन्न करती है। प्रत्यन्तर्दशा के साथ 729। सूक्ष्म दशा के साथ 6,561। प्राण दशा के साथ 59,049। यह एकमात्र जन्म क्षण से घण्टों की समय सटीकता उत्पन्न करता है। इतिहास की किसी अन्य ज्योतिष पद्धति में कालिक विस्तार (temporal granularity) का यह स्तर नहीं है।</>
            : <>The Vimshottari system generates 9 x 9 = 81 unique Mahadasha-Antardasha combinations. With Pratyantardasha, that is 729. With Sookshma, 6,561. With Prana, 59,049. This creates a timing resolution of HOURS — from a single birth moment. No other astrological system in history has this level of temporal granularity.</>}
        </p>
      </section>
    </div>
  );
}

/* ───────────────────────── Page 3 ───────────────────────── */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* The Fundamental Rule */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Fundamental Rule: Dasha Activation', hi: 'मूल सिद्धान्त: दशा सक्रियण', sa: 'मूल सिद्धान्त: दशा सक्रियण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>एक ग्रह की दशा उन भावों को सक्रिय करती है जिनका वह स्वामी है और जिसमें वह स्थित है। मंगल दशा उस कुण्डली के लिए जहाँ मंगल भाव 1 और 8 का स्वामी है &rarr; आत्म (1) और रूपान्तरण/संकट (8) के विषय प्रधान हो जाते हैं। शुक्र दशा जहाँ शुक्र भाव 7 और 12 का स्वामी &rarr; साझेदारी (7) और व्यय/विदेश (12) सक्रिय। यह मूल सिद्धान्त समस्त दशा व्याख्या का आधार है।</>
            : <>A planet&apos;s dasha activates the HOUSES it rules and the house it occupies. Mars dasha for a chart where Mars rules houses 1 and 8 means themes of self (1st) and transformation/crisis (8th) become dominant. Venus dasha where Venus rules houses 7 and 12 means partnerships (7th) and expenses/foreign lands (12th) are activated. This fundamental rule is the foundation of all dasha interpretation.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>महत्त्वपूर्ण सिद्धान्त: एक ग्रह केवल वही फल दे सकता है जो वह जन्म कुण्डली में वचन देता है। यदि शुक्र सप्तमेश है और शुभ स्थित है, तो शुक्र दशा सुखी विवाह लाती है। यदि शुक्र षष्ठेश है और पीड़ित है, तो शुक्र दशा सम्बन्ध संघर्ष या स्वास्थ्य समस्याएँ ला सकती है। दशा जन्मकालीन वचन को सक्रिय करती है — शून्य से परिणाम नहीं रचती।</>
            : <>The critical principle: a planet can only give results that it PROMISES in the birth chart. If Venus is the 7th lord and well-placed, Venus dasha brings a happy marriage. If Venus is the 6th lord and afflicted, Venus dasha may bring relationship conflicts or health issues instead. The dasha activates the natal promise — it does not create outcomes from nothing. This is why two people running Venus dasha can have vastly different experiences.</>}
        </p>
      </section>

      {/* Mahadasha + Antardasha Interaction */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Mahadasha + Antardasha Interaction', hi: 'महादशा + अन्तर्दशा अन्तःक्रिया', sa: 'महादशा + अन्तर्दशा अन्तःक्रिया' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>महादशा स्वामी प्रधान वातावरण प्रदान करता है। अन्तर्दशा स्वामी उस वातावरण में एक विशिष्ट प्रसंग लाता है। मंगल महादशा / गुरु अन्तर्दशा में: मंगल समग्र विषय (क्रिया, संघर्ष, सम्पत्ति) देता है, गुरु उसे रंग देता है (विस्तार, ज्ञान, सन्तान)। परिणाम: सम्पत्ति विस्तार, प्रयास से शैक्षिक उपलब्धियाँ, संघर्ष के बीच सन्तान। शुक्र महादशा / शनि अन्तर्दशा: सम्बन्धों में अनुशासन, विलासिता में मितव्ययिता, कला में संरचना।</>
            : <>The Mahadasha lord provides the dominant environment. The Antardasha lord brings a specific episode within that environment. During Mars Mahadasha / Jupiter Antardasha: Mars provides the overall theme (action, conflict, property), Jupiter colors it (expansion, wisdom, children). Result: property expansion, educational achievements through effort, children through struggle. Venus Mahadasha / Saturn Antardasha: discipline in relationships, frugality amid luxury, structure in art.</>}
        </p>
      </section>

      {/* When Do Events Happen? */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'When Do Events Happen? The Double Transit Theory', hi: 'घटनाएँ कब घटती हैं? दोहरा गोचर सिद्धान्त', sa: 'घटनाएँ कब घटती हैं? दोहरा गोचर सिद्धान्त' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>एक घटना तब प्रकट होती है जब दशा स्वामी और गुरु/शनि का गोचर दोनों सम्बन्धित भाव का समर्थन करते हैं। विवाह उदाहरण: शुक्र दशा + गुरु चन्द्र से 7वें भाव में गोचर + शनि 7वें पर दृष्टि। ये तीनों स्थितियाँ एक साथ मिलनी चाहिए। यही कारण है कि शुक्र दशा के पूरे 20 वर्षों में विवाह नहीं होता — केवल उस विशिष्ट अन्तर्दशा और गोचर संयोग में होता है जब तीनों कारक एक साथ आते हैं।</>
            : <>An event manifests when BOTH the dasha lord AND Jupiter/Saturn transit support the relevant house. Marriage example: Venus dasha + Jupiter transiting 7th from Moon + Saturn aspecting the 7th. All three conditions must align simultaneously. This is why marriage does not happen throughout the entire 20-year Venus dasha — it occurs only during that specific Antardasha and transit combination when all three factors converge.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>व्यावहारिक समय-निर्धारण के लिए: (1) प्रासंगिक भाव पहचानें (विवाह = 7, कैरियर = 10, सन्तान = 5), (2) उस भाव के स्वामी या कारक ग्रह की दशा/अन्तर्दशा खोजें, (3) उस काल में गुरु और शनि के गोचर जाँचें कि क्या वे उसी भाव का समर्थन करते हैं। जब तीनों मिलें, वह समय-खिड़की घटना की सम्भावना है।</>
            : <>For practical timing: (1) identify the relevant house (marriage = 7th, career = 10th, children = 5th), (2) find the dasha/antardasha of that house lord or karaka planet, (3) check Jupiter and Saturn transits during that period to see if they support the same house. When all three align, that time window is the likely event window.</>}
        </p>
      </section>

      {/* Dasha Sandhi */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Dasha Sandhi: The Turbulent Transition Zone', hi: 'दशा सन्धि: संक्रमण का अशान्त क्षेत्र', sa: 'दशा सन्धि: संक्रमण का अशान्त क्षेत्र' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>दो महादशाओं के बीच का संक्रमण अशान्त होता है। जाती हुई दशा के अन्तिम लगभग 6 मास और आने वाली के प्रथम लगभग 6 मास अनिश्चितता और परिवर्तन का काल होते हैं। दोनों ग्रहों के बीच जितना अधिक विरोधाभास (जैसे शुक्र &rarr; सूर्य: विलासिता &rarr; अधिकार, या गुरु &rarr; शनि: विस्तार &rarr; संकुचन), संक्रमण उतना ही विघटनकारी। यह जीवन शैली, प्राथमिकताओं और पहचान में मूलभूत बदलाव का समय होता है।</>
            : <>The transition between two Mahadashas is turbulent. The last approximately 6 months of the outgoing dasha and the first approximately 6 months of the incoming one create a period of uncertainty and change. The bigger the contrast between the two planets (e.g., Venus &rarr; Sun: luxury &rarr; authority, or Jupiter &rarr; Saturn: expansion &rarr; contraction), the more disruptive the transition. This is a time of fundamental shifts in lifestyle, priorities, and identity.</>}
        </p>
      </section>

      {/* Real-life Pattern Walkthrough */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Real-Life Pattern: Dasha-Life Phase Mapping', hi: 'वास्तविक जीवन प्रतिरूप: दशा-जीवन चरण मानचित्रण', sa: 'वास्तविक जीवन प्रतिरूप: दशा-जीवन चरण मानचित्रण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>केतु दशा से आरम्भ मानकर एक सामान्य जीवन प्रतिरूप:</>
            : <>A typical life pattern assuming Ketu dasha at birth:</>}
        </p>
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{tl({ en: 'Ketu (0-7)', hi: 'केतु (0-7)', sa: 'केतु (0-7)' }, locale)}</span>
            <span className="text-text-secondary">{tl({ en: 'Childhood disruptions, karmic family patterns, relocations', hi: 'बचपन की विघटनकारी घटनाएँ, कार्मिक पारिवारिक प्रतिरूप, स्थान परिवर्तन', sa: 'बचपन की विघटनकारी घटनाएँ, कार्मिक पारिवारिक प्रतिरूप, स्थान परिवर्तन' }, locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{tl({ en: 'Venus (7-27)', hi: 'शुक्र (7-27)', sa: 'शुक्र (7-27)' }, locale)}</span>
            <span className="text-text-secondary">{tl({ en: 'Education, first love, marriage for many, art/beauty awakening, material aspirations', hi: 'शिक्षा, पहला प्रेम, विवाह, कला/सौन्दर्य जागृति, भौतिक आकांक्षाएँ', sa: 'शिक्षा, पहला प्रेम, विवाह, कला/सौन्दर्य जागृति, भौतिक आकांक्षाएँ' }, locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{tl({ en: 'Sun (27-33)', hi: 'सूर्य (27-33)', sa: 'सूर्य (27-33)' }, locale)}</span>
            <span className="text-text-secondary">{tl({ en: 'Career establishment, father-related events, gaining authority, self-identity', hi: 'कैरियर स्थापना, पिता सम्बन्धी घटनाएँ, अधिकार प्राप्ति, आत्म-पहचान', sa: 'कैरियर स्थापना, पिता सम्बन्धी घटनाएँ, अधिकार प्राप्ति, आत्म-पहचान' }, locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{tl({ en: 'Moon (33-43)', hi: 'चन्द्र (33-43)', sa: 'चन्द्र (33-43)' }, locale)}</span>
            <span className="text-text-secondary">{tl({ en: 'Emotional maturity, mother, travel, home, public image, mental growth', hi: 'भावनात्मक परिपक्वता, माता, यात्रा, गृह, सार्वजनिक छवि, मानसिक वृद्धि', sa: 'भावनात्मक परिपक्वता, माता, यात्रा, गृह, सार्वजनिक छवि, मानसिक वृद्धि' }, locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{tl({ en: 'Mars (43-50)', hi: 'मंगल (43-50)', sa: 'मंगल (43-50)' }, locale)}</span>
            <span className="text-text-secondary">{tl({ en: 'Property, health/surgery, sibling issues, energy shifts, bold actions', hi: 'सम्पत्ति, स्वास्थ्य/शल्यक्रिया, भाई-बहन मामले, ऊर्जा गिरावट, साहस', sa: 'सम्पत्ति, स्वास्थ्य/शल्यक्रिया, भाई-बहन मामले, ऊर्जा गिरावट, साहस' }, locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{tl({ en: 'Rahu (50-68)', hi: 'राहु (50-68)', sa: 'राहु (50-68)' }, locale)}</span>
            <span className="text-text-secondary">{tl({ en: 'Unconventional success, foreign experiences, technology, intense desires, illusions', hi: 'अपरम्परागत सफलता, विदेशी अनुभव, प्रौद्योगिकी, तीव्र इच्छाएँ, भ्रम', sa: 'अपरम्परागत सफलता, विदेशी अनुभव, प्रौद्योगिकी, तीव्र इच्छाएँ, भ्रम' }, locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{tl({ en: 'Jupiter (68-84)', hi: 'गुरु (68-84)', sa: 'गुरु (68-84)' }, locale)}</span>
            <span className="text-text-secondary">{tl({ en: 'Wisdom accumulation, grandchildren, pilgrimages, charity, legacy building', hi: 'ज्ञान संचय, पोते-पोतियाँ, धार्मिक तीर्थयात्रा, दान, विरासत निर्माण', sa: 'ज्ञान संचय, पोते-पोतियाँ, धार्मिक तीर्थयात्रा, दान, विरासत निर्माण' }, locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{tl({ en: 'Saturn (84-103)', hi: 'शनि (84-103)', sa: 'शनि (84-103)' }, locale)}</span>
            <span className="text-text-secondary">{tl({ en: 'Karmic maturity, chronic health, completion of structures, renunciation', hi: 'कर्म परिपक्वता, दीर्घकालिक स्वास्थ्य, संरचनाओं का पूर्ण होना, त्याग', sa: 'कर्म परिपक्वता, दीर्घकालिक स्वास्थ्य, संरचनाओं का पूर्ण होना, त्याग' }, locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{tl({ en: 'Mercury (103-120)', hi: 'बुध (103-120)', sa: 'बुध (103-120)' }, locale)}</span>
            <span className="text-text-secondary">{tl({ en: 'Intellectual legacy, communication, final adaptations, life cycle complete', hi: 'बौद्धिक विरासत, संवाद, अन्तिम अनुकूलन, जीवन चक्र पूर्ण', sa: 'बौद्धिक विरासत, संवाद, अन्तिम अनुकूलन, जीवन चक्र पूर्ण' }, locale)}</span>
          </div>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ध्यान दें कि यह क्रम सामान्य जीवन चरणों को कैसे प्रतिबिम्बित करता है — यह संयोग नहीं है। यही कारण है कि पराशर ने विंशोत्तरी को सार्वभौमिक दशा प्रणाली के रूप में निर्दिष्ट किया। हालाँकि, अधिकांश लोग केतु दशा से नहीं बल्कि अपने जन्म नक्षत्र के अनुसार बीच से आरम्भ करते हैं, इसलिए प्रत्येक व्यक्ति का जीवन प्रतिरूप अद्वितीय होता है।</>
            : <>Notice how this sequence mirrors typical life phases — this is not coincidence. It is why Parashara prescribed Vimshottari as the default system. However, most people do not start from Ketu but enter the cycle at whatever point their birth nakshatra dictates, which is why each person&apos;s life pattern is unique.</>}
        </p>
      </section>

      {/* Misconceptions Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><span className="text-gold-light font-medium">&quot;राहु और शनि दशा सदा बुरी होती है&quot;</span> — यह असत्य है। राहु दशा असाधारण सांसारिक सफलता ला सकती है (विदेशी अवसर, प्रौद्योगिकी कैरियर, अपरम्परागत उपलब्धियाँ)। शनि दशा स्थायी संरचनाएँ बनाती है (कैरियर शिखर, सम्पत्ति संचय, अनुशासन)। परिणामों की गुणवत्ता आपकी कुण्डली में ग्रह की मर्यादा और भावेशत्व पर निर्भर करती है, ग्रह की सामान्य प्रतिष्ठा पर नहीं।</>
            : <><span className="text-gold-light font-medium">&quot;Rahu and Saturn dashas are always bad&quot;</span> — WRONG. Rahu dasha can bring extraordinary worldly success (foreign opportunities, technology careers, unconventional achievements). Saturn dasha builds lasting structures (career peak, property accumulation, discipline). The QUALITY of results depends on the planet&apos;s dignity and house rulership in YOUR chart, not on the planet&apos;s general reputation.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><span className="text-gold-light font-medium">&quot;शुक्र दशा = विवाह&quot;</span> — हमेशा नहीं। शुक्र दशा विवाह तभी लाती है जब शुक्र 7वें भाव से सम्बन्धित हो (स्वामित्व, स्थिति, या दृष्टि)। वृश्चिक लग्न के लिए शुक्र 7वें और 12वें का स्वामी है — विवाह के साथ हानि/विदेश भी। सिंह लग्न के लिए शुक्र 3 और 10 का स्वामी — विवाह नहीं बल्कि कैरियर और संवाद।</>
            : <><span className="text-gold-light font-medium">&quot;Venus dasha = marriage&quot;</span> — Not always. Venus dasha brings marriage only when Venus is connected to the 7th house (lordship, placement, or aspect). For Scorpio ascendant, Venus rules 7th and 12th — marriage with losses/foreign. For Leo ascendant, Venus rules 3rd and 10th — not marriage but career and communication.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">&quot;केतु दशा = सब कुछ नष्ट&quot;</span> — केतु दशा आध्यात्मिक जागृति, गहन ध्यान अभ्यास, मोक्ष मार्ग, और भौतिक बन्धनों से मुक्ति का सबसे शक्तिशाली काल है। कई महान सन्तों और योगियों ने केतु दशा में ज्ञान प्राप्त किया। केतु विनाश नहीं लाता — वह उस चीज़ को हटाता है जो आपके विकास में बाधा है।</>
            : <><span className="text-gold-light font-medium">&quot;Ketu dasha = everything destroyed&quot;</span> — Ketu dasha is the most powerful period for spiritual awakening, deep meditation practice, the path to moksha, and liberation from material bondage. Many great saints and yogis attained enlightenment during Ketu dasha. Ketu does not destroy — it removes what obstructs your spiritual growth.</>}
        </p>
      </section>

      {/* Practical Application: Event Timing */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Practical Application: Life Event Timing', hi: 'व्यावहारिक प्रयोग: जीवन घटना समय-निर्धारण', sa: 'व्यावहारिक प्रयोग: जीवन घटना समय-निर्धारण' }, locale)}
        </h3>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{tl({ en: 'Event', hi: 'घटना', sa: 'घटना' }, locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{tl({ en: 'Primary Dasha Indicators', hi: 'प्राथमिक दशा संकेतक', sa: 'प्राथमिक दशा संकेतक' }, locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{tl({ en: 'Transit Confirmation', hi: 'गोचर पुष्टि', sa: 'गोचर पुष्टि' }, locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">{tl({ en: 'Marriage', hi: 'विवाह', sa: 'विवाह' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Venus / 7th lord dasha-antardasha', hi: 'शुक्र / सप्तमेश दशा-अन्तर्दशा', sa: 'शुक्र / सप्तमेश दशा-अन्तर्दशा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Jupiter in 7th + Saturn aspecting 7th', hi: 'गुरु 7वें में + शनि 7वें पर दृष्टि', sa: 'गुरु 7वें में + शनि 7वें पर दृष्टि' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">{tl({ en: 'Career Rise', hi: 'कैरियर उन्नति', sa: 'कैरियर उन्नति' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Sun / 10th lord / Jupiter dasha', hi: 'सूर्य / दशमेश / गुरु दशा', sa: 'सूर्य / दशमेश / गुरु दशा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Saturn transiting 10th or 11th', hi: 'शनि 10वें या 11वें में गोचर', sa: 'शनि 10वें या 11वें में गोचर' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">{tl({ en: 'Children', hi: 'सन्तान', sa: 'सन्तान' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Jupiter / 5th lord dasha-antardasha', hi: 'गुरु / पंचमेश दशा-अन्तर्दशा', sa: 'गुरु / पंचमेश दशा-अन्तर्दशा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Jupiter transiting 5th or 9th', hi: 'गुरु 5वें या 9वें में गोचर', sa: 'गुरु 5वें या 9वें में गोचर' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">{tl({ en: 'Health Crisis', hi: 'स्वास्थ्य संकट', sa: 'स्वास्थ्य संकट' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: '6th lord / 8th lord dasha', hi: 'षष्ठेश / अष्टमेश दशा', sa: 'षष्ठेश / अष्टमेश दशा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Saturn in 6/8/12 + Rahu/Ketu axis', hi: 'शनि 6/8/12 में + राहु/केतु अक्ष', sa: 'शनि 6/8/12 में + राहु/केतु अक्ष' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">{tl({ en: 'Foreign Travel', hi: 'विदेश यात्रा', sa: 'विदेश यात्रा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Rahu / 12th lord / 9th lord dasha', hi: 'राहु / द्वादशेश / नवमेश दशा', sa: 'राहु / द्वादशेश / नवमेश दशा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Jupiter transiting 9th/12th', hi: 'गुरु 9/12 में गोचर', sa: 'गुरु 9/12 में गोचर' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">{tl({ en: 'Spiritual Awakening', hi: 'आध्यात्मिक जागृति', sa: 'आध्यात्मिक जागृति' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Ketu / 12th lord dasha', hi: 'केतु / द्वादशेश दशा', sa: 'केतु / द्वादशेश दशा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Ketu transiting 12th or 9th', hi: 'केतु 12 या 9 में गोचर', sa: 'केतु 12 या 9 में गोचर' }, locale)}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-text-primary">{tl({ en: 'Property Purchase', hi: 'सम्पत्ति क्रय', sa: 'सम्पत्ति क्रय' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Mars / 4th lord dasha', hi: 'मंगल / चतुर्थेश दशा', sa: 'मंगल / चतुर्थेश दशा' }, locale)}</td>
                <td className="py-2 px-2">{tl({ en: 'Saturn in 4th + Jupiter aspecting 4th', hi: 'शनि 4वें में + गुरु 4वें पर दृष्टि', sa: 'शनि 4वें में + गुरु 4वें पर दृष्टि' }, locale)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Modern Relevance Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Try It In Our App', hi: 'हमारे ऐप में प्रयोग करें', sa: 'हमारे ऐप में प्रयोग करें' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>हमारा कुण्डली इंजन (/kundali) जन्म से 120 वर्षों तक की पूर्ण विंशोत्तरी दशा तालिका गणित करता है — चन्द्रमा का सटीक निरयन भोगांश, जन्म नक्षत्र, दशा शेष, और सटीक आरम्भ-समाप्ति तिथियों सहित महादशा एवं अन्तर्दशा काल। टिप्पणी (व्याख्यात्मक भाष्य) बताता है कि वर्तमान में कौन-सी दशा चल रही है और आपकी विशिष्ट कुण्डली के लिए उसके सक्रियण का क्या अर्थ है।</>
            : <>Our Kundali engine (/kundali) computes the complete Vimshottari dasha table from birth through 120 years — the Moon&apos;s exact sidereal longitude, birth nakshatra, balance of dasha, and Mahadasha plus Antardasha periods with precise start and end dates. The Tippanni (interpretive commentary) explains which dasha is currently running and what its activation means for your specific chart.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>हमारी इंटरैक्टिव दशा प्रयोगशाला (/learn/labs/dasha) में अपना जन्म विवरण दर्ज करें और चन्द्र &rarr; नक्षत्र &rarr; दशा स्वामी &rarr; शेष गणना को चरण दर चरण होते देखें। यह इस मॉड्यूल में सीखे गए प्रत्येक गणना चरण को वास्तविक समय में प्रदर्शित करती है।</>
            : <>Try our Interactive Dasha Lab (/learn/labs/dasha) — enter your birth details and watch the Moon &rarr; Nakshatra &rarr; Dasha Lord &rarr; Balance calculation happen step by step. It demonstrates every calculation step taught in this module in real time.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module11_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

