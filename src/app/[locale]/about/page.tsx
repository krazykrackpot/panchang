import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
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
          {locale === 'hi'
            ? 'भारतीय ज्योतिष एक द्वि-स्तरीय प्रणाली है। आधार है सिद्धान्तिक ज्योतिष  –  सर्वोच्च कोटि का गणितीय खगोल विज्ञान, जो ग्रहों की स्थिति की ऐसी सटीकता से गणना करता है जिसकी पुष्टि आधुनिक उपकरणों ने की है। इस आधार पर खड़ा है फलित ज्योतिष  –  वह व्याख्यात्मक ढाँचा जो ब्रह्माण्डीय प्रतिरूपों को मानव अनुभव से जोड़ता है। यह साइट दोनों परतों को समान कठोरता से लागू करती है: खगोलीय इंजन सूर्य सिद्धान्त और जीन मीउस के एल्गोरिदम का उपयोग करता है, जो NASA के JPL पंचांग से सत्यापित है; व्याख्यात्मक मॉड्यूल पराशर, जैमिनी और मुहूर्त चिन्तामणि का अनुसरण करते हैं।'
            : 'Indian Jyotish is a two-layer system. The foundation is Siddhantic Jyotish  –  mathematical astronomy of the highest order, computing planetary positions with precision that modern instruments have confirmed. Upon this foundation stands Phalit Jyotish  –  the interpretive framework that maps cosmic patterns to human experience. This site implements both layers with equal rigour: the astronomy engine uses algorithms from the Surya Siddhanta and Jean Meeus, verified against NASA\'s JPL ephemeris; the interpretive modules follow Parashara, Jaimini, and the Muhurta Chintamani.'}
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
            <span className="text-text-secondary text-sm">{locale === 'hi' ? 'हमसे जुड़ें' : locale === 'ta' ? 'எங்களை தொடருங்கள்' : locale === 'bn' ? 'আমাদের অনুসরণ করুন' : 'Follow us'}:</span>
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
