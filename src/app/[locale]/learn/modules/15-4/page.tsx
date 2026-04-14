'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/15-4.json';

const META: ModuleMeta = {
  id: 'mod_15_4', phase: 4, topic: 'Prashna & Advanced', moduleNumber: '15.4',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 16,
  crossRefs: (L.crossRefs as unknown as Array<{ label: ModuleMeta['title']; href: string }>).map(cr => ({ label: cr.label, href: cr.href })),
};

const QUESTIONS: ModuleQuestion[] = (L.questions as unknown as ModuleQuestion[]);

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'वर्षफल — सौर प्रत्यावर्तन कुण्डली' : 'Varshaphal — The Solar Return Chart'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>वर्षफल (शाब्दिक अर्थ &quot;वर्ष का फल&quot;) एक वार्षिक भविष्यवाणी कुण्डली है जो उस सटीक खगोलीय क्षण के लिए बनाई जाती है जब गोचरी सूर्य अपने जन्मकालीन निरयन देशान्तर पर लौटता है। यह क्षण — सौर प्रत्यावर्तन कहलाता है — आपके ज्योतिषीय वर्ष के आरम्भ का चिह्न है। वर्षफल कुण्डली को जन्म कुण्डली के साथ पढ़कर आगामी वर्ष की घटनाओं, विषयों और चुनौतियों की भविष्यवाणी की जाती है। पश्चिमी सौर प्रत्यावर्तन जो सायन राशिचक्र प्रयोग करते हैं, उनके विपरीत वैदिक वर्षफल लाहिरी अयनांश सहित निरयन राशिचक्र प्रयोग करता है।</>

            : <>Varshaphal (literally &quot;fruit of the year&quot;) is an annual predictive chart cast for the exact astronomical moment when the transiting Sun returns to its natal sidereal longitude. This moment — called the Solar Return — marks the beginning of your astrological year. The Varshaphal chart is read alongside the natal chart to predict events, themes, and challenges for the upcoming year. Unlike Western Solar Returns which use the tropical zodiac, the Vedic Varshaphal uses the sidereal zodiac with Lahiri ayanamsa.</>}

        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>ताजिक पद्धति वर्षफल के लिए प्रयुक्त व्याख्यात्मक ढाँचा है। यह मध्यकाल में फ़ारसी-अरबी माध्यमों से भारतीय ज्योतिष में प्रवेश की, उन विद्वानों द्वारा लाई गई जिन्होंने भारतीय और इस्लामी खगोलीय परम्पराओं का संश्लेषण किया। नीलकण्ठ की &quot;ताजिक नीलकण्ठी&quot; (16वीं शताब्दी) प्रामाणिक ग्रन्थ है। ताजिक पाराशरी ज्योतिष से मूलभूत रूप से भिन्न है — यह केवल भाव स्वामित्व के बजाय दृष्टियों (विशेषकर ग्रहों के बीच अनुप्रयुक्त और पृथक्करण दृष्टियों) पर भारी निर्भर करती है।</>

            : <>The Tajika system is the interpretive framework used for Varshaphal. It entered Indian astrology through Perso-Arabic channels during the medieval period, brought by scholars who synthesized Indian and Islamic astronomical traditions. Neelakantha&apos;s &quot;Tajika Neelakanthi&quot; (16th century) is the authoritative text. Tajika is fundamentally different from Parashari astrology — it relies heavily on aspects (especially applying and separating aspects between planets) rather than house lordships alone.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Muntha & Varsheshvara', hi: 'मुन्था एवं वर्षेश्वर', sa: 'मुन्था एवं वर्षेश्वर' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">

          {isHi

            ? <>मुन्था वर्षफल का अनूठा प्रगतिशील बिन्दु है। यह जन्म लग्न राशि से आरम्भ होता है और प्रतिवर्ष एक राशि आगे बढ़ता है। 1 वर्ष की आयु में मुन्था लग्न से दूसरी राशि में; 12 वर्ष पर लग्न पर लौटता है; 24 वर्ष पर दूसरा चक्र पूर्ण करता है। वर्षफल लग्न से केन्द्र (1, 4, 7, 10) या त्रिकोण (1, 5, 9) में मुन्था शुभ है; दुस्थान (6, 8, 12) में कठिनाइयों का संकेत। मुन्था स्वामी की शक्ति और स्थिति वर्ष के भाग्य को और परिष्कृत करती है। वर्षेश्वर (वर्ष स्वामी) वह ग्रह है जो सौर प्रत्यावर्तन के वार और होरा स्वामित्व से निर्धारित होता है — यह सम्पूर्ण वर्ष का प्रमुख शासक बनता है।</>

            : <>Muntha is a progressed point unique to Varshaphal. It starts at the natal Lagna sign and advances one sign per year. At age 1, Muntha is in the 2nd sign from Lagna; at age 12 it returns to Lagna; at age 24 it completes its second cycle. Muntha in kendras (1, 4, 7, 10) or trikonas (1, 5, 9) from the Varshaphal Lagna is auspicious; in dusthanas (6, 8, 12) it signals difficulties. The Muntha lord&apos;s strength and placement further refine the year&apos;s fortune.</>}

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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'ताजिक योग' : 'Tajika Yogas'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>ताजिक योग वर्षफल के मूल भविष्यवाणी उपकरण हैं, मूलभूत रूप से ग्रहों के बीच अनुप्रयुक्त और पृथक्करण दृष्टियों पर आधारित। सबसे महत्त्वपूर्ण इत्थसाल (अनुप्रयुक्त दृष्टि) है: जब एक तीव्र ग्रह धीमे ग्रह के साथ सटीक दृष्टि की ओर बढ़ रहा है, तो उन ग्रहों द्वारा सूचित घटना होगी। वे सटीकता के जितने निकट हैं, परिणाम उतना ही शीघ्र। ईसराफ (पृथक्करण दृष्टि) विपरीत है — ग्रह पहले ही अपनी सटीक दृष्टि पार कर चुके हैं, अर्थात अवसर विद्यमान था परन्तु बीत गया, या घटना सम्भव थी परन्तु अब साकार नहीं होगी।</>

            : <>Tajika yogas are the core predictive tools of Varshaphal, fundamentally based on applying and separating aspects between planets. The most important is Ithasala (applying aspect): when a faster planet approaches an exact aspect with a slower planet, the event signified by those planets WILL happen. The closer they are to exactitude, the sooner. Easarapha (separating aspect) is the opposite — the planets have already passed their exact aspect, meaning the opportunity existed but has passed, or the event was possible but will not materialize now.</>}

        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>नक्त (प्रकाश का हस्तान्तरण) तब होता है जब दो ग्रह परस्पर दृष्टि में नहीं हैं, परन्तु एक तीसरा तीव्र ग्रह दोनों को दृष्ट करता है, एक दूत के रूप में कार्य करते हुए एक से दूसरे को प्रकाश (इरादा) हस्तान्तरित करता है — घटना एक मध्यस्थ के माध्यम से होती है। यमय (निषेध) तब होता है जब तीसरा ग्रह इत्थसाल बनाने वाले दो ग्रहों के बीच अपनी दृष्टि डालता है, घटना को प्रकट होने से रोकता है — जैसे कोई सौदा जो तीसरे पक्ष के हस्तक्षेप से विफल हो जाता है।</>

            : <>Nakta (transfer of light) occurs when two planets are not in mutual aspect, but a third faster planet aspects both, acting as a messenger that transfers the light (intention) from one to the other — the event happens through an intermediary. Yamaya (prohibition) occurs when a third planet interposes its aspect between two planets forming Ithasala, blocking the event from manifesting — like a deal that is killed by a third party&apos;s interference.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Sahams & Mudda Dasha', hi: 'सहम एवं मुद्दा दशा', sa: 'सहम एवं मुद्दा दशा' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <>सहम संवेदनशील गणितीय बिन्दु हैं (पश्चिमी ज्योतिष में अरबी भागों के समतुल्य)। इनकी गणना: सहम = लग्न + ग्रह A - ग्रह B। सबसे महत्त्वपूर्ण पुण्य सहम (भाग्य) = दिन के जन्म में लग्न + चन्द्र - सूर्य (रात्रि में उलटा)। अन्य में विद्या सहम (शिक्षा), कर्म सहम (पेशा), विवाह सहम, मृत्यु सहम और रोग सहम सम्मिलित हैं। मुद्दा दशा वर्षफल की संकुचित वार्षिक दशा है — सम्पूर्ण विंशोत्तरी 120-वर्ष चक्र को एक वर्ष में संकुचित किया गया है। यह निर्धारित करती है कि वर्ष के किस कालखण्ड में कौन-सा ग्रह प्रभावी है, सटीक मासिक समयनिर्धारण प्रदान करती है।</>

            : <>Sahams are sensitive mathematical points (analogous to Arabic Parts in Western astrology). They are calculated as: Saham = Ascendant + Planet A - Planet B. The most important is Punya Saham (Fortune) = Ascendant + Moon - Sun during day births (reversed for night). Others include Vidya Saham (education), Karma Saham (profession), Vivaha Saham (marriage), Mrityu Saham (death), and Rog Saham (illness). Each Saham&apos;s house position and its lord&apos;s condition indicate prospects in that life area for the year.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Tajika Misconceptions', hi: 'सामान्य ताजिक भ्रान्तियाँ', sa: 'सामान्य ताजिक भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          A frequent error is confusing Tajika yogas with Parashari yogas. They are fundamentally different systems. Parashari yogas (Raja Yoga, Dhana Yoga, etc.) are based on house lordships and permanent placements. Tajika yogas (Ithasala, Easarapha, Nakta, Yamaya) are based on dynamic aspect relationships — whether planets are applying to or separating from exact aspects. Another misconception is that Varshaphal replaces natal chart analysis. It does not — Varshaphal provides annual refinement of the lifelong patterns shown in the natal chart. A strong natal chart with a weak Varshaphal means a generally good life with a challenging year, not the reverse.
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'के.पी. पद्धति — कृष्णमूर्ति पद्धति' : 'KP System — Krishnamurti Paddhati'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The KP System was developed by Prof. K.S. Krishnamurti (1908-1972) as a refined, precise approach to astrological prediction. Its fundamental innovation is the concept of the Sub Lord — a further subdivision of each nakshatra into 9 unequal parts (following Vimshottari Dasha proportions) that provides a level of precision impossible in traditional systems. KP uses the Placidus house system (unequal houses) instead of the Vedic equal-house system, producing house cusps that vary based on geographic latitude.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          के.पी. पद्धति प्रो. के.एस. कृष्णमूर्ति (1908-1972) द्वारा ज्योतिषीय भविष्यवाणी के एक परिष्कृत, सटीक दृष्टिकोण के रूप में विकसित की गई। इसका मूलभूत नवाचार उप स्वामी की अवधारणा है — प्रत्येक नक्षत्र का 9 असमान भागों में (विंशोत्तरी दशा अनुपातों के अनुसार) आगे उपविभाजन जो पारम्परिक पद्धतियों में असम्भव सटीकता प्रदान करता है। के.पी. वैदिक समभाव पद्धति के बजाय प्लेसिडस भाव पद्धति (असमान भाव) प्रयोग करती है, जो भौगोलिक अक्षांश के आधार पर भिन्न भावमुख उत्पन्न करती है।
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>249 उप-स्वामी सारणी के.पी. का विशिष्ट उपकरण है। सम्पूर्ण राशिचक्र (360 अंश) 27 नक्षत्रों में विभक्त है, प्रत्येक दशा अनुपात के अनुसार 9 उपविभाजनों में आगे विभक्त: केतु (नक्षत्र का 7/120), शुक्र (20/120), सूर्य (6/120), चन्द्र (10/120), मंगल (7/120), राहु (18/120), गुरु (16/120), शनि (19/120), बुध (17/120)। यह 249 अनूठी उप-स्वामी स्थितियाँ उत्पन्न करता है। राशिचक्र के किसी भी अंश के लिए आप तुरन्त इसके राशि स्वामी, नक्षत्र स्वामी और उप स्वामी — ग्रहीय प्रभाव की तीन परतें — पहचान सकते हैं।</>

            : <>The 249 Sub-Lord Table is KP&apos;s signature tool. The entire zodiac (360 degrees) is divided into 27 nakshatras, each further divided into 9 sub-divisions following the Dasha proportion: Ketu (7/120 of the nakshatra), Venus (20/120), Sun (6/120), Moon (10/120), Mars (7/120), Rahu (18/120), Jupiter (16/120), Saturn (19/120), Mercury (17/120). This produces 249 unique sub-lord positions. For any degree of the zodiac, you can instantly identify its Sign Lord, Star Lord (nakshatra lord), and Sub Lord — three layers of planetary influence.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Sub Lord Decides', hi: 'उप स्वामी निर्णय करता है', sa: 'उप स्वामी निर्णय करता है' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <>के.पी. का क्रान्तिकारी सिद्धान्त: &quot;भावमुख का उप स्वामी निर्णय करता है कि उस भाव का फलादेश प्रकट होगा या नहीं।&quot; उदाहरणार्थ, 7वें भाव के भावमुख का उप स्वामी निर्धारित करता है कि विवाह होगा या नहीं। यदि 7वें भावमुख का उप स्वामी भाव 2, 7 और 11 (विवाह-सहायक भाव) का सूचक है, तो विवाह का वचन है। यदि यह भाव 1, 6 या 10 (विवाह के लिए निषेध भाव) का सूचक है, तो अन्य कुण्डली कारकों की परवाह किए बिना विवाह में गम्भीर बाधाएँ हैं।</>

            : <>KP&apos;s revolutionary principle: &quot;The Sub Lord of a cusp decides whether the signification of that house will manifest or not.&quot; For example, the 7th house cusp Sub Lord determines whether marriage will happen. If the 7th cusp Sub Lord is a significator of houses 2, 7, and 11 (marriage-supportive houses), marriage is promised. If it signifies houses 1, 6, or 10 (denial houses for marriage), marriage faces serious obstacles regardless of other chart factors.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Ruling Planets for Timing', hi: 'समयनिर्धारण हेतु शासक ग्रह', sa: 'समयनिर्धारण हेतु शासक ग्रह' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <>शासक ग्रह विधि के.पी. का सबसे शक्तिशाली समयनिर्धारण उपकरण है। विश्लेषण के क्षण वर्तमान लग्न और वर्तमान चन्द्रमा दोनों के राशि स्वामी, नक्षत्र स्वामी और उप स्वामी नोट करें। ये 4-6 ग्रह (कुछ दोहरा सकते हैं) &quot;शासक ग्रह&quot; हैं। कुण्डली में सूचित घटना उन ग्रहों की दशा/भुक्ति/अन्तरा में प्रकट होगी जो इन शासक ग्रहों में दिखाई देते हैं। यह उल्लेखनीय समयनिर्धारण सटीकता बनाता है — प्रायः घटनाओं को विशिष्ट सप्ताहों तक इंगित करता है। हमारे वर्षफल और के.पी. टूल इन गणनाओं को स्वचालित करते हैं — ताजिक योग, सहम, मुद्दा दशा, और 249 उप-स्वामी सारणी सब अन्तर्निर्मित हैं।</>

            : <>The Ruling Planets method is KP&apos;s most powerful timing tool. At the moment of analysis, note the Sign lord, Star lord, and Sub lord of both the current Ascendant and the current Moon. These 4-6 planets (some may repeat) are the &quot;ruling planets.&quot; An event signified in the chart will manifest during the dasha/bhukti/antara of planets that appear among these ruling planets. This creates remarkable timing precision — often pinpointing events to specific weeks.</>}

        </p>
      </section>
    </div>
  );
}

export default function Module15_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
