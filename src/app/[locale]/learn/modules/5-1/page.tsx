'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/5-1.json';

const META: ModuleMeta = {
  id: 'mod_5_1', phase: 2, topic: 'Tithi', moduleNumber: '5.1',
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What is a Tithi?', hi: 'तिथि क्या है?', sa: 'तिथि क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'A tithi is the fundamental unit of the Hindu lunar calendar and the first of the five limbs (angas) of the Panchang. It is defined by the angular separation between the Moon and the Sun as seen from Earth. Every time the Moon moves 12 degrees ahead of the Sun in its orbit, one tithi is completed and the next begins. Since the full circle is 360 degrees and each tithi spans 12 degrees, there are exactly 30 tithis in a complete lunar month (synodic month), from one Amavasya (new Moon) to the next.', hi: 'तिथि हिन्दू चान्द्र पंचांग की मूलभूत इकाई और पंचांग के पाँच अंगों में से प्रथम है। इसे पृथ्वी से देखने पर चन्द्रमा और सूर्य के बीच की कोणीय दूरी द्वारा परिभाषित किया जाता है। जब भी चन्द्रमा अपनी कक्षा में सूर्य से 12 अंश आगे बढ़ता है, एक तिथि पूर्ण होती है और अगली आरम्भ होती है। चूँकि पूर्ण वृत्त 360 अंश का है और प्रत्येक तिथि 12 अंश की है, एक पूर्ण चान्द्र मास (अमावस्या से अमावस्या) में ठीक 30 तिथियाँ होती हैं।', sa: 'तिथि हिन्दू चान्द्र पंचांग की मूलभूत इकाई और पंचांग के पाँच अंगों में से प्रथम है। इसे पृथ्वी से देखने पर चन्द्रमा और सूर्य के बीच की कोणीय दूरी द्वारा परिभाषित किया जाता है। जब भी चन्द्रमा अपनी कक्षा में सूर्य से 12 अंश आगे बढ़ता है, एक तिथि पूर्ण होती है और अगली आरम्भ होती है। चूँकि पूर्ण वृत्त 360 अंश का है और प्रत्येक तिथि 12 अंश की है, एक पूर्ण चान्द्र मास (अमावस्या से अमावस्या) में ठीक 30 तिथियाँ होती हैं।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The 30 tithis are divided into two pakshas (fortnights). Shukla Paksha (the bright half) runs from Amavasya to Purnima, covering tithis 1 through 15 as the Moon waxes. Krishna Paksha (the dark half) runs from Purnima to Amavasya, covering tithis 1 through 15 again (sometimes numbered 16 through 30) as the Moon wanes. The word "Shukla" means bright (the Moon is growing), while "Krishna" means dark (the Moon is diminishing).', hi: '30 तिथियाँ दो पक्षों (पखवाड़ों) में विभक्त हैं। शुक्ल पक्ष (उज्ज्वल अर्ध) अमावस्या से पूर्णिमा तक चलता है, जिसमें चन्द्रमा बढ़ते हुए तिथि 1 से 15 तक पूर्ण करता है। कृष्ण पक्ष (अन्धकार अर्ध) पूर्णिमा से अमावस्या तक चलता है, जिसमें चन्द्रमा घटते हुए पुनः तिथि 1 से 15 (अथवा 16 से 30) तक पूर्ण करता है। "शुक्ल" का अर्थ उज्ज्वल (चन्द्रमा बढ़ रहा) और "कृष्ण" का अर्थ अन्धकार (चन्द्रमा घट रहा) है।', sa: '30 तिथियाँ दो पक्षों (पखवाड़ों) में विभक्त हैं। शुक्ल पक्ष (उज्ज्वल अर्ध) अमावस्या से पूर्णिमा तक चलता है, जिसमें चन्द्रमा बढ़ते हुए तिथि 1 से 15 तक पूर्ण करता है। कृष्ण पक्ष (अन्धकार अर्ध) पूर्णिमा से अमावस्या तक चलता है, जिसमें चन्द्रमा घटते हुए पुनः तिथि 1 से 15 (अथवा 16 से 30) तक पूर्ण करता है। "शुक्ल" का अर्थ उज्ज्वल (चन्द्रमा बढ़ रहा) और "कृष्ण" का अर्थ अन्धकार (चन्द्रमा घट रहा) है।' }, locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Why Tithis Vary in Length', hi: 'तिथियों की अवधि भिन्न क्यों होती है', sa: 'तिथियों की अवधि भिन्न क्यों होती है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Unlike the solar day which is a nearly constant 24 hours, a tithi can last anywhere from about 19 hours to about 26 hours. This variation arises because the Moon travels in an elliptical orbit around the Earth. At perigee (closest approach), the Moon moves at approximately 15.4 degrees per day; at apogee (farthest point), it slows to about 11.8 degrees per day. When the Moon is fast, it sweeps through 12 degrees of elongation quickly, producing a short tithi. When it is slow, covering 12 degrees takes much longer, producing a long tithi.', hi: 'सौर दिवस के विपरीत जो लगभग 24 घण्टे स्थिर रहता है, एक तिथि लगभग 19 घण्टे से 26 घण्टे तक हो सकती है। यह भिन्नता इसलिए है क्योंकि चन्द्रमा पृथ्वी के चारों ओर दीर्घवृत्ताकार कक्षा में भ्रमण करता है। उपभू (निकटतम बिन्दु) पर चन्द्रमा लगभग 15.4 अंश प्रतिदिन चलता है; अपभू (दूरस्थ बिन्दु) पर वह मन्द होकर लगभग 11.8 अंश प्रतिदिन चलता है। जब चन्द्रमा तीव्र गति से होता है तो 12 अंश शीघ्र पूर्ण होते हैं और तिथि छोटी होती है; जब मन्दगति होता है तो तिथि दीर्घ होती है।', sa: 'सौर दिवस के विपरीत जो लगभग 24 घण्टे स्थिर रहता है, एक तिथि लगभग 19 घण्टे से 26 घण्टे तक हो सकती है। यह भिन्नता इसलिए है क्योंकि चन्द्रमा पृथ्वी के चारों ओर दीर्घवृत्ताकार कक्षा में भ्रमण करता है। उपभू (निकटतम बिन्दु) पर चन्द्रमा लगभग 15.4 अंश प्रतिदिन चलता है; अपभू (दूरस्थ बिन्दु) पर वह मन्द होकर लगभग 11.8 अंश प्रतिदिन चलता है। जब चन्द्रमा तीव्र गति से होता है तो 12 अंश शीघ्र पूर्ण होते हैं और तिथि छोटी होती है; जब मन्दगति होता है तो तिथि दीर्घ होती है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The concept of tithi is among the oldest in Indian astronomy, mentioned in the Vedanga Jyotisha (c. 1400 BCE), the earliest known Indian astronomical text. Surya Siddhanta, the landmark siddhantic text, provides precise mathematical formulas for computing tithi from the longitudes of the Sun and Moon. Brihat Parashara Hora Shastra (BPHS) integrates tithis into the predictive framework of Jyotish, assigning each tithi a ruling deity and specific significations for mundane and electional astrology.', hi: 'तिथि की अवधारणा भारतीय खगोलशास्त्र में प्राचीनतम में से एक है, जिसका उल्लेख वेदांग ज्योतिष (लगभग 1400 ई.पू.) में मिलता है जो ज्ञात प्राचीनतम भारतीय खगोलीय ग्रन्थ है। सूर्य सिद्धान्त सूर्य और चन्द्रमा के स्पष्ट भोगांश से तिथि गणना के सटीक गणितीय सूत्र प्रदान करता है। बृहत् पाराशर होरा शास्त्र (BPHS) ने तिथियों को ज्योतिष के फलादेश ढाँचे में समाहित किया, प्रत्येक तिथि को अधिष्ठाता देवता और विशिष्ट फलादेश प्रदान किए।', sa: 'तिथि की अवधारणा भारतीय खगोलशास्त्र में प्राचीनतम में से एक है, जिसका उल्लेख वेदांग ज्योतिष (लगभग 1400 ई.पू.) में मिलता है जो ज्ञात प्राचीनतम भारतीय खगोलीय ग्रन्थ है। सूर्य सिद्धान्त सूर्य और चन्द्रमा के स्पष्ट भोगांश से तिथि गणना के सटीक गणितीय सूत्र प्रदान करता है। बृहत् पाराशर होरा शास्त्र (BPHS) ने तिथियों को ज्योतिष के फलादेश ढाँचे में समाहित किया, प्रत्येक तिथि को अधिष्ठाता देवता और विशिष्ट फलादेश प्रदान किए।' }, locale)}
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
          {tl({ en: 'Tithi Deities, Natures & Auspiciousness', hi: 'तिथि देवता, स्वभाव एवं शुभत्व', sa: 'तिथि देवता, स्वभाव एवं शुभत्व' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Each tithi has a presiding deity who imparts its essential character. Pratipada (1st) is governed by Agni (fire), Dwitiya (2nd) by Brahma, Tritiya (3rd) by Gauri, Chaturthi (4th) by Ganapati, Panchami (5th) by Nagas, Shashthi (6th) by Kartikeya, Saptami (7th) by Surya, Ashtami (8th) by Shiva, Navami (9th) by Durga, Dashami (10th) by Yama, Ekadashi (11th) by Vishnu, Dwadashi (12th) by Hari, Trayodashi (13th) by Kamadeva, Chaturdashi (14th) by Shiva, and Purnima/Amavasya (15th/30th) by the Moon/Pitris respectively. These associations determine which activities are most favorable on each tithi.', hi: 'प्रत्येक तिथि का एक अधिष्ठाता देवता होता है जो उसके मूल स्वभाव को प्रभावित करता है। प्रतिपदा (1ली) अग्नि द्वारा शासित, द्वितीया (2री) ब्रह्मा, तृतीया (3री) गौरी, चतुर्थी (4थी) गणपति, पंचमी (5वीं) नाग, षष्ठी (6ठी) कार्तिकेय, सप्तमी (7वीं) सूर्य, अष्टमी (8वीं) शिव, नवमी (9वीं) दुर्गा, दशमी (10वीं) यम, एकादशी (11वीं) विष्णु, द्वादशी (12वीं) हरि, त्रयोदशी (13वीं) कामदेव, चतुर्दशी (14वीं) शिव, तथा पूर्णिमा/अमावस्या (15वीं/30वीं) क्रमशः चन्द्र/पितरों द्वारा शासित है।', sa: 'प्रत्येक तिथि का एक अधिष्ठाता देवता होता है जो उसके मूल स्वभाव को प्रभावित करता है। प्रतिपदा (1ली) अग्नि द्वारा शासित, द्वितीया (2री) ब्रह्मा, तृतीया (3री) गौरी, चतुर्थी (4थी) गणपति, पंचमी (5वीं) नाग, षष्ठी (6ठी) कार्तिकेय, सप्तमी (7वीं) सूर्य, अष्टमी (8वीं) शिव, नवमी (9वीं) दुर्गा, दशमी (10वीं) यम, एकादशी (11वीं) विष्णु, द्वादशी (12वीं) हरि, त्रयोदशी (13वीं) कामदेव, चतुर्दशी (14वीं) शिव, तथा पूर्णिमा/अमावस्या (15वीं/30वीं) क्रमशः चन्द्र/पितरों द्वारा शासित है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The 30 tithis are classified into five groups of six, each group sharing a common nature (svabhava). The Nanda (joy-giving) group includes the 1st, 6th, and 11th tithis of each paksha. Bhadra (auspicious) includes the 2nd, 7th, and 12th. Jaya (victorious) includes the 3rd, 8th, and 13th. Rikta (empty/void) includes the 4th, 9th, and 14th. Purna (complete/full) includes the 5th, 10th, and 15th. Among these, Rikta tithis (Chaturthi, Navami, Chaturdashi) are generally considered inauspicious for initiating new activities, while Nanda and Bhadra tithis are widely favored.', hi: '30 तिथियाँ छह-छह के पाँच समूहों में वर्गीकृत हैं, प्रत्येक समूह का एक समान स्वभाव है। नन्दा (आनन्ददायक) में प्रत्येक पक्ष की 1ली, 6ठी और 11वीं तिथि आती है। भद्रा (शुभ) में 2री, 7वीं और 12वीं। जया (विजयी) में 3री, 8वीं और 13वीं। रिक्ता (शून्य) में 4थी, 9वीं और 14वीं। पूर्णा (सम्पूर्ण) में 5वीं, 10वीं और 15वीं। इनमें रिक्ता तिथियाँ (चतुर्थी, नवमी, चतुर्दशी) नये कार्यों के लिए सामान्यतः अशुभ मानी जाती हैं, जबकि नन्दा और भद्रा तिथियाँ अधिक अनुकूल हैं।', sa: '30 तिथियाँ छह-छह के पाँच समूहों में वर्गीकृत हैं, प्रत्येक समूह का एक समान स्वभाव है। नन्दा (आनन्ददायक) में प्रत्येक पक्ष की 1ली, 6ठी और 11वीं तिथि आती है। भद्रा (शुभ) में 2री, 7वीं और 12वीं। जया (विजयी) में 3री, 8वीं और 13वीं। रिक्ता (शून्य) में 4थी, 9वीं और 14वीं। पूर्णा (सम्पूर्ण) में 5वीं, 10वीं और 15वीं। इनमें रिक्ता तिथियाँ (चतुर्थी, नवमी, चतुर्दशी) नये कार्यों के लिए सामान्यतः अशुभ मानी जाती हैं, जबकि नन्दा और भद्रा तिथियाँ अधिक अनुकूल हैं।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Examples', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण 1:</span> एक दम्पति विवाह तिथि चुनना चाहता है। द्वितीया (भद्रा समूह, ब्रह्मा शासित) और पंचमी (पूर्णा समूह) उत्तम विकल्प हैं। यदि दोनों शुक्ल पक्ष में अनुकूल नक्षत्र के साथ आएँ तो मुहूर्त अत्यन्त बलवान होता है। चतुर्थी या नवमी जैसी रिक्ता तिथियाँ विवाह हेतु पूर्णतया वर्जित हैं।</> : <><span className="text-gold-light font-medium">Example 1:</span> A couple wishes to choose a wedding date. Dwitiya (Bhadra group, ruled by Brahma the creator) and Panchami (Purna group) are excellent choices. If both fall in Shukla Paksha with a favorable nakshatra, the muhurta is exceptionally strong. Rikta tithis like Chaturthi or Navami would be avoided entirely for marriage.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण 2:</span> एकादशी (11वीं, नन्दा समूह, विष्णु शासित) प्रमुख उपवास तिथि है। भक्त ज्येष्ठ मास में निर्जला (जलरहित) एकादशी का पालन करते हैं। चूँकि एकादशी दोनों पक्षों में आती है, वर्ष में 24 एकादशियाँ होती हैं, प्रत्येक का अपना विशिष्ट महत्त्व और नाम है।</> : <><span className="text-gold-light font-medium">Example 2:</span> Ekadashi (11th, Nanda group, ruled by Vishnu) is the premier fasting tithi. Devotees observe Nirjala (waterless) Ekadashi in Jyeshtha month. Since Ekadashi occurs in both pakshas, there are 24 Ekadashis per year, each with unique significance and name.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;अमावस्या सदैव अशुभ और पूर्णिमा सदैव शुभ होती है।&quot; वास्तव में अमावस्या पितृ कर्म, तान्त्रिक साधना और गहन ध्यान के लिए अत्यन्त शुभ मानी जाती है। दीपावली जैसे अनेक शक्तिशाली त्योहार अमावस्या पर पड़ते हैं। इसी प्रकार पूर्णिमा सर्वत्र शुभ नहीं — गोपनीयता या एकान्तवास चाहने वाले कार्यों के लिए अमावस्या अधिक उपयुक्त है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Amavasya is always bad and Purnima is always good.&quot; In reality, Amavasya is considered highly auspicious for Pitru Karma (ancestral rites), tantric practices, and deep meditation. Many powerful festivals like Diwali fall on Amavasya. Similarly, Purnima is not universally positive — certain activities requiring secrecy or withdrawal are better on Amavasya.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Tithi remains the most consulted element of the Panchang in modern India. Wedding dates, housewarming ceremonies, business launches, and religious observances are all planned according to tithi. Our application computes tithis using precise Moon-Sun elongation calculations based on Meeus algorithms, achieving accuracy within one minute of professional ephemeris values.', hi: 'आधुनिक भारत में तिथि पंचांग का सर्वाधिक परामर्शित अंग बनी हुई है। विवाह तिथि, गृह प्रवेश, व्यापार आरम्भ और धार्मिक अनुष्ठान सभी तिथि के अनुसार नियोजित किये जाते हैं। हमारा अनुप्रयोग मीयस एल्गोरिदम पर आधारित सटीक चन्द्र-सूर्य कोणीय गणना से तिथि की गणना करता है, जो व्यावसायिक पंचांग मूल्यों से एक मिनट के भीतर सटीक है।', sa: 'आधुनिक भारत में तिथि पंचांग का सर्वाधिक परामर्शित अंग बनी हुई है। विवाह तिथि, गृह प्रवेश, व्यापार आरम्भ और धार्मिक अनुष्ठान सभी तिथि के अनुसार नियोजित किये जाते हैं। हमारा अनुप्रयोग मीयस एल्गोरिदम पर आधारित सटीक चन्द्र-सूर्य कोणीय गणना से तिथि की गणना करता है, जो व्यावसायिक पंचांग मूल्यों से एक मिनट के भीतर सटीक है।' }, locale)}
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
          {tl({ en: 'Tithi Calculation Method', hi: 'तिथि गणना विधि', sa: 'तिथि गणना विधि' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'To compute the current tithi, first determine the true (apparent) sidereal longitudes of the Moon and Sun. Then calculate the elongation: Elongation = Moon_longitude - Sun_longitude. If the result is negative, add 360 degrees. The tithi number is then: Tithi = floor(Elongation / 12) + 1. For example, if the Moon is at 85 degrees and the Sun at 37 degrees, the elongation is 48 degrees, and tithi = floor(48/12) + 1 = 5, which is Panchami.', hi: 'वर्तमान तिथि गणना हेतु पहले चन्द्रमा और सूर्य के स्पष्ट (दृश्य) सायन भोगांश निकालें। फिर कोणीय दूरी ज्ञात करें: कोणीय दूरी = चन्द्र_भोगांश - सूर्य_भोगांश। यदि परिणाम ऋणात्मक हो तो 360 अंश जोड़ें। तिथि संख्या = floor(कोणीय दूरी / 12) + 1। उदाहरणार्थ, यदि चन्द्रमा 85 अंश पर और सूर्य 37 अंश पर है, तो कोणीय दूरी 48 अंश है, और तिथि = floor(48/12) + 1 = 5 अर्थात् पंचमी।', sa: 'वर्तमान तिथि गणना हेतु पहले चन्द्रमा और सूर्य के स्पष्ट (दृश्य) सायन भोगांश निकालें। फिर कोणीय दूरी ज्ञात करें: कोणीय दूरी = चन्द्र_भोगांश - सूर्य_भोगांश। यदि परिणाम ऋणात्मक हो तो 360 अंश जोड़ें। तिथि संख्या = floor(कोणीय दूरी / 12) + 1। उदाहरणार्थ, यदि चन्द्रमा 85 अंश पर और सूर्य 37 अंश पर है, तो कोणीय दूरी 48 अंश है, और तिथि = floor(48/12) + 1 = 5 अर्थात् पंचमी।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'A Kshaya (skipped) tithi occurs when a tithi begins and ends between two consecutive sunrises, meaning no sunrise falls during that tithi. This happens when the Moon is moving very fast (near perigee). Conversely, an Adhika (extra/repeated) tithi occurs when a tithi spans three sunrises because the Moon is moving slowly (near apogee), causing the same tithi to govern two consecutive days.', hi: 'क्षय (छूटी हुई) तिथि तब होती है जब कोई तिथि दो क्रमागत सूर्योदयों के बीच आरम्भ और समाप्त हो जाती है, अर्थात् उस तिथि के दौरान कोई सूर्योदय नहीं होता। यह तब होता है जब चन्द्रमा अत्यन्त तीव्रगति (उपभू के निकट) से चल रहा हो। इसके विपरीत, अधिक (अतिरिक्त/दोहरी) तिथि तब होती है जब कोई तिथि तीन सूर्योदयों तक फैली हो क्योंकि चन्द्रमा मन्दगति (अपभू के निकट) से चल रहा हो, जिससे एक ही तिथि दो लगातार दिनों पर शासन करती है।', sa: 'क्षय (छूटी हुई) तिथि तब होती है जब कोई तिथि दो क्रमागत सूर्योदयों के बीच आरम्भ और समाप्त हो जाती है, अर्थात् उस तिथि के दौरान कोई सूर्योदय नहीं होता। यह तब होता है जब चन्द्रमा अत्यन्त तीव्रगति (उपभू के निकट) से चल रहा हो। इसके विपरीत, अधिक (अतिरिक्त/दोहरी) तिथि तब होती है जब कोई तिथि तीन सूर्योदयों तक फैली हो क्योंकि चन्द्रमा मन्दगति (अपभू के निकट) से चल रहा हो, जिससे एक ही तिथि दो लगातार दिनों पर शासन करती है।' }, locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Tithi at Sunrise & the Dwi-Tithi Rule', hi: 'सूर्योदय की तिथि एवं द्वि-तिथि नियम', sa: 'सूर्योदय की तिथि एवं द्वि-तिथि नियम' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'In the Hindu Panchang, the tithi prevailing at the moment of local sunrise determines that day\u2019s official tithi. Even if a tithi lasts only a few minutes past sunrise before transitioning, that brief presence at sunrise claims the day. This sunrise-based reckoning is the foundation of festival date calculation across all regional calendars.', hi: 'हिन्दू पंचांग में स्थानीय सूर्योदय के क्षण जो तिथि चल रही होती है, वही उस दिन की अधिकृत तिथि होती है। भले ही कोई तिथि सूर्योदय के बाद केवल कुछ मिनट ही रहे और फिर बदल जाए, सूर्योदय पर उसकी वह संक्षिप्त उपस्थिति ही दिन का निर्धारण करती है। यह सूर्योदय-आधारित गणना सभी क्षेत्रीय पंचांगों में त्योहार तिथि निर्धारण का आधार है। द्वि-तिथि नियम विशिष्ट त्योहारों पर लागू होता है: यदि एक ही तिथि दो दिनों के सूर्योदय पर हो तो एकादशी हेतु दूसरा दिन और अन्य सभी तिथियों हेतु पहला दिन मान्य होता है।', sa: 'हिन्दू पंचांग में स्थानीय सूर्योदय के क्षण जो तिथि चल रही होती है, वही उस दिन की अधिकृत तिथि होती है। भले ही कोई तिथि सूर्योदय के बाद केवल कुछ मिनट ही रहे और फिर बदल जाए, सूर्योदय पर उसकी वह संक्षिप्त उपस्थिति ही दिन का निर्धारण करती है। यह सूर्योदय-आधारित गणना सभी क्षेत्रीय पंचांगों में त्योहार तिथि निर्धारण का आधार है। द्वि-तिथि नियम विशिष्ट त्योहारों पर लागू होता है: यदि एक ही तिथि दो दिनों के सूर्योदय पर हो तो एकादशी हेतु दूसरा दिन और अन्य सभी तिथियों हेतु पहला दिन मान्य होता है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Examples', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">गणना:</span> सूर्योदय पर चन्द्र = 220.5 अंश, सूर्य = 15.3 अंश। कोणीय दूरी = 220.5 - 15.3 = 205.2 अंश। तिथि = floor(205.2 / 12) + 1 = floor(17.1) + 1 = 17 + 1 = 18। यह कृष्ण पक्ष तृतीया है (कृष्ण पक्ष की 3री तिथि: 15 + 3 = कुल 18वीं)।</> : <><span className="text-gold-light font-medium">Calculation:</span> At sunrise, Moon = 220.5 degrees, Sun = 15.3 degrees. Elongation = 220.5 - 15.3 = 205.2 degrees. Tithi = floor(205.2 / 12) + 1 = floor(17.1) + 1 = 17 + 1 = 18. This is Krishna Paksha Tritiya (the 3rd tithi of the dark half: 15 + 3 = 18th overall).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;क्षय तिथि का अर्थ है कि वह तिथि अस्तित्व में ही नहीं आई।&quot; क्षय का अर्थ मात्र इतना है कि वह तिथि दो सूर्योदयों के बीच आरम्भ और समाप्त हो गई, अतः कोई भी दिन उसके नाम पर नहीं रखा जाता। खगोलीय रूप से वह तिथि अवश्य घटित हुई — वह इतनी लघु थी कि किसी सूर्योदय पर उपस्थित न रह सकी। क्षय तिथियाँ दुर्लभ (वर्ष में कुछ ही) होती हैं और उनके त्योहार दायित्व सामान्यतः निकटवर्ती तिथि पर स्थानान्तरित हो जाते हैं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;A Kshaya tithi means the tithi ceases to exist.&quot; Kshaya simply means that tithi started and ended between two sunrises, so no day is named after it. The tithi still occurred astronomically — it was just too short to be present at any sunrise. Kshaya tithis are uncommon (a few per year) and their festival obligations typically shift to the adjacent tithi.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Accurate tithi computation is essential for any digital Panchang. Our application uses the Meeus algorithm to compute precise Sun and Moon longitudes, then derives tithis using the elongation formula described above. The dwi-tithi rule is programmatically implemented to correctly assign festivals to the right Gregorian date, matching results from Drik Panchang to within one minute.', hi: 'किसी भी डिजिटल पंचांग के लिए सटीक तिथि गणना अनिवार्य है। हमारा अनुप्रयोग मीयस एल्गोरिदम द्वारा सूर्य और चन्द्रमा के सटीक भोगांश की गणना करता है, फिर ऊपर वर्णित कोणीय दूरी सूत्र से तिथि निकालता है। द्वि-तिथि नियम प्रोग्रामेटिक रूप से लागू किया गया है ताकि त्योहार सही ग्रेगोरियन तारीख पर निर्धारित हों, जो दृक् पंचांग से एक मिनट के भीतर मेल खाता है।', sa: 'किसी भी डिजिटल पंचांग के लिए सटीक तिथि गणना अनिवार्य है। हमारा अनुप्रयोग मीयस एल्गोरिदम द्वारा सूर्य और चन्द्रमा के सटीक भोगांश की गणना करता है, फिर ऊपर वर्णित कोणीय दूरी सूत्र से तिथि निकालता है। द्वि-तिथि नियम प्रोग्रामेटिक रूप से लागू किया गया है ताकि त्योहार सही ग्रेगोरियन तारीख पर निर्धारित हों, जो दृक् पंचांग से एक मिनट के भीतर मेल खाता है।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module5_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
