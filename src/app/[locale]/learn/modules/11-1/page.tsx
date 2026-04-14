'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/11-1.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

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
          {t('imagineKnowingInAdvanceWhich', locale)}
        </p>
      </section>

      {/* What is Vimshottari? */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whatIsVimshottari', locale)}
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
          {t('the9MahadashaPeriods', locale)}
        </h3>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{t('planet', locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{t('sanskrit', locale)}</th>
                <th className="text-gold-light text-center py-2 px-2 font-semibold">{t('years', locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{t('nakshatrasRuled', locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{t('nature', locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{t('lifeThemes', locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Ketu</td>
                <td className="py-2 px-2">केतु</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">7</td>
                <td className="py-2 px-2">{t('ashwiniMaghaMula', locale)}</td>
                <td className="py-2 px-2">{t('spiritualDisruption', locale)}</td>
                <td className="py-2 px-2">{t('detachmentPastKarmaSuddenChanges', locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Venus</td>
                <td className="py-2 px-2">शुक्र</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">20</td>
                <td className="py-2 px-2">{t('bharaniPPhalguniPAshadha', locale)}</td>
                <td className="py-2 px-2">{t('materialAbundance', locale)}</td>
                <td className="py-2 px-2">{t('marriageLuxuryArtsRelationshipsComfort', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Sun</td>
                <td className="py-2 px-2">सूर्य</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">6</td>
                <td className="py-2 px-2">{t('krittikaUPhalguniUAshadha', locale)}</td>
                <td className="py-2 px-2">{t('authority', locale)}</td>
                <td className="py-2 px-2">{t('careerRecognitionFatherGovernmentLeadership', locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Moon</td>
                <td className="py-2 px-2">चन्द्र</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">10</td>
                <td className="py-2 px-2">{t('rohiniHastaShravana', locale)}</td>
                <td className="py-2 px-2">{t('emotional', locale)}</td>
                <td className="py-2 px-2">{t('motherEmotionsTravelPublicImage', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Mars</td>
                <td className="py-2 px-2">मंगल</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">7</td>
                <td className="py-2 px-2">{t('mrigashiraChitraDhanishtha', locale)}</td>
                <td className="py-2 px-2">{t('action', locale)}</td>
                <td className="py-2 px-2">{t('propertySiblingsCourageSurgeryConflicts', locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Rahu</td>
                <td className="py-2 px-2">राहु</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">18</td>
                <td className="py-2 px-2">{t('ardraSwatiShatabhisha', locale)}</td>
                <td className="py-2 px-2">{t('obsession', locale)}</td>
                <td className="py-2 px-2">{t('foreignConnectionsTechnologyUnconventionalSuccess', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Jupiter</td>
                <td className="py-2 px-2">बृहस्पति</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">16</td>
                <td className="py-2 px-2">{t('punarvasuVishakhaPBhadrapada', locale)}</td>
                <td className="py-2 px-2">{t('expansion', locale)}</td>
                <td className="py-2 px-2">{t('childrenEducationWisdomDharmaWealth', locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Saturn</td>
                <td className="py-2 px-2">शनि</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">19</td>
                <td className="py-2 px-2">{t('pushyaAnuradhaUBhadrapada', locale)}</td>
                <td className="py-2 px-2">{t('discipline', locale)}</td>
                <td className="py-2 px-2">{t('careerGrindChronicIssuesStructure', locale)}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-text-primary">Mercury</td>
                <td className="py-2 px-2">बुध</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">17</td>
                <td className="py-2 px-2">{t('ashleshaJyeshthaRevati', locale)}</td>
                <td className="py-2 px-2">{t('intelligence', locale)}</td>
                <td className="py-2 px-2">{t('businessCommunicationSkillsAnalysisAdaptability', locale)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why These Specific Years? */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('whyTheseSpecificYears', locale)}
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
          {t('theSequenceAndNakshatraConnection', locale)}
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
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{t('classicalOrigin', locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>विंशोत्तरी पद्धति बृहत् पराशर होराशास्त्र (BPHS), अध्याय 46 से उत्पन्न है। पराशर इसे सामान्य उपयोग के लिए सर्वाधिक उपयुक्त दशा बताते हैं — जब चन्द्रमा 0° से 360° के बीच हो (अर्थात् सदा)। पराशर 40 से अधिक दशा पद्धतियों (अष्टोत्तरी, योगिनी, आदि) का वर्णन करते हैं, किन्तु वे विशिष्ट चन्द्र स्थितियों के लिए निर्दिष्ट हैं। विंशोत्तरी कलियुग की सार्वभौमिक दशा है।</>
            : <>The Vimshottari system originates from Brihat Parashara Hora Shastra (BPHS), Chapter 46. Parashara describes it as the most suitable dasha for general use when the Moon is between 0 degrees and 360 degrees (i.e., always). Parashara describes over 40 dasha systems (Ashtottari, Yogini, etc.), but those are prescribed for specific Moon conditions. Vimshottari is the universal dasha for Kali Yuga.</>}
        </p>
      </section>

      {/* Key Fact Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">{t('keyFact', locale)}</h4>
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
          {t('computingYourDashaStepBy', locale)}
        </h3>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {t('step1FindTheBirth', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>चन्द्रमा का निरयन (sidereal) भोगांश ज्ञात करें। प्रत्येक नक्षत्र 13°20&apos; (13.333°) का होता है। नक्षत्र संख्या = floor(भोगांश / 13.333) + 1। उदाहरण: चन्द्रमा 167.3° निरयन पर। floor(167.3 / 13.333) + 1 = floor(12.547) + 1 = 12 + 1 = 13 = हस्त नक्षत्र। हस्त का स्वामी चन्द्रमा है।</>
            : <>Find the Moon&apos;s sidereal (nirayana) longitude. Each nakshatra spans 13 degrees 20 minutes (13.333 degrees). Nakshatra number = floor(longitude / 13.333) + 1. Example: Moon at 167.3 degrees sidereal. floor(167.3 / 13.333) + 1 = floor(12.547) + 1 = 12 + 1 = 13 = Hasta nakshatra. Hasta is ruled by Moon.</>}
        </p>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {t('step2DetermineTheStarting', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जन्म नक्षत्र का स्वामी ग्रह = जन्म पर चल रही महादशा का स्वामी। हस्त का स्वामी = चन्द्रमा। अतः जन्म पर चन्द्र महादशा चल रही है। यह सीधा और सरल है — नक्षत्र &rarr; स्वामी ग्रह &rarr; वही ग्रह की दशा।</>
            : <>The planet that rules the birth nakshatra = the Mahadasha lord running at birth. Hasta&apos;s lord = Moon. So Moon Mahadasha is running at birth. This is direct and simple — nakshatra &rarr; ruling planet &rarr; that planet&apos;s dasha.</>}
        </p>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {t('step3CalculateTheRemaining', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>यह सबसे महत्त्वपूर्ण गणना है। चन्द्रमा ने नक्षत्र में कितने अंश तय किए हैं, यह ज्ञात करें। हस्त 160° से आरम्भ होता है। चन्द्रमा 167.3° पर है। तय किए अंश = 167.3 - 160 = 7.3°। कुल नक्षत्र = 13.333°। व्यतीत अनुपात = 7.3 / 13.333 = 0.5475 = 54.75%। चन्द्र की पूर्ण अवधि = 10 वर्ष। शेष = 10 x (1 - 0.5475) = 4.525 वर्ष = 4 वर्ष, 6 मास, 9 दिन। यही &quot;दशा शेष&quot; है जो हर कुण्डली में दिखता है।</>
            : <>This is the most critical calculation. Determine how many degrees the Moon has traversed within the nakshatra. Hasta starts at 160 degrees. Moon is at 167.3 degrees. Degrees traversed = 167.3 - 160 = 7.3 degrees. Total nakshatra = 13.333 degrees. Fraction consumed = 7.3 / 13.333 = 0.5475 = 54.75%. Moon&apos;s full period = 10 years. Remaining = 10 x (1 - 0.5475) = 4.525 years = 4 years, 6 months, 9 days. This is the &quot;balance of dasha&quot; shown in every Kundali.</>}
        </p>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {t('step4BuildTheFull', locale)}
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
          {t('theSubdivisionHierarchy5Levels', locale)}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">1.</span>
            <div>
              <span className="text-text-primary font-semibold">{t('mahadasha', locale)}</span>
              <span className="text-text-secondary"> — {t('majorPeriod620Years', locale)}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">2.</span>
            <div>
              <span className="text-text-primary font-semibold">{t('antardashaBhukti', locale)}</span>
              <span className="text-text-secondary"> — {t('subPeriodMonthsToYears', locale)}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">3.</span>
            <div>
              <span className="text-text-primary font-semibold">{t('pratyantardasha', locale)}</span>
              <span className="text-text-secondary"> — {t('subSubPeriodWeeksTo', locale)}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">4.</span>
            <div>
              <span className="text-text-primary font-semibold">{t('sookshmaDasha', locale)}</span>
              <span className="text-text-secondary"> — {t('periodOfDaysTheSentence', locale)}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">5.</span>
            <div>
              <span className="text-text-primary font-semibold">{t('pranaDasha', locale)}</span>
              <span className="text-text-secondary"> — {t('periodOfHoursTheWord', locale)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Antardasha Calculation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('antardashaCalculationFormula', locale)}
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
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{t('workedExampleDelhiBirthChart', locale)}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title={t('ariesLagnaSunIn10th', locale)}
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
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-2">{t('staggeringPrecision', locale)}</h4>
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
          {t('theFundamentalRuleDashaActivation', locale)}
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
          {t('mahadashaAntardashaInteraction', locale)}
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
          {t('whenDoEventsHappenThe', locale)}
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
          {t('dashaSandhiTheTurbulentTransition', locale)}
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
          {t('realLifePatternDashaLife', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>केतु दशा से आरम्भ मानकर एक सामान्य जीवन प्रतिरूप:</>
            : <>A typical life pattern assuming Ketu dasha at birth:</>}
        </p>
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{t('ketu07', locale)}</span>
            <span className="text-text-secondary">{t('childhoodDisruptionsKarmicFamilyPatterns', locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{t('venus727', locale)}</span>
            <span className="text-text-secondary">{t('educationFirstLoveMarriageFor', locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{t('sun2733', locale)}</span>
            <span className="text-text-secondary">{t('careerEstablishmentFatherRelatedEvents', locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{t('moon3343', locale)}</span>
            <span className="text-text-secondary">{t('emotionalMaturityMotherTravelHome', locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{t('mars4350', locale)}</span>
            <span className="text-text-secondary">{t('propertyHealthSurgerySiblingIssues', locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{t('rahu5068', locale)}</span>
            <span className="text-text-secondary">{t('unconventionalSuccessForeignExperiencesTechnology', locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{t('jupiter6884', locale)}</span>
            <span className="text-text-secondary">{t('wisdomAccumulationGrandchildrenPilgrimagesCharity', locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{t('saturn84103', locale)}</span>
            <span className="text-text-secondary">{t('karmicMaturityChronicHealthCompletion', locale)}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{t('mercury103120', locale)}</span>
            <span className="text-text-secondary">{t('intellectualLegacyCommunicationFinalAdaptations', locale)}</span>
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
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{t('commonMisconceptions', locale)}</h4>
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
          {t('practicalApplicationLifeEventTiming', locale)}
        </h3>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{t('event', locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{t('primaryDashaIndicators', locale)}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{t('transitConfirmation', locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">{t('marriage', locale)}</td>
                <td className="py-2 px-2">{t('venus7thLordDashaAntardasha', locale)}</td>
                <td className="py-2 px-2">{t('jupiterIn7thSaturnAspecting', locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">{t('careerRise', locale)}</td>
                <td className="py-2 px-2">{t('sun10thLordJupiterDasha', locale)}</td>
                <td className="py-2 px-2">{t('saturnTransiting10thOr11th', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">{t('children', locale)}</td>
                <td className="py-2 px-2">{t('jupiter5thLordDashaAntardasha', locale)}</td>
                <td className="py-2 px-2">{t('jupiterTransiting5thOr9th', locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">{t('healthCrisis', locale)}</td>
                <td className="py-2 px-2">{t('k6thLord8thLordDasha', locale)}</td>
                <td className="py-2 px-2">{t('saturnIn6812', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">{t('foreignTravel', locale)}</td>
                <td className="py-2 px-2">{t('rahu12thLord9thLord', locale)}</td>
                <td className="py-2 px-2">{t('jupiterTransiting9th12th', locale)}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">{t('spiritualAwakening', locale)}</td>
                <td className="py-2 px-2">{t('ketu12thLordDasha', locale)}</td>
                <td className="py-2 px-2">{t('ketuTransiting12thOr9th', locale)}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-text-primary">{t('propertyPurchase', locale)}</td>
                <td className="py-2 px-2">{t('mars4thLordDasha', locale)}</td>
                <td className="py-2 px-2">{t('saturnIn4thJupiterAspecting', locale)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Modern Relevance Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{t('tryItInOurApp', locale)}</h4>
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

