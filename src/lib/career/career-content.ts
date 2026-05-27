/**
 * Per-activity classical rationale + landing-page copy for Career Muhurta.
 *
 * Each entry powers ONE landing page at `/career-muhurta/[activity]`.
 * The fields are deliberately verbose (3 paragraphs, "what to avoid",
 * sibling comparison) so each page has genuine unique content — not
 * a thin template. Per spec §5 Phase 2B, activities without enough
 * material here should ship in Phase 3 instead.
 */
import type { CareerActivityId } from '@/types/muhurta-ai';
import type { LocaleText } from '@/types/panchang';

export interface CareerContent {
  /** Slug used in URLs — hyphenated form of the activity ID. */
  slug: string;
  /** Display name on the landing page H1. */
  name: LocaleText;
  /** Classical Sanskrit/Devanagari name + transliteration. */
  classicalName: { sanskrit: string; transliteration: string };
  /** One-sentence definition. */
  oneLiner: LocaleText;
  /** Classical rationale paragraph (~3 sentences) — which nakshatras, why. */
  classicalRationale: LocaleText;
  /** Sibling-activity comparison (~2 sentences). */
  siblingComparison: LocaleText;
  /** "What to avoid" paragraph — specific tithis/nakshatras to skip. */
  whatToAvoid: LocaleText;
  /** 3-5 FAQ items used for both UI and JSON-LD FAQPage schema. */
  faqs: Array<{ q: LocaleText; a: LocaleText }>;
  /** Sibling activity IDs to cross-link at the bottom of the page. */
  siblings: CareerActivityId[];
}

export const CAREER_CONTENT: Record<CareerActivityId, CareerContent> = {

  job_interview: {
    slug: 'job-interview',
    name: { en: 'Job Interview', hi: 'नौकरी इंटरव्यू', sa: 'साक्षात्कारः', ta: 'வேலை நேர்காணல்', te: 'ఉద్యోగ ఇంటర్వ్యూ', bn: 'চাকরি ইন্টারভিউ', gu: 'નોકરી ઇન્ટરવ્યૂ', kn: 'ಉದ್ಯೋಗ ಸಂದರ್ಶನ', mai: 'नौकरी इंटरव्यू', mr: 'नोकरी इंटरव्ह्यू' },
    classicalName: { sanskrit: 'विद्यारम्भ-साक्षात्कारः', transliteration: 'Vidyārambha-sākṣātkāra' },
    oneLiner: {
      en: 'A job interview is a first impression under examination — a hybrid of Vidyārambha (entering a learning relationship) and Sankalpa (committing to one\'s candidacy).',
      hi: 'नौकरी इंटरव्यू परीक्षा के अधीन प्रथम छाप है — विद्यारम्भ (शिक्षण-सम्बन्ध में प्रवेश) और सङ्कल्प (अभ्यर्थिता के प्रति प्रतिबद्धता) का संयोजन।',
      sa: 'साक्षात्कारः परीक्षायां प्रथमप्रभावः — विद्यारम्भसङ्कल्पयोः सम्मिश्रणम्।',
    },
    classicalRationale: {
      en: 'Muhurta Chintamani Ch. 4 recommends Pushya (8), U.Phalguni (12), Hasta (13), Anuradha (17), Shravana (22), and U.Bhadrapada (26) for any activity involving learning, communication, and being received favourably — the exact constellation an interview demands. Brihat Samhita 105 adds Rohini (4) for stability under questioning. The classical preference for Mercury hora (the planet of speech) and Jupiter hora (the planet of expansive wisdom) carries directly across to the modern interview format. Wednesday (Mercury\'s weekday) is the strongest day; Thursday (Jupiter) and Friday (Venus — pleasing first impressions) are close seconds.',
      hi: 'मुहूर्त चिन्तामणि अध्याय 4 शिक्षा, संचार और अनुकूल स्वागत वाले कार्यों के लिए पुष्य (8), उत्तरा फाल्गुनी (12), हस्त (13), अनुराधा (17), श्रवण (22) और उत्तरा भाद्रपद (26) नक्षत्रों की संस्तुति करता है — इंटरव्यू की मांग ठीक यही है। बृहत् संहिता 105 प्रश्नों के अधीन स्थिरता के लिए रोहिणी (4) भी जोड़ती है। बुध होरा (वाक्-स्वामी) और बृहस्पति होरा (विस्तृत बुद्धि) की शास्त्रीय वरीयता आधुनिक इंटरव्यू पर सीधे लागू होती है। बुधवार सर्वोत्तम; गुरुवार और शुक्रवार उत्कृष्ट विकल्प।',
      sa: 'मुहूर्तचिन्तामणौ चतुर्थाध्याये पुष्य-उत्तराफाल्गुनी-हस्त-अनुराधा-श्रवण-उत्तराभाद्रपदानां प्रशंसा — साक्षात्कारस्य आवश्यकताभिः सर्वथा सङ्गता।',
    },
    siblingComparison: {
      en: 'Unlike contract signing — which classically guards Sthira (fixed) nakshatras as absolute requirements — an interview is more forgiving, since the commitment happens later when the offer arrives. The closest sibling is salary negotiation, which adds Dhanishtha (the wealth-nakshatra) to the preferred set; a job interview leans slightly more on Mercury/Hasta (communication) than on Dhanishtha (wealth-acquisition).',
      hi: 'अनुबंध हस्ताक्षर के विपरीत — जो स्थिर नक्षत्रों को अनिवार्य मानता है — इंटरव्यू अधिक उदार है, क्योंकि प्रतिबद्धता बाद में होती है। वेतन वार्ता निकटतम सम्बन्धी है; वह धनिष्ठा (धन-नक्षत्र) पर अधिक झुकती है, जबकि इंटरव्यू बुध/हस्त (संचार) पर।',
      sa: 'अनुबन्धहस्ताक्षरतः स्थिरनक्षत्रापेक्षायां साक्षात्कारः अधिकोदारः; धनार्जनस्य निकटः किन्तु धनिष्ठाधाराः स्वल्पा।',
    },
    whatToAvoid: {
      en: 'Avoid Ardra (6), Ashlesha (9), Jyeshtha (18), Mula (19), and P.Bhadrapada (25) — these are classically associated with destruction, treachery, conflict, uprooting, and ferocity respectively, all of which work against a candidate\'s favourable impression. Rikta tithis (4, 9, 14) and Amavasya (30) are conventionally avoided for any new venture. The window must also fall outside Rahu Kaal, Yamaganda, Gulika Kaal, and any Vishti karana — these are hard vetoes that override all positive factors.',
      hi: 'आर्द्रा (6), आश्लेषा (9), ज्येष्ठा (18), मूल (19), पूर्व भाद्रपद (25) नक्षत्र त्यागें — ये क्रमशः विनाश, कपट, संघर्ष, उच्छेद और उग्रता से जुड़े हैं। रिक्ता तिथियाँ (4, 9, 14) और अमावस्या (30) नए कार्य के लिए वर्जित। राहु काल, यमगण्ड, गुलिक काल और विष्टि करण में अवधि नहीं होनी चाहिए — ये निरपेक्ष निषेध।',
      sa: 'आर्द्रा-आश्लेषा-ज्येष्ठा-मूल-पूर्वभाद्रपदाः वर्ज्याः; रिक्ता-तिथयोऽपि।',
    },
    faqs: [
      {
        q: { en: 'What time of day is best for a job interview?', hi: 'नौकरी इंटरव्यू के लिए दिन का कौन सा समय सर्वोत्तम है?', sa: 'साक्षात्काराय कः कालः उत्तमः?' },
        a: { en: 'Mid-morning windows during Jupiter or Mercury hora — typically 9 AM to 12 noon in most cities — combine the strongest planetary support (wisdom + communication) with the practical advantage of an interviewer\'s sharpest attention. Always check the day\'s Choghadiya to land within Amrit, Shubh, or Labh, and avoid Rahu Kaal regardless of nakshatra quality.', hi: 'देर-सुबह की अवधि बृहस्पति या बुध होरा में — अधिकांश शहरों में 9 बजे से दोपहर 12 बजे तक — सबसे मजबूत ग्रह सहायता और साक्षात्कारकर्ता की सर्वाधिक एकाग्रता का मेल। चौघड़िया में अमृत, शुभ या लाभ चुनें; राहु काल टालें।', sa: 'मध्यप्रातः बृहस्पति-बुधहोरायां श्रेष्ठम्।' },
      },
      {
        q: { en: 'Is Saturday acceptable for a job interview?', hi: 'क्या शनिवार नौकरी इंटरव्यू के लिए स्वीकार्य है?', sa: 'शनिवारः साक्षात्काराय योग्यः किम्?' },
        a: { en: 'Saturday is "fair" but not "good." Saturn (Shani) is the karaka of service and longevity, but not of new beginnings — its day favours roles you settle into for the long term more than impressions you make for the first time. Many working professionals can only interview on weekends; Saturday remains usable, but if you can choose Wednesday or Thursday, do so.', hi: 'शनिवार "स्वीकार्य" है पर "श्रेष्ठ" नहीं। शनि सेवा और दीर्घायु का कारक है, नए आरम्भ का नहीं। यदि बुधवार या गुरुवार चुन सकें तो वही करें।', sa: 'शनिवारः मध्यमः, उत्तमः नैव।' },
      },
      {
        q: { en: 'My interview is at a time I can\'t change. Is checking muhurta still useful?', hi: 'मेरा इंटरव्यू निश्चित समय पर है। क्या मुहूर्त देखना अब भी उपयोगी है?', sa: 'मम साक्षात्कारस्य कालः स्थिरः; मुहूर्तदर्शनं प्रयोजनम् किम्?' },
        a: { en: 'Yes — even when the time is fixed, knowing whether you\'re entering a favourable or unfavourable window helps you prepare differently. A challenging window (Rahu Kaal or Vishti karana) is a cue to over-prepare on substance and arrive with calm; a favourable window is permission to trust your preparation. The muhurta increases the odds; your preparation matters more.', hi: 'हाँ — समय स्थिर हो तब भी जानना उपयोगी है। चुनौतीपूर्ण काल में पदार्थ पर अधिक तैयारी, अनुकूल काल में अपनी तैयारी पर विश्वास।', sa: 'आम् — कालस्य स्थिरत्वेऽपि ज्ञानं तैयार्याः मार्गदर्शनम्।' },
      },
      {
        q: { en: 'Do nakshatras matter more than weekdays for interviews?', hi: 'क्या नक्षत्र साप्ताहिक दिनों से अधिक महत्वपूर्ण हैं?', sa: 'नक्षत्रं वारात् अधिकमहत्त्वम् किम्?' },
        a: { en: 'For interviews, classical sources weight nakshatras slightly higher because they govern the quality of the moment\'s consciousness — what the candidate and interviewer "carry" into the room. Weekdays add a planetary tonal layer (Mercury\'s communication on Wednesday, Jupiter\'s expansion on Thursday). Both matter; if you can only optimise one, pick the nakshatra.', hi: 'शास्त्र नक्षत्र को थोड़ा अधिक भार देते हैं क्योंकि वे क्षण की चेतना को शासित करते हैं। दोनों महत्वपूर्ण, परन्तु एक चुनना हो तो नक्षत्र।', sa: 'नक्षत्रं वारात् किञ्चित् अधिकम्; उभयोः महत्त्वम्।' },
      },
    ],
    siblings: ['job_application', 'salary_negotiation', 'asking_promotion'],
  },

  job_application: {
    slug: 'job-application',
    name: { en: 'Job Application', hi: 'नौकरी आवेदन', sa: 'व्यवसायप्रसारः', ta: 'வேலை விண்ணப்பம்', te: 'ఉద్యోగ దరఖాస్తు', bn: 'চাকরির আবেদন', gu: 'નોકરી અરજી', kn: 'ಉದ್ಯೋಗ ಅರ್ಜಿ', mai: 'नौकरी आवेदन', mr: 'नोकरी अर्ज' },
    classicalName: { sanskrit: 'व्यवसायप्रसारः', transliteration: 'Vyavasāya-prasāra' },
    oneLiner: {
      en: 'Sending a job application is a deliberate "casting outward" — classically tied to Vyavasāya-prasāra, the spreading of one\'s work into the world.',
      hi: 'नौकरी आवेदन भेजना — व्यवसाय-प्रसार से सम्बद्ध एक सङ्कल्पित बाह्यप्रक्षेपण।',
      sa: 'व्यवसायप्रसारः बहिःप्रक्षेपः।',
    },
    classicalRationale: {
      en: 'The act of sending material outward favours Mercury\'s nakshatras and hora — Pushya (8), Hasta (13), Anuradha (17), Shravana (22), U.Bhadrapada (26) — and the Mercury weekday (Wednesday). Communication-favourable conditions improve the odds that your message lands well and reaches the intended reader at the right moment. Jupiter hora adds a layer of wisdom (the application is read as thoughtful) and Sun hora adds visibility (the recipient actually opens it).',
      hi: 'सामग्री बाह्य भेजने का कार्य बुध के नक्षत्रों और होरा को पसंद करता है — पुष्य, हस्त, अनुराधा, श्रवण, उत्तरा भाद्रपद — और बुधवार। अनुकूल संचार स्थिति में आपका संदेश सही पाठक तक सही क्षण में पहुँचता है। बृहस्पति होरा बुद्धिमत्ता और सूर्य होरा दृश्यता जोड़ती है।',
      sa: 'बहिःप्रक्षेपः बुधनक्षत्रहोरयोः अनुकूलः।',
    },
    siblingComparison: {
      en: 'Job application differs from interview in that the candidate is the active sender — not the receiver of a question. Mercury hora is therefore even more central here, while the interview\'s emphasis on Jupiter (presence) softens. The closest sibling is a contract signing in the sense of "putting something out in writing"; the difference is reversibility — an application can be withdrawn, a signed contract usually cannot.',
      hi: 'आवेदन में अभ्यर्थी सक्रिय प्रेषक है, इंटरव्यू की तरह उत्तरदाता नहीं — अतः बुध होरा यहाँ और भी केन्द्रीय। अनुबंध हस्ताक्षर का निकट सम्बन्ध है, परन्तु आवेदन वापस लिया जा सकता है, अनुबंध नहीं।',
      sa: 'आवेदने प्रेषकः सक्रियः; बुधहोरा केन्द्रीयतरा।',
    },
    whatToAvoid: {
      en: 'Avoid Bharani (2) and Mula (19) for any communication that aims to plant a seed — these nakshatras carry the connotation of ending and uprooting respectively. Skip Rikta tithis and Amavasya. Sending applications during Rahu Kaal is conventionally discouraged because the message is said to be "received but not absorbed."',
      hi: 'भरणी (2) और मूल (19) से बचें — समाप्ति और उच्छेद से सम्बद्ध। रिक्ता तिथियाँ और अमावस्या भी। राहु काल में आवेदन भेजना पारम्परिक रूप से वर्जित — सन्देश "प्राप्त होता है पर अंगीकृत नहीं।"',
      sa: 'भरणी-मूले वर्ज्ये; रिक्ता-अमावास्ये अपि।',
    },
    faqs: [
      {
        q: { en: 'Does the time I press "submit" matter, or just when the recruiter sees it?', hi: 'क्या मेरे "सबमिट" दबाने का समय मायने रखता है, या केवल जब रिक्रूटर देखे?', sa: 'मम प्रक्षेपणकालः महत्त्वपूर्णः वा रिक्रूटरस्य दर्शनकालः?' },
        a: { en: 'Both. Classical muhurta theory holds that the sankalpa (the moment of intent + action) carries the largest weight — that\'s when you press submit. The recipient\'s reading time is secondary. So check the muhurta for the submission timestamp.', hi: 'दोनों। शास्त्रीय रूप से सङ्कल्प (इरादे + क्रिया का क्षण) सबसे अधिक भारी — वह सबमिट दबाने का क्षण है।', sa: 'उभयम्; मुख्यतया प्रक्षेपणसङ्कल्पः।' },
      },
      {
        q: { en: 'Should I send applications in batches or one-by-one?', hi: 'क्या मुझे आवेदन एक साथ भेजने चाहिए या एक-एक करके?', sa: 'आवेदनानि समूहे प्रेषयेयं किम् एकैकं वा?' },
        a: { en: 'For muhurta purposes, one well-timed application beats a scattershot batch. If you must send several, pick the highest-leverage one for the best window and let the others ride the general day\'s tone.', hi: 'मुहूर्त की दृष्टि से एक सुसमयित आवेदन छितरे समूह से बेहतर। सर्वाधिक महत्वपूर्ण को सर्वश्रेष्ठ अवधि में भेजें।', sa: 'एकं सुसमयितम् श्रेष्ठम्; मुख्यम् श्रेष्ठकाले प्रेषयेत्।' },
      },
      {
        q: { en: 'Is Friday good for sending applications?', hi: 'क्या शुक्रवार आवेदन भेजने के लिए अच्छा है?', sa: 'शुक्रवारः आवेदनप्रेषणाय श्रेष्ठः किम्?' },
        a: { en: 'Friday is good for applications going to client-facing or partnership roles — Venus favours pleasing first impressions. For technical or specialist roles, Wednesday (Mercury) or Thursday (Jupiter) is stronger.', hi: 'शुक्रवार ग्राहक-सामना या साझेदारी भूमिका के लिए अच्छा — शुक्र प्रथम छाप का स्वामी। तकनीकी भूमिका के लिए बुधवार या गुरुवार।', sa: 'शुक्रवारः ग्राहकसम्बद्धकार्ये श्रेष्ठः।' },
      },
    ],
    siblings: ['job_interview', 'salary_negotiation', 'contract_signing'],
  },

  salary_negotiation: {
    slug: 'salary-negotiation',
    name: { en: 'Salary Negotiation', hi: 'वेतन वार्ता', sa: 'धनार्जनम्', ta: 'ஊதிய பேச்சுவார்த்தை', te: 'జీత చర్చ', bn: 'বেতন আলোচনা', gu: 'પગાર વાટાઘાટ', kn: 'ವೇತನ ಸಂಧಾನ', mai: 'वेतन वार्ता', mr: 'पगार वाटाघाटी' },
    classicalName: { sanskrit: 'धनार्जन-संवादः', transliteration: 'Dhanārjana-saṁvāda' },
    oneLiner: {
      en: 'Negotiating compensation is a Dhanārjana act — the deliberate acquisition of wealth — overlaid with the social skill of saṁvāda (constructive dialogue).',
      hi: 'वेतन वार्ता धनार्जन कार्य है — धन का सङ्कल्पित अर्जन — संवाद के सामाजिक कौशल के साथ।',
      sa: 'धनार्जनसंवादः इति।',
    },
    classicalRationale: {
      en: 'Brihat Samhita Ch. 105 places Rohini (4), Pushya (8), and Dhanishtha (23) at the top of the wealth-acquisition list. Dhanishtha literally means "wealthiest" — its inclusion in the preferred set is a direct classical signal that financial conversations land best under it. Hasta (13), U.Phalguni (12), Anuradha (17), and Shravana (22) all support the relational + communication side. Jupiter hora (expansion of compensation) and Venus hora (graceful exchange) are the strongest planetary supports; Thursday and Friday are the strongest weekdays.',
      hi: 'बृहत् संहिता अध्याय 105 धनार्जन के लिए रोहिणी (4), पुष्य (8) और धनिष्ठा (23) को शीर्ष पर रखती है। धनिष्ठा शाब्दिक रूप से "सर्वाधिक धनी" — इसका वरीयता सेट में होना सीधा शास्त्रीय संकेत। हस्त, उत्तरा फाल्गुनी, अनुराधा, श्रवण संबंध और संचार पक्ष में सहायक। बृहस्पति होरा (वेतन का विस्तार) और शुक्र होरा (सुगम विनिमय) सर्वोत्तम; गुरुवार और शुक्रवार सर्वोत्तम वार।',
      sa: 'रोहिणी-पुष्य-धनिष्ठाः धनार्जने श्रेष्ठाः।',
    },
    siblingComparison: {
      en: 'A salary negotiation differs from a contract signing in that nothing is yet binding — you can withdraw, recalibrate, ask again next quarter. So while contract signing demands Sthira (fixed) nakshatras for permanence, negotiation is freer and can lean on the lighter, more flowing wealth-nakshatras (Rohini, Dhanishtha). The closest sibling is asking for promotion, but promotion adds Sun-energy (authority) where negotiation is purely Venus-Jupiter (luxury + wisdom).',
      hi: 'वार्ता अनुबंध हस्ताक्षर से भिन्न — कुछ भी अभी बाध्यकारी नहीं। अनुबंध हस्ताक्षर स्थिर नक्षत्रों की मांग करता है, वार्ता हल्के, प्रवाही धन-नक्षत्रों पर निर्भर हो सकती है। पदोन्नति निकटतम सम्बन्धी, परन्तु उसमें सूर्य-ऊर्जा (अधिकार) जुड़ती है।',
      sa: 'अनुबन्धात् अबन्धनीयता; धनिष्ठा प्रबला।',
    },
    whatToAvoid: {
      en: 'Skip Bharani (2), Ardra (6), Ashlesha (9), Jyeshtha (18), Mula (19), and P.Bhadrapada (25) — these carry connotations of harshness, conflict, or treachery that work against the soft tone needed to convince someone to pay more. Avoid Rikta tithis (4, 9, 14) and Amavasya. Tuesday (Mars — aggression) is also avoided for negotiation despite being acceptable for many other career activities.',
      hi: 'भरणी, आर्द्रा, आश्लेषा, ज्येष्ठा, मूल, पूर्व भाद्रपद त्यागें — कठोरता, संघर्ष, कपट से सम्बद्ध। रिक्ता तिथियाँ और अमावस्या। मंगलवार (मंगल — आक्रामकता) भी वार्ता के लिए वर्जित।',
      sa: 'भरणी-आर्द्रा-आश्लेषाः वर्ज्याः।',
    },
    faqs: [
      {
        q: { en: 'Should I open the negotiation or wait for the other side to put a number on the table first?', hi: 'क्या मुझे वार्ता शुरू करनी चाहिए या दूसरे पक्ष की संख्या का इंतजार करना चाहिए?', sa: 'मया प्रारम्भः करणीयः वा प्रतीक्षा?' },
        a: { en: 'In Jupiter hora, opening is favoured — your number anchors the conversation and Jupiter expands. In Venus hora, waiting is favoured — the other side\'s offer often comes in higher than you\'d have asked. In Mercury hora, either works; rely on preparation. Match your tactic to the hora live.', hi: 'बृहस्पति होरा में स्वयं प्रारम्भ करें — आपकी संख्या वार्ता को लंगर देती है। शुक्र होरा में प्रतीक्षा करें। बुध होरा में दोनों ठीक।', sa: 'बृहस्पतिहोरायां प्रारम्भः; शुक्रहोरायां प्रतीक्षा।' },
      },
      {
        q: { en: 'Is morning or afternoon better for negotiations?', hi: 'वार्ता के लिए सुबह या दोपहर बेहतर?', sa: 'प्रातर्वा अपराह्णः श्रेष्ठः?' },
        a: { en: 'Mid-morning during Jupiter hora is statistically the sweet spot — the other side\'s decision fatigue is lowest and Jupiter\'s expansive influence is at its peak. Late afternoon during Venus hora is acceptable if the conversation is informal.', hi: 'देर-सुबह बृहस्पति होरा सर्वोत्तम — सामने वाले की निर्णय-थकान न्यूनतम और बृहस्पति का प्रभाव अधिकतम। शुक्र होरा में देर दोपहर ठीक यदि अनौपचारिक।', sa: 'मध्यप्रातर्बृहस्पतिहोरायाम् श्रेष्ठम्।' },
      },
      {
        q: { en: 'Does it matter if the negotiation is over email vs in-person?', hi: 'क्या ईमेल और सामने की वार्ता में अंतर है?', sa: 'विद्युत्पत्रात् साक्षाद्वार्तायाः भेदः किम्?' },
        a: { en: 'For email, the moment of sending matters most — pick the muhurta for that. For in-person or video calls, the moment the call connects matters most. Both follow the same nakshatra/hora rules; the difference is which timestamp you optimise.', hi: 'ईमेल के लिए भेजने का क्षण मायने रखता है; सामने या वीडियो कॉल के लिए कनेक्शन का क्षण। नियम समान।', sa: 'विद्युत्पत्रे प्रेषणक्षणः; साक्षाद्वार्तायां सम्बन्धक्षणः।' },
      },
    ],
    siblings: ['asking_promotion', 'contract_signing', 'job_interview'],
  },

  contract_signing: {
    slug: 'contract-signing',
    name: { en: 'Contract Signing', hi: 'अनुबंध हस्ताक्षर', sa: 'सङ्कल्प-लेख्यपाठः', ta: 'ஒப்பந்தம் கையெழுத்து', te: 'కాంట్రాక్ట్ సంతకం', bn: 'চুক্তি স্বাক্ষর', gu: 'કરાર પર સહી', kn: 'ಒಪ್ಪಂದ ಸಹಿ', mai: 'अनुबंध हस्ताक्षर', mr: 'करार स्वाक्षरी' },
    classicalName: { sanskrit: 'सङ्कल्प-लेख्यपाठः', transliteration: 'Sankalpa-Lekhya-pāṭha' },
    oneLiner: {
      en: 'Signing a contract is the strongest commitment in the career stack — classical sources treat it almost as rigorously as marriage.',
      hi: 'अनुबंध हस्ताक्षर करियर का सबसे दृढ़ सङ्कल्प — शास्त्र इसे लगभग विवाह के समान कठोरता से लेते हैं।',
      sa: 'सङ्कल्पस्य बलिष्ठतमः।',
    },
    classicalRationale: {
      en: 'Of the four Sthira (fixed) nakshatras — Rohini (4), U.Phalguni (12), U.Ashadha (21), U.Bhadrapada (26) — all four are the foundation of the contract-signing preferred list. These are the nakshatras of permanence and reliability, exactly what a binding agreement needs. Pushya (8), Hasta (13), Anuradha (17), and Shravana (22) round out the list with grace and friendship overtones. Mercury hora (writing) leads; Jupiter hora (wisdom behind the commitment) follows; Venus hora (smooth handshake) closes the trio. Bharani (death) and Mula (uprooting) are hard vetoes — signing a contract under either of those nakshatras is classically described as setting the agreement up to fail.',
      hi: 'चार स्थिर नक्षत्रों — रोहिणी, उत्तरा फाल्गुनी, उत्तरा आषाढ़, उत्तरा भाद्रपद — सभी अनुबंध हस्ताक्षर की वरीयता सूची का आधार। ये स्थायित्व और विश्वसनीयता के नक्षत्र हैं। पुष्य, हस्त, अनुराधा, श्रवण इसमें कृपा और मित्रता जोड़ते हैं। बुध होरा (लेखन) सर्वोत्तम; बृहस्पति (सङ्कल्प की बुद्धि); शुक्र (सुगम स्वीकृति)। भरणी (मृत्यु) और मूल (उच्छेद) निरपेक्ष निषेध — इनमें अनुबंध करना शास्त्रीय रूप से उसे विफल होने के लिए तय करने जैसा।',
      sa: 'स्थिरनक्षत्रचतुष्टयं मुख्यम्; भरणी-मूले वर्ज्ये।',
    },
    siblingComparison: {
      en: 'A contract sits at the strict end of the career spectrum — it shares the hard-veto pattern with first-day-at-job (entering a "new home") and business launch. The closest sibling is first-day, but contracts care more about Mercury hora (the document itself) where first-day cares about Sun hora (visibility). Salary negotiation is the unconstrained relative — nothing is binding there.',
      hi: 'अनुबंध करियर वर्णक्रम के कठोर छोर पर — कठोर निषेध का पैटर्न पहले दिन और व्यापार आरम्भ से साझा करता है। पहला दिन निकटतम सम्बन्धी; अनुबंध बुध होरा पर अधिक झुकता है (दस्तावेज), पहला दिन सूर्य होरा पर (दृश्यता)।',
      sa: 'कठोरतमम्; प्रथमदिनाद्व्यापारारम्भात् साम्यम्।',
    },
    whatToAvoid: {
      en: 'Bharani (2) and Mula (19) are the absolute vetoes — never sign here. Avoid Ardra (6), Ashlesha (9), P.Phalguni (11), Jyeshtha (18), P.Ashadha (20), and P.Bhadrapada (25). Skip Rikta tithis (4, 9, 14), Ashtami (8), and Amavasya (30). Vishti karana is a hard veto — wait for the next karana even if everything else looks favourable. Rahu Kaal, Yamaganda, and Gulika Kaal overrule all positive factors.',
      hi: 'भरणी (2) और मूल (19) निरपेक्ष निषेध — कभी हस्ताक्षर न करें। आर्द्रा, आश्लेषा, पूर्व फाल्गुनी, ज्येष्ठा, पूर्व आषाढ़, पूर्व भाद्रपद त्यागें। रिक्ता तिथियाँ, अष्टमी, अमावस्या। विष्टि करण निरपेक्ष निषेध। राहु काल, यमगण्ड, गुलिक काल सभी सकारात्मक कारकों को रद्द करते हैं।',
      sa: 'भरणी-मूले निषेधे; विष्टिकरणं वर्ज्यम्।',
    },
    faqs: [
      {
        q: { en: 'Can I sign a contract during Rahu Kaal if it\'s the only window the other party offers?', hi: 'क्या मैं राहु काल में अनुबंध हस्ताक्षर कर सकता हूँ यदि दूसरा पक्ष केवल वही समय दे?', sa: 'अन्यपक्षः केवलं राहुकालमेव दत्ते चेत् हस्ताक्षरं कर्तव्यम् वा?' },
        a: { en: 'Classical sources are unambiguous: no. If the other party insists, this is itself a quiet signal worth heeding — counter-propose a window 90 minutes earlier or later. If you genuinely cannot move it, sign provisionally and have a re-signing ceremony in a favourable window later. The first signature is what matters classically.', hi: 'शास्त्र स्पष्ट: नहीं। यदि दूसरा पक्ष आग्रह करे, यह स्वयं एक मौन संकेत — 90 मिनट पहले या बाद का सुझाव दें। यदि वास्तव में नहीं हटा सकें, अनन्तिम हस्ताक्षर और बाद में अनुकूल समय में पुनर्हस्ताक्षर। पहला हस्ताक्षर शास्त्रीय रूप से महत्वपूर्ण।', sa: 'न; शास्त्रं स्पष्टम्।' },
      },
      {
        q: { en: 'Does it matter where I sign — at home, at the office, in a notary?', hi: 'क्या यह मायने रखता है कि मैं कहाँ हस्ताक्षर करता हूँ — घर, कार्यालय, नोटरी?', sa: 'गृहे कार्यालये नोटरीस्थाने वा हस्ताक्षरस्य भेदः किम्?' },
        a: { en: 'Place matters less than time for classical muhurta purposes. The act of signing IS the moment — the location is the container. That said, signing in a direction favoured by your day\'s Disha Shool is conventionally avoided; check your panchang.', hi: 'समय की तुलना में स्थान कम महत्वपूर्ण। हस्ताक्षर का कार्य ही क्षण — स्थान केवल पात्र। दिशा शूल की दिशा में हस्ताक्षर न करें।', sa: 'कालः मुख्यः; स्थानं गौणम्।' },
      },
      {
        q: { en: 'My job offer requires acceptance by a specific date. How do I balance that with muhurta?', hi: 'मेरा नौकरी प्रस्ताव निर्धारित तिथि तक स्वीकार्य है। मुहूर्त के साथ संतुलन कैसे?', sa: 'मम कार्यप्रस्तावस्य कालसीमा अस्ति; मुहूर्तेन सह सन्तुलनं कथम्?' },
        a: { en: 'Look at the next 30 days through the per-activity calendar on this page — even within a 7-day window there is usually one window of "good" or higher. If absolutely no good window exists before the deadline, sign in the least-bad slot (avoiding Rahu Kaal and Vishti at minimum) and treat the first day at the new job as your real muhurta.', hi: 'इस पृष्ठ पर 30-दिन कैलेंडर देखें — 7-दिन में भी सामान्यतः एक "अच्छा" या उच्च अवधि मिलती है। यदि कोई अच्छी अवधि न हो, कम से कम राहु काल और विष्टि टालकर हस्ताक्षर करें और पहले दिन को असली मुहूर्त मानें।', sa: 'सर्वोत्तममपश्यन् दोषरहितं स्वीकुर्यात्।' },
      },
    ],
    siblings: ['first_day_at_job', 'salary_negotiation', 'business_launch'],
  },

  first_day_at_job: {
    slug: 'first-day-at-job',
    name: { en: 'First Day at New Job', hi: 'नई नौकरी का पहला दिन', sa: 'नवकार्यप्रवेशः', ta: 'புதிய வேலையின் முதல் நாள்', te: 'కొత్త ఉద్యోగంలో మొదటి రోజు', bn: 'নতুন চাকরির প্রথম দিন', gu: 'નવી નોકરીનો પ્રથમ દિવસ', kn: 'ಹೊಸ ಉದ್ಯೋಗದ ಮೊದಲ ದಿನ', mai: 'नई नौकरीक पहिल दिन', mr: 'नवीन नोकरीचा पहिला दिवस' },
    classicalName: { sanskrit: 'नवकार्य-प्रवेशः', transliteration: 'Navakārya-praveśa' },
    oneLiner: {
      en: 'Your first day at a new job is a figurative Gṛha-praveśa — entering a new "home" you\'ll spend many waking hours inside.',
      hi: 'नई नौकरी का पहला दिन एक प्रतीकात्मक गृह-प्रवेश — एक नए "घर" में प्रवेश जिसमें आप कई जागृत घंटे बिताएंगे।',
      sa: 'नवगृहप्रवेशवत्।',
    },
    classicalRationale: {
      en: 'Gṛha-praveśa rules carry across directly — Sthira (fixed) nakshatras dominate because the act is one of taking up residence in a place that should hold you steadily. Rohini (4), U.Phalguni (12), U.Ashadha (21), U.Bhadrapada (26) are the foundation. Pushya (8), Hasta (13), Anuradha (17), Shravana (22), Revati (27) add auspicious arrival overtones. Jupiter hora is the strongest (auspicious entry); Sun hora adds visibility (your new colleagues notice you); Mercury hora helps introductions land. Bharani and Mula are hard vetoes — same as contract signing.',
      hi: 'गृह-प्रवेश के नियम सीधे लागू — स्थिर नक्षत्र प्रधान, क्योंकि यह कार्य ऐसे स्थान में निवास लेने का है जो आपको स्थिरता से धारण करे। रोहिणी, उत्तरा फाल्गुनी, उत्तरा आषाढ़, उत्तरा भाद्रपद आधार। पुष्य, हस्त, अनुराधा, श्रवण, रेवती शुभ आगमन जोड़ते हैं। बृहस्पति होरा सर्वोत्तम; सूर्य होरा दृश्यता; बुध होरा परिचय। भरणी और मूल निरपेक्ष निषेध।',
      sa: 'स्थिरनक्षत्राणि मूलम्; भरणीमूलयोः निषेधः।',
    },
    siblingComparison: {
      en: 'Closely related to contract signing — both require Sthira nakshatras and both hard-veto Bharani/Mula. The difference is in the planetary tonal layer: contract signing leans on Mercury (the document), first day leans on Sun (your visible arrival). The other sibling is business launch, which adds broader auspicious factors because a business needs to attract customers, not just an employer.',
      hi: 'अनुबंध हस्ताक्षर से निकट सम्बन्ध — दोनों स्थिर नक्षत्र मांगते हैं और भरणी/मूल निषिद्ध। अंतर ग्रहीय स्वर में: अनुबंध बुध (दस्तावेज) पर झुकता है, पहला दिन सूर्य (आपका प्रकट आगमन) पर।',
      sa: 'अनुबन्धात् सूर्यधारः; मूले समानम्।',
    },
    whatToAvoid: {
      en: 'Bharani (2) and Mula (19) are absolute — no starting under either. Avoid Ardra (6), Ashlesha (9), P.Phalguni (11), Jyeshtha (18), P.Ashadha (20), P.Bhadrapada (25). Skip Tuesday (Mars — conflict with new authority) and Saturday (Saturn — delays in settling in). Rikta tithis and Amavasya. Vishti karana hard-blocks any window it overlaps.',
      hi: 'भरणी (2) और मूल (19) निरपेक्ष — किसी में आरम्भ नहीं। आर्द्रा, आश्लेषा, पूर्व फाल्गुनी, ज्येष्ठा, पूर्व आषाढ़, पूर्व भाद्रपद त्यागें। मंगलवार (मंगल — नए अधिकार से संघर्ष) और शनिवार (शनि — स्थापन में विलंब)। रिक्ता तिथियाँ और अमावस्या। विष्टि करण अवरोधक।',
      sa: 'भरणी-मूले निषेधे; मङ्गल-शनिवारौ वर्ज्यौ।',
    },
    faqs: [
      {
        q: { en: 'Does my first day mean the date or the time I walk in?', hi: 'क्या मेरा पहला दिन तिथि का अर्थ है या प्रवेश का समय?', sa: 'प्रथमदिनं तिथिः वा प्रवेशसमयः?' },
        a: { en: 'Both, but the time you physically enter the workplace (or log in remotely) is the operative muhurta moment. The classical sources treat the praveśa — the act of entering — as the marker. Optimise that timestamp.', hi: 'दोनों, परन्तु जब आप शारीरिक रूप से कार्यस्थल में प्रवेश करते हैं (या दूरस्थ रूप से लॉग इन करते हैं) वह क्रियाशील मुहूर्त क्षण। शास्त्र प्रवेश के कार्य को चिह्न मानते हैं।', sa: 'प्रवेशक्षणः मुख्यः।' },
      },
      {
        q: { en: 'I\'m starting remotely. Does muhurta still apply?', hi: 'मैं दूरस्थ रूप से शुरू कर रहा हूँ। क्या मुहूर्त अभी भी लागू है?', sa: 'दूरस्थप्रारम्भे मुहूर्तः प्रवृत्तः वा?' },
        a: { en: 'Yes. The praveśa is a transition of consciousness, not just a physical step. Logging in for the first time, joining the first call, sending the first work message — pick whichever feels most ceremonial to you and time it favourably.', hi: 'हाँ। प्रवेश चेतना का संक्रमण है, केवल शारीरिक कदम नहीं। पहली बार लॉग इन करना, पहली कॉल में शामिल होना, पहला कार्य सन्देश भेजना — जो भी सबसे औपचारिक लगे।', sa: 'चेतसः सङ्क्रमणं मुख्यम्।' },
      },
      {
        q: { en: 'Should I bring anything specific for an auspicious first day?', hi: 'क्या मुझे शुभ पहले दिन के लिए कुछ विशेष लाना चाहिए?', sa: 'शुभप्रथमदिनाय विशेषं किम्?' },
        a: { en: 'Some traditions recommend a small sacred object (a coin, a tulsi leaf, a piece of dried turmeric) carried in the wallet or pocket on the first day. This is optional but harmless. The classical priority is the timing.', hi: 'कुछ परम्पराएँ पहले दिन पर्स या जेब में एक छोटी पवित्र वस्तु (सिक्का, तुलसी पत्र, सूखी हल्दी) रखने की संस्तुति करती हैं। यह वैकल्पिक। शास्त्रीय प्राथमिकता समय है।', sa: 'सङ्केतवस्तुः ऐच्छिकम्; कालः प्राथमिकः।' },
      },
    ],
    siblings: ['contract_signing', 'job_interview', 'business_launch'],
  },

  resignation: {
    slug: 'resignation',
    name: { en: 'Resignation', hi: 'त्यागपत्र', sa: 'त्यागसङ्कल्पः', ta: 'ராஜினாமா', te: 'రాజీనామా', bn: 'পদত্যাগ', gu: 'રાજીનામું', kn: 'ರಾಜೀನಾಮೆ', mai: 'त्यागपत्र', mr: 'राजीनामा' },
    classicalName: { sanskrit: 'त्याग-सङ्कल्पः', transliteration: 'Tyāga-saṅkalpa' },
    oneLiner: {
      en: 'Handing in your notice is the rare career act where "ending-friendly" nakshatras are the favourable ones — the inversion of every other career muhurta.',
      hi: 'त्यागपत्र देना ऐसा दुर्लभ करियर कार्य है जहाँ "समाप्ति-अनुकूल" नक्षत्र अनुकूल हैं — हर अन्य करियर मुहूर्त का व्युत्क्रम।',
      sa: 'त्यागकाले समाप्तिनक्षत्राणि अनुकूलानि।',
    },
    classicalRationale: {
      en: 'Muhurtha Ch. 13 explicitly addresses tyāga (renunciation) muhurtas: the nakshatras to seek are those classically associated with conclusion. Bharani (2 — Yama, the lord of endings), Ardra (6 — destruction of the old), Ashlesha (9 — release), Jyeshtha (18 — the conclusion of eldership), and Mula (19 — uprooting) become favourable here, not vetoes. Hasta (13) supports graceful execution of the act itself. Tuesday (Mars — separation) and Saturday (Saturn — completion) are the favoured weekdays. Saturn hora is the strongest planetary support; Mars hora supports the act of cutting; Mercury hora helps the resignation letter itself.',
      hi: 'मुहूर्त अध्याय 13 त्याग मुहूर्तों को स्पष्ट रूप से सम्बोधित करता है: खोजने के लिए नक्षत्र वे हैं जो शास्त्रीय रूप से समाप्ति से जुड़े हैं। भरणी (यम, समाप्ति के स्वामी), आर्द्रा (पुराने का विनाश), आश्लेषा (मुक्ति), ज्येष्ठा (वरिष्ठता का अंत), मूल (उच्छेद) यहाँ अनुकूल, निषेध नहीं। हस्त कार्य के सुगम क्रियान्वयन में सहायक। मंगलवार (मंगल — पृथक्करण) और शनिवार (शनि — पूर्णता) वरीयता वार। शनि होरा सर्वोत्तम।',
      sa: 'भरणी-आर्द्रा-आश्लेषा-ज्येष्ठा-मूलाः त्यागकाले अनुकूलाः।',
    },
    siblingComparison: {
      en: 'Resignation is the inversion of every other career activity in this set. Where job interview seeks Pushya and Hasta, resignation seeks Bharani and Mula. Where first-day seeks Sthira nakshatras for permanence, resignation seeks Chara (moving) and Tikshna (cutting) nakshatras. There is no close sibling — this stands alone. The closest cousin is medical surgery, which also seeks Mula and Ardra under the same "cutting" logic.',
      hi: 'त्यागपत्र इस समूह के हर अन्य करियर कार्य का व्युत्क्रम। जहाँ इंटरव्यू पुष्य-हस्त खोजता है, त्यागपत्र भरणी-मूल खोजता है। कोई निकट सम्बन्धी नहीं — यह अकेला है। शल्य चिकित्सा निकटतम भाई जो उसी "कटाई" तर्क से मूल-आर्द्रा खोजती है।',
      sa: 'अनन्यः; शल्यकर्म तुल्यम्।',
    },
    whatToAvoid: {
      en: 'Auspicious "beginning" nakshatras are exactly wrong here — avoid Rohini (4), Pushya (8), U.Phalguni (12), Anuradha (17), U.Ashadha (21), Revati (27). Pratipada (1), Panchami (5), Dashami (10), Ekadashi (11), and Purnima (15) are the new-beginning tithis to skip. Wednesday (Mercury — bonding) and Thursday (Jupiter — expansion) are not ideal because they want to grow, not conclude.',
      hi: 'शुभ "आरम्भ" नक्षत्र यहाँ बिल्कुल गलत — रोहिणी, पुष्य, उत्तरा फाल्गुनी, अनुराधा, उत्तरा आषाढ़, रेवती त्यागें। प्रतिपदा, पञ्चमी, दशमी, एकादशी, पूर्णिमा त्यागें। बुधवार (बुध — बंधन) और गुरुवार (बृहस्पति — विस्तार) आदर्श नहीं।',
      sa: 'आरम्भनक्षत्राणि वर्ज्यानि।',
    },
    faqs: [
      {
        q: { en: 'Isn\'t Bharani (Yama) inauspicious? Why is it good for resignation?', hi: 'क्या भरणी (यम) अशुभ नहीं है? यह त्यागपत्र के लिए अच्छा क्यों है?', sa: 'भरणी अशुभा; त्यागे श्रेष्ठा कथम्?' },
        a: { en: 'Yama is the lord of dharmic endings, not destruction. Bharani is "inauspicious" for activities that need to live and grow — interviews, contracts, first days. But for an activity that explicitly seeks to end a phase with dignity, Bharani\'s ending-energy is the right tone. Classical sources are explicit on this — it\'s not a contradiction.', hi: 'यम धार्मिक समाप्ति के स्वामी हैं, विनाश के नहीं। भरणी उन कार्यों के लिए "अशुभ" है जिन्हें जीना और बढ़ना है। एक अवस्था को गरिमा से समाप्त करने वाले कार्य के लिए भरणी की समाप्ति-ऊर्जा सही स्वर। शास्त्र इस पर स्पष्ट।', sa: 'यमः धर्म्यान्तस्य अधिपः, न विनाशस्य।' },
      },
      {
        q: { en: 'Should I resign on a Saturday?', hi: 'क्या मुझे शनिवार को त्यागपत्र देना चाहिए?', sa: 'शनिवारे त्यागपत्रं देयम् वा?' },
        a: { en: 'Yes, Saturday is one of the strongest days for resignation. Saturn governs completion and the dignified closing of one chapter before another begins. Tuesday is the other strong choice (Mars governs the cleanness of the cut). Friday and Wednesday are best avoided for resignation specifically.', hi: 'हाँ, शनिवार त्यागपत्र के लिए सबसे मजबूत दिनों में से एक। शनि पूर्णता और एक अध्याय के गरिमामय समापन के अधिपति। मंगलवार अन्य मजबूत विकल्प। शुक्रवार और बुधवार त्यागपत्र के लिए विशेष रूप से त्यागें।', sa: 'शनिवारः श्रेष्ठः; मङ्गलवारः अपि।' },
      },
      {
        q: { en: 'Does muhurta apply to verbal resignation or only to the written letter?', hi: 'क्या मुहूर्त मौखिक त्यागपत्र पर लागू है या केवल लिखित पत्र पर?', sa: 'मुहूर्तः मौखिकत्यागे प्रवृत्तः वा केवलं लिखिते?' },
        a: { en: 'Both — but classical sources weight the moment of formal declaration (the "I am leaving" statement, verbal or written) more than the moment the news is read by the manager. Time your declaration, not the manager\'s reaction.', hi: 'दोनों — परन्तु शास्त्र औपचारिक घोषणा के क्षण को (मौखिक या लिखित) प्रबंधक द्वारा पढ़े जाने से अधिक भार देते हैं। अपनी घोषणा का समय निर्धारित करें।', sa: 'घोषणाक्षणः मुख्यः।' },
      },
    ],
    siblings: ['first_day_at_job', 'contract_signing', 'asking_promotion'],
  },

  business_launch: {
    slug: 'business-launch',
    name: { en: 'Business Launch', hi: 'व्यापार आरम्भ', sa: 'व्यापार-आरम्भः', ta: 'வியாபார ஆரம்பம்', te: 'వ్యాపార ప్రారంభం', bn: 'ব্যবসা শুরু', gu: 'વ્યવસાય શરૂઆત', kn: 'ವ್ಯಾಪಾರ ಪ್ರಾರಂಭ', mai: 'व्यापार आरम्भ', mr: 'व्यवसाय सुरुवात' },
    classicalName: { sanskrit: 'व्यापार-आरम्भः', transliteration: 'Vyāpāra-ārambha' },
    oneLiner: {
      en: 'Launching a new business is the broadest career muhurta — it must please customers, partners, employees, regulators, and the universe all at once.',
      hi: 'नया व्यापार आरम्भ करना सबसे व्यापक करियर मुहूर्त — इसे ग्राहकों, साझेदारों, कर्मचारियों, नियामकों और ब्रह्माण्ड सबको एक साथ प्रसन्न करना है।',
      sa: 'व्यापारारम्भः व्यापकतमः।',
    },
    classicalRationale: {
      en: 'Vyāpāra-ārambha appears explicitly in Muhurta Chintamani Ch. 4. The preferred nakshatra set is broader than any other career activity because a business needs every kind of support: Rohini (4) for wealth, Mrigashira (5) for curiosity from customers, Punarvasu (7) for renewal, Pushya (8) for prosperity, U.Phalguni (12) for permanence, Hasta (13) for craft, Chitra (14) for visibility, Swati (15) for flexibility, Anuradha (17) for partnerships, U.Ashadha (21) for invincibility, Shravana (22) for word-of-mouth, Dhanishtha (23) for wealth accumulation, U.Bhadrapada (26) for endurance, Revati (27) for completion. Jupiter hora (expansion) leads; Mercury hora (commerce); Venus hora (customer attraction). Bharani and Mula are absolute vetoes — a business launched there is classically said to "die in its first year."',
      hi: 'व्यापार-आरम्भ मुहूर्त चिन्तामणि अध्याय 4 में स्पष्ट रूप से। वरीयता नक्षत्र सेट किसी अन्य करियर कार्य से अधिक व्यापक — व्यापार को हर प्रकार के समर्थन की आवश्यकता: रोहिणी (धन), मृगशिरा (ग्राहक उत्सुकता), पुनर्वसु (नवीकरण), पुष्य (समृद्धि), उत्तरा फाल्गुनी (स्थायित्व), हस्त (शिल्प), चित्रा (दृश्यता), स्वाति (लचीलापन), अनुराधा (साझेदारी), उत्तरा आषाढ़ (अजेयता), श्रवण (प्रसिद्धि), धनिष्ठा (धन-सञ्चय), उत्तरा भाद्रपद (सहनशीलता), रेवती (पूर्णता)। बृहस्पति होरा सर्वोत्तम; बुध, शुक्र। भरणी और मूल निरपेक्ष निषेध — वहाँ आरम्भ व्यापार शास्त्रीय रूप से "पहले वर्ष में मर जाता है।"',
      sa: 'व्यापकं नक्षत्रसेटम्; भरणी-मूले अत्यन्तं वर्ज्ये।',
    },
    siblingComparison: {
      en: 'Business launch overlaps with contract signing (both hard-veto Bharani and Mula, both want Sthira nakshatras) but draws on a broader nakshatra set because a business serves more constituencies. The closest cousin is first-day-at-job — both are figurative entries into a new space — but business launch needs the customer-attraction layer (Venus + Chitra + Swati) that first-day doesn\'t.',
      hi: 'व्यापार आरम्भ अनुबंध हस्ताक्षर से ओवरलैप — दोनों भरणी-मूल का कठोर निषेध, दोनों स्थिर नक्षत्र चाहते हैं। पहले दिन निकटतम सम्बन्धी — दोनों नई अंतरिक्ष में प्रतीकात्मक प्रवेश — परन्तु व्यापार आरम्भ को ग्राहक-आकर्षण परत (शुक्र-चित्रा-स्वाति) चाहिए।',
      sa: 'अनुबन्धव्यापारयोः सादृश्यम्; ग्राहकाकर्षणं विशिष्टम्।',
    },
    whatToAvoid: {
      en: 'Bharani (2) and Mula (19) — absolute vetoes. Avoid Ashwini (1 — too impulsive for a venture that needs years to mature), Ardra (6), Ashlesha (9), P.Phalguni (11), Jyeshtha (18), and P.Bhadrapada (25). Skip Rikta tithis, Ashtami (8), and Amavasya (30). Tuesday is conventionally avoided for new business — Mars\'s aggression can sour partnerships.',
      hi: 'भरणी और मूल — निरपेक्ष निषेध। अश्विनी (बहुत आवेगी), आर्द्रा, आश्लेषा, पूर्व फाल्गुनी, ज्येष्ठा, पूर्व भाद्रपद त्यागें। रिक्ता तिथियाँ, अष्टमी, अमावस्या। मंगलवार पारम्परिक रूप से नए व्यापार के लिए वर्जित।',
      sa: 'अश्विनी-आर्द्रा-आश्लेषाः वर्ज्याः; मङ्गलवारः अपि।',
    },
    faqs: [
      {
        q: { en: 'Does the muhurta apply to incorporation date, opening day, or first sale?', hi: 'क्या मुहूर्त निगमन तिथि, उद्घाटन दिवस या पहली बिक्री पर लागू है?', sa: 'मुहूर्तः निगमने उद्घाटने प्रथमविक्रये वा प्रवृत्तः?' },
        a: { en: 'All three are valid muhurta moments. Classical sources weight whichever you treat ceremonially as "the start." For most modern businesses, the day you make your first transaction or take your first customer is the operative muhurta — that\'s when the business begins to live.', hi: 'तीनों मान्य मुहूर्त क्षण। शास्त्र उसे अधिक भार देते हैं जिसे आप औपचारिक रूप से "आरम्भ" मानते हैं। अधिकांश आधुनिक व्यापारों के लिए पहला लेनदेन या पहला ग्राहक क्रियाशील मुहूर्त।', sa: 'त्रयो वैधाः; प्रथमव्यवहारः प्रायः मुख्यः।' },
      },
      {
        q: { en: 'Should I launch on Diwali for the auspicious significance?', hi: 'क्या मुझे शुभ महत्व के लिए दिवाली पर लॉन्च करना चाहिए?', sa: 'दीपावल्यां प्रारम्भः उत्तमः किम्?' },
        a: { en: 'Diwali is excellent for an existing business to ceremonially renew (Lakshmi puja, accounts blessing) but not classically the strongest for a NEW launch — the energy is collective festival, not focused beginning. The day after Diwali (Bestu Varas / Vikram Samvat new year) is much stronger for new ventures. Or pick a Pushya Nakshatra date in the calendar.', hi: 'दिवाली विद्यमान व्यापार के औपचारिक नवीकरण के लिए उत्तम (लक्ष्मी पूजा, खाता आशीर्वाद) परन्तु नए लॉन्च के लिए शास्त्रीय रूप से सर्वोत्तम नहीं। दिवाली के अगले दिन (बेस्तु वरस / विक्रम संवत् नववर्ष) नए उद्यमों के लिए अधिक मजबूत।', sa: 'दीपावल्याः परदिनम् व्यापारारम्भाय श्रेष्ठतरम्।' },
      },
      {
        q: { en: 'Is solo founder vs co-founders different from a muhurta standpoint?', hi: 'क्या एकल संस्थापक और सह-संस्थापक मुहूर्त दृष्टि से भिन्न हैं?', sa: 'एकलसंस्थापकः सहसंस्थापकैः च मुहूर्ततः भिन्नौ?' },
        a: { en: 'Co-founder ventures should additionally check Anuradha and Vishakha nakshatras (partnership-favourable) on the launch day. Solo ventures can lean more on Hasta and U.Phalguni (independent craft + permanence). The hard vetoes (Bharani, Mula) apply identically.', hi: 'सह-संस्थापक उद्यमों को लॉन्च दिवस पर अनुराधा और विशाखा (साझेदारी-अनुकूल) नक्षत्र अतिरिक्त जाँचने चाहिए। एकल उद्यम हस्त और उत्तरा फाल्गुनी पर अधिक झुक सकते हैं। निषेध समान।', sa: 'सहसंस्थापने अनुराधाविशाखे विशेषे।' },
      },
    ],
    siblings: ['contract_signing', 'first_day_at_job', 'asking_promotion'],
  },

  asking_promotion: {
    slug: 'asking-promotion',
    name: { en: 'Asking for Promotion', hi: 'पदोन्नति अनुरोध', sa: 'अधिकार-वृद्धिः', ta: 'பதவி உயர்வு கோரிக்கை', te: 'ప్రమోషన్ అభ్యర్థన', bn: 'পদোন্নতির অনুরোধ', gu: 'બઢતી માટે વિનંતી', kn: 'ಬಡ್ತಿ ಮನವಿ', mai: 'पदोन्नति अनुरोध', mr: 'बढतीची विनंती' },
    classicalName: { sanskrit: 'अधिकार-वृद्धिः', transliteration: 'Adhikāra-vṛddhi' },
    oneLiner: {
      en: 'Asking for a promotion is a request for elevation — a Sun-and-Jupiter activity classically tied to Adhikāra-vṛddhi (expansion of one\'s authority).',
      hi: 'पदोन्नति अनुरोध — सूर्य और बृहस्पति का कार्य, अधिकार-वृद्धि से शास्त्रीय रूप से सम्बद्ध।',
      sa: 'अधिकारवृद्धिः सूर्य-बृहस्पतिकार्यम्।',
    },
    classicalRationale: {
      en: 'Among career activities, asking for promotion uniquely adds Magha (10) to the preferred nakshatra list. Magha represents the throne, lineage, and elevated position — classical sources (Muhurtha Ch. 13) specifically favour it for matters of rank. Rohini (4), Pushya (8), U.Phalguni (12), Hasta (13), Anuradha (17), U.Ashadha (21), Shravana (22), U.Bhadrapada (26) complete the set. Sun (authority) and Jupiter (expansion) are the dominant horas — the activity wants both visibility and expansive favour. Sunday (Sun\'s day), Wednesday (communication), and Thursday (Jupiter) are the strongest weekdays.',
      hi: 'करियर कार्यों में पदोन्नति अनुरोध अद्वितीय रूप से मघा (10) को वरीयता सूची में जोड़ता है। मघा सिंहासन, वंश और उच्च पद का प्रतिनिधित्व करती है — शास्त्र (मुहूर्त अध्याय 13) पद के मामलों में विशेष रूप से इसकी संस्तुति करते हैं। रोहिणी, पुष्य, उत्तरा फाल्गुनी, हस्त, अनुराधा, उत्तरा आषाढ़, श्रवण, उत्तरा भाद्रपद सेट पूरा करते हैं। सूर्य (अधिकार) और बृहस्पति (विस्तार) प्रबल होरा। रविवार (सूर्य), बुधवार (संचार), गुरुवार (बृहस्पति) सर्वोत्तम वार।',
      sa: 'मघा विशेषेण; सूर्य-बृहस्पती प्रबलौ।',
    },
    siblingComparison: {
      en: 'Asking for promotion sits between salary negotiation (Venus + Jupiter) and job interview (Mercury + Jupiter), drawing on Sun where neither sibling does. The closest sibling is salary negotiation — they often happen back-to-back, since a promotion usually carries a raise. But promotion adds the visibility/authority layer that pure negotiation lacks.',
      hi: 'पदोन्नति अनुरोध वेतन वार्ता (शुक्र-बृहस्पति) और इंटरव्यू (बुध-बृहस्पति) के बीच — सूर्य जोड़ता है जहाँ कोई अन्य नहीं करता। वेतन वार्ता निकटतम सम्बन्धी — अक्सर साथ-साथ होती हैं।',
      sa: 'धनार्जनात् सूर्यधारः; साक्षात्कारात् मघाधारः।',
    },
    whatToAvoid: {
      en: 'Avoid Ashwini (1), Bharani (2), Ardra (6), Ashlesha (9), P.Phalguni (11), Jyeshtha (18 — direct lineage conflict for a promotion request), Mula (19), P.Ashadha (20), P.Bhadrapada (25). Rikta tithis and Amavasya. Tuesday is poor — Mars can make the request feel demanding rather than deserved. The window must clear Rahu Kaal/Yamaganda/Gulika and avoid Vishti karana.',
      hi: 'अश्विनी, भरणी, आर्द्रा, आश्लेषा, पूर्व फाल्गुनी, ज्येष्ठा (पदोन्नति अनुरोध के लिए सीधा वंश संघर्ष), मूल, पूर्व आषाढ़, पूर्व भाद्रपद त्यागें। रिक्ता तिथियाँ और अमावस्या। मंगलवार खराब — मंगल अनुरोध को अर्जित के बजाय मांग जैसा बना देता है।',
      sa: 'अश्विनी-भरणी-आर्द्रा-आश्लेषा-ज्येष्ठाः वर्ज्याः।',
    },
    faqs: [
      {
        q: { en: 'Is performance-review day or a separate one-on-one the right moment?', hi: 'क्या प्रदर्शन समीक्षा दिवस या अलग एक-पर-एक सही क्षण?', sa: 'समीक्षादिनम् वा एकैकसंवादः उत्तमः?' },
        a: { en: 'A scheduled performance review is when the system expects the conversation, but a separate one-on-one in a Sun-or-Jupiter hora on a Magha/Pushya day often lands better — the manager hears your case in a moment of expansive favour rather than a context where they\'re comparing you to everyone else. If both are options, pick the one-on-one with the better muhurta.', hi: 'निर्धारित प्रदर्शन समीक्षा वह समय जब प्रणाली बातचीत की अपेक्षा करती है, परन्तु मघा/पुष्य दिन सूर्य/बृहस्पति होरा में अलग एक-पर-एक अक्सर बेहतर — प्रबंधक आपकी दलील विस्तृत अनुकूलता के क्षण में सुनता है।', sa: 'एकैकसंवादः मघा-पुष्ययोः श्रेष्ठतरः।' },
      },
      {
        q: { en: 'Should I ask in writing or in person?', hi: 'क्या मुझे लिखित में या सामने अनुरोध करना चाहिए?', sa: 'लेखेन वा साक्षात् पृच्छेयम्?' },
        a: { en: 'In person is classically stronger for promotion — Sun rules visibility, and a face-to-face request lets your authority register directly. Writing is fine as follow-up but the operative muhurta is the in-person ask. If your culture is fully written/async, optimise the message-send time.', hi: 'सामने शास्त्रीय रूप से मजबूत — सूर्य दृश्यता का स्वामी, आमने-सामने अनुरोध आपके अधिकार को सीधे पंजीकृत करता है। लिखित अनुसरण के रूप में ठीक।', sa: 'साक्षात्कारः बलिष्ठतरः।' },
      },
      {
        q: { en: 'What if I have been waiting years for this promotion?', hi: 'क्या यदि मैं इस पदोन्नति के लिए वर्षों से प्रतीक्षा कर रहा हूँ?', sa: 'बहुवर्षाणि प्रतीक्षायां सत्यां किम्?' },
        a: { en: 'Long-pending promotions especially benefit from a Magha + Sun hora window — the alignment helps the conversation be heard as overdue recognition rather than premature ambition. Saturday muhurtas (Saturn — accumulated time) can also work here, where they\'d be weak for a fresh interview.', hi: 'लम्बित पदोन्नति विशेष रूप से मघा + सूर्य होरा अवधि से लाभान्वित होती हैं — संरेखण बातचीत को अतिदेय मान्यता के रूप में सुनने में मदद करता है। शनिवार मुहूर्त भी काम कर सकते हैं।', sa: 'दीर्घप्रतीक्षायां मघा-सूर्यहोरा विशेषेण।' },
      },
    ],
    siblings: ['salary_negotiation', 'job_interview', 'contract_signing'],
  },

};

/** Reverse lookup: URL slug → activity ID. */
export const SLUG_TO_ACTIVITY: Record<string, CareerActivityId> = Object.fromEntries(
  (Object.entries(CAREER_CONTENT) as Array<[CareerActivityId, CareerContent]>)
    .map(([id, content]) => [content.slug, id]),
);
