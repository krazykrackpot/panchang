'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-2.json';

const META: ModuleMeta = {
  id: 'mod_0_2',
  phase: 0,
  topic: 'Pre-Foundation',
  moduleNumber: '0.2',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
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
          {isHi ? 'हिन्दू त्योहार हर वर्ष "खिसकते" क्यों हैं?' : 'Why Hindu Festivals "Move" Every Year'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? '"दीवाली इस बार नवम्बर में क्यों है? पिछले साल तो अक्टूबर में थी!" — यह प्रश्न हर वर्ष पूछा जाता है। उत्तर सरल और सुन्दर है: दीवाली बदलती नहीं। आपका कैलेण्डर बदलता है।'
            : '"Why is Diwali in November this time? Last year it was in October!" — this question gets asked every year. The answer is simple and elegant: Diwali doesn\'t move. YOUR calendar does.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'क्या आपने कभी सोचा है कि दीवाली कभी अक्टूबर में क्यों होती है और कभी नवम्बर में? या आपकी दादी क्यों कहती हैं कि एकादशी का व्रत एक विशिष्ट सूर्योदय से शुरू होना चाहिए? उत्तर मानव जाति की सबसे परिष्कृत पंचांग प्रणालियों में से एक में छिपा है — और भारत का संस्करण सम्भवतः सबसे सुन्दर है।'
            : 'Have you ever wondered why Diwali is sometimes in October and sometimes in November? Or why your grandmother insists that Ekadashi fasting must start at a specific sunrise? The answer lies in one of humanity\'s most sophisticated calendar systems — and India\'s version is arguably the most elegant.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'हिन्दू चान्द्र-सौर पंचांग की प्रतिभा यह है: यह चन्द्रमा को ट्रैक करता है (जो ज्वार, कृषि और जैविक लय को नियन्त्रित करता है) और साथ ही सूर्य (जो ऋतुओं को नियन्त्रित करता है) से संरेखित रहता है। शुद्ध चान्द्र पंचांग जैसे इस्लामी पंचांग प्रति वर्ष 11 दिन खिसकते हैं — इसीलिए रमज़ान सभी ऋतुओं में घूमता है। हिन्दू पंचांग हर ~33 मास में अधिक मास (लीप मास) डालकर इससे बचता है। यह ब्रह्माण्ड के लिए ऑटो-करेक्ट जैसा है।'
            : 'Here\'s what\'s genius about the Hindu lunisolar calendar: it tracks the Moon (which governs tides, agriculture, and biological rhythms) while staying aligned with the Sun (which governs seasons). Pure lunar calendars like the Islamic calendar drift 11 days per year — which is why Ramadan moves through all seasons. The Hindu calendar avoids this by inserting an Adhika Masa (leap month) every ~33 months. It\'s like auto-correct for the cosmos. Think of the Panchang as a cosmic weather app — except it\'s been running for 3,000 years.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'दुनिया में तीन मुख्य पंचांग प्रणालियाँ हैं:'
            : 'There are three main calendar systems in the world:'}
        </p>

        <div className="grid gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light text-sm font-bold mb-1">{isHi ? 'ग्रेगोरियन = शुद्ध सौर' : 'Gregorian = Pure Solar'}</p>
            <p className="text-text-secondary text-xs">
              {isHi
                ? '365.25 दिन/वर्ष। ऋतुओं से संरेखित — 25 दिसम्बर सदा शीतकाल में। किन्तु चन्द्रमा की अवस्थाओं की पूर्णतः उपेक्षा।'
                : '365.25 days/year. Aligned with seasons — December 25 is always in winter. But completely ignores Moon phases.'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-blue-300 text-sm font-bold mb-1">{isHi ? 'इस्लामी = शुद्ध चान्द्र' : 'Islamic = Pure Lunar'}</p>
            <p className="text-text-secondary text-xs">
              {isHi
                ? '354 दिन/वर्ष। चन्द्र अवस्थाओं से संरेखित — किन्तु ऋतुओं में खिसकता है। इसीलिए रमज़ान हर वर्ष ~11 दिन पहले आता है, ~33 वर्ष में पूरा चक्र।'
                : '354 days/year. Aligned with Moon phases — but drifts through seasons. That\'s why Ramadan comes ~11 days earlier each year, completing a full cycle in ~33 years.'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-emerald-500/15">
            <p className="text-emerald-400 text-sm font-bold mb-1">{isHi ? 'हिन्दू = चान्द्र-सौर (प्रतिभाशाली संकर)' : 'Hindu = Lunisolar (Genius Hybrid)'}</p>
            <p className="text-text-secondary text-xs">
              {isHi
                ? 'मास चन्द्रमा का अनुसरण करते हैं (~29.5 दिन/मास), किन्तु अधिक मास (लीप मास, हर ~33 मास) द्वारा वर्ष सूर्य/ऋतुओं से संरेखित रहते हैं। होली सदा वसन्त में, दीवाली सदा शरद में!'
                : 'Months follow the Moon (~29.5 days/month), BUT years stay aligned with the Sun/seasons through Adhika Masa (leap month, every ~33 months). Holi is always in spring, Diwali always in autumn!'}
            </p>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'दीवाली सदा कार्तिक अमावस्या पर है। यह चान्द्र-सौर तिथि ग्रेगोरियन कैलेण्डर की भिन्न तारीखों पर आती है — किन्तु हिन्दू पंचांग में यह हमेशा एक ही तिथि है।'
            : 'Diwali is ALWAYS on Kartik Amavasya (new moon of Kartik month). This lunisolar date maps to different Gregorian dates — but in the Hindu calendar, it is always the same date.'}
        </p>
      </section>

      {/* Classical Origin — Gold card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? 'भारत ने चान्द्र-सौर पंचांग स्वतन्त्र रूप से विकसित किया। मेटोनिक चक्र (19 वर्षीय पुनरावृत्ति) भारत में एथेंस के मेटोन से पहले ज्ञात था।'
            : 'India developed the lunisolar calendar independently. The Metonic cycle (19-year repeat pattern where lunar phases recur on the same solar dates) was known in India before Meton of Athens (432 BCE).'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'भारतीय पंचांग समिति (1955) का नेतृत्व भौतिकविद् मेघनाद साहा ने किया — वही साहा जिन्होंने खगोल भौतिकी में साहा आयनीकरण समीकरण की खोज की। एक विश्व-स्तरीय वैज्ञानिक ने भारत का राष्ट्रीय पंचांग मानकीकृत किया।'
            : 'The Indian Calendar Reform Committee (1955) was led by physicist Meghnad Saha — the same Saha who discovered the Saha ionization equation in astrophysics. A world-class scientist standardized India\'s national calendar.'}
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
          {isHi ? 'अमान्त बनाम पूर्णिमान्त' : 'Amanta vs Purnimanta'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'यदि आप उत्तर भारतीय और दक्षिण भारतीय से पूछें "आज कौन सा मास है?" — तो आपको अलग उत्तर मिल सकता है। दोनों सही हैं!'
            : 'If you ask a North Indian and a South Indian "what month is it today?" — you might get different answers. Both are correct!'}
        </p>

        <div className="grid gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{isHi ? 'पूर्णिमान्त (उत्तर भारत)' : 'Purnimanta (North India)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed mb-1">
              {isHi
                ? 'मास पूर्णिमा पर समाप्त होता है। कृष्ण पक्ष पहले, फिर शुक्ल पक्ष।'
                : 'Month ENDS at Purnima (full moon). Krishna Paksha (waning) comes first, then Shukla Paksha (waxing).'}
            </p>
            <p className="text-text-tertiary text-xs">
              {isHi ? 'उत्तर प्रदेश, राजस्थान, मध्य प्रदेश, नेपाल' : 'Uttar Pradesh, Rajasthan, Madhya Pradesh, Nepal'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-blue-300 text-sm font-bold mb-2">{isHi ? 'अमान्त (दक्षिण भारत/गुजरात)' : 'Amanta (South India / Gujarat)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed mb-1">
              {isHi
                ? 'मास अमावस्या पर समाप्त होता है। शुक्ल पक्ष पहले, फिर कृष्ण पक्ष।'
                : 'Month ENDS at Amavasya (new moon). Shukla Paksha (waxing) comes first, then Krishna Paksha (waning).'}
            </p>
            <p className="text-text-tertiary text-xs">
              {isHi ? 'महाराष्ट्र, कर्नाटक, आन्ध्र, तमिलनाडु, गुजरात' : 'Maharashtra, Karnataka, Andhra, Tamil Nadu, Gujarat'}
            </p>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">{isHi ? 'इसका अर्थ:' : 'What this means:'}</span>{' '}
          {isHi
            ? 'एक ही एकादशी उत्तर भारत में "चैत्र" और दक्षिण भारत में "वैशाख" हो सकती है। हमारा ऐप दोनों प्रणालियों का समर्थन करता है — एक टॉगल से बदलें।'
            : 'The same Ekadashi might be "Chaitra" in the North but "Vaishakha" in the South. Our app supports BOTH systems — switch with a toggle.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'यह आपके लिए क्यों मायने रखता है? यदि आप त्योहार पंचांग का पालन कर रहे हैं, तो अमान्त/पूर्णिमान्त अन्तर का अर्थ है कि आपकी एकादशी दूसरे राज्य के किसी व्यक्ति से भिन्न नामित मास में पड़ सकती है — भले ही वह एक ही खगोलीय दिन हो। हमारा ऐप इसे टॉगल से सम्भालता है, जिससे आप सदा अपनी परम्परा के अनुसार सही मास देखें।'
            : 'Why does this matter to YOU? If you\'re following a festival calendar, the Amanta/Purnimanta difference can mean your Ekadashi falls in a different named month than someone from another state — even though it\'s the SAME astronomical day. Our app handles this with a toggle, so you always see the correct month for your tradition.'}
        </p>
      </section>

      {/* Emerald fact card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'भारतीय वर्ष-गणना' : 'Indian Year-Counting Eras'}
        </h4>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>
            <span className="text-emerald-300 font-bold">{isHi ? 'विक्रम सम्वत्' : 'Vikram Samvat'}</span>{' '}
            {isHi
              ? '— 57 ई.पू. से शुरू (राजा विक्रमादित्य के नाम पर)। वर्तमान वर्ष: विक्रम सम्वत् 2083। नेपाल का आधिकारिक पंचांग।'
              : '— started 57 BCE (named after King Vikramaditya). Current year: Vikram Samvat 2083. Official calendar of Nepal.'}
          </p>
          <p>
            <span className="text-emerald-300 font-bold">{isHi ? 'शक सम्वत्' : 'Shaka Samvat'}</span>{' '}
            {isHi
              ? '— 78 ई. से शुरू (कुषाण राजा कनिष्क के नाम पर)। भारत सरकार का आधिकारिक राष्ट्रीय पंचांग। वर्तमान शक वर्ष: 1948।'
              : '— started 78 CE (attributed to Kushana king Kanishka). Official national calendar of the Government of India. Current Shaka year: 1948.'}
          </p>
          <p className="text-text-tertiary text-xs">
            {isHi
              ? 'ग्रेगोरियन कैलेण्डर अंग्रेज़ों के साथ आया — भारत के अपने कई पंचांग युग हैं, सदियों पुराने!'
              : 'The Gregorian calendar came with the British — India has its own multiple calendar eras, centuries older!'}
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
          {isHi ? 'व्यावहारिक अभ्यास: आज का पंचांग पढ़ें' : 'Practical Exercise: Read Today\'s Panchang'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'अब जब आप जानते हैं कि हिन्दू पंचांग कैसे काम करता है, आइए इसे अभ्यास में लाएँ। हमारे ऐप पर आज का पंचांग खोलें और ये पहचानें:'
            : 'Now that you understand how the Hindu calendar works, let\'s put it into practice. Open today\'s Panchang on our app and identify:'}
        </p>
        <ul className="text-text-secondary text-sm space-y-2 ml-4 mb-4">
          <li>
            <span className="text-gold-light font-medium">{isHi ? 'मास' : 'Masa (month)'}</span>{' '}
            — {isHi ? 'आज कौन सा चान्द्र मास चल रहा है?' : 'What lunar month is it today?'}
          </li>
          <li>
            <span className="text-gold-light font-medium">{isHi ? 'तिथि' : 'Tithi'}</span>{' '}
            — {isHi ? 'आज कौन सी तिथि है? शुक्ल पक्ष या कृष्ण पक्ष?' : 'What tithi is it? Shukla Paksha or Krishna Paksha?'}
          </li>
          <li>
            <span className="text-gold-light font-medium">{isHi ? 'नक्षत्र' : 'Nakshatra'}</span>{' '}
            — {isHi ? 'चन्द्रमा आज किस नक्षत्र में है?' : 'Which nakshatra is the Moon in today?'}
          </li>
          <li>
            <span className="text-gold-light font-medium">{isHi ? 'अगला त्योहार' : 'Next festival'}</span>{' '}
            — {isHi ? 'किस तिथि/मास पर है?' : 'What tithi/masa does it fall on?'}
          </li>
          <li>
            <span className="text-gold-light font-medium">{isHi ? 'सूर्योदय/सूर्यास्त' : 'Sunrise/Sunset'}</span>{' '}
            — {isHi ? 'राहु काल और मुहूर्त इन पर निर्भर करते हैं' : 'Notice how Rahu Kaal and Muhurta timing depends on these'}
          </li>
        </ul>
      </section>

      {/* Red — Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p>
            <span className="text-red-300 font-bold">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span>{' '}
            {isHi ? '"हिन्दू त्योहारों की तारीख हर वर्ष बदलती है"' : '"Hindu festivals change their dates every year"'}
            <br />
            <span className="text-emerald-300">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
            {isHi
              ? 'वे नहीं बदलते! दीवाली सदा कार्तिक अमावस्या है। जो बदलता है वह ग्रेगोरियन तारीख है जिस पर वह तिथि पड़ती है — क्योंकि दो भिन्न पंचांग प्रणालियाँ भिन्न गति से चलती हैं।'
              : 'They don\'t! Diwali is ALWAYS Kartik Amavasya. What changes is the GREGORIAN date it falls on — because two different calendar systems run at different speeds.'}
          </p>
          <p>
            <span className="text-red-300 font-bold">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span>{' '}
            {isHi ? '"पंचांग पुराना और अप्रासंगिक है"' : '"The Panchang is outdated and irrelevant"'}
            <br />
            <span className="text-emerald-300">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
            {isHi
              ? 'पंचांग चन्द्रमा की वास्तविक खगोलीय स्थिति पर आधारित है — यह विज्ञान है, परम्परा मात्र नहीं। हमारा ऐप वही गणनाएँ करता है जो NASA/JPL करता है।'
              : 'The Panchang is based on the Moon\'s actual astronomical position — it\'s science, not just tradition. Our app runs the same calculations as NASA/JPL.'}
          </p>
        </div>
      </section>

      {/* Blue — Modern Relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? 'हिन्दू समय की अवधारणा चक्रीय है, रेखीय नहीं — युग 4,320,000 वर्षों में चक्रित होते हैं। ग्रन्थों में उल्लिखित सबसे छोटी समय इकाई "त्रुटि" = 29.6 माइक्रोसेकण्ड है। तुलना: आधुनिक परमाणु घड़ियाँ माइक्रोसेकण्ड में मापती हैं। भारतीय खगोलशास्त्री 2,000 वर्ष पहले इस पैमाने पर विचार कर रहे थे।'
            : 'The Hindu concept of time is cyclic, not linear — Yugas cycle in 4,320,000-year periods. The smallest time unit mentioned in texts is the "truti" = 29.6 microseconds. For comparison, modern atomic clocks measure in microseconds. Indian astronomers were thinking at this scale 2,000 years ago.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'आज, चान्द्र-सौर प्रणाली सम्पूर्ण भारतीय उपमहाद्वीप, नेपाल, श्रीलंका और दक्षिण-पूर्व एशिया के बड़े भागों में प्रयोग होती है। प्रत्येक विवाह, गृहप्रवेश, नामकरण और अन्तिम संस्कार का समय पंचांग से निर्धारित होता है। यह ज्ञान व्यावहारिक सांस्कृतिक साक्षरता है।'
            : 'Today, the lunisolar system is used across the entire Indian subcontinent, Nepal, Sri Lanka, and large parts of Southeast Asia. Every wedding, housewarming, naming ceremony, and funeral is timed using the Panchang. This knowledge is practical cultural literacy.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {isHi
            ? 'सूर्य सिद्धान्त में समय की सबसे छोटी इकाई "त्रुटि" है — लगभग 29.6 माइक्रोसेकण्ड। सबसे बड़ी "कल्प" है — 4.32 अरब वर्ष। तुलना के लिए, आधुनिक अनुमान पृथ्वी की आयु 4.54 अरब वर्ष रखते हैं। भारतीय खगोलशास्त्री इस पैमाने पर सोच रहे थे — माइक्रोसेकण्ड से अरबों वर्ष तक — जबकि अधिकांश सभ्यताएँ अभी भी यह बहस कर रही थीं कि पृथ्वी चपटी है या नहीं। पिंगल (300 ई.पू.) ने संस्कृत छन्द पर अपने कार्य में द्विआधारी संख्याओं (binary numbers) का वर्णन किया — लाइब्निट्ज़ से 2,000 वर्ष पहले।'
            : 'The smallest time unit in the Surya Siddhanta is the "truti" — approximately 29.6 microseconds. The largest is the "Kalpa" — 4.32 BILLION years. For comparison, modern estimates put Earth\'s age at 4.54 billion years. Indian astronomers were thinking on this scale — from microseconds to billions of years — while most civilizations were still arguing about whether Earth was flat. And Pingala (300 BCE) described binary numbers in his work on Sanskrit meter — 2,000 years before Leibniz.'}
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module0_2Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
