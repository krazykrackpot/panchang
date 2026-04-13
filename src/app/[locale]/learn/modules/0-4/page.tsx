'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-4.json';

const META: ModuleMeta = {
  id: 'mod_0_4',
  phase: 0,
  topic: 'Foundations',
  moduleNumber: '0.4',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
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
          {isHi ? 'पंचांग खोलें — पहले दो तत्त्व' : 'Open the Panchang — The First Two Elements'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'हमारे ऐप पर पंचांग पृष्ठ खोलें। आप पाँच मूल तत्त्व देखेंगे — इसीलिए इसे "पंच-अंग" (पाँच अंग) कहते हैं। आइए पहले दो से शुरू करें।'
            : 'Open the Panchang page on our app. You\'ll see five core elements — that\'s why it\'s called "Panch-Anga" (five limbs). Let\'s start with the first two.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'पंचांग को एक ब्रह्माण्डीय मौसम ऐप समझें। जैसे मौसम ऐप बताता है "धूप, 25°C, UV इण्डेक्स उच्च — सनस्क्रीन लगाएँ," वैसे ही पंचांग बताता है "शुक्ल दशमी, हस्त नक्षत्र, शुभ योग — नई शुरुआत के लिए अच्छा दिन, राहु काल में यात्रा आरम्भ न करें।" करोड़ों भारतीय हर सुबह यह देखते हैं, ठीक वैसे जैसे आप मौसम देखते हैं।'
            : 'Think of the Panchang as a cosmic weather app. Just as a weather app tells you "sunny, 25\u00B0C, UV index high \u2014 wear sunscreen," the Panchang tells you "Shukla Dashami, Hasta Nakshatra, Shubh Yoga \u2014 good day for new beginnings, avoid starting travel during Rahu Kaal." Millions of Indians check this EVERY morning, just like you check the weather.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '1. तिथि — "चन्द्रमा किस कला में है?"' : '1. Tithi — "What Moon phase are we in?"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'पश्चिमी कैलेंडर में चन्द्रमा की केवल 4 कलाएँ हैं (नया, पहली तिमाही, पूर्ण, अन्तिम तिमाही)। वैदिक पद्धति में 30 कलाएँ हैं! चन्द्र-सूर्य पृथक्करण के प्रत्येक 12° = 1 तिथि। शुक्ल पक्ष = बढ़ता चन्द्रमा (चन्द्रमा बड़ा हो रहा), कृष्ण पक्ष = घटता चन्द्रमा (चन्द्रमा छोटा हो रहा)। पूर्णिमा = पूर्ण चन्द्र, अमावस्या = नया चन्द्र।'
            : 'Western calendars have just 4 Moon phases (new, first quarter, full, last quarter). The Vedic system has 30! Every 12° of Moon-Sun separation = 1 tithi. Shukla Paksha = waxing (Moon growing), Krishna Paksha = waning (Moon shrinking). Purnima = full moon, Amavasya = new moon.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'क्यों 12°? क्योंकि चन्द्रमा सूर्य से प्रतिदिन लगभग 12° आगे बढ़ता है (चन्द्रमा ~13.2°/दिन - सूर्य ~1°/दिन ≈ 12°/दिन)। इसलिए लगभग प्रतिदिन एक नई तिथि — यह गणित है, रहस्यवाद नहीं।'
            : 'Why 12°? Because the Moon gains about 12° on the Sun each day (Moon ~13.2°/day - Sun ~1°/day ≈ 12°/day). So roughly one new tithi per day — it\'s mathematics, not mysticism.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '2. वार — "आज कौन-सा दिन है?"' : '2. Vara — "What day is it?"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रत्येक दिन एक ग्रह द्वारा शासित है। रविवार = सूर्य (Ravi), सोमवार = चन्द्र (Soma), मंगलवार = मंगल (Mangala), बुधवार = बुध (Budha), गुरुवार = गुरु (Guru/Brihaspati), शुक्रवार = शुक्र (Shukra), शनिवार = शनि (Shani)। अंग्रेजी नाम उन्हीं ग्रहों से आते हैं! Sun-day, Moon-day, आदि।'
            : 'Each day is ruled by a planet. Ravivara = Sunday/Sun, Somavara = Monday/Moon, Mangalavara = Tuesday/Mars, Budhavara = Wednesday/Mercury, Guruvara = Thursday/Jupiter, Shukravara = Friday/Venus, Shanivara = Saturday/Saturn. The English names come from the same planets! Sun-day, Moon-day, etc.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'यहाँ एक चौंकाने वाला सम्बन्ध है: अंग्रेजी सप्ताह के दिन उसी ग्रह पद्धति से आते हैं। Sunday = Sun-day (रविवार)। Monday = Moon-day (सोमवार)। Saturday = Saturn-day (शनिवार)। Tuesday = Tiw\'s day (नॉर्स मंगल = मंगलवार)। यह संयोग नहीं है — 7-दिवसीय ग्रह सप्ताह भारत से बेबीलोन होते हुए रोम तक पहुँचा। जब भी आप "Monday" कहते हैं, आप भारतीय खगोलशास्त्र का प्रयोग कर रहे हैं।'
            : 'Here\'s a mind-blowing connection: the English days of the week come from the SAME planetary system. Sunday = Sun-day (Ravivara). Monday = Moon-day (Somavara). Saturday = Saturn-day (Shanivara). Tuesday = Tiw\'s day (Norse Mars = Mangalavara). This isn\'t coincidence \u2014 the 7-day planetary week was transmitted from India through Babylon to Rome. You\'re already using Indian astronomy every time you say "Monday."'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'रोचक तथ्य' : 'Key Historical Fact'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? '7-दिवसीय सप्ताह भारत और बेबीलोन दोनों में एक ही ग्रह होरा पद्धति का उपयोग करके स्वतन्त्र रूप से आविष्कृत हुआ। क्रम सूर्य→चन्द्र→मंगल→बुध→गुरु→शुक्र→शनि प्रत्येक 24वीं होरा (ग्रह घण्टे) की गणना से आता है — शुद्ध गणित, संयोग नहीं। कल्डियन क्रम (शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चन्द्र) में होराएँ निर्धारित करें, और प्रत्येक 24वीं होरा अगले दिन का स्वामी देती है।'
            : 'The 7-day week was invented independently in India and Babylon using the SAME planetary hora system. The order Sun\u2192Moon\u2192Mars\u2192Mercury\u2192Jupiter\u2192Venus\u2192Saturn comes from counting every 24th hora (planetary hour) \u2014 pure mathematics, not coincidence. Assign horas in the Chaldean order (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon), and every 24th hora gives the ruler of the next day.'}
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
          {isHi ? 'शेष तीन पंचांग तत्त्व' : 'The Remaining Three Panchang Elements'}
        </h3>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'अब यहाँ पंचांग विशिष्ट रूप से भारतीय हो जाता है। पश्चिमी कैलेंडर "आज कौन-सा दिन है?" पर रुक जाता है। पंचांग ब्रह्माण्डीय जानकारी के चार और आयाम जोड़ता है — ऐसे आयाम जिनका कोई पश्चिमी समकक्ष नहीं है।'
            : 'Now here\'s where the Panchang gets uniquely Indian. Western calendars stop at "what day is it?" The Panchang adds FOUR more dimensions of cosmic information \u2014 dimensions that have no Western equivalent.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '3. नक्षत्र — "चन्द्रमा किस तारा-समूह में है?"' : '3. Nakshatra — "Which star group is the Moon visiting?"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'चन्द्रमा ~27 दिनों में सभी 27 नक्षत्रों से होकर गुजरता है — प्रत्येक में लगभग एक दिन। प्रत्येक नक्षत्र का एक स्वभाव है (सौम्य, उग्र, स्थिर, चर) जो उस दिन की ऊर्जा को रंग देता है। उदाहरणार्थ, पुष्य (सबसे शुभ नक्षत्रों में से एक) सौम्य है — नए कार्य आरम्भ करने के लिए उत्तम। आर्द्रा तीक्ष्ण है — शल्य चिकित्सा या कठोर कार्यों के लिए बेहतर।'
            : 'The Moon visits all 27 nakshatras in ~27 days, spending roughly one day in each. Each nakshatra has a nature (gentle, fierce, fixed, movable) that colors the day\'s energy. For example, Pushya (one of the most auspicious nakshatras) is gentle \u2014 great for starting ventures. Ardra is sharp \u2014 better for surgery or tough tasks.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '4. योग — "सूर्य + चन्द्र का संयुक्त मिजाज़ क्या है?"' : '4. Yoga — "What\'s the combined Sun+Moon mood?"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'सूर्य का देशान्तर + चन्द्रमा का देशान्तर, 27 खण्डों में विभक्त। यह वह योग नहीं जो आसन (स्ट्रेचिंग) है — यह "युज" = संयोग है। 27 योगों में से प्रत्येक का एक नाम और स्वभाव है। विष्कम्भ (प्रथम) से वैधृति (अन्तिम) तक, कुछ शुभ हैं (सिद्धि, शिव, सौभाग्य) और कुछ अशुभ (व्यतीपात, वैधृति)।'
            : 'Sun longitude + Moon longitude, divided into 27 segments. Not the stretching kind of yoga \u2014 this is "yuj" = combination. Each of the 27 yogas has a name and nature. From Vishkambha (first) to Vaidhriti (last), some are auspicious (Siddhi, Shiva, Saubhagya) and some inauspicious (Vyatipata, Vaidhriti).'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '5. करण — "अर्ध-तिथि"' : '5. Karana — "Half a tithi"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? '11 प्रकार के करण चन्द्र मास में चक्रित होते हैं। प्रत्येक तिथि में 2 करण होते हैं (प्रत्येक 6° का)। सबसे महत्त्वपूर्ण बात: विष्टि (भद्रा) करण = नई शुरुआत से बचें। यह प्रत्येक अष्टमी और एकादशी में नियमित रूप से आता है।'
            : '11 types of karanas cycle through the lunar month. Each tithi has 2 karanas (each spanning 6\u00B0). The most important thing to know: Vishti (Bhadra) karana = avoid new beginnings. It recurs regularly in every Ashtami and Ekadashi.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'रोचक तथ्य' : 'Key Historical Fact'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'वराहमिहिर की बृहत्संहिता (छठी शताब्दी ई.) ने पंचांग तत्त्वों का उपयोग मानसून समय, फसल उपज और भूकम्पों की भविष्यवाणी के लिए किया। आधुनिक मौसमविज्ञानियों ने चन्द्र कलाओं और भारत में वर्षा प्रतिरूपों के बीच सांख्यिकीय सहसम्बन्ध पाया है — जो वराहमिहिर ने 1500 वर्ष पहले प्रेक्षित किया था, उसे प्रमाणित करता है।'
            : 'Varahamihira\'s Brihat Samhita (6th century CE) used Panchang elements to predict monsoon timing, crop yields, and even earthquakes. Modern meteorologists have found statistical correlations between lunar phases and rainfall patterns in India \u2014 validating what Varahamihira observed 1500 years ago.'}
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
          {isHi ? 'व्यावहारिक भाग — समय की जानकारी' : 'The Practical Parts — Timing Information'}
        </h3>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सूर्योदय / सूर्यास्त' : 'Sunrise / Sunset'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'आपके स्थान के लिए गणित — सामान्य नहीं। वैदिक दिवस सूर्योदय से आरम्भ होता है (मध्यरात्रि से नहीं), इसलिए सूर्योदय का समय पंचांग का आधार है। हमारा ऐप आपके शहर के अक्षांश-देशान्तर का उपयोग करके सटीक सूर्योदय/सूर्यास्त गणित करता है।'
            : 'Calculated for YOUR location \u2014 not generic. The Vedic day begins at sunrise (not midnight), so sunrise time is the foundation of the Panchang. Our app uses your city\'s latitude and longitude to compute precise sunrise/sunset times.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'राहु काल' : 'Rahu Kaal'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रतिदिन ~1.5 घण्टे की अशुभ अवधि। प्रत्येक वार को अलग समय पर आती है। बहुत से भारतीय इस समय महत्त्वपूर्ण कार्य आरम्भ करने से बचते हैं — नया व्यापार, अनुबन्ध पर हस्ताक्षर, यात्रा प्रारम्भ। दिन की अवधि (सूर्योदय से सूर्यास्त) को 8 भागों में बाँटकर गणित होता है।'
            : 'A ~1.5 hour inauspicious window each day. Falls at a different time each weekday. Many Indians avoid starting important tasks during this time \u2014 new business, signing contracts, beginning travel. Calculated by dividing daylight hours (sunrise to sunset) into 8 equal parts.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'चौघड़िया और मुहूर्त' : 'Choghadiya & Muhurta'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'चौघड़िया: प्रत्येक अर्ध-दिवस में 8 समय-खण्ड, प्रत्येक एक भिन्न गुण से शासित (अमृत = सर्वोत्तम, काल = सबसे खराब)। मुहूर्त: प्रतिदिन 30 समय विभाजन (प्रत्येक ~48 मिनट)। मध्याह्न के आसपास अभिजित मुहूर्त = सार्वभौमिक रूप से शुभ — विष्णु शासित, सभी कार्यों के लिए उत्तम।'
            : 'Choghadiya: 8 time slots per half-day, each ruled by a different quality (Amrit = best, Kaal = worst). Muhurta: 30 time divisions per day (each ~48 minutes). Abhijit Muhurta around noon = universally auspicious \u2014 ruled by Vishnu, good for all activities.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शुरुआती सलाह' : 'Pro Tip for Beginners'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'पहले दिन ही सभी 5 तत्त्व समझने की ज़रूरत नहीं। केवल दो से शुरू करें: तिथि (चन्द्रमा बढ़ रहा है या घट रहा?) और राहु काल (किस 90-मिनट की अवधि में महत्त्वपूर्ण शुरुआत से बचना चाहिए?)। ये दो अकेले आपको 80% व्यावहारिक पंचांग उपयोग से जोड़ देंगे।'
            : 'You don\'t need to understand all 5 elements on day one. Start with just TWO: the Tithi (is the Moon waxing or waning?) and Rahu Kaal (what 90-minute window should I avoid for important starts?). These two alone will connect you to 80% of practical Panchang usage.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'व्यावहारिक अभ्यास' : 'Practical Exercise'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'हमारे ऐप पर आज का पंचांग देखें। ढूँढ़ें: (1) वर्तमान तिथि और उसका स्वभाव, (2) राहु काल कब है, (3) अगला अभिजित मुहूर्त। बस — आपने पंचांग पढ़ लिया!'
            : 'Look at today\'s Panchang on our app. Find: (1) the current tithi and its nature, (2) when Rahu Kaal is today, (3) the next Abhijit Muhurta window. That\'s it \u2014 you\'ve just read a Panchang!'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'अगले मॉड्यूल में हम कुण्डली (जन्म कुण्डली) को समझेंगे — आपके जन्म क्षण का आकाशीय मानचित्र।'
            : 'In the next module, we\'ll understand the Kundali (birth chart) \u2014 the celestial map of the moment you were born.'}
        </p>
      </section>
    </div>
  );
}

export default function Module0_4() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
