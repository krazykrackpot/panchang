'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/20-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_20_1', phase: 7, topic: 'KP System', moduleNumber: '20.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 13,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'KP replaces equal-house divisions with Placidus cusps — house sizes become unequal and latitude-dependent for more accurate results.',
          'The exact cusp degree determines which planet\'s sub-lord rules the house — this precision is the foundation of KP predictions.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Equal vs Unequal House Systems', hi: 'समान बनाम असमान भाव पद्धतियाँ', sa: 'समान बनाम असमान भाव पद्धतियाँ' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'In traditional Vedic astrology (Parashari system), the chart is divided into 12 houses of exactly 30 degrees each, starting from the Ascendant degree. This is called the equal-house system. If your lagna (Ascendant) is at 10 degrees Aries, the 1st house spans 10 degrees Aries to 10 degrees Taurus, the 2nd house from 10 degrees Taurus to 10 degrees Gemini, and so on. Each house is exactly 30 degrees wide, mirroring the 30-degree width of each rashi (sign). This system is simple, elegant, and has been the standard in Indian astrology for millennia.', hi: 'पारम्परिक वैदिक ज्योतिष (पाराशरी पद्धति) में कुण्डली को लग्न अंश से आरम्भ करते हुए ठीक 30 अंश के 12 भावों में विभक्त किया जाता है। इसे समान-भाव पद्धति कहते हैं। यदि आपका लग्न 10 अंश मेष पर है, तो प्रथम भाव 10 अंश मेष से 10 अंश वृषभ तक, द्वितीय भाव 10 अंश वृषभ से 10 अंश मिथुन तक, इत्यादि। प्रत्येक भाव ठीक 30 अंश चौड़ा है, जो प्रत्येक राशि की 30 अंश चौड़ाई को प्रतिबिम्बित करता है। यह पद्धति सरल, सुन्दर है और सहस्राब्दियों से भारतीय ज्योतिष का मानक रही है।', sa: 'पारम्परिक वैदिक ज्योतिष (पाराशरी पद्धति) में कुण्डली को लग्न अंश से आरम्भ करते हुए ठीक 30 अंश के 12 भावों में विभक्त किया जाता है। इसे समान-भाव पद्धति कहते हैं। यदि आपका लग्न 10 अंश मेष पर है, तो प्रथम भाव 10 अंश मेष से 10 अंश वृषभ तक, द्वितीय भाव 10 अंश वृषभ से 10 अंश मिथुन तक, इत्यादि। प्रत्येक भाव ठीक 30 अंश चौड़ा है, जो प्रत्येक राशि की 30 अंश चौड़ाई को प्रतिबिम्बित करता है। यह पद्धति सरल, सुन्दर है और सहस्राब्दियों से भारतीय ज्योतिष का मानक रही है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: `The KP (Krishnamurti Paddhati) system, developed by K.S. Krishnamurti in the 1960s, made a radical departure: it adopted the Placidus house system from Western astrology. In Placidus, house sizes are UNEQUAL — they vary based on the observer\'s geographic latitude. A house might be as narrow as 20 degrees or as wide as 40 degrees. The reason for this choice was precision: at higher latitudes (like Europe at 47 degrees N, or even parts of North India at 28-30 degrees N), equal houses can place a planet in the wrong house, leading to incorrect predictions.`, hi: `के.एस. कृष्णमूर्ति द्वारा 1960 के दशक में विकसित केपी (कृष्णमूर्ति पद्धति) ने एक क्रान्तिकारी परिवर्तन किया: इसने पाश्चात्य ज्योतिष से प्लेसिडस भाव पद्धति अपनाई। प्लेसिडस में भावों का आकार असमान होता है — ये प्रेक्षक के भौगोलिक अक्षांश के अनुसार भिन्न होते हैं। एक भाव 20 अंश जितना संकीर्ण या 40 अंश जितना चौड़ा हो सकता है। इस चयन का कारण सटीकता था: उच्च अक्षांशों पर (जैसे यूरोप 47 अंश उत्तर, या उत्तर भारत 28-30 अंश उत्तर पर भी), समान भाव एक ग्रह को गलत भाव में रख सकते हैं, जिससे गलत फलादेश होते हैं।`, sa: `के.एस. कृष्णमूर्ति द्वारा 1960 के दशक में विकसित केपी (कृष्णमूर्ति पद्धति) ने एक क्रान्तिकारी परिवर्तन किया: इसने पाश्चात्य ज्योतिष से प्लेसिडस भाव पद्धति अपनाई। प्लेसिडस में भावों का आकार असमान होता है — ये प्रेक्षक के भौगोलिक अक्षांश के अनुसार भिन्न होते हैं। एक भाव 20 अंश जितना संकीर्ण या 40 अंश जितना चौड़ा हो सकता है। इस चयन का कारण सटीकता था: उच्च अक्षांशों पर (जैसे यूरोप 47 अंश उत्तर, या उत्तर भारत 28-30 अंश उत्तर पर भी), समान भाव एक ग्रह को गलत भाव में रख सकते हैं, जिससे गलत फलादेश होते हैं।` }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: `The Placidus house system was developed by the Italian monk and mathematician Placidus de Titis (1603-1668) in his work "Physiomathematica." However, the underlying concept of time-based house division traces back to Ptolemy\'s Tetrabiblos (2nd century CE). K.S. Krishnamurti, a professor from Tamil Nadu, recognized that this Western technique solved a real problem in Indian astrology — the inaccuracy of equal houses at non-equatorial latitudes — and brilliantly integrated it with the Vedic nakshatra sub-lord system to create KP.`, hi: `प्लेसिडस भाव पद्धति इतालवी भिक्षु और गणितज्ञ प्लेसिडस दे टिटिस (1603-1668) ने अपनी कृति "फिज़ियोमैथेमैटिका" में विकसित की। तथापि, समय-आधारित भाव विभाजन की मूल अवधारणा टॉलेमी के टेट्राबिब्लोस (द्वितीय शताब्दी ई.) तक जाती है। तमिलनाडु के प्राध्यापक के.एस. कृष्णमूर्ति ने पहचाना कि यह पाश्चात्य तकनीक भारतीय ज्योतिष की एक वास्तविक समस्या — गैर-भूमध्यरेखीय अक्षांशों पर समान भावों की अशुद्धि — का समाधान करती है, और इसे वैदिक नक्षत्र उप-स्वामी पद्धति के साथ प्रतिभापूर्वक एकीकृत कर केपी का निर्माण किया।`, sa: `प्लेसिडस भाव पद्धति इतालवी भिक्षु और गणितज्ञ प्लेसिडस दे टिटिस (1603-1668) ने अपनी कृति "फिज़ियोमैथेमैटिका" में विकसित की। तथापि, समय-आधारित भाव विभाजन की मूल अवधारणा टॉलेमी के टेट्राबिब्लोस (द्वितीय शताब्दी ई.) तक जाती है। तमिलनाडु के प्राध्यापक के.एस. कृष्णमूर्ति ने पहचाना कि यह पाश्चात्य तकनीक भारतीय ज्योतिष की एक वास्तविक समस्या — गैर-भूमध्यरेखीय अक्षांशों पर समान भावों की अशुद्धि — का समाधान करती है, और इसे वैदिक नक्षत्र उप-स्वामी पद्धति के साथ प्रतिभापूर्वक एकीकृत कर केपी का निर्माण किया।` }, locale)}
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
          {tl({ en: 'How Placidus Calculates Cusps', hi: 'प्लेसिडस भाव-सन्धि गणना', sa: 'प्लेसिडस भाव-सन्धि गणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'The Placidus method starts with four fixed anchor points: the Ascendant (1st house cusp), the Descendant (7th house cusp), the MC or Medium Coeli (10th house cusp, where the ecliptic crosses the meridian above the horizon), and the IC or Imum Coeli (4th house cusp, the meridian below the horizon). These four points are identical in almost all house systems. The magic of Placidus lies in how it calculates the intermediate cusps — the 2nd, 3rd, 5th, 6th, 8th, 9th, 11th, and 12th house boundaries.', hi: 'प्लेसिडस विधि चार स्थिर आधार बिन्दुओं से आरम्भ होती है: लग्न (प्रथम भाव सन्धि), अस्त (सप्तम भाव सन्धि), MC या मीडियम कोएली (दशम भाव सन्धि, जहाँ क्रान्तिवृत्त क्षितिज के ऊपर याम्योत्तर को पार करता है), और IC या इमम कोएली (चतुर्थ भाव सन्धि, क्षितिज के नीचे याम्योत्तर)। ये चार बिन्दु लगभग सभी भाव पद्धतियों में समान हैं। प्लेसिडस का वैशिष्ट्य मध्यवर्ती सन्धियों — 2, 3, 5, 6, 8, 9, 11, 12वें भाव की सीमाओं — की गणना में है।', sa: 'प्लेसिडस विधि चार स्थिर आधार बिन्दुओं से आरम्भ होती है: लग्न (प्रथम भाव सन्धि), अस्त (सप्तम भाव सन्धि), MC या मीडियम कोएली (दशम भाव सन्धि, जहाँ क्रान्तिवृत्त क्षितिज के ऊपर याम्योत्तर को पार करता है), और IC या इमम कोएली (चतुर्थ भाव सन्धि, क्षितिज के नीचे याम्योत्तर)। ये चार बिन्दु लगभग सभी भाव पद्धतियों में समान हैं। प्लेसिडस का वैशिष्ट्य मध्यवर्ती सन्धियों — 2, 3, 5, 6, 8, 9, 11, 12वें भाव की सीमाओं — की गणना में है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The technique: for any point on the ecliptic, calculate its diurnal arc (how long it stays above the horizon) and nocturnal arc (how long below). The diurnal semi-arc is half the diurnal arc. Trisecting the diurnal semi-arc gives the 11th and 12th house cusps; trisecting the nocturnal semi-arc gives the 2nd and 3rd house cusps. The same process below the horizon gives the 5th, 6th, 8th, and 9th cusps.', hi: 'तकनीक: क्रान्तिवृत्त के किसी भी बिन्दु के लिए, उसका दिवसीय चाप (क्षितिज के ऊपर कितनी देर रहता है) और रात्रिकालीन चाप (नीचे कितनी देर) गणित करें। दिवसीय अर्ध-चाप दिवसीय चाप का आधा है। दिवसीय अर्ध-चाप को त्रिभाजित करने से 11वीं और 12वीं भाव सन्धियाँ मिलती हैं; रात्रिकालीन अर्ध-चाप को त्रिभाजित करने से 2री और 3री भाव सन्धियाँ मिलती हैं। क्षितिज के नीचे यही प्रक्रिया 5, 6, 8 और 9वीं सन्धियाँ देती है।', sa: 'तकनीक: क्रान्तिवृत्त के किसी भी बिन्दु के लिए, उसका दिवसीय चाप (क्षितिज के ऊपर कितनी देर रहता है) और रात्रिकालीन चाप (नीचे कितनी देर) गणित करें। दिवसीय अर्ध-चाप दिवसीय चाप का आधा है। दिवसीय अर्ध-चाप को त्रिभाजित करने से 11वीं और 12वीं भाव सन्धियाँ मिलती हैं; रात्रिकालीन अर्ध-चाप को त्रिभाजित करने से 2री और 3री भाव सन्धियाँ मिलती हैं। क्षितिज के नीचे यही प्रक्रिया 5, 6, 8 और 9वीं सन्धियाँ देती है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">47 अंश उत्तर अक्षांश की कुण्डली (जैसे स्विट्ज़रलैण्ड):</span> लग्न = 5 अंश कर्क, MC = 15 अंश मीन। समान भावों में प्रत्येक भाव ठीक 30 अंश होता। किन्तु इस अक्षांश पर प्लेसिडस में भाव नाटकीय रूप से असमान हो जाते हैं: प्रथम भाव = 5 अंश कर्क से 28 अंश कर्क (केवल 23 अंश चौड़ा), द्वितीय भाव = 28 अंश कर्क से 25 अंश सिंह (27 अंश), तृतीय भाव = 25 अंश सिंह से 27 अंश कन्या (32 अंश)। वहीं दशम भाव 15 अंश मीन से 20 अंश मेष तक (35 अंश चौड़ा)। 23 से 35 अंश तक का अन्तर दिखाता है कि ग्रह स्थान भावों के बीच कैसे बदल सकता है।</>
            : <><span className="text-gold-light font-medium">Chart at 47 degrees N latitude (e.g., Switzerland):</span> Ascendant = 5 degrees Cancer, MC = 15 degrees Pisces. In equal houses, each house would span exactly 30 degrees. But in Placidus at this latitude, the houses become dramatically unequal: 1st house = 5 degrees Cancer to 28 degrees Cancer (only 23 degrees wide), 2nd house = 28 degrees Cancer to 25 degrees Leo (27 degrees), 3rd house = 25 degrees Leo to 27 degrees Virgo (32 degrees). Meanwhile, the 10th house spans from 15 degrees Pisces to 20 degrees Aries (35 degrees wide). The variation from 23 to 35 degrees shows why planet placement can shift between houses.</>}
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
          {tl({ en: 'Impact on Predictions', hi: 'फलादेश पर प्रभाव', sa: 'फलादेश पर प्रभाव' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'The house a planet occupies determines its significations and the life areas it influences. If a planet shifts from the 1st house (self, personality, health) to the 12th house (losses, isolation, foreign lands) simply because of the house system used, ALL predictions change. Consider Mars at 25 degrees Aries: in an equal-house chart with Ascendant at 5 degrees Aries, Mars is solidly in the 1st house — giving energy, assertiveness, and physical vitality. But in Placidus at 47 degrees N, if the 12th house cusp falls at 20 degrees Aries, then Mars at 25 degrees Aries is in the 12th house — signifying hidden enemies, expenditure, and foreign travel instead.', hi: 'ग्रह जिस भाव में बैठता है वह उसके कारकत्व और प्रभावित जीवन क्षेत्रों को निर्धारित करता है। यदि कोई ग्रह प्रथम भाव (स्व, व्यक्तित्व, स्वास्थ्य) से द्वादश भाव (हानि, एकान्त, विदेश) में केवल भाव पद्धति के कारण स्थानान्तरित हो जाए, तो सभी फलादेश बदल जाते हैं। मंगल को 25 अंश मेष पर लें: 5 अंश मेष लग्न वाली समान-भाव कुण्डली में मंगल दृढ़ रूप से प्रथम भाव में है — ऊर्जा, दृढ़ता और शारीरिक बल देते हुए। किन्तु 47 अंश उत्तर पर प्लेसिडस में, यदि 12वीं भाव सन्धि 20 अंश मेष पर आती है, तो 25 अंश मेष का मंगल 12वें भाव में है — छिपे शत्रु, व्यय और विदेश यात्रा का संकेत देते हुए।', sa: 'ग्रह जिस भाव में बैठता है वह उसके कारकत्व और प्रभावित जीवन क्षेत्रों को निर्धारित करता है। यदि कोई ग्रह प्रथम भाव (स्व, व्यक्तित्व, स्वास्थ्य) से द्वादश भाव (हानि, एकान्त, विदेश) में केवल भाव पद्धति के कारण स्थानान्तरित हो जाए, तो सभी फलादेश बदल जाते हैं। मंगल को 25 अंश मेष पर लें: 5 अंश मेष लग्न वाली समान-भाव कुण्डली में मंगल दृढ़ रूप से प्रथम भाव में है — ऊर्जा, दृढ़ता और शारीरिक बल देते हुए। किन्तु 47 अंश उत्तर पर प्लेसिडस में, यदि 12वीं भाव सन्धि 20 अंश मेष पर आती है, तो 25 अंश मेष का मंगल 12वें भाव में है — छिपे शत्रु, व्यय और विदेश यात्रा का संकेत देते हुए।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: `KP practitioners argue that Placidus matches real-world events more accurately because it respects the actual astronomical conditions at the birth location. The debate between equal and Placidus houses continues, but KP\'s track record of precise event timing — "when will I get a job?", "when will I marry?" — has earned it a devoted following, especially in South India and among astrologers who prioritize prediction over personality analysis.`, hi: `केपी अभ्यासकर्ताओं का तर्क है कि प्लेसिडस वास्तविक-विश्व घटनाओं से अधिक सटीक मेल खाता है क्योंकि यह जन्म स्थान की वास्तविक खगोलीय परिस्थितियों का सम्मान करता है। समान और प्लेसिडस भावों के बीच विवाद जारी है, किन्तु केपी का सटीक घटना-समय निर्धारण — "मुझे नौकरी कब मिलेगी?", "मेरा विवाह कब होगा?" — ने इसे एक समर्पित अनुयायी वर्ग दिया है, विशेषतः दक्षिण भारत में और उन ज्योतिषियों में जो व्यक्तित्व विश्लेषण से अधिक फलादेश को प्राथमिकता देते हैं।`, sa: `केपी अभ्यासकर्ताओं का तर्क है कि प्लेसिडस वास्तविक-विश्व घटनाओं से अधिक सटीक मेल खाता है क्योंकि यह जन्म स्थान की वास्तविक खगोलीय परिस्थितियों का सम्मान करता है। समान और प्लेसिडस भावों के बीच विवाद जारी है, किन्तु केपी का सटीक घटना-समय निर्धारण — "मुझे नौकरी कब मिलेगी?", "मेरा विवाह कब होगा?" — ने इसे एक समर्पित अनुयायी वर्ग दिया है, विशेषतः दक्षिण भारत में और उन ज्योतिषियों में जो व्यक्तित्व विश्लेषण से अधिक फलादेश को प्राथमिकता देते हैं।` }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;प्लेसिडस पाश्चात्य पद्धति है, अतः वैदिक ज्योतिष में इसका कोई स्थान नहीं।&quot; यद्यपि प्लेसिडस की उत्पत्ति यूरोप में हुई, केपी पद्धति इसे विशुद्ध वैदिक अवधारणाओं — नक्षत्र, विंशोत्तरी दशा अनुपात, और निरयन (लाहिरी) अयनांश — के साथ प्रयोग करती है। केपी एक संकर पद्धति है जो दोनों परम्पराओं का सर्वश्रेष्ठ लेती है। भाव विभाजन तकनीक ज्यामितीय और खगोलीय है — इसमें कोई अन्तर्निहित सांस्कृतिक पूर्वाग्रह नहीं है।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Placidus is a Western system, so it has no place in Vedic astrology.&quot; While Placidus originated in Europe, the KP system uses it alongside purely Vedic concepts — nakshatras, Vimshottari dasha proportions, and sidereal (Lahiri) ayanamsa. KP is a hybrid that takes the best from both traditions. The house division technique is geometric and astronomical — it has no inherent cultural bias.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Today, KP with Placidus houses is one of the most popular predictive systems in India, particularly for horary (prashna) and event-timing questions. Software like our KP System tool computes Placidus cusps automatically for any latitude, removing the need for manual table lookups that early KP practitioners had to perform. The system is especially relevant for the Indian diaspora living at high latitudes (UK, Canada, Northern Europe) where equal houses become increasingly inaccurate.', hi: 'आज प्लेसिडस भावों सहित केपी भारत में सर्वाधिक लोकप्रिय फलादेश पद्धतियों में से एक है, विशेषतः प्रश्न (होरेरी) और घटना-समय निर्धारण प्रश्नों के लिए। हमारे केपी सिस्टम उपकरण जैसे सॉफ्टवेयर किसी भी अक्षांश के लिए स्वचालित रूप से प्लेसिडस सन्धियाँ गणित करते हैं, जिससे प्रारम्भिक केपी अभ्यासकर्ताओं को करनी पड़ने वाली मैनुअल सारणी खोज की आवश्यकता समाप्त हो गई। यह पद्धति उच्च अक्षांशों (ब्रिटेन, कनाडा, उत्तरी यूरोप) पर रहने वाले भारतीय प्रवासियों के लिए विशेष रूप से प्रासंगिक है जहाँ समान भाव उत्तरोत्तर अशुद्ध होते जाते हैं।', sa: 'आज प्लेसिडस भावों सहित केपी भारत में सर्वाधिक लोकप्रिय फलादेश पद्धतियों में से एक है, विशेषतः प्रश्न (होरेरी) और घटना-समय निर्धारण प्रश्नों के लिए। हमारे केपी सिस्टम उपकरण जैसे सॉफ्टवेयर किसी भी अक्षांश के लिए स्वचालित रूप से प्लेसिडस सन्धियाँ गणित करते हैं, जिससे प्रारम्भिक केपी अभ्यासकर्ताओं को करनी पड़ने वाली मैनुअल सारणी खोज की आवश्यकता समाप्त हो गई। यह पद्धति उच्च अक्षांशों (ब्रिटेन, कनाडा, उत्तरी यूरोप) पर रहने वाले भारतीय प्रवासियों के लिए विशेष रूप से प्रासंगिक है जहाँ समान भाव उत्तरोत्तर अशुद्ध होते जाते हैं।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module20_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
