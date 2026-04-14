'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-6.json';

const META: ModuleMeta = {
  id: 'mod_0_6',
  phase: 0,
  topic: 'Foundations',
  moduleNumber: '0.6',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 10,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: `Here\'s something that might surprise you: every Hindu ritual your grandparents perform has an astronomical calculation running underneath it. When your mother lights a lamp at sunset during Diwali, she\'s marking the exact solar position on Kartik Amavasya. When a pandit picks your wedding date, he\'s solving a multi-variable optimization problem across 7 astronomical parameters. When you fast on Ekadashi, you\'re responding to a specific Moon-Sun angular relationship. None of this is random tradition \u2014 it\'s applied astronomy.`, hi: `यह बात आपको चौंका सकती है: आपके दादा-दादी जो भी हिन्दू कर्मकाण्ड करते हैं, उसके नीचे एक खगोलीय गणना चल रही है। जब आपकी माँ दिवाली पर सूर्यास्त में दीप जलाती हैं, वे कार्तिक अमावस्या पर सटीक सौर स्थिति चिह्नित कर रही हैं। जब पण्डित आपकी शादी की तारीख चुनता है, वह 7 खगोलीय मापदण्डों पर बहु-चर अनुकूलन समस्या हल कर रहा है। जब आप एकादशी का व्रत रखते हैं, आप एक विशिष्ट चन्द्र-सूर्य कोणीय सम्बन्ध पर प्रतिक्रिया दे रहे हैं। इनमें कुछ भी यादृच्छिक परम्परा नहीं है — यह व्यावहारिक खगोलशास्त्र है।`, sa: `यह बात आपको चौंका सकती है: आपके दादा-दादी जो भी हिन्दू कर्मकाण्ड करते हैं, उसके नीचे एक खगोलीय गणना चल रही है। जब आपकी माँ दिवाली पर सूर्यास्त में दीप जलाती हैं, वे कार्तिक अमावस्या पर सटीक सौर स्थिति चिह्नित कर रही हैं। जब पण्डित आपकी शादी की तारीख चुनता है, वह 7 खगोलीय मापदण्डों पर बहु-चर अनुकूलन समस्या हल कर रहा है। जब आप एकादशी का व्रत रखते हैं, आप एक विशिष्ट चन्द्र-सूर्य कोणीय सम्बन्ध पर प्रतिक्रिया दे रहे हैं। इनमें कुछ भी यादृच्छिक परम्परा नहीं है — यह व्यावहारिक खगोलशास्त्र है।` }, locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Every Hindu Ritual Has an Astronomical Basis', hi: 'प्रत्येक हिन्दू कर्मकाण्ड का खगोलीय आधार है', sa: 'प्रत्येक हिन्दू कर्मकाण्ड का खगोलीय आधार है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Ever wondered why fast specifically on Ekadashi? Why worship on Purnima? Why Tarpana on Amavasya? Behind all these lies precise astronomical mathematics.', hi: 'आपने कभी सोचा है कि एकादशी पर ही उपवास क्यों? पूर्णिमा पर ही पूजा क्यों? अमावस्या पर ही तर्पण क्यों? इन सबके पीछे सटीक खगोलीय गणित है।', sa: 'आपने कभी सोचा है कि एकादशी पर ही उपवास क्यों? पूर्णिमा पर ही पूजा क्यों? अमावस्या पर ही तर्पण क्यों? इन सबके पीछे सटीक खगोलीय गणित है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Ekadashi Fasting (11th Tithi)', hi: 'एकादशी व्रत (11वीं तिथि)', sa: 'एकादशी व्रत (11वीं तिथि)' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: `When Moon-Sun elongation reaches 120\u00B0-132\u00B0, the Moon\'s gravitational pull on Earth\'s water is at a specific phase. Ayurveda links this to digestive changes \u2014 fasting helps. Whether you accept the mechanism or not, the timing is astronomically precise.`, hi: `जब चन्द्र-सूर्य कोण 120°-132° होता है, चन्द्रमा का गुरुत्वाकर्षण पृथ्वी के जल पर एक विशेष चरण में होता है। आयुर्वेद इसे पाचन परिवर्तनों से जोड़ता है — उपवास सहायक होता है। तन्त्र स्वीकार करें या न करें, समय खगोलीय रूप से सटीक है।`, sa: `जब चन्द्र-सूर्य कोण 120°-132° होता है, चन्द्रमा का गुरुत्वाकर्षण पृथ्वी के जल पर एक विशेष चरण में होता है। आयुर्वेद इसे पाचन परिवर्तनों से जोड़ता है — उपवास सहायक होता है। तन्त्र स्वीकार करें या न करें, समय खगोलीय रूप से सटीक है।` }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Modern chronobiology \u2014 the study of how biological processes relate to time cycles \u2014 earned the 2017 Nobel Prize in Physiology/Medicine. The researchers (Hall, Rosbash, Young) proved that every cell has a molecular clock synchronized to external cycles. The Ekadashi fasting tradition essentially says: "At this specific point in the lunar cycle (120\u00B0-132\u00B0 Moon-Sun elongation), your digestive system operates differently \u2014 so fast." Whether this specific claim holds up to clinical trials is untested, but the FRAMEWORK \u2014 that biological rhythms correlate with celestial cycles \u2014 is now Nobel-winning science.', hi: 'आधुनिक कालजीवविज्ञान (chronobiology) — जैविक प्रक्रियाओं और समय चक्रों के सम्बन्ध का अध्ययन — ने 2017 में चिकित्सा/शरीरविज्ञान का नोबेल पुरस्कार जीता। शोधकर्ताओं (हॉल, रोसबैश, यंग) ने सिद्ध किया कि हर कोशिका में बाहरी चक्रों से समन्वित एक आणविक घड़ी है। एकादशी व्रत परम्परा मूलतः कहती है: "चन्द्र चक्र के इस विशिष्ट बिन्दु पर (120°-132° चन्द्र-सूर्य कोण), आपका पाचन तन्त्र भिन्न रूप से काम करता है — इसलिए उपवास करें।" यह विशिष्ट दावा चिकित्सकीय परीक्षणों में अपरीक्षित है, लेकिन ढाँचा — कि जैविक लय ब्रह्माण्डीय चक्रों से सम्बद्ध हैं — अब नोबेल पुरस्कार विजेता विज्ञान है।', sa: 'आधुनिक कालजीवविज्ञान (chronobiology) — जैविक प्रक्रियाओं और समय चक्रों के सम्बन्ध का अध्ययन — ने 2017 में चिकित्सा/शरीरविज्ञान का नोबेल पुरस्कार जीता। शोधकर्ताओं (हॉल, रोसबैश, यंग) ने सिद्ध किया कि हर कोशिका में बाहरी चक्रों से समन्वित एक आणविक घड़ी है। एकादशी व्रत परम्परा मूलतः कहती है: "चन्द्र चक्र के इस विशिष्ट बिन्दु पर (120°-132° चन्द्र-सूर्य कोण), आपका पाचन तन्त्र भिन्न रूप से काम करता है — इसलिए उपवास करें।" यह विशिष्ट दावा चिकित्सकीय परीक्षणों में अपरीक्षित है, लेकिन ढाँचा — कि जैविक लय ब्रह्माण्डीय चक्रों से सम्बद्ध हैं — अब नोबेल पुरस्कार विजेता विज्ञान है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Purnima (Full Moon) Worship', hi: 'पूर्णिमा पूजा', sa: 'पूर्णिमा पूजा' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'The Moon is directly opposite the Sun \u2014 180\u00B0 elongation. Maximum reflected light. Tidal forces peak. In Vedic thought, the mind (manas) is most active \u2014 ideal for meditation and devotion.', hi: 'चन्द्रमा सूर्य के ठीक विपरीत — 180° कोण। अधिकतम परावर्तित प्रकाश। ज्वारीय बल चरम पर। वैदिक विचार में मन (मानस) सर्वाधिक सक्रिय — ध्यान और भक्ति के लिए आदर्श समय।', sa: 'चन्द्रमा सूर्य के ठीक विपरीत — 180° कोण। अधिकतम परावर्तित प्रकाश। ज्वारीय बल चरम पर। वैदिक विचार में मन (मानस) सर्वाधिक सक्रिय — ध्यान और भक्ति के लिए आदर्श समय।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Amavasya (New Moon) Tarpana', hi: 'अमावस्या तर्पण', sa: 'अमावस्या तर्पण' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Moon conjunct Sun \u2014 invisible. The "darkest" time. Traditionally associated with ancestor remembrance (Pitru Tarpana). The astronomical alignment is real; the cultural meaning layers onto it.', hi: 'चन्द्रमा सूर्य के साथ युति में — अदृश्य। "सबसे अँधेरा" समय। पारम्परिक रूप से पितृ स्मरण (पितृ तर्पण) से जुड़ा। खगोलीय संरेखण वास्तविक है; सांस्कृतिक अर्थ उस पर आधारित है।', sa: 'चन्द्रमा सूर्य के साथ युति में — अदृश्य। "सबसे अँधेरा" समय। पारम्परिक रूप से पितृ स्मरण (पितृ तर्पण) से जुड़ा। खगोलीय संरेखण वास्तविक है; सांस्कृतिक अर्थ उस पर आधारित है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Key Historical Fact', hi: 'रोचक तथ्य', sa: 'रोचक तथ्य' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: `Aryabhata correctly explained that the Moon shines by REFLECTED sunlight (not self-luminous), and that eclipses are caused by Earth\'s shadow (not Rahu swallowing the Moon). He wrote this in 499 CE \u2014 while Europe was in the Dark Ages. He then reconciled this with the Rahu-Ketu mythological framework as a teaching tool.`, hi: `आर्यभट ने सही ढंग से समझाया कि चन्द्रमा परावर्तित सूर्य प्रकाश से चमकता है (स्वयं प्रकाशमान नहीं), और ग्रहण पृथ्वी की छाया से होते हैं (राहु चन्द्रमा को निगलने से नहीं)। उन्होंने यह 499 ई. में लिखा — जब यूरोप अन्धकार युग में था। फिर उन्होंने राहु-केतु पौराणिक ढाँचे को शिक्षण उपकरण के रूप में समन्वित किया।`, sa: `आर्यभट ने सही ढंग से समझाया कि चन्द्रमा परावर्तित सूर्य प्रकाश से चमकता है (स्वयं प्रकाशमान नहीं), और ग्रहण पृथ्वी की छाया से होते हैं (राहु चन्द्रमा को निगलने से नहीं)। उन्होंने यह 499 ई. में लिखा — जब यूरोप अन्धकार युग में था। फिर उन्होंने राहु-केतु पौराणिक ढाँचे को शिक्षण उपकरण के रूप में समन्वित किया।` }, locale)}
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
          {tl({ en: 'Why Specific Days and Times Matter', hi: 'विशेष दिन और समय क्यों महत्त्वपूर्ण हैं', sa: 'विशेष दिन और समय क्यों महत्त्वपूर्ण हैं' }, locale)}
        </h3>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Tuesday — Mars-Day (Mangalavara)', hi: 'मंगलवार — मंगल-दिवस', sa: 'मंगलवार — मंगल-दिवस' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Mars rules courage, conflict, surgery. Hanuman worship on Tuesday = invoking Mars energy through the warrior-deity. Hanuman embodies strength, valor, and unwavering devotion \u2014 exactly the qualities Mars represents.', hi: 'मंगल साहस, संघर्ष, शल्य चिकित्सा का शासक है। मंगलवार को हनुमान पूजा = योद्धा-देवता के माध्यम से मंगल ऊर्जा का आह्वान। हनुमान बल, पराक्रम और अटल भक्ति के प्रतीक हैं — ठीक वही गुण जो मंगल ग्रह प्रतिनिधित्व करता है।', sa: 'मंगल साहस, संघर्ष, शल्य चिकित्सा का शासक है। मंगलवार को हनुमान पूजा = योद्धा-देवता के माध्यम से मंगल ऊर्जा का आह्वान। हनुमान बल, पराक्रम और अटल भक्ति के प्रतीक हैं — ठीक वही गुण जो मंगल ग्रह प्रतिनिधित्व करता है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Saturday — Saturn-Day (Shanivara)', hi: 'शनिवार — शनि-दिवस', sa: 'शनिवार — शनि-दिवस' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: `Saturn rules discipline, karma, hardship. Shani temple visits on Saturday = acknowledging Saturn\'s lessons. Not fear, but respect \u2014 like respecting a tough teacher who taught you the most.`, hi: `शनि अनुशासन, कर्म, कठिनाई का शासक है। शनि मन्दिर दर्शन = शनि के पाठों को स्वीकार करना। यह भय नहीं, सम्मान है — ठीक वैसे जैसे कठोर शिक्षक का सम्मान करते हैं जिसने आपको सबसे अधिक सिखाया।`, sa: `शनि अनुशासन, कर्म, कठिनाई का शासक है। शनि मन्दिर दर्शन = शनि के पाठों को स्वीकार करना। यह भय नहीं, सम्मान है — ठीक वैसे जैसे कठोर शिक्षक का सम्मान करते हैं जिसने आपको सबसे अधिक सिखाया।` }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: `Think about it: you already practice planetary awareness without realizing it. You call it "Monday blues" (Moon-day = emotional, reflective). You say "TGIF" because Friday (Venus-day = Shukravara) feels lighter, more social. "Saturday night" (Saturn-day = discipline relaxes) is when you let loose. The planetary hour system that created our weekday names is EXACTLY the Hora system in Jyotish. You\'ve been doing applied Jyotish your whole life \u2014 you just didn\'t know the Sanskrit terms.`, hi: `सोचिए: आप पहले से बिना जाने ग्रह जागरूकता का अभ्यास करते हैं। आप "Monday blues" कहते हैं (Moon-day = भावनात्मक, चिन्तनशील)। आप "TGIF" कहते हैं क्योंकि Friday (Venus-day = शुक्रवार) हल्का, अधिक सामाजिक लगता है। "Saturday night" (Saturn-day = अनुशासन ढीला) में आप छुट्टी मनाते हैं। सप्ताह के दिनों के नाम बनाने वाली ग्रह होरा पद्धति ठीक वही होरा पद्धति है जो ज्योतिष में है। आप जीवन भर व्यावहारिक ज्योतिष करते रहे हैं — बस संस्कृत शब्द नहीं जानते थे।`, sa: `सोचिए: आप पहले से बिना जाने ग्रह जागरूकता का अभ्यास करते हैं। आप "Monday blues" कहते हैं (Moon-day = भावनात्मक, चिन्तनशील)। आप "TGIF" कहते हैं क्योंकि Friday (Venus-day = शुक्रवार) हल्का, अधिक सामाजिक लगता है। "Saturday night" (Saturn-day = अनुशासन ढीला) में आप छुट्टी मनाते हैं। सप्ताह के दिनों के नाम बनाने वाली ग्रह होरा पद्धति ठीक वही होरा पद्धति है जो ज्योतिष में है। आप जीवन भर व्यावहारिक ज्योतिष करते रहे हैं — बस संस्कृत शब्द नहीं जानते थे।` }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Marriage Muhurta — Not Arbitrary', hi: 'विवाह मुहूर्त — मनमाना नहीं', sa: 'विवाह मुहूर्त — मनमाना नहीं' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'A good marriage muhurta requires: Moon in a gentle nakshatra, Venus not combust (sufficiently far from Sun), Jupiter aspecting the 7th house, no Rahu Kaal. These are computable astronomical conditions \u2014 not superstition, mathematics.', hi: 'शुभ विवाह मुहूर्त के लिए आवश्यक: सौम्य नक्षत्र में चन्द्रमा, शुक्र अस्त नहीं (सूर्य से पर्याप्त दूर), गुरु की 7वें भाव पर दृष्टि, राहु काल में नहीं। ये गणनीय खगोलीय शर्तें हैं — अन्धविश्वास नहीं, गणित है।', sa: 'शुभ विवाह मुहूर्त के लिए आवश्यक: सौम्य नक्षत्र में चन्द्रमा, शुक्र अस्त नहीं (सूर्य से पर्याप्त दूर), गुरु की 7वें भाव पर दृष्टि, राहु काल में नहीं। ये गणनीय खगोलीय शर्तें हैं — अन्धविश्वास नहीं, गणित है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Sankalpa — A Cosmic Timestamp', hi: 'संकल्प — ब्रह्माण्डीय समय-चिह्न', sa: 'संकल्प — ब्रह्माण्डीय समय-चिह्न' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: `The Sankalpa before every puja states: samvatsara, ayana, ritu, masa, paksha, tithi, vara, nakshatra. You\'re literally declaring "at THIS precise astronomical moment, I make this vow." Our Sankalpa Generator computes all of this automatically.`, hi: `प्रत्येक पूजा से पहले संकल्प में कहा जाता है: सम्वत्सर, अयन, ऋतु, मास, पक्ष, तिथि, वार, नक्षत्र। आप शाब्दिक रूप से घोषणा कर रहे हैं "इस सटीक खगोलीय क्षण पर, मैं यह प्रतिज्ञा करता हूँ।" हमारा संकल्प जनक यह सब स्वचालित रूप से गणित करता है।`, sa: `प्रत्येक पूजा से पहले संकल्प में कहा जाता है: सम्वत्सर, अयन, ऋतु, मास, पक्ष, तिथि, वार, नक्षत्र। आप शाब्दिक रूप से घोषणा कर रहे हैं "इस सटीक खगोलीय क्षण पर, मैं यह प्रतिज्ञा करता हूँ।" हमारा संकल्प जनक यह सब स्वचालित रूप से गणित करता है।` }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Key Historical Fact', hi: 'रोचक तथ्य', sa: 'रोचक तथ्य' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: `The Surya Siddhanta describes time divisions from the "truti" (29.6 microseconds) to the "kalpa" (4.32 billion years \u2014 remarkably close to Earth\'s actual age of 4.54 billion years). From microseconds to billions of years \u2014 this scale of thinking was unique to Indian civilization.`, hi: `सूर्य सिद्धान्त "त्रुटि" (29.6 माइक्रोसेकण्ड) से "कल्प" (4.32 अरब वर्ष — पृथ्वी की वास्तविक आयु 4.54 अरब वर्ष के उल्लेखनीय रूप से निकट) तक समय विभाजन का वर्णन करता है। माइक्रोसेकण्ड से अरबों वर्षों तक — विचार का यह पैमाना भारतीय सभ्यता की विशेषता था।`, sa: `सूर्य सिद्धान्त "त्रुटि" (29.6 माइक्रोसेकण्ड) से "कल्प" (4.32 अरब वर्ष — पृथ्वी की वास्तविक आयु 4.54 अरब वर्ष के उल्लेखनीय रूप से निकट) तक समय विभाजन का वर्णन करता है। माइक्रोसेकण्ड से अरबों वर्षों तक — विचार का यह पैमाना भारतीय सभ्यता की विशेषता था।` }, locale)}
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
          {tl({ en: 'How Our App Connects It All', hi: 'हमारा ऐप यह सब कैसे जोड़ता है', sa: 'हमारा ऐप यह सब कैसे जोड़ता है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Now you know that rituals and astronomy are inseparable. Every feature of our app is built on this connection:', hi: 'अब आप जानते हैं कि कर्मकाण्ड और खगोलशास्त्र अभिन्न हैं। हमारे ऐप की प्रत्येक सुविधा इसी सम्बन्ध पर आधारित है:', sa: 'अब आप जानते हैं कि कर्मकाण्ड और खगोलशास्त्र अभिन्न हैं। हमारे ऐप की प्रत्येक सुविधा इसी सम्बन्ध पर आधारित है:' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <div className="space-y-3">
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '• Daily Panchang \u2192 know the cosmic weather for today', hi: '• दैनिक पंचांग → आज का ब्रह्माण्डीय मौसम जानें', sa: '• दैनिक पंचांग → आज का ब्रह्माण्डीय मौसम जानें' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '• Festival Calendar \u2192 when to celebrate, with astronomical reasons', hi: '• त्योहार कैलेंडर → कब मनाएँ, खगोलीय कारणों सहित', sa: '• त्योहार कैलेंडर → कब मनाएँ, खगोलीय कारणों सहित' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '• Puja Vidhi \u2192 step-by-step worship guides with mantras', hi: '• पूजा विधि → मन्त्रों सहित चरण-दर-चरण पूजा मार्गदर्शिका', sa: '• पूजा विधि → मन्त्रों सहित चरण-दर-चरण पूजा मार्गदर्शिका' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '• Sankalpa Generator \u2192 your personalized cosmic timestamp for any puja', hi: '• संकल्प जनक → किसी भी पूजा के लिए आपका व्यक्तिगत ब्रह्माण्डीय समय-चिह्न', sa: '• संकल्प जनक → किसी भी पूजा के लिए आपका व्यक्तिगत ब्रह्माण्डीय समय-चिह्न' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '• Muhurta AI \u2192 find the best time for any activity, scored 0-100', hi: '• मुहूर्त AI → किसी भी कार्य के लिए सर्वोत्तम समय, 0-100 अंकित', sa: '• मुहूर्त AI → किसी भी कार्य के लिए सर्वोत्तम समय, 0-100 अंकित' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '• Kundali \u2192 your personal cosmic map', hi: '• कुण्डली → आपका व्यक्तिगत ब्रह्माण्डीय मानचित्र', sa: '• कुण्डली → आपका व्यक्तिगत ब्रह्माण्डीय मानचित्र' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '• Learn Jyotish \u2192 understand the science behind all of it', hi: '• ज्योतिष सीखें → इन सबके पीछे का विज्ञान समझें', sa: '• ज्योतिष सीखें → इन सबके पीछे का विज्ञान समझें' }, locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: `Here\'s the beautiful thing about Jyotish: you don\'t have to believe in destiny to find it useful. Use the Panchang as a mindful daily check-in. Use your Kundali as a framework for self-reflection. Use Muhurta as a decision-support tool. Use the Sankalpa as a moment of intention-setting before anything important. The astronomical calculations are exact science. The interpretive layer is cultural wisdom. Take what resonates, leave what doesn\'t \u2014 but at least understand what your grandparents knew before dismissing it.`, hi: `ज्योतिष की सुन्दरता यह है: आपको भाग्य में विश्वास करने की आवश्यकता नहीं कि यह उपयोगी हो। पंचांग को एक सचेत दैनिक जाँच के रूप में उपयोग करें। अपनी कुण्डली को आत्म-चिन्तन के ढाँचे के रूप में। मुहूर्त को निर्णय-सहायता उपकरण के रूप में। संकल्प को किसी भी महत्त्वपूर्ण कार्य से पहले संकल्प-स्थापना के क्षण के रूप। खगोलीय गणनाएँ सटीक विज्ञान हैं। व्याख्या की परत सांस्कृतिक ज्ञान है। जो गूँजे वह लें, जो न गूँजे छोड़ दें — लेकिन कम से कम समझें कि आपके दादा-दादी क्या जानते थे, उसे खारिज करने से पहले।`, sa: `ज्योतिष की सुन्दरता यह है: आपको भाग्य में विश्वास करने की आवश्यकता नहीं कि यह उपयोगी हो। पंचांग को एक सचेत दैनिक जाँच के रूप में उपयोग करें। अपनी कुण्डली को आत्म-चिन्तन के ढाँचे के रूप में। मुहूर्त को निर्णय-सहायता उपकरण के रूप में। संकल्प को किसी भी महत्त्वपूर्ण कार्य से पहले संकल्प-स्थापना के क्षण के रूप। खगोलीय गणनाएँ सटीक विज्ञान हैं। व्याख्या की परत सांस्कृतिक ज्ञान है। जो गूँजे वह लें, जो न गूँजे छोड़ दें — लेकिन कम से कम समझें कि आपके दादा-दादी क्या जानते थे, उसे खारिज करने से पहले।` }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Foundations Complete!', hi: 'आधार पूर्ण!', sa: 'आधार पूर्ण!' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'You now know:', hi: 'अब आप जानते हैं:', sa: 'अब आप जानते हैं:' }, locale)}
        </p>
        <div className="space-y-1">
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: `\u2713 What Jyotish IS (and isn\'t)`, hi: `\u2713 ज्योतिष क्या है (और क्या नहीं)`, sa: `\u2713 ज्योतिष क्या है (और क्या नहीं)` }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '\u2713 How the Hindu calendar works', hi: '\u2713 हिन्दू कैलेंडर कैसे काम करता है', sa: '\u2713 हिन्दू कैलेंडर कैसे काम करता है' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '\u2713 Your rashi and nakshatra', hi: '\u2713 आपकी राशि और नक्षत्र', sa: '\u2713 आपकी राशि और नक्षत्र' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '\u2713 How to read a Panchang', hi: '\u2713 पंचांग कैसे पढ़ें', sa: '\u2713 पंचांग कैसे पढ़ें' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '\u2713 What a Kundali shows', hi: '\u2713 कुण्डली क्या दिखाती है', sa: '\u2713 कुण्डली क्या दिखाती है' }, locale)}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tl({ en: '\u2713 Why rituals have astronomical timing', hi: '\u2713 कर्मकाण्डों का खगोलीय समय क्यों है', sa: '\u2713 कर्मकाण्डों का खगोलीय समय क्यों है' }, locale)}
          </p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          {tl({ en: 'Next: Module 1-1 starts the deeper technical journey \u2014 the ecliptic, degrees, and how we measure the sky.', hi: 'अगला: मॉड्यूल 1-1 गहरी तकनीकी यात्रा आरम्भ करता है — क्रान्तिवृत्त, अंश, और हम आकाश कैसे मापते हैं।', sa: 'अगला: मॉड्यूल 1-1 गहरी तकनीकी यात्रा आरम्भ करता है — क्रान्तिवृत्त, अंश, और हम आकाश कैसे मापते हैं।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module0_6() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
