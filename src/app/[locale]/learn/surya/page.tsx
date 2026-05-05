'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import ClassicalReference from '@/components/learn/ClassicalReference';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import { Link } from '@/lib/i18n/navigation';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import SectionNav from '@/components/learn/SectionNav';

// ─── Multilingual helper ───────────────────────────────────────────────
type ML = Record<string, string>;
function useML(locale: string) {
  return (obj: ML) => obj[locale] || obj.en || '';
}

// ─── Sanskrit Terms ────────────────────────────────────────────────────
const TERMS = [
  { devanagari: 'सूर्य', transliteration: 'Sūrya', meaning: { en: 'The Sun — the soul of the cosmos', hi: 'सूर्य — ब्रह्माण्ड की आत्मा' } },
  { devanagari: 'आत्मकारक', transliteration: 'Ātmakāraka', meaning: { en: 'Significator of the soul', hi: 'आत्मा का कारक' } },
  { devanagari: 'प्रत्यक्षदेव', transliteration: 'Pratyakṣadeva', meaning: { en: 'The visible God', hi: 'प्रत्यक्ष देवता' } },
  { devanagari: 'दिनकर', transliteration: 'Dinakara', meaning: { en: 'Maker of the day', hi: 'दिन का निर्माता' } },
  { devanagari: 'सविता', transliteration: 'Savitā', meaning: { en: 'The vivifier, the impeller', hi: 'प्रेरक, जीवनदाता' } },
  { devanagari: 'भानु', transliteration: 'Bhānu', meaning: { en: 'The luminous one', hi: 'प्रकाशमान' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Aries (Mesha) — deepest exaltation at 10°', hi: 'मेष — 10° पर परम उच्च' },
  debilitation: { en: 'Libra (Tula) — deepest debilitation at 10°', hi: 'तुला — 10° पर परम नीच' },
  ownSign: { en: 'Leo (Simha)', hi: 'सिंह' },
  moolatrikona: { en: 'Leo 0°–20°', hi: 'सिंह 0°–20°' },
  friends: { en: 'Moon, Mars, Jupiter', hi: 'चन्द्र, मंगल, गुरु' },
  enemies: { en: 'Venus, Saturn', hi: 'शुक्र, शनि' },
  neutral: { en: 'Mercury', hi: 'बुध' },
};

// ─── Astronomical Profile ──────────────────────────────────────────────
const ASTRONOMICAL = {
  orbitalPeriod: { en: 'Apparent orbital period: ~365.25 days (one sidereal year). The Sun appears to move through all 12 signs in approximately 365.25 days, spending roughly 30 days in each sign. This apparent motion is actually the Earth orbiting the Sun, but from a geocentric (Earth-centered) perspective used in Jyotish, the Sun moves through the zodiac.', hi: 'दृश्य कक्षीय अवधि: ~365.25 दिन (एक नाक्षत्रिक वर्ष)। सूर्य लगभग 365.25 दिनों में सभी 12 राशियों से गुजरता प्रतीत होता है, प्रत्येक राशि में लगभग 30 दिन बिताता है। ज्योतिष में भू-केन्द्रित दृष्टिकोण से सूर्य राशिचक्र में गति करता है।' },
  dailyMotion: { en: 'Average daily motion: ~0°59\'08" (just under 1° per day). The Sun\'s daily motion is remarkably consistent compared to other planets — varying only between about 0°57\' (when Earth is at aphelion in July) and 1°01\' (when Earth is at perihelion in January). This consistency is why the solar calendar is so reliable. In Jyotish, the Sun\'s transit into a new sign (Sankranti) is a major event, occurring approximately every 30 days.', hi: 'औसत दैनिक गति: ~0°59\'08" (प्रतिदिन लगभग 1°)। सूर्य की दैनिक गति अन्य ग्रहों की तुलना में अत्यन्त स्थिर है — लगभग 0°57\' (जुलाई में) से 1°01\' (जनवरी में) के बीच। इसी स्थिरता से सौर पंचांग विश्वसनीय है। नई राशि में सूर्य का प्रवेश (संक्रान्ति) प्रत्येक ~30 दिन पर होता है।' },
  synodicPeriod: { en: 'Synodic period: Not applicable. Since the Sun is the reference point for synodic periods of all other planets, it does not have its own synodic period. All other planets\' synodic periods are measured relative to the Sun — the time between successive conjunctions with the Sun as seen from Earth.', hi: 'आवर्तन काल: लागू नहीं। चूँकि सूर्य सभी अन्य ग्रहों के आवर्तन काल का सन्दर्भ बिन्दु है, इसका अपना आवर्तन काल नहीं होता। अन्य सभी ग्रहों का आवर्तन काल सूर्य के सापेक्ष मापा जाता है।' },
  retrograde: { en: 'Retrograde: Never. The Sun never retrogrades in geocentric astronomy because it is the central reference body. While all five true planets (Mars through Saturn) and the lunar nodes exhibit retrograde motion, the Sun and Moon always move direct (forward through the zodiac). This astronomical fact reinforces the Sun\'s symbolism in Jyotish — the Atman (soul) never wavers, never retreats, never compromises. It is the constant around which all other planetary experiences revolve.', hi: 'वक्री गति: कभी नहीं। सूर्य भू-केन्द्रित खगोलशास्त्र में कभी वक्री नहीं होता क्योंकि यह केन्द्रीय सन्दर्भ पिण्ड है। पाँच वास्तविक ग्रह और चन्द्र की गाँठें वक्री होती हैं, किन्तु सूर्य और चन्द्र सदैव मार्गी रहते हैं। यह तथ्य ज्योतिष में सूर्य के प्रतीकवाद को पुष्ट करता है — आत्मा कभी डगमगाती नहीं।' },
  combustion: { en: 'Combustion (Asta): The Sun is the cause of combustion for all other planets. When a planet comes too close to the Sun in longitude, it becomes "combust" (Asta) — its significations weaken as the Sun\'s brilliance overpowers it. The combustion orbs are: Moon 12°, Mars 17°, Mercury 14° (12° when retrograde), Jupiter 11°, Venus 10° (8° when retrograde), Saturn 15°. A combust planet loses its independent power and becomes subservient to the Sun\'s agenda. This is one of the most important concepts in Jyotish — a combust Venus, for instance, weakens marriage and romantic significations regardless of sign or house placement.', hi: 'अस्त (दहन): सूर्य सभी अन्य ग्रहों के अस्त होने का कारण है। जब कोई ग्रह देशान्तर में सूर्य के अत्यन्त निकट आता है, वह "अस्त" हो जाता है — उसकी कारकत्व शक्ति क्षीण होती है। अस्त कोण: चन्द्र 12°, मंगल 17°, बुध 14° (वक्री में 12°), गुरु 11°, शुक्र 10° (वक्री में 8°), शनि 15°। अस्त ग्रह स्वतन्त्र शक्ति खो देता है।' },
  astroVsAstrol: { en: 'Astronomically, the Sun is a G-type main-sequence star with a surface temperature of about 5,778 K, located 149.6 million km from Earth. Astrologically, it represents the immortal soul (Atman), personal authority, and the father principle. The astronomical fact that all planets orbit the Sun directly maps to the astrological principle that the Sun is the king (Raja) around whom all other planetary significations revolve. The Sun\'s consistent motion through the zodiac symbolizes dharmic constancy — unlike Mercury or Venus, which waver near the Sun, the Atman holds its course.', hi: 'खगोलीय रूप से सूर्य G-प्रकार का मुख्य-अनुक्रम तारा है, सतह तापमान ~5,778 K, पृथ्वी से 149.6 मिलियन किमी दूर। ज्योतिषीय रूप से यह अमर आत्मा, व्यक्तिगत अधिकार और पितृ सिद्धान्त है। सभी ग्रहों का सूर्य की परिक्रमा करना ज्योतिषीय सिद्धान्त से सीधे जुड़ता है कि सूर्य राजा है जिसके चारों ओर सभी ग्रह कारकत्व घूमते हैं।' },
};

// ─── Practical Application ────────────────────────────────────────────
const PRACTICAL = {
  assessStrength: { en: 'To assess the Sun\'s strength in your chart, check these factors in order: (1) Sign placement — exalted in Aries, own sign Leo, debilitated in Libra. (2) House placement — Sun is strongest in the 10th house (Digbala) and in kendras/trikonas generally. (3) Aspects — benefic aspects from Jupiter or Moon strengthen; malefic aspects from Saturn, Rahu, or Ketu weaken. (4) Nakshatra — the nakshatra lord colors the Sun\'s expression. (5) Combustion — the Sun cannot be combust, but check if it is closely conjunct malefics. (6) Shadbala score — the six-fold strength calculation gives a numerical value for comparison.', hi: 'अपनी कुण्डली में सूर्य के बल का आकलन करने के लिए क्रम से जाँचें: (1) राशि स्थिति — मेष में उच्च, सिंह स्वराशि, तुला में नीच। (2) भाव स्थिति — 10वें भाव में सबसे बलवान (दिग्बल), केन्द्र/त्रिकोण में शुभ। (3) दृष्टि — गुरु/चन्द्र की शुभ दृष्टि बल देती है; शनि/राहु/केतु की दृष्टि दुर्बल करती है। (4) नक्षत्र — नक्षत्र स्वामी सूर्य की अभिव्यक्ति को रंगता है। (5) षड्बल अंक।' },
  strongIndicators: { en: 'Signs of a strong Sun in your life: You naturally command respect without demanding it. Authority figures (bosses, government, father) are supportive. You have clear life purpose and strong willpower. Your physical constitution is robust, especially the heart and eyes. You wake up energized and have a consistent daily routine. People look to you for leadership in crisis. Government or institutional processes work smoothly for you. Your relationship with your father is healthy and respectful.', hi: 'आपके जीवन में बलवान सूर्य के संकेत: आप स्वाभाविक रूप से बिना माँगे सम्मान पाते हैं। अधिकारी व्यक्ति (बॉस, सरकार, पिता) सहायक हैं। स्पष्ट जीवन उद्देश्य और दृढ़ इच्छाशक्ति। शारीरिक संरचना सुदृढ़, विशेषतः हृदय और नेत्र। सरकारी प्रक्रियाएँ सुचारू। पिता से स्वस्थ सम्बन्ध।' },
  weakIndicators: { en: 'Signs of a weak Sun in your life: Chronic low self-esteem or identity confusion — you don\'t know what you stand for. Conflicts with authority figures, government problems (tax issues, visa rejections, licensing problems). Father is absent, ill, or the relationship is strained. Eye or heart problems. Difficulty making decisions or asserting yourself. Others take credit for your work. You feel invisible in group settings. Chronic fatigue despite adequate rest. Bones and spine may be weak.', hi: 'आपके जीवन में दुर्बल सूर्य के संकेत: दीर्घकालिक कम आत्मसम्मान या पहचान का भ्रम। अधिकारियों से संघर्ष, सरकारी समस्याएँ (कर, वीज़ा, लाइसेंस)। पिता अनुपस्थित, बीमार या सम्बन्ध तनावपूर्ण। नेत्र या हृदय रोग। निर्णय लेने में कठिनाई। दूसरे आपके काम का श्रेय लेते हैं। दीर्घकालिक थकान।' },
  whenToRemediate: { en: 'Seek remedies when: The Sun is debilitated (in Libra), combust by close conjunction with a strong malefic, placed in dusthana houses (6th, 8th, 12th) without cancellation, or the lord of a dusthana placed with the Sun. Also during Surya Mahadasha if the Sun is afflicted. Do NOT seek Sun remedies when: The Sun is exalted, in own sign, well-placed in a kendra or trikona with benefic aspects — strengthening an already-strong Sun can make you arrogant, domineering, and create unnecessary conflicts with others. Remedies are medicine — you don\'t take medicine when you\'re healthy.', hi: 'उपाय कब करें: सूर्य नीच (तुला में), प्रबल पापग्रह के साथ अस्त, दुस्थान (6, 8, 12) में बिना भंग के, या दुस्थान स्वामी सूर्य के साथ। पीड़ित सूर्य महादशा में भी। उपाय कब न करें: सूर्य उच्च, स्वराशि, शुभ दृष्टि सहित केन्द्र/त्रिकोण में हो — पहले से बलवान सूर्य को बल देना अहंकारी और दबंग बना सकता है।' },
  misconceptions: { en: 'Common misconceptions about the Sun: (1) "Sun is always malefic" — Wrong. Sun is a natural benefic for dharma and spiritual growth. Its cruelty burns impurities, like fire purifies gold. (2) "Sun in the 7th house means no marriage" — Exaggeration. It means the ego must learn to share power, but marriage happens, often to a strong-willed partner. (3) "Wearing a Ruby will solve all father issues" — A Ruby amplifies Sun energy. If the Sun is badly placed, amplifying it can worsen ego clashes and authority conflicts. (4) "Sun sign is unimportant in Vedic astrology" — The Sun sign determines your solar month (Masa), your Ayanamsha-adjusted zodiac position, and your relationship with authority. It is very important, just differently weighted than in Western astrology.', hi: 'सूर्य के बारे में आम भ्रान्तियाँ: (1) "सूर्य सदा अशुभ" — गलत। सूर्य धर्म और आध्यात्मिक विकास के लिए स्वाभाविक शुभ। (2) "7वें भाव में सूर्य = विवाह नहीं" — अतिशयोक्ति। अहंकार को शक्ति साझा करना सीखना होता है। (3) "माणिक्य से पिता समस्या हल" — माणिक्य सूर्य ऊर्जा बढ़ाता है, दुर्बल सूर्य को बढ़ाना अहंकार बढ़ा सकता है। (4) "वैदिक ज्योतिष में सूर्य राशि महत्त्वहीन" — भिन्न रूप से महत्त्वपूर्ण।' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Father, king, government authority, leader, physician', hi: 'पिता, राजा, सरकारी अधिकारी, नेता, चिकित्सक' },
  bodyParts: { en: 'Heart, bones, spine, right eye (male) / left eye (female), stomach, head', hi: 'हृदय, अस्थि, रीढ़, दायाँ नेत्र (पुरुष) / बायाँ नेत्र (स्त्री), उदर, मस्तक' },
  professions: { en: 'Government service, politics, medicine, administration, goldsmithing, temple priest', hi: 'सरकारी सेवा, राजनीति, चिकित्सा, प्रशासन, स्वर्णकारी, पुजारी' },
  materials: { en: 'Gold, copper, ruby (Manikya), wheat, saffron, red sandalwood', hi: 'स्वर्ण, ताम्र, माणिक्य, गेहूँ, केसर, रक्त चन्दन' },
  direction: { en: 'East', hi: 'पूर्व' },
  day: { en: 'Sunday (Ravivara)', hi: 'रविवार' },
  color: { en: 'Deep red / copper', hi: 'गहरा लाल / ताम्र वर्ण' },
  season: { en: 'Grishma (Summer)', hi: 'ग्रीष्म ऋतु' },
  taste: { en: 'Pungent (Katu)', hi: 'कटु (तीखा)' },
  guna: { en: 'Sattva', hi: 'सत्त्व' },
  element: { en: 'Fire (Agni)', hi: 'अग्नि तत्त्व' },
  gender: { en: 'Masculine', hi: 'पुल्लिंग' },
  nature: { en: 'Cruel / Malefic (Krura Graha) — but a natural benefic for dharma', hi: 'क्रूर ग्रह — किन्तु धर्म के लिए स्वाभाविक शुभ' },
};

// ─── Sun in 12 Signs ───────────────────────────────────────────────────
const SUN_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: 'Exalted',
    effect: { en: 'Sun is exalted here — maximum confidence, leadership ability, pioneering spirit. The native commands natural authority. Strong health, courage, and initiative. Can be domineering if afflicted. Government positions, military, or entrepreneurship come naturally. The 10° point is the deepest exaltation — kings are born with this placement.', hi: 'सूर्य यहाँ उच्च है — अधिकतम आत्मविश्वास, नेतृत्व क्षमता, अग्रणी भावना। जातक में स्वाभाविक अधिकार होता है। उत्तम स्वास्थ्य, साहस और पहल। पीड़ित होने पर दबंग हो सकता है।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: 'Neutral',
    effect: { en: 'Sun in a Venus-ruled sign creates a person who values material comfort and aesthetic beauty but may struggle with ego in relationships. Steady accumulation of wealth, love of fine arts and luxury. Fixed determination but potential stubbornness. Good for finance, agriculture, and artistic pursuits.', hi: 'शुक्र-शासित राशि में सूर्य भौतिक सुख और सौन्दर्य को महत्त्व देता है। धन का स्थिर संचय, ललित कला और विलास का प्रेम। दृढ़ संकल्प किन्तु हठी हो सकता है।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: 'Neutral',
    effect: { en: 'Sun in Mercury\'s sign gives intellectual brilliance, communication skills, and versatility. The native shines through writing, teaching, or commerce. Dual nature can scatter focus. Quick wit but may lack emotional depth. Good for journalism, education, trade, and literary work.', hi: 'बुध की राशि में सूर्य बौद्धिक प्रतिभा, संवाद कौशल और बहुमुखी प्रतिभा देता है। लेखन, शिक्षण या वाणिज्य में चमकता है। द्वैत स्वभाव ध्यान बिखेर सकता है।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: 'Friend\'s sign',
    effect: { en: 'Sun in Moon\'s sign — the soul illuminates the mind. Deep emotional intelligence, strong connection to mother and homeland. Natural nurturing authority. Can rise in government through public service. Emotional sensitivity may be both strength and vulnerability. Excellent for hospitality, social work, and psychology.', hi: 'चन्द्र की राशि में सूर्य — आत्मा मन को प्रकाशित करती है। गहरी भावनात्मक बुद्धि, माता और मातृभूमि से गहरा जुड़ाव। लोक सेवा से सरकार में उन्नति।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: 'Own sign',
    effect: { en: 'Sun in its own sign — the king on his throne. Maximum self-expression, dignity, generosity, and creative power. Natural born leaders, performers, and administrators. Regal bearing, strong willpower, and magnetic personality. Can be arrogant if unchecked. This is the most powerful placement for authority, fame, and governmental positions.', hi: 'सूर्य अपनी राशि में — राजा अपने सिंहासन पर। अधिकतम आत्माभिव्यक्ति, गरिमा, उदारता और सृजनात्मक शक्ति। स्वाभाविक नेता, कलाकार और प्रशासक।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: 'Neutral',
    effect: { en: 'Sun in Mercury\'s earth sign gives analytical precision, service orientation, and humility. The native shines through detailed work, healing professions, and practical expertise. Health consciousness is strong. Can be overly critical or perfectionist. Excellent for medicine, accounting, research, and skilled craftsmanship.', hi: 'बुध की पृथ्वी राशि में सूर्य विश्लेषणात्मक सूक्ष्मता, सेवा भाव और विनम्रता देता है। विस्तृत कार्य, चिकित्सा और व्यावहारिक विशेषज्ञता में चमकता है।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: 'Debilitated',
    effect: { en: 'Sun is debilitated here — the ego dissolves in the desire for partnership and compromise. Difficulty asserting oneself, tendency to define identity through relationships. The deepest fall at 10°. However, Neecha Bhanga (cancellation of debilitation) is common and can produce diplomats, judges, and skilled negotiators. The lesson: find inner authority without domination.', hi: 'सूर्य यहाँ नीच है — अहंकार साझेदारी और समझौते की इच्छा में विलीन हो जाता है। आत्म-स्थापना में कठिनाई। 10° पर सबसे गहरी नीचता। तथापि नीच भंग सामान्य है।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: 'Friend\'s sign',
    effect: { en: 'Sun in Mars\'s water sign — intense, transformative, and deeply perceptive. The native has X-ray vision into hidden matters. Research, occult sciences, surgery, and investigation are natural domains. Powerful regenerative ability but can be secretive and manipulative. Strong willpower that survives and thrives through crisis.', hi: 'मंगल की जल राशि में सूर्य — तीव्र, परिवर्तनकारी और गहन अन्तर्दृष्टि। छिपे विषयों में एक्स-रे दृष्टि। शोध, गूढ़ विज्ञान, शल्य चिकित्सा स्वाभाविक क्षेत्र।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Friend\'s sign',
    effect: { en: 'Sun in Jupiter\'s fire sign — the dharmic warrior. Strong moral compass, love of philosophy, higher education, and long-distance travel. Natural teachers, preachers, judges, and advisors. Optimistic and expansive but can be preachy. Excellent for law, religion, academia, and international careers.', hi: 'गुरु की अग्नि राशि में सूर्य — धार्मिक योद्धा। प्रबल नैतिक दिशा, दर्शन, उच्च शिक्षा और दीर्घ यात्रा का प्रेम। स्वाभाविक शिक्षक, उपदेशक, न्यायाधीश।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: 'Enemy\'s sign',
    effect: { en: 'Sun in Saturn\'s earth sign — authority through discipline, patience, and hard work. Slow but steady rise to power. The native earns respect through perseverance, not birthright. Government bureaucracy, large organizations, and traditional hierarchies suit this placement. Can be cold or overly ambitious.', hi: 'शनि की पृथ्वी राशि में सूर्य — अनुशासन, धैर्य और कठिन परिश्रम से अधिकार। धीमी किन्तु स्थिर उन्नति। सरकारी नौकरशाही और बड़े संगठन अनुकूल।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: 'Enemy\'s sign',
    effect: { en: 'Sun in Saturn\'s air sign — the reformer and humanitarian. Identity tied to social causes, networks, and collective progress. Unconventional leadership style. Can struggle with personal ego vs. group identity. Good for technology, social organizations, NGOs, and democratic institutions. Scientific temperament.', hi: 'शनि की वायु राशि में सूर्य — सुधारक और मानवतावादी। सामाजिक कारणों, नेटवर्क और सामूहिक प्रगति से जुड़ी पहचान। अपरम्परागत नेतृत्व शैली।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Friend\'s sign',
    effect: { en: 'Sun in Jupiter\'s water sign — the spiritual seeker. Identity dissolves into universal compassion and artistic vision. Intuitive, empathetic, and drawn to spiritual life. Can lack worldly ambition. Excellent for music, art, healing, charity, and monastic pursuits. The soul remembers its divine origin here.', hi: 'गुरु की जल राशि में सूर्य — आध्यात्मिक साधक। पहचान सार्वभौमिक करुणा और कलात्मक दृष्टि में विलीन। अन्तर्ज्ञानी, सहानुभूतिपूर्ण, आध्यात्मिक जीवन की ओर आकर्षित।' } },
];

// ─── Sun in 12 Houses ──────────────────────────────────────────────────
const SUN_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'Strong personality, leadership qualities, good health and vitality. The native is confident, authoritative, and self-driven. Can indicate government connections. If afflicted, ego problems and strained relationships with father. Physical constitution is generally robust. This is one of the best placements for worldly success — the soul shines through the body directly.', hi: 'सुदृढ़ व्यक्तित्व, नेतृत्व गुण, उत्तम स्वास्थ्य और जीवनशक्ति। आत्मविश्वासी, अधिकारपूर्ण और स्वप्रेरित। सरकारी संबंध संभव। पीड़ित होने पर अहंकार की समस्या।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Wealth through government or authority positions. Commanding speech with natural authority. The native can earn from gold, gems, or government contracts. Family pride is strong. Right eye may have issues if afflicted. Can indicate wealth from father\'s side. Speech carries weight and can influence others. Food preferences tend toward warm, spiced, and royal cuisine.', hi: 'सरकारी या अधिकार पदों से धन। अधिकारपूर्ण वाणी। स्वर्ण, रत्न या सरकारी अनुबंधों से कमाई। पारिवारिक गर्व प्रबल।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Courageous, bold communication, strong willpower. Good for writing, media, and short journeys. May dominate siblings. The native has powerful arms and initiative. Artistic and creative expression is strong. Can indicate success in publishing, advertising, or military communication roles. Younger siblings may face challenges.', hi: 'साहसी, स्पष्ट संवाद, दृढ़ इच्छाशक्ति। लेखन, मीडिया और लघु यात्रा के लिए शुभ। भाई-बहनों पर प्रभुत्व हो सकता है। शक्तिशाली भुजाएँ और पहल।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'Struggles with domestic peace and relationship with mother. The Sun burns the house of comfort — the native may live away from birthplace. However, can own property and vehicles through government connection. Internal restlessness drives achievement. The heart burns with ambition rather than contentment. Government housing or land benefits possible.', hi: 'घरेलू शान्ति और माता के साथ सम्बन्ध में कठिनाई। सूर्य सुख के भाव को जलाता है — जातक जन्मभूमि से दूर रह सकता है। तथापि सरकारी सम्पत्ति संभव।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Brilliant intelligence, creative genius, and natural authority in education. The native shines in speculative ventures, politics, and performing arts. Children may be fewer but distinguished. Romance carries a regal quality. Mantra siddhi and spiritual practices are strong. Government recognition for intellectual contributions. Can produce ministers, advisors, and creative directors.', hi: 'प्रतिभाशाली बुद्धि, सृजनात्मक प्रतिभा, शिक्षा में स्वाभाविक अधिकार। सट्टा, राजनीति और प्रदर्शन कला में चमक। संतान कम किन्तु विशिष्ट। मन्त्र सिद्धि प्रबल।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'Powerful placement — Sun destroys enemies, overcomes obstacles, and thrives in competitive environments. Excellent for law, military, medicine, and civil service. Victory in litigation and disputes. The native serves through authority. Can indicate digestive fire issues but overall strong resistance to disease. One of the best placements for a government career.', hi: 'शक्तिशाली स्थिति — सूर्य शत्रुओं का नाश करता है, बाधाओं पर विजय पाता है। विधि, सेना, चिकित्सा, सिविल सेवा के लिए उत्कृष्ट। मुकदमों में विजय।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'Sun here sets (7th is the western horizon) — the ego may overpower partnerships. Late marriage or dominating spouse dynamics. However, the partner may have a strong personality, possibly connected to government. Business partnerships with authority figures. Travel to foreign lands for work. The native must learn to share power.', hi: 'सूर्य यहाँ अस्त होता है — अहंकार साझेदारियों पर हावी हो सकता है। विलम्बित विवाह या दबंग वैवाहिक गतिशीलता। तथापि जीवनसाथी प्रबल व्यक्तित्व का।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'Hidden power, occult knowledge, and transformative experiences. The native may have a complicated relationship with father or authority. Inheritance is possible but may come through struggle. Interest in research, occult sciences, and mysteries. Health issues related to heart, bones, or eyes may arise. Government secrets or classified work. Life transforms through crises.', hi: 'गुप्त शक्ति, गूढ़ ज्ञान, परिवर्तनकारी अनुभव। पिता या अधिकार के साथ जटिल सम्बन्ध। विरासत संभव किन्तु संघर्ष से। शोध और रहस्य में रुचि।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'Extremely auspicious — the soul aligned with dharma. Father is usually prominent and successful. Strong moral compass, love of philosophy, law, and religion. Long-distance travel for pilgrimage or education. The native becomes a guru figure. Government support for religious or educational activities. This placement can produce judges, professors, and spiritual leaders. Luck is strong.', hi: 'अत्यन्त शुभ — आत्मा धर्म के साथ एकरूप। पिता प्रायः प्रतिष्ठित और सफल। दर्शन, विधि और धर्म का प्रेम। तीर्थयात्रा या शिक्षा हेतु दीर्घ यात्रा। भाग्य प्रबल।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'The most powerful angular placement — Sun is Digbali (directional strength) here. Commanding career, fame, and public recognition. Government positions at the highest levels. The native\'s profession defines their identity. Strong relationship with authority and father. Can become a public figure, administrator, or political leader. Honors and awards are likely.', hi: 'सबसे शक्तिशाली केन्द्र स्थिति — सूर्य यहाँ दिग्बली। प्रभावशाली करियर, यश और सार्वजनिक मान्यता। उच्चतम स्तर पर सरकारी पद। पद व्यक्ति की पहचान बनाता है।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Excellent for wealth and fulfillment of desires. Large income, powerful social network, and influential friends. Elder siblings may be prominent. Gains through government, speculation, or large organizations. The native achieves their ambitions. Can indicate political connections and community leadership. Financial success comes through authority and recognition.', hi: 'धन और इच्छा पूर्ति के लिए उत्कृष्ट। बड़ी आय, शक्तिशाली सामाजिक नेटवर्क, प्रभावशाली मित्र। सरकार, सट्टा या बड़े संगठनों से लाभ। महत्वाकांक्षा पूर्ण होती है।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'Sun here loses its outward fire — the ego dissolves into spiritual seeking, foreign lands, and isolation. Can indicate government expenses, travel abroad for work, or imprisonment in extreme cases. The native\'s authority operates behind the scenes. Hospitals, ashrams, research labs, and foreign postings are indicated. Spiritual enlightenment through surrender of ego. Left eye may be affected.', hi: 'सूर्य यहाँ बाह्य अग्नि खो देता है — अहंकार आध्यात्मिक खोज, विदेश और एकान्त में विलीन। सरकारी खर्च, विदेश यात्रा या कारावास। पर्दे के पीछे अधिकार।' } },
];

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 6,
  overview: {
    en: 'The Sun\'s Vimshottari Mahadasha lasts 6 years — the shortest of all planetary periods. Despite its brevity, it is one of the most transformative. During this period, the native\'s relationship with authority, father, government, and personal identity come into sharp focus. Career advancement or setbacks in government are likely. Health of the heart and eyes may need attention. The soul\'s true purpose becomes visible.',
    hi: 'सूर्य की विंशोत्तरी महादशा 6 वर्ष चलती है — सभी ग्रह काल में सबसे छोटी। संक्षिप्त होने के बावजूद, यह सबसे परिवर्तनकारी में से एक है। इस अवधि में अधिकार, पिता, सरकार और व्यक्तिगत पहचान के साथ सम्बन्ध स्पष्ट होते हैं।',
  },
  strongSun: {
    en: 'If Sun is well-placed (own sign, exalted, or in a kendra/trikona): Promotion, government recognition, father\'s support, health improvement, spiritual clarity, leadership opportunities, land or property from government.',
    hi: 'यदि सूर्य सुस्थित है (स्वराशि, उच्च, या केन्द्र/त्रिकोण में): पदोन्नति, सरकारी मान्यता, पिता का सहयोग, स्वास्थ्य सुधार, आध्यात्मिक स्पष्टता, नेतृत्व के अवसर।',
  },
  weakSun: {
    en: 'If Sun is afflicted (debilitated, combust, or in dusthana): Conflicts with authority, father\'s health issues, eye/heart problems, ego clashes at work, government penalties, loss of position.',
    hi: 'यदि सूर्य पीड़ित है (नीच, अस्त, या दुस्थान में): अधिकार से संघर्ष, पिता के स्वास्थ्य में समस्या, नेत्र/हृदय रोग, कार्यस्थल पर अहंकार टकराव, सरकारी दण्ड।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', transliteration: 'Om Hraam Hreem Hraum Sah Suryaya Namah', count: '7,000 or 6,000 times in 40 days', en: 'The Surya Beej Mantra — chant facing east at sunrise, preferably on Sundays', hi: 'सूर्य बीज मन्त्र — रविवार को सूर्योदय के समय पूर्व दिशा की ओर मुख करके जाप करें' },
  gemstone: { en: 'Ruby (Manikya) — set in gold, worn on the ring finger of the right hand on a Sunday during Shukla Paksha sunrise. Minimum 3 carats. Must touch the skin.', hi: 'माणिक्य — स्वर्ण में जड़ित, रविवार को शुक्ल पक्ष में सूर्योदय के समय दाहिने हाथ की अनामिका में धारण करें। न्यूनतम 3 कैरेट।' },
  charity: { en: 'Donate wheat, jaggery (gur), copper, red cloth, or red flowers on Sundays. Feed cows with wheat and jaggery.', hi: 'रविवार को गेहूँ, गुड़, ताम्र, लाल वस्त्र या लाल पुष्प दान करें। गायों को गेहूँ और गुड़ खिलाएँ।' },
  fasting: { en: 'Sunday fasting — eat only one meal after sunset, or consume only fruits and milk during the day.', hi: 'रविवार का उपवास — केवल सूर्यास्त के बाद एक भोजन करें, या दिन में केवल फल और दूध लें।' },
  worship: { en: 'Offer water (Arghya) to the rising Sun every morning with a copper vessel, adding red flowers and red sandalwood. Recite Aditya Hridayam Stotra. Visit Surya temples on Sundays.', hi: 'प्रतिदिन ताम्र पात्र से उदीयमान सूर्य को अर्घ्य दें, लाल पुष्प और रक्त चन्दन मिलाएँ। आदित्य हृदयम् स्तोत्र का पाठ करें। रविवार को सूर्य मन्दिर जाएँ।' },
  yantra: { en: 'Surya Yantra — a 3×3 magic square with a sum of 15 in each row/column. Install on a copper plate, worship on Sundays.', hi: 'सूर्य यन्त्र — 3×3 जादुई वर्ग जिसमें प्रत्येक पंक्ति/स्तम्भ का योग 15 है। ताम्र पत्र पर स्थापित करें, रविवार को पूजन करें।' },
  dietary: { en: 'Dietary recommendations for strengthening the Sun: Consume wheat-based foods (roti, bread, daliya), jaggery (gur), saffron-infused milk, honey, cardamom, and dry fruits — especially almonds and walnuts. Avoid excessive salt and sour foods during Surya remedial periods. Eat your main meal during the Sun\'s strongest hours (10 AM to 2 PM). Drink warm water with a pinch of turmeric at sunrise. Foods that are golden, orange, or red in color naturally resonate with Sun energy — oranges, carrots, mangoes, and pomegranates are excellent.', hi: 'सूर्य बल बढ़ाने के आहार: गेहूँ-आधारित खाद्य (रोटी, दलिया), गुड़, केसर-दूध, शहद, इलायची और सूखे मेवे — विशेषतः बादाम और अखरोट। सूर्य उपाय काल में अधिक नमक और खट्टे से बचें। मुख्य भोजन सूर्य की प्रबल अवधि (10 AM - 2 PM) में करें। सूर्योदय पर हल्दी मिश्रित गरम जल पियें। सुनहरे, नारंगी या लाल रंग के फल सूर्य ऊर्जा से अनुकूल।' },
  colorTherapy: { en: 'Color therapy for the Sun: Wear deep red, copper, orange, or golden-yellow colors on Sundays and during important meetings with authority figures. Avoid dark blue and black on Sundays. Your workspace should have warm lighting — avoid cold fluorescent lights if possible. A copper or gold-colored item on your desk strengthens the Sun\'s influence. The Ruby\'s red color is the concentrated essence of Sun energy, but even wearing a red or orange shirt on Sundays can subtly align you with solar vibrations.', hi: 'सूर्य के लिए रंग चिकित्सा: रविवार और अधिकारियों से मिलते समय गहरा लाल, ताम्र, नारंगी या सुनहरा-पीला पहनें। रविवार को गहरा नीला और काला न पहनें। कार्यस्थल में गरम प्रकाश रखें। मेज पर ताम्र या सुनहरी वस्तु सूर्य प्रभाव बढ़ाती है।' },
  behavioral: { en: 'Behavioral remedies (most powerful): (1) Wake before sunrise — witnessing dawn aligns you with solar energy daily. (2) Maintain a consistent daily routine — the Sun represents order and regularity. (3) Respect your father and authority figures, even if the relationship is difficult — resistance to authority weakens the Sun. (4) Take leadership responsibility in your community or workplace — the Sun strengthens through use. (5) Practice Surya Namaskar (12 rounds minimum) every morning. (6) Spend 15-20 minutes in morning sunlight (before 9 AM) for vitamin D and solar attunement. (7) Keep your promises — the Sun represents truth (Satya). Breaking promises weakens it. (8) Donate time to governance, civic duty, or community leadership — the Sun rules collective responsibility.', hi: 'व्यवहारिक उपाय (सबसे शक्तिशाली): (1) सूर्योदय से पहले जागें — प्रातःकाल सूर्य ऊर्जा से जुड़ें। (2) नियमित दिनचर्या बनाएँ — सूर्य व्यवस्था और नियमितता है। (3) पिता और अधिकारियों का सम्मान करें। (4) समुदाय या कार्यस्थल में नेतृत्व लें। (5) प्रतिदिन सूर्य नमस्कार (न्यूनतम 12 चक्र)। (6) प्रातः 15-20 मिनट सूर्य प्रकाश में बिताएँ। (7) वचन निभाएँ — सूर्य सत्य है। (8) शासन, नागरिक कर्तव्य में समय दान करें।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'Surya is the son of Sage Kashyapa and Aditi, making him one of the twelve Adityas. He rides a chariot drawn by seven horses (representing the seven days and the seven colors of light) driven by Aruna, the god of dawn. His wives are Sanjna (Consciousness) and Chhaya (Shadow). When Sanjna could not bear his brilliance, she left her shadow (Chhaya) and performed tapas in the forest — this story explains the birth of Shani (Saturn) from Chhaya, and the eternal tension between Sun and Saturn in Jyotish.',
    hi: 'सूर्य ऋषि कश्यप और अदिति के पुत्र हैं, जो उन्हें बारह आदित्यों में से एक बनाता है। वे सात अश्वों (सप्त वार और सप्त वर्णों का प्रतीक) से खींचे रथ पर सवार होते हैं, जिसका सारथी अरुण (उषा देव) है। उनकी पत्नियाँ संज्ञा (चेतना) और छाया हैं। जब संज्ञा उनके तेज को सहन नहीं कर सकी, तो उसने अपनी छाया छोड़कर वन में तपस्या की — यह कथा छाया से शनि के जन्म और ज्योतिष में सूर्य-शनि के शाश्वत तनाव की व्याख्या करती है।',
  },
  temples: {
    en: 'Major Surya temples: Konark Sun Temple (Odisha) — a UNESCO World Heritage Site shaped as a massive chariot; Modhera Sun Temple (Gujarat) — designed so the first rays of the equinox sun illuminate the sanctum; Dakshinaarka Temple (Varanasi) — one of the oldest Sun temples in India; Suryanaar Kovil (Tamil Nadu) — one of the Navagraha temples.',
    hi: 'प्रमुख सूर्य मन्दिर: कोणार्क सूर्य मन्दिर (ओडिशा) — विशाल रथ आकृति का UNESCO विश्व धरोहर; मोढेरा सूर्य मन्दिर (गुजरात) — विषुव सूर्य की पहली किरणें गर्भगृह को प्रकाशित करें; दक्षिणार्क मन्दिर (वाराणसी) — भारत के सबसे प्राचीन सूर्य मन्दिरों में; सूर्यनार कोविल (तमिलनाडु) — नवग्रह मन्दिरों में एक।',
  },
  gayatri: {
    en: 'The Gayatri Mantra (Rigveda 3.62.10) is the most sacred hymn dedicated to Savita (the Sun): "Om Bhur Bhuvaḥ Swaḥ, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Naḥ Prachodayat." It means: "We meditate upon the divine light of the luminous Sun; may it illuminate our intellect."',
    hi: 'गायत्री मन्त्र (ऋग्वेद 3.62.10) सविता (सूर्य) को समर्पित सबसे पवित्र स्तुति है: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्।" अर्थ: "हम तेजस्वी सूर्य के दिव्य प्रकाश का ध्यान करते हैं; वह हमारी बुद्धि को प्रेरित करे।"',
  },
  chhathPuja: {
    en: 'Chhath Puja is the most significant festival dedicated exclusively to Surya, celebrated primarily in Bihar, Jharkhand, and eastern Uttar Pradesh. This four-day festival involves rigorous fasting, standing in water at sunrise and sunset, and offering Arghya to the rising and setting Sun. It is one of the few Hindu festivals where the setting Sun (Astachal ka Surya) is worshipped — symbolizing gratitude not just for life-giving energy but also for the cycle of death and rebirth. The festival honors Chhathi Maiya (Usha, the Sun\'s consort in some traditions) alongside Surya. Makar Sankranti marks the Sun\'s northward journey (Uttarayana) and is celebrated across India as a solar harvest festival.',
    hi: 'छठ पूजा विशेष रूप से सूर्य को समर्पित सबसे महत्त्वपूर्ण त्योहार है, मुख्यतः बिहार, झारखण्ड और पूर्वी उत्तर प्रदेश में मनाया जाता है। चार दिवसीय उपवास, जल में खड़े होकर सूर्योदय और सूर्यास्त पर अर्घ्य दिया जाता है। यह उन दुर्लभ हिन्दू त्योहारों में है जहाँ अस्त होते सूर्य की भी पूजा होती है। मकर संक्रान्ति सूर्य की उत्तरायण यात्रा का प्रतीक है।',
  },
  otherTraditions: {
    en: 'In Buddhism, the Sun is associated with Vairocana Buddha ("The Illuminator"), whose name derives from the same Sanskrit root as Vivasvan (another name for Surya). In Jain tradition, the Sun is revered as a celestial being (Jyotishi Deva) and Surya Puja is part of the daily ritual for many Jain practitioners. The twelve Adityas (solar deities) correspond to the twelve months of the year and are invoked in the Surya Namaskar (Sun Salutation) sequence of yoga — each of the twelve postures honors one Aditya. The Persian Mithra, the Roman Sol Invictus, and the Egyptian Ra all share symbolic parallels with Vedic Surya — the universal archetype of the divine solar king transcends cultural boundaries.',
    hi: 'बौद्ध धर्म में सूर्य वैरोचन बुद्ध ("प्रकाशक") से जुड़ा है, जिनका नाम विवस्वान् (सूर्य का अन्य नाम) से व्युत्पन्न। जैन परम्परा में सूर्य ज्योतिषी देव के रूप में पूजित। बारह आदित्य वर्ष के बारह महीनों से सम्बद्ध, सूर्य नमस्कार की बारह मुद्राओं में प्रत्येक एक आदित्य को सम्मानित करती है। पर्शियन मिथ्र, रोमन सोल इनविक्टस और मिस्री रा सभी वैदिक सूर्य से प्रतीकात्मक समानता रखते हैं।',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Moon', hi: 'चन्द्र' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Father and mother — complementary luminaries. Sun gives soul, Moon gives mind.', hi: 'पिता और माता — परस्पर पूरक ज्योतियाँ। सूर्य आत्मा देता है, चन्द्र मन।' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Fire allies — courage, authority, and action reinforce each other. Sun-Mars conjunction creates Ruchaka-like power.', hi: 'अग्नि मित्र — साहस, अधिकार और कर्म एक-दूसरे को बल देते हैं।' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Guru and king — dharma and authority aligned. This is the basis of many Raja Yogas. Jupiter expands Sun\'s wisdom.', hi: 'गुरु और राजा — धर्म और अधिकार एकरूप। यह अनेक राज योगों का आधार है।' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, relation: { en: 'Neutral (Sun considers Mercury neutral; Mercury considers Sun a friend)', hi: 'सम (सूर्य बुध को सम मानता है; बुध सूर्य को मित्र)' }, note: { en: 'Often conjunct (Budha Aditya Yoga when within 12°) — intellect illuminated by soul. But Mercury combust within ~14° loses analytical independence.', hi: 'प्रायः युति (बुधादित्य योग जब 12° के भीतर) — बुद्धि आत्मा से प्रकाशित। किन्तु ~14° के भीतर अस्त बुध विश्लेषणात्मक स्वतन्त्रता खो देता है।' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'King vs. minister of pleasures — fundamental tension between duty (dharma) and desire (kama). Venus combust is very common and weakens marital/romantic significations.', hi: 'राजा बनाम भोग-विलास का मन्त्री — कर्तव्य (धर्म) और इच्छा (काम) के बीच मौलिक तनाव।' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Father and son in eternal conflict. Sun is authority; Saturn is democracy. Sun is speed; Saturn is delay. Their conjunction or opposition creates intense karmic pressure. Pitru Dosha often involves Sun-Saturn affliction.', hi: 'पिता और पुत्र शाश्वत संघर्ष में। सूर्य अधिकार है; शनि लोकतन्त्र। सूर्य गति है; शनि विलम्ब। इनका संयोग तीव्र कार्मिक दबाव बनाता है।' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Rahu eclipses the Sun — illusion obscures the soul. Grahan Yoga (Sun-Rahu conjunction) can bring sudden rise followed by fall, or fame with scandal. Father may face unusual challenges.', hi: 'राहु सूर्य को ग्रहण करता है — माया आत्मा को ढकती है। ग्रहण योग (सूर्य-राहु युति) अचानक उत्थान फिर पतन ला सकता है।' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Ketu detaches from what Sun represents — the ego surrenders. Sun-Ketu conjunction can indicate spiritual awakening but worldly difficulties, especially with father and government.', hi: 'केतु सूर्य के प्रतिनिधित्व से वैराग्य देता है — अहंकार का समर्पण। सूर्य-केतु युति आध्यात्मिक जागृति किन्तु सांसारिक कठिनाइयाँ ला सकती है।' } },
];

// ─── Key Yogas involving Sun ──────────────────────────────────────────
const KEY_YOGAS = [
  {
    name: { en: 'Budha-Aditya Yoga', hi: 'बुधादित्य योग' },
    condition: { en: 'Sun and Mercury in the same sign (within 12° for full effect)', hi: 'सूर्य और बुध एक राशि में (पूर्ण प्रभाव हेतु 12° के भीतर)' },
    effect: { en: 'Brilliant intellect illuminated by purpose. The native has sharp analytical skills combined with strong self-identity. Excellent for academics, administration, and communication. This is extremely common (Mercury is never more than 28° from the Sun), but the strength varies with the degree of separation and whether Mercury is combust. When Mercury is more than 14° from Sun but in the same sign — this yoga is at its best. When Mercury is combust (within 14°) — the intellect becomes subservient to ego rather than independent.',
      hi: 'उद्देश्य से प्रकाशित प्रतिभाशाली बुद्धि। तीव्र विश्लेषणात्मक कौशल और मजबूत आत्म-पहचान। शिक्षा, प्रशासन और संवाद के लिए उत्कृष्ट। अत्यन्त सामान्य (बुध सूर्य से 28° से अधिक कभी नहीं)। सूर्य से 14° से अधिक दूर किन्तु एक राशि — सर्वोत्तम। 14° के भीतर अस्त — बुद्धि अहंकार के अधीन।' },
  },
  {
    name: { en: 'Veshi Yoga', hi: 'वेशी योग' },
    condition: { en: 'Any planet (except Moon, Rahu, Ketu) in the 2nd house from the Sun', hi: 'कोई ग्रह (चन्द्र, राहु, केतु को छोड़कर) सूर्य से 2nd भाव में' },
    effect: { en: 'Wealth and resources support the soul\'s purpose. The planet in the 2nd from Sun indicates what resources the native naturally accumulates. Mars gives property; Venus gives luxury; Jupiter gives wisdom; Mercury gives knowledge; Saturn gives endurance. This yoga indicates that material support comes naturally to express one\'s identity.',
      hi: 'धन और संसाधन आत्मा के उद्देश्य का समर्थन करते हैं। सूर्य से 2nd में ग्रह बताता है कि जातक स्वाभाविक रूप से क्या संचित करता है। मंगल सम्पत्ति; शुक्र विलास; गुरु ज्ञान; बुध विद्या; शनि सहनशक्ति देता है।' },
  },
  {
    name: { en: 'Vashi Yoga', hi: 'वशी योग' },
    condition: { en: 'Any planet (except Moon, Rahu, Ketu) in the 12th house from the Sun', hi: 'कोई ग्रह (चन्द्र, राहु, केतु को छोड़कर) सूर्य से 12th भाव में' },
    effect: { en: 'Resources and energy that were spent or sacrificed before the soul\'s current expression developed. The planet in the 12th from Sun shows what was given up to become who you are. This yoga gives depth to the personality — the native has already paid a price for their identity. It adds gravitas, past-life maturity, and a sense of having "been through something" that others can feel.',
      hi: 'संसाधन और ऊर्जा जो आत्मा की वर्तमान अभिव्यक्ति से पहले खर्च या समर्पित हुई। सूर्य से 12th में ग्रह बताता है कि आप जो हैं उसके लिए क्या छोड़ा गया। व्यक्तित्व को गहराई, पूर्वजन्म परिपक्वता और गरिमा देता है।' },
  },
  {
    name: { en: 'Ubhayachari Yoga', hi: 'उभयचारी योग' },
    condition: { en: 'Planets on BOTH sides of the Sun (in 2nd and 12th from Sun)', hi: 'सूर्य के दोनों ओर ग्रह (सूर्य से 2nd और 12th में)' },
    effect: { en: 'The most powerful of the solar yogas. The Sun is flanked by resources on both sides — past investment and future accumulation protect and empower the soul. The native has a strong sense of destiny, abundant resources, and a personality that commands respect naturally. This yoga produces leaders who feel "chosen" for their role — their past prepared them and their future supports them.',
      hi: 'सौर योगों में सबसे शक्तिशाली। सूर्य दोनों ओर से संसाधनों से घिरा — पूर्व निवेश और भविष्य संचय आत्मा की रक्षा और शक्ति प्रदान करते हैं। जातक में भाग्य की प्रबल भावना, प्रचुर संसाधन और स्वाभाविक सम्मान। ऐसे नेता जो अपनी भूमिका के लिए "चुने" महसूस करते हैं।' },
  },
  {
    name: { en: 'Grahan Yoga (Sun-Rahu)', hi: 'ग्रहण योग (सूर्य-राहु)' },
    condition: { en: 'Sun conjunct Rahu within 12° in the same sign', hi: 'सूर्य और राहु एक राशि में 12° के भीतर युति' },
    effect: { en: 'The soul is eclipsed by illusion, ambition, and unconventional desires. Can give sudden fame followed by scandal, rise through deception, or an identity crisis where the native doesn\'t know what is real about themselves versus what is performance. Father may have unusual or foreign connections. Government dealings involve hidden complications. In positive expression: breaking free from restrictive tradition, innovative leadership, and cross-cultural identity that enriches rather than confuses.',
      hi: 'आत्मा माया, महत्वाकांक्षा और अपरम्परागत इच्छाओं से ग्रस्त। अचानक यश फिर कलंक, छल से उत्थान, या पहचान संकट। पिता के असामान्य या विदेशी सम्बन्ध। सकारात्मक: प्रतिबन्धक परम्परा से मुक्ति, नवाचारी नेतृत्व, समृद्ध करने वाली बहुसांस्कृतिक पहचान।' },
  },
  {
    name: { en: 'Pitru Dosha (Sun-Saturn)', hi: 'पितृ दोष (सूर्य-शनि)' },
    condition: { en: 'Sun conjunct, aspected by, or in exchange with Saturn; or Sun in Saturn\'s signs', hi: 'सूर्य शनि से युत, दृष्ट, या परिवर्तन में; या शनि की राशि में' },
    effect: { en: 'Ancestral karma related to the father lineage manifests as recurring obstacles in authority, career, and father\'s health. The native may experience chronic delays in recognition, conflicts with government, or feel perpetually undervalued despite competence. Remedies focus on ancestral propitiation (Pitru Tarpan, Shraddha rituals). This dosha diminishes after age 36 (Saturn return) when the native learns to build authority through patience rather than birthright.',
      hi: 'पैतृक वंश का कर्म अधिकार, करियर और पिता स्वास्थ्य में बार-बार बाधाओं के रूप में। मान्यता में दीर्घकालिक विलम्ब, सरकार से संघर्ष। उपाय पितृ तर्पण, श्राद्ध। यह दोष 36 वर्ष (शनि प्रत्यावर्तन) के बाद कम होता है जब धैर्य से अधिकार बनाना सीखा जाता है।' },
  },
];

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/combustion', label: { en: 'Planetary Combustion', hi: 'ग्रह अस्त' } },
  { href: '/learn/shadbala', label: { en: 'Shadbala Strength', hi: 'षड्बल' } },
  { href: '/learn/doshas', label: { en: 'Doshas in Kundali', hi: 'कुण्डली में दोष' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
  { href: '/learn/chandra', label: { en: 'Chandra — The Moon', hi: 'चन्द्र' } },
  { href: '/learn/shani', label: { en: 'Shani — Saturn', hi: 'शनि' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function SuryaPage() {
  const locale = useLocale();
  const ml = useML(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);

  let section = 0;
  const next = () => ++section;

  const SECTIONS = [
    { id: 'section-1', label: ml({ en: 'Overview', hi: 'परिचय' }) },
    { id: 'section-2', label: ml({ en: 'Astronomy', hi: 'खगोल' }) },
    { id: 'section-3', label: ml({ en: 'Dignities', hi: 'गरिमा' }) },
    { id: 'section-4', label: ml({ en: 'In 12 Signs', hi: '12 राशियों में' }) },
    { id: 'section-5', label: ml({ en: 'In 12 Houses', hi: '12 भावों में' }) },
    { id: 'section-6', label: ml({ en: 'Dasha', hi: 'दशा' }) },
    { id: 'section-7', label: ml({ en: 'Practical', hi: 'व्यावहारिक' }) },
    { id: 'section-8', label: ml({ en: 'Relationships', hi: 'सम्बन्ध' }) },
    { id: 'section-9', label: ml({ en: 'Yogas', hi: 'योग' }) },
    { id: 'section-10', label: ml({ en: 'Remedies', hi: 'उपाय' }) },
    { id: 'section-11', label: ml({ en: 'Mythology', hi: 'पौराणिक कथा' }) },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-sun/15 border border-graha-sun/30 mb-4">
          <span className="text-4xl">☉</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Surya — The Sun', hi: 'सूर्य — सूर्य देव' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'Atmakaraka — the significator of the soul, the visible God, the source of all life and authority in Vedic astrology.', hi: 'आत्मकारक — आत्मा का कारक, प्रत्यक्ष देवता, वैदिक ज्योतिष में सभी जीवन और अधिकार का स्रोत।' })}
        </p>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Overview & Nature ── */}
      <LessonSection number={next()} title={ml({ en: 'Overview & Nature', hi: 'परिचय एवं स्वभाव' })}>
        <p style={bf}>{ml({ en: 'Surya is the king of the Navagrahas, the soul (Atman) of the Kaal Purusha, and the source of all light in the horoscope. As a Krura (cruel) graha, he burns what he touches — but this burning purifies. He represents the father, government authority, vitality, and the core identity of a person. Without the Sun, no other planet can function — just as no life exists without sunlight.', hi: 'सूर्य नवग्रहों के राजा, काल पुरुष की आत्मा, और कुण्डली में सभी प्रकाश के स्रोत हैं। क्रूर ग्रह होने से वे जो छूते हैं उसे जलाते हैं — किन्तु यह दहन शुद्ध करता है। वे पिता, सरकारी अधिकार, जीवनशक्ति और व्यक्ति की मूल पहचान का प्रतिनिधित्व करते हैं।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGNIFICATIONS).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-dark text-xs uppercase tracking-wider">{key}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Visheshaphala" />
      </LessonSection>

      {/* ── 2. Astronomical Profile ── */}
      <LessonSection number={next()} title={ml({ en: 'Astronomical Profile', hi: 'खगोलीय परिचय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Understanding the Sun\'s astronomical behavior deepens our appreciation of its astrological symbolism. The Sun\'s remarkable consistency in motion, its role as the gravitational center, and its unique property of never retrograding all have direct astrological parallels.', hi: 'सूर्य के खगोलीय व्यवहार को समझना उसके ज्योतिषीय प्रतीकवाद की हमारी समझ को गहरा करता है। गति में उल्लेखनीय स्थिरता, गुरुत्वाकर्षण केन्द्र की भूमिका, और कभी वक्री न होने का अद्वितीय गुण — सभी के प्रत्यक्ष ज्योतिषीय समानान्तर हैं।' })}</p>
        <div className="space-y-3">
          {Object.entries(ASTRONOMICAL).map(([key, val]) => (
            <div key={key} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2 capitalize" style={hf}>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="Surya Siddhanta" chapter="Ch. 1 — Mean motions of the planets" />
      </LessonSection>

      {/* ── 3. Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Dignities & Strength', hi: 'गरिमा एवं बल' })}>
        <p style={bf}>{ml({ en: 'A planet\'s dignity determines whether it can express its full potential or is constrained. Sun in Aries at 10° is at the peak of its power — here the soul burns brightest with courage and initiative. In Libra at 10°, the Sun struggles — the ego dissolves in the desire to please others, compromising personal authority.', hi: 'ग्रह की गरिमा यह निर्धारित करती है कि वह अपनी पूर्ण क्षमता व्यक्त कर सकता है या बाधित है। मेष में 10° पर सूर्य अपनी शक्ति के शिखर पर है। तुला में 10° पर सूर्य संघर्ष करता है।' })}</p>
        <div className="space-y-2 mt-4">
          {Object.entries(DIGNITIES).map(([key, val]) => (
            <div key={key} className="flex items-start gap-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-primary text-sm font-bold min-w-[120px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-text-primary text-sm" style={bf}>{ml(val)}</span>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha" />
      </LessonSection>

      {/* ── 3. Sun in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Sun in the Twelve Signs', hi: 'बारह राशियों में सूर्य' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The sign placement of the Sun determines the lens through which the soul expresses itself. In Western astrology this is your "Sun sign" — in Vedic astrology it\'s equally important but read alongside the Moon sign (Rashi) and Ascendant (Lagna).', hi: 'सूर्य की राशि स्थिति यह निर्धारित करती है कि आत्मा किस लेंस से स्वयं को अभिव्यक्त करती है। पाश्चात्य ज्योतिष में यह "सन साइन" है — वैदिक ज्योतिष में यह चन्द्र राशि और लग्न के साथ पढ़ा जाता है।' })}</p>
        {SUN_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(s.sign)}</span>
              {s.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  s.dignity === 'Exalted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  s.dignity === 'Debilitated' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  s.dignity === 'Own sign' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{s.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(s.effect)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 4. Sun in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Sun in the Twelve Houses', hi: 'बारह भावों में सूर्य' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The house placement determines the area of life where the Sun\'s energy concentrates. Sun in a Kendra (1st, 4th, 7th, 10th) gives strong visible authority. In a Trikona (1st, 5th, 9th) it brings dharmic purpose. In Dusthana (6th, 8th, 12th) the results are mixed — struggle leads to hidden strength.', hi: 'भाव स्थिति यह निर्धारित करती है कि सूर्य की ऊर्जा जीवन के किस क्षेत्र में केन्द्रित होती है। केन्द्र (1, 4, 7, 10) में सूर्य प्रत्यक्ष अधिकार देता है। त्रिकोण (1, 5, 9) में धार्मिक उद्देश्य। दुस्थान (6, 8, 12) में मिश्रित — संघर्ष से गुप्त शक्ति।' })}</p>
        {SUN_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-sun/15 border border-graha-sun/30 flex items-center justify-center text-graha-sun text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Planets in Houses)" />
      </LessonSection>

      {/* ── 5. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Surya Mahadasha (6 Years)', hi: 'सूर्य महादशा (6 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Sun Dasha', hi: 'बलवान सूर्य दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongSun)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Sun Dasha', hi: 'दुर्बल सूर्य दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakSun)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 7. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Theory without application is incomplete. This section helps you assess the Sun\'s real impact in your own chart, recognize the signs of a strong versus weak Sun in daily life, and understand when remedies are appropriate versus unnecessary.', hi: 'अनुप्रयोग के बिना सिद्धान्त अपूर्ण है। यह खण्ड आपको अपनी कुण्डली में सूर्य के वास्तविक प्रभाव का आकलन करने, दैनिक जीवन में बलवान बनाम दुर्बल सूर्य के संकेतों को पहचानने, और समझने में सहायता करता है कि उपाय कब उचित हैं।' })}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'How to Assess Sun\'s Strength', hi: 'सूर्य के बल का आकलन कैसे करें' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.assessStrength)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
              <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Signs of a Strong Sun', hi: 'बलवान सूर्य के संकेत' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.strongIndicators)}</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
              <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Signs of a Weak Sun', hi: 'दुर्बल सूर्य के संकेत' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.weakIndicators)}</p>
            </div>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'When to Seek Remedies', hi: 'उपाय कब करें' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.whenToRemediate)}</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
            <h4 className="text-amber-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Common Misconceptions', hi: 'आम भ्रान्तियाँ' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.misconceptions)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 8. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Surya\'s friendships and enmities define how planetary conjunctions and aspects play out. A friend\'s conjunction enhances; an enemy\'s creates friction. These relationships form the basis of Pancha Dha Maitri (five-fold friendship) used in compatibility and transit analysis.', hi: 'सूर्य की मैत्री और शत्रुता यह निर्धारित करती है कि ग्रह युति और दृष्टि कैसे प्रकट होती है। मित्र की युति वृद्धि करती है; शत्रु की घर्षण पैदा करती है। ये सम्बन्ध पंचधा मैत्री का आधार हैं।' })}</p>
        <div className="space-y-3">
          {RELATIONSHIPS.map((r, i) => (
            <div key={i} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-gold-light font-bold text-sm" style={hf}>{ml(r.planet)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  ml(r.relation).includes('Friend') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  ml(r.relation).includes('Enemy') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>{ml(r.relation)}</span>
              </div>
              <p className="text-text-secondary text-sm" style={bf}>{ml(r.note)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.23-26 — Naisargika Maitri" />
      </LessonSection>

      {/* ── Key Yogas Involving Sun ── */}
      <LessonSection number={next()} title={ml({ en: 'Key Yogas Involving Surya', hi: 'सूर्य से सम्बन्धित प्रमुख योग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The Sun participates in several important yogas (planetary combinations) that significantly modify chart results. These yogas are formed by the Sun\'s relationship with other planets by conjunction, sign placement, or house distance. Understanding these yogas helps interpret the Sun\'s role beyond simple sign/house analysis.', hi: 'सूर्य कई महत्त्वपूर्ण योगों (ग्रह संयोजनों) में भाग लेता है जो कुण्डली परिणामों को महत्त्वपूर्ण रूप से संशोधित करते हैं। ये योग सूर्य के अन्य ग्रहों से युति, राशि स्थिति, या भाव दूरी से बनते हैं। इन योगों को समझना राशि/भाव विश्लेषण से परे सूर्य की भूमिका की व्याख्या में सहायक है।' })}</p>
        <div className="space-y-4">
          {KEY_YOGAS.map((yoga, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/25 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(yoga.name)}</h4>
              <p className="text-gold-dark text-xs mb-2 italic" style={bf}>{ml(yoga.condition)}</p>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(yoga.effect)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 34 — Yogas from Sun" />
      </LessonSection>

      {/* ── Remedies ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies for Sun', hi: 'सूर्य के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Remedies are prescribed when Sun is weak, afflicted, or poorly placed in the birth chart. A strong Sun generally does not need remedies. Consult a qualified Jyotishi before wearing gemstones, as an incorrectly prescribed remedy can amplify problems.', hi: 'उपाय तब निर्धारित किये जाते हैं जब सूर्य दुर्बल, पीड़ित या कुण्डली में अशुभ स्थान पर हो। बलवान सूर्य को प्रायः उपाय की आवश्यकता नहीं। रत्न धारण से पूर्व योग्य ज्योतिषी से परामर्श करें।' })}</p>

        {/* Mantra */}
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Beej Mantra', hi: 'बीज मन्त्र' })}</h4>
          <p className="text-gold-primary text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{REMEDIES.mantra.text}</p>
          <p className="text-text-secondary text-xs italic mb-2">{REMEDIES.mantra.transliteration}</p>
          <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES.mantra)}</p>
          <p className="text-text-secondary text-xs mt-1">{ml({ en: `Count: ${REMEDIES.mantra.count}`, hi: `जाप: ${REMEDIES.mantra.count}` })}</p>
        </div>

        {/* Other remedies */}
        {[
          { key: 'gemstone', icon: '💎', title: { en: 'Gemstone — Ruby (Manikya)', hi: 'रत्न — माणिक्य' } },
          { key: 'charity', icon: '🙏', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', icon: '🍽', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', icon: '🔱', title: { en: 'Worship & Arghya', hi: 'पूजा एवं अर्घ्य' } },
          { key: 'yantra', icon: '🔲', title: { en: 'Surya Yantra', hi: 'सूर्य यन्त्र' } },
          { key: 'dietary', icon: '🍞', title: { en: 'Dietary Recommendations', hi: 'आहार अनुशंसाएँ' } },
          { key: 'colorTherapy', icon: '🎨', title: { en: 'Color Therapy', hi: 'रंग चिकित्सा' } },
          { key: 'behavioral', icon: '🏃', title: { en: 'Behavioral Remedies', hi: 'व्यवहारिक उपाय' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-3">
            <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'Sun remedies work best when combined with behavioral changes: waking before sunrise, respecting father/authority figures, developing self-discipline, and serving through leadership rather than ego.', hi: 'सूर्य के उपाय व्यावहारिक परिवर्तनों के साथ सबसे अच्छे काम करते हैं: सूर्योदय से पहले जागना, पिता/अधिकार का सम्मान, आत्म-अनुशासन विकसित करना।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 8. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Worship', hi: 'पौराणिक कथा एवं उपासना' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Origin Story', hi: 'उत्पत्ति कथा' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.origin)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Gayatri Mantra', hi: 'गायत्री मन्त्र' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.gayatri)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples', hi: 'पवित्र मन्दिर' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Chhath Puja & Solar Festivals', hi: 'छठ पूजा एवं सौर त्योहार' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.chhathPuja)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Surya in Other Traditions', hi: 'अन्य परम्पराओं में सूर्य' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.otherTraditions)}</p>
          </div>
        </div>
        <ClassicalReference shortName="Surya Siddhanta" chapter="Astronomical foundation of solar calculations" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Sun is the Atmakaraka — the soul significator. Its placement reveals your core identity and life purpose.', hi: 'सूर्य आत्मकारक है — इसकी स्थिति आपकी मूल पहचान और जीवन उद्देश्य प्रकट करती है।' }),
        ml({ en: 'Exalted in Aries (10°), debilitated in Libra (10°). Own sign Leo. Moolatrikona Leo 0°-20°.', hi: 'मेष 10° में उच्च, तुला 10° में नीच। स्वराशि सिंह। मूलत्रिकोण सिंह 0°-20°।' }),
        ml({ en: 'Friends: Moon, Mars, Jupiter. Enemies: Venus, Saturn. The Sun-Saturn conflict is the most significant in Jyotish.', hi: 'मित्र: चन्द्र, मंगल, गुरु। शत्रु: शुक्र, शनि। सूर्य-शनि संघर्ष ज्योतिष में सबसे महत्त्वपूर्ण है।' }),
        ml({ en: 'Mahadasha: 6 years. Remedy: Ruby, wheat/jaggery charity, Arghya at sunrise, Aditya Hridayam Stotra.', hi: 'महादशा: 6 वर्ष। उपाय: माणिक्य, गेहूँ/गुड़ दान, सूर्योदय पर अर्घ्य, आदित्य हृदयम् स्तोत्र।' }),
      ]} />

      {/* ── Cross-links ── */}
      <div className="mt-12 border-t border-gold-primary/10 pt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4">{ml({ en: 'Explore Further', hi: 'और जानें' })}</h3>
        <div className="flex flex-wrap gap-2">
          {CROSS_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-sm rounded-lg border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-colors" style={bf}>
              {ml(link.label)}
            </Link>
          ))}
        </div>
      </div>
      <SectionNav sections={SECTIONS} />
    </main>
  );
}
