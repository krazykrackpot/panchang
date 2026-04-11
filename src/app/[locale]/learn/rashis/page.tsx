'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { ZodiacBeltDiagram } from '@/components/learn/InteractiveDiagram';
import { RASHIS } from '@/lib/constants/rashis';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ---------- inline bilingual labels ---------- */
const L = {
  title: { en: 'Rashis — The 12 Zodiac Signs', hi: 'राशियाँ — 12 राशिचक्र', sa: 'राशयः — द्वादशराशिचक्रम्' },
  subtitle: {
    en: 'The twelve equal divisions of the sidereal ecliptic that form the foundation of Vedic astrology',
    hi: 'सायन ज्योतिषीय पथ के बारह समान विभाग जो वैदिक ज्योतिष की नींव हैं',
    sa: 'सायनज्योतिषपथस्य द्वादशसमविभागाः ये वैदिकज्योतिषस्य आधारः'
  },

  /* Section 1: What are Rashis */
  whatTitle: { en: 'What is a Rashi?', hi: 'राशि क्या है?', sa: 'राशिः कः?' },
  whatContent: {
    en: 'In Vedic astrology (Jyotish), the zodiac belt — the apparent path of the Sun through the sky — is divided into 12 equal segments of 30 degrees each. Each segment is called a Rashi (sign). Unlike Western astrology which uses the tropical zodiac (tied to the equinoxes), Jyotish uses the sidereal zodiac (tied to fixed stars). The difference between the two, called Ayanamsha, is currently about 24 degrees. This means your Vedic sign is often one sign behind your Western sign.',
    hi: 'वैदिक ज्योतिष (ज्योतिष) में राशिचक्र — आकाश में सूर्य का प्रत्यक्ष पथ — 30-30 अंश के 12 समान खण्डों में विभाजित होता है। प्रत्येक खण्ड को राशि कहते हैं। पश्चिमी ज्योतिष जो सायन राशिचक्र (विषुवों से बँधा) का उपयोग करता है, उसके विपरीत ज्योतिष निरयण राशिचक्र (स्थिर तारों से बँधा) का उपयोग करता है। दोनों के बीच का अन्तर, अयनांश, वर्तमान में लगभग 24 अंश है।',
    sa: 'वैदिकज्योतिषे राशिचक्रम् — आकाशे सूर्यस्य प्रत्यक्षपथः — त्रिंशत्-त्रिंशत् अंशानां द्वादशसमखण्डेषु विभज्यते। प्रत्येकं खण्डं राशिः इति कथ्यते।'
  },
  whatContent2: {
    en: 'Each Rashi carries a unique combination of element (tattva), quality (guna), and planetary lordship that defines its character. When a planet occupies a particular Rashi, it takes on the qualities of that sign — a planet in a fire sign acts differently from the same planet in a water sign. The Rashi where your Moon is placed determines your "Moon sign" (Rashi in everyday usage), which is the primary identity marker in Vedic astrology.',
    hi: 'प्रत्येक राशि में तत्व, गुण और ग्रह स्वामित्व का एक अद्वितीय संयोजन होता है जो उसका चरित्र निर्धारित करता है। जब कोई ग्रह किसी विशेष राशि में स्थित होता है, तो वह उस राशि के गुणों को अपनाता है। जिस राशि में आपका चन्द्रमा स्थित है वह आपकी "राशि" (चन्द्र राशि) निर्धारित करती है, जो वैदिक ज्योतिष में प्राथमिक पहचान चिह्न है।',
    sa: 'प्रत्येकराशौ तत्त्वं, गुणः, ग्रहस्वामित्वं च अद्वितीयसंयोजनेन तस्याः स्वभावं निर्धारयति।'
  },

  /* Section 2: Astronomy */
  astroTitle: { en: 'The Astronomy Behind Rashis', hi: 'राशियों का खगोलशास्त्र', sa: 'राशीनां खगोलशास्त्रम्' },
  astroContent: {
    en: 'The ecliptic is the plane of Earth\'s orbit around the Sun, projected onto the celestial sphere. The Vedic zodiac divides this circle of 360 degrees into 12 equal sectors starting from the star Spica (Chitra) as the reference point for the Lahiri Ayanamsha. Each 30-degree sector is one Rashi. The sidereal position of any celestial body is computed by subtracting the Ayanamsha from its tropical longitude.',
    hi: 'क्रान्तिवृत्त पृथ्वी की सूर्य के चारों ओर कक्षा का तल है, जो खगोलीय गोले पर प्रक्षेपित होता है। वैदिक राशिचक्र इस 360 अंश के वृत्त को चित्रा तारे (Spica) से आरम्भ करके 12 समान खण्डों में बाँटता है। प्रत्येक 30 अंश का खण्ड एक राशि है।',
    sa: 'क्रान्तिवृत्तं पृथिव्याः सूर्यपरिक्रमणकक्षायाः तलम्। वैदिकराशिचक्रम् एतस्य ३६० अंशवृत्तं चित्रातारकात् आरभ्य १२ समखण्डेषु विभजति।'
  },

  /* Section 3: Sign Qualities (Chara/Sthira/Dwiswabhava) */
  qualityTitle: { en: 'Sign Qualities — Chara, Sthira, Dwiswabhava', hi: 'राशि गुण — चर, स्थिर, द्विस्वभाव', sa: 'राशिगुणाः — चरं, स्थिरं, द्विस्वभावम्' },
  qualityIntro: {
    en: 'Every Rashi falls into one of three modalities (qualities) that describe how its energy expresses itself. These qualities cycle through the zodiac in a fixed pattern: Cardinal, Fixed, Mutable, Cardinal, Fixed, Mutable... This classification is crucial for predicting how planets will behave in a given sign.',
    hi: 'प्रत्येक राशि तीन प्रकार (गुणों) में से एक में आती है जो बताती है कि उसकी ऊर्जा कैसे अभिव्यक्त होती है। ये गुण राशिचक्र में एक निश्चित क्रम में चक्रित होते हैं: चर, स्थिर, द्विस्वभाव। यह वर्गीकरण भविष्यवाणी के लिए अत्यन्त महत्वपूर्ण है।',
    sa: 'प्रत्येकराशिः त्रिषु गुणेषु एकस्मिन् पतति — चरं, स्थिरं, द्विस्वभावं च।'
  },

  /* Section 4: Elements (Tattva) */
  elementTitle: { en: 'Elements (Tattva) — The Four Forces', hi: 'तत्व — चार शक्तियाँ', sa: 'तत्त्वानि — चतस्रः शक्तयः' },
  elementIntro: {
    en: 'Each Rashi is governed by one of four elements (Tattvas). The element cycle — Fire, Earth, Air, Water — repeats three times through the zodiac. Elements describe the fundamental nature of a sign\'s energy and strongly influence how planets placed in them will manifest their results.',
    hi: 'प्रत्येक राशि चार तत्वों में से एक द्वारा शासित होती है। तत्व चक्र — अग्नि, पृथ्वी, वायु, जल — राशिचक्र में तीन बार दोहराता है। तत्व राशि की ऊर्जा की मूल प्रकृति का वर्णन करते हैं।',
    sa: 'प्रत्येकराशिः चतुर्षु तत्त्वेषु एकेन शास्यते — अग्निः, पृथिवी, वायुः, जलं च।'
  },

  /* Section 5: Lordship */
  lordTitle: { en: 'Sign Lordship — Rashi Swami', hi: 'राशि स्वामित्व — राशि स्वामी', sa: 'राशिस्वामित्वम्' },
  lordContent: {
    en: 'Each Rashi is "owned" by a planet called its lord (Swami). The lord\'s condition in a chart profoundly affects all matters related to that sign. If the lord is strong (exalted, in own sign, or in a friend\'s sign), the sign\'s matters flourish. If the lord is weak (debilitated, combust, or in enemy territory), the sign\'s significations suffer. The Sun and Moon each own one sign; Mars, Mercury, Jupiter, Venus, and Saturn each own two signs. Rahu and Ketu do not own any Rashi in traditional Jyotish but co-rule certain signs in some schools.',
    hi: 'प्रत्येक राशि एक ग्रह के "स्वामित्व" में होती है जिसे उसका स्वामी कहते हैं। कुण्डली में स्वामी की स्थिति उस राशि से सम्बन्धित सभी मामलों को गहराई से प्रभावित करती है। यदि स्वामी बलवान है (उच्च, स्वराशि, या मित्र राशि में), तो राशि के मामले फलते-फूलते हैं। सूर्य और चन्द्र प्रत्येक एक राशि के स्वामी हैं; मंगल, बुध, बृहस्पति, शुक्र और शनि प्रत्येक दो राशियों के स्वामी हैं।',
    sa: 'प्रत्येकराशिः एकेन ग्रहेण स्वामिता भवति यः तस्याः स्वामी इति कथ्यते। कुण्डल्यां स्वामिनः स्थितिः तस्याः राशेः सर्वविषयान् गभीरतया प्रभावयति।'
  },

  /* Section 6: Exaltation & Debilitation */
  dignityTitle: { en: 'Exaltation & Debilitation Points', hi: 'उच्च और नीच बिन्दु', sa: 'उच्चनीचस्थानानि' },
  dignityIntro: {
    en: 'Each planet has a specific degree where it reaches maximum strength (Uccha — exaltation) and a diametrically opposite degree where it is weakest (Neecha — debilitation). These are precise degrees, not just signs. A planet within a few degrees of its exact exaltation point produces powerful, beneficial results; near its debilitation point, its significations are weakened. The concept of Neecha Bhanga (cancellation of debilitation) provides important exceptions where a debilitated planet can still give good results.',
    hi: 'प्रत्येक ग्रह का एक विशिष्ट अंश होता है जहाँ वह अधिकतम शक्ति (उच्च) प्राप्त करता है और एक विपरीत अंश जहाँ वह सबसे कमजोर (नीच) होता है। ये सटीक अंश हैं, केवल राशियाँ नहीं। नीच भंग (नीचत्व रद्द होना) की अवधारणा महत्वपूर्ण अपवाद प्रदान करती है।',
    sa: 'प्रत्येकग्रहस्य विशिष्टः अंशः यत्र सः परमबलं प्राप्नोति (उच्चम्) विपरीतः अंशः यत्र सः दुर्बलतमः (नीचम्) च।'
  },

  /* Section 7: Body Parts */
  bodyTitle: { en: 'Rashi & Body Parts — Kalapurusha', hi: 'राशि और शरीर के अंग — कालपुरुष', sa: 'राशिशरीरावयवाः — कालपुरुषः' },
  bodyContent: {
    en: 'In Vedic astrology, the zodiac is mapped onto a cosmic being called the Kalapurusha (Time Person). Aries rules the head and Pisces rules the feet, with each sign governing a specific body region in sequence. This mapping is used in medical astrology (Ayurvedic Jyotish) to identify vulnerable body parts. If a sign is afflicted by malefic planets, the corresponding body part may be prone to disease or injury.',
    hi: 'वैदिक ज्योतिष में राशिचक्र को एक ब्रह्माण्डीय पुरुष पर मानचित्रित किया जाता है जिसे कालपुरुष कहते हैं। मेष सिर पर शासन करती है और मीन पैरों पर, प्रत्येक राशि एक विशिष्ट शरीर क्षेत्र को क्रम में नियन्त्रित करती है। इस मानचित्रण का उपयोग चिकित्सा ज्योतिष (आयुर्वेदिक ज्योतिष) में कमजोर शरीर भागों की पहचान के लिए किया जाता है।',
    sa: 'वैदिकज्योतिषे राशिचक्रं ब्रह्माण्डीयपुरुषे प्रक्षिप्यते यः कालपुरुषः इति कथ्यते। मेषः शिरसि शासति मीनः पादयोः च।'
  },

  /* Section 8: Interpreting planets in sign categories */
  interpTitle: { en: 'Interpreting Planets in Sign Categories', hi: 'राशि वर्गों में ग्रह व्याख्या', sa: 'राशिवर्गेषु ग्रहव्याख्या' },
  interpContent: {
    en: 'Understanding how a planet behaves in different sign categories is fundamental to chart interpretation. The sign\'s element, quality, and lord all interact with the planet\'s own nature:',
    hi: 'यह समझना कि ग्रह विभिन्न राशि वर्गों में कैसा व्यवहार करता है, कुण्डली व्याख्या के लिए मौलिक है। राशि का तत्व, गुण और स्वामी सभी ग्रह की अपनी प्रकृति से अन्तर्क्रिया करते हैं:',
    sa: 'ग्रहः विभिन्नराशिवर्गेषु कथं व्यवहरति इति अवगन्तुं कुण्डलीव्याख्यायै मौलिकम्।'
  },

  /* Section 9: Common Misconceptions */
  mythTitle: { en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्यभ्रान्तयः' },

  /* Section 10: Complete list */
  listTitle: { en: 'All 12 Rashis — Detailed Reference', hi: 'सम्पूर्ण 12 राशियाँ — विस्तृत सन्दर्भ', sa: 'सम्पूर्णाः 12 राशयः — विस्तृतसन्दर्भः' },

  /* Cross-references */
  crossTitle: { en: 'Deepen Your Understanding', hi: 'अपनी समझ गहरी करें', sa: 'ज्ञानं गभीरयतु' },
  tryIt: { en: 'Find Your Rashi — Generate Your Kundali →', hi: 'अपनी राशि खोजें — अपनी कुण्डली बनाएँ →', sa: 'स्वराशिं अन्वेषयतु — कुण्डलीं रचयतु →' },
};

/* ---------- element data ---------- */
const ELEMENTS = [
  {
    name: { en: 'Fire (Agni)', hi: 'अग्नि तत्व', sa: 'अग्नितत्त्वम्' },
    signs: 'Aries, Leo, Sagittarius',
    signsSa: 'मेष, सिंह, धनु',
    color: 'text-red-400',
    bgColor: 'border-red-400/20 bg-red-400/5',
    desc: {
      en: 'Fire signs are dynamic, assertive, and action-oriented. They embody initiative, leadership, and transformative energy. Planets in fire signs act quickly, boldly, and with enthusiasm. Fire gives courage but can also lead to impulsiveness and aggression.',
      hi: 'अग्नि राशियाँ गतिशील, दृढ़ और कर्मोन्मुख होती हैं। ये पहल, नेतृत्व और परिवर्तनकारी ऊर्जा का प्रतीक हैं। अग्नि राशियों के ग्रह शीघ्र, साहसपूर्वक और उत्साह से कार्य करते हैं।',
      sa: 'अग्निराशयः गतिशीलाः, दृढाः, कर्मोन्मुखाश्च। तासु ग्रहाः शीघ्रं साहसेन उत्साहेन च कार्यं कुर्वन्ति।'
    },
  },
  {
    name: { en: 'Earth (Prithvi)', hi: 'पृथ्वी तत्व', sa: 'पृथिवीतत्त्वम्' },
    signs: 'Taurus, Virgo, Capricorn',
    signsSa: 'वृषभ, कन्या, मकर',
    color: 'text-emerald-400',
    bgColor: 'border-emerald-400/20 bg-emerald-400/5',
    desc: {
      en: 'Earth signs are practical, grounded, and materially focused. They represent stability, perseverance, and tangible results. Planets in earth signs produce slow but enduring outcomes. Earth gives reliability but can lead to rigidity and excessive attachment to material security.',
      hi: 'पृथ्वी राशियाँ व्यावहारिक, भूमिगत और भौतिक रूप से केन्द्रित होती हैं। ये स्थिरता, दृढ़ता और ठोस परिणामों का प्रतिनिधित्व करती हैं। पृथ्वी राशियों के ग्रह धीमे लेकिन स्थायी परिणाम देते हैं।',
      sa: 'पृथिवीराशयः व्यावहारिकाः, स्थिताः, भौतिकरूपेण केन्द्रिताश्च। तासु ग्रहाः मन्दं किन्तु स्थायिफलं ददति।'
    },
  },
  {
    name: { en: 'Air (Vayu)', hi: 'वायु तत्व', sa: 'वायुतत्त्वम्' },
    signs: 'Gemini, Libra, Aquarius',
    signsSa: 'मिथुन, तुला, कुम्भ',
    color: 'text-sky-400',
    bgColor: 'border-sky-400/20 bg-sky-400/5',
    desc: {
      en: 'Air signs are intellectual, communicative, and socially oriented. They govern thought, relationships, and abstract ideas. Planets in air signs express through communication, analysis, and social interaction. Air gives versatility but can lead to indecisiveness and detachment from emotions.',
      hi: 'वायु राशियाँ बौद्धिक, संवादात्मक और सामाजिक रूप से उन्मुख होती हैं। ये विचार, सम्बन्ध और अमूर्त विचारों को नियन्त्रित करती हैं। वायु राशियों के ग्रह संवाद और सामाजिक अन्तर्क्रिया से अभिव्यक्त होते हैं।',
      sa: 'वायुराशयः बौद्धिकाः, संवादात्मिकाः, सामाजिकोन्मुखाश्च। तासु ग्रहाः संवादेन विश्लेषणेन च अभिव्यज्यन्ते।'
    },
  },
  {
    name: { en: 'Water (Jala)', hi: 'जल तत्व', sa: 'जलतत्त्वम्' },
    signs: 'Cancer, Scorpio, Pisces',
    signsSa: 'कर्क, वृश्चिक, मीन',
    color: 'text-blue-400',
    bgColor: 'border-blue-400/20 bg-blue-400/5',
    desc: {
      en: 'Water signs are emotional, intuitive, and receptive. They represent feelings, psychic sensitivity, and deep inner processes. Planets in water signs operate through emotion, empathy, and intuition. Water gives depth and compassion but can lead to moodiness and emotional vulnerability.',
      hi: 'जल राशियाँ भावनात्मक, अन्तर्ज्ञानी और ग्रहणशील होती हैं। ये भावनाओं, मानसिक संवेदनशीलता और गहरी आन्तरिक प्रक्रियाओं का प्रतिनिधित्व करती हैं। जल राशियों के ग्रह भावना और सहानुभूति से कार्य करते हैं।',
      sa: 'जलराशयः भावनात्मिकाः, अन्तर्ज्ञानिन्यः, ग्राहिण्यश्च। तासु ग्रहाः भावनया सहानुभूत्या च कार्यं कुर्वन्ति।'
    },
  },
];

/* ---------- quality data ---------- */
const QUALITIES = [
  {
    name: { en: 'Chara (Cardinal / Movable)', hi: 'चर (गतिशील)', sa: 'चरम् (गतिशीलम्)' },
    signs: { en: 'Aries, Cancer, Libra, Capricorn', hi: 'मेष, कर्क, तुला, मकर', sa: 'मेषः, कर्कटः, तुला, मकरः' },
    color: 'text-amber-400',
    border: 'border-amber-400/20 bg-amber-400/5',
    desc: {
      en: 'Chara signs initiate action and bring change. They mark the beginning of each season (equinoxes and solstices). Planets here drive new beginnings, restlessness, and forward movement. People with strong Chara influence are pioneers, initiators, and change-makers. However, they may lack staying power and abandon projects once the novelty fades.',
      hi: 'चर राशियाँ कर्म प्रारम्भ करती हैं और परिवर्तन लाती हैं। ये प्रत्येक ऋतु का आरम्भ चिह्नित करती हैं। यहाँ ग्रह नई शुरुआत, बेचैनी और आगे बढ़ने की प्रेरणा देते हैं।',
      sa: 'चरराशयः कर्म प्रारभन्ते परिवर्तनं च आनयन्ति। प्रत्येकर्तोः आरम्भं चिह्नयन्ति।'
    },
  },
  {
    name: { en: 'Sthira (Fixed / Stable)', hi: 'स्थिर (स्थायी)', sa: 'स्थिरम् (स्थायि)' },
    signs: { en: 'Taurus, Leo, Scorpio, Aquarius', hi: 'वृषभ, सिंह, वृश्चिक, कुम्भ', sa: 'वृषभः, सिंहः, वृश्चिकः, कुम्भः' },
    color: 'text-emerald-400',
    border: 'border-emerald-400/20 bg-emerald-400/5',
    desc: {
      en: 'Sthira signs consolidate and sustain. They occupy the middle of each season, representing peak energy that is stable and enduring. Planets here give persistence, determination, and depth. People with strong Sthira influence are loyal, focused, and unwavering. The downside is stubbornness, resistance to change, and possessiveness.',
      hi: 'स्थिर राशियाँ समेकित और स्थायी करती हैं। ये प्रत्येक ऋतु के मध्य में होती हैं, स्थायी शिखर ऊर्जा का प्रतिनिधित्व करती हैं। यहाँ ग्रह दृढ़ता, संकल्प और गहराई देते हैं।',
      sa: 'स्थिरराशयः समेकयन्ति स्थापयन्ति च। प्रत्येकर्तोः मध्ये स्थिताः स्थायिशिखरोर्जां प्रतिनिधयन्ति।'
    },
  },
  {
    name: { en: 'Dwiswabhava (Mutable / Dual)', hi: 'द्विस्वभाव (परिवर्तनशील)', sa: 'द्विस्वभावम् (परिवर्तनशीलम्)' },
    signs: { en: 'Gemini, Virgo, Sagittarius, Pisces', hi: 'मिथुन, कन्या, धनु, मीन', sa: 'मिथुनं, कन्या, धनुः, मीनः' },
    color: 'text-violet-400',
    border: 'border-violet-400/20 bg-violet-400/5',
    desc: {
      en: 'Dwiswabhava (dual-natured) signs are adaptable and transitional. They close out each season, bridging one phase into the next. Planets here give flexibility, intellectual breadth, and versatility. People with strong Dwiswabhava influence are adaptable communicators and multi-taskers. The challenge is inconsistency, scattered focus, and difficulty committing.',
      hi: 'द्विस्वभाव (दोहरी प्रकृति) राशियाँ अनुकूलनीय और संक्रमणशील होती हैं। ये प्रत्येक ऋतु को समाप्त करती हैं, एक चरण से अगले में सेतु बनाती हैं। यहाँ ग्रह लचीलापन, बौद्धिक विस्तार और बहुमुखी प्रतिभा देते हैं।',
      sa: 'द्विस्वभावराशयः अनुकूलनीयाः संक्रमणशीलाश्च। प्रत्येकर्तुं समापयन्ति एकचरणात् अपरं प्रति सेतुं रचयन्ति।'
    },
  },
];

/* ---------- exaltation/debilitation data ---------- */
const DIGNITY_DATA = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, exaltSign: { en: 'Aries 10°', hi: 'मेष 10°' }, debSign: { en: 'Libra 10°', hi: 'तुला 10°' }, moolaSign: { en: 'Leo', hi: 'सिंह' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, exaltSign: { en: 'Taurus 3°', hi: 'वृषभ 3°' }, debSign: { en: 'Scorpio 3°', hi: 'वृश्चिक 3°' }, moolaSign: { en: 'Cancer', hi: 'कर्क' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, exaltSign: { en: 'Capricorn 28°', hi: 'मकर 28°' }, debSign: { en: 'Cancer 28°', hi: 'कर्क 28°' }, moolaSign: { en: 'Aries, Scorpio', hi: 'मेष, वृश्चिक' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, exaltSign: { en: 'Virgo 15°', hi: 'कन्या 15°' }, debSign: { en: 'Pisces 15°', hi: 'मीन 15°' }, moolaSign: { en: 'Gemini, Virgo', hi: 'मिथुन, कन्या' } },
  { planet: { en: 'Jupiter', hi: 'बृहस्पति' }, exaltSign: { en: 'Cancer 5°', hi: 'कर्क 5°' }, debSign: { en: 'Capricorn 5°', hi: 'मकर 5°' }, moolaSign: { en: 'Sagittarius, Pisces', hi: 'धनु, मीन' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, exaltSign: { en: 'Pisces 27°', hi: 'मीन 27°' }, debSign: { en: 'Virgo 27°', hi: 'कन्या 27°' }, moolaSign: { en: 'Taurus, Libra', hi: 'वृषभ, तुला' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, exaltSign: { en: 'Libra 20°', hi: 'तुला 20°' }, debSign: { en: 'Aries 20°', hi: 'मेष 20°' }, moolaSign: { en: 'Capricorn, Aquarius', hi: 'मकर, कुम्भ' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, exaltSign: { en: 'Taurus/Gemini', hi: 'वृषभ/मिथुन' }, debSign: { en: 'Scorpio/Sagittarius', hi: 'वृश्चिक/धनु' }, moolaSign: { en: '—', hi: '—' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, exaltSign: { en: 'Scorpio/Sagittarius', hi: 'वृश्चिक/धनु' }, debSign: { en: 'Taurus/Gemini', hi: 'वृषभ/मिथुन' }, moolaSign: { en: '—', hi: '—' } },
];

/* ---------- body part mapping ---------- */
const BODY_PARTS = [
  { id: 1, sign: { en: 'Aries', hi: 'मेष' }, part: { en: 'Head, brain, face', hi: 'सिर, मस्तिष्क, मुख' } },
  { id: 2, sign: { en: 'Taurus', hi: 'वृषभ' }, part: { en: 'Face, neck, throat, right eye', hi: 'मुख, गर्दन, कण्ठ, दायाँ नेत्र' } },
  { id: 3, sign: { en: 'Gemini', hi: 'मिथुन' }, part: { en: 'Arms, shoulders, lungs, hands', hi: 'भुजाएँ, कन्धे, फेफड़े, हाथ' } },
  { id: 4, sign: { en: 'Cancer', hi: 'कर्क' }, part: { en: 'Chest, heart, stomach, breasts', hi: 'छाती, हृदय, उदर, वक्ष' } },
  { id: 5, sign: { en: 'Leo', hi: 'सिंह' }, part: { en: 'Upper abdomen, spine, heart', hi: 'ऊपरी उदर, रीढ़, हृदय' } },
  { id: 6, sign: { en: 'Virgo', hi: 'कन्या' }, part: { en: 'Intestines, lower abdomen, waist', hi: 'आँतें, निचला उदर, कमर' } },
  { id: 7, sign: { en: 'Libra', hi: 'तुला' }, part: { en: 'Kidneys, lower back, bladder', hi: 'गुर्दे, पीठ का निचला भाग, मूत्राशय' } },
  { id: 8, sign: { en: 'Scorpio', hi: 'वृश्चिक' }, part: { en: 'Reproductive organs, pelvis', hi: 'प्रजनन अंग, श्रोणि' } },
  { id: 9, sign: { en: 'Sagittarius', hi: 'धनु' }, part: { en: 'Thighs, hips, liver', hi: 'जाँघें, कूल्हे, यकृत' } },
  { id: 10, sign: { en: 'Capricorn', hi: 'मकर' }, part: { en: 'Knees, joints, bones, skin', hi: 'घुटने, जोड़, हड्डियाँ, त्वचा' } },
  { id: 11, sign: { en: 'Aquarius', hi: 'कुम्भ' }, part: { en: 'Calves, ankles, circulation', hi: 'पिण्डली, टखने, रक्त संचार' } },
  { id: 12, sign: { en: 'Pisces', hi: 'मीन' }, part: { en: 'Feet, toes, lymphatic system', hi: 'पैर, अँगुलियाँ, लसीका तन्त्र' } },
];

/* ---------- interpretation rules ---------- */
const INTERP_RULES = [
  {
    category: { en: 'Planets in Fire Signs', hi: 'अग्नि राशि में ग्रह' },
    color: 'text-red-400',
    border: 'border-red-400/20 bg-red-400/5',
    rules: {
      en: 'Benefics (Jupiter, Venus) become enthusiastic and generous but may overpromise. Malefics (Mars, Saturn) become aggressive and domineering. The Sun is strongest here (especially in Aries). Mars is comfortable as it rules Aries. Saturn struggles in fire signs — discipline clashes with impulsiveness.',
      hi: 'शुभ ग्रह (गुरु, शुक्र) उत्साही और उदार बनते हैं। पाप ग्रह (मंगल, शनि) आक्रामक बनते हैं। सूर्य यहाँ सबसे बलवान है (विशेषकर मेष में)। शनि अग्नि राशियों में कठिनाई अनुभव करता है।',
    },
  },
  {
    category: { en: 'Planets in Earth Signs', hi: 'पृथ्वी राशि में ग्रह' },
    color: 'text-emerald-400',
    border: 'border-emerald-400/20 bg-emerald-400/5',
    rules: {
      en: 'Benefics produce material wealth and practical wisdom. Malefics bring hard work and delayed rewards. Mercury excels (especially in Virgo, its exaltation sign). Venus is grounded and sensual in Taurus. Saturn thrives — discipline meets practicality. Moon can feel restricted, craving emotional freedom.',
      hi: 'शुभ ग्रह भौतिक सम्पत्ति और व्यावहारिक ज्ञान देते हैं। पाप ग्रह कठिन परिश्रम और विलम्बित फल लाते हैं। बुध उत्कृष्ट रहता है (विशेषकर कन्या में)। शनि फलता-फूलता है — अनुशासन व्यावहारिकता से मिलता है।',
    },
  },
  {
    category: { en: 'Planets in Air Signs', hi: 'वायु राशि में ग्रह' },
    color: 'text-sky-400',
    border: 'border-sky-400/20 bg-sky-400/5',
    rules: {
      en: 'Benefics enhance social grace and intellectual charm. Malefics can create mental restlessness and sharp speech. Mercury thrives with enhanced communication. Venus is refined and diplomatic (especially in Libra). Saturn in Libra is exalted — justice meets structure. Mars loses some force, becoming more strategic than physical.',
      hi: 'शुभ ग्रह सामाजिक शिष्टाचार और बौद्धिक आकर्षण बढ़ाते हैं। पाप ग्रह मानसिक बेचैनी पैदा कर सकते हैं। बुध संवाद शक्ति बढ़ाकर फलता है। शनि तुला में उच्च — न्याय संरचना से मिलता है।',
    },
  },
  {
    category: { en: 'Planets in Water Signs', hi: 'जल राशि में ग्रह' },
    color: 'text-blue-400',
    border: 'border-blue-400/20 bg-blue-400/5',
    rules: {
      en: 'Benefics become deeply compassionate and spiritually inclined. Jupiter is exalted in Cancer — wisdom meets nurturing. Venus is exalted in Pisces — love reaches its highest expression. Malefics here intensify emotions: Mars in Scorpio is powerful but obsessive; Saturn in water signs creates emotional heaviness and fear. Moon is at home in Cancer.',
      hi: 'शुभ ग्रह गहराई से दयालु और आध्यात्मिक रूप से उन्मुख बनते हैं। गुरु कर्क में उच्च — ज्ञान पालन-पोषण से मिलता है। शुक्र मीन में उच्च। पाप ग्रह यहाँ भावनाओं को तीव्र करते हैं। चन्द्रमा कर्क में स्वगृह में है।',
    },
  },
];

/* ---------- misconceptions ---------- */
const MYTHS = [
  {
    myth: {
      en: '"My Western sign is my real sign"',
      hi: '"मेरी पश्चिमी राशि ही मेरी असली राशि है"',
    },
    fact: {
      en: 'Vedic and Western astrology use different zodiacs. Neither is "wrong" — they measure different things. The Vedic sidereal zodiac is star-based and approximately 24 degrees behind the tropical zodiac. Your Vedic Moon sign (Rashi) is the primary identity, not the Sun sign as in Western astrology.',
      hi: 'वैदिक और पश्चिमी ज्योतिष अलग-अलग राशिचक्रों का उपयोग करते हैं। कोई भी "गलत" नहीं है। वैदिक निरयण राशिचक्र तारा-आधारित है और सायन राशिचक्र से लगभग 24 अंश पीछे है। वैदिक ज्योतिष में चन्द्र राशि प्राथमिक पहचान है, सूर्य राशि नहीं।',
    },
  },
  {
    myth: {
      en: '"Certain signs are inherently bad or good"',
      hi: '"कुछ राशियाँ स्वाभाविक रूप से बुरी या अच्छी होती हैं"',
    },
    fact: {
      en: 'No Rashi is inherently malefic or benefic. Scorpio is often feared, but it also signifies depth, research, and transformation. Each sign has strengths and challenges. What matters is the condition of the sign\'s lord, planets placed there, and aspects received — not the sign itself in isolation.',
      hi: 'कोई भी राशि स्वाभाविक रूप से पाप या शुभ नहीं है। वृश्चिक से अक्सर डर लगता है, लेकिन यह गहराई, शोध और परिवर्तन का भी प्रतीक है। प्रत्येक राशि की ताकत और चुनौतियाँ हैं। महत्वपूर्ण यह है कि राशि के स्वामी, वहाँ स्थित ग्रह और प्राप्त दृष्टि कैसी है।',
    },
  },
  {
    myth: {
      en: '"Vedic signs are the same as constellations"',
      hi: '"वैदिक राशियाँ नक्षत्रों (तारामण्डलों) के समान हैं"',
    },
    fact: {
      en: 'Rashis are equal 30-degree divisions of the ecliptic; constellations are unequal star patterns that merely lend their names. The constellation Virgo spans about 44 degrees, while Rashi Kanya (Virgo) is exactly 30 degrees. Vedic astrology uses Nakshatras (lunar mansions of 13.33 degrees each) for finer stellar divisions, which are separate from Rashis.',
      hi: 'राशियाँ ज्योतिषीय पथ के समान 30-अंश विभाजन हैं; तारामण्डल असमान तारा प्रतिरूप हैं जो केवल अपने नाम देते हैं। तारामण्डल कन्या लगभग 44 अंश में फैली है, जबकि राशि कन्या ठीक 30 अंश है।',
    },
  },
  {
    myth: {
      en: '"Rahu and Ketu own signs like other planets"',
      hi: '"राहु और केतु अन्य ग्रहों की तरह राशियों के स्वामी हैं"',
    },
    fact: {
      en: 'In classical Parashari Jyotish, Rahu and Ketu do not own any Rashi. They are shadow planets (chaya grahas) — mathematical points where the Moon\'s orbit intersects the ecliptic. Some modern schools assign co-rulership (Rahu with Aquarius, Ketu with Scorpio), but this is not universally accepted in traditional texts like BPHS.',
      hi: 'शास्त्रीय पाराशरी ज्योतिष में राहु और केतु किसी राशि के स्वामी नहीं हैं। ये छाया ग्रह हैं — गणितीय बिन्दु जहाँ चन्द्रमा की कक्षा क्रान्तिवृत्त को काटती है। कुछ आधुनिक विद्यालय सह-स्वामित्व देते हैं, लेकिन यह परम्परागत ग्रन्थों में सार्वभौमिक रूप से स्वीकृत नहीं है।',
    },
  },
];

/* ---------- rashi characteristics (en/hi) ---------- */
const RASHI_CHARS: Record<number, { traits: { en: string; hi: string }; keywords: { en: string; hi: string } }> = {
  1: { traits: { en: 'Courageous, pioneering, impatient, independent. Natural leader with fiery temperament. First sign — represents new beginnings, the self, and raw initiative.', hi: 'साहसी, अग्रणी, अधीर, स्वतन्त्र। अग्नि स्वभाव का प्राकृतिक नेता। प्रथम राशि — नई शुरुआत, आत्मा और कच्ची पहल का प्रतिनिधित्व।' }, keywords: { en: 'Initiative, energy, self', hi: 'पहल, ऊर्जा, स्व' } },
  2: { traits: { en: 'Stable, sensual, possessive, artistic. Values material comfort and beauty. Strongest earth sign — represents wealth, family, and sensory pleasure.', hi: 'स्थिर, इन्द्रियप्रिय, अधिकारशील, कलात्मक। भौतिक सुख और सौन्दर्य को महत्व देता है। सबसे मजबूत पृथ्वी राशि — धन, परिवार और संवेदी सुख।' }, keywords: { en: 'Wealth, beauty, stability', hi: 'धन, सौन्दर्य, स्थिरता' } },
  3: { traits: { en: 'Curious, communicative, versatile, restless. Twin-natured sign of intellect and duality. Masters of language, trade, and information exchange.', hi: 'जिज्ञासु, संवादी, बहुमुखी, बेचैन। बुद्धि और द्वैत की जुड़वाँ प्रकृति वाली राशि। भाषा, व्यापार और सूचना विनिमय के स्वामी।' }, keywords: { en: 'Communication, duality, intellect', hi: 'संवाद, द्वैत, बुद्धि' } },
  4: { traits: { en: 'Nurturing, emotional, protective, intuitive. The mother of the zodiac — deeply connected to home, family, and emotional security. Moon\'s own sign.', hi: 'पालनकर्ता, भावनात्मक, रक्षात्मक, अन्तर्ज्ञानी। राशिचक्र की माता — घर, परिवार और भावनात्मक सुरक्षा से गहराई से जुड़ी। चन्द्रमा की स्वराशि।' }, keywords: { en: 'Nurturing, home, emotions', hi: 'पालन, गृह, भावनाएँ' } },
  5: { traits: { en: 'Regal, creative, proud, generous. The king of the zodiac — natural authority, creative expression, and dramatic flair. Sun\'s own sign — brightest and most confident.', hi: 'राजसी, सृजनशील, गर्वित, उदार। राशिचक्र का राजा — प्राकृतिक अधिकार, सृजनात्मक अभिव्यक्ति। सूर्य की स्वराशि — सबसे उज्ज्वल और आत्मविश्वासी।' }, keywords: { en: 'Authority, creativity, pride', hi: 'अधिकार, सृजनशीलता, गर्व' } },
  6: { traits: { en: 'Analytical, service-oriented, perfectionist, critical. The healer and craftsman — excels in detail work, health, and systematic improvement. Mercury\'s exaltation sign.', hi: 'विश्लेषणात्मक, सेवा-उन्मुख, पूर्णतावादी, आलोचनात्मक। चिकित्सक और शिल्पी — विस्तृत कार्य, स्वास्थ्य में उत्कृष्ट। बुध की उच्च राशि।' }, keywords: { en: 'Analysis, service, perfection', hi: 'विश्लेषण, सेवा, पूर्णता' } },
  7: { traits: { en: 'Diplomatic, balanced, relationship-focused, aesthetic. The sign of partnerships and justice. Venus\'s own sign — beauty, harmony, and fair dealing. Saturn\'s exaltation sign.', hi: 'कूटनीतिक, सन्तुलित, सम्बन्ध-केन्द्रित, सौन्दर्यपरक। साझेदारी और न्याय की राशि। शुक्र की स्वराशि — सौन्दर्य, सामंजस्य। शनि की उच्च राशि।' }, keywords: { en: 'Balance, partnership, justice', hi: 'सन्तुलन, साझेदारी, न्याय' } },
  8: { traits: { en: 'Intense, secretive, transformative, powerful. The sign of hidden depths — death, rebirth, occult knowledge, and research. Mars\'s second sign — controlled power.', hi: 'तीव्र, गूढ़, परिवर्तनकारी, शक्तिशाली। छिपी गहराइयों की राशि — मृत्यु, पुनर्जन्म, गूढ़ ज्ञान, और शोध। मंगल की दूसरी राशि — नियन्त्रित शक्ति।' }, keywords: { en: 'Transformation, depth, secrets', hi: 'परिवर्तन, गहराई, रहस्य' } },
  9: { traits: { en: 'Philosophical, optimistic, adventurous, righteous. The sign of dharma, higher learning, and long journeys. Jupiter\'s own sign — expansion of wisdom and fortune.', hi: 'दार्शनिक, आशावादी, साहसी, धर्मपरायण। धर्म, उच्च शिक्षा और लम्बी यात्राओं की राशि। बृहस्पति की स्वराशि — ज्ञान और भाग्य का विस्तार।' }, keywords: { en: 'Dharma, wisdom, expansion', hi: 'धर्म, ज्ञान, विस्तार' } },
  10: { traits: { en: 'Ambitious, disciplined, pragmatic, structured. The sign of karma, career, and worldly achievement. Saturn\'s own sign — slow but sure rise to authority. Mars\'s exaltation sign.', hi: 'महत्वाकांक्षी, अनुशासित, व्यावहारिक, संरचित। कर्म, व्यवसाय और सांसारिक उपलब्धि की राशि। शनि की स्वराशि — धीमा लेकिन निश्चित उत्थान। मंगल की उच्च राशि।' }, keywords: { en: 'Career, discipline, authority', hi: 'कर्म, अनुशासन, अधिकार' } },
  11: { traits: { en: 'Unconventional, humanitarian, intellectual, detached. The sign of networks, aspirations, and collective welfare. Saturn\'s second sign — structure applied to social ideals.', hi: 'अपारम्परिक, मानवतावादी, बौद्धिक, अनासक्त। सम्पर्कों, आकांक्षाओं और सामूहिक कल्याण की राशि। शनि की दूसरी राशि — सामाजिक आदर्शों में संरचना।' }, keywords: { en: 'Networks, ideals, innovation', hi: 'सम्पर्क, आदर्श, नवाचार' } },
  12: { traits: { en: 'Spiritual, imaginative, compassionate, dissolving. The final sign — represents liberation (moksha), foreign lands, and surrender. Jupiter\'s second sign — wisdom turned inward. Venus\'s exaltation sign.', hi: 'आध्यात्मिक, कल्पनाशील, दयालु, विलीन। अन्तिम राशि — मोक्ष, विदेश और समर्पण का प्रतिनिधित्व। बृहस्पति की दूसरी राशि — अन्तर्मुखी ज्ञान। शुक्र की उच्च राशि।' }, keywords: { en: 'Moksha, imagination, surrender', hi: 'मोक्ष, कल्पना, समर्पण' } },
};

/* ---------- element color for badges ---------- */
const elementColor: Record<string, string> = {
  Fire: 'text-red-400',
  Earth: 'text-emerald-400',
  Air: 'text-sky-400',
  Water: 'text-blue-400',
};
const elementBg: Record<string, string> = {
  Fire: 'bg-red-400/10 border-red-400/20',
  Earth: 'bg-emerald-400/10 border-emerald-400/20',
  Air: 'bg-sky-400/10 border-sky-400/20',
  Water: 'bg-blue-400/10 border-blue-400/20',
};

/* ---------- Cross-reference links ---------- */
const CROSS_REFS = [
  { href: '/learn/grahas' as const, label: { en: 'Grahas — The Nine Planets', hi: 'ग्रह — नौ ग्रह' }, desc: { en: 'How planets interact with signs', hi: 'ग्रह राशियों से कैसे अन्तर्क्रिया करते हैं' } },
  { href: '/learn/bhavas' as const, label: { en: 'Bhavas — The 12 Houses', hi: 'भाव — 12 भाव' }, desc: { en: 'How signs become houses in a chart', hi: 'कुण्डली में राशियाँ कैसे भाव बनती हैं' } },
  { href: '/learn/nakshatras' as const, label: { en: 'Nakshatras — Lunar Mansions', hi: 'नक्षत्र — चन्द्र गृह' }, desc: { en: 'Finer stellar divisions within signs', hi: 'राशियों के भीतर सूक्ष्म तारा विभाजन' } },
  { href: '/learn/kundali' as const, label: { en: 'Kundali — Birth Chart', hi: 'कुण्डली — जन्म पत्रिका' }, desc: { en: 'How signs, houses, and planets combine', hi: 'राशियाँ, भाव और ग्रह कैसे जुड़ते हैं' } },
];

/* ========== Component ========== */

export default function LearnRashisPage() {
  const locale = useLocale() as Locale;
  const loc = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const; // fallback sa -> hi for longer content

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary">{L.subtitle[locale]}</p>
      </div>

      {/* Sanskrit Key Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Rashi" devanagari="राशि" transliteration="Rashi" meaning="Zodiac sign (heap/cluster)" />
        <SanskritTermCard term="Tattva" devanagari="तत्त्व" transliteration="Tattva" meaning="Element (fundamental nature)" />
        <SanskritTermCard term="Swami" devanagari="स्वामी" transliteration="Swami" meaning="Lord / Owner of a sign" />
        <SanskritTermCard term="Uccha" devanagari="उच्च" transliteration="Uccha" meaning="Exaltation (highest dignity)" />
      </div>

      {/* Section 1: What is a Rashi */}
      <LessonSection number={1} title={L.whatTitle[locale]} illustration={<ZodiacBeltDiagram />}>
        <p>{L.whatContent[locale]}</p>
        <p>{L.whatContent2[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Rashi = floor(sidereal_longitude / 30) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Sidereal longitude = Tropical longitude - Ayanamsha (~24.2 in 2026)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Example: Moon at tropical 151.3 - 24.2 = 127.1 sidereal; floor(127.1/30)+1 = 5 = Leo (Simha)</p>
        </div>
      </LessonSection>

      {/* Section 2: Astronomy */}
      <LessonSection number={2} title={L.astroTitle[locale]}>
        <p>{L.astroContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">360 / 12 = 30 per Rashi</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Aries (Mesha): 0-30 | Taurus (Vrishabha): 30-60 | ... | Pisces (Meena): 330-360</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Each Rashi contains 2.25 Nakshatras (30 / 13.333 = 2.25)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Each Rashi contains 9 Navamsha padas (30 / 3.333 = 9)</p>
        </div>
      </LessonSection>

      {/* Section 3: Sign Qualities */}
      <LessonSection number={3} title={L.qualityTitle[locale]}>
        <p>{L.qualityIntro[locale]}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {QUALITIES.map((q) => (
            <motion.div
              key={q.name.en}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-5 border ${q.border}`}
            >
              <h4 className={`font-bold text-lg ${q.color} mb-2`}>{q.name[loc]}</h4>
              <p className="text-gold-light/60 text-xs mb-3" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                {q.signs[loc]}
              </p>
              <p className="text-text-secondary text-sm">{q.desc[loc]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Elements */}
      <LessonSection number={4} title={L.elementTitle[locale]}>
        <p>{L.elementIntro[locale]}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {ELEMENTS.map((el) => (
            <motion.div
              key={el.name.en}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-5 border ${el.bgColor}`}
            >
              <h4 className={`font-bold text-lg ${el.color} mb-1`}>{el.name[loc]}</h4>
              <p className="text-gold-light/50 text-xs mb-3">{loc === 'hi' ? el.signsSa : el.signs}</p>
              <p className="text-text-secondary text-sm">{el.desc[loc]}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">{loc === 'en' ? 'Element Cycle Pattern:' : 'तत्व चक्र क्रम:'}</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            <span className="text-red-400">Fire</span> → <span className="text-emerald-400">Earth</span> → <span className="text-sky-400">Air</span> → <span className="text-blue-400">Water</span> → <span className="text-red-400">Fire</span> → ...
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {loc === 'en' ? 'Repeats 3 times across the 12 signs' : '12 राशियों में 3 बार दोहराता है'}
          </p>
        </div>
      </LessonSection>

      {/* Section 5: Lordship */}
      <LessonSection number={5} title={L.lordTitle[locale]}>
        <p>{L.lordContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10 text-xs">
          <div className="grid grid-cols-3 gap-2 text-gold-light/80 font-mono">
            <div className="font-semibold text-gold-primary">{loc === 'en' ? 'Planet' : 'ग्रह'}</div>
            <div className="font-semibold text-gold-primary">{loc === 'en' ? 'Own Signs' : 'स्वराशि'}</div>
            <div className="font-semibold text-gold-primary">{loc === 'en' ? 'Moolatrikona' : 'मूलत्रिकोण'}</div>
            <div>Sun / {loc === 'hi' ? 'सूर्य' : 'Sun'}</div><div>Leo</div><div>Leo 0-20</div>
            <div>Moon / {loc === 'hi' ? 'चन्द्र' : 'Moon'}</div><div>Cancer</div><div>Taurus 4-30</div>
            <div>Mars / {loc === 'hi' ? 'मंगल' : 'Mars'}</div><div>Aries, Scorpio</div><div>Aries 0-12</div>
            <div>Mercury / {loc === 'hi' ? 'बुध' : 'Mercury'}</div><div>Gemini, Virgo</div><div>Virgo 16-20</div>
            <div>Jupiter / {loc === 'hi' ? 'बृहस्पति' : 'Jupiter'}</div><div>Sagittarius, Pisces</div><div>Sagittarius 0-10</div>
            <div>Venus / {loc === 'hi' ? 'शुक्र' : 'Venus'}</div><div>Taurus, Libra</div><div>Libra 0-15</div>
            <div>Saturn / {loc === 'hi' ? 'शनि' : 'Saturn'}</div><div>Capricorn, Aquarius</div><div>Aquarius 0-20</div>
          </div>
        </div>
      </LessonSection>

      {/* Section 6: Exaltation & Debilitation */}
      <LessonSection number={6} title={L.dignityTitle[locale]}>
        <p>{L.dignityIntro[locale]}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-primary border-b border-gold-primary/20">
                <th className="text-left py-2 px-3">{loc === 'en' ? 'Planet' : 'ग्रह'}</th>
                <th className="text-left py-2 px-3 text-emerald-400">{loc === 'en' ? 'Exaltation (Uccha)' : 'उच्च'}</th>
                <th className="text-left py-2 px-3 text-red-400">{loc === 'en' ? 'Debilitation (Neecha)' : 'नीच'}</th>
                <th className="text-left py-2 px-3 text-amber-400">{loc === 'en' ? 'Own Sign (Swakshetra)' : 'स्वक्षेत्र'}</th>
              </tr>
            </thead>
            <tbody>
              {DIGNITY_DATA.map((d) => (
                <tr key={d.planet.en} className="border-b border-gold-primary/5 text-text-secondary">
                  <td className="py-2 px-3 text-gold-light font-medium">{d.planet[loc]}</td>
                  <td className="py-2 px-3">{d.exaltSign[loc]}</td>
                  <td className="py-2 px-3">{d.debSign[loc]}</td>
                  <td className="py-2 px-3">{d.moolaSign[loc]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">{loc === 'en' ? 'Key Rule:' : 'मुख्य नियम:'}</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {loc === 'en'
              ? 'Exaltation and debilitation are always exactly 180 apart (7th sign from each other)'
              : 'उच्च और नीच सदैव ठीक 180° (एक-दूसरे से 7वीं राशि) दूर होते हैं'}
          </p>
        </div>
      </LessonSection>

      {/* Section 7: Body Parts */}
      <LessonSection number={7} title={L.bodyTitle[locale]}>
        <p>{L.bodyContent[locale]}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {BODY_PARTS.map((bp) => (
            <motion.div
              key={bp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: bp.id * 0.03 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 text-center"
            >
              <div className="text-gold-primary text-xs font-mono mb-1">{bp.id}</div>
              <div className="text-gold-light font-semibold text-sm">{bp.sign[loc]}</div>
              <div className="text-text-secondary text-xs mt-1">{bp.part[loc]}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">{loc === 'en' ? 'Kalapurusha Mapping:' : 'कालपुरुष मानचित्रण:'}</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {loc === 'en' ? 'Head (Aries/1) → Feet (Pisces/12) — top to bottom through the zodiac' : 'सिर (मेष/1) → पैर (मीन/12) — राशिचक्र में ऊपर से नीचे'}
          </p>
        </div>
      </LessonSection>

      {/* Section 8: Interpreting planets by sign category */}
      <LessonSection number={8} title={L.interpTitle[locale]}>
        <p>{L.interpContent[locale]}</p>
        <div className="space-y-4 mt-4">
          {INTERP_RULES.map((rule) => (
            <motion.div
              key={rule.category.en}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-xl p-5 border ${rule.border}`}
            >
              <h4 className={`font-bold ${rule.color} mb-2`}>{rule.category[loc]}</h4>
              <p className="text-text-secondary text-sm">{rule.rules[loc]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 9: Common Misconceptions */}
      <LessonSection number={9} title={L.mythTitle[locale]} variant="highlight">
        <div className="space-y-4">
          {MYTHS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-lg p-4 border border-red-400/10 bg-red-400/5"
            >
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-sm flex-shrink-0 mt-0.5">{loc === 'en' ? 'MYTH' : 'भ्रान्ति'}</span>
                <div>
                  <p className="text-red-300 font-medium text-sm">{m.myth[loc]}</p>
                  <div className="mt-2 pl-3 border-l-2 border-emerald-400/30">
                    <span className="text-emerald-400 font-bold text-xs">{loc === 'en' ? 'FACT' : 'तथ्य'}</span>
                    <p className="text-text-secondary text-sm mt-1">{m.fact[loc]}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 10: All 12 Rashis — Detailed */}
      <LessonSection number={10} title={L.listTitle[locale]}>
        <div className="space-y-4">
          {RASHIS.map((r, i) => {
            const chars = RASHI_CHARS[r.id];
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.03 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl">{r.symbol}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gold-light font-bold text-lg">{r.name[locale]}</span>
                      {locale !== 'en' && <span className="text-text-secondary/70 text-sm">({r.name.en})</span>}
                      <span className="text-text-secondary/65 text-xs font-mono">{r.startDeg}-{r.endDeg}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${elementBg[r.element.en] || ''} ${elementColor[r.element.en] || ''}`}>
                        {r.element[locale]}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-gold-primary/20 bg-gold-primary/5 text-gold-primary">
                        {r.quality[locale]}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-violet-400/20 bg-violet-400/5 text-violet-400">
                        {loc === 'en' ? 'Lord:' : 'स्वामी:'} {r.rulerName[locale]}
                      </span>
                    </div>
                  </div>
                </div>
                {chars && (
                  <>
                    <p className="text-text-secondary text-sm mb-2">{chars.traits[loc]}</p>
                    <div className="text-xs text-gold-primary/60">
                      {loc === 'en' ? 'Keywords:' : 'मुख्य शब्द:'}{' '}
                      <span className="text-gold-light/70">{chars.keywords[loc]}</span>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* Cross-references */}
      <LessonSection title={L.crossTitle[locale]}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 hover:border-gold-primary/30 transition-colors block"
            >
              <div className="text-gold-light font-semibold text-sm">{ref.label[loc]}</div>
              <div className="text-text-secondary text-xs mt-1">{ref.desc[loc]}</div>
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {L.tryIt[locale]}
        </Link>
      </div>
    </div>
  );
}
