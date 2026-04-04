'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crosshair, Star, HeartPulse, Baby, Compass, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

// ─── Trilingual Labels ────────────────────────────────────────────────────────
const L = {
  title: { en: 'Sphutas — Sensitive Points', hi: 'स्फुट — संवेदनशील बिन्दु', sa: 'स्फुटाः — संवेदनशीलबिन्दवः' },
  subtitle: {
    en: 'Sphutas are mathematically computed sensitive points in the birth chart — NOT actual planets. Think of them as "cosmic GPS coordinates" for specific life dimensions. They reveal hidden patterns invisible to standard planetary analysis: your luckiest point, your most vulnerable degree, your vitality signature, and fertility indicators.',
    hi: 'स्फुट जन्म कुण्डली में गणितीय रूप से गणना किए गए संवेदनशील बिन्दु हैं — वास्तविक ग्रह नहीं। इन्हें विशिष्ट जीवन आयामों के "ब्रह्माण्डीय GPS निर्देशांक" समझें। ये मानक ग्रहीय विश्लेषण से अदृश्य छिपे प्रतिरूप प्रकट करते हैं: आपका सबसे भाग्यशाली बिन्दु, सबसे संवेदनशील अंश, जीवनशक्ति हस्ताक्षर और प्रजनन सूचक।',
    sa: 'स्फुटाः जन्मकुण्डल्यां गणितीयरूपेण गणिताः संवेदनशीलबिन्दवः — वास्तविकग्रहाः न। जीवनस्य विशिष्टायामानां "ब्रह्माण्डीय-GPS-निर्देशाङ्काः" इव।',
  },

  whatTitle: { en: 'What are Sphutas?', hi: 'स्फुट क्या हैं?', sa: 'स्फुटाः के?' },
  whatP1: {
    en: 'In Vedic astrology, a Sphuta (literally "made clear" or "calculated point") is a mathematical derivative computed from the longitudes of two or more planets. Unlike planets which have physical existence and observable motion, Sphutas are abstract points that serve as sensitive indicators for specific life themes. They exist only in the mathematical model of the chart, yet their predictive value — especially for transit timing — is remarkably precise.',
    hi: 'वैदिक ज्योतिष में, स्फुट (शाब्दिक अर्थ "स्पष्ट किया गया" या "गणित बिन्दु") दो या अधिक ग्रहों के देशान्तरों से गणना किया गया गणितीय व्युत्पन्न है। भौतिक ग्रहों के विपरीत, स्फुट अमूर्त बिन्दु हैं जो विशिष्ट जीवन विषयों के संवेदनशील सूचक हैं। ये केवल कुण्डली के गणितीय मॉडल में विद्यमान हैं, फिर भी इनका भविष्यवाणी मूल्य — विशेषकर गोचर समय — उल्लेखनीय रूप से सटीक है।',
    sa: 'ज्योतिषे स्फुटः द्वयोः बहूनां वा ग्रहाणां देशान्तरेभ्यः गणितः गणितीयव्युत्पन्नः। अमूर्तबिन्दवः विशिष्टजीवनविषयाणां संवेदनशीलसूचकाः।',
  },
  whatP2: {
    en: 'The concept is similar to Arabic Parts (Lots) in Western astrology, but the Vedic system, codified in BPHS and Jaimini Sutras, uses different formulas and interpretation methods. The most important Sphutas fall into three categories: the Yogi/Avayogi pair (fortune/misfortune axis), Constitutional Sphutas (health and vitality), and Fertility Sphutas (procreation indicators).',
    hi: 'अवधारणा पश्चिमी ज्योतिष के अरबी भागों (Lots) के समान है, किन्तु BPHS और जैमिनी सूत्रों में संहिताबद्ध वैदिक प्रणाली भिन्न सूत्रों और व्याख्या विधियों का उपयोग करती है। सबसे महत्वपूर्ण स्फुट तीन श्रेणियों में आते हैं: योगी/अवयोगी जोड़ी, संवैधानिक स्फुट (स्वास्थ्य), और प्रजनन स्फुट।',
    sa: 'अवधारणा पश्चिमज्योतिषस्य अरबीयभागैः (Lots) समाना, किन्तु वैदिकप्रणाली भिन्नसूत्राणि व्याख्याविधीश्च प्रयुङ्क्ते।',
  },

  yogiTitle: { en: 'The Key Pair: Yogi & Avayogi', hi: 'प्रमुख जोड़ी: योगी और अवयोगी', sa: 'प्रमुखयुग्मम्: योगी अवयोगी च' },
  yogiDesc: {
    en: 'The Yogi Point and Avayogi Point form the most important Sphuta pair — they define your personal axis of maximum fortune and maximum challenge.',
    hi: 'योगी बिन्दु और अवयोगी बिन्दु सबसे महत्वपूर्ण स्फुट जोड़ी बनाते हैं — ये आपकी अधिकतम भाग्य और अधिकतम चुनौती की व्यक्तिगत अक्ष परिभाषित करते हैं।',
    sa: 'योगिबिन्दुः अवयोगिबिन्दुश्च महत्तमं स्फुटयुग्मं निर्मातः — अधिकतमभाग्यस्य अधिकतमकठिनतायाश्च व्यक्तिगतम् अक्षं परिभाषयतः।',
  },

  yogiPointTitle: { en: 'Yogi Point', hi: 'योगी बिन्दु', sa: 'योगिबिन्दुः' },
  yogiPointDesc: {
    en: 'The most auspicious degree in your entire chart. Any planet conjunct or transiting this point brings extraordinary luck.',
    hi: 'आपकी सम्पूर्ण कुण्डली का सबसे शुभ अंश। इस बिन्दु पर कोई ग्रह युति या गोचर असाधारण भाग्य लाता है।',
    sa: 'सम्पूर्णकुण्डल्याः शुभतमः अंशः। अत्र कोऽपि ग्रहः असाधारणभाग्यम् आनयति।',
  },
  yogiFormula: {
    en: 'Yogi Point = Sun longitude + Moon longitude + 93°20\'',
    hi: 'योगी बिन्दु = सूर्य देशान्तर + चन्द्र देशान्तर + 93°20\'',
    sa: 'योगिबिन्दुः = सूर्यदेशान्तरम् + चन्द्रदेशान्तरम् + 93°20\'',
  },
  yogiDetails: [
    { label: { en: 'Yogi Planet', hi: 'योगी ग्रह', sa: 'योगिग्रहः' }, desc: { en: 'The lord of the Nakshatra in which the Yogi Point falls. This planet is your MOST auspicious graha — strengthening it through gemstones, mantras, and favorable placement amplifies luck exponentially.', hi: 'जिस नक्षत्र में योगी बिन्दु पड़ता है उसका स्वामी। यह आपका सर्वाधिक शुभ ग्रह है — रत्न, मन्त्र से सशक्त करने से भाग्य तीव्र।' } },
    { label: { en: 'Duplicate Yogi', hi: 'द्वितीय योगी', sa: 'द्वितीययोगी' }, desc: { en: 'The lord of the sign in which the Yogi Point falls. A secondary benefactor planet — not as powerful as the Yogi Planet but still highly favorable.', hi: 'जिस राशि में योगी बिन्दु पड़ता है उसका स्वामी। द्वितीयक शुभकारी — योगी ग्रह जितना शक्तिशाली नहीं पर अत्यन्त अनुकूल।' } },
  ],

  avayogiTitle: { en: 'Avayogi Point', hi: 'अवयोगी बिन्दु', sa: 'अवयोगिबिन्दुः' },
  avayogiDesc: {
    en: 'The most challenging degree in your chart — the opposite pole to the Yogi. Transits over this point trigger difficulties.',
    hi: 'आपकी कुण्डली का सबसे चुनौतीपूर्ण अंश — योगी का विपरीत ध्रुव। इस बिन्दु पर गोचर कठिनाइयाँ उत्पन्न करते हैं।',
    sa: 'कुण्डल्याः कठिनतमः अंशः — योगिनः विपरीतध्रुवः।',
  },
  avayogiFormula: {
    en: 'Avayogi Point = Yogi Point + 186°40\'',
    hi: 'अवयोगी बिन्दु = योगी बिन्दु + 186°40\'',
    sa: 'अवयोगिबिन्दुः = योगिबिन्दुः + 186°40\'',
  },
  avayogiDetails: [
    { label: { en: 'Avayogi Planet', hi: 'अवयोगी ग्रह', sa: 'अवयोगिग्रहः' }, desc: { en: 'The lord of the Nakshatra containing the Avayogi Point. Your MOST challenging graha. Its dasha periods require caution; its transits over sensitive chart points coincide with setbacks. Remedies for this planet are essential.', hi: 'अवयोगी बिन्दु वाले नक्षत्र का स्वामी। सबसे चुनौतीपूर्ण ग्रह। इसकी दशा में सावधानी; संवेदनशील बिन्दुओं पर गोचर में बाधाएं। उपचार आवश्यक।' } },
  ],

  yogiTransitTitle: { en: 'Key Transit Triggers', hi: 'प्रमुख गोचर प्रभाव', sa: 'प्रमुखगोचरप्रभावाः' },
  yogiTransits: [
    { trigger: { en: 'Jupiter transits Yogi Point (within 5°)', hi: 'गुरु का योगी बिन्दु पर गोचर (5° के भीतर)' }, effect: { en: 'Major positive life event — promotion, windfall, marriage, spiritual breakthrough. The best transit you can have.', hi: 'जीवन की प्रमुख सकारात्मक घटना — पदोन्नति, अचानक धन, विवाह, आध्यात्मिक सफलता। सबसे शुभ गोचर।' }, color: 'text-emerald-400' },
    { trigger: { en: 'Saturn transits Avayogi Point', hi: 'शनि का अवयोगी बिन्दु पर गोचर' }, effect: { en: 'Major challenge period — career setback, health crisis, relationship strain. Prepare with remedies months in advance.', hi: 'प्रमुख चुनौती काल — करियर बाधा, स्वास्थ्य संकट, सम्बन्ध तनाव। महीनों पहले उपचार से तैयारी।' }, color: 'text-red-400' },
    { trigger: { en: 'Rahu transits Yogi Point', hi: 'राहु का योगी बिन्दु पर गोचर' }, effect: { en: 'Unconventional luck — foreign opportunity, technology windfall, sudden fame through unusual means.', hi: 'अपरम्परागत भाग्य — विदेश अवसर, प्रौद्योगिकी लाभ, असामान्य मार्ग से अचानक यश।' }, color: 'text-violet-400' },
    { trigger: { en: 'Mars transits Avayogi Point', hi: 'मंगल का अवयोगी बिन्दु पर गोचर' }, effect: { en: 'Short, sharp conflict — accident risk, argument, surgery. Usually passes within a week but can be intense.', hi: 'संक्षिप्त, तीव्र संघर्ष — दुर्घटना जोखिम, विवाद, शल्यक्रिया। प्रायः सप्ताह में बीतता है पर तीव्र।' }, color: 'text-orange-400' },
  ],

  constitutionalTitle: { en: 'Constitutional Sphutas', hi: 'संवैधानिक स्फुट', sa: 'संवैधानिकस्फुटाः' },
  constitutionalDesc: {
    en: 'These Sphutas map the native\'s physical constitution, vitality, and longevity patterns. They are particularly valuable in medical astrology (Ayurvedic Jyotish) for understanding inherent health tendencies.',
    hi: 'ये स्फुट जातक की शारीरिक संरचना, जीवनशक्ति और दीर्घायु प्रतिरूपों का मानचित्रण करते हैं। चिकित्सा ज्योतिष (आयुर्वेदिक ज्योतिष) में अन्तर्निहित स्वास्थ्य प्रवृत्तियों को समझने के लिए विशेष मूल्यवान।',
    sa: 'एते स्फुटाः जातकस्य शारीरिकसंरचनां जीवनशक्तिं दीर्घायुप्रतिरूपांश्च मापयन्ति।',
  },
  constitutionalSphutas: [
    { name: { en: 'Prana Sphuta (Vitality)', hi: 'प्राण स्फुट (जीवनशक्ति)', sa: 'प्राणस्फुटः' }, formula: { en: 'Sun + Moon + Lagna (all longitudes)', hi: 'सूर्य + चन्द्र + लग्न (सभी देशान्तर)' }, interpretation: { en: 'Indicates the fundamental life force. Its Nakshatra reveals your energy type. Transits over this point affect vitality directly — Jupiter crossing it boosts health, Saturn crossing it drains energy. Strong Prana Sphuta in a benefic Nakshatra = robust constitution.', hi: 'मूलभूत जीवन शक्ति सूचित करता है। इसका नक्षत्र आपकी ऊर्जा प्रकार बताता है। इस बिन्दु पर गोचर जीवनशक्ति को सीधे प्रभावित करता है — गुरु स्वास्थ्य बढ़ाता है, शनि ऊर्जा घटाता है।' }, color: 'text-amber-400' },
    { name: { en: 'Deha Sphuta (Body)', hi: 'देह स्फुट (शरीर)', sa: 'देहस्फुटः' }, formula: { en: 'Complex calculation involving Moon, Lagna, and Gulika', hi: 'चन्द्र, लग्न और गुलिक की जटिल गणना' }, interpretation: { en: 'Maps the physical constitution — Ayurvedic body type (Vata/Pitta/Kapha) tendencies. Its sign placement indicates which body systems are strongest and which are vulnerable. Used in conjunction with Prana Sphuta for comprehensive health assessment.', hi: 'शारीरिक संरचना का मानचित्रण — आयुर्वेदिक शरीर प्रकार (वात/पित्त/कफ) प्रवृत्तियाँ। राशि स्थिति सबसे मजबूत और संवेदनशील शारीरिक प्रणालियों को सूचित करती है।' }, color: 'text-emerald-400' },
    { name: { en: 'Mrityu Sphuta (Longevity)', hi: 'मृत्यु स्फुट (दीर्घायु)', sa: 'मृत्युस्फुटः' }, formula: { en: 'Derived from Mars, Saturn, and 8th house cusp', hi: 'मंगल, शनि और 8वें भाव मध्य से व्युत्पन्न' }, interpretation: { en: 'IMPORTANT: This is NOT a death prediction — it is a health sensitivity indicator. It shows the zodiacal degree most sensitive to health challenges. When malefic transits cross this point, the native should be extra cautious about health. Benefic transits over it provide health protection.', hi: 'महत्वपूर्ण: यह मृत्यु भविष्यवाणी नहीं — स्वास्थ्य संवेदनशीलता सूचक है। पापग्रह गोचर इस बिन्दु पर स्वास्थ्य सावधानी सूचित करते हैं। शुभ गोचर स्वास्थ्य रक्षा प्रदान करते हैं।' }, color: 'text-red-400' },
    { name: { en: 'Tri Sphuta (Composite)', hi: 'त्रि स्फुट (संयुक्त)', sa: 'त्रिस्फुटः' }, formula: { en: 'Prana + Deha + Mrityu (synthesized)', hi: 'प्राण + देह + मृत्यु (संश्लेषित)' }, interpretation: { en: 'The grand composite of all three constitutional indicators. Its Nakshatra placement gives a single-point summary of your overall physical karma. Used in Prashna (horary) for quick health assessment — the Nakshatra lord of Tri Sphuta indicates which planet holds the key to the querent\'s health.', hi: 'तीनों संवैधानिक सूचकों का विशाल संयुक्त। इसकी नक्षत्र स्थिति आपके समग्र शारीरिक कर्म का एक-बिन्दु सारांश देती है। प्रश्न में त्वरित स्वास्थ्य आकलन के लिए प्रयुक्त।' }, color: 'text-cyan-400' },
  ],

  fertilityTitle: { en: 'Fertility Sphutas', hi: 'प्रजनन स्फुट', sa: 'प्रजननस्फुटाः' },
  fertilityDesc: {
    en: 'Ancient Vedic astrologers developed specific Sphutas for assessing procreative potential. These are used in compatibility analysis (matching) and in timing for conception attempts.',
    hi: 'प्राचीन वैदिक ज्योतिषियों ने प्रजनन क्षमता के आकलन के लिए विशिष्ट स्फुट विकसित किए। ये अनुकूलता विश्लेषण (मिलान) और गर्भधारण प्रयास के समय-निर्धारण में प्रयुक्त।',
    sa: 'प्राचीनवैदिकज्योतिषिणः प्रजननक्षमतायाः आकलनार्थं विशिष्टस्फुटान् विकसितवन्तः।',
  },
  fertilitySphutas: [
    { name: { en: 'Bija Sphuta (Male Seed)', hi: 'बीज स्फुट (पुरुष)', sa: 'बीजस्फुटः' }, formula: { en: 'Sun + Venus + Jupiter (all longitudes)', hi: 'सूर्य + शुक्र + गुरु (सभी देशान्तर)' }, interpretation: { en: 'Indicates male reproductive potential. When the Bija Sphuta falls in an odd sign (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius) AND in a benefic Nakshatra, male fertility is favorable. Even sign or malefic Nakshatra suggests challenges that may require medical attention.', hi: 'पुरुष प्रजनन क्षमता सूचित करता है। जब बीज स्फुट विषम राशि (मेष, मिथुन, सिंह, तुला, धनु, कुम्भ) में और शुभ नक्षत्र में हो — अनुकूल। सम राशि या पाप नक्षत्र में चुनौतियाँ।' }, color: 'text-blue-400' },
    { name: { en: 'Kshetra Sphuta (Female Field)', hi: 'क्षेत्र स्फुट (स्त्री)', sa: 'क्षेत्रस्फुटः' }, formula: { en: 'Moon + Mars + Jupiter (all longitudes)', hi: 'चन्द्र + मंगल + गुरु (सभी देशान्तर)' }, interpretation: { en: 'Indicates female reproductive potential. When the Kshetra Sphuta falls in an even sign (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces) AND in a benefic Nakshatra, female fertility is favorable. The condition of the 5th house and Jupiter should be assessed alongside this Sphuta for a complete fertility picture.', hi: 'स्त्री प्रजनन क्षमता सूचित करता है। जब क्षेत्र स्फुट सम राशि (वृषभ, कर्क, कन्या, वृश्चिक, मकर, मीन) में और शुभ नक्षत्र में हो — अनुकूल। सम्पूर्ण प्रजनन चित्र के लिए 5वें भाव और गुरु भी देखें।' }, color: 'text-pink-400' },
  ],

  howToTitle: { en: 'How to Use Sphutas in Practice', hi: 'व्यवहार में स्फुटों का उपयोग', sa: 'व्यवहारे स्फुटानाम् उपयोगः' },
  howToPoints: [
    { point: { en: 'Keep your Yogi Planet strong', hi: 'योगी ग्रह को बलवान रखें' }, detail: { en: 'Wear its gemstone (after consultation), recite its mantra, honor its day of the week, and strengthen the house it occupies in your chart. This single action amplifies overall chart luck more than any other remedy.', hi: 'इसका रत्न पहनें (परामर्श के बाद), मन्त्र जपें, सप्ताह का दिन सम्मानित करें। यह एक कार्य समग्र कुण्डली भाग्य को अन्य किसी उपचार से अधिक बढ़ाता है।' } },
    { point: { en: 'Be cautious during Avayogi dasha', hi: 'अवयोगी दशा में सावधान रहें' }, detail: { en: 'When the Avayogi Planet\'s Vimshottari dasha or antardasha is running, major decisions should be made with extra care. Avoid starting new ventures, signing contracts, or making permanent commitments during the Avayogi antardasha if possible.', hi: 'जब अवयोगी ग्रह की विंशोत्तरी दशा या अन्तर्दशा चल रही हो, प्रमुख निर्णय अतिरिक्त सावधानी से लें। अवयोगी अन्तर्दशा में नई शुरुआत, अनुबन्ध, स्थायी प्रतिबद्धताएं यथासम्भव टालें।' } },
    { point: { en: 'Jupiter within 5° of Yogi = best transit', hi: 'गुरु योगी से 5° के भीतर = सर्वोत्तम गोचर' }, detail: { en: 'Track when transiting Jupiter will cross your Yogi Point degree. This transit occurs approximately once every 12 years and lasts several weeks. Plan major life events (marriage, business launch, house purchase) to coincide with this window.', hi: 'जानें कि गोचर गुरु आपके योगी बिन्दु अंश को कब पार करेगा। यह गोचर लगभग हर 12 वर्ष में होता है और कई सप्ताह चलता है। प्रमुख जीवन घटनाएं इस समय के साथ मिलाएं।' } },
    { point: { en: 'Monitor Mrityu Sphuta transits for health', hi: 'स्वास्थ्य के लिए मृत्यु स्फुट गोचर देखें' }, detail: { en: 'When Saturn or Mars transit over your Mrityu Sphuta degree (within 2°), take extra health precautions. Schedule check-ups, avoid risky activities, and strengthen immunity. This is preventive wisdom, not fatalism.', hi: 'जब शनि या मंगल आपके मृत्यु स्फुट अंश (2° के भीतर) पर गोचर करें, अतिरिक्त स्वास्थ्य सावधानी बरतें। जाँच करवाएं, जोखिम भरी गतिविधियाँ टालें। यह निवारक ज्ञान है, भाग्यवाद नहीं।' } },
  ],

  exampleTitle: { en: 'Practical Example', hi: 'व्यावहारिक उदाहरण', sa: 'व्यावहारिकोदाहरणम्' },
  exampleContent: {
    en: 'Consider a chart where Sun is at 15° Leo and Moon at 20° Taurus. Yogi Point = 15° + 50° + 93°20\' = 158°20\' = 8°20\' Virgo. The Yogi Nakshatra is Uttara Phalguni (ruled by Sun). So Sun is this person\'s Yogi Planet — keeping Sun strong through Ruby, Surya Namaskar, and honoring Sundays is their #1 luck amplifier. The Avayogi Point = 158°20\' + 186°40\' = 345° = 15° Pisces. Avayogi Nakshatra is Uttara Bhadrapada (ruled by Saturn). Saturn becomes their Avayogi Planet — its dasha periods require extra vigilance.',
    hi: 'एक कुण्डली जहाँ सूर्य 15° सिंह और चन्द्र 20° वृषभ में। योगी बिन्दु = 15° + 50° + 93°20\' = 158°20\' = 8°20\' कन्या। योगी नक्षत्र उत्तरा फाल्गुनी (सूर्य स्वामी)। अतः सूर्य योगी ग्रह — माणिक, सूर्य नमस्कार, रविवार सम्मान = सर्वोत्तम भाग्यवर्धक। अवयोगी बिन्दु = 158°20\' + 186°40\' = 345° = 15° मीन। अवयोगी नक्षत्र उत्तरा भाद्रपद (शनि स्वामी)। शनि अवयोगी ग्रह — दशा में सावधानी।',
    sa: 'कुण्डल्यां सूर्यः 15° सिंहे चन्द्रः 20° वृषभे। योगिबिन्दुः = 8°20\' कन्यायाम्। योगिनक्षत्रम् उत्तराफाल्गुनी (सूर्यस्वामी)।',
  },

  linksTitle: { en: 'Continue Learning', hi: 'आगे पढ़ें', sa: 'अग्रे पठत' },
};

export default function LearnSphutasPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const t = (obj: Record<string, string>) => obj[locale] || obj.en;
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedConst, setExpandedConst] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>{t(L.title)}</h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">{t(L.subtitle)}</p>
      </motion.div>

      {/* ═══ What are Sphutas ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.whatTitle)}</h2>
        <p className="text-text-secondary leading-relaxed">{t(L.whatP1)}</p>
        <p className="text-text-secondary leading-relaxed">{t(L.whatP2)}</p>
      </motion.section>

      {/* ═══ Yogi & Avayogi ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t(L.yogiTitle)}</h2>
        <p className="text-text-secondary leading-relaxed">{t(L.yogiDesc)}</p>

        {/* Yogi Point */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-emerald-400" style={headingFont}>{t(L.yogiPointTitle)}</h3>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{t(L.yogiPointDesc)}</p>
          <div className="p-3 bg-bg-primary/50 rounded-lg border border-emerald-500/10">
            <p className="text-emerald-400 font-mono text-sm">{t(L.yogiFormula)}</p>
          </div>
          {L.yogiDetails.map((d, i) => (
            <div key={i} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="text-emerald-400 font-bold text-sm mb-1">{t(d.label)}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{t(d.desc)}</div>
            </div>
          ))}
        </div>

        {/* Avayogi Point */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-red-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-bold text-red-400" style={headingFont}>{t(L.avayogiTitle)}</h3>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{t(L.avayogiDesc)}</p>
          <div className="p-3 bg-bg-primary/50 rounded-lg border border-red-500/10">
            <p className="text-red-400 font-mono text-sm">{t(L.avayogiFormula)}</p>
          </div>
          {L.avayogiDetails.map((d, i) => (
            <div key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
              <div className="text-red-400 font-bold text-sm mb-1">{t(d.label)}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{t(d.desc)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Transit Triggers ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.yogiTransitTitle)}</h2>
        <div className="space-y-3">
          {L.yogiTransits.map((tr, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-secondary/50 border border-gold-primary/8">
              <div className={`font-bold text-sm mb-1 ${tr.color}`}>{t(tr.trigger)}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{t(tr.effect)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Constitutional Sphutas ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t(L.constitutionalTitle)}</h2>
        <p className="text-text-secondary leading-relaxed">{t(L.constitutionalDesc)}</p>
        {L.constitutionalSphutas.map((sp, i) => {
          const isExp = expandedConst === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedConst(isExp ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <HeartPulse className={`w-5 h-5 ${sp.color}`} />
                  <span className={`font-bold ${sp.color}`} style={headingFont}>{t(sp.name)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isExp ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-5 space-y-3 border-t border-gold-primary/10 pt-4">
                      <div className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
                        <span className="text-gold-dark text-[10px] uppercase tracking-widest font-bold">{isHi ? 'सूत्र' : 'Formula'}: </span>
                        <span className="text-gold-light font-mono text-sm">{t(sp.formula)}</span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{t(sp.interpretation)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ Fertility Sphutas ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Baby className="w-6 h-6 text-pink-400" />
          <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.fertilityTitle)}</h2>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{t(L.fertilityDesc)}</p>
        {L.fertilitySphutas.map((sp, i) => (
          <div key={i} className={`p-4 rounded-xl border ${sp.color === 'text-blue-400' ? 'border-blue-500/15 bg-blue-500/5' : 'border-pink-500/15 bg-pink-500/5'}`}>
            <div className={`font-bold text-sm mb-1 ${sp.color}`}>{t(sp.name)}</div>
            <div className="p-2 bg-bg-primary/30 rounded-lg mb-2">
              <span className="text-gold-dark text-[10px] uppercase tracking-widest font-bold">{isHi ? 'सूत्र' : 'Formula'}: </span>
              <span className="text-gold-light font-mono text-xs">{t(sp.formula)}</span>
            </div>
            <div className="text-text-secondary text-xs leading-relaxed">{t(sp.interpretation)}</div>
          </div>
        ))}
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <p className="text-amber-400 text-xs leading-relaxed">
            {isHi
              ? 'नोट: विषम राशि + शुभ नक्षत्र = अनुकूल (बीज); सम राशि + शुभ नक्षत्र = अनुकूल (क्षेत्र)। दोनों स्फुट अनुकूल होने पर दम्पति की प्रजनन क्षमता प्रबल मानी जाती है।'
              : 'Note: Odd sign + benefic Nakshatra = favorable (Bija); Even sign + benefic Nakshatra = favorable (Kshetra). When both Sphutas are favorable, the couple\'s collective fertility is considered strong.'}
          </p>
        </div>
      </motion.section>

      {/* ═══ How to Use ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.howToTitle)}</h2>
        <div className="space-y-3">
          {L.howToPoints.map((hp, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-secondary/50 border border-gold-primary/8">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-gold-primary font-bold text-sm">{i + 1}.</span>
                <span className="text-gold-light font-bold text-sm">{t(hp.point)}</span>
              </div>
              <div className="text-text-secondary text-xs leading-relaxed pl-5">{t(hp.detail)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Practical Example ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.exampleTitle)}</h2>
        <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-text-secondary text-sm leading-relaxed">{t(L.exampleContent)}</p>
        </div>
      </motion.section>

      {/* ═══ Links ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{t(L.linksTitle)}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं' } },
            { href: '/learn/modules/23-4', label: { en: 'Module 23-4: Sphutas Deep Dive', hi: 'मॉड्यूल 23-4: स्फुट विस्तार' } },
            { href: '/learn/shadbala', label: { en: 'Shadbala (Planet Strength)', hi: 'षड्बल (ग्रह शक्ति)' } },
            { href: '/learn/avasthas', label: { en: 'Avasthas (Planet States)', hi: 'अवस्थाएं (ग्रह दशाएं)' } },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {t(link.label)} &rarr;
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
