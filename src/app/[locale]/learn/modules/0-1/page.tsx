'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-1.json';

const META: ModuleMeta = {
  id: 'mod_0_1',
  phase: 0,
  topic: 'Pre-Foundation',
  moduleNumber: '0.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 10,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

// ─── Content Pages ──────────────────────────────────────────────────────────

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The "Science of Light"', hi: '"ज्योति" का विज्ञान', sa: '"ज्योति" का विज्ञान' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: `The word Jyotish comes from "Jyoti" (ज्योति) — light, luminance. It is NOT fortune-telling. It is the study of celestial luminaries: the Sun, Moon, and planets. This is India's OLDEST continuous scientific tradition — predating Greek astronomy by centuries.`, hi: `ज्योतिष शब्द "ज्योति" (प्रकाश, दीप्ति) से बना है। यह भविष्यवाणी नहीं — यह आकाशीय ज्योतियों का अध्ययन है: सूर्य, चन्द्रमा, और ग्रहों का। यह भारत की सबसे प्राचीन निरन्तर वैज्ञानिक परम्परा है — यूनानी खगोलशास्त्र से भी पुरानी।`, sa: `ज्योतिष शब्द "ज्योति" (प्रकाश, दीप्ति) से बना है। यह भविष्यवाणी नहीं — यह आकाशीय ज्योतियों का अध्ययन है: सूर्य, चन्द्रमा, और ग्रहों का। यह भारत की सबसे प्राचीन निरन्तर वैज्ञानिक परम्परा है — यूनानी खगोलशास्त्र से भी पुरानी।` }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Jyotish has three branches, and only ONE is about horoscopes:', hi: 'ज्योतिष की तीन शाखाएँ हैं, और केवल एक कुण्डली से सम्बन्धित है:', sa: 'ज्योतिष की तीन शाखाएँ हैं, और केवल एक कुण्डली से सम्बन्धित है:' }, locale)}
        </p>
        <ul className="text-text-secondary text-sm space-y-2 ml-4">
          <li>
            <span className="text-gold-light font-bold">{tl({ en: 'Siddhanta', hi: 'सिद्धान्त', sa: 'सिद्धान्त' }, locale)}</span>{' '}
            {tl({ en: '— Mathematical astronomy. Planetary positions, eclipses, sunrise/sunset — pure mathematics.', hi: '— गणितीय खगोलशास्त्र। ग्रहगति, ग्रहण, उदय-अस्त — शुद्ध गणित।', sa: '— गणितीय खगोलशास्त्र। ग्रहगति, ग्रहण, उदय-अस्त — शुद्ध गणित।' }, locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{tl({ en: 'Hora', hi: 'होरा', sa: 'होरा' }, locale)}</span>{' '}
            {tl({ en: '— Birth chart interpretation. This is what most people think of as "astrology."', hi: '— जन्मकुण्डली विश्लेषण। यही वह शाखा है जिसे लोग "ज्योतिष" समझते हैं।', sa: '— जन्मकुण्डली विश्लेषण। यही वह शाखा है जिसे लोग "ज्योतिष" समझते हैं।' }, locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{tl({ en: 'Samhita', hi: 'संहिता', sa: 'संहिता' }, locale)}</span>{' '}
            {tl({ en: '— Mundane astrology: weather, agriculture, national events, natural omens.', hi: '— सामूहिक ज्योतिष: मौसम, कृषि, राष्ट्रीय घटनाएँ, प्राकृतिक संकेत।', sa: '— सामूहिक ज्योतिष: मौसम, कृषि, राष्ट्रीय घटनाएँ, प्राकृतिक संकेत।' }, locale)}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {tl({ en: 'Think of it this way: Siddhanta is like building the telescope. Hora is like looking through it at your life. Samhita is like using it to forecast weather for society.', hi: 'इसे ऐसे समझिए: सिद्धान्त दूरबीन बनाने जैसा है। होरा उससे अपने जीवन को देखने जैसा है। संहिता उससे समाज के लिए मौसम की भविष्यवाणी करने जैसा है।', sa: 'इसे ऐसे समझिए: सिद्धान्त दूरबीन बनाने जैसा है। होरा उससे अपने जीवन को देखने जैसा है। संहिता उससे समाज के लिए मौसम की भविष्यवाणी करने जैसा है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: `Here's a mind-blowing fact: every number on your phone — 0, 1, 2, 3... 9 — was invented in India, originally for astronomical calculations. The West calls them "Arabic numerals" but Arabic scholars called them "Hindu numerals" (al-arqam al-hindiyyah). The concept of zero? That's Brahmagupta, in an astronomy textbook.`, hi: `एक चौंकाने वाला तथ्य: आपके फ़ोन पर हर अंक — 0, 1, 2, 3... 9 — भारत में खगोलीय गणनाओं के लिए आविष्कार किया गया था। पश्चिम इन्हें "अरबी अंक" कहता है, लेकिन अरबी विद्वान इन्हें "हिन्दू अंक" (अल-अरक़ाम अल-हिन्दिय्या) कहते थे। शून्य की अवधारणा? वह ब्रह्मगुप्त की है — एक खगोलशास्त्र की पुस्तक में।`, sa: `एक चौंकाने वाला तथ्य: आपके फ़ोन पर हर अंक — 0, 1, 2, 3... 9 — भारत में खगोलीय गणनाओं के लिए आविष्कार किया गया था। पश्चिम इन्हें "अरबी अंक" कहता है, लेकिन अरबी विद्वान इन्हें "हिन्दू अंक" (अल-अरक़ाम अल-हिन्दिय्या) कहते थे। शून्य की अवधारणा? वह ब्रह्मगुप्त की है — एक खगोलशास्त्र की पुस्तक में।` }, locale)}
        </p>
      </section>

      {/* Classical Origin — Gold card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीय उत्पत्ति' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Indian astronomical achievements are staggering — and shockingly under-known in the West:', hi: 'भारतीय खगोलशास्त्र की उपलब्धियाँ विस्मयकारी हैं — और पश्चिम में बहुत कम ज्ञात हैं:', sa: 'भारतीय खगोलशास्त्र की उपलब्धियाँ विस्मयकारी हैं — और पश्चिम में बहुत कम ज्ञात हैं:' }, locale)}
        </p>
        <ul className="text-text-secondary text-sm space-y-3 ml-2">
          <li>
            <span className="text-gold-light font-bold">{tl({ en: 'Aryabhata (476 CE)', hi: 'आर्यभट (476 ई.)', sa: 'आर्यभट (476 ई.)' }, locale)}</span>{' '}
            {tl({ en: `— calculated Earth\'s circumference as 39,968 km (actual: 40,075 km — 99.8% accuracy). A THOUSAND years before Columbus! He stated Earth ROTATES on its axis — while Europe believed it was fixed.`, hi: `— पृथ्वी की परिधि 39,968 किमी गणित की (वास्तविक: 40,075 किमी — 99.8% सटीक)। कोलम्बस से हज़ार वर्ष पहले! उन्होंने कहा कि पृथ्वी अपनी धुरी पर घूमती है — जबकि यूरोप मानता था कि पृथ्वी स्थिर है।`, sa: `— पृथ्वी की परिधि 39,968 किमी गणित की (वास्तविक: 40,075 किमी — 99.8% सटीक)। कोलम्बस से हज़ार वर्ष पहले! उन्होंने कहा कि पृथ्वी अपनी धुरी पर घूमती है — जबकि यूरोप मानता था कि पृथ्वी स्थिर है।` }, locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{tl({ en: `Trigonometry's "sine"`, hi: `त्रिकोणमिति का "sine"`, sa: `त्रिकोणमिति का "sine"` }, locale)}</span>{' '}
            {tl({ en: `— the word "sine" comes from Sanskrit "jya" (bowstring) → Arabic "jiba" → Latin "sinus." Indian mathematicians invented trigonometry FOR astronomical calculations.`, hi: `— अंग्रेजी शब्द "sine" संस्कृत "ज्या" (धनुष की डोरी) से आया → अरबी "जिबा" → लैटिन "sinus"। भारतीय गणितज्ञों ने खगोलीय गणना के लिए त्रिकोणमिति का आविष्कार किया।`, sa: `— अंग्रेजी शब्द "sine" संस्कृत "ज्या" (धनुष की डोरी) से आया → अरबी "जिबा" → लैटिन "sinus"। भारतीय गणितज्ञों ने खगोलीय गणना के लिए त्रिकोणमिति का आविष्कार किया।` }, locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{tl({ en: 'Varahamihira (505 CE)', hi: 'वराहमिहिर (505 ई.)', sa: 'वराहमिहिर (505 ई.)' }, locale)}</span>{' '}
            {tl({ en: '— wrote Pancha Siddhantika comparing 5 different astronomical systems — peer review 1,500 years ago!', hi: '— पंचसिद्धान्तिका में 5 भिन्न खगोलीय प्रणालियों की तुलना की — 1500 वर्ष पहले सहकर्मी समीक्षा (peer review)!', sa: '— पंचसिद्धान्तिका में 5 भिन्न खगोलीय प्रणालियों की तुलना की — 1500 वर्ष पहले सहकर्मी समीक्षा (peer review)!' }, locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{tl({ en: 'Brahmagupta (628 CE)', hi: 'ब्रह्मगुप्त (628 ई.)', sa: 'ब्रह्मगुप्त (628 ई.)' }, locale)}</span>{' '}
            {tl({ en: '— gave the first rules for zero and negative numbers — in an ASTRONOMY text (Brahmasphutasiddhanta)!', hi: '— शून्य और ऋणात्मक संख्याओं के पहले नियम दिए — एक खगोलशास्त्र ग्रन्थ (ब्राह्मस्फुटसिद्धान्त) में!', sa: '— शून्य और ऋणात्मक संख्याओं के पहले नियम दिए — एक खगोलशास्त्र ग्रन्थ (ब्राह्मस्फुटसिद्धान्त) में!' }, locale)}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-4">
          {tl({ en: `Aryabhata didn't just calculate Earth's circumference — he stated that Earth ROTATES on its axis. In 499 CE. Copernicus wouldn't propose this in Europe until 1543 — over a THOUSAND years later. And the word "algorithm"? It traces back to al-Khwarizmi, who learned from Indian mathematics.`, hi: `आर्यभट ने केवल पृथ्वी की परिधि नहीं गणित की — उन्होंने कहा कि पृथ्वी अपनी धुरी पर घूमती है। 499 ई. में। कोपर्निकस ने यूरोप में यह प्रस्ताव 1543 तक नहीं रखा — एक हज़ार वर्ष बाद। और "कलनविधि" (algorithm) शब्द? यह अल-ख़्वारिज़्मी से आया — जिन्होंने भारतीय गणित से सीखा।`, sa: `आर्यभट ने केवल पृथ्वी की परिधि नहीं गणित की — उन्होंने कहा कि पृथ्वी अपनी धुरी पर घूमती है। 499 ई. में। कोपर्निकस ने यूरोप में यह प्रस्ताव 1543 तक नहीं रखा — एक हज़ार वर्ष बाद। और "कलनविधि" (algorithm) शब्द? यह अल-ख़्वारिज़्मी से आया — जिन्होंने भारतीय गणित से सीखा।` }, locale)}
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
          {tl({ en: 'Jyotish vs Western Astrology', hi: 'ज्योतिष बनाम पश्चिमी ज्योतिष', sa: 'ज्योतिष बनाम पश्चिमी ज्योतिष' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: `When someone in the West says "I'm a Gemini" and an Indian says "My rashi is Vrishabha (Taurus)" — both can be correct. They're using two completely different systems. Here's why.`, hi: `जब कोई पश्चिमी देश में कहता है "मेरी राशि मिथुन है" और एक भारतीय कहता है "मेरी राशि वृषभ है" — दोनों सही हो सकते हैं। वे दो पूरी तरह से भिन्न प्रणालियों का उपयोग कर रहे हैं। समझिए कैसे।`, sa: `जब कोई पश्चिमी देश में कहता है "मेरी राशि मिथुन है" और एक भारतीय कहता है "मेरी राशि वृषभ है" — दोनों सही हो सकते हैं। वे दो पूरी तरह से भिन्न प्रणालियों का उपयोग कर रहे हैं। समझिए कैसे।` }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: `Western astrology uses the "Tropical" zodiac, anchored to the seasons (equinoxes). Vedic astrology uses the "Sidereal" (Nirayana) zodiac, anchored to the actual fixed stars. Due to Earth's axial precession, these two systems are drifting apart at ~50 arcseconds per year. Today the gap is about 24° — meaning your Vedic sign is usually one sign behind your Western sign.`, hi: `पश्चिमी ज्योतिष "ट्रॉपिकल" राशिचक्र का उपयोग करता है जो ऋतुओं (विषुव) से जुड़ा है। वैदिक ज्योतिष "साइडरियल" (निरयन) राशिचक्र का उपयोग करता है जो वास्तविक तारों से जुड़ा है। पृथ्वी की अक्षीय पुरस्सरण (precession) के कारण ये दोनों प्रणालियाँ प्रतिवर्ष ~50 आर्कसेकण्ड खिसकती जा रही हैं। आज यह अन्तर लगभग 24° है — जिसका अर्थ है कि आपकी वैदिक राशि प्रायः आपकी पश्चिमी राशि से एक राशि पीछे होगी।`, sa: `पश्चिमी ज्योतिष "ट्रॉपिकल" राशिचक्र का उपयोग करता है जो ऋतुओं (विषुव) से जुड़ा है। वैदिक ज्योतिष "साइडरियल" (निरयन) राशिचक्र का उपयोग करता है जो वास्तविक तारों से जुड़ा है। पृथ्वी की अक्षीय पुरस्सरण (precession) के कारण ये दोनों प्रणालियाँ प्रतिवर्ष ~50 आर्कसेकण्ड खिसकती जा रही हैं। आज यह अन्तर लगभग 24° है — जिसका अर्थ है कि आपकी वैदिक राशि प्रायः आपकी पश्चिमी राशि से एक राशि पीछे होगी।` }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'But the differences go far beyond the zodiac. Vedic Jyotish has powerful tools with no Western equivalent — the 27 Nakshatra system, the Dasha timing system (which predicts WHEN events unfold, not just what might happen), and Muhurta selection (an elaborate method for finding auspicious times). The table below highlights the key differences:', hi: 'लेकिन अन्तर केवल राशिचक्र का नहीं है। वैदिक ज्योतिष के पास ऐसे शक्तिशाली उपकरण हैं जिनका पश्चिमी ज्योतिष में कोई समकक्ष नहीं — 27 नक्षत्र प्रणाली, दशा समय पद्धति (जो बताती है कब क्या होगा, न कि केवल क्या हो सकता है), और मुहूर्त चयन (शुभ समय ज्ञात करने की विस्तृत विधि)। नीचे दी गई तालिका में प्रमुख अन्तर देखें:', sa: 'लेकिन अन्तर केवल राशिचक्र का नहीं है। वैदिक ज्योतिष के पास ऐसे शक्तिशाली उपकरण हैं जिनका पश्चिमी ज्योतिष में कोई समकक्ष नहीं — 27 नक्षत्र प्रणाली, दशा समय पद्धति (जो बताती है कब क्या होगा, न कि केवल क्या हो सकता है), और मुहूर्त चयन (शुभ समय ज्ञात करने की विस्तृत विधि)। नीचे दी गई तालिका में प्रमुख अन्तर देखें:' }, locale)}
        </p>

        {/* Comparison table */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary text-xs py-2 pr-3">{tl({ en: 'Aspect', hi: 'पहलू', sa: 'दृष्टिः' }, locale)}</th>
                <th className="text-left text-gold-light text-xs py-2 pr-3">{tl({ en: 'Vedic (Jyotish)', hi: 'वैदिक (ज्योतिष)', sa: 'वैदिक (ज्योतिष)' }, locale)}</th>
                <th className="text-left text-blue-300 text-xs py-2">{tl({ en: 'Western', hi: 'पश्चिमी', sa: 'पश्चिमी' }, locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary text-xs">
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{tl({ en: 'Zodiac', hi: 'राशिचक्र', sa: 'राशिचक्र' }, locale)}</td>
                <td className="py-2 pr-3">{tl({ en: 'Sidereal (star-fixed)', hi: 'साइडरियल (तारा-स्थिर)', sa: 'साइडरियल (तारा-स्थिर)' }, locale)}</td>
                <td className="py-2">{tl({ en: 'Tropical (season-fixed)', hi: 'ट्रॉपिकल (ऋतु-स्थिर)', sa: 'ट्रॉपिकल (ऋतु-स्थिर)' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{tl({ en: 'Primary luminary', hi: 'प्रमुख ज्योति', sa: 'प्रमुख ज्योति' }, locale)}</td>
                <td className="py-2 pr-3">{tl({ en: 'Moon (mind)', hi: 'चन्द्रमा (मन)', sa: 'चन्द्रमा (मन)' }, locale)}</td>
                <td className="py-2">{tl({ en: 'Sun (ego)', hi: 'सूर्य (अहंकार)', sa: 'सूर्य (अहंकार)' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{tl({ en: 'Divergence', hi: 'विचलन', sa: 'विचलन' }, locale)}</td>
                <td className="py-2 pr-3" colSpan={2}>{tl({ en: 'About 24 degrees today — your Vedic sign is usually ONE sign behind your Western sign', hi: 'आज ~24° — आपकी वैदिक राशि प्रायः एक राशि पीछे होती है', sa: 'आज ~24° — आपकी वैदिक राशि प्रायः एक राशि पीछे होती है' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{tl({ en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्र' }, locale)}</td>
                <td className="py-2 pr-3">{tl({ en: '27 lunar mansions', hi: '27 चन्द्र नक्षत्र', sa: '27 चन्द्र नक्षत्र' }, locale)}</td>
                <td className="py-2">{tl({ en: 'No equivalent', hi: 'कोई समकक्ष नहीं', sa: 'कोई समकक्ष नहीं' }, locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{tl({ en: 'Timing system', hi: 'समय प्रणाली', sa: 'समय प्रणाली' }, locale)}</td>
                <td className="py-2 pr-3">{tl({ en: 'Dasha (WHEN events happen)', hi: 'दशा (कब घटनाएँ होंगी)', sa: 'दशा (कब घटनाएँ होंगी)' }, locale)}</td>
                <td className="py-2">{tl({ en: 'Transits only', hi: 'केवल गोचर', sa: 'केवल गोचर' }, locale)}</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 text-text-tertiary">{tl({ en: 'Muhurta', hi: 'मुहूर्त', sa: 'मुहूर्त' }, locale)}</td>
                <td className="py-2 pr-3">{tl({ en: 'Auspicious time selection (elaborate)', hi: 'शुभ समय चयन (विस्तृत)', sa: 'शुभ समय चयन (विस्तृत)' }, locale)}</td>
                <td className="py-2">{tl({ en: 'No equivalent', hi: 'कोई समकक्ष नहीं', sa: 'कोई समकक्ष नहीं' }, locale)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {tl({ en: `Here's the practical difference: ask a Western astrologer "When will I get married?" and they'll say "when Venus transits your 7th house." Ask a Vedic astrologer the same question and they'll say "During your Venus Mahadasha, specifically in the Jupiter Antardasha, triggered when Jupiter transits your 7th from Moon — likely between March and August 2028." The Dasha system adds a TIMELINE that Western astrology simply cannot. Think of it as Spotify Wrapped — but for your entire life.`, hi: `व्यावहारिक अन्तर इस प्रकार है: एक पश्चिमी ज्योतिषी से पूछिए "मेरा विवाह कब होगा?" — वे कहेंगे "जब शुक्र आपके सप्तम भाव में गोचर करेगा।" एक वैदिक ज्योतिषी से वही प्रश्न पूछिए — वे कहेंगे "आपकी शुक्र महादशा में, विशेष रूप से गुरु अन्तर्दशा में, जब गुरु चन्द्रमा से सप्तम भाव में गोचर करेगा — सम्भवतः मार्च और अगस्त 2028 के बीच।" दशा प्रणाली एक समय-रेखा जोड़ती है जो पश्चिमी ज्योतिष के पास बस नहीं है। इसे ऐसे सोचिए: Spotify Wrapped — लेकिन आपके पूरे जीवन के लिए।`, sa: `व्यावहारिक अन्तर इस प्रकार है: एक पश्चिमी ज्योतिषी से पूछिए "मेरा विवाह कब होगा?" — वे कहेंगे "जब शुक्र आपके सप्तम भाव में गोचर करेगा।" एक वैदिक ज्योतिषी से वही प्रश्न पूछिए — वे कहेंगे "आपकी शुक्र महादशा में, विशेष रूप से गुरु अन्तर्दशा में, जब गुरु चन्द्रमा से सप्तम भाव में गोचर करेगा — सम्भवतः मार्च और अगस्त 2028 के बीच।" दशा प्रणाली एक समय-रेखा जोड़ती है जो पश्चिमी ज्योतिष के पास बस नहीं है। इसे ऐसे सोचिए: Spotify Wrapped — लेकिन आपके पूरे जीवन के लिए।` }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'The Kerala School of Mathematics (14th-16th century CE) developed infinite series for pi and trigonometric functions — 300 years before Newton and Leibniz — specifically to improve astronomical calculations for Jyotish. Calculus was literally invented for better horoscopes.', hi: 'केरल गणित सम्प्रदाय (14वीं-16वीं शताब्दी ई.) ने π और त्रिकोणमितीय फलनों के लिए अनन्त श्रेणियाँ विकसित कीं — न्यूटन और लाइब्निट्ज़ से 300 वर्ष पहले — विशेष रूप से ज्योतिष के लिए खगोलीय गणनाओं को सुधारने के लिए। कलनगणित (calculus) का आविष्कार बेहतर कुण्डलियों के लिए हुआ था।', sa: 'केरल गणित सम्प्रदाय (14वीं-16वीं शताब्दी ई.) ने π और त्रिकोणमितीय फलनों के लिए अनन्त श्रेणियाँ विकसित कीं — न्यूटन और लाइब्निट्ज़ से 300 वर्ष पहले — विशेष रूप से ज्योतिष के लिए खगोलीय गणनाओं को सुधारने के लिए। कलनगणित (calculus) का आविष्कार बेहतर कुण्डलियों के लिए हुआ था।' }, locale)}
        </p>
      </section>

      {/* Emerald fact card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Astonishing Facts', hi: 'चौंकाने वाले तथ्य', sa: 'चौंकाने वाले तथ्य' }, locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>
            <span className="text-emerald-300 font-bold">{tl({ en: 'Surya Siddhanta (c. 400 CE)', hi: 'सूर्य सिद्धान्त (लगभग 400 ई.)', sa: 'सूर्य सिद्धान्त (लगभग 400 ई.)' }, locale)}</span>{' '}
            {tl({ en: '— calculated the sidereal year as 365.2587565 days. The actual value is 365.25636 days. Error: only 1.4 SECONDS per year!', hi: '— नाक्षत्र वर्ष 365.2587565 दिन गणित किया। वास्तविक मान 365.25636 दिन है। प्रति वर्ष त्रुटि केवल 1.4 सेकण्ड!', sa: '— नाक्षत्र वर्ष 365.2587565 दिन गणित किया। वास्तविक मान 365.25636 दिन है। प्रति वर्ष त्रुटि केवल 1.4 सेकण्ड!' }, locale)}
          </p>
          <p>
            <span className="text-emerald-300 font-bold">{tl({ en: 'Jantar Mantar Observatories', hi: 'जन्तर मन्तर वेधशालाएँ', sa: 'जन्तर मन्तर वेधशालाएँ' }, locale)}</span>{' '}
            {tl({ en: '— Maharaja Jai Singh II built public observatories in 5 cities by 1734. Stone instruments accurate to 2 arcseconds!', hi: '— महाराजा जयसिंह द्वितीय ने 1734 तक 5 शहरों में सार्वजनिक वेधशालाएँ बनवाईं। पत्थर के उपकरण, 2 आर्कसेकण्ड तक सटीक!', sa: '— महाराजा जयसिंह द्वितीय ने 1734 तक 5 शहरों में सार्वजनिक वेधशालाएँ बनवाईं। पत्थर के उपकरण, 2 आर्कसेकण्ड तक सटीक!' }, locale)}
          </p>
        </div>
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
          {tl({ en: 'What This Course Will Teach You', hi: 'यह पाठ्यक्रम आपको क्या सिखाएगा', sa: 'यह पाठ्यक्रम आपको क्या सिखाएगा' }, locale)}
        </h3>
        <ul className="text-text-secondary text-sm space-y-2 ml-4">
          <li>
            <span className="text-gold-light font-medium">{tl({ en: 'Reading a daily Panchang', hi: 'दैनिक पंचांग पढ़ना', sa: 'दैनिक पंचांग पढ़ना' }, locale)}</span>{' '}
            — {tl({ en: 'your cosmic weather report for each day', hi: 'आपकी दैनिक ब्रह्माण्डीय मौसम रिपोर्ट', sa: 'आपकी दैनिक ब्रह्माण्डीय मौसम रिपोर्ट' }, locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{tl({ en: 'Understanding a birth chart', hi: 'जन्मकुण्डली समझना', sa: 'जन्मकुण्डली समझना' }, locale)}</span>{' '}
            — {tl({ en: 'your cosmic DNA', hi: 'आपका ब्रह्माण्डीय DNA', sa: 'आपका ब्रह्माण्डीय DNA' }, locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{tl({ en: 'The mathematics behind the calculations', hi: 'गणना के पीछे का गणित', sa: 'गणना के पीछे का गणित' }, locale)}</span>{' '}
            — {tl({ en: 'real algorithms, not mysticism', hi: 'वास्तविक कलनविधि, रहस्यवाद नहीं', sa: 'वास्तविक कलनविधि, रहस्यवाद नहीं' }, locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{tl({ en: 'Cultural context', hi: 'सांस्कृतिक सन्दर्भ', sa: 'सांस्कृतिक सन्दर्भ' }, locale)}</span>{' '}
            — {tl({ en: 'for Hindu rituals and festivals', hi: 'हिन्दू अनुष्ठानों और त्योहारों के लिए', sa: 'हिन्दू अनुष्ठानों और त्योहारों के लिए' }, locale)}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          <span className="text-red-300 font-bold">{tl({ en: 'What this course will NOT claim:', hi: 'यह पाठ्यक्रम दावा नहीं करेगा:', sa: 'यह पाठ्यक्रम दावा नहीं करेगा:' }, locale)}</span>{' '}
          {tl({ en: 'deterministic fate prediction, replacement for professional advice, or supernatural powers.', hi: 'नियतिवादी भाग्य भविष्यवाणी, पेशेवर सलाह का विकल्प, या अलौकिक शक्तियाँ।', sa: 'नियतिवादी भाग्य भविष्यवाणी, पेशेवर सलाह का विकल्प, या अलौकिक शक्तियाँ।' }, locale)}
        </p>
      </section>

      {/* Red — Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p>
            <span className="text-red-300 font-bold">{tl({ en: 'Misconception:', hi: 'भ्रान्ति:', sa: 'भ्रान्ति:' }, locale)}</span>{' '}
            {tl({ en: '"Jyotish is just superstition"', hi: '"ज्योतिष केवल अन्धविश्वास है"', sa: '"ज्योतिष केवल अन्धविश्वास है"' }, locale)}
            <br />
            <span className="text-emerald-300">{tl({ en: 'Reality:', hi: 'वास्तविकता:', sa: 'वास्तविकता:' }, locale)}</span>{' '}
            {tl({ en: 'The astronomical calculations ARE science — verified against NASA JPL. The interpretive tradition is cultural wisdom, like any system of meaning-making. Our app separates the two: the math is exact, the interpretation is traditional.', hi: 'खगोलीय गणनाएँ विज्ञान हैं — NASA JPL से सत्यापित। व्याख्या परम्परा सांस्कृतिक ज्ञान है, जैसे कोई भी अर्थ-निर्माण प्रणाली। हमारा ऐप दोनों को अलग करता है: गणित सटीक है, व्याख्या पारम्परिक है।', sa: 'खगोलीय गणनाएँ विज्ञान हैं — NASA JPL से सत्यापित। व्याख्या परम्परा सांस्कृतिक ज्ञान है, जैसे कोई भी अर्थ-निर्माण प्रणाली। हमारा ऐप दोनों को अलग करता है: गणित सटीक है, व्याख्या पारम्परिक है।' }, locale)}
          </p>
          <p>
            <span className="text-red-300 font-bold">{tl({ en: 'Misconception:', hi: 'भ्रान्ति:', sa: 'भ्रान्ति:' }, locale)}</span>{' '}
            {tl({ en: '"Jyotish was copied from Greek astrology"', hi: '"ज्योतिष यूनानी ज्योतिष से कॉपी किया गया"', sa: '"ज्योतिष यूनानी ज्योतिष से कॉपी किया गया"' }, locale)}
            <br />
            <span className="text-emerald-300">{tl({ en: 'Reality:', hi: 'वास्तविकता:', sa: 'वास्तविकता:' }, locale)}</span>{' '}
            {tl({ en: 'The Rigveda (c. 1500 BCE) mentions nakshatras — a millennium before the Greek zodiac existed. Some cross-pollination occurred after Alexander (326 BCE), but the Indian system developed independently.', hi: 'ऋग्वेद (लगभग 1500 ई.पू.) में नक्षत्रों का उल्लेख है — यूनानी राशिचक्र से एक सहस्राब्दी पूर्व। सिकन्दर (326 ई.पू.) के बाद कुछ पारस्परिक प्रभाव हुआ, लेकिन भारतीय प्रणाली स्वतन्त्र रूप से विकसित हुई।', sa: 'ऋग्वेद (लगभग 1500 ई.पू.) में नक्षत्रों का उल्लेख है — यूनानी राशिचक्र से एक सहस्राब्दी पूर्व। सिकन्दर (326 ई.पू.) के बाद कुछ पारस्परिक प्रभाव हुआ, लेकिन भारतीय प्रणाली स्वतन्त्र रूप से विकसित हुई।' }, locale)}
          </p>
          <p>
            <span className="text-red-300 font-bold">{tl({ en: 'Misconception:', hi: 'भ्रान्ति:', sa: 'भ्रान्ति:' }, locale)}</span>{' '}
            {tl({ en: '"Jyotish and Western astrology are the same thing"', hi: '"ज्योतिष और पश्चिमी ज्योतिष एक ही बात है"', sa: '"ज्योतिष और पश्चिमी ज्योतिष एक ही बात है"' }, locale)}
            <br />
            <span className="text-emerald-300">{tl({ en: 'Reality:', hi: 'वास्तविकता:', sa: 'वास्तविकता:' }, locale)}</span>{' '}
            {tl({ en: `They use different zodiacs, different primary luminaries (Moon vs Sun), and entirely different tools (nakshatras, dashas, muhurtas). The answer to "what's your sign?" DIFFERS between the two systems.`, hi: `वे भिन्न राशिचक्र, भिन्न प्राथमिक ज्योति (चन्द्रमा बनाम सूर्य), और पूर्णतया भिन्न उपकरण (नक्षत्र, दशा, मुहूर्त) का उपयोग करते हैं। "आपकी राशि क्या है?" का उत्तर दोनों प्रणालियों में भिन्न होता है।`, sa: `वे भिन्न राशिचक्र, भिन्न प्राथमिक ज्योति (चन्द्रमा बनाम सूर्य), और पूर्णतया भिन्न उपकरण (नक्षत्र, दशा, मुहूर्त) का उपयोग करते हैं। "आपकी राशि क्या है?" का उत्तर दोनों प्रणालियों में भिन्न होता है।` }, locale)}
          </p>
          <p className="mt-3">
            <span className="text-red-300 font-bold">{tl({ en: 'Misconception:', hi: 'भ्रान्ति:', sa: 'भ्रान्ति:' }, locale)}</span>{' '}
            {tl({ en: '"The calculations are unscientific"', hi: '"गणनाएँ अवैज्ञानिक हैं"', sa: '"गणनाएँ अवैज्ञानिक हैं"' }, locale)}
            <br />
            <span className="text-emerald-300">{tl({ en: 'Reality:', hi: 'वास्तविकता:', sa: 'वास्तविकता:' }, locale)}</span>{' '}
            {tl({ en: `Here's a test: our app computes sunrise for Delhi to the exact MINUTE, matching Drik Panchang. It calculates the Moon's position using 60 sine terms from a 6th-century algorithm. The mathematics is verifiable, reproducible, and matches NASA's JPL ephemeris. Whether you believe in the interpretive tradition is a separate question — but calling the calculations "unscientific" is simply incorrect.`, hi: `एक परीक्षण: हमारा ऐप दिल्ली के लिए सूर्योदय सटीक मिनट तक गणित करता है, ड्रिक पंचांग से मिलान करता है। यह चन्द्रमा की स्थिति 6ठी शताब्दी की कलनविधि से 60 sine पदों का उपयोग करके गणित करता है। गणित सत्यापन योग्य, पुनरुत्पादनीय है, और NASA के JPL पंचांग से मिलान करता है। आप व्याख्यात्मक परम्परा में विश्वास करें या न करें — यह अलग प्रश्न है — लेकिन गणनाओं को "अवैज्ञानिक" कहना तथ्यात्मक रूप से गलत है।`, sa: `एक परीक्षण: हमारा ऐप दिल्ली के लिए सूर्योदय सटीक मिनट तक गणित करता है, ड्रिक पंचांग से मिलान करता है। यह चन्द्रमा की स्थिति 6ठी शताब्दी की कलनविधि से 60 sine पदों का उपयोग करके गणित करता है। गणित सत्यापन योग्य, पुनरुत्पादनीय है, और NASA के JPL पंचांग से मिलान करता है। आप व्याख्यात्मक परम्परा में विश्वास करें या न करें — यह अलग प्रश्न है — लेकिन गणनाओं को "अवैज्ञानिक" कहना तथ्यात्मक रूप से गलत है।` }, locale)}
          </p>
        </div>
      </section>

      {/* Blue — Modern Relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {tl({ en: 'The mathematics of Jyotish is still completely valid today. The same algorithms described in the Surya Siddhanta, modernized — that is what our app runs. We use Meeus algorithms: Sun accurate to ~0.01 degrees, Moon to ~0.5 degrees. No external APIs — pure math.', hi: 'ज्योतिष का गणित आज भी पूर्णतः मान्य है। वही कलनविधि जो सूर्य सिद्धान्त में वर्णित हैं, आधुनिक रूप में — हमारा ऐप उन्हें चलाता है। हम Meeus कलनविधि का उपयोग करते हैं: सूर्य ~0.01°, चन्द्रमा ~0.5° सटीकता। कोई बाहरी API नहीं — शुद्ध गणित।', sa: 'ज्योतिष का गणित आज भी पूर्णतः मान्य है। वही कलनविधि जो सूर्य सिद्धान्त में वर्णित हैं, आधुनिक रूप में — हमारा ऐप उन्हें चलाता है। हम Meeus कलनविधि का उपयोग करते हैं: सूर्य ~0.01°, चन्द्रमा ~0.5° सटीकता। कोई बाहरी API नहीं — शुद्ध गणित।' }, locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Billions of Hindus worldwide use the daily Panchang to time festivals, weddings, housewarmings, and rituals. Learning this is a practical, cultural literacy skill — not a mystical pursuit.', hi: 'दुनिया भर में अरबों हिन्दू दैनिक पंचांग से त्योहारों, विवाह, गृहप्रवेश और अनुष्ठानों का समय निर्धारित करते हैं। यह सिखाना ज्योतिष का एक व्यावहारिक, सांस्कृतिक साक्षरता कौशल है।', sa: 'दुनिया भर में अरबों हिन्दू दैनिक पंचांग से त्योहारों, विवाह, गृहप्रवेश और अनुष्ठानों का समय निर्धारित करते हैं। यह सिखाना ज्योतिष का एक व्यावहारिक, सांस्कृतिक साक्षरता कौशल है।' }, locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {tl({ en: `The 2017 Nobel Prize in Physiology/Medicine was awarded for research on circadian rhythms — the body\'s internal clock that responds to light-dark cycles. This is essentially what the Muhurta system has been tracking for 3,000 years: optimal times for different activities based on celestial cycles. Science is catching up to what Varahamihira documented in the 6th century.`, hi: `2017 का चिकित्सा में नोबेल पुरस्कार शरीर की आन्तरिक घड़ी — सर्केडियन लय — पर शोध के लिए दिया गया, जो प्रकाश-अन्धकार चक्रों पर प्रतिक्रिया करती है। यह मूलतः वही है जो मुहूर्त प्रणाली 3,000 वर्षों से ट्रैक कर रही है: आकाशीय चक्रों के आधार पर विभिन्न गतिविधियों के लिए इष्टतम समय। विज्ञान उसे समझ रहा है जो वराहमिहिर ने 6वीं शताब्दी में प्रलेखित किया था।`, sa: `2017 का चिकित्सा में नोबेल पुरस्कार शरीर की आन्तरिक घड़ी — सर्केडियन लय — पर शोध के लिए दिया गया, जो प्रकाश-अन्धकार चक्रों पर प्रतिक्रिया करती है। यह मूलतः वही है जो मुहूर्त प्रणाली 3,000 वर्षों से ट्रैक कर रही है: आकाशीय चक्रों के आधार पर विभिन्न गतिविधियों के लिए इष्टतम समय। विज्ञान उसे समझ रहा है जो वराहमिहिर ने 6वीं शताब्दी में प्रलेखित किया था।` }, locale)}
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module0_1Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
