'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, Gem, Music, Heart, Flame, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/doshas.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;



const DOSHAS = [
  { id: 'mangal', name: { en: 'Mangal Dosha (Manglik)', hi: 'मांगलिक दोष', sa: 'मङ्गलदोषः' }, severity: 'high', planets: 'Mars',
    condition: { en: 'Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus', hi: 'लग्न, चंद्र या शुक्र से 1, 2, 4, 7, 8, 12वें भाव में मंगल', sa: 'लग्नात् चन्द्रात् शुक्रात् वा 1, 2, 4, 7, 8, 12 भावे मङ्गलः' },
    effect: { en: 'Delays or disturbances in marriage, aggressive temperament, conflicts with spouse. Severity depends on sign, aspects, and which reference point (Lagna/Moon/Venus). Mars in the 7th is considered most severe (direct conflict with spouse). Mars in the 1st affects personality (aggression). Mars in the 8th can indicate accidents or sudden health issues for the spouse.', hi: 'विवाह में देरी या बाधा, आक्रामक स्वभाव, जीवनसाथी से संघर्ष। 7वें भाव में सर्वाधिक गंभीर (जीवनसाथी से सीधा संघर्ष)।', sa: 'विवाहे विलम्बः, आक्रामकस्वभावः, जीवनसहचरेण संघर्षः।' },
    cancellation: {
      en: '(1) Mars in own sign (Aries/Scorpio) or exaltation (Capricorn) — aggressive energy is channelled constructively. (2) Jupiter aspects Mars — wisdom tempers aggression. (3) Spouse is also Manglik — energies balance. (4) Mars in 2nd house in Gemini or Virgo — Mercury\'s influence softens Mars. (5) Venus conjunct Mars — love tempers conflict. (6) Mars in 1st/2nd/4th in benefic signs (Cancer, Sagittarius, Pisces).',
      hi: '(1) मंगल स्वराशि (मेष/वृश्चिक) या उच्च (मकर) में। (2) गुरु दृष्टि मंगल पर। (3) जीवनसाथी भी मांगलिक। (4) मंगल 2रे भाव में मिथुन/कन्या में। (5) शुक्र मंगल के साथ। (6) मंगल शुभ राशियों में।',
      sa: '(1) मङ्गलः स्वराशौ वा उच्चे। (2) गुरुदृष्टिः। (3) जीवनसहचरः अपि मङ्गलिकः। (4) शुभराशिषु मङ्गलः।'
    },
    remedy: { en: 'Kumbh Vivah (ritual marriage before actual), Mangal Shanti puja, wearing Red Coral (after consultation), Hanuman Chalisa on Tuesdays, donate red lentils', hi: 'कुम्भ विवाह, मंगल शांति पूजा, मूंगा धारण, हनुमान चालीसा (मंगलवार), लाल मसूर दान', sa: 'कुम्भविवाहः, मङ्गलशान्तिपूजा, प्रवालधारणम्' },
    classical: 'BPHS Ch.35, Phaladeepika Ch.7' },
  { id: 'kala_sarpa', name: { en: 'Kala Sarpa Dosha', hi: 'काल सर्प दोष', sa: 'कालसर्पदोषः' }, severity: 'high', planets: 'Rahu-Ketu axis',
    condition: { en: 'All 7 planets (Sun through Saturn) hemmed between Rahu and Ketu on one side of the chart. 12 types named after serpents based on Rahu\'s house position: Ananta (Rahu in 1st), Kulika (2nd), Vasuki (3rd), Shankhapala (4th), Padma (5th), Maha Padma (6th), Takshaka (7th), Karkotaka (8th), Shankhachuda (9th), Ghataka (10th), Vishdhara (11th), Sheshanaga (12th).', hi: 'सभी 7 ग्रह राहु-केतु के बीच एक तरफ। राहु की भाव स्थिति अनुसार 12 प्रकार: अनन्त (1ला), कुलिक (2रा), वासुकि (3रा), शंखपाल (4था), पद्म (5वाँ), महापद्म (6ठा), तक्षक (7वाँ), कार्कोटक (8वाँ), शंखचूड (9वाँ), घातक (10वाँ), विषधर (11वाँ), शेषनाग (12वाँ)।', sa: 'सर्वे 7 ग्रहाः राहुकेत्वोः मध्ये एकपार्श्वे। 12 प्रकाराः सर्पनामभिः।' },
    effect: { en: 'Cyclical hardships — life follows a build-up and collapse pattern. Sudden reversals of fortune, intense karmic experiences, mental anxiety. Career may see repeated near-successes followed by setbacks. Relationships suffer from trust issues. The specific type determines which life area is most affected (e.g., Takshaka in 7th primarily affects marriage).', hi: 'चक्रीय कठिनाइयाँ — जीवन में उत्थान और पतन का चक्र। अचानक भाग्य परिवर्तन, तीव्र कार्मिक अनुभव, मानसिक चिंता।', sa: 'चक्रीयकठिनतायाः — जीवने उत्थानपतनचक्रम्।' },
    cancellation: { en: 'One planet outside the Rahu-Ketu axis (partial Kala Sarpa only, not full), benefic aspects on Rahu/Ketu, Jupiter conjunct either node, one planet exactly conjunct Rahu or Ketu (breaks the hemming)', hi: 'एक ग्रह अक्ष के बाहर, शुभ दृष्टि, गुरु राहु/केतु के साथ', sa: 'एकः ग्रहः अक्षाद् बहिः, शुभदृष्टिः' },
    remedy: { en: 'Kala Sarpa Dosha puja (Trimbakeshwar/Kukke), Rahu-Ketu homam, Naga puja, Maha Mrityunjaya japa (125,000), silver Naga idol worship', hi: 'काल सर्प दोष पूजा (त्र्यम्बकेश्वर), राहु-केतु होमम, नाग पूजा, महामृत्युंजय जप', sa: 'कालसर्पदोषपूजा, राहुकेतुहोमम्, नागपूजा' },
    classical: 'Manasagari, Hora Sara' },
  { id: 'pitra', name: { en: 'Pitra Dosha', hi: 'पित्र दोष', sa: 'पितृदोषः' }, severity: 'medium', planets: 'Sun + Rahu/Ketu',
    condition: { en: 'Sun conjunct Rahu or Ketu (especially in 1st, 5th, or 9th house). Also: 9th house lord in 6th/8th/12th, malefics in 9th house, or Saturn aspecting the 9th house without benefic influence. The 9th house represents father, Dharma, and ancestral merit (Punya).', hi: 'सूर्य राहु या केतु के साथ (विशेषकर 1, 5, 9वें भाव में)। 9वें भाव का स्वामी 6/8/12 में, 9वें भाव में पापग्रह।', sa: 'सूर्यः राहुणा केतुना वा सह (विशेषतः 1, 5, 9 भावे)।' },
    effect: { en: 'Ancestral karmic debt manifesting as obstacles from father/authority figures, difficulty with government matters, childlessness or children facing problems, unexplained family health patterns, career blocks despite qualification. The native may feel a persistent sense of being "held back" by unseen forces.', hi: 'पूर्वजों का कार्मिक ऋण — पिता/अधिकारियों से बाधा, सरकारी कार्यों में कठिनाई, संतान समस्या, अकथनीय पारिवारिक स्वास्थ्य प्रतिरूप।', sa: 'पूर्वजकार्मिकऋणम् — पित्राधिकारिभ्यः बाधा, शासनकार्येषु कठिनता।' },
    cancellation: { en: 'Jupiter aspect on 9th house, Sun in exaltation (Aries) or own sign (Leo), strong benefics in 9th, 9th lord in Kendra/Trikona, performing regular Shraddha and Tarpana for ancestors', hi: 'गुरु दृष्टि 9वें भाव पर, सूर्य उच्च/स्वराशि में, 9वें भाव में शुभ ग्रह, नियमित श्राद्ध और तर्पण', sa: 'गुरुदृष्टिः 9 भावे, सूर्यः उच्चे, शुभग्रहाः 9 भावे' },
    remedy: { en: 'Pitra Tarpan on Amavasya (especially Sarva Pitri Amavasya in Ashwin), Narayan Nagbali (Trimbak), Pind Daan at Gaya, feed Brahmins on father\'s shraddha, Vishnu Sahasranama', hi: 'पित्र तर्पण अमावस्या पर, नारायण नागबली, गया पिंड दान, श्राद्ध पर ब्राह्मण भोजन, विष्णु सहस्रनाम', sa: 'पितृतर्पणम् अमावस्यायाम्, गयायां पिण्डदानम्' },
    classical: 'BPHS Ch.35' },
  { id: 'shrapit', name: { en: 'Shrapit Dosha', hi: 'श्रापित दोष', sa: 'श्रापितदोषः' }, severity: 'high', planets: 'Saturn + Rahu',
    condition: { en: 'Saturn and Rahu conjunct in any house. Especially severe in kendras (1,4,7,10) or 5th/9th houses. Also activated when both are in mutual aspect or in the same Nakshatra lord\'s domain.', hi: 'शनि और राहु की युति किसी भी भाव में। केंद्र (1,4,7,10) या 5/9 भाव में विशेष गंभीर।', sa: 'शनिराहुयुतिः कस्मिन्नपि भावे।' },
    effect: { en: 'Past-life curse manifesting as chronic obstacles, unexplainable suffering, financial losses, and isolation. The person feels "cursed" without understanding why. Repeated patterns of betrayal, especially from trusted people. Health issues that resist diagnosis. Saturn\'s delay + Rahu\'s confusion creates a uniquely frustrating combination.', hi: 'पूर्वजन्म का शाप — दीर्घकालिक बाधाएं, अकथनीय कष्ट, आर्थिक हानि, एकांत। विश्वसनीय लोगों से बार-बार विश्वासघात।', sa: 'पूर्वजन्मशापः — दीर्घकालिकबाधाः, अकथनीयकष्टम्।' },
    cancellation: { en: 'Jupiter aspect on the conjunction, both planets in benefic signs, strong lagna lord in Kendra, Saturn in own sign (Capricorn/Aquarius) reduces severity', hi: 'गुरु दृष्टि युति पर, शुभ राशि में, बलवान लग्नेश, शनि स्वराशि में', sa: 'गुरुदृष्टिः युतौ, शुभराशौ, बलवान् लग्नेशः' },
    remedy: { en: 'Shani-Rahu shanti homam, recite Vishnu Sahasranama daily, donate black sesame and iron on Saturdays, Rudrabhishek, Rahu Kaal observance', hi: 'शनि-राहु शांति होमम, विष्णु सहस्रनाम पाठ, शनिवार को काले तिल-लोहा दान, रुद्राभिषेक', sa: 'शनिराहुशान्तिहोमम्, विष्णुसहस्रनामपाठः' },
    classical: 'BPHS, Lal Kitab' },
  { id: 'guru_chandal', name: { en: 'Guru Chandal Dosha', hi: 'गुरु चाण्डाल दोष', sa: 'गुरुचाण्डालदोषः' }, severity: 'medium', planets: 'Jupiter + Rahu',
    condition: { en: 'Jupiter conjunct Rahu in any house. More severe when in the 1st, 5th, or 9th house (Dharma Trikona). Also considered when Jupiter is conjunct Ketu, though effects differ (more spiritual confusion than moral corruption).', hi: 'गुरु और राहु की युति किसी भी भाव में। 1, 5 या 9वें भाव (धर्म त्रिकोण) में अधिक गंभीर।', sa: 'गुरुराहुयुतिः कस्मिन्नपि भावे। 1, 5, 9 भावे अधिकगम्भीरम्।' },
    effect: { en: 'Disrespect for traditions and elders, association with dubious spiritual teachers, making wrong moral choices despite knowing better, educational disruptions, children may face unusual challenges. The native\'s judgement in matters of Dharma becomes unreliable.', hi: 'परम्पराओं और बड़ों के प्रति अनादर, संदिग्ध आध्यात्मिक गुरुओं से सम्बन्ध, गलत नैतिक निर्णय, शिक्षा में बाधा।', sa: 'परम्पराणां ज्येष्ठानां च अनादरः, संदिग्धगुरुभिः सम्बन्धः।' },
    cancellation: { en: 'Jupiter in own sign (Sagittarius/Pisces) or exaltation (Cancer), Jupiter stronger than Rahu in Shadbala, benefic aspect from Moon or Venus, Rahu in a Jupiter-ruled Nakshatra', hi: 'गुरु स्वराशि या उच्च में, गुरु षड्बल में राहु से बलवान, चन्द्र या शुक्र दृष्टि', sa: 'गुरुः स्वराशौ उच्चे वा, गुरुः षड्बले राहोः बलवत्तरः' },
    remedy: { en: 'Guru (Jupiter) puja on Thursdays, Dakshinamurthy Stotram, Vishnu puja, yellow sapphire (after analysis), donate turmeric, yellow cloth, and chana dal on Thursdays, Guru Graha Shanti homam', hi: 'गुरुवार को गुरु पूजा, दक्षिणामूर्ति स्तोत्र, विष्णु पूजा, पुखराज, गुरुवार को हल्दी-पीला वस्त्र-चने की दाल दान', sa: 'गुरुवासरे गुरुपूजा, दक्षिणामूर्तिस्तोत्रम्, विष्णुपूजा' },
    classical: 'BPHS Ch.35, Phaladeepika' },
  { id: 'kemdrum', name: { en: 'Kemadruma Dosha', hi: 'केमद्रुम दोष', sa: 'केमद्रुमदोषः' }, severity: 'medium', planets: 'Moon isolated',
    condition: { en: 'No planet (except Sun, Rahu, Ketu) in 2nd or 12th house from Moon. Some authorities also check: no planet in Kendra from Moon (stricter definition).', hi: 'चंद्र से 2nd और 12th में कोई ग्रह नहीं (सूर्य, राहु, केतु छोड़कर)। कुछ विद्वान केन्द्र भी जाँचते हैं।', sa: 'चन्द्रात् 2 12 भावयोः कोऽपि ग्रहः न (सूर्यराहुकेतुवर्जम्)।' },
    effect: { en: 'Emotional isolation, poverty despite effort, lack of support systems, mental distress. Moon needs planetary "companions" for emotional stability.', hi: 'भावनात्मक अकेलापन, प्रयास के बावजूद गरीबी, सहायता की कमी, मानसिक कष्ट।', sa: 'भावनात्मकएकाकित्वम्, प्रयासेऽपि दारिद्र्यम्।' },
    cancellation: { en: 'Planet in kendra from Moon, Moon in kendra aspected by benefic, Full Moon, Moon in strong sign (Taurus exaltation), Moon conjunct a benefic planet', hi: 'चंद्र से केंद्र में ग्रह, शुभ दृष्टि, पूर्णिमा का चंद्र, वृषभ में चंद्र', sa: 'चन्द्रात् केन्द्रे ग्रहः, शुभदृष्टिः, पूर्णचन्द्रः' },
    remedy: { en: 'Worship Lord Shiva on Mondays, Pearl wearing (after analysis), Chandra Graha shanti, donate white items (rice, milk, white cloth) on Mondays', hi: 'सोमवार को शिव पूजा, मोती धारण, चंद्र ग्रह शांति, सोमवार को सफेद वस्तुएं दान', sa: 'सोमवासरे शिवपूजा, मुक्ताधारणम्' },
    classical: 'Phaladeepika Ch.6 v.8' },
  { id: 'marana_karaka', name: { en: 'Marana Karaka Sthana', hi: 'मरण कारक स्थान', sa: 'मरणकारकस्थानम्' }, severity: 'medium', planets: 'Any planet',
    condition: { en: 'Planet in its "death house": Sun in 12th, Moon in 8th, Mars in 7th, Mercury in 4th, Jupiter in 3rd, Venus in 6th, Saturn in 1st, Rahu in 9th, Ketu in 3rd', hi: 'ग्रह अपने मृत्यु-भाव में: सूर्य 12वें, चंद्र 8वें, मंगल 7वें, बुध 4वें, गुरु 3रे, शुक्र 6ठे, शनि 1ले, राहु 9वें, केतु 3रे', sa: 'ग्रहः मृत्युभावे: सूर्यः 12, चन्द्रः 8, मङ्गलः 7, बुधः 4, गुरुः 3, शुक्रः 6, शनिः 1, राहुः 9, केतुः 3' },
    effect: { en: 'The planet becomes extremely weak — its significations suffer greatly. Like a person imprisoned in a place of death. The karakatvas (natural significations) are severely impaired. For example, Moon in 8th impairs mental peace; Mars in 7th damages marital harmony; Saturn in 1st weakens vitality and confidence.', hi: 'ग्रह अत्यंत दुर्बल — उसके कारकत्व बहुत पीड़ित। मृत्यु स्थान में कैदी के समान। उदाहरण: चन्द्र 8वें में मानसिक शान्ति क्षीण; मंगल 7वें में वैवाहिक सामंजस्य को नुकसान।', sa: 'ग्रहः अत्यन्तदुर्बलः — तस्य कारकत्वानि पीडितानि।' },
    cancellation: { en: 'Benefic aspect, planet in own/exaltation sign (partially mitigates), strong dispositor, planet\'s Vargottama status (same sign in Rashi and Navamsa)', hi: 'शुभ दृष्टि, स्वराशि/उच्च (आंशिक शमन), बलवान स्वामी, वर्गोत्तम स्थिति', sa: 'शुभदृष्टिः, स्वराशौ उच्चे वा, बलवान् स्वामी, वर्गोत्तमस्थितिः' },
    remedy: { en: 'Strengthen the afflicted planet through its gemstone, mantra, and charity items. Worship the deity associated with that planet. Focus on the planet\'s day for remedial activities.', hi: 'पीड़ित ग्रह को रत्न, मंत्र और दान से सशक्त करें। ग्रह के देवता की पूजा।', sa: 'पीडितग्रहं रत्नेन मन्त्रेण दानेन च सशक्तं कुर्यात्।' },
    classical: 'BPHS Ch.44' },
];

const REMEDY_TYPES = [
  { icon: Gem, name: { en: 'Gemstones (Ratna)', hi: 'रत्न', sa: 'रत्नानि' }, desc: { en: 'Each planet has a primary gemstone and alternatives. Worn on specific finger, in specific metal, on the planet\'s day after energization (prana pratishtha). Gemstones amplify the planet\'s energy — so they should ONLY be worn for benefic planets in one\'s chart. Wearing a gemstone for a malefic planet strengthens the malefic effects.', hi: 'प्रत्येक ग्रह का प्राथमिक रत्न और विकल्प। विशिष्ट अंगुली, धातु और दिन पर प्राण प्रतिष्ठा के बाद धारण। रत्न ग्रह की ऊर्जा बढ़ाते हैं — इसलिए केवल शुभ ग्रहों के लिए।', sa: 'प्रत्येकग्रहस्य प्राथमिकरत्नं विकल्पाश्च। शुभग्रहाणामेव रत्नानि धार्यानि।' }, color: 'text-violet-400' },
  { icon: Music, name: { en: 'Mantras (Japa)', hi: 'मंत्र (जप)', sa: 'मन्त्राः (जपः)' }, desc: { en: 'Beej mantras (seed syllables) and Vedic mantras specific to each planet. Typically chanted 108 times or multiples (e.g., 125,000 for major shanti). Most effective during the planet\'s hora. Unlike gemstones, mantras can be used for any planet — they purify rather than amplify.', hi: 'बीज मंत्र और वैदिक मंत्र। 108 बार या गुणक में जाप। ग्रह की होरा में सर्वाधिक प्रभावी। रत्नों के विपरीत, मंत्र किसी भी ग्रह के लिए — शुद्धि करते हैं, बढ़ाते नहीं।', sa: 'बीजमन्त्राः वैदिकमन्त्राश्च। 108 वारं जपः। मन्त्राः शुद्धिं कुर्वन्ति न वर्धयन्ति।' }, color: 'text-gold-light' },
  { icon: Heart, name: { en: 'Charity (Daan)', hi: 'दान', sa: 'दानम्' }, desc: { en: 'Donating items associated with the planet on its day. This redirects the planet\'s negative energy outward. E.g., wheat/jaggery/copper on Sunday for Sun, rice/white cloth on Monday for Moon. Daan is considered the safest remedy — it works by generating positive karma.', hi: 'ग्रह से संबंधित वस्तुओं का उसके दिन दान। यह ग्रह की नकारात्मक ऊर्जा को बाहर पुनर्निर्देशित करता है। दान सबसे सुरक्षित उपाय माना जाता है।', sa: 'ग्रहसम्बद्धवस्तूनां तद्दिने दानम्। दानं सर्वथा सुरक्षितोपायः।' }, color: 'text-emerald-400' },
  { icon: Flame, name: { en: 'Rituals (Homa/Puja)', hi: 'अनुष्ठान (होम/पूजा)', sa: 'अनुष्ठानम् (होमः/पूजा)' }, desc: { en: 'Fire rituals (homa/homam) for specific planets. Graha Shanti puja, Navagraha Homam, and deity-specific worship according to the dosha. Most powerful but also most resource-intensive. Should be performed by qualified priests during auspicious muhurats.', hi: 'विशिष्ट ग्रहों के लिए अग्नि अनुष्ठान। ग्रह शांति पूजा, नवग्रह होमम। सबसे शक्तिशाली लेकिन सबसे अधिक संसाधन-गहन। योग्य पुरोहितों द्वारा शुभ मुहूर्त में।', sa: 'विशिष्टग्रहाणां कृते अग्निअनुष्ठानम्। सर्वशक्तिमत् परन्तु सर्वाधिकसंसाधनगहनम्।' }, color: 'text-orange-400' },
];

export default function DoshasPage() {
  const t = (key: string) => lt(t_[key], locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tObj = (obj: any) => (obj as Record<string, string>)[locale] || obj?.en || '';
  const locale = useLocale();
  const isHi = isIndicLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const [expanded, setExpanded] = useState<string | null>('mangal');

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {t('title')}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl" style={bodyFont}>
          {t('subtitle')}
        </p>
      </div>

      {/* What is a Dosha */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-3" style={headingFont}>
          {t('whatTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3" style={bodyFont}>
          {t('whatContent')}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
          {t('whatContent2')}
        </p>
      </div>

      {/* Karmic Perspective */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-violet-400/15 bg-violet-400/3">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-6 h-6 text-violet-400" />
          <h3 className="text-violet-300 text-lg font-bold" style={headingFont}>
            {t('principleTitle')}
          </h3>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-3" style={bodyFont}>
          {t('principleContent')}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
          {t('principleContent2')}
        </p>
      </div>

      {/* Severity legend */}
      <div className="flex gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> {!isIndicLocale(locale) ? 'Severe' : isHi ? 'गंभीर' : 'गम्भीरम्'}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> {!isIndicLocale(locale) ? 'Moderate' : isHi ? 'मध्यम' : 'मध्यमम्'}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> {!isIndicLocale(locale) ? 'Mild' : isHi ? 'हल्का' : 'लघु'}</span>
      </div>

      {/* Dosha cards */}
      <div className="space-y-3">
        {DOSHAS.map((dosha) => {
          const isExpanded = expanded === dosha.id;
          const sevColor = dosha.severity === 'high' ? 'border-red-500/20' : 'border-amber-500/20';
          const sevDot = dosha.severity === 'high' ? 'bg-red-500' : 'bg-amber-500';
          return (
            <div key={dosha.id} className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl border ${sevColor} overflow-hidden`}>
              <button onClick={() => setExpanded(isExpanded ? null : dosha.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gold-primary/3 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${sevDot}`} />
                  <span className="text-gold-light font-bold" style={headingFont}>{tObj(dosha.name)}</span>
                  <span className="text-text-tertiary text-xs">{dosha.planets}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gold-primary/10">
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-1">{!isIndicLocale(locale) ? 'Formation' : isHi ? 'निर्माण शर्त' : 'निर्माणशर्तः'}</div>
                          <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{tObj(dosha.condition)}</div>
                        </div>
                        <div>
                          <div className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">{!isIndicLocale(locale) ? 'Effects' : isHi ? 'प्रभाव' : 'प्रभावः'}</div>
                          <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{tObj(dosha.effect)}</div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold">{!isIndicLocale(locale) ? 'Cancellation Conditions' : isHi ? 'रद्दीकरण शर्तें' : 'शमनशर्ताः'}</div>
                        </div>
                        <div className="text-emerald-300 text-xs leading-relaxed" style={bodyFont}>{tObj(dosha.cancellation)}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
                        <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1">{!isIndicLocale(locale) ? 'Remedies' : isHi ? 'उपाय' : 'उपायाः'}</div>
                        <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{tObj(dosha.remedy)}</div>
                      </div>
                      <div className="text-text-tertiary text-xs">{dosha.classical}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Guru Chandal Dosha detail section */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-3" style={headingFont}>
          {t('guruChandalTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
          {t('guruChandalContent')}
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
            <div className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">
              {!isIndicLocale(locale) ? 'Detection' : isHi ? 'पहचान' : 'पहचानम्'}
            </div>
            <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {!isIndicLocale(locale) ? 'Jupiter and Rahu in the same sign (within 15 degrees orb is strongest). Check in both Rashi and Navamsa charts.' : 'गुरु और राहु एक ही राशि में (15 अंश के भीतर सबसे प्रबल)। राशि और नवमांश दोनों में जाँचें।'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
            <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-1">
              {!isIndicLocale(locale) ? 'Silver lining' : isHi ? 'सकारात्मक पक्ष' : 'सकारात्मकपक्षः'}
            </div>
            <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {!isIndicLocale(locale) ? 'Can give extraordinary unconventional wisdom, success in foreign/cutting-edge fields, ability to challenge established norms productively.' : 'असाधारण अपरम्परागत ज्ञान, विदेशी/अग्रणी क्षेत्रों में सफलता, स्थापित मानदंडों को रचनात्मक रूप से चुनौती देने की क्षमता दे सकता है।'}
            </div>
          </div>
        </div>
      </div>

      {/* Kemadruma detail section */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-3" style={headingFont}>
          {t('kemdrumaTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
          {t('kemdrumaContent')}
        </p>
        <div className="mt-4 p-3 rounded-xl bg-blue-400/5 border border-blue-400/15">
          <div className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-1">
            {!isIndicLocale(locale) ? 'Important nuance' : isHi ? 'महत्वपूर्ण सूक्ष्मता' : 'महत्त्वपूर्णसूक्ष्मता'}
          </div>
          <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
            {locale === 'en'
              ? 'Kemadruma is one of the most commonly "cancelled" doshas. If Moon is in a Kendra (1,4,7,10) from Lagna, or if any planet is in a Kendra from Moon, or if Moon is Full (Purnima), the dosha is neutralized. Always check these conditions — pure Kemadruma is relatively rare.'
              : 'केमद्रुम सबसे अधिक "रद्द" होने वाले दोषों में से एक है। यदि चन्द्र लग्न से केन्द्र (1,4,7,10) में है, या कोई ग्रह चन्द्र से केन्द्र में है, या पूर्णिमा का चन्द्र है, तो दोष निष्प्रभावी हो जाता है।'}
          </div>
        </div>
      </div>

      {/* Remedy System Overview */}
      <div>
        <h3 className="text-gold-gradient text-xl font-bold mb-4" style={headingFont}>
          {t('remedySystemTitle')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REMEDY_TYPES.map((rt, i) => {
            const Icon = rt.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-6 h-6 ${rt.color}`} />
                  <span className={`font-bold ${rt.color}`} style={headingFont}>{tObj(rt.name)}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{tObj(rt.desc)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Planet remedy quick reference */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <h4 className="text-gold-light font-bold mb-3" style={headingFont}>{t('planetRemedyTitle')}</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-3 text-gold-dark">{!isIndicLocale(locale) ? 'Planet' : isHi ? 'ग्रह' : 'ग्रहः'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{!isIndicLocale(locale) ? 'Gemstone' : isHi ? 'रत्न' : 'रत्नम्'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{!isIndicLocale(locale) ? 'Day' : isHi ? 'दिन' : 'दिनम्'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{!isIndicLocale(locale) ? 'Color' : isHi ? 'रंग' : 'वर्णः'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{!isIndicLocale(locale) ? 'Charity' : isHi ? 'दान' : 'दानम्'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{!isIndicLocale(locale) ? 'Beej Mantra' : isHi ? 'बीज मंत्र' : 'बीजमन्त्रः'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Sun/सूर्य', gem: 'Ruby/माणिक्य', day: 'Sunday', color: 'Red', charity: 'Wheat, jaggery, copper', mantra: 'Om Hraam' },
                { p: 'Moon/चन्द्र', gem: 'Pearl/मोती', day: 'Monday', color: 'White', charity: 'Rice, milk, white cloth', mantra: 'Om Hreem' },
                { p: 'Mars/मंगल', gem: 'Red Coral/मूंगा', day: 'Tuesday', color: 'Red', charity: 'Masoor dal, red cloth', mantra: 'Om Kraam' },
                { p: 'Mercury/बुध', gem: 'Emerald/पन्ना', day: 'Wednesday', color: 'Green', charity: 'Moong dal, green items', mantra: 'Om Braam' },
                { p: 'Jupiter/गुरु', gem: 'Yellow Sapphire/पुखराज', day: 'Thursday', color: 'Yellow', charity: 'Chana dal, turmeric, bananas', mantra: 'Om Graam' },
                { p: 'Venus/शुक्र', gem: 'Diamond/हीरा', day: 'Friday', color: 'White', charity: 'Sugar, ghee, white items', mantra: 'Om Draam' },
                { p: 'Saturn/शनि', gem: 'Blue Sapphire/नीलम', day: 'Saturday', color: 'Black/Blue', charity: 'Sesame, iron, mustard oil', mantra: 'Om Praam' },
                { p: 'Rahu/राहु', gem: 'Hessonite/गोमेद', day: 'Saturday', color: 'Smoky', charity: 'Coconut, blanket, coal', mantra: 'Om Bhraam' },
                { p: 'Ketu/केतु', gem: "Cat's Eye/लहसुनिया", day: 'Tuesday', color: 'Grey', charity: 'Sesame, dog food, blanket', mantra: 'Om Sraam' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-3 text-gold-light font-medium">{r.p}</td>
                  <td className="py-2 px-3 text-text-secondary">{r.gem}</td>
                  <td className="py-2 px-3 text-text-secondary">{r.day}</td>
                  <td className="py-2 px-3 text-text-secondary">{r.color}</td>
                  <td className="py-2 px-3 text-text-secondary">{r.charity}</td>
                  <td className="py-2 px-3 text-text-secondary font-mono">{r.mantra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important note */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 border border-amber-400/15 bg-amber-400/3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-300 font-bold text-sm mb-2" style={headingFont}>
              {!isIndicLocale(locale) ? 'A Note on Dosha Assessment' : isHi ? 'दोष मूल्यांकन पर टिप्पणी' : 'दोषमूल्याङ्कने टिप्पणी'}
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {locale === 'en'
                ? 'Online dosha calculators often report doshas without checking cancellation conditions, leading to unnecessary alarm. A proper assessment requires examining the full chart — sign, aspects, conjunctions, strengths, and the divisional charts (especially Navamsa). Most people have at least one dosha in their chart; this is normal and expected. The presence of a dosha does not define your life — your response to it does.'
                : 'ऑनलाइन दोष कैलकुलेटर अक्सर रद्दीकरण शर्तों की जाँच किए बिना दोष रिपोर्ट करते हैं, जिससे अनावश्यक चिंता होती है। उचित मूल्यांकन के लिए पूर्ण कुण्डली की जाँच आवश्यक है। अधिकांश लोगों की कुण्डली में कम से कम एक दोष होता है; यह सामान्य है।'}
            </p>
          </div>
        </div>
      </div>

      {/* Related Modules */}
      <div>
        <h3 className="text-gold-gradient text-lg font-bold mb-3" style={headingFont}>
          {t('modulesTitle')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/13-3', label: { en: 'Lesson 13-3: Doshas in the Birth Chart', hi: 'पाठ 13-3: जन्म कुण्डली में दोष' } },
            { href: '/learn/modules/15-1', label: { en: 'Lesson 15-1: Remedial Measures', hi: 'पाठ 15-1: उपचारात्मक उपाय' } },
            { href: '/learn/modules/15-2', label: { en: 'Lesson 15-2: Gemstones & Mantras', hi: 'पाठ 15-2: रत्न और मंत्र' } },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {isHi ? mod.label.hi : mod.label.en}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
