import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale, pickByScript, pickByLocale } from '@/lib/utils/locale-fonts';
import { generatePersonLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { Mail, Globe, Code, BookOpen, Calculator, Shield } from 'lucide-react';
import { TOTAL_MODULES } from '@/lib/learn/module-sequence';

export const revalidate = 604800; // 7 days  –  static text page

// ---------------------------------------------------------------------------
// Inline multilingual content  –  server component, fully SSR for AdSense bot
// ---------------------------------------------------------------------------

const CONTENT = {
  en: {
    title: 'About Dekho Panchang',
    subtitle: 'Where ancient astronomical wisdom meets modern computation',
    authorHeading: 'About the Author',
    authorIntro: 'Dekho Panchang is built and maintained by',
    authorName: 'Aditya Jha',
    authorHeritage: 'a Maithil Brahmin from Mithila with deep roots in the Vedic tradition, and a software engineer by training.',
    authorVedic: 'Aditya grew up steeped in the rhythms of Mithila — the panchang consulted at dawn, the tithi-based vrats observed at home, Sanskrit shlokas memorised before they were understood. The interest never faded into nostalgia. Adult life kept him close to the source texts: the Surya Siddhanta\'s astronomical mathematics, the Brihat Parashara Hora Shastra\'s interpretive framework, the Muhurta Chintamani\'s discipline of timing. This is not a subject he picked up; it is what he grew up inside.',
    authorSoftware: 'Software is the other native tongue. Years of building systems at scale made one pattern unmistakable: classical Jyotish has always been a computational discipline. Sūtras compress algorithms; verses encode sky-models. What was frustrating was watching modern panchang sites bury that precision under marketing claims, paid "reports", and opaque calculations. Dekho Panchang exists to put the computation back where it belongs — open, verifiable, free.',
    authorMission: 'This project was born from a simple conviction: the astronomical and astrological knowledge preserved in texts like the Surya Siddhanta and Brihat Parashara Hora Shastra deserves to be accessible to everyone  –  not locked behind paywalls or simplified beyond recognition.',
    authorApproach: 'Every calculation on this site is done from first principles. Planetary positions use the Swiss Ephemeris (NASA JPL DE441) with Meeus algorithms as fallback. Panchang elements and interpretive rules are computed using classical Jyotish prescriptions, anchored to named canonical sources. There are no external astrology APIs  –  just mathematics, the same mathematics our ancestors encoded thousands of years ago, now running in your browser.',
    authorClosing: 'This is a passion project, not a corporation. If you find value in it, that is the best reward.',
    consultantsHeading: 'Built With Jyotishacharyas, Not Just for Them',
    consultantsIntro: 'Software expertise alone does not qualify anyone to encode Jyotish. Every interpretive module on this site was developed in consultation with multiple jyotishacharyas — scholars who carry the living tradition, trained in the Parashari, Jaimini, and KP systems. Their involvement shapes the substantive decisions, not just the surface labelling.',
    consultantsScope: 'Which yogas are canonical and which are folk additions; the correct sequencing of Dasha–Antardasha–Pratyantar interpretation; the BPHS-faithful tables for Shadbala, Ashtakavarga, and divisional charts; the muhurta exclusions that classical compilers explicitly catalogued (Vishti, Bhadra, Panchaka, Wednesday Abhijit). Where modern texts disagreed, we consulted the canonical sources directly and recorded the decision in our public specifications so any future maintainer can audit the reasoning.',
    consultantsClosing: 'The result is software an acharya would recognise — not as a simplification of the discipline, but as a faithful rendering of it.',
    canonsHeading: 'Fidelity to the Classical Canons',
    canonsIntro: 'Every interpretive engine on this site is anchored to a named text — never a vague "tradition". When we compute Shadbala, we follow BPHS Ch.27 step by step. When we declare a Mangal Dosha, we apply the conditions from Phaladeepika Ch.6 (the actual canonical source) rather than the simplified popular version. The texts we follow, and what we implement from each:',
    canons: [
      { text: 'Brihat Parashara Hora Shastra', follow: 'Core natal chart framework — house significations, planetary dignities, the canonical yoga catalogue, Vimshottari Dasha mechanics, Shadbala (six-fold strength), Ashtakavarga.' },
      { text: 'Phaladeepika (Mantreshwara)', follow: 'Natal yoga catalogue and the actual canonical conditions for Mangal Dosha (Ch.6), corrected against the popularised but inexact version most apps use.' },
      { text: 'Jaimini Sutras', follow: 'Chara Karakas, Karakamsha, Pada calculations, Argala interpretation, and the rashi-dasha system.' },
      { text: 'Muhurta Chintamani (Ramacharya)', follow: 'Auspicious-time selection rules, the Choghadiya / Hora schemes, and the catalogue of inauspicious periods (Vishti, Bhadra, Panchaka) used in our muhurta scoring.' },
      { text: 'Surya Siddhanta', follow: 'Foundational astronomy — sidereal year length, planetary mean motions, Ayanamsha framework. Cross-verified against modern values.' },
      { text: 'Krishnamurti Padhdhati', follow: 'Sub-lord calculations, ruling planet selection, and the cuspal sub-theory used in our KP System module.' },
      { text: 'Sarvartha Chintamani', follow: 'Predictive techniques for specific life areas, used in tippanni generation alongside BPHS prescriptions.' },
      { text: 'Brihat Jataka (Varahamihira)', follow: 'Tajika rules and Varshaphal (Tajika annual chart) computation including Muntha, Sahams, and Mudda Dasha.' },
    ],
    whatWeOffer: 'What We Offer',
    features: [
      { icon: 'calc', label: 'Precise Panchang', desc: 'Daily Tithi, Nakshatra, Yoga, Karana, and Muhurta timings computed for your exact location using astronomical algorithms verified within 1-2 minutes of reference sources.' },
      { icon: 'book', label: 'Professional-Grade Birth Chart', desc: '25+ analysis modules: Vimshottari/Ashtottari/Yogini Dashas, Shadbala (6-fold strength), Ashtakavarga, 16 divisional charts (D1-D60), 144 yoga patterns, KP System (Placidus sub-lords), Jaimini Karakas, Avasthas, Argala, Bhava Chalit  –  plus AI-powered chart chat. Computed locally from Swiss Ephemeris, no external APIs.' },
      { icon: 'code', label: 'NASA JPL Ephemeris Precision', desc: 'Primary engine: Swiss Ephemeris powered by NASA JPL DE441 planetary ephemeris  –  arcsecond accuracy for all 9 planets, the same data used by NASA for spacecraft navigation. Meeus algorithms as fallback. No black-box APIs  –  open, verifiable astronomical computation.' },
      { icon: 'shield', label: 'Privacy First', desc: 'Your birth data stays yours. We use Supabase with Row Level Security  –  users can only access their own data. No selling personal information to third parties.' },
      { icon: 'globe', label: 'Multilingual', desc: 'Available in 10 languages including Hindi, Tamil, Bengali, Telugu, Kannada, Marathi, Gujarati, Maithili, and Sanskrit. Real translations, not machine-generated.' },
      { icon: 'learn', label: `${TOTAL_MODULES} Learning Modules`, desc: 'A structured curriculum covering everything from Panchang basics to advanced Jaimini Jyotish, Shadbala, KP System, and Ashtakavarga  –  free for everyone.' },
    ],
    accuracyHeading: 'Accuracy & Methodology',
    methodologyCta: 'Read the full methodology →',
    accuracy: [
      { title: 'Ephemeris', text: 'Swiss Ephemeris v2.10 powered by NASA JPL DE441  –  the same planetary ephemeris used by NASA for spacecraft navigation. Sub-arcsecond accuracy for Sun, Moon, and all planets including true lunar nodes (Rahu/Ketu).' },
      { title: 'Ayanamsha', text: 'Lahiri (Chitrapaksha) Ayanamsha as default  –  the Indian government standard used by the Indian Astronomical Ephemeris. Krishnamurti Ayanamsha available for KP System analysis.' },
      { title: 'Verification', text: '3,005 automated tests covering panchang accuracy, kundali computation, dasha periods, yoga detection, and festival dates. Regularly cross-verified against professional Hindu almanacs and authoritative panchang sources for multiple locations worldwide.' },
      { title: 'Sunrise Model', text: 'Swiss Ephemeris atmospheric refraction model accounting for observer elevation, temperature, and pressure. Verified within ±1 minute of professional panchang sources across Delhi, Bangalore, and New York.' },
    ],
    heritage: [
      { title: 'The Surya Siddhanta', text: 'The Surya Siddhanta (c. 400 CE) is one of the most remarkable astronomical texts in human history. It accurately calculates the sidereal year at 365.2563627 days  –  a figure astonishingly close to the modern value of 365.25636 days. It provides precise formulas for planetary positions, eclipse predictions, and the precession of equinoxes.' },
      { title: 'Aryabhata\'s Revolution', text: 'Aryabhata (476 CE) proposed that the Earth rotates on its axis  –  over a millennium before Copernicus. His Aryabhatiya contains sophisticated sine tables, pi accurate to 4 decimal places (3.1416), and algorithms for planetary calculations still admired today.' },
      { title: 'The Panchang System', text: 'The Panchang ("five limbs") is a lunisolar calendar tracking five astronomical elements: Tithi (lunar day), Nakshatra (lunar mansion), Yoga (luni-solar angle), Karana (half-tithi), and Vara (weekday). It simultaneously tracks the Moon\'s position relative to the Sun and against fixed stars.' },
      { title: 'Ayanamsha: The Critical Correction', text: 'Indian astronomy accounts for precession of equinoxes through Ayanamsha  –  the angular difference between tropical and sidereal zodiacs. This ~50.3 arc-seconds/year precession completes one cycle in ~25,920 years. The Lahiri Ayanamsha is ~24 degrees currently.' },
      { title: 'Eclipses: Predictive Power', text: 'Indian astronomers identified Rahu and Ketu as the ascending and descending nodes of the Moon\'s orbit  –  where eclipses occur. The Saros cycle (~18 years) was independently discovered. Ancient eclipse computation tables show remarkable accuracy when verified against modern calculations.' },
    ],
    contactHeading: 'Contact Us',
    contactIntro: 'We would love to hear from you. Whether you have a question about our calculations, want to report a bug, or just want to say hello  –  reach out.',
    contactEmail: 'General inquiries',
    contactPrivacy: 'Privacy & data requests',
    contactLegal: 'Legal & terms',
    contactResponse: 'We typically respond within 48 hours.',
    heritageHeading: 'The Scientific Heritage of Indian Astronomy',
  },
  hi: {
    title: 'देखो पंचांग के बारे में',
    subtitle: 'जहाँ प्राचीन खगोलीय ज्ञान आधुनिक गणना से मिलता है',
    authorHeading: 'लेखक के बारे में',
    authorIntro: 'देखो पंचांग का निर्माण और रखरखाव',
    authorName: 'आदित्य झा',
    authorHeritage: 'द्वारा किया जाता है  –  मिथिला के एक मैथिल ब्राह्मण, जिनकी जड़ें वैदिक परम्परा में गहरी हैं, और पेशे से एक सॉफ्टवेयर अभियन्ता हैं।',
    authorVedic: 'आदित्य का बचपन मिथिला की लय में बीता  –  प्रातः पञ्चाङ्ग देखते थे, तिथि-आधारित व्रत-पर्व, समझने से पहले याद हो जाने वाले संस्कृत श्लोक। यह रुचि कभी पुरानी यादों में नहीं ढली। वयस्क जीवन भी मूल ग्रन्थों के पास ही रहा  –  सूर्य सिद्धान्त का खगोलीय गणित, बृहत् पराशर होरा शास्त्र का व्याख्यात्मक ढाँचा, मुहूर्त चिन्तामणि की समय-निर्धारण की अनुशासित पद्धति। यह कोई बाद में सीखा हुआ विषय नहीं है  –  यह वह संसार है जिसके भीतर वे बड़े हुए हैं।',
    authorSoftware: 'सॉफ्टवेयर उनकी दूसरी मातृभाषा है। बड़े पैमाने पर सिस्टम बनाने के वर्षों में एक बात स्पष्ट हुई: शास्त्रीय ज्योतिष आरम्भ से ही एक गणनात्मक विद्या रही है। सूत्र एल्गोरिदम को संक्षिप्त करते हैं; श्लोक आकाश-मॉडल का सङ्केतन करते हैं। निराशा इस बात से थी कि आधुनिक पञ्चाङ्ग साइटें इस सूक्ष्मता को विज्ञापन, सशुल्क "रिपोर्ट" और अपारदर्शी गणनाओं के नीचे दबा देती हैं। देखो पञ्चाङ्ग इसी गणना को उसकी सही जगह वापस ले जाने के लिए है  –  खुली, सत्यापन-योग्य, निःशुल्क।',
    authorMission: 'यह परियोजना एक सरल विश्वास से जन्मी है: सूर्य सिद्धान्त और बृहत् पराशर होरा शास्त्र जैसे ग्रन्थों में संरक्षित खगोलीय और ज्योतिषीय ज्ञान सभी के लिए सुलभ होना चाहिए  –  न तो भुगतान-द्वारों के पीछे, न ही पहचानने से परे सरलीकृत।',
    authorApproach: 'इस साइट पर प्रत्येक गणना मूल सिद्धान्तों से की जाती है। ग्रहों की स्थिति स्विस एफ़ेमेरिस (NASA JPL DE441) एवं मीउस एल्गोरिदम (वैकल्पिक रूप में) पर आधारित है। पञ्चाङ्ग तत्व एवं व्याख्या-नियम शास्त्रीय ज्योतिष विधि से, नामित प्रामाणिक स्रोतों के अनुसार गणित हैं। कोई बाहरी ज्योतिष API नहीं  –  केवल गणित।',
    authorClosing: 'यह एक जुनून की परियोजना है, कोई निगम नहीं। यदि आपको इसमें मूल्य मिलता है, तो वही सबसे बड़ा पुरस्कार है।',
    consultantsHeading: 'ज्योतिषाचार्यों के साथ निर्मित, केवल उनके लिए नहीं',
    consultantsIntro: 'अकेला सॉफ्टवेयर कौशल किसी को ज्योतिष का सङ्केतन करने योग्य नहीं बनाता। इस साइट का प्रत्येक व्याख्यात्मक मॉड्यूल अनेक ज्योतिषाचार्यों के परामर्श से विकसित किया गया है  –  जो जीवित परम्परा को धारण करते हैं, पराशरी, जैमिनी एवं KP प्रणालियों में प्रशिक्षित हैं। उनकी संलग्नता केवल नामकरण तक सीमित नहीं  –  वह सत्ता-गत निर्णयों को आकार देती है।',
    consultantsScope: 'कौन-से योग शास्त्रीय हैं और कौन-से लोक-परम्परा के परिवर्धन; दशा-अन्तर्दशा-प्रत्यन्तर व्याख्या का सही क्रम; षड्बल, अष्टकवर्ग एवं वर्ग कुण्डलियों के लिए BPHS-निष्ठ सारणियाँ; मुहूर्त की वे अपवर्जनाएँ जिन्हें शास्त्रीय सङ्ग्रहकर्ताओं ने स्पष्ट रूप से सूचीबद्ध किया (विष्टि, भद्रा, पञ्चक, बुधवार का अभिजित निषेध)। जहाँ आधुनिक ग्रन्थ असहमत थे, वहाँ हमने सीधे प्रामाणिक स्रोतों का सन्दर्भ लिया तथा निर्णय हमारी सार्वजनिक विनिर्देश-पुस्तिकाओं में दर्ज है।',
    consultantsClosing: 'परिणाम वह सॉफ्टवेयर है जिसे एक आचार्य पहचानेंगे  –  विद्या के सरलीकरण के रूप में नहीं, अपितु उसके निष्ठ निरूपण के रूप में।',
    canonsHeading: 'शास्त्रीय प्रमाण-ग्रन्थों के प्रति निष्ठा',
    canonsIntro: 'इस साइट का प्रत्येक व्याख्यात्मक इञ्जन एक नामित ग्रन्थ से बँधा है  –  कभी भी "परम्परा" जैसी अस्पष्ट संज्ञा से नहीं। षड्बल की गणना में हम BPHS अध्याय 27 का चरणशः अनुसरण करते हैं। माङ्गल्य दोष की घोषणा में फलदीपिका अध्याय 6 की वास्तविक शास्त्रीय शर्तें लागू होती हैं  –  न कि अधिकांश ऐप जिस सरलीकृत लोकप्रिय रूप का उपयोग करते हैं। हम जिन ग्रन्थों का अनुसरण करते हैं:',
    canons: [
      { text: 'बृहत् पराशर होरा शास्त्र', follow: 'जन्म कुण्डली का केन्द्रीय ढाँचा  –  भाव कारकत्व, ग्रह गरिमा, शास्त्रीय योग-सङ्ग्रह, विंशोत्तरी दशा यान्त्रिकी, षड्बल, अष्टकवर्ग।' },
      { text: 'फलदीपिका (मन्त्रेश्वर)', follow: 'जन्म-योग-सङ्ग्रह तथा माङ्गल्य दोष की प्रामाणिक शर्तें (अध्याय 6), लोकप्रिय किन्तु अयथार्थ रूप के विरुद्ध संशोधित।' },
      { text: 'जैमिनी सूत्र', follow: 'चर कारक, कारकांश, पाद गणना, अर्गला व्याख्या, राशि-दशा प्रणाली।' },
      { text: 'मुहूर्त चिन्तामणि (रामाचार्य)', follow: 'शुभ-समय चयन नियम, चौघड़िया / होरा योजना, अशुभ कालों का सङ्ग्रह (विष्टि, भद्रा, पञ्चक), मुहूर्त अंकन में प्रयुक्त।' },
      { text: 'सूर्य सिद्धान्त', follow: 'खगोल विज्ञान का आधार  –  नाक्षत्र वर्ष की लम्बाई, ग्रहों की मध्य गति, अयनांश का ढाँचा। आधुनिक मानों से क्रॉस-सत्यापित।' },
      { text: 'कृष्णमूर्ति पद्धति', follow: 'उप-स्वामी गणना, शासक ग्रह चयन, हमारे KP प्रणाली मॉड्यूल में प्रयुक्त भाव-सन्धि सिद्धान्त।' },
      { text: 'सर्वार्थ चिन्तामणि', follow: 'विशिष्ट जीवन-क्षेत्रों के लिए भविष्यवाणी तकनीकें, BPHS नियमों के साथ टिप्पणी निर्माण में प्रयुक्त।' },
      { text: 'बृहज्जातकम् (वराहमिहिर)', follow: 'ताजिक नियम तथा वर्षफल गणना  –  मुन्था, साहम, मुद्दा दशा सहित।' },
    ],
    whatWeOffer: 'हम क्या प्रदान करते हैं',
    features: [
      { icon: 'calc', label: 'सटीक पंचांग', desc: 'आपके सटीक स्थान के लिए दैनिक तिथि, नक्षत्र, योग, करण और मुहूर्त समय की गणना।' },
      { icon: 'book', label: 'जन्म कुण्डली विश्लेषण', desc: 'विंशोत्तरी दशा, षड्बल, अष्टकवर्ग, योग, दोष और टिप्पणी सहित पूर्ण कुण्डली।' },
      { icon: 'code', label: 'खुली गणना', desc: 'सभी गणनाएं मीउस एल्गोरिदम पर आधारित हैं। कोई बाहरी API नहीं  –  शुद्ध गणित।' },
      { icon: 'shield', label: 'गोपनीयता प्रथम', desc: 'आपका जन्म डेटा आपका है। Row Level Security के साथ Supabase।' },
      { icon: 'globe', label: 'बहुभाषी', desc: '10 भाषाओं में उपलब्ध  –  हिन्दी, तमिल, बंगाली, तेलुगु, कन्नड़, मराठी, गुजराती, मैथिली और संस्कृत।' },
      { icon: 'learn', label: `${TOTAL_MODULES} शिक्षण मॉड्यूल`, desc: 'पंचांग मूल बातों से लेकर उन्नत ज्योतिष तक संरचित पाठ्यक्रम  –  सभी के लिए मुफ्त।' },
    ],
    accuracyHeading: 'सटीकता और कार्यप्रणाली',
    methodologyCta: 'पूर्ण कार्यप्रणाली पढ़ें →',
    accuracy: [
      { title: 'पंचांग', text: 'स्विस एफ़ेमेरिस v2.10  –  NASA JPL DE441 ग्रहीय पंचांग पर आधारित। सभी ग्रहों के लिए उप-आर्क-सेकंड सटीकता  –  वही डेटा जो NASA अन्तरिक्ष यान नेविगेशन के लिए उपयोग करता है।' },
      { title: 'अयनांश', text: 'लाहिरी (चित्रापक्ष) अयनांश मानक  –  भारत सरकार का आधिकारिक मानक। KP प्रणाली विश्लेषण के लिए कृष्णमूर्ति अयनांश भी उपलब्ध।' },
      { title: 'सत्यापन', text: '3,005 स्वचालित परीक्षण  –  पंचांग सटीकता, कुण्डली गणना, दशा अवधि, योग पहचान और त्योहार तिथियों को कवर करते हैं। पेशेवर हिन्दू पंचांगों एवं प्रामाणिक पंचांग स्रोतों से विश्व भर के अनेक स्थानों के लिए नियमित रूप से क्रॉस-सत्यापित।' },
      { title: 'सूर्योदय मॉडल', text: 'स्विस एफ़ेमेरिस वायुमण्डलीय अपवर्तन मॉडल। दिल्ली, बेंगलुरु और न्यूयॉर्क में पेशेवर पंचांग स्रोतों से ±1 मिनट के भीतर सत्यापित।' },
    ],
    heritage: [
      { title: 'सूर्य सिद्धान्त', text: 'सूर्य सिद्धान्त (लगभग 400 ई.) मानव इतिहास के सबसे उल्लेखनीय खगोलीय ग्रन्थों में से एक है। यह नाक्षत्र वर्ष की गणना 365.2563627 दिनों पर करता है  –  जो आधुनिक मान के आश्चर्यजनक रूप से निकट है।' },
      { title: 'आर्यभट की क्रान्ति', text: 'आर्यभट (476 ई.) ने प्रस्तावित किया कि पृथ्वी अपनी धुरी पर घूमती है  –  कॉपरनिकस से एक सहस्राब्दी पहले। उनके आर्यभटीय में परिष्कृत ज्या सारणियाँ और पाई 4 दशमलव तक सटीक (3.1416) है।' },
      { title: 'पञ्चाङ्ग प्रणाली', text: 'पञ्चाङ्ग ("पाँच अंग") एक चान्द्र-सौर कालदर्शिका है जो प्रतिदिन पाँच खगोलीय तत्वों  –  तिथि, नक्षत्र, योग, करण और वार  –  को ट्रैक करती है।' },
      { title: 'अयनांश: महत्वपूर्ण सुधार', text: 'भारतीय खगोल विज्ञान अयनांश के माध्यम से विषुव अयन गति का हिसाब रखता है  –  साायन और निरायन राशिचक्रों के बीच का कोणीय अन्तर। यह ~50.3 आर्क-सेकंड/वर्ष प्रिसेशन ~25,920 वर्षों में एक चक्र पूरा करती है।' },
      { title: 'ग्रहण: भविष्यवाणी शक्ति', text: 'भारतीय खगोलविदों ने राहु और केतु को चन्द्रमा की कक्षा के आरोही और अवरोही पात बिन्दुओं के रूप में पहचाना  –  जहाँ ग्रहण होते हैं।' },
    ],
    contactHeading: 'संपर्क करें',
    contactIntro: 'हम आपसे सुनना चाहेंगे। चाहे आपका कोई प्रश्न हो, बग रिपोर्ट करना हो, या बस नमस्ते कहना हो  –  संपर्क करें।',
    contactEmail: 'सामान्य पूछताछ',
    contactPrivacy: 'गोपनीयता और डेटा अनुरोध',
    contactLegal: 'कानूनी और शर्तें',
    contactResponse: 'हम आमतौर पर 48 घंटों के भीतर उत्तर देते हैं।',
    heritageHeading: 'भारतीय खगोल विज्ञान की वैज्ञानिक विरासत',
  },
  // Maithili — the author's mother tongue. Mithila is the cultural
  // setting referenced throughout the author narrative; this is the
  // highest-confidence non-en/hi translation. Other Devanagari script
  // values fall back to the Hindi block via per-key spread above.
  mai: {
    title: 'देखो पंचाङ्ग केर बारे मे',
    subtitle: 'जतय प्राचीन खगोलीय ज्ञान आधुनिक गणना सँ भेँट होइत अछि',
    authorHeading: 'लेखक केर बारे मे',
    authorIntro: 'देखो पंचाङ्ग केर निर्माण आ रखरखाव',
    authorName: 'आदित्य झा',
    authorHeritage: 'द्वारा कएल जाइत अछि  –  मिथिला केर एक मैथिल ब्राह्मण, जिनकर जड़ि वैदिक परम्परा मे गहीर अछि, आ पेशा सँ एक सॉफ्टवेयर अभियन्ता छथि।',
    authorVedic: 'आदित्य केर बचपन मिथिला केर लय मे बीतल  –  प्रातः पञ्चाङ्ग देखल जाइत छल, तिथि-आधारित व्रत-पर्व, बूझबा सँ पहिने याद भ' + 'इ जाएवला संस्कृत श्लोक। ई रुचि कहियो पुरान स्मृति मे नहि बदलल। वयस्क जीवनो मूल ग्रन्थ केर निकट रहल  –  सूर्य सिद्धान्त केर खगोलीय गणित, बृहत् पराशर होरा शास्त्र केर व्याख्यात्मक ढाँचा, मुहूर्त चिन्तामणि केर समय-निर्धारण केर अनुशासित पद्धति। ई कोनो बाद मे सीखल विषय नहि अछि  –  ई वह संसार अछि जकर भीतर ओ बढ़ल छथि।',
    authorSoftware: 'सॉफ्टवेयर हुनकर दोसर मातृभाषा अछि। बड़ पैमाना पर सिस्टम बनएबा केर वर्ष मे एक बात स्पष्ट भेलैक: शास्त्रीय ज्योतिष आरम्भ सँ एक गणनात्मक विद्या रहल अछि। सूत्र एल्गोरिदम केँ संक्षिप्त करैत अछि; श्लोक आकाश-मॉडल केर सङ्केतन करैत अछि। निराशा एहि बात सँ छल जे आधुनिक पञ्चाङ्ग साइट सब एहि सूक्ष्मता केँ विज्ञापन, सशुल्क "रिपोर्ट" आ अपारदर्शी गणना केर नीचाँ दबा दैत अछि। देखो पञ्चाङ्ग ओहि गणना केँ ओकर सही जगह वापस ल' + 'ए जयबाक लेल अछि  –  खुलल, सत्यापन-योग्य, निःशुल्क।',
    authorMission: 'ई परियोजना एक सरल विश्वास सँ जन्मल अछि: सूर्य सिद्धान्त आ बृहत् पराशर होरा शास्त्र सन ग्रन्थ मे संरक्षित खगोलीय आ ज्योतिषीय ज्ञान सभक लेल सुलभ रहबाक चाही  –  न त' + 'भुगतान-द्वार केर पाछाँ, न त' + 'पहचानवा सँ बाहर सरलीकृत।',
    authorApproach: 'एहि साइट पर प्रत्येक गणना मूल सिद्धान्त सँ कएल जाइत अछि। ग्रहक स्थिति स्विस एफ़ेमेरिस (NASA JPL DE441) आ मीउस एल्गोरिदम (वैकल्पिक रूप मे) पर आधारित अछि। पञ्चाङ्ग तत्व आ व्याख्या-नियम शास्त्रीय ज्योतिष पद्धति सँ, नामित प्रामाणिक स्रोत केर अनुसार गणित अछि। कोनो बाहरी ज्योतिष API नहि  –  केवल गणित।',
    authorClosing: 'ई एक जुनून केर परियोजना अछि, कोनो निगम नहि। यदि अहाँकेँ एहि मे मूल्य भेटैत अछि, त' + 'ओ सब सँ पैघ पुरस्कार अछि।',
    consultantsHeading: 'ज्योतिषाचार्य सबहक संग निर्मित, केवल हुनका लेल नहि',
    consultantsIntro: 'अकेला सॉफ्टवेयर कौशल केओ केँ ज्योतिष केर सङ्केतन कएबा योग्य नहि बनबैत अछि। एहि साइट केर प्रत्येक व्याख्यात्मक मॉड्यूल अनेक ज्योतिषाचार्य सबहक परामर्श सँ विकसित कएल गेल अछि  –  जे जीवित परम्परा केँ धारण करैत छथि, पराशरी, जैमिनी आ KP प्रणाली मे प्रशिक्षित छथि। हुनकर सलग्नता केवल नामकरण धरि सीमित नहि अछि  –  ओ सत्ता-गत निर्णय केँ आकार दैत अछि।',
    consultantsScope: 'कोन योग शास्त्रीय अछि आ कोन लोक-परम्परा केर परिवर्धन; दशा-अन्तर्दशा-प्रत्यन्तर व्याख्या केर सही क्रम; षड्बल, अष्टकवर्ग आ वर्ग कुण्डली केर लेल BPHS-निष्ठ सारणी; मुहूर्त केर ओ अपवर्जना सब जिनका शास्त्रीय सङ्ग्रहकर्ता स्पष्ट रूप सँ सूचीबद्ध केलनि (विष्टि, भद्रा, पञ्चक, बुधवार केर अभिजित निषेध)। जतय आधुनिक ग्रन्थ असहमत छल, ओतय हम सीधा प्रामाणिक स्रोत केर सन्दर्भ लेल आ निर्णय हमर सार्वजनिक विनिर्देश-पुस्तिका मे दर्ज अछि।',
    consultantsClosing: 'परिणाम ओ सॉफ्टवेयर अछि जकरा एक आचार्य पहचानता  –  विद्या केर सरलीकरण रूप मे नहि, बल्कि ओकर निष्ठ निरूपण रूप मे।',
    canonsHeading: 'शास्त्रीय प्रमाण-ग्रन्थ केर प्रति निष्ठा',
    canonsIntro: 'एहि साइट केर प्रत्येक व्याख्यात्मक इञ्जन एक नामित ग्रन्थ सँ बँधल अछि  –  कहियो "परम्परा" सन अस्पष्ट संज्ञा सँ नहि। षड्बल केर गणना मे हम BPHS अध्याय 27 केर चरणशः अनुसरण करैत छी। माङ्गल्य दोष केर घोषणा मे फलदीपिका अध्याय 6 केर वास्तविक शास्त्रीय शर्त लागू होइत अछि  –  न कि अधिकांश ऐप जे सरलीकृत लोकप्रिय रूप केर उपयोग करैत अछि। हम जिन ग्रन्थ केर अनुसरण करैत छी:',
    canons: [
      { text: 'बृहत् पराशर होरा शास्त्र', follow: 'जन्म कुण्डली केर केन्द्रीय ढाँचा  –  भाव कारकत्व, ग्रह गरिमा, शास्त्रीय योग-सङ्ग्रह, विंशोत्तरी दशा यान्त्रिकी, षड्बल, अष्टकवर्ग।' },
      { text: 'फलदीपिका (मन्त्रेश्वर)', follow: 'जन्म-योग-सङ्ग्रह आ माङ्गल्य दोष केर प्रामाणिक शर्त (अध्याय 6), लोकप्रिय मुदा अयथार्थ रूप केर विरुद्ध संशोधित।' },
      { text: 'जैमिनी सूत्र', follow: 'चर कारक, कारकांश, पाद गणना, अर्गला व्याख्या, राशि-दशा प्रणाली।' },
      { text: 'मुहूर्त चिन्तामणि (रामाचार्य)', follow: 'शुभ-समय चयन नियम, चौघड़िया / होरा योजना, अशुभ काल केर सङ्ग्रह (विष्टि, भद्रा, पञ्चक), मुहूर्त अंकन मे प्रयुक्त।' },
      { text: 'सूर्य सिद्धान्त', follow: 'खगोल विज्ञान केर आधार  –  नाक्षत्र वर्ष केर लम्बाई, ग्रह सबहक मध्य गति, अयनांश केर ढाँचा। आधुनिक मान सँ क्रॉस-सत्यापित।' },
      { text: 'कृष्णमूर्ति पद्धति', follow: 'उप-स्वामी गणना, शासक ग्रह चयन, हमर KP प्रणाली मॉड्यूल मे प्रयुक्त भाव-सन्धि सिद्धान्त।' },
      { text: 'सर्वार्थ चिन्तामणि', follow: 'विशिष्ट जीवन-क्षेत्र केर लेल भविष्यवाणी तकनीक, BPHS नियम केर संग टिप्पणी निर्माण मे प्रयुक्त।' },
      { text: 'बृहज्जातकम् (वराहमिहिर)', follow: 'ताजिक नियम आ वर्षफल गणना  –  मुन्था, साहम, मुद्दा दशा सहित।' },
    ],
    methodologyCta: 'पूर्ण कार्यप्रणाली पढ़ू →',
  },
  // Marathi — translated 2026-06-02. Native-speaker review welcome to
  // sharpen idiomatic flow while preserving the E-E-A-T signal.
  mr: {
    title: 'देखो पंचांगाबद्दल',
    subtitle: 'जिथे प्राचीन खगोलीय ज्ञान आधुनिक गणनेला भेटते',
    authorHeading: 'लेखकाबद्दल',
    authorIntro: 'देखो पंचांगाची निर्मिती आणि देखभाल',
    authorName: 'आदित्य झा',
    authorHeritage: 'यांच्याद्वारे केली जाते  –  मिथिलेचे एक मैथिल ब्राह्मण, ज्यांची मुळे वैदिक परंपरेत खोल आहेत, आणि व्यवसायाने एक सॉफ्टवेअर अभियंता आहेत.',
    authorVedic: 'आदित्यांचे बालपण मिथिलेच्या लयीत गेले  –  सकाळी पंचांग पाहिले जाई, तिथी-आधारित व्रते-सण, समजण्यापूर्वी पाठ झालेले संस्कृत श्लोक. ही आवड कधीच जुन्या आठवणींमध्ये विरली नाही. प्रौढ जीवनही मूळ ग्रंथांच्या जवळच राहिले  –  सूर्य सिद्धांताचे खगोलीय गणित, बृहत् पराशर होरा शास्त्राची व्याख्यात्मक चौकट, मुहूर्त चिंतामणीची काळ-निर्धारणाची शिस्तबद्ध पद्धत. हा नंतर शिकलेला विषय नाही  –  हा तो जगा आहे जिथे ते वाढले.',
    authorSoftware: 'सॉफ्टवेअर ही त्यांची दुसरी मातृभाषा आहे. मोठ्या प्रमाणावर सिस्टम तयार करण्याच्या वर्षांमध्ये एक गोष्ट स्पष्ट झाली: शास्त्रीय ज्योतिष ही सुरुवातीपासूनच एक गणनात्मक विद्या आहे. सूत्रे अल्गोरिदम संक्षेपित करतात; श्लोक आकाश-मॉडेलचे सांकेतिकीकरण करतात. निराशा होती की आधुनिक पंचांग वेबसाइट्स ही सूक्ष्मता जाहिराती, सशुल्क "अहवाल" आणि अपारदर्शक गणनांखाली दडपून टाकतात. देखो पंचांग ती गणना तिच्या योग्य ठिकाणी परत आणण्यासाठी आहे  –  खुली, सत्यापन-योग्य, मोफत.',
    authorMission: 'हा प्रकल्प एका साध्या विश्वासातून जन्माला आला: सूर्य सिद्धांत आणि बृहत् पराशर होरा शास्त्रासारख्या ग्रंथांमध्ये जतन केलेले खगोलीय आणि ज्योतिषीय ज्ञान सर्वांसाठी सुलभ असले पाहिजे  –  ना पैसाफेकीच्या भिंतीआड, ना ओळखता न येण्याइतके सरलीकृत.',
    authorApproach: 'या साइटवरील प्रत्येक गणना मूळ सिद्धांतांपासून केली जाते. ग्रहांची स्थिती स्विस एफेमेरिस (NASA JPL DE441) आणि मीउस अल्गोरिदम (वैकल्पिक) यांवर आधारित आहे. पंचांग घटक आणि व्याख्या-नियम शास्त्रीय ज्योतिष पद्धतीनुसार, नामांकित प्रामाणिक स्रोतांप्रमाणे गणले जातात. कोणतेही बाह्य ज्योतिष API नाही  –  फक्त गणित.',
    authorClosing: 'हा एक आवडीचा प्रकल्प आहे, कोणतीही कंपनी नाही. जर तुम्हाला यात मूल्य सापडले, तर तेच सर्वात मोठे बक्षीस आहे.',
    consultantsHeading: 'ज्योतिषाचार्यांसमवेत निर्मित, केवळ त्यांच्यासाठी नाही',
    consultantsIntro: 'एकटे सॉफ्टवेअर कौशल्य कुणालाही ज्योतिषाचे सांकेतिकीकरण करण्यास पात्र बनवत नाही. या साइटचे प्रत्येक व्याख्यात्मक मॉड्यूल अनेक ज्योतिषाचार्यांच्या सल्ल्याने विकसित केले आहे  –  जे जिवंत परंपरा धारण करतात, पाराशरी, जैमिनी आणि KP प्रणालींमध्ये प्रशिक्षित आहेत. त्यांचा सहभाग केवळ नामकरणापुरता मर्यादित नाही  –  तो सत्तेच्या निर्णयांना आकार देतो.',
    consultantsScope: 'कोणते योग शास्त्रीय आहेत आणि कोणते लोक-परंपरेची भर आहेत; दशा-अंतर्दशा-प्रत्यंतर व्याख्येचा योग्य क्रम; षड्बल, अष्टकवर्ग आणि वर्ग कुंडलींसाठी BPHS-निष्ठ सारण्या; मुहूर्ताच्या त्या अपवर्जना ज्या शास्त्रीय संग्रहकर्त्यांनी स्पष्टपणे सूचीबद्ध केल्या (विष्टि, भद्रा, पंचक, बुधवारचा अभिजित निषेध). जिथे आधुनिक ग्रंथ असहमत होते, तिथे आम्ही थेट प्रामाणिक स्रोतांचा संदर्भ घेतला आणि निर्णय आमच्या सार्वजनिक विनिर्देश-पुस्तिकांमध्ये नोंदवला आहे.',
    consultantsClosing: 'परिणाम म्हणजे ते सॉफ्टवेअर जे एक आचार्य ओळखतील  –  विद्येचे सरलीकरण म्हणून नाही, तर तिचे निष्ठावान निरूपण म्हणून.',
    canonsHeading: 'शास्त्रीय प्रमाण-ग्रंथांप्रती निष्ठा',
    canonsIntro: 'या साइटचे प्रत्येक व्याख्यात्मक इंजिन एका नामांकित ग्रंथाशी बांधलेले आहे  –  कधीही "परंपरा" अशा अस्पष्ट संज्ञेशी नाही. षड्बल गणनेत आम्ही BPHS अध्याय 27 चे टप्प्याटप्प्याने पालन करतो. मांगल्य दोषाच्या घोषणेत फलदीपिका अध्याय 6 च्या वास्तविक शास्त्रीय अटी लागू होतात  –  बहुतेक अ‍ॅप्स वापरत असलेल्या सरलीकृत लोकप्रिय रूपाच्या नव्हे. आम्ही अनुसरण करत असलेले ग्रंथ:',
    canons: [
      { text: 'बृहत् पराशर होरा शास्त्र', follow: 'जन्म कुंडलीची केंद्रीय चौकट  –  भाव कारकत्व, ग्रह दिग्बल, शास्त्रीय योग-संग्रह, विंशोत्तरी दशा यांत्रिकी, षड्बल, अष्टकवर्ग.' },
      { text: 'फलदीपिका (मंत्रेश्वर)', follow: 'जन्म-योग-संग्रह आणि मांगल्य दोषाच्या प्रामाणिक अटी (अध्याय 6), लोकप्रिय परंतु अयथार्थ रूपाविरुद्ध सुधारित.' },
      { text: 'जैमिनी सूत्र', follow: 'चर कारक, कारकांश, पाद गणना, अर्गला व्याख्या, राशी-दशा प्रणाली.' },
      { text: 'मुहूर्त चिंतामणि (रामाचार्य)', follow: 'शुभ-काळ निवड नियम, चौघडिया / होरा योजना, अशुभ कालांचा संग्रह (विष्टि, भद्रा, पंचक), मुहूर्त अंकन मध्ये वापरला.' },
      { text: 'सूर्य सिद्धांत', follow: 'खगोल विज्ञानाचा आधार  –  नक्षत्र वर्षाची लांबी, ग्रहांची सरासरी गती, अयनांश चौकट. आधुनिक मूल्यांशी क्रॉस-सत्यापित.' },
      { text: 'कृष्णमूर्ती पद्धती', follow: 'उप-स्वामी गणना, शासक ग्रह निवड, आमच्या KP प्रणाली मॉड्यूल मध्ये वापरलेला भाव-संधि सिद्धांत.' },
      { text: 'सर्वार्थ चिंतामणि', follow: 'विशिष्ट जीवन-क्षेत्रांसाठी भविष्यवाणी तंत्रे, BPHS नियमांसह टिप्पणी निर्मितीत वापरली.' },
      { text: 'बृहज्जातकम् (वराहमिहिर)', follow: 'ताजिक नियम आणि वर्षफल गणना  –  मुंथा, साहम, मुद्दा दशा यांच्यासह.' },
    ],
    methodologyCta: 'संपूर्ण कार्यप्रणाली वाचा →',
  },
  bn: {
    title: 'Dekho Panchang সম্পর্কে',
    subtitle: 'যেখানে প্রাচীন জ্যোতির্বিজ্ঞানের জ্ঞান আধুনিক গণনার সাথে মিলিত হয়',
    authorHeading: 'লেখক সম্পর্কে',
    authorIntro: 'Dekho Panchang দ্বারা নির্মিত এবং রক্ষণাবেক্ষণ করা হয়',
    authorName: 'আদিত্য ঝা',
    authorHeritage: 'বৈদিক ঐতিহ্যের গভীর শিকড় সহ মিথিলার একজন মৈথিল ব্রাহ্মণ এবং প্রশিক্ষণের মাধ্যমে একজন সফটওয়্যার ইঞ্জিনিয়ার।',
    authorVedic: 'আদিত্য মিথিলার ছন্দে ঠাসা হয়ে বেড়ে ওঠেন — ভোরবেলায় পঞ্চাং পরামর্শ, বাড়িতে পালন করা তিথি-ভিত্তিক ব্রত, সংস্কৃত শ্লোকগুলি বোঝার আগেই মুখস্থ হয়ে যায়। আগ্রহ কখনই নস্টালজিয়ায় ম্লান হয়নি। প্রাপ্তবয়স্ক জীবন তাকে উৎস গ্রন্থের কাছাকাছি রেখেছিল: সূর্যসিদ্ধান্তের জ্যোতির্বিদ্যা গণিত, বৃহৎ পরাশর হোরা শাস্ত্রের ব্যাখ্যামূলক কাঠামো, মুহুর্তা চিন্তামণির সময় শৃঙ্খলা। এটা তার তোলা কোনো বিষয় নয়; এটা কি সে ভিতরে বড় হয়েছে.',
    authorSoftware: 'সফটওয়্যার হল অন্য মাতৃভাষা। বছরের পর বছর ধরে বিল্ডিং সিস্টেম একটি প্যাটার্নকে অস্পষ্ট করে তুলেছে: শাস্ত্রীয় জ্যোতিষ সর্বদা একটি গণনামূলক শৃঙ্খলা। সূত্র কম্প্রেস অ্যালগরিদম; আয়াত স্কাই মডেল এনকোড. যা হতাশাজনক ছিল তা হল আধুনিক পঞ্চাং সাইটগুলি মার্কেটিং দাবি, অর্থ প্রদানের "প্রতিবেদন" এবং অস্বচ্ছ গণনার অধীনে সেই নির্ভুলতাকে সমাহিত করা দেখছে। দেখো পঞ্চং গণনাকে যেখানে আছে সেখানে ফিরিয়ে আনার জন্য বিদ্যমান — খোলা, যাচাইযোগ্য, বিনামূল্যে।',
    authorMission: 'এই প্রকল্পটি একটি সাধারণ প্রত্যয় থেকে জন্মগ্রহণ করেছে: সূর্য সিদ্ধান্ত এবং বৃহৎ পরাশর হোরা শাস্ত্রের মতো গ্রন্থে সংরক্ষিত জ্যোতির্বিদ্যা এবং জ্যোতিষশাস্ত্রীয় জ্ঞান সকলের কাছে অ্যাক্সেসযোগ্য হওয়ার যোগ্য – পেওয়ালের আড়ালে আটকানো বা স্বীকৃতির বাইরে সরলীকৃত নয়।',
    authorApproach: 'এই সাইটে প্রতিটি গণনা প্রথম নীতি থেকে করা হয়. গ্রহের অবস্থানগুলি ফলব্যাক হিসাবে Meeus অ্যালগরিদম সহ সুইস ইফেমেরিস (NASA JPL DE441) ব্যবহার করে। পঞ্চাং উপাদান এবং ব্যাখ্যামূলক নিয়মগুলি শাস্ত্রীয় জ্যোতিষ প্রেসক্রিপশন ব্যবহার করে গণনা করা হয়, নামযুক্ত প্রামাণিক উত্সগুলিতে নোঙ্গর করা হয়। কোন বাহ্যিক জ্যোতিষ এপিআই নেই - শুধু গণিত, একই গণিত যা আমাদের পূর্বপুরুষরা হাজার হাজার বছর আগে এনকোড করেছিলেন, এখন আপনার ব্রাউজারে চলছে।',
    authorClosing: 'এটি একটি আবেগ প্রকল্প, একটি কর্পোরেশন নয়। আপনি যদি এর মধ্যে মূল্য খুঁজে পান তবে এটি সর্বোত্তম পুরস্কার।',
    consultantsHeading: 'জ্যোতিষাচার্যদের নিয়ে নির্মিত, শুধু তাদের জন্য নয়',
    consultantsIntro: 'শুধুমাত্র সফ্টওয়্যার দক্ষতা কাউকে জ্যোতিষকে এনকোড করার যোগ্যতা দেয় না। এই সাইটের প্রতিটি ব্যাখ্যামূলক মডিউল একাধিক জ্যোতিষাচার্যের সাথে পরামর্শ করে তৈরি করা হয়েছিল - যারা জীবন্ত ঐতিহ্য বহন করে, পরাশরী, জৈমিনি এবং কেপি সিস্টেমে প্রশিক্ষিত। তাদের সম্পৃক্ততা শুধুমাত্র সারফেস লেবেলিং নয়, সারগর্ভ সিদ্ধান্তকে আকার দেয়।',
    consultantsScope: 'কোন যোগগুলি প্রামাণিক এবং কোনটি লোক সংযোজন; দশা-অন্তর্দশা-প্রত্যন্তর ব্যাখ্যার সঠিক অনুক্রম; শদবালা, অষ্টকবর্গ এবং বিভাগীয় চার্টের জন্য বিপিএইচএস-বিশ্বস্ত টেবিল; মুহুর্তা বর্জন যা ধ্রুপদী কম্পাইলাররা স্পষ্টভাবে তালিকাভুক্ত করেছেন (বিষ্টি, ভাদ্র, পঞ্চক, বুধবার অভিজিৎ)। যেখানে আধুনিক পাঠ্যগুলি একমত নয়, আমরা সরাসরি ক্যানোনিকাল উত্সগুলির সাথে পরামর্শ করেছি এবং আমাদের পাবলিক স্পেসিফিকেশনগুলিতে সিদ্ধান্তটি রেকর্ড করেছি যাতে ভবিষ্যতের যে কোনও রক্ষণাবেক্ষণকারী যুক্তিটি নিরীক্ষণ করতে পারে।',
    consultantsClosing: 'ফলাফল হল সফ্টওয়্যার যা একজন আচার্য চিনতে পারে — শৃঙ্খলার সরলীকরণ হিসাবে নয়, এটির বিশ্বস্ত রেন্ডারিং হিসাবে।',
    canonsHeading: 'শাস্ত্রীয় ক্যাননের প্রতি বিশ্বস্ততা',
    canonsIntro: 'এই সাইটের প্রতিটি ব্যাখ্যামূলক ইঞ্জিন একটি নামযুক্ত পাঠ্যের সাথে নোঙর করা হয় — কখনই অস্পষ্ট "ঐতিহ্য" নয়। আমরা যখন শদবালা গণনা করি, তখন আমরা ধাপে ধাপে BPHS Ch.27 অনুসরণ করি। যখন আমরা একটি মঙ্গল দোষ ঘোষণা করি, তখন আমরা সরলীকৃত জনপ্রিয় সংস্করণের পরিবর্তে ফলদীপিকা Ch.6 (প্রকৃত প্রামাণিক উত্স) থেকে শর্তগুলি প্রয়োগ করি। আমরা যে পাঠ্যগুলি অনুসরণ করি এবং প্রতিটি থেকে আমরা কী প্রয়োগ করি:',
    canons: [
      { text: 'বৃহৎ পরাশর হোরা শাস্ত্র', follow: 'কোর নেটাল চার্ট ফ্রেমওয়ার্ক — গৃহের লক্ষণ, গ্রহের মর্যাদা, ক্যানোনিকাল যোগ ক্যাটালগ, বিমশোত্তরি দশা মেকানিক্স, শদবালা (ছয়-গুণ শক্তি), অষ্টকবর্গা।' },
      { text: 'ফলদীপিকা (মন্ত্রেশ্বরা)', follow: 'জন্মগত যোগ ক্যাটালগ এবং মঙ্গল দোষ (Ch.6) এর প্রকৃত ক্যানোনিকাল অবস্থা, জনপ্রিয় কিন্তু অযৌক্তিক সংস্করণের বিপরীতে সংশোধন করা হয়েছে যা বেশিরভাগ অ্যাপ ব্যবহার করে।' },
      { text: 'জৈমিনী সূত্র', follow: 'চর কারকস, করকামশা, পদ গণনা, আরগালা ব্যাখ্যা, এবং রাশি-দশা পদ্ধতি।' },
      { text: 'মুহুর্তা চিন্তামণি (রামচার্য)', follow: 'শুভ-সময় নির্বাচনের নিয়ম, চোঘদিয়া/হোরা স্কিম, এবং অশুভ সময়ের ক্যাটালগ (বিষ্টি, ভাদ্র, পঞ্চক) আমাদের মুহুর্তা স্কোরিংয়ে ব্যবহৃত হয়।' },
      { text: 'সূর্য সিদ্ধান্ত', follow: 'ভিত্তিগত জ্যোতির্বিদ্যা — পার্শ্বীয় বছরের দৈর্ঘ্য, গ্রহের গড় গতি, আয়নামশা কাঠামো। আধুনিক মূল্যবোধের বিরুদ্ধে ক্রস-যাচাই করা হয়েছে।' },
      { text: 'কৃষ্ণমূর্তি পদ্ধতি', follow: 'সাব-লর্ড গণনা, শাসক গ্রহ নির্বাচন, এবং আমাদের কেপি সিস্টেম মডিউলে ব্যবহৃত কুসপাল উপ-তত্ত্ব।' },
      { text: 'সর্বার্থ চিন্তামণি', follow: 'বিপিএইচএস প্রেসক্রিপশনের পাশাপাশি টিপ্পান্নি প্রজন্মে ব্যবহৃত নির্দিষ্ট জীবন অঞ্চলের জন্য ভবিষ্যদ্বাণীমূলক কৌশল।' },
      { text: 'বৃহৎ জাতক (বরাহমিহিরা)', follow: 'মুনথা, সহমস এবং মুদ্দা দশা সহ তাজিকা নিয়ম এবং বর্ষফল (তাজিকা বার্ষিক চার্ট) গণনা।' },
    ],
    whatWeOffer: 'আমরা কি অফার',
    features: [
      { icon: 'calc', label: 'অবিকল পঞ্চং', desc: 'দৈনিক তিথি, নক্ষত্র, যোগ, করণ, এবং মুহুর্তের সময়গুলি আপনার সঠিক অবস্থানের জন্য জ্যোতির্বিজ্ঞানের অ্যালগরিদম ব্যবহার করে 1-2 মিনিটের মধ্যে রেফারেন্স সূত্রের মধ্যে যাচাই করা হয়েছে।' },
      { icon: 'book', label: 'পেশাগত-গ্রেড জন্ম চার্ট', desc: '25+ বিশ্লেষণ মডিউল: বিমশোত্তরি/অষ্টোত্তরি/যোগিনী দশাস, শদবালা (6-গুণ শক্তি), অষ্টকবর্গা, 16 বিভাগীয় চার্ট (D1-D60), 144 যোগ প্যাটার্ন, কেপি সিস্টেম (প্ল্যাসিডাস সাব-লর্ডস), জৈমিনি কারাকাস, অর্ধবস্তু, চার্ভাস্ত, অর্ধশতা, অর্পিত চ্যাট সুইস এফিমেরিস থেকে স্থানীয়ভাবে গণনা করা হয়েছে, কোনো বাহ্যিক API নেই।' },
      { icon: 'code', label: 'NASA JPL Ephemeris Precision', desc: 'প্রাথমিক ইঞ্জিন: সুইস ইফেমেরিস NASA JPL DE441 দ্বারা চালিত প্ল্যানেটারি ইফেমেরিস – সমস্ত 9টি গ্রহের জন্য আর্কসেকেন্ড নির্ভুলতা, মহাকাশযান নেভিগেশনের জন্য NASA দ্বারা ব্যবহৃত একই ডেটা। ফলব্যাক হিসাবে Meeus অ্যালগরিদম. কোন ব্ল্যাক-বক্স এপিআই নেই – খোলা, যাচাইযোগ্য জ্যোতির্বিদ্যাগত গণনা।' },
      { icon: 'shield', label: 'গোপনীয়তা প্রথম', desc: 'আপনার জন্ম তথ্য আপনার থেকে যায়. আমরা সারি স্তরের নিরাপত্তা সহ সুপাবেস ব্যবহার করি - ব্যবহারকারীরা শুধুমাত্র তাদের নিজস্ব ডেটা অ্যাক্সেস করতে পারে। তৃতীয় পক্ষের কাছে ব্যক্তিগত তথ্য বিক্রি করা যাবে না।' },
      { icon: 'globe', label: 'বহুভাষিক', desc: 'হিন্দি, তামিল, বাংলা, তেলেগু, কন্নড়, মারাঠি, গুজরাটি, মৈথিলি এবং সংস্কৃত সহ 10টি ভাষায় উপলব্ধ। বাস্তব অনুবাদ, মেশিন দ্বারা তৈরি নয়।' },
      { icon: 'learn', label: `${TOTAL_MODULES} Learning Modules`, desc: 'একটি কাঠামোগত পাঠ্যক্রম যা পঞ্চাঙ্গ মৌলিক বিষয় থেকে শুরু করে উন্নত জৈমিনি জ্যোতিষ, শব্দবালা, কেপি সিস্টেম, এবং অষ্টকবর্গ পর্যন্ত সমস্ত কিছুকে কভার করে – সবার জন্য বিনামূল্যে।' },
    ],
    accuracyHeading: 'নির্ভুলতা এবং পদ্ধতি',
    methodologyCta: 'সম্পূর্ণ পদ্ধতি পড়ুন →',
    accuracy: [
      { title: 'ইফিমেরিস', text: 'NASA JPL DE441 দ্বারা চালিত Swiss Ephemeris v2.10 - একই গ্রহের ইফেমেরিস যা NASA দ্বারা মহাকাশযান নেভিগেশনের জন্য ব্যবহৃত হয়। সূর্য, চন্দ্র এবং প্রকৃত চন্দ্রের নোড (রাহু/কেতু) সহ সমস্ত গ্রহের জন্য সাব-আর্কসেকেন্ড নির্ভুলতা।' },
      { title: 'আয়নামশা', text: 'লাহিড়ী (চিত্রপক্ষ) ডিফল্ট হিসাবে আয়নামশা - ভারতীয় জ্যোতির্বিদ্যার ইফেমেরিস দ্বারা ব্যবহৃত ভারতীয় সরকার মান। কৃষ্ণমূর্তি আয়নামশা কেপি সিস্টেম বিশ্লেষণের জন্য উপলব্ধ।' },
      { title: 'যাচাইকরণ', text: '3,005টি স্বয়ংক্রিয় পরীক্ষাগুলি পঞ্চং নির্ভুলতা, কুন্ডলি গণনা, দশা সময়কাল, যোগ শনাক্তকরণ, এবং উত্সবের তারিখগুলি কভার করে৷ বিশ্বব্যাপী একাধিক স্থানের জন্য পেশাদার হিন্দু পঞ্জিকা এবং প্রামাণিক পঞ্চাং উৎসের বিরুদ্ধে নিয়মিত ক্রস-ভেরিফাই করা হয়।' },
      { title: 'সূর্যোদয় মডেল', text: 'সুইস এফিমেরিস বায়ুমণ্ডলীয় প্রতিসরণ মডেল পর্যবেক্ষকের উচ্চতা, তাপমাত্রা এবং চাপের জন্য অ্যাকাউন্টিং। দিল্লি, ব্যাঙ্গালোর এবং নিউ ইয়র্ক জুড়ে পেশাদার পঞ্চাং উৎসের ±1 মিনিটের মধ্যে যাচাই করা হয়েছে।' },
    ],
    heritage: [
      { title: 'সূর্যসিদ্ধান্ত', text: 'সূর্য সিদ্ধান্ত (আনুমানিক 400 CE) মানব ইতিহাসের সবচেয়ে উল্লেখযোগ্য জ্যোতির্বিদ্যা সংক্রান্ত গ্রন্থগুলির মধ্যে একটি। এটি নির্ভুলভাবে 365.2563627 দিনে পার্শ্বীয় বছর গণনা করে - একটি চিত্র আশ্চর্যজনকভাবে 365.25636 দিনের আধুনিক মানের কাছাকাছি। এটি গ্রহের অবস্থান, গ্রহনের ভবিষ্যদ্বাণী এবং বিষুবগুলির অগ্রগতির জন্য সুনির্দিষ্ট সূত্র প্রদান করে।' },
      { title: 'আর্যভট্টের বিপ্লব', text: 'আর্যভট্ট (476 CE) প্রস্তাব করেছিলেন যে পৃথিবী তার অক্ষের উপর ঘুরছে – কোপার্নিকাসের এক সহস্রাব্দ আগে। তার আর্যভটিয়ায় রয়েছে অত্যাধুনিক সাইন টেবিল, পাই 4 দশমিক স্থানের নির্ভুল (3.1416), এবং গ্রহের গণনার জন্য অ্যালগরিদম আজও প্রশংসিত।' },
      { title: 'পঞ্চাঙ্গ সিস্টেম', text: 'পঞ্চাং ("পাঁচটি অঙ্গ") হল একটি চাঁদের সৌর ক্যালেন্ডার যা পাঁচটি জ্যোতির্বিদ্যার উপাদানগুলিকে ট্র্যাক করে: তিথি (চন্দ্র দিন), নক্ষত্র (চন্দ্রের প্রাসাদ), যোগ (চন্দ্র-সৌর কোণ), করণ (অর্ধ-তিথি) এবং ভারা (সপ্তাহের দিন)। এটি একই সাথে সূর্যের সাপেক্ষে এবং স্থির তারার বিপরীতে চাঁদের অবস্থান ট্র্যাক করে।' },
      { title: 'আয়নামশা: সমালোচনামূলক সংশোধন', text: 'ভারতীয় জ্যোতির্বিদ্যা আয়নামশা-এর মাধ্যমে বিষুবগুলির অগ্রগতির জন্য দায়ী - গ্রীষ্মমন্ডলীয় এবং পার্শ্বীয় রাশিচক্রের মধ্যে কৌণিক পার্থক্য। এই ~50.3 আর্ক-সেকেন্ড/বছরের অগ্রগতি ~25,920 বছরে একটি চক্র সম্পূর্ণ করে। লাহিড়ী আয়নামশা বর্তমানে ~24 ডিগ্রি।' },
      { title: 'Eclipses: ভবিষ্যদ্বাণীমূলক শক্তি', text: 'ভারতীয় জ্যোতির্বিজ্ঞানীরা রাহু এবং কেতুকে চাঁদের কক্ষপথের আরোহী এবং অবরোহী নোড হিসাবে চিহ্নিত করেছেন - যেখানে গ্রহন ঘটে। সরোস চক্র (~18 বছর) স্বাধীনভাবে আবিষ্কৃত হয়েছিল। আধুনিক গণনার বিপরীতে যাচাই করা হলে প্রাচীন গ্রহন গণনা সারণীগুলি অসাধারণ নির্ভুলতা দেখায়।' },
    ],
    contactHeading: 'আমাদের সাথে যোগাযোগ করুন',
    contactIntro: 'আমরা আপনার কাছ থেকে শুনতে চাই. আমাদের গণনা সম্পর্কে আপনার কোন প্রশ্ন আছে, একটি বাগ রিপোর্ট করতে চান, বা শুধু হ্যালো বলতে চান – যোগাযোগ করুন।',
    contactEmail: 'সাধারণ জিজ্ঞাসা',
    contactPrivacy: 'গোপনীয়তা এবং ডেটা অনুরোধ',
    contactLegal: 'আইনি এবং শর্তাবলী',
    contactResponse: 'আমরা সাধারণত 48 ঘন্টার মধ্যে প্রতিক্রিয়া জানাই।',
    heritageHeading: 'ভারতীয় জ্যোতির্বিদ্যার বৈজ্ঞানিক ঐতিহ্য',
  },
  ta: {
    title: 'தேகோ பஞ்சாங்கம் பற்றி',
    subtitle: 'பண்டைய வானியல் ஞானம் நவீன கணக்கீட்டை சந்திக்கும் இடம்',
    authorHeading: 'ஆசிரியரைப் பற்றி',
    authorIntro: 'தேகோ பஞ்சாங்கம் கட்டப்பட்டு பராமரிக்கப்படுகிறது',
    authorName: 'ஆதித்யா ஜா',
    authorHeritage: 'வேத பாரம்பரியத்தில் ஆழமான வேர்களைக் கொண்ட மிதிலாவைச் சேர்ந்த மைதில் பிராமணர் மற்றும் பயிற்சியின் மூலம் ஒரு மென்பொருள் பொறியாளர்.',
    authorVedic: 'ஆதித்யா மிதிலாவின் தாளங்களில் மூழ்கி வளர்ந்தார் - விடியற்காலையில் பஞ்சாங்கம் ஆலோசனை, வீட்டில் அனுசரிக்கப்படும் திதி சார்ந்த விரதங்கள், சமஸ்கிருத ஸ்லோகங்கள் புரியும் முன்பே மனப்பாடம் செய்தன. ஆர்வம் ஒரு போதும் ஏக்கத்தில் மறைந்ததில்லை. வயதுவந்த வாழ்க்கை அவரை மூல நூல்களுடன் நெருக்கமாக வைத்திருந்தது: சூரிய சித்தாந்தத்தின் வானியல் கணிதம், பிருஹத் பராசர ஹோரா சாஸ்திரத்தின் விளக்கக் கட்டமைப்பு, முஹூர்த்த சிந்தாமணியின் நேரக் கட்டுப்பாடு. இது அவர் எடுத்த பொருள் அல்ல; அது அவர் உள்ளே வளர்ந்தது.',
    authorSoftware: 'மென்பொருள் மற்ற தாய்மொழி. பல ஆண்டுகளாக கட்டியமைக்கப்பட்ட அமைப்புகள் ஒரு வடிவத்தை தவறாமல் செய்தன: கிளாசிக்கல் ஜோதிஷ் எப்போதுமே ஒரு கணக்கீட்டு ஒழுக்கமாக இருந்து வருகிறது. சூத்திரங்கள் கம்ப்ரஸ் அல்காரிதம்கள்; வசனங்கள் வான மாதிரிகளை குறியாக்கம் செய்கின்றன. ஏமாற்றமளிக்கும் விஷயம் என்னவென்றால், நவீன பஞ்சாங்க தளங்கள் அந்த துல்லியத்தை சந்தைப்படுத்தல் உரிமைகோரல்கள், பணம் செலுத்திய "அறிக்கைகள்" மற்றும் ஒளிபுகா கணக்கீடுகளின் கீழ் புதைப்பதைப் பார்ப்பது. டெகோ பஞ்சாங்கம் கணக்கீட்டை மீண்டும் அதன் சொந்த இடத்தில் வைக்க உள்ளது - திறந்த, சரிபார்க்கக்கூடிய, இலவசம்.',
    authorMission: 'இந்த திட்டம் ஒரு எளிய நம்பிக்கையில் இருந்து பிறந்தது: சூரிய சித்தாந்தம் மற்றும் பிருஹத் பராசர ஹோரா சாஸ்திரம் போன்ற நூல்களில் பாதுகாக்கப்பட்ட வானியல் மற்றும் ஜோதிட அறிவு அனைவருக்கும் அணுகக்கூடியது - பேவால்களுக்குப் பின்னால் பூட்டப்படவில்லை அல்லது அடையாளம் காண முடியாத அளவுக்கு எளிமைப்படுத்தப்படவில்லை.',
    authorApproach: 'இந்த தளத்தில் உள்ள ஒவ்வொரு கணக்கீடும் முதல் கொள்கைகளிலிருந்து செய்யப்படுகிறது. கோள்களின் நிலைகள் சுவிஸ் எபிமெரிஸ் (NASA JPL DE441) ஐ மீயஸ் அல்காரிதங்களுடன் ஃபால்பேக்காகப் பயன்படுத்துகின்றன. பஞ்சாங்கக் கூறுகள் மற்றும் விளக்க விதிகள் பாரம்பரிய ஜோதிஷ் மருந்துகளைப் பயன்படுத்தி கணக்கிடப்படுகின்றன, அவை பெயரிடப்பட்ட நியமன ஆதாரங்களுடன் இணைக்கப்பட்டுள்ளன. வெளிப்புற ஜோதிட APIகள் எதுவும் இல்லை - வெறும் கணிதம், ஆயிரக்கணக்கான ஆண்டுகளுக்கு முன்பு நம் முன்னோர்கள் குறியாக்கம் செய்த அதே கணிதம், இப்போது உங்கள் உலாவியில் இயங்குகிறது.',
    authorClosing: 'இது ஒரு பேரார்வம் திட்டம், ஒரு நிறுவனம் அல்ல. நீங்கள் அதில் மதிப்பைக் கண்டால், அதுவே சிறந்த வெகுமதியாகும்.',
    consultantsHeading: 'ஜோதிஷாச்சாரியார்களால் கட்டப்பட்டது, அவர்களுக்காக மட்டுமல்ல',
    consultantsIntro: 'மென்பொருள் நிபுணத்துவம் மட்டுமே ஜோதிஷை குறியாக்க யாருக்கும் தகுதி இல்லை. இந்த தளத்தில் உள்ள ஒவ்வொரு விளக்கமளிக்கும் தொகுதியும் பல ஜோதிஷாச்சாரியார்களுடன் கலந்தாலோசித்து உருவாக்கப்பட்டது - பராசரி, ஜைமினி மற்றும் கேபி அமைப்புகளில் பயிற்சி பெற்ற வாழும் பாரம்பரியத்தை கொண்டுள்ள அறிஞர்கள். அவர்களின் ஈடுபாடு மேற்பரப்பு லேபிளிங் மட்டுமல்ல, கணிசமான முடிவுகளை வடிவமைக்கிறது.',
    consultantsScope: 'எந்த யோகாக்கள் நியதி மற்றும் நாட்டுப்புற சேர்க்கைகள்; தசா-அந்தர்தசா-பிரத்யந்தர் விளக்கத்தின் சரியான வரிசைமுறை; ஷட்பலா, அஷ்டகவர்கா மற்றும் பிரிவு விளக்கப்படங்களுக்கான BPHS-விசுவாச அட்டவணைகள்; கிளாசிக்கல் தொகுப்பாளர்கள் வெளிப்படையாக பட்டியலிட்ட முஹூர்த்த விலக்குகள் (விஷ்டி, பத்ரா, பஞ்சகா, புதன் அபிஜித்). நவீன நூல்கள் உடன்படாத இடங்களில், நாங்கள் நியமன ஆதாரங்களை நேரடியாகக் கலந்தாலோசித்து, எங்களின் பொது விவரக்குறிப்புகளில் முடிவைப் பதிவு செய்தோம், எனவே எதிர்கால பராமரிப்பாளரும் காரணத்தை தணிக்கை செய்யலாம்.',
    consultantsClosing: 'இதன் விளைவாக, ஒரு ஆச்சார்யா அங்கீகரிக்கும் மென்பொருள் - ஒழுக்கத்தை எளிமைப்படுத்துவது அல்ல, ஆனால் அதை உண்மையாக வழங்குவது.',
    canonsHeading: 'கிளாசிக்கல் நியதிகளுக்கு விசுவாசம்',
    canonsIntro: 'இந்த தளத்தில் உள்ள ஒவ்வொரு விளக்க இயந்திரமும் பெயரிடப்பட்ட உரையுடன் இணைக்கப்பட்டுள்ளது - ஒருபோதும் தெளிவற்ற "பாரம்பரியம்". நாம் ஷட்பாலாவைக் கணக்கிடும்போது, ​​BPHS Ch.27ஐ படிப்படியாகப் பின்பற்றுகிறோம். நாம் மங்கல் தோஷத்தை அறிவிக்கும்போது, ​​எளிமைப்படுத்தப்பட்ட பிரபலமான பதிப்பிற்குப் பதிலாக, ஃபலதீபிகா Ch.6 (உண்மையான நியமன ஆதாரம்) இலிருந்து நிபந்தனைகளைப் பயன்படுத்துகிறோம். நாம் பின்பற்றும் நூல்கள் மற்றும் ஒவ்வொன்றிலிருந்தும் நாம் செயல்படுத்துவது:',
    canons: [
      { text: 'பிருஹத் பராசர ஹோரா சாஸ்திரம்', follow: 'கோர் நேட்டல் சார்ட் ஃப்ரேம்வொர்க் - வீட்டின் அடையாளங்கள், கிரக கௌரவங்கள், நியதி யோகப் பட்டியல், விம்ஷோத்தரி தசா இயக்கவியல், ஷட்பல (ஆறு மடங்கு வலிமை), அஷ்டகவர்க்கம்.' },
      { text: 'பலதீபிகா (மந்திரேஸ்வரா)', follow: 'நேட்டல் யோகா பட்டியல் மற்றும் மங்கல் தோஷாவின் (Ch.6) உண்மையான நியதி நிலைமைகள், பெரும்பாலான பயன்பாடுகள் பயன்படுத்தும் பிரபலப்படுத்தப்பட்ட ஆனால் தவறான பதிப்பிற்கு எதிராக சரி செய்யப்பட்டது.' },
      { text: 'ஜைமினி சூத்திரங்கள்', follow: 'சார காரகங்கள், காரகம்ஷா, பாத கணக்கீடுகள், அர்காலா விளக்கம் மற்றும் ராஷி-தசா அமைப்பு.' },
      { text: 'முஹூர்த்த சிந்தாமணி (ராமாச்சார்யா)', follow: 'சுப நேரத் தேர்வு விதிகள், சோகாதியா/ஹோரா திட்டங்கள், மற்றும் அசுப காலங்களின் பட்டியல் (விஷ்டி, பத்ரா, பஞ்சகம்) நமது முஹூர்த்த மதிப்பெண்ணில் பயன்படுத்தப்படும்.' },
      { text: 'சூரிய சித்தாந்தம்', follow: 'அடிப்படை வானியல் - பக்கவாட்டு ஆண்டு நீளம், கோள்களின் சராசரி இயக்கங்கள், அயனாம்ஷா கட்டமைப்பு. நவீன மதிப்புகளுக்கு எதிராக குறுக்கு சரிபார்க்கப்பட்டது.' },
      { text: 'கிருஷ்ணமூர்த்தி பத்தாதி', follow: 'துணை-இறைவன் கணக்கீடுகள், ஆளும் கிரகம் தேர்வு மற்றும் எங்கள் கேபி சிஸ்டம் தொகுதியில் பயன்படுத்தப்படும் கஸ்பல் துணை கோட்பாடு.' },
      { text: 'சர்வார்த்த சிந்தாமணி', follow: 'குறிப்பிட்ட வாழ்க்கை பகுதிகளுக்கான முன்கணிப்பு நுட்பங்கள், BPHS மருந்துகளுடன் சேர்த்து டிப்பன்னி தலைமுறையில் பயன்படுத்தப்படுகிறது.' },
      { text: 'பிருஹத் ஜாதகர் (வராஹமிஹிரா)', follow: 'தாஜிகா விதிகள் மற்றும் முந்தா, சஹாம்ஸ் மற்றும் முடா தாஷா உள்ளிட்ட வர்ஷபால் (தாஜிகா ஆண்டு விளக்கப்படம்) கணக்கீடு.' },
    ],
    whatWeOffer: 'நாங்கள் என்ன வழங்குகிறோம்',
    features: [
      { icon: 'calc', label: 'துல்லியமான பஞ்சாங்கம்', desc: 'தினசரி திதி, நக்ஷத்ரா, யோகா, கரண மற்றும் முஹூர்த்த நேரங்கள், 1-2 நிமிட ஆதாரங்களில் சரிபார்க்கப்பட்ட வானியல் அல்காரிதம்களைப் பயன்படுத்தி உங்கள் சரியான இருப்பிடத்திற்காக கணக்கிடப்படுகிறது.' },
      { icon: 'book', label: 'தொழில்முறை-தர பிறப்பு விளக்கப்படம்', desc: '25+ பகுப்பாய்வு தொகுதிகள்: விம்ஷோத்தரி/அஷ்டோத்தரி/யோகினி தசாக்கள், ஷட்பலா (6 மடங்கு வலிமை), அஷ்டகவர்கா, 16 பிரிவு விளக்கப்படங்கள் (D1-D60), 144 யோகா முறைகள், KP அமைப்பு (Placidus sub-lords), Jaimini Karakas, Avasthas -Plus.Avathas, Argala, சுவிஸ் எபிமெரிஸிலிருந்து உள்நாட்டில் கணக்கிடப்பட்டது, வெளிப்புற APIகள் இல்லை.' },
      { icon: 'code', label: 'நாசா ஜேபிஎல் எபிமெரிஸ் துல்லியம்', desc: 'முதன்மை இயந்திரம்: NASA JPL DE441 கிரக எபிமெரிஸ் மூலம் இயக்கப்படும் சுவிஸ் எபிமெரிஸ் - அனைத்து 9 கிரகங்களுக்கும் ஆர்க்செகண்ட் துல்லியம், விண்கல வழிசெலுத்தலுக்கு நாசா பயன்படுத்தும் அதே தரவு. மீயஸ் அல்காரிதம்கள் ஃபால்பேக். கருப்பு பெட்டி APIகள் இல்லை - திறந்த, சரிபார்க்கக்கூடிய வானியல் கணக்கீடு.' },
      { icon: 'shield', label: 'தனியுரிமை முதலில்', desc: 'உங்கள் பிறப்பு தரவு உங்களுடையதாகவே இருக்கும். வரிசை நிலை பாதுகாப்புடன் நாங்கள் Supabase ஐப் பயன்படுத்துகிறோம் - பயனர்கள் தங்கள் சொந்த தரவை மட்டுமே அணுக முடியும். மூன்றாம் தரப்பினருக்கு தனிப்பட்ட தகவல்களை விற்க முடியாது.' },
      { icon: 'globe', label: 'பன்மொழி', desc: 'இந்தி, தமிழ், பெங்காலி, தெலுங்கு, கன்னடம், மராத்தி, குஜராத்தி, மைதிலி மற்றும் சமஸ்கிருதம் உட்பட 10 மொழிகளில் கிடைக்கிறது. உண்மையான மொழிபெயர்ப்பு, இயந்திரத்தால் உருவாக்கப்படவில்லை.' },
      { icon: 'learn', label: `${TOTAL_MODULES} Learning Modules`, desc: 'பஞ்சாங்க அடிப்படைகள் முதல் மேம்பட்ட ஜைமினி ஜோதிஷ், ஷட்பலா, கேபி சிஸ்டம் மற்றும் அஷ்டகவர்கா வரை அனைத்தையும் உள்ளடக்கிய கட்டமைக்கப்பட்ட பாடத்திட்டம் - அனைவருக்கும் இலவசம்.' },
    ],
    accuracyHeading: 'துல்லியம் & முறை',
    methodologyCta: 'முழு வழிமுறையையும் படிக்கவும் →',
    accuracy: [
      { title: 'எபிமெரிஸ்', text: 'NASA JPL DE441 ஆல் இயக்கப்படும் சுவிஸ் Ephemeris v2.10 - விண்கலம் வழிசெலுத்துவதற்கு நாசாவால் பயன்படுத்தப்படும் அதே கிரக எபிமெரிஸ். சூரியன், சந்திரன் மற்றும் உண்மையான சந்திர கணுக்கள் (ராகு/கேது) உட்பட அனைத்து கிரகங்களுக்கும் துணை வினாடி துல்லியம்.' },
      { title: 'அயனம்ஷா', text: 'லாஹிரி (சித்ரபக்ஷ) அயனம்ஷா முன்னிருப்பாக - இந்திய வானியல் எபிமெரிஸால் பயன்படுத்தப்படும் இந்திய அரசாங்க தரநிலை. கேபி சிஸ்டம் பகுப்பாய்விற்கு கிருஷ்ணமூர்த்தி அயனம்ஷா உள்ளது.' },
      { title: 'சரிபார்ப்பு', text: 'பஞ்சாங்கத்தின் துல்லியம், குண்டலி கணக்கீடு, தசா காலங்கள், யோகா கண்டறிதல் மற்றும் திருவிழா தேதிகள் ஆகியவற்றை உள்ளடக்கிய 3,005 தானியங்கு சோதனைகள். உலகெங்கிலும் உள்ள பல இடங்களுக்கான தொழில்முறை இந்து பஞ்சாங்கங்கள் மற்றும் அதிகாரப்பூர்வ பஞ்சாங்க ஆதாரங்களுக்கு எதிராக வழக்கமாக குறுக்கு சரிபார்க்கப்பட்டது.' },
      { title: 'சூரிய உதயம் மாதிரி', text: 'சுவிஸ் எபிமெரிஸ் வளிமண்டல ஒளிவிலகல் மாதிரி பார்வையாளர்களின் உயரம், வெப்பநிலை மற்றும் அழுத்தம் ஆகியவற்றைக் கணக்கிடுகிறது. டெல்லி, பெங்களூர் மற்றும் நியூயார்க்கில் உள்ள தொழில்முறை பஞ்சாங்க ஆதாரங்களில் இருந்து ±1 நிமிடத்திற்குள் சரிபார்க்கப்பட்டது.' },
    ],
    heritage: [
      { title: 'சூரிய சித்தாந்தம்', text: 'சூரிய சித்தாந்தம் (கி.பி. 400) மனித வரலாற்றில் மிகவும் குறிப்பிடத்தக்க வானியல் நூல்களில் ஒன்றாகும். இது பக்கவாட்டு ஆண்டை 365.2563627 நாட்களில் துல்லியமாகக் கணக்கிடுகிறது - இது 365.25636 நாட்களின் நவீன மதிப்பிற்கு வியக்கத்தக்க வகையில் நெருக்கமாக உள்ளது. இது கிரக நிலைகள், கிரகண கணிப்புகள் மற்றும் உத்தராயணங்களின் முன்னோடிக்கான துல்லியமான சூத்திரங்களை வழங்குகிறது.' },
      { title: 'ஆர்யபட்டாவின் புரட்சி', text: 'ஆர்யபட்டா (476 CE) பூமி அதன் அச்சில் சுழல்கிறது என்று முன்மொழிந்தார் - கோப்பர்நிக்கஸுக்கு முன் ஒரு மில்லினியம். அவரது ஆர்யபட்டியாவில் அதிநவீன சைன் அட்டவணைகள் உள்ளன, 4 தசம இடங்களுக்கு (3.1416) துல்லியமான பை, மற்றும் கிரக கணக்கீடுகளுக்கான வழிமுறைகள் இன்றும் போற்றப்படுகின்றன.' },
      { title: 'பஞ்சாங்க அமைப்பு', text: 'பஞ்சாங்கம் ("ஐந்து மூட்டுகள்") என்பது ஐந்து வானியல் கூறுகளைக் கண்காணிக்கும் ஒரு சந்திர நாட்காட்டியாகும்: திதி (சந்திர நாள்), நக்ஷத்ரா (சந்திர மாளிகை), யோகா (லூனி-சூரிய கோணம்), கரண (அரை-திதி) மற்றும் வரா (வார நாள்). இது சூரியனுடன் ஒப்பிடும்போது மற்றும் நிலையான நட்சத்திரங்களுக்கு எதிராக சந்திரனின் நிலையை ஒரே நேரத்தில் கண்காணிக்கிறது.' },
      { title: 'அயனாம்ஷா: முக்கியமான திருத்தம்', text: 'இந்திய வானியல் அயனாம்ஷா மூலம் உத்தராயணங்களை முன்னோக்கி நகர்த்துகிறது - வெப்பமண்டல மற்றும் பக்க ராசிகளுக்கு இடையிலான கோண வேறுபாடு. இந்த ~50.3 ஆர்க்-வினாடிகள்/ஆண்டு முன்னோட்டம் ~25,920 ஆண்டுகளில் ஒரு சுழற்சியை நிறைவு செய்கிறது. லஹிரி அயனம்ஷா தற்போது ~24 டிகிரியாக உள்ளது.' },
      { title: 'கிரகணங்கள்: கணிக்கும் சக்தி', text: 'இந்திய வானியலாளர்கள் ராகு மற்றும் கேதுவை சந்திரனின் சுற்றுப்பாதையின் ஏறுவரிசை மற்றும் இறங்கு முனைகளாக அடையாளம் கண்டுள்ளனர் - அங்கு கிரகணங்கள் நிகழ்கின்றன. சரோஸ் சுழற்சி (~18 ஆண்டுகள்) சுயாதீனமாக கண்டுபிடிக்கப்பட்டது. பண்டைய கிரகண கணக்கீட்டு அட்டவணைகள் நவீன கணக்கீடுகளுக்கு எதிராக சரிபார்க்கப்படும் போது குறிப்பிடத்தக்க துல்லியத்தை காட்டுகின்றன.' },
    ],
    contactHeading: 'எங்களை தொடர்பு கொள்ளவும்',
    contactIntro: 'நாங்கள் உங்களிடமிருந்து கேட்க விரும்புகிறோம். எங்கள் கணக்கீடுகளைப் பற்றி உங்களுக்கு ஏதேனும் கேள்விகள் இருந்தால், பிழையைப் புகாரளிக்க விரும்புகிறீர்களா அல்லது ஹலோ சொல்ல விரும்பினாலும் - அணுகவும்.',
    contactEmail: 'பொதுவான விசாரணைகள்',
    contactPrivacy: 'தனியுரிமை மற்றும் தரவு கோரிக்கைகள்',
    contactLegal: 'சட்ட & விதிமுறைகள்',
    contactResponse: 'நாங்கள் பொதுவாக 48 மணி நேரத்திற்குள் பதிலளிக்கிறோம்.',
    heritageHeading: 'இந்திய வானியல் அறிவியல் பாரம்பரியம்',
  },
  te: {
    title: 'దేఖో పంచాంగ్ గురించి',
    subtitle: 'పురాతన ఖగోళ జ్ఞానం ఆధునిక గణనను కలిసే చోట',
    authorHeading: 'రచయిత గురించి',
    authorIntro: 'దేఖో పంచాంగ్ నిర్మించబడింది మరియు నిర్వహించబడుతుంది',
    authorName: 'ఆదిత్య ఝా',
    authorHeritage: 'వేద సంప్రదాయంలో లోతైన మూలాలు ఉన్న మిథిలాకు చెందిన మైథిల్ బ్రాహ్మణుడు మరియు శిక్షణ ద్వారా సాఫ్ట్‌వేర్ ఇంజనీర్.',
    authorVedic: 'ఆదిత్య మిథిలా లయలలో మునిగి పెరిగాడు - తెల్లవారుజామున పంచాంగం సంప్రదించడం, ఇంట్లో ఆచరించే తిథి ఆధారిత వ్రతాలు, సంస్కృత శ్లోకాలు అర్థం కాకముందే కంఠస్థం. ఆసక్తి నాస్టాల్జియాలోకి ఎప్పటికీ తగ్గలేదు. వయోజన జీవితం అతనిని మూల గ్రంథాలకు దగ్గరగా ఉంచింది: సూర్య సిద్ధాంతం యొక్క ఖగోళ గణిత శాస్త్రం, బృహత్ పరాశర హోరా శాస్త్రం యొక్క వివరణాత్మక ఫ్రేమ్‌వర్క్, ముహూర్త చింతామణి యొక్క సమయ క్రమశిక్షణ. ఇది అతను ఎంచుకున్న విషయం కాదు; అది అతను లోపల పెరిగినది.',
    authorSoftware: 'సాఫ్ట్‌వేర్ ఇతర మాతృభాష. స్కేల్‌లో సంవత్సరాల తరబడి ఉన్న నిర్మాణ వ్యవస్థలు ఒక నమూనాను గుర్తించలేని విధంగా చేశాయి: శాస్త్రీయ జ్యోతిష్ ఎల్లప్పుడూ గణన క్రమశిక్షణగా ఉంది. సూత్రాలు కుదించు అల్గారిథమ్‌లు; పద్యాలు ఆకాశ-నమూనాలను ఎన్కోడ్ చేస్తాయి. మార్కెటింగ్ క్లెయిమ్‌లు, చెల్లింపు "నివేదికలు" మరియు అపారదర్శక లెక్కల కింద ఆధునిక పంచాంగ్ సైట్‌లు ఖచ్చితత్వాన్ని పూడ్చడాన్ని చూడటం నిరాశపరిచింది. దేఖో పంచాంగ్ అనేది గణనను తిరిగి ఎక్కడిదో అక్కడ ఉంచడానికి ఉంది — ఓపెన్, వెరిఫై చేయదగినది, ఉచితం.',
    authorMission: 'ఈ ప్రాజెక్ట్ ఒక సాధారణ నమ్మకం నుండి పుట్టింది: సూర్య సిద్ధాంతం మరియు బృహత్ పరాశర హోరా శాస్త్రం వంటి గ్రంథాలలో భద్రపరచబడిన ఖగోళ మరియు జ్యోతిషశాస్త్ర జ్ఞానం ప్రతి ఒక్కరికీ అందుబాటులో ఉండటానికి అర్హమైనది - పేవాల్‌ల వెనుక లాక్ చేయబడదు లేదా గుర్తించబడని విధంగా సరళీకృతం చేయబడదు.',
    authorApproach: 'ఈ సైట్‌లోని ప్రతి గణన మొదటి సూత్రాల నుండి చేయబడుతుంది. గ్రహ స్థానాలు స్విస్ ఎఫెమెరిస్ (NASA JPL DE441)ని మీయుస్ అల్గారిథమ్‌లతో ఫాల్‌బ్యాక్‌గా ఉపయోగిస్తాయి. పంచాంగ్ మూలకాలు మరియు వివరణాత్మక నియమాలు శాస్త్రీయ జ్యోతిష్ ప్రిస్క్రిప్షన్‌లను ఉపయోగించి గణించబడతాయి, పేరు పెట్టబడిన కానానికల్ మూలాలకు లంగరు వేయబడతాయి. బాహ్య జ్యోతిష్య APIలు ఏవీ లేవు - కేవలం గణితం, మన పూర్వీకులు వేల సంవత్సరాల క్రితం ఎన్‌కోడ్ చేసిన అదే గణితం, ఇప్పుడు మీ బ్రౌజర్‌లో నడుస్తోంది.',
    authorClosing: 'ఇది కార్పోరేషన్ కాదు, ప్యాషన్ ప్రాజెక్ట్. మీరు దానిలో విలువను కనుగొంటే, అది ఉత్తమ బహుమతి.',
    consultantsHeading: 'జ్యోతిషాచార్యులతో నిర్మించబడింది, వారి కోసమే కాదు',
    consultantsIntro: 'జ్యోతిష్‌ని ఎన్‌కోడ్ చేయడానికి సాఫ్ట్‌వేర్ నైపుణ్యం మాత్రమే ఎవరికీ అర్హత లేదు. ఈ సైట్‌లోని ప్రతి వివరణాత్మక మాడ్యూల్ బహుళ జ్యోతిషాచార్యులతో సంప్రదింపులతో అభివృద్ధి చేయబడింది — జీవన సంప్రదాయాన్ని కలిగి ఉన్న పండితులు, పరాశరి, జైమిని మరియు KP వ్యవస్థలలో శిక్షణ పొందారు. వారి ప్రమేయం ఉపరితల లేబులింగ్ మాత్రమే కాకుండా, ముఖ్యమైన నిర్ణయాలను రూపొందిస్తుంది.',
    consultantsScope: 'ఏ యోగాలు కానానికల్ మరియు జానపద జోడింపులు; దశ-అంతర్దశ-ప్రత్యంతర్ వివరణ యొక్క సరైన క్రమం; షడ్బల, అష్టకవర్గ మరియు డివిజనల్ చార్ట్‌ల కోసం BPHS-విశ్వసనీయ పట్టికలు; క్లాసికల్ కంపైలర్లు స్పష్టంగా జాబితా చేసిన ముహూర్త మినహాయింపులు (విష్టి, భద్ర, పంచక, బుధవారం అభిజిత్). ఆధునిక గ్రంథాలు ఏకీభవించని చోట, మేము కానానికల్ మూలాధారాలను నేరుగా సంప్రదించి, మా పబ్లిక్ స్పెసిఫికేషన్‌లలో నిర్ణయాన్ని రికార్డ్ చేసాము, తద్వారా భవిష్యత్తులో నిర్వహించే ఎవరైనా తార్కికతను ఆడిట్ చేయవచ్చు.',
    consultantsClosing: 'ఫలితంగా ఒక ఆచార్య గుర్తించే సాఫ్ట్‌వేర్ - క్రమశిక్షణ యొక్క సరళీకరణగా కాదు, దాని యొక్క నమ్మకమైన రెండరింగ్‌గా.',
    canonsHeading: 'క్లాసికల్ కానన్‌లకు విశ్వసనీయత',
    canonsIntro: 'ఈ సైట్‌లోని ప్రతి ఇంటర్‌ప్రెటివ్ ఇంజన్ పేరు పెట్టబడిన టెక్స్ట్‌కు లంగరు వేయబడుతుంది — ఎప్పుడూ అస్పష్టమైన "సంప్రదాయం" కాదు. మేము షడ్బలాన్ని గణించినప్పుడు, మేము BPHS Ch.27ని దశలవారీగా అనుసరిస్తాము. మేము మంగళ్ దోషాన్ని ప్రకటించినప్పుడు, మేము సరళీకృత జనాదరణ పొందిన సంస్కరణకు బదులుగా ఫలదీపిక Ch.6 (వాస్తవ నియమానుగుణ మూలం) నుండి షరతులను వర్తింపజేస్తాము. మేము అనుసరించే వచనాలు మరియు ప్రతి దాని నుండి మేము అమలు చేసేవి:',
    canons: [
      { text: 'బృహత్ పరాశర హోర శాస్త్రం', follow: 'కోర్ నేటల్ చార్ట్ ఫ్రేమ్‌వర్క్ - ఇంటి సంకేతాలు, గ్రహాల గౌరవాలు, కానానికల్ యోగా కేటలాగ్, వింషోత్తరి దశ మెకానిక్స్, షడ్బల (ఆరు రెట్లు బలం), అష్టకవర్గం.' },
      { text: 'ఫలదీపిక (మంత్రేశ్వర)', follow: 'చాలా యాప్‌లు ఉపయోగించే జనాదరణ పొందిన కానీ సరికాని సంస్కరణకు వ్యతిరేకంగా నేటల్ యోగా కేటలాగ్ మరియు మంగళ్ దోష (Ch.6) యొక్క వాస్తవ నియమావళి పరిస్థితులు సరిదిద్దబడ్డాయి.' },
      { text: 'జైమిని సూత్రాలు', follow: 'చర కారకాలు, కరకాంశ, పద గణనలు, అర్గల వివరణ మరియు రాశి-దశ వ్యవస్థ.' },
      { text: 'ముహూర్త చింతామణి (రామాచార్య)', follow: 'శుభ-సమయ ఎంపిక నియమాలు, చోఘడియ / హోరా పథకాలు మరియు మా ముహూర్త స్కోరింగ్‌లో ఉపయోగించే అశుభ కాలాల (విష్టి, భద్ర, పంచక) జాబితా.' },
      { text: 'సూర్య సిద్ధాంతం', follow: 'పునాది ఖగోళ శాస్త్రం - సైడ్రియల్ సంవత్సరం పొడవు, గ్రహ సగటు కదలికలు, అయనాంశ ఫ్రేమ్‌వర్క్. ఆధునిక విలువలకు వ్యతిరేకంగా క్రాస్ వెరిఫై చేయబడింది.' },
      { text: 'కృష్ణమూర్తి పద్ధతి', follow: 'సబ్-లార్డ్ లెక్కలు, పాలక గ్రహ ఎంపిక మరియు మా KP సిస్టమ్ మాడ్యూల్‌లో ఉపయోగించిన కస్పల్ ఉప సిద్ధాంతం.' },
      { text: 'సర్వార్థ చింతామణి', follow: 'BPHS ప్రిస్క్రిప్షన్‌లతో పాటు తిప్పన్ని తరంలో ఉపయోగించే నిర్దిష్ట జీవిత ప్రాంతాల కోసం ప్రిడిక్టివ్ టెక్నిక్స్.' },
      { text: 'బృహత్ జాతకం (వరాహమిహిర)', follow: 'ముంత, సహమ్స్ మరియు ముద్ద దశతో సహా తజికా నియమాలు మరియు వర్షఫాల్ (తాజికా వార్షిక చార్ట్) గణన.' },
    ],
    whatWeOffer: 'మేము ఏమి ఆఫర్ చేస్తున్నాము',
    features: [
      { icon: 'calc', label: 'ఖచ్చితమైన పంచాంగ్', desc: 'రోజువారీ తిథి, నక్షత్రం, యోగ, కరణ మరియు ముహూర్త సమయాలు మీ ఖచ్చితమైన స్థానం కోసం ఖగోళ అల్గారిథమ్‌లను ఉపయోగించి 1-2 నిమిషాల సూచన మూలాల్లో ధృవీకరించబడతాయి.' },
      { icon: 'book', label: 'ప్రొఫెషనల్-గ్రేడ్ బర్త్ చార్ట్', desc: '25+ విశ్లేషణ మాడ్యూల్స్: వింషోత్తరి/అష్టోత్తరి/యోగిని దశలు, షడ్బల (6 రెట్లు బలం), అష్టకవర్గ, 16 డివిజనల్ చార్ట్‌లు (D1-D60), 144 యోగా నమూనాలు, KP సిస్టమ్ (ప్లాసిడస్ సబ్-లార్డ్స్), జైమిని కారకాలు, అవస్థాస్ -పవర్ చలిత్‌ప్లస్. స్విస్ ఎఫెమెరిస్ నుండి స్థానికంగా గణించబడింది, బాహ్య APIలు లేవు.' },
      { icon: 'code', label: 'NASA JPL ఎఫెమెరిస్ ప్రెసిషన్', desc: 'ప్రాథమిక ఇంజిన్: స్విస్ ఎఫెమెరిస్ NASA JPL DE441 ప్లానెటరీ ఎఫెమెరిస్ ద్వారా ఆధారితమైనది - మొత్తం 9 గ్రహాలకు ఆర్క్ సెకండ్ ఖచ్చితత్వం, అంతరిక్ష నౌక నావిగేషన్ కోసం NASA ఉపయోగించే అదే డేటా. Meeus అల్గారిథమ్‌లు ఫాల్‌బ్యాక్‌గా ఉంటాయి. బ్లాక్-బాక్స్ APIలు లేవు - ఓపెన్, ధృవీకరించదగిన ఖగోళ గణన.' },
      { icon: 'shield', label: 'గోప్యత మొదట', desc: 'మీ జనన డేటా మీదే ఉంటుంది. మేము వరుస స్థాయి భద్రతతో Supabaseని ఉపయోగిస్తాము - వినియోగదారులు వారి స్వంత డేటాను మాత్రమే యాక్సెస్ చేయగలరు. మూడవ పార్టీలకు వ్యక్తిగత సమాచారాన్ని విక్రయించడం లేదు.' },
      { icon: 'globe', label: 'బహుభాషా', desc: 'హిందీ, తమిళం, బెంగాలీ, తెలుగు, కన్నడ, మరాఠీ, గుజరాతీ, మైథిలి మరియు సంస్కృతంతో సహా 10 భాషల్లో అందుబాటులో ఉంది. నిజమైన అనువాదాలు, మెషీన్-ఉత్పత్తి కాదు.' },
      { icon: 'learn', label: `${TOTAL_MODULES} Learning Modules`, desc: 'పంచాంగ్ బేసిక్స్ నుండి అధునాతన జైమిని జ్యోతిష్, షడ్బల, KP సిస్టమ్ మరియు అష్టకవర్గ వరకు ప్రతిదానిని కవర్ చేసే నిర్మాణాత్మక పాఠ్యప్రణాళిక - అందరికీ ఉచితం.' },
    ],
    accuracyHeading: 'ఖచ్చితత్వం & పద్దతి',
    methodologyCta: 'పూర్తి పద్ధతిని చదవండి →',
    accuracy: [
      { title: 'ఎఫెమెరిస్', text: 'స్విస్ ఎఫెమెరిస్ v2.10 NASA JPL DE441 ద్వారా ఆధారితమైనది - అంతరిక్ష నౌక నావిగేషన్ కోసం NASA ఉపయోగించే అదే ప్లానెటరీ ఎఫెమెరిస్. సూర్యుడు, చంద్రుడు మరియు నిజమైన చంద్ర నోడ్స్ (రాహు/కేతు)తో సహా అన్ని గ్రహాల కోసం ఉప-ఆర్క్ సెకండ్ ఖచ్చితత్వం.' },
      { title: 'అయనాంశ', text: 'డిఫాల్ట్‌గా లాహిరి (చిత్రపక్షం) అయనాంశ – భారతీయ ఖగోళ ఎఫెమెరిస్ ఉపయోగించే భారత ప్రభుత్వ ప్రమాణం. KP సిస్టమ్ విశ్లేషణ కోసం కృష్ణమూర్తి అయనాంశ అందుబాటులో ఉంది.' },
      { title: 'ధృవీకరణ', text: 'పంచాంగ్ ఖచ్చితత్వం, కుండలి గణన, దశ కాలాలు, యోగా గుర్తింపు మరియు పండుగ తేదీలను కవర్ చేసే 3,005 ఆటోమేటెడ్ పరీక్షలు. ప్రపంచవ్యాప్తంగా బహుళ స్థానాల కోసం ప్రొఫెషనల్ హిందూ పంచాంగాలు మరియు అధికారిక పంచాంగ్ మూలాలకు వ్యతిరేకంగా క్రమం తప్పకుండా క్రాస్ వెరిఫై చేయబడుతుంది.' },
      { title: 'సూర్యోదయ నమూనా', text: 'స్విస్ ఎఫెమెరిస్ వాతావరణ వక్రీభవన నమూనా పరిశీలకుడి ఎలివేషన్, ఉష్ణోగ్రత మరియు పీడనం. ఢిల్లీ, బెంగుళూరు మరియు న్యూయార్క్ అంతటా ప్రొఫెషనల్ పంచాంగ్ మూలాల యొక్క ±1 నిమిషంలో ధృవీకరించబడింది.' },
    ],
    heritage: [
      { title: 'సూర్య సిద్ధాంతం', text: 'సూర్య సిద్ధాంతం (c. 400 CE) మానవ చరిత్రలో అత్యంత విశేషమైన ఖగోళ గ్రంథాలలో ఒకటి. ఇది సైడ్రియల్ సంవత్సరాన్ని 365.2563627 రోజులలో ఖచ్చితంగా గణిస్తుంది - ఇది 365.25636 రోజుల ఆధునిక విలువకు ఆశ్చర్యకరంగా దగ్గరగా ఉంటుంది. ఇది గ్రహాల స్థానాలు, గ్రహణ అంచనాలు మరియు విషువత్తుల ముందస్తు కోసం ఖచ్చితమైన సూత్రాలను అందిస్తుంది.' },
      { title: 'ఆర్యభట్ట విప్లవం', text: 'ఆర్యభట్ట (476 CE) భూమి తన అక్షం మీద తిరుగుతుందని ప్రతిపాదించాడు - కోపర్నికస్ కంటే ఒక సహస్రాబ్ది కంటే ముందు. అతని ఆర్యభటియాలో అధునాతన సైన్ పట్టికలు ఉన్నాయి, 4 దశాంశ స్థానాలకు ఖచ్చితమైన పై (3.1416), మరియు నేటికీ మెచ్చుకునే గ్రహాల లెక్కల అల్గారిథమ్‌లు ఉన్నాయి.' },
      { title: 'పంచాంగ్ వ్యవస్థ', text: 'పంచాంగ్ ("ఐదు అవయవాలు") అనేది ఐదు ఖగోళ మూలకాలను ట్రాక్ చేసే చాంద్రమాన క్యాలెండర్: తిథి (చంద్రుని రోజు), నక్షత్రం (చంద్రుని భవనం), యోగ (లూని-సౌర కోణం), కరణ (అర్ధ తిథి) మరియు వార (వారం రోజు). ఇది సూర్యుడికి సంబంధించి మరియు స్థిర నక్షత్రాలకు వ్యతిరేకంగా చంద్రుని స్థానాన్ని ఏకకాలంలో ట్రాక్ చేస్తుంది.' },
      { title: 'అయనాంశ: ది క్రిటికల్ కరెక్షన్', text: 'భారతీయ ఖగోళ శాస్త్రం అయనాంశ ద్వారా విషువత్తుల పూర్వస్థితికి కారణమవుతుంది - ఉష్ణమండల మరియు నాడీ రాశిచక్రాల మధ్య కోణీయ వ్యత్యాసం. ఈ ~50.3 ఆర్క్-సెకన్లు/సంవత్సరం పూర్వస్థితి ~25,920 సంవత్సరాలలో ఒక చక్రాన్ని పూర్తి చేస్తుంది. లాహిరి అయనాంశ ప్రస్తుతం ~24 డిగ్రీలు.' },
      { title: 'గ్రహణాలు: ప్రిడిక్టివ్ పవర్', text: 'భారతీయ ఖగోళ శాస్త్రవేత్తలు రాహు మరియు కేతువులను చంద్రుని కక్ష్య యొక్క ఆరోహణ మరియు అవరోహణ నోడ్‌లుగా గుర్తించారు - ఇక్కడ గ్రహణాలు సంభవిస్తాయి. సారోస్ చక్రం (~18 సంవత్సరాలు) స్వతంత్రంగా కనుగొనబడింది. పురాతన గ్రహణ గణన పట్టికలు ఆధునిక గణనలకు వ్యతిరేకంగా ధృవీకరించబడినప్పుడు విశేషమైన ఖచ్చితత్వాన్ని చూపుతాయి.' },
    ],
    contactHeading: 'మమ్మల్ని సంప్రదించండి',
    contactIntro: 'మేము మీ నుండి వినడానికి ఇష్టపడతాము. మా లెక్కల గురించి మీకు ఏవైనా సందేహాలు ఉన్నా, బగ్‌ని నివేదించాలనుకున్నా లేదా హలో చెప్పాలనుకున్నా – చేరుకోండి.',
    contactEmail: 'సాధారణ విచారణలు',
    contactPrivacy: 'గోప్యత & డేటా అభ్యర్థనలు',
    contactLegal: 'చట్టపరమైన & నిబంధనలు',
    contactResponse: 'మేము సాధారణంగా 48 గంటలలోపు ప్రతిస్పందిస్తాము.',
    heritageHeading: 'ది సైంటిఫిక్ హెరిటేజ్ ఆఫ్ ఇండియన్ ఆస్ట్రానమీ',
  },
  kn: {
    title: 'ದೇಖೋ ಪಂಚಾಂಗದ ಕುರಿತು',
    subtitle: 'ಪ್ರಾಚೀನ ಖಗೋಳ ಬುದ್ಧಿವಂತಿಕೆಯು ಆಧುನಿಕ ಗಣನೆಯನ್ನು ಸಂಧಿಸುತ್ತದೆ',
    authorHeading: 'ಲೇಖಕರ ಬಗ್ಗೆ',
    authorIntro: 'ದೇಖೋ ಪಂಚಾಂಗವನ್ನು ನಿರ್ಮಿಸಿದ್ದಾರೆ ಮತ್ತು ನಿರ್ವಹಿಸಿದ್ದಾರೆ',
    authorName: 'ಆದಿತ್ಯ ಝಾ',
    authorHeritage: 'ವೈದಿಕ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಆಳವಾದ ಬೇರುಗಳನ್ನು ಹೊಂದಿರುವ ಮಿಥಿಲೆಯ ಮೈಥಿಲ್ ಬ್ರಾಹ್ಮಣ ಮತ್ತು ತರಬೇತಿಯ ಮೂಲಕ ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರ್.',
    authorVedic: 'ಆದಿತ್ಯನು ಮಿಥಿಲೆಯ ಲಯದಲ್ಲಿ ಮುಳುಗಿ ಬೆಳೆದನು - ಮುಂಜಾನೆ ಪಂಚಾಂಗ ಸಮಾಲೋಚನೆ, ಮನೆಯಲ್ಲಿ ಆಚರಿಸುವ ತಿಥಿ ಆಧಾರಿತ ವ್ರತಗಳು, ಸಂಸ್ಕೃತ ಶ್ಲೋಕಗಳು ಅರ್ಥವಾಗುವ ಮೊದಲು ಕಂಠಪಾಠ ಮಾಡಲ್ಪಟ್ಟವು. ಆಸಕ್ತಿ ಎಂದಿಗೂ ನಾಸ್ಟಾಲ್ಜಿಯಾದಲ್ಲಿ ಮರೆಯಾಗಲಿಲ್ಲ. ವಯಸ್ಕ ಜೀವನವು ಅವನನ್ನು ಮೂಲ ಪಠ್ಯಗಳಿಗೆ ಹತ್ತಿರವಾಗಿಸಿತು: ಸೂರ್ಯ ಸಿದ್ಧಾಂತದ ಖಗೋಳ ಗಣಿತಶಾಸ್ತ್ರ, ಬೃಹತ್ ಪರಾಶರ ಹೋರಾ ಶಾಸ್ತ್ರದ ವ್ಯಾಖ್ಯಾನ ಚೌಕಟ್ಟು, ಮುಹೂರ್ತ ಚಿಂತಾಮಣಿಯ ಸಮಯದ ಶಿಸ್ತು. ಇದು ಅವರು ಎತ್ತಿಕೊಂಡ ವಿಷಯವಲ್ಲ; ಅದು ಅವನು ಒಳಗೆ ಬೆಳೆದದ್ದು.',
    authorSoftware: 'ಸಾಫ್ಟ್ವೇರ್ ಇತರ ಸ್ಥಳೀಯ ಭಾಷೆಯಾಗಿದೆ. ವರ್ಷಗಳ ಕಟ್ಟಡ ವ್ಯವಸ್ಥೆಯು ಒಂದು ಮಾದರಿಯನ್ನು ತಪ್ಪಾಗದಂತೆ ಮಾಡಿದೆ: ಶಾಸ್ತ್ರೀಯ ಜ್ಯೋತಿಶ್ ಯಾವಾಗಲೂ ಕಂಪ್ಯೂಟೇಶನಲ್ ಶಿಸ್ತು. ಸೂತ್ರಗಳು ಸಂಕುಚಿತ ಕ್ರಮಾವಳಿಗಳು; ಪದ್ಯಗಳು ಆಕಾಶ-ಮಾದರಿಗಳನ್ನು ಎನ್ಕೋಡ್ ಮಾಡುತ್ತವೆ. ಮಾರ್ಕೆಟಿಂಗ್ ಕ್ಲೈಮ್‌ಗಳು, ಪಾವತಿಸಿದ "ವರದಿಗಳು" ಮತ್ತು ಅಪಾರದರ್ಶಕ ಲೆಕ್ಕಾಚಾರಗಳ ಅಡಿಯಲ್ಲಿ ಆಧುನಿಕ ಪಂಚಂಗ್ ಸೈಟ್‌ಗಳು ಆ ನಿಖರತೆಯನ್ನು ಹೂತುಹಾಕುವುದನ್ನು ನೋಡುವುದು ನಿರಾಶಾದಾಯಕವಾಗಿತ್ತು. ದೇಖೋ ಪಂಚಾಂಗ್ ಗಣನೆಯನ್ನು ಅದು ಸೇರಿರುವ ಸ್ಥಳದಲ್ಲಿ ಇರಿಸಲು ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ - ತೆರೆದ, ಪರಿಶೀಲಿಸಬಹುದಾದ, ಉಚಿತ.',
    authorMission: 'ಈ ಯೋಜನೆಯು ಸರಳವಾದ ಕನ್ವಿಕ್ಷನ್‌ನಿಂದ ಹುಟ್ಟಿದೆ: ಸೂರ್ಯ ಸಿದ್ಧಾಂತ ಮತ್ತು ಬೃಹತ್ ಪರಾಶರ ಹೋರಾ ಶಾಸ್ತ್ರದಂತಹ ಪಠ್ಯಗಳಲ್ಲಿ ಸಂರಕ್ಷಿಸಲಾದ ಖಗೋಳ ಮತ್ತು ಜ್ಯೋತಿಷ್ಯ ಜ್ಞಾನವು ಎಲ್ಲರಿಗೂ ಪ್ರವೇಶಿಸಲು ಅರ್ಹವಾಗಿದೆ - ಪೇವಾಲ್‌ಗಳ ಹಿಂದೆ ಲಾಕ್ ಮಾಡಲಾಗಿಲ್ಲ ಅಥವಾ ಗುರುತಿಸಲಾಗದಷ್ಟು ಸರಳಗೊಳಿಸಲಾಗಿಲ್ಲ.',
    authorApproach: 'ಈ ಸೈಟ್‌ನಲ್ಲಿನ ಪ್ರತಿಯೊಂದು ಲೆಕ್ಕಾಚಾರವನ್ನು ಮೊದಲ ತತ್ವಗಳಿಂದ ಮಾಡಲಾಗುತ್ತದೆ. ಗ್ರಹಗಳ ಸ್ಥಾನಗಳು ಸ್ವಿಸ್ ಎಫೆಮೆರಿಸ್ (NASA JPL DE441) ಅನ್ನು Meeus ಅಲ್ಗಾರಿದಮ್‌ಗಳೊಂದಿಗೆ ಫಾಲ್‌ಬ್ಯಾಕ್ ಆಗಿ ಬಳಸುತ್ತವೆ. ಪಂಚಾಂಗದ ಅಂಶಗಳು ಮತ್ತು ವಿವರಣಾತ್ಮಕ ನಿಯಮಗಳನ್ನು ಶಾಸ್ತ್ರೀಯ ಜ್ಯೋತಿಷ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳನ್ನು ಬಳಸಿಕೊಂಡು ಗಣಿಸಲಾಗುತ್ತದೆ, ಹೆಸರಿಸಲಾದ ಅಂಗೀಕೃತ ಮೂಲಗಳಿಗೆ ಲಂಗರು ಹಾಕಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಬಾಹ್ಯ ಜ್ಯೋತಿಷ್ಯ API ಗಳಿಲ್ಲ - ಕೇವಲ ಗಣಿತ, ನಮ್ಮ ಪೂರ್ವಜರು ಸಾವಿರಾರು ವರ್ಷಗಳ ಹಿಂದೆ ಎನ್‌ಕೋಡ್ ಮಾಡಿದ ಅದೇ ಗಣಿತ, ಈಗ ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಚಾಲನೆಯಲ್ಲಿದೆ.',
    authorClosing: 'ಇದು ಪ್ಯಾಶನ್ ಯೋಜನೆಯಾಗಿದೆ, ನಿಗಮವಲ್ಲ. ನೀವು ಅದರಲ್ಲಿ ಮೌಲ್ಯವನ್ನು ಕಂಡುಕೊಂಡರೆ, ಅದು ಅತ್ಯುತ್ತಮ ಪ್ರತಿಫಲವಾಗಿದೆ.',
    consultantsHeading: 'ಜ್ಯೋತಿಶಾಚಾರ್ಯರಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ, ಅವರಿಗಾಗಿ ಮಾತ್ರವಲ್ಲ',
    consultantsIntro: 'ಕೇವಲ ಸಾಫ್ಟ್‌ವೇರ್ ಪರಿಣತಿಯು ಜ್ಯೋತಿಶ್ ಅನ್ನು ಎನ್‌ಕೋಡ್ ಮಾಡಲು ಯಾರನ್ನೂ ಅರ್ಹವಾಗುವುದಿಲ್ಲ. ಪರಾಶರಿ, ಜೈಮಿನಿ ಮತ್ತು ಕೆಪಿ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ತರಬೇತಿ ಪಡೆದ ದೇಶ ಸಂಪ್ರದಾಯವನ್ನು ಹೊಂದಿರುವ ವಿದ್ವಾಂಸರು - ಈ ಸೈಟ್‌ನಲ್ಲಿನ ಪ್ರತಿಯೊಂದು ವಿವರಣಾತ್ಮಕ ಮಾಡ್ಯೂಲ್ ಅನ್ನು ಬಹು ಜ್ಯೋತಿಷಾಚಾರ್ಯರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ. ಅವರ ಒಳಗೊಳ್ಳುವಿಕೆ ಮೇಲ್ಮೈ ಲೇಬಲಿಂಗ್ ಮಾತ್ರವಲ್ಲದೆ ವಸ್ತುನಿಷ್ಠ ನಿರ್ಧಾರಗಳನ್ನು ರೂಪಿಸುತ್ತದೆ.',
    consultantsScope: 'ಯಾವ ಯೋಗಗಳು ಅಂಗೀಕೃತವಾಗಿವೆ ಮತ್ತು ಜಾನಪದ ಸೇರ್ಪಡೆಗಳು; ದಶಾ-ಅಂತರ್ದಶ-ಪ್ರತ್ಯಂತರ ವ್ಯಾಖ್ಯಾನದ ಸರಿಯಾದ ಅನುಕ್ರಮ; ಷಡ್ಬಲ, ಅಷ್ಟಕವರ್ಗ ಮತ್ತು ವಿಭಾಗೀಯ ಚಾರ್ಟ್‌ಗಳಿಗಾಗಿ BPHS-ನಿಷ್ಠಾವಂತ ಕೋಷ್ಟಕಗಳು; ಶಾಸ್ತ್ರೀಯ ಸಂಕಲನಕಾರರು ಸ್ಪಷ್ಟವಾಗಿ ಪಟ್ಟಿಮಾಡಿದ ಮುಹೂರ್ತದ ಹೊರಗಿಡುವಿಕೆಗಳು (ವಿಷ್ಟಿ, ಭದ್ರ, ಪಂಚಕ, ಬುಧವಾರ ಅಭಿಜಿತ್). ಆಧುನಿಕ ಪಠ್ಯಗಳು ಒಪ್ಪದಿದ್ದಲ್ಲಿ, ನಾವು ಅಂಗೀಕೃತ ಮೂಲಗಳನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ನಮ್ಮ ಸಾರ್ವಜನಿಕ ವಿಶೇಷಣಗಳಲ್ಲಿ ನಿರ್ಧಾರವನ್ನು ದಾಖಲಿಸಿದ್ದೇವೆ ಆದ್ದರಿಂದ ಯಾವುದೇ ಭವಿಷ್ಯದ ನಿರ್ವಾಹಕರು ತಾರ್ಕಿಕತೆಯನ್ನು ಲೆಕ್ಕಪರಿಶೋಧಿಸಬಹುದು.',
    consultantsClosing: 'ಫಲಿತಾಂಶವೆಂದರೆ ಆಚಾರ್ಯರು ಗುರುತಿಸುವ ಸಾಫ್ಟ್‌ವೇರ್ - ಶಿಸ್ತಿನ ಸರಳೀಕರಣವಲ್ಲ, ಆದರೆ ಅದರ ನಿಷ್ಠಾವಂತ ರೆಂಡರಿಂಗ್.',
    canonsHeading: 'ಶಾಸ್ತ್ರೀಯ ನಿಯಮಗಳಿಗೆ ನಿಷ್ಠೆ',
    canonsIntro: 'ಈ ಸೈಟ್‌ನಲ್ಲಿನ ಪ್ರತಿಯೊಂದು ವಿವರಣಾತ್ಮಕ ಎಂಜಿನ್ ಹೆಸರಿಸಲಾದ ಪಠ್ಯಕ್ಕೆ ಲಂಗರು ಹಾಕಲ್ಪಟ್ಟಿದೆ - ಎಂದಿಗೂ ಅಸ್ಪಷ್ಟ "ಸಂಪ್ರದಾಯ". ನಾವು ಷಡ್ಬಲವನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡುವಾಗ, ನಾವು BPHS Ch.27 ಅನ್ನು ಹಂತ ಹಂತವಾಗಿ ಅನುಸರಿಸುತ್ತೇವೆ. ನಾವು ಮಂಗಲ್ ದೋಷವನ್ನು ಘೋಷಿಸಿದಾಗ, ಸರಳೀಕೃತ ಜನಪ್ರಿಯ ಆವೃತ್ತಿಯ ಬದಲಿಗೆ ಫಲದೀಪಿಕಾ Ch.6 (ನಿಜವಾದ ಅಂಗೀಕೃತ ಮೂಲ) ನಿಂದ ನಾವು ಷರತ್ತುಗಳನ್ನು ಅನ್ವಯಿಸುತ್ತೇವೆ. ನಾವು ಅನುಸರಿಸುವ ಪಠ್ಯಗಳು ಮತ್ತು ಪ್ರತಿಯೊಂದರಿಂದ ನಾವು ಏನು ಕಾರ್ಯಗತಗೊಳಿಸುತ್ತೇವೆ:',
    canons: [
      { text: 'ಬೃಹತ್ ಪರಾಶರ ಹೋರಾ ಶಾಸ್ತ್ರ', follow: 'ಕೋರ್ ನಟಾಲ್ ಚಾರ್ಟ್ ಫ್ರೇಮ್‌ವರ್ಕ್ - ಮನೆಯ ಸಂಕೇತಗಳು, ಗ್ರಹಗಳ ಘನತೆಗಳು, ಅಂಗೀಕೃತ ಯೋಗ ಕ್ಯಾಟಲಾಗ್, ವಿಂಶೋತ್ತರಿ ದಶಾ ಯಂತ್ರಶಾಸ್ತ್ರ, ಷಡ್ಬಲ (ಆರು ಪಟ್ಟು ಬಲ), ಅಷ್ಟಕವರ್ಗ.' },
      { text: 'ಫಲದೀಪಿಕಾ (ಮಂತ್ರೇಶ್ವರ)', follow: 'ನಟಾಲ್ ಯೋಗ ಕ್ಯಾಟಲಾಗ್ ಮತ್ತು ಮಂಗಲ್ ದೋಷ (Ch.6) ಗಾಗಿ ನಿಜವಾದ ಅಂಗೀಕೃತ ಪರಿಸ್ಥಿತಿಗಳು, ಜನಪ್ರಿಯಗೊಳಿಸಿದ ಆದರೆ ಹೆಚ್ಚಿನ ಅಪ್ಲಿಕೇಶನ್‌ಗಳು ಬಳಸುವ ನಿಖರವಾದ ಆವೃತ್ತಿಯ ವಿರುದ್ಧ ಸರಿಪಡಿಸಲಾಗಿದೆ.' },
      { text: 'ಜೈಮಿನಿ ಸೂತ್ರಗಳು', follow: 'ಚರ ಕಾರಕಗಳು, ಕಾರಕಾಂಶ, ಪಾದ ಲೆಕ್ಕಾಚಾರಗಳು, ಅರ್ಗಲಾ ವ್ಯಾಖ್ಯಾನ ಮತ್ತು ರಾಶಿ-ದಶಾ ವ್ಯವಸ್ಥೆ.' },
      { text: 'ಮುಹೂರ್ತ ಚಿಂತಾಮಣಿ (ರಾಮಾಚಾರ್ಯ)', follow: 'ಶುಭ-ಸಮಯದ ಆಯ್ಕೆ ನಿಯಮಗಳು, ಚೋಘಡಿಯ / ಹೋರಾ ಯೋಜನೆಗಳು ಮತ್ತು ನಮ್ಮ ಮುಹೂರ್ತ ಸ್ಕೋರಿಂಗ್‌ನಲ್ಲಿ ಬಳಸಲಾದ ಅಶುಭ ಅವಧಿಗಳ (ವಿಷ್ಟಿ, ಭದ್ರ, ಪಂಚಕ) ಕ್ಯಾಟಲಾಗ್.' },
      { text: 'ಸೂರ್ಯ ಸಿದ್ಧಾಂತ', follow: 'ಫೌಂಡೇಶನಲ್ ಖಗೋಳಶಾಸ್ತ್ರ - ಸೈಡ್ರಿಯಲ್ ವರ್ಷದ ಉದ್ದ, ಗ್ರಹಗಳ ಸರಾಸರಿ ಚಲನೆಗಳು, ಅಯನಾಂಶ ಚೌಕಟ್ಟು. ಆಧುನಿಕ ಮೌಲ್ಯಗಳಿಗೆ ವಿರುದ್ಧವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.' },
      { text: 'ಕೃಷ್ಣಮೂರ್ತಿ ಪದ್ಧತಿ', follow: 'ಉಪ-ಲಾರ್ಡ್ ಲೆಕ್ಕಾಚಾರಗಳು, ಆಡಳಿತ ಗ್ರಹದ ಆಯ್ಕೆ ಮತ್ತು ನಮ್ಮ KP ಸಿಸ್ಟಮ್ ಮಾಡ್ಯೂಲ್‌ನಲ್ಲಿ ಬಳಸಲಾದ ಕಸ್ಪಲ್ ಉಪ-ಸಿದ್ಧಾಂತ.' },
      { text: 'ಸರ್ವಾರ್ಥ ಚಿಂತಾಮಣಿ', follow: 'ನಿರ್ದಿಷ್ಟ ಜೀವನ ಪ್ರದೇಶಗಳಿಗೆ ಮುನ್ಸೂಚಕ ತಂತ್ರಗಳು, BPHS ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳ ಜೊತೆಗೆ ಟಿಪ್ಪನ್ನಿ ಪೀಳಿಗೆಯಲ್ಲಿ ಬಳಸಲಾಗುತ್ತದೆ.' },
      { text: 'ಬೃಹತ್ ಜಾತಕ (ವರಾಹಮಿಹಿರ)', follow: 'ಮುಂತಾ, ಸಹಮ್ಸ್ ಮತ್ತು ಮುದ್ದ ದಶಾ ಸೇರಿದಂತೆ ತಾಜಿಕಾ ನಿಯಮಗಳು ಮತ್ತು ವರ್ಷಫಲ್ (ತಾಜಿಕಾ ವಾರ್ಷಿಕ ಚಾರ್ಟ್) ಲೆಕ್ಕಾಚಾರ.' },
    ],
    whatWeOffer: 'ನಾವು ಏನು ನೀಡುತ್ತೇವೆ',
    features: [
      { icon: 'calc', label: 'ನಿಖರವಾದ ಪಂಚಾಂಗ', desc: 'ದೈನಂದಿನ ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ, ಕರಣ ಮತ್ತು ಮುಹೂರ್ತದ ಸಮಯಗಳನ್ನು ಖಗೋಳ ಅಲ್ಗಾರಿದಮ್‌ಗಳನ್ನು ಬಳಸಿಕೊಂಡು 1-2 ನಿಮಿಷಗಳ ಉಲ್ಲೇಖದ ಮೂಲಗಳಿಂದ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.' },
      { icon: 'book', label: 'ವೃತ್ತಿಪರ-ದರ್ಜೆಯ ಜನನ ಚಾರ್ಟ್', desc: '25+ ವಿಶ್ಲೇಷಣಾ ಮಾಡ್ಯೂಲ್‌ಗಳು: ವಿಮ್ಷೋತ್ತರಿ/ಅಷ್ಟೋತ್ತರಿ/ಯೋಗಿನಿ ದಶಗಳು, ಷಡ್ಬಲ (6-ಪಟ್ಟು ಸಾಮರ್ಥ್ಯ), ಅಷ್ಟಕವರ್ಗ, 16 ವಿಭಾಗೀಯ ಚಾರ್ಟ್‌ಗಳು (D1-D60), 144 ಯೋಗ ಮಾದರಿಗಳು, KP ಸಿಸ್ಟಮ್ (ಪ್ಲಾಸಿಡಸ್ ಉಪ-ಪ್ರಭುಗಳು), ಜೈಮಿನಿ ಕಾರಕಗಳು, ಅವಸ್ಥಾಸ್ -ಅರ್ಗಲಾ ಸ್ವಿಸ್ ಎಫೆಮೆರಿಸ್‌ನಿಂದ ಸ್ಥಳೀಯವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ, ಯಾವುದೇ ಬಾಹ್ಯ APIಗಳಿಲ್ಲ.' },
      { icon: 'code', label: 'NASA JPL ಎಫೆಮೆರಿಸ್ ನಿಖರತೆ', desc: 'ಪ್ರಾಥಮಿಕ ಎಂಜಿನ್: ಸ್ವಿಸ್ ಎಫೆಮೆರಿಸ್ NASA JPL DE441 ಪ್ಲಾನೆಟರಿ ಎಫೆಮೆರಿಸ್‌ನಿಂದ ಚಾಲಿತವಾಗಿದೆ - ಎಲ್ಲಾ 9 ಗ್ರಹಗಳಿಗೆ ಆರ್ಕ್ಸೆಕೆಂಡ್ ನಿಖರತೆ, ಬಾಹ್ಯಾಕಾಶ ನೌಕೆ ಸಂಚರಣೆಗಾಗಿ NASA ಬಳಸುವ ಅದೇ ಡೇಟಾವನ್ನು. ಮಿಯಸ್ ಅಲ್ಗಾರಿದಮ್‌ಗಳು ಫಾಲ್‌ಬ್ಯಾಕ್ ಆಗಿ. ಕಪ್ಪು-ಪೆಟ್ಟಿಗೆ API ಗಳಿಲ್ಲ - ತೆರೆದ, ಪರಿಶೀಲಿಸಬಹುದಾದ ಖಗೋಳ ಗಣನೆ.' },
      { icon: 'shield', label: 'ಗೌಪ್ಯತೆ ಮೊದಲು', desc: 'ನಿಮ್ಮ ಜನ್ಮ ಮಾಹಿತಿಯು ನಿಮ್ಮದೇ ಆಗಿರುತ್ತದೆ. ನಾವು ಸಾಲು ಮಟ್ಟದ ಭದ್ರತೆಯೊಂದಿಗೆ ಸುಪಾಬೇಸ್ ಅನ್ನು ಬಳಸುತ್ತೇವೆ - ಬಳಕೆದಾರರು ತಮ್ಮ ಸ್ವಂತ ಡೇಟಾವನ್ನು ಮಾತ್ರ ಪ್ರವೇಶಿಸಬಹುದು. ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ.' },
      { icon: 'globe', label: 'ಬಹುಭಾಷಾ', desc: 'ಹಿಂದಿ, ತಮಿಳು, ಬೆಂಗಾಲಿ, ತೆಲುಗು, ಕನ್ನಡ, ಮರಾಠಿ, ಗುಜರಾತಿ, ಮೈಥಿಲಿ ಮತ್ತು ಸಂಸ್ಕೃತ ಸೇರಿದಂತೆ 10 ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ. ನಿಜವಾದ ಅನುವಾದಗಳು, ಯಂತ್ರದಿಂದ ರಚಿತವಾಗಿಲ್ಲ.' },
      { icon: 'learn', label: `${TOTAL_MODULES} Learning Modules`, desc: 'ಪಂಚಾಂಗದ ಮೂಲಗಳಿಂದ ಹಿಡಿದು ಸುಧಾರಿತ ಜೈಮಿನಿ ಜ್ಯೋತಿಷ, ಷಡ್ಬಲ, ಕೆಪಿ ವ್ಯವಸ್ಥೆ ಮತ್ತು ಅಷ್ಟಕವರ್ಗದವರೆಗೆ ಎಲ್ಲವನ್ನೂ ಒಳಗೊಂಡ ರಚನಾತ್ಮಕ ಪಠ್ಯಕ್ರಮ - ಎಲ್ಲರಿಗೂ ಉಚಿತ.' },
    ],
    accuracyHeading: 'ನಿಖರತೆ ಮತ್ತು ವಿಧಾನ',
    methodologyCta: 'ಸಂಪೂರ್ಣ ವಿಧಾನವನ್ನು ಓದಿ →',
    accuracy: [
      { title: 'ಎಫೆಮೆರಿಸ್', text: 'NASA JPL DE441 ನಿಂದ ನಡೆಸಲ್ಪಡುವ ಸ್ವಿಸ್ ಎಫೆಮೆರಿಸ್ v2.10 - ಬಾಹ್ಯಾಕಾಶ ನೌಕೆ ಸಂಚರಣೆಗಾಗಿ NASA ಬಳಸುವ ಅದೇ ಗ್ರಹಗಳ ಎಫೆಮೆರಿಸ್. ಸೂರ್ಯ, ಚಂದ್ರ ಮತ್ತು ನಿಜವಾದ ಚಂದ್ರನ ನೋಡ್‌ಗಳು (ರಾಹು/ಕೇತು) ಸೇರಿದಂತೆ ಎಲ್ಲಾ ಗ್ರಹಗಳಿಗೆ ಉಪ-ಆರ್ಕ್ಸೆಕೆಂಡ್ ನಿಖರತೆ.' },
      { title: 'ಅಯನಾಂಶ', text: 'ಲಾಹಿರಿ (ಚಿತ್ರಪಕ್ಷ) ಅಯನಾಂಶ ಪೂರ್ವನಿಯೋಜಿತವಾಗಿ - ಭಾರತೀಯ ಖಗೋಳ ಎಫೆಮೆರಿಸ್ ಬಳಸುವ ಭಾರತೀಯ ಸರ್ಕಾರದ ಮಾನದಂಡ. KP ಸಿಸ್ಟಮ್ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಕೃಷ್ಣಮೂರ್ತಿ ಅಯನಾಂಶ ಲಭ್ಯವಿದೆ.' },
      { title: 'ಪರಿಶೀಲನೆ', text: 'ಪಂಚಾಂಗದ ನಿಖರತೆ, ಕುಂಡಲಿ ಲೆಕ್ಕಾಚಾರ, ದಶಾ ಅವಧಿಗಳು, ಯೋಗ ಪತ್ತೆ ಮತ್ತು ಹಬ್ಬದ ದಿನಾಂಕಗಳನ್ನು ಒಳಗೊಂಡ 3,005 ಸ್ವಯಂಚಾಲಿತ ಪರೀಕ್ಷೆಗಳು. ವಿಶ್ವಾದ್ಯಂತ ಅನೇಕ ಸ್ಥಳಗಳಿಗೆ ವೃತ್ತಿಪರ ಹಿಂದೂ ಪಂಚಾಂಗಗಳು ಮತ್ತು ಅಧಿಕೃತ ಪಂಚಾಂಗ ಮೂಲಗಳ ವಿರುದ್ಧ ನಿಯಮಿತವಾಗಿ ಅಡ್ಡ-ಪರಿಶೀಲಿಸಲಾಗಿದೆ.' },
      { title: 'ಸೂರ್ಯೋದಯ ಮಾದರಿ', text: 'ಸ್ವಿಸ್ ಎಫೆಮೆರಿಸ್ ವಾಯುಮಂಡಲದ ವಕ್ರೀಭವನ ಮಾದರಿಯು ವೀಕ್ಷಕನ ಎತ್ತರ, ತಾಪಮಾನ ಮತ್ತು ಒತ್ತಡಕ್ಕೆ ಲೆಕ್ಕ ಹಾಕುತ್ತದೆ. ದೆಹಲಿ, ಬೆಂಗಳೂರು ಮತ್ತು ನ್ಯೂಯಾರ್ಕ್‌ನಾದ್ಯಂತ ವೃತ್ತಿಪರ ಪಂಚಾಂಗ ಮೂಲಗಳ ± 1 ನಿಮಿಷದಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.' },
    ],
    heritage: [
      { title: 'ಸೂರ್ಯ ಸಿದ್ಧಾಂತ', text: 'ಸೂರ್ಯ ಸಿದ್ಧಾಂತ (ಸುಮಾರು 400 CE) ಮಾನವ ಇತಿಹಾಸದಲ್ಲಿ ಅತ್ಯಂತ ಗಮನಾರ್ಹವಾದ ಖಗೋಳ ಗ್ರಂಥಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ. ಇದು 365.2563627 ದಿನಗಳಲ್ಲಿ ಸೈಡ್ರಿಯಲ್ ವರ್ಷವನ್ನು ನಿಖರವಾಗಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ - ಇದು 365.25636 ದಿನಗಳ ಆಧುನಿಕ ಮೌಲ್ಯಕ್ಕೆ ಆಶ್ಚರ್ಯಕರವಾಗಿ ಹತ್ತಿರದಲ್ಲಿದೆ. ಇದು ಗ್ರಹಗಳ ಸ್ಥಾನಗಳು, ಗ್ರಹಣ ಮುನ್ನೋಟಗಳು ಮತ್ತು ವಿಷುವತ್ ಸಂಕ್ರಾಂತಿಯ ಪೂರ್ವಸೂಚನೆಗಳಿಗೆ ನಿಖರವಾದ ಸೂತ್ರಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.' },
      { title: 'ಆರ್ಯಭಟನ ಕ್ರಾಂತಿ', text: 'ಆರ್ಯಭಟ (476 CE) ಭೂಮಿಯು ತನ್ನ ಅಕ್ಷದ ಮೇಲೆ ಸುತ್ತುತ್ತದೆ ಎಂದು ಪ್ರಸ್ತಾಪಿಸಿದರು - ಕೋಪರ್ನಿಕಸ್‌ಗಿಂತ ಮೊದಲು ಒಂದು ಸಹಸ್ರಮಾನದ ಮೇಲೆ. ಅವರ ಆರ್ಯಭಟಿಯವು ಅತ್ಯಾಧುನಿಕ ಸೈನ್ ಕೋಷ್ಟಕಗಳನ್ನು ಒಳಗೊಂಡಿದೆ, 4 ದಶಮಾಂಶ ಸ್ಥಾನಗಳಿಗೆ (3.1416) ನಿಖರವಾದ ಪೈ, ಮತ್ತು ಗ್ರಹಗಳ ಲೆಕ್ಕಾಚಾರಗಳಿಗೆ ಅಲ್ಗಾರಿದಮ್‌ಗಳು ಇಂದಿಗೂ ಮೆಚ್ಚುಗೆ ಪಡೆದಿವೆ.' },
      { title: 'ಪಂಚಾಂಗ ವ್ಯವಸ್ಥೆ', text: 'ಪಂಚಾಂಗ ("ಐದು ಅಂಗಗಳು") ಐದು ಖಗೋಳ ಅಂಶಗಳನ್ನು ಪತ್ತೆಹಚ್ಚುವ ಚಂದ್ರನ ಕ್ಯಾಲೆಂಡರ್ ಆಗಿದೆ: ತಿಥಿ (ಚಂದ್ರನ ದಿನ), ನಕ್ಷತ್ರ (ಚಂದ್ರನ ಮಹಲು), ಯೋಗ (ಲೂನಿ-ಸೌರ ಕೋನ), ಕರಣ (ಅರ್ಧ-ತಿಥಿ), ಮತ್ತು ವಾರ (ವಾರದ ದಿನ). ಇದು ಸೂರ್ಯನಿಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಮತ್ತು ಸ್ಥಿರ ನಕ್ಷತ್ರಗಳ ವಿರುದ್ಧ ಚಂದ್ರನ ಸ್ಥಾನವನ್ನು ಏಕಕಾಲದಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ.' },
      { title: 'ಅಯನಾಂಶ: ದಿ ಕ್ರಿಟಿಕಲ್ ಕರೆಕ್ಷನ್', text: 'ಭಾರತೀಯ ಖಗೋಳಶಾಸ್ತ್ರವು ಅಯನಾಂಶದ ಮೂಲಕ ವಿಷುವತ್ ಸಂಕ್ರಾಂತಿಯ ಪೂರ್ವಭಾವಿತ್ವವನ್ನು ಹೊಂದಿದೆ - ಉಷ್ಣವಲಯದ ಮತ್ತು ಪಾರ್ಶ್ವದ ರಾಶಿಚಕ್ರಗಳ ನಡುವಿನ ಕೋನೀಯ ವ್ಯತ್ಯಾಸ. ಈ ~50.3 ಆರ್ಕ್-ಸೆಕೆಂಡ್‌ಗಳು/ವರ್ಷದ ಪ್ರೆಸೆಶನ್ ~25,920 ವರ್ಷಗಳಲ್ಲಿ ಒಂದು ಚಕ್ರವನ್ನು ಪೂರ್ಣಗೊಳಿಸುತ್ತದೆ. ಲಾಹಿರಿ ಅಯನಾಂಶವು ಪ್ರಸ್ತುತ ~24 ಡಿಗ್ರಿಗಳಷ್ಟಿದೆ.' },
      { title: 'ಗ್ರಹಣಗಳು: ಮುನ್ಸೂಚಕ ಶಕ್ತಿ', text: 'ಭಾರತೀಯ ಖಗೋಳಶಾಸ್ತ್ರಜ್ಞರು ರಾಹು ಮತ್ತು ಕೇತುವನ್ನು ಚಂದ್ರನ ಕಕ್ಷೆಯ ಆರೋಹಣ ಮತ್ತು ಅವರೋಹಣ ನೋಡ್‌ಗಳೆಂದು ಗುರುತಿಸಿದ್ದಾರೆ - ಅಲ್ಲಿ ಗ್ರಹಣಗಳು ಸಂಭವಿಸುತ್ತವೆ. ಸಾರೋಸ್ ಚಕ್ರವನ್ನು (~ 18 ವರ್ಷಗಳು) ಸ್ವತಂತ್ರವಾಗಿ ಕಂಡುಹಿಡಿಯಲಾಯಿತು. ಆಧುನಿಕ ಲೆಕ್ಕಾಚಾರಗಳ ವಿರುದ್ಧ ಪರಿಶೀಲಿಸಿದಾಗ ಪ್ರಾಚೀನ ಗ್ರಹಣ ಲೆಕ್ಕಾಚಾರದ ಕೋಷ್ಟಕಗಳು ಗಮನಾರ್ಹವಾದ ನಿಖರತೆಯನ್ನು ತೋರಿಸುತ್ತವೆ.' },
    ],
    contactHeading: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
    contactIntro: 'ನಾವು ನಿಮ್ಮಿಂದ ಕೇಳಲು ಇಷ್ಟಪಡುತ್ತೇವೆ. ನಮ್ಮ ಲೆಕ್ಕಾಚಾರಗಳ ಬಗ್ಗೆ ನೀವು ಪ್ರಶ್ನೆಯನ್ನು ಹೊಂದಿದ್ದೀರಾ, ದೋಷವನ್ನು ವರದಿ ಮಾಡಲು ಬಯಸುತ್ತೀರಾ ಅಥವಾ ಹಲೋ ಹೇಳಲು ಬಯಸುತ್ತೀರಾ - ತಲುಪಿ.',
    contactEmail: 'ಸಾಮಾನ್ಯ ವಿಚಾರಣೆಗಳು',
    contactPrivacy: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಡೇಟಾ ವಿನಂತಿಗಳು',
    contactLegal: 'ಕಾನೂನು ಮತ್ತು ನಿಯಮಗಳು',
    contactResponse: 'ನಾವು ಸಾಮಾನ್ಯವಾಗಿ 48 ಗಂಟೆಗಳ ಒಳಗೆ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತೇವೆ.',
    heritageHeading: 'ಭಾರತೀಯ ಖಗೋಳಶಾಸ್ತ್ರದ ವೈಜ್ಞಾನಿಕ ಪರಂಪರೆ',
  },
  gu: {
    title: 'દેખો પંચાંગ વિશે',
    subtitle: 'જ્યાં પ્રાચીન ખગોળશાસ્ત્રીય શાણપણ આધુનિક ગણતરીને મળે છે',
    authorHeading: 'લેખક વિશે',
    authorIntro: 'દેખો પંચાંગ દ્વારા નિર્માણ અને જાળવણી કરવામાં આવે છે',
    authorName: 'આદિત્ય ઝા',
    authorHeritage: 'વૈદિક પરંપરામાં ઊંડા મૂળ ધરાવતા મિથિલાના મૈથિલ બ્રાહ્મણ અને તાલીમ દ્વારા સોફ્ટવેર એન્જિનિયર.',
    authorVedic: 'આદિત્ય મિથિલાની લયમાં ડૂબીને ઉછર્યો હતો - પરોઢિયે પંચાંગની સલાહ લેવામાં આવે છે, ઘરે જોવા મળતી તિથિ આધારિત વ્રત, સંસ્કૃત શ્લોક સમજાય તે પહેલાં કંઠસ્થ થઈ ગયા હતા. રસ ક્યારેય નોસ્ટાલ્જીયામાં ઝાંખો પડ્યો. પુખ્ત જીવનએ તેમને સ્ત્રોત ગ્રંથોની નજીક રાખ્યા: સૂર્ય સિદ્ધાંતનું ખગોળશાસ્ત્રીય ગણિત, બૃહત પરાશર હોરા શાસ્ત્રનું અર્થઘટનાત્મક માળખું, મુહૂર્ત ચિંતામણિની સમયની શિસ્ત. આ તેમણે પસંદ કરેલ વિષય નથી; તે અંદર ઉછર્યા છે.',
    authorSoftware: 'સોફ્ટવેર એ બીજી માતૃભાષા છે. સ્કેલ પર બિલ્ડીંગ સિસ્ટમ્સના વર્ષોએ એક પેટર્નને અસ્પષ્ટ બનાવી છે: શાસ્ત્રીય જ્યોતિષ હંમેશા કોમ્પ્યુટેશનલ શિસ્ત રહી છે. સૂત્રો કોમ્પ્રેસ અલ્ગોરિધમ્સ; છંદો સ્કાય-મોડલ્સને એન્કોડ કરે છે. નિરાશાજનક બાબત એ હતી કે આધુનિક પંચાંગ સાઇટ્સ માર્કેટિંગ દાવાઓ, ચૂકવેલ "રિપોર્ટ્સ" અને અપારદર્શક ગણતરીઓ હેઠળ આ ચોકસાઇને દફનાવી દેતી જોવામાં આવી હતી. દેખો પંચાંગ એ ગણતરીને પાછું મૂકવા માટે અસ્તિત્વમાં છે જ્યાં તે સંબંધિત છે — ખુલ્લું, ચકાસી શકાય તેવું, મફત.',
    authorMission: 'આ પ્રોજેક્ટનો જન્મ એક સરળ પ્રતીતિથી થયો છે: સૂર્ય સિદ્ધાંત અને બૃહત પરાશર હોરા શાસ્ત્ર જેવા ગ્રંથોમાં સચવાયેલ ખગોળશાસ્ત્રીય અને જ્યોતિષીય જ્ઞાન દરેક માટે સુલભ હોવાને પાત્ર છે - પેવૉલ પાછળ લૉક નથી અથવા માન્યતાની બહાર સરળ નથી.',
    authorApproach: 'આ સાઇટ પરની દરેક ગણતરી પ્રથમ સિદ્ધાંતોથી કરવામાં આવે છે. ગ્રહોની સ્થિતિ સ્વિસ એફેમેરિસ (NASA JPL DE441) નો ઉપયોગ Meeus અલ્ગોરિધમ્સ સાથે ફોલબેક તરીકે કરે છે. પંચાંગ તત્વો અને અર્થઘટનાત્મક નિયમોની ગણતરી શાસ્ત્રીય જ્યોતિષ પ્રિસ્ક્રિપ્શનોનો ઉપયોગ કરીને કરવામાં આવે છે, જે નામના પ્રામાણિક સ્ત્રોતો પર લંગર છે. ત્યાં કોઈ બાહ્ય જ્યોતિષ API નથી - માત્ર ગણિત, એ જ ગણિત જે હજારો વર્ષ પહેલાં અમારા પૂર્વજોએ એન્કોડ કર્યું હતું, જે હવે તમારા બ્રાઉઝરમાં ચાલી રહ્યું છે.',
    authorClosing: 'આ એક પેશન પ્રોજેક્ટ છે, કોર્પોરેશન નથી. જો તમે તેમાં મૂલ્ય શોધો, તો તે શ્રેષ્ઠ પુરસ્કાર છે.',
    consultantsHeading: 'જ્યોતિષાચાર્યો સાથે બનેલ, માત્ર તેમના માટે નહીં',
    consultantsIntro: 'માત્ર સોફ્ટવેરની કુશળતા જ જ્યોતિષને એન્કોડ કરવા માટે કોઈને લાયક ઠરતી નથી. આ સાઇટ પર દરેક અર્થઘટન મોડ્યુલ બહુવિધ જ્યોતિષાચાર્યો સાથે પરામર્શમાં વિકસાવવામાં આવ્યું હતું - વિદ્વાનો કે જેઓ જીવંત પરંપરાને વહન કરે છે, પરાશરી, જૈમિની અને કેપી સિસ્ટમમાં પ્રશિક્ષિત છે. તેમની સંડોવણી માત્ર સપાટીના લેબલિંગને જ નહીં, પણ મહત્ત્વપૂર્ણ નિર્ણયોને આકાર આપે છે.',
    consultantsScope: 'કયા યોગ પ્રામાણિક છે અને કયા લોક ઉમેરણો છે; દશા-અંતર્દશા-પ્રત્યંતર અર્થઘટનનો સાચો ક્રમ; શદબાલા, અષ્ટકવર્ગ અને વિભાગીય ચાર્ટ માટે BPHS-વિશ્વાસુ કોષ્ટકો; શાસ્ત્રીય સંકલનકારોએ સ્પષ્ટપણે સૂચિબદ્ધ કરેલા મુહૂર્તના બાકાત (વિષ્ટિ, ભદ્રા, પંચક, બુધવાર અભિજિત). જ્યાં આધુનિક ગ્રંથો અસંમત હતા, અમે પ્રામાણિક સ્ત્રોતોનો સીધો સંપર્ક કર્યો અને નિર્ણયને અમારા જાહેર સ્પષ્ટીકરણોમાં નોંધ્યો જેથી કોઈપણ ભાવિ જાળવણીકાર તર્કનું ઑડિટ કરી શકે.',
    consultantsClosing: 'પરિણામ એ સૉફ્ટવેર છે જે આચાર્ય ઓળખશે - શિસ્તના સરળીકરણ તરીકે નહીં, પરંતુ તેના વફાદાર રેન્ડરિંગ તરીકે.',
    canonsHeading: 'ક્લાસિકલ સિદ્ધાંતો પ્રત્યે વફાદારી',
    canonsIntro: 'આ સાઇટ પરનું દરેક અર્થઘટન એન્જિન નામના લખાણ પર લંગરાયેલું છે — ક્યારેય અસ્પષ્ટ "પરંપરા" નથી. જ્યારે આપણે શદબાલાની ગણતરી કરીએ છીએ, ત્યારે અમે BPHS Ch.27ને સ્ટેપ બાય સ્ટેપ અનુસરીએ છીએ. જ્યારે અમે મંગલ દોષ જાહેર કરીએ છીએ, ત્યારે અમે સરળ લોકપ્રિય સંસ્કરણને બદલે ફલદીપિકા Ch.6 (વાસ્તવિક પ્રમાણભૂત સ્ત્રોત) માંથી શરતો લાગુ કરીએ છીએ. અમે જે પાઠોને અનુસરીએ છીએ, અને અમે દરેકમાંથી શું અમલ કરીએ છીએ:',
    canons: [
      { text: 'બૃહત પરાશર હોરા શાસ્ત્ર', follow: 'કોર નેટલ ચાર્ટ ફ્રેમવર્ક — ગૃહ સંકેતો, ગ્રહોની પ્રતિષ્ઠા, પ્રામાણિક યોગ સૂચિ, વિમશોત્તરી દશા મિકેનિક્સ, શદબાલા (છ ગણી શક્તિ), અષ્ટકવર્ગ.' },
      { text: 'ફલદીપિકા (મંત્રેશ્વર)', follow: 'પ્રસૂતિ યોગ સૂચિ અને મંગલ દોષ (Ch.6) માટેની વાસ્તવિક પ્રામાણિક પરિસ્થિતિઓ, લોકપ્રિય પરંતુ અચોક્કસ સંસ્કરણ મોટાભાગની એપ્લિકેશનો ઉપયોગ કરે છે તેની સામે સુધારેલ છે.' },
      { text: 'જૈમિની સૂત્રો', follow: 'ચરા કરકસ, કરકમશા, પદ ગણતરી, અર્ગલા અર્થઘટન અને રાશી-દશા પદ્ધતિ.' },
      { text: 'મુહૂર્ત ચિંતામણિ (રામચાર્ય)', follow: 'શુભ-સમય પસંદગીના નિયમો, ચોઘડિયા/હોરા યોજનાઓ અને અશુભ સમયગાળાની સૂચિ (વિષ્ટિ, ભાદ્ર, પંચક) અમારા મુહૂર્ત સ્કોરિંગમાં વપરાય છે.' },
      { text: 'સૂર્ય સિદ્ધાંત', follow: 'ફાઉન્ડેશનલ એસ્ટ્રોનોમી - સાઈડરીયલ વર્ષની લંબાઈ, ગ્રહોની સરેરાશ ગતિ, અયાનમશા ફ્રેમવર્ક. આધુનિક મૂલ્યો સામે ક્રોસ-વેરિફાઇડ.' },
      { text: 'કૃષ્ણમૂર્તિ પધ્ધતિ', follow: 'સબ-લોર્ડ ગણતરીઓ, શાસક ગ્રહ પસંદગી, અને અમારા KP સિસ્ટમ મોડ્યુલમાં વપરાતી cuspal સબ-થિયરી.' },
      { text: 'સર્વાર્થ ચિંતામણિ', follow: 'BPHS પ્રિસ્ક્રિપ્શનો સાથે ટિપન્ની જનરેશનમાં ઉપયોગમાં લેવાતા ચોક્કસ જીવન ક્ષેત્રો માટે અનુમાનિત તકનીકો.' },
      { text: 'બૃહત જાતિ (વરાહમિહિર)', follow: 'મુન્થા, સહમ્સ અને મુદ્દા દશા સહિત તાજિકા નિયમો અને વર્ષાફલ (તાજિકા વાર્ષિક ચાર્ટ) ગણતરી.' },
    ],
    whatWeOffer: 'અમે શું ઑફર કરીએ છીએ',
    features: [
      { icon: 'calc', label: 'ચોક્કસ પંચાંગ', desc: 'દૈનિક તિથિ, નક્ષત્ર, યોગ, કરણ અને મુહૂર્ત સમય તમારા ચોક્કસ સ્થાન માટે ગણતરી કરેલ ખગોળશાસ્ત્રીય અલ્ગોરિધમનો ઉપયોગ કરીને સંદર્ભ સ્ત્રોતોની 1-2 મિનિટમાં ચકાસવામાં આવે છે.' },
      { icon: 'book', label: 'વ્યવસાયિક-ગ્રેડ જન્મ ચાર્ટ', desc: '25+ વિશ્લેષણ મોડ્યુલ્સ: વિમશોત્તરી/અષ્ટોત્તરી/યોગિની દશા, શદબાલા (6-ગણી તાકાત), અષ્ટકવર્ગ, 16 વિભાગીય ચાર્ટ્સ (D1-D60), 144 યોગ પેટર્ન, KP સિસ્ટમ (પ્લાસિડસ સબ-લોર્ડ્સ), જૈમિની કરાકસ, અર્ધપાવર, અર્ધપાવર, અર્ધપાવર, અર્ધપાવર ચેટ સ્વિસ એફેમેરિસમાંથી સ્થાનિક રીતે ગણતરી કરેલ, કોઈ બાહ્ય API નથી.' },
      { icon: 'code', label: 'નાસા જેપીએલ એફેમેરિસ પ્રિસિઝન', desc: 'પ્રાથમિક એન્જિન: NASA JPL DE441 દ્વારા સંચાલિત સ્વિસ એફેમેરિસ - તમામ 9 ગ્રહો માટે આર્કસેકન્ડ સચોટતા, અવકાશયાન નેવિગેશન માટે NASA દ્વારા ઉપયોગમાં લેવાતો સમાન ડેટા. Meeus અલ્ગોરિધમ્સ ફોલબેક તરીકે. કોઈ બ્લેક-બોક્સ API નથી - ખુલ્લું, ચકાસી શકાય તેવી ખગોળશાસ્ત્રીય ગણતરી.' },
      { icon: 'shield', label: 'ગોપનીયતા પ્રથમ', desc: 'તમારો જન્મ ડેટા તમારો જ રહે છે. અમે રો લેવલ સિક્યોરિટી સાથે સુપાબેઝનો ઉપયોગ કરીએ છીએ - વપરાશકર્તાઓ ફક્ત તેમના પોતાના ડેટાને ઍક્સેસ કરી શકે છે. તૃતીય પક્ષોને વ્યક્તિગત માહિતી વેચવી નહીં.' },
      { icon: 'globe', label: 'બહુભાષી', desc: 'હિન્દી, તમિલ, બંગાળી, તેલુગુ, કન્નડ, મરાઠી, ગુજરાતી, મૈથિલી અને સંસ્કૃત સહિત 10 ભાષાઓમાં ઉપલબ્ધ છે. વાસ્તવિક અનુવાદો, મશીન-જનરેટેડ નહીં.' },
      { icon: 'learn', label: `${TOTAL_MODULES} Learning Modules`, desc: 'પંચાંગ બેઝિક્સથી લઈને અદ્યતન જૈમિની જ્યોતિષ, શાદબાલા, કેપી સિસ્ટમ અને અષ્ટકવર્ગ સુધીની દરેક વસ્તુને આવરી લેતો સંરચિત અભ્યાસક્રમ – દરેક માટે મફત.' },
    ],
    accuracyHeading: 'ચોકસાઈ અને પદ્ધતિ',
    methodologyCta: 'સંપૂર્ણ પદ્ધતિ વાંચો →',
    accuracy: [
      { title: 'એફેમેરિસ', text: 'NASA JPL DE441 દ્વારા સંચાલિત Swiss Ephemeris v2.10 - NASA દ્વારા અવકાશયાન નેવિગેશન માટે ઉપયોગમાં લેવાતી સમાન ગ્રહોની ક્ષણભંગુર. સૂર્ય, ચંદ્ર અને સાચા ચંદ્ર ગાંઠો (રાહુ/કેતુ) સહિત તમામ ગ્રહો માટે સબ-આર્કસેકન્ડ ચોકસાઈ.' },
      { title: 'આયનામશા', text: 'લાહિરી (ચિત્રપક્ષ) આયનામ્શા ડિફૉલ્ટ તરીકે - ભારતીય ખગોળશાસ્ત્રીય એફેમેરિસ દ્વારા ઉપયોગમાં લેવાતું ભારતીય સરકારનું ધોરણ. KP સિસ્ટમ વિશ્લેષણ માટે કૃષ્ણમૂર્તિ આયનમશા ઉપલબ્ધ છે.' },
      { title: 'ચકાસણી', text: 'પંચાંગ ચોકસાઈ, કુંડળીની ગણતરી, દશા અવધિ, યોગ શોધ અને તહેવારની તારીખોને આવરી લેતા 3,005 સ્વચાલિત પરીક્ષણો. વિશ્વભરમાં બહુવિધ સ્થાનો માટે વ્યાવસાયિક હિંદુ પંચાંગ અને અધિકૃત પંચાંગ સ્ત્રોતો સામે નિયમિતપણે ક્રોસ-વેરિફાઈડ.' },
      { title: 'સૂર્યોદય મોડલ', text: 'સ્વિસ એફેમેરિસ વાતાવરણીય રીફ્રેક્શન મોડેલ નિરીક્ષકની ઊંચાઈ, તાપમાન અને દબાણ માટે જવાબદાર છે. સમગ્ર દિલ્હી, બેંગ્લોર અને ન્યુયોર્કમાં વ્યાવસાયિક પંચાંગ સ્ત્રોતોની ±1 મિનિટની અંદર ચકાસણી.' },
    ],
    heritage: [
      { title: 'સૂર્ય સિદ્ધાંત', text: 'સૂર્ય સિદ્ધાંત (સી. 400 સીઇ) એ માનવ ઇતિહાસમાં સૌથી નોંધપાત્ર ખગોળશાસ્ત્રીય ગ્રંથોમાંનું એક છે. તે 365.2563627 દિવસો પર સાઈડરીયલ વર્ષની સચોટ ગણતરી કરે છે - આ આંકડો 365.25636 દિવસોના આધુનિક મૂલ્યની આશ્ચર્યજનક રીતે નજીક છે. તે ગ્રહોની સ્થિતિ, ગ્રહણની આગાહીઓ અને વિષુવવૃતિની પૂર્વાનુમાન માટે ચોક્કસ સૂત્રો પ્રદાન કરે છે.' },
      { title: 'આર્યભટ્ટની ક્રાંતિ', text: 'આર્યભટ્ટ (476 CE) એ પ્રસ્તાવ મૂક્યો હતો કે પૃથ્વી તેની ધરી પર ફરે છે - કોપરનિકસ પહેલાં એક સહસ્ત્રાબ્દી પહેલાં. તેમના આર્યભટિયામાં અત્યાધુનિક સાઈન કોષ્ટકો છે, 4 દશાંશ સ્થાનો (3.1416) સુધી પાઈ સચોટ છે, અને ગ્રહોની ગણતરીઓ માટેના અલ્ગોરિધમ્સ આજે પણ વખાણવામાં આવે છે.' },
      { title: 'પંચાંગ સિસ્ટમ', text: 'પંચાંગ ("પાંચ અંગ") એ પાંચ ખગોળીય તત્વોને ટ્રેક કરતું ચંદ્રસૂર્ય કેલેન્ડર છે: તિથિ (ચંદ્ર દિવસ), નક્ષત્ર (ચંદ્ર હવેલી), યોગ (ચંદ્ર-સૌર કોણ), કરણ (અર્ધ-તિથિ) અને વારા (સપ્તાહનો દિવસ). તે વારાફરતી સૂર્યની તુલનામાં અને નિશ્ચિત તારાઓ સામે ચંદ્રની સ્થિતિને ટ્રેક કરે છે.' },
      { title: 'આયનામ્ષાઃ ધ ક્રિટિકલ કરેક્શન', text: 'ભારતીય ખગોળશાસ્ત્ર આયનામ્શા દ્વારા સમપ્રકાશીયના આગમન માટે જવાબદાર છે - ઉષ્ણકટિબંધીય અને બાજુની રાશિઓ વચ્ચેનો કોણીય તફાવત. આ ~50.3 આર્ક-સેકન્ડ્સ/વર્ષ પ્રિસેશન ~25,920 વર્ષમાં એક ચક્ર પૂર્ણ કરે છે. લાહિરી આયનામશા હાલમાં ~24 ડિગ્રી છે.' },
      { title: 'ગ્રહણ: આગાહી શક્તિ', text: 'ભારતીય ખગોળશાસ્ત્રીઓએ રાહુ અને કેતુને ચંદ્રની ભ્રમણકક્ષાના ચડતા અને ઉતરતા ગાંઠો તરીકે ઓળખ્યા - જ્યાં ગ્રહણ થાય છે. સરોસ ચક્ર (~18 વર્ષ) સ્વતંત્ર રીતે શોધાયું હતું. પ્રાચીન ગ્રહણ ગણતરી કોષ્ટકો જ્યારે આધુનિક ગણતરીઓ સામે ચકાસવામાં આવે ત્યારે નોંધપાત્ર ચોકસાઈ દર્શાવે છે.' },
    ],
    contactHeading: 'અમારો સંપર્ક કરો',
    contactIntro: 'અમને તમારી પાસેથી સાંભળવું ગમશે. ભલે તમને અમારી ગણતરીઓ વિશે કોઈ પ્રશ્ન હોય, બગની જાણ કરવી હોય, અથવા ફક્ત હેલો કહેવા માગતા હોવ - સંપર્ક કરો.',
    contactEmail: 'સામાન્ય પૂછપરછ',
    contactPrivacy: 'ગોપનીયતા અને ડેટા વિનંતીઓ',
    contactLegal: 'કાનૂની અને શરતો',
    contactResponse: 'અમે સામાન્ય રીતે 48 કલાકની અંદર જવાબ આપીએ છીએ.',
    heritageHeading: 'ભારતીય ખગોળશાસ્ત્રનો વૈજ્ઞાનિક વારસો',
  },
};

function getIcon(icon: string) {
  const cls = 'w-6 h-6 text-gold-primary';
  switch (icon) {
    case 'calc': return <Calculator className={cls} />;
    case 'book': return <BookOpen className={cls} />;
    case 'code': return <Code className={cls} />;
    case 'shield': return <Shield className={cls} />;
    case 'globe': return <Globe className={cls} />;
    case 'learn': return <BookOpen className={cls} />;
    default: return <Globe className={cls} />;
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  // Per-key fallback: merge English base with the locale's partial
  // overrides so partial translations can ship incrementally. Without
  // this, a half-translated locale block would cause every untranslated
  // key to read `undefined`, which the JSX guards would then hide.
  const localeBlock = (CONTENT as unknown as Record<string, Partial<typeof CONTENT.en>>)[locale] || {};
  const l = { ...CONTENT.en, ...localeBlock };

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Person JSON-LD  –  E-E-A-T signal */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(generatePersonLD()) }}
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gold-primary/30 bg-gold-primary/10">
          <span className="text-gold-light text-sm font-medium">{l.title}</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gold-light via-gold-primary to-gold-light bg-clip-text text-transparent"
          style={headingFont}
        >
          {l.title}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{l.subtitle}</p>
      </div>

      {/* Author Section  –  E-E-A-T */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.authorHeading}</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 space-y-4">
          <p className="text-text-primary leading-relaxed text-lg">
            {l.authorIntro} <span className="text-gold-light font-semibold">{l.authorName}</span>  –  {l.authorHeritage}
          </p>
          {l.authorVedic && <p className="text-text-secondary leading-relaxed text-lg">{l.authorVedic}</p>}
          {l.authorSoftware && <p className="text-text-secondary leading-relaxed text-lg">{l.authorSoftware}</p>}
          <p className="text-text-secondary leading-relaxed text-lg">{l.authorMission}</p>
          <p className="text-text-secondary leading-relaxed text-lg">{l.authorApproach}</p>
          <p className="text-text-secondary leading-relaxed text-lg italic">{l.authorClosing}</p>
        </div>
      </section>

      {/* Jyotishacharya Council — credibility signal */}
      {l.consultantsHeading && (
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.consultantsHeading}</h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 space-y-4">
            <p className="text-text-secondary leading-relaxed text-lg">{l.consultantsIntro}</p>
            <p className="text-text-secondary leading-relaxed text-lg">{l.consultantsScope}</p>
            <p className="text-text-secondary leading-relaxed text-lg italic">{l.consultantsClosing}</p>
          </div>
        </section>
      )}

      {/* Fidelity to Classical Canons */}
      {l.canonsHeading && l.canons && (
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.canonsHeading}</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-8">{l.canonsIntro}</p>
          <div className="space-y-4">
            {l.canons.map((c: { text: string; follow: string }, i: number) => (
              <div
                key={i}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 hover:border-gold-primary/30 transition-colors"
              >
                <h3 className="text-gold-light font-semibold text-lg mb-2" style={headingFont}>{c.text}</h3>
                <p className="text-text-secondary text-base leading-relaxed">{c.follow}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* What We Offer */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.whatWeOffer}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {l.features.map((f, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 hover:border-gold-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center">
                  {getIcon(f.icon)}
                </div>
                <h3 className="text-gold-light font-semibold">{f.label}</h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accuracy & Methodology  –  addresses ChatGPT/LLM "accuracy not clear" criticism */}
      {l.accuracy && (
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.accuracyHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {l.accuracy.map((a: { title: string; text: string }, i: number) => (
              <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
                <h3 className="text-gold-light font-semibold text-sm mb-2">{a.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
          {l.methodologyCta && (
            <div className="mt-6">
              <Link
                href={`/${locale}/about/methodology`}
                className="inline-flex items-center text-gold-light hover:text-gold-primary font-semibold text-base transition-colors"
              >
                {l.methodologyCta}
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Heritage */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.heritageHeading}</h2>
        <p className="text-text-secondary text-lg leading-relaxed mb-8">
          {pickByScript('Indian Jyotish is a two-layer system. The foundation is Siddhantic Jyotish  –  mathematical astronomy of the highest order, computing planetary positions with precision that modern instruments have confirmed. Upon this foundation stands Phalit Jyotish  –  the interpretive framework that maps cosmic patterns to human experience. This site implements both layers with equal rigour: the astronomy engine uses algorithms from the Surya Siddhanta and Jean Meeus, verified against NASA\'s JPL ephemeris; the interpretive modules follow Parashara, Jaimini, and the Muhurta Chintamani.', 'भारतीय ज्योतिष एक द्वि-स्तरीय प्रणाली है। आधार है सिद्धान्तिक ज्योतिष  –  सर्वोच्च कोटि का गणितीय खगोल विज्ञान, जो ग्रहों की स्थिति की ऐसी सटीकता से गणना करता है जिसकी पुष्टि आधुनिक उपकरणों ने की है। इस आधार पर खड़ा है फलित ज्योतिष  –  वह व्याख्यात्मक ढाँचा जो ब्रह्माण्डीय प्रतिरूपों को मानव अनुभव से जोड़ता है। यह साइट दोनों परतों को समान कठोरता से लागू करती है: खगोलीय इंजन सूर्य सिद्धान्त और जीन मीउस के एल्गोरिदम का उपयोग करता है, जो NASA के JPL पंचांग से सत्यापित है; व्याख्यात्मक मॉड्यूल पराशर, जैमिनी और मुहूर्त चिन्तामणि का अनुसरण करते हैं।', locale)}
        </p>
        <div className="space-y-6">
          {l.heritage.map((h, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gold-light mb-3" style={headingFont}>{h.title}</h3>
              <p className="text-text-secondary leading-relaxed text-lg">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us  –  required by AdSense */}
      <section className="max-w-4xl mx-auto mb-16" id="contact">
        <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.contactHeading}</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8">
          <p className="text-text-secondary text-lg leading-relaxed mb-8">{l.contactIntro}</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-gold-primary" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">{l.contactEmail}</p>
                <a href="mailto:hello@dekhopanchang.com" className="text-gold-light hover:text-gold-primary transition-colors font-medium">
                  hello@dekhopanchang.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-gold-primary" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">{l.contactPrivacy}</p>
                <a href="mailto:privacy@dekhopanchang.com" className="text-gold-light hover:text-gold-primary transition-colors font-medium">
                  privacy@dekhopanchang.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-gold-primary" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">{l.contactLegal}</p>
                <a href="mailto:legal@dekhopanchang.com" className="text-gold-light hover:text-gold-primary transition-colors font-medium">
                  legal@dekhopanchang.com
                </a>
              </div>
            </div>
          </div>
          <p className="text-text-secondary/60 text-sm mt-6">{l.contactResponse}</p>

          {/* Social links */}
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gold-primary/10">
            <span className="text-text-secondary text-sm">{pickByLocale({ en: 'Follow us', hi: 'हमसे जुड़ें', ta: 'எங்களை தொடருங்கள்', bn: 'আমাদের অনুসরণ করুন' }, locale)}:</span>
            <a href="https://x.com/dekhopanchang" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @dekhopanchang
            </a>
            <a href="https://www.youtube.com/@DekhoPanchang" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-[#ff0000] hover:border-[#ff0000]/30 transition-all text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              YouTube
            </a>
            <a href="https://www.instagram.com/dekhopanchang/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-[#e4405f] hover:border-[#e4405f]/30 transition-all text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-text-secondary/50 text-sm">
          Dekho Panchang &mdash; dekhopanchang.com
        </p>
      </div>
    </main>
  );
}
