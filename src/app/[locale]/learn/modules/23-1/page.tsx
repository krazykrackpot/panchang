'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/23-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_23_1', phase: 10, topic: 'Prediction', moduleNumber: '23.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

/* ─── Page 1: Eclipse Mechanics ────────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'Eclipses happen when the Sun or Moon is near Rahu or Ketu (the lunar nodes) — solar eclipses at new moon, lunar eclipses at full moon.',
          'Not every new/full moon causes an eclipse — the Moon\'s orbit is tilted 5 degrees, so alignment only happens near the nodes.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'ग्रहण यांत्रिकी — सूर्य, चन्द्र और राहु-केतु' : 'Eclipse Mechanics — Sun, Moon & Nodes'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहण तब होते हैं जब सूर्य और चन्द्रमा राहु-केतु अक्ष के निकट होते हैं — वे दो बिन्दु जहाँ चन्द्रमा का कक्षीय तल क्रान्तिवृत्त को काटता है। यह अक्ष कोई भौतिक वस्तु नहीं बल्कि एक ज्यामितीय बिन्दु है, और प्राचीन भारतीय खगोलविदों ने दूरबीनों के अस्तित्व से हजारों वर्ष पहले इसके महत्व को पहचान लिया था।</> : <>Eclipses occur when the Sun and Moon are near the Rahu-Ketu axis — the two points where the Moon&apos;s orbital plane intersects the ecliptic. This axis is not a physical object but a geometrical point, and ancient Indian astronomers recognized its importance thousands of years before telescopes existed.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Solar Eclipse (Surya Grahan)', hi: 'सूर्य ग्रहण', sa: 'सूर्य ग्रहण' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>अमावस्या पर होता है जब चन्द्रमा सूर्य और पृथ्वी के बीच से गुजरता है। चन्द्रमा सूर्य के प्रकाश को रोकता है। यह केवल तब होता है जब अमावस्या राहु या केतु से लगभग 15° के भीतर हो। प्रकार: पूर्ण (चन्द्रमा सूर्य को पूरी तरह ढकता है), वलयाकार (चन्द्रमा थोड़ा छोटा, एक वलय बनाता है), आंशिक (आंशिक आच्छादन)।</> : <>Occurs at New Moon (Amavasya) when the Moon passes between the Sun and Earth. The Moon blocks the Sun&apos;s light. This only happens when the New Moon is within approximately 15° of Rahu or Ketu. Types: total (Moon fully covers Sun), annular (Moon slightly smaller, creating a ring), partial (partial coverage).</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Lunar Eclipse (Chandra Grahan)', hi: 'चन्द्र ग्रहण', sa: 'चन्द्र ग्रहण' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>पूर्णिमा पर होता है जब पृथ्वी सूर्य और चन्द्रमा के बीच आती है। पृथ्वी की छाया चन्द्रमा पर पड़ती है। पूर्णिमा का नोड से लगभग 18° के भीतर होना आवश्यक है। व्यापक सीमा (सूर्य ग्रहण के 15° की तुलना में) इसलिए है क्योंकि पृथ्वी की छाया चन्द्रमा से बड़ी है। चन्द्र ग्रहण पृथ्वी के सम्पूर्ण रात्रि पक्ष से दिखाई देते हैं।</> : <>Occurs at Full Moon (Purnima) when the Earth passes between the Sun and Moon. Earth&apos;s shadow falls on the Moon. Requires the Full Moon to be within approximately 18° of a node. The wider threshold (vs. 15° for solar) is because Earth&apos;s shadow is larger than the Moon&apos;s. Lunar eclipses are visible from the entire nightside of Earth.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Eclipse Frequency', hi: 'ग्रहण आवृत्ति', sa: 'ग्रहण आवृत्ति' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>विश्व भर में प्रति वर्ष लगभग 4-7 ग्रहण होते हैं — सूर्य और चन्द्र का मिश्रण। हालाँकि, किसी भी स्थान से आमतौर पर केवल 2-3 दिखाई देते हैं। ग्रहण लगभग 6 महीने के अन्तराल पर &quot;ऋतुओं&quot; में आते हैं, जब सूर्य नोडल अक्ष के निकट होता है। प्रत्येक ऋतु कुछ सप्ताहों में 2-3 ग्रहण उत्पन्न करती है।</> : <>There are approximately 4-7 eclipses per year globally — a mix of solar and lunar. However, only 2-3 are typically visible from any given location. Eclipses come in &quot;seasons&quot; about 6 months apart, when the Sun is near the nodal axis. Each season produces 2-3 eclipses within a few weeks.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Why Not Every New/Full Moon?', hi: 'हर अमावस्या/पूर्णिमा पर क्यों नहीं?', sa: 'हर अमावस्या/पूर्णिमा पर क्यों नहीं?' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चन्द्रमा की कक्षा क्रान्तिवृत्त (सूर्य के दृश्य पथ) से लगभग 5° झुकी हुई है। इसलिए अधिकांश अमावस्या और पूर्णिमा पर, चन्द्रमा सूर्य के तल के ऊपर या नीचे से गुजरता है — कोई संरेखण नहीं, कोई ग्रहण नहीं। केवल जब कोई ल्यूनेशन चन्द्रमा के अपने दो नोड्स (राहु या केतु) में से किसी एक के निकट होने से मेल खाता है, तब संरेखण ग्रहण के लिए पर्याप्त निकट होता है।</> : <>The Moon&apos;s orbit is tilted about 5° relative to the ecliptic (the Sun&apos;s apparent path). So at most New and Full Moons, the Moon passes above or below the Sun&apos;s plane — no alignment, no eclipse. Only when a lunation coincides with the Moon being near one of its two nodes (Rahu or Ketu) does the alignment become close enough for an eclipse.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Prediction Algorithm & Saros Cycle ───────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'ग्रहण भविष्यवाणी एल्गोरिदम' : 'Eclipse Prediction Algorithm'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मूल भविष्यवाणी विधि सुरुचिपूर्ण रूप से सरल है: प्रत्येक अमावस्या और पूर्णिमा पर, सूर्य और राहु (उत्तरी नोड) के बीच कोणीय दूरी की गणना करें। यदि दूरी एक सीमा से नीचे आती है, तो ग्रहण सम्भव है। प्राचीन भारतीय खगोलविदों ने इसे सहस्राब्दियों पहले सूर्य सिद्धान्त एल्गोरिदम में संकलित किया था।</> : <>The core prediction method is elegantly simple: at every New Moon and Full Moon, compute the angular distance between the Sun and Rahu (the ascending node). If the distance falls below a threshold, an eclipse is possible. Ancient Indian astronomers encoded this into Surya Siddhanta algorithms millennia ago.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Step-by-Step Algorithm', hi: 'चरणबद्ध एल्गोरिदम', sa: 'चरणबद्ध एल्गोरिदम' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>1. प्रत्येक अमावस्या/पूर्णिमा पर सूर्य और राहु का देशान्तर गणना करें। 2. कोणीय दूरी गणना करें: |सूर्य_देशान्तर - राहु_देशान्तर|। 3. यदि पूर्णिमा पर और दूरी &lt; 18° → चन्द्र ग्रहण सम्भव। 4. यदि अमावस्या पर और दूरी &lt; 15° → सूर्य ग्रहण सम्भव। 5. अधिक सटीकता के लिए, युति/प्रतियुति के क्षण चन्द्रमा का अक्षांश भी जाँचें।</> : <>1. Compute the Sun&apos;s longitude and Rahu&apos;s longitude at each New/Full Moon. 2. Calculate the angular distance: |Sun_lon - Rahu_lon|. 3. If at Full Moon and distance &lt; 18° → lunar eclipse possible. 4. If at New Moon and distance &lt; 15° → solar eclipse possible. 5. For greater precision, also check the Moon&apos;s latitude at the moment of conjunction/opposition.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'The Saros Cycle', hi: 'सैरोस चक्र', sa: 'सैरोस चक्र' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>ग्रहण एक उल्लेखनीय पैटर्न में दोहराते हैं: प्रत्येक 223 सिनोडिक मास (18 वर्ष, 11 दिन, 8 घण्टे) में, लगभग समान ग्रहण होता है। यह इसलिए होता है क्योंकि 223 सिनोडिक मास के बाद, सूर्य-चन्द्र-नोड ज्यामिति लगभग समान विन्यास में लौटती है। 8 घण्टे का अन्तर का अर्थ है कि प्रत्येक पुनरावृत्ति देशान्तर में ~120° खिसकती है, इसलिए वही ग्रहण विश्व के भिन्न भाग से दिखाई देता है।</> : <>Eclipses repeat in a remarkable pattern: every 223 synodic months (18 years, 11 days, 8 hours), a nearly identical eclipse occurs. This happens because after 223 synodic months, the Sun-Moon-Node geometry returns to almost the same configuration. The 8-hour shift means each repeat moves ~120° in longitude, so the same eclipse is visible from a different part of the world.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Our Engine Implementation', hi: 'हमारे इंजन का कार्यान्वयन', sa: 'हमारे इंजन का कार्यान्वयन' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>हमारा पंचांग इंजन मीयस-सटीकता स्थितियों का उपयोग करके प्रत्येक ल्यूनेशन की नोडल अक्ष से जाँच करता है। प्रत्येक आगामी अमावस्या और पूर्णिमा के लिए, हम सूर्य-राहु दूरी गणना करते हैं और सम्भावित ग्रहणों को चिह्नित करते हैं। हम चन्द्रमा के दृश्य व्यास और कोणीय पृथक्करण के आधार पर ग्रहण प्रकार (सूर्य के लिए पूर्ण/वलयाकार/आंशिक; चन्द्र के लिए पूर्ण/आंशिक/उपच्छायात्मक) भी गणना करते हैं।</> : <>Our Panchang engine checks every lunation against the nodal axis using Meeus-precision positions. For each upcoming New and Full Moon, we compute the Sun-Rahu distance and flag potential eclipses. We also compute the eclipse type (total/annular/partial for solar; total/partial/penumbral for lunar) based on the Moon&apos;s apparent diameter and angular separation.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Historical Precision', hi: 'ऐतिहासिक सटीकता', sa: 'ऐतिहासिक सटीकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>भारतीय खगोलविद सूर्य सिद्धान्त विधियों का उपयोग करके उल्लेखनीय सटीकता से ग्रहणों की भविष्यवाणी कर सकते थे। आर्यभट (5वीं शताब्दी ईस्वी) ने चन्द्रमा के कक्षीय मापदण्डों की इतनी सटीक गणना की कि उनकी ग्रहण भविष्यवाणियाँ वास्तविक घटनाओं से मिनटों के भीतर थीं। नोड प्रत्यागमन अवधि (18.6 वर्ष) सेकण्डों के भीतर ज्ञात थी। आधुनिक एल्गोरिदम केवल उसे परिष्कृत करते हैं जो प्राचीन भारतीय गणित ने स्थापित किया था।</> : <>Indian astronomers could predict eclipses with remarkable accuracy using Surya Siddhanta methods. Aryabhata (5th century CE) computed the Moon&apos;s orbital parameters so precisely that his eclipse predictions were within minutes of actual events. The node regression period (18.6 years) was known to within seconds. Modern algorithms simply refine what ancient Indian mathematics established.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Astrological Significance ────────────────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'ग्रहणों का ज्योतिषीय महत्व' : 'Astrological Significance of Eclipses'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहण आपकी जन्म कुण्डली में गोचर द्वारा जिन भावों में पड़ते हैं उन्हें सक्रिय करते हैं। उनके प्रभाव शक्तिशाली और दीर्घकालिक होते हैं — सूर्य ग्रहण के लिए आमतौर पर 6 महीने और चन्द्र ग्रहण के लिए 3 महीने। ग्रहण का भाव और राशि निर्धारित करते हैं कि कौन सा जीवन क्षेत्र सक्रिय होता है।</> : <>Eclipses activate the houses where they fall by transit in your birth chart. Their effects are potent and long-lasting — typically 6 months for a solar eclipse and 3 months for a lunar eclipse. The house and sign of the eclipse determine which life area is activated.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Eclipse on Natal Moon', hi: 'जन्म चन्द्रमा पर ग्रहण', sa: 'जन्म चन्द्रमा पर ग्रहण' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>आपके जन्म चन्द्रमा पर सूर्य ग्रहण सबसे तीव्र गोचरों में से एक है। यह लगभग 6 महीनों के लिए भावनात्मक उथल-पुथल, आन्तरिक परिवर्तन और भावनात्मक प्रतिमानों का पुनर्स्थापन दर्शाता है। जन्म चन्द्रमा का भाव निर्धारित करता है कि कौन सा जीवन क्षेत्र इस भावनात्मक पुनर्गठन से गुजरता है। जन्म चन्द्रमा पर चन्द्र ग्रहण समान रूप से शक्तिशाली है लेकिन अधिक बाह्य भावनात्मक घटनाओं के रूप में प्रकट होता है।</> : <>A solar eclipse conjunct your natal Moon is one of the most intense transits possible. It indicates emotional upheaval, inner transformation, and a reset of emotional patterns for approximately 6 months. The house of the natal Moon determines which life area undergoes this emotional restructuring. A lunar eclipse on the natal Moon is similarly powerful but manifests more as external emotional events.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'House-Specific Effects', hi: 'भाव-विशिष्ट प्रभाव', sa: 'भाव-विशिष्ट प्रभाव' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>प्रथम भाव: पहचान परिवर्तन। चतुर्थ भाव: गृह/मातृ परिवर्तन। सप्तम भाव: साझेदारी उथल-पुथल। दशम भाव: कैरियर परिवर्तन। द्वितीय/अष्टम अक्ष: आर्थिक बदलाव। पंचम/एकादश अक्ष: संतान, सृजनात्मकता, सामाजिक वृत्त परिवर्तन। षष्ठ/द्वादश अक्ष: स्वास्थ्य और आध्यात्मिक जागरण। अक्ष महत्वपूर्ण है — ग्रहण सदैव विपरीत भावों को एक साथ सक्रिय करते हैं।</> : <>1st house: identity transformation. 4th house: home/mother changes. 7th house: partnership upheaval. 10th house: career change. 2nd/8th axis: financial shifts. 5th/11th axis: children, creativity, social circle changes. 6th/12th axis: health and spiritual awakening. The axis matters — eclipses always activate opposite houses simultaneously.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Eclipse Season & Grahan Dosha', hi: 'ग्रहण ऋतु और ग्रहण दोष', sa: 'ग्रहण ऋतु और ग्रहण दोष' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>&quot;ग्रहण ऋतु&quot; — प्रत्येक ग्रहण के आसपास 2 सप्ताह की अवधि — नये कार्यों (विवाह, व्यापार आरम्भ, गृह खरीद) के लिए अशुभ मानी जाती है। हालाँकि, ग्रहण समाप्ति और पूर्णता के लिए उत्कृष्ट हैं। ग्रहण दोष: ग्रहण के दौरान जन्म विशिष्ट कार्मिक प्रतिमान उत्पन्न करता है। जन्म पर सूर्य-राहु/केतु युति = सूर्य ग्रहण दोष (पहचान/अधिकार चुनौतियाँ)। चन्द्र-राहु/केतु = चन्द्र ग्रहण दोष (भावनात्मक/मानसिक प्रतिमान)।</> : <>The &quot;eclipse season&quot; — the 2-week window around each eclipse — is considered inauspicious for new beginnings (marriage, business launch, house purchase). However, eclipses are excellent for endings and closure. Grahan Dosha: being born during an eclipse creates specific karmic patterns. Sun-Rahu/Ketu conjunction at birth = Surya Grahan Dosha (identity/authority challenges). Moon-Rahu/Ketu = Chandra Grahan Dosha (emotional/mental patterns).</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग', sa: 'व्यावहारिक अनुप्रयोग' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारे ग्रहण पृष्ठ पर आगामी ग्रहणों को ट्रैक करें। ध्यान दें कि वे आपकी जन्म कुण्डली में किस भाव से गोचर करते हैं। ग्रहण काल में प्रमुख शुरुआतें टालें, लेकिन ऊर्जा का उपयोग ध्यान, पुराने प्रतिमानों को छोड़ने और आन्तरिक कार्य के लिए करें। यदि कोई ग्रहण किसी जन्मकालीन ग्रह के 3° के भीतर पड़ता है, तो अगले 6 महीनों में उस ग्रह के कारकत्व से सम्बन्धित महत्वपूर्ण घटनाओं की अपेक्षा करें।</> : <>Track upcoming eclipses on our Grahan page. Note which house they transit in your birth chart. Avoid major initiations during the eclipse season, but use the energy for meditation, releasing old patterns, and inner work. If an eclipse falls within 3° of a natal planet, expect significant events related to that planet&apos;s significations within the following 6 months.</>}</p>
      </section>
    </div>
  );
}

function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'ग्रहण और जन्म कुण्डली — गहन विश्लेषण' : 'Eclipses and the Birth Chart — Deep Analysis'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहण प्रभाव सबसे तीव्र तब होता है जब ग्रहण अंश आपकी जन्म कुण्डली के किसी ग्रह या सन्धि से 3 अंश के भीतर हो। उदाहरण: यदि आपका जन्म चन्द्रमा 15 अंश सिंह पर है और सूर्य ग्रहण 13 अंश सिंह पर होता है, तो यह सीधा आघात है — अगले 6 मास में भावनात्मक क्षेत्र में गहन रूपान्तरण की अपेक्षा करें। ग्रहण लग्न, सूर्य या चन्द्र पर सबसे प्रभावी है; बाह्य ग्रहों (शनि, राहु, केतु) पर कम प्रत्यक्ष।</> : <>Eclipse impact is most intense when the eclipse degree falls within 3 degrees of a natal planet or cusp. Example: if your natal Moon is at 15 degrees Leo and a solar eclipse occurs at 13 degrees Leo, this is a direct hit &mdash; expect profound transformation in the emotional sphere over the following 6 months. Eclipses are most potent on the Lagna, Sun, or Moon; less directly impactful on outer planets (Saturn, Rahu, Ketu).</>}</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example — Eclipse Transit Analysis', hi: 'कार्यान्वित उदाहरण — ग्रहण गोचर विश्लेषण', sa: 'कार्यान्वित उदाहरण — ग्रहण गोचर विश्लेषण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'कुण्डली:' : 'Chart:'}</span> {isHi ? <>मेष लग्न, सूर्य 10 अंश तुला (7वाँ भाव), चन्द्र 22 अंश मीन (12वाँ भाव)।</> : <>Aries Lagna, Sun at 10 degrees Libra (7th house), Moon at 22 degrees Pisces (12th house).</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'ग्रहण:' : 'Eclipse:'}</span> {isHi ? <>सूर्य ग्रहण 12 अंश तुला पर — जन्म सूर्य से 2 अंश। यह 7वें भाव (साझेदारी, विवाह) में सीधा प्रभाव है।</> : <>Solar eclipse at 12 degrees Libra &mdash; within 2 degrees of natal Sun. This directly activates the 7th house (partnerships, marriage).</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">{isHi ? 'फलादेश:' : 'Prediction:'}</span> {isHi ? <>अगले 6 मास में साझेदारी में महत्वपूर्ण परिवर्तन: नई साझेदारी का आरम्भ, मौजूदा सम्बन्ध में मूलभूत पुनर्परिभाषा, या व्यावसायिक सहभागिता में बदलाव। क्योंकि सूर्य = अहंकार/पहचान, ग्रहण जातक की साझेदारी में भूमिका की पुनः खोज को प्रेरित करता है।</> : <>Significant partnership changes within 6 months: new partnership forming, fundamental redefinition of existing relationship, or shift in business collaboration. Since Sun = ego/identity, the eclipse triggers a rediscovery of the native&rsquo;s role within partnerships.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span> {isHi ? <>&quot;ग्रहण के दौरान खाना नहीं खाना चाहिए।&quot; यह अन्धविश्वास है, विज्ञान नहीं। हालाँकि, ग्रहण ध्यान और आत्मचिन्तन के लिए एक शक्तिशाली अवसर है &mdash; कई साधक स्वेच्छा से उपवास रखते हैं, किन्तु यह बाध्यता नहीं बल्कि आध्यात्मिक चयन है।</> : <>&quot;You must not eat during an eclipse.&quot; This is superstition, not science. However, eclipses are powerful opportunities for meditation and introspection &mdash; many practitioners voluntarily fast, but this is a spiritual choice, not an obligation.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span> {isHi ? <>&quot;ग्रहण केवल दृश्य होने पर प्रभावित करता है।&quot; ज्योतिषीय प्रभाव खगोलीय संरेखण पर आधारित है, दृश्यता पर नहीं। आपके स्थान से अदृश्य ग्रहण भी गोचर प्रभाव उत्पन्न करता है क्योंकि सूर्य-चन्द्र-नोड संरेखण वास्तविक है।</> : <>&quot;An eclipse only affects you if it is visible from your location.&quot; The astrological effect is based on the astronomical alignment, not visibility. An eclipse invisible from your location still produces transit effects because the Sun-Moon-Node alignment is real.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span> {isHi ? <>&quot;ग्रहण सदैव नकारात्मक है।&quot; ग्रहण शक्तिशाली हैं, नकारात्मक नहीं। ये उस भाव को &quot;रीसेट&quot; करते हैं जिसमें पड़ते हैं। रीसेट का अर्थ पुराने प्रतिमानों का अन्त और नये का आरम्भ है &mdash; यह दर्दनाक या मुक्तिदायक हो सकता है। अनेक लोग ग्रहणों पर करियर की सबसे बड़ी छलांगें और गहनतम आध्यात्मिक अनुभव रिपोर्ट करते हैं।</> : <>&quot;Eclipses are always negative.&quot; Eclipses are powerful, not negative. They &ldquo;reset&rdquo; the house they activate. A reset means the end of old patterns and the beginning of new ones &mdash; this can be painful or liberating. Many people report their biggest career leaps and deepest spiritual experiences on eclipses.</>}</p>
      </section>
    </div>
  );
}

export default function Module23_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}
